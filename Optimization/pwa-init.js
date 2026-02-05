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
        
        // Load splash screen for installed app
        loadSplashScreen();
    }
    
    /**
     * Load app splash screen (only for installed apps)
     */
    function loadSplashScreen() {
        if (document.querySelector('script[src*="app-splash"]')) {
            return; // Already loaded
        }
        
        const script = document.createElement('script');
        script.src = '/Optimization/app-splash-advanced.js';
        // Load immediately, not deferred
        document.head.insertBefore(script, document.head.firstChild);
        console.log('✅ Advanced app splash screen loaded');
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
