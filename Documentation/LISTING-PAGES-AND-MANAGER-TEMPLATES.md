# New Project Category — Complete Implementation Guide

**Last Updated:** March 7, 2026  
**Purpose:** Step-by-step guide for adding a new project category — zero confusion, zero mistakes. Every file, path, and code snippet is verified from real production code.

> **IMPORTANT:** This guide is based on the `websites` category (added March 2026) which is the most up-to-date template. When in doubt, open `websites-listing.html` / `websites-manager.html` and copy exactly.

---

## 📋 Table of Contents

1. [Golden Rule — Universal Theme](#1-golden-rule--universal-theme)
2. [Files Checklist — 9 Files to Create/Update](#2-files-checklist--9-files-to-createupdate)
3. [Path Reference Map](#3-path-reference-map)
4. [Step 1 — JSON Data File](#4-step-1--json-data-file)
5. [Step 2 — Desktop Listing Page](#5-step-2--desktop-listing-page)
6. [Step 3 — Mobile Listing Page](#6-step-3--mobile-listing-page)
7. [Step 4 — Admin Manager](#7-step-4--admin-manager)
8. [Step 5 — projects.html (Desktop Hub Card)](#8-step-5--projectshtml-desktop-hub-card)
9. [Step 6 — mobile/projects/projects.html (Mobile Hub Card)](#9-step-6--mobileprojectsprojectshtml-mobile-hub-card)
10. [Step 7 — mobile/projects/projects.css (Mobile Icon CSS)](#10-step-7--mobileprojectsprojectscss-mobile-icon-css)
11. [Step 8 — projects.json (Global Registry)](#11-step-8--projectsjson-global-registry)
12. [Step 9 — category-selector.html (Manager Hub Card)](#12-step-9--category-selectorhtml-manager-hub-card)
13. [Manager Scripts Deep Dive](#13-manager-scripts-deep-dive)
14. [Mobile Navbar — Active State](#14-mobile-navbar--active-state)
15. [Final Verification Checklist](#15-final-verification-checklist)

---

## 1. Golden Rule — Universal Theme

**ALL pages on this website — listings, managers, mobile, desktop — use the identical red theme.**  
No exceptions. No custom colors per category. When copying a template, never change the color scheme.

```css
/* ═══════════════════════════════════════════════════
   UNIVERSAL CSS VARIABLES — copy these exactly
   Used in: every listing page, every manager, both desktop & mobile
   ═══════════════════════════════════════════════════ */
:root {
  --primary-red:    #CC0000;
  --dark-red:       #8B0000;   /* or #990000 in some files — both OK */
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

body {
  background: linear-gradient(180deg, #0a0000 0%, #030000 100%);
  padding-top: 85px;   /* desktop only — accounts for fixed navbar */
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
```

> ❌ **Old documentation error:** Previous version listed Arduino=Teal, MATLAB=Blue, SolidWorks=Orange etc. That is **WRONG**. All project categories use `#CC0000` red.

---

## 2. Files Checklist — 9 Files to Create/Update

When adding a new project category (e.g. `mycat`), touch exactly these 9 files:

| # | File | Action | Description |
|---|------|--------|-------------|
| 1 | `Projects Code/{cat}/{cat}.json` | **CREATE** | Data source JSON |
| 2 | `Projects Code/{cat}/{cat}-listing.html` | **CREATE** | Desktop listing page |
| 3 | `mobile/projects/{cat}/{cat}-listing.html` | **CREATE** | Mobile listing page |
| 4 | `Only-boss/managers/projects/{cat}/{cat}-manager.html` | **CREATE** | Admin manager |
| 5 | `Projects Code/projects.html` | **EDIT** | Add main card + sub-card |
| 6 | `mobile/projects/projects.html` | **EDIT** | Add category-card `<a>` element |
| 7 | `mobile/projects/projects.css` | **EDIT** | Add `.{cat}-card .category-icon` CSS |
| 8 | `Projects Code/projects.json` | **EDIT** | Add category entry, update totalProjects |
| 9 | `Only-boss/managers/projects/category-selector.html` | **EDIT** | Add manager card + count loader JS |

**Real example:** `websites` category — all 9 done March 7, 2026.

---

## 3. Path Reference Map

Understanding relative paths from each file location saves time:

### From `Projects Code/{cat}/` (desktop listing)
```
../../Optimization/styles.css
../../Optimization/navbar/desktop-navbar.css
../../Optimization/navbar-autohide.css
../../Optimization/Background/background-system.css
../../mobile/projects/{cat}/{cat}-listing.html    ← mobile redirect target
```

### From `mobile/projects/{cat}/` (mobile listing)
```
../../shared/mobile-common.css
../../shared/mobile-navbar.css
../../shared/page-loading.js
../shared-content-styles.css
../../../Projects Code/{cat}/{cat}.json           ← local data fetch
../../shared/mobile-navbar.js
```

### From `Only-boss/managers/projects/{cat}/` (manager)
```
../../../../Optimization/mobile-universal.css
../../../../Optimization/mobile-universal.js
../../../../images/favicon.svg
../../../shared/unified-theme.css
../../../mobile/only-boss-global-mobile.css
../../../mobile/manager-mobile.css
../../shared/unified-token-manager.js
../../shared/central-api-gateway.js
../github-api-handler.js
../shared-utilities.js

JSON_PATH        = '../../../../Projects Code/{cat}/{cat}.json'
GITHUB_FILE_PATH = 'A3KM Studio/Projects Code/{cat}/{cat}.json'
```

### From `Only-boss/managers/projects/` (category-selector)
```
../../../Optimization/mobile-universal.css
../../../Optimization/mobile-universal.js
../../../images/favicon.svg
../../mobile/only-boss-global-mobile.css
../../mobile/manager-mobile.css
```

---

## 4. Step 1 — JSON Data File

**File:** `Projects Code/{cat}/{cat}.json`  
**Template based on:** `Projects Code/websites/websites.json`

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
      "id": 1,
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

**Statuses:** `live` | `development` | `archived`  
**featured:** `true` | `false`

---

## 5. Step 2 — Desktop Listing Page

**File:** `Projects Code/{cat}/{cat}-listing.html`  
**Template based on:** `Projects Code/websites/websites-listing.html` ← copy this file exactly  
**Fallback template:** `Projects Code/Arduino/arduino-projects.html`

### Head section (exact CSS imports):
```html
<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="theme-color" content="#0a0000">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <meta name="description" content="[Category] Projects by Md Akhinoor Islam">
  <meta name="keywords" content="[keyword1], [keyword2]">
  <title>[Category] Projects - A3KM Studio</title>

  <link rel="icon" type="image/svg+xml" href="../../images/favicon.svg">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <link rel="stylesheet" href="../../Optimization/styles.css">
  <link rel="stylesheet" href="../../Optimization/navbar/desktop-navbar.css">
  <link rel="stylesheet" href="../../Optimization/navbar-autohide.css">
  <link rel="stylesheet" href="../../Optimization/Background/background-system.css">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">

  <!-- Immediate Mobile Detection — REQUIRED on all desktop listing pages -->
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
      font-family: 'Inter', -apple-system, sans-serif;
      color: var(--text-primary);
      background: linear-gradient(180deg, #0a0000 0%, #030000 100%);
      min-height: 100vh;
      overflow-x: hidden;
      padding-top: 85px;
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
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 10px;
      padding: 22px 30px;
      background: linear-gradient(160deg, rgba(30,0,0,0.95) 0%, rgba(15,0,0,0.9) 50%, rgba(15,2,2,0.85) 100%);
      border-top: 1px solid rgba(204,0,0,0.2);
      border-bottom: 2px solid rgba(204,0,0,0.45);
      position: sticky; top: 85px;
      overflow: hidden;
      z-index: 41;
      box-shadow: 0 4px 20px rgba(0,0,0,0.6);
    }
    /* ... rest of styles — copy from websites-listing.html */
  </style>
</head>
```

### Required HTML elements in `<body>`:
```html
<body>
  <!-- bg-system-content wrapper (required for background-system.css) -->
  <div class="bg-system-content">
    
    <!-- Desktop Navbar (auto-rendered by desktop-navbar.css + script.js) -->
    
    <!-- Lib Header — sticky below navbar -->
    <header class="lib-header">
      <div class="lib-header-left">
        <h1><i class="fas fa-[icon]"></i> [Category] Projects</h1>
        <div class="lib-header-divider"></div>
        <span class="lib-header-subtitle">[Subtitle text]</span>
      </div>
      <div class="lib-header-stats">
        <span class="lib-stat-badge">
          <i class="fas fa-layer-group"></i>
          Total: <strong id="totalCount">0</strong>
        </span>
        <!-- Add more stat badges as needed -->
      </div>
    </header>

    <!-- Main 2-column layout -->
    <div class="main-content-wrapper">
      
      <!-- Left Sidebar Filters -->
      <aside class="filter-sidebar">
        <!-- search, category filters, sort, view toggle -->
      </aside>

      <!-- Right Cards Grid -->
      <main class="content-area">
        <div class="cards-grid" id="cardsContainer">
          <!-- Cards rendered by JS -->
        </div>
      </main>
    </div>

  </div><!-- end bg-system-content -->

  <!-- JS — always include these -->
  <script src="../../Optimization/script.js"></script>
  <script src="../../Optimization/navbar-autohide.js"></script>
  <script src="../../Optimization/cursor-effects.js" defer></script>

  <!-- Page-specific JS: fetch {cat}.json, render cards, filter logic -->
  <script>
    const JSON_FILE = '{cat}.json';
    // fetch → render → filter
  </script>
</body>
```

> ⚠️ `padding-top: 85px` on body is mandatory — it accounts for the fixed top navbar height.  
> ⚠️ `.lib-header { position: sticky; top: 85px; }` keeps header below navbar.

---

## 6. Step 3 — Mobile Listing Page

**File:** `mobile/projects/{cat}/{cat}-listing.html`  
**Template based on:** `mobile/projects/websites/websites-listing.html` ← copy this exactly

### Head CSS imports (exact, all 4 required):
```html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
  <meta name="theme-color" content="#0a0000">
  <title>[Category] - A3KM Studio</title>

  <link rel="manifest" href="../../../mobile/manifest.json">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <!-- The 4 required mobile CSS imports — paths from mobile/projects/{cat}/ -->
  <link rel="stylesheet" href="../../shared/mobile-common.css">
  <link rel="stylesheet" href="../../shared/mobile-navbar.css">
  <script src="../../shared/page-loading.js"></script>
  <link rel="stylesheet" href="../shared-content-styles.css">

  <style>
    :root {
      --accent: #CC0000;
      --accent-dim: rgba(204, 0, 0, 0.3);
      --accent-bg: rgba(204, 0, 0, 0.08);
    }
    /* Only override accent — all base styles come from mobile-common.css */
    .content-header { border-bottom: 2px solid rgba(204, 0, 0, 0.3) !important; }
    .content-page-title i { color: var(--accent); }
    .chip.active { background: var(--accent-bg); border-color: var(--accent); color: var(--accent); }
    /* ... card styles specific to this category */
  </style>
</head>
```

### Body structure (exact skeleton):
```html
<body>
  <!-- Header -->
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

  <!-- Main scrollable content -->
  <main class="content-main" id="contentMain">

    <!-- Mini stats bar (optional) -->
    <div class="mini-stats-bar">
      <div class="mini-stat"><span id="statTotal">0</span><label>Total</label></div>
      <!-- more stats -->
    </div>

    <!-- Filter chips -->
    <div class="filter-section">
      <div class="filter-row-label">Category</div>
      <div class="filter-chips-row" id="catChips">
        <button class="chip active" data-cat="all">All</button>
        <!-- more chips -->
      </div>
    </div>

    <!-- Results count -->
    <div class="results-row">
      <div class="results-count-text">
        Showing <span id="countDisplay">0</span> results
      </div>
    </div>

    <!-- Cards list -->
    <div id="cardsContainer" style="padding: 0 16px;">
      <!-- Rendered by JS -->
    </div>

  </main>

  <!-- Mobile Bottom Navigation — REQUIRED on ALL mobile pages -->
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
      <a href="../../projects/projects.html" class="mobile-nav-item" aria-label="Projects">
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

  <!-- JS — required at bottom -->
  <script src="../../shared/mobile-navbar.js"></script>
  <script src="../../pwa-init.js"></script>
  <script src="../../../Optimization/cursor-effects.js" defer></script>

  <!-- Page data/logic script (inline or external) -->
  <script>
    const DATA_URL = '../../../Projects Code/{cat}/{cat}.json';
    // fetch → render → filter
  </script>
</body>
```

> ⚠️ The `line-clamp` CSS property must use both vendor and standard:
> ```css
> display: -webkit-box;
> -webkit-line-clamp: 2;
> -webkit-box-orient: vertical;
> line-clamp: 2;   /* ← standard property, must be included too */
> overflow: hidden;
> ```

---

## 7. Step 4 — Admin Manager

**File:** `Only-boss/managers/projects/{cat}/{cat}-manager.html`  
**Template based on:** `Only-boss/managers/projects/websites/websites-manager.html` ← copy this exactly

### Head CSS imports (exact paths from manager/{cat}/):
```html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">

  <!-- Mobile Optimization System -->
  <link rel="stylesheet" href="../../../../Optimization/mobile-universal.css">
  <script src="../../../../Optimization/mobile-universal.js" defer></script>
  
  <link rel="icon" type="image/svg+xml" href="../../../../images/favicon.svg">
  <title>[Category] Manager - Only Boss</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">

  <!-- Manager shared styles -->
  <link rel="stylesheet" href="../../../shared/unified-theme.css">
  <link rel="stylesheet" href="../../../mobile/only-boss-global-mobile.css">
  <link rel="stylesheet" href="../../../mobile/manager-mobile.css">

  <style>
    :root {
      --primary-red: #CC0000;
      --dark-red: #8B0000;
      --accent-red: #FF1744;
      --light-red: rgba(204,0,0,0.12);
      --bg-black: #0a0000;
      --bg-deep: #030000;
      --bg-card: rgba(18,4,4,0.97);
      --bg-sidebar: rgba(10,0,0,0.98);
      --border-red: rgba(139,0,0,0.35);
      --border-mid: rgba(204,0,0,0.4);
      --text-white: #FFFFFF;
      --text-muted: rgba(255,255,255,0.5);
      --grid-line: rgba(204,0,0,0.06);
      --primary-color: #CC0000;
      --primary-dark: #8B0000;
      --primary-light: #FF4444;
      --text-primary: rgba(255,255,255,0.95);
      --text-secondary: rgba(255,255,255,0.6);
    }
    /* ... rest of styles — copy from websites-manager.html */
  </style>
</head>
```

### Script imports at bottom of `<body>` (exact order):
```html
  <!-- GitHub API + Token system — MUST be in this exact order -->
  <script src="../../shared/unified-token-manager.js"></script>
  <script src="../../shared/central-api-gateway.js"></script>
  <script src="../github-api-handler.js"></script>
  <script src="../shared-utilities.js"></script>

  <script>
    // ═══ CONFIG — only change these two ═══
    const JSON_PATH        = '../../../../Projects Code/{cat}/{cat}.json';
    const GITHUB_FILE_PATH = 'A3KM Studio/Projects Code/{cat}/{cat}.json';

    // ═══ INIT ═══
    let githubHandler, tokenManager, centralAPI, catData = null;

    async function init() {
      tokenManager  = new UnifiedTokenManager();
      centralAPI    = new CentralAPIGateway(tokenManager);
      githubHandler = new GitHubAPIHandler();
      await updateTokenStatus();
      await loadData();
    }
    init();

    // ═══ TOKEN STATUS ═══
    async function updateTokenStatus() {
      const badge = document.getElementById('tokenStatus');
      badge.className = 'token-status checking';
      badge.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Checking token...';
      try {
        const token = await tokenManager.validateToken();
        if (token) {
          badge.className = 'token-status active';
          badge.innerHTML = '<i class="fas fa-check-circle"></i> Token Active';
        } else {
          throw new Error('no token');
        }
      } catch (e) {
        badge.className = 'token-status missing';
        badge.innerHTML = '<i class="fas fa-times-circle"></i> Token Missing';
      }
    }

    // Debug button
    document.getElementById('tokenDebugBtn').addEventListener('click', () => {
      const token = tokenManager.getToken ? tokenManager.getToken() : null;
      alert('Token Debug:\nexists: ' + !!token + '\nlength: ' + (token ? token.length : 0) + '\nsource: UnifiedTokenManager');
    });

    // ═══ LOAD DATA ═══
    async function loadData() {
      const r = await fetch(JSON_PATH + '?t=' + Date.now());
      catData = await r.json();
      rebuildStatistics();
      renderCards();
    }

    // ═══ PUSH TO GITHUB ═══
    async function pushToGitHub() {
      const content = JSON.stringify(catData, null, 2);
      await githubHandler.uploadTextFile(GITHUB_FILE_PATH, content, 'Update {cat}.json via manager');
      showToast('Pushed to GitHub ✅', 'success');
    }

    // ═══ note: GitHubAPIHandler is pre-configured ═══
    // owner: 'Akhinoor14', repo: 'A3KM-Studio'
    // Token is provided automatically via UnifiedTokenManager
    // Never add manual GITHUB_OWNER / GITHUB_REPO — they are hardcoded
  </script>
```

### Manager header HTML (token badge in header):
```html
<div class="header-actions">
  <span id="tokenStatus" class="token-status checking">
    <i class="fas fa-spinner fa-spin"></i> Checking token...
  </span>
  <button id="tokenRefreshBtn" class="token-refresh-btn" title="Refresh token" onclick="updateTokenStatus()">
    <i class="fas fa-sync-alt"></i>
  </button>
  <button id="tokenDebugBtn" class="token-debug-btn" title="Debug token">
    <i class="fas fa-bug"></i> Debug
  </button>
  <a href="../category-selector.html" class="back-btn">
    <i class="fas fa-arrow-left"></i><span>Back</span>
  </a>
  <button class="btn-save" onclick="pushToGitHub()">
    <i class="fas fa-cloud-upload-alt"></i><span>Push to GitHub</span>
  </button>
</div>
```

### Manager sidebar tabs:
```html
<nav class="sidebar-nav">
  <div class="tab-list">
    <button class="tab-item active" onclick="switchTab('dashboard')">
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

> ⚠️ **Token system:** Project managers use `UnifiedTokenManager` (Command Center token). NEVER ask the user to manually enter a GitHub token. NEVER hardcode `GITHUB_OWNER` or `GITHUB_REPO` separately — `GitHubAPIHandler` is pre-configured with `owner: 'Akhinoor14'`, `repo: 'A3KM-Studio'`.

---

## 8. Step 5 — projects.html (Desktop Hub Card)

**File:** `Projects Code/projects.html`  
**Action:** Add a new `<div class="main-project-card">` block before `</main>`

### ⚡ Filter System — Pick the right `data-category`

The page has 5 filter buttons (All Projects + 4 category filters). Set `data-category` on the card to match — **no JS change needed**, it hooks in automatically.

| `data-category` value | Filter button label | Use for |
|-----------------------|--------------------|----|
| `cad` | CAD/Design | SolidWorks, FreeCAD, Fusion 360, 3D modeling |
| `electronics` | Electronics | Arduino, circuits, PCB, embedded systems |
| `programming` | Programming | Web, MATLAB, Python, scripts, software |
| `learning` | AI & Learning | AI/ML projects, datasets, AI tools |

> Just set the correct `data-category` — clicking "CAD/Design", "Electronics", "Programming" or "AI & Learning" will show/hide the card automatically.

### Template (verified from `websites` card — March 2026):

```html
<!-- [Category] Card — add before </main> -->
<div id="{cat}" class="main-project-card" data-category="{cad|electronics|programming|learning}">
    <button class="favorite-btn" data-project="{cat}" title="Add to favorites">
        <i class="far fa-heart"></i>
    </button>
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
        <a href="{cat}/{cat}-listing.html" class="sub-card">
            <div class="sub-card-badge">
                [emoji] All [Items]
            </div>
            <h3 class="sub-card-title">Browse All [Category]</h3>
            <p class="sub-card-description">[Description of what's in this category]</p>
            <div class="sub-card-footer">
                <span class="sub-card-stats" id="{cat}Count">[N]+ [Items]</span>
                <span class="sub-card-link">View All <i class="fas fa-arrow-right"></i></span>
            </div>
        </a>
    </div>
</div>
```

**Real example — websites category (reference):**
- `id="websites"`, `data-category="programming"` → appears under "Programming" filter
- `id="{cat}Count"` → auto-updated by the counting JS at bottom of file

**Existing categories + their filter mapping:**
| Card `id` | `data-category` | Visible under filter |
|-----------|----------------|---------------------|
| `solidworks` | `cad` | CAD/Design |
| `electronics-tools` | `electronics` | Electronics |
| `arduino` | `electronics` | Electronics |
| `matlab` | `programming` | Programming |
| `programming` | `programming` | Programming |
| `websites` | `programming` | Programming |

---

## 9. Step 6 — mobile/projects/projects.html (Mobile Hub Card)

**File:** `mobile/projects/projects.html`  
**Action:** Add new `<a class="category-card {cat}-card">` inside `.category-cards-grid`

```html
<!-- [Category] card — add after last existing category-card -->
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

## 10. Step 7 — mobile/projects/projects.css (Mobile Icon CSS)

**File:** `mobile/projects/projects.css`  
**Action:** Add after the last existing `.xxx-card .category-icon` block

```css
/* [Category] Card */
.{cat}-card .category-icon {
  background: linear-gradient(135deg, rgba(204,0,0,0.2), rgba(0,0,0,0.6));
  border: 1px solid rgba(204,0,0,0.4);
  color: #FF6060;
}
```

> All category icon blocks use the same red rgba values — do not change them per category.

---

## 11. Step 8 — projects.json (Global Registry)

**File:** `Projects Code/projects.json`  
**Action:** Two edits:

**1. Increment `totalProjects`:**
```json
"statistics": {
  "totalProjects": [+1 from current value],
  "byCategory": {
    ...existing...,
    "{cat}": [N]    ← add new entry
  }
}
```

**2. Add category object in `"categories"` section:**
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

## 12. Step 9 — category-selector.html (Manager Hub Card)

**File:** `Only-boss/managers/projects/category-selector.html`  
**Action:** Three sub-edits:

### A. Add CSS (in `<style>` block, after last `.xxx-card` CSS entries):
```css
/* [Category] card */
.{cat}-card { border-color: rgba(204,0,0,0.3); }
.{cat}-card:hover { border-color: #CC0000; box-shadow: 0 8px 30px rgba(204,0,0,0.2); }
.{cat}-card .card-icon-wrapper { background: linear-gradient(135deg, #CC0000, #8B0000); }
```

### B. Add `nth-child` animation delay for the new card's position:
```css
/* If new card is position 6 in the grid */
.manager-card:nth-child(6) { animation-delay: 0.6s; }
```

### C. Add HTML card (in the manager cards grid, after last existing card):
```html
<div class="manager-card {cat}-card" onclick="window.location.href='{cat}/{cat}-manager.html'">
  <div class="card-icon-wrapper">
    <i class="fas fa-[icon]"></i>
  </div>
  <div class="card-content">
    <h3>[Category Title]</h3>
    <p>[Short description of what is managed here]</p>
    <div class="card-stats">
      <span class="stat-item">
        <i class="fas fa-layer-group"></i>
        <span class="{cat}-count">—</span> [Items]
      </span>
    </div>
  </div>
  <div class="card-arrow"><i class="fas fa-chevron-right"></i></div>
</div>
```

### D. Add count loader in the JS `loadProjectCounts()` function:
```javascript
// Inside loadProjectCounts() or similar function
fetch('../../../Projects Code/{cat}/{cat}.json')
  .then(r => r.json())
  .then(data => {
    const count = data.statistics ? data.statistics.totalProjects : (data.projects ? data.projects.length : 0);
    document.querySelectorAll('.{cat}-count').forEach(el => el.textContent = count);
  })
  .catch(() => {});
```

---

## 13. Manager Scripts Deep Dive

### How `GitHubAPIHandler` works (no manual config needed):

```javascript
// github-api-handler.js — pre-configured:
// owner: 'Akhinoor14'
// repo:  'A3KM-Studio'

// Usage in manager:
const githubHandler = new GitHubAPIHandler();
// That's it — no owner/repo needed

// Upload a file:
await githubHandler.uploadTextFile(
  'A3KM Studio/Projects Code/{cat}/{cat}.json',  // path in repo
  JSON.stringify(data, null, 2),                  // content
  'Update {cat}.json via manager'                 // commit message
);
```

### How `UnifiedTokenManager` works (Command Center token):

```javascript
const tokenManager = new UnifiedTokenManager();

// Validate token (async):
const token = await tokenManager.validateToken();
// Returns token string if valid, null if missing/invalid

// The token is set ONCE in Command Center (Only-boss/dashboard/)
// All managers read from the same storage key
// NEVER ask user to enter token in manager page
```

### Script load order (must be respected):
```html
<!-- 1. Token system first -->
<script src="../../shared/unified-token-manager.js"></script>
<!-- 2. API gateway (uses token manager) -->
<script src="../../shared/central-api-gateway.js"></script>
<!-- 3. GitHub handler (uses token from unified-token-manager) -->
<script src="../github-api-handler.js"></script>
<!-- 4. Shared utilities (optional, used by some managers) -->
<script src="../shared-utilities.js"></script>
<!-- 5. Your inline manager script last -->
<script> /* init() goes here */ </script>
```

---

## 14. Mobile Navbar — Active State

The `mobile-navbar.js` script auto-detects which page is active by matching URL path against nav item `href` values. No manual `active` class needed **except** on the Projects nav item in the bottom navbar HTML — add it when on any project sub-page:

```html
<!-- Projects nav item on listing pages that are under /projects/ -->
<a href="../../projects/projects.html" class="mobile-nav-item active" aria-label="Projects">
```

> Only set `active` on the nav item that matches the current page's section. On homepage, `active` goes on Home item. On studio pages, on Studio item, etc.

**Desktop redirect from mobile:** `mobile-navbar.js` auto-redirects desktop users visiting mobile pages to the equivalent desktop URL. The mapping is defined inside the JS file — if adding a new page, add its mapping:

```javascript
// In mobile-navbar.js → getDesktopEquivalentPath()
{ mobile: '/mobile/projects/{cat}/{cat}-listing.html', desktop: '/Projects Code/{cat}/{cat}-listing.html' },
```

---

## 15. Final Verification Checklist

After creating all 9 files, verify:

**Desktop Listing:**
- [ ] Mobile detection redirect points to correct `../../mobile/projects/{cat}/{cat}-listing.html`
- [ ] `padding-top: 85px` on body
- [ ] `.lib-header { position: sticky; top: 85px; }`
- [ ] All 4 CSS imports present (styles.css, desktop-navbar.css, navbar-autohide.css, background-system.css)
- [ ] `background: linear-gradient(180deg, #0a0000 0%, #030000 100%)` on body
- [ ] Loads data from `{cat}.json` via JS fetch

**Mobile Listing:**
- [ ] All 4 mobile CSS imports present (mobile-common.css, mobile-navbar.css, page-loading.js, shared-content-styles.css)
- [ ] Bottom navbar HTML with all 6 items present
- [ ] `mobile-navbar.js` script included at bottom
- [ ] Back button links to `../projects.html`
- [ ] Data fetch path: `../../../Projects Code/{cat}/{cat}.json`
- [ ] `line-clamp: 2` (standard) alongside `-webkit-line-clamp: 2`

**Manager:**
- [ ] All 4 CSS imports (mobile-universal.css, unified-theme.css, only-boss-global-mobile.css, manager-mobile.css)
- [ ] Script order: unified-token-manager → central-api-gateway → github-api-handler → shared-utilities
- [ ] `JSON_PATH = '../../../../Projects Code/{cat}/{cat}.json'`
- [ ] `GITHUB_FILE_PATH = 'A3KM Studio/Projects Code/{cat}/{cat}.json'`
- [ ] Token badge (`#tokenStatus`) in header
- [ ] Token Debug button (`#tokenDebugBtn`) in header
- [ ] Back link goes to `../category-selector.html`
- [ ] Push to GitHub button calls `pushToGitHub()`
- [ ] 4 tabs: Dashboard, Add [Item], Manage All, Export/GitHub
- [ ] Edit button (per card in Manage All tab) + Edit modal with all fields
- [ ] `saveEdit()`, `editItem(id)`, `closeEditModal()` functions present

**Hub pages:**
- [ ] `projects.html` — new main-project-card with sub-card
- [ ] `mobile/projects/projects.html` — new category-card
- [ ] `mobile/projects/projects.css` — new `.{cat}-card .category-icon` CSS
- [ ] `projects.json` — totalProjects incremented, category added
- [ ] `category-selector.html` — new manager card + CSS + count loader

**Run error check:**
```powershell
# Check for errors in all new/modified files:
# Use VS Code: View > Problems, or the get_errors tool
```

---

**Last Updated:** March 7, 2026  
**Maintainer:** Md Akhinoor Islam  
**Reference implementation:** `websites` category (all 9 files) — created March 7, 2026
