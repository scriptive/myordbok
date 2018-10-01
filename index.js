var Core = require.main.exports,
    {application} = Core.evh();

module.exports = {Core};
// var MyOrdbok = module.exports = function(){};
// MyOrdbok.score = score;

var webpack = require('webpack');
// process.env.WEBPACK_CONFIG ? process.env.WEBPACK_CONFIG :
var webpackConfig = require('./webpack.middleware');
var compiler = webpack(webpackConfig);

application.use(require('webpack-dev-middleware')(compiler, {
  logLevel: 'warn', publicPath: webpackConfig.output.publicPath
}));

application.use(require('webpack-hot-middleware')(compiler, {
  log: console.log, path: '/__webpack_hmr', heartbeat: 10 * 1000
}));