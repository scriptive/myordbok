const {root,config,utilities} = require('./root.Config');
let admin = {
  edit:function(){
    if (root.Element.children().length){
      root.Element.children().toggle();
    } else {
      root.Element.append(
        $('<span>',{class:'icon-tag'}).on(root.Click,function(event){
          admin.Id = $(this).parent().attr('id');
          if (admin.Id) {
            admin.editPanel();
          }
          event.preventDefault();
          event.stopPropagation()
        })
      );
    }
  },
  add:function(){
    this.Id=root.Element.attr('id');
    this.editPanel();
    console.log(this.Id);
  },
  editContainer:function(){
    var container = $('body').children('div.editor');
    // if (container.is(":hidden"))container.fadeIn('fast');
    if (!container.length){
      container = $('<div>',{class:'editor'});
      $('body').append(container.append($('<p>',{class:'animate-spin icon-loading'})));
    }
    // return this.elementEontainer=container;
    return container;
  },
  editPanel:function(){
    var primary = $('body').children('div.primary'), element=this.editContainer();
    var hideElement = function(){
      element.removeAttr('style').hide();
      primary.removeAttr('style');
    };
    var showElement = function(){
      element.fadeIn('fast');
      if ($(root.doc).width() <= 736){
        primary.css({width:'100%',position: 'fixed'}).animate({right:'+=300px'});
        var openPrimary = function(evt){
          if (!$(evt.target).closest(element).length) {
            hideElement();
            $(root.doc).off(root.Click,openPrimary);
          }
        };
        $(root.doc).on(root.Click,openPrimary);
      } else {
        primary.css('margin-right','300px');
      }
    };
    if (element.find(root.form(this.Id)).length){
      if (element.is(':visible')){
        hideElement();
      } else {
        showElement();
      }
    } else {
      element.addClass('wait');
      $.ajax({type: "POST", url: root.url([config.api,'editor']), data: {q:this.Id},dataType: 'json'}).done(function(response) {
        element.append(admin.editForm(response));
      }).fail(function(xhr, textStatus, error) {
        console.log(textStatus);
      }).always(function(xhr, textStatus, error) {
        element.removeClass('wait');
      });
      showElement();
    }
  },
  editForm:function(r){
    return $('<form>',{method:'POST',name:r.rows.id,id:'update'}).append(
      $('<div>').append(
        $('<input>',{type:'text',name:'word',value:r.rows.word})
      ),
      $('<div>').append(
        $('<span>').html('Meaning'),
        $('<textarea>',{name:'sense'}).html(r.rows.sense)
      ),
      $('<div>').append(
        $('<span>').html('Example'),
        $('<textarea>',{name:'exam'}).html(r.rows.exam)
      ),
      $('<div>').append(
        $('<span>').html('seq'),
        $('<input>',{type:'text',name:'seq',value:r.rows.seq})
      ),
      $('<div>').append(
        $('<select>',{name:'tid'}).html(this.editFormSelect(r.grammar,r.rows.tid))
      ),
      $('<p>').html(''),
      $('<div>',{class:'submit'}).append(
        $('<input>',{type:'hidden',name:'id',value:r.rows.id}),
        $('<button>',{type:'submit',id:'update',text:'Update'}),
        $('<button>',{type:'submit',id:'insert',text:'Insert'}),
        $('<button>',{type:'submit',id:'delete',text:'Delete'})
      )
    ).on('submit',this.editPost);

  },
  editFormSelect:function(row,tid){
    return $.map( row, function( v, k ) {
      var attr = {value:k,text:v};
      if (k == tid) {
        attr['selected']='selected';
      }
      return $('<option>',attr);
    });
  },
  editPost:function(event){
    event.preventDefault();
    var element = $('body').children('div.editor').addClass('wait');
    var form = $(this);
    var msgContainer = form.children('p');
    var task = $(root.doc.activeElement).attr('id') || form.attr('id');
    $.ajax({type: "POST", url: root.url([config.api,'editor',task]), data: utilities.serializeObject(form),dataType: 'json'}).done(function(response) {
      // element.append(admin.editForm(response));
      console.log(response);
      if (response.error){
        msgContainer.html(response.msg);
      } else {
        msgContainer.html('done');
      }
    }).fail(function(xhr, textStatus, error) {
      console.log(textStatus);
    }).always(function() {
      element.removeClass('wait');
      // console.log('wait');
    });
  },
  importMsgRset:function(){
    root.Element.parents().parents().children().find('.msg').empty();
  },
  import:function(){
    this.msgContainer = root.Element.parents().parents().children().find('.msg');
    if (root.Element.data('task')) {
      this.importPost(root.Element.removeClass('done error'));
    } else {
      root.Element.html('Wait');
      this.importNext(root.Element.parent().children().removeClass('done working error'),0);
    }
  },
  importNext: function(task,id){
    if ($(task[id]).data('task')) {
      this.importPost($(task[id])).promise().then(function() {
        if (task.length >= id) {
          admin.importNext(task,id+1);
        } else {
          root.Element.html('Done');
        }
      });
    } else if (task.length >= id) {
      admin.importNext(task,id+1);
    } else {
      root.Element.html('Done');
    }
  },
  importPost:function(i){
    return $.ajax({
      type: "GET", url: root.url([config.api,'import']), data: {q:i.data('task')},dataType: 'json',
      beforeSend: function(xhr) {
        i.addClass('working');
      }
    }).done(function(response) {
      if (response.error) {
        i.addClass('error');
        admin.msgContainer.append($('<p>',{class:i.data('task'),text:response.msg}));
      } else {
        i.addClass('done');
      }
    }).fail(function(xhr, textStatus, error) {
      i.addClass('error');
    }).always(function(xhr, textStatus, error) {
      i.removeClass('working');
    });
  }
};
export default admin;
