const CACHE_NAME = 'raider-signal-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json'
];

// 1. INSTALL: Cache the basics
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

// 2. FETCH: Network First, Fallback to Cache
// This ensures we always try to get the latest roster data.
self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request)
      .catch(() => caches.match(e.request))
  );
});
