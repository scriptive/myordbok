const app = require('../');
const routes = app.Router();
const {visits} = require('./classUtilities');

routes.get('/', function(req, res, next) {
  // new visits(req.ip).init(res.locals).then(function(){
  //   res.render('home', {
  //     title: 'MyOrdbok',
  //     keywords: 'Myanmar dictionary, Myanmar definition, Burmese, norsk ordbok, burmissk',
  //     description: 'online Myanmar dictionaries, available in 24 languages.'
  //   });
  // })
  new visits(req.ip).init(res.locals);
  res.render('home', {
    title: 'MyOrdbok',
    keywords: 'Myanmar dictionary, Myanmar definition, Burmese, norsk ordbok, burmissk',
    description: 'online Myanmar dictionaries, available in 24 languages.'
  });
});

module.exports = routes;