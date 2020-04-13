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



// /orths-:name
routes.get('/orth', (req, res) => {
  // req.params.name req.query.name
  assist.orthCharacter(req.query.name).then(
    raw=> res.send(raw)
  ).catch(
    ()=>res.status(404).end()
  )
});
// orthword orthord orthnse orthble ortheak
routes.get('/orth-word', (req, res) => {
  assist.orthWord(req.query.ord).then(
    raw=> res.send(raw)
  ).catch(
    ()=>res.status(404).end()
  )
});
routes.get('/orth-sense', (req, res) => {
  assist.orthSense(req.query.ord).then(
    raw=> res.send(raw)
  ).catch(
    ()=>res.status(404).end()
  )
});
routes.get('/orth-syllable', (req, res) => {
  assist.orthSyllable(req.query.str).then(
    raw=> res.send(raw)
  ).catch(
    ()=>res.status(404).end()
  )
});
routes.get('/orth-break', (req, res) => {
  assist.orthBreak(req.query.str).then(
    raw=> res.send(raw)
  ).catch(
    ()=>res.status(404).end()
  )
});
routes.get('/suggestion', (req, res) => {
  // req.cookies.solId
  assist.suggestion(req.query.q,res.locals.sol.id).then(
    raw=> res.send(raw)
  ).catch(
    ()=>res.status(404).end()
  )
});

routes.get('/grammar', (req, res) => {
  assist.getGrammar().then(
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
