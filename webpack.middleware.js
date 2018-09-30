var path = require('path'),
    webpack = require('webpack'),
    merge = require('webpack-merge'),
    MiniCssExtractPlugin = require('mini-css-extract-plugin'),
    configuration = require('./webpack.config.js');

const extractLESS = new ExtractTextPlugin('style.css');
module.exports = merge(configuration, {
  mode: 'development',
  devtool: 'inline-source-map',
  context: __dirname,
  entry: [
    'webpack-hot-middleware/client?path=/core_webpack_hmr&timeout=20000',
    path.resolve(__dirname, 'assets/webpack/middleware.js')
  ],
  output: {
    filename:'script.js',
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new MiniCssExtractPlugin({filename: 'style.css'})
  ],
  module:{
    rules:[
      {
        test: /middleware.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          'css-loader'
        ]
      }
    ]
  }
});