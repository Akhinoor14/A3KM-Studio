/* ============================================================================
   FULLSCREEN INIT - First Interaction Fullscreen Request
   Requests fullscreen on the very first user interaction (click/tap).
   Works on all desktop pages. Silently ignored if already fullscreen
   or if user dismisses the prompt.
   ============================================================================ */

(function () {
    'use strict';

    // Only run on desktop (skip mobile)
    if (navigator.userAgentData ? navigator.userAgentData.mobile : /android|iphone|ipad|ipod/i.test(navigator.userAgent)) return;

    function requestFullscreen() {
        const el = document.documentElement;
        if (document.fullscreenElement) return; // already fullscreen
        const fn = el.requestFullscreen || el.webkitRequestFullscreen || el.mozRequestFullScreen || el.msRequestFullscreen;
        if (fn) fn.call(el).catch(() => {}); // silently ignore denial
    }

    // Fire on first click anywhere on the page, then remove listener
    document.addEventListener('click', requestFullscreen, { once: true, passive: true });
})();
