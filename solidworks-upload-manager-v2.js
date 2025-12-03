/**
 * SOLIDWORKS Upload Manager V2
 * Complete rewrite for Basic/Intermediate/Pro/Paid structure
 * Auto-folder detection, auto-rename, README generation
 * A3KM Studio - Md Akhinoor Islam
 */

// ==================== CONFIGURATION ====================
const CONFIG = {
    REPO_OWNER: 'Akhinoor14',
    REPO_NAME: 'SOLIDWORKS-Projects',
    BASE_PATH: 'Solidwork Projects',
    CATEGORIES: {
        basic: 'Basic (Practice) Models',
        intermediate: 'Intermediate (Practice) Models',
        pro: 'Pro (Practice) Models',
        paid: 'Paid (Selled) Models'
    },
    MAX_FILE_SIZE: 100 * 1024 * 1024, // 100MB
    ALLOWED_EXTENSIONS: ['.sldprt', '.sldasm', '.slddrw', '.glb', '.gltf', '.pdf', '.png', '.jpg', '.jpeg'],
    BACKEND_URL: 'http://localhost:5000'
};

// ==================== STATE MANAGEMENT ====================
let state = {
    githubToken: localStorage.getItem('github_token') || '',
    selectedFiles: {
        basic: [],
        intermediate: [],
        pro: [],
        paid: []
    },
    currentCategory: 'basic',
    backendAvailable: false,
    modelCounts: {
        basic: 0,
        intermediate: 0,
        pro: 0,
        paid: 0
    }
};

// ==================== UTILITY FUNCTIONS ====================

function showNotification(message, type = 'info', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: ${type === 'success' ? 'rgba(0,204,0,0.95)' : type === 'error' ? 'rgba(220,53,69,0.95)' : 'rgba(0,123,255,0.95)'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideIn 0.3s;
        max-width: 350px;
        font-size: 0.9rem;
    `;
    notification.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i> ${message}`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s';
        setTimeout(() => notification.remove(), 300);
    }, duration);
}

function updateMessage(category, message, type = 'info') {
    const messageEl = document.getElementById(`${category}Message`);
    if (!messageEl) return;
    
    messageEl.className = `message message-${type}`;
    messageEl.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i> ${message}`;
    messageEl.style.display = 'block';
}

function clearMessage(category) {
    const messageEl = document.getElementById(`${category}Message`);
    if (messageEl) messageEl.style.display = 'none';
}

async function fetchWithToken(url, options = {}) {
    const token = state.githubToken || 'BACKEND_MANAGED';
    const headers = {
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json',
        ...options.headers
    };
    
    return fetch(url, { ...options, headers });
}

// ==================== GITHUB API FUNCTIONS ====================

/**
 * Get all folders in a category
 * Returns array of folder names: ['Model 01', 'Model 02', ...]
 */
async function getCategoryFolders(category) {
    try {
        const categoryPath = CONFIG.CATEGORIES[category];
        const url = `https://api.github.com/repos/${CONFIG.REPO_OWNER}/${CONFIG.REPO_NAME}/contents/${CONFIG.BASE_PATH}/${categoryPath}`;
        
        const response = await fetchWithToken(url);
        
        if (!response.ok) {
            if (response.status === 404) return []; // Category folder doesn't exist yet
            throw new Error(`GitHub API error: ${response.status}`);
        }
        
        const contents = await response.json();
        return contents
            .filter(item => item.type === 'dir')
            .map(item => item.name)
            .sort();
    } catch (error) {
        console.error(`Error fetching ${category} folders:`, error);
        return [];
    }
}

/**
 * Auto-detect next model number
 * Scans existing folders, finds last Model XX, returns next number
 */
async function getNextModelNumber(category) {
    const folders = await getCategoryFolders(category);
    
    if (folders.length === 0) return 1;
    
    // Parse Model XX format
    const modelNumbers = folders
        .filter(name => /^Model \d+$/i.test(name))
        .map(name => {
            const match = name.match(/^Model (\d+)$/i);
            return match ? parseInt(match[1], 10) : 0;
        })
        .filter(num => num > 0);
    
    if (modelNumbers.length === 0) return 1;
    
    const lastNumber = Math.max(...modelNumbers);
    return lastNumber + 1;
}

/**
 * Generate folder name: Model 01, Model 02, etc.
 */
