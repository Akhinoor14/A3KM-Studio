/**
 * Mobile Device Blocker for A3KM Studio - DISABLED
 * This file has been disabled and is no longer active
 * Mobile optimization is now handled by mobile-universal.js
 * Date Disabled: February 2, 2026
 */

// ENTIRE BLOCKING SYSTEM DISABLED - DO NOT USE
console.log('[mobile-block.js] This file is disabled. Mobile optimization is handled by mobile-universal.js');

/* DISABLED CODE - Kept for reference only
(function() {
    'use strict';
    
    /**
     * Smart mobile detection with desktop browser resize protection
     * Accurately detects real mobile devices while ignoring resized desktop browsers
     */
    function isMobileDevice() {
        // Priority 1: User Agent Detection (most reliable for actual device type)
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile|tablet|kindle|silk|playbook|bb10|meego/i;
        const isUserAgentMobile = mobileRegex.test(userAgent.toLowerCase());
        
        // Priority 2: Physical screen size (not window size - this prevents false positives from resized windows)
        const physicalScreenWidth = screen.width;
        const physicalScreenHeight = screen.height;
        const hasSmallPhysicalScreen = physicalScreenWidth <= 768 || physicalScreenHeight <= 768;
        
        // Priority 3: Touch capability (mobile-specific)
        const isTouchDevice = ('ontouchstart' in window) || 
                             (navigator.maxTouchPoints > 0) || 
                             (navigator.msMaxTouchPoints > 0);
        
        // Priority 4: Orientation API (only exists on mobile devices)
        const hasOrientationAPI = typeof window.orientation !== 'undefined';
        
        // Priority 5: Mobile-specific features
        const hasMobileFeatures = 'ontouchstart' in document.documentElement;
        
        // ====== SMART DETECTION LOGIC ======
        
        // Scenario 1: User Agent clearly identifies mobile device
        if (isUserAgentMobile) {
            return true;
        }
        
        // Scenario 2: Has orientation API (mobile-only feature)
        if (hasOrientationAPI) {
            return true;
        }
        
        // Scenario 3: Has mobile-specific touch features
        if (hasMobileFeatures) {
            return true;
        }
        
        // Scenario 4: Small PHYSICAL screen + touch support = Real mobile device
        // This prevents false positives from resized desktop browsers (they lack touch)
        if (hasSmallPhysicalScreen && isTouchDevice) {
            return true;
        }
        
        // Scenario 5: Very small physical screen (< 600px) = Definitely mobile
        // Even without touch, screens this small are mobile devices
        if (physicalScreenWidth < 600) {
            return true;
        }
        
        // Scenario 6: Touchscreen with portrait orientation = Mobile
        const aspectRatio = physicalScreenHeight / physicalScreenWidth;
        if (isTouchDevice && aspectRatio > 1.3) {
            return true;
        }
        
        // ====== DESKTOP BROWSER RESIZE PROTECTION ======
        
        // If window is resized but physical screen is large, it's desktop
        // Example: Desktop browser window resized to 500px, but screen.width = 1920px
        if (physicalScreenWidth > 1024 && !isTouchDevice) {
            return false; // Definitely desktop, ignore window size
        }
        
        // Default: Not mobile (benefits desktop users)
        return false;
    }
    
    /**
     * Create and display mobile warning overlay
     */
    function showMobileWarning() {
        // Prevent page content from showing
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
        
        // Create overlay container
        const overlay = document.createElement('div');
        overlay.id = 'mobile-block-overlay';
        overlay.innerHTML = `
            <div class="mobile-warning-container">
                <div class="mobile-icon">
                    <svg width="100" height="100" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="5" y="2" width="14" height="20" rx="2" stroke="#CC0000" stroke-width="1.5" fill="none"/>
                        <line x1="5" y1="19" x2="19" y2="19" stroke="#CC0000" stroke-width="1.5"/>
                        <circle cx="12" cy="20.5" r="0.5" fill="#CC0000"/>
                        <line x1="7" y1="5" x2="17" y2="5" stroke="#CC0000" stroke-width="1.5" stroke-linecap="round"/>
                        <line x1="7" y1="8" x2="17" y2="8" stroke="#CC0000" stroke-width="1.5" stroke-linecap="round"/>
                        <line x1="7" y1="11" x2="14" y2="11" stroke="#CC0000" stroke-width="1.5" stroke-linecap="round"/>
                        <path d="M10 14 L14 14 L12 17 Z" fill="#CC0000" opacity="0.6"/>
                        <circle cx="12" cy="12" r="8" stroke="#CC0000" stroke-width="2" fill="none" opacity="0.2"/>
                        <line x1="12" y1="4" x2="12" y2="20" stroke="#CC0000" stroke-width="2" opacity="0.1"/>
                    </svg>
                </div>
                
                <h1 class="mobile-title">🚧 Mobile Version Under Development 🚧</h1>
                
                <div class="mobile-message">
                    <p class="mobile-main-text">
                        🔧 <strong>A3KM Studio</strong> is optimizing the mobile experience with advanced engineering features and interactive 3D models.
                    </p>
                    <p class="mobile-sub-text">
                        For the <strong>best performance</strong>, full <strong>interactive features</strong>, and complete <strong>portfolio access</strong>, please switch to a <strong>Desktop or Laptop Computer</strong>.
                    </p>
                </div>
                
                <div class="mobile-features">
                    <div class="feature-item">
                        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" stroke="#00FF00" stroke-width="2" fill="none"/>
                            <path d="M8 12L11 15L16 9" stroke="#00FF00" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <span>🎯 Full Interactive Features</span>
                    </div>
                    <div class="feature-item">
                        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" stroke="#00FF00" stroke-width="2" fill="none"/>
                            <path d="M8 12L11 15L16 9" stroke="#00FF00" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <span>⚡ Maximum Performance</span>
                    </div>
                    <div class="feature-item">
                        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" stroke="#00FF00" stroke-width="2" fill="none"/>
                            <path d="M8 12L11 15L16 9" stroke="#00FF00" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <span>📱 3D Model Viewer & CAD Projects</span>
                    </div>
                    <div class="feature-item">
                        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" stroke="#00FF00" stroke-width="2" fill="none"/>
                            <path d="M8 12L11 15L16 9" stroke="#00FF00" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <span>💎 Complete Engineering Portfolio</span>
                    </div>
                </div>
                
                <div class="desktop-highlight">
                    <span class="desktop-highlight-icon">💻</span>
                    <span class="desktop-highlight-text">For the <b>BEST EXPERIENCE</b>, use <b>Desktop/Laptop</b></span>
                </div>
                <div class="mobile-footer">
                    <p>⚠️ Desktop site provides the full A3KM Studio experience</p>
                    <p class="mobile-brand">A3KM STUDIO</p>
                </div>
            </div>
        `;
        
        // Insert at the very beginning of body
        if (document.body.firstChild) {
            document.body.insertBefore(overlay, document.body.firstChild);
        } else {
            document.body.appendChild(overlay);
        }
        
        // Hide all other page content
        const allElements = document.body.children;
        for (let i = 0; i < allElements.length; i++) {
            if (allElements[i].id !== 'mobile-block-overlay') {
                allElements[i].style.display = 'none';
            }
        }
    }
    
    /**
     * Initialize mobile detection
     */
    function initMobileBlock() {
        // Check if mobile device
        if (isMobileDevice()) {
            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', showMobileWarning);
            } else {
                showMobileWarning();
            }
            
            // Also handle dynamic content loading
            window.addEventListener('load', function() {
                const overlay = document.getElementById('mobile-block-overlay');
                if (overlay) {
                    overlay.style.display = 'flex';
                    // Ensure overlay is on top
                    overlay.style.zIndex = '999999';
                }
            });
            
            // Prevent orientation change from bypassing block
            window.addEventListener('orientationchange', function() {
                if (isMobileDevice()) {
                    showMobileWarning();
                }
            });
            
            // Prevent resize from bypassing block
            window.addEventListener('resize', function() {
                if (isMobileDevice()) {
                    const overlay = document.getElementById('mobile-block-overlay');
                    if (!overlay) {
                        showMobileWarning();
                    }
                }
            });
        }
    }
    
    // Execute immediately
    initMobileBlock();
    
    // Also check after a short delay to catch late-loading user agents
    setTimeout(function() {
        if (isMobileDevice() && !document.getElementById('mobile-block-overlay')) {
            showMobileWarning();
        }
    }, 100);
    
})();

END OF DISABLED CODE - This file no longer blocks mobile devices */
