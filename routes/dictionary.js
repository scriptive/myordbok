// NOTE: mini
var app = require('../'),
    {dictionaries} = require('../score');
//     {express,path} = app.root.evh(),
//     querystring = require('querystring'),
//     Definition = require('./classDefinition');

let router = app.router();
router.get('/', function(req, res, next) {
  // let sol=req.cookies.sol;
  // for (var continental in dictionaries) {
  //   if (dictionaries.hasOwnProperty(continental)) {
  //     if (dictionaries[continental].hasOwnProperty(sol)) {
  //
  //     }
  //     // console.log(continental + " -> " + dictionaries[continental]);
  //   }
  // }
  res.render('dictionary', { title: 'MyOrdbok', dictionaries:dictionaries});
});

module.exports = router;