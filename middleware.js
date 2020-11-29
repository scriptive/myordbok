const app = require('.');
const {locale} = app.Config;
// const {utility} = app.Common;
const assist = require('./assist');

module.exports = {
  restrictMiddleWare(req, res){
    if (res.locals.referer)
      if (req.xhr || req.headers.range) return true;
  }
};
app.Core.disable('x-powered-by');
// app.Core.disable('X-Powered-By');
// var reqCounter = 0;

app.Core.use(function(req, res, next){
  // res.setHeader( 'X-Powered-By', '@scriptive/evh' );
  const l0 = assist.getLangDefault();
  var Id=l0.id;

  // reqCounter++;
  // console.log('reqCounter',reqCounter)

  if (req.cookies.solId || req.cookies.solId != undefined) {
    Id=req.cookies.solId;
  } else {
    res.cookie('solId', Id);
  }

  const [name,solName] = req.path.split('/').filter(e=>e);
  if (name == 'dictionary' && solName) {
    var l1 = assist.getLangByName(solName);
    if (l1 && l1.id != Id) {
      Id = l1.id;
      res.cookie('solId', Id);
    }
  }
  // res.locals.app_locale = locale;

  res.locals.sol=assist.getLangById(Id)||l0;
  next();
});

// app.Core.use('/jquery.js',app.Common.express.static(__dirname + '/node_modules/jquery/dist/jquery.min.js'));

if (app.Config.development) {
  // console.log('app.Config.development',app.Config.development)
  const webpack = require('webpack');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  // const config = require('./webpack.config.js');
  const config = require('./webpack.middleware');

  //reload=true:Enable auto reloading when changing JS files or content
  //timeout=1000:Time from disconnecting from server to reconnecting
  // config.entry.app.unshift('webpack-hot-middleware/client?path=/__webpack_hmr&reload=true&timeout=1000');

  //Add HMR plugin
  // config.plugins.push(new webpack.HotModuleReplacementPlugin());

  const compiler = webpack(config);

  //Enable "webpack-dev-middleware"
  app.Core.use(webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath
  }));

  //Enable "webpack-hot-middleware"
  app.Core.use(webpackHotMiddleware(compiler));

}