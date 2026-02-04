/**
 * YouTube Integration System
 * Auto-fetch video data, views, duration from YouTube
 * Supports both YouTube Data API v3 and oEmbed fallback
 * Author: Md Akhinoor Islam | A3KM Studio
 */

class YouTubeIntegration {
    constructor() {
        this.API_KEY = 'AIzaSyCBMJNDxIvJ5YfYMNupIL8t2l0JC315c2A';
        this.VIDEOS_ENDPOINT = 'https://www.googleapis.com/youtube/v3/videos';
        this.OEMBED_ENDPOINT = 'https://www.youtube.com/oembed';
        this.cache = new Map();
        this.CACHE_DURATION = 3600000; // 1 hour
    }

    // ==================== EXTRACT VIDEO ID ====================
    
    extractVideoId(url) {
        const patterns = [
            /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
            /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
            /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/
        ];
        
        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match) return match[1];
        }
        return null;
    }

    // ==================== FETCH BASIC DATA (NO API KEY) ====================
    
    async fetchBasicData(videoUrl) {
        const videoId = this.extractVideoId(videoUrl);
        if (!videoId) return null;
        
        // Check cache
        if (this.cache.has(videoId)) {
            const cached = this.cache.get(videoId);
            if (Date.now() - cached.timestamp < this.CACHE_DURATION) {
                return cached.data;
            }
        }
        
        try {
            const response = await fetch(`${this.OEMBED_ENDPOINT}?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
            if (!response.ok) throw new Error('oEmbed fetch failed');
            
            const data = await response.json();
            
            const videoData = {
                videoId: videoId,
                title: data.title,
                author: data.author_name,
                channelUrl: data.author_url,
                thumbnail: data.thumbnail_url,
                thumbnailHD: `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
                embedUrl: `https://www.youtube.com/embed/${videoId}`,
                watchUrl: `https://www.youtube.com/watch?v=${videoId}`
            };
            
            // Cache result
            this.cache.set(videoId, { data: videoData, timestamp: Date.now() });
            
            return videoData;
        } catch (error) {
            console.error('Error fetching basic YouTube data:', error);
            return null;
        }
    }

    // ==================== FETCH FULL DATA (WITH API KEY) ====================
    
    async fetchFullData(videoUrl) {
        const videoId = this.extractVideoId(videoUrl);
        if (!videoId) return null;
        
        try {
            const url = `${this.VIDEOS_ENDPOINT}?part=contentDetails,statistics,snippet&id=${videoId}&key=${this.API_KEY}`;
            const response = await fetch(url);
            
            if (!response.ok) {
                console.warn('YouTube API failed, falling back to basic data');
                return await this.fetchBasicData(videoUrl);
            }
            
            const data = await response.json();
            
            if (!data.items || data.items.length === 0) {
                return await this.fetchBasicData(videoUrl);
            }
            
            const item = data.items[0];
            
            const videoData = {
                videoId: videoId,
                title: item.snippet.title,
                description: item.snippet.description,
                author: item.snippet.channelTitle,
                channelId: item.snippet.channelId,
                thumbnail: item.snippet.thumbnails.high.url,
                thumbnailHD: item.snippet.thumbnails.maxres?.url || item.snippet.thumbnails.high.url,
                duration: this.parseYouTubeDuration(item.contentDetails.duration),
                views: parseInt(item.statistics.viewCount || 0),
                likes: parseInt(item.statistics.likeCount || 0),
                commentCount: parseInt(item.statistics.commentCount || 0),
                publishedAt: item.snippet.publishedAt,
                embedUrl: `https://www.youtube.com/embed/${videoId}`,
                watchUrl: `https://www.youtube.com/watch?v=${videoId}`
            };
            
            // Cache result
            this.cache.set(videoId, { data: videoData, timestamp: Date.now() });
            
            return videoData;
        } catch (error) {
            console.error('Error fetching full YouTube data:', error);
            return await this.fetchBasicData(videoUrl);
        }
    }

    // ==================== PARSE YOUTUBE DURATION ====================
    
    parseYouTubeDuration(duration) {
        const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
        if (!match) return '0:00';
        
        const hours = parseInt(match[1] || 0);
        const minutes = parseInt(match[2] || 0);
        const seconds = parseInt(match[3] || 0);
        
        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        } else {
            return `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
    }

    // ==================== BATCH FETCH ====================
    
    async fetchMultipleVideos(videoIds) {
        if (videoIds.length === 0) return [];
        
        // Limit to 50 IDs per request (YouTube API limit)
        const batches = [];
        for (let i = 0; i < videoIds.length; i += 50) {
            batches.push(videoIds.slice(i, i + 50));
        }
        
        const results = [];
        
        for (const batch of batches) {
            try {
                const ids = batch.join(',');
                const url = `${this.VIDEOS_ENDPOINT}?part=contentDetails,statistics,snippet&id=${ids}&key=${this.API_KEY}`;
                const response = await fetch(url);
                
                if (!response.ok) continue;
                
                const data = await response.json();
                
                if (data.items) {
                    data.items.forEach(item => {
                        const videoData = {
                            videoId: item.id,
                            title: item.snippet.title,
                            duration: this.parseYouTubeDuration(item.contentDetails.duration),
                            views: parseInt(item.statistics.viewCount || 0),
                            likes: parseInt(item.statistics.likeCount || 0),
                            thumbnail: item.snippet.thumbnails.high.url
                        };
                        results.push(videoData);
                        
                        // Cache
                        this.cache.set(item.id, { data: videoData, timestamp: Date.now() });
                    });
                }
            } catch (error) {
                console.error('Batch fetch error:', error);
            }
        }
        
        return results;
    }

    // ==================== UPDATE VIEW COUNTS ====================
    
    async updateViewCounts(videoIds) {
        const videos = await this.fetchMultipleVideos(videoIds);
        const viewMap = {};
        
        videos.forEach(video => {
            viewMap[video.videoId] = video.views;
        });
        
        return viewMap;
    }

    // ==================== FORMAT VIEW COUNT ====================
    
    formatViews(views) {
        if (views >= 1000000) {
            return (views / 1000000).toFixed(1) + 'M';
        } else if (views >= 1000) {
            return (views / 1000).toFixed(1) + 'K';
        } else {
            return views.toString();
        }
    }
}

// ==================== GLOBAL INSTANCE ====================

if (typeof window !== 'undefined') {
    window.youtubeIntegration = new YouTubeIntegration();
    console.log('📺 YouTube Integration System Loaded');
}

// Export for Node.js if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = YouTubeIntegration;
}
