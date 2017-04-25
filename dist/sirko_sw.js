self.addEventListener('install', function(event) {
  /**
   * activate once the worker gets installed,
   * kick out any previous version of the worker
   */
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', function(event) {
  // take immediate control over pages
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', function(event) {
  var request = event.request;

  var prom = caches.match(
    request, { cacheName: 'sirko-pages' }
  ).then(function(cachedResp) {
    if (cachedResp) return cachedResp;

    return fetch(request);
  });

  event.respondWith(prom);
});
