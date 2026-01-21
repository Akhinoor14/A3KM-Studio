# Desktop Files with Mobile CSS to Remove

**Date:** January 22, 2026  
**Purpose:** Identify all @media queries and mobile-specific code in desktop files  
**Action:** Remove mobile CSS from these desktop files after deleting mobile-specific files

---

## 🎯 CRITICAL FILES WITH MEDIA QUERIES

### About Me Section:

#### 1. `About me/about-desktop.css`
- **Line 1622:** `@media (max-width: 768px)`
- **Action:** Remove entire media query block
- **Scope:** Multiple responsive rules for mobile screens

#### 2. `About me/certificates-viewer.html`
- **Line 611:** `@media (max-width: 768px)`
- **Action:** Remove media query from inline styles
- **Note:** Also has redirect to about-mobile.html (line 1078) - remove

#### 3. `About me/about formate and top bar.html`
- **Line 14:** Links to `mobile-clean.css`
- **Line 24:** Mobile redirect
- **Action:** Remove both stylesheet link and redirect script

---

### Contact Section:

#### 4. `Contact/contact.html`
- **Line 15:** Links to `../Optimization/mobile-clean.css`
- **Line 25:** Mobile redirect
- **Line 411:** `@media (max-width: 768px)`
- **Action:** 
  - Remove mobile-clean.css link
  - Remove redirect script
  - Remove @media query block

#### 5. `Contact/mobile-contact-fix.css` - **DELETE THIS FILE**
Contains multiple media queries:
- Line 17, 54, 199, 213, 317, 405, 475, 518, 564, 668, 701
- Line 647: Landscape orientation
- **File is entirely for mobile** - delete it completely

---

### Content Studio Section:

#### 6. `Content Studio/hub-desktop.css`
- **Line 858:** `@media (max-width: 768px)`
- **Line 1127:** `@media (max-width: 768px)`
- **Action:** Remove both media query blocks
- **Important:** This is the desktop CSS, should have NO mobile queries

#### 7. `Content Studio/hub.html`
- **Line 21:** Mobile redirect to `hub-mobile.html`
- **Action:** Remove redirect script

#### 8. `Content Studio/service-worker.js`
- **Line 16:** `'/Content Studio/hub-mobile.html'`
- **Line 17:** `'/Content Studio/hub-mobile.css'`
- **Action:** Remove these two lines from cache array

#### 9. `Content Studio/i18n.js`
- **Line 382:** `@media (max-width: 768px)`
- **Action:** Review and remove if it's injecting mobile styles

#### 10. `Content Studio/pwa-manager.js`
- **Line 459:** `@media (max-width: 768px)`
- **Action:** Review and remove if it's injecting mobile styles

#### Content Studio Sub-pages:
All following files have `@media (max-width: 768px)` - review each:

11. **`books-pdfs/book-listing-new.html`** - Line 388
12. **`books-pdfs/book-reader-new.html`** - Line 431
13. **`educational-videos/course-listing-new.html`** - Line 430
14. **`educational-videos/course-viewer-new.html`** - Line 607
15. **`research-papers/paper-listing-new.html`** - Line 631
16. **`research-papers/paper-viewer-new.html`** - Line 714
17. **`video-content/video-gallery.html`** - Line 403
18. **`video-content/video-viewer.html`** - Line 650
19. **`written-posts/post-listing-new.html`** - Lines 177, 538
20. **`written-posts/post-viewer.css`** - Lines 576, 705, 952

**Action for 11-20:** These are NEW desktop pages. Keep media queries IF they're for responsive desktop design. Remove ONLY if they're trying to redirect or show mobile-specific content.

---

### Home Section:

#### 21. `Home/index.html`
- **Line 23:** Links to `../Optimization/mobile-clean.css`
- **Line 33:** Mobile redirect to `home-mobile.html`
- **Action:**
  - Remove mobile-clean.css link
  - Remove redirect script

---

### Projects Section:

#### 22. `Projects Code/Arduino/arduino-project-viewer.html`
- **Line 810:** `@media (max-width: 768px)`
- **Line 1771:** `@media (max-width: 768px)`
- **Lines 1917-1929:** Mobile navigation links
- **Action:** Remove both media query blocks and mobile nav

#### 23. `Projects Code/Arduino/arduino-projects.html`
- **Lines 708-720:** Mobile navigation in HTML
- **Line 775:** Conditional redirect to projects-mobile.html
- **Action:** 
  - Remove mobile nav section
  - Update conditional links to only desktop

