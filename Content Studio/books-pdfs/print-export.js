/**
 * Print & Export Functionality
 * Print-friendly stylesheets and PDF export options
 * Author: Md Akhinoor Islam
 * A3KM Studio
 */

// ==================== PRINT STYLES ====================

const printStyles = `
<style id="print-styles">
@media print {
    /* Reset & Base */
    * {
        background: white !important;
        color: black !important;
        box-shadow: none !important;
        text-shadow: none !important;
    }

    body {
        font-family: Georgia, 'Times New Roman', serif !important;
        font-size: 12pt !important;
        line-height: 1.6 !important;
        margin: 0 !important;
        padding: 20px !important;
    }

    /* Hide UI elements */
    .header,
    .back-btn,
    .controls,
    .toolbar,
    .sidebar,
    .navigation,
    .share-buttons,
    .comment-section,
    .related-content,
    .footer,
    button,
    .no-print {
        display: none !important;
    }

    /* Page breaks */
    h1, h2, h3, h4, h5, h6 {
        page-break-after: avoid !important;
        page-break-inside: avoid !important;
    }

    p, blockquote, pre, ul, ol {
        page-break-inside: avoid !important;
    }

    img {
        page-break-inside: avoid !important;
        max-width: 100% !important;
        height: auto !important;
    }

    table {
        page-break-inside: avoid !important;
        border-collapse: collapse !important;
        width: 100% !important;
    }

    table, th, td {
        border: 1px solid black !important;
        padding: 8px !important;
    }

    /* Headers */
    h1 {
        font-size: 24pt !important;
        margin: 0 0 20px 0 !important;
        border-bottom: 2px solid black !important;
        padding-bottom: 10px !important;
    }

    h2 {
        font-size: 18pt !important;
        margin: 20px 0 10px 0 !important;
    }

    h3 {
        font-size: 14pt !important;
        margin: 15px 0 8px 0 !important;
    }

    /* Content */
    article, .post-content, .article-content {
        width: 100% !important;
        max-width: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
    }

    /* Code blocks */
    code, pre {
        font-family: 'Courier New', monospace !important;
        font-size: 10pt !important;
        border: 1px solid #ccc !important;
        background: #f5f5f5 !important;
        padding: 5px !important;
    }

    pre {
        padding: 10px !important;
        white-space: pre-wrap !important;
        word-wrap: break-word !important;
    }

    /* Links */
    a:link, a:visited {
        color: black !important;
        text-decoration: underline !important;
    }

    a[href]:after {
        content: " (" attr(href) ")" !important;
        font-size: 9pt !important;
    }

    a[href^="#"]:after,
    a[href^="javascript:"]:after {
        content: "" !important;
    }

    /* Lists */
    ul, ol {
        margin: 10px 0 !important;
        padding-left: 30px !important;
    }

    li {
        margin: 5px 0 !important;
    }

    /* Blockquotes */
    blockquote {
        border-left: 3px solid black !important;
        padding-left: 15px !important;
        margin: 15px 0 !important;
        font-style: italic !important;
    }

    /* Print header/footer */
    @page {
        margin: 2cm;
        
        @top-center {
            content: "A3KM Studio";
            font-size: 10pt;
            color: #666;
        }
        
        @bottom-right {
            content: "Page " counter(page) " of " counter(pages);
            font-size: 10pt;
        }
    }

    /* First page */
    .print-title {
        display: block !important;
        font-size: 28pt !important;
        font-weight: bold !important;
        margin-bottom: 10px !important;
    }

    .print-meta {
        display: block !important;
        font-size: 10pt !important;
        color: #666 !important;
        margin-bottom: 30px !important;
        padding-bottom: 10px !important;
        border-bottom: 1px solid #ccc !important;
    }

    /* Ensure content visibility */
    .article-body,
    .post-body,
    .content-body {
        display: block !important;
        visibility: visible !important;
    }
}

/* Print preview mode (optional) */
body.print-preview {
    background: white !important;
    max-width: 21cm;
    margin: 0 auto;
    padding: 2cm;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

body.print-preview .no-print {
    display: none !important;
}
</style>
`;

// ==================== EXPORT FUNCTIONS ====================

class PrintExport {
    constructor() {
        this.injectPrintStyles();
    }

    injectPrintStyles() {
        if (!document.getElementById('print-styles')) {
            document.head.insertAdjacentHTML('beforeend', printStyles);
        }
    }

    // ==================== PRINT FUNCTIONS ====================

    printPage() {
        // Add print metadata
        this.addPrintMetadata();
        
        // Trigger print dialog
        window.print();
        
        // Cleanup after print
        setTimeout(() => this.removePrintMetadata(), 100);
    }

