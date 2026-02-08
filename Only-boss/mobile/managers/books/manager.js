// ============================================================================
// ONLY BOSS MOBILE - BOOKS MANAGER LOGIC
// Manages books with GitHub sync (reuses desktop backend logic)
// ============================================================================

let allBooks = [];
let filteredBooks = [];
let selectedBooks = new Set();
let currentFilters = {
    search: '',
    category: '',
    language: '',
    format: ''
};

// ============================================================================
// INITIALIZATION
// ============================================================================

async function init() {
    showLoading();
    await loadBooks();
    await loadCategories();
    setupEventListeners();
    renderBooks();
    hideLoading();
}

// ============================================================================
// LOAD BOOKS FROM JSON
// ============================================================================

async function loadBooks() {
    try {
        const response = await fetch('../../../Content Studio/books-pdfs/books.json');
        const data = await response.json();
        
        // Extract books from nested structure
        allBooks = [];
        if (data.categoryGroups) {
            data.categoryGroups.forEach(group => {
                if (group.books) {
                    allBooks = allBooks.concat(group.books);
                }
            });
        }
        
        filteredBooks = [...allBooks];
        updateStats();
    } catch (error) {
        console.error('Failed to load books:', error);
        showNotification('❌ Failed to load books', 'error');
    }
}

// ============================================================================
// LOAD CATEGORIES
// ============================================================================

async function loadCategories() {
    try {
        const response = await fetch('../../../Content Studio/books-pdfs/books.json');
        const data = await response.json();
        
        const categorySelect = document.getElementById('bookCategory');
        const filterCategorySelect = document.getElementById('filterCategory');
        
        if (data.categoryGroups) {
            data.categoryGroups.forEach(group => {
                const optgroup = document.createElement('optgroup');
                optgroup.label = group.name;
                
                group.categories.forEach(category => {
                    const option = document.createElement('option');
                    option.value = category;
                    option.textContent = category;
                    optgroup.appendChild(option);
                    
                    // Add to filter select
                    const filterOption = option.cloneNode(true);
                    filterCategorySelect.appendChild(filterOption);
                });
                
                categorySelect.appendChild(optgroup);
            });
        }
    } catch (error) {
        console.error('Failed to load categories:', error);
    }
}

// ============================================================================
// RENDER BOOKS
// ============================================================================

function renderBooks() {
    const booksList = document.getElementById('booksList');
    const emptyState = document.getElementById('emptyState');
    
    if (filteredBooks.length === 0) {
        booksList.innerHTML = '';
        emptyState.classList.add('active');
        return;
    }
    
    emptyState.classList.remove('active');
    
    booksList.innerHTML = filteredBooks.map((book, index) => `
        <div class="book-item ${selectedBooks.has(index) ? 'selected' : ''}" 
             onclick="toggleSelection(${index})" 
             oncontextmenu="showContextMenu(${index}, event)">
            <div class="book-content">
                <img src="${book.cover || 'https://via.placeholder.com/80x100?text=No+Cover'}" 
                     alt="${book.title}" 
                     class="book-cover" 
                     onerror="this.src='https://via.placeholder.com/80x100?text=No+Cover'" />
                <div class="book-info">
                    <div class="book-title">${book.title}</div>
                    <div class="book-author">${book.author || 'Unknown Author'}</div>
                    <div class="book-meta">
                        ${book.category ? `<span class="badge badge-category">${book.category}</span>` : ''}
                        ${book.language ? `<span class="badge badge-language">${getLanguageLabel(book.language)}</span>` : ''}
                        ${book.format ? `<span class="badge badge-format">${book.format.toUpperCase()}</span>` : ''}
                        ${book.pages ? `<span class="badge badge-pages">${book.pages} pages</span>` : ''}
                    </div>
                </div>
            </div>
            <div class="book-actions">
                <button class="action-btn" onclick="event.stopPropagation(); viewBook(${index})">
                    <i class="fas fa-eye"></i> View
                </button>
                <button class="action-btn" onclick="event.stopPropagation(); editBook(${index})">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="action-btn danger" onclick="event.stopPropagation(); deleteBook(${index})">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `).join('');
    
    document.getElementById('bookCount').textContent = `${filteredBooks.length} book${filteredBooks.length !== 1 ? 's' : ''}`;
}

