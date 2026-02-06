// ==================================================================================
// CONTENT EDITOR - ADVANCED VERSION WITH GITHUB SYNC
// Manages editing of ALL website pages with real-time GitHub synchronization
// Author: A3KM Studio
// Version: 2.0
// ==================================================================================

// Initialize GitHub Sync Manager
const githubSync = new GitHubSyncManager();

// ==================== USE COMPREHENSIVE CONTENT DATA ====================
// Load comprehensive data if available, otherwise use basic data
const contentData = typeof comprehensiveContentData !== 'undefined' 
    ? comprehensiveContentData 
    : {
    // Fallback basic data structure (keeping original for compatibility)
    home: {
        title: "Home Page Content",
        description: "Edit homepage hero section, tagline, and tech stack",
        filePath: "Home/index.html",
        sections: [
            {
                id: "hero",
                name: "Hero Section",
                icon: "fa-star",
                fields: [
                    {
                        id: "name",
                        label: "Your Name",
                        type: "text",
                        value: "Md Akhinoor Islam",
                        selector: ".hero-title .highlight",
                        maxLength: 50
                    },
                    {
                        id: "subtitle",
                        label: "Professional Title/Subtitle",
                        type: "text",
                        value: "Energy Science & Engineering Student • KUET",
                        selector: ".hero-subtitle .typing-text",
                        maxLength: 100
                    },
                    {
                        id: "description",
                        label: "Hero Description",
                        type: "textarea",
                        value: "Passionate about creating innovative solutions and building amazing projects. Currently studying in the Department of Energy Science and Engineering at KUET, exploring the latest technologies and developing my skills in CAD design, web development, and engineering simulations.",
                        selector: ".hero-description .description-text",
                        maxLength: 500
                    }
                ]
            },
            {
                id: "cta",
                name: "Call to Action Buttons",
                icon: "fa-hand-pointer",
                fields: [
                    {
                        id: "cta1_text",
                        label: "Primary CTA Text",
                        type: "text",
                        value: "3D CAD Projects",
                        selector: ".btn-primary .btn-text",
                        maxLength: 30
                    },
                    {
                        id: "cta2_text",
                        label: "Secondary CTA Text",
                        type: "text",
                        value: "Arduino Projects",
                        selector: ".btn-secondary:nth-child(2) .btn-text",
                        maxLength: 30
                    },
                    {
                        id: "cta3_text",
                        label: "Tertiary CTA Text",
                        type: "text",
                        value: "Contact Me",
                        selector: ".btn-outline .btn-text",
                        maxLength: 30
                    }
                ]
            }
        ]
    },
    
    about: {
        title: "About Page Content",
        description: "Edit personal information, bio, education, and addresses",
        filePath: "About me/about.html",
        sections: [
            {
                id: "header",
                name: "Page Header",
                icon: "fa-heading",
                fields: [
                    {
                        id: "page_title",
                        label: "Page Title",
                        type: "text",
                        value: "About Me",
                        selector: ".bp-header h1",
                        maxLength: 50
                    },
                    {
                        id: "page_subtitle",
                        label: "Page Subtitle",
                        type: "text",
                        value: "Energy Science & Engineering • KUET",
                        selector: ".bp-header p",
                        maxLength: 100
                    }
                ]
            },
            {
                id: "personal",
                name: "Personal Information",
                icon: "fa-id-card",
                fields: [
                    {
                        id: "full_name",
                        label: "Full Name",
                        type: "text",
                        value: "Md Akhinoor Islam",
                        selector: ".about-info h2",
                        maxLength: 50
                    },
                    {
                        id: "department",
                        label: "Department",
                        type: "text",
                        value: "Department of Energy Science & Engineering",
                        selector: ".about-info .department",
                        maxLength: 100
                    },
                    {
                        id: "university",
                        label: "University",
                        type: "text",
                        value: "Khulna University of Engineering & Technology (KUET)",
                        selector: ".about-info .university",
                        maxLength: 100
                    }
                ]
            }
        ]
    },
    
    projects: {
        title: "Projects Gallery Page",
        description: "Edit projects page hero section and descriptions",
        filePath: "Projects Code/projects.html",
        sections: [
            {
                id: "hero",
                name: "Projects Hero Section",
                icon: "fa-folder-open",
                fields: [
                    {
                        id: "page_title",
                        label: "Page Title",
                        type: "text",
                        value: "Projects Gallery",
                        selector: ".projects-hero h1",
                        maxLength: 50
                    },
                    {
                        id: "page_description",
                        label: "Page Description",
                        type: "textarea",
                        value: "Explore my engineering projects including SOLIDWORKS CAD models, Arduino circuits, electronics tools, and web development work",
                        selector: ".projects-hero p",
                        maxLength: 200
                    }
                ]
            },
            {
                id: "solidworks",
                name: "SOLIDWORKS Section",
                icon: "fa-cube",
                fields: [
                    {
                        id: "solidworks_title",
                        label: "SOLIDWORKS Section Title",
                        type: "text",
                        value: "SOLIDWORKS Projects",
                        selector: "#solidworks-card h2",
                        maxLength: 50
                    },
                    {
                        id: "solidworks_description",
                        label: "SOLIDWORKS Description",
                        type: "textarea",
                        value: "Professional 3D CAD models and engineering designs",
                        selector: "#solidworks-card .card-description",
                        maxLength: 200
                    }
                ]
            },
            {
                id: "arduino",
                name: "Arduino Section",
                icon: "fa-microchip",
                fields: [
                    {
                        id: "arduino_title",
                        label: "Arduino Section Title",
                        type: "text",
                        value: "Arduino Projects",
                        selector: "#arduino-card h2",
                        maxLength: 50
                    },
                    {
                        id: "arduino_description",
                        label: "Arduino Description",
                        type: "textarea",
                        value: "Embedded systems and IoT projects with Arduino",
                        selector: "#arduino-card .card-description",
                        maxLength: 200
                    }
                ]
            },
            {
                id: "matlab",
                name: "MATLAB Section",
                icon: "fa-chart-line",
                fields: [
                    {
                        id: "matlab_title",
                        label: "MATLAB Section Title",
                        type: "text",
                        value: "MATLAB Projects",
                        selector: "#matlab-card h2",
                        maxLength: 50
                    },
                    {
                        id: "matlab_description",
                        label: "MATLAB Description",
                        type: "textarea",
                        value: "Engineering simulations and computational analysis",
                        selector: "#matlab-card .card-description",
                        maxLength: 200
                    }
                ]
            },
            {
                id: "electronics",
                name: "Electronics Section",
                icon: "fa-bolt",
                fields: [
                    {
                        id: "electronics_title",
                        label: "Electronics Section Title",
                        type: "text",
                        value: "Electronics Projects",
                        selector: "#electronics-card h2",
                        maxLength: 50
                    },
                    {
                        id: "electronics_description",
                        label: "Electronics Description",
                        type: "textarea",
                        value: "Circuit design and electronic component guides",
                        selector: "#electronics-card .card-description",
                        maxLength: 200
                    }
                ]
            }
        ]
    },
    
    contact: {
        title: "Contact Page Content",
        description: "Edit contact form and social media links",
        filePath: "Contact/contact.html",
        sections: [
            {
                id: "header",
                name: "Contact Header",
                icon: "fa-paper-plane",
                fields: [
                    {
                        id: "page_title",
                        label: "Page Title",
                        type: "text",
                        value: "Get In Touch",
                        selector: ".section-title",
                        maxLength: 50
                    },
                    {
                        id: "page_subtitle",
                        label: "Subtitle",
                        type: "text",
                        value: "Let's connect and discuss opportunities",
                        selector: ".section-subtitle",
                        maxLength: 100
                    }
                ]
            },
            {
                id: "contact_info",
                name: "Contact Information",
                icon: "fa-address-card",
                fields: [
                    {
                        id: "email",
                        label: "Email Address",
                        type: "email",
                        value: "mdakhinoorislam@gmail.com",
                        selector: ".contact-email",
                        maxLength: 100
                    },
                    {
                        id: "phone",
                        label: "Phone Number",
                        type: "text",
                        value: "+880 1724-812042",
                        selector: ".contact-phone",
                        maxLength: 20
                    },
                    {
                        id: "location",
                        label: "Location",
                        type: "text",
                        value: "Khulna, Bangladesh",
                        selector: ".contact-location",
                        maxLength: 100
                    }
                ]
            }
        ]
    },
    
    contentStudio: {
        title: "Content Studio Hub",
        description: "Edit Content Studio page header and descriptions",
        filePath: "Content Studio/hub.html",
        sections: [
            {
                id: "hero",
                name: "Content Studio Header",
                icon: "fa-layer-group",
                fields: [
                    {
                        id: "page_title",
                        label: "Page Title",
                        type: "text",
                        value: "Content Studio",
                        selector: ".studio-hero-title",
                        maxLength: 50
                    },
                    {
                        id: "page_tagline",
                        label: "Tagline",
                        type: "text",
                        value: "Educational Resources & Knowledge Hub",
                        selector: ".studio-hero-tagline",
                        maxLength: 100
                    }
                ]
            },
            {
                id: "sections",
                name: "Content Categories",
                icon: "fa-grid",
                fields: [
                    {
                        id: "blog_title",
                        label: "Blog Posts Title",
                        type: "text",
                        value: "Written Posts",
                        selector: ".blog-section-title",
                        maxLength: 50
                    },
                    {
                        id: "video_title",
                        label: "Video Content Title",
                        type: "text",
                        value: "Video Tutorials",
                        selector: ".video-section-title",
                        maxLength: 50
                    },
                    {
                        id: "books_title",
                        label: "Books/PDFs Title",
                        type: "text",
                        value: "Books & PDFs",
                        selector: ".books-section-title",
                        maxLength: 50
                    },
                    {
                        id: "papers_title",
                        label: "Research Papers Title",
                        type: "text",
                        value: "Research Papers",
                        selector: ".papers-section-title",
                        maxLength: 50
                    }
                ]
            }
        ]
    }
};

