// Settings Manager - Mobile Admin
let currentSettings = {
    github: {
        token: '',
        repo: ''
    },
    session: {
        timeout: 30,
        keepLoggedIn: false
    },
    theme: {
        mode: 'dark',
        accentColor: '#9C27B0'
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadSettings();
    setupEventListeners();
    updateSessionInfo();
    setInterval(updateSessionInfo, 1000);
});

// Setup Event Listeners
function setupEventListeners() {
    // Password length slider
    const lengthSlider = document.getElementById('passwordLength');
    lengthSlider.addEventListener('input', (e) => {
        document.getElementById('lengthValue').textContent = e.target.value;
    });
    
    // Accent color picker
    const colorPicker = document.getElementById('accentColor');
    colorPicker.addEventListener('input', (e) => {
        document.getElementById('colorValue').textContent = e.target.value;
        document.documentElement.style.setProperty('--primary-color', e.target.value);
    });
    
    // Expand first section by default
    toggleSection('github');
}

// Load Settings
function loadSettings() {
    // GitHub settings
    const githubToken = localStorage.getItem('github_token') || '';
    const githubRepo = localStorage.getItem('github_repo') || 'Akhinoor14/A3KM-Studio';
    
    document.getElementById('githubToken').value = githubToken;
    document.getElementById('githubRepo').value = githubRepo;
    
    currentSettings.github.token = githubToken;
    currentSettings.github.repo = githubRepo;
    
    updateGitHubStatus();
    
    // Session settings
    const sessionTimeout = localStorage.getItem('session_timeout') || '30';
    const keepLoggedIn = localStorage.getItem('keep_logged_in') === 'true';
    
    document.getElementById('sessionTimeout').value = sessionTimeout;
    document.getElementById('keepLoggedIn').checked = keepLoggedIn;
    
    currentSettings.session.timeout = parseInt(sessionTimeout);
    currentSettings.session.keepLoggedIn = keepLoggedIn;
    
    // Theme settings
    const themeMode = localStorage.getItem('theme_mode') || 'dark';
    const accentColor = localStorage.getItem('accent_color') || '#9C27B0';
    
    selectTheme(themeMode);
    document.getElementById('accentColor').value = accentColor;
    document.getElementById('colorValue').textContent = accentColor;
    
    currentSettings.theme.mode = themeMode;
    currentSettings.theme.accentColor = accentColor;
    
    applyTheme();
}

