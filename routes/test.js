const app = require('../');
const routes = app.Router();
const {visits} = require('./classUtilities');

var url = require('url');

routes.get('/', function(req, res, next) {
  // res.send(url.parse(req.url));
  // res.send();
  res.send({working:true});
  // new visits(req.ip).init(res.locals).then(function(){
  //   res.send(res.locals);
  // })
});
routes.get('/test', function(req, res, next) {
  // res.send('respond zaideih with a resource');
  app.sql.query('SELECT * FROM ?? WHERE ip LIKE ? ORDER BY ip ASC',['visits','127.0.0.1']).then(raw=>{
    if (raw.length > 0) {
      console.log(raw);
    }
    res.send('respond zaideih with a resource');
  });
});

module.exports = routes;