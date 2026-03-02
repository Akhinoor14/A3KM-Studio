/* ============================================================================
   NAVBAR AUTO-HIDE SCRIPT - FINAL CONFLICT-FREE VERSION
   For sub-pages only (NOT for main 5 pages)
   Priority: Mouse > Scroll > Timer
   All edge cases handled
   Updated: March 2, 2026
   ============================================================================ */

(function() {
    'use strict';
    
    // Get navbar element
    const navbar = document.querySelector('.desktop-navbar');
    if (!navbar) return;
    
    let lastScroll = 0;
    let isScrolling;
    let hideTimer;
    let mouseNearTop = false; // Track mouse position state
    let mouseMoveTimer; // Throttle mouse events
    let idleTimer; // Timer for non-scrollable pages
    
    // Check if page has scrollable content
    function isPageScrollable() {
        return document.body.scrollHeight > window.innerHeight + 50;
    }
    
    // Show navbar
    function showNavbar() {
        navbar.classList.remove('autohide');
        navbar.classList.add('show');
    }
    
    // Hide navbar
    function hideNavbar() {
        navbar.classList.add('autohide');
        navbar.classList.remove('show');
    }
    
    // Scroll handler
    function handleScroll() {
        const currentScroll = window.pageYOffset;
        
        // Clear any pending timers
        clearTimeout(hideTimer);
        clearTimeout(idleTimer); // Cancel idle timer when user is actively scrolling
        
        // PRIORITY 1: If mouse is near top, keep navbar visible
        if (mouseNearTop) {
            showNavbar();
            lastScroll = currentScroll;
            return;
        }
        
        // PRIORITY 2: Scroll-based behavior
        // Don't hide if at top of page
        if (currentScroll <= 100) {
            showNavbar();
            lastScroll = currentScroll;
            return;
        }
        
        // Scrolling DOWN - Hide navbar
        if (currentScroll > lastScroll && currentScroll > 100) {
            hideNavbar();
        } 
        // Scrolling UP - Show navbar
        else if (currentScroll < lastScroll) {
            showNavbar();
        }
        
        lastScroll = currentScroll;
    }
    
    // Mouse hover handler - THROTTLED to avoid performance issues
    function handleMouseMove(e) {
        // Throttle: Only process every 100ms
        if (mouseMoveTimer) return;
        mouseMoveTimer = setTimeout(() => {
            mouseMoveTimer = null;
        }, 100);
        
        // Clear any existing timers
        clearTimeout(hideTimer);
        clearTimeout(idleTimer);
        
        // Update mouse position state
        mouseNearTop = e.clientY < 80;
        
        if (mouseNearTop) {
            // PRIORITY 1: Mouse near top - Always show
            showNavbar();
        } else if (window.pageYOffset > 100) {
            // Mouse away from top AND page is scrolled - Hide after delay
            hideTimer = setTimeout(() => {
                // Double-check mouse still not near top
                if (!mouseNearTop) {
                    hideNavbar();
                }
            }, 800);
        }
    }
    
    // Mouse leave window handler - Reset state
    function handleMouseLeave() {
        // Clear mouse-near-top state when mouse leaves window
        mouseNearTop = false;
        
        // If page is scrolled, hide navbar after delay
        if (window.pageYOffset > 100) {
            clearTimeout(hideTimer);
            hideTimer = setTimeout(() => {
                hideNavbar();
            }, 1200); // Slightly longer delay for mouse leaving
        }
    }
    
    // Timer-based hide for non-scrollable pages
    function initTimerBasedHide() {
        // Clear any existing idle timer first
        clearTimeout(idleTimer);
        
        if (!isPageScrollable()) {
            // PRIORITY 3: Page has no scroll - hide after 3 seconds
            idleTimer = setTimeout(() => {
                // Only hide if mouse not near top and at page top
                if (window.pageYOffset <= 100 && !mouseNearTop) {
                    hideNavbar();
                }
            }, 3000);
        }
    }
    
    // Debounced scroll listener
    window.addEventListener('scroll', function() {
        clearTimeout(isScrolling);
        isScrolling = setTimeout(handleScroll, 10);
    }, { passive: true });
    
    // Throttled mouse move listener
    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    
    // Mouse leave listener - FIX: Reset stale state
    document.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    
    // Initial state
    showNavbar();
    
    // Initialize on page load
    window.addEventListener('load', function() {
        showNavbar();
        initTimerBasedHide();
    });
    
    // Re-check on window resize or content change
    window.addEventListener('resize', function() {
        clearTimeout(hideTimer);
        clearTimeout(idleTimer); // Clear old timer
        initTimerBasedHide(); // Re-evaluate scrollability
    }, { passive: true });
    
    // Optional: Re-check scrollability on DOM changes (for dynamic content)
    const contentObserver = new MutationObserver(function() {
        // Debounce: Only check after DOM settles
        clearTimeout(idleTimer);
        setTimeout(initTimerBasedHide, 500);
    });
    
    // Observe body for content changes
    contentObserver.observe(document.body, {
        childList: true,
        subtree: true
    });
    
})();
