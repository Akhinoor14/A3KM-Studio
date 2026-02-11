/**
 * Mobile Markdown Fullscreen Viewer
 * Opens markdown files in fullscreen modal with advanced rendering
 * Companion to markdown-viewer.js with modal UI
 */

const MarkdownModal = {
    currentModal: null,
    isOpen: false,
    currentContent: '',
    fontSize: 16, // Base font size
    scrollPosition: 0
};

/**
 * Open markdown file in fullscreen viewer
 * @param {Object} options - Viewer configuration
 */
function openMarkdownViewer(options = {}) {
    try {
        if (!options.mdPath && !options.mdContent) {
            throw new Error('Either mdPath or mdContent is required');
        }

        // Close existing viewer
        if (MarkdownModal.isOpen) {
            closeMarkdownViewer();
        }

        console.log('📄 Opening markdown viewer...');

        const config = {
            mdPath: options.mdPath || null,
            mdContent: options.mdContent || null,
            title: options.title || 'Markdown Viewer',
            showTOC: options.showTOC !== false,
            showToolbar: options.showToolbar !== false,
            allowZoom: options.allowZoom !== false,
            showDownload: options.showDownload !== false,
            downloadName: options.downloadName || 'document.md',
            // Sequential navigation callbacks (optional)
            nextCallback: options.nextCallback || null,
            prevCallback: options.prevCallback || null,
            navigationLabel: options.navigationLabel || 'Item' // e.g., "Project", "Post"
        };

        // Create modal
        createMarkdownModal(config);

        // Load content
        if (config.mdPath) {
            loadMarkdownFromFile(config.mdPath, config);
        } else {
            renderMarkdownContent(config.mdContent, config);
        }

    } catch (error) {
        console.error('❌ Error opening markdown viewer:', error);
        alert('Unable to open markdown viewer. Error: ' + error.message);
    }
}

/**
 * Create fullscreen modal structure
 */
