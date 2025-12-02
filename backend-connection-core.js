/**
 * 🔥 HARDCORE BACKEND CONNECTION SYSTEM 🔥
 * Perfect live connection with auto-reconnect, real-time status, zero tolerance for errors
 * NO MERCY - Always online, always connected!
 */

class BackendConnectionCore {
    constructor(config = {}) {
        this.BACKEND_URL = config.backendUrl || 'http://localhost:5000';
        this.RECONNECT_INTERVAL = config.reconnectInterval || 5000; // 5 seconds
        this.HEALTH_CHECK_INTERVAL = config.healthCheckInterval || 15000; // 15 seconds
        this.MAX_RETRY_ATTEMPTS = config.maxRetry || Infinity; // Never give up!
        this.TIMEOUT = config.timeout || 10000; // 10 seconds
        
        this.isConnected = false;
        this.retryCount = 0;
        this.healthCheckTimer = null;
        this.reconnectTimer = null;
        this.listeners = {
            'connected': [],
            'disconnected': [],
            'error': [],
            'status': []
        };
        
        this.lastStatus = null;
        this.connectionStartTime = null;
        
        console.log('🚀 Backend Connection Core initialized');
        console.log('🌐 Backend URL:', this.BACKEND_URL);
    }

    /**
     * Event listener system
     */
    on(event, callback) {
        if (this.listeners[event]) {
            this.listeners[event].push(callback);
        }
    }

