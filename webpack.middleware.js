const path = require('path');
const webpack = require('webpack');
// const merge = require('webpack-merge');
const { merge } = require('webpack-merge')
const configuration = require('./webpack.config.js');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = merge(configuration, {
  mode: 'development',
  devtool: 'inline-source-map',
  context: __dirname,
  entry: [
    'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000',
    path.resolve(__dirname, 'assets/webpack/development.js')
  ],
  // output: {
  //   filename:'[name].js',
  // },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    // new MiniCssExtractPlugin()
    new MiniCssExtractPlugin({filename: 'middleware.css'})
  ],
  module:{
    rules:[
      // {
      //   test: /\.s?css$/,
      //   use: [
      //     // MiniCssExtractPlugin.loader,
      //     "css-loader",
      //     "sass-loader"
      //   ],
      //   exclude: /middleware\.css$/i
      // },
      {
        test: /middleware\.css$/i,
        use: [
          // MiniCssExtractPlugin.loader,
          'style-loader',
          "css-loader",
          "sass-loader"
        ]
      }
    ]
  }
});