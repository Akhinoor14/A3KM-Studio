---
title: "Content Studio - Complete Management System"
date: 2026-02-12
author: Md Akhinoor Islam
organization: A3KM Studio | Noor Academy
category: content-management
tags: [content-studio, content-management, upload, organization]
---

# Content Studio - Content Management System

## Content Studio কী?

Content Studio হলো আমার সব ধরনের content manage করার central hub। এখানে videos, written posts, books, research papers - সব কিছু একসাথে organize করা।

**Location:** `Content Studio/` folder (main) + `Only-boss/managers/Content-studio/` (admin)

## Content Types (5 ধরনের Content)

### 1. **Video Blogs & Content** 🎬
- **Total:** 8টা YouTube videos
- **Types:** Tour vlogs, daily life, food, poems, tech
- **Data:** `Content Studio/video-content/videos.json`
- **Manager:** `educational-videos-manager.html`, `vlogs-manager.html`

**Current Videos:**
1. Sitakundo Tour (18:45 min) - Travel vlog
2. ESE KUET 2K23 batch (8:15 min) - University life  
3. Buffet Stories (12:20 min) - Food vlog
4. Bangla Poem Duet (4:30 min) - Poetry
5. Arduino Tutorial (15:00 min) - Tech education
6. SOLIDWORKS Tips (20:10 min) - CAD tutorial
7. Campus Tour (10:45 min) - University
8. Coding Session (25:00 min) - Programming

**Video Data Structure:**
```json
{
  "id": "vid-tour-001",
  "title": "SITAKUNDO TOUR || পুরো সীতাকুণ্ড ভ্রমন",
  "category": "video-blogs",
  "subcategory": "Tour & Vlogs",
  "youtubeUrl": "https://youtu.be/PhN8buh3QCA",
  "videoId": "PhN8buh3QCA",
  "thumbnail": "https://img.youtube.com/vi/PhN8buh3QCA/maxresdefault.jpg",
  "duration": "18:45",
  "publishDate": "2021-09-03",
  "language": "bn",
  "tags": ["Sitakundo", "Travel", "Waterfall"]
}
```

### 2. **Written Posts & Articles** ✍️
- **Total:** 3টা blog posts (currently)
- **Format:** Markdown files
- **Data:** `Content Studio/written-posts/posts.json`
- **Manager:** `posts-manager.html`
- **Categories:** 100+ categories available!

**Example Post Structure:**
```markdown
---
title: "Arduino Line Follower Robot"
date: 2024-08-15
category: "Robotics & Automation"
tags: ["Arduino", "Robot", "Sensors"]
language: "bn"
---

# Arduino দিয়ে Line Follower Robot বানানো

এই tutorial এ আমরা শিখব...
```

**100+ Categories Include:**
- Literature & Language (15 subcategories)
- Arts & Culture (15 subcategories)
- Social Sciences & Humanities (50+ subcategories)
- STEM & Technology (30+ subcategories)
- Business & Economics (10+ subcategories)
- Health & Wellness (5+ subcategories)
- And many more!

### 3. **Educational Courses** 🎓
- **Total:** 2টা structured courses
- **Format:** YouTube playlists
- **Data:** `Content Studio/educational-videos/courses.json`
- **Manager:** `educational-videos-manager.html`

**Current Courses:**
1. **Arduino Complete Course** (10+ videos)
   - Beginner to advanced
   - Bangla explanations
   - Code included

2. **SOLIDWORKS Modeling** (15+ videos)
   - 3D CAD basics to pro
   - Real project examples
   - Tips & tricks

### 4. **Books & PDF Library** 📚
- **Total:** 3টা engineering books
- **Format:** PDF files
- **Data:** `Content Studio/books-pdfs/books.json`
- **Manager:** `books-manager.html`, `books-manager-new.html`

**Books Collection:**
1. Electronic Components Guide (Bangla)
2. Electronic Components Guide (English)
3. Arduino Programming Basics

**Book Data:**
```json
{
  "id": "book-001",
  "title": "Electronic Components Guide - Bangla",
  "author": "Md Akhinoor Islam",
  "category": "Engineering Reference",
  "pages": 45,
  "fileSize": "5.2 MB",
  "language": "bn",
  "pdfPath": "Content Studio/books-pdfs/components-bn.pdf",
  "coverImage": "path/to/cover.jpg"
}
```

