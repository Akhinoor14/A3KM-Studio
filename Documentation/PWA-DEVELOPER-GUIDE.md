# Developer Guide: PWA Version Management

## Overview
This guide explains how to manage versions, trigger updates, and maintain the A3KM Studio PWA system.

---

## **Quick Start: Bumping Version When Adding Content**

### Scenario: You Added a New Arduino Project

```bash
# 1. Add your content (e.g., new Arduino project folder)
# Projects Storage/Arduino UNO Projects/24. Servo Motor Controller/

# 2. Run the version bump script
cd scripts
node bump-version.js patch

# 3. Follow the interactive prompts:
#    Bump type? patch
#    What changed? Added Arduino Servo Motor Controller project
#    Release notes? New servo motor project with PWM control
#    Proceed? y

# 4. Commit and push
git add version.json Optimization/offline-content-manager.js
git commit -m "Release v3.2.0: Added Arduino Servo project"
git push

# 5. Users automatically get update notifications! 🎉
```

---

## **Version Numbering System**

We use **Semantic Versioning** with enhanced format:

```
v[MAJOR].[MINOR].[PATCH]-[DATE]-enhanced

Example: v3.2.1-2026-02-15-enhanced
```

### When to Bump Each Number

**MAJOR** (`v3.0.0` → `v4.0.0`)
- Breaking changes to PWA structure
- Major UI/UX redesign
- Significant feature additions
- Incompatible with previous app cache

**Example:**
```bash
node bump-version.js major
# What changed? Complete PWA redesign with new caching system
```

**MINOR** (`v3.1.0` → `v3.2.0`)
- New content categories added
- New features (non-breaking)
- Significant content additions (10+ projects)
- New pages or sections

**Example:**
```bash
node bump-version.js minor
# What changed? Added Electronics Projects category, 15 new projects
```

**PATCH** (`v3.1.1` → `v3.1.2`)
- Single project additions
- Bug fixes
- Small content updates
- Documentation updates
- Performance improvements

**Example:**
```bash
node bump-version.js patch
# What changed? Fixed broken links, added 2 Arduino projects
```

---

## **Version Bump Script Usage**

### Basic Usage
```bash
cd scripts
node bump-version.js [major|minor|patch]
```

### Interactive Mode
```bash
node bump-version.js

# Prompts:
# 1. Bump type? (major/minor/patch) [patch]:
#    > patch
#
# 2. What changed? (comma separated):
#    > Added Arduino project, Fixed documentation
#
# 3. Release notes (optional):
#    > Version 3.2.0 with new Arduino servo motor project
#
# 4. Summary:
#    Version: 3.1.0 → 3.2.0
#    Full version: v3.2.0-2026-02-16-enhanced
#    Changes:
#      - Added Arduino project
#      - Fixed documentation
#
# 5. Proceed with version bump? (y/n) [y]:
#    > y
#
# ✅ version.json updated
# ✅ offline-content-manager.js updated
```

### What the Script Does

1. **Reads Current Version** from `version.json`
2. **Increments Version Number** based on bump type
3. **Generates Full Version String** with date
4. **Updates version.json:**
   - `version` field
   - `releaseDate` field
   - `changelog` array
   - `releaseNotes` field
5. **Updates offline-content-manager.js:**
   - `CONTENT_VERSION` constant
6. **Shows Git Commands** for committing changes

### Script Output Example
```
🚀 A3KM Studio - Version Bump Helper

Current version: v3.1.0

New version will be: v3.2.0-2026-02-16-enhanced

📋 Summary:
  Version: 3.1.0 → 3.2.0
  Full version: v3.2.0-2026-02-16-enhanced
  Changes:
    - Added Arduino Servo Motor project
    - Fixed documentation links

📝 Updating version.json...
✅ version.json updated

📝 Updating offline-content-manager.js...
✅ offline-content-manager.js updated

✨ Version bump complete!

📦 Next steps:
  1. Review changes:
     git diff
  2. Commit:
     git add version.json Optimization/offline-content-manager.js
     git commit -m "Release v3.2.0-2026-02-16-enhanced"
  3. Push:
     git push

🎉 Users will receive update notification automatically!
```