// ==================== GLOBAL STATE ====================
let currentPage = 'home';
let editedData = JSON.parse(JSON.stringify(contentData)); // Deep copy for editing
let originalData = JSON.parse(JSON.stringify(contentData)); // Keep original for comparison
let changeHistory = [];
let historyIndex = -1;
let fileSHAs = {}; // Store file SHAs for GitHub updates
let isLoading = false;

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', function() {
    initializeEditor();
});

async function initializeEditor() {
    // Check if GitHub token is set
    checkAuthentication();
    
    // Load from localStorage if available (fallback)
    const savedData = loadFromStorage();
    if (savedData) {
        editedData = savedData;
    }
    
    // Load first page
    await loadPage('home');
    
    // Start auto-save
    startAutoSave();
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
    
    // Warn before leaving with unsaved changes
    window.addEventListener('beforeunload', function(e) {
        if (hasUnsavedChanges()) {
            e.preventDefault();
            e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
        }
    });
}

// ==================== AUTHENTICATION ====================
function checkAuthentication() {
    const tokenInput = document.getElementById('githubTokenInput');
    const authSection = document.getElementById('authSection');
    const editorSection = document.getElementById('editorSection');
    
    if (githubSync.isAuthenticated()) {
        // Show saved token info
        displaySavedTokenInfo();
        
        // Verify token is still valid
        githubSync.verifyToken().then(valid => {
            if (valid) {
                if (authSection) authSection.style.display = 'none';
                if (editorSection) editorSection.style.display = 'block';
                showSuccess('✓ Connected to GitHub');
            } else {
                githubSync.clearToken();
                if (authSection) authSection.style.display = 'block';
                if (editorSection) editorSection.style.display = 'none';
                showError('GitHub token expired. Please re-authenticate.');
                hideSavedTokenInfo();
            }
        });
    } else {
        // Show authentication prompt
        if (authSection) authSection.style.display = 'block';
        if (editorSection) editorSection.style.display = 'none';
        hideSavedTokenInfo();
    }
}

