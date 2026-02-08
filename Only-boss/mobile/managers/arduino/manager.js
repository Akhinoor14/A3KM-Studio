// Arduino Projects Manager Logic
let allProjects = [];
let filteredProjects = [];
let selectedProjects = new Set();
let currentFilters = { search: '', category: '' };

async function init() {
    showLoading();
    await loadProjects();
    setupEventListeners();
    renderProjects();
    hideLoading();
}

async function loadProjects() {
    try {
        const response = await fetch('../../../Projects Code/Arduino/arduino-data.json');
        const data = await response.json();
        allProjects = data.projects || [];
        filteredProjects = [...allProjects];
        updateStats();
    } catch (error) {
        console.error('Failed to load projects:', error);
        showNotification('❌ Failed to load projects', 'error');
    }
}

function renderProjects() {
    const list = document.getElementById('projectsList');
    const empty = document.getElementById('emptyState');
    
    if (filteredProjects.length === 0) {
        list.innerHTML = '';
        empty.classList.add('active');
        return;
    }
    
    empty.classList.remove('active');
    list.innerHTML = filteredProjects.map((project, i) => {
        const categoryName = getCategoryName(project.category);
        const components = project.components || [];
        
        return `
        <div class="project-item ${selectedProjects.has(i) ? 'selected' : ''}" onclick="toggleSelection(${i})">
            <div class="project-header">
                <div class="project-title">${project.title}</div>
                ${project.subtitle ? `<div class="project-subtitle">${project.subtitle}</div>` : ''}
            </div>
            <div class="project-content">
                <div class="project-description">${project.description}</div>
                
                ${components.length > 0 ? `
                <div class="components-section">
                    <div class="components-label">Components</div>
                    <div class="components-list">
                        ${components.slice(0, 5).map(c => `<span class="component-chip">${c}</span>`).join('')}
                        ${components.length > 5 ? `<span class="component-chip">+${components.length - 5} more</span>` : ''}
                    </div>
                </div>
                ` : ''}
                
                <div class="project-meta">
                    <span class="badge badge-category">${categoryName}</span>
                    ${project.codeFile ? `<span class="badge badge-code"><i class="fas fa-code"></i> ${project.codeFile}</span>` : ''}
                    <span class="badge badge-views"><i class="fas fa-eye"></i> ${project.views || 0}</span>
                </div>
                
                <div class="project-actions">
                    ${project.tinkercad ? `
                    <button class="action-btn primary" onclick="event.stopPropagation(); openTinkercad(${i})">
                        <i class="fas fa-external-link-alt"></i> Tinkercad
                    </button>
                    ` : ''}
                    <button class="action-btn" onclick="event.stopPropagation(); viewProject(${i})">
                        <i class="fas fa-eye"></i> View
                    </button>
                    <button class="action-btn" onclick="event.stopPropagation(); editProject(${i})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="action-btn danger" onclick="event.stopPropagation(); deleteProject(${i})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        </div>
        `;
    }).join('');
    
    document.getElementById('projectCount').textContent = `${filteredProjects.length} project${filteredProjects.length !== 1 ? 's' : ''}`;
}

function getCategoryName(category) {
    const categories = {
        'led-basics': 'LED Basics',
        'sensors': 'Sensors',
        'display': 'Display',
        'advanced': 'Advanced',
        'iot': 'IoT & Communication'
    };
    return categories[category] || category;
}

function updateStats() {
    document.getElementById('totalProjects').textContent = allProjects.length;
    const categories = new Set(allProjects.map(p => p.category));
    document.getElementById('totalCategories').textContent = categories.size;
    const totalViews = allProjects.reduce((sum, p) => sum + (p.views || 0), 0);
    document.getElementById('totalViews').textContent = totalViews;
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
    filteredProjects = allProjects.filter(project => {
        if (currentFilters.search) {
            const text = `${project.title} ${project.subtitle || ''} ${project.description}`.toLowerCase();
            if (!text.includes(currentFilters.search)) return false;
        }
        if (currentFilters.category && project.category !== currentFilters.category) return false;
        return true;
    });
    renderProjects();
    closeFilterSheet();
    vibrate(10);
}

function resetFilters() {
    currentFilters = { search: '', category: '' };
    document.getElementById('searchInput').value = '';
    document.getElementById('filterCategory').value = '';
    document.getElementById('clearSearchBtn').classList.remove('active');
    applyFilters();
}

function toggleSelection(index) {
    selectedProjects.has(index) ? selectedProjects.delete(index) : selectedProjects.add(index);
    renderProjects();
    document.getElementById('bottomToolbar').classList.toggle('active', selectedProjects.size > 0);
    vibrate(10);
}

function cancelSelection() {
    selectedProjects.clear();
    renderProjects();
    document.getElementById('bottomToolbar').classList.remove('active');
    vibrate(20);
}

function bulkDelete() {
    if (confirm(`Delete ${selectedProjects.size} project(s)?`)) {
        showNotification(`✅ ${selectedProjects.size} projects deleted!`, 'success');
        cancelSelection();
        vibrate([50, 30, 50]);
    }
}

function bulkExport() {
    const data = Array.from(selectedProjects).map(i => filteredProjects[i]);
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `arduino-projects-${Date.now()}.json`;
    a.click();
    showNotification('✅ Projects exported!', 'success');
    vibrate(20);
}

function openTinkercad(i) {
    const project = filteredProjects[i];
    if (project.tinkercad) {
        window.open(project.tinkercad, '_blank');
        vibrate(10);
    }
}

function viewProject(i) {
    const project = filteredProjects[i];
    // Navigate to project detail page (to be implemented)
    showNotification(`📂 Viewing: ${project.title}`, 'info');
    vibrate(10);
}

function editProject(i) {
    const project = filteredProjects[i];
    document.getElementById('sheetTitle').textContent = 'Edit Project';
    document.getElementById('projectTitle').value = project.title || '';
    document.getElementById('projectSubtitle').value = project.subtitle || '';
    document.getElementById('projectCategory').value = project.category || '';
    document.getElementById('projectDescription').value = project.description || '';
    document.getElementById('projectComponents').value = (project.components || []).join('\n');
    document.getElementById('projectTinkercad').value = project.tinkercad || '';
    document.getElementById('projectCode').value = project.codeFile || '';
    document.getElementById('projectCircuit').value = project.files?.circuit || '';
    showAddModal();
    vibrate(10);
}

function deleteProject(i) {
    if (confirm(`Delete "${filteredProjects[i].title}"?`)) {
        showNotification('✅ Project deleted!', 'success');
        vibrate([50, 30, 50]);
    }
}

function showAddModal() {
    document.getElementById('addProjectSheet').classList.add('active');
    document.getElementById('overlay').classList.add('active');
    document.body.style.overflow = 'hidden';
    vibrate(10);
}

function closeAddModal() {
    document.getElementById('addProjectSheet').classList.remove('active');
    document.getElementById('overlay').classList.remove('active');
    document.body.style.overflow = '';
    document.getElementById('projectForm').reset();
    document.getElementById('sheetTitle').textContent = 'Add Arduino Project';
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

document.getElementById('projectForm').addEventListener('submit', (e) => {
    e.preventDefault();
    showNotification('✅ Project saved!', 'success');
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
        background: ${type === 'error' ? '#d32f2f' : type === 'success' ? '#388e3c' : '#00BCD4'};
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
