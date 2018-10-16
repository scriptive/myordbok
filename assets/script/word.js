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
    return $('<form>',{method:'POST'}).append(
      $('<div>').append(
        $('<input>',{type:'text',name:'word',value:word})
      ),
      $('<div>').append(
        $('<span>').html('Meaning'),
        $('<textarea>',{name:'sense'})
      ),
      $('<div>').append(
        $('<span>').html('Example'),
        $('<textarea>',{name:'exam'})
      ),
      $('<p>').html(''),
      $('<div>',{class:'submit'}).append(
        $('<input>',{type:'submit',name:'submit',value:'Post'}),
        $('<input>',{type:'reset',value:'Reset'})
      )
      // $('<div>',{class:'cancel'}).append(
      //   $('<input>',{type:'reset',value:'Cancel'})
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


    var jqxhr = $.post(root.url([config.api,'post']),utilities.serializeObject($(this)), function() {
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