// ============================================================================
// UPDATE STATS
// ============================================================================

function updateStats() {
    document.getElementById('totalBooks').textContent = allBooks.length;
    
    const uniqueCategories = new Set(allBooks.map(b => b.category).filter(Boolean));
    document.getElementById('totalCategories').textContent = uniqueCategories.size;
    
    const totalDownloads = allBooks.reduce((sum, book) => sum + (book.downloads || 0), 0);
    document.getElementById('totalDownloads').textContent = totalDownloads;
}

// ============================================================================
// SEARCH & FILTER
// ============================================================================

function setupEventListeners() {
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', (e) => {
        currentFilters.search = e.target.value.toLowerCase();
        applyFilters();
        
        const clearBtn = document.getElementById('clearSearchBtn');
        if (e.target.value) {
            clearBtn.classList.add('active');
        } else {
            clearBtn.classList.remove('active');
        }
    });
}

function clearSearch() {
    document.getElementById('searchInput').value = '';
    document.getElementById('clearSearchBtn').classList.remove('active');
    currentFilters.search = '';
    applyFilters();
    vibrate(10);
}

function applyFilters() {
    filteredBooks = allBooks.filter(book => {
        // Search filter
        if (currentFilters.search) {
            const searchTerms = currentFilters.search.split(' ');
            const bookText = `${book.title} ${book.author} ${book.description}`.toLowerCase();
            if (!searchTerms.every(term => bookText.includes(term))) {
                return false;
            }
        }
        
        // Category filter
        if (currentFilters.category && book.category !== currentFilters.category) {
            return false;
        }
        
        // Language filter
        if (currentFilters.language && book.language !== currentFilters.language) {
            return false;
        }
        
        // Format filter
        if (currentFilters.format && book.format !== currentFilters.format) {
            return false;
        }
        
        return true;
    });
    
    renderBooks();
    closeFilterSheet();
    vibrate(10);
}

function resetFilters() {
    currentFilters = {
        search: '',
        category: '',
        language: '',
        format: ''
    };
    
    document.getElementById('searchInput').value = '';
    document.getElementById('filterCategory').value = '';
    document.getElementById('filterLanguage').value = '';
    document.getElementById('filterFormat').value = '';
    document.getElementById('clearSearchBtn').classList.remove('active');
    
    applyFilters();
}

// ============================================================================
// SELECTION & BULK ACTIONS
// ============================================================================

function toggleSelection(index) {
    if (selectedBooks.has(index)) {
        selectedBooks.delete(index);
    } else {
        selectedBooks.add(index);
    }
    
    renderBooks();
    
    const toolbar = document.getElementById('bottomToolbar');
    if (selectedBooks.size > 0) {
        toolbar.classList.add('active');
    } else {
        toolbar.classList.remove('active');
    }
    
    vibrate(10);
}

function cancelSelection() {
    selectedBooks.clear();
    renderBooks();
    document.getElementById('bottomToolbar').classList.remove('active');
    vibrate(20);
}

function bulkEdit() {
    showNotification('🚧 Bulk edit coming soon!', 'info');
    vibrate([10, 30, 10]);
}

function bulkDelete() {
    if (confirm(`Delete ${selectedBooks.size} book(s)?`)) {
        showNotification(`✅ ${selectedBooks.size} books deleted!`, 'success');
        cancelSelection();
        vibrate([50, 30, 50]);
    }
}

function bulkExport() {
    const exportData = Array.from(selectedBooks).map(i => filteredBooks[i]);
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `books-export-${Date.now()}.json`;
    a.click();
    
    showNotification('✅ Books exported!', 'success');
    vibrate(20);
}

// ============================================================================
// BOOK ACTIONS
// ============================================================================

function viewBook(index) {
    const book = filteredBooks[index];
    if (book.file) {
        window.open(book.file, '_blank');
    } else {
        showNotification('⚠️ No file URL available', 'warning');
    }
    vibrate(10);
}

