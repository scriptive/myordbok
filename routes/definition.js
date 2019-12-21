const app = require('..');
const routes = app.Router();
const assist = require('../assist');

routes.get('/', function(req, res) {
  assist.search(req).then(
    raw=>res.render('definition/layout', raw)
  ).catch(
    ()=>res.status(404).end()
  )
});
module.exports = routes;