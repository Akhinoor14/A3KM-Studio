/**
 * ============================================================================
 * UNIVERSAL PDF VIEWER - A3KM Studio
 * PDF.js based custom viewer for mobile & desktop
 * Features: Zoom, Search, Page Navigation, Touch Gestures, Keyboard Shortcuts
 * Theme: Red, Black, White - Engineering Design
 * ============================================================================
 */

// Default password for all A3KM Studio PDFs
const A3KM_PDF_PASSWORD = 'MOUnoor21014';

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
    scale: 1.0,
    minScale: 0.3,
    maxScale: 4.0,
    defaultScale: 1.0,
    scaleFitted: false,   // true after auto fit-to-width is calculated
    isFullscreen: false,
    
    // Touch gestures
    initialPinchDistance: 0,
    lastPanX: 0,
    lastPanY: 0,
    isPanning: false,
    touches: [],
    
    // Flip guard
    isFlipping: false,
    
    // Canvas & context
    canvas: null,
    ctx: null,
    canvasWrapper: null,
    
    // Configuration
    config: {},
    
    // PDF password
    pdfPassword: null,
    
    // Blob URL (stored for memory cleanup on close)
    blobUrl: null,
    
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
            downloadName: options.downloadName || 'document.pdf',
            password: options.password !== undefined ? options.password : A3KM_PDF_PASSWORD,
            onClose: options.onClose || null,
            startPage: Math.max(1, parseInt(options.startPage) || 1)
        };
        
        // Store password for PDF loading
        UniversalPDFViewer.pdfPassword = UniversalPDFViewer.config.password;
        
        console.log('📱 Opening Universal PDF Viewer...');
        
        await initPDFJS();
        createViewerUI();
        // Wire all buttons (especially ✕ close) BEFORE loading so the user can
        // cancel a slow or hung PDF fetch. Guards in each handler protect against
        // calling them before pdfDoc is ready.
        setupEventListeners();
        
        try {
            await loadPDF(options.filePath);
        } catch (loadError) {
            // PDF failed to load — remove the skeleton viewer so the page isn't broken
            if (UniversalPDFViewer.currentModal) {
                UniversalPDFViewer.currentModal.remove();
                UniversalPDFViewer.currentModal = null;
            }
            UniversalPDFViewer.isOpen = false;
            showPDFError(loadError.message || 'Failed to load PDF.');
            return;
        }
        
        // Guard: user may have pressed ✕ while the PDF was still loading
        if (!UniversalPDFViewer.currentModal) {
            return;
        }
        
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
                background: #111;
                display: flex;
                justify-content: center;
                align-items: flex-start;
                padding: 0;
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
            
            @keyframes slideDown {
                from { transform: translateY(0); opacity: 1; }
                to { transform: translateY(100%); opacity: 0; }
            }
            
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
            
            /* Mobile optimizations */
            @media (max-width: 768px) {
                .pdf-header { padding: 10px 12px; }
                .pdf-title  { font-size: 14px; }
                .pdf-canvas-wrapper { padding: 0; }
                .pdf-controls {
                    padding: 12px;
                    flex-wrap: nowrap;
                    overflow-x: auto;
                }
                .pdf-zoom-group { order: -1; }
            }
            
            /* Canvas fills full width by default */
            #pdf-canvas {
                display: block;
                max-width: 100%;
            }

            /* ── PAGE FLIP ANIMATION ────────────────────── */
            .pdf-page-inner {
                display: flex;
                justify-content: center;
                align-items: flex-start;
                width: 100%;
                will-change: transform, opacity;
            }
            @keyframes pfiExitLeft {
                from { transform: translateX(0)   rotateY(0deg)  ; opacity: 1; }
                to   { transform: translateX(-55%) rotateY(30deg) ; opacity: 0; }
            }
            @keyframes pfiEnterRight {
                from { transform: translateX(60%)  rotateY(-25deg); opacity: 0; }
                to   { transform: translateX(0)    rotateY(0deg)  ; opacity: 1; }
            }
            @keyframes pfiExitRight {
                from { transform: translateX(0)   rotateY(0deg)   ; opacity: 1; }
                to   { transform: translateX(55%) rotateY(-30deg) ; opacity: 0; }
            }
            @keyframes pfiEnterLeft {
                from { transform: translateX(-60%) rotateY(25deg); opacity: 0; }
                to   { transform: translateX(0)    rotateY(0deg) ; opacity: 1; }
            }
            .pdf-page-inner.exit-left  { animation: pfiExitLeft  0.22s ease-in  forwards; pointer-events:none; }
            .pdf-page-inner.exit-right { animation: pfiExitRight 0.22s ease-in  forwards; pointer-events:none; }
            .pdf-page-inner.enter-right{ animation: pfiEnterRight 0.28s ease-out forwards; }
            .pdf-page-inner.enter-left { animation: pfiEnterLeft  0.28s ease-out forwards; }

            /* ── SWIPE HINT ─────────────────────────────── */
            .pdf-swipe-hint {
                position: absolute;
                inset: 0;
                z-index: 50;
                display: flex;
                align-items: center;
                justify-content: center;
                pointer-events: none;
                background: rgba(0,0,0,0.45);
                backdrop-filter: blur(2px);
                transition: opacity 0.5s ease;
            }
            .pdf-swipe-hint.hidden { opacity: 0; pointer-events: none; }
            /* left edge arrow */
            .pdf-swipe-hint::before,
            .pdf-swipe-hint::after {
                content: '';
                position: absolute;
                top: 50%; transform: translateY(-50%);
                width: 38px; height: 80px;
                border-radius: 4px;
                background: rgba(204,0,0,0.18);
                border: 1px solid rgba(204,0,0,0.35);
            }
            .pdf-swipe-hint::before { left: 0; border-radius: 0 8px 8px 0; }
            .pdf-swipe-hint::after  { right:0; border-radius: 8px 0 0 8px; }
            /* chevrons inside edges */
            .swipe-hint-left-arrow,
            .swipe-hint-right-arrow {
                position: absolute;
                top: 50%; transform: translateY(-50%);
                font-size: 18px;
                color: rgba(204,0,0,0.75);
                animation: pulseArrow 1.2s ease-in-out infinite;
            }
            .swipe-hint-left-arrow  { left: 8px; animation-direction: normal; }
            .swipe-hint-right-arrow { right:8px; animation-direction: reverse; }
            @keyframes pulseArrow {
                0%,100% { opacity: 0.3; transform: translateY(-50%) translateX(0); }
                50%      { opacity: 1;   transform: translateY(-50%) translateX(4px); }
            }
            /* center hand icon */
            .swipe-hint-hand {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 14px;
            }
            .swipe-hint-hand i {
                font-size: 42px;
                color: rgba(255,255,255,0.9);
                filter: drop-shadow(0 0 12px rgba(204,0,0,0.7));
                animation: swipeGesture 1.8s cubic-bezier(0.4,0,0.2,1) infinite;
            }
            @keyframes swipeGesture {
                0%   { transform: translateX(28px)  ; opacity: 0;   }
                15%  { transform: translateX(28px)  ; opacity: 1;   }
                50%  { transform: translateX(-28px) ; opacity: 1;   }
                85%  { transform: translateX(-28px) ; opacity: 0.8; }
                100% { transform: translateX(28px)  ; opacity: 0;   }
            }
            .swipe-hint-dots {
                display: flex; gap: 6px;
            }
            .swipe-hint-dots span {
                width: 6px; height: 6px;
                border-radius: 50%;
                background: rgba(255,255,255,0.3);
            }
            .swipe-hint-dots span:nth-child(2) { background: rgba(204,0,0,0.8); transform: scale(1.4); }
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
        <div class="pdf-canvas-wrapper" id="pdf-canvas-wrapper" style="overflow:auto; perspective:900px;">
            <div class="pdf-page-inner" id="pdf-page-inner">
                <canvas id="pdf-canvas"></canvas>
            </div>
            <div class="pdf-loading" id="pdf-loading">
                <div class="pdf-spinner"></div>
                <div class="pdf-loading-text">Loading PDF...</div>
            </div>
            <!-- Swipe gesture guide: shows once after load, hides on first touch -->
            <div class="pdf-swipe-hint hidden" id="pdf-swipe-hint">
                <i class="swipe-hint-left-arrow fas fa-chevron-right"></i>
                <div class="swipe-hint-hand">
                    <i class="fas fa-hand-pointer"></i>
                    <div class="swipe-hint-dots">
                        <span></span><span></span><span></span>
                    </div>
                </div>
                <i class="swipe-hint-right-arrow fas fa-chevron-left"></i>
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
        console.log('🔄 Loading PDF from:', url);
        
        // Prevent browser from downloading - load as blob
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        UniversalPDFViewer.blobUrl = blobUrl; // stored so we can revoke on close
        
        console.log('✅ PDF fetched as blob, loading with PDF.js...');
        
        // Prepare PDF loading options with password support
        const loadingOptions = { url: blobUrl };
        
        // Add password if provided
        if (UniversalPDFViewer.pdfPassword) {
            loadingOptions.password = UniversalPDFViewer.pdfPassword;
            console.log('🔐 Loading password-protected PDF...');
        }
        
        const loadingTask = UniversalPDFViewer.pdfjsLib.getDocument(loadingOptions);
        
        // Handle password requirement.
        // PDF.js onPassword is a sync callback — throw inside it does NOT reject the
        // task promise. Use Promise.race with a manually-controlled rejection instead.
        let _rejectPassword;
        const passwordFailPromise = new Promise((_, reject) => { _rejectPassword = reject; });
        loadingTask.onPassword = (updatePassword, reason) => {
            if (reason === 1) { // NEED_PASSWORD
                console.log('🔐 PDF requires password, using A3KM password...');
                if (UniversalPDFViewer.pdfPassword) {
                    updatePassword(UniversalPDFViewer.pdfPassword);
                } else {
                    _rejectPassword(new Error('This PDF is password-protected. No password provided.'));
                }
            } else if (reason === 2) { // INCORRECT_PASSWORD
                console.error('❌ Incorrect PDF password');
                _rejectPassword(new Error('Incorrect PDF password. Access denied.'));
            }
        };
        
        UniversalPDFViewer.pdfDoc = await Promise.race([loadingTask.promise, passwordFailPromise]);
        UniversalPDFViewer.totalPages = UniversalPDFViewer.pdfDoc.numPages;
        
        console.log(`✅ PDF loaded: ${UniversalPDFViewer.totalPages} pages`);
        
        // Hide loading, render from saved reading position (or page 1)
        document.getElementById('pdf-loading').style.display = 'none';
        await renderPage(UniversalPDFViewer.config.startPage || 1);
        updatePageInfo();
        
        // Show swipe hint briefly after first load
        setTimeout(() => {
            const hint = document.getElementById('pdf-swipe-hint');
            if (hint) {
                hint.classList.remove('hidden');
                setTimeout(() => hint.classList.add('hidden'), 2600);
            }
        }, 400);
        
    } catch (error) {
        console.error('❌ Failed to load PDF:', error);
        // Revoke blob URL so it doesn't leak if loading fails before viewer formally opens
        if (UniversalPDFViewer.blobUrl) {
            URL.revokeObjectURL(UniversalPDFViewer.blobUrl);
            UniversalPDFViewer.blobUrl = null;
        }
        // Re-throw so openUniversalPDFViewer can remove the skeleton modal and show the
        // error. If loadPDF silently swallows the error, the skeleton stays alive with
        // isOpen=true — a permanently broken viewer the user can never close.
        throw error;
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
    
    // Guard: viewer may have been closed while a render was queued
    if (!UniversalPDFViewer.pdfDoc || !UniversalPDFViewer.canvas) {
        return;
    }
    
    UniversalPDFViewer.pageRendering = true;
    UniversalPDFViewer.currentPage = pageNum;
    
    try {
        const page = await UniversalPDFViewer.pdfDoc.getPage(pageNum);

        // Re-check after async suspension: closeUniversalPDFViewer may have nulled
        // canvas/ctx while getPage() was pending. Without this guard the next line
        // (canvas.width = ...) throws TypeError: Cannot set property 'width' of null.
        if (!UniversalPDFViewer.canvas || !UniversalPDFViewer.pdfDoc) {
            UniversalPDFViewer.pageRendering = false;
            return;
        }

        // Auto fit-to-width on very first render
        if (!UniversalPDFViewer.scaleFitted) {
            const wrapper = document.getElementById('pdf-canvas-wrapper');
            const availableWidth = (wrapper ? wrapper.clientWidth : window.innerWidth) || window.innerWidth;
            const naturalViewport = page.getViewport({ scale: 1.0 });
            const fitScale = availableWidth / naturalViewport.width;
            UniversalPDFViewer.scale = Math.min(fitScale, 2.5); // cap at 2.5× for clarity
            UniversalPDFViewer.defaultScale = UniversalPDFViewer.scale;
            UniversalPDFViewer.scaleFitted = true;
        }
        
        // MAXIMUM QUALITY: Higher DPR for ultra-sharp text rendering
        const pixelRatio = Math.min(window.devicePixelRatio || 2, 4);
        const outputScale = pixelRatio;
        
        // Calculate viewport with current scale
        const viewport = page.getViewport({ scale: UniversalPDFViewer.scale });
        
        // Set canvas dimensions with pixel ratio for crisp rendering
        UniversalPDFViewer.canvas.width = Math.floor(viewport.width * outputScale);
        UniversalPDFViewer.canvas.height = Math.floor(viewport.height * outputScale);
        UniversalPDFViewer.canvas.style.width = Math.floor(viewport.width) + 'px';
        UniversalPDFViewer.canvas.style.height = Math.floor(viewport.height) + 'px';
        
        // CSS optimizations for sharp rendering
        UniversalPDFViewer.canvas.style.imageRendering = 'auto';
        UniversalPDFViewer.canvas.style.webkitFontSmoothing = 'antialiased';
        
        // CRITICAL: Enable smoothing for sharp high-DPI text rendering
        UniversalPDFViewer.ctx.imageSmoothingEnabled = true;
        UniversalPDFViewer.ctx.imageSmoothingQuality = 'high';
        UniversalPDFViewer.ctx.webkitImageSmoothingEnabled = true;
        UniversalPDFViewer.ctx.mozImageSmoothingEnabled = true;
        UniversalPDFViewer.ctx.msImageSmoothingEnabled = true;
        
        // Scale context for high-DPI
        const transform = outputScale !== 1
            ? [outputScale, 0, 0, outputScale, 0, 0]
            : null;
        
        // Render with high quality
        const renderContext = {
            canvasContext: UniversalPDFViewer.ctx,
            viewport: viewport,
            transform: transform,
            intent: 'display',
            renderInteractiveForms: false,
            enableWebGL: false,
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
        flipPage('right');
        if (navigator.vibrate) navigator.vibrate(10);
    }
}

/**
 * Navigate to Next Page
 */
function goToNextPage() {
    if (UniversalPDFViewer.currentPage < UniversalPDFViewer.totalPages) {
        flipPage('left');
        if (navigator.vibrate) navigator.vibrate(10);
    }
}

/**
 * Animated page flip: direction 'left'=next page, 'right'=prev page
 */
async function flipPage(direction) {
    // Prevent overlapping flip animations
    if (UniversalPDFViewer.isFlipping) return;
    UniversalPDFViewer.isFlipping = true;

    // Hide swipe hint on first use
    const hint = document.getElementById('pdf-swipe-hint');
    if (hint) hint.classList.add('hidden');

    const inner = document.getElementById('pdf-page-inner');
    if (!inner) {
        // fallback
        const fallbackPage = direction === 'left'
            ? UniversalPDFViewer.currentPage + 1
            : UniversalPDFViewer.currentPage - 1;
        await renderPage(fallbackPage);
        UniversalPDFViewer.isFlipping = false;
        return;
    }

    const wrapper    = document.getElementById('pdf-canvas-wrapper');
    const exitClass  = direction === 'left' ? 'exit-left'   : 'exit-right';
    const enterClass = direction === 'left' ? 'enter-right'  : 'enter-left';
    const nextPage   = direction === 'left'
        ? UniversalPDFViewer.currentPage + 1
        : UniversalPDFViewer.currentPage - 1;

    // Lock overflow so the translation off-screen works without scrollbars
    if (wrapper) wrapper.style.overflow = 'hidden';

    // Exit animation
    inner.classList.add(exitClass);
    await delay(200);
    inner.classList.remove(exitClass);
    // Hide the blank canvas during re-render to prevent black flash between animations
    inner.style.opacity = '0';

    // Cancel any stale queued render, wait for in-progress render to fully settle,
    // then render the correct target page before playing the enter animation.
    // (Setting pageNumPending here would race: pageRendering briefly goes false
    //  between renders and our old wait resolved too early on old content.)
    UniversalPDFViewer.pageNumPending = null;
    if (UniversalPDFViewer.pageRendering) {
        await new Promise(resolve => {
            const check = setInterval(() => {
                if (!UniversalPDFViewer.pageRendering || !UniversalPDFViewer.isOpen) {
                    clearInterval(check);
                    resolve();
                }
            }, 20);
        });
    }
    // Guard against viewer being closed while we waited
    if (!UniversalPDFViewer.isOpen) {
        UniversalPDFViewer.isFlipping = false;
        return;
    }
    await renderPage(nextPage);

    // Guard: viewer may have been closed while renderPage was awaited
    if (!UniversalPDFViewer.isOpen) {
        UniversalPDFViewer.isFlipping = false;
        return;
    }

    // Enter animation — clear inline opacity so the animation's own opacity takes over
    inner.style.opacity = '';
    inner.classList.add(enterClass);
    await delay(280);
    inner.classList.remove(enterClass);

    // Restore scrollability so zoomed-in pages can be panned
    if (wrapper) wrapper.style.overflow = 'auto';
    UniversalPDFViewer.isFlipping = false;
}

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

/**
 * Zoom In
 */
function zoomIn() {
    if (UniversalPDFViewer.isFlipping) return;
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
    if (UniversalPDFViewer.isFlipping) return;
    if (UniversalPDFViewer.scale > UniversalPDFViewer.minScale) {
        UniversalPDFViewer.scale -= 0.2;
        renderPage(UniversalPDFViewer.currentPage);
        if (navigator.vibrate) navigator.vibrate(10);
    }
}

/**
 * Fit to Screen
 */
async function fitToScreen() {
    if (UniversalPDFViewer.isFlipping) return;
    // Guard: don't crash if called after viewer is closed
    if (!UniversalPDFViewer.canvasWrapper || !UniversalPDFViewer.pdfDoc || !UniversalPDFViewer.isOpen) return;
    const wrapper = UniversalPDFViewer.canvasWrapper;
    const wrapperWidth  = wrapper.clientWidth;
    const wrapperHeight = wrapper.clientHeight;

    // Re-measure against natural page size at scale 1
    const page = await UniversalPDFViewer.pdfDoc.getPage(UniversalPDFViewer.currentPage);
    const naturalVP = page.getViewport({ scale: 1.0 });
    const scaleX = wrapperWidth  / naturalVP.width;
    const scaleY = wrapperHeight / naturalVP.height;

    UniversalPDFViewer.scale = Math.min(scaleX, scaleY, 2.5);
    renderPage(UniversalPDFViewer.currentPage);
    if (navigator.vibrate) navigator.vibrate(10);
}

/**
 * Toggle Fullscreen Mode
 */
function toggleFullscreen() {
    // Guard: don't crash if called during close animation or before open
    if (!UniversalPDFViewer.isOpen || !UniversalPDFViewer.currentModal) return;
    const modal = UniversalPDFViewer.currentModal;
    const btn = document.getElementById('pdf-fullscreen-btn');
    if (!btn) return;
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
    const prevBtn = document.getElementById('pdf-prev-btn');
    const nextBtn = document.getElementById('pdf-next-btn');
    if (prevBtn) prevBtn.onclick = goToPrevPage;
    if (nextBtn) nextBtn.onclick = goToNextPage;
    
    // Zoom buttons
    const zoomInBtn = document.getElementById('pdf-zoom-in-btn');
    const zoomOutBtn = document.getElementById('pdf-zoom-out-btn');
    const fitBtn = document.getElementById('pdf-fit-btn');
    if (zoomInBtn) zoomInBtn.onclick = zoomIn;
    if (zoomOutBtn) zoomOutBtn.onclick = zoomOut;
    if (fitBtn) fitBtn.onclick = fitToScreen;
    
    // Fullscreen button
    const fullscreenBtn = document.getElementById('pdf-fullscreen-btn');
    if (fullscreenBtn) fullscreenBtn.onclick = toggleFullscreen;
    
    // Close button
    const closeBtn = document.getElementById('pdf-close-btn');
    if (closeBtn) closeBtn.onclick = closeUniversalPDFViewer;
    
    // Download button
    const downloadBtn = document.getElementById('pdf-download-btn');
    if (downloadBtn) {
        downloadBtn.onclick = () => {
            const link = document.createElement('a');
            // Use the already-fetched blobUrl. It is same-origin so the `download`
            // attribute is honoured (correct filename). config.filePath may be a
            // CORS-proxy URL where `download` is ignored and the filename comes from
            // the proxy's Content-Disposition header instead.
            link.href = UniversalPDFViewer.blobUrl || UniversalPDFViewer.config.filePath;
            link.download = UniversalPDFViewer.config.downloadName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            if (navigator.vibrate) navigator.vibrate([10, 20, 10]);
        };
    }
    
    // Keyboard shortcuts (remove first to prevent duplicate listeners on reopen)
    document.removeEventListener('keydown', handleKeyPress);
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
 * Single touchstart + touchmove + touchend to avoid handler conflicts.
 * Swipe and double-tap are mutually exclusive: swipe resets tap timer so
 * two fast swipes cannot accidentally trigger fullscreen toggle.
 */
function setupTouchGestures() {
    const canvas = UniversalPDFViewer.canvas;

    let lastTapTime   = 0;
    const doubleTapDelay = 300;
    let startX = 0, startY = 0;
    let initialDistance = 0, initialScale = 1.0;

    // Single touchstart: track single-finger origin and pinch init
    canvas.addEventListener('touchstart', (e) => {
        UniversalPDFViewer.touches = Array.from(e.touches);

        if (e.touches.length === 1) {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        } else if (e.touches.length === 2) {
            const t1 = e.touches[0], t2 = e.touches[1];
            initialDistance = Math.hypot(
                t2.clientX - t1.clientX,
                t2.clientY - t1.clientY
            );
            initialScale = UniversalPDFViewer.scale;
        }
    });

    // Pinch-to-zoom (guarded during flip to avoid mid-animation re-render)
    canvas.addEventListener('touchmove', (e) => {
        if (e.touches.length === 2 && UniversalPDFViewer.config.allowZoom) {
            e.preventDefault();
            if (UniversalPDFViewer.isFlipping) return;

            const t1 = e.touches[0], t2 = e.touches[1];
            const distance = Math.hypot(
                t2.clientX - t1.clientX,
                t2.clientY - t1.clientY
            );

            if (initialDistance > 0) {
                const delta = distance / initialDistance;
                let newScale = Math.max(
                    UniversalPDFViewer.minScale,
                    Math.min(initialScale * delta, UniversalPDFViewer.maxScale)
                );
                if (Math.abs(newScale - UniversalPDFViewer.scale) > 0.05) {
                    UniversalPDFViewer.scale = newScale;
                    renderPage(UniversalPDFViewer.currentPage);
                }
            }
        }
    }, { passive: false });

    // Single touchend: handles pinch reset + swipe navigation + double-tap fullscreen.
    // Swipe and double-tap are decided from the same touch so they can't conflict.
    canvas.addEventListener('touchend', (e) => {
        // Reset pinch state when all fingers lifted
        if (e.touches.length < 2) {
            initialDistance = 0;
            UniversalPDFViewer.touches = [];
        }

        if (e.changedTouches.length === 1) {
            const endX  = e.changedTouches[0].clientX;
            const endY  = e.changedTouches[0].clientY;
            const diffX = endX - startX;
            const diffY = endY - startY;
            const isSwipe = Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50;

            if (isSwipe) {
                // Swipe: page navigation
                if (diffX > 0) {
                    goToPrevPage(); // swipe right → previous page
                } else {
                    goToNextPage(); // swipe left  → next page
                }
                // Reset tap timer: two fast swipes must NOT trigger double-tap
                lastTapTime = 0;
            } else {
                // Tap: check for double-tap to toggle fullscreen
                const now = Date.now();
                const tapLength = now - lastTapTime;
                if (tapLength < doubleTapDelay && tapLength > 0) {
                    toggleFullscreen();
                    e.preventDefault();
                    lastTapTime = 0; // reset to prevent triple-tap chaining
                } else {
                    lastTapTime = now;
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
        // Capture and clear currentModal IMMEDIATELY so any pending 200ms timeout
        // from a previous close() cannot remove a newly-created viewer modal.
        const modalToRemove = UniversalPDFViewer.currentModal;
        UniversalPDFViewer.currentModal = null;
        
        modalToRemove.style.animation = 'slideDown 0.2s ease';
        setTimeout(() => modalToRemove.remove(), 200);
        
        // Fire onClose callback before resetting state so caller can read currentPage
        if (UniversalPDFViewer.config && UniversalPDFViewer.config.onClose) {
            UniversalPDFViewer.config.onClose(UniversalPDFViewer.currentPage);
        }
        
        // Revoke blob URL to prevent memory leak
        if (UniversalPDFViewer.blobUrl) {
            URL.revokeObjectURL(UniversalPDFViewer.blobUrl);
            UniversalPDFViewer.blobUrl = null;
        }
        
        // Remove keyboard listener
        document.removeEventListener('keydown', handleKeyPress);
        
        // Full state reset — prevents stale state (especially isFlipping) on next open
        UniversalPDFViewer.pdfDoc         = null;
        UniversalPDFViewer.isOpen         = false;
        UniversalPDFViewer.scaleFitted    = false;
        UniversalPDFViewer.scale          = 1.0;
        UniversalPDFViewer.defaultScale   = 1.0;
        UniversalPDFViewer.currentPage    = 1;
        UniversalPDFViewer.totalPages     = 0;
        UniversalPDFViewer.pageRendering  = false;
        UniversalPDFViewer.pageNumPending = null;
        UniversalPDFViewer.isFlipping     = false;
        UniversalPDFViewer.isFullscreen   = false;
        UniversalPDFViewer.canvas         = null;
        UniversalPDFViewer.ctx            = null;
        UniversalPDFViewer.canvasWrapper  = null;
        UniversalPDFViewer.pdfPassword    = null;
        UniversalPDFViewer.config         = {};
        
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
    errorModal.id = 'pdf-error-modal';
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
    
    // Escape the message before injecting into innerHTML to prevent XSS.
    // Error messages can originate from HTTP response text or PDF.js internals
    // which could carry a payload if a server is malicious.
    const safeMsg = message.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    errorModal.innerHTML = `
        <div style="text-align: center; padding: 40px 20px; max-width: 400px;">
            <div style="font-size: 64px; margin-bottom: 20px;">❌</div>
            <div style="font-size: 20px; font-weight: 700; color: #CC0000; margin-bottom: 12px;">PDF Error</div>
            <div style="font-size: 14px; color: rgba(200,200,200,0.8); margin-bottom: 30px; line-height: 1.5;">${safeMsg}</div>
            <button onclick="document.getElementById('pdf-error-modal').remove()" style="
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
