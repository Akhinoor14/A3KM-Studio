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
        // Redirect desktop users to the desktop site (avoid resize-based false positives)
        redirectToDesktopIfNeeded();

        // Set active state based on current page
        setActiveNavItem();
        
        // Add ripple effect on touch
        addRippleEffect();
        
        // Add haptic feedback on supported devices
        addHapticFeedback();
    }

    function isMobileDevice() {
        // Check userAgentData first (modern browsers)
        const uaData = navigator.userAgentData;
        if (uaData && typeof uaData.mobile === 'boolean') {
            return uaData.mobile;
        }

        // Fallback to user agent string and screen size
        const ua = navigator.userAgent || navigator.vendor || window.opera;
        const isMobileUA = /android|iphone|ipad|ipod|iemobile|opera mini|blackberry|mobile/i.test(ua);
        
        // Also check screen size as additional verification
        const isSmallScreen = window.innerWidth <= 768;
        
        // Return true if either UA indicates mobile OR screen is small
        return isMobileUA || isSmallScreen;
    }

    function normalizePath(pathname) {
        try {
            return decodeURIComponent(pathname).toLowerCase();
        } catch (err) {
            return pathname.toLowerCase();
        }
    }

    function getDesktopEquivalentPath() {
        const path = normalizePath(window.location.pathname);
        const mappings = [
            { mobile: '/mobile/home/index.html', desktop: '/Home/index.html' },
            { mobile: '/mobile/about/about.html', desktop: '/About me/about.html' },
            { mobile: '/mobile/projects/projects.html', desktop: '/Projects Code/projects.html' },
            { mobile: '/mobile/content-studio/hub.html', desktop: '/Content Studio/hub.html' },
            { mobile: '/mobile/contact/contact.html', desktop: '/Contact/contact.html' },
            { mobile: '/mobile/content-studio/video-blogs/video-gallery.html', desktop: '/Content Studio/video-content/video-gallery.html' },
            { mobile: '/mobile/content-studio/video-blogs/video-viewer.html', desktop: '/Content Studio/video-content/video-viewer.html' },
            { mobile: '/mobile/content-studio/written-posts/post-listing.html', desktop: '/Content Studio/written-posts/post-listing-new.html' },
            { mobile: '/mobile/content-studio/written-posts/post-reader.html', desktop: '/Content Studio/written-posts/post-reader.html' },
            { mobile: '/mobile/content-studio/educational-courses/course-listing.html', desktop: '/Content Studio/educational-videos/course-listing-new.html' },
            { mobile: '/mobile/content-studio/educational-courses/course-viewer.html', desktop: '/Content Studio/educational-videos/course-viewer-new.html' },
            { mobile: '/mobile/content-studio/books-pdfs/book-listing.html', desktop: '/Content Studio/books-pdfs/book-listing-new.html' },
            { mobile: '/mobile/content-studio/books-pdfs/book-reader.html', desktop: '/Content Studio/books-pdfs/book-reader-new.html' },
            { mobile: '/mobile/content-studio/research-papers/paper-listing.html', desktop: '/Content Studio/research-papers/paper-listing-new.html' },
            { mobile: '/mobile/content-studio/research-papers/paper-viewer.html', desktop: '/Content Studio/research-papers/paper-viewer-new.html' }
        ];

        for (const mapping of mappings) {
            if (path.endsWith(mapping.mobile)) {
                return mapping.desktop;
            }
        }

        return null;
    }

    function redirectToDesktopIfNeeded() {
        if (isMobileDevice()) return;
        const target = getDesktopEquivalentPath();
        if (target && window.location.pathname !== target) {
            window.location.replace(target);
        }
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
        // Removed excessive vibration feedback
        // Only keeping vibrations for important actions like save/bookmark
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
