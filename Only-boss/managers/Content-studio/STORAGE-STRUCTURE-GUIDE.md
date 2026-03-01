# 📊 GitHub Storage Architecture - Complete Guide

## Overview

**Problem Solved**: GitHub API was trying to create per-category folders that don't exist, causing 404 errors.

**Solution Implemented**: **Flat Storage Structure** with metadata-based organization.

---

## 📁 Storage Hierarchy

### Current Structure (After Fix)

```
GitHub Repository (Akhinoor14/A3KM-Studio)
│
├── Content Storage/
│   ├── books-pdfs/                          ✅ FLAT FOLDER (all books here)
│   │   ├── ai-prompt-engineering-1709XXX.pdf
│   │   ├── learning-docker-1709XXX.pdf
│   │   ├── quantum-mechanics-1709XXX.pdf
│   │   ├── covers/
│   │   │   ├── artificial-intelligence-cover.svg
│   │   │   ├── ai-prompt-engineering-1709XXX-thumbnail.jpg
│   │   │   ├── learning-docker-1709XXX-thumbnail.jpg
│   │   │   └── quantum-mechanics-1709XXX-thumbnail.jpg
│   │   └── .gitkeep
│   │
│   ├── educational-videos/
│   │   ├── covers/
│   │   └── .gitkeep
│   │
│   ├── research-papers/
│   │   ├── covers/
│   │   └── .gitkeep
│   │
│   └── vlogs/
│       └── .gitkeep
│
├── Content Studio/                          📋 METADATA STORAGE
│   ├── books-pdfs/
│   │   └── books.json                       ✅ Central metadata (ALL books)
│   │
│   ├── educational-videos/
│   │   └── educational-videos.json
│   │
│   ├── research-papers/
│   │   └── papers.json
│   │
│   └── video-content/
│       └── videos.json
│
```

### Why This Structure?

| Aspect | Old Way (Per-Category Folders) | New Way (Flat Structure) |
|--------|--------------------------------|--------------------------|
| **API Calls** | Create 215 category folders | Create 1 base folder |
| **Speed** | Slow (many 404 retries) | Fast (direct uploads) |
| **Reliability** | Fails if folders don't exist | Works reliably |
| **Scalability** | N×M operations (categories × files) | Linear (just files) |
| **Organization** | Filesystem-based | Metadata-based (JSON) |
| **Conflicts** | Can't have same filename in different categories | Use timestamps to avoid collisions |

---

## 📚 How Books are Organized

### JSON Storage (Content Studio/books-pdfs/books.json)

```json
{
  "books": [
    {
      "id": "book-1709123456789",
      "title": "AI & PROMPT ENGINEERING: বাংলায় AI শেখা (MODULE 1)",
      "author": "Md Akhinoor Islam",
      "category": "Artificial Intelligence",
      "summary": "<p><strong>সম্পূর্ণ গাইড</strong>...</p>",
      "downloadUrl": "https://raw.githubusercontent.com/Akhinoor14/A3KM-Studio/main/Content%20Storage/books-pdfs/ai-prompt-engineering-1709XXX.pdf",
      "cover": "https://raw.githubusercontent.com/Akhinoor14/A3KM-Studio/main/Content%20Storage/books-pdfs/covers/artificial-intelligence-cover.svg",
      "pages": 320,
      "format": "PDF",
      "language": "bn",
      "size": "2.5 MB",
      "downloads": 0,
      "date": "2025-03-01",
      "tags": ["AI", "Prompt", "Bengali"]
    },
    {
      "id": "book-1709223456789",
      "title": "Learning Docker: Container Essentials",
      "category": "Docker",
      "downloadUrl": "https://raw.githubusercontent.com/...",
      ...
    }
  ]
}
```

**Key Fields**:
- **id**: Unique identifier (book-{timestamp})
- **category**: Used for filtering in UI (categories.json loaded separately)
- **downloadUrl**: Points to actual PDF in `Content Storage/books-pdfs/`
- **cover**: Points to category SVG cover in `Content Storage/books-pdfs/covers/`
- **summary**: Rich HTML formatting (bold, colors, lists, etc.)
- **language**: For multi-language support (en, bn, hi, ar, ur)

---

