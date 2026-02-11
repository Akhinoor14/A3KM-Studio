/**
 * Mobile PDF & Document Viewer System
 * Universal viewer for PDFs and images across entire mobile site
 * Optimized for touch gestures, performance, and mobile UX
 */

const MobilePDFViewer = {
    currentModal: null,
    isOpen: false,
    currentScale: 1,
    initialPinchDistance: 0,
    lastTouchX: 0,
    lastTouchY: 0
};

/**
 * Open PDF or image in mobile-optimized fullscreen viewer
 * @param {Object} options - Viewer configuration
 * @param {string} options.filePath - Path to PDF/image file (required)
 * @param {string} options.fileType - File type: 'pdf', 'jpg', 'png', 'jpeg' (auto-detected if not provided)
 * @param {string} options.title - Viewer title (optional, default: "Document Viewer")
 * @param {string} options.downloadName - Custom download filename (optional)
 * @param {boolean} options.showDownload - Show download button (optional, default: true)
 * @param {boolean} options.allowZoom - Allow pinch-to-zoom (optional, default: true)
 */
function openMobilePDFViewer(options = {}) {
    try {
        if (!options.filePath) {
            throw new Error('File path is required');
        }

        // Close existing viewer
        if (MobilePDFViewer.isOpen) {
            closeMobilePDFViewer();
        }

        console.log('📱 Opening mobile document viewer...');

        // Auto-detect file type
        const fileExt = options.filePath.split('.').pop().toLowerCase();
        const fileType = options.fileType || fileExt;
        const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileType);
        const isPDF = fileType === 'pdf';

        const config = {
            filePath: options.filePath,
            fileType: fileType,
            title: options.title || '📄 Document Viewer',
            downloadName: options.downloadName || `document.${fileType}`,
            showDownload: options.showDownload !== false,
            allowZoom: options.allowZoom !== false,
            isImage: isImage,
            isPDF: isPDF
        };

        // Create modal overlay
        const modal = document.createElement('div');
        modal.id = 'mobile-pdf-viewer-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, rgba(0,0,0,0.98), rgba(20,0,0,0.95));
            z-index: 99999;
            display: flex;
            flex-direction: column;
            animation: viewerSlideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            overflow: hidden;
        `;

        // Create header
        const header = document.createElement('div');
        header.style.cssText = `
            position: sticky;
            top: 0;
            z-index: 100;
            padding: 12px 16px;
            background: linear-gradient(135deg, rgba(0,0,0,0.98), rgba(20,0,0,0.95));
            backdrop-filter: blur(10px);
            border-bottom: 2px solid rgba(139,0,0,0.4);
            box-shadow: 0 2px 12px rgba(0,0,0,0.5);
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-shrink: 0;
        `;

        // Title
        const titleEl = document.createElement('div');
        titleEl.style.cssText = `
            font-size: 16px;
            font-weight: 700;
            color: #FFFFFF;
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            margin-right: 12px;
        `;
        titleEl.textContent = config.title;

        // Button container
        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = 'display: flex; gap: 8px; align-items: center;';

        // Download button
        if (config.showDownload) {
            const downloadBtn = document.createElement('button');
            downloadBtn.innerHTML = '<i class="fas fa-download"></i>';
            downloadBtn.style.cssText = `
                width: 42px;
                height: 42px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: linear-gradient(135deg, rgba(204,0,0,0.2), rgba(204,0,0,0.1));
                border: 1px solid rgba(204,0,0,0.3);
                border-radius: 10px;
                color: #CC0000;
                font-size: 16px;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: inset 0 1px 0 rgba(255,255,255,0.05);
            `;
            downloadBtn.ontouchstart = (e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(204,0,0,0.3), rgba(204,0,0,0.15))';
                if (navigator.vibrate) navigator.vibrate(10);
            };
            downloadBtn.ontouchend = (e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(204,0,0,0.2), rgba(204,0,0,0.1))';
                downloadDocument(config.filePath, config.downloadName);
            };
            buttonContainer.appendChild(downloadBtn);
        }

        // Close button
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '<i class="fas fa-times"></i>';
        closeBtn.style.cssText = `
            width: 42px;
            height: 42px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, rgba(204,0,0,0.15), rgba(0,0,0,0.3));
            border: 1px solid rgba(204,0,0,0.3);
            border-radius: 10px;
            color: #CC0000;
            font-size: 16px;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: inset 0 1px 0 rgba(255,255,255,0.05);
        `;
        closeBtn.ontouchstart = (e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(205,92,92,0.25), rgba(0,0,0,0.4))';
            if (navigator.vibrate) navigator.vibrate(10);
        };
        closeBtn.ontouchend = () => closeMobilePDFViewer();
        buttonContainer.appendChild(closeBtn);

        header.appendChild(titleEl);
        header.appendChild(buttonContainer);

        // Create viewer container
        const viewerContainer = document.createElement('div');
        viewerContainer.id = 'mobile-viewer-content';
        viewerContainer.style.cssText = `
            flex: 1;
            position: relative;
            overflow: auto;
            -webkit-overflow-scrolling: touch;
            background: linear-gradient(135deg, rgba(0,0,0,0.95), rgba(20,0,0,0.85));
            display: flex;
            justify-content: center;
            align-items: center;
        `;

        // Loading indicator
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'mobile-viewer-loading';
        loadingDiv.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
            z-index: 10;
        `;
        loadingDiv.innerHTML = `
            <div style="
                width: 60px;
                height: 60px;
                border: 4px solid rgba(205,92,92,0.2);
                border-top-color: #CD5C5C;
                border-radius: 50%;
                animation: viewerSpin 0.8s linear infinite;
                margin: 0 auto 16px;
            "></div>
            <div style="font-size: 14px; font-weight: 600; color: rgba(200,200,200,0.9);">Loading...</div>
        `;
        viewerContainer.appendChild(loadingDiv);

        // Render content based on file type
        if (config.isImage) {
            // Image viewer with pinch-to-zoom
            const imgWrapper = document.createElement('div');
            imgWrapper.style.cssText = `
                width: 100%;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                overflow: hidden;
                position: relative;
            `;

            const img = document.createElement('img');
            img.src = config.filePath;
            img.alt = config.title;
            img.style.cssText = `
                max-width: 100%;
                max-height: 100%;
                object-fit: contain;
                user-select: none;
                -webkit-user-select: none;
                transition: transform 0.3s ease;
                touch-action: none;
            `;

            img.onload = () => {
                setTimeout(() => loadingDiv.remove(), 300);
                console.log('✅ Image loaded successfully');
            };

            img.onerror = () => {
                loadingDiv.innerHTML = `
                    <div style="font-size: 48px; margin-bottom: 16px;">❌</div>
                    <div style="font-size: 16px; font-weight: 700; color: rgba(200,200,200,0.9); margin-bottom: 8px;">Failed to load image</div>
                    <button onclick="downloadDocument('${config.filePath}','${config.downloadName}')" style="
                        margin-top: 16px;
                        padding: 10px 20px;
                        background: linear-gradient(135deg, rgba(205,92,92,0.2), rgba(205,92,92,0.1));
                        border: 1px solid rgba(205,92,92,0.3);
                        border-radius: 8px;
                        color: #CD5C5C;
                        font-weight: 600;
                        cursor: pointer;
                    ">📥 Download instead</button>
                `;
                console.error('❌ Failed to load image');
            };

            // Pinch-to-zoom support
            if (config.allowZoom) {
                let scale = 1;
                let lastDistance = 0;

                imgWrapper.addEventListener('touchstart', (e) => {
                    if (e.touches.length === 2) {
                        const touch1 = e.touches[0];
                        const touch2 = e.touches[1];
                        lastDistance = Math.hypot(
                            touch2.clientX - touch1.clientX,
                            touch2.clientY - touch1.clientY
                        );
                    }
                });

                imgWrapper.addEventListener('touchmove', (e) => {
                    if (e.touches.length === 2) {
                        e.preventDefault();
                        const touch1 = e.touches[0];
                        const touch2 = e.touches[1];
                        const distance = Math.hypot(
                            touch2.clientX - touch1.clientX,
                            touch2.clientY - touch1.clientY
                        );

                        if (lastDistance > 0) {
                            const delta = distance - lastDistance;
                            scale += delta * 0.01;
                            scale = Math.max(1, Math.min(scale, 4)); // Limit 1x to 4x
                            img.style.transform = `scale(${scale})`;
                        }

                        lastDistance = distance;
                    }
                });

                imgWrapper.addEventListener('touchend', () => {
                    lastDistance = 0;
                });

                // Double-tap to reset zoom
                let lastTap = 0;
                imgWrapper.addEventListener('touchend', (e) => {
                    const now = Date.now();
                    if (now - lastTap < 300) {
                        scale = 1;
                        img.style.transform = 'scale(1)';
                        if (navigator.vibrate) navigator.vibrate(10);
                    }
                    lastTap = now;
                });
            }

            imgWrapper.appendChild(img);
            viewerContainer.appendChild(imgWrapper);

        } else if (config.isPDF) {
            // PDF viewer - Mobile: open in new tab, Desktop: use iframe
            const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
            
            if (isMobile) {
                // Mobile: Open PDF in browser tab instead of iframe (better compatibility)
                console.log('📱 Mobile detected - opening PDF in browser tab');
                
                // Open PDF in new tab immediately
                window.open(config.filePath, '_blank');
                
                // Show user-friendly confirmation message
                loadingDiv.innerHTML = `
                    <div style="font-size: 56px; margin-bottom: 20px;">✅</div>
                    <div style="font-size: 18px; font-weight: 700; color: rgba(200,200,200,0.95); margin-bottom: 12px;">PDF Opened in Browser</div>
                    <div style="font-size: 14px; color: rgba(150,150,150,0.8); margin-bottom: 24px; line-height: 1.5;">
                        Check your browser tabs to view the PDF.<br>
                        You can close this viewer now.
                    </div>
                    <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
                        <button onclick="closeMobilePDFViewer()" style="
                            padding: 12px 24px;
                            background: linear-gradient(135deg, rgba(76,175,80,0.2), rgba(76,175,80,0.1));
                            border: 1px solid rgba(76,175,80,0.3);
                            border-radius: 8px;
                            color: #4CAF50;
                            font-weight: 600;
                            cursor: pointer;
                            font-size: 15px;
                        ">✓ Close Viewer</button>
                        <button onclick="downloadDocument('${config.filePath}','${config.downloadName}')" style="
                            padding: 12px 24px;
                            background: linear-gradient(135deg, rgba(205,92,92,0.2), rgba(205,92,92,0.1));
                            border: 1px solid rgba(205,92,92,0.3);
                            border-radius: 8px;
                            color: #CD5C5C;
                            font-weight: 600;
                            cursor: pointer;
                            font-size: 15px;
                        ">📥 Download Instead</button>
                    </div>
                `;
                
            } else {
                // Desktop: Use iframe viewer with fallback
                console.log('💻 Desktop detected - using iframe viewer');
                
                const pdfIframe = document.createElement('iframe');
                pdfIframe.src = `${config.filePath}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`;
                pdfIframe.style.cssText = `
                    width: 100%;
                    height: 100%;
                    border: none;
                    background: white;
                `;
                pdfIframe.setAttribute('loading', 'eager');
                pdfIframe.setAttribute('allow', 'fullscreen');

                pdfIframe.onload = () => {
                    setTimeout(() => loadingDiv.remove(), 500);
                    console.log('✅ PDF loaded successfully');
                };

                pdfIframe.onerror = () => {
                    loadingDiv.innerHTML = `
                        <div style="font-size: 48px; margin-bottom: 16px;">❌</div>
                        <div style="font-size: 16px; font-weight: 700; color: rgba(200,200,200,0.9); margin-bottom: 8px;">Failed to load PDF</div>
                        <div style="font-size: 13px; color: rgba(150,150,150,0.7); margin-bottom: 16px;">Your browser may not support PDF viewing</div>
                        <div style="display: flex; gap: 12px; justify-content: center;">
                            <button onclick="window.open('${config.filePath}','_blank')" style="
                                padding: 10px 20px;
                                background: linear-gradient(135deg, rgba(205,92,92,0.2), rgba(205,92,92,0.1));
                                border: 1px solid rgba(205,92,92,0.3);
                                border-radius: 8px;
                                color: #CD5C5C;
                                font-weight: 600;
                                cursor: pointer;
                            ">🔗 Open in Browser</button>
                            <button onclick="downloadDocument('${config.filePath}','${config.downloadName}')" style="
                                padding: 10px 20px;
                                background: linear-gradient(135deg, rgba(205,92,92,0.2), rgba(205,92,92,0.1));
                                border: 1px solid rgba(205,92,92,0.3);
                                border-radius: 8px;
                                color: #CD5C5C;
                                font-weight: 600;
                                cursor: pointer;
                            ">📥 Download PDF</button>
                        </div>
                    `;
                    console.error('❌ Failed to load PDF');
                };

                viewerContainer.appendChild(pdfIframe);
            }
        }

        // Assemble modal
        modal.appendChild(header);
        modal.appendChild(viewerContainer);

        // Add animations
        if (!document.getElementById('mobile-viewer-styles')) {
            const style = document.createElement('style');
            style.id = 'mobile-viewer-styles';
            style.textContent = `
                @keyframes viewerSlideUp {
                    from { transform: translateY(100%); }
                    to { transform: translateY(0); }
                }
                @keyframes viewerSlideDown {
                    from { transform: translateY(0); }
                    to { transform: translateY(100%); }
                }
                @keyframes viewerSpin {
                    to { transform: rotate(360deg); }
                }
                #mobile-pdf-viewer-modal * {
                    -webkit-tap-highlight-color: transparent;
                }
            `;
            document.head.appendChild(style);
        }

        // Add to page
        document.body.appendChild(modal);
        MobilePDFViewer.currentModal = modal;
        MobilePDFViewer.isOpen = true;

        // Prevent body scroll
        document.body.style.overflow = 'hidden';

        console.log('✅ Mobile document viewer opened');

    } catch (error) {
        console.error('❌ Error opening mobile viewer:', error);
        alert('Unable to open document viewer. Error: ' + error.message);
    }
}

