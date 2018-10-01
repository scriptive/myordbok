// NOTE: mini
var app = require('../');
//     {express,path} = app.Core.evh(),
//     {score} = require('../score'),
//     querystring = require('querystring'),
//     Definition = require('./classDefinition');

// NOTE: posible
// var Core = require.main.exports,
//     {express} = Core.evh()
//     {score} = require('../score');
// var router = express.Router();

let router = app.router();

router.get('/', function(req, res, next) {
  // console.log(req.baseUrl);
  // console.log('???',req.originalUrl);
  // console.log(app.sql);
  // console.log(app.score);
  // console.log(score.sql);
  res.render('home', { title: 'MyOrdbok' });
});

module.exports = router;