/**
 * playVideo 1.0.4
 * https://github.com/zhouxitian/playVideo
 * author:zhouxitian@163.com
 */
/*
2015.10.19 修复jQuery.width()/jQuery.height()使用style.width的Bug
2015.11.02 修改腾讯视频支持直播
2015.11.25 增加搜狐视频播放器
*/
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
			return this[0].offsetWidth;
		},
		height:function(){
			return this[0].offsetHeight;
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
			qqchannel:false,
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
		var opts={id:options.id,type:typeid,qqchannel:options.qqchannel,sid:sid,pic:pic,autoplay:options.autoplay==false?false:true}
		new playVideo(opts);
	};
	playVideo.prototype={
		init:function(opt){
			var t=this;
			if(!t.options){
				t.options={
					id:"playvideo",//容器id
					type:"qq",//视频类型(qq/youku)
					qqchannel:false,
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
							console.log("优酷接口文件未加载");
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
							console.log("腾讯接口文件未加载");
						}
					}else{
						t.playQQ();
					}
				}else if(t.options.type=="sohu"){
					if(!window.SohuMobilePlayer){
						if(jQuery.getScript){
							jQuery.getScript("http://img01.static.appgame.com/libs/jsCommon/player/sohu_player.min.js",function(){
							//jQuery.getScript("http://tv.sohu.com/upload/touch/static/scripts/tv/min.sohu_player.js",function(){
								t.playSohu();
							});
						}else{
							console.log("搜狐接口文件未加载");
						}
					}else{
						t.playSohu();
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
			var player = new tvp.Player(width, height);
			if(!t.options.qqchannel){
				video.setVid(t.options.sid);
			}else{
				video.setChannelId(t.options.sid);
				player.addParam('type','1');
			}
			
			//设置播放器初始化时加载的视频
			player.setCurVideo(video);
			
			player.addParam("wmode","transparent");//设置透明化，不设置时，视频为最高级，总是处于页面的最上面，此时设置z-index无效
			player.addParam('autoplay',t.options.autoplay?1:0);
			if(t.options.pic&&t.options.pic!="undefined"){
				player.addParam('pic',t.options.pic);
			}
			player.addParam('showend',0)//结束时是否有广告
			player.addParam('showcfg',0)//是否显示控制列表；1显示，0不显示，默认为1
		//	player.addParam('controls',1)//html5播放器是否显示控制栏，仅对html5播放器有效；设置为controls显示，disabled不显示，默认显示。
			player.addParam('adplay',0)//是否播放广告；1播放，0不播放，默认为1
		//	player.addParam("flashskin", "http://imgcache.qq.com/minivideo_v1/vd/res/skins/TencentPlayerMiniSkin.swf");//使视频窗口为小窗口
			player.addParam("swfurl", "http://imgcache.qq.com/tencentvideo_v1/player/TencentPlayer.swf");//点播状态flash播放器的swf文件路径，仅对flash播放器有效
			player.addParam("loadingswf", "http://imgcache.qq.com/minivideo_v1/vd/res/skins/web_small_loading.swf");//加载视频时的swf动画; 不传入则使用默认样式
			//输出播放器
			player.write(t.options.id);
		},
		playSohu:function(){
			var t=this;
			var width=jQuery("#"+t.options.id).width();
			var height=jQuery("#"+t.options.id).height();
			var player = new SohuMobilePlayer(t.options.id, {
			  vid: t.options.sid,
			  isAutoPlay:t.options.autoplay,
			  poster:t.options.pic||"",//播放器封面图 (String, 可选)
			  width:width,//播放器宽度 （Number，可选）
			  height:height,//播放器高度 （Number，可选）
			  //adClose:1,//是否禁播广告，默认为0不禁止（Number，可选）。
			  topBarNor:0,//是否显示顶部标题,0不显示
			  shareBtn:0,//是否显示分享按钮,0不显示
			  downloadBtn:0,//是否显示下载按钮,0不显示
			  miniWinBtn:0,//是否显示新窗口按钮,0不显示
			},"");
		}
	}
	
})(window);