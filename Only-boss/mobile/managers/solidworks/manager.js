// SolidWorks Manager - Mobile Admin
let allModels = [];
let filteredModels = [];
let selectedModels = new Set();
let isEditMode = false;
let editingModelId = null;
let currentFilters = {
    category: '',
    difficulty: ''
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadModels();
    setupEventListeners();
});

// Load Models from JSON
async function loadModels() {
    try {
        showLoading();
        const response = await fetch('../../../Projects Code/solidworks/solidworks-data.json');
        
        if (!response.ok) {
            throw new Error('Failed to load models');
        }
        
        const data = await response.json();
        allModels = data.projects || [];
        filteredModels = [...allModels];
        
        hideLoading();
        updateStats();
        renderModels();
        
        if (allModels.length === 0) {
            showEmptyState();
        }
    } catch (error) {
        console.error('Error loading models:', error);
        hideLoading();
        showEmptyState();
        alert('Failed to load models. Please try again.');
    }
}

// Render Models Grid
function renderModels() {
    const grid = document.getElementById('modelsGrid');
    
    if (filteredModels.length === 0) {
        showEmptyState();
        return;
    }
    
    hideEmptyState();
    
    grid.innerHTML = filteredModels.map(model => `
        <div class="model-card ${selectedModels.has(model.id) ? 'selecting' : ''}" 
             data-id="${model.id}"
             onclick="handleModelClick('${model.id}')">
            <div class="model-thumbnail">
                ${model.thumbnail ? 
                    `<img src="../../../${model.thumbnail}" alt="${model.title}" loading="lazy">` :
                    '<div class="no-thumbnail"><i class="fas fa-cube"></i></div>'
                }
                <div class="model-badge">${model.modelId || model.id}</div>
                <div class="difficulty-badge ${model.difficulty ? model.difficulty.toLowerCase() : 'beginner'}">
                    ${model.difficulty || 'Beginner'}
                </div>
            </div>
            <div class="model-content">
                <div class="model-header">
                    <h3 class="model-title">${model.title}</h3>
                    ${model.subtitle ? `<p class="model-subtitle">${model.subtitle}</p>` : ''}
                </div>
                ${model.description ? 
                    `<p class="model-description">${model.description}</p>` : ''
                }
                ${model.features && model.features.length > 0 ? `
                    <div class="features-chips">
                        ${model.features.slice(0, 4).map(feature => `
                            <div class="feature-chip">
                                <i class="fas fa-wrench"></i>
                                ${feature}
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
                <div class="model-actions">
                    ${model.glbFile ? `
                        <button class="action-btn btn-secondary" onclick="event.stopPropagation(); viewModel('${model.id}')">
                            <i class="fas fa-cube"></i> View 3D
                        </button>
                    ` : ''}
                    ${model.zipFile ? `
                        <button class="action-btn btn-primary" onclick="event.stopPropagation(); downloadModel('${model.id}')">
                            <i class="fas fa-download"></i> Download
                        </button>
                    ` : ''}
                    <button class="action-btn btn-secondary" onclick="event.stopPropagation(); editModel('${model.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn btn-danger" onclick="event.stopPropagation(); deleteModel('${model.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    updateModelCount();
}

// Update Statistics
function updateStats() {
    document.getElementById('totalModels').textContent = allModels.length;
    
    const categories = new Set(allModels.map(m => m.category));
    document.getElementById('totalCategories').textContent = categories.size;
    
    const downloads = allModels.filter(m => m.zipFile).length;
    document.getElementById('totalDownloads').textContent = downloads;
}

// Update Model Count
function updateModelCount() {
    const count = filteredModels.length;
    document.getElementById('modelCount').textContent = `${count} model${count !== 1 ? 's' : ''}`;
}

// Event Listeners
function setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    const clearSearchBtn = document.getElementById('clearSearchBtn');
    
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim();
        clearSearchBtn.style.display = query ? 'flex' : 'none';
        filterModels();
    });
    
    // Close overlay
    document.getElementById('overlay').addEventListener('click', () => {
        closeAddModal();
        closeFilterSheet();
    });
}

// Filter Models
function filterModels() {
    const searchQuery = document.getElementById('searchInput').value.toLowerCase().trim();
    
    filteredModels = allModels.filter(model => {
        // Search filter
        const matchesSearch = !searchQuery || 
            model.title.toLowerCase().includes(searchQuery) ||
            (model.subtitle && model.subtitle.toLowerCase().includes(searchQuery)) ||
            (model.description && model.description.toLowerCase().includes(searchQuery)) ||
            (model.features && model.features.some(f => f.toLowerCase().includes(searchQuery)));
        
        // Category filter
        const matchesCategory = !currentFilters.category || 
            model.category === currentFilters.category;
        
        // Difficulty filter
        const matchesDifficulty = !currentFilters.difficulty || 
            model.difficulty === currentFilters.difficulty;
        
        return matchesSearch && matchesCategory && matchesDifficulty;
    });
    
    renderModels();
}

// Clear Search
function clearSearch() {
    document.getElementById('searchInput').value = '';
    document.getElementById('clearSearchBtn').style.display = 'none';
    filterModels();
}

// Show/Hide Filter Sheet
function showFilterSheet() {
    document.getElementById('filterSheet').classList.add('open');
    document.getElementById('overlay').classList.add('visible');
    
    // Set current filter values
    document.getElementById('filterCategory').value = currentFilters.category;
    document.getElementById('filterDifficulty').value = currentFilters.difficulty;
}

function closeFilterSheet() {
    document.getElementById('filterSheet').classList.remove('open');
    document.getElementById('overlay').classList.remove('visible');
}

// Apply Filters
function applyFilters() {
    currentFilters.category = document.getElementById('filterCategory').value;
    currentFilters.difficulty = document.getElementById('filterDifficulty').value;
    
    // Update filter button state
    const hasActiveFilters = currentFilters.category || currentFilters.difficulty;
    document.querySelector('.filter-btn').classList.toggle('active', hasActiveFilters);
    
    filterModels();
    closeFilterSheet();
}

// Reset Filters
function resetFilters() {
    currentFilters = {
        category: '',
        difficulty: ''
    };
    
    document.getElementById('filterCategory').value = '';
    document.getElementById('filterDifficulty').value = '';
    document.querySelector('.filter-btn').classList.remove('active');
    
    filterModels();
    closeFilterSheet();
}

// Handle Model Click
function handleModelClick(modelId) {
    if (selectedModels.size > 0) {
        toggleModelSelection(modelId);
    }
}

// Toggle Model Selection
function toggleModelSelection(modelId) {
    if (selectedModels.has(modelId)) {
        selectedModels.delete(modelId);
    } else {
        selectedModels.add(modelId);
    }
    
    renderModels();
    updateToolbarVisibility();
}

// Update Toolbar Visibility
function updateToolbarVisibility() {
    const toolbar = document.getElementById('bottomToolbar');
    if (selectedModels.size > 0) {
        toolbar.classList.add('visible');
    } else {
        toolbar.classList.remove('visible');
    }
}

// Cancel Selection
function cancelSelection() {
    selectedModels.clear();
    renderModels();
    updateToolbarVisibility();
}

// View 3D Model
function viewModel(modelId) {
    const model = allModels.find(m => m.id === modelId);
    if (!model || !model.glbFile) return;
    
    const glbPath = `../../../${model.glbFile}`;
    // Open 3D viewer (future implementation)
    alert(`Opening 3D viewer for: ${model.title}\nPath: ${glbPath}`);
}

// Download Model
function downloadModel(modelId) {
    const model = allModels.find(m => m.id === modelId);
    if (!model || !model.zipFile) return;
    
    const zipPath = `../../../${model.zipFile}`;
    window.open(zipPath, '_blank');
}

// Add Model Modal
function showAddModal() {
    isEditMode = false;
    editingModelId = null;
    document.getElementById('sheetTitle').textContent = 'Add SolidWorks Model';
    document.getElementById('modelForm').reset();
    document.getElementById('addModelSheet').classList.add('open');
    document.getElementById('overlay').classList.add('visible');
}

function closeAddModal() {
    document.getElementById('addModelSheet').classList.remove('open');
    document.getElementById('overlay').classList.remove('visible');
}

// Edit Model
function editModel(modelId) {
    const model = allModels.find(m => m.id === modelId);
    if (!model) return;
    
    isEditMode = true;
    editingModelId = modelId;
    document.getElementById('sheetTitle').textContent = 'Edit Model';
    
    // Populate form
    document.getElementById('modelTitle').value = model.title || '';
    document.getElementById('modelSubtitle').value = model.subtitle || '';
    document.getElementById('modelCategory').value = model.category || '';
    document.getElementById('modelDifficulty').value = model.difficulty || '';
    document.getElementById('modelDescription').value = model.description || '';
    document.getElementById('modelFeatures').value = model.features ? model.features.join(', ') : '';
    document.getElementById('modelTags').value = model.tags ? model.tags.join(', ') : '';
    document.getElementById('modelGlb').value = model.glbFile || '';
    document.getElementById('modelZip').value = model.zipFile || '';
    
    document.getElementById('addModelSheet').classList.add('open');
    document.getElementById('overlay').classList.add('visible');
}

// Delete Model
function deleteModel(modelId) {
    const model = allModels.find(m => m.id === modelId);
    if (!model) return;
    
    const confirmed = confirm(`Delete "${model.title}"?\n\nThis action cannot be undone.`);
    if (!confirmed) return;
    
    allModels = allModels.filter(m => m.id !== modelId);
    filterModels();
    updateStats();
    
    alert('Model deleted successfully!');
}

// Bulk Delete
function bulkDelete() {
    if (selectedModels.size === 0) return;
    
    const confirmed = confirm(`Delete ${selectedModels.size} selected model(s)?\n\nThis action cannot be undone.`);
    if (!confirmed) return;
    
    allModels = allModels.filter(m => !selectedModels.has(m.id));
    selectedModels.clear();
    
    filterModels();
    updateStats();
    updateToolbarVisibility();
    
    alert('Models deleted successfully!');
}

// Bulk Export
function bulkExport() {
    if (selectedModels.size === 0) return;
    
    const modelsToExport = allModels.filter(m => selectedModels.has(m.id));
    const jsonData = JSON.stringify({ projects: modelsToExport }, null, 2);
    
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `solidworks-models-export-${Date.now()}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
    
    selectedModels.clear();
    renderModels();
    updateToolbarVisibility();
}

// Form Submit
document.getElementById('modelForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = {
        title: document.getElementById('modelTitle').value.trim(),
        subtitle: document.getElementById('modelSubtitle').value.trim(),
        category: document.getElementById('modelCategory').value,
        difficulty: document.getElementById('modelDifficulty').value,
        description: document.getElementById('modelDescription').value.trim(),
        features: document.getElementById('modelFeatures').value
            .split(',')
            .map(f => f.trim())
            .filter(f => f),
        tags: document.getElementById('modelTags').value
            .split(',')
            .map(t => t.trim())
            .filter(t => t),
        glbFile: document.getElementById('modelGlb').value.trim(),
        zipFile: document.getElementById('modelZip').value.trim()
    };
    
    if (!formData.title || !formData.category || !formData.difficulty) {
        alert('Please fill in all required fields');
        return;
    }
    
    if (isEditMode && editingModelId) {
        // Update existing model
        const index = allModels.findIndex(m => m.id === editingModelId);
        if (index !== -1) {
            allModels[index] = {
                ...allModels[index],
                ...formData
            };
            alert('Model updated successfully!');
        }
    } else {
        // Add new model
        const newModel = {
            id: `model-${Date.now()}`,
            modelId: `Model ${allModels.length + 1}`,
            ...formData,
            thumbnail: ''
        };
        allModels.unshift(newModel);
        alert('Model added successfully!');
    }
    
    filterModels();
    updateStats();
    closeAddModal();
});

// Show/Hide States
function showLoading() {
    document.getElementById('loadingSpinner').style.display = 'flex';
    document.getElementById('modelsGrid').style.display = 'none';
    document.getElementById('emptyState').style.display = 'none';
}

function hideLoading() {
    document.getElementById('loadingSpinner').style.display = 'none';
    document.getElementById('modelsGrid').style.display = 'grid';
}

function showEmptyState() {
    document.getElementById('emptyState').style.display = 'flex';
    document.getElementById('modelsGrid').style.display = 'none';
}

function hideEmptyState() {
    document.getElementById('emptyState').style.display = 'none';
    document.getElementById('modelsGrid').style.display = 'grid';
}

// Navigation
function goBack() {
    if (selectedModels.size > 0) {
        cancelSelection();
        return;
    }
    window.location.href = '../../dashboard/index.html';
}
