/**
 * ===================================
 * A3KM STUDIO - UNIVERSAL MOBILE JAVASCRIPT
 * Complete Mobile Detection & Navigation System
 * ===================================
 */

class A3KMMobileSystem {
    constructor() {
        this.isMobile = this.detectMobile();
        this.isTablet = this.detectTablet();
        this.init();
    }

    /**
     * Detect if device is mobile (FIXED - Desktop resize protected)
     * Uses physical screen size + User Agent for accurate detection
     */
    detectMobile() {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        
        // Priority 1: Check User Agent for actual mobile devices
        const isMobileUA = /android|webos|iphone|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
        
        // Priority 2: Check PHYSICAL screen size (not window size)
        const physicalWidth = window.screen.width;
        const physicalHeight = window.screen.height;
        const smallPhysicalScreen = Math.min(physicalWidth, physicalHeight) <= 768;
        
        // Priority 3: Touch capability (mobile devices have touch)
        const hasTouch = ('ontouchstart' in window) || 
                        (navigator.maxTouchPoints > 0) || 
                        (navigator.msMaxTouchPoints > 0);
        
        // Priority 4: Check for mobile-specific APIs
        const hasMobileFeatures = 'orientation' in window || 'DeviceOrientationEvent' in window;
        
        // Decision Logic:
        // 1. If User Agent says mobile → TRUE (most reliable)
        // 2. If physical screen small + touch support → TRUE (real mobile)
        // 3. If just window resized but large physical screen → FALSE (desktop resize)
        if (isMobileUA) {
            return true; // User Agent confirms mobile
        }
        
        if (smallPhysicalScreen && hasTouch && hasMobileFeatures) {
            return true; // Physical device is mobile
        }
        
        // Desktop browser resized - NOT mobile
        return false;
    }

    /**
     * Detect if device is tablet (FIXED - Desktop resize protected)
     */
    detectTablet() {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        
        // Check User Agent for tablets
        const isTabletUA = /ipad|android(?!.*mobile)|tablet/i.test(userAgent.toLowerCase());
        
        // Check PHYSICAL screen size for tablets
        const physicalWidth = window.screen.width;
        const physicalHeight = window.screen.height;
        const smallerDimension = Math.min(physicalWidth, physicalHeight);
        const largerDimension = Math.max(physicalWidth, physicalHeight);
        
        const isTabletSize = (smallerDimension > 768 && smallerDimension <= 1024) ||
                            (largerDimension >= 1024 && largerDimension <= 1366);
        
        // Touch capability
        const hasTouch = ('ontouchstart' in window) || 
                        (navigator.maxTouchPoints > 0) || 
                        (navigator.msMaxTouchPoints > 0);
        
        return isTabletUA || (isTabletSize && hasTouch);
    }

