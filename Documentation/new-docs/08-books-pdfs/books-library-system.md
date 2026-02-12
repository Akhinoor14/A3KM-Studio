---
title: "Books & PDFs Library System"
date: 2026-02-12
author: Md Akhinoor Islam
organization: A3KM Studio | Noor Academy
category: books-pdfs
tags: [books, pdfs, library, ebooks, engineering]
---

# Books & PDFs Library

## Digital Library System

আমার website এ **engineering books** এর complete library system আছে।

**Current Collection:**
- Total Books: **3**
- Categories: Engineering Design, CAD Software, Mechanical Engineering
- Format: PDF with metadata & preview

### Active Books:

1. **SolidWorks Essentials Training Manual**
   - File: `Content Studio/books-pdfs/solidworks-guide.pdf`
   - Size: 15.8 MB
   - Pages: 350+
   - Language: English
   - Topic: 3D CAD Design

2. **Engineering Drawing & Design Handbook**
   - File: `Content Studio/books-pdfs/engineering-drawing-handbook.pdf`
   - Size: 12.3 MB
   - Pages: 280+
   - Language: English/Bangla
   - Topic: Technical Drawing

3. **Arduino Project Handbook - Beginner to Advanced**
   - File: `Content Studio/books-pdfs/arduino-projects-handbook.pdf`
   - Size: 8.5 MB
   - Pages: 200+
   - Language: Bangla
   - Topic: Electronics & Embedded Systems

## Books Data Structure

### Main Data File:

**Location:** `Content Studio/books-pdfs/books.json`

