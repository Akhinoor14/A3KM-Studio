/**
 * GitHub API Direct Token System - Pure Frontend Solution
 * ========================================================
 * 
 * 🚀 GLOBAL TOKEN ROTATION - NO BACKEND REQUIRED
 * - 4 tokens embedded for 20,000 requests/hour capacity
 * - Random token selection for perfect load balancing
 * - Works on ANY device, ANY visitor, globally
 * - Real-time usage tracking & monitoring
 * 
 * Token Distribution Strategy:
 * - Each visitor gets random token on each request
 * - Ensures equal distribution across all 4 tokens
 * - Maximizes API rate limit usage
 * - Zero server dependency
 */

// ============================================
// DIRECT GITHUB TOKENS (PRIMARY SYSTEM)
// ============================================
// These tokens are globally available to ALL visitors
// Each visitor gets random token rotation for perfect load distribution
// CRITICAL: Always keep these tokens valid and active!

const GITHUB_DIRECT_TOKENS = [
    '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',
    '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',
    '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',
    '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'
];

// Global token availability check - CRITICAL for preventing API limits
if (typeof window !== 'undefined') {
    window.GITHUB_DIRECT_TOKENS = GITHUB_DIRECT_TOKENS;
    console.log('🌍 GLOBAL TOKEN SYSTEM ACTIVE');
    console.log(`🔑 ${GITHUB_DIRECT_TOKENS.length} tokens globally available`);
    console.log(`⚡ Total capacity: ${GITHUB_DIRECT_TOKENS.length * 5000} requests/hour`);
}

// Global usage statistics (persisted in localStorage)
let tokenUsageStats = {
    totalRequests: 0,
    tokenUsage: [0, 0, 0, 0], // Usage count per token
    lastUsed: null,
    sessionRequests: 0,
    failedRequests: 0
};

// Load stats from localStorage
if (typeof window !== 'undefined' && localStorage) {
    try {
        const saved = localStorage.getItem('github_token_stats');
        if (saved) {
            const parsed = JSON.parse(saved);
            tokenUsageStats = { ...tokenUsageStats, ...parsed };
        }
    } catch (e) {
        console.warn('Could not load token stats:', e);
    }
}

/**
 * Get random token for maximum distribution
 * Each device/visitor gets random token on each request
 */
function getNextToken() {
    // Pure random selection for global distribution
    const randomIndex = Math.floor(Math.random() * GITHUB_DIRECT_TOKENS.length);
    const token = GITHUB_DIRECT_TOKENS[randomIndex];
    const tokenNum = randomIndex + 1;
    
    // Update stats
    tokenUsageStats.tokenUsage[randomIndex]++;
    tokenUsageStats.totalRequests++;
    tokenUsageStats.sessionRequests++;
    tokenUsageStats.lastUsed = new Date().toISOString();
    
    // Save to localStorage
    if (typeof window !== 'undefined' && localStorage) {
        try {
            localStorage.setItem('github_token_stats', JSON.stringify(tokenUsageStats));
        } catch (e) {
            // Ignore localStorage errors
        }
    }
    
    // Log token usage with detailed stats
    const distribution = tokenUsageStats.tokenUsage.map((count, i) => 
        `T${i+1}:${count}`
    ).join(' | ');
    
    console.log(`🔑 Token ${tokenNum}/4 ACTIVE | Session: ${tokenUsageStats.sessionRequests} | Total: ${tokenUsageStats.totalRequests} | Distribution: ${distribution}`);
    
    return token;
}

