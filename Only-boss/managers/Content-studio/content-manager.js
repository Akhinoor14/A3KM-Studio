/**
 * ========================================
 * CONTENT MANAGER
 * Complete Content Management System
 * ========================================
 * 
 * Features:
 * - View uploaded content
 * - Edit/Update content
 * - Delete content
 * - Search & filter
 * - Bulk operations
 * - Statistics
 * - Upload history
 */

class ContentManager {
    constructor(githubUploader) {
        this.githubUploader = githubUploader;
        this.cache = {};
        this.uploadHistory = this.loadUploadHistory();
        this.selectedItems = new Set();
    }

    // ==================== LOAD CONTENT ====================

    /**
     * Load all content for a content type
     */
    async loadContent(contentType) {
        try {
            const jsonFileName = this.getJSONFileName(contentType);
            const jsonPath = `Content Studio/${contentType}/${jsonFileName}`;
            
            const fileData = await this.githubUploader.getFile(jsonPath);
            const jsonContent = JSON.parse(atob(fileData.content));
            
            // Cache it
            this.cache[contentType] = {
                data: jsonContent,
                sha: fileData.sha,
                timestamp: Date.now()
            };
            
            return jsonContent;
            
        } catch (error) {
            console.error('Error loading content:', error);
            return { categoryGroups: [], items: [] };
        }
    }

    /**
     * Get specific content by ID
     */
    async getContentById(contentType, contentId) {
        const data = await this.loadContent(contentType);
        const items = this.getItemsFromData(data, contentType);
        return items.find(item => item.id === contentId);
    }

    /**
     * Get all items from all content types
     */
    async getAllContent() {
        const types = ['books-pdfs', 'educational-videos', 'research-papers', 'video-content', 'written-posts'];
        const allContent = [];
        
        for (const type of types) {
            const data = await this.loadContent(type);
            const items = this.getItemsFromData(data, type).map(item => ({ ...item, contentType: type }));
            allContent.push(...items);
        }
        
        return allContent;
    }

    // ==================== EDIT CONTENT ====================

    /**
     * Update content metadata
     */
    async editContent(contentType, contentId, updates) {
        try {
            const data = await this.loadContent(contentType);
            const items = this.getItemsFromData(data, contentType);
            
            const index = items.findIndex(item => item.id === contentId);
            if (index === -1) {
                throw new Error('Content not found');
            }
            
            // Update the item
            items[index] = {
                ...items[index],
                ...updates,
                lastModified: new Date().toISOString()
            };
            
            // Update data with new items
            this.setItemsToData(data, contentType, items);
            
            // Save back to GitHub
            const jsonFileName = this.getJSONFileName(contentType);
            const jsonPath = `Content Studio/${contentType}/${jsonFileName}`;
            
            await this.githubUploader.replaceJSON(jsonPath, data);
            
            // Update cache
            this.cache[contentType].data = data;
            
            // Log to history
            this.addToHistory({
                action: 'edit',
                contentType,
                contentId,
                title: updates.title || items[index].title,
                timestamp: new Date().toISOString()
            });
            
            return { success: true, item: items[index] };
            
        } catch (error) {
            console.error('Error editing content:', error);
            throw error;
        }
    }

    /**
     * Alias for editContent - for compatibility
     */
    async updateContent(contentType, contentId, updates) {
        return await this.editContent(contentType, contentId, updates);
    }

