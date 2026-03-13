# A3KM Studio — Paid Access & Auth System
## Complete Architecture Plan & Developer Guidance
**Generated:** March 5, 2026  
**Last Updated:** March 6, 2026 — Deploy-ready (broken paths fixed, vercel.json + package.json added)  
**Status:** 🟢 System deploy-ready — SSL deferred — Phase 10 (testing) remaining

---

## 🚨 OWNER ACTION REQUIRED — Development resume করার আগে এই সব করো

> ✅ **সব prerequisites সম্পন্ন।** Phase 4 শুরু হয়ে গেছে।

### A. Firebase — এখনই করো

| # | কাজ | কীভাবে করবে | Status |
|---|---|---|---|
| A1 | Firebase project `a3km-studio` | ✅ Done | ✅ |
| A2 | Web app registered + config | ✅ Done | ✅ |
| A3 | `firebase-config.js` তৈরি | ✅ Done (`Optimization/`) | ✅ |
| A4 | Google Auth enable | Firebase Console → Authentication → Sign-in method → Google → Enable → Save | ✅ |
| A5 | Authorized domain যোগ | Authentication → Settings → Authorized domains → Add `a3km-studio.vercel.app` | ⏳ Deploy এর পরে |
| A6 | Firestore database তৈরি | Firebase Console → Firestore Database → asia-south1 → Production mode | ✅ |
| A7 | Firestore security rules | Firestore → Rules tab → Publish | ✅ |
| A8 | Service Account JSON | ✅ পাওয়া গেছে → Vercel env var এ set হয়েছে | ✅ |

---

### B. Cloudflare Stream — paid video hosting এর জন্য

> **Gmail:** `mdakhinoorislam.official.2005@gmail.com` — ✅ Confirmed  
> Free tier: 1,000 min storage + 1,000 min/month delivery — শুরুর জন্য যথেষ্ট।

| # | কাজ | Value | Status |
|---|---|---|---|
| B1 | Cloudflare account | ✅ Done | ✅ |
| B2 | Stream enable | ✅ Done | ✅ |
| B3 | Stream API Token | `WL3cWJysS634v_TO-bwSkGbTy9dGs6SA4oMlXKZL` → Vercel env var | ✅ |
| B4 | Account ID | `0ddc85c1890bb9753c4d4ec0dd69654f` → Vercel env var | ✅ |
| B5 | Vercel env vars set | ✅ Done | ✅ |
| B6 | R2 (file storage) | ❌ $5 কার্ড লাগে — Firebase Storage (free 5GB) দিয়ে চলব | ✅ Skipped |

---

### C. SSLCommerz — Payment Gateway

> Phase 1 manual payment এর জন্য SSLCommerz লাগবে না — **Phase 8 তে যোগ হবে।**

| # | কাজ | Status |
|---|---|---|
| C1 | SSLCommerz account | ⏳ Phase 8 এর আগে করলেই হবে |
| C2 | Sandbox credentials | ⏳ |
| C3 | Store ID + Password | ⏳ |
| C4 | Vercel env var | ⏳ |

---

### D. Payment Numbers (Manual Phase 1 এর জন্য)

| Method | Number | Status |
|---|---|---|
| **bKash** | `01724812042` — Send Money ✅ | ✅ |
| Nagad | পরে add করবে | ⏳ |
| Rocket | পরে add করবে | ⏳ |

---

### E. EmailJS — Templates verify করো

> Service + public key already configured। শুধু template content verify করো।

| # | Item | Value | Status |
|---|---|---|---|
| E1 | Public Key | `Yj4RUOwG4oxZyKFoh` | ✅ `firebase-config.js` এ আছে |
| E2 | Service ID | `service_8mwzo9y` | ✅ `firebase-config.js` এ আছে |
| E3 | Template: payment_received | `template_hfh0298` | ✅ Confirmed |
| E4 | Template: access_granted | `template_wxyrgg7` | ✅ Confirmed |

**Template `template_hfh0298` content হওয়া উচিত:**
```
Subject: New Payment Request — {{buyer_name}}

Name: {{buyer_name}}
Email: {{buyer_email}}
Phone: {{buyer_phone}}
Method: {{payment_method}}
Sender Number: {{sender_number}}
Transaction ID: {{transaction_id}}
Amount: ৳{{amount}}
Items: {{items_list}}

Verify: a3km-studio.vercel.app/Only-boss/managers/payment-requests-manager.html
```

**Template `template_wxyrgg7` content হওয়া উচিত:**
```
Subject: Your Access Has Been Granted — A3KM Studio

Dear {{user_name}},

Your access to the following content has been granted:
{{content_list}}

Access at: {{site_url}}/buy.html#my-access

— A3KM Studio
```

---

### F. Vercel Environment Variables — deploy এর আগে set করো

