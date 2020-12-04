const app = require('..');
const path = require('path');
const {media} = app.Config;
// const {utility,Burglish} = app.Common;

const directory = path.join(media,'grammar');

const filePos = 'pos-*.json';
const fileContext = '*.json';
const online = fileContext.replace('*','_live');

const writeJSON = async (file,raw) => await fs.promises.writeFile(path.join(directory,file), JSON.stringify(raw,null,2)).then(()=>true).catch(()=>false);
const readJSON = async (file) => await fs.promises.readFile(path.join(directory,file)).then(JSON.parse).catch(()=>{});
const uniqueName = (name) => name.match(/[a-zA-Z]+|[0-9]+(?:\.[0-9]+|)/g).join('.').toLowerCase();

exports.main = async () => await readJSON(online);
exports.pos = async (id) => await readJSON(filePos.replace('*',uniqueName(id)));

exports.exportGrammar = async () => {
  var raw = await readJSON(fileContext.replace('*','structure'));
  var structure = raw.structure;
  for (const pos of structure.file) {
    if (pos.hasOwnProperty('child')){
      for (const name of pos.child) {
        var name_unique = uniqueName(name);
        // var file = pos.name.replace('*',name_unique);
        var file = filePos.replace('*',name_unique);
        var row = await readJSON(file);
        var rowId = (row.info.status > 0)?pos.id:'other';
        // row.info.uniqueId = row.info.name.replace(/\s/g,'.').toLowerCase();
        delete row.info.status;
        delete row.root.note;
        if (!raw.hasOwnProperty(rowId)){
          raw[rowId]=[];
          raw.chapter.push(rowId)
        }
        // raw[rowId].push(row)
        raw[rowId].push((({ info, root }) => ({ info, root }))(row))
      }
    } else {
      // var file = pos.name.replace('*',pos.id).toLowerCase();
      var file = fileContext.replace('*',pos.id).toLowerCase();
      raw.chapter.push(pos.id)
      raw[pos.id] = await readJSON(file);
    }
  }
  // console.log('grammar export',raw,structure)
  delete raw.structure;
  await writeJSON(online,raw);
  console.log('done')
}
