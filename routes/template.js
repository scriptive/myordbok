const app = require('..');
const routes = app.Router();
// const assist = require('../assist');

// routes.get('/', function(req, res) {
//   assist.search(req).then(
//     raw=>res.render('template/definition', raw)
//   ).catch(
//     ()=>res.status(404).end()
//   )
// });
routes.get('/', function(req, res) {
  res.render('template/definition', { title: 'Development only',meta:{} });
});
module.exports = routes;