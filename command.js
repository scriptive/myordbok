const app = require('.');
// const {utility} = app.Common;
const assist = require('./assist/cli');
const fn = app.Param.shift() || 'main';

module.exports = async function(){
  if (typeof assist[fn] != 'function') {
    throw {code:fn,message:typeof assist[fn]};
  }
  try {
    return await assist[fn](app.Param[0]);
  } catch (error) {
    throw error
  }
}