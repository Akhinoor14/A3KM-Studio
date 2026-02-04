# 📝 PDF Lecture Upload - Quick Reference

## 🎯 For Managers

### Upload New Course with PDFs

1. **Add Episode** → Fill details
2. **Choose File** → Select PDF (accept only .pdf)
3. **Preview** → See filename & size
4. **Save Episode** → PDF marked "⏳ Pending"
5. **Upload Course** → All PDFs uploaded automatically to:
   ```
   Content Storage/educational-videos/[category]/[course-id]/lectures/
   ```

### Storage Path Example
```
Content Storage/
  educational-videos/
    Arduino & IoT/
      course-1704067200000/
        lectures/
          lecture-1-introduction-slides.pdf
          lecture-2-basic-components.pdf
          lecture-3-programming-basics.pdf
```

---

## 👁️ For Students

### View PDF
- Click **👁️ View** → Opens in browser tab
- Read online with browser PDF reader
- Zoom, search, print available

### Download PDF
- Click **⬇️ Download** → Saves to device
- Access offline anytime
- Open with any PDF reader

---

## 📊 Episode Display

### Upload Mode (Before submission)
```
Episode 1: Introduction to Arduino
⏱️ 15:30 | 🎬 video-001
📝 PDF: intro-slides.pdf (128 KB) - ⏳ Pending Upload
[⬆️] [⬇️] [✏️] [🗑️]
```

### Edit Mode (After upload)
```
Episode 1: Introduction to Arduino
⏱️ 15:30 | 🎬 video-001
📝 PDF: intro-slides.pdf (128 KB) 👁️ View ⬇️ Download
[⬆️] [⬇️] [✏️] [🗑️]
```

---

## ✨ Features

✅ **File Type**: PDF only  
✅ **Preview**: Name + Size shown immediately  
✅ **Auto Upload**: When course submitted  
✅ **View Online**: Browser PDF reader  
✅ **Download**: Direct save to device  
✅ **Edit Support**: Replace/update PDFs  
✅ **Status Tracking**: Pending → Ready  

---

## 🔧 Technical

### Episode Object with PDF
```json
{
  "episodeNo": 1,
  "title": "Introduction",
  "lecturePdf": {
    "fileName": "lecture-1-intro.pdf",
    "path": "Content Storage/educational-videos/.../lecture-1-intro.pdf",
    "downloadUrl": "https://raw.githubusercontent.com/.../lecture-1-intro.pdf",
    "size": 524288,
    "uploadDate": "2024-01-01T12:00:00.000Z"
  }
}
```

### Upload Function
```javascript
uploadLecturePdf(courseId, category, episodeNo, pdfFile)
  → Returns: { fileName, path, downloadUrl, size, uploadDate }
```

---

## 📱 UI Colors

| Status | Color | Icon |
|--------|-------|------|
| Available | 🟢 Green (#00897B) | 📝 ✅ |
| Pending | 🟠 Orange (#FFA726) | ⏳ |
| YouTube | 🔵 Blue (#2196F3) | 📺 |
| Tags | 🔴 Red (#8B0000) | 🏷️ |

---

## ⚡ Quick Tips

**Best File Size**: 100-500 KB  
**Max Recommended**: 5 MB  
**Format**: PDF only  
**Naming**: Automatic `lecture-N-[filename].pdf`  
**Storage**: GitHub repository  
**Access**: Global CDN delivery  

---

## 🎓 Use Cases

✅ Lecture slides/notes  
✅ Study materials  
✅ Exercise sheets  
✅ Reference documents  
✅ Assignment PDFs  
✅ Code examples  

---

**Status**: ✅ Production Ready  
**File**: `educational-videos-manager.html`  
**Lines Modified**: ~12 functions updated
