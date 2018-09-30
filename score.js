module.exports = {
  score:{
    styleMiddleWare_: {
      prefix: '/css',
      indentedSyntax: false,
      // debug: true,
      response:false,
      // NOTE: nested, expanded, compact, compressed
      // outputStyle: 'compressed',
      sourceMap: false
    },
    scriptMiddleWare_: {
      prefix:'/jsmiddlewareoutput'
    },
    styleMiddleWare:false,
    scriptMiddleWare:false
  }
};