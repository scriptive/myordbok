const app = require('../');
const {dictionaries} = app.Config;
const routes = app.Router();
const {visits} = require('./classUtilities');


routes.get('/', function(req, res, next) {
  // new visits(req.ip).init(res.locals).then(()=>{
  //   res.render('about', { title: 'About', dictionaries:dictionaries});
  // })
  res.locals.dictionaries_total = 0;
  for (var continental in dictionaries) {
    // res.locals.dictionaries_total += dictionaries[continental].keys().length;
    res.locals.dictionaries_total += Object.keys(dictionaries[continental]).length;
  }
  // console.log(res.locals.dictionaries_total);
  new visits(req.ip).init(res.locals).then(()=> res.render('about', { title: 'About', dictionaries:dictionaries}))
});

module.exports = routes;