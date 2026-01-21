# Mobile Files to Delete - Complete List

**Date:** January 22, 2026  
**Purpose:** List of all mobile-specific files to be deleted before mobile redesign  
**Action:** Review and delete these files

---

## 📱 HTML FILES TO DELETE

### About Me Section:
- [ ] `About me/about-mobile.html` (635 lines)

### Browse Github Section:
- [ ] `Browse Github/browse-git-files-mobile.html` (contains mobile navigation and file browsing)

### Contact Section:
- [ ] `Contact/contact-mobile.html` (contains mobile contact form)

### Content Studio Section:
- [ ] `Content Studio/hub-mobile.html` (main content studio mobile hub)

### Home Section:
- [ ] `Home/home-mobile.html` (227 lines - main mobile homepage)

### Projects Section:
- [ ] `Projects Code/projects-mobile.html` (1245 lines - main projects gallery mobile)
- [ ] `Projects Code/Arduino/arduino-projects-mobile.html` (mobile Arduino projects viewer)
- [ ] `Projects Code/Electronics/electronics tool/electronics-tools-mobile.html` (mobile electronics tools)
- [ ] `Projects Code/Portfolio/portfolio-project-mobile.html` (mobile portfolio project viewer)

**Total HTML Files: 9 files**

---

## 🎨 CSS FILES TO DELETE

### About Me Section:
- [ ] `About me/about-mobile.css` (mobile-specific styles for about page)

### Browse Github Section:
- [ ] `Browse Github/browse-git-files-mobile.css` (1463+ lines - mobile git browser styles)

### Contact Section:
- [ ] `Contact/contact-mobile-clean.css` (mobile contact page styles)
- [ ] `Contact/mobile-contact-fix.css` (701+ lines - various mobile fixes)

### Content Studio Section:
- [ ] `Content Studio/hub-mobile.css` (522+ lines - mobile hub styles)

### Home Section:
- [ ] `Home/home-mobile.css` (mobile home page styles)

### Optimization Section (Global Mobile Styles):
- [ ] `Optimization/mobile-clean.css` (base mobile styles used across pages)
- [ ] `Optimization/mobile-modals-fix.css` (mobile modal system fixes)
- [ ] `Optimization/navbar/mobile-top-nav.css` (mobile navigation bar styles)

### Only Boss Section:
- [ ] `Only boss/mobile-boss-dashboard-fix.css` (admin panel mobile fixes)

**Total CSS Files: 10 files**

---

## 📜 JAVASCRIPT FILES TO CHECK/REVIEW

### Content Studio:
- [ ] `Content Studio/mobile-enhancements.js` - **REVIEW:** May contain mobile-specific JS to extract/remove

### Note about JavaScript:
Most JS files use feature detection or media queries. After HTML/CSS deletion, search for:
- `window.innerWidth <= 768`
- `matchMedia('max-width: 768px')`
- Mobile-specific event listeners
- Touch event handlers specific to mobile redirects

**JavaScript files may need selective editing, not full deletion**

---

## 🔗 FILES WITH MOBILE REFERENCES TO CLEAN

### Files containing mobile redirects (remove redirect logic):
1. [ ] `About me/about.html` - Line 20: Redirect to about-mobile.html
2. [ ] `About me/about formate and top bar.html` - Line 24: Redirect to about-mobile.html
3. [ ] `About me/about referenece.html` - Line 20: Redirect to about-mobile.html
4. [ ] `About me/certificates-viewer.html` - Line 1078: Redirect to about-mobile.html
5. [ ] `Contact/contact.html` - Line 25: Redirect to contact-mobile.html
6. [ ] `Content Studio/hub.html` - Line 21: Redirect to hub-mobile.html
7. [ ] `Home/index.html` - Line 33: Redirect to home-mobile.html

### Files with mobile navigation links (to be updated/removed):
- [ ] `Projects Code/Arduino/arduino-project-viewer.html` - Lines 1917-1929: Mobile nav links
- [ ] `Projects Code/Arduino/arduino-projects.html` - Lines 708-720: Mobile nav links
- [ ] `Projects Code/Arduino/nn.html` - Lines 1150-1162: Mobile nav links
- [ ] `Projects Code/Electronics/capacitor-decoder/capacitor-decoder.html` - Lines 629-641: Mobile nav
- [ ] All other project viewer pages with similar patterns

### Service Workers & Manifest (update cached files):
- [ ] `Content Studio/service-worker.js` - Lines 16-17: References to hub-mobile files
- [ ] `Optimization/service-worker.js` - Lines 11-19: Mobile HTML/CSS references
- [ ] `Optimization/manifest.json` - Line 73: Mobile contact URL

### Navigation & Index Files:
- [ ] `index.html` (root) - May need to check for mobile references
- [ ] Any sitemap or navigation config files

---

## 📊 SUMMARY

| Category | Count | Action |
|----------|-------|--------|
| **HTML Files** | 9 | DELETE completely |
| **CSS Files** | 10 | DELETE completely |
| **JS Files** | 1+ | REVIEW & selectively edit |
| **Files to Update** | 15+ | REMOVE mobile redirects/links |
| **Config Files** | 2-3 | UPDATE cached file lists |

---

## 🛠️ CLEANUP PROCEDURE

### Step 1: Backup (IMPORTANT!)
```bash
# Create a branch or commit current state
git add .
git commit -m "Before mobile file cleanup"
git branch backup-before-mobile-cleanup
```

### Step 2: Delete Mobile-Specific Files
**Order:** HTML files → CSS files → Check JS files

