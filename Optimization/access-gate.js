// Optimization/access-gate.js
// Content access gating — checks Firestore + shows lock overlay
// Requires: auth-module.js loaded first

(function () {
    'use strict';

    // ══════════════════════════════════════════════════════════════════════
    // checkContentAccess
    //
    // contentMeta shape:
    //   { id, title, accessType: 'free'|'paid', price: { amount, originalPrice, discount } }
    //
    // Returns: { allowed: bool, reason: string, ...meta }
    // ══════════════════════════════════════════════════════════════════════

    async function checkContentAccess(contentId, contentType, contentMeta) {
        const meta = contentMeta || {};

        // Step 1 — Free content
        if (!meta.accessType || meta.accessType === 'free') {
            return { allowed: true, reason: 'free' };
        }

        const user = window.A3KM.currentUser;

        // Step 2 — Admin always allowed
        if (user && window.A3KM.isAdmin(user)) {
            return { allowed: true, reason: 'admin' };
        }

        // Step 3 — Not logged in
        if (!user) {
            return {
                allowed:      false,
                reason:       'not_logged_in',
                contentType,
                contentId,
                contentTitle: meta.title || '',
                price:        meta.price  || null
            };
        }

        // Step 4 — Check Firestore access record
        const hasAccess = await window.A3KM.checkAccess(user.uid, contentType, contentId);
        if (hasAccess) {
            return { allowed: true, reason: 'granted' };
        }

        // Step 5 — No access
        return {
            allowed:      false,
            reason:       'no_access',
            contentType,
            contentId,
            contentTitle: meta.title || '',
            price:        meta.price  || null
        };
    }

    // ══════════════════════════════════════════════════════════════════════
    // showAccessGate
    //
    // result       — object returned by checkContentAccess
    // onLoginSuccess(user) — called if user logs in successfully
    // onAccessGranted()    — called if login + access check passes
    // ══════════════════════════════════════════════════════════════════════

    function showAccessGate(result, onLoginSuccess, onAccessGranted) {
        // Remove any existing gate
        document.querySelector('.a3km-access-gate')?.remove();

        const isLoginNeeded = result.reason === 'not_logged_in';
        const price = result.price;

        // Price row HTML
        const priceHTML = price ? `
            <div class="gate-price-row">
                ${price.originalPrice
                    ? `<span class="gate-price-slash">৳${price.originalPrice}</span>`
                    : ''}
                <span class="gate-price-main">৳${price.amount}</span>
                ${price.discount
                    ? `<span class="gate-discount-badge">-${price.discount}%</span>`
                    : ''}
            </div>` : '';

        // Google SVG logo (inline — no external image dependency)
        const googleSVG = `<svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.08 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59L2.56 17.8C.92 21.04 0 24.41 0 28c0 3.59.92 6.96 2.56 9.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6C29.96 37.81 27.18 38.64 24 38.64c-6.26 0-11.57-3.59-13.46-8.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
        </svg>`;

        const gate = document.createElement('div');
        gate.className = 'a3km-access-gate';
        gate.setAttribute('role', 'dialog');
        gate.setAttribute('aria-modal', 'true');
        gate.setAttribute('aria-label', 'Content locked');

        gate.innerHTML = `
            <div class="gate-backdrop"></div>
            <div class="gate-card">
                <div class="gate-lock-icon" aria-hidden="true"><i class="fas fa-lock"></i></div>
                <h2 class="gate-heading">Full Access Required</h2>
                ${result.contentTitle
                    ? `<p class="gate-content-name">&ldquo;${_esc(result.contentTitle)}&rdquo;</p>`
                    : ''}
                ${priceHTML}
                ${isLoginNeeded ? `
                    <p class="gate-sub">Sign in to access your purchased content</p>
                    <button class="gate-btn gate-google-btn" id="gateGoogleLogin" type="button">
                        ${googleSVG}
                        <span>Sign in with Google</span>
                    </button>
                    <div class="gate-or" aria-hidden="true"><span>or</span></div>
                ` : `
                    <p class="gate-sub">Purchase this content to unlock full access</p>
                `}
                <button class="gate-btn gate-buy-btn" id="gateBuyBtn" type="button">
                    <i class="fas fa-shopping-cart" aria-hidden="true"></i>
                    <span>Buy This Content</span>
                </button>
                <button class="gate-btn gate-pkg-btn" id="gateViewPackages" type="button">
                    <i class="fas fa-box-open" aria-hidden="true"></i>
                    <span>View Packages</span>
                </button>
            </div>
        `;

        document.body.appendChild(gate);

        // Backdrop click — shake the card (don't dismiss)
        gate.querySelector('.gate-backdrop').addEventListener('click', _shake.bind(null, gate));

        // Google login
        const googleBtn = gate.querySelector('#gateGoogleLogin');
        if (googleBtn) {
            googleBtn.addEventListener('click', async () => {
                googleBtn.disabled = true;
                googleBtn.innerHTML = `<span class="gate-spinner" aria-hidden="true"></span><span>Opening Google…</span>`;

                try {
                    const user = await window.A3KM.loginWithGoogle();
                    if (user) {
                        gate.remove();
                        if (onLoginSuccess) onLoginSuccess(user);
                        // Re-check access after login
                        if (onAccessGranted && result.contentId) {
                            const has = await window.A3KM.checkAccess(
                                user.uid, result.contentType, result.contentId
                            );
                            if (has) onAccessGranted();
                        }
                    } else {
                        // User closed the popup
                        _resetGoogleBtn(googleBtn, googleSVG);
                    }
                } catch {
                    _resetGoogleBtn(googleBtn, googleSVG);
                }
            });
        }

        // Buy button
        gate.querySelector('#gateBuyBtn').addEventListener('click', () => {
            const q = result.contentTitle
                ? '?ref=' + encodeURIComponent(result.contentTitle)
                : '';
            window.location.href = '/buy.html' + q;
        });

        // View packages
        gate.querySelector('#gateViewPackages').addEventListener('click', () => {
            window.location.href = '/buy.html#packages';
        });

        return gate;
    }

    // ══════════════════════════════════════════════════════════════════════
    // Helpers
    // ══════════════════════════════════════════════════════════════════════

    function _esc(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function _shake(gate) {
        gate.querySelector('.gate-card').classList.add('gate-shake');
        setTimeout(() => gate.querySelector('.gate-card')?.classList.remove('gate-shake'), 500);
    }

    function _resetGoogleBtn(btn, googleSVG) {
        btn.disabled = false;
        btn.innerHTML = `${googleSVG}<span>Sign in with Google</span>`;
    }

    // ══════════════════════════════════════════════════════════════════════
    // PUBLIC API
    // ══════════════════════════════════════════════════════════════════════

    window.A3KM.checkContentAccess = checkContentAccess;
    window.A3KM.showAccessGate     = showAccessGate;

})();
