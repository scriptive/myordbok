const Common = require.main.exports;

// console.log(Common.test)
module.exports = {
  main(){
    this.mongo.db().then(e=>e.collection('documents').find({}).toArray()).then(e=>console.log(e))
    console.log('ok main',this.args)
  },
  async test_mongo(){
    // await this.mongo.db().then(async e=>{
    //   var doc = await e.collection('documents').find({}).toArray();
    //   console.log(doc)
    //   // resolve();
    // })
    var raw = await this.mongo.db().then(e=>e.collection('documents').find({}).toArray())
    // var raw = await this.mongo.connection.db().collection('documents').find({}).toArray()

    // var raw = await this.mongo.connection.db().then(e=>e.collection('documents').find({}).toArray())
    // var raw = await this.mongo.connection.db().collection('documents').find({}).toArray()
    // var raw = await this.mongo.query().then(e=>e.collection('documents').find({}).toArray())
    // var raw = await this.mongo.db.collection('documents').find({}).toArray()
    // var raw = await this.mongo.client.collection('documents').find({}).toArray()
    console.log(raw)
    // await this.mongo.db().then(e=>e.collection('documents').find({}).toArray()).then(e=>console.log(e))
  },
  async test_sql(){
    // await this.sql.query('SELECT created,count(ip) AS visits_count,sum(view) AS visits_total FROM visits').then(raw=>{
    //   if (raw.length > 0) {
    //     console.log(raw[0])
    //   }
    // });
    var raw = await this.sql.query('SELECT created,count(ip) AS visits_count,sum(view) AS visits_total FROM visits').then(raw=>raw);
    console.log(raw)
  },
  test_promise(){
    return new Promise((resolve,reject)=>{
      console.log('test -> promise');

      resolve();
      // reject('error?');
    })
  }
}
// module.exports = function(app){
//   return new Promise((resolve,reject)=>{
//     app.mongo.db().then(e=>{
//       e.collection('documents').find({}).toArray(function(err,doc) {
//         console.l
// og(doc)
//         resolve()
//       });
//     }).catch(
//       e=>reject(e)
//     );
//   });
// };
// module.exports = {
//   async main(app){
//     await app.mongo.db().then(async e=>{
//       var doc = await e.collection('documents').find({}).toArray();
//       console.log(doc)
//       return 'Ok'
//       // resolve();
//     })
//   }
// };
// module.exports = {
//   main(app){
//     return new Promise( async (resolve,reject)=>{
//       var abc = await app.mongo.db().then(e=>{
//         // return e.collection('documents').find({}).toArray(function(err,doc) {
//         //   console.log(err,doc)
//         //   // resolve()
//         //   return doc;
//         // });
//         resolve();
//         return e.collection('documents').find({}).toArray();
//         // return e.collection('documents').find({});
//       }).catch(
//         e=>reject(e)
//       );
//       console.log(abc)
//     });
//   }
// };
