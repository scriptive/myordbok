const app = require('../');
const {dictionaries} = app.Config;
const routes = app.Router();

routes.get('/', function(req, res, next) {
  res.render('dictionary', { title: 'MyOrdbok', dictionaries:dictionaries});
});

module.exports = routes;