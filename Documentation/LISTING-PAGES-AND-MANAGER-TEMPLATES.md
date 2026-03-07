# New Project Category — Complete Implementation Guide

**Last Updated:** March 7, 2026 (rev 2 — Serial ID system)  
**Purpose:** Step-by-step guide for adding a new project category from scratch — zero confusion, zero mistakes.  
**Reference implementation:** `websites` category (all 9 files) — created March 7, 2026.  

> **ALWAYS copy from `websites`.**  
> `websites-listing.html`, `websites-manager.html`, `websites/websites-listing.html` (mobile) are the most up-to-date live templates. When in doubt, open those files and copy exactly.

---

## Table of Contents

1. [Universal Color Theme — NEVER Change This](#1-universal-color-theme--never-change-this)
2. [Universal Font](#2-universal-font)
3. [Files Checklist — 9 Files to Create/Update](#3-files-checklist--9-files-to-createupdate)
4. [Path Reference Map](#4-path-reference-map)
5. [Step 1 — JSON Data File](#5-step-1--json-data-file)
6. [Step 2 — Desktop Listing Page](#6-step-2--desktop-listing-page)
7. [Step 3 — Mobile Listing Page](#7-step-3--mobile-listing-page)
8. [Step 4 — Admin Manager](#8-step-4--admin-manager)
9. [Step 5 — projects.html (Desktop Hub Card)](#9-step-5--projectshtml-desktop-hub-card)
10. [Step 6 — mobile/projects/projects.html (Mobile Hub Card)](#10-step-6--mobileprojectsprojectshtml-mobile-hub-card)
11. [Step 7 — mobile/projects/projects.css (Mobile Icon CSS)](#11-step-7--mobileprojectsprojectscss-mobile-icon-css)
12. [Step 8 — projects.json (Global Registry)](#12-step-8--projectsjson-global-registry)
13. [Step 9 — category-selector.html (Manager Hub Card)](#13-step-9--category-selectorhtml-manager-hub-card)
14. [Manager Architecture Deep Dive](#14-manager-architecture-deep-dive)
15. [What NOT to Do — Critical Mistakes to Avoid](#15-what-not-to-do--critical-mistakes-to-avoid)
16. [Mobile Navbar — Active State](#16-mobile-navbar--active-state)
17. [Final Verification Checklist](#17-final-verification-checklist)

---

## 1. Universal Color Theme — NEVER Change This

**ALL pages on this website — listings, managers, mobile, desktop — use the identical red theme.**  
There is no category-specific color. No teal for Arduino, no blue for MATLAB, no orange for SolidWorks.  
It is ALL red. Copy these variables exactly into every new file.

```css
/* ===================================================
   UNIVERSAL CSS VARIABLES
   Used in: every listing page, every manager, desktop & mobile
   =================================================== */
:root {
  --primary-red:    #CC0000;
  --dark-red:       #8B0000;
  --light-red:      #FF1744;
  --accent-red:     #FF4444;
  --bg-card:        rgba(26, 26, 26, 0.95);
  --border-red:     rgba(204, 0, 0, 0.3);
  --border-red-hover: rgba(204, 0, 0, 0.65);
  --grid-line:      rgba(204, 0, 0, 0.08);
  --text-primary:   #FFFFFF;
  --text-secondary: rgba(255, 255, 255, 0.8);
  --text-dim:       rgba(255, 255, 255, 0.6);
}

/* Manager pages additionally use: */
:root {
  --bg-black:      #0a0000;
  --bg-deep:       #030000;
  --bg-card:       rgba(18, 4, 4, 0.97);
  --bg-sidebar:    rgba(10, 0, 0, 0.98);
  --border-red:    rgba(139, 0, 0, 0.35);
  --border-mid:    rgba(204, 0, 0, 0.4);
  --text-white:    #FFFFFF;
  --text-muted:    rgba(255, 255, 255, 0.5);
  --grid-line:     rgba(204, 0, 0, 0.06);
  --primary-color: #CC0000;
  --primary-dark:  #8B0000;
  --primary-light: #FF4444;
  --text-primary:  rgba(255, 255, 255, 0.95);
  --text-secondary:rgba(255, 255, 255, 0.6);
}

/* Body background — ALL pages the same */
body {
  background: linear-gradient(180deg, #0a0000 0%, #030000 100%);
  /* Managers use: background: linear-gradient(160deg, #0a0000 0%, #030000 100%); */
}

/* Engineering grid overlay — exact same across ALL pages */
body::before {
  content: '';
  position: fixed;
  inset: 0;
  background-image:
    repeating-linear-gradient(0deg, transparent, transparent 19px, var(--grid-line) 19px, var(--grid-line) 20px),
    repeating-linear-gradient(90deg, transparent, transparent 19px, var(--grid-line) 19px, var(--grid-line) 20px),
    repeating-linear-gradient(45deg, transparent, transparent 39px, rgba(204,0,0,0.04) 39px, rgba(204,0,0,0.04) 40px);
  pointer-events: none;
  opacity: 0.6;
  z-index: 0;
}
/* NOTE: Managers use 40px grid (not 20px) — copy from websites-manager.html */
```

---

## 2. Universal Font

**All pages use the same font stack:**

```css
font-family: 'Noto Sans Bengali', 'Inter', -apple-system, 'Segoe UI', sans-serif;
```

Import Inter from Google Fonts on desktop listing and manager pages:
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
```

> Noto Sans Bengali is listed first to support Bengali text rendering but falls back to Inter automatically. Do not remove it.

---

## 3. Files Checklist — 9 Files to Create/Update

When adding a new project category (e.g. `mycat`), touch exactly these 9 files:

| # | File | Action |
|---|------|--------|
| 1 | `Projects Code/{cat}/{cat}.json` | **CREATE** |
| 2 | `Projects Code/{cat}/{cat}-listing.html` | **CREATE** |
| 3 | `mobile/projects/{cat}/{cat}-listing.html` | **CREATE** |
| 4 | `Only-boss/managers/projects/{cat}/{cat}-manager.html` | **CREATE** |
| 5 | `Projects Code/projects.html` | **EDIT** |
| 6 | `mobile/projects/projects.html` | **EDIT** |
| 7 | `mobile/projects/projects.css` | **EDIT** |
| 8 | `Projects Code/projects.json` | **EDIT** |
| 9 | `Only-boss/managers/projects/category-selector.html` | **EDIT** |

---

## 4. Path Reference Map

### From `Projects Code/{cat}/` (desktop listing)
```
../../Optimization/styles.css
../../Optimization/navbar/desktop-navbar.css
../../Optimization/navbar-autohide.css
../../Optimization/Background/background-system.css
../../mobile/projects/{cat}/{cat}-listing.html    <- mobile redirect target
```

### From `mobile/projects/{cat}/` (mobile listing)
```
../../shared/mobile-common.css
../../shared/mobile-navbar.css
../../shared/page-loading.js
../shared-content-styles.css
../../../Projects Code/{cat}/{cat}.json           <- data fetch
../../shared/mobile-navbar.js
```

### From `Only-boss/managers/projects/{cat}/` (manager)
```
../../../../images/favicon.svg
../../../shared/unified-theme.css
../../../mobile/only-boss-global-mobile.css
../../../mobile/manager-mobile.css
../../shared/unified-token-manager.js
../../shared/central-api-gateway.js
../../../Content-studio/github-content-uploader.js   <- IMPORTANT: exactly this path
../github-api-handler.js
../shared-utilities.js

GITHUB_RAW_URL   = 'https://raw.githubusercontent.com/Akhinoor14/A3KM-Studio/main/Projects%20Code/{cat}/{cat}.json'
GITHUB_REPO_PATH = 'Projects Code/{cat}/{cat}.json'
```

### From `Only-boss/managers/projects/` (category-selector)
```
../../../images/favicon.svg
../../mobile/only-boss-global-mobile.css
../../mobile/manager-mobile.css

Data fetches from category-selector.html:
  ../../Projects Code/{cat}/{cat}.json
```

---

## 5. Step 1 — JSON Data File

**File:** `Projects Code/{cat}/{cat}.json`

```json
{
  "lastUpdated": "YYYY-MM-DDT00:00:00Z",
  "version": "1.0.0",
  "description": "Brief description of this category",
  "statistics": {
    "totalProjects": 0,
    "byCategory": {
      "subcategory1": 0,
      "subcategory2": 0
    },
    "byStatus": {
      "live": 0,
      "development": 0,
      "archived": 0
    }
  },
  "projects": [
    {
      "id": "{cat}-000001",
      "category": "subcategory1",
      "title": "First Entry Title",
      "subtitle": "Short subtitle",
      "description": "Detailed description...",
      "url": "https://example.com",
      "githubRepo": "https://github.com/...",
      "thumbnail": "",
      "techStack": ["HTML", "CSS", "JavaScript"],
      "tags": ["Tag1", "Tag2"],
      "status": "live",
      "featured": true,
      "dateAdded": "YYYY-MM-DD",
      "lastUpdated": "YYYY-MM-DD"
    }
  ]
}
```

**Valid status values:** `live` | `development` | `archived`

> **ID format:** All project IDs use the serial format `{prefix}-000001`, `{prefix}-000002`, etc.  
> Never use plain integers (`1`, `2`) or timestamps (`Date.now()`).  
> The manager's `generateNextId()` assigns these automatically — do not set IDs by hand.

---

## 6. Step 2 — Desktop Listing Page

**File:** `Projects Code/{cat}/{cat}-listing.html`  
**Copy from:** `Projects Code/websites/websites-listing.html` — change only content, never colors.

### Required head imports (exact order):
```html
<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="theme-color" content="#0a0000">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <meta name="description" content="[Category] Projects by Md Akhinoor Islam">
  <title>[Category] Projects - A3KM Studio</title>

  <link rel="icon" type="image/svg+xml" href="../../images/favicon.svg">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <link rel="stylesheet" href="../../Optimization/styles.css">
  <link rel="stylesheet" href="../../Optimization/navbar/desktop-navbar.css">
  <link rel="stylesheet" href="../../Optimization/navbar-autohide.css">
  <link rel="stylesheet" href="../../Optimization/Background/background-system.css">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">

  <!-- Mobile Detection — REQUIRED: redirect mobile users immediately, before any CSS -->
  <script>
    (function() {
      var ua = navigator.userAgent || '';
      var mobile = /android|iphone|ipad|ipod|iemobile|mobile/i.test(ua) ||
                   (navigator.userAgentData && navigator.userAgentData.mobile);
      if (mobile) window.location.replace('../../mobile/projects/{cat}/{cat}-listing.html');
    })();
  </script>

  <style>
    :root {
      --primary-red: #CC0000;
      --dark-red: #990000;
      --light-red: #FF1744;
      --accent-red: #FF4444;
      --bg-card: rgba(26, 26, 26, 0.95);
      --border-red: rgba(204, 0, 0, 0.3);
      --border-red-hover: rgba(204, 0, 0, 0.65);
      --grid-line: rgba(204, 0, 0, 0.08);
      --text-primary: #FFFFFF;
      --text-secondary: rgba(255, 255, 255, 0.8);
      --text-dim: rgba(255, 255, 255, 0.6);
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Noto Sans Bengali', 'Inter', -apple-system, 'Segoe UI', sans-serif;
      color: var(--text-primary);
      background: linear-gradient(180deg, #0a0000 0%, #030000 100%);
      min-height: 100vh;
      overflow-x: hidden;
      padding-top: 85px;   /* REQUIRED — clears the fixed desktop navbar */
      position: relative;
    }
    body::before {
      content: '';
      position: fixed;
      inset: 0;
      background-image:
        repeating-linear-gradient(0deg, transparent, transparent 19px, var(--grid-line) 19px, var(--grid-line) 20px),
        repeating-linear-gradient(90deg, transparent, transparent 19px, var(--grid-line) 19px, var(--grid-line) 20px),
        repeating-linear-gradient(45deg, transparent, transparent 39px, rgba(204,0,0,0.04) 39px, rgba(204,0,0,0.04) 40px);
      pointer-events: none;
      opacity: 0.6;
      z-index: 0;
    }
    .lib-header {
      position: sticky;
      top: 85px;   /* REQUIRED — must match body padding-top */
      z-index: 41;
      /* ... rest of header styles — copy from websites-listing.html */
    }
  </style>
</head>
```

### Body structure:
```html
<body>
  <div class="bg-system-content">

    <!-- Sticky header below navbar -->
    <header class="lib-header">
      <div class="lib-header-left">
        <h1><i class="fas fa-[icon]"></i> [Category] Projects</h1>
        <div class="lib-header-divider"></div>
        <span class="lib-header-subtitle">[Subtitle]</span>
      </div>
      <div class="lib-header-stats">
        <span class="lib-stat-badge">
          <i class="fas fa-layer-group"></i>
          Total: <strong id="totalCount">0</strong>
        </span>
      </div>
    </header>

    <!-- 2-column layout: sidebar + cards grid -->
    <div class="main-content-wrapper">
      <aside class="filter-sidebar">
        <!-- search, filters, sort, view toggle -->
      </aside>
      <main class="content-area">
        <div class="cards-grid" id="cardsContainer"></div>
      </main>
    </div>

  </div>

  <!-- JS imports — always at the bottom -->
  <script src="../../Optimization/script.js"></script>
  <script src="../../Optimization/navbar-autohide.js"></script>
  <script src="../../Optimization/cursor-effects.js" defer></script>
  <script>
    const JSON_FILE = '{cat}.json';
    // fetch -> render -> filter logic
  </script>
</body>
```

### line-clamp CSS rule (ALWAYS include both):
```css
display: -webkit-box;
-webkit-line-clamp: 2;
-webkit-box-orient: vertical;
line-clamp: 2;   /* standard property — MUST be present alongside webkit */
overflow: hidden;
```

---

## 7. Step 3 — Mobile Listing Page

**File:** `mobile/projects/{cat}/{cat}-listing.html`  
**Copy from:** `mobile/projects/websites/websites-listing.html` — only change content, never colors.

### Required head imports (all 4 are mandatory):
```html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
  <meta name="theme-color" content="#0a0000">
  <title>[Category] - A3KM Studio</title>

  <link rel="manifest" href="../../../mobile/manifest.json">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">

  <!-- 4 required mobile CSS imports — paths from mobile/projects/{cat}/ -->
  <link rel="stylesheet" href="../../shared/mobile-common.css">
  <link rel="stylesheet" href="../../shared/mobile-navbar.css">
  <script src="../../shared/page-loading.js"></script>
  <link rel="stylesheet" href="../shared-content-styles.css">

  <style>
    :root {
      --accent: #CC0000;
      --accent-dim: rgba(204, 0, 0, 0.3);
      --accent-bg:  rgba(204, 0, 0, 0.08);
    }
    /* Only override accent color — all base styles from mobile-common.css */
    .content-header { border-bottom: 2px solid rgba(204, 0, 0, 0.3) !important; }
    .content-page-title i { color: var(--accent); }
    .chip.active { background: var(--accent-bg); border-color: var(--accent); color: var(--accent); }
  </style>
</head>
```

### Body skeleton:
```html
<body>
  <div class="content-header">
    <div class="content-header-inner">
      <a href="../projects.html" class="back-btn">
        <i class="fas fa-arrow-left"></i>
      </a>
      <h1 class="content-page-title">
        <i class="fas fa-[icon]"></i>
        [Category Title]
      </h1>
    </div>
  </div>

  <main class="content-main" id="contentMain">
    <!-- Mini stats bar -->
    <div class="mini-stats-bar">
      <div class="mini-stat"><span id="statTotal">0</span><label>Total</label></div>
    </div>

    <!-- Filter chips -->
    <div class="filter-section">
      <div class="filter-chips-row" id="catChips">
        <button class="chip active" data-cat="all">All</button>
      </div>
    </div>

    <!-- Results count -->
    <div class="results-row">
      <div class="results-count-text">Showing <span id="countDisplay">0</span> results</div>
    </div>

    <!-- Cards list -->
    <div id="cardsContainer" style="padding: 0 16px;"></div>
  </main>

  <!-- Mobile Bottom Navigation — REQUIRED on ALL mobile pages, all 6 items -->
  <nav class="mobile-bottom-nav" role="navigation" aria-label="Main mobile navigation">
    <div class="mobile-nav-container">
      <a href="../../home/index.html" class="mobile-nav-item" aria-label="Home">
        <i class="fas fa-home" aria-hidden="true"></i>
        <span class="mobile-nav-label">Home</span>
      </a>
      <a href="../../about/about.html" class="mobile-nav-item" aria-label="About">
        <i class="fas fa-user-circle" aria-hidden="true"></i>
        <span class="mobile-nav-label">About</span>
      </a>
      <a href="../../projects/projects.html" class="mobile-nav-item active" aria-label="Projects">
        <i class="fas fa-folder-open" aria-hidden="true"></i>
        <span class="mobile-nav-label">Projects</span>
      </a>
      <a href="../../content-studio/hub.html" class="mobile-nav-item" aria-label="Content Studio">
        <i class="fas fa-layer-group" aria-hidden="true"></i>
        <span class="mobile-nav-label">Studio</span>
      </a>
      <a href="../../contact/contact.html" class="mobile-nav-item" aria-label="Contact">
        <i class="fas fa-envelope" aria-hidden="true"></i>
        <span class="mobile-nav-label">Contact</span>
      </a>
      <a href="../../../Documentation/index.html" class="mobile-nav-item" aria-label="Website Guide">
        <i class="fas fa-book-open" aria-hidden="true"></i>
        <span class="mobile-nav-label">Guide</span>
      </a>
    </div>
  </nav>

  <!-- JS — required at bottom in this order -->
  <script src="../../shared/mobile-navbar.js"></script>
  <script src="../../pwa-init.js"></script>
  <script src="../../../Optimization/cursor-effects.js" defer></script>
  <script>
    const DATA_URL = '../../../Projects Code/{cat}/{cat}.json';
    // fetch -> render -> filter logic
  </script>
</body>
```

> **Back button** always links to `../projects.html` (one folder up to projects hub).  
> **Projects nav item** gets the `active` class because this is a projects sub-page.

---

## 8. Step 4 — Admin Manager

**File:** `Only-boss/managers/projects/{cat}/{cat}-manager.html`  
**Copy from:** `Only-boss/managers/projects/websites/websites-manager.html` — the ONLY valid current template.

### Head CSS imports (exact — 3 shared CSS files, no more):
```html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">

  <link rel="icon" type="image/svg+xml" href="../../../../images/favicon.svg">
  <title>[Category] Manager - Only Boss</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">

  <!-- Shared manager styles — these 3 files, no others -->
  <link rel="stylesheet" href="../../../shared/unified-theme.css">
  <link rel="stylesheet" href="../../../mobile/only-boss-global-mobile.css">
  <link rel="stylesheet" href="../../../mobile/manager-mobile.css">

  <style>
    :root {
      --primary-red:   #CC0000;
      --dark-red:      #8B0000;
      --accent-red:    #FF1744;
      --light-red:     rgba(204,0,0,0.12);
      --bg-black:      #0a0000;
      --bg-deep:       #030000;
      --bg-card:       rgba(18,4,4,0.97);
      --bg-sidebar:    rgba(10,0,0,0.98);
      --border-red:    rgba(139,0,0,0.35);
      --border-mid:    rgba(204,0,0,0.4);
      --text-white:    #FFFFFF;
      --text-muted:    rgba(255,255,255,0.5);
      --grid-line:     rgba(204,0,0,0.06);
      --primary-color: #CC0000;
      --primary-dark:  #8B0000;
      --primary-light: #FF4444;
      --text-primary:  rgba(255,255,255,0.95);
      --text-secondary:rgba(255,255,255,0.6);
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background: linear-gradient(160deg, var(--bg-black) 0%, var(--bg-deep) 100%);
      color: var(--text-primary);
      font-family: 'Noto Sans Bengali', 'Inter', -apple-system, 'Segoe UI', sans-serif;
      min-height: 100vh;
      position: relative;
      overflow-x: hidden;
      cursor: none;
    }
    body::before {
      content: '';
      position: fixed; top: 0; left: 0; right: 0; bottom: 0;
      background-image:
        repeating-linear-gradient(0deg, transparent, transparent 39px, var(--grid-line) 39px, var(--grid-line) 40px),
        repeating-linear-gradient(90deg, transparent, transparent 39px, var(--grid-line) 39px, var(--grid-line) 40px);
      pointer-events: none; z-index: 0;
    }
    /* ... rest of styles — copy from websites-manager.html */
  </style>
</head>
```

### Header HTML (token status in header — NO manual push button):
```html
<!-- HEADER -->
<div class="header">
  <div class="header-left">
    <div class="header-icon"><i class="fas fa-[icon]"></i></div>
    <div class="header-title">
      <h1>[Category] Manager</h1>
      <p>Manage all [category] entries</p>
    </div>
  </div>
  <div class="header-actions">
    <span id="tokenStatus" class="token-status checking">
      <i class="fas fa-spinner fa-spin"></i> Checking token...
    </span>
    <button id="tokenRefreshBtn" class="token-refresh-btn" title="Refresh token">
      <i class="fas fa-sync-alt"></i>
    </button>
    <button id="tokenDebugBtn" class="token-debug-btn" title="Debug token">
      <i class="fas fa-bug"></i> Debug
    </button>
    <a href="../category-selector.html" class="back-btn">
      <i class="fas fa-arrow-left"></i><span>Back</span>
    </a>
  </div>
</div>
```

> There is **no "Push to GitHub" button in the header**. GitHub saving is done automatically inside each add/edit/delete operation via `pushData()`. The header only shows the live token status.

### Sidebar tabs (exactly 4 — no JSON Editor tab, never):
```html
<nav class="sidebar-nav">
  <div class="tab-list">
    <button class="tab-item" onclick="switchTab('dashboard')">
      <i class="fas fa-chart-bar"></i> Dashboard
    </button>
    <button class="tab-item" onclick="switchTab('add')">
      <i class="fas fa-plus-circle"></i> Add [Item]
    </button>
    <button class="tab-item" onclick="switchTab('manage')">
      <i class="fas fa-list"></i> Manage All
    </button>
    <button class="tab-item" onclick="switchTab('export')">
      <i class="fas fa-cloud-upload-alt"></i> Export / GitHub
    </button>
  </div>
</nav>
```

### Script imports at bottom of `<body>` (exact order, all 5 required):
```html
<!-- 1. Token system -->
<script src="../../shared/unified-token-manager.js"></script>
<!-- 2. API Gateway -->
<script src="../../shared/central-api-gateway.js"></script>
<!-- 3. GitHub content uploader — path goes UP to Content-studio/ -->
<script src="../../../Content-studio/github-content-uploader.js"></script>
<!-- 4. GitHub API handler -->
<script src="../github-api-handler.js"></script>
<!-- 5. Shared utilities -->
<script src="../shared-utilities.js"></script>
<!-- 6. Manager inline script — always last -->
<script>
  /* manager JS here */
</script>
```

> The `github-content-uploader.js` path goes **3 levels up from the manager folder** to reach `Content-studio/`. This is:  
> `../../../Content-studio/github-content-uploader.js`  
> Do not put this file inside the manager folder. Do not change this path.

---

## 14. Manager Architecture Deep Dive

This is the most critical section. All managers — project managers AND content studio managers — follow this exact pattern. Copy it precisely from `websites-manager.html`.

### State & Configuration (two constants only)
```javascript
// ===================================================
// CONFIG — only change these two lines per manager
// ===================================================
const GITHUB_RAW_URL   = 'https://raw.githubusercontent.com/Akhinoor14/A3KM-Studio/main/Projects%20Code/{cat}/{cat}.json';
const GITHUB_REPO_PATH = 'Projects Code/{cat}/{cat}.json';

// Variables
let githubHandler, tokenManager, centralAPI, githubUploader;
let {cat}Data = {
  lastUpdated: '',
  version: '1.0.0',
  description: '[Category] by Md Akhinoor Islam',
  statistics: {},
  projects: []
};

// ID prefix for this category (e.g. 'arduino', 'solid', 'web', 'prog', 'matlab')
const ID_PREFIX = '{cat}';
```

> **GITHUB_RAW_URL** — URL-encode spaces as `%20`. The space in "Projects Code" becomes `Projects%20Code`. Used to read the current live JSON.  
> **GITHUB_REPO_PATH** — Plain path with actual space (not URL-encoded). `'Projects Code/{cat}/{cat}.json'`. Used when writing to GitHub.  
> **ID_PREFIX** — Short lowercase key for this category. Used by `generateNextId()`. Must match the prefix in existing JSON IDs.

### Initialization (always use DOMContentLoaded, not a bare `init()` call)
```javascript
window.addEventListener('DOMContentLoaded', () => {
  // 1. Init all modules
  tokenManager   = new UnifiedTokenManager();
  centralAPI     = CentralAPIGateway.getInstance();   // SINGLETON — not new
  githubUploader = centralAPI.getUploader();
  githubHandler  = new GitHubAPIHandler();

  // 2. Pass token to githubHandler (needed for isAuthenticated() check in error handling)
  const token = tokenManager.loadToken();
  if (token) localStorage.setItem('githubToken', token);
  githubHandler.loadToken();

  // 3. Start
  updateTokenStatus();
  loadData();

  // 4. Auto-refresh every 60 seconds (optional)
  setInterval(() => { loadData(); }, 60000);
});
```

> `CentralAPIGateway.getInstance()` — NOT `new CentralAPIGateway(tokenManager)`. It is a singleton.  
> `centralAPI.getUploader()` returns the shared `githubUploader` instance.

### loadData() — Always fetch from GitHub raw first, local fallback
```javascript
async function loadData() {
  try {
    const r = await fetch(GITHUB_RAW_URL + '?t=' + Date.now());
    if (!r.ok) throw new Error('GitHub raw ' + r.status);
    {cat}Data = await r.json();
  } catch(e) {
    // Fallback to local file (offline / first load)
    try {
      const fb = await fetch('../../../../Projects%20Code/{cat}/{cat}.json?t=' + Date.now());
      {cat}Data = await fb.json();
    } catch { console.warn('Could not load {cat}.json', e); }
  }
  updateDashboard();
  updateSidebarStats();
}
```

> `?t=Date.now()` busts browser/CDN cache. Always append it to all fetch URLs.  
> The local fallback path uses URL-encoded `Projects%20Code` (the folder has a space).

### pushData() — Central save (called by add/edit/delete — NOT by a button)
```javascript
async function pushData(commitMsg) {
  rebuildStatistics();
  {cat}Data.lastUpdated = new Date().toISOString();

  const badge = document.getElementById('tokenStatus');
  const prevHTML = badge.innerHTML;
  const prevClass = badge.className;
  badge.className = 'token-status checking';
  badge.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';

  // Local backup
  try { localStorage.setItem('{cat}_backup', JSON.stringify({cat}Data)); } catch(_){}

  // Progress bar (if present in HTML)
  const _bar = document.getElementById('pushProgressBar');
  if (_bar) { _bar.style.width = '0%'; _bar.parentElement.style.display = 'block'; _bar.style.width = '30%'; }

  try {
    // MANDATORY: check token before uploading
    const tokenStatus = await centralAPI.getStatus();
    if (tokenStatus.token === 'missing' || tokenStatus.token === 'invalid') {
      throw new Error('No valid token');
    }

    if (_bar) _bar.style.width = '70%';

    // Upload via githubUploader (NOT githubHandler.uploadTextFile)
    await githubUploader.uploadFile(
      GITHUB_REPO_PATH,
      JSON.stringify({cat}Data, null, 2),
      commitMsg
    );

    if (_bar) {
      _bar.style.width = '100%';
      setTimeout(() => { _bar.style.width = '0%'; _bar.parentElement.style.display = 'none'; }, 800);
    }
    badge.className = 'token-status active';
    badge.innerHTML = '<i class="fas fa-check-circle"></i> Saved';
    logActivity(commitMsg);
    setTimeout(() => {
      badge.className = 'token-status active';
      badge.innerHTML = '<i class="fas fa-check-circle"></i> Token Active';
    }, 3000);

  } catch(e) {
    if (_bar) { _bar.style.width = '0%'; _bar.parentElement.style.display = 'none'; }
    badge.className = prevClass;
    badge.innerHTML = prevHTML;
    if (!githubHandler.isAuthenticated() || (e.message && e.message.toLowerCase().includes('token'))) {
      if (confirm('GitHub token missing. Configure in Command Center?')) {
        window.location.href = '../../shared/command-center.html?tab=api';
      }
    } else {
      showToast('Push failed: ' + e.message, 'error');
    }
    throw e;
  }
}
```

> **Call `pushData()` from within add/edit/delete, not from a header button.**  
> Example: `await pushData('Add {cat}: ' + title);`

### updateTokenStatus()
```javascript
async function updateTokenStatus() {
  const badge = document.getElementById('tokenStatus');
  badge.className = 'token-status checking';
  badge.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Checking token...';
  try {
    const token = tokenManager.loadToken();
    if (!token) throw new Error('No token');
    const validation = await tokenManager.validateToken(token);
    if (validation.valid) {
      badge.className = 'token-status active';
      badge.innerHTML = '<i class="fas fa-check-circle"></i> Token Active';
      localStorage.setItem('githubToken', token);
      const exportStatus = document.getElementById('exportTokenStatus');
      if (exportStatus) exportStatus.textContent = 'Active';
    } else {
      throw new Error('Invalid');
    }
  } catch(e) {
    badge.className = 'token-status missing';
    badge.innerHTML = '<i class="fas fa-times-circle"></i> Token Missing';
    const exportStatus = document.getElementById('exportTokenStatus');
    if (exportStatus) exportStatus.textContent = 'Missing — go to Command Center';
  }
}

// Token button event listeners
document.getElementById('tokenRefreshBtn').addEventListener('click', updateTokenStatus);
document.getElementById('tokenDebugBtn').addEventListener('click', () => {
  const token = tokenManager.loadToken();
  alert('Token Debug:\nexists: ' + !!token + '\nlength: ' + (token ? token.length : 0) + '\nsource: UnifiedTokenManager');
});
```

### generateNextId() — Always generate IDs with this function
```javascript
/**
 * Returns next serial ID: '{cat}-000001', '{cat}-000002', etc.
 * Scans existing projects for the highest numeric suffix → increments by 1.
 * NEVER use Date.now() or Math.max(ids)+1 directly.
 */
function generateNextId() {
  let max = 0;
  ({cat}Data.projects || []).forEach(p => {
    if (p.id && p.id.startsWith(ID_PREFIX + '-')) {
      const num = parseInt(p.id.slice(ID_PREFIX.length + 1), 10);
      if (!isNaN(num) && num > max) max = num;
    }
  });
  return ID_PREFIX + '-' + String(max + 1).padStart(6, '0');
}
```

> Call `generateNextId()` exactly once per Add operation — at the moment the project object is created, not before.  
> The Add form has a **readonly preview field** (`id="previewProjectId"`) so the user can see the pending ID before submitting. Fill it inside `switchTab()` when switching to `'add'`.

### checkDuplicate() — Warn, never hard-block
```javascript
/**
 * Checks for an exact title match (case-insensitive).
 * Returns the matching project, or null.
 * NEVER call alert()+return — always use confirm() so the user can override.
 */
function checkDuplicate(title, excludeId) {
  const t = title.trim().toLowerCase();
  return ({cat}Data.projects || []).find(p =>
    p.id !== excludeId && p.title.trim().toLowerCase() === t
  ) || null;
}

// Usage inside addProject() — before pushData():
const dup = checkDuplicate(title, null);
if (dup) {
  const ok = confirm(`⚠️ A project titled "${dup.title}" (${dup.id}) already exists.\n\nAdd anyway?`);
  if (!ok) return;
}
```

> Similar-match warnings also use `confirm()`. Hard `alert()` + `return false` blocks are forbidden.

### rebuildStatistics() — Called before every save
```javascript
function rebuildStatistics() {
  const projects = {cat}Data.projects || [];
  {cat}Data.statistics = {
    totalProjects: projects.length,
    byCategory: {},
    byStatus: { live: 0, development: 0, archived: 0 }
  };
  projects.forEach(p => {
    if (p.category) {
      {cat}Data.statistics.byCategory[p.category] =
        ({cat}Data.statistics.byCategory[p.category] || 0) + 1;
    }
    if (p.status && {cat}Data.statistics.byStatus[p.status] !== undefined) {
      {cat}Data.statistics.byStatus[p.status]++;
    }
  });
}
```

### switchTab()
```javascript
function switchTab(name) {
  document.querySelectorAll('.tab-content').forEach(c => c.style.display = 'none');
  document.querySelectorAll('.tab-item').forEach(t => t.classList.remove('active'));
  const content = document.getElementById('tab-' + name);
  if (content) content.style.display = 'block';
  const btn = document.querySelector(`[onclick*="switchTab('${name}')"]`);
  if (btn) btn.classList.add('active');
  localStorage.setItem('{cat}_activeTab', name);

  // Auto-fill the ID preview field whenever the Add tab is opened
  if (name === 'add') {
    const el = document.getElementById('previewProjectId');
    if (el) el.value = generateNextId();
  }
}
```

### Add form — readonly ID preview field
Include this read-only input in the Add tab form, immediately after the Title field:
```html
<div class="form-group">
  <label>Project ID (Auto-generated)</label>
  <input type="text" id="previewProjectId" readonly
         placeholder="Will be assigned on save..."
         style="opacity:0.7; cursor:not-allowed;">
</div>
```
> The actual `id` stored in the JSON is always the result of `generateNextId()` called inside `addProject()` — the preview is just informational.
```

### Activity Log
```javascript
function logActivity(action) {
  const h = JSON.parse(localStorage.getItem('{cat}_history') || '[]');
  h.unshift({ action, timestamp: new Date().toISOString() });
  if (h.length > 20) h.pop();
  localStorage.setItem('{cat}_history', JSON.stringify(h));
}
```

---

## 9. Step 5 — projects.html (Desktop Hub Card)

**File:** `Projects Code/projects.html`  
**Action:** Add a `<div class="main-project-card">` block inside `<main>`.

### Filter system — set `data-category` correctly:

| `data-category` value | Filter button | Use for |
|-----------------------|--------------|---------|
| `cad` | CAD/Design | SolidWorks, FreeCAD, Fusion 360, 3D modeling |
| `electronics` | Electronics | Arduino, circuits, PCB, embedded systems |
| `programming` | Programming | Web, MATLAB, Python, scripts, software |
| `learning` | AI & Learning | AI/ML, datasets, AI tools |

### Card template (verified from `websites` — March 2026):
```html
<!-- [Category] Card -->
<div id="{cat}" class="main-project-card" data-category="{cad|electronics|programming|learning}">
    <div class="main-card-header">
        <div class="main-card-icon">
            <i class="fas fa-[icon]"></i>
        </div>
        <div class="main-card-title-area">
            <h2 class="main-card-title">[Category Full Title]</h2>
            <p class="main-card-subtitle">[Short subtitle line]</p>
            <div class="main-card-tags">
                <span class="tag">[Tag1]</span>
                <span class="tag">[Tag2]</span>
                <span class="tag">[Tag3]</span>
                <span class="tag">[Tag4]</span>
            </div>
        </div>
        <div class="project-count-badge">
            <i class="fas fa-[icon]"></i> [N]+ [Items]
        </div>
    </div>

    <div class="sub-cards-grid">
        <!-- Main sub-card (at minimum one required) -->
        <a href="{cat}/{cat}-listing.html" class="sub-card">
            <div class="sub-card-badge">
                [emoji] All [Items]
            </div>
            <h3 class="sub-card-title">Browse All [Category]</h3>
            <p class="sub-card-description">[Description]</p>
            <div class="sub-card-footer">
                <span class="sub-card-stats" id="{cat}Count">[N]+ [Items]</span>
                <span class="sub-card-link">View All <i class="fas fa-arrow-right"></i></span>
            </div>
        </a>
        <!-- Add more sub-cards for sub-sections if needed -->
    </div>
</div>
```

### Count updater — add inside the existing count-fetching JS block in projects.html:
```javascript
// Fetch [Category] counts
async function fetch{Cat}Counts() {
  try {
    const response = await fetch('{cat}/{cat}.json');
    if (response.ok) {
      const data = await response.json();
      projectCounts.{cat} = { total: data.statistics?.totalProjects || 0 };
    }
  } catch(error) {
    console.warn('Using default {cat} counts:', error);
  }
}

// Then inside the DOM update function (after all fetches):
const {cat}Badge = document.querySelector('#{cat} .project-count-badge');
if ({cat}Badge) {
  {cat}Badge.innerHTML = `<i class="fas fa-[icon]"></i> ${projectCounts.{cat}.total}+ [Items]`;
}
const {cat}CountEl = document.getElementById('{cat}Count');
if ({cat}CountEl) {
  {cat}CountEl.textContent = `${projectCounts.{cat}.total}+ [Items]`;
}
```

### Existing categories reference:
| Card `id` | `data-category` | Filter shown under |
|-----------|----------------|-------------------|
| `solidworks` | `cad` | CAD/Design |
| `electronics-tools` | `electronics` | Electronics |
| `arduino` | `electronics` | Electronics |
| `matlab` | `programming` | Programming |
| `programming` | `programming` | Programming |
| `websites` | `programming` | Programming |

---

## 10. Step 6 — mobile/projects/projects.html (Mobile Hub Card)

**File:** `mobile/projects/projects.html`  
**Action:** Add inside `.category-cards-grid`.

```html
<a href="{cat}/{cat}-listing.html" class="category-card {cat}-card">
    <div class="category-icon">
        <i class="fas fa-[icon]"></i>
    </div>
    <div class="category-content">
        <h3 class="category-title">[Category Title]</h3>
        <p class="category-desc">[Short description]</p>
        <div class="category-count">[N]+ [Items]</div>
    </div>
    <div class="category-arrow">
        <i class="fas fa-chevron-right"></i>
    </div>
</a>
```

---

## 11. Step 7 — mobile/projects/projects.css (Mobile Icon CSS)

**File:** `mobile/projects/projects.css`  
**Action:** Add after the last existing `.xxx-card .category-icon` block.

```css
/* [Category] Card */
.{cat}-card .category-icon {
    background: linear-gradient(135deg,
        rgba(204, 0, 0, 0.2),
        rgba(0, 0, 0, 0.6)
    );
    border: 1px solid rgba(204, 0, 0, 0.4);
    color: #FF6060;
}
```

> The values `rgba(204,0,0,0.2)`, `rgba(204,0,0,0.4)`, `#FF6060` are the SAME for every category. Do not customize the icon gradient or color per category.

---

## 12. Step 8 — projects.json (Global Registry)

**File:** `Projects Code/projects.json`  
**Two edits required:**

**1. Increment `totalProjects` and add to `byCategory`:**
```json
"statistics": {
  "totalProjects": [previous + 1],
  "byCategory": {
    ...existing entries...,
    "{cat}": 0
  }
}
```

**2. Add to `"categories"` object:**
```json
"{cat}": {
  "name": "[Category Full Name]",
  "icon": "fa-[icon]",
  "description": "[Description]",
  "subcategories": ["sub1", "sub2", "sub3"],
  "tags": ["Tag1", "Tag2", "Tag3"]
}
```

---

## 13. Step 9 — category-selector.html (Manager Hub Card)

**File:** `Only-boss/managers/projects/category-selector.html`  
**Three sub-edits:**

### A. Add CSS (in `<style>`, after last `.xxx-card` CSS block):
```css
/* [Category] card */
.{cat}-card {
    border-color: rgba(204, 0, 0, 0.3);
}
.{cat}-card:hover {
    border-color: #CC0000;
    box-shadow: 0 8px 30px rgba(204, 0, 0, 0.2);
}
.{cat}-card .card-icon-wrapper {
    background: linear-gradient(135deg, #CC0000, #8B0000);
}
```

### B. Add HTML card (inside the cards grid, after last existing card):
```html
<div class="category-card {cat}-card" onclick="window.location.href='{cat}/{cat}-manager.html'">
    <div class="card-icon-wrapper">
        <i class="fas fa-[icon]"></i>
    </div>
    <div class="card-content">
        <h3>[Category Title]</h3>
        <p>[Short description of what is managed here]</p>
        <div class="card-stats">
            <div class="stat-item">
                <i class="fas fa-layer-group"></i>
                <span class="{cat}-count">—</span> [Items]
            </div>
        </div>
        <a href="{cat}/{cat}-manager.html" class="card-btn">
            <span>Manage [Category]</span>
            <i class="fas fa-arrow-right"></i>
        </a>
    </div>
</div>
```

### C. Add count loader inside `loadProjectCounts()`:
```javascript
// Inside the existing loadProjectCounts() async function:
const {cat}Response = await fetch('../../Projects Code/{cat}/{cat}.json');
if ({cat}Response.ok) {
    const {cat}Data = await {cat}Response.json();
    const {cat}Count = {cat}Data.projects?.length || 0;
    document.querySelector('.{cat}-count').textContent =
        `${"{cat}Count"} [Item]${"{cat}Count" !== 1 ? 's' : ''}`;
    console.log('{Cat}:', {cat}Count, '[items]');
}
```

> The fetch path from `category-selector.html` is `../../Projects Code/{cat}/{cat}.json` (two levels up to workspace root, then into `Projects Code`).

---

## 15. What NOT to Do — Critical Mistakes to Avoid

### Never use integer IDs or `Date.now()` for project IDs:
```javascript
// WRONG — integer ID
const newProject = { id: projects.length + 1, ... };

// WRONG — timestamp ID
const newProject = { id: Date.now(), ... };
const newProject = { id: `{cat}-${Date.now()}`, ... };

// CORRECT — serial ID via generateNextId()
const newProject = { id: generateNextId(), ... };
```
JSON data files must also use serial IDs (`{cat}-000001`), not integers. When migrating an existing file, renumber all existing IDs to the serial format.

### Never hard-block duplicate submissions:
```javascript
// WRONG — hard block, user cannot override
if (checkDuplicate(title)) {
  alert('⚠️ Duplicate title!');
  return false;
}

// CORRECT — warning only, user can proceed
const dup = checkDuplicate(title, null);
if (dup) {
  const ok = confirm(`⚠️ "${dup.title}" already exists. Add anyway?`);
  if (!ok) return;
}
```

### Never use old upload patterns:
```javascript
// WRONG — old pattern, DO NOT use
const uploader = new GitHubContentUploader();
await uploader.uploadFile(...);

// WRONG — old pattern, DO NOT use
await githubHandler.uploadTextFile(GITHUB_FILE_PATH, content, commitMsg);

// WRONG — old gateway instantiation
const centralAPI = new CentralAPIGateway(tokenManager);

// CORRECT
const centralAPI   = CentralAPIGateway.getInstance();    // singleton
const githubUploader = centralAPI.getUploader();
const tokenStatus  = await centralAPI.getStatus();
if (tokenStatus.token === 'missing' || tokenStatus.token === 'invalid') throw new Error('No token');
await githubUploader.uploadFile(GITHUB_REPO_PATH, content, commitMsg);
```

### Never add a JSON Editor tab:
```javascript
// WRONG — do not add these
switchTab('json');
switchTab('json-editor');
loadJSONEditor();
validateJSON();
formatJSON();
saveJSON();
```
Managers have exactly **4 tabs**: Dashboard, Add, Manage All, Export/GitHub. No JSON editor tab, no exceptions.

### Never hardcode GitHub owner/repo in manager JS:
`GitHubAPIHandler` and `CentralAPIGateway` already have `owner: 'Akhinoor14'` and `repo: 'A3KM-Studio'` hardcoded internally. Do not declare `GITHUB_OWNER` or `GITHUB_REPO` variables.

### Never ask the user to enter a GitHub token in the manager:
The token is set once in Command Center (`Only-boss/dashboard/`). All managers read from the same storage via `UnifiedTokenManager.loadToken()`. Never render a token input field inside a manager page.

### Never load `mobile-universal.css` in a manager page:
```html
<!-- WRONG — not used in project managers -->
<link rel="stylesheet" href="../../../../Optimization/mobile-universal.css">

<!-- CORRECT: use only these 3 -->
<link rel="stylesheet" href="../../../shared/unified-theme.css">
<link rel="stylesheet" href="../../../mobile/only-boss-global-mobile.css">
<link rel="stylesheet" href="../../../mobile/manager-mobile.css">
```

### Never change the color theme per category:
Every page uses `#CC0000` red. No teal, no blue, no orange, no green.

### Never forget `line-clamp: 2` alongside `-webkit-line-clamp: 2`:
```css
/* WRONG — standard property missing */
-webkit-line-clamp: 2;

/* CORRECT — both are required */
-webkit-line-clamp: 2;
line-clamp: 2;
```

### Never omit the mobile redirect script on desktop listing pages:
Without it, mobile users see the broken desktop layout. It must be in `<head>`, before any CSS.

### Never set `padding-top` to anything other than `85px` on desktop listing body:
The fixed desktop navbar is exactly 85px. `.lib-header` must be `position: sticky; top: 85px;`.

### Never call `githubUploader.uploadFile()` without checking token first:
Always check `centralAPI.getStatus()` before uploading. This is already done inside `pushData()` — use `pushData()` everywhere and you won't need to check manually.

---

## 16. Mobile Navbar — Active State

On mobile listing pages under `/projects/`, the Projects nav item gets `active`:

```html
<a href="../../projects/projects.html" class="mobile-nav-item active" aria-label="Projects">
```

Other active class rules: Home pages → Home item active. Studio pages → Studio item active. About pages → About item active.

---

## 17. Final Verification Checklist

Run this check after creating all 9 files. 0 errors required before committing.

**Desktop Listing `{cat}-listing.html`:**
- [ ] Mobile detection redirect in `<head>` before any CSS or styles
- [ ] `padding-top: 85px` on body
- [ ] `.lib-header { position: sticky; top: 85px; }`
- [ ] 4 CSS imports: styles.css, desktop-navbar.css, navbar-autohide.css, background-system.css
- [ ] Body background: `linear-gradient(180deg, #0a0000 0%, #030000 100%)`
- [ ] Data fetched from `{cat}.json` in JS
- [ ] Both `-webkit-line-clamp: 2` AND `line-clamp: 2` in card CSS

**Mobile Listing `mobile/projects/{cat}/{cat}-listing.html`:**
- [ ] 4 mobile CSS imports: mobile-common.css, mobile-navbar.css, page-loading.js, shared-content-styles.css
- [ ] Bottom nav with all 6 items present
- [ ] Projects nav item has `active` class
- [ ] Back button links to `../projects.html`
- [ ] Data fetch path: `../../../Projects Code/{cat}/{cat}.json`
- [ ] `mobile-navbar.js` and `pwa-init.js` scripts at bottom

**Manager `Only-boss/managers/projects/{cat}/{cat}-manager.html`:**
- [ ] 3 shared CSS files: unified-theme.css, only-boss-global-mobile.css, manager-mobile.css
- [ ] Font: `'Noto Sans Bengali', 'Inter', -apple-system, 'Segoe UI', sans-serif`
- [ ] Script order: unified-token-manager → central-api-gateway → `../../../Content-studio/github-content-uploader.js` → github-api-handler → shared-utilities
- [ ] `GITHUB_RAW_URL` with `%20` for the space in "Projects Code"
- [ ] `GITHUB_REPO_PATH` with plain space: `'Projects Code/{cat}/{cat}.json'`
- [ ] Init: `CentralAPIGateway.getInstance()` (NOT `new CentralAPIGateway(...)`)
- [ ] `githubUploader = centralAPI.getUploader()`
- [ ] `pushData()` checks `centralAPI.getStatus()` before calling `githubUploader.uploadFile()`
- [ ] Header: tokenStatus + tokenRefreshBtn + tokenDebugBtn + back-btn → `../category-selector.html`
- [ ] NO push button in header, NO JSON Editor tab
- [ ] Exactly 4 tabs: Dashboard, Add, Manage All, Export/GitHub
- [ ] `switchTab()`, `loadData()`, `pushData()`, `updateTokenStatus()`, `rebuildStatistics()` all present
- [ ] `logActivity()` present and called from `pushData()`
- [ ] `generateNextId()` present — returns `{prefix}-000001` format, never integers or timestamps
- [ ] `ID_PREFIX` constant declared matching the JSON ID prefix
- [ ] Add form has a readonly `id="previewProjectId"` input field
- [ ] `switchTab('add')` auto-fills `previewProjectId` via `generateNextId()`
- [ ] `checkDuplicate()` uses `confirm()` — no hard `alert()+return false`
- [ ] JSON data file IDs use serial format (`{cat}-000001`), not integers or timestamps

**Hub pages:**
- [ ] `projects.html` — new `main-project-card` div with correct `data-category`
- [ ] `projects.html` — count fetch function added and wired
- [ ] `mobile/projects/projects.html` — new `category-card` link
- [ ] `mobile/projects/projects.css` — new `.{cat}-card .category-icon` CSS block
- [ ] `projects.json` — `totalProjects` incremented, new key in `byCategory`, new entry in `categories`
- [ ] `category-selector.html` — new card HTML, new CSS, new count fetch inside `loadProjectCounts()`

**Run get_errors on all touched files. Must be 0 errors before done.**

---

**Maintainer:** Md Akhinoor Islam  
**Reference implementation:** `websites` category (all 9 files) — March 7, 2026  
**Most up-to-date manager template:** `Only-boss/managers/projects/websites/websites-manager.html`