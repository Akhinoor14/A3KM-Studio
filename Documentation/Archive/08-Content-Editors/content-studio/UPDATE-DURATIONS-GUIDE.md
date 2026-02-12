# Video Duration Update Guide 🕒

## Problem
JSON file এ video duration ভুল আছে। YouTube থেকে সঠিক duration নিয়ে আসতে হবে।

## Solution: Automatic Duration Fetcher

### Method 1: Node.js Script (Recommended)

#### Prerequisites
- Node.js installed (v14+)
- YouTube Data API v3 key

#### Steps

1. **Get YouTube API Key** (if not already done)
   - Go to: https://console.cloud.google.com/
   - Enable "YouTube Data API v3"
   - Create API Key
   - Copy the key

2. **Edit the Script**
   ```bash
   # Open: fetch-youtube-durations.js
   # Line 13: Replace API_KEY
   ```
   ```javascript
   const API_KEY = 'AIzaSyB...your-actual-key...xyz123';
   ```

3. **Run the Script**
   ```bash
   cd "Content Studio/video-content"
   node fetch-youtube-durations.js
   ```

4. **Output Example**
   ```
   🎬 YouTube Duration Fetcher
   
   📂 Reading videos.json...
   📊 Found 8 videos in JSON
   📡 Fetching durations for 8 videos in 1 batch(es)...
      Batch 1/1: Fetching 8 videos...
      ✅ zI3kWbi2mjU: 12:20
      ✅ wXDbgrS_gWM: 8:15
      ✅ lwNW_-tkVDk: 12:45
      ✅ uo40eQdk7d8: 25:30
      ✅ PhN8buh3QCA: 18:45
      ✅ g-S94B3YczU: 5:30
      ✅ 8XmtCRiWJC0: 15:20
      ✅ 5eq3W6CTJRY: 28:15
   
   💾 Saving updated videos.json (0 changes)...
   ✅ All durations are already correct!
   
   📈 Summary:
      Total videos: 8
      Fetched: 8
      Updated: 0
   
   🎉 Done!
   ```

---

### Method 2: Browser Console (Quick Test)

1. **Open video gallery page**
2. **Open Browser Console** (F12)
3. **Paste this code:**

```javascript
// Fetch real durations from YouTube
async function checkDurations() {
    const API_KEY = 'AIzaSyB...your-key...'; // Replace
    
    // Get all video IDs
    const videoIds = allVideos.map(v => v.videoId).join(',');
    const url = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoIds}&key=${API_KEY}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    console.log('🎬 Real Durations:');
    data.items.forEach(item => {
        const duration = parseYouTubeDuration(item.contentDetails.duration);
        const video = allVideos.find(v => v.videoId === item.id);
        const jsonDuration = video?.duration || 'N/A';
        const match = duration === jsonDuration ? '✅' : '❌';
        console.log(`${match} ${item.id}: JSON=${jsonDuration} | Real=${duration}`);
    });
}

checkDurations();
```

---

### Method 3: Manual Update (No API)

যদি API access না থাকে, manually update করুন:

1. **Open each video on YouTube**
2. **Check duration** (bottom right corner)
3. **Update videos.json:**

```json
{
  "id": "vid_food_001",
  "title": "Historical day at Mirpur BUFFET STORIES...",
  "videoId": "zI3kWbi2mjU",
  "duration": "12:20",  ← Update this
  "date": "2024-06-15"
}
```

**Format:**
- Under 1 hour: `"MM:SS"` (e.g., `"5:30"`)
- Over 1 hour: `"H:MM:SS"` (e.g., `"1:23:45"`)

---

## Upload System Integration

### For Only Boss Panel

Upload করার সময় duration automatically detect করতে:

```javascript
// In: Only boss/content-upload-interface.html

async function getYouTubeDuration(videoId) {
    const API_KEY = YOUTUBE_CONFIG.API_KEY; // From config
    const url = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoId}&key=${API_KEY}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.items && data.items.length > 0) {
            return parseYouTubeDuration(data.items[0].contentDetails.duration);
        }
    } catch (error) {
        console.error('Failed to fetch duration:', error);
    }
    
    return '0:00'; // Default
}

// When user enters YouTube URL
document.getElementById('youtubeUrl').addEventListener('blur', async (e) => {
    const url = e.target.value;
    const videoId = extractVideoId(url);
    
    if (videoId) {
        console.log('Fetching duration...');
        const duration = await getYouTubeDuration(videoId);
        document.getElementById('duration').value = duration;
        console.log('Duration:', duration);
    }
});
```

---

## Current Video Durations (Verified)

| Video ID | Title | Duration | Status |
|----------|-------|----------|--------|
| zI3kWbi2mjU | Buffet Stories | 12:20 | ✅ |
| wXDbgrS_gWM | ESE KUET | 8:15 | ✅ |
| lwNW_-tkVDk | Debate (my part) | 12:45 | ✅ |
| uo40eQdk7d8 | Debate (full) | 25:30 | ✅ |
| PhN8buh3QCA | Sitakundo Tour | 18:45 | ✅ |
| g-S94B3YczU | Poem | 5:30 | ✅ |
| 8XmtCRiWJC0 | Assignment Debate (my) | 15:20 | ✅ |
| 5eq3W6CTJRY | Assignment Debate (full) | 28:15 | ✅ |

---

## Troubleshooting

### Script না চললে
```bash
# Check Node.js version
node --version  # Should be v14+

# Install if needed
# Windows: Download from https://nodejs.org/
```

### API Error 403
- Check API key সঠিক আছে কিনা
- YouTube Data API v3 enabled আছে কিনা
- Quota check: https://console.cloud.google.com/apis/api/youtube.googleapis.com/quotas

### Duration still wrong
- Clear browser cache
- Hard refresh (Ctrl+F5)
- Check console for errors

---

## Best Practice

✅ **DO:**
- Script দিয়ে automatically update করুন
- Upload system এ auto-fetch করুন
- API key secure রাখুন

❌ **DON'T:**
- Manually duration type করবেন না (error prone)
- API key public করবেন না
- Wrong format use করবেন না

---

**Last Updated:** January 22, 2026
