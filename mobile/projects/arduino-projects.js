/* ============================================================================
   ARDUINO PROJECTS LISTING - JAVASCRIPT
   Load and display Arduino projects from JSON
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
        await loadArduinoProjects();
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
        
        // Filter chips with dynamic heading
        const filterChips = document.querySelectorAll('.filter-chip');
        filterChips.forEach(chip => {
            chip.addEventListener('click', () => {
                filterChips.forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                currentFilter = chip.dataset.filter;
                
                // Update dynamic heading
                const heading = document.getElementById('categoryHeading');
                if (heading && chip.dataset.name) {
                    heading.textContent = chip.dataset.name;
                }
                
                filterAndRenderProjects();
            });
        });
        
        // Setup scroll indicator
        setupScrollIndicator();
    }
    
    async function loadArduinoProjects() {
        try {
            showLoadingState();
            
            const response = await fetch('../../Projects%20Code/Arduino/arduino-data.json');
            if (!response.ok) throw new Error('Failed to load');
            
            const data = await response.json();
            allProjects = data.projects || [];
            
            console.log(`✅ Loaded ${allProjects.length} Arduino projects`);
            
            hideLoadingState();
            filterAndRenderProjects();
            updateProjectCount();
            
        } catch (error) {
            console.error('❌ Error loading Arduino projects:', error);
            showErrorState();
        }
    }
    
    function filterAndRenderProjects() {
        let filtered = allProjects;
        
        // Apply category filter
        if (currentFilter !== 'all') {
            filtered = filtered.filter(p => p.category === currentFilter);
        }
        
        // Apply search filter
        if (searchQuery) {
            filtered = filtered.filter(p => {
                return p.title.toLowerCase().includes(searchQuery) ||
                       p.description.toLowerCase().includes(searchQuery) ||
                       (p.components && p.components.some(c => c.toLowerCase().includes(searchQuery)));
            });
        }
        
        renderProjects(filtered);
        updateProjectCount();
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
        
        grid.innerHTML = projects.map(project => {
            const circuitPath = project.files && project.files.circuit 
                ? `../../Projects%20Storage/Arduino%20UNO%20Projects%20with%20Tinkercad/${encodeURIComponent(project.folder)}/${project.files.circuit}`
                : null;
            
            return `
            <a href="project-viewer.html?id=${project.id}&category=arduino" class="project-card">
                <div class="project-thumbnail" style="${circuitPath ? 'background: linear-gradient(135deg, rgba(0, 0, 0, 0.7), rgba(20, 0, 0, 0.85));' : ''}">
                    ${circuitPath 
                        ? `<img src="${circuitPath}" alt="${project.title}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" style="width:100%; height:100%; object-fit:cover; position:absolute; top:0; left:0; opacity:0.7;"><i class="fas fa-microchip" style="display:none; font-size:48px; color:#CC0000; opacity:0.4;"></i>` 
                        : `<i class="fas fa-microchip"></i>`}
                    <div class="project-badge">${getCategoryLabel(project.category)}</div>
                </div>
                <div class="project-content">
                    <h3 class="project-title">${project.title}</h3>
                    <p class="project-desc">${project.description}</p>
                    <div class="project-meta">
                        <span><i class="fas fa-tools"></i> ${project.components ? project.components.length : 0} Components</span>
                        ${project.tinkercad ? '<span><i class="fas fa-cube"></i> Tinkercad</span>' : ''}
                    </div>
                </div>
                <div class="project-arrow">
                    <i class="fas fa-chevron-right"></i>
                </div>
            </a>
        `;
        }).join('');
        
        addHapticFeedback();
    }
    
    function getCategoryLabel(category) {
        const labels = {
            'led-basics': 'LED Projects',
            'sensors-actuators': 'Sensors & Actuators',
            'display-input': 'Displays & Input',
            'advanced-projects': 'Advanced'
        };
        return labels[category] || 'Arduino';
    }
    
    function updateProjectCount() {
        const countEl = document.getElementById('projectCount');
        
        // Update main count badge (filtered count)
        let filtered = allProjects;
        if (currentFilter !== 'all') {
            filtered = filtered.filter(p => p.category === currentFilter);
        }
        if (searchQuery) {
            filtered = filtered.filter(p => {
                return p.title.toLowerCase().includes(searchQuery) ||
                       p.description.toLowerCase().includes(searchQuery) ||
                       (p.components && p.components.some(c => c.toLowerCase().includes(searchQuery)));
            });
        }
        
        if (countEl) {
            countEl.textContent = `${filtered.length} Project${filtered.length !== 1 ? 's' : ''}`;
        }
        
        // Update individual chip counts
        const chipCounts = document.querySelectorAll('.chip-count');
        chipCounts.forEach(countBadge => {
            const category = countBadge.dataset.category;
            if (category === 'all') {
                countBadge.textContent = allProjects.length;
            } else {
                const count = allProjects.filter(p => p.category === category).length;
                countBadge.textContent = count;
            }
        });
    }
    
    function showLoadingState() {
        const grid = document.getElementById('projectsGrid');
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
                <div style="display: inline-block; width: 50px; height: 50px; border: 4px solid rgba(204, 0, 0, 0.2); border-top-color: #CC0000; border-radius: 50%; animation: spin 1s linear infinite;"></div>
                <p style="margin-top: 20px; color: var(--text-secondary);">Loading Arduino projects...</p>
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
                <h3>Failed to Load Projects</h3>
                <p style="color: var(--text-dim); margin: 12px 0;">Please check your connection and try again.</p>
                <button onclick="location.reload()" style="margin-top: 16px; padding: 10px 20px; background: var(--primary-red); color: #fff; border: none; border-radius: 8px; font-weight: 600;">Retry</button>
            </div>
        `;
    }
    
    function animateSections() {
        const sections = document.querySelectorAll('.mobile-section, .category-hero');
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
        const cards = document.querySelectorAll('.project-card');
        cards.forEach(card => {
            card.addEventListener('touchstart', () => {
                if (navigator.vibrate) navigator.vibrate(10);
            });
        });
    }
        /**
     * Setup scroll indicator (Video Blogs style)
     */
    function setupScrollIndicator() {
        const scrollContainer = document.querySelector('.filter-scroll');
        if (!scrollContainer) return;
        
        function updateScrollIndicators() {
            const scrollLeft = scrollContainer.scrollLeft;
            const scrollWidth = scrollContainer.scrollWidth;
            const clientWidth = scrollContainer.clientWidth;
            const maxScroll = scrollWidth - clientWidth;
            
            scrollContainer.classList.remove('scrollable', 'scroll-start', 'scroll-middle', 'scroll-end');
            
            if (scrollWidth > clientWidth) {
                scrollContainer.classList.add('scrollable');
                
                if (scrollLeft <= 5) {
                    scrollContainer.classList.add('scroll-start');
                } else if (scrollLeft >= maxScroll - 5) {
                    scrollContainer.classList.add('scroll-end');
                } else {
                    scrollContainer.classList.add('scroll-middle');
                }
            }
        }
        
        scrollContainer.addEventListener('scroll', updateScrollIndicators);
        setTimeout(updateScrollIndicators, 100);
        window.addEventListener('resize', updateScrollIndicators);
    }
    })();
