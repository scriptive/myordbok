var app = require('../');

let router = app.router();

router.get('/', function(req, res, next) {
  res.send('respond zaideih with a resource');
  app.sql.query('SELECT * FROM ?? WHERE ip LIKE ? ORDER BY ip ASC',['visits','127.0.0.1']).then(raw=>{
    if (raw.length > 0) {
      console.log(raw);
    }
  });
});

module.exports = router;