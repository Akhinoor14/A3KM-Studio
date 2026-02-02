/**
 * Content Studio Service Worker
 * Provides offline support and caching
 * Author: Md Akhinoor Islam
 * A3KM Studio
 */

const CACHE_VERSION = 'a3km-studio-v1.0.0';
const CACHE_NAME = `content-studio-${CACHE_VERSION}`;

// Files to cache immediately (static assets)
const PRECACHE_URLS = [
    // Hub pages
    '/Content Studio/hub.html',
    '/Content Studio/hub-desktop.css',
    '/Content Studio/hub.js',
    '/Content Studio/hub-config.json',
    
    // Core scripts
    '/Content Studio/analytics.js',
    '/Content Studio/lazy-loading.js',
    
    // Viewers
    '/Content Studio/written-posts/post-viewer.html',
    '/Content Studio/written-posts/post-viewer.css',
    '/Content Studio/written-posts/post-viewer.js',
    '/Content Studio/video-content/video-viewer.html',
    '/Content Studio/educational-videos/course-viewer.html',
    '/Content Studio/books-pdfs/book-reader.html',
    '/Content Studio/research-papers/paper-viewer.html',
    
    // Data files
    '/Content Studio/written-posts/posts.json',
    '/Content Studio/video-content/videos.json',
    '/Content Studio/educational-videos/courses.json',
    '/Content Studio/books-pdfs/books.json',
    '/Content Studio/research-papers/papers.json',
    
    // External libraries (CDN)
    'https://cdn.jsdelivr.net/npm/marked@11.1.1/marked.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js'
];

// Cache strategies
const CACHE_STRATEGIES = {
    // Static assets: Cache first, fallback to network
    static: ['.css', '.js', '.woff', '.woff2', '.ttf', '.eot'],
    
    // Images: Cache first, update in background
    images: ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp', '.ico'],
    
    // HTML pages: Network first, fallback to cache
    pages: ['.html'],
    
    // Data files: Network first, cache as backup
    data: ['.json', '.md'],
    
    // Videos: Network only (too large to cache)
    videos: ['.mp4', '.webm', '.ogg']
};

// ==================== INSTALL EVENT ====================

self.addEventListener('install', event => {
    console.log(`[Service Worker] Installing version ${CACHE_VERSION}`);
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('[Service Worker] Precaching static assets');
                return cache.addAll(PRECACHE_URLS);
            })
            .then(() => {
                console.log('[Service Worker] Installation complete');
                return self.skipWaiting(); // Activate immediately
            })
            .catch(error => {
                console.error('[Service Worker] Precaching failed:', error);
            })
    );
});

// ==================== ACTIVATE EVENT ====================

self.addEventListener('activate', event => {
    console.log(`[Service Worker] Activating version ${CACHE_VERSION}`);
    
    event.waitUntil(
        // Clean up old caches
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== CACHE_NAME) {
                            console.log('[Service Worker] Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('[Service Worker] Activation complete');
                return self.clients.claim(); // Take control immediately
            })
    );
});

// ==================== FETCH EVENT ====================

self.addEventListener('fetch', event => {
    const request = event.request;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // Skip cross-origin requests (except CDN libraries)
    if (url.origin !== location.origin && !isCDNResource(url)) {
        return;
    }
    
    // Determine caching strategy
    const strategy = getCacheStrategy(url.pathname);
    
    event.respondWith(
        handleFetch(request, strategy)
    );
});

// ==================== CACHING STRATEGIES ====================

async function handleFetch(request, strategy) {
    const cache = await caches.open(CACHE_NAME);
    
    switch (strategy) {
        case 'cache-first':
            return cacheFirst(request, cache);
        
        case 'network-first':
            return networkFirst(request, cache);
        
        case 'network-only':
            return fetch(request);
        
        case 'cache-only':
            return cacheOnly(request, cache);
        
        default:
            return networkFirst(request, cache);
    }
}

// Cache First Strategy (for static assets)
async function cacheFirst(request, cache) {
    const cached = await cache.match(request);
    
    if (cached) {
        console.log('[Cache First] Serving from cache:', request.url);
        
        // Update cache in background
        fetch(request).then(response => {
            if (response && response.status === 200) {
                cache.put(request, response.clone());
            }
        }).catch(() => {}); // Ignore network errors
        
        return cached;
    }
    
    // Not in cache, fetch from network
    try {
        const response = await fetch(request);
        
        if (response && response.status === 200) {
            cache.put(request, response.clone());
        }
        
        return response;
    } catch (error) {
        console.error('[Cache First] Network failed:', error);
        return getOfflinePage();
    }
}

// Network First Strategy (for HTML pages and data)
async function networkFirst(request, cache) {
    try {
        const response = await fetch(request);
        
        if (response && response.status === 200) {
            console.log('[Network First] Updating cache:', request.url);
            cache.put(request, response.clone());
        }
        
        return response;
    } catch (error) {
        console.log('[Network First] Network failed, serving from cache:', request.url);
        const cached = await cache.match(request);
        
        if (cached) {
            return cached;
        }
        
        return getOfflinePage();
    }
}

