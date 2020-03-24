const app = require('..');
const routes = app.Router();

routes.get('/', function(req, res) {
  res.render('home', {
    title: 'Myanmar dictionary',
    keywords: 'Myanmar, dictionary, grammar, font, definition, Burmese, online',
    description: 'A comprehensive online Myanmar dictionary, grammar, and fonts at MyOrdbok',
    pageClass:'home'
  });
});

module.exports = routes;