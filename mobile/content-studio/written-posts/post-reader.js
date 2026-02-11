// ============================================================================
// POST READER - Article/Post Viewer with Markdown Rendering (Mobile)
// Loads posts from content.json and renders markdown files
// ============================================================================

(function() {
    'use strict';

    // ========== STATE ==========
    let allPosts = [];
    let currentPost = null;

    // ========== DOM ELEMENTS ==========
    const articleContainer = document.getElementById('articleContainer');

    // ========== INITIALIZATION ==========
    document.addEventListener('DOMContentLoaded', () => {
        loadPostsFromJSON();
    });

    /**
     * Load posts from GitHub posts.json + localStorage + Cloud
     */
    async function loadPostsFromJSON() {
        try {
            // 🚀 STEP 1: Pull latest posts from GitHub Cloud (get posts from other devices!)
            await syncFromGitHubCloud();
            
            // STEP 2: Load posts from GitHub posts.json (Professional Manager)
            const response = await fetch('../../../Content Studio/written-posts/posts.json');
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const data = await response.json();
            allPosts = data.posts || [];
            
            // STEP 3: Load posts from localStorage (Quick Post Creator!)
            const localPosts = JSON.parse(localStorage.getItem('a3km_posts') || '[]');
            
            if (localPosts.length > 0) {
                console.log(`✅ Found ${localPosts.length} posts from Quick Post Creator!`);
                
                // Normalize and merge with existing posts (avoid duplicates)
                localPosts.forEach(localPost => {
                    const normalized = normalizeLocalPost(localPost);
                    const exists = allPosts.find(p => p.id === normalized.id);
                    if (!exists) {
                        allPosts.push(normalized);
                    }
                });
            }
            
            console.log(`📝 Loaded ${allPosts.length} posts (GitHub + localStorage + Cloud)`);
            
            loadPost();
        } catch (error) {
            console.error('❌ Failed to load posts:', error);
            showError('Failed to load posts. Please check your connection.');
        }
    }

    /**
     * 🚀 NEW: Sync posts from GitHub Cloud to localStorage
     * This ensures posts created on other devices appear automatically!
     */
    async function syncFromGitHubCloud() {
        try {
            const token = localStorage.getItem('github_api_token');
            if (!token) {
                console.log('⚠️ No GitHub token - skipping cloud sync');
                return;
            }

            console.log('⬇️  Syncing posts from cloud...');
            
            const owner = 'Akhinoor14';
            const repo = 'A3KM-Studio';
            const path = 'Content Studio/written-posts/posts.json';
            const url = `https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}`;
            
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                const content = atob(data.content);
                const githubPosts = JSON.parse(content);
                
                // Merge with localStorage
                const localPosts = JSON.parse(localStorage.getItem('a3km_posts') || '[]');
                const localIds = new Set(localPosts.map(p => p.id));
                
                let newCount = 0;
                if (githubPosts.posts && Array.isArray(githubPosts.posts)) {
                    githubPosts.posts.forEach(post => {
                        if (!localIds.has(post.id)) {
                            localPosts.push(post);
                            newCount++;
                        }
                    });
                }
                
                if (newCount > 0) {
                    localStorage.setItem('a3km_posts', JSON.stringify(localPosts));
                    console.log(`✅ Synced ${newCount} new posts from cloud to mobile viewer!`);
                } else {
                    console.log('✅ Mobile viewer already up to date with cloud');
                }
            }
        } catch (error) {
            console.error('⚠️ Cloud sync failed:', error);
            // Don't block page load if sync fails
        }
    }


    /**
     * Get post ID from URL parameters
     */
    function getPostIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id') || 'post-welcome-001';
    }

    /**
     * Load and render the current post
     */
    async function loadPost() {
        const postId = getPostIdFromUrl();
        currentPost = allPosts.find(p => p.id === postId);

        if (!currentPost) {
            showError('Post not found');
            console.error(`❌ Post not found: ${postId}`);
            return;
        }

        console.log(`📖 Loading post: ${currentPost.title}`);
        
        try {
            // Check if post is from localStorage (has inline content or _source flag)
            const isLocalStoragePost = currentPost._source === 'localStorage' || 
                                       (currentPost.content && !currentPost.content.startsWith('../../'));
            
            if (isLocalStoragePost) {
                console.log(`💾 Rendering localStorage post: ${currentPost.id}`);
                
                // For localStorage posts, content is already HTML or plain text
                const htmlContent = currentPost.content || currentPost.summary || 'No content available';
                
                // Simple markdown-like conversion if it's plain text
                let processedContent = htmlContent;
                if (!htmlContent.includes('<')) {
                    processedContent = simpleMarkdownToHTML(htmlContent);
                }
                
                renderPost(processedContent);
                checkBookmarkState();
                return;
            }

            // For GitHub posts, fetch markdown file
            const mdPath = currentPost.content || currentPost.contentPath || currentPost.markdownFile;
            if (!mdPath) {
                throw new Error('Missing markdown path for GitHub post');
            }
            
            console.log(`📄 Fetching markdown from: ${mdPath}`);
            const mdResponse = await fetch(`../../../${mdPath}`);
            if (!mdResponse.ok) throw new Error(`Failed to load markdown: ${mdResponse.status}`);
            
            const markdownContent = await mdResponse.text();
            console.log(`✅ Loaded ${markdownContent.length} chars of markdown`);
            
            // Convert markdown to HTML
            const htmlContent = markdownToHTML(markdownContent);
            
            // Render post
            renderPost(htmlContent);
            
            // Check bookmark status
            checkBookmarkState();
            
        } catch (error) {
            console.error('❌ Failed to load post content:', error);
            showError('Failed to load post content. Please try again.');
        }
    }
    
    /**
     * Simple markdown to HTML converter for localStorage posts
     */
    function simpleMarkdownToHTML(text) {
        let html = text;
        
        // Convert line breaks to paragraphs
        html = html.split('\n\n').map(para => `<p>${para.replace(/\n/g, '<br>')}</p>`).join('');
        
        // Bold
        html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        
        // Italic
        html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
        
        // Links
        html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
        
        // Images
        html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width: 100%; border-radius: 8px; margin: 15px 0;">');
        
        // Code blocks
        html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>');
        
        // Inline code
        html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
        
        return html;
    }

    /**
     * Convert markdown to HTML using advanced viewer
     */
    function markdownToHTML(markdown) {
        // Use the new markdown viewer with full features
        return renderMarkdown(markdown, {
            generateTOC: true,
            syntaxHighlight: true,
            showLineNumbers: true,
            copyButton: true,
            sanitize: true,
            theme: 'dark-red'
        });
    }

    /**
     * Escape HTML special characters
     */
    function escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }

    /**
     * Render post content with header and footer
     */
    function renderPost(htmlContent) {
        const languageDisplay = getLanguageDisplay(currentPost.language);
        const formattedDate = formatDate(currentPost.publishDate || currentPost.date);
        
        // Generate Table of Contents
        const tocHtml = generateTOC();
        
        articleContainer.innerHTML = `
            <section class="article-header">
                <span class="article-category">${currentPost.category || 'Tutorial'}</span>
                <h1 class="article-title">${currentPost.title}</h1>
                <div class="article-meta">
                    <span><i class="fas fa-clock"></i> ${currentPost.readingTime}</span>
                    <span><i class="fas fa-calendar"></i> ${formattedDate}</span>
                    <span><i class="fas fa-language"></i> ${languageDisplay}</span>
                </div>
            </section>
            
            ${tocHtml}
            
            <div class="article-content">
                ${htmlContent}
            </div>
            
            <footer class="article-footer">
                <div class="article-tags">
                    ${currentPost.tags.map(tag => `<span class="article-tag">${tag}</span>`).join('')}
                </div>
                <div class="share-section">
                    <span class="share-label">${currentPost.language === 'bn' ? 'এই আর্টিকেলটি শেয়ার করুন' : 'Share this article'}</span>
                    <div class="share-buttons">
                        <button class="share-btn" data-platform="facebook"><i class="fab fa-facebook-f"></i></button>
                        <button class="share-btn" data-platform="twitter"><i class="fab fa-twitter"></i></button>
                        <button class="share-btn" data-platform="whatsapp"><i class="fab fa-whatsapp"></i></button>
                        <button class="share-btn" data-platform="copy"><i class="fas fa-link"></i></button>
                    </div>
                </div>
                
                <!-- Post Navigation -->
                <nav class="post-navigation" id="postNavigation">
                    <div class="nav-header">
                        <span class="nav-title">📖 More Articles</span>
                        <span class="keyboard-hint" id="keyboardBadge">
                            <i class="fas fa-keyboard"></i>
                            <span id="articleCounter">Article</span>
                        </span>
                    </div>
                    <div class="nav-buttons">
                        <a href="#" class="nav-btn" id="prevPost">
                            <span class="nav-btn-label">
                                <i class="fas fa-arrow-left"></i>
                                Previous Article
                            </span>
                            <span class="nav-btn-text" id="prevPostTitle">Title</span>
                        </a>
                        <a href="#" class="nav-btn" id="nextPost">
                            <span class="nav-btn-label">
                                Next Article
                                <i class="fas fa-arrow-right"></i>
                            </span>
                            <span class="nav-btn-text" id="nextPostTitle">Title</span>
                        </a>
                    </div>
                </nav>
            </footer>
        `;

        // Attach share button listeners
        addShareListeners();
        
        // Setup navigation
        setupNavigation();
        
        // Add smooth scroll for TOC links
        document.querySelectorAll('.md-toc-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').slice(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    if (navigator.vibrate) navigator.vibrate(10);
                }
            });
        });
    }

    function normalizeLocalPost(post) {
        const fallbackText = stripHtml(post.content || post.summary || '');
        const words = fallbackText.trim().split(/\s+/).filter(Boolean);
        const readTime = post.readTime || Math.max(1, Math.ceil(words.length / 200));

        return {
            id: post.id,
            title: post.title || 'Untitled Post',
            description: post.summary || fallbackText || 'No description available',
            mdFilePath: post.mdFilePath || '',
            thumbnail: post.coverImage || '',
            readingTime: `${readTime} min`,
            publishDate: post.date || new Date().toISOString().split('T')[0],
            language: post.language || 'en',
            tags: Array.isArray(post.tags) ? post.tags : [],
            icon: 'fa-pen-fancy',
            content: post.content
        };
    }

    function stripHtml(html) {
        const div = document.createElement('div');
        div.innerHTML = html;
        return div.textContent || div.innerText || '';
    }

    /**
     * Get language display text
     */
    function getLanguageDisplay(lang) {
        const displays = {
            'bn': '🇧🇩 বাংলা',
            'en': '🇬🇧 English',
            'bn-en': '🇧🇩 বাংলা + 🇬🇧 English',
            'en-bn': '🇬🇧 English + 🇧🇩 বাংলা'
        };
        return displays[lang] || 'English';
    }

    /**
     * Format date for display
     */
    function formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }

    /**
     * Show error message
     */
    function showError(message) {
        articleContainer.innerHTML = `
            <div style="text-align: center; padding: 40px 20px;">
                <i class="fas fa-exclamation-circle" style="font-size: 48px; color: #e74c3c; margin-bottom: 20px;"></i>
                <h2 style="color: #333; margin-bottom: 10px;">Oops!</h2>
                <p style="color: #666;">${message}</p>
                <button onclick="location.reload()" style="margin-top: 20px; padding: 10px 20px; background: var(--primary-color); color: white; border: none; border-radius: 8px; cursor: pointer;">
                    <i class="fas fa-redo"></i> Try Again
                </button>
            </div>
        `;
    }

    // ========== BOOKMARK & SHARE FUNCTIONALITY ==========
    const bookmarkBtn = document.getElementById('bookmarkBtn');
    const shareBtn = document.getElementById('shareBtn');
    let isBookmarked = false;


    /**
     * Toggle bookmark state
     */
    function toggleBookmark() {
        isBookmarked = !isBookmarked;
        bookmarkBtn.style.color = isBookmarked ? '#ffc107' : 'var(--primary-red)';
        if (navigator.vibrate) navigator.vibrate(isBookmarked ? 30 : 10);
        localStorage.setItem(`post_${currentPost.id}_bookmarked`, isBookmarked);
    }

    /**
     * Check if post is bookmarked
     */
    function checkBookmarkState() {
        if (!currentPost) return;
        isBookmarked = localStorage.getItem(`post_${currentPost.id}_bookmarked`) === 'true';
        if (isBookmarked) bookmarkBtn.style.color = '#ffc107';
    }

    /**
     * Handle main share button
     */
    function handleShare() {
        if (navigator.vibrate) navigator.vibrate(10);
        if (navigator.share) {
            navigator.share({
                title: currentPost.title,
                text: `Read: ${currentPost.title}`,
                url: window.location.href
            }).catch(() => copyToClipboard(window.location.href));
        } else {
            copyToClipboard(window.location.href);
        }
    }

    /**
     * Handle platform-specific sharing
     */
    function handlePlatformShare(platform) {
        if (navigator.vibrate) navigator.vibrate(10);
        
        const url = encodeURIComponent(window.location.href);
        const title = encodeURIComponent(currentPost.title);
        
        const shareUrls = {
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
            twitter: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
            whatsapp: `https://wa.me/?text=${title}%20${url}`,
            copy: null
        };

        if (platform === 'copy') {
            copyToClipboard(window.location.href);
        } else if (shareUrls[platform]) {
            window.open(shareUrls[platform], '_blank', 'noopener,noreferrer');
        }
    }

    /**
     * Copy text to clipboard
     */
    function copyToClipboard(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            showToast('Link copied!');
        } catch (err) {
            console.error('Copy failed:', err);
        }
        document.body.removeChild(textarea);
    }

    /**
     * Show toast notification
     */
    function showToast(msg) {
        const toast = document.createElement('div');
        toast.textContent = msg;
        toast.style.cssText = 'position:fixed;bottom:90px;left:50%;transform:translateX(-50%);padding:12px 24px;background:rgba(139,0,0,0.95);color:#fff;border-radius:8px;font-size:13px;font-weight:600;z-index:10000;';
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2000);
    }

    /**
     * Add event listeners to share buttons
     */
    function addShareListeners() {
        const shareButtons = document.querySelectorAll('.share-btn');
        shareButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const platform = btn.getAttribute('data-platform');
                handlePlatformShare(platform);
            });
        });
    }

    /**
     * Setup event listeners
     */
    function setupEventListeners() {
        // Bookmark button
        if (bookmarkBtn) {
            bookmarkBtn.addEventListener('click', toggleBookmark);
            bookmarkBtn.addEventListener('touchstart', () => {
                if (navigator.vibrate) navigator.vibrate(10);
            });
        }

        // Share button
        if (shareBtn) {
            shareBtn.addEventListener('click', handleShare);
            shareBtn.addEventListener('touchstart', () => {
                if (navigator.vibrate) navigator.vibrate(10);
            });
        }

        // Back button haptic
        const backBtn = document.querySelector('.back-btn');
        if (backBtn) {
            backBtn.addEventListener('touchstart', () => {
                if (navigator.vibrate) navigator.vibrate(10);
            });
        }
    }

    // Setup listeners after DOM ready
    setTimeout(setupEventListeners, 100);

    /**
     * Setup Navigation between posts
     */
    function setupNavigation() {
        const postNavigation = document.getElementById('postNavigation');
        if (!postNavigation || !allPosts || allPosts.length === 0) {
            console.log('⚠️ Navigation not available');
            return;
        }

        // Sort posts by ID (post-001, post-002, etc.)
        const sortedPosts = allPosts
            .filter(p => p.id && p.id.startsWith('post-'))
            .sort((a, b) => {
                const numA = parseInt(a.id.replace('post-', ''));
                const numB = parseInt(b.id.replace('post-', ''));
                return numA - numB;
            });

        if (sortedPosts.length === 0) {
            console.log('⚠️ No posts found for navigation');
            return;
        }

        const currentIndex = sortedPosts.findIndex(p => p.id === currentPost.id);
        if (currentIndex === -1) {
            console.log('⚠️ Current post not found in sorted list');
            return;
        }

        const prevPost = currentIndex > 0 ? sortedPosts[currentIndex - 1] : null;
        const nextPost = currentIndex < sortedPosts.length - 1 ? sortedPosts[currentIndex + 1] : null;

        // Update counter in keyboard badge
        const keyboardBadge = document.getElementById('articleCounter');
        if (keyboardBadge) {
            keyboardBadge.textContent = `Article ${currentIndex + 1}/${sortedPosts.length}`;
        }

        // Setup previous button
        const prevBtn = document.getElementById('prevPost');
        const prevTitle = document.getElementById('prevPostTitle');
        if (prevPost && prevBtn && prevTitle) {
            prevBtn.href = `post-reader.html?id=${prevPost.id}`;
            prevTitle.textContent = prevPost.title;
            prevBtn.classList.remove('disabled');
            
            // Add haptic feedback for mobile
            prevBtn.addEventListener('touchstart', () => {
                if (navigator.vibrate) navigator.vibrate(10);
            });
        } else if (prevBtn) {
            prevBtn. classList.add('disabled');
            prevBtn.href = '#';
        }

        // Setup next button
        const nextBtn = document.getElementById('nextPost');
        const nextTitle = document.getElementById('nextPostTitle');
        if (nextPost && nextBtn && nextTitle) {
            nextBtn.href = `post-reader.html?id=${nextPost.id}`;
            nextTitle.textContent = nextPost.title;
            nextBtn.classList.remove('disabled');
            
            // Add haptic feedback for mobile
            nextBtn.addEventListener('touchstart', () => {
                if (navigator.vibrate) navigator.vibrate(10);
            });
        } else if (nextBtn) {
            nextBtn.classList.add('disabled');
            nextBtn.href = '#';
        }

        // Show navigation
        postNavigation.classList.add('active');

        // Setup keyboard navigation
        setupKeyboardNavigation(prevPost, nextPost);

        console.log(`📍 Post ${currentIndex + 1}/${sortedPosts.length}: ${currentPost.title}`);
        console.log(`⬅️ Previous: ${prevPost ? prevPost.title : 'None'}`);
        console.log(`➡️ Next: ${nextPost ? nextPost.title : 'None'}`);
    }

    /**
     * Setup keyboard shortcuts for navigation
     */
    function setupKeyboardNavigation(prevPost, nextPost) {
        document.addEventListener('keydown', (e) => {
            // Left arrow - Previous post
            if (e.key === 'ArrowLeft' && prevPost) {
                e.preventDefault();
                if (navigator.vibrate) navigator.vibrate(10);
                window.location.href = `post-reader.html?id=${prevPost.id}`;
            }
            
            // Right arrow - Next post
            if (e.key === 'ArrowRight' && nextPost) {
                e.preventDefault();
                if (navigator.vibrate) navigator.vibrate(10);
                window.location.href = `post-reader.html?id=${nextPost.id}`;
            }
        });
    }

})();