// Update Session Info
function updateSessionInfo() {
    const authTime = sessionStorage.getItem('authTime');
    if (!authTime) {
        document.getElementById('sessionTime').textContent = 'Not logged in';
        document.getElementById('loginTime').textContent = 'Not available';
        return;
    }
    
    const elapsed = Date.now() - parseInt(authTime);
    const timeout = currentSettings.session.timeout * 60 * 1000;
    const remaining = timeout - elapsed;
    
    if (remaining <= 0 && timeout > 0) {
        document.getElementById('sessionTime').textContent = 'Expired';
        return;
    }
    
    if (timeout === 0) {
        document.getElementById('sessionTime').textContent = 'Never expires';
    } else {
        const minutes = Math.floor(remaining / 60000);
        const seconds = Math.floor((remaining % 60000) / 1000);
        document.getElementById('sessionTime').textContent = 
            `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    
    // Login time
    const loginDate = new Date(parseInt(authTime));
    document.getElementById('loginTime').textContent = formatDateTime(loginDate);
}

// Format Date Time
function formatDateTime(date) {
    return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Toggle Section
function toggleSection(sectionId) {
    const content = document.getElementById(`${sectionId}-content`);
    const header = content.previousElementSibling;
    
    // Close all sections
    document.querySelectorAll('.section-content').forEach(section => {
        if (section.id !== `${sectionId}-content`) {
            section.classList.remove('open');
            section.previousElementSibling.classList.remove('active');
        }
    });
    
    // Toggle current section
    content.classList.toggle('open');
    header.classList.toggle('active');
    
    // Haptic feedback
    if (navigator.vibrate) {
        navigator.vibrate(10);
    }
}

// Update GitHub Status
function updateGitHubStatus() {
    const statusText = document.getElementById('githubStatusText');
    const token = currentSettings.github.token;
    
    if (token) {
        statusText.textContent = 'Token configured';
        statusText.style.color = 'var(--success-color)';
    } else {
        statusText.textContent = 'Not connected';
        statusText.style.color = 'var(--text-secondary)';
    }
}

// Toggle Token Visibility
function toggleTokenVisibility() {
    const tokenInput = document.getElementById('githubToken');
    const eyeIcon = document.getElementById('tokenEyeIcon');
    
    if (tokenInput.type === 'password') {
        tokenInput.type = 'text';
        eyeIcon.classList.remove('fa-eye');
        eyeIcon.classList.add('fa-eye-slash');
    } else {
        tokenInput.type = 'password';
        eyeIcon.classList.remove('fa-eye-slash');
        eyeIcon.classList.add('fa-eye');
    }
}

// Test GitHub Connection
async function testGitHubConnection() {
    const token = document.getElementById('githubToken').value.trim();
    const statusElement = document.getElementById('connectionStatus');
    
    if (!token) {
        showToast('⚠️ Please enter a token', 'warning');
        return;
    }
    
    statusElement.textContent = 'Testing connection...';
    statusElement.className = 'connection-status';
    statusElement.style.display = 'block';
    
    try {
        const response = await fetch('https://api.github.com/user', {
            headers: {
                'Authorization': `token ${token}`
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            statusElement.textContent = `✓ Connected as ${data.login}`;
            statusElement.className = 'connection-status success';
            showToast('✓ GitHub connection successful!', 'success');
        } else {
            statusElement.textContent = '✗ Invalid token or unauthorized';
            statusElement.className = 'connection-status error';
            showToast('✗ Connection failed', 'error');
        }
    } catch (error) {
        statusElement.textContent = '✗ Connection error';
        statusElement.className = 'connection-status error';
        showToast('✗ Network error', 'error');
    }
}

// Save GitHub Settings
function saveGitHubSettings() {
    const token = document.getElementById('githubToken').value.trim();
    const repo = document.getElementById('githubRepo').value.trim();
    
    if (!token) {
        showToast('⚠️ Token is required', 'warning');
        return;
    }
    
    localStorage.setItem('github_token', token);
    localStorage.setItem('github_repo', repo);
    
    currentSettings.github.token = token;
    currentSettings.github.repo = repo;
    
    updateGitHubStatus();
    showToast('✓ GitHub settings saved!', 'success');
}

// Generate Password
function generatePassword() {
    const length = parseInt(document.getElementById('passwordLength').value);
    const includeUppercase = document.getElementById('includeUppercase').checked;
    const includeLowercase = document.getElementById('includeLowercase').checked;
    const includeNumbers = document.getElementById('includeNumbers').checked;
    const includeSymbols = document.getElementById('includeSymbols').checked;
    
    if (!includeUppercase && !includeLowercase && !includeNumbers && !includeSymbols) {
        showToast('⚠️ Select at least one character type', 'warning');
        return;
    }
    
    let charset = '';
    if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) charset += '0123456789';
    if (includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    let password = '';
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);
    
    for (let i = 0; i < length; i++) {
        password += charset[array[i] % charset.length];
    }
    
    document.getElementById('generatedPassword').value = password;
    showToast('✓ Password generated!', 'success');
    
    // Haptic feedback
    if (navigator.vibrate) {
        navigator.vibrate([10, 20, 10]);
    }
}

// Copy Password
function copyPassword() {
    const passwordInput = document.getElementById('generatedPassword');
    const password = passwordInput.value;
    
    if (!password) {
        showToast('⚠️ Generate a password first', 'warning');
        return;
    }
    
    passwordInput.select();
    passwordInput.setSelectionRange(0, 99999); // Mobile compatibility
    
    navigator.clipboard.writeText(password).then(() => {
        showToast('✓ Password copied to clipboard!', 'success');
        
        // Haptic feedback
        if (navigator.vibrate) {
            navigator.vibrate(20);
        }
    }).catch(() => {
        showToast('✗ Failed to copy', 'error');
    });
}

// Select Theme
function selectTheme(theme) {
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.theme === theme) {
            btn.classList.add('active');
        }
    });
    
    currentSettings.theme.mode = theme;
}

// Apply Theme
function applyTheme() {
    const mode = currentSettings.theme.mode;
    const accentColor = currentSettings.theme.accentColor;
    
    // Apply theme mode (future implementation for light mode)
    document.body.classList.remove('light-theme', 'dark-theme');
    document.body.classList.add(`${mode}-theme`);
    
    // Apply accent color
    document.documentElement.style.setProperty('--primary-color', accentColor);
}

// Export Settings
function exportSettings() {
    const settings = {
        github: {
            token: currentSettings.github.token,
            repo: currentSettings.github.repo
        },
        session: {
            timeout: document.getElementById('sessionTimeout').value,
            keepLoggedIn: document.getElementById('keepLoggedIn').checked
        },
        theme: {
            mode: currentSettings.theme.mode,
            accentColor: document.getElementById('accentColor').value
        },
        exportDate: new Date().toISOString(),
        version: '1.0.0'
    };
    
    const jsonData = JSON.stringify(settings, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `onlyboss-settings-${Date.now()}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
    showToast('✓ Settings exported!', 'success');
}

// Import Settings
function importSettings() {
    document.getElementById('importFile').click();
}

// Handle Import
function handleImport(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const settings = JSON.parse(e.target.result);
            
            // Apply imported settings
            if (settings.github) {
                document.getElementById('githubToken').value = settings.github.token || '';
                document.getElementById('githubRepo').value = settings.github.repo || '';
            }
            
            if (settings.session) {
                document.getElementById('sessionTimeout').value = settings.session.timeout || '30';
                document.getElementById('keepLoggedIn').checked = settings.session.keepLoggedIn || false;
            }
            
            if (settings.theme) {
                selectTheme(settings.theme.mode || 'dark');
                document.getElementById('accentColor').value = settings.theme.accentColor || '#9C27B0';
                document.getElementById('colorValue').textContent = settings.theme.accentColor || '#9C27B0';
            }
            
            showToast('✓ Settings imported!', 'success');
        } catch (error) {
            showToast('✗ Invalid settings file', 'error');
        }
    };
    
    reader.readAsText(file);
    event.target.value = '';
}

