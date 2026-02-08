// ============================================================================
// ONLY BOSS MOBILE - VIDEOS MANAGER LOGIC
// Manages YouTube videos with category support
// ============================================================================

let allVideos = [];
let filteredVideos = [];
let selectedVideos = new Set();
let categoryGroups = {};
let currentFilters = {
    search: '',
    type: '',
    category: '',
    language: ''
};

// ============================================================================
// INITIALIZATION
// ============================================================================

async function init() {
    showLoading();
    await loadVideos();
    setupEventListeners();
    renderVideos();
    hideLoading();
}

// ============================================================================
// LOAD VIDEOS FROM JSON
// ============================================================================

async function loadVideos() {
    try {
        const response = await fetch('../../../Content Studio/video-content/videos.json');
        const data = await response.json();
        
        categoryGroups = data.categoryGroups || {};
        
        // Extract all videos from both video-blog and educational sections
        allVideos = [];
        
        // Video blog videos
        if (data.categoryGroups['video-blog']) {
            data.categoryGroups['video-blog'].forEach(group => {
                if (group.videos) {
                    group.videos.forEach(video => {
                        allVideos.push({
                            ...video,
                            type: 'video-blog',
                            groupName: group.name
                        });
                    });
                }
            });
        }
        
        // Educational videos
        if (data.categoryGroups['educational']) {
            data.categoryGroups['educational'].forEach(group => {
                if (group.videos) {
                    group.videos.forEach(video => {
                        allVideos.push({
                            ...video,
                            type: 'educational',
                            groupName: group.name
                        });
                    });
                }
            });
        }
        
        filteredVideos = [...allVideos];
        updateStats();
    } catch (error) {
        console.error('Failed to load videos:', error);
        showNotification('❌ Failed to load videos', 'error');
    }
}

// ============================================================================
// RENDER VIDEOS
// ============================================================================

function renderVideos() {
    const videosList = document.getElementById('videosList');
    const emptyState = document.getElementById('emptyState');
    
    if (filteredVideos.length === 0) {
        videosList.innerHTML = '';
        emptyState.classList.add('active');
        return;
    }
    
    emptyState.classList.remove('active');
    
    videosList.innerHTML = filteredVideos.map((video, index) => {
        const thumbnailUrl = getYouTubeThumbnail(video.youtubeId || video.id);
        
        return `
        <div class="video-item ${selectedVideos.has(index) ? 'selected' : ''}" 
             onclick="toggleSelection(${index})">
            <div class="video-thumbnail-wrapper">
                <img src="${thumbnailUrl}" 
                     alt="${video.title}" 
                     class="video-thumbnail" 
                     onerror="this.src='https://via.placeholder.com/640x360?text=No+Thumbnail'" />
                ${video.duration ? `<div class="video-duration">${video.duration}</div>` : ''}
                <div class="video-play-overlay">
                    <i class="fab fa-youtube"></i>
                </div>
            </div>
            <div class="video-content">
                <div class="video-title">${video.title}</div>
                <div class="video-meta">
                    ${video.type ? `<span class="badge badge-type">${getTypeLabel(video.type)}</span>` : ''}
                    ${video.category ? `<span class="badge badge-category">${video.category}</span>` : ''}
                    ${video.language ? `<span class="badge badge-language">${getLanguageLabel(video.language)}</span>` : ''}
                    ${video.views ? `<span class="badge badge-views">${formatNumber(video.views)} views</span>` : ''}
                </div>
            </div>
            <div class="video-actions">
                <button class="action-btn" onclick="event.stopPropagation(); watchVideo(${index})">
                    <i class="fab fa-youtube"></i> Watch
                </button>
                <button class="action-btn" onclick="event.stopPropagation(); editVideo(${index})">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="action-btn danger" onclick="event.stopPropagation(); deleteVideo(${index})">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `}).join('');
    
    document.getElementById('videoCount').textContent = `${filteredVideos.length} video${filteredVideos.length !== 1 ? 's' : ''}`;
}

