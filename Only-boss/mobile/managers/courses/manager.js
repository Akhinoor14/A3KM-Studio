// Courses Manager Logic
let allCourses = [];
let filteredCourses = [];
let selectedCourses = new Set();
let currentFilters = { search: '', category: '', level: '' };

async function init() {
    showLoading();
    await loadCourses();
    await loadCategories();
    setupEventListeners();
    renderCourses();
    hideLoading();
}

async function loadCourses() {
    try {
        const response = await fetch('../../../Content Studio/educational-videos/courses.json');
        const data = await response.json();
        allCourses = data.courses || [];
        filteredCourses = [...allCourses];
        updateStats();
    } catch (error) {
        console.error('Failed to load courses:', error);
        showNotification('❌ Failed to load courses', 'error');
    }
}

async function loadCategories() {
    try {
        const response = await fetch('../../../Content Studio/educational-videos/courses.json');
        const data = await response.json();
        const categorySelect = document.getElementById('courseCategory');
        const filterCategorySelect = document.getElementById('filterCategory');
        
        (data.categoryGroups || []).forEach(group => {
            const optgroup = document.createElement('optgroup');
            optgroup.label = group.name;
            group.categories.forEach(cat => {
                const opt = document.createElement('option');
                opt.value = cat;
                opt.textContent = cat;
                optgroup.appendChild(opt);
                filterCategorySelect.appendChild(opt.cloneNode(true));
            });
            categorySelect.appendChild(optgroup);
        });
    } catch (error) {
        console.error('Failed to load categories:', error);
    }
}

