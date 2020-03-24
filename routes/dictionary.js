const app = require('..');
const assist = require('../assist');
const routes = app.Router();

routes.get('/', function(req, res) {
  // req.cookies.solId
  // var abc = assist.getInfo(res.locals.sol.id);
  // console.log(abc);
  // console.log(res.locals.sol);
  // res.render('dictionary', {
  //   title: res.locals.sol.name,
  //   keywords:'0, Myanmar, dictionary'.replace(0,res.locals.sol.name),
  //   description:'0 to Myanmar dictionary'.replace(0,res.locals.sol.name),
  //   pageClass:'dictionary',
  //   dictionaries: assist.getLangList(),
  //   info: []
  // });

  assist.getInfo(res.locals).then(
    raw=>{
      res.render('dictionary', {
        title: raw.title,
        keywords:raw.keyword,
        description:raw.description,
        pageClass:'dictionary',
        dictionaries: assist.getLangList(),
        info: raw.info
      });
    }
  ).catch(
    ()=>res.status(404).end()
  )
});

module.exports = routes;