```json
{
  "lastUpdated": "2026-02-12T00:00:00Z",
  "totalBooks": 3,
  "books": [
    {
      "id": "book-solidworks-001",
      "title": "SolidWorks Essentials Training Manual",
      "subtitle": "Complete Guide to 3D CAD Design",
      
      "author": "Multiple Authors",
      "publisher": "SolidWorks Corporation",
      "publishYear": 2023,
      "edition": "2023 Edition",
      "isbn": "978-1-234-56789-0",
      
      "description": "এই বইটিতে SolidWorks এর সম্পূর্ণ basics থেকে advanced features পর্যন্ত cover করা হয়েছে। Part design, assembly, drawing, simulation সব কিছু step-by-step শেখানো হয়েছে।",
      
      "language": "en",
      "pages": 350,
      "fileSize": "15.8 MB",
      "format": "PDF",
      
      "pdfFile": "/Content Studio/books-pdfs/solidworks-guide.pdf",
      "pdfUrl": "/Content%20Studio/books-pdfs/solidworks-guide.pdf",
      
      "coverImage": "/Content Studio/books-pdfs/covers/solidworks-cover.jpg",
      "thumbnail": "/Content Studio/books-pdfs/thumbnails/solidworks-thumb.png",
      
      "category": "CAD Software",
      "subcategory": "3D Design",
      "tags": ["SolidWorks", "CAD", "3D Modeling", "Engineering Design"],
      
      "topics": [
        "Part Design",
        "Assembly Modeling",
        "Technical Drawing",
        "Simulation & Analysis",
        "Sheet Metal Design",
        "Surface Modeling"
      ],
      
      "level": "Beginner to Advanced",
      "readingTime": "40 hours",
      
      "downloadCount": 125,
      "viewCount": 450,
      "rating": 4.5,
      "reviews": 12,
      
      "addedDate": "2024-01-15T00:00:00Z",
      "lastModified": "2024-01-15T00:00:00Z",
      
      "featured": true,
      "icon": "fa-book"
    },
    
    {
      "id": "book-drawing-002",
      "title": "Engineering Drawing & Design Handbook",
      "subtitle": "Technical Drawing for Engineers",
      
      "author": "Md Akhinoor Islam",
      "publisher": "A3KM Studio",
      "publishYear": 2024,
      "edition": "1st Edition",
      
      "description": "Engineering drawing এর complete guidebook। Orthographic projection, isometric view, sectional view, dimensioning সব কিছু বাংলা + English এ explain করা আছে।",
      
      "language": "bn-en",
      "pages": 280,
      "fileSize": "12.3 MB",
      "format": "PDF",
      
      "pdfFile": "/Content Studio/books-pdfs/engineering-drawing-handbook.pdf",
      "coverImage": "/Content Studio/books-pdfs/covers/drawing-cover.jpg",
      
      "category": "Mechanical Engineering",
      "subcategory": "Technical Drawing",
      "tags": ["Engineering Drawing", "Orthographic", "Isometric", "CAD"],
      
      "topics": [
        "Orthographic Projection",
        "Isometric Drawing",
        "Sectional Views",
        "Dimensioning",
        "GD&T Basics",
        "Assembly Drawings"
      ],
      
      "level": "Beginner",
      "readingTime": "30 hours",
      
      "downloadCount": 89,
      "viewCount": 320,
      "rating": 4.7,
      
      "featured": true
    },
    
    {
      "id": "book-arduino-003",
      "title": "Arduino Project Handbook",
      "subtitle": "Beginner to Advanced Projects in Bangla",
      
      "author": "Md Akhinoor Islam",
      "publisher": "Noor Academy",
      "publishYear": 2024,
      "edition": "1st Edition",
      
      "description": "Arduino দিয়ে 30+ projects। Beginner থেকে Advanced level পর্যন্ত সব। সম্পূর্ণ বাংলায় code explanation ও circuit diagram সহ।",
      
      "language": "bn",
      "pages": 200,
      "fileSize": "8.5 MB",
      "format": "PDF",
      
      "pdfFile": "/Content Studio/books-pdfs/arduino-projects-handbook.pdf",
      "coverImage": "/Content Studio/books-pdfs/covers/arduino-cover.jpg",
      
      "category": "Electronics",
      "subcategory": "Embedded Systems",
      "tags": ["Arduino", "Electronics", "Projects", "IoT", "Sensors"],
      
      "topics": [
        "Arduino Basics",
        "LED & Sensors",
        "Motor Control",
        "LCD Display",
        "Bluetooth & WiFi",
        "IoT Projects"
      ],
      
      "level": "Beginner to Advanced",
      "readingTime": "25 hours",
      
      "downloadCount": 234,
      "viewCount": 680,
      "rating": 4.9,
      "reviews": 28,
      
      "featured": true
    }
  ],
  
  "categories": [
    "CAD Software",
    "Mechanical Engineering",
    "Electronics",
    "Embedded Systems",
    "Manufacturing",
    "Engineering Mathematics"
  ]
}
```

## Books Manager (Admin)

**File:** `Only-boss/managers/books/books-manager-new.html`

### Manager Features:

**1. Upload New Book:**

