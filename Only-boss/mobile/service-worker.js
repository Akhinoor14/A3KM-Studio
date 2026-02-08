// Only Boss Mobile - Service Worker
// Version: 1.0.0
// PWA Offline Support & Caching Strategy

const CACHE_VERSION = 'onlyboss-v1.0.0';
const OFFLINE_URL = '/Only-boss/mobile/offline.html';

// Assets to cache immediately on install
const STATIC_CACHE_URLS = [
    '/Only-boss/mobile/dashboard/index.html',
    '/Only-boss/mobile/dashboard/dashboard.css',
    '/Only-boss/mobile/dashboard/dashboard.js',
    '/Only-boss/mobile/auth/login.html',
    '/Only-boss/mobile/auth/auth.css',
    '/Only-boss/auth/only-boss-auth.js',
    '/Only-boss/mobile/shared/auth-guard.js',
    OFFLINE_URL
];

// Install Event - Cache static assets
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installing...');
    
    event.waitUntil(
        caches.open(CACHE_VERSION)
            .then((cache) => {
                console.log('[Service Worker] Caching static assets');
                return cache.addAll(STATIC_CACHE_URLS);
            })
            .then(() => {
                console.log('[Service Worker] Installation complete');
                return self.skipWaiting(); // Activate immediately
            })
            .catch((error) => {
                console.error('[Service Worker] Installation failed:', error);
            })
    );
});

// Activate Event - Clean up old caches
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activating...');
    
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames
                        .filter((cacheName) => {
                            // Delete old cache versions
                            return cacheName !== CACHE_VERSION;
                        })
                        .map((cacheName) => {
                            console.log('[Service Worker] Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        })
                );
            })
            .then(() => {
                console.log('[Service Worker] Activation complete');
                return self.clients.claim(); // Take control immediately
            })
    );
});

// Fetch Event - Network-first with cache fallback strategy
self.addEventListener('fetch', (event) => {
    const { request } = event;
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // Skip external requests (CDN, APIs, etc.)
    const url = new URL(request.url);
    if (!url.origin.includes(self.location.origin) && 
        !url.origin.includes('github.com')) {
        return;
    }
    
    // Handle navigation requests (HTML pages)
    if (request.mode === 'navigate') {
        event.respondWith(handleNavigationRequest(request));
        return;
    }
    
    // Handle all other requests
    event.respondWith(handleResourceRequest(request));
});

// Handle Navigation Requests (HTML Pages)
async function handleNavigationRequest(request) {
    try {
        // Try network first
        const networkResponse = await fetch(request);
        
        // Cache successful responses
        if (networkResponse.ok) {
            const cache = await caches.open(CACHE_VERSION);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.log('[Service Worker] Network failed, trying cache:', request.url);
        
        // Try cache
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Show offline page if available
        const offlineResponse = await caches.match(OFFLINE_URL);
        if (offlineResponse) {
            return offlineResponse;
        }
        
        // Last resort: generic offline response
        return new Response(
            '<html><body><h1>Offline</h1><p>No internet connection</p></body></html>',
            { headers: { 'Content-Type': 'text/html' } }
        );
    }
}

// Handle Resource Requests (CSS, JS, Images, etc.)
async function handleResourceRequest(request) {
    try {
        // Try cache first for resources
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            // Return cached version and update in background
            fetchAndCache(request);
            return cachedResponse;
        }
        
        // If not in cache, fetch from network
        return await fetchAndCache(request);
    } catch (error) {
        console.log('[Service Worker] Resource fetch failed:', request.url);
        
        // Return cached version if available
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Return error response
        return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
    }
}

// Fetch and Cache Helper
async function fetchAndCache(request) {
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
        const cache = await caches.open(CACHE_VERSION);
        cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
}

// Message Handler - For cache management
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'CLEAR_CACHE') {
        event.waitUntil(
            caches.keys().then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => caches.delete(cacheName))
                );
            }).then(() => {
                event.ports[0].postMessage({ success: true });
            })
        );
    }
    
    if (event.data && event.data.type === 'CACHE_URLS') {
        const urls = event.data.urls || [];
        event.waitUntil(
            caches.open(CACHE_VERSION).then((cache) => {
                return cache.addAll(urls);
            }).then(() => {
                event.ports[0].postMessage({ success: true });
            })
        );
    }
});

// Background Sync (for future implementation)
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-github') {
        event.waitUntil(syncWithGitHub());
    }
});

async function syncWithGitHub() {
    console.log('[Service Worker] Background sync with GitHub');
    // Future: Implement GitHub sync logic
    return Promise.resolve();
}

// Push Notifications (for future implementation)
self.addEventListener('push', (event) => {
    const data = event.data ? event.data.json() : {};
    const title = data.title || 'Only Boss';
    const options = {
        body: data.body || 'New notification',
        icon: '/Only-boss/images/favicon.svg',
        badge: '/Only-boss/images/favicon.svg',
        vibrate: [200, 100, 200]
    };
    
    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow('/Only-boss/mobile/dashboard/index.html')
    );
});

console.log('[Service Worker] Loaded successfully');
