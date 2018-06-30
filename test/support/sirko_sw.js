import { predictedList } from './prediction_stub';

// latest request made to the engine
let latestRequest;

self.addEventListener('install', function(event) {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', function(event) {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('message', function(event) {
  let port = event.ports[0];

  if (event.data === 'latestRequest') {
    latestRequest.body.then((body) => {
      latestRequest.body = body;
      port.postMessage(latestRequest);
    });
  }
  else {
    port.postMessage({isStateModified: false});
  }
});

self.addEventListener('fetch', function(event) {
  var req = event.request;

  // kind of a stub for the engine
  if (req.method === 'POST' && /sirko\.io\/predict/.test(req.url)) {
    latestRequest = {
      method: req.method,
      url:    req.url,
      body:   req.json() // a promise object
    };

    event.respondWith(new Response(JSON.stringify(predictedList)));
  }
});
