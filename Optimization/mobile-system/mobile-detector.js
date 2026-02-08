/* ============================================================================
   MOBILE DETECTOR & REDIRECT HELPER
   Avoids desktop window resize false-positives by using UA-based detection.
   ============================================================================ */

(function() {
    'use strict';

    function isMobileDevice() {
        const uaData = navigator.userAgentData;
        if (uaData && typeof uaData.mobile === 'boolean') {
            return uaData.mobile;
        }

        const ua = navigator.userAgent || navigator.vendor || window.opera;
        return /android|iphone|ipad|ipod|iemobile|opera mini|blackberry|mobile/i.test(ua);
    }

    function normalizePath(pathname) {
        try {
            return decodeURIComponent(pathname).toLowerCase();
        } catch (err) {
            return pathname.toLowerCase();
        }
    }

    function resolveTarget(targetUrl) {
        if (!targetUrl) return null;
        try {
            return new URL(targetUrl, window.location.href).href;
        } catch (err) {
            return targetUrl;
        }
    }

    function shouldRedirect(targetUrl) {
        if (!targetUrl) return false;
        const target = resolveTarget(targetUrl);
        return target && window.location.href !== target;
    }

    function redirectToMobile(targetUrl) {
        if (!isMobileDevice()) return;
        if (!shouldRedirect(targetUrl)) return;
        window.location.replace(targetUrl);
    }

    function redirectToDesktop(targetUrl) {
        if (isMobileDevice()) return;
        if (!shouldRedirect(targetUrl)) return;
        window.location.replace(targetUrl);
    }

    function getMobileEquivalentPath() {
        const path = normalizePath(window.location.pathname);
        const mappings = [
            { desktop: '/home/index.html', mobile: '/mobile/home/index.html' },
            { desktop: '/about me/about.html', mobile: '/mobile/about/about.html' },
            { desktop: '/projects code/projects.html', mobile: '/mobile/projects/projects.html' },
            { desktop: '/content studio/hub.html', mobile: '/mobile/content-studio/hub.html' },
            { desktop: '/contact/contact.html', mobile: '/mobile/contact/contact.html' },
            { desktop: '/content studio/video-content/video-gallery.html', mobile: '/mobile/content-studio/video-blogs/video-gallery.html' },
            { desktop: '/content studio/video-content/video-viewer.html', mobile: '/mobile/content-studio/video-blogs/video-viewer.html' },
            { desktop: '/content studio/written-posts/post-listing-new.html', mobile: '/mobile/content-studio/written-posts/post-listing.html' },
            { desktop: '/content studio/written-posts/post-reader.html', mobile: '/mobile/content-studio/written-posts/post-reader.html' },
            { desktop: '/content studio/educational-videos/course-listing-new.html', mobile: '/mobile/content-studio/educational-courses/course-listing.html' },
            { desktop: '/content studio/educational-videos/course-viewer-new.html', mobile: '/mobile/content-studio/educational-courses/course-viewer.html' },
            { desktop: '/content studio/books-pdfs/book-listing-new.html', mobile: '/mobile/content-studio/books-pdfs/book-listing.html' },
            { desktop: '/content studio/books-pdfs/book-reader-new.html', mobile: '/mobile/content-studio/books-pdfs/book-reader.html' },
            { desktop: '/content studio/research-papers/paper-listing-new.html', mobile: '/mobile/content-studio/research-papers/paper-listing.html' },
            { desktop: '/content studio/research-papers/paper-viewer-new.html', mobile: '/mobile/content-studio/research-papers/paper-viewer.html' }
        ];

        for (const mapping of mappings) {
            if (path.endsWith(mapping.desktop)) {
                return mapping.mobile;
            }
        }

        return null;
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
            { mobile: '/mobile/content-studio/books-pdfs/book-reader.html', desktop: '/Content Studio/books-pdfs/book-reader-new.html' },
            { mobile: '/mobile/content-studio/research-papers/paper-listing.html', desktop: '/Content Studio/research-papers/paper-listing-new.html' },
            { mobile: '/mobile/content-studio/research-papers/paper-viewer.html', desktop: '/Content Studio/research-papers/paper-viewer-new.html' }
        ];

        for (const mapping of mappings) {
            if (path.endsWith(mapping.mobile)) {
                return mapping.desktop;
            }
        }

        return null;
    }

    function redirectToMobileAuto() {
        if (!isMobileDevice()) return;
        const target = getMobileEquivalentPath();
        if (target && shouldRedirect(target)) {
            window.location.replace(target);
        }
    }

    function redirectToDesktopAuto() {
        if (isMobileDevice()) return;
        const target = getDesktopEquivalentPath();
        if (target && shouldRedirect(target)) {
            window.location.replace(target);
        }
    }

    window.mobileDetector = {
        isMobileDevice,
        redirectToMobile,
        redirectToDesktop,
        redirectToMobileAuto,
        redirectToDesktopAuto
    };
})();
