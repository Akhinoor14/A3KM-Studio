/* A3KM Studio Service Worker - Enhanced Offline Support with Runtime Caching */
const VERSION = 'v3.1.0-enhanced-2026-02-15';
const CACHE_PREFIX = 'a3km-studio';
const STATIC_CACHE = `${CACHE_PREFIX}-static-${VERSION}`;
const HTML_CACHE = `${CACHE_PREFIX}-html-${VERSION}`;
const RUNTIME_CACHE = `${CACHE_PREFIX}-runtime-${VERSION}`;
const OFFLINE_CACHE = `${CACHE_PREFIX}-offline-${VERSION}`;
const IMAGE_CACHE = `${CACHE_PREFIX}-images-${VERSION}`;

// Maximum cache sizes (LRU eviction)
const MAX_HTML_CACHE = 100; // Maximum 100 HTML pages
const MAX_RUNTIME_CACHE = 200; // Maximum 200 runtime assets
const MAX_IMAGE_CACHE = 150; // Maximum 150 images

// Core assets to precache (adjust as needed)
const CORE_ASSETS = [
  '/Home/index.html',
  '/Optimization/styles.css',
  '/images/favicon.svg',
  '/images/logo.svg',
  '/Optimization/manifest.json',
  '/Optimization/offline-content-manager.js',
  '/Optimization/pwa-install-prompt.js',
  '/Optimization/update-notifier.js',
  '/version.json'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(CORE_ASSETS.map(normalizeUrl)))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys
        .filter((key) => key.startsWith(CACHE_PREFIX) && ![STATIC_CACHE, HTML_CACHE, RUNTIME_CACHE, OFFLINE_CACHE, IMAGE_CACHE].includes(key))
        .map((key) => {
          console.log('[SW] Deleting old cache:', key);
          return caches.delete(key);
        })
    )).then(() => {
      console.log('[SW] Service worker activated');
      return self.clients.claim();
    })
  );
});

// Enhanced fetch strategy with comprehensive runtime caching
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Only handle same-origin GET requests
  if (req.method !== 'GET' || url.origin !== self.location.origin) {
    return;
  }

  // Determine request type
  const accept = req.headers.get('accept') || '';
  const isHTML = accept.includes('text/html') || req.mode === 'navigate';
  const isImage = req.destination === 'image' || /\.(jpg|jpeg|png|gif|svg|webp|ico)$/i.test(url.pathname);
  const isFont = req.destination === 'font' || /\.(woff|woff2|ttf|eot)$/i.test(url.pathname);
  const isStyle = req.destination === 'style' || url.pathname.endsWith('.css');
  const isScript = req.destination === 'script' || url.pathname.endsWith('.js');
  const isDocument = url.pathname.endsWith('.md') || url.pathname.endsWith('.pdf') || url.pathname.endsWith('.json');

  // Route to appropriate strategy
  if (isHTML) {
    event.respondWith(handleHTML(req));
  } else if (isImage) {
    event.respondWith(handleImage(req));
  } else if (isFont || isStyle || isScript) {
    event.respondWith(handleAsset(req));
  } else if (isDocument) {
    event.respondWith(handleDocument(req));
  } else {
    event.respondWith(handleRuntime(req));
  }
});

/**
 * HTML pages: Network-first (always fresh), then cache, with runtime caching
 */
async function handleHTML(request) {
  try {
    const fresh = await fetch(request);
    if (fresh.ok) {
      const cache = await caches.open(HTML_CACHE);
      await cache.put(request, fresh.clone());
      await trimCache(HTML_CACHE, MAX_HTML_CACHE);
    }
    return fresh;
  } catch (err) {
    // Network failed, try cache
    const cache = await caches.open(HTML_CACHE);
    const cached = await cache.match(request);
    if (cached) return cached;
    
    // Try offline cache
    const offlineCache = await caches.open(OFFLINE_CACHE);
    const offlineCached = await offlineCache.match(request);
    if (offlineCached) return offlineCached;
    
    // Fallback to home
    return caches.match('/Home/index.html') || caches.match('/index.html');
  }
}

/**
 * Images: Cache-first (performance), then network, with LRU eviction
 */
async function handleImage(request) {
  const cache = await caches.open(IMAGE_CACHE);
  const cached = await cache.match(request);
  if (cached) return cached;

  try {
    const fresh = await fetch(request);
    if (fresh.ok) {
      await cache.put(request, fresh.clone());
      await trimCache(IMAGE_CACHE, MAX_IMAGE_CACHE);
    }
    return fresh;
  } catch (err) {
    // Return placeholder SVG for offline images
    return new Response(
      '<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#1a1a1a"/><text x="50%" y="50%" font-family="Arial" font-size="18" fill="#8B0000" text-anchor="middle" dy=".3em">Image Offline</text></svg>',
      { headers: { 'Content-Type': 'image/svg+xml' } }
    );
  }
}

