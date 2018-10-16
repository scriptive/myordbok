const {root,config} = require('./root.Config');
export default {
	form:'search',field:'q',button:'submit',classIn:'in',className:'selected',
	listCurrent:-1,listTotal:0,delay:0,result:'#suggest',
	ready:function(){
		var e=this;
		e.form=$(root.form(e.form));
		if (!e.form.length) return;
		e.field=e.form.find(root.input(e.field)).attr('autocomplete', 'off').focus().select();
		e.result=$(e.result);
		//this.field.select();
		e.field.focusin(function(){
			e.form.addClass(e.classIn);
		}).focusout(function(){
			setTimeout(function(){e.clear();},200);
		}).keyup(function (evt) {
			var k = evt||window.event;
			var lastVal = $(this).val();
			e.form.addClass(e.classIn);
			if(e.arrows(k.keyCode,k.ctrlKey||k.metaKey) != true) setTimeout(function(){e.listener(lastVal);},e.delay);
			// if(e.arrows(k.keyCode,k.ctrlKey||k.metaKey) != true) e.listener(lastVal);

		});
		// $(this.button).click(function(){
		// 	this.form.submit();
		// });
		//this.field.blur(function(){ setTimeout(function(){e.clear();},200); });
	},
	clear:function(){
		this.result.empty();
		this.form.removeClass(this.classIn);
	},
	listener:function(lastValue){
		var e=this;
		var q = e.field.val();
		if(q == '' || lastValue != q) return;
		// [config.api,'suggestion']
		// root.url([config.api,'suggestion'])
		$.getJSON(root.url([config.api,'suggestion']),{q:q}, function(j){
			e.listTotal = j.length;
			if(e.listTotal > 0){
				e.result.empty();
				$.each(j, function(i, v){
					$('<p>',{title:v,html:v.replace(new RegExp(q, "i"), "<b>$&</b>")}).appendTo(e.result).mousemove(function(){ e.add(this); });
				});
			} else {
				e.clear();
			}
		});
	},
	arrows:function(keyCode,ctrlDown){
		var e=this;
		if($.inArray(keyCode,[40,38,13]) >= 0){
			if(keyCode == 38){
				if(e.listCurrent <= 0){ e.listCurrent = e.listTotal-1; }else{ e.listCurrent--; }
			} else {
				if(e.listCurrent >= e.listTotal-1){ e.listCurrent = 0; } else { e.listCurrent++; }
			}
			e.result.children().each(function(i){
				if(i == e.listCurrent) e.add(this);
			}); return true;
		}else if($.inArray(keyCode,[13,37,39,16,17,116]) >= 0){
			return true;
		}else if(ctrlDown && $.inArray(keyCode,[67]) >= 0){
			return true; //c,v,x [67,86,88]
		}else if(keyCode == 27){
			// Escape
			// e.field.val(''); return true;
		}else if(keyCode == 13){
			// Enter
			return false;
		}else{
			e.listCurrent = -1; return false;
		}
	},
	add:function(x){
		var e=this;
		var o = $(x);
		//this.field.val(x.childNodes[0].nodeValue);
		// this.field.val(zj.At($(x)));
		e.field.val(o.attr('title'));
		o.addClass(e.className).siblings().removeClass();
		// x.className = e.className;
		e.listCurrent =o.index();
		o.click(function(){ e.form.submit(); });
	}
};