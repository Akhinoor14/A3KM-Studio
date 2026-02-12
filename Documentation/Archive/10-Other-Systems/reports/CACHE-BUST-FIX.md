# Force Fresh Deployment - Cache Bust Instructions

## Issue: Vercel CDN Caching Old "Under Development" Overlay

The overlay is NOT in the code anymore, but Vercel CDN is serving cached versions.

## Fixed:

1. ✅ Service Worker version bumped: `v2.1.0-2026-02-10`
2. ✅ Vercel config: Added HTML no-cache headers
3. ✅ Meta tags: Added no-cache headers to post-listing-new.html and post-reader.html
4. ✅ CSS/JS cache-busting: Added `?v=2.1.0` query parameters

## To Force Fresh Deployment:

### Option 1: Git Push (Triggers Vercel Deploy)
```bash
git add .
git commit -m "Fix: Remove cached overlays - Service Worker v2.1.0"
git push origin main
```

### Option 2: Vercel CLI Force Redeploy
```bash
vercel --prod --force
```

### Option 3: Vercel Dashboard
1. Go to https://vercel.com/dashboard
2. Select A3KM Studio project
3. Go to Deployments
4. Click "Redeploy" on latest deployment
5. Check "Clear cache and regenerate"

## For Users Seeing Old Version:

### Hard Refresh:
- **Chrome/Edge/Firefox (Windows):** `Ctrl + Shift + R` or `Ctrl + F5`
- **Chrome/Safari (Mac):** `Cmd + Shift + R`
- **Mobile:** Clear browser cache or use incognito mode

### Clear Service Worker:
1. Open DevTools (F12)
2. Application tab → Service Workers
3. Click "Unregister"
4. Application tab → Storage
5. Click "Clear site data"
6. Reload page

## What Changed:

### Service Worker (`Optimization/service-worker.js`):
- Version: `v1.0.0` → `v2.1.0-2026-02-10`
- Automatically invalidates all client caches on next visit

### Vercel Config (`Optimization/vercel.json`):
```json
{
  "source": "/(.*)\\.html",
  "headers": [
    { "key": "Cache-Control", "value": "no-cache, no-store, must-revalidate" },
    { "key": "Pragma", "value": "no-cache" },
    { "key": "Expires", "value": "0" }
  ]
}
```

### HTML Files:
Added meta tags:
```html
<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
<meta http-equiv="Pragma" content="no-cache">
<meta http-equiv="Expires" content="0">
```

### CSS/JS Links:
Added version query strings:
```html
<link rel="stylesheet" href="../../Optimization/styles.css?v=2.1.0" />
```

## Expected Result:

After deployment:
1. Vercel serves fresh HTML (no CDN cache)
2. Service Worker detects version change, clears old cache
3. Users get fresh content without "Under Development" overlay
4. Future updates won't cache HTML files

## Verify Fresh Deployment:

1. Visit: https://a3kmstudio.vercel.app/Content%20Studio/written-posts/post-listing-new.html
2. Open DevTools → Network tab
3. Check Response Headers:
   - Should see: `cache-control: no-cache, no-store, must-revalidate`
4. Console should show: `Service Worker v2.1.0-2026-02-10 activated`
5. No "Under Development" overlay should appear

---

**Status:** Ready to deploy. Just push to GitHub, Vercel will auto-deploy fresh version.
