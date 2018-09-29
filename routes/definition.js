// const {express,path} = require('@scriptive/evh');
const {express,path} = require.main.exports();
const {score} = require('.././score');

const querystring = require('querystring');
const Definition = require('./classDefinition');

// const {express} = require('express-virtual');
// const path = require('path'),
//       querystring = require('querystring'),
//       Definition = require('./class.definition');

const router = express.Router();

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
  res.render('definition/meaning', { title: 'MyOrdboks' });
  // res.render('definition/translate', { title: 'MyOrdbok' });
  // res.render('definition/pleaseenter', { title: 'MyOrdbok' });
  // res.render('definition/notfound', { title: 'MyOrdbok' });
  // res.render('definition/numeric', { title: 'MyOrdbok' });

});


module.exports = router;
