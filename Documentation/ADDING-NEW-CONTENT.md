# 📚 Adding New Content - Complete Guide

## 🎯 Overview

This guide explains how to add new content (courses, books, papers, projects) to A3KM Studio with proper paid/free access control.

---

## ⚠️ CRITICAL: Access Type Fields

Every content item **MUST** have these fields to work properly:

### For FREE Content:
```json
{
  "accessType": "free"
}
```

### For PAID Content:
```json
{
  "accessType": "paid",
  "price": {
    "amount": 199,
    "originalPrice": 250,
    "discount": 20,
    "currency": "BDT"
  }
}
```

**⚠️ WARNING:** If you forget `accessType`, content will default to **FREE** and everyone can access it!

---

## 📝 Step-by-Step Process

### **1. Choose Content Type**

What are you adding?
- 🎓 Course → `Content Studio/educational-videos/courses.json`
- 📘 Book → `Content Studio/books-pdfs/books.json`
- 📄 Paper → `Content Studio/research-papers/papers.json`
- 🔧 Project → `Projects Code/projects.json`

---

### **2. Use Template**

Copy the appropriate template:

#### **FREE Course Template:**
```json
{
  "id": "course-unique-id",
  "title": "Course Title",
  "subtitle": "Course subtitle",
  "description": "Detailed description",
  "accessType": "free",
  "thumbnail": "path/to/thumbnail.jpg",
  "category": "programming",
  "tags": ["python", "beginner"],
  "duration": "4 weeks",
  "difficulty": "Beginner",
  "instructor": "Your Name",
  "lessons": [
    {
      "id": 1,
      "title": "Introduction",
      "videoId": "cloudflare-video-id"
    }
  ]
}
```

#### **PAID Course Template:**
```json
{
  "id": "course-unique-id",
  "title": "Advanced Course Title",
  "subtitle": "Premium course subtitle",
  "description": "Detailed description",
  "accessType": "paid",
  "price": {
    "amount": 399,
    "originalPrice": 500,
    "discount": 20,
    "currency": "BDT"
  },
  "thumbnail": "path/to/thumbnail.jpg",
  "category": "programming",
  "tags": ["python", "advanced"],
  "duration": "8 weeks",
  "difficulty": "Advanced",
  "instructor": "Your Name",
  "lessons": [
    {
      "id": 1,
      "title": "Advanced Concepts",
      "videoId": "cloudflare-video-id"
    }
  ]
}
```

#### **FREE Project Template:**
```json
{
  "id": "project-unique-id",
  "title": "Project Name",
  "description": "Project description",
  "accessType": "free",
  "category": "arduino",
  "difficulty": "Beginner",
  "tags": ["led", "basic"],
  "thumbnail": "path/to/image.jpg",
  "files": {
    "code": "project.ino",
    "circuit": "circuit.png"
  }
}
```

#### **PAID Project Template:**
```json
{
  "id": "project-unique-id",
  "title": "Advanced Project Name",
  "description": "Premium project description",
  "accessType": "paid",
  "price": {
    "amount": 149,
    "currency": "BDT"
  },
  "category": "solidworks",
  "difficulty": "Advanced",
  "tags": ["3d", "modeling"],
  "thumbnail": "path/to/image.jpg",
  "glbFile": "path/to/model.glb",
  "zipDownload": "path/to/files.zip"
}
```

---

### **3. Fill in the Details**

#### Required Fields (ALL content):
- ✅ `id` - Unique identifier (lowercase, no spaces: `"course-python-basics"`)
- ✅ `title` - Display name
- ✅ `description` - Full description
- ✅ `accessType` - **CRITICAL:** `"free"` or `"paid"`
- ✅ `category` - Content category
- ✅ `thumbnail` - Image path

#### Required for PAID content:
- ✅ `price.amount` - Price in BDT (number)
- ⚠️ `price.originalPrice` - Original price (optional, for showing discount)
- ⚠️ `price.discount` - Discount percentage (optional)

#### Optional but Recommended:
- `tags` - Array of keywords for search
- `difficulty` - Beginner/Intermediate/Advanced
- `duration` - "4 weeks", "2 hours", etc.
- `instructor` - Creator name

---

### **4. Validate Before Adding**

Use this checklist:

```
□ ID is unique (not used by other content)
□ accessType is set ("free" or "paid")
□ If paid, price.amount is set
□ If paid, price is reasonable (৳49-৳999 range typically)
□ All file paths are correct
□ Thumbnail exists
□ Content files exist (videos, PDFs, code, etc.)
□ No spelling errors in title/description
```

