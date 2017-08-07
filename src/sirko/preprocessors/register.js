/**
 * Registers a service worker to prefetch a predicted page.
 */
const Register = {
  process: function(reqInfo) {
    if ('serviceWorker' in navigator) {
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

export default Register;