/**
 * Close mobile PDF viewer
 */
function closeMobilePDFViewer() {
    if (MobilePDFViewer.currentModal) {
        MobilePDFViewer.currentModal.style.animation = 'viewerSlideDown 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        setTimeout(() => {
            if (MobilePDFViewer.currentModal) {
                MobilePDFViewer.currentModal.remove();
                MobilePDFViewer.currentModal = null;
                MobilePDFViewer.isOpen = false;
            }
            document.body.style.overflow = '';
            console.log('✅ Mobile viewer closed');
        }, 300);
    }
}

/**
 * Download document file
 * @param {string} filePath - Path to document
 * @param {string} filename - Download filename
 */
function downloadDocument(filePath, filename = 'document') {
    try {
        console.log('⬇️ Downloading document...');
        
        const a = document.createElement('a');
        a.href = filePath;
        a.download = filename;
        a.target = '_blank';
        a.style.display = 'none';
        
        document.body.appendChild(a);
        a.click();
        
        setTimeout(() => {
            document.body.removeChild(a);
            console.log('✅ Download initiated');
            if (navigator.vibrate) navigator.vibrate([10, 50, 10]);
        }, 100);
        
    } catch (error) {
        console.error('❌ Download error:', error);
        alert('Unable to download file. Please try again.');
    }
}

// Export functions globally
window.openMobilePDFViewer = openMobilePDFViewer;
window.closeMobilePDFViewer = closeMobilePDFViewer;
window.downloadDocument = downloadDocument;
window.MobilePDFViewer = MobilePDFViewer;

console.log('✅ Mobile PDF & Document Viewer System loaded');
