const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
// const MiniCSSExtractPlugin = require("mini-css-extract-plugin");
// const ExtractTextPlugin = require('extract-text-webpack-plugin');
// const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        extractComments: false,
        uglifyOptions: {
          output: {
            comments: false
          },
          compress: true,
          ecma: 6,
          mangle: true,
        },
        cache: true,
        parallel: true,
        sourceMap: true
      })
    ]
  },
  plugins: [
  ],
  module: {
  }
  // module: {
  //   rules: [
  //     {
  //       test: /\.css$/,
  //       use: ExtractTextPlugin.extract({
  //         fallback: 'style-loader',
  //         use: [
  //           {
  //               loader: 'css-loader',
  //               options: {
  //                   // If you are having trouble with urls not resolving add this setting.
  //                   // See https://github.com/webpack-contrib/css-loader#url
  //                   // url: false,
  //                   minimize: true,
  //                   sourceMap: true
  //               }
  //           },
  //           {
  //               loader: 'sass-loader',
  //               options: {
  //                   sourceMap: true
  //               }
  //           }
  //         ]
  //       })
  //     }
  //   ]
  // }
});