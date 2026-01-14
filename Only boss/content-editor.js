// Content Editor - Main JavaScript
// Manages editing of website content across all pages

// ==================== LocalStorage Auto-Save ====================

let autoSaveInterval;
const AUTO_SAVE_KEY = 'contentEditorData';
const AUTO_SAVE_INTERVAL = 30000; // 30 seconds

// Load from localStorage on startup
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

// Save to localStorage
function saveToStorage() {
    try {
        localStorage.setItem(AUTO_SAVE_KEY, JSON.stringify(editedData));
        showAutoSaveIndicator();
    } catch (e) {
        console.error('Failed to save:', e);
    }
}

// Auto-save indicator
function showAutoSaveIndicator() {
    const indicator = document.getElementById('autoSaveIndicator');
    if (indicator) {
        indicator.style.opacity = '1';
        setTimeout(() => indicator.style.opacity = '0', 2000);
    }
}

// Start auto-save
function startAutoSave() {
    if (autoSaveInterval) clearInterval(autoSaveInterval);
    autoSaveInterval = setInterval(saveToStorage, AUTO_SAVE_INTERVAL);
}

// ==================== Data Structure ====================

const contentData = {
    home: {
        title: "Home Page Content",
        description: "Edit hero section, tagline, and call-to-action texts",
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
                        maxLength: 50
                    },
                    {
                        id: "title",
                        label: "Professional Title",
                        type: "text",
                        value: "Energy Science & Engineering Student",
                        maxLength: 100
                    },
                    {
                        id: "tagline",
                        label: "Hero Tagline",
                        type: "textarea",
                        value: "Passionate about sustainable energy solutions and innovative engineering",
                        maxLength: 200
                    },
                    {
                        id: "location",
                        label: "Location",
                        type: "text",
                        value: "Khulna University of Engineering & Technology (KUET)",
                        maxLength: 100
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
                        value: "View My Work",
                        maxLength: 30
                    },
                    {
                        id: "cta2_text",
                        label: "Secondary CTA Text",
                        type: "text",
                        value: "Get In Touch",
                        maxLength: 30
                    },
                    {
                        id: "cta3_text",
                        label: "Tertiary CTA Text",
                        type: "text",
                        value: "Download CV",
                        maxLength: 30
                    }
                ]
            }
        ]
    },
    about: {
        title: "About Page Content",
        description: "Edit personal details, bio, education, and skills",
        sections: [
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
                        maxLength: 50
                    },
                    {
                        id: "department",
                        label: "Department",
                        type: "text",
                        value: "Department of Energy Science & Engineering",
                        maxLength: 100
                    },
                    {
                        id: "university",
                        label: "University",
                        type: "text",
                        value: "Khulna University of Engineering & Technology (KUET)",
                        maxLength: 100
                    },
                    {
                        id: "batch",
                        label: "Batch/Year",
                        type: "text",
                        value: "Batch 2K23",
                        maxLength: 20
                    },
                    {
                        id: "email",
                        label: "Email Address",
                        type: "text",
                        value: "mdakhinoorislam.official.2005@gmail.com",
                        maxLength: 100
                    },
                    {
                        id: "phone1",
                        label: "Primary Phone",
                        type: "text",
                        value: "01724812042",
                        maxLength: 20
                    },
                    {
                        id: "phone2",
                        label: "Secondary Phone",
                        type: "text",
                        value: "01518956815",
                        maxLength: 20
                    }
                ]
            },
            {
                id: "bio",
                name: "About Myself",
                icon: "fa-user-circle",
                fields: [
                    {
                        id: "bio_para1",
                        label: "Bio Paragraph 1 (Introduction)",
                        type: "textarea",
                        value: "Hello! I'm Md Akhinoor Islam, an undergraduate student pursuing Energy Science & Engineering at KUET. My journey in engineering began with a deep curiosity about how things work and a passion for creating innovative solutions.",
                        maxLength: 500
                    },
                    {
                        id: "bio_para2",
                        label: "Bio Paragraph 2 (Skills & Interests)",
                        type: "textarea",
                        value: "I specialize in 3D modeling with SOLIDWORKS, electronics prototyping with Arduino, and web development. My interests span from sustainable energy systems to automation and IoT projects.",
                        maxLength: 500
                    },
                    {
                        id: "bio_para3",
                        label: "Bio Paragraph 3 (Projects)",
                        type: "textarea",
                        value: "Throughout my academic journey, I've worked on various projects ranging from circuit design to full-stack web applications. Each project has taught me valuable lessons in problem-solving and innovation.",
                        maxLength: 500
                    },
                    {
                        id: "bio_para4",
                        label: "Bio Paragraph 4 (Goals)",
                        type: "textarea",
                        value: "My goal is to contribute to the field of renewable energy and sustainable engineering. I'm always eager to learn new technologies and collaborate on meaningful projects.",
                        maxLength: 500
                    }
                ]
            },
            {
                id: "addresses",
                name: "Addresses",
                icon: "fa-location-dot",
                fields: [
                    {
                        id: "home_address",
                        label: "Home Address",
                        type: "textarea",
                        value: "Vill: Muraripur, Post: Vela Muraripur-5100\nDinajpur, Bangladesh",
                        maxLength: 200
                    },
                    {
                        id: "work_address",
                        label: "Work/Study Address",
                        type: "textarea",
                        value: "KUET Campus, Khan Jahan Ali KUET Post Office-9203\nKhulna, Bangladesh",
                        maxLength: 200
                    }
                ]
            }
        ]
    },
    contact: {
        title: "Contact Page Content",
        description: "Edit contact form labels and information",
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
                        maxLength: 50
                    },
                    {
                        id: "page_subtitle",
                        label: "Subtitle",
                        type: "text",
                        value: "Let's connect and discuss opportunities",
                        maxLength: 100
                    }
                ]
            },
            {
                id: "social",
                name: "Social Media Links",
                icon: "fa-share-nodes",
                fields: [
                    {
                        id: "linkedin_url",
                        label: "LinkedIn URL",
                        type: "text",
                        value: "https://www.linkedin.com/in/md-akhinoor-islam-97886b368",
                        maxLength: 200
                    },
                    {
                        id: "github_url",
                        label: "GitHub URL",
                        type: "text",
                        value: "https://github.com/Akhinoor14",
                        maxLength: 200
                    },
                    {
                        id: "facebook_url",
                        label: "Facebook URL",
                        type: "text",
                        value: "https://www.facebook.com/mdakhinoorislam",
                        maxLength: 200
                    },
                    {
                        id: "youtube_url",
                        label: "YouTube URL",
                        type: "text",
                        value: "https://www.youtube.com/@noor_academy_study",
                        maxLength: 200
                    },
                    {
                        id: "whatsapp_number",
                        label: "WhatsApp Number (with country code)",
                        type: "text",
                        value: "8801724812042",
                        maxLength: 20
                    }
                ]
            }
        ]
    },
    "home-mobile": {
        title: "Home Mobile Content",
        description: "Edit mobile home page gateway content",
        sections: [
            {
                id: "welcome",
                name: "Welcome Card",
                icon: "fa-hand-wave",
                fields: [
                    {
                        id: "profile_name",
                        label: "Name",
                        type: "text",
                        value: "Md Akhinoor Islam",
                        maxLength: 50
                    },
                    {
                        id: "profile_title",
                        label: "Title",
                        type: "text",
                        value: "Energy Science & Engineering Student",
                        maxLength: 100
                    },
                    {
                        id: "profile_location",
                        label: "Location/Batch",
                        type: "text",
                        value: "KUET • Batch 2K23",
                        maxLength: 50
                    },
                    {
                        id: "tagline",
                        label: "Profile Tagline",
                        type: "textarea",
                        value: "Creating innovative engineering solutions with passion for 3D design, automation, and sustainable energy systems.",
                        maxLength: 200
                    }
                ]
            }
        ]
    },
    "about-mobile": {
        title: "About Mobile Content",
        description: "Edit mobile about page profile content",
        sections: [
            {
                id: "profile",
                name: "Profile Header",
                icon: "fa-user-circle",
                fields: [
                    {
                        id: "name",
                        label: "Name",
                        type: "text",
                        value: "Md Akhinoor Islam",
                        maxLength: 50
                    },
                    {
                        id: "department",
                        label: "Department",
                        type: "text",
                        value: "Department of Energy Science & Engineering",
                        maxLength: 100
                    },
                    {
                        id: "university",
                        label: "University",
                        type: "text",
                        value: "Khulna University of Engineering & Technology (KUET)",
                        maxLength: 100
                    },
                    {
                        id: "batch",
                        label: "Batch",
                        type: "text",
                        value: "Batch 2K23",
                        maxLength: 20
                    }
                ]
            }
        ]
    }
};

