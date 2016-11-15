# Sirko Client

It is a JavaScript client for [Sirko Engine](https://github.com/dnesteryuk/sirko-engine). This client tracks information about navigation of users on a site and gets prediction from the engine in order to prerender the next page which most likely will be visited by the current user.

A full description of the prerendering idea can be found in [this article](http://nesteryuk.info/2016/09/27/prerendering-pages-in-browsers.html).

## Development

  - [Webpack](http://webpack.github.io/docs/) is used for bundling scripts.
  - [Mocha framework](https://mochajs.org/) is used as a JavaScript test framework since it plays nicely with [Webpack](http://webpack.github.io/docs/testing.html). All tests use a [default assertion](https://nodejs.org/api/assert.html) library supplied by Node.js.
  - [Babeljs](https://babeljs.io/) is used to benefit from the ES2015 JavaScript syntax.

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

Executing of tests is achieved via the [webpack development server](http://webpack.github.io/docs/webpack-dev-server.html) which gets launched by:

```
$ npm test
```

now tests can be executed in a browser by opening [http://localhost:8080/test](http://localhost:8080/test).

### Production build

```
$ NODE_ENV=production webpack
```
