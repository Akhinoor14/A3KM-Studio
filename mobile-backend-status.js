/**
 * 🔐 MOBILE BACKEND STATUS SYSTEM
 * ================================
 * User-friendly backend connection monitor
 * Shows real-time status with simple explanations
 * 
 * What this does:
 * - Checks if secure backend server is running
 * - Shows token system status (auto-managed, no user action needed)
 * - Monitors real-time GitHub sync
 * - Provides visual feedback for connection quality
 */

class MobileBackendStatus {
    constructor(containerId, theme = 'default') {
        this.container = document.getElementById(containerId);
        this.theme = theme;
        
        // Safe proxy URL retrieval with fallback
        this.proxyUrl = this.getProxyUrl();
        
        this.isOnline = false;
        this.lastCheckTime = null;
        this.tokenStatus = 'unknown';
        this.checkInterval = null;
        
        if (this.container) {
            this.init();
        } else {
            console.warn('Backend status container not found:', containerId);
        }
    }

    /**
     * 🔗 Get proxy URL safely
     */
    getProxyUrl() {
        // Try to get from global config
        if (typeof GITHUB_PROXY_CONFIG !== 'undefined' && GITHUB_PROXY_CONFIG.PROXY_URL) {
            return GITHUB_PROXY_CONFIG.PROXY_URL;
        }
        
        // Fallback to production Railway URL
        return 'https://solidworks-website-project-main-production.up.railway.app';
    }

    /**
     * 🎨 Initialize status display
     */
    init() {
        this.createStatusCard();
        this.startMonitoring();
    }

    /**
     * 📱 Create user-friendly status card
     */
    createStatusCard() {
        console.log('Creating backend status card...', {
            theme: this.theme,
            containerExists: !!this.container,
            proxyUrl: this.proxyUrl
        });
        
        const card = document.createElement('div');
        card.className = `backend-status-card ${this.theme}`;
        card.innerHTML = `
            <div class="status-indicator">
                <div class="status-icon">
                    <i class="fas fa-circle-notch fa-spin"></i>
                </div>
                <div class="status-text">
                    <span class="status-label">Checking Connection...</span>
                    <span class="status-detail">Please wait</span>
                </div>
            </div>
            <button class="status-info-btn" onclick="window.mobileBackend.showInfo()">
                <i class="fas fa-question-circle"></i>
            </button>
        `;
        
        if (this.container) {
            this.container.appendChild(card);
            console.log('✅ Status card added to container');
        } else {
            console.error('❌ Container not found!');
        }
    }

    /**
     * 🔄 Start real-time monitoring
     */
    startMonitoring() {
        // Initial check
        this.checkBackendHealth();
        
        // Check every 30 seconds
        this.checkInterval = setInterval(() => {
            this.checkBackendHealth();
        }, 30000);
        
        // Check on page focus
        window.addEventListener('focus', () => {
            this.checkBackendHealth();
        });
    }

    /**
     * 🏥 Check backend health
     */
    async checkBackendHealth() {
        const statusCard = this.container?.querySelector('.backend-status-card');
        if (!statusCard) return;

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

            const response = await fetch(`${this.proxyUrl}/health`, {
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);

            if (response.ok) {
                const data = await response.json();
                this.isOnline = true;
                this.tokenStatus = data.token_status || 'active';
                this.lastCheckTime = new Date();
                this.updateStatusUI('online', data);
            } else {
                this.isOnline = false;
                this.updateStatusUI('error');
            }
        } catch (error) {
            this.isOnline = false;
            if (error.name === 'AbortError') {
                this.updateStatusUI('timeout');
            } else {
                this.updateStatusUI('offline');
            }
        }
    }

