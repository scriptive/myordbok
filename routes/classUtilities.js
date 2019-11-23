
const app = require('..');
class visits {
  constructor(ip) {
    this.ipAddress = ip;
    this.table = 'visits';
  }
  insert(){
    // return app.sql.query('INSERT INTO ?? (ip,view,locale,lang) VALUES (?,1,?,?) ON DUPLICATE KEY UPDATE view=view+1;',[this.table,this.ipAddress,'en','en'])
    return app.sql.query('INSERT INTO ?? (ip,view) VALUES (?,1) ON DUPLICATE KEY UPDATE view=view+1;',[this.table,this.ipAddress])
  }
  async select(){
    return app.sql.query('SELECT created,count(ip) AS visits_count,sum(view) AS visits_total FROM ??',[this.table]).then(([row])=>row);
  }
  async init(res){
    this.insert();
    await this.select().then(row=>{
      if (row) {
        res.visits_count = row.visits_count;
        res.visits_created = row.created.toISOString().slice(0,10).replace(/-/g,"/");
        res.visits_total = String(row.visits_total+app.Config.visitsPrevious).replace(/(?<!\..*)(\d)(?=(?:\d{3})+(?:\.|$))/g, '$1,');
      }
    });

    // res.visits_count = 234;
    // res.visits_created = new Date().toISOString().slice(0,10).replace(/-/g,"/");
    // res.visits_total = app.Config.visitsPrevious;

    // app.sql.join(
    //   'UPDATE ?? SET view=view+1 WHERE ip=?', [this.table,this.ipAddress]
    //   // 'UPDATE ?? SET view=view+1 WHERE id=?', [this.table,1]
    // ).then(
    //   e=> {
    //     console.log(e.result.affectedRows)
    //     if (!e.result.affectedRows){
    //       e.query('INSERT INTO ?? (ip,view) VALUES (?,1);',[this.table,this.ipAddress])
    //     }
    //   }
    // );
  }

  /*
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
  */
}

module.exports = {visits};