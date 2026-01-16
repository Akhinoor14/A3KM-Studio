/**
 * Centralized PDF Viewer System
 * Universal PDF viewer for entire website
 * Shows any PDF in modal overlay with proper loading and error handling
 */

// Global viewer state
const PDFViewer = {
    currentModal: null,
    isOpen: false
};

/**
 * Open any PDF in modal viewer
 * @param {Object} options - Viewer configuration
 * @param {string} options.pdfPath - Path to PDF file (required)
 * @param {string} options.title - Modal title (optional, default: "PDF Viewer")
 * @param {boolean} options.showToolbar - Show PDF toolbar (optional, default: false)
 * @param {boolean} options.showDownload - Show download button (optional, default: true)
 * @param {string} options.downloadName - Custom download filename (optional)
 */
function openPDFViewer(options = {}) {
    try {
        // Validate required parameters
        if (!options.pdfPath) {
            throw new Error('PDF path is required');
        }

        // Close existing viewer if open
        if (PDFViewer.isOpen) {
            closePDFViewer();
        }

        console.log('📄 Opening PDF viewer...');

        // Default options
        const config = {
            pdfPath: options.pdfPath,
            title: options.title || '📄 PDF Viewer',
            showToolbar: options.showToolbar || false,
            showDownload: options.showDownload !== false,
            downloadName: options.downloadName || 'document.pdf'
        };

        // Create modal overlay
        const modal = document.createElement('div');
        modal.id = 'pdf-viewer-modal';
        modal.className = 'pdf-viewer-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.95);
            z-index: 99999;
            display: flex;
            flex-direction: column;
            animation: pdfFadeIn 0.3s ease;
        `;

        // Create header
        const header = document.createElement('div');
        header.className = 'pdf-viewer-header';
        header.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px 30px;
            background: #1a1a1a;
            color: white;
            border-bottom: 2px solid #CC0000;
            flex-shrink: 0;
        `;

        // Title
        const titleEl = document.createElement('h2');
        titleEl.textContent = config.title;
        titleEl.style.cssText = `
            margin: 0;
            font-size: 1.5rem;
            color: #CC0000;
            font-weight: 600;
        `;

        // Button container
        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = 'display: flex; gap: 15px; align-items: center;';

        // Download button (if enabled)
        if (config.showDownload) {
            const downloadBtn = document.createElement('button');
            downloadBtn.innerHTML = '<i class="fas fa-download"></i> Download';
            downloadBtn.className = 'pdf-download-btn';
            downloadBtn.style.cssText = `
                padding: 10px 20px;
                background: #CC0000;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-weight: 600;
                font-size: 1rem;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                gap: 8px;
            `;
            downloadBtn.onmouseover = () => downloadBtn.style.background = '#990000';
            downloadBtn.onmouseout = () => downloadBtn.style.background = '#CC0000';
            downloadBtn.onclick = () => downloadPDF(config.pdfPath, config.downloadName);
            buttonContainer.appendChild(downloadBtn);
        }

        // Close button
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '<i class="fas fa-times"></i> Close';
        closeBtn.className = 'pdf-close-btn';
        closeBtn.style.cssText = `
            padding: 10px 20px;
            background: transparent;
            color: white;
            border: 2px solid #ff4444;
            border-radius: 5px;
            cursor: pointer;
            font-weight: 600;
            font-size: 1rem;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 8px;
        `;
        closeBtn.onmouseover = () => {
            closeBtn.style.background = '#ff4444';
            closeBtn.style.borderColor = '#ff4444';
        };
        closeBtn.onmouseout = () => {
            closeBtn.style.background = 'transparent';
            closeBtn.style.borderColor = '#ff4444';
        };
        closeBtn.onclick = () => closePDFViewer();

        buttonContainer.appendChild(closeBtn);
        header.appendChild(titleEl);
        header.appendChild(buttonContainer);

        // Create PDF viewer container
        const viewerContainer = document.createElement('div');
        viewerContainer.className = 'pdf-viewer-container';
        viewerContainer.style.cssText = `
            flex: 1;
            position: relative;
            overflow: auto;
            background: #2a2a2a;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        `;

        // Detect mobile devices
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

        if (isMobile) {
            // Mobile fallback
            const mobileMsg = document.createElement('div');
            mobileMsg.style.cssText = `
                background: rgba(255,255,255,0.1);
                border: 2px solid #CC0000;
                border-radius: 12px;
                padding: 30px;
                max-width: 500px;
                text-align: center;
                color: white;
            `;
            mobileMsg.innerHTML = `
                <h3 style="color: #CC0000; margin-top: 0;">📱 Mobile Device Detected</h3>
                <p style="line-height: 1.6; margin: 20px 0;">PDF viewing is limited on mobile browsers. Please use the options below:</p>
                <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap; margin-top: 20px;">
                    <a href="${config.pdfPath}" target="_blank" style="
                        padding: 12px 24px;
                        background: #CC0000;
                        color: white;
                        text-decoration: none;
                        border-radius: 8px;
                        font-weight: bold;
                        display: inline-block;
                    ">🔗 Open in New Tab</a>
                    <a href="${config.pdfPath}" download="${config.downloadName}" style="
                        padding: 12px 24px;
                        background: transparent;
                        color: #CC0000;
                        border: 2px solid #CC0000;
                        text-decoration: none;
                        border-radius: 8px;
                        font-weight: bold;
                        display: inline-block;
                    ">📥 Download PDF</a>
                </div>
            `;
            viewerContainer.appendChild(mobileMsg);
        } else {
            // Desktop: Use iframe for PDF loading
            const toolbarParam = config.showToolbar ? '1' : '0';
            
            const pdfIframe = document.createElement('iframe');
            pdfIframe.src = `${config.pdfPath}#toolbar=${toolbarParam}&navpanes=0&scrollbar=1&view=FitH`;
            pdfIframe.className = 'pdf-viewer-iframe';
            pdfIframe.style.cssText = `
                width: 100%;
                height: 100%;
                border: none;
                min-height: 70vh;
                background: white;
                border-radius: 8px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.5);
            `;
            pdfIframe.setAttribute('loading', 'eager');
            pdfIframe.setAttribute('allow', 'fullscreen');

            // Loading indicator
            const loadingDiv = document.createElement('div');
            loadingDiv.className = 'pdf-loading';
            loadingDiv.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                color: #CC0000;
                font-size: 1.5rem;
                font-weight: bold;
                text-align: center;
            `;
            loadingDiv.innerHTML = `
                <div style="font-size: 3rem; margin-bottom: 20px;">⏳</div>
                <div>Loading PDF...</div>
            `;
            viewerContainer.appendChild(loadingDiv);

            // Handle iframe load events
            pdfIframe.onload = () => {
                setTimeout(() => {
                    loadingDiv.remove();
                    console.log('✅ PDF loaded successfully');
                }, 500);
            };

            pdfIframe.onerror = () => {
                loadingDiv.innerHTML = `
                    <div style="font-size: 3rem; margin-bottom: 20px;">❌</div>
                    <div style="margin-bottom: 20px;">Failed to load PDF</div>
                    <a href="${config.pdfPath}" download="${config.downloadName}" 
                       style="color: #CC0000; text-decoration: underline; cursor: pointer; font-size: 1.2rem;">
                       Click to download instead
                    </a>
                `;
                console.error('❌ Failed to load PDF');
            };

            viewerContainer.appendChild(pdfIframe);
        }

        // Assemble modal
        modal.appendChild(header);
        modal.appendChild(viewerContainer);

        // Add fade-in animation
        if (!document.getElementById('pdf-viewer-styles')) {
            const style = document.createElement('style');
            style.id = 'pdf-viewer-styles';
            style.textContent = `
                @keyframes pdfFadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes pdfFadeOut {
                    from { opacity: 1; }
                    to { opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }

        // Add to page
        document.body.appendChild(modal);
        PDFViewer.currentModal = modal;
        PDFViewer.isOpen = true;

        // Prevent body scroll
        document.body.style.overflow = 'hidden';

        console.log('✅ PDF viewer opened');

    } catch (error) {
        console.error('❌ Error opening PDF viewer:', error);
        alert('Unable to open PDF viewer. Error: ' + error.message);
    }
}

/**
 * Close PDF viewer modal
 */
function closePDFViewer() {
    if (PDFViewer.currentModal) {
        PDFViewer.currentModal.style.animation = 'pdfFadeOut 0.3s ease';
        setTimeout(() => {
            if (PDFViewer.currentModal) {
                PDFViewer.currentModal.remove();
                PDFViewer.currentModal = null;
                PDFViewer.isOpen = false;
            }
            document.body.style.overflow = ''; // Restore scroll
            console.log('✅ PDF viewer closed');
        }, 300);
    }
}

/**
 * Download PDF file
 * @param {string} pdfPath - Path to PDF file
 * @param {string} filename - Download filename
 */
function downloadPDF(pdfPath, filename = 'document.pdf') {
    try {
        console.log('⬇️ Downloading PDF...');
        
        const a = document.createElement('a');
        a.href = pdfPath;
        a.download = filename;
        a.style.display = 'none';
        
        document.body.appendChild(a);
        a.click();
        
        setTimeout(() => {
            document.body.removeChild(a);
            console.log('✅ PDF download initiated');
        }, 100);
        
    } catch (error) {
        console.error('❌ Download error:', error);
        alert('Unable to download PDF. Please try again.');
    }
}

// ESC key to close viewer
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && PDFViewer.isOpen) {
        closePDFViewer();
    }
});

