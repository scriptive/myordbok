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
    "notfound", "pleaseenter", "translation", "definition" //"numeric", "math", "sentence", "roman",
  ],
  formPlural:'{-0-} is plural form of {-1-}???',
  formSingular:'{-0-} is singular form of {-1-}???'
};
var result={};
// var registry={};
var param={query:{q:''},cookies:{solId:''},originalUrl:''};

module.exports = async function(e){
  result={
    meta:{
      q:'', type:setting.type[0]
      // sentence:false, translate:false
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
              setPageProperty(2);
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
                    setPageProperty(2);
                  }
                }
                result.data.push(raw)
              }
            } else if (await hasDefinition(result.data,word)) {
              setPageProperty(2);
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
  if(id && result.meta.type == setting.type[0]) result.meta.type=setting.type[id];
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
    var words = utility.word.explode(wordNormal);
    if (words.length > 1) {
      // Note: sentence
      for (const word of utility.arrays.unique(words)) {
        if (await getDefinition(raw,word)){
          // NOTE: has meaning
          status=true;
        }
      }
    }

  }
  return status;
}

async function getDefinition(raw,wordNormal){
  var formOf=null, status=false;
  if (raw.find(e=>e.word == wordNormal)) {
    // NOTE: clue for current word is already push!
    return status;
  }
  var wordSyns = await dictionary.wordPos(wordNormal);
  if (wordSyns.pos.length) {
    formOf = wordSyns.pos.map(
      e => '!:{-*-} (?)'.replace('*',e.v).replace('!',app.Config.synset[e.t]).replace('?',app.Config.synmap.find(i=> i.id == e.d).name)
    );
  } else {
    wordSyns = await dictionary.wordBase(wordNormal);
    if (wordSyns.pos.length) {
      formOf = wordSyns.pos.map(
        e => '!, ?: {-*-}'.replace('*',e.v).replace('!',app.Config.synset[e.t]).replace('?',app.Config.synmap.find(i=> i.id == e.d).name)
      );
    }
  }

  // var tsst = {meaning:null,formOf:formOf,notation:null};
  var wordMeaning = await rowDefinition({meaning:null,formOf:formOf,notation:null},wordNormal);

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
    var hasMultiRoot = wordSyns.root.length > 1;
    if (hasMultiRoot){
      // NOTE: leaves -> leaf, leave
      var baseGrammar = wordSyns.pos.map(e=>e.t).filter((v, i, a) => a.indexOf(v) === i).map(
        e=>app.Config.synset[e]
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

      raw.push({
        word: wordNormal,
        type:2,
        clue: {
          formOf:baseWords.map(
            e => '<i>*</i> is derived from !, as in ?.'.replace('*',e).replace('!',wordSyns.root.map(
              s=>'{-*-}'.replace('*',s)
            ).join(', ')).replace('?',baseGrammar.join(', '))
          )
        }
      });

    }
    // MIND: coloring material
    for (const word of wordSyns.root) {
      var row = await rowDefinition({formOf:formOf,meaning:null,notation:null},word);
      if (row.meaning || row.notation){
        status=true;
        if (hasMultiRoot){
          delete row.formOf;
        }
        raw.push({
          word: word,
          type:3,
          clue: row
        });
      }
    }

    if (wordMeaning.thesaurus){
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
      // console.log(wordSingular,wordNormal)
      var row = await rowDefinition({},wordSingular);
      if (row.meaning || row.notation){
        // formOf = '{-*-} as in ?'.replace('*',wordNormal).replace('?',app.Config.synmap.find(i=> i.id == 1).name);
        raw.push({
          word: wordSingular,
          type:5,
          clue: row
        });
        status = true;
      }
    }
  }

  return status;
}

async function rowDefinition(row,word){
  // NOTE: works
  // var rowMeaning = await dictionary.definition(word,true);
  var rowMeaning = await dictionary.definition(word);
  if (rowMeaning){
    row.meaning = rowMeaning;
  }

  if (utility.check.isNumeric(word)){
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