# Research Papers System - Complete Guide

## 🎯 Overview
The research papers system provides a unified platform for managing and viewing academic papers across **mobile and desktop** devices with **synchronized storage** via GitHub.

## ✅ Fixed Issues
1. **✔ Typo Fixed**: Mobile viewer function `getPaperIdFrommUrl()` → `getPaperIdFromUrl()`
2. **✔ Error Handling**: Both viewers now show proper messages when PDFs are not available
3. **✔ Unified Storage**: All papers use GitHub raw URLs for consistent access
4. **✔ Status Field**: Added `status` and `doi` fields to paper entries

## 📁 System Architecture

### Storage Structure
```
GitHub Repository (Akhinoor14/A3KM-Studio)
├── Content Studio/
│   └── research-papers/
│       ├── papers.json (Central data file)
│       ├── paper-listing-new.html (Desktop listing)
│       └── paper-viewer-new.html (Desktop viewer)
│
├── Content Storage/
│   └── papers/
│       ├── renewable-energy/
│       │   ├── solar-optimization-bd.pdf
│       │   └── covers/
│       │       └── solar-optimization-bd-cover.svg
│       └── automation-control-systems/
│           ├── low-cost-automation.pdf
│           └── covers/
│               └── low-cost-automation-cover.svg
│
├── mobile/
│   └── content-studio/
│       └── research-papers/
│           ├── paper-listing.html (Mobile listing)
│           └── paper-viewer.html (Mobile viewer)
│
└── Only-boss/
    └── managers/
        └── Content-studio/
            ├── papers-manager.html (Management interface)
            └── upload-papers.html (Upload interface)
```

### Data Flow
```
Upload (Only-Boss Manager)
    ↓
GitHub Repository (PDFs + Data)
    ↓
papers.json (Single source of truth)
    ├→ Desktop Viewer (Content Studio/research-papers/paper-viewer-new.html)
    └→ Mobile Viewer (mobile/content-studio/research-papers/paper-viewer.html)
```

## 🔧 How It Works

### 1. Paper Data Structure (`papers.json`)
```json
{
  "papers": [
    {
      "id": "paper-001",
      "category": "Renewable Energy",
      "type": "research",
      "title": "Paper Title",
      "summary": "Brief summary",
      "date": "2025-10-15",
      "tags": ["tag1", "tag2"],
      "authors": ["Md Akhinoor Islam"],
      "institution": "KUET",
      "pages": 25,
      "abstract": "Full abstract text",
      "keywords": ["keyword1", "keyword2"],
      "pdfUrl": "https://raw.githubusercontent.com/Akhinoor14/A3KM-Studio/main/Content%20Storage/papers/category/filename.pdf",
      "pdfPath": "Content Storage/papers/category/filename.pdf",
      "thumbnail": "../../Content Storage/papers/category/covers/filename-cover.svg",
      "citations": 0,
      "downloads": 0,
      "language": "en",
      "status": "published",
      "doi": "10.1234/a3km.001"
    }
  ]
}
```

### 2. PDF Storage (GitHub Raw URLs)
- **Format**: `https://raw.githubusercontent.com/{owner}/{repo}/main/{path}`
- **Example**: `https://raw.githubusercontent.com/Akhinoor14/A3KM-Studio/main/Content%20Storage/papers/renewable-energy/solar-optimization-bd.pdf`
- **Benefits**:
  - ✅ Works on mobile and desktop
  - ✅ No server required
  - ✅ Free CDN hosting via GitHub
  - ✅ Version controlled

### 3. Viewers (Desktop & Mobile)

#### Desktop Viewer Features
- Full PDF.js canvas rendering
- Zoom (50%-300%)
- Night/Sepia mode
- Bookmarks per paper
- Citation generation (APA, MLA, IEEE, BibTeX)
- Print and download options
- Fullscreen mode
- Keyboard shortcuts

#### Mobile Viewer Features
- Universal PDF Viewer integration
- Touch gestures (pinch zoom, swipe)
- Download paper
- Citation copy
- Share functionality
- Optimized for mobile screens

## 📤 How to Upload Research Papers

### Step 1: Access Only-Boss Manager
1. Navigate to `Only-boss/dashboard/boss-dashboard.html`
2. Login with credentials
3. Go to **Content Studio Manager**

### Step 2: Open Papers Manager
1. Click **"Research Papers"** from Content Studio menu
2. Click **"Upload New Paper"** button