## 🔄 Upload Flow

### Step-by-Step Process

```
1️⃣  USER SUBMITS FORM
    ├─ Title: "AI & PROMPT ENGINEERING"
    ├─ Category: "Artificial Intelligence"
    ├─ File: ai-book.pdf (5 MB)
    └─ Description: "<strong>Complete guide</strong>..."

2️⃣  BOOKS MANAGER GENERATES DATA
    ├─ contentId: "book-1709XXXXXXXXX" (timestamp-based)
    ├─ categorySlug: "artificial-intelligence"
    ├─ fileSlug: "ai-prompt-engineering" 
    └─ Generates SVG cover (if category doesn't have one)

3️⃣  GITHUB API UPLOADS
    
    ✅ FLAT STRUCTURE (NEW):
       ├─ Upload PDF → Content Storage/books-pdfs/ai-prompt-engineering-1709XXX.pdf
       ├─ Upload Cover SVG → Content Storage/books-pdfs/covers/artificial-intelligence-cover.svg
       ├─ Upload Thumbnail → Content Storage/books-pdfs/covers/ai-prompt-engineering-1709XXX-thumbnail.jpg
       └─ Update JSON → Content Studio/books-pdfs/books.json (adds entry)
    
    ❌ OLD STRUCTURE (FAILED):
       ├─ Check folder exists → GET .../artificial-intelligence/ (404)
       ├─ Create folder → POST (fails, no parent)
       ├─ Retry multiple times
       ├─ Finally error: "Not Found"
       └─ Upload fails ❌

4️⃣  METADATA UPDATED
    └─ books.json entry created with:
       - Title, Author, Category
       - Download URL (absolute GitHub raw URL)
       - Thumbnail path
       - HTML summary with formatting
       - All metadata (pages, format, language, size)

5️⃣  USER SEES SUCCESS ✅
    └─ Book appears in Books Manager "Manage" tab
       with category, description preview, badges
```

---

## 📊 File Naming Strategy

### To Avoid Collisions in Flat Structure

**PDF Files**: `{title-slug}-{timestamp}.{ext}`
- `ai-prompt-engineering-1709123456789.pdf`
- `learning-docker-1709223456789.pdf`
- `ai-prompt-engineering-1709323456789.pdf` (duplicate title, different timestamp)

**Thumbnails**: `{title-slug}-{timestamp}-thumbnail.jpg`
- `ai-prompt-engineering-1709123456789-thumbnail.jpg`

**Category Covers** (Shared): `{category-slug}-cover.svg`
- `artificial-intelligence-cover.svg` (shared by all AI books)
- `docker-cover.svg` (shared by all Docker books)

**Why Timestamps?**
- Multiple books can have same title
- Prevents overwriting existing files
- Unique identity per upload
- Easy to sort chronologically

---

## 🔧 Troubleshooting

### Issue: Upload Fails with 404

**Old Error**:
```
GET .../Content%20Storage/books-pdfs/artificial-intelligence?ref=main 404 (Not Found)
```

**New Behavior**: Skips folder creation for flat structures
```
✅ Using flat structure for books-pdfs: Content Storage/books-pdfs
✅ Content uploaded: Content Storage/books-pdfs/ai-prompt-engineering-1709XXX.pdf
```

### Issue: Duplicate Categories in Different Books

**Not a Problem!** 
- If 10 books have "Artificial Intelligence" category
- Covers folder has only 1 `artificial-intelligence-cover.svg`
- All 10 entries point to same cover in books.json
- No duplication in storage

### Issue: Books Not Appearing

**Checklist**:
1. ✅ Was upload completed successfully? (Check browser console)
2. ✅ Is books.json updated? (Check GitHub Content Studio/books-pdfs/)
3. ✅ Can you download the PDF? (Try the downloadUrl from browser)
4. ✅ Does book category match one of 215 categories? (Check categories in dropdown)

### Issue: Thumbnail/Cover Not Showing

**Check**:
1. Is `covers/` folder being created? (Yes, automatically with first image upload)
2. Are SVG/images uploading properly? (Check network in DevTools)
3. Are paths URL-encoded? (Spaces → %20)

---

## 🌐 API Endpoints Used

### GitHub REST API Calls

