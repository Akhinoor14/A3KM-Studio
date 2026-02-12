# 🗺️ GitHub API Usage Map - Only Boss Dashboard

## 📍 GitHub API কোথায় কোথায় লাগে?

---

## ⚠️ CRITICAL ISSUE: Multiple Token Keys!

### 🔑 Token Key Confusion:
**5টি Different Token Keys ব্যবহার হচ্ছে:**
1. `github_token` - Content Studio, Certificate, API Config
2. `github_pat` - Project Managers (Arduino, MATLAB, SolidWorks)
3. `a3km_github_token` - GitHubTokenManager (Settings managers)
4. `a3km_github_token_v2` - Content Editing System
5. `dashboard_github_token` - Project Creator

### 💥 Problem:
- User কে 5 বার token set করতে হবে!
- Token sync হবে না
- Massive confusion
- Poor UX

### ✅ Solution Needed:
**All systems should use:** `github_token` (localStorage)

---

## 1️⃣ Content Studio Managers (5টি)

### 📝 Posts Manager
**File:** `managers/Content-studio/posts-manager.html`
**Uses:** `GitHubContentUploader`
**Token Key:** `github_token` (localStorage)

**কাজ:**
- ✅ Post content upload করা
- ✅ Images/cover upload করা  
- ✅ JSON file update করা
- ✅ Delete content from GitHub

**API Endpoints Used:**
```
POST /repos/Akhinoor14/A3KM-Studio/contents/Content Studio/written-posts/posts.json
PUT  /repos/Akhinoor14/A3KM-Studio/contents/Content Studio/written-posts/{post-slug}/...
DELETE /repos/Akhinoor14/A3KM-Studio/contents/...
```

---

### 📚 Books Manager
**File:** `managers/Content-studio/books-manager-new.html`
**Uses:** `GitHubContentUploader`
**Token Key:** `github_token` (localStorage)

**কাজ:**
- ✅ Book PDFs upload করা
- ✅ Cover images upload করা
- ✅ Thumbnail generate & upload করা
- ✅ JSON file update করা

**API Endpoints Used:**
```
POST /repos/Akhinoor14/A3KM-Studio/contents/Content Studio/books-pdfs/books.json
PUT  /repos/Akhinoor14/A3KM-Studio/contents/Content Studio/books-pdfs/...
```

---

### 📄 Papers Manager
**File:** `managers/Content-studio/papers-manager.html`
**Uses:** `GitHubContentUploader`
**Token Key:** `github_token` (localStorage)

**কাজ:**
- ✅ Research papers upload করা
- ✅ PDF files upload করা
- ✅ JSON file update করা
- ✅ Category management

**API Endpoints Used:**
```
POST /repos/Akhinoor14/A3KM-Studio/contents/Content Studio/research-papers/papers.json
PUT  /repos/Akhinoor14/A3KM-Studio/contents/Content Studio/research-papers/...
```

---

### 🎓 Educational Videos Manager
**File:** `managers/Content-studio/educational-videos-manager.html`
**Uses:** `GitHubContentUploader`
**Token Key:** `github_token` (localStorage)

**কাজ:**
- ✅ Course metadata upload করা
- ✅ Video links store করা
- ✅ Cover images upload করা
- ✅ JSON file update করা
- ✅ YouTube API থেকে video details fetch করা

**API Endpoints Used:**
```
POST /repos/Akhinoor14/A3KM-Studio/contents/Content Studio/educational-videos/courses.json
PUT  /repos/Akhinoor14/A3KM-Studio/contents/Content Studio/educational-videos/...
GET  https://www.googleapis.com/youtube/v3/videos (YouTube API - optional)
```

---

### 📹 Vlogs Manager
**File:** `managers/Content-studio/vlogs-manager.html`
**Uses:** `GitHubContentUploader`
**Token Key:** `github_token` (localStorage)

**কাজ:**
- ✅ Video blog entries upload করা
- ✅ Thumbnails upload করা
- ✅ JSON file update করা
- ✅ Category management