// ==================== Core Functions ====================

let currentPage = 'home';
let editedData = JSON.parse(JSON.stringify(contentData)); // Deep copy for editing
let changeHistory = [];
let historyIndex = -1;

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Load from localStorage if available
    const savedData = loadFromStorage();
    if (savedData) {
        editedData = savedData;
    }
    
    loadPage('home');
    startAutoSave();
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
    
    // Warn before leaving with unsaved changes
    window.addEventListener('beforeunload', function(e) {
        if (hasUnsavedChanges()) {
            e.preventDefault();
            e.returnValue = '';
        }
    });
});

// Load specific page content
function loadPage(pageName) {
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
    
    renderEditor(pageData);
}

// Render editor interface
function renderEditor(pageData) {
    const container = document.getElementById('editorContent');
    
    let html = `
        <div class="editor-header-section">
            <h2><i class="fas fa-file-lines"></i> ${pageData.title}</h2>
            <p>${pageData.description}</p>
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
                        <i class="fas fa-chevron-up"></i> Collapse
                    </button>
                </div>
                <div id="section-${sectionIndex}" class="section-content">
        `;
        
        section.fields.forEach((field, fieldIndex) => {
            const fieldId = `${currentPage}_${sectionIndex}_${fieldIndex}`;
            const value = field.value || '';
            
            if (field.type === 'textarea') {
                html += `
                    <div class="form-group">
                        <label for="${fieldId}">${field.label}</label>
                        <textarea 
                            id="${fieldId}" 
                            maxlength="${field.maxLength}"
                            oninput="updateField(${sectionIndex}, ${fieldIndex}, this.value)"
                        >${value}</textarea>
                        <div class="char-counter">
                            <span id="${fieldId}_counter">${value.length}</span> / ${field.maxLength}
                        </div>
                        ${field.preview ? `
                            <div class="preview-box">
                                <h4>Preview:</h4>
                                <div class="preview-content" id="${fieldId}_preview">${value}</div>
                            </div>
                        ` : ''}
                    </div>
                `;
            } else {
                html += `
                    <div class="form-group">
                        <label for="${fieldId}">${field.label}</label>
                        <input 
                            type="${field.type}" 
                            id="${fieldId}" 
                            value="${value}"
                            maxlength="${field.maxLength}"
                            oninput="updateField(${sectionIndex}, ${fieldIndex}, this.value)"
                        />
                        <div class="char-counter">
                            <span id="${fieldId}_counter">${value.length}</span> / ${field.maxLength}
                        </div>
                    </div>
                `;
            }
        });
        
        html += `
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// Update field value in memory
function updateField(sectionIndex, fieldIndex, value) {
    // Save to history for undo/redo
    saveToHistory();
    
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
            counter.style.color = '#F44336'; // Red
        } else if (percentage > 75) {
            counter.style.color = '#FF9800'; // Orange
        } else {
            counter.style.color = 'rgba(255, 255, 255, 0.5)'; // Normal
        }
    }
    
    // Update preview if exists
    const preview = document.getElementById(`${fieldId}_preview`);
    if (preview) {
        preview.innerHTML = formatPreview(value);
    }
    
    // Trigger auto-save
    saveToStorage();
}

// Format preview with basic markdown
function formatPreview(text) {
    return text
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/`(.+?)`/g, '<code>$1</code>')
        .replace(/\n/g, '<br>');
}

// Toggle section collapse
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

// ==================== Export Functions ====================

function exportHTML() {
    const output = document.getElementById('exportOutput');
    let html = `<!-- ${editedData[currentPage].title} - Updated Content -->\n\n`;
    
    editedData[currentPage].sections.forEach(section => {
        html += `<!-- ${section.name} -->\n`;
        section.fields.forEach(field => {
            html += `<!-- ${field.label}: ${field.value} -->\n`;
        });
        html += '\n';
    });
    
    output.innerHTML = `<pre>${escapeHTML(html)}</pre>`;
    output.style.display = 'block';
    
    showSuccess('HTML exported successfully! Scroll down to see the output.');
}

function exportJSON() {
    const output = document.getElementById('exportOutput');
    const json = JSON.stringify(editedData[currentPage], null, 2);
    
    output.innerHTML = `<pre>${escapeHTML(json)}</pre>`;
    output.style.display = 'block';
    
    showSuccess('JSON exported successfully! Scroll down to see the output.');
}

function copyToClipboard() {
    const output = document.getElementById('exportOutput');
    if (output.style.display === 'none') {
        showError('Please export HTML or JSON first!');
        return;
    }
    
    const text = output.querySelector('pre').textContent;
    navigator.clipboard.writeText(text).then(() => {
        showSuccess('✅ Copied to clipboard!');
    }).catch(() => {
        showError('❌ Failed to copy. Please select and copy manually.');
    });
}

function saveAllChanges() {
    const output = [];
    
    for (const [pageName, pageData] of Object.entries(editedData)) {
        output.push(`\n${'='.repeat(60)}\n${pageData.title.toUpperCase()}\n${'='.repeat(60)}\n`);
        
        pageData.sections.forEach(section => {
            output.push(`\n--- ${section.name} ---\n`);
            section.fields.forEach(field => {
                output.push(`${field.label}:\n${field.value}\n`);
            });
        });
    }
    
    const exportDiv = document.getElementById('exportOutput');
    exportDiv.innerHTML = `<pre>${escapeHTML(output.join('\n'))}</pre>`;
    exportDiv.style.display = 'block';
    
    showSuccess('✅ All changes compiled! Copy the output below and update your HTML files manually.');
    
    // Scroll to export section
    exportDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ==================== Utility Functions ====================

function showSuccess(msg) {
    const el = document.getElementById('successMsg');
    el.textContent = msg;
    el.style.display = 'block';
    setTimeout(() => el.style.display = 'none', 5000);
}

function showError(msg) {
    const el = document.getElementById('errorMsg');
    el.textContent = msg;
    el.style.display = 'block';
    setTimeout(() => el.style.display = 'none', 5000);
}

function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// ==================== Advanced Features ====================

// Undo/Redo functionality
function saveToHistory() {
    const snapshot = JSON.parse(JSON.stringify(editedData));
    changeHistory = changeHistory.slice(0, historyIndex + 1);
    changeHistory.push(snapshot);
    historyIndex++;
    
    // Limit history to 50 entries
    if (changeHistory.length > 50) {
        changeHistory.shift();
        historyIndex--;
    }
}

function undo() {
    if (historyIndex > 0) {
        historyIndex--;
        editedData = JSON.parse(JSON.stringify(changeHistory[historyIndex]));
        loadPage(currentPage);
        showSuccess('↶ Undone');
    } else {
        showError('Nothing to undo');
    }
}

function redo() {
    if (historyIndex < changeHistory.length - 1) {
        historyIndex++;
        editedData = JSON.parse(JSON.stringify(changeHistory[historyIndex]));
        loadPage(currentPage);
        showSuccess('↷ Redone');
    } else {
        showError('Nothing to redo');
    }
}

// Keyboard shortcuts
function handleKeyboardShortcuts(e) {
    // Ctrl/Cmd + Z = Undo
    if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
    }
    // Ctrl/Cmd + Shift + Z = Redo
    else if ((e.ctrlKey || e.metaKey) && e.key === 'z' && e.shiftKey) {
        e.preventDefault();
        redo();
    }
    // Ctrl/Cmd + S = Save
    else if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveAllChanges();
    }
    // Ctrl/Cmd + F = Find & Replace
    else if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        openFindReplace();
    }
}

// Find & Replace
function openFindReplace() {
    const findText = prompt('Find text:');
    if (!findText) return;
    
    const replaceText = prompt('Replace with:');
    if (replaceText === null) return;
    
    let count = 0;
    for (const [pageName, pageData] of Object.entries(editedData)) {
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
        loadPage(currentPage);
        saveToStorage();
        showSuccess(`✓ Replaced ${count} occurrence(s) of "${findText}"`);
    } else {
        showError(`No matches found for "${findText}"`);
    }
}

// Check for unsaved changes
function hasUnsavedChanges() {
    const original = JSON.stringify(contentData);
    const current = JSON.stringify(editedData);
    return original !== current;
}

// Reset to defaults
function resetToDefaults() {
    if (confirm('⚠️ Reset ALL changes to default values? This cannot be undone!')) {
        editedData = JSON.parse(JSON.stringify(contentData));
        localStorage.removeItem(AUTO_SAVE_KEY);
        changeHistory = [];
        historyIndex = -1;
        loadPage(currentPage);
        showSuccess('✓ Reset to defaults');
    }
}

// Word count
function getWordCount(text) {
    return text.trim().split(/\s+/).filter(w => w.length > 0).length;
}

// Import from JSON
function importJSON() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(event) {
            try {
                const imported = JSON.parse(event.target.result);
                if (confirm('Import this data? Current changes will be overwritten.')) {
                    editedData = imported;
                    saveToStorage();
                    loadPage(currentPage);
                    showSuccess('✓ Data imported successfully');
                }
            } catch (err) {
                showError('❌ Invalid JSON file: ' + err.message);
            }
        };
        reader.readAsText(file);
    };
    input.click();
}

// Export as downloadable JSON
function downloadJSON() {
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

// Statistics
function showStatistics() {
    let totalFields = 0;
    let totalChars = 0;
    let totalWords = 0;
    
    for (const pageData of Object.values(editedData)) {
        pageData.sections.forEach(section => {
            section.fields.forEach(field => {
                totalFields++;
                totalChars += field.value.length;
                totalWords += getWordCount(field.value);
            });
        });
    }
    
    alert(`📊 Content Statistics\n\n` +
          `Total Fields: ${totalFields}\n` +
          `Total Characters: ${totalChars.toLocaleString()}\n` +
          `Total Words: ${totalWords.toLocaleString()}\n` +
          `Average per Field: ${Math.round(totalChars / totalFields)} chars`);
}

// Validate all fields
function validateAll() {
    const errors = [];
    
    for (const [pageName, pageData] of Object.entries(editedData)) {
        pageData.sections.forEach(section => {
            section.fields.forEach(field => {
                // Check if exceeds max length
                if (field.value.length > field.maxLength) {
                    errors.push(`${pageName} - ${field.label}: Exceeds max length (${field.value.length}/${field.maxLength})`);
                }
                // Check for email format
                if (field.id === 'email' && field.value && !field.value.includes('@')) {
                    errors.push(`${pageName} - ${field.label}: Invalid email format`);
                }
                // Check for URL format
                if (field.label.includes('URL') && field.value && !field.value.startsWith('http')) {
                    errors.push(`${pageName} - ${field.label}: URL must start with http:// or https://`);
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

// Preview mode (simple simulation)
function togglePreviewMode() {
    const preview = document.getElementById('livePreviewPanel');
    if (preview.style.display === 'none') {
        preview.style.display = 'block';
        updateLivePreview();
    } else {
        preview.style.display = 'none';
    }
}

function updateLivePreview() {
    const preview = document.getElementById('livePreviewContent');
    const pageData = editedData[currentPage];
    
    let html = `<h2>${pageData.title}</h2>`;
    pageData.sections.forEach(section => {
        html += `<h3>${section.name}</h3>`;
        section.fields.forEach(field => {
            html += `<p><strong>${field.label}:</strong> ${field.value || '<em>Empty</em>'}</p>`;
        });
    });
    
    preview.innerHTML = html;
}
