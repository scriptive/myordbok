const app = require('..');
// const dictionary = require('./dictionary');
const wordbreak = require('./wordbreak/');
const search = require('./search');
// const {glossary,dictionaries} = app.Config;
// const fs = require('fs');
// const util = require('util');
const path = require('path');
const {utility,readFilePromise,writeFilePromise} = app.Common;

const dataJSON={
  all:[],
  result:[]
};
const readJSON = async (file) => await readFilePromise(file).then(e=>JSON.parse(e)).catch(()=>[]);
const writeJSON = async (file,raw) => await writeFilePromise(file, JSON.stringify(raw,null,2)).then(()=>true).catch(()=>false);

const wordJSONAll = path.join(app.Config.media,'log','myordbok.word-all.json');
const wordJSONTodo = path.join(app.Config.media,'log','myordbok.word-todo.json');
const wordJSONResult = path.join(app.Config.media,'log','myordbok.word-break-result.json');

const searching = async function() {
  const word = dataJSON.all.shift();
  // var status = await dictionary.definition(word) == null;
  const result = await search(word)
  const status = result && result.data.length;


  // process.stdout.write('num:@ '.replace('num',dataJSON.all.length).replace('@',word));
  // return abc;
  console.log(dataJSON.all.length, word, status)
  if (status < 1) {
    dataJSON.result.push(word);
    await writeJSON(wordJSONTodo,dataJSON.result);
  }
  if (dataJSON.all.length){
    await searching();
  } else {
    return dataJSON.result;
  }
}


exports.definition = async function(word){
  var file = path.join(app.Config.media,'test','_definition_result.json');
  dataJSON.result = await search(word);
  await writeJSON(file,dataJSON.result);
  return file;
}
exports.keyword = async function(e){
  var data = await readJSON(wordJSONAll);
  dataJSON.all = data.filter(w=>!/\s/.test(w) && !/\d/.test(w));
  // return dataJSON.all.length;
  // dataJSON.all = data.slice(0,50);
  console.log('Word:',dataJSON.all.length,'\r')
  await searching();
  await writeJSON(wordJSONTodo,dataJSON.result);
  console.log('\nTodo:',dataJSON.result.length)
}


const wordbreakProcess = async function() {
  const word = dataJSON.all.shift();
  const result = wordbreak(word);
  const status = result.length > 1;

  console.log(dataJSON.all.length, word, status)
  if (status) {
    var abc = (e) => e.s?'(?)'.replace('?',e.s):'';
    var tmp = [word].concat(result.map(e=>'*?'.replace('*',e.w).replace('?',abc(e))));
    dataJSON.result.push(tmp.join(', '));
    await writeJSON(wordJSONResult,dataJSON.result);
  }
  if (dataJSON.all.length){
    await wordbreakProcess();
  } else {
    return dataJSON.result;
  }
}

exports.wordbreak = async function(e){
  dataJSON.all = await readJSON(wordJSONTodo);
  // dataJSON.result = dataJSON.all.filter(w=>!/\s/.test(w) && !/\d/.test(w));
  // dataJSON.result = dataJSON.all.map(e=>wordbreak(e)).filter(e=>e.length>1);
  // return dataJSON.all.length;
  dataJSON.all = dataJSON.all.slice(2000,3000);
  // console.log('Word:',dataJSON.all.length,'\r')
  await wordbreakProcess();
  // await writeJSON(wordJSONResult,dataJSON.result);
  console.log('\nTodo:',dataJSON.result.length)
}