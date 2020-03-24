const app = require('..');
const {glossary,dictionaries} = app.Config;
const fs = require('fs');
// const util = require('util');
const path = require('path');
const {utility,readFilePromise,writeFilePromise} = app.Common;

const table={ senses:'senses', other:'ord_0', synset:'words', synmap:'derives'};

glossary.word = path.join(app.Config.media,'glossary',glossary.word);
glossary.sense = path.join(app.Config.media,'glossary',glossary.sense);
glossary.usage = path.join(app.Config.media,'glossary',glossary.usage);
glossary.synset = path.join(app.Config.media,'glossary',glossary.synset);
glossary.synmap = path.join(app.Config.media,'glossary',glossary.synmap);
glossary.zero = path.join(app.Config.media,'glossary',glossary.zero);
glossary.info = path.join(app.Config.media,'glossary',glossary.info);

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
const formatLink = (str) => {
  return str.replace(/\[(.*?)\]/g, function(s,t) {
    var [name,e] = t.split(':');
    // NOTE: [also:creative]
    if (e) {
      var links = e.split('/').map((word) => '{-*-}'.replace(/\*/g,word)).join(', ');
      if (name == 'list'){
        return links;
      } else {
        return '0 1'.replace(0,name).replace(1,links);
      }
    } else {
      return s;
    }
  });
}
const formatUsage = (exam) => formatLink(exam).split("\r\n").map(e=>e.trim());

const formatSense = (str) => formatLink(str);

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
exports.word = async (q,l=getLangDefault.id) => await getJSON(getWordFile(l)).then(e=>e.filter(e=>e.v.toLowerCase().startsWith(q.toLowerCase())).map(e=>e.v).slice(0,10)).catch(()=>[]);
exports.wordFind = (q,l=getLangDefault.id) => getJSON(getWordFile(l)).then(e=>e.find(e=>e.v.toLowerCase() == q.toLowerCase())).catch(()=>'');

exports.getGrammar = () => app.Config.synset.map((v,index) => ({id:index,name:v}));

// NOTE: translation
exports.translation = async function(keyword,lang=getLangDefault.id){
  var raw = [];
  if (lang == getLangDefault.id) return raw;
  const row = await getJSON(getWordFile(lang));

  row.filter(e=> hasWordMatch(keyword,e.v)).forEach(function(w){
    var i = raw.findIndex(e=>e.hasOwnProperty('v') && hasWordMatch(w.v,e.v)), src = w.e.split(',');
    if (i >= 0){
      raw[i].e = utility.arrays.unique(raw[i].e.concat(src));
    } else {
      raw.push({v:w.v,e:utility.arrays.unique(src)})
    }
  });
  return raw;
}

// NOTE: save
exports.save = async function(keyword,lang){
  var addWord = true;
  var file = glossary.zero.replace('0',lang);//.replace(/(csv)$/,'tmp.$1');
  keyword = keyword.replace(/\W/g, '').toLowerCase();
  function write(){
    var createStream = fs.createWriteStream(file,{flags:'a',encoding:'utf8'});
    createStream.write(keyword);
    createStream.write('\n');
    createStream.end();
  }
  function read(){
    return require('readline').createInterface({
      input: fs.createReadStream(file)
    });
  }

  fs.access(file, (e) => {
    if (e) {
      write();
    } else {
      var reader = read();
      reader.on('line', (word) => {
        if (word == keyword){
          addWord = false;
          reader.close();
          reader.removeAllListeners();
        }
      }).on('close', () => {
        if (addWord) write();
      });
    }
  });
}

// NOTE: info
exports.getInfo = async function(res){
  // glossary.info
  // return 'Ok'
  // return glossary.info.replace('0',lang);
  // async (file) => await readFilePromise(file).then(e=>JSON.parse(e)).catch(()=>[]);
  return await readFilePromise(glossary.info.replace('0',res.sol.id)).then(e=>JSON.parse(e)).catch(()=>new Object());

}

async function wordMeanJSON(word,_watchData){
  await getJSON(glossary.word,_watchData);
  await getJSON(glossary.sense,_watchData);
  await getJSON(glossary.usage,_watchData);

  var raw = dataJSON.en.find(e=> hasWordMatch(word,e.v));
  if (raw){
    return dataJSON.sense.filter(d=> d.w == raw.w).map(function(d){
      d.pos = app.Config.synset[d.t];
      var exam = dataJSON.usage.filter(m=> m.i == d.i).map(y=>formatUsage(y.v));
      d.exam = [].concat.apply([], exam);
      return (({ v, pos, exam }) => ({ v, pos, exam }))(d);
    });
    // return utility.arrays.group(row, 'pos',true);
  }
  return null;
}
async function wordMeanMySQL(word){
  var raw = await app.sql.query("SELECT word AS w, tid AS pos, sense AS v,exam FROM ?? WHERE word LIKE ? ORDER BY tid, seq;",[table.senses,word]);
  if (raw.length){
    return raw.map(function(d){
      d.pos = app.Config.synset[d.pos];
      d.v = formatSense(d.v);
      if (d.exam) {
        d.exam = formatUsage(d.exam);
      } else {
        d.exam = [];
      }
      return (({ v, pos, exam }) => ({ v, pos, exam }))(d);
    });
    // return utility.arrays.group(row, 'pos',true);
  }
  return null;
}