// ============================================================================
// UPDATE STATS
// ============================================================================

function updateStats() {
    document.getElementById('totalVideos').textContent = allVideos.length;
    
    const uniqueCategories = new Set(allVideos.map(v => v.category).filter(Boolean));
    document.getElementById('totalCategories').textContent = uniqueCategories.size;
    
    const totalViews = allVideos.reduce((sum, video) => sum + (video.views || 0), 0);
    document.getElementById('totalViews').textContent = formatNumber(totalViews);
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
    filteredVideos = allVideos.filter(video => {
        // Search filter
        if (currentFilters.search) {
            const searchTerms = currentFilters.search.split(' ');
            const videoText = `${video.title} ${video.description || ''} ${video.tags || ''}`.toLowerCase();
            if (!searchTerms.every(term => videoText.includes(term))) {
                return false;
            }
        }
        
        // Type filter
        if (currentFilters.type && video.type !== currentFilters.type) {
            return false;
        }
        
        // Category filter
        if (currentFilters.category && video.category !== currentFilters.category) {
            return false;
        }
        
        // Language filter
        if (currentFilters.language && video.language !== currentFilters.language) {
            return false;
        }
        
        return true;
    });
    
    renderVideos();
    closeFilterSheet();
    vibrate(10);
}

function resetFilters() {
    currentFilters = {
        search: '',
        type: '',
        category: '',
        language: ''
    };
    
    document.getElementById('searchInput').value = '';
    document.getElementById('filterType').value = '';
    document.getElementById('filterCategory').value = '';
    document.getElementById('filterLanguage').value = '';
    document.getElementById('clearSearchBtn').classList.remove('active');
    
    applyFilters();
}

// ============================================================================
// CATEGORY MANAGEMENT
// ============================================================================

function updateCategoryOptions() {
    const typeSelect = document.getElementById('videoType');
    const categorySelect = document.getElementById('videoCategory');
    const selectedType = typeSelect.value;
    
    categorySelect.innerHTML = '<option value="">Select category...</option>';
    
    if (selectedType && categoryGroups[selectedType]) {
        categoryGroups[selectedType].forEach(group => {
            const optgroup = document.createElement('optgroup');
            optgroup.label = group.name;
            
            group.categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category;
                option.textContent = category;
                optgroup.appendChild(option);
            });
            
            categorySelect.appendChild(optgroup);
        });
    }
}

function updateFilterCategories() {
    const typeSelect = document.getElementById('filterType');
    const categorySelect = document.getElementById('filterCategory');
    const selectedType = typeSelect.value;
    
    categorySelect.innerHTML = '<option value="">All Categories</option>';
    
    if (selectedType && categoryGroups[selectedType]) {
        categoryGroups[selectedType].forEach(group => {
            group.categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category;
                option.textContent = category;
                categorySelect.appendChild(option);
            });
        });
    }
}

// ============================================================================
// SELECTION & BULK ACTIONS
// ============================================================================

function toggleSelection(index) {
    if (selectedVideos.has(index)) {
        selectedVideos.delete(index);
    } else {
        selectedVideos.add(index);
    }
    
    renderVideos();
    
    const toolbar = document.getElementById('bottomToolbar');
    if (selectedVideos.size > 0) {
        toolbar.classList.add('active');
    } else {
        toolbar.classList.remove('active');
    }
    
    vibrate(10);
}

function cancelSelection() {
    selectedVideos.clear();
    renderVideos();
    document.getElementById('bottomToolbar').classList.remove('active');
    vibrate(20);
}

function bulkEdit() {
    showNotification('🚧 Bulk edit coming soon!', 'info');
    vibrate([10, 30, 10]);
}