    /**
     * 🎨 Update status UI with user-friendly messages
     */
    updateStatusUI(status, data = {}) {
        const statusCard = this.container?.querySelector('.backend-status-card');
        if (!statusCard) return;

        const indicator = statusCard.querySelector('.status-indicator');
        const icon = statusCard.querySelector('.status-icon i');
        const label = statusCard.querySelector('.status-label');
        const detail = statusCard.querySelector('.status-detail');

        // Clear existing status classes
        indicator.className = 'status-indicator';

        switch (status) {
            case 'online':
                indicator.classList.add('online');
                icon.className = 'fas fa-check-circle';
                label.textContent = 'Connected & Secure';
                detail.textContent = `Token: ${this.tokenStatus} • Updated just now`;
                break;

            case 'offline':
                indicator.classList.add('offline');
                icon.className = 'fas fa-times-circle';
                label.textContent = 'Backend Offline';
                detail.textContent = 'Using fallback mode';
                break;

            case 'timeout':
                indicator.classList.add('warning');
                icon.className = 'fas fa-exclamation-triangle';
                label.textContent = 'Slow Connection';
                detail.textContent = 'Backend taking longer than usual';
                break;

            case 'error':
                indicator.classList.add('error');
                icon.className = 'fas fa-exclamation-circle';
                label.textContent = 'Connection Issue';
                detail.textContent = 'Retrying automatically...';
                break;
        }
    }

