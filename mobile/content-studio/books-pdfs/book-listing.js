// ============================================================================
// BOOK LISTING - Books & PDFs Section (Mobile)
// Displays technical books and PDF documentation
// ============================================================================

(function() {
    'use strict';

    // ========== BOOK DATA ==========
    const books = [
        {
            id: 1,
            title: "Arduino Programming Handbook - Complete Guide",
            thumbnail: "",
            pages: 243,
            size: "12.5 MB",
            category: "Arduino",
            description: "Comprehensive guide to Arduino programming covering basics to advanced topics. Includes practical projects and code examples.",
            tags: ["Arduino", "Programming", "Electronics"],
            downloadUrl: "#"
        },
        {
            id: 2,
            title: "SOLIDWORKS 2023 - Mastering 3D Design",
            thumbnail: "",
            pages: 486,
            size: "28.3 MB",
            category: "CAD",
            description: "Professional SOLIDWORKS training manual. Learn sketching, part modeling, assemblies, and drawing creation.",
            tags: ["SOLIDWORKS", "CAD", "3D Modeling"],
            downloadUrl: "#"
        },
        {
            id: 3,
            title: "Electronics Components Encyclopedia",
            thumbnail: "",
            pages: 356,
            size: "18.7 MB",
            category: "Electronics",
            description: "Complete reference guide for electronic components. Datasheets, pinouts, and practical applications included.",
            tags: ["Electronics", "Components", "Reference"],
            downloadUrl: "#"
        },
        {
            id: 4,
            title: "PCB Design Best Practices",
            thumbnail: "",
            pages: 189,
            size: "9.2 MB",
            category: "PCB Design",
            description: "Professional PCB design guidelines and techniques. Layout optimization, signal integrity, and manufacturing considerations.",
            tags: ["PCB", "Design", "Manufacturing"],
            downloadUrl: "#"
        },
        {
            id: 5,
            title: "Embedded Systems Programming in C",
            thumbnail: "",
            pages: 412,
            size: "15.8 MB",
            category: "Programming",
            description: "Master embedded C programming for microcontrollers. Real-world examples and optimization techniques.",
            tags: ["C Language", "Embedded", "Programming"],
            downloadUrl: "#"
        },
        {
            id: 6,
            title: "IoT Projects Cookbook",
            thumbnail: "",
            pages: 298,
            size: "21.4 MB",
            category: "IoT",
            description: "25 Internet of Things projects with ESP32, Arduino, and Raspberry Pi. Complete with circuit diagrams and code.",
            tags: ["IoT", "ESP32", "Projects"],
            downloadUrl: "#"
        },
        {
            id: 7,
            title: "Robotics Fundamentals",
            thumbnail: "",
            pages: 367,
            size: "24.1 MB",
            category: "Robotics",
            description: "Introduction to robotics covering mechanics, electronics, and programming. Build your own autonomous robots.",
            tags: ["Robotics", "Automation", "Sensors"],
            downloadUrl: "#"
        },
        {
            id: 8,
            title: "MATLAB for Engineers - Practical Guide",
            thumbnail: "",
            pages: 421,
            size: "16.9 MB",
            category: "MATLAB",
            description: "MATLAB programming for engineering applications. Signal processing, data analysis, and visualization techniques.",
            tags: ["MATLAB", "Engineering", "Analysis"],
            downloadUrl: "#"
        },
        {
            id: 9,
            title: "Mechanical Design Handbook",
            thumbnail: "",
            pages: 534,
            size: "32.6 MB",
            category: "Mechanical",
            description: "Comprehensive mechanical design reference. Material selection, stress analysis, and design optimization.",
            tags: ["Mechanical", "Design", "Engineering"],
            downloadUrl: "#"
        },
        {
            id: 10,
            title: "Sensor Technology Encyclopedia",
            thumbnail: "",
            pages: 278,
            size: "13.5 MB",
            category: "Sensors",
            description: "Complete guide to sensor technologies. Temperature, pressure, motion, gas sensors and their applications.",
            tags: ["Sensors", "Technology", "Applications"],
            downloadUrl: "#"
        },
        {
            id: 11,
            title: "Power Electronics Essentials",
            thumbnail: "",
            pages: 392,
            size: "19.7 MB",
            category: "Electronics",
            description: "Power supply design, motor control, and power management circuits. Practical design examples included.",
            tags: ["Power", "Electronics", "Circuits"],
            downloadUrl: "#"
        },
        {
            id: 12,
            title: "3D Printing Design Guide",
            thumbnail: "",
            pages: 215,
            size: "25.8 MB",
            category: "3D Printing",
            description: "Design for additive manufacturing. CAD modeling, slicing, and post-processing techniques.",
            tags: ["3D Printing", "CAD", "Manufacturing"],
            downloadUrl: "#"
        }
    ];

    // ========== DOM ELEMENTS ==========
    const searchInput = document.getElementById('searchInput');
    const contentGrid = document.getElementById('contentGrid');

    // ========== RENDER FUNCTIONS ==========
    function renderBooks(booksToRender) {
        if (booksToRender.length === 0) {
            contentGrid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-book-open"></i>
                    <h3>No Books Found</h3>
                    <p>Try adjusting your search query</p>
                </div>
            `;
            return;
        }

        contentGrid.innerHTML = booksToRender.map(book => `
            <div class="content-item book-item">
                <div class="content-thumbnail book-thumbnail">
                    ${book.thumbnail ? 
                        `<img src="${book.thumbnail}" alt="${book.title}">` :
                        '<i class="fas fa-book"></i>'
                    }
                </div>
                <div class="content-info-wrap">
                    <span class="book-category">${book.category}</span>
                    <h3 class="content-item-title">${book.title}</h3>
                    <div class="content-item-meta">
                        <span class="book-pages"><i class="fas fa-file-pdf"></i> ${book.pages} pages</span>
                        <span><i class="fas fa-database"></i> ${book.size}</span>
                    </div>
                    <p class="content-item-desc">${book.description}</p>
                    <div class="content-tags">
                        ${book.tags.map(tag => `<span class="content-tag">${tag}</span>`).join('')}
                    </div>
                    <a href="${book.downloadUrl}" class="download-btn" data-book-id="${book.id}">
                        <i class="fas fa-download"></i>
                        <span>Read / Download</span>
                    </a>
                </div>
            </div>
        `).join('');

        // Add haptic feedback
        addHapticFeedback();
    }

    // ========== SEARCH FUNCTIONALITY ==========
    function searchBooks() {
        const query = searchInput.value.toLowerCase().trim();

        const filtered = books.filter(book => {
            return book.title.toLowerCase().includes(query) ||
                   book.description.toLowerCase().includes(query) ||
                   book.category.toLowerCase().includes(query) ||
                   book.tags.some(tag => tag.toLowerCase().includes(query));
        });

        renderBooks(filtered);
    }

    // ========== HELPER FUNCTIONS ==========
    function addHapticFeedback() {
        const downloadBtns = document.querySelectorAll('.download-btn');
        downloadBtns.forEach(btn => {
            btn.addEventListener('touchstart', (e) => {
                if (navigator.vibrate) {
                    navigator.vibrate(10);
                }
            });

            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const bookId = btn.getAttribute('data-book-id');
                handleDownload(bookId);
            });
        });

        const bookItems = document.querySelectorAll('.book-item');
        bookItems.forEach(item => {
            item.addEventListener('touchstart', () => {
                if (navigator.vibrate) {
                    navigator.vibrate(10);
                }
            });
        });
    }

    function handleDownload(bookId) {
        const book = books.find(b => b.id === parseInt(bookId));
        if (book) {
            // Vibration feedback
            if (navigator.vibrate) {
                navigator.vibrate([30, 50, 30]);
            }

            // In production, this would open PDF viewer or trigger download
            // For now, show message
            console.log(`Opening book: ${book.title}`);
            
            // You can redirect to a PDF viewer page:
            // window.location.href = `book-viewer.html?id=${bookId}`;
        }
    }

    // ========== INITIALIZATION ==========
    function init() {
        // Render all books initially
        renderBooks(books);

        // Search functionality
        let searchTimeout;
        searchInput.addEventListener('input', () => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(searchBooks, 300);
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
    }

    // Wait for DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
