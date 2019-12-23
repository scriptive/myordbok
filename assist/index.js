const dictionary = require('./dictionary');
const search = require('./search');
// const visits = require('./visits');
const thesaurus = require("thesaurus");
const pluralize = require("pluralize");

const WordPOS = require('wordpos'), wordpos = new WordPOS();

// NOTE: mean
exports.suggestion = async (e,l) => dictionary.suggestion(e,l);
exports.definition = async (e) => dictionary.definition(e);
exports.translation = async (e,l) => dictionary.translation(e,l);
exports.search = async (e) => search(e);

// NOTE: lang
exports.getLangDefault = () => dictionary.getLangDefault;
exports.getLangByName = (e) => dictionary.getLangByName(e);
exports.getLangById = (e) => dictionary.getLangById(e);

// NOTE: thesaurus
exports.thesaurus = async (e) => thesaurus.find(e);

// NOTE: pluralize
exports.plural = async (e) => pluralize.plural(e);
exports.singular = async (e) => pluralize.singular(e);
exports.isPlural = async (e) => pluralize.isPlural(e);
exports.isSingular = async (e) => pluralize.isSingular(e);

// NOTE: wordpos getPos findPos
exports.pos = async (e) => wordpos.getPOS(e);
exports.lookup = async (e) => wordpos.lookup(e);

// NOTE: visits
exports.visits = require('./visits');
// exports.visitsCreated = visits.created;
// exports.visitsRestart = visits.restart();