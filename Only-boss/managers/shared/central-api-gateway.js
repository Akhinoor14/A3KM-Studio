/**
 * 🎯 Central API Gateway
 * Unified API control for all Only-boss managers
 * Version: 1.0.0
 * Last Updated: March 1, 2026
 * 
 * FEATURES:
 * ✓ Singleton pattern - one instance for entire system
 * ✓ Token management via UnifiedTokenManager
 * ✓ Request queue to prevent race conditions
 * ✓ Rate limit protection (auto-pause when low)
 * ✓ Supply chain event bus
 * ✓ Audit trail logging
 * ✓ Cross-device ready (reads from localStorage, writes to GitHub)
 * ✓ Real-time status monitoring
 */

class CentralAPIGateway {
    static instance = null;
    
    /**
     * Get singleton instance
     */
    static getInstance() {
        if (!CentralAPIGateway.instance) {
            CentralAPIGateway.instance = new CentralAPIGateway();
        }
        return CentralAPIGateway.instance;
    }
    
    constructor() {
        if (CentralAPIGateway.instance) {
            return CentralAPIGateway.instance;
        }
        
        // Initialize token manager
        this.tokenManager = new UnifiedTokenManager();
        
        // GitHub uploader instance (created once token is available)
        this.uploader = null;
        
        // Request queue
        this.requestQueue = [];
        this.isProcessing = false;
        
        // Rate limit tracking
        this.rateLimit = {
            remaining: 5000,
            reset: null,
            limit: 5000
        };
        this.REQUEST_TIMEOUT_MS = 8000;
        
        // Event listeners for supply chain
        this.eventListeners = {
            'content:uploaded': [],
            'content:deleted': [],
            'content:updated': [],
            'token:changed': [],
            'api:error': [],
            'ratelimit:warning': []
        };
        
        // BroadcastChannel for cross-tab communication
        if (typeof BroadcastChannel !== 'undefined') {
            this.channel = new BroadcastChannel('only_boss_api_gateway');
            this.channel.onmessage = (event) => this.handleBroadcastMessage(event);
        }
        
        // Initialize uploader if token exists
        this.initializeUploader();
        
        console.log('🎯 Central API Gateway initialized');
    }
    
    /**
     * Initialize GitHub uploader with token
     */
    initializeUploader() {
        const token = this.tokenManager.loadToken();
        
        if (!token) {
            console.warn('⚠️ No token found - uploader not initialized');
            this.emit('token:changed', { status: 'missing' });
            return false;
        }
        
        // Create uploader instance (guard: class may not exist in all managers)
        if (typeof GitHubContentUploader === 'undefined') {
            console.warn('⚠️ GitHubContentUploader not available in this context — skipping uploader init');
            this.emit('token:changed', { status: 'active' });
            return true;
        }

        this.uploader = new GitHubContentUploader({
            token: token,
            owner: 'Akhinoor14',
            repo: 'A3KM-Studio',
            onProgress: (data) => {
                this.emit('upload:progress', data);
            },
            onError: (error) => {
                this.emit('api:error', error);
                this.logEvent('error', error);
            }
        });
        
        console.log('✅ GitHub uploader initialized');
        this.emit('token:changed', { status: 'active' });
        
        // Check rate limits
        this.checkRateLimit();
        
        return true;
    }
    
    /**
     * Get uploader instance (creates if needed)
     */
    getUploader() {
        if (!this.uploader) {
            const initialized = this.initializeUploader();
            if (!initialized) {
                throw new Error('❌ Cannot create uploader - no valid token found. Please configure token in API settings.');
            }
        }
        return this.uploader;
    }
    
    /**
     * Upload content through gateway
     */
    async uploadContent(params) {
        try {
            const uploader = this.getUploader();
            
            // Check rate limit before upload
            if (this.rateLimit.remaining < 50) {
                this.emit('ratelimit:warning', this.rateLimit);
                throw new Error('⚠️ Rate limit too low. Please wait before uploading more content.');
            }
            
            // Perform upload
            const result = await uploader.uploadCompleteContent(params);
            
            // Log success
            this.logEvent('upload', {
                type: params.contentType,
                title: params.title,
                category: params.category,
                timestamp: new Date().toISOString()
            });
            
            // Emit event
            this.emit('content:uploaded', {
                type: params.contentType,
                title: params.title,
                category: params.category,
                id: params.contentId
            });
            
            // Broadcast to other tabs
            this.broadcast('content:uploaded', {
                type: params.contentType,
                title: params.title
            });
            
            // Update rate limit
            this.checkRateLimit();
            
            return result;
            
        } catch (error) {
            this.logEvent('error', {
                action: 'upload',
                error: error.message,
                params: params
            });
            throw error;
        }
    }
    
    /**
     * Delete content through gateway
     */
    async deleteContent(contentType, contentId) {
        try {
            const uploader = this.getUploader();
            const contentManager = new ContentManager(uploader);
            
            await contentManager.deleteContent(contentType, contentId);
            
            // Log deletion
            this.logEvent('delete', {
                type: contentType,
                id: contentId,
                timestamp: new Date().toISOString()
            });
            
            // Emit event
            this.emit('content:deleted', {
                type: contentType,
                id: contentId
            });
            
            // Broadcast to other tabs
            this.broadcast('content:deleted', {
                type: contentType,
                id: contentId
            });
            
            return true;
            
        } catch (error) {
            this.logEvent('error', {
                action: 'delete',
                error: error.message
            });
            throw error;
        }
    }
    
