/**
 * Advanced Search & Filters
 * Date range, views, file type, multi-criteria filtering
 * Version: 1.0.0
 * Last Updated: January 22, 2026
 */

class AdvancedSearchManager {
    constructor() {
        this.filters = {
            text: '',
            category: 'all',
            tags: [],
            dateFrom: null,
            dateTo: null,
            minViews: null,
            maxViews: null,
            minDownloads: null,
            maxDownloads: null,
            fileTypes: [],
            sortBy: 'dateAdded',
            sortOrder: 'desc'
        };
    }

    /**
     * Apply all filters to projects
     * @param {Array} projects - Array of projects
     * @returns {Array} - Filtered projects
     */
    applyFilters(projects) {
        let filtered = [...projects];

        // Text search
        if (this.filters.text) {
            filtered = this.filterByText(filtered, this.filters.text);
        }

        // Category
        if (this.filters.category && this.filters.category !== 'all') {
            filtered = filtered.filter(p => p.category === this.filters.category);
        }

        // Tags (AND logic)
        if (this.filters.tags && this.filters.tags.length > 0) {
            filtered = this.filterByTags(filtered, this.filters.tags);
        }

        // Date range
        if (this.filters.dateFrom || this.filters.dateTo) {
            filtered = this.filterByDateRange(
                filtered,
                this.filters.dateFrom,
                this.filters.dateTo
            );
        }

        // Views range
        if (this.filters.minViews !== null || this.filters.maxViews !== null) {
            filtered = this.filterByRange(
                filtered,
                'views',
                this.filters.minViews,
                this.filters.maxViews
            );
        }

        // Downloads range
        if (this.filters.minDownloads !== null || this.filters.maxDownloads !== null) {
            filtered = this.filterByRange(
                filtered,
                'downloads',
                this.filters.minDownloads,
                this.filters.maxDownloads
            );
        }

        // File types
        if (this.filters.fileTypes && this.filters.fileTypes.length > 0) {
            filtered = this.filterByFileTypes(filtered, this.filters.fileTypes);
        }

        // Sort
        filtered = this.sortProjects(
            filtered,
            this.filters.sortBy,
            this.filters.sortOrder
        );

        return filtered;
    }

    /**
     * Filter by text (multi-field search)
     * @param {Array} projects - Projects to filter
     * @param {string} text - Search text
     * @returns {Array}
     */
    filterByText(projects, text) {
        const query = text.toLowerCase().trim();
        if (!query) return projects;

        return projects.filter(project => {
            const searchableFields = [
                project.title,
                project.subtitle,
                project.description,
                project.folder,
                project.category,
                ...(project.tags || []),
                ...(project.components || [])
            ].map(f => (f || '').toLowerCase());

            return searchableFields.some(field => field.includes(query));
        });
    }

    /**
     * Filter by tags (AND logic)
     * @param {Array} projects - Projects to filter
     * @param {Array} tags - Tags to match
     * @returns {Array}
     */
    filterByTags(projects, tags) {
        if (!tags || tags.length === 0) return projects;

        return projects.filter(project => {
            if (!project.tags || !Array.isArray(project.tags)) return false;
            
            const projectTags = project.tags.map(t => t.toLowerCase());
            return tags.every(tag => projectTags.includes(tag.toLowerCase()));
        });
    }

    /**
     * Filter by date range
     * @param {Array} projects - Projects to filter
     * @param {string} from - Start date (ISO string or null)
     * @param {string} to - End date (ISO string or null)
     * @returns {Array}
     */
    filterByDateRange(projects, from, to) {
        return projects.filter(project => {
            const date = new Date(project.dateAdded);
            
            if (from && date < new Date(from)) return false;
            if (to && date > new Date(to)) return false;
            
            return true;
        });
    }

    /**
     * Filter by numeric range
     * @param {Array} projects - Projects to filter
     * @param {string} field - Field name (views, downloads)
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     * @returns {Array}
     */
    filterByRange(projects, field, min, max) {
        return projects.filter(project => {
            const value = project[field] || 0;
            
            if (min !== null && value < min) return false;
            if (max !== null && value > max) return false;
            
            return true;
        });
    }