function authenticateGitHub() {
    const tokenInput = document.getElementById('githubTokenInput');
    const token = tokenInput.value.trim();
    
    if (!token) {
        showError('Please enter a GitHub Personal Access Token');
        return;
    }
    
    githubSync.setToken(token);
    
    // Verify token
    showLoading('Verifying token...');
    githubSync.verifyToken().then(valid => {
        hideLoading();
        if (valid) {
            document.getElementById('authSection').style.display = 'none';
            document.getElementById('editorSection').style.display = 'block';
            showSuccess('✓ Successfully authenticated with GitHub!');
            displaySavedTokenInfo();
            loadPage('home'); // Reload with GitHub data
        } else {
            githubSync.clearToken();
            showError('Invalid token. Please check and try again.');
            hideSavedTokenInfo();
        }
    }).catch(error => {
        hideLoading();
        githubSync.clearToken();
        showError('Authentication failed: ' + error.message);
        hideSavedTokenInfo();
    });
}

function logout() {
    if (confirm('Logout from GitHub? Unsaved changes will be kept locally.')) {
        githubSync.clearToken();
        document.getElementById('authSection').style.display = 'block';
        document.getElementById('editorSection').style.display = 'none';
        hideSavedTokenInfo();
        // Clear input field
        const tokenInput = document.getElementById('githubTokenInput');
        if (tokenInput) tokenInput.value = '';
        showSuccess('Logged out successfully');
    }
}

