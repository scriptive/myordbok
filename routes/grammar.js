const app = require('../');
// const {dictionaries,locale} = app.Config;
const {fs} = app.Common;
const routes = app.Router();


routes.get('/pos-:id', function(req, res, next) {
  let grammar = fs.readJsonSync(app.Config.dir.assets+'/grammar/grammar.json');
  var id = req.params.id;

  if (grammar.pos.hasOwnProperty(id)) {
    res.render('grammar-pos', {title:id, grammar:grammar.pos[id]});
    // res.send(grammar.pos[id]);
  } else {
    res.send({'pos-not-found':id});
  }
  // res.render('grammar-pos', {title:'Grammar', grammar:grammar});
  // res.send({'abc':req.params});
});
routes.get('/', function(req, res, next) {
  let grammar = fs.readJsonSync(app.Config.dir.assets+'/grammar/grammar.json');
  res.render('grammar', {title:'Grammar', grammar:grammar});
  // res.send(grammar);
});


module.exports = routes;