/**
 * Lazy Loading System for Images
 * Improves page load performance
 * Author: Md Akhinoor Islam
 * A3KM Studio
 */

class LazyImageLoader {
    constructor(options = {}) {
        this.options = {
            rootMargin: options.rootMargin || '50px',
            threshold: options.threshold || 0.01,
            loadingClass: options.loadingClass || 'lazy-loading',
            loadedClass: options.loadedClass || 'lazy-loaded',
            errorClass: options.errorClass || 'lazy-error',
            placeholderImage: options.placeholderImage || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23333" width="400" height="300"/%3E%3Ctext fill="%23666" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ELoading...%3C/text%3E%3C/svg%3E'
        };

        this.observer = null;
        this.images = new Set();
        this.init();
    }

    init() {
        // Check if IntersectionObserver is supported
        if ('IntersectionObserver' in window) {
            this.observer = new IntersectionObserver(
                this.onIntersection.bind(this),
                {
                    rootMargin: this.options.rootMargin,
                    threshold: this.options.threshold
                }
            );

            // Find and observe all lazy images
            this.observeImages();
        } else {
            // Fallback: load all images immediately
            this.loadAllImages();
        }
    }

    observeImages() {
        // Select all images with data-src attribute
        const lazyImages = document.querySelectorAll('img[data-src], img[data-srcset]');
        
        lazyImages.forEach(img => {
            // Add to tracked set
            this.images.add(img);
            
            // Add loading class
            img.classList.add(this.options.loadingClass);
            
            // Set placeholder if no src
            if (!img.src || img.src === window.location.href) {
                img.src = this.options.placeholderImage;
            }
            
            // Start observing
            this.observer.observe(img);
        });

        console.log(`🖼️ Lazy loading ${lazyImages.length} images`);
    }

    onIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                this.loadImage(img);
                this.observer.unobserve(img);
            }
        });
    }

    loadImage(img) {
        const src = img.dataset.src;
        const srcset = img.dataset.srcset;

        if (!src && !srcset) {
            console.warn('No data-src or data-srcset found:', img);
            return;
        }

        // Create a new image to preload
        const tempImg = new Image();

        tempImg.onload = () => {
            // Set actual source
            if (src) img.src = src;
            if (srcset) img.srcset = srcset;

            // Update classes
            img.classList.remove(this.options.loadingClass);
            img.classList.add(this.options.loadedClass);

            // Trigger custom event
            img.dispatchEvent(new CustomEvent('lazyloaded', { detail: { src, srcset } }));

            // Remove from tracked set
            this.images.delete(img);
        };

        tempImg.onerror = () => {
            img.classList.remove(this.options.loadingClass);
            img.classList.add(this.options.errorClass);
            
            // Set error placeholder
            img.src = this.getErrorPlaceholder();

            // Trigger error event
            img.dispatchEvent(new CustomEvent('lazyerror', { detail: { src, srcset } }));

            console.error('Failed to load image:', src || srcset);
        };

        // Start loading
        if (src) tempImg.src = src;
        if (srcset) tempImg.srcset = srcset;
    }

    loadAllImages() {
        // Fallback for browsers without IntersectionObserver
        const lazyImages = document.querySelectorAll('img[data-src], img[data-srcset]');
        
        lazyImages.forEach(img => {
            const src = img.dataset.src;
            const srcset = img.dataset.srcset;
            
            if (src) img.src = src;
            if (srcset) img.srcset = srcset;
            
            img.classList.add(this.options.loadedClass);
        });
    }

    getErrorPlaceholder() {
        return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23FF3333" width="400" height="300"/%3E%3Ctext fill="%23FFF" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3E✖ Error%3C/text%3E%3C/svg%3E';
    }

    // Add new images to observation (for dynamic content)
    observe(images) {
        if (!this.observer) return;

        if (images instanceof HTMLElement) {
            images = [images];
        } else if (images instanceof NodeList) {
            images = Array.from(images);
        }

        images.forEach(img => {
            if (img.dataset.src || img.dataset.srcset) {
                this.images.add(img);
                img.classList.add(this.options.loadingClass);
                this.observer.observe(img);
            }
        });
    }

    // Manually load a specific image
    loadNow(img) {
        if (this.observer) {
            this.observer.unobserve(img);
        }
        this.loadImage(img);
    }

    // Destroy and cleanup
    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
        this.images.clear();
    }
}

