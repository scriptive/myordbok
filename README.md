# MyOrdbok


```shell
npm i mathjs
npm i myanmar-notation
npm i moby
```

```shell
npm i --save-dev webpack webpack-merge
npm i --save-dev webpack-dev-server
npm i --save-dev babel-core babel-loader babel-preset-es2015
npm i --save-dev css-loader style-loader
npm i --save-dev node-sass sass-loader
```

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