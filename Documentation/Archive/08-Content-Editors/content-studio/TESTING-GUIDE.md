# 🧪 UPLOAD SYSTEM TESTING GUIDE

**Purpose:** Verify complete upload functionality  
**Time Required:** 15-20 minutes  
**Status:** Ready to test

---

## 🎯 TEST PLAN

### **Test Coverage:**
1. ✅ GitHub Connection
2. ✅ Book Upload (PDF + thumbnail)
3. ✅ Video Upload (YouTube URL)
4. ✅ Paper Upload
5. ✅ Post Upload
6. ✅ Error Handling
7. ✅ Folder Structure Verification

---

## TEST 1: GitHub Connection ✅

**Purpose:** Verify GitHub API access

### **Steps:**
1. Open `upload-interface.html` in browser
2. Open Console (F12)
3. Look for connection message

### **Expected Result:**
```
🔄 Testing GitHub connection...
✅ GitHub connected: Akhinoor14/A3KM-Studio
```

### **If Failed:**
- Check token configuration
- Verify token has `repo` scope
- Check internet connection

**Status:** [ ] Pass [ ] Fail

---

## TEST 2: Arduino Book Upload 📚

**Purpose:** Test complete PDF upload workflow

### **Test Data:**
- **Content Type:** Books & PDFs
- **Category:** Arduino & Microcontrollers
- **Title:** "Test Arduino Book"
- **Description:** "Testing Arduino content upload"
- **Tags:** `arduino, test, electronics`
- **Content File:** Any PDF (test.pdf)
- **Thumbnail:** Any JPG (400×500px recommended)

### **Steps:**
1. Select "Books & PDFs"
2. Choose "Arduino & Microcontrollers"
3. Upload PDF file
4. Upload thumbnail
5. Fill metadata
6. Click "Upload Content"
7. Wait for completion

### **Expected Results:**
```
Progress Bar:
✅ 10% - Generating category cover...
✅ 30% - Uploading to GitHub...
✅ 60% - Uploading files...
✅ 85% - Updating JSON...
✅ 100% - Upload complete!

Success Message:
"✅ Content uploaded successfully!"

Content ID Generated:
"books-pdfs-1737619200000" (or similar)
```

### **Verify on GitHub:**

**Check Folder Structure:**
```
Content Storage/books-pdfs/arduino-microcontrollers/
├── cover.svg ← Should exist (premium design)
└── books-pdfs-{timestamp}/
    ├── content.pdf ← Your PDF
    ├── thumbnail.jpg ← Your image
    └── metadata.json ← JSON file
```

**Check JSON Update:**
```
Content Studio/books-pdfs/books.json

Should contain new entry:
{
  "id": "books-pdfs-{timestamp}",
  "title": "Test Arduino Book",
  "category": "Arduino & Microcontrollers",
  ...
}
```

**Status:** [ ] Pass [ ] Fail

---

## TEST 3: YouTube Video Upload 🎥

**Purpose:** Test YouTube URL handling

### **Test Data:**
- **Content Type:** Educational Videos
- **Category:** Arduino & Microcontrollers
- **Toggle:** ✅ YouTube Content
- **YouTube URL:** `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
- **Title:** "Test Arduino Tutorial"
- **Description:** "Testing YouTube integration"
- **Tags:** `arduino, tutorial, youtube`

### **Steps:**
1. Select "Educational Videos"
2. Choose category
3. Toggle "YouTube Content"
4. Paste YouTube URL
5. Fill metadata
6. Click "Upload Content"

### **Expected Results:**
```
✅ YouTube ID extracted: "dQw4w9WgXcQ"
✅ Thumbnail auto-fetched
✅ Metadata uploaded
✅ JSON updated
```

### **Verify on GitHub:**
```
Content Storage/educational-videos/{category}/
└── educational-videos-{timestamp}/
    ├── thumbnail.jpg ← From YouTube
    └── metadata.json ← Contains youtubeId
```

**Status:** [ ] Pass [ ] Fail

---

## TEST 4: Category Cover Generation 🎨

**Purpose:** Test SVG cover auto-generation

### **Test:**
Upload to a **new category** (one without existing content)

### **Expected Result:**
1. System creates category folder
2. `cover.svg` generated automatically
3. Premium design with:
   - Category name
   - Gradient background
   - Domain-specific icon
   - Professional styling

### **Verify:**
1. Open `cover.svg` in browser
2. Check visual quality
3. Verify category name displayed
4. Confirm gradient colors match domain

**Status:** [ ] Pass [ ] Fail

---

## TEST 5: Error Handling ❌

**Purpose:** Test system resilience

### **Test 5.1: Missing Token**
1. Remove/comment GitHub token
2. Try to upload
3. **Expected:** "GitHub token not configured" alert

**Status:** [ ] Pass [ ] Fail

---

### **Test 5.2: Invalid File Type**
1. Try to upload `.exe` or `.zip` file
2. **Expected:** File type validation error

**Status:** [ ] Pass [ ] Fail

---

### **Test 5.3: Missing Required Fields**
1. Leave title blank
2. Try to upload
3. **Expected:** Form validation error

**Status:** [ ] Pass [ ] Fail

---

### **Test 5.4: Network Failure Simulation**
1. Disconnect internet mid-upload
2. **Expected:** Error message + retry suggestion

**Status:** [ ] Pass [ ] Fail

---

## TEST 6: Multiple Uploads ↗️

**Purpose:** Test consecutive uploads

### **Steps:**
1. Upload Book (wait for completion)
2. Upload Video (wait for completion)
3. Upload Paper (wait for completion)

### **Expected:**
- ✅ All complete successfully
- ✅ No interference between uploads
- ✅ Progress resets between uploads
- ✅ Form clears after each

**Status:** [ ] Pass [ ] Fail

---

## TEST 7: Large File Upload 📦

**Purpose:** Test file size handling

### **Test Data:**
- Large PDF (20-50MB)

### **Expected:**
- ✅ Upload progresses smoothly
- ✅ Base64 conversion succeeds
- ✅ GitHub accepts file
- ⚠️ Takes longer (2-3 minutes)

**Status:** [ ] Pass [ ] Fail

---

## TEST 8: Special Characters 🔤

**Purpose:** Test filename sanitization

### **Test:**
Upload file with special characters:
- `Test@File#Name$.pdf`

