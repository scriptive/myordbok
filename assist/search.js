const app = require('..');
const {utility} = app.Common;

const pluralize = require("pluralize");
const dictionary = require('./dictionary');
const wordbreak = require('./wordbreak');

// const notation = require('myanmar-notation');
// const mathJs = require('mathjs');

// const url = require('url');
// const util = require('util');
// const querystring = require('querystring');

const setting={
  lang:{
    tar:'en', src:dictionary.lang.default.id
  },
  type:[
    "notfound", "pleaseenter", "result", "definition", "translation"
  ]
};
var result={};


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
  // TEXT: unfading netlike
  var status=false;
  result.meta.msg.push({msg:'lookup',list:[wordNormal]});
  if (await getDefinition(raw,wordNormal)){
    // EXAM: NO -> adelsstand
    result.meta.msg.push({msg:'okey'});
    status=true;
  } else if (/[a-zA-Z]+|[0-9]+(?:\.[0-9]+|)/.test(wordNormal)) {
    // EXAM: NO -> Administratortilgang
    // EXAM: wind[2] good!
    // EXAM: 1900th 10times
    // superscripts 1st, 2nd, 3rd, 4th ??
    var words = wordNormal.match(/[a-zA-Z]+|[0-9]+(?:\.[0-9]+|)/g).filter(e=> e && e != wordNormal);
    if (words.length) {
      result.meta.msg.push({msg:'split',list:words});
      for (const word of words) {
        if (await getDefinition(raw,word)){
          status=true;
          result.meta.msg.push({msg:'partially',list:[word]});
        } else {
          dictionary.save(word,result.lang.tar);
          result.meta.msg.push({msg:'save 1 ?'});
          var rowThesaurus = dictionary.wordThesaurus(word);
          if (rowThesaurus) {
            result.meta.sug.push({
              word:word,
              list:rowThesaurus.v
            })
            result.meta.msg.push({msg:'0 to suggestion'.replace(0,word)})
          }
        }
      }
    } else {
      // NOTE: single word
      // skillfulness, utile
      // decennary decennium
      // EXAM: adeptness adroitness deftness "facility quickness skillfulness"
      result.meta.msg.push({msg:'save 2 ?'});
      dictionary.save(wordNormal,result.lang.tar);
      var rowThesaurus = dictionary.wordThesaurus(wordNormal);
      if (rowThesaurus) {
        result.meta.sug.push({word:wordNormal,list:rowThesaurus.v})
        result.meta.msg.push({msg:'0 to suggestion'.replace(0,wordNormal)})
      }

    }
  } else {
    // NOTE: å ø æ
    result.meta.msg.push({msg:'is this a word?'});
  }
  return status;
}

async function getDefinition(raw,wordNormal){
  // angle
  // companies
  var wordBase = {};
  var wordPos = await dictionary.wordPos(wordNormal);
  var form = wordPos.form;
  var status = await rowDefinition(raw,wordNormal,form);
  if (status == false) {
    if (wordPos.root.length){
      for (const row of wordPos.root) {
        form = wordPos.kind.filter(e=>e.term == row.v);
        if (await rowDefinition(raw,row.v,form)){
          status = true;
        } else if (form.length) {
          dictionary.wordCategory(raw,form);
        }
      }
    }
  }
  if (status == false) {
    // EXAM: US
    // EXAM: lovings -> loving
    // EXAM: winds -> wound winding
    // EXAM: britains -> britain, lovings -> loving
    var wordSingular = pluralize.singular(wordNormal);
    if (pluralize.isPlural(wordNormal) && wordSingular != wordNormal) {
      result.meta.msg.push({msg:'pluralize',list:[wordSingular]});
      wordBase = await dictionary.wordPos(wordSingular,true);
      status = await rowDefinition(raw,wordSingular,wordBase.form);
      if (status == false){
        // EXAM: lovings->loving->love
        for (const row of wordBase.root) {
          form = wordBase.kind.filter(e=>e.term == row.v);
          if (await rowDefinition(raw,row.v,form)){
            status=true;
          }
        }
      }
    }
  }
  // if (status == false) {
  //   result.meta.msg.push({msg:'save?'});
  //   for (const row of wordPos.root) {
  //     var abc = wordbreak(row.v);
  //     console.log('save?',row.v,abc)
  //   }
  //   result.meta.msg.push({msg:'root',list:wordPos.root});
  //   // console.log('save?',wordPos,wordBase)
  // }
  return status;
}

async function rowDefinition(raw,word,pos=[]){
  var status = false;
  var rowMeaning = await dictionary.definition(word);
  if (rowMeaning.length){
    // EXAM: us britian
    var rowTerm = rowMeaning.map(
      e => e.term
    ).filter(
      (v, i, a) => a.indexOf(v) === i
    );
    var sensitiveThesaurus = rowTerm.length > 1;
    rowTerm.forEach(term => {
      var rowThesaurus = dictionary.wordThesaurus(term,sensitiveThesaurus);
      if (rowThesaurus) rowMeaning.push(rowThesaurus);
    });

    // rowMeaning = rowMeaning.concat(pos);
    rowMeaning.push(...pos);
    // dictionary.wordCategory(raw,rowMeaning.concat(pos));
    status = true;
  }
  if (utility.check.isNumeric(word)){
    // EXAM: 10 50
    var rowNumber = dictionary.wordNumber(word);
    if (rowNumber){
      // result.meta.todo.push('notation');
      result.meta.msg.push({msg:'notation',list:[word]});
      rowMeaning.push(rowNumber);
      if (!rowMeaning.find(e=>e.pos=='thesaurus')) {
        var rowThesaurus = dictionary.wordThesaurus(word);
        if (rowThesaurus) rowMeaning.push(rowThesaurus);
      }
      status = true;
    }
  }
  // if (status == false) {
  //   var rowThesaurus = dictionary.wordThesaurus(word);
  //   if (rowThesaurus) rowMeaning.push(rowThesaurus);
  // }

  dictionary.wordCategory(raw,rowMeaning);

  return status;
}

module.exports = async function(e){
  var param={query:{q:''},cookies:{solId:''},originalUrl:''};
  result={
    meta:{
      q:'', type:setting.type[0],name:null,msg:[],todo:[],sug:[]
    },
    lang:{
      tar:setting.lang.tar, src:setting.lang.src
    },
    pageClass:'definition',
    data:[]
  };

  if (e) {
    if (utility.check.isObject(e)) {
      // NOTE: gui
      param = e;
    } else if (utility.check.isString(e)) {
      // NOTE: cli
      param.query.q = e;
    }
  }

  if (param.query.q) {
    result.meta.q=param.query.q.replace(/\s+/g, ' ').trim();
  }
  if (param.cookies.solId){
    result.lang.tar=param.cookies.solId;
  } else {
    // NOTE: possibly attacks
  }

  // NOTE: test purpose ?language=no,en,ja
  if (param.query.language){
    result.lang.tar = param.query.language;
  }

  var keyword = result.meta.q;
  if (/[\u1000-\u109F]/.test(keyword)) {
    // NOTE: from Myanmar
    result.meta.unicode=true;
  } else if (keyword){
    // NOTE: to Myanmar
    if (result.lang.tar == result.lang.src) {
      // NOTE: definition
      if (await hasDefinition(result.data,keyword)){
        setPageProperty(3);
      }
    } else {
      // NOTE: translation,
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
          // NOTE: definition from src
          setPageProperty(3);
        }
      }
    }
  } else {
    // NOTE: pleaseenter
    setPageProperty(1);
  }

  return result;
}