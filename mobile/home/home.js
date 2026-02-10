/* ============================================================================
   MOBILE HOME PAGE - JAVASCRIPT
   Interactive features and animations
   ============================================================================ */

(function() {
    'use strict';
    
    // ========== SMOOTH SPLASH SCREEN REMOVAL ==========
    let splashRemoved = false;
    
    // Function to remove splash
    const removeSplashScreen = () => {
        if (splashRemoved) return;
        splashRemoved = true;
        
        const splash = document.getElementById('appSplash');
        if (splash) {
            splash.classList.add('removing');
            splash.style.animation = 'splashFadeOut 0.5s ease forwards';
        }
        
        setTimeout(() => {
            document.body.classList.remove('splash-active');
            if (splash) {
                splash.remove();
            }
        }, 500);
    };
    
    // Immediate fallback to prevent stuck overflow:hidden
    setTimeout(() => {
        document.body.classList.remove('splash-active');
    }, 3000); // Emergency fallback at 3 seconds
    
    // Primary splash handling - use DOMContentLoaded for faster response
    const removeSplash = () => {
        setTimeout(removeSplashScreen, 1500); // Show splash for 1.5 seconds
    };
    
    // Allow user to tap to skip splash
    const splash = document.getElementById('appSplash');
    if (splash) {
        splash.addEventListener('click', removeSplashScreen);
        splash.addEventListener('touchend', removeSplashScreen);
    }
    
    // Use DOMContentLoaded instead of 'load' for faster execution
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', removeSplash);
    } else {
        removeSplash();
    }
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    function init() {
        // Add fade-in animation to sections
        observeSections();
        
        // Add touch feedback to cards
        addTouchFeedback();
        
        // Update stats with animation
        animateStats();
    }
    
    /**
     * Observe sections for fade-in animation
     */
    function observeSections() {
        const sections = document.querySelectorAll('.mobile-section');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '0';
                    entry.target.style.transform = 'translateY(30px)';
                    entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                    
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, 100);
                    
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        sections.forEach(section => {
            observer.observe(section);
        });
    }
    
    /**
     * Add touch feedback to interactive cards
     */
    function addTouchFeedback() {
        const cards = document.querySelectorAll('.quick-link-card, .featured-item, .social-link');
        
        cards.forEach(card => {
            card.addEventListener('touchstart', function() {
                this.style.transition = 'all 0.1s ease';
            }, { passive: true });
            
            card.addEventListener('touchend', function() {
                this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            }, { passive: true });
        });
    }
    
    /**
     * Animate stats numbers
     */
    function animateStats() {
        const stats = document.querySelectorAll('.stat-value');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const text = target.textContent;
                    const number = parseInt(text.replace('+', ''));
                    
                    if (!isNaN(number)) {
                        animateValue(target, 0, number, 1500);
                    }
                    
                    observer.unobserve(target);
                }
            });
        }, { threshold: 0.5 });
        
        stats.forEach(stat => {
            observer.observe(stat);
        });
    }
    
    /**
     * Animate a number from start to end
     */
    function animateValue(element, start, end, duration) {
        const range = end - start;
        const increment = range / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= end) {
                current = end;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current) + '+';
        }, 16);
    }
    
})();
