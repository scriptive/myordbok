const app = require('..');
const {glossary,dictionaries} = app.Config;
const fs = require('fs');
// const util = require('util');
const path = require('path');
const {utility,readFilePromise,writeFilePromise} = app.Common;

const table={ source:'en_src', grammar:'en_type', other:'0_word'};
// const readFilePromise = util.promisify(fs.readFile);
// const writeFilePromise = util.promisify(fs.writeFile);

// var folder = 'glossary';
glossary.word = path.join(app.Config.media,'glossary',glossary.word);
glossary.sense = path.join(app.Config.media,'glossary',glossary.sense);
glossary.usage = path.join(app.Config.media,'glossary',glossary.usage);
glossary.grammar = path.join(app.Config.media,'glossary',glossary.grammar);

// getJSON,  writeJSON, readJSON watchJSON  dataJSON,
const dataJSON={};
const writeJSON = async (file,raw) => await writeFilePromise(file, JSON.stringify(raw,null,0)).then(()=>true).catch(()=>false);
const readJSON = async (file) => await readFilePromise(file).then(e=>JSON.parse(e)).catch(()=>[]);
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

// exports.suggestion = (keyword) => dataJSON.en.filter(e=>e.v.toLowerCase().startsWith(keyword.toLowerCase())).map(e=>e.v).slice(0,10);
exports.suggestion = (q,l=getLangDefault.id) => getJSON(getWordFile(l)).then(e=>e.filter(e=>e.v.toLowerCase().startsWith(q.toLowerCase())).map(e=>e.v).slice(0,10)).catch(()=>[]);

// NOTE: definition
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

// NOTE: admin words
exports.exportDefinition = async function(){
  await app.sql.query('SELECT wid AS w, word AS v FROM ?? GROUP BY wid ORDER BY word ASC;',[table.source]).then(
    raw=>{
      writeJSON(glossary.word,raw);
      console.log('word',raw.length)
    }
  ).catch(
    e=>console.error(e)
  );
  await app.sql.query('SELECT id AS i, wid AS w, tid AS t, sense AS v FROM en_src WHERE sense IS NOT NULL',[table.source]).then(
    raw=>{
      writeJSON(glossary.sense,raw);
      console.log('sense',raw.length)
    }
  ).catch(
    e=>console.error(e)
  );
  await app.sql.query("SELECT id AS i, exam AS v FROM ?? WHERE exam IS NOT NULL AND exam <> '';",[table.source]).then(
    raw=>{
      writeJSON(glossary.usage,raw);
      console.log('example',raw.length)
    }
  ).catch(
    e=>console.error(e)
  );
  await app.sql.query("SELECT id AS i, name AS v FROM ?? WHERE name IS NOT NULL;",[table.grammar]).then(
    raw=>{
      writeJSON(glossary.grammar,raw);
      console.log('grammar',raw.length);
    }
  ).catch(
    e=>console.error(e)
  );
}

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
  return Object.keys(dataJSON);
}