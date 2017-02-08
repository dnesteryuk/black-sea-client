const webpack = require('webpack');
const path    = require('path');

const NODE_ENV = process.env.NODE_ENV || 'dev';

module.exports = {
  entry: './src/sirko.js',
  output: {
    path:     __dirname + '/dist',
    filename: 'sirko.js',
    library:  'SirkoClient'
  },

  watch: NODE_ENV == 'dev',

  watchOptions: {
    aggregateTimeout: 100
  },

  devtool: NODE_ENV == 'dev' ? 'cheap-inline-module-source-map' : false,

  plugins: [
    new webpack.DefinePlugin({
      NODE_ENV: JSON.stringify(NODE_ENV)
    })
  ],

  module: {
    rules: [
      {
        test: /\.js$/,

        include: [
          path.resolve(__dirname, 'src'),
          path.resolve(__dirname, 'test')
        ],

        loader: 'babel-loader'
      },
    ]
  }
};

if (NODE_ENV == 'prod') {
  module.exports.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings:     false,
        drop_console: true,
        unsafe:       true
      },
      comments: false
    })
  );
}
