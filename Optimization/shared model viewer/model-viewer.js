/**
 * A3KM Studio - 3D Model Viewer
 * Shared component for viewing GLB/GLTF models across mobile and desktop
 * Uses Google model-viewer for optimal performance and AR support
 */

(function() {
  'use strict';
  
  let modelViewerLibLoaded = false;
  let currentViewer = null;
  
  /**
   * Lazy-load the model-viewer library
   */
  async function loadModelViewerLib() {
    if (modelViewerLibLoaded) return;
    
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.type = 'module';
      script.src = 'https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js';
      script.onload = () => {
        modelViewerLibLoaded = true;
        console.log('✅ Model Viewer library loaded');
        resolve();
      };
      script.onerror = () => reject(new Error('Failed to load model-viewer library'));
      document.head.appendChild(script);
    });
  }
  
  /**
   * Open 3D model viewer modal
   * @param {Object} options - Configuration options
   * @param {string} options.src - URL of the GLB/GLTF model
   * @param {string} options.title - Display title for the model
   * @param {string} [options.poster] - Optional poster/thumbnail image URL
   * @param {boolean} [options.ar] - Enable AR mode (default: true)
   * @param {string} [options.iosSrc] - Optional iOS-specific USDZ file for AR
   * @param {string} [options.downloadUrl] - Optional download URL (defaults to src)
   * @param {Array} [options.models] - Array of model objects for navigation [{src, title}, ...]
   * @param {number} [options.currentIndex] - Current model index in models array
   */
  window.openModelViewer = async function(options) {
    const {
      src,
      title = '3D Model',
      poster = '',
      ar = true,
      iosSrc = '',
      downloadUrl = src,
      models = [],
      currentIndex = 0
    } = options;
    
    if (!src) {
      console.error('❌ Model source URL is required');
      return;
    }
    
    // Store navigation context
    window._currentModelContext = {
      models: models,
      currentIndex: currentIndex
    };
    
    try {
      // Load library if not already loaded
      await loadModelViewerLib();
      
      // Close existing viewer if open
      if (currentViewer) {
        currentViewer.remove();
        currentViewer = null;
      }
      
      // Create modal overlay
      const modal = document.createElement('div');
      modal.className = 'model-viewer-modal';
      modal.id = 'model-viewer-modal';
      
      // Build AR attributes
      const arAttrs = ar ? `
        ar
        ar-modes="webxr scene-viewer quick-look"
        ${iosSrc ? `ios-src="${iosSrc}"` : ''}
      ` : '';
      
      const posterAttr = poster ? `poster="${poster}"` : '';
      
      // Navigation buttons (show only if multiple models)
      const hasNavigation = models.length > 1;
      const navButtons = hasNavigation ? `
        <div class="model-viewer-navigation">
          <button class="model-nav-btn prev" title="Previous Model" ${currentIndex === 0 ? 'disabled' : ''}>
            <i class="fas fa-chevron-left"></i>
            <span>Previous</span>
          </button>
          <span class="model-counter">${currentIndex + 1} / ${models.length}</span>
          <button class="model-nav-btn next" title="Next Model" ${currentIndex === models.length - 1 ? 'disabled' : ''}>
            <span>Next</span>
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      ` : '';
      
      modal.innerHTML = `
        <div class="model-viewer-overlay"></div>
        <div class="model-viewer-container">
          <div class="model-viewer-header">
            <div class="model-viewer-title">
              <i class="fas fa-cube"></i>
              <span>${escapeHtml(title)}</span>
            </div>
            ${navButtons}
            <button class="model-viewer-close" title="Close">
              <i class="fas fa-times"></i>
            </button>
          </div>
          
          <div class="model-viewer-wrapper">
            <model-viewer
              src="${src}"
              ${posterAttr}
              ${arAttrs}
              camera-controls
              touch-action="pan-y"
              auto-rotate
              auto-rotate-delay="3000"
              rotation-per-second="30deg"
              exposure="1"
              shadow-intensity="1"
              environment-image="neutral"
              loading="eager"
              reveal="auto"
              style="width: 100%; height: 100%;"
            >
              <div class="model-viewer-loading" slot="poster">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Loading 3D Model...</p>
              </div>
              
              <div class="model-viewer-error" slot="error">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Failed to load model</p>
                <small>Please check the file format (GLB/GLTF)</small>
              </div>
            </model-viewer>
          </div>
          
          <div class="model-viewer-actions">
            <button class="model-action-btn primary" onclick="window.open('${src}', '_blank')" title="Open in new tab">
              <i class="fas fa-external-link-alt"></i>
              <span>Open</span>
            </button>
            
            <a href="${downloadUrl}" class="model-action-btn secondary" download title="Download model">
              <i class="fas fa-download"></i>
              <span>Download</span>
            </a>
            
            ${ar ? `
              <button class="model-action-btn ar" onclick="document.querySelector('model-viewer').activateAR()" title="View in AR">
                <i class="fas fa-mobile-alt"></i>
                <span>AR</span>
              </button>
            ` : ''}
            
            <button class="model-action-btn" onclick="toggleAutoRotate()" title="Toggle auto-rotate">
              <i class="fas fa-sync-alt"></i>
              <span>Rotate</span>
            </button>
            
            <button class="model-action-btn" onclick="resetCamera()" title="Reset camera">
              <i class="fas fa-redo"></i>
              <span>Reset</span>
            </button>
          </div>
          
          <div class="model-viewer-instructions">
            <div class="instruction-item">
              <i class="fas fa-hand-pointer"></i>
              <span>Drag to rotate</span>
            </div>
            <div class="instruction-item">
              <i class="fas fa-search-plus"></i>
              <span>Pinch/scroll to zoom</span>
            </div>
            ${ar ? `
              <div class="instruction-item">
                <i class="fas fa-cube"></i>
                <span>Click AR to view in your space</span>
              </div>
            ` : ''}
          </div>
        </div>
      `;
      
      document.body.appendChild(modal);
      currentViewer = modal;
      
      // Disable body scroll
      document.body.style.overflow = 'hidden';
      
      // Setup event listeners
      setupEventListeners(modal);
      
      // Animate in
      requestAnimationFrame(() => {
        modal.classList.add('active');
      });
      
      console.log('✅ 3D Model Viewer opened:', title);
      
    } catch (error) {
      console.error('❌ Error opening model viewer:', error);
      alert('Failed to load 3D model viewer. Please try again.');
    }
  };
  
  /**
   * Close model viewer
   */
  window.closeModelViewer = function() {
    if (currentViewer) {
      currentViewer.classList.remove('active');
      
      // Clean up arrow key handler
      if (currentViewer._arrowHandler) {
        document.removeEventListener('keydown', currentViewer._arrowHandler);
      }
      
      setTimeout(() => {
        currentViewer.remove();
        currentViewer = null;
        document.body.style.overflow = '';
      }, 300);
    }
  };
  
  /**
   * Navigate to previous or next model
   */
  function navigateModel(direction) {
    const context = window._currentModelContext;
    if (!context || !context.models || context.models.length <= 1) {
      return;
    }
    
    let newIndex = context.currentIndex;
    
    if (direction === 'prev' && newIndex > 0) {
      newIndex--;
    } else if (direction === 'next' && newIndex < context.models.length - 1) {
      newIndex++;
    } else {
      return; // Already at start/end
    }
    
    const newModel = context.models[newIndex];
    if (!newModel) return;
    
    // Close current and open new
    window.closeModelViewer();
    
    setTimeout(() => {
      window.openModelViewer({
        src: newModel.src,
        title: newModel.title || '3D Model',
        models: context.models,
        currentIndex: newIndex,
        ar: true
      });
    }, 350);
  }
  
  /**
   * Toggle auto-rotate on model viewer
   */
  window.toggleAutoRotate = function() {
    const modelViewer = document.querySelector('model-viewer');
    if (modelViewer) {
      const isRotating = modelViewer.hasAttribute('auto-rotate');
      if (isRotating) {
        modelViewer.removeAttribute('auto-rotate');
      } else {
        modelViewer.setAttribute('auto-rotate', '');
      }
    }
  };
  
  /**
   * Reset camera to default position
   */
  window.resetCamera = function() {
    const modelViewer = document.querySelector('model-viewer');
    if (modelViewer) {
      modelViewer.resetTurntableRotation();
      modelViewer.fieldOfView = 'auto';
      modelViewer.cameraOrbit = modelViewer.getAttribute('camera-orbit') || 'auto auto auto';
      modelViewer.cameraTarget = 'auto auto auto';
    }
  };
  
  /**
   * Setup event listeners for modal
   */
  function setupEventListeners(modal) {
    // Close button
    const closeBtn = modal.querySelector('.model-viewer-close');
    closeBtn.addEventListener('click', window.closeModelViewer);
    
    // Overlay click
    const overlay = modal.querySelector('.model-viewer-overlay');
    overlay.addEventListener('click', window.closeModelViewer);
    
    // Navigation buttons
    const prevBtn = modal.querySelector('.model-nav-btn.prev');
    const nextBtn = modal.querySelector('.model-nav-btn.next');
    
    if (prevBtn) {
      prevBtn.addEventListener('click', () => navigateModel('prev'));
    }
    
    if (nextBtn) {
      nextBtn.addEventListener('click', () => navigateModel('next'));
    }
    
    // ESC key
    const escHandler = (e) => {
      if (e.key === 'Escape') {
        window.closeModelViewer();
        document.removeEventListener('keydown', escHandler);
      }
    };
    document.addEventListener('keydown', escHandler);
    
    // Arrow key navigation
    const arrowHandler = (e) => {
      if (e.key === 'ArrowLeft') {
        navigateModel('prev');
      } else if (e.key === 'ArrowRight') {
        navigateModel('next');
      }
    };
    document.addEventListener('keydown', arrowHandler);
    
    // Store handler for cleanup
    modal._arrowHandler = arrowHandler;
    
    // Model viewer events
    const modelViewer = modal.querySelector('model-viewer');
    
    modelViewer.addEventListener('load', () => {
      console.log('✅ 3D Model loaded successfully');
    });
    
    modelViewer.addEventListener('error', (e) => {
      console.error('❌ Model load error:', e);
    });
    
    modelViewer.addEventListener('progress', (e) => {
      const progress = e.detail.totalProgress * 100;
      console.log(`📊 Loading progress: ${progress.toFixed(0)}%`);
    });
  }
  
  /**
   * Escape HTML to prevent XSS
   */
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
  
  /**
   * Check if a file is a 3D model (GLB/GLTF)
   */
  window.is3DModel = function(filename) {
    return /\.(glb|gltf)$/i.test(filename);
  };
  
  console.log('✅ A3KM 3D Model Viewer initialized');
  
})();
