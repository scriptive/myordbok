const app = require('../');
const routes = app.Router();

routes.get('/', function(req, res, next) {
  res.render('terms', { title: 'Terms' });
});

module.exports = routes;