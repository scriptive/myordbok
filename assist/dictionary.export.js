const app = require('..');
const {glossary,dictionaries} = app.Config;

// const fs = require('fs');
// const util = require('util');
// const path = require('path');

// const {utility} = app.Common;

const {table,docket,makeup,fileName,chat,language} = require("./dictionary.Config");

// NOTE: admin
exports.exportWord = async function(){
  // id AS w, word AS v, derived AS d  LIMIT 10;
  // throw '...needed to enable manually';
  await app.sql.query("SELECT id AS w, word AS v FROM ??;",[table.synset]).then(
    async raw=>{
      await docket.write(app.Config.glossary.synset,raw);
      // await docket.write('./test/words.json',raw);
      console.info('words->synset',raw.length)
    }
  ).catch(
    e=>console.error(e)
  );
  await app.sql.query("SELECT root_id AS w, word AS v, derived_type AS d, word_type AS t FROM ??;",[table.synmap]).then(
    async raw=>{
      // await docket.write('./test/derives.json',raw);
      await docket.write(app.Config.glossary.synmap,raw);
      console.info('derives->synmap',raw.length)
    }
  ).catch(
    e=>console.error(e)
  );
}

exports.exportDefinition = async function(){
  // NOTE: info record
  var infoFile = fileName.info();
  var infoRaw = await docket.read(infoFile);
  function _record_info(identity,digit){
    infoRaw.info.progress.map(
      e=> {
        if (e.id && e.id == identity){
          e.status = digit;
        }
      }
    )
  }

  // NOTE: reset wid
  // UPDATE ?? AS o INNER JOIN (select id,word from ?? GROUP BY word ) AS i ON o.word = i.word SET o.wid = i.id;
  // UPDATE ?? AS o INNER JOIN (select id,word from ?? GROUP BY word ) AS i ON o.word = i.word SET o.wid = i.id;'
  // UPDATE ?? AS o INNER JOIN (select id, word from ?? GROUP BY word COLLATE UTF8_BIN) AS i ON o.word COLLATE UTF8_BIN = i.word SET o.wid = i.id;
  await app.sql.query('UPDATE ?? AS o INNER JOIN (select id, word from ?? GROUP BY word) AS i ON o.word = i.word SET o.wid = i.id;',
    [table.senses,table.senses]
  ).then(
    ()=>{
      console.log('reset wid')
    }
  ).catch(
    e=>console.error(e)
  );
  // Change wid AS w to wid AS k
  await app.sql.query('SELECT wid AS w, word AS v FROM ?? WHERE word IS NOT NULL GROUP BY wid ORDER BY word ASC;',
    [table.senses]
  ).then(
    async raw=>{
      var _wi = fileName.word();
      await docket.write(_wi,raw);
      _record_info('word',raw.length);
      console.log('en(word):',raw.length,_wi)
    }
  ).catch(
    e=>console.error(e)
  );
  await app.sql.query('SELECT id AS i, wid AS w, tid AS t, sense AS v FROM ?? WHERE word IS NOT NULL AND sense IS NOT NULL ORDER BY tid, seq;',
    [table.senses]
  ).then(
    async raw=>{
      await docket.write(app.Config.glossary.sense,raw);
      _record_info('sense',raw.length);
      console.log('sense:',raw.length,app.Config.glossary.sense)
    }
  ).catch(
    e=>console.error(e)
  );
  await app.sql.query("SELECT id AS i, exam AS v FROM ?? WHERE exam IS NOT NULL AND exam <> '' ORDER BY tid, seq;",
    [table.senses]
  ).then(
    async raw=>{
      await docket.write(app.Config.glossary.usage,raw);
      _record_info('usage',raw.length);
      console.log('usage:',raw.length,app.Config.glossary.usage)
    }
  ).catch(
    e=>console.error(e)
  );
  await docket.write(infoFile,infoRaw,2);
  console.log('info:',infoFile)
}

exports.exportTranslation = async function(e){
  for (const continental of dictionaries) {
    for (const lang of continental.lang) {
      if (!lang.hasOwnProperty('default')) {
        var infoFile = fileName.info(lang.id);
        var infoRaw = await docket.read(infoFile);
        await app.sql.query("SELECT word AS v, sense AS e FROM ?? WHERE word IS NOT NULL AND sense IS NOT NULL AND sense <> '';",[table.other.replace(0,lang.id)]).then(
          raw=>{
            docket.write(fileName.word(lang.id),raw);
            console.info('done',lang.id,raw.length)

            infoRaw.info.progress.map(
              e=> {
                if (e.id && e.id == 'word'){
                  e.status = raw.length;
                }
              }
            )
            // console.info('done',lang.id,raw.length)
          }
        ).catch(
          e=>console.error(e)
        );
        await docket.write(infoFile,infoRaw,2);
      } else {
        console.info('skip',lang.id)
      }
    }
  }
  return Object.keys(docket.data).length;
}
