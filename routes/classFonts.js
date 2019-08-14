const {Config,Common} = require('../');
const path = require('path');
const {fs} = Common;
const ttfInfo = require('ttfinfo');
var util = require('util');

class ttf {
  constructor(type) {
    this.store = {};
    this.type = type;
    this.fontDir = path.join(Config.storage,'media','fonts');
  }

  fileJSON(e) {
    e = e || this.type;
    return path.join(this.fontDir,e+'.json');
  }

  read(fileName) {
    fileName = fileName || this.type;
    if (this.store.hasOwnProperty(fileName)){
      return this.store[fileName];
    } else {
      let file = this.fileJSON(fileName);
      var data = fs.readJsonSync(file,{throws:false});
      if (data && data instanceof Array) {
        return this.store[fileName] = data;
      }
      return [];
    }
  }

  write(fileName) {
    if (this.store.hasOwnProperty(fileName)){
      let file = this.fileJSON(fileName);
      fs.writeJsonSync(file, this.store[fileName], err => {
        console.log('success!')
      });
    }
  }

  fileFont(name) {
    return path.join(this.fontDir,this.type,name);
  }

  async view(fileName) {
    var response = null;
    var item = null;
    if (this.type && fileName){
      var reader = util.promisify(ttfInfo);
      var file = this.fileFont(fileName);
      await this.read(this.type);
      if (this.store.hasOwnProperty(this.type)){
        var index = this.store[this.type].findIndex(x => x.file == fileName);
        if (index >= 0){
          item = this.store[this.type][index];
          if (item instanceof Object){
            this.store[this.type][index].view++;
            this.sortable();
            this.write(this.type);
          }
        }
      }
      await reader(file).then(async (e)=>{
        if (e && e.hasOwnProperty('tables')) {
          response = await this.view_response(e.tables.name);
          if (item instanceof Object && !item.hasOwnProperty('restrict')){
            response.unrestrict = true;
          }
        }
      }).catch(function(){
        return true;
      });
    }
    return response;
  }

  async download(fileName) {
    if (this.type && fileName){
      await this.read(this.type);
      if (this.store.hasOwnProperty(this.type)){
        var index = this.store[this.type].findIndex(x => x.file == fileName);
        if (index >= 0){
          var item = this.store[this.type][index];
          if (item instanceof Object && !item.hasOwnProperty('restrict')){
            this.store[this.type][index].download++;
            this.sortable();
            this.write(this.type);
            return this.fileFont(fileName);
          }
        }
      }
    }
    return null;
  }

  async view_response(e) {
    var abc = {
      0: 'Copyright',
      1: 'Font Family',
      2: 'Font Subfamily',
      3: 'Unique identifier',
      4: 'Full name',
      5: 'Version',
      6: 'Postscript name',
      7: 'Note',
      8: 'Company',
      9: 'Owner',
      10: 'Description',
      11: 'URL',
      12: 'URL',
      13: 'License',
      14: 'URL',
      // 15: '',
      16: 'Name'
      // 17: ''
    };
    // info description license, url
    var response={
      // title:null,
      // keywords:null,
      // description:null,
      info:[],
      // description:[],
      // license:[],
      // url:[]
    };
    for (const i in e) {
      if (e.hasOwnProperty(i)) {
        const context = e[i].trim();
        var paragraphs = context.replace('~\r\n?~', "\n").split('\n').map(i=>i.trim()).filter( i => i != null && i != "" );
        if (paragraphs.length > 1) {
          var id = (i == 10)?'definition':'license';
          response[id]=[];
          for (const eP in paragraphs) {
            if (paragraphs.hasOwnProperty(eP)) {
              var text = paragraphs[eP].trim();
              var testH = /^[^a-z]*$/.test(text);
              var tagName = testH?text.split(' ').length>4?'p':'h3':'p';
              response[id].push({tag:tagName,text:text});
            }
          }
        } else if(context) {
          if (/^s?https?:\/\/[-_.!~*'()a-zA-Z0-9;\/?:\@&=+\$,%#]+$/.test(context)){
            if (!response.hasOwnProperty('url'))response.url=[];
            response.url.push({href:context,text:context});
          } else if (i > 0 && i < 6) {
            var className = abc[i].replace(' ','-').toLowerCase();
            var tagName = 'h'+i;
            response.info.push({tag: tagName,class: className,text: context});
          } else {
            if (abc.hasOwnProperty(i)){
              if (i == 0 || i == 7) {
                if (!response.hasOwnProperty('definition'))response.definition=[];
                var paragraphs = context.replace(/---+/, "\n").split('\n').map(i=>i.trim()).filter( i => i != null && i != "" );
                for (const eP in paragraphs) {
                  if (paragraphs.hasOwnProperty(eP)) {
                    var text = paragraphs[eP].trim();
                    var tagName = /^[^a-z]*$/.test(text)?text.split(' ').length>4?'p':'h3':'p';
                    response.definition.push({tag:tagName,text:text});
                  }
                }
              } else if (i == 13) {
                if (!response.hasOwnProperty('license'))response.license=[];
                var tagName = /^[^a-z]*$/.test(text)?text.split(' ').length>4?'p':'h3':'p';
                response.license.push({tag:tagName, text: context});
              } else {
                var className = abc[i].replace(' ','-').toLowerCase();
                response.info.push({
                  tag:'p',
                  class:className,
                  text: context
                });
              }
            }
          }
        }
        if (!response.hasOwnProperty('meta'))response.meta={};
        if (i == 1) {
          response.title =context.replace('_',' ');
          response.keywords = context.replace('_',',');
          response.description = context;
        } else if (i == 7 && context) {
          response.description = context;
        } else if (i == 4 && context) {
          response.description = context;
        }
      }
    }
    return response;
  }

  async scan(fontParam) {
    var json = this.read();
    var directory = path.join(this.fontDir,this.type);
    var read_dir = util.promisify(fs.readdir);
    var read_ttf = util.promisify(ttfInfo);
    this.read('restrict');

    var asyncFile = async (files) => {
      this.store[this.type]=[];
      for(const fileName of files){
        await read_ttf(path.join(directory,fileName)).then(o=>{
          if (o && o.hasOwnProperty('tables')) {
            var item = {
              file:fileName,
              name:o.tables.name[1],
              version:o.tables.name[5] || o.tables.name[3],
              family:o.tables.name[2],
              view:0,
              download:0
            };
            if (fontParam == fileName){
              var indexRestrict = this.store.restrict.indexOf(item.name);
              if (indexRestrict>=0){
                this.store.restrict.splice(indexRestrict, 1);
              } else {
                this.store.restrict.push(item.name);
              }
            }
            if (this.store.restrict.indexOf(item.name)>=0){
              item.restrict=true;
            }
            var tmp = json[json.findIndex(x => x.file == fileName)];
            if (tmp && tmp instanceof Object){
              item.view=tmp.view;
              item.download=tmp.download;
            }
            this.store[this.type].push(item);
          }
        },function(e){
          console.log(e);
        });
      }
      this.sortable();
      this.write(this.type);
      this.write('restrict');
      return this.store[this.type];
    };
    return read_dir(directory).then(files=>asyncFile(files));
  }

  sortable() {
    return this.store[this.type] = this.store[this.type].sort(function(a,b){
      return (b.download + b.view)-(a.download + a.view);
    });
  }

}

module.exports = {ttf};