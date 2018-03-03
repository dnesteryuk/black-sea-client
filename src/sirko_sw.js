/**
 * This service worker holds 2 responsibilities:
 *   - serve resources from a cache when it is possible (see the Barn module)
 *   - keep an eye on requests made on pages
 *
 * The last one helps in spotting requests modifying data. If data gets changed,
 * a prefetched page might become stale. So, it isn't safe to serve it
 * anymore.
 *
 * Using the Traffic module, it records all requests happening on all pages.
 * Once a page is loaded the client (sirko/pipes/verify_state.js) sends a message to
 * the worker in order to verify whether there was a request modifying data.
 * If so, the client make steps to not track the transition.
 *
 * After replying to the message, the worker cleans the recorded requests,
 * thus, the memory consumption stays low.
 */

import Traffic from './sirko/traffic';
import Barn from './sirko/barn';

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

  // get the response from the Barn module
  event.respondWith(Barn.get(request));
});
