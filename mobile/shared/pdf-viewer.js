/**
 * ============================================================================
 * UNIVERSAL PDF VIEWER - A3KM Studio
 * PDF.js based custom viewer for mobile & desktop
 * Features: Zoom, Search, Page Navigation, Touch Gestures, Keyboard Shortcuts
 * Theme: Red, Black, White - Engineering Design
 * ============================================================================
 */

const UniversalPDFViewer = {
    // Core state
    currentModal: null,
    isOpen: false,
    pdfDoc: null,
    currentPage: 1,
    totalPages: 0,
    pageRendering: false,
    pageNumPending: null,
    
    // Zoom & pan
    scale: 1.4,
    minScale: 0.5,
    maxScale: 4.0,
    defaultScale: 1.4,
    isFullscreen: false,
    
    // Touch gestures
    initialPinchDistance: 0,
    lastPanX: 0,
    lastPanY: 0,
    isPanning: false,
    touches: [],
    
    // Canvas & context
    canvas: null,
    ctx: null,
    canvasWrapper: null,
    
    // Configuration
    config: {},
    
    // PDF.js CDN
    pdfjsLib: null,
    pdfjsVersion: '3.11.174'
};

/**
 * Initialize PDF.js Library from CDN
 */
async function initPDFJS() {
    if (UniversalPDFViewer.pdfjsLib) {
        return UniversalPDFViewer.pdfjsLib;
    }
    
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${UniversalPDFViewer.pdfjsVersion}/pdf.min.js`;
        script.async = true;
        
        script.onload = () => {
            if (window.pdfjsLib) {
                UniversalPDFViewer.pdfjsLib = window.pdfjsLib;
                UniversalPDFViewer.pdfjsLib.GlobalWorkerOptions.workerSrc = 
                    `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${UniversalPDFViewer.pdfjsVersion}/pdf.worker.min.js`;
                console.log('✅ PDF.js initialized');
                resolve(UniversalPDFViewer.pdfjsLib);
            } else {
                reject(new Error('PDF.js failed to load'));
            }
        };
        
        script.onerror = () => reject(new Error('Failed to load PDF.js from CDN'));
        document.head.appendChild(script);
    });
}

/**
 * Main function - Open Universal PDF Viewer
 */
async function openUniversalPDFViewer(options = {}) {
    try {
        if (!options.filePath) {
            throw new Error('PDF file path is required');
        }
        
        if (UniversalPDFViewer.isOpen) {
            closeUniversalPDFViewer();
        }
        
        UniversalPDFViewer.config = {
            filePath: options.filePath,
            title: options.title || '📄 PDF Viewer',
            showDownload: options.showDownload !== false,
            allowZoom: options.allowZoom !== false,
            downloadName: options.downloadName || 'document.pdf'
        };
        
        console.log('📱 Opening Universal PDF Viewer...');
        
        await initPDFJS();
        createViewerUI();
        await loadPDF(options.filePath);
        setupEventListeners();
        
        UniversalPDFViewer.isOpen = true;
        
    } catch (error) {
        console.error('❌ PDF Viewer Error:', error);
        showPDFError(error.message);
    }
}

// Alias for backward compatibility
window.openMobilePDFViewer = openUniversalPDFViewer;

/**
 * Create Viewer UI
 */
function createViewerUI() {
    // Modal container
    const modal = document.createElement('div');
    modal.id = 'universal-pdf-viewer';
    modal.innerHTML = `
        <style>
            #universal-pdf-viewer {
                position: fixed;
                inset: 0;
                z-index: 999999;
                background: linear-gradient(135deg, rgba(0,0,0,0.98), rgba(20,0,0,0.95));
                display: flex;
                flex-direction: column;
                animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            .pdf-header {
                position: sticky;
                top: 0;
                z-index: 100;
                padding: 12px 16px;
                background: rgba(0,0,0,0.98);
                backdrop-filter: blur(10px);
                border-bottom: 2px solid rgba(139,0,0,0.4);
                box-shadow: 0 2px 15px rgba(204,0,0,0.3);
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .pdf-title {
                font-size: 16px;
                font-weight: 700;
                color: #FFFFFF;
                flex: 1;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                margin-right: 12px;
            }
            
            .pdf-buttons {
                display: flex;
                gap: 8px;
            }
            
            .pdf-btn {
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: linear-gradient(135deg, rgba(204,0,0,0.2), rgba(204,0,0,0.1));
                border: 1px solid rgba(204,0,0,0.3);
                border-radius: 8px;
                color: #CC0000;
                font-size: 16px;
                cursor: pointer;
                transition: all 0.2s ease;
                box-shadow: inset 0 1px 0 rgba(255,255,255,0.05);
            }
            
            .pdf-btn:active {
                background: linear-gradient(135deg, rgba(204,0,0,0.3), rgba(204,0,0,0.15));
                transform: scale(0.95);
            }
            
            .pdf-canvas-wrapper {
                flex: 1;
                overflow: auto;
                -webkit-overflow-scrolling: touch;
                background: linear-gradient(135deg, 
                    rgba(10, 0, 0, 0.95), 
                    rgba(0, 0, 0, 0.98),
                    rgba(20, 0, 0, 0.90)
                );
                display: flex;
                justify-content: center;
                align-items: flex-start;
                padding: 20px;
                position: relative;
            }
            
            #universal-pdf-viewer.fullscreen .pdf-header,
            #universal-pdf-viewer.fullscreen .pdf-controls {
                display: none;
            }
            
            #universal-pdf-viewer.fullscreen .pdf-canvas-wrapper {
                padding: 0;
            }
            
            .fullscreen-hint {
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                z-index: 999999;
                padding: 12px 24px;
                background: rgba(0, 0, 0, 0.95);
                border: 1px solid rgba(204, 0, 0, 0.5);
                border-radius: 25px;
                color: #FFFFFF;
                font-size: 13px;
                font-weight: 600;
                box-shadow: 0 4px 20px rgba(204, 0, 0, 0.4);
                animation: fadeInOut 3s ease-in-out;
                pointer-events: none;
            }
            
            @keyframes fadeInOut {
                0% { opacity: 0; transform: translateX(-50%) translateY(-10px); }
                10% { opacity: 1; transform: translateX(-50%) translateY(0); }
                90% { opacity: 1; transform: translateX(-50%) translateY(0); }
                100% { opacity: 0; transform: translateX(-50%) translateY(-10px); }
            }
            
            #pdf-canvas {
                box-shadow: 0 8px 32px rgba(0,0,0,0.6);
                background: white;
                touch-action: none;
                user-select: none;
                -webkit-user-select: none;
                cursor: grab;
            }
            
            #pdf-canvas:active {
                cursor: grabbing;
            }
            
            .pdf-controls {
                position: sticky;
                bottom: 0;
                padding: 16px;
                background: rgba(0,0,0,0.98);
                backdrop-filter: blur(10px);
                border-top: 2px solid rgba(139,0,0,0.4);
                box-shadow: 0 -2px 15px rgba(204,0,0,0.3);
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 12px;
                flex-wrap: wrap;
            }
            
            .pdf-nav-group {
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .pdf-nav-btn {
                width: 44px;
                height: 44px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: linear-gradient(135deg, rgba(139,0,0,0.2), rgba(0,0,0,0.5));
                border: 1px solid rgba(139,0,0,0.4);
                border-radius: 50%;
                color: #8B0000;
                font-size: 18px;
                cursor: pointer;
                transition: all 0.2s ease;
            }
            
            .pdf-nav-btn:disabled {
                opacity: 0.3;
                cursor: not-allowed;
            }
            
            .pdf-nav-btn:not(:disabled):active {
                background: linear-gradient(135deg, rgba(139,0,0,0.3), rgba(0,0,0,0.6));
                transform: scale(0.9);
            }
            
            .pdf-page-info {
                padding: 8px 16px;
                background: rgba(0,0,0,0.5);
                border: 1px solid rgba(139,0,0,0.3);
                border-radius: 20px;
                color: #CC0000;
                font-size: 14px;
                font-weight: 700;
                min-width: 80px;
                text-align: center;
            }
            
            .pdf-zoom-group {
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .pdf-zoom-btn {
                width: 36px;
                height: 36px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: linear-gradient(135deg, rgba(204,0,0,0.15), rgba(0,0,0,0.4));
                border: 1px solid rgba(204,0,0,0.3);
                border-radius: 6px;
                color: #CC0000;
                font-size: 14px;
                cursor: pointer;
                transition: all 0.2s ease;
            }
            
            .pdf-zoom-btn:active {
                background: linear-gradient(135deg, rgba(204,0,0,0.25), rgba(0,0,0,0.5));
                transform: scale(0.9);
            }
            
            .pdf-zoom-level {
                padding: 6px 12px;
                background: rgba(0,0,0,0.5);
                border: 1px solid rgba(204,0,0,0.2);
                border-radius: 6px;
                color: rgba(255,255,255,0.8);
                font-size: 12px;
                font-weight: 600;
                min-width: 50px;
                text-align: center;
            }
            
            .pdf-loading {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                text-align: center;
                z-index: 10;
            }
            
            .pdf-spinner {
                width: 60px;
                height: 60px;
                border: 4px solid rgba(204,0,0,0.2);
                border-top-color: #CC0000;
                border-radius: 50%;
                animation: spin 0.8s linear infinite;
                margin: 0 auto 16px;
            }
            
            .pdf-loading-text {
                color: rgba(200,200,200,0.9);
                font-size: 14px;
                font-weight: 600;
            }
            
            @keyframes slideUp {
                from { transform: translateY(100%); }
                to { transform: translateY(0); }
            }
            
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
            
            /* Mobile optimizations */
            @media (max-width: 768px) {
                .pdf-header {
                    padding: 10px 12px;
                }
                .pdf-title {
                    font-size: 14px;
                }
                .pdf-canvas-wrapper {
                    padding: 10px;
                }
                .pdf-controls {
                    padding: 12px;
                    flex-wrap: nowrap;
                    overflow-x: auto;
                }
                .pdf-zoom-group {
                    order: -1;
                }
            }
        </style>
        
        <!-- Header -->
        <div class="pdf-header">
            <div class="pdf-title" id="pdf-viewer-title"></div>
            <div class="pdf-buttons">
                <button class="pdf-btn" id="pdf-fullscreen-btn" title="Toggle Fullscreen">
                    <i class="fas fa-expand"></i>
                </button>
                <button class="pdf-btn" id="pdf-download-btn" title="Download">
                    <i class="fas fa-download"></i>
                </button>
                <button class="pdf-btn" id="pdf-close-btn" title="Close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>
        
        <!-- Canvas Container -->
        <div class="pdf-canvas-wrapper" id="pdf-canvas-wrapper">
            <canvas id="pdf-canvas"></canvas>
            <div class="pdf-loading" id="pdf-loading">
                <div class="pdf-spinner"></div>
                <div class="pdf-loading-text">Loading PDF...</div>
            </div>
        </div>
        
        <!-- Controls -->
        <div class="pdf-controls">
            <div class="pdf-nav-group">
                <button class="pdf-nav-btn" id="pdf-prev-btn" title="Previous Page">
                    <i class="fas fa-chevron-left"></i>
                </button>
                <div class="pdf-page-info" id="pdf-page-info">1 / 1</div>
                <button class="pdf-nav-btn" id="pdf-next-btn" title="Next Page">
                    <i class="fas fa-chevron-right"></i>
                </button>
            </div>
            <div class="pdf-zoom-group">
                <button class="pdf-zoom-btn" id="pdf-zoom-out-btn" title="Zoom Out">
                    <i class="fas fa-minus"></i>
                </button>
                <div class="pdf-zoom-level" id="pdf-zoom-level">100%</div>
                <button class="pdf-zoom-btn" id="pdf-zoom-in-btn" title="Zoom In">
                    <i class="fas fa-plus"></i>
                </button>
                <button class="pdf-zoom-btn" id="pdf-fit-btn" title="Fit to Screen">
                    <i class="fas fa-expand"></i>
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    UniversalPDFViewer.currentModal = modal;
    
    // Get references
    UniversalPDFViewer.canvas = document.getElementById('pdf-canvas');
    UniversalPDFViewer.ctx = UniversalPDFViewer.canvas.getContext('2d');
    UniversalPDFViewer.canvasWrapper = document.getElementById('pdf-canvas-wrapper');
    
    // Set title
    document.getElementById('pdf-viewer-title').textContent = UniversalPDFViewer.config.title;
    
    // Hide download button if disabled
    if (!UniversalPDFViewer.config.showDownload) {
        document.getElementById('pdf-download-btn').style.display = 'none';
    }
}

/**
 * Load PDF Document
 */
async function loadPDF(url) {
    try {
        const loadingTask = UniversalPDFViewer.pdfjsLib.getDocument(url);
        UniversalPDFViewer.pdfDoc = await loadingTask.promise;
        UniversalPDFViewer.totalPages = UniversalPDFViewer.pdfDoc.numPages;
        
        console.log(`✅ PDF loaded: ${UniversalPDFViewer.totalPages} pages`);
        
        // Hide loading, render first page
        document.getElementById('pdf-loading').style.display = 'none';
        await renderPage(1);
        updatePageInfo();
        
    } catch (error) {
        console.error('❌ Failed to load PDF:', error);
        showPDFError('Failed to load PDF file. Please try again.');
    }
}

/**
 * Render PDF Page
 */
async function renderPage(pageNum) {
    if (UniversalPDFViewer.pageRendering) {
        UniversalPDFViewer.pageNumPending = pageNum;
        return;
    }
    
    UniversalPDFViewer.pageRendering = true;
    UniversalPDFViewer.currentPage = pageNum;
    
    try {
        const page = await UniversalPDFViewer.pdfDoc.getPage(pageNum);
        
        // High-DPI rendering for sharp quality
        const pixelRatio = window.devicePixelRatio || 2;
        const outputScale = pixelRatio;
        
        // Calculate viewport with higher quality
        const viewport = page.getViewport({ scale: UniversalPDFViewer.scale });
        
        // Set canvas dimensions with pixel ratio for crisp rendering
        UniversalPDFViewer.canvas.width = Math.floor(viewport.width * outputScale);
        UniversalPDFViewer.canvas.height = Math.floor(viewport.height * outputScale);
        UniversalPDFViewer.canvas.style.width = Math.floor(viewport.width) + 'px';
        UniversalPDFViewer.canvas.style.height = Math.floor(viewport.height) + 'px';
        
        // Scale context for high-DPI
        const transform = outputScale !== 1
            ? [outputScale, 0, 0, outputScale, 0, 0]
            : null;
        
        // Render with high quality
        const renderContext = {
            canvasContext: UniversalPDFViewer.ctx,
            viewport: viewport,
            transform: transform
        };
        
        await page.render(renderContext).promise;
        
        UniversalPDFViewer.pageRendering = false;
        
        if (UniversalPDFViewer.pageNumPending !== null) {
            const pending = UniversalPDFViewer.pageNumPending;
            UniversalPDFViewer.pageNumPending = null;
            await renderPage(pending);
        }
        
        updatePageInfo();
        updateNavigationButtons();
        
    } catch (error) {
        console.error('❌ Page render error:', error);
        UniversalPDFViewer.pageRendering = false;
    }
}

/**
 * Update Page Info Display
 */
function updatePageInfo() {
    const pageInfo = document.getElementById('pdf-page-info');
    const zoomLevel = document.getElementById('pdf-zoom-level');
    
    if (pageInfo) {
        pageInfo.textContent = `${UniversalPDFViewer.currentPage} / ${UniversalPDFViewer.totalPages}`;
    }
    
    if (zoomLevel) {
        zoomLevel.textContent = `${Math.round(UniversalPDFViewer.scale * 100)}%`;
    }
}

/**
 * Update Navigation Buttons State
 */
function updateNavigationButtons() {
    const prevBtn = document.getElementById('pdf-prev-btn');
    const nextBtn = document.getElementById('pdf-next-btn');
    
    if (prevBtn) {
        prevBtn.disabled = UniversalPDFViewer.currentPage <= 1;
    }
    
    if (nextBtn) {
        nextBtn.disabled = UniversalPDFViewer.currentPage >= UniversalPDFViewer.totalPages;
    }
}

/**
 * Navigate to Previous Page
 */
function goToPrevPage() {
    if (UniversalPDFViewer.currentPage > 1) {
        renderPage(UniversalPDFViewer.currentPage - 1);
        if (navigator.vibrate) navigator.vibrate(10);
    }
}

/**
 * Navigate to Next Page
 */
function goToNextPage() {
    if (UniversalPDFViewer.currentPage < UniversalPDFViewer.totalPages) {
        renderPage(UniversalPDFViewer.currentPage + 1);
        if (navigator.vibrate) navigator.vibrate(10);
    }
}

/**
 * Zoom In
 */
function zoomIn() {
    if (UniversalPDFViewer.scale < UniversalPDFViewer.maxScale) {
        UniversalPDFViewer.scale += 0.2;
        renderPage(UniversalPDFViewer.currentPage);
        if (navigator.vibrate) navigator.vibrate(10);
    }
}

/**
 * Zoom Out
 */
function zoomOut() {
    if (UniversalPDFViewer.scale > UniversalPDFViewer.minScale) {
        UniversalPDFViewer.scale -= 0.2;
        renderPage(UniversalPDFViewer.currentPage);
        if (navigator.vibrate) navigator.vibrate(10);
    }
}

/**
 * Fit to Screen
 */
function fitToScreen() {
    const wrapper = UniversalPDFViewer.canvasWrapper;
    const wrapperWidth = wrapper.clientWidth - 40; // padding
    const wrapperHeight = wrapper.clientHeight - 40;
    
    // Get page dimensions at scale 1
    UniversalPDFViewer.scale = 1.0;
    const canvas = UniversalPDFViewer.canvas;
    const scaleX = wrapperWidth / canvas.width;
    const scaleY = wrapperHeight / canvas.height;
    
    UniversalPDFViewer.scale = Math.min(scaleX, scaleY, 2.0);
    renderPage(UniversalPDFViewer.currentPage);
    if (navigator.vibrate) navigator.vibrate(10);
}

/**
 * Toggle Fullscreen Mode
 */
function toggleFullscreen() {
    const modal = UniversalPDFViewer.currentModal;
    const btn = document.getElementById('pdf-fullscreen-btn');
    const icon = btn.querySelector('i');
    
    UniversalPDFViewer.isFullscreen = !UniversalPDFViewer.isFullscreen;
    
    if (UniversalPDFViewer.isFullscreen) {
        modal.classList.add('fullscreen');
        icon.className = 'fas fa-compress';
        
        // Show fullscreen hint
        const hint = document.createElement('div');
        hint.className = 'fullscreen-hint';
        hint.innerHTML = '<i class="fas fa-expand-arrows-alt"></i> Double-tap or press ESC to exit fullscreen';
        document.body.appendChild(hint);
        
        setTimeout(() => hint.remove(), 3000);
        
        console.log('📺 Fullscreen mode enabled');
    } else {
        modal.classList.remove('fullscreen');
        icon.className = 'fas fa-expand';
        console.log('📺 Fullscreen mode disabled');
    }
    
    if (navigator.vibrate) navigator.vibrate(10);
}

/**
 * Setup Event Listeners
 */
function setupEventListeners() {
    // Navigation buttons
    document.getElementById('pdf-prev-btn').onclick = goToPrevPage;
    document.getElementById('pdf-next-btn').onclick = goToNextPage;
    
    // Zoom buttons
    document.getElementById('pdf-zoom-in-btn').onclick = zoomIn;
    document.getElementById('pdf-zoom-out-btn').onclick = zoomOut;
    document.getElementById('pdf-fit-btn').onclick = fitToScreen;
    
    // Fullscreen button
    document.getElementById('pdf-fullscreen-btn').onclick = toggleFullscreen;
    
    // Close button
    document.getElementById('pdf-close-btn').onclick = closeUniversalPDFViewer;
    
    // Download button
    const downloadBtn = document.getElementById('pdf-download-btn');
    if (downloadBtn) {
        downloadBtn.onclick = () => {
            const link = document.createElement('a');
            link.href = UniversalPDFViewer.config.filePath;
            link.download = UniversalPDFViewer.config.downloadName;
            link.click();
            if (navigator.vibrate) navigator.vibrate([10, 20, 10]);
        };
    }
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyPress);
    
    // Touch gestures
    setupTouchGestures();
    
    // Mouse wheel zoom
    setupMouseWheelZoom();
}

