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

    // Initialize on page load
    init();

    async function init() {
        await loadProjectsFromJSON();
        loadProject();
        setupEventListeners();
    }

    /**
     * Load projects dynamically from desktop JSON file
     */
    async function loadProjectsFromJSON() {
        try {
            const response = await fetch('../../Projects Code/projects.json');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            allProjects = data.projects;
            
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

        currentProject = allProjects.find(p => p.id === projectId);

        if (!currentProject) {
            showNotFoundState();
            return;
        }

        renderProjectDetails();
        checkSavedState();
    }

    function showNotFoundState() {
        projectContainer.innerHTML = `
            <div style="padding:60px 20px;text-align:center;">
                <i class="fas fa-exclamation-circle" style="font-size:56px;color:var(--primary-red);margin-bottom:20px;"></i>
                <h3 style="color:var(--text-primary);margin-bottom:12px;">Project Not Found</h3>
                <p style="color:var(--text-secondary);margin-bottom:24px;">The requested project could not be found.</p>
                <a href="projects.html" style="display:inline-block;padding:12px 28px;background:var(--primary-red);color:#fff;border-radius:8px;text-decoration:none;font-weight:600;">
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
        const hasGLB = currentProject.glbFile && currentProject.category === 'solidworks';
        const hasCode = currentProject.code || currentProject.codePath;
        const hasREADME = currentProject.readmePath;
        const hasExplanation = currentProject.explanationPath;
        const hasTinkercad = currentProject.tinkercadLink;
        const hasSteps = currentProject.steps && currentProject.steps.length > 0;
        const hasComponents = currentProject.components && currentProject.components.length > 0;
        const isArduino = currentProject.category === 'arduino';

        projectContainer.innerHTML = `
            <div class="project-hero">
                <span class="project-category"><i class="fas fa-folder"></i> ${currentProject.category.toUpperCase()}</span>
                <h1 class="project-title">${currentProject.title}</h1>
                <div class="project-meta">
                    <span><i class="fas fa-signal"></i> ${currentProject.difficulty}</span>
                    ${currentProject.duration ? `<span><i class="fas fa-clock"></i> ${currentProject.duration}</span>` : ''}
                    ${currentProject.codeLines ? `<span><i class="fas fa-code"></i> ${currentProject.codeLines}+ lines</span>` : ''}
                </div>
                <div class="project-tags">
                    ${currentProject.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
                </div>
            </div>

            ${hasGLB ? `
            <section>
                <h2 class="section-title"><i class="fas fa-cube"></i> 3D Model Viewer</h2>
                <div class="glb-viewer-container" id="glbViewerContainer">
                    <div class="glb-loading">
                        <div class="spinner"></div>
                        <p>Loading 3D model...</p>
                    </div>
                    <model-viewer 
                        id="modelViewer"
                        src="${currentProject.glbFile}"
                        alt="${currentProject.title} 3D Model"
                        camera-controls 
                        touch-action="pan-y"
                        auto-rotate
                        shadow-intensity="1"
                        environment-image="neutral"
                        exposure="1"
                        style="width: 100%; height: 400px; background: linear-gradient(135deg, #0a0a0a 0%, #1a0000 100%); border-radius: 12px; border: 2px solid var(--border-primary);"
                    >
                        <div class="glb-controls" slot="progress-bar">
                            <div class="loading-progress"></div>
                        </div>
                    </model-viewer>
                    <div class="glb-info">
                        <p><i class="fas fa-info-circle"></i> Drag to rotate • Pinch to zoom • Two fingers to pan</p>
                        ${currentProject.zipDownload ? `
                        <a href="${currentProject.zipDownload}" download class="download-model-btn">
                            <i class="fas fa-download"></i> Download Files
                        </a>
                        ` : ''}
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

            ${hasCode ? `
            <section>
                <h2 class="section-title"><i class="fas fa-code"></i> ${isArduino ? 'Arduino Sketch' : 'Sample Code'}</h2>
                <div class="code-section" style="background: rgba(0,0,0,0.4); border-radius: 12px; border: 2px solid var(--border-primary); overflow: hidden;">
                    <div class="code-header" style="display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; background: rgba(0,0,0,0.5); border-bottom: 1px solid var(--border-primary);">
                        <h4 style="margin: 0; color: var(--text-primary); font-size: 0.95rem;">
                            <i class="fas fa-file-code"></i> ${currentProject.codePath ? currentProject.codePath.split('/').pop() : 'Code'}
                        </h4>
                        <button class="copy-btn" onclick="window.projectViewer.copyCode()" style="padding: 6px 12px; background: var(--primary-red); color: #fff; border: none; border-radius: 6px; cursor: pointer; font-size: 0.85rem; display: flex; align-items: center; gap: 6px;">
                            <i class="fas fa-copy"></i> Copy
                        </button>
                    </div>
                    <div id="codeContent" style="padding: 16px; max-height: 400px; overflow-y: auto;">
                        ${currentProject.codePath ? `
                        <div style="text-align: center; padding: 20px;">
                            <div style="display: inline-block; width: 30px; height: 30px; border: 3px solid rgba(204, 0, 0, 0.3); border-top-color: var(--primary-red); border-radius: 50%; animation: spin 1s linear infinite;"></div>
                            <p style="margin-top: 12px; color: var(--text-secondary);">Loading code...</p>
                        </div>
                        ` : `
                        <pre style="margin: 0; white-space: pre-wrap; word-wrap: break-word;"><code id="projectCode" style="font-family: 'Courier New', monospace; font-size: 0.85rem; color: #e0e0e0; line-height: 1.6;">${currentProject.code || ''}</code></pre>
                        `}
                    </div>
                </div>
            </section>
            ` : ''}

            ${hasTinkercad ? `
            <section>
                <h2 class="section-title"><i class="fas fa-cube"></i> Tinkercad Simulation</h2>
                <div style="padding: 16px; background: rgba(0,151,157,0.1); border-radius: 12px; border: 2px solid rgba(0,151,157,0.3);">
                    <p style="color: var(--text-secondary); margin-bottom: 12px;">
                        <i class="fas fa-external-link-alt"></i> Simulate this circuit online with Tinkercad
                    </p>
                    <a href="${currentProject.tinkercadLink}" target="_blank" rel="noopener" style="display: inline-block; padding: 10px 20px; background: #00979d; color: #fff; text-decoration: none; border-radius: 8px; font-weight: 600;">
                        <i class="fas fa-play"></i> Open in Tinkercad
                    </a>
                </div>
            </section>
            ` : ''}

            ${hasREADME ? `
            <section>
                <h2 class="section-title"><i class="fas fa-book-open"></i> README & Documentation</h2>
                <div class="readme-section" style="background: rgba(0,0,0,0.3); border-radius: 12px; border: 2px solid var(--border-primary); padding: 16px;">
                    <div id="readmeContent">
                        <div style="text-align: center; padding: 20px;">
                            <div style="display: inline-block; width: 30px; height: 30px; border: 3px solid rgba(204, 0, 0, 0.3); border-top-color: var(--primary-red); border-radius: 50%; animation: spin 1s linear infinite;"></div>
                            <p style="margin-top: 12px; color: var(--text-secondary);">Loading README...</p>
                        </div>
                    </div>
                </div>
            </section>
            ` : ''}

            ${hasExplanation ? `
            <section>
                <h2 class="section-title"><i class="fas fa-graduation-cap"></i> Code Explanation (For Beginners)</h2>
                <div class="explanation-section" style="background: rgba(0,0,0,0.3); border-radius: 12px; border: 2px solid var(--border-primary); padding: 16px;">
                    <div id="explanationContent">
                        <div style="text-align: center; padding: 20px;">
                            <div style="display: inline-block; width: 30px; height: 30px; border: 3px solid rgba(204, 0, 0, 0.3); border-top-color: var(--primary-red); border-radius: 50%; animation: spin 1s linear infinite;"></div>
                            <p style="margin-top: 12px; color: var(--text-secondary);">Loading explanation...</p>
                        </div>
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
                ${currentProject.detailsPage ? `
                <button class="action-btn" onclick="window.open('${currentProject.detailsPage}', '_blank')" style="padding: 14px 24px; background: var(--primary-red); color: #fff; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 0.95rem;">
                    <i class="fas fa-external-link-alt"></i> View Full Details
                </button>
                ` : ''}
                ${currentProject.zipDownload && !hasGLB ? `
                <button class="action-btn secondary" onclick="window.open('${currentProject.zipDownload}', '_blank')" style="padding: 14px 24px; background: rgba(204, 0, 0, 0.1); color: var(--primary-red); border: 2px solid var(--primary-red); border-radius: 8px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 0.95rem;">
                    <i class="fas fa-download"></i> Download Files
                </button>
                ` : ''}
            </div>
        `;

        // Load 3D viewer library if needed
        if (hasGLB && !window.customElements.get('model-viewer')) {
            loadModelViewerLibrary();
        }

        // Load Arduino code/README/explanation if paths are provided
        if (hasCode && currentProject.codePath) {
            loadArduinoCode(currentProject.codePath);
        }
        if (hasREADME) {
            loadREADME(currentProject.readmePath);
        }
        if (hasExplanation) {
            loadExplanation(currentProject.explanationPath);
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
     * Load README markdown file
     */
    async function loadREADME(readmePath) {
        const readmeContent = document.getElementById('readmeContent');
        if (!readmeContent) return;

        try {
            const response = await fetch(readmePath);
            if (!response.ok) throw new Error('Failed to load README');
            
            const readmeText = await response.text();
            
            // Simple markdown to HTML conversion
            const htmlContent = convertMarkdownToHTML(readmeText);
            
            readmeContent.innerHTML = `
                <div style="color: var(--text-secondary); line-height: 1.8;">
                    ${htmlContent}
                </div>
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
     * Load explanation markdown file
     */
    async function loadExplanation(explanationPath) {
        const explanationContent = document.getElementById('explanationContent');
        if (!explanationContent) return;

        try {
            const response = await fetch(explanationPath);
            if (!response.ok) throw new Error('Failed to load explanation');
            
            const explanationText = await response.text();
            
            // Simple markdown to HTML conversion
            const htmlContent = convertMarkdownToHTML(explanationText);
            
            explanationContent.innerHTML = `
                <div style="color: var(--text-secondary); line-height: 1.8;">
                    ${htmlContent}
                </div>
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
     * Simple markdown to HTML converter
     */
    function convertMarkdownToHTML(markdown) {
        let html = markdown;
        
        // Headers
        html = html.replace(/^### (.*$)/gim, '<h3 style="color: var(--text-primary); margin: 20px 0 12px 0; font-size: 1.2rem;">$1</h3>');
        html = html.replace(/^## (.*$)/gim, '<h2 style="color: var(--text-primary); margin: 24px 0 12px 0; font-size: 1.4rem;">$1</h2>');
        html = html.replace(/^# (.*$)/gim, '<h1 style="color: var(--text-primary); margin: 28px 0 16px 0; font-size: 1.6rem;">$1</h1>');
        
        // Bold
        html = html.replace(/\*\*(.*?)\*\*/gim, '<strong style="color: var(--primary-red);">$1</strong>');
        
        // Italic
        html = html.replace(/\*(.*?)\*/gim, '<em>$1</em>');
        
        // Code blocks
        html = html.replace(/```([a-z]*)\n([\s\S]*?)```/gim, '<pre style="background: rgba(0,0,0,0.5); padding: 12px; border-radius: 8px; overflow-x: auto; margin: 12px 0;"><code style="font-family: monospace; font-size: 0.85rem; color: #e0e0e0;">$2</code></pre>');
        
        // Inline code
        html = html.replace(/`([^`]+)`/gim, '<code style="background: rgba(204,0,0,0.2); padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.9rem; color: #ff6666;">$1</code>');
        
        // Links
        html = html.replace(/\[([^\]]+)\]\(([^\)]+)\)/gim, '<a href="$2" target="_blank" rel="noopener" style="color: var(--primary-red); text-decoration: underline;">$1</a>');
        
        // Lists
        html = html.replace(/^\* (.*$)/gim, '<li style="margin-left: 20px; margin-bottom: 8px;">$1</li>');
        html = html.replace(/^- (.*$)/gim, '<li style="margin-left: 20px; margin-bottom: 8px;">$1</li>');
        
        // Line breaks
        html = html.replace(/\n\n/g, '</p><p style="margin: 12px 0;">');
        html = '<p style="margin: 12px 0;">' + html + '</p>';
        
        return html;
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

    // Export copyCode to window for inline onclick handlers
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
        }
    };

})();
