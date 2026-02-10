/* ============================================================================
   SOLIDWORKS PROJECTS LISTING - JAVASCRIPT
   Load and display SolidWorks models from JSON
   ============================================================================ */

(function() {
    'use strict';
    
    let allProjects = [];
    let currentFilter = 'all';
    let searchQuery = '';
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    async function init() {
        setupEventListeners();
        await loadSolidWorksProjects();
        animateSections();
    }
    
    function setupEventListeners() {
        // Search toggle
        const searchToggle = document.getElementById('searchToggle');
        const searchSection = document.getElementById('searchSection');
        const searchInput = document.getElementById('projectSearch');
        const searchClear = document.getElementById('searchClear');
        
        if (searchToggle) {
            searchToggle.addEventListener('click', () => {
                const isVisible = searchSection.style.display !== 'none';
                searchSection.style.display = isVisible ? 'none' : 'block';
                if (!isVisible) searchInput.focus();
            });
        }
        
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                searchQuery = e.target.value.toLowerCase().trim();
                searchClear.style.display = searchQuery ? 'block' : 'none';
                filterAndRenderProjects();
            });
        }
        
        if (searchClear) {
            searchClear.addEventListener('click', () => {
                searchInput.value = '';
                searchQuery = '';
                searchClear.style.display = 'none';
                filterAndRenderProjects();
            });
        }
        
        // Filter chips
        const filterChips = document.querySelectorAll('.filter-chip');
        filterChips.forEach(chip => {
            chip.addEventListener('click', () => {
                filterChips.forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                currentFilter = chip.dataset.filter;
                filterAndRenderProjects();
                
                if (navigator.vibrate) navigator.vibrate(10);
            });
        });
    }
    
    async function loadSolidWorksProjects() {
        try {
            showLoadingState();
            
            const response = await fetch('../../Projects Code/projects.json');
            if (!response.ok) throw new Error('Failed to load');
            
            const data = await response.json();
            // Filter only solidworks projects
            allProjects = (data.projects || []).filter(p => p.category === 'solidworks');
            
            console.log(`✅ Loaded ${allProjects.length} SolidWorks projects`);
            
            hideLoadingState();
            filterAndRenderProjects();
            updateProjectCount();
            
        } catch (error) {
            console.error('❌ Error loading SolidWorks projects:', error);
            showErrorState();
        }
    }
    
    function filterAndRenderProjects() {
        let filtered = allProjects;
        
        // Apply subcategory filter
        if (currentFilter !== 'all') {
            filtered = filtered.filter(p => p.subcategory === currentFilter);
        }
        
        // Apply search filter
        if (searchQuery) {
            filtered = filtered.filter(p => {
                return p.title.toLowerCase().includes(searchQuery) ||
                       p.description.toLowerCase().includes(searchQuery) ||
                       (p.fullDescription && p.fullDescription.toLowerCase().includes(searchQuery)) ||
                       (p.tags && p.tags.some(t => t.toLowerCase().includes(searchQuery)));
            });
        }
        
        renderProjects(filtered);
    }
    
    function renderProjects(projects) {
        const grid = document.getElementById('projectsGrid');
        const emptyState = document.getElementById('emptyState');
        
        if (projects.length === 0) {
            grid.style.display = 'none';
            emptyState.style.display = 'block';
            return;
        }
        
        grid.style.display = 'grid';
        emptyState.style.display = 'none';
        
        grid.innerHTML = projects.map(project => `
            <a href="project-viewer.html?id=${project.id}&category=solidworks" class="project-card">
                <div class="project-thumbnail solidworks-model">
                    ${project.thumbnail ? 
                        `<img src="${project.thumbnail}" alt="${project.title}" onerror="this.parentElement.innerHTML='<div style=\\'display:flex;flex-direction:column;align-items:center;gap:8px\\'><i class=\\'fas fa-cube\\' style=\\'font-size:56px;color:#CC0000;opacity:0.4\\'></i><span style=\\'font-size:11px;color:rgba(200,200,200,0.6);font-weight:600;text-transform:uppercase;letter-spacing:1px\\'>3D Model</span></div>'">` : 
                        `<div style="display:flex;flex-direction:column;align-items:center;gap:8px;">
                            <i class="fas fa-cube" style="font-size:56px;color:#CC0000;opacity:0.4;"></i>
                            <span style="font-size:11px;color:rgba(200,200,200,0.6);font-weight:600;text-transform:uppercase;letter-spacing:1px;">3D Model</span>
                        </div>`
                    }
                    <div class="project-badge">${getSubcategoryBadge(project.subcategory)}</div>
                    <div class="glb-indicator" style="position:absolute;bottom:8px;left:8px;padding:4px 8px;background:rgba(0,0,0,0.85);backdrop-filter:blur(8px);border:1px solid rgba(204,0,0,0.3);border-radius:8px;display:flex;align-items:center;gap:4px;z-index:2;">
                        <i class="fas fa-cube" style="font-size:10px;color:#CC0000;"></i>
                        <span style="font-size:9px;color:rgba(200,200,200,0.8);font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">GLB</span>
                    </div>
                </div>
                <div class="project-content">
                    <h3 class="project-title">${project.title}</h3>
                    <p class="project-desc">${project.description}</p>
                    <div class="project-meta">
                        <span><i class="fas fa-layer-group"></i> ${project.subcategory || 'Model'}</span>
                        <span>${getDifficultyStars(project.difficulty)}</span>
                    </div>
                </div>
                <div class="project-arrow">
                    <i class="fas fa-chevron-right"></i>
                </div>
            </a>
        `).join('');
        
        addHapticFeedback();
    }
    
    function getSubcategoryBadge(subcategory) {
        const badges = {
            'Basic Models': 'Basic',
            'Intermediate Models': 'Intermediate',
            'Professional Models': 'Pro',
            'Commercial Projects': 'Commercial'
        };
        return badges[subcategory] || 'Model';
    }
    
    function getDifficultyStars(difficulty) {
        const stars = {
            'Beginner': '⭐',
            'Intermediate': '⭐⭐',
            'Advanced': '⭐⭐⭐',
            'Professional': '⭐⭐⭐⭐'
        };
        return stars[difficulty] || '⭐';
    }
    
    function updateProjectCount() {
        const countEl = document.getElementById('projectCount');
        if (countEl) {
            countEl.textContent = `${allProjects.length} Models`;
        }
    }
    
    function showLoadingState() {
        const grid = document.getElementById('projectsGrid');
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
                <div style="display: inline-block; width: 50px; height: 50px; border: 4px solid rgba(205, 92, 92, 0.2); border-top-color: #CD5C5C; border-radius: 50%; animation: spin 1s linear infinite;"></div>
                <p style="margin-top: 20px; color: var(--text-secondary);">Loading SolidWorks models...</p>
            </div>
        `;
    }
    
    function hideLoadingState() {
        // Will be replaced by renderProjects
    }
    
    function showErrorState() {
        const grid = document.getElementById('projectsGrid');
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
                <i class="fas fa-exclamation-triangle" style="font-size: 48px; color: var(--primary-red); margin-bottom: 16px;"></i>
                <h3 style="color: var(--text-primary); margin-bottom: 8px;">Failed to Load Models</h3>
                <p style="color: var(--text-dim); margin: 12px 0;">Please check your connection and try again.</p>
                <button onclick="location.reload()" style="margin-top: 16px; padding: 10px 20px; background: var(--primary-red); color: #fff; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">
                    <i class="fas fa-redo"></i> Retry
                </button>
            </div>
        `;
    }
    
    function animateSections() {
        const sections = document.querySelectorAll('.mobile-section, .category-hero, .filter-section');
        sections.forEach((section, index) => {
            setTimeout(() => {
                section.style.opacity = '0';
                section.style.transform = 'translateY(20px)';
                section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                requestAnimationFrame(() => {
                    section.style.opacity = '1';
                    section.style.transform = 'translateY(0)';
                });
            }, index * 100);
        });
    }
    
    function addHapticFeedback() {
        const cards = document.querySelectorAll('.project-card, .filter-chip');
        cards.forEach(card => {
            card.addEventListener('touchstart', () => {
                if (navigator.vibrate) navigator.vibrate(10);
            });
        });
    }
    
})();