// NOTE: definition
exports.definition = async function(word){
  // OPTION: app.Config.development, app.Config.mysqlConnection
  try {
    if (app.Config.mysqlConnection){
      return await wordMeanMySQL(word);
    } else {
      return await wordMeanJSON(word,false);
    }
  } catch (error) {
    return null;
  }
}

exports.wordBase = async function(word){
  var result = {
    // root, pos, form
    form:[]
  };
  const synset = await getJSON(glossary.synset);
  const synmap = await getJSON(glossary.synmap);

  result.pos = synmap.filter(
    s => hasWordMatch(s.v,word) && s.t < 10 && synset.filter(e=>e.w == s.w).length
  );

  var form = utility.arrays.group(result.pos, 't');
  for (const id in form) {
    if (form.hasOwnProperty(id)) {
      var row = {};
      row.pos = app.Config.synset[id];
      row.v = form[id].map(
        e => '~ {-*-} (?)'.replace('*',e.v).replace('?',app.Config.synmap.find(i=> i.id == e.d).name)
      ).join('; ');
      row.exam=[];
      result.form.push(row)
    }
  }

  result.root =  result.pos.map(
    e => synset.find(s=>s.w == e.w)
  ).map(e=>e.v).filter((v, i, a) => a.indexOf(v) === i);
  return result;
}

exports.wordPos = async function(word){
  var result = {
    // root, pos, form
    form:[]
  };

  const synset = await getJSON(glossary.synset);
  const synmap = await getJSON(glossary.synmap);

  var root = synset.filter(
    s => hasWordMatch(s.v,word)
  );

  result.pos = synmap.filter(
    m => m.d > 0 && root.filter(e=>e.w == m.w).length
  );

  var form = utility.arrays.group(result.pos, 't');
  for (const id in form) {
    if (form.hasOwnProperty(id)) {
      var row = {};
      row.pos = app.Config.synset[id];
      row.v = form[id].map(
        e => '~ {-*-} (?)'.replace('*',e.v).replace('?',app.Config.synmap.find(i=> i.id == e.d).name)
      ).join('; ');
      row.exam=[];
      result.form.push(row)
    }
  }
  result.root = root.map(e=>e.v).filter((v, i, a) => a.indexOf(v) === i);
  return result;
}

// NOTE: admin
exports.exportWord = async function(){
  // id AS w, word AS v, derived AS d  LIMIT 10;
  throw '...needed to enable manually';
  // await app.sql.query("SELECT id AS w, word AS v FROM ??;",[table.synset]).then(
  //   async raw=>{
  //     await writeJSON(glossary.synset,raw);
  //     // await writeJSON('./test/words.json',raw);
  //     console.info('words->synset',raw.length)
  //   }
  // ).catch(
  //   e=>console.error(e)
  // );
  // await app.sql.query("SELECT word_id AS w, derive AS v, derive_type AS d, word_type AS t FROM ??;",[table.synmap]).then(
  //   async raw=>{
  //     // await writeJSON('./test/derives.json',raw);
  //     await writeJSON(glossary.synmap,raw);
  //     console.info('derives->synmap',raw.length)
  //   }
  // ).catch(
  //   e=>console.error(e)
  // );
}

exports.exportDefinition = async function(){
  // NOTE: reset wid
  await app.sql.query('UPDATE ?? AS o INNER JOIN (select id,word from ?? GROUP BY word ) AS i ON o.word = i.word SET o.wid = i.id;',[table.senses,table.senses]).then(
    ()=>{
      console.log('reset wid')
    }
  ).catch(
    e=>console.error(e)
  );
  await app.sql.query('SELECT wid AS w, word AS v FROM ?? GROUP BY wid ORDER BY word ASC;',[table.senses]).then(
    async raw=>{
      await writeJSON(glossary.word,raw);
      console.log('en(word):',raw.length)
    }
  ).catch(
    e=>console.error(e)
  );
  await app.sql.query('SELECT id AS i, wid AS w, tid AS t, sense AS v FROM ?? WHERE sense IS NOT NULL',[table.senses]).then(
    async raw=>{
      await writeJSON(glossary.sense,raw);
      console.log('sense:',raw.length)
    }
  ).catch(
    e=>console.error(e)
  );
  await app.sql.query("SELECT id AS i, exam AS v FROM ?? WHERE exam IS NOT NULL AND exam <> '';",[table.senses]).then(
    async raw=>{
      await writeJSON(glossary.usage,raw);
      console.log('usage:',raw.length)
    }
  ).catch(
    e=>console.error(e)
  );
}

exports.exportTranslation = async function(e){
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