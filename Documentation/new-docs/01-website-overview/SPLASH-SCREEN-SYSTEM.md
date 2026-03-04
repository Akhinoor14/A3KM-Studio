---
title: "Splash Screen System — A3KM Studio"
description: "Technical documentation of the A3KM Studio splash screen: session-based one-time display, CSS animations (logoReveal, textSlideUp, splashSpin, splashFadeOut), HTML structure, JavaScript logic with sessionStorage, click-to-skip, auto-dismiss, and failsafe timeout."
date: 2026-03-05
lastUpdated: 2026-03-05
version: "1.0.0"
author: Md Akhinoor Islam
authorEmail: mdakhinoorislam@gmail.com
organization: A3KM Studio | Noor Academy
category: website-overview
difficulty: intermediate
readTime: "7 min"
wordCount: 1000
tags: [splash-screen, animation, pwa, first-load, sessionStorage, css-animation]
status: complete
featured: false
prerequisites:
  - "Basic CSS animation knowledge"
  - "Understanding of sessionStorage vs localStorage"
relatedDocs:
  - "./HOME-PAGE-BUILD.md"
  - "../10-mobile-experience/README.md"
changelog:
  - version: "1.0.0"
    date: "2026-03-05"
    changes: "Initial documentation — ported from archive index.html to new Home/index.html"
---

# 💫 Splash Screen System — A3KM Studio

> **📚 Overview:** The splash screen is a full-screen animated intro that shows on the **first visit** of a browser session. It auto-dismisses after 1.6 seconds and can be skipped by a click. It is implemented entirely inline in `Home/index.html` — no external file needed. This document covers the complete HTML, CSS, and JS implementation.

---

## 📋 Table of Contents

