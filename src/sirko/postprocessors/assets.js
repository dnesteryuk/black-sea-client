import Page from '../page';

/**
 * Adds the prefetch hints in order to prefetch assets for the predicted page.
 * If some of assets are loaded for the current page, the prefetch hints won't be
 * added for them since they are already in the browser's cache.
 */
 const Assets = {
  process: function(resp, reqInfo) {
    if (resp.assets) {
      resp.assets.forEach((url) => {
        if (reqInfo.assets.indexOf(url) > -1) return;

        Page.appendLink('prefetch', url);
      });
    }

    return resp;
  }
};

export default Assets;