**API Endpoints Used:**
```
POST /repos/Akhinoor14/A3KM-Studio/contents/Content Studio/video-content/videos.json
PUT  /repos/Akhinoor14/A3KM-Studio/contents/Content Studio/video-content/...
```

---

## 2️⃣ Project Managers (3টি)

### 🔌 Arduino Manager
**Location:** `managers/projects/arduino/`
**Uses:** `github-api-handler.js`
**Token Key:** `github_pat` (localStorage) ⚠️ **DIFFERENT KEY!**

**কাজ:**
- ✅ Arduino project files upload করা
- ✅ Code files (.ino) upload করা
- ✅ Circuit diagrams upload করা
- ✅ Project JSON update করা

---

### 📊 MATLAB Manager  
**Location:** `managers/projects/matlab/`
**Uses:** `github-api-handler.js`
**Token Key:** `github_pat` (localStorage) ⚠️ **DIFFERENT KEY!**

**কাজ:**
- ✅ MATLAB scripts upload করা
- ✅ .m files upload করা
- ✅ Results/plots upload করা
- ✅ Project JSON update করা

---

### 🔧 SolidWorks Manager
**Location:** `managers/projects/solidworks/solidworks-manager.html`
**Uses:** Possibly `github-api-handler.js`
**Token Key:** `github_pat` (localStorage) ⚠️ **DIFFERENT KEY!**

**কাজ:**
- ✅ CAD files upload করা (.sldprt, .sldasm)
- ✅ GLB 3D models upload করা
- ✅ Thumbnails upload করা
- ✅ Project JSON update করা

---

## 3️⃣ Shared Systems

### 🔗 System Integration Hub
**File:** `managers/shared/system-integration-hub.html`
**Uses:** Direct GitHub API calls
**Token Key:** `github_token` (localStorage)

**কাজ:**
- ✅ Cross-system data sync করা
- ✅ Content validation করা
- ✅ Backup/restore operations
- ✅ System health checks

---

### ⚙️ API Config Manager
**File:** `managers/shared/api-config-manager.html`
**Token Key:** `github_token` (localStorage)

**কাজ:**
- ✅ GitHub token save করা
- ✅ Token validity test করা
- ✅ Connection testing
- ✅ Token management

**API Endpoints Used:**
```
GET /user (token validation)
```

---

### 🔐 GitHub Token Manager
**File:** `managers/shared/github-token-manager.js`

**কাজ:**
- ✅ Token validation
- ✅ Token storage management
- ✅ Security checks

---

## 4️⃣ Content Editing System

### ✏️ Content Editor
**Location:** `managers/content-editing/`
**File:** `github-sync.js`
**Token Key:** `a3km_github_token_v2` (localStorage) ⚠️ **DIFFERENT KEY!**
**Fallback Keys:** `github_token`, device-specific key

**কাজ:**
- ✅ Live content editing
- ✅ Real-time sync to GitHub
- ✅ Preview changes
- ✅ Commit changes
- ✅ Multi-device support

**API Endpoints Used:**
```
GET  /repos/Akhinoor14/A3KM-Studio/contents/{path}
PUT  /repos/Akhinoor14/A3KM-Studio/contents/{path}
POST /repos/Akhinoor14/A3KM-Studio/contents/{path}
```

---

## 5️⃣ Settings Managers (2 Systems)

### 🧭 Navigation Editor
**File:** `managers/settings/navigation-editor.html`
**Uses:** Direct GitHub API calls + GitHubTokenManager
**Token Key:** `a3km_github_token` (via GitHubTokenManager) ⚠️ **DIFFERENT KEY!**

**কাজ:**
- ✅ Navigation menu design করা
- ✅ Apply navbar to all pages
- ✅ Auto-inject HTML code
- ✅ Direct GitHub commits
- ✅ Bulk page updates

**API Endpoints Used:**
```
GET  /repos/Akhinoor14/A3KM-Studio/contents/{page.path}
PUT  /repos/Akhinoor14/A3KM-Studio/contents/{page.path}
```

---

### 🔍 SEO Manager
**File:** `managers/settings/seo-manager.html`
**Uses:** Direct GitHub API calls + GitHubTokenManager
**Token Key:** `a3km_github_token` (via GitHubTokenManager) ⚠️ **DIFFERENT KEY!**

