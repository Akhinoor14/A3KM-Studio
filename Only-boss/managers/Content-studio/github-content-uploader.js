/**
 * ========================================
 * GITHUB CONTENT UPLOADER
 * Complete GitHub API Integration for Content Studio
 * ========================================
 * 
 * Author: Md Akhinoor Islam
 * Date: January 23, 2026
 * Purpose: Upload content files to GitHub repository
 * 
 * Features:
 * - File upload (text & binary)
 * - Folder creation
 * - JSON file updates
 * - Error handling with retry
 * - Progress tracking
 */

class GitHubContentUploader {
    constructor(config = {}) {
        // GitHub configuration
        this.token = config.token || '';
        this.owner = config.owner || 'Akhinoor14';
        this.repo = config.repo || 'A3KM-Studio';
        this.branch = config.branch || 'main';
        
        // API endpoints
        this.baseUrl = 'https://api.github.com';
        this.apiUrl = `${this.baseUrl}/repos/${this.owner}/${this.repo}`;
        
        // Progress tracking
        this.onProgress = config.onProgress || (() => {});
        this.onError = config.onError || console.error;
        this.onSuccess = config.onSuccess || console.log;
        
        // Rate limiting
        this.requestDelay = 500; // ms between requests
        this.maxRetries = 3;
    }

    // ==================== CONFIGURATION ====================

    /**
     * Set GitHub token
     */
    setToken(token) {
        this.token = token;
        return this;
    }

