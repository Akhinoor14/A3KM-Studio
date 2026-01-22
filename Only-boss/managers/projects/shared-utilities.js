/**
 * A3KM Studio - Project Managers Shared Utilities
 * Centralized functions for MATLAB, Arduino, and SolidWorks managers
 * Version: 2.0.0
 * Last Updated: January 22, 2026
 */

// ===== CONFIGURATION =====
const CONFIG = {
    ITEMS_PER_PAGE: 10,
    CACHE_DURATION: 3600000, // 1 hour
    MAX_FILE_SIZE: 100 * 1024 * 1024, // 100MB GitHub limit
    SUPPORTED_IMAGE_TYPES: ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'],
    DEBOUNCE_DELAY: 300 // ms for search
};

// ===== PAGINATION STATE =====
class PaginationManager {
    constructor(itemsPerPage = CONFIG.ITEMS_PER_PAGE) {
        this.currentPage = 1;
        this.itemsPerPage = itemsPerPage;
    }

    reset() {
        this.currentPage = 1;
    }

    getTotalPages(totalItems) {
        return Math.ceil(totalItems / this.itemsPerPage);
    }

    getPageItems(items) {
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        return items.slice(start, end);
    }

    nextPage(totalItems) {
        const totalPages = this.getTotalPages(totalItems);
        if (this.currentPage < totalPages) {
            this.currentPage++;
            return true;
        }
        return false;
    }

    previousPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            return true;
        }
        return false;
    }
}

// ===== SELECTION MANAGER =====
class SelectionManager {
    constructor() {
        this.selectedIds = new Set();
    }

    toggle(id) {
        if (this.selectedIds.has(id)) {
            this.selectedIds.delete(id);
        } else {
            this.selectedIds.add(id);
        }
        return this.selectedIds.size;
    }

    clear() {
        this.selectedIds.clear();
    }

    getSelected() {
        return Array.from(this.selectedIds);
    }

    getCount() {
        return this.selectedIds.size;
    }

    has(id) {
        return this.selectedIds.has(id);
    }

    selectAll(ids) {
        ids.forEach(id => this.selectedIds.add(id));
    }
}

// ===== CACHE MANAGER =====
class CacheManager {
    constructor(cacheKey, duration = CONFIG.CACHE_DURATION) {
        this.cacheKey = cacheKey;
        this.duration = duration;
    }

    save(data) {
        try {
            const cache = {
                data: data,
                timestamp: Date.now()
            };
            localStorage.setItem(this.cacheKey, JSON.stringify(cache));
            return true;
        } catch (e) {
            console.warn(`Cache save failed for ${this.cacheKey}:`, e);
            return false;
        }
    }

    load() {
        try {
            const cached = localStorage.getItem(this.cacheKey);
            if (!cached) return null;

            const cache = JSON.parse(cached);
            const age = Date.now() - cache.timestamp;

            if (age < this.duration) {
                console.log(`📦 Cache hit for ${this.cacheKey} (age: ${Math.round(age / 1000)}s)`);
                return cache.data;
            }

            // Expired cache
            this.clear();
            console.log(`⏱️ Cache expired for ${this.cacheKey}`);
            return null;
        } catch (e) {
            console.warn(`Cache load failed for ${this.cacheKey}:`, e);
            return null;
        }
    }

    clear() {
        localStorage.removeItem(this.cacheKey);
    }

    static clearAll() {
        ['matlab_projects_cache', 'arduino_projects_cache', 'solidworks_projects_cache'].forEach(key => {
            localStorage.removeItem(key);
        });
    }
}

// ===== SECURITY & VALIDATION =====
const Security = {
    /**
     * Sanitize user input to prevent XSS attacks
     * @param {string} input - Raw user input
     * @returns {string} - HTML-escaped string
     */
    sanitizeInput(input) {
        if (!input) return '';
        const div = document.createElement('div');
        div.textContent = input;
        return div.innerHTML;
    },

    /**
     * Sanitize object properties recursively
     * @param {object} obj - Object to sanitize
     * @returns {object} - Sanitized object
     */
    sanitizeObject(obj) {
        if (typeof obj !== 'object' || obj === null) {
            return typeof obj === 'string' ? this.sanitizeInput(obj) : obj;
        }

        if (Array.isArray(obj)) {
            return obj.map(item => this.sanitizeObject(item));
        }

        const sanitized = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                sanitized[key] = this.sanitizeObject(obj[key]);
            }
        }
        return sanitized;
    },

    /**
     * Validate email format
     * @param {string} email - Email to validate
     * @returns {boolean}
     */
    validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    },

    /**
     * Validate URL format
     * @param {string} url - URL to validate
     * @returns {boolean}
     */
    validateURL(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }
};