// Cache Only Strategy
async function cacheOnly(request, cache) {
    const cached = await cache.match(request);
    
    if (cached) {
        return cached;
    }
    
    return new Response('Not found in cache', { status: 404 });
}

// ==================== HELPER FUNCTIONS ====================

function getCacheStrategy(pathname) {
    // Check file extension
    const ext = pathname.split('.').pop().toLowerCase();
    
    // Static assets: cache first
    if (CACHE_STRATEGIES.static.includes(`.${ext}`)) {
        return 'cache-first';
    }
    
    // Images: cache first
    if (CACHE_STRATEGIES.images.includes(`.${ext}`)) {
        return 'cache-first';
    }
    
    // HTML pages: network first
    if (CACHE_STRATEGIES.pages.includes(`.${ext}`) || pathname.endsWith('/')) {
        return 'network-first';
    }
    
    // Data files: network first
    if (CACHE_STRATEGIES.data.includes(`.${ext}`)) {
        return 'network-first';
    }
    
    // Videos: network only (don't cache)
    if (CACHE_STRATEGIES.videos.includes(`.${ext}`)) {
        return 'network-only';
    }
    
    // Default: network first
    return 'network-first';
}

function isCDNResource(url) {
    const cdnDomains = [
        'cdn.jsdelivr.net',
        'cdnjs.cloudflare.com',
        'unpkg.com',
        'fonts.googleapis.com',
        'fonts.gstatic.com'
    ];
    
    return cdnDomains.some(domain => url.hostname.includes(domain));
}

function getOfflinePage() {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Offline - A3KM Studio</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            padding: 20px;
        }
        .container {
            text-align: center;
            max-width: 500px;
        }
        .icon {
            font-size: 80px;
            margin-bottom: 20px;
            animation: pulse 2s infinite;
        }
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }
        h1 {
            font-size: 32px;
            margin-bottom: 10px;
            color: #CC0000;
        }
        p {
            font-size: 18px;
            color: #ccc;
            margin-bottom: 30px;
        }
        .btn {
            background: #8B0000;
            color: #fff;
            padding: 12px 30px;
            border: none;
            border-radius: 5px;
            font-size: 16px;
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
            transition: background 0.3s;
        }
        .btn:hover {
            background: #990000;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="icon">📡</div>
        <h1>You're Offline</h1>
        <p>No internet connection. Please check your network and try again.</p>
        <button class="btn" onclick="location.reload()">Retry</button>
    </div>
</body>
</html>`;
    
    return new Response(html, {
        status: 503,
        statusText: 'Service Unavailable',
        headers: new Headers({
            'Content-Type': 'text/html'
        })
    });
}

// ==================== MESSAGE HANDLING ====================

self.addEventListener('message', event => {
    const { type, data } = event.data;
    
    switch (type) {
        case 'SKIP_WAITING':
            self.skipWaiting();
            break;
        
        case 'CLEAR_CACHE':
            clearAllCaches();
            break;
        
        case 'CACHE_URL':
            cacheSpecificUrl(data.url);
            break;
        
        case 'GET_CACHE_SIZE':
            getCacheSize().then(size => {
                event.ports[0].postMessage({ size });
            });
            break;
    }
});

async function clearAllCaches() {
    const cacheNames = await caches.keys();
    await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
    );
    console.log('[Service Worker] All caches cleared');
}

async function cacheSpecificUrl(url) {
    const cache = await caches.open(CACHE_NAME);
    try {
        const response = await fetch(url);
        await cache.put(url, response);
        console.log('[Service Worker] Cached URL:', url);
    } catch (error) {
        console.error('[Service Worker] Failed to cache URL:', url, error);
    }
}

async function getCacheSize() {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
        const estimate = await navigator.storage.estimate();
        return {
            usage: estimate.usage,
            quota: estimate.quota,
            percentage: ((estimate.usage / estimate.quota) * 100).toFixed(2)
        };
    }
    return null;
}

// ==================== SYNC EVENT (Background Sync) ====================

self.addEventListener('sync', event => {
    console.log('[Service Worker] Background sync:', event.tag);
    
    if (event.tag === 'sync-analytics') {
        event.waitUntil(syncAnalytics());
    }
});

async function syncAnalytics() {
    // Placeholder for analytics sync logic
    console.log('[Service Worker] Syncing analytics data');
}

// ==================== PUSH NOTIFICATION ====================

self.addEventListener('push', event => {
    const data = event.data ? event.data.json() : {};
    
    const options = {
        body: data.body || 'New content available!',
        icon: '/images/icon-192.png',
        badge: '/images/badge-72.png',
        data: {
            url: data.url || '/Content Studio/hub.html'
        }
    };
    
    event.waitUntil(
        self.registration.showNotification(data.title || 'A3KM Studio', options)
    );
});

self.addEventListener('notificationclick', event => {
    event.notification.close();
    
    event.waitUntil(
        clients.openWindow(event.notification.data.url)
    );
});

console.log('[Service Worker] Loaded successfully');
