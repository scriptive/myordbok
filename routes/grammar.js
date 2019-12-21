const app = require('..');
const path = require('path');
// const {dictionaries,locale} = app.Config;
const {readFilePromise} = app.Common;
const routes = app.Router();

const getGrammar = async () => await readFilePromise(path.join(app.Config.media,'grammar','partsofspeech.json')).then(JSON.parse).catch(()=>{});
routes.get('/pos-:id', async function(req, res) {
  var id = req.params.id;
  var grammar = await getGrammar();
  if (grammar.pos.hasOwnProperty(id)) {
    res.render('grammar-pos', {title:id, grammar:grammar.pos[id]});
  } else {
    res.send({'pos-not-found':id});
  }
});
routes.get('/', async function(req, res) {
  var grammar = await getGrammar();
  res.render('grammar', {title:grammar.context.name,description:grammar.context.desc, keywords:Object.keys(grammar.pos).join(','), grammar:grammar});
});

module.exports = routes;