---

## **Manual Version Management**

### If Script Not Available

**1. Update version.json**
```json
{
  "version": "v3.2.0-2026-02-16-enhanced",
  "releaseDate": "2026-02-16T10:30:00Z",
  "minAppVersion": "v3.0.0",
  "changelog": [
    "Added new Arduino Servo Motor project",
    "Fixed documentation links",
    "Improved offline caching"
  ],
  "releaseNotes": "Version 3.2.0 includes new Arduino projects and performance improvements.",
  "contentCategories": {
    "arduino": {
      "count": 24,
      "size": "~19MB"
    },
    "matlab": {
      "count": 15,
      "size": "~12MB"
    },
    "solidworks": {
      "count": 10,
      "size": "~20MB"
    },
    "documentation": {
      "count": 50,
      "size": "~10MB"
    },
    "certificates": {
      "count": 25,
      "size": "~8MB"
    },
    "books": {
      "count": 10,
      "size": "~6MB"
    },
    "writtenPosts": {
      "count": 30,
      "size": "~5MB"
    },
    "researchPapers": {
      "count": 12,
      "size": "~5MB"
    }
  },
  "totalSize": "~85MB",
  "features": [
    "Complete offline access to all content",
    "Automatic background updates",
    "Progressive content caching",
    "Cross-device synchronization"
  ]
}
```

**2. Update offline-content-manager.js**
```javascript
// Find this line (around line 10):
this.CONTENT_VERSION = 'v3.1.0-2026-02-15-enhanced';

// Change to:
this.CONTENT_VERSION = 'v3.2.0-2026-02-16-enhanced';
```

**3. Commit Changes**
```bash
git add version.json Optimization/offline-content-manager.js
git commit -m "Release v3.2.0-2026-02-16-enhanced"
git push
```

---

## **Adding New Content to Manifest**

When adding new content types, update the offline-content-manager.js manifest:

### Example: Adding New Content Type "VideoTutorials"

**1. Add Files to Project**
```
Content Studio/
  video-tutorials/
    01. Introduction to Arduino/
      video.mp4
      thumbnail.jpg
      description.md
```

**2. Update OFFLINE_CONTENT Array**

Open `Optimization/offline-content-manager.js`:

```javascript
const OFFLINE_CONTENT = [
  // ... existing Arduino projects ...
  
  // NEW: Video Tutorials
  '/Content Studio/video-tutorials/01. Introduction to Arduino/video.mp4',
  '/Content Studio/video-tutorials/01. Introduction to Arduino/thumbnail.jpg',
  '/Content Studio/video-tutorials/01. Introduction to Arduino/description.md',
  // Add more video tutorials...
];
```

**3. Update version.json**
```json
{
  "contentCategories": {
    // ... existing categories ...
    "videoTutorials": {
      "count": 5,
      "size": "~50MB"
    }
  },
  "totalSize": "~135MB"  // Updated total
}
```

**4. Bump Version**
```bash
node bump-version.js minor
# What changed? Added Video Tutorials category with 5 tutorials
```

---

## **Update Detection Flow**

### How It Works

```
Developer commits version.json update
           ↓
       Git pushes to server
           ↓
   Server now has v3.2.0
           ↓
User opens PWA/website (has v3.1.0)
           ↓
Update Notifier runs check (every 6 hours)
           ↓
  Fetches /version.json from server
           ↓
Compares: v3.1.0 (local) vs v3.2.0 (server)
           ↓
Version mismatch detected!
           ↓
     Shows appropriate notification:
     - PWA users: Notification card
     - Website visitors: Top banner
           ↓
User clicks "Update Now" / "Install App"
           ↓
Offline Manager re-downloads content
           ↓
Beautiful completion popup appears
           ↓
  localStorage updated to v3.2.0
           ↓
User now has latest content offline!
```

### Triggering Manual Check (For Testing)