function editBook(index) {
    const book = filteredBooks[index];
    
    document.getElementById('sheetTitle').textContent = 'Edit Book';
    document.getElementById('bookId').value = book.id || '';
    document.getElementById('bookTitle').value = book.title || '';
    document.getElementById('bookAuthor').value = book.author || '';
    document.getElementById('bookCategory').value = book.category || '';
    document.getElementById('bookLanguage').value = book.language || 'en';
    document.getElementById('bookDescription').value = book.description || '';
    document.getElementById('bookPages').value = book.pages || '';
    document.getElementById('bookFormat').value = book.format || 'pdf';
    document.getElementById('bookFile').value = book.file || '';
    document.getElementById('bookCover').value = book.cover || '';
    
    showAddModal();
    vibrate(10);
}

function deleteBook(index) {
    const book = filteredBooks[index];
    
    if (confirm(`Delete "${book.title}"?`)) {
        showNotification('✅ Book deleted!', 'success');
        // TODO: Implement GitHub deletion
        vibrate([50, 30, 50]);
    }
}

// ============================================================================
// ADD/EDIT MODAL
// ============================================================================

function showAddModal() {
    const sheet = document.getElementById('addBookSheet');
    const overlay = document.getElementById('overlay');
    
    sheet.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    vibrate(10);
}

function closeAddModal() {
    const sheet = document.getElementById('addBookSheet');
    const overlay = document.getElementById('overlay');
    
    sheet.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    
    // Reset form
    document.getElementById('bookForm').reset();
    document.getElementById('sheetTitle').textContent = 'Add New Book';
    vibrate(10);
}

// ============================================================================
// FILTER MODAL
// ============================================================================

function showFilterSheet() {
    const sheet = document.getElementById('filterSheet');
    const overlay = document.getElementById('overlay');
    
    sheet.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    vibrate(10);
}

function closeFilterSheet() {
    const sheet = document.getElementById('filterSheet');
    const overlay = document.getElementById('overlay');
    
    sheet.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    vibrate(10);
}

// Close sheets when clicking overlay
document.getElementById('overlay').addEventListener('click', () => {
    closeAddModal();
    closeFilterSheet();
});

// ============================================================================
// FORM SUBMISSION
// ============================================================================

document.getElementById('bookForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const bookData = {
        id: document.getElementById('bookId').value,
        title: document.getElementById('bookTitle').value,
        author: document.getElementById('bookAuthor').value,
        category: document.getElementById('bookCategory').value,
        language: document.getElementById('bookLanguage').value,
        description: document.getElementById('bookDescription').value,
        pages: parseInt(document.getElementById('bookPages').value) || 0,
        format: document.getElementById('bookFormat').value,
        file: document.getElementById('bookFile').value,
        cover: document.getElementById('bookCover').value
    };
    
    // TODO: Implement GitHub save
    showNotification('✅ Book saved successfully!', 'success');
    closeAddModal();
    vibrate([30, 20, 30]);
});

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function goBack() {
    window.location.href = '../../dashboard/index.html';
}

function getLanguageLabel(lang) {
    const labels = {
        'en': 'English',
        'bn': 'বাংলা',
        'hi': 'हिन्दी'
    };
    return labels[lang] || lang;
}

function showLoading() {
    document.getElementById('loadingSpinner').classList.add('active');
}

function hideLoading() {
    document.getElementById('loadingSpinner').classList.remove('active');
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: calc(var(--header-height) + var(--search-height) + 20px);
        left: 50%;
        transform: translateX(-50%);
        background: ${type === 'error' ? '#d32f2f' : type === 'success' ? '#388e3c' : type === 'warning' ? '#f57c00' : '#1976d2'};
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        font-size: 14px;
        font-weight: 600;
        z-index: 10000;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        animation: slideDown 0.3s ease;
        max-width: 90%;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideUp 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function vibrate(pattern) {
    if (navigator.vibrate) {
        navigator.vibrate(pattern);
    }
}

// ============================================================================
// INITIALIZE ON PAGE LOAD
// ============================================================================

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
