/**
 * SOLIDWORKS Upload Manager - BOSS ONLY (OPTIONAL)
 * 
 * ⚠️ VISITORS DON'T NEED THIS - Gallery pages work without API!
 * 
 * This file is ONLY for YOU (the owner) to upload new models via dashboard.
 * 
 * TWO OPTIONS:
 * 1. Use this system (requires GitHub token, auto folder numbering)
 * 2. Upload directly via GitHub website (easier, no setup needed)
 * 
 * Gallery pages already use direct file paths - unlimited requests for visitors!
 * 
 * A3KM Studio - Md Akhinoor Islam
 */

// ==================== Configuration ====================
const SOLIDWORKS_CONFIG = {
    owner: 'Akhinoor14',
    repo: 'A3KM-Studio',
    basePath: 'Solidwork Projects',
    categories: {
        basic: 'Basic (Practice) Models',
        intermediate: 'Intermediate (Practice) Models',
        pro: 'Pro (Practice) Models',
        paid: 'Paid (Selled) Models'
    },
    allowedExtensions: ['.glb', '.gltf', '.sldprt', '.sldasm', '.slddrw', '.pdf', '.png', '.jpg', '.jpeg', '.txt', '.md'],
    maxFileSize: 100 * 1024 * 1024 // 100MB
};

// ==================== State Management ====================
let currentCategory = 'basic';
let nextModelNumber = null;
let uploadQueue = [];
let isUploading = false;

// ==================== GitHub API Helper ====================
async function githubAPI(endpoint, method = 'GET', body = null) {
    const token = getGitHubToken();
    if (!token) {
        throw new Error('GitHub token not found. Please configure token first.');
    }

    const url = `https://api.github.com${endpoint}`;
    const options = {
        method,
        headers: {
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
        }
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);
    
    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `GitHub API error: ${response.status}`);
    }

    return response.json();
}

function getGitHubToken() {
    return localStorage.getItem('github_token') || sessionStorage.getItem('github_token');
}

function setGitHubToken(token, remember = false) {
    if (remember) {
        localStorage.setItem('github_token', token);
        sessionStorage.removeItem('github_token');
    } else {
        sessionStorage.setItem('github_token', token);
        localStorage.removeItem('github_token');
    }
}

async function validateToken(token) {
    try {
        const response = await fetch('https://api.github.com/user', {
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        return response.ok;
    } catch {
        return false;
    }
}

function updateUploadProgress(percentage, totalFiles, message) {
    const progressBar = document.getElementById('sw-upload-progress-bar');
    const progressText = document.getElementById('sw-upload-progress-text');
    
    if (progressBar) {
        progressBar.style.width = `${percentage}%`;
    }
    
    if (progressText) {
        progressText.textContent = message;
    }
}

// ==================== Folder Detection Logic ====================
async function detectNextModelNumber(category) {
    try {
        const categoryPath = SOLIDWORKS_CONFIG.categories[category];
        const fullPath = `${SOLIDWORKS_CONFIG.basePath}/${categoryPath}`;
        
        // Get all folders in category
        const contents = await githubAPI(
            `/repos/${SOLIDWORKS_CONFIG.owner}/${SOLIDWORKS_CONFIG.repo}/contents/${encodeURIComponent(fullPath)}`
        );

        // Filter Model folders
        const modelFolders = contents
            .filter(item => item.type === 'dir' && item.name.match(/^Model \d+$/))
            .map(item => {
                const match = item.name.match(/^Model (\d+)$/);
                return match ? parseInt(match[1]) : 0;
            })
            .sort((a, b) => b - a); // Sort descending

        // Get highest number, default to 0 if empty
        const lastNumber = modelFolders.length > 0 ? modelFolders[0] : 0;
        return lastNumber + 1;

    } catch (error) {
        console.warn('Error detecting model number:', error);
        // If folder doesn't exist or error, start from 1
        return 1;
    }
}

// ==================== File Renaming Logic ====================
function generateFileName(originalName, modelNumber, category) {
    const extension = originalName.substring(originalName.lastIndexOf('.'));
    const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
    return `Model ${String(modelNumber).padStart(2, '0')} ${categoryName}${extension}`;
}

// ==================== File Upload Logic ====================
async function uploadFileToGitHub(file, modelNumber, category) {
    const reader = new FileReader();
    
    return new Promise((resolve, reject) => {
        reader.onload = async () => {
            try {
                const content = btoa(
                    new Uint8Array(reader.result)
                        .reduce((data, byte) => data + String.fromCharCode(byte), '')
                );

                const newFileName = generateFileName(file.name, modelNumber, category);
                const categoryPath = SOLIDWORKS_CONFIG.categories[category];
                const modelFolder = `Model ${String(modelNumber).padStart(2, '0')}`;
                const filePath = `${SOLIDWORKS_CONFIG.basePath}/${categoryPath}/${modelFolder}/${newFileName}`;

                await githubAPI(
                    `/repos/${SOLIDWORKS_CONFIG.owner}/${SOLIDWORKS_CONFIG.repo}/contents/${encodeURIComponent(filePath)}`,
                    'PUT',
                    {
                        message: `Add ${newFileName} to ${modelFolder}`,
                        content: content,
                        branch: 'main'
                    }
                );

                resolve({ success: true, fileName: newFileName, filePath });
            } catch (error) {
                reject(error);
            }
        };

        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsArrayBuffer(file);
    });
}

// ==================== README Generator ====================
function generateReadme(modelNumber, category, fileList) {
    const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
    const date = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });

    return `# Model ${String(modelNumber).padStart(2, '0')} - ${categoryName}

**Category:** ${categoryName} Practice Models  
**Model Number:** ${modelNumber}  
**Upload Date:** ${date}  
**Total Files:** ${fileList.length}

## Files Included

${fileList.map(f => `- ${f.name} (${(f.size / 1024).toFixed(2)} KB)`).join('\n')}

## Description

This model is part of the ${categoryName} category in the SOLIDWORKS portfolio.

## 3D Viewing

${fileList.some(f => f.name.toLowerCase().endsWith('.glb')) ? '✅ 3D viewer available (GLB file included)' : '⚠️ No GLB file - 3D viewer not available'}

---

*Auto-generated by A3KM Studio Upload Manager*
`;
}

