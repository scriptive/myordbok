const {root,config,utilities} = require('./root.Config');
export default {
  help:function(){
    this.form(root.Element.data('word')).appendTo(root.Element);
    // console.log(root.Element.data('word'));
  },
  suggest:function(){
    // this.form().appendTo(root.Element.parent().parent());
    root.Element.parent().replaceWith(this.form(root.Element.data('word')));
  },

  form:function(word){
   var tN = config.tag;
    return $(tN[0],{method:'POST'}).append(
      $(tN[4]).append(
        $(tN[1],{type:'text',name:'word',value:word})
      ),
      $(tN[4]).append(
        $(tN[10]).html('Meaning'),
        $(tN[3],{name:'sense'})
      ),
      $(tN[4]).append(
        $(tN[10]).html('Example'),
        $(tN[3],{name:'exam'})
      ),
      $(tN[5]).html(''),
      $(tN[4],{class:'submit'}).append(
        $(tN[1],{type:'submit',name:'submit',value:'Post'}),
        $(tN[1],{type:'reset',value:'Reset'})
      )
      // $(tN[4],{class:'cancel'}).append(
      //   $(tN[1],{type:'reset',value:'Cancel'})
      // ),
    ).on('submit',this.submit);
  },

  submit:function(event){
    event.preventDefault();
    var form = $(this);
    var msgContainer = form.children('p');
    msgContainer.html('...a moment please').removeClass();
    // var msgContainer = form.parent();
    // msgContainer.html('Thank you').addClass('done');
    // msgContainer.html('fail').addClass('fail');
    // form.children('div').hide();


    $.post(root.url([config.api,'post']),utilities.serializeObject($(this)), function() {
      // console.log( "success" );
    }).done(function(response) {
      msgContainer.html(response.msg).addClass(response.status);
      if (response.status == 'done') {
        form.children('div').hide();
      }
    }).fail(function(xhr, textStatus, error) {
      msgContainer.html(error).addClass('fail');
    }).always(function() {
    });
  }
}
/*
var jqxhr = $.post( "example.php", function() {
  // alert( "success" );
}).done(function() {
  // alert( "second success" );
}).fail(function() {
  // alert( "error" );
}).always(function() {
  // alert( "finished" );
}).always(function() {
  // alert( "second finished" );
});
*/