    /**
     * Test GitHub connection
     */
    async testConnection() {
        try {
            const response = await fetch(`${this.apiUrl}`, {
                headers: this.getHeaders()
            });
            
            if (!response.ok) {
                throw new Error(`GitHub API error: ${response.status}`);
            }
            
            const data = await response.json();
            return {
                success: true,
                repo: data.full_name,
                defaultBranch: data.default_branch,
                private: data.private
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // ==================== FILE OPERATIONS ====================

    /**
     * Upload a file to GitHub
     * @param {string} path - File path in repository
     * @param {string} content - File content (base64 for binary)
     * @param {string} message - Commit message
     * @param {boolean} isBase64 - Whether content is base64 encoded
     */
    async uploadFile(path, content, message, isBase64 = false) {
        try {
            this.onProgress({ stage: 'checking', path });
            
            // Check if file exists (to get SHA for update)
            const existingFile = await this.getFile(path);
            const sha = existingFile ? existingFile.sha : undefined;
            
            this.onProgress({ stage: 'uploading', path });
            
            // Prepare request body
            const body = {
                message: message || `Upload ${path}`,
                content: isBase64 ? content : btoa(unescape(encodeURIComponent(content))),
                branch: this.branch
            };
            
            if (sha) {
                body.sha = sha; // Include SHA for update
            }
            
            // Upload file
            const response = await this.makeRequest(
                `${this.apiUrl}/contents/${path}`,
                'PUT',
                body
            );
            
            this.onProgress({ stage: 'uploaded', path });
            
            return {
                success: true,
                path: path,
                sha: response.content.sha,
                htmlUrl: response.content.html_url,
                downloadUrl: response.content.download_url
            };
            
        } catch (error) {
            this.onError({ stage: 'upload', path, error: error.message });
            throw error;
        }
    }

    /**
     * Upload binary file (PDF, images)
     * @param {string} path - File path in repository
     * @param {File} file - File object from input
     * @param {string} message - Commit message
     */
    async uploadBinaryFile(path, file, message) {
        try {
            // Convert to base64
            const base64Content = await this.fileToBase64(file);
            
            // Upload with base64 flag
            return await this.uploadFile(path, base64Content, message, true);
            
        } catch (error) {
            this.onError({ stage: 'binary upload', path, error: error.message });
            throw error;
        }
    }

    /**
     * Get file from GitHub
     * @param {string} path - File path in repository
     */
    async getFile(path) {
        try {
            const response = await this.makeRequest(
                `${this.apiUrl}/contents/${path}?ref=${this.branch}`,
                'GET'
            );
            
            return {
                sha: response.sha,
                content: response.content,
                encoding: response.encoding,
                size: response.size,
                url: response.html_url
            };
            
        } catch (error) {
            if (error.message.includes('404')) {
                return null; // File doesn't exist
            }
            throw error;
        }
    }

    /**
     * Delete file from GitHub
     * @param {string} path - File path in repository
     * @param {string} message - Commit message
     */
    async deleteFile(path, message) {
        try {
            // Get file SHA first
            const file = await this.getFile(path);
            if (!file) {
                throw new Error('File not found');
            }
            
            const response = await this.makeRequest(
                `${this.apiUrl}/contents/${path}`,
                'DELETE',
                {
                    message: message || `Delete ${path}`,
                    sha: file.sha,
                    branch: this.branch
                }
            );
            
            return { success: true, path };
            
        } catch (error) {
            this.onError({ stage: 'delete', path, error: error.message });
            throw error;
        }
    }

    // ==================== FOLDER OPERATIONS ====================

    /**
     * Create folder structure by uploading a .gitkeep file
     * @param {string} folderPath - Folder path to create
     */
    async createFolder(folderPath) {
        try {
            // Ensure path ends with /
            const path = folderPath.endsWith('/') ? folderPath : `${folderPath}/`;
            
            // Create .gitkeep file to establish folder
            const gitkeepPath = `${path}.gitkeep`;
            
            return await this.uploadFile(
                gitkeepPath,
                '# Folder created by Content Upload Manager',
                `Create folder: ${path}`,
                false
            );
            
        } catch (error) {
            this.onError({ stage: 'create folder', path: folderPath, error: error.message });
            throw error;
        }
    }

    /**
     * Check if folder exists
     * @param {string} folderPath - Folder path to check
     */
    async folderExists(folderPath) {
        try {
            const response = await this.makeRequest(
                `${this.apiUrl}/contents/${folderPath}?ref=${this.branch}`,
                'GET'
            );
            
            return Array.isArray(response); // Folder returns array of contents
            
        } catch (error) {
            return false;
        }
    }

    // ==================== JSON OPERATIONS ====================

    /**
     * Update JSON file with new entry
     * @param {string} jsonPath - Path to JSON file
     * @param {object} newEntry - New entry to add
     * @param {string} arrayKey - Key of array to append to (optional)
     */
    async updateJSON(jsonPath, newEntry, arrayKey = null) {
        try {
            this.onProgress({ stage: 'reading JSON', path: jsonPath });
            
            // Get existing JSON
            const existingFile = await this.getFile(jsonPath);
            if (!existingFile) {
                throw new Error(`JSON file not found: ${jsonPath}`);
            }
            
            // Decode base64 content
            const decodedContent = atob(existingFile.content);
            const jsonData = JSON.parse(decodedContent);
            
            // Special handling for video-content (vlogs) nested structure
            if (jsonPath.includes('video-content/videos.json')) {
                // Structure: categories.video-blog.category-slug.videos[]
                const categorySlug = this.slugify(newEntry.category);
                if (!jsonData.categories) jsonData.categories = {};
                if (!jsonData.categories['video-blog']) jsonData.categories['video-blog'] = {};
                if (!jsonData.categories['video-blog'][categorySlug]) {
                    jsonData.categories['video-blog'][categorySlug] = {
                        name: newEntry.category,
                        icon: 'fas fa-video',
                        description: newEntry.category,
                        group: 'lifestyle-personal',
                        videos: []
                    };
                }
                jsonData.categories['video-blog'][categorySlug].videos.push(newEntry);
            } else if (arrayKey) {
                // Standard flat array structure (books, courses, papers, posts)
                if (!jsonData[arrayKey]) {
                    jsonData[arrayKey] = [];
                }
                jsonData[arrayKey].push(newEntry);
            } else {
                // Merge at root level
                Object.assign(jsonData, newEntry);
            }
            
            // Update file
            this.onProgress({ stage: 'updating JSON', path: jsonPath });
            
            return await this.uploadFile(
                jsonPath,
                JSON.stringify(jsonData, null, 2),
                `Update ${jsonPath} - Add ${newEntry.title || 'new entry'}`,
                false
            );
            
        } catch (error) {
            this.onError({ stage: 'update JSON', path: jsonPath, error: error.message });
            throw error;
        }
    }

    /**
     * Replace entire JSON file
     * @param {string} jsonPath - Path to JSON file
     * @param {object} newData - New JSON data
     */
    async replaceJSON(jsonPath, newData) {
        try {
            return await this.uploadFile(
                jsonPath,
                JSON.stringify(newData, null, 2),
                `Replace ${jsonPath}`,
                false
            );
        } catch (error) {
            this.onError({ stage: 'replace JSON', path: jsonPath, error: error.message });
            throw error;
        }
    }

    // ==================== COMPLETE CONTENT UPLOAD ====================

    /**
     * Upload complete content with all files
     * @param {object} contentData - All content information and files
     */
    async uploadCompleteContent(contentData) {
        const {
            contentType,    // 'books-pdfs', 'written-posts', etc.
            category,       // 'Arduino & Microcontrollers'
            contentId,      // 'book-004'
            title,
            description,
            tags,
            author,
            contentFile,    // Main content file (PDF/MD)
            thumbnailFile,  // Thumbnail image
            coverSVG,       // Category cover SVG (if new category)
            youtubeId,      // For video content
            metadata        // Additional metadata
        } = contentData;

        const results = {
            success: false,
            uploads: [],
            errors: [],
            paths: {}
        };

        try {
            // 1. Generate paths (matching ecosystem structure)
            const pathConfig = this.getContentPaths(contentType);
            const categorySlug = this.slugify(category);
            
            // Special path handling for written-posts (nested CategoryGroup/Category)
            let basePath;
            if (contentType === 'written-posts') {
                // Posts use: written-posts/{CategoryGroup}/{Category}/
                // We need to determine CategoryGroup from category name
                const categoryGroup = this.getCategoryGroup(category, contentType);
                basePath = `${pathConfig.storagePath}/${categoryGroup}/${categorySlug}`;
            } else {
                // Others use: {storage}/{category}/
                basePath = `${pathConfig.storagePath}/${categorySlug}`;
            }
            
            // Files go directly in category folder (matching ecosystem)
            // No contentId subfolder needed
            
            this.onProgress({ stage: 'starting', total: 4 });

            // 2. Create folder structure (if needed)
            if (!await this.folderExists(basePath)) {
                await this.createFolder(basePath);
                results.uploads.push('folder created');
            }

            // 3. Upload category cover (if provided and doesn't exist)
            if (coverSVG) {
                // Covers go in covers/ subfolder to match ecosystem
                const coversPath = `${basePath}/covers`;
                const coverPath = `${coversPath}/${categorySlug}-cover.svg`;
                const coverExists = await this.getFile(coverPath);
                
                if (!coverExists) {
                    // Ensure covers folder exists
                    if (!await this.folderExists(coversPath)) {
                        await this.createFolder(coversPath);
                    }
                    
                    const coverResult = await this.uploadFile(
                        coverPath,
                        coverSVG,
                        `Add cover for ${category}`,
                        false
                    );
                    results.uploads.push(coverResult);
                    results.paths.cover = coverPath;
                } else {
                    results.paths.cover = coverPath;
                }
            }

            // 4. Upload content file (directly in category folder)
            if (contentFile) {
                const extension = this.getFileExtension(contentFile.name);
                // Generate clean filename from title
                const fileSlug = this.slugify(title);
                const contentFilePath = `${basePath}/${fileSlug}.${extension}`;
                
                const contentResult = await this.uploadBinaryFile(
                    contentFilePath,
                    contentFile,
                    `Add ${title}`
                );
                results.uploads.push(contentResult);
                results.paths.content = contentFilePath;
            }

            // 5. Upload thumbnail (in covers/ subfolder with content)
            if (thumbnailFile) {
                const coversPath = `${basePath}/covers`;
                const thumbnailPath = `${coversPath}/${this.slugify(title)}-thumbnail.jpg`;
                
                // Ensure covers folder exists
                if (!await this.folderExists(coversPath)) {
                    await this.createFolder(coversPath);
                }
                
                const thumbnailResult = await this.uploadBinaryFile(
                    thumbnailPath,
                    thumbnailFile,
                    `Add thumbnail for ${title}`
                );
                results.uploads.push(thumbnailResult);
                results.paths.thumbnail = thumbnailPath;
            } else if (youtubeId) {
                // Use YouTube thumbnail URL
                results.paths.thumbnail = `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
            }

            // 6. Update main JSON file with correct structure
            const correctJsonPath = pathConfig.jsonPath;
            const arrayKey = pathConfig.arrayKey;
            
            // Convert absolute GitHub paths to relative paths for JSON (../../Content Storage/...)
            const convertToRelativePath = (absolutePath) => {
                if (!absolutePath || absolutePath.startsWith('http')) return absolutePath;
                // From "Content Studio/{type}/" to "Content Storage/..."
                return `../../${absolutePath}`;
            };
            
            // Build JSON entry matching existing ecosystem structure
            const jsonEntry = {
                id: contentId,
                category: category,
                type: contentType.includes('video') ? 'video' : 
                      contentType.includes('book') ? 'book' : 
                      contentType.includes('paper') ? 'paper' : 'post',
                title: title,
                date: new Date().toISOString().split('T')[0],
                tags: tags || [],
                author: author || 'Md Akhinoor Islam',
                downloads: 0,
                language: metadata.language || 'en',
                ...metadata
            };
            
            // Add description field - vlogs use 'description', others use 'summary'
            if (contentType === 'video-content') {
                jsonEntry.description = description;  // Vlogs use 'description'
            } else {
                jsonEntry.summary = description;  // Books, courses, papers, posts use 'summary'
            }
            
            // Add content path with correct field name per type (using relative paths)
            if (contentType === 'research-papers') {
                // Papers specific fields
                jsonEntry.pdfUrl = convertToRelativePath(results.paths.content);
                jsonEntry.thumbnail = convertToRelativePath(results.paths.thumbnail);
                jsonEntry.authors = metadata.authors || [author || 'Md Akhinoor Islam'];
                if (metadata.abstract) jsonEntry.abstract = metadata.abstract;
                if (metadata.keywords) jsonEntry.keywords = metadata.keywords;
                if (metadata.institution) jsonEntry.institution = metadata.institution;
                if (metadata.doi) jsonEntry.doi = metadata.doi;
                if (metadata.journal) jsonEntry.journal = metadata.journal;
                if (metadata.year) jsonEntry.year = metadata.year;
                if (metadata.citations !== undefined) jsonEntry.citations = metadata.citations;
            } else if (contentType === 'written-posts') {
                // Posts specific fields
                jsonEntry.content = convertToRelativePath(results.paths.content);
                jsonEntry.coverImage = convertToRelativePath(results.paths.cover);
                if (metadata.readTime) jsonEntry.readTime = metadata.readTime;
                if (metadata.views !== undefined) jsonEntry.views = metadata.views;
                if (metadata.likes !== undefined) jsonEntry.likes = metadata.likes;
            } else if (contentType === 'educational-videos') {
                // Courses specific fields
                jsonEntry.thumbnail = convertToRelativePath(results.paths.thumbnail);
                if (metadata.episodes) jsonEntry.episodes = metadata.episodes;
                if (metadata.duration) jsonEntry.duration = metadata.duration;
                if (metadata.difficulty) jsonEntry.difficulty = metadata.difficulty;
                if (metadata.playlist) jsonEntry.playlist = metadata.playlist;
                if (metadata.views !== undefined) jsonEntry.views = metadata.views;
                if (metadata.enrolled !== undefined) jsonEntry.enrolled = metadata.enrolled;
                if (metadata.institution) jsonEntry.institution = metadata.institution;
            } else if (contentType === 'video-content') {
                // Vlogs - YouTube only, no file paths
                jsonEntry.thumbnail = results.paths.thumbnail || `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
                if (metadata.duration) jsonEntry.duration = metadata.duration;
                if (metadata.language) jsonEntry.language = metadata.language;
                if (metadata.views !== undefined) jsonEntry.views = metadata.views;
                if (metadata.series) jsonEntry.series = metadata.series;
                if (metadata.episode) jsonEntry.episode = metadata.episode;
            } else if (contentType === 'books-pdfs') {
                // Books specific fields
                jsonEntry.downloadUrl = convertToRelativePath(results.paths.content);
                jsonEntry.cover = convertToRelativePath(results.paths.cover);
                if (metadata.pages) jsonEntry.pages = metadata.pages;
                if (metadata.size) jsonEntry.size = metadata.size;
                if (metadata.format) jsonEntry.format = metadata.format;
                if (metadata.publisher) jsonEntry.publisher = metadata.publisher;
                if (metadata.isbn) jsonEntry.isbn = metadata.isbn;
                if (metadata.edition) jsonEntry.edition = metadata.edition;
            }
            
            // Add YouTube-specific fields for video content
            if (youtubeId) {
                jsonEntry.youtubeId = youtubeId;
                jsonEntry.embedUrl = `https://www.youtube.com/embed/${youtubeId}`;
            }
            
            try {
                await this.updateJSON(correctJsonPath, jsonEntry, arrayKey);
                results.uploads.push('JSON updated with correct structure');
            } catch (error) {
                // Log but don't fail entire upload
                results.errors.push(`JSON update failed: ${error.message}`);
            }

            results.success = true;
            results.contentId = contentId;
            
            this.onSuccess({
                message: `Successfully uploaded: ${title}`,
                contentId: contentId,
                paths: results.paths
            });

            return results;

        } catch (error) {
            results.errors.push(error.message);
            this.onError({
                stage: 'complete upload',
                error: error.message
            });
            throw error;
        }
    }

    // ==================== HELPER FUNCTIONS ====================

    /**
     * Make API request to GitHub
     */
    async makeRequest(url, method = 'GET', body = null, retries = 0) {
        try {
            const options = {
                method: method,
                headers: this.getHeaders()
            };

            if (body) {
                options.body = JSON.stringify(body);
            }

            // Add delay to respect rate limits
            await this.delay(this.requestDelay);

            const response = await fetch(url, options);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(
                    errorData.message || `GitHub API error: ${response.status}`
                );
            }

            return await response.json();

        } catch (error) {
            // Retry logic
            if (retries < this.maxRetries) {
                await this.delay(1000 * (retries + 1)); // Exponential backoff
                return this.makeRequest(url, method, body, retries + 1);
            }
            throw error;
        }
    }

    /**
     * Get request headers
     */
    getHeaders() {
        return {
            'Authorization': `token ${this.token}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
        };
    }

    /**
     * Convert File to base64
     */
    fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                // Remove data:image/png;base64, prefix
                const base64 = reader.result.split(',')[1];
                resolve(base64);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    /**
     * Delay helper
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Slugify text
     */
    slugify(text) {
        return text
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    /**
     * Get file extension
     */
    getFileExtension(filename) {
        return filename.split('.').pop().toLowerCase();
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
     * Get category group for a category (for posts nested structure)
     */
    getCategoryGroup(category, contentType) {
        if (contentType !== 'written-posts') return '';
        
        // Map categories to their groups (matching posts.json structure)
        const groupMap = {
            // Engineering & Technology
            'arduino': 'Engineering-Technology',
            'embedded': 'Engineering-Technology',
            'systems': 'Engineering-Technology',
            'robotics': 'Engineering-Technology',
            'electronics': 'Engineering-Technology',
            'solidworks': 'Engineering-Technology',
            'cad': 'Engineering-Technology',
            'programming': 'Engineering-Technology',
            '3d': 'Engineering-Technology',
            'engineering': 'Engineering-Technology',
            'technology': 'Engineering-Technology',
            
            // Lifestyle & Personal Development
            'career': 'Lifestyle-Personal-Development',
            'advice': 'Lifestyle-Personal-Development',
            'professional': 'Lifestyle-Personal-Development',
            'growth': 'Lifestyle-Personal-Development',
            'personal': 'Lifestyle-Personal-Development',
            'self': 'Lifestyle-Personal-Development',
            'productivity': 'Lifestyle-Personal-Development',
            'time management': 'Lifestyle-Personal-Development',
            'lifestyle': 'Lifestyle-Personal-Development',
            'development': 'Lifestyle-Personal-Development'
        };
        
        const categoryLower = category.toLowerCase();
        for (const [keyword, group] of Object.entries(groupMap)) {
            if (categoryLower.includes(keyword)) {
                return group;
            }
        }
        
        // Default fallback
        return 'General';
    }

    /**
     * Get proper paths for content type
     */
    getContentPaths(contentType) {
        // Map content types to storage folder names (MATCHING ECOSYSTEM)
        const storagePathMap = {
            'books-pdfs': 'books',
            'educational-videos': 'educational',
            'research-papers': 'papers',
            'video-content': 'vlogs',  // Not used (YouTube only)
            'written-posts': 'written-posts'
        };
        
        return {
            jsonPath: `Content Studio/${contentType}/${this.getJSONFileName(contentType)}`,
            storagePath: `Content Storage/${storagePathMap[contentType] || contentType}`,
            arrayKey: this.getJSONArrayKey(contentType),
            isNested: contentType === 'video-content' // Vlogs have nested structure
        };
    }

    // ==================== DELETE & EDIT METHODS ====================

    /**
     * Get file from GitHub
     */
    async getFile(path) {
        try {
            const response = await fetch(
                `https://api.github.com/repos/${this.owner}/${this.repo}/contents/${path}`,
                {
                    headers: {
                        'Authorization': `token ${this.token}`,
                        'Accept': 'application/vnd.github.v3+json'
                    }
                }
            );

            if (!response.ok) {
                throw new Error(`Failed to get file: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error getting file:', error);
            throw error;
        }
    }

    /**
     * Delete file from GitHub
     */
    async deleteFile(path, message = 'Delete file') {
        try {
            // Get file SHA first
            const fileData = await this.getFile(path);
            
            const response = await fetch(
                `https://api.github.com/repos/${this.owner}/${this.repo}/contents/${path}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `token ${this.token}`,
                        'Accept': 'application/vnd.github.v3+json'
                    },
                    body: JSON.stringify({
                        message,
                        sha: fileData.sha,
                        branch: this.branch
                    })
                }
            );

            if (!response.ok) {
                throw new Error(`Failed to delete: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error deleting file:', error);
            throw error;
        }
    }

    /**
     * Replace entire JSON file content
     */
    async replaceJSON(path, newData, message = 'Update content') {
        try {
            const fileData = await this.getFile(path);
            
            const content = btoa(unescape(encodeURIComponent(JSON.stringify(newData, null, 2))));
            
            const response = await fetch(
                `https://api.github.com/repos/${this.owner}/${this.repo}/contents/${path}`,
                {
                    method: 'PUT',
                    headers: {
                        'Authorization': `token ${this.token}`,
                        'Accept': 'application/vnd.github.v3+json'
                    },
                    body: JSON.stringify({
                        message,
                        content,
                        sha: fileData.sha,
                        branch: this.branch
                    })
                }
            );

            if (!response.ok) {
                throw new Error(`Failed to replace JSON: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error replacing JSON:', error);
            throw error;
        }
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GitHubContentUploader;
}

console.log('✅ GitHub Content Uploader loaded');