async function uploadReadme(modelNumber, category, fileList) {
    const readme = generateReadme(modelNumber, category, fileList);
    const content = btoa(unescape(encodeURIComponent(readme)));
    
    const categoryPath = SOLIDWORKS_CONFIG.categories[category];
    const modelFolder = `Model ${String(modelNumber).padStart(2, '0')}`;
    const filePath = `${SOLIDWORKS_CONFIG.basePath}/${categoryPath}/${modelFolder}/README.md`;

    await githubAPI(
        `/repos/${SOLIDWORKS_CONFIG.owner}/${SOLIDWORKS_CONFIG.repo}/contents/${encodeURIComponent(filePath)}`,
        'PUT',
        {
            message: `Add README for ${modelFolder}`,
            content: content,
            branch: 'main'
        }
    );
}

// ==================== Upload Queue Processor ====================
async function processUploadQueue() {
    if (isUploading || uploadQueue.length === 0) return;
    
    isUploading = true;
    const totalFiles = uploadQueue.length;
    let completed = 0;
    let failed = 0;
    const uploadedFiles = [];

    updateUploadProgress(0, totalFiles, 'Starting upload...');

    try {
        // Detect next model number
        nextModelNumber = await detectNextModelNumber(currentCategory);
        updateUploadProgress(5, totalFiles, `Creating Model ${nextModelNumber}...`);

        // Upload each file
        for (const file of uploadQueue) {
            try {
                updateUploadProgress(
                    10 + (completed / totalFiles) * 80,
                    totalFiles,
                    `Uploading ${file.name}... (${completed + 1}/${totalFiles})`
                );

                const result = await uploadFileToGitHub(file, nextModelNumber, currentCategory);
                uploadedFiles.push({ name: result.fileName, size: file.size });
                completed++;
                
                updateFileStatus(file.name, 'success');
            } catch (error) {
                console.error(`Failed to upload ${file.name}:`, error);
                failed++;
                updateFileStatus(file.name, 'failed', error.message);
            }
        }

        // Generate README
        if (uploadedFiles.length > 0) {
            updateUploadProgress(90, totalFiles, 'Generating README...');
            await uploadReadme(nextModelNumber, currentCategory, uploadedFiles);
        }

        // Complete
        updateUploadProgress(100, totalFiles, `Upload complete! ${completed} succeeded, ${failed} failed.`);
        
        if (completed > 0) {
            showSuccessNotification(nextModelNumber, currentCategory, completed);
            
            // Trigger real-time update
            await triggerRealTimeUpdate(currentCategory);
        }

    } catch (error) {
        console.error('Upload process error:', error);
        showErrorNotification(error.message);
    } finally {
        isUploading = false;
        uploadQueue = [];
        
        // Reset after 3 seconds
        setTimeout(() => {
            resetUploadPanel();
        }, 3000);
    }
}

