# 🚀 Integration Guide - Advanced Features

**Version:** 2.0.0  
**Last Updated:** January 22, 2026

This guide shows how to integrate all 6 advanced features into your existing manager HTML files.

---

## 📦 Module Files Created

All feature modules are located in: `Only-boss/managers/projects/`

1. **github-api-handler.js** (400+ lines)
2. **version-history.js** (350+ lines)
3. **tags-system.js** (450+ lines)
4. **advanced-search.js** (350+ lines)
5. **analytics-dashboard.js** (400+ lines)
6. **readme-generator.js** (350+ lines)

---

## 🔧 Step 1: Update HTML Files

Add these `<script>` tags to **arduino-manager.html**, **matlab-manager.html**, and **solidworks-manager.html** (before closing `</body>` tag):

```html
<!-- Shared Utilities (already included) -->
<script src="shared-utilities.js"></script>

<!-- NEW: Advanced Features -->
<script src="github-api-handler.js"></script>
<script src="version-history.js"></script>
<script src="tags-system.js"></script>
<script src="advanced-search.js"></script>
<script src="analytics-dashboard.js"></script>
<script src="readme-generator.js"></script>

<!-- Chart.js (required for analytics) -->
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

<!-- Your manager's main script -->
<script src="arduino-manager.js"></script>
```

---

## 🎨 Step 2: Add UI Elements

### 2.1 GitHub Upload Button

Add this button in the "Upload New Project" section:

```html
<button id="pushToGitHubBtn" style="background: #333; color: white; padding: 12px 24px; 
        border: none; border-radius: 8px; cursor: pointer; margin-top: 20px;">
    <i class="fab fa-github"></i> Push to GitHub
</button>
```

### 2.2 Version History Button

Add this button in the "Manage Projects" section (near Edit/Delete):

```html
<button onclick="showVersionHistoryForProject({{projectId}})" 
        style="background: #9C27B0; color: white; padding: 8px 16px; 
        border: none; border-radius: 6px; cursor: pointer;">
    <i class="fas fa-history"></i> History
</button>
```

### 2.3 Analytics Tab

Add a new tab in the navigation:

```html
<button class="tab-btn" onclick="switchTab('analytics')">
    <i class="fas fa-chart-line"></i> Analytics
</button>

<!-- Tab Content -->
<div id="analytics-tab" class="tab-content" style="display: none;">
    <div id="analyticsContainer"></div>
</div>
```

### 2.4 Advanced Search Panel

Add this container below the search input:

```html
<div id="advancedSearchPanel"></div>
```

### 2.5 Generate README Button

Add this button to each project card:

```html
<button onclick="generateREADMEForProject({{projectId}})" 
        style="background: #4CAF50; color: white; padding: 8px 16px; 
        border: none; border-radius: 6px; cursor: pointer;">
    <i class="fas fa-file-alt"></i> Generate README
</button>
```

---

## 💻 Step 3: Initialize Modules

Add this code to your manager's JavaScript file (e.g., `arduino-manager.js`):

