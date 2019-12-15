const app = require('../');
// const {utility} = app.Common;
const {dictionaries,locale,visitsPrevious} = app.Config;
const routes = app.Router();

routes.get('/', function(req, res,next) {
  // var start = utility.timeCheck();
  // res.locals.dictionaries_total = Object.keys(dictionaries_delete).map(continental => Object.keys(dictionaries_delete[continental]).length).reduce((a, b) => a + b,0);
  res.locals.dictionaries_total = dictionaries.map(continental => continental.lang.length).reduce((a, b) => a + b,0);
  res.locals.locale_total = locale.length;
  // res.visits_count = row.visits_count;
  // res.visits_created = row.created;
  // res.visits_total = row.visits_total+visitsPrevious;
  res.render('about', {
    title:'About',
    keywords:'Myanmar dictionary, Burmesisk ordbok, Myanmar definition, Burmese, norsk ordbok, burmissk',
    description: 'About MyOrdbok, Free online Myanmar dictionaries', dictionaries:dictionaries
  })
});

module.exports = routes;