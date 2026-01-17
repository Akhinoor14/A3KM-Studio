/**
 * Watermark Handler for PDF Generation
 * Creates professional watermarks for Noor Academy documents
 * Supports: Diagonal, Background, Corner placement
 */

class WatermarkHandler {
    constructor(config = PDFConfig.watermark) {
        this.config = config;
        this.watermarkElements = [];
    }
    
    /**
     * Create watermark overlay element
     * @param {HTMLElement} container - Container to add watermark to
     * @returns {HTMLElement} Watermark element
     */
    createWatermark(container) {
        const watermarkContainer = document.createElement('div');
        watermarkContainer.className = 'pdf-watermark-container';
        watermarkContainer.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            overflow: hidden;
            z-index: 1;
        `;
        
        if (this.config.style === 'diagonal') {
            this.createDiagonalWatermark(watermarkContainer);
        } else if (this.config.style === 'background') {
            this.createBackgroundWatermark(watermarkContainer);
        } else if (this.config.style === 'corner') {
            this.createCornerWatermark(watermarkContainer);
        }
        
        container.style.position = 'relative';
        container.insertBefore(watermarkContainer, container.firstChild);
        
        return watermarkContainer;
    }
    
    /**
     * Create diagonal watermark (default style)
     */
    createDiagonalWatermark(container) {
        if (this.config.repeat) {
            // Multiple watermarks across page
            const positions = [
                { top: '20%', left: '15%' },
                { top: '50%', left: '50%' },
                { top: '80%', left: '85%' }
            ];
            
            positions.forEach(pos => {
                const mark = this.createWatermarkElement();
                mark.style.top = pos.top;
                mark.style.left = pos.left;
                mark.style.transform = `translate(-50%, -50%) rotate(${this.config.rotation}deg)`;
                container.appendChild(mark);
            });
        } else {
            // Single centered watermark
            const mark = this.createWatermarkElement();
            mark.style.top = '50%';
            mark.style.left = '50%';
            mark.style.transform = `translate(-50%, -50%) rotate(${this.config.rotation}deg)`;
            container.appendChild(mark);
        }
    }
    
    /**
     * Create background pattern watermark
     */
    createBackgroundWatermark(container) {
        const rows = 5;
        const cols = 3;
        
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                const mark = this.createWatermarkElement();
                mark.style.top = `${(i + 1) * (100 / (rows + 1))}%`;
                mark.style.left = `${(j + 1) * (100 / (cols + 1))}%`;
                mark.style.transform = `translate(-50%, -50%) rotate(${this.config.rotation}deg)`;
                mark.style.fontSize = '40px'; // Smaller for pattern
                mark.style.opacity = '0.04'; // More subtle
                container.appendChild(mark);
            }
        }
    }
    
    /**
     * Create corner watermark
     */
    createCornerWatermark(container) {
        const mark = this.createWatermarkElement();
        
        // Position based on config
        if (this.config.position === 'top-left') {
            mark.style.top = '10%';
            mark.style.left = '10%';
        } else if (this.config.position === 'top-right') {
            mark.style.top = '10%';
            mark.style.right = '10%';
        } else if (this.config.position === 'bottom-left') {
            mark.style.bottom = '10%';
            mark.style.left = '10%';
        } else { // bottom-right (default)
            mark.style.bottom = '10%';
            mark.style.right = '10%';
        }
        
        mark.style.transform = `rotate(${this.config.rotation}deg)`;
        container.appendChild(mark);
    }
    
    /**
     * Create individual watermark element
     */
    createWatermarkElement() {
        const mark = document.createElement('div');
        mark.className = 'pdf-watermark-text';
        mark.textContent = this.config.text;
        mark.style.cssText = `
            position: absolute;
            font-size: ${this.config.fontSize};
            font-weight: 900;
            color: ${this.config.color};
            white-space: nowrap;
            user-select: none;
            font-family: 'Arial Black', 'Impact', sans-serif;
            letter-spacing: 8px;
            text-transform: uppercase;
        `;
        
        return mark;
    }
    
    /**
     * Add logo watermark
     * @param {string} logoUrl - URL or data URI of logo
     */
    addLogoWatermark(container, logoUrl) {
        const logoMark = document.createElement('img');
        logoMark.src = logoUrl;
        logoMark.className = 'pdf-watermark-logo';
        logoMark.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 300px;
            height: auto;
            opacity: 0.05;
            pointer-events: none;
        `;
        
        container.appendChild(logoMark);
    }
    
    /**
     * Create text + logo combined watermark
     */
    createCombinedWatermark(container, logoUrl) {
        const wrapper = document.createElement('div');
        wrapper.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(${this.config.rotation}deg);
            text-align: center;
        `;
        
        // Add logo
        if (logoUrl) {
            const logo = document.createElement('img');
            logo.src = logoUrl;
            logo.style.cssText = `
                width: 80px;
                height: auto;
                opacity: 0.1;
                display: block;
                margin: 0 auto 10px;
            `;
            wrapper.appendChild(logo);
        }
        
        // Add text
        const text = document.createElement('div');
        text.textContent = this.config.text;
        text.style.cssText = `
            font-size: ${this.config.fontSize};
            font-weight: 900;
            color: ${this.config.color};
            font-family: 'Arial Black', sans-serif;
            letter-spacing: 8px;
        `;
        wrapper.appendChild(text);
        
        container.appendChild(wrapper);
    }
    
    /**
     * Remove all watermarks
     */
    removeWatermarks() {
        this.watermarkElements.forEach(el => el.remove());
        this.watermarkElements = [];
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WatermarkHandler;
}
