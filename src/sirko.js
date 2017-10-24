import Client from './sirko/client';

let sirko = window.sirko;

// Make a request to the engine once the script gets loaded
if (sirko) {
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
