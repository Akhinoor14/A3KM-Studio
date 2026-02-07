// ============================================================================
// VIDEO GALLERY - Video Blogs Listing (Mobile)
// Displays YouTube video content with search functionality
// Fetches data from central content.json
// ============================================================================

(function() {
    'use strict';

    // ========== STATE ==========
    let allVideos = [];
    let searchQuery = '';

    // ========== DOM ELEMENTS ==========
    const searchInput = document.getElementById('contentSearch');
    const contentGrid = document.getElementById('contentGrid');
    const emptyState = document.getElementById('emptyState');

    // ========== INITIALIZATION ==========
    document.addEventListener('DOMContentLoaded', () => {
        loadVideosFromJSON();
        setupEventListeners();
    });

    /**
     * Load videos from central content.json
     */
    async function loadVideosFromJSON() {
        try {
            showLoadingState();
            
            const response = await fetch('../../../Content Code/content.json');
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            const data = await response.json();
            allVideos = data['video-blogs'] || [];
            
            console.log(`📺 Loaded ${allVideos.length} videos from content.json`);
            console.log(`📊 Total content: ${data.statistics.totalContent} items`);
            
            hideLoadingState();
            renderVideos();
            
        } catch (error) {
            console.error('❌ Failed to load videos:', error);
            showErrorState();
        }
    }

    /**
     * Show loading spinner
     */
    function showLoadingState() {
        if (contentGrid) {
            contentGrid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
                    <div style="display: inline-block; width: 50px; height: 50px; border: 4px solid rgba(204, 0, 0, 0.2); border-top-color: var(--primary-red); border-radius: 50%; animation: spin 1s linear infinite;"></div>
                    <p style="margin-top: 20px; color: var(--text-secondary); font-size: 0.95rem;">Loading videos...</p>
                </div>
            `;
        }
    }

    /**
     * Hide loading state
     */
    function hideLoadingState() {
        // Loading UI will be replaced by renderVideos()
    }

    /**
     * Show error message
     */
    function showErrorState() {
        if (contentGrid) {
            contentGrid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: var(--primary-red); margin-bottom: 20px;"></i>
                    <p style="color: var(--text-primary); font-size: 1.1rem; margin-bottom: 10px;">Failed to load videos</p>
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
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                searchQuery = e.target.value.toLowerCase();
                renderVideos();
            });
        }
    }

    /**
     * Filter videos based on search query
     */
    function filterVideos() {
        if (!searchQuery) {
            return allVideos;
        }
        
        return allVideos.filter(video => {
            return video.title.toLowerCase().includes(searchQuery) ||
                   video.description.toLowerCase().includes(searchQuery) ||
                   video.tags.some(tag => tag.toLowerCase().includes(searchQuery)) ||
                   video.subcategory.toLowerCase().includes(searchQuery);
        });
    }

    /**
     * Render videos to the grid
     */
    function renderVideos() {
        const filtered = filterVideos();
        
        if (filtered.length === 0) {
            contentGrid.innerHTML = '';
            if (emptyState) {
                emptyState.style.display = 'block';
            }
            return;
        }

        if (emptyState) {
            emptyState.style.display = 'none';
        }

        contentGrid.innerHTML = filtered.map(video => `
            <a href="video-viewer.html?id=${video.id}" class="content-item">
                <div class="content-thumbnail">
                    <img src="${video.thumbnail}" alt="${video.title}" loading="lazy" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
                    <i class="fab fa-youtube" style="display:none; font-size: 48px; color: rgba(255,0,0,0.6);"></i>
                    <span class="content-duration">${video.duration}</span>
                    ${video.language === 'bn' ? '<span class="content-language">🇧🇩 বাংলা</span>' : ''}
                </div>
                <div class="content-info-wrap">
                    <h3 class="content-item-title">${video.title}</h3>
                    <div class="content-item-meta">
                        <span><i class="fas fa-folder"></i> ${video.subcategory}</span>
                        <span><i class="fas fa-calendar"></i> ${formatDate(video.publishDate)}</span>
                    </div>
                    <p class="content-item-desc">${truncateText(video.description, 120)}</p>
                    <div class="content-tags">
                        ${video.tags.slice(0, 4).map(tag => `<span class="content-tag">${tag}</span>`).join('')}
                    </div>
                </div>
            </a>
        `).join('');

        // Add animation to newly rendered items
        setTimeout(() => {
            const items = document.querySelectorAll('.content-item');
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
        const items = document.querySelectorAll('.content-item');
        items.forEach(item => {
            item.addEventListener('touchstart', () => {
                if (navigator.vibrate) {
                    navigator.vibrate(10);
                }
            }, { passive: true });
        });
    }

})();
