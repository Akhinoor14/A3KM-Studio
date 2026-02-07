// ============================================================================
// BOOK READER - PDF Book Viewer (Mobile)
// Displays PDF books with navigation and bookmarking
// ============================================================================

(function() {
    'use strict';

    // ========== BOOK DATABASE (same as book-listing.js) ==========
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
            downloadUrl: "#",
            pdfUrl: "https://example.com/arduino-handbook.pdf" // Replace with actual PDF URL
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
            downloadUrl: "#",
            pdfUrl: "https://example.com/solidworks-2023.pdf"
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
            downloadUrl: "#",
            pdfUrl: "https://example.com/electronics-encyclopedia.pdf"
        }
    ];

    // ========== STATE ==========
    let currentBook = null;
    let currentPage = 1;
    let isBookmarked = false;
    let isInfoPanelOpen = false;

    // ========== DOM ELEMENTS ==========
    const bookTitleHeader = document.getElementById('bookTitleHeader');
    const pdfViewerContainer = document.getElementById('pdfViewerContainer');
    const bookInfoPanel = document.getElementById('bookInfoPanel');
    const bookInfoContent = document.getElementById('bookInfoContent');
    const pageNavigation = document.getElementById('pageNavigation');
    const pageInfo = document.getElementById('pageInfo');
    const prevPageBtn = document.getElementById('prevPageBtn');
    const nextPageBtn = document.getElementById('nextPageBtn');
    const infoBtn = document.getElementById('infoBtn');
    const bookmarkBtn = document.getElementById('bookmarkBtn');

    // ========== GET BOOK ID FROM URL ==========
    function getBookIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        return id ? parseInt(id) : 1; // Default to first book
    }

    // ========== LOAD BOOK ==========
    function loadBook() {
        const bookId = getBookIdFromUrl();
        currentBook = books.find(b => b.id === bookId);

        if (!currentBook) {
            pdfViewerContainer.innerHTML = `
                <div style="padding: 60px 20px; text-align: center;">
                    <i class="fas fa-exclamation-circle" style="font-size: 56px; color: var(--primary-red); margin-bottom: 20px;"></i>
                    <h3 style="font-size: 18px; font-weight: 700; margin-bottom: 12px; color: var(--text-primary);">Book Not Found</h3>
                    <p style="color: var(--text-dim); margin-bottom: 24px;">The book you're looking for doesn't exist.</p>
                    <a href="book-listing.html" style="display: inline-block; padding: 12px 24px; background: var(--primary-red); color: #fff; border-radius: 8px; text-decoration: none; font-weight: 600;">Back to Library</a>
                </div>
            `;
            return;
        }

        // Update header
        bookTitleHeader.textContent = currentBook.title;

        // Load PDF viewer
        loadPDFViewer();

        // Render book info
        renderBookInfo();

        // Check bookmark state
        checkBookmarkState();

        // Show page navigation
        pageNavigation.style.display = 'flex';
        updatePageInfo();
    }

    // ========== LOAD PDF VIEWER ==========
    function loadPDFViewer() {
        // For demo purposes, show placeholder
        // In production, use PDF.js or embed actual PDF
        pdfViewerContainer.innerHTML = `
            <div class="pdf-placeholder">
                <i class="fas fa-book-open"></i>
                <h3>${currentBook.title}</h3>
                <p>${currentBook.pages} pages • ${currentBook.size}</p>
                <p style="margin-top: 16px; max-width: 300px; margin-left: auto; margin-right: auto;">
                    PDF viewer will load here. In production, integrate PDF.js for mobile-optimized reading experience.
                </p>
                <button onclick="window.open('${currentBook.pdfUrl}', '_blank')" style="margin-top: 24px; padding: 12px 24px; background: linear-gradient(135deg, #0d6efd, #0a58ca); color: #fff; border: none; border-radius: 10px; font-weight: 600; cursor: pointer;">
                    Open PDF in New Tab
                </button>
            </div>
        `;

        // Alternative: Embed PDF using iframe
        // pdfViewerContainer.innerHTML = `
        //     <iframe src="${currentBook.pdfUrl}#page=${currentPage}" class="pdf-iframe"></iframe>
        // `;

        // Alternative: Use PDF.js for better mobile support
        // loadPDFJS(currentBook.pdfUrl);
    }

    // ========== RENDER BOOK INFO ==========
    function renderBookInfo() {
        bookInfoContent.innerHTML = `
            <div class="book-meta-grid">
                <div class="meta-item">
                    <div class="meta-label">Category</div>
                    <div class="meta-value">${currentBook.category}</div>
                </div>
                <div class="meta-item">
                    <div class="meta-label">Pages</div>
                    <div class="meta-value">${currentBook.pages}</div>
                </div>
                <div class="meta-item">
                    <div class="meta-label">File Size</div>
                    <div class="meta-value">${currentBook.size}</div>
                </div>
                <div class="meta-item">
                    <div class="meta-label">Format</div>
                    <div class="meta-value">PDF</div>
                </div>
            </div>
            
            <div class="book-description">
                <h4>About This Book</h4>
                <p>${currentBook.description}</p>
                <div class="book-tags">
                    ${currentBook.tags.map(tag => `<span class="book-tag">${tag}</span>`).join('')}
                </div>
            </div>
            
            <div class="download-section">
                <button class="download-btn" id="downloadBookBtn">
                    <i class="fas fa-download"></i>
                    <span>Download for Offline Reading</span>
                </button>
            </div>
        `;

        // Add download button listener
        const downloadBookBtn = document.getElementById('downloadBookBtn');
        if (downloadBookBtn) {
            downloadBookBtn.addEventListener('click', handleDownload);
            downloadBookBtn.addEventListener('touchstart', () => {
                if (navigator.vibrate) navigator.vibrate(10);
            });
        }
    }

    // ========== PAGE NAVIGATION ==========
    function updatePageInfo() {
        pageInfo.textContent = `${currentPage} / ${currentBook.pages}`;
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = currentPage === currentBook.pages;
    }

    function goToPreviousPage() {
        if (currentPage > 1) {
            currentPage--;
            updatePageInfo();
            
            if (navigator.vibrate) navigator.vibrate(10);
            
            // Reload PDF with new page
            // In production: pdfViewer.goToPage(currentPage);
            saveReadingProgress();
        }
    }

    function goToNextPage() {
        if (currentPage < currentBook.pages) {
            currentPage++;
            updatePageInfo();
            
            if (navigator.vibrate) navigator.vibrate(10);
            
            // Reload PDF with new page
            // In production: pdfViewer.goToPage(currentPage);
            saveReadingProgress();
        }
    }

    // ========== EVENT HANDLERS ==========
    function toggleInfoPanel() {
        isInfoPanelOpen = !isInfoPanelOpen;
        bookInfoPanel.classList.toggle('active', isInfoPanelOpen);
        
        if (navigator.vibrate) navigator.vibrate(10);
    }

    function toggleBookmark() {
        isBookmarked = !isBookmarked;
        bookmarkBtn.style.color = isBookmarked ? '#ffc107' : 'var(--primary-red)';
        
        if (navigator.vibrate) {
            navigator.vibrate(isBookmarked ? 30 : 10);
        }

        // Save to localStorage
        localStorage.setItem(`book_${currentBook.id}_bookmarked`, isBookmarked);
        
        if (isBookmarked) {
            showToast('Bookmark added');
        } else {
            showToast('Bookmark removed');
        }
    }

    function handleDownload() {
        if (navigator.vibrate) navigator.vibrate([10, 20, 10]);
        
        // In production, trigger actual download
        showToast('Download started...');
        
        // Simulate download
        setTimeout(() => {
            showToast('Book downloaded successfully!');
        }, 2000);
        
        // Actual implementation:
        // const link = document.createElement('a');
        // link.href = currentBook.pdfUrl;
        // link.download = `${currentBook.title}.pdf`;
        // link.click();
    }

    // ========== HELPER FUNCTIONS ==========
    function checkBookmarkState() {
        isBookmarked = localStorage.getItem(`book_${currentBook.id}_bookmarked`) === 'true';
        
        if (isBookmarked) {
            bookmarkBtn.style.color = '#ffc107';
        }

        // Load reading progress
        const savedPage = localStorage.getItem(`book_${currentBook.id}_page`);
        if (savedPage) {
            currentPage = parseInt(savedPage);
        }
    }

    function saveReadingProgress() {
        localStorage.setItem(`book_${currentBook.id}_page`, currentPage);
    }

    function showToast(message) {
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 160px;
            left: 50%;
            transform: translateX(-50%);
            padding: 12px 24px;
            background: rgba(13, 110, 253, 0.95);
            color: #fff;
            border-radius: 8px;
            font-size: 13px;
            font-weight: 600;
            z-index: 10000;
            backdrop-filter: blur(10px);
        `;
        
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2000);
    }

    function addHapticFeedback() {
        const buttons = [prevPageBtn, nextPageBtn, infoBtn, bookmarkBtn];
        buttons.forEach(btn => {
            btn.addEventListener('touchstart', () => {
                if (navigator.vibrate && !btn.disabled) {
                    navigator.vibrate(10);
                }
            });
        });

        const backBtn = document.querySelector('.back-btn');
        if (backBtn) {
            backBtn.addEventListener('touchstart', () => {
                if (navigator.vibrate) navigator.vibrate(10);
            });
        }
    }

    // ========== KEYBOARD NAVIGATION ==========
    function handleKeyPress(e) {
        if (e.key === 'ArrowLeft') {
            goToPreviousPage();
        } else if (e.key === 'ArrowRight') {
            goToNextPage();
        }
    }

    // ========== INITIALIZATION ==========
    function init() {
        // Load book
        loadBook();

        // Event listeners
        prevPageBtn.addEventListener('click', goToPreviousPage);
        nextPageBtn.addEventListener('click', goToNextPage);
        infoBtn.addEventListener('click', toggleInfoPanel);
        bookmarkBtn.addEventListener('click', toggleBookmark);

        // Keyboard navigation
        document.addEventListener('keydown', handleKeyPress);

        // Haptic feedback
        addHapticFeedback();

        // Swipe gestures for page navigation
        addSwipeGestures();
    }

    // ========== SWIPE GESTURES ==========
    function addSwipeGestures() {
        let touchStartX = 0;
        let touchEndX = 0;

        pdfViewerContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        pdfViewerContainer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });

        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    // Swipe left - next page
                    goToNextPage();
                } else {
                    // Swipe right - previous page
                    goToPreviousPage();
                }
            }
        }
    }

    // Wait for DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
