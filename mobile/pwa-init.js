// ============================================================================
// PWA INITIALIZATION - Mobile App Setup
// Registers service worker and handles install prompt
// ============================================================================

(function() {
    'use strict';

    let deferredPrompt = null;

    // ========== SERVICE WORKER REGISTRATION ==========
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/mobile/service-worker.js')
                .then((registration) => {
                    console.log('[PWA] Service Worker registered:', registration.scope);

                    // Check for updates
                    registration.addEventListener('updatefound', () => {
                        const newWorker = registration.installing;
                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                showUpdateNotification();
                            }
                        });
                    });
                })
                .catch((error) => {
                    console.error('[PWA] Service Worker registration failed:', error);
                });
        });
    }

    // ========== INSTALL PROMPT HANDLING ==========
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        showInstallButton();
    });

    // ========== APP INSTALLED ==========
    window.addEventListener('appinstalled', () => {
        console.log('[PWA] App installed successfully');
        deferredPrompt = null;
        hideInstallButton();
        
        if (navigator.vibrate) {
            navigator.vibrate([50, 100, 50]);
        }

        showToast('App installed! Launch from home screen anytime.');
    });

    // ========== SHOW INSTALL BUTTON ==========
    function showInstallButton() {
        // Create install button if it doesn't exist
        let installBtn = document.getElementById('pwaInstallBtn');
        
        if (!installBtn) {
            installBtn = document.createElement('button');
            installBtn.id = 'pwaInstallBtn';
            installBtn.innerHTML = '<i class="fas fa-download"></i> Install App';
            installBtn.style.cssText = `
                position: fixed;
                bottom: 90px;
                right: 16px;
                padding: 12px 20px;
                background: linear-gradient(135deg, #CC0000, #8B0000);
                color: #fff;
                border: none;
                border-radius: 25px;
                font-size: 14px;
                font-weight: 700;
                box-shadow: 0 4px 15px rgba(204, 0, 0, 0.4);
                cursor: pointer;
                z-index: 9999;
                display: flex;
                align-items: center;
                gap: 8px;
                transition: all 0.3s ease;
            `;
            
            installBtn.addEventListener('click', handleInstallClick);
            installBtn.addEventListener('touchstart', () => {
                if (navigator.vibrate) navigator.vibrate(10);
            });
            
            document.body.appendChild(installBtn);

            // Auto-hide after 10 seconds
            setTimeout(() => {
                if (installBtn && deferredPrompt) {
                    installBtn.style.transform = 'translateX(150%)';
                    setTimeout(() => installBtn.remove(), 300);
                }
            }, 10000);
        }
    }

    // ========== HIDE INSTALL BUTTON ==========
    function hideInstallButton() {
        const installBtn = document.getElementById('pwaInstallBtn');
        if (installBtn) {
            installBtn.style.transform = 'translateX(150%)';
            setTimeout(() => installBtn.remove(), 300);
        }
    }

    // ========== HANDLE INSTALL CLICK ==========
    async function handleInstallClick() {
        if (!deferredPrompt) return;

        // Show the install prompt
        deferredPrompt.prompt();

        // Wait for the user's response
        const { outcome } = await deferredPrompt.userChoice;
        console.log('[PWA] User choice:', outcome);

        if (outcome === 'accepted') {
            console.log('[PWA] User accepted the install prompt');
            if (navigator.vibrate) {
                navigator.vibrate([30, 50, 30]);
            }
        } else {
            console.log('[PWA] User dismissed the install prompt');
        }

        deferredPrompt = null;
        hideInstallButton();
    }

    // ========== UPDATE NOTIFICATION ==========
    function showUpdateNotification() {
        const updateNotif = document.createElement('div');
        updateNotif.id = 'pwaUpdateNotif';
        updateNotif.innerHTML = `
            <div style="flex: 1;">
                <strong>Update Available</strong>
                <p style="margin: 4px 0 0; font-size: 13px; opacity: 0.9;">A new version is ready</p>
            </div>
            <button id="pwaUpdateBtn" style="padding: 8px 16px; background: #fff; color: #000; border: none; border-radius: 6px; font-weight: 700; cursor: pointer;">
                Update
            </button>
        `;
        updateNotif.style.cssText = `
            position: fixed;
            bottom: 90px;
            left: 16px;
            right: 16px;
            padding: 16px;
            background: rgba(204, 0, 0, 0.95);
            color: #fff;
            border-radius: 12px;
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.5);
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: 14px;
            animation: slideUp 0.3s ease;
        `;
        
        document.body.appendChild(updateNotif);

        document.getElementById('pwaUpdateBtn').addEventListener('click', () => {
            if (navigator.serviceWorker.controller) {
                navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
            }
            window.location.reload();
        });

        // Auto-dismiss after 30 seconds
        setTimeout(() => {
            if (updateNotif && updateNotif.parentNode) {
                updateNotif.style.animation = 'slideDown 0.3s ease';
                setTimeout(() => updateNotif.remove(), 300);
            }
        }, 30000);
    }

    // ========== TOAST NOTIFICATION ==========
    function showToast(message, duration = 3000) {
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 90px;
            left: 50%;
            transform: translateX(-50%);
            padding: 14px 24px;
            background: rgba(204, 0, 0, 0.95);
            color: #fff;
            border-radius: 10px;
            font-size: 14px;
            font-weight: 600;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            max-width: calc(100% - 32px);
            text-align: center;
            animation: fadeInOut ${duration}ms ease;
        `;
        
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), duration);
    }

    // ========== CHECK IF ALREADY INSTALLED ==========
    if (window.matchMedia('(display-mode: standalone)').matches || 
        window.navigator.standalone === true) {
        console.log('[PWA] App is running in standalone mode');
    }

    // ========== HANDLE OFFLINE/ONLINE ==========
    window.addEventListener('online', () => {
        showToast('🟢 Back online!', 2000);
    });

    window.addEventListener('offline', () => {
        showToast('🔴 You are offline. Some features may be limited.', 3000);
    });

    // ========== ADD CSS ANIMATIONS ==========
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideUp {
            from { transform: translateY(100%); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        @keyframes slideDown {
            from { transform: translateY(0); opacity: 1; }
            to { transform: translateY(100%); opacity: 0; }
        }
        @keyframes fadeInOut {
            0%, 100% { opacity: 0; }
            10%, 90% { opacity: 1; }
        }
    `;
    document.head.appendChild(style);

    console.log('[PWA] Initialization complete');

})();