// Backward compatibility aliases (CV viewer)
const __CV_DEFAULT_PATH = window.CV_PDF_PATH || '/About%20me/CV/2313014%20CV.pdf';
const __CV_DOWNLOAD_NAME = 'Md_Akhinoor_Islam_CV.pdf';

function openCVViewer() {
    openPDFViewer({
        pdfPath: __CV_DEFAULT_PATH,
        title: '📄 Curriculum Vitae - Md Akhinoor Islam',
        showToolbar: false,
        showDownload: true,
        downloadName: __CV_DOWNLOAD_NAME
    });
}

function closeCVViewer() {
    closePDFViewer();
}

function cvDownload() {
    downloadPDF(__CV_DEFAULT_PATH, __CV_DOWNLOAD_NAME);
}

function cvToggleFullscreen() {
    const modal = document.getElementById('pdf-viewer-modal');
    if (modal) {
        if (!document.fullscreenElement) {
            modal.requestFullscreen().catch(err => console.warn('Fullscreen error:', err));
        } else {
            document.exitFullscreen();
        }
    }
}

// Export functions globally
window.openPDFViewer = openPDFViewer;
window.closePDFViewer = closePDFViewer;
window.downloadPDF = downloadPDF;
window.PDFViewer = PDFViewer;
// Legacy exports
window.openCVViewer = openCVViewer;
window.closeCVViewer = closeCVViewer;
window.cvDownload = cvDownload;
window.cvToggleFullscreen = cvToggleFullscreen;

console.log('✅ Centralized PDF Viewer System loaded');
