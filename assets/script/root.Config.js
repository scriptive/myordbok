// var zolai='zolai',zozum='zozum',cur='cur',act='act',btn='btn';
export const doc = document,
click=('ontouchstart' in doc.documentElement)? 'touchend' : 'click',
root = {
	check:function(e){
		return typeof e != 'undefined'?e:'';
	},
	form:function(e){
		return config.name.form.replace('*',e);
	},
	input:function(e){
		return config.name.input.replace('*',e);
	},
	char:function(e){
		return $.map(e,function(v){return($.isNumeric(v))?String.fromCharCode(v):v;}).join('');
	},
	url:function(e){
		return $.map(e,function(v){
			if ($.isPlainObject(v)){
				return '?'+$.param(v);
			} else if(v) {
				return (v.slice(-1)=='/')?v.slice(0,-1):v;
			}
		}).join('/').replace('/?','?');
	},
	trim:function(e){
		var m=/[^a-zA-Z0-9 ]/g; if(e.match(m)){e=e.replace(m,'')};return e.replace(/ /g,'');
	},
	Click:click
	// Click,Class,Element
},
config = {
	// api,
	tag:{
		f:'<form>',p:'<p>',i:'<input>',l:'<label>',t:'<textarea>',d:'<div>',u:'<ul>',o:'<ol>',li:'<li>',a:'<a>',s:'<span>',e:'<em>',strong:'<strong>',bold:'<b>',img:'<img>',h4:'<h4>'
	},
	// data:{
	// 	fn:'form[name="*"]',in:'input[name="*"]',mn:'meta[name="*"]',c:'.*',i:'#*',t:'<*>'
	// },
	name:{
		form:'form[name="*"]',input:'input[name="*"]',button:'button[name="*"]',meta:'meta[name="*"]',tag:'<*>',class:'.',id:'#'
	}
},
utilities={
	link:function(e){
		$.each(e,function(k,v){config[v]=$('link[rel="*"]'.replace('*',v)).attr('href');});
	},
	meta:function(e){
		$.each(e,function(k,v){config[v]=$(config.name.meta.replace('*',v)).attr('content');});
	},
	store:{
		s:function(e,v,d){
			//$.cookie(e[0], e[1],{expires:7, path:'/'});
			var expires;
			if (d){
				var date = new Date();
				date.setTime(date.getTime() + (d * 24 * 60 * 60 * 1000));
				expires = "; expires=" + date.toGMTString();
			}
			doc.cookie = escape(e) + "=" + escape(v) + expires + "; path=/";
		},
		g:function(e){
			var esc = escape(e) + "=";
			var d = doc.cookie.split(';');
			for (var i = 0; i < d.length; i++) {
				var c = d[i];
				while (c.charAt(0) === ' ') c = c.substring(1, c.length);
				if(c.indexOf(esc) === 0) return unescape(c.substring(esc.length, c.length));
			}
			return null;
		},
		r:function(e){
			this.s(e, "", -1);
		}
		/*
		Set a cookie

		$.cookie("example", "foo"); // Sample 1
		$.cookie("example", "foo", { expires: 7 }); // Sample 2
		$.cookie("example", "foo", { path: '/admin', expires: 7 }); // Sample 3
		Get a cookie

		alert( $.cookie("example") );
		Delete the cookie

		$.removeCookie("example");
		*/
	},
	serializeObject:function(e){
		var o={};
		$.each(e.serializeArray(), function(i,v) {
			o[v.name]=v.value;
		});
		return o;
	},
	serializeJSON:function(e){
		var o = {};
		$.each(e.serializeArray(), function() {
		if (o[this.name] !== undefined) {
			if (!o[this.name].push) {
			o[this.name] = [o[this.name]];
			}
			o[this.name].push(this.value || '');
		} else {
			o[this.name] = this.value || '';
		}
		});
		return o;
	}
},

fn = {
	// check:function(e){
	// 	return typeof e != 'undefined'?e:'';
	// },
	// ra:function(e,r){
	// 	return e.join(r||'');
	// },
	// from:function(e){
	// 	return config.name.form.replace('*',e);
	// },
	// Input:function(e){
	// 	return config.name.input.replace('*',e);
	// },
	// Button:function(e){
	// 	return config.name.button.replace('*',e);
	// },
	// Tag:function(e){
	// 	return config.name.tag.replace('*',e);
	// },
	// Class:function(e){
	// 	return config.name.class+e;
	// },
	// Id:function(e){
	// 	return config.name.id+e;
	// },
	// Char:function(e){
	// 	return $.map(e,function(v){return($.isNumeric(v))?String.fromCharCode(v):v;}).join('');
	// },
	// Url:function(e){
	// 	return $.map(e,function(v){
	// 		if ($.isPlainObject(v)){
	// 			return '?'+$.param(v);
	// 		} else if(v) {
	// 			return (v.slice(-1)=='/')?v.slice(0,-1):v;
	// 		}
	// 	}).join('/').replace('/?','?');
	// },
	// Trim:function(e){
	// 	var m=/[^a-zA-Z0-9 ]/g; if(e.match(m)){e=e.replace(m,'')};return e.replace(/ /g,'');
	// },
	// ID:function(e){return $(this.id(e));},
	// CN:function(e){return $(this.class(e));},
	// Rf:function(q,n){return q.substr(n||1);},
	// Rl:function(q,n){return q.substring(n||1);},
	// cf:function(q,s){return q.toLowerCase().split(s||' ');},
	// NOTE: Attr
	// attr:{
	// 	Role:function(e){
	// 		return fn.check(e.attr('data-role')).split(' ');
	// 	},
	// 	Id:function(e){
	// 		return fn.check(e.attr('id')).split('-');
	// 	},
	// 	Class:function(e){
	// 		return fn.check(e.attr('class')).split(' ');
	// 	},
	// 	Href:function(e){
	// 		return e.attr('href');
	// 	},
	// 	Title:function(e){
	// 		return e.attr('title');
	// 	}
	// },
	html:function(dl,d,position){
		$.each(d, function(k,v){
			var f = (function (item,list,position){
				if(item){
					if(item.t){
						//|| item.d.for || item.d.class && item.d.html|| item.d.value|| item.d.for
						//item.d && item.d.html || item.d && item.d.name || !item.l && item.d.text
						if (!item.l) list.append($(fn.tag(item.t), item.d));
							else if (item.d) var cmp = item.d;
								else var cmp = null;
					}
					if(item.l && item.l.length){
						var sublist = $(fn.tag(item.t),cmp);
						for(index in item.l) f(item.l[index], sublist);
						list[(position||'append')](sublist);
					}
				}
			}); f(v, dl,position);
		}); return dl;//dl.appendTo("#zotune_container");
	},

	// ga:function(e,i){
	// 	ga('send', 'pageview',e+i);
	// }
};

// export {fn};
// fn.ah
// fn.data.link(['urlmain','urlproject','urlfull','api']);
// fn.data.meta(['uid','unm']);
/*
$.ajax({url:fn.url([e.url,comment]),dataType:"json",data:obj.serialize()}).done(function(j) {
	//...
}).fail(function(jqXHR,textStatus) {
	//...
}).always(function(j) {
	//...
});
*/