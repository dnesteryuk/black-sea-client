/**
 * This module is an abstraction over CacheStorage
 * https://developer.mozilla.org/en-US/docs/Web/API/CacheStorage
 *
 * The main goal is to hide complexity while working with CacheStorage.
 *
 * It works with 2 kinds of caches:
 *   - `prefetch` keeps resources which might be required in a next user's
 *     transition. Resources doesn't stay too long here.
 *   - `offline` keeps resources which are served when a user is offline.
 *     Resources might live a while here. It accumulates resources
 *     during the user's navigation. Eventually, there might be lots of cached
 *     resources.
 */

const prefetchKey = 'sirko-prefetch';
const offlineKey = 'sirko-offline';

const Barn = {
  /**
   * Returns a prefetched resource from the prefetch cache, if it isn't
   * there, fetches then returns it. If there is an error in fetching (
   * the module assumes the user is offline), it returns a response from
   * the offline cache.
   */
  get: function(request) {
    return caches.match(request, {cacheName: prefetchKey})
      .then((response) => {
        if (response) return response;
        return fetch(request);
      })
      .catch(() => {
        return caches.match(request, {cacheName: offlineKey});
      });
  },

  /**
   * Shifts all cached resources from the prefetch cache to the offline cache.
   * Thus, cached resources can be served when the user is offline.
   */
  shift: async function() {
    let [prefetchCache, offlineCache] = await Promise.all(
      [caches.open(prefetchKey), caches.open(offlineKey)]
    );

    let keys = await prefetchCache.keys();

    let proms = keys.map(async function(request) {
      let response = await prefetchCache.match(request);
      await offlineCache.put(request, response);
      return prefetchCache.delete(request);
    });

    return Promise.all(proms);
  },

  /**
   * Prefetches pages and assets, thus, they can be served from the cache
   * when the user needs them.
   */
  prefetch: async function(pages, assets) {
    let cache = await caches.open(prefetchKey);

    prefetchPages(cache, pages);
    prefetchAssets(cache, assets);
  },

  /**
   * Removes the prefetch cache.
   */
  cleanPrefetch: function() {
    return caches.delete(prefetchKey);
  }
};

// private methods

function prefetchPages(cache, pages) {
  pages.forEach((page) => {
    cache.add(new Request(
      page.path,
      {credentials: 'include', redirect: 'follow'}
    ));
  });
}

function prefetchAssets(cache, assets) {
  assets.forEach((asset) => { cache.add(asset); });
}

export default Barn;
export { prefetchKey, offlineKey };
