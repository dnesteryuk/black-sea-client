/**
 * Asks the service worker whether there was a request modifying data.
 * If so, it cleans the referrer to prevent tracking of the transition.
 * If there is no transition between pages, there is no prediction for the referrer.
 * But, a next page can be predicted and prefetched for the current page anyway.
 */
const VerifyState = {
  call: function(data, conf) {
    let request = data.request;

    return new Promise((resolve, reject) => {
      let msgChannel = new MessageChannel();

        // handler for receiving a message reply from the service worker
        msgChannel.port1.onmessage = (event) => {
          if (event.data.isStateModified) {
            request.referrer = null;
          }

          resolve(data);
        };

        // Send a message to the service worker along with the port for reply
        data.serviceWorker.postMessage(
          {
            referrer:   request.referrer,
            currentUrl: request.currentUrl,
            domain:     request.domain,
            engineUrl:  conf.engineUrl
          },
          [msgChannel.port2]
        );
    });
  }
};

export default VerifyState;
