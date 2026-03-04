# 🔐 PDF Password Protection System - A3KM Studio

## Overview

All PDF books uploaded to A3KM Studio are now protected with a default password. The website **automatically** applies this password when users view PDFs through our viewers, providing seamless access for legitimate users while preventing unauthorized downloads.

---

## 📋 System Details

### Password Information
- **Default Password:** `MOUnoor21014`
- **Applied Automatically:** Yes
- **User Action Required:** None

### Supported Viewers
✅ **Desktop PDF Reader** (`Content Studio/books-pdfs/pdf-reader.html`)  
✅ **3D Book Mode** (`Content Studio/books-pdfs/book-3d.html`)  
✅ **Mobile PDF Viewer** (`mobile/shared/pdf-viewer.js`)  
✅ **Universal PDF Viewer** (All platforms)

---

## 🎯 How It Works

### 1. **PDF Upload**
When creating a PDF from Word or other sources:
1. Set the document password to: `MOUnoor21014`
2. Save/export as PDF with password protection
3. Upload the password-protected PDF to your website

### 2. **Automatic Password Injection**
When a user opens a PDF through your viewers:
```javascript
// The system automatically does this:
const A3KM_PDF_PASSWORD = 'MOUnoor21014';

pdfjsLib.getDocument({
    url: pdfUrl,
    password: A3KM_PDF_PASSWORD  // Auto-applied
});
```

### 3. **User Experience**
- User clicks "Read Book" or "Download"
- PDF opens **immediately** - no password prompt
- User can read, zoom, navigate normally
- Password is **invisible** to the user

---

## 🛡️ Security Benefits

| Benefit | Description |
|---------|-------------|
| **Content Protection** | PDFs cannot be opened outside your website without the password |
| **Access Control** | Only your platform can display the PDFs to users |
| **No Manual Entry** | Users never see or enter the password |
| **Transparent** | Seamless experience for legitimate users |
| **Download Prevention** | Downloaded PDFs require password to open elsewhere |

---

## 📝 How to Create Password-Protected PDFs

### From Microsoft Word

1. **File → Info → Protect Document → Encrypt with Password**
2. Enter password: `MOUnoor21014`
3. Confirm password
4. **Save As → PDF**

### From Adobe Acrobat

1. **File → Protect Using Password**
2. Select "Require a password to open the document"
3. Enter password: `MOUnoor21014`
4. Click OK and save

### From LibreOffice Writer

1. **File → Export as PDF**
2. Click **Security** button
3. Check "Encrypt PDF document"
4. Enter password: `MOUnoor21014`
5. Click Export

### Using Python (Automated)

```python
from PyPDF2 import PdfReader, PdfWriter

# Read existing PDF
reader = PdfReader('input.pdf')
writer = PdfWriter()

# Copy all pages
for page in reader.pages:
    writer.add_page(page)

# Add password protection
writer.encrypt('MOUnoor21014')

# Save encrypted PDF
with open('output_protected.pdf', 'wb') as f:
    writer.write(f)
```

---

## 🔧 Implementation Details

### Files Modified

1. **`mobile/shared/pdf-viewer.js`**
   - Added `A3KM_PDF_PASSWORD` constant
   - Modified `loadPDF()` function for password support
   - Added `onPassword` callback handler

2. **`Content Studio/books-pdfs/pdf-reader.html`**
   - Added `A3KM_PDF_PASSWORD` constant
   - Modified `tryLoadPDF()` function for password support
   - Added `onPassword` callback handler

3. **`Content Studio/books-pdfs/book-3d.html`**
   - Added `A3KM_PDF_PASSWORD` constant
   - Modified `tryLoadDoc()` function for password support
   - Added `onPassword` callback handler

### Code Example

