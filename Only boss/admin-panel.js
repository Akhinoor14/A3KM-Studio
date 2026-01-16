/**
 * Content Management Admin Panel
 * CRUD operations for all content types
 * Author: Md Akhinoor Islam
 * A3KM Studio - Only Boss
 */

class AdminPanel {
    constructor() {
        this.contentTypes = ['blog', 'video', 'course', 'book', 'paper'];
        this.currentView = 'dashboard';
        this.init();
    }

    async init() {
        this.checkAuth();
        this.renderDashboard();
        this.setupEventListeners();
    }

    // ==================== AUTHENTICATION ====================

    checkAuth() {
        const isAuthenticated = sessionStorage.getItem('only_boss_auth');
        if (!isAuthenticated) {
            window.location.href = 'only-boss.html';
        }
    }

    // ==================== DASHBOARD ====================

    renderDashboard() {
        const container = document.getElementById('admin-content');
        if (!container) return;

        const stats = this.getContentStats();
        
        container.innerHTML = `
            <div class="admin-dashboard">
                <h2>📊 Content Dashboard</h2>
                
                <div class="stats-grid">
                    <div class="stat-card blog">
                        <div class="stat-icon">📝</div>
                        <div class="stat-info">
                            <h3>${stats.blog}</h3>
                            <p>Blog Posts</p>
                        </div>
                        <button onclick="adminPanel.manageContent('blog')" class="btn-manage">Manage</button>
                    </div>
                    
                    <div class="stat-card video">
                        <div class="stat-icon">🎥</div>
                        <div class="stat-info">
                            <h3>${stats.video}</h3>
                            <p>Videos</p>
                        </div>
                        <button onclick="adminPanel.manageContent('video')" class="btn-manage">Manage</button>
                    </div>
                    
                    <div class="stat-card course">
                        <div class="stat-icon">📚</div>
                        <div class="stat-info">
                            <h3>${stats.course}</h3>
                            <p>Courses</p>
                        </div>
                        <button onclick="adminPanel.manageContent('course')" class="btn-manage">Manage</button>
                    </div>
                    
                    <div class="stat-card book">
                        <div class="stat-icon">📖</div>
                        <div class="stat-info">
                            <h3>${stats.book}</h3>
                            <p>Books/PDFs</p>
                        </div>
                        <button onclick="adminPanel.manageContent('book')" class="btn-manage">Manage</button>
                    </div>
                    
                    <div class="stat-card paper">
                        <div class="stat-icon">🔬</div>
                        <div class="stat-info">
                            <h3>${stats.paper}</h3>
                            <p>Research Papers</p>
                        </div>
                        <button onclick="adminPanel.manageContent('paper')" class="btn-manage">Manage</button>
                    </div>
                    
                    <div class="stat-card analytics">
                        <div class="stat-icon">📈</div>
                        <div class="stat-info">
                            <h3>${stats.totalViews}</h3>
                            <p>Total Views</p>
                        </div>
                        <button onclick="adminPanel.viewAnalytics()" class="btn-manage">View</button>
                    </div>
                </div>

                <div class="quick-actions">
                    <h3>⚡ Quick Actions</h3>
                    <div class="action-buttons">
                        <button onclick="adminPanel.createNewPost()" class="btn-action">
                            ✍️ New Blog Post
                        </button>
                        <button onclick="adminPanel.uploadFile()" class="btn-action">
                            📤 Upload File
                        </button>
                        <button onclick="adminPanel.generateRSS()" class="btn-action">
                            🔄 Generate RSS
                        </button>
                        <button onclick="adminPanel.backupData()" class="btn-action">
                            💾 Backup Data
                        </button>
                        <button onclick="adminPanel.clearCache()" class="btn-action">
                            🗑️ Clear Cache
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    getContentStats() {
        // Load all content data
        const posts = JSON.parse(localStorage.getItem('blog_posts') || '[]');
        const videos = JSON.parse(localStorage.getItem('video_content') || '[]');
        const courses = JSON.parse(localStorage.getItem('educational_videos') || '[]');
        const books = JSON.parse(localStorage.getItem('books_pdfs') || '[]');
        const papers = JSON.parse(localStorage.getItem('research_papers') || '[]');
        
        // Calculate total views
        let totalViews = 0;
        [posts, videos, courses, books, papers].forEach(contentArray => {
            contentArray.forEach(item => {
                totalViews += item.views || 0;
            });
        });

        return {
            blog: posts.length,
            video: videos.length,
            course: courses.length,
            book: books.length,
            paper: papers.length,
            totalViews: totalViews
        };
    }

    // ==================== CONTENT MANAGEMENT ====================

    async manageContent(contentType) {
        const container = document.getElementById('admin-content');
        const content = this.loadContent(contentType);
        
        container.innerHTML = `
            <div class="content-manager">
                <div class="manager-header">
                    <button onclick="adminPanel.renderDashboard()" class="btn-back">← Back</button>
                    <h2>Manage ${this.capitalizeFirst(contentType)} Content</h2>
                    <button onclick="adminPanel.addContent('${contentType}')" class="btn-primary">
                        ➕ Add New
                    </button>
                </div>

                <div class="content-filters">
                    <input type="text" 
                           id="content-search" 
                           placeholder="Search content..." 
                           oninput="adminPanel.filterContent('${contentType}')">
                    
                    <select onchange="adminPanel.sortContent('${contentType}', this.value)">
                        <option value="date-desc">Latest First</option>
                        <option value="date-asc">Oldest First</option>
                        <option value="views-desc">Most Views</option>
                        <option value="title-asc">Title A-Z</option>
                    </select>
                </div>

                <div class="content-list" id="content-list">
                    ${this.renderContentList(content, contentType)}
                </div>
            </div>
        `;
    }

    renderContentList(content, contentType) {
        if (!content || content.length === 0) {
            return `<div class="no-content">No ${contentType} content found. Add some!</div>`;
        }

        return content.map(item => `
            <div class="content-item" data-id="${item.id}">
                <div class="item-info">
                    ${item.coverImage ? `<img src="${item.coverImage}" alt="${item.title}">` : ''}
                    <div>
                        <h3>${item.title}</h3>
                        <p>${item.description?.substring(0, 100) || 'No description'}...</p>
                        <div class="item-meta">
                            <span>📅 ${new Date(item.date).toLocaleDateString()}</span>
                            <span>👁️ ${item.views || 0} views</span>
                            <span>❤️ ${item.likes || 0} likes</span>
                        </div>
                    </div>
                </div>
                <div class="item-actions">
                    <button onclick="adminPanel.editContent('${contentType}', '${item.id}')" 
                            class="btn-edit" title="Edit">
                        ✏️
                    </button>
                    <button onclick="adminPanel.duplicateContent('${contentType}', '${item.id}')" 
                            class="btn-duplicate" title="Duplicate">
                        📋
                    </button>
                    <button onclick="adminPanel.deleteContent('${contentType}', '${item.id}')" 
                            class="btn-delete" title="Delete">
                        🗑️
                    </button>
                </div>
            </div>
        `).join('');
    }

    // ==================== CRUD OPERATIONS ====================

    addContent(contentType) {
        const container = document.getElementById('admin-content');
        
        container.innerHTML = `
            <div class="content-editor">
                <div class="editor-header">
                    <button onclick="adminPanel.manageContent('${contentType}')" class="btn-back">← Cancel</button>
                    <h2>Add New ${this.capitalizeFirst(contentType)}</h2>
                    <button onclick="adminPanel.saveContent('${contentType}')" class="btn-primary">
                        💾 Save
                    </button>
                </div>

                <form id="content-form" class="editor-form">
                    ${this.getContentForm(contentType)}
                </form>
            </div>
        `;
    }

    getContentForm(contentType) {
        const commonFields = `
            <div class="form-group">
                <label for="title">Title *</label>
                <input type="text" id="title" required placeholder="Content title">
            </div>

            <div class="form-group">
                <label for="description">Description</label>
                <textarea id="description" rows="3" placeholder="Brief description"></textarea>
            </div>

            <div class="form-group">
                <label for="tags">Tags (comma separated)</label>
                <input type="text" id="tags" placeholder="Arduino, Tutorial, Beginner">
            </div>

            <div class="form-group">
                <label for="coverImage">Cover Image URL</label>
                <input type="text" id="coverImage" placeholder="/images/cover.jpg">
                <button type="button" onclick="adminPanel.uploadImage()" class="btn-secondary">
                    📤 Upload Image
                </button>
            </div>
        `;

        const specificFields = {
            blog: `
                <div class="form-group">
                    <label for="content">Content (Markdown) *</label>
                    <textarea id="content" rows="15" required placeholder="# Your content here\n\nWrite in Markdown..."></textarea>
                </div>
                <div class="form-group">
                    <label for="readingTime">Reading Time (minutes)</label>
                    <input type="number" id="readingTime" value="5">
                </div>
            `,
            video: `
                <div class="form-group">
                    <label for="videoUrl">YouTube Video URL *</label>
                    <input type="url" id="videoUrl" required placeholder="https://youtube.com/watch?v=...">
                </div>
                <div class="form-group">
                    <label for="duration">Duration</label>
                    <input type="text" id="duration" placeholder="10:30">
                </div>
            `,
            course: `
                <div class="form-group">
                    <label for="playlistUrl">YouTube Playlist URL *</label>
                    <input type="url" id="playlistUrl" required>
                </div>
                <div class="form-group">
                    <label for="videoCount">Number of Videos</label>
                    <input type="number" id="videoCount" value="1">
                </div>
            `,
            book: `
                <div class="form-group">
                    <label for="pdfUrl">PDF File URL *</label>
                    <input type="text" id="pdfUrl" required>
                    <button type="button" onclick="adminPanel.uploadPDF()" class="btn-secondary">
                        📤 Upload PDF
                    </button>
                </div>
                <div class="form-group">
                    <label for="pages">Number of Pages</label>
                    <input type="number" id="pages">
                </div>
                <div class="form-group">
                    <label for="fileSize">File Size</label>
                    <input type="text" id="fileSize" placeholder="2.5 MB">
                </div>
            `,
            paper: `
                <div class="form-group">
                    <label for="pdfUrl">PDF File URL *</label>
                    <input type="text" id="pdfUrl" required>
                    <button type="button" onclick="adminPanel.uploadPDF()" class="btn-secondary">
                        📤 Upload PDF
                    </button>
                </div>
                <div class="form-group">
                    <label for="authors">Authors</label>
                    <input type="text" id="authors" placeholder="John Doe, Jane Smith">
                </div>
                <div class="form-group">
                    <label for="institution">Institution</label>
                    <input type="text" id="institution">
                </div>
                <div class="form-group">
                    <label for="year">Publication Year</label>
                    <input type="number" id="year" value="2026">
                </div>
            `
        };

        return `${commonFields}${specificFields[contentType] || ''}`;
    }

    saveContent(contentType) {
        const form = document.getElementById('content-form');
        const formData = new FormData(form);
        
        const content = {
            id: Date.now().toString(),
            title: formData.get('title') || document.getElementById('title').value,
            description: formData.get('description') || document.getElementById('description').value,
            tags: (document.getElementById('tags').value || '').split(',').map(t => t.trim()),
            coverImage: document.getElementById('coverImage').value,
            date: new Date().toISOString(),
            views: 0,
            likes: 0,
            type: contentType
        };

        // Add type-specific fields
        if (contentType === 'blog') {
            content.content = document.getElementById('content').value;
            content.readingTime = document.getElementById('readingTime').value;
        } else if (contentType === 'video') {
            content.videoUrl = document.getElementById('videoUrl').value;
            content.duration = document.getElementById('duration').value;
        } else if (contentType === 'course') {
            content.playlistUrl = document.getElementById('playlistUrl').value;
            content.videoCount = document.getElementById('videoCount').value;
        } else if (contentType === 'book' || contentType === 'paper') {
            content.pdfUrl = document.getElementById('pdfUrl').value;
            content.pages = document.getElementById('pages')?.value;
            content.fileSize = document.getElementById('fileSize')?.value;
            
            if (contentType === 'paper') {
                content.authors = document.getElementById('authors').value;
                content.institution = document.getElementById('institution').value;
                content.year = document.getElementById('year').value;
            }
        }

        // Save to localStorage
        const key = this.getStorageKey(contentType);
        const existing = JSON.parse(localStorage.getItem(key) || '[]');
        existing.push(content);
        localStorage.setItem(key, JSON.stringify(existing));

        // Show success and go back
        this.showNotification('✅ Content saved successfully!', 'success');
        setTimeout(() => this.manageContent(contentType), 1000);
    }

    deleteContent(contentType, contentId) {
        if (!confirm('Are you sure you want to delete this content?')) return;

        const key = this.getStorageKey(contentType);
        const content = JSON.parse(localStorage.getItem(key) || '[]');
        const filtered = content.filter(item => item.id !== contentId);
        
        localStorage.setItem(key, JSON.stringify(filtered));
        this.showNotification('🗑️ Content deleted', 'info');
        this.manageContent(contentType);
    }

    // ==================== HELPER FUNCTIONS ====================

    loadContent(contentType) {
        const key = this.getStorageKey(contentType);
        return JSON.parse(localStorage.getItem(key) || '[]');
    }

    getStorageKey(contentType) {
        const keys = {
            blog: 'blog_posts',
            video: 'video_content',
            course: 'educational_videos',
            book: 'books_pdfs',
            paper: 'research_papers'
        };
        return keys[contentType] || contentType;
    }

    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `admin-notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 100);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    setupEventListeners() {
        // Add any global event listeners here
    }

    // Quick actions
    createNewPost() { this.addContent('blog'); }
    uploadFile() { alert('File upload feature - integrate with your file hosting'); }
    generateRSS() { 
        if (window.rssGenerator) {
            rssGenerator.generateAllFeeds();
            this.showNotification('✅ RSS feeds generated!', 'success');
        }
    }
    backupData() {
        const data = {};
        this.contentTypes.forEach(type => {
            data[type] = this.loadContent(type);
        });
        
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `backup_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        this.showNotification('💾 Backup downloaded!', 'success');
    }
    clearCache() {
        if (confirm('Clear all cached data? This will refresh the site.')) {
            caches.keys().then(keys => {
                keys.forEach(key => caches.delete(key));
            });
            this.showNotification('🗑️ Cache cleared!', 'success');
            setTimeout(() => location.reload(), 1500);
        }
    }
}

// Initialize
window.adminPanel = new AdminPanel();

console.log('🔧 Admin Panel Loaded');
