const webpack = require('webpack');
const path    = require('path');

const NODE_ENV = process.env.NODE_ENV || 'development';

module.exports = {
  entry: './src/sirko.js',
  output: {
    path:     __dirname + '/dist',
    filename: 'sirko.js',
    library:  'Sirko'
  },

  watch: NODE_ENV == 'development',

  watchOptions: {
    aggregateTimeout: 100
  },

  devtool: NODE_ENV == 'development' ? 'cheap-inline-module-source-map' : null,

  plugins: [
    new webpack.DefinePlugin({
      NODE_ENV: JSON.stringify(NODE_ENV)
    })
  ],

  module: {
    loaders: [
      {
        test: /\.js$/,

        include: [
          path.resolve(__dirname, 'src'),
          path.resolve(__dirname, 'test')
        ],

        loader: 'babel',

        query: {
          presets: ['es2015'],
          plugins: ['transform-runtime'],
          cacheDirectory: true
        }
      },
    ]
  }
};

if (NODE_ENV == 'production') {
  module.exports.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings:     false,
        drop_console: true,
        unsafe:       true
      }
    })
  );
}