```html
<div class="book-upload-form">
    <h2>Upload New Book</h2>
    
    <!-- Basic Info -->
    <section class="form-section">
        <h3>Book Information</h3>
        
        <div class="form-row">
            <div class="form-group">
                <label>Title *</label>
                <input type="text" id="book-title" required>
            </div>
            
            <div class="form-group">
                <label>Subtitle</label>
                <input type="text" id="book-subtitle">
            </div>
        </div>
        
        <div class="form-row">
            <div class="form-group">
                <label>Author *</label>
                <input type="text" id="book-author" required>
            </div>
            
            <div class="form-group">
                <label>Publisher</label>
                <input type="text" id="book-publisher">
            </div>
        </div>
        
        <div class="form-row">
            <div class="form-group">
                <label>Publish Year</label>
                <input type="number" id="publish-year" min="1900" max="2030">
            </div>
            
            <div class="form-group">
                <label>Edition</label>
                <input type="text" id="book-edition" placeholder="1st Edition">
            </div>
        </div>
        
        <div class="form-group">
            <label>ISBN (Optional)</label>
            <input type="text" id="book-isbn" placeholder="978-1-234-56789-0">
        </div>
        
        <div class="form-group">
            <label>Description *</label>
            <textarea id="book-description" rows="4" required></textarea>
        </div>
    </section>
    
    <!-- Category & Tags -->
    <section class="form-section">
        <h3>Category & Tags</h3>
        
        <div class="form-group">
            <label>Category</label>
            <select id="book-category" required>
                <option value="">Select Category</option>
                <option value="CAD Software">CAD Software</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="Electronics">Electronics</option>
                <option value="Embedded Systems">Embedded Systems</option>
                <option value="Manufacturing">Manufacturing</option>
            </select>
        </div>
        
        <div class="form-group">
            <label>Tags (comma separated)</label>
            <input type="text" id="book-tags" placeholder="Arduino, IoT, Sensors">
        </div>
        
        <div class="form-group">
            <label>Topics Covered (one per line)</label>
            <textarea id="book-topics" rows="6" placeholder="Arduino Basics&#10;LED Control&#10;Sensor Integration"></textarea>
        </div>
    </section>
    
    <!-- Book Details -->
    <section class="form-section">
        <h3>Book Details</h3>
        
        <div class="form-row">
            <div class="form-group">
                <label>Language</label>
                <select id="book-language">
                    <option value="en">English</option>
                    <option value="bn">Bangla</option>
                    <option value="bn-en">Bangla + English</option>
                </select>
            </div>
            
            <div class="form-group">
                <label>Level</label>
                <select id="book-level">
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Beginner to Advanced">Beginner to Advanced</option>
                </select>
            </div>
        </div>
        
        <div class="form-row">
            <div class="form-group">
                <label>Total Pages</label>
                <input type="number" id="book-pages" min="1">
            </div>
            
            <div class="form-group">
                <label>Est. Reading Time</label>
                <input type="text" id="reading-time" placeholder="25 hours">
            </div>
        </div>
    </section>
    
    <!-- PDF Upload -->
    <section class="form-section">
        <h3>PDF File *</h3>
        
        <div class="file-upload-area" id="pdf-drop-zone">
            <i class="fas fa-file-pdf"></i>
            <p>Drag & drop PDF here or click to browse</p>
            <p class="size-limit">Max size: 50 MB</p>
            <input type="file" id="pdf-file-input" accept=".pdf" hidden>
        </div>
        
        <div id="pdf-file-preview" class="hidden">
            <div class="file-info">
                <i class="fas fa-file-pdf"></i>
                <div class="file-details">
                    <span class="filename"></span>
                    <span class="filesize"></span>
                    <div class="upload-progress">
                        <div class="progress-bar"></div>
                        <span class="progress-text">0%</span>
                    </div>
                </div>
                <button class="remove-file"><i class="fas fa-times"></i></button>
            </div>
        </div>
    </section>
    
    <!-- Cover Image Upload -->
    <section class="form-section">
        <h3>Cover Image (Optional)</h3>
        
        <div class="cover-upload-area">
            <div class="cover-preview" id="cover-preview">
                <i class="fas fa-image"></i>
                <p>Click to upload cover image</p>
                <input type="file" id="cover-image-input" accept="image/*" hidden>
            </div>
            <p class="info">If not provided, first page of PDF will be used</p>
        </div>
    </section>
    
    <!-- Submit -->
    <div class="form-actions">
        <button class="btn-cancel">Cancel</button>
        <button class="btn-save-draft">Save as Draft</button>
        <button class="btn-publish" id="publish-book">Publish Book</button>
    </div>
</div>
```

### Upload Handler:

