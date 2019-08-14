const app = require('./');
const {dictionaries} = app.Config;
const {utility} = app.Common;

app.Core.use('/jquery.js',app.Common.express.static(__dirname + '/node_modules/jquery/dist/jquery.min.js'));

// var qs = require('qs');
// app.Core.set('query parser', function (str) {
//   return qs.parse(str, { decode: function (s) { return decodeURIComponent(s); } });
// });

app.Core.use(function(req, res, next){
  //Expires after 360000 ms from the time it is set.
  // res.cookie(name, 'value', {expire: 360000 + Date.now()});
  //This cookie also expires after 360000 ms from the time it is set.
  // res.cookie(name, 'value', {maxAge: 360000});
  // res.clearCookie('foo');
  // res.cookie('sol', {id:'en',name:'English'});
  // res.clearCookie('solId');
  // console.log(Object.values(dictionaries));
  // console.log(app.Config);

  // res.locals.app_locale = locale;
  // var solId, solName;
  res.locals.appName = app.Config.name;
  res.locals.appVersion = app.Config.version;
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
