/**
 * only-boss-navbar.js
 * Injects the shared fixed top navbar on every Only-Boss admin page.
 * Handles: session timer (countdown), last-login display, logout.
 *
 * Include in <head> with defer:
 *   <script src="../../shared/only-boss-navbar.js" defer></script>
 */
(function () {
    'use strict';

    /* --------------------------------------------------
       1.  Compute relative base path → Only-Boss/ root
    -------------------------------------------------- */
    var rawPath = window.location.pathname.replace(/\\/g, '/');
    // Decode %20 etc. so the regex can match "Only-boss"
    try { rawPath = decodeURIComponent(rawPath); } catch (e) {}

    var base = '';  // e.g. "../" or "../../" depending on page depth
    var obMatch = rawPath.match(/\/[Oo]nly-[Bb]oss\/(.*)/);
    if (obMatch) {
        var parts = obMatch[1].split('/');
        var depth = parts.length - 1; // directories below Only-Boss/
        for (var i = 0; i < depth; i++) base += '../';
    }

    var dashHref = base + 'dashboard/only-boss-dashboard-redesigned.html';
    var homeHref = base + '../Home/index.html';
    var logoSrc  = base + '../images/logo.svg';
    var authHref = base + 'auth/only-boss.html';
    var isDash   = /only-boss-dashboard/.test(rawPath);

    /* --------------------------------------------------
       2.  Build navbar HTML
    -------------------------------------------------- */
    var navHTML =
        '<div id="ob-shared-navbar" class="only-boss-unified-header">' +
        '<div class="header-container">' +

        /* Logo */
        '<div class="website-logo">' +
        '<a href="' + homeHref + '" title="Back to website">' +
        '<img src="' + logoSrc + '" alt="A3KM Studio Logo" class="logo-img">' +
        '</a></div>' +

        /* Centre: title + session */
        '<div class="dashboard-info">' +
        '<div class="crown-badge"><i class="fas fa-crown"></i></div>' +
        '<div class="dashboard-text">' +
        '<h1 class="dashboard-title">Administrator Control Panel</h1>' +
        '<p class="dashboard-session">' +
        '<span class="session-status" id="sessionStatus">Session Active</span>' +
        ' &bull; ' +
        '<span class="session-timer"  id="sessionTimer">--:--</span>' +
        ' &bull; Last Login: <span id="lastLogin">--</span>' +
        '</p></div></div>' +

        /* Right: nav + logout */
        '<div class="header-actions">' +
        '<a href="' + dashHref + '" class="nav-btn' + (isDash ? ' active' : '') + '">' +
        '<i class="fas fa-th-large"></i><span>Dashboard</span></a>' +
        '<a href="' + homeHref + '" class="nav-btn home-btn">' +
        '<i class="fas fa-home"></i><span>Home</span></a>' +
        '<button class="logout-btn" id="logoutBtn">' +
        '<i class="fas fa-sign-out-alt"></i><span>Logout</span></button>' +
        '</div>' +

        '</div></div>';

    /* --------------------------------------------------
       3.  Inject + set body padding
    -------------------------------------------------- */
    function injectNav() {
        if (document.getElementById('ob-shared-navbar')) return;
        document.body.insertAdjacentHTML('afterbegin', navHTML);
        // Add space for the 72px fixed bar (respect any existing padding)
        var current = parseInt(window.getComputedStyle(document.body).paddingTop, 10) || 0;
        if (current < 72) {
            document.body.style.paddingTop = '80px';
        }
    }

    /* --------------------------------------------------
       4.  Session countdown timer (30-min session)
    -------------------------------------------------- */
    var _warnShown = false;

    function updateTimer() {
        var authTime = sessionStorage.getItem('authTime');
        if (!authTime) return;

        var elapsed   = Date.now() - parseInt(authTime, 10);
        var remaining = 30 * 60 * 1000 - elapsed;

        if (remaining <= 0) {
            doLogout(true);
            return;
        }

        var min = Math.floor(remaining / 60000);
        var sec = Math.floor((remaining % 60000) / 1000);
        var timerEl = document.getElementById('sessionTimer');
        if (timerEl) {
            timerEl.textContent = min + ':' + (sec < 10 ? '0' : '') + sec;
            if (remaining <= 5 * 60 * 1000) {
                timerEl.style.color = '#FF6B6B';
                timerEl.style.fontWeight = '700';
            } else if (remaining <= 10 * 60 * 1000) {
                timerEl.style.color = '#FFA500';
                timerEl.style.fontWeight = '600';
            } else {
                timerEl.style.color = '#4ECDC4';
                timerEl.style.fontWeight = '600';
            }
        }

        if (remaining <= 5 * 60 * 1000 && !_warnShown) {
            _warnShown = true;
            var statusEl = document.getElementById('sessionStatus');
            if (statusEl) {
                statusEl.textContent = '⚠️ Expiring Soon';
                statusEl.style.color = '#FF6B6B';
            }
            alert('⚠️ Session expires in 5 minutes. Save your work!');
        }
    }

    /* --------------------------------------------------
       5.  Logout
    -------------------------------------------------- */
    function doLogout(forced) {
        if (forced || confirm('Are you sure you want to logout?')) {
            sessionStorage.clear();
            window.location.href = authHref;
        }
    }

    /* --------------------------------------------------
       6.  Initialise (after DOM ready)
    -------------------------------------------------- */
    function init() {
        injectNav();

        // One-time force: open Dashboard tab when coming from manager hubs.
        // We trigger a real click so each page's switchTab(...) runs its data loaders.
        try {
            var forceDashboardOnce = sessionStorage.getItem('onlyBoss_forceDashboardOnce') === '1';
            if (forceDashboardOnce) {
                var tries = 0;
                var maxTries = 10;
                var clickDashboardTab = function () {
                    tries += 1;

                    var dashboardTrigger =
                        document.querySelector('[onclick*="switchTab(\'dashboard\')"]') ||
                        document.querySelector('[onclick*="switchTab(\"dashboard\")"]') ||
                        document.querySelector('.tab-item[data-tab="dashboard"]') ||
                        document.querySelector('[data-tab="dashboard"]');

                    var switched = false;

                    if (dashboardTrigger && typeof dashboardTrigger.click === 'function') {
                        dashboardTrigger.click();
                        switched = true;
                    } else if (typeof window.switchTab === 'function') {
                        try {
                            window.switchTab('dashboard');
                            switched = true;
                        } catch (e) {}
                    }

                    var dashboardPanel = document.getElementById('dashboardTab') || document.getElementById('dashboard');
                    var isActive = !!(dashboardPanel && dashboardPanel.classList && dashboardPanel.classList.contains('active'));

                    if (switched || isActive) {
                        sessionStorage.removeItem('onlyBoss_forceDashboardOnce');
                        return;
                    }

                    if (tries < maxTries) {
                        setTimeout(clickDashboardTab, 120);
                    } else {
                        // Give up quietly after several retries to avoid blocking page behavior.
                        sessionStorage.removeItem('onlyBoss_forceDashboardOnce');
                    }
                };

                setTimeout(clickDashboardTab, 60);
            }
        } catch (e) {
            // Ignore storage/click errors silently.
        }

        // Show last login from session
        var authTime = sessionStorage.getItem('authTime');
        var lastLoginEl = document.getElementById('lastLogin');
        if (lastLoginEl && authTime) {
            lastLoginEl.textContent = new Date(parseInt(authTime, 10)).toLocaleString();
        }

        // Start countdown
        updateTimer();
        setInterval(updateTimer, 1000);

        // Logout button
        var logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function () { doLogout(false); });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
