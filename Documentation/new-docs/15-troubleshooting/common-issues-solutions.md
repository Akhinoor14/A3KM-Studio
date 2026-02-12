---
title: "Common Issues & Troubleshooting Guide - সমস্যা সমাধান"
description: "Comprehensive troubleshooting guide covering website loading issues, mobile problems, GitHub sync errors, authentication failures, content display bugs, and performance optimization with step-by-step solutions"
date: 2026-02-12
lastUpdated: 2026-02-12
version: "1.5.0"
author: Md Akhinoor Islam
authorEmail: mdakhinoorislam@gmail.com
organization: A3KM Studio | Noor Academy
category: troubleshooting
difficulty: beginner
readTime: "14 min"
wordCount: 3000
tags: [troubleshooting, debugging, issues, solutions, faq, common-problems, fixes, error-resolution]
status: complete
featured: true
prerequisites:
  - "Basic website navigation knowledge"
  - "Understanding of browser basics"
relatedDocs:
  - "../02-authentication-security/only-boss-auth-system.md"
  - "../10-mobile-experience/mobile-system-complete.md"
  - "../12-github-integration/github-sync-complete.md"
---

# 🔧 Troubleshooting Guide - সমস্যা সমাধান

> **🆘 Overview:** A comprehensive troubleshooting resource covering common website issues, mobile problems, authentication errors, content display bugs, and GitHub sync failures with detailed step-by-step solutions for quick resolution.

---

## 📋 Table of Contents

