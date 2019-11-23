const app = require('../');
const {dictionaries} = app.Config;
const routes = app.Router();
const {visits} = require('./classUtilities');

routes.get('/', function(req, res) {
  res.locals.dictionaries_total = Object.keys(dictionaries).map(continental => Object.keys(dictionaries[continental]).length).reduce((a, b) => a + b,0);
  new visits(req.ip).init(res.locals).then(
    ()=> res.render('about', {
      title:'About',
      keywords:'Myanmar dictionary, Burmesisk ordbok, Myanmar definition, Burmese, norsk ordbok, burmissk',
      description: 'About MyOrdbok, Free online Myanmar dictionaries', dictionaries:dictionaries
    })
  );
});

module.exports = routes;