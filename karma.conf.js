// reuse the webpack config
var webpackConfig = require('./webpack.config.js');
delete webpackConfig.entry;

module.exports = function(config) {
  var browsers = ['Chrome', 'Firefox'];

  if (process.env.TRAVIS) {
    browsers = ['Firefox'];
  }

  config.set({
    browsers: browsers,

    frameworks: ['mocha'],

    files: [
      'test/*_test.js',
      'test/**/*_test.js'
    ],

    preprocessors: {
      'test/*_test.js':    ['webpack'],
      'test/**/*_test.js': ['webpack']
    },

    webpack: webpackConfig,

    webpackMiddleware: {
      noInfo: true,
      stats: {
        chunks: false
      }
    },

    plugins: [
      require('karma-webpack'),
      require('karma-mocha'),
      require('karma-chrome-launcher'),
      require('karma-firefox-launcher')
    ]
  });
};
