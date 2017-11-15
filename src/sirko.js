import Client from './sirko/client';

let sirko = window.sirko;

// The lib depends on promises (https://developer.mozilla.org/uk/docs/Web/JavaScript/Reference/Global_Objects/Promise).
// There are old browsers (for instance, IE11) which don't natively support promises.
// So, if a browser doesn't support promises, the lib interrupts execution.
// We don't apply a polyfill, because browsers which don't support promises
// don't support service worker neither.
// Make a request to the engine once the script gets loaded
if (typeof Promise !== 'undefined' && sirko) {
  let reqInfo = {
    agent:       window.navigator.userAgent,
    referrer:    document.referrer,
    currentPath: window.location.href,
    domain:      document.domain
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

  Client.predict(reqInfo, clientObj).then((res) => {
    // the user's callback is here
    if (clientObj.predicted) {
      clientObj.predicted.apply(clientObj.predicted, res);
    }

    // keep the result in the client object,
    // maybe a user's callback appears later
    clientObj.prediction = res;
  });
}
