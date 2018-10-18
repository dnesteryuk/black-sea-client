const resolve  = require('rollup-plugin-node-resolve'),
      commonjs = require('rollup-plugin-commonjs'),
      buble    = require('rollup-plugin-buble');

let proxies = {
  '/sirko_sw.js': '/base/test/support/sirko_sw.js',
  '/stub.html': '/base/test/support/fixtures/stub.html',
  '/images/logo.png': '/base/test/support/fixtures/stub.png',
  '/images/head.png': '/base/test/support/fixtures/stub.png'
};

// dummy assets required for testing
['main', 'form', 'app'].forEach(function(name) {
  proxies['/js/' + name + '.js'] = '/base/test/support/fixtures/stub.js';
  proxies['/css/' + name + '.css'] = '/base/test/support/fixtures/stub.css';
});

module.exports = function(config) {
  var browsers = ['Chrome', 'Firefox'];

  if (process.env.TRAVIS) {
    browsers = ['Firefox'];
  }

  config.set({
    browsers: browsers,

    frameworks: ['mocha', 'chai'],

    files: [
      { pattern: 'test/*_test.js', watched: false },
      { pattern: 'test/**/*_test.js', watched: false },
      { pattern: 'test/support/**/*', watched: false, included: false, served: true }
    ],

    proxies: proxies,

    preprocessors: {
      'test/*_test.js':           ['rollup'],
      'test/**/*_test.js':        ['rollup'],
      'test/support/sirko_sw.js': ['rollup']
    },

    rollupPreprocessor: {
      format: 'iife',
      name: 'sirko',
      plugins: [
        resolve(),
        commonjs(),
        buble()
      ]
    }
  });
};
