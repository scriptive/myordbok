const dictionary = require('./dictionary');
// const search = require('./search');
// const check = require('./check');
// const thesaurus = require("thesaurus");
const pluralize = require("pluralize");
// const WordPOS = require('wordpos'), wordpos = new WordPOS();

exports.main = async () => '?';

exports.wordPos =  async (e) => await dictionary.wordPos(e);
exports.wordBase =  async (e) => await dictionary.wordBase(e);
exports.definition =  async (e) => await dictionary.definition(e,true);

// NOTE: admin
// node run export_definition
// synset synmap
exports.export_word = async () => await dictionary.exportWord();
// ar da de el no ja... except en
exports.export_translation = async (e) => await dictionary.exportTranslation(e);
// en sense usage
exports.export_definition = async () => await dictionary.exportDefinition();
// myanmar grammar
exports.export_grammar = async () => await require('./grammar').exportGrammar();


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

// NOTE: testing
// node run search
exports.search = async (e) => require('./search')(e);
exports.wordbreak = async (e) => require('./wordbreak')(e);
exports.check_keyword = async (e) => await require('./check').keyword(e);
exports.check_wordbreak = async (e) => await require('./check').wordbreak(e);

// NOTE: thesaurus
// node run thesaurus "love"
// exports.thesaurus = async (e) => thesaurus.find(e);

// NOTE: pluralize
exports.plural = async (e) => pluralize.plural(e);
exports.singular = async (e) => pluralize.singular(e);
exports.isPlural = async (e) => pluralize.isPlural(e);
exports.isSingular = async (e) => pluralize.isSingular(e);