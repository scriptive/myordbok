const app = require('..');
const {utility} = app.Common;

const thesaurus = require("thesaurus");
const pluralize = require("pluralize");
const dictionary = require('./dictionary');

const notation = require('myanmar-notation');
const mathJs = require('mathjs');

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
var registry={};
var param={query:{q:''},cookies:{solId:''},originalUrl:''};

module.exports = async function(e){
  result={
    meta:{
      q:'', type:setting.type[0], sentence:false, translate:false
    },
    lang:{
      tar:setting.lang.tar, src:setting.lang.src
    },
    data:{}
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
  // console.log(param.res.locals.sol.id)
  result.meta.w=getWordUnescape();
  var keyword = result.meta.q;
  if (keyword){
    if (param.query.language)result.lang.tar = param.query.language;
    if (result.lang.tar == result.lang.src) {
      // NOTE: is_meaning, is_plural, is_math, is_roman
      if (await getDefinition(result.data,keyword)){
        setPageProperty(3);
      } else {
        // NOTE: is_sentence?
        var wordlist = utility.word.explode(keyword);
        if (wordlist.length > 1) {
          // Note: sentence
          result.meta.sentence=true;
          setPageProperty(3);
          for (const word of utility.arrays.unique(wordlist)) {
            await getDefinition(result.data,word,true);
          }
        }
      }
    } else {
      // NOTE: is_translate,
      var t1 = await dictionary.translation(keyword,result.lang.tar);
      result.meta.translate=true;
      if (t1.length){
        // NOTE: is_meaning,
        setPageProperty(2);
        for (const row of t1) {
          result.data[row.v]={};
          // row.e.forEach(
          //   word => await getDefinition(result.data[row.v],word)
          // );
          for (const word of row.e) {
            await getDefinition(result.data[row.v],word)
          }
        }
      } else {
        // NOTE: is_sentence?
        var wordlist = utility.word.explode(keyword);
        if (wordlist.length > 1) {
          // Note: sentence
          result.meta.sentence=true;
          for (const word of utility.arrays.unique(wordlist)) {
            var t2 = await dictionary.translation(word,result.lang.tar);
            if (t2.length){
              setPageProperty(2);
              for (const row of t2) {
                result.data[row.v]={};
                // row.e.forEach(
                //   word => await getDefinition(result.data[row.v],word,true)
                // );
                for (const word of row.e) {
                  await getDefinition(result.data[row.v],word)
                }
              }
            } else {
              setPageProperty(2);
              await getDefinition(result.data,word,true)
            }
          }
        } else if (await getDefinition(result.data,keyword)){
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
  // if(!result.meta.type && id) result.meta.type=setting.type[id];
  if(id && result.meta.type ==setting.type[0]) result.meta.type=setting.type[id];
  // result.meta.type=setting.type[id];
}

async function getDefinition(raw,wordNormal,is_sentence){
  // raw,row,status
  var row={
    _formOf:null,
    _definition:{},
    _number:{},
    _math:{},
    _pos:{},
    _thesaurus:[],
    _synonym:[],
    _antonym:[]
  }, status=false, id=wordNormal;
  var wordUnescape = is_sentence?wordNormal:result.meta.w;
  var wordSingular = pluralize.singular(wordNormal);
  var isWordPlural = pluralize.isPlural(wordNormal) && wordSingular != wordNormal;
  var rowNormal = await dictionary.definition(wordNormal);
  if (rowNormal){
    status=true;
    row._definition=rowNormal;
  } else if (isWordPlural) {
    var rowSingular = await dictionary.definition(wordSingular);
    if (rowSingular) {
      status=true;
      id = wordSingular;
      // rowSingular.formOf = setting.formPlural.replace(0,wordNormal).replace(1,wordSingular);
      // row._formOf = setting.formSingular.replace(0,wordNormal).replace(1,wordSingular);
      row._definition=rowSingular;
    }
  }
  if (utility.check.isNumeric(wordNormal)){
    status=true;
    row._number=requestNumeric(wordNormal);
  } else {
    delete row._number;
  }

  if (requestMath(wordUnescape)){
    status=true;
    id = wordUnescape;
    row._math=registry.math;
  } else {
    delete row._math;
  }

  var wordNormalThesaurus=thesaurus.find(wordNormal);
  if (wordNormalThesaurus.length){
    // var wordPlural = pluralize.plural(wordNormal);
    // row._formOf = setting.formSingular.replace(0,wordNormal).replace(1,wordPlural);
    row._thesaurus=wordNormalThesaurus;
    // status=true;
  } else if (isWordPlural) {
    row._formOf = setting.formPlural.replace(0,wordNormal).replace(1,wordSingular);
    // row._thesaurus=thesaurus.find(wordSingular);
    var wordPluralThesaurus=thesaurus.find(wordSingular);
    if (wordPluralThesaurus.length) {
      // status = true;
      row._thesaurus=wordPluralThesaurus;
    }
  }
  // row._synonym=[];
  // row._antonym=[];
  if (status) {
    raw[id]=row;
    setPageProperty(3);
  }
  return status;
}

function requestMath(num){
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
   try {
     let e = mathJs.evaluate(num);
     if (utility.check.isObject(e)){
      //  var id = e.hasOwnProperty('mathjs');
      //  registry.math[id]={};
      //  for (const k in e) {
      //    if (e.hasOwnProperty(k) && k != mathjs) {
      //      registry.math[id][k]=e[k]
      //    }
      //  }
      registry.math = equation;
      // registry.math = JSON.parse(JSON.stringify(equation));
      // registry.math = [JSON.parse(JSON.stringify(equation))];

     } else {
      // if (utility.check.isNumeric(equation) && equation != parseInt(num))
      registry.math = {
        equation: {
          value: e
        }
      };
      // if (equation != parseInt(equation)){
      //   // registry.math.abc=requestNumeric(parseInt(equation));
      //   var abc = requestNumeric(parseInt(equation))
      //   Object.assign(registry.math,abc)
      // }

      // registry.math = [
      //   {
      //     equation:e
      //   }
      // ];
     }

     return Object.keys(registry.math).length;

    //  if (e) return true;

   } catch (e) {
     return false;
   }

}

function requestNumeric(num){
  return notation.get(num);
}

function getWordUnescape(){
  try {
    var parsedUrl = url.parse(param.originalUrl);
    return querystring.unescape(parsedUrl.query.match(/q=([^&]+)/)[1]);
  } catch (error) {
    return null;
  }
}
// function setWordProperty(word){
//   if (!result.data.hasOwnProperty(word)) result.data[word]={};
// }
// function isSameLang(){
//   return result.lang.tar == result.lang.src;
// }



// const used = process.memoryUsage();
// for (let key in used) {
//   console.info(`${key} ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB`);
// }
// var resultTemplate = {
//   meta:{
//     q:'?', type:'meaning',
//   },
//   solActive:'en',
//   solDefault:'en',
//   data:{}
// };
// const resultData={
//   word:{
//     row:{},
//     pos:[],
//     synonym:[],
//     antonym:[]
//   }
// }