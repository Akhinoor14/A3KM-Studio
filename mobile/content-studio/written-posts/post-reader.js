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
     * Load posts from central content.json
     */
    async function loadPostsFromJSON() {
        try {
            const response = await fetch('../../../Content Code/content.json');
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const data = await response.json();
            allPosts = data['written-posts'] || [];
            console.log(`📝 Loaded ${allPosts.length} posts`);
            
            loadPost();
        } catch (error) {
            console.error('❌ Failed to load posts:', error);
            showError('Failed to load posts. Please check your connection.');
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
            // Fetch markdown content
            const mdResponse = await fetch(currentPost.mdFilePath);
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
     * Convert markdown to HTML
     */
    function markdownToHTML(markdown) {
        let html = markdown;

        // Code blocks (must be before inline code)
        html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
            return `<pre><code class="language-${lang || 'plaintext'}">${escapeHtml(code.trim())}</code></pre>`;
        });

        // Headers (must be on new lines)
        html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
        html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
        html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

        // Bold
        html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/__(.*?)__/g, '<strong>$1</strong>');

        // Italic
        html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
        html = html.replace(/_(.*?)_/g, '<em>$1</em>');

        // Links
        html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');

        // Images
        html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" loading="lazy">');

        // Inline code
        html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

        // Blockquotes
        html = html.replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>');

        // Unordered lists
        html = html.replace(/^\- (.*$)/gim, '<ul><li>$1</li></ul>');
        html = html.replace(/^\* (.*$)/gim, '<ul><li>$1</li></ul>');
        
        // Ordered lists
        html = html.replace(/^\d+\. (.*$)/gim, '<ol><li>$1</li></ol>');

        // Horizontal rules
        html = html.replace(/^---$/gim, '<hr>');
        html = html.replace(/^\*\*\*$/gim, '<hr>');

        // Line breaks and paragraphs
        html = html.split('\n\n').map(block => {
            // Skip if already wrapped in HTML tag
            if (block.trim().startsWith('<')) return block;
            // Wrap in paragraph
            return `<p>${block.trim()}</p>`;
        }).join('\n');

        // Merge consecutive list items
        html = html.replace(/<\/ul>\s*<ul>/g, '');
        html = html.replace(/<\/ol>\s*<ol>/g, '');
        html = html.replace(/<\/blockquote>\s*<blockquote>/g, ' ');

        return html;
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
        const formattedDate = formatDate(currentPost.publishDate);
        
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
            </footer>
        `;

        // Attach share button listeners
        addShareListeners();
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

})();
