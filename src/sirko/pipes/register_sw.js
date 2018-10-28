/**
 * Registers a service worker which is a part of the solution.
 * Check it src/sirko_sw.js
 */
const RegisterSW = {
  call: async function(data) {
    navigator.serviceWorker.register('/sirko_sw.js');

    // wait for activation, so the client can communicate with the service worker
    let registration = await navigator.serviceWorker.ready;
    data.serviceWorker = registration.active;

    return data;
  }
};

export default RegisterSW;
