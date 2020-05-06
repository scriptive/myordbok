const app = require('..');
const {glossary,dictionaries} = app.Config;

const fs = require('fs');
// const util = require('util');
const path = require('path');

const {readFilePromise,writeFilePromise} = app.Common;

const table = { senses:'senses', other:'ord_0', synset:'words', synmap:'derives'};

glossary.word = path.join(app.Config.media,'glossary',glossary.word);
glossary.sense = path.join(app.Config.media,'glossary',glossary.sense);
glossary.usage = path.join(app.Config.media,'glossary',glossary.usage);
glossary.synset = path.join(app.Config.media,'glossary',glossary.synset);
glossary.synmap = path.join(app.Config.media,'glossary',glossary.synmap);
glossary.zero = path.join(app.Config.media,'glossary',glossary.zero);
glossary.info = path.join(app.Config.media,'glossary',glossary.info);

// getJSON,  writeJSON, readJSON watchJSON  dataJSON,
var dataJSON={};

const writeJSON = async (file,raw,ind=0) => await writeFilePromise(file, JSON.stringify(raw,null,ind)).then(()=>true).catch(()=>false);
const readJSON = async (file) => await readFilePromise(file).then(e=>JSON.parse(e)).catch(()=>[]);
const watchJSON = (file,id) => fs.watchFile(file, async () => dataJSON[id]=await readJSON(file));

const getJSON = async function(file,watch){
  var id = path.parse(file).name;
  if (dataJSON.hasOwnProperty(id)){
    return dataJSON[id];
  } else if (fs.existsSync(file)) {
    dataJSON[id] = await readJSON(file);
    if (watch) watchJSON(file,id);
    return dataJSON[id];
  } else {
    return [];
  }
}
// json: Read, Write, and Watch
const docket = {
  write: writeJSON,
  read: readJSON,
  watch: watchJSON,
  get: getJSON,
  data:dataJSON
};

const _Link = (str) => {
  return str.replace(/\[(.*?)\]/g, function(s,t) {
    var [name,e] = t.split(':');
    // NOTE: [also:creative]
    if (e) {
      var links = e.split('/').map((word) => '{-*-}'.replace(/\*/g,word)).join(', ');
      if (name == 'list'){
        return links;
      } else {
        return '(-0-) 1'.replace(0,name).replace(1,links);
      }
    } else {
      return s;
    }
  });
}
// format definition
const makeup = {
  sense: (str) => _Link(str),
  exam: (exam) => _Link(exam).split("\r\n").map(e=>e.trim()),
};
/*
span -> a
div
p
small a
*/

const getLangDefault = dictionaries.map(
  continental => continental.lang.filter(
    lang => lang.hasOwnProperty('default')
  )
).reduce((prev, next) => prev.concat(next),[]).find(l=>l.id);

const getFileName = (file,name=getLangDefault.id) => file.replace(/EN/, name);
const getWordFile = (lang) => getFileName(glossary.word,lang);
const getInfoFile = (lang) => getFileName(glossary.info,lang);
const getZeroFile = (lang) => getFileName(glossary.zero,lang);

// filename
const fileName = {
  get:getFileName,
  word:getWordFile,
  info:getInfoFile,
  zero:getZeroFile
};


const strSpaces = (str) => str.replace(/[\s-?!,.]+/g,'').toLowerCase();
const hasWordMatch = (s,t) => strSpaces(s) == strSpaces(t);
const trimString = (str) => str.replace(/\(\s+?/g,'(').replace(/\s+?\)/g,')').replace(/\[\s+?/g,'[').replace(/\s+?\]/g,']').replace(/\t/g,' ').replace(/\s\s+/g, ' ').trim();
const upperCaseString = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

// idiom caseContext
// String format
const chat = {
  spaces:strSpaces,
  compare:hasWordMatch,
  strip:trimString,
  toUpperCaseFirst:upperCaseString
}

const getLangByName = (e) => dictionaries.map(
  continental => continental.lang.filter(
    lang => new RegExp(e, 'i').test(lang.name)
  )
).reduce((prev, next) => prev.concat(next),[]).find(l=>l.id);

const getLangById = (e) => dictionaries.map(
  continental => continental.lang.filter(
    lang => lang.id == e
  )
).reduce((prev, next) => prev.concat(next),[]).find(l=>l.id);

// exports.getLangList = dictionaries;
const getLangCount = dictionaries.map(continental => continental.lang.length).reduce((a, b) => a + b,0);

const language = {
  default:getLangDefault,
  list:dictionaries,
  count:getLangCount,
  byId:getLangById,
  byName:getLangByName,
};

const information = async (res) => await readFilePromise(fileName.info(res.sol.id)).then(e=>JSON.parse(e)).catch(()=>new Object());

module.exports = {table,docket,makeup,fileName,chat,language,information};
