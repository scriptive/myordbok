# SQL version Definition class

Usages...

```js
new search(req).suggestion(
  raw => res.send(raw)
)
new search(req).definition(
  raw => res.send(raw)
)
new search(req).thesaurus(
  raw => res.send(raw)
)
new search(req).notation(
  raw => res.send(raw)
)
new search(req).dictionaries(
  raw => res.send(raw)
)
```

...

```js
const app = require('../');
const {dictionaries} = app.Config;
const {utility} = app.Common;

var url = require('url'),
  util = require('util'),querystring = require('querystring'),
    moby = require('moby'),
    notation = require('myanmar-notation'),
    mathJs = require('mathjs');

// const Timer = require('./class.timer');
/*
utility.check.isNumeric(k);
utility.word.explode(k);
utility.word.count(k);
*/
let registry={
  pos:{},
  math:{}
},
table={
  word:'en_word',
  wordCurrent:null,
  sense:'en_sense',
  exam:'en_exam',
  type:'en_type',
  kind:'en_kind'
},
solDefault='en',
solActive='test';

class search {
  constructor(requestURL) {
    this.requestURL=requestURL;
    this.result={};
    this.database=app.sql;
    // this.q=null;
  }

  dictionaries(callback) {
    callback({dictionaries:dictionaries,active:this.requestURL.cookies.solId});
  }
  thesaurus(callback) {
    let word = this.requestURL.query.q;
    if (word){
      // NOTE: Moby -> normal
      callback(moby.search(word));
      // NOTE: Moby -> reverse
      // moby.reverseSearch(word);
    }
  }
  notation(callback) {
    let note = notation.get(this.requestURL.query.q);
    callback(note);
  }
  suggestion(callback) {
    this.tableName();
    this.querySuggestion(this.requestURL.query.q+'%').then(e => e.map(i=>i.word)).then((w) => callback(w));
  }
  definition(callback) {
    // NOTE: the search() property is only for temporarily, and when using search_NEXT() uncomment database connection from constructor!
    /*
    meaning, translate, numeric, math, roman
    word,sentence,
    pleaseenter,notfound
    */
    this.tableName();
    let q=this.requestURL.query.q,
        result={
          meta:{
            q:q,
            // msg:'???',
            type:'meaning'
            // sentence:false,
            // translate:false
          },
          solActive:solActive,
          solDefault:solDefault,
          data:{}
        };
        // listGrammar={},
        // listKind={},

    const formatSense = (s) => {
      // TODO: ???
      // return s;
      return s.replace(/<b>(.*?)<\/b>/, function(s,t) {
        return '{-*-}'.replace(/\*/g,t);
      });
    },
    formatExam = (exam) => {
      return exam.replace(/<b>(.*?)<\/b>/, function(s,t) {

      }).replace(/\[(.*?)\]/, function(s,t) {
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
      }).split("\r\n");
    },
    asyncRow = async (row,word,resultRow) => {
      if (!resultRow.hasOwnProperty('row'))resultRow['row']={};
      let grammar = row.type;
      if (!resultRow['row'].hasOwnProperty(grammar)) resultRow['row'][grammar]=[];
      let rowGrammar={
        sense:formatSense(row.sense),
        // wid:row.wid,
        // tid:row.tid,
        // sid:row.sid,
        // kid:row.kid,
        // exam:formatExam(row.exam)
      };
      if (row.exam) {
        rowGrammar.exam=formatExam(row.exam);
      }
      resultRow['row'][grammar].push(rowGrammar);
      // NOTE: Derive(Pos)
      if (!resultRow.hasOwnProperty('pos')) {
        resultRow.pos = [];
        // TODO: ???
        if (registry.pos.hasOwnProperty(word)){
          resultRow.pos=registry.pos[word];
          // for(const row of registry.pos[word]){
          //   resultRow.pos.push({
          //     word:(row.word == word)?row.derive:row.word,
          //     wame:row.wame,
          //     dame:row.dame
          //   })
          // }
        } else {
          // await this.queryPOS(word).then(function(raw){
          //   for(const row of raw){
          //     resultRow.pos.push({
          //       word:(row.word == word)?row.derive:row.word,
          //       wame:row.wame,
          //       dame:row.dame
          //     })
          //   }
          // });
        }
      }
      // NOTE: Synonym
      if (!resultRow.hasOwnProperty('synonym')) {
        resultRow.synonym=[];
        // await this.querySynonym(word).then(function(raw){
        //   resultRow.synonym = raw.map(function(row){ return row.word });
        // });
      }
      // NOTE: Antonym
      if (!resultRow.hasOwnProperty('antonym')) {
        resultRow.antonym=[];
        // await this.queryAntonym(word).then(function(raw){
        //   resultRow.antonym = raw.map(function(row){ return row.word });
        // });
      }
      // NOTE: Moby -> normal
      if (!resultRow.hasOwnProperty('mobyNormal')) {
        // let mobyNormal = moby.search(word);
        // if (mobyNormal.length)resultRow.mobyNormal=mobyNormal;
      }
      // NOTE: Moby -> reverse (thesaurus)
      if (!resultRow.hasOwnProperty('mobyReverse')) {
        // let mobyReverse = moby.reverseSearch(word);
        // if (mobyReverse.length)resultRow.mobyReverse=mobyReverse;
      }
      return resultRow;
    },
    asyncMean = async (raw) => {
      let r={};
      for(const row of raw){
         await asyncRow(row,row.word,r);
      }
      return r;
    },
    asyncWord = async (words) => {
      let r={};
      for(const word of words){
          r[word] = await this.queryMean(word).then(raw => {
           if (raw.length > 0) {
             return asyncMean(raw);
           } else if (utility.check.isNumeric(word)) {
             return this.requestNumeric(word);
           } else if (this.requestMath(word)) {
             return registry.math.row;
           } else {
             return this.requestNone(word);
           }
         });
      }
      return r;
    },
    asyncPOS = async (word) => {
      return await this.queryPOS(word).then(function(raw){
        return raw;
      });
    },
    resultCallback = () => {
      if (solActive == solDefault){
        return this.queryMean(q).then(raw => {
          if (raw.length > 0) {
            return asyncMean(raw).then(resultRow=>{
              result.data[q]=resultRow;
            });
          } else if (utility.check.isNumeric(q)) {
            result.meta.type='numeric';
            result.data[q]=this.requestNumeric(q);
          } else if (this.requestMath()) {
            result.meta.type='math';
            // result.meta.q = registry.mathQuery;
            result.meta.q = registry.math.q;
            result.data[registry.math.q]=registry.math.row;
          } else {
            let words = utility.word.explode(q);
            if (words.length > 1) {
              return asyncWord(words).then(resultRow=>{
                result.meta.sentence=true;
                result.data=resultRow;
              });
            } else {
              // NOTE: not sentense, no match found in math,number,roman
              return asyncPOS(words[0]).then(r0=>{
                if (r0.length){
                  // NOTE: add POS to registry to get faster load!
                  registry.pos[r0[0].word]=r0;
                  if (words[0] != r0[0].word ){
                    // result.meta.type='meaning';
                    return this.queryMean(r0[0].word).then(r1 => {
                      if (r1.length > 0) {
                        return asyncMean(r1).then(r2=>{
                          result.data[q]=r2;
                        });
                      }
                    })
                  } else {
                    result.meta.type='partofspeech';
                    result.data[q]=r0;
                  }
                } else {
                  console.log('wrd:',q)
                  result.meta.type='notfound';
                  result.data[q]=this.requestNone(q);
                }
              });
            }
          }
        });
      } else {
        // this.queryInsertDump().then(function(){
        //   callback('inserted dump');
        // });
        return this.queryTranslate(q).then(raw=>{
          if (raw.length > 0) {
            let words = this.taskMerge(raw);
            return asyncWord(words).then(resultRow=>{
              result.meta.type='translate';
              // result.meta.translate=true;
              result.data[q]=resultRow;
            });
          } else if (utility.check.isNumeric(q)) {
            result.meta.type='numeric';
            result.data[q]=this.requestNumeric(q);
          } else {
            let words = utility.word.explode(q);
            if (words.length > 1) {
              return asyncWord(words).then(resultRow=>{
                result.meta.sentence=true;
                result.data=resultRow;
              });
            } else {
              console.log('wrd:',q,'-t')
              result.meta.type='notfound';
              result[q]=this.requestNone(q);
            }
          }
        });
      }
    }
    resultCallback().then(function(){
      callback(result);
    });
  }
  taskMerge(raw) {
    let senseDump = raw.map(function(row){ return row.sense }).join(',').split(',');
    let sense = Array.from(new Set(senseDump));
    if (raw.length > 1) {
      let wordDump = raw.map(function(row){ return row.word }).join(',').split(',');
      let word = Array.from(new Set(wordDump));
      this.queryDeleteHighest(word).then(abc1=>{
        console.log(abc1);
        this.queryUpdate(word,sense.join(',')).then(abc2=>{
          console.log(abc2);
        })
      })
    }
    return sense;
  }
  querySuggestion(word) {
    return app.sql.query('SELECT word FROM ?? WHERE word LIKE ? ORDER BY word ASC LIMIT 10',[table.wordCurrent,word]);
  }
  queryMean(word) {
    return this.database.query("SELECT w.`word`, d.*, s.`exam`, g.`name` AS type \
       FROM ?? w \
         JOIN ?? d JOIN ?? s JOIN ?? g ON s.`id` = d.`id` AND d.`wid` = w.`id` AND g.`id` = d.`tid` \
          WHERE w.`word` LIKE ? ORDER BY d.`tid`, d.`sid` ASC", [table.word, table.sense, table.exam, table.type, word]);
  }
  queryTranslate(word) {
    return this.database.query("SELECT * FROM ?? WHERE word = ?", [table.wordCurrent,word]);
  }
  queryInsertDump() {
    return this.database.query("INSERT INTO ?? (id,word,sense) VALUES (1,'love','orange,apple'),(2,'love','last')",[table.wordCurrent]);
  }
  // queryDelete(word) {
  //   // return this.database.query("DELETE FROM ?? WHERE word=?", ['no_word',word]);
  //   return this.database.query("DELETE FROM ?? WHERE word IN (?)", ['no_word',word]);
  // }
  queryDeleteHighest(word) {
    // AND word IN (?)
    return this.database.query("DELETE FROM ?? WHERE word IN (?) AND id NOT IN (SELECT * FROM (SELECT MAX(n.id) FROM ?? n GROUP BY n.word) x)", [table.wordCurrent,word,table.wordCurrent]);
  }
  // queryInsert(word,sense) {
  //   return this.database.query("INSERT INTO ?? (word, sense) VALUES (?,?)", ['no_word',word,sense]);
  // }
  queryUpdate(word,sense) {
    return this.database.query("UPDATE ?? SET sense=? WHERE word IN (?)", [table.wordCurrent,sense,word]);
  }
  queryPOS(word) {
    return this.database.query("SELECT w.`word` AS word, d.`word` AS derive, wt.`name` AS wame, dt.`derivation` AS dame FROM `ww_derive` AS d INNER JOIN `ww_word` w ON w.`word_id`=d.`root_id` INNER JOIN `ww_derive_type` dt ON dt.`derived_type`=d.`derived_type` INNER JOIN `ww_word_type` wt ON wt.`word_type`=d.`word_type` WHERE (d.`word`=? OR w.`word`=?) and (d.`derived_type` <> 0 OR d.`word_type` = 0);", [word,word]);
  }
  queryAntonym(word) {
    return this.database.query("SELECT w.`word` AS word FROM `ww_antonym` AS a JOIN `ww_sense` s ON s.`word_sense`=a.`word_sense1` JOIN `ww_sense` w ON w.`word_sense`=a.`word_sense2` WHERE s.`word`=? GROUP BY w.`word`;", [word]);
  }
  querySynonym(word) {
    return this.database.query("SELECT distinct w.`word`, w.`word_type` \
      FROM `ww_sense` AS o, `ww_sense` AS w \
        WHERE o.`equiv_word`=? AND o.`ID`=w.`ID` AND o.`word_sense`<>w.`word_sense` \
          ORDER BY w.`word_type`,w.`word`;", [word]);
  }
  queryKind() {
    return this.database.query('SELECT * FROM ?? ORDER BY id ASC',[table.kind]);
  }
  queryType() {
    return this.database.query('SELECT * FROM ?? ORDER BY id ASC',[table.type]);
  }
  tableName() {
    if (this.requestURL.cookies.solId){
      solActive=this.requestURL.cookies.solId;
    } else {
      // NOTE: possibly attack
      solActive=solDefault;
    }
    table.wordCurrent=table.word.replace('en',solActive);
  }
  requestMath(q){
    /*
    // NOTE: http://mathjs.org/
    // functions and constants
    math.round(math.e, 3)            // 2.718
    math.atan2(3, -3) / math.pi      // 0.75
    math.log(10000, 10)              // 4
    math.sqrt(-4)                    // 2i
    math.derivative('x^2 + x', 'x')  // 2*x+1
    math.pow([[-1, 2], [3, 1]], 2)
         // [[7, 0], [0, 7]]

    // expressions
    math.eval('1.2 * (2 + 4.5)')     // 7.8
    math.eval('12.7 cm to inch')     // 5 inch
    math.eval('sin(45 deg) ^ 2')     // 0.5
    math.eval('9 / 3 + 2i')          // 3 + 2i
    math.eval('det([-1, 2; 3, 1])')  // -7

    // chaining
    math.chain(3)
        .add(4)
        .multiply(2)
        .done() // 14
    */
    registry.math={};
    if (!q){
      let parsedUrl = url.parse(this.requestURL.originalUrl);
      q = querystring.unescape(parsedUrl.query.match(/q=([^&]+)/)[1]);
    }
    try {
      let equation = mathJs.eval(q);
      if (utility.check.isObject(equation)){
        // JSON.stringify(obj)
        // JSON.parse(str)
        registry.math.row={
          math:[JSON.parse(JSON.stringify(equation))]
        }
      } else {
        registry.math.row={
          math:[
            {
              equation:equation
            }
          ]
        }
      }
      registry.math.q=q;
    } catch (e) {
      return false;
    }
    return true;
  }
  requestNumeric(num){
    return notation.get(num);
  }
  requestNone(){
    return 'none';
  }
  // rowNone(){
  // }
  // rowNumeric(){
  // }
  // rowMath(){
  // }
  // rowRoman(){
  // }
  // rowOther(){
  // }
}
module.exports = {search};