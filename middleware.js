/*
var app = require('./');
app.core.use();
const {core} = require('./');
core.use();
*/
const app = require('./'),
      {dictionaries} = require('./score'),
      {cookieParser,utility} = app.root.evh();

app.core.use(function(req, res, next){
  //Expires after 360000 ms from the time it is set.
  // res.cookie(name, 'value', {expire: 360000 + Date.now()});
  //This cookie also expires after 360000 ms from the time it is set.
  // res.cookie(name, 'value', {maxAge: 360000});
  // res.clearCookie('foo');
  // res.cookie('sol', {id:'en',name:'English'});
  // res.clearCookie('solId');
  // console.log(Object.values(dictionaries));
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



var webpack = require('webpack');
// process.env.WEBPACK_CONFIG ? process.env.WEBPACK_CONFIG :
var webpackConfig = require('./webpack.middleware');
var compiler = webpack(webpackConfig);
app.core.use(require('webpack-dev-middleware')(compiler, {
  logLevel: 'warn', publicPath: webpackConfig.output.publicPath
}));
app.core.use(require('webpack-hot-middleware')(compiler, {
  log: console.log, path: '/__webpack_hmr', heartbeat: 10 * 1000
}));
