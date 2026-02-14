/**
 * A3KM Studio - Update Notifier
 * Checks for content updates and notifies users
 * Works for both PWA installed users and website visitors
 */

class UpdateNotifier {
    constructor() {
        this.currentVersion = 'v3.1.0-2026-02-15-enhanced';
        this.versionURL = '/version.json';
        this.checkInterval = 6 * 60 * 60 * 1000; // Check every 6 hours
        this.lastCheckTime = null;
        this.updateAvailable = false;
        this.latestVersion = null;
        
        this.init();
    }
    
    /**
     * Initialize update notifier
     */
    async init() {
        // Load last check time
        const lastCheck = localStorage.getItem('a3km_last_update_check');
        if (lastCheck) {
            this.lastCheckTime = new Date(lastCheck);
        }
        
        // Check for updates on load (if online)
        if (navigator.onLine) {
            await this.checkForUpdates();
        }
        
        // Set up periodic checks
        setInterval(() => {
            if (navigator.onLine) {
                this.checkForUpdates();
            }
        }, this.checkInterval);
        
        // Listen for online event (check when coming back online)
        window.addEventListener('online', () => {
            console.log('🌐 Connection restored - checking for updates');
            this.checkForUpdates();
        });
    }
    
    /**
     * Check for updates from server
     */
    async checkForUpdates() {
        try {
            console.log('🔍 Checking for updates...');
            
            const response = await fetch(this.versionURL + '?t=' + Date.now(), {
                cache: 'no-store'
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch version info');
            }
            
            const versionData = await response.json();
            this.latestVersion = versionData;
            
            // Update last check time
            this.lastCheckTime = new Date();
            localStorage.setItem('a3km_last_update_check', this.lastCheckTime.toISOString());
            
            // Compare versions
            if (this.isNewerVersion(versionData.version, this.currentVersion)) {
                console.log('🆕 New version available:', versionData.version);
                this.updateAvailable = true;
                this.showUpdateNotification(versionData);
            } else {
                console.log('✅ Already up to date:', this.currentVersion);
            }
            
        } catch (error) {
            console.error('❌ Update check failed:', error);
        }
    }
    
    /**
     * Compare versions
     */
    isNewerVersion(latestVersion, currentVersion) {
        // Extract version numbers (e.g., "v3.2.0" -> [3, 2, 0])
        const parseVersion = (v) => {
            const match = v.match(/v?(\d+)\.(\d+)\.(\d+)/);
            return match ? [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])] : [0, 0, 0];
        };
        
        const latest = parseVersion(latestVersion);
        const current = parseVersion(currentVersion);
        
        // Compare major.minor.patch
        for (let i = 0; i < 3; i++) {
            if (latest[i] > current[i]) return true;
            if (latest[i] < current[i]) return false;
        }
        
