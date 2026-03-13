/**
 * GitHub API Sync for Blog Posts
 * Syncs localStorage posts with GitHub repository for cloud persistence
 * Author: Md Akhinoor Islam
 * Date: February 10, 2026
 */

class GitHubPostSync {
    constructor() {
        this.owner = 'Akhinoor14'; // GitHub username
        this.repo = 'A3KM-Studio'; // Repository name
        this.branch = 'main'; // Branch name
        this.filePath = 'Content Studio/written-posts/posts.json'; // Path in repo
        this.token = null; // GitHub Personal Access Token
        this.apiBase = 'https://api.github.com';
    }

    encodeBase64Unicode(value) {
        return btoa(unescape(encodeURIComponent(value)));
    }

    decodeBase64Unicode(value) {
        return decodeURIComponent(escape(atob(value)));
    }

    /**
     * Initialize with stored token from API config
     */
    async init() {
        try {
            // Try to get token from localStorage (set by API config manager)
            this.token = localStorage.getItem('github_api_token');
            
            if (!this.token) {
                console.warn('⚠️ No GitHub token found. Sync disabled.');
                return false;
            }

            console.log('✅ GitHub Sync initialized');
            return true;
        } catch (error) {
            console.error('❌ GitHub Sync init failed:', error);
            return false;
        }
    }

    /**
     * Set GitHub token manually
     */
    setToken(token) {
        this.token = token;
        localStorage.setItem('github_api_token', token);
    }

