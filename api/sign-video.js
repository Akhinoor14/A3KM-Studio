/**
 * api/sign-video.js — Vercel Serverless Function
 * POST /api/sign-video
 * Body: { cfVideoId: string, userToken: string }
 * Returns: { iframeUrl: string }
 *
 * Flow:
 *   1. Verify Firebase ID token (server-side, never trust client)
 *   2. Check Firestore access/{uid}.courses includes the requested cfVideoId
 *      OR the user is admin
 *   3. Call Cloudflare Stream token API → short-lived signed token (15 min)
 *   4. Return the signed iframe URL
 */

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth }                       from 'firebase-admin/auth';
import { getFirestore }                  from 'firebase-admin/firestore';

// ─── Firebase Admin init (lazy singleton) ────────────────
function getAdminApp() {
  if (getApps().length) return getApps()[0];
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  return initializeApp({ credential: cert(serviceAccount) });
}

// ─── Helpers ─────────────────────────────────────────────
function jsonRes(res, status, body) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');
  return res.status(status).json(body);
}

function corsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin',  '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

// ─── Cloudflare Stream: get signed token (exp 15 min) ────
async function getCFSignedToken(cfVideoId) {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken  = process.env.CLOUDFLARE_STREAM_TOKEN;

  const exp = Math.floor(Date.now() / 1000) + 900; // 15 minutes

  const cfRes = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/stream/${cfVideoId}/token`,
    {
      method:  'POST',
      headers: {
        Authorization: `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ exp }),
    }
  );

  if (!cfRes.ok) {
    const txt = await cfRes.text();
    throw new Error(`Cloudflare API error ${cfRes.status}: ${txt}`);
  }

  const cfData = await cfRes.json();
  if (!cfData.success || !cfData.result?.token) {
    throw new Error('Cloudflare token generation failed: ' + JSON.stringify(cfData.errors));
  }

  // Use customer subdomain if available, fallback to generic
  // The token itself authorises playback — subdomain is cosmetic
  return `https://watch.cloudflarestream.com/${cfData.result.token}/iframe`;
}

// ─── Main handler ─────────────────────────────────────────
export default async function handler(req, res) {
  corsHeaders(res);

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST')    return jsonRes(res, 405, { error: 'Method not allowed' });

  const { cfVideoId, contentId, contentType, userToken } = req.body || {};

  if (!cfVideoId || typeof cfVideoId !== 'string' || cfVideoId.length > 256) {
    return jsonRes(res, 400, { error: 'Missing or invalid cfVideoId' });
  }
  if (!userToken || typeof userToken !== 'string') {
    return jsonRes(res, 400, { error: 'Missing userToken' });
  }

  // Env var check
  if (!process.env.FIREBASE_SERVICE_ACCOUNT || !process.env.CLOUDFLARE_STREAM_TOKEN || !process.env.CLOUDFLARE_ACCOUNT_ID) {
    console.error('[sign-video] Missing required environment variables');
    return jsonRes(res, 500, { error: 'Server configuration error' });
  }

  try {
    const app   = getAdminApp();
    const auth  = getAuth(app);
    const db    = getFirestore(app);
    // Support comma-separated ADMIN_EMAILS env var, or fall back to single ADMIN_EMAIL
    const adminEmails = (process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL || 'a3kmstudio@gmail.com')
                          .split(',').map(e => e.trim()).filter(Boolean);

    // 1. Verify Firebase ID token
    let decoded;
    try {
      decoded = await auth.verifyIdToken(userToken);
    } catch {
      return jsonRes(res, 401, { error: 'Invalid or expired user token' });
    }

    const uid   = decoded.uid;
    const email = decoded.email || '';

    // 2. Admin always gets access
    if (!adminEmails.includes(email)) {
      // Check Firestore access document
      const accessDoc = await db.collection('access').doc(uid).get();
      const accessData = accessDoc.data() || {};

      // idToCheck: use the content item ID (e.g. 'course-arduino-001') for access lookup.
      // contentId is sent by the client; fall back to cfVideoId only if not provided.
      const idToCheck   = (contentId && typeof contentId === 'string' && contentId.length <= 256)
                          ? contentId
                          : cfVideoId;
      const listKey     = contentType === 'book'    ? 'books'
                        : contentType === 'paper'   ? 'papers'
                        : contentType === 'project' ? 'projects'
                        :                             'courses';

      const directGranted = (accessData[listKey] || []).includes(idToCheck);

      if (!directGranted) {
        // Also check combo access ─ resolve combo items
        let comboGranted = false;
        const comboIds = accessData.combos || [];
        if (comboIds.length) {
          for (const comboId of comboIds) {
            const comboDoc = await db.collection('combos').doc(comboId).get();
            const comboItems = comboDoc.data()?.items || [];
            if (comboItems.some(it => it.id === idToCheck)) {
              comboGranted = true;
              break;
            }
          }
        }
        if (!comboGranted) {
          return jsonRes(res, 403, { error: 'Access denied — no active subscription for this content' });
        }
      }
    }

    // 3. Generate Cloudflare signed token
    const iframeUrl = await getCFSignedToken(cfVideoId);

    // 4. Return signed URL
    return jsonRes(res, 200, { iframeUrl });

  } catch (err) {
    console.error('[sign-video] Error:', err);
    return jsonRes(res, 500, { error: 'Internal server error' });
  }
}
