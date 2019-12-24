const app = require('..');
const assist = require('../assist');
const {locale} = app.Config;
const routes = app.Router();

routes.get('/', function(req, res,next) {
  res.render('about', {
    title:'About',
    keywords:'Myanmar dictionary, Burmesisk ordbok, Myanmar definition, Burmese, norsk ordbok, burmissk',
    description: 'About MyOrdbok, Free online Myanmar dictionaries',
    dictionaries: assist.getLangList(),
    visits: assist.visits(),
    locale_total: locale.length,
    dictionaries_total: assist.getLangCount()
  })
});

module.exports = routes;