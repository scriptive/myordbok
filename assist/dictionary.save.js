const fs = require('fs');

const {fileName} = require("./dictionary.Config");

module.exports = async function(keyword,lang){
  var addWord = true;
  var file = fileName.zero(lang);
  keyword = keyword.replace(/\W/g, '').toLowerCase();
  function write(){
    var createStream = fs.createWriteStream(file,{flags:'a',encoding:'utf8'});
    createStream.write(keyword);
    createStream.write('\n');
    createStream.end();
  }
  function read(){
    return require('readline').createInterface({
      input: fs.createReadStream(file)
    });
  }

  fs.access(file, (e) => {
    if (e) {
      write();
    } else {
      var reader = read();
      reader.on('line', (word) => {
        if (word == keyword){
          addWord = false;
          reader.close();
          reader.removeAllListeners();
        }
      }).on('close', () => {
        if (addWord) write();
      });
    }
  });
}