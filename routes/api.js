const app = require('..');
const routes = app.Router();
const assist = require('../assist');

routes.get('/', (req, res, next) => {
  res.send({
    name:app.Config.name,
    version:app.Config.version,
    development:app.Config.development
  })
});
// routes.get('/locals', (req, res, next) => {
//   res.send(res.locals)
// });
// routes.get('/config', (req, res, next) => {
//   res.send(app.Config)
// });
// routes.get('/definition', function(req, res, next) {
//   assist.search(req).then(
//     raw=> res.send(raw)
//   ).catch(next)
// });

routes.get('/suggestion', (req, res) => {
  assist.suggestion(req.query.q,req.cookies.solId).then(
    raw=> res.send(raw)
  ).catch(
    ()=>res.status(404).end()
  )
});

routes.get('/speech', (req, res) => {
  res.set({
    'Content-Type': 'audio/mpeg',
    'Accept-Ranges': 'bytes',
    'Content-Transfer-Encoding': 'binary',
    'Pragma': 'cache'
  });
  assist.speech(req.query).pipe(res)
});

module.exports = routes;
