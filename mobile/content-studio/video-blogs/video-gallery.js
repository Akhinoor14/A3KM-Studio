// ============================================================================
// VIDEO GALLERY - Video Blogs Listing (Mobile)
// Displays YouTube video content with search, filter, sort, and view toggle
// Fetches data from central content.json
// ============================================================================

(function() {
    'use strict';

    // ========== STATE ==========
    let allVideos = [];
    let searchQuery = '';
    let currentCategory = 'all';
    let currentSort = 'newest';
    let currentView = 'grid';
    let categories = [];

    // ========== DOM ELEMENTS ==========
    const searchInput = document.getElementById('contentSearch');
    const contentGrid = document.getElementById('contentGrid');
    const emptyState = document.getElementById('emptyState');
    const categoryTabs = document.getElementById('categoryTabs');
    const sortBtn = document.getElementById('sortBtn');
    const sortLabel = document.getElementById('sortLabel');
    const sortOverlay = document.getElementById('sortOverlay');
    const gridViewBtn = document.getElementById('gridViewBtn');
    const listViewBtn = document.getElementById('listViewBtn');

    // ========== INITIALIZATION ==========
    document.addEventListener('DOMContentLoaded', () => {
        loadVideosFromJSON();
        setupEventListeners();
    });

    /**
     * Load videos directly from videos.json (just like desktop!)
     * This ensures mobile automatically shows new videos without manual sync
     */
    async function loadVideosFromJSON() {
        try {
            showLoadingState();
            
            // ✅ Load directly from desktop JSON file
            const response = await fetch('../../../Content Studio/video-content/videos.json');
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            const data = await response.json();
            
            // Extract videos from all categories
            allVideos = [];
            if (data.categories && data.categories['video-blog']) {
                Object.values(data.categories['video-blog']).forEach(category => {
                    if (category.videos && Array.isArray(category.videos)) {
                        allVideos.push(...category.videos);
                    }
                });
            }
            if (data.categories && data.categories['educational']) {
                Object.values(data.categories['educational']).forEach(category => {
                    if (category.videos && Array.isArray(category.videos)) {
                        allVideos.push(...category.videos);
                    }
                });
            }
            
            // Extract unique categories
            const uniqueCategories = [...new Set(allVideos.map(v => v.subcategory || v.category))].filter(Boolean).sort();
            categories = ['All', ...uniqueCategories];
            
            console.log(`📺 Loaded ${allVideos.length} videos from videos.json`);
            console.log(`📂 Categories: ${categories.join(', ')}`);
            
            // Enhance videos with YouTube data in background
            console.log('🔍 Checking for YouTube API fetcher...');
            console.log(`window.youtubeFetcher exists: ${!!window.youtubeFetcher}`);
            console.log(`allVideos.length: ${allVideos.length}`);
            
            if (window.youtubeFetcher && allVideos.length > 0) {
                console.log('✅ Starting YouTube data enhancement...');
                console.log(`First video to enhance: ${allVideos[0].title} (ID: ${allVideos[0].videoId})`);
                
                window.youtubeFetcher.enhanceMultipleVideos(allVideos).then(enhanced => {
                    console.log('✅ Enhancement complete, updating video list...');
                    allVideos = enhanced;
                    console.log(`Sample enhanced video: ${enhanced[0].title} - Views: ${enhanced[0].views}, Duration: ${enhanced[0].duration}`);
                    renderVideos(); // Re-render with enhanced data
                }).catch(err => {
                    console.error('❌ Enhancement failed:', err);
                    console.error('Error stack:', err.stack);
                });
            } else {
                if (!window.youtubeFetcher) {
                    console.error('❌ window.youtubeFetcher is not available!');
                }
                if (allVideos.length === 0) {
                    console.warn('⚠️ No videos loaded to enhance');
                }
            }
            
            hideLoadingState();
            renderCategoryTabs();
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
        // Search input
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                searchQuery = e.target.value.toLowerCase();
                renderVideos();
            });
        }
        
        // Sort button - opens bottom sheet
        if (sortBtn) {
            sortBtn.addEventListener('click', () => {
                sortOverlay.classList.add('active');
            });
        }
        
        // Close sort overlay when clicking outside
        if (sortOverlay) {
            sortOverlay.addEventListener('click', (e) => {
                if (e.target === sortOverlay) {
                    sortOverlay.classList.remove('active');
                }
            });
        }
        
        // Sort options
        document.querySelectorAll('.sort-option').forEach(option => {
            option.addEventListener('click', () => {
                const sortType = option.dataset.sort;
                currentSort = sortType;
                
                // Update active state
                document.querySelectorAll('.sort-option').forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
                
                // Update button label
                const sortLabels = {
                    'newest': 'Newest First',
                    'oldest': 'Oldest First',
                    'title': 'Title (A-Z)'
                };
                sortLabel.textContent = sortLabels[sortType];
                
                // Close overlay and re-render
                sortOverlay.classList.remove('active');
                renderVideos();
            });
        });
        
        // View toggle buttons
        if (gridViewBtn) {
            gridViewBtn.addEventListener('click', () => {
                currentView = 'grid';
                gridViewBtn.classList.add('active');
                listViewBtn.classList.remove('active');
                contentGrid.classList.remove('list-view');
            });
        }
        
        if (listViewBtn) {
            listViewBtn.addEventListener('click', () => {
                currentView = 'list';
                listViewBtn.classList.add('active');
                gridViewBtn.classList.remove('active');
                contentGrid.classList.add('list-view');
            });
        }
    }

    /**
     * Render category tabs
     */
    function renderCategoryTabs() {
        if (!categoryTabs || categories.length === 0) return;
        
        const icons = {
            'All': 'fa-th',
            'Tour & Vlogs': 'fa-map',
            'Food & Lifestyle': 'fa-utensils',
            'Tech Reviews': 'fa-laptop',
            'Daily Life': 'fa-home',
            'Poetry': 'fa-book',
            'default': 'fa-folder'
        };
        
        categoryTabs.innerHTML = categories.map(cat => {
            const icon = icons[cat] || icons['default'];
            const isActive = currentCategory === (cat === 'All' ? 'all' : cat);
            return `
                <button class="category-tab ${isActive ? 'active' : ''}" data-category="${cat === 'All' ? 'all' : cat}">
                    <i class="fas ${icon}"></i>
                    ${cat}
                </button>
            `;
        }).join('');
        
        // Add event listeners to category tabs
        document.querySelectorAll('.category-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                const category = tab.dataset.category;
                currentCategory = category;
                
                // Update active state
                document.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                // Re-render videos
                renderVideos();
            });
        });
        
        // Setup scroll indicator for category tabs
        setupCategoryScrollIndicator();
    }
    
    /**
     * Setup category tabs scroll fade indicators
     */
    function setupCategoryScrollIndicator() {
        const scrollContainer = document.querySelector('.category-tabs-scroll');
        if (!scrollContainer) return;
        
        function updateScrollIndicators() {
            const scrollLeft = scrollContainer.scrollLeft;
            const scrollWidth = scrollContainer.scrollWidth;
            const clientWidth = scrollContainer.clientWidth;
            const maxScroll = scrollWidth - clientWidth;
            
            // Remove all scroll state classes
            scrollContainer.classList.remove('scrollable', 'scroll-start', 'scroll-middle', 'scroll-end');
            
            // Check if scrollable
            if (scrollWidth > clientWidth) {
                scrollContainer.classList.add('scrollable');
                
                // Determine scroll position
                if (scrollLeft <= 5) {
                    scrollContainer.classList.add('scroll-start');
                } else if (scrollLeft >= maxScroll - 5) {
                    scrollContainer.classList.add('scroll-end');
                } else {
                    scrollContainer.classList.add('scroll-middle');
                }
            }
        }
        
        // Update on scroll
        scrollContainer.addEventListener('scroll', updateScrollIndicators);
        
        // Update on load
        setTimeout(updateScrollIndicators, 100);
        
        // Update on window resize
        window.addEventListener('resize', updateScrollIndicators);
    }

    /**
     * Filter videos based on search query and category
     */
    function filterVideos() {
        let filtered = allVideos;
        
        // Filter by category
        if (currentCategory !== 'all') {
            filtered = filtered.filter(video => video.subcategory === currentCategory);
        }
        
        // Filter by search query
        if (searchQuery) {
            filtered = filtered.filter(video => {
                return video.title.toLowerCase().includes(searchQuery) ||
                       video.description.toLowerCase().includes(searchQuery) ||
                       video.tags.some(tag => tag.toLowerCase().includes(searchQuery)) ||
                       video.subcategory.toLowerCase().includes(searchQuery);
            });
        }
        
        return filtered;
    }

    /**
     * Sort videos based on current sort option
     */
    function sortVideos(videos) {
        const sorted = [...videos];
        
        switch(currentSort) {
            case 'newest':
                sorted.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));
                break;
            case 'oldest':
                sorted.sort((a, b) => new Date(a.publishDate) - new Date(b.publishDate));
                break;
            case 'title':
                sorted.sort((a, b) => a.title.localeCompare(b.title));
                break;
        }
        
        return sorted;
    }

    /**
     * Render videos to the grid
     */
    function renderVideos() {
        const filtered = filterVideos();
        const sorted = sortVideos(filtered);
        
        if (sorted.length === 0) {
            contentGrid.innerHTML = '';
            if (emptyState) {
                emptyState.style.display = 'block';
            }
            return;
        }

        if (emptyState) {
            emptyState.style.display = 'none';
        }

        contentGrid.innerHTML = sorted.map(video => {
            const viewsText = video.views && video.views > 0 
                ? (window.youtubeFetcher?.formatViews(video.views) || `${video.views} views`)
                : '';
            
            const likesText = video.likes && video.likes > 0
                ? (window.youtubeFetcher?.formatLikes(video.likes) || video.likes)
                : '';
            
            return `
            <a href="video-viewer.html?id=${video.id}" class="content-item">
                <div class="content-thumbnail">
                    <img src="${video.thumbnail}" alt="${video.title}" loading="lazy" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
                    <i class="fab fa-youtube" style="display:none; font-size: 48px; color: #CC0000;"></i>
                    <span class="content-duration">${video.duration || 'N/A'}</span>
                </div>
                <div class="content-info-wrap">
                    <h3 class="content-item-title">${video.title}</h3>
                    <div class="content-item-meta">
                        <span><i class="fas fa-folder"></i> ${video.subcategory}</span>
                        <span><i class="fas fa-calendar"></i> ${formatDate(video.publishDate)}</span>
                    </div>
                    ${(viewsText || likesText) ? `
                    <div class="content-stats" style="display: flex; gap: 12px; margin: 6px 0; font-size: 0.75rem; color: rgba(255,255,255,0.6);">
                        ${viewsText ? `<span><i class="fas fa-eye"></i> ${viewsText}</span>` : ''}
                        ${likesText ? `<span><i class="fas fa-thumbs-up"></i> ${likesText}</span>` : ''}
                    </div>
                    ` : ''}
                    <p class="content-item-desc">${truncateText(video.description, 120)}</p>
                    <div class="content-tags">
                        ${video.tags.slice(0, 4).map(tag => `<span class="content-tag">${tag}</span>`).join('')}
                    </div>
                </div>
            </a>
            `;
        }).join('');

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
