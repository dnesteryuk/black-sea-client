/**
 * Registers a service worker which is a part of the solution.
 * Check it src/sirko_sw.js
 */
const RegisterSW = {
  call: function(data) {
    // Whenever the user visits a page, we need to clean up all cached pages.
    // Otherwise, we might show a stale page to the user. For example, it happens
    // when the user doesn't go to a predicted page.
    caches.delete('sirko-pages');

    navigator.serviceWorker.register('sirko_sw.js');

    // wait for activation, so the client can communicate with the service worker
    return navigator.serviceWorker.ready.then((registration) => {
      data.serviceWorker = registration.active;

      return Promise.resolve(data);
    });
  }
};

export default RegisterSW;