### **Expected:**
- ✅ Filename sanitized to `test-file-name.pdf`
- ✅ Upload succeeds
- ✅ No errors

**Status:** [ ] Pass [ ] Fail

---

## TEST 9: JSON Data Integrity 📝

**Purpose:** Verify JSON structure

### **After 3-4 Test Uploads:**

**Check `books.json`:**
```json
[
  {
    "id": "books-pdfs-1737619200000",
    "title": "Test Arduino Book",
    "category": "Arduino & Microcontrollers",
    "description": "Testing Arduino content upload",
    "tags": ["arduino", "test", "electronics"],
    "author": "Md Akhinoor Islam",
    "dateAdded": "2026-01-23T10:30:00.000Z",
    "files": {
      "content": "Content Storage/.../content.pdf",
      "thumbnail": "Content Storage/.../thumbnail.jpg"
    }
  },
  ... existing entries
]
```

**Verify:**
- [ ] Valid JSON format
- [ ] All required fields present
- [ ] No duplicate IDs
- [ ] Proper date format
- [ ] File paths correct

**Status:** [ ] Pass [ ] Fail

---

## TEST 10: Website Integration 🌐

**Purpose:** Verify content appears on website

### **Steps:**
1. Wait 5 minutes after upload (GitHub Pages build)
2. Open: `Content Studio/books-pdfs/book-listing-new.html`
3. Search for your test content

### **Expected:**
- ✅ New book appears in listing
- ✅ Thumbnail displays correctly
- ✅ Title and description shown
- ✅ Can click to view details
- ✅ PDF opens in viewer

**Status:** [ ] Pass [ ] Fail

---

## 🎯 FINAL VERIFICATION CHECKLIST

After completing all tests:

### **GitHub Repository:**
- [ ] Folders created correctly
- [ ] Files uploaded successfully
- [ ] SVG covers generated
- [ ] JSON files updated
- [ ] No orphaned files
- [ ] Proper commit messages

### **Upload Interface:**
- [ ] Connection successful
- [ ] Form validation working
- [ ] Progress tracking accurate
- [ ] Success messages displayed
- [ ] Error handling functional
- [ ] Form resets properly

### **Content Accessibility:**
- [ ] Files viewable on GitHub
- [ ] Content appears on website
- [ ] Search finds new content
- [ ] Categories organized
- [ ] Thumbnails loading

---

## 📊 TEST RESULTS SUMMARY

| Test | Status | Time | Notes |
|------|--------|------|-------|
| GitHub Connection | ⬜ | — | |
| Book Upload | ⬜ | — | |
| Video Upload | ⬜ | — | |
| Cover Generation | ⬜ | — | |
| Error Handling | ⬜ | — | |
| Multiple Uploads | ⬜ | — | |
| Large File | ⬜ | — | |
| Special Characters | ⬜ | — | |
| JSON Integrity | ⬜ | — | |
| Website Integration | ⬜ | — | |

**Overall Status:** ⬜ Pass ⬜ Fail

---

## 🐛 DEBUGGING TIPS

### **Check Browser Console:**
```javascript
// Should see:
✅ GitHub connected
✅ Categories loaded: 180
✅ Upload started
✅ Stage: checking
✅ Stage: uploading
✅ Upload complete
```

### **Common Issues:**

**Issue:** Upload stuck at 30%
**Fix:** Check network, wait 1 minute, retry

**Issue:** 401 error
**Fix:** Regenerate token with `repo` scope

**Issue:** Categories not loading
**Fix:** Verify JSON file paths in `categoryFiles` object

**Issue:** Files not appearing on website
**Fix:** Wait 5 minutes for GitHub Pages rebuild

---

## ✅ ACCEPTANCE CRITERIA

**System is READY when:**
- [ ] All 10 tests pass
- [ ] No console errors
- [ ] Files upload successfully
- [ ] Content appears on website
- [ ] Error handling works
- [ ] Performance acceptable (<60s per upload)

---

## 🎉 TESTING COMPLETE

After completing all tests and verification:

**Document findings:**
- Total tests: ___/10 passed
- Issues found: ___
- Performance: ___ seconds average
- Overall status: ✅ Ready / ⚠️ Needs fixes

**Next Steps:**
1. If all pass → System ready for production
2. If issues found → Debug and retest
3. Document any edge cases
4. Train users on upload process

---

**Testing Date:** _______________  
**Tester:** _______________  
**Result:** ⬜ PASS ⬜ FAIL