// ===== FILE VALIDATION =====
const FileValidator = {
    /**
     * Check if file size exceeds GitHub limit
     * @param {File} file - File to validate
     * @param {number} maxSize - Max size in bytes (default 100MB)
     * @returns {boolean}
     */
    validateSize(file, maxSize = CONFIG.MAX_FILE_SIZE) {
        if (file.size > maxSize) {
            alert(
                `⚠️ File too large: ${this.formatFileSize(file.size)}\n` +
                `GitHub limit: ${this.formatFileSize(maxSize)}\n\n` +
                `Please compress or split the file.`
            );
            return false;
        }
        return true;
    },

    /**
     * Validate all files in a FileList
     * @param {FileList} files - Files to validate
     * @returns {boolean}
     */
    validateFiles(files) {
        for (const file of files) {
            if (!this.validateSize(file)) {
                return false;
            }
        }
        return true;
    },

    /**
     * Format file size for display
     * @param {number} bytes - Size in bytes
     * @returns {string}
     */
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    },

    /**
     * Check if file is an image
     * @param {File} file - File to check
     * @returns {boolean}
     */
    isImage(file) {
        return CONFIG.SUPPORTED_IMAGE_TYPES.includes(file.type);
    },

    /**
     * Get file extension
     * @param {string} filename - File name
     * @returns {string}
     */
    getExtension(filename) {
        return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
    }
};

// ===== DUPLICATE DETECTION =====
const DuplicateDetector = {
    /**
     * Check if project title already exists
     * @param {string} title - Title to check
     * @param {Array} projects - Array of existing projects
     * @param {number} excludeId - ID to exclude (for editing)
     * @returns {boolean} - true if user wants to continue
     */
    checkTitle(title, projects, excludeId = null) {
        const sanitized = Security.sanitizeInput(title.toLowerCase().trim());
        
        const exists = projects.some(p => {
            if (excludeId && p.id === excludeId) return false;
            return p.title.toLowerCase().trim() === sanitized;
        });

        if (exists) {
            return confirm(
                '⚠️ A project with similar name already exists.\n\n' +
                `Title: "${title}"\n\n` +
                'Continue anyway?'
            );
        }
        return true;
    },

    /**
     * Check if folder name already exists
     * @param {string} folderName - Folder name to check
     * @param {Array} projects - Array of existing projects
     * @returns {boolean}
     */
    checkFolder(folderName, projects) {
        const exists = projects.some(p => p.folder === folderName);
        if (exists) {
            alert('⚠️ A project with this folder name already exists!\n\nPlease use a different title.');
            return false;
        }
        return true;
    }
};

// ===== DRAG & DROP HANDLER =====
const DragDropHandler = {
    /**
     * Setup drag and drop for a drop zone
     * @param {string} dropZoneId - ID of drop zone element
     * @param {string} inputId - ID of file input element
     * @param {function} callback - Callback function when files dropped
     * @param {string} highlightColor - Color for highlight effect
     */
    setup(dropZoneId, inputId, callback, highlightColor = '#2196F3') {
        const dropZone = document.getElementById(dropZoneId);
        const input = document.getElementById(inputId);
        
        if (!dropZone || !input) {
            console.warn(`Drag & drop setup failed: ${dropZoneId} or ${inputId} not found`);
            return;
        }

        // Prevent defaults
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
            }, false);
        });

        // Highlight on drag
        ['dragenter', 'dragover'].forEach(eventName => {
            dropZone.addEventListener(eventName, () => {
                dropZone.style.borderColor = highlightColor;
                dropZone.style.background = `${highlightColor}15`;
            });
        });

        // Remove highlight
        ['dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, () => {
                const originalColor = dropZone.dataset.originalBorderColor || 'rgba(128, 128, 128, 0.4)';
                dropZone.style.borderColor = originalColor;
                dropZone.style.background = `${highlightColor}05`;
            });
        });

        // Handle drop
        dropZone.addEventListener('drop', (e) => {
            const files = e.dataTransfer.files;
            input.files = files;
            if (callback) callback(files);
        });
    }
};

