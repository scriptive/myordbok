const app = require('..');
const assist = require('../assist');
const routes = app.Router();

routes.get('/', function(req, res) {
  res.render('dictionary', {
    title: res.locals.sol.name,
    keywords:'0, Myanmar, dictionary'.replace(0,res.locals.sol.name),
    description:'0 to Myanmar dictionary'.replace(0,res.locals.sol.name),
    dictionaries: assist.getLangList()
  });
});

module.exports = routes;