function generateFolderName(modelNumber) {
    return `Model ${String(modelNumber).padStart(2, '0')}`;
}

/**
 * Auto-rename file with pattern: Model XX Category.ext
 * Example: Model 36 Basic.glb, Model 01 Pro.sldprt
 */
function renameFile(originalName, category, modelNumber) {
    const ext = originalName.substring(originalName.lastIndexOf('.'));
    const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
    const modelNum = String(modelNumber).padStart(2, '0');
    return `Model ${modelNum} ${categoryName}${ext}`;
}

/**
 * Upload file to GitHub
 */
async function uploadFileToGitHub(file, path, message) {
    try {
        // Read file as base64
        const base64Content = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const base64 = reader.result.split(',')[1];
                resolve(base64);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
        
        const url = `https://api.github.com/repos/${CONFIG.REPO_OWNER}/${CONFIG.REPO_NAME}/contents/${path}`;
        
        // Check if file exists
        let sha = null;
        try {
            const checkResponse = await fetchWithToken(url);
            if (checkResponse.ok) {
                const existingFile = await checkResponse.json();
                sha = existingFile.sha;
            }
        } catch (e) {
            // File doesn't exist, continue
        }
        
        const body = {
            message,
            content: base64Content,
            ...(sha && { sha }) // Include SHA if updating existing file
        };
        
        const response = await fetchWithToken(url, {
            method: 'PUT',
            body: JSON.stringify(body)
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Upload failed');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Upload error:', error);
        throw error;
    }
}

/**
 * Generate README.md content for model folder
 */
function generateREADME(files, category, modelNumber) {
    const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
    const modelFolder = generateFolderName(modelNumber);
    
    let readme = `# ${modelFolder} - ${categoryName} Model\n\n`;
    readme += `## 📋 Project Overview\n`;
    readme += `${categoryName} model from A3KM Studio SOLIDWORKS portfolio.\n\n`;
    
    readme += `## 🖼️ Preview\n`;
    const imageFiles = files.filter(f => /\.(png|jpg|jpeg)$/i.test(f.name));
    if (imageFiles.length > 0) {
        readme += `![Model Preview](${encodeURIComponent(imageFiles[0].name)})\n\n`;
    }
    
    readme += `## 📥 **Quick Access & Download**\n\n`;
    readme += `<div align="center">\n\n`;
    
    // SOLIDWORKS files
    const solidworksFiles = files.filter(f => /\.(sldprt|sldasm|slddrw)$/i.test(f.name));
    if (solidworksFiles.length > 0) {
        readme += `### 📥 **Download SOLIDWORKS Files**\n\n`;
        solidworksFiles.forEach(f => {
            readme += `[![Download ${f.name}](https://img.shields.io/badge/📥_Download-${encodeURIComponent(f.name)}-brightgreen?style=for-the-badge)](${encodeURIComponent(f.name)})\n\n`;
        });
    }
    
    // 3D Model files
    const modelFiles = files.filter(f => /\.(glb|gltf)$/i.test(f.name));
    if (modelFiles.length > 0) {
        readme += `### 🎲 **3D Model Files**\n\n`;
        modelFiles.forEach(f => {
            readme += `[![Download ${f.name}](https://img.shields.io/badge/🎲_3D_Model-${encodeURIComponent(f.name)}-blue?style=for-the-badge)](${encodeURIComponent(f.name)})\n\n`;
        });
    }
    
    // PDF files
    const pdfFiles = files.filter(f => /\.pdf$/i.test(f.name));
    if (pdfFiles.length > 0) {
        readme += `### 📄 **Documentation**\n\n`;
        pdfFiles.forEach(f => {
            readme += `[![View ${f.name}](https://img.shields.io/badge/📄_PDF-${encodeURIComponent(f.name)}-red?style=for-the-badge)](${encodeURIComponent(f.name)})\n\n`;
        });
    }
    
    readme += `</div>\n\n`;
    
    readme += `## 📂 File Contents\n\n`;
    readme += `| 📁 **File Type** | 📂 **File Name** | 📦 **Size** |\n`;
    readme += `|:---:|:---:|:---:|\n`;
    
    files.forEach(f => {
        const ext = f.name.substring(f.name.lastIndexOf('.')).toLowerCase();
        let icon = '📄';
        if (['.sldprt', '.sldasm', '.slddrw'].includes(ext)) icon = '🔧';
        else if (['.glb', '.gltf'].includes(ext)) icon = '🎲';
        else if (ext === '.pdf') icon = '📄';
        else if (['.png', '.jpg', '.jpeg'].includes(ext)) icon = '🖼️';
        
        const sizeKB = (f.size / 1024).toFixed(2);
        readme += `| ${icon} | [\`${f.name}\`](${encodeURIComponent(f.name)}) | ${sizeKB} KB |\n`;
    });
    
    readme += `\n## 🎓 Project Information\n\n`;
    readme += `- **Category:** ${categoryName} Models\n`;
    readme += `- **Model Number:** ${modelFolder}\n`;
    readme += `- **Total Files:** ${files.length}\n`;
    readme += `- **Created:** ${new Date().toLocaleDateString()}\n\n`;
    
    readme += `## 🔗 Related Links\n\n`;
    readme += `- [🏠 A3KM Studio Home](https://akhinoor14.github.io/A3KM-Studio/)\n`;
    readme += `- [📁 All SOLIDWORKS Projects](https://github.com/Akhinoor14/SOLIDWORKS-Projects)\n`;
    readme += `- [🎨 Portfolio Website](https://akhinoor14.github.io/A3KM-Studio/portfolio-desktop.html)\n\n`;
    
    readme += `---\n\n`;
    readme += `**Created by:** Md Akhinoor Islam  \n`;
    readme += `**A3KM Studio** - Engineering & Design Portfolio\n`;
    
    return readme;
}

// ==================== FILE HANDLING ====================

function validateFile(file) {
    const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    
    if (!CONFIG.ALLOWED_EXTENSIONS.includes(ext)) {
        return { valid: false, error: `File type ${ext} not supported` };
    }
    
    if (file.size > CONFIG.MAX_FILE_SIZE) {
        return { valid: false, error: `File ${file.name} exceeds 100MB limit` };
    }
    
    return { valid: true };
}

function handleFileSelection(category) {
    const input = document.getElementById(`${category}FileInput`);
    const filesList = document.getElementById(`${category}FilesList`);
    const summary = document.getElementById(`${category}FileSummary`);
    const uploadBtn = document.getElementById(`${category}UploadBtn`);
    
    if (!input || !input.files.length) return;
    
    const files = Array.from(input.files);
    state.selectedFiles[category] = [];
    
    // Validate files
    let validFiles = [];
    let invalidFiles = [];
    
    files.forEach(file => {
        const validation = validateFile(file);
        if (validation.valid) {
            validFiles.push(file);
            state.selectedFiles[category].push(file);
        } else {
            invalidFiles.push({ file, error: validation.error });
        }
    });
    
    // Display file list
    if (filesList) {
        filesList.innerHTML = '';
        
        validFiles.forEach((file, index) => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            fileItem.innerHTML = `
                <div class="file-info">
                    <i class="fas fa-file"></i>
                    <span class="file-name">${file.name}</span>
                    <span class="file-size">${(file.size / 1024).toFixed(2)} KB</span>
                </div>
                <button class="btn-remove" onclick="removeFile('${category}', ${index})">
                    <i class="fas fa-times"></i>
                </button>
            `;
            filesList.appendChild(fileItem);
        });
        
        invalidFiles.forEach(({ file, error }) => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item file-item-error';
            fileItem.innerHTML = `
                <div class="file-info">
                    <i class="fas fa-exclamation-triangle"></i>
                    <span class="file-name">${file.name}</span>
                    <span class="file-error">${error}</span>
                </div>
            `;
            filesList.appendChild(fileItem);
        });
    }
    
    // Update summary
    if (summary) {
        const totalSize = validFiles.reduce((sum, f) => sum + f.size, 0);
        summary.innerHTML = `
            <strong>${validFiles.length}</strong> file(s) selected
            <span style="margin-left: 1rem;">Total: <strong>${(totalSize / 1024 / 1024).toFixed(2)} MB</strong></span>
        `;
    }
    
    // Enable/disable upload button
    if (uploadBtn) {
        uploadBtn.disabled = validFiles.length === 0;
    }
    
    if (invalidFiles.length > 0) {
        updateMessage(category, `${invalidFiles.length} file(s) rejected. Check file types and sizes.`, 'error');
    } else {
        clearMessage(category);
    }
}