#### 24. `Projects Code/Arduino/nn.html`
- **Lines 1150-1162:** Mobile navigation
- **Lines 1217, 1228, 1400:** Conditional redirects to projects-mobile.html
- **Action:** Remove mobile nav and conditional logic

#### 25. `Projects Code/Electronics/capacitor-decoder/capacitor-decoder.html`
- **Lines 629-641:** Mobile navigation
- **Line 692:** Conditional href change for mobile
- **Line 699:** Link to `electronics-tools-mobile.html`
- **Action:** Remove mobile nav, update links

#### 26. `Projects Code/Electronics/electronics tool/electronics-tools-desktop.html`
- **Line 344:** Conditional redirect logic
- **Action:** Simplify to desktop-only link

---

### Optimization Section (Global):

#### 27. `Optimization/service-worker.js`
Multiple mobile file references:
- Line 11: `/home-mobile.html`
- Line 12: `/contact-mobile.html`
- Line 13: `/about-mobile.html`
- Line 15: `/classwork-mobile.html`
- Line 16: `/homework-mobile.html`
- Line 17: `/solo-mobile.html`
- Line 19: `/home-mobile.css`
- **Action:** Remove all these lines from cache array

#### 28. `Optimization/manifest.json`
- **Line 73:** Mobile contact URL in shortcuts
- **Action:** Update to desktop URL or remove if not needed

---

### Only Boss Section (Admin):

#### 29. `Only boss/admin-panel.html`
- **Line 351:** `@media (max-width: 768px)`
- **Action:** Review - may need responsive design, or remove

#### 30. `Only boss/certificates-manager.html`
- **Line 340:** `@media (max-width: 768px)`
- **Action:** Review - may need responsive design, or remove

#### 31. `Only boss/content-editor.html`
- **Line 454:** `@media (max-width: 768px)`
- **Action:** Review - may need responsive design, or remove

#### 32. `Only boss/content-upload-interface.html`
- **Lines 555, 934:** `@media (max-width: 768px)`
- **Action:** Review - may need responsive design, or remove

#### 33. `Only boss/matlab-manager.html`
- **Line 361:** `@media (max-width: 768px)`
- **Action:** Review - may need responsive design, or remove

#### 34. `Only boss/only-boss-navbar.css`
- **Lines 132, 183:** `@media (max-width: 768px)`
- **Action:** Review - admin panel may need responsive, decide case by case

---

## 📋 CLEANUP STRATEGY

### Category A: DELETE IMMEDIATELY
Files that are entirely mobile-specific:
- All files in MOBILE-FILES-TO-DELETE.md
- `Contact/mobile-contact-fix.css`
- `Optimization/mobile-clean.css`
- `Optimization/mobile-modals-fix.css`
- `Optimization/navbar/mobile-top-nav.css`

### Category B: REMOVE REDIRECT SCRIPTS
Simple script removal:
```javascript
// REMOVE THIS PATTERN FROM ALL FILES:
if (window.innerWidth <= 768) {
  window.location.replace('*-mobile.html');
}
```
**Files:** (7 files listed in previous document)

### Category C: REMOVE STYLESHEET LINKS
Remove links to mobile stylesheets:
```html
<!-- REMOVE THESE: -->
<link rel="stylesheet" href="../Optimization/mobile-clean.css">
<link rel="stylesheet" href="about-mobile.css">
<link rel="stylesheet" href="*-mobile*.css">
```

### Category D: REMOVE MEDIA QUERIES IN DESKTOP CSS
Desktop CSS should NOT have mobile breakpoints:
- `About me/about-desktop.css`
- `Content Studio/hub-desktop.css`
- Any file named *-desktop.css

### Category E: CLEAN NAVIGATION HTML
Remove mobile navigation sections:
```html
<!-- REMOVE MOBILE NAV BLOCKS -->
<nav class="mobile-top-nav">...</nav>
```

### Category F: UPDATE SERVICE WORKERS
Remove mobile file references from cache arrays

### Category G: REVIEW - KEEP OR REMOVE
Admin panel files (`Only boss/`) - these might legitimately need responsive design for tablets

---

## 🛠️ EXECUTION PLAN

### Phase 1: Safe Deletions (10 min)
1. Delete files from MOBILE-FILES-TO-DELETE.md
2. Remove redirect scripts from 7 HTML files
3. Remove mobile stylesheet links

