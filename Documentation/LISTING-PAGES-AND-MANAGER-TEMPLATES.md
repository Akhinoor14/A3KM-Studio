# Listing Pages & Manager Templates Guide

**Last Updated:** March 6, 2026  
**Purpose:** Understand theme consistency, API patterns, and template application across Content & Project systems

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Listing Page Patterns](#listing-page-patterns)
3. [Manager API Architecture](#manager-api-architecture)
4. [Theme Consistency Rules](#theme-consistency-rules)
5. [Template Application Guide](#template-application-guide)
6. [File Locations Reference](#file-locations-reference)

---

## 1. Overview

The website has **two parallel systems** with similar UI patterns but different backend architectures:

| System | Purpose | API Pattern | Location |
|--------|---------|-------------|----------|
| **Content Studio** | Books, Papers, Posts, Videos, Vlogs | Unified Token Manager + Content Uploader | `Content Studio/` |
| **Projects** | Arduino, MATLAB, SolidWorks, Programming | GitHub API Handler + Utilities | `Projects Code/` |

Both systems have:
- **Listing Pages** - Public-facing content browsers (fetch from local JSON)
- **Managers** - Admin panels for content upload (push to GitHub via API)

---

## 2. Listing Page Patterns

### 2.1 Content Listing Pages

**Example:** [book-listing-new.html](../Content Studio/books-pdfs/book-listing-new.html)

```html
<!-- Theme: Red (#CC0000) -->
<style>
  :root {
    --primary-red: #CC0000;
    --dark-red: #8B0000;
    --light-red: #FF1744;
    --bg-dark: #000000;
    --bg-card: rgba(15, 15, 15, 0.95);
  }
  
  body {
    background: linear-gradient(180deg, #0a0000 0%, #030000 100%);
  }
</style>

<!-- Data Source -->
<script>
  const response = await fetch('books.json');
  const data = await response.json();
</script>
```

**Key Features:**
- ✅ Fixed top navbar (desktop-navbar.css)
- ✅ Sticky lib-header with stats badges
- ✅ Left sidebar filters (search, category, tag)
- ✅ Card grid layout with hover effects
- ✅ Mobile detection redirect
- ❌ No GitHub API calls (only reads local JSON)

---

### 2.2 Project Listing Pages

**Example:** [programming-listing.html](../Projects Code/programming/programming-listing.html)

```html
<!-- Theme: Green (#00cc44) -->
<style>
  :root {
    --primary: #00cc44;
    --dark-primary: #008822;
    --light-primary: #33ff77;
    --bg-dark: #000000;
    --bg-card: rgba(0, 15, 5, 0.95);
  }
  
  body {
    background: linear-gradient(180deg, #000a02 0%, #000300 100%);
  }
</style>

<!-- Background System -->
<link rel="stylesheet" href="../../Optimization/Background/background-system.css">

<!-- Data Source -->
<script>
  const response = await fetch('programs.json');
  const data = await response.json();
</script>
```

**Key Features:**
- ✅ Fixed top navbar (desktop-navbar.css)
- ✅ Sticky lib-header with stats badges
- ✅ Left sidebar filters (language, difficulty, tags)
- ✅ Card grid layout with syntax highlighting
- ✅ Mobile detection redirect
- ✅ Background system integration (animated gradient)
- ❌ No GitHub API calls (only reads local JSON)

---

### 2.3 Common Listing Page Structure

Both Content and Project listing pages share this HTML structure:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <!-- Mobile Detection (redirects to mobile/ version) -->
  <script>
    if (isMobile()) {
      window.location.replace('../../mobile/.../listing.html');
    }
  </script>
  
  <!-- Stylesheets -->
  <link rel="stylesheet" href="../../Optimization/styles.css" />
  <link rel="stylesheet" href="../../Optimization/navbar-autohide.css">
  <link rel="stylesheet" href="../../Optimization/navbar/desktop-navbar.css">
  <link rel="stylesheet" href="../../Optimization/Background/background-system.css"> <!-- Projects only -->
</head>

<body>
  <!-- Desktop Navbar (injected by desktop-navbar.css) -->
  
  <!-- Lib Header (Sticky) -->
  <header class="lib-header">
    <div class="lib-header-left">
      <h1><i class="fas fa-icon"></i> Title</h1>
      <div class="lib-header-divider"></div>
      <span class="lib-header-subtitle">Subtitle</span>
    </div>
    <div class="lib-header-stats">
      <span class="lib-stat-badge">
        <i class="fas fa-layer-group"></i>
        Total: <strong id="totalCount">0</strong>
      </span>
      <!-- More stat badges -->
    </div>
  </header>
  
  <!-- Main Content Wrapper (2-Column) -->
  <div class="main-content-wrapper">
    <!-- Left Sidebar (Filters) -->
    <aside class="filter-sidebar">
      <div class="filter-header">
        <h3><i class="fas fa-sliders-h"></i> Filters</h3>
      </div>
      
      <div class="filter-section">
        <div class="filter-section-title">
          <i class="fas fa-search"></i> Search
        </div>
        <div class="search-box">
          <input type="text" id="searchInput" class="search-input" placeholder="Search...">
          <i class="fas fa-search search-icon"></i>
        </div>
      </div>
      
      <!-- More filter sections -->
    </aside>
    
    <!-- Right Content Area (Cards) -->
    <main class="content-area">
      <div class="cards-grid" id="cardsContainer">
        <!-- Cards rendered by JavaScript -->
      </div>
    </main>
  </div>
  
  <!-- JavaScript -->
  <script>
    // Fetch JSON
    const response = await fetch('data.json');
    const data = await response.json();
    
    // Render cards
    // Filter logic
    // Search logic
  </script>
</body>
</html>
```

---

## 3. Manager API Architecture

### 3.1 Content Manager API Stack

**File Path:** `Only-boss/managers/Content-studio/[name]-manager.html`

```html
<!-- Content Manager Scripts -->
<script src="../shared/unified-token-manager.js"></script>
<script src="../shared/central-api-gateway.js"></script>
<script src="github-content-uploader.js"></script>
<script src="content-manager.js"></script> <!-- Optional: specific manager logic -->
```

**API Flow:**
```
User fills form
    ↓
Content Manager validates data
    ↓
github-content-uploader.js prepares payload
    ↓
central-api-gateway.js handles GitHub API calls
    ↓
unified-token-manager.js provides token
    ↓
Push to GitHub repo (Content-storage/content.json + files)
```

**Key Scripts:**

| Script | Purpose | Location |
|--------|---------|----------|
| `unified-token-manager.js` | Token storage, validation, refresh | `managers/shared/` |
| `central-api-gateway.js` | GitHub API wrapper (fetch with auth) | `managers/shared/` |
| `github-content-uploader.js` | Content-specific upload logic | `managers/Content-studio/` |

**GitHub API Calls:**
- `GET /repos/{owner}/{repo}/contents/{path}` - Read existing JSON
- `PUT /repos/{owner}/{repo}/contents/{path}` - Update JSON file
- `GET /repos/{owner}/{repo}/contents/{path}` - Fetch file SHA
- Uses `unified-token-manager` for authentication

---

### 3.2 Project Manager API Stack

**File Path:** `Only-boss/managers/projects/[category]/[category]-manager.html`

```html
<!-- Project Manager Scripts -->
<script src="../shared-utilities.js"></script>
<script src="../github-api-handler.js"></script>
<script src="../version-history.js"></script>
<script src="../tags-system.js"></script>
<script src="../advanced-search.js"></script>
<script src="../analytics-dashboard.js"></script>
<script src="../readme-generator.js"></script>
```

**API Flow:**
```
User fills form
    ↓
Manager validates data
    ↓
github-api-handler.js prepares project payload
    ↓
version-history.js adds version tracking
    ↓
tags-system.js manages tags/categories
    ↓
Push to GitHub repo (Projects-storage/[category]/projects.json + files)
```

**Key Scripts:**

| Script | Purpose | Location |
|--------|---------|----------|
| `shared-utilities.js` | Common utilities (validation, formatting) | `managers/projects/` |
| `github-api-handler.js` | GitHub API wrapper for projects | `managers/projects/` |
| `version-history.js` | Version tracking & changelog | `managers/projects/` |
| `tags-system.js` | Tag management & filtering | `managers/projects/` |
| `analytics-dashboard.js` | Stats & analytics | `managers/projects/` |
| `readme-generator.js` | Auto-generate README files | `managers/projects/` |

**GitHub API Calls:**
- `GET /repos/{owner}/{repo}/contents/Projects-storage/{category}/projects.json`
- `PUT /repos/{owner}/{repo}/contents/Projects-storage/{category}/projects.json`
- `PUT /repos/{owner}/{repo}/contents/Projects-storage/{category}/{files}`
- Uses localStorage `githubToken` for authentication

---

### 3.3 Key Differences: Content vs Project APIs

| Feature | Content Managers | Project Managers |
|---------|-----------------|------------------|
| **Token Storage** | Unified Token Manager (centralized) | localStorage `githubToken` |
| **API Wrapper** | `central-api-gateway.js` | `github-api-handler.js` |
| **Upload Logic** | `github-content-uploader.js` | Embedded in manager HTML |
| **Version Control** | Basic (timestamp only) | Advanced (`version-history.js`) |
| **Tag System** | Inline in manager | Separate (`tags-system.js`) |
| **Analytics** | Basic stats | Advanced dashboard |
| **README Generation** | Manual | Automated (`readme-generator.js`) |
| **File Structure** | `Content-storage/content.json` | `Projects-storage/{category}/projects.json` |

---

## 4. Theme Consistency Rules

### 4.1 Color Schemes by Section

| Section | Primary Color | Dark Variant | Light Variant | Use Case |
|---------|--------------|--------------|---------------|----------|
| **Books** | `#CC0000` (Red) | `#8B0000` | `#FF1744` | Content Studio |
| **Papers** | `#1E88E5` (Blue) | `#0D47A1` | `#42A5F5` | Content Studio |
| **Posts** | `#7B1FA2` (Purple) | `#4A148C` | `#9C27B0` | Content Studio |
| **Videos** | `#F57C00` (Orange) | `#E65100` | `#FF9800` | Content Studio |
| **Vlogs** | `#D32F2F` (Deep Red) | `#B71C1C` | `#EF5350` | Content Studio |
| **Programming** | `#00cc44` (Green) | `#008822` | `#33ff77` | Projects |
| **Arduino** | `#00897B` (Teal) | `#00695C` | `#00bfa5` | Projects |
| **MATLAB** | `#0076A8` (Blue) | `#004C6D` | `#00a8e8` | Projects |
| **SolidWorks** | `#FF4500` (Orange) | `#CC3700` | `#FF6347` | Projects |

### 4.2 Background Gradients

**Content Pages:**
```css
body {
  background: linear-gradient(180deg, 
    rgba(primary-color-dark, 0.1) 0%, 
    #030000 100%
  );
}

.lib-header {
  background: linear-gradient(160deg,
    rgba(primary-color-dark, 0.35) 0%,
    rgba(primary-color-darkest, 0.25) 50%,
    rgba(15, 2, 2, 0.85) 100%
  );
}
```

**Project Pages:**
```css
body {
  background: linear-gradient(180deg, 
    rgba(primary-color-dark, 0.15) 0%, 
    #000300 100%
  );
}

.lib-header {
  background: linear-gradient(160deg,
    rgba(primary-color-mid, 0.35) 0%,
    rgba(primary-color-dark, 0.25) 50%,
    rgba(2, 15, 5, 0.85) 100%
  );
}
```

### 4.3 CSS Variable Pattern

**Every listing page should define:**

```css
:root {
  /* Primary Colors (adjust per section) */
  --primary: #00cc44;              /* Main brand color */
  --dark-primary: #008822;         /* Darker shade for depth */
  --light-primary: #33ff77;        /* Lighter shade for highlights */
  --accent: #00ff55;               /* Bright accent for emphasis */
  
  /* Universal Colors (same across all pages) */
  --bg-dark: #000000;              /* Pure black background */
  --bg-card: rgba(0, 15, 5, 0.95); /* Card background (adjust RGB slightly) */
  --border-primary: rgba(0, 139, 30, 0.4);  /* Border with primary color */
  --border-strong: rgba(0, 204, 68, 0.8);   /* Strong border */
  --text-primary: #FFFFFF;         /* White text */
  --text-secondary: rgba(255, 255, 255, 0.85); /* Lighter text */
  --text-dim: rgba(255, 255, 255, 0.65);      /* Dimmed text */
}
```

---

## 5. Template Application Guide

### 5.1 When to Apply Books Manager Template

✅ **Use Books Manager as template for:**
- **Content Studio Managers** (Papers, Posts, Videos, Vlogs)
- Any manager that uploads to `Content-storage/` folder
- Managers that need unified token management
- Managers with simple upload flow (no version tracking)

**Books Manager Features to Copy:**
1. **Token Status Badge** (Checking/Active/Missing)
2. **Token Refresh Button** (manual re-validation)
3. **Token Debug Button** (localStorage inspection)
4. **Progress Bar** (5-stage upload process)
5. **Modern Form Styling** (white card backgrounds)
6. **Auto-redirect** (to command center if token missing)

**How to Apply:**

```html
<!-- 1. Add Token Status HTML (in navbar/header) -->
<span id="tokenStatus" class="token-status checking">
  <i class="fas fa-spinner fa-spin"></i>
  Checking token...
</span>
<button id="tokenRefreshBtn" class="token-refresh-btn">
  <i class="fas fa-sync-alt"></i>
</button>
<button id="tokenDebugBtn" class="token-debug-btn">Debug</button>

<!-- 2. Add Progress Bar HTML (before </body>) -->
<div id="progressOverlay" class="progress-overlay"></div>
<div id="progressContainer" class="progress-container">
  <div class="progress-bar">
    <div id="progressFill" class="progress-fill"></div>
  </div>
  <div id="progressText" class="progress-text">Processing...</div>
</div>

<!-- 3. Add Token Status CSS (adjust --primary-color) -->
<style>
.token-status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.token-status.checking {
  background: rgba(255, 193, 7, 0.15);
  border: 1.5px solid rgba(255, 193, 7, 0.4);
  color: #ffc107;
}

.token-status.active {
  background: rgba(76, 175, 80, 0.15);
  border: 1.5px solid rgba(76, 175, 80, 0.4);
  color: #4caf50;
}

.token-status.missing {
  background: rgba(244, 67, 54, 0.15);
  border: 1.5px solid rgba(244, 67, 54, 0.4);
  color: #f44336;
}
</style>

<!-- 4. Add Token Validation JavaScript -->
<script>
async function updateTokenStatus() {
  const tokenBadge = document.getElementById('tokenStatus');
  tokenBadge.className = 'token-status checking';
  tokenBadge.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Checking token...';
  
  try {
    // For Content Managers: Use unified-token-manager
    const token = localStorage.getItem('github_api_token');
    if (!token) throw new Error('No token');
    
    // Test token with GitHub API
    const response = await fetch('https://api.github.com/user', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (response.ok) {
      tokenBadge.className = 'token-status active';
      tokenBadge.innerHTML = '<i class="fas fa-check-circle"></i> Token Active';
    } else {
      throw new Error('Invalid token');
    }
  } catch (error) {
    tokenBadge.className = 'token-status missing';
    tokenBadge.innerHTML = '<i class="fas fa-times-circle"></i> Token Missing';
    
    if (confirm('GitHub token is missing. Configure token now?')) {
      window.location.href = '../shared/command-center.html?tab=api';
    }
  }
}

// Event Listeners
document.getElementById('tokenRefreshBtn').addEventListener('click', updateTokenStatus);
document.getElementById('tokenDebugBtn').addEventListener('click', () => {
  const token = localStorage.getItem('github_api_token') || localStorage.getItem('githubToken');
  alert('🐛 GitHub Token Debug:\n\n' + JSON.stringify({
    exists: !!token,
    length: token ? token.length : 0,
    prefix: token ? token.substring(0, 7) + '...' : 'N/A'
  }, null, 2));
});

// Auto-validate on page load
window.addEventListener('DOMContentLoaded', updateTokenStatus);
</script>
```

---

### 5.2 When to Apply Project Manager Pattern

✅ **Use Project Manager as template for:**
- **Project Category Managers** (Arduino, MATLAB, SolidWorks, Programming)
- Any manager that uploads to `Projects-storage/` folder
- Managers that need version history tracking
- Managers with advanced features (tags, analytics, README generation)

**Project Manager Features:**
1. ✅ All Books Manager UI features (token badge, progress bar)
2. ✅ Version history system
3. ✅ Advanced tag management
4. ✅ Analytics dashboard
5. ✅ README auto-generation
6. ✅ Category selection
7. ✅ Difficulty rating system

**Scripts to Include:**

```html
<!-- Project Manager Script Stack -->
<script src="../shared-utilities.js"></script>
<script src="../github-api-handler.js"></script>
<script src="../version-history.js"></script>
<script src="../tags-system.js"></script>
<script src="../advanced-search.js"></script>
<script src="../analytics-dashboard.js"></script>
<script src="../readme-generator.js"></script>

<script>
  // Initialize all modules
  window.addEventListener('DOMContentLoaded', () => {
    githubHandler = new GitHubAPIHandler();
    versionHistory = new VersionHistoryManager('category_name');
    tagsManager = new TagsManager();
    advancedSearch = new AdvancedSearchManager();
    analyticsInstance = new AnalyticsDashboard([]);
    readmeGenerator = new READMEGenerator();
    
    githubHandler.loadToken();
    updateTokenStatus(); // Books Manager feature
    
    console.log('✅ All advanced features loaded');
  });
</script>
```

---

### 5.3 Template Selection Decision Tree

```
Is it a manager? (Admin upload panel)
│
├─ YES → Is it uploading to Content-storage/ or Projects-storage/?
│  │
│  ├─ Content-storage/ → Use Books Manager Template
│  │                     - unified-token-manager.js
│  │                     - central-api-gateway.js
│  │                     - github-content-uploader.js
│  │                     - Simple upload flow
│  │
│  └─ Projects-storage/ → Use Project Manager Template
│                         - github-api-handler.js
│                         - version-history.js
│                         - tags-system.js
│                         - Advanced features
│
└─ NO → Is it a listing page? (Public content browser)
   │
   ├─ Content section → Use Books Listing Template
   │                    - Red/Blue/Purple theme
   │                    - Filter sidebar
   │                    - Card grid layout
   │                    - Fetch from local JSON
   │
   └─ Project section → Use Programming Listing Template
                        - Green/Teal/Orange theme
                        - Background system
                        - Filter sidebar
                        - Card grid layout
                        - Fetch from local JSON
```

---

## 6. File Locations Reference

### 6.1 Listing Pages

**Content Studio Listing Pages:**
```
Content Studio/
├── books-pdfs/
│   ├── book-listing-new.html       ← Red theme, books.json
│   └── books.json
├── research-papers/
│   ├── paper-listing.html          ← Blue theme, papers.json
│   └── papers.json
├── written-posts/
│   ├── post-listing-new.html       ← Purple theme, posts.json
│   └── posts.json
├── educational-videos/
│   ├── course-listing-new.html     ← Orange theme, courses.json
│   └── courses.json
└── vlogs/
    ├── vlog-listing.html           ← Deep red theme, vlogs.json
    └── vlogs.json
```

**Projects Listing Pages:**
```
Projects Code/
├── programming/
│   ├── programming-listing.html    ← Green theme, programs.json
│   └── programs.json
├── arduino/
│   ├── arduino-projects.html       ← Teal theme, arduino.json
│   └── arduino.json
├── matlab/
│   ├── matlab-projects.html        ← Blue theme, matlab.json
│   └── matlab.json
└── solidworks/
    ├── solidworks-projects.html    ← Orange theme, solidworks.json
    └── solidworks.json
```

### 6.2 Manager Locations

**Content Studio Managers:**
```
Only-boss/managers/Content-studio/
├── books-manager-new.html          ← Template reference (Feb 2026 features)
├── papers-manager.html
├── posts-manager.html
├── educational-videos-manager.html
├── vlogs-manager.html
├── github-content-uploader.js      ← Content-specific upload logic
└── content-manager.js              ← Shared utilities
```

**Project Managers:**
```
Only-boss/managers/projects/
├── programming/
│   └── programming-manager.html    ← Latest (March 2026)
├── arduino/
│   └── arduino-manager.html
├── matlab/
│   └── matlab-manager.html
├── solidworks/
│   └── solidworks-manager.html
├── github-api-handler.js           ← Project API wrapper
├── shared-utilities.js             ← Common utilities
├── version-history.js              ← Version tracking
├── tags-system.js                  ← Tag management
├── advanced-search.js              ← Search features
├── analytics-dashboard.js          ← Stats dashboard
└── readme-generator.js             ← Auto README
```

**Shared Resources:**
```
Only-boss/managers/shared/
├── unified-token-manager.js        ← Content managers token system
├── central-api-gateway.js          ← Content GitHub API wrapper
├── command-center.html             ← Token configuration UI
├── manager-theme.css               ← Universal manager styles
└── upload-form-styles.css          ← Form styling
```

### 6.3 API Location Summary

| Manager Type | Token Storage | API Wrapper | Upload Logic | Location |
|--------------|--------------|-------------|--------------|----------|
| **Content** | `github_api_token` (localStorage via unified-token-manager) | `central-api-gateway.js` | `github-content-uploader.js` | `managers/shared/` + `managers/Content-studio/` |
| **Project** | `githubToken` (localStorage direct) | `github-api-handler.js` | Embedded in manager HTML | `managers/projects/` |

**Key Difference:**
- Content managers use **centralized token management** (`unified-token-manager.js`)
- Project managers use **localStorage direct access** (`localStorage.getItem('githubToken')`)

---

## 7. Best Practices

### 7.1 When Creating New Listing Pages

✅ **DO:**
- Copy structure from existing listing page in same category (Content or Project)
- Maintain color consistency with section theme
- Include mobile detection redirect
- Use local JSON file for data source
- Add desktop-navbar.css integration
- Include filter sidebar with search
- Use card grid layout

❌ **DON'T:**
- Mix Content and Project themes
- Add GitHub API calls to listing pages (they should only read JSON)
- Remove mobile detection
- Use different CSS variable names

### 7.2 When Creating New Managers

✅ **DO:**
- Copy script stack from matching category (Content or Project)
- Add Books Manager UI features (token badge, progress bar)
- Follow folder structure convention
- Test token validation on page load
- Include debug button for troubleshooting
- Add proper error handling

❌ **DON'T:**
- Mix Content and Project API scripts
- Skip token validation
- Remove progress indicators
- Hard-code GitHub tokens in source

### 7.3 Theme Consistency Checklist

Before publishing any page:

- [ ] CSS variables match section color scheme
- [ ] Background gradient uses correct primary color
- [ ] Border colors use rgba() with primary color
- [ ] Button hover states use light variant
- [ ] Card backgrounds use dark variant
- [ ] Text shadows use primary color glow
- [ ] Stats badges use primary color icons
- [ ] Progress bars use primary color fill

---

## 8. Quick Reference Commands

### Find all listing pages:
```powershell
Get-ChildItem -Path "A3KM Studio" -Recurse -Filter "*listing*.html" | Select-Object FullName
```

### Find all managers:
```powershell
Get-ChildItem -Path "Only-boss/managers" -Recurse -Filter "*manager*.html" | Select-Object FullName
```

### Check API script usage:
```powershell
Select-String -Path "Only-boss/managers/**/*.html" -Pattern "github-api-handler|unified-token-manager"
```

### Find JSON data files:
```powershell
Get-ChildItem -Path "A3KM Studio" -Recurse -Filter "*.json" -Exclude "package.json","version.json" | Where-Object { $_.Directory.Name -ne "node_modules" }
```

---

## 9. Summary

### Key Takeaways:

1. **Listing Pages:**
   - Public-facing content browsers
   - Fetch from local JSON files (no GitHub API)
   - Red/Blue/Purple themes for Content
   - Green/Teal/Orange themes for Projects
   - Similar HTML structure across all categories

2. **Content Managers:**
   - Use `unified-token-manager.js` + `central-api-gateway.js`
   - Upload to `Content-storage/content.json`
   - Simpler feature set
   - Centralized token management

3. **Project Managers:**
   - Use `github-api-handler.js` + advanced modules
   - Upload to `Projects-storage/{category}/projects.json`
   - Advanced features (version history, tags, analytics)
   - Direct localStorage token access

4. **Books Manager = Template:**
   - Latest UI/UX features (February 2026)
   - Token status badge system
   - Progress bar with shimmer animation
   - Auto-validation and redirect
   - Modern form styling
   - **Apply these features to ALL managers**

5. **API Locations:**
   - Content: `managers/shared/` + `managers/Content-studio/`
   - Projects: `managers/projects/`
   - Both push to GitHub but use different script stacks

---

**Last Updated:** March 6, 2026  
**Maintainer:** Md Akhinoor Islam  
**System Status:** All managers upgraded with Books Manager features ✅
