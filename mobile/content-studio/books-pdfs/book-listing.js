// ============================================================================
// BOOK LISTING - Books & PDFs Section (Mobile)
// Loads books from content.json and displays with download options
// ============================================================================

(function() {
    'use strict';

    // ========== STATE ==========
    let allBooks = [];

    // ========== DOM ELEMENTS ==========
    const searchInput = document.getElementById('searchInput');
    const contentGrid = document.getElementById('contentGrid');

    // ========== INITIALIZATION ==========
    document.addEventListener('DOMContentLoaded', () => {
        loadBooksFromJSON();
    });

    /**
     * Load books directly from books.json (just like desktop!)
     * This ensures mobile automatically shows new books without manual sync
     */
    async function loadBooksFromJSON() {
        try {
            showLoadingState();
            
            // ✅ Load directly from desktop JSON file
            const response = await fetch('../../../Content Studio/books-pdfs/books.json');
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const data = await response.json();
            allBooks = data.books || [];
            console.log(`\ud83d\udcda Loaded ${allBooks.length} books from books.json`);
            
            hideLoadingState();
            renderBooks(allBooks);
            setupEventListeners();
        } catch (error) {
            console.error('\u274c Failed to load books:', error);
            hideLoadingState();
            showErrorState('Failed to load books. Please check your connection.');
        }
    }

    /**
     * Show loading state
     */
    function showLoadingState() {
        contentGrid.innerHTML = `
            <div class=\"loading-state\">
                <div class=\"loading-spinner\"></div>
                <p>Loading books...</p>
            </div>
        `;
    }

    /**
     * Hide loading state
     */
    function hideLoadingState() {
        const loadingState = contentGrid.querySelector('.loading-state');
        if (loadingState) loadingState.remove();
    }

    /**
     * Show error state
     */
    function showErrorState(message) {
        contentGrid.innerHTML = `
            <div class=\"error-state\">
                <i class=\"fas fa-exclamation-circle\"></i>
                <h3>Oops!</h3>
                <p>${message}</p>
                <button onclick=\"location.reload()\" class=\"retry-btn\">
                    <i class=\"fas fa-redo\"></i> Try Again
                </button>
            </div>
        `;
    }

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

        contentGrid.innerHTML = booksToRender.map(book => {
            const languageDisplay = getLanguageDisplay(book.language);
            
            return `
            <div class="content-item book-item" data-book-id="${book.id}">
                <div class="content-thumbnail book-thumbnail">
                    ${book.cover ? 
                        `<img src="${book.cover}" alt="${book.title}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">` :
                        ''
                    }
                    <i class="fas fa-book" ${book.cover ? 'style="display:none;"' : ''}></i>
                    <span class="book-badge">${languageDisplay}</span>
                </div>
                <div class="content-info-wrap">
                    <span class="book-category">${book.category}</span>
                    <h3 class="content-item-title">${book.title}</h3>
                    <div class="content-item-meta">
                        <span class="book-pages"><i class="fas fa-file-pdf"></i> ${book.pages} pages</span>
                        <span><i class="fas fa-database"></i> ${book.size}</span>
                        <span><i class="fas fa-file"></i> ${book.format}</span>
                    </div>
                    <p class="content-item-desc">${truncateText(book.description, 120)}</p>
                    <div class="content-tags">
                        ${book.tags.slice(0, 4).map(tag => `<span class="content-tag">${tag}</span>`).join('')}
                    </div>
                    ${book.author ? `<div style="margin-top: 8px; font-size: 11px; color: var(--text-dim);"><i class="fas fa-user"></i> ${book.author}</div>` : ''}
                    <div class="book-actions">
                        <button class="read-btn" data-book-id="${book.id}" data-action="read">
                            <i class="fas fa-book-reader"></i>
                            <span>Read</span>
                        </button>
                        <button class="download-btn" data-book-id="${book.id}" data-action="download">
                            <i class="fas fa-download"></i>
                            <span>Download</span>
                        </button>
                    </div>
                </div>
            </div>
            `;
        }).join('');

        // Add haptic feedback and click handlers
        addHapticFeedback();
    }

    /**
     * Get language display badge
     */
    function getLanguageDisplay(lang) {
        const displays = {
            'bn': '\ud83c\udde7\ud83c\udde9 \u09ac\u09be\u0982',
            'en': '\ud83c\uddec\ud83c\udde7 EN',
            'bn-en': '\ud83c\udde7\ud83c\udde9 EN',
            'en-bn': '\ud83c\uddec\ud83c\udde7 \u09ac\u09be\u0982'
        };
        return displays[lang] || 'EN';
    }

    /**
     * Truncate text to specified length
     */
    function truncateText(text, maxLength) {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength).trim() + '...';
    }

    // ========== SEARCH FUNCTIONALITY ==========
    function searchBooks() {
        const query = searchInput.value.toLowerCase().trim();

        const filtered = allBooks.filter(book => {
            return book.title.toLowerCase().includes(query) ||
                   book.description.toLowerCase().includes(query) ||
                   book.category.toLowerCase().includes(query) ||
                   book.tags.some(tag => tag.toLowerCase().includes(query));
        });

        // Sort by date (newest first)
        filtered.sort((a, b) => {
            return new Date(b.publishDate) - new Date(a.publishDate);
        });

        renderBooks(filtered);
    }

    // ========== HELPER FUNCTIONS ==========
    function addHapticFeedback() {
        const readBtns = document.querySelectorAll('.read-btn');
        const downloadBtns = document.querySelectorAll('.download-btn');
        const bookItems = document.querySelectorAll('.book-item');
        
        // Read button handlers
        readBtns.forEach(btn => {
            btn.addEventListener('touchstart', (e) => {
                e.stopPropagation(); // Prevent card click
                if (navigator.vibrate) navigator.vibrate(10);
            });

            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation(); // Prevent card click
                const bookId = btn.getAttribute('data-book-id');
                handleRead(bookId);
            });
        });
        
        // Download button handlers
        downloadBtns.forEach(btn => {
            btn.addEventListener('touchstart', (e) => {
                e.stopPropagation(); // Prevent card click
                if (navigator.vibrate) navigator.vibrate(10);
            });

            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation(); // Prevent card click
                const bookId = btn.getAttribute('data-book-id');
                handleDownload(bookId);
            });
        });
        
        // Make card clickable to open reader
        bookItems.forEach(item => {
            item.addEventListener('touchstart', (e) => {
                // Only trigger if not clicking on buttons
                if (!e.target.closest('.read-btn') && !e.target.closest('.download-btn')) {
                    if (navigator.vibrate) navigator.vibrate(10);
                }
            });
            
            item.addEventListener('click', (e) => {
                // Only trigger if not clicking on buttons
                if (!e.target.closest('.read-btn') && !e.target.closest('.download-btn')) {
                    const bookId = item.getAttribute('data-book-id');
                    handleRead(bookId);
                }
            });
        });
    }

    function handleRead(bookId) {
        const book = allBooks.find(b => b.id === bookId);
        if (book) {
            // Vibration feedback
            if (navigator.vibrate) {
                navigator.vibrate([30, 50, 30]);
            }

            console.log(`Opening book for reading: ${book.title}`);
            
            // Open in book reader
            window.location.href = `book-reader.html?id=${bookId}`;
        }
    }

    function handleDownload(bookId) {
        const book = allBooks.find(b => b.id === bookId);
        if (book) {
            // Vibration feedback
            if (navigator.vibrate) {
                navigator.vibrate([10, 20, 10, 20, 10]);
            }

            console.log(`Downloading book: ${book.title}`);
            
            // Trigger download
            if (book.downloadUrl) {
                const link = document.createElement('a');
                link.href = book.downloadUrl;
                link.download = `${book.title.replace(/[^a-z0-9]/gi, '_')}.pdf`;
                link.target = '_blank';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                showToast('📥 Downloading ' + book.title);
            } else {
                showToast('⚠️ Download link not available');
            }
        }
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
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
            animation: fadeInOut 3s ease;
        `;
        
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    /**
     * Setup event listeners
     */
    function setupEventListeners() {
        // Search functionality with debounce
        let searchTimeout;
        searchInput.addEventListener('input', () => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(searchBooks, 300);
        });

        // Back button haptic feedback
        const backBtn = document.querySelector('.back-btn');
        if (backBtn) {
            backBtn.addEventListener('touchstart', () => {
                if (navigator.vibrate) navigator.vibrate(10);
            });
        }
    }

})();
