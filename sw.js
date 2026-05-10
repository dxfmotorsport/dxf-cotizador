const VERSION = '1.0.0';
const CACHE = 'dxf-cache-' + VERSION;
const FILES = ['./index.html', './manifest.json', './apple-touch-icon.png', './icon-192.png', './icon-512.png'];

// Instalar: guarda archivos en caché nueva
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())
  );
});

// Activar: borra cachés viejas y toma control inmediato
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
      .then(() => {
        // Notifica a todos los clientes que hay nueva versión
        self.clients.matchAll().then(clients => {
          clients.forEach(client => client.postMessage({type: 'UPDATE_AVAILABLE'}));
        });
      })
  );
});

// Fetch: network first, caché como fallback
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request)
      .then(res => {
        if (res.ok) {
          caches.open(CACHE).then(c => c.put(e.request, res.clone()));
        }
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