    /**
     * ℹ️ Show detailed information modal
     */
    showInfo() {
        const infoHtml = `
            <div class="backend-info-modal">
                <div class="info-modal-content">
                    <div class="info-header">
                        <h3>🔐 Secure Backend System</h3>
                        <button onclick="window.mobileBackend.closeInfo()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    
                    <div class="info-body">
                        <div class="info-section">
                            <h4>🌟 What is this?</h4>
                            <p>A secure server that handles GitHub connections safely. Think of it as a secure bridge between your device and GitHub.</p>
                        </div>
                        
                        <div class="info-section">
                            <h4>🔑 Token System</h4>
                            <p><strong>You don't need to do anything!</strong> The backend automatically manages access tokens. It rotates them when needed and keeps everything secure.</p>
                        </div>
                        
                        <div class="info-section">
                            <h4>🔄 Real-time Updates</h4>
                            <p>When new files are uploaded to GitHub, this system automatically detects changes and updates the website. No manual refresh needed!</p>
                        </div>
                        
                        <div class="info-section">
                            <h4>✅ Status Indicators</h4>
                            <ul>
                                <li><i class="fas fa-check-circle" style="color: #4CAF50;"></i> <strong>Connected</strong> - Everything working perfectly</li>
                                <li><i class="fas fa-exclamation-triangle" style="color: #FF9800;"></i> <strong>Slow</strong> - Connection is slower than usual</li>
                                <li><i class="fas fa-times-circle" style="color: #F44336;"></i> <strong>Offline</strong> - Backend temporarily unavailable</li>
                            </ul>
                        </div>
                        
                        <div class="info-section">
                            <h4>🔒 Security</h4>
                            <p>All connections are encrypted. Your data never passes through untrusted servers. The token system ensures GitHub API limits don't affect you.</p>
                        </div>
                        
                        <div class="info-footer">
                            <p><strong>Current Status:</strong> ${this.isOnline ? '✅ Online & Secure' : '⚠️ Checking...'}</p>
                            ${this.isOnline ? `<p><small>Last check: ${this.lastCheckTime?.toLocaleTimeString()}</small></p>` : ''}
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', infoHtml);
        document.body.style.overflow = 'hidden';
    }

    /**
     * ❌ Close info modal
     */
    closeInfo() {
        const modal = document.querySelector('.backend-info-modal');
        if (modal) {
            modal.remove();
            document.body.style.overflow = '';
        }
    }

    /**
     * 🛑 Stop monitoring (cleanup)
     */
    destroy() {
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
        }
    }
}

/**
 * 📡 Real-time Sync Notification System
 * Shows friendly notifications when GitHub updates are detected
 */
class MobileSyncNotifier {
    constructor() {
        this.lastNotification = null;
        this.notificationTimeout = null;
    }

    /**
     * 🔔 Show sync notification
     */
    show(message, type = 'info') {
        // Remove existing notification
        this.hide();

        const notification = document.createElement('div');
        notification.className = `sync-notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${this.getIcon(type)}"></i>
                <span>${message}</span>
            </div>
        `;

        document.body.appendChild(notification);
        this.lastNotification = notification;

        // Animate in
        setTimeout(() => notification.classList.add('show'), 10);

        // Auto hide after 4 seconds
        this.notificationTimeout = setTimeout(() => {
            this.hide();
        }, 4000);
    }

    /**
     * 🎨 Get icon for notification type
     */
    getIcon(type) {
        const icons = {
            'success': 'fa-check-circle',
            'info': 'fa-info-circle',
            'warning': 'fa-exclamation-triangle',
            'error': 'fa-times-circle'
        };
        return icons[type] || icons.info;
    }

    /**
     * 👋 Hide notification
     */
    hide() {
        if (this.lastNotification) {
            this.lastNotification.classList.remove('show');
            setTimeout(() => {
                if (this.lastNotification) {
                    this.lastNotification.remove();
                    this.lastNotification = null;
                }
            }, 300);
        }
        if (this.notificationTimeout) {
            clearTimeout(this.notificationTimeout);
        }
    }
}

// Global instances
window.mobileBackend = null;
window.mobileSyncNotifier = new MobileSyncNotifier();

/**
 * 🚀 Initialize backend status system
 * Call this in your page with: initMobileBackendStatus('container-id', 'theme-color')
 * NOTE: Call this inside DOMContentLoaded for best results
 */
function initMobileBackendStatus(containerId, theme = 'default') {
    console.log('🚀 Initializing mobile backend status...', {
        containerId,
        theme,
        containerExists: !!document.getElementById(containerId),
        configExists: typeof GITHUB_PROXY_CONFIG !== 'undefined'
    });
    
    try {
        if (window.mobileBackend) {
            console.log('Destroying existing backend instance');
            window.mobileBackend.destroy();
        }
        window.mobileBackend = new MobileBackendStatus(containerId, theme);
        console.log('✅ Mobile backend status initialized successfully');
    } catch (error) {
        console.error('❌ Failed to initialize mobile backend status:', error);
    }
}

/**
 * 🔔 Show sync notification (called by realtime-github-sync.js)
 */
function showMobileSyncNotification(message, type = 'info') {
    if (window.mobileSyncNotifier) {
        window.mobileSyncNotifier.show(message, type);
    }
}

/**
 * 📊 Initialize compact backend status for browse view
 * Shows minimal status bar at top of browse-files page
 */
function initBrowseBackendStatus() {
    const statusBar = document.getElementById('browse-backend-status');
    if (!statusBar) {
        console.warn('Browse backend status bar not found');
        return;
    }

    // Safe proxy URL retrieval
    let proxyUrl;
    try {
        proxyUrl = (typeof GITHUB_PROXY_CONFIG !== 'undefined' && GITHUB_PROXY_CONFIG.PROXY_URL) 
            ? GITHUB_PROXY_CONFIG.PROXY_URL 
            : 'https://solidworks-website-project-main-production.up.railway.app';
    } catch (e) {
        proxyUrl = 'https://solidworks-website-project-main-production.up.railway.app';
    }

    async function checkStatus() {
        const statusContent = statusBar.querySelector('.status-compact');
        if (!statusContent) return;
        
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);

            const response = await fetch(`${proxyUrl}/health`, {
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (response.ok) {
                const data = await response.json();
                statusContent.innerHTML = `
                    <i class="fas fa-check-circle" style="color: #4CAF50;"></i>
                    <span>Secure • ${data.token_status || 'Active'}</span>
                `;
                statusBar.style.background = 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(56, 142, 60, 0.05) 100%)';
            } else {
                statusContent.innerHTML = `
                    <i class="fas fa-exclamation-circle" style="color: #FF9800;"></i>
                    <span>Limited Mode</span>
                `;
                statusBar.style.background = 'linear-gradient(135deg, rgba(255, 152, 0, 0.1) 0%, rgba(251, 140, 0, 0.05) 100%)';
            }
        } catch (error) {
            console.log('Backend check failed (using fallback):', error.message);
            const statusContent = statusBar.querySelector('.status-compact');
            if (statusContent) {
                statusContent.innerHTML = `
                    <i class="fas fa-wifi" style="color: #9E9E9E;"></i>
                    <span>Fallback Mode</span>
                `;
                statusBar.style.background = 'linear-gradient(135deg, rgba(158, 158, 158, 0.1) 0%, rgba(117, 117, 117, 0.05) 100%)';
            }
        }
    }

    // Check immediately (with small delay to ensure DOM is ready)
    setTimeout(() => checkStatus(), 100);

    // Check every 30 seconds
    setInterval(checkStatus, 30000);

    // Check on focus
    window.addEventListener('focus', checkStatus);
}