// ==================== TOKEN DISPLAY FUNCTIONS ====================
function displaySavedTokenInfo() {
    const token = githubSync.getToken();
    if (!token) return;
    
    // Show badge
    const badge = document.getElementById('tokenSavedBadge');
    if (badge) badge.style.display = 'inline-block';
    
    // Show info section
    const infoSection = document.getElementById('tokenInfoSection');
    if (infoSection) infoSection.style.display = 'block';
    
    // Display save date
    const savedAt = localStorage.getItem('github_token_saved_at');
    const dateElement = document.getElementById('tokenSaveDate');
    if (dateElement && savedAt) {
        const date = new Date(savedAt);
        dateElement.textContent = `Saved: ${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`;
    }
    
    // Display masked token preview
    const previewElement = document.getElementById('tokenPreview');
    if (previewElement) {
        const maskedToken = maskToken(token);
        previewElement.textContent = maskedToken;
    }
    
    // Fill input with masked token
    const tokenInput = document.getElementById('githubTokenInput');
    if (tokenInput && !tokenInput.value) {
        tokenInput.value = token;
        tokenInput.type = 'password'; // Keep it hidden
    }
}

function hideSavedTokenInfo() {
    const badge = document.getElementById('tokenSavedBadge');
    if (badge) badge.style.display = 'none';
    
    const infoSection = document.getElementById('tokenInfoSection');
    if (infoSection) infoSection.style.display = 'none';
}

function maskToken(token) {
    if (!token || token.length < 8) return '***';
    const start = token.substring(0, 4);
    const end = token.substring(token.length - 4);
    const middle = '*'.repeat(Math.min(token.length - 8, 20));
    return `${start}${middle}${end}`;
}

function toggleTokenVisibility() {
    const tokenInput = document.getElementById('githubTokenInput');
    const icon = document.getElementById('toggleTokenIcon');
    
    if (!tokenInput || !icon) return;
    
    if (tokenInput.type === 'password') {
        tokenInput.type = 'text';
        icon.className = 'fas fa-eye-slash';
    } else {
        tokenInput.type = 'password';
        icon.className = 'fas fa-eye';
    }
}

function clearSavedToken() {
    if (confirm('Clear saved token? You will need to re-authenticate.')) {
        githubSync.clearToken();
        const tokenInput = document.getElementById('githubTokenInput');
        if (tokenInput) tokenInput.value = '';
        hideSavedTokenInfo();
        showSuccess('Token cleared. Please enter a new token.');
    }
}

// ==================== PAGE LOADING ====================
async function loadPage(pageName) {
    if (isLoading) return;
    
    currentPage = pageName;
    
    // Update sidebar active state
    document.querySelectorAll('.page-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.page === pageName) {
            item.classList.add('active');
        }
    });
    
    // Load content
    const pageData = editedData[pageName];
    if (!pageData) {
        showError('Page data not found!');
        return;
    }
    
    // Show page preview first
    showPagePreview(pageData);
    
    // If authenticated, try to load from GitHub
    if (githubSync.isAuthenticated()) {
        try {
            isLoading = true;
            showLoading(`Loading ${pageData.title} from GitHub...`);
            
            const fileData = await githubSync.getFileContent(pageData.filePath);
            fileSHAs[pageName] = fileData.sha;
            
            // Extract content from HTML and populate fields
            const extractedContent = extractContentFromHTML(fileData.content, pageData);
            if (extractedContent) {
                updatePageDataWithExtracted(pageName, extractedContent);
            }
            
            hideLoading();
            showSuccess(`✓ Loaded latest content from GitHub`);
        } catch (error) {
            hideLoading();
            console.error('Error loading from GitHub:', error);
            showError('Could not load from GitHub. Using local data.');
        } finally {
            isLoading = false;
        }
    }
    
    // Don't automatically render editor - let user click "Start Editing" from preview
    // renderEditor(pageData);
}