```javascript
// In browser console:
window.dispatchEvent(new Event('online'));
// Update notifier will immediately check version.json
```

---

## **Monitoring User Updates**

### Check Update Notification Delivery

Add analytics tracking to `update-notifier.js`:

```javascript
// In showPWAUpdateNotification() or showWebsiteUpdateBanner()
if (window.gtag) {
  gtag('event', 'update_notification_shown', {
    'version': latestVersionData.version,
    'user_type': isPWA ? 'pwa_user' : 'website_visitor'
  });
}
```

### Track Update Acceptance

```javascript
// When user clicks "Update Now"
if (window.gtag) {
  gtag('event', 'update_accepted', {
    'old_version': this.currentVersion,
    'new_version': latestVersionData.version
  });
}
```

---

## **Best Practices**

### DO ✅

1. **Bump version EVERY time you add content**
   - This ensures users get automatic notifications

2. **Write clear changelog entries**
   - Users see these in update notifications
   - Be specific: "Added 3 Arduino projects" not "Updates"

3. **Test locally before pushing**
   ```bash
   # Update version.json locally
   # Open PWA
   # Trigger update check
   # Verify notification appears
   # Verify content downloads
   # Then push to production
   ```

4. **Update content category counts**
   - Keep version.json `contentCategories` accurate
   - Users see sizes in install prompt

5. **Use semantic versioning correctly**
   - Major: Breaking changes
   - Minor: New features/categories
   - Patch: Small updates

### DON'T ❌

1. **Don't forget to bump version**
   - Users won't know new content is available
   - No automatic update notifications

2. **Don't skip changelog**
   - Empty changelog = poor user experience
   - Users want to know what's new

3. **Don't bump version for non-user-facing changes**
   - Internal refactoring → No version bump
   - Only bump when content/features change

4. **Don't use same version number**
   - Version must increase for detection to work
   - v3.1.0 → v3.1.0 = no notification

5. **Don't forget to update totalSize**
   - Inaccurate size = user confusion
   - Affects iOS users (50MB limit)

---

## **Rollback Strategy**

### If Something Goes Wrong

**1. Revert version.json**
```bash
git revert <commit-hash>
git push
```

**2. Users Download Previous Version**
- Update notifier sees "newer" version (actually previous)
- Users get stable content back

**3. Fix Issues Locally**
- Test thoroughly
- Bump to new version (e.g., v3.2.1)
- Push when ready

### Emergency Hotfix

```bash
# Fix critical bug
# Bump patch version
node bump-version.js patch
# Changelog: "Critical bug fix for offline caching"

# Commit and push immediately
git add .
git commit -m "HOTFIX v3.2.1: Critical bug fix"
git push

# Users get notification within 6 hours
# Or force immediate check via server push notification
```

---

## **Advanced: Forcing Immediate Updates**

### Using Push Notifications (Future Enhancement)

```javascript
// Server-side (when critical update required)
sendPushNotification({
  title: "Critical Update Available",
  body: "Please update to v3.2.1 immediately",
  data: {
    type: "force_update",
    version: "v3.2.1-2026-02-16-enhanced"
  }
});

// Client-side (service-worker.js)
self.addEventListener('push', (event) => {
  const data = event.data.json();
  if (data.type === 'force_update') {
    // Trigger immediate update check
    clients.matchAll().then(clients => {
      clients.forEach(client => {
        client.postMessage({ type: 'FORCE_UPDATE', version: data.version });
      });
    });
  }
});
```

---

## **Debugging Version Issues**

### User Reports "No Update Notification"

**Check 1: Version Comparison**
```javascript
// In browser console
console.log('Current:', localStorage.getItem('a3km-cached-version'));
console.log('Server:', await fetch('/version.json').then(r => r.json()));
```

**Check 2: Update Check Timing**
```javascript
// Last update check timestamp
console.log('Last check:', localStorage.getItem('a3km-last-update-check'));
// Should be within 6 hours of current time
```

**Check 3: Network Connectivity**
```javascript
console.log('Online:', navigator.onLine);
// Update checks only run when online
```

