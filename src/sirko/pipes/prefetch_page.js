/**
 * Fetches the predicted page and stores the response in the cache.
 * Thus, once the user navigates to the predicted page, the page
 * will be served from the cache.
 *
 * The solution uses a Cache API (https://developer.mozilla.org/en-US/docs/Web/API/Cache/add)
 * to fetch and cache the page. The logic of serving the cached page
 * can be found in the src/sirko_sw.js file.
 */
const Page = {
  call: function(data) {
    let predictedPath = data.prediction.path;

    if (predictedPath) {
      caches.open('sirko-pages')
        .then((cache) => {
          this._fetch(cache, predictedPath);
        });
    }

    return data;
  },

 _fetch: function(cache, url) {
    fetch(url, {credentials: 'include'}).then((response) => {
      if (!response.ok) return;
      return cache.put(url, response);
    });
  }
};

export default Page;
