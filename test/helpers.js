let userAgent = window.navigator.userAgent;

/**
 * It is kind of a set of helpers for tests.
 */
const Helpers = {
  /**
   * It isn't the best way to detect a browser,
   * but it should work fine for developers.
   */
  isChrome: function() {
    return /Chrome/.test(userAgent)
  },

  isFirefox: function() {
    return /Firefox/.test(userAgent)
  },

  /**
   * Removes all link tags related to the given relationship.
   */
  removeHints: function(rel) {
    document.querySelectorAll(`link[rel="${rel}"]`).forEach(
      (link) => { link.parentNode.removeChild(link) }
    );
  },

  /**
   * Registers a service worker (test/support/sirko_sw.js) which is
   * used in stubbing HTTP requests.
   */
  registerHttpStubs: async function() {
    navigator.serviceWorker.register('/sirko_sw.js');

    // wait for activation, so the client can communicate with the service worker
    this.swHttpStubsRegistration = await navigator.serviceWorker.ready;
    this.swHttpStubs = this.swHttpStubsRegistration.active;
  },

  /**
   * Unregisters the service worker stubbing HTTP requests.
   */
  unregisterHttpStubs: async function() {
    await this.swHttpStubsRegistration.unregister();
    this.swHttpStubsRegistration = null;
  },

  /**
   * Adds a new HTTP stub to the service worker stubbing HTTP requests.
   *
   * @param {string} method    - The method in uppercase.
   * @param {RegExp} url
   * @param {object} response  - The object to be returned as a JSON response.
   *
   * @example
   *
   * helpers.stubRequest('POST', /\/predict/, {prediction: {...}});
   */
  stubRequest: function(method, url, response) {
    return this.sendMsgToSwHttpStubs({
      command: 'stubRequest',
      details: {
        method:   method,
        url:      url,
        response: response
      }
    }, this.swHttpStubs);
  },

  /**
   * Returns the latest request which has matched a stubbed HTTP request.
   */
  latestRequest: function() {
    return this.sendMsgToSwHttpStubs({command: 'latestRequest'});
  },

  /**
   * There is a service worker stubbing HTTP requests. So, it is necessary to
   * have a way to communicate to it. This method opens a message channel
   * to the service worker, thus, communication from tests is possible.
   * Before sending a message, make sure the service worker handles it.
   *
   * @param {*} msg
   */
  sendMsgToSwHttpStubs: function(msg) {
    return new Promise((resolve, reject) => {
      var swChannel = new MessageChannel();

      // handler for receiving a message reply from the service worker
      swChannel.port1.onmessage = (event) => {
        resolve(event.data);
      };

      // send a message to the service worker along with the port for reply
      this.swHttpStubs.postMessage(
        msg,
        [swChannel.port2]
      );
    });
  }
};

export default Helpers;
