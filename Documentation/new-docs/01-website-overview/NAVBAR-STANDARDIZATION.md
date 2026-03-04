---
title: "Navbar Standardization — Desktop Pages"
description: "Documents the standardization of the navigation bar across all A3KM Studio desktop pages, including the correct tagline text, icon aria attributes, image loading attributes, and CV download path that all pages must share."
date: 2026-03-05
lastUpdated: 2026-03-05
version: "1.0.0"
author: Md Akhinoor Islam
authorEmail: mdakhinoorislam@gmail.com
organization: A3KM Studio | Noor Academy
category: website-overview
difficulty: beginner
readTime: "5 min"
wordCount: 700
tags: [navbar, accessibility, aria, standardization, desktop, navigation]
status: complete
featured: false
prerequisites:
  - "Access to any A3KM Studio desktop HTML file"
relatedDocs:
  - "./HOME-PAGE-BUILD.md"
  - "../13-development-setup/CV-LINK-FIX.md"
changelog:
  - version: "1.0.0"
    date: "2026-03-05"
    changes: "Initial documentation of navbar standardization"
---

# 🧭 Navbar Standardization — Desktop Pages

> **📚 Overview:** All A3KM Studio desktop pages must share an identical navbar. This document defines the exact correct navbar structure — tagline, aria labels, image attributes, and CV link — that every desktop HTML page must use. It also documents the issues that were found on the homepage and how they were fixed.

---

## 📋 Table of Contents

- [📐 Standard Navbar Structure](#standard-navbar-structure)
- [🔍 Issues Found on Homepage](#issues-found)
- [✅ Fixes Applied](#fixes-applied)
- [📋 Checklist for New Pages](#checklist)

---

## 📐 Standard Navbar Structure {#standard-navbar-structure}

The reference implementation is `About me/about.html`. All other desktop pages must match it exactly.

### Tagline

```html
<span class="nav-tagline">Engineering · Education · Innovation</span>
```

**The three words:** `Engineering`, `Education`, `Innovation` — in that order, separated by ` · `.

### Logo / Brand Link

```html
<a href="../Home/index.html" class="nav-brand" aria-label="A3KM Studio Home">
  <img src="../images/logo.png" alt="A3KM Studio" loading="lazy" aria-hidden="false">
  <div class="brand-text">
    <span class="brand-name">A3KM Studio</span>
    <span class="nav-tagline">Engineering · Education · Innovation</span>
  </div>
</a>
```

### Nav Links Structure

Each nav link follows this pattern:

```html
<a href="PATH" class="nav-link" aria-label="DESCRIPTIVE LABEL">
  <i class="fas fa-ICON" aria-hidden="true"></i>
  <span>Link Text</span>
</a>
```

Key attributes:
- `aria-label` — screen reader description on the `<a>` tag
- `aria-hidden="true"` — on every `<i>` icon (decorative)
- `loading="lazy"` — on every `<img>` in the navbar

### CV Download Link (Standard)

```html
<a href="../About me/CV/Akhinoor_Islam_CV_2026.pdf"
   class="nav-link cv-link"
   aria-label="Download CV"
   download="Akhinoor_Islam_CV_2026.pdf">
  <i class="fas fa-file-pdf" aria-hidden="true"></i>
  <span>Download CV</span>
</a>
```

> ⚠️ The path `../About me/CV/Akhinoor_Islam_CV_2026.pdf` is relative to the HTML file's location. Pages in subfolders (e.g. `Content Studio/hub.html`) use `../About me/CV/...` while pages two levels deep use `../../About me/CV/...`.

### Navbar Activation Script

Every desktop page must include this script before `</body>` for the scroll-activated glass effect:

```javascript
// Navbar scroll activation
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Active nav link highlighting
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    if (link.href === window.location.href) {
        link.classList.add('active');
    }
});
```

---

## 🔍 Issues Found on Homepage {#issues-found}

When comparing `Home/index.html` against the reference `About me/about.html`, the following discrepancies were found:

| Issue | Found Value | Correct Value |
|---|---|---|
| Tagline text | `"Engineering · Innovation"` | `"Engineering · Education · Innovation"` |
| Icon `aria-hidden` | Missing on most `<i>` tags | `aria-hidden="true"` on all decorative icons |
| Image `loading` attr | Missing on navbar `<img>` | `loading="lazy"` |
| CV download path | Absolute URL (`https://...`) | Relative path (`../About me/CV/Akhinoor_Islam_CV_2026.pdf`) |
| `aria-label` on links | Missing on most links | Present on all links |

---

## ✅ Fixes Applied {#fixes-applied}

All issues above were corrected in `Home/index.html`:

1. **Tagline** — added `· Education ·` to restore the full three-part tagline
2. **Icon aria attributes** — all `<i class="fas ...">` in the navbar now have `aria-hidden="true"`
3. **Image loading** — `loading="lazy"` added to the logo `<img>`
4. **CV path** — changed from the broken absolute URL to `../About me/CV/Akhinoor_Islam_CV_2026.pdf`
5. **Aria-labels** — all nav `<a>` tags now have descriptive `aria-label` attributes

---

## 📋 Checklist for New Pages {#checklist}

When creating a new desktop page, verify the navbar against this checklist:

- [ ] Tagline reads exactly: `Engineering · Education · Innovation`
- [ ] Brand logo has `loading="lazy"` and `aria-hidden="false"`
- [ ] All `<i>` icons in navbar have `aria-hidden="true"`
- [ ] All `<a class="nav-link">` have `aria-label="..."`
- [ ] CV link uses the correct relative path (not an absolute URL)
- [ ] CV link has `download="Akhinoor_Islam_CV_2026.pdf"` attribute
- [ ] Navbar activation script is present before `</body>`
- [ ] The current page's nav link has class `active` (either via JS or hardcoded)

---

## ⚠️ Common Mistakes to Avoid

| ❌ Wrong | ✅ Correct |
|---|---|
| `href="https://a3km.vercel.app/About me/CV/..."` | `href="../About me/CV/Akhinoor_Islam_CV_2026.pdf"` |
| `<i class="fas fa-home">` (no aria-hidden) | `<i class="fas fa-home" aria-hidden="true">` |
| Tagline: `"Engineering · Innovation"` | Tagline: `"Engineering · Education · Innovation"` |
| `<img src="logo.png">` (no loading) | `<img src="logo.png" loading="lazy">` |
| `<a href="...">` (no aria-label) | `<a href="..." aria-label="Home page">` |