```javascript
class BooksManager {
    
    async uploadBook() {
        // Validate form
        if (!this.validateForm()) {
            return;
        }
        
        // Collect book data
        const bookData = {
            id: this.generateBookID(),
            title: document.getElementById('book-title').value,
            subtitle: document.getElementById('book-subtitle').value,
            author: document.getElementById('book-author').value,
            publisher: document.getElementById('book-publisher').value,
            publishYear: parseInt(document.getElementById('publish-year').value),
            edition: document.getElementById('book-edition').value,
            isbn: document.getElementById('book-isbn').value,
            description: document.getElementById('book-description').value,
            
            category: document.getElementById('book-category').value,
            subcategory: document.getElementById('book-subcategory')?.value || '',
            tags: document.getElementById('book-tags').value.split(',').map(t => t.trim()),
            topics: document.getElementById('book-topics').value.split('\n').filter(t => t.trim()),
            
            language: document.getElementById('book-language').value,
            level: document.getElementById('book-level').value,
            pages: parseInt(document.getElementById('book-pages').value),
            readingTime: document.getElementById('reading-time').value,
            
            downloadCount: 0,
            viewCount: 0,
            rating: 0,
            reviews: 0,
            
            addedDate: new Date().toISOString(),
            featured: false,
            icon: 'fa-book'
        };
        
        // Upload PDF
        const pdfFile = document.getElementById('pdf-file-input').files[0];
        if (!pdfFile) {
            alert('Please select a PDF file');
            return;
        }
        
        // Check file size (max 50 MB)
        if (pdfFile.size > 50 * 1024 * 1024) {
            alert('PDF file too large! Max 50 MB allowed.');
            return;
        }
        
        bookData.fileSize = this.formatFileSize(pdfFile.size);
        
        // Show progress
        this.showUploadProgress(true);
        
        try {
            // Read PDF as base64
            const pdfBase64 = await this.readFileAsBase64(pdfFile);
            
            // Upload to GitHub
            const pdfPath = `Content Studio/books-pdfs/${bookData.id}.pdf`;
            await this.uploadToGitHub(pdfPath, pdfBase64, (progress) => {
                this.updateProgress(progress);
            });
            
            bookData.pdfFile = `/${pdfPath}`;
            bookData.pdfUrl = `/${pdfPath.replace(/ /g, '%20')}`;
            
            // Upload cover image (if provided)
            const coverFile = document.getElementById('cover-image-input').files[0];
            if (coverFile) {
                const coverBase64 = await this.readFileAsBase64(coverFile);
                const coverPath = `Content Studio/books-pdfs/covers/${bookData.id}-cover.jpg`;
                await this.uploadToGitHub(coverPath, coverBase64);
                bookData.coverImage = `/${coverPath}`;
            } else {
                // Generate thumbnail from PDF first page
                const thumbnail = await this.generatePDFThumbnail(pdfFile);
                const thumbPath = `Content Studio/books-pdfs/covers/${bookData.id}-cover.png`;
                await this.uploadToGitHub(thumbPath, thumbnail);
                bookData.coverImage = `/${thumbPath}`;
            }
            
            // Update books.json
            await this.updateBooksJSON(bookData);
            
            alert('✅ Book uploaded successfully!');
            window.location.reload();
            
        } catch (error) {
            console.error('Upload failed:', error);
            alert('❌ Upload failed: ' + error.message);
        } finally {
            this.showUploadProgress(false);
        }
    }
    
    generateBookID() {
        const prefix = 'book';
        const category = document.getElementById('book-category').value
            .toLowerCase().replace(/ /g, '-');
        const timestamp = Date.now().toString().slice(-6);
        return `${prefix}-${category}-${timestamp}`;
    }
    
    formatFileSize(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }
    
    async generatePDFThumbnail(pdfFile) {
        // Use PDF.js to render first page
        const pdf = await pdfjsLib.getDocument(URL.createObjectURL(pdfFile)).promise;
        const page = await pdf.getPage(1);
        
        const scale = 2;
        const viewport = page.getViewport({ scale });
        
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        
        await page.render({
            canvasContext: canvas.getContext('2d'),
            viewport: viewport
        }).promise;
        
        // Convert to base64
        return canvas.toDataURL('image/png').split(',')[1];
    }
}
```

## Books Library (Public View)

**File:** `Content Studio/books-pdfs/books-library.html`

### Library Interface:

