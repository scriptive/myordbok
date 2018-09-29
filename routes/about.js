var {express} = require.main.exports(),
    {score} = require('../score');

var router = express.Router();
router.get('/', function(req, res, next) {
  // console.log(req.baseUrl);
  // console.log('???',req.originalUrl);
  res.render('home', { title: 'aboutsss' });
});

module.exports = router;