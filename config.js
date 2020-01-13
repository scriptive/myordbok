module.exports = {
  config:{
    name: 'MyOrdbok',
    // description: 'package.description',
    // version: 'package.version',
    locale:[
      {id:'en',name:'English',default:true},
      // {id:'no',name:'Norwegian'},
      // {id:'my',name:'Myanmar'},
      // {id:'zo',name:'Zolai'}
    ],
    dictionaries:[
      {
        name:'International',lang:[
          {id:"en",name:"English",default:true},
          {id:"iw",name:"Hebrew"},
          {id:"el",name:"Greek"},
          {id:"pt",name:"Portuguese"},
          {id:"fr",name:"French"},
          {id:"nl",name:"Dutch"},
          {id:"ar",name:"Arabic"},
          {id:"es",name:"Spanish"}
        ]
      },
      {
        name:'Europe',lang:[
          {id:"no",name:"Norwegian"},
          {id:"fi",name:"Finnish"},
          {id:"ro",name:"Romanian"},
          {id:"pl",name:"Polish"},
          {id:"sv",name:"Swedish"},
          {id:"da",name:"Danish"},
          {id:"de",name:"German"},
          {id:"ru",name:"Russian"}
        ]
      },
      {
        name:'Asia',lang:[
          {id:"ja",name:"Japanese"},
          {id:"zh",name:"Chinese"},
          {id:"ko",name:"Korean"},
          {id:"ms",name:"Malay"},
          {id:"tl",name:"Filipion"},
          {id:"vi",name:"Vietnamese"},
          {id:"th",name:"Thai"},
          {id:"hi",name:"Hindi"}
        ]
      }
    ],
    synset:[
      'Noun','Verb','Adjective','Adverb',
      'Preposition','Conjunction','Pronoun','Interjection','Abbreviation','Prefix',
      'Combining form','Phrase','Contraction',
      'Adjective suffix','Noun suffix','Verb suffix',
      'Acronym','Article','Int'
    ],
    synmap:[
      { id: 1, type: 0, name: "Plural"},
      { id: 2, type: 1, name: "3rd Person"},
      { id: 3, type: 1, name: "Past Tense" },
      { id: 4, type: 1, name: "Past Participle"},
      { id: 5, type: 1, name: "Present Participle"},
      { id: 6, type: 2, name: "Comparitive"},
      { id: 7, type: 2, name: "Superlative"},
      { id: 8, type: 1, name: "1st Person"},
      { id: 9, type: 1, name: "2nd Person"},
      { id: 10, type: 1, name: "Plural Past"}
    ],
    glossary:{
      word:'en.json',
      sense:'sense.json',
      usage:'usage.json',
      synset:'synset.json', // words
      synmap:'synmap.json' //derives
    }
  }
};