    /**
     * Fetch current posts.json from GitHub
     */
    async fetchPostsFromGitHub() {
        if (!this.token) {
            throw new Error('No GitHub token configured');
        }

        try {
            const url = `${this.apiBase}/repos/${this.owner}/${this.repo}/contents/${encodeURIComponent(this.filePath)}?ref=${this.branch}`;
            
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'X-GitHub-Api-Version': '2022-11-28'
                }
            });

            if (!response.ok) {
                if (response.status === 404) {
                    console.log('📝 posts.json not found on GitHub, will create on first sync');
                    return { posts: [], sha: null };
                }
                throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            const content = this.decodeBase64Unicode(data.content); // Decode UTF-8 base64
            const postsData = JSON.parse(content);

            return {
                posts: postsData.posts || [],
                sha: data.sha // SHA needed for updates
            };
        } catch (error) {
            console.error('❌ Failed to fetch from GitHub:', error);
            throw error;
        }
    }

    /**
     * Push posts to GitHub
     */
    async pushPostsToGitHub(posts, sha = null) {
        if (!this.token) {
            throw new Error('No GitHub token configured');
        }

        try {
            const postsData = {
                posts: posts,
                lastUpdated: new Date().toISOString(),
                syncedFrom: 'A3KM Blog Manager'
            };

            const content = this.encodeBase64Unicode(JSON.stringify(postsData, null, 2)); // UTF-8 safe base64 encode
            
            const url = `${this.apiBase}/repos/${this.owner}/${this.repo}/contents/${encodeURIComponent(this.filePath)}`;
            
            const body = {
                message: `📝 Update blog posts (${posts.length} posts) - ${new Date().toLocaleString()}`,
                content: content,
                branch: this.branch
            };

            // If file exists, include SHA for update
            if (sha) {
                body.sha = sha;
            }

            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json',
                    'X-GitHub-Api-Version': '2022-11-28'
                },
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`GitHub API error: ${response.status} - ${errorData.message}`);
            }

            const result = await response.json();
            console.log('✅ Successfully pushed to GitHub:', result.commit.sha);
            
            return {
                success: true,
                commit: result.commit,
                sha: result.content.sha
            };
        } catch (error) {
            console.error('❌ Failed to push to GitHub:', error);
            throw error;
        }
    }

    /**
     * Merge localStorage posts with GitHub posts (localStorage takes priority for conflicts)
     */
    mergePosts(localPosts, githubPosts) {
        const merged = [...githubPosts];
        const githubIds = new Set(githubPosts.map(p => p.id));

        // Add local posts that don't exist on GitHub
        localPosts.forEach(localPost => {
            if (!githubIds.has(localPost.id)) {
                merged.push(localPost);
                console.log(`➕ Adding new local post: ${localPost.id}`);
            } else {
                // If exists, use localStorage version (more recent)
                const index = merged.findIndex(p => p.id === localPost.id);
                merged[index] = localPost;
                console.log(`🔄 Updating with local version: ${localPost.id}`);
            }
        });

        return merged;
    }

    /**
     * Full sync: Pull from GitHub, merge with local, push back
     */
    async fullSync() {
        try {
            console.log('🔄 Starting full GitHub sync...');

            // 1. Get local posts
            const localPosts = JSON.parse(localStorage.getItem('a3km_posts') || '[]');
            console.log(`📱 Local posts: ${localPosts.length}`);

            // 2. Fetch from GitHub
            const { posts: githubPosts, sha } = await this.fetchPostsFromGitHub();
            console.log(`☁️  GitHub posts: ${githubPosts.length}`);

            // 3. Merge (local takes priority)
            const mergedPosts = this.mergePosts(localPosts, githubPosts);
            console.log(`🔀 Merged posts: ${mergedPosts.length}`);

            // 4. Push merged result to GitHub
            const result = await this.pushPostsToGitHub(mergedPosts, sha);

            // 5. Update localStorage with merged data
            localStorage.setItem('a3km_posts', JSON.stringify(mergedPosts));

            console.log('✅ Full sync completed successfully!');
            
            return {
                success: true,
                localCount: localPosts.length,
                githubCount: githubPosts.length,
                mergedCount: mergedPosts.length,
                commit: result.commit
            };
        } catch (error) {
            console.error('❌ Full sync failed:', error);
            throw error;
        }
    }

    /**
     * Pull only (download from GitHub to localStorage)
     */
    async pullFromGitHub() {
        try {
            console.log('⬇️  Pulling posts from GitHub...');

            const { posts: githubPosts } = await this.fetchPostsFromGitHub();
            
            // Merge with local
            const localPosts = JSON.parse(localStorage.getItem('a3km_posts') || '[]');
            const merged = this.mergePosts(localPosts, githubPosts);

            // Save to localStorage
            localStorage.setItem('a3km_posts', JSON.stringify(merged));

            console.log(`✅ Pulled ${githubPosts.length} posts from GitHub`);
            
            return {
                success: true,
                pulled: githubPosts.length,
                total: merged.length
            };
        } catch (error) {
            console.error('❌ Pull failed:', error);
            throw error;
        }
    }

    /**
     * Push only (upload from localStorage to GitHub)
     */
    async pushToGitHub() {
        try {
            console.log('⬆️  Pushing posts to GitHub...');

            const localPosts = JSON.parse(localStorage.getItem('a3km_posts') || '[]');
            
            // Get current SHA from GitHub
            let sha = null;
            try {
                const { sha: currentSha } = await this.fetchPostsFromGitHub();
                sha = currentSha;
            } catch (error) {
                console.log('📝 Creating new posts.json file');
            }

            const result = await this.pushPostsToGitHub(localPosts, sha);

            // 📝 Upload markdown files for each post
            console.log('📝 Uploading markdown files...');
            for (const post of localPosts) {
                try {
                    if (post.markdownFile || post.contentPath) {
                        await this.uploadMarkdownFile(post);
                    }
                } catch (error) {
                    console.warn(`⚠️ Failed to upload markdown for ${post.title}:`, error.message);
                    // Continue with other posts even if one fails
                }
            }

            console.log(`✅ Pushed ${localPosts.length} posts to GitHub`);
            
            return {
                success: true,
                pushed: localPosts.length,
                commit: result.commit
            };
        } catch (error) {
            console.error('❌ Push failed:', error);
            throw error;
        }
    }

    /**
     * Upload markdown file for a post
     */
    async uploadMarkdownFile(post) {
        if (!this.token) {
            throw new Error('No GitHub token');
        }

        try {
            const filePath = post.markdownFile || post.contentPath;
            if (!filePath) {
                console.warn(`⚠️ No markdown path for post: ${post.title}`);
                return { success: false, reason: 'no_path' };
            }

            // Create markdown content from post object
            const markdownContent = this.generateMarkdownFromPost(post);

            const url = `${this.apiBase}/repos/${this.owner}/${this.repo}/contents/${encodeURIComponent(filePath)}`;

            // Check if file exists to get its SHA
            let sha = null;
            try {
                const getResponse = await fetch(url, {
                    headers: {
                        'Authorization': `Bearer ${this.token}`,
                        'Accept': 'application/vnd.github.v3+json'
                    }
                });
                if (getResponse.ok) {
                    const data = await getResponse.json();
                    sha = data.sha;
                }
            } catch (error) {
                // File doesn't exist, that's OK
            }

            // Upload file
            const body = {
                message: `📝 Add/update post: ${post.title}`,
                content: this.encodeBase64Unicode(markdownContent), // UTF-8 safe base64 encode
                branch: this.branch
            };

            if (sha) {
                body.sha = sha; // For updates
            }

            const uploadResponse = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json',
                    'X-GitHub-Api-Version': '2022-11-28'
                },
                body: JSON.stringify(body)
            });

            if (!uploadResponse.ok) {
                const errorData = await uploadResponse.json();
                throw new Error(`Upload failed: ${errorData.message}`);
            }

            console.log(`✅ Uploaded: ${filePath}`);
            return { success: true, path: filePath };

        } catch (error) {
            console.error(`❌ Markdown upload failed for ${post.title}:`, error);
            throw error;
        }
    }

    /**
     * Generate markdown content from post object
     */
    generateMarkdownFromPost(post) {
        const frontmatter = `---
title: ${post.title}
author: ${post.author || 'Md Akhinoor Islam'}
date: ${post.date}
category: ${post.category}
tags: [${post.tags?.map(t => `"${t}"`).join(', ') || ''}]
slug: ${post.slug}
readTime: ${post.readTime}
---

# ${post.title}

${post.summary}

${post.content || ''}
`;
        return frontmatter;
    }


    /**
     * Auto-sync on publish (called after creating new post)
     */
    async autoSyncOnPublish() {
        try {
            if (!this.token) {
                console.log('⚠️ Auto-sync skipped: No GitHub token');
                return { success: false, reason: 'no_token' };
            }

            // Just push the new update
            const result = await this.pushToGitHub();
            console.log('✅ Auto-synced after publish');
            
            return result;
        } catch (error) {
            console.error('❌ Auto-sync failed:', error);
            // Don't throw - allow post creation to succeed even if sync fails
            return { success: false, error: error.message };
        }
    }

    /**
     * Check GitHub API rate limit
     */
    async checkRateLimit() {
        try {
            const response = await fetch(`${this.apiBase}/rate_limit`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            const data = await response.json();
            const core = data.resources.core;

            return {
                limit: core.limit,
                remaining: core.remaining,
                reset: new Date(core.reset * 1000).toLocaleString(),
                resetTimestamp: core.reset
            };
        } catch (error) {
            console.error('❌ Failed to check rate limit:', error);
            return null;
        }
    }
}

// Export for use in other files
window.GitHubPostSync = GitHubPostSync;
