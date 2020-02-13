/*
canniness
auditorily
auditory ?
distressfulness
overrealistically
overtrustfully
salutatory salute
contributory - contribute
information - inform
inflammatory - inflame
uncomfortable, uncomfortability, resourcefulness
thoughtfullyness
unbeatable
resourceful
resourcefully
resourcefulness
vapor
inseparable - inseparate
justificatory justify
evaporable - evaporate
deplorable - deplore
negotiable - negotiate
node run testing unthoughtfullyness
node run testing non-negotiable

opportunistical
opportunistically
opportunistic

regulatory
refractory

unsympathetically
sympathetical sympathetic
unluckily
words
*/

const prefix_pattern= /^(^:?over|un|non|re|dis)(.*)/i;
const prefix_pattern_skip = /^(?:disru|dist|rep|ret|res|rew|ref|rela)/i;
const suffix_pattern= /(.*)(ly|tory|ful|ness|less|able)$/i;
/*
amiable
comply family apply daily holy imply jolly only empty molly
*/
const suffix_pattern_skip = /^(^:?fam|am|com|vi|mon|hi|or|aw|ap|eq|h|im|jo|mo|o).?(ly|tory|able|ful)$/i;
// Mosty adjective and adverb
const suffix_root =[
  {
    w:/ness$/, s:[
      // [/(f|n|g|t|r|k|m)i$/,'$1y']
      [/([a-z])i$/,'$1y'],
      // pythoness
      [/(ho)$/,'$1n']
    ]
  },
  {
    w:/ly$/, s:[
      // demonstrably demonstrable demonstrate
      // sympathetically sympathetical sympathetic
      // acoustically acoustical acoustic
      // notably notable note
      // [/(etic)al$/,'$1'],
      // practicably
      // [/(rfu)$/,'$1l'],
      // powerfuly
      [/(rfu)$/,'$1l'],

      [/(tic)al$/,'$1'],
      // amiably amiab amiable ??
      // [/(iab)$/,'$1le'],
      // comfortably, audibly multiply
      [/(ab|ib|mb|ip)$/,'$1le'],
      // curly
      [/(ur)$/,'$1l'],
      // daintily dainty
      [/(t|r|s|a|h|d|z)i$/,'$1y'],
      [/(m)i$/,'$1'],
      // unluckily unluckely
      [/k(e|i)$/,'kly'],
    ]
  },
  {
    w:/able$/, s:[
      // appreciate
      [/(ic|eci|str)$/,'$1ate'],
      [/(oti)$/,'$1ate'],
      [/(por)$/,'$1ate'],
      // sublimable
      [/(lor|put|not|lac|liz|lim|eiv|mov)$/,'$1e'],
      [/(par)$/,'$1ate'],
      // liquefiable - liquefy
      [/([a-z])i$/,'$1y']

    ]
  },
  {
    w:/ful$/, s:[
      // beautiful
      [/(t)i$/,'$1y'],
    ]
  },
  {
    w:/less$/, s:[
      // beautiful
      [/(t)i$/,'$1y'],
    ]
  },
  {
    w:/tory$/, s:[
      [/(m)ma$/,'$1e'],
      [/ta$/,'te'],
      // inhibitory
      [/(di|bi|en|ma|si)$/,'$1t'],
      // introductory introduce
      [/(duc)$/,'$1e'],
      // justificatory justify
      [/(f)ica$/,'$1y'],
      // ambulatory
      // innovatory
      // anticipatory
      // interrogatory
      // celebratory celebrate
      [/(ec|bu|la|ova|pa|ga|bra|da|ia)$/,'$1te'],
      // [/([a-z])i$/,'$1ty']
      // benedictory benedicite
      [/(dic)$/,'$1ite'],
      // satisfactory - satisfice
      [/(f)ac$/,'$1ice'],
      // observatory observe
      [/(v)a$/,'$1e']
    ]
  }
];
var result = [];

function prefixes(str){
  var re = new RegExp(prefix_pattern);
  if (re.test(str)){
    return str.match(re).slice(1)
  }
  return []
}
function suffixes(str){
  var re = new RegExp(suffix_pattern);
  if (re.test(str)){
    return str.match(re).slice(1)
  }
  return []
}

function joiner(str){
  var [word,suffix] = suffixes(str);
  if (suffix_pattern_skip.test(str) == false && suffix){
    suffix_root.filter(
      e=>e.w.test(suffix)
    ).map(
      e=>e.s.find(
        s=>s[0].test(word)
      )
    ).filter(x => x).forEach(function(w){
      word = word.replace(w[0],w[1]);
    });
    // if (suffix_pattern_skip.test(str) == false )
    joiner(word);
    // row.l=word;
    result.push( {w:str,i:2,s:suffix});
    // row.l=word;
    // result.push({w:suffix,i:2});
    // result.push(row);
  } else {
    result.push({w:str,i:1});
  }
}
function start(str){
  result =[];
  var [prefix,word] = prefixes(str);
  if (prefix_pattern_skip.test(str) == false && prefix){
    str = word.replace(/[^a-zA-Z]/gmi, "");
    result.push({w:prefix,i:0});
  }
  joiner(str);
  return result;
}

module.exports = (str) => start(str.toLowerCase());