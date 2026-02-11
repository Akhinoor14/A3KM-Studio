// ============================================================================
// BOOK READER - PDF Book Viewer (Mobile)
// Displays PDF books with navigation and bookmarking
// ============================================================================

(function() {
    'use strict';

    // ========== STATE ==========
    let allBooks = [];
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

    // ========== LOAD BOOKS FROM JSON ==========
    async function loadBooksFromJSON() {
        try {
            const response = await fetch('../../../Content Code/content.json');
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const data = await response.json();
            allBooks = data['books-pdfs'] || [];
            console.log(`📚 Loaded ${allBooks.length} books from content.json`);
            
            // Load the current book
            loadBook();
        } catch (error) {
            console.error('❌ Failed to load books:', error);
            pdfViewerContainer.innerHTML = `
                <div style="padding: 60px 20px; text-align: center;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 56px; color: #CC0000; margin-bottom: 20px;"></i>
                    <h3 style="font-size: 18px; font-weight: 700; margin-bottom: 12px; color: var(--text-primary);">Failed to Load</h3>
                    <p style="color: var(--text-dim); margin-bottom: 24px;">Could not load book data. Please check your connection.</p>
                    <button onclick="location.reload()" style="padding: 12px 24px; background: #CC0000; color: #fff; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">Retry</button>
                </div>
            `;
        }
    }

    // ========== GET BOOK ID FROM URL ==========
    function getBookIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id') || allBooks[0]?.id; // Default to first book
    }

    // ========== LOAD BOOK ==========
    function loadBook() {
        const bookId = getBookIdFromUrl();
        currentBook = allBooks.find(b => b.id === bookId);

        if (!currentBook) {
            pdfViewerContainer.innerHTML = `
                <div style="padding: 60px 20px; text-align: center;">
                    <i class="fas fa-exclamation-circle" style="font-size: 56px; color: #CC0000; margin-bottom: 20px;"></i>
                    <h3 style="font-size: 18px; font-weight: 700; margin-bottom: 12px; color: var(--text-primary);">Book Not Found</h3>
                    <p style="color: var(--text-dim); margin-bottom: 24px;">The book you're looking for doesn't exist.</p>
                    <a href="book-listing.html" style="display: inline-block; padding: 12px 24px; background: #CC0000; color: #fff; border-radius: 8px; text-decoration: none; font-weight: 600;">Back to Library</a>
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
        // Display book preview with Read button
        pdfViewerContainer.innerHTML = `
            <div class="pdf-placeholder">
                <i class="fas fa-book-open"></i>
                <h3>${currentBook.title}</h3>
                <p>${currentBook.pages} pages • ${currentBook.size}</p>
                <p style="margin-top: 16px; max-width: 300px; margin-left: auto; margin-right: auto; line-height: 1.5;">
                    Tap below to open this book in the mobile-optimized PDF viewer with pinch-to-zoom and touch gestures.
                </p>
                <button id="openPDFBtn" style="margin-top: 24px; padding: 14px 28px; background: linear-gradient(135deg, rgba(204,0,0,0.3), rgba(139,0,0,0.2)); border: 1px solid rgba(204,0,0,0.5); color: #fff; border-radius: 12px; font-weight: 700; cursor: pointer; box-shadow: inset 0 1px 0 rgba(255,255,255,0.1);">
                    <i class="fas fa-book-reader"></i> Read Book
                </button>
            </div>
        `;

        // Attach open PDF viewer handler
        const openPDFBtn = document.getElementById('openPDFBtn');
        if (openPDFBtn) {
            openPDFBtn.addEventListener('click', () => {
                // Use downloadUrl from content.json
                const pdfPath = currentBook.downloadUrl || currentBook.pdfUrl || '#';
                
                if (window.openMobilePDFViewer) {
                    openMobilePDFViewer({
                        filePath: pdfPath,
                        fileType: 'pdf',
                        title: currentBook.title,
                        downloadName: `${currentBook.title.replace(/[^a-z0-9]/gi, '_')}.pdf`,
                        showDownload: false, // Don't prompt for download when reading
                        allowZoom: true
                    });
                } else {
                    // Fallback: Open PDF in new tab for inline viewing
                    window.open(pdfPath, '_blank');
                }
            });
        }
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
            
            // Reload PDF with new page
            // In production: pdfViewer.goToPage(currentPage);
            saveReadingProgress();
        }
    }

    function goToNextPage() {
        if (currentPage < currentBook.pages) {
            currentPage++;
            updatePageInfo();
            
            // Reload PDF with new page
            // In production: pdfViewer.goToPage(currentPage);
            saveReadingProgress();
        }
    }

    // ========== EVENT HANDLERS ==========
    function toggleInfoPanel() {
        isInfoPanelOpen = !isInfoPanelOpen;
        bookInfoPanel.classList.toggle('active', isInfoPanelOpen);
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
        // Removed excessive vibration feedback
        // Only keeping vibration for bookmark action (important)
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
        // Load books from JSON first, then load current book
        loadBooksFromJSON();

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
