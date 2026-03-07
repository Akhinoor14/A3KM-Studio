// Only Boss Portal - Two-Layer Authentication System
// Layer 1: Google OAuth admin check (new)
// Layer 2: SHA-256 password (original)

// ===========================
// LAYER 1: GOOGLE ADMIN SIGN-IN
// ===========================

let adminGoogleVerified = false;

function showStep(id) {
    document.querySelectorAll('.auth-step').forEach(function (s) { s.classList.remove('active'); });
    var el = document.getElementById(id);
    if (el) el.classList.add('active');
}

function showStep0Error(msg) {
    var el = document.getElementById('error0');
    if (!el) return;
    el.textContent = msg;
    el.style.display = 'block';
    setTimeout(function () { el.style.display = 'none'; }, 4000);
}

window.doGoogleSignIn = async function () {
    var btn = document.getElementById('googleSignInBtn');
    btn.disabled = true;
    btn.textContent = 'Signing in…';

    try {
        var fbAuth = window.A3KM.auth;
        var provider = new firebase.auth.GoogleAuthProvider();
        var result = await fbAuth.signInWithPopup(provider);
        var email = result.user.email;
        var adminEmails = window.A3KM.ADMIN_EMAILS || [window.A3KM.ADMIN_EMAIL];

        if (!adminEmails.includes(email)) {
            await fbAuth.signOut();
            showStep0Error('❌ This account is not authorized as admin.');
            btn.disabled = false;
            btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true" style="flex-shrink:0;vertical-align:middle;margin-right:8px"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.08 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59L2.56 17.8C.92 21.04 0 24.41 0 28c0 3.59.92 6.96 2.56 9.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6C29.96 37.81 27.18 38.64 24 38.64c-6.26 0-11.57-3.59-13.46-8.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>Sign in with Google';
            return;
        }

        // Admin verified — unlock password step
        adminGoogleVerified = true;
        showStep('step1');
        setTimeout(function () {
            var pi = document.getElementById('password1');
            if (pi) pi.focus();
        }, 100);

    } catch (err) {
        if (err.code !== 'auth/popup-closed-by-user') {
            showStep0Error('❌ Sign-in failed. Please try again.');
        }
        btn.disabled = false;
        btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true" style="flex-shrink:0;vertical-align:middle;margin-right:8px"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.08 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59L2.56 17.8C.92 21.04 0 24.41 0 28c0 3.59.92 6.96 2.56 9.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6C29.96 37.81 27.18 38.64 24 38.64c-6.26 0-11.57-3.59-13.46-8.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>Sign in with Google';
    }
};

// If Firebase already has an admin session active (e.g. after popup-blocked redirect), skip Step 1
document.addEventListener('DOMContentLoaded', function () {
    var fbAuth = window.A3KM && window.A3KM.auth;
    if (!fbAuth) return;
    fbAuth.onAuthStateChanged(function (user) {
        var adminEmails = window.A3KM.ADMIN_EMAILS || [window.A3KM.ADMIN_EMAIL];
        if (user && adminEmails.includes(user.email) && !adminGoogleVerified) {
            adminGoogleVerified = true;
            showStep('step1');
            setTimeout(function () {
                var pi = document.getElementById('password1');
                if (pi) pi.focus();
            }, 100);
        }
    });
});

// ===========================
// PASSWORD CONFIGURATION
// ===========================

// Triple-layer obfuscated password hash
const _0x1a2b = ['ZDdhNWY4MTg3Y2VlZGU2YzA5MzQ0NWRhZDEyOGUxYjRlYTJhMjFkOTEzNDhhMjE5Yjk0N2NlMmI3MDQxNjIxMg=='];
const _0x3c4d = () => atob(_0x1a2b[0]);
const _verify_key = 'a3km_studio_2026';

function getPasswordHash() {
    const h = _0x3c4d();
    // Add runtime verification
    if (h.length !== 64) return null;
    return h;
}

