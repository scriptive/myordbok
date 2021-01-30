import path from 'path';
import VueLoaderPlugin from 'vue-loader/lib/plugin.js';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

export default {
  // target: "node",
  mode: 'development',
  devtool: 'inline-source-map',
  // devServer: {
  //   compress: true,
  //   public: path.resolve('./static')
  // },
  entry: {
    script: [
      path.resolve('./assets/webpack/index.js')
    ]
  },
  output: {
    path: path.resolve('./static'),
    publicPath: '/',
    filename:'[name].js'
  },
  resolve: {
    extensions: ['.js', '.vue', '.json','.css','.scss'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
  },
  plugins: [
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({filename: 'style.css'})
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
        // test: /\.s?css$/,
        // test: /\.(sa|sc|c)ss$/,
        test: /\.(sa|sc|c)ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          // 'style-loader',
          "css-loader",
          "sass-loader"
        ],
        // exclude: /middleware\.css$/
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                // [
                //   '@babel/preset-env',
                //   {
                //     'modules': 'auto',//commonjs,amd,umd,systemjs,auto
                //     'useBuiltIns': 'usage',
                //     'targets': '> 0.25%, not dead',
                //     'corejs': 3
                //   }
                // ]
              ]
            }
          }
        ]
      },
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
