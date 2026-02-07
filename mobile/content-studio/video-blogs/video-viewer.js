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
            const response = await fetch('../../../Content Code/content.json');
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const data = await response.json();
            allVideos = data['video-blogs'] || [];
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
    function loadVideo() {
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
    }

    // ========== LOAD YOUTUBE PLAYER ==========
    function loadYouTubePlayer(videoId) {
        // For demo, show placeholder. In production, embed actual YouTube iframe
        videoPlayerContainer.innerHTML = `
            <iframe 
                src="https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen>
            </iframe>
        `;
    }

    // ========== RENDER VIDEO INFO ==========
    function renderVideoInfo() {
        videoInfo.innerHTML = `
            <h1 class="video-title">${currentVideo.title}</h1>
            <div class="video-meta">
                <span><i class="fas fa-folder"></i> ${currentVideo.subcategory}</span>
                <span><i class="fas fa-calendar"></i> ${formatDate(currentVideo.publishDate)}</span>
                <span><i class="fas fa-clock"></i> ${currentVideo.duration}</span>
            </div>
            <div class="video-tags">
                ${currentVideo.tags.map(tag => `<span class="video-tag">${tag}</span>`).join('')}
            </div>
        `;

        descriptionText.textContent = currentVideo.description;
    }

    // ========== RENDER RELATED VIDEOS ==========
    function renderRelatedVideos() {
        // Show other videos except current one
        const relatedVideos = allVideos.filter(v => v.id !== currentVideo.id).slice(0, 5);

        relatedList.innerHTML = relatedVideos.map(video => `
            <a href="video-viewer.html?id=${video.id}" class="related-item">
                <div class="related-thumb">
                    <img src="${video.thumbnail}" alt="${video.title}" onerror="this.style.display='none'">
                    <i class="fab fa-youtube"></i>
                    <span class="related-duration">${video.duration}</span>
                </div>
                <div class="related-info">
                    <h4>${video.title}</h4>
                    <p>${formatDate(video.publishDate)}</p>
                </div>
            </a>
        `).join('');

        addRelatedVideoHaptic();
    }

    // ========== EVENT HANDLERS ==========
    function handleLike() {
        isLiked = !isLiked;
        likeBtn.classList.toggle('liked', isLiked);
        
        if (navigator.vibrate) {
            navigator.vibrate(isLiked ? 30 : 10);
        }

        // Save to localStorage
        localStorage.setItem(`video_${currentVideo.id}_liked`, isLiked);
    }

    function handleShare() {
        if (navigator.vibrate) navigator.vibrate(10);
        
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
        
        if (navigator.vibrate) {
            navigator.vibrate(isSaved ? 30 : 10);
        }

        // Save to localStorage
        localStorage.setItem(`video_${currentVideo.id}_saved`, isSaved);
    }

    function handleDownload() {
        if (navigator.vibrate) navigator.vibrate([10, 20, 10]);
        
        // In production, this would link to download endpoint
        alert('Download feature coming soon! Video will be available for offline viewing.');
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
        isLiked = localStorage.getItem(`video_${currentVideo.id}_liked`) === 'true';
        isSaved = localStorage.getItem(`video_${currentVideo.id}_saved`) === 'true';
        
        if (isLiked) likeBtn.classList.add('liked');
        if (isSaved) {
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

    // Wait for DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
