const resolve  = require('rollup-plugin-node-resolve'),
      commonjs = require('rollup-plugin-commonjs'),
      buble    = require('rollup-plugin-buble');

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
      { pattern: 'test/**/*_test.js', watched: false }
    ],

    preprocessors: {
      'test/*_test.js':    ['rollup'],
      'test/**/*_test.js': ['rollup']
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
