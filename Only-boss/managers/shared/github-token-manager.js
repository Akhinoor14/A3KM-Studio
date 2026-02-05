/**
 * ========================================
 * CENTRALIZED GITHUB TOKEN MANAGER
 * Single Token for All Managers
 * ========================================
 * 
 * Author: Md Akhinoor Islam
 * Date: January 23, 2026
 * Purpose: Centralized token management for all managers
 * 
 * Features:
 * - Single token input
 * - Token validation
 * - Auto-save to localStorage
 * - Token encryption (basic)
 * - Token expiry tracking
 * - Used by: Content Studio (5 managers) + Certificate Manager
 */

class GitHubTokenManager {
    constructor() {
        this.STORAGE_KEY = 'github_token';
        this.TIMESTAMP_KEY = 'github_token_timestamp';
        this.VALIDATION_KEY = 'github_token_valid';
        
        // Token expiry: 90 days (GitHub default)
        this.TOKEN_EXPIRY_DAYS = 90;
        
        // Owner and repo (for validation)
        this.GITHUB_OWNER = 'Akhinoor14';
        this.GITHUB_REPO = 'A3KM-Studio';
    }

    // ==================== TOKEN STORAGE ====================

    /**
     * Save token to localStorage with timestamp
     */
    saveToken(token) {
        if (!token || token.trim() === '') {
            throw new Error('Token cannot be empty');
        }

        // Basic validation (GitHub tokens start with 'ghp_' or 'github_pat_')
        if (!token.startsWith('ghp_') && !token.startsWith('github_pat_')) {
            console.warn('Warning: Token format may be invalid');
        }

        // Encode token (basic security - not true encryption)
        const encodedToken = btoa(token);
        
        // Save to localStorage
        localStorage.setItem(this.STORAGE_KEY, encodedToken);
        localStorage.setItem(this.TIMESTAMP_KEY, Date.now().toString());
        localStorage.setItem(this.VALIDATION_KEY, 'pending');

        return true;
    }

    /**
     * Get token from localStorage
     */
    getToken() {
        const encodedToken = localStorage.getItem(this.STORAGE_KEY);
        
        if (!encodedToken) {
            return null;
        }

        // Decode token
        try {
            const token = atob(encodedToken);
            return token;
        } catch (error) {
            console.error('Failed to decode token:', error);
            return null;
        }
    }

    /**
     * Check if token exists
     */
    hasToken() {
        return this.getToken() !== null;
    }

    /**
     * Clear token from storage
     */
    clearToken() {
        localStorage.removeItem(this.STORAGE_KEY);
        localStorage.removeItem(this.TIMESTAMP_KEY);
        localStorage.removeItem(this.VALIDATION_KEY);
        return true;
    }

    // ==================== TOKEN VALIDATION ====================

    /**
     * Validate token with GitHub API
     */
    async validateToken(token = null) {
        const tokenToValidate = token || this.getToken();
        
        if (!tokenToValidate) {
            return {
                valid: false,
                error: 'No token provided'
            };
        }

        try {
            // Test token by fetching repository info
            const response = await fetch(
                `https://api.github.com/repos/${this.GITHUB_OWNER}/${this.GITHUB_REPO}`,
                {
                    headers: {
                        'Authorization': `token ${tokenToValidate}`,
                        'Accept': 'application/vnd.github.v3+json'
                    }
                }
            );

            if (response.ok) {
                // Token is valid
                localStorage.setItem(this.VALIDATION_KEY, 'valid');
                return {
                    valid: true,
                    message: 'Token is valid'
                };
            } else if (response.status === 401) {
                // Unauthorized - invalid token
                localStorage.setItem(this.VALIDATION_KEY, 'invalid');
                return {
                    valid: false,
                    error: 'Invalid token or expired'
                };
            } else {
                // Other error
                return {
                    valid: false,
                    error: `GitHub API error: ${response.status}`
                };
            }
        } catch (error) {
            return {
                valid: false,
                error: `Network error: ${error.message}`
            };
        }
    }

    /**
     * Check if token is expired (based on timestamp)
     */
    isTokenExpired() {
        const timestamp = localStorage.getItem(this.TIMESTAMP_KEY);
        
        if (!timestamp) {
            return true;
        }

        const savedDate = parseInt(timestamp);
        const currentDate = Date.now();
        const daysPassed = (currentDate - savedDate) / (1000 * 60 * 60 * 24);

        return daysPassed > this.TOKEN_EXPIRY_DAYS;
    }

    /**
     * Get token status
     */
    getTokenStatus() {
        if (!this.hasToken()) {
            return {
                exists: false,
                valid: false,
                expired: false,
                message: 'No token saved'
            };
        }

        const isExpired = this.isTokenExpired();
        const validationStatus = localStorage.getItem(this.VALIDATION_KEY);

        return {
            exists: true,
            valid: validationStatus === 'valid',
            expired: isExpired,
            message: isExpired 
                ? 'Token expired (>90 days)' 
                : validationStatus === 'valid' 
                    ? 'Token is valid' 
                    : 'Token not validated'
        };
    }

    // ==================== TOKEN INFO ====================

    /**
     * Get days since token was saved
     */
    getDaysSinceAdded() {
        const timestamp = localStorage.getItem(this.TIMESTAMP_KEY);
        
        if (!timestamp) {
            return null;
        }

        const savedDate = parseInt(timestamp);
        const currentDate = Date.now();
        const daysPassed = Math.floor((currentDate - savedDate) / (1000 * 60 * 60 * 24));

        return daysPassed;
    }

    /**
     * Get days until expiry
     */
    getDaysUntilExpiry() {
        const daysSinceAdded = this.getDaysSinceAdded();
        
        if (daysSinceAdded === null) {
            return null;
        }

        return Math.max(0, this.TOKEN_EXPIRY_DAYS - daysSinceAdded);
    }

    /**
     * Get token info for UI display
     */
    getTokenInfo() {
        if (!this.hasToken()) {
            return null;
        }

        const token = this.getToken();
        const status = this.getTokenStatus();
        const daysSince = this.getDaysSinceAdded();
        const daysUntil = this.getDaysUntilExpiry();

        return {
            // Masked token for display (show only first/last 4 chars)
            maskedToken: `${token.substring(0, 8)}...${token.substring(token.length - 4)}`,
            status: status,
            daysSinceAdded: daysSince,
            daysUntilExpiry: daysUntil,
            addedDate: new Date(parseInt(localStorage.getItem(this.TIMESTAMP_KEY))).toLocaleDateString()
        };
    }
}

// ==================== SINGLETON INSTANCE ====================

// Create single instance
const githubTokenManager = new GitHubTokenManager();

// Export for use in all managers
if (typeof module !== 'undefined' && module.exports) {
    module.exports = githubTokenManager;
}