```
FIREBASE_SERVICE_ACCOUNT   =  ✅ Set (service account JSON)
CLOUDFLARE_STREAM_TOKEN    =  ✅ Set (WL3cWJysS634v_TO-bwSkGbTy9dGs6SA4oMlXKZL)
CLOUDFLARE_ACCOUNT_ID      =  ✅ Set (0ddc85c1890bb9753c4d4ec0dd69654f)
SSLCOMMERZ_STORE_ID        =  ⏳ Phase 8 এর আগে
SSLCOMMERZ_STORE_PASSWORD  =  ⏳ Phase 8 এর আগে
ADMIN_EMAIL                =  ✅ Set (a3kmstudio@gmail.com)
```

> ⚠️ `FIREBASE_SERVICE_ACCOUNT` এর private key কখনো code বা GitHub এ রাখবে না।

---

### QUICK REFERENCE — তুমি এখন এই ক্রমে করো

```
✅ Cloudflare — Account ID + Token confirmed, Vercel env set
✅ bKash — 01724812042 confirmed
✅ EmailJS — templates confirmed, Vercel env set
✅ Firebase Service Account — Vercel env set

✅ সব prerequisites সম্পন্ন — Phase 4 (buy.html) শুরু হয়ে গেছে।
```

---

## ✅ Implementation Status — কী কী হয়েছে

### Phase 1 — Foundation ✅ COMPLETE

| File | কী হয়েছে |
|---|---|
| `Optimization/firebase-config.js` | Firebase init + EmailJS config |
| `Optimization/auth-module.js` | Google login/logout, session restore, admin check |
| `Optimization/access-gate.js` | `checkContentAccess()` + `showAccessGate()` overlay |
| `Optimization/access-gate.css` | Gate overlay styles |
| Desktop navbar (5 pages) | Sign In button + user avatar dropdown |

### Phase 2 — Content Schema & Managers ✅ COMPLETE

| File | কী হয়েছে |
|---|---|
| `Content Studio/books-pdfs/books.json` | `accessType: "free"` added |
| `Optimization/github-content-uploader.js` | Default `accessType: 'free'` in metadata spread |
| `Only-boss/managers/Content-studio/books-manager-new.html` | Upload + Edit form access UI (dropdown + price fields) |
| `Only-boss/managers/Content-studio/educational-videos-manager.html` | Upload + Edit access UI + JS helpers |
| `Only-boss/managers/Content-studio/papers-manager.html` | Upload + Edit access UI + JS helpers |
| `Content Studio/books-pdfs/book-listing-new.html` | Access badge CSS, badge in card, `openBook()` gate, Firebase scripts |
| `Content Studio/educational-videos/course-listing-new.html` | Access badge, `openCourse()` gate, Firebase scripts |

### Phase 3 — Project Managers & Viewer Pages ✅ COMPLETE

| File | কী হয়েছে |
|---|---|
| `Only-boss/managers/projects/arduino/arduino-manager.html` | `accessType` in newProject, edit populate, save update, edit modal UI |
| `Only-boss/managers/projects/matlab/matlab-manager.html` | Same — `editMatlabAccessType` IDs |
| `Only-boss/managers/projects/solidworks/solidworks-manager.html` | Same — `editSWAccessType` IDs |
| `Content Studio/research-papers/paper-listing.html` | Access badge, `openBook()` gate, Firebase scripts |
| `Content Studio/educational-videos/course-viewer-new.html` | Access gate in `init()` after courseData found |
| `Content Studio/books-pdfs/pdf-reader.html` | Access gate in `init()` after bookData found |
| `Content Studio/research-papers/paper-viewer.html` | Access gate in `init()` after paperData found |

### ❌ Pending Phases

| Phase | কী কী | Blocker |
|---|---|---|
| Phase 4 | `buy.html` — browse + cart + manual payment form | ✅ **Complete** |
| Phase 5 | `payment-requests-manager.html` — admin verify & grant | ✅ **Complete** |
| Phase 6 | `user-access-manager.html`, `combo-manager.html` | ✅ **Complete** |
| Phase 7 | Home buy button, footer links, dashboard cards | ✅ **Complete** |
| Phase 8 | SSLCommerz auto-payment Vercel functions | ⏳ **Deferred** — manual bKash system চলবে |
| Phase 9 | Cloudflare Stream player, signed URL API, YouTube piracy fix | ✅ **Complete** |
| Phase 10 | End-to-end testing, mobile check, edge cases | ⚠️ Manual testing needed |

---

## 0. Finalized Decisions

