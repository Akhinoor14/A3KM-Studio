/**
 * Version History Manager
 * Track changes and enable rollback
 * Version: 1.0.0
 * Last Updated: January 22, 2026
 */

class VersionHistoryManager {
    constructor(storageKey) {
        this.storageKey = storageKey + '_history';
        this.maxVersions = 50; // Keep last 50 versions
    }

    /**
     * Get all versions for a project
     * @param {number} projectId - Project ID
     * @returns {Array}
     */
    getVersions(projectId) {
        const history = this.loadHistory();
        return history[projectId] || [];
    }

    /**
     * Add new version
     * @param {number} projectId - Project ID
     * @param {object} oldData - Old project data
     * @param {object} newData - New project data
     * @param {string} action - Action type (create, update, delete)
     * @param {string} user - User identifier
     */
    addVersion(projectId, oldData, newData, action = 'update', user = 'admin') {
        const history = this.loadHistory();

        if (!history[projectId]) {
            history[projectId] = [];
        }

        const version = {
            version: history[projectId].length + 1,
            timestamp: new Date().toISOString(),
            action: action,
            user: user,
            changes: this.detectChanges(oldData, newData),
            snapshot: JSON.parse(JSON.stringify(newData)) // Deep clone
        };

        history[projectId].push(version);

        // Keep only last N versions
        if (history[projectId].length > this.maxVersions) {
            history[projectId] = history[projectId].slice(-this.maxVersions);
        }

        this.saveHistory(history);
        return version;
    }

    /**
     * Detect changes between two objects
     * @param {object} oldData - Old data
     * @param {object} newData - New data
     * @returns {Array}
     */
    detectChanges(oldData, newData) {
        const changes = [];

        if (!oldData) {
            return [{ field: 'all', type: 'created', old: null, new: newData }];
        }

        if (!newData) {
            return [{ field: 'all', type: 'deleted', old: oldData, new: null }];
        }

        const allKeys = new Set([
            ...Object.keys(oldData),
            ...Object.keys(newData)
        ]);

        for (const key of allKeys) {
            const oldValue = oldData[key];
            const newValue = newData[key];

            if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
                changes.push({
                    field: key,
                    type: 'modified',
                    old: oldValue,
                    new: newValue
                });
            }
        }

        return changes;
    }

    /**
     * Rollback to specific version
     * @param {number} projectId - Project ID
     * @param {number} versionNumber - Version number to rollback to
     * @returns {object} - Project data from that version
     */
    rollback(projectId, versionNumber) {
        const versions = this.getVersions(projectId);
        const version = versions.find(v => v.version === versionNumber);

        if (!version) {
            throw new Error(`Version ${versionNumber} not found`);
        }

        return JSON.parse(JSON.stringify(version.snapshot));
    }

    /**
     * Get latest version
     * @param {number} projectId - Project ID
     * @returns {object|null}
     */
    getLatestVersion(projectId) {
        const versions = this.getVersions(projectId);
        return versions.length > 0 ? versions[versions.length - 1] : null;
    }

    /**
     * Get version statistics
     * @param {number} projectId - Project ID
     * @returns {object}
     */
    getStats(projectId) {
        const versions = this.getVersions(projectId);
        
        const stats = {
            totalVersions: versions.length,
            firstEdit: versions.length > 0 ? versions[0].timestamp : null,
            lastEdit: versions.length > 0 ? versions[versions.length - 1].timestamp : null,
            editors: [...new Set(versions.map(v => v.user))],
            actionCounts: {
                create: versions.filter(v => v.action === 'create').length,
                update: versions.filter(v => v.action === 'update').length,
                delete: versions.filter(v => v.action === 'delete').length
            }
        };

        return stats;
    }

    /**
     * Clear history for a project
     * @param {number} projectId - Project ID
     */
    clearProjectHistory(projectId) {
        const history = this.loadHistory();
        delete history[projectId];
        this.saveHistory(history);
    }

    /**
     * Clear all history
     */
    clearAllHistory() {
        localStorage.removeItem(this.storageKey);
    }

    /**
     * Load history from storage
     * @returns {object}
     */
    loadHistory() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : {};
        } catch (e) {
            console.error('Failed to load history:', e);
            return {};
        }
    }

    /**
     * Save history to storage
     * @param {object} history - History data
     */
    saveHistory(history) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(history));
        } catch (e) {
            console.error('Failed to save history:', e);
            // If storage full, clear old entries
            if (e.name === 'QuotaExceededError') {
                this.pruneHistory(history);
            }
        }
    }

    /**
     * Prune old history entries when storage is full
     * @param {object} history - History data
     */
    pruneHistory(history) {
        // Keep only last 10 versions per project
        for (const projectId in history) {
            history[projectId] = history[projectId].slice(-10);
        }
        this.saveHistory(history);
    }

    /**
     * Export history to JSON
     * @returns {string}
     */
    exportHistory() {
        const history = this.loadHistory();
        return JSON.stringify(history, null, 2);
    }

    /**
     * Import history from JSON
     * @param {string} jsonString - JSON string
     */
    importHistory(jsonString) {
        try {
            const history = JSON.parse(jsonString);
            this.saveHistory(history);
            return true;
        } catch (e) {
            console.error('Failed to import history:', e);
            return false;
        }
    }
}

