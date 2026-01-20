/* ============================================================================
   NAVBAR AUTO-HIDE SCRIPT
   For sub-pages only (NOT for main 5 pages)
   Smart navbar that hides on scroll down, shows on scroll up or mouse hover
   Created: January 21, 2026
   ============================================================================ */

(function() {
    'use strict';
    
    // Get navbar element
    const navbar = document.querySelector('.desktop-navbar');
    if (!navbar) return;
    
    let lastScroll = 0;
    let isScrolling;
    
    // Scroll handler
    function handleScroll() {
        const currentScroll = window.pageYOffset;
        
        // Don't hide if at top of page
        if (currentScroll <= 100) {
            navbar.classList.remove('autohide');
            navbar.classList.add('show');
            lastScroll = currentScroll;
            return;
        }
        
        // Scrolling DOWN - Hide navbar
        if (currentScroll > lastScroll && currentScroll > 100) {
            navbar.classList.add('autohide');
            navbar.classList.remove('show');
        } 
        // Scrolling UP - Show navbar
        else if (currentScroll < lastScroll) {
            navbar.classList.remove('autohide');
            navbar.classList.add('show');
        }
        
        lastScroll = currentScroll;
    }
    
    // Mouse hover handler - Show navbar when mouse near top
    function handleMouseMove(e) {
        if (e.clientY < 80) {
            navbar.classList.remove('autohide');
            navbar.classList.add('show');
        }
    }
    
    // Debounced scroll listener
    window.addEventListener('scroll', function() {
        clearTimeout(isScrolling);
        isScrolling = setTimeout(handleScroll, 10);
    }, { passive: true });
    
    // Mouse move listener
    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    
    // Initial state - show navbar
    navbar.classList.add('show');
    
    // Ensure navbar is visible on page load
    window.addEventListener('load', function() {
        navbar.classList.remove('autohide');
        navbar.classList.add('show');
    });
    
})();
