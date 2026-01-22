/**
 * Tags System
 * Multi-tag support and advanced filtering
 * Version: 1.0.0
 * Last Updated: January 22, 2026
 */

class TagsManager {
    constructor() {
        this.predefinedTags = {
            difficulty: ['beginner', 'intermediate', 'advanced', 'expert'],
            type: ['tutorial', 'project', 'example', 'reference'],
            hardware: ['arduino-uno', 'raspberry-pi', 'esp32', 'stm32'],
            software: ['matlab', 'simulink', 'solidworks', 'arduino-ide'],
            topic: ['robotics', 'iot', 'ai', 'automation', 'signals', '3d-printing']
        };
    }

    /**
     * Get all unique tags from projects
     * @param {Array} projects - Array of projects
     * @returns {Array}
     */
    getAllTags(projects) {
        const tagsSet = new Set();
        
        projects.forEach(project => {
            if (project.tags && Array.isArray(project.tags)) {
                project.tags.forEach(tag => tagsSet.add(tag.toLowerCase()));
            }
        });

        return Array.from(tagsSet).sort();
    }

    /**
     * Get tag frequency
     * @param {Array} projects - Array of projects
     * @returns {object}
     */
    getTagFrequency(projects) {
        const frequency = {};

        projects.forEach(project => {
            if (project.tags && Array.isArray(project.tags)) {
                project.tags.forEach(tag => {
                    const normalized = tag.toLowerCase();
                    frequency[normalized] = (frequency[normalized] || 0) + 1;
                });
            }
        });

        return frequency;
    }

    /**
     * Get popular tags (top N by frequency)
     * @param {Array} projects - Array of projects
     * @param {number} limit - Number of tags to return
     * @returns {Array}
     */
    getPopularTags(projects, limit = 10) {
        const frequency = this.getTagFrequency(projects);
        
        return Object.entries(frequency)
            .sort((a, b) => b[1] - a[1])
            .slice(0, limit)
            .map(([tag, count]) => ({ tag, count }));
    }

    /**
     * Filter projects by tags (AND logic - all tags must match)
     * @param {Array} projects - Array of projects
     * @param {Array} tags - Tags to filter by
     * @returns {Array}
     */
    filterByTagsAND(projects, tags) {
        if (!tags || tags.length === 0) return projects;

        const normalizedTags = tags.map(t => t.toLowerCase());

        return projects.filter(project => {
            if (!project.tags || !Array.isArray(project.tags)) return false;
            
            const projectTags = project.tags.map(t => t.toLowerCase());
            return normalizedTags.every(tag => projectTags.includes(tag));
        });
    }

    /**
     * Filter projects by tags (OR logic - any tag matches)
     * @param {Array} projects - Array of projects
     * @param {Array} tags - Tags to filter by
     * @returns {Array}
     */
    filterByTagsOR(projects, tags) {
        if (!tags || tags.length === 0) return projects;

        const normalizedTags = tags.map(t => t.toLowerCase());

        return projects.filter(project => {
            if (!project.tags || !Array.isArray(project.tags)) return false;
            
            const projectTags = project.tags.map(t => t.toLowerCase());
            return normalizedTags.some(tag => projectTags.includes(tag));
        });
    }

    /**
     * Suggest tags based on input
     * @param {string} input - User input
     * @param {Array} existingTags - Existing tags in database
     * @returns {Array}
     */
    suggestTags(input, existingTags = []) {
        if (!input) return [];

        const query = input.toLowerCase();
        const suggestions = [];

        // Check predefined tags
        Object.values(this.predefinedTags).flat().forEach(tag => {
            if (tag.includes(query)) {
                suggestions.push(tag);
            }
        });

        // Check existing tags
        existingTags.forEach(tag => {
            if (tag.toLowerCase().includes(query) && !suggestions.includes(tag)) {
                suggestions.push(tag);
            }
        });

        return suggestions.slice(0, 10); // Limit to 10 suggestions
    }

    /**
     * Normalize tag (lowercase, trim, replace spaces with hyphens)
     * @param {string} tag - Tag to normalize
     * @returns {string}
     */
    normalizeTag(tag) {
        return tag.trim().toLowerCase().replace(/\s+/g, '-');
    }

    /**
     * Validate tag
     * @param {string} tag - Tag to validate
     * @returns {boolean}
     */
    validateTag(tag) {
        const normalized = this.normalizeTag(tag);
        
        // Check length
        if (normalized.length < 2 || normalized.length > 30) {
            return false;
        }

        // Check characters (alphanumeric and hyphens only)
        if (!/^[a-z0-9-]+$/.test(normalized)) {
            return false;
        }

        return true;
    }

