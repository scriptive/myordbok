const app = require('..');
const assist = require('../assist');
const routes = app.Router();

routes.get('/pos-:id', async function(req, res) {
  var id = req.params.id;
  var grammar = await assist.grammar();
  if (grammar.pos.hasOwnProperty(id)) {
    var pos = grammar.pos[id];
    res.render('grammar-pos', {
      title: pos.root.name,
      keywords: '0, 1'.replace(0,id).replace(1,pos.root.name),
      description: pos.root.desc,
      grammar: pos
    });
  } else {
    res.send({'pos-not-found':id});
  }
});
routes.get('/', async function(req, res) {
  var grammar = await assist.grammar();
  res.render('grammar', {
    title: grammar.context.name,
    description: grammar.context.desc,
    keywords: Object.keys(grammar.pos).join(','),
    grammar: grammar
  });
});

module.exports = routes;