function createMarkdownModal(config) {
    const modal = document.createElement('div');
    modal.id = 'markdown-viewer-modal';
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
        animation: mdViewerSlideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        overflow: hidden;
    `;

    // Header
    const header = createHeader(config);
    modal.appendChild(header);

    // Toolbar (optional)
    if (config.showToolbar) {
        const toolbar = createToolbar(config);
        modal.appendChild(toolbar);
    }

    // Content container
    const contentContainer = document.createElement('div');
    contentContainer.id = 'md-modal-content';
    contentContainer.style.cssText = `
        flex: 1;
        overflow-y: auto;
        overflow-x: hidden;
        -webkit-overflow-scrolling: touch;
        padding: 24px 16px;
        font-size: ${MarkdownModal.fontSize}px;
        transition: font-size 0.2s ease;
    `;

    // Loading state
    contentContainer.innerHTML = `
        <div style="
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 300px;
            color: rgba(200,200,200,0.9);
        ">
            <div style="
                width: 60px;
                height: 60px;
                border: 4px solid rgba(205,92,92,0.2);
                border-top-color: #CD5C5C;
                border-radius: 50%;
                animation: mdSpin 0.8s linear infinite;
                margin-bottom: 20px;
            "></div>
            <div style="font-size: 15px; font-weight: 600;">Loading markdown...</div>
        </div>
    `;

    modal.appendChild(contentContainer);

    // Add animations
    addModalAnimations();

    // Add to page
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';

    MarkdownModal.currentModal = modal;
    MarkdownModal.isOpen = true;
    
    // Add keyboard navigation (arrow keys for next/prev)
    if (config.nextCallback || config.prevCallback) {
        setupKeyboardNavigation(config);
    }

    console.log('✅ Markdown modal created');
}

/**
 * Setup keyboard navigation for sequential content
 */
function setupKeyboardNavigation(config) {
    const handleKeyPress = (e) => {
        // Only handle if modal is open
        if (!MarkdownModal.isOpen) {
            document.removeEventListener('keydown', handleKeyPress);
            return;
        }
        
        // Ignore if user is typing in input/textarea
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }
        
        if (e.key === 'ArrowLeft' && config.prevCallback) {
            e.preventDefault();
            console.log('⬅️ Previous (keyboard)');
            config.prevCallback();
        } else if (e.key === 'ArrowRight' && config.nextCallback) {
            e.preventDefault();
            console.log('➡️ Next (keyboard)');
            config.nextCallback();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            closeMarkdownViewer();
        }
    };
    
    document.addEventListener('keydown', handleKeyPress);
    console.log('⌨️ Keyboard navigation enabled (← → Esc)');
}

/**
 * Create header with controls
 */
function createHeader(config) {
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
    const title = document.createElement('div');
    title.style.cssText = `
        font-size: 16px;
        font-weight: 700;
        color: #FFFFFF;
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-right: 12px;
    `;
    title.innerHTML = `<i class="fas fa-markdown" style="color:#CD5C5C; margin-right:8px;"></i>${config.title}`;

    // Buttons
    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = 'display: flex; gap: 8px; align-items: center;';

    // Download button
    if (config.showDownload && config.mdPath) {
        const downloadBtn = createHeaderButton('download', 'Download MD', () => {
            downloadMarkdown(config.mdPath, config.downloadName);
        });
        buttonContainer.appendChild(downloadBtn);
    }

    // Navigation buttons (if callbacks provided)
    if (config.prevCallback) {
        const prevBtn = createHeaderButton('arrow-left', `Prev ${config.navigationLabel}`, config.prevCallback);
        buttonContainer.appendChild(prevBtn);
    }
    if (config.nextCallback) {
        const nextBtn = createHeaderButton('arrow-right', `Next ${config.navigationLabel}`, config.nextCallback);
        buttonContainer.appendChild(nextBtn);
    }

    // Close button
    const closeBtn = createHeaderButton('times', 'Close', closeMarkdownViewer);
    buttonContainer.appendChild(closeBtn);

    header.appendChild(title);
    header.appendChild(buttonContainer);

    return header;
}

/**
 * Create toolbar with controls
 */
function createToolbar(config) {
    const toolbar = document.createElement('div');
    toolbar.style.cssText = `
        position: sticky;
        top: 60px;
        z-index: 99;
        padding: 8px 12px;
        background: linear-gradient(135deg, rgba(0,0,0,0.95), rgba(20,0,0,0.9));
        backdrop-filter: blur(8px);
        border-bottom: 1px solid rgba(139,0,0,0.3);
        display: flex;
        gap: 8px;
        align-items: center;
        justify-content: flex-start;
        overflow-x: auto;
        overflow-y: hidden;
        flex-shrink: 0;
        white-space: nowrap;
        -webkit-overflow-scrolling: touch;
        scrollbar-width: none;
        -ms-overflow-style: none;
    `;
    
    // Hide scrollbar for webkit browsers
    toolbar.style.setProperty('&::-webkit-scrollbar', 'display: none');

    // TOC Toggle
    if (config.showTOC) {
        const tocBtn = createToolbarButton('list', 'TOC', toggleTOC, true);
        toolbar.appendChild(tocBtn);
    }

    // Font size controls
    if (config.allowZoom) {
        const zoomOut = createToolbarButton('search-minus', 'A-', () => adjustFontSize(-2), true);
        const zoomReset = createToolbarButton('font', 'Reset', resetFontSize, true);
        const zoomIn = createToolbarButton('search-plus', 'A+', () => adjustFontSize(2), true);
        
        toolbar.appendChild(zoomOut);
        toolbar.appendChild(zoomReset);
        toolbar.appendChild(zoomIn);
    }

    // Scroll to top
    const scrollTop = createToolbarButton('arrow-up', 'Top', () => {
        const content = document.getElementById('md-modal-content');
        if (content) {
            content.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, true);
    toolbar.appendChild(scrollTop);

    return toolbar;
}

/**
 * Create header button
 */
function createHeaderButton(icon, label, onClick) {
    const btn = document.createElement('button');
    btn.innerHTML = `<i class="fas fa-${icon}"></i>`;
    btn.title = label;
    btn.style.cssText = `
        width: 42px;
        height: 42px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, rgba(205,92,92,0.2), rgba(205,92,92,0.1));
        border: 1px solid rgba(205,92,92,0.3);
        border-radius: 10px;
        color: #CD5C5C;
        font-size: 16px;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: inset 0 1px 0 rgba(255,255,255,0.05);
    `;
    
    btn.ontouchstart = (e) => {
        e.currentTarget.style.background = 'linear-gradient(135deg, rgba(205,92,92,0.3), rgba(205,92,92,0.15))';
        if (navigator.vibrate) navigator.vibrate(10);
    };
    
    btn.ontouchend = (e) => {
        e.currentTarget.style.background = 'linear-gradient(135deg, rgba(205,92,92,0.2), rgba(205,92,92,0.1))';
        onClick();
    };
    
    return btn;
}

/**
 * Create toolbar button
 */
function createToolbarButton(icon, text, onClick, compact = false) {
    const btn = document.createElement('button');
    
    if (compact) {
        // Compact mode: smaller button with icon + text inline
        btn.innerHTML = `<i class="fas fa-${icon}" style="font-size:12px;"></i><span style="margin-left:5px; font-size:12px;">${text}</span>`;
        btn.style.cssText = `
            padding: 6px 10px;
            background: linear-gradient(135deg, rgba(205,92,92,0.15), rgba(0,0,0,0.4));
            border: 1px solid rgba(205,92,92,0.25);
            border-radius: 6px;
            color: rgba(200,200,200,0.95);
            font-size: 12px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            white-space: nowrap;
            flex-shrink: 0;
            box-shadow: inset 0 1px 0 rgba(255,255,255,0.05);
        `;
    } else {
        // Normal mode
        btn.innerHTML = `<i class="fas fa-${icon}"></i><span style="margin-left:6px;">${text}</span>`;
        btn.style.cssText = `
            padding: 8px 14px;
            background: linear-gradient(135deg, rgba(205,92,92,0.15), rgba(0,0,0,0.3));
            border: 1px solid rgba(205,92,92,0.25);
            border-radius: 8px;
            color: rgba(200,200,200,0.9);
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            box-shadow: inset 0 1px 0 rgba(255,255,255,0.05);
        `;
    }
    
    btn.ontouchstart = () => {
        btn.style.background = 'linear-gradient(135deg, rgba(205,92,92,0.25), rgba(0,0,0,0.4))';
        btn.style.transform = 'scale(0.95)';
    };
    
    btn.ontouchend = () => {
        btn.style.background = 'linear-gradient(135deg, rgba(205,92,92,0.15), rgba(0,0,0,0.3))';
        btn.style.transform = 'scale(1)';
        onClick();
    };
    
    return btn;
}

/**
 * Load markdown from file
 */
async function loadMarkdownFromFile(filePath, config) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const markdown = await response.text();
        console.log(`✅ Loaded ${markdown.length} chars from ${filePath}`);
        
        renderMarkdownContent(markdown, config);
        
    } catch (error) {
        console.error('❌ Failed to load markdown:', error);
        showError('Failed to load markdown file. Please check the path and try again.');
    }
}

/**
 * Render markdown content
 */
function renderMarkdownContent(markdown, config) {
    const container = document.getElementById('md-modal-content');
    if (!container) return;

    // Render markdown using the viewer library
    const html = renderMarkdown(markdown, {
        generateTOC: config.showTOC,
        syntaxHighlight: true,
        showLineNumbers: true,
        copyButton: true,
        sanitize: true,
        theme: 'dark-red'
    });

    // Wrapper for max-width
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'max-width: 900px; margin: 0 auto;';

    // Add TOC if enabled
    if (config.showTOC) {
        const tocHtml = generateTOC();
        if (tocHtml) {
            wrapper.innerHTML = tocHtml;
        }
    }

    // Add markdown content
    const contentDiv = document.createElement('div');
    contentDiv.innerHTML = html;
    wrapper.appendChild(contentDiv);

    container.innerHTML = '';
    container.appendChild(wrapper);

    // Add smooth scroll for TOC links
    container.querySelectorAll('.md-toc-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').slice(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                if (navigator.vibrate) navigator.vibrate(10);
            }
        });
    });

    // Add smooth scroll for heading anchors
    container.querySelectorAll('.md-heading-anchor').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const href = anchor.getAttribute('href');
            const targetId = href.slice(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                if (navigator.vibrate) navigator.vibrate(10);
            }
        });
    });

    MarkdownModal.currentContent = markdown;

    console.log('✅ Markdown rendered successfully');
}

/**
 * Toggle TOC visibility
 */
function toggleTOC() {
    const toc = document.querySelector('.md-toc');
    if (toc) {
        toc.style.display = toc.style.display === 'none' ? 'block' : 'none';
        if (navigator.vibrate) navigator.vibrate(10);
    }
}

/**
 * Adjust font size
 */
function adjustFontSize(delta) {
    MarkdownModal.fontSize = Math.max(12, Math.min(24, MarkdownModal.fontSize + delta));
    const content = document.getElementById('md-modal-content');
    if (content) {
        content.style.fontSize = `${MarkdownModal.fontSize}px`;
        if (navigator.vibrate) navigator.vibrate(10);
    }
}

/**
 * Reset font size
 */
function resetFontSize() {
    MarkdownModal.fontSize = 16;
    const content = document.getElementById('md-modal-content');
    if (content) {
        content.style.fontSize = '16px';
        if (navigator.vibrate) navigator.vibrate(10);
    }
}

/**
 * Show error message
 */
function showError(message) {
    const container = document.getElementById('md-modal-content');
    if (container) {
        container.innerHTML = `
            <div style="
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                min-height: 300px;
                text-align: center;
                padding: 40px 20px;
            ">
                <i class="fas fa-exclamation-triangle" style="
                    font-size: 64px;
                    color: rgba(205,92,92,0.6);
                    margin-bottom: 24px;
                "></i>
                <h3 style="
                    font-size: 20px;
                    font-weight: 700;
                    color: rgba(200,200,200,0.9);
                    margin-bottom: 12px;
                ">Failed to Load</h3>
                <p style="
                    font-size: 15px;
                    color: rgba(150,150,150,0.8);
                    max-width: 400px;
                    line-height: 1.6;
                ">${message}</p>
            </div>
        `;
    }
}

/**
 * Download markdown file
 */
function downloadMarkdown(filePath, filename) {
    try {
        const a = document.createElement('a');
        a.href = filePath;
        a.download = filename;
        a.target = '_blank';
        a.style.display = 'none';
        
        document.body.appendChild(a);
        a.click();
        
        setTimeout(() => {
            document.body.removeChild(a);
            if (navigator.vibrate) navigator.vibrate([10, 50, 10]);
        }, 100);
        
    } catch (error) {
        console.error('❌ Download error:', error);
        alert('Unable to download file. Please try again.');
    }
}

/**
 * Close markdown viewer
 */
function closeMarkdownViewer() {
    if (MarkdownModal.currentModal) {
        MarkdownModal.currentModal.style.animation = 'mdViewerSlideDown 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        
        setTimeout(() => {
            if (MarkdownModal.currentModal) {
                MarkdownModal.currentModal.remove();
                MarkdownModal.currentModal = null;
                MarkdownModal.isOpen = false;
                MarkdownModal.fontSize = 16;
            }
            document.body.style.overflow = '';
            console.log('✅ Markdown viewer closed');
        }, 300);
    }
}

/**
 * Add modal animations
 */
function addModalAnimations() {
    if (document.getElementById('markdown-modal-styles')) return;

    const style = document.createElement('style');
    style.id = 'markdown-modal-styles';
    style.textContent = `
        @keyframes mdViewerSlideUp {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
        }
        @keyframes mdViewerSlideDown {
            from { transform: translateY(0); }
            to { transform: translateY(100%); }
        }
        @keyframes mdSpin {
            to { transform: rotate(360deg); }
        }
        #markdown-viewer-modal * {
            -webkit-tap-highlight-color: transparent;
        }
    `;
    
    document.head.appendChild(style);
}

// Export functions globally
window.openMarkdownViewer = openMarkdownViewer;
window.closeMarkdownViewer = closeMarkdownViewer;
window.MarkdownModal = MarkdownModal;

console.log('✅ Markdown Fullscreen Viewer loaded');
