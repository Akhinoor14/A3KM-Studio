// Certificate Manager with GitHub Integration
// Complete rewrite with proper error handling, progress tracking, and GitHub API

let certificatesData = null;
let selectedFile = null;
let githubUploader = null;

// GitHub Configuration
const GITHUB_CONFIG = {
  owner: 'Akhinoor14',
  repo: 'A3KM-Studio',
  jsonPath: 'About me/certificates-data.json',
  certificatesBasePath: 'About me/CERTIFICATES'
};

// Subcategory mappings
const subcategories = {
  Academic: ['PSC', 'JSC', 'SSC', 'HSC', 'BSc', 'MSc', 'PhD', 'Other'],
  Skill: ['Programming', 'Design', 'AI Tools', 'Languages', 'Soft Skills', 'Other'],
  Medical: ['Vaccination', 'Reports', 'Legal', 'Other']
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
  try {
    await loadCertificatesData();
    loadCertificatesList();
    updateStats();
    loadFolderStructure();
  } catch (error) {
    console.error('Initialization error:', error);
    showStatus('uploadStatus', 'Error loading certificates data: ' + error.message, 'error');
  }
});

// ==================== GITHUB INTEGRATION ====================

/**
 * Initialize GitHub uploader with token
 */
function initializeGitHub(token) {
  if (!token || token === '') {
    throw new Error('GitHub token is required');
  }
  
  if (typeof GitHubContentUploader === 'undefined') {
    throw new Error('GitHubContentUploader not loaded. Please check if github-content-uploader.js is included.');
  }
  
  githubUploader = new GitHubContentUploader({
    token: token,
    owner: GITHUB_CONFIG.owner,
    repo: GITHUB_CONFIG.repo
  });
  
  return githubUploader;
}

/**
 * Load certificates data from GitHub
 */
async function loadCertificatesData() {
  try {
    const response = await fetch(`https://raw.githubusercontent.com/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/main/${GITHUB_CONFIG.jsonPath}?${Date.now()}`);
    
    if (!response.ok) {
      throw new Error(`Failed to load certificates data: ${response.status}`);
    }
    
    certificatesData = await response.json();
    console.log('Certificates data loaded:', certificatesData);
  } catch (error) {
    console.error('Error loading certificates data:', error);
    // Initialize with empty structure if file doesn't exist
    certificatesData = {
      lastUpdated: new Date().toISOString(),
      categories: {
        Academic: {
          displayName: "Academic Certificates",
          icon: "fa-graduation-cap",
          description: "Educational certificates and marksheets",
          certificates: []
        },
        Medical: {
          displayName: "Medical Certificates",
          icon: "fa-heart-pulse",
          description: "Health documents and medical records",
          certificates: []
        },
        Skill: {
          displayName: "Skill Certificates",
          icon: "fa-award",
          description: "Professional skills and certifications",
          certificates: []
        }
      },
      stats: {
        totalCertificates: 0,
        academicCount: 0,
        medicalCount: 0,
        skillCount: 0
      }
    };
  }
}

/**
 * Save certificates data to GitHub
 */
async function saveCertificatesToGitHub(uploader) {
  await uploader.replaceJSON(
    GITHUB_CONFIG.jsonPath,
    certificatesData,
    'Update certificates data'
  );
  
  console.log('Certificates data saved to GitHub');
}

/**
 * Upload certificate file to GitHub
 */
