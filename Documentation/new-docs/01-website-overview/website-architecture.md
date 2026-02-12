---
title: "A3KM Studio - Complete Website Architecture Guide"
description: "Complete architectural overview of A3KM Studio - a dual-platform (desktop + mobile) portfolio and educational content platform featuring 66+ projects, admin panel, PWA capabilities, and real-time GitHub integration"
date: 2026-02-12
lastUpdated: 2026-02-12
version: "2.0.0"
author: Md Akhinoor Islam
authorEmail: mdakhinoorislam@gmail.com
organization: A3KM Studio | Noor Academy
category: website-overview
difficulty: intermediate
readTime: "8 min"
wordCount: 1200
tags: [website, architecture, structure, PWA, portfolio, dual-platform, GitHub-integration, admin-panel]
status: complete
featured: true
prerequisites:
  - Basic HTML/CSS knowledge
  - Understanding of web architecture
  - Familiarity with Git/GitHub
relatedDocs:
  - "../02-authentication-security/only-boss-auth-system.md"
  - "../03-only-boss-admin/dashboard-complete-guide.md"
  - "../11-performance-optimization/pwa-system-guide.md"
---

# 🏗️ A3KM Studio - Complete Website Architecture

> **📚 Overview:** A comprehensive guide to understanding the complete architecture of A3KM Studio - a modern dual-platform web application featuring desktop and mobile experiences, advanced admin capabilities, and seamless GitHub integration.

---

## 📋 Table of Contents

