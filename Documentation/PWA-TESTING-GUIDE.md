# PWA System - Complete Testing Guide

## Overview
This guide provides step-by-step instructions to test the complete PWA system including install prompts, automatic updates, offline functionality, and runtime caching.

---

## **Test 1: Install Prompt Flow (New Visitor)**

### Prerequisites
- Clear browser cache and site data
- Use Chrome/Edge (best PWA support)
- Not currently installed

### Steps
1. **Open Website**
   - Navigate to: `https://your-domain.com/Home/index.html`
   - Wait for page to load completely

2. **Verify Install Prompt Appears**
   - ⏱️ Wait 3 seconds after page load
   - ✅ Beautiful center modal should appear
   - ✅ Modal shows:
     - "Install A3KM Studio App"
     - Features list with checkmarks
     - "Install App Now" button (dark red)
     - "Maybe Later" button

3. **Test Dismiss Functionality**
   - Click "Maybe Later"
   - ✅ Modal should fade out
   - Reload page, wait 3 seconds
   - ✅ Modal should appear again
   - Dismiss 2 more times (total: 3 dismisses)
   - Reload page
   - ✅ Modal should NOT appear (3-strike limit hit)

4. **Reset and Install**
   - Clear localStorage: `localStorage.clear()`
   - Reload page, wait 3 seconds
   - Click "Install App Now"
   - ✅ Browser's native install prompt appears
   - Click "Install" in native prompt

5. **Verify Installation**
   - ✅ Success toast appears: "App installed successfully!"
   - ✅ PWA opens in standalone window (no browser UI)
   - ✅ Console shows: `[Offline Manager] Starting automatic download...`
   - Wait 30-60 seconds (depending on content size)

6. **Verify Download Completion**
   - ✅ Beautiful completion popup appears:
     ```
     🎉 All Set for Offline!
     120 files cached • 100% Offline Ready
     • Arduino, MATLAB & SolidWorks Projects
     • Documentation, Certificates & Papers
     • Books, Posts & Educational Content
     [Got It!]
     ```
   - Click "Got It!"
   - ✅ Popup fades out

7. **Verify Offline Access**
   - **DevTools Check:**
     - Open DevTools → Application → Cache Storage
     - ✅ Should see multiple caches:
       - `a3km-static-v3.1.0-enhanced-2026-02-15`
       - `a3km-runtime-v3.1.0-enhanced-2026-02-15`
       - `a3km-offline-v3.1.0-enhanced-2026-02-15`
       - `a3km-images-v3.1.0-enhanced-2026-02-15`
   
   - **Enable Airplane Mode / Disable Network:**
     - DevTools → Network → Offline checkbox
     - OR system-wide airplane mode
   
   - **Test Navigation:**
     - Go to Arduino Projects → ✅ Should load
     - Go to MATLAB Projects → ✅ Should load
     - Go to SolidWorks Projects → ✅ Should load
     - Go to Documentation → ✅ Should load
     - Open PDF document → ✅ Should load
     - Open markdown post → ✅ Should render
   
   - **Test Images:**
     - All project thumbnails → ✅ Should display
     - If image missing → ✅ SVG placeholder appears

---

## **Test 2: Update Detection (Existing PWA User)**

### Prerequisites
- PWA already installed
- Connected to internet

### Steps
1. **Check Current Version**
   - Open DevTools Console
   - Type: `localStorage.getItem('a3km-cached-version')`
   - ✅ Should show: `"v3.1.0-2026-02-15-enhanced"`

2. **Simulate Version Update**
   - **On Server:** Edit `version.json`:
     ```json
     {
       "version": "v3.2.0-2026-02-16-enhanced",
       "releaseDate": "2026-02-16T00:00:00Z",
       "changelog": ["Added new Arduino Servo Motor project", "Fixed documentation links"],
       "contentCategories": { ... }
     }
     ```
   - **Or Locally:** Modify `version.json` and reload

3. **Trigger Update Check**
   - **Automatic (Wait 6 hours):** Update notifier checks automatically
   - **Manual (For testing):**
     - Open DevTools Console
     - Type: `window.dispatchEvent(new Event('online'))`
     - Should trigger immediate check

