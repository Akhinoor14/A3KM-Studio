/**
 * 🔐 Unified Token Manager
 * Central token management system for all Only-boss managers
 * Handles validation, expiry, rate limits, and health monitoring
 * Version: 2.0.0
 * Last Updated: February 5, 2026
 */

class UnifiedTokenManager {
    constructor() {
        // Unified storage key for ALL systems
        this.STORAGE_KEY = 'github_token';
        this.EXPIRY_KEY = 'github_token_expiry';
        this.RATE_LIMIT_KEY = 'github_rate_limit';
        this.LAST_CHECK_KEY = 'github_last_check';
        
        // Configuration
        this.EXPIRY_DAYS = 90; // GitHub PAT standard expiry
        this.CHECK_INTERVAL = 3600000; // Check every hour (1 hour in ms)
        this.RATE_LIMIT_WARNING = 100; // Warn when less than 100 requests left
        
        // API Configuration
        this.GITHUB_API = 'https://api.github.com';
        this.REPO_OWNER = 'Akhinoor14';
        this.REPO_NAME = 'A3KM-Studio';
        
        // Initialize
        this.token = this.loadToken();
        this.autoCheckHealth();
    }

    /**
     * 💾 Save Token with Metadata
     */
    saveToken(token, expiryDays = this.EXPIRY_DAYS) {
        if (!token || token.trim() === '') {
            throw new Error('Token cannot be empty');
        }

        // Validate token format (GitHub PAT format)
        if (!token.startsWith('ghp_') && !token.startsWith('github_pat_')) {
            console.warn('⚠️ Token format may be invalid. GitHub tokens typically start with ghp_ or github_pat_');
        }

        // Save token
        localStorage.setItem(this.STORAGE_KEY, token.trim());
        
        // Set expiry date
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + expiryDays);
        localStorage.setItem(this.EXPIRY_KEY, expiryDate.toISOString());
        
        // Reset last check
        localStorage.setItem(this.LAST_CHECK_KEY, new Date().toISOString());
        
        this.token = token.trim();
        
        console.log('✅ Token saved successfully');
        console.log('📅 Expiry date:', expiryDate.toLocaleDateString());
        
