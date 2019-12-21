const upgrade = require("@scriptive/evh/upgrade");

upgrade().then(
  e=>console.log('>',e)
).catch(
  e=>console.error('>',e)
)