**কাজ:**
- ✅ Meta tags inject করা
- ✅ SEO optimization
- ✅ Open Graph tags
- ✅ Schema markup
- ✅ Sitemap generation
- ✅ Auto-update all pages

**API Endpoints Used:**
```
GET  /repos/Akhinoor14/A3KM-Studio/contents/{page.path}
PUT  /repos/Akhinoor14/A3KM-Studio/contents/{page.path}
POST /repos/Akhinoor14/A3KM-Studio/git/blobs
POST /repos/Akhinoor14/A3KM-Studio/git/trees
POST /repos/Akhinoor14/A3KM-Studio/git/commits
```

---

## 6️⃣ Project Creator

### 🔧 Project Manager
**File:** `managers/projects/project-creator/project-manager.js`
**Token Key:** `dashboard_github_token` (localStorage) ⚠️ **DIFFERENT KEY!**

**কাজ:**
- ✅ New projects create করা
- ✅ Templates generate করা
- ✅ GitHub integration setup
- ✅ README generation

---

## 📊 Summary Table

| System | Files | Token Key | GitHub API Usage | Status |
|--------|-------|-----------|------------------|--------|
| **Content Studio** | 5 managers | `github_token` | ✅ High (upload/delete) | ✅ UNIFIED |
| **Certificate Manager** | 1 manager | `github_token` | ✅ High (upload/manage) | ✅ UNIFIED |
| **Project Managers** | 3 managers | `github_pat` | ✅ High (upload/manage) | ⚠️ NEEDS FIX |
| **Content Editing** | 1 system | `a3km_github_token_v2` | ✅ High (edit/commit) | ⚠️ NEEDS FIX |
| **Settings Managers** | 2 managers | `a3km_github_token` | ✅ High (inject/deploy) | ⚠️ NEEDS FIX |
| **Project Creator** | 1 system | `dashboard_github_token` | ✅ Medium (setup) | ⚠️ NEEDS FIX |
| **System Integration** | 1 hub | `github_token` | ✅ Medium (sync/validate) | ✅ UNIFIED |
| **API Config** | 1 manager | `github_token` | ✅ Low (test only) | ✅ UNIFIED |

---

## 🔑 Token Key Breakdown

### Current State (MESSY!):
```javascript
// Content Studio (5) + Certificate (1) + System Hub (1) + API Config (1)
localStorage.getItem('github_token')  // ✅ 8 systems

// Project Managers (3)
localStorage.getItem('github_pat')  // ⚠️ 3 systems

// Settings Managers (2) - Navigation + SEO
localStorage.getItem('a3km_github_token')  // ⚠️ 2 systems (via GitHubTokenManager)

// Content Editing (1)
localStorage.getItem('a3km_github_token_v2')  // ⚠️ 1 system (with fallback to github_token)

// Project Creator (1)
localStorage.getItem('dashboard_github_token')  // ⚠️ 1 system
```

### Proposed Unified State:
```javascript
// ALL SYSTEMS should use:
localStorage.getItem('github_token')  // ✅ 16 systems
```

---

## 🎓 Certificate Manager

### 📝 Certificate Manager
**File:** `managers/certificates/certificates-manager.html`
**JavaScript:** `managers/certificates/certificates-manager.js`
**Uses:** `GitHubContentUploader` (from Content-studio)
**Token Key:** `github_token` (localStorage) - ✅ NOW UNIFIED!

**কাজ:**
- ✅ Certificate files upload করা (PDF, JPG, PNG)
- ✅ Multiple file upload support
- ✅ Metadata management (title, issuer, date, tags)
- ✅ Category & subcategory organization
- ✅ JSON database update (`About me/certificates-data.json`)
- ✅ Verification & featured status
- ✅ Bulk operations

**API Endpoints Used:**
```
GET  /repos/Akhinoor14/A3KM-Studio/contents/About me/certificates-data.json
PUT  /repos/Akhinoor14/A3KM-Studio/contents/About me/CERTIFICATES/{category}/{subcategory}/{file}
POST /repos/Akhinoor14/A3KM-Studio/contents/About me/certificates-data.json
```

