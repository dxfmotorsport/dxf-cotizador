self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k))))
    .then(() => self.clients.claim())
  );
});
// Sin caché - siempre desde la red
self.addEventListener('fetch', e => {
  e.respondWith(fetch(e.request.url + (e.request.url.includes('?') ? '&' : '?') + '_sw=' + Date.now()).catch(() => fetch(e.request)));
});
