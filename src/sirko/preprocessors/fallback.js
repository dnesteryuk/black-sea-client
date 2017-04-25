/**
 * Registers a service worker if the browser doesn't support
 * the prerender hint. The registered service worker provides
 * a fallback solution.
 */
const Fallback = {
  process: function(reqInfo, conf) {
    if (reqInfo.hint === 'fallback' &&
      conf.useFallback &&
      ('serviceWorker' in navigator)) {
      navigator.serviceWorker.register('sirko_sw.js');

      /**
       * Whenever the user visits a page, we need to clean up all cached pages.
       * Otherwise, we might show a stale page to the user. For example, it happens
       * when the user doesn't go to the predicted page.
       */
      caches.delete('sirko-pages');
    }

    return reqInfo;
  }
};

export default Fallback;
