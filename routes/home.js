// NOTE: mini
var app = require('../');

// NOTE: posible
// var {express} = require.main.exports(),
//     app = require('../'),
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

// router.get('/', (req, res, next) => res.render('home', { title: 'MyOrdbok' }));
// console.log(router.stack);
module.exports = router;


// function space(x) {
//     var res = '';
//     while(x--) res += ' ';
//     return res;
// }
//
// function listRoutes(){
//     for (var i = 0; i < arguments.length;  i++) {
//         if(arguments[i].stack instanceof Array){
//             console.log('');
//             arguments[i].stack.forEach(function(a){
//                 var route = a.route;
//                 if(route){
//                     route.stack.forEach(function(r){
//                         var method = r.method.toUpperCase();
//                         console.log(method,space(8 - method.length),route.path);
//                     })
//                 }
//             });
//         }
//     }
// }
//
// listRoutes(router);