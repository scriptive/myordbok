const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge')
const configuration = require('./webpack.config.js');

module.exports = merge(configuration, {
  entry: {
    script: [
      'webpack-hot-middleware/client?path=/__webpack_hmr&reload=true&timeout=1000',
      path.resolve(__dirname, 'assets/webpack/development.js')
      // path.resolve(__dirname, 'assets/webpack/test.script.js')
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
});