const app = require('..');
const routes = app.Router();

routes.get('/', function(req, res, next) {
  res.render('privacy', { title: 'Privacy' });
});

module.exports = routes;