**Command (PowerShell):**
```powershell
# Delete HTML files
Remove-Item "About me/about-mobile.html"
Remove-Item "Browse Github/browse-git-files-mobile.html"
Remove-Item "Contact/contact-mobile.html"
Remove-Item "Content Studio/hub-mobile.html"
Remove-Item "Home/home-mobile.html"
Remove-Item "Projects Code/projects-mobile.html"
Remove-Item "Projects Code/Arduino/arduino-projects-mobile.html"
Remove-Item "Projects Code/Electronics/electronics tool/electronics-tools-mobile.html"
Remove-Item "Projects Code/Portfolio/portfolio-project-mobile.html"

# Delete CSS files
Remove-Item "About me/about-mobile.css"
Remove-Item "Browse Github/browse-git-files-mobile.css"
Remove-Item "Contact/contact-mobile-clean.css"
Remove-Item "Contact/mobile-contact-fix.css"
Remove-Item "Content Studio/hub-mobile.css"
Remove-Item "Home/home-mobile.css"
Remove-Item "Optimization/mobile-clean.css"
Remove-Item "Optimization/mobile-modals-fix.css"
Remove-Item "Optimization/navbar/mobile-top-nav.css"
Remove-Item "Only boss/mobile-boss-dashboard-fix.css"
```

### Step 3: Remove Mobile Redirects
Remove these code blocks from desktop HTML files:
```javascript
// REMOVE THIS PATTERN:
if (window.innerWidth <= 768) {
  window.location.replace('*-mobile.html');
}
```

Files to edit:
1. About me/about.html
2. About me/about formate and top bar.html
3. About me/about referenece.html
4. About me/certificates-viewer.html
5. Contact/contact.html
6. Content Studio/hub.html
7. Home/index.html

### Step 4: Clean Service Workers
Remove mobile file references from:
1. `Content Studio/service-worker.js`
2. `Optimization/service-worker.js`
3. `Optimization/manifest.json`

### Step 5: Remove @media Mobile-First Code in Desktop Files

**Files to check and clean:**
1. `About me/about-desktop.css` - Line 1622: `@media (max-width: 768px)`
2. `Contact/contact.html` - Line 411: `@media (max-width: 768px)`
3. `Content Studio/hub-desktop.css` - Lines 858, 1127: Mobile media queries
4. `Projects Code/Arduino/arduino-project-viewer.html` - Lines 810, 1771: Mobile styles

**Action:** Remove or comment out mobile-specific media queries in desktop files.

### Step 6: Update Navigation Links
Search and replace in project viewer pages:
- Find: Links to `*-mobile.html` files
- Action: Update to responsive pages or remove mobile nav entirely

### Step 7: Check for Orphaned References
```bash
# Search for remaining mobile references
grep -r "mobile\.html" .
grep -r "mobile\.css" .
grep -r "mobile-" .
```

### Step 8: Verify Desktop Still Works
**Test each page:**
- [ ] Home page (desktop view)
- [ ] About page (desktop view)
- [ ] Projects page (desktop view)
- [ ] Content Studio (desktop view)
- [ ] Contact page (desktop view)
- [ ] All sub-pages and project viewers

---

## ⚠️ IMPORTANT NOTES

1. **Do NOT delete `mobile-enhancements.js`** until reviewing its contents
2. **Do NOT touch desktop CSS files** except to remove mobile media queries
3. **Backup before starting** - cannot be stressed enough
4. **Test desktop after deletion** - ensure nothing breaks
5. **Keep this checklist** and mark items as you complete them

---

## ✅ DELETION CHECKLIST

Mark with [x] as you delete each file:

### HTML Files:
- [ ] About me/about-mobile.html
- [ ] Browse Github/browse-git-files-mobile.html
- [ ] Contact/contact-mobile.html
- [ ] Content Studio/hub-mobile.html
- [ ] Home/home-mobile.html
- [ ] Projects Code/projects-mobile.html
- [ ] Projects Code/Arduino/arduino-projects-mobile.html
- [ ] Projects Code/Electronics/electronics tool/electronics-tools-mobile.html
- [ ] Projects Code/Portfolio/portfolio-project-mobile.html

### CSS Files:
- [ ] About me/about-mobile.css
- [ ] Browse Github/browse-git-files-mobile.css
- [ ] Contact/contact-mobile-clean.css
- [ ] Contact/mobile-contact-fix.css
- [ ] Content Studio/hub-mobile.css
- [ ] Home/home-mobile.css
- [ ] Optimization/mobile-clean.css
- [ ] Optimization/mobile-modals-fix.css
- [ ] Optimization/navbar/mobile-top-nav.css
- [ ] Only boss/mobile-boss-dashboard-fix.css

### Code Cleanup:
- [ ] Remove redirects from About me/about.html
- [ ] Remove redirects from About me/about formate and top bar.html
- [ ] Remove redirects from About me/about referenece.html
- [ ] Remove redirects from About me/certificates-viewer.html
- [ ] Remove redirects from Contact/contact.html
- [ ] Remove redirects from Content Studio/hub.html
- [ ] Remove redirects from Home/index.html
- [ ] Clean Content Studio/service-worker.js
- [ ] Clean Optimization/service-worker.js
- [ ] Clean Optimization/manifest.json
- [ ] Remove mobile media queries from desktop CSS
- [ ] Update project viewer navigation links
- [ ] Final grep search verification

### Testing:
- [ ] Test desktop Home page
- [ ] Test desktop About page
- [ ] Test desktop Projects page
- [ ] Test desktop Content Studio
- [ ] Test desktop Contact page
- [ ] Test all project viewers
- [ ] Verify no broken links
- [ ] Check browser console for errors

---

**Status:** Ready for deletion  
**Estimated Time:** 1-2 hours (careful work)  
**Next Step After Deletion:** Begin mobile redesign from MOBILE-REDESIGN-GUIDE.md

---

*Mark this file as you progress. Keep for reference during the mobile rebuild.*
