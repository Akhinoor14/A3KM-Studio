---
title: "Premium Homepage Build — A3KM Studio Desktop"
description: "Complete documentation of the A3KM Studio desktop homepage (Home/index.html) build: architecture, inline CSS/JS structure, all feature integrations including PWA, splash screen, offline support, auto-update scripts, PDF viewer, and hero section design."
date: 2026-03-05
lastUpdated: 2026-03-05
version: "1.0.0"
author: Md Akhinoor Islam
authorEmail: mdakhinoorislam@gmail.com
organization: A3KM Studio | Noor Academy
category: website-overview
difficulty: intermediate
readTime: "12 min"
wordCount: 2200
tags: [homepage, pwa, splash-screen, desktop, index.html, offline, install-prompt]
status: complete
featured: true
prerequisites:
  - "Basic HTML/CSS/JS knowledge"
  - "Understanding of PWA concepts"
  - "Familiarity with the A3KM Studio folder structure"
relatedDocs:
  - "./NAVBAR-STANDARDIZATION.md"
  - "./SPLASH-SCREEN-SYSTEM.md"
  - "../13-development-setup/CV-LINK-FIX.md"
changelog:
  - version: "1.0.0"
    date: "2026-03-05"
    changes: "Initial documentation of the completed homepage build"
---

# 🏠 Premium Homepage Build — A3KM Studio Desktop

> **📚 Overview:** This document covers the complete architecture and feature set of the A3KM Studio desktop homepage (`Home/index.html`). The page is a fully self-contained HTML file with inline CSS and JS — no external framework dependencies. It combines a premium deep-red-black visual theme with full PWA capability, splash screen, offline support, and GitHub-integrated project listing.

---

## 📋 Table of Contents

