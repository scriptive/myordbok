const app = require('..');
const {utility} = app.Common;

const thesaurus = require("thesaurus");
const pluralize = require("pluralize");
const dictionary = require('./dictionary');

const notation = require('myanmar-notation');
// const mathJs = require('mathjs');

const url = require('url');
// const util = require('util');
const querystring = require('querystring');

const setting={
  lang:{
    tar:'en', src:dictionary.getLangDefault.id
  },
  type:[
    "notfound", "pleaseenter", "result", "definition", "translation"
  ]
};
var result={};
var param={query:{q:''},cookies:{solId:''},originalUrl:''};

module.exports = async function(e){
  result={
    meta:{
      q:'', type:setting.type[0],name:null
    },
    lang:{
      tar:setting.lang.tar, src:setting.lang.src
    },
    data:[]
  };

  if (e) {
    if (utility.check.isObject(e)) {
      param = e;
    } else if (utility.check.isString(e)) {
      param.query.q = e;
    }
  }

  if (param.query.q) result.meta.q=param.query.q.replace(/\s\s+/g, ' ').trim();
  if (param.cookies.solId){
    result.lang.tar=param.cookies.solId;
  } else {
    // NOTE: possibly attacks
  }
  result.meta.w=getWordUnescape();
  var keyword = result.meta.q;
  if (keyword){
    if (param.query.language){
      // NOTE: test purpose ?language=no,en,ja
      result.lang.tar = param.query.language;
    }
    if (result.lang.tar == result.lang.src) {
      if (await hasDefinition(result.data,keyword)){
        setPageProperty(3);
      }
    } else {
      // NOTE: is_translate,
      var t1 = await dictionary.translation(keyword,result.lang.tar);
      if (t1.length){
        for (const row of t1) {
          var raw = {
            word:row.v,
            clue:[]
          };
          for (const word of row.e) {
            if (await hasDefinition(raw.clue,word)){
              setPageProperty(4);
            }
          }
          result.data.push(raw)

        }
      } else {
        // NOTE: is_sentence?
        var wordlist = utility.word.explode(keyword);
        if (wordlist.length > 1) {
          // Note: sentence
          for (const word of utility.arrays.unique(wordlist)) {
            var t2 = await dictionary.translation(word,result.lang.tar);
            if (t2.length){
              for (const row of t2) {
                var raw = {
                  word:row.v,
                  clue:[]
                };
                for (const word of row.e) {
                  if (await hasDefinition(raw.clue,word)){
                    setPageProperty(4);
                  }
                }
                result.data.push(raw)
              }
            } else if (await hasDefinition(result.data,word)) {
              setPageProperty(4);
            }
          }
        } else if (await hasDefinition(result.data,keyword)){
          // NOTE: result from src
          setPageProperty(3);
        }
      }
    }
  } else {
    // NOTE: pleaseenter
    setPageProperty(1);
  }

  return result;
};

function setPageProperty(id){
  if(result.meta.type == setting.type[0]) {
    if (setting.type[id]){
      result.meta.type=setting.type[id];
      if (id > 2) {
        // NOTE: pug requested
        result.meta.type=setting.type[2];
        result.meta.name=setting.type[id];
      }
    }
  }
}

async function hasDefinition(raw,wordNormal){
  // NOTE: has_meaning, is_plural, is_number
  var status=false;
  if (await getDefinition(raw,wordNormal)){
    // EXAM: NO -> adelsstand
    status=true;
  } else {
    // NOTE: is_sentence
    // EXAM: NO -> Administratortilgang
    var words = wordNormal.match(/[a-zA-Z]+|[0-9]+(?:\.[0-9]+|)/g).filter(e=> e && e != wordNormal);
    if (words.length) {
      // EXAM: wind[2] good!
      // EXAM: 1900th 10times
      // NOTE: sentence
      // superscripts 1st, 2nd, 3rd, 4th ??
      // .filter(e=> e && e != wordNormal)
      for (const word of words) {
        if (await getDefinition(raw,word)){
          // NOTE: has meaning
          status=true;
        } else {
          dictionary.save(word,result.lang.tar);
        }
      }
    } else {
      // NOTE: save on single word based on language
      // squawker
      dictionary.save(wordNormal,result.lang.tar);
      // if (result.lang.tar == result.lang.src)
    }
  }
  return status;
}

