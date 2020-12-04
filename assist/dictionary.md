# Dictionary

Usages...

```js
const app = require('..');
const {glossary,dictionaries} = app.Config;
const fs = require('fs');
// const util = require('util');
const path = require('path');
const {utility,Burglish} = app.Common;

const table={ senses:'senses', grammar:'wordtype', other:'ord_0', words:'words', derives:'derives'};


// var folder = 'glossary';
glossary.word = path.join(app.Config.media,'glossary',glossary.word);
glossary.sense = path.join(app.Config.media,'glossary',glossary.sense);
glossary.usage = path.join(app.Config.media,'glossary',glossary.usage);
glossary.grammar = path.join(app.Config.media,'glossary',glossary.grammar);
glossary.synset = path.join(app.Config.media,'glossary',glossary.synset);
glossary.synmap = path.join(app.Config.media,'glossary',glossary.synmap);

// getJSON,  writeJSON, readJSON watchJSON  dataJSON,
const dataJSON={};
const writeJSON = async (file,raw) => await fs.promises.writeFile(file, JSON.stringify(raw,null,0)).then(()=>true).catch(()=>false);
const readJSON = async (file) => await fs.promises.readFile(file).then(e=>JSON.parse(e)).catch(()=>[]);
const watchJSON = (file,id) => fs.watchFile(file, async () => dataJSON[id]=await readJSON(file));

async function getJSON(file,watch){
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


const formatExam = (exam) => {
  // return exam;
  return exam.replace(/<b>(.*?)<\/b>/g, function(s,t) {

  }).replace(/\[(.*?)\]/g, function(s,t) {
    let e = t.split(':');
    if (e.length > 1) {
      return e[1].split('/').map(function(word){
        // return '<a href="definition?q=*">*</a>'.replace(/\*/g,word);
        // li!= eg.replace(/\{-(.*?)\-}/g, '<a href="definition?q=$1">$1</a>')
        return '{-*-}'.replace(/\*/g,word);
      }).join('/');
    } else {
      return s;
    }
  }).split("\r\n").map(e=>e.trim());
};

const getLangDefault = dictionaries.map(
  continental => continental.lang.filter(
    lang => lang.hasOwnProperty('default')
  )
).reduce((prev, next) => prev.concat(next),[]).find(l=>l.id);

const getWordFile = (lang) => glossary.word.replace('en',lang);
const hasWordMatch = (s,t) => s.toLowerCase() == t.toLowerCase();

// getJSON(glossary.word,true);
// getJSON(glossary.sense,true);
// getJSON(glossary.usage,true);
// getJSON(glossary.grammar,true);


exports.getLangDefault = getLangDefault;
exports.getLangByName = (e) => dictionaries.map(
  continental => continental.lang.filter(
    lang => new RegExp(e, 'i').test(lang.name)
  )
).reduce((prev, next) => prev.concat(next),[]).find(l=>l.id);
exports.getLangById = (e) => dictionaries.map(
  continental => continental.lang.filter(
    lang => lang.id == e
  )
).reduce((prev, next) => prev.concat(next),[]).find(l=>l.id);

exports.getLangList = dictionaries;
exports.getLangCount = dictionaries.map(continental => continental.lang.length).reduce((a, b) => a + b,0);
// exports.getLangCount = Object.keys(dictionaries_delete).map(continental => Object.keys(dictionaries_delete[continental]).length).reduce((a, b) => a + b,0);)

// exports.word = (keyword) => dataJSON.en.filter(e=>e.v.toLowerCase().startsWith(keyword.toLowerCase())).map(e=>e.v).slice(0,10);
exports.word = (q,l=getLangDefault.id) => getJSON(getWordFile(l)).then(e=>e.filter(e=>e.v.toLowerCase().startsWith(q.toLowerCase())).map(e=>e.v).slice(0,10)).catch(()=>[]);
exports.wordFind = (q,l=getLangDefault.id) => getJSON(getWordFile(l)).then(e=>e.find(e=>e.v.toLowerCase() == q.toLowerCase())).catch(()=>'');

// NOTE: definition
exports.getGrammar = async () => await getJSON(glossary.grammar,true);

exports.definition = async function(keyword){
  await getJSON(glossary.word,true);
  await getJSON(glossary.sense,true);
  await getJSON(glossary.usage,true);
  await getJSON(glossary.grammar,true);

  var result = null;
  var word = dataJSON.en.find(e=> hasWordMatch(keyword,e.v));
  if (word){
    var row = dataJSON.sense.filter(d=> d.w == word.w).map(function(d){
      d.pos = dataJSON.grammar.find(m=> m.i == d.t).v;
      var exam = dataJSON.usage.filter(m=> m.i == d.i).map(y=>formatExam(y.v));
      d.exam = [].concat.apply([], exam);
      return d;
    });
    result = utility.arrays.group(row, 'pos');
  }
  // writeJSON(path.join(app.Config.media,folder,'delete_result.json'),result); return `result for: ${keyword} written in file`;
  return result;
}

// NOTE: translation
exports.translation = async function(keyword,lang=getLangDefault.id){
  var result = [];
  if (lang == getLangDefault.id) return result;
  const raw = await getJSON(getWordFile(lang));

  raw.filter(e=> hasWordMatch(keyword,e.v)).forEach(function(w){
    var i = result.findIndex(e=>e.hasOwnProperty('v') && hasWordMatch(w.v,e.v)), src = w.e.split(',');
    if (i >= 0){
      result[i].e = utility.arrays.unique(result[i].e.concat(src));
    } else {
      result.push({v:w.v,e:utility.arrays.unique(src)})
    }
  });
  return result;
}
/*
SELECT * FROM ?? AS d INNER JOIN ?? AS w ON w.id = d.word_id WHERE d.derive LIKE ? AND d.word_type < 10;
SELECT id AS w, word AS v, derived AS d FROM ??;
SELECT word_id AS w, derive AS v, derive_type AS k, word_type AS t FROM ??;
*/

exports.wordBase = async function(word){
  var result = {};
  const synset = await getJSON(glossary.synset);
  const synmap = await getJSON(glossary.synmap);

  result.pos = synmap.filter(
    s=>hasWordMatch(s.v,word) && s.t < 10 && synset.filter(m=>m.w == s.w).length
  );

  result.root = result.pos.map(
    e=>synset.find(s=>s.w == e.w)
  ).map(e=>e.v).filter((v, i, a) => a.indexOf(v) === i);

  return result;
}

exports.wordPos = async function(word){
  var result = {};
  const synset = await getJSON(glossary.synset);
  const synmap = await getJSON(glossary.synmap);

  result.root = synset.filter(
    s=>hasWordMatch(s.v,word)
  );

  result.pos = synmap.filter(
    m=> m.d > 0 && result.root.filter(e=>e.w == m.w).length
  );

  return result;
}


// NOTE: Admin works
/*
const getWordPos = (w) => app.sql.query("SELECT * FROM ?? AS w JOIN ?? AS d ON d.word_id = w.id WHERE w.word LIKE ?;",[table.words,table.derives,w]);
const getWordRoot = (w) => app.sql.query("SELECT * FROM ?? AS d INNER JOIN ?? AS w ON w.id = d.word_id WHERE d.derive LIKE ? AND d.word_type < 10;", [table.derives,table.words,w]); // AND d.derive_type > 0
const getWordDef = (w) => app.sql.query("SELECT * FROM ?? AS s INNER JOIN ?? AS t ON t.word_type = s.tid WHERE s.word LIKE ? ORDER BY s.tid, s.seq;", [table.senses,table.grammar,w]);

exports.freshdata = async function(word){
  var start = utility.timeCheck();
  var result={};
  var defs=[];

  var rawBase = await getWordRoot(word);
  if (rawBase.length){
    // console.log('based')
    result.type='based';
    result.ord=rawBase;
  } else {
    // Noun: singular to plural
    // Verb: tense, transitivity
    // Adjective:
    var rawPos = await getWordPos(word);
    if (rawPos.length){
      result.type='pos';
      result.ord=rawPos;
    } else {
      // var rawWord = await getWordPos(word);
      result.type='exist?';
      // result.ord=rawWord;
    }
  }

  result.def = await getWordDef(word);

  // var rawDef = await getWordDef(word);
  // if (rawDef.length) {
  //   // result.def=rawDef;
  //   defs.push(rawDef)
  //   result.def=defs;
  // } else {
  //   var rawBase = await getWordRoot(word);
  //   if (rawBase.length){
  //     result.type='based';
  //     var words =utility.arrays.unique(rawBase.map(e=>e.word));
  //     result.ord=rawBase;
  //     for (const word of words) {
  //       var rawDef = await getWordDef(word);
  //       if (rawDef.length) {
  //         defs.push(rawDef)
  //       }
  //     }
  //     result.def=defs;
  //   } else {
  //     var rawPos = await getWordPos(word);
  //     if (rawPos.length){
  //       result.type='pos';
  //       result.ord=rawPos;
  //     } else {
  //       // var rawWord = await getWordPos(word);
  //       result.type='exist?';
  //       // result.ord=rawWord;
  //     }
  //   }
  // }
  var end = utility.timeCheck(start)
  console.info('Execution time: %dms', end);
  return result;
}
*/

// NOTE: admin
exports.exportXXX = async function(){
  // id AS w, word AS v, derived AS d  LIMIT 10;
  // await app.sql.query("SELECT id AS w, word AS v FROM ??;",[table.words]).then(
  //   async raw=>{
  //     await writeJSON(glossary.synset,raw);
  //     // await writeJSON('./test/words.json',raw);
  //     console.info('words->synset',raw.length)
  //   }
  // ).catch(
  //   e=>console.error(e)
  // );
  // await app.sql.query("SELECT word_id AS w, derive AS v, derive_type AS d, word_type AS t FROM ??;",[table.derives]).then(
  //   async raw=>{
  //     // await writeJSON('./test/derives.json',raw);
  //     await writeJSON(glossary.synmap,raw);
  //     console.info('derives->synmap',raw.length)
  //   }
  // ).catch(
  //   e=>console.error(e)
  // );
  throw '...needed to enabled manually';
}
exports.exportDefinition = async function(){
  await app.sql.query('SELECT wid AS w, word AS v FROM ?? GROUP BY wid ORDER BY word ASC;',[table.senses]).then(
    raw=>{
      writeJSON(glossary.word,raw);
      console.log('word',raw.length)
    }
  ).catch(
    e=>console.error(e)
  );
  await app.sql.query('SELECT id AS i, wid AS w, tid AS t, sense AS v FROM ?? WHERE sense IS NOT NULL',[table.senses]).then(
    raw=>{
      writeJSON(glossary.sense,raw);
      console.log('sense',raw.length)
    }
  ).catch(
    e=>console.error(e)
  );
  await app.sql.query("SELECT id AS i, exam AS v FROM ?? WHERE exam IS NOT NULL AND exam <> '';",[table.senses]).then(
    raw=>{
      writeJSON(glossary.usage,raw);
      console.log('example',raw.length)
    }
  ).catch(
    e=>console.error(e)
  );
  await app.sql.query("SELECT id AS i, name AS v FROM ?? WHERE name IS NOT NULL;",[table.grammar]).then(
    async raw=>{
      await writeJSON(glossary.grammar,raw);
      console.log('grammar',raw.length);
    }
  ).catch(
    e=>console.error(e)
  );
}

// NOTE: admin words
exports.exportWord = async function(e){
  for (const continental of dictionaries) {
    for (const lang of continental.lang) {
      if (!lang.hasOwnProperty('default')) {
        await app.sql.query("SELECT word AS v, sense AS e FROM ?? WHERE word IS NOT NULL AND sense IS NOT NULL AND sense <> '';",[table.other.replace(0,lang.id)]).then(
          raw=>{
            writeJSON(getWordFile(lang.id),raw);
            console.info('done',lang.id,raw.length)
          }
        ).catch(
          e=>console.error(e)
        );
      } else {
        console.info('skip',lang.id)
      }
    }
  }
  return Object.keys(dataJSON).length;

}