    /**
     * Initialize mobile system
     */
    init() {
        // Add device class to body
        document.body.classList.add(this.isMobile ? 'mobile-device' : 'desktop-device');
        if (this.isTablet) {
            document.body.classList.add('tablet-device');
        }

        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    /**
     * Setup mobile components
     */
    setup() {
        if (this.isMobile) {
            this.injectMobileNavbar();
            this.setupMobileMenu();
            this.injectEngineeringGrid();
            this.setupTouchOptimization();
            this.setupOrientationChange();
            
            console.log('✅ A3KM Mobile System Activated');
        }
    }

    /**
     * Inject mobile navbar into page
     */
    injectMobileNavbar() {
        // Check if navbar already exists
        if (document.querySelector('.mobile-top-navbar')) return;

        const navbar = document.createElement('div');
        navbar.className = 'mobile-top-navbar';
        navbar.innerHTML = `
            <a href="/index.html" class="mobile-nav-logo">
                <div class="mobile-nav-logo-icon">A3</div>
                <span>A3KM Studio</span>
            </a>
            <div class="mobile-nav-icons">
                <a href="/index.html" class="mobile-nav-icon" title="Home">
                    🏠
                </a>
                <a href="/Content Studio/hub.html" class="mobile-nav-icon" title="Content">
                    📚
                </a>
                <a href="/Projects Code/projects.html" class="mobile-nav-icon" title="Projects">
                    ⚙️
                </a>
                <button class="mobile-nav-icon menu-btn" id="mobileMenuToggle" title="Menu">
                    ☰
                </button>
            </div>
        `;
        
        document.body.insertBefore(navbar, document.body.firstChild);
    }

    /**
     * Setup mobile slide menu
     */
    setupMobileMenu() {
        // Check if menu already exists
        if (document.querySelector('.mobile-slide-menu')) return;

        // Create menu structure
        const menuOverlay = document.createElement('div');
        menuOverlay.className = 'mobile-menu-overlay';
        menuOverlay.id = 'mobileMenuOverlay';

        const slideMenu = document.createElement('div');
        slideMenu.className = 'mobile-slide-menu';
        slideMenu.id = 'mobileSlideMenu';
        slideMenu.innerHTML = `
            <div class="mobile-menu-section">
                <div class="mobile-menu-section-title">🏠 Main Navigation</div>
                <a href="/index.html" class="mobile-menu-item">
                    <span class="mobile-menu-item-icon">🏠</span>
                    <span>Home</span>
                </a>
                <a href="/About me/about.html" class="mobile-menu-item">
                    <span class="mobile-menu-item-icon">👤</span>
                    <span>About Me</span>
                </a>
                <a href="/Contact/contact.html" class="mobile-menu-item">
                    <span class="mobile-menu-item-icon">📧</span>
                    <span>Contact</span>
                </a>
            </div>

            <div class="mobile-menu-section">
                <div class="mobile-menu-section-title">📚 Content & Learning</div>
                <a href="/Content Studio/hub.html" class="mobile-menu-item">
                    <span class="mobile-menu-item-icon">📚</span>
                    <span>Content Studio</span>
                </a>
                <a href="/About me/certificates-viewer.html" class="mobile-menu-item">
                    <span class="mobile-menu-item-icon">🏆</span>
                    <span>Certificates</span>
                </a>
            </div>

            <div class="mobile-menu-section">
                <div class="mobile-menu-section-title">⚙️ Engineering Projects</div>
                <a href="/Projects Code/projects.html" class="mobile-menu-item">
                    <span class="mobile-menu-item-icon">⚙️</span>
                    <span>All Projects</span>
                </a>
                <a href="/Projects Code/Arduino/arduino-projects.html" class="mobile-menu-item">
                    <span class="mobile-menu-item-icon">🔌</span>
                    <span>Arduino Projects</span>
                </a>
                <a href="/Projects Code/MATLAB/matlab-projects.html" class="mobile-menu-item">
                    <span class="mobile-menu-item-icon">📊</span>
                    <span>MATLAB Projects</span>
                </a>
                <a href="/Projects Code/solidworks/solidworks-pro.html" class="mobile-menu-item">
                    <span class="mobile-menu-item-icon">🔧</span>
                    <span>SolidWorks Projects</span>
                </a>
            </div>
        `;

        document.body.appendChild(menuOverlay);
        document.body.appendChild(slideMenu);

        // Setup menu toggle functionality
        const menuToggle = document.getElementById('mobileMenuToggle');
        const menu = document.getElementById('mobileSlideMenu');
        const overlay = document.getElementById('mobileMenuOverlay');

        if (menuToggle && menu && overlay) {
            menuToggle.addEventListener('click', () => {
                menu.classList.toggle('active');
                overlay.classList.toggle('active');
                menuToggle.textContent = menu.classList.contains('active') ? '✕' : '☰';
            });

            overlay.addEventListener('click', () => {
                menu.classList.remove('active');
                overlay.classList.remove('active');
                menuToggle.textContent = '☰';
            });

            // Close menu when clicking a link
            const menuLinks = slideMenu.querySelectorAll('.mobile-menu-item');
            menuLinks.forEach(link => {
                link.addEventListener('click', () => {
                    menu.classList.remove('active');
                    overlay.classList.remove('active');
                    menuToggle.textContent = '☰';
                });
            });
        }
    }

    /**
     * Inject engineering grid background
     */
    injectEngineeringGrid() {
        // Check if grid already exists
        if (document.querySelector('.engineering-grid-bg')) return;

        const grid = document.createElement('div');
        grid.className = 'engineering-grid-bg';
        document.body.insertBefore(grid, document.body.firstChild);
    }

    /**
     * Setup touch optimization
     */
    setupTouchOptimization() {
        // Prevent double-tap zoom
        let lastTouchEnd = 0;
        document.addEventListener('touchend', (event) => {
            const now = Date.now();
            if (now - lastTouchEnd <= 300) {
                event.preventDefault();
            }
            lastTouchEnd = now;
        }, false);

        // Add touch feedback to interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .mobile-card, .mobile-menu-item');
        interactiveElements.forEach(element => {
            element.addEventListener('touchstart', function() {
                this.style.opacity = '0.7';
            });
            element.addEventListener('touchend', function() {
                setTimeout(() => {
                    this.style.opacity = '1';
                }, 100);
            });
        });
    }

    /**
     * Setup orientation change handling
     */
    setupOrientationChange() {
        window.addEventListener('orientationchange', () => {
            // Close mobile menu on orientation change
            const menu = document.getElementById('mobileSlideMenu');
            const overlay = document.getElementById('mobileMenuOverlay');
            const menuToggle = document.getElementById('mobileMenuToggle');
            
            if (menu && overlay && menuToggle) {
                menu.classList.remove('active');
                overlay.classList.remove('active');
                menuToggle.textContent = '☰';
            }

            // Recalculate viewport
            setTimeout(() => {
                window.scrollTo(0, 1);
            }, 100);
        });
    }

    /**
     * Wrap content in mobile wrapper if not already wrapped
     */
    static wrapContent() {
        const body = document.body;
        const navbar = document.querySelector('.mobile-top-navbar');
        const menu = document.querySelector('.mobile-slide-menu');
        const overlay = document.querySelector('.mobile-menu-overlay');
        const grid = document.querySelector('.engineering-grid-bg');
        
        // Check if content is already wrapped
        if (document.querySelector('.mobile-content-wrapper')) return;

        // Get all body children except navbar, menu, overlay, and grid
        const children = Array.from(body.children).filter(child => 
            child !== navbar && 
            child !== menu && 
            child !== overlay && 
            child !== grid
        );

        // Create wrapper
        const wrapper = document.createElement('div');
        wrapper.className = 'mobile-content-wrapper mobile-animate-in';

        // Move children into wrapper
        children.forEach(child => {
            wrapper.appendChild(child);
        });

        // Add wrapper to body
        body.appendChild(wrapper);
    }

    /**
     * Show loading spinner
     */
    static showLoader(parent = document.body) {
        const loader = document.createElement('div');
        loader.className = 'mobile-loader';
        loader.id = 'a3km-mobile-loader';
        parent.appendChild(loader);
        return loader;
    }

    /**
     * Hide loading spinner
     */
    static hideLoader() {
        const loader = document.getElementById('a3km-mobile-loader');
        if (loader) {
            loader.remove();
        }
    }

    /**
     * Show mobile alert
     */
    static showAlert(message, type = 'info', duration = 3000) {
        const alert = document.createElement('div');
        alert.className = `mobile-alert mobile-alert-${type} mobile-fade-in`;
        alert.innerHTML = `
            <span class="mobile-alert-icon">${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</span>
            <span>${message}</span>
        `;
        
        const wrapper = document.querySelector('.mobile-content-wrapper') || document.body;
        wrapper.insertBefore(alert, wrapper.firstChild);

        if (duration > 0) {
            setTimeout(() => {
                alert.style.opacity = '0';
                setTimeout(() => alert.remove(), 300);
            }, duration);
        }

        return alert;
    }

    /**
     * Smooth scroll to element
     */
    static scrollTo(element, offset = 0) {
        const target = typeof element === 'string' ? document.querySelector(element) : element;
        if (!target) return;

        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset - 60; // 60 = navbar height
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }

    /**
     * Get device info (FIXED - Uses actual mobile detection)
     */
    static getDeviceInfo() {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        const isMobileUA = /android|webos|iphone|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
        const physicalWidth = window.screen.width;
        const hasTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
        
        // Use proper mobile detection logic
        const actuallyMobile = isMobileUA || (physicalWidth <= 768 && hasTouch);
        
        return {
            isMobile: actuallyMobile,
            isTablet: /ipad|android(?!.*mobile)|tablet/i.test(userAgent.toLowerCase()),
            isDesktop: !actuallyMobile,
            windowWidth: window.innerWidth,
            windowHeight: window.innerHeight,
            screenWidth: window.screen.width,
            screenHeight: window.screen.height,
            orientation: window.innerHeight > window.innerWidth ? 'portrait' : 'landscape',
            hasTouch: hasTouch,
            userAgent: navigator.userAgent
        };
    }
}

// Initialize the mobile system
const a3kmMobile = new A3KMMobileSystem();

// Expose globally for other scripts
window.A3KMMobile = A3KMMobileSystem;

// Auto-wrap content when DOM is fully loaded
window.addEventListener('load', () => {
    if (a3kmMobile.isMobile) {
        A3KMMobileSystem.wrapContent();
    }
});

console.log('🚀 A3KM Mobile System Loaded');
