const app = require('..');
const routes = app.Router();
const assist = require('../assist');
var https = require('https');
var querystring = require('querystring');

routes.get('/', (req, res, next) => {
  // app.mongo.collection('documents').find({}).toArray(function(err,doc) {
  //   console.log(doc)
  // });
  // console.log(app)
  res.send({
    name:app.Config.name,
    version:app.Config.version
  })
  // app.mongo.db.collection('documents').find({}).toArray(function(err,doc) {
  //   res.send(doc)
  // });
  // app.mongo.db().then(e=>{
  //   e.collection('documents').find({}).toArray(function(err,doc) {
  //     res.send(doc)
  //   });
  // })
});

routes.get('/suggestion', (req, res) => {
  // req.cookies.solId
  assist.suggestion(req.query.q,req.cookies.solId).then(
    raw=> res.send(raw)
  ).catch(
    ()=>res.status(404).end()
  )
});
routes.get('/definition', function(req, res, next) {
  assist.search(req).then(
    raw=> res.send(raw)
  ).catch(next)
});
// routes.get('/dictionaries', (req, res, next) => {
//   new search(req).dictionaries(raw => {
//     return res.send(raw)
//   });
// });
/*
https://www.googleapis.com/language/translate/v2?
https://translate.google.com/translate_a/single?
https://translation.googleapis.com/language/translate/v2?
https://translation.googleapis.com/language/translate/v2?source=en&target=my&q=love
*/
// routes.get('/translate', (req, res, next) => {
//   res.send({working:'translate'})
// });

// routes.get('/thesaurus', (req, res, next) => {
//   // TODO: req.query
//   new search(req).thesaurus(raw => {
//     return res.send(raw)
//   })
// });
// NOTE: main
routes.get('/speech', (req, res, next) => {
  // querystring.escape('One two');
  // querystring.stringify({query: "SELECT name FROM user WHERE uid = me()"});
  let query= req.query,
      word = querystring.escape(query.q),
      lang = query.l,
      url = app.Config.speechUrl.replace('$q',word).replace('$l',lang);
  // res.send({working:'speech',q:q,l:l,url:url})
  res.set({
    'Content-Type': 'audio/mpeg',
    'Accept-Ranges': 'bytes',
    'Content-Transfer-Encoding': 'binary',
    'Pragma': 'cache'
  });
  // res.set('content-type', 'audio/mp3');
  // res.set('accept-ranges', 'bytes');
  https.get(url, (resp) => {
    resp.on('data', (chunk) => {
      res.write(chunk);
    });
    resp.on('end', () => {
      res.end();
    });
  }).on('error', (err) => {
    // // TODO: err.message
    res.sendStatus(404);
  });
});
// routes.get('/notation', (req, res, next) => {
//   // TODO: req.query
//   new search(req).notation(raw => {
//     return res.send(raw)
//   })
// });


module.exports = routes;
