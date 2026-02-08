// Electronics Tools Manager Logic
let allTools = [];
let filteredTools = [];
let selectedTools = new Set();
let currentFilters = { search: '', subcategory: '' };

async function init() {
    showLoading();
    await loadTools();
    setupEventListeners();
    renderTools();
    hideLoading();
}

async function loadTools() {
    try {
        const response = await fetch('../../../Projects Code/projects.json');
        const data = await response.json();
        // Filter only electronics category tools
        allTools = (data.projects || []).filter(p => p.category === 'electronics');
        filteredTools = [...allTools];
        updateStats();
    } catch (error) {
        console.error('Failed to load tools:', error);
        showNotification('❌ Failed to load tools', 'error');
    }
}

function renderTools() {
    const list = document.getElementById('toolsList');
    const empty = document.getElementById('emptyState');
    
    if (filteredTools.length === 0) {
        list.innerHTML = '';
        empty.classList.add('active');
        return;
    }
    
    empty.classList.remove('active');
    list.innerHTML = filteredTools.map((tool, i) => {
        const features = tool.features || [];
        const tags = tool.tags || [];
        const iconClass = getIconClass(tool.icon || 'fa-calculator');
        
        return `
        <div class="tool-item ${selectedTools.has(i) ? 'selected' : ''}" onclick="toggleSelection(${i})">
            <div class="tool-header">
                <div class="tool-icon-wrapper">
                    <i class="${iconClass}"></i>
                </div>
                <div class="tool-title">${tool.title}</div>
                <span class="tool-type">${tool.subcategory || 'Tool'}</span>
            </div>
            <div class="tool-content">
                <div class="tool-description">${tool.description}</div>
                
                ${features.length > 0 ? `
                <div class="features-section">
                    <div class="features-label">Key Features</div>
                    <div class="features-list">
                        ${features.map(f => `<span class="feature-chip"><i class="fas fa-check"></i> ${f}</span>`).join('')}
                    </div>
                </div>
                ` : ''}
                
                ${tags.length > 0 ? `
                <div class="tool-tags">
                    ${tags.slice(0, 6).map(t => `<span class="tag-chip">${t}</span>`).join('')}
                </div>
                ` : ''}
                
                <div class="tool-actions">
                    ${tool.toolLink ? `
                    <button class="action-btn primary" onclick="event.stopPropagation(); openTool(${i})">
                        <i class="fas fa-calculator"></i> Open Tool
                    </button>
                    ` : ''}
                    <button class="action-btn" onclick="event.stopPropagation(); editTool(${i})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="action-btn danger" onclick="event.stopPropagation(); deleteTool(${i})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        </div>
        `;
    }).join('');
    
    document.getElementById('toolCount').textContent = `${filteredTools.length} tool${filteredTools.length !== 1 ? 's' : ''}`;
}

function getIconClass(icon) {
    // Convert icon string to FontAwesome class
    if (icon.startsWith('fa-')) return `fas ${icon}`;
    return 'fas fa-calculator';
}

function updateStats() {
    document.getElementById('totalTools').textContent = allTools.length;
    const categories = new Set(allTools.map(t => t.subcategory).filter(Boolean));
    document.getElementById('totalCategories').textContent = categories.size;
    // Usage tracking would be implemented with analytics
    document.getElementById('totalUsage').textContent = '0';
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
    filteredTools = allTools.filter(tool => {
        if (currentFilters.search) {
            const text = `${tool.title} ${tool.description} ${(tool.tags || []).join(' ')}`.toLowerCase();
            if (!text.includes(currentFilters.search)) return false;
        }
        if (currentFilters.subcategory && tool.subcategory !== currentFilters.subcategory) return false;
        return true;
    });
    renderTools();
    closeFilterSheet();
    vibrate(10);
}

function resetFilters() {
    currentFilters = { search: '', subcategory: '' };
    document.getElementById('searchInput').value = '';
    document.getElementById('filterSubcategory').value = '';
    document.getElementById('clearSearchBtn').classList.remove('active');
    applyFilters();
}

function toggleSelection(index) {
    selectedTools.has(index) ? selectedTools.delete(index) : selectedTools.add(index);
    renderTools();
    document.getElementById('bottomToolbar').classList.toggle('active', selectedTools.size > 0);
    vibrate(10);
}

function cancelSelection() {
    selectedTools.clear();
    renderTools();
    document.getElementById('bottomToolbar').classList.remove('active');
    vibrate(20);
}

function bulkDelete() {
    if (confirm(`Delete ${selectedTools.size} tool(s)?`)) {
        showNotification(`✅ ${selectedTools.size} tools deleted!`, 'success');
        cancelSelection();
        vibrate([50, 30, 50]);
    }
}

function bulkExport() {
    const data = Array.from(selectedTools).map(i => filteredTools[i]);
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `electronics-tools-${Date.now()}.json`;
    a.click();
    showNotification('✅ Tools exported!', 'success');
    vibrate(20);
}

function openTool(i) {
    const tool = filteredTools[i];
    if (tool.toolLink) {
        window.open(tool.toolLink, '_blank');
        vibrate(10);
    } else {
        showNotification('⚠️ Tool link not available', 'warning');
    }
}

function editTool(i) {
    const tool = filteredTools[i];
    document.getElementById('sheetTitle').textContent = 'Edit Tool';
    document.getElementById('toolTitle').value = tool.title || '';
    document.getElementById('toolSubcategory').value = tool.subcategory || '';
    document.getElementById('toolDescription').value = tool.description || '';
    document.getElementById('toolLink').value = tool.toolLink || '';
    document.getElementById('toolFeatures').value = (tool.features || []).join('\n');
    document.getElementById('toolTags').value = (tool.tags || []).join(', ');
    showAddModal();
    vibrate(10);
}

function deleteTool(i) {
    if (confirm(`Delete "${filteredTools[i].title}"?`)) {
        showNotification('✅ Tool deleted!', 'success');
        vibrate([50, 30, 50]);
    }
}

function showAddModal() {
    document.getElementById('addToolSheet').classList.add('active');
    document.getElementById('overlay').classList.add('active');
    document.body.style.overflow = 'hidden';
    vibrate(10);
}

function closeAddModal() {
    document.getElementById('addToolSheet').classList.remove('active');
    document.getElementById('overlay').classList.remove('active');
    document.body.style.overflow = '';
    document.getElementById('toolForm').reset();
    document.getElementById('sheetTitle').textContent = 'Add Electronics Tool';
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

document.getElementById('toolForm').addEventListener('submit', (e) => {
    e.preventDefault();
    showNotification('✅ Tool saved!', 'success');
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
        background: ${type === 'error' ? '#d32f2f' : type === 'success' ? '#388e3c' : type === 'warning' ? '#F57C00' : '#FFC107'};
        color: ${type === 'warning' || type === 'info' ? '#1A1A1A' : 'white'};
        padding: 16px 24px;
        border-radius: 12px;
        font-size: 14px;
        font-weight: 600;
        z-index: 10000;
        max-width: 90%;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
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
