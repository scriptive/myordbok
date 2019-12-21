const app = require('..');
const routes = app.Router();

routes.get('/', function(req, res, next) {
  res.render('home', {
    title: 'MyOrdbok',
    keywords: 'Myanmar dictionary, Myanmar definition, Burmese, norsk ordbok, burmissk',
    description: 'online Myanmar dictionaries, available in 24 languages.'
  });
});

module.exports = routes;