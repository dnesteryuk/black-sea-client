# Sirko Client

[![Build Status](https://travis-ci.org/dnesteryuk/sirko-client.svg?branch=master)](https://travis-ci.org/dnesteryuk/sirko-client)

It is a JavaScript client for [Sirko Engine](https://github.com/dnesteryuk/sirko-engine). This client tracks information about navigation of users on a site and gets prediction from the engine in order to prerender the next page which most likely will be visited by the current user.

A full description of the prerendering idea can be found in [this article](http://nesteryuk.info/2016/09/27/prerendering-pages-in-browsers.html).

## Development

### Major dependencies

  - [Webpack](http://webpack.github.io/docs/) packages the final script which should be included into the site.
  - [Babeljs](https://babeljs.io/) compiles our ES2015 JavaScript code to code supported by current versions of browsers.
  - [Mocha framework](https://mochajs.org/) is used as a JavaScript test framework since it plays nicely with [Webpack](http://webpack.github.io/docs/testing.html). All tests use a [default assertion](https://nodejs.org/api/assert.html) library supplied by Node.js.
  - [Karma runner](http://karma-runner.github.io/) launches tests in different browsers to prove that the client works fine.

### Setup

Install dependencies:

```
$ npm install
```

### Start

```
$ npm start
```

This command launches Webpack in the development mode (all scripts get recompiled once changes are saved).

### Testing

```
$ npm test
```

It will launch the Chrome browser and keep it running to re-launch tests when the code get changed.

### Production build

```
$ NODE_ENV=production webpack
```

It builds the `dist/sirko.js` script which should be included into the site.

## License

The library is distributed under the [GPLv3 license](https://github.com/dnesteryuk/sirko-client/blob/master/LICENSE.txt).
