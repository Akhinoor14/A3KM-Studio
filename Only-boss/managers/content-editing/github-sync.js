// GitHub Sync Manager - For Real-time Content Updates
// Handles reading and writing to GitHub repository via GitHub API

class GitHubSyncManager {
    constructor() {
        this.owner = 'Akhinoor14';
        this.repo = 'A3KM-Studio';
        this.branch = 'main';
        this.token = null;
        this.apiBase = 'https://api.github.com';
        this.tokenStorageKey = 'a3km_github_token_v2'; // Persistent key
        this.deviceId = this._getDeviceId();
    }

    // Generate unique device ID
    _getDeviceId() {
        let deviceId = localStorage.getItem('a3km_device_id');
        if (!deviceId) {
            deviceId = 'device_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('a3km_device_id', deviceId);
        }
        return deviceId;
    }

    // Set GitHub Personal Access Token with persistent storage
    setToken(token) {
        this.token = token;
        // Save in multiple places for redundancy
        localStorage.setItem(this.tokenStorageKey, token);
        localStorage.setItem('github_token', token); // Legacy key
        localStorage.setItem(`${this.tokenStorageKey}_${this.deviceId}`, token); // Device-specific
        localStorage.setItem('github_token_saved_at', new Date().toISOString());
        console.log('✅ Token saved successfully');
    }

    // Get stored token with fallback
    getToken() {
        if (!this.token) {
            // Try multiple storage keys
            this.token = 
                localStorage.getItem(this.tokenStorageKey) ||
                localStorage.getItem(`${this.tokenStorageKey}_${this.deviceId}`) ||
                localStorage.getItem('github_token');
        }
        return this.token;
    }

    // Clear token (but keep device ID)
    clearToken() {
        this.token = null;
        localStorage.removeItem(this.tokenStorageKey);
        localStorage.removeItem('github_token');
        localStorage.removeItem(`${this.tokenStorageKey}_${this.deviceId}`);
        console.log('🔓 Token cleared');
    }

    // Check if authenticated
    isAuthenticated() {
        return !!this.getToken();
    }

    // Get file content from GitHub
    async getFileContent(path) {
        try {
            const url = `${this.apiBase}/repos/${this.owner}/${this.repo}/contents/${path}?ref=${this.branch}`;
            const response = await fetch(url, {
                headers: this._getHeaders()
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch file: ${response.statusText}`);
            }

            const data = await response.json();
            const content = atob(data.content); // Decode base64
            return {
                content,
                sha: data.sha,
                path: data.path
            };
        } catch (error) {
            console.error('Error fetching file:', error);
            throw error;
        }
    }

    // Update file content on GitHub
    async updateFileContent(path, content, message, sha) {
        try {
            const url = `${this.apiBase}/repos/${this.owner}/${this.repo}/contents/${path}`;
            const encodedContent = btoa(unescape(encodeURIComponent(content))); // Encode to base64

            const response = await fetch(url, {
                method: 'PUT',
                headers: this._getHeaders(),
                body: JSON.stringify({
                    message: message || `Update ${path} via Content Editor`,
                    content: encodedContent,
                    sha: sha,
                    branch: this.branch
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || `Failed to update file: ${response.statusText}`);
            }

            const data = await response.json();
            return {
                success: true,
                commit: data.commit,
                content: data.content
            };
        } catch (error) {
            console.error('Error updating file:', error);
            throw error;
        }
    }

    // Get multiple files in batch
    async getMultipleFiles(paths) {
        const promises = paths.map(path => this.getFileContent(path));
        try {
            const results = await Promise.all(promises);
            return results;
        } catch (error) {
            console.error('Error fetching multiple files:', error);
            throw error;
        }
    }

    // Update multiple files in batch
    async updateMultipleFiles(updates) {
        const promises = updates.map(update => 
            this.updateFileContent(update.path, update.content, update.message, update.sha)
        );
        try {
            const results = await Promise.all(promises);
            return results;
        } catch (error) {
            console.error('Error updating multiple files:', error);
            throw error;
        }
    }

    // Verify token validity
    async verifyToken() {
        try {
            const response = await fetch(`${this.apiBase}/user`, {
                headers: this._getHeaders()
            });
            return response.ok;
        } catch (error) {
            console.error('Token verification failed:', error);
            return false;
        }
    }

    // Get repository info
    async getRepoInfo() {
        try {
            const url = `${this.apiBase}/repos/${this.owner}/${this.repo}`;
            const response = await fetch(url, {
                headers: this._getHeaders()
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch repo info: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching repo info:', error);
            throw error;
        }
    }

    // Private: Get request headers
    _getHeaders() {
        const headers = {
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
        };

        if (this.getToken()) {
            headers['Authorization'] = `token ${this.getToken()}`;
        }

        return headers;
    }

    // Extract text content from HTML
    extractTextFromHTML(html, selectors) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const extracted = {};

        for (const [key, selector] of Object.entries(selectors)) {
            const element = doc.querySelector(selector);
            if (element) {
                extracted[key] = element.textContent.trim();
            }
        }

        return extracted;
    }

    // Inject text back into HTML
    injectTextIntoHTML(html, replacements) {
        let updatedHTML = html;

        for (const [selector, newText] of Object.entries(replacements)) {
            const parser = new DOMParser();
            const doc = parser.parseFromString(updatedHTML, 'text/html');
            const element = doc.querySelector(selector);

            if (element) {
                const oldText = element.textContent.trim();
                // Use regex to replace the exact text content
                const regex = new RegExp(`(${this._escapeRegex(selector)}[^>]*>)([^<]*)(</[^>]+>)`, 'g');
                updatedHTML = updatedHTML.replace(oldText, newText);
            }
        }

        return updatedHTML;
    }

    // Escape regex special characters
    _escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GitHubSyncManager;
}
