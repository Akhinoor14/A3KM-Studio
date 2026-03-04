/**
 * Page Loading Progress Bar
 * Shows a red progress bar at the top during page load
 * Automatically hides when page is fully loaded
 */

(function() {
    'use strict';
    
    // Create loading bar element
    const loadingBar = document.createElement('div');
    loadingBar.className = 'page-loading-bar';
    loadingBar.setAttribute('aria-hidden', 'true');
    
    // Add to page immediately
    if (document.body) {
        document.body.insertBefore(loadingBar, document.body.firstChild);
    } else {
        document.addEventListener('DOMContentLoaded', function() {
            document.body.insertBefore(loadingBar, document.body.firstChild);
        });
    }
    
    // Show loading bar immediately
    requestAnimationFrame(function() {
        loadingBar.classList.add('active');
    });
    
    // Hide when page is fully loaded
    function hideLoadingBar() {
        loadingBar.classList.remove('active');
        
        // Remove element after animation completes
        setTimeout(function() {
            if (loadingBar.parentNode) {
                loadingBar.parentNode.removeChild(loadingBar);
            }
        }, 300);
    }
    
    // Listen for page load completion
    if (document.readyState === 'complete') {
        // Already loaded
        setTimeout(hideLoadingBar, 100);
    } else {
        // Wait for load event
        window.addEventListener('load', function() {
            setTimeout(hideLoadingBar, 200);
        });
    }
    
    // Fallback: hide after 5 seconds max
    setTimeout(hideLoadingBar, 5000);
    
})();