```javascript
// Default password constant
const A3KM_PDF_PASSWORD = 'MOUnoor21014';

// Load PDF with automatic password
const loadingTask = pdfjsLib.getDocument({
    url: pdfUrl,
    password: A3KM_PDF_PASSWORD
});

// Handle password requirement
loadingTask.onPassword = (updatePassword, reason) => {
    if (reason === 1) { // NEED_PASSWORD
        console.log('🔐 PDF requires password, using default...');
        updatePassword(A3KM_PDF_PASSWORD);
    } else if (reason === 2) { // INCORRECT_PASSWORD
        console.error('❌ Incorrect password');
        throw new Error('Incorrect PDF password');
    }
};

const pdfDoc = await loadingTask.promise;
```

---

## 🧪 Testing

### Test Page
A dedicated test page is available: [`test-password-pdf.html`](test-password-pdf.html)

### Manual Testing Steps

1. Create a password-protected PDF with password `MOUnoor21014`
2. Place it in your website directory
3. Open any viewer (Desktop/Mobile/3D)
4. Load the PDF using the viewer
5. **Expected:** PDF opens automatically without password prompt
6. **Verify:** Can view, zoom, navigate all pages

### Console Verification

Open browser console and look for:
```
🔐 PDF requires password, using default A3KM password...
✅ PDF loaded: 43 pages
```

---

## ⚠️ Important Notes

### Do NOT Change the Password
- The password `MOUnoor21014` is **hardcoded** in the viewers
- Changing it would break existing PDFs
- All new PDFs **must** use the same password

### Password Visibility
- The password exists in **client-side JavaScript**
- Technically visible to anyone inspecting the code
- **Purpose:** Prevent casual downloads, not enterprise-level security
- For higher security, consider server-side PDF serving with authentication

### Fallback Behavior
- If password is incorrect: Error message shown
- If no password needed: PDF loads normally
- If PDF corrupted: Standard error handling applies

---

## 📊 Current PDF Status

### Test PDF
- **File:** `AI & PROMPT ENGINEERING- বাংলায় AI শেখা.pdf`
- **Password:** `MOUnoor21014` ✅
- **Pages:** 43
- **Size:** 6" × 9" (152.4mm × 228.6mm)
- **Ratio:** 2:3 (Perfect for mobile viewing)

---

## 🔄 Workflow Summary

```
┌─────────────────────────────────────────────────────────┐
│  1. Create PDF with password: MOUnoor21014              │
│     ↓                                                   │
│  2. Upload to website                                   │
│     ↓                                                   │
│  3. User clicks "Read" on your website                  │
│     ↓                                                   │
│  4. Viewer auto-applies password (invisible to user)    │
│     ↓                                                   │
│  5. PDF opens seamlessly                                │
│     ↓                                                   │
│  6. If user downloads PDF, it remains password-locked   │
└─────────────────────────────────────────────────────────┘
```

---

## 💡 Best Practices

1. **Consistent Password:** Always use `MOUnoor21014` for all PDFs
2. **Test Before Upload:** Verify password is correct locally
3. **Keep Backups:** Store unprotected originals separately
4. **Update Documentation:** Note which PDFs are password-protected

---

## 🎨 Page Size Recommendations

Your current PDF uses the optimal size:
- **6" × 9"** - Standard book format
- **Better for mobile** than A4 (8.27" × 11.69")
- **Smaller file size** for faster loading
- **Professional book appearance**

To maintain this in Word:
1. **Layout → Size → More Paper Sizes**
2. Width: 6 inches, Height: 9 inches
3. Save as PDF with password

---

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| PDF won't open | Verify password is exactly `MOUnoor21014` |
| Wrong page size | Set document to 6" × 9" before export |
| Password prompt shown | Check if password was correctly applied |
| Console errors | Check browser console for specific error |

---

## ✅ System Status

- ✅ Password system implemented
- ✅ Desktop viewer updated
- ✅ Mobile viewer updated  
- ✅ 3D book viewer updated
- ✅ Test page created
- ✅ Documentation complete

**Status:** FULLY OPERATIONAL 🚀

---

*Last Updated: March 4, 2026*  
*A3KM Studio - Md Akhinoor Islam*