// Browser fingerprint for additional security
async function getBrowserFingerprint() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('A3KM', 2, 2);
    const canvasData = canvas.toDataURL();
    
    const fingerprint = {
        canvas: canvasData,
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        screen: `${screen.width}x${screen.height}x${screen.colorDepth}`
    };
    
    const fpString = JSON.stringify(fingerprint);
    const msgBuffer = new TextEncoder().encode(fpString);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// ===========================
// SESSION MANAGEMENT
// ===========================

// Generate cryptographically secure session token
function generateSecureToken() {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// Create encrypted session with validation and browser fingerprint
async function createSession(password) {
    const timestamp = Date.now();
    const sessionId = generateSecureToken();
    const fingerprint = await getBrowserFingerprint();
    
    // Create session signature by hashing session data + password + fingerprint
    const sessionData = `${sessionId}:${timestamp}:${password}:${fingerprint}:${_verify_key}`;
    const signature = await hashPassword(sessionData);
    
    // Store encrypted session data with fingerprint
    const sessionPayload = btoa(JSON.stringify({
        id: sessionId,
        timestamp: timestamp,
        sig: signature,
        fp: fingerprint,
        validated: true,
        _k: await hashPassword(_verify_key + timestamp)
    }));
    
    sessionStorage.setItem('onlyBossAuthenticated', sessionPayload);
    sessionStorage.setItem('authTime', timestamp.toString());
    
    // Set a verification flag with encoded timestamp
    const verificationKey = await hashPassword(`verify:${timestamp}:${fingerprint}`);
    sessionStorage.setItem('_vk', verificationKey);
    
    // Additional hidden verification
    sessionStorage.setItem('_sid', await hashPassword(sessionId + fingerprint));
}

// Validate session integrity with browser fingerprint
async function validateSession() {
    try {
        const sessionData = sessionStorage.getItem('onlyBossAuthenticated');
        const authTime = sessionStorage.getItem('authTime');
        const verificationKey = sessionStorage.getItem('_vk');
        const sessionIdHash = sessionStorage.getItem('_sid');
        
        if (!sessionData || !authTime || !verificationKey || !sessionIdHash) {
            return false;
        }
        
        // Decode and parse session
        const session = JSON.parse(atob(sessionData));
        
        // Verify structure
        if (!session.id || !session.timestamp || !session.sig || 
            !session.validated || !session.fp || !session._k) {
            return false;
        }
        
        // Verify timestamp matches
        if (session.timestamp.toString() !== authTime) {
            return false;
        }
        
        // Verify browser fingerprint matches
        const currentFingerprint = await getBrowserFingerprint();
        if (session.fp !== currentFingerprint) {
            console.error('🚨 Browser fingerprint mismatch - possible session hijacking');
            return false;
        }
        
        // Verify verification key
        const expectedVK = await hashPassword(`verify:${authTime}:${currentFingerprint}`);
        if (verificationKey !== expectedVK) {
            return false;
        }
        
        // Verify session ID hash
        const expectedSidHash = await hashPassword(session.id + currentFingerprint);
        if (sessionIdHash !== expectedSidHash) {
            return false;
        }
        
        // Verify internal key
        const expectedK = await hashPassword(_verify_key + authTime);
        if (session._k !== expectedK) {
            return false;
        }
        
        // Check session age (30 minutes)
        const currentTime = Date.now();
        const sessionAge = currentTime - parseInt(authTime);
        if (sessionAge > 30 * 60 * 1000) {
            return false;
        }
        
        return true;
    } catch (e) {
        return false;
    }
}

function isAuthenticated() { 
    return sessionStorage.getItem('onlyBossAuthenticated') !== null;
}

function clearSession() { 
    sessionStorage.removeItem('onlyBossAuthenticated');
    sessionStorage.removeItem('authTime');
    sessionStorage.removeItem('_vk');
    sessionStorage.removeItem('_sid');
}

// Anti-debugging protection
(function() {
    let devtoolsOpen = false;
    const checkDevTools = () => {
        const widthThreshold = window.outerWidth - window.innerWidth > 160;
        const heightThreshold = window.outerHeight - window.innerHeight > 160;
        
        if (widthThreshold || heightThreshold) {
            if (!devtoolsOpen) {
                devtoolsOpen = true;
                // Clear session if devtools detected during login
                if (window.location.pathname.includes('only-boss.html')) {
                    clearSession();
                }
            }
        } else {
            devtoolsOpen = false;
        }
    };
    
    setInterval(checkDevTools, 1000);
    
    // Prevent right-click
    document.addEventListener('contextmenu', (e) => {
        if (window.location.pathname.includes('Only-boss')) {
            e.preventDefault();
            return false;
        }
    });
    
    // Detect debugging attempts
    setInterval(() => {
        const before = Date.now();
        debugger;
        const after = Date.now();
        if (after - before > 100) {
            clearSession();
            window.location.href = '../../Home/index.html';
        }
    }, 5000);
})();

// ===========================
// UI STATE MANAGEMENT
// ===========================

const passwordInput = document.getElementById('password1');
const loginBtn = document.getElementById('step1Btn');
const errorMsg = document.getElementById('error1');

function showSuccess() {
    window.location.href = '../dashboard/only-boss-dashboard-redesigned.html';
}

function showError(message) {
    errorMsg.textContent = message;
    errorMsg.style.display = 'block';
    errorMsg.parentElement.classList.add('shake');
    setTimeout(() => { 
        errorMsg.parentElement.classList.remove('shake'); 
    }, 300);
    setTimeout(() => { 
        errorMsg.style.display = 'none'; 
    }, 3000);
}

// ===========================
// SECURE SINGLE-STEP AUTHENTICATION LOGIC
// ===========================

async function hashPassword(password) {
    const msgBuffer = new TextEncoder().encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function verifyLogin() {
    const password = passwordInput.value.trim();
    if (!password) {
        showError('⚠️ Please enter the password');
        return;
    }
    // Guard: Layer 1 must be completed first
    if (!adminGoogleVerified) {
        showError('\u26a0\ufe0f Complete Step 1 (Google sign-in) first');
        return;
    }    
    // Verify password hash is valid
    const correctHash = getPasswordHash();
    if (!correctHash) {
        showError('🚨 Security error');
        return;
    }
    
    const enteredHash = await hashPassword(password);
    
    if (enteredHash === correctHash) {
        // Verify browser environment before creating session
        const fingerprint = await getBrowserFingerprint();
        if (!fingerprint) {
            showError('🚨 Browser verification failed');
            return;
        }
        
        await createSession(password);
        showSuccess();
    } else {
        showError('❌ Incorrect password');
        passwordInput.value = '';
        passwordInput.focus();
    }
}

// ===========================
// EVENT LISTENERS
// ===========================

loginBtn.addEventListener('click', verifyLogin);
passwordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        verifyLogin();
    }
});

// ===========================
// PASSWORD TOGGLE FUNCTION
// ===========================

window.togglePassword = function(inputId, button) {
    const input = document.getElementById(inputId);
    const icon = button.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
        button.style.color = '#ffd700';
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
        button.style.color = 'rgba(255,255,255,0.6)';
    }
};

// ===========================
// INITIALIZATION
// ===========================

// Always clear password session on page load (require fresh auth each visit)
clearSession();
// Password input focus is handled after Google sign-in completes (Step 1 → Step 2)

// Session timeout - 30 minutes
let inactivityTimer;
function resetInactivityTimer() {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
        if (isAuthenticated()) {
            console.log('⏱️ Session timeout');
            clearSession();
            alert('Session expired due to inactivity');
            window.location.reload();
        }
    }, 30 * 60 * 1000);
}

['mousedown', 'keydown', 'scroll', 'touchstart'].forEach(evt => 
    document.addEventListener(evt, resetInactivityTimer)
);
resetInactivityTimer();

// All password-related console logs removed for security.