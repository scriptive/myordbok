var path = require('path'),
    merge = require('webpack-merge'),
    MiniCssExtractPlugin = require('mini-css-extract-plugin'),
    CleanWebpackPlugin = require('clean-webpack-plugin'),
    configuration = require('./webpack.config.js');

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
    new MiniCssExtractPlugin({
      filename: 'style.css',
      chunkFilename: '[id].css'
    })
  ],
  module:{
    rules:[
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          'css-loader',
          'sass-loader'
        ]
      }
    ]
  }
});