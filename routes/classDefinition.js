var app = require('../'),
    {express,path,fs} = app.root.evh(),
    {dictionaries} = require('../score');

var util = require('util'),
    moby = require('moby'),
    notation = require('myanmar-notation');

// const Timer = require('./class.timer');
let config={
  track_limit:30
};
let examine={
  isNumeric:function(k){
    return /^-{0,1}\d+$/.test(k);
  },
  wordExplode:function(k){
    return k.trim().split(/\s+/);
  },
  wordCount:function(k){
    return this.wordExplode(k).length;
  },
  unique:function(res){
    // artist_newset:Array.from(new Set(row.listArtist.split(","))),
    // artist_dum:row.listArtist,
    // artist_filter:row.listArtist.split(",").filter(function (el) {
    //     return (el.hero === "Batman");
    // }),
    // artist_map:row.listArtist.split(",").map(function(e){return e.trim();}),
    return Array.from(new Set(res.map(function(e){return e.trim();}).filter(function (item, pos, self) {
        return self.indexOf(item) == pos && item!='';
    })));
  }
};
let table={
  word:'en_word',
  sense:'en_sense',
  exam:'en_exam',
  type:'en_type',
  kind:'en_kind'
},
wordTable='',
solDefault='en',
solActive='test';
// source, target