// Clear Cache
function clearCache() {
    const confirmed = confirm('Clear all cache data?\n\nThis will not affect your settings or logout your session.');
    if (!confirmed) return;
    
    // Clear cache (future implementation with service worker)
    if ('caches' in window) {
        caches.keys().then(names => {
            names.forEach(name => caches.delete(name));
        });
    }
    
    showToast('✓ Cache cleared!', 'success');
}

// Reset Settings
function resetSettings() {
    const confirmed = confirm('Reset all settings to defaults?\n\nThis will:\n• Clear GitHub token\n• Reset session settings\n• Reset theme settings\n\nYou will NOT be logged out.');
    if (!confirmed) return;
    
    // Clear settings
    localStorage.removeItem('github_token');
    localStorage.removeItem('github_repo');
    localStorage.removeItem('session_timeout');
    localStorage.removeItem('keep_logged_in');
    localStorage.removeItem('theme_mode');
    localStorage.removeItem('accent_color');
    
    // Reload settings
    loadSettings();
    
    showToast('✓ Settings reset to defaults!', 'success');
}

// Save All Settings
function saveAllSettings() {
    // GitHub
    const token = document.getElementById('githubToken').value.trim();
    const repo = document.getElementById('githubRepo').value.trim();
    
    if (token) {
        localStorage.setItem('github_token', token);
        localStorage.setItem('github_repo', repo);
    }
    
    // Session
    const timeout = document.getElementById('sessionTimeout').value;
    const keepLoggedIn = document.getElementById('keepLoggedIn').checked;
    
    localStorage.setItem('session_timeout', timeout);
    localStorage.setItem('keep_logged_in', keepLoggedIn ? 'true' : 'false');
    
    // Theme
    const accentColor = document.getElementById('accentColor').value;
    
    localStorage.setItem('theme_mode', currentSettings.theme.mode);
    localStorage.setItem('accent_color', accentColor);
    
    currentSettings.theme.accentColor = accentColor;
    applyTheme();
    updateGitHubStatus();
    
    showToast('✓ All settings saved!', 'success');
}

// Show Privacy Policy
function showPrivacyPolicy() {
    alert('Privacy Policy\n\nOnly Boss Mobile stores your GitHub token locally in your browser. Your data never leaves your device unless you explicitly sync with GitHub.\n\nWe do not collect, transmit, or store any personal information on external servers.');
}

// Show Terms
function showTerms() {
    alert('Terms of Service\n\nOnly Boss Mobile is provided "as is" for personal use only. You are responsible for securing your GitHub token and managing your repository.\n\nBy using this app, you agree to GitHub\'s Terms of Service when performing GitHub operations.');
}

// Handle Logout
function handleLogout() {
    const confirmed = confirm('Logout from Only Boss?\n\nYour settings will be preserved.');
    if (!confirmed) return;
    
    sessionStorage.clear();
    showToast('✓ Logged out successfully', 'success');
    
    setTimeout(() => {
        window.location.href = '../auth/login.html';
    }, 1000);
}

// Show Toast
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = 'toast show';
    
    if (type === 'success') {
        toast.style.background = 'linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)';
    } else if (type === 'error') {
        toast.style.background = 'linear-gradient(135deg, #F44336 0%, #E57373 100%)';
    } else if (type === 'warning') {
        toast.style.background = 'linear-gradient(135deg, #FF9800 0%, #FFB74D 100%)';
    } else {
        toast.style.background = 'linear-gradient(135deg, #2196F3 0%, #64B5F6 100%)';
    }
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Navigation
function goBack() {
    window.location.href = '../../dashboard/index.html';
}