```javascript
// 1. Check if file exists
GET /repos/Akhinoor14/A3KM-Studio/contents/Content%20Storage/books-pdfs/books.json

// 2. Create folder (creates .gitkeep file)
PUT /repos/Akhinoor14/A3KM-Studio/contents/Content%20Storage/books-pdfs/.gitkeep
Content-Type: application/json
{
  "message": "Create folder",
  "content": "" // base64 empty
}

// 3. Upload PDF
PUT /repos/Akhinoor14/A3KM-Studio/contents/Content%20Storage/books-pdfs/ai-prompt-engineering-1709XXX.pdf
Content-Type: application/json
{
  "message": "Add AI & PROMPT ENGINEERING",
  "content": "{base64_encoded_pdf_data}"
}

// 4. Update books.json
PUT /repos/Akhinoor14/A3KM-Studio/contents/Content%20Studio/books-pdfs/books.json
Content-Type: application/json
{
  "message": "Update books.json - Add AI & PROMPT ENGINEERING",
  "content": "{base64_encoded_json_data}",
  "sha": "existing_file_sha"
}
```

### Important: Path Encoding

Each path segment must be URL-encoded:
```
Content Storage/books-pdfs/test.pdf
→ Content%20Storage/books-pdfs/test.pdf
→ Split: ["Content%20Storage", "books-pdfs", "test.pdf"]
```

---

## 📈 Monitoring & Maintenance

### Check Storage Status

```javascript
// In browser console:
await contentManager.loadContent('books-pdfs');

// Output shows:
// - Total books loaded: X
// - Categories represented: Y
// - Total file sizes
// - Date range
```

### Verify GitHub Folder Structure

```bash
# List all books
curl -H "Authorization: token YOUR_TOKEN" \
  https://api.github.com/repos/Akhinoor14/A3KM-Studio/contents/Content%20Storage/books-pdfs?ref=main

# Check books.json size
curl -H "Authorization: token YOUR_TOKEN" \
  https://raw.githubusercontent.com/Akhinoor14/A3KM-Studio/main/Content%20Studio/books-pdfs/books.json | wc -c
```

### Performance Metrics

| Metric | Value |
|--------|-------|
| Upload time (PDF, ~5MB) | 3-5 seconds |
| JSON update time | 1-2 seconds |
| Total per book | ~5 seconds |
| Concurrent uploads | 1 (sequential) |
| Storage limit | Unlimited (GitHub) |
| API rate limit | 5000/hour (with token) |

---

## 🎯 Best Practices

### ✅ DO:
- Use unique titles (or prepare for disambiguation)
- Keep descriptions HTML-clean (limited formatting)
- Use standard categories from dropdown
- Check upload success before closing tab
- Monitor GitHub repository size (free: 5GB limit)

### ❌ DON'T:
- Create category folders manually in GitHub
- Try to organize by filesystem folders
- Upload very large files (>100MB) without testing
- Edit books.json directly (use manager UI)
- Have multiple uploads happening simultaneously

---

## 🚀 Future Improvements

### Potential Enhancements
1. **Compression**: Compress PDFs before upload
2. **CDN**: Use GitHub Pages/CloudFlare for PDF serving
3. **Search Index**: Generate search index from books.json
4. **Analytics**: Track average downloads per category
5. **Versioning**: Support multiple versions of same book
6. **Tags**: Add per-book tags system
7. **Ratings**: Community book ratings system

---

## 📞 Support

**If upload fails:**
1. Check browser console (F12 → Console tab)
2. Copy error message
3. Check network requests (DevTools → Network)
4. Verify GitHub token is valid (Settings → API Config Check)
5. Check book form is fully filled out
6. Try a different category
7. Try a smaller test file

**Common Messages:**
- ✅ `Using flat structure for books-pdfs` → Normal, good sign
- ✅ `Content uploaded: ...` → File saved successfully
- ✅ `Category selected: ...` → Valid category detected
- ❌ `Category validation failed` → Category field is empty
- ❌ `Upload failed: Not Found` → GitHub path issue
- ❌ `GitHub token not set` → Need to configure token first

---

**Last Updated**: March 1, 2026  
**Version**: 2.0 (Flat Structure)  
**Status**: ✅ Production Ready
