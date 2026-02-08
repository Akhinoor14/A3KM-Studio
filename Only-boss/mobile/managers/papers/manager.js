// Papers Manager Logic
let allPapers = [];
let filteredPapers = [];
let selectedPapers = new Set();
let currentFilters = { search: '', category: '', year: '' };

async function init() {
    showLoading();
    await loadPapers();
    await loadCategories();
    setupEventListeners();
    renderPapers();
    hideLoading();
}

async function loadPapers() {
    try {
        const response = await fetch('../../../Content Studio/research-papers/papers.json');
        const data = await response.json();
        allPapers = data.papers || [];
        filteredPapers = [...allPapers];
        updateStats();
    } catch (error) {
        console.error('Failed to load papers:', error);
        showNotification('❌ Failed to load papers', 'error');
    }
}

async function loadCategories() {
    try {
        const response = await fetch('../../../Content Studio/research-papers/papers.json');
        const data = await response.json();
        const categorySelect = document.getElementById('paperCategory');
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

function renderPapers() {
    const list = document.getElementById('papersList');
    const empty = document.getElementById('emptyState');
    
    if (filteredPapers.length === 0) {
        list.innerHTML = '';
        empty.classList.add('active');
        return;
    }
    
    empty.classList.remove('active');
    list.innerHTML = filteredPapers.map((paper, i) => `
        <div class="paper-item ${selectedPapers.has(i) ? 'selected' : ''}" onclick="toggleSelection(${i})">
            <div class="paper-title">${paper.title}</div>
            <div class="paper-authors">${paper.authors || 'Unknown'}</div>
            <div class="paper-meta">
                ${paper.category ? `<span class="badge badge-category">${paper.category}</span>` : ''}
                ${paper.year ? `<span class="badge badge-year">${paper.year}</span>` : ''}
                ${paper.pages ? `<span class="badge badge-pages">${paper.pages} pages</span>` : ''}
            </div>
            <div class="paper-actions">
                <button class="action-btn" onclick="event.stopPropagation(); viewPaper(${i})">
                    <i class="fas fa-file-pdf"></i> View
                </button>
                <button class="action-btn" onclick="event.stopPropagation(); editPaper(${i})">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="action-btn danger" onclick="event.stopPropagation(); deletePaper(${i})">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `).join('');
    
    document.getElementById('paperCount').textContent = `${filteredPapers.length} paper${filteredPapers.length !== 1 ? 's' : ''}`;
}

function updateStats() {
    document.getElementById('totalPapers').textContent = allPapers.length;
    const cats = new Set(allPapers.map(p => p.category).filter(Boolean));
    document.getElementById('totalCategories').textContent = cats.size;
    const cites = allPapers.reduce((sum, p) => sum + (p.citations || 0), 0);
    document.getElementById('totalCitations').textContent = cites;
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
    filteredPapers = allPapers.filter(paper => {
        if (currentFilters.search) {
            const text = `${paper.title} ${paper.authors} ${paper.abstract || ''}`.toLowerCase();
            if (!text.includes(currentFilters.search)) return false;
        }
        if (currentFilters.category && paper.category !== currentFilters.category) return false;
        if (currentFilters.year && paper.year !== parseInt(currentFilters.year)) return false;
        return true;
    });
    renderPapers();
    closeFilterSheet();
    vibrate(10);
}

function resetFilters() {
    currentFilters = { search: '', category: '', year: '' };
    document.getElementById('searchInput').value = '';
    document.getElementById('filterCategory').value = '';
    document.getElementById('filterYear').value = '';
    document.getElementById('clearSearchBtn').classList.remove('active');
    applyFilters();
}

function toggleSelection(index) {
    selectedPapers.has(index) ? selectedPapers.delete(index) : selectedPapers.add(index);
    renderPapers();
    document.getElementById('bottomToolbar').classList.toggle('active', selectedPapers.size > 0);
    vibrate(10);
}

function cancelSelection() {
    selectedPapers.clear();
    renderPapers();
    document.getElementById('bottomToolbar').classList.remove('active');
    vibrate(20);
}

function bulkDelete() {
    if (confirm(`Delete ${selectedPapers.size} paper(s)?`)) {
        showNotification(`✅ ${selectedPapers.size} papers deleted!`, 'success');
        cancelSelection();
        vibrate([50, 30, 50]);
    }
}

function bulkExport() {
    const data = Array.from(selectedPapers).map(i => filteredPapers[i]);
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `papers-export-${Date.now()}.json`;
    a.click();
    showNotification('✅ Papers exported!', 'success');
    vibrate(20);
}

function viewPaper(i) {
    const paper = filteredPapers[i];
    if (paper.url) window.open(paper.url, '_blank');
    else showNotification('⚠️ No PDF URL', 'warning');
    vibrate(10);
}

function editPaper(i) {
    const paper = filteredPapers[i];
    document.getElementById('sheetTitle').textContent = 'Edit Paper';
    document.getElementById('paperTitle').value = paper.title || '';
    document.getElementById('paperAuthors').value = paper.authors || '';
    document.getElementById('paperCategory').value = paper.category || '';
    document.getElementById('paperAbstract').value = paper.abstract || '';
    document.getElementById('paperYear').value = paper.year || '';
    document.getElementById('paperPages').value = paper.pages || '';
    document.getElementById('paperJournal').value = paper.journal || '';
    document.getElementById('paperDOI').value = paper.doi || '';
    document.getElementById('paperURL').value = paper.url || '';
    showAddModal();
    vibrate(10);
}

function deletePaper(i) {
    if (confirm(`Delete "${filteredPapers[i].title}"?`)) {
        showNotification('✅ Paper deleted!', 'success');
        vibrate([50, 30, 50]);
    }
}

function showAddModal() {
    document.getElementById('addPaperSheet').classList.add('active');
    document.getElementById('overlay').classList.add('active');
    document.body.style.overflow = 'hidden';
    vibrate(10);
}

function closeAddModal() {
    document.getElementById('addPaperSheet').classList.remove('active');
    document.getElementById('overlay').classList.remove('active');
    document.body.style.overflow = '';
    document.getElementById('paperForm').reset();
    document.getElementById('sheetTitle').textContent = 'Add Research Paper';
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

document.getElementById('paperForm').addEventListener('submit', (e) => {
    e.preventDefault();
    showNotification('✅ Paper saved!', 'success');
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
