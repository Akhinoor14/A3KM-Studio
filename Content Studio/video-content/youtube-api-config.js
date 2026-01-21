/**
 * YouTube Data API v3 Configuration
 * 
 * How to get your API key:
 * 1. Go to: https://console.cloud.google.com/
 * 2. Create a new project or select existing
 * 3. Enable "YouTube Data API v3"
 * 4. Go to Credentials → Create Credentials → API Key
 * 5. Copy the API key and paste below
 * 
 * IMPORTANT: Restrict your API key to:
 * - Application restrictions: HTTP referrers (websites)
 * - Website restrictions: Add your domain(s)
 * - API restrictions: Restrict to YouTube Data API v3
 */

const YOUTUBE_CONFIG = {
    // Replace this with your actual YouTube Data API v3 key
    API_KEY: 'YOUR_YOUTUBE_API_KEY_HERE',
    
    // API endpoints
    VIDEOS_ENDPOINT: 'https://www.googleapis.com/youtube/v3/videos',
    
    // API quotas (for reference)
    DAILY_QUOTA: 10000, // Default free quota
    COST_PER_REQUEST: 1, // videos.list costs 1 quota unit
    
    // Batch settings
    MAX_IDS_PER_REQUEST: 50, // YouTube API limit
    
    // Cache settings
    CACHE_DURATION: 3600000, // 1 hour in milliseconds
    
    // Parts to request (keep minimal to save quota)
    PARTS: ['contentDetails', 'statistics']
};

// Validate API key before use
function validateYouTubeConfig() {
    if (YOUTUBE_CONFIG.API_KEY === 'YOUR_YOUTUBE_API_KEY_HERE' || !YOUTUBE_CONFIG.API_KEY) {
        console.warn('⚠️ YouTube API key not configured!');
        console.info('📝 To enable real-time stats:');
        console.info('1. Get API key from: https://console.cloud.google.com/');
        console.info('2. Edit: Content Studio/video-content/youtube-api-config.js');
        console.info('3. Replace API_KEY with your key');
        return false;
    }
    return true;
}

// Export configuration
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { YOUTUBE_CONFIG, validateYouTubeConfig };
}
