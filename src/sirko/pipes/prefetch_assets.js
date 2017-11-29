import Page from '../page';

/**
 * Adds the prefetch hints in order to prefetch assets for the predicted page.
 * If some of assets are loaded for the current page, the prefetch hints won't be
 * added for them since they are already in the browser's cache.
 */
const PrefetchAssets = {
  call: function(data) {
    let prediction = data.prediction,
        request = data.request;

    if (prediction.assets) {
      prediction.assets.forEach((url) => {
        if (request.assets.indexOf(url) > -1) return;

        Page.appendLink('prefetch', url);
      });
    }

    return data;
  }
};

export default PrefetchAssets;
