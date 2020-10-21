// const merge = require('webpack-merge');
const { merge } = require('webpack-merge')
const configuration = require('./webpack.config.js');

module.exports = merge(configuration, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './assets/webpack'
    // contentBase: './dist'
  },
  entry: {},
  output: {
    filename: '[name].bundle.js',
  },
  plugins: [
  ],
  module:{
    rules:[
    ]
  }
});