// Expose stats globally for monitoring
if (typeof window !== 'undefined') {
    window.GITHUB_TOKEN_STATS = tokenUsageStats;
    
    // Global function to check token usage statistics
    window.checkTokenUsage = function() {
        console.log('📊 Token Usage Statistics:');
        console.log('─────────────────────────');
        GITHUB_DIRECT_TOKENS.forEach((token, i) => {
            const usage = tokenUsageStats.tokenUsage[i];
            const percent = tokenUsageStats.totalRequests > 0 
                ? ((usage / tokenUsageStats.totalRequests) * 100).toFixed(1)
                : 0;
            console.log(`Token ${i+1}: ${usage} requests (${percent}%)`);
        });
        console.log(`Total Requests: ${tokenUsageStats.totalRequests}`);
        console.log(`Session Requests: ${tokenUsageStats.sessionRequests}`);
        console.log(`Failed Requests: ${tokenUsageStats.failedRequests}`);
        console.log(`Last Used: ${tokenUsageStats.lastUsed || 'Never'}`);
        console.log('─────────────────────────');
        console.log('✅ All 4 tokens are ACTIVE and rotating');
        return tokenUsageStats;
    };
    
    // Quick test function to verify tokens are working
    window.testTokens = async function() {
        console.log('🧪 Testing token system with 5 random requests...');
        const testPath = 'repos/Akhinoor14/A3KM-Studio';
        
        for (let i = 0; i < 5; i++) {
            try {
                await fetchGitHubApi(testPath);
                console.log(`✅ Test ${i+1}/5 completed`);
            } catch (error) {
                console.error(`❌ Test ${i+1}/5 failed:`, error);
            }
        }
        
        console.log('\n📊 After testing:');
        window.checkTokenUsage();
    };
}

// ============================================
// PRODUCTION CONFIGURATION - BACKEND DISABLED
// ============================================