---

### **5. Add to JSON File**

Open the appropriate JSON file and add your entry:

```json
{
  "courses": [
    { ... existing course ... },
    { ... existing course ... },
    
    // Add your new course HERE (with comma above!)
    {
      "id": "your-new-course",
      "title": "Your New Course",
      "accessType": "paid",
      "price": { "amount": 299 },
      ...
    }
  ]
}
```

**⚠️ Common Mistakes:**
- Forgetting comma after previous item
- Missing closing brace `}`
- Wrong quote type (use `"` not `'`)
- Duplicate ID

---

### **6. Test Locally**

Before deploying:

1. **Open browser console** (F12)
2. **Check for errors** (red text)
3. **Test the listing page:**
   - Does your content show?
   - Is PAID badge visible (if paid)?
   - Does thumbnail load?

4. **Test the viewer page:**
   - Can you open the content?
   - Does access gate appear (if paid)?
   - Can you download (if you have access)?

5. **Test the store (buy.html):**
   - Does paid content appear in store?
   - Is price correct?
   - Can you add to cart?

---

### **7. Deploy**

```bash
# Commit to Git
git add .
git commit -m "Added new content: [Content Name]"
git push

# Vercel will auto-deploy
# Check: https://yoursite.vercel.app
```

---

## 🔍 Validation Rules

### What System Checks:

```javascript
// Listing pages
if (!item.accessType) {
    // ⚠️ Defaults to FREE
    // No PAID badge shown
}

// Viewer pages
if (item.accessType !== 'paid') {
    // ✅ No access gate
    // Free access
} else {
    // 🔒 Shows access gate
    // Checks user's purchases
}

// Store (buy.html)
if (item.accessType === 'paid' && item.price?.amount) {
    // ✅ Shows in store
} else {
    // ❌ Hidden from store
}
```

---

## ❌ Common Errors & Fixes

### Error 1: "Content not showing in listing"
**Cause:** JSON syntax error (missing comma, brace, etc.)
**Fix:** Validate JSON at https://jsonlint.com

### Error 2: "PAID content is FREE"
**Cause:** Missing `accessType: "paid"` or `price` field
**Fix:** Add required fields (see templates above)

### Error 3: "FREE content shows as PAID"
**Cause:** Has `accessType: "paid"` by mistake
**Fix:** Change to `accessType: "free"` and remove `price`

### Error 4: "Content not in store"
**Cause:** Missing `price.amount` or `accessType !== "paid"`
**Fix:** Ensure both fields are present and correct

### Error 5: "Access gate not working"
**Cause:** Firebase scripts not loaded or wrong content ID
**Fix:** Check browser console, verify content ID matches

---

## 📊 Content Pricing Guidelines

### Recommended Price Ranges:

**Courses:**
- Beginner: ৳99 - ৳299
- Intermediate: ৳299 - ৳599
- Advanced: ৳599 - ৳999

**Books/Papers:**
- Short: ৳49 - ৳99
- Medium: ৳99 - ৳199
- Comprehensive: ৳199 - ৳399

**Projects:**
- Basic: ৳29 - ৳99
- Intermediate: ৳99 - ৳199
- Advanced: ৳199 - ৳499

**Combos:**
- 20-30% off individual prices
- Example: 3 courses × ৳399 = ৳1197 → Combo ৳799

---

## 🛡️ Security Checklist

Before making content PAID:

```
□ Content is high-quality (worth the price)
□ All files are properly uploaded
□ Watermarks added (if applicable)
□ Preview/samples available (for free browsing)
□ Description is clear about what's included
□ Terms of use are clear (no sharing, personal use only)
□ Refund policy is communicated
```

---

## 📞 Need Help?

If you're stuck or unsure:

1. **Check this guide again**
2. **Look at existing content** (copy similar structure)
3. **Validate JSON** at jsonlint.com
4. **Test in browser console**
5. **Contact developer** if technical issue

---

## 🎓 Quick Reference

### Minimal FREE Content:
```json
{
  "id": "unique-id",
  "title": "Title",
  "accessType": "free"
}
```

### Minimal PAID Content:
```json
{
  "id": "unique-id",
  "title": "Title",
  "accessType": "paid",
  "price": { "amount": 199 }
}
```

### Check if Working:
1. Listing → Shows PAID badge?
2. Viewer → Access gate appears?
3. Store → Listed with price?

✅ All YES = Working correctly!
❌ Any NO = Check fields again

---

**Last Updated:** March 6, 2026  
**Version:** 1.0
