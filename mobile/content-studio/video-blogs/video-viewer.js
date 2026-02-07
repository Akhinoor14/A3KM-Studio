// ============================================================================
// VIDEO VIEWER - Individual Video Player (Mobile)
// Displays YouTube video with details and related content
// ============================================================================

(function() {
    'use strict';

    // ========== VIDEO DATABASE (same as video-gallery.js) ==========
    const videos = [
        {
            id: 1,
            title: "Arduino Line Follower Robot - Complete Tutorial",
            thumbnail: "https://img.youtube.com/vi/VIDEO_ID_1/mqdefault.jpg",
            duration: "15:32",
            views: "12.5K",
            date: "2024-01-15",
            description: "Learn how to build a line follower robot using Arduino UNO. Complete circuit diagram, code explanation, and troubleshooting tips included.\n\nIn this comprehensive tutorial, we'll cover:\n• Circuit diagram and components needed\n• Sensor calibration techniques\n• PID control algorithm implementation\n• Code optimization for better performance\n• Common issues and how to fix them\n\nComponents Required:\n- Arduino UNO\n- IR Sensors (x5)\n- Motor Driver L298N\n- DC Motors (x2)\n- Chassis and wheels\n- Power supply",
            tags: ["Arduino", "Robotics", "Tutorial"],
            videoId: "VIDEO_ID_1"
        },
        {
            id: 2,
            title: "3D Modeling in SOLIDWORKS - Beginner Tips",
            thumbnail: "https://img.youtube.com/vi/VIDEO_ID_2/mqdefault.jpg",
            duration: "22:18",
            views: "8.3K",
            date: "2024-01-10",
            description: "Essential SOLIDWORKS tips and tricks for beginners. Learn sketching, features, and assembly basics in this comprehensive guide.",
            tags: ["SOLIDWORKS", "3D Modeling", "CAD"],
            videoId: "VIDEO_ID_2"
        },
        {
            id: 3,
            title: "ESP32 WiFi Projects - IoT Made Easy",
            thumbnail: "https://img.youtube.com/vi/VIDEO_ID_3/mqdefault.jpg",
            duration: "18:45",
            views: "15.2K",
            date: "2024-01-05",
            description: "Build WiFi-enabled IoT projects with ESP32. Control LEDs, read sensors, and create a web interface from scratch.",
            tags: ["ESP32", "IoT", "WiFi"],
            videoId: "VIDEO_ID_3"
        },
        {
            id: 4,
            title: "PCB Design Basics - From Schematic to Board",
            thumbnail: "https://img.youtube.com/vi/VIDEO_ID_4/mqdefault.jpg",
            duration: "25:10",
            views: "9.7K",
            date: "2023-12-28",
            description: "Complete PCB design workflow. Learn schematic capture, PCB layout, and manufacturing file generation.",
            tags: ["PCB", "Electronics", "Design"],
            videoId: "VIDEO_ID_4"
        },
        {
            id: 5,
            title: "Arduino Nano - 10 Amazing Projects",
            thumbnail: "https://img.youtube.com/vi/VIDEO_ID_5/mqdefault.jpg",
            duration: "20:35",
            views: "18.9K",
            date: "2023-12-20",
            description: "Discover 10 creative Arduino Nano projects with complete code and circuit diagrams. Perfect for beginners and intermediate makers.",
            tags: ["Arduino", "Projects", "DIY"],
            videoId: "VIDEO_ID_5"
        }
    ];

    // ========== STATE ==========
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

    // ========== GET VIDEO ID FROM URL ==========
    function getVideoIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        return id ? parseInt(id) : 1; // Default to first video
    }

    // ========== LOAD VIDEO ==========
    function loadVideo() {
        const videoId = getVideoIdFromUrl();
        currentVideo = videos.find(v => v.id === videoId);

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
                <span><i class="fas fa-eye"></i> ${currentVideo.views} views</span>
                <span><i class="fas fa-calendar"></i> ${formatDate(currentVideo.date)}</span>
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
        const relatedVideos = videos.filter(v => v.id !== currentVideo.id).slice(0, 5);

        relatedList.innerHTML = relatedVideos.map(video => `
            <a href="video-viewer.html?id=${video.id}" class="related-item">
                <div class="related-thumb">
                    <img src="${video.thumbnail}" alt="${video.title}" onerror="this.style.display='none'">
                    <i class="fab fa-youtube"></i>
                    <span class="related-duration">${video.duration}</span>
                </div>
                <div class="related-info">
                    <h4>${video.title}</h4>
                    <p>${video.views} views • ${formatDate(video.date)}</p>
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
        // Load video
        loadVideo();

        // Event listeners
        likeBtn.addEventListener('click', handleLike);
        shareBtn.addEventListener('click', handleShare);
        saveBtn.addEventListener('click', handleSave);
        downloadBtn.addEventListener('click', handleDownload);
        expandBtn.addEventListener('click', toggleDescription);

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