**Categories:**
- 📚 Academic (PSC, JSC, SSC, HSC, BSc, MSc, PhD)
- 💼 Skill (Programming, Design, AI Tools, Languages)
- 🏥 Medical (Vaccination, Reports, Legal)

**Features:**
- ✅ Drag & drop file upload
- ✅ Duplicate detection
- ✅ Progress tracking
- ✅ Auto-load token from localStorage
- ✅ Redirect to API Config if no token
- ✅ Manual token override option
- ✅ Statistics & analytics
- ✅ JSON editor

---

## 📊 Summary Table

## ⚠️ Token Key Confusion Issue!

### Problem:
দুইটা different token key use হচ্ছে:
1. **`github_token`** - Content Studio & Shared systems
2. **`github_pat`** - Project Managers (Arduino, MATLAB, SolidWorks)

### Impact:
- User কে দুইবার token set করতে হবে
- Confusion তৈরি হবে
- Token sync হবে না

### Solution Needed:
সব জায়গায় **`github_token`** use করা উচিত একটা unified system এর জন্য।

---

## 🔧 Files That Need Token:

### Core Files:
```
✅ managers/Content-studio/posts-manager.html (github_token)
✅ managers/Content-studio/books-manager-new.html (github_token)
✅ managers/Content-studio/papers-manager.html (github_token)
✅ managers/Content-studio/educational-videos-manager.html (github_token)
✅ managers/Content-studio/vlogs-manager.html (github_token)
✅ managers/certificates/certificates-manager.html (github_token)
⚠️ managers/projects/arduino/*.html (github_pat - NEEDS FIX)
⚠️ managers/projects/matlab/*.html (github_pat - NEEDS FIX)
⚠️ managers/projects/solidworks/solidworks-manager.html (github_pat - NEEDS FIX)
⚠️ managers/settings/navigation-editor.html (a3km_github_token - NEEDS FIX)
⚠️ managers/settings/seo-manager.html (a3km_github_token - NEEDS FIX)
⚠️ managers/content-editing/content-editor.html (a3km_github_token_v2 - NEEDS FIX)
⚠️ managers/projects/project-creator/* (dashboard_github_token - NEEDS FIX)
✅ managers/shared/system-integration-hub.html (github_token)
✅ managers/shared/api-config-manager.html (github_token)
```

### Supporting JavaScript Files:
```
✅ managers/Content-studio/github-content-uploader.js (github_token)
✅ managers/certificates/certificates-manager.js (github_token via GitHubContentUploader)
⚠️ managers/projects/github-api-handler.js (github_pat - NEEDS FIX)
⚠️ managers/content-editing/github-sync.js (a3km_github_token_v2 - NEEDS FIX)
⚠️ managers/shared/github-token-manager.js (a3km_github_token - NEEDS FIX)
⚠️ managers/projects/project-creator/project-manager.js (dashboard_github_token - NEEDS FIX)
✅ managers/shared/api-config-check.js (github_token)
```

---

## 🛠️ Files That Need Token Unification:

### Priority 1 - High Impact (Settings Managers):
1. **GitHubTokenManager** (`shared/github-token-manager.js`)
   - Change: `a3km_github_token` → `github_token`
   - Impact: Navigation Editor + SEO Manager
   - Used by: 2 managers

2. **Navigation Editor** (`settings/navigation-editor.html`)
   - Uses GitHubTokenManager
   - Will auto-fix when GitHubTokenManager is fixed

3. **SEO Manager** (`settings/seo-manager.html`)
   - Uses GitHubTokenManager
   - Will auto-fix when GitHubTokenManager is fixed

### Priority 2 - Medium Impact (Project Systems):
4. **GitHub API Handler** (`projects/github-api-handler.js`)
   - Change: `github_pat` → `github_token`
   - Impact: Arduino, MATLAB, SolidWorks managers
   - Used by: 3 managers

5. **Project Manager** (`projects/project-creator/project-manager.js`)
   - Change: `dashboard_github_token` → `github_token`
   - Impact: Project creator system
   - Used by: 1 system