- [🏗 File Structure](#file-structure)
- [🎨 Color System](#color-system)
- [💫 Splash Screen](#splash-screen)
- [📱 PWA Integration](#pwa-integration)
- [🧭 Navbar](#navbar)
- [🦸 Hero Section](#hero-section)
- [📦 External Script Integrations](#external-script-integrations)
- [👑 Footer Crown Icon](#footer-crown-icon)
- [⚙️ How to Update](#how-to-update)

---

## 🏗 File Structure {#file-structure}

**File path:** `A3KM Studio/Home/index.html`  
**Approximate size:** ~2875 lines  
**Encoding:** UTF-8  
**Architecture:** Single self-contained file (no external CSS file, no build step)

```
Home/
└── index.html          ← The complete desktop homepage
```

The file is structured in this order:

```
<!DOCTYPE html>
<html>
  <head>
    ├── Meta tags (SEO, PWA, social)
    ├── Favicon + apple-touch-icon
    ├── manifest.json link
    ├── Google Fonts (Playfair Display, Inter)
    ├── Main <style> block   ← All CSS lives here (~1000+ lines)
    └── Splash Screen CSS block (added separately after main style block)
  </head>
  <body class="splash-active">
    ├── #appSplash div        ← Splash screen overlay
    ├── <nav>                 ← Navbar (glass morphism)
    ├── <section class="hero"> ← Profile + hero buttons
    ├── <section class="about">
    ├── <section class="skills">
    ├── <section class="projects">
    ├── <section class="contact-cta">
    ├── <footer>              ← Icons + Only Boss crown link
    └── <script> blocks       ← All JS lives here (~30+ script blocks)
  </body>
</html>
```

---

## 🎨 Color System {#color-system}

The homepage uses a **deep red-black-white** theme. Key color values:

| Role | Value |
|---|---|
| Primary dark background | `#0A0A0A` |
| Card/surface background | `#111111` |
| Deep red accent (dark) | `#6B0000` |
| Deep red accent (mid) | `#8B0000` |
| Primary red | `#9a1010` |
| Bright red (hover) | `#CC0000` |
| Text primary | `#FFFFFF` |
| Text secondary | `rgba(255,255,255,0.7)` |
| Profile backdrop from | `rgba(18,0,0,0.97)` → `#120000` |
| Profile backdrop to | `rgba(30,0,0,0.95)` → `#1E0000` |
| Profile border | `rgba(139,0,0,0.45)` |

### Profile Picture Container

```css
.profile-image-container {
  background: linear-gradient(135deg, rgba(18,0,0,0.97), rgba(30,0,0,0.95));
  border: 1px solid rgba(139,0,0,0.45);
  border-radius: 50%;     /* 1:1 circle crop */
}
```

**Profile photo**: `../images/PP.jpg` — must be cropped to **1:1 ratio** (800×800px or higher recommended) before placement.

---

## 💫 Splash Screen {#splash-screen}

### Overview

The splash screen shows a full-screen branded intro animation on **first visit only**. It is skipped on every subsequent visit in the same browser session.

### Files Involved

| File | Role |
|---|---|
| `Home/index.html` | Contains all splash CSS + HTML + JS inline |

*(No separate splash file — everything is inline.)*

### How It Works

1. On page load, JS checks `sessionStorage.getItem('splashShown')`
2. If null → show splash screen (first visit)
3. If set → skip splash immediately (subsequent visits in same tab/session)
4. Splash auto-dismisses after **1.6 seconds** via JS timeout
5. User can also **click anywhere** on the splash to skip immediately
6. A **4-second failsafe** `setTimeout` ensures the splash always disappears even if JS animations glitch

```javascript
// Session check (inside DOMContentLoaded)
if (sessionStorage.getItem('splashShown')) {
    // Skip: remove splash immediately
    splash.style.display = 'none';
    document.body.classList.remove('splash-active');
} else {
    // Show splash, set flag
    sessionStorage.setItem('splashShown', 'true');
    setTimeout(() => removeSplashScreen(), 1600);
}

// Click to skip
splash.addEventListener('click', removeSplashScreen);

// Failsafe
setTimeout(removeSplashScreen, 4000);
```

### CSS Animations

| Animation | Purpose |
|---|---|
| `logoReveal` | Logo fades + scales in |
| `textSlideUp` | Title and subtitle slide up |
| `splashSpin` | Loader ring spins |
| `splashFadeOut` | Entire splash fades out on dismiss |

### HTML Structure

```html
<div id="appSplash" class="splash-screen">
  <div class="splash-content">
    <div class="splash-logo">A3KM</div>
    <div class="splash-title">A3KM Studio</div>
    <div class="splash-subtitle">Engineering · Education · Innovation</div>
    <div class="splash-loader"><div class="splash-ring"></div></div>
    <div class="splash-hint">Click anywhere to skip</div>
  </div>
</div>
```

### `body.splash-active` Class

While the splash is visible, `<body>` carries `class="splash-active"`. This class can be used in CSS to prevent scroll and interactions during the splash:

```css
body.splash-active {
  overflow: hidden;
}
```

---

## 📱 PWA Integration {#pwa-integration}

The homepage is a fully installable Progressive Web App.

### Head Meta Tags

```html
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="A3KM Studio">
<meta name="application-name" content="A3KM Studio">
<link rel="manifest" href="../mobile/manifest.json">
<link rel="apple-touch-icon" href="../images/icon-192.png">
```

### PWA Init Script

```html
<script src="../mobile/pwa-init.js" defer></script>
```

This script registers the service worker from `../mobile/service-worker.js`.

### Install Prompt System

The install prompt is handled by **`../Optimization/pwa-install-prompt.js`**, a 620-line self-contained class (`PWAInstallPrompt`) that:

- Listens for `beforeinstallprompt` event
- Shows a themed popup card **3 seconds after page load**
- Limits dismiss to **3 times** before stopping nags
- Remembers "Remind me later" → waits **7 days**
- Has an iOS Safari fallback with manual instructions
- Stores state in `localStorage`

In the homepage, a hidden install button is also available in the hero:

```html
<button id="hero-install-btn" style="display:none;" class="btn btn-primary">
  <i class="fas fa-download"></i> Install App
</button>
```

The `beforeinstallprompt` handler in the page's JS shows this button when the browser fires the event.

### Offline Support

The offline content manager is loaded via:

```html
<script src="../Optimization/offline-content-manager.js"></script>
```

---

## 🧭 Navbar {#navbar}

See dedicated document: [NAVBAR-STANDARDIZATION.md](./NAVBAR-STANDARDIZATION.md)

**Key navbar facts for the homepage:**
- Tagline: `Engineering · Education · Innovation`
- CV link: `../About me/CV/Akhinoor_Islam_CV_2026.pdf`
- All links have `aria-label` and icon `aria-hidden="true"` and `loading="lazy"` on images
- Navbar becomes **scrolled** (glass effect intensifies) after 50px scroll via JS

---

## 🦸 Hero Section {#hero-section}

The hero section contains:

1. **Profile picture** — `../images/PP.jpg` in a circular container
2. **Name + title** — "Md Akhinoor Islam" + animated typing subtitle
3. **CTA buttons:**
   - View Projects → `#projects`
   - Download CV → `../About me/CV/Akhinoor_Islam_CV_2026.pdf`
   - Contact Me → `../Contact/contact.html`
   - Install App → `#hero-install-btn` (hidden, shown by PWA JS)

---

## 📦 External Script Integrations {#external-script-integrations}

All scripts are loaded before `</body>` in this order:

| Script | Purpose |
|---|---|
| Navbar scroll activation JS | Adds `.scrolled` class to navbar on scroll |
| `beforeinstallprompt` handler | Captures install event, shows hero install button |
| `github-projects-detector` | Auto-detects and lists GitHub projects |
| `auto-refresh.js` | Periodic content refresh |
| `realtime-github-sync.js` | Live GitHub repo sync |
| `../Optimization/pdf-viewer.js` | PDF viewer with `CV_PDF_PATH` preset |
| `../Optimization/pwa-install-prompt.js` | PWA install popup system |
| `../Optimization/update-notifier.js` | Service worker update popup |
| `../Optimization/offline-content-manager.js` | Offline caching logic |
| `../mobile/pwa-init.js` (in `<head>`) | Service worker registration |
| Splash Logic script | Session check + auto-dismiss + failsafe |

---

## 👑 Footer Crown Icon {#footer-crown-icon}

The footer contains social/navigation icons. A **crown icon** links to the Only Boss admin panel:

```html
<a href="../Only-boss/auth/only-boss.html"
   class="social-link"
   title="Only Boss"
   aria-label="Only Boss admin panel">
  <i class="fas fa-crown"></i>
</a>
```

This link is intentionally unlabeled in the UI (no visible text) — it blends with the social icons row so only the site owner knows it's there.

---

## ⚙️ How to Update {#how-to-update}

### Change Profile Photo
1. Replace `d:\Skill\Website\A3KM Studio\images\PP.jpg`
2. Must be **1:1 ratio** (square crop). Width/height both ≥ 800px is recommended.
3. No code change needed — the file reference is already correct.

### Add a New Hero Button
Find the `.hero-buttons` div and add a button:
```html
<a href="YOUR_LINK" class="btn btn-secondary">
  <i class="fas fa-ICON"></i> Button Text
</a>
```

### Update Social Links (Footer)
Find the `<footer>` section and edit the `.social-links` div.

### Change Splash Duration
Find the splash JS script block and change the `1600` value (milliseconds):
```javascript
setTimeout(() => removeSplashScreen(), 1600);  // ← change this
```

---

## ⚠️ Important Notes

- **Do NOT** add an external CSS file for the homepage — all styles must stay inline to preserve the single-file architecture.
- The homepage is **desktop only**. The mobile version is at `mobile/home/index.html`.
- The `splash-active` class on `<body>` must be present in the HTML markup (not added by JS) to prevent flash of scrollable content before JS loads.
- `pwa-init.js` must be in `<head>` (not before `</body>`) for fastest service worker registration.
