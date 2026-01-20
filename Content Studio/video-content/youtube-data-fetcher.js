/**
 * YouTube Data Fetcher
 * Automatically extract video metadata from YouTube links
 * Author: Md Akhinoor Islam
 * A3KM Studio
 */

class YouTubeDataFetcher {
    constructor() {
        // YouTube API not needed - we'll use oEmbed and parse HTML
        this.cache = new Map();
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

        try {
            // Use YouTube oEmbed API (no API key needed!)
            const oEmbedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
            
            const response = await fetch(oEmbedUrl);
            if (!response.ok) {
                throw new Error('Failed to fetch video data');
            }

            const data = await response.json();

            const videoData = {
                id: videoId,
                title: data.title,
                author: data.author_name,
                channelUrl: data.author_url,
                thumbnail: data.thumbnail_url,
                thumbnailLarge: `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
                thumbnailHD: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
                embedUrl: `https://www.youtube.com/embed/${videoId}`,
                watchUrl: `https://www.youtube.com/watch?v=${videoId}`,
                type: this.detectVideoType(data.title),
                tags: this.extractTags(data.title),
                description: '', // oEmbed doesn't provide description
                date: new Date().toISOString(),
                views: 0,
                likes: 0
            };

            // Cache result
            this.cache.set(videoId, videoData);

            return videoData;

        } catch (error) {
            console.error('Error fetching video data:', error);
            
            // Return basic data if fetch fails
            return {
                id: videoId,
                title: 'Video Title',
                author: 'Md Akhinoor Islam',
                thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
                embedUrl: `https://www.youtube.com/embed/${videoId}`,
                watchUrl: `https://www.youtube.com/watch?v=${videoId}`,
                type: 'tutorial',
                tags: [],
                date: new Date().toISOString(),
                views: 0,
                likes: 0
            };
        }
    }

    // ==================== AUTO-DETECT VIDEO TYPE ====================

    detectVideoType(title) {
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
