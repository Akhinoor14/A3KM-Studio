// ============================================================================
// POST LISTING - Written Posts Section (Mobile)
// Displays blog posts and articles in multiple languages
// ============================================================================

(function() {
    'use strict';

    // ========== POST DATA ==========
    const posts = [
        {
            id: 1,
            title: "Getting Started with Arduino: A Complete Beginner's Guide",
            thumbnail: "",
            readTime: "8 min read",
            language: "english",
            langDisplay: "EN",
            date: "2024-01-20",
            description: "Learn the fundamentals of Arduino programming from scratch. This comprehensive guide covers everything you need to start building electronic projects.",
            tags: ["Arduino", "Tutorial", "Beginner"],
            slug: "arduino-beginners-guide"
        },
        {
            id: 2,
            title: "আরডুইনো দিয়ে শুরু করুন: সম্পূর্ণ বাংলা গাইড",
            thumbnail: "",
            readTime: "১০ মিনিট",
            language: "bangla",
            langDisplay: "বাং",
            date: "2024-01-18",
            description: "আরডুইনো প্রোগ্রামিং এর মূল বিষয়গুলো শিখুন। এই সম্পূর্ণ গাইডে রয়েছে ইলেকট্রনিক্স প্রজেক্ট তৈরির জন্য প্রয়োজনীয় সব কিছু।",
            tags: ["আরডুইনো", "টিউটোরিয়াল", "শিক্ষানবিস"],
            slug: "arduino-bangla-guide"
        },
        {
            id: 3,
            title: "SOLIDWORKS Tips and Tricks for Efficient 3D Modeling",
            thumbnail: "",
            readTime: "12 min read",
            language: "english",
            langDisplay: "EN",
            date: "2024-01-15",
            description: "Master SOLIDWORKS with these professional tips. Improve your workflow, create better designs, and save time with advanced techniques.",
            tags: ["SOLIDWORKS", "CAD", "3D Modeling"],
            slug: "solidworks-tips-tricks"
        },
        {
            id: 4,
            title: "ESP32 দিয়ে IoT প্রজেক্ট: WiFi কন্ট্রোল সিস্টেম",
            thumbnail: "",
            readTime: "১৫ মিনিট",
            language: "bangla",
            langDisplay: "বাং",
            date: "2024-01-12",
            description: "ESP32 মাইক্রোকন্ট্রোলার ব্যবহার করে WiFi ভিত্তিক IoT প্রজেক্ট তৈরি করুন। সম্পূর্ণ কোড এবং সার্কিট ডায়াগ্রাম সহ।",
            tags: ["ESP32", "IoT", "WiFi"],
            slug: "esp32-iot-bangla"
        },
        {
            id: 5,
            title: "PCB Design Best Practices for Electronics Projects",
            thumbnail: "",
            readTime: "10 min read",
            language: "english",
            langDisplay: "EN",
            date: "2024-01-10",
            description: "Professional PCB design guidelines for creating reliable and manufacturable circuit boards. Layout optimization and design rules explained.",
            tags: ["PCB", "Electronics", "Design"],
            slug: "pcb-design-practices"
        },
        {
            id: 6,
            title: "রোবটিক্স প্রজেক্ট: লাইন ফলোয়ার রোবট তৈরি করুন",
            thumbnail: "",
            readTime: "২০ মিনিট",
            language: "bangla",
            langDisplay: "বাং",
            date: "2024-01-08",
            description: "Arduino ব্যবহার করে একটি সম্পূর্ণ লাইন ফলোয়ার রোবট তৈরি করুন। হার্ডওয়্যার সেটআপ থেকে প্রোগ্রামিং পর্যন্ত সব কিছু।",
            tags: ["রোবটিক্স", "আরডুইনো", "প্রজেক্ট"],
            slug: "line-follower-bangla"
        },
        {
            id: 7,
            title: "Mastering MATLAB: Data Analysis and Visualization",
            thumbnail: "",
            readTime: "14 min read",
            language: "english",
            langDisplay: "EN",
            date: "2024-01-05",
            description: "Comprehensive guide to MATLAB for data analysis and visualization. Learn plotting, matrix operations, and signal processing techniques.",
            tags: ["MATLAB", "Data Analysis", "Programming"],
            slug: "matlab-data-analysis"
        },
        {
            id: 8,
            title: "সেন্সর প্রযুক্তি: ইলেকট্রনিক্স প্রজেক্টে ব্যবহার",
            thumbnail: "",
            readTime: "১২ মিনিট",
            language: "bangla",
            langDisplay: "বাং",
            date: "2024-01-02",
            description: "বিভিন্ন ধরনের সেন্সর এবং তাদের প্রযুক্তিগত বৈশিষ্ট্য সম্পর্কে জানুন। ইলেকট্রনিক্স প্রজেক্টে সেন্সর ব্যবহারের বাস্তব উদাহরণ।",
            tags: ["সেন্সর", "ইলেকট্রনিক্স", "প্রযুক্তি"],
            slug: "sensor-technology-bangla"
        },
        {
            id: 9,
            title: "Bluetooth Communication with Arduino: Complete Guide",
            thumbnail: "",
            readTime: "11 min read",
            language: "english",
            langDisplay: "EN",
            date: "2023-12-28",
            description: "Build Bluetooth-enabled projects with Arduino. Learn HC-05 module setup, Android app integration, and wireless communication protocols.",
            tags: ["Arduino", "Bluetooth", "Communication"],
            slug: "arduino-bluetooth-guide"
        },
        {
            id: 10,
            title: "3D প্রিন্টিং: ডিজাইন থেকে প্রিন্ট পর্যন্ত",
            thumbnail: "",
            readTime: "১৮ মিনিট",
            language: "bangla",
            langDisplay: "বাং",
            date: "2023-12-25",
            description: "3D প্রিন্টিং এর সম্পূর্ণ প্রক্রিয়া। CAD মডেলিং, স্লাইসিং সেটিংস, এবং প্রিন্ট অপটিমাইজেশন কৌশল।",
            tags: ["3D প্রিন্টিং", "CAD", "প্রযুক্তি"],
            slug: "3d-printing-bangla"
        }
    ];

    // ========== STATE ==========
    let currentLanguage = 'all';

    // ========== DOM ELEMENTS ==========
    const searchInput = document.getElementById('searchInput');
    const contentGrid = document.getElementById('contentGrid');
    const languageFilters = document.querySelectorAll('.filter-chip');

    // ========== RENDER FUNCTIONS ==========
    function renderPosts(postsToRender) {
        if (postsToRender.length === 0) {
            contentGrid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-pen-nib"></i>
                    <h3>No Posts Found</h3>
                    <p>Try adjusting your search or filter</p>
                </div>
            `;
            return;
        }

        contentGrid.innerHTML = postsToRender.map(post => `
            <a href="post-viewer.html?slug=${post.slug}" class="content-item post-item">
                <div class="content-thumbnail post-thumbnail">
                    ${post.thumbnail ? 
                        `<img src="${post.thumbnail}" alt="${post.title}">` :
                        '<i class="fas fa-newspaper"></i>'
                    }
                    <span class="post-language">${post.langDisplay}</span>
                </div>
                <div class="content-info-wrap">
                    <h3 class="content-item-title">${post.title}</h3>
                    <div class="content-item-meta">
                        <span class="read-time"><i class="fas fa-clock"></i> ${post.readTime}</span>
                        <span><i class="fas fa-calendar"></i> ${formatDate(post.date)}</span>
                    </div>
                    <p class="content-item-desc">${post.description}</p>
                    <div class="content-tags">
                        ${post.tags.map(tag => `<span class="content-tag">${tag}</span>`).join('')}
                    </div>
                </div>
            </a>
        `).join('');

        // Add haptic feedback
        addHapticFeedback();
    }

    // ========== FILTER & SEARCH FUNCTIONALITY ==========
    function filterAndSearchPosts() {
        const query = searchInput.value.toLowerCase().trim();

        let filtered = posts;

        // Language filter
        if (currentLanguage !== 'all') {
            filtered = filtered.filter(post => post.language === currentLanguage);
        }

        // Search query
        if (query) {
            filtered = filtered.filter(post => {
                return post.title.toLowerCase().includes(query) ||
                       post.description.toLowerCase().includes(query) ||
                       post.tags.some(tag => tag.toLowerCase().includes(query));
            });
        }

        renderPosts(filtered);
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
        const postItems = document.querySelectorAll('.post-item');
        postItems.forEach(item => {
            item.addEventListener('touchstart', () => {
                if (navigator.vibrate) {
                    navigator.vibrate(10);
                }
            });
        });
    }

    // ========== EVENT HANDLERS ==========
    function handleLanguageFilter(e) {
        const chip = e.target.closest('.filter-chip');
        if (!chip) return;

        // Haptic feedback
        if (navigator.vibrate) {
            navigator.vibrate(10);
        }

        // Update active state
        languageFilters.forEach(f => f.classList.remove('active'));
        chip.classList.add('active');

        // Update current language
        currentLanguage = chip.getAttribute('data-lang');

        // Re-render
        filterAndSearchPosts();
    }

    // ========== INITIALIZATION ==========
    function init() {
        // Render all posts initially
        renderPosts(posts);

        // Search functionality
        let searchTimeout;
        searchInput.addEventListener('input', () => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(filterAndSearchPosts, 300);
        });

        // Language filter
        const filterContainer = document.getElementById('languageFilters');
        filterContainer.addEventListener('click', handleLanguageFilter);

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
