/**
 * AI-Powered Content Recommendations
 * Smart content discovery using collaborative filtering
 * Author: Md Akhinoor Islam
 * A3KM Studio
 */

class ContentRecommendations {
    constructor() {
        this.storageKey = 'a3km_user_behavior';
        this.userProfile = this.loadUserProfile();
    }

    // ==================== USER PROFILE ====================

    loadUserProfile() {
        try {
            const profile = localStorage.getItem(this.storageKey);
            return profile ? JSON.parse(profile) : this.createDefaultProfile();
        } catch (error) {
            console.error('Error loading user profile:', error);
            return this.createDefaultProfile();
        }
    }

    createDefaultProfile() {
        return {
            viewedContent: [],
            likedContent: [],
            bookmarkedContent: [],
            searchHistory: [],
            topicInterests: {},
            tagPreferences: {},
            contentTypePreferences: {
                blog: 0,
                video: 0,
                course: 0,
                book: 0,
                paper: 0
            },
            lastUpdated: new Date().toISOString()
        };
    }

    saveUserProfile() {
        this.userProfile.lastUpdated = new Date().toISOString();
        localStorage.setItem(this.storageKey, JSON.stringify(this.userProfile));
    }

    // ==================== BEHAVIOR TRACKING ====================

    trackView(contentId, contentType, tags = []) {
        // Add to viewed content
        if (!this.userProfile.viewedContent.includes(contentId)) {
            this.userProfile.viewedContent.push(contentId);
        }

        // Increase content type preference
        this.userProfile.contentTypePreferences[contentType] = 
            (this.userProfile.contentTypePreferences[contentType] || 0) + 1;

        // Track tag preferences
        tags.forEach(tag => {
            this.userProfile.tagPreferences[tag] = 
                (this.userProfile.tagPreferences[tag] || 0) + 1;
        });

        this.saveUserProfile();
    }

    trackLike(contentId, tags = []) {
        if (!this.userProfile.likedContent.includes(contentId)) {
            this.userProfile.likedContent.push(contentId);
        }

        // Heavily weight liked content tags
        tags.forEach(tag => {
            this.userProfile.tagPreferences[tag] = 
                (this.userProfile.tagPreferences[tag] || 0) + 5;
        });

        this.saveUserProfile();
    }

    trackBookmark(contentId, tags = []) {
        if (!this.userProfile.bookmarkedContent.includes(contentId)) {
            this.userProfile.bookmarkedContent.push(contentId);
        }

        // Weight bookmarked content tags
        tags.forEach(tag => {
            this.userProfile.tagPreferences[tag] = 
                (this.userProfile.tagPreferences[tag] || 0) + 3;
        });

        this.saveUserProfile();
    }

    // ==================== RECOMMENDATION ALGORITHMS ====================

    getRecommendations(allContent, currentContentId = null, limit = 5) {
        // Combine multiple recommendation strategies
        const recommendations = [];

        // 1. Content-based filtering
        const contentBased = this.getContentBasedRecommendations(allContent, currentContentId);
        recommendations.push(...contentBased);

        // 2. Tag-based recommendations
        const tagBased = this.getTagBasedRecommendations(allContent);
        recommendations.push(...tagBased);

        // 3. Type-based recommendations
        const typeBased = this.getTypeBasedRecommendations(allContent);
        recommendations.push(...typeBased);

        // 4. Trending content
        const trending = this.getTrendingContent(allContent);
        recommendations.push(...trending);

        // Remove duplicates and current content
        const unique = this.deduplicateAndScore(recommendations, currentContentId);

        // Sort by score and return top N
        return unique
            .sort((a, b) => b.score - a.score)
            .slice(0, limit);
    }

    // Strategy 1: Content-Based Filtering
    getContentBasedRecommendations(allContent, currentContentId) {
        if (!currentContentId) return [];

        const currentContent = allContent.find(c => c.id === currentContentId);
        if (!currentContent) return [];

        return allContent
            .filter(content => content.id !== currentContentId)
            .map(content => {
                let score = 0;

                // Same type bonus
                if (content.type === currentContent.type) {
                    score += 3;
                }

                // Shared tags
                const sharedTags = this.getSharedTags(
                    currentContent.tags || [],
                    content.tags || []
                );
                score += sharedTags.length * 2;

                // Same author bonus
                if (content.author === currentContent.author) {
                    score += 1;
                }

                return { ...content, score, reason: 'Similar to current' };
            })
            .filter(c => c.score > 0);
    }

    // Strategy 2: Tag-Based Recommendations
    getTagBasedRecommendations(allContent) {
        const userTags = Object.entries(this.userProfile.tagPreferences)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([tag]) => tag);

        if (userTags.length === 0) return [];

