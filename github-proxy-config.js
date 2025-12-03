/**
 * GitHub API Proxy Configuration - Hybrid Setup with Direct Token Rotation
 * =========================================================================
 * 
 * FALLBACK TOKENS: Frontend has embedded tokens for direct GitHub API access
 * If backend fails, tokens automatically rotate to ensure 20,000 req/hour
 * 
 * Backend Setup (Optional):
 * 1. cd "Backend projects"
 * 2. python secure-proxy-server.py
 * 
 * Direct Token System:
 * - 4 tokens embedded for failsafe operation
 * - Automatic rotation for load balancing
 * - Works even if backend is offline
 * - 20,000 requests/hour capacity
 */

// ============================================
// DIRECT GITHUB TOKENS (FALLBACK SYSTEM)
// ============================================

const GITHUB_DIRECT_TOKENS = [
    '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',
    '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',
    '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',
    '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'
];

let currentTokenIndex = 0;
let tokenUsageStats = {
    totalRequests: 0,
    tokenUsage: [0, 0, 0, 0], // Usage count per token
    lastUsed: null,
    backendUsed: 0,
    directUsed: 0
};

function getNextToken() {
    const token = GITHUB_DIRECT_TOKENS[currentTokenIndex];
    const tokenNum = currentTokenIndex + 1;
    
    // Update stats
    tokenUsageStats.tokenUsage[currentTokenIndex]++;
    tokenUsageStats.totalRequests++;
    tokenUsageStats.directUsed++;
    tokenUsageStats.lastUsed = new Date().toLocaleTimeString();
    
    // Log token usage
    console.log(`🔑 Using Token ${tokenNum}/4 | Total Requests: ${tokenUsageStats.totalRequests} | Backend: ${tokenUsageStats.backendUsed} | Direct: ${tokenUsageStats.directUsed}`);
    
    // Rotate to next token
    currentTokenIndex = (currentTokenIndex + 1) % GITHUB_DIRECT_TOKENS.length;
    return token;
}

// Expose stats globally for debugging
if (typeof window !== 'undefined') {
    window.GITHUB_TOKEN_STATS = tokenUsageStats;
}

// ============================================
// PRODUCTION CONFIGURATION
// ============================================

const GITHUB_PROXY_CONFIG = {
    // Try backend first, fallback to direct tokens
    USE_PROXY: true,
    
    // Backend proxy server URL (optional)
    PROXY_URL: 'http://localhost:5000',
    
    // ALWAYS use direct tokens if proxy fails
    AUTO_FALLBACK: true,
    USE_DIRECT_TOKENS: true, // Enable embedded token rotation
    
    // Cache responses for better performance
    ENABLE_CACHE: true,
    CACHE_DURATION: 300000 // 5 minutes in milliseconds
};

// ============================================
// SMART CACHING SYSTEM
// ============================================

const responseCache = new Map();

function getCacheKey(path, params = {}) {
    const paramString = Object.keys(params).sort().map(k => `${k}=${params[k]}`).join('&');
    return `${path}?${paramString}`;
}

function getCachedResponse(path, params) {
    if (!GITHUB_PROXY_CONFIG.ENABLE_CACHE) return null;
    
    const key = getCacheKey(path, params);
    const cached = responseCache.get(key);
    
    if (cached && Date.now() - cached.timestamp < GITHUB_PROXY_CONFIG.CACHE_DURATION) {
        console.log(`💾 Cache hit: ${path}`);
        return cached.data;
    }
    
    return null;
}

function setCachedResponse(path, params, data) {
    if (!GITHUB_PROXY_CONFIG.ENABLE_CACHE) return;
    
    const key = getCacheKey(path, params);
    responseCache.set(key, {
        data: data,
        timestamp: Date.now()
    });
    
    // Limit cache size
    if (responseCache.size > 100) {
        const firstKey = responseCache.keys().next().value;
        responseCache.delete(firstKey);
    }
}

// ============================================
// API URL BUILDER
// ============================================

/**
 * Get GitHub API URL (proxy or direct)
 * @param {string} path - GitHub API path (e.g., 'repos/owner/repo/contents')
 * @returns {string} - Full API URL
 */
