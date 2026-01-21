# YouTube API Setup Guide 🎬

## Current Status
✅ **System Working:** Videos display with durations from `videos.json`  
⚠️ **API Not Configured:** Real-time stats (duration, views) disabled

---

## Why Setup YouTube API?
- **Auto-fetch duration** from YouTube (no manual updates needed)
- **Real-time view counts** 
- **Accurate video statistics**
- **Free tier:** 10,000 quota/day (plenty for this site)

---

## Setup Steps (15 minutes)

### 1. Get YouTube Data API v3 Key

#### Step 1.1: Go to Google Cloud Console
🔗 https://console.cloud.google.com/

#### Step 1.2: Create Project
1. Click "Select Project" → "New Project"
2. Name: `A3KM-Studio-YouTube`
3. Click "Create"

#### Step 1.3: Enable YouTube Data API v3
1. Go to: **APIs & Services → Library**
2. Search: `YouTube Data API v3`
3. Click on it → Click **"ENABLE"**

#### Step 1.4: Create API Key
1. Go to: **APIs & Services → Credentials**
2. Click: **"+ CREATE CREDENTIALS" → API Key**
3. Copy the generated key (e.g., `AIzaSyB...xyz123`)

#### Step 1.5: Restrict API Key (IMPORTANT for security)
1. Click "RESTRICT KEY" on the popup
2. **Application restrictions:**
   - Select: **HTTP referrers (websites)**
   - Add: `https://akhinoor14.github.io/A3KM-Studio/*`
   - Add: `http://localhost/*` (for testing)
3. **API restrictions:**
   - Select: **Restrict key**
   - Choose: **YouTube Data API v3**
4. Click **"SAVE"**

---

### 2. Add API Key to Your Code

#### Edit: `youtube-api-config.js`
```javascript
const YOUTUBE_CONFIG = {
    // Replace the XXXXXXX part with your actual API key
    API_KEY: 'AIzaSyB...xyz123', // ← Paste your key here
    
    // Rest stays the same...
};
```

**Example:**
```javascript
// Before:
API_KEY: 'AIzaSyDXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',

// After:
API_KEY: 'AIzaSyBa1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6',
```

---

### 3. Test the Setup

1. **Push changes to GitHub**
2. **Open video gallery:** https://akhinoor14.github.io/A3KM-Studio/Content%20Studio/video-content/video-gallery.html
3. **Open browser console** (F12 → Console tab)
4. **Look for:**
   ```
   ✅ YouTube API configured - Real-time stats enabled
   📡 Fetching stats for X videos...
   ✅ Fetched stats for X videos
   ```

---

## Troubleshooting

### Error: API key invalid
❌ **Problem:** `403 Forbidden` or "API key not valid"  
✅ **Solution:** 
1. Check API key is copied correctly (no extra spaces)
2. Ensure YouTube Data API v3 is **ENABLED**
3. Wait 2-3 minutes after creating key (propagation time)

### Error: Quota exceeded
❌ **Problem:** `403 quotaExceeded`  
✅ **Solution:**
1. Check usage: https://console.cloud.google.com/apis/api/youtube.googleapis.com/quotas
2. Free tier: 10,000 units/day
3. Each video.list call = 1 unit
4. Our cache system minimizes API calls (1 hour cache)

### Duration still wrong
❌ **Problem:** Old duration showing  
✅ **Solution:**
1. Clear browser cache (Ctrl+Shift+Delete)
2. Hard refresh page (Ctrl+F5)
3. Check console for "Using static data from videos.json"
4. If API not working, update `videos.json` manually

---

## Without API Key

**System still works!** All durations are stored in `videos.json`:

```json
{
  "id": "vid_food_001",
  "title": "Buffet Stories",
  "duration": "12:20",  ← Manual entry (but accurate!)
  "videoId": "zI3kWbi2mjU"
}
```

To update manually:
1. Open video on YouTube
2. Check actual duration (bottom right of player)
3. Update `videos.json` with correct time
4. Format: `"MM:SS"` or `"HH:MM:SS"`

---

## Security Best Practices

✅ **DO:**
- Restrict API key to your domain
- Use HTTP referrer restrictions
- Limit to YouTube Data API v3 only
- Monitor quota usage regularly

❌ **DON'T:**
- Share your API key publicly
- Commit unrestricted keys to public repos
- Use same key for multiple projects
- Ignore quota warnings

---

## Cost & Limits

| Item | Value |
|------|-------|
| **Free Quota** | 10,000 units/day |
| **Cost per video** | 1 unit |
| **Max videos** | ~10,000/day |
| **Cache duration** | 1 hour |
| **Daily API calls** | ~100 (with cache) |
| **Monthly cost** | $0.00 (free tier) |

---

## Support

- **API Console:** https://console.cloud.google.com/apis/api/youtube.googleapis.com/quotas
- **YouTube API Docs:** https://developers.google.com/youtube/v3
- **Pricing:** https://developers.google.com/youtube/v3/determine_quota_cost

---

**Status Check Command:**
```javascript
// Paste in browser console
console.log('API Configured:', validateYouTubeConfig());
console.log('Cached Videos:', videoStatsCache.size);
```

**Last Updated:** January 21, 2026
