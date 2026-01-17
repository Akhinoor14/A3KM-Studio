# 📄 MD to PDF Converter - A3KM Studio

Professional Markdown to PDF conversion system with custom headers, footers, and watermarks.

## 🎯 Features

- ✅ **Professional PDF Generation** - A4 format with proper margins
- ✅ **Custom Headers** - Project title, A3KM Studio branding
- ✅ **Custom Footers** - Page numbers, date/time, copyright
- ✅ **Noor Academy Watermark** - Diagonal, background, or corner placement
- ✅ **Reusable** - Use across all projects
- ✅ **Configurable** - Central configuration file
- ✅ **High Quality** - 300 DPI, proper typography
- ✅ **Page Break Control** - Smart page breaking

---

## 📦 Required Files

```
Optimization/md-to-pdf-downloader/
├── pdf-config.js              // Central configuration
├── md-to-pdf-converter.js     // Core converter
├── watermark-handler.js       // Watermark system
├── pdf-styles.css             // PDF-specific styles
└── README.md                  // This file
```

---

## 🔧 Installation

### 1. Include html2pdf.js Library

Add to your HTML `<head>`:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
```

### 2. Include MD to PDF Files

```html
<!-- Configuration -->
<script src="../../Optimization/md-to-pdf-downloader/pdf-config.js"></script>

<!-- Watermark Handler -->
<script src="../../Optimization/md-to-pdf-downloader/watermark-handler.js"></script>

<!-- Core Converter -->
<script src="../../Optimization/md-to-pdf-downloader/md-to-pdf-converter.js"></script>

<!-- PDF Styles -->
<link rel="stylesheet" href="../../Optimization/md-to-pdf-downloader/pdf-styles.css">
```

---

## 🚀 Basic Usage

### Example 1: Convert Markdown Content

```javascript
// Get markdown content (already converted to HTML)
const markdownHTML = document.getElementById('explanationContent').innerHTML;

// Create converter instance
const pdfConverter = new MDtoPDFConverter();

// Convert to PDF
await pdfConverter.convertToPDF(
    markdownHTML,
    'Code_Explanation',
    {
        projectTitle: 'LED Pattern Control',
        documentType: 'Code Explanation',
        author: 'Md Akhinoor Islam'
    }
);
```

### Example 2: With Custom Configuration

```javascript
const customConfig = {
    watermark: {
        text: 'CONFIDENTIAL',
        style: 'diagonal',
        color: 'rgba(255, 0, 0, 0.1)'
    },
    pdf: {
        orientation: 'landscape'
    }
};

const pdfConverter = new MDtoPDFConverter(customConfig);
await pdfConverter.convertToPDF(content, filename, metadata);
```

---

## 🎨 Configuration Options

### Watermark Styles

```javascript
PDFConfig.watermark = {
    text: "NOOR ACADEMY",
    style: "diagonal",     // 'diagonal', 'background', 'corner'
    color: "rgba(204, 0, 0, 0.08)",
    rotation: -45,
    repeat: true
};
```

### Header Customization

```javascript
PDFConfig.header = {
    show: true,
    content: {
        left: "projectTitle",
        center: "A3KM Studio",
        right: "documentType"
    }
};
```

### Footer Customization

```javascript
PDFConfig.footer = {
    show: true,
    content: {
        left: "dateTime",
        center: "pageNumber",
        right: "© Noor Academy 2026"
    }
};
```

---

## 📝 Integration Examples

### Arduino Project Viewer

```javascript
// Add download button
<button onclick="downloadExplanationPDF()" class="action-btn">
    <i class="fas fa-download"></i>
    Download as PDF
</button>

// Download function
async function downloadExplanationPDF() {
    const content = document.getElementById('explanationContent');
    const converter = new MDtoPDFConverter();
    
    await converter.convertToPDF(
        content.innerHTML,
        'Code_Explanation',
        {
            projectTitle: currentProject.title,
            documentType: 'Code Explanation for Beginners',
            author: 'Md Akhinoor Islam'
        }
    );
}
```

### README Download

```javascript
async function downloadReadmePDF() {
    const content = document.getElementById('readmeContent');
    const converter = new MDtoPDFConverter();
    
    await converter.convertToPDF(
        content.innerHTML,
        'README',
        {
            projectTitle: currentProject.title,
            documentType: 'Project README',
            author: 'Md Akhinoor Islam'
        }
    );
}
```

---

## 🎯 Metadata Options

```javascript
const metadata = {
    projectTitle: 'Your Project Name',      // Required
    documentType: 'Code Explanation',       // Required
    author: 'Author Name',                  // Optional (uses config default)
    date: '17/01/2026',                    // Optional (auto-generated)
    customField: 'Custom Value'             // Add any custom fields
};
```

---

## 📄 Filename Format

Configure in `pdf-config.js`:

```javascript
fileName: {
    prefix: "A3KM_",
    format: "{projectName}_{documentType}_{date}",
    extension: ".pdf",
    sanitize: true
}
```

**Output Example:** `A3KM_LED_Pattern_Control_Code_Explanation_2026-01-17.pdf`

---

## 🔍 Debug Mode

Enable debugging in `pdf-config.js`:

```javascript
debug: {
    enabled: true,
    showWatermarkBounds: true,
    logConversionTime: true
}
```

---

## 🎨 Styling Tips

### Force Page Break

```html
<div class="page-break-before">Content starts on new page</div>
```

### Avoid Breaking

```html
<div class="page-break-avoid">Keep this content together</div>
```

### Table Styling

Tables automatically avoid page breaks and get proper styling.

---

## ⚙️ Advanced Features

### Custom Watermark Logo

```javascript
const converter = new MDtoPDFConverter();
converter.watermarkHandler.addLogoWatermark(
    container, 
    'path/to/logo.png'
);
```

### Combined Text + Logo Watermark

```javascript
converter.watermarkHandler.createCombinedWatermark(
    container,
    'logo-url.png'
);
```

---

## 📊 Quality Settings

```javascript
quality: {
    image: 0.95,      // JPEG quality (0-1)
    dpi: 300,         // Print quality
    scale: 2,         // Rendering scale
    compress: true    // Enable compression
}
```

---

## 🐛 Troubleshooting

### PDF Not Generating

**Check:**
1. html2pdf.js loaded correctly
2. All script files included in order
3. Console for error messages

### Watermark Not Showing

**Check:**
1. `watermark.show` is true in config
2. Container has `position: relative`
3. Z-index settings

### Content Cut Off

**Adjust margins:**
```javascript
pdf: {
    margin: {
        top: 25,
        right: 15,
        bottom: 25,
        left: 15
    }
}
```

---

## 📞 Support

- **Website:** https://akhinoor14.github.io/A3KM-Studio/
- **GitHub:** github.com/Akhinoor14/A3KM-Studio
- **Email:** contact@a3kmstudio.com

---

## 📜 License

© 2026 A3KM Studio | Noor Academy  
All rights reserved.

---

## 🎓 Credits

**Developed by:** Md Akhinoor Islam  
**For:** Noor Academy  
**Library:** html2pdf.js by eKoopmans  
**Version:** 1.0.0
