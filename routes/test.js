const app = require('..');
const routes = app.Router();

routes.get('/', function(req, res) {
  // res.setHeader('Content-Type', 'application/event-stream')
  res.setHeader('Content-Type', 'text/event-stream')
  // res.setHeader('Cache-Control', 'no-cache')

  // send a ping approx every 2 seconds
  var timer = setInterval(function () {
    res.write(JSON.stringify({count:1}))

    // !!! this is the important part
    res.flush()
  }, 2000)

  res.on('close', function () {
    console.log('close')
    clearInterval(timer)
  })
});
/*
routes.get('/mongo', (req, res, next) => {
  app.mongo.collection('documents').find({}).toArray(function(err,doc) {
    console.log(doc)
  });
  console.log(app)
  app.mongo.db.collection('documents').find({}).toArray(function(err,doc) {
    res.send(doc)
  });
  app.mongo.db().then(e=>{
    e.collection('documents').find({}).toArray(function(err,doc) {
      res.send(doc)
    });
  })
});
*/

module.exports = routes;