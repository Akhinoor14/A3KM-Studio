/**
 * YouTube Data Fetcher (Mobile Version)
 * Automatically extract video metadata from YouTube links
 * Author: Md Akhinoor Islam
 * A3KM Studio - Mobile
 */

class YouTubeDataFetcher {
    constructor() {
        this.cache = new Map();
        this.apiKey = typeof YOUTUBE_CONFIG !== 'undefined' ? YOUTUBE_CONFIG.API_KEY : null;
        this.hasValidKey = this.apiKey && !this.apiKey.includes('XXXXXXX') && this.apiKey !== 'YOUR_YOUTUBE_API_KEY_HERE';
        
        if (this.hasValidKey) {
            console.log('✅ YouTube Data Fetcher initialized with API key');
        } else {
            console.log('⚠️ YouTube Data Fetcher: Using fallback mode (no API key)');
        }
    }

    // ==================== EXTRACT VIDEO ID ====================

    extractVideoId(url) {
        if (!url) return null;
        
        // Support multiple YouTube URL formats
        const patterns = [
            /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?\s]{11})/,
            /youtube\.com\/watch\?.*v=([^&?\s]{11})/,
            /^([a-zA-Z0-9_-]{11})$/ // Direct video ID
        ];

        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match) return match[1];
        }

        return null;
    }

    // ==================== FETCH WITH YOUTUBE API ====================

    async fetchWithAPI(videoId) {
        if (!this.hasValidKey) return null;

        try {
            const url = `${YOUTUBE_CONFIG.VIDEOS_ENDPOINT}?id=${videoId}&part=${YOUTUBE_CONFIG.PARTS.join(',')}&key=${this.apiKey}`;
            
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            const data = await response.json();
            
            if (!data.items || data.items.length === 0) {
                throw new Error('Video not found');
            }

            const item = data.items[0];
            const snippet = item.snippet || {};
            const statistics = item.statistics || {};
            const contentDetails = item.contentDetails || {};

            return {
                id: videoId,
                title: snippet.title || 'Unknown Title',
                author: snippet.channelTitle || 'Unknown Channel',
                channelId: snippet.channelId,
                channelUrl: `https://www.youtube.com/channel/${snippet.channelId}`,
                description: snippet.description || '',
                thumbnail: snippet.thumbnails?.high?.url || snippet.thumbnails?.default?.url || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
                thumbnailLarge: snippet.thumbnails?.maxres?.url || `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
                thumbnailHD: snippet.thumbnails?.high?.url || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
                embedUrl: `https://www.youtube.com/embed/${videoId}`,
                watchUrl: `https://www.youtube.com/watch?v=${videoId}`,
                publishedAt: snippet.publishedAt,
                duration: this.parseDuration(contentDetails.duration),
                views: parseInt(statistics.viewCount || 0),
                likes: parseInt(statistics.likeCount || 0),
                comments: parseInt(statistics.commentCount || 0),
                tags: snippet.tags || [],
                category: snippet.categoryId,
                type: this.detectVideoType(snippet.title),
                fetchedAt: new Date().toISOString()
            };
        } catch (error) {
            console.error('YouTube API fetch failed:', error);
            return null;
        }
    }

    // ==================== PARSE ISO 8601 DURATION ====================

    parseDuration(duration) {
        if (!duration) return '0:00';
        
        const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
        if (!match) return '0:00';

        const hours = parseInt(match[1]) || 0;
        const minutes = parseInt(match[2]) || 0;
        const seconds = parseInt(match[3]) || 0;

        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    // ==================== FETCH WITH OEMBED (FALLBACK) ====================

    async fetchWithOEmbed(videoId) {
        try {
            const oEmbedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
            
            const response = await fetch(oEmbedUrl);
            if (!response.ok) {
                throw new Error('Failed to fetch video data');
            }

            const data = await response.json();

            return {
                id: videoId,
                title: data.title || 'Unknown Title',
                author: data.author_name || 'Unknown Channel',
                channelUrl: data.author_url,
                thumbnail: data.thumbnail_url,
                thumbnailLarge: `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
                thumbnailHD: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
                embedUrl: `https://www.youtube.com/embed/${videoId}`,
                watchUrl: `https://www.youtube.com/watch?v=${videoId}`,
                type: this.detectVideoType(data.title),
                tags: this.extractTags(data.title),
                description: '',
                duration: '0:00',
                views: 0,
                likes: 0,
                comments: 0,
                fetchedAt: new Date().toISOString()
            };
        } catch (error) {
            console.error('oEmbed fetch failed:', error);
            
            // Return basic data if fetch fails
            return {
                id: videoId,
                title: 'Video Title',
                author: 'Md Akhinoor Islam',
                thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
                thumbnailLarge: `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
                thumbnailHD: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
                embedUrl: `https://www.youtube.com/embed/${videoId}`,
                watchUrl: `https://www.youtube.com/watch?v=${videoId}`,
                type: 'tutorial',
                tags: [],
                duration: '0:00',
                views: 0,
                likes: 0,
                comments: 0,
                fetchedAt: new Date().toISOString()
            };
        }
    }

    // ==================== FETCH VIDEO METADATA ====================

    async fetchVideoData(videoUrlOrId) {
        const videoId = this.extractVideoId(videoUrlOrId);
        if (!videoId) {
            console.error('Invalid YouTube URL/ID:', videoUrlOrId);
            return null;
        }

        // Check cache first
        if (this.cache.has(videoId)) {
            const cached = this.cache.get(videoId);
            const cacheAge = Date.now() - new Date(cached.fetchedAt).getTime();
            
            // Use cache if less than 1 hour old
            if (cacheAge < YOUTUBE_CONFIG?.CACHE_DURATION || cacheAge < 3600000) {
                console.log(`📦 Using cached data for: ${videoId}`);
                return cached;
            }
        }

        // Try API first, fallback to oEmbed
        let videoData = null;
        
        if (this.hasValidKey) {
            videoData = await this.fetchWithAPI(videoId);
        }
        
        if (!videoData) {
            videoData = await this.fetchWithOEmbed(videoId);
        }

        // Cache result
        if (videoData) {
            this.cache.set(videoId, videoData);
        }

        return videoData;
    }

    // ==================== ENHANCE EXISTING VIDEO DATA ====================

    async enhanceVideoData(video) {
        if (!video || !video.videoId) return video;

        try {
            const fetchedData = await this.fetchVideoData(video.videoId);
            
            if (fetchedData) {
                // Merge with existing data, preferring content.json data but adding API stats
                return {
                    ...video,
                    duration: fetchedData.duration || video.duration || '0:00',
                    views: fetchedData.views || video.views || 0,
                    likes: fetchedData.likes || video.likes || 0,
                    comments: fetchedData.comments || 0,
                    thumbnailHD: fetchedData.thumbnailHD || video.thumbnail,
                    thumbnailLarge: fetchedData.thumbnailLarge,
                    description: fetchedData.description || video.description || '',
                    apiEnhanced: true,
                    lastFetched: fetchedData.fetchedAt
                };
            }
        } catch (error) {
            console.error('Failed to enhance video:', error);
        }

        return video;
    }

    // ==================== BATCH ENHANCE VIDEOS ====================

    async enhanceMultipleVideos(videos) {
        if (!videos || videos.length === 0) return videos;

        console.log(`🔄 Enhancing ${videos.length} videos with YouTube data...`);
        
        const enhanced = [];
        for (const video of videos) {
            const enhancedVideo = await this.enhanceVideoData(video);
            enhanced.push(enhancedVideo);
            
            // Small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        console.log(`✅ Enhanced ${enhanced.length} videos`);
        return enhanced;
    }

    // ==================== AUTO-DETECT VIDEO TYPE ====================

    detectVideoType(title) {
        if (!title) return 'tutorial';
        
        const titleLower = title.toLowerCase();

        // Type detection patterns
        const typePatterns = {
            tutorial: /tutorial|how to|guide|learn|শিখুন|টিউটোরিয়াল/i,
            project: /project|build|make|তৈরি|প্রজেক্ট/i,
            review: /review|unboxing|রিভিউ/i,
            education: /lecture|class|education|পাঠ|ক্লাস/i,
            demo: /demo|demonstration|showcase/i,
            vlog: /vlog|daily|routine/i,
            animation: /animation|animated|এনিমেশন/i,
            tips: /tips|tricks|hack|টিপস/i
        };

        // Check each pattern
        for (const [type, pattern] of Object.entries(typePatterns)) {
            if (pattern.test(titleLower)) {
                return type;
            }
        }

        return 'tutorial';
    }

    // ==================== EXTRACT TAGS ====================

    extractTags(title) {
        if (!title) return [];
        
        const tags = [];

        // Common keywords mapping
        const keywordMap = {
            'arduino': 'Arduino',
            'solidworks': 'SolidWorks',
            'matlab': 'MATLAB',
            'electronics': 'Electronics',
            'robotics': 'Robotics',
            'programming': 'Programming',
            'python': 'Python',
            'javascript': 'JavaScript',
            'c++': 'C++',
            '3d': '3D Design',
            'circuit': 'Circuit',
            'sensor': 'Sensors',
            'motor': 'Motors',
            'led': 'LED',
            'robot': 'Robotics',
            'tutorial': 'Tutorial',
            'beginner': 'Beginner',
            'advanced': 'Advanced',
            'project': 'Project',
            'diy': 'DIY',
            'iot': 'IoT',
            'automation': 'Automation'
        };

        const titleLower = title.toLowerCase();

        // Find matching keywords
        for (const [keyword, tag] of Object.entries(keywordMap)) {
            if (titleLower.includes(keyword) && !tags.includes(tag)) {
                tags.push(tag);
            }
        }

        return tags.slice(0, 5);
    }

    // ==================== FORMAT NUMBERS ====================

    formatViews(views) {
        if (!views || views === 0) return '0 views';
        
        if (views >= 1000000) {
            return `${(views / 1000000).toFixed(1)}M views`;
        } else if (views >= 1000) {
            return `${(views / 1000).toFixed(1)}K views`;
        }
        return `${views} views`;
    }

    formatLikes(likes) {
        if (!likes || likes === 0) return '0';
        
        if (likes >= 1000000) {
            return `${(likes / 1000000).toFixed(1)}M`;
        } else if (likes >= 1000) {
            return `${(likes / 1000).toFixed(1)}K`;
        }
        return likes.toString();
    }

    // ==================== CLEAR CACHE ====================

    clearCache() {
        this.cache.clear();
        console.log('🗑️ YouTube data cache cleared');
    }
}

// ==================== GLOBAL INSTANCE ====================

window.youtubeFetcher = new YouTubeDataFetcher();

// ==================== INITIALIZATION ====================

if (typeof validateYouTubeConfig === 'function') {
    validateYouTubeConfig();
}

console.log('📺 YouTube Data Fetcher Loaded (Mobile Version)');