    /**
     * Move content to different category
     */
    async moveToCategory(contentType, contentId, newCategory) {
        try {
            const item = await this.getContentById(contentType, contentId);
            if (!item) throw new Error('Content not found');
            
            const oldCategorySlug = item.categorySlug || this.slugify(item.category);
            const newCategorySlug = this.slugify(newCategory);
            
            if (oldCategorySlug === newCategorySlug) {
                return { success: true, message: 'Already in this category' };
            }
            
            // Update metadata
            const updates = {
                category: newCategory,
                categorySlug: newCategorySlug
            };
            
            // Move files to new location
            if (item.files && item.files.content) {
                const oldPath = item.files.content;
                const newPath = oldPath.replace(`/${oldCategorySlug}/`, `/${newCategorySlug}/`);
                
                // Copy to new location
                const fileData = await this.githubUploader.getFile(oldPath);
                await this.githubUploader.uploadFile(
                    newPath,
                    fileData.content,
                    `Move to ${newCategory}`,
                    true
                );
                
                // Update file paths
                updates.files = { ...item.files };
                updates.files.content = newPath;
                
                if (item.files.thumbnail) {
                    const newThumbPath = item.files.thumbnail.replace(`/${oldCategorySlug}/`, `/${newCategorySlug}/`);
                    const thumbData = await this.githubUploader.getFile(item.files.thumbnail);
                    await this.githubUploader.uploadFile(newThumbPath, thumbData.content, `Move thumbnail`, true);
                    updates.files.thumbnail = newThumbPath;
                }
                
                if (item.files.metadata) {
                    const newMetaPath = item.files.metadata.replace(`/${oldCategorySlug}/`, `/${newCategorySlug}/`);
                    updates.files.metadata = newMetaPath;
                }
                
                // Delete old files
                await this.githubUploader.deleteFile(oldPath, 'Remove old location');
                if (item.files.thumbnail) {
                    await this.githubUploader.deleteFile(item.files.thumbnail, 'Remove old thumbnail');
                }
            }
            
            // Update JSON
            await this.editContent(contentType, contentId, updates);
            
            return { success: true, message: 'Moved successfully' };
            
        } catch (error) {
            console.error('Error moving content:', error);
            throw error;
        }
    }

    // ==================== DELETE CONTENT ====================

    /**
     * Delete content completely
     */
    async deleteContent(contentType, contentId) {
        try {
            const data = await this.loadContent(contentType);
            const items = this.getItemsFromData(data, contentType);
            
            const item = items.find(i => i.id === contentId);
            if (!item) throw new Error('Content not found');
            
            // Delete files from GitHub
            if (item.files) {
                if (item.files.content) {
                    await this.githubUploader.deleteFile(item.files.content, 'Delete content');
                }
                if (item.files.thumbnail) {
                    await this.githubUploader.deleteFile(item.files.thumbnail, 'Delete thumbnail');
                }
                if (item.files.metadata) {
                    await this.githubUploader.deleteFile(item.files.metadata, 'Delete metadata');
                }
            }
            
            // Remove from items array
            const updatedItems = items.filter(i => i.id !== contentId);
            this.setItemsToData(data, contentType, updatedItems);
            
            // Save back to GitHub
            const jsonFileName = this.getJSONFileName(contentType);
            const jsonPath = `Content Studio/${contentType}/${jsonFileName}`;
            await this.githubUploader.replaceJSON(jsonPath, data);
            
            // Update cache
            this.cache[contentType].data = data;
            
            // Log to history
            this.addToHistory({
                action: 'delete',
                contentType,
                contentId,
                title: item.title,
                timestamp: new Date().toISOString()
            });
            
            return { success: true, message: 'Deleted successfully' };
            
        } catch (error) {
            console.error('Error deleting content:', error);
            throw error;
        }
    }

    /**
     * Bulk delete multiple items
     */
    async bulkDelete(contentType, contentIds) {
        const results = [];
        
        for (const id of contentIds) {
            try {
                await this.deleteContent(contentType, id);
                results.push({ id, success: true });
            } catch (error) {
                results.push({ id, success: false, error: error.message });
            }
        }
        
        return results;
    }

    // ==================== SEARCH & FILTER ====================

    /**
     * Search content by query
     */
    searchContent(items, query) {
        if (!query || query.trim() === '') return items;
        
        const lowerQuery = query.toLowerCase();
        
        return items.filter(item => {
            const searchText = [
                item.title,
                item.description,
                item.category,
                item.author,
                ...(item.tags || [])
            ].join(' ').toLowerCase();
            
            return searchText.includes(lowerQuery);
        });
    }

    /**
     * Filter by category
     */
    filterByCategory(items, category) {
        if (!category || category === 'all') return items;
        return items.filter(item => item.category === category);
    }