```javascript
// ===== GLOBAL INSTANCES =====
let githubHandler;
let versionHistory;
let tagsManager;
let advancedSearch;
let analytics;
let readmeGenerator;

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', async () => {
    // Initialize modules
    githubHandler = new GitHubAPIHandler();
    versionHistory = new VersionHistoryManager('arduino_projects');
    tagsManager = new TagsManager();
    advancedSearch = new AdvancedSearchManager();
    analytics = new AnalyticsDashboard([]);
    readmeGenerator = new READMEGenerator();

    // Load GitHub token if saved
    await githubHandler.loadToken();

    // Load projects
    await loadProjects();

    // Setup UI
    setupAdvancedSearch();
    setupGitHubButton();

    console.log('✅ All modules initialized');
});

// ===== ADVANCED SEARCH SETUP =====
function setupAdvancedSearch() {
    createAdvancedSearchPanel(
        'advancedSearchPanel',
        advancedSearch,
        {
            categories: CATEGORIES // Your existing categories object
        },
        () => {
            // Called when search is applied
            const filtered = advancedSearch.applyFilters(allProjects);
            displayProjects(filtered);
        }
    );
}

// ===== GITHUB INTEGRATION =====
function setupGitHubButton() {
    document.getElementById('pushToGitHubBtn').onclick = async () => {
        // Check if token is set
        if (!await githubHandler.verifyToken()) {
            await showGitHubAuthModal(githubHandler);
        }

        // Get current project data from form
        const project = getCurrentProjectFromForm();
        const files = getUploadedFiles();

        // Upload with progress
        try {
            showUploadProgressModal(async (updateProgress) => {
                await githubHandler.uploadProject(
                    project,
                    files,
                    'Projects Code/Arduino/', // Path in repo
                    (current, total) => {
                        updateProgress((current / total) * 100, `${current}/${total} files`);
                    }
                );
            });
            
            Notifications.show('✅ Project pushed to GitHub!', 'success');
        } catch (error) {
            Notifications.show('❌ GitHub upload failed: ' + error.message, 'error');
        }
    };
}

// ===== VERSION HISTORY =====
function showVersionHistoryForProject(projectId) {
    showVersionHistoryModal(projectId, versionHistory, allProjects);
}

// Track changes when saving
function saveProject(projectId, newData) {
    const oldData = allProjects.find(p => p.id === projectId);
    
    // Save to storage
    updateProjectInStorage(newData);
    
    // Add version
    versionHistory.addVersion(
        projectId,
        oldData,
        newData,
        oldData ? 'update' : 'create',
        'admin' // Or get from auth system
    );
    
    console.log('✅ Version saved');
}

// Rollback handler
function rollbackProject(projectId, versionNumber) {
    const restored = versionHistory.rollback(projectId, versionNumber);
    if (restored) {
        // Update UI
        const index = allProjects.findIndex(p => p.id === projectId);
        allProjects[index] = restored;
        saveToStorage();
        displayProjects(allProjects);
        
        Notifications.show('✅ Rolled back to version ' + versionNumber, 'success');
    }
}

// ===== ANALYTICS =====
function switchToAnalyticsTab() {
    analytics.setProjects(allProjects);
    createAnalyticsDashboard('analyticsContainer', analytics);
}

// Update analytics when projects change
function refreshAnalytics() {
    analytics.setProjects(allProjects);
    // Dashboard will auto-refresh on next view
}

// ===== README GENERATOR =====
async function generateREADMEForProject(projectId) {
    const project = allProjects.find(p => p.id === projectId);
    if (!project) return;

    await showREADMEPreview(project, readmeGenerator);
}

// ===== TAGS SYSTEM =====
function addTagsToProject(projectId, tags) {
    const project = allProjects.find(p => p.id === projectId);
    if (!project) return;

    tags.forEach(tag => {
        tagsManager.addTag(project, tag);
    });

    saveProject(projectId, project);
}

function filterByTags(tags, useAND = true) {
    const filtered = useAND 
        ? tagsManager.filterByTagsAND(allProjects, tags)
        : tagsManager.filterByTagsOR(allProjects, tags);
    
    displayProjects(filtered);
}

function showTagCloud() {
    const container = document.getElementById('tagCloudContainer');
    showTagCloud(allProjects, tagsManager, (tag) => {
        // Click handler - filter by this tag
        filterByTags([tag]);
    });
}
```

---

## 🎯 Step 4: Add Tag Input to Forms

Replace your existing category dropdown with tag input:

```javascript
// In your project form
const tagInputContainer = document.getElementById('tagsContainer');
createTagInput(
    tagInputContainer,
    tagsManager,
    allProjects,
    (selectedTags) => {
        console.log('Selected tags:', selectedTags);
        // Save to project
        currentProject.tags = selectedTags;
    }
);
```

