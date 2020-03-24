const path = require('path');

const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  entry: {
    script: [
      path.resolve(__dirname, 'assets/webpack/index.js')
    ]
  },
  output: {
    path: path.resolve(__dirname, 'static'),
    filename:'[name].js',
    publicPath: '/'
  },
  resolve: {
    extensions: ['.js', '.vue', '.json','.css','.scss'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
  },
  plugins: [
    new VueLoaderPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
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
        test: /\.s?css$/,
        // test: /\.(sa|sc|c)ss$/,
        use: [
          'style-loader',
          "css-loader",
          "sass-loader"
        ]
      },
      // {
      //   test: /Myanmar3.*$/,
      //   loader: 'file-loader',
      //   query: {
      //     name: '[name].[ext]'
      //   }
      // },
      // {
      //   test: /\.png$/,
      //   // NOTE: file-loader?name=[name].[ext] retain original file name
      //   loader: 'file-loader',
      //   query: {
      //     mimetype: 'image/x-png',
      //     name: '[name].[ext]'
      //   }
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
        test: /\.(png|ico|jpg|gif|svg|eot|ttf|woff|woff2|webmanifest)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          limit: 10000
        }
      }
    ]
  }
};