var {express,path,application} = require.main.exports(),
    {score} = require(path.join(__dirname, 'score'));

// module.exports = {score};
// var MyOrdbok = module.exports = function(){};
// MyOrdbok.score = score;



var webpack = require('webpack');
var webpackConfig = require(process.env.WEBPACK_CONFIG ? process.env.WEBPACK_CONFIG : './webpack.config');
var compiler = webpack(webpackConfig);

application.use(require("webpack-dev-middleware")(compiler, {
  logLevel: 'warn', publicPath: webpackConfig.output.publicPath
}));

application.use(require("webpack-hot-middleware")(compiler, {
  log: console.log, path: '/__webpack_hmr', heartbeat: 10 * 1000
}));