/**
 * Fetches the predicted page and stores the response in the cache.
 * Once the current user navigates to the predicted page, the page
 * will be served from the cache.
 */
const Page = {
  call: function(data) {
    let predictedPath = data.prediction.path;

    if (predictedPath && ('serviceWorker' in navigator)) {
      caches.open('sirko-pages')
        .then(function(cache) {
          // requests the cache to fetch and store the predicted page
          // see more there https://developer.mozilla.org/en-US/docs/Web/API/Cache/add
          cache.add(predictedPath);
        });
    }

    return data;
  }
};

export default Page;