### 5. **Research Papers** 📄
- **Total:** Currently 0 (system ready)
- **Format:** Academic PDFs
- **Data:** `Content Studio/research-papers/papers.json`
- **Manager:** `papers-manager.html`
- **Viewer:** `paper-viewer-new.html`

## Content Hub Page

**Public Access:** `Content Studio/hub.html`

**Features:**
- All 16 content items displayed
- Filter by type (videos/posts/books/papers)
- Search functionality
- Category-based browsing
- Card-based grid layout
- Click to open viewer

**Search Works On:**
- Title
- Description
- Tags
- Category names
- Author names

## Content Data Central

**Master File:** `Content Code/content.json`

এখানে সব content এর metadata একসাথে:

```json
{
  "lastUpdated": "2026-02-07T00:00:00Z",
  "version": "1.0.0",
  "statistics": {
    "totalContent": 16,
    "byCategory": {
      "video-blogs": 8,
      "written-posts": 3,
      "educational-courses": 2,
      "books-pdfs": 3,
      "research-papers": 0
    }
  },
  "categories": {
    "video-blogs": {...},
    "written-posts": {...}
  }
}
```

**কেন Central JSON?**
- One source of truth
- Easy to update
- Fast loading (cache করা যায়)
- Consistent data across website
- API-like structure

## Content Upload System

### Upload Manager Files:

**Main Uploader:** `Only-boss/managers/Content-studio/content-upload-manager.js`

**Features:**
- Multi-file upload support
- Drag & drop interface
- Progress indicators
- File validation
- Automatic thumbnail generation
- GitHub sync after upload

### Upload Process (Step by Step):

#### For Videos:
1. Dashboard → Content Studio Manager → Videos
2. Click "Add New Video"
3. Enter YouTube URL
4. Auto-fetch: title, thumbnail, duration
5. Select category & tags
6. Save → Auto-updates `videos.json`
7. GitHub sync triggered

#### For Written Posts:
1. Dashboard → Post Creator
2. Write in Markdown editor
3. Select from 100+ categories
4. Add tags, metadata
5. Preview post
6. Publish → Creates `.md` file
7. Auto-updates `posts.json`
8. GitHub commit with message

#### For Books/PDFs:
1. Dashboard → Content Studio → Books Manager
2. Click "Upload New Book"
3. Select PDF file
4. Fill metadata:
   - Title, author
   - Category, language
   - Description, tags
5. Upload → File goes to `books-pdfs/`
6. Cover auto-generated (first page)
7. Entry added to `books.json`

#### For Research Papers:
1. Dashboard → Content Studio → Papers Manager
2. Upload PDF paper
3. Enter paper details:
   - Title, authors, journal
   - Publication date, DOI
   - Abstract, keywords
4. Upload → Added to `papers.json`
5. Searchable immediately

## Content Viewers

### 1. Post Viewer:

**Files:**
- `Content Studio/written-posts/post-reader.html`
- `Content Studio/written-posts/post-viewer.js`
- `Content Studio/written-posts/post-viewer.css`

**Features:**
- Markdown rendering with Marked.js
- Syntax highlighting for code (Highlight.js)
- Table of contents auto-generated
- Reading time estimate
- Share buttons
- Print option
- Dark theme optimized

### 2. PDF Viewer:

**Files:**
- `Optimization/pdf-viewer/` (desktop)
- `mobile/shared/pdf-viewer.js` (mobile)

**Features:**
- Page navigation
- Zoom in/out
- Fullscreen mode
- Download button
- Print options
- Thumbnail sidebar
- Search within PDF

### 3. Video Player:

**Implementation:**
- YouTube iframe embed
- Responsive sizing
- Autoplay option (off by default)
- Related videos (channel only)
- Captions support

### 4. Paper Viewer:

**File:** `Content Studio/research-papers/paper-viewer-new.html`

**Features:**
- Academic paper layout
- Citation generator
- Abstract preview
- Download for offline
- Share via email/social

## Folder Structure Manager

