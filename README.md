# Sirko Client

[![Build Status](https://travis-ci.org/dnesteryuk/sirko-client.svg?branch=master)](https://travis-ci.org/dnesteryuk/sirko-client)

It is a JavaScript client for the [Sirko Engine](https://github.com/dnesteryuk/sirko-engine). This client tracks information about navigation of users on a site and gets prediction from the engine in order to prerender the next page which most likely will be visited by the current user.

A full description of the prerendering idea can be found in [this article](http://nesteryuk.info/2016/09/27/prerendering-pages-in-browsers.html).

[Try demo](http://demo.sirko.io)

## Usage

There are 2 options to get the client in a project. Both options asynchronously load the client and makes a request to the engine once the script has loaded.

First of all, add the following code before `</head>`:

```html
<script>
  window.sirko=window.sirko||{};
  sirko.s={engineUrl: 'http://__URL_TO_ENGINE__'}; // replace with a real url
</script>
```

### Option 1

The engine gets shipped with the client. You can easily request the client from the engine. To do that, add the following code before `</head>`:

```html
<script async src="http://__URL_TO_ENGINE__/assets/client.js"></script>
```

### Option 2

The client is released as a npm package.

1. Add the client to your `package.json` file:

    ```json
    "dependencies": {
      "sirko": "https://github.com/dnesteryuk/sirko-client.git"
    }
    ```

2. Add the following code before `</head>`:

    ```html
    <script async src="node_modules/sirko/dist/sirko.js"></script>
    ```

    **Note:** You may need to change the src attribute if the node_modules folder isn't a public directory.

If the [Asset pipeline](http://guides.rubyonrails.org/asset_pipeline.html) or a similar technology is in use, the client can be included to a bundle:

```
//= require sirko/dist/sirko
```

In this case, the second step should be omitted. But, please, be aware that the prediction will only be requested after loading the whole bundle. The asynchronous load is a preferable way to load the client.

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
$ NODE_ENV=prod webpack
```

It builds the `dist/sirko.js` script which should be included into the site.

## License

The library is distributed under the [GPLv3 license](https://github.com/dnesteryuk/sirko-client/blob/master/LICENSE.txt).
