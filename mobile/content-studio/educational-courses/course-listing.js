// ============================================================================
// COURSE LISTING - Educational Courses Section (Mobile)
// Loads courses from content.json and displays with filters
// ============================================================================

(function() {
    'use strict';

    // ========== STATE ==========
    let allCourses = [];
    let currentLevel = 'all';

    // ========== DOM ELEMENTS ==========
    const searchInput = document.getElementById('searchInput');
    const contentGrid = document.getElementById('contentGrid');
    const levelFilters = document.querySelectorAll('.filter-chip');

    // ========== INITIALIZATION ==========
    document.addEventListener('DOMContentLoaded', () => {
        loadCoursesFromJSON();
    });

    /**
     * Load courses from central content.json
     */
    async function loadCoursesFromJSON() {
        try {
            showLoadingState();
            
            const response = await fetch('../../../Content Code/content.json');
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const data = await response.json();
            allCourses = data['educational-courses'] || [];
            console.log(`📚 Loaded ${allCourses.length} courses`);
            
            hideLoadingState();
            renderCourses(allCourses);
        } catch (error) {
            console.error('❌ Failed to load courses:', error);
            hideLoadingState();
            showErrorState('Failed to load courses. Please check your connection.');
        }
    }

    /**
     * Show loading state
     */
    function showLoadingState() {
        contentGrid.innerHTML = `
            <div class="loading-state">
                <div class="loading-spinner"></div>
                <p>Loading courses...</p>
            </div>
        `;
    }

    /**
     * Hide loading state
     */
    function hideLoadingState() {
        const loadingState = contentGrid.querySelector('.loading-state');
        if (loadingState) loadingState.remove();
    }

    /**
     * Show error state
     */
    function showErrorState(message) {
        contentGrid.innerHTML = `
            <div class="error-state">
                <i class="fas fa-exclamation-circle"></i>
                <h3>Oops!</h3>
                <p>${message}</p>
                <button onclick="location.reload()" class="retry-btn">
                    <i class="fas fa-redo"></i> Try Again
                </button>
            </div>
        `;
    }


    // ========== RENDER FUNCTIONS ==========
    function renderCourses(coursesToRender) {
        if (coursesToRender.length === 0) {
            contentGrid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-graduation-cap"></i>
                    <h3>No Courses Found</h3>
                    <p>Try adjusting your search or filter</p>
                </div>
            `;
            return;
        }

        contentGrid.innerHTML = coursesToRender.map(course => {
            const difficultyClass = getDifficultyClass(course.difficulty);
            const languageDisplay = getLanguageDisplay(course.language);
            
            return `
            <a href="course-viewer.html?id=${course.id}" class="content-item course-item">
                <div class="content-thumbnail course-thumbnail">
                    <img src="${course.thumbnail}" alt="${course.title}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
                    <i class="fas fa-play-circle" style="display:none;"></i>
                    <span class="course-badge">${languageDisplay}</span>
                </div>
                <div class="content-info-wrap">
                    <span class="course-level ${difficultyClass}">${course.difficulty}</span>
                    <h3 class="content-item-title">${course.title}</h3>
                    <div class="content-item-meta">
                        <span><i class="fas fa-video"></i> ${course.episodes} episodes</span>
                        <span><i class="fas fa-clock"></i> ${course.duration}</span>
                    </div>
                    <p class="content-item-desc">${truncateText(course.description, 120)}</p>
                    <div class="content-tags">
                        ${course.tags.slice(0, 4).map(tag => `<span class="content-tag">${tag}</span>`).join('')}
                    </div>
                    ${course.enrolled > 0 ? `
                    <div class="course-stats">
                        <span class="stat-item">
                            <i class="fas fa-users"></i>
                            ${course.enrolled} enrolled
                        </span>
                        ${course.rating > 0 ? `
                        <span class="stat-item">
                            <i class="fas fa-star"></i>
                            ${course.rating} rating
                        </span>
                        ` : ''}
                    </div>
                    ` : ''}
                </div>
            </a>
            `;
        }).join('');

        // Add haptic feedback
        addHapticFeedback();
    }

    /**
     * Get difficulty CSS class
     */
    function getDifficultyClass(difficulty) {
        const lower = difficulty.toLowerCase();
        if (lower.includes('beginner')) return 'beginner';
        if (lower.includes('intermediate')) return 'intermediate';
        if (lower.includes('advanced')) return 'advanced';
        return 'beginner';
    }

    /**
     * Get language display badge
     */
    function getLanguageDisplay(lang) {
        const displays = {
            'bn': '🇧🇩 বাং',
            'en': '🇬🇧 EN',
            'bn-en': '🇧🇩 EN',
            'en-bn': '🇬🇧 বাং'
        };
        return displays[lang] || 'EN';
    }

    /**
     * Truncate text to specified length
     */
    function truncateText(text, maxLength) {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength).trim() + '...';
    }

    /**
     * Format date for display
     */
    function formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    }


    // ========== FILTER & SEARCH FUNCTIONALITY ==========
    function filterAndSearchCourses() {
        const query = searchInput.value.toLowerCase().trim();

        let filtered = allCourses;

        // Level filter
        if (currentLevel !== 'all') {
            filtered = filtered.filter(course => {
                const difficulty = course.difficulty.toLowerCase();
                return difficulty.includes(currentLevel);
            });
        }

        // Search query
        if (query) {
            filtered = filtered.filter(course => {
                return course.title.toLowerCase().includes(query) ||
                       course.description.toLowerCase().includes(query) ||
                       course.category.toLowerCase().includes(query) ||
                       course.tags.some(tag => tag.toLowerCase().includes(query));
            });
        }

        // Sort by date (newest first)
        filtered.sort((a, b) => {
            return new Date(b.publishDate) - new Date(a.publishDate);
        });

        renderCourses(filtered);
    }

    /**
     * Setup event listeners
     */
    function setupEventListeners() {
        // Search functionality with debounce
        let searchTimeout;
        searchInput.addEventListener('input', () => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(filterAndSearchCourses, 300);
        });

        // Level filter
        const filterContainer = document.getElementById('levelFilters');
        if (filterContainer) {
            filterContainer.addEventListener('click', handleLevelFilter);
        }

        // Back button haptic feedback
        const backBtn = document.querySelector('.back-btn');
        if (backBtn) {
            backBtn.addEventListener('touchstart', () => {
                if (navigator.vibrate) navigator.vibrate(10);
            });
        }
    }

    // ========== HELPER FUNCTIONS ==========
    function addHapticFeedback() {
        const courseItems = document.querySelectorAll('.course-item');
        courseItems.forEach(item => {
            item.addEventListener('touchstart', () => {
                if (navigator.vibrate) {
                    navigator.vibrate(10);
                }
            });
        });
    }

    // ========== EVENT HANDLERS ==========
    function handleLevelFilter(e) {
        const chip = e.target.closest('.filter-chip');
        if (!chip) return;

        // Haptic feedback
        if (navigator.vibrate) {
            navigator.vibrate(10);
        }

        // Update active state
        levelFilters.forEach(f => f.classList.remove('active'));
        chip.classList.add('active');

        // Update current level
        currentLevel = chip.getAttribute('data-level');

        // Re-render
        filterAndSearchCourses();
    }

    // Setup after data loads
    setTimeout(setupEventListeners, 100);

})();
