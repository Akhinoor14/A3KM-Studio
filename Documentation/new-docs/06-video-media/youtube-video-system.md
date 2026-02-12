---
title: "Video & Media Management System"
date: 2026-02-12
author: Md Akhinoor Islam
organization: A3KM Studio | Noor Academy
category: video-media
tags: [youtube, video, vlogs, educational, api]
---

# Video & Media Management

## YouTube Integration System

আমার website এ total **8+ YouTube videos** আছে different categories এ।

**Video Categories:**
- 🎥 Tour & Vlogs
- 📅 Daily Life
- 🍔 Food & Cooking
- 📝 Poetry & Literature
- 💻 Tech Tutorials
- 🎓 Educational Content

## Video Data Structure

### Main Data File:

**Location:** `Content Studio/video-content/videos.json`

**Structure:**
```json
{
  "lastUpdated": "2026-02-07T00:00:00Z",
  "totalVideos": 8,
  "videos": [
    {
      "id": "vid-tour-001",
      "title": "SITAKUNDO TOUR || পুরো সীতাকুণ্ড ভ্রমন",
      "category": "video-blogs",
      "subcategory": "Tour & Vlogs",
      "description": "সীতাকুণ্ড ভ্রমন। চন্দ্রনাথ পাহাড়। গুলিয়াখালি সমুদ্র সৈকত।",
      
      "youtubeUrl": "https://youtu.be/PhN8buh3QCA",
      "videoId": "PhN8buh3QCA",
      "embedUrl": "https://www.youtube.com/embed/PhN8buh3QCA",
      
      "thumbnail": "https://img.youtube.com/vi/PhN8buh3QCA/maxresdefault.jpg",
      "thumbnailMedium": "https://img.youtube.com/vi/PhN8buh3QCA/hqdefault.jpg",
      "thumbnailSmall": "https://img.youtube.com/vi/PhN8buh3QCA/default.jpg",
      
      "duration": "18:45",
      "durationSeconds": 1125,
      "publishDate": "2021-09-03",
      "uploadDate": "2021-09-03T10:30:00Z",
      
      "language": "bn",
      "tags": ["Sitakundo", "Travel", "Chandranath", "Guliakhali", "Waterfall"],
      
      "viewCount": 1250,
      "likeCount": 85,
      "commentCount": 23,
      
      "icon": "fa-map-marked-alt",
      "featured": true
    }
  ]
}
```

**YouTube URL Types:**
```javascript
// Regular URL
youtubeUrl: "https://youtu.be/PhN8buh3QCA"

// Watch URL
watchUrl: "https://www.youtube.com/watch?v=PhN8buh3QCA"

// Embed URL (iframe এ use করার জন্য)
embedUrl: "https://www.youtube.com/embed/PhN8buh3QCA"
```

**Thumbnail URLs:**
```javascript
// Max quality (1920x1080)
maxresdefault.jpg

// High quality (480x360)
hqdefault.jpg

// Medium (320x180)
mqdefault.jpg

// Small (120x90)
default.jpg
```

## YouTube API Setup

### 1. **Google Cloud Console Setup:**

**Steps:**
```
1. cloud.google.com/console এ যাও
2. New Project create করো: "A3KM-Studio-API"
3. Enable APIs:
   - YouTube Data API v3
4. Create Credentials:
   - API Key
5. Restrict API Key:
   - API restrictions → YouTube Data API v3 only
   - HTTP referrers: yourdomain.com
6. Copy API Key
```

### 2. **API Key Configuration:**

**File:** `Content Studio/video-content/youtube-api-config.js`