    /**
     * Filter by file types
     * @param {Array} projects - Projects to filter
     * @param {Array} types - File types to match (code, images, models, docs)
     * @returns {Array}
     */
    filterByFileTypes(projects, types) {
        return projects.filter(project => {
            if (!project.files) return false;

            return types.some(type => {
                switch (type) {
                    case 'code':
                        return project.files.code && 
                               (Array.isArray(project.files.code) 
                                   ? project.files.code.length > 0 
                                   : !!project.files.code);
                    case 'images':
                        return project.files.images && 
                               (Array.isArray(project.files.images) 
                                   ? project.files.images.length > 0 
                                   : !!project.files.images);
                    case 'models':
                        return project.files.cad || project.files.glb;
                    case 'docs':
                        return project.files.readme || 
                               project.files.documentation || 
                               project.files.explanation;
                    default:
                        return false;
                }
            });
        });
    }

    /**
     * Sort projects
     * @param {Array} projects - Projects to sort
     * @param {string} field - Field to sort by
     * @param {string} order - 'asc' or 'desc'
     * @returns {Array}
     */
    sortProjects(projects, field, order = 'asc') {
        return [...projects].sort((a, b) => {
            let aVal = a[field];
            let bVal = b[field];

            // Handle dates
            if (field === 'dateAdded' || field === 'lastUpdated') {
                aVal = new Date(aVal).getTime();
                bVal = new Date(bVal).getTime();
            }

            // Handle strings
            if (typeof aVal === 'string') {
                aVal = aVal.toLowerCase();
                bVal = (bVal || '').toLowerCase();
            }

            const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
            return order === 'asc' ? comparison : -comparison;
        });
    }

    /**
     * Set filter value
     * @param {string} key - Filter key
     * @param {any} value - Filter value
     */
    setFilter(key, value) {
        this.filters[key] = value;
    }

    /**
     * Get filter value
     * @param {string} key - Filter key
     * @returns {any}
     */
    getFilter(key) {
        return this.filters[key];
    }

    /**
     * Clear all filters
     */
    clearFilters() {
        this.filters = {
            text: '',
            category: 'all',
            tags: [],
            dateFrom: null,
            dateTo: null,
            minViews: null,
            maxViews: null,
            minDownloads: null,
            maxDownloads: null,
            fileTypes: [],
            sortBy: 'dateAdded',
            sortOrder: 'desc'
        };
    }

    /**
     * Get active filters count
     * @returns {number}
     */
    getActiveFiltersCount() {
        let count = 0;
        
        if (this.filters.text) count++;
        if (this.filters.category && this.filters.category !== 'all') count++;
        if (this.filters.tags.length > 0) count++;
        if (this.filters.dateFrom || this.filters.dateTo) count++;
        if (this.filters.minViews !== null || this.filters.maxViews !== null) count++;
        if (this.filters.minDownloads !== null || this.filters.maxDownloads !== null) count++;
        if (this.filters.fileTypes.length > 0) count++;
        
        return count;
    }

    /**
     * Export filters to object
     * @returns {object}
     */
    exportFilters() {
        return JSON.parse(JSON.stringify(this.filters));
    }

    /**
     * Import filters from object
     * @param {object} filters - Filters object
     */
    importFilters(filters) {
        this.filters = { ...this.filters, ...filters };
    }
}

// ===== UI COMPONENTS =====

/**
 * Create advanced search panel
 * @param {string} containerId - Container element ID
 * @param {AdvancedSearchManager} searchManager - Search manager instance
 * @param {object} options - Options (categories, tags, etc.)
 * @param {function} onSearch - Callback when search triggered
 * @returns {object} - Panel controller
 */
