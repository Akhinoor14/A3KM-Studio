/**
 * MATLAB Projects - Advanced Enhancement Module
 * Includes: Loading animations, analytics, tag filtering, sorting
 */

// ===== ANALYTICS & VIEW TRACKING =====
class MATLABAnalytics {
    constructor() {
        this.storageKey = 'matlab_analytics';
        this.init();
    }

    init() {
        if (!localStorage.getItem(this.storageKey)) {
            localStorage.setItem(this.storageKey, JSON.stringify({
                totalViews: 0,
                projectViews: {},
                categoryViews: {},
                lastVisit: null,
                popularProjects: []
            }));
        }
    }

    trackPageView() {
        const data = this.getData();
        data.totalViews++;
        data.lastVisit = new Date().toISOString();
        this.saveData(data);
    }

    trackProjectView(projectId, projectTitle) {
        const data = this.getData();
        
        if (!data.projectViews[projectId]) {
            data.projectViews[projectId] = {
                title: projectTitle,
                count: 0,
                lastViewed: null
            };
        }
        
        data.projectViews[projectId].count++;
        data.projectViews[projectId].lastViewed = new Date().toISOString();
        
        // Update popular projects
        this.updatePopularProjects(data);
        
        this.saveData(data);
    }

    trackCategoryView(category) {
        const data = this.getData();
        data.categoryViews[category] = (data.categoryViews[category] || 0) + 1;
        this.saveData(data);
    }

    updatePopularProjects(data) {
        const sorted = Object.entries(data.projectViews)
            .sort(([,a], [,b]) => b.count - a.count)
            .slice(0, 5);
        
        data.popularProjects = sorted.map(([id, info]) => ({
            id,
            title: info.title,
            views: info.count
        }));
    }

    getPopularProjects() {
        return this.getData().popularProjects;
    }

    getCategoryStats() {
        return this.getData().categoryViews;
    }

    getTotalViews() {
        return this.getData().totalViews;
    }

    getData() {
        return JSON.parse(localStorage.getItem(this.storageKey));
    }

    saveData(data) {
        localStorage.setItem(this.storageKey, JSON.stringify(data));
    }
}

// ===== LOADING ANIMATIONS =====
class LoadingManager {
    static showSkeleton(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const skeletonHTML = `
            <div class="skeleton-section">
                <div class="skeleton-header">
                    <div class="skeleton-icon"></div>
                    <div class="skeleton-title"></div>
                    <div class="skeleton-count"></div>
                </div>
                <div class="skeleton-grid">
                    ${Array(6).fill('').map(() => `
                        <div class="skeleton-card">
                            <div class="skeleton-card-header"></div>
                            <div class="skeleton-card-body">
                                <div class="skeleton-line"></div>
                                <div class="skeleton-line short"></div>
                            </div>
                            <div class="skeleton-tags">
                                <div class="skeleton-tag"></div>
                                <div class="skeleton-tag"></div>
                                <div class="skeleton-tag"></div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        container.innerHTML = skeletonHTML;
    }

    static fadeIn(elements) {
        elements.forEach((el, index) => {
            setTimeout(() => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(20px)';
                el.style.transition = 'all 0.4s ease';
                
                setTimeout(() => {
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }, 50);
            }, index * 50);
        });
    }
}

// ===== ADVANCED FILTERING & SORTING =====
class ProjectFilter {
    constructor() {
        this.activeFilters = {
            categories: new Set(['all']),
            tags: new Set(),
            difficulty: 'all',
            sortBy: 'newest'
        };
    }

    toggleTag(tag) {
        if (this.activeFilters.tags.has(tag)) {
            this.activeFilters.tags.delete(tag);
        } else {
            this.activeFilters.tags.add(tag);
        }
    }

    setSort(sortType) {
        this.activeFilters.sortBy = sortType;
    }

    filterProjects(projects) {
        let filtered = projects.filter(project => {
            // Category filter
            const categoryMatch = this.activeFilters.categories.has('all') || 
                                 this.activeFilters.categories.has(project.category);
            
            // Difficulty filter
            const difficultyMatch = this.activeFilters.difficulty === 'all' || 
                                   project.difficulty === this.activeFilters.difficulty;
            
            // Tag filter
            const tagMatch = this.activeFilters.tags.size === 0 || 
                            project.tags.some(tag => this.activeFilters.tags.has(tag));
            
            return categoryMatch && difficultyMatch && tagMatch;
        });

        // Sort
        return this.sortProjects(filtered);
    }