    emit(event, data) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(cb => cb(data));
        }
    }

    /**
     * 🔥 START CONNECTION - NO MERCY!
     */
    async start() {
        console.log('🔥 Starting hardcore backend connection...');
        this.connectionStartTime = Date.now();
        
        // Initial connection attempt
        await this.checkConnection(true);
        
        // Start continuous health monitoring
        this.startHealthMonitoring();
    }

    /**
     * Health monitoring - runs every 15 seconds
     */
    startHealthMonitoring() {
        if (this.healthCheckTimer) {
            clearInterval(this.healthCheckTimer);
        }
        
        this.healthCheckTimer = setInterval(async () => {
            await this.checkConnection(false);
        }, this.HEALTH_CHECK_INTERVAL);
        
        console.log(`⏰ Health monitoring started (every ${this.HEALTH_CHECK_INTERVAL/1000}s)`);
    }

    /**
     * 🎯 CHECK CONNECTION - Core logic
     */
    async checkConnection(showNotification = false) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.TIMEOUT);
            
            const response = await fetch(`${this.BACKEND_URL}/health`, {
                method: 'GET',
                mode: 'cors',
                cache: 'no-cache',
                signal: controller.signal,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            clearTimeout(timeoutId);
            
            if (response.ok) {
                const data = await response.json();
                this.handleConnectionSuccess(data, showNotification);
                return { success: true, data };
            } else {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
        } catch (error) {
            this.handleConnectionFailure(error, showNotification);
            return { success: false, error: error.message };
        }
    }

    /**
     * ✅ Connection SUCCESS
     */
    handleConnectionSuccess(data, showNotification) {
        const wasDisconnected = !this.isConnected;
        
        this.isConnected = true;
        this.retryCount = 0;
        this.lastStatus = {
            status: 'connected',
            timestamp: new Date().toISOString(),
            tokens: data.tokens_configured || 0,
            rateLimit: data.effective_limit || 60,
            uptime: data.uptime || 'unknown'
        };
        
        // Stop reconnection attempts if running
        if (this.reconnectTimer) {
            clearInterval(this.reconnectTimer);
            this.reconnectTimer = null;
        }
        
        // Emit events
        this.emit('status', this.lastStatus);
        
        if (wasDisconnected) {
            console.log('✅ Backend CONNECTED!');
            this.emit('connected', this.lastStatus);
            
            if (showNotification) {
                this.showLiveNotification('Backend connected! ✅', 'success');
            }
        }
    }

    /**
     * ❌ Connection FAILURE
     */
    handleConnectionFailure(error, showNotification) {
        const wasConnected = this.isConnected;
        
        this.isConnected = false;
        this.retryCount++;
        
        this.lastStatus = {
            status: 'disconnected',
            timestamp: new Date().toISOString(),
            error: error.message,
            retryCount: this.retryCount
        };
        
        console.error(`❌ Backend connection failed (Attempt ${this.retryCount}):`, error.message);
        
        // Emit events
        this.emit('status', this.lastStatus);
        this.emit('error', { error, retryCount: this.retryCount });
        
        if (wasConnected) {
            this.emit('disconnected', this.lastStatus);
            
            if (showNotification) {
                this.showLiveNotification('Backend disconnected! Reconnecting...', 'error');
            }
        }
        
        // Start aggressive reconnection
        this.startReconnection();
    }

    /**
     * 🔄 AUTO-RECONNECT - Never give up!
     */
    startReconnection() {
        if (this.reconnectTimer) return; // Already trying
        
        console.log(`🔄 Starting auto-reconnect (every ${this.RECONNECT_INTERVAL/1000}s)...`);
        
        this.reconnectTimer = setInterval(async () => {
            if (this.retryCount >= this.MAX_RETRY_ATTEMPTS && this.MAX_RETRY_ATTEMPTS !== Infinity) {
                console.error('❌ Max retry attempts reached. Giving up.');
                clearInterval(this.reconnectTimer);
                this.reconnectTimer = null;
                return;
            }
            
            console.log(`🔄 Reconnection attempt ${this.retryCount + 1}...`);
            await this.checkConnection(false);
        }, this.RECONNECT_INTERVAL);
    }

    /**
     * 🎯 MAKE REQUEST - Proxy method with auto-retry
     * Automatically uses backend-managed tokens for GitHub API calls
     */
    async request(endpoint, options = {}) {
        if (!this.isConnected) {
            throw new Error('Backend not connected. Attempting to reconnect...');
        }
        
        try {
            const url = `${this.BACKEND_URL}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
            
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.TIMEOUT);
            
            // Prepare headers - backend will auto-inject GitHub token
            const headers = {
                'Content-Type': 'application/json',
                ...options.headers
            };
            
            // Mark as backend-managed request (backend will use token pool)
            headers['X-Backend-Managed'] = 'true';
            
            const response = await fetch(url, {
                ...options,
                signal: controller.signal,
                mode: 'cors',
                headers: headers
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            return await response.json();
            
        } catch (error) {
            console.error(`❌ Request failed for ${endpoint}:`, error);
            
            // Mark as disconnected and start reconnection
            this.handleConnectionFailure(error, false);
            
            throw error;
        }
    }

    /**
     * 🔐 GITHUB API REQUEST - Direct GitHub API call through backend proxy
     * Uses token pool automatically
     */
    async githubRequest(githubEndpoint, options = {}) {
        if (!this.isConnected) {
            throw new Error('Backend not connected. Attempting to reconnect...');
        }
        
        try {
            // Route through backend proxy for automatic token management
            const proxyEndpoint = `/github${githubEndpoint.startsWith('/') ? githubEndpoint : '/' + githubEndpoint}`;
            
            console.log(`🔐 GitHub API request: ${githubEndpoint} → Backend proxy`);
            
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.TIMEOUT);
            
            const response = await fetch(`${this.BACKEND_URL}${proxyEndpoint}`, {
                ...options,
                signal: controller.signal,
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Backend-Managed': 'true',
                    ...options.headers
                }
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `GitHub API error: ${response.status}`);
            }
            
            return await response.json();
            
        } catch (error) {
            console.error(`❌ GitHub API request failed for ${githubEndpoint}:`, error);
            throw error;
        }
    }

    /**
     * 📢 Live notification system
     */
    showLiveNotification(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        
        const colors = {
            success: 'rgba(0, 204, 0, 0.95)',
            error: 'rgba(220, 53, 69, 0.95)',
            warning: 'rgba(255, 193, 7, 0.95)',
            info: 'rgba(0, 123, 255, 0.95)'
        };
        
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: ${colors[type]};
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
            z-index: 999999;
            animation: slideInRight 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            max-width: 400px;
            font-size: 0.95rem;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 12px;
        `;
        
        notification.innerHTML = `
            <i class="fas fa-${icons[type]}" style="font-size: 1.2rem;"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            setTimeout(() => notification.remove(), 400);
        }, duration);
    }

    /**
     * Get current status
     */
    getStatus() {
        return {
            isConnected: this.isConnected,
            lastStatus: this.lastStatus,
            retryCount: this.retryCount,
            uptime: this.connectionStartTime ? Date.now() - this.connectionStartTime : 0
        };
    }

    /**
     * Stop all monitoring
     */
    stop() {
        if (this.healthCheckTimer) {
            clearInterval(this.healthCheckTimer);
            this.healthCheckTimer = null;
        }
        
        if (this.reconnectTimer) {
            clearInterval(this.reconnectTimer);
            this.reconnectTimer = null;
        }
        
        console.log('🛑 Backend connection monitoring stopped');
    }

    /**
     * Force reconnect
     */
    async forceReconnect() {
        console.log('🔄 Force reconnecting...');
        this.retryCount = 0;
        await this.checkConnection(true);
    }
}

// Add animations
if (!document.getElementById('backend-connection-animations')) {
    const style = document.createElement('style');
    style.id = 'backend-connection-animations';
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(500px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(500px);
                opacity: 0;
            }
        }
        
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }
    `;
    document.head.appendChild(style);
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BackendConnectionCore;
}
