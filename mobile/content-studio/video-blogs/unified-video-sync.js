/**
 * ============================================
 * UNIFIED VIDEO SYNC SYSTEM (Mobile Version)
 * ============================================
 * Automatically syncs video data between:
 * - Desktop video-content/videos.json (nested)
 * - Mobile Content Code/content.json (flat array)
 * - YouTube API (real-time data)
 * 
 * This ensures ONE source of truth - update anywhere, reflects everywhere!
 * Author: Md Akhinoor Islam - A3KM Studio
 */

class UnifiedVideoSync {
    constructor() {
        this.githubToken = null;
        this.repoOwner = 'Akhinoor14';
        this.repoName = 'A3KM-Studio';
        this.videosJsonPath = 'Content Studio/video-content/videos.json';
        this.contentJsonPath = 'Content Code/content.json';
        this.syncInProgress = false;
        
        // Load GitHub token from localStorage (set by Only-boss)
        this.loadGitHubToken();
    }

    // ==================== GITHUB TOKEN ====================

    loadGitHubToken() {
        try {
            const tokenData = localStorage.getItem('github_token_unified');
            if (tokenData) {
                const parsed = JSON.parse(tokenData);
                this.githubToken = parsed.token;
                console.log('✅ GitHub token loaded for unified sync');
            } else {
                console.warn('⚠️ No GitHub token found. Sync to GitHub disabled.');
                console.info('💡 Set token via Only-boss dashboard to enable auto-sync');
            }
        } catch (error) {
            console.error('Failed to load GitHub token:', error);
        }
    }

    // ==================== GITHUB API ====================

    async githubRequest(method, path, data = null) {
        if (!this.githubToken) {
            throw new Error('GitHub token not configured. Cannot sync to repository.');
        }

        const url = `https://api.github.com/repos/${this.repoOwner}/${this.repoName}/contents/${path}`;
        const headers = {
            'Authorization': `token ${this.githubToken}`,
            'Accept': 'application/vnd.github.v3+json'
        };

        const options = {
            method,
            headers
        };

        if (data) {
            options.body = JSON.stringify(data);
        }

        const response = await fetch(url, options);
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(`GitHub API error: ${error.message}`);
        }

