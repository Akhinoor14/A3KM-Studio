/**
 * GitHub API Integration Handler
 * Handles direct push to GitHub repository
 * Version: 1.0.0
 * Last Updated: January 22, 2026
 */

class GitHubAPIHandler {
    constructor() {
        this.token = null;
        this.owner = 'Akhinoor14';
        this.repo = 'A3KM-Studio';
        this.branch = 'main';
        this.apiBase = 'https://api.github.com';
    }

    /**
     * Initialize with Personal Access Token
     * @param {string} token - GitHub PAT
     */
    setToken(token) {
        this.token = token;
        localStorage.setItem('github_pat', token);
    }

    /**
     * Load token from storage
     * @returns {boolean} - true if token exists
     */
    loadToken() {
        this.token = localStorage.getItem('github_pat');
        return !!this.token;
    }

    /**
     * Clear stored token
     */
    clearToken() {
        this.token = null;
        localStorage.removeItem('github_pat');
    }

    /**
     * Check if authenticated
     * @returns {boolean}
     */
    isAuthenticated() {
        return !!this.token;
    }

    /**
     * Verify token and get user info
     * @returns {Promise<object>}
     */
    async verifyToken() {
        if (!this.token) throw new Error('No token set');

        const response = await fetch(`${this.apiBase}/user`, {
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        if (!response.ok) {
            throw new Error('Invalid token');
        }

        return await response.json();
    }

    /**
     * Get file content from repository
     * @param {string} path - File path in repo
     * @returns {Promise<object>}
     */
    async getFile(path) {
        const response = await fetch(
            `${this.apiBase}/repos/${this.owner}/${this.repo}/contents/${path}`,
            {
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            }
        );

        if (!response.ok) {
            if (response.status === 404) return null;
            throw new Error(`Failed to get file: ${response.statusText}`);
        }

        return await response.json();
    }

    /**
     * Create or update file in repository
     * @param {string} path - File path
     * @param {string} content - File content (base64 for binary)
     * @param {string} message - Commit message
     * @param {string} sha - SHA of existing file (for updates)
     * @returns {Promise<object>}
     */
    async putFile(path, content, message, sha = null) {
        const body = {
            message: message,
            content: content,
            branch: this.branch
        };

        if (sha) {
            body.sha = sha;
        }

        const response = await fetch(
            `${this.apiBase}/repos/${this.owner}/${this.repo}/contents/${path}`,
            {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            }
        );

        if (!response.ok) {
            throw new Error(`Failed to put file: ${response.statusText}`);
        }

        return await response.json();
    }

    /**
     * Upload text file to GitHub
     * @param {string} path - File path in repo
     * @param {string} content - Text content
     * @param {string} message - Commit message
     * @returns {Promise<object>}
     */
    async uploadTextFile(path, content, message) {
        // Check if file exists
        const existing = await this.getFile(path);
        const sha = existing ? existing.sha : null;

        // Encode content to base64
        const base64Content = btoa(unescape(encodeURIComponent(content)));

        return await this.putFile(path, base64Content, message, sha);
    }

    /**
     * Upload binary file to GitHub
     * @param {string} path - File path in repo
     * @param {File} file - File object
     * @param {string} message - Commit message
     * @returns {Promise<object>}
     */
    async uploadBinaryFile(path, file, message) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = async () => {
                try {
                    // Get base64 content (remove data URL prefix)
                    const base64Content = reader.result.split(',')[1];

                    // Check if file exists
                    const existing = await this.getFile(path);
                    const sha = existing ? existing.sha : null;

                    const result = await this.putFile(path, base64Content, message, sha);
                    resolve(result);
                } catch (error) {
                    reject(error);
                }
            };

            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsDataURL(file);
        });
    }

    /**
     * Upload entire project to GitHub
     * @param {object} project - Project data
     * @param {object} files - Files object {code: FileList, images: FileList, etc}
     * @param {string} basePath - Base path in repo (e.g., "Projects Code/Arduino/")
     * @param {function} progressCallback - Progress callback (current, total)
     * @returns {Promise<object>}
     */
    async uploadProject(project, files, basePath, progressCallback = null) {
        if (!this.isAuthenticated()) {
            throw new Error('Not authenticated. Please set GitHub token.');
        }

        const results = {
            success: [],
            failed: [],
            total: 0
        };

        const folderPath = `${basePath}${project.folder}`;
        let uploaded = 0;

        try {
            // Count total files
            let totalFiles = 0;
            for (const category in files) {
                if (files[category]) {
                    totalFiles += files[category].length || 0;
                }
            }
            results.total = totalFiles;

            // Upload each file
            for (const category in files) {
                if (!files[category]) continue;

                const fileList = Array.isArray(files[category]) 
                    ? files[category] 
                    : Array.from(files[category]);

                for (const file of fileList) {
                    try {
                        const filePath = `${folderPath}/${file.name}`;
                        const message = `Add ${file.name} to ${project.title}`;

                        await this.uploadBinaryFile(filePath, file, message);

                        results.success.push(file.name);
                        uploaded++;

                        if (progressCallback) {
                            progressCallback(uploaded, totalFiles);
                        }
                    } catch (error) {
                        results.failed.push({
                            file: file.name,
                            error: error.message
                        });
                    }
                }
            }

            return results;
        } catch (error) {
            throw new Error(`Project upload failed: ${error.message}`);
        }
    }

    /**
     * Update JSON data file
     * @param {string} path - Path to JSON file
     * @param {object} data - JSON data
     * @param {string} message - Commit message
     * @returns {Promise<object>}
     */
    async updateJSONFile(path, data, message = 'Update project data') {
        const content = JSON.stringify(data, null, 2);
        return await this.uploadTextFile(path, content, message);
    }

    /**
     * Delete file from repository
     * @param {string} path - File path
     * @param {string} message - Commit message
     * @returns {Promise<object>}
     */
    async deleteFile(path, message = 'Delete file') {
        const existing = await this.getFile(path);
        if (!existing) {
            throw new Error('File not found');
        }

        const response = await fetch(
            `${this.apiBase}/repos/${this.owner}/${this.repo}/contents/${path}`,
            {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: message,
                    sha: existing.sha,
                    branch: this.branch
                })
            }
        );

        if (!response.ok) {
            throw new Error(`Failed to delete file: ${response.statusText}`);
        }

        return await response.json();
    }

    /**
     * Get repository statistics
     * @returns {Promise<object>}
     */
    async getRepoStats() {
        const response = await fetch(
            `${this.apiBase}/repos/${this.owner}/${this.repo}`,
            {
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            }
        );

        if (!response.ok) {
            throw new Error('Failed to get repo stats');
        }

        const data = await response.json();
        return {
            stars: data.stargazers_count,
            forks: data.forks_count,
            watchers: data.watchers_count,
            size: data.size,
            lastUpdate: data.updated_at
        };
    }
}