### Priority 3 - Low Impact (Content Editing):
6. **GitHub Sync** (`content-editing/github-sync.js`)
   - Change: `a3km_github_token_v2` → `github_token`
   - Note: Already has fallback to `github_token`
   - Impact: Content editor
   - Used by: 1 system

---

## 🎯 Required Permissions:

GitHub Personal Access Token needs:
```
✅ repo (full control of private repositories)
   ├─ repo:status (commit status)
   ├─ repo_deployment (deployment status)
   ├─ public_repo (public repositories)
   └─ repo:invite (invitations)

✅ workflow (update GitHub Action workflows)

✅ write:packages (upload packages)
✅ read:packages (download packages)

Optional:
⚪ admin:repo_hook (if webhooks needed)
```

---

## 📝 API Usage Statistics:

### High Usage (need token):
- Content uploads (daily)
- File management (frequent)
- JSON updates (very frequent)
- Sync operations (continuous)

### Low Usage (need token):
- Token validation (once per session)
- Connection testing (manual)
- System health checks (periodic)

### No GitHub API (don't need token):
- Dashboard viewing
- Statistics display
- Category filtering
- Search functionality
- UI interactions

---

## 🔒 Security Notes:

1. **Token Storage:** localStorage only (browser-based)
2. **Token Exposure:** Never in source code
3. **Token Transmission:** Only to api.github.com
4. **Token Expiration:** User must regenerate when expired
5. **Token Scope:** Minimal required permissions

---

## 🧪 Testing Without Token:

এই features token ছাড়াই কাজ করবে:
- ✅ Dashboard view
- ✅ Content list view
- ✅ Statistics display
- ✅ Search/filter
- ✅ JSON viewer (read-only)

এই features token লাগবে:
- ❌ Upload new content
- ❌ Delete content
- ❌ Update existing content
- ❌ Sync to GitHub
- ❌ File management

---

## 📊 Complete System Count:

**Total Systems Using GitHub API:** 16 systems
- ✅ **8 Unified** (using `github_token`)
  - Content Studio: 5 managers
  - Certificate Manager: 1
  - System Integration Hub: 1
  - API Config Manager: 1

- ⚠️ **8 Need Unification**
  - Project Managers: 3 (use `github_pat`)
  - Settings Managers: 2 (use `a3km_github_token`)
  - Content Editing: 1 (use `a3km_github_token_v2`)
  - Project Creator: 1 (use `dashboard_github_token`)

**Total Token Keys in Use:** 5 (should be 1!)
**Unification Progress:** 50% (8/16 systems unified)
**API Calls Per Day:** 100-1000+ (depending on usage)

---

## 🎯 Action Plan to Unify All Tokens:

### Step 1: Update GitHubTokenManager
```javascript
// File: managers/shared/github-token-manager.js
// Line 22: Change storage key
this.STORAGE_KEY = 'github_token';  // was: 'a3km_github_token'
```

### Step 2: Update GitHub API Handler
```javascript
// File: managers/projects/github-api-handler.js
// Line 23: Change storage key
localStorage.setItem('github_token', token);  // was: 'github_pat'

// Line 31: Change retrieval
this.token = localStorage.getItem('github_token');  // was: 'github_pat'

// Line 40: Change removal
localStorage.removeItem('github_token');  // was: 'github_pat'
```

### Step 3: Update GitHub Sync Manager
```javascript
// File: managers/content-editing/github-sync.js
// Line 11: Change primary storage key
this.tokenStorageKey = 'github_token';  // was: 'a3km_github_token_v2'

// Remove redundant saves on line 30-31
// Keep only: localStorage.setItem('github_token', token);
```

### Step 4: Update Project Manager
```javascript
// File: managers/projects/project-creator/project-manager.js
// Line 36: Change retrieval
const token = localStorage.getItem('github_token') || '';  // was: 'dashboard_github_token'
```

### Step 5: Test All Systems
1. Clear all existing tokens
2. Set token via API Config Manager
3. Test each of 16 systems
4. Verify token auto-loads

---