/**
 * Assets (CSS, JS, Fonts): Cache-first (immutable), then network
 */
async function handleAsset(request) {
  const cache = await caches.open(STATIC_CACHE);
  const cached = await cache.match(request);
  if (cached) return cached;

  try {
    const fresh = await fetch(request);
    if (fresh.ok) {
      await cache.put(request, fresh.clone());
    }
    return fresh;
  } catch (err) {
    // Return empty response for offline assets
    return new Response('', { status: 503, statusText: 'Service Unavailable' });
  }
}

/**
 * Documents (JSON, MD, PDF): Network-first, then cache
 */
async function handleDocument(request) {
  try {
    const fresh = await fetch(request);
    if (fresh.ok) {
      const cache = await caches.open(RUNTIME_CACHE);
      await cache.put(request, fresh.clone());
      await trimCache(RUNTIME_CACHE, MAX_RUNTIME_CACHE);
    }
    return fresh;
  } catch (err) {
    const cache = await caches.open(RUNTIME_CACHE);
    const cached = await cache.match(request);
    if (cached) return cached;
    
    const offlineCache = await caches.open(OFFLINE_CACHE);
    const offlineCached = await offlineCache.match(request);
    return offlineCached || new Response('Document not available offline', { status: 503 });
  }
}

/**
 * Runtime resources: Cache-first, then network
 */
async function handleRuntime(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  const cached = await cache.match(request);
  if (cached) return cached;

  try {
    const fresh = await fetch(request);
    if (fresh.ok) {
      await cache.put(request, fresh.clone());
      await trimCache(RUNTIME_CACHE, MAX_RUNTIME_CACHE);
    }
    return fresh;
  } catch (err) {
    return new Response('Resource not available offline', { status: 503 });
  }
}

/**
 * Trim cache to max size using LRU (Least Recently Used) eviction
 */
async function trimCache(cacheName, maxItems) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length > maxItems) {
    const toDelete = keys.length - maxItems;
    for (let i = 0; i < toDelete; i++) {
      await cache.delete(keys[i]);
    }
    console.log(`[SW] Trimmed ${cacheName}: removed ${toDelete} items`);
  }
}

function normalizeUrl(path) {
  // Ensure paths without domain work when SW scope is at site root
  try {
    const url = new URL(path, self.location.origin);
    return url.pathname + url.search;
  } catch {
    return path;
  }
}

// ============================================================================
// OFFLINE CONTENT MANAGER SUPPORT
// ============================================================================

// Message handler for offline content caching
self.addEventListener('message', async (event) => {
  if (event.data && event.data.type === 'CACHE_OFFLINE_CONTENT') {
    console.log('[SW] Starting offline content download');
    const files = event.data.files || [];
    await cacheOfflineContent(files, event.source);
  }
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    const keys = await caches.keys();
    await Promise.all(keys.map(key => caches.delete(key)));
    console.log('[SW] All caches cleared');
  }
});

/**
 * Cache all offline content files
 */
async function cacheOfflineContent(files, client) {
  const cache = await caches.open(OFFLINE_CACHE);
  const total = files.length;
  let cached = 0;
  let failed = 0;
  
  // Filter out external URLs (YouTube, CDN, etc.)
  const externalPatterns = [
    /youtube\.com/,
    /youtu\.be/,
    /ytimg\.com/,
    /googleapis\.com/,
    /gstatic\.com/,
    /unpkg\.com/,
    /cdnjs\.cloudflare\.com/,
    /fonts\.googleapis\.com/
  ];
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    
    try {
      // Skip external content
      if (externalPatterns.some(pattern => pattern.test(file))) {
        console.log(`[SW] Skipping external: ${file}`);
        continue;
      }
      
      // Normalize URL
      const normalizedUrl = normalizeUrl(file);
      
      // Fetch and cache
      const response = await fetch(normalizedUrl, { credentials: 'same-origin' });
      
      if (response.ok) {
        await cache.put(normalizedUrl, response);
        cached++;
        console.log(`[SW] Cached: ${normalizedUrl} (${cached}/${total})`);
      } else {
        console.warn(`[SW] Failed to cache ${normalizedUrl}: ${response.status}`);
        failed++;
      }
      
    } catch (error) {
      console.error(`[SW] Error caching ${file}:`, error);
      failed++;
    }
    
    // Send progress update to client
    if (client && i % 10 === 0) { // Send update every 10 files
      client.postMessage({
        type: 'CACHE_PROGRESS',
        current: cached,
        total: total,
        failed: failed
      });
    }
  }
  
  // Send final update
  if (client) {
    client.postMessage({
      type: 'CACHE_COMPLETE',
      cached: cached,
      total: total,
      failed: failed
    });
  }
  
  console.log(`[SW] Offline content cached: ${cached}/${total} (${failed} failed)`);
}

console.log('[SW] Enhanced Service Worker loaded with offline support');