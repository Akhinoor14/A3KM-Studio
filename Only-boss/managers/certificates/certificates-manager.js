// Certificate Manager JavaScript
// Handles upload, update, delete, and organization of certificates

let certificatesData = null;
let selectedFile = null;

// Subcategory mappings
const subcategories = {
  Academic: ['PSC', 'JSC', 'SSC', 'HSC', 'BSc', 'MSc', 'PhD', 'Other'],
  Skill: ['Programming', 'Design', 'AI Tools', 'Languages', 'Soft Skills', 'Other'],
  Medical: ['Vaccination', 'Reports', 'Legal', 'Other']
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
  await loadCertificatesData();
  loadCertificatesList();
  updateStats();
  loadFolderStructure();
});

// Load certificates data from JSON
async function loadCertificatesData() {
  try {
    const response = await fetch('../About me/certificates-data.json');
    certificatesData = await response.json();
  } catch (error) {
    console.error('Error loading certificates data:', error);
    certificatesData = {
      lastUpdated: new Date().toISOString(),
      categories: {
        Academic: { displayName: "Academic Certificates", icon: "fa-graduation-cap", description: "Educational certificates", certificates: [] },
        Medical: { displayName: "Medical Certificates", icon: "fa-heart-pulse", description: "Health documents", certificates: [] },
        Skill: { displayName: "Skill Certificates", icon: "fa-award", description: "Professional skills", certificates: [] }
      },
      stats: { totalCertificates: 0, academicCount: 0, medicalCount: 0, skillCount: 0 }
    };
  }
}

// Switch tabs
function switchTab(tabName) {
  // Hide all tabs
  document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  
  // Show selected tab
  document.getElementById(`${tabName}-tab`).classList.add('active');
  event.target.closest('.tab-btn').classList.add('active');
}

// Handle file selection
function handleFileSelect(event) {
  const file = event.target.files[0];
  if (!file) return;

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
      previewContent += `<br><img src="${e.target.result}" alt="Preview">`;
      preview.innerHTML = previewContent;
    };
    reader.readAsDataURL(file);
  } else {
    preview.innerHTML = previewContent;
  }
}

// Update subcategories based on category
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

// Upload form submission
document.getElementById('uploadForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  if (!selectedFile) {
    showStatus('uploadStatus', 'Please select a file', 'error');
    return;
  }

  const formData = {
    title: document.getElementById('certTitle').value,
    issuer: document.getElementById('certIssuer').value,
    category: document.getElementById('certCategory').value,
    subcategory: document.getElementById('certSubcategory').value,
    date: document.getElementById('certDate').value,
    tags: document.getElementById('certTags').value.split(',').map(t => t.trim()),
    description: document.getElementById('certDescription').value,
    verified: document.getElementById('certVerified').checked,
    featured: document.getElementById('certFeatured').checked
  };

  try {
    // Generate certificate object
    const certificate = createCertificateObject(formData, selectedFile);
    
    // Add to data structure
    addCertificateToData(certificate);
    
    // Save to JSON (in production, this would be a backend API call)
    await saveCertificatesData();
    
    // Upload file (simulated - in production, upload to server/storage)
    await uploadFile(selectedFile, certificate.filePath);
    
    showStatus('uploadStatus', 'Certificate uploaded successfully!', 'success');
    document.getElementById('uploadForm').reset();
    document.getElementById('filePreview').style.display = 'none';
    selectedFile = null;
    
    // Refresh stats and list
    updateStats();
    loadCertificatesList();
  } catch (error) {
    console.error('Upload error:', error);
    showStatus('uploadStatus', 'Error uploading certificate: ' + error.message, 'error');
  }
});

// Create certificate object
function createCertificateObject(formData, file) {
  const id = generateId(formData.title);
  const fileExtension = file.name.split('.').pop();
  const fileName = `${formData.title}.${fileExtension}`;
  const folderPath = `CERTIFICATES/${formData.category}/${formData.subcategory}`;
  
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
    thumbnail: `${folderPath}/thumbnail.jpg`,
    description: formData.description,
    tags: formData.tags,
    verified: formData.verified,
    featured: formData.featured,
    uploadedAt: new Date().toISOString()
  };
}

