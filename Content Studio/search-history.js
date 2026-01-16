/**
 * Search History Feature for Content Hub
 * Saves and suggests recent searches
 * Author: Md Akhinoor Islam
 * A3KM Studio
 */

class SearchHistory {
    constructor() {
        this.storageKey = 'a3km_search_history';
        this.maxHistory = 10;
    }

    // ==================== HISTORY MANAGEMENT ====================

    getHistory() {
        try {
            const history = localStorage.getItem(this.storageKey);
            return history ? JSON.parse(history) : [];
        } catch (error) {
            console.error('Error reading search history:', error);
            return [];
        }
    }

    addSearch(query) {
        if (!query || query.trim().length < 2) return;
        
        query = query.trim();
        let history = this.getHistory();
        
        // Remove if already exists
        history = history.filter(item => item.query.toLowerCase() !== query.toLowerCase());
        
        // Add to beginning
        history.unshift({
            query: query,
            timestamp: new Date().toISOString(),
            count: 1
        });
        
        // Limit history size
        history = history.slice(0, this.maxHistory);
        
        this.saveHistory(history);
        return history;
    }

    incrementSearchCount(query) {
        let history = this.getHistory();
        const existing = history.find(item => item.query.toLowerCase() === query.toLowerCase());
        
        if (existing) {
            existing.count++;
            existing.timestamp = new Date().toISOString();
            this.saveHistory(history);
        }
    }

    removeSearch(query) {
        let history = this.getHistory();
        history = history.filter(item => item.query !== query);
        this.saveHistory(history);
        return history;
    }

    clearHistory() {
        localStorage.removeItem(this.storageKey);
        return [];
    }

    saveHistory(history) {
        localStorage.setItem(this.storageKey, JSON.stringify(history));
    }

    // ==================== SEARCH SUGGESTIONS ====================

    getSuggestions(query, limit = 5) {
        if (!query || query.length < 2) {
            return this.getRecentSearches(limit);
        }
        
        const history = this.getHistory();
        const lowerQuery = query.toLowerCase();
        
        const matches = history.filter(item => 
            item.query.toLowerCase().includes(lowerQuery)
        );
        
        return matches.slice(0, limit);
    }

    getRecentSearches(limit = 5) {
        return this.getHistory().slice(0, limit);
    }

    getPopularSearches(limit = 5) {
        const history = this.getHistory();
        return history
            .sort((a, b) => b.count - a.count)
            .slice(0, limit);
    }

    // ==================== UI RENDERING ====================

    renderSearchDropdown(containerId, query = '') {
        const container = document.getElementById(containerId);
        if (!container) return;

        const suggestions = this.getSuggestions(query);
        
        if (suggestions.length === 0) {
            container.innerHTML = '';
            container.style.display = 'none';
            return;
        }

        let html = '<div class="search-dropdown">';
        
        if (!query) {
            html += '<div class="dropdown-header">Recent Searches</div>';
        } else {
            html += '<div class="dropdown-header">Suggestions</div>';
        }
        
        suggestions.forEach(item => {
            html += `
                <div class="dropdown-item" onclick="searchHistory.selectSearch('${this.escapeHTML(item.query)}')">
                    <span class="search-icon">🔍</span>
                    <span class="search-text">${this.highlightQuery(item.query, query)}</span>
                    <span class="search-count">${item.count > 1 ? `(${item.count})` : ''}</span>
                    <button class="remove-search" onclick="event.stopPropagation(); searchHistory.removeSearch('${this.escapeHTML(item.query)}'); searchHistory.renderSearchDropdown('searchDropdown', '');">✕</button>
                </div>
            `;
        });
        
        if (this.getHistory().length > 0) {
            html += `
                <div class="dropdown-footer">
                    <button onclick="searchHistory.clearHistory(); searchHistory.renderSearchDropdown('searchDropdown', '');">
                        Clear History
                    </button>
                </div>
            `;
        }
        
        html += '</div>';
        
        container.innerHTML = html;
        container.style.display = 'block';
    }

    selectSearch(query) {
        const searchInput = document.getElementById('studioSearch');
        if (searchInput) {
            searchInput.value = query;
            // Trigger search (assuming there's a search function in hub.js)
            if (typeof window.performSearch === 'function') {
                window.performSearch(query);
            }
        }
        this.hideDropdown();
    }

    hideDropdown() {
        const container = document.getElementById('searchDropdown');
        if (container) {
            container.style.display = 'none';
        }
    }

