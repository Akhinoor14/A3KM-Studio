# Books Folder Structure Migration Guide

## 📋 Overview

তোমার Books Upload System এ এখন **Folder-Based Structure** implement করা হয়েছে!

### কেন এই পরিবর্তন?

**পুরনো Structure (Flat - ❌):**
```
Content Storage/books-pdfs/
├── ai-prompt-engineering-module-1-1772395856111.pdf  ❌ খোলামেলা
└── covers/
    └── ai-prompt-engineering-module-1-1772395870677-thumbnail.jpg  ❌ আলাদা
```

**নতুন Structure (Folder-Based - ✅):**
```
Content Storage/books-pdfs/
└── ai-prompt-engineering-module-1-1772395856111/  ✅ নিজস্ব folder
    ├── book.pdf
    ├── cover.jpg
    └── thumbnail.jpg
```

### Benefits:

1. ✅ **Organization**: প্রতিটা book এর সব কিছু এক জায়গায়
2. ✅ **Maintainability**: কোন book delete করতে হলে শুধু folder delete
3. ✅ **Scalability**: 1000টা book হলেও organized থাকবে
4. ✅ **Version Control**: একই book এর updated version রাখা যাবে
5. ✅ **Auto Data Sync**: books.json automatically sync হবে

---

## 🚀 নতুন Upload Process

### এখন থেকে Books Manager থেকে upload করলে:

1. **Book Folder Create হবে:**
   - Format: `{book-title}-{book-id}/`
   - Example: `ai-prompt-engineering-module-1-1772395856111/`

2. **Files Upload হবে:**
   - `book.pdf` - Main PDF file
   - `cover.jpg` - Cover image  
   - `thumbnail.jpg` - Thumbnail (same as cover if not separate)

3. **books.json Update হবে:**
   ```json
   {
     "id": "book-1772395856111",
     "title": "AI & PROMPT ENGINEERING",
     "downloadUrl": "https://raw.githubusercontent.com/.../book.pdf",
     "cover": "https://raw.githubusercontent.com/.../cover.jpg",
     "thumbnail": "https://raw.githubusercontent.com/.../thumbnail.jpg",
     "folderPath": "Content Storage/books-pdfs/ai-prompt-engineering-module-1-1772395856111"
   }
   ```

---

## 🔄 Existing Books Migration

### Option 1: Automatic Migration (Recommended)

1. **Open Books Manager:**
   ```
   Only-boss/managers/Content-studio/books-manager-new.html
   ```

2. **Open Browser Console (F12)**

3. **Load Migration Script:**
   ```html
   <!-- Add to Books Manager HTML, before </body> -->
   <script src="migrate-books-to-folders.js"></script>
   ```

4. **Run Migration:**
   ```javascript
   const migrator = new BooksMigrationTool();
   await migrator.migrateAllBooks();
   ```

5. **Verify:**
   - Check GitHub: `Content Storage/books-pdfs/` এ folders দেখবে
   - Check books.json: নতুন paths দেখবে
   - Test: Book listing page এ covers show করছে কিনা

6. **Cleanup (Optional):**
   ```javascript
   // Old files delete করার আগে নতুন structure verify করো!
   await migrator.cleanupOldFiles();
   ```

---

### Option 2: Manual Migration (Current Book)

**Current Book:** AI & PROMPT ENGINEERING: বাংলায় AI শেখা (MODULE 1)

#### Step 1: GitHub এ নতুন Folder তৈরি করো

```
Content Storage/books-pdfs/ai-prompt-engineering-module-1-book-1772395856111/
```

#### Step 2: Files Move করো

**Old Locations:**
```
❌ Content Storage/books-pdfs/ai-prompt-engineering-ai-module-1-1772395856111.pdf
❌ Content Storage/books-pdfs/covers/ai-prompt-engineering-ai-module-1-1772395870677-thumbnail.jpg
```

**New Locations:**
```
✅ Content Storage/books-pdfs/ai-prompt-engineering-module-1-book-1772395856111/book.pdf
✅ Content Storage/books-pdfs/ai-prompt-engineering-module-1-book-1772395856111/cover.jpg
✅ Content Storage/books-pdfs/ai-prompt-engineering-module-1-book-1772395856111/thumbnail.jpg
```

