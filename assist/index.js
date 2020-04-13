const dictionary = require('./dictionary');
const orthography = require('./orthography');
const thesaurus = require("thesaurus");
const pluralize = require("pluralize");
const grammar = require("./grammar");

// NOTE: mean
exports.suggestion = async (e,l) => await dictionary.word(e,l);
exports.definition = async (e) => dictionary.definition(e);
exports.translation = async (e,l) => dictionary.translation(e,l);
exports.search = require('./search');

// NOTE: lang
exports.getLangDefault = () => dictionary.getLangDefault;
exports.getLangByName = dictionary.getLangByName;
exports.getLangById = dictionary.getLangById;
exports.getLangList = () => dictionary.getLangList;
exports.getLangCount = () => dictionary.getLangCount;
exports.getGrammar = async () => dictionary.getGrammar();
exports.getInfo = dictionary.getInfo;

// NOTE: visits
exports.visits = require('./visits');

// NOTE: grammar
exports.grammarMain = grammar.main;
exports.grammarPos = grammar.pos;

// NOTE: myanmar Orthgraphy, etymology
exports.orthCharacter = orthography.character;
exports.orthWord = orthography.word;
exports.orthSense = orthography.sense;
exports.orthSyllable = orthography.syllable;
exports.orthBreak = orthography.break;

// NOTE: speech
exports.speech = require('./speech');

// NOTE: thesaurus
exports.thesaurus = async (e) => thesaurus.find(e);

// NOTE: pluralize
exports.plural = async (e) => pluralize.plural(e);
exports.singular = async (e) => pluralize.singular(e);
exports.isPlural = async (e) => pluralize.isPlural(e);
exports.isSingular = async (e) => pluralize.isSingular(e);
