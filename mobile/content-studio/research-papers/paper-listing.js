// ============================================================================
// PAPER LISTING - Research Papers Section (Mobile)
// Displays academic publications and research work
// ============================================================================

(function() {
    'use strict';

    // ========== PAPER DATA ==========
    const papers = [
        {
            id: 1,
            title: "IoT-Based Smart Home Automation System Using ESP32 and Machine Learning",
            thumbnail: "",
            status: "published",
            venue: "IEEE Internet of Things Journal",
            year: "2024",
            pages: "12",
            citations: 15,
            doi: "10.1109/JIOT.2024.12345",
            date: "2024-01-15",
            description: "This paper presents a novel IoT-based smart home automation system integrating ESP32 microcontrollers with machine learning algorithms for intelligent energy management and predictive maintenance.",
            tags: ["IoT", "Machine Learning", "ESP32", "Smart Home"],
            pdfUrl: "#"
        },
        {
            id: 2,
            title: "Advanced PCB Design Techniques for High-Frequency Applications",
            thumbnail: "",
            status: "published",
            venue: "International Journal of Electronics",
            year: "2023",
            pages: "18",
            citations: 28,
            doi: "10.1080/IJE.2023.67890",
            date: "2023-12-10",
            description: "Investigation of PCB design methodologies addressing signal integrity, impedance matching, and EMI reduction in high-frequency circuits up to 10 GHz.",
            tags: ["PCB Design", "RF Engineering", "Signal Integrity"],
            pdfUrl: "#"
        },
        {
            id: 3,
            title: "Autonomous Line Following Robot with Obstacle Avoidance Using Computer Vision",
            thumbnail: "",
            status: "under-review",
            venue: "Robotics and Autonomous Systems",
            year: "2024",
            pages: "15",
            citations: 0,
            doi: "Pending",
            date: "2024-01-05",
            description: "Development of an autonomous mobile robot combining traditional line following algorithms with computer vision-based obstacle detection and avoidance strategies.",
            tags: ["Robotics", "Computer Vision", "Autonomous Systems"],
            pdfUrl: "#"
        },
        {
            id: 4,
            title: "Optimization of 3D Printing Parameters for Mechanical Strength in FDM Process",
            thumbnail: "",
            status: "published",
            venue: "Additive Manufacturing",
            year: "2023",
            pages: "20",
            citations: 42,
            doi: "10.1016/AM.2023.34567",
            date: "2023-11-20",
            description: "Comprehensive study on FDM 3D printing parameter optimization using Taguchi method and response surface methodology to maximize tensile strength and minimize porosity.",
            tags: ["3D Printing", "FDM", "Optimization", "Materials"],
            pdfUrl: "#"
        },
        {
            id: 5,
            title: "Energy Harvesting System for Wireless Sensor Networks in Industrial Applications",
            thumbnail: "",
            status: "published",
            venue: "Sensors",
            year: "2023",
            pages: "16",
            citations: 35,
            doi: "10.3390/sensors23010234",
            date: "2023-10-15",
            description: "Design and implementation of a hybrid energy harvesting system combining solar and vibration energy for self-powered wireless sensor networks in industrial environments.",
            tags: ["Energy Harvesting", "WSN", "Industrial IoT"],
            pdfUrl: "#"
        },
        {
            id: 6,
            title: "MATLAB-Based Signal Processing Framework for Biomedical Applications",
            thumbnail: "",
            status: "draft",
            venue: "Target: IEEE Transactions on Biomedical Engineering",
            year: "2024",
            pages: "14",
            citations: 0,
            doi: "In Preparation",
            date: "2024-01-01",
            description: "Development of a comprehensive MATLAB toolbox for biomedical signal processing including ECG, EEG, and EMG analysis with real-time filtering and feature extraction capabilities.",
            tags: ["MATLAB", "Signal Processing", "Biomedical"],
            pdfUrl: "#"
        },
        {
            id: 7,
            title: "Comparative Analysis of Arduino and ESP32 for Real-Time Control Systems",
            thumbnail: "",
            status: "published",
            venue: "Microprocessors and Microsystems",
            year: "2023",
            pages: "22",
            citations: 51,
            doi: "10.1016/MM.2023.45678",
            date: "2023-09-05",
            description: "Performance comparison of Arduino and ESP32 platforms in real-time control applications considering processing speed, memory efficiency, and power consumption.",
            tags: ["Arduino", "ESP32", "Real-Time Systems"],
            pdfUrl: "#"
        },
        {
            id: 8,
            title: "Machine Learning Algorithms for Predictive Maintenance in Manufacturing",
            thumbnail: "",
            status: "under-review",
            venue: "Journal of Manufacturing Systems",
            year: "2024",
            pages: "19",
            citations: 2,
            doi: "Under Review",
            date: "2023-12-28",
            description: "Application of supervised and unsupervised machine learning techniques for predictive maintenance in CNC machines, reducing downtime by 40% through early fault detection.",
            tags: ["Machine Learning", "Predictive Maintenance", "Manufacturing"],
            pdfUrl: "#"
        }
    ];

    // ========== STATE ==========
    let currentStatus = 'all';

    // ========== DOM ELEMENTS ==========
    const searchInput = document.getElementById('searchInput');
    const contentGrid = document.getElementById('contentGrid');
    const statusFilters = document.querySelectorAll('.filter-chip');

    // ========== RENDER FUNCTIONS ==========
    function renderPapers(papersToRender) {
        if (papersToRender.length === 0) {
            contentGrid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-flask"></i>
                    <h3>No Papers Found</h3>
                    <p>Try adjusting your search or filter</p>
                </div>
            `;
            return;
        }

        contentGrid.innerHTML = papersToRender.map(paper => `
            <div class="content-item paper-item">
                <div class="content-thumbnail paper-thumbnail">
                    ${paper.thumbnail ? 
                        `<img src="${paper.thumbnail}" alt="${paper.title}">` :
                        '<i class="fas fa-file-alt"></i>'
                    }
                </div>
                <div class="content-info-wrap">
                    <span class="paper-status ${paper.status}">${paper.status.replace('-', ' ')}</span>
                    <h3 class="content-item-title">${paper.title}</h3>
                    <p class="paper-venue"><i class="fas fa-university"></i> ${paper.venue}</p>
                    <div class="content-item-meta">
                        <span><i class="fas fa-calendar"></i> ${paper.year}</span>
                        <span><i class="fas fa-file-pdf"></i> ${paper.pages} pages</span>
                        ${paper.citations > 0 ? `<span><i class="fas fa-quote-right"></i> ${paper.citations} citations</span>` : ''}
                    </div>
                    <p class="content-item-desc">${paper.description}</p>
                    <div class="content-tags">
                        ${paper.tags.map(tag => `<span class="content-tag">${tag}</span>`).join('')}
                    </div>
                    <a href="${paper.pdfUrl}" class="citation-btn" data-paper-id="${paper.id}">
                        <i class="fas fa-external-link-alt"></i>
                        <span>View Paper / Cite</span>
                    </a>
                </div>
            </div>
        `).join('');

        // Add haptic feedback
        addHapticFeedback();
    }

    // ========== FILTER & SEARCH FUNCTIONALITY ==========
    function filterAndSearchPapers() {
        const query = searchInput.value.toLowerCase().trim();

        let filtered = papers;

        // Status filter
        if (currentStatus !== 'all') {
            filtered = filtered.filter(paper => paper.status === currentStatus);
        }

        // Search query
        if (query) {
            filtered = filtered.filter(paper => {
                return paper.title.toLowerCase().includes(query) ||
                       paper.description.toLowerCase().includes(query) ||
                       paper.venue.toLowerCase().includes(query) ||
                       paper.tags.some(tag => tag.toLowerCase().includes(query));
            });
        }

        // Sort by date (newest first)
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

        renderPapers(filtered);
    }

    // ========== HELPER FUNCTIONS ==========
    function addHapticFeedback() {
        const citationBtns = document.querySelectorAll('.citation-btn');
        citationBtns.forEach(btn => {
            btn.addEventListener('touchstart', () => {
                if (navigator.vibrate) {
                    navigator.vibrate(10);
                }
            });

            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const paperId = btn.getAttribute('data-paper-id');
                handlePaperView(paperId);
            });
        });

        const paperItems = document.querySelectorAll('.paper-item');
        paperItems.forEach(item => {
            item.addEventListener('touchstart', () => {
                if (navigator.vibrate) {
                    navigator.vibrate(10);
                }
            });
        });
    }

    function handlePaperView(paperId) {
        const paper = papers.find(p => p.id === parseInt(paperId));
        if (paper) {
            // Vibration feedback
            if (navigator.vibrate) {
                navigator.vibrate([30, 50, 30]);
            }

            console.log(`Opening paper: ${paper.title}`);
            
            // You can redirect to a PDF viewer or paper details page:
            // window.location.href = `paper-viewer.html?id=${paperId}`;
        }
    }

    // ========== EVENT HANDLERS ==========
    function handleStatusFilter(e) {
        const chip = e.target.closest('.filter-chip');
        if (!chip) return;

        // Haptic feedback
        if (navigator.vibrate) {
            navigator.vibrate(10);
        }

        // Update active state
        statusFilters.forEach(f => f.classList.remove('active'));
        chip.classList.add('active');

        // Update current status
        currentStatus = chip.getAttribute('data-status');

        // Re-render
        filterAndSearchPapers();
    }

    // ========== INITIALIZATION ==========
    function init() {
        // Render all papers initially
        renderPapers(papers);

        // Search functionality
        let searchTimeout;
        searchInput.addEventListener('input', () => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(filterAndSearchPapers, 300);
        });

        // Status filter
        const filterContainer = document.getElementById('statusFilters');
        filterContainer.addEventListener('click', handleStatusFilter);

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
