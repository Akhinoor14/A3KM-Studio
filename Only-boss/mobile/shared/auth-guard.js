// ============================================================================
// ONLY BOSS MOBILE - AUTH GUARD (SESSION VALIDATION)
// Reuses desktop backend auth logic - No duplication!
// ============================================================================

// Import desktop auth functions (same backend logic)
// This script should be loaded AFTER only-boss-auth.js

(function() {
    'use strict';
    
    // ========================================================================
    // MOBILE AUTH GUARD - Uses desktop's validateSession()
    // ========================================================================
    
    async function guardPage() {
        // Use desktop's validation function
        const isValid = await validateSession();
        
        if (!isValid) {
            // Clear any invalid session data
            clearSession();
            
            // Redirect to mobile login
            window.location.href = '/Only-boss/mobile/auth/login.html';
            return;
        }
        
        // Valid session - continue
        console.log('🔒 Auth Guard: Session valid');
    }
    
    // ========================================================================
    // ADDITIONAL MOBILE-SPECIFIC CHECKS
    // ========================================================================
    
    // Check if page is being accessed from mobile
    function isMobileDevice() {
        const ua = navigator.userAgent.toLowerCase();
        return /mobile|android|iphone|ipad|ipod|windows phone/i.test(ua);
    }
    
    // Verify mobile context (optional safety check)
    function verifyMobileContext() {
        if (!isMobileDevice() && window.innerWidth > 768) {
            console.warn('⚠️ Accessing mobile admin from desktop - redirecting to desktop version');
            
            // Optional: redirect to desktop version
            // window.location.href = '/Only-boss/auth/login.html';
        }
    }
    
    // ========================================================================
    // SESSION MONITORING
    // ========================================================================
    
    // Monitor session expiry
    function monitorSession() {
        const authTime = sessionStorage.getItem('authTime');
        
        if (!authTime) {
            window.location.href = '/Only-boss/mobile/auth/login.html';
            return;
        }
        
        const elapsed = Date.now() - parseInt(authTime);
        const sessionDuration = 30 * 60 * 1000; // 30 minutes
        
        if (elapsed >= sessionDuration) {
            alert('Session expired. Please login again.');
            clearSession();
            window.location.href = '/Only-boss/mobile/auth/login.html';
        }
    }
    
    // Check session every 30 seconds
    setInterval(monitorSession, 30000);
    
    // ========================================================================
    // BROWSER TAB VISIBILITY
    // ========================================================================
    
    // Re-validate when tab becomes visible
    document.addEventListener('visibilitychange', async () => {
        if (!document.hidden) {
            const isValid = await validateSession();
            if (!isValid) {
                alert('Session expired while you were away.');
                clearSession();
                window.location.href = '/Only-boss/mobile/auth/login.html';
            }
        }
    });
    
    // ========================================================================
    // PREVENT BACK NAVIGATION AFTER LOGOUT
    // ========================================================================
    
    window.addEventListener('pageshow', async (event) => {
        // If page is loaded from cache (back button)
        if (event.persisted) {
            const isValid = await validateSession();
            if (!isValid) {
                window.location.href = '/Only-boss/mobile/auth/login.html';
            }
        }
    });
    
    // ========================================================================
    // EXECUTE GUARD ON PAGE LOAD
    // ========================================================================
    
    // Run guard immediately
    guardPage();
    
    // Run context verification
    verifyMobileContext();
    
    // Start session monitoring
    monitorSession();
    
    // ========================================================================
    // EXPORT GUARD FUNCTION (if needed elsewhere)
    // ========================================================================
    
    window.mobileAuthGuard = {
        validate: guardPage,
        monitor: monitorSession,
        isMobile: isMobileDevice
    };
    
})();

// ============================================================================
// USAGE IN MOBILE PAGES:
// ============================================================================
// <script src="../../auth/only-boss-auth.js"></script>  <!-- Desktop backend -->
// <script src="../shared/auth-guard.js"></script>       <!-- Mobile guard -->
// ============================================================================
