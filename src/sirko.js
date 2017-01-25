import Client from './sirko/client';

let sirko = window.sirko;

// Makes a request to the engine once the script gets loaded.
if (sirko) {
  let requestInfo = {
    agent:      window.navigator.userAgent,
    referrer:   document.referrer,
    currentUrl: window.location
  };

  Client.predict(sirko.s.engineUrl, requestInfo);
}
