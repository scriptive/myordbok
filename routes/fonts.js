/**
* NOTE: scan-secondary?font=KANNAKA_.TTF
* scan-external -> scan-{type}
* type -> primary, external, secondary
* $fontName -> add or remove from restriction
*/
// gsutil cp -r gs://storage.lethil.me/media/fonts
// gsutil cp -r gs://storage.lethil.me/media/fonts .
// gsutil -r gs://storage.lethil.me/media/fonts

const app = require('../');
const fs = require('fs');
const routes = app.Router();
const fonts = require('../assist/fonts');

routes.get('/scan-:type', function(req, res, next) {
  var fontType = req.params.type;
  var fontName = req.query.font;
  new fonts(fontType).scan(fontName).then(function(e){
    res.send(e);
  });
});

routes.get('/download/:type', function(req, res, next) {
  var fontType = req.params.type;
  var fontName = req.query.font;
  new fonts(fontType).download(fontName).then(function(file){
    if (file){
      fs.exists(file,function(exists){
        if(exists){
          res.setHeader('Content-disposition', 'attachment; filename=' + fontName);
          res.setHeader('Content-Type', 'application')
          fs.createReadStream(file).pipe(res);
        } else {
          res.status(500).end();
        }
      });
    } else {
      res.status(500).end();
    }
  }).catch(function(){
    res.status(404).end();
  });
});

routes.get('/:type?', async function(req, res, next) {
  var fontType = req.params.type;
  var fontName = req.query.font;
  var context = {title:'Myanmar fonts',description:'Myanmar Unicode and fonts',keywords:'Myanmar fonts'};
  var o = new fonts(fontType);

  await o.view(fontName).then(function(e){
    if (e instanceof Object){
      context = e;
      if (e.unrestrict){
        context.type=fontType;
        context.download=fontName;
      }
    }
  });
  context.secondary = await o.read('secondary');
  context.external = await o.read('external');
  res.render('fonts', context);
});

module.exports = routes;