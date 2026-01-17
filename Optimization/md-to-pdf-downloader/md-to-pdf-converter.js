/**
 * MD to PDF Converter - Core Module
 * Professional markdown to PDF conversion with custom headers, footers, and watermarks
 * 
 * Dependencies: html2pdf.js (v0.10.1+)
 * CDN: https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js
 * 
 * Usage:
 * const converter = new MDtoPDFConverter(options);
 * await converter.convertToPDF(htmlContent, filename);
 */

class MDtoPDFConverter {
    constructor(options = {}) {
        // Merge with default config
        this.config = { ...PDFConfig, ...options };
        this.watermarkHandler = new WatermarkHandler(this.config.watermark);
        this.currentPage = 1;
        this.totalPages = 1;
        
        // Check if html2pdf is loaded
        if (typeof html2pdf === 'undefined') {
            console.error('html2pdf.js not loaded! Please include: https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js');
        }
    }
    
    /**
     * Main conversion method
     * @param {string|HTMLElement} content - HTML content or element to convert
     * @param {string} filename - Output PDF filename
     * @param {Object} metadata - Additional metadata (projectTitle, documentType, etc.)
     */
    async convertToPDF(content, filename, metadata = {}) {
        const startTime = Date.now();
        
        try {
            // Create PDF container
            const pdfContainer = this.createPDFContainer(content, metadata);
            
            // Add watermark
            if (this.config.watermark) {
                this.watermarkHandler.createWatermark(pdfContainer);
            }
            
            // Configure html2pdf options
            const opt = {
                margin: [
                    this.config.pdf.margin.top,
                    this.config.pdf.margin.right,
                    this.config.pdf.margin.bottom,
                    this.config.pdf.margin.left
                ],
                filename: this.generateFilename(filename, metadata),
                image: { 
                    type: 'jpeg', 
                    quality: this.config.quality.image 
                },
                html2canvas: { 
                    scale: this.config.quality.scale,
                    useCORS: true,
                    logging: this.config.debug.enabled
                },
                jsPDF: { 
                    unit: this.config.pdf.unit, 
                    format: this.config.pdf.format, 
                    orientation: this.config.pdf.orientation,
                    compress: this.config.quality.compress
                },
                pagebreak: { 
                    mode: ['avoid-all', 'css', 'legacy'],
                    before: this.config.pageBreak.before.join(','),
                    after: this.config.pageBreak.after.join(','),
                    avoid: this.config.pageBreak.avoidElements.join(',')
                }
            };
            
            // Add to body temporarily
            document.body.appendChild(pdfContainer);
            
            // Generate PDF
            await html2pdf().set(opt).from(pdfContainer).save();
            
            // Cleanup
            document.body.removeChild(pdfContainer);
            
            if (this.config.debug.logConversionTime) {
                const duration = Date.now() - startTime;
                console.log(`✅ PDF generated in ${duration}ms`);
            }
            
            return true;
        } catch (error) {
            console.error('❌ PDF conversion failed:', error);
            throw error;
        }
    }
    
    /**
     * Create PDF container with content, header, and footer
     */
    createPDFContainer(content, metadata) {
        const container = document.createElement('div');
        container.className = 'pdf-document-container';
        container.style.cssText = `
            width: ${this.config.pdf.pageSize.width}mm;
            min-height: ${this.config.pdf.pageSize.height}mm;
            background: white;
            position: relative;
            font-family: ${this.config.content.fontFamily};
            font-size: ${this.config.content.fontSize};
            line-height: ${this.config.content.lineHeight};
            color: ${this.config.content.color};
            padding: 0;
            margin: 0;
        `;
        
        // Add header
        if (this.config.header.show) {
            container.appendChild(this.createHeader(metadata));
        }
        
        // Add content
        const contentWrapper = document.createElement('div');
        contentWrapper.className = 'pdf-content-wrapper';
        contentWrapper.style.cssText = `
            padding: 10mm 0;
            position: relative;
            z-index: 2;
        `;
        
        if (typeof content === 'string') {
            contentWrapper.innerHTML = content;
        } else {
            contentWrapper.appendChild(content.cloneNode(true));
        }
        
        // Apply content styling
        this.applyContentStyling(contentWrapper);
        container.appendChild(contentWrapper);
        
        // Add footer
        if (this.config.footer.show) {
            container.appendChild(this.createFooter(metadata));
        }
        
        return container;
    }
    
    /**
     * Create header element
     */
    createHeader(metadata) {
        const header = document.createElement('div');
        header.className = 'pdf-header';
        header.style.cssText = `
            width: 100%;
            height: ${this.config.header.height}mm;
            background: ${this.config.header.backgroundColor};
            border-bottom: ${this.config.header.borderBottom};
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 10mm;
            position: relative;
            z-index: 3;
            font-size: ${this.config.header.style.fontSize};
            font-weight: ${this.config.header.style.fontWeight};
            color: ${this.config.header.style.color};
            font-family: ${this.config.header.style.fontFamily};
        `;
        
        // Left content
        const left = document.createElement('div');
        left.textContent = this.replaceVariables(this.config.header.content.left, metadata);
        left.style.cssText = 'flex: 1; text-align: left;';
        
        // Center content
        const center = document.createElement('div');
        center.textContent = this.replaceVariables(this.config.header.content.center, metadata);
        center.style.cssText = 'flex: 1; text-align: center; font-weight: 900;';
        
        // Right content
        const right = document.createElement('div');
        right.textContent = this.replaceVariables(this.config.header.content.right, metadata);
        right.style.cssText = 'flex: 1; text-align: right;';
        
        header.appendChild(left);
        header.appendChild(center);
        header.appendChild(right);
        
        return header;
    }
    
