/**
 * PWA Install Prompt & Features
 * Progressive Web App functionality
 * Author: Md Akhinoor Islam
 * A3KM Studio
 */

class PWAManager {
    constructor() {
        this.deferredPrompt = null;
        this.isInstalled = false;
        this.init();
    }

    init() {
        // Check if already installed
        this.checkInstallation();
        
        // Listen for install prompt
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            this.showInstallButton();
        });

        // Listen for successful installation
        window.addEventListener('appinstalled', () => {
            this.isInstalled = true;
            this.hideInstallButton();
            console.log('✅ PWA installed successfully');
        });

        // Service Worker registration
        this.registerServiceWorker();
    }

    // ==================== SERVICE WORKER ====================

    async registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('./service-worker.js');
                console.log('✅ Service Worker registered:', registration.scope);
                
                // Check for updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            this.showUpdatePrompt();
                        }
                    });
                });
            } catch (error) {
                console.error('❌ Service Worker registration failed:', error);
            }
        }
    }

    // ==================== INSTALLATION ====================

    checkInstallation() {
        // Check if app is installed
        if (window.matchMedia('(display-mode: standalone)').matches || 
            window.navigator.standalone === true) {
            this.isInstalled = true;
            console.log('✅ Running as installed PWA');
        }
    }

    showInstallButton() {
        // Create install banner
        const banner = document.createElement('div');
        banner.id = 'pwa-install-banner';
        banner.className = 'pwa-install-banner';
        banner.innerHTML = `
            <div class="banner-content">
                <div class="banner-icon">📱</div>
                <div class="banner-text">
                    <strong>Install A3KM Studio</strong>
                    <p>Get quick access and offline support</p>
                </div>
                <button class="install-btn" onclick="pwaManager.installApp()">Install</button>
                <button class="close-btn" onclick="pwaManager.hideInstallButton()">✕</button>
            </div>
        `;
        
        document.body.appendChild(banner);
        
        // Show after delay
        setTimeout(() => {
            banner.classList.add('show');
        }, 2000);
    }

    hideInstallButton() {
        const banner = document.getElementById('pwa-install-banner');
        if (banner) {
            banner.classList.remove('show');
            setTimeout(() => banner.remove(), 300);
        }
    }

    async installApp() {
        if (!this.deferredPrompt) {
            console.log('Install prompt not available');
            return;
        }

        // Show install prompt
        this.deferredPrompt.prompt();
        
        // Wait for user choice
        const { outcome } = await this.deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
            console.log('✅ User accepted installation');
        } else {
            console.log('❌ User dismissed installation');
        }
        
        // Clear prompt
        this.deferredPrompt = null;
        this.hideInstallButton();
    }

    // ==================== UPDATE PROMPT ====================

    showUpdatePrompt() {
        const updateBanner = document.createElement('div');
        updateBanner.className = 'update-banner';
        updateBanner.innerHTML = `
            <div class="banner-content">
                <span>🔄 New version available!</span>
                <button onclick="pwaManager.updateApp()">Update Now</button>
            </div>
        `;
        
        document.body.appendChild(updateBanner);
    }

    async updateApp() {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration && registration.waiting) {
            registration.waiting.postMessage({ type: 'SKIP_WAITING' });
            window.location.reload();
        }
    }

    // ==================== PUSH NOTIFICATIONS ====================

    async requestNotificationPermission() {
        if (!('Notification' in window)) {
            console.log('Notifications not supported');
            return false;
        }

        if (Notification.permission === 'granted') {
            return true;
        }

        if (Notification.permission !== 'denied') {
            const permission = await Notification.requestPermission();
            return permission === 'granted';
        }

        return false;
    }

    async subscribeToPush() {
        const permission = await this.requestNotificationPermission();
        if (!permission) {
            console.log('Notification permission denied');
            return;
        }

        try {
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: this.urlBase64ToUint8Array(this.getVapidPublicKey())
            });
            
            console.log('✅ Push subscription:', subscription);
            
            // Send subscription to server (implement your backend)
            // await this.sendSubscriptionToServer(subscription);
            
            return subscription;
        } catch (error) {
            console.error('Push subscription failed:', error);
        }
    }

    async showNotification(title, options = {}) {
        const permission = await this.requestNotificationPermission();
        if (!permission) return;

        const defaultOptions = {
            body: 'New content available in A3KM Studio',
            icon: '/images/icon-192.png',
            badge: '/images/badge-72.png',
            vibrate: [200, 100, 200],
            data: {
                url: window.location.origin
            }
        };

        const registration = await navigator.serviceWorker.ready;
        registration.showNotification(title, { ...defaultOptions, ...options });
    }

    // ==================== OFFLINE DETECTION ====================

    setupOfflineDetection() {
        window.addEventListener('online', () => {
            this.showToast('✅ Back online!', 'success');
            this.syncOfflineData();
        });

        window.addEventListener('offline', () => {
            this.showToast('📡 You are offline', 'warning');
        });
    }

    async syncOfflineData() {
        if ('sync' in navigator.serviceWorker) {
            const registration = await navigator.serviceWorker.ready;
            try {
                await registration.sync.register('sync-analytics');
                console.log('Background sync registered');
            } catch (error) {
                console.error('Background sync failed:', error);
            }
        }
    }

    // ==================== SHARE API ====================

    async shareContent(title, text, url) {
        if (navigator.share) {
            try {
                await navigator.share({ title, text, url });
                console.log('✅ Content shared successfully');
            } catch (error) {
                if (error.name !== 'AbortError') {
                    console.error('Share failed:', error);
                }
            }
        } else {
            // Fallback: copy to clipboard
            this.copyToClipboard(url);
            this.showToast('Link copied to clipboard!', 'success');
        }
    }

    // ==================== UTILITY FUNCTIONS ====================

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `pwa-toast ${type}`;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => toast.classList.add('show'), 100);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    copyToClipboard(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    }

    urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/\-/g, '+')
            .replace(/_/g, '/');
        
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
        
        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        
        return outputArray;
    }

    getVapidPublicKey() {
        // Replace with your VAPID public key
        return 'YOUR_VAPID_PUBLIC_KEY_HERE';
    }

    // ==================== ANALYTICS ====================

    trackPWAInstall() {
        if (this.isInstalled) {
            // Track installation event (implement your analytics)
            console.log('PWA installation tracked');
        }
    }
}