### Step 3: Fill Paper Details
Required fields:
- **Title**: Full paper title
- **Category**: Select from dropdown (e.g., "Renewable Energy")
- **Type**: Select type (Research Paper, Survey, Conference, etc.)
- **Authors**: Add authors (press Enter after each)
- **Abstract**: Paper abstract (500 chars)
- **PDF File**: Upload PDF (max 100MB)
- **Publication Date**: Select date
- **Language**: en/bn

Optional fields:
- DOI
- Publication venue
- Citations count
- Keywords/tags

### Step 4: Upload Process
1. Drag & drop PDF or click to browse
2. System auto-detects page count
3. Click **"Upload Paper"**
4. GitHub API uploads PDF and updates `papers.json`
5. Paper becomes immediately available on mobile and desktop

## 🔍 Viewing Papers

### Desktop
1. Go to `Content Studio/research-papers/paper-listing-new.html`
2. Browse papers by category or search
3. Click paper to open in `paper-viewer-new.html`
4. Use toolbar controls for navigation, zoom, citations, etc.

### Mobile
1. Go to `mobile/content-studio/research-papers/paper-listing.html`
2. Browse or search papers
3. Tap paper to open in `paper-viewer.html`
4. Use Universal PDF Viewer with touch gestures

## ⚙️ Unified Storage Benefits

### Same Data Everywhere
- **Single Source**: `papers.json` is the only data file
- **Sync**: Upload once in Only-Boss, available everywhere
- **Consistency**: Mobile and desktop show same papers
- **Real-time**: Updates appear immediately (after JSON update)

### GitHub Storage
- **Free**: No hosting cost for PDFs
- **Fast**: GitHub CDN delivers worldwide
- **Reliable**: 99.9% uptime
- **Secure**: Version control and backup

## 🛠️ Troubleshooting

### "Error Loading Pages"
**Cause**: PDF file doesn't exist on GitHub
**Solution**: Upload PDF through Only-Boss Manager

### PDF Shows But Won't Open
**Cause**: Invalid GitHub URL or file not committed
**Solution**: 
1. Check `pdfUrl` in `papers.json`
2. Verify file exists at GitHub raw URL
3. Ensure URL encoding for spaces (`%20`)

### Papers Not Showing
**Cause**: `papers.json` not loaded correctly
**Solution**:
1. Check browser console for errors
2. Verify JSON syntax validity
3. Check file paths are correct

### Mobile Viewer Not Working
**Cause**: Universal PDF Viewer not loaded
**Solution**:
1. Ensure `mobile/shared/pdf-viewer.js` exists
2. Check script is loaded in HTML
3. Verify `openUniversalPDFViewer()` function exists

## 📊 Status Indicators

Papers can have different statuses:
- **published**: Peer-reviewed and published
- **under-review**: Submitted, awaiting review
- **draft**: Work in progress
- **archived**: Old or deprecated

## 🎨 Color Coding (Engineering Theme)

### Mobile & Desktop
- Primary: `#CC0000` (Crimson Red) - Main elements
- Dark: `#8B0000` (Dark Red) - Depth
- Medium: `#B22222` (Fire Brick) - Accents
- Bright: `#DC143C` (Crimson) - Highlights
- White Splash: `rgba(255,255,255,0.08-0.15)` - Borders

### Status Colors
- Published: `#DC143C` (Bright Crimson)
- Under Review: `#B22222` (Fire Brick)
- Draft: `#8B0000` (Dark Red)

## 📝 Future Enhancements

1. **Auto-PDF Upload**: Direct GitHub API integration
2. **Collaboration**: Multiple author management
3. **Versioning**: Track paper revisions
4. **Analytics**: View counts, downloads tracking
5. **Comments**: Peer review comments
6. **Collections**: Organize papers into collections

## 🔐 Security Notes

- PDFs are public via GitHub raw URLs
- Only-Boss Manager requires authentication
- Token-based GitHub uploads (token in Only-Boss system)
- No sensitive data in `papers.json`

## 📞 Support

If you encounter issues:
1. Check browser console for errors
2. Verify GitHub repository structure
3. Test GitHub raw URL manually
4. Contact admin for Only-Boss access

---

**Last Updated**: February 11, 2026  
**System Version**: 2.0  
**Status**: ✅ Fully Operational