// ===== IMAGE PREVIEW HANDLER =====
const ImagePreviewHandler = {
    /**
     * Generate image previews in a container
     * @param {FileList} files - Files to preview
     * @param {string} containerId - ID of preview container
     * @param {string} borderColor - Border color for previews
     */
    generate(files, containerId, borderColor = '#2196F3') {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = '';

        Array.from(files).forEach(file => {
            if (!FileValidator.validateSize(file)) return;

            if (FileValidator.isImage(file)) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const div = document.createElement('div');
                    div.style.cssText = 
                        'position: relative; border-radius: 8px; overflow: hidden;' +
                        `border: 2px solid ${borderColor}40;`;
                    
                    div.innerHTML = `
                        <img src="${e.target.result}" 
                             style="width: 100%; height: 100px; object-fit: cover;"
                             alt="${Security.sanitizeInput(file.name)}">
                        <div style="position: absolute; bottom: 0; left: 0; right: 0; 
                                    background: rgba(0,0,0,0.7); padding: 5px; 
                                    font-size: 0.75rem; text-align: center; color: white;">
                            ${Security.sanitizeInput(file.name)}
                        </div>
                    `;
                    container.appendChild(div);
                };
                reader.readAsDataURL(file);
            }
        });
    },

    /**
     * Clear preview container
     * @param {string} containerId - ID of preview container
     */
    clear(containerId) {
        const container = document.getElementById(containerId);
        if (container) container.innerHTML = '';
    }
};

// ===== FILE LIST HANDLER =====
const FileListHandler = {
    /**
     * Display list of files with sizes
     * @param {FileList} files - Files to display
     * @param {string} containerId - ID of container
     * @param {string} iconClass - Font Awesome icon class
     * @param {string} color - Text color
     */
    display(files, containerId, iconClass = 'fa-file', color = '#2196F3') {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = '';

        Array.from(files).forEach(file => {
            if (!FileValidator.validateSize(file)) return;

            const div = document.createElement('div');
            div.style.cssText = `color: ${color}; padding: 5px 0;`;
            div.innerHTML = 
                `<i class="fas ${iconClass}" style="margin-right: 8px;"></i>` +
                `${Security.sanitizeInput(file.name)} ` +
                `<span style="color: #888;">(${FileValidator.formatFileSize(file.size)})</span>`;
            
            container.appendChild(div);
        });
    },

    /**
     * Clear file list container
     * @param {string} containerId - ID of container
     */
    clear(containerId) {
        const container = document.getElementById(containerId);
        if (container) container.innerHTML = '';
    }
};

// ===== SEARCH & FILTER =====
const SearchFilter = {
    /**
     * Debounce function for search
     * @param {function} func - Function to debounce
     * @param {number} delay - Delay in ms
     * @returns {function}
     */
    debounce(func, delay = CONFIG.DEBOUNCE_DELAY) {
        let timeoutId;
        return function(...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    },

    /**
     * Filter projects by search term
     * @param {Array} projects - Projects to filter
     * @param {string} searchTerm - Search term
     * @returns {Array} - Filtered projects
     */
    filterProjects(projects, searchTerm) {
        if (!searchTerm) return projects;

        const term = searchTerm.toLowerCase().trim();
        return projects.filter(project => {
            return (
                project.title?.toLowerCase().includes(term) ||
                project.subtitle?.toLowerCase().includes(term) ||
                project.description?.toLowerCase().includes(term) ||
                project.category?.toLowerCase().includes(term) ||
                project.folder?.toLowerCase().includes(term)
            );
        });
    },

    /**
     * Filter by category
     * @param {Array} projects - Projects to filter
     * @param {string} category - Category to filter by
     * @returns {Array}
     */
    filterByCategory(projects, category) {
        if (!category || category === 'all') return projects;
        return projects.filter(p => p.category === category);
    },

    /**
     * Sort projects
     * @param {Array} projects - Projects to sort
     * @param {string} sortBy - Field to sort by
     * @param {string} order - 'asc' or 'desc'
     * @returns {Array}
     */
    sortProjects(projects, sortBy = 'id', order = 'asc') {
        const sorted = [...projects].sort((a, b) => {
            let aVal = a[sortBy];
            let bVal = b[sortBy];

            // Handle dates
            if (sortBy === 'dateAdded') {
                aVal = new Date(aVal).getTime();
                bVal = new Date(bVal).getTime();
            }

            if (aVal < bVal) return order === 'asc' ? -1 : 1;
            if (aVal > bVal) return order === 'asc' ? 1 : -1;
            return 0;
        });
        return sorted;
    }
};

// ===== EXPORT/IMPORT HANDLER =====
const DataExporter = {
    /**
     * Export data to JSON file
     * @param {object} data - Data to export
     * @param {string} filename - Filename for download
     */
    exportJSON(data, filename) {
        const dataStr = JSON.stringify(data, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    },

    /**
     * Import JSON file
     * @param {File} file - File to import
     * @param {function} callback - Callback with parsed data
     */
    importJSON(file, callback) {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                callback(null, data);
            } catch (error) {
                callback(error, null);
            }
        };

        reader.onerror = () => {
            callback(new Error('File read failed'), null);
        };

        reader.readAsText(file);
    },

    /**
     * Validate imported data structure
     * @param {object} data - Data to validate
     * @param {Array} requiredFields - Required fields
     * @returns {boolean}
     */
    validateStructure(data, requiredFields = ['projects', 'categories']) {
        for (const field of requiredFields) {
            if (!data.hasOwnProperty(field)) {
                throw new Error(`Missing required field: ${field}`);
            }
        }

        if (!Array.isArray(data.projects)) {
            throw new Error('projects must be an array');
        }

        return true;
    }
};