### Phase 2: CSS Cleanup (15 min)
1. Remove media queries from about-desktop.css
2. Remove media queries from hub-desktop.css
3. Clean any other *-desktop.css files

### Phase 3: HTML Structure Cleanup (20 min)
1. Remove mobile navigation from project viewer files
2. Update conditional links (remove mobile.html references)
3. Clean inline styles with mobile media queries

### Phase 4: Service Worker & Config (5 min)
1. Update Content Studio/service-worker.js
2. Update Optimization/service-worker.js
3. Update Optimization/manifest.json

### Phase 5: Content Studio Pages Review (15 min)
1. Check each sub-page media query
2. Decide: keep for responsive or remove
3. Test desktop after changes

### Phase 6: Admin Panel Review (10 min)
1. Decide if admin needs responsive design
2. Keep or remove media queries accordingly

### Phase 7: Verification (15 min)
1. Search for remaining "mobile" references
2. Test all desktop pages
3. Check browser console for errors
4. Verify no broken links

---

## 🔍 SEARCH COMMANDS FOR VERIFICATION

After cleanup, run these to find remaining references:

```powershell
# Find mobile HTML references
Select-String -Path "*.html" -Pattern "mobile\.html" -Recurse

# Find mobile CSS references  
Select-String -Path "*.html","*.css" -Pattern "mobile.*\.css" -Recurse

# Find mobile redirect patterns
Select-String -Path "*.html","*.js" -Pattern "window\.innerWidth.*768" -Recurse

# Find media query breakpoints
Select-String -Path "*.css","*.html" -Pattern "@media.*max-width.*768" -Recurse

# Find mobile-specific classes
Select-String -Path "*.*" -Pattern "class=.*mobile-" -Recurse
```

---

## ✅ DETAILED CHECKLIST

### Redirect Removal:
- [ ] About me/about.html (line 20)
- [ ] About me/about formate and top bar.html (line 24)
- [ ] About me/about referenece.html (line 20)
- [ ] About me/certificates-viewer.html (line 1078)
- [ ] Contact/contact.html (line 25)
- [ ] Content Studio/hub.html (line 21)
- [ ] Home/index.html (line 33)

### Stylesheet Link Removal:
- [ ] About me/about formate and top bar.html (line 14)
- [ ] Contact/contact.html (line 15)
- [ ] Home/index.html (line 23)

### Media Query Removal (Desktop CSS):
- [ ] About me/about-desktop.css (line 1622)
- [ ] Content Studio/hub-desktop.css (lines 858, 1127)

### Media Query Review (Content Studio):
- [ ] books-pdfs/book-listing-new.html (line 388)
- [ ] books-pdfs/book-reader-new.html (line 431)
- [ ] educational-videos/course-listing-new.html (line 430)
- [ ] educational-videos/course-viewer-new.html (line 607)
- [ ] research-papers/paper-listing-new.html (line 631)
- [ ] research-papers/paper-viewer-new.html (line 714)
- [ ] video-content/video-gallery.html (line 403)
- [ ] video-content/video-viewer.html (line 650)
- [ ] written-posts/post-listing-new.html (lines 177, 538)
- [ ] written-posts/post-viewer.css (lines 576, 705, 952)

### Navigation Cleanup:
- [ ] Arduino/arduino-project-viewer.html (lines 1917-1929)
- [ ] Arduino/arduino-projects.html (lines 708-720, 775)
- [ ] Arduino/nn.html (lines 1150-1162, 1217, 1228, 1400)
- [ ] Electronics/capacitor-decoder/capacitor-decoder.html (lines 629-641, 692, 699)
- [ ] Electronics/electronics tool/electronics-tools-desktop.html (line 344)

### Service Worker Cleanup:
- [ ] Content Studio/service-worker.js (lines 16-17)
- [ ] Optimization/service-worker.js (lines 11-19)
- [ ] Optimization/manifest.json (line 73)

### Admin Panel Review:
- [ ] Only boss/admin-panel.html (line 351)
- [ ] Only boss/certificates-manager.html (line 340)
- [ ] Only boss/content-editor.html (line 454)
- [ ] Only boss/content-upload-interface.html (lines 555, 934)
- [ ] Only boss/matlab-manager.html (line 361)
- [ ] Only boss/only-boss-navbar.css (lines 132, 183)

---

**Total Files to Edit:** 34+ files  
**Estimated Time:** 1.5-2 hours  
**Difficulty:** Medium (careful work required)

---

*Keep this document open while cleaning. Mark items as you complete them.*
