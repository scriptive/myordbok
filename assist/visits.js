const app = require('..');
const path = require('path');
const fs = require('fs');
const {media,visits} = app.Config;

visits.log = path.join(media,'log','myordbok.visits.log');
module.exports = function() {
  if (!visits.create) {
    if (fs.existsSync(visits.log)){
      var log = fs.readFileSync(visits.log).toString().split('\n').filter(e=>e).map(e=>e.split(' '));
      const [created,user,request,by,total] = new Set([].concat.apply([], log));
      visits.created = new Date(created*1000).toISOString().slice(0,10).replace(/-/g,"/");
      visits.user = user.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
      visits.request = request.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
      visits.by = by.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
      visits.total = total.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    }
  }
  return visits;
}
// // module.exports.created = new Date();
// module.exports.created = new Date().toISOString().slice(0,10).replace(/-/g,"/");
// module.exports.total = () => visitsPrevious().toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
// module.exports.counts = () => visits.counts;
// module.exports.restart = () => visits.restart;
// module.exports.testing = () => visitsTerminal();

// new Date(1577105824*1000);
// function visitsPrevious() {
//   if (visits.previous <= 0) {
//     if (fs.existsSync(visits.log)){
//       var log = fs.readFileSync(visits.log).toString().split('\r\n').filter(e=>e);
//       visits.previous = log.map(e=>parseInt(e.split(':')[1])).reduce((a, b) => a + b, 0);
//       visits.restart = log.length;
//     } else {
//       visits.log = null;
//       visits.previous = 1;
//     }
//   }
//   return visits.counts + visits.previous;
// }