- [🏗 Architecture](#architecture)
- [📐 HTML Structure](#html-structure)
- [🎨 CSS Animations](#css-animations)
- [⚙️ JavaScript Logic](#javascript-logic)
- [🔄 Session vs Local Storage](#session-vs-local-storage)
- [🎛 Customization Reference](#customization)
- [⚠️ Known Edge Cases](#edge-cases)

---

## 🏗 Architecture {#architecture}

The splash screen is **self-contained in `Home/index.html`**:

| Part | Location in file |
|---|---|
| CSS animations + styles | Second `<style>` block after main styles, before `</head>` |
| HTML overlay | First child of `<body>`, before the navbar |
| JavaScript logic | Last `<script>` block before `</body>` |

The `<body>` tag carries `class="splash-active"` in the HTML markup (not added by JS), which allows CSS to apply overflow:hidden before any JS executes — preventing a flash of scrollable content.

---

## 📐 HTML Structure {#html-structure}

```html
<div id="appSplash" class="splash-screen">
  <div class="splash-content">
    <!-- Logo monogram -->
    <div class="splash-logo">A3KM</div>

    <!-- Studio name -->
    <div class="splash-title">A3KM Studio</div>

    <!-- Tagline -->
    <div class="splash-subtitle">Engineering · Education · Innovation</div>

    <!-- Spinner -->
    <div class="splash-loader">
      <div class="splash-ring"></div>
    </div>

    <!-- Skip hint -->
    <div class="splash-hint">Click anywhere to skip</div>
  </div>
</div>
```

**Placed as the very first child of `<body>`** so it renders before any other content.

---

## 🎨 CSS Animations {#css-animations}

Four keyframe animations drive the splash screen:

### 1. `logoReveal` — Logo entrance
```css
@keyframes logoReveal {
  from {
    opacity: 0;
    transform: scale(0.5);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
```
Applied to `.splash-logo`. Duration: `0.8s ease-out`.

### 2. `textSlideUp` — Text entrance
```css
@keyframes textSlideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```
Applied to `.splash-title` (delay: 0.3s) and `.splash-subtitle` (delay: 0.5s).

### 3. `splashSpin` — Loader ring
```css
@keyframes splashSpin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
```
Applied to `.splash-ring`. Duration: `1s linear infinite`.

The ring is a CSS-only spinner using `border-top` color trick:
```css
.splash-ring {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255,255,255,0.2);
  border-top-color: #CC0000;
  border-radius: 50%;
  animation: splashSpin 1s linear infinite;
}
```

### 4. `splashFadeOut` — Dismiss animation
```css
@keyframes splashFadeOut {
  from { opacity: 1; }
  to   { opacity: 0; pointer-events: none; }
}
```
Applied to `.splash-screen.hiding` class (added by JS when dismissing). Duration: `0.5s ease-out`.

### Body Overflow Lock
```css
body.splash-active {
  overflow: hidden;
}
```
Prevents background scroll while splash is visible.

---

## ⚙️ JavaScript Logic {#javascript-logic}

The complete splash JS (placed in the last `<script>` block before `</body>`):

```javascript
document.addEventListener('DOMContentLoaded', function() {
    const splash = document.getElementById('appSplash');
    if (!splash) return;

    function removeSplashScreen() {
        if (splash.classList.contains('hiding')) return; // prevent double-run
        splash.classList.add('hiding');
        setTimeout(function() {
            splash.style.display = 'none';
            document.body.classList.remove('splash-active');
        }, 500); // matches splashFadeOut duration
    }

    // Check if already shown this session
    if (sessionStorage.getItem('splashShown')) {
        // Skip immediately — no animation
        splash.style.display = 'none';
        document.body.classList.remove('splash-active');
    } else {
        // First visit — show and set flag
        sessionStorage.setItem('splashShown', 'true');

        // Auto-dismiss after 1.6 seconds
        setTimeout(removeSplashScreen, 1600);

        // Click anywhere to skip
        splash.addEventListener('click', removeSplashScreen);

        // Failsafe: force remove after 4 seconds regardless
        setTimeout(removeSplashScreen, 4000);
    }
});
```

### Logic Flow Diagram

```
Page Load
    │
    ├─ sessionStorage('splashShown') exists?
    │       │
    │      YES → hide immediately, no animation
    │       │
    │      NO  → show splash, set 'splashShown' = 'true'
    │               │
    │               ├─ After 1600ms → removeSplashScreen()
    │               ├─ On click    → removeSplashScreen()
    │               └─ After 4000ms → removeSplashScreen() (failsafe)
    │
    └─ removeSplashScreen()
            │
            ├─ Add class 'hiding' → triggers splashFadeOut CSS (0.5s)
            └─ After 500ms → display:none + remove 'splash-active' from body
```

---

## 🔄 Session vs Local Storage {#session-vs-local-storage}

The splash uses **`sessionStorage`** — not `localStorage`.

| | `sessionStorage` | `localStorage` |
|---|---|---|
| Scope | Current browser tab/session | Permanent until cleared |
| Cleared when | Tab is closed | Manually or by user |
| Used for | Splash (show once per session) | Persistent preferences |

**Why sessionStorage?**
- Users who open a new tab get the splash again → feels fresh
- Users who navigate within the same tab do not get it again → not annoying
- Closing and reopening the browser shows the splash again → good for returning visitors on a new day

---

## 🎛 Customization Reference {#customization}

| What to change | Where to find it | What to edit |
|---|---|---|
| Auto-dismiss timing | JS: `setTimeout(removeSplashScreen, 1600)` | Change `1600` (ms) |
| Failsafe timing | JS: `setTimeout(removeSplashScreen, 4000)` | Change `4000` (ms) |
| Logo text | HTML: `<div class="splash-logo">A3KM</div>` | Change inner text |
| Tagline text | HTML: `<div class="splash-subtitle">` | Change inner text |
| Spinner color | CSS: `.splash-ring { border-top-color: #CC0000; }` | Change hex color |
| Fade-out duration | CSS: `splashFadeOut` + JS `setTimeout(..., 500)` | Both must match |
| Background color | CSS: `.splash-screen { background: ... }` | Change gradient |

---

## ⚠️ Known Edge Cases {#edge-cases}

### Hard Refresh (Ctrl+F5)
`sessionStorage` is **preserved** on hard refresh in most browsers. The splash will **not** re-show on hard refresh if it was already shown in the session. This is by design.

### Opening in New Tab
A new tab = new sessionStorage context. The splash **will show** in a new tab. This is expected behavior.

### JavaScript Disabled
If JS is disabled, the splash overlay will stay visible permanently, blocking the entire page. The site requires JS to function (PWA, navigation, etc.), so this is acceptable.

### Slow Connection
The 4-second failsafe ensures the page is never blocked by the splash regardless of connection speed or JS execution delays.

### `splash-active` Class Must Be in HTML Markup
The `<body class="splash-active">` **must be in the HTML source** (not added by JS). If it's added by JS, there will be a flash of scrollable content before JS executes. The HTML attribute prevents this flash.