async function getDefinition(raw,wordNormal){
  var status=false;
  var isBaseWord=false;
  if (raw.find(e=>e.word == wordNormal)) {
    // NOTE: clue for current word is already push!
    return status;
  }
  var wordSyns = await dictionary.wordPos(wordNormal);
  // var wordSyns = {pos:[]};
  if (!wordSyns.pos.length) {
    isBaseWord=true;
    wordSyns = await dictionary.wordBase(wordNormal);
  }
  // raw.push({
  //   word: 'tmp',
  //   type:0,
  //   clue: wordSyns
  // });


  var wordMeaning = await rowDefinition({Pos:wordSyns.form,meaning:null,notation:null},wordNormal);

  if (wordMeaning.meaning || wordMeaning.notation){
    // NOTE: found meaning directly on such as love,apple
    status = true;
    raw.push({
      word: wordNormal,
      type:1,
      clue: wordMeaning
    });

  } else if (wordSyns.root.length) {
    // NOTE: has root word found
    // If has no definition -> parcelings parcellings ->
    var hasMultiRoot = wordSyns.root.length > 1;
    // console.log('2?')
    if (hasMultiRoot){
      // NOTE: leaves -> leaf, leave
      var baseGrammar = wordSyns.pos.map(e=>e.t).filter((v, i, a) => a.indexOf(v) === i).map(
        e=>app.Config.synset[e].name
      );
      var baseWords = wordSyns.pos.map(
        e=>e.v
      ).filter(
        (v, i, a) => a.indexOf(v) === i
      );

      wordSyns.root = wordSyns.root.map(
        // NOTE: wind[2], gods Gods
        e=>e.replace(/\[(.+?)\]/g, "").toLowerCase()
      ).filter((v, i, a) => a.indexOf(v) === i);
      // console.log('2')
      // raw.push({
      //   word: wordNormal,
      //   type:2,
      //   clue: {
      //     formOf:baseWords.map(
      //       e => '<i>*</i> is derived from !, as in ?.'.replace('*',e).replace('!',wordSyns.root.map(
      //         s=>'{-*-}'.replace('*',s)
      //       ).join(', ')).replace('?',baseGrammar.join(', '))
      //     )
      //   }
      // });

    }
    // MIND: coloring material
    for (const word of wordSyns.root) {
      // console.log('??',word)
      var row = await rowDefinition({Pos:wordSyns.form,meaning:null,notation:null},word);
      if (row.meaning || row.notation){
        status=true;
        // if (hasMultiRoot){
        //   // TODO: avoid delete
        //   delete row.formOf;
        // }
        raw.push({
          word: word,
          type:3,
          clue: row
        });
      }
    }

    // NOTE: suggestion
    // false parceling parceling
    // true parcelings parceling
    // lovings
    if (!raw.length){
      var rawType = 6;
      if (isBaseWord == true){
        wordSyns = await dictionary.wordBase(wordSyns.root[0]);
        // var tmp = await dictionary.wordPos(wordSyns.root[0]);
        // wordMeaning.suggestion = wordSyns.root.map(e=>'~ {-*-}'.replace('*',e)).join('; ');

        // wordMeaning.suggestion = wordSyns.root;
      } else {
        rawType = 7;
        wordSyns = await dictionary.wordBase(wordNormal);
        // var tmp = await dictionary.wordPos(wordSyns.root[0]);
        // // wordMeaning.suggestion = utility.arrays.group(tmp.form, 'pos',true);
        // // wordMeaning.suggestion = tmp.form.map(e=>e.v);
        // var valu  = wordSyns.root.map(e=>'~ {-*-}'.replace('*',e)).join('; ');
        // var exam = tmp.form.map(e=>e.v);
        // wordMeaning.suggestion.push({v:valu,exam:exam})
      }
      // wordSyns = await dictionary.wordBase(wordNormal);
      // raw.push({
      //   word: 'tmp',
      //   type:0,
      //   clue: wordSyns
      // });
      // return await getDefinition(raw,wordSyns.root[0])
      // status = true;
      // raw.push({
      //   word: wordNormal,
      //   type:6,
      //   tmp:true,
      //   clue: {
      //     suggestion:wordSyns.root,
      //     meaning:utility.arrays.group(wordSyns.form, 'pos',true)
      //   }
      // });
      // wordMeaning
      // wordSyns.form = wordSyns.form.concat(wordMeaning.Pos);
      if (wordSyns.root.length){
        status = true;
      }
      wordSyns.form = wordSyns.form.concat(wordMeaning.Pos);
      wordMeaning.suggestion = wordSyns.root;
      wordMeaning.meaning = utility.arrays.group(wordSyns.form, 'pos',true);
      raw.push({
        word: wordNormal,
        type:rawType,
        clue: (({ suggestion, meaning, thesaurus }) => ({ suggestion, meaning, thesaurus }))(wordMeaning)
      });
    } else if (wordMeaning.thesaurus){
      raw.push({
        word: wordNormal,
        type:4,
        clue: (({ thesaurus }) => ({ thesaurus }))(wordMeaning)
      });
    }
  } else {
    // NOTE: britains -> britain
    var wordSingular = pluralize.singular(wordNormal);
    if (pluralize.isPlural(wordNormal) && wordSingular != wordNormal) {
      var row = await rowDefinition({},wordSingular);
      if (row.meaning || row.notation){
        raw.push({
          word: wordSingular,
          type:5,
          clue: row
        });
        status = true;
      } else {
        // NOTE lovings
        return await getDefinition(raw,wordSingular)
      }
    }
  }
  return status;
}

async function rowDefinition(row,word){
  var rowMeaning = await dictionary.definition(word);
  if (rowMeaning){

    if (row.Pos && row.Pos.length) {
      rowMeaning = rowMeaning.concat(row.Pos);
      // rowMeaning = row.Pos.concat(rowMeaning);
      row.Pos=null;
    }
    row.meaning = utility.arrays.group(rowMeaning, 'pos',true);
  }
  if (utility.check.isNumeric(word)){
    // EXAM: 10 50
    var rowNotation = notation.get(word);
    if (rowNotation.number) row.notation = rowNotation;
  }

  var rowThesaurus = thesaurus.find(word.toLowerCase());
  if (rowThesaurus.length) {
    row.thesaurus = rowThesaurus;
  }

  return Object.keys(row).filter(
    e => row[e] !== null
  ).reduce((o, e) => {
    o[e] = row[e];
    return o;
  }, {});
}

function getWordUnescape(){
  try {
    var parsedUrl = url.parse(param.originalUrl);
    return querystring.unescape(parsedUrl.query.match(/q=([^&]+)/)[1]);
  } catch (error) {
    return null;
  }
}