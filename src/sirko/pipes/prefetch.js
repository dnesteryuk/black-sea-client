import Barn from '../barn';

/**
 * Fetches predicted resources then stores responses in the cache.
 * Thus, once the user navigates to the predicted page,
 * the page and its assets will be served from the cache.
 *
 * The logic of serving cached resources can be found
 * in the src/sirko_sw.js file.
 */
const Prefetch = {
  call: function(data) {
    let pages = data.prediction.pages,
      assets = data.prediction.assets;

    if (pages.length) Barn.prefetch(pages, assets);

    return data;
  },
};

export default Prefetch;