function removeFile(category, index) {
    state.selectedFiles[category].splice(index, 1);
    const input = document.getElementById(`${category}FileInput`);
    if (input) {
        const dt = new DataTransfer();
        state.selectedFiles[category].forEach(file => dt.items.add(file));
        input.files = dt.files;
    }
    handleFileSelection(category);
}

function clearFiles(category) {
    state.selectedFiles[category] = [];
    const input = document.getElementById(`${category}FileInput`);
    if (input) input.value = '';
    const filesList = document.getElementById(`${category}FilesList`);
    if (filesList) filesList.innerHTML = '';
    const summary = document.getElementById(`${category}FileSummary`);
    if (summary) summary.innerHTML = '';
    const uploadBtn = document.getElementById(`${category}UploadBtn`);
    if (uploadBtn) uploadBtn.disabled = true;
    clearMessage(category);
}

// ==================== UPLOAD LOGIC ====================

async function uploadFiles(category) {
    const files = state.selectedFiles[category];
    
    if (!files || files.length === 0) {
        updateMessage(category, 'No files selected', 'error');
        return;
    }
    
    if (!state.githubToken && !state.backendAvailable) {
        updateMessage(category, 'GitHub token required. Backend offline.', 'error');
        return;
    }
    
    const uploadBtn = document.getElementById(`${category}UploadBtn`);
    const cancelBtn = document.getElementById(`${category}CancelBtn`);
    
    try {
        // Disable buttons
        if (uploadBtn) {
            uploadBtn.disabled = true;
            uploadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...';
        }
        if (cancelBtn) cancelBtn.style.display = 'inline-block';
        
        updateMessage(category, 'Detecting next model number...', 'info');
        
        // Get next model number
        const modelNumber = await getNextModelNumber(category);
        const folderName = generateFolderName(modelNumber);
        const categoryPath = CONFIG.CATEGORIES[category];
        const basePath = `${CONFIG.BASE_PATH}/${categoryPath}/${folderName}`;
        
        updateMessage(category, `Uploading to ${folderName}...`, 'info');
        
        // Prepare file metadata for README
        const fileMetadata = files.map(file => ({
            name: renameFile(file.originalName || file.name, category, modelNumber),
            size: file.size
        }));
        
        // Upload files with auto-rename
        let uploadedCount = 0;
        for (const file of files) {
            const newFileName = renameFile(file.name, category, modelNumber);
            const filePath = `${basePath}/${newFileName}`;
            const commitMessage = `Upload ${newFileName} to ${folderName} (${category})`;
            
            updateMessage(category, `Uploading ${newFileName}... (${uploadedCount + 1}/${files.length})`, 'info');
            
            await uploadFileToGitHub(file, filePath, commitMessage);
            uploadedCount++;
        }
        
        // Generate and upload README
        updateMessage(category, 'Generating README.md...', 'info');
        const readmeContent = generateREADME(fileMetadata, category, modelNumber);
        const readmeBlob = new Blob([readmeContent], { type: 'text/markdown' });
        const readmeFile = new File([readmeBlob], 'README.md');
        const readmePath = `${basePath}/README.md`;
        
        await uploadFileToGitHub(readmeFile, readmePath, `Generate README for ${folderName}`);
        
        // Success!
        updateMessage(category, `✅ Successfully uploaded ${uploadedCount} file(s) to ${folderName}!`, 'success');
        showNotification(`${folderName} created successfully!`, 'success');
        
        // Clear files
        clearFiles(category);
        
        // Update model count
        await updateModelCounts();
        
    } catch (error) {
        console.error('Upload error:', error);
        updateMessage(category, `Upload failed: ${error.message}`, 'error');
        showNotification(`Upload failed: ${error.message}`, 'error', 5000);
    } finally {
        // Re-enable buttons
        if (uploadBtn) {
            uploadBtn.disabled = false;
            uploadBtn.innerHTML = '<i class="fas fa-upload"></i> Upload to GitHub';
        }
        if (cancelBtn) cancelBtn.style.display = 'none';
    }
}