function renderCourses() {
    const list = document.getElementById('coursesList');
    const empty = document.getElementById('emptyState');
    
    if (filteredCourses.length === 0) {
        list.innerHTML = '';
        empty.classList.add('active');
        return;
    }
    
    empty.classList.remove('active');
    list.innerHTML = filteredCourses.map((course, i) => `
        <div class="course-item ${selectedCourses.has(i) ? 'selected' : ''}" onclick="toggleSelection(${i})">
            <div class="course-thumbnail">
                ${course.thumbnail ? 
                    `<img src="${course.thumbnail}" alt="${course.title}" />` : 
                    `<i class="fas fa-graduation-cap" style="font-size: 48px; color: white;"></i>`
                }
                <div class="play-overlay">
                    <i class="fas fa-play"></i>
                </div>
            </div>
            <div class="course-content">
                <div class="course-title">${course.title}</div>
                ${course.instructor ? `
                    <div class="course-instructor">
                        <i class="fas fa-chalkboard-teacher"></i>
                        ${course.instructor}
                    </div>
                ` : ''}
                <div class="course-meta">
                    ${course.category ? `<span class="badge badge-category">${course.category}</span>` : ''}
                    ${course.level ? `<span class="badge badge-level">${course.level}</span>` : ''}
                    ${course.duration ? `<span class="badge badge-duration">${course.duration}h</span>` : ''}
                    ${course.lessons ? `<span class="badge badge-lessons">${course.lessons} lessons</span>` : ''}
                </div>
                <div class="course-actions">
                    <button class="action-btn" onclick="event.stopPropagation(); viewCourse(${i})">
                        <i class="fas fa-play-circle"></i> View
                    </button>
                    <button class="action-btn" onclick="event.stopPropagation(); editCourse(${i})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="action-btn danger" onclick="event.stopPropagation(); deleteCourse(${i})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    document.getElementById('courseCount').textContent = `${filteredCourses.length} course${filteredCourses.length !== 1 ? 's' : ''}`;
}

function updateStats() {
    document.getElementById('totalCourses').textContent = allCourses.length;
    const totalLessons = allCourses.reduce((sum, c) => sum + (c.lessons || 0), 0);
    document.getElementById('totalLessons').textContent = totalLessons;
    const totalDuration = allCourses.reduce((sum, c) => sum + (c.duration || 0), 0);
    document.getElementById('totalDuration').textContent = `${Math.round(totalDuration)}h`;
}

function setupEventListeners() {
    document.getElementById('searchInput').addEventListener('input', (e) => {
        currentFilters.search = e.target.value.toLowerCase();
        applyFilters();
        document.getElementById('clearSearchBtn').classList.toggle('active', !!e.target.value);
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
    filteredCourses = allCourses.filter(course => {
        if (currentFilters.search) {
            const text = `${course.title} ${course.instructor || ''} ${course.description || ''}`.toLowerCase();
            if (!text.includes(currentFilters.search)) return false;
        }
        if (currentFilters.category && course.category !== currentFilters.category) return false;
        if (currentFilters.level && course.level !== currentFilters.level) return false;
        return true;
    });
    renderCourses();
    closeFilterSheet();
    vibrate(10);
}

function resetFilters() {
    currentFilters = { search: '', category: '', level: '' };
    document.getElementById('searchInput').value = '';
    document.getElementById('filterCategory').value = '';
    document.getElementById('filterLevel').value = '';
    document.getElementById('clearSearchBtn').classList.remove('active');
    applyFilters();
}

function toggleSelection(index) {
    selectedCourses.has(index) ? selectedCourses.delete(index) : selectedCourses.add(index);
    renderCourses();
    document.getElementById('bottomToolbar').classList.toggle('active', selectedCourses.size > 0);
    vibrate(10);
}

function cancelSelection() {
    selectedCourses.clear();
    renderCourses();
    document.getElementById('bottomToolbar').classList.remove('active');
    vibrate(20);
}

function bulkDelete() {
    if (confirm(`Delete ${selectedCourses.size} course(s)?`)) {
        showNotification(`✅ ${selectedCourses.size} courses deleted!`, 'success');
        cancelSelection();
        vibrate([50, 30, 50]);
    }
}

function bulkExport() {
    const data = Array.from(selectedCourses).map(i => filteredCourses[i]);
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `courses-export-${Date.now()}.json`;
    a.click();
    showNotification('✅ Courses exported!', 'success');
    vibrate(20);
}

function viewCourse(i) {
    const course = filteredCourses[i];
    if (course.playlistUrl) window.open(course.playlistUrl, '_blank');
    else showNotification('⚠️ No playlist URL', 'warning');
    vibrate(10);
}

function editCourse(i) {
    const course = filteredCourses[i];
    document.getElementById('sheetTitle').textContent = 'Edit Course';
    document.getElementById('courseTitle').value = course.title || '';
    document.getElementById('courseInstructor').value = course.instructor || '';
    document.getElementById('courseCategory').value = course.category || '';
    document.getElementById('courseDescription').value = course.description || '';
    document.getElementById('courseDuration').value = course.duration || '';
    document.getElementById('courseLessons').value = course.lessons || '';
    document.getElementById('courseLevel').value = course.level || '';
    document.getElementById('courseThumbnail').value = course.thumbnail || '';
    document.getElementById('coursePlaylist').value = course.playlistUrl || '';
    showAddModal();
    vibrate(10);
}

function deleteCourse(i) {
    if (confirm(`Delete "${filteredCourses[i].title}"?`)) {
        showNotification('✅ Course deleted!', 'success');
        vibrate([50, 30, 50]);
    }
}

function showAddModal() {
    document.getElementById('addCourseSheet').classList.add('active');
    document.getElementById('overlay').classList.add('active');
    document.body.style.overflow = 'hidden';
    vibrate(10);
}

function closeAddModal() {
    document.getElementById('addCourseSheet').classList.remove('active');
    document.getElementById('overlay').classList.remove('active');
    document.body.style.overflow = '';
    document.getElementById('courseForm').reset();
    document.getElementById('sheetTitle').textContent = 'Add Educational Course';
    vibrate(10);
}

function showFilterSheet() {
    document.getElementById('filterSheet').classList.add('active');
    document.getElementById('overlay').classList.add('active');
    document.body.style.overflow = 'hidden';
    vibrate(10);
}

function closeFilterSheet() {
    document.getElementById('filterSheet').classList.remove('active');
    document.getElementById('overlay').classList.remove('active');
    document.body.style.overflow = '';
    vibrate(10);
}

document.getElementById('overlay').addEventListener('click', () => {
    closeAddModal();
    closeFilterSheet();
});

document.getElementById('courseForm').addEventListener('submit', (e) => {
    e.preventDefault();
    showNotification('✅ Course saved!', 'success');
    closeAddModal();
    vibrate([30, 20, 30]);
});

function goBack() {
    window.location.href = '../../dashboard/index.html';
}

function showLoading() {
    document.getElementById('loadingSpinner').classList.add('active');
}

function hideLoading() {
    document.getElementById('loadingSpinner').classList.remove('active');
}

function showNotification(message, type = 'info') {
    const notif = document.createElement('div');
    notif.style.cssText = `
        position: fixed;
        top: calc(var(--header-height) + var(--search-height) + 20px);
        left: 50%;
        transform: translateX(-50%);
        background: ${type === 'error' ? '#d32f2f' : type === 'success' ? '#388e3c' : '#1976d2'};
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        font-size: 14px;
        font-weight: 600;
        z-index: 10000;
        max-width: 90%;
    `;
    notif.textContent = message;
    document.body.appendChild(notif);
    setTimeout(() => notif.remove(), 3000);
}

function vibrate(pattern) {
    if (navigator.vibrate) navigator.vibrate(pattern);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