// ===== NOTIFICATION SYSTEM =====
const Notifications = {
    /**
     * Show success notification
     * @param {string} message - Message to display
     * @param {number} duration - Duration in ms
     */
    success(message, duration = 3000) {
        this.show(message, 'success', duration);
    },

    /**
     * Show error notification
     * @param {string} message - Message to display
     * @param {number} duration - Duration in ms
     */
    error(message, duration = 5000) {
        this.show(message, 'error', duration);
    },

    /**
     * Show warning notification
     * @param {string} message - Message to display
     * @param {number} duration - Duration in ms
     */
    warning(message, duration = 4000) {
        this.show(message, 'warning', duration);
    },

    /**
     * Show notification
     * @param {string} message - Message to display
     * @param {string} type - Type (success, error, warning)
     * @param {number} duration - Duration in ms
     */
    show(message, type = 'info', duration = 3000) {
        const colors = {
            success: '#4CAF50',
            error: '#F44336',
            warning: '#FF9800',
            info: '#2196F3'
        };

        const icons = {
            success: 'check-circle',
            error: 'times-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };

        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${colors[type]};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 12px;
            max-width: 400px;
            animation: slideIn 0.3s ease;
        `;

        notification.innerHTML = `
            <i class="fas fa-${icons[type]}" style="font-size: 1.2rem;"></i>
            <div style="flex: 1;">${Security.sanitizeInput(message)}</div>
            <i class="fas fa-times" style="cursor: pointer; opacity: 0.7;" onclick="this.parentElement.remove()"></i>
        `;

        document.body.appendChild(notification);

        if (duration > 0) {
            setTimeout(() => {
                notification.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }, duration);
        }
    }
};

// Add animation styles
if (!document.getElementById('shared-utilities-styles')) {
    const style = document.createElement('style');
    style.id = 'shared-utilities-styles';
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// ===== UTILITY FUNCTIONS =====
const Utils = {
    /**
     * Generate unique ID
     * @returns {string}
     */
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    /**
     * Format date for display
     * @param {string|Date} date - Date to format
     * @returns {string}
     */
    formatDate(date) {
        const d = new Date(date);
        return d.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    },

    /**
     * Copy text to clipboard
     * @param {string} text - Text to copy
     */
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            Notifications.success('Copied to clipboard!');
        } catch (err) {
            console.error('Failed to copy:', err);
            Notifications.error('Failed to copy to clipboard');
        }
    },

    /**
     * Download text as file
     * @param {string} text - Text content
     * @param {string} filename - File name
     * @param {string} type - MIME type
     */
    downloadText(text, filename, type = 'text/plain') {
        const blob = new Blob([text], { type });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
};

// ===== EXPORT ALL =====
window.SharedUtilities = {
    CONFIG,
    PaginationManager,
    SelectionManager,
    CacheManager,
    Security,
    FileValidator,
    DuplicateDetector,
    DragDropHandler,
    ImagePreviewHandler,
    FileListHandler,
    SearchFilter,
    DataExporter,
    Notifications,
    Utils
};

console.log('✅ Shared Utilities v2.0.0 loaded successfully');
