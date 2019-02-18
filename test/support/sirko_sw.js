import HttpStubs from './http_stubs';

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

  if (event.data.command) {
    let command = event.data.command,
        details = event.data.details;

    if (command === 'latestRequest') {
      latestRequest.body.then((body) => {
        latestRequest.body = body;
        port.postMessage(latestRequest);
      });
    }

    if (command === 'stubRequest') {
      HttpStubs.register(details);
      // just send something to tell that it is registered
      port.postMessage({done: true});
    }
  }
  else {
    port.postMessage({isStateModified: false});
  }
});

self.addEventListener('fetch', function(event) {
  var req = event.request,
      stub = HttpStubs.find(req.method, req.url);

  if (stub) {
    latestRequest = {
      method: req.method,
      url:    req.url,
      body:   req.json() // a promise object
    };

    event.respondWith(new Response(JSON.stringify(stub.response)));
  }
});
