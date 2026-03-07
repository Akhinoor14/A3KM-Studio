/**
 * A3KM Studio — Site Tracker
 * Lightweight public page visitor + session tracker.
 *
 * Records page visits and time-spent to the same localStorage key
 * used by ActivityLogger (a3km_activity_logs), so the admin dashboard
 * can visualize public page traffic alongside content activity.
 *
 * Add to any public page:
 *   <script src="../Optimization/site-tracker.js" defer></script>
 */
(function () {
    'use strict';

    var KEY      = 'a3km_activity_logs';
    var MAX_LOGS = 1000;
    var startMs  = Date.now();
    var pageName = (document.title || '').replace(' | A3KM Studio', '').replace(' - A3KM Studio', '').trim()
                   || window.location.pathname.split('/').filter(Boolean).pop().replace('.html', '')
                   || 'Home';
    var pagePath = window.location.pathname;

    function writeLog(type, activity, status, details) {
        try {
            var logs = JSON.parse(localStorage.getItem(KEY) || '[]');
            logs.unshift({
                id       : Date.now() + Math.random(),
                timestamp: new Date().toISOString(),
                type     : type,
                activity : activity,
                user     : 'Admin',
                status   : status  || 'info',
                details  : details || pagePath
            });
            if (logs.length > MAX_LOGS) logs.splice(MAX_LOGS);
            localStorage.setItem(KEY, JSON.stringify(logs));
        } catch (e) { /* storage full or private mode */ }
    }

    // Log the page visit
    writeLog('pageview', 'Visited: ' + pageName, 'info', pagePath);

    // Log time spent on the page when leaving
    window.addEventListener('beforeunload', function () {
        var secs = Math.round((Date.now() - startMs) / 1000);
        if (secs >= 3) {
            writeLog('session', pageName + ' \u2014 ' + secs + 's', 'info', pagePath);
        }
    });

}());