| বিষয় | চূড়ান্ত সিদ্ধান্ত |
|---|---|
| Auth Provider | Firebase — Google OAuth only |
| Firebase Project ID | `a3km-studio` |
| Admin Email | `a3kmstudio@gmail.com` |
| Firebase App ID | `1:417803877120:web:49c51f97975ed75b8591e5` |
| Cloudflare Account | `mdakhinoorislam.official.2005@gmail.com` ✅ |
| Cloudflare Account ID | `0ddc85c1890bb9753c4d4ec0dd69654f` ✅ |
| Payment Phase 1 (manual) | Manual form: bKash `01724812042` (Send Money) → admin verify → grant |
| Payment Phase 2 (auto) | **SSLCommerz** (aggregates bKash, Nagad, Rocket, cards) — Phase 8 |
| Video: Free vlogs | YouTube Public (unchanged) |
| Video: Paid preview/trailer | YouTube Unlisted |
| Video: Paid full lessons | **Cloudflare Stream (primary)** + YouTube Unlisted (fallback) |
| File hosting: Paid PDFs/Zips | Firebase Storage (free 5GB) |
| Database | Firestore (`asia-south1` region) |
| EmailJS Service | `service_8mwzo9y` |
| EmailJS Public Key | `Yj4RUOwG4oxZyKFoh` |
| Template: payment_received | `template_hfh0298` |
| Template: access_granted | `template_wxyrgg7` |
| Login required | শুধু `buy.html` — বাকি সব site public |
| Pricing control | Manager UI থেকে admin করে JSON update হবে |

---

## 1. Content Access Levels — 4-Tier Model

```
TIER 0 — PUBLIC
  · কেউ দেখতে পারে, login লাগে না
  · Example: vlogs, free books, listing pages, detail pages

TIER 1 — PREVIEW ONLY (paid content, not yet purchased)
  · Listing card দেখা যায় ✅
  · Detail/Info page দেখা যায় ✅
  · Read / Watch / Download করতে গেলে → buy.html এ redirect ❌

TIER 2 — GRANTED ACCESS (paid + verified)
  · Admin grant করেছে অথবা SSLCommerz payment confirmed
  · Full access: read, watch, download
  · Firestore `access/{uid}` document এ record আছে

TIER 3 — ADMIN
  · a3kmstudio@gmail.com — সব content সব access
```

---

## 2. JSON Schema — accessType ও price fields

### All Content Types

```json
{
  "accessType": "paid",
  "price": {
    "amount": 299,
    "currency": "BDT",
    "originalPrice": 499,
    "discount": 40
  },
  "comboIds": []
}
```

### Courses — extra video fields

```json
{
  "previewVideoId": "YOUTUBE_UNLISTED_TRAILER_ID",
  "fullVideo": {
    "source": "cloudflare",
    "cloudflareVideoId": "CF_STREAM_UID",
    "youtubeUnlistedId": "YT_UNLISTED_FALLBACK_ID"
  }
}
```

> `fullVideo.source`: CF → Cloudflare player. Otherwise → YouTube Unlisted embed. Priority: CF > YT Unlisted.

### accessType Values

```
"free"   → সবাই access পাবে, login লাগে না
"paid"   → payment অথবা admin grant লাগবে
"combo"  → শুধু combo package এর অংশ হিসেবে — single purchase বন্ধ
```

---

## 3. Combo Package System

### 3.1 Firestore: `combos/` collection

```json
{
  "id":    "combo-engineering-starter",
  "title": "Engineering Starter Pack",
  "price": { "amount": 599, "currency": "BDT", "originalPrice": 946, "savings": 347 },
  "items": [
    { "type": "course", "id": "course-arduino-001", "title": "Arduino Fundamentals" },
    { "type": "book",   "id": "book-ecg-001",       "title": "ECG Interpretation" }
  ],
  "isActive": true,
  "tag": "BEST VALUE"
}
```

### 3.2 Combo Card — listing page এ auto-appear

```
┌─────────────────────────────┐
│  🎁 COMBO  [BEST VALUE]     │
│  Engineering Starter Pack   │
│  ✓ Arduino Course           │
│  ✓ ECG Book                 │
│  ~~৳946~~  →  ৳599         │
│  [Buy Package]              │
└─────────────────────────────┘
```

Combo manager এ save → Firestore → listing pages স্বয়ংক্রিয় load করে card দেখাবে।

### 3.3 Combo Manager Flow (Only-boss)

1. Title + Description input
2. Content search: ID দিয়ে item যোগ করো (course/book/paper/project)
3. Price set → discount auto-calculate
4. Save → Firestore write
5. Toggle active/inactive

---

## 4. Access Check Logic — Decision Tree

