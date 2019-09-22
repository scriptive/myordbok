const app = require('./');
// const path = require('path');
const {dictionaries} = app.Config;
const {fs,utility} = app.Common;

module.exports = {
  // style: {
  //   // prefix: '/css',
  //   // indentedSyntax: false,
  //   // debug: true,
  //   // response:false,
  //   // NOTE: nested, expanded, compact, compressed
  //   // outputStyle: 'compressed',
  //   // sourceMap: false
  // },
  // script: {
  //   // prefix:'/jsmiddlewareoutput'
  // },
  restrictMiddleWare(req, res){
    if (res.locals.referer)
      if (req.xhr || req.headers.range) return true
  }
};

app.Core.use('/jquery.js',app.Common.express.static(__dirname + '/node_modules/jquery/dist/jquery.min.js'));

app.Core.use(function(req, res, next){
  let solId='en', solName = 'English';
  if (req.cookies.solId || req.cookies.solId != undefined || req.cookies.solName || req.cookies.solName != undefined) {
    solId=req.cookies.solId;
    solName=req.cookies.solName;
  } else {
    res.cookie('solId', solId);
    res.cookie('solName', solName);
  }

  // '/dictionary/english?s'.match(/dictionary\/([a-z]+)/i);
  let sol = req.path.split('/');
  if (sol.length > 2 && sol[1] =='dictionary') {
    let Id, Name = sol[2];
     // && req.cookies.solName && Name.toLowerCase() !== req.cookies.solName.toLowerCase()
    if (Name) {
      for (var continental in dictionaries) {
        if (dictionaries.hasOwnProperty(continental)) {
          Id = utility.objects.getKeybyValue(dictionaries[continental],Name,'i');
          if (Id) {
            solId=Id;
            solName = utility.objects.getValuebyKey(dictionaries[continental],solId);
            res.cookie('solId', solId);
            res.cookie('solName', solName);
          }
        }
      }
    }
  }
  res.locals.solId=solId;
  res.locals.solName=solName;
  // sol,sil
  // res.cookie('name', 'express');//.send('cookie set'); //Sets name = express
  next();
});


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