    printArticle(containerId) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error('Container not found:', containerId);
            return;
        }

        // Get article content
        const content = container.innerHTML;
        
        // Create print window
        const printWindow = window.open('', '_blank');
        
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Print - A3KM Studio</title>
                <meta charset="UTF-8">
                ${printStyles}
            </head>
            <body>
                ${this.getPrintHeader()}
                ${content}
                ${this.getPrintFooter()}
            </body>
            </html>
        `);
        
        printWindow.document.close();
        
        // Wait for content to load, then print
        printWindow.onload = function() {
            printWindow.print();
            setTimeout(() => printWindow.close(), 100);
        };
    }

    addPrintMetadata() {
        const title = document.title;
        const url = window.location.href;
        const date = new Date().toLocaleDateString();
        
        // Add metadata div (hidden on screen, visible in print)
        const metadata = document.createElement('div');
        metadata.className = 'print-meta';
        metadata.style.display = 'none';
        metadata.innerHTML = `
            <div class="print-title">${title}</div>
            <div>URL: ${url}</div>
            <div>Printed: ${date}</div>
            <div>© A3KM Studio</div>
        `;
        
        document.body.insertBefore(metadata, document.body.firstChild);
    }

    removePrintMetadata() {
        const metadata = document.querySelector('.print-meta');
        if (metadata) {
            metadata.remove();
        }
    }

    getPrintHeader() {
        return `
            <div class="print-meta">
                <div class="print-title">${document.title}</div>
                <div>URL: ${window.location.href}</div>
                <div>Printed: ${new Date().toLocaleDateString()}</div>
                <div>© A3KM Studio - Engineering Content</div>
            </div>
        `;
    }

    getPrintFooter() {
        return `
            <div style="margin-top: 50px; padding-top: 20px; border-top: 1px solid #ccc; font-size: 10pt; color: #666;">
                <p>For more content, visit: https://github.com/Akhinoor14/A3KM-Studio</p>
            </div>
        `;
    }

    // ==================== PDF EXPORT (Client-side) ====================

    async exportToPDF(containerId, filename = 'document.pdf') {
        // Note: This requires html2pdf.js library
        // Add this script to use: <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
        
        if (typeof html2pdf === 'undefined') {
            console.warn('html2pdf library not loaded. Falling back to print.');
            this.printArticle(containerId);
            return;
        }

        const element = document.getElementById(containerId);
        if (!element) {
            console.error('Container not found:', containerId);
            return;
        }

        const opt = {
            margin: 1,
            filename: filename,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
        };

        try {
            await html2pdf().set(opt).from(element).save();
        } catch (error) {
            console.error('PDF export failed:', error);
            alert('PDF export failed. Using print instead.');
            this.printArticle(containerId);
        }
    }

    // ==================== MARKDOWN EXPORT ====================

    exportToMarkdown(containerId, filename = 'document.md') {
        const container = document.getElementById(containerId);
        if (!container) return;

        // Convert HTML to Markdown (basic conversion)
        let markdown = this.htmlToMarkdown(container);
        
        // Download
        this.downloadFile(markdown, filename, 'text/markdown');
    }

    htmlToMarkdown(element) {
        let markdown = '';
        
        // Get text content with basic formatting
        const walker = document.createTreeWalker(
            element,
            NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT,
            null,
            false
        );

        let node;
        while (node = walker.nextNode()) {
            if (node.nodeType === Node.TEXT_NODE) {
                markdown += node.textContent;
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                const tag = node.tagName.toLowerCase();
                switch (tag) {
                    case 'h1':
                        markdown += '\n# ';
                        break;
                    case 'h2':
                        markdown += '\n## ';
                        break;
                    case 'h3':
                        markdown += '\n### ';
                        break;
                    case 'h4':
                        markdown += '\n#### ';
                        break;
                    case 'p':
                        markdown += '\n\n';
                        break;
                    case 'br':
                        markdown += '\n';
                        break;
                    case 'strong':
                    case 'b':
                        markdown += '**';
                        break;
                    case 'em':
                    case 'i':
                        markdown += '*';
                        break;
                    case 'code':
                        markdown += '`';
                        break;
                }
            }
        }

        return markdown.trim();
    }

    // ==================== TEXT EXPORT ====================

    exportToText(containerId, filename = 'document.txt') {
        const container = document.getElementById(containerId);
        if (!container) return;

        const text = container.innerText || container.textContent;
        this.downloadFile(text, filename, 'text/plain');
    }

    // ==================== HELPER FUNCTIONS ====================

    downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        
        URL.revokeObjectURL(url);
    }

    // ==================== PRINT PREVIEW ====================

    togglePrintPreview() {
        document.body.classList.toggle('print-preview');
    }

    // ==================== CONFIGURATION ====================

    setPrintOptions(options) {
        // Allow customization of print behavior
        this.options = {
            showURL: options.showURL !== false,
            showDate: options.showDate !== false,
            showFooter: options.showFooter !== false,
            fontSize: options.fontSize || '12pt',
            ...options
        };
    }
}

// ==================== GLOBAL INSTANCE ====================

window.printExport = new PrintExport();

// ==================== CONVENIENCE FUNCTIONS ====================

window.printPage = () => window.printExport.printPage();
window.printArticle = (id) => window.printExport.printArticle(id);
window.exportToPDF = (id, filename) => window.printExport.exportToPDF(id, filename);
window.exportToMarkdown = (id, filename) => window.printExport.exportToMarkdown(id, filename);
window.exportToText = (id, filename) => window.printExport.exportToText(id, filename);

console.log('🖨️ Print & Export System Loaded');