        return false;
    }
    
    /**
     * Show update notification
     */
    showUpdateNotification(versionData) {
        const isPWA = this.isPWAInstalled();
        
        if (isPWA) {
            // PWA user - trigger automatic update
            this.showPWAUpdateNotification(versionData);
        } else {
            // Website visitor - encourage installation
            this.showWebsiteUpdateBanner(versionData);
        }
    }
    
    /**
     * Check if PWA is installed
     */
    isPWAInstalled() {
        return window.matchMedia('(display-mode: standalone)').matches ||
               window.navigator.standalone === true ||
               localStorage.getItem('a3km_pwa_installed') === 'true';
    }
    
    /**
     * Show update notification for PWA users
     * This triggers the offline content manager to re-download
     */
    showPWAUpdateNotification(versionData) {
        // Create subtle notification
        const notification = document.createElement('div');
        notification.id = 'pwa-update-notification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 999998;
            background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%);
            border: 2px solid rgba(139, 0, 0, 0.6);
            border-radius: 16px;
            padding: 20px 24px;
            max-width: 360px;
            box-shadow: 0 12px 40px rgba(139, 0, 0, 0.6);
            animation: slideInRight 0.5s ease-out;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        `;
        
        notification.innerHTML = `
            <div style="display: flex; align-items: flex-start; gap: 14px;">
                <div style="
                    width: 40px;
                    height: 40px;
                    background: linear-gradient(135deg, #8B0000 0%, #580000 100%);
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                ">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                </div>
                <div style="flex: 1;">
                    <div style="color: white; font-size: 15px; font-weight: 700; margin-bottom: 6px;">
                        🆕 Update Available
                    </div>
                    <div style="color: rgba(255, 255, 255, 0.7); font-size: 13px; line-height: 1.5; margin-bottom: 4px;">
                        ${versionData.changelog[0]}
                    </div>
                    <div style="color: rgba(255, 255, 255, 0.5); font-size: 12px;">
                        Version ${versionData.version}
                    </div>
                </div>
            </div>
            <div style="
                margin-top: 16px;
                padding-top: 16px;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
                display: flex;
                gap: 8px;
            ">
                <button id="update-now-btn" style="
                    flex: 1;
                    background: linear-gradient(135deg, #8B0000 0%, #5a0000 100%);
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 8px;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                ">
                    Update Now
                </button>
                <button id="update-later-btn" style="
                    flex: 1;
                    background: transparent;
                    color: rgba(255, 255, 255, 0.6);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    padding: 10px 20px;
                    border-radius: 8px;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                ">
                    Later
                </button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Button handlers
        document.getElementById('update-now-btn').addEventListener('click', () => {
            this.triggerPWAUpdate();
            notification.style.animation = 'slideOutRight 0.5s ease-out';
            setTimeout(() => notification.remove(), 500);
        });
        
        document.getElementById('update-later-btn').addEventListener('click', () => {
            notification.style.animation = 'slideOutRight 0.5s ease-out';
            setTimeout(() => notification.remove(), 500);
        });
        
        // Auto-dismiss after 30 seconds if no action
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutRight 0.5s ease-out';
                setTimeout(() => notification.remove(), 500);
            }
        }, 30000);
    }
    
    /**
     * Show update banner for website visitors
     */
    showWebsiteUpdateBanner(versionData) {
        // Check if banner was already shown and dismissed
        const dismissed = sessionStorage.getItem('a3km_update_banner_dismissed');
        if (dismissed) return;
        
        const banner = document.createElement('div');
        banner.id = 'website-update-banner';
        banner.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 999998;
            background: linear-gradient(135deg, #8B0000 0%, #5a0000 100%);
            color: white;
            padding: 16px 20px;
            box-shadow: 0 4px 20px rgba(139, 0, 0, 0.5);
            animation: slideDown 0.5s ease-out;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        `;
        
        banner.innerHTML = `
            <div style="
                max-width: 1200px;
                margin: 0 auto;
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 20px;
                flex-wrap: wrap;
            ">
                <div style="display: flex; align-items: center; gap: 16px; flex: 1; min-width: 250px;">
                    <div style="
                        width: 48px;
                        height: 48px;
                        background: rgba(255, 255, 255, 0.15);
                        border-radius: 12px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        flex-shrink: 0;
                    ">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                            <path d="M12 2L2 7v10c0 5.52 3.84 10.68 10 12 6.16-1.32 10-6.48 10-12V7l-10-5z"/>
                        </svg>
                    </div>
                    <div>
                        <div style="font-size: 16px; font-weight: 700; margin-bottom: 4px;">
                            🎉 New Content Available!
                        </div>
                        <div style="font-size: 14px; opacity: 0.9;">
                            ${versionData.changelog[0]} • Install app for offline access
                        </div>
                    </div>
                </div>
                <div style="display: flex; align-items: center; gap: 12px;">
                    <button id="banner-install-btn" style="
                        background: white;
                        color: #8B0000;
                        border: none;
                        padding: 12px 28px;
                        border-radius: 10px;
                        font-size: 15px;
                        font-weight: 700;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        white-space: nowrap;
                    ">
                        📱 Install App
                    </button>
                    <button id="banner-close-btn" style="
                        background: transparent;
                        color: white;
                        border: 2px solid rgba(255, 255, 255, 0.3);
                        padding: 10px 20px;
                        border-radius: 10px;
                        font-size: 14px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        white-space: nowrap;
                    ">
                        Dismiss
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(banner);
        
        // Add padding to top of page to prevent content overlap
        document.body.style.paddingTop = banner.offsetHeight + 'px';
        
        // Button handlers
        document.getElementById('banner-install-btn').addEventListener('click', () => {
            // Trigger install prompt if available
            if (window.PWAInstallPrompt && window.PWAInstallPrompt.deferredPrompt) {
                window.PWAInstallPrompt.showInstallPrompt();
            }
            this.dismissBanner(banner);
        });
        
        document.getElementById('banner-close-btn').addEventListener('click', () => {
            this.dismissBanner(banner);
        });
    }
    
    /**
     * Dismiss update banner
     */
    dismissBanner(banner) {
        sessionStorage.setItem('a3km_update_banner_dismissed', 'true');
        banner.style.animation = 'slideUp 0.5s ease-out';
        document.body.style.paddingTop = '0';
        setTimeout(() => banner.remove(), 500);
    }
    
    /**
     * Trigger PWA content update
     * This calls the offline content manager to re-download content
     */
    triggerPWAUpdate() {
        console.log('🔄 Triggering content update...');
        
        // Update stored version
        localStorage.setItem('a3km_current_version', this.latestVersion.version);
        
        // Trigger offline content manager to re-download
        if (window.OfflineContentManager) {
            window.OfflineContentManager.startOfflineContentDownload(true);
        } else {
            console.warn('⚠️ Offline content manager not available');
        }
    }
}

