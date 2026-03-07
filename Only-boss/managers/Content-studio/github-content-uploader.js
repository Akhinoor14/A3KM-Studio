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
        // Auto-load token from localStorage (centralized API config)
        const storedToken = localStorage.getItem('github_token');
        
        // GitHub configuration
        this.token = config.token || storedToken || '';
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
        
        // Token status check
        if (!this.token) {
            console.warn('⚠️ GitHub token not found. Please configure at: Only-boss/managers/shared/api-config-manager.html');
        }
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
            
            // Encode spaces and special characters in path
            const encodedPath = path.split('/').map(segment => encodeURIComponent(segment)).join('/');
            
            // Check if file exists (to get SHA for update)
            let sha;
            try {
                const existingFile = await this.getFile(encodedPath);
                sha = existingFile ? existingFile.sha : undefined;
            } catch (e) {
                // File doesn't exist - that's OK
                sha = undefined;
            }
            
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
                `${this.apiUrl}/contents/${encodedPath}`,
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
            // Encode path segments properly but don't double-encode
            const encodedPath = path.split('/').map(segment => {
                // Skip already encoded segments
                if (segment.includes('%')) return segment;
                return encodeURIComponent(segment);
            }).join('/');
            
            const response = await this.makeRequest(
                `${this.apiUrl}/contents/${encodedPath}?ref=${this.branch}`,
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
            // Handle 404 errors - file doesn't exist
            if (error.message.includes('404') || error.message.includes('Not Found')) {
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
                console.warn(`File ${path} does not exist, skipping delete`);
                return null;
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

    /**
     * Delete all files inside a folder (recursively) from GitHub
     * @param {string} folderPath - Folder path in repository
     * @param {string} message - Commit message
     */
    async deleteFolder(folderPath, message) {
        try {
            const items = await this.makeRequest(
                `${this.apiUrl}/contents/${folderPath}`,
                'GET'
            );

            if (!items || !Array.isArray(items)) {
                console.warn(`⚠️ Folder not found or empty: ${folderPath}`);
                return { success: true, deleted: 0 };
            }

            let deleted = 0;
            for (const item of items) {
                if (item.type === 'file') {
                    await this.deleteFile(item.path, message || `Delete ${item.path}`);
                    deleted++;
                } else if (item.type === 'dir') {
                    // Recursively delete sub-folders
                    const sub = await this.deleteFolder(item.path, message);
                    deleted += sub.deleted || 0;
                }
            }

            console.log(`✅ Deleted folder: ${folderPath} (${deleted} files)`);
            return { success: true, deleted, path: folderPath };

        } catch (error) {
            console.warn(`⚠️ deleteFolder warning for ${folderPath}: ${error.message}`);
            return { success: false, error: error.message };
        }
    }

    // ==================== FOLDER OPERATIONS ====================

    /**
     * Create folder structure by uploading a .gitkeep file
     * Handles nested folder creation
     * @param {string} folderPath - Folder path to create
     */
    async createFolder(folderPath) {
        try {
            // Ensure path ends with /
            const path = folderPath.endsWith('/') ? folderPath : `${folderPath}/`;
            
            // Create .gitkeep file to establish folder
            const gitkeepPath = `${path}.gitkeep`;
            
            // Try to create the folder by uploading .gitkeep
            try {
                return await this.uploadFile(
                    gitkeepPath,
                    '# Folder created by Content Upload Manager',
                    `Create folder: ${path}`,
                    false
                );
            } catch (uploadError) {
                // If upload fails due to folder not existing, we still continue
                // The folder structure will be created when the actual files are uploaded
                console.warn(`⚠️ Could not create .gitkeep for ${path}: ${uploadError.message}`);
                
                // Return success anyway - files will create the directory when uploaded
                return {
                    success: true,
                    path: gitkeepPath,
                    warning: 'Folder creation deferred until files are uploaded'
                };
            }
            
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
            // Encode path segments properly
            const encodedPath = folderPath.split('/').map(segment => encodeURIComponent(segment)).join('/');
            const response = await this.makeRequest(
                `${this.apiUrl}/contents/${encodedPath}?ref=${this.branch}`,
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
            
            let jsonData;
            if (!existingFile) {
                // File doesn't exist yet - create initial structure
                console.warn(`JSON file not found, creating new: ${jsonPath}`);
                jsonData = {};
                if (arrayKey) {
                    jsonData[arrayKey] = [];
                }
            } else {
                // Decode base64 content
                // GitHub base64 has \n line breaks — strip whitespace before decoding
                const cleanBase64 = existingFile.content.replace(/\s/g, '');
                // Use TextDecoder to properly handle UTF-8 (Bengali, Arabic, etc.)
                const bytes = Uint8Array.from(atob(cleanBase64), c => c.charCodeAt(0));
                const decodedContent = new TextDecoder('utf-8').decode(bytes);
                jsonData = JSON.parse(decodedContent);
            }
            
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
            
            const uploadResult = await this.uploadFile(
                jsonPath,
                JSON.stringify(jsonData, null, 2),
                `Update ${jsonPath} - Add ${newEntry.title || 'new entry'}`,
                false
            );
            
            // 🔄 AUTO-SYNC: If video-content updated, trigger mobile content.json sync
            if (jsonPath.includes('video-content/videos.json')) {
                try {
                    console.log('🔄 Triggering mobile content.json sync...');
                    // Note: Sync will be handled by content-manager after this returns
                    // We just log the event here for debugging
                } catch (syncError) {
                    console.warn('⚠️ Mobile sync log failed:', syncError.message);
                }
            }
            
            return uploadResult;
            
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
            
            // Storage path strategy:
            // Books: FOLDER-BASED structure (each book in its own folder) - organized, scalable, best practice
            // Papers: FOLDER-BASED structure (each paper in its own folder)
            // Posts: Nested by CategoryGroup/Category - maintains organizational structure
            // Videos: Metadata-based in videos.json with categories
            
            let basePath;
            let bookFolderName = null;  // For books & papers folder-based structure
            
            if (contentType === 'written-posts') {
                // Posts use: written-posts/{CategoryGroup}/{Category}/
                const categoryGroup = this.getCategoryGroup(category, contentType);
                basePath = `${pathConfig.storagePath}/${categoryGroup}/${categorySlug}`;
            } else if (contentType === 'books-pdfs' || contentType === 'research-papers') {
                // ✅ FOLDER-BASED STRUCTURE: Each book/paper gets its own folder
                // Format: books-pdfs/{book-title-slug}/
                // Using ONLY the title slug (no timestamp) so re-uploading the same book
                // overwrites the existing folder instead of creating a new duplicate.
                const fileSlug = this.slugify(title);
                bookFolderName = fileSlug;
                basePath = `${pathConfig.storagePath}/${bookFolderName}`;
                console.log(`📁 Using folder-based structure for ${contentType}: ${basePath}`);
            } else {
                // Educational videos, vlogs, etc.
                basePath = pathConfig.storagePath;
            }
            
            this.onProgress({ stage: 'starting', total: 4 });

            // 2. Create book/paper folder if using folder-based structure
            // GitHub API handles parent directories automatically on file upload
            if (bookFolderName) {
                try {
                    if (!await this.folderExists(basePath)) {
                        await this.createFolder(basePath);
                        results.uploads.push(`Created folder: ${bookFolderName}`);
                        console.log(`✅ Created book folder: ${basePath}`);
                    }
                } catch (folderError) {
                    console.warn(`⚠️ Folder creation warning: ${folderError.message}`);
                    // Continue anyway - GitHub creates folders on file upload
                }
            } else {
                try {
                    if (!await this.folderExists(basePath)) {
                        await this.createFolder(basePath);
                        results.uploads.push('folder structure configured');
                    }
                } catch (folderError) {
                    console.warn(`⚠️ Folder creation warning: ${folderError.message}`);
                }
            }

            // 3. Upload cover image (uploaded by user, not auto-generated SVG)
            // For books/papers with folder structure: goes directly in book folder as cover.jpg/cover.svg
            // For other content: category cover logic (backwards compatible)
            if (coverSVG && !bookFolderName) {
                // Legacy category cover upload (for posts, etc.)
                try {
                    const coversPath = `${basePath}/covers`;
                    const coverPath = `${coversPath}/${categorySlug}-cover.svg`;
                    
                    let coverExists = null;
                    try {
                        coverExists = await this.getFile(coverPath);
                    } catch (checkError) {
                        console.log(`📂 Cover will be uploaded fresh: ${coverPath}`);
                        coverExists = null;
                    }
                    
                    if (!coverExists) {
                        try {
                            if (!await this.folderExists(coversPath)) {
                                await this.createFolder(coversPath);
                            }
                        } catch (e) {
                            console.log(`📂 Covers folder will be created on file upload: ${coversPath}`);
                        }
                        
                        const coverResult = await this.uploadFile(
                            coverPath,
                            coverSVG,
                            `Add cover for ${category}`,
                            false
                        );
                        results.uploads.push(coverResult);
                        results.paths.cover = coverPath;
                        console.log(`✅ Cover uploaded: ${coverPath}`);
                    } else {
                        results.paths.cover = coverPath;
                        console.log(`ℹ️ Cover already exists: ${coverPath}`);
                    }
                } catch (coverUploadError) {
                    console.warn(`⚠️ Cover upload failed (non-critical): ${coverUploadError.message}`);
                    console.log(`ℹ️ Continuing upload without cover...`);
                }
            }
            // Note: Book/paper covers uploaded separately in step 5 (user-provided cover file)

            // 4. Upload content file
            // For books/papers: standardized filename "book.pdf" or "paper.pdf" in book folder
            // For others: slug-based filename
            if (contentFile) {
                const extension = this.getFileExtension(contentFile.name);
                let filename;
                
                if (bookFolderName) {
                    // ✅ STANDARDIZED: book.pdf, paper.pdf (easy to reference, clean structure)
                    filename = contentType === 'books-pdfs' ? `book.${extension}` : `paper.${extension}`;
                } else {
                    // Regular filename for other content types
                    const fileSlug = this.slugify(title);
                    filename = `${fileSlug}.${extension}`;
                }
                    
                const contentFilePath = `${basePath}/${filename}`;
                
                try {
                    const contentResult = await this.uploadBinaryFile(
                        contentFilePath,
                        contentFile,
                        `Add ${title}`
                    );
                    results.uploads.push(contentResult);
                    results.paths.content = contentFilePath;
                    console.log(`✅ Content uploaded: ${contentFilePath}`);
                } catch (uploadError) {
                    const msg = `Failed to upload content file: ${uploadError.message}`;
                    console.error(msg);
                    results.errors.push(msg);
                    throw uploadError;  // Critical - can't continue without content
                }
            }

            // 5. Upload cover and thumbnail (for books/papers: in book folder; for others: in covers subfolder)
            // Books get: cover.jpg and thumbnail.jpg in their folder
            if (thumbnailFile) {
                let thumbnailPath;
                let coverPath;
                
                if (bookFolderName) {
                    // ✅ BOOKS/PAPERS: cover.jpg and thumbnail.jpg in book folder
                    const extension = this.getFileExtension(thumbnailFile.name);
                    thumbnailPath = `${basePath}/thumbnail.${extension}`;
                    // If user uploaded cover separately, use it; otherwise thumbnail = cover
                    coverPath = `${basePath}/cover.${extension}`;
                } else {
                    // Other content: covers subfolder with unique names
                    const coversPath = `${basePath}/covers`;
                    const fileSlug = this.slugify(title);
                    const timestamp = Date.now();
                    thumbnailPath = `${coversPath}/${fileSlug}-${timestamp}-thumbnail.jpg`;
                    
                    try {
                        if (!await this.folderExists(coversPath)) {
                            await this.createFolder(coversPath);
                        }
                    } catch (e) {
                        console.log(`📂 Covers folder will be created on file upload`);
                    }
                }
                
                try {
                    // Upload thumbnail
                    const thumbnailResult = await this.uploadBinaryFile(
                        thumbnailPath,
                        thumbnailFile,
                        `Add thumbnail for ${title}`
                    );
                    results.uploads.push(thumbnailResult);
                    results.paths.thumbnail = thumbnailPath;
                    console.log(`✅ Thumbnail uploaded: ${thumbnailPath}`);
                    
                    // For books: also use thumbnail as cover if no separate cover uploaded
                    if (bookFolderName && !results.paths.cover) {
                        const coverResult = await this.uploadBinaryFile(
                            coverPath,
                            thumbnailFile,
                            `Add cover for ${title}`
                        );
                        results.uploads.push(coverResult);
                        results.paths.cover = coverPath;
                        console.log(`✅ Cover uploaded (from thumbnail): ${coverPath}`);
                    }
                } catch (thumbError) {
                    console.warn(`⚠️ Thumbnail upload failed: ${thumbError.message}`);
                    // Continue - thumbnail is optional
                }
            } else if (youtubeId) {
                results.paths.thumbnail = `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
            }

            // 6. Update main JSON file with correct structure
            const correctJsonPath = pathConfig.jsonPath;
            const arrayKey = pathConfig.arrayKey;
            
            // Convert paths to absolute raw GitHub URLs so they work from any page depth
            const convertToRelativePath = (absolutePath) => {
                if (!absolutePath || absolutePath.startsWith('http')) return absolutePath;
                // Encode each path segment to handle folder names with spaces (e.g. "Content Storage")
                const encodedPath = absolutePath.split('/').map(seg => encodeURIComponent(seg)).join('/');
                return `https://raw.githubusercontent.com/${this.owner}/${this.repo}/${this.branch}/${encodedPath}`;
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
                accessType: 'free',
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
                // Store folder path for easy management (delete/update entire paper folder)
                if (bookFolderName) {
                    jsonEntry.folderPath = `${pathConfig.storagePath}/${bookFolderName}`;
                }
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
                // Set cover from either SVG cover or manual thumbnail upload
                jsonEntry.cover = convertToRelativePath(results.paths.cover || results.paths.thumbnail);
                jsonEntry.thumbnail = convertToRelativePath(results.paths.thumbnail || results.paths.cover);
                // Store folder path for easy management (delete/update entire book folder)
                if (bookFolderName) {
                    jsonEntry.folderPath = `${pathConfig.storagePath}/${bookFolderName}`;
                }
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

            // Encode spaces in URL so GitHub API handles paths with spaces correctly
            const safeUrl = url.replace(/ /g, '%20');
            const response = await fetch(safeUrl, options);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(
                    errorData.message || `GitHub API error: ${response.status}`
                );
            }

            return await response.json();

        } catch (error) {
            // Don't retry on 404 (file not found is expected for new files)
            const is404 = error.message && (error.message.includes('404') || error.message.includes('Not Found'));
            // Retry logic
            if (!is404 && retries < this.maxRetries) {
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
            'books-pdfs': 'Content Storage/books-pdfs',
            'educational-videos': 'Content Storage/educational-videos',
            'research-papers': 'Content Storage/research-papers',
            'video-content': 'Content Storage/vlogs',
            'written-posts': 'Content Storage/written-posts'
        };
        
        return {
            jsonPath: `Content Studio/${contentType}/${this.getJSONFileName(contentType)}`,
            storagePath: storagePathMap[contentType] || `Content Storage/${contentType}`,
            arrayKey: this.getJSONArrayKey(contentType),
            isNested: contentType === 'video-content' // Vlogs have nested structure
        };
    }

}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GitHubContentUploader;
}

console.log('✅ GitHub Content Uploader loaded');
