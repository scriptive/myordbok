/*
 * MyOrdbok
 */
(function($){
	$.fn.MyOrdbok=function(is){
		const {root,doc,utilities} = require('./root.Config');
		utilities.link(['api']);
		let app={
			suggest:require('./suggest').default,
			toggle:require('./toggle').default,
			word:require('./word.js').default,
			admin:require('./admin.js').default,
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
	    },
	    testOnly:function(){
	      console.log(app);
	    }
		};
    let appInitiate = function(x) {
      if(app[x[0]] && $.isFunction(app[x[0]])) app[x[0]]();
        else if(app[x[0]] && $.isFunction(app[x[0]][x[1]])) app[x[0]][x[1]]();
					else if(app[x[0]] && $.isFunction(app[x[0]][0])) app[x[0]][0]();
    };
    $.each(is,(i,x)=>appInitiate(x.split(' ')));
	};
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
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
ga('create', 'UA-18578545-1','auto');
ga('require', 'linkid', 'linkid.js');
ga('require', 'displayfeatures');
ga('send', 'pageview');
$(function(){
  $(document).MyOrdbok({
    Click:'click',Action:'.zA',Q:['suggest set','click','img set'],extended:'MyOrdbok'
  });
});
</script>
*/