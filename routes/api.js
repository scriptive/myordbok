var app = require('../'),
    {express,path} = app.root.evh(),
    {dictionaries} = require('../score');
    https = require('https'),
    querystring = require('querystring'),
    search = require('./classDefinition');

let router = app.router();

router.get('/', (req, res, next) => {
  res.send({
    name:app.score.name,
    version:app.score.version
  })
});

router.get('/dictionaries', (req, res, next) => {
  // console.log(req.signedCookies);
  // console.log(res.cookie('sol'));
  new search(req).dictionaries(raw => {
    // res.clearCookie('sol');
    return res.send(raw)
  });
});
/*
https://www.googleapis.com/language/translate/v2?
https://translate.google.com/translate_a/single?
https://translation.googleapis.com/language/translate/v2?
https://translation.googleapis.com/language/translate/v2?source=en&target=my&q=love
*/
router.get('/translate', (req, res, next) => {
  res.send({working:'translate'})
});

// NOTE: api/post
// router.get('/post', (req, res, next) => {
//   res.send({working:'post'});
// });
// router.get('/import', (req, res, next) => {
//   res.send({working:'import'})
// });
// router.get('/editor', (req, res, next) => {
//   res.send({working:'editor'})
// });

router.get('/thesaurus', (req, res, next) => {
  // TODO: req.query
  new search(req).thesaurus(raw => {
    return res.send(raw)
  })
});
// NOTE: main
router.get('/speech', (req, res, next) => {
  // querystring.escape('One two');
  // querystring.stringify({query: "SELECT name FROM user WHERE uid = me()"});
  let query= req.query,
      word = querystring.escape(query.q),
      lang = query.l,
      url = app.score.speechUrl.replace('$q',word).replace('$l',lang);
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
router.get('/notation', (req, res, next) => {
  // TODO: req.query
  new search(req).notation(raw => {
    return res.send(raw)
  })
});
router.get('/suggestion', (req, res, next) => {
  // TODO: req.query
  new search(req).suggestion(raw => {
    return res.send(raw)
  })
});
router.get('/definition', (req, res, next) => {
  // TODO: req.query
  // console.log(res.locals.solId);
  new search(req).definition(raw => {
    return res.send(raw)
  })
});

// router.get('/music', function(req,res){
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
// router.get('/music', function(req,res){
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
module.exports = router;