// ==================== MODEL COUNTS ====================

async function updateModelCounts() {
    for (const category of Object.keys(CONFIG.CATEGORIES)) {
        const folders = await getCategoryFolders(category);
        state.modelCounts[category] = folders.length;
        
        // Update UI if elements exist
        const countEl = document.getElementById(`${category}Count`);
        if (countEl) {
            countEl.textContent = folders.length;
        }
    }
}

// ==================== TAB SWITCHING ====================

function switchTab(tabId) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active from all buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    const selectedTab = document.getElementById(tabId);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    
    // Activate button
    const activeBtn = document.querySelector(`[onclick="switchTab('${tabId}')"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
    
    // Update current category
    if (tabId.startsWith('upload-')) {
        state.currentCategory = tabId.replace('upload-', '');
    }
}

// ==================== INITIALIZATION ====================

document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 SOLIDWORKS Upload Manager V2 initialized');
    
    // Load saved token
    loadSavedToken();
    
    // Setup file input listeners
    ['basic', 'intermediate', 'pro', 'paid'].forEach(category => {
        const input = document.getElementById(`${category}FileInput`);
        if (input) {
            input.addEventListener('change', () => handleFileSelection(category));
        }
        
        // Setup drag & drop
        const uploadZone = document.getElementById(`${category}UploadZone`);
        if (uploadZone) {
            uploadZone.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadZone.classList.add('drag-over');
            });
            
            uploadZone.addEventListener('dragleave', () => {
                uploadZone.classList.remove('drag-over');
            });
            
            uploadZone.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadZone.classList.remove('drag-over');
                const input = document.getElementById(`${category}FileInput`);
                if (input) {
                    input.files = e.dataTransfer.files;
                    handleFileSelection(category);
                }
            });
        }
    });
    
    // Load model counts
    await updateModelCounts();
    
    // Check GitHub token
    const savedToken = localStorage.getItem('github_token');
    if (savedToken) {
        state.githubToken = savedToken;
        showNotification('GitHub token loaded from localStorage', 'success');
    }
});

// ==================== TOKEN MANAGEMENT ====================

function handleTokenInput() {
    const input = document.getElementById('githubTokenInput');
    const indicator = document.getElementById('tokenIndicator');
    const saveBtn = document.getElementById('saveTokenBtn');
    
    if (input && indicator) {
        if (input.value.trim().startsWith('ghp_') && input.value.trim().length > 20) {
            indicator.style.background = '#ffc107'; // Yellow - needs save
            if (saveBtn) saveBtn.disabled = false;
        } else {
            indicator.style.background = '#dc3545'; // Red - invalid
            if (saveBtn) saveBtn.disabled = true;
        }
    }
}

function saveToken() {
    const input = document.getElementById('githubTokenInput');
    const indicator = document.getElementById('tokenIndicator');
    
    if (!input || !input.value.trim()) {
        showNotification('Please enter a valid GitHub token', 'error');
        return;
    }
    
    const token = input.value.trim();
    
    if (!token.startsWith('ghp_')) {
        showNotification('Invalid token format. Must start with "ghp_"', 'error');
        return;
    }
    
    // Save to localStorage
    localStorage.setItem('github_token', token);
    state.githubToken = token;
    
    if (indicator) {
        indicator.style.background = '#00cc00'; // Green - saved
    }
    
    showNotification('GitHub token saved successfully!', 'success');
}

function clearToken() {
    const input = document.getElementById('githubTokenInput');
    const indicator = document.getElementById('tokenIndicator');
    
    if (confirm('Are you sure you want to clear the saved GitHub token?')) {
        localStorage.removeItem('github_token');
        state.githubToken = '';
        
        if (input) input.value = '';
        if (indicator) indicator.style.background = '#dc3545';
        
        showNotification('GitHub token cleared', 'info');
    }
}

function loadSavedToken() {
    const input = document.getElementById('githubTokenInput');
    const indicator = document.getElementById('tokenIndicator');
    const savedToken = localStorage.getItem('github_token');
    
    if (savedToken && input && indicator) {
        input.value = savedToken;
        state.githubToken = savedToken;
        indicator.style.background = '#00cc00'; // Green
        showNotification('Saved token loaded', 'success', 2000);
    }
}

// Export functions to window for onclick handlers
window.uploadFiles = uploadFiles;
window.clearFiles = clearFiles;
window.removeFile = removeFile;
window.switchTab = switchTab;
window.handleTokenInput = handleTokenInput;
window.saveToken = saveToken;
window.clearToken = clearToken;
