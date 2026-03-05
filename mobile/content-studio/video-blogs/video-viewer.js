// ============================================================================
// VIDEO VIEWER - Individual Video Player (Mobile)
// Displays YouTube video with details and related content
// Fetches data from central content.json
// ============================================================================

(function() {
    'use strict';

    // ========== STATE ==========
    let allVideos = [];
    let currentVideo = null;
    let isLiked = false;
    let isSaved = false;

    // ========== DOM ELEMENTS ==========
    const videoPlayerContainer = document.getElementById('videoPlayerContainer');
    const videoInfo = document.getElementById('videoInfo');
    const actionButtons = document.getElementById('actionButtons');
    const descriptionSection = document.getElementById('descriptionSection');
    const relatedSection = document.getElementById('relatedSection');
    const descriptionText = document.getElementById('descriptionText');
    const expandBtn = document.getElementById('expandBtn');
    const likeBtn = document.getElementById('likeBtn');
    const shareBtn = document.getElementById('shareBtn');
    const saveBtn = document.getElementById('saveBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const relatedList = document.getElementById('relatedList');

    // ========== LOAD VIDEOS FROM JSON ==========
    async function loadVideosFromJSON() {
        try {
            const response = await fetch('../../../Content%20Studio/video-content/videos.json');
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
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
            
            console.log(`📺 Loaded ${allVideos.length} videos`);
            
            loadVideo();
        } catch (error) {
            console.error('❌ Failed to load videos:', error);
            document.getElementById('videoInfo').innerHTML = `
                <div style="padding: 40px; text-align: center;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: var(--primary-red);"></i>
                    <p style="margin-top: 20px;">Failed to load video data</p>
                    <button onclick="location.reload()" style="margin-top: 15px; padding: 10px 20px; background: var(--primary-red); border: none; border-radius: 6px; color: white; cursor: pointer;">Retry</button>
                </div>
            `;
        }
    }

    // ========== GET VIDEO ID FROM URL ==========
    function getVideoIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id') || allVideos[0]?.id; // Default to first video ID
    }

    // ========== LOAD VIDEO ==========
    async function loadVideo() {
        const videoId = getVideoIdFromUrl();
        currentVideo = allVideos.find(v => v.id === videoId);

        if (!currentVideo) {
            videoInfo.innerHTML = `
                <div style="padding: 40px 20px; text-align: center;">
                    <i class="fas fa-exclamation-circle" style="font-size: 48px; color: var(--primary-red); margin-bottom: 16px;"></i>
                    <h3>Video Not Found</h3>
                    <p style="color: var(--text-dim); margin-top: 8px;">The video you're looking for doesn't exist.</p>
                    <a href="video-gallery.html" style="display: inline-block; margin-top: 16px; padding: 10px 20px; background: var(--primary-red); color: #fff; border-radius: 8px; text-decoration: none; font-weight: 600;">Back to Gallery</a>
                </div>
            `;
            return;
        }

        // Enhance video with YouTube data
        if (window.youtubeFetcher && currentVideo.videoId) {
            console.log('🔄 Fetching YouTube data for video...');
            currentVideo = await window.youtubeFetcher.enhanceVideoData(currentVideo);
            console.log('✅ Video enhanced with YouTube data', currentVideo);
        }

        // Load YouTube player
        loadYouTubePlayer(currentVideo.videoId);

        // Render video info
        renderVideoInfo();

        // Render related videos
        renderRelatedVideos();

        // Show sections
        actionButtons.style.display = 'grid';
        descriptionSection.style.display = 'block';
        relatedSection.style.display = 'block';

        // Check saved state from localStorage
        checkSavedState();

        // Set MediaSession metadata + PiP title
        if (typeof window._setPipMeta === 'function') {
            window._setPipMeta(
                currentVideo.title,
                currentVideo.thumbnail || ''
            );
        }

        // ── Build Prev/Next navigation (same subcategory) ──────────────────
        (function buildNavigation() {
            var sub      = currentVideo.subcategory || '';
            var catList  = sub
                ? allVideos.filter(function(v) { return v.subcategory === sub; })
                : allVideos;
            var catIdx   = catList.findIndex(function(v) { return v.id === currentVideo.id; });
            var isPrevOff = catIdx <= 0;
            var isNextOff = catIdx < 0 || catIdx >= catList.length - 1;

            var navigate = function(targetId) {
                var s = (typeof window._getPlayerState === 'function')
                    ? window._getPlayerState() : 'normal';
                if (s !== 'normal') sessionStorage.setItem('vpRestoreState', s);
                document.body.style.transition = 'opacity 0.18s ease';
                document.body.style.opacity    = '0';
                setTimeout(function() {
                    location.href = 'video-viewer.html?id=' + targetId;
                }, 190);
            };

            window._prevVideo = isPrevOff ? null
                : function() { navigate(catList[catIdx - 1].id); };
            window._nextVideo = isNextOff ? null
                : function() { navigate(catList[catIdx + 1].id); };

            (function applyNavBtns() {
                if (typeof window._updateNavBtns === 'function') {
                    window._updateNavBtns(isPrevOff, isNextOff);
                } else {
                    setTimeout(applyNavBtns, 200);
                }
            })();
        })();
    }

    // ========== LOAD YOUTUBE PLAYER (via IFrame API gesture engine) ==========
    function loadYouTubePlayer(videoId) {
        if (typeof window._initYTPlayer === 'function') {
            // Gesture engine is ready — delegate to it
            window._initYTPlayer(videoId);
        } else {
            // IFrame API not yet ready — wait and retry
            const poll = setInterval(() => {
                if (typeof window._initYTPlayer === 'function') {
                    clearInterval(poll);
                    window._initYTPlayer(videoId);
                }
            }, 150);
            // Fallback: if still not ready after 5 s, embed raw iframe
            setTimeout(() => {
                clearInterval(poll);
                if (!videoPlayerContainer.querySelector('iframe, [id^="ytPlayer"]>iframe')) {
                    videoPlayerContainer.innerHTML = `
                        <iframe
                            src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowfullscreen></iframe>`;
                }
            }, 5000);
        }
    }

    // ========== RENDER VIDEO INFO ==========
    function renderVideoInfo() {
        // Format views and likes
        const viewsText = currentVideo.views && currentVideo.views > 0 
            ? window.youtubeFetcher?.formatViews(currentVideo.views) || `${currentVideo.views} views`
            : 'N/A';
        
        const likesText = currentVideo.likes && currentVideo.likes > 0
            ? window.youtubeFetcher?.formatLikes(currentVideo.likes) || currentVideo.likes
            : '0';
        
        videoInfo.innerHTML = `
            <h1 class="video-title">${currentVideo.title}</h1>
            <div class="video-meta">
                <span><i class="fas fa-folder"></i> ${currentVideo.subcategory}</span>
                <span><i class="fas fa-calendar"></i> ${formatDate(currentVideo.publishDate)}</span>
                <span><i class="fas fa-clock"></i> ${currentVideo.duration || 'N/A'}</span>
            </div>
            ${(currentVideo.views > 0 || currentVideo.likes > 0) ? `
            <div class="video-stats" style="display: flex; gap: 16px; padding: 12px 0; border-top: 1px solid rgba(204,0,0,0.2); border-bottom: 1px solid rgba(204,0,0,0.2); margin: 12px 0;">
                <span style="display: flex; align-items: center; gap: 6px; color: rgba(255,255,255,0.8); font-size: 0.85rem;">
                    <i class="fas fa-eye" style="color: #CC0000;"></i> ${viewsText}
                </span>
                <span style="display: flex; align-items: center; gap: 6px; color: rgba(255,255,255,0.8); font-size: 0.85rem;">
                    <i class="fas fa-thumbs-up" style="color: #CC0000;"></i> ${likesText}
                </span>
            </div>
            </div>
            ` : ''}
            <div class="video-tags">
                ${currentVideo.tags.map(tag => `<span class="video-tag">${tag}</span>`).join('')}
            </div>
        `;

        descriptionText.textContent = currentVideo.description;
    }

    // ========== RENDER RELATED VIDEOS ==========
    async function renderRelatedVideos() {
        // Show other videos except current one
        let relatedVideos = allVideos.filter(v => v.id !== currentVideo.id).slice(0, 5);

        // Enhance related videos with YouTube data
        if (window.youtubeFetcher && relatedVideos.length > 0) {
            console.log('🔄 Enhancing related videos with YouTube data...');
            try {
                relatedVideos = await window.youtubeFetcher.enhanceMultipleVideos(relatedVideos);
                console.log('✅ Related videos enhanced:', relatedVideos.map(v => ({ id: v.id, duration: v.duration, enhanced: v.apiEnhanced })));
            } catch (err) {
                console.warn('⚠️ Failed to enhance related videos:', err);
            }
        }

        relatedList.innerHTML = relatedVideos.map(video => {
            // Use enhanced duration if available, fallback to original
            const displayDuration = video.apiEnhanced && video.duration 
                ? video.duration 
                : (video.duration || 'N/A');
            
            // Format views if available
            const viewsText = video.views && video.views > 0 
                ? (window.youtubeFetcher?.formatViews(video.views) || `${video.views} views`)
                : '';
            
            // Construct YouTube thumbnail URL as fallback
            const thumbnailUrl = video.thumbnail || (video.videoId ? `https://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg` : '');
            
            return `
                <a href="video-viewer.html?id=${video.id}" class="related-item">
                    <div class="related-thumb">
                        <img src="${thumbnailUrl}" alt="${video.title}" onerror="this.style.display='none'">
                        <i class="fab fa-youtube"></i>
                        <span class="related-duration">${displayDuration}</span>
                    </div>
                    <div class="related-info">
                        <h4>${video.title}</h4>
                        <p>${formatDate(video.publishDate)}${viewsText ? ' • ' + viewsText : ''}</p>
                    </div>
                </a>
            `;
        }).join('');

        addRelatedVideoHaptic();
    }

    // ========== EVENT HANDLERS ==========
    function handleLike() {
        isLiked = !isLiked;
        likeBtn.classList.toggle('liked', isLiked);
        likeBtn.querySelector('span').textContent = isLiked ? 'Liked' : 'Like';

        // Pulse animation on the icon
        const icon = likeBtn.querySelector('i');
        icon.style.transition = 'transform 0.15s ease';
        icon.style.transform = 'scale(1.45)';
        setTimeout(() => { icon.style.transform = 'scale(1)'; }, 180);

        // Haptic feedback
        if (navigator.vibrate) navigator.vibrate(isLiked ? [15, 10, 15] : 10);

        // Persist to localStorage
        localStorage.setItem(`video_${currentVideo.id}_liked`, isLiked);

        if (isLiked) showToast('Appreciated! ❤️');
    }

    function handleShare() {
        if (navigator.share) {
            navigator.share({
                title: currentVideo.title,
                text: `Check out this video: ${currentVideo.title}`,
                url: window.location.href
            }).catch(() => {
                // Fallback: copy to clipboard
                copyToClipboard(window.location.href);
            });
        } else {
            copyToClipboard(window.location.href);
        }
    }

    function handleSave() {
        isSaved = !isSaved;
        saveBtn.classList.toggle('liked', isSaved);
        saveBtn.querySelector('span').textContent = isSaved ? 'Saved' : 'Save';
        
        // Save to localStorage
        localStorage.setItem(`video_${currentVideo.id}_saved`, isSaved);
    }

    function handleDownload() {
        // Open video on YouTube
        const url = currentVideo.youtubeUrl ||
            (currentVideo.videoId ? `https://www.youtube.com/watch?v=${currentVideo.videoId}` : null);
        if (url) {
            window.open(url, '_blank');
        } else {
            showToast('YouTube link not available');
        }
    }

    function toggleDescription() {
        const isExpanded = descriptionText.classList.toggle('expanded');
        expandBtn.textContent = isExpanded ? 'Show Less' : 'Show More';
        
        if (navigator.vibrate) navigator.vibrate(10);
    }

    // ========== HELPER FUNCTIONS ==========
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

    function copyToClipboard(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        
        try {
            document.execCommand('copy');
            showToast('Link copied to clipboard!');
        } catch (err) {
            console.error('Copy failed:', err);
        }
        
        document.body.removeChild(textarea);
    }

    function showToast(message) {
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 90px;
            left: 50%;
            transform: translateX(-50%);
            padding: 12px 24px;
            background: rgba(204, 0, 0, 0.95);
            color: #fff;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 600;
            z-index: 10000;
            animation: fadeInOut 2s ease;
        `;
        
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2000);
    }

    function checkSavedState() {
        // Restore like/appreciate state
        isLiked = localStorage.getItem(`video_${currentVideo.id}_liked`) === 'true';
        if (isLiked && likeBtn) {
            likeBtn.classList.add('liked');
            likeBtn.querySelector('span').textContent = 'Liked';
        }

        // Restore saved state
        isSaved = localStorage.getItem(`video_${currentVideo.id}_saved`) === 'true';
        if (isSaved && saveBtn) {
            saveBtn.classList.add('liked');
            saveBtn.querySelector('span').textContent = 'Saved';
        }
    }

    function addRelatedVideoHaptic() {
        const relatedItems = document.querySelectorAll('.related-item');
        relatedItems.forEach(item => {
            item.addEventListener('touchstart', () => {
                if (navigator.vibrate) navigator.vibrate(10);
            });
        });
    }

    function addActionButtonHaptics() {
        [likeBtn, shareBtn, saveBtn, downloadBtn].forEach(btn => {
            btn.addEventListener('touchstart', () => {
                if (navigator.vibrate) navigator.vibrate(10);
            });
        });
    }

    // ========== INITIALIZATION ==========
    function init() {
        // Load videos from JSON then render current video
        loadVideosFromJSON();

        // Event listeners (if elements exist)
        if (likeBtn) likeBtn.addEventListener('click', handleLike);
        if (shareBtn) shareBtn.addEventListener('click', handleShare);
        if (saveBtn) saveBtn.addEventListener('click', handleSave);
        if (downloadBtn) downloadBtn.addEventListener('click', handleDownload);
        if (expandBtn) expandBtn.addEventListener('click', toggleDescription);

        // Haptic feedback
        addActionButtonHaptics();

        // Back button haptic
        const backBtn = document.querySelector('.back-btn');
        if (backBtn) {
            backBtn.addEventListener('touchstart', () => {
                if (navigator.vibrate) navigator.vibrate(10);
            });
        }
    }

    // Listen for API key update → re-fetch current video data
    window.addEventListener('storage', (e) => {
        if (e.key === 'youtube_api_key' && e.newValue && currentVideo) {
            if (window.youtubeFetcher) window.youtubeFetcher.refreshKey();
            window.youtubeFetcher?.enhanceVideoData(currentVideo).then(enhanced => {
                currentVideo = enhanced;
                renderVideoInfo();
                renderRelatedVideos();
                console.log('✅ Video Viewer (mobile): re-fetched with updated API key');
            }).catch(() => {});
        }
    });

    // Auto-refresh current video data every 30 minutes
    setInterval(() => {
        if (currentVideo && window.youtubeFetcher?.hasValidKey) {
            window.youtubeFetcher.cache.clear();
            window.youtubeFetcher.enhanceVideoData(currentVideo).then(enhanced => {
                currentVideo = enhanced;
                renderVideoInfo();
                renderRelatedVideos();
                console.log('🔄 Video Viewer (mobile): auto-refreshed video data');
            }).catch(() => {});
        }
    }, 1800000); // 30 minutes

    // Wait for DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