module.exports = class Definition {
  constructor(requestURL) {
    this.requestURL=requestURL;
    this.result={};
    this.database=app.sql;
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
    this.requestTableName();
    this.querySuggestion(this.requestURL.query.q+'%').then(raw => {
      return raw.map(row=>row.word)
    }).then(function(words){
      callback(words);
    });
  }
  definition(callback) {
    // NOTE: the search() property is only for temporarily, and when using search_NEXT() uncomment database connection from constructor!
    this.requestTableName();
    let q=this.requestURL.query.q,
        result={
          info:{
            q:q,
            msg:'???',
            type:'meaning',
            sentence:false,
            translate:false
          },
          // solId:this.requestURL.cookies.solId,
          // solName:this.requestURL.cookies.solName,
          solActive:solActive,
          solDefault:solDefault,
          data:{}
        };
        // listGrammar={},
        // listKind={},

    const asyncRow = async (row,word,resultRow) => {
      if (!resultRow.hasOwnProperty('row'))resultRow['row']={};
      let grammar = row.type;
      if (!resultRow['row'].hasOwnProperty(grammar)) resultRow['row'][grammar]=[];
      resultRow['row'][grammar].push({
        sense:row.sense,
        // wid:row.wid,
        // tid:row.tid,
        // sid:row.sid,
        // kid:row.kid,
        exam:row.exam.split("\r\n")
      });
      // NOTE: Antonym
      // if (!resultRow.hasOwnProperty('antonym')) {
      //   resultRow.antonym=[];
      //   await this.queryAntonym(word).then(function(raw){
      //     resultRow.antonym = raw.map(function(row){ return row.word });
      //   });
      // }
      // NOTE: Derive
      // if (!resultRow.hasOwnProperty('derive')) {
      //   resultRow.derive = [];
      //   await this.queryDerive(word).then(function(raw){
      //     for(const row of raw){
      //       resultRow.derive.push({
      //         word:(row.word == word)?row.derive:row.word,
      //         wame:row.wame,
      //         dame:row.dame
      //       })
      //     }
      //   });
      // }
      // NOTE: Moby -> normal
      if (!resultRow.hasOwnProperty('moby')) {
        resultRow.moby=moby.search(word);
      }
      // NOTE: Moby -> reverse
      // if (!resultRow.hasOwnProperty('mobyReverse')) {
      //   resultRow.mobyReverse=moby.reverseSearch(word);
      // }
      return resultRow;
    },
    asyncMean = async (raw) => {
      let resultMean={};
      for(const row of raw){
         await asyncRow(row,row.word,resultMean);
      }
      return resultMean;
    },
    asyncWord = async (words) => {
      let resultWord={};
      for(const word of words){
          resultWord[word] = await this.queryMean(word).then(raw => {
           if (raw.length > 0) {
             return asyncMean(raw);
           } else if (examine.isNumeric(word)) {
             return this.requestNumeric(word);
           } else {
             return this.requestNone(word);
           }
         });
      }
      return resultWord;
    },
    resultCallback = () => {

      if (solActive == solDefault){
        return this.queryMean(q).then(raw => {
          if (raw.length > 0) {
            // return asyncMean(raw);
            return asyncMean(raw).then(resultRow=>{
              result.data[q]=resultRow;
            });
          } else if (examine.isNumeric(q)) {
            result.info.type='numeric';
            result.data[q]=this.requestNumeric(q);
          } else {
            let words = examine.wordExplode(q);
            if (words.length > 1) {
              return asyncWord(words).then(resultRow=>{
                result.info.sentence=true;
                result.data=resultRow;
              });
            } else {
              result[q]=this.requestNone(q);
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
              result.info.type='translate';
              result.info.translate=true;
              result.data[q]=resultRow;
            });
          } else if (examine.isNumeric(q)) {
            // result[q]=this.requestNumeric(q);
            result.data[q]=this.requestNumeric(q);
          } else {
            let words = examine.wordExplode(q);
            if (words.length > 1) {
              // return asyncWord(words);
            } else {
              // result[q]=this.requestNone(q);
            }
          }
        });
      }
    }
    resultCallback().then(function(){
      callback(result);
    });

    // if (solActive == solDefault){
    //   this.queryMean(q).then(raw => {
    //     if (raw.length > 0) {
    //       // return asyncMean(raw);
    //       return asyncMean(raw).then(resultRow=>{
    //         result.data[q]=resultRow;
    //       });
    //     } else if (examine.isNumeric(q)) {
    //       result.info.type='numeric';
    //       result.data[q]=this.requestNumeric(q);
    //     } else {
    //       let words = examine.wordExplode(q);
    //       if (words.length > 1) {
    //         return asyncWord(words).then(resultRow=>{
    //           result.info.sentence=true;
    //           result.data=resultRow;
    //         });
    //       } else {
    //         result[q]=this.requestNone(q);
    //       }
    //     }
    //   }).then(function(){
    //     callback(result);
    //   });
    // } else {
    //   // this.queryInsertDump().then(function(){
    //   //   callback('inserted dump');
    //   // });
    //   this.queryTranslate(q).then(raw=>{
    //     if (raw.length > 0) {
    //       let words = this.taskMerge(raw);
    //       return asyncWord(words).then(resultRow=>{
    //         result.info.type='translate';
    //         result.info.translate=true;
    //         result.data[q]=resultRow;
    //       });
    //     } else if (examine.isNumeric(q)) {
    //       // result[q]=this.requestNumeric(q);
    //       result.data[q]=this.requestNumeric(q);
    //     } else {
    //       let words = examine.wordExplode(q);
    //       if (words.length > 1) {
    //         // return asyncWord(words);
    //       } else {
    //         // result[q]=this.requestNone(q);
    //       }
    //     }
    //   }).then(function(abc){
    //     callback(result);
    //   });
    // }
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
    return this.database.query('SELECT word FROM ?? WHERE word LIKE ? ORDER BY word ASC LIMIT 10',[wordTable,word])
  }
  queryMean(word) {
    /*
    SELECT w.`word`,d.*,s.`exam`,g.`name` AS type\
      FROM `en_word` w\
      JOIN `en_sense` d\
      JOIN `en_exam` s\
      JOIN `en_type` g\
      ON s.`id` = d.`id` AND d.`wid` = w.`id` AND g.`id` = d.`tid`\
        WHERE w.`word` LIKE 'test' ORDER BY d.`tid`, d.`sid` ASC
    */
    return this.database.query("SELECT w.`word`,d.*,s.`exam`,g.`name` AS type\
      FROM ?? w\
    	JOIN ?? d\
    	JOIN ?? s\
    	JOIN ?? g\
      ON s.`id` = d.`id` AND d.`wid` = w.`id` AND g.`id` = d.`tid`\
        WHERE w.`word` LIKE ? ORDER BY d.`tid`, d.`sid` ASC", [
          table.word,
          table.sense,
          table.exam,
          table.type,
          word
        ]);
  }
  queryTranslate(word) {
    return this.database.query("SELECT * FROM ?? WHERE word = ?", [wordTable,word]);
  }
  queryInsertDump() {
    return this.database.query("INSERT INTO ?? (id,word,sense) VALUES (1,'love','orange,apple'),(2,'love','last')",[wordTable]);
  }
  // queryDelete(word) {
  //   // return this.database.query("DELETE FROM ?? WHERE word=?", ['no_word',word]);
  //   return this.database.query("DELETE FROM ?? WHERE word IN (?)", ['no_word',word]);
  // }
  queryDeleteHighest(word) {
    // AND word IN (?)
    return this.database.query("DELETE FROM ?? WHERE word IN (?) AND id NOT IN (SELECT * FROM (SELECT MAX(n.id) FROM ?? n GROUP BY n.word) x)", [wordTable,word,wordTable]);
  }
  // queryInsert(word,sense) {
  //   return this.database.query("INSERT INTO ?? (word, sense) VALUES (?,?)", ['no_word',word,sense]);
  // }
  queryUpdate(word,sense) {
    return this.database.query("UPDATE ?? SET sense=? WHERE word IN (?)", [wordTable,sense,word]);
  }
  queryDerive(word) {
    return this.database.query("SELECT\
      w.`word_id` AS id, w.`word` AS word, d.`word` AS derive, d.`derived_type` AS d_type, d.`word_type` AS w_type, wt.`name` AS wame, dt.`derivation` AS dame\
      FROM `ww_derive` AS d\
      INNER JOIN `ww_word` w ON w.`word_id`=d.`root_id`\
      INNER JOIN `ww_derive_type` dt ON dt.`derived_type`=d.`derived_type`\
      INNER JOIN `ww_word_type` wt ON wt.`word_type`=d.`word_type`\
        WHERE (d.`word`=? OR w.`word`=?) and (d.`derived_type` <> 0 OR d.`word_type` = 0);", [word,word]);
  }
  queryAntonym(word) {
    return this.database.query("SELECT w.`word` as word FROM `ww_antonym` AS a\
			JOIN `ww_sense` s ON s.`word_sense`=a.`word_sense1`\
			JOIN `ww_sense` w ON w.`word_sense`=a.`word_sense2`\
				WHERE s.`word`=? GROUP BY w.`word`;", [word]);
  }
  queryKind() {
    return this.database.query('SELECT * FROM ?? ORDER BY id ASC',[table.kind]);
  }
  queryType() {
    return this.database.query('SELECT * FROM ?? ORDER BY id ASC',[table.type]);
  }
  requestTableName() {
    // solActive=this.requestURL.cookies.solId;
    wordTable=table.word.replace('en',solActive);
  }
  requestMath(){
    return 'math';
  }
  requestNumeric(num){
    return notation.get(num);
  }
  requestNone(){
    return 'none';
  }
}