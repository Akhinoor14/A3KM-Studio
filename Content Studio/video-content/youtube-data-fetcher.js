/**
 * YouTube Data Fetcher
 * Automatically extract video metadata from YouTube links using Data API v3
 * Author: Md Akhinoor Islam
 * A3KM Studio
 */

class YouTubeDataFetcher {
    constructor() {
        this.cache = new Map();
        this.apiKey = typeof YOUTUBE_CONFIG !== 'undefined' ? YOUTUBE_CONFIG.API_KEY : null;
        this.hasValidKey = this.apiKey && !this.apiKey.includes('XXXXXXX') && this.apiKey !== 'YOUR_YOUTUBE_API_KEY_HERE';
        
        console.log('🔧 YouTube Data Fetcher initializing...');
        console.log(`API Key present: ${!!this.apiKey}`);
        console.log(`Has valid key: ${this.hasValidKey}`);
        
        if (this.hasValidKey) {
            console.log('✅ YouTube Data Fetcher initialized with VALID API key');
        } else {
            console.warn('⚠️ YouTube Data Fetcher: No valid API key - views/likes will show as 0');
        }
    }

    // ==================== EXTRACT VIDEO ID ====================

    extractVideoId(url) {
        // Support multiple YouTube URL formats
        const patterns = [
            /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?\s]{11})/,
            /youtube\.com\/watch\?.*v=([^&?\s]{11})/
        ];

        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match) return match[1];
        }

        return null;
    }

    // ==================== FETCH VIDEO METADATA ====================

    async fetchVideoData(videoUrl) {
        const videoId = this.extractVideoId(videoUrl);
        if (!videoId) {
            console.error('Invalid YouTube URL:', videoUrl);
            return null;
        }

        // Check cache
        if (this.cache.has(videoId)) {
            return this.cache.get(videoId);
        }

        // Use YouTube Data API v3 if key available
        if (this.hasValidKey) {
            return await this.fetchWithAPI(videoId);
        }

        // Fallback to basic data
        console.warn('⚠️ No API key, returning basic data for:', videoId);
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
            date: new Date().toISOString(),
            duration: '0:00',
            views: 0,
            likes: 0
        };
    }
    
    // ==================== FETCH WITH YOUTUBE API ====================

    async fetchWithAPI(videoId) {
        if (!this.hasValidKey) return null;

        try {
            const url = `${YOUTUBE_CONFIG.VIDEOS_ENDPOINT}?id=${videoId}&part=${YOUTUBE_CONFIG.PARTS.join(',')},snippet&key=${this.apiKey}`;
            console.log(`🔄 Fetching YouTube data for video: ${videoId}`);
            
            const response = await fetch(url);
            console.log(`📡 API Response status: ${response.status}`);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error(`❌ API Error ${response.status}:`, errorText);
                throw new Error(`API Error: ${response.status}`);
            }

            const data = await response.json();
            
            if (!data.items || data.items.length === 0) {
                console.warn(`⚠️ No video data found for: ${videoId}`);
                throw new Error('Video not found');
            }

            const item = data.items[0];
            const snippet = item.snippet || {};
            const statistics = item.statistics || {};
            const contentDetails = item.contentDetails || {};

            const videoData = {
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
            
            console.log(`✅ Fetched YouTube data: ${videoData.title} (${videoData.duration}, ${videoData.views} views)`);
            
            // Cache result
            this.cache.set(videoId, videoData);
            
            return videoData;
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
        } else {
            return `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
    }

    // ==================== ENHANCE EXISTING VIDEO DATA ====================

    async enhanceVideoData(video) {
        if (!video || !video.videoId) {
            console.warn('❌ Cannot enhance video: Missing video or videoId', video);
            return video;
        }

        try {
            console.log(`🔄 Enhancing video: ${video.title} (${video.videoId})`);
            const fetchedData = await this.fetchVideoData(`https://youtu.be/${video.videoId}`);
            
            if (fetchedData) {
                // Merge with existing data
                const enhanced = {
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
                console.log(`✅ Enhanced: ${enhanced.title} - Views: ${enhanced.views}, Duration: ${enhanced.duration}`);
                return enhanced;
            } else {
                console.warn(`⚠️ No API data received for: ${video.title}`);
            }
        } catch (error) {
            console.error(`❌ Failed to enhance video ${video.title}:`, error);
        }

        return video;
    }

    // ==================== BATCH ENHANCE VIDEOS ====================

    async enhanceMultipleVideos(videos) {
        if (!videos || videos.length === 0) {
            console.warn('⚠️ No videos to enhance');
            return videos;
        }

        console.log(`🔄 Enhancing ${videos.length} videos with YouTube data...`);
        
        const enhanced = [];
        let successCount = 0;
        let failCount = 0;
        
        for (let i = 0; i < videos.length; i++) {
            const video = videos[i];
            console.log(`📹 Processing ${i + 1}/${videos.length}: ${video.title}`);
            const enhancedVideo = await this.enhanceVideoData(video);
            enhanced.push(enhancedVideo);
            
            if (enhancedVideo.apiEnhanced) {
                successCount++;
            } else {
                failCount++;
            }
            
            // Small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        console.log(`✅ Batch complete: ${successCount} enhanced, ${failCount} failed out of ${videos.length} videos`);
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

        // Default to tutorial
        return 'tutorial';
    }

    // ==================== FORMAT VIEWS COUNT ====================

    formatViews(views) {
        if (!views || views === 0) return '0 views';
        
        if (views >= 1000000) {
            return `${(views / 1000000).toFixed(1)}M views`;
        } else if (views >= 1000) {
            return `${(views / 1000).toFixed(1)}K views`;
        }
        return `${views} views`;
    }

    // ==================== FORMAT LIKES COUNT ====================

    formatLikes(likes) {
        if (!likes || likes === 0) return '0';
        
        if (likes >= 1000000) {
            return `${(likes / 1000000).toFixed(1)}M`;
        } else if (likes >= 1000) {
            return `${(likes / 1000).toFixed(1)}K`;
        }
        return likes.toString();
    }

    // ==================== EXTRACT TAGS ====================

    extractTags(title) {
        const tags = [];

        // Common keywords mapping
        const keywordMap = {
            'arduino': 'Arduino',
            'solidworks': 'SolidWorks',
            'electronics': 'Electronics',
            'robotics': 'Robotics',
            'programming': 'Programming',
            'python': 'Python',
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
            'diy': 'DIY'
        };

        const titleLower = title.toLowerCase();

        // Find matching keywords
        for (const [keyword, tag] of Object.entries(keywordMap)) {
            if (titleLower.includes(keyword)) {
                tags.push(tag);
            }
        }

        // Limit to 5 tags
        return tags.slice(0, 5);
    }

    // ==================== BATCH FETCH ====================

    async fetchMultipleVideos(videoUrls) {
        const promises = videoUrls.map(url => this.fetchVideoData(url));
        const results = await Promise.all(promises);
        return results.filter(result => result !== null);
    }

    // ==================== CATEGORIZE VIDEOS ====================

    categorizeVideos(videos) {
        const categories = {
            tutorial: [],
            project: [],
            review: [],
            education: [],
            demo: [],
            vlog: [],
            animation: [],
            tips: [],
            other: []
        };

        videos.forEach(video => {
            const type = video.type || 'other';
            if (categories[type]) {
                categories[type].push(video);
            } else {
                categories.other.push(video);
            }
        });

        return categories;
    }

    // ==================== EXPORT DATA ====================

    exportToJSON(videos) {
        return JSON.stringify(videos, null, 2);
    }

    saveToFile(videos, filename = 'videos-data.json') {
        const json = this.exportToJSON(videos);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        
        URL.revokeObjectURL(url);
    }

    // ==================== LOAD TO LOCALSTORAGE ====================

    saveToLocalStorage(videos, key = 'video_content') {
        localStorage.setItem(key, JSON.stringify(videos));
    }

    loadFromLocalStorage(key = 'video_content') {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    }
}

// ==================== GLOBAL INSTANCE ====================

window.youtubeFetcher = new YouTubeDataFetcher();

// ==================== HELPER FUNCTIONS ====================

async function addYouTubeVideo(url) {
    const data = await youtubeFetcher.fetchVideoData(url);
    if (data) {
        // Add to existing videos
        const existing = youtubeFetcher.loadFromLocalStorage();
        existing.push(data);
        youtubeFetcher.saveToLocalStorage(existing);
        console.log('✅ Video added:', data.title);
        return data;
    }
    return null;
}

async function addMultipleVideos(urls) {
    const videos = await youtubeFetcher.fetchMultipleVideos(urls);
    if (videos.length > 0) {
        const existing = youtubeFetcher.loadFromLocalStorage();
        const merged = [...existing, ...videos];
        youtubeFetcher.saveToLocalStorage(merged);
        console.log(`✅ ${videos.length} videos added`);
        return videos;
    }
    return [];
}

console.log('📺 YouTube Data Fetcher Loaded');
