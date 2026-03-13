/* ============================================================================
   MOBILE BOTTOM NAVIGATION - JAVASCRIPT
   Handles active states, navigation, and interactions
   ============================================================================ */

(function() {
    'use strict';

    // Prevent duplicate initialization when script is included multiple times.
    if (window.__A3KM_MOBILE_NAV_READY__) return;
    window.__A3KM_MOBILE_NAV_READY__ = true;
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMobileNav);
    } else {
        initMobileNav();
    }
    
    function initMobileNav() {
        if (!document.body) return;

        // Desktop users should see desktop-style navigation instead of mobile bottom nav
        if (!isMobileDevice()) {
            applyDesktopExperience();
            return;
        }

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

        // Fallback to user agent string only (desktop should remain desktop even on small windows)
        const ua = navigator.userAgent || navigator.vendor || window.opera;
        const isMobileUA = /android|iphone|ipad|ipod|iemobile|opera mini|blackberry|mobile/i.test(ua);

        // iPadOS desktop UA fallback: treat touch-capable MacIntel as mobile/tablet device.
        const isIPadDesktopUA = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;

        return isMobileUA || isIPadDesktopUA;
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
            { mobile: '/mobile/about/certificates-viewer.html', desktop: '/About me/certificates-viewer.html' },
            { mobile: '/mobile/projects/projects.html', desktop: '/Projects Code/projects.html' },
            { mobile: '/mobile/content-studio/hub.html', desktop: '/Content Studio/hub.html' },
            { mobile: '/mobile/contact/contact.html', desktop: '/Contact/contact.html' },
            { mobile: '/mobile/guide/index.html', desktop: '/Website Guide/index.html' },
            { mobile: '/mobile/content-studio/video-blogs/video-gallery.html', desktop: '/Content Studio/video-content/video-gallery.html' },
            { mobile: '/mobile/content-studio/video-blogs/video-viewer.html', desktop: '/Content Studio/video-content/video-viewer.html' },
            { mobile: '/mobile/content-studio/written-posts/post-listing.html', desktop: '/Content Studio/written-posts/post-listing-new.html' },
            { mobile: '/mobile/content-studio/written-posts/post-reader.html', desktop: '/Content Studio/written-posts/post-reader.html' },
            { mobile: '/mobile/content-studio/educational-courses/course-listing.html', desktop: '/Content Studio/educational-videos/course-listing-new.html' },
            { mobile: '/mobile/content-studio/educational-courses/course-viewer.html', desktop: '/Content Studio/educational-videos/course-viewer-new.html' },
            { mobile: '/mobile/content-studio/books-pdfs/book-listing.html', desktop: '/Content Studio/books-pdfs/book-listing-new.html' },
            { mobile: '/mobile/content-studio/books-pdfs/book-reader.html', desktop: '/Content Studio/books-pdfs/book-detail.html' },
            { mobile: '/mobile/content-studio/research-papers/paper-listing.html', desktop: '/Content Studio/research-papers/paper-listing.html' },
            { mobile: '/mobile/content-studio/research-papers/paper-viewer.html', desktop: '/Content Studio/research-papers/paper-viewer.html' }
        ];

        for (const mapping of mappings) {
            if (path.endsWith(mapping.mobile)) {
                return mapping.desktop;
            }
        }

        return null;
    }

    function redirectToDesktopIfNeeded() {
        const target = getDesktopEquivalentPath();
        if (target && normalizePath(window.location.pathname) !== normalizePath(target)) {
            window.location.replace(target);
            return true;
        }

        return false;
    }

    function applyDesktopExperience() {
        // If a direct desktop equivalent exists, go there.
        if (redirectToDesktopIfNeeded()) return;

        // Otherwise keep the current page but replace mobile nav with desktop-style top nav.
        hideMobileBottomNav();
        ensureDesktopNavbarStyles();
        injectDesktopFallbackNavbar();
    }

    function hideMobileBottomNav() {
        const mobileBottomNav = document.querySelector('.mobile-bottom-nav');
        if (mobileBottomNav) {
            mobileBottomNav.style.display = 'none';
        }
        document.body.style.paddingBottom = '0';
    }

    function ensureDesktopNavbarStyles() {
        const head = document.head || document.getElementsByTagName('head')[0];
        if (!head) return;

        if (!document.querySelector('link[data-desktop-navbar-fallback="css"]')) {
            const cssLink = document.createElement('link');
            cssLink.rel = 'stylesheet';
            cssLink.href = '/Optimization/navbar/desktop-navbar.css';
            cssLink.setAttribute('data-desktop-navbar-fallback', 'css');
            head.appendChild(cssLink);
        }

        if (!document.querySelector('link[data-desktop-navbar-fallback="autohide"]')) {
            const autohideLink = document.createElement('link');
            autohideLink.rel = 'stylesheet';
            autohideLink.href = '/Optimization/navbar-autohide.css';
            autohideLink.setAttribute('data-desktop-navbar-fallback', 'autohide');
            head.appendChild(autohideLink);
        }
    }

    function injectDesktopFallbackNavbar() {
        const existingDesktopNav = document.getElementById('desktopNavbar');
        if (existingDesktopNav) {
            existingDesktopNav.style.setProperty('display', 'block', 'important');
            return;
        }

        const nav = document.createElement('nav');
        nav.className = 'desktop-navbar';
        nav.id = 'desktopNavbar';
        nav.innerHTML = [
            '<div class="desktop-nav-container">',
            '  <a href="/Home/index.html" class="desktop-nav-logo" title="A3KM Studio - Home" aria-label="A3KM Studio Home">',
            '    <img src="/images/logo.svg" alt="A3KM Studio Logo" class="desktop-nav-logo-img" width="55" height="55">',
            '    <div class="desktop-nav-brand">',
            '      <span class="desktop-nav-brand-name">A3KM Studio</span>',
            '      <span class="desktop-nav-brand-tagline">Engineering · Education · Innovation</span>',
            '    </div>',
            '  </a>',
            '  <ul class="desktop-nav-menu">',
            '    <li class="desktop-nav-item"><a href="/About me/about.html" class="desktop-nav-link" data-fallback-nav="about"><i class="fas fa-user-circle" aria-hidden="true"></i><span>About</span></a></li>',
            '    <li class="desktop-nav-item"><a href="/Projects Code/projects.html" class="desktop-nav-link" data-fallback-nav="projects"><i class="fas fa-folder-open" aria-hidden="true"></i><span>Projects</span></a></li>',
            '    <li class="desktop-nav-item"><a href="/Content Studio/hub.html" class="desktop-nav-link" data-fallback-nav="studio"><i class="fas fa-layer-group" aria-hidden="true"></i><span>Content Studio</span></a></li>',
            '    <li class="desktop-nav-item"><a href="/Contact/contact.html" class="desktop-nav-link" data-fallback-nav="contact"><i class="fas fa-envelope" aria-hidden="true"></i><span>Contact</span></a></li>',
            '  </ul>',
            '</div>'
        ].join('');

        nav.style.setProperty('display', 'block', 'important');
        document.body.insertBefore(nav, document.body.firstChild);
        document.body.style.paddingTop = '95px';
        markDesktopFallbackActiveLink();
    }

    function markDesktopFallbackActiveLink() {
        const path = normalizePath(window.location.pathname);
        const activeKey = path.includes('/mobile/about/') ? 'about'
            : path.includes('/mobile/projects/') ? 'projects'
            : path.includes('/mobile/content-studio/') ? 'studio'
            : path.includes('/mobile/contact/') ? 'contact'
            : '';

        if (!activeKey) return;
        const activeLink = document.querySelector('[data-fallback-nav="' + activeKey + '"]');
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }
    
    /**
     * Set active navigation item based on current page URL
     */
    function setActiveNavItem() {
        const currentPath = normalizePath(window.location.pathname);
        const navItems = document.querySelectorAll('.mobile-nav-item');
        
        // Documentation / Guide section — mark Guide icon active
        const isDocumentation = currentPath.includes('/documentation');
        
        navItems.forEach(item => {
            const href = item.getAttribute('href');
            item.classList.remove('active');
            
            if (!href) return;
            
            const hrefPath = getResolvedPathname(href);
            if (!hrefPath) return;

            const hrefNorm = normalizePath(hrefPath);
            const hrefPage = hrefNorm.split('/').pop().split('.')[0];
            const currentPage = currentPath.split('/').pop().split('.')[0];
            
            // Guide icon active on any Documentation page
            if (hrefNorm.includes('documentation') && isDocumentation) {
                item.classList.add('active');
                return;
            }
            
            // Skip Guide icon active detection for non-documentation pages
            if (hrefNorm.includes('documentation')) return;
            
            // Check if current path matches this nav item
            if (hrefPage && currentPage === hrefPage) {
                item.classList.add('active');
            }
            // Special case for home page
            else if ((currentPath.endsWith('/') || currentPath.includes('index') || currentPath.includes('home')) 
                     && (hrefPage === 'index' || hrefPage === 'home')) {
                item.classList.add('active');
            }
        });
    }

    function getResolvedPathname(href) {
        try {
            return new URL(href, window.location.href).pathname;
        } catch (err) {
            return null;
        }
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
            window.scrollToTop();
        }
        // Otherwise, allow normal navigation
    }
    
    // Expose functions globally if needed
    window.mobileNav = {
        setActiveNavItem: setActiveNavItem,
        scrollToTop: window.scrollToTop
    };
    
})();