/**
 * Handle Keyboard Shortcuts
 */
function handleKeyPress(e) {
    if (!UniversalPDFViewer.isOpen) return;
    
    switch(e.key) {
        case 'ArrowLeft':
        case 'PageUp':
            goToPrevPage();
            e.preventDefault();
            break;
        case 'ArrowRight':
        case 'PageDown':
        case ' ':
            goToNextPage();
            e.preventDefault();
            break;
        case '+':
        case '=':
            zoomIn();
            e.preventDefault();
            break;
        case '-':
        case '_':
            zoomOut();
            e.preventDefault();
            break;
        case '0':
            fitToScreen();
            e.preventDefault();
            break;
        case 'f':
        case 'F':
            toggleFullscreen();
            e.preventDefault();
            break;
        case 'Escape':
            if (UniversalPDFViewer.isFullscreen) {
                toggleFullscreen();
            } else {
                closeUniversalPDFViewer();
            }
            e.preventDefault();
            break;
    }
}

/**
 * Setup Touch Gestures
 */
function setupTouchGestures() {
    const canvas = UniversalPDFViewer.canvas;
    
    // Double-tap to toggle fullscreen
    let lastTapTime = 0;
    const doubleTapDelay = 300; // milliseconds
    
    canvas.addEventListener('touchend', (e) => {
        if (e.changedTouches.length === 1) {
            const currentTime = new Date().getTime();
            const tapLength = currentTime - lastTapTime;
            
            if (tapLength < doubleTapDelay && tapLength > 0) {
                // Double-tap detected
                toggleFullscreen();
                e.preventDefault();
            }
            
            lastTapTime = currentTime;
        }
    });
    
    // Pinch to zoom
    let initialDistance = 0;
    let initialScale = 1.0;
    
    canvas.addEventListener('touchstart', (e) => {
        UniversalPDFViewer.touches = Array.from(e.touches);
        
        if (e.touches.length === 2) {
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            initialDistance = Math.hypot(
                touch2.clientX - touch1.clientX,
                touch2.clientY - touch1.clientY
            );
            initialScale = UniversalPDFViewer.scale;
        }
    });
    
    canvas.addEventListener('touchmove', (e) => {
        if (e.touches.length === 2 && UniversalPDFViewer.config.allowZoom) {
            e.preventDefault();
            
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            const distance = Math.hypot(
                touch2.clientX - touch1.clientX,
                touch2.clientY - touch1.clientY
            );
            
            if (initialDistance > 0) {
                const delta = distance / initialDistance;
                let newScale = initialScale * delta;
                newScale = Math.max(UniversalPDFViewer.minScale, Math.min(newScale, UniversalPDFViewer.maxScale));
                
                if (Math.abs(newScale - UniversalPDFViewer.scale) > 0.05) {
                    UniversalPDFViewer.scale = newScale;
                    renderPage(UniversalPDFViewer.currentPage);
                }
            }
        }
    });
    
    canvas.addEventListener('touchend', () => {
        initialDistance = 0;
        UniversalPDFViewer.touches = [];
    });
    
    // Swipe for page navigation
    let startX = 0;
    let startY = 0;
    
    canvas.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        }
    });
    
    canvas.addEventListener('touchend', (e) => {
        if (e.changedTouches.length === 1) {
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            const diffX = endX - startX;
            const diffY = endY - startY;
            
            // Horizontal swipe detection
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    // Swipe right - previous page
                    goToPrevPage();
                } else {
                    // Swipe left - next page
                    goToNextPage();
                }
            }
        }
    });
}

