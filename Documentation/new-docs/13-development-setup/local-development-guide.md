---
title: "Development Setup & Local Environment Configuration"
description: "Complete local development guide covering project setup, folder structure, running local servers, VS Code configuration, Git workflow, testing procedures, and deployment process for contributing to A3KM Studio"
date: 2026-02-12
lastUpdated: 2026-02-12
version: "1.5.0"
author: Md Akhinoor Islam
authorEmail: mdakhinoorislam@gmail.com
organization: A3KM Studio | Noor Academy
category: development-setup
difficulty: beginner
readTime: "12 min"
wordCount: 2400
tags: [development, local-setup, folder-structure, deployment, vs-code, git, testing, workflow]
status: complete
featured: true
prerequisites:
  - "Basic command line knowledge"
  - "Text editor installed (VS Code recommended)"
  - "Git basics (optional)"
relatedDocs:
  - "../01-website-overview/website-architecture.md"
  - "../12-github-integration/github-sync-complete.md"
  - "../11-performance-optimization/pwa-system-guide.md"
---

# 🛠️ Development Setup & Local Environment

> **👨‍💻 Overview:** A comprehensive development guide for setting up A3KM Studio locally on your computer, including installation, folder structure, running local servers, testing, and deployment workflows for seamless development experience.

---

## 📋 Table of Contents

