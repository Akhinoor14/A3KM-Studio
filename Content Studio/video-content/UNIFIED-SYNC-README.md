# Unified Video Sync System

## 🎯 Overview

The **Unified Video Sync System** ensures that video data is **automatically synchronized** between Desktop and Mobile platforms. Update videos anywhere, and see changes everywhere!

---

## ✨ Key Features

### 🔄 **Automatic Sync**
- Update videos on **Desktop** → Automatically syncs to **Mobile**
- Update videos on **Mobile** → Automatically syncs to **Desktop**
- **Bidirectional sync** - intelligently detects which platform has newer data

### 📊 **Single Source of Truth**
- No more manual copying between `videos.json` and `content.json`
- Updates from YouTube API automatically propagate to both platforms
- Content Manager (Only-boss) auto-triggers sync after every video update

### 🚀 **Real-time YouTube Data**
- Fetches duration, views, likes, comments from YouTube API
- Caches data for 1 hour to reduce API calls
- Works with or without API key (fallback modes available)

---

## 📂 System Architecture

```
┌─────────────────────────────────────────────────────┐
│                 UNIFIED SYNC SYSTEM                  │
└─────────────────────────────────────────────────────┘
                           │
           ┌───────────────┴───────────────┐
           │                               │
           ▼                               ▼
┌──────────────────────┐        ┌──────────────────────┐
│   DESKTOP PLATFORM    │        │   MOBILE PLATFORM     │
├──────────────────────┤        ├──────────────────────┤
│ videos.json          │◄──────►│ content.json         │
│ (Nested Structure)   │  Sync  │ (Flat Array)         │
│                      │        │                      │
│ Content Studio/      │        │ Content Code/        │
│ video-content/       │        │ content.json         │
└──────────────────────┘        └──────────────────────┘
           ▲                               ▲
           │                               │
           └───────────┬───────────────────┘
                       │
                       ▼
              ┌─────────────────┐
              │  YOUTUBE API     │
              │  - Duration      │
              │  - Views         │
              │  - Likes         │
              └─────────────────┘
```

---

## 🎮 How to Use

### **Method 1: Unified Sync Manager (Recommended)**

1. Open **Only-boss Dashboard**
2. Click **"Unified Video Sync"** card
3. Choose sync direction:
   - **Desktop → Mobile**: Sync videos.json to content.json
   - **Mobile → Desktop**: Sync content.json to videos.json
   - **Auto Sync**: Intelligently syncs based on most recent data

4. View real-time sync status and logs

**Dashboard Link**: `Only-boss/dashboard/only-boss-dashboard-redesigned.html`

**Direct Access**: `Content Studio/video-content/unified-sync-manager.html`

---

### **Method 2: Automatic Sync (Content Manager)**

When you edit/add/delete videos through **Content Manager**:

✅ Videos automatically sync to mobile platform  
✅ No manual action required  
✅ Happens in background

**Location**: `Only-boss/managers/Content-studio/vlogs-manager.html`

---

### **Method 3: Programmatic Sync (Developers)**

Use JavaScript to trigger sync from any page:

```javascript
// Desktop → Mobile
await window.unifiedVideoSync.syncDesktopToMobile();

// Mobile → Desktop
await window.unifiedVideoSync.syncMobileToDesktop();

// Bidirectional (auto-detect)
await window.unifiedVideoSync.syncBidirectional();
```

---

## 📝 File Structure

```
A3KM-Studio/
│
├── Content Studio/
│   └── video-content/
│       ├── videos.json                    # Desktop source
│       ├── unified-video-sync.js           # Sync engine
│       ├── unified-sync-manager.html       # Sync dashboard
│       ├── youtube-api-config.js           # API config
│       └── youtube-data-fetcher.js         # YouTube data
│
├── Content Code/
│   └── content.json                        # Mobile source
│
├── mobile/
│   └── content-studio/
│       └── video-blogs/
│           ├── unified-video-sync.js       # Mobile sync
│           ├── youtube-api-config.js       # API config
│           └── youtube-data-fetcher.js     # YouTube data
│
└── Only-boss/
    ├── dashboard/
    │   └── only-boss-dashboard-redesigned.html  # Access point
    └── managers/
        └── Content-studio/
            ├── content-manager.js          # Auto-sync trigger
            └── vlogs-manager.html          # Video manager
```

---

## 🔧 Technical Details

### **Data Flow**

1. **Desktop Structure** (`videos.json`):
   ```json
   {
     "categories": {
       "video-blog": {
         "tech-tutorials": {
           "name": "Tech Tutorials",
           "videos": [
             { "id": "vid1", "title": "...", "videoId": "..." }
           ]
         }
       }
     }
   }
   ```

2. **Mobile Structure** (`content.json`):
   ```json
   {
     "video-blogs": [
       { "id": "vid1", "title": "...", "videoId": "...", "subcategory": "Tech Tutorials" }
     ],
     "statistics": {
       "totalContent": 10,
       "byCategory": { "video-blogs": 4 }
     }
   }
   ```

### **Sync Process**

1. **Load**: Fetch both JSON files from GitHub
2. **Extract**: Convert nested → flat (or vice versa)
3. **Enhance**: Add YouTube data (duration, views, likes)
4. **Update**: Save back to GitHub with commit message
5. **Log**: Track sync history and status

---

## 🔐 GitHub Token Setup

The sync system uses **GitHub API** to read/write files. Token is set via **Only-boss**.

### **Set Token**:
1. Go to **Only-boss Dashboard**
2. Click **"API Config Manager"**
3. Enter your GitHub Personal Access Token
4. Token saves to `localStorage` (encrypted)

### **Token Permissions**:
- `repo` - Full repository access
- `contents:write` - Update files

**Get Token**: [GitHub Settings → Developer settings → Personal access tokens](https://github.com/settings/tokens)

---

## 🚨 Troubleshooting

### **Sync Failed**
- ✅ Check GitHub token is set
- ✅ Verify internet connection
- ✅ Check browser console for errors
- ✅ Ensure files exist in repository

### **Videos Not Showing**
- ✅ Run **Bidirectional Sync** to reconcile data
- ✅ Clear browser cache
- ✅ Check `lastUpdated` timestamp in JSON files

### **YouTube Data Missing**
- ✅ Verify API key in `youtube-api-config.js`
- ✅ Check API quota at [Google Console](https://console.cloud.google.com/)
- ✅ System works without API (uses fallback)

---

## 📊 Benefits

✅ **No Manual Work**: Sync happens automatically  
✅ **Always Up-to-Date**: Desktop and Mobile stay in sync  
✅ **YouTube Integration**: Real-time video stats  
✅ **Single Update Point**: Edit once, updates everywhere  
✅ **Error Handling**: Fallbacks and retry mechanisms  
✅ **Audit Trail**: Logs every sync operation  

---

## 🎉 Success!

Your video content is now **unified across all platforms**!

**Update videos anywhere → Automatically reflects everywhere** 🚀

---

**Questions?** Check the console logs for detailed sync information.

**Author**: Md Akhinoor Islam - A3KM Studio  
**Last Updated**: February 10, 2026
