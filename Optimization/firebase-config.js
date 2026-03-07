// Optimization/firebase-config.js
// Firebase client-side configuration — safe to expose (protected by Security Rules)
// NOTE: Service account private key → NEVER here, only in Vercel Environment Variables

(function () {
    'use strict';

    const firebaseConfig = {
        apiKey:            'AIzaSyDgrbs3IH7BrgtfIvtzfSXAdM4YOLIMu_k',
        authDomain:        'a3km-studio.firebaseapp.com',
        projectId:         'a3km-studio',
        storageBucket:     'a3km-studio.firebasestorage.app',
        messagingSenderId: '417803877120',
        appId:             '1:417803877120:web:49c51f97975ed75b8591e5'
        // Analytics not used
    };

    // Initialize Firebase (compat SDK — no bundler required)
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }

    // Global namespace
    window.A3KM = window.A3KM || {};

    // Firebase instances
    window.A3KM.auth = firebase.auth();
    window.A3KM.db   = firebase.firestore();

    // ── Admin ──────────────────────────────────────────────────────────────
    window.A3KM.ADMIN_EMAIL  = 'a3kmstudio@gmail.com'; // primary (email notifications)
    window.A3KM.ADMIN_EMAILS = ['a3kmstudio@gmail.com', 'mdakhinoorislam.official.2005@gmail.com'];

    // ── EmailJS ────────────────────────────────────────────────────────────
    // Same public key as contact page — only new templates added
    window.A3KM.emailjsCfg = {
        publicKey:  'Yj4RUOwG4oxZyKFoh',
        serviceId:  'service_8mwzo9y',          // connected to a3kmstudio@gmail.com
        templates: {
            paymentReceived: 'template_hfh0298', // admin gets notified of new payments
            accessGranted:   'template_wxyrgg7'  // user gets notified when access granted
        }
    };

    // ── Payment ────────────────────────────────────────────────────────────
    window.A3KM.paymentInfo = {
        bkash: {
            number: '01724812042',
            method: 'Send Money',
            label:  'bKash'
        }
        // Nagad, Rocket: add later
    };

    // ── Cloudflare ─────────────────────────────────────────────────────────
    // accountId is semi-public; Stream token is SERVER-SIDE ONLY (Vercel env)
    window.A3KM.cfAccountId = '0ddc85c1890bb9753c4d4ec0dd69654f';

    // ── Firestore region ───────────────────────────────────────────────────
    // asia-south1 (Mumbai) — set during DB creation, no client config needed

    // ── Persistent auth session ────────────────────────────────────────────
    // Users stay logged in across browser restarts
    window.A3KM.auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        .catch(e => console.warn('Persistence set error:', e));

})();