```javascript
// YouTube API Configuration
const YOUTUBE_API_CONFIG = {
    apiKey: 'YOUR_API_KEY_HERE',  // Replace with actual key
    baseUrl: 'https://www.googleapis.com/youtube/v3',
    maxResults: 50,
    region: 'BD',  // Bangladesh
    language: 'bn'  // Bangla
};

// API Endpoints
const API_ENDPOINTS = {
    videos: '/videos',
    playlists: '/playlists',
    playlistItems: '/playlistItems',
    channels: '/channels',
    search: '/search'
};

// Helper function
function buildURL(endpoint, params) {
    const url = new URL(YOUTUBE_API_CONFIG.baseUrl + endpoint);
    url.searchParams.append('key', YOUTUBE_API_CONFIG.apiKey);
    
    Object.keys(params).forEach(key => {
        url.searchParams.append(key, params[key]);
    });
    
    return url.toString();
}
```

### 3. **Fetch Video Metadata:**

**File:** `Content Studio/video-content/youtube-data-fetcher.js`

```javascript
class YouTubeDataFetcher {
    
    // Get video details by ID
    async getVideoDetails(videoId) {
        const url = buildURL(API_ENDPOINTS.videos, {
            part: 'snippet,contentDetails,statistics',
            id: videoId
        });
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (!data.items || data.items.length === 0) {
            throw new Error('Video not found');
        }
        
        const video = data.items[0];
        
        return {
            id: video.id,
            title: video.snippet.title,
            description: video.snippet.description,
            thumbnail: video.snippet.thumbnails.maxres?.url || 
                       video.snippet.thumbnails.high.url,
            duration: this.parseDuration(video.contentDetails.duration),
            publishedAt: video.snippet.publishedAt,
            viewCount: parseInt(video.statistics.viewCount),
            likeCount: parseInt(video.statistics.likeCount),
            commentCount: parseInt(video.statistics.commentCount),
            tags: video.snippet.tags || []
        };
    }
    
    // Parse ISO 8601 duration (PT18M45S → 18:45)
    parseDuration(isoDuration) {
        const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
        
        const hours = parseInt(match[1]) || 0;
        const minutes = parseInt(match[2]) || 0;
        const seconds = parseInt(match[3]) || 0;
        
        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    
    // Get channel videos
    async getChannelVideos(channelId, maxResults = 50) {
        const url = buildURL(API_ENDPOINTS.search, {
            part: 'snippet',
            channelId: channelId,
            type: 'video',
            order: 'date',
            maxResults: maxResults
        });
        
        const response = await fetch(url);
        const data = await response.json();
        
        return data.items.map(item => ({
            id: item.id.videoId,
            title: item.snippet.title,
            thumbnail: item.snippet.thumbnails.high.url,
            publishedAt: item.snippet.publishedAt
        }));
    }
}

// Usage
const fetcher = new YouTubeDataFetcher();

// Example: Fetch video
fetcher.getVideoDetails('PhN8buh3QCA')
    .then(video => console.log('Video:', video))
    .catch(err => console.error(err));
```

### 4. **Fetch Durations Automatically:**

**File:** `Content Studio/video-content/fetch-youtube-durations.js`

```javascript
async function fetchAllDurations() {
    const videosData = await fetch('/Content Studio/video-content/videos.json')
        .then(r => r.json());
    
    const fetcher = new YouTubeDataFetcher();
    
    for (let video of videosData.videos) {
        if (!video.duration || video.duration === 'TBD') {
            try {
                const details = await fetcher.getVideoDetails(video.videoId);
                video.duration = details.duration;
                video.durationSeconds = this.convertToSeconds(details.duration);
                console.log(`Updated ${video.title}: ${details.duration}`);
            } catch (err) {
                console.error(`Failed for ${video.videoId}:`, err);
            }
            
            // Rate limit: Wait 1 second between requests
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
    
    // Save updated data
    console.log('Updated videos data:', videosData);
    // Copy-paste to videos.json
}

function convertToSeconds(duration) {
    const parts = duration.split(':').map(Number);
    if (parts.length === 2) {
        return parts[0] * 60 + parts[1];  // MM:SS
    } else if (parts.length === 3) {
        return parts[0] * 3600 + parts[1] * 60 + parts[2];  // HH:MM:SS
    }
    return 0;
}
```