- [🌐 Website Loading Issues](#website-loading)
- [📱 Mobile-Specific Problems](#mobile-problems)
- [🔐 Authentication Errors](#auth-errors)
- [📝 Content Display Issues](#content-issues)
- [🔗 GitHub Sync Failures](#github-sync-failures)
- [⚡ Performance Problems](#performance)
- [🎨 Visual/UI Bugs](#visual-bugs)
- [🆘 Emergency Fixes](#emergency-fixes)

---

## 🌐 Website Loading Issues {#website-loading}

### 🔴 **Problem: Website না Load হচ্ছে**

#### **Symptoms:**
- 💀 Blank white screen
- ❌ "Page not found" error  
- ⏳ Infinite loading spinner
- 🔄 Page keeps refreshing

#### Solutions:

**1. Check Internet Connection:**
```
- WiFi connected আছে?
- Mobile data on আছে?
- Test: Open google.com
```

**2. Clear Browser Cache:**
```
Chrome/Edge:
- Ctrl+Shift+Delete
- Select "Cached images and files"
- Click "Clear data"
- Refresh: Ctrl+F5
```

**3. Try Different Browser:**
- Chrome → Try Edge
- Firefox → Try Chrome
- Safari → Try any Chromium browser

**4. Check URL:**
```
Correct: akhinoor14.github.io/A3KM-Studio
Wrong: akhinoor14.github.io (missing /A3KM-Studio)
```

---

### 🔴 **Mobile Version না Open হচ্ছে**

#### Problem:
Desktop version mobile এ show হচ্ছে বা vice versa

#### Solutions:

**1. Force Refresh:**
```
- Mobile এ: Pull to refresh
- Desktop এ: Ctrl+Shift+R
```

**2. Clear localStorage:**
```javascript
// Browser console এ (F12) paste করোLocalStorage.clear();
location.reload();
```

**3. Manual URL:**
```
Desktop: /Home/index.html
Mobile: /mobile/home/index.html
```

**4. Check User Agent:**
```javascript
// Console দিয়ে check করো
console.log(navigator.userAgent);
// "Mobile" word থাকলে mobile device
```

---

### 🔴 **Only Boss Login করতে পারছি না**

#### Symptoms:
- Password correct কিন্তু login হচ্ছে না
- "Invalid password" message
- Redirect হচ্ছে না

#### Solutions:

**1. Password Re-check:**
```
- Caps Lock on আছে কিনা
- Extra spaces নেই তো?
- Copy-paste করো (typing error avoid)
```

**2. Clear Browser Data:**
```
- Cookies delete করো
- localStorage clear করো
- Cache clear করো
```

**3. Check SHA-256 Hash:**
```javascript
// Console এ password hash check করো
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hash));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

hashPassword('your-password').then(console.log);
// Output hash match করে দেখো
```

**4. Emergency Access:**
```javascript
// Source code দেখে correct hash বের করো
// File: Only-boss/auth/only-boss-auth.js
// Line: const correctHash = '...'
```

---

### 🔴 **Projects Load হচ্ছে না**

#### Problem:
- Project cards blank
- Images না দেখা যাচ্ছে
- "No projects found"

#### Solutions:

**1. Check JSON File:**
```javascript
// Console এ check করো
fetch('/Projects%20Code/projects.json')
    .then(r => r.json())
    .then(data => console.log('Projects:', data.projects.length))
    .catch(err => console.error('Error:', err));
```

**2. Path Issues:**
```
- Spaces encoded হয়েছে কিনা (%20)
- Case-sensitive paths (Projects != projects)
- Forward slash / used (না \ backslash)
```

**3. CORS Error:**
```
- Local file:// protocol use করো না
- Live Server বা http server চালাও
```

**4. Image Loading:**
```javascript
// Individual image check
const img = new Image();
img.onerror = () => console.log('Image load failed');
img.onload = () => console.log('Image loaded!');
img.src = 'path/to/image.jpg';
```

---

### 🔴 **GitHub Sync কাজ করছে না**

#### Symptoms:
- "Upload failed" error
- Token expired warning
- 401/403 errors

#### Solutions:

**1. Token Health Check:**
```
- Dashboard → Security & Tokens
- Token Health Dashboard open করো
- Verify token validity
```

**2. Token Regeneration:**
```
Steps:
1. GitHub → Settings → Developer Settings
2. Personal Access Tokens → Delete old
3. Generate new token
4. Scopes: repo (full access)
5. Copy token
6. Only Boss → Token Manager → Paste
7. Test token
```

**3. Rate Limit Check:**
```javascript
// Console এ check করো
fetch('https://api.github.com/rate_limit', {
    headers: {
        'Authorization': 'Bearer YOUR_TOKEN'
    }
}).then(r => r.json()).then(console.log);

// Output দেখো:
// remaining: 0 = rate limit exceeded (wait 1 hour)
// remaining: 5000 = all good
```

**4. Network Error:**
```
- Internet connection check করো
- GitHub status: github.com/status
- Firewall blocking করছে কিনা
```

---

### 🔴 **PWA Install না হচ্ছে**

#### Problem:
- Install button দেখা যাচ্ছে না
- "Add to Home Screen" option নেই
- Install করলেও কাজ করছে না

#### Solutions:

**1. Browser Compatibility:**
```
✅ Chrome 90+ (best support)
✅ Edge 90+
⚠️ Firefox (no install prompt)
⚠️ Safari iOS (manual add to home screen)
```

**2. HTTPS Required:**
```
- Local: http://localhost (okay)
- Production: HTTPS must (http:// won't work)
- GitHub Pages: Default HTTPS ✅
```

**3. Manifest Valid:**
```javascript
// Console check
fetch('/Optimization/manifest.json')
    .then(r => r.json())
    .then(m => console.log('Manifest valid:', m))
    .catch(e => console.error('Manifest error:', e));
```

**4. Service Worker:**
```javascript
// Check registration
navigator.serviceWorker.getRegistration()
    .then(reg => console.log('SW registered:', reg))
    .catch(err => console.error('SW error:', err));
```

**5. Manual Install (Chrome):**
```
- Address bar এ icon দেখো (➕ বা install icon)
- Click করো → Install
- If no icon: Settings → More tools → Create shortcut → "Open as window"
```

---

### 🔴 **PDF Viewer খুলছে না**

#### Symptoms:
- PDF blank screen
- "Failed to load" error
- Infinite loading spinner

#### Solutions:

**1. File Path Correct:**
```javascript
// Console check
fetch('/Content%20Studio/books-pdfs/file.pdf')
    .then(r => console.log('PDF found:', r.ok))
    .catch(e => console.error('PDF not found'));
```

**2. File Size Issue:**
```
- Large files (>50MB) slow load হয়
- Compress PDF: ilovepdf.com
- Or split into parts
```

**3. Browser PDF Support:**
```
Chrome/Edge: Built-in PDF viewer ✅
Firefox: Built-in ✅
Safari: Built-in ✅
```

**4. Mobile PDF:**
```
- Use mobile PDF viewer component
- File: mobile/shared/pdf-viewer.js
- Download option available
```

---

### 🔴 **Markdown Rendering ভুল**

#### Problem:
- Markdown plain text এ দেখাচ্ছে
- Code blocks formatted নয়
- Tables messy

#### Solutions:

**1. Marked.js Loaded:**
```javascript
// Console check
console.log(typeof marked);
// Should output: "function"
```

**2. Highlight.js for Code:**
```javascript
// Check
console.log(typeof hljs);
// Should output: "object"
```

**3. Manual Render:**
```javascript
// Try manually
const markdown = '# Hello\n\nThis is **bold**';
const html = marked.parse(markdown);
console.log(html);
// Should output HTML
```

**4. Frontmatter Issue:**
```markdown
Wrong:
title: My Post
date: 2026-02-12

Correct:
---
title: My Post
date: 2026-02-12
---
```

---

### 🔴 **Mobile Navbar না দেখা যাচ্ছে**

#### Problem:
- Bottom navbar missing
- Navigation buttons not working
- Navbar wrong position

#### Solutions:

**1. CSS Loaded:**
```javascript
// Check
const styles = document.querySelectorAll('link[rel="stylesheet"]');
console.log('Stylesheets:', styles.length);
// Should have mobile-navbar.css
```

**2. JS Loaded:**
```javascript
// Check
console.log(typeof mobileNavbar);
// Should not be "undefined"
```

**3. Z-index Issue:**
```css
/* Ensure navbar on top */
.mobile-navbar {
    z-index: 9999 !important;
}
```

**4. Fixed Position:**
```css
.mobile-navbar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
}
```

---

## Browser-Specific Issues

### Chrome/Edge Issues:

**Problem: Extensions Blocking**
```
- Ad blockers block scripts?
- Try Incognito: Ctrl+Shift+N
- Disable extensions temporarily
```

**Problem: Memory Issues**
```
- Too many tabs open
- Close unused tabs
- Clear cache
- Restart browser
```

### Firefox Issues:

**Problem: Storage Quota**
```
- Firefox limits localStorage
- Clear data: about:preferences#privacy
- Increase quota (advanced)
```

**Problem: Service Worker**
```
- Check: about:serviceworkers
- Unregister old workers
- Re-register fresh
```

### Safari Issues:

**Problem: iOS PWA Limits**
```
- Storage limit: 50MB only
- Cleared after 7 days inactive
- No background sync
- Manual "Add to Home Screen"
```

**Problem: Viewport Issues**
```html
<!-- Ensure meta tag -->
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
```

---

## Performance Issues

### Slow Loading:

**Solutions:**
```
1. Check internet speed: fast.com
2. Clear browser cache
3. Disable unnecessary extensions
4. Close other tabs/apps
5. Restart device
```

### High Data Usage:

**Solutions:**
```
1. Enable data saver (Chrome settings)
2. Use WiFi instead of mobile data
3. Install PWA (caches content)
4. Disable auto-play videos
```

### Battery Drain:

**Solutions:**
```
1. Reduce screen brightness
2. Close background tabs
3. Disable animations (planned feature)
4. Use dark theme (OLED phones)
```

---

## Error Messages Decoded

### "401 Unauthorized"
```
Meaning: GitHub token invalid/expired
Fix: Regenerate token
```

### "403 Forbidden"
```
Meaning: Rate limit exceeded
Fix: Wait 1 hour or use different token
```

### "404 Not Found"
```
Meaning: File/page doesn't exist
Fix: Check URL spelling, case-sensitive paths
```

### "422 Validation Failed"
```
Meaning: Data format incorrect
Fix: Check JSON structure, required fields
```

### "500 Internal Server Error"
```
Meaning: Server problem (GitHub/Vercel)
Fix: Wait few minutes, try again
```

### "Network Error"
```
Meaning: No internet or CORS issue
Fix: Check connection, use proper server
```

---

## Emergency Recovery

### Complete Reset:

```javascript
// CAUTION: Deletes all local data!

// 1. Clear all storage
localStorage.clear();
sessionStorage.clear();

// 2. Unregister service worker
navigator.serviceWorker.getRegistrations()
    .then(regs => regs.forEach(reg => reg.unregister()));

// 3. Clear all caches
caches.keys()
    .then(keys => Promise.all(keys.map(key => caches.delete(key))));

// 4. Hard refresh
location.reload(true);
```

### Backup Recovery:

```
1. GitHub repo has all files
2. Clone fresh copy
3. Or restore from commit:
   git checkout <commit-hash> -- path/to/file
```

---

## Getting Help

### Self-Help Resources:

1. **Browser Console:**
   - F12 → Console tab
   - Read error messages
   - Check network requests

2. **Documentation:**
   - This documentation system
   - Code comments in files
   - README files in folders

3. **GitHub Issues:**
   - Check existing issues
   - Create new issue if needed

### Contact:

**For Critical Issues:**
- Email: [Your Email]
- GitHub: @Akhinoor14

**Response Time:**
- Critical bugs: 24 hours
- Features: 1-2 weeks
- Questions: 2-3 days

---

**শেষ Update:** 2026-02-12  
**Most Common Issue:** Token expiry (check monthly!)