async function uploadCertificateFile(uploader, file, filePath) {
  const reader = new FileReader();
  
  return new Promise((resolve, reject) => {
    reader.onload = async (e) => {
      try {
        const content = e.target.result.split(',')[1]; // Get base64 content
        
        await uploader.uploadFile(
          filePath,
          content,
          `Upload certificate: ${file.name}`
        );
        
        resolve();
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ==================== FORM HANDLING ====================

/**
 * Handle file selection
 */
function handleFileSelect(event) {
  const file = event.target.files[0];
  if (!file) return;

  // Validate file type
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
  if (!validTypes.includes(file.type)) {
    showStatus('uploadStatus', 'Invalid file type. Please upload JPG, PNG, or PDF only.', 'error');
    event.target.value = '';
    return;
  }

  // Validate file size (max 10MB)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    showStatus('uploadStatus', 'File too large. Maximum size is 10MB.', 'error');
    event.target.value = '';
    return;
  }

  selectedFile = file;
  const preview = document.getElementById('filePreview');
  preview.style.display = 'block';

  const fileType = file.type;
  const fileSize = (file.size / 1024 / 1024).toFixed(2); // MB

  let previewContent = `
    <p><strong>File:</strong> ${file.name}</p>
    <p><strong>Size:</strong> ${fileSize} MB</p>
    <p><strong>Type:</strong> ${file.type}</p>
  `;

  // Show image preview for images
  if (fileType.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = (e) => {
      previewContent += `<br><img src="${e.target.result}" alt="Preview" style="max-width: 200px; max-height: 200px; border-radius: 8px;">`;
      preview.innerHTML = previewContent;
    };
    reader.readAsDataURL(file);
  } else {
    preview.innerHTML = previewContent;
  }
}

/**
 * Update subcategories based on category
 */
function updateSubcategories() {
  const category = document.getElementById('certCategory').value;
  const subcategorySelect = document.getElementById('certSubcategory');
  
  subcategorySelect.innerHTML = '<option value="">Select Subcategory</option>';
  
  if (category && subcategories[category]) {
    subcategories[category].forEach(sub => {
      const option = document.createElement('option');
      option.value = sub;
      option.textContent = sub;
      subcategorySelect.appendChild(option);
    });
  }
}

/**
 * Upload form submission
 */
document.getElementById('uploadForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const progressContainer = document.getElementById('progressContainer');
  const progressFill = document.getElementById('progressBarFill');
  const progressText = document.getElementById('progressText');
  
  try {
    // Validate GitHub token
    const token = document.getElementById('githubToken').value.trim();
    if (!token || token === '') {
      showStatus('uploadStatus', '❌ Please enter your GitHub token', 'error');
      return;
    }
    
    // Validate file
    if (!selectedFile) {
      showStatus('uploadStatus', '❌ Please select a file', 'error');
      return;
    }
    
    // Show progress
    progressContainer.style.display = 'block';
    progressFill.style.width = '0%';
    progressText.textContent = 'Initializing...';
    
    // Initialize GitHub uploader
    progressText.textContent = 'Connecting to GitHub...';
    progressFill.style.width = '10%';
    const uploader = initializeGitHub(token);
    
    // Get form data
    const formData = {
      title: document.getElementById('certTitle').value.trim(),
      issuer: document.getElementById('certIssuer').value.trim(),
      category: document.getElementById('certCategory').value,
      subcategory: document.getElementById('certSubcategory').value,
      date: document.getElementById('certDate').value.trim(),
      tags: document.getElementById('certTags').value.split(',').map(t => t.trim()).filter(t => t),
      description: document.getElementById('certDescription').value.trim(),
      verified: document.getElementById('certVerified').checked,
      featured: document.getElementById('certFeatured').checked
    };
    
    // Validate required fields
    if (!formData.title || !formData.category || !formData.subcategory) {
      showStatus('uploadStatus', '❌ Please fill all required fields', 'error');
      progressContainer.style.display = 'none';
      return;
    }
    
    // Generate certificate object
    progressText.textContent = 'Generating certificate data...';
    progressFill.style.width = '20%';
    const certificate = createCertificateObject(formData, selectedFile);
    
    // Check for duplicates
    progressText.textContent = 'Checking for duplicates...';
    progressFill.style.width = '30%';
    const duplicate = checkDuplicate(certificate);
    if (duplicate) {
      const confirmOverwrite = confirm(`⚠️ A certificate with ID "${certificate.id}" already exists.\n\nTitle: ${duplicate.title}\nCategory: ${duplicate.category}\n\nDo you want to overwrite it?`);
      if (!confirmOverwrite) {
        progressContainer.style.display = 'none';
        return;
      }
    }
    
    // Upload file to GitHub
    progressText.textContent = 'Uploading file to GitHub...';
    progressFill.style.width = '50%';
    await uploadCertificateFile(uploader, selectedFile, certificate.filePath);
    
    // Add/update certificate in data
    progressText.textContent = 'Updating certificates database...';
    progressFill.style.width = '70%';
    addCertificateToData(certificate);
    
    // Save JSON to GitHub
    progressText.textContent = 'Saving to GitHub...';
    progressFill.style.width = '85%';
    await saveCertificatesToGitHub(uploader);
    
    // Complete
    progressFill.style.width = '100%';
    progressText.textContent = 'Upload complete!';
    
    showStatus('uploadStatus', '✅ Certificate uploaded successfully!', 'success');
    
    // Reset form
    setTimeout(() => {
      document.getElementById('uploadForm').reset();
      document.getElementById('filePreview').style.display = 'none';
      progressContainer.style.display = 'none';
      selectedFile = null;
      
      // Refresh lists
      loadCertificatesList();
      updateStats();
      loadFolderStructure();
    }, 2000);
    
  } catch (error) {
    console.error('Upload error:', error);
    progressContainer.style.display = 'none';
    showStatus('uploadStatus', `❌ Upload failed: ${error.message}`, 'error');
  }
});

// ==================== CERTIFICATE MANAGEMENT ====================

/**
 * Create certificate object
 */
function createCertificateObject(formData, file) {
  const id = generateId(formData.title);
  const fileExtension = file.name.split('.').pop().toLowerCase();
  const fileName = `${formData.title.replace(/[^a-zA-Z0-9]/g, '-')}.${fileExtension}`;
  const folderPath = `${GITHUB_CONFIG.certificatesBasePath}/${formData.category}/${formData.subcategory}`;
  
  return {
    id: id,
    title: formData.title,
    category: formData.category,
    subcategory: formData.subcategory,
    issuedBy: formData.issuer,
    issuedDate: formData.date,
    fileType: fileExtension,
    fileName: fileName,
    filePath: `${folderPath}/${fileName}`,
    thumbnail: `${folderPath}/${fileName}`, // Use same file as thumbnail for images
    description: formData.description,
    tags: formData.tags,
    verified: formData.verified,
    featured: formData.featured,
    uploadedAt: new Date().toISOString()
  };
}

/**
 * Generate unique ID from title
 */
function generateId(title) {
  return title.toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Check for duplicate certificate
 */
function checkDuplicate(certificate) {
  const category = certificate.category;
  if (!certificatesData.categories[category]) return null;
  
  return certificatesData.categories[category].certificates.find(
    cert => cert.id === certificate.id
  );
}

/**
 * Add certificate to data structure
 */
function addCertificateToData(certificate) {
  const category = certificate.category;
  
  // Ensure category exists
  if (!certificatesData.categories[category]) {
    certificatesData.categories[category] = {
      displayName: `${category} Certificates`,
      icon: getIconForCategory(category),
      description: `${category} certificates and documents`,
      certificates: []
    };
  }
  
  // Check if certificate exists
  const existingIndex = certificatesData.categories[category].certificates.findIndex(
    cert => cert.id === certificate.id
  );
  
  if (existingIndex > -1) {
    // Update existing
    certificatesData.categories[category].certificates[existingIndex] = certificate;
  } else {
    // Add new
    certificatesData.categories[category].certificates.push(certificate);
  }
  
  // Update stats
  updateStatsData();
}

/**
 * Get icon for category
 */
function getIconForCategory(category) {
  const icons = {
    Academic: 'fa-graduation-cap',
    Skill: 'fa-award',
    Medical: 'fa-heart-pulse'
  };
  return icons[category] || 'fa-certificate';
}

/**
 * Update stats data
 */
function updateStatsData() {
  let total = 0;
  let academic = 0;
  let skill = 0;
  let medical = 0;
  
  Object.keys(certificatesData.categories).forEach(categoryKey => {
    const count = certificatesData.categories[categoryKey].certificates.length;
    total += count;
    
    if (categoryKey === 'Academic') academic = count;
    else if (categoryKey === 'Skill') skill = count;
    else if (categoryKey === 'Medical') medical = count;
  });
  
  certificatesData.stats = {
    totalCertificates: total,
    academicCount: academic,
    skillCount: skill,
    medicalCount: medical
  };
  
  certificatesData.lastUpdated = new Date().toISOString();
}

// ==================== UI FUNCTIONS ====================

/**
 * Switch tabs
 */
function switchTab(tabName) {
  document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  
  document.getElementById(`${tabName}-tab`).classList.add('active');
  event.target.closest('.tab-btn').classList.add('active');
}

/**
 * Load certificates list for management
 */
function loadCertificatesList() {
  const container = document.getElementById('certificatesList');
  if (!container) return;
  
  container.innerHTML = '';
  
  if (!certificatesData || !certificatesData.categories) {
    container.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">No certificates data available</p>';
    return;
  }
  
  let hasAny = false;
  
  Object.keys(certificatesData.categories).forEach(categoryKey => {
    const category = certificatesData.categories[categoryKey];
    
    if (!category.certificates || category.certificates.length === 0) return;
    
    hasAny = true;
    
    const categorySection = document.createElement('div');
    categorySection.style.marginBottom = '30px';
    categorySection.innerHTML = `
      <h3 style="color: #CC0000; margin: 20px 0 15px 0;">
        <i class="fas ${category.icon}"></i> ${category.displayName}
        <span style="font-size: 0.9rem; color: #666; font-weight: normal;">(${category.certificates.length})</span>
      </h3>
    `;
    
    category.certificates.forEach(cert => {
      const certItem = document.createElement('div');
      certItem.className = 'cert-item';
      certItem.style.cssText = 'display: flex; justify-content: space-between; align-items: center; padding: 15px; background: rgba(0, 0, 0, 0.3); border: 1px solid rgba(204, 0, 0, 0.2); border-radius: 8px; margin-bottom: 10px;';
      
      const badges = [];
      if (cert.verified) badges.push('<span style="background: #27ae60; color: white; padding: 2px 8px; border-radius: 4px; font-size: 0.75rem; margin-left: 10px;">✓ Verified</span>');
      if (cert.featured) badges.push('<span style="background: #f39c12; color: white; padding: 2px 8px; border-radius: 4px; font-size: 0.75rem; margin-left: 5px;">★ Featured</span>');
      
      certItem.innerHTML = `
        <div>
          <h4 style="margin-bottom: 5px; color: #e0e0e0;">
            ${cert.title}
            ${badges.join('')}
          </h4>
          <p style="font-size: 0.9rem; color: #999; margin-bottom: 3px;">
            <i class="fas fa-building"></i> ${cert.issuedBy} • 
            <i class="fas fa-calendar"></i> ${cert.issuedDate} • 
            <i class="fas fa-folder"></i> ${cert.subcategory}
          </p>
          <p style="font-size: 0.85rem; color: #666;">
            <i class="fas fa-file"></i> ${cert.fileName} • ${cert.fileType.toUpperCase()}
          </p>
        </div>
        <div style="display: flex; gap: 10px;">
          <button class="icon-btn icon-btn-edit" onclick="editCertificate('${cert.id}', '${categoryKey}')" title="Edit" style="background: rgba(52, 152, 219, 0.2); color: #3498db; border: 1px solid #3498db; padding: 8px 12px; border-radius: 6px; cursor: pointer;">
            <i class="fas fa-edit"></i>
          </button>
          <button class="icon-btn icon-btn-delete" onclick="deleteCertificate('${cert.id}', '${categoryKey}')" title="Delete" style="background: rgba(231, 76, 60, 0.2); color: #e74c3c; border: 1px solid #e74c3c; padding: 8px 12px; border-radius: 6px; cursor: pointer;">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      `;
      categorySection.appendChild(certItem);
    });
    
    container.appendChild(categorySection);
  });
  
  if (!hasAny) {
    container.innerHTML = '<p style="text-align: center; color: #666; padding: 40px;">No certificates found. Upload your first certificate to get started!</p>';
  }
}

/**
 * Filter certificates by search term
 */
function filterCertificates() {
  const searchTerm = document.getElementById('searchManage')?.value.toLowerCase() || '';
  const certItems = document.querySelectorAll('.cert-item');
  
  certItems.forEach(item => {
    const text = item.textContent.toLowerCase();
    item.style.display = text.includes(searchTerm) ? 'flex' : 'none';
  });
}

/**
 * Edit certificate
 */
function editCertificate(id, category) {
  const cert = certificatesData.categories[category].certificates.find(c => c.id === id);
  if (!cert) return;
  
  // Switch to upload tab
  document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  document.getElementById('upload-tab').classList.add('active');
  document.querySelector('.tab-btn').classList.add('active');
  
  // Populate form
  document.getElementById('certTitle').value = cert.title;
  document.getElementById('certIssuer').value = cert.issuedBy;
  document.getElementById('certCategory').value = cert.category;
  updateSubcategories();
  setTimeout(() => {
    document.getElementById('certSubcategory').value = cert.subcategory;
  }, 100);
  document.getElementById('certDate').value = cert.issuedDate;
  document.getElementById('certTags').value = cert.tags.join(', ');
  document.getElementById('certDescription').value = cert.description || '';
  document.getElementById('certVerified').checked = cert.verified;
  document.getElementById('certFeatured').checked = cert.featured;
  
  showStatus('uploadStatus', `📝 Editing: ${cert.title} (Upload new file to replace, or just update details and submit)`, 'success');
  
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Delete certificate
 */
async function deleteCertificate(id, category) {
  const cert = certificatesData.categories[category].certificates.find(c => c.id === id);
  if (!cert) return;
  
  if (!confirm(`Are you sure you want to delete this certificate?\n\nTitle: ${cert.title}\nIssued by: ${cert.issuedBy}\n\nThis action cannot be undone.`)) {
    return;
  }
  
  try {
    // Get GitHub token
    const token = prompt('Enter your GitHub token to confirm deletion:');
    if (!token) return;
    
    const uploader = initializeGitHub(token);
    
    // Remove from data
    const index = certificatesData.categories[category].certificates.findIndex(c => c.id === id);
    if (index > -1) {
      certificatesData.categories[category].certificates.splice(index, 1);
      updateStatsData();
      
      // Save to GitHub
      await saveCertificatesToGitHub(uploader);
      
      // Try to delete file (optional - may fail if file doesn't exist)
      try {
        await uploader.deleteFile(cert.filePath, `Delete certificate: ${cert.title}`);
      } catch (error) {
        console.warn('Could not delete file:', error);
      }
      
      loadCertificatesList();
      updateStats();
      loadFolderStructure();
      showStatus('manageStatus', '✅ Certificate deleted successfully', 'success');
    }
  } catch (error) {
    console.error('Delete error:', error);
    showStatus('manageStatus', `❌ Failed to delete: ${error.message}`, 'error');
  }
}

/**
 * Update stats display
 */
function updateStats() {
  if (!certificatesData || !certificatesData.stats) return;
  
  document.getElementById('statTotal').textContent = certificatesData.stats.totalCertificates || 0;
  document.getElementById('statAcademic').textContent = certificatesData.stats.academicCount || 0;
  document.getElementById('statSkill').textContent = certificatesData.stats.skillCount || 0;
  document.getElementById('statMedical').textContent = certificatesData.stats.medicalCount || 0;
  
  // Count featured and verified
  let featured = 0;
  let verified = 0;
  Object.keys(certificatesData.categories).forEach(key => {
    if (certificatesData.categories[key].certificates) {
      certificatesData.categories[key].certificates.forEach(cert => {
        if (cert.featured) featured++;
        if (cert.verified) verified++;
      });
    }
  });
  
  document.getElementById('statFeatured').textContent = featured;
  document.getElementById('statVerified').textContent = verified;
}

/**
 * Load folder structure
 */
function loadFolderStructure() {
  const structureElement = document.getElementById('folderStructure');
  if (!structureElement || !certificatesData) return;
  
  let structure = 'About me/CERTIFICATES/\n';
  
  Object.keys(certificatesData.categories).forEach((categoryKey, catIndex) => {
    const category = certificatesData.categories[categoryKey];
    const isLastCat = catIndex === Object.keys(certificatesData.categories).length - 1;
    const catPrefix = isLastCat ? '└── ' : '├── ';
    
    structure += `${catPrefix}${categoryKey}/\n`;
    
    const subcats = new Set();
    if (category.certificates) {
      category.certificates.forEach(cert => {
        subcats.add(cert.subcategory);
      });
    }
    
    const subcatsArray = Array.from(subcats);
    subcatsArray.forEach((subcat, index) => {
      const isLast = index === subcatsArray.length - 1;
      const prefix = isLast ? '└── ' : '├── ';
      const indent = isLastCat ? '    ' : '│   ';
      structure += `${indent}${prefix}${subcat}/\n`;
      
      // Show files in this subcategory
      const files = category.certificates.filter(cert => cert.subcategory === subcat);
      files.forEach((file, fileIndex) => {
        const fileIsLast = fileIndex === files.length - 1;
        const filePrefix = fileIsLast ? '└── ' : '├── ';
        const fileIndent = isLast ? '    ' : '│   ';
        structure += `${indent}${fileIndent}${filePrefix}${file.fileName}\n`;
      });
    });
  });
  
  structureElement.textContent = structure;
}

/**
 * Refresh structure
 */
function refreshStructure() {
  loadFolderStructure();
  showStatus('manageStatus', '✅ Folder structure refreshed', 'success');
}

/**
 * Create new folder (subcategory)
 */
function createNewFolder() {
  const category = prompt('Enter category name (Academic/Skill/Medical):');
  if (!category || !['Academic', 'Skill', 'Medical'].includes(category)) {
    alert('Invalid category. Please choose: Academic, Skill, or Medical');
    return;
  }
  
  const subcategory = prompt(`Enter new subcategory name for ${category}:`);
  if (!subcategory) return;
  
  if (!subcategories[category]) {
    subcategories[category] = [];
  }
  
  const normalized = subcategory.trim();
  if (!subcategories[category].includes(normalized)) {
    subcategories[category].push(normalized);
    alert(`✅ Subcategory "${normalized}" added to ${category}`);
    loadFolderStructure();
    updateSubcategories();
  } else {
    alert('⚠️ Subcategory already exists');
  }
}

/**
 * Export data as JSON
 */
function exportData() {
  const dataStr = JSON.stringify(certificatesData, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(dataBlob);
  link.download = `certificates-data-backup-${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  showStatus('manageStatus', '✅ Data exported successfully', 'success');
}

/**
 * Import data from JSON
 */
function importData() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      // Validate data structure
      if (!data.categories || !data.stats) {
        throw new Error('Invalid certificate data format');
      }
      
      if (confirm('⚠️ This will replace all current data. Continue?')) {
        const token = prompt('Enter your GitHub token to save imported data:');
        if (!token) return;
        
        const uploader = initializeGitHub(token);
        
        certificatesData = data;
        await saveCertificatesToGitHub(uploader);
        
        loadCertificatesList();
        updateStats();
        loadFolderStructure();
        showStatus('manageStatus', '✅ Data imported and saved to GitHub successfully', 'success');
      }
    } catch (error) {
      showStatus('manageStatus', `❌ Error importing data: ${error.message}`, 'error');
    }
  };
  input.click();
}

/**
 * Show status message
 */
function showStatus(elementId, message, type) {
  const element = document.getElementById(elementId);
  if (!element) return;
  
  element.textContent = message;
  element.className = `status-message ${type}`;
  element.style.display = 'block';
  
  if (type === 'error') {
    setTimeout(() => {
      element.style.display = 'none';
    }, 8000);
  } else {
    setTimeout(() => {
      element.style.display = 'none';
    }, 5000);
  }
}