// Show original page preview
function showPagePreview(pageData) {
    const previewPanel = document.getElementById('pagePreviewPanel');
    const editorContent = document.getElementById('editorContent');
    if (!previewPanel) return;
    
    // Hide editor content when showing preview
    if (editorContent) {
        editorContent.classList.add('hidden');
    }
    
    // Build preview URL (relative to current location)
    const baseUrl = window.location.origin + window.location.pathname.replace('Only-boss/managers/content-editing/content-editor.html', '');
    const previewUrl = baseUrl + pageData.filePath;
    
    previewPanel.innerHTML = `
        <div class="preview-header">
            <h3><i class="fas fa-eye"></i> Original Page Preview - ${pageData.title}</h3>
            <button onclick="closePagePreview()" class="btn-close-preview">
                <i class="fas fa-times"></i> Close Preview
            </button>
        </div>
        <div class="preview-iframe-wrapper">
            <iframe src="${previewUrl}" 
                    frameborder="0" 
                    class="page-preview-iframe"
                    title="${pageData.title} Preview">
            </iframe>
        </div>
        <div class="preview-actions">
            <button onclick="window.open('${previewUrl}', '_blank')" class="btn btn-secondary">
                <i class="fas fa-external-link-alt"></i> Open in New Tab
            </button>
            <button onclick="startEditing()" class="btn btn-primary">
                <i class="fas fa-edit"></i> Start Editing
            </button>
        </div>
    `;
    
    previewPanel.classList.remove('hidden');
    previewPanel.style.display = 'block';
}

// Close preview and show editor
function closePagePreview() {
    const previewPanel = document.getElementById('pagePreviewPanel');
    const editorContent = document.getElementById('editorContent');
    
    if (previewPanel) {
        previewPanel.classList.add('hidden');
        previewPanel.style.display = 'none';
    }
    
    if (editorContent) {
        editorContent.classList.remove('hidden');
    }
}

// Start editing - hide preview, show editor
function startEditing() {
    closePagePreview();
    
    // Render the editor with current page data
    const pageData = editedData[currentPage];
    if (pageData) {
        renderEditor(pageData);
    }
    
    showSuccess('Editor mode activated - You can now edit the content');
}

// Toggle preview panel
function togglePagePreview() {
    const previewPanel = document.getElementById('pagePreviewPanel');
    const editorContent = document.getElementById('editorContent');
    
    if (previewPanel && editorContent) {
        const isPreviewVisible = previewPanel.style.display !== 'none' && !previewPanel.classList.contains('hidden');
        
        if (isPreviewVisible) {
            // Hide preview, show editor
            previewPanel.classList.add('hidden');
            previewPanel.style.display = 'none';
            editorContent.classList.remove('hidden');
        } else {
            // Show preview, hide editor
            previewPanel.classList.remove('hidden');
            previewPanel.style.display = 'block';
            editorContent.classList.add('hidden');
        }
    }
}

// Extract actual content from HTML using selectors
function extractContentFromHTML(html, pageData) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const extracted = {};
    
    pageData.sections.forEach(section => {
        section.fields.forEach(field => {
            if (field.selector) {
                const element = doc.querySelector(field.selector);
                if (element) {
                    extracted[field.id] = element.textContent.trim();
                }
            }
        });
    });
    
    return Object.keys(extracted).length > 0 ? extracted : null;
}

// Update page data with extracted content
function updatePageDataWithExtracted(pageName, extractedContent) {
    const pageData = editedData[pageName];
    
    pageData.sections.forEach(section => {
        section.fields.forEach(field => {
            if (extractedContent[field.id]) {
                field.value = extractedContent[field.id];
            }
        });
    });
}

