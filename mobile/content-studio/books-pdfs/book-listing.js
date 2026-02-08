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
     * Load books from central content.json
     */
    async function loadBooksFromJSON() {
        try {
            showLoadingState();
            
            const response = await fetch('../../../Content Code/content.json');
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const data = await response.json();
            allBooks = data['books-pdfs'] || [];
            console.log(`\ud83d\udcda Loaded ${allBooks.length} books`);
            
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
                        `<img src="${book.cover}" alt="${book.title}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">` :
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
                    ${ book.author ? `<div style="margin-top: 8px; font-size: 11px; color: var(--text-dim);"><i class="fas fa-user"></i> ${book.author}</div>` : ''}
                    <button class="download-btn" data-book-id="${book.id}">
                        <i class="fas fa-download"></i>
                        <span>Read / Download</span>
                    </button>
                </div>
            </div>
            `;
        }).join('');

        // Add haptic feedback
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
        const book = allBooks.find(b => b.id === bookId);
        if (book) {
            // Vibration feedback
            if (navigator.vibrate) {
                navigator.vibrate([30, 50, 30]);
            }

            console.log(`Opening book: ${book.title}`);
            
            // Open in book reader
            window.location.href = `book-reader.html?id=${bookId}`;
        }
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
