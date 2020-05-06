const dictionary = require('./dictionary');
const ship = require('./dictionary.export');
const admin = require('./dictionary.admin');
// const search = require('./search');
const test = require('./test');
// const thesaurus = require("thesaurus");
const pluralize = require("pluralize");
// const WordPOS = require('wordpos'), wordpos = new WordPOS();

exports.main = async () => '?';

exports.wordPos =  async (e) => await dictionary.wordPos(e);
exports.definition =  async (e) => await dictionary.definition(e,false);

// NOTE: admin
// node run export_definition
// synset synmap
exports.export_word = async () => await ship.exportWord();
// ar da de el no ja... except en
exports.export_translation = async (e) => await ship.exportTranslation(e);
// en sense usage
exports.export_definition = async () => await ship.exportDefinition();
// myanmar grammar
exports.export_grammar = async () => await require('./grammar').exportGrammar();
//  MySQL replace sense column format
exports.admin = admin;


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
exports.test_definition = test.definition;
exports.test_match = test.match;
// node run search
exports.search = async (e) => require('./search')(e);
exports.wordbreak = async (e) => require('./wordbreak/')(e);
exports.wordbreak_test = async (e) => require('./wordbreak/test')(e);
// exports.test_keyword = async (e) => await test.keyword(e);
// exports.test_wordbreak = async (e) => await test.wordbreak(e);
// node run orthography
exports.orth_sea = async (e) => await require('./orthCliSea')(e);
exports.orth_ord = async (e) => await require('./orthCliOrd')(e);
// exports.orthography = async (e) => await require('./orthWorkWord')(e);
// exports.visits = async () => require('./visits')();

// NOTE: thesaurus
// node run thesaurus "love"
// exports.thesaurus = async (e) => thesaurus.find(e);

// NOTE: pluralize
exports.plural = async (e) => pluralize.plural(e);
exports.singular = async (e) => pluralize.singular(e);
exports.isPlural = async (e) => pluralize.isPlural(e);
exports.isSingular = async (e) => pluralize.isSingular(e);