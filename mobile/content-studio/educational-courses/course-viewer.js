// ============================================================================
// COURSE VIEWER - Educational Course Player (Mobile)
// Loads course from content.json and displays playlist with video player
// ============================================================================

(function() {
    'use strict';

    // ========== STATE ==========
    let allCourses = [];
    let currentCourse = null;
    let currentVideoIndex = 0;

    // ========== DOM ELEMENTS ==========
    const videoContainer = document.getElementById('videoContainer');
    const courseInfo = document.getElementById('courseInfo');
    const playlistSection = document.getElementById('playlistSection');
    const shareBtn = document.getElementById('shareBtn');

    // ========== INITIALIZATION ==========
    document.addEventListener('DOMContentLoaded', () => {
        loadCoursesFromJSON();
    });

    /**
     * Load courses from central content.json
     */
    async function loadCoursesFromJSON() {
        try {
            const response = await fetch('../../../Content Code/content.json');
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const data = await response.json();
            allCourses = data['educational-courses'] || [];
            console.log(`📚 Loaded ${allCourses.length} courses`);
            
            loadCourse();
        } catch (error) {
            console.error('❌ Failed to load courses:', error);
            showError('Failed to load course. Please check your connection.');
        }
    }

    /**
     * Get course ID from URL parameters
     */
    function getCourseIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id') || 'course-001';
    }

    /**
     * Load and render the current course
     */
    function loadCourse() {
        const courseId = getCourseIdFromUrl();
        currentCourse = allCourses.find(c => c.id === courseId);

        if (!currentCourse) {
            showError('Course not found');
            console.error(`❌ Course not found: ${courseId}`);
            return;
        }

        console.log(`📖 Loading course: ${currentCourse.title}`);

        // Load first video if playlist exists
        if (currentCourse.playlist && currentCourse.playlist.length > 0) {
            loadVideo(0);
        } else {
            showNoVideos();
        }

        renderCourseInfo();
        renderPlaylist();
        setupEventListeners();
    }

    /**
     * Load video by index
     */
    function loadVideo(index) {
        if (!currentCourse.playlist || currentCourse.playlist.length === 0) {
            showNoVideos();
            return;
        }

        currentVideoIndex = index;
        const video = currentCourse.playlist[index];

        videoContainer.innerHTML = `
            <iframe 
                src="https://www.youtube.com/embed/${video.videoId}?autoplay=1&rel=0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen>
            </iframe>
        `;
    }

    /**
     * Show no videos message
     */
    function showNoVideos() {
        videoContainer.innerHTML = `
            <div class="loading">
                <i class="fas fa-video-slash" style="font-size: 48px; color: #ff9800; margin-bottom: 16px;"></i>
                <p style="color: var(--text-dim);">Course videos coming soon...</p>
            </div>
        `;
    }

    /**
     * Render course information
     */
    function renderCourseInfo() {
        const languageDisplay = getLanguageDisplay(currentCourse.language);
        
        courseInfo.innerHTML = `
            <h1 class="course-title">${currentCourse.title}</h1>
            <div class="course-stats">
                <span><i class="fas fa-video"></i> ${currentCourse.episodes} episodes</span>
                <span><i class="fas fa-clock"></i> ${currentCourse.duration}</span>
                <span><i class="fas fa-signal"></i> ${currentCourse.difficulty}</span>
                <span><i class="fas fa-language"></i> ${languageDisplay}</span>
            </div>
            <p class="course-desc">${currentCourse.description}</p>
            ${currentCourse.instructor ? `
            <div style="margin-top: 12px; padding: 12px; background: rgba(255, 152, 0, 0.05); border-radius: 8px; border: 1px solid rgba(255, 152, 0, 0.2);">
                <span style="font-size: 12px; color: var(--text-dim); display: block; margin-bottom: 4px;">Instructor</span>
                <strong style="color: #ff9800; font-size: 14px;">${currentCourse.instructor}</strong>
                ${currentCourse.institution ? `<span style="color: var(--text-dim); font-size: 12px; margin-left: 8px;">• ${currentCourse.institution}</span>` : ''}
            </div>
            ` : ''}
        `;
    }

    /**
     * Render playlist
     */
    function renderPlaylist() {
        if (!currentCourse.playlist || currentCourse.playlist.length === 0) {
            playlistSection.innerHTML = `
                <h3>Course Content</h3>
                <div style="text-align: center; padding: 40px 20px; color: var(--text-dim);">
                    <i class="fas fa-list-ul" style="font-size: 32px; margin-bottom: 12px; display: block;"></i>
                    <p>Course episodes will be added soon</p>
                </div>
            `;
            return;
        }

        playlistSection.innerHTML = `
            <h3>Course Playlist (${currentCourse.playlist.length} videos)</h3>
            ${currentCourse.playlist.map((video, idx) => `
                <div class="playlist-item ${idx === currentVideoIndex ? 'active' : ''}" data-index="${idx}">
                    <div class="playlist-thumb">
                        <img src="https://img.youtube.com/vi/${video.videoId}/default.jpg" 
                             alt="${video.title}"
                             onerror="this.style.display='none'">
                    </div>
                    <div class="playlist-info">
                        <h4>${video.episodeNo}. ${video.title}</h4>
                        <p><i class="fas fa-clock"></i> ${video.duration}</p>
                    </div>
                </div>
            `).join('')}
        `;

        addPlaylistListeners();
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
     * Show error message
     */
    function showError(message) {
        videoContainer.innerHTML = `
            <div class="loading">
                <i class="fas fa-exclamation-circle" style="font-size: 56px; color: var(--primary-red); margin-bottom: 20px;"></i>
                <h3>Oops!</h3>
                <p style="color: var(--text-dim); margin-bottom: 20px;">${message}</p>
                <a href="course-listing.html" style="display: inline-block; padding: 10px 20px; background: var(--primary-red); color: #fff; border-radius: 8px; text-decoration: none; font-weight: 600;">
                    Back to Courses
                </a>
            </div>
        `;
    }

    /**
     * Add playlist item event listeners
     */
    function addPlaylistListeners() {
        document.querySelectorAll('.playlist-item').forEach(item => {
            item.addEventListener('click', () => {
                const index = parseInt(item.getAttribute('data-index'));
                loadVideo(index);
                renderPlaylist();
                if (navigator.vibrate) navigator.vibrate(10);
            });

            item.addEventListener('touchstart', () => {
                if (navigator.vibrate) navigator.vibrate(10);
            });
        });
    }

    /**
     * Handle share button
     */
    function handleShare() {
        if (navigator.vibrate) navigator.vibrate(10);

        if (navigator.share && currentCourse) {
            navigator.share({
                title: currentCourse.title,
                text: `Check out this course: ${currentCourse.title}`,
                url: window.location.href
            }).catch(err => {
                console.log('Share cancelled or failed:', err);
            });
        } else {
            showToast('Sharing...');
        }
    }

    /**
     * Show toast notification
     */
    function showToast(msg) {
        const toast = document.createElement('div');
        toast.textContent = msg;
        toast.style.cssText = 'position:fixed;bottom:90px;left:50%;transform:translateX(-50%);padding:12px 24px;background:rgba(255,152,0,0.95);color:#fff;border-radius:8px;font-size:13px;font-weight:600;z-index:10000;';
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2000);
    }

    /**
     * Setup event listeners
     */
    function setupEventListeners() {
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

})();