// ==================== Real-time Update Trigger ====================
async function triggerRealTimeUpdate(category) {
    // Broadcast update event
    const event = new CustomEvent('solidworks-update', {
        detail: { category, timestamp: Date.now() }
    });
    window.dispatchEvent(event);
    
    // Invalidate cache
    const cacheKey = `solidworks_models_${category}`;
    sessionStorage.removeItem(cacheKey);
    localStorage.removeItem(cacheKey);
}

// ==================== File Validation ====================
function validateFiles(files) {
    const errors = [];
    
    for (const file of files) {
        const extension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
        
        if (!SOLIDWORKS_CONFIG.allowedExtensions.includes(extension)) {
            errors.push(`${file.name}: Invalid file type (${extension})`);
        }
        
        if (file.size > SOLIDWORKS_CONFIG.maxFileSize) {
            errors.push(`${file.name}: File too large (max 100MB)`);
        }
    }
    
    return errors;
}

// ==================== UI Update Functions ====================
function updateUploadProgress(percent, total, message) {
    const progressBar = document.getElementById('sw-upload-progress-bar');
    const progressText = document.getElementById('sw-upload-progress-text');
    
    if (progressBar) progressBar.style.width = `${percent}%`;
    if (progressText) progressText.textContent = message;
}

function updateFileStatus(fileName, status, error = '') {
    const fileList = document.getElementById('sw-file-preview-list');
    if (!fileList) return;
    
    const fileItem = Array.from(fileList.children).find(item => 
        item.querySelector('.file-name')?.textContent === fileName
    );
    
    if (fileItem) {
        const statusIcon = fileItem.querySelector('.file-status');
        if (statusIcon) {
            if (status === 'success') {
                statusIcon.innerHTML = '<i class="fas fa-check-circle" style="color: #00ff00;"></i>';
            } else if (status === 'failed') {
                statusIcon.innerHTML = `<i class="fas fa-times-circle" style="color: #ff0000;" title="${error}"></i>`;
            }
        }
    }
}

function showSuccessNotification(modelNumber, category, fileCount) {
    const notification = document.createElement('div');
    notification.className = 'sw-success-notification';
    notification.innerHTML = `
        <div style="background: linear-gradient(135deg, #00ff00, #00cc00); color: #000; padding: 20px; border-radius: 12px; box-shadow: 0 8px 32px rgba(0, 255, 0, 0.4); max-width: 400px; margin: 20px auto;">
            <h3 style="margin: 0 0 12px 0; font-size: 1.3rem;"><i class="fas fa-check-circle"></i> Upload Successful!</h3>
            <p style="margin: 0; font-size: 1rem; line-height: 1.6;">
                <strong>Model ${modelNumber}</strong> created in <strong>${category}</strong> category.<br>
                ${fileCount} file(s) uploaded successfully.
            </p>
            <div style="margin-top: 16px; display: flex; gap: 10px;">
                <a href="solidworks-${category}.html" style="flex: 1; padding: 10px; background: #000; color: #00ff00; text-align: center; border-radius: 8px; text-decoration: none; font-weight: 600;">
                    View Gallery
                </a>
                <button onclick="this.closest('.sw-success-notification').remove()" style="flex: 1; padding: 10px; background: rgba(0,0,0,0.3); color: #000; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">
                    Close
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.remove(), 10000);
}

function showErrorNotification(message) {
    alert(`Upload Error: ${message}`);
}

function resetUploadPanel() {
    const fileInput = document.getElementById('sw-file-input');
    const fileList = document.getElementById('sw-file-preview-list');
    const progressBar = document.getElementById('sw-upload-progress-bar');
    const progressText = document.getElementById('sw-upload-progress-text');
    
    if (fileInput) fileInput.value = '';
    if (fileList) fileList.innerHTML = '';
    if (progressBar) progressBar.style.width = '0%';
    if (progressText) progressText.textContent = 'Ready to upload';
}

// ==================== Export Functions ====================
window.SolidworksUploadManager = {
    setCategory: (category) => { currentCategory = category; },
    addFiles: (files) => { uploadQueue.push(...files); },
    startUpload: processUploadQueue,
    validateFiles,
    detectNextModelNumber,
    setToken: setGitHubToken,
    getToken: getGitHubToken,
    validateToken,
    clearQueue: () => { uploadQueue = []; }
};

console.log('✅ SOLIDWORKS Upload Manager loaded');