#### Step 3: books.json Update করো

**Old Entry:**
```json
{
  "id": "book-1772395856111",
  "title": "AI & PROMPT ENGINEERING: বাংলায় AI শেখা  (MODULE 1)",
  "downloadUrl": "https://raw.githubusercontent.com/.../ai-prompt-engineering-ai-module-1-1772395856111.pdf",
  "cover": null,  ❌ Missing!
  "thumbnail": null  ❌ Missing!
}
```

**New Entry:**
```json
{
  "id": "book-1772395856111",
  "title": "AI & PROMPT ENGINEERING: বাংলায় AI শেখা  (MODULE 1)",
  "downloadUrl": "https://raw.githubusercontent.com/Akhinoor14/A3KM-Studio/main/Content%20Storage/books-pdfs/ai-prompt-engineering-module-1-book-1772395856111/book.pdf",
  "cover": "https://raw.githubusercontent.com/Akhinoor14/A3KM-Studio/main/Content%20Storage/books-pdfs/ai-prompt-engineering-module-1-book-1772395856111/cover.jpg",
  "thumbnail": "https://raw.githubusercontent.com/Akhinoor14/A3KM-Studio/main/Content%20Storage/books-pdfs/ai-prompt-engineering-module-1-book-1772395856111/thumbnail.jpg",
  "folderPath": "Content Storage/books-pdfs/ai-prompt-engineering-module-1-book-1772395856111"
}
```

---

## ✅ Testing New Uploads

### Test করো নতুন Book Upload:

1. **Open Books Manager**
2. **Fill Book Info:**
   - Title: Test Book
   - Category: Arduino & Microcontrollers
   - Author: Your Name
   - Pages, Size, Format

3. **Upload Files:**
   - PDF File: Select your PDF
   - Cover Image: Select cover (SVG/JPG/PNG)
   
4. **Click Upload**

5. **Verify Structure:**
   ```
   Go to GitHub:
   Content Storage/books-pdfs/test-book-{id}/
   ├── book.pdf  ✅
   ├── cover.jpg  ✅
   └── thumbnail.jpg  ✅
   ```

6. **Check books.json:**
   ```json
   {
     "downloadUrl": ".../test-book-{id}/book.pdf",
     "cover": ".../test-book-{id}/cover.jpg",
     "folderPath": "Content Storage/books-pdfs/test-book-{id}"
   }
   ```

---

## 🔧 Troubleshooting

### Cover দেখাচ্ছে না?

**Check:**
1. books.json এ `cover` field আছে কিনা
2. GitHub এ `cover.jpg` file আছে কিনা
3. URL ঠিক আছে কিনা (spaces encoded: `%20`)

**Fix:**
```javascript
// Console এ:
const booksJson = await fetch('Content Studio/books-pdfs/books.json').then(r => r.json());
console.log(booksJson.books[0].cover);  // Should be GitHub raw URL
```

### Upload করার পরও old structure?

**Check:**
1. Browser cache clear করেছো কিনা (Ctrl+Shift+R)
2. github-content-uploader.js latest version load হয়েছে কিনা
3. Token valid আছে কিনা

---

## 📊 Summary

### ✅ Completed:
- [x] Upload system updated to folder-based structure
- [x] Each book gets own folder
- [x] Standardized filenames (book.pdf, cover.jpg, thumbnail.jpg)
- [x] books.json includes folderPath for easy management
- [x] Migration script created

### 🎯 Next Steps:
1. Use migration script to move existing book
2. Test new upload with dummy book
3. Verify cover display on book-listing page
4. Delete old files after verification

---

## 🌟 Benefits Achieved

| Feature | Before | After |
|---------|--------|-------|
| Organization | ❌ Flat, messy | ✅ Folder-based, clean |
| Scalability | ❌ Hard with 100+ books | ✅ Easy with 1000+ books |
| Maintenance | ❌ Find & delete multiple files | ✅ Delete one folder |
| Version Control | ❌ Difficult | ✅ Easy |
| Cover Display | ❌ Missing paths | ✅ Automatic in folder |

---

**Author:** Md Akhinoor Islam  
**Date:** March 2, 2026  
**System:** A3KM Studio Books Manager