    /**
     * Sort items
     */
    sortItems(items, sortBy = 'date', order = 'desc') {
        const sorted = [...items];
        
        sorted.sort((a, b) => {
            let aVal = a[sortBy];
            let bVal = b[sortBy];
            
            if (sortBy === 'date' || sortBy === 'dateAdded' || sortBy === 'lastModified') {
                aVal = new Date(aVal).getTime();
                bVal = new Date(bVal).getTime();
            }
            
            if (order === 'asc') {
                return aVal > bVal ? 1 : -1;
            } else {
                return aVal < bVal ? 1 : -1;
            }
        });
        
        return sorted;
    }

    // ==================== DUPLICATE CHECK ====================

    /**
     * Check for duplicate content
     */
    async checkDuplicates(contentType, title, category) {
        const data = await this.loadContent(contentType);
        const items = this.getItemsFromData(data, contentType);
        
        const titleLower = title.toLowerCase().trim();
        
        const duplicates = items.filter(item => 
            item.title.toLowerCase().trim() === titleLower &&
            item.category === category
        );
        
        return {
            isDuplicate: duplicates.length > 0,
            count: duplicates.length,
            matches: duplicates
        };
    }

    // ==================== STATISTICS ====================

    /**
     * Get content statistics
     */
    async getStatistics() {
        const stats = {
            totalContent: 0,
            byType: {},
            byCategory: {},
            recentUploads: [],
            totalSize: 0
        };
        
        const types = ['books-pdfs', 'educational-videos', 'research-papers', 'video-content', 'written-posts'];
        
        for (const type of types) {
            const data = await this.loadContent(type);
            const items = this.getItemsFromData(data, type);
            
            stats.byType[type] = items.length;
            stats.totalContent += items.length;
            
            // Count by category
            items.forEach(item => {
                stats.byCategory[item.category] = (stats.byCategory[item.category] || 0) + 1;
                
                if (item.fileSize) {
                    stats.totalSize += item.fileSize;
                }
            });
            
            // Recent uploads
            const recent = items
                .sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded))
                .slice(0, 5)
                .map(item => ({ ...item, contentType: type }));
            
