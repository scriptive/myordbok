const update = require("@scriptive/evh/upgrade");

update().then(
  e=>console.log('>',e)
).catch(
  e=>console.log('>',e)
)