## Video Gallery Page

**File:** `Content Studio/video-content/video-gallery.html`

### Features:

**Grid Layout:**
```html
<div class="video-grid">
    <div class="video-card" data-video-id="PhN8buh3QCA">
        <div class="video-thumbnail">
            <img src="https://img.youtube.com/vi/PhN8buh3QCA/hqdefault.jpg" 
                 alt="Sitakundo Tour"
                 loading="lazy">
            <div class="duration-badge">18:45</div>
            <div class="play-button">
                <i class="fas fa-play"></i>
            </div>
        </div>
        
        <div class="video-info">
            <h3 class="video-title">SITAKUNDO TOUR</h3>
            <div class="video-meta">
                <span class="category-badge">Tour & Vlogs</span>
                <span class="date">Sep 3, 2021</span>
            </div>
            <p class="video-description">সীতাকুণ্ড ভ্রমন...</p>
            <div class="video-tags">
                <span class="tag">#Sitakundo</span>
                <span class="tag">#Travel</span>
            </div>
        </div>
    </div>
</div>
```

**Filter & Sort:**
```javascript
// Filter by category
function filterVideos(category) {
    const cards = document.querySelectorAll('.video-card');
    cards.forEach(card => {
        const videoCategory = card.dataset.category;
        if (category === 'all' || videoCategory === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Sort videos
function sortVideos(sortBy) {
    const container = document.querySelector('.video-grid');
    const cards = Array.from(container.querySelectorAll('.video-card'));
    
    cards.sort((a, b) => {
        if (sortBy === 'date') {
            return new Date(b.dataset.date) - new Date(a.dataset.date);
        } else if (sortBy === 'duration') {
            return parseInt(b.dataset.duration) - parseInt(a.dataset.duration);
        } else if (sortBy === 'views') {
            return parseInt(b.dataset.views) - parseInt(a.dataset.views);
        }
    });
    
    cards.forEach(card => container.appendChild(card));
}
```

## Video Viewer/Player

**File:** `Content Studio/video-content/video-viewer.html`

### YouTube Embed:

```html
<div class="video-player-container">
    <iframe 
        id="youtube-player"
        src="https://www.youtube.com/embed/PhN8buh3QCA?autoplay=0&rel=0&modestbranding=1"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
        loading="lazy">
    </iframe>
</div>

<div class="video-details">
    <h1>SITAKUNDO TOUR || পুরো সীতাকুণ্ড ভ্রমন</h1>
    
    <div class="video-stats">
        <span><i class="fas fa-eye"></i> 1,250 views</span>
        <span><i class="fas fa-thumbs-up"></i> 85 likes</span>
        <span><i class="fas fa-comment"></i> 23 comments</span>
        <span><i class="fas fa-calendar"></i> Sep 3, 2021</span>
    </div>
    
    <div class="video-description">
        <h3>Description:</h3>
        <p>সীতাকুণ্ড ভ্রমন। চন্দ্রনাথ পাহাড়...</p>
    </div>
    
    <div class="video-tags">
        <span class="tag">#Sitakundo</span>
        <span class="tag">#Travel</span>
    </div>
    
    <div class="share-buttons">
        <button onclick="shareVideo('facebook')"><i class="fab fa-facebook"></i> Share</button>
        <button onclick="shareVideo('twitter')"><i class="fab fa-twitter"></i> Tweet</button>
        <button onclick="shareVideo('whatsapp')"><i class="fab fa-whatsapp"></i> WhatsApp</button>
        <button onclick="copyLink()"><i class="fas fa-link"></i> Copy Link</button>
    </div>
</div>
```

### Embed Parameters:

