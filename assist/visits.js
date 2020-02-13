const app = require('..');
const path = require('path');
const fs = require('fs');
const {media} = app.Config;
/*
const file = path.join(media,'log','myordbok.visits.log');
const formatData = (e) => new Date(e*1000).toISOString().slice(0,10).replace(/-/g,"/");
const formatNumber = (e) => e.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');

const visits={};
module.exports = function() {
  if (!Object.keys(visits).length) {
    if (fs.existsSync(file)){
      var log = fs.readFileSync(file).toString().split('\n').filter(e=>e).map(e=>e.split(' '));
      const [created,user,request,by,total] = new Set([].concat.apply([], log));
      visits.created = formatData(created);
      visits.user = formatNumber(user);
      visits.request = formatNumber(request);
      visits.by = formatNumber(by);
      visits.total = formatNumber(total);
    }
  }
  return visits;
}
*/
const file = path.join(media,'log','myordbok.visit.log');
const formatData = (e) => new Date(e*1000).toISOString().slice(0,10).replace(/-/g,"/");
const formatNumber = (e) => e.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');

const visits={};
module.exports = function() {
  if (!Object.keys(visits).length) {
    if (fs.existsSync(file)){
      // {'id':0,'item':0,'count':0,'total':0,'sum':0,'new':0}
      const [created,user,request,by,total,fresh] = fs.readFileSync(file).toString().split(',');
      visits.created = formatData(created);
      visits.user = formatNumber(user);
      visits.request = formatNumber(request);
      visits.by = formatNumber(by);
      visits.total = formatNumber(total);
      visits.fresh = formatNumber(fresh);
    }
  }
  return visits;
}