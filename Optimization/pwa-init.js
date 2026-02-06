/**
 * A3KM Studio - Universal PWA Initializer
 * Auto-loads manifest, service worker, and install prompt
 * Usage: Add this single script to any page's <head>
 */
(function() {
    'use strict';
    
    // Check if already running as installed app
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches || 
                       window.navigator.standalone === true;
    
    if (isInstalled) {
        console.log('✅ Running as installed PWA');
        localStorage.setItem('a3km_pwa_installed', 'true');
        
        // Show a quick cover to avoid initial flash
        showPreSplash();

        // Load splash screen for installed app
        loadSplashScreen();
        // Offer fullscreen toggle for desktop apps (user-initiated)
        showFullscreenPrompt();
    }
    
    /**
     * Load app splash screen (only for installed apps)
     */
    function loadSplashScreen() {
        if (document.querySelector('script[src*="splash"]')) {
            return; // Already loaded
        }
        
        const script = document.createElement('script');
        script.src = '/Optimization/mobile-splash.js'; // Universal splash (mobile + desktop)
        script.async = false; // Load immediately
        document.head.insertBefore(script, document.head.firstChild);
        console.log('✅ Universal splash screen loaded');
    }

    /**
     * Lightweight cover shown before the full splash loads
     */
    function showPreSplash() {
        if (document.getElementById('a3km-pre-splash')) return;

        // Add CSS first
        const css = document.createElement('style');
        css.textContent = `
            #a3km-pre-splash {
                position: fixed;
                inset: 0;
                z-index: 999998;
                background: radial-gradient(circle at 50% 50%, #1a0505 0%, #0a0a0a 100%);
                display: flex;
                align-items: center;
                justify-content: center;
                font-family: 'Courier New', monospace;
                opacity: 1;
                animation: preFadeIn 0.3s ease-out;
            }
            .a3km-pre-splash-content {
                text-align: center;
                animation: preFloat 2s ease-in-out infinite;
            }
            .a3km-pre-splash-logo {
                font-size: 48px;
                font-weight: 700;
                color: #CC0000;
                text-shadow: 0 0 20px #CC0000, 0 0 40px rgba(204,0,0,0.5);
                animation: preGlow 1.5s ease-in-out infinite;
                margin-bottom: 20px;
            }
            .a3km-pre-splash-text {
                font-size: 14px;
                color: #0f0;
                letter-spacing: 2px;
                animation: preBlink 1s ease-in-out infinite;
            }
            @keyframes preFadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes preFloat {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-10px); }
            }
            @keyframes preGlow {
                0%, 100% { 
                    text-shadow: 0 0 20px #CC0000, 0 0 40px rgba(204,0,0,0.5);
                    transform: scale(1);
                }
                50% { 
                    text-shadow: 0 0 30px #ff0000, 0 0 60px #CC0000, 0 0 80px rgba(204,0,0,0.3);
                    transform: scale(1.05);
                }
            }
            @keyframes preBlink {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
            }
            @media (max-width: 768px) {
                .a3km-pre-splash-logo {
                    font-size: 36px;
                }
                .a3km-pre-splash-text {
                    font-size: 12px;
                }
            }
        `;
        document.head.appendChild(css);

        const pre = document.createElement('div');
        pre.id = 'a3km-pre-splash';
        pre.innerHTML = `
            <div class="a3km-pre-splash-content">
                <div class="a3km-pre-splash-logo">A3KM</div>
                <div class="a3km-pre-splash-text">Starting...</div>
            </div>
        `;

        // Ensure document.documentElement or document.head is used if body doesn't exist
        const insertPre = () => {
            if (!document.getElementById('a3km-pre-splash')) {
                if (document.body) {
                    document.body.appendChild(pre);
                } else {
                    // Fallback: append to html element directly
                    document.documentElement.appendChild(pre);
                }
            }
        };

        if (document.body || document.documentElement) {
            insertPre();
        } else {
            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', insertPre, { once: true });
            } else {
                insertPre();
            }
        }
    }

    /**
     * Show a fullscreen prompt button (Edge/Chrome require user gesture)
     */
    function showFullscreenPrompt() {
        if (document.getElementById('a3km-fullscreen-btn')) return;
        if (!document.body) {
            document.addEventListener('DOMContentLoaded', showFullscreenPrompt, { once: true });
            return;
        }

        const btn = document.createElement('button');
        btn.id = 'a3km-fullscreen-btn';
        btn.type = 'button';
        btn.textContent = 'Enter Fullscreen';
        btn.title = 'Switch to fullscreen mode';
        btn.onclick = async () => {
            try {
                if (!document.fullscreenElement) {
                    await document.documentElement.requestFullscreen();
                }
                btn.remove();
            } catch (error) {
                console.warn('Fullscreen request denied:', error);
            }
        };

        const close = document.createElement('button');
        close.type = 'button';
        close.className = 'a3km-fullscreen-close';
        close.textContent = '×';
        close.title = 'Dismiss';
        close.onclick = () => btn.remove();
        btn.appendChild(close);

        document.body.appendChild(btn);
    }
    
    /**
     * Inject manifest link if not present
     */
    function injectManifest() {
        if (document.querySelector('link[rel="manifest"]')) {
            console.log('✅ Manifest already linked');
            return;
        }
        
        const manifest = document.createElement('link');
        manifest.rel = 'manifest';
        manifest.href = '/Optimization/manifest.json';
        document.head.appendChild(manifest);
        console.log('✅ Manifest injected');
    }
    
    /**
     * Inject iOS-specific meta tags
     */
    function injectIOSMeta() {
        if (document.querySelector('meta[name="apple-mobile-web-app-capable"]')) {
            return; // Already present
        }
        
        const tags = [
            { name: 'apple-mobile-web-app-capable', content: 'yes' },
            { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
            { name: 'apple-mobile-web-app-title', content: 'A3KM Studio' }
        ];
        
        tags.forEach(tag => {
            const meta = document.createElement('meta');
            meta.name = tag.name;
            meta.content = tag.content;
            document.head.appendChild(meta);
        });
        
        // Add apple-touch-icon
        const icon = document.createElement('link');
        icon.rel = 'apple-touch-icon';
        icon.href = '/images/favicon.svg';
        document.head.appendChild(icon);
        
        // Add iOS splash screens (optional - uses theme colors if images missing)
        const splashLink = document.createElement('link');
        splashLink.rel = 'apple-touch-startup-image';
        splashLink.href = '/images/favicon.svg';
        document.head.appendChild(splashLink);
        icon.href = '/images/favicon.svg';
        document.head.appendChild(icon);
        
        console.log('✅ iOS meta tags injected');
    }
    
    /**
     * Register service worker
     */
    function registerServiceWorker() {
        if (!('serviceWorker' in navigator)) {
            console.log('⚠️ Service Worker not supported');
            return;
        }
        
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/Optimization/service-worker.js')
                .then(registration => {
                    console.log('✅ Service Worker registered:', registration.scope);
                    
                    // Check for updates
                    registration.addEventListener('updatefound', () => {
                        const newWorker = registration.installing;
                        console.log('🔄 Service Worker update found');
                        
                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                console.log('✅ New version available');
                                // Show update notification
                                showUpdateNotification();
                            }
                        });
                    });
                })
                .catch(err => {
                    console.error('❌ Service Worker registration failed:', err);
                });
        });
    }
    
    /**
     * Show update notification
     */
    function showUpdateNotification() {
        const notification = document.createElement('div');
        notification.id = 'pwa-update-notification';
        notification.style.cssText = `
            position: fixed; top: 20px; right: 20px; z-index: 10000;
            background: linear-gradient(135deg, #0066ff 0%, #0044cc 100%);
            color: white; padding: 16px 24px; border-radius: 12px;
            box-shadow: 0 8px 24px rgba(0,102,255,0.4);
            font-family: 'Inter', sans-serif; font-weight: 600;
            cursor: pointer; transition: transform 0.2s;
            animation: slideInRight 0.5s ease-out;
        `;
        notification.innerHTML = `
            🔄 New version available! Click to update
        `;
        notification.onclick = () => {
            window.location.reload();
        };
        notification.onmouseenter = () => {
            notification.style.transform = 'scale(1.05)';
        };
        notification.onmouseleave = () => {
            notification.style.transform = 'scale(1)';
        };
        
        document.body.appendChild(notification);
        
        // Auto-hide after 10 seconds
        setTimeout(() => {
            notification.style.animation = 'slideInRight 0.5s ease-out reverse';
            setTimeout(() => notification.remove(), 500);
        }, 10000);
    }
    
    /**
     * Load PWA install button script
     */
    function loadInstallScript() {
        if (document.querySelector('script[src*="pwa-install.js"]')) {
            return; // Already loaded
        }
        
        const script = document.createElement('script');
        script.src = '/Optimization/pwa-install.js';
        script.defer = true;
        document.head.appendChild(script);
        console.log('✅ PWA install script loaded');
    }
    
    /**
     * Add animation styles
     */
    function injectStyles() {
        if (document.getElementById('pwa-init-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'pwa-init-styles';
        style.textContent = `
            @keyframes slideInRight {
                from { opacity: 0; transform: translateX(100px); }
                to { opacity: 1; transform: translateX(0); }
            }

            #a3km-pre-splash {
                position: fixed;
                inset: 0;
                z-index: 999998;
                background: radial-gradient(circle at 50% 50%, #1a0505 0%, #0a0a0a 100%);
                display: flex;
                align-items: center;
                justify-content: center;
                font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif;
                color: #fff;
                letter-spacing: 2px;
            }

            .a3km-pre-splash-content {
                text-align: center;
                opacity: 0.9;
                animation: slideInRight 0.35s ease-out;
            }

            .a3km-pre-splash-logo {
                font-size: 28px;
                font-weight: 800;
                color: #CC0000;
                text-shadow: 0 0 20px rgba(204,0,0,0.6);
            }

            .a3km-pre-splash-text {
                font-size: 12px;
                margin-top: 6px;
                color: rgba(255,255,255,0.7);
            }

            #a3km-fullscreen-btn {
                position: fixed;
                right: 20px;
                bottom: 20px;
                z-index: 10001;
                background: linear-gradient(135deg, #CC0000 0%, #990000 100%);
                color: #fff;
                border: 2px solid rgba(255,255,255,0.2);
                border-radius: 999px;
                padding: 10px 16px;
                font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif;
                font-weight: 700;
                font-size: 13px;
                letter-spacing: 0.3px;
                box-shadow: 0 8px 24px rgba(204,0,0,0.4), 0 4px 12px rgba(0,0,0,0.35);
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 10px;
                animation: slideInRight 0.4s ease-out;
            }

            #a3km-fullscreen-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 12px 30px rgba(204,0,0,0.5), 0 6px 16px rgba(0,0,0,0.4);
            }

            #a3km-fullscreen-btn .a3km-fullscreen-close {
                margin-left: 4px;
                background: transparent;
                border: none;
                color: #fff;
                font-size: 18px;
                line-height: 1;
                cursor: pointer;
                opacity: 0.7;
            }

            #a3km-fullscreen-btn .a3km-fullscreen-close:hover {
                opacity: 1;
            }
        `;
        document.head.appendChild(style);
    }
    
    /**
     * Initialize PWA features
     */
    function init() {
        injectManifest();
        injectIOSMeta();
        injectStyles();
        registerServiceWorker();
        
        // Load install prompt (only if not installed)
        if (!isInstalled) {
            loadInstallScript();
        }
    }
    
    // Run initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    console.log('🚀 A3KM Studio PWA initialized');
})();
