const update = require("@scriptive/evh/upgrade");

update('test/_tmp').then(
  e=>console.log('>',e)
).catch(
  e=>console.log('>',e)
)