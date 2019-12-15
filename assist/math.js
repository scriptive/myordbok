const app = require('..');

const mathJs = require('mathjs');

module.exports = function (num){
  registry.math={};
   try {
     let equation = mathJs.eval(num);
     if (utility.check.isObject(equation)){
      registry.math = equation;
      // registry.math = [JSON.parse(JSON.stringify(equation))];

     } else {
      // if (utility.check.isNumeric(equation) && equation != parseInt(num))
      registry.math = {
        equation: equation
      };
      // if (equation != parseInt(equation)){
      //   // registry.math.abc=requestNumeric(parseInt(equation));
      //   var abc = requestNumeric(parseInt(equation))
      //   Object.assign(registry.math,abc)
      // }

      // registry.math = [
      //   {
      //     equation:equation
      //   }
      // ];
     }

     return Object.keys(registry.math).length;

    //  if (equation) return true;

   } catch (e) {
     return false;
   }

}
