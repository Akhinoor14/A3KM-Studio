/* A3KM Studio Service Worker - basic offline support */
const VERSION = 'v1.0.0';
const CACHE_PREFIX = 'a3km-studio';
const STATIC_CACHE = `${CACHE_PREFIX}-static-${VERSION}`;
const HTML_CACHE = `${CACHE_PREFIX}-html-${VERSION}`;

// Core assets to precache (adjust as needed)
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/home-mobile.html',
  '/contact-mobile.html',
  '/about-mobile.html',
  '/projects.html',
  '/classwork-mobile.html',
  '/homework-mobile.html',
  '/solo-mobile.html',
  '/styles.css',
  '/home-mobile.css',
  '/contact-mobile-clean.css',
  '/mobile-project-cards-fix.css',
  '/mobile-home-fix.css',
  '/shared/model-viewer.js',
  '/shared/model-viewer.css',
  '/favicon.svg',
  '/manifest.json'
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
        .filter((key) => key.startsWith(CACHE_PREFIX) && ![STATIC_CACHE, HTML_CACHE].includes(key))
        .map((key) => caches.delete(key))
    )).then(() => self.clients.claim())
  );
});

// Strategy: network-first for HTML/navigation; cache-first for others
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Only handle GET
  if (req.method !== 'GET') return;

  // Navigation or HTML requests => network-first
  const accept = req.headers.get('accept') || '';
  const isHTML = accept.includes('text/html');
  if (req.mode === 'navigate' || isHTML) {
    event.respondWith(networkFirst(req));
    return;
  }

  // Static assets => cache-first
  event.respondWith(cacheFirst(req));
});

async function networkFirst(request) {
  try {
    const fresh = await fetch(request);
    const cache = await caches.open(HTML_CACHE);
    cache.put(request, fresh.clone());
    return fresh;
  } catch (err) {
    const cache = await caches.open(HTML_CACHE);
    const cached = await cache.match(request);
    if (cached) return cached;
    // Fallback to home if offline and not cached
    return caches.match('/index.html');
  }
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  const fresh = await fetch(request);
  const cache = await caches.open(STATIC_CACHE);
  cache.put(request, fresh.clone());
  return fresh;
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