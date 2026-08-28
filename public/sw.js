const CACHE = 'home-service-passbook-v5';
const SHELL = ['/', '/app', '/demo', '/privacy', '/terms', '/manifest.webmanifest', '/favicon.svg', '/assets/hero-640.webp'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then(async (cache) => {
    await Promise.all(SHELL.map(async (path) => {
      const separator = path.includes('?') ? '&' : '?';
      const response = await fetch(`${path}${separator}precache=5`, { cache: 'reload' });
      if (response.ok) await cache.put(path, response);
    }));
    const page = await cache.match('/');
    if (page) {
      const html = await page.text();
      const builtAssets = [...html.matchAll(/["'](\/assets\/[^"']+)["']/g)].map((match) => match[1]);
      await Promise.all([...new Set(builtAssets)].map(async (path) => {
        const response = await fetch(`${path}?precache=5`, { cache: 'reload' });
        if (response.ok) await cache.put(path, response);
      }));
    }
  }).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request).then((response) => {
      const copy = response.clone(); caches.open(CACHE).then((cache) => cache.put(event.request, copy)); return response;
    }).catch(() => caches.match(event.request, { ignoreVary: true }).then((cached) => cached || caches.match('/', { ignoreVary: true }))));
    return;
  }
  event.respondWith(caches.match(event.request, { ignoreVary: true }).then((cached) => cached || fetch(event.request).then((response) => {
    if (response.ok) { const copy = response.clone(); caches.open(CACHE).then((cache) => cache.put(event.request, copy)); }
    return response;
  })));
});
