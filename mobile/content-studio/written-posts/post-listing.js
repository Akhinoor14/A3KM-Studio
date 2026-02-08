// ============================================================================
// POST LISTING - Written Posts Section (Mobile)
// Displays blog posts and articles from content.json
// Fetches data from central content.json
// ============================================================================

(function() {
    'use strict';

    // ========== STATE ==========
    let allPosts = [];
    let currentFilter = 'all';
    let searchQuery = '';

    // ========== DOM ELEMENTS ==========
    const postsGrid = document.getElementById('postsGrid');
    const searchInput = document.getElementById('searchInput');
    const emptyState = document.getElementById('emptyState');
    const filterChips = document.querySelectorAll('.filter-chip');

    // ========== INITIALIZATION ==========
    document.addEventListener('DOMContentLoaded', () => {
        loadPostsFromJSON();
        setupEventListeners();
    });

    /**
     * Load posts from central content.json
     */
    async function loadPostsFromJSON() {
        try {
            showLoadingState();
            
            const response = await fetch('../../../Content Code/content.json');
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            const data = await response.json();
            allPosts = data['written-posts'] || [];
            
            console.log(`📝 Loaded ${allPosts.length} posts from content.json`);
            
            hideLoadingState();
            renderPosts();
            
        } catch (error) {
            console.error('❌ Failed to load posts:', error);
            showErrorState();
        }
    }

    /**
     * Show loading spinner
     */
    function showLoadingState() {
        if (postsGrid) {
            postsGrid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
                    <div style="display: inline-block; width: 50px; height: 50px; border: 4px solid rgba(139, 0, 0, 0.2); border-top-color: var(--primary-red); border-radius: 50%; animation: spin 1s linear infinite;"></div>
                    <p style="margin-top: 20px; color: var(--text-secondary); font-size: 0.95rem;">Loading posts...</p>
                </div>
            `;
        }
    }

    /**
     * Hide loading state
     */
    function hideLoadingState() {
        // Loading UI will be replaced by renderPosts()
    }

    /**
     * Show error message
     */
    function showErrorState() {
        if (postsGrid) {
            postsGrid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: var(--primary-red); margin-bottom: 20px;"></i>
                    <p style="color: var(--text-primary); font-size: 1.1rem; margin-bottom: 10px;">Failed to load posts</p>
                    <p style="color: var(--text-secondary); font-size: 0.9rem;">Please check your connection and try again</p>
                    <button onclick="location.reload()" style="margin-top: 20px; padding: 12px 24px; background: var(--primary-red); color: white; border: none; border-radius: 8px; font-size: 0.95rem; cursor: pointer;">
                        <i class="fas fa-redo"></i> Retry
                    </button>
                </div>
            `;
        }
    }

    /**
     * Setup event listeners
     */
    function setupEventListeners() {
        // Search input
        if (searchInput) {
            let searchTimeout;
            searchInput.addEventListener('input', (e) => {
                searchQuery = e.target.value.toLowerCase();
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    renderPosts();
                }, 300);
            });
        }
        
        // Filter chips
        filterChips.forEach(chip => {
            chip.addEventListener('click', () => {
                // Haptic feedback
                if (navigator.vibrate) {
                    navigator.vibrate(10);
                }
                
                // Update active state
                filterChips.forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                
                // Update filter
                currentFilter = chip.dataset.filter;
                renderPosts();
            });
        });
    }

    /**
     * Filter and search posts
     */
    function filterPosts() {
        let filtered = allPosts;
        
        // Language filter
        if (currentFilter !== 'all') {
            filtered = filtered.filter(post => {
                if (currentFilter === 'bangla') return post.language === 'bn' || post.language === 'bn-en';
                if (currentFilter === 'english') return post.language === 'en' || post.language === 'en-bn';
                return true;
            });
        }
        
        // Search query
        if (searchQuery) {
            filtered = filtered.filter(post => {
                return post.title.toLowerCase().includes(searchQuery) ||
                       post.description.toLowerCase().includes(searchQuery) ||
                       post.tags.some(tag => tag.toLowerCase().includes(searchQuery)) ||
                       post.subcategory.toLowerCase().includes(searchQuery);
            });
        }
        
        return filtered;
    }

    /**
     * Render posts to grid
     */
    function renderPosts() {
        const filtered = filterPosts();
        
        if (filtered.length === 0) {
            postsGrid.innerHTML = '';
            if (emptyState) {
                emptyState.style.display = 'block';
            }
            return;
        }

        if (emptyState) {
            emptyState.style.display = 'none';
        }

        postsGrid.innerHTML = filtered.map(post => `
            <a href="post-reader.html?id=${post.id}" class="content-item post-item">
                <div class="content-thumbnail post-thumbnail">
                    ${post.thumbnail ? 
                        `<img src="${post.thumbnail}" alt="${post.title}" loading="lazy" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">` : 
                        `<i class="${post.icon || 'fas fa-file-alt'}" style="display:flex;"></i>`
                    }
                    <span class="post-language">${getLanguageDisplay(post.language)}</span>
                </div>
                <div class="content-info-wrap">
                    <h3 class="content-item-title">${post.title}</h3>
                    <div class="content-item-meta">
                        <span class="read-time"><i class="fas fa-clock"></i> ${post.readingTime}</span>
                        <span><i class="fas fa-calendar"></i> ${formatDate(post.publishDate)}</span>
                    </div>
                    <p class="content-item-desc">${truncateText(post.description, 120)}</p>
                    <div class="content-tags">
                        ${post.tags.slice(0, 4).map(tag => `<span class="content-tag">${tag}</span>`).join('')}
                    </div>
                </div>
            </a>
        `).join('');

        // Add animation to newly rendered items
        setTimeout(() => {
            const items = document.querySelectorAll('.post-item');
            items.forEach((item, index) => {
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, index * 50);
            });
        }, 10);

        addHapticFeedback();
    }

    /**
     * Get language display badge
     */
    function getLanguageDisplay(lang) {
        const map = {
            'bn': '🇧🇩 বাং',
            'en': '🇬🇧 EN',
            'bn-en': '🇧🇩 EN',
            'en-bn': '🇬🇧 বাং'
        };
        return map[lang] || 'EN';
    }

    /**
     * Format date to relative time
     */
    function formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 7) {
            return diffDays === 1 ? '1 day ago' : `${diffDays} days ago`;
        } else if (diffDays < 30) {
            const weeks = Math.floor(diffDays / 7);
            return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
        } else if (diffDays < 365) {
            const months = Math.floor(diffDays / 30);
            return months === 1 ? '1 month ago' : `${months} months ago`;
        } else {
            const years = Math.floor(diffDays / 365);
            return years === 1 ? '1 year ago' : `${years} years ago`;
        }
    }

    /**
     * Truncate text to specified length
     */
    function truncateText(text, length) {
        if (text.length <= length) return text;
        return text.substring(0, length).trim() + '...';
    }

    /**
     * Add haptic feedback to items
     */
    function addHapticFeedback() {
        const items = document.querySelectorAll('.post-item');
        items.forEach(item => {
            item.addEventListener('touchstart', () => {
                if (navigator.vibrate) {
                    navigator.vibrate(10);
                }
            }, { passive: true });
        });
    }

})();
