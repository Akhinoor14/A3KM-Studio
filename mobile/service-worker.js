// ============================================================================
// SERVICE WORKER - Mobile PWA (A3KM Studio)
// Enhanced offline caching with runtime caching and performance optimization
// ============================================================================

const VERSION = 'v3.1.0-enhanced-2026-02-15';
const CACHE_PREFIX = 'a3km-mobile';
const CACHE_NAME = `${CACHE_PREFIX}-${VERSION}`;
const RUNTIME_CACHE = `${CACHE_PREFIX}-runtime-${VERSION}`;
const OFFLINE_CACHE = `${CACHE_PREFIX}-offline-${VERSION}`;
const IMAGE_CACHE = `${CACHE_PREFIX}-images-${VERSION}`;

// Maximum cache sizes for mobile (conserve storage)
const MAX_HTML_CACHE = 75; // Maximum 75 HTML pages (less than desktop)
const MAX_RUNTIME_CACHE = 150; // Maximum 150 runtime assets
const MAX_IMAGE_CACHE = 100; // Maximum 100 images

// Files to cache immediately on install
const PRECACHE_URLS = [
  '/mobile/home/index.html',
  '/mobile/home/home.css',
  '/mobile/home/home.js',
  '/mobile/about/about.html',
  '/mobile/about/about.css',
  '/mobile/about/about.js',
  '/mobile/projects/projects.html',
  '/mobile/projects/projects.css',
  '/mobile/projects/projects.js',
  '/mobile/contact/contact.html',
  '/mobile/contact/contact.css',
  '/mobile/contact/contact.js',
  '/mobile/content-studio/hub.html',
  '/mobile/content-studio/hub.css',
  '/mobile/content-studio/hub.js',
  '/mobile/shared/mobile-navbar.css',
  '/mobile/shared/mobile-navbar.js',
  '/mobile/shared/mobile-navbar.html',
  '/mobile/shared/mobile-common.css',
  '/mobile/manifest.json'
];

// Install event - cache critical resources
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Precaching resources');
        return cache.addAll(PRECACHE_URLS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  
  const currentCaches = [CACHE_NAME, RUNTIME_CACHE, OFFLINE_CACHE, IMAGE_CACHE];
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              // Keep current version caches
              return !currentCaches.some(current => cacheName.startsWith(current));
            })
            .map((cacheName) => {
              console.log('[Service Worker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => self.clients.claim())
  );
});

// ============================================================================
// Enhanced Fetch Handlers with Content-Type Detection and LRU Cache Management
// ============================================================================

/**
 * Handle HTML requests - Network-first strategy
 * Always try to get fresh content, cache for offline use
 */
async function handleHTML(request) {
  const cache = await caches.open(CACHE_NAME);
  
  try {
    const response = await fetch(request);
    if (response && response.status === 200) {
      await cache.put(request, response.clone());
      await trimCache(CACHE_NAME, MAX_HTML_CACHE);
    }
    return response;
  } catch (error) {
    const cached = await cache.match(request);
    if (cached) return cached;
    
    // Fallback to home page
    const homeFallback = await cache.match('/mobile/home/index.html');
    if (homeFallback) return homeFallback;
    
    throw error;
  }
}

/**
 * Handle image requests - Cache-first strategy for performance
 * Mobile-optimized with conservative cache limits
 */
async function handleImage(request) {
  const cache = await caches.open(IMAGE_CACHE);
  
  const cached = await cache.match(request);
  if (cached) return cached;
  
  try {
    const response = await fetch(request);
    if (response && response.status === 200) {
      await cache.put(request, response.clone());
      await trimCache(IMAGE_CACHE, MAX_IMAGE_CACHE);
    }
    return response;
  } catch (error) {
    // SVG placeholder for offline images
    return new Response(
      '<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">' +
      '<rect width="400" height="300" fill="#0a0a0a"/>' +
      '<text x="200" y="140" font-family="Arial" font-size="16" fill="#8B0000" text-anchor="middle">Image Unavailable</text>' +
      '<text x="200" y="165" font-family="Arial" font-size="12" fill="#666" text-anchor="middle">You are offline</text>' +
      '</svg>',
      { headers: { 'Content-Type': 'image/svg+xml' } }
    );
  }
}

/**
 * Handle static assets (CSS, JS, fonts) - Cache-first
 * These files rarely change and benefit from aggressive caching
 */