// ==================== PWA STYLES ====================

const pwaStyles = `
<style>
.pwa-install-banner {
    position: fixed;
    bottom: -150px;
    left: 20px;
    right: 20px;
    background: linear-gradient(135deg, #8B0000 0%, #5a0000 100%);
    color: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    z-index: 10000;
    transition: bottom 0.3s ease;
    max-width: 500px;
}

.pwa-install-banner.show {
    bottom: 20px;
}

.banner-content {
    display: flex;
    align-items: center;
    gap: 15px;
}

.banner-icon {
    font-size: 32px;
}

.banner-text {
    flex: 1;
}

.banner-text strong {
    display: block;
    font-size: 16px;
    margin-bottom: 5px;
}

.banner-text p {
    font-size: 14px;
    opacity: 0.9;
    margin: 0;
}

.install-btn {
    background: white;
    color: #8B0000;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s;
}

.install-btn:hover {
    transform: scale(1.05);
    box-shadow: 0 2px 10px rgba(255, 255, 255, 0.3);
}

.close-btn {
    background: none;
    border: none;
    color: white;
    font-size: 20px;
    cursor: pointer;
    opacity: 0.7;
    transition: opacity 0.2s;
}

.close-btn:hover {
    opacity: 1;
}

.update-banner {
    position: fixed;
    top: 20px;
    right: 20px;
    background: #4CAF50;
    color: white;
    padding: 15px 20px;
    border-radius: 5px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    z-index: 10000;
    animation: slideIn 0.3s ease;
}

@keyframes slideIn {
    from {
        transform: translateX(400px);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

.update-banner button {
    background: white;
    color: #4CAF50;
    border: none;
    padding: 8px 15px;
    border-radius: 3px;
    margin-left: 15px;
    cursor: pointer;
    font-weight: bold;
}

.pwa-toast {
    position: fixed;
    bottom: -100px;
    left: 50%;
    transform: translateX(-50%);
    background: #333;
    color: white;
    padding: 15px 30px;
    border-radius: 5px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
    z-index: 10001;
    transition: bottom 0.3s ease;
}

.pwa-toast.show {
    bottom: 20px;
}

.pwa-toast.success {
    background: #4CAF50;
}

.pwa-toast.warning {
    background: #FF9800;
}

.pwa-toast.error {
    background: #F44336;
}

@media (max-width: 768px) {
    .pwa-install-banner {
        left: 10px;
        right: 10px;
        padding: 15px;
    }
    
    .banner-content {
        flex-wrap: wrap;
    }
    
    .banner-icon {
        font-size: 24px;
    }
}
</style>
`;

// Inject styles
document.head.insertAdjacentHTML('beforeend', pwaStyles);

// ==================== GLOBAL INSTANCE ====================

window.pwaManager = new PWAManager();

// Setup offline detection
pwaManager.setupOfflineDetection();

// Expose share function globally
window.shareContent = (title, text, url) => pwaManager.shareContent(title, text, url);

console.log('📱 PWA Manager Loaded');
