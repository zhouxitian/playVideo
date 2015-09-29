;(function(window){
	var rquickExpr = /^#([\w-]+|\w+)$/;//匹配#id
	var jQuery=function(selector){
		return new jQuery.fn.init(selector);
	}
	jQuery.fn=jQuery.prototype={
		//获取对象的类型
		getType:function(o)
		{
			var _t;
			return ((_t = typeof(o)) == "object" ? o==null && "null" || Object.prototype.toString.call(o).slice(8,-1):_t).toLowerCase();
		},
		html:function(value){
			var elem = this[0] || {};
			if ( value === undefined && elem.nodeType === 1 ) {
				return elem.innerHTML;
			}
			if(typeof value === "string"){
				elem.innerHTML = value;
			}
		},
		/**
		 * @description 实现对象的拷贝功能(source 拷贝到 target)
		 * @params {Object} target 目标对象
		 * @params {Object} source 原对象
		 */
		extend:function(target,source){
			for (var p in source){
				if(jQuery.fn.getType(source[p])=="array"||jQuery.fn.getType(source[p])=="object"){
					target[p]=jQuery.fn.getType(source[p])=="array"?[]:{};
					arguments.callee(target[p],source[p]);
				}else{
					target[p] = source[p];
				}
			}
			return target;
		},
		attr:function(name){
			return this[0].getAttribute(name);
		},
		width:function(){
			return this[0].style.width;
		},
		height:function(){
			return this[0].style.height;
		},
		getScript:function(url, callback){
			var script = document.createElement('script');
			script.type = "text/javascript";
			if (script.readyState) {
				script.onreadystatechange = function() {
					if (script.readyState == "loaded" || script.readyState == "complete") {
						script.onreadystatechange = null;
						if (callback) {
							callback();
						}
					}
				}
			} else {
				script.onload = function() {
					if (callback) {
						callback();
					}
				}
			}
			script.src = url;
			document.body.appendChild(script);
		}
	};
	jQuery.fn.init=function(selector){
		if ( !selector ) {
			return this;
		}
		if (typeof selector === "string" ){
			match = rquickExpr.exec( selector );
			if(match&&match[1]){
				if(match[1]) {
					elem = document.getElementById( match[1] );
					if ( elem && elem.parentNode ) {
						this.length = 1;
						this[0] = elem;
						this.selector = selector;
					}
				}
			}
		}
	};
	var arr=new Array("init","extend","html","attr","width","height","getScript");
	for(i in arr){
		jQuery[arr[i]]=jQuery.fn[arr[i]];
	}
	jQuery.init.prototype = jQuery.fn;
	//window.$=$=jQuery;
	playVideo=function (opt){
		this.init(opt);
	};
	createVideo=function(opt){
		var options={
			id:"playvideo",//容器id
			autoplay:false,
			multiple:""
		}
		jQuery.extend(options,opt);
		if(typeof options.multiple=="object"){
			var typeid=options.multiple.typeid;
			var sid=options.multiple.sid;
			var pic=options.multiple.pic;
		}else{
			var obj=jQuery("#"+options.id);
			var typeid=obj.attr("typeid");
			var sid=obj.attr("sid");
			var pic=obj.attr("pic");
		}
		var opts={id:options.id,type:typeid,sid:sid,pic:pic,autoplay:options.autoplay==false?false:true}
		new playVideo(opts);
	};
	playVideo.prototype={
		init:function(opt){
			var t=this;
			if(!t.options){
				t.options={
					id:"playvideo",//容器id
					type:"qq",//视频类型(qq/youku)
					sid:"",//视频id
					pic:"",//默认图片(只对腾讯视频有效)
					autoplay:false//是否自动播放
				}
			}
			jQuery.extend(t.options,opt);
			t.play();
		},
		play:function(){
			var t=this;
			if(t.options.sid){
				jQuery("#"+t.options.id).html("");
				if(t.options.type=="youku"){
					if(!window.YKU){
						if(jQuery.getScript){
							jQuery.getScript("http://player.youku.com/jsapi",function(){
								t.playYouku();
							});
						}else{
							console.log("接口文件未加载");
						}
					}else{
						t.playYouku();
					}
				}else if(t.options.type=="qq"){
					if(!window.tvp){
						if(jQuery.getScript){
							jQuery.getScript("http://qzs.qq.com/tencentvideo_v1/js/tvp/tvp.player.js",function(){
								t.playQQ();
							});
						}else{
							console.log("接口文件未加载");
						}
					}else{
						t.playQQ();
					}
				}
			}
		},
		playYouku:function(){
			var t=this;
			var player = new YKU.Player(t.options.id,{
				styleid: '0',//炫彩播放器样式 0-9
				client_id: '1a0718786643b0ef',//优酷开放平台创建应用的client_id
				vid: t.options.sid,//视频ID
				show_related: false,//播放完成是否显示相关视频
				autoplay: t.options.autoplay,//是否自动播放视频
				password: '1a0718786643b0ef',//免密码播放
				embsig: t.options.id,//嵌入式播放器签名(非网站类应用必须设置)
			});
		},
		playQQ:function(){
			var t=this;
			var video = new tvp.VideoInfo();
			var width=jQuery("#"+t.options.id).width();
			var height=jQuery("#"+t.options.id).height();
			//向视频对象传入视频vid
			video.setVid(t.options.sid);
			var player = new tvp.Player(width, height);
			//设置播放器初始化时加载的视频
			player.setCurVideo(video);
			player.addParam("wmode","transparent");//设置透明化，不设置时，视频为最高级，总是处于页面的最上面，此时设置z-index无效
			player.addParam('autoplay',t.options.autoplay?1:0);
			if(t.options.pic&&t.options.pic!="undefined"){
				player.addParam('pic',t.options.pic);
			}
			player.addParam('showend',0)//结束时是否有广告
			player.addParam("flashskin", "http://imgcache.qq.com/minivideo_v1/vd/res/skins/TencentPlayerMiniSkin.swf");//使视频窗口为小窗口
			player.addParam("loadingswf", "http://imgcache.qq.com/minivideo_v1/vd/res/skins/web_small_loading.swf");
			//输出播放器
			player.write(t.options.id);
		}
	}
	
})(window);