4. **Verify Update Notification Appears**
   - ✅ Notification card appears (top-right corner)
   - ✅ Shows:
     ```
     🆕 Update Available
     v3.2.0
     • Added new Arduino Servo Motor project
     • Fixed documentation links
     [Update Now] [Later]
     ```
   - ✅ Dark red theme (#8B0000)
   - ✅ Smooth slide-in animation

5. **Test Update Process**
   - Click "Update Now"
   - ✅ Notification shows: "Updating content..."
   - ✅ Console shows: `[Offline Manager] Starting re-download...`
   - Wait 30-60 seconds
   - ✅ Completion popup appears with updated stats
   - ✅ Console shows: `[Offline Manager] Update complete`

6. **Verify New Version**
   - Check localStorage: `localStorage.getItem('a3km-cached-version')`
   - ✅ Should show: `"v3.2.0-2026-02-16-enhanced"`
   - Go offline and test new content
   - ✅ New project should be accessible offline

---

## **Test 3: Update Banner (Website Visitors - Not Installed)**

### Prerequisites
- PWA NOT installed
- Using regular browser (not standalone)

### Steps
1. **Open Website**
   - Navigate to any page
   - Ensure PWA is not installed

2. **Simulate Version Update**
   - Update `version.json` as in Test 2

3. **Trigger Update Check**
   - Wait 6 hours OR reload page
   - OR: `window.dispatchEvent(new Event('online'))`

4. **Verify Banner Appears**
   - ✅ Top sticky banner appears:
     ```
     🎉 New Content Available! Added new Arduino Servo Motor project • Install app
     [📱 Install App] [Dismiss]
     ```
   - ✅ Dark red theme
   - ✅ Full width, fixed at top

5. **Test Banner Actions**
   - Click "Install App"
   - ✅ Should show install prompt OR browser's install UI
   - Close and reload page
   - Click "Dismiss"
   - ✅ Banner should disappear for this session
   - Reload page
   - ✅ Banner should appear again (session-based dismiss)

---

## **Test 4: Runtime Caching (Automatic Page Caching)**

### Prerequisites
- PWA installed and offline content downloaded

### Steps
1. **Navigate to Uncached Pages**
   - Open DevTools → Network tab
   - Navigate to a random project page **not in the manifest**
   - Example: `/Projects Code/Arduino/arduino-projects.html`

2. **Verify Network Request**
   - ✅ Network tab shows request
   - ✅ Request successful (200 OK)

3. **Check Cache Storage**
   - DevTools → Application → Cache Storage
   - Open `a3km-runtime-*` cache
   - ✅ Page URL should be listed

4. **Test Offline Access**
   - Enable offline mode
   - Reload the same page
   - ✅ Page loads from cache
   - ✅ No network errors

5. **Test LRU Eviction**
   - Visit 100+ different pages (exceed MAX_HTML_CACHE = 100)
   - Check cache storage
   - ✅ Should contain ~100 pages (oldest removed)
   - ✅ Console may show: `[SW] Trimmed a3km-runtime-*: removed X items`

---

## **Test 5: Content-Type Specific Caching**

### HTML Pages (Network-First)
1. Navigate to `/Home/index.html`
2. ✅ Network request made (fresh content)
3. Go offline
4. Reload page
5. ✅ Cached version loads

### Images (Cache-First)
1. Navigate to page with images
2. ✅ Images load from cache (if previously seen)
3. New image: ✅ Network request, then cached
4. Go offline with uncached image URL
5. ✅ SVG placeholder appears: "Image Unavailable - You are offline"

### Documents (JSON/MD/PDF) (Network-First)
1. Open documentation markdown file
2. ✅ Network request made (fresh content)
3. Go offline
4. Open same markdown file
5. ✅ Cached version renders

### Assets (CSS/JS/Fonts) (Cache-First)
1. All CSS/JS/fonts load from cache
2. ✅ Instant loading (no network delay)
3. Go offline
4. ✅ All styles and scripts still work

---

## **Test 6: Cross-Page Integration**

### Desktop Pages
1. Visit each page:
   - `/Home/index.html` ✅
   - `/About me/about.html` ✅
   - `/Contact/contact.html` ✅
   - `/Projects Code/projects.html` ✅
   - `/Content Studio/hub.html` ✅
   - `/Documentation/index.html` ✅

2. For each page:
   - ✅ Install prompt appears after 3 seconds (if not installed)
   - ✅ Update notifier checks for updates
   - ✅ Offline manager available
   - ✅ Console shows: `[PWA Systems] All initialized`

### Mobile Pages
1. Visit each mobile page:
   - `/mobile/home/index.html` ✅
   - `/mobile/about/about.html` ✅
   - `/mobile/contact/contact.html` ✅
   - `/mobile/projects/projects.html` ✅
   - `/mobile/content-studio/hub.html` ✅

2. Verify same functionality as desktop

---

## **Test 7: iOS Safari Specific**

### Prerequisites
- iPhone or iPad
- Safari browser

### Steps
1. **Visit Website**
   - Navigate to home page
   - Wait 3 seconds

2. **Verify Install Prompt**
   - ✅ iOS-specific instructions appear:
     ```
     Install A3KM Studio
     1. Tap Share button (📤)
     2. Select "Add to Home Screen"
     3. Tap "Add"
     ```

3. **Follow Instructions**
   - Tap Share → Add to Home Screen → Add
   - ✅ App icon appears on home screen

4. **Test Offline Functionality**
   - Enable airplane mode
   - Open app from home screen
   - ✅ App loads and works offline
   - ✅ Content available (respects 50MB limit for iOS)

---

## **Test 8: Version Bump Workflow (Developer)**

### Prerequisites
- Node.js installed
- Terminal access

### Steps
1. **Add New Content**
   - Add new Arduino project to `/Projects Storage/Arduino/`
   - Example: `24. Servo Motor Controller/`

2. **Run Version Bump Script**
   ```bash
   cd scripts
   node bump-version.js patch
   ```

3. **Follow Prompts**
   - Bump type: `patch` (or `minor`/`major`)
   - What changed: `Added Arduino Servo Motor project`
   - Release notes: `Version 3.2.0 with new servo project`
   - Confirm: `y`

4. **Verify Files Updated**
   - ✅ `version.json` updated:
     - Version: `v3.2.0-2026-02-16-enhanced`
     - Changelog: `["Added Arduino Servo Motor project"]`
   - ✅ `Optimization/offline-content-manager.js` updated:
     - `CONTENT_VERSION = 'v3.2.0-2026-02-16-enhanced'`

5. **Commit and Push**
   ```bash
   git add version.json Optimization/offline-content-manager.js
   git commit -m "Release v3.2.0-2026-02-16-enhanced"
   git push
   ```

6. **Verify User Notification**
   - Users opening website/PWA will see update notification
   - PWA users: Notification card
   - Website visitors: Top banner

---

## **Test 9: Storage Management**

### Check Storage Usage
1. Open DevTools → Application → Storage
2. Check "Usage" section
3. ✅ Should show storage used by caches

### Verify LRU Eviction
1. Cache limits:
   - Desktop: 100 HTML, 200 runtime, 150 images
   - Mobile: 75 HTML, 150 runtime, 100 images
2. Exceed limits by visiting many pages
3. ✅ Oldest entries automatically removed
4. ✅ Console logs eviction: `[SW] Trimmed cache-name: removed X items`

---

## **Test 10: Error Handling**

### Offline Without Cache
1. Clear all caches
2. Enable offline mode
3. Navigate to page
4. ✅ Fallback to home page for HTML
5. ✅ SVG placeholder for images
6. ✅ No white screens or crashes

### Failed Downloads
1. Install PWA with slow/flaky connection
2. ✅ Offline manager retries failed downloads
3. ✅ Progress updates continue
4. ✅ Completion popup shows: `X files cached (Y failed)`

### Invalid version.json
1. Corrupt version.json on server
2. ✅ Update notifier catches error
3. ✅ Console shows: `[Update Notifier] Error checking updates`
4. ✅ App continues to work with cached content

---

## **Common Issues & Solutions**

### Install Prompt Doesn't Appear
- **Check:** Wait full 3 seconds after page load
- **Check:** Ensure not already installed (check `window.matchMedia('(display-mode: standalone)')`)
- **Check:** Ensure not dismissed 3 times (check localStorage: `a3km-install-prompt-dismissed`)
- **Fix:** Clear localStorage and reload

### Update Notification Doesn't Appear
- **Check:** Version in `version.json` is newer than cached version
- **Check:** Update check interval (waits 6 hours between checks)
- **Fix:** Manually trigger: `window.dispatchEvent(new Event('online'))`

### Offline Content Not Loading
- **Check:** DevTools → Application → Cache Storage → Verify files cached
- **Check:** Service worker registered (Application → Service Workers)
- **Fix:** Unregister SW, clear caches, reinstall

### iOS Storage Exceeded
- **Check:** iOS Safari has 50MB quota
- **Fix:** Mobile service worker has conservative limits (75/150/100)
- **Fix:** Consider selective caching for iOS users

---

## **Performance Benchmarks**

### Expected Timings
- Install prompt appearance: 3 seconds after page load
- Initial download: 30-60 seconds (85MB content)
- Update check: < 1 second (fetches version.json)
- Update download: 20-40 seconds (delta content)
- Cache lookup: < 10ms
- Offline page load: < 100ms

### Network Usage
- version.json: ~500 bytes
- Full content download: ~85MB (one-time)
- Update download: Variable (only changed files)
- Daily checks: ~5KB (version.json requests)

---

## **Success Criteria**

✅ **Install Flow**
- Prompt appears consistently after 3 seconds
- Dismiss tracking works (3-strike limit)
- Native install prompt triggers
- Offline download completes successfully
- Completion popup appears with stats

✅ **Update Flow**
- Version detection works within 6 hours
- Notifications appear correctly (PWA card vs website banner)
- Content re-downloads successfully
- Version updates in localStorage

✅ **Offline Functionality**
- All pre-cached content loads offline
- Runtime-cached pages load offline
- Images show placeholder when uncached
- No white screens or errors

✅ **Performance**
- Install prompt doesn't block page load
- Update checks don't impact performance
- Cache operations are asynchronous
- LRU eviction prevents storage overflow

✅ **Cross-Platform**
- Works on desktop Chrome/Edge/Firefox
- Works on mobile Chrome/Safari
- iOS Safari has special instructions
- Standalone mode works correctly

---

## **Testing Checklist**

Use this checklist to verify complete system functionality:

```
[ ] Test 1: Install prompt flow (new visitor)
[ ] Test 2: Update detection (PWA user)
[ ] Test 3: Update banner (website visitor)
[ ] Test 4: Runtime caching
[ ] Test 5: Content-type specific caching
[ ] Test 6: Cross-page integration (desktop + mobile)
[ ] Test 7: iOS Safari specific
[ ] Test 8: Version bump workflow (developer)
[ ] Test 9: Storage management
[ ] Test 10: Error handling
```

---

## **Next Steps After Testing**

1. **Monitor Analytics**
   - Track install rates
   - Track update acceptance rates
   - Monitor offline usage patterns

2. **Optimize Content**
   - Compress large files
   - Optimize images
   - Consider lazy loading for non-critical content

3. **Enhance Features**
   - Add push notifications
   - Implement background sync for forms
   - Add selective caching for iOS users

4. **Documentation**
   - Update user guide with PWA features
   - Create video tutorial for installation
   - Add FAQs for common issues

---

## **Support & Debugging**

### Enable Debug Logs
```javascript
// In browser console
localStorage.setItem('debug-pwa', 'true');
// Reload page
```

### Clear All PWA Data
```javascript
// Unregister service worker
navigator.serviceWorker.getRegistrations().then(registrations => {
  registrations.forEach(reg => reg.unregister());
});

// Clear all caches
caches.keys().then(keys => {
  keys.forEach(key => caches.delete(key));
});

// Clear localStorage
localStorage.clear();

// Reload
location.reload();
```

### Check Service Worker Status
```javascript
navigator.serviceWorker.getRegistration().then(reg => {
  console.log('SW Status:', reg ? 'Registered' : 'Not registered');
  if (reg) console.log('SW State:', reg.active.state);
});
```

---

**Testing Guide Version:** 1.0  
**Last Updated:** February 15, 2026  
**Compatible With:** PWA System v3.1.0-enhanced
