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
    glossary:{
      word:'en.json',
      sense:'sense.json',
      usage:'usage.json',
      grammar:'grammar.json'
    }
  }
};