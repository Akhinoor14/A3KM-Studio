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
        const currentPath = normalizePath(window.location.pathname);
        const navItems = document.querySelectorAll('.mobile-nav-item');
        
        // Documentation / Guide section — mark Guide icon active
        const isDocumentation = currentPath.includes('/documentation');
        
        navItems.forEach(item => {
            const href = item.getAttribute('href');
            item.classList.remove('active');
            
            if (!href) return;
            
            const hrefNorm = normalizePath(href);
            
            // Guide icon active on any Documentation page
            if (hrefNorm.includes('documentation') && isDocumentation) {
                item.classList.add('active');
                return;
            }
            
            // Skip Guide icon active detection for non-documentation pages
            if (hrefNorm.includes('documentation')) return;
            
            // Check if current path matches this nav item
            if (currentPath.includes(hrefNorm.split('/').pop().split('.')[0])) {
                item.classList.add('active');
            }
            // Special case for home page
            else if ((currentPath.endsWith('/') || currentPath.includes('index') || currentPath.includes('home')) 
                     && hrefNorm.includes('index')) {
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
    
// ══════════════════════════════════════════════════════════════
    // AUTH NAV BUTTON — inject + wire up sign-in / sign-out
    // ══════════════════════════════════════════════════════════════

    function injectAuthNavButton() {
        const container = document.querySelector('.mobile-nav-container');
        if (!container || document.getElementById('mobileNavAuthBtn')) return;

        const btn = document.createElement('button');
        btn.id = 'mobileNavAuthBtn';
        btn.className = 'mobile-nav-auth';
        btn.setAttribute('aria-label', 'Sign In');
        btn.innerHTML = `
            <img class="mobile-nav-avatar" id="mobileNavAvatar" src="" alt="" aria-hidden="true">
            <i class="fas fa-user-circle mobile-nav-auth-icon" aria-hidden="true"></i>
            <span class="mobile-nav-label" id="mobileNavAuthLabel">Sign In</span>
        `;
        btn.addEventListener('click', handleAuthClick);
        container.appendChild(btn);
    }

    function handleAuthClick() {
        showAuthModal();
    }

    // Create and show auth modal with all menu options
    function showAuthModal() {
        const user = window.A3KM && window.A3KM.currentUser;
        
        // Create modal if it doesn't exist
        let modal = document.getElementById('mobileAuthModal');
        if (!modal) {
            modal = createAuthModal();
            document.body.appendChild(modal);
        }
        
        // Update modal content based on login state
        updateModalContent(user);
        
        // Show modal with animation
        modal.style.display = 'flex';
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);
    }
    
    function createAuthModal() {
        const modal = document.createElement('div');
        modal.id = 'mobileAuthModal';
        modal.className = 'mobile-auth-modal';
        modal.innerHTML = `
            <div class="mobile-auth-backdrop"></div>
            <div class="mobile-auth-panel">
                <!-- Profile Card (logged in only) -->
                <div class="mobile-auth-profile" id="mobileAuthProfile" style="display:none;">
                    <img id="mobileAuthProfilePic" class="mobile-auth-profile-pic" src="" alt="">
                    <div class="mobile-auth-profile-info">
                        <span class="mobile-auth-profile-name" id="mobileAuthProfileName">Guest User</span>
                        <span class="mobile-auth-profile-email" id="mobileAuthProfileEmail"></span>
                    </div>
                </div>
                
                <!-- Sign In Button (logged out only) -->
                <button class="mobile-auth-menu-item mobile-auth-signin" id="mobileAuthSignIn" style="display:none;">
                    <i class="fab fa-google"></i>
                    <span>Sign In</span>
                </button>
                
                <!-- My Access (logged in only) -->
                <a href="/buy.html#my-access" class="mobile-auth-menu-item" id="mobileAuthMyAccess" style="display:none;">
                    <i class="fas fa-box-open"></i>
                    <span>My Access</span>
                </a>
                
                <!-- Premium Store (logged in only) -->
                <a href="/buy.html" class="mobile-auth-menu-item" id="mobileAuthStore" style="display:none;">
                    <i class="fas fa-store"></i>
                    <span>Premium Store</span>
                </a>
                
                <!-- Contact (always visible) -->
                <a href="/Contact/contact.html" class="mobile-auth-menu-item">
                    <i class="fas fa-envelope"></i>
                    <span>Contact</span>
                </a>
                
                <!-- Guide (always visible) -->
                <a href="/Documentation/" class="mobile-auth-menu-item">
                    <i class="fas fa-book"></i>
                    <span>Guide</span>
                </a>
                
                <div class="mobile-auth-divider" id="mobileAuthDivider" style="display:none;"></div>
                
                <!-- Sign Out (logged in only) -->
                <button class="mobile-auth-menu-item mobile-auth-signout" id="mobileAuthSignOut" style="display:none;">
                    <i class="fas fa-sign-out-alt"></i>
                    <span>Sign Out</span>
                </button>
            </div>
        `;
        
        // Close modal on backdrop click
        const backdrop = modal.querySelector('.mobile-auth-backdrop');
        backdrop.addEventListener('click', closeAuthModal);
        
        // Close modal on menu item click (except sign in/out which handle themselves)
        const menuItems = modal.querySelectorAll('.mobile-auth-menu-item:not(button)');
        menuItems.forEach(item => {
            item.addEventListener('click', () => {
                setTimeout(closeAuthModal, 100);
            });
        });
        
        // Sign In button handler
        const signInBtn = modal.querySelector('#mobileAuthSignIn');
        signInBtn.addEventListener('click', () => {
            if (window.A3KM && window.A3KM.loginWithGoogle) {
                window.A3KM.loginWithGoogle();
            }
            closeAuthModal();
        });
        
        // Sign Out button handler
        const signOutBtn = modal.querySelector('#mobileAuthSignOut');
        signOutBtn.addEventListener('click', () => {
            if (window.A3KM && window.A3KM.logout) {
                window.A3KM.logout();
            }
            closeAuthModal();
        });
        
        return modal;
    }
    
    function updateModalContent(user) {
        const profile = document.getElementById('mobileAuthProfile');
        const profilePic = document.getElementById('mobileAuthProfilePic');
        const profileName = document.getElementById('mobileAuthProfileName');
        const profileEmail = document.getElementById('mobileAuthProfileEmail');
        const signInBtn = document.getElementById('mobileAuthSignIn');
        const myAccessBtn = document.getElementById('mobileAuthMyAccess');
        const storeBtn = document.getElementById('mobileAuthStore');
        const divider = document.getElementById('mobileAuthDivider');
        const signOutBtn = document.getElementById('mobileAuthSignOut');
        
        if (user) {
            // Logged in: Show profile, My Access, Store, Sign Out
            if (profile) {
                profile.style.display = 'flex';
                if (profilePic) profilePic.src = user.photoURL || 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
                if (profileName) profileName.textContent = user.displayName || 'User';
                if (profileEmail) profileEmail.textContent = user.email || '';
            }
            if (signInBtn) signInBtn.style.display = 'none';
            if (myAccessBtn) myAccessBtn.style.display = 'flex';
            if (storeBtn) storeBtn.style.display = 'flex';
            if (divider) divider.style.display = 'block';
            if (signOutBtn) signOutBtn.style.display = 'flex';
        } else {
            // Logged out: Show only Sign In
            if (profile) profile.style.display = 'none';
            if (signInBtn) signInBtn.style.display = 'flex';
            if (myAccessBtn) myAccessBtn.style.display = 'none';
            if (storeBtn) storeBtn.style.display = 'none';
            if (divider) divider.style.display = 'none';
            if (signOutBtn) signOutBtn.style.display = 'none';
        }
    }
    
    function closeAuthModal() {
        const modal = document.getElementById('mobileAuthModal');
        if (!modal) return;
        
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }

    function updateAuthNavState(user) {
        const btn   = document.getElementById('mobileNavAuthBtn');
        const label = document.getElementById('mobileNavAuthLabel');
        const avatar = document.getElementById('mobileNavAvatar');
        if (!btn) return;

        if (user) {
            btn.classList.add('signed-in');
            btn.setAttribute('aria-label', 'Signed in as ' + (user.displayName || user.email));
            if (avatar && user.photoURL) {
                avatar.src = user.photoURL;
            }
            if (label) {
                const first = user.displayName
                    ? user.displayName.split(' ')[0]
                    : user.email.split('@')[0];
                label.textContent = first.length > 7 ? first.slice(0, 7) + '…' : first;
            }
        } else {
            btn.classList.remove('signed-in');
            btn.setAttribute('aria-label', 'Sign In');
            if (avatar) avatar.src = '';
            if (label) label.textContent = 'Sign In';
        }
    }

    function initAuthNav() {
        injectAuthNavButton();

        // If Firebase auth is already loaded, bind immediately
        if (window.A3KM && window.A3KM.auth) {
            // currentUser may already be known (auth ready fired before navbar init)
            if (window.A3KM.currentUser !== undefined) {
                updateAuthNavState(window.A3KM.currentUser);
            }
            // Also bind for future changes (sign in / sign out)
            window.A3KM.auth.onAuthStateChanged(function(user) {
                updateAuthNavState(user);
            });
            return;
        }

        // Pages without Firebase: load it dynamically then attach
        function _loadScript(src, cb) {
            const s = document.createElement('script');
            s.src = src;
            s.onload = cb;
            document.head.appendChild(s);
        }

        // Detect depth to Optimization/ by counting path segments
        const pathParts = window.location.pathname.split('/').filter(Boolean);
        // mobile pages are 2-4 levels deep from root
        // mobile/home/ → depth 2 → ../../Optimization
        // mobile/content-studio/books-pdfs/ → depth 3 → ../../../Optimization
        const depth = pathParts.length; // number of path segments including file
        const upDots = Array(depth).fill('..').join('/');
        const optBase = upDots + '/Optimization';

        const firebaseSDKs = [
            'https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js',
            'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth-compat.js',
            'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore-compat.js'
        ];

        function loadFirebaseChain(sdks, idx, done) {
            if (idx >= sdks.length) { done(); return; }
            _loadScript(sdks[idx], function() { loadFirebaseChain(sdks, idx + 1, done); });
        }

        // Only load if firebase not yet present
        if (typeof firebase === 'undefined') {
            loadFirebaseChain(firebaseSDKs, 0, function() {
                _loadScript(optBase + '/firebase-config.js', function() {
                    _loadScript(optBase + '/auth-module.js', function() {
                        // auth-module fires a3km:authReady when ready
                        document.addEventListener('a3km:authReady', function(e) {
                            updateAuthNavState(e.detail && e.detail.user);
                        }, { once: true });
                    });
                });
            });
        } else {
            // Firebase loaded but auth-module not yet — just wait for event
            document.addEventListener('a3km:authReady', function(e) {
                updateAuthNavState(e.detail && e.detail.user);
            }, { once: true });
        }
    }

    // Run auth nav after DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAuthNav);
    } else {
        initAuthNav();
    }

    // Expose functions globally if needed
    window.mobileNav = {
        setActiveNavItem: setActiveNavItem,
        scrollToTop: scrollToTop
    };
    
})();
