/**
 * Fetches the predicted page and stores the response in the cache.
 * Once the current user navigates to the predicted page, the page
 * will be served from the cache. This mechanism is applied as a fallback
 * to browsers which don't support the prerender resource hint.
 */
const Fallback = {
  process: function(info) {
    if (info.nextPath && info.hint === 'fallback' && ('serviceWorker' in navigator)) {
      caches.open('sirko-pages')
        .then(function(cache) {
          // requests the cache to fetch and store the predicted page
          // see more there https://developer.mozilla.org/en-US/docs/Web/API/Cache/add
          cache.add(info.nextPath);
        });
    }

    return info;
  }
};

export default Fallback;