// ==================== EDITOR RENDERING ====================
function renderEditor(pageData) {
    const container = document.getElementById('editorContent');
    if (!container) return;
    
    let html = `
        <div class="editor-header-section">
            <div class="editor-header-left">
                <h2><i class="fas fa-file-lines"></i> ${pageData.title}</h2>
                <p>${pageData.description}</p>
            </div>
            <div class="editor-header-right">
                <span class="file-path"><i class="fas fa-code"></i> ${pageData.filePath}</span>
            </div>
        </div>
    `;
    
    pageData.sections.forEach((section, sectionIndex) => {
        html += `
            <div class="content-section">
                <div class="section-header">
                    <h3>
                        <i class="fas ${section.icon}"></i>
                        ${section.name}
                    </h3>
                    <button class="section-toggle" onclick="toggleSection('section-${sectionIndex}')">
                        <i class="fas fa-chevron-up"></i>
                    </button>
                </div>
                <div id="section-${sectionIndex}" class="section-content">
        `;
        
        section.fields.forEach((field, fieldIndex) => {
            const fieldId = `${currentPage}_${sectionIndex}_${fieldIndex}`;
            const value = field.value || '';
            
            html += `
                <div class="form-group">
                    <label for="${fieldId}">
                        ${field.label}
                        ${field.selector ? `<span class="selector-hint" title="CSS Selector"><i class="fas fa-code"></i> ${field.selector}</span>` : ''}
                    </label>
            `;
            
            if (field.type === 'textarea') {
                html += `
                    <textarea 
                        id="${fieldId}" 
                        maxlength="${field.maxLength}"
                        rows="4"
                        oninput="updateField(${sectionIndex}, ${fieldIndex}, this.value)"
                    >${value}</textarea>
                `;
            } else {
                html += `
                    <input 
                        type="${field.type}" 
                        id="${fieldId}" 
                        value="${value}"
                        maxlength="${field.maxLength}"
                        oninput="updateField(${sectionIndex}, ${fieldIndex}, this.value)"
                    />
                `;
            }
            
            html += `
                    <div class="field-footer">
                        <span class="char-counter">
                            <span id="${fieldId}_counter">${value.length}</span> / ${field.maxLength}
                        </span>
                        ${field.selector ? `
                            <button class="btn-preview-field" onclick="previewField(${sectionIndex}, ${fieldIndex})" title="Preview Change">
                                <i class="fas fa-eye"></i> Preview
                            </button>
                        ` : ''}
                    </div>
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
    
    // Ensure editor is visible and preview is hidden
    container.classList.remove('hidden');
    const previewPanel = document.getElementById('pagePreviewPanel');
    if (previewPanel) {
        previewPanel.classList.add('hidden');
        previewPanel.style.display = 'none';
    }
}

// ==================== FIELD UPDATES ====================
function updateField(sectionIndex, fieldIndex, value) {
    // Save to history for undo/redo
    saveToHistory();
    
    // Update value
    editedData[currentPage].sections[sectionIndex].fields[fieldIndex].value = value;
    
    // Update character counter
    const fieldId = `${currentPage}_${sectionIndex}_${fieldIndex}`;
    const counter = document.getElementById(`${fieldId}_counter`);
    if (counter) {
        counter.textContent = value.length;
        
        // Color code based on usage
        const field = editedData[currentPage].sections[sectionIndex].fields[fieldIndex];
        const percentage = (value.length / field.maxLength) * 100;
        if (percentage > 90) {
            counter.style.color = '#F44336';
        } else if (percentage > 75) {
            counter.style.color = '#FF9800';
        } else {
            counter.style.color = 'rgba(255, 255, 255, 0.5)';
        }
    }
    
    // Trigger auto-save to localStorage
    saveToStorage();
}

function previewField(sectionIndex, fieldIndex) {
    const field = editedData[currentPage].sections[sectionIndex].fields[fieldIndex];
    alert(`Preview of: ${field.label}\n\nCurrent Value:\n${field.value}\n\nThis will update: ${field.selector}`);
}

// ==================== SAVE FUNCTIONALITY ====================
async function saveToGitHub() {
    if (!githubSync.isAuthenticated()) {
        showError('Please authenticate with GitHub first');
        return;
    }
    
    if (!hasUnsavedChanges()) {
        showError('No changes to save');
        return;
    }
    
    const pagesToUpdate = [];
    
    // Prepare updates for each modified page
    for (const [pageName, pageData] of Object.entries(editedData)) {
        if (hasPageChanged(pageName)) {
            pagesToUpdate.push({
                name: pageName,
                data: pageData,
                sha: fileSHAs[pageName]
            });
        }
    }
    
    if (pagesToUpdate.length === 0) {
        showError('No changes detected');
        return;
    }
    
    // Confirm before saving
    const confirmation = confirm(
        `Save changes to GitHub?\n\n` +
        `Pages to update: ${pagesToUpdate.map(p => p.data.title).join(', ')}\n\n` +
        `This will update the live website!`
    );
    
    if (!confirmation) return;
    
    try {
        showLoading('Saving changes to GitHub...');
        
        const updates = [];
        
        for (const page of pagesToUpdate) {
            // Load current HTML file
            const fileData = await githubSync.getFileContent(page.data.filePath);
            
            // Inject new content
            const updatedHTML = injectContentIntoHTML(fileData.content, page.data);
            
            updates.push({
                path: page.data.filePath,
                content: updatedHTML,
                message: `Update ${page.data.title} via Content Editor`,
                sha: fileData.sha
            });
        }
        
        // Batch update all files
        await githubSync.updateMultipleFiles(updates);
        
        // Update original data to mark as saved
        originalData = JSON.parse(JSON.stringify(editedData));
        localStorage.removeItem(AUTO_SAVE_KEY);
        
        hideLoading();
        showSuccess(`✅ Successfully saved ${updates.length} page(s) to GitHub!`);
        
    } catch (error) {
        hideLoading();
        console.error('Save error:', error);
        showError(`Failed to save: ${error.message}`);
    }
}

// Inject updated content back into HTML
function injectContentIntoHTML(html, pageData) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    pageData.sections.forEach(section => {
        section.fields.forEach(field => {
            if (field.selector && field.value) {
                const element = doc.querySelector(field.selector);
                if (element) {
                    element.textContent = field.value;
                }
            }
        });
    });
    
    // Serialize back to HTML string
    const serializer = new XMLSerializer();
    return serializer.serializeToString(doc);
}

// Check if specific page has changes
function hasPageChanged(pageName) {
    const original = JSON.stringify(originalData[pageName]);
    const current = JSON.stringify(editedData[pageName]);
    return original !== current;
}

// ==================== AUTO-SAVE (LocalStorage) ====================
const AUTO_SAVE_KEY = 'contentEditorData';
const AUTO_SAVE_INTERVAL = 30000; // 30 seconds
let autoSaveInterval;

function startAutoSave() {
    if (autoSaveInterval) clearInterval(autoSaveInterval);
    autoSaveInterval = setInterval(saveToStorage, AUTO_SAVE_INTERVAL);
}

function saveToStorage() {
    try {
        localStorage.setItem(AUTO_SAVE_KEY, JSON.stringify(editedData));
        showAutoSaveIndicator();
    } catch (e) {
        console.error('Failed to save to localStorage:', e);
    }
}

function loadFromStorage() {
    const saved = localStorage.getItem(AUTO_SAVE_KEY);
    if (saved) {
        try {
            const data = JSON.parse(saved);
            if (confirm('Found unsaved changes from previous session. Restore them?')) {
                return data;
            }
        } catch (e) {
            console.error('Failed to parse saved data:', e);
        }
    }
    return null;
}

function showAutoSaveIndicator() {
    const indicator = document.getElementById('autoSaveIndicator');
    if (indicator) {
        indicator.classList.add('active');
        setTimeout(() => indicator.classList.remove('active'), 2000);
    }
}

// ==================== UTILITY FUNCTIONS ====================
function toggleSection(sectionId) {
    const section = document.getElementById(sectionId);
    const btn = section.previousElementSibling.querySelector('.section-toggle i');
    
    if (section.style.display === 'none') {
        section.style.display = 'block';
        btn.className = 'fas fa-chevron-up';
    } else {
        section.style.display = 'none';
        btn.className = 'fas fa-chevron-down';
    }
}

function hasUnsavedChanges() {
    const original = JSON.stringify(originalData);
    const current = JSON.stringify(editedData);
    return original !== current;
}

function showSuccess(msg) {
    showNotification(msg, 'success');
}

function showError(msg) {
    showNotification(msg, 'error');
}

function showNotification(msg, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${msg}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

function showLoading(msg) {
    const loader = document.getElementById('loadingOverlay');
    const loaderText = document.getElementById('loadingText');
    if (loader && loaderText) {
        loaderText.textContent = msg;
        loader.style.display = 'flex';
    }
}

function hideLoading() {
    const loader = document.getElementById('loadingOverlay');
    if (loader) {
        loader.style.display = 'none';
    }
}

// ==================== UNDO/REDO ====================
function saveToHistory() {
    const snapshot = JSON.parse(JSON.stringify(editedData));
    changeHistory = changeHistory.slice(0, historyIndex + 1);
    changeHistory.push(snapshot);
    historyIndex++;
    
    if (changeHistory.length > 50) {
        changeHistory.shift();
        historyIndex--;
    }
}

function undo() {
    if (historyIndex > 0) {
        historyIndex--;
        editedData = JSON.parse(JSON.stringify(changeHistory[historyIndex]));
        renderEditor(editedData[currentPage]);
        showSuccess('↶ Undone');
    } else {
        showError('Nothing to undo');
    }
}

function redo() {
    if (historyIndex < changeHistory.length - 1) {
        historyIndex++;
        editedData = JSON.parse(JSON.stringify(changeHistory[historyIndex]));
        renderEditor(editedData[currentPage]);
        showSuccess('↷ Redone');
    } else {
        showError('Nothing to redo');
    }
}

// ==================== KEYBOARD SHORTCUTS ====================
function handleKeyboardShortcuts(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
    } else if ((e.ctrlKey || e.metaKey) && e.key === 'z' && e.shiftKey) {
        e.preventDefault();
        redo();
    } else if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveToGitHub();
    } else if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        openFindReplace();
    }
}

// ==================== ADVANCED FEATURES ====================
function openFindReplace() {
    const findText = prompt('Find text:');
    if (!findText) return;
    
    const replaceText = prompt('Replace with:');
    if (replaceText === null) return;
    
    let count = 0;
    for (const pageData of Object.values(editedData)) {
        pageData.sections.forEach(section => {
            section.fields.forEach(field => {
                if (field.value && field.value.includes(findText)) {
                    field.value = field.value.replaceAll(findText, replaceText);
                    count++;
                }
            });
        });
    }
    
    if (count > 0) {
        renderEditor(editedData[currentPage]);
        saveToStorage();
        showSuccess(`✓ Replaced ${count} occurrence(s)`);
    } else {
        showError(`No matches found for "${findText}"`);
    }
}

function showStatistics() {
    let totalFields = 0;
    let totalChars = 0;
    let totalWords = 0;
    let modifiedFields = 0;
    
    for (const [pageName, pageData] of Object.entries(editedData)) {
        pageData.sections.forEach(section => {
            section.fields.forEach((field, idx) => {
                totalFields++;
                totalChars += field.value.length;
                totalWords += field.value.trim().split(/\s+/).filter(w => w).length;
                
                const originalField = originalData[pageName].sections
                    .find(s => s.id === section.id)?.fields[idx];
                if (originalField && originalField.value !== field.value) {
                    modifiedFields++;
                }
            });
        });
    }
    
    alert(
        `📊 Content Statistics\n\n` +
        `Total Fields: ${totalFields}\n` +
        `Modified Fields: ${modifiedFields}\n` +
        `Total Characters: ${totalChars.toLocaleString()}\n` +
        `Total Words: ${totalWords.toLocaleString()}\n` +
        `Average per Field: ${Math.round(totalChars / totalFields)} chars`
    );
}

function validateAll() {
    const errors = [];
    
    for (const [pageName, pageData] of Object.entries(editedData)) {
        pageData.sections.forEach(section => {
            section.fields.forEach(field => {
                if (field.value.length > field.maxLength) {
                    errors.push(`${pageData.title} - ${field.label}: Exceeds max length`);
                }
                if (field.type === 'email' && field.value && !field.value.includes('@')) {
                    errors.push(`${pageData.title} - ${field.label}: Invalid email`);
                }
                if (field.label.includes('URL') && field.value && !field.value.startsWith('http')) {
                    errors.push(`${pageData.title} - ${field.label}: Invalid URL`);
                }
            });
        });
    }
    
    if (errors.length > 0) {
        alert('⚠️ Validation Errors:\n\n' + errors.join('\n'));
    } else {
        showSuccess('✓ All fields validated successfully');
    }
}

function exportJSON() {
    const dataStr = JSON.stringify(editedData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `content-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showSuccess('✓ Backup downloaded');
}

function resetToDefaults() {
    if (confirm('⚠️ Reset ALL changes to original values? This cannot be undone!')) {
        editedData = JSON.parse(JSON.stringify(contentData));
        originalData = JSON.parse(JSON.stringify(contentData));
        localStorage.removeItem(AUTO_SAVE_KEY);
        changeHistory = [];
        historyIndex = -1;
        renderEditor(editedData[currentPage]);
        showSuccess('✓ Reset to defaults');
    }
}
