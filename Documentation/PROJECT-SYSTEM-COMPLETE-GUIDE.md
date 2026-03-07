# A3KM Studio - Complete Project System Guide
**Version:** 3.0  
**Last Updated:** March 6, 2026  
**Purpose:** Comprehensive guide for adding new project categories with complete manager system

---

## Table of Contents
1. [Overview](#overview)
2. [File Structure](#file-structure)
3. [Desktop Project Card Template](#desktop-project-card-template)
4. [Mobile Project Card Template](#mobile-project-card-template)
5. [Listing Page Template](#listing-page-template)
6. [Viewer Page Template](#viewer-page-template)
7. [Manager System Template](#manager-system-template)
8. [JSON Data Structure](#json-data-structure)
9. [Storage Path Conventions](#storage-path-conventions)
10. [Statistics Auto-Update System](#statistics-auto-update-system)
11. [File Upload System](#file-upload-system)
12. [GitHub Integration](#github-integration)
13. [Shared Utilities](#shared-utilities)
14. [Theme & Styling Rules](#theme--styling-rules)
15. [Checklist for New Category](#checklist-for-new-category)

---

## Overview

The A3KM Studio project system consists of:
- **Main listing page** (`Projects Code/projects.html`) — Shows all project categories as cards
- **Mobile listing page** (`mobile/projects/projects.html`) — Mobile version with category cards
- **Category listing page** (`Projects Code/[category]/[category]-listing.html`) — Shows all items in a category
- **Item viewer page** (`Projects Code/[category]/[category]-viewer.html`) — Shows individual item details
- **Manager page** (`Only-boss/managers/projects/[category]/[category]-manager.html`) — Admin panel for CRUD operations
- **Data JSON** (`Projects Code/[category]/[category]-data.json`) — Contains all items and metadata
- **Storage folder** (`Projects Storage/[CategoryName]/`) — Physical files (code, images, PDFs, etc.)

---

## File Structure

```
A3KM Studio/
├─ Projects Code/
│   ├─ projects.html                    # Desktop main project list
│   └─ [category-name]/                 # e.g., programming, arduino
│       ├─ [category]-listing.html      # Category items list
│       ├─ [category]-viewer.html       # Individual item viewer
│       └─ [category]-data.json         # Category data
│
├─ mobile/
│   └─ projects/
│       ├─ projects.html                # Mobile main project list
│       ├─ projects.css                 # Mobile project cards styling
│       └─ [category]/                  # Mobile version (optional)
│
├─ Projects Storage/
│   └─ [CategoryName]/                  # Actual files storage
│       ├─ [subcategory]/               # Optional subcategory
│       │   └─ [item-id]/
│       │       ├─ main-file.ext
│       │       ├─ image.png
│       │       └─ README.md
│       └─ [item-id]/                   # Or direct items
│
├─ Only-boss/
│   └─ managers/
│       └─ projects/
│           ├─ shared-utilities.js      # Common functions
│           ├─ tags-system.js           # Tag management
│           ├─ github-api-handler.js    # GitHub API
│           └─ [category]/
│               └─ [category]-manager.html  # Admin panel
│
└─ Optimization/
    └─ Background/
        └─ background-system.css        # Animated background (REQUIRED)
```

---

## Desktop Project Card Template

**Location:** `Projects Code/projects.html`

### HTML Structure

```html
<div class="main-project-card" data-category="category-name">
    <div class="project-card-bg"></div>
    <div class="project-icon">
        <i class="fas fa-icon-name"></i>
    </div>
    <div class="project-title">Category Title</div>
    <div class="project-meta">
        <span class="project-count" id="categoryCount">
            <i class="fas fa-folder"></i> Loading...
        </span>
        <span class="project-difficulty">All Levels</span>
    </div>
    <p class="project-description">
        Brief description of the category (2-3 lines max)
    </p>
    <div class="project-card-footer">
        <button class="btn-explore" onclick="window.location.href='category-name/category-listing.html'">
            Explore <i class="fas fa-arrow-right"></i>
        </button>
        <button class="btn-favorite" onclick="toggleFavorite('category-name', event)">
            <i class="far fa-heart"></i>
        </button>
    </div>
</div>
```

### Key Attributes

| Attribute | Purpose | Example |
|-----------|---------|---------|
| `data-category` | Filter matching | `"programming"` |
| `class="main-project-card"` | Base styling (REQUIRED) | Always same |
| `id="[category]Count"` | Stats update target | `"programmingCount"` |
| `onclick="window.location.href='...'` | Navigation | Relative path to listing page |

### CSS Requirements

**DO NOT add custom CSS for individual cards.** All cards use the same `.main-project-card` class with these variables:

```css
.main-project-card {
    background: linear-gradient(135deg, rgba(20, 20, 20, 0.95) 0%, rgba(30, 30, 30, 0.9) 100%);
    border: 1px solid rgba(204, 0, 0, 0.3);  /* Red theme border */
    backdrop-filter: blur(20px);
    /* ... other shared styles */
}

.main-project-card:hover {
    border-color: var(--primary-red);  /* #CC0000 */
    transform: translateY(-8px);
}
```

**Color Consistency:** All cards use red accent (`--primary-red: #CC0000`) for borders, buttons, and hover effects.

---

## Mobile Project Card Template

**Location:** `mobile/projects/projects.html`

### HTML Structure

```html
<div class="category-card category-name-card" onclick="window.location.href='category-name/listing.html'">
    <div class="category-icon">
        <i class="fas fa-icon-name"></i>
    </div>
    <div class="category-info">
        <h3 class="category-title">Category Title</h3>
        <p class="category-description">Brief description</p>
        <div class="category-meta">
            <span class="category-count">
                <i class="fas fa-folder"></i> 
                <span id="mobile-category-count">0</span> Projects
            </span>
        </div>
    </div>
    <i class="fas fa-chevron-right category-arrow"></i>
</div>
```

### CSS Pattern (mobile/projects/projects.css)

```css
/* Base card styling (same for all) */
.category-card {
    background: linear-gradient(135deg, #1a1a1a 0%, #252525 100%);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    padding: 24px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3),
                inset 0 1px 1px rgba(255, 255, 255, 0.1),
                0 0 20px rgba(204, 0, 0, 0.15);  /* Red glow */
    /* ... */
}

/* ONLY icon color differs per card */
.programming-card .category-icon {
    background: linear-gradient(135deg, #00cc44 0%, #00ff66 100%);
    color: #000;
}

.arduino-card .category-icon {
    background: linear-gradient(135deg, #00897B 0%, #26A69A 100%);
    color: #fff;
}

/* Count badge - ALL cards use same red */
.category-count {
    background: rgba(204, 0, 0, 0.2);  /* Red background */
    color: #CC0000;  /* Red text */
    border: 1px solid rgba(204, 0, 0, 0.4);
}
```

**Rule:** Only `.category-icon` background color changes per category. Everything else (card background, borders, shadows, count badge) uses the same red theme.

---

## Listing Page Template

**Location:** `Projects Code/[category]/[category]-listing.html`

### Required CSS Links (in `<head>`)

```html
<!-- REQUIRED: Base styles -->
<link rel="stylesheet" href="../../Optimization/styles.css" />
<link rel="stylesheet" href="../../Optimization/navbar-autohide.css">
<link rel="stylesheet" href="../../Optimization/navbar/desktop-navbar.css">

<!-- CRITICAL: Animated background system -->
<link rel="stylesheet" href="../../Optimization/Background/background-system.css">

<!-- Optional: Prism for code highlighting -->
<link href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css" rel="stylesheet" />

<!-- Inline CSS for category-specific colors -->
<style>
  :root {
    --primary-red: #CC0000;  /* Default red */
    --primary: #00cc44;      /* Category accent (optional) */
  }
  /* Category-specific styles here */
</style>
```

### Body Structure (MANDATORY)

```html
<body>

  <!-- Background System Container - REQUIRED -->
  <div class="bg-system-container">
    
    <!-- Animated Background Elements -->
    <div class="bg-hero-bg-elements">
      <!-- Geometric Shapes -->
      <div class="bg-geometric-shapes">
        <div class="bg-shape bg-shape-1"></div>
        <div class="bg-shape bg-shape-2"></div>
        <div class="bg-shape bg-shape-3"></div>
        <div class="bg-shape bg-shape-4"></div>
        <div class="bg-shape bg-shape-5"></div>
      </div>
      
      <!-- Gradient Orbs -->
      <div class="bg-gradient-orbs">
        <div class="bg-orb bg-orb-1"></div>
        <div class="bg-orb bg-orb-2"></div>
        <div class="bg-orb bg-orb-3"></div>
      </div>
      
      <!-- Particle Canvas -->
      <canvas id="particles-canvas" class="bg-particles-canvas"></canvas>
    </div>
    
    <!-- Overlay -->
    <div class="bg-system-overlay"></div>
    
    <!-- ALL PAGE CONTENT GOES INSIDE THIS DIV -->
    <div class="bg-system-content">

      <!-- Desktop Navbar -->
      <nav class="desktop-navbar" id="desktopNavbar">
        <!-- Navbar content -->
      </nav>

      <!-- Page Content -->
      <div class="library-header">
        <h1>Category Title</h1>
        <p>Description</p>
      </div>

      <!-- Items Grid -->
      <div class="items-grid" id="itemsGrid">
        <!-- Dynamic items loaded here -->
      </div>

    </div>
    <!-- END bg-system-content -->
    
  </div>
  <!-- END bg-system-container -->

  <!-- Required Scripts - ORDER MATTERS -->
  <script src="../../Optimization/navbar-autohide.js"></script>
  <script src="../../Optimization/script.js"></script>
  <script src="../../Optimization/fullscreen-init.js"></script>
  <script src="../../Optimization/cursor-effects.js" defer></script>

  <!-- Category-specific script -->
  <script>
    // Fetch and display items
  </script>

</body>
```

### Critical Rules

⚠️ **Background System is NON-NEGOTIABLE**
- Every listing/viewer page MUST include `background-system.css`
- Every page MUST have the full `bg-system-container` wrapper structure
- All 5 shapes + 3 orbs + canvas must be present
- All 4 scripts must be loaded in correct order

⚠️ **Without background system:**
- Page will look different from other project pages
- No animated background, no particle effects
- Visual inconsistency

---

## Viewer Page Template

**Location:** `Projects Code/[category]/[category]-viewer.html`

### Structure

Same as listing page:
1. **Same CSS links** (including `background-system.css`)
2. **Same body wrapper structure** (`bg-system-container` → `bg-system-content`)
3. **Same 4 scripts** at the end
4. **Content inside `bg-system-content`:**
   - Navbar
   - Viewer header (title, metadata)
   - Main content area (code display, images, description)
   - Action buttons (download, run, back)

### Example Content Structure

```html
<div class="bg-system-content">
  <nav class="desktop-navbar" id="desktopNavbar">...</nav>
  
  <div class="viewer-container">
    <div class="viewer-header">
      <h1 id="itemTitle">Loading...</h1>
      <div class="item-meta">
        <span class="badge">Category</span>
        <span class="badge">Difficulty</span>
      </div>
    </div>
    
    <div class="viewer-content">
      <!-- Dynamic content: code editor, images, description -->
    </div>
    
    <div class="viewer-actions">
      <button onclick="downloadCode()">Download</button>
      <button onclick="runCode()">Run</button>
      <button onclick="history.back()">Back</button>
    </div>
  </div>
</div>
```

---

## Manager System Template

**Location:** `Only-boss/managers/projects/[category]/[category]-manager.html`

### Core Features (All REQUIRED)

1. ✅ **Load Existing Data** — Fetch JSON on page load
2. ✅ **Create New Item** — Form with all fields + file upload
3. ✅ **Edit Existing Item** — Populate form, allow file replacement
4. ✅ **Delete Item** — With confirmation
5. ✅ **Search/Filter** — By title, category, tags, difficulty
6. ✅ **Pagination** — 10 items per page
7. ✅ **Statistics Auto-Update** — After every operation
8. ✅ **JSON Editor** — Live view + download button
9. ✅ **Folder Structure Preview** — Show expected paths
10. ✅ **GitHub Push** — Upload JSON + files
11. ✅ **File Validation** — Type + size checks
12. ✅ **Storage Path Hint** — Dynamic path display as user types

### Manager Template Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Category Manager - A3KM Studio</title>
    
    <!-- Manager Theme CSS -->
    <link rel="stylesheet" href="../../shared/manager-theme.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    
    <!-- Category-specific CSS -->
    <style>
        :root {
            --primary-color: #CC0000;  /* Category accent */
        }
        /* Custom styles */
    </style>
</head>
<body>
    <!-- Header -->
    <div class="manager-header">
        <h1><i class="fas fa-icon"></i> Category Manager</h1>
        <div class="header-actions">
            <button onclick="location.href='../category-selector.html'" class="btn-back">
                <i class="fas fa-arrow-left"></i> Back to Projects
            </button>
        </div>
    </div>

    <!-- Navigation Tabs -->
    <div class="tabs">
        <button class="tab active" onclick="switchTab('create')">
            <i class="fas fa-plus-circle"></i> Create New
        </button>
        <button class="tab" onclick="switchTab('manage')">
            <i class="fas fa-list"></i> Manage Items
        </button>
        <button class="tab" onclick="switchTab('json')">
            <i class="fas fa-code"></i> JSON Editor
        </button>
        <button class="tab" onclick="switchTab('structure')">
            <i class="fas fa-folder-tree"></i> Folder Structure
        </button>
        <button class="tab" onclick="switchTab('github')">
            <i class="fab fa-github"></i> GitHub Push
        </button>
    </div>

    <!-- Tab Contents -->
    <div id="createTab" class="tab-content active">
        <!-- Create Form -->
    </div>

    <div id="manageTab" class="tab-content">
        <!-- List + Edit/Delete -->
    </div>

    <div id="jsonTab" class="tab-content">
        <!-- JSON Editor + Download -->
    </div>

    <div id="structureTab" class="tab-content">
        <!-- Folder Structure Preview -->
    </div>

    <div id="githubTab" class="tab-content">
        <!-- GitHub Push Panel -->
    </div>

    <!-- Scripts -->
    <script src="../../shared/unified-token-manager.js"></script>
    <script src="../shared-utilities.js"></script>
    <script src="../tags-system.js"></script>
    <script src="../github-api-handler.js"></script>
    <script>
        // Manager logic
    </script>
</body>
</html>
```

### 1. Data Loading

```javascript
let categoryData = {
    statistics: {
        total: 0,
        byCategory: {},
        byDifficulty: { easy: 0, medium: 0, hard: 0 },
        lastUpdated: null
    },
    categories: {},
    items: []
};

// Load on page init
async function loadData() {
    try {
        const response = await fetch('../../Projects Code/[category]/[category]-data.json');
        if (response.ok) {
            categoryData = await response.json();
            console.log('✅ Data loaded:', categoryData);
            updateStats();
            renderItemsList();
            updateJSONEditor();
        } else {
            console.warn('⚠️ JSON not found, using empty data');
        }
    } catch (error) {
        console.error('❌ Failed to load data:', error);
        alert('Failed to load data. Using empty dataset.');
    }
}

window.addEventListener('DOMContentLoaded', loadData);
```

### 2. Create New Item

```javascript
document.getElementById('createForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Collect form data
    const newItem = {
        id: generateUniqueId(),  // e.g., 'cat-001', timestamp-based, or slug
        title: document.getElementById('title').value.trim(),
        subtitle: document.getElementById('subtitle').value.trim(),
        category: document.getElementById('category').value,
        difficulty: document.getElementById('difficulty').value,
        description: document.getElementById('description').value.trim(),
        tags: document.getElementById('tags').value.split(',').map(t => t.trim()).filter(t => t),
        featured: document.getElementById('featured').checked,
        folder: generateFolderName(document.getElementById('title').value),
        files: {
            // Collect selected file names (not actual files yet)
            code: codeFilesSelected.map(f => f.name),
            images: imageFilesSelected.map(f => f.name),
            readme: readmeFileSelected ? readmeFileSelected.name : null
        },
        date: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString()
    };
    
    // Validate required fields
    if (!newItem.title || !newItem.category) {
        alert('❌ Title and Category are required!');
        return;
    }
    
    // Add to data
    categoryData.items.push(newItem);
    
    // Update statistics
    updateStatistics();
    
    // Update UI
    renderItemsList();
    updateJSONEditor();
    
    // Success message
    alert(`✅ Item "${newItem.title}" created successfully!\n\n` +
          `📁 Folder: ${newItem.folder}\n` +
          `🆔 ID: ${newItem.id}\n\n` +
          `📋 Next Steps:\n` +
          `1. Download updated JSON from JSON Editor tab\n` +
          `2. Create folder: "Projects Storage/[Category]/${newItem.folder}/"\n` +
          `3. Upload selected files to the folder\n` +
          `4. Push changes to GitHub`);
    
    // Reset form
    e.target.reset();
    clearFileSelections();
});

function generateUniqueId() {
    // Option 1: Timestamp-based
    return 'item-' + Date.now();
    
    // Option 2: Category prefix + sequential
    const count = categoryData.items.length + 1;
    return `cat-${String(count).padStart(3, '0')}`;
    
    // Option 3: Slug-based
    const title = document.getElementById('title').value;
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function generateFolderName(title) {
    return title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')  // Replace non-alphanumeric with hyphen
        .replace(/^-|-$/g, '');        // Remove leading/trailing hyphens
}
```

### 3. Edit Existing Item

```javascript
function editItem(id) {
    const item = categoryData.items.find(i => i.id === id);
    if (!item) {
        alert('❌ Item not found!');
        return;
    }
    
    // Populate edit form with existing data
    document.getElementById('editId').value = item.id;
    document.getElementById('editTitle').value = item.title;
    document.getElementById('editSubtitle').value = item.subtitle || '';
    document.getElementById('editCategory').value = item.category;
    document.getElementById('editDifficulty').value = item.difficulty || 'Medium';
    document.getElementById('editDescription').value = item.description || '';
    document.getElementById('editTags').value = (item.tags || []).join(', ');
    document.getElementById('editFeatured').checked = item.featured || false;
    
    // Show current files
    if (item.files) {
        document.getElementById('edit-currentFiles').innerHTML = `
            <strong>Current Files:</strong><br>
            Code: ${item.files.code ? item.files.code.join(', ') : 'None'}<br>
            Images: ${item.files.images ? item.files.images.join(', ') : 'None'}<br>
            README: ${item.files.readme || 'None'}
        `;
    }
    
    // Reset file upload inputs
    document.getElementById('edit-newCodeFiles').value = '';
    document.getElementById('edit-newImageFiles').value = '';
    editNewFilesSelected = { code: [], images: [], readme: null };
    
    // Show edit modal
    document.getElementById('editModal').classList.add('active');
}

// Save Edit
document.getElementById('editForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const id = document.getElementById('editId').value;
    const index = categoryData.items.findIndex(i => i.id === id);
    
    if (index === -1) {
        alert('❌ Item not found!');
        return;
    }
    
    // Update item data
    const updatedItem = {
        ...categoryData.items[index],  // Keep existing data
        title: document.getElementById('editTitle').value.trim(),
        subtitle: document.getElementById('editSubtitle').value.trim(),
        category: document.getElementById('editCategory').value,
        difficulty: document.getElementById('editDifficulty').value,
        description: document.getElementById('editDescription').value.trim(),
        tags: document.getElementById('editTags').value.split(',').map(t => t.trim()).filter(t => t),
        featured: document.getElementById('editFeatured').checked,
        updatedAt: new Date().toISOString()
    };
    
    // Handle file uploads if new files selected
    if (editNewFilesSelected.code.length > 0 || 
        editNewFilesSelected.images.length > 0 || 
        editNewFilesSelected.readme) {
        
        if (!confirm('📤 Upload new files?\n\nThis will replace existing files in GitHub storage.\n\nContinue?')) {
            return;
        }
        
        try {
            // Upload files to GitHub
            for (const file of editNewFilesSelected.code) {
                const filePath = `Projects Storage/[Category]/${updatedItem.folder}/${file.name}`;
                await githubAPI.uploadFile(filePath, file);
            }
            
            // Update files list in JSON
            if (editNewFilesSelected.code.length > 0) {
                updatedItem.files.code = editNewFilesSelected.code.map(f => f.name);
            }
            if (editNewFilesSelected.images.length > 0) {
                updatedItem.files.images = editNewFilesSelected.images.map(f => f.name);
            }
            if (editNewFilesSelected.readme) {
                updatedItem.files.readme = editNewFilesSelected.readme.name;
            }
            
            alert('✅ Files uploaded successfully!');
        } catch (error) {
            alert('❌ File upload failed: ' + error.message);
            return;
        }
    }
    
    // Update in data array
    categoryData.items[index] = updatedItem;
    
    // Update statistics
    updateStatistics();
    
    // Update UI
    renderItemsList();
    updateJSONEditor();
    
    // Close modal
    document.getElementById('editModal').classList.remove('active');
    
    alert('✅ Item updated successfully!');
});
```

### 4. Delete Item

```javascript
function deleteItem(id) {
    const item = categoryData.items.find(i => i.id === id);
    if (!item) return;
    
    if (!confirm(`🗑️ Delete "${item.title}"?\n\n` +
                 `This will remove the item from JSON only.\n` +
                 `You must manually delete the folder from GitHub:\n` +
                 `Projects Storage/[Category]/${item.folder}/\n\n` +
                 `Continue?`)) {
        return;
    }
    
    // Remove from array
    const index = categoryData.items.findIndex(i => i.id === id);
    categoryData.items.splice(index, 1);
    
    // Update statistics
    updateStatistics();
    
    // Update UI
    renderItemsList();
    updateJSONEditor();
    
    alert(`✅ Item deleted from JSON!\n\n` +
          `⚠️ Don't forget to:\n` +
          `1. Delete folder from Projects Storage/[Category]/${item.folder}/\n` +
          `2. Download updated JSON\n` +
          `3. Push changes to GitHub`);
}
```

### 5. Statistics Auto-Update System

```javascript
function updateStatistics() {
    const items = categoryData.items || [];
    
    // Calculate statistics
    const stats = {
        total: items.length,
        byCategory: {},
        byDifficulty: {
            easy: 0,
            medium: 0,
            hard: 0
        },
        lastUpdated: new Date().toISOString()
    };
    
    // Count by category
    items.forEach(item => {
        // Category count
        const cat = item.category || 'uncategorized';
        stats.byCategory[cat] = (stats.byCategory[cat] || 0) + 1;
        
        // Difficulty count
        const diff = (item.difficulty || 'medium').toLowerCase();
        if (stats.byDifficulty.hasOwnProperty(diff)) {
            stats.byDifficulty[diff]++;
        }
    });
    
    // Update in data object
    categoryData.statistics = stats;
    
    // Update UI displays
    updateStatsUI(stats);
    
    console.log('📊 Statistics updated:', stats);
}

function updateStatsUI(stats) {
    // Update stat cards
    document.getElementById('totalCount').textContent = stats.total;
    document.getElementById('categoriesCount').textContent = Object.keys(stats.byCategory).length;
    
    // Update category breakdown
    const categoryStatsDiv = document.getElementById('categoryStats');
    if (categoryStatsDiv) {
        categoryStatsDiv.innerHTML = '';
        Object.entries(stats.byCategory)
            .sort((a, b) => b[1] - a[1])
            .forEach(([cat, count]) => {
                categoryStatsDiv.innerHTML += `
                    <div class="stats-item">
                        <span class="stats-label">${cat}</span>
                        <span class="stats-value">${count}</span>
                    </div>
                `;
            });
    }
    
    // Update difficulty breakdown
    document.getElementById('easyCount').textContent = stats.byDifficulty.easy;
    document.getElementById('mediumCount').textContent = stats.byDifficulty.medium;
    document.getElementById('hardCount').textContent = stats.byDifficulty.hard;
}

// Call after every operation
function afterOperation() {
    updateStatistics();
    renderItemsList();
    updateJSONEditor();
}
```

**CRITICAL:** `updateStatistics()` MUST be called after:
- ✅ Create new item
- ✅ Edit item
- ✅ Delete item
- ✅ Batch operations
- ✅ Import/merge data

### 6. File Upload Validation

```javascript
const FILE_CONFIG = {
    MAX_SIZE: 100 * 1024 * 1024,  // 100MB (GitHub limit)
    ALLOWED_CODE: ['.ino', '.c', '.cpp', '.h', '.py', '.m', '.js', '.java'],
    ALLOWED_IMAGES: ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
    ALLOWED_DOCS: ['.pdf', '.md', '.txt']
};

function validateFile(file, type) {
    // Check if file exists
    if (!file) {
        return { valid: false, error: 'No file selected' };
    }
    
    // Check file size
    if (file.size > FILE_CONFIG.MAX_SIZE) {
        return {
            valid: false,
            error: `File too large: ${(file.size / 1024 / 1024).toFixed(2)}MB. Maximum: 100MB`
        };
    }
    
    // Check file type
    const ext = '.' + file.name.split('.').pop().toLowerCase();
    let allowed = [];
    
    if (type === 'code') {
        allowed = FILE_CONFIG.ALLOWED_CODE;
    } else if (type === 'image') {
        allowed = FILE_CONFIG.ALLOWED_IMAGES;
    } else if (type === 'doc') {
        allowed = FILE_CONFIG.ALLOWED_DOCS;
    }
    
    if (!allowed.includes(ext)) {
        return {
            valid: false,
            error: `Invalid file type: ${ext}. Allowed: ${allowed.join(', ')}`
        };
    }
    
    // All checks passed
    return { valid: true };
}

// Usage
function handleCodeFileSelect(event) {
    const files = Array.from(event.target.files);
    const validFiles = [];
    
    for (const file of files) {
        const validation = validateFile(file, 'code');
        
        if (!validation.valid) {
            alert(`❌ ${file.name}: ${validation.error}`);
            continue;
        }
        
        validFiles.push(file);
    }
    
    // Store valid files
    selectedCodeFiles = validFiles;
    
    // Show preview
    displayFileList('codeFilesList', validFiles);
}
```

### 7. Storage Path Hint System

```javascript
// Dynamic path hint as user types
function setupStoragePathHint() {
    const fields = ['title', 'category', 'language', 'subcategory'];
    
    fields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('input', updateStoragePathHint);
        }
    });
}

function updateStoragePathHint() {
    const title = document.getElementById('title').value.trim();
    const category = document.getElementById('category').value;
    const language = document.getElementById('language')?.value || '';
    const subcategory = document.getElementById('subcategory')?.value || '';
    
    // Generate path based on inputs
    if (!title || !category) {
        document.getElementById('storagePathHint').style.display = 'none';
        return;
    }
    
    const titleSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    let path = 'A3KM Studio/Projects Storage/[Category]/';
    
    // Add language/type if exists
    if (language) {
        path += `${language}/`;
    }
    
    // Add category
    path += `${category}/`;
    
    // Add subcategory if exists
    if (subcategory) {
        path += `${subcategory}/`;
    }
    
    // Add item folder
    path += `${titleSlug}/`;
    
    // Display path
    document.getElementById('storagePathText').textContent = path;
    document.getElementById('storagePathHint').style.display = 'block';
}

// Initialize on page load
setupStoragePathHint();
```

**HTML for path hint:**

```html
<div class="storage-path-hint" id="storagePathHint" style="display:none;">
    <i class="fas fa-folder-open"></i>
    <span>Expected Storage Path:</span>
    <code id="storagePathText">—</code>
    <button onclick="copyPath()" class="btn-copy" title="Copy path">
        <i class="fas fa-copy"></i>
    </button>
</div>
```

**CSS:**

```css
.storage-path-hint {
    background: rgba(0, 204, 68, 0.1);
    border: 1px solid rgba(0, 204, 68, 0.3);
    border-radius: 8px;
    padding: 12px 16px;
    margin: 15px 0;
    display: flex;
    align-items: center;
    gap: 10px;
}

.storage-path-hint code {
    background: rgba(0, 0, 0, 0.3);
    padding: 4px 8px;
    border-radius: 4px;
    font-family: 'Fira Code', monospace;
    flex: 1;
    color: #00cc44;
}
```

### 8. GitHub Push Integration

```javascript
async function pushToGitHub() {
    if (!confirm('📤 Push to GitHub?\n\n' +
                 'This will:\n' +
                 '✅ Update [category]-data.json\n' +
                 '✅ Upload all selected files\n\n' +
                 'Continue?')) {
        return;
    }
    
    try {
        // Show loading
        showLoading('Pushing to GitHub...');
        
        // 1. Push JSON file first
        const jsonPath = 'Projects Code/[category]/[category]-data.json';
        const jsonContent = JSON.stringify(categoryData, null, 2);
        
        await githubAPI.updateFile(
            jsonPath,
            jsonContent,
            `Update [category] data - ${new Date().toISOString()}`
        );
        
        console.log('✅ JSON pushed successfully');
        
        // 2. Push selected files
        let pushedCount = 0;
        let failedCount = 0;
        
        for (const file of allSelectedFiles) {
            try {
                const filePath = `Projects Storage/[Category]/${file.targetPath}`;
                await githubAPI.uploadFile(
                    filePath,
                    file.fileObject,
                    `Upload ${file.name} for ${file.itemTitle}`
                );
                
                pushedCount++;
                updateProgress(pushedCount, allSelectedFiles.length);
            } catch (fileError) {
                console.error(`❌ Failed to upload ${file.name}:`, fileError);
                failedCount++;
            }
        }
        
        // Hide loading
        hideLoading();
        
        // Show results
        alert(`✅ GitHub push complete!\n\n` +
              `📄 JSON updated\n` +
              `📁 ${pushedCount} file(s) uploaded\n` +
              `${failedCount > 0 ? `❌ ${failedCount} file(s) failed` : ''}`);
        
        // Clear file selections
        clearFileSelections();
        
    } catch (error) {
        hideLoading();
        console.error('❌ GitHub push failed:', error);
        alert('❌ GitHub push failed: ' + error.message);
    }
}
```

### 9. JSON Editor Tab

```javascript
function updateJSONEditor() {
    const jsonEditor = document.getElementById('jsonEditor');
    if (!jsonEditor) return;
    
    // Pretty print JSON
    jsonEditor.value = JSON.stringify(categoryData, null, 2);
    
    // Update stats display
    const stats = categoryData.statistics || {};
    document.getElementById('jsonStats').innerHTML = `
        📊 Statistics:<br>
        Total Items: ${stats.total || 0}<br>
        Categories: ${Object.keys(stats.byCategory || {}).length}<br>
        Last Updated: ${stats.lastUpdated ? new Date(stats.lastUpdated).toLocaleString() : 'Never'}
    `;
}

function downloadJSON() {
    const jsonStr = JSON.stringify(categoryData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `[category]-data-${Date.now()}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
    alert('✅ JSON downloaded successfully!');
}

// Validate JSON
function validateJSON() {
    try {
        const jsonText = document.getElementById('jsonEditor').value;
        const parsed = JSON.parse(jsonText);
        
        // Check required fields
        if (!parsed.statistics) {
            throw new Error('Missing "statistics" field');
        }
        if (!parsed.items || !Array.isArray(parsed.items)) {
            throw new Error('Missing or invalid "items" array');
        }
        
        alert('✅ JSON is valid!');
        return true;
    } catch (error) {
        alert('❌ Invalid JSON: ' + error.message);
        return false;
    }
}
```

---

## JSON Data Structure

### Complete Template

```json
{
  "statistics": {
    "total": 10,
    "byCategory": {
      "category1": 5,
      "category2": 3,
      "category3": 2
    },
    "byDifficulty": {
      "easy": 3,
      "medium": 5,
      "hard": 2
    },
    "lastUpdated": "2026-03-06T10:30:00.000Z"
  },
  "categories": {
    "category1": {
      "name": "Category 1",
      "description": "Description",
      "count": 5,
      "icon": "fas fa-icon"
    },
    "category2": {
      "name": "Category 2",
      "description": "Description",
      "count": 3,
      "icon": "fas fa-icon"
    }
  },
  "items": [
    {
      "id": "item-001",
      "title": "Project Title",
      "subtitle": "Short description (optional)",
      "category": "category1",
      "subcategory": "subcategory-slug",
      "difficulty": "Medium",
      "description": "Full description with details",
      "tags": ["tag1", "tag2", "tag3"],
      "featured": false,
      "folder": "project-folder-name",
      "files": {
        "code": ["main.ext", "helper.ext"],
        "images": ["diagram.png", "screenshot.jpg"],
        "readme": "README.md",
        "documentation": "docs.pdf",
        "archive": "complete-project.zip"
      },
      "metadata": {
        "author": "Md Akhinoor Islam",
        "language": "Python",
        "version": "1.0.0",
        "license": "MIT"
      },
      "date": "2026-03-06",
      "createdAt": "2026-03-06T10:00:00.000Z",
      "updatedAt": "2026-03-06T12:00:00.000Z"
    }
  ]
}
```

### Field Explanations

| Field | Type | Required | Purpose | Example |
|-------|------|----------|---------|---------|
| `id` | string | ✅ Yes | Unique identifier | `"prog-001"`, `"arduino-led-fade"` |
| `title` | string | ✅ Yes | Display name | `"Bubble Sort Algorithm"` |
| `subtitle` | string | ❌ No | Short description | `"Classic sorting algorithm"` |
| `category` | string | ✅ Yes | Main category | `"algorithms"`, `"sensors"` |
| `subcategory` | string | ❌ No | Sub-category | `"sorting"`, `"temperature"` |
| `difficulty` | string | ✅ Yes | Skill level | `"Easy"`, `"Medium"`, `"Hard"` |
| `description` | string | ✅ Yes | Full description | Detailed explanation |
| `tags` | array | ❌ No | Search keywords | `["python", "sorting", "beginner"]` |
| `featured` | boolean | ❌ No | Show in featured | `true`, `false` |
| `folder` | string | ✅ Yes | Storage folder name | `"bubble-sort-algorithm"` |
| `files` | object | ✅ Yes | File references | See below |
| `metadata` | object | ❌ No | Extra info | See below |
| `date` | string | ✅ Yes | Publication date | `"2026-03-06"` (YYYY-MM-DD) |
| `createdAt` | string | ❌ No | Creation timestamp | ISO 8601 format |
| `updatedAt` | string | ❌ No | Last update timestamp | ISO 8601 format |

### Files Object Structure

```json
"files": {
  "code": ["main.py", "utils.py"],      // Code files
  "images": ["diagram.png"],             // Images/screenshots
  "readme": "README.md",                 // Documentation
  "documentation": "manual.pdf",          // PDF docs
  "archive": "project.zip",              // Complete package
  "video": "https://youtube.com/..."     // Demo video
}
```

**All fields in `files` are optional but recommended.**

---

## Storage Path Conventions

### Path Structure

```
Projects Storage/
└─ [CategoryName]/                      # Use proper capitalization
    ├─ [language-or-type]/              # Optional: Python, Arduino, etc.
    │   ├─ [main-category]/             # Optional: algorithms, sensors, etc.
    │   │   ├─ [subcategory]/           # Optional: sorting, temperature, etc.
    │   │   │   └─ [item-slug]/         # Required: folder for each item
    │   │   │       ├─ main-file.ext
    │   │   │       ├─ image.png
    │   │   │       └─ README.md
    │   │   └─ [item-slug]/
    │   └─ [item-slug]/
    └─ [item-slug]/                     # Or direct items without subcategories
```

### Real Examples

**Programming (with subcategories):**
```
Projects Storage/Programming/
├─ Python/
│   ├─ algorithms/
│   │   ├─ sorting/
│   │   │   ├─ bubble-sort/
│   │   │   │   ├─ bubble_sort.py
│   │   │   │   ├─ diagram.png
│   │   │   │   └─ README.md
│   │   │   └─ quick-sort/
│   │   └─ searching/
│   └─ data-structures/
└─ JavaScript/
```

**Arduino (flat structure):**
```
Projects Storage/Arduino UNO Projects with Tinkercad/
├─ led-fade-control/
│   ├─ led_fade.ino
│   ├─ circuit.png
│   └─ README.md
├─ ultrasonic-sensor/
└─ servo-motor-control/
```

**MATLAB (by category):**
```
Projects Storage/MATLAB Projects/
├─ renewable-energy-01/
│   ├─ solar_panel_analysis.m
│   ├─ results.png
│   ├─ simulink_model.slx
│   └─ documentation.pdf
└─ power-systems-02/
```

### Path Generation Rules

1. **Folder naming:**
   - Lowercase only
   - Replace spaces with hyphens: `"Bubble Sort"` → `"bubble-sort"`
   - Remove special characters: `"C++ Code"` → `"c-code"`
   - No leading/trailing hyphens

2. **File naming:**
   - Descriptive names: `bubble_sort.py` (not `code.py`)
   - Use underscores for code files: `file_name.ext`
   - Use hyphens for assets: `circuit-diagram.png`

3. **Path in JSON:**
   - Store relative paths from repository root
   - Example: `"Projects Storage/Programming/Python/algorithms/bubble-sort.py"`

---

## Statistics Auto-Update System

### When to Update

Statistics **MUST** be updated after:

1. ✅ **Create new item** → Increment total, category count
2. ✅ **Edit item** → If category changed, update both old and new category counts
3. ✅ **Delete item** → Decrement total, category count
4. ✅ **Bulk operations** → Batch import, merge, delete multiple
5. ✅ **Category change** → Update both categories

### Update Logic

```javascript
function updateStatistics() {
    const items = categoryData.items || [];
    
    // Initialize stats object
    const stats = {
        total: items.length,
        byCategory: {},
        byDifficulty: {
            easy: 0,
            medium: 0,
            hard: 0
        },
        byTag: {},
        lastUpdated: new Date().toISOString()
    };
    
    // Count each item
    items.forEach(item => {
        // Category count
        const cat = item.category || 'uncategorized';
        stats.byCategory[cat] = (stats.byCategory[cat] || 0) + 1;
        
        // Difficulty count
        const diff = (item.difficulty || 'Medium').toLowerCase();
        if (stats.byDifficulty.hasOwnProperty(diff)) {
            stats.byDifficulty[diff]++;
        }
        
        // Tag count
        if (item.tags && Array.isArray(item.tags)) {
            item.tags.forEach(tag => {
                const normalized = tag.toLowerCase();
                stats.byTag[normalized] = (stats.byTag[normalized] || 0) + 1;
            });
        }
    });
    
    // Update categories object
    categoryData.categories = categoryData.categories || {};
    Object.keys(stats.byCategory).forEach(cat => {
        if (!categoryData.categories[cat]) {
            categoryData.categories[cat] = {
                name: cat.charAt(0).toUpperCase() + cat.slice(1),
                count: 0
            };
        }
        categoryData.categories[cat].count = stats.byCategory[cat];
    });
    
    // Save stats
    categoryData.statistics = stats;
    
    console.log('📊 Statistics updated:', stats);
}
```

### Main Projects Page Integration

After updating category JSON, update stats in main projects page:

**Desktop** (`Projects Code/projects.html`):

```javascript
const projectCounts = {
    arduino: { total: 23 },
    matlab: { total: 1 },
    solidworks: { total: 35 },
    electronics: { total: 4 },
    programming: { total: 2 },  // Add new category here
};

const totalCategories = 5;  // Increment this

const totalProjects = projectCounts.solidworks.total +
                     projectCounts.arduino.total +
                     projectCounts.matlab.total +
                     projectCounts.electronics.total +
                     projectCounts.programming.total;  // Add here
```

**Mobile** (`mobile/projects/projects.html`):

```html
<div class="stat-value">5</div>  <!-- Update count -->
<div class="stat-label">Categories</div>
```

---

## File Upload System

### Upload Flow

```
1. User selects files
   ↓
2. Validate (type + size)
   ↓
3. Show preview
   ↓
4. Store in memory (File objects)
   ↓
5. On submit: Add to JSON (file names only)
   ↓
6. On GitHub push: Upload actual files
```

### HTML Template

```html
<div class="form-group">
    <label>
        <i class="fas fa-file-code"></i>
        Code Files
        <span class="required">*</span>
    </label>
    
    <!-- Drop zone -->
    <div id="codeDropZone" class="file-upload-area" 
         onclick="document.getElementById('codeFiles').click()">
        <i class="fas fa-file-code"></i>
        <p>Drop code files here or click to browse</p>
        <span class="supported-formats">
            .py, .js, .ino, .m, .cpp | Max 100MB per file
        </span>
        <div id="codeFilesList"></div>
    </div>
    
    <!-- Hidden file input -->
    <input type="file" id="codeFiles" accept=".py,.js,.ino,.m,.cpp" 
           multiple style="display: none;" 
           onchange="handleCodeFiles(this.files)">
</div>
```

### JavaScript Handler

```javascript
let selectedCodeFiles = [];

function handleCodeFiles(files) {
    const fileArray = Array.from(files);
    const validFiles = [];
    
    for (const file of fileArray) {
        // Validate file
        const validation = validateFile(file, 'code');
        
        if (!validation.valid) {
            alert(`❌ ${file.name}: ${validation.error}`);
            continue;
        }
        
        validFiles.push(file);
    }
    
    // Add to selection
    selectedCodeFiles = [...selectedCodeFiles, ...validFiles];
    
    // Show preview
    displayFileList('codeFilesList', selectedCodeFiles);
}

function displayFileList(containerId, files) {
    const container = document.getElementById(containerId);
    
    container.innerHTML = files.map((file, index) => `
        <div class="file-item">
            <div class="file-info">
                <i class="fas fa-file-code"></i>
                <span class="file-name">${file.name}</span>
                <span class="file-size">${formatFileSize(file.size)}</span>
            </div>
            <button type="button" class="btn-remove" 
                    onclick="removeFile('code', ${index})">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `).join('');
}

function removeFile(type, index) {
    if (type === 'code') {
        selectedCodeFiles.splice(index, 1);
        displayFileList('codeFilesList', selectedCodeFiles);
    }
    // ... handle other types
}

function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}
```

### Drag & Drop Support

```javascript
function setupDragAndDrop(dropZoneId, inputId, fileType) {
    const dropZone = document.getElementById(dropZoneId);
    const fileInput = document.getElementById(inputId);
    
    // Prevent default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
        });
    });
    
    // Visual feedback
    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => {
            dropZone.classList.add('drag-over');
        });
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => {
            dropZone.classList.remove('drag-over');
        });
    });
    
    // Handle drop
    dropZone.addEventListener('drop', (e) => {
        const files = e.dataTransfer.files;
        
        // Trigger handler
        if (fileType === 'code') {
            handleCodeFiles(files);
        } else if (fileType === 'image') {
            handleImageFiles(files);
        }
    });
}

// Initialize
setupDragAndDrop('codeDropZone', 'codeFiles', 'code');
setupDragAndDrop('imageDropZone', 'imageFiles', 'image');
```

---

## GitHub Integration

### GitHub API Handler

All managers use shared GitHub API:

```javascript
// Included via: <script src="../github-api-handler.js"></script>

const githubAPI = {
    // Upload new file
    async uploadFile(path, file, commitMessage) {
        const token = await getGitHubToken();  // From unified-token-manager.js
        const base64Content = await fileToBase64(file);
        
        const response = await fetch(
            `https://api.github.com/repos/Akhinoor14/A3KM-Studio/contents/${path}`,
            {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: commitMessage || `Upload ${file.name}`,
                    content: base64Content
                })
            }
        );
        
        if (!response.ok) {
            throw new Error(`GitHub upload failed: ${response.statusText}`);
        }
        
        return await response.json();
    },
    
    // Update existing file
    async updateFile(path, content, commitMessage) {
        const token = await getGitHubToken();
        
        // Get current file SHA
        const currentFile = await this.getFile(path);
        const sha = currentFile?.sha;
        
        const base64Content = btoa(unescape(encodeURIComponent(content)));
        
        const response = await fetch(
            `https://api.github.com/repos/Akhinoor14/A3KM-Studio/contents/${path}`,
            {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: commitMessage || `Update ${path}`,
                    content: base64Content,
                    sha: sha  // Required for updates
                })
            }
        );
        
        if (!response.ok) {
            throw new Error(`GitHub update failed: ${response.statusText}`);
        }
        
        return await response.json();
    },
    
    // Get file (to get SHA for update)
    async getFile(path) {
        const token = await getGitHubToken();
        
        const response = await fetch(
            `https://api.github.com/repos/Akhinoor14/A3KM-Studio/contents/${path}`,
            {
                headers: {
                    'Authorization': `token ${token}`
                }
            }
        );
        
        if (response.status === 404) return null;
        if (!response.ok) throw new Error(`Failed to get file: ${response.statusText}`);
        
        return await response.json();
    }
};

// Helper: File to Base64
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const base64 = reader.result.split(',')[1];  // Remove data:... prefix
            resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}
```

### Push Workflow

```javascript
async function pushToGitHub() {
    if (!selectedCodeFiles.length && !selectedImageFiles.length) {
        alert('⚠️ No files selected to upload!');
        return;
    }
    
    if (!confirm('📤 Push to GitHub?\n\n' +
                 `JSON: Projects Code/[category]/[category]-data.json\n` +
                 `Files: ${selectedCodeFiles.length + selectedImageFiles.length}\n\n` +
                 'Continue?')) {
        return;
    }
    
    try {
        showLoading('Pushing to GitHub...');
        let results = {
            json: false,
            uploaded: 0,
            failed: 0,
            errors: []
        };
        
        // 1. Push JSON first
        try {
            await githubAPI.updateFile(
                'Projects Code/[category]/[category]-data.json',
                JSON.stringify(categoryData, null, 2),
                `Update [category] data - ${new Date().toISOString()}`
            );
            results.json = true;
            console.log('✅ JSON pushed');
        } catch (jsonError) {
            results.errors.push('JSON: ' + jsonError.message);
        }
        
        // 2. Upload code files
        for (const file of selectedCodeFiles) {
            try {
                const filePath = `Projects Storage/[Category]/${file.targetFolder}/${file.name}`;
                await githubAPI.uploadFile(filePath, file);
                results.uploaded++;
            } catch (error) {
                results.failed++;
                results.errors.push(`${file.name}: ${error.message}`);
            }
        }
        
        // 3. Upload image files
        for (const file of selectedImageFiles) {
            try {
                const filePath = `Projects Storage/[Category]/${file.targetFolder}/${file.name}`;
                await githubAPI.uploadFile(filePath, file);
                results.uploaded++;
            } catch (error) {
                results.failed++;
                results.errors.push(`${file.name}: ${error.message}`);
            }
        }
        
        hideLoading();
        
        // Show results
        let message = `✅ GitHub Push Complete!\n\n`;
        message += `📄 JSON: ${results.json ? '✅ Updated' : '❌ Failed'}\n`;
        message += `📁 Files: ${results.uploaded} uploaded, ${results.failed} failed\n`;
        
        if (results.errors.length > 0) {
            message += `\n❌ Errors:\n${results.errors.join('\n')}`;
        }
        
        alert(message);
        
        // Clear selections if successful
        if (results.uploaded > 0) {
            clearFileSelections();
        }
        
    } catch (error) {
        hideLoading();
        alert('❌ GitHub push failed: ' + error.message);
    }
}
```

---

## Shared Utilities

### Including Utilities

```html
<script src="../shared-utilities.js"></script>
<script src="../tags-system.js"></script>
<script src="../github-api-handler.js"></script>
```

### Available Utilities

**PaginationManager:**

```javascript
const pagination = new PaginationManager(10);  // 10 items per page

function renderItemsList() {
    const filteredItems = filterItems(categoryData.items);
    const pageItems = pagination.getPageItems(filteredItems);
    
    // Render page items
    displayItems(pageItems);
    
    // Render pagination controls
    renderPaginationControls(filteredItems.length);
}

function nextPage() {
    if (pagination.nextPage(totalItems)) {
        renderItemsList();
    }
}

function previousPage() {
    if (pagination.previousPage()) {
        renderItemsList();
    }
}
```

**SelectionManager:**

```javascript
const selection = new SelectionManager();

function toggleSelect(id) {
    selection.toggle(id);
    updateSelectionUI();
}

function selectAll() {
    const allIds = categoryData.items.map(i => i.id);
    selection.selectAll(allIds);
    updateSelectionUI();
}

function deleteSelected() {
    const selected = selection.getSelected();
    // ... delete logic
    selection.clear();
}
```

**CacheManager:**

```javascript
const cache = new CacheManager('[category]_cache', 3600000);  // 1 hour

// Save
function saveToCache() {
    cache.save(categoryData);
}

// Load
function loadFromCache() {
    const cached = cache.load();
    if (cached) {
        categoryData = cached;
        return true;
    }
    return false;
}

// Clear
function clearCache() {
    cache.clear();
}
```

**TagsManager:**

```javascript
const tagsManager = new TagsManager();

// Get all tags
const allTags = tagsManager.getAllTags(categoryData.items);

// Filter by tags (AND logic)
const filtered = tagsManager.filterByTagsAND(categoryData.items, ['python', 'beginner']);

// Filter by tags (OR logic)
const filtered2 = tagsManager.filterByTagsOR(categoryData.items, ['python', 'javascript']);

// Get popular tags
const popular = tagsManager.getPopularTags(categoryData.items, 10);
```

**Security:**

```javascript
// Sanitize HTML (prevent XSS)
const clean = Security.sanitizeHTML(userInput);

// Validate URL
if (Security.isValidURL(url)) {
    // Safe to use
}

// Escape for display
const escaped = Security.escapeHTML(text);
```

**Debounce (for search):**

```javascript
const debouncedSearch = debounce((query) => {
    performSearch(query);
}, 300);  // 300ms delay

searchInput.addEventListener('input', (e) => {
    debouncedSearch(e.target.value);
});
```

---

## Theme & Styling Rules

### Color System

**Primary Colors (Global):**

```css
:root {
    --primary-red: #CC0000;           /* Main theme color */
    --bg-dark: #0a0a0a;               /* Page background */
    --card-bg: rgba(20, 20, 20, 0.95); /* Card background */
    --text-primary: #ffffff;           /* Main text */
    --text-secondary: rgba(255, 255, 255, 0.7); /* Secondary text */
}
```

**Category-Specific Accents (Optional):**

```css
/* Programming */
:root {
    --primary: #00cc44;  /* Green accent */
}

/* Arduino */
:root {
    --primary: #00897B;  /* Teal accent */
}

/* MATLAB */
:root {
    --primary: #0076A8;  /* Blue accent */
}
```

**Usage:**
- Border hover: Use `--primary-red` (consistent)
- Icon colors: Can use category accent
- Button primary: Use `--primary-red`
- Button secondary: Can use category accent

### Desktop Card Consistency

**All cards MUST use:**

```css
.main-project-card {
    /* Same background */
    background: linear-gradient(135deg, rgba(20, 20, 20, 0.95) 0%, rgba(30, 30, 30, 0.9) 100%);
    
    /* Same border */
    border: 1px solid rgba(204, 0, 0, 0.3);
    
    /* Same shadow */
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3),
                inset 0 1px 1px rgba(255, 255, 255, 0.05),
                0 0 20px rgba(204, 0, 0, 0.15);
    
    /* Same hover */
    &:hover {
        border-color: var(--primary-red);
        transform: translateY(-8px);
    }
}
```

**DO NOT create custom card classes like** `.programming-card` or `.arduino-specific-card`. All styling is derived from `.main-project-card`.

### Mobile Card Consistency

**Base styling (same for all):**

```css
.category-card {
    background: linear-gradient(135deg, #1a1a1a 0%, #252525 100%);
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3),
                inset 0 1px 1px rgba(255, 255, 255, 0.1),
                0 0 20px rgba(204, 0, 0, 0.15);
}
```

**Only icon differs:**

```css
.programming-card .category-icon {
    background: linear-gradient(135deg, #00cc44 0%, #00ff66 100%);
}
```

**Count badge (same red for all):**

```css
.category-count {
    background: rgba(204, 0, 0, 0.2);
    color: #CC0000;
    border: 1px solid rgba(204, 0, 0, 0.4);
}
```

---

## Checklist for New Category

### Phase 1: Files & Structure

- [ ] Create folder: `Projects Code/[category-name]/`
- [ ] Create `[category]-listing.html` (copy template, add bg-system)
- [ ] Create `[category]-viewer.html` (copy template, add bg-system)
- [ ] Create `[category]-data.json` (use JSON template)
- [ ] Create folder: `Projects Storage/[CategoryName]/`
- [ ] Create `Only-boss/managers/projects/[category]/[category]-manager.html`

### Phase 2: Desktop Integration

- [ ] Add card to `Projects Code/projects.html`:
  - [ ] Use `.main-project-card` class
  - [ ] Add `data-category="category-name"`
  - [ ] Set unique icon
  - [ ] Link to listing page
- [ ] Add filter button:
  - [ ] `<button data-filter="category-name">Category</button>`
- [ ] Update stats JavaScript:
  - [ ] Add to `projectCounts`: `category: { total: X }`
  - [ ] Increment `totalCategories`
  - [ ] Add to `totalProjects` calculation
  - [ ] Add to `totalItems` calculation

### Phase 3: Mobile Integration

- [ ] Add card to `mobile/projects/projects.html`:
  - [ ] Use `.category-card .category-name-card` structure
  - [ ] Same dark background
  - [ ] Red count badge
- [ ] Add CSS to `mobile/projects/projects.css`:
  - [ ] Only `.category-icon` color differs
- [ ] Update categories stat:
  - [ ] Change count from N to N+1

### Phase 4: Manager Setup

- [ ] Include shared utilities scripts
- [ ] Implement all CRUD operations
- [ ] Add statistics auto-update
- [ ] Add file upload with validation
- [ ] Add storage path hint
- [ ] Add JSON editor + download
- [ ] Add GitHub push integration
- [ ] Add folder structure preview

### Phase 5: Verification

- [ ] **Desktop card:**
  - [ ] Appears in main projects page
  - [ ] Filter button works
  - [ ] Stats count correct
  - [ ] Same theme as other cards
  - [ ] Navigation works
- [ ] **Mobile card:**
  - [ ] Appears in mobile projects page
  - [ ] Same dark background
  - [ ] Unique icon color
  - [ ] Red count badge
  - [ ] Stats count updated
- [ ] **Listing page:**
  - [ ] `background-system.css` included
  - [ ] Full `bg-system-container` wrapper
  - [ ] All 4 scripts loaded
  - [ ] Animated background works
  - [ ] Items load correctly
- [ ] **Viewer page:**
  - [ ] Same background system
  - [ ] Content displays correctly
  - [ ] Actions work (download, run, back)
- [ ] **Manager:**
  - [ ] Create new item works
  - [ ] Edit existing works
  - [ ] Delete works
  - [ ] Statistics update after operations
  - [ ] File upload validation works
  - [ ] GitHub push works
  - [ ] JSON download works

---

## Critical Rules Summary

### MUST HAVE

✅ **Background system on ALL listing/viewer pages:**
- CSS link: `background-system.css`
- Body wrapper: `bg-system-container`
- 5 shapes + 3 orbs + canvas
- 4 scripts: script.js, navbar-autohide.js, fullscreen-init.js, cursor-effects.js

✅ **Theme consistency:**
- Desktop cards: ALL use `.main-project-card` class
- Mobile cards: Same dark bg, only icon color differs
- Primary color: `#CC0000` (red) for all

✅ **Statistics auto-update:**
- After create, edit, delete
- Update main projects page counts

✅ **Manager features:**
- CRUD operations
- File validation
- GitHub integration
- JSON editor

### MUST NOT DO

❌ **DO NOT create custom card classes** for individual categories on desktop
❌ **DO NOT skip background system** on listing/viewer pages
❌ **DO NOT use different base colors** (stick to red theme)
❌ **DO NOT forget to update stats** in main projects page
❌ **DO NOT hardcode file paths** (use dynamic generation)

---

## Support & Troubleshooting

### Common Issues

**Issue:** Listing page looks different from other pages
**Solution:** Check if `background-system.css` is included and `bg-system-container` wrapper is present

**Issue:** Card doesn't appear when filter is clicked
**Solution:** Ensure `data-category` matches `data-filter` value exactly

**Issue:** Stats count doesn't update
**Solution:** Call `updateStatistics()` after every CRUD operation

**Issue:** GitHub push fails
**Solution:** Check token, file size (<100MB), and path format

**Issue:** Files not uploading
**Solution:** Validate file type and size, check GitHub API response

---

## Version History

- **v3.0** (March 6, 2026): Complete template with background system integration
- **v2.0** (January 22, 2026): Added manager system patterns
- **v1.0** (December 2025): Initial project structure guide

---

**End of Document**