            stats.recentUploads.push(...recent);
        }
        
        stats.recentUploads = stats.recentUploads
            .sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded))
            .slice(0, 10);
        
        return stats;
    }

    // ==================== UPLOAD HISTORY ====================

    /**
     * Load upload history from localStorage
     */
    loadUploadHistory() {
        try {
            const history = localStorage.getItem('uploadHistory');
            return history ? JSON.parse(history) : [];
        } catch (error) {
            return [];
        }
    }

    /**
     * Save upload history to localStorage
     */
    saveUploadHistory() {
        try {
            localStorage.setItem('uploadHistory', JSON.stringify(this.uploadHistory));
        } catch (error) {
            console.error('Error saving history:', error);
        }
    }

    /**
     * Add entry to history
     */
    addToHistory(entry) {
        this.uploadHistory.unshift(entry);
        
        // Keep only last 100 entries
        if (this.uploadHistory.length > 100) {
            this.uploadHistory = this.uploadHistory.slice(0, 100);
        }
        
        this.saveUploadHistory();
    }

    /**
     * Get upload history
     */
    getHistory(limit = 20) {
        return this.uploadHistory.slice(0, limit);
    }

    /**
     * Clear history
     */
    clearHistory() {
        this.uploadHistory = [];
        this.saveUploadHistory();
    }

    // ==================== BULK OPERATIONS ====================

    /**
     * Select/deselect item
     */
    toggleSelection(contentId) {
        if (this.selectedItems.has(contentId)) {
            this.selectedItems.delete(contentId);
        } else {
            this.selectedItems.add(contentId);
        }
    }

    /**
     * Select all items
     */
    selectAll(items) {
        items.forEach(item => this.selectedItems.add(item.id));
    }

    /**
     * Deselect all
     */
    deselectAll() {
        this.selectedItems.clear();
    }

    /**
     * Get selected items
     */
    getSelected() {
        return Array.from(this.selectedItems);
    }

    /**
     * Bulk update tags
     */
    async bulkUpdateTags(contentType, contentIds, newTags) {
        const results = [];
        
        for (const id of contentIds) {
            try {
                await this.editContent(contentType, id, { tags: newTags });
                results.push({ id, success: true });
            } catch (error) {
                results.push({ id, success: false, error: error.message });
            }
        }
        
        return results;
    }

    // ==================== HELPER FUNCTIONS ====================

    /**
     * Generate slug from text
     */
    slugify(text) {
        return text
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
            .substring(0, 50);
    }

    /**
     * Get JSON filename for content type
     */
    getJSONFileName(contentType) {
        const map = {
            'books-pdfs': 'books.json',
            'educational-videos': 'courses.json',
            'research-papers': 'papers.json',
            'video-content': 'videos.json',
            'written-posts': 'posts.json'
        };
        return map[contentType] || 'data.json';
    }

    /**
     * Get JSON array key for content type
     */
    getJSONArrayKey(contentType) {
        const map = {
            'books-pdfs': 'books',
            'educational-videos': 'courses',
            'research-papers': 'papers',
            'video-content': 'videos',
            'written-posts': 'posts'
        };
        return map[contentType] || 'items';
    }

    /**
     * Get items from data using correct array key or nested structure
     */
    getItemsFromData(data, contentType) {
        // Special handling for vlogs (video-content) - nested structure
        if (contentType === 'video-content') {
            const items = [];
            if (data.categories && data.categories['video-blog']) {
                Object.entries(data.categories['video-blog']).forEach(([catSlug, catData]) => {
                    if (catData.videos && Array.isArray(catData.videos)) {
                        catData.videos.forEach(video => {
                            items.push({
                                ...video,
                                categorySlug: catSlug,
                                category: catData.name || video.category
                            });
                        });
                    }
                });
            }
            return items;
        }
        
        // Standard flat array structure (books, courses, papers, posts)
        const arrayKey = this.getJSONArrayKey(contentType);
        return data[arrayKey] || [];
    }

    /**
     * Set items to data using correct array key or nested structure
     */
    setItemsToData(data, contentType, items) {
        // Special handling for vlogs (video-content) - rebuild nested structure
        if (contentType === 'video-content') {
            if (!data.categories) data.categories = {};
            if (!data.categories['video-blog']) data.categories['video-blog'] = {};
            
            // Clear existing videos
            Object.keys(data.categories['video-blog']).forEach(catSlug => {
                if (data.categories['video-blog'][catSlug].videos) {
                    data.categories['video-blog'][catSlug].videos = [];
                }
            });
            
            // Rebuild from items
            items.forEach(item => {
                const catSlug = item.categorySlug || this.slugify(item.category);
                if (!data.categories['video-blog'][catSlug]) {
                    data.categories['video-blog'][catSlug] = {
                        name: item.category,
                        icon: 'fas fa-video',
                        description: item.category,
                        group: 'lifestyle-personal',
                        videos: []
                    };
                }
                data.categories['video-blog'][catSlug].videos.push(item);
            });
            return data;
        }
        
        // Standard flat array structure
        const arrayKey = this.getJSONArrayKey(contentType);
        data[arrayKey] = items;
        return data;
    }

    /**
     * Format file size
     */
    formatFileSize(bytes) {
        if (!bytes) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    }

    /**
     * Format date
     */
    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);
        
        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
        
        return date.toLocaleDateString();
    }

    /**
     * Auto backup to localStorage
     */
    createBackup(contentType, data) {
        try {
            const backup = {
                contentType,
                data,
                timestamp: new Date().toISOString()
            };
            localStorage.setItem(`backup_${contentType}`, JSON.stringify(backup));
        } catch (error) {
            console.error('Backup failed:', error);
        }
    }

    /**
     * Restore from backup
     */
    restoreBackup(contentType) {
        try {
            const backup = localStorage.getItem(`backup_${contentType}`);
            return backup ? JSON.parse(backup) : null;
        } catch (error) {
            console.error('Restore failed:', error);
            return null;
        }
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ContentManager;
}

console.log('✅ Content Manager loaded');
