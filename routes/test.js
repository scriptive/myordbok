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


module.exports = routes;