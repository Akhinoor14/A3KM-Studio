/**
 * ==========================================
 * A3KM STUDIO - MOBILE DEVICE DETECTOR
 * Accurate mobile detection + Auto-redirect
 * ==========================================
 */

class A3KMMobileDetector {
    constructor() {
        this.init();
    }

    /**
     * Accurate Mobile Detection
     * Checks: User Agent + Physical Screen + Touch Support
     */
    isMobileDevice() {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        
        // Check 1: User Agent Detection
        const mobileUA = /android|webos|iphone|ipod|blackberry|iemobile|opera mini|mobile/i.test(userAgent.toLowerCase());
        
        // Check 2: Physical Screen Size (not window resize)
        const physicalWidth = window.screen.width;
        const physicalHeight = window.screen.height;
        const smallScreen = Math.min(physicalWidth, physicalHeight) <= 768;
        
        // Check 3: Touch Support
        const hasTouch = ('ontouchstart' in window) || 
                        (navigator.maxTouchPoints > 0) || 
                        (navigator.msMaxTouchPoints > 0);
        
        // Check 4: Mobile-specific features
        const hasMobileFeatures = 'orientation' in window || 'DeviceOrientationEvent' in window;
        
        // Decision: TRUE if User Agent confirms OR (small screen + touch + mobile features)
        if (mobileUA) return true;
        if (smallScreen && hasTouch && hasMobileFeatures) return true;
        
        return false; // Desktop
    }

    /**
     * Auto-redirect to mobile version
     * @param {string} mobilePagePath - Relative path to mobile HTML
     */
    redirectToMobile(mobilePagePath) {
        if (this.isMobileDevice()) {
            // Prevent redirect loops
            if (!window.location.href.includes('/mobile/')) {
                window.location.replace(mobilePagePath);
            }
        }
    }

    /**
     * Initialize detector
     */
    init() {
        // Expose globally
        window.A3KMMobileDetector = this;
    }
}

// Auto-initialize
const mobileDetector = new A3KMMobileDetector();

// Usage in HTML: mobileDetector.redirectToMobile('mobile/page-mobile.html');