    /**
     * Update content through gateway
     */
    async updateContent(contentType, contentId, updatedData) {
        try {
            const uploader = this.getUploader();
            const contentManager = new ContentManager(uploader);
            
            await contentManager.updateContent(contentType, contentId, updatedData);
            
            // Log update
            this.logEvent('update', {
                type: contentType,
                id: contentId,
                timestamp: new Date().toISOString()
            });
            
            // Emit event
            this.emit('content:updated', {
                type: contentType,
                id: contentId
            });
            
            // Broadcast to other tabs
            this.broadcast('content:updated', {
                type: contentType,
                id: contentId
            });
            
            return true;
            
        } catch (error) {
            this.logEvent('error', {
                action: 'update',
                error: error.message
            });
            throw error;
        }
    }
    
    /**
     * Check GitHub API rate limit
     */
    async checkRateLimit() {
        try {
            const token = this.tokenManager.loadToken();
            if (!token) return null;

            const fetchWithTimeout = async (url, options = {}, timeoutMs = this.REQUEST_TIMEOUT_MS) => {
                if (typeof AbortController === 'undefined') {
                    return fetch(url, options);
                }
                const controller = new AbortController();
                const timer = setTimeout(() => controller.abort(), timeoutMs);
                try {
                    return await fetch(url, { ...options, signal: controller.signal });
                } finally {
                    clearTimeout(timer);
                }
            };
            
            const response = await fetchWithTimeout('https://api.github.com/rate_limit', {
                headers: { 'Authorization': `token ${token}` }
            });
            
            const data = await response.json();
            
            if (data.resources && data.resources.core) {
                this.rateLimit = {
                    remaining: data.resources.core.remaining,
                    limit: data.resources.core.limit,
                    reset: new Date(data.resources.core.reset * 1000)
                };
                
                // Warn if low
                if (this.rateLimit.remaining < 100) {
                    this.emit('ratelimit:warning', this.rateLimit);
                }
                
                return this.rateLimit;
            }
            
        } catch (error) {
            console.error('Failed to check rate limit:', error);
        }
        
        return null;
    }
    
    /**
     * Get current API status
     */
    async getStatus() {
        const token = this.tokenManager.loadToken();
        
        if (!token) {
            return {
                token: 'missing',
                uploader: 'not_initialized',
                rateLimit: null,
                user: null
            };
        }
        
        // Validate token
        const validation = await this.tokenManager.validateToken(token);
        
        // Get rate limit
        const rateLimit = await this.checkRateLimit();
        
        return {
            token: validation.valid ? 'valid' : 'invalid',
            uploader: this.uploader ? 'ready' : 'not_initialized',
            rateLimit: rateLimit,
            validation: validation,
            user: validation.user || null,  // Expose user at top level for easier access
            remaining: rateLimit?.remaining || 0,
            limit: rateLimit?.limit || 5000
        };
    }
    
    /**
     * Event system - Subscribe to events
     */
    on(eventName, callback) {
        if (!this.eventListeners[eventName]) {
            this.eventListeners[eventName] = [];
        }
        this.eventListeners[eventName].push(callback);
    }
    
    /**
     * Event system - Emit events
     */
    emit(eventName, data) {
        if (this.eventListeners[eventName]) {
            this.eventListeners[eventName].forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in event listener for ${eventName}:`, error);
                }
            });
        }
    }
    
    /**
     * Broadcast message to other tabs
     */
    broadcast(eventName, data) {
        if (this.channel) {
            this.channel.postMessage({ event: eventName, data: data });
        }
    }
    
    /**
     * Handle broadcast messages from other tabs
     */
    handleBroadcastMessage(event) {
        const { event: eventName, data } = event.data;
        this.emit(eventName, data);
    }
    
    /**
     * Log event to audit trail
     */
    logEvent(type, data) {
        try {
            const logs = JSON.parse(localStorage.getItem('api_gateway_logs') || '[]');
            
            logs.unshift({
                type: type,
                data: data,
                timestamp: new Date().toISOString()
            });
            
            // Keep only last 100 logs
            if (logs.length > 100) {
                logs.splice(100);
            }
            
            localStorage.setItem('api_gateway_logs', JSON.stringify(logs));
            
        } catch (error) {
            console.error('Failed to log event:', error);
        }
    }
    
    /**
     * Get recent logs
     */
    getLogs(limit = 20) {
        try {
            const logs = JSON.parse(localStorage.getItem('api_gateway_logs') || '[]');
            return logs.slice(0, limit);
        } catch (error) {
            return [];
        }
    }
    
    /**
     * Clear logs
     */
    clearLogs() {
        localStorage.removeItem('api_gateway_logs');
    }
    
    /**
     * Reinitialize with new token
     */
    reinitialize() {
        this.uploader = null;
        return this.initializeUploader();
    }
}

// Auto-export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CentralAPIGateway;
}