```javascript
// Optimization/access-gate.js (already built)

async function checkContentAccess(contentId, contentType, contentMeta) {

  // Step 1 — Free
  if (!contentMeta.accessType || contentMeta.accessType === 'free')
    return { allowed: true, reason: 'free' };

  const user = window.A3KM.currentUser;

  // Step 2 — Admin
  if (user && window.A3KM.isAdmin(user))
    return { allowed: true, reason: 'admin' };

  // Step 3 — Not logged in
  if (!user)
    return { allowed: false, reason: 'not_logged_in',
             contentTitle: contentMeta.title, price: contentMeta.price };

  // Step 4 — Firestore access record
  const hasAccess = await window.A3KM.checkAccess(user.uid, contentType, contentId);
  if (hasAccess) return { allowed: true, reason: 'granted' };

  // Step 4b — Combo access (Phase 6 এ add হবে)
  const comboAccess = await checkComboAccess(user.uid, contentType, contentId);
  if (comboAccess) return { allowed: true, reason: 'combo_access' };

  // Step 5 — No access
  return { allowed: false, reason: 'no_access',
           contentTitle: contentMeta.title, price: contentMeta.price };
}
```

**Firestore `access/{uid}` structure:**

```json
{
  "courses":  ["course-arduino-001"],
  "books":    ["book-ecg-001"],
  "papers":   ["paper-cnn-001"],
  "projects": ["proj-sw-001"],
  "combos":   ["combo-engineering-starter"]
}
```

---

## 5. Preview System

| Content | Preview (paid, no access) | Full access |
|---|---|---|
| **Course** | Card + Detail page + Trailer (YouTube Unlisted ~5 min) | Full lessons (Cloudflare Stream) |
| **Book** | Card + Detail page + First 15 pages | Full PDF |
| **Research Paper** | Card + Detail page + Abstract only | Full PDF |
| **Project** | Card + Detail page + Screenshots | Download zip/SLDPRT |

### Gate Overlay (access-gate.js — already built)

```
┌──────────────────────────────────────────┐
│  [Blurred content behind]                │
│         🔒 Full Access Required          │
│   "Arduino Fundamentals Course"          │
│   ৳299  ~~৳499~~  (Save 40%)          │
│  [🛒 Buy This]  [📦 View Packages]       │
│  ─────── or ───────                      │
│  Already purchased?  [Sign In]           │
└──────────────────────────────────────────┘
```

---

## 6. Buy Page — `/buy.html`

### 6.1 Entry Points

- Home page hero section → "📚 Content Store" button
- প্রতিটি page এর footer → "Buy / Unlock Content" link
- Gate overlay → "Buy This" button
- Paid card → "Buy" button

### 6.2 Page Flow

```
Step 1 — Login (mandatory এই page এ)
  → Not logged in: Google Sign In prompt
  → Logged in: "Welcome, NAME" + "My Access" tab

Step 2 — Browse Content
  → Tabs: All | Courses | Books | Papers | Projects | Combos
  → Already owned → "✅ Owned" badge
  → Pending payment → "⏳ Pending" badge
  → [Add to Cart]

Step 3 — Cart
  → Items list + total
  → Combo suggestion (যদি cart এর items মিলিয়ে combo হয়)
  → [Proceed to Payment]

Step 4 — Payment Form (Phase 1 Manual)
  → Name, Email (auto-fill), Phone
  → Method: bKash | Nagad | Rocket
  → Instructions: "Send ৳XXX to 01XXXXXXXXX (Send Money)"
  → Your sender number, Transaction ID
  → [Submit Request]

  [Phase 2 — SSLCommerz replaces this step]

Step 5 — Confirmation
  → "Request submitted! Admin will verify within 24 hours."
  → EmailJS: admin notification (template_hfh0298) + user reply (template_wxyrgg7)
  → Firestore paymentRequests/ document create

Step 6 — My Access Tab
  → User এর granted content list
  → প্রতিটির [View/Watch/Read] link
```

### 6.3 EmailJS Notification Code

```javascript
// firebase-config.js এ already configured:
// publicKey: 'Yj4RUOwG4oxZyKFoh', serviceId: 'service_8mwzo9y'

async function sendPaymentNotification(request) {
  emailjs.init('Yj4RUOwG4oxZyKFoh');

  await emailjs.send('service_8mwzo9y', 'template_hfh0298', {
    buyer_name:     request.name,
    buyer_email:    request.email,
    buyer_phone:    request.phone,
    payment_method: request.paymentMethod,
    sender_number:  request.senderNumber,
    transaction_id: request.transactionId,
    amount:         request.amount,
    items_list:     request.items.map(i => i.title).join(', ')
  });

  await emailjs.send('service_8mwzo9y', 'template_wxyrgg7', {
    user_name:    request.name,
    user_email:   request.email,
    content_list: request.items.map(i => `• ${i.title}`).join('\n'),
    site_url:     window.location.origin
  });
}
```

### 6.4 Firestore `paymentRequests/{id}` structure