function createAdvancedSearchPanel(containerId, searchManager, options, onSearch) {
    const container = document.getElementById(containerId);
    if (!container) return null;

    container.innerHTML = `
        <div style="background: #2d2d2d; padding: 25px; border-radius: 12px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h3 style="color: #fff; margin: 0;">
                    <i class="fas fa-filter"></i> Advanced Filters
                    <span id="activeFiltersCount" style="background: #2196F3; color: white; 
                          padding: 4px 8px; border-radius: 12px; font-size: 0.8rem; margin-left: 10px;">0</span>
                </h3>
                <button id="clearFiltersBtn" style="background: #F44336; color: white; border: none; 
                        padding: 8px 16px; border-radius: 6px; cursor: pointer;">
                    <i class="fas fa-times"></i> Clear All
                </button>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;">
                <!-- Text Search -->
                <div>
                    <label style="color: #aaa; font-size: 0.9rem; display: block; margin-bottom: 8px;">
                        <i class="fas fa-search"></i> Search Text
                    </label>
                    <input type="text" id="filterText" placeholder="Search in all fields..." 
                           style="width: 100%; padding: 10px; background: #1e1e1e; border: 2px solid #444; 
                                  border-radius: 6px; color: white;">
                </div>

                <!-- Category -->
                <div>
                    <label style="color: #aaa; font-size: 0.9rem; display: block; margin-bottom: 8px;">
                        <i class="fas fa-folder"></i> Category
                    </label>
                    <select id="filterCategory" style="width: 100%; padding: 10px; background: #1e1e1e; 
                            border: 2px solid #444; border-radius: 6px; color: white;">
                        <option value="all">All Categories</option>
                        ${Object.entries(options.categories || {}).map(([key, cat]) => `
                            <option value="${key}">${cat.name || cat}</option>
                        `).join('')}
                    </select>
                </div>

                <!-- Date From -->
                <div>
                    <label style="color: #aaa; font-size: 0.9rem; display: block; margin-bottom: 8px;">
                        <i class="fas fa-calendar"></i> Date From
                    </label>
                    <input type="date" id="filterDateFrom" style="width: 100%; padding: 10px; 
                           background: #1e1e1e; border: 2px solid #444; border-radius: 6px; color: white;">
                </div>

                <!-- Date To -->
                <div>
                    <label style="color: #aaa; font-size: 0.9rem; display: block; margin-bottom: 8px;">
                        <i class="fas fa-calendar"></i> Date To
                    </label>
                    <input type="date" id="filterDateTo" style="width: 100%; padding: 10px; 
                           background: #1e1e1e; border: 2px solid #444; border-radius: 6px; color: white;">
                </div>

                <!-- Min Views -->
                <div>
                    <label style="color: #aaa; font-size: 0.9rem; display: block; margin-bottom: 8px;">
                        <i class="fas fa-eye"></i> Min Views
                    </label>
                    <input type="number" id="filterMinViews" min="0" placeholder="0" 
                           style="width: 100%; padding: 10px; background: #1e1e1e; border: 2px solid #444; 
                                  border-radius: 6px; color: white;">
                </div>

                <!-- Max Views -->
                <div>
                    <label style="color: #aaa; font-size: 0.9rem; display: block; margin-bottom: 8px;">
                        <i class="fas fa-eye"></i> Max Views
                    </label>
                    <input type="number" id="filterMaxViews" min="0" placeholder="∞" 
                           style="width: 100%; padding: 10px; background: #1e1e1e; border: 2px solid #444; 
                                  border-radius: 6px; color: white;">
                </div>

                <!-- Sort By -->
                <div>
                    <label style="color: #aaa; font-size: 0.9rem; display: block; margin-bottom: 8px;">
                        <i class="fas fa-sort"></i> Sort By
                    </label>
                    <select id="filterSortBy" style="width: 100%; padding: 10px; background: #1e1e1e; 
                            border: 2px solid #444; border-radius: 6px; color: white;">
                        <option value="dateAdded">Date Added</option>
                        <option value="title">Title</option>
                        <option value="views">Views</option>
                        <option value="downloads">Downloads</option>
                    </select>
                </div>

                <!-- Sort Order -->
                <div>
                    <label style="color: #aaa; font-size: 0.9rem; display: block; margin-bottom: 8px;">
                        <i class="fas fa-sort-amount-down"></i> Order
                    </label>
                    <select id="filterSortOrder" style="width: 100%; padding: 10px; background: #1e1e1e; 
                            border: 2px solid #444; border-radius: 6px; color: white;">
                        <option value="desc">Descending</option>
                        <option value="asc">Ascending</option>
                    </select>
                </div>
            </div>

            <!-- File Types -->
            <div style="margin-top: 20px;">
                <label style="color: #aaa; font-size: 0.9rem; display: block; margin-bottom: 12px;">
                    <i class="fas fa-file"></i> Has File Types
                </label>
                <div style="display: flex; gap: 15px; flex-wrap: wrap;">
                    <label style="display: flex; align-items: center; gap: 8px; color: white; cursor: pointer;">
                        <input type="checkbox" class="fileTypeCheckbox" value="code">
                        <span>Code Files</span>
                    </label>
                    <label style="display: flex; align-items: center; gap: 8px; color: white; cursor: pointer;">
                        <input type="checkbox" class="fileTypeCheckbox" value="images">
                        <span>Images</span>
                    </label>
                    <label style="display: flex; align-items: center; gap: 8px; color: white; cursor: pointer;">
                        <input type="checkbox" class="fileTypeCheckbox" value="models">
                        <span>3D Models</span>
                    </label>
                    <label style="display: flex; align-items: center; gap: 8px; color: white; cursor: pointer;">
                        <input type="checkbox" class="fileTypeCheckbox" value="docs">
                        <span>Documentation</span>
                    </label>
                </div>
            </div>

            <button id="applyFiltersBtn" style="width: 100%; margin-top: 25px; padding: 15px; 
                    background: #2196F3; color: white; border: none; border-radius: 8px; 
                    cursor: pointer; font-size: 1rem; font-weight: 600;">
                <i class="fas fa-search"></i> Apply Filters
            </button>
        </div>
    `;

    // Attach event handlers
    const inputs = {
        text: container.querySelector('#filterText'),
        category: container.querySelector('#filterCategory'),
        dateFrom: container.querySelector('#filterDateFrom'),
        dateTo: container.querySelector('#filterDateTo'),
        minViews: container.querySelector('#filterMinViews'),
        maxViews: container.querySelector('#filterMaxViews'),
        sortBy: container.querySelector('#filterSortBy'),
        sortOrder: container.querySelector('#filterSortOrder'),
        fileTypes: container.querySelectorAll('.fileTypeCheckbox')
    };

    function updateFiltersCount() {
        const count = searchManager.getActiveFiltersCount();
        container.querySelector('#activeFiltersCount').textContent = count;
    }

    function applyFilters() {
        searchManager.setFilter('text', inputs.text.value);
        searchManager.setFilter('category', inputs.category.value);
        searchManager.setFilter('dateFrom', inputs.dateFrom.value || null);
        searchManager.setFilter('dateTo', inputs.dateTo.value || null);
        searchManager.setFilter('minViews', inputs.minViews.value ? parseInt(inputs.minViews.value) : null);
        searchManager.setFilter('maxViews', inputs.maxViews.value ? parseInt(inputs.maxViews.value) : null);
        searchManager.setFilter('sortBy', inputs.sortBy.value);
        searchManager.setFilter('sortOrder', inputs.sortOrder.value);
        
        const fileTypes = Array.from(inputs.fileTypes)
            .filter(cb => cb.checked)
            .map(cb => cb.value);
        searchManager.setFilter('fileTypes', fileTypes);

        updateFiltersCount();
        if (onSearch) onSearch();
    }

    container.querySelector('#applyFiltersBtn').onclick = applyFilters;
    
    container.querySelector('#clearFiltersBtn').onclick = () => {
        searchManager.clearFilters();
        inputs.text.value = '';
        inputs.category.value = 'all';
        inputs.dateFrom.value = '';
        inputs.dateTo.value = '';
        inputs.minViews.value = '';
        inputs.maxViews.value = '';
        inputs.sortBy.value = 'dateAdded';
        inputs.sortOrder.value = 'desc';
        inputs.fileTypes.forEach(cb => cb.checked = false);
        updateFiltersCount();
        if (onSearch) onSearch();
    };

    // Real-time search on text input (debounced)
    let debounceTimer;
    inputs.text.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(applyFilters, 300);
    });

    return {
        applyFilters: applyFilters,
        updateCount: updateFiltersCount
    };
}

// Export
window.AdvancedSearchManager = AdvancedSearchManager;
window.createAdvancedSearchPanel = createAdvancedSearchPanel;

console.log('✅ Advanced Search Manager loaded');
