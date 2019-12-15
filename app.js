const scriptive = require("@scriptive/evh");
module.exports = scriptive;
scriptive.server().then(
  e=> {
    if (e) console.log(`> ${e.name} *:${e.port}`);
  }
).catch(
  e=> {
    if (e) console.error(e)
  }
);