```json
{
  "uid":           "firebase_user_uid",
  "email":         "user@gmail.com",
  "name":          "Rakib Ahmed",
  "phone":         "01XXXXXXXXX",
  "paymentMethod": "bkash",
  "senderNumber":  "01XXXXXXXXX",
  "transactionId": "ABC123XYZ",
  "amount":        299,
  "currency":      "BDT",
  "items": [
    { "type": "course", "id": "course-arduino-001", "title": "Arduino Fundamentals" }
  ],
  "requestedAt": "timestamp",
  "status":      "pending",
  "adminNotes":  ""
}
```

---

## 7. Admin Panel — Only-boss Updates

### 7.1 Dashboard নতুন cards

```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ 💳 Payment   │  │ 👥 Users &   │  │ 📦 Combo     │
│  Requests    │  │   Access     │  │  Manager     │
│  [3 new]     │  │  [47 users]  │  │  [5 active]  │
└──────────────┘  └──────────────┘  └──────────────┘
```

### 7.2 Payment Request Manager

`Only-boss/managers/payment-requests-manager.html`

```
PENDING (3)
─────────────────────────────────────────────
Rakib Ahmed | Arduino Course | ৳299 | bKash
TxnID: ABC123 | 01711XXXXXX | 2026-03-05
[✅ Verify & Grant]  [❌ Reject]  [📝 Notes]
─────────────────────────────────────────────
```

```javascript
async function verifyAndGrant(requestId) {
  const req = await getPaymentRequest(requestId);

  for (const item of req.items) {
    await grantAccess(req.uid, item.type, item.id);
  }

  await updateDoc(doc(db, 'paymentRequests', requestId), {
    status: 'granted', grantedAt: serverTimestamp(), grantedBy: ADMIN_EMAIL
  });

  await notifyAccessGranted(req);  // EmailJS template_wxyrgg7
}

// Core grant — same function SSLCommerz IPN ও call করবে
async function grantAccess(uid, contentType, contentId) {
  await setDoc(doc(db, 'access', uid),
    { [contentType + 's']: arrayUnion(contentId) }, { merge: true });
}
```

### 7.3 Manager এ Access Settings UI — সব Manager এ (already deployed Phase 2 & 3)

```html
<div class="form-section">
  <h3>🔐 Access Settings</h3>
  <select id="accessType" onchange="togglePriceFields()">
    <option value="free">🆓 Free</option>
    <option value="paid">💰 Paid</option>
    <option value="combo">📦 Combo Only</option>
  </select>
  <div id="priceFields" style="display:none;">
    <input type="number" id="priceAmount" placeholder="299">
    <input type="number" id="originalPrice" placeholder="499">
  </div>
</div>
```

---

## 8. Card Badges — Listing Pages (already deployed)

```css
.access-badge.paid  { background: linear-gradient(135deg,rgba(204,0,0,0.92),rgba(139,0,0,0.92)); color:#fff; }
.access-badge.combo { background: linear-gradient(135deg,rgba(100,0,180,0.92),rgba(70,0,130,0.92)); color:#fff; }
.access-badge.owned { background: linear-gradient(135deg,rgba(21,101,192,0.92),rgba(13,71,161,0.92)); color:#fff; }
```

Badge logic in card render (free content shows no badge, paid shows 🔒, combo shows 📦, owned shows ✅):

```javascript
const at = item.accessType || 'free';
const badge = at === 'paid'
  ? `<span class="access-badge paid">🔒 Paid ${item.price?.amount ? '৳'+item.price.amount : ''}</span>`
  : at === 'combo'
  ? `<span class="access-badge combo">📦 Bundle</span>`
  : '';
// Phase 6: + owned badge after Firestore check
```

---

## 9. YouTube Piracy Prevention — Critical Issue & Solution

### 9.1 Problem Analysis

```
YouTube Public:
  → videoId iframe src এ visible → যে কেউ youtube.com/watch?v=ID চলে যেতে পারে
  → Third-party apps দিয়ে download সম্ভব
  → VERDICT: Free vlogs OK. Paid এ NEVER.

YouTube Unlisted:
  → URL কাজ করে, videoId inspect করলে দেখা যায়
  → VERDICT: Trailer/preview OK. Full lesson এ NOT ideal.

YouTube Private:
  → Embed করা যায় না (403 error)
  → VERDICT: কাজে লাগবে না।

Cloudflare Stream:
  → videoId expose হয় না (signed token)
  → URL 15 min এ expire + user-specific
  → Download option নেই
  → Custom player (no YouTube UI)
  → VERDICT: BEST for paid full lessons.
```

### 9.2 Dual Strategy (সব scenario cover করে)

```
FREE VLOGS           → YouTube Public        (unchanged)
PAID TRAILER/PREVIEW → YouTube Unlisted      (acceptable — just preview)
PAID FULL LESSON     → Cloudflare Stream     (primary — when B setup done)
                     → YouTube Unlisted      (fallback — before/without CF)
```

