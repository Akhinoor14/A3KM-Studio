/* ============================================================================
   MOBILE PROJECTS PAGE - JAVASCRIPT
   Project loading, filtering, and search functionality
   Dynamic data loading from projects.json (Desktop → Mobile sync)
   ============================================================================ */

(function() {
    'use strict';
    
    // Project data - loaded dynamically from JSON
    let allProjects = [];
    let currentFilter = 'all';
    let searchQuery = '';
    let isLoading = true;
    
    // Wait for DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    async function init() {
        setupEventListeners();
        await loadProjectsFromJSON();
        animateSections();
    }
    
    /**
     * Load projects dynamically from desktop JSON file
     * This enables automatic desktop → mobile sync
     */
    async function loadProjectsFromJSON() {
        try {
            showLoadingState();
            
            const response = await fetch('../../Projects Code/projects.json');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            allProjects = data.projects;
            
            console.log(`✅ Loaded ${allProjects.length} projects from JSON`);
            console.log(`📊 Categories: SOLIDWORKS(${data.statistics.byCategory.solidworks}), Arduino(${data.statistics.byCategory.arduino}), MATLAB(${data.statistics.byCategory.matlab}), Electronics(${data.statistics.byCategory.electronics})`);
            
            isLoading = false;
            hideLoadingState();
            renderProjects();
            
        } catch (error) {
            console.error('❌ Error loading projects:', error);
            isLoading = false;
            showErrorState();
        }
    }
    
    /**
     * Show loading spinner
     */
    function showLoadingState() {
        const grid = document.getElementById('projectsGrid');
        if (grid) {
            grid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
                    <div style="display: inline-block; width: 50px; height: 50px; border: 4px solid rgba(204, 0, 0, 0.2); border-top-color: var(--primary-red); border-radius: 50%; animation: spin 1s linear infinite;"></div>
                    <p style="margin-top: 20px; color: var(--text-secondary); font-size: 0.95rem;">Loading projects...</p>
                </div>
            `;
        }
    }
    
    /**
     * Hide loading state
     */
    function hideLoadingState() {
        // Loading UI will be replaced by renderProjects()
    }
    
    /**
     * Show error message
     */
    function showErrorState() {
        const grid = document.getElementById('projectsGrid');
        if (grid) {
            grid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: var(--primary-red); margin-bottom: 20px;"></i>
                    <p style="color: var(--text-primary); font-size: 1.1rem; margin-bottom: 10px;">Failed to load projects</p>
                    <p style="color: var(--text-secondary); font-size: 0.9rem;">Please check your connection and try again</p>
                    <button onclick="location.reload()" style="margin-top: 20px; padding: 12px 24px; background: var(--primary-red); color: white; border: none; border-radius: 8px; font-size: 0.95rem; cursor: pointer;">
                        <i class="fas fa-redo"></i> Retry
                    </button>
                </div>
            `;
        }
    }
    
    /**
     * Setup event listeners
     */
    function setupEventListeners() {
        // Filter buttons
        const filterButtons = document.querySelectorAll('.filter-chip');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active class from all buttons
                filterButtons.forEach(b => b.classList.remove('active'));
                // Add active to clicked button
                this.classList.add('active');
                // Update filter
                currentFilter = this.dataset.filter;
                renderProjects();
                
                // Haptic feedback
                if ('vibrate' in navigator) {
                    navigator.vibrate(10);
                }
            });
        });
        
        // Search input
        const searchInput = document.getElementById('projectSearch');
        if (searchInput) {
            searchInput.addEventListener('input', function(e) {
                searchQuery = e.target.value.toLowerCase();
                renderProjects();
            });
        }
    }
    
    /**
     * Filter projects based on current filter and search
     */
    function filterProjects() {
        if (!allProjects || allProjects.length === 0) {
            return [];
        }
        
        return allProjects.filter(project => {
            // Filter by category
            const matchesCategory = currentFilter === 'all' || project.category === currentFilter;
            
            // Filter by search query
            const matchesSearch = !searchQuery || 
                project.title.toLowerCase().includes(searchQuery) ||
                project.description.toLowerCase().includes(searchQuery) ||
                project.tags.some(tag => tag.toLowerCase().includes(searchQuery));
            
            return matchesCategory && matchesSearch;
        });
    }
    
    /**
     * Render projects to the grid
     */
    function renderProjects() {
        const grid = document.getElementById('projectsGrid');
        const emptyState = document.getElementById('emptyState');
        const filtered = filterProjects();
        
        if (filtered.length === 0) {
            grid.innerHTML = '';
            emptyState.style.display = 'block';
            return;
        }
        
        emptyState.style.display = 'none';
        
        grid.innerHTML = filtered.map(project => `
            <div class="project-card" data-category="${project.category}">
                <div class="project-image">
                    <i class="fas ${project.icon} project-icon"></i>
                    <span class="project-category-badge">${project.category}</span>
                </div>
                <div class="project-content">
                    <h3 class="project-title">${project.title}</h3>
                    <p class="project-description">${project.description}</p>
                    
                    <div class="project-tags">
                        ${project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
                    </div>
                    
                    <div class="project-footer">
                        ${project.category === 'electronics' && project.toolLink ? `
                        <a href="${project.toolLink}" target="_blank" class="project-btn primary" style="flex: 1;">
                            <i class="fas fa-external-link-alt"></i>
                            <span>Open Tool</span>
                        </a>
                        <a href="project-viewer.html?id=${project.id}" class="project-btn">
                            <i class="fas fa-info-circle"></i>
                            <span>Info</span>
                        </a>
                        ` : `
                        <a href="project-viewer.html?id=${project.id}" class="project-btn primary">
                            <i class="fas fa-eye"></i>
                            <span>View</span>
                        </a>
                        ${project.code || project.codePath ? `
                        <a href="project-viewer.html?id=${project.id}" class="project-btn">
                            <i class="fas fa-code"></i>
                            <span>Code</span>
                        </a>
                        ` : `
                        <a href="project-viewer.html?id=${project.id}" class="project-btn">
                            <i class="fas fa-info-circle"></i>
                            <span>Details</span>
                        </a>
                        `}
                        `}
                    </div>
                </div>
            </div>
        `).join('');
        
        // Add animation to newly rendered cards
        setTimeout(() => {
            const cards = document.querySelectorAll('.project-card');
            cards.forEach((card, index) => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 50);
            });
        }, 10);
    }
    
    /**
     * Animate sections on load
     */
    function animateSections() {
        const sections = document.querySelectorAll('.mobile-section');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '0';
                    entry.target.style.transform = 'translateY(20px)';
                    entry.target.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                    
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, 100);
                    
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -30px 0px'
        });
        
        sections.forEach(section => {
            observer.observe(section);
        });
    }
    
})();
