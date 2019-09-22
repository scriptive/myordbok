
const app = require('../');
class visits {
  constructor(ip) {
    this.ipAddress = ip;
    this.table = 'visits';
  }
  set(ip){
    return app.sql.query('INSERT INTO ?? (ip,view,locale,lang) VALUES (?,1,?,?) ON DUPLICATE KEY UPDATE view=view+1;',[this.table,ip,'en','en'])
  }
  get(){
    return app.sql.query('SELECT created,count(ip) AS visits_count,sum(view) AS visits_total FROM ??',[this.table]);
  }
  init(res){
    return this.set(this.ipAddress).then(() =>{
      return this.get().then(raw=>{
        if (raw.length > 0) {
            res.visits_count = raw[0].visits_count;
            res.visits_created = raw[0].created;
            res.visits_total = raw[0].visits_total+app.Config.visitsPrevious;
        }
      })
    })
  }
}

module.exports = {visits};