---

## 📊 Step 5: Chart.js Setup

Make sure Chart.js is loaded for analytics:

```html
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.js"></script>
```

Or use CDN:
```html
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
```

---

## 🔐 Step 6: GitHub Token Setup

Users need to create a Personal Access Token (PAT):

1. Go to: https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Give it a name: "A3KM Studio Manager"
4. Select scopes:
   - ✅ `repo` (Full control of private repositories)
5. Click "Generate token"
6. Copy the token (starts with `ghp_`)
7. Enter in the GitHub auth modal

**Token is stored in localStorage** (not sent anywhere except GitHub API).

---

## 🧪 Step 7: Testing

### Test GitHub Integration:
```javascript
const github = new GitHubAPIHandler();
await github.setToken('ghp_xxxxxxxxxxxx');
console.log(await github.verifyToken()); // Should return true
```

### Test Version History:
```javascript
const history = new VersionHistoryManager('test_cache');
history.addVersion(1, {title: 'Old'}, {title: 'New'}, 'update', 'admin');
console.log(history.getVersions(1));
```

### Test Tags:
```javascript
const tags = new TagsManager();
const filtered = tags.filterByTagsAND(projects, ['beginner', 'led']);
console.log(filtered);
```

### Test Advanced Search:
```javascript
const search = new AdvancedSearchManager();
search.setFilter('minViews', 100);
console.log(search.applyFilters(projects));
```

### Test Analytics:
```javascript
const analytics = new AnalyticsDashboard(projects);
console.log(analytics.getStatistics());
```

### Test README Generator:
```javascript
const gen = new READMEGenerator();
const markdown = gen.generateREADME(project, 'detailed');
console.log(markdown);
```

---

## 📝 Step 8: Update Project JSON Structure

Add these fields to your project objects:

```json
{
    "id": 1,
    "title": "LED Blink",
    "subtitle": "Basic LED control",
    "description": "...",
    "category": "basics",
    
    // NEW FIELDS
    "tags": ["beginner", "led", "arduino-uno", "digital-output"],
    "difficulty": "beginner",
    "features": [
        "Blinks LED every second",
        "Teaches digitalWrite()",
        "Perfect for beginners"
    ],
    "steps": [
        "Connect LED to pin 13",
        "Upload the code",
        "Watch it blink!"
    ],
    "troubleshooting": [
        {
            "issue": "LED not blinking",
            "solution": "Check polarity (longer leg = positive)"
        }
    ],
    "objective": "Learn basic digital output control",
    "conclusion": "Successfully implemented LED blinking",
    "bannerImage": "path/to/banner.jpg",
    
    // EXISTING FIELDS
    "tinkercadUrl": "...",
    "components": [...],
    "files": {...},
    "views": 0,
    "downloads": 0,
    "dateAdded": "2026-01-22T10:00:00Z",
    "lastUpdated": "2026-01-22T10:00:00Z"
}
```

---

## 🎨 Step 9: Styling Tips

All modals use dark theme. To customize:

```css
/* Override modal styles */
.advanced-filters {
    background: #2d2d2d !important;
}

/* Custom chart colors */
.chart-container {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* Tag cloud */
.tag-item {
    background: #2196F3;
    color: white;
    padding: 8px 16px;
    border-radius: 20px;
    cursor: pointer;
    transition: all 0.3s;
}

.tag-item:hover {
    transform: scale(1.1);
}
```

---

## 🚀 Step 10: Deploy

After integration:

1. Test all features locally
2. Commit changes to GitHub
3. Push to `main` branch
4. Vercel will auto-deploy
5. Test on production URL

---

## 🔍 Troubleshooting

### Chart.js not loading?
```javascript
if (typeof Chart === 'undefined') {
    console.error('Chart.js not loaded! Add to HTML: <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>');
}
```

