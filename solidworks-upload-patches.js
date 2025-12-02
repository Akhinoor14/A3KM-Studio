// Additional patches for SOLIDWORKS Upload Manager
// Add these functions to solidworks-upload-manager.html before closing </script>

// 1. Empty folder check for update
function patchLoadFilesForUpdate_EmptyCheck() {
    const originalCode = `
                fileSelect.innerHTML = '<option value="">-- Select file to replace --</option>';
                files.forEach(file => {
                    const option = document.createElement('option');
                    option.value = file.path;
                    option.textContent = file.name;
                    option.setAttribute('data-sha', file.sha);
                    fileSelect.appendChild(option);
                });
                fileSelect.disabled = false;
    `;
    
    const newCode = `
                fileSelect.innerHTML = '<option value="">-- Select file to replace --</option>';
                
                if (files.length === 0) {
                    fileSelect.innerHTML = '<option value="">-- No files found --</option>';
                    showMessage('update', \`No files in \${day}\`, 'warning');
                } else {
                    files.forEach(file => {
                        const option = document.createElement('option');
                        option.value = file.path;
                        option.textContent = file.name;
                        option.setAttribute('data-sha', file.sha);
                        fileSelect.appendChild(option);
                    });
                }
                fileSelect.disabled = false;
    `;
}

// 2. Empty folder check for delete
function patchLoadFilesForDelete_EmptyCheck() {
    const originalCode = `
                fileSelect.innerHTML = '<option value="">-- Select file to delete --</option>';
                files.forEach(file => {
                    const option = document.createElement('option');
                    option.value = file.path;
                    option.textContent = file.name;
                    option.setAttribute('data-sha', file.sha);
                    fileSelect.appendChild(option);
                });
                fileSelect.disabled = false;
    `;
    
    const newCode = `
                fileSelect.innerHTML = '<option value="">-- Select file to delete --</option>';
                
                if (files.length === 0) {
                    fileSelect.innerHTML = '<option value="">-- No files found --</option>';
                    showMessage('delete', \`No files in \${day}\`, 'warning');
                } else {
                    files.forEach(file => {
                        const option = document.createElement('option');
                        option.value = file.path;
                        option.textContent = file.name;
                        option.setAttribute('data-sha', file.sha);
                        fileSelect.appendChild(option);
                    });
                }
                fileSelect.disabled = false;
    `;
}

// 3. Add getExistingFiles helper (add before fetchAllFilesRecursive)
async function getExistingFiles(basePath, day, token) {
    try {
        const owner = 'Akhinoor14';
        const repo = 'SOLIDWORKS-Projects';
        const files = await fetchAllFilesRecursive(
            `https://api.github.com/repos/${owner}/${repo}/contents/${basePath}/${day}`,
            {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        );
        return files;
    } catch (error) {
        return []; // Folder doesn't exist yet
    }
}

// 4. Duplicate check for CW/HW uploads (add after basePath declaration in uploadFiles)
async function checkDuplicatesBeforeUpload() {
    const existingFiles = await getExistingFiles(basePath, day, token);
    const duplicates = files.filter(file => 
        existingFiles.some(existing => existing.name === file.name)
    );
    
    if (duplicates.length > 0) {
        const confirmOverwrite = confirm(
            `⚠️ ${duplicates.length} file(s) already exist:\n\n${duplicates.map(f => '• ' + f.name).join('\n')}\n\nOverwrite?`
        );
        if (!confirmOverwrite) {
            showMessage(type, 'Upload cancelled', 'info');
            if (uploadBtn) {
                uploadBtn.disabled = false;
                uploadBtn.innerHTML = '<i class="fas fa-upload"></i> Upload to GitHub';
            }
            return false; // Cancel upload
        }
    }
    return true; // Continue upload
}

// 5. Solo project exists check (add before solo upload starts)
async function checkSoloProjectExists(projectName, token) {
    try {
        const owner = 'Akhinoor14';
        const repo = 'SOLIDWORKS-Projects';
        const response = await fetch(
            `https://api.github.com/repos/${owner}/${repo}/contents/Solo/${projectName}`,
            {
                headers: {
                    'Authorization': `token ${token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            }
        );
        
        if (response.ok) {
            return confirm(`⚠️ Project "${projectName}" already exists.\n\nAdd files to existing project?`);
        }
        return true;
    } catch (error) {
        return true; // Doesn't exist, continue
    }
}

// USAGE INSTRUCTIONS:
// 1. Copy getExistingFiles function and paste before fetchAllFilesRecursive
// 2. In uploadFiles function, after 'const basePath = type.toUpperCase();', add duplicate check
// 3. In uploadSoloProject, after token check, add solo project exists check
// 4. Replace update/delete file select forEach with empty check versions
