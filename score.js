module.exports = {
  score:{
    styleMiddleWare: {
      // prefix: '/css',
      indentedSyntax: false,
      // debug: true,
      response:false,
      // NOTE: nested, expanded, compact, compressed
      // outputStyle: 'compressed',
      sourceMap: false
    },
    scriptMiddleWare: {
      prefix:'/jsmiddlewareoutput'
    }
  }
};