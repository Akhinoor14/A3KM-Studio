// Only Boss Portal - Simple Two-Step Authentication System
// New Simple Logic - Direct Password Verification

// ===========================
// PASSWORD CONFIGURATION
// ===========================

const PASSWORD_HASH = 'd7a5f8187ceede6c093445dad128e1b4ea2a21d91348a219b947ce2b70416212'; // SHA-256 hash only

// ===========================
// SESSION MANAGEMENT
// ===========================

function createSession() {
    const sessionId = 'boss_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    sessionStorage.setItem('onlyBossAuthenticated', sessionId);
    sessionStorage.setItem('authTime', new Date().getTime().toString());
}

function isAuthenticated() { 
    return sessionStorage.getItem('onlyBossAuthenticated') !== null;
}

function clearSession() { 
    sessionStorage.removeItem('onlyBossAuthenticated');
    sessionStorage.removeItem('authTime');
}

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
    const enteredHash = await hashPassword(password);
    if (enteredHash === PASSWORD_HASH) {
        createSession();
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

// Always show login page - require fresh authentication
// Clear any previous session when landing on login page
clearSession();
passwordInput.focus();

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