    // ==================== ANALYTICS ====================

    getSearchAnalytics() {
        const history = this.getHistory();
        
        return {
            totalSearches: history.reduce((sum, item) => sum + item.count, 0),
            uniqueSearches: history.length,
            topSearches: this.getPopularSearches(5),
            recentSearches: history.slice(0, 5),
            averageSearchLength: history.length > 0 
                ? history.reduce((sum, item) => sum + item.query.length, 0) / history.length 
                : 0
        };
    }

    exportHistory() {
        const history = this.getHistory();
        const json = JSON.stringify(history, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `search_history_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
    }

    // ==================== HELPER METHODS ====================

    highlightQuery(text, query) {
        if (!query) return this.escapeHTML(text);
        
        const escapedText = this.escapeHTML(text);
        const escapedQuery = this.escapeHTML(query);
        const regex = new RegExp(`(${escapedQuery})`, 'gi');
        
        return escapedText.replace(regex, '<strong>$1</strong>');
    }

    escapeHTML(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    formatTime(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = (now - date) / 1000; // seconds

        if (diff < 60) return 'Just now';
        if (diff < 3600) return Math.floor(diff / 60) + 'min ago';
        if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
        if (diff < 604800) return Math.floor(diff / 86400) + 'd ago';
        
        return date.toLocaleDateString();
    }
}

// ==================== SEARCH HISTORY STYLES ====================

const searchHistoryStyles = `
<style>
.search-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: #2d2d2d;
    border: 1px solid #444;
    border-radius: 0 0 5px 5px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
    z-index: 1000;
    max-height: 400px;
    overflow-y: auto;
}

.dropdown-header {
    padding: 10px 15px;
    background: #1a1a1a;
    color: #999;
    font-size: 12px;
    text-transform: uppercase;
    font-weight: bold;
    border-bottom: 1px solid #444;
}

.dropdown-item {
    padding: 12px 15px;
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    transition: background 0.2s;
}

.dropdown-item:hover {
    background: #3d3d3d;
}

.search-icon {
    font-size: 16px;
    opacity: 0.6;
}

.search-text {
    flex: 1;
    color: #fff;
}

.search-text strong {
    color: #CC0000;
    font-weight: bold;
}

.search-count {
    color: #999;
    font-size: 12px;
}

.remove-search {
    background: none;
    border: none;
    color: #666;
    cursor: pointer;
    padding: 5px;
    font-size: 16px;
    transition: color 0.2s;
}

.remove-search:hover {
    color: #CC0000;
}

.dropdown-footer {
    padding: 10px 15px;
    background: #1a1a1a;
    border-top: 1px solid #444;
    text-align: center;
}

.dropdown-footer button {
    background: none;
    border: 1px solid #444;
    color: #999;
    padding: 8px 20px;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 12px;
}

.dropdown-footer button:hover {
    background: #CC0000;
    color: #fff;
    border-color: #CC0000;
}

/* Search container positioning */
.search-container {
    position: relative;
}
</style>
`;

// Inject styles
if (typeof document !== 'undefined') {
    document.head.insertAdjacentHTML('beforeend', searchHistoryStyles);
}

// ==================== GLOBAL INSTANCE ====================

window.searchHistory = new SearchHistory();

// ==================== INTEGRATION HELPER ====================

// Add this function to hub.js to integrate search history
function setupSearchHistoryIntegration() {
    const searchInput = document.getElementById('studioSearch');
    if (!searchInput) return;

    // Create dropdown container
    const dropdownContainer = document.createElement('div');
    dropdownContainer.id = 'searchDropdown';
    dropdownContainer.style.display = 'none';
    searchInput.parentElement.appendChild(dropdownContainer);

    // Show suggestions on focus
    searchInput.addEventListener('focus', function() {
        searchHistory.renderSearchDropdown('searchDropdown', this.value);
    });

    // Update suggestions on input
    searchInput.addEventListener('input', function() {
        searchHistory.renderSearchDropdown('searchDropdown', this.value);
    });

    // Hide dropdown on blur (with delay to allow clicking)
    searchInput.addEventListener('blur', function() {
        setTimeout(() => searchHistory.hideDropdown(), 200);
    });

    // Save search on Enter
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && this.value.trim()) {
            searchHistory.addSearch(this.value.trim());
            searchHistory.hideDropdown();
        }
    });
}

// Auto-setup when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupSearchHistoryIntegration);
} else {
    setupSearchHistoryIntegration();
}

console.log('🔍 Search History System Loaded');
