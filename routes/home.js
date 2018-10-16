/*
var {router} = require('../');
router()
var MyOrdbok = require('../');
MyOrdbok.router()
*/
// NOTE: mini
var app = require('../');
//     {express,path} = app.root.evh(),
//     {score} = require('../score'),
//     querystring = require('querystring'),
//     Definition = require('./classDefinition');

// NOTE: posible
// var Core = require.main.exports,
//     {express} = Core.evh()
//     {score} = require('../score');
// var router = express.Router();

// console.log(application);
let router = app.router();
router.get('/', function(req, res, next) {
  res.render('home', { title: 'MyOrdbok' });
  // res.send({working:'dictionary'})
});

module.exports = router;