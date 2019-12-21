const app = require('..');
const path = require('path');
const fs = require('fs');
const {media,visits} = app.Config;

visits.log = path.join(media,'log','myordbok-visits.log');
visits.restart = 0;
function visitsPrevious() {
  if (visits.previous <= 0) {
    if (fs.existsSync(visits.log)){
      var log = fs.readFileSync(visits.log).toString().split('\r\n').filter(e=>e);
      visits.previous = log.map(e=>parseInt(e.split(':')[1])).reduce((a, b) => a + b, 0);
      visits.restart = log.length;
    } else {
      visits.log = null;
      visits.previous = 1;
    }
  }
  return visits.counts + visits.previous;
}
// module.exports.created = new Date();
module.exports.created = new Date().toISOString().slice(0,10).replace(/-/g,"/");
module.exports.total = () => visitsPrevious().toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
module.exports.counts = () => visits.counts;
module.exports.restart = () => visits.restart;