// Generate unique ID
function generateId(title) {
  return title.toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// Add certificate to data structure
function addCertificateToData(certificate) {
  const category = certificate.category;
  
  if (!certificatesData.categories[category]) {
    certificatesData.categories[category] = {
      displayName: `${category} Certificates`,
      icon: getIconForCategory(category),
      description: `${category} certificates and documents`,
      certificates: []
    };
  }
  
  // Check if certificate with same ID exists
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

// Get icon for category
function getIconForCategory(category) {
  const icons = {
    Academic: 'fa-graduation-cap',
    Skill: 'fa-award',
    Medical: 'fa-heart-pulse'
  };
  return icons[category] || 'fa-certificate';
}

// Update stats data
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

// Save certificates data
async function saveCertificatesData() {
  // In production, this would be an API call
  // For now, we'll download the JSON file
  const dataStr = JSON.stringify(certificatesData, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  
  // Auto-download updated JSON
  const link = document.createElement('a');
  link.href = URL.createObjectURL(dataBlob);
  link.download = 'certificates-data.json';
  link.click();
  
  console.log('Certificate data saved:', certificatesData);
}

// Upload file (simulated)
async function uploadFile(file, destinationPath) {
  // In production, this would upload to server/cloud storage
  // For now, we'll just log it
  console.log(`Uploading file to: ${destinationPath}`);
  
  // Simulate upload delay
  return new Promise(resolve => setTimeout(resolve, 1000));
}

// Load certificates list for management
function loadCertificatesList() {
  const container = document.getElementById('certificatesList');
  if (!container) return;
  
  container.innerHTML = '';
  
  Object.keys(certificatesData.categories).forEach(categoryKey => {
    const category = certificatesData.categories[categoryKey];
    
    if (category.certificates.length === 0) return;
    
    const categorySection = document.createElement('div');
    categorySection.innerHTML = `
      <h3 style="color: #CC0000; margin: 20px 0 15px 0;">
        <i class="fas ${category.icon}"></i> ${category.displayName}
      </h3>
    `;
    
    category.certificates.forEach(cert => {
      const certItem = document.createElement('div');
      certItem.className = 'cert-item';
      certItem.innerHTML = `
        <div class="cert-item-info">
          <h4>${cert.title}</h4>
          <p>${cert.issuedBy} • ${cert.issuedDate} • ${cert.subcategory}</p>
          <p style="font-size: 0.85rem; color: #666;">${cert.filePath}</p>
        </div>
        <div class="cert-item-actions">
          <button class="icon-btn icon-btn-edit" onclick="editCertificate('${cert.id}', '${categoryKey}')" title="Edit">
            <i class="fas fa-edit"></i>
          </button>
          <button class="icon-btn icon-btn-delete" onclick="deleteCertificate('${cert.id}', '${categoryKey}')" title="Delete">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      `;
      categorySection.appendChild(certItem);
    });
    
    container.appendChild(categorySection);
  });
}

// Filter certificates
function filterCertificates() {
  const searchTerm = document.getElementById('searchManage').value.toLowerCase();
  const certItems = document.querySelectorAll('.cert-item');
  
  certItems.forEach(item => {
    const text = item.textContent.toLowerCase();
    item.style.display = text.includes(searchTerm) ? 'flex' : 'none';
  });
}

// Edit certificate
function editCertificate(id, category) {
  const cert = certificatesData.categories[category].certificates.find(c => c.id === id);
  if (!cert) return;
  
  // Switch to upload tab
  switchTab('upload');
  
  // Populate form
  document.getElementById('certTitle').value = cert.title;
  document.getElementById('certIssuer').value = cert.issuedBy;
  document.getElementById('certCategory').value = cert.category;
  updateSubcategories();
  document.getElementById('certSubcategory').value = cert.subcategory;
  document.getElementById('certDate').value = cert.issuedDate;
  document.getElementById('certTags').value = cert.tags.join(', ');
  document.getElementById('certDescription').value = cert.description;
  document.getElementById('certVerified').checked = cert.verified;
  document.getElementById('certFeatured').checked = cert.featured;
  
  showStatus('uploadStatus', `Editing: ${cert.title}`, 'success');
}

// Delete certificate
function deleteCertificate(id, category) {
  if (!confirm('Are you sure you want to delete this certificate?')) return;
  
  const index = certificatesData.categories[category].certificates.findIndex(c => c.id === id);
  if (index > -1) {
    certificatesData.categories[category].certificates.splice(index, 1);
    updateStatsData();
    saveCertificatesData();
    loadCertificatesList();
    updateStats();
    showStatus('manageStatus', 'Certificate deleted successfully', 'success');
  }
}

// Update stats display
function updateStats() {
  document.getElementById('statTotal')?.textContent = certificatesData.stats.totalCertificates;
  document.getElementById('statAcademic')?.textContent = certificatesData.stats.academicCount;
  document.getElementById('statSkill')?.textContent = certificatesData.stats.skillCount;
  document.getElementById('statMedical')?.textContent = certificatesData.stats.medicalCount;
  
  // Count featured and verified
  let featured = 0;
  let verified = 0;
  Object.keys(certificatesData.categories).forEach(key => {
    certificatesData.categories[key].certificates.forEach(cert => {
      if (cert.featured) featured++;
      if (cert.verified) verified++;
    });
  });
  
  document.getElementById('statFeatured')?.textContent = featured;
  document.getElementById('statVerified')?.textContent = verified;
}

// Load folder structure
function loadFolderStructure() {
  const structureElement = document.getElementById('folderStructure');
  if (!structureElement) return;
  
  let structure = 'CERTIFICATES/\n';
  
  Object.keys(certificatesData.categories).forEach(categoryKey => {
    const category = certificatesData.categories[categoryKey];
    structure += `├── ${categoryKey}/\n`;
    
    const subcats = new Set();
    category.certificates.forEach(cert => {
      subcats.add(cert.subcategory);
    });
    
    const subcatsArray = Array.from(subcats);
    subcatsArray.forEach((subcat, index) => {
      const isLast = index === subcatsArray.length - 1;
      const prefix = isLast ? '└── ' : '├── ';
      structure += `│   ${prefix}${subcat}/\n`;
      
      // Show files in this subcategory
      const files = category.certificates.filter(cert => cert.subcategory === subcat);
      files.forEach((file, fileIndex) => {
        const fileIsLast = fileIndex === files.length - 1;
        const filePrefix = fileIsLast ? '└── ' : '├── ';
        const indent = isLast ? '    ' : '│   ';
        structure += `${indent}    ${filePrefix}${file.fileName}\n`;
      });
    });
  });
  
  structureElement.textContent = structure;
}

// Refresh structure
function refreshStructure() {
  loadFolderStructure();
  showStatus('uploadStatus', 'Folder structure refreshed', 'success');
}

// Create new folder
function createNewFolder() {
  const category = prompt('Enter category name (Academic/Skill/Medical):');
  if (!category) return;
  
  const subcategory = prompt(`Enter subcategory name for ${category}:`);
  if (!subcategory) return;
  
  if (!subcategories[category]) {
    subcategories[category] = [];
  }
  
  if (!subcategories[category].includes(subcategory)) {
    subcategories[category].push(subcategory);
    alert(`Subcategory "${subcategory}" added to ${category}`);
    loadFolderStructure();
  } else {
    alert('Subcategory already exists');
  }
}

// Export data
function exportData() {
  const dataStr = JSON.stringify(certificatesData, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(dataBlob);
  link.download = `certificates-data-backup-${Date.now()}.json`;
  link.click();
}

// Import data
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
      
      if (confirm('This will replace all current data. Continue?')) {
        certificatesData = data;
        await saveCertificatesData();
        loadCertificatesList();
        updateStats();
        loadFolderStructure();
        alert('Data imported successfully');
      }
    } catch (error) {
      alert('Error importing data: ' + error.message);
    }
  };
  input.click();
}

// Show status message
function showStatus(elementId, message, type) {
  const element = document.getElementById(elementId);
  if (!element) return;
  
  element.textContent = message;
  element.className = `status-message ${type}`;
  element.style.display = 'block';
  
  setTimeout(() => {
    element.style.display = 'none';
  }, 5000);
}
