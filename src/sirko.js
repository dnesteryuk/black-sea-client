import Client from './sirko/client';

let sirko = window.sirko;

// This lib heavily uses a service worker (https://developers.google.com/web/fundamentals/primers/service-workers/),
// so if a browser doesn't support service workers, there is no reason to continue.
// Make a request to the engine once the script gets loaded
if (('serviceWorker' in navigator) && sirko) {
  let reqInfo = {
    agent:       window.navigator.userAgent,
    referrer:    document.referrer,
    currentUrl:  window.location.href,
    origin:      window.location.origin
  };

  let clientObj = {};

  // fill settings from the queue
  sirko.q.forEach((args) => {
    let field = args[0], val = args[1];
    clientObj[field] = val;
  });

  // replace the original function with the function which
  // takes care of storing settings after loading the lib
  window.sirko = function(name, val) {
    // the user asks for prediction when the prediction
    // has been already made
    if (clientObj.prediction && name === 'predicted') {
      // call the user's callback
      val.apply(this, clientObj.prediction);
    }
    else {
      clientObj[name] = val;
    }
  };

  Client.predict(reqInfo, clientObj)
    .then((res) => {
      // don't crash the promise because of a mistake
      // in the user's code
      try {
        let callback = clientObj.predicted;

        // the user's callback is here
        if (callback) callback.apply(callback, res);

        // keep the result in the client object,
        // maybe a user's callback appears later
        clientObj.prediction = res;
      }
      catch(error) {
        console.error(error);
      }
    })
    .catch(() => {
      // this thing isn't documented, should it be?
      // now it is only required for the demo site
      let callback = clientObj.rejected;
      if (callback) callback.apply(callback);
    });
}
