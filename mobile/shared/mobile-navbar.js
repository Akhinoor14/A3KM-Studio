/* ============================================================================
   MOBILE BOTTOM NAVIGATION - JAVASCRIPT
   Handles active states, navigation, and interactions
   ============================================================================ */

(function() {
    'use strict';
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMobileNav);
    } else {
        initMobileNav();
    }
    
    function initMobileNav() {
        // Set active state based on current page
        setActiveNavItem();
        
        // Add ripple effect on touch
        addRippleEffect();
        
        // Add haptic feedback on supported devices
        addHapticFeedback();
    }
    
    /**
     * Set active navigation item based on current page URL
     */
    function setActiveNavItem() {
        const currentPath = window.location.pathname;
        const navItems = document.querySelectorAll('.mobile-nav-item');
        
        navItems.forEach(item => {
            const href = item.getAttribute('href');
            
            // Remove any existing active class
            item.classList.remove('active');
            
            // Check if current path matches this nav item
            if (href && currentPath.includes(href.split('/').pop().split('.')[0])) {
                item.classList.add('active');
            }
            // Special case for home page
            else if ((currentPath.endsWith('/') || currentPath.includes('index') || currentPath.includes('home')) 
                     && href && href.includes('index')) {
                item.classList.add('active');
            }
        });
    }
    
    /**
     * Add ripple effect on touch/click
     */
    function addRippleEffect() {
        const navItems = document.querySelectorAll('.mobile-nav-item');
        
        navItems.forEach(item => {
            item.addEventListener('touchstart', function(e) {
                // The ripple effect is handled by CSS ::after pseudo-element
                // This just ensures smooth interaction
                this.style.transform = 'scale(0.95)';
            }, { passive: true });
            
            item.addEventListener('touchend', function(e) {
                this.style.transform = 'scale(1)';
            }, { passive: true });
            
            item.addEventListener('touchcancel', function(e) {
                this.style.transform = 'scale(1)';
            }, { passive: true });
        });
    }
    
    /**
     * Add haptic feedback on supported devices
     */
    function addHapticFeedback() {
        // Check if Vibration API is supported
        if (!('vibrate' in navigator)) {
            return;
        }
        
        const navItems = document.querySelectorAll('.mobile-nav-item');
        
        navItems.forEach(item => {
            item.addEventListener('touchstart', function(e) {
                // Light haptic feedback (10ms vibration)
                navigator.vibrate(10);
            }, { passive: true });
        });
    }
    
    /**
     * Smooth scroll to top when same page nav is clicked
     */
    window.scrollToTop = function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };
    
    /**
     * Prevent default behavior and handle navigation programmatically
     * This allows for smooth transitions and state management
     */
    function handleNavigation(e, targetUrl) {
        const currentPath = window.location.pathname;
        const targetPage = targetUrl.split('/').pop().split('.')[0];
        const currentPage = currentPath.split('/').pop().split('.')[0];
        
        // If clicking on current page, scroll to top
        if (targetPage === currentPage || 
            (targetPage === 'index' && (currentPage === '' || currentPage === 'index'))) {
            e.preventDefault();
            scrollToTop();
        }
        // Otherwise, allow normal navigation
    }
    
    // Expose functions globally if needed
    window.mobileNav = {
        setActiveNavItem: setActiveNavItem,
        scrollToTop: scrollToTop
    };
    
})();