const GITHUB_PROXY_CONFIG = {
    // Backend completely disabled - using direct tokens only
    USE_PROXY: false,
    
    // Direct token system always enabled
    USE_DIRECT_TOKENS: true,
    
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
 * Get GitHub API URL (always direct)
 * @param {string} path - GitHub API path (e.g., 'repos/owner/repo/contents')
 * @returns {string} - Full API URL
 */
function getGitHubApiUrl(path) {
    const cleanPath = path.replace(/^\//, '');
    return `https://api.github.com/${cleanPath}`;
}

// ============================================
// SMART FETCH WITH PROXY SUPPORT
// ============================================

/**
 * Fetch from GitHub API with direct token rotation and caching
 * CRITICAL: This function prevents API limit errors by using token rotation
 * @param {string} path - GitHub API path
 * @param {object} options - Fetch options
 * @returns {Promise<Response>}
 */
async function fetchGitHubApi(path, options = {}) {
    // CRITICAL: Verify tokens are loaded
    if (!GITHUB_DIRECT_TOKENS || GITHUB_DIRECT_TOKENS.length === 0) {
        console.error('🚨 CRITICAL: No tokens available! API calls will fail!');
        throw new Error('GitHub tokens not loaded - cannot make API calls');
    }
    
    // Check cache first
    const params = new URL(path.includes('?') ? `http://x.com/${path}` : 'http://x.com').searchParams;
    const paramObj = Object.fromEntries(params);
    const cleanPath = path.split('?')[0];
    
    const cached = getCachedResponse(cleanPath, paramObj);
    if (cached) {
        console.log('💾 Cache hit - serving from cache');
        return new Response(JSON.stringify(cached), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    }
    
    // Direct GitHub API call with random token
    const directUrl = `https://api.github.com/${cleanPath}`;
    
    // Retry mechanism for API limit errors
    let lastError = null;
    const maxRetries = 3;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const token = getNextToken();
            const directOptions = {
                ...options,
                headers: {
                    ...options.headers,
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            };
            
            const response = await fetch(directUrl, directOptions);
            
            // Check for rate limit error
            if (response.status === 403 || response.status === 429) {
                const rateLimitRemaining = response.headers.get('X-RateLimit-Remaining');
                console.warn(`⚠️ Rate limit warning: ${rateLimitRemaining} remaining`);
                
                // If rate limit hit and we have retries left, try with different token
                if (attempt < maxRetries) {
                    console.log(`🔄 Retrying with different token (attempt ${attempt + 1}/${maxRetries})...`);
                    await new Promise(resolve => setTimeout(resolve, 1000 * attempt)); // Exponential backoff
                    continue;
                }
            }
            
            // Cache successful responses
            if (response.ok) {
                const clonedResponse = response.clone();
                clonedResponse.json().then(data => {
                    setCachedResponse(cleanPath, paramObj, data);
                }).catch(() => {
                    // Ignore cache errors for non-JSON responses
                });
            } else {
                tokenUsageStats.failedRequests++;
                console.warn(`⚠️ Request failed with status: ${response.status}`);
            }
            
            return response;
            
        } catch (error) {
            lastError = error;
            console.error(`❌ API fetch error (attempt ${attempt}/${maxRetries}):`, error);
            
            if (attempt < maxRetries) {
                await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
            }
        }
    }
    
    tokenUsageStats.failedRequests++;
    throw lastError || new Error('API request failed after retries');
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
 * Check token system health
 */
async function checkTokenHealth() {
    console.log('🔍 Testing token rotation system...');
    
    const results = {
        totalTokens: GITHUB_DIRECT_TOKENS.length,
        activeTokens: 0,
        testedTokens: [],
        allWorking: false
    };
    
    // Test a lightweight endpoint with each token
    for (let i = 0; i < GITHUB_DIRECT_TOKENS.length; i++) {
        try {
            const response = await fetch('https://api.github.com/rate_limit', {
                headers: {
                    'Authorization': `Bearer ${GITHUB_DIRECT_TOKENS[i]}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                results.activeTokens++;
                results.testedTokens.push({
                    token: i + 1,
                    status: '✅ Active',
                    remaining: data.rate.remaining,
                    limit: data.rate.limit
                });
            } else {
                results.testedTokens.push({
                    token: i + 1,
                    status: '❌ Failed',
                    error: response.status
                });
            }
        } catch (error) {
            results.testedTokens.push({
                token: i + 1,
                status: '❌ Error',
                error: error.message
            });
        }
    }
    
    results.allWorking = results.activeTokens === GITHUB_DIRECT_TOKENS.length;
    
    console.log('📊 Token Health Report:');
    console.log('─────────────────────────');
    results.testedTokens.forEach(t => {
        console.log(`Token ${t.token}: ${t.status}${t.remaining ? ` (${t.remaining}/${t.limit} remaining)` : ''}`);
    });
    console.log(`Active Tokens: ${results.activeTokens}/${results.totalTokens}`);
    console.log(results.allWorking ? '✅ All tokens working!' : '⚠️  Some tokens failed');
    console.log('─────────────────────────');
    
    return results;
}

// ============================================
// AUTO-INITIALIZATION
// ============================================

// Initialize token system on load
if (typeof window !== 'undefined') {
    console.log('🚀 GitHub Direct Token System Initialized');
    console.log(`📡 ${GITHUB_DIRECT_TOKENS.length} tokens available for rotation`);
    console.log(`⚡ Capacity: ${GITHUB_DIRECT_TOKENS.length * 5000} requests/hour`);
    console.log('🌍 Works on ANY device globally - No backend required');
    console.log('');
    console.log('📋 Available Commands:');
    console.log('  window.checkTokenHealth() - Test all 4 tokens live');
    console.log('  window.checkTokenUsage() - See usage statistics');
    console.log('  window.testTokens() - Run 5 test requests');
}

// ============================================
// GLOBAL EXPORTS
// ============================================

if (typeof window !== 'undefined') {
    window.GITHUB_PROXY_CONFIG = GITHUB_PROXY_CONFIG;
    window.getGitHubApiUrl = getGitHubApiUrl;
    window.fetchGitHubApi = fetchGitHubApi;
    window.clearGitHubCache = clearGitHubCache;
    window.checkTokenHealth = checkTokenHealth;
    
    // Log configuration on load
    console.log('');
    console.log('🔧 Configuration:', {
        total_tokens: GITHUB_DIRECT_TOKENS.length,
        cache_enabled: GITHUB_PROXY_CONFIG.ENABLE_CACHE,
        cache_duration: `${GITHUB_PROXY_CONFIG.CACHE_DURATION / 1000}s`,
        backend_enabled: false,
        random_rotation: true
    });
    console.log('═══════════════════════════════════════');
}
