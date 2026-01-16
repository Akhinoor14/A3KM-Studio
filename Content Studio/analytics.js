/**
 * Content Studio Analytics System
 * Tracks views, likes, bookmarks, reading progress
 * Author: Md Akhinoor Islam
 * A3KM Studio
 */

class ContentAnalytics {
    constructor() {
        this.storagePrefix = 'a3km_analytics_';
        this.sessionPrefix = 'a3km_session_';
        this.init();
    }

    init() {
        // Initialize analytics data structure if not exists
        if (!this.getAnalyticsData()) {
            this.resetAnalytics();
        }
    }

    // ==================== STORAGE MANAGEMENT ====================

    getAnalyticsData() {
        try {
            const data = localStorage.getItem(this.storagePrefix + 'data');
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error reading analytics:', error);
            return null;
        }
    }

    saveAnalyticsData(data) {
        try {
            localStorage.setItem(this.storagePrefix + 'data', JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Error saving analytics:', error);
            return false;
        }
    }

    resetAnalytics() {
        const initialData = {
            contents: {},
            globalStats: {
                totalViews: 0,
                totalLikes: 0,
                totalBookmarks: 0,
                totalReadingTime: 0,
                lastUpdated: new Date().toISOString()
            }
        };
        this.saveAnalyticsData(initialData);
        return initialData;
    }

    // ==================== VIEW TRACKING ====================

    trackView(contentId, contentType, contentTitle) {
        // Session-based view tracking (prevent multiple counts per session)
        const sessionKey = this.sessionPrefix + 'viewed_' + contentId;
        
        if (sessionStorage.getItem(sessionKey)) {
            return false; // Already viewed in this session
        }

        const data = this.getAnalyticsData();
        
        if (!data.contents[contentId]) {
            data.contents[contentId] = this.createContentEntry(contentId, contentType, contentTitle);
        }

        data.contents[contentId].views++;
        data.contents[contentId].lastViewed = new Date().toISOString();
        data.globalStats.totalViews++;
        data.globalStats.lastUpdated = new Date().toISOString();

        this.saveAnalyticsData(data);
        sessionStorage.setItem(sessionKey, 'true');

        return true;
    }

    getViewCount(contentId) {
        const data = this.getAnalyticsData();
        return data.contents[contentId]?.views || 0;
    }

    // ==================== LIKE SYSTEM ====================

    toggleLike(contentId, contentType, contentTitle) {
        const data = this.getAnalyticsData();
        
        if (!data.contents[contentId]) {
            data.contents[contentId] = this.createContentEntry(contentId, contentType, contentTitle);
        }

        const isLiked = data.contents[contentId].liked;
        
        if (isLiked) {
            data.contents[contentId].liked = false;
            data.contents[contentId].likes = Math.max(0, data.contents[contentId].likes - 1);
            data.globalStats.totalLikes = Math.max(0, data.globalStats.totalLikes - 1);
        } else {
            data.contents[contentId].liked = true;
            data.contents[contentId].likes++;
            data.globalStats.totalLikes++;
        }

        data.globalStats.lastUpdated = new Date().toISOString();
        this.saveAnalyticsData(data);

        return !isLiked; // Return new state
    }

    isLiked(contentId) {
        const data = this.getAnalyticsData();
        return data.contents[contentId]?.liked || false;
    }

    getLikeCount(contentId) {
        const data = this.getAnalyticsData();
        return data.contents[contentId]?.likes || 0;
    }

    // ==================== BOOKMARK SYSTEM ====================

    toggleBookmark(contentId, contentType, contentTitle) {
        const data = this.getAnalyticsData();
        
        if (!data.contents[contentId]) {
            data.contents[contentId] = this.createContentEntry(contentId, contentType, contentTitle);
        }

        const isBookmarked = data.contents[contentId].bookmarked;
        
        if (isBookmarked) {
            data.contents[contentId].bookmarked = false;
            data.globalStats.totalBookmarks = Math.max(0, data.globalStats.totalBookmarks - 1);
        } else {
            data.contents[contentId].bookmarked = true;
            data.contents[contentId].bookmarkedAt = new Date().toISOString();
            data.globalStats.totalBookmarks++;
        }

        data.globalStats.lastUpdated = new Date().toISOString();
        this.saveAnalyticsData(data);

        return !isBookmarked; // Return new state
    }

    isBookmarked(contentId) {
        const data = this.getAnalyticsData();
        return data.contents[contentId]?.bookmarked || false;
    }

    getBookmarkedContents() {
        const data = this.getAnalyticsData();
        return Object.values(data.contents).filter(content => content.bookmarked);
    }

    // ==================== READING PROGRESS ====================

    updateReadingProgress(contentId, contentType, contentTitle, percentage, timeSpent = 0) {
        const data = this.getAnalyticsData();
        
        if (!data.contents[contentId]) {
            data.contents[contentId] = this.createContentEntry(contentId, contentType, contentTitle);
        }

        // Update progress only if new percentage is higher
        if (percentage > (data.contents[contentId].readingProgress || 0)) {
            data.contents[contentId].readingProgress = Math.min(100, percentage);
        }

        // Accumulate time spent
        data.contents[contentId].timeSpent = (data.contents[contentId].timeSpent || 0) + timeSpent;
        data.globalStats.totalReadingTime += timeSpent;
        data.contents[contentId].lastRead = new Date().toISOString();

        // Mark as completed if 90%+ read
        if (percentage >= 90 && !data.contents[contentId].completed) {
            data.contents[contentId].completed = true;
            data.contents[contentId].completedAt = new Date().toISOString();
        }

        data.globalStats.lastUpdated = new Date().toISOString();
        this.saveAnalyticsData(data);
    }

    getReadingProgress(contentId) {
        const data = this.getAnalyticsData();
        return data.contents[contentId]?.readingProgress || 0;
    }

    getTimeSpent(contentId) {
        const data = this.getAnalyticsData();
        return data.contents[contentId]?.timeSpent || 0;
    }

    // ==================== POPULAR CONTENT ALGORITHM ====================

    calculatePopularityScore(content) {
        // Weighted scoring algorithm
        const weights = {
            views: 1,
            likes: 5,
            bookmarks: 10,
            completion: 15,
            recency: 3
        };

        let score = 0;

        // View count contribution
        score += (content.views || 0) * weights.views;

        // Like count contribution
        score += (content.likes || 0) * weights.likes;

        // Bookmark contribution
        score += (content.bookmarked ? 1 : 0) * weights.bookmarks;

        // Completion contribution
        score += (content.completed ? 1 : 0) * weights.completion;

        // Recency bonus (content viewed in last 7 days)
        const lastViewed = new Date(content.lastViewed);
        const daysSinceView = (Date.now() - lastViewed.getTime()) / (1000 * 60 * 60 * 24);
        if (daysSinceView <= 7) {
            score += weights.recency * (7 - daysSinceView);
        }

        return score;
    }

    getPopularContents(limit = 10) {
        const data = this.getAnalyticsData();
        const contents = Object.values(data.contents);

        // Calculate popularity scores
        const contentsWithScores = contents.map(content => ({
            ...content,
            popularityScore: this.calculatePopularityScore(content)
        }));

        // Sort by popularity score (descending)
        contentsWithScores.sort((a, b) => b.popularityScore - a.popularityScore);

        return contentsWithScores.slice(0, limit);
    }

    getTrendingContents(limit = 5) {
        // Trending = popular in last 3 days
        const data = this.getAnalyticsData();
        const threeDaysAgo = Date.now() - (3 * 24 * 60 * 60 * 1000);
        
        const recentContents = Object.values(data.contents).filter(content => {
            const lastViewed = new Date(content.lastViewed).getTime();
            return lastViewed >= threeDaysAgo;
        });

        const contentsWithScores = recentContents.map(content => ({
            ...content,
            popularityScore: this.calculatePopularityScore(content)
        }));

        contentsWithScores.sort((a, b) => b.popularityScore - a.popularityScore);

        return contentsWithScores.slice(0, limit);
    }

    // ==================== CONTENT RECOMMENDATIONS ====================

    getRecommendations(currentContentId, limit = 3) {
        const data = this.getAnalyticsData();
        const currentContent = data.contents[currentContentId];
        
        if (!currentContent) return [];

        // Get similar content (same type)
        const similarContents = Object.values(data.contents).filter(content => 
            content.id !== currentContentId && 
            content.type === currentContent.type
        );

        // Score based on engagement
        const scored = similarContents.map(content => ({
            ...content,
            score: this.calculatePopularityScore(content)
        }));

        scored.sort((a, b) => b.score - a.score);

        return scored.slice(0, limit);
    }

    // ==================== STATISTICS ====================

    getGlobalStats() {
        const data = this.getAnalyticsData();
        return data.globalStats;
    }

    getContentStats(contentId) {
        const data = this.getAnalyticsData();
        return data.contents[contentId] || null;
    }

    getUserEngagementStats() {
        const data = this.getAnalyticsData();
        const contents = Object.values(data.contents);

        return {
            totalContentViewed: contents.length,
            totalCompleted: contents.filter(c => c.completed).length,
            totalLiked: contents.filter(c => c.liked).length,
            totalBookmarked: contents.filter(c => c.bookmarked).length,
            totalTimeSpent: data.globalStats.totalReadingTime,
            averageProgress: contents.length > 0 
                ? contents.reduce((sum, c) => sum + (c.readingProgress || 0), 0) / contents.length 
                : 0
        };
    }

    // ==================== EXPORT & IMPORT ====================

    exportAnalytics() {
        const data = this.getAnalyticsData();
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `analytics_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
    }

    importAnalytics(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            this.saveAnalyticsData(data);
            return true;
        } catch (error) {
            console.error('Import failed:', error);
            return false;
        }
    }

    // ==================== HELPER METHODS ====================

    createContentEntry(contentId, contentType, contentTitle) {
        return {
            id: contentId,
            type: contentType,
            title: contentTitle,
            views: 0,
            likes: 0,
            liked: false,
            bookmarked: false,
            readingProgress: 0,
            timeSpent: 0,
            completed: false,
            firstViewed: new Date().toISOString(),
            lastViewed: new Date().toISOString(),
            lastRead: null,
            completedAt: null,
            bookmarkedAt: null
        };
    }

    formatTime(seconds) {
        if (seconds < 60) return `${Math.floor(seconds)}s`;
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
        return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
    }

    // ==================== CLEANUP ====================

    clearOldData(daysOld = 90) {
        // Remove content entries older than specified days with no engagement
        const data = this.getAnalyticsData();
        const cutoffDate = Date.now() - (daysOld * 24 * 60 * 60 * 1000);

        Object.keys(data.contents).forEach(contentId => {
            const content = data.contents[contentId];
            const lastActivity = new Date(content.lastViewed).getTime();
            
            // Keep if: liked, bookmarked, or recent activity
            const shouldKeep = content.liked || 
                             content.bookmarked || 
                             content.completed ||
                             lastActivity >= cutoffDate;

            if (!shouldKeep) {
                delete data.contents[contentId];
            }
        });

        this.saveAnalyticsData(data);
    }
}

// ==================== GLOBAL INSTANCE ====================

// Create global instance
window.contentAnalytics = new ContentAnalytics();

// ==================== UTILITY FUNCTIONS ====================

// Quick access functions for easy integration
function trackView(contentId, contentType, contentTitle) {
    return window.contentAnalytics.trackView(contentId, contentType, contentTitle);
}

function toggleLike(contentId, contentType, contentTitle) {
    return window.contentAnalytics.toggleLike(contentId, contentType, contentTitle);
}

function toggleBookmark(contentId, contentType, contentTitle) {
    return window.contentAnalytics.toggleBookmark(contentId, contentType, contentTitle);
}

function updateProgress(contentId, contentType, contentTitle, percentage, timeSpent = 0) {
    return window.contentAnalytics.updateReadingProgress(contentId, contentType, contentTitle, percentage, timeSpent);
}

console.log('📊 Content Analytics System Loaded');