        return allContent
            .map(content => {
                const contentTags = content.tags || [];
                const matchingTags = contentTags.filter(tag => userTags.includes(tag));
                
                let score = matchingTags.length * 3;

                // Bonus for highly preferred tags
                matchingTags.forEach(tag => {
                    score += (this.userProfile.tagPreferences[tag] || 0) / 10;
                });

                return { ...content, score, reason: 'Based on your interests' };
            })
            .filter(c => c.score > 0);
    }

    // Strategy 3: Type-Based Recommendations
    getTypeBasedRecommendations(allContent) {
        const preferredTypes = Object.entries(this.userProfile.contentTypePreferences)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 2)
            .map(([type]) => type);

        if (preferredTypes.length === 0) return [];

        return allContent
            .filter(content => preferredTypes.includes(content.type))
            .map(content => ({
                ...content,
                score: this.userProfile.contentTypePreferences[content.type] / 2,
                reason: 'You enjoy this type'
            }));
    }

    // Strategy 4: Trending Content
    getTrendingContent(allContent) {
        // Simulate trending based on recent views (would use analytics in production)
        return allContent
            .map(content => ({
                ...content,
                score: (content.views || 0) / 100 + (content.likes || 0) / 10,
                reason: 'Trending now'
            }))
            .filter(c => c.score > 0);
    }

    // ==================== PERSONALIZED DISCOVERY ====================

    getPersonalizedFeed(allContent, limit = 10) {
        // Mix of recommendations and new content
        const recommendations = this.getRecommendations(allContent, null, Math.floor(limit * 0.7));
        
        // Add some random new content for discovery
        const unseen = allContent.filter(c => 
            !this.userProfile.viewedContent.includes(c.id)
        );
        
        const randomNew = this.shuffleArray(unseen).slice(0, Math.ceil(limit * 0.3));

        return [...recommendations, ...randomNew].slice(0, limit);
    }

    // ==================== RELATED CONTENT ====================

    getRelatedContent(contentId, allContent, limit = 3) {
        return this.getContentBasedRecommendations(allContent, contentId)
            .slice(0, limit);
    }

    // ==================== AUTO-TAGGING ====================

    suggestTags(content) {
        const text = `${content.title} ${content.description || ''}`.toLowerCase();
        const keywords = this.extractKeywords(text);
        
        // Map keywords to existing tags
        const allTags = this.getAllUniqueTags();
        const suggested = keywords
            .map(keyword => {
                return allTags.find(tag => 
                    tag.toLowerCase().includes(keyword) || 
                    keyword.includes(tag.toLowerCase())
                );
            })
            .filter(tag => tag !== undefined)
            .slice(0, 5);

        return [...new Set(suggested)];
    }

    extractKeywords(text) {
        // Simple keyword extraction (TF-IDF would be better)
        const stopWords = ['the', 'a', 'an', 'in', 'on', 'at', 'to', 'for', 'of', 'and', 'or'];
        const words = text.toLowerCase()
            .replace(/[^\w\s]/g, '')
            .split(/\s+/)
            .filter(w => w.length > 3 && !stopWords.includes(w));

        // Count frequency
        const freq = {};
        words.forEach(word => {
            freq[word] = (freq[word] || 0) + 1;
        });

        // Return top keywords
        return Object.entries(freq)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([word]) => word);
    }

    getAllUniqueTags() {
        // Would get from all content in production
        return ['Arduino', 'SolidWorks', 'Electronics', 'Robotics', 'Tutorial', 
                'Beginner', 'Advanced', 'CAD', 'Programming', '3D', 'Circuit'];
    }

    // ==================== HELPER FUNCTIONS ====================

    deduplicateAndScore(recommendations, excludeId = null) {
        const seen = new Set();
        const unique = [];

        recommendations.forEach(item => {
            if (!seen.has(item.id) && item.id !== excludeId) {
                seen.add(item.id);
                unique.push(item);
            } else if (seen.has(item.id)) {
                // Increase score for duplicate recommendations
                const existing = unique.find(u => u.id === item.id);
                if (existing) {
                    existing.score += item.score * 0.5;
                }
            }
        });

        return unique;
    }

    getSharedTags(tags1, tags2) {
        return tags1.filter(tag => tags2.includes(tag));
    }

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    // ==================== ANALYTICS ====================

    getUserInterests() {
        const topTags = Object.entries(this.userProfile.tagPreferences)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10);

        const topTypes = Object.entries(this.userProfile.contentTypePreferences)
            .sort((a, b) => b[1] - a[1]);

        return {
            topTags: topTags.map(([tag, count]) => ({ tag, count })),
            topTypes: topTypes.map(([type, count]) => ({ type, count })),
            viewCount: this.userProfile.viewedContent.length,
            likeCount: this.userProfile.likedContent.length,
            bookmarkCount: this.userProfile.bookmarkedContent.length
        };
    }

    exportUserData() {
        const data = {
            profile: this.userProfile,
            interests: this.getUserInterests(),
            exportedAt: new Date().toISOString()
        };

        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `user_data_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
    }

    resetProfile() {
        this.userProfile = this.createDefaultProfile();
        this.saveUserProfile();
    }
}

// ==================== GLOBAL INSTANCE ====================

window.contentRecommendations = new ContentRecommendations();

// ==================== CONVENIENCE FUNCTIONS ====================

window.getRecommendations = (allContent, currentId, limit) => 
    contentRecommendations.getRecommendations(allContent, currentId, limit);

window.getRelatedContent = (contentId, allContent, limit) => 
    contentRecommendations.getRelatedContent(contentId, allContent, limit);

console.log('🤖 AI Recommendations System Loaded');