async function handleAsset(request) {
  const cache = await caches.open(CACHE_NAME);
  
  const cached = await cache.match(request);
  if (cached) return cached;
  
  try {
    const response = await fetch(request);
    if (response && response.status === 200) {
      await cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    // No fallback for assets
    throw error;
  }
}

/**
 * Handle documents (JSON, MD, PDF) - Network-first
 * Documents should be fresh but cached for offline
 */
async function handleDocument(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  
  try {
    const response = await fetch(request);
    if (response && response.status === 200) {
      await cache.put(request, response.clone());
      await trimCache(RUNTIME_CACHE, MAX_RUNTIME_CACHE);
    }
    return response;
  } catch (error) {
    const cached = await cache.match(request);
    if (cached) return cached;
    throw error;
  }
}

/**
 * Handle runtime requests (fallback) - Cache-first
 */
async function handleRuntime(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  
  const cached = await cache.match(request);
  if (cached) return cached;
  
  try {
    const response = await fetch(request);
    if (response && response.status === 200) {
      await cache.put(request, response.clone());
      await trimCache(RUNTIME_CACHE, MAX_RUNTIME_CACHE);
    }
    return response;
  } catch (error) {
    throw error;
  }
}

/**
 * Trim cache to maximum size using LRU (Least Recently Used) eviction
 * Mobile-optimized with conservative limits
 */
async function trimCache(cacheName, maxItems) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  
  if (keys.length > maxItems) {
    // Delete oldest entries (first in keys array)
    const toDelete = keys.length - maxItems;
    for (let i = 0; i < toDelete; i++) {
      await cache.delete(keys[i]);
    }
    console.log(`[SW] Trimmed ${cacheName}: removed ${toDelete} items`);
  }
}

// Fetch event - intelligent routing based on content type
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return;
  }

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Detect content type and route to appropriate handler
  const acceptHeader = request.headers.get('Accept') || '';
  const pathname = url.pathname.toLowerCase();
  
  const isHTML = acceptHeader.includes('text/html') || pathname.endsWith('.html');
  const isImage = request.destination === 'image' || 
                  /\.(jpg|jpeg|png|gif|webp|svg|ico)$/i.test(pathname);
  const isFont = request.destination === 'font' || 
                 /\.(woff2?|ttf|eot|otf)$/i.test(pathname);
  const isStyle = request.destination === 'style' || pathname.endsWith('.css');
  const isScript = request.destination === 'script' || pathname.endsWith('.js');
  const isDocument = /\.(json|md|pdf)$/i.test(pathname);

  // Route to appropriate handler
  if (isHTML) {
    event.respondWith(handleHTML(request));
  } else if (isImage) {
    event.respondWith(handleImage(request));
  } else if (isFont || isStyle || isScript) {
    event.respondWith(handleAsset(request));
  } else if (isDocument) {
    event.respondWith(handleDocument(request));
  } else {
    event.respondWith(handleRuntime(request));
  }
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('[Service Worker] Background sync:', event.tag);
  
  if (event.tag === 'sync-contact-form') {
    event.waitUntil(syncContactForm());
  }
});

// Push notifications
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'A3KM Studio';
  const options = {
    body: data.body || 'New content available!',
    icon: '/images/icons/icon-192x192.png',
    badge: '/images/icons/icon-96x96.png',
    vibrate: [200, 100, 200],
    data: {
      url: data.url || '/mobile/home/index.html'
    },
    actions: [
      {
        action: 'open',
        title: 'Open'
      },
      {
        action: 'close',
        title: 'Close'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'open' || !event.action) {
    const urlToOpen = event.notification.data.url;
    
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true })
        .then((clientList) => {
          // Check if window is already open
          for (let client of clientList) {
            if (client.url === urlToOpen && 'focus' in client) {
              return client.focus();
            }
          }
          // Open new window
          if (clients.openWindow) {
            return clients.openWindow(urlToOpen);
          }
        })
    );
  }
});

// Message handling for cache updates and offline content
self.addEventListener('message', async (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName))
        );
      })
    );
  }
  
  if (event.data && event.data.type === 'CACHE_OFFLINE_CONTENT') {
    console.log('[SW] Starting offline content download for mobile');
    const files = event.data.files || [];
    await cacheOfflineContent(files, event.source);
  }
});

// Helper function for syncing contact form
async function syncContactForm() {
  try {
    const db = await openDB();
    const pendingForms = await getAllPendingForms(db);
    
    for (const form of pendingForms) {
      try {
        // Attempt to send form
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form.data)
        });
        
        if (response.ok) {
          await deletePendingForm(db, form.id);
        }
      } catch (error) {
        console.error('[Service Worker] Sync failed for form:', form.id);
      }
    }
  } catch (error) {
    console.error('[Service Worker] Background sync error:', error);
  }
}

// IndexedDB helpers (simplified)
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('A3KMStudio', 1);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('pendingForms')) {
        db.createObjectStore('pendingForms', { keyPath: 'id', autoIncrement: true });
      }
    };
  });
}

function getAllPendingForms(db) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['pendingForms'], 'readonly');
    const store = transaction.objectStore('pendingForms');
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function deletePendingForm(db, id) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['pendingForms'], 'readwrite');
    const store = transaction.objectStore('pendingForms');
    const request = store.delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

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
      const url = new URL(file, self.location.origin);
      const normalizedUrl = url.pathname + url.search;
      
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

console.log('[Service Worker] Loaded successfully with offline support');
