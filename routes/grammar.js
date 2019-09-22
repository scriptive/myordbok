const app = require('../');
// const path = require('path');
// const {dictionaries,locale} = app.Config;
const {fs,path} = app.Common;
const routes = app.Router();

routes.get('/pos-:id', function(req, res) {
  // let grammar = fs.readJsonSync(app.Config.dir.assets+'/grammar/partsofspeech.json');
  let grammar = fs.readJsonSync(path.join(app.Config.media,'grammar','partsofspeech.json'));
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
routes.get('/', function(req, res) {
  let grammar = fs.readJsonSync(path.join(app.Config.media,'grammar','partsofspeech.json'));
  res.render('grammar', {title:grammar.context.name,description:grammar.context.desc, keywords:Object.keys(grammar.pos).join(','), grammar:grammar});
  // res.send(grammar);
});

module.exports = routes;