    /**
     * Create footer element
     */
    createFooter(metadata) {
        const footer = document.createElement('div');
        footer.className = 'pdf-footer';
        footer.style.cssText = `
            width: 100%;
            height: ${this.config.footer.height}mm;
            background: ${this.config.footer.backgroundColor};
            border-top: ${this.config.footer.borderTop};
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 10mm;
            position: relative;
            z-index: 3;
            font-size: ${this.config.footer.style.fontSize};
            color: ${this.config.footer.style.color};
            font-family: ${this.config.footer.style.fontFamily};
        `;
        
        // Left: Date/Time
        const left = document.createElement('div');
        left.textContent = this.replaceVariables(this.config.footer.content.left, metadata);
        left.style.cssText = 'flex: 1; text-align: left;';
        
        // Center: Page number
        const center = document.createElement('div');
        center.className = 'page-number';
        center.textContent = this.replaceVariables(this.config.footer.content.center, metadata);
        center.style.cssText = 'flex: 1; text-align: center;';
        
        // Right: Copyright
        const right = document.createElement('div');
        right.textContent = this.replaceVariables(this.config.footer.content.right, metadata);
        right.style.cssText = 'flex: 1; text-align: right;';
        
        footer.appendChild(left);
        footer.appendChild(center);
        footer.appendChild(right);
        
        return footer;
    }
    
    /**
     * Apply styling to content for PDF
     */
    applyContentStyling(contentWrapper) {
        // Headers
        const headers = contentWrapper.querySelectorAll('h1, h2, h3, h4, h5, h6');
        headers.forEach(h => {
            h.style.color = this.config.content.headingColor;
            h.style.pageBreakAfter = 'avoid';
            h.style.marginTop = '15px';
            h.style.marginBottom = '10px';
        });
        
        // Code blocks
        const codeBlocks = contentWrapper.querySelectorAll('pre, code');
        codeBlocks.forEach(code => {
            code.style.fontFamily = this.config.content.codeFont;
            code.style.fontSize = '9pt';
            code.style.pageBreakInside = 'avoid';
        });
        
        // Tables
        const tables = contentWrapper.querySelectorAll('table');
        tables.forEach(table => {
            table.style.pageBreakInside = 'avoid';
            table.style.width = '100%';
            table.style.borderCollapse = 'collapse';
        });
        
        // Links
        const links = contentWrapper.querySelectorAll('a');
        links.forEach(link => {
            link.style.color = this.config.content.linkColor;
            link.style.textDecoration = 'underline';
        });
        
        // Images
        const images = contentWrapper.querySelectorAll('img');
        images.forEach(img => {
            img.style.maxWidth = '100%';
            img.style.height = 'auto';
            img.style.pageBreakInside = 'avoid';
        });
    }
    
    /**
     * Replace variables in template strings
     */
    replaceVariables(template, metadata) {
        const now = new Date();
        
        const variables = {
            projectTitle: metadata.projectTitle || 'Arduino Project',
            documentType: metadata.documentType || 'Documentation',
            author: metadata.author || this.config.studio.author,
            dateTime: now.toLocaleString('en-GB', { 
                day: '2-digit', 
                month: '2-digit', 
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }),
            date: now.toLocaleDateString('en-GB'),
            time: now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
            pageNumber: 'Page [page] of [toPage]', // html2pdf will replace these
            academyName: this.config.academy.name,
            studioName: this.config.studio.name
        };
        
        let result = template;
        Object.keys(variables).forEach(key => {
            result = result.replace(new RegExp(key, 'g'), variables[key]);
        });
        
        return result;
    }
    
    /**
     * Generate filename from template
     */
    generateFilename(baseFilename, metadata) {
        if (!this.config.fileName.format) {
            return baseFilename + this.config.fileName.extension;
        }
        
        const now = new Date();
        const date = now.toISOString().split('T')[0]; // YYYY-MM-DD
        const time = now.toTimeString().split(' ')[0].replace(/:/g, '-'); // HH-MM-SS
        
        let filename = this.config.fileName.format
            .replace('{projectName}', metadata.projectTitle || 'Project')
            .replace('{documentType}', metadata.documentType || 'Doc')
            .replace('{date}', date)
            .replace('{time}', time)
            .replace('{author}', this.config.studio.author.replace(/\s+/g, '_'));
        
        // Sanitize filename
        if (this.config.fileName.sanitize) {
            filename = filename.replace(/[^a-zA-Z0-9_-]/g, '_');
        }
        
        return this.config.fileName.prefix + filename + this.config.fileName.extension;
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MDtoPDFConverter;
}
