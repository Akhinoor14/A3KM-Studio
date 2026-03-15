/* ============================================================================
   FULLSCREEN INIT - DISABLED
   Automatic fullscreen functionality has been disabled.
   Manual fullscreen buttons in individual pages will still work.
   ============================================================================ */

// FULLSCREEN AUTO-CLICK SYSTEM DISABLED
// User requested to remove automatic fullscreen clicking setup
// Only manual floating button on home page should remain functional

(function () {
    'use strict';
    
    // Clear any existing fullscreen session data
    if (sessionStorage.getItem('a3km_fullscreen')) {
        sessionStorage.removeItem('a3km_fullscreen');
    }
    
    // Auto-click fullscreen system is now disabled.
    // Keep this file side-effect-only without console noise.
})();
