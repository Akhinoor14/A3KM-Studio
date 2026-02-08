// PWA Install Prompt - Only Boss Mobile
// Add to Home Screen functionality

let deferredPrompt = null;
let isInstalled = false;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkIfInstalled();
    setupInstallPrompt();
});

// Check if app is already installed
function checkIfInstalled() {
    // Check if running as standalone PWA
    if (window.matchMedia('(display-mode: standalone)').matches || 
        window.navigator.standalone === true) {
        isInstalled = true;
        console.log('[PWA] App is installed');
        return true;
    }
    
    // Check localStorage flag
    const installDismissed = localStorage.getItem('pwa_install_dismissed');
    if (installDismissed) {
        const dismissedTime = parseInt(installDismissed);
        const daysSince = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);
        
        // Show prompt again after 7 days
        if (daysSince < 7) {
            return true;
        }
    }
    
    return false;
}

// Setup Install Prompt
function setupInstallPrompt() {
    // Listen for beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent default browser install prompt
        e.preventDefault();
        
        // Store event for later use
        deferredPrompt = e;
        
        console.log('[PWA] Install prompt ready');
        
        // Show custom install UI after 5 seconds
        if (!isInstalled && !checkIfInstalled()) {
            setTimeout(showInstallPrompt, 5000);
        }
    });
    
    // Listen for app installed event
    window.addEventListener('appinstalled', () => {
        console.log('[PWA] App installed successfully');
        isInstalled = true;
        deferredPrompt = null;
        hideInstallPrompt();
        
        // Show success message
        showInstallSuccess();
    });
}

// Show Install Prompt
function showInstallPrompt() {
    if (!deferredPrompt || isInstalled) return;
    
    // Create prompt UI
    const promptHTML = `
        <div class="pwa-install-prompt" id="pwaInstallPrompt">
            <div class="prompt-overlay" onclick="dismissInstallPrompt()"></div>
            <div class="prompt-container">
                <button class="prompt-close" onclick="dismissInstallPrompt()">
                    <i class="fas fa-times"></i>
                </button>
                
                <div class="prompt-icon">
                    <i class="fas fa-mobile-alt"></i>
                </div>
                
                <h3>Install Only Boss</h3>
                <p>Add to your home screen for quick access and offline support</p>
                
                <div class="prompt-features">
                    <div class="feature-item">
                        <i class="fas fa-zap"></i>
                        <span>Instant access</span>
                    </div>
                    <div class="feature-item">
                        <i class="fas fa-wifi-slash"></i>
                        <span>Works offline</span>
                    </div>
                    <div class="feature-item">
                        <i class="fas fa-bell"></i>
                        <span>Push notifications</span>
                    </div>
                </div>
                
                <div class="prompt-actions">
                    <button class="btn-secondary" onclick="dismissInstallPrompt()">
                        Not Now
                    </button>
                    <button class="btn-primary" onclick="installPWA()">
                        <i class="fas fa-download"></i> Install
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Add CSS if not already present
    if (!document.getElementById('pwaInstallStyles')) {
        const style = document.createElement('style');
        style.id = 'pwaInstallStyles';
        style.textContent = `
            .pwa-install-prompt {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
                animation: fadeIn 0.3s ease;
            }
            
            .prompt-overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.7);
                backdrop-filter: blur(4px);
            }
            
            .prompt-container {
                position: relative;
                background: #1E1E1E;
                border-radius: 20px;
                padding: 32px 24px;
                max-width: 400px;
                width: 100%;
                text-align: center;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                animation: slideUp 0.3s ease;
            }
            
            .prompt-close {
                position: absolute;
                top: 12px;
                right: 12px;
                width: 32px;
                height: 32px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.1);
                border: none;
                color: white;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
            }
            
            .prompt-close:hover {
                background: rgba(255, 255, 255, 0.2);
            }
            
            .prompt-icon {
                width: 80px;
                height: 80px;
                margin: 0 auto 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 36px;
                color: white;
            }
            
            .prompt-container h3 {
                font-size: 24px;
                font-weight: 700;
                color: white;
                margin-bottom: 12px;
            }
            
            .prompt-container p {
                font-size: 14px;
                color: rgba(255, 255, 255, 0.7);
                margin-bottom: 24px;
                line-height: 1.5;
            }
            
            .prompt-features {
                display: flex;
                justify-content: center;
                gap: 16px;
                margin-bottom: 24px;
                flex-wrap: wrap;
            }
            
            .feature-item {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 8px;
                padding: 12px;
                background: rgba(102, 126, 234, 0.1);
                border-radius: 12px;
                min-width: 80px;
            }
            
            .feature-item i {
                font-size: 20px;
                color: #667eea;
            }
            
            .feature-item span {
                font-size: 12px;
                color: rgba(255, 255, 255, 0.7);
                font-weight: 600;
            }
            
            .prompt-actions {
                display: flex;
                gap: 12px;
            }
            
            .prompt-actions button {
                flex: 1;
                padding: 14px 20px;
                border-radius: 12px;
                border: none;
                font-size: 15px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
            }
            
            .prompt-actions .btn-primary {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
            }
            
            .prompt-actions .btn-secondary {
                background: rgba(255, 255, 255, 0.1);
                color: white;
            }
            
            .prompt-actions button:hover {
                transform: translateY(-2px);
            }
            
            .prompt-actions button:active {
                transform: translateY(0);
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes slideUp {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Insert prompt into DOM
    const existingPrompt = document.getElementById('pwaInstallPrompt');
    if (!existingPrompt) {
        document.body.insertAdjacentHTML('beforeend', promptHTML);
        
        // Haptic feedback
        if (navigator.vibrate) {
            navigator.vibrate(20);
        }
    }
}

// Install PWA
async function installPWA() {
    if (!deferredPrompt) {
        console.log('[PWA] Install prompt not available');
        return;
    }
    
    // Show browser install prompt
    deferredPrompt.prompt();
    
    // Wait for user response
    const { outcome } = await deferredPrompt.userChoice;
    
    console.log(`[PWA] User response: ${outcome}`);
    
    if (outcome === 'accepted') {
        console.log('[PWA] User accepted installation');
        isInstalled = true;
    } else {
        console.log('[PWA] User dismissed installation');
        localStorage.setItem('pwa_install_dismissed', Date.now().toString());
    }
    
    // Clear prompt
    deferredPrompt = null;
    hideInstallPrompt();
}

// Dismiss Install Prompt
function dismissInstallPrompt() {
    hideInstallPrompt();
    localStorage.setItem('pwa_install_dismissed', Date.now().toString());
    
    console.log('[PWA] Install prompt dismissed');
}

// Hide Install Prompt
function hideInstallPrompt() {
    const prompt = document.getElementById('pwaInstallPrompt');
    if (prompt) {
        prompt.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => prompt.remove(), 300);
    }
}

