# Mobile PDF & Document Viewer System

**Location:** `mobile/shared/pdf-viewer.js`

Universal mobile-optimized viewer for PDFs and images (JPG, PNG, etc.) with touch gestures, pinch-to-zoom, and download functionality.

---

## Features

✅ **Mobile-Optimized** - Fullscreen viewer designed for touch devices  
✅ **Multi-Format** - Supports PDF, JPG, PNG, JPEG, GIF, WebP  
✅ **Pinch-to-Zoom** - Image pinch-zoom support (1x to 4x)  
✅ **Double-Tap Reset** - Quick zoom reset for images  
✅ **Download** - One-tap download with proper filename  
✅ **Touch Gestures** - Optimized for mobile interaction  
✅ **Haptic Feedback** - Vibration feedback on interactions  
✅ **Theme Consistent** - Red/black/white engineering theme  
✅ **Auto File Detection** - Automatically detects file type  
✅ **Error Handling** - Fallback options if viewing fails  
✅ **Loading States** - Smooth loading animations  

---

## Installation

### 1. Add Script to Page

```html
<script src="../shared/pdf-viewer.js"></script>
<!-- or -->
<script src="../../shared/pdf-viewer.js"></script>
```

### 2. Open Viewer

```javascript
openMobilePDFViewer({
    filePath: '../../path/to/document.pdf',
    fileType: 'pdf',  // optional - auto-detected
    title: 'Document Title',
    downloadName: 'my-document.pdf',
    showDownload: true,
    allowZoom: true
});
```

---

## API Reference

### `openMobilePDFViewer(options)`

Opens document in fullscreen mobile viewer.

**Parameters:**

```javascript
{
    filePath: string,        // REQUIRED - Path to PDF/image file
    fileType: string,        // Optional - 'pdf', 'jpg', 'png' (auto-detected from extension)
    title: string,           // Optional - Viewer title (default: "Document Viewer")
    downloadName: string,    // Optional - Custom download filename
    showDownload: boolean,   // Optional - Show download button (default: true)
    allowZoom: boolean       // Optional - Allow pinch-to-zoom (default: true)
}
```

**Example:**

```javascript
openMobilePDFViewer({
    filePath: '../../About me/CERTIFICATES/Academic/HSC Certificate.jpg',
    title: 'HSC Certificate',
    downloadName: 'HSC_Certificate.jpg'
});
```

---

### `closeMobilePDFViewer()`

Closes the viewer programmatically.

```javascript
closeMobilePDFViewer();
```

---

### `downloadDocument(filePath, filename)`

Downloads document without opening viewer.

```javascript
downloadDocument('../../file.pdf', 'download-name.pdf');
```

---

## Usage Examples

### Certificate Viewer

```javascript
function viewCertificate(filePath, title) {
    const fileExt = filePath.split('.').pop().toLowerCase();
    
    openMobilePDFViewer({
        filePath: filePath,
        fileType: fileExt,
        title: `Certificate: ${title}`,
        downloadName: `${title.replace(/\s+/g, '_')}.${fileExt}`,
        showDownload: true,
        allowZoom: true
    });
}
```

### Book Reader

```javascript
function openBook(book) {
    openMobilePDFViewer({
        filePath: book.pdfUrl,
        fileType: 'pdf',
        title: book.title,
        downloadName: `${book.title.replace(/[^a-z0-9]/gi, '_')}.pdf`,
        showDownload: true
    });
}
```

### Research Paper

```javascript
function viewPaper(paper) {
    openMobilePDFViewer({
        filePath: paper.pdfUrl || paper.fileUrl,
        title: paper.title,
        downloadName: `${paper.id}_paper.pdf`,
        showDownload: true
    });
}
```

---

## Integration Guide

### Certificates Viewer

**File:** `mobile/about/certificates-viewer.html`

```javascript
function viewCertificate(filePath) {
    if (!filePath) return;
    
    const fileExt = filePath.split('.').pop().toLowerCase();
    
    openMobilePDFViewer({
        filePath: filePath,
        fileType: fileExt,
        title: 'Certificate Viewer',
        downloadName: `certificate.${fileExt}`,
        showDownload: true,
        allowZoom: true
    });
}
```

