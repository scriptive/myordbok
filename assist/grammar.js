const app = require('..');
const path = require('path');
const {media} = app.Config;
const {readFilePromise} = app.Common;
const file = path.join(media,'grammar','partsofspeech.json');
module.exports = async () => await readFilePromise(file).then(JSON.parse).catch(()=>{});
