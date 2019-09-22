const app = require('../');
const routes = app.Router();
const {search} = require('./classDefinition');
var https = require('https');
var querystring = require('querystring');

routes.get('/', (req, res, next) => {
  // app.mongo.collection('documents').find({}).toArray(function(err,doc) {
  //   console.log(doc)
  // });
  // console.log(app)
  // res.send({
  //   name:app.Config.name,
  //   version:app.Config.version
  // })
  // app.mongo.db.collection('documents').find({}).toArray(function(err,doc) {
  //   res.send(doc)
  // });
  app.mongo.db().then(e=>{
    e.collection('documents').find({}).toArray(function(err,doc) {
      res.send(doc)
    });
  })
});

routes.get('/dictionaries', (req, res, next) => {
  new search(req).dictionaries(raw => {
    return res.send(raw)
  });
});
/*
https://www.googleapis.com/language/translate/v2?
https://translate.google.com/translate_a/single?
https://translation.googleapis.com/language/translate/v2?
https://translation.googleapis.com/language/translate/v2?source=en&target=my&q=love
*/
routes.get('/translate', (req, res, next) => {
  res.send({working:'translate'})
});

// NOTE: api/post
// routes.get('/post', (req, res, next) => {
//   res.send({working:'post'});
// });
// routes.get('/import', (req, res, next) => {
//   res.send({working:'import'})
// });
// routes.get('/editor', (req, res, next) => {
//   res.send({working:'editor'})
// });

routes.get('/thesaurus', (req, res, next) => {
  // TODO: req.query
  new search(req).thesaurus(raw => {
    return res.send(raw)
  })
});
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
routes.get('/notation', (req, res, next) => {
  // TODO: req.query
  new search(req).notation(raw => {
    return res.send(raw)
  })
});
routes.get('/suggestion', (req, res, next) => {
  // TODO: req.query
  new search(req).suggestion(raw => {
    return res.send(raw)
  })
});
routes.get('/definition', (req, res, next) => {
  // TODO: req.query
  new search(req).definition(raw => {
    return res.send(raw)
  })
});
routes.get('/audio', (req, res, next) => {
  var key = req.params.key;
  // var music = '../../leyts/dist/mp/' + key + '.mp3';
  var music = '../leyts/dist/mp3/25/1032.mp3';
  var stat = fs.statSync(music);
  range = req.headers.range;
  var readStream;

  if (range !== undefined) {
      var parts = range.replace(/bytes=/, "").split("-");

      var partial_start = parts[0];
      var partial_end = parts[1];

      if ((isNaN(partial_start) && partial_start.length > 1) || (isNaN(partial_end) && partial_end.length > 1)) {
          return res.sendStatus(500); //ERR_INCOMPLETE_CHUNKED_ENCODING
      }

      var start = parseInt(partial_start, 10);
      var end = partial_end ? parseInt(partial_end, 10) : stat.size - 1;
      var content_length = (end - start) + 1;

      res.status(206).header({
          'Content-Type': 'audio/mpeg',
          'Content-Length': content_length,
          'Content-Range': "bytes " + start + "-" + end + "/" + stat.size
      });

      readStream = fs.createReadStream(music, {start: start, end: end});
  } else {
      res.header({
          'Content-Type': 'audio/mpeg',
          'Content-Length': stat.size
      });
      readStream = fs.createReadStream(music);
  }
  readStream.pipe(res);
});

// routes.get('/music', function(req,res){
// 	let file = 'music.mp3'
// 	fs.exists(file,function(exists){
// 		if(exists){
// 			var rstream = fs.createReadStream(file);
// 			rstream.pipe(res);
// 		} else {
// 			res.send("Its a 404");
// 			res.end();
// 		}
// 	});
// });
// routes.get('/music', function(req,res){
// 	let file = 'music.mp3'
// 	fs.exists(file,function(exists){
// 		if(exists){
//       res.setHeader('Content-disposition', 'attachment; filename=' + file);
// 			res.setHeader('Content-Type', 'application/audio/mpeg3')
// 			var rstream = fs.createReadStream(file);
// 			rstream.pipe(res);
// 		} else {
// 			res.send("Its a 404");
// 			res.end();
// 		}
// 	});
// });
module.exports = routes;
