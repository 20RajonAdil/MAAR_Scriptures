// MAAR Scriptures service worker
// Caches the app shell (HTML/CSS/JS) so the UI works offline, and caches
// scripture API responses opportunistically as the user reads, so pages
// already visited keep working without a connection. It does not pretend
// every passage is available offline — only what was actually fetched.
const SHELL_CACHE = 'maar-shell-v1';
const DATA_CACHE = 'maar-data-v1';
const SHELL_ASSETS = ['/', '/manifest.json'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(SHELL_CACHE).then((c) => c.addAll(SHELL_ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => ![SHELL_CACHE, DATA_CACHE].includes(k)).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

const API_HOSTS = ['api.alquran.cloud', 'bible-api.com', 'www.sefaria.org', 'cdn.islamic.network'];

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  if (API_HOSTS.includes(url.hostname)) {
    // Network-first for scripture data, falling back to cache when offline.
    event.respondWith(
      fetch(event.request)
        .then((res) => {
          const copy = res.clone();
          caches.open(DATA_CACHE).then((c) => c.put(event.request, copy));
          return res;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match('/'))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
