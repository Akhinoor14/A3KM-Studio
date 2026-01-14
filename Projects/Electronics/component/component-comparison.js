// Component Comparison Engine

let filteredComponents = [...componentDatabase];
let currentView = 'card';
let sortColumn = null;
let sortDirection = 'asc';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    generateCategoryFilters();
    renderComponents();
    setupSearch();
});

// Generate Category Filters
function generateCategoryFilters() {
    const categories = [...new Set(componentDatabase.map(c => c.category))];
    const container = document.getElementById('categoryFilters');
    
    // Add "All" filter
    const allChip = createFilterChip('All', componentDatabase.length, true);
    allChip.onclick = () => filterByCategory(null);
    container.appendChild(allChip);
    
    // Add category filters
    categories.sort().forEach(cat => {
        const count = componentDatabase.filter(c => c.category === cat).length;
        const chip = createFilterChip(cat, count, false);
        chip.onclick = () => filterByCategory(cat);
        container.appendChild(chip);
    });
}

// Create Filter Chip
function createFilterChip(label, count, active) {
    const chip = document.createElement('button');
    chip.className = 'filter-chip' + (active ? ' active' : '');
    chip.dataset.category = label;
    chip.textContent = `${label} (${count})`;
    return chip;
}

// Filter by Category
function filterByCategory(category) {
    // Update filtered list
    filteredComponents = category ? 
        componentDatabase.filter(c => c.category === category) : 
        [...componentDatabase];
    
    // Apply search filter if exists
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    if (searchTerm) {
        filteredComponents = filteredComponents.filter(c => 
            c.name.toLowerCase().includes(searchTerm) ||
            c.description.toLowerCase().includes(searchTerm) ||
            c.category.toLowerCase().includes(searchTerm)
        );
    }
    
    // Update UI
    document.querySelectorAll('.filter-chip').forEach(chip => {
        const isActive = (!category && chip.dataset.category === 'All') ||
                        (chip.dataset.category === category);
        chip.classList.toggle('active', isActive);
    });
    
    renderComponents();
}

// Setup Search
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    let debounceTimer;
    
    searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            performSearch(e.target.value);
        }, 300);
    });
}

// Perform Search
function performSearch(term) {
    const searchLower = term.toLowerCase();
    
    // Get active category
    const activeCategory = document.querySelector('.filter-chip.active')?.dataset.category;
    const baseList = (activeCategory && activeCategory !== 'All') ?
        componentDatabase.filter(c => c.category === activeCategory) :
        componentDatabase;
    
    // Search
    if (!term) {
        filteredComponents = baseList;
    } else {
        filteredComponents = baseList.filter(c => 
            c.name.toLowerCase().includes(searchLower) ||
            c.description.toLowerCase().includes(searchLower) ||
            c.category.toLowerCase().includes(searchLower) ||
            c.bestFor.toLowerCase().includes(searchLower)
        );
    }
    
    renderComponents();
}

// Switch View
function switchView(view) {
    currentView = view;
    
    // Update buttons
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === view);
    });
    
    // Update views
    document.getElementById('tableView').classList.toggle('active', view === 'table');
    document.getElementById('cardView').style.display = view === 'card' ? 'block' : 'none';
    
    renderComponents();
}

// Render Components
function renderComponents() {
    // Update count
    document.getElementById('resultCount').textContent = filteredComponents.length;
    
    // Show/hide no results
    const noResults = document.getElementById('noResults');
    noResults.classList.toggle('show', filteredComponents.length === 0);
    
    if (filteredComponents.length === 0) return;
    
    // Render based on view
    if (currentView === 'table') {
        renderTableView();
    } else {
        renderCardView();
    }
}

// Render Card View
function renderCardView() {
    const container = document.getElementById('cardView');
    container.innerHTML = '';
    
    filteredComponents.forEach(comp => {
        const card = document.createElement('div');
        card.className = 'component-card';
        
        // Determine badge
        let badgeHTML = '';
        if (comp.bestFor.toLowerCase().includes('arduino')) {
            badgeHTML = '<div class="component-badge" style="background: rgba(0,191,165,0.15); border-color: rgba(0,191,165,0.3); color: #00BFA5;">Arduino</div>';
        } else if (comp.bestFor.toLowerCase().includes('power')) {
            badgeHTML = '<div class="component-badge" style="background: rgba(255,152,0,0.15); border-color: rgba(255,152,0,0.3); color: #FF9800;">Power</div>';
        } else if (comp.category.includes('Sensor')) {
            badgeHTML = '<div class="component-badge" style="background: rgba(33,150,243,0.15); border-color: rgba(33,150,243,0.3); color: #2196F3;">Sensor</div>';
        } else {
            badgeHTML = '<div class="component-badge">Popular</div>';
        }
        
        card.innerHTML = `
            <div class="component-header">
                <div>
                    <div class="component-name">${comp.name}</div>
                    <div class="component-category">${comp.category}</div>
                </div>
                ${badgeHTML}
            </div>
            
            <div class="component-description">${comp.description}</div>
            
            <div class="component-specs">
                <div class="spec-item">
                    <div class="spec-label">Voltage</div>
                    <div class="spec-value">${comp.voltage}</div>
                </div>
                <div class="spec-item">
                    <div class="spec-label">Current</div>
                    <div class="spec-value">${comp.current}</div>
                </div>
                <div class="spec-item">
                    <div class="spec-label">Package</div>
                    <div class="spec-value">${comp.package}</div>
                </div>
                <div class="spec-item">
                    <div class="spec-label">${Object.keys(comp.specs)[0]}</div>
                    <div class="spec-value">${Object.values(comp.specs)[0]}</div>
                </div>
            </div>
            
            <div class="component-footer">
                <div class="best-for-tag">
                    <i class="fas fa-star" style="margin-right: 4px;"></i> ${comp.bestFor}
                </div>
            </div>
        `;
        
        container.appendChild(card);
    });
}

// Render Table View
function renderTableView() {
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = '';
    
    filteredComponents.forEach(comp => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="table-name">${comp.name}</td>
            <td>${comp.category}</td>
            <td>${comp.voltage}</td>
            <td>${comp.current}</td>
            <td>${comp.package}</td>
            <td>${comp.bestFor}</td>
        `;
        tbody.appendChild(row);
    });
}

// Sort Table
function sortTable(column) {
    // Toggle direction
    if (sortColumn === column) {
        sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
        sortColumn = column;
        sortDirection = 'asc';
    }
    
    // Sort
    filteredComponents.sort((a, b) => {
        let valA = a[column];
        let valB = b[column];
        
        // Handle voltage/current sorting (extract numbers)
        if (column === 'voltage' || column === 'current') {
            valA = parseFloat(valA) || 0;
            valB = parseFloat(valB) || 0;
        }
        
        if (typeof valA === 'string') {
            valA = valA.toLowerCase();
            valB = valB.toLowerCase();
        }
        
        if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
    });
    
    // Update sort icons
    document.querySelectorAll('.component-table th i').forEach(icon => {
        icon.className = 'fas fa-sort';
    });
    
    const activeHeader = document.querySelector(`th[onclick="sortTable('${column}')"] i`);
    if (activeHeader) {
        activeHeader.className = sortDirection === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down';
    }
    
    renderComponents();
}