    /**
     * Add tag to project
     * @param {object} project - Project object
     * @param {string} tag - Tag to add
     * @returns {boolean}
     */
    addTag(project, tag) {
        const normalized = this.normalizeTag(tag);

        if (!this.validateTag(normalized)) {
            return false;
        }

        if (!project.tags) {
            project.tags = [];
        }

        if (!project.tags.includes(normalized)) {
            project.tags.push(normalized);
            return true;
        }

        return false;
    }

    /**
     * Remove tag from project
     * @param {object} project - Project object
     * @param {string} tag - Tag to remove
     * @returns {boolean}
     */
    removeTag(project, tag) {
        const normalized = this.normalizeTag(tag);

        if (!project.tags) return false;

        const index = project.tags.indexOf(normalized);
        if (index > -1) {
            project.tags.splice(index, 1);
            return true;
        }

        return false;
    }

    /**
     * Get related projects by common tags
     * @param {object} project - Project to find related projects for
     * @param {Array} allProjects - All projects
     * @param {number} limit - Max number of results
     * @returns {Array}
     */
    getRelatedProjects(project, allProjects, limit = 5) {
        if (!project.tags || project.tags.length === 0) return [];

        const scored = allProjects
            .filter(p => p.id !== project.id)
            .map(p => {
                if (!p.tags || p.tags.length === 0) return { project: p, score: 0 };

                const commonTags = project.tags.filter(tag => 
                    p.tags.map(t => t.toLowerCase()).includes(tag.toLowerCase())
                );

                return {
                    project: p,
                    score: commonTags.length
                };
            })
            .filter(item => item.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, limit);

        return scored.map(item => item.project);
    }
}

// ===== UI COMPONENTS =====

/**
 * Create tag input component with autocomplete
 * @param {string} containerId - Container element ID
 * @param {TagsManager} tagsManager - Tags manager instance
 * @param {Array} existingTags - Existing tags in database
 * @param {function} onTagsChange - Callback when tags change
 * @returns {object} - Component controller
 */
function createTagInput(containerId, tagsManager, existingTags, onTagsChange) {
    const container = document.getElementById(containerId);
    if (!container) return null;

    let selectedTags = [];

    container.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 10px;">
            <div id="${containerId}_tags" style="display: flex; flex-wrap: wrap; gap: 8px; min-height: 40px; 
                 padding: 10px; background: #2d2d2d; border-radius: 8px; border: 2px solid #444;">
                <input type="text" id="${containerId}_input" placeholder="Type to add tags..." 
                       style="flex: 1; min-width: 150px; background: transparent; border: none; 
                              color: white; outline: none;">
            </div>
            <div id="${containerId}_suggestions" style="display: none; background: #2d2d2d; 
                 border-radius: 8px; max-height: 200px; overflow-y: auto;"></div>
            <div style="color: #888; font-size: 0.85rem;">
                Press Enter to add tag. Click tag to remove.
            </div>
        </div>
    `;

    const input = container.querySelector(`#${containerId}_input`);
    const tagsContainer = container.querySelector(`#${containerId}_tags`);
    const suggestionsContainer = container.querySelector(`#${containerId}_suggestions`);

    function renderTags() {
        // Clear existing tags (keep input)
        const existingTagElements = tagsContainer.querySelectorAll('.tag-item');
        existingTagElements.forEach(el => el.remove());

        // Add tags before input
        selectedTags.forEach(tag => {
            const tagEl = document.createElement('span');
            tagEl.className = 'tag-item';
            tagEl.style.cssText = `
                background: linear-gradient(135deg, #2196F3, #1976D2);
                color: white;
                padding: 6px 12px;
                border-radius: 20px;
                font-size: 0.85rem;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 6px;
            `;
            tagEl.innerHTML = `
                ${tag}
                <i class="fas fa-times" style="font-size: 0.75rem;"></i>
            `;
            tagEl.onclick = () => {
                selectedTags = selectedTags.filter(t => t !== tag);
                renderTags();
                if (onTagsChange) onTagsChange(selectedTags);
            };
            tagsContainer.insertBefore(tagEl, input);
        });
    }

    function showSuggestions(suggestions) {
        if (suggestions.length === 0) {
            suggestionsContainer.style.display = 'none';
            return;
        }

        suggestionsContainer.innerHTML = suggestions.map(tag => `
            <div class="suggestion-item" data-tag="${tag}" 
                 style="padding: 10px 15px; cursor: pointer; color: white; border-bottom: 1px solid #444;">
                <i class="fas fa-tag" style="margin-right: 8px; color: #2196F3;"></i>
                ${tag}
            </div>
        `).join('');

        suggestionsContainer.style.display = 'block';

        // Add click handlers
        suggestionsContainer.querySelectorAll('.suggestion-item').forEach(el => {
            el.onclick = () => {
                const tag = el.dataset.tag;
                addTag(tag);
            };
        });
    }

    function addTag(tag) {
        const normalized = tagsManager.normalizeTag(tag);
        
        if (!tagsManager.validateTag(normalized)) {
            alert('Invalid tag. Use only letters, numbers, and hyphens (2-30 characters).');
            return;
        }

        if (!selectedTags.includes(normalized)) {
            selectedTags.push(normalized);
            renderTags();
            if (onTagsChange) onTagsChange(selectedTags);
        }

        input.value = '';
        suggestionsContainer.style.display = 'none';
    }

    // Input handlers
    input.addEventListener('input', (e) => {
        const value = e.target.value.trim();
        if (value.length > 0) {
            const suggestions = tagsManager.suggestTags(value, existingTags);
            showSuggestions(suggestions);
        } else {
            suggestionsContainer.style.display = 'none';
        }
    });

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const value = input.value.trim();
            if (value) {
                addTag(value);
            }
        }
    });

    // Click outside to close suggestions
    document.addEventListener('click', (e) => {
        if (!container.contains(e.target)) {
            suggestionsContainer.style.display = 'none';
        }
    });

    return {
        getTags: () => selectedTags,
        setTags: (tags) => {
            selectedTags = tags.map(t => tagsManager.normalizeTag(t));
            renderTags();
        },
        clear: () => {
            selectedTags = [];
            renderTags();
        }
    };
}

