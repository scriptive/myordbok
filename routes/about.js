var app = require('../');

let router = app.router();

router.get('/', function(req, res, next) {
  res.render('home', { title: 'About' });
});

module.exports = router;