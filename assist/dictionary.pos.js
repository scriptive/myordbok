const app = require('..');
const {glossary} = app.Config;
const {utility} = app.Common;

// const {table,docket,makeup,fileName,chat} = require("./dictionary.Config");
const {docket,chat} = require("./dictionary.Config");

const posName = (Id) => app.Config.synmap.find(i=> i.id == Id).name;

const partOf = function(associate,raw){
  utility.arrays.category(associate, e => e.term).forEach(
    (grammar,term) => utility.arrays.category(grammar, e => e.t).forEach((row,gId)=>{
      var dId = (gId == 1 && row.length == 3)?3:0;
      var value = row.map(
        e => '(-~-) {-*-} (?)'.replace('*',e.v).replace('?',posName((dId == e.d)?0:e.d))
      ).join('; ');
      raw.push({
        term:term,
        pos:app.Config.synset[gId].name,
        type:'meaning',
        kind:['partof'],
        v:value,
        exam:[]
      })
    })
  );
}
const formOf = function(associate,raw,keyword){
  utility.arrays.category(associate, e => e.term).forEach(
    (grammar,term) => utility.arrays.category(grammar, e => e.t).forEach((row,gId)=>{
      var posOf = row.find(
        e => chat.compare(e.v,keyword)
      );
      if (!posOf) return;

      var dId = (gId == 1 && row.length == 3)?0:posOf.d;
      var tpl = {
        main:'(-~-) $formOf; form of {-$word;-}',
        // main:'~ $keyword; is $formOf; form of {-$word;-}',
        // keyword:posOf.v,
        formOf:posName(dId),
        word:term
      };

      var value = tpl.main.replace(/\$(.+?);/g,(_,e)=>tpl[e]||'-?-');
      raw.push({
        term:posOf.v,
        pos:app.Config.synset[gId].name,
        type:'meaning',
        kind:['formof'],
        v:value,
        exam:[]
      })
    })
  );
}
const rootOf = function(row){
  return row.filter(
    (v, i, a) => a.indexOf(v) === i
  );
  // result.root = form.map(
  //   e => e.v
  // ).filter(
  //   (v, i, a) => a.indexOf(v) === i
  // );
}

exports.main = async function(keyword,pluralize_attempt=false){
  const synset = await docket.get(glossary.synset);
  const synmap = await docket.get(glossary.synmap);
  const result = {root:[],form:[],kind:[]};

  var form = synmap.filter(
    s => chat.compare(s.v,keyword) && s.t < 10 && synset.filter(e=>e.w == s.w).length
  ).map(
    o => synset.find(s=>s.w == o.w)
  ).filter(
    (v, i, a) => a.indexOf(v) === i
  );
  if (form.length > 0) {
    var formAssociate = synmap.filter(
      m => m.d > 0 && form.filter(e=>e.w == m.w).length
    ).map(
      o => Object.assign({},o,{term:form.find(e=>e.w == o.w).v})
    );
    partOf(formAssociate,result.kind);
    formOf(formAssociate,result.form,keyword);
    result.root = rootOf(form);
  }

  var pos = synset.filter(
    s => chat.compare(s.v,keyword)
  );
  if (pos.length > 0) {
    var posAssociate = synmap.filter(
      m => m.d > 0 && pos.filter(e=>e.w == m.w).length
    ).map(
      o => Object.assign({},o,{term:pos.find(e=>e.w == o.w).v})
    );
    partOf(posAssociate,result.form);
    if (result.root.length == 0) {
      result.root = rootOf(pos);
    }
  }

  return result;
}

exports.admin_pos = async function(keyword){
  const synset = await docket.get(glossary.synset);
  const synmap = await docket.get(glossary.synmap);
  var result = {
    // root, pos, form
    form:[], root:[]
  };

  var root = synset.filter(
    s => chat.compare(s.v,keyword)
  )

  result.pos = synmap.filter(
    m => m.d > 0 && root.filter(e=>e.w == m.w).length
  ).map(
    o => Object.assign({},o,{term:root.find(s=>s.w == o.w).v})
  );

  result.root = root.map(
    e => e.v
  ).filter(
    (v, i, a) => a.indexOf(v) === i
  );
  return result;
}
exports.admin_base = async function(keyword){
  const synset = await docket.get(glossary.synset);
  const synmap = await docket.get(glossary.synmap);
  var result = {
    form:[], root:[]
  };

  result.pos = synmap.filter(
    s => chat.compare(s.v,keyword) && s.t < 10 && synset.filter(e=>e.w == s.w).length
  ).map(
    // e => {
    //   e.w = synset.find(s=>s.w == e.w).v
    //   return e;
    // }
    o => Object.assign({},o,{term:synset.find(s=>s.w == o.w).v})
  );

  result.root =  result.pos.map(
    e => e.term
  ).filter(
    (v, i, a) => a.indexOf(v) === i
  );
  return result;
}