/**
 * Show tag cloud visualization
 * @param {Array} projects - Array of projects
 * @param {TagsManager} tagsManager - Tags manager instance
 * @param {function} onTagClick - Callback when tag clicked
 */
function showTagCloud(projects, tagsManager, onTagClick) {
    const frequency = tagsManager.getTagFrequency(projects);
    const maxCount = Math.max(...Object.values(frequency));

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
    `;

    const tags = Object.entries(frequency)
        .sort((a, b) => b[1] - a[1])
        .map(([tag, count]) => {
            const size = 0.8 + (count / maxCount) * 1.5; // 0.8rem to 2.3rem
            const opacity = 0.6 + (count / maxCount) * 0.4;
            return { tag, count, size, opacity };
        });

    modal.innerHTML = `
        <div style="background: #1e1e1e; padding: 30px; border-radius: 12px; max-width: 800px; width: 90%; max-height: 80vh; overflow-y: auto;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2 style="color: #fff; margin: 0;">
                    <i class="fas fa-tags"></i> Tag Cloud
                </h2>
                <button onclick="this.closest('div[style*=fixed]').remove()" 
                        style="background: #444; color: white; border: none; padding: 8px 12px; 
                               border-radius: 6px; cursor: pointer;">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div style="background: #2d2d2d; padding: 30px; border-radius: 8px; text-align: center; line-height: 2.5;">
                ${tags.map(({ tag, count, size, opacity }) => `
                    <span class="cloud-tag" data-tag="${tag}" 
                          style="display: inline-block; margin: 5px 10px; cursor: pointer; 
                                 color: #2196F3; font-size: ${size}rem; opacity: ${opacity};
                                 transition: all 0.3s; font-weight: 600;">
                        ${tag}
                        <span style="font-size: 0.6em; color: #888;">(${count})</span>
                    </span>
                `).join('')}
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Add hover effect
    modal.querySelectorAll('.cloud-tag').forEach(el => {
        el.addEventListener('mouseenter', () => {
            el.style.transform = 'scale(1.2)';
            el.style.opacity = '1';
        });
        el.addEventListener('mouseleave', () => {
            el.style.transform = 'scale(1)';
        });
        el.addEventListener('click', () => {
            const tag = el.dataset.tag;
            modal.remove();
            if (onTagClick) onTagClick(tag);
        });
    });
}

// Export
window.TagsManager = TagsManager;
window.createTagInput = createTagInput;
window.showTagCloud = showTagCloud;

console.log('✅ Tags System loaded');