// ===== UI COMPONENTS =====

/**
 * Show version history modal
 * @param {number} projectId - Project ID
 * @param {VersionHistoryManager} historyManager - History manager instance
 * @param {function} onRollback - Callback when rollback clicked
 */
function showVersionHistoryModal(projectId, historyManager, onRollback) {
    const versions = historyManager.getVersions(projectId);
    const stats = historyManager.getStats(projectId);

    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        overflow-y: auto;
    `;

    modal.innerHTML = `
        <div style="background: #1e1e1e; padding: 30px; border-radius: 12px; max-width: 800px; width: 90%; max-height: 90vh; overflow-y: auto;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2 style="color: #fff; margin: 0;">
                    <i class="fas fa-history"></i> Version History
                </h2>
                <button onclick="this.closest('div[style*=fixed]').remove()" 
                        style="background: #444; color: white; border: none; padding: 8px 12px; 
                               border-radius: 6px; cursor: pointer;">
                    <i class="fas fa-times"></i>
                </button>
            </div>

            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 25px;">
                <div style="background: #2d2d2d; padding: 15px; border-radius: 8px; text-align: center;">
                    <div style="color: #888; font-size: 0.85rem; margin-bottom: 5px;">Total Versions</div>
                    <div style="color: #fff; font-size: 1.5rem; font-weight: 600;">${stats.totalVersions}</div>
                </div>
                <div style="background: #2d2d2d; padding: 15px; border-radius: 8px; text-align: center;">
                    <div style="color: #888; font-size: 0.85rem; margin-bottom: 5px;">Total Edits</div>
                    <div style="color: #fff; font-size: 1.5rem; font-weight: 600;">${stats.actionCounts.update}</div>
                </div>
                <div style="background: #2d2d2d; padding: 15px; border-radius: 8px; text-align: center;">
                    <div style="color: #888; font-size: 0.85rem; margin-bottom: 5px;">Contributors</div>
                    <div style="color: #fff; font-size: 1.5rem; font-weight: 600;">${stats.editors.length}</div>
                </div>
            </div>

            <div style="max-height: 400px; overflow-y: auto;">
                ${versions.length === 0 ? `
                    <p style="color: #888; text-align: center; padding: 40px;">
                        No version history available
                    </p>
                ` : versions.reverse().map(v => `
                    <div style="background: #2d2d2d; padding: 15px; border-radius: 8px; margin-bottom: 10px; 
                                border-left: 4px solid ${v.action === 'create' ? '#4CAF50' : v.action === 'delete' ? '#F44336' : '#2196F3'};">
                        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 10px;">
                            <div>
                                <span style="color: #fff; font-weight: 600;">Version ${v.version}</span>
                                <span style="color: #888; margin-left: 10px; font-size: 0.9rem;">
                                    ${new Date(v.timestamp).toLocaleString()}
                                </span>
                            </div>
                            <button onclick="handleRollback(${projectId}, ${v.version})" 
                                    style="background: #2196F3; color: white; border: none; padding: 6px 12px; 
                                           border-radius: 4px; cursor: pointer; font-size: 0.85rem;">
                                <i class="fas fa-undo"></i> Rollback
                            </button>
                        </div>
                        <div style="color: #888; font-size: 0.85rem; margin-bottom: 8px;">
                            <i class="fas fa-user"></i> ${v.user} • 
                            <i class="fas fa-tag"></i> ${v.action}
                        </div>
                        ${v.changes.length > 0 ? `
                            <details style="color: #aaa; font-size: 0.85rem;">
                                <summary style="cursor: pointer; color: #2196F3;">
                                    ${v.changes.length} change(s)
                                </summary>
                                <div style="margin-top: 10px; padding-left: 15px;">
                                    ${v.changes.map(c => `
                                        <div style="margin-bottom: 5px;">
                                            <strong>${c.field}:</strong> 
                                            ${c.type === 'modified' ? `
                                                <span style="color: #F44336;">${JSON.stringify(c.old)}</span> → 
                                                <span style="color: #4CAF50;">${JSON.stringify(c.new)}</span>
                                            ` : c.type}
                                        </div>
                                    `).join('')}
                                </div>
                            </details>
                        ` : ''}
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Attach rollback handler
    window.handleRollback = (projectId, versionNumber) => {
        if (confirm(`Rollback to version ${versionNumber}?\n\nThis will replace current data with that version.`)) {
            modal.remove();
            onRollback(projectId, versionNumber);
        }
    };
}

// Export
window.VersionHistoryManager = VersionHistoryManager;
window.showVersionHistoryModal = showVersionHistoryModal;

console.log('✅ Version History Manager loaded');
