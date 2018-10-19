var app = require('../'),
    {path} = app.root.evh(),
    {score} = require('../score'),
    querystring = require('querystring'),
    search = require('./classDefinition');

let router = app.router();
router.get('/', function(req, res, next) {
  /*
  let param={},
      query=req.query;
  if (query.q){
    param.q=query.q;
  }
  if (query.year){
    param.year=query.year;
  }
  if (query.genre){
    param.genre=query.genre;
  }
  if (query.page){
    param.page=query.page;
  }
  new Definition(param).search(function (raw) {
    param.page='*';
    // res.render(raw.type, {
    //   title: 'Tracks',
    //   raw: raw,
    //   meta: raw.meta,
    //   url: '/music?'+querystring.stringify(param)
    // });
    res.send(raw);
  });
  */
  /*
  definition
  numeric
  translate
  meaning
  notfound

  definition

  meaning, translate
  word,sentence,
  pleaseenter,notfound
  */
  // res.render('definition/meaning', { title: 'MyOrdboks' });
  // res.render('definition/translate', { title: 'MyOrdbok' });
  // res.render('definition/pleaseenter', { title: 'MyOrdbok' });
  // res.render('definition/notfound', { title: 'MyOrdbok' });
  // res.render('definition/numeric', { title: 'MyOrdbok' });
  new search(req).definition(raw => {
    res.render('definition/layout', raw);
  })

});
module.exports = router;
