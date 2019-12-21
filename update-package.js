const fs = require('fs');
const json = require('./package.json');

const scriptiveName = '@scriptive/evh';
// json.scripts = {};

if (json.dependencies[scriptiveName].includes("file:")){
  json.dependencies[scriptiveName] = "";
}
json.devDependencies = {};

fs.writeFileSync('./package.json',JSON.stringify(json,null,2));
console.log('>','cleaned')
