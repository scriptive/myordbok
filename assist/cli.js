const dictionary = require('./dictionary');
const search = require('./search');
const thesaurus = require("thesaurus");
const pluralize = require("pluralize");

const WordPOS = require('wordpos'), wordpos = new WordPOS();

exports.main = async () => '?';
// node run export_definition
exports.export_definition = async () => await dictionary.exportDefinition();
// node run export_word
exports.export_word = async (e) => await dictionary.exportWord(e);
// exports.test = async (e) => await dictionary.test(e);

// node run suggestion "l"
exports.suggestion = async (e,l) => dictionary.suggestion(e,l);
// node run definition "l"
exports.definition = async (e) => dictionary.definition(e);
// node run translation
exports.translation = async (e,l) => dictionary.translation(e,l);
//
exports.getLangDefault = () => dictionary.getLangDefault;
exports.getLangByName = (e) => dictionary.getLangByName(e);
exports.getLangById = (e) => dictionary.getLangById(e);

// node run search
exports.search = async (e) => search(e);

// NOTE: thesaurus
// node run thesaurus "love"
exports.thesaurus = async (e) => thesaurus.find(e);

// NOTE: pluralize
exports.plural = async (e) => pluralize.plural(e);
exports.singular = async (e) => pluralize.singular(e);
exports.isPlural = async (e) => pluralize.isPlural(e);
exports.isSingular = async (e) => pluralize.isSingular(e);

// NOTE: wordpos
exports.pos = async (e) => wordpos.getPOS(e);
exports.lookup = async (e) => wordpos.lookup(e);
// exports.seek = async (e) => wordpos.seek(1285602, 'a');
exports.seek = async (e) => wordpos.seek(832318, 'a');
exports.getAdjectives = async (e) => wordpos.lookupAdjective(e);

exports.wordnet = async (e) => {
  var w = await wordpos.lookup(e);
  // var result = [];
  if (w.length){
    for (const row of w) {
      // result.push({synsetOffset:row.synsetOffset,pos:row.pos})
      // console.log(row.synsetOffset,row.pos)
      console.log(row)
      // var abc = await wordpos.seek(row.synsetOffset, row.pos);
      // // console.log(row.synsetOffset,abc.synsetOffset)
      // // console.log(abc.ptrs)
      // for (const ant of abc.ptrs) {
      //   var ptrs = await wordpos.seek(ant.synsetOffset, ant.pos);
      //   console.log(ptrs)
      // }
    }
    // console.log('yes')
  }
  return 'w';
};

// exports.test = async () => 'what';