    sortProjects(projects) {
        const sorted = [...projects];
        
        switch(this.activeFilters.sortBy) {
            case 'name-asc':
                return sorted.sort((a, b) => a.title.localeCompare(b.title));
            case 'name-desc':
                return sorted.sort((a, b) => b.title.localeCompare(a.title));
            case 'difficulty-asc':
                const diffOrder = { 'Beginner': 1, 'Intermediate': 2, 'Advanced': 3 };
                return sorted.sort((a, b) => diffOrder[a.difficulty] - diffOrder[b.difficulty]);
            case 'difficulty-desc':
                const diffOrderDesc = { 'Beginner': 3, 'Intermediate': 2, 'Advanced': 1 };
                return sorted.sort((a, b) => diffOrderDesc[a.difficulty] - diffOrderDesc[b.difficulty]);
            case 'newest':
            default:
                return sorted.reverse(); // Assuming array is in order
        }
    }

    getAllTags(projects) {
        const tags = new Set();
        projects.forEach(project => {
            project.tags.forEach(tag => tags.add(tag));
        });
        return Array.from(tags).sort();
    }
}

// ===== SHARE FUNCTIONALITY =====
class ShareManager {
    static share(platform, projectTitle, projectUrl) {
        const url = encodeURIComponent(window.location.origin + projectUrl);
        const text = encodeURIComponent(`Check out this MATLAB project: ${projectTitle}`);
        
        const shareUrls = {
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
            twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
            linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${encodeURIComponent(projectTitle)}`,
            whatsapp: `https://wa.me/?text=${text}%20${url}`,
            email: `mailto:?subject=${encodeURIComponent(projectTitle)}&body=${text}%20${url}`
        };

        if (shareUrls[platform]) {
            window.open(shareUrls[platform], '_blank', 'width=600,height=400');
        }
    }

    static copyLink(url) {
        const fullUrl = window.location.origin + url;
        navigator.clipboard.writeText(fullUrl).then(() => {
            // Show success message
            const msg = document.createElement('div');
            msg.className = 'copy-success-toast';
            msg.innerHTML = '<i class="fas fa-check"></i> Link copied to clipboard!';
            document.body.appendChild(msg);
            
            setTimeout(() => {
                msg.classList.add('show');
            }, 10);
            
            setTimeout(() => {
                msg.classList.remove('show');
                setTimeout(() => msg.remove(), 300);
            }, 2000);
        });
    }

    static print() {
        window.print();
    }
}

// ===== PROJECT NAVIGATION =====
class ProjectNavigator {
    constructor(projects, currentProjectId) {
        this.projects = projects;
        this.currentIndex = projects.findIndex(p => p.id === currentProjectId);
    }

    getNext() {
        if (this.currentIndex < this.projects.length - 1) {
            return this.projects[this.currentIndex + 1];
        }
        return null;
    }

    getPrevious() {
        if (this.currentIndex > 0) {
            return this.projects[this.currentIndex - 1];
        }
        return null;
    }

    getSimilar(currentProject, limit = 3) {
        // Find projects in same category, excluding current
        return this.projects
            .filter(p => p.id !== currentProject.id && p.category === currentProject.category)
            .slice(0, limit);
    }
}

// ===== CHART GENERATOR (for statistics) =====
class ChartGenerator {
    static createCategoryPieChart(categories, elementId) {
        const canvas = document.getElementById(elementId);
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const data = Object.values(categories);
        const total = data.reduce((a, b) => a + b, 0);
        
        if (total === 0) return;

        const colors = ['#0076A8', '#FF7F00', '#CC0000', '#00CC00', '#9900CC'];
        let currentAngle = -0.5 * Math.PI;

        data.forEach((value, index) => {
            const sliceAngle = (value / total) * 2 * Math.PI;
            
            ctx.fillStyle = colors[index % colors.length];
            ctx.beginPath();
            ctx.moveTo(150, 150);
            ctx.arc(150, 150, 120, currentAngle, currentAngle + sliceAngle);
            ctx.closePath();
            ctx.fill();
            
            currentAngle += sliceAngle;
        });

        // Center circle for donut effect
        ctx.fillStyle = '#0a0a0a';
        ctx.beginPath();
        ctx.arc(150, 150, 60, 0, 2 * Math.PI);
        ctx.fill();
    }

    static createDifficultyBar(stats, elementId) {
        const container = document.getElementById(elementId);
        if (!container) return;

        const total = stats.beginner + stats.intermediate + stats.advanced;
        if (total === 0) return;

        const html = `
            <div class="difficulty-bar">
                <div class="bar-segment beginner" style="width: ${(stats.beginner/total)*100}%">
                    ${stats.beginner}
                </div>
                <div class="bar-segment intermediate" style="width: ${(stats.intermediate/total)*100}%">
                    ${stats.intermediate}
                </div>
                <div class="bar-segment advanced" style="width: ${(stats.advanced/total)*100}%">
                    ${stats.advanced}
                </div>
            </div>
        `;
        
        container.innerHTML = html;
    }
}

// ===== EXPORT FUNCTIONS =====
window.MATLABAnalytics = MATLABAnalytics;
window.LoadingManager = LoadingManager;
window.ProjectFilter = ProjectFilter;
window.ShareManager = ShareManager;
window.ProjectNavigator = ProjectNavigator;
window.ChartGenerator = ChartGenerator;
