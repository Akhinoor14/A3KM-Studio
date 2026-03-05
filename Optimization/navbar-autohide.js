/* ============================================================================
   NAVBAR AUTO-HIDE SCRIPT - SMART TIER SYSTEM
   For sub-pages only (NOT for main 5 pages)
   Priority: Mouse > Scroll > Timer
   
   Behavior:
     - Page loads: navbar visible → auto-hides after 3s
     - Mouse moves to top (< 80px): navbar shows instantly
     - Mouse moves away from top: hides after 1.5s
     - Scroll up: shows navbar
     - Scroll down (past 100px): hides navbar

   Updated: March 5, 2026
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
    let idleTimer; // Timer for initial page-load auto-hide
    
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
        } else {
            // Mouse away from top - hide after 1.5s regardless of scroll position
            hideTimer = setTimeout(() => {
                if (!mouseNearTop) {
                    hideNavbar();
                }
            }, 1500);
        }
    }
    
    // Mouse leave window handler - Reset state
    function handleMouseLeave() {
        mouseNearTop = false;
        clearTimeout(hideTimer);
        hideTimer = setTimeout(() => {
            hideNavbar();
        }, 1200);
    }
    
    // Timer-based hide for initial page load — ALL pages hide after 3s
    function initTimerBasedHide() {
        clearTimeout(idleTimer);
        // Always schedule auto-hide 3s after page is ready
        idleTimer = setTimeout(() => {
            if (!mouseNearTop) {
                hideNavbar();
            }
        }, 3000);
    }
    
    // Debounced scroll listener
    window.addEventListener('scroll', function() {
        clearTimeout(isScrolling);
        isScrolling = setTimeout(handleScroll, 10);
    }, { passive: true });
    
    // Throttled mouse move listener
    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    
    // Mouse leave listener - Reset stale state
    document.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    
    // Initial state
    showNavbar();
    
    // Initialize on page load
    window.addEventListener('load', function() {
        showNavbar();
        initTimerBasedHide();
    });
    
})();