        return await response.json();
    }

    async getFile(path) {
        return await this.githubRequest('GET', path);
    }

    async updateFile(path, content, message, sha) {
        const data = {
            message,
            content: btoa(unescape(encodeURIComponent(content))),
            sha
        };
        return await this.githubRequest('PUT', path, data);
    }

    // ==================== LOAD DATA ====================

    /**
     * Load videos.json (nested structure for desktop)
     */
    async loadVideosJson() {
        try {
            const fileData = await this.getFile(this.videosJsonPath);
            const content = JSON.parse(atob(fileData.content));
            return { data: content, sha: fileData.sha };
        } catch (error) {
            console.error('Failed to load videos.json:', error);
            throw error;
        }
    }

    /**
     * Load content.json (flat structure for mobile)
     */
    async loadContentJson() {
        try {
            const fileData = await this.getFile(this.contentJsonPath);
            const content = JSON.parse(atob(fileData.content));
            return { data: content, sha: fileData.sha };
        } catch (error) {
            console.error('Failed to load content.json:', error);
            throw error;
        }
    }

    // ==================== EXTRACT VIDEOS ====================

    /**
     * Extract all videos from nested videos.json structure
     */
    extractVideosFromNestedStructure(videosData) {
        const allVideos = [];
        
        if (videosData.categories && videosData.categories['video-blog']) {
            const categories = videosData.categories['video-blog'];
            
            for (const catKey in categories) {
                const category = categories[catKey];
                if (category.videos && Array.isArray(category.videos)) {
                    category.videos.forEach(video => {
                        allVideos.push({
                            id: video.id,
                            title: video.title,
                            description: video.description || '',
                            youtubeUrl: video.youtubeUrl || `https://www.youtube.com/watch?v=${video.videoId}`,
                            videoId: video.videoId,
                            thumbnail: video.thumbnail || `https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg`,
                            duration: video.duration || '0:00',
                            publishDate: video.date || video.publishDate || new Date().toISOString(),
                            subcategory: category.name,
                            language: video.language || 'en',
                            tags: video.tags || [],
                            // Include YouTube stats if available
                            views: video.views || 0,
                            likes: video.likes || 0,
                            comments: video.comments || 0,
                            // Track sync status
                            lastSynced: new Date().toISOString()
                        });
                    });
                }
            }
        }
        
        return allVideos;
    }

    /**
     * Rebuild nested structure from flat array
     */
    rebuildNestedStructure(flatVideos, existingStructure) {
        const structure = existingStructure || {
            lastUpdated: new Date().toISOString(),
            version: "2.0.0",
            categoryGroups: {},
            categories: {
                'video-blog': {}
            }
        };

        // Clear existing videos
        if (structure.categories && structure.categories['video-blog']) {
            Object.keys(structure.categories['video-blog']).forEach(catKey => {
                if (structure.categories['video-blog'][catKey].videos) {
                    structure.categories['video-blog'][catKey].videos = [];
                }
            });
        }

        // Group by subcategory and rebuild
        flatVideos.forEach(video => {
            const catSlug = this.slugify(video.subcategory);
            
            if (!structure.categories['video-blog'][catSlug]) {
                structure.categories['video-blog'][catSlug] = {
                    name: video.subcategory,
                    icon: 'fas fa-video',
                    description: video.subcategory,
                    group: 'lifestyle-personal',
                    videos: []
                };
            }
            
            // Convert back to nested format
            structure.categories['video-blog'][catSlug].videos.push({
                id: video.id,
                title: video.title,
                description: video.description,
                videoId: video.videoId,
                youtubeUrl: video.youtubeUrl,
                thumbnail: video.thumbnail,
                duration: video.duration,
                date: video.publishDate,
                language: video.language,
                tags: video.tags,
                views: video.views,
                likes: video.likes,
                comments: video.comments
            });
        });

        structure.lastUpdated = new Date().toISOString();
        return structure;
    }

    // ==================== SYNC FROM DESKTOP TO MOBILE ====================

    /**
     * Sync videos.json → content.json
     * Call this after updating desktop videos
     */
    async syncDesktopToMobile() {
        if (this.syncInProgress) {
            console.warn('⚠️ Sync already in progress, skipping...');
            return { skipped: true };
        }

        try {
            this.syncInProgress = true;
            console.log('🔄 Syncing desktop videos.json → mobile content.json...');

            // 1. Load desktop videos.json
            const { data: videosData } = await this.loadVideosJson();
            
            // 2. Extract all videos
            const allVideos = this.extractVideosFromNestedStructure(videosData);
            console.log(`📦 Extracted ${allVideos.length} videos from desktop`);

            // 3. Load mobile content.json
            const { data: contentData, sha: contentSha } = await this.loadContentJson();

            // 4. Update video-blogs array
            contentData['video-blogs'] = allVideos;

            // 5. Update metadata
            contentData.lastUpdated = new Date().toISOString();
            contentData.statistics = contentData.statistics || {};
            contentData.statistics.byCategory = contentData.statistics.byCategory || {};
            contentData.statistics.byCategory['video-blogs'] = allVideos.length;

            // Recalculate total
            contentData.statistics.totalContent = 
                (contentData['video-blogs']?.length || 0) +
                (contentData['written-posts']?.length || 0) +
                (contentData['educational-courses']?.length || 0) +
                (contentData['books-pdfs']?.length || 0) +
                (contentData['research-papers']?.length || 0);

            // 6. Save back to GitHub
            await this.updateFile(
                this.contentJsonPath,
                JSON.stringify(contentData, null, 2),
                `Auto-sync: Desktop → Mobile (${allVideos.length} videos)`,
                contentSha
            );

            console.log(`✅ Mobile content.json synced! ${allVideos.length} videos`);

            return {
                success: true,
                direction: 'desktop-to-mobile',
                videosCount: allVideos.length,
                totalContent: contentData.statistics.totalContent
            };

        } catch (error) {
            console.error('❌ Desktop→Mobile sync failed:', error);
            throw error;
        } finally {
            this.syncInProgress = false;
        }
    }

    // ==================== SYNC FROM MOBILE TO DESKTOP ====================

    /**
     * Sync content.json → videos.json
     * Call this after updating mobile videos
     */
    async syncMobileToDesktop() {
        if (this.syncInProgress) {
            console.warn('⚠️ Sync already in progress, skipping...');
            return { skipped: true };
        }

        try {
            this.syncInProgress = true;
            console.log('🔄 Syncing mobile content.json → desktop videos.json...');

            // 1. Load mobile content.json
            const { data: contentData } = await this.loadContentJson();
            const flatVideos = contentData['video-blogs'] || [];
            console.log(`📦 Found ${flatVideos.length} videos in mobile`);

            // 2. Load desktop videos.json
            const { data: videosData, sha: videosSha } = await this.loadVideosJson();

            // 3. Rebuild nested structure
            const updatedStructure = this.rebuildNestedStructure(flatVideos, videosData);

            // 4. Save back to GitHub
            await this.updateFile(
                this.videosJsonPath,
                JSON.stringify(updatedStructure, null, 2),
                `Auto-sync: Mobile → Desktop (${flatVideos.length} videos)`,
                videosSha
            );

            console.log(`✅ Desktop videos.json synced! ${flatVideos.length} videos`);

            return {
                success: true,
                direction: 'mobile-to-desktop',
                videosCount: flatVideos.length
            };

        } catch (error) {
            console.error('❌ Mobile→Desktop sync failed:', error);
            throw error;
        } finally {
            this.syncInProgress = false;
        }
    }

    // ==================== BIDIRECTIONAL SYNC ====================

    /**
     * Sync both ways - ensures both files are in sync
     */
    async syncBidirectional() {
        try {
            console.log('🔄 Starting bidirectional sync...');

            // Load both files
            const { data: videosData } = await this.loadVideosJson();
            const { data: contentData } = await this.loadContentJson();

            // Extract videos from both
            const desktopVideos = this.extractVideosFromNestedStructure(videosData);
            const mobileVideos = contentData['video-blogs'] || [];

            // Compare timestamps
            const desktopTimestamp = new Date(videosData.lastUpdated || 0).getTime();
            const mobileTimestamp = new Date(contentData.lastUpdated || 0).getTime();

            console.log(`📊 Desktop: ${desktopVideos.length} videos (${new Date(desktopTimestamp).toLocaleString()})`);
            console.log(`📊 Mobile: ${mobileVideos.length} videos (${new Date(mobileTimestamp).toLocaleString()})`);

            // Determine which is newer
            if (desktopTimestamp > mobileTimestamp) {
                console.log('📱 Desktop is newer → Syncing to mobile');
                return await this.syncDesktopToMobile();
            } else if (mobileTimestamp > desktopTimestamp) {
                console.log('💻 Mobile is newer → Syncing to desktop');
                return await this.syncMobileToDesktop();
            } else {
                console.log('✅ Both are in sync already');
                return {
                    success: true,
                    direction: 'already-synced',
                    videosCount: desktopVideos.length
                };
            }

        } catch (error) {
            console.error('❌ Bidirectional sync failed:', error);
            throw error;
        }
    }

    // ==================== UTILITY ====================

    slugify(text) {
        return text
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }
}

// ==================== GLOBAL INSTANCE ====================

window.unifiedVideoSync = new UnifiedVideoSync();

// ==================== AUTO-INIT ====================

console.log('✅ Unified Video Sync System loaded (Mobile)');
console.log('💡 Usage:');
console.log('   - await unifiedVideoSync.syncDesktopToMobile()');
console.log('   - await unifiedVideoSync.syncMobileToDesktop()');
console.log('   - await unifiedVideoSync.syncBidirectional()');
