/*
npm run task -- --app=myordbok --script=scan
https://translate.google.com/translate_t?source=dict-chrome-ex&sl=en&tl=my&q=love
https://clients5.google.com/translate_a/t?client=dict-chrome-ex&sl=en&tl=my&q=love
https://www.google.com/search?source=dict-chrome-ex&defl=my&hl=en&q=love&tbo=1&tbs=dfn:1
https://www.google.com/search?q=define love
*/
var request = require('request');
var ini = require('ini');
var process=require('process');
var config={
  alphabet:[
    'က','ခ','ဂ','ဃ','င',
    'စ','ဆ','ဇ','ဈ','ည',
		'ဋ','ဌ','ဍ','ဎ','ဏ',
		'တ','ထ','ဒ','ဓ','န',
		'ပ','ဖ','ဗ','ဘ','မ',
		'ယ','ရ','လ','ဝ','သ',
    'ဟ','ဠ','အ'
  ],
  number:['၁','၂','၃','၄','၅','၆','၇','၈','၉','၀'],
  words:[]
};
class init {
  start() {
    config.environment = ini.parse(fs.readFileSync(path.join(rootApp,'environment.ini'), 'utf-8'));
    this.initWord();
  }
  initWord() {
    if (config.alphabet.length > 0) {
      var currentAlphabet = config.alphabet.shift();
      config.wordDirectory = path.join(rootTask,'define',currentAlphabet);
      this.getWord(currentAlphabet);
    } else {
      console.log('completed');
    }
  }
  getWord(q) {
    request.get({
        url: config.environment.api.wordlists.replace('$',encodeURIComponent(q))
      }, (err, res, data) => {
        if (err) {
          console.log('Error:', err);
        } else if (res.statusCode !== 200) {
          console.log('Status:', res.statusCode);
        } else {
          config.wordDirectory = path.join(rootTask,'define',q);
          fs.ensureDir(config.wordDirectory, err => {
            console.log(q);
            config.words=data.split(/\r?\n/g);
            this.initDefine();
          });
        }
    });
  }
  initDefine() {
    if (config.words.length > 0) {
      var currentWord = config.words.shift();
      // console.log('this first word ',currentWord);
      this.getDefine(currentWord);
    } else {
      // NOTE: back to initWord
      this.initWord();
    }
  }
  logRequested(msg) {
    // process.stdout.write(`...requested ${msg}`);
    process.stdout.write(`.`);
  }
  logRequesting(msg) {
    process.stdout.write(`${msg}\n`);
  }
  logStop(msg) {
    process.stdout.write(`${msg}`);
  }
  getDefine(q) {
    var wordFile = path.join(config.wordDirectory,q+'.json');
    if (fs.existsSync(wordFile)) {
      // NOTE: file already requested
      this.logRequested(q);
      this.initDefine();
    } else {
      // NOTE: requesting new definition
      this.logRequesting(q);
      request.get({
        url: config.environment.api.translate.replace('$',encodeURIComponent(q)),
        json: true
        // headers: {'User-Agent': 'request'}
      }, (err, res, json) => {
        if (err) {
          this.logStop(err + ' on '+q);
        } else if (res.statusCode !== 200) {
          this.logStop(res.statusCode + ' on '+q);
        } else {
          fs.writeJson(wordFile, json, err=>{
            if (err) {
              this.logStop(err);
            } else {
              this.initDefine();
            }
          });
        }
      });
    }
  }
}
module.exports = init;
