const scriptive = require("@scriptive/evh");
module.exports = scriptive;
scriptive.server().then(
  e=> {
    if (e) console.log(e);
  }
).catch(
  e=> {
    if (e) console.error(e)
  }
);