- [🏁 Getting Started](#getting-started)
- [📦 Project Setup Steps](#project-setup)
- [📂 Complete Folder Structure](#folder-structure)
- [🚀 Running Local Server](#local-server)
- [🧪 Testing Procedures](#testing)
- [🔧 Development Tools](#dev-tools)
- [🌐 Deployment Process](#deployment)
- [⚠️ Common Setup Issues](#setup-issues)

---

## 🏁 Getting Started {#getting-started}

আমার website টা তোমার নিজের computer এ run করতে চাও? খুব সহজ!

### 📝 **System Requirements**

| Requirement | Minimum | Recommended |
|-------------|---------|-------------|
| **OS** | Windows 10+ / macOS / Linux | Any modern OS |
| **Browser** | Chrome 90+ | Chrome/Edge latest |
| **Disk Space** | 500 MB | 2 GB |
| **RAM** | 2 GB | 4 GB+ |
| **Text Editor** | Any | VS Code |

### 🧩 **Optional Tools**

- **Git:** Version control (`git --version` to check)
- **Node.js:** Future tooling support
- **Python 3:** Alternative local server

## Project Setup Steps

### 1. **Get The Code:**

#### Option A: Clone from GitHub
```powershell
# Terminal এ এই command run করো
git clone https://github.com/Akhinoor14/A3KM-Studio.git
cd A3KM-Studio
```

#### Option B: Download ZIP
1. GitHub repository visit করো
2. "Code" button → "Download ZIP"
3. Extract করো তোমার computer এ
4. Folder open করো

### 2. **Open in Editor:**

**VS Code (Recommended):**
```powershell
# VS Code install থাকলে
code .
```

**Or manually:**
- VS Code open করো
- File → Open Folder
- A3KM-Studio folder select করো

### 3. **Install Live Server (VS Code Extension):**

1. VS Code এ Extensions tab (Ctrl+Shift+X)
2. Search: "Live Server"
3. Install করো by Ritwick Dey
4. Reload VS Code

### 4. **Run The Website:**

**Method 1: Live Server (Best)**
- `index.html` right-click করো
- "Open with Live Server" select করো
- Browser এ automatically খুলবে: `http://localhost:5500`

**Method 2: Direct File**
- `index.html` double-click করো
- Browser এ খুলবে (কিছু features কাজ নাও করতে পারে)

**Method 3: Python Server**
```powershell
# Python 3 install থাকলে
python -m http.server 8000
# Then open: http://localhost:8000
```

### 5. **Testing:**

Open করার পর test করো:
- Home page load হচ্ছে?
- Mobile detection working? (DevTools mobile view)
- Projects page খুলছে?
- Content Hub accessible?
- PWA install prompt দেখাচ্ছে?

## Complete Folder Structure

```
A3KM-Studio/
│
├── index.html                    # Root - Device detector & redirector
├── README.md                     # Project overview
├── .gitignore                    # Git ignore rules
│
├── Home/                         # Desktop homepage
│   ├── index.html                # Main desktop page
│   └── # Code Citations.md       # Code references
│
├── mobile/                       # Mobile version
│   ├── manifest.json             # Mobile PWA config
│   ├── pwa-init.js              # Mobile PWA init
│   ├── service-worker.js         # Mobile SW
│   ├── home/                     # Mobile home
│   ├── about/                    # Mobile about
│   ├── contact/                  # Mobile contact
│   ├── projects/                 # Mobile projects
│   ├── content-studio/           # Mobile content
│   └── shared/                   # Shared mobile components
│       ├── mobile-navbar.js
│       ├── mobile-navbar.css
│       ├── mobile-common.css
│       ├── markdown-viewer.js
│       └── pdf-viewer.js
│
├── About me/                     # About & certificates
│   ├── about.html                # Desktop about
│   ├── about-desktop.css
│   ├── certificates-data.json
│   ├── certificates-viewer.html
│   ├── CERTIFICATES/
│   │   ├── Skill/                # Skill certificates
│   │   └── Medical/              # Medical docs
│   └── CV/                       # Resume files
│
├── Contact/                      # Contact page
│   └── contact.html
│
├── Projects Code/                # Projects frontend
│   ├── projects.html             # Main projects page
│   ├── projects.json             # All 66 projects data
│   ├── Arduino/
│   ├── Electronics/
│   ├── MATLAB/
│   └── solidworks/
│
├── Projects Storage/             # Actual project files
│   ├── Arduino UNO Projects with Tinkercad/
│   │   ├── 01 LED Pattern/
│   │   ├── 02 LED Flowing Blinking/
│   │   └── ... (26 projects)
│   ├── Solidwork Projects/
│   │   ├── Basic (Practice) Models/
│   │   ├── Intermediate (Practice) Models/
│   │   ├── Pro (Practice) Models/
│   │   └── Paid (Selled) Models/
│   ├── MATLAB Projects/
│   ├── Electronic Components Guide/
│   └── portfolio document/
│
├── Content Code/                 # Content metadata
│   └── content.json              # Central content data
│
├── Content Storage/              # Static content
│   ├── written-posts/            # Blog post markdown files
│   ├── cover-generator/          # SVG cover generation
│   └── svg-templates/
│
├── Content Studio/               # Content management
│   ├── hub.html                  # Content hub page
│   ├── ai-recommendations.js
│   ├── analytics.js
│   ├── comments.js
│   ├── i18n.js
│   ├── lazy-loading.js
│   ├── pwa-manager.js
│   ├── rss-generator.js
│   ├── search-history.js
│   ├── service-worker.js
│   ├── video-content/            # YouTube videos
│   │   ├── videos.json
│   │   ├── video-gallery.html
│   │   ├── video-viewer.html
│   │   ├── youtube-api-config.js
│   │   └── unified-video-sync.js
│   ├── written-posts/            # Posts viewer
│   │   ├── posts.json
│   │   ├── post-listing-new.html
│   │   └── post-reader.html
│   ├── educational-videos/       # Course playlists
│   ├── books-pdfs/               # Books library
│   └── research-papers/          # Academic papers
│       ├── papers.json
│       ├── paper-listing-new.html
│       └── paper-viewer-new.html
│
├── Only-boss/                    # Admin panel
│   ├── auth/                     # Authentication
│   │   ├── only-boss.html        # Login page
│   │   ├── only-boss.css
│   │   └── only-boss-auth.js     # Auth logic
│   ├── dashboard/                # Admin dashboard
│   │   ├── only-boss-dashboard-redesigned.html
│   │   ├── only-boss-dashboard-new.css
│   │   └── only-boss-dashboard.js
│   ├── managers/                 # Content managers
│   │   ├── Content-studio/       # Content manager UI
│   │   │   ├── content-hub.html
│   │   │   ├── books-manager.html
│   │   │   ├── educational-videos-manager.html
│   │   │   ├── papers-manager.html
│   │   │   ├── posts-manager.html
│   │   │   └── vlogs-manager.html
│   │   ├── posts/                # Post creation
│   │   │   ├── create-post.html
│   │   │   ├── view-posts.html
│   │   │   └── github-sync.js
│   │   ├── content-editing/      # Content editor
│   │   │   ├── content-editor.html
│   │   │   ├── content-editor.js
│   │   │   └── github-sync.js
│   │   ├── projects/             # Project manager
│   │   │   ├── analytics-dashboard.js
│   │   │   ├── advanced-search.js
│   │   │   └── project-creator/
│   │   ├── certificates/         # Certificate manager
│   │   ├── settings/             # Settings panel
│   │   │   └── media-library.html
│   │   └── shared/               # Shared utilities
│   │       ├── token-loader.js
│   │       ├── unified-token-manager.js
│   │       ├── github-token-manager.js
│   │       ├── api-config-manager.html
│   │       └── token-health-dashboard.html
│   ├── mobile/                   # Mobile admin CSS
│   │   ├── only-boss-global-mobile.css
│   │   ├── auth-mobile.css
│   │   ├── dashboard-mobile.css
│   │   ├── manager-mobile.css
│   │   └── content-hub-mobile.css
│   ├── shared/                   # Shared components
│   └── test/                     # Testing files
│
├── Optimization/                 # Performance & PWA
│   ├── manifest.json             # PWA manifest
│   ├── service-worker.js         # Service worker
│   ├── pwa-init.js              # PWA initializer
│   ├── pwa-install.js           # Install prompt
│   ├── styles.css                # Global styles
│   ├── script.js                 # Global scripts
│   ├── global-scrollbar.css      # Custom scrollbar
│   ├── auto-refresh.js           # Auto content refresh
│   ├── realtime-github-sync.js   # GitHub sync checker
│   ├── vercel.json               # Vercel deployment config
│   ├── navbar/                   # Navigation components
│   │   └── desktop-navbar.css
│   ├── Background/               # Background animations
│   │   └── background-system.css
│   ├── navbar-autohide.js        # Auto-hide navbar
│   ├── pdf-viewer/               # PDF viewer component
│   ├── md-to-pdf-downloader/     # Markdown to PDF
│   ├── mobile-system/            # Mobile detection
│   │   └── mobile-detector.js
│   └── shared model viewer/      # 3D model viewer
│
├── images/                       # Images & assets
│   ├── favicon.svg               # Site icon
│   ├── logo.svg                  # Main logo
│   ├── logo-wordmark-am.svg
│   ├── logo-wordmark-akhinoor.svg
│   └── README.md
│
└── Documentation/                # THIS documentation system
    ├── README-NEW.md             # New system README
    ├── DOCUMENTATION-INDEX.md    # Master index
    ├── new-docs/                 # Fresh documentation (15 categories)
    ├── archive/                  # Old docs backup
    └── assets/                   # Doc assets
```

**Total:** ~200+ files, ~20+ folders

## Key Configuration Files

### 1. **PWA Manifest** (`Optimization/manifest.json`)

Controls PWA behavior:
```json
{
  "name": "A3KM Studio",
  "start_url": "/",
  "display": "fullscreen",
  "theme_color": "#CC0000"
}
```

**Edit করতে পারো:**
- App name
- Theme color
- Display mode
- Icons

### 2. **Vercel Config** (`Optimization/vercel.json`)

Deployment settings:
```json
{
  "routes": [
    { "src": "/", "dest": "/index.html" }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=3600"
        }
      ]
    }
  ]
}
```

### 3. **Content Data** (`Content Code/content.json`)

Central content metadata:
- Update করো নতুন content add করলে
- Version increment করো changes এ
- Statistics automatic update হয় (manual check করো)

### 4. **Projects Data** (`Projects Code/projects.json`)

All projects metadata:
- 66 projects listed
- Categories, tags, paths
- Thumbnails, downloads

## Dependencies

### External Libraries (CDN):

**Loaded from Internet:**
```html
<!-- Fonts -->
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap">

<!-- Icons -->
<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">

<!-- Markdown rendering -->
<script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>

<!-- Code highlighting -->
<link href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css">
<script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>

<!-- 3D Model Viewer -->
<script type="module" src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"></script>
```

**কেন CDN?**
- Fast loading (cached by browser)
- No need to download files
- Automatic updates
- Global CDN = faster worldwide

**Offline Impact:**
- First visit needs internet
- After that, cached by service worker
- Core functionality works offline

### No Build Process!

**আমার website এ:**
- ❌ No npm packages
- ❌ No webpack/vite
- ❌ No compilation needed
- ❌ No build command

**✅ Pure Vanilla:**
- Plain HTML/CSS/JS
- No framework dependencies
- Direct file editing
- Instant changes visible

## Making Changes

### 1. **Edit HTML/CSS/JS:**

**Simple:**
- Open file in editor
- Make changes
- Save
- Refresh browser → Changes visible!

**Example: Change homepage title**
```html
<!-- Home/index.html -->
<h1>Md Akhinoor Islam - Portfolio</h1>
```
Change to:
```html
<h1>Your Name - Portfolio</h1>
```
Save → Refresh → Done!

### 2. **Add New Content:**

#### New Blog Post:
1. Create file: `Content Storage/written-posts/my-post.md`
2. Add frontmatter:
```markdown
---
title: "My New Post"
date: 2026-02-12
category: "Technology"
tags: [Tech, Tutorial]
---

# My Content Here
```
3. Update `Content Studio/written-posts/posts.json`
4. Add entry to posts array
5. Refresh website

#### New Project:
1. Add files to `Projects Storage/`
2. Update `Projects Code/projects.json`
3. Add metadata entry
4. Refresh projects page

### 3. **Test Changes:**

**Browser DevTools:**
- F12 বা Right-click → Inspect
- Console tab → Check for errors
- Network tab → Check file loading
- Application tab → Check PWA/cache

**Mobile Testing:**
- DevTools → Toggle device toolbar (Ctrl+Shift+M)
- Select device (iPhone, Android)
- Test responsiveness

## Git Workflow

### Basic Commands:

```powershell
# Check status
git status

# Add changes
git add .

# Commit
git commit -m "Update: Description of changes"

# Push to GitHub
git push origin main

# Pull latest changes
git pull origin main
```

### Branch Strategy:

**Main Branch:**
- Production-ready code
- Always deployable
- Direct push করা যায় (personal project)

**Recommended (If team):**
- Create feature branch: `git checkout -b feature-name`
- Make changes
- Test thoroughly
- Merge to main: `git merge feature-name`

## Deployment

### Deploy to GitHub Pages:

1. **Repository Settings:**
   - GitHub repo → Settings
   - Pages section
   - Source: Deploy from main branch
   - Folder: / (root)
   - Save

2. **Wait 2-3 minutes**
   - Build process runs
   - Site live at: `username.github.io/repo-name`

3. **Custom Domain (Optional):**
   - Add CNAME file in root
   - Content: `yourdomain.com`
   - Configure DNS at domain provider

### Deploy to Vercel:

1. **Install Vercel CLI:**
```powershell
npm install -g vercel
```

2. **Login:**
```powershell
vercel login
```

3. **Deploy:**
```powershell
vercel
```

4. **Production:**
```powershell
vercel --prod
```

**Auto-Deploy:**
- Connect GitHub repo to Vercel
- Every push to main = auto deploy
- Preview URLs for PRs

## Environment Variables (If Needed)

Currently **no environment variables** needed!

**Future (If adding):**
```javascript
// Create .env.local file
YOUTUBE_API_KEY=your_key_here
GITHUB_TOKEN=your_token_here

// Add to .gitignore
.env.local
```

## Troubleshooting Development

### Problem: Live Server not working

**Solutions:**
- Check if extension installed properly
- Try different port: Settings → Live Server → Port
- Restart VS Code
- Use alternative: `python -m http.server`

### Problem: Changes not visible

**Solutions:**
- Hard refresh: Ctrl+Shift+R
- Clear browser cache
- Check if correct file edited
- Check if file saved (auto-save on?)

### Problem: CORS errors

**Solutions:**
- Use Live Server (not direct file://)
- Check fetch URLs (relative paths)
- Ensure proper CORS headers

---

**শেষ Update:** 2026-02-12  
**Development Status:** Production-ready, no bugs! ✅