### User Reports "Update Failed"

**Check 1: Service Worker Status**
```javascript
navigator.serviceWorker.getRegistration().then(reg => {
  console.log('SW:', reg ? 'Active' : 'Not registered');
});
```

**Check 2: Cache Storage**
```javascript
caches.keys().then(keys => {
  console.log('Caches:', keys);
  // Should see offline-* cache
});
```

**Check 3: Console Errors**
```
Open DevTools → Console
Look for errors from:
- [Offline Manager]
- [Update Notifier]
- [Service Worker]
```

---

## **Content Size Management**

### Keeping Sizes Updated

```bash
# Check actual content size
du -sh "Projects Storage/Arduino/"
# Output: 18M

# Update version.json
"arduino": {
  "count": 24,
  "size": "~18MB"  # Match actual size
}
```

### Size Calculation Script (Optional)

Create `scripts/calculate-sizes.js`:

```javascript
const fs = require('fs');
const path = require('path');

function getDirectorySize(dir) {
  let size = 0;
  const files = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const file of files) {
    const filePath = path.join(dir, file.name);
    if (file.isDirectory()) {
      size += getDirectorySize(filePath);
    } else {
      size += fs.statSync(filePath).size;
    }
  }
  
  return size;
}

function formatSize(bytes) {
  return `~${Math.round(bytes / 1024 / 1024)}MB`;
}

// Calculate sizes
const categories = {
  arduino: 'Projects Storage/Arduino',
  matlab: 'Projects Storage/MATLAB',
  solidworks: 'Projects Storage/SolidWorks',
  // ... add more
};

console.log('Content Sizes:');
let total = 0;

for (const [key, dir] of Object.entries(categories)) {
  if (fs.existsSync(dir)) {
    const size = getDirectorySize(dir);
    total += size;
    console.log(`${key}: ${formatSize(size)}`);
  }
}

console.log(`Total: ${formatSize(total)}`);
```

Run: `node scripts/calculate-sizes.js`

---

## **Integration with CI/CD**

### Automated Version Checks

```yaml
# .github/workflows/version-check.yml
name: Version Check

on: [push]

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Validate version.json
        run: |
          node -e "const v = require('./version.json'); console.log('Version:', v.version);"
      
      - name: Check version increment
        run: |
          # Compare with previous commit
          # Ensure version increased
          # Fail if same version
```

### Automatic Deployment

```yaml
# Only deploy if version.json changed
on:
  push:
    paths:
      - 'version.json'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to production
        run: npm run deploy
      
      - name: Send notification
        run: |
          # Notify team of new version deployed
          # Optionally trigger push notification to users
```

---

## **FAQs**

**Q: How often should I bump the version?**  
A: Every time you add user-facing content or features. Small fixes can be batched.

**Q: Do I need to update service worker version too?**  
A: No, version.json is the source of truth. SW version only changes for SW code updates.

**Q: What if I forget to bump the version?**  
A: Users won't get update notifications. Bump it retroactively and push.

**Q: Can I use the script on Windows?**  
A: Yes, Node.js scripts work on all platforms. Use PowerShell or CMD.

**Q: How do I test updates without affecting users?**  
A: Use a staging environment, or test locally by modifying version.json before committing.

**Q: What if version check fails (network error)?**  
A: Update notifier retries on next online event or after 6 hours.

**Q: How do I force all users to update?**  
A: Increase `minAppVersion` in version.json. App can check and force update if below minimum.

---

## **Summary Checklist**

When adding new content, always:

```
[ ] Add content files to project
[ ] Update OFFLINE_CONTENT manifest (if needed)
[ ] Run: node scripts/bump-version.js [type]
[ ] Fill out changelog and release notes
[ ] Review git diff
[ ] Commit: version.json + offline-content-manager.js
[ ] Push to production
[ ] Verify update notification appears (test user)
[ ] Monitor update acceptance rate
```

---

**Guide Version:** 1.0  
**Last Updated:** February 15, 2026  
**Maintainer:** A3KM Studio Development Team