/**
 * Setup Mouse Wheel Zoom
 */
function setupMouseWheelZoom() {
    const wrapper = UniversalPDFViewer.canvasWrapper;
    
    wrapper.addEventListener('wheel', (e) => {
        if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            
            if (e.deltaY < 0) {
                zoomIn();
            } else {
                zoomOut();
            }
        }
    }, { passive: false });
}

/**
 * Close PDF Viewer
 */
function closeUniversalPDFViewer() {
    if (UniversalPDFViewer.currentModal) {
        UniversalPDFViewer.currentModal.style.animation = 'slideDown 0.2s ease';
        
        setTimeout(() => {
            if (UniversalPDFViewer.currentModal) {
                UniversalPDFViewer.currentModal.remove();
                UniversalPDFViewer.currentModal = null;
            }
        }, 200);
        
        // Cleanup
        document.removeEventListener('keydown', handleKeyPress);
        UniversalPDFViewer.pdfDoc = null;
        UniversalPDFViewer.isOpen = false;
        
        console.log('📱 PDF Viewer closed');
    }
}

// Alias for backward compatibility
window.closeMobilePDFViewer = closeUniversalPDFViewer;

/**
 * Show Error Message
 */
function showPDFError(message) {
    const errorModal = document.createElement('div');
    errorModal.style.cssText = `
        position: fixed;
        inset: 0;
        z-index: 999999;
        background: rgba(0,0,0,0.95);
        display: flex;
        align-items: center;
        justify-content: center;
        animation: fadeIn 0.3s ease;
    `;
    
    errorModal.innerHTML = `
        <div style="text-align: center; padding: 40px 20px; max-width: 400px;">
            <div style="font-size: 64px; margin-bottom: 20px;">❌</div>
            <div style="font-size: 20px; font-weight: 700; color: #CC0000; margin-bottom: 12px;">PDF Error</div>
            <div style="font-size: 14px; color: rgba(200,200,200,0.8); margin-bottom: 30px; line-height: 1.5;">${message}</div>
            <button onclick="this.closest('div').remove()" style="
                padding: 12px 32px;
                background: linear-gradient(135deg, rgba(204,0,0,0.3), rgba(204,0,0,0.2));
                border: 1px solid rgba(204,0,0,0.5);
                border-radius: 8px;
                color: #CC0000;
                font-size: 15px;
                font-weight: 700;
                cursor: pointer;
            ">Close</button>
        </div>
    `;
    
    document.body.appendChild(errorModal);
    
    setTimeout(() => errorModal.remove(), 5000);
}

/**
 * Download Document (Fallback function)
 */
function downloadDocument(url, filename) {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

console.log('✅ Universal PDF Viewer loaded successfully');
