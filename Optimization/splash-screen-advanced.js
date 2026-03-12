/* ============================================================================
   ADVANCED SPLASH SCREEN - JAVASCRIPT
   Enhanced version with progress counter and smooth animations
   ============================================================================ */

(function() {
    'use strict';
    
    let splashRemoved = false;
    const splashAlreadyShown = sessionStorage.getItem('splashShown') === 'true';
    
    // Progress counter animation
    function animateProgress() {
        const progressText = document.getElementById('splashProgress');
        if (!progressText) return;
        
        let progress = 0;
        const duration = 1500; // 1.5 seconds
        const steps = 60; // 60 FPS
        const increment = 100 / steps;
        const interval = duration / steps;
        
        const timer = setInterval(() => {
            progress += increment;
            if (progress >= 100) {
                progress = 100;
                clearInterval(timer);
                progressText.textContent = 'Ready!';
            } else {
                progressText.textContent = `Loading... ${Math.floor(progress)}%`;
            }
        }, interval);
        
        return timer;
    }
    
    // Remove splash screen with animation
    const removeSplashScreen = () => {
        if (splashRemoved) return;
        splashRemoved = true;
        
        const splash = document.getElementById('appSplash');
        if (splash) {
            splash.classList.add('removing');
        }
        
        setTimeout(() => {
            document.body.classList.remove('splash-active');
            if (splash) {
                splash.remove();
            }
        }, 600); // Match the CSS animation duration
        
        // Mark splash as shown for this session
        sessionStorage.setItem('splashShown', 'true');
    };
    
    // If splash already shown, remove immediately
    if (splashAlreadyShown) {
        document.body.classList.remove('splash-active');
        const splash = document.getElementById('appSplash');
        if (splash) {
            splash.remove();
        }
        splashRemoved = true;
    } else {
        // Start progress animation after a short delay
        setTimeout(() => {
            animateProgress();
        }, 500);
        
        // Failsafe: max 4s before auto-remove
        setTimeout(() => {
            document.body.classList.remove('splash-active');
        }, 4000);
        
        // User can click/tap to skip
        const splash = document.getElementById('appSplash');
        if (splash) {
            splash.addEventListener('click', removeSplashScreen);
            splash.addEventListener('touchend', (e) => {
                e.preventDefault();
                removeSplashScreen();
            });
        }
        
        // Auto-remove after animations complete
        const autoRemove = () => {
            setTimeout(removeSplashScreen, 2100); // Logo + progress animations
        };
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', autoRemove);
        } else {
            autoRemove();
        }
    }
})();