```html
<div class="books-library">
    <!-- Header -->
    <header class="library-header">
        <h1><i class="fas fa-book-open"></i> Engineering Books Library</h1>
        <p>Free engineering books & resources in Bangla & English</p>
    </header>
    
    <!-- Search & Filter -->
    <div class="library-controls">
        <div class="search-box">
            <i class="fas fa-search"></i>
            <input type="text" id="search-books" placeholder="Search books by title, author, topic...">
        </div>
        
        <div class="filter-controls">
            <select id="category-filter">
                <option value="all">All Categories</option>
                <option value="CAD Software">CAD Software</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="Electronics">Electronics</option>
                <option value="Embedded Systems">Embedded Systems</option>
            </select>
            
            <select id="language-filter">
                <option value="all">All Languages</option>
                <option value="en">English</option>
                <option value="bn">Bangla</option>
                <option value="bn-en">Bangla + English</option>
            </select>
            
            <select id="sort-books">
                <option value="recent">Recently Added</option>
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="title">Title (A-Z)</option>
            </select>
        </div>
    </div>
    
    <!-- Books Grid -->
    <div class="books-grid">
        <div class="book-card" data-book-id="book-solidworks-001">
            <div class="book-cover">
                <img src="/Content Studio/books-pdfs/covers/solidworks-cover.jpg" 
                     alt="SolidWorks Essentials"
                     loading="lazy">
                <div class="featured-badge">Featured</div>
            </div>
            
            <div class="book-info">
                <h3 class="book-title">SolidWorks Essentials Training Manual</h3>
                <p class="book-author">Multiple Authors</p>
                
                <div class="book-meta">
                    <span class="category-badge">CAD Software</span>
                    <span class="language-badge">English</span>
                </div>
                
                <p class="book-description">Complete guide to 3D CAD design...</p>
                
                <div class="book-stats">
                    <span><i class="fas fa-file-pdf"></i> 350 pages</span>
                    <span><i class="fas fa-star"></i> 4.5 (12 reviews)</span>
                    <span><i class="fas fa-download"></i> 125 downloads</span>
                </div>
                
                <div class="book-actions">
                    <button class="btn-view" onclick="viewBook('book-solidworks-001')">
                        <i class="fas fa-eye"></i> Read Online
                    </button>
                    <button class="btn-download" onclick="downloadBook('book-solidworks-001')">
                        <i class="fas fa-download"></i> Download
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>
```

## Book Viewer/Reader

**File:** `Content Studio/books-pdfs/book-viewer.html`

### Viewer Features:

```html
<div class="book-viewer">
    <!-- Book Header -->
    <header class="book-header">
        <button class="back-button" onclick="history.back()">
            <i class="fas fa-arrow-left"></i> Back to Library
        </button>
        
        <div class="book-title-section">
            <h1>SolidWorks Essentials Training Manual</h1>
            <p class="book-meta">by Multiple Authors | 350 pages | 15.8 MB</p>
        </div>
        
        <div class="book-actions">
            <button class="btn-download"><i class="fas fa-download"></i> Download</button>
            <button class="btn-bookmark"><i class="far fa-bookmark"></i> Bookmark</button>
        </div>
    </header>
    
    <!-- PDF Viewer --> 
    <div class="pdf-viewer-container">
        <div class="pdf-controls">
            <button id="prev-page"><i class="fas fa-chevron-left"></i></button>
            <span class="page-info">Page <span id="current-page">1</span> / <span id="total-pages">350</span></span>
            <button id="next-page"><i class="fas fa-chevron-right"></i></button>
            
            <div class="zoom-controls">
                <button id="zoom-out"><i class="fas fa-search-minus"></i></button>
                <span id="zoom-level">100%</span>
                <button id="zoom-in"><i class="fas fa-search-plus"></i></button>
            </div>
            
            <button id="fullscreen"><i class="fas fa-expand"></i> Fullscreen</button>
        </div>
        
        <div class="pdf-display">
            <canvas id="pdf-canvas"></canvas>
        </div>
    </div>
</div>
```

---

**শেষ Update:** 2026-02-12  
**Total Books:** 3 📚