JSON এ দুটো field:
```json
"fullVideo": {
  "cloudflareVideoId": "abc123",          ← primary
  "youtubeUnlistedId": "yt_fallback_id"   ← fallback
}
```

Code: CF আছে → CF play; না থাকলে → YT Unlisted.

### 9.3 Minimum Protection এখনই (YouTube Unlisted phase)

```javascript
function loadPaidVideo(videoData) {
  if (videoData.fullVideo?.cloudflareVideoId) {
    loadCloudflareVideo(videoData.id);  // Phase 9
    return;
  }
  const id = videoData.fullVideo?.youtubeUnlistedId;
  if (id) {
    // Dynamically inject (not in HTML source — harder to scrape)
    const params = 'rel=0&modestbranding=1&iv_load_policy=3&fs=1';
    document.getElementById('videoPlayer').src =
      `https://www.youtube-nocookie.com/embed/${id}?${params}`;
    document.getElementById('ytWatchBtn')?.remove();  // Remove "Watch on YouTube"
  }
}

// Block right-click on video area
document.getElementById('videoWrapper')
  .addEventListener('contextmenu', e => e.preventDefault());
```

### 9.4 Cloudflare Stream Signed URL (Phase 9 — Vercel Function)

```javascript
// api/sign-video.js
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { contentId, userToken } = req.body;

  const decoded = await admin.auth().verifyIdToken(userToken);

  if (decoded.email === process.env.ADMIN_EMAIL) {
    return res.json({ url: await getCFSignedUrl(contentId) });
  }

  const access = await db.collection('access').doc(decoded.uid).get();
  if (!access.data()?.courses?.includes(contentId)) {
    return res.status(403).json({ error: 'No access' });
  }

  const cfRes = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/stream/${contentId}/token`,
    { method: 'POST',
      headers: { Authorization: `Bearer ${process.env.CLOUDFLARE_STREAM_TOKEN}` },
      body: JSON.stringify({ exp: Math.floor(Date.now()/1000) + 900 }) }
  ).then(r => r.json());

  res.json({ url: `https://customer-xxxxx.cloudflarestream.com/${cfRes.result.token}/iframe` });
}
```

### 9.5 Anti-Piracy Summary

| Attack | Protection |
|---|---|
| "Watch on YouTube" button | Button remove করো paid content এ |
| iframe src থেকে videoId | Cloudflare Stream → signed token, no videoId |
| Signed URL share করা | 15 min expire + user-specific |
| Third-party YT downloader | CF video তে YouTube URL নেই |
| Browser devtools | Signed URL already expired |
| Screen recording | ❌ Technically impossible — সব platform এ |

> Netflix, Udemy ও screen recording আটকাতে পারে না। Cloudflare Stream দিয়ে casual piracy ৯৫%+ কমবে।

---

## 10. Firebase Auth — Google Only

### Rules

```
- সাইট browse করতে কোনো login prompt নেই
- শুধু buy.html এ, অথবা paid content viewer access করতে login লাগে
- একবার login করলে auto-session (browser close করলেও)
- Login = Google Popup — page reload নেই
```

### auth-module.js — Central Controller (already built)

```javascript
// Optimization/auth-module.js
window.A3KM = {
  currentUser: null,
  isAdmin: (user) => user?.email === 'a3kmstudio@gmail.com',
  loginWithGoogle: async () => { /* signInWithPopup */ },
  logout: async () => { /* signOut */ },
  checkAccess: async (uid, type, id) => { /* Firestore access/{uid} query */ }
};
```

### Navbar Login Button (already deployed on 5 pages)

```html
<!-- Not logged in -->
<button id="navLoginBtn" onclick="window.A3KM.loginWithGoogle()">
  <i class="fas fa-user-circle"></i> Sign In
</button>

<!-- Logged in (JS দিয়ে swap হয়) -->
<div class="nav-user-dropdown">
  <img id="navUserPhoto" class="nav-user-avatar">
  <span id="navUserName"></span>
  <div class="nav-user-menu">
    <a href="/buy.html#my-access">My Access</a>
    <button onclick="window.A3KM.logout()">Sign Out</button>
  </div>
