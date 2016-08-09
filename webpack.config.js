const webpack = require('webpack');
const path    = require('path');

const NODE_ENV = process.env.NODE_ENV || 'development';

module.exports = {
  entry: './src/blacksea.js',
  output: {
    path:     __dirname + '/dist',
    filename: 'blacksea.js',
    library:  'blacksea'
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
        ],

        loader: 'babel',

        query: {
          presets: ['es2015'],
          plugins: ['transform-runtime']
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