- [🎯 What is A3KM Studio?](#what-is-a3km-studio)
- [🏛️ Core Architecture Components](#core-architecture)
- [💻 Technology Stack](#technology-stack)
- [📁 File Structure](#file-structure)
- [🎨 Design System](#design-system)
- [⚡ Performance Features](#performance-features)
- [🔗 GitHub Integration](#github-integration)
- [✅ Checklist & Status](#checklist)

---

## 🎯 What is A3KM Studio? {#what-is-a3km-studio}

**A3KM Studio** is a comprehensive **dual-platform portfolio and educational content platform** developed by **Md Akhinoor Islam**. 

### 🌟 Key Highlights

| Feature | Description | Count |
|---------|-------------|-------|
| 🎨 **Projects** | SOLIDWORKS, Arduino, MATLAB, Electronics | **66+** |
| 📹 **Videos** | YouTube vlogs, tutorials, poems | **8** |
| 📝 **Posts** | Blog articles across 100+ categories | **200+** |
| 📚 **Books** | Engineering textbooks with PDF viewer | **3** |
| 📄 **Papers** | Academic research papers | **5+** |
| 🎓 **Certificates** | Professional skill certifications | **15+** |

> **💡 Pro Tip:** The platform automatically detects your device and serves the optimized experience - no manual switching needed!

---

## 🏛️ Core Architecture Components {#core-architecture}

### 1️⃣ **Public Website** (Open Access)

#### 🖥️ **Desktop Version**

```
📍 Location: Home/index.html
🎯 Target: Desktop users, tablets in landscape
```

**✨ Features:**
- ✅ Animated background system (geometric shapes, gradient orbs, particles)
- ✅ Professional navigation bar with logo branding
- ✅ Interactive project showcase (66+ projects with 3D previews)
- ✅ Content Studio hub (videos, posts, books, papers)
- ✅ Comprehensive About Me section with certificates
- ✅ Contact form with validation
- ✅ PWA install prompt automation

**🎨 Visual Elements:**
- Engineering grid background (20px spacing)
- Floating geometric shapes
- Gradient orbs with blur effect
- Particle system
- Smooth scroll animations

---

#### 📱 **Mobile Version**

```
📍 Location: mobile/home/index.html
🎯 Target: Mobile phones, tablets in portrait
```

**✨ Mobile-Optimized Features:**
- ✅ Touch-friendly interface (48px+ tap targets)
- ✅ Bottom navigation bar (thumb-zone optimized)
- ✅ Lightweight design (faster loading on mobile data)
- ✅ Swipe gestures support
- ✅ Haptic feedback on interactions
- ✅ Mobile-specific layouts and spacing

> **⚠️ Important:** Mobile version is served automatically based on device detection - users never see a desktop layout on mobile!

---

#### 🔄 **Auto Device Detection**

```javascript
// Root index.html - Smart device detection
📍 Location: index.html (root)
```

**Detection Strategy:**

1. **Modern Browsers** (Chrome 90+, Edge 90+):
   ```javascript
   navigator.userAgentData.mobile
   ```

2. **Fallback** (Safari, Firefox, older browsers):
   ```javascript
   /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
   ```

3. **Automatic Redirect:**
   - Mobile → `/mobile/home/`
   - Desktop → `/Home/`

> **🎯 Result:** Zero manual intervention needed - just visit the site!

---

### 2️⃣ **Only Boss Admin Panel** (Protected Access)

```
📍 Location: Only-boss/
🔐 Access: Two-step authentication required
👤 User: Admin only (Md Akhinoor Islam)
```

**🛡️ Security Features:**
- ✅ SHA-256 encrypted password system
- ✅ Two-factor authentication flow
- ✅ Session management
- ✅ Token-based access control
- ✅ Encrypted localStorage (never expires)

**⚙️ Admin Capabilities:**

| Module | Description | Status |
|--------|-------------|--------|
| 📊 **Dashboard** | Analytics, stats, quick actions | ✅ Active |
| 📝 **Content Studio** | Create/edit posts with live preview | ✅ Active |
| 🚀 **Post Publisher** | Markdown editor + GitHub auto-sync | ✅ Active |
| 🎯 **Project Manager** | Add/edit/delete projects | ✅ Active |
| 🎓 **Certificate Manager** | Upload certificates with metadata | ✅ Active |
| 🔧 **Settings** | Site configuration, theme options | ✅ Active |
| 🔑 **Token Manager** | GitHub token management | ✅ Active |

> **🔥 Power Feature:** All content changes sync to GitHub in real-time - no manual FTP uploads!

---

### 3️⃣ **Content Management System**

#### 📹 **Video Content**

```json
{
  "total": 8,
  "categories": ["vlogs", "daily-life", "food", "poems"],
  "platform": "YouTube",
  "integration": "YouTube Data API"
}
```

**Features:**
- Video gallery with thumbnail previews
- Duration, views, and engagement stats
- Category-based filtering
- Direct YouTube playback integration
- Responsive video player

---

#### 📝 **Blog/Post System**

```json
{
  "total": "200+",
  "categories": "100+",
  "format": "Markdown",
  "features": ["search", "filter", "tags"]
}
```

**Capabilities:**
- Full markdown support with syntax highlighting
- 100+ predefined categories
- Advanced search functionality
- Tag-based navigation
- Related posts suggestions
- Read time estimation

---

#### 📚 **Books & PDF Library**

```json
{
  "books": 3,
  "format": "PDF",
  "viewer": "Integrated PDF.js",
  "downloadable": true
}
```

**Available Books:**
1. Engineering Mechanics
2. Strength of Materials  
3. Thermodynamics

---

#### 📄 **Research Papers**

```json
{
  "papers": "5+",
  "format": "PDF + Markdown abstracts",
  "categories": ["renewable-energy", "sustainability"]
}
```

---

### 4️⃣ **Projects Portfolio** (66+ Technical Projects)

| Category | Count | Technologies | Difficulty |
|----------|-------|--------------|------------|
| 🔧 **SOLIDWORKS** | 35 | 3D CAD, Assembly Design | Basic → Commercial |
| ⚡ **Arduino** | 26 | C++, IoT, Sensors | Beginner → Advanced |
| 📊 **MATLAB** | 3 | Energy Systems, Simulations | Intermediate |
| 🔌 **Electronics** | 4 | Calculators, Circuit Design | All Levels |

**Project Features:**
- Interactive 3D model viewer (SOLIDWORKS)
- Circuit diagrams with Tinkercad (Arduino)
- Code snippets with syntax highlighting
- Step-by-step instructions
- Download capability (code + resources)

---

### 5️⃣ **Progressive Web App (PWA) System**

```
📦 Core Files:
├── manifest.json         (App metadata)
├── service-worker.js     (Offline caching)
└── pwa-init.js          (Install prompt logic)
```

**PWA Capabilities:**

✅ **Install as App:**
- Desktop: Chrome, Edge browser prompt
- Mobile: Add to Home Screen
- Standalone mode (no browser UI)

✅ **Offline Support:**
- Service worker caches key pages
- Works without internet after first load
- Background sync for updates

✅ **Native-Like Experience:**
- Fullscreen mode
- Custom splash screen
- App icon on home screen

> **💡 Tip:** After installing, the site behaves like a native app - lightning fast and always accessible!

---

## 💻 Technology Stack {#technology-stack}

### 🎨 **Frontend Technologies**

| Technology | Purpose | Version |
|------------|---------|---------|
| **HTML5** | Structure, semantic markup | Latest |
| **CSS3** | Styling, animations, grid/flexbox | Latest |
| **JavaScript (Vanilla)** | Logic, interactions | ES6+ |
| **Font Awesome** | Icon library | 6.5.1 |
| **Google Fonts** | Typography (Inter family) | Latest |
| **Marked.js** | Markdown → HTML rendering | 9.0+ |
| **Highlight.js** | Code syntax highlighting | 11.8+ |
| **Model Viewer** | 3D GLB/GLTF preview | 3.4+ |

### ⚡ **Core Features**

- 🔄 **Device Detection:** Auto-redirect based on screen size
- 📦 **PWA:** Offline-first with service workers
- 🔗 **GitHub API:** Real-time content synchronization
- 📱 **Responsive:** Mobile-first design approach
- 🎨 **Dark Theme:** `#CC0000` red accent on dark backgrounds
- ⚙️ **No Framework:** Pure vanilla JavaScript (lightweight) 

### ⚡ **Core Features**

- 🔄 **Device Detection:** Auto-redirect based on screen size
- 📦 **PWA:** Offline-first with service workers
- 🔗 **GitHub API:** Real-time content synchronization
- 📱 **Responsive:** Mobile-first design approach
- 🎨 **Dark Theme:** `#CC0000` red accent on dark backgrounds
- ⚙️ **No Framework:** Pure vanilla JavaScript (lightweight)

---

## 📁 Complete File Structure {#file-structure}

```
A3KM-Studio/
│
├── 📄 index.html                    ← Root device detector
│
├── 🏠 Home/                         ← Desktop version
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── 📱 mobile/                       ← Mobile version
│   ├── home/
│   ├── projects/
│   ├── content-studio/
│   ├── about/
│   ├── contact/
│   └── shared/
│       ├── mobile-common.css
│       └── mobile-navbar.css
│
├── 🔐 Only-boss/                    ← Admin panel
│   ├── auth/
│   │   ├── index.html
│   │   └── login.js
│   ├── dashboard/
│   ├── managers/
│   └── shared/
│
├── 📝 Content Studio/               ← Content files
│   ├── written-posts/
│   ├── books-pdfs/
│   ├── educational-videos/
│   ├── research-papers/
│   └── video-content/
│
├── 💾 Content Code/                 ← Data JSONs
│   └── content.json
│
├── 📦 Content Storage/              ← Actual files
│   ├── written-posts/
│   ├── svg-templates/
│   └── cover-generator/
│
├── 🎯 Projects Code/                ← Project pages
│   ├── projects.html
│   ├── projects.json
│   ├── Arduino/
│   ├── MATLAB/
│   └── solidworks/
│
├── 📂 Projects Storage/             ← Project files
│   ├── Arduino UNO Projects with Tinkercad/
│   ├── MATLAB Projects/
│   └── SOLIDWORKS Models/
│
├── ⚙️ Optimization/                 ← PWA & utilities
│   ├── manifest.json
│   ├── service-worker.js
│   ├── pwa-init.js
│   ├── Background/
│   └── navbar/
│
├── 👤 About me/                     ← About section
│   ├── about.html
│   ├── certificates-viewer.html
│   └── CV/
│
├── 📧 Contact/                      ← Contact form
│   └── contact.html
│
└── 📚 Documentation/                ← This docs system
    ├── index.html
    ├── viewer-enhanced.html
    ├── docs-data.json
    ├── mobile/
    └── new-docs/
```

> **🎯 Structure Logic:** Clear separation between desktop/mobile versions, admin/public areas, and content/code/storage layers.

---

## 🎨 Design System {#design-system}

### 🎨 **Color Palette**

```css
/* Primary Colors */
--primary-red: #CC0000;        /* Logo, buttons, accents */
--dark-red: #8B0000;           /* Hover states, borders */
--light-red: #FF4444;          /* Highlights, focus */

/* Background Colors */
--bg-dark-1: #0a0a0a;          /* Main background */
--bg-dark-2: #1a0505;          /* Gradient end */
--bg-card: #2a2a2a;            /* Card backgrounds */
--bg-input: #1f1f1f;           /* Input fields */

/* Text Colors */
--text-primary: #ffffff;       /* Main text */
--text-secondary: #aaaaaa;     /* Subtext, labels */
--text-muted: #666666;         /* Disabled, hints */

/* Border Colors */
--border-primary: #333333;     /* Card borders */
--border-accent: #CC0000;      /* Active borders */
```

### 🎯 **Typography Scale**

```css
/* Font Family */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;

/* Type Scale (Desktop) */
--text-xs: 0.75rem;     /* 12px - Captions */
--text-sm: 0.875rem;    /* 14px - Small text */
--text-base: 1rem;      /* 16px - Body */
--text-lg: 1.125rem;    /* 18px - Lead text */
--text-xl: 1.25rem;     /* 20px - H4 */
--text-2xl: 1.5rem;     /* 24px - H3 */
--text-3xl: 1.875rem;   /* 30px - H2 */
--text-4xl: 2.25rem;    /* 36px - H1 */
--text-5xl: 3rem;       /* 48px - Hero */
```

### 📏 **Spacing System**

```css
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.5rem;    /* 24px */
--space-6: 2rem;      /* 32px */
--space-8: 3rem;      /* 48px */
--space-10: 4rem;     /* 64px */
```

### 🎭 **Animation Timings**

```css
--transition-fast: 150ms;
--transition-base: 250ms;
--transition-slow: 500ms;
--transition-easing: cubic-bezier(0.4, 0, 0.2, 1);
```

---

## ⚡ Performance Features {#performance-features}

### 🚀 **Optimization Techniques**

#### 1. **Lazy Loading**
```javascript
// Images load only when entering viewport
<img loading="lazy" src="image.jpg" alt="Description">
```

#### 2. **Code Splitting**
- Separate CSS/JS files per page
- No monolithic bundles
- Load only what's needed

#### 3. **Service Worker Caching**
```javascript
// Cache-first strategy for static assets
// Network-first for dynamic content
```

#### 4. **Optimized Animations**
```css
/* Use GPU-accelerated properties only */
transform: translate3d(0, 0, 0);
will-change: transform, opacity;
```

#### 5. **Mobile-First Approach**
- Base styles for mobile
- Progressive enhancement for desktop
- Media queries: `min-width` only

### 📊 **Performance Metrics**

| Metric | Desktop | Mobile | Target |
|--------|---------|--------|--------|
| First Contentful Paint | 1.2s | 1.8s | < 2s |
| Largest Contentful Paint | 2.1s | 3.0s | < 3.5s |
| Time to Interactive | 2.5s | 3.5s | < 4s |
| Cumulative Layout Shift | 0.05 | 0.08 | < 0.1 |

> **🎯 Goal:** Lighthouse score 90+ across all categories

---

## 🔗 GitHub Integration {#github-integration}

### 🔄 **Real-Time Content Sync**

```javascript
// Architecture
Local Admin Panel → GitHub API → Repository → Auto Deploy
```

**Sync Workflow:**

1. **Admin creates/edits content** in Only Boss panel
2. **JavaScript uploads to GitHub** via API
3. **GitHub Actions** trigger (if configured)
4. **Repository updates** automatically
5. **Changes live** immediately (on static hosts)

### 🔑 **Token Management System**

```
📍 Location: Only-boss/managers/token-manager.html
```

**Features:**
- ✅ Encrypted token storage (AES-256)
- ✅ Token validation checks
- ✅ Expiry monitoring
- ✅ Permission scope verification
- ✅ One-time setup, never expires

**Required Permissions:**
```
repo (Full control of private repositories)
└── Contents (Read/Write access)
```

### 📤 **Upload Capabilities**

| Content Type | Endpoint | Method | Status |
|--------------|----------|--------|--------|
| Blog Posts | `/Content Studio/written-posts/` | PUT | ✅ Active |
| Books | `/Content Studio/books-pdfs/` | PUT | ✅ Active |
| Papers | `/Content Studio/research-papers/` | PUT | ✅ Active |
| Images | `/Content Storage/covers/` | PUT | ✅ Active |
| Projects | `/Projects Code/` | PUT | ✅ Active |

---

## ✅ Implementation Checklist {#checklist}

### Core Features

- [x] Desktop version with animations
- [x] Mobile version with touch optimization
- [x] Device detection & auto-redirect
- [x] PWA with offline support
- [x] Admin panel with authentication
- [x] Content management system
- [x] Project portfolio showcase
- [x] GitHub API integration
- [x] Real-time sync capability
- [x] Documentation system

### Advanced Features

- [x] 3D model viewer (SOLIDWORKS)
- [x] PDF viewer integration
- [x] Markdown rendering with syntax highlighting
- [x] Search functionality across content
- [x] Category-based filtering
- [x] Responsive navigation
- [x] Dark theme throughout
- [x] Haptic feedback (mobile)
- [x] Service worker caching
- [x] Token encryption system

### Performance

- [x] Lazy loading images
- [x] Code splitting
- [x] Mobile-first CSS
- [x] GPU-accelerated animations
- [x] Optimized bundle sizes
- [x] CDN for libraries

---

## 🎓 Key Takeaways

> **✨ What Makes A3KM Studio Unique:**

1. **🔄 Dual Platform:** Separate optimized experiences for desktop and mobile
2. **🤖 Auto Detection:** Users get the right version automatically
3. **🔐 Secure Admin:** Two-step auth with encryption
4. **📤 Real-Time Sync:** Content changes push to GitHub instantly
5. **📦 PWA Ready:** Install as app, works offline
6. **🎨 Consistent Design:** Dark theme with red accent throughout
7. **⚡ Performance First:** Optimized for speed on all devices

---

## 📚 Related Documentation

Continue your learning journey with these related guides:

| Doc | Description | Link |
|-----|-------------|------|
| 🔐 **Authentication** | Only Boss two-step auth system | [View →](../02-authentication-security/only-boss-auth-system.md) |
| 📊 **Dashboard** | Admin dashboard complete guide | [View →](../03-only-boss-admin/dashboard-complete-guide.md) |
| 📝 **Content Studio** | Content management deep dive | [View →](../04-content-management/content-studio-system.md) |
| 🎯 **Projects** | Portfolio showcase system | [View →](../09-projects-portfolio/projects-complete-guide.md) |
| ⚡ **PWA** | Progressive web app implementation | [View →](../11-performance-optimization/pwa-system-guide.md) |
| 🔗 **GitHub Sync** | Real-time sync architecture | [View →](../12-github-integration/github-sync-complete.md) |

---

## 🆘 Need Help?

**Questions? Issues?**
- 📧 Email: mdakhinoorislam@gmail.com
- 🔗 Website: [a3km.studio](https://akhinoor14.github.io/A3KM-Studio/)
- 📚 Full Docs: [Documentation Hub](../../index.html)

---

## 📝 Changelog

| Version | Date | Changes |
|---------|------|---------|
| **2.0.0** | 2026-02-12 | Complete rewrite with enhanced formatting, emojis, tables |
| **1.5.0** | 2026-02-10 | Added GitHub integration details |
| **1.0.0** | 2026-02-08 | Initial documentation |

---

**🎉 Status:** ✅ **Complete & Up-to-Date**  
**📅 Last Updated:** February 12, 2026  
**👤 Maintained By:** Md Akhinoor Islam

---

> **💡 Pro Tip:** Bookmark this page for quick reference to the entire website architecture!
