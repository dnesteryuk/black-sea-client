# Sirko Client

[![Build Status](https://travis-ci.org/sirko-io/client.svg?branch=master)](https://travis-ci.org/sirko-io/client)

It is a JavaScript client for the [Sirko Engine](https://github.com/sirko-io/engine). This client tracks information about navigation of users on a site and gets prediction from the engine in order to improve performance of the site by prefetching resources which are required for a next page.

[Try demo](https://demo.sirko.io)

## Development

### Major dependencies

  - [Rollup](https://rollupjs.org/) creates a bundle which should be included into the site.
  - [Rollup Bubel](https://gitlab.com/Rich-Harris/rollup-plugin-buble) compiles ES2015 with Rollup.
  - [Karma runner](http://karma-runner.github.io/) launches tests in different browsers to prove that the client works fine.
  - [Mocha framework](https://mochajs.org/) is a JavaScript test framework.
  - [Chai](http://chaijs.com/) is an assertion lib for tests.

### Setup

Install dependencies:

```
$ npm install
```

### Start

```
$ npm start
```

This command launches Rollup in the development mode (all scripts get recompiled once changes are saved).

### Testing

```
$ npm test
```

It will launch the Chrome and Firefox browsers and keep them running to re-launch tests when the code gets changed.

### Production build

```
$ npm run-script build
```

It builds the `dist/sirko.js` script which should be included into the site.

## License

The library is distributed under the [GPLv3 license](https://github.com/sirko-io/client/blob/master/LICENSE.txt).
