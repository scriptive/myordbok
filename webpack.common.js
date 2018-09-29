const path = require('path');
// const CleanWebpackPlugin = require('clean-webpack-plugin');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
// const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
// const ExtractTextPlugin = require('extract-text-webpack-plugin');
// var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
module.exports = {
  entry: {
    myordbok: './assets/tmp/index.js'
  },
  plugins: [
  ],
  module:{
     rules:[
      {
        test:/\.js$/,
        exclude:/(node_modules)/
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
        // loader: 'file-loader',
        loader: 'url-loader',
        options: {
          limit: 10000
        }
      },
      // {
      //   test:/\.(png|jpe?g|gif)$/,
      //   loader: 'url-loader?limit=1024&name=/assets/[name].[ext]'
      // },
      {
        test:/\.scss$/,
        loader:'style-loader!css-loader!sass-loader'
      }
    ]
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
};