function getGitHubApiUrl(path) {
    if (GITHUB_PROXY_CONFIG.USE_PROXY) {
        const cleanPath = path.replace(/^\//, '');
        return `${GITHUB_PROXY_CONFIG.PROXY_URL}/api/github/${cleanPath}`;
    }
    
    return `https://api.github.com/${path}`;
}

// ============================================
// SMART FETCH WITH PROXY SUPPORT
// ============================================

/**
 * Fetch from GitHub API with automatic proxy and caching
 * @param {string} path - GitHub API path
 * @param {object} options - Fetch options
 * @returns {Promise<Response>}
 */
async function fetchGitHubApi(path, options = {}) {
    // Check cache first
    const params = new URL(path.includes('?') ? `http://x.com/${path}` : 'http://x.com').searchParams;
    const paramObj = Object.fromEntries(params);
    const cleanPath = path.split('?')[0];
    
    const cached = getCachedResponse(cleanPath, paramObj);
    if (cached) {
        return new Response(JSON.stringify(cached), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    }
    
    const url = getGitHubApiUrl(path);
    
    try {
        // If using proxy, remove Authorization header (backend handles tokens)
        if (GITHUB_PROXY_CONFIG.USE_PROXY) {
            const proxyOptions = { ...options };
            if (proxyOptions.headers) {
                delete proxyOptions.headers.Authorization;
                delete proxyOptions.headers['Authorization'];
            }
            
            const response = await fetch(url, proxyOptions);
            
            // Track backend usage
            if (response.ok) {
                tokenUsageStats.backendUsed++;
                tokenUsageStats.totalRequests++;
                console.log(`✅ Backend used | Total: ${tokenUsageStats.totalRequests} | Backend: ${tokenUsageStats.backendUsed} | Direct: ${tokenUsageStats.directUsed}`);
            }
            
            // Cache successful responses
            if (response.ok) {
                const clonedResponse = response.clone();
                clonedResponse.json().then(data => {
                    setCachedResponse(cleanPath, paramObj, data);
                });
            }
            
            // Auto-fallback if proxy fails - USE DIRECT TOKENS
            if (!response.ok && GITHUB_PROXY_CONFIG.AUTO_FALLBACK) {
                console.log('🔄 Proxy failed, using direct token rotation...');
                const directUrl = `https://api.github.com/${cleanPath}`;
                const directOptions = {
                    ...options,
                    headers: {
                        ...options.headers,
                        'Authorization': `Bearer ${getNextToken()}`,
                        'Accept': 'application/vnd.github.v3+json'
                    }
                };
                return await fetch(directUrl, directOptions);
            }
            
            return response;
        }
        
        // Direct GitHub API call with token rotation
        const directUrl = `https://api.github.com/${cleanPath}`;
        const directOptions = {
            ...options,
            headers: {
                ...options.headers,
                'Authorization': `Bearer ${getNextToken()}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        };
        const response = await fetch(directUrl, directOptions);
        
        // Cache successful responses
        if (response.ok) {
            const clonedResponse = response.clone();
            clonedResponse.json().then(data => {
                setCachedResponse(cleanPath, paramObj, data);
            });
        }
        
        return response;
        
    } catch (error) {
        console.error('❌ API fetch error:', error);
        
        // Network error - ALWAYS try direct tokens
        if (GITHUB_PROXY_CONFIG.USE_DIRECT_TOKENS) {
            console.log('🔄 Error, falling back to direct token rotation...');
            const directUrl = `https://api.github.com/${cleanPath}`;
            const directOptions = {
                ...options,
                headers: {
                    ...options.headers,
                    'Authorization': `Bearer ${getNextToken()}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            };
            return await fetch(directUrl, directOptions);
        }
        
        throw error;
    }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Clear cache (useful for forcing refresh)
 */
function clearGitHubCache() {
    responseCache.clear();
    console.log('🗑️ GitHub API cache cleared');
}

/**
 * Check proxy server health
 */
async function checkProxyHealth() {
    if (!GITHUB_PROXY_CONFIG.USE_PROXY) {
        return { available: false, reason: 'Proxy not enabled' };
    }
    
    try {
        const response = await fetch(`${GITHUB_PROXY_CONFIG.PROXY_URL}/health`, {
            method: 'GET',
            timeout: 5000
        });
        
        if (response.ok) {
            const data = await response.json();
            return { 
                available: true, 
                ...data 
            };
        }
        
        return { available: false, reason: 'Proxy unhealthy' };
    } catch (error) {
        return { available: false, reason: error.message };
    }
}

// ============================================
// AUTO-INITIALIZATION
// ============================================

// Check proxy health on load
if (GITHUB_PROXY_CONFIG.USE_PROXY) {
    checkProxyHealth().then(health => {
        if (health.available) {
            console.log('✅ Backend proxy connected:', health);
            console.log(`⚡ Effective rate limit: ${health.effective_limit} req/hour`);
        } else {
            console.warn('⚠️  Backend proxy not available:', health.reason);
            if (GITHUB_PROXY_CONFIG.AUTO_FALLBACK) {
                console.log('🔄 Using direct GitHub API as fallback');
            }
        }
    });
}

// ============================================
// GLOBAL EXPORTS
// ============================================

if (typeof window !== 'undefined') {
    window.GITHUB_PROXY_CONFIG = GITHUB_PROXY_CONFIG;
    window.getGitHubApiUrl = getGitHubApiUrl;
    window.fetchGitHubApi = fetchGitHubApi;
    window.clearGitHubCache = clearGitHubCache;
    window.checkProxyHealth = checkProxyHealth;
    
    // Log configuration on load
    console.log('🔧 GitHub Proxy Config:', {
        proxy_enabled: GITHUB_PROXY_CONFIG.USE_PROXY,
        proxy_url: GITHUB_PROXY_CONFIG.PROXY_URL,
        cache_enabled: GITHUB_PROXY_CONFIG.ENABLE_CACHE,
        auto_fallback: GITHUB_PROXY_CONFIG.AUTO_FALLBACK
    });
}
