// ============================================================================
// COURSE LISTING - Educational Courses Section (Mobile)
// Displays complete courses and educational playlists
// ============================================================================

(function() {
    'use strict';

    // ========== COURSE DATA ==========
    const courses = [
        {
            id: 1,
            title: "Complete Arduino Programming Course - Zero to Hero",
            thumbnail: "https://img.youtube.com/vi/PLAYLIST_ID_1/mqdefault.jpg",
            level: "beginner",
            videos: 25,
            duration: "8h 30m",
            enrolled: "2.5K",
            rating: 4.8,
            date: "2024-01-15",
            description: "Learn Arduino from scratch. This comprehensive course covers everything from basic LED blinking to advanced sensor integration and IoT projects.",
            tags: ["Arduino", "Electronics", "Programming"],
            playlistUrl: "#"
        },
        {
            id: 2,
            title: "SOLIDWORKS Mastery - Complete 3D CAD Course",
            thumbnail: "https://img.youtube.com/vi/PLAYLIST_ID_2/mqdefault.jpg",
            level: "intermediate",
            videos: 42,
            duration: "15h 20m",
            enrolled: "1.8K",
            rating: 4.9,
            date: "2024-01-10",
            description: "Master SOLIDWORKS with this in-depth course. Learn sketching, part modeling, assemblies, drawings, and advanced surfacing techniques.",
            tags: ["SOLIDWORKS", "CAD", "3D Modeling"],
            playlistUrl: "#"
        },
        {
            id: 3,
            title: "ESP32 & IoT Development Complete Guide",
            thumbnail: "https://img.youtube.com/vi/PLAYLIST_ID_3/mqdefault.jpg",
            level: "intermediate",
            videos: 30,
            duration: "10h 45m",
            enrolled: "3.2K",
            rating: 4.7,
            date: "2024-01-05",
            description: "Build professional IoT projects with ESP32. WiFi, Bluetooth, web servers, MQTT, cloud integration, and real-world applications covered.",
            tags: ["ESP32", "IoT", "WiFi", "Cloud"],
            playlistUrl: "#"
        },
        {
            id: 4,
            title: "PCB Design Bootcamp - Professional Board Design",
            thumbnail: "https://img.youtube.com/vi/PLAYLIST_ID_4/mqdefault.jpg",
            level: "advanced",
            videos: 35,
            duration: "12h 15m",
            enrolled: "1.5K",
            rating: 4.9,
            date: "2023-12-20",
            description: "Professional PCB design from schematic to manufacturing. Learn signal integrity, power distribution, and design for manufacturing.",
            tags: ["PCB", "Electronics", "Design"],
            playlistUrl: "#"
        },
        {
            id: 5,
            title: "Robotics Fundamentals - Build Your Own Robot",
            thumbnail: "https://img.youtube.com/vi/PLAYLIST_ID_5/mqdefault.jpg",
            level: "beginner",
            videos: 28,
            duration: "9h 30m",
            enrolled: "2.1K",
            rating: 4.6,
            date: "2023-12-15",
            description: "Introduction to robotics covering mechanics, electronics, and programming. Build line followers, obstacle avoiders, and more.",
            tags: ["Robotics", "Arduino", "Sensors"],
            playlistUrl: "#"
        },
        {
            id: 6,
            title: "MATLAB Programming for Engineers",
            thumbnail: "https://img.youtube.com/vi/PLAYLIST_ID_6/mqdefault.jpg",
            level: "intermediate",
            videos: 38,
            duration: "13h 45m",
            enrolled: "1.9K",
            rating: 4.8,
            date: "2023-12-10",
            description: "Complete MATLAB course for engineering applications. Data analysis, signal processing, control systems, and simulation techniques.",
            tags: ["MATLAB", "Engineering", "Programming"],
            playlistUrl: "#"
        },
        {
            id: 7,
            title: "Embedded Systems Programming in C",
            thumbnail: "https://img.youtube.com/vi/PLAYLIST_ID_7/mqdefault.jpg",
            level: "advanced",
            videos: 45,
            duration: "16h 30m",
            enrolled: "1.3K",
            rating: 4.9,
            date: "2023-12-05",
            description: "Professional embedded C programming. Memory management, interrupts, peripherals, real-time systems, and industry best practices.",
            tags: ["C Language", "Embedded", "RTOS"],
            playlistUrl: "#"
        },
        {
            id: 8,
            title: "3D Printing Design and Manufacturing",
            thumbnail: "https://img.youtube.com/vi/PLAYLIST_ID_8/mqdefault.jpg",
            level: "beginner",
            videos: 22,
            duration: "7h 20m",
            enrolled: "2.8K",
            rating: 4.5,
            date: "2023-11-28",
            description: "Learn 3D printing from design to final print. CAD modeling, slicing software, printer setup, troubleshooting, and post-processing.",
            tags: ["3D Printing", "CAD", "Manufacturing"],
            playlistUrl: "#"
        },
        {
            id: 9,
            title: "Sensor Technology and Applications",
            thumbnail: "https://img.youtube.com/vi/PLAYLIST_ID_9/mqdefault.jpg",
            level: "intermediate",
            videos: 32,
            duration: "11h 10m",
            enrolled: "1.7K",
            rating: 4.7,
            date: "2023-11-20",
            description: "Comprehensive guide to sensor technologies. Temperature, pressure, motion, gas sensors with practical Arduino and ESP32 projects.",
            tags: ["Sensors", "Arduino", "IoT"],
            playlistUrl: "#"
        },
        {
            id: 10,
            title: "Power Electronics Design Course",
            thumbnail: "https://img.youtube.com/vi/PLAYLIST_ID_10/mqdefault.jpg",
            level: "advanced",
            videos: 40,
            duration: "14h 50m",
            enrolled: "1.1K",
            rating: 4.8,
            date: "2023-11-15",
            description: "Design power supplies, motor controllers, and power management circuits. Buck, boost, inverters, and advanced topologies explained.",
            tags: ["Power Electronics", "Circuits", "Design"],
            playlistUrl: "#"
        },
        {
            id: 11,
            title: "Bluetooth & Wireless Communication",
            thumbnail: "https://img.youtube.com/vi/PLAYLIST_ID_11/mqdefault.jpg",
            level: "intermediate",
            videos: 26,
            duration: "8h 45m",
            enrolled: "2.3K",
            rating: 4.6,
            date: "2023-11-10",
            description: "Master wireless communication protocols. Bluetooth Classic, BLE, NRF24L01, LoRa, and practical project implementations.",
            tags: ["Bluetooth", "Wireless", "Communication"],
            playlistUrl: "#"
        },
        {
            id: 12,
            title: "Machine Learning for IoT Devices",
            thumbnail: "https://img.youtube.com/vi/PLAYLIST_ID_12/mqdefault.jpg",
            level: "advanced",
            videos: 36,
            duration: "13h 20m",
            enrolled: "1.6K",
            rating: 4.9,
            date: "2023-11-05",
            description: "Implement machine learning on embedded devices. TinyML, TensorFlow Lite, edge computing, and real-world ML IoT applications.",
            tags: ["Machine Learning", "TinyML", "IoT"],
            playlistUrl: "#"
        }
    ];

    // ========== STATE ==========
    let currentLevel = 'all';

    // ========== DOM ELEMENTS ==========
    const searchInput = document.getElementById('searchInput');
    const contentGrid = document.getElementById('contentGrid');
    const levelFilters = document.querySelectorAll('.filter-chip');

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

        contentGrid.innerHTML = coursesToRender.map(course => `
            <a href="course-viewer.html?id=${course.id}" class="content-item course-item">
                <div class="content-thumbnail course-thumbnail">
                    <img src="${course.thumbnail}" alt="${course.title}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
                    <i class="fas fa-play-circle" style="display:none;"></i>
                    <span class="course-badge">COURSE</span>
                </div>
                <div class="content-info-wrap">
                    <span class="course-level ${course.level}">${course.level}</span>
                    <h3 class="content-item-title">${course.title}</h3>
                    <div class="content-item-meta">
                        <span><i class="fas fa-video"></i> ${course.videos} videos</span>
                        <span><i class="fas fa-clock"></i> ${course.duration}</span>
                    </div>
                    <p class="content-item-desc">${course.description}</p>
                    <div class="content-tags">
                        ${course.tags.map(tag => `<span class="content-tag">${tag}</span>`).join('')}
                    </div>
                    <div class="course-stats">
                        <span class="stat-item">
                            <i class="fas fa-users"></i>
                            ${course.enrolled} enrolled
                        </span>
                        <span class="stat-item">
                            <i class="fas fa-star"></i>
                            ${course.rating} rating
                        </span>
                    </div>
                </div>
            </a>
        `).join('');

        // Add haptic feedback
        addHapticFeedback();
    }

    // ========== FILTER & SEARCH FUNCTIONALITY ==========
    function filterAndSearchCourses() {
        const query = searchInput.value.toLowerCase().trim();

        let filtered = courses;

        // Level filter
        if (currentLevel !== 'all') {
            filtered = filtered.filter(course => course.level === currentLevel);
        }

        // Search query
        if (query) {
            filtered = filtered.filter(course => {
                return course.title.toLowerCase().includes(query) ||
                       course.description.toLowerCase().includes(query) ||
                       course.tags.some(tag => tag.toLowerCase().includes(query));
            });
        }

        // Sort by enrollment (most popular first)
        filtered.sort((a, b) => {
            const aEnrolled = parseFloat(a.enrolled.replace('K', '')) * 1000;
            const bEnrolled = parseFloat(b.enrolled.replace('K', '')) * 1000;
            return bEnrolled - aEnrolled;
        });

        renderCourses(filtered);
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

    // ========== INITIALIZATION ==========
    function init() {
        // Render all courses initially
        renderCourses(courses);

        // Search functionality
        let searchTimeout;
        searchInput.addEventListener('input', () => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(filterAndSearchCourses, 300);
        });

        // Level filter
        const filterContainer = document.getElementById('levelFilters');
        filterContainer.addEventListener('click', handleLevelFilter);

        // Back button haptic feedback
        const backBtn = document.querySelector('.back-btn');
        if (backBtn) {
            backBtn.addEventListener('touchstart', () => {
                if (navigator.vibrate) {
                    navigator.vibrate(10);
                }
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
