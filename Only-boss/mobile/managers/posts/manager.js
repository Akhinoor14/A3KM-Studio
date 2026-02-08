// ============================================================================
// ONLY BOSS MOBILE - POSTS MANAGER LOGIC
// Manages written posts/articles with Markdown support
// ============================================================================

let allPosts = [];
let filteredPosts = [];
let selectedPosts = new Set();
let categoryGroups = [];
let currentFilters = {
    search: '',
    category: '',
    language: '',
    status: ''
};

// ============================================================================
// INITIALIZATION
// ============================================================================

async function init() {
    showLoading();
    await loadPosts();
    await loadCategories();
    setupEventListeners();
    renderPosts();
    hideLoading();
}

// ============================================================================
// LOAD POSTS FROM JSON
// ============================================================================

async function loadPosts() {
    try {
        const response = await fetch('../../../Content Studio/written-posts/posts.json');
        const data = await response.json();
        
        // Extract posts if they exist in the JSON
        allPosts = data.posts || [];
        
        filteredPosts = [...allPosts];
        updateStats();
    } catch (error) {
        console.error('Failed to load posts:', error);
        showNotification('❌ Failed to load posts', 'error');
    }
}

// ============================================================================
// LOAD CATEGORIES
// ============================================================================

async function loadCategories() {
    try {
        const response = await fetch('../../../Content Studio/written-posts/posts.json');
        const data = await response.json();
        
        categoryGroups = data.categoryGroups || [];
        
        const categorySelect = document.getElementById('postCategory');
        const filterCategorySelect = document.getElementById('filterCategory');
        
        categoryGroups.forEach(group => {
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
    } catch (error) {
        console.error('Failed to load categories:', error);
    }
}

// ============================================================================
// RENDER POSTS
// ============================================================================

function renderPosts() {
    const postsList = document.getElementById('postsList');
    const emptyState = document.getElementById('emptyState');
    
    if (filteredPosts.length === 0) {
        postsList.innerHTML = '';
        emptyState.classList.add('active');
        return;
    }
    
    emptyState.classList.remove('active');
    
    postsList.innerHTML = filteredPosts.map((post, index) => `
        <div class="post-item ${selectedPosts.has(index) ? 'selected' : ''}" 
             onclick="toggleSelection(${index})">
            ${post.cover ? `<img src="${post.cover}" alt="${post.title}" class="post-cover" onerror="this.style.display='none'" />` : ''}
            <div class="post-content">
                <div class="post-title">${post.title}</div>
                ${post.excerpt ? `<div class="post-excerpt">${post.excerpt}</div>` : ''}
                
                <div class="post-meta">
                    ${post.author ? `
                        <div class="post-author">
                            <i class="fas fa-user"></i>
                            <span>${post.author}</span>
                        </div>
                        <span class="post-divider">•</span>
                    ` : ''}
                    ${post.date ? `<div class="post-date">${formatDate(post.date)}</div>` : ''}
                    ${post.readTime ? `
                        <span class="post-divider">•</span>
                        <div class="post-date">${post.readTime} min read</div>
                    ` : ''}
                </div>
                
                <div class="post-tags">
                    ${post.category ? `<span class="badge badge-category">${post.category}</span>` : ''}
                    ${post.language ? `<span class="badge badge-language">${getLanguageLabel(post.language)}</span>` : ''}
                    ${post.status ? `<span class="badge ${post.status === 'draft' ? 'badge-draft' : 'badge-status'}">${post.status}</span>` : ''}
                    ${post.wordCount ? `<span class="badge badge-words">${formatNumber(post.wordCount)} words</span>` : ''}
                </div>
                
                <div class="post-actions">
                    <button class="action-btn" onclick="event.stopPropagation(); viewPost(${index})">
                        <i class="fas fa-eye"></i> View
                    </button>
                    <button class="action-btn" onclick="event.stopPropagation(); editPost(${index})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="action-btn danger" onclick="event.stopPropagation(); deletePost(${index})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    document.getElementById('postCount').textContent = `${filteredPosts.length} post${filteredPosts.length !== 1 ? 's' : ''}`;
}

// ============================================================================
// UPDATE STATS
// ============================================================================

function updateStats() {
    document.getElementById('totalPosts').textContent = allPosts.length;
    
    const uniqueCategories = new Set(allPosts.map(p => p.category).filter(Boolean));
    document.getElementById('totalCategories').textContent = uniqueCategories.size;
    
    const totalWords = allPosts.reduce((sum, post) => sum + (post.wordCount || 0), 0);
    document.getElementById('totalWords').textContent = formatNumber(totalWords);
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
    filteredPosts = allPosts.filter(post => {
        // Search filter
        if (currentFilters.search) {
            const searchTerms = currentFilters.search.split(' ');
            const postText = `${post.title} ${post.excerpt || ''} ${post.author || ''} ${post.tags || ''}`.toLowerCase();
            if (!searchTerms.every(term => postText.includes(term))) {
                return false;
            }
        }
        
        // Category filter
        if (currentFilters.category && post.category !== currentFilters.category) {
            return false;
        }
        
        // Language filter
        if (currentFilters.language && post.language !== currentFilters.language) {
            return false;
        }
        
        // Status filter
        if (currentFilters.status && post.status !== currentFilters.status) {
            return false;
        }
        
        return true;
    });
    
    renderPosts();
    closeFilterSheet();
    vibrate(10);
}

function resetFilters() {
    currentFilters = {
        search: '',
        category: '',
        language: '',
        status: ''
    };
    
    document.getElementById('searchInput').value = '';
    document.getElementById('filterCategory').value = '';
    document.getElementById('filterLanguage').value = '';
    document.getElementById('filterStatus').value = '';
    document.getElementById('clearSearchBtn').classList.remove('active');
    
    applyFilters();
}

// ============================================================================
// SELECTION & BULK ACTIONS
// ============================================================================

function toggleSelection(index) {
    if (selectedPosts.has(index)) {
        selectedPosts.delete(index);
    } else {
        selectedPosts.add(index);
    }
    
    renderPosts();
    
    const toolbar = document.getElementById('bottomToolbar');
    if (selectedPosts.size > 0) {
        toolbar.classList.add('active');
    } else {
        toolbar.classList.remove('active');
    }
    
    vibrate(10);
}

function cancelSelection() {
    selectedPosts.clear();
    renderPosts();
    document.getElementById('bottomToolbar').classList.remove('active');
    vibrate(20);
}

function bulkEdit() {
    showNotification('🚧 Bulk edit coming soon!', 'info');
    vibrate([10, 30, 10]);
}

function bulkDelete() {
    if (confirm(`Delete ${selectedPosts.size} post(s)?`)) {
        showNotification(`✅ ${selectedPosts.size} posts deleted!`, 'success');
        cancelSelection();
        vibrate([50, 30, 50]);
    }
}

function bulkExport() {
    const exportData = Array.from(selectedPosts).map(i => filteredPosts[i]);
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `posts-export-${Date.now()}.json`;
    a.click();
    
    showNotification('✅ Posts exported!', 'success');
    vibrate(20);
}

// ============================================================================
// POST ACTIONS
// ============================================================================

function viewPost(index) {
    const post = filteredPosts[index];
    
    // Open post viewer (would open mobile reader)
    showNotification('📖 Opening post viewer...', 'info');
    
    // TODO: Implement post viewer
    // window.location.href = `../../../Content Studio/written-posts/post-reader.html?id=${post.id}`;
    
    vibrate(10);
}

function editPost(index) {
    const post = filteredPosts[index];
    
    document.getElementById('sheetTitle').textContent = 'Edit Post';
    document.getElementById('postId').value = post.id || '';
    document.getElementById('postTitle').value = post.title || '';
    document.getElementById('postCategory').value = post.category || '';
    document.getElementById('postExcerpt').value = post.excerpt || '';
    document.getElementById('postContent').value = post.content || '';
    document.getElementById('postAuthor').value = post.author || '';
    document.getElementById('postLanguage').value = post.language || 'en';
    document.getElementById('postTags').value = Array.isArray(post.tags) ? post.tags.join(', ') : (post.tags || '');
    document.getElementById('postCover').value = post.cover || '';
    
    showAddModal();
    vibrate(10);
}

function deletePost(index) {
    const post = filteredPosts[index];
    
    if (confirm(`Delete "${post.title}"?`)) {
        showNotification('✅ Post deleted!', 'success');
        // TODO: Implement GitHub deletion
        vibrate([50, 30, 50]);
    }
}

// ============================================================================
// ADD/EDIT MODAL
// ============================================================================

function showAddModal() {
    const sheet = document.getElementById('addPostSheet');
    const overlay = document.getElementById('overlay');
    
    sheet.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    vibrate(10);
}

function closeAddModal() {
    const sheet = document.getElementById('addPostSheet');
    const overlay = document.getElementById('overlay');
    
    sheet.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    
    // Reset form
    document.getElementById('postForm').reset();
    document.getElementById('sheetTitle').textContent = 'Add New Post';
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

document.getElementById('postForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const content = document.getElementById('postContent').value;
    const wordCount = content.split(/\s+/).filter(Boolean).length;
    const readTime = Math.ceil(wordCount / 200); // Average reading speed
    
    const postData = {
        id: document.getElementById('postId').value || `post-${Date.now()}`,
        title: document.getElementById('postTitle').value,
        category: document.getElementById('postCategory').value,
        excerpt: document.getElementById('postExcerpt').value,
        content: content,
        author: document.getElementById('postAuthor').value,
        language: document.getElementById('postLanguage').value,
        tags: document.getElementById('postTags').value.split(',').map(t => t.trim()).filter(Boolean),
        cover: document.getElementById('postCover').value,
        wordCount: wordCount,
        readTime: readTime,
        date: new Date().toISOString(),
        status: 'published'
    };
    
    // TODO: Implement GitHub save
    showNotification('✅ Post saved successfully!', 'success');
    closeAddModal();
    vibrate([30, 20, 30]);
});

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function goBack() {
    window.location.href = '../../dashboard/index.html';
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function getLanguageLabel(lang) {
    const labels = {
        'en': 'English',
        'bn': 'বাংলা',
        'hi': 'हिन्दी'
    };
    return labels[lang] || lang;
}

function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
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
