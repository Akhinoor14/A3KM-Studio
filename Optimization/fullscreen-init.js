/* ============================================================================
   FULLSCREEN INIT - Persistent Fullscreen Across Pages
   First non-navigation click → enters fullscreen + saves to sessionStorage.
   Every subsequent page load → auto-enters fullscreen if previously approved.
   Navbar link clicks (which navigate) do NOT trigger fullscreen.
   ============================================================================ */

(function () {
    'use strict';

    const SESSION_KEY = 'a3km_fullscreen';

    // Only run on desktop (skip mobile)
    if (navigator.userAgentData ? navigator.userAgentData.mobile : /android|iphone|ipad|ipod/i.test(navigator.userAgent)) return;

    function enterFullscreen() {
        const el = document.documentElement;
        if (document.fullscreenElement) return;
        const fn = el.requestFullscreen || el.webkitRequestFullscreen || el.mozRequestFullScreen || el.msRequestFullscreen;
        if (fn) fn.call(el).catch(() => {});
    }

    // If user already approved fullscreen in this session, auto-enter on page load
    if (sessionStorage.getItem(SESSION_KEY) === '1') {
        document.addEventListener('DOMContentLoaded', function () {
            // Small delay so browser accepts the request on page load
            setTimeout(enterFullscreen, 300);
        });
        return; // no need to add click listener
    }

    // First visit: wait for a non-navigation click to request fullscreen
    function onFirstClick(e) {
        // Skip if the click target is a link (or inside one) that will navigate away
        const anchor = e.target.closest('a[href]');
        if (anchor) {
            const href = anchor.getAttribute('href');
            // Allow fullscreen for same-page anchors (#), block real navigation links
            if (href && href !== '#' && !href.startsWith('#')) return;
        }

        sessionStorage.setItem(SESSION_KEY, '1');
        enterFullscreen();
        document.removeEventListener('click', onFirstClick);
    }

    document.addEventListener('click', onFirstClick);
})();