### Book Reader

**File:** `mobile/content-studio/books-pdfs/book-reader.js`

```javascript
function loadPDFViewer() {
    // Show preview with Read button
    const openPDFBtn = document.getElementById('openPDFBtn');
    openPDFBtn.addEventListener('click', () => {
        openMobilePDFViewer({
            filePath: currentBook.pdfUrl,
            fileType: 'pdf',
            title: currentBook.title,
            downloadName: `${currentBook.title.replace(/[^a-z0-9]/gi, '_')}.pdf`,
            showDownload: true,
            allowZoom: true
        });
    });
}
```

### Paper Viewer

**File:** `mobile/content-studio/research-papers/paper-viewer.html`

Similar integration - add script and call `openMobilePDFViewer()` when user wants to view PDF.

---

## Touch Gestures

### Images
- **Pinch**: Zoom in/out (1x to 4x scale)
- **Double-tap**: Reset zoom to 1x
- **Swipe**: Scroll within zoomed image

### PDFs
- **Swipe**: Scroll through PDF pages
- **Tap buttons**: Navigate controls

---

## Styling

The viewer automatically matches the site's engineering theme:

- **Background**: Black with red gradient `rgba(0,0,0,0.98)` → `rgba(20,0,0,0.95)`
- **Accent**: Red `#CD5C5C`
- **Borders**: `rgba(205,92,92,0.3-0.5)`
- **Buttons**: Red gradient with inset shadows
- **Animations**: Slide-up entrance, slide-down exit

---

## Browser Compatibility

✅ **iOS Safari** - Full support with pinch-zoom  
✅ **Chrome Mobile** - Full support  
✅ **Firefox Mobile** - Full support  
✅ **Samsung Internet** - Full support  

**PDF Viewing Notes:**
- Uses native browser PDF rendering (iframe)
- Falls back to download/open-in-browser if unsupported
- Images always work with full functionality

---

## File Structure

```
mobile/
├── shared/
│   └── pdf-viewer.js          # Main viewer script
├── about/
│   └── certificates-viewer.html   # Uses viewer
├── content-studio/
│   ├── books-pdfs/
│   │   └── book-reader.html       # Uses viewer
│   └── research-papers/
│       └── paper-viewer.html      # Uses viewer
└── test-pdf-viewer.html           # Test page
```

---

## Testing

Open `mobile/test-pdf-viewer.html` to test:
- PDF viewing
- Image viewing with pinch-zoom
- Certificate viewing
- Download functionality

---

## Troubleshooting

### PDF not displaying
- Check file path is correct
- Verify PDF is accessible
- Try fallback: open in new tab or download

### Images not loading
- Verify image path and file exists
- Check image format is supported (jpg, png, gif, webp)
- Use browser dev tools to check for 404 errors

### Zoom not working
- Ensure `allowZoom: true` is set
- Check if image is loaded (not placeholder icon)
- Test on actual mobile device (not desktop emulator)

### Download not working
- Verify `showDownload: true` is set
- Check file path is accessible
- Ensure proper CORS headers if cross-origin

---

## Future Enhancements

🔄 PDF.js integration for better PDF rendering  
🔄 Page navigation for multi-page PDFs  
🔄 Text selection in PDFs  
🔄 Annotation support  
🔄 Bookmark/save reading progress  
🔄 Share functionality  

---

## Global Functions

After loading `pdf-viewer.js`, these functions are available globally:

```javascript
window.openMobilePDFViewer(options)
window.closeMobilePDFViewer()
window.downloadDocument(filePath, filename)
window.MobilePDFViewer  // State object
```

---

## Support

For issues or questions:
- Check browser console for errors
- Verify file paths are correct
- Test with `test-pdf-viewer.html`
- Ensure script is loaded before calling functions

---

**Version:** 1.0  
**Last Updated:** February 2026  
**Author:** Akhinoor Kaiser (A3KM Studio)