// Initialize Update Notifier
const updateNotifier = new UpdateNotifier();
window.UpdateNotifier = updateNotifier;

// Add animation styles
const updateNotifierStyles = document.createElement('style');
updateNotifierStyles.textContent = `
    @keyframes slideDown {
        from { 
            opacity: 0; 
            transform: translateY(-100%); 
        }
        to { 
            opacity: 1; 
            transform: translateY(0); 
        }
    }
    
    @keyframes slideUp {
        from { 
            opacity: 1; 
            transform: translateY(0); 
        }
        to { 
            opacity: 0; 
            transform: translateY(-100%); 
        }
    }
    
    /* 📱 Mobile-Responsive Styles for Update Notifier */
    @media (max-width: 768px) {
        #pwa-update-notification {
            right: 12px !important;
            top: 12px !important;
            max-width: calc(100% - 24px) !important;
            padding: 16px !important;
            border-radius: 12px !important;
        }
        
        #pwa-update-notification button {
            min-height: 44px !important;
            font-size: 13px !important;
            padding: 10px 16px !important;
        }
        
        #website-update-banner {
            padding: 14px 12px !important;
            font-size: 14px !important;
        }
        
        #website-update-banner > div {
            flex-direction: column !important;
            gap: 12px !important;
            text-align: center !important;
        }
        
        #website-update-banner button {
            min-height: 42px !important;
            font-size: 13px !important;
            padding: 10px 16px !important;
        }
    }
    
    @media (max-width: 480px) {
        #pwa-update-notification {
            right: 8px !important;
            top: 8px !important;
            max-width: calc(100% - 16px) !important;
            padding: 14px !important;
        }
        
        #pwa-update-notification button {
            font-size: 12px !important;
            padding: 8px 14px !important;
        }
        
        #website-update-banner {
            padding: 12px 8px !important;
            font-size: 13px !important;
        }
        
        #website-update-banner button {
            font-size: 12px !important;
            padding: 8px 14px !important;
        }
    }
`;
document.head.appendChild(updateNotifierStyles);

console.log('🔔 Update Notifier system loaded');
