const app = require('..');
const {glossary} = app.Config;
const thesaurus = require("thesaurus");
const notation = require('myanmar-notation');

const {table,docket,makeup,fileName,chat} = require("./dictionary.Config");

const fromJSON = async function(word,_watchData){
  // await docket.get(glossary.word,_watchData);
  await docket.get(fileName.word('en'),_watchData);
  await docket.get(glossary.sense,_watchData);
  await docket.get(glossary.usage,_watchData);

  var raw = docket.data.en.filter(e=> chat.compare(word,e.v));
  if (raw.length){
    return docket.data.sense.filter(
      o => raw.find(e=> e.w == o.w)
    ).map(function(o){
      var row = {};
      row.pos = app.Config.synset[o.t].name;
      row.term = raw.find(e=> e.w == o.w).v;
      row.v = makeup.sense(o.v);
      row.type = 'meaning';
      var exam = docket.data.usage.filter(m=> m.i == o.i).map(y=>makeup.exam(y.v));
      row.exam = [].concat.apply([], exam);
      return row;
    });
  }
  return [];
}

const fromMySQL = async function(word){
  // strSpaces
  // REPLACE(word,' ','')
  // \s-?!,.
  // REPLACE(REPLACE(word,' ',''),'hello','hi')
  // console.log('sql',word)
  var raw = await app.sql.query("SELECT word AS term, tid AS pos, sense AS v,exam FROM ?? WHERE LOWER(word) LIKE LOWER(?) ORDER BY tid, seq;",[table.senses,word]);
  if (raw.length){
    return raw.map(function(o){
      o.pos = app.Config.synset[o.pos].name;
      o.v = makeup.sense(o.v);
      o.type = 'meaning';
      o.exam = o.exam?makeup.exam(o.exam):[];
      return (({ term,v, pos, type, exam }) => ({ term,v, pos, type, exam }))(o);
    });
  }
  return [];
}

const wordThesaurus = function(keyword,sensitive=false){
  var row = thesaurus.find(keyword.toLowerCase());
  if (row.length) {
    var okey = true;
    // us uk goat man?
    if (sensitive && row.find(e=>e == keyword) == null) {
      okey = false;
    }

    if (okey) {
      return {
        term:keyword,
        type:'suggestion',
        pos:'thesaurus',
        kind:['odd'],
        v:row
      };
    }
  }
  return null;
}

const wordNumber = function(keyword){
  var rowNotation = notation.get(keyword);
  if (rowNotation.number) {
    return {
      term: keyword,
      type: 'meaning',
      pos: 'Number',
      kind:['notation'],
      v:rowNotation.number,
      exam:rowNotation.notation.map(e=>e.sense)
    };
  }
  return null;
}

// const wordCategory = function(raw,arr){
//   // term.replace(/\[.*\]/g, ''),
//   utility.arrays.category(arr, o => o.term).forEach((row,term) => {
//     var data = {word: term,clue:{}};
//     utility.arrays.category(row, o => o.type).forEach((row,type) => {
//       data.clue[type]=utility.arrays.group(row, 'pos',true);
//     });
//     raw.push(data)
//   });
// }

module.exports = {fromJSON,fromMySQL,wordThesaurus,wordNumber};