        return true;
    }

    /**
     * 📥 Load Token from Storage (with automatic migration)
     */
    loadToken() {
        // Try standard key first
        let token = localStorage.getItem(this.STORAGE_KEY);
        
        // If not found, check legacy keys and migrate
        if (!token) {
            const LEGACY_KEYS = ['githubToken', 'github_api_token'];
            
            for (const legacyKey of LEGACY_KEYS) {
                token = localStorage.getItem(legacyKey);
                if (token) {
                    console.log('🔄 Migrating token from legacy key:', legacyKey, '→', this.STORAGE_KEY);
                    
                    // Save to standard key
                    localStorage.setItem(this.STORAGE_KEY, token);
                    
                    // Remove legacy key
                    localStorage.removeItem(legacyKey);
                    
                    console.log('✅ Token migration completed');
                    break;
                }
            }
        }
        
        if (token) {
            console.log('✅ Token loaded:', token.substring(0, 10) + '...' + ' (' + token.length + ' chars)');
            return token;
        }
        
        console.warn('⚠️ No token found in storage');
        return null;
    }

    /**
     * 🗑️ Clear Token and Metadata
     */
    clearToken() {
        localStorage.removeItem(this.STORAGE_KEY);
        localStorage.removeItem(this.EXPIRY_KEY);
        localStorage.removeItem(this.RATE_LIMIT_KEY);
        localStorage.removeItem(this.LAST_CHECK_KEY);
        this.token = null;
        console.log('🗑️ Token cleared');
    }

    /**
     * ✅ Validate Token with GitHub API
     */
    async validateToken(token = this.token) {
        if (!token) {
            return {
                valid: false,
                error: 'No token provided',
                status: 'missing'
            };
        }

        try {
            const apiUrl = `${this.GITHUB_API}/user`;
            const requestTime = new Date().toISOString();
            
            console.log('🌐 [REAL API CALL] Fetching from:', apiUrl);
            console.log('⏰ Request timestamp:', requestTime);
            console.log('🔑 Using token:', token.substring(0, 10) + '...');
            
            const response = await fetch(apiUrl, {
                headers: {
                    'Authorization': `token ${token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            
            console.log('📡 HTTP Response status:', response.status, response.statusText);
            console.log('🕹️ Response headers:', {
                'x-ratelimit-remaining': response.headers.get('x-ratelimit-remaining'),
                'x-ratelimit-limit': response.headers.get('x-ratelimit-limit')
            });

            if (response.ok) {
                const userData = await response.json();
                console.log('👤 [REAL DATA] GitHub user data received:', {
                    login: userData.login,
                    name: userData.name,
                    id: userData.id,
                    type: userData.type,
                    created_at: userData.created_at
                });
                
                // Get rate limit info
                const rateLimitInfo = await this.checkRateLimit(token);
                
                return {
                    valid: true,
                    status: 'active',
                    user: userData.login,
                    name: userData.name,
                    rateLimit: rateLimitInfo,
                    message: `✅ Token valid for ${userData.login}`,
                    fetchedAt: new Date().toISOString()
                };
            } else if (response.status === 401) {
                return {
                    valid: false,
                    status: 'invalid',
                    error: 'Token is invalid or expired',
                    message: '❌ Token authentication failed'
                };
            } else {
                return {
                    valid: false,
                    status: 'error',
                    error: `HTTP ${response.status}: ${response.statusText}`,
                    message: '⚠️ Unable to validate token'
                };
            }
        } catch (error) {
            return {
                valid: false,
                status: 'error',
                error: error.message,
                message: '❌ Network error during validation'
            };
        }
    }

    /**
     * 📊 Check Rate Limit Status
     */
    async checkRateLimit(token = this.token) {
        if (!token) return null;

        try {
            const apiUrl = `${this.GITHUB_API}/rate_limit`;
            const requestTime = new Date().toISOString();
            
            console.log('🌐 [REAL API CALL] Fetching rate limit from:', apiUrl);
            console.log('⏰ Request timestamp:', requestTime);
            
            const response = await fetch(apiUrl, {
                headers: {
                    'Authorization': `token ${token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            
            console.log('📡 HTTP Response status:', response.status, response.statusText);

            if (response.ok) {
                const data = await response.json();
                const core = data.resources.core;
                
                console.log('📊 [REAL DATA] Rate limit data received:', {
                    limit: core.limit,
                    remaining: core.remaining,
                    used: core.limit - core.remaining,
                    reset: new Date(core.reset * 1000).toLocaleString(),
                    fetchedAt: new Date().toLocaleString()
                });
                
                // Save to localStorage
                localStorage.setItem(this.RATE_LIMIT_KEY, JSON.stringify({
                    limit: core.limit,
                    remaining: core.remaining,
                    reset: core.reset,
                    checkTime: new Date().toISOString()
                }));
                
                return {
                    limit: core.limit,
                    remaining: core.remaining,
                    reset: new Date(core.reset * 1000),
                    percentage: (core.remaining / core.limit * 100).toFixed(1),
                    fetchedAt: new Date().toISOString()
                };
            }
        } catch (error) {
            console.error('Rate limit check failed:', error);
        }
        
        return null;
    }

    /**
     * 📅 Check Token Expiry
     */
    checkExpiry() {
        const expiryDate = localStorage.getItem(this.EXPIRY_KEY);
        
        if (!expiryDate) {
            return {
                expired: false,
                daysRemaining: null,
                message: 'No expiry date set'
            };
        }

        const expiry = new Date(expiryDate);
        const now = new Date();
        const daysRemaining = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
        
        return {
            expired: daysRemaining <= 0,
            daysRemaining: daysRemaining,
            expiryDate: expiry,
            message: daysRemaining <= 0 
                ? '❌ Token expired' 
                : daysRemaining <= 7 
                    ? `⚠️ Token expires in ${daysRemaining} days` 
                    : `✅ Token valid for ${daysRemaining} days`
        };
    }

    /**
     * 🏥 Complete Health Check
     */
    async getHealthStatus() {
        const token = this.loadToken();
        
        if (!token) {
            return {
                status: 'missing',
                icon: '❌',
                message: 'No token configured',
                color: '#dc3545',
                action: 'Configure token in API Config Manager',
                details: null
            };
        }

        // Check expiry
        const expiryInfo = this.checkExpiry();
        
        if (expiryInfo.expired) {
            return {
                status: 'expired',
                icon: '❌',
                message: 'Token has expired',
                color: '#dc3545',
                action: 'Generate new token',
                details: expiryInfo
            };
        }

        // Validate with GitHub
        const validation = await this.validateToken(token);
        
        if (!validation.valid) {
            return {
                status: 'invalid',
                icon: '❌',
                message: validation.error || 'Token validation failed',
                color: '#dc3545',
                action: 'Check token in API Config Manager',
                details: validation
            };
        }

        // Check rate limit
        const rateLimit = validation.rateLimit;
        
        if (rateLimit && rateLimit.remaining < this.RATE_LIMIT_WARNING) {
            return {
                status: 'warning',
                icon: '⚠️',
                message: `Rate limit low: ${rateLimit.remaining}/${rateLimit.limit} requests remaining`,
                color: '#ffc107',
                action: 'Wait for rate limit reset',
                details: {
                    ...validation,
                    expiryInfo
                }
            };
        }

        // All good!
        return {
            status: 'healthy',
            icon: '✅',
            message: `Token active (${validation.user})`,
            color: '#28a745',
            action: null,
            details: {
                ...validation,
                expiryInfo
            }
        };
    }

    /**
     * 🔄 Auto Health Check (runs periodically)
     */
    autoCheckHealth() {
        const lastCheck = localStorage.getItem(this.LAST_CHECK_KEY);
        
        if (lastCheck) {
            const lastCheckTime = new Date(lastCheck);
            const now = new Date();
            const timeSinceCheck = now - lastCheckTime;
            
            // Skip if checked recently
            if (timeSinceCheck < this.CHECK_INTERVAL) {
                console.log('⏭️ Skipping health check (checked recently)');
                return;
            }
        }

        // Perform health check
        this.getHealthStatus().then(health => {
            console.log('🏥 Health Check:', health.message);
            
            // Update last check time
            localStorage.setItem(this.LAST_CHECK_KEY, new Date().toISOString());
            
            // Show warnings if needed
            if (health.status === 'warning' || health.status === 'expired') {
                this.showNotification(health);
            }
        });
    }

    /**
     * 🔔 Show Notification to User
     */
    showNotification(health) {
        // Only show if not shown in last hour
        const lastNotification = localStorage.getItem('github_last_notification');
        
        if (lastNotification) {
            const lastTime = new Date(lastNotification);
            const now = new Date();
            if (now - lastTime < 3600000) return; // 1 hour
        }

        const message = `${health.icon} GitHub Token Status\n\n${health.message}\n\n${health.action || ''}`;
        
        if (health.status === 'expired' || health.status === 'invalid') {
            if (confirm(message + '\n\nGo to API Config Manager?')) {
                window.location.href = '/Only-boss/shared/api-config-manager.html';
            }
        } else {
            alert(message);
        }
        
        localStorage.setItem('github_last_notification', new Date().toISOString());
    }

    /**
     * 🎨 Generate Status Badge HTML
     */
    getStatusBadgeHTML() {
        return `
            <div id="tokenStatusBadge" style="
                position: fixed;
                top: 70px;
                right: 20px;
                padding: 8px 15px;
                border-radius: 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                font-size: 12px;
                font-weight: 600;
                box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                cursor: pointer;
                z-index: 9999;
                display: flex;
                align-items: center;
                gap: 8px;
                transition: all 0.3s ease;
            " onclick="window.tokenManager.showStatusDetails()">
                <span id="tokenStatusIcon">⏳</span>
                <span id="tokenStatusText">Checking...</span>
            </div>
        `;
    }

    /**
     * 🔄 Update Status Badge
     */
    async updateStatusBadge() {
        const badge = document.getElementById('tokenStatusBadge');
        const icon = document.getElementById('tokenStatusIcon');
        const text = document.getElementById('tokenStatusText');
        
        if (!badge) return;

        const health = await this.getHealthStatus();
        
        icon.textContent = health.icon;
        text.textContent = health.message.replace(/[✅❌⚠️]/g, '').trim();
        badge.style.background = `linear-gradient(135deg, ${health.color} 0%, ${health.color}dd 100%)`;
    }

    /**
     * 📋 Show Detailed Status Modal
     */
    async showStatusDetails() {
        const health = await this.getHealthStatus();
        const details = health.details;
        
        let message = `🔐 GitHub Token Status\n\n`;
        message += `Status: ${health.message}\n\n`;
        
        if (details) {
            if (details.user) {
                message += `👤 User: ${details.user}\n`;
                message += `📧 Name: ${details.name || 'N/A'}\n\n`;
            }
            
            if (details.rateLimit) {
                message += `📊 Rate Limit:\n`;
                message += `   Remaining: ${details.rateLimit.remaining}/${details.rateLimit.limit}\n`;
                message += `   Usage: ${100 - details.rateLimit.percentage}%\n`;
                message += `   Reset: ${details.rateLimit.reset.toLocaleTimeString()}\n\n`;
            }
            
            if (details.expiryInfo) {
                message += `📅 Expiry:\n`;
                message += `   ${details.expiryInfo.message}\n\n`;
            }
        }
        
        if (health.action) {
            message += `🎯 Action: ${health.action}\n`;
        }
        
        if (health.status !== 'healthy' && confirm(message + '\n\nGo to API Config Manager?')) {
            window.location.href = '/Only-boss/shared/api-config-manager.html';
        } else {
            alert(message);
        }
    }

    /**
     * 🚀 Initialize Token System on Page Load
     */
    async initialize() {
        console.log('🚀 Initializing Unified Token Manager...');
        
        // Load token
        const token = this.loadToken();
        
        if (!token) {
            console.warn('⚠️ No token found');
            
            // Show prompt after short delay
            setTimeout(() => {
                const userChoice = confirm(
                    '⚠️ GitHub Token Not Found!\n\n' +
                    'This manager requires a GitHub token to function.\n\n' +
                    'Click OK to go to API Config Manager and set your token.\n' +
                    'Click Cancel to continue anyway (features will not work).'
                );
                
                if (userChoice) {
                    window.location.href = '/Only-boss/shared/api-config-manager.html';
                }
            }, 1000);
            
            return {
                success: false,
                message: 'No token configured'
            };
        }
        
        // Perform health check
        const health = await this.getHealthStatus();
        console.log('🏥 Token Health:', health.message);
        
        // Add status badge if not exists
        if (!document.getElementById('tokenStatusBadge')) {
            document.body.insertAdjacentHTML('beforeend', this.getStatusBadgeHTML());
            await this.updateStatusBadge();
        }
        
        return {
            success: health.status === 'healthy' || health.status === 'warning',
            health: health
        };
    }
}

// 🌍 Global Instance (accessible from all managers)
window.UnifiedTokenManager = UnifiedTokenManager;

// Auto-initialize on page load
if (typeof window !== 'undefined') {
    console.log('✅ Unified Token Manager loaded');
}
