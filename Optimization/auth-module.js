// Optimization/auth-module.js
// Google Auth + Firestore user management + Navbar state
// Requires: Firebase compat SDK scripts + firebase-config.js loaded first

(function () {
    'use strict';

    const auth         = window.A3KM.auth;
    const db           = window.A3KM.db;
    const ADMIN_EMAIL  = window.A3KM.ADMIN_EMAIL;
    const FS           = firebase.firestore.FieldValue;

    // ══════════════════════════════════════════════════════════════════════
    // LOGIN / LOGOUT
    // ══════════════════════════════════════════════════════════════════════

    async function loginWithGoogle() {
        const provider = new firebase.auth.GoogleAuthProvider();
        try {
            const result = await auth.signInWithPopup(provider);
            await _ensureUserProfile(result.user);
            return result.user;
        } catch (err) {
            if (err.code === 'auth/popup-closed-by-user') return null;
            if (err.code === 'auth/popup-blocked') {
                // Fallback to redirect if popup blocked
                await auth.signInWithRedirect(provider);
                return null;
            }
            console.error('[A3KM Auth] Login error:', err);
            throw err;
        }
    }

    async function logout() {
        await auth.signOut();
    }

    // ══════════════════════════════════════════════════════════════════════
    // PERMISSION CHECKS
    // ══════════════════════════════════════════════════════════════════════

    function isAdmin(user) {
        const admins = window.A3KM.ADMIN_EMAILS || [ADMIN_EMAIL];
        return !!(user && admins.includes(user.email));
    }

    // Check if uid has access to a specific content item
    // contentType: 'course' | 'book' | 'paper' | 'project'
    async function checkAccess(uid, contentType, contentId) {
        if (!uid) return false;

        try {
            const snap = await db.collection('access').doc(uid).get();
            if (!snap.exists) return false;

            const data = snap.data();

            // Direct access — e.g., data.courses includes 'course-arduino-001'
            const listKey = contentType + 's'; // course → courses
            if ((data[listKey] || []).includes(contentId)) return true;

            // Combo access — check each combo the user owns
            for (const comboId of (data.combos || [])) {
                const comboSnap = await db.collection('combos').doc(comboId).get();
                if (comboSnap.exists) {
                    const items = comboSnap.data().items || [];
                    if (items.some(i => i.type === contentType && i.id === contentId)) {
                        return true;
                    }
                }
            }
        } catch (e) {
            console.warn('[A3KM Auth] Access check failed:', e);
        }
        return false;
    }

    // Get full access record for a user (for "My Access" page)
    async function getUserAccess(uid) {
        if (!uid) return {};
        const snap = await db.collection('access').doc(uid).get();
        return snap.exists ? snap.data() : {};
    }

    // ══════════════════════════════════════════════════════════════════════
    // GRANT / REVOKE ACCESS (admin only — called from Only-boss panel)
    // ══════════════════════════════════════════════════════════════════════

    async function grantAccess(uid, contentType, contentId) {
        const listKey = contentType + 's';
        await db.collection('access').doc(uid).set(
            { [listKey]: FS.arrayUnion(contentId) },
            { merge: true }
        );
        await _logAccessAction(uid, contentType, contentId, 'granted');
    }

    async function grantComboAccess(uid, comboId) {
        await db.collection('access').doc(uid).set(
            { combos: FS.arrayUnion(comboId) },
            { merge: true }
        );
        await _logAccessAction(uid, 'combo', comboId, 'granted');
    }

    async function revokeAccess(uid, contentType, contentId) {
        const listKey = contentType + 's';
        await db.collection('access').doc(uid).update(
            { [listKey]: FS.arrayRemove(contentId) }
        );
        await _logAccessAction(uid, contentType, contentId, 'revoked');
    }

    // ══════════════════════════════════════════════════════════════════════
    // NAVBAR AUTH STATE UI - DROPDOWN VERSION
    // ══════════════════════════════════════════════════════════════════════

    function _updateNavbar(user) {
        // New dropdown elements
        const avatarEl      = document.getElementById('navAuthAvatar');
        const profileEl     = document.getElementById('navAuthProfile');
        const profilePicEl  = document.getElementById('navAuthProfilePic');
        const profileNameEl = document.getElementById('navAuthProfileName');
        const profileEmailEl= document.getElementById('navAuthProfileEmail');
        const divider1El    = document.getElementById('navAuthDivider1');
        const divider2El    = document.getElementById('navAuthDivider2');
        const signInBtn     = document.getElementById('navAuthSignInBtn');
        const myAccessBtn   = document.getElementById('navAuthMyAccess');
        const storeBtn      = document.getElementById('navAuthStore');
        const signOutBtn    = document.getElementById('navAuthSignOutBtn');

        if (!avatarEl) return; // Navbar not on this page

        if (user) {
            // User is logged in
            const photoURL = user.photoURL || 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
            const displayName = user.displayName || 'User';
            const email = user.email || '';

            // Update avatar in trigger button
            if (avatarEl) avatarEl.src = photoURL;

            // Show profile section in dropdown
            if (profileEl) profileEl.style.display = 'flex';
            if (profilePicEl) profilePicEl.src = photoURL;
            if (profileNameEl) profileNameEl.textContent = displayName;
            if (profileEmailEl) profileEmailEl.textContent = email;

            // Show dividers
            if (divider1El) divider1El.style.display = 'block';
            if (divider2El) divider2El.style.display = 'block';

            // Hide Sign In button
            if (signInBtn) signInBtn.style.display = 'none';

            // Show logged-in options
            if (myAccessBtn) myAccessBtn.style.display = 'flex';
            if (storeBtn) storeBtn.style.display = 'flex';
            if (signOutBtn) signOutBtn.style.display = 'flex';

        } else {
            // User is logged out
            const defaultAvatar = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';

            // Update avatar to default
            if (avatarEl) avatarEl.src = defaultAvatar;

            // Hide profile section
            if (profileEl) profileEl.style.display = 'none';

            // Hide dividers
            if (divider1El) divider1El.style.display = 'none';
            if (divider2El) divider2El.style.display = 'none';

            // Show Sign In button
            if (signInBtn) signInBtn.style.display = 'flex';

            // Hide logged-in options
            if (myAccessBtn) myAccessBtn.style.display = 'none';
            if (storeBtn) storeBtn.style.display = 'none';
            if (signOutBtn) signOutBtn.style.display = 'none';
        }
    }

    // ══════════════════════════════════════════════════════════════════════
    // INTERNAL HELPERS
    // ══════════════════════════════════════════════════════════════════════

    async function _ensureUserProfile(user) {
        const ref  = db.collection('users').doc(user.uid);
        const snap = await ref.get();
        const now  = FS.serverTimestamp();
        if (!snap.exists) {
            await ref.set({
                email:       user.email,
                displayName: user.displayName,
                photoURL:    user.photoURL,
                createdAt:   now,
                lastSeen:    now
            });
        } else {
            await ref.update({ lastSeen: now });
        }
    }

    async function _logAccessAction(uid, contentType, contentId, action) {
        await db.collection('accessLogs').add({
            uid,
            contentType,
            contentId,
            action,
            by:  ADMIN_EMAIL,
            at:  FS.serverTimestamp()
        });
    }

    // ══════════════════════════════════════════════════════════════════════
    // AUTH STATE OBSERVER — runs on every page that loads this file
    // ══════════════════════════════════════════════════════════════════════

    auth.onAuthStateChanged(user => {
        window.A3KM.currentUser = user || null;
        _updateNavbar(user);

        // Fire custom event so other scripts can react
        document.dispatchEvent(new CustomEvent('a3km:authReady', { detail: { user } }));
    });

    // Handle redirect result (popup-blocked fallback)
    auth.getRedirectResult().then(result => {
        if (result && result.user) {
            _ensureUserProfile(result.user);
        }
    }).catch(() => {});

    // ══════════════════════════════════════════════════════════════════════
    // PUBLIC API
    // ══════════════════════════════════════════════════════════════════════

    Object.assign(window.A3KM, {
        loginWithGoogle,
        logout,
        isAdmin,
        checkAccess,
        getUserAccess,
        grantAccess,
        grantComboAccess,
        revokeAccess
    });

})();