// ==================== BACKGROUND IMAGE LAZY LOADING ====================

class LazyBackgroundLoader {
    constructor(options = {}) {
        this.options = {
            rootMargin: options.rootMargin || '50px',
            threshold: options.threshold || 0.01,
            loadingClass: options.loadingClass || 'lazy-bg-loading',
            loadedClass: options.loadedClass || 'lazy-bg-loaded'
        };

        this.observer = null;
        this.init();
    }

    init() {
        if ('IntersectionObserver' in window) {
            this.observer = new IntersectionObserver(
                this.onIntersection.bind(this),
                {
                    rootMargin: this.options.rootMargin,
                    threshold: this.options.threshold
                }
            );

            this.observeElements();
        } else {
            this.loadAllBackgrounds();
        }
    }

    observeElements() {
        const lazyBackgrounds = document.querySelectorAll('[data-bg], [data-bg-image]');
        
        lazyBackgrounds.forEach(el => {
            el.classList.add(this.options.loadingClass);
            this.observer.observe(el);
        });

        console.log(`🎨 Lazy loading ${lazyBackgrounds.length} background images`);
    }

    onIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                this.loadBackground(el);
                this.observer.unobserve(el);
            }
        });
    }

    loadBackground(el) {
        const bgUrl = el.dataset.bg || el.dataset.bgImage;
        
        if (!bgUrl) return;

        // Preload image
        const tempImg = new Image();
        tempImg.onload = () => {
            el.style.backgroundImage = `url('${bgUrl}')`;
            el.classList.remove(this.options.loadingClass);
            el.classList.add(this.options.loadedClass);
        };
        tempImg.src = bgUrl;
    }

    loadAllBackgrounds() {
        const lazyBackgrounds = document.querySelectorAll('[data-bg], [data-bg-image]');
        
        lazyBackgrounds.forEach(el => {
            const bgUrl = el.dataset.bg || el.dataset.bgImage;
            if (bgUrl) {
                el.style.backgroundImage = `url('${bgUrl}')`;
                el.classList.add(this.options.loadedClass);
            }
        });
    }
}

// ==================== AUTO-INITIALIZATION ====================

let lazyImageLoader;
let lazyBackgroundLoader;

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLazyLoading);
} else {
    initLazyLoading();
}

function initLazyLoading() {
    lazyImageLoader = new LazyImageLoader({
        rootMargin: '100px',
        threshold: 0.01
    });

    lazyBackgroundLoader = new LazyBackgroundLoader({
        rootMargin: '100px',
        threshold: 0.01
    });

    // Expose globally
    window.lazyImageLoader = lazyImageLoader;
    window.lazyBackgroundLoader = lazyBackgroundLoader;

    console.log('✅ Lazy loading system initialized');
}

// ==================== UTILITY FUNCTIONS ====================

/**
 * Convert regular img tags to lazy loading
 * Usage: convertToLazyLoading(document.querySelectorAll('.gallery img'));
 */
function convertToLazyLoading(images) {
    if (images instanceof HTMLElement) {
        images = [images];
    } else if (images instanceof NodeList) {
        images = Array.from(images);
    }

    images.forEach(img => {
        const src = img.src;
        const srcset = img.srcset;

        if (src && !img.dataset.src) {
            img.dataset.src = src;
            img.src = lazyImageLoader.options.placeholderImage;
        }

        if (srcset && !img.dataset.srcset) {
            img.dataset.srcset = srcset;
            img.removeAttribute('srcset');
        }
    });

    // Observe new lazy images
    if (lazyImageLoader) {
        lazyImageLoader.observe(images);
    }
}

/**
 * Preload critical images (above the fold)
 * Usage: preloadImages(['logo.png', 'hero.jpg']);
 */
function preloadImages(imageUrls) {
    imageUrls.forEach(url => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = url;
        document.head.appendChild(link);
    });
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { LazyImageLoader, LazyBackgroundLoader, convertToLazyLoading, preloadImages };
}

console.log('🖼️ Lazy Loading System Loaded');