**File:** `Content Studio/cover-generator/folder-structure-manager.js`

**What It Does:**
- Maintains proper folder organization
- Auto-creates folders when uploading
- Validates file paths
- Prevents duplicate folders
- Ensures consistency

**Folder Pattern:**
```
Content Studio/
├── video-content/
│   ├── videos.json
│   └── thumbnails/
├── written-posts/
│   ├── posts.json
│   ├── post-001.md
│   ├── post-002.md
│   └── post-003.md
├── educational-videos/
│   └── courses.json
├── books-pdfs/
│   ├── books.json
│   └── *.pdf files
└── research-papers/
    ├── papers.json
    └── *.pdf papers
```

## Content Syncing

### YouTube API Integration:

**Files:**
- `Content Studio/video-content/youtube-api-config.js`
- `Content Studio/video-content/youtube-data-fetcher.js`
- `Content Studio/video-content/fetch-youtube-durations.js`

**Features:**
- Auto-fetch video metadata
- Duration calculation
- Thumbnail URLs
- View counts (optional)
- Like/dislike ratio (if public)

**API Setup:**
1. Google Cloud Console
2. Enable YouTube Data API v3
3. Create API key
4. Restrict to YouTube Data API
5. Add to `youtube-api-config.js`

### Unified Sync Manager:

**File:** `Content Studio/video-content/unified-sync-manager.html`

**Syncs:**
- YouTube videos → `videos.json`
- Local posts → GitHub
- Books metadata → central JSON
- Papers data → papers.json

**Sync Schedule:**
- Manual: Click "Sync Now" button
- Automatic: Every 6 hours (planned)
- On upload: Immediate sync trigger

## Content Analytics (Planned)

### Future Features:

**View Tracking:**
- Most viewed content
- Popular categories
- User engagement time
- Device breakdown

**Search Analytics:**
- Top search terms
- Click-through rates
- Failed searches (for improvement)

**Performance Metrics:**
- Load times per content type
- CDN cache hit rate
- Download counts

## Content Organization Best Practices

### File Naming:
- Videos: `vid-{category}-{number}` (e.g., `vid-tour-001`)
- Posts: `post-{number}-{slug}.md` (e.g., `post-001-welcome.md`)
- Books: `{title-slug}.pdf` (e.g., `arduino-basics.pdf`)
- Papers: `{year}-{author}-{title}.pdf`

### Metadata Standards:
- Always include: title, date, author, category, tags
- Language code: `bn` (Bangla), `en` (English), `bn-en` (Mixed)
- ISO date format: `YYYY-MM-DD`
- Tags: lowercase, hyphen-separated

### Category Assignment:
- One primary category required
- Multiple tags allowed (max 10)
- Subcategory optional but recommended
- Consistent naming across content types

## Mobile Content Studio

**Mobile Access:** `mobile/content-studio/`

**Features:**
- Browse all content types
- Search & filter
- Open viewers (optimized for mobile)
- Share via mobile apps
- Download for offline

**Mobile Optimizations:**
- Single-column layout
- Larger touch targets
- Swipe navigation
- Lazy loading
- Reduced data usage

## Troubleshooting Content Issues

### Problem: Video not loading

**Check:**
1. YouTube URL correct?
2. Video set to "Public" or "Unlisted"?
3. API key valid?
4. Rate limit exceeded?

**Solution:**
- Verify URL format
- Check video privacy settings
- Regenerate API key if needed
- Wait 24 hours if rate limited

### Problem: Post not showing

**Check:**
1. Is `.md` file in correct folder?
2. Is frontmatter valid YAML?
3. Is `posts.json` updated?
4. GitHub sync completed?

**Solution:**
- Move file to `written-posts/`
- Validate YAML syntax
- Manually add entry to JSON
- Trigger sync from dashboard

### Problem: PDF not opening

**Check:**
1. File actually PDF format?
2. File size reasonable (<50MB)?
3. Path in JSON correct?
4. PDF viewer script loaded?

**Solution:**
- Convert to proper PDF
- Compress if too large
- Fix file path
- Check browser console for errors

---

**শেষ Update:** 2026-02-12  
**Content Growth:** Planning to reach 100+ content items by 2027!
