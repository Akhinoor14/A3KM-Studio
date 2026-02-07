// ============================================================================
// VIDEO GALLERY - Video Blogs Listing (Mobile)
// Displays YouTube video content with search functionality
// ============================================================================

(function() {
    'use strict';

    // ========== VIDEO DATA ==========
    const videos = [
        {
            id: 1,
            title: "Arduino Line Follower Robot - Complete Tutorial",
            thumbnail: "https://img.youtube.com/vi/VIDEO_ID_1/mqdefault.jpg",
            duration: "15:32",
            views: "12.5K",
            date: "2024-01-15",
            description: "Learn how to build a line follower robot using Arduino UNO. Complete circuit diagram, code explanation, and troubleshooting tips included.",
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
        },
        {
            id: 6,
            title: "Bluetooth Controlled Car - Arduino Tutorial",
            thumbnail: "https://img.youtube.com/vi/VIDEO_ID_6/mqdefault.jpg",
            duration: "16:22",
            views: "11.4K",
            date: "2023-12-15",
            description: "Build a smartphone-controlled car using Arduino and HC-05 Bluetooth module. Includes Android app development guide.",
            tags: ["Arduino", "Bluetooth", "Robotics"],
            videoId: "VIDEO_ID_6"
        },
        {
            id: 7,
            title: "MATLAB Basics - Data Analysis Tutorial",
            thumbnail: "https://img.youtube.com/vi/VIDEO_ID_7/mqdefault.jpg",
            duration: "19:50",
            views: "7.2K",
            date: "2023-12-10",
            description: "Introduction to MATLAB for data analysis. Learn plotting, matrix operations, and basic signal processing techniques.",
            tags: ["MATLAB", "Data Analysis", "Programming"],
            videoId: "VIDEO_ID_7"
        },
        {
            id: 8,
            title: "Raspberry Pi Home Automation System",
            thumbnail: "https://img.youtube.com/vi/VIDEO_ID_8/mqdefault.jpg",
            duration: "28:15",
            views: "14.6K",
            date: "2023-12-05",
            description: "Create a complete home automation system with Raspberry Pi. Control lights, fans, and appliances via web interface.",
            tags: ["Raspberry Pi", "IoT", "Automation"],
            videoId: "VIDEO_ID_8"
        },
        {
            id: 9,
            title: "Servo Motor Control - Multiple Methods",
            thumbnail: "https://img.youtube.com/vi/VIDEO_ID_9/mqdefault.jpg",
            duration: "14:08",
            views: "10.1K",
            date: "2023-11-28",
            description: "Learn different ways to control servo motors with Arduino. Sweep, position control, and multi-servo projects explained.",
            tags: ["Arduino", "Servo", "Motors"],
            videoId: "VIDEO_ID_9"
        },
        {
            id: 10,
            title: "Ultrasonic Sensor Projects - 5 Cool Ideas",
            thumbnail: "https://img.youtube.com/vi/VIDEO_ID_10/mqdefault.jpg",
            duration: "17:42",
            views: "13.8K",
            date: "2023-11-20",
            description: "Five creative projects using HC-SR04 ultrasonic sensor. Distance meter, obstacle avoider, parking sensor, and more.",
            tags: ["Arduino", "Sensors", "Projects"],
            videoId: "VIDEO_ID_10"
        }
    ];

    // ========== DOM ELEMENTS ==========
    const searchInput = document.getElementById('searchInput');
    const contentGrid = document.getElementById('contentGrid');

    // ========== RENDER FUNCTIONS ==========
    function renderVideos(videosToRender) {
        if (videosToRender.length === 0) {
            contentGrid.innerHTML = `
                <div class="empty-state">
                    <i class="fab fa-youtube"></i>
                    <h3>No Videos Found</h3>
                    <p>Try adjusting your search query</p>
                </div>
            `;
            return;
        }

        contentGrid.innerHTML = videosToRender.map(video => `
            <a href="video-viewer.html?id=${video.id}" class="content-item">
                <div class="content-thumbnail">
                    <img src="${video.thumbnail}" alt="${video.title}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
                    <i class="fab fa-youtube" style="display:none;"></i>
                    <span class="content-duration">${video.duration}</span>
                </div>
                <div class="content-info-wrap">
                    <h3 class="content-item-title">${video.title}</h3>
                    <div class="content-item-meta">
                        <span><i class="fas fa-eye"></i> ${video.views} views</span>
                        <span><i class="fas fa-calendar"></i> ${formatDate(video.date)}</span>
                    </div>
                    <p class="content-item-desc">${video.description}</p>
                    <div class="content-tags">
                        ${video.tags.map(tag => `<span class="content-tag">${tag}</span>`).join('')}
                    </div>
                </div>
            </a>
        `).join('');

        // Add haptic feedback
        addHapticFeedback();
    }

    // ========== SEARCH FUNCTIONALITY ==========
    function searchVideos() {
        const query = searchInput.value.toLowerCase().trim();

        const filtered = videos.filter(video => {
            return video.title.toLowerCase().includes(query) ||
                   video.description.toLowerCase().includes(query) ||
                   video.tags.some(tag => tag.toLowerCase().includes(query));
        });

        renderVideos(filtered);
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

    function addHapticFeedback() {
        const items = document.querySelectorAll('.content-item');
        items.forEach(item => {
            item.addEventListener('touchstart', () => {
                if (navigator.vibrate) {
                    navigator.vibrate(10);
                }
            });
        });
    }

    // ========== INITIALIZATION ==========
    function init() {
        // Render all videos initially
        renderVideos(videos);

        // Search functionality
        let searchTimeout;
        searchInput.addEventListener('input', () => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(searchVideos, 300);
        });

        // Back button haptic feedback
        const backBtn = document.querySelector('.back-btn');
        if (backBtn) {
            backBtn.addEventListener('touchstart', () => {
                if (navigator.vibrate) {
                    navigator.vibrate(10);
                }
            });
        }

        // Scroll to top button (optional enhancement)
        let lastScrollTop = 0;
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            // Can add scroll-based effects here
            lastScrollTop = scrollTop;
        });
    }

    // Wait for DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
