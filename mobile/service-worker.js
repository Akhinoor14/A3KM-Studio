// ============================================================================
// SERVICE WORKER - Mobile PWA (A3KM Studio)
// Offline caching and performance optimization
// ============================================================================

const CACHE_NAME = 'a3km-mobile-v1.0.0';
const RUNTIME_CACHE = 'a3km-runtime-v1.0.0';

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
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              return cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE;
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

// Fetch event - serve from cache, fallback to network
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

  // Handle HTML pages - Network First, fallback to Cache
  if (request.headers.get('Accept').includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const responseClone = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => {
            cache.put(request, responseClone);
          });
          return response;
        })
        .catch(() => {
          return caches.match(request)
            .then((cachedResponse) => {
              return cachedResponse || caches.match('/mobile/home/index.html');
            });
        })
    );
    return;
  }

  // Handle CSS, JS, images - Cache First, fallback to Network
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(request)
          .then((response) => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type === 'error') {
              return response;
            }

            const responseClone = response.clone();
            caches.open(RUNTIME_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });

            return response;
          })
          .catch(() => {
            // Return offline fallback for images
            if (request.destination === 'image') {
              return new Response(
                '<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="#0a0a0a"/><text x="50" y="55" font-family="Arial" font-size="14" fill="#CC0000" text-anchor="middle">Offline</text></svg>',
                { headers: { 'Content-Type': 'image/svg+xml' } }
              );
            }
          });
      })
  );
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

// Message handling for cache updates
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
      })
    );
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

console.log('[Service Worker] Loaded successfully');
