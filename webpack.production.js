const merge = require('webpack-merge');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
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
    }),
    new MiniCssExtractPlugin({filename: 'style.css'})
  ],
  module:{
    rules:[
      {
        test: /\.s?css$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "sass-loader"
        ]
      }
    ]
  }
});