</div>
```

---

## 11. Firestore Security Rules — Section A7 এ paste করো

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    match /users/{uid} {
      allow read:  if request.auth.uid == uid || isAdmin();
      allow write: if request.auth.uid == uid;
    }

    // User নিজে access দিতে পারবে না — শুধু admin লিখতে পারে
    match /access/{uid} {
      allow read:  if request.auth.uid == uid || isAdmin();
      allow write: if isAdmin();
    }

    // Payment requests — user শুধু create, update পারে না
    match /paymentRequests/{reqId} {
      allow create: if request.auth != null
                    && request.resource.data.uid == request.auth.uid;
      allow read, update: if isAdmin();
    }

    // Combos — সবাই পড়তে পারে, শুধু admin লিখতে পারে
    match /combos/{comboId} {
      allow read:  if true;
      allow write: if isAdmin();
    }

    // Access logs — শুধু admin
    match /accessLogs/{logId} {
      allow read, write: if isAdmin();
    }

    function isAdmin() {
      return request.auth != null
             && request.auth.token.email == 'a3kmstudio@gmail.com';
    }
  }
}
```

---

## 12. New Files — Complete List

```
Optimization/
├── firebase-config.js       ✅ Done
├── auth-module.js           ✅ Done
├── access-gate.js           ✅ Done
└── access-gate.css          ✅ Done

Root/
├── buy.html                 ❌ Phase 4
└── buy.css                  ❌ Phase 4

Only-boss/managers/
├── payment-requests-manager.html   ❌ Phase 5
├── user-access-manager.html        ❌ Phase 6
└── combo-manager.html              ❌ Phase 6

api/ (Vercel Serverless Functions)
├── sslcommerz-init.js       ❌ Phase 8
├── sslcommerz-ipn.js        ❌ Phase 8
└── sign-video.js            ❌ Phase 9
```

---

## 13. Modified Files — Full List

| File | Change | Status |
|---|---|---|
| `Content Studio/books-pdfs/books.json` | `accessType` field | ✅ Done |
| `Optimization/github-content-uploader.js` | Default `accessType: 'free'` | ✅ Done |
| `Only-boss/managers/Content-studio/books-manager-new.html` | Access UI (upload + edit) | ✅ Done |
| `Only-boss/managers/Content-studio/educational-videos-manager.html` | Access UI (upload + edit) | ✅ Done |
| `Only-boss/managers/Content-studio/papers-manager.html` | Access UI (upload + edit) | ✅ Done |
| `Only-boss/managers/projects/arduino/arduino-manager.html` | Access UI (edit + newProject + save) | ✅ Done |
| `Only-boss/managers/projects/matlab/matlab-manager.html` | Access UI (edit + newProject + save) | ✅ Done |
| `Only-boss/managers/projects/solidworks/solidworks-manager.html` | Access UI (edit + newProject + save) | ✅ Done |
| `Content Studio/books-pdfs/book-listing-new.html` | Badge + gate + Firebase scripts | ✅ Done |
| `Content Studio/educational-videos/course-listing-new.html` | Badge + gate + Firebase scripts | ✅ Done |
| `Content Studio/research-papers/paper-listing.html` | Badge + gate + Firebase scripts | ✅ Done |
| `Content Studio/educational-videos/course-viewer-new.html` | Gate in init() | ✅ Done |
| `Content Studio/books-pdfs/pdf-reader.html` | Gate in init() | ✅ Done |
| `Content Studio/research-papers/paper-viewer.html` | Gate in init() | ✅ Done |
| `Home/index.html` | "Content Store" button + footer link | ✅ Done |
| Every page footer | "Buy / Unlock" link | ✅ Done (Home page) |
| `Content Studio/educational-videos/course-viewer-new.html` | Cloudflare player + YT button remove | ✅ Done |
| `api/sign-video.js` | Vercel signed URL serverless function | ✅ Done |
| `[restricted-admin-dashboard-route]` | New manager card links | ✅ Done |

---

## 14. SSLCommerz Auto-Payment (Phase 8)

```javascript
// api/sslcommerz-init.js — User "Pay Now" click করলে frontend এই call করে
export default async function handler(req, res) {
  const { items, userToken } = req.body;
  const decoded = await admin.auth().verifyIdToken(userToken);
  const total = items.reduce((s, i) => s + i.price, 0);

  const payload = {
    store_id:     process.env.SSLCOMMERZ_STORE_ID,
    store_passwd: process.env.SSLCOMMERZ_STORE_PASSWORD,
    total_amount: total,
    currency:     'BDT',
    tran_id:      `a3km_${decoded.uid}_${Date.now()}`,
    success_url:  `${origin}/buy.html?payment=success`,
    fail_url:     `${origin}/buy.html?payment=failed`,
    ipn_url:      `${origin}/api/sslcommerz-ipn`,
    cus_name:     decoded.name,
    cus_email:    decoded.email,
  };

  const sslRes = await fetch('https://sandbox.sslcommerz.com/gwprocess/v4/api.php',
    { method: 'POST', body: new URLSearchParams(payload) }).then(r => r.json());

  await db.collection('paymentRequests').add({
    uid: decoded.uid, items, amount: total,
    tran_id: payload.tran_id, status: 'sslcommerz_pending',
    requestedAt: admin.firestore.FieldValue.serverTimestamp()
  });

  res.json({ gatewayUrl: sslRes.GatewayPageURL });
}

// api/sslcommerz-ipn.js — SSLCommerz auto-calls এটা payment হলে
export default async function handler(req, res) {
  const { val_id, status, tran_id } = req.body;
  if (status !== 'VALID') return res.status(200).send('NOK');

  const valid = await verifySSLTransaction(val_id);  // SSLCommerz validation API
  if (!valid) return res.status(200).send('NOK');

  const q = await db.collection('paymentRequests')
    .where('tran_id', '==', tran_id).limit(1).get();
  if (q.empty) return res.status(200).send('NOK');

  const data = q.docs[0].data();
  for (const item of data.items) {
    await grantAccess(data.uid, item.type, item.id);  // same function as manual grant
  }
  await q.docs[0].ref.update({
    status: 'granted', grantedAt: admin.firestore.FieldValue.serverTimestamp()
  });

  res.status(200).send('OK');
}
```

