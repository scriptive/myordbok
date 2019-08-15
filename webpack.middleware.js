const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const configuration = require('./webpack.config.js');

module.exports = merge(configuration, {
  mode: 'development',
  devtool: 'inline-source-map',
  context: __dirname,
  entry: [
    'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000',
    path.resolve(__dirname, 'assets/webpack/development.js')
  ],
  output: {
    filename:'script.js',
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ],
  module:{
    rules:[
    ]
  }
});