```javascript
// YouTube iframe parameters
const embedParams = {
    autoplay: 0,          // Don't auto-play (annoying)
    rel: 0,               // Don't show related videos from other channels
    modestbranding: 1,    // Minimal YouTube logo
    cc_load_policy: 1,    // Show captions by default
    hl: 'bn',             // Interface language: Bangla
    cc_lang_pref: 'bn',   // Preferred caption language: Bangla
    playsinline: 1,       // iOS: Play inline, not fullscreen
    fs: 1,                // Allow fullscreen
    controls: 1           // Show player controls
};

// Build embed URL
function buildEmbedURL(videoId, params = {}) {
    const finalParams = { ...embedParams, ...params };
    const queryString = Object.entries(finalParams)
        .map(([k, v]) => `${k}=${v}`)
        .join('&');
    
    return `https://www.youtube.com/embed/${videoId}?${queryString}`;
}
```

## Unified Video Sync Manager

**File:** `Content Studio/video-content/unified-sync-manager.html`

### Features:

**Sync All Videos:**
```javascript
async function syncAllVideos() {
    const videosData = await loadVideosJSON();
    const fetcher = new YouTubeDataFetcher();
    
    let updated = 0;
    
    for (let video of videosData.videos) {
        try {
            // Fetch latest data from YouTube
            const ytData = await fetcher.getVideoDetails(video.videoId);
            
            // Update stats
            video.viewCount = ytData.viewCount;
            video.likeCount = ytData.likeCount;
            video.commentCount = ytData.commentCount;
            
            // Update duration if missing
            if (!video.duration) {
                video.duration = ytData.duration;
            }
            
            updated++;
            console.log(`✅ Updated: ${video.title}`);
            
            // Rate limit
            await sleep(1000);
            
        } catch (err) {
            console.error(`❌ Failed: ${video.title}`, err);
        }
    }
    
    console.log(`Updated ${updated}/${videosData.videos.length} videos`);
    
    // Download updated JSON
    downloadJSON(videosData, 'videos-updated.json');
}

function downloadJSON(data, filename) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
}
```

## Educational Videos/Courses

**Data:** `Content Studio/educational-videos/courses.json`

### Course Structure:

```json
{
  "courses": [
    {
      "id": "course-arduino-001",
      "title": "Arduino Complete Course - Beginner to Advanced",
      "description": "সম্পূর্ণ Arduino শিখুন বাংলায়",
      "instructor": "Md Akhinoor Islam",
      "language": "bn",
      "level": "Beginner to Advanced",
      "totalVideos": 12,
      "totalDuration": "4:30:00",
      "thumbnail": "path/to/course-thumbnail.jpg",
      
      "playlistId": "PLxxxxxxxxxxxxxx",  // YouTube playlist ID
      "playlist_url": "https://youtube.com/playlist?list=PLxxxxxx",
      
      "videos": [
        {
          "episode": 1,
          "title": "Arduino Introduction & Setup",
          "videoId": "xxxxxxxx",
          "duration": "15:30",
          "completed": false
        },
        {
          "episode": 2,
          "title": "LED Blinking - First Project",
          "videoId": "xxxxxxxx",
          "duration": "20:15",
          "completed": false
        }
      ],
      
      "tags": ["Arduino", "Electronics", "Embedded Systems"],
      "featured": true
    }
  ]
}
```

## Mobile Video Experience

**Mobile Player Optimizations:**

```css
/* Mobile-friendly player */
.video-player-container {
    position: relative;
    padding-bottom: 56.25%; /* 16:9 aspect ratio */
    height: 0;
    overflow: hidden;
}

.video-player-container iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

/* Mobile controls */
@media (max-width: 768px) {
    .video-details {
        padding: 15px;
    }
    
    .share-buttons button {
        font-size: 14px;
        padding: 10px 15px;
    }
}
```

**Touch Gestures:**
- Tap to play/pause
- Swipe for next/previous video
- Pinch to zoom (if allowed)
- Double-tap to seek forward/backward

---

**শেষ Update:** 2026-02-12  
**Total Videos:** 8+ and growing! 🎬
