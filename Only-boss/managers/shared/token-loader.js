/**
 * 🔗 Universal Token Loader
 * Add this script to any manager's HTML <head> section
 * Automatically loads and validates GitHub token
 * Version: 1.0.0
 * 
 * Usage:
 * <script src="../shared/unified-token-manager.js"></script>
 * <script src="../shared/token-loader.js"></script>
 */

(function() {
    'use strict';

    console.log('🔐 Token Loader initializing...');

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTokenSystem);
    } else {
        initTokenSystem();
    }

    async function initTokenSystem() {
        console.log('📥 Loading token system...');

        // Check if Unified Token Manager is available
        if (!window.UnifiedTokenManager) {
            console.error('❌ Unified Token Manager not loaded!');
            console.error('   Make sure to include: <script src="../shared/unified-token-manager.js"></script>');
            return;
        }

        // Initialize token manager
        window.tokenManager = new window.UnifiedTokenManager();
        console.log('✅ Token Manager initialized');

        // Perform initial check
        const result = await window.tokenManager.initialize();

        if (result.success) {
            console.log('✅ Token system ready');
            
            // Add status badge to page
            addStatusBadge();
            
            // Dispatch custom event for managers to listen
            window.dispatchEvent(new CustomEvent('tokenReady', { 
                detail: result.health 
            }));
        } else {
            console.warn('⚠️ Token system initialized but token not configured');
            
            // Dispatch event even if token missing (manager can handle)
            window.dispatchEvent(new CustomEvent('tokenMissing', { 
                detail: result.message 
            }));
        }
    }

    function addStatusBadge() {
        // Only add badge if not already exists
        if (document.getElementById('tokenStatusBadge')) return;

        // Insert badge HTML
        document.body.insertAdjacentHTML('beforeend', window.tokenManager.getStatusBadgeHTML());

        // Update badge status
        window.tokenManager.updateStatusBadge();

        console.log('✅ Status badge added to page');
    }

    // Expose helper functions
    window.TokenLoader = {
        /**
         * Get current token
         * @returns {string|null} GitHub token or null
         */
        getToken: function() {
            return window.tokenManager ? window.tokenManager.token : null;
        },

        /**
         * Check if token is available
         * @returns {boolean}
         */
        hasToken: function() {
            return !!this.getToken();
        },

        /**
         * Get token health status
         * @returns {Promise<Object>}
         */
        getHealth: async function() {
            if (!window.tokenManager) {
                return { status: 'error', message: 'Token Manager not initialized' };
            }
            return await window.tokenManager.getHealthStatus();
        },

        /**
         * Validate token manually
         * @returns {Promise<Object>}
         */
        validateToken: async function() {
            if (!window.tokenManager) {
                throw new Error('Token Manager not initialized');
            }
            return await window.tokenManager.validateToken();
        },

        /**
         * Redirect to API Config Manager
         */
        goToConfig: function() {
            window.location.href = '../shared/api-config-manager.html';
        },

        /**
         * Show token status modal
         */
        showStatus: async function() {
            if (window.tokenManager) {
                await window.tokenManager.showStatusDetails();
            }
        }
    };

    console.log('✅ Token Loader ready');
})();

/**
 * INTEGRATION EXAMPLES:
 * 
 * 1. In HTML <head>:
 *    <script src="../shared/unified-token-manager.js"></script>
 *    <script src="../shared/token-loader.js"></script>
 * 
 * 2. In your manager's JavaScript:
 *    // Wait for token system to be ready
 *    window.addEventListener('tokenReady', (event) => {
 *        console.log('Token ready!', event.detail);
 *        const token = TokenLoader.getToken();
 *        // Initialize your uploader with token
 *        initializeUploader(token);
 *    });
 * 
 *    // Handle missing token
 *    window.addEventListener('tokenMissing', (event) => {
 *        console.warn('Token missing:', event.detail);
 *        // Show setup instructions or redirect
 *    });
 * 
 * 3. Manual token retrieval:
 *    const token = TokenLoader.getToken();
 *    if (token) {
 *        // Use token
 *    } else {
 *        TokenLoader.goToConfig();
 *    }
 * 
 * 4. Check token health:
 *    const health = await TokenLoader.getHealth();
 *    console.log('Health:', health.status, health.message);
 */
