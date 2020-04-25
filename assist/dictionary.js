const app = require('..');
// const {glossary} = app.Config;

// const fs = require('fs');
// const util = require('util');
// const path = require('path');

const {utility} = app.Common;

const {table,docket,makeup,fileName,chat,language,information} = require("./dictionary.Config");

const lID = language.default.id;
const clue = require("./dictionary.clue");
const save = require("./dictionary.save");
const partOfSpeech = require("./dictionary.pos");

// docket.get(glossary.word,true);
// docket.get(glossary.sense,true);
// docket.get(glossary.usage,true);

exports.lang = language;

exports.grammar = () => app.Config.synset.map((v,index) =>(v.id=index,v));
exports.wordFind = (q,l) => docket.get(fileName.word(l)).then(e=>e.find(e=>chat.compare(e.v,q))).catch(()=>null);

// NOTE: suggestion (api)
exports.suggestion = async (q,l) => await docket.get(fileName.word(l)).then(e=>e.filter(e=>e.v.toLowerCase().startsWith(q.toLowerCase())).map(e=>e.v).slice(0,10)).catch(()=>[]);

// NOTE: translation
exports.translation = async function(keyword,lang=lID){
  var raw = [];
  if (lang == lID) return raw;
  const row = await docket.get(fileName.word(lang));

  row.filter(e=> chat.compare(keyword,e.v)).forEach(function(w){
    var i = raw.findIndex(e=>e.hasOwnProperty('v') && chat.compare(w.v,e.v)), src = w.e.split(',');
    if (i >= 0){
      raw[i].e = utility.arrays.unique(raw[i].e.concat(src));
    } else {
      raw.push({v:w.v,e:utility.arrays.unique(src)})
    }
  });
  return raw;
}

// NOTE: definition
exports.definition = async function(word,liveData=true){
  // OPTION: app.Config.development, app.Config.mysqlConnection
  try {
    if (app.Config.mysqlConnection && liveData == true){
      return await clue.fromMySQL(word);
    } else {
      return await clue.fromJSON(word,false);
    }
  } catch (error) {
    return [];
  }
}

exports.wordCategory = function(raw,arr){
  // term.replace(/\[.*\]/g, ''),
  utility.arrays.category(arr, o => o.term).forEach((row,term) => {
    var data = {word: term,clue:{}};
    utility.arrays.category(row, o => o.type).forEach((row,type) => {
      data.clue[type]=utility.arrays.group(row, 'pos',true);
    });
    raw.push(data)
  });
}


exports.wordPos = partOfSpeech.main;
exports.wordThesaurus = clue.wordThesaurus;
exports.wordNumber = clue.wordNumber;

// NOTE: save (zero)
exports.save = save;

// NOTE: read (info)
exports.information = information;
