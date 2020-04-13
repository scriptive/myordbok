// NOTE: Please mind the reserved keywords (sql,mongo,Config,args,etc) in module.exports
// node command myordbok
// node run myordbok test
// node run  myordbok
// npm run myordbok
const scriptive = require("@scriptive/evh");
module.exports = scriptive;
scriptive.command().then(
  e => {
    if (e) console.log('>',e);
  }
).catch(
  e => {
    console.error('!',e)
  }
).finally (process.exit);
// process.argv.splice(2),__dirname