// ===== UI COMPONENTS =====

/**
 * Show GitHub authentication modal
 * @returns {Promise<string>} - GitHub token
 */
function showGitHubAuthModal() {
    return new Promise((resolve, reject) => {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
        `;

        modal.innerHTML = `
            <div style="background: #1e1e1e; padding: 30px; border-radius: 12px; max-width: 500px; width: 90%;">
                <h2 style="color: #fff; margin-bottom: 20px;">
                    <i class="fab fa-github"></i> GitHub Authentication
                </h2>
                <p style="color: #aaa; margin-bottom: 20px;">
                    Enter your GitHub Personal Access Token to enable direct uploads.
                </p>
                <div style="background: #2d2d2d; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                    <p style="color: #fff; margin-bottom: 10px; font-size: 0.9rem;">
                        <strong>How to get a token:</strong>
                    </p>
                    <ol style="color: #aaa; font-size: 0.85rem; margin-left: 20px;">
                        <li>Go to GitHub Settings → Developer settings</li>
                        <li>Personal access tokens → Generate new token</li>
                        <li>Select scope: <code>repo</code> (Full control)</li>
                        <li>Generate token and copy it</li>
                    </ol>
                </div>
                <input type="password" id="githubToken" placeholder="ghp_xxxxxxxxxxxxxxxxxxxx" 
                       style="width: 100%; padding: 12px; border: 2px solid #444; border-radius: 6px; 
                              background: #2d2d2d; color: #fff; font-family: monospace; margin-bottom: 20px;">
                <div style="display: flex; gap: 10px;">
                    <button id="githubAuthSubmit" style="flex: 1; padding: 12px; background: #238636; 
                            color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">
                        <i class="fas fa-check"></i> Authenticate
                    </button>
                    <button id="githubAuthCancel" style="flex: 1; padding: 12px; background: #444; 
                            color: white; border: none; border-radius: 6px; cursor: pointer;">
                        Cancel
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        const input = modal.querySelector('#githubToken');
        const submitBtn = modal.querySelector('#githubAuthSubmit');
        const cancelBtn = modal.querySelector('#githubAuthCancel');

        submitBtn.onclick = () => {
            const token = input.value.trim();
            if (!token) {
                alert('Please enter a token');
                return;
            }
            modal.remove();
            resolve(token);
        };

        cancelBtn.onclick = () => {
            modal.remove();
            reject(new Error('Cancelled'));
        };

        input.focus();
    });
}

/**
 * Show upload progress modal
 * @param {number} total - Total files to upload
 * @returns {object} - Modal controller
 */
function showUploadProgressModal(total) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
    `;

    modal.innerHTML = `
        <div style="background: #1e1e1e; padding: 30px; border-radius: 12px; max-width: 400px; width: 90%;">
            <h3 style="color: #fff; margin-bottom: 20px;">
                <i class="fas fa-upload"></i> Uploading to GitHub...
            </h3>
            <div style="background: #2d2d2d; height: 30px; border-radius: 15px; overflow: hidden; margin-bottom: 15px;">
                <div id="uploadProgress" style="height: 100%; background: linear-gradient(90deg, #238636, #2ea043); 
                     width: 0%; transition: width 0.3s;"></div>
            </div>
            <p id="uploadStatus" style="color: #aaa; text-align: center;">
                0 / ${total} files uploaded
            </p>
        </div>
    `;

    document.body.appendChild(modal);

    return {
        update: (current) => {
            const percent = (current / total) * 100;
            modal.querySelector('#uploadProgress').style.width = percent + '%';
            modal.querySelector('#uploadStatus').textContent = `${current} / ${total} files uploaded`;
        },
        close: () => modal.remove()
    };
}

// Export
window.GitHubAPIHandler = GitHubAPIHandler;
window.showGitHubAuthModal = showGitHubAuthModal;
window.showUploadProgressModal = showUploadProgressModal;

console.log('✅ GitHub API Handler loaded');
