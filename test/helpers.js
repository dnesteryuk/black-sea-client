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
   * There is a service worker (test/support/sirko_sw.js) which is used
   * to stub requests to the engine. So, it is necessary to have a away
   * to communicate to the stub. This method opens a message channel to
   * the service worker, thus, some data can be requested (for instance,
   * the latest request made to the engine) or set (for example, a response
   * which should be returned from the engine). Before sending a message,
   * make sure the service worker handles it.
   */
  sendMsgToSWStub: function(msg, serviceWorker) {
    return new Promise((resolve, reject) => {
      let msgChannel = new MessageChannel();

      // handler for receiving a message reply from the service worker
      msgChannel.port1.onmessage = (event) => {
        resolve(event.data);
      };

      // send a message to the service worker along with the port for reply
      serviceWorker.postMessage(
        msg,
        [msgChannel.port2]
      );
    });
  }
};

export default Helpers;