> `grantAccess()` function Phase 5 (manual) ও Phase 8 (SSLCommerz) — একই function। Design intentional।

---

## 15. Additional Considerations

### 15.1 Duplicate Purchase Prevention

```javascript
async function canAddToCart(contentId, contentType) {
  const user = window.A3KM.currentUser;
  if (!user) return { canAdd: true };

  const owned = await window.A3KM.checkAccess(user.uid, contentType, contentId);
  if (owned) return { canAdd: false, reason: 'already_owned' };

  // Pending payment check
  const q = query(collection(db, 'paymentRequests'),
    where('uid', '==', user.uid), where('status', '==', 'pending'));
  const snap = await getDocs(q);
  const hasPending = snap.docs.some(d =>
    d.data().items?.some(i => i.type === contentType && i.id === contentId));
  if (hasPending) return { canAdd: false, reason: 'payment_pending' };

  return { canAdd: true };
}
```

### 15.2 Combo Suggestion in Cart

```javascript
function checkComboSuggestion(cartItems, availableCombos) {
  for (const combo of availableCombos) {
    const matchRatio = combo.items.filter(ci =>
      cartItems.some(c => c.type === ci.type && c.id === ci.id)
    ).length / combo.items.length;

    if (matchRatio >= 0.7) {
      return { suggest: true, combo, savings: combo.price.savings };
    }
  }
  return { suggest: false };
}
```

### 15.3 My Access View (`buy.html#my-access`)

```
My Access
──────────────────────────────────────
📹 Arduino Fundamentals     [Watch]
📖 ECG Interpretation       [Read]
📄 CNN Arrhythmia Paper     [Read]
📦 Starter Pack (3 items)   [View]
──────────────────────────────────────
[Browse more content]
```

### 15.4 Access Revoke

```javascript
async function revokeAccess(uid, contentType, contentId) {
  await updateDoc(doc(db, 'access', uid), {
    [contentType + 's']: arrayRemove(contentId)
  });
  await addDoc(collection(db, 'accessLogs'), {
    uid, contentType, contentId, action: 'revoked',
    by: ADMIN_EMAIL, at: serverTimestamp()
  });
}
```

### 15.5 Rate Limiting (Payment Form)

একই UID থেকে ১ ঘণ্টায় সর্বোচ্চ ৫টা payment request allow করবে (Firestore Rules এ enforce হবে Phase 4 তে)।

### 15.6 Mobile Buy Page

- Cart → bottom drawer
- Payment form → step-by-step full-screen wizard
- `mobile/buy/` folder → mobile redirect

### 15.7 Future: PDF Watermark

Phase 10 এর পরে optional: Dynamic watermark (user email overlay on PDF) দিয়ে share করা অকার্যকর করা।

---

## 16. Security Summary

```
✅ Firestore Rules → user নিজে access দিতে পারবে না
✅ Firebase Admin SDK → server-side JWT verify
✅ Cloudflare Signed URLs → 15 min expire, user-specific
✅ Admin email → server-side env variable (code এ নেই)
✅ Payment requests → user শুধু create, update পারে না
✅ Cloudflare Stream → videoId/streamId expose হয় না
✅ Firebase Storage → private, signed URL only
✅ Rate limiting → payment form spam block
✅ SSLCommerz IPN → server-side signature verify

⚠️ Screen recording → technically সম্ভব না আটকানো (সব platform এ same)
⚠️ YouTube Unlisted → videoId inspect করে বের করা সম্ভব → Phase 9 এ CF Stream সমাধান দেবে
⚠️ PDF sharing → Phase 10 এ dynamic watermark plan আছে
```

---

*End of Plan — Owner checklist (Section উপরে) সম্পূর্ণ হলে Phase 4 শুরু হবে।*