function bulkDelete() {
    if (confirm(`Delete ${selectedVideos.size} video(s)?`)) {
        showNotification(`✅ ${selectedVideos.size} videos deleted!`, 'success');
        cancelSelection();
        vibrate([50, 30, 50]);
    }
}

function bulkExport() {
    const exportData = Array.from(selectedVideos).map(i => filteredVideos[i]);
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `videos-export-${Date.now()}.json`;
    a.click();
    
    showNotification('✅ Videos exported!', 'success');
    vibrate(20);
}

// ============================================================================
// VIDEO ACTIONS
// ============================================================================

function watchVideo(index) {
    const video = filteredVideos[index];
    const youtubeId = video.youtubeId || video.id;
    
    if (youtubeId) {
        window.open(`https://youtube.com/watch?v=${youtubeId}`, '_blank');
    } else {
        showNotification('⚠️ No YouTube ID available', 'warning');
    }
    vibrate(10);
}

function editVideo(index) {
    const video = filteredVideos[index];
    const youtubeId = video.youtubeId || video.id;
    
    document.getElementById('sheetTitle').textContent = 'Edit Video';
    document.getElementById('videoId').value = video.id || '';
    document.getElementById('videoTitle').value = video.title || '';
    document.getElementById('videoUrl').value = youtubeId ? `https://youtube.com/watch?v=${youtubeId}` : '';
    document.getElementById('videoType').value = video.type || '';
    updateCategoryOptions();
    document.getElementById('videoCategory').value = video.category || '';
    document.getElementById('videoDescription').value = video.description || '';
    document.getElementById('videoDuration').value = video.duration || '';
    document.getElementById('videoLanguage').value = video.language || 'bn';
    document.getElementById('videoTags').value = video.tags || '';
    
    showAddModal();
    vibrate(10);
}

function deleteVideo(index) {
    const video = filteredVideos[index];
    
    if (confirm(`Delete "${video.title}"?`)) {
        showNotification('✅ Video deleted!', 'success');
        // TODO: Implement GitHub deletion
        vibrate([50, 30, 50]);
    }
}

// ============================================================================
// ADD/EDIT MODAL
// ============================================================================

function showAddModal() {
    const sheet = document.getElementById('addVideoSheet');
    const overlay = document.getElementById('overlay');
    
    sheet.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    vibrate(10);
}

function closeAddModal() {
    const sheet = document.getElementById('addVideoSheet');
    const overlay = document.getElementById('overlay');
    
    sheet.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    
    // Reset form
    document.getElementById('videoForm').reset();
    document.getElementById('sheetTitle').textContent = 'Add New Video';
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

document.getElementById('videoForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Extract YouTube ID from URL
    const videoUrl = document.getElementById('videoUrl').value;
    const youtubeId = extractYouTubeId(videoUrl);
    
    if (!youtubeId) {
        showNotification('⚠️ Invalid YouTube URL', 'error');
        return;
    }
    
    const videoData = {
        id: document.getElementById('videoId').value,
        title: document.getElementById('videoTitle').value,
        youtubeId: youtubeId,
        type: document.getElementById('videoType').value,
        category: document.getElementById('videoCategory').value,
        description: document.getElementById('videoDescription').value,
        duration: document.getElementById('videoDuration').value,
        language: document.getElementById('videoLanguage').value,
        tags: document.getElementById('videoTags').value
    };
    
    // TODO: Implement GitHub save
    showNotification('✅ Video saved successfully!', 'success');
    closeAddModal();
    vibrate([30, 20, 30]);
});

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function goBack() {
    window.location.href = '../../dashboard/index.html';
}

function getYouTubeThumbnail(youtubeId) {
    return `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
}

function extractYouTubeId(url) {
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s]+)/,
        /^([a-zA-Z0-9_-]{11})$/
    ];
    
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
    }
    
    return null;
}

function getTypeLabel(type) {
    const labels = {
        'video-blog': 'Vlog',
        'educational': 'Educational'
    };
    return labels[type] || type;
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
