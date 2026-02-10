// ============================================================================
// PROJECT VIEWER - Individual Project Details (Mobile)
// Dynamic data loading from projects.json (Desktop → Mobile sync)
// Supports 3D GLB model viewing for SOLIDWORKS projects  
// Supports Arduino code/README/explanation viewing
// ============================================================================

(function() {
    'use strict';

    let allProjects = [];
    let currentProject = null;
    let isSaved = false;
    let glbViewer = null;
    
    const projectContainer = document.getElementById('projectContainer');
    const shareBtn = document.getElementById('shareBtn');
    const saveBtn = document.getElementById('saveBtn');

    // Store loaded markdown for fullscreen viewing
    let loadedReadmeMarkdown = '';
    let loadedExplanationMarkdown = '';
    
    // Sequential navigation helpers
    let currentProjectIndex = -1;
    let sequentialProjects = []; // For Arduino: arduino-01 to arduino-23

    // Initialize on page load
    init();

    async function init() {
        updateBackButton();
        await loadProjectsFromJSON();
        loadProject();
        setupEventListeners();
    }
    
    /**
     * Update back button to point to correct category page
     */
    function updateBackButton() {
        const urlParams = new URLSearchParams(window.location.search);
        const category = urlParams.get('category');
        const backBtn = document.querySelector('.back-btn');
        
        if (backBtn && category) {
            const categoryPages = {
                'arduino': 'arduino-projects.html',
                'solidworks': 'solidworks-projects.html',
                'matlab': 'matlab-projects.html',
                'electronics': 'electronics-projects.html'
            };
            
            const backPage = categoryPages[category] || 'projects.html';
            backBtn.href = backPage;
            
            console.log(`🔙 Back button updated to: ${backPage}`);
        }
    }

    /**
     * Load projects dynamically based on category
     */
    async function loadProjectsFromJSON() {
        try {
            // Get category from URL to determine which JSON to load
            const urlParams = new URLSearchParams(window.location.search);
            const category = urlParams.get('category');
            
            let dataSource = '../../Projects Code/projects.json';
            
            // Load from appropriate data source based on category
            if (category === 'arduino') {
                dataSource = '../../Projects Code/Arduino/arduino-data.json';
            } else if (category === 'matlab') {
                dataSource = '../../Projects Code/MATLAB/matlab-data.json';
            }
            
            console.log(`🔍 Loading from: ${dataSource} (category: ${category})`);
            
            const response = await fetch(dataSource);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            allProjects = data.projects || [];
            
            console.log(`✅ Loaded ${allProjects.length} projects for viewer`);
            
        } catch (error) {
            console.error('❌ Error loading projects:', error);
            showErrorState();
        }
    }

    function setupEventListeners() {
        if (shareBtn) shareBtn.addEventListener('click', handleShare);
        if (saveBtn) saveBtn.addEventListener('click', handleSave);
    }

    function getProjectIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id');
    }

    async function loadProject() {
        if (!projectContainer) return;

        const projectId = getProjectIdFromUrl();
        
        if (!projectId) {
            showNotFoundState();
            return;
        }

        // Show loading
        projectContainer.innerHTML = `
            <div style="text-align: center; padding: 80px 20px;">
                <div style="display: inline-block; width: 50px; height: 50px; border: 4px solid rgba(204, 0, 0, 0.2); border-top-color: var(--primary-red); border-radius: 50%; animation: spin 1s linear infinite;"></div>
                <p style="margin-top: 20px; color: var(--text-secondary);">Loading project...</p>
            </div>
        `;

        // Arduino projects use numeric IDs, need to convert
        const urlParams = new URLSearchParams(window.location.search);
        const category = urlParams.get('category');
        
        if (category === 'arduino') {
            // Arduino IDs are numbers, compare as numbers
            currentProject = allProjects.find(p => p.id == projectId);
        } else {
            // Other projects use string IDs
            currentProject = allProjects.find(p => p.id === projectId);
        }

        if (!currentProject) {
            console.error(`❌ Project not found: ${projectId} in category: ${category}`);
            showNotFoundState();
            return;
        }

        console.log(`✅ Found project: ${currentProject.title}`);

        // Setup sequential navigation for Arduino and Solidworks projects
        if (category === 'arduino') {
            sequentialProjects = allProjects.sort((a, b) => a.id - b.id);
            currentProjectIndex = sequentialProjects.findIndex(p => p.id == projectId);
            console.log(`📍 Arduino project ${currentProjectIndex + 1}/${sequentialProjects.length}`);
        } else if (category === 'solidworks') {
            sequentialProjects = allProjects
                .filter(p => p.category === 'solidworks')
                .sort((a, b) => {
                    // Sort by ID: solidworks-model-01, solidworks-model-02, etc.
                    const numA = parseInt(a.id.replace('solidworks-model-', ''));
                    const numB = parseInt(b.id.replace('solidworks-model-', ''));
                    return numA - numB;
                });
            currentProjectIndex = sequentialProjects.findIndex(p => p.id === projectId);
            console.log(`📍 Solidworks model ${currentProjectIndex + 1}/${sequentialProjects.length}`);
        }

        renderProjectDetails();
        checkSavedState();
    }

    function showNotFoundState() {
        const urlParams = new URLSearchParams(window.location.search);
        const category = urlParams.get('category');
        
        const categoryPages = {
            'arduino': 'arduino-projects.html',
            'solidworks': 'solidworks-projects.html',
            'matlab': 'matlab-projects.html',
            'electronics': 'electronics-projects.html'
        };
        
        const backPage = categoryPages[category] || 'projects.html';
        
        projectContainer.innerHTML = `
            <div style="padding:60px 20px;text-align:center;">
                <i class="fas fa-exclamation-circle" style="font-size:56px;color:var(--primary-red);margin-bottom:20px;"></i>
                <h3 style="color:var(--text-primary);margin-bottom:12px;">Project Not Found</h3>
                <p style="color:var(--text-secondary);margin-bottom:24px;">The requested project could not be found.</p>
                <a href="${backPage}" style="display:inline-block;padding:12px 28px;background:var(--primary-red);color:#fff;border-radius:8px;text-decoration:none;font-weight:600;">
                    <i class="fas fa-arrow-left"></i> Back to Projects
                </a>
            </div>
        `;
    }

    function showErrorState() {
        if (projectContainer) {
            projectContainer.innerHTML = `
                <div style="padding:60px 20px;text-align:center;">
                    <i class="fas fa-exclamation-triangle" style="font-size:56px;color:var(--primary-red);margin-bottom:20px;"></i>
                    <h3 style="color:var(--text-primary);margin-bottom:12px;">Failed to Load Project</h3>
                    <p style="color:var(--text-secondary);margin-bottom:24px;">Unable to load project data. Please check your connection.</p>
                    <button onclick="location.reload()" style="padding:12px 28px;background:var(--primary-red);color:#fff;border:none;border-radius:8px;font-weight:600;cursor:pointer;">
                        <i class="fas fa-redo"></i> Retry
                    </button>
                </div>
            `;
        }
    }

    function renderProjectDetails() {
        // Get category from URL parameter (not from project data)
        const urlParams = new URLSearchParams(window.location.search);
        const urlCategory = urlParams.get('category') || currentProject.category;
        
        const hasGLB = currentProject.glbFile && urlCategory === 'solidworks';
        const hasCode = currentProject.code || currentProject.codePath || currentProject.codeFile;
        const hasREADME = currentProject.readmePath || currentProject.files?.readme;
        const hasExplanation = currentProject.explanationPath || currentProject.files?.explanation;
        const hasTinkercad = currentProject.tinkercad || currentProject.tinkercadLink;
        const hasSteps = currentProject.steps && currentProject.steps.length > 0;
        const hasComponents = currentProject.components && currentProject.components.length > 0;
        const hasImages = currentProject.images && currentProject.images.length > 0;
        const hasTopics = currentProject.topics && currentProject.topics.length > 0;
        const isArduino = urlCategory === 'arduino';
        const isMATLAB = urlCategory === 'matlab';
        const isElectronics = urlCategory === 'electronics';
        const hasToolLink = currentProject.toolLink;
        const hasFeatures = currentProject.features && currentProject.features.length > 0;
        
        // Display category as the URL category (arduino, solidworks, etc.) not subcategory
        const displayCategory = urlCategory || currentProject.category;

        projectContainer.innerHTML = `
            <div class="project-hero">
                <span class="project-category"><i class="fas fa-folder"></i> ${displayCategory.toUpperCase()}</span>
                <h1 class="project-title">${currentProject.title}</h1>
                ${currentProject.description || currentProject.subtitle ? `
                <p class="project-description" style="color: var(--text-secondary); font-size: 1rem; line-height: 1.6; margin: 16px 0; max-width: 700px;">
                    ${currentProject.description || currentProject.subtitle}
                </p>
                ` : ''}
                <div class="project-meta">
                    <span><i class="fas fa-signal"></i> ${currentProject.difficulty || 'Intermediate'}</span>
                    ${currentProject.duration ? `<span><i class="fas fa-clock"></i> ${currentProject.duration}</span>` : ''}
                    ${currentProject.codeLines ? `<span><i class="fas fa-code"></i> ${currentProject.codeLines}+ lines</span>` : ''}
                </div>
                ${currentProject.tags && currentProject.tags.length > 0 ? `
                <div class="project-tags">
                    ${currentProject.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
                </div>
                ` : ''}
            </div>

            ${hasGLB ? `
            <section>
                <h2 class="section-title"><i class="fas fa-cube"></i> 3D Model Viewer</h2>
                <div class="glb-viewer-container" id="glbViewerContainer">
                    <div class="glb-loading">
                        <div class="spinner"></div>
                        <p>Loading 3D Model...</p>
                    </div>
                    <model-viewer 
                        id="modelViewer"
                        src="${currentProject.glbFile}"
                        alt="${currentProject.title} 3D Model"
                        camera-controls 
                        touch-action="pan-y"
                        auto-rotate
                        auto-rotate-delay="1000"
                        rotation-per-second="30deg"
                        shadow-intensity="1.2"
                        environment-image="neutral"
                        exposure="1.2"
                        camera-orbit="45deg 75deg 1.2m"
                        min-camera-orbit="auto auto 0.5m"
                        max-camera-orbit="auto auto 5m"
                    >
                        <div class="glb-controls" slot="progress-bar">
                            <div class="loading-progress"></div>
                        </div>
                    </model-viewer>
                    
                    <!-- Premium Control Panel -->
                    <div class="glb-controls-panel">
                        <button class="glb-control-btn active" id="autoRotateBtn" onclick="window.projectViewer.toggleAutoRotate()">
                            <i class="fas fa-sync-alt"></i>
                            <span>Auto Rotate</span>
                        </button>
                        <button class="glb-control-btn" id="fullscreenBtn" onclick="window.projectViewer.toggleFullscreen()">
                            <i class="fas fa-expand"></i>
                            <span>Fullscreen</span>
                        </button>
                        <button class="glb-control-btn" onclick="window.projectViewer.resetCamera()">
                            <i class="fas fa-redo"></i>
                            <span>Reset View</span>
                        </button>
                        <button class="glb-control-btn" onclick="window.projectViewer.takeScreenshot()">
                            <i class="fas fa-camera"></i>
                            <span>Screenshot</span>
                        </button>
                    </div>
                    
                    <!-- Model Stats -->
                    <div class="glb-stats-grid">
                        <div class="glb-stat-card">
                            <div class="glb-stat-icon"><i class="fas fa-cube"></i></div>
                            <div class="glb-stat-label">Format</div>
                            <div class="glb-stat-value">GLB 3D</div>
                        </div>
                        <div class="glb-stat-card">
                            <div class="glb-stat-icon"><i class="fas fa-layer-group"></i></div>
                            <div class="glb-stat-label">Complexity</div>
                            <div class="glb-stat-value">${currentProject.difficulty || 'Standard'}</div>
                        </div>
                        <div class="glb-stat-card">
                            <div class="glb-stat-icon"><i class="fas fa-palette"></i></div>
                            <div class="glb-stat-label">Materials</div>
                            <div class="glb-stat-value">Realistic</div>
                        </div>
                        <div class="glb-stat-card">
                            <div class="glb-stat-icon"><i class="fas fa-arrows-alt"></i></div>
                            <div class="glb-stat-label">Interactive</div>
                            <div class="glb-stat-value">360°</div>
                        </div>
                    </div>
                    
                    <!-- Download Section -->
                    ${currentProject.zipDownload || currentProject.glbFile ? `
                    <div class="glb-download-section">
                        <h4 style="color: #FFFFFF; font-size: 14px; font-weight: 700; margin: 0 0 4px 0; display: flex; align-items: center; gap: 8px;">
                            <i class="fas fa-download" style="color: #CD5C5C;"></i>
                            Download Model Files
                        </h4>
                        <p style="font-size: 11px; color: rgba(180,180,180,0.8); margin: 0 0 12px 0;">Get 3D models and source files</p>
                        <div class="glb-download-grid">
                            ${currentProject.glbFile ? `
                            <a href="${currentProject.glbFile}" download class="download-model-btn primary">
                                <i class="fas fa-cube"></i>
                                <span>GLB Model</span>
                            </a>
                            ` : ''}
                            ${currentProject.zipDownload ? `
                            <a href="${currentProject.zipDownload}" download class="download-model-btn">
                                <i class="fas fa-file-archive"></i>
                                <span>Full Package</span>
                            </a>
                            ` : ''}
                            ${currentProject.files && currentProject.files.includes('.SLDPRT') ? `
                            <a href="${currentProject.files[0]}" download class="download-model-btn">
                                <i class="fas fa-drafting-compass"></i>
                                <span>SLDPRT File</span>
                            </a>
                            ` : ''}
                        </div>
                    </div>
                    ` : ''}
                    
                    <!-- Touch Instructions -->
                    <div class="glb-instructions">
                        <div class="glb-instruction-item">
                            <i class="fas fa-hand-pointer"></i>
                            <span>Drag to Rotate</span>
                        </div>
                        <div class="glb-instruction-item">
                            <i class="fas fa-expand-arrows-alt"></i>
                            <span>Pinch to Zoom</span>
                        </div>
                        <div class="glb-instruction-item">
                            <i class="fas fa-arrows-alt"></i>
                            <span>Two Fingers to Pan</span>
                        </div>
                    </div>
                </div>
            </section>
            ` : (currentProject.thumbnail || currentProject.image || currentProject.circuitDiagram) ? `
            <div class="project-image">
                <img src="${currentProject.thumbnail || currentProject.image || currentProject.circuitDiagram}" alt="${currentProject.title}" style="width:100%;border-radius:12px;border:2px solid var(--border-primary);">
            </div>
            ` : ''}

            <section>
                <h2 class="section-title"><i class="fas fa-info-circle"></i> Overview</h2>
                <p class="project-description">${currentProject.fullDescription || currentProject.description}</p>
                ${currentProject.features ? `
                <div style="margin-top: 20px;">
                    <h4 style="color: var(--text-primary); margin-bottom: 12px;"><i class="fas fa-check-circle"></i> Key Features:</h4>
                    <ul style="list-style: none; padding: 0;">
                        ${currentProject.features.map(feature => `
                            <li style="padding: 8px 0; color: var(--text-secondary); border-bottom: 1px solid var(--border-primary);">
                                <i class="fas fa-caret-right" style="color: var(--primary-red); margin-right: 8px;"></i>
                                ${feature}
                            </li>
                        `).join('')}
                    </ul>
                </div>
                ` : ''}
            </section>

            ${hasComponents ? `
            <section>
                <h2 class="section-title"><i class="fas fa-cubes"></i> Components Required</h2>
                <div class="components-list">
                    ${currentProject.components.map((comp, idx) => {
                        // Handle both string and object formats
                        const compName = typeof comp === 'string' ? comp : comp.name;
                        const compQuantity = typeof comp === 'string' ? '' : (comp.quantity || '');
                        const compIcon = typeof comp === 'string' ? 'microchip' : (comp.icon || 'microchip');
                        
                        return `
                        <div class="component-item" style="display: flex; align-items: center; gap: 12px; padding: 12px; background: rgba(0,0,0,0.3); border-radius: 8px; border: 1px solid var(--border-primary); margin-bottom: 10px;">
                            <div class="component-icon" style="width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; background: var(--primary-red); border-radius: 50%; color: #fff; font-size: 18px;">
                                <i class="fas fa-${compIcon}"></i>
                            </div>
                            <div class="component-info" style="flex: 1;">
                                <h4 style="color: var(--text-primary); margin: 0 0 4px 0; font-size: 0.95rem;">${compName}</h4>
                                ${compQuantity ? `<p style="color: var(--text-secondary); margin: 0; font-size: 0.85rem;">Quantity: ${compQuantity}</p>` : ''}
                            </div>
                        </div>
                        `;
                    }).join('')}
                </div>
            </section>
            ` : ''}

            ${hasFeatures && isElectronics ? `
            <section>
                <h2 class="section-title"><i class="fas fa-star"></i> Tool Features</h2>
                <div class="features-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 12px;">
                    ${currentProject.features.map(feature => `
                        <div class="feature-badge" style="padding: 14px; background: rgba(0,151,157,0.1); border: 2px solid rgba(0,151,157,0.3); border-radius: 10px; text-align: center;">
                            <i class="fas fa-check-circle" style="color: #00979d; font-size: 20px; margin-bottom: 8px;"></i>
                            <p style="margin: 0; color: var(--text-primary); font-size: 0.9rem; font-weight: 600;">${feature}</p>
                        </div>
                    `).join('')}
                </div>
            </section>
            ` : ''}

            ${hasToolLink && isElectronics ? `
            <section style="margin-top: 32px;">
                <a href="${currentProject.toolLink}" target="_blank" class="open-tool-btn" style="display: flex; align-items: center; justify-content: center; gap: 12px; padding: 18px 32px; background: linear-gradient(135deg, #8B0000, #5a0000); color: #fff; text-decoration: none; border-radius: 12px; font-size: 1.1rem; font-weight: 700; box-shadow: 0 8px 24px rgba(139,0,0,0.4); transition: all 0.3s ease;">
                    <i class="fas fa-external-link-alt"></i>
                    <span>Open ${currentProject.title}</span>
                    <i class="fas fa-arrow-right"></i>
                </a>
            </section>
            ` : ''}

            ${hasCode ? `
            <section>
                <h2 class="section-title"><i class="fas fa-code"></i> ${isMATLAB ? 'MATLAB Code' : isArduino ? 'Arduino Sketch' : 'Sample Code'}</h2>
                <div class="code-section" style="background: rgba(0,0,0,0.4); border-radius: 12px; border: 2px solid var(--border-primary); overflow: hidden;">
                    <div class="code-header" style="display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; background: rgba(0,0,0,0.5); border-bottom: 1px solid var(--border-primary); flex-wrap: wrap; gap: 8px;">
                        <h4 style="margin: 0; color: var(--text-primary); font-size: 0.95rem; flex: 1; min-width: 120px;">
                            <i class="fas fa-file-code"></i> ${isMATLAB && currentProject.files ? currentProject.files.code : (isArduino && currentProject.files ? currentProject.files.code : (currentProject.codePath ? currentProject.codePath.split('/').pop() : 'Code'))}
                        </h4>
                        <div style="display: flex; gap: 8px;">
                            <button class="copy-btn" onclick="window.projectViewer.copyCode()" style="padding: 6px 12px; background: var(--primary-red); color: #fff; border: none; border-radius: 6px; cursor: pointer; font-size: 0.85rem; display: flex; align-items: center; gap: 6px;">
                                <i class="fas fa-copy"></i> Copy
                            </button>
                            ${(isArduino && currentProject.files && currentProject.folder) || (isMATLAB && currentProject.files && currentProject.files.code) ? `
                            <button class="copy-btn" onclick="window.projectViewer.downloadCode()" style="padding: 6px 12px; background: linear-gradient(135deg, rgba(204,0,0,0.5), rgba(0,0,0,0.8)); color: #FFFFFF; border: 1px solid rgba(204,0,0,0.6); border-radius: 6px; cursor: pointer; font-size: 0.85rem; display: flex; align-items: center; gap: 6px;">
                                <i class="fas fa-download"></i> Download
                            </button>
                            ` : ''}
                        </div>
                    </div>
                    <div id="codeContent" style="padding: 16px; max-height: 400px; overflow-y: auto;">
                        <div style="text-align: center; padding: 20px;">
                            <div style="display: inline-block; width: 30px; height: 30px; border: 3px solid rgba(204, 0, 0, 0.3); border-top-color: var(--primary-red); border-radius: 50%; animation: spin 1s linear infinite;"></div>
                            <p style="margin-top: 12px; color: var(--text-secondary);">Loading code...</p>
                        </div>
                    </div>
                </div>
            </section>
            ` : ''}

            ${hasTinkercad ? `
            <section>
                <h2 class="section-title"><i class="fas fa-cube"></i> Tinkercad Simulation</h2>
                <div style="background: rgba(0,151,157,0.1); border-radius: 12px; border: 2px solid rgba(0,151,157,0.3); overflow: hidden;">
                    ${isArduino && currentProject.files?.circuit && currentProject.folder ? `
                    <div style="width: 100%; height: 200px; background: #0a0a0a; display: flex; align-items: center; justify-content: center; overflow: hidden;">
                        <img src="../../Projects Storage/Arduino UNO Projects with Tinkercad/${currentProject.folder}/${currentProject.files.circuit}" 
                             alt="Circuit Diagram" 
                             style="width: 100%; height: 100%; object-fit: contain; opacity: 0.85;"
                             onerror="this.parentElement.innerHTML='<i class=\'fas fa-microchip\' style=\'font-size:48px;color:#00979d;opacity:0.3;\'></i>'">
                    </div>
                    ` : ''}
                    <div style="padding: 16px;">
                        <p style="color: var(--text-secondary); margin-bottom: 12px;">
                            <i class="fas fa-external-link-alt"></i> Simulate this circuit online with Tinkercad
                        </p>
                        <a href="${currentProject.tinkercad || currentProject.tinkercadLink}" target="_blank" rel="noopener" style="display: inline-block; padding: 12px 24px; background: #00979d; color: #fff; text-decoration: none; border-radius: 8px; font-weight: 600; box-shadow: 0 2px 8px rgba(0,151,157,0.3);">
                            <i class="fas fa-play"></i> Open in Tinkercad
                        </a>
                    </div>
                </div>
            </section>
            ` : ''}

            ${hasREADME ? `
            <section>
                <h2 class="section-title"><i class="fas fa-book-open"></i> README & Documentation</h2>
                <div class="readme-section" style="background: rgba(0,0,0,0.3); border-radius: 12px; border: 2px solid var(--border-primary); padding: 16px;">
                    <div id="readmeContent" style="max-height: 300px; overflow: hidden; position: relative;">
                        <div style="text-align: center; padding: 20px;">
                            <div style="display: inline-block; width: 30px; height: 30px; border: 3px solid rgba(204, 0, 0, 0.3); border-top-color: var(--primary-red); border-radius: 50%; animation: spin 1s linear infinite;"></div>
                            <p style="margin-top: 12px; color: var(--text-secondary);">Loading README...</p>
                        </div>
                    </div>
                    <div style="display: flex; gap: 10px; justify-content: center; margin-top: 16px; flex-wrap: wrap;">
                        <button class="action-btn" onclick="window.projectViewer.openReadmeFullscreen()" style="padding: 12px 24px; background: linear-gradient(135deg, rgba(205,92,92,0.5), rgba(0,0,0,0.8)); border: 1px solid rgba(205,92,92,0.6); border-radius: 10px; color: #FFFFFF; font-size: 14px; font-weight: 700; display: inline-flex; align-items: center; gap: 8px; cursor: pointer;">
                            <i class="fas fa-expand"></i> Open Fullscreen
                        </button>
                        ${isArduino && currentProject.files && currentProject.folder ? `
                        <button class="action-btn" onclick="window.projectViewer.downloadReadme()" style="padding: 12px 24px; background: rgba(0,0,0,0.5); border: 1px solid rgba(205,92,92,0.4); border-radius: 10px; color: #FFFFFF; font-size: 14px; font-weight: 700; display: inline-flex; align-items: center; gap: 8px; cursor: pointer;">
                            <i class="fas fa-download"></i> Download README
                        </button>
                        ` : ''}
                    </div>
                </div>
            </section>
            ` : ''}

            ${hasExplanation ? `
            <section>
                <h2 class="section-title"><i class="fas fa-graduation-cap"></i> Code Explanation (For Beginners)</h2>
                <div class="explanation-section" style="background: rgba(0,0,0,0.3); border-radius: 12px; border: 2px solid var(--border-primary); padding: 16px;">
                    <div id="explanationContent" style="max-height: 300px; overflow: hidden; position: relative;">
                        <div style="text-align: center; padding: 20px;">
                            <div style="display: inline-block; width: 30px; height: 30px; border: 3px solid rgba(204, 0, 0, 0.3); border-top-color: var(--primary-red); border-radius: 50%; animation: spin 1s linear infinite;"></div>
                            <p style="margin-top: 12px; color: var(--text-secondary);">Loading explanation...</p>
                        </div>
                    </div>
                    <div style="display: flex; gap: 10px; justify-content: center; margin-top: 16px; flex-wrap: wrap;">
                        <button class="action-btn" onclick="window.projectViewer.openExplanationFullscreen()" style="padding: 12px 24px; background: linear-gradient(135deg, rgba(205,92,92,0.5), rgba(0,0,0,0.8)); border: 1px solid rgba(205,92,92,0.6); border-radius: 10px; color: #FFFFFF; font-size: 14px; font-weight: 700; display: inline-flex; align-items: center; gap: 8px; cursor: pointer;">
                            <i class="fas fa-expand"></i> Open Fullscreen
                        </button>
                        ${isArduino && currentProject.files && currentProject.folder ? `
                        <button class="action-btn" onclick="window.projectViewer.downloadExplanation()" style="padding: 12px 24px; background: rgba(0,0,0,0.5); border: 1px solid rgba(205,92,92,0.4); border-radius: 10px; color: #FFFFFF; font-size: 14px; font-weight: 700; display: inline-flex; align-items: center; gap: 8px; cursor: pointer;">
                            <i class="fas fa-download"></i> Download Explanation
                        </button>
                        ` : ''}
                    </div>
                </div>
            </section>
            ` : ''}

            ${hasTopics && isMATLAB ? `
            <section>
                <h2 class="section-title"><i class="fas fa-clipboard-list"></i> Analysis Topics</h2>
                <div class="topics-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 10px;">
                    ${currentProject.topics.map(topic => `
                        <div class="topic-badge" style="padding: 10px 14px; background: rgba(204,0,0,0.1); border: 1px solid rgba(204,0,0,0.3); border-radius: 8px; text-align: center; color: var(--text-primary); font-size: 0.85rem; font-weight: 500;">
                            ${topic}
                        </div>
                    `).join('')}
                </div>
            </section>
            ` : ''}

            ${hasImages && isMATLAB ? `
            <section>
                <h2 class="section-title"><i class="fas fa-chart-line"></i> Results & Visualizations</h2>
                <div class="images-gallery" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px;">
                    ${currentProject.images.map((imgPath, idx) => `
                        <div class="result-image" style="background: rgba(0,0,0,0.3); border-radius: 12px; border: 2px solid var(--border-primary); overflow: hidden;">
                            <img src="${imgPath}" alt="Result ${idx + 1}" style="width: 100%; height: auto; display: block;" onerror="this.parentElement.innerHTML='<div style=\\'padding:40px;text-align:center;color:var(--text-secondary)\\'><i class=\\'fas fa-image\\' style=\\'font-size:32px;margin-bottom:12px;\\'></i><p>Image will be available soon</p></div>'">
                            <div style="padding: 12px; background: rgba(0,0,0,0.5);">
                                <p style="margin: 0; color: var(--text-secondary); font-size: 0.85rem; text-align: center;">
                                    Result ${idx + 1}
                                </p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </section>
            ` : ''}

            ${isMATLAB && currentProject.matlabVersion ? `
            <section>
                <div style="padding: 16px; background: rgba(0,151,157,0.1); border-radius: 12px; border: 2px solid rgba(0,151,157,0.3); display: flex; align-items: center; gap: 12px;">
                    <i class="fas fa-info-circle" style="font-size: 24px; color: #00979d;"></i>
                    <div style="flex: 1;">
                        <h4 style="color: var(--text-primary); margin: 0 0 4px 0; font-size: 0.95rem;">MATLAB Version Required</h4>
                        <p style="margin: 0; color: var(--text-secondary); font-size: 0.85rem;">${currentProject.matlabVersion}</p>
                    </div>
                </div>
            </section>
            ` : ''}

            ${hasSteps ? `
            <section>
                <h2 class="section-title"><i class="fas fa-list-ol"></i> Build Steps</h2>
                <div class="steps-list">
                    ${currentProject.steps.map((step, index) => `
                        <div class="step-item" style="display: flex; gap: 16px; margin-bottom: 16px; padding: 16px; background: rgba(0,0,0,0.3); border-radius: 12px; border: 1px solid var(--border-primary);">
                            <div class="step-number" style="width: 32px; height: 32px; background: linear-gradient(135deg, var(--primary-red), #8B0000); color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; flex-shrink: 0;">${index + 1}</div>
                            <div class="step-content" style="flex: 1;">
                                <h4 style="color: var(--text-primary); margin: 0 0 8px 0;">${step.title || step}</h4>
                                ${step.desc ? `<p style="color: var(--text-secondary); margin: 0; line-height: 1.6;">${step.desc}</p>` : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </section>
            ` : ''}

            <div class="action-buttons" style="display: flex; flex-direction: column; gap: 12px; margin-top: 32px;">
                ${hasTinkercad ? `
                <button class="action-btn" onclick="window.open('${currentProject.tinkercadLink}', '_blank')" style="padding: 14px 24px; background: #00979d; color: #fff; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 0.95rem;">
                    <i class="fas fa-play"></i> Simulate in Tinkercad
                </button>
                ` : ''}

                ${isMATLAB && currentProject.files && currentProject.files.zip ? `
                <button class="action-btn" onclick="window.projectViewer.downloadMATLABZip()" style="padding: 14px 24px; background: linear-gradient(135deg, #CC0000, #8B0000); color: #fff; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 0.95rem; box-shadow: 0 4px 12px rgba(204,0,0,0.3);">
                    <i class="fas fa-download"></i> Download MATLAB Files (.zip)
                </button>
                ` : ''}

                ${currentProject.zipDownload && !hasGLB && !isMATLAB ? `
                <button class="action-btn secondary" onclick="window.open('${currentProject.zipDownload}', '_blank')" style="padding: 14px 24px; background: rgba(204, 0, 0, 0.1); color: var(--primary-red); border: 2px solid var(--primary-red); border-radius: 8px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 0.95rem;">
                    <i class="fas fa-download"></i> Download Files
                </button>
                ` : ''}
            </div>
            
            ${(currentProject.category === 'arduino' || currentProject.category === 'solidworks') && sequentialProjects.length > 1 ? `
            <section style="margin-top: 32px; padding-top: 24px; border-top: 2px solid rgba(139,0,0,0.3);">
                <div style="display: flex; justify-content: space-between; align-items: center; gap: 12px;">
                    ${currentProjectIndex > 0 ? `
                    <button onclick="window.projectViewer.navigateToPrevProject()" style="flex: 1; padding: 14px 20px; background: rgba(204, 0, 0, 0.1); color: var(--text-primary); border: 2px solid var(--primary-red); border-radius: 10px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; font-size: 0.95rem; transition: all 0.3s ease;">
                        <i class="fas fa-chevron-left"></i>
                        <div style="text-align: left;">
                            <div style="font-size: 0.75rem; color: var(--text-secondary); margin-bottom: 2px;">Previous ${currentProject.category === 'solidworks' ? 'Model' : 'Project'}</div>
                            <div style="font-size: 0.9rem; font-weight: 700;">${sequentialProjects[currentProjectIndex - 1].title}</div>
                        </div>
                    </button>
                    ` : '<div style="flex: 1;"></div>'}
                    
                    <div style="text-align: center; padding: 0 12px;">
                        <div style="font-size: 0.75rem; color: var(--text-secondary); margin-bottom: 4px;">${currentProject.category === 'solidworks' ? 'Model' : 'Project'}</div>
                        <div style="font-size: 1.5rem; font-weight: 700; color: var(--primary-red);">${currentProjectIndex + 1}<span style="font-size: 1rem; color: var(--text-secondary);">/${sequentialProjects.length}</span></div>
                    </div>
                    
                    ${currentProjectIndex < sequentialProjects.length - 1 ? `
                    <button onclick="window.projectViewer.navigateToNextProject()" style="flex: 1; padding: 14px 20px; background: linear-gradient(135deg, var(--primary-red), #8B0000); color: #fff; border: none; border-radius: 10px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; font-size: 0.95rem; transition: all 0.3s ease; box-shadow: 0 4px 12px rgba(139,0,0,0.3);">
                        <div style="text-align: right;">
                            <div style="font-size: 0.75rem; opacity: 0.9; margin-bottom: 2px;">Next ${currentProject.category === 'solidworks' ? 'Model' : 'Project'}</div>
                            <div style="font-size: 0.9rem; font-weight: 700;">${sequentialProjects[currentProjectIndex + 1].title}</div>
                        </div>
                        <i class="fas fa-chevron-right"></i>
                    </button>
                    ` : '<div style="flex: 1;"></div>'}
                </div>
            </section>
            ` : ''}
        `;

        // Load 3D viewer library if needed
        if (hasGLB && !window.customElements.get('model-viewer')) {
            loadModelViewerLibrary();
        }
        
        // Setup model-viewer load event to hide loading state
        if (hasGLB) {
            setTimeout(() => {
                const modelViewer = document.getElementById('modelViewer');
                const loadingEl = document.querySelector('.glb-loading');
                
                if (modelViewer && loadingEl) {
                    modelViewer.addEventListener('load', () => {
                        loadingEl.style.display = 'none';
                        console.log('✅ 3D Model loaded successfully');
                    });
                    
                    modelViewer.addEventListener('error', (error) => {
                        console.error('❌ Model loading error:', error);
                        loadingEl.innerHTML = `
                            <i class="fas fa-exclamation-triangle" style="font-size:32px;color:#CC0000;margin-bottom:12px;"></i>
                            <p style="color:rgba(200,200,200,0.8);">Failed to load 3D model</p>
                        `;
                    });
                }
            }, 500);
        }

        // Load Arduino/MATLAB code - construct paths properly for projects
        if (hasCode) {
            let codePath = currentProject.codePath;
            
            // For Arduino projects, construct full path from JSON data
            if (isArduino && !codePath && currentProject.files && currentProject.folder) {
                const codeFile = currentProject.files.code || currentProject.codeFile;
                codePath = `../../Projects Storage/Arduino UNO Projects with Tinkercad/${currentProject.folder}/${codeFile}`;
            }
            
            // For MATLAB projects, construct full path from JSON data
            if (isMATLAB && !codePath && currentProject.files && currentProject.files.code) {
                // Use project ID as folder name (e.g., matlab-demo-01)
                const folderName = currentProject.id || 'default';
                codePath = `../../Projects Storage/MATLAB Projects/${folderName}/${currentProject.files.code}`;
            }
            
            if (codePath) {
                loadArduinoCode(codePath);
            }
        }
        
        if (hasREADME) {
            let readmePath = currentProject.readmePath;
            
            // For Arduino projects, construct full path
            if (isArduino && !readmePath && currentProject.files && currentProject.folder) {
                readmePath = `../../Projects Storage/Arduino UNO Projects with Tinkercad/${currentProject.folder}/${currentProject.files.readme}`;
            }
            
            if (readmePath) {
                loadREADME(readmePath);
            }
        }
        
        if (hasExplanation) {
            let explanationPath = currentProject.explanationPath;
            
            // For Arduino projects, construct full path
            if (isArduino && !explanationPath && currentProject.files && currentProject.folder) {
                explanationPath = `../../Projects Storage/Arduino UNO Projects with Tinkercad/${currentProject.folder}/${currentProject.files.explanation}`;
            }
            
            if (explanationPath) {
                loadExplanation(explanationPath);
            }
        }
    }

    function loadModelViewerLibrary() {
        const script = document.createElement('script');
        script.type = 'module';
        script.src = 'https://ajax.googleapis.com/ajax/libs/model-viewer/3.3.0/model-viewer.min.js';
        document.head.appendChild(script);
        
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://ajax.googleapis.com/ajax/libs/model-viewer/3.3.0/model-viewer.min.css';
        document.head.appendChild(link);
    }

    /**
     * Load Arduino code from file
     */
    async function loadArduinoCode(codePath) {
        const codeContent = document.getElementById('codeContent');
        if (!codeContent) return;

        try {
            const response = await fetch(codePath);
            if (!response.ok) throw new Error('Failed to load code');
            
            const codeText = await response.text();
            
            codeContent.innerHTML = `
                <pre style="margin: 0; white-space: pre-wrap; word-wrap: break-word;"><code id="projectCode" style="font-family: 'Courier New', monospace; font-size: 0.85rem; color: #e0e0e0; line-height: 1.6;">${escapeHtml(codeText)}</code></pre>
            `;
        } catch (error) {
            console.error('Error loading code:', error);
            codeContent.innerHTML = `
                <div style="text-align: center; padding: 20px;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 32px; color: var(--primary-red); margin-bottom: 12px;"></i>
                    <p style="color: var(--text-secondary);">Failed to load code file</p>
                    <a href="${codePath}" target="_blank" style="color: var(--primary-red); text-decoration: underline; font-size: 0.9rem;">Open file directly</a>
                </div>
            `;
        }
    }

    /**
     * Load README markdown file with advanced rendering
     */
    async function loadREADME(readmePath) {
        const readmeContent = document.getElementById('readmeContent');
        if (!readmeContent) return;

        try {
            const response = await fetch(readmePath);
            if (!response.ok) throw new Error('Failed to load README');
            
            const readmeText = await response.text();
            loadedReadmeMarkdown = readmeText; // Store for fullscreen
            
            // Advanced markdown rendering with tables, code, etc.
            const htmlContent = convertMarkdownToHTML(readmeText);
            
            readmeContent.innerHTML = `
                <div style="color: var(--text-secondary); line-height: 1.8; max-height: 300px; overflow: hidden;">
                    ${htmlContent}
                </div>
                <div style="position: absolute; bottom: 0; left: 0; right: 0; height: 60px; background: linear-gradient(transparent, rgba(0,0,0,0.9)); pointer-events: none;"></div>
            `;
        } catch (error) {
            console.error('Error loading README:', error);
            readmeContent.innerHTML = `
                <div style="text-align: center; padding: 20px;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 32px; color: var(--primary-red); margin-bottom: 12px;"></i>
                    <p style="color: var(--text-secondary);">Failed to load README file</p>
                    <a href="${readmePath}" target="_blank" style="color: var(--primary-red); text-decoration: underline; font-size: 0.9rem;">Open file directly</a>
                </div>
            `;
        }
    }

    /**
     * Load explanation markdown file with advanced rendering
     */
    async function loadExplanation(explanationPath) {
        const explanationContent = document.getElementById('explanationContent');
        if (!explanationContent) return;

        try {
            const response = await fetch(explanationPath);
            if (!response.ok) throw new Error('Failed to load explanation');
            
            const explanationText = await response.text();
            loadedExplanationMarkdown = explanationText; // Store for fullscreen
            
            // Advanced markdown rendering with tables, code, etc.
            const htmlContent = convertMarkdownToHTML(explanationText);
            
            explanationContent.innerHTML = `
                <div style="color: var(--text-secondary); line-height: 1.8; max-height: 300px; overflow: hidden;">
                    ${htmlContent}
                </div>
                <div style="position: absolute; bottom: 0; left: 0; right: 0; height: 60px; background: linear-gradient(transparent, rgba(0,0,0,0.9)); pointer-events: none;"></div>
            `;
        } catch (error) {
            console.error('Error loading explanation:', error);
            explanationContent.innerHTML = `
                <div style="text-align: center; padding: 20px;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 32px; color: var(--primary-red); margin-bottom: 12px;"></i>
                    <p style="color: var(--text-secondary);">Failed to load explanation file</p>
                    <a href="${explanationPath}" target="_blank" style="color: var(--primary-red); text-decoration: underline; font-size: 0.9rem;">Open file directly</a>
                </div>
            `;
        }
    }

    /**
     * Advanced markdown to HTML converter using renderMarkdown library
     */
    function convertMarkdownToHTML(markdown) {
        // Use advanced markdown viewer with all features
        return renderMarkdown(markdown, {
            generateTOC: false, // TOC shown in fullscreen only
            syntaxHighlight: true,
            showLineNumbers: false, // Compact view
            copyButton: true,
            sanitize: true,
            theme: 'dark-red'
        });
    }

    /**
     * Escape HTML to prevent XSS
     */
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function handleShare() {
        if (navigator.vibrate) navigator.vibrate(10);
        if (navigator.share) {
            navigator.share({
                title: currentProject.title,
                text: currentProject.description || currentProject.fullDescription,
                url: window.location.href
            }).catch(() => {});
        } else {
            // Fallback
            const tempInput = document.createElement('input');
            tempInput.value = window.location.href;
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand('copy');
            document.body.removeChild(tempInput);
            showToast('Link copied!');
        }
    }

    function handleSave() {
        if (!currentProject) return;
        
        isSaved = !isSaved;
        if (saveBtn) {
            saveBtn.style.color = isSaved ? '#ffc107' : 'var(--primary-red)';
        }
        if (navigator.vibrate) navigator.vibrate(isSaved ? 30 : 10);
        localStorage.setItem(`project_${currentProject.id}_saved`, isSaved);
        showToast(isSaved ? 'Project saved!' : 'Project removed');
    }

    function checkSavedState() {
        if (!currentProject || !saveBtn) return;
        
        isSaved = localStorage.getItem(`project_${currentProject.id}_saved`) === 'true';
        if (isSaved && saveBtn) {
            saveBtn.style.color = '#ffc107';
        }
    }

    function showToast(msg) {
        const toast = document.createElement('div');
        toast.textContent = msg;
        toast.style.cssText = 'position:fixed;bottom:90px;left:50%;transform:translateX(-50%);padding:12px 24px;background:rgba(204,0,0,0.95);color:#fff;border-radius:8px;font-size:13px;font-weight:600;z-index:10000;box-shadow:0 4px 12px rgba(0,0,0,0.3);';
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2500);
    }
    
    /**
     * Navigate to another project (for sequential navigation)
     */
    function navigateToProject(projectId) {
        console.log(`🔄 Navigating to ${projectId}`);
        
        // Close any open modals first
        if (window.closeMarkdownViewer) {
            closeMarkdownViewer();
        }
        
        // Update URL and reload
        const category = new URLSearchParams(window.location.search).get('category') || 'arduino';
        window.location.href = `project-viewer.html?category=${category}&id=${projectId}`;
    }

    // Export functions to window for inline onclick handlers
    window.projectViewer = {
        copyCode: function() {
            const code = document.getElementById('projectCode');
            if (!code) return;
            
            const textarea = document.createElement('textarea');
            textarea.value = code.textContent;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            
            try {
                document.execCommand('copy');
                showToast('Code copied!');
                if (navigator.vibrate) navigator.vibrate(30);
            } catch (err) {
                console.error('Copy failed:', err);
            }
            
            document.body.removeChild(textarea);
        },
        downloadCode: function() {
            if (!currentProject || !currentProject.files) {
                showToast('Download not available');
                return;
            }
            
            const urlParams = new URLSearchParams(window.location.search);
            const category = urlParams.get('category');
            let downloadPath, codeFile;
            
            if (category === 'arduino' && currentProject.folder) {
                codeFile = currentProject.files.code || currentProject.codeFile;
                downloadPath = `../../Projects Storage/Arduino UNO Projects with Tinkercad/${currentProject.folder}/${codeFile}`;
            } else if (category === 'matlab' && currentProject.files.code) {
                codeFile = currentProject.files.code;
                const folderName = currentProject.id || 'default';
                downloadPath = `../../Projects Storage/MATLAB Projects/${folderName}/${codeFile}`;
            } else {
                showToast('Download not available');
                return;
            }
            
            const link = document.createElement('a');
            link.href = downloadPath;
            link.download = codeFile;
            link.click();
            
            showToast('Downloading code file...');
            if (navigator.vibrate) navigator.vibrate(30);
        },
        downloadReadme: function() {
            if (!currentProject || !currentProject.files || !currentProject.folder) {
                showToast('Download not available');
                return;
            }
            
            const readmeFile = currentProject.files.readme;
            const downloadPath = `../../Projects Storage/Arduino UNO Projects with Tinkercad/${currentProject.folder}/${readmeFile}`;
            
            const link = document.createElement('a');
            link.href = downloadPath;
            link.download = readmeFile;
            link.click();
            
            showToast('Downloading README...');
            if (navigator.vibrate) navigator.vibrate(30);
        },
        downloadExplanation: function() {
            if (!currentProject || !currentProject.files || !currentProject.folder) {
                showToast('Download not available');
                return;
            }
            
            const explanationFile = currentProject.files.explanation;
            const downloadPath = `../../Projects Storage/Arduino UNO Projects with Tinkercad/${currentProject.folder}/${explanationFile}`;
            
            const link = document.createElement('a');
            link.href = downloadPath;
            link.download = explanationFile;
            link.click();
            
            showToast('Downloading explanation...');
            if (navigator.vibrate) navigator.vibrate(30);
        },
        downloadMATLABZip: function() {
            if (!currentProject || !currentProject.files || !currentProject.files.zip) {
                showToast('Download not available');
                return;
            }
            
            const zipFile = currentProject.files.zip;
            const folderName = currentProject.id || 'default';
            const downloadPath = `../../Projects Storage/MATLAB Projects/${folderName}/${zipFile}`;
            
            const link = document.createElement('a');
            link.href = downloadPath;
            link.download = zipFile;
            link.click();
            
            showToast('Downloading MATLAB files...');
            if (navigator.vibrate) navigator.vibrate(30);
        },
        openReadmeFullscreen: function() {
            if (!loadedReadmeMarkdown) {
                showToast('README not loaded yet');
                return;
            }
            
            // Add navigation for sequential projects (Arduino)
            const viewerOptions = {
                mdContent: loadedReadmeMarkdown,
                title: currentProject ? `${currentProject.title} - README` : 'README',
                showTOC: true,
                showToolbar: true,
                allowZoom: true,
                showDownload: false
            };
            
            // Add next/prev navigation for Arduino projects
            if (currentProject.category === 'arduino' && sequentialProjects.length > 1) {
                if (currentProjectIndex > 0) {
                    viewerOptions.prevCallback = () => navigateToProject(sequentialProjects[currentProjectIndex - 1].id);
                }
                if (currentProjectIndex < sequentialProjects.length - 1) {
                    viewerOptions.nextCallback = () => navigateToProject(sequentialProjects[currentProjectIndex + 1].id);
                }
                viewerOptions.navigationLabel = 'Project';
            }
            
            openMarkdownViewer(viewerOptions);
            if (navigator.vibrate) navigator.vibrate(10);
        },
        openExplanationFullscreen: function() {
            if (!loadedExplanationMarkdown) {
                showToast('Explanation not loaded yet');
                return;
            }
            
            // Add navigation for sequential projects (Arduino)
            const viewerOptions = {
                mdContent: loadedExplanationMarkdown,
                title: currentProject ? `${currentProject.title} - Code Explanation` : 'Code Explanation',
                showTOC: true,
                showToolbar: true,
                allowZoom: true,
                showDownload: false
            };
            
            // Add next/prev navigation for Arduino projects
            if (currentProject.category === 'arduino' && sequentialProjects.length > 1) {
                if (currentProjectIndex > 0) {
                    viewerOptions.prevCallback = () => navigateToProject(sequentialProjects[currentProjectIndex - 1].id);
                }
                if (currentProjectIndex < sequentialProjects.length - 1) {
                    viewerOptions.nextCallback = () => navigateToProject(sequentialProjects[currentProjectIndex + 1].id);
                }
                viewerOptions.navigationLabel = 'Project';
            }
            
            openMarkdownViewer(viewerOptions);
            if (navigator.vibrate) navigator.vibrate(10);
        },
        navigateToPrevProject: function() {
            if (currentProjectIndex > 0 && sequentialProjects.length > 0) {
                const prevProject = sequentialProjects[currentProjectIndex - 1];
                navigateToProject(prevProject.id);
            }
        },
        navigateToNextProject: function() {
            if (currentProjectIndex < sequentialProjects.length - 1) {
                const nextProject = sequentialProjects[currentProjectIndex + 1];
                navigateToProject(nextProject.id);
            }
        },
        
        // GLB Viewer Control Functions
        toggleAutoRotate: function() {
            const viewer = document.getElementById('modelViewer');
            const btn = document.getElementById('autoRotateBtn');
            if (!viewer || !btn) return;
            
            const isRotating = viewer.hasAttribute('auto-rotate');
            if (isRotating) {
                viewer.removeAttribute('auto-rotate');
                btn.classList.remove('active');
                showToast('Auto-rotate disabled');
            } else {
                viewer.setAttribute('auto-rotate', '');
                btn.classList.add('active');
                showToast('Auto-rotate enabled');
            }
            if (navigator.vibrate) navigator.vibrate(10);
        },
        
        toggleFullscreen: function() {
            const viewer = document.getElementById('modelViewer');
            if (!viewer) return;
            
            if (!document.fullscreenElement) {
                viewer.requestFullscreen().then(() => {
                    showToast('Fullscreen mode activated');
                    if (navigator.vibrate) navigator.vibrate(15);
                }).catch(err => {
                    console.error('Fullscreen error:', err);
                    showToast('Fullscreen not supported');
                });
            } else {
                document.exitFullscreen();
                showToast('Exited fullscreen');
                if (navigator.vibrate) navigator.vibrate(10);
            }
        },
        
        resetCamera: function() {
            const viewer = document.getElementById('modelViewer');
            if (!viewer) return;
            
            viewer.cameraOrbit = '45deg 75deg 2.5m';
            viewer.fieldOfView = '45deg';
            viewer.jumpCameraToGoal();
            showToast('Camera view reset');
            if (navigator.vibrate) navigator.vibrate(10);
        },
        
        takeScreenshot: function() {
            const viewer = document.getElementById('modelViewer');
            if (!viewer) {
                showToast('Model viewer not found');
                return;
            }
            
            try {
                viewer.toBlob({idealAspect: true}).then(blob => {
                    if (!blob) {
                        showToast('Screenshot failed');
                        return;
                    }
                    
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    const projectName = currentProject ? currentProject.title.replace(/\s+/g, '-') : 'model';
                    link.download = `${projectName}-screenshot.png`;
                    link.href = url;
                    link.click();
                    URL.revokeObjectURL(url);
                    
                    showToast('Screenshot saved!');
                    if (navigator.vibrate) navigator.vibrate(30);
                }).catch(err => {
                    console.error('Screenshot error:', err);
                    showToast('Screenshot failed');
                });
            } catch (error) {
                console.error('Screenshot error:', error);
                showToast('Screenshot not supported');
            }
        }
    };

})();
