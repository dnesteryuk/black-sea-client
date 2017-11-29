import Traffic from './sirko/traffic';

/**
 * This service worker holds 2 responsibilities:
 *   - serve a prefetched page from a cache
 *   - keep an eye on requests made on pages
 *
 * The last one helps in spotting requests modifying data. If data gets changed,
 * a prefetched page might become stale. So, it isn't safe to serve it
 * anymore.
 *
 * It records all requests happening on all pages. Once a page is loaded
 * the client (sirko/pipes/verify_state.js) sends a message to
 * the worker in order to verify whether there was a request modifying data.
 * If so, the client make steps to not track the transition. It is only
 * interested in requests happened between the referrer and the current page.
 * After replying to the message, the worker cleans the recorded requests,
 * thus, the memory consumption stays low. Since the instance of the worker
 * works on all pages at the same time, there might be intersections.
 * For example:
 *
 *   GET /index
 *   POST /post
 *   GET /posts
 *   GET /project
 *
 * Let's say the index page is a referrer and the project page is a current page.
 * Using the logic described above, we can say there was a request modifying data.
 * But, it might not be true. There is a chance that the user used 2 pages at the same
 * time, thus, they made an action on one page, then they made an action on another
 * page without waiting for completion of the first action.
 *
 * This situation is fine, the worker will tell that there was a request modifying
 * data, so the transition won't be tracked. There is no problem with that, because
 * it is a rare case, most users won't do that. Anyway, there is no easy
 * solution to understand where requests come from, they just come to the worker.
 */
self.addEventListener('install', function(event) {
  // activate once the worker gets installed,
  // kick out any previous version of the worker
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', function(event) {
  // take immediate control over pages
  event.waitUntil(self.clients.claim());
});

self.addEventListener('message', function(event) {
  let data = event.data;

  // checks whether there were requests modifying data
  let isStateModified = Traffic.modifiedState(
    data.referrer,
    data.currentUrl,
    data.domain,

    // the engine's url must be in the whitelist, otherwise,
    // all transitions will be treated as transitions with modified data
    [data.engineUrl]
  );

  // remove previously recorded requests but the current page,
  // it will become a referrer once the user navigates to another page.
  Traffic.removeAllBefore(data.currentUrl);

  // replies to a client's message
  event.ports[0].postMessage({
    isStateModified: isStateModified
  });
});

self.addEventListener('fetch', function(event) {
  var request = event.request;

  Traffic.add({
    method: request.method,
    url:    request.url
  });

  // allow a browser do its job
  if (request.method !== 'GET') return;

  var prom = caches.match(
    request, { cacheName: 'sirko-pages' }
  ).then(function(cachedResp) {
    if (cachedResp) return cachedResp;

    return fetch(request);
  });

  event.respondWith(prom);
});
