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
// var reqCounter = 0;

app.Core.use(function(req, res, next){
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
  var webpack = require('webpack');
  var webpackConfig = require('./webpack.middleware');
  var compiler = webpack(webpackConfig);
  app.Core.use(require('webpack-dev-middleware')(compiler, {
    logLevel: 'warn', publicPath: webpackConfig.output.publicPath
  }));
  app.Core.use(require('webpack-hot-middleware')(compiler, {
    log: console.log, path: '/__webpack_hmr', heartbeat: 10 * 1000
  }));
}
