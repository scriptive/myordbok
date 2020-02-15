const path = require('path');
module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  entry: {
    // script: path.resolve(__dirname, 'assets/webpack/index.js')
    script:[
      path.resolve(__dirname, 'assets/webpack/index.js'),
      // path.resolve(__dirname, 'assets/script/analytics.js')
    ]
  },
  output: {
    path: path.resolve(__dirname, 'static'),
    filename:'[name].js',
    publicPath: '/'
  },
  plugins: [
  ],
  module: {
    rules: [
      {
        test: /\.exec\.js$/,
        use: [
          'script-loader'
        ]
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: "babel-loader",
        options: {
          presets: []
        }
      },
      {
        // test: /\.s?css$/,
        test: /\.(sa|sc|c)ss$/,
        use: [
          'style-loader',
          "css-loader",
          "sass-loader"
        ]
      },
      // {
      //   test: /\.png$/,
      //   // NOTE: file-loader?name=[name].[ext] retain original file name
      //   // loader: 'file-loader',
      //   // loader: 'url-loader?limit=1024&name=[name].[ext]',
      //   // loader: 'url-loader?limit=1024&name=/assets/[name].[ext]',
      //   loader: 'file-loader?name=[name].[ext]',
      //   // query: {
      //   //   mimetype: 'image/x-png',
      //   //   // name: '[name].[ext]'
      //   // }
      // },
      // {
      //   test: /\.(jpg|gif|svg|eot|ttf|woff|woff2)$/,
      //   // NOTE: file-loader or url-loader
      //   loader: 'file-loader',
      //   exclude: [/Myanmar3.*$/],
      //   options: {
      //     limit: 10000
      //   }
      // }
      {
        // test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
        test: /\.(png|ico|jpg|gif|svg|eot|ttf|woff|woff2|webmanifest)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          limit: 10000
        }
      }
      // NOTE for production
      // {
      //   test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
      //   loader: 'file-loader?name=[name].[ext]'
      // }
    ]
  }
};