### GitHub API 404 error?
- Check repository name: `Akhinoor14/A3KM-Studio`
- Verify token has `repo` scope
- Ensure file path is correct (e.g., `Projects Code/Arduino/project-1/`)

### Version history not saving?
- Check localStorage quota: `localStorage.length`
- Clear old history: `versionHistory.clearProjectHistory(projectId)`
- Verify cache key matches: `'arduino_projects'`, `'matlab_projects'`, etc.

### Tags not filtering?
- Ensure tags are lowercase: `tags.map(t => t.toLowerCase())`
- Check tag array exists: `project.tags && Array.isArray(project.tags)`

### Analytics charts not rendering?
- Verify container ID: `<div id="analyticsContainer"></div>`
- Check canvas elements exist
- Ensure Chart.js loaded before calling `createAnalyticsDashboard()`

---

## 📚 API Reference

### GitHub API Handler
```javascript
const github = new GitHubAPIHandler();
await github.setToken(token);
await github.loadToken();
await github.verifyToken();
await github.getFile(path);
await github.putFile(path, content, message);
await github.uploadBinaryFile(path, file);
await github.uploadProject(project, files, basePath, onProgress);
await github.updateJSONFile(path, data);
await github.deleteFile(path);
await github.getRepoStats();
github.clearToken();
```

### Version History Manager
```javascript
const history = new VersionHistoryManager(cacheKey);
history.addVersion(projectId, oldData, newData, action, user);
history.getVersions(projectId);
history.rollback(projectId, versionNumber);
history.getLatestVersion(projectId);
history.detectChanges(oldData, newData);
history.getStats(projectId);
history.clearProjectHistory(projectId);
history.exportHistory();
history.importHistory(data);
```

### Tags Manager
```javascript
const tags = new TagsManager();
tags.getAllTags(projects);
tags.getTagFrequency(projects);
tags.getPopularTags(projects, limit);
tags.filterByTagsAND(projects, tags);
tags.filterByTagsOR(projects, tags);
tags.suggestTags(input, projects);
tags.normalizeTag(tag);
tags.validateTag(tag);
tags.addTag(project, tag);
tags.removeTag(project, tag);
tags.getRelatedProjects(project, allProjects, limit);
```

### Advanced Search Manager
```javascript
const search = new AdvancedSearchManager();
search.setFilter(key, value);
search.getFilter(key);
search.clearFilters();
search.applyFilters(projects);
search.getActiveFiltersCount();
search.exportFilters();
search.importFilters(filters);
```

### Analytics Dashboard
```javascript
const analytics = new AnalyticsDashboard(projects);
analytics.setProjects(projects);
analytics.getStatistics();
analytics.getViewsTrend();
analytics.getCategoryDistribution();
analytics.getTopProjects(limit);
analytics.getActivityHeatmap();
analytics.destroyCharts();
```

### README Generator
```javascript
const gen = new READMEGenerator();
gen.generateREADME(project, templateName);
gen.addTemplate(name, template);
gen.getTemplateNames();
gen.downloadREADME(markdown, filename);
```

---

## ✅ Completion Checklist

- [ ] All 6 modules added to HTML
- [ ] Chart.js CDN included
- [ ] UI buttons added (GitHub, History, README)
- [ ] Analytics tab created
- [ ] Advanced search panel integrated
- [ ] Tag input components added
- [ ] Event handlers connected
- [ ] Module initialization code added
- [ ] GitHub token instructions provided
- [ ] Tested all features locally
- [ ] Updated project JSON structure
- [ ] Committed to GitHub
- [ ] Deployed to production
- [ ] End-to-end testing complete

---

**Need help?** Check console logs for errors. All modules log `✅ Module loaded` messages.

**Performance:** All modules are optimized with caching, debouncing, and lazy loading.

**Security:** XSS protection, input validation, and secure token storage included.

---

*Generated for A3KM Studio Project Managers v2.0*