// Show Install Success
function showInstallSuccess() {
    const successHTML = `
        <div class="pwa-success-toast" id="pwaSuccessToast">
            <i class="fas fa-check-circle"></i>
            <span>Successfully installed! You can now access Only Boss from your home screen.</span>
        </div>
    `;
    
    // Add CSS for success toast
    if (!document.getElementById('pwaSuccessStyles')) {
        const style = document.createElement('style');
        style.id = 'pwaSuccessStyles';
        style.textContent = `
            .pwa-success-toast {
                position: fixed;
                bottom: 80px;
                left: 50%;
                transform: translateX(-50%);
                background: linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%);
                color: white;
                padding: 16px 24px;
                border-radius: 12px;
                box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
                display: flex;
                align-items: center;
                gap: 12px;
                max-width: calc(100% - 40px);
                z-index: 10001;
                animation: slideUpToast 0.4s ease;
            }
            
            .pwa-success-toast i {
                font-size: 24px;
            }
            
            .pwa-success-toast span {
                font-size: 14px;
                font-weight: 600;
                line-height: 1.4;
            }
            
            @keyframes slideUpToast {
                from {
                    opacity: 0;
                    transform: translateX(-50%) translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateX(-50%) translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.insertAdjacentHTML('beforeend', successHTML);
    
    // Haptic feedback
    if (navigator.vibrate) {
        navigator.vibrate([50, 30, 50]);
    }
    
    // Remove after 5 seconds
    setTimeout(() => {
        const toast = document.getElementById('pwaSuccessToast');
        if (toast) {
            toast.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }
    }, 5000);
}

// Manual Install Button (can be called from UI)
function showManualInstallPrompt() {
    if (isInstalled) {
        alert('App is already installed!');
        return;
    }
    
    if (deferredPrompt) {
        showInstallPrompt();
    } else {
        alert('Install is not available on this device/browser.');
    }
}

// Export functions
window.installPWA = installPWA;
window.dismissInstallPrompt = dismissInstallPrompt;
window.showManualInstallPrompt = showManualInstallPrompt;

console.log('[PWA] Install prompt initialized');
