# 🧹 File Organization Plan for A3KM Studio

## Current Status
Root directory has 100+ scattered files. Need to organize properly.

## Recommended Actions:

### ✅ KEEP AS IS (Already Good):
```
Home/
About me/
Projects/
Blog/
Contact/
Only boss/
CV/
images/
icons/
shared/
CERTIFICATES/
```

### 📦 MOVE TO "Optimization /" folder:
Move these files from root to Optimization/:
- styles.css
- script.js  
- mobile-*.css (all mobile CSS files)
- github-*.js (all github JS files)
- auto-refresh.js
- realtime-github-sync.js
- CV_VIEWER_FIX.js
- pwa-install.js
- service-worker.js
- manifest.json

### 📦 CREATE "archived/" folder:
Move these to archived/ (old/test files):
- test-*.html (all test files)
- verify-*.html
- deployment-helper.html
- navigation-test.html
- token-test.html

### 📦 CREATE "docs/" folder:
Move these to docs/ (documentation):
- *.md files (all markdown documentation)
- README.md (keep copy in root too)

### 📦 MOVE specific pages to folders:

**To Blog/:**
- blog.html, blog.js, blog.css → Already there or move
- blog-manager.html
- rss.xml

**To Projects/:**
- projects.html, projects-mobile.html → Check if already there
- arduino-projects.html
- solidworks-*.html

**To Contact/:**
- contact.html, contact-mobile.html → Already there

**To About me/:**
- about.html, about-mobile.html → Already there
- certificates-*.html

### 🗑️ DELETE (Duplicates/Unnecessary):
- home.html (if duplicate)
- Any .html.bak files
- Old test files after archiving

## PowerShell Commands to Execute:

```powershell
# Create folders
New-Item -ItemType Directory -Path "archived", "docs" -Force

# Move documentation
Move-Item -Path "*.md" -Destination "docs/" -Exclude "README.md"

# Move test files
Move-Item -Path "test-*.html", "verify-*.html" -Destination "archived/"

# Move mobile CSS to Optimization
Move-Item -Path "mobile-*.css" -Destination "Optimization /"

# Move GitHub scripts to Optimization
Move-Item -Path "github-*.js", "auto-refresh.js", "realtime-github-sync.js" -Destination "Optimization /"
```

## Final Structure:
```
A3KM-Studio/
├── index.html (✅ Created - redirect to Home/)
├── README.md
│
├── Home/
├── About me/
├── Projects/
├── Blog/
├── Contact/
├── Only boss/
│
├── Optimization /      (Shared assets)
├── images/
├── icons/
├── shared/
├── CV/
│
├── archived/           (Old/test files)
└── docs/              (Documentation)
```

This is the PROFESSIONAL structure!
