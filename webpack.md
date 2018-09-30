# webpack

- webpack.*.js
  - [x] middleware
  - [x] production
  - [x] development
  - [x] dev server

```shell
# Common
npm i -D webpack

# Middleware
npm i -D webpack-dev-middleware
npm i -D webpack-hot-middleware

# CLI
npm i -D webpack-cli
npm i -D webpack-merge

# Plugin
npm i -D style-loader css-loader
npm i -D node-sass
npm i -D sass-loader
npm i -D file-loader
npm i -D url-loader

# babel
npm i -D babel-core babel-loader babel-preset-es2015

npm i -D @babel/core
npm i -D @babel/loader

# Production
npm i -D mini-css-extract-plugin
npm i -D clean-webpack-plugin
npm i -D extract-text-webpack-plugin


# Development
npm i -D webpack-dev-server

# ??
npm i -D optimize-css-assets-webpack-plugin
```


"start:open": "webpack-dev-server --open",
"start": "webpack-dev-server --open --config webpack.dev.js",
"build:webpack": "webpack",
"build": "npm run build:dev",
"build:dev": "webpack --config webpack.dev.js",
"build:pro": "webpack -p --config webpack.prod.js",
"test": "echo \"Error: no test specified\" && exit 1"

> webpack.config.js

```js
module.exports ={
  entry:'./asset/script/script.js',
  output:{
    path:'dist',
    filename:'bundle.js'
  },
  module:{
    loaders:[
      {
        test:/\.js$/,
        exclude:/(node_modules)/,
        loader:'babel-loader',
        query:{
          presets:['es2015']
        }
      },
      {
        test:/\.css$/,
        loader:'style-loader!css-loader'
      },
      {
        test:/\.scss$/,
        loader:'style-loader!css-loader!sass-loader'
      }
    ]
  }
};
```

> webpack.common.js

```javascript
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  entry: {
    app: './src/index.js'
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      title: 'Production'
    })
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
};
```

> webpack.dev.js

```javascript
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist'
  }
});
```

> webpack.prod.js

```javascript
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
module.exports = merge(common, {
  mode: 'production',
});
```