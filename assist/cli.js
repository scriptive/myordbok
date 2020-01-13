const working = require('./working');
const dictionary = require('./dictionary');
// const search = require('./search');
// const thesaurus = require("thesaurus");
const pluralize = require("pluralize");
// const WordPOS = require('wordpos'), wordpos = new WordPOS();

exports.main = async () => '?';
exports.working = async (e) => working.main(e);


exports.wordPos =  async (e) => await dictionary.wordPos(e);
exports.wordBase =  async (e) => await dictionary.wordBase(e);
exports.definition =  async (e) => await dictionary.definition(e,true);

// NOTE: admin
exports.export_word = async () => await dictionary.exportWord();
exports.export_translation = async (e) => await dictionary.exportTranslation(e);
exports.export_definition = async () => await dictionary.exportDefinition();

// node run suggestion "l"
// exports.suggestion = async (e,l) => dictionary.word(e,l);
// node run definition "l"
// exports.definition = async (e) => dictionary.definition(e);
// node run translation
// exports.translation = async (e,l) => dictionary.translation(e,l);

// NOTE: language
// exports.getLangDefault = () => dictionary.getLangDefault;
// exports.getLangByName = (e) => dictionary.getLangByName(e);
// exports.getLangById = (e) => dictionary.getLangById(e);

// node run search
// exports.search = async (e) => search(e);

// NOTE: thesaurus
// node run thesaurus "love"
// exports.thesaurus = async (e) => thesaurus.find(e);

// NOTE: pluralize
exports.plural = async (e) => pluralize.plural(e);
exports.singular = async (e) => pluralize.singular(e);
exports.isPlural = async (e) => pluralize.isPlural(e);
exports.isSingular = async (e) => pluralize.isSingular(e);

// NOTE: wordpos
// exports.pos = async (e) => wordpos.getPOS(e);
// exports.lookup = async (e) => wordpos.lookup(e);
// exports.seek = async (e) => wordpos.seek(1285602, 'a');
// exports.seek = async (e) => wordpos.seek(1285602, 'a');
// exports.getAdjectives = async (e) => wordpos.lookupAdjective(e,console.log);