const app = require('..');
// var https = require('https');
var querystring = require('querystring');
const {speechUrl} = app.Config;
const {request} = app.Common;
/*
https://www.googleapis.com/language/translate/v2?
https://translate.google.com/translate_a/single?
https://translation.googleapis.com/language/translate/v2?
https://translation.googleapis.com/language/translate/v2?source=en&target=my&q=love
*/
module.exports = (query) => request(speechUrl.replace('$q',querystring.escape(query.q)).replace('$l',query.l));
// module.exports = function() {
//   https.get(url, (resp) => {
//     resp.on('data', (chunk) => {
//       res.write(chunk);
//     });
//     resp.on('end', () => {
//       res.end();
//     });
//   }).on('error', (err) => {
//     // // TODO: err.message
//     res.sendStatus(404);
//   });
// }