/*
 * MyOrdbok
 */
// require('./analytics.js');
(function($){
  const {root,doc,utilities} = require('./root.Config');
  $.fn.MyOrdbok=function(is){
		utilities.link(['api']);
		let app={
			suggest:require('./suggest').default,
			toggle:require('./toggle').default,
			word:require('./word').default,
			// admin:require('./admin.js').default,
			speech:require('./speech').default,
	    zA:function(){
				$(doc).on(root.Click,'.zA', function(event){
					var x=$(this); root.Element=x;
					root.Class=x.attr('class').split(' ');
					appInitiate(root.Class);
					event.preventDefault();
					event.stopPropagation();
				});
	    },
	    zO:function(){
				$('.zO').each(function() {
					var x=$(this); root.Element=x;
					root.Class=x.attr('class').split(' ');
					appInitiate(root.Class);
				});
	    }
		};
    let appInitiate = function(x) {
      if(app[x[0]] && $.isFunction(app[x[0]])) app[x[0]]();
        else if(app[x[0]] && $.isFunction(app[x[0]][x[1]])) app[x[0]][x[1]]();
					else if(app[x[0]] && $.isFunction(app[x[0]][0])) app[x[0]][0]();
    };
    $.each(is,(i,x)=>appInitiate(x.split(' ')));
  };
  $(function(){
    $(doc).MyOrdbok(['suggest ready','toggle menu','zA','zO']);
  });
})(jQuery);

/*
(function(win,doc) {
  'use strict';
}(window,document));

$(function(){
	$(document).MyOrdbok(['suggest ready',click,'img set']);
});
*/
/*
<script>
$(function(){
  $(document).MyOrdbok({
    Click:'click',Action:'.zA',Q:['suggest set','click','img set'],extended:'MyOrdbok'
  });
});
</script>
*/