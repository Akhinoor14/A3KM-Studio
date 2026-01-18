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
        // Deep merge with default config
        this.config = this.deepMerge(JSON.parse(JSON.stringify(PDFConfig)), options);
        this.watermarkHandler = new WatermarkHandler(this.config.watermark);
        this.currentPage = 1;
        this.totalPages = 1;
        
        // Debug: Log config to verify
        if (options.debug?.enabled) {
            console.log('🔧 PDF Config loaded:', this.config.theme);
        }
        
        // Check if html2pdf is loaded
        if (typeof html2pdf === 'undefined') {
            console.error('html2pdf.js not loaded! Please include: https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js');
        }
    }
    
    /**
     * Deep merge objects
     */
    deepMerge(target, source) {
        const result = { ...target };
        for (const key in source) {
            if (source.hasOwnProperty(key)) {
                if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                    result[key] = this.deepMerge(target[key] || {}, source[key]);
                } else {
                    result[key] = source[key];
                }
            }
        }
        return result;
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
        // Get current theme
        const isDark = this.config.theme.mode === 'dark';
        const theme = isDark ? this.config.theme.dark : this.config.theme.light;
        
        const container = document.createElement('div');
        container.className = 'pdf-document-container';
        container.style.cssText = `
            width: ${this.config.pdf.pageSize.width}mm;
            min-height: ${this.config.pdf.pageSize.height}mm;
            background: ${theme.background};
            position: relative;
            font-family: ${this.config.content.fontFamily};
            font-size: ${this.config.content.fontSize};
            line-height: ${this.config.content.lineHeight};
            color: ${theme.textColor};
            padding: 0;
            margin: 0;
        `;
        
        // Add header
        if (this.config.header.show) {
            container.appendChild(this.createHeader(metadata, theme));
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
        
        // Apply content styling with theme
        this.applyContentStyling(contentWrapper, theme);
        container.appendChild(contentWrapper);
        
        // Add footer
        if (this.config.footer.show) {
            container.appendChild(this.createFooter(metadata, theme));
        }
        
        return container;
    }
    
    /**
     * Create header element
     */
    createHeader(metadata, theme) {
        const isDark = this.config.theme.mode === 'dark';
        const headerBg = isDark ? 'rgba(26, 0, 0, 0.5)' : this.config.header.backgroundColor;
        const borderColor = isDark ? 'rgba(204, 0, 0, 0.7)' : '#CC0000';
        const textColor = isDark ? theme.headingColor : this.config.header.style.color;
        
        const header = document.createElement('div');
        header.className = 'pdf-header';
        header.style.cssText = `
            width: 100%;
            height: ${this.config.header.height}mm;
            background: ${headerBg};
            border-bottom: 3px solid ${borderColor};
            border-radius: 8px 8px 0 0;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 10mm;
            position: relative;
            z-index: 3;
            font-size: ${this.config.header.style.fontSize};
            font-weight: ${this.config.header.style.fontWeight};
            color: ${textColor};
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
        right.style.cssText = 'flex: 1; text-align: right; font-size: 8pt; opacity: 0.8;';
        
        header.appendChild(left);
        header.appendChild(center);
        header.appendChild(right);
        
        return header;
    }
    
    /**
     * Create footer element
     */
    createFooter(metadata, theme) {
        const isDark = this.config.theme.mode === 'dark';
        const footerBg = isDark ? 'rgba(10, 10, 10, 0.8)' : this.config.footer.backgroundColor;
        const borderColor = isDark ? 'rgba(204, 0, 0, 0.4)' : '#CCCCCC';
        const textColor = isDark ? 'rgba(255, 255, 255, 0.7)' : this.config.footer.style.color;
        
        const footer = document.createElement('div');
        footer.className = 'pdf-footer';
        footer.style.cssText = `
            width: 100%;
            height: ${this.config.footer.height}mm;
            background: ${footerBg};
            border-top: 1px solid ${borderColor};
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 10mm;
            position: relative;
            z-index: 3;
            font-size: ${this.config.footer.style.fontSize};
            color: ${textColor};
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
    applyContentStyling(contentWrapper, theme) {
        const isDark = this.config.theme.mode === 'dark';
        
        // Headers
        const headers = contentWrapper.querySelectorAll('h1, h2, h3, h4, h5, h6');
        headers.forEach((h, idx) => {
            const level = parseInt(h.tagName[1]);
            const sizes = ['18pt', '16pt', '14pt', '12pt'];
            const fontSize = sizes[level - 1] || '11pt';
            
            h.style.cssText = `
                color: ${theme.headingColor} !important;
                font-size: ${fontSize};
                font-weight: 700;
                margin: ${25 - (level * 3)}px 0 ${12 - (level * 2)}px 0;
                page-break-after: avoid;
                display: block;
                ${level === 1 ? `border-bottom: 2px solid ${theme.accentColor}; padding-bottom: 6px;` : ''}
                ${isDark && level === 1 ? `text-shadow: 0 0 10px rgba(204, 0, 0, 0.5);` : ''}
            `;
        });
        
        // Paragraphs
        const paragraphs = contentWrapper.querySelectorAll('p');
        paragraphs.forEach(p => {
            p.style.cssText = `
                margin: 0 0 12px 0;
                line-height: 1.7;
                color: ${theme.textColor} !important;
                text-align: justify;
                display: block;
            `;
        });
        
        // Code blocks (PRE)
        const preBlocks = contentWrapper.querySelectorAll('pre');
        preBlocks.forEach(pre => {
            pre.style.cssText = `
                background: ${theme.codeBackground} !important;
                padding: 15px;
                border: 2px solid ${theme.accentColor};
                border-left: 4px solid ${theme.accentColor};
                border-radius: 4px;
                overflow-x: auto;
                margin: 15px 0;
                page-break-inside: avoid;
                display: block;
            `;
            
            const code = pre.querySelector('code');
            if (code) {
                code.style.cssText = `
                    font-family: ${this.config.content.codeFont};
                    font-size: 9pt;
                    color: ${theme.codeTextColor} !important;
                    line-height: 1.5;
                    display: inline;
                    background: transparent !important;
                `;
            }
        });
        
        // Inline code
        const inlineCodes = contentWrapper.querySelectorAll('code:not(pre code)');
        inlineCodes.forEach(code => {
            code.style.cssText = `
                background: ${isDark ? 'rgba(204, 0, 0, 0.2)' : '#f0f0f0'} !important;
                padding: 2px 6px;
                border-radius: 3px;
                font-family: ${this.config.content.codeFont};
                font-size: 10pt;
                color: ${isDark ? 'rgba(255, 200, 200, 0.95)' : '#c7254e'} !important;
                border: 1px solid ${isDark ? 'rgba(204, 0, 0, 0.3)' : '#e1e1e1'};
                display: inline;
            `;
        });
        
        // Lists
        const lists = contentWrapper.querySelectorAll('ul, ol');
        lists.forEach(list => {
            list.style.cssText = `
                margin: 10px 0 10px 20px;
                padding-left: 20px;
                display: block;
                color: ${theme.textColor} !important;
            `;
        });
        
        const listItems = contentWrapper.querySelectorAll('li');
        listItems.forEach(li => {
            li.style.cssText = `
                margin: 6px 0;
                line-height: 1.6;
                color: ${theme.textColor} !important;
                display: list-item;
            `;
        });
        
        // Tables
        const tables = contentWrapper.querySelectorAll('table');
        tables.forEach(table => {
            table.style.cssText = `
                width: 100%;
                border-collapse: collapse;
                margin: 15px 0;
                page-break-inside: avoid;
                display: table;
                border: 2px solid ${theme.tableBorder};
                border-radius: 8px;
                overflow: hidden;
            `;
        });
        
        const theads = contentWrapper.querySelectorAll('thead');
        theads.forEach(thead => {
            thead.style.cssText = `
                display: table-header-group;
                background: ${theme.tableHeaderBg} !important;
            `;
        });
        
        const tbodys = contentWrapper.querySelectorAll('tbody');
        tbodys.forEach(tbody => {
            tbody.style.cssText = 'display: table-row-group;';
        });
        
        const trs = contentWrapper.querySelectorAll('tr');
        trs.forEach(tr => {
            tr.style.cssText = 'display: table-row;';
        });
        
        const ths = contentWrapper.querySelectorAll('th');
        ths.forEach(th => {
            th.style.cssText = `
                background: ${isDark ? 'rgba(204, 0, 0, 0.4)' : '#cc0000'} !important;
                color: ${isDark ? 'rgba(255, 255, 255, 0.95)' : 'white'} !important;
                padding: 10px;
                border: 1px solid ${theme.tableBorder};
                font-weight: 700;
                text-align: left;
                display: table-cell;
            `;
        });
        
        const tds = contentWrapper.querySelectorAll('td');
        tds.forEach(td => {
            td.style.cssText = `
                padding: 8px 10px;
                border: 1px solid ${theme.tableBorder};
                background: ${theme.tableCellBg} !important;
                color: ${theme.textColor} !important;
                display: table-cell;
            `;
        });
        
        // Blockquotes
        const blockquotes = contentWrapper.querySelectorAll('blockquote');
        blockquotes.forEach(bq => {
            bq.style.cssText = `
                border-left: 4px solid ${theme.accentColor};
                padding: 12px 20px;
                margin: 15px 0;
                background: ${isDark ? 'rgba(204, 0, 0, 0.1)' : '#f9f9f9'} !important;
                color: ${isDark ? 'rgba(255, 255, 255, 0.8)' : '#555555'} !important;
                font-style: italic;
                display: block;
                ${isDark ? 'border-radius: 0 8px 8px 0;' : ''}
            `;
        });
        
        // Links
        const links = contentWrapper.querySelectorAll('a');
        links.forEach(link => {
            link.style.cssText = `
                color: ${theme.linkColor} !important;
                text-decoration: underline;
                font-weight: 600;
            `;
        });
        
        // Strong/Bold
        const strongs = contentWrapper.querySelectorAll('strong, b');
        strongs.forEach(s => {
            s.style.cssText = `
                font-weight: 700;
                color: ${isDark ? 'rgba(255, 255, 255, 0.95)' : '#000000'} !important;
            `;
        });
        
        // Emphasis/Italic
        const ems = contentWrapper.querySelectorAll('em, i');
        ems.forEach(em => {
            em.style.cssText = `
                font-style: italic;
                color: ${isDark ? 'rgba(255, 255, 255, 0.8)' : '#444444'} !important;
            `;
        });
        
        // Horizontal Rules
        const hrs = contentWrapper.querySelectorAll('hr');
        hrs.forEach(hr => {
            hr.style.cssText = `
                border: none;
                border-top: 2px solid ${isDark ? 'rgba(204, 0, 0, 0.5)' : theme.accentColor};
                margin: 20px 0;
                display: block;
            `;
        });
        
        // Images
        const images = contentWrapper.querySelectorAll('img');
        images.forEach(img => {
            img.style.cssText = `
                max-width: 100%;
                height: auto;
                margin: 15px 0;
                border: 2px solid ${theme.accentColor};
                border-radius: 4px;
                display: block;
                page-break-inside: avoid;
            `;
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
