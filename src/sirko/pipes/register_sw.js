/**
 * Registers a service worker which is a part of the solution.
 * Check it src/sirko_sw.js
 */
const RegisterSW = {
  call: function(data) {
    navigator.serviceWorker.register('/sirko_sw.js');

    // wait for activation, so the client can communicate with the service worker
    return navigator.serviceWorker.ready.then((registration) => {
      data.serviceWorker = registration.active;

      return Promise.resolve(data);
    });
  }
};

export default RegisterSW;
