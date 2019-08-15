const merge = require('webpack-merge');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const configuration = require('./webpack.config.js');

module.exports = merge(configuration, {
  mode: 'production',
  devtool: 'source-map',
  entry: {},
  output: {},
  plugins: [
    new CleanWebpackPlugin([
      'static/*.*'
    ], {
      root: __dirname,
      exclude: [],
      verbose: true,
      dry: false
    })
  ],
  module:{
    rules:[
    ]
  }
});