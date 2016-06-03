/**
 * playVideo 1.0.4
 * https://github.com/zhouxitian/playVideo
 * author:zhouxitian@163.com
 */
/*
2015.10.19 v 1.02 修复jQuery.width()/jQuery.height()使用style.width的Bug
2015.11.02 v 1.03 修改腾讯视频支持直播
2015.11.25 v 1.04 增加搜狐视频播放器
2015.12.14 v 1.04 增加minWin参数控制视频窗口是否小窗口
2015.12.30 v 1.05 增加爱奇艺视频播放器
2015.12.31 v 1.05 优化优酷、搜狐等不能播放的问题
2015.1.14 v 1.06 腾讯视频接口改2.0
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
			}else if(value&&value.nodeType===1){
				elem.innerHTML = "";
				elem.appendChild(value);
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
			isIframe:false,//是否启用iframe调用(爱奇艺)
			qqchannel:false,//是否直播(腾讯)
			minWin:false,//视频窗口为小窗口(只对腾讯视频有效)
			multiple:""
		},typeid,sid,vid,pic,title;
		jQuery.extend(options,opt);
		if(typeof options.multiple=="object"){
			typeid=options.multiple.typeid;
			sid=options.multiple.sid;
			vid=options.multiple.vid;
			pic=options.multiple.pic;
			title=options.multiple.vtitle;
		}else{
			obj=jQuery("#"+options.id);
			typeid=obj.attr("typeid");
			sid=obj.attr("sid");
			vid=obj.attr("vid");
			pic=obj.attr("pic");
			title=obj.attr("vtitle");
		}
		var opts={id:options.id,minWin:options.minWin,type:typeid,title:title,qqchannel:options.qqchannel,isIframe:options.isIframe,sid:sid,vid:vid,pic:pic,autoplay:options.autoplay==false?false:true}
		new playVideo(opts);
	};
	playVideo.prototype={
		init:function(opt){
			var t=this;
			if(!t.options){
				t.options={
					id:"playvideo",//容器id
					type:"qq",//视频类型(qq/youku)
					qqchannel:false,//是否直播(腾讯)
					sid:"",//视频id
					vid:"",//视频vid(爱奇艺)
					title:"",//标题(腾讯)
					isIframe:false,//是否启用iframe调用(爱奇艺)
					pic:"",//默认图片(只对腾讯视频有效)
					minWin:false,//视频窗口为小窗口(只对腾讯视频有效)
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
							jQuery.getScript("http://imgcache.gtimg.cn/tencentvideo_v1/tvp/js/tvp.player_v2.js",function(){
								t.playQQ();
							});
						}else{
							console.log("腾讯接口文件未加载");
						}
					}else{
						t.playQQ();
					}
				}else if(t.options.type=="sohu"){
					if(!window.SohuMobilePlayer&&document.addEventListener){
						if(jQuery.getScript){
							jQuery.getScript("http://img01.static.appgame.com/libs/jsCommon/player/min.sohu_player.js?ver=1.01",function(){
							//jQuery.getScript("http://tv.sohu.com/upload/touch/static/scripts/tv/min.sohu_player.js",function(){
								t.playSohu();
							});
						}else{
							console.log("搜狐接口文件未加载");
						}
					}else{
						t.playSohu();
					}
				}else if(t.options.type=="iqiyi"){
					if(t.options.isIframe){
						var iframe=document.createElement("iframe");
						iframe.setAttribute("src","http://open.iqiyi.com/developer/player_js/coopPlayerIndex.html?vid="+t.options.vid+"&tvId="+t.options.sid+"&accessToken=2.f22860a2479ad60d8da7697274de9346&appKey=3955c3425820435e86d0f4cdfe56f5e7&appId=1368&height=100%&width=100%");
						iframe.setAttribute("frameborder",0);
						iframe.setAttribute("allowfullscreen",true);
						iframe.setAttribute("width","100%");
						iframe.setAttribute("height","100%");
						jQuery("#"+t.options.id).html(iframe);		
					}else{
						if(!window.Q&&document.addEventListener){
							if(jQuery.getScript){
								jQuery.getScript("http://img01.static.appgame.com/libs/jsCommon/player/sea1.2.min.js",function(){
									window.Q = window.Q|| {};
									Q.PageInfo = Q.PageInfo || {};
									Q.PageInfo.playInfo = {};
									Q.PageInfo.playInfo.videoFormat ="mp4";//视频格式
									Q.PageInfo.playInfo.qipuId = t.options.sid;
									Q.PageInfo.playInfo.vid = t.options.vid;
									Q.PageInfo.playInfo.aid = t.options.sid;
									t.playIqiyi();
								});
							}else{
								console.log("爱奇艺接口文件未加载");
							}
						}else{
							t.playIqiyi();
						}
					}
				}
			}
		},
		playYouku:function(){
			var t=this;
			var isPC=function(){
				var userAgentInfo = navigator.userAgent;
				var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");
				var flag = true;
				for (var v = 0; v < Agents.length; v++) {
					if (userAgentInfo.indexOf(Agents[v]) > 0) { flag = false; break; }
				}
				return flag;
			}();
			if(!isPC){
				var player = new YKU.Player(t.options.id,{
					//styleid: '0',//炫彩播放器样式 0-9
					client_id: '1a0718786643b0ef',//优酷开放平台创建应用的client_id
					vid: t.options.sid,//视频ID
					show_related: false,//播放完成是否显示相关视频
					autoplay: t.options.autoplay,//是否自动播放视频
					//password: '1a0718786643b0ef',//免密码播放
					//embsig: t.options.id,//嵌入式播放器签名(非网站类应用必须设置)
				});
			}else{//不用接口(window下的safari不能播放)
				t.setEmbed("http://static.youku.com/v1.0.0590/v/swf/loader.swf","VideoIDS="+t.options.sid+"&isAutoPlay="+t.options.autoplay+"&winType=BDskin&embedid=&wd=&partnerid=1a0718786643b0ef&vext=");
			}
		},
		playQQ:function(){
			var t=this;
			var width=jQuery("#"+t.options.id).width();
			var height=jQuery("#"+t.options.id).height();
			var video = new tvp.VideoInfo();
			var opts={
				width:width,
				height:height,
				video:video,
				//isVodFlashShowCfg:0,//是否显示控制按钮
				//isVodFlashShowSearchBar:0,//是否显示顶部搜索框
			//	isVodFlashShowEnd:0,//是否显示播放结束后的推荐视频
				autoplay:t.options.autoplay?1:0,//是否自动播放
				controls:0,//HTML5是否显示控制栏
				vodFlashExtVars:{bullet:0},//关闭弹幕
				loadingSwf:"http://imgcache.qq.com/minivideo_v1/vd/res/skins/web_small_loading.swf",
				pic:(t.options.pic&&t.options.pic!="undefined")?t.options.pic:"",
				vodFlashSkin:t.options.minWin?"http://imgcache.qq.com/minivideo_v1/vd/res/skins/TencentPlayerMiniSkin.swf":"",
			//	vodFlashUrl:"http://imgcache.qq.com/tencentvideo_v1/player/TencentPlayer.swf",//点播
			//  liveFlashUrl:"http://imgcache.qq.com/tencentvideo_v1/player/TencentPlayer.swf",//直播
				modId:t.options.id
			}
			if(!t.options.qqchannel){
				video.setVid(t.options.sid);//视频vid
				video.setCoverId("vid");//专辑id
				video.setTitle(t.options.title||"");
				opts.isVodFlashShowCfg=0;//是否显示控制按钮
				opts.isVodFlashShowSearchBar=0;//是否显示顶部搜索框
				opts.isVodFlashShowEnd=0;//是否显示播放结束后的推荐视频
				
			}else{
				video.setChannelId(t.options.sid);
				opts.type=1;
				opts.isLiveFlashShowCfg=0;//直播是否显示控制按钮
			}
			var player = new tvp.Player();	
			player.create(opts);
		},
		playSohu:function(){
			var t=this;
			if(document.addEventListener){
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
			}else{//区分ie8或以下
				t.setEmbed("http://share.vrs.sohu.com/" + t.options.sid + "/v.swf","miniWinBtn=0&autoplay="+t.options.autoplay+"&vid="+t.options.sid+"&downloadBtn=0&shareBtn=0&topBarNor=0&adClose=1&pageurl=http://www.sohu.com/");
			}
		},
		playIqiyi:function(){
			var t=this;
			if(document.addEventListener&&Zepto.os.phone){//手机端
				window.__page_start = new Date().getTime();
				var video=document.createElement("video");
				var id=t.options.id+new Date().getTime();
				video.id=id;
				if(!t.options.autoplay){
					video.setAttribute("controls",true);
					video.setAttribute("preload","metadata");
					video.setAttribute("autobuffer",true);
				}
				video.setAttribute("poster",t.options.pic),
				jQuery("#"+t.options.id).html(video);
				Q.PageInfo.playInfo.id=id;
				Q.PageInfo.playInfo.autoplay=t.options.autoplay;
				seajs.use("http://img01.static.appgame.com/libs/jsCommon/player/miniplayer.min.js", function() {
					Q.video.load({
						aid : t.options.sid,
						tvid :t.options.sid,
						qipuId : t.options.sid,
						vid : t.options.vid,
						vfrm : "",
						publicLevel :"0"*1,
						isUGC : true,
						duration : "0",
						ADPlayerID : "",//广告id
						rate : 1
					});
				});
			}else{
				t.setEmbed("http://dispatcher.video.qiyi.com/disp/shareplayer.swf","vid="+t.options.vid+"&tvId="+t.options.sid+"&apic="+t.options.pic+"&coop=&cid=&bd=1")
			}
		},
		setEmbed:function(src,flashvars){
			var t=this;
			var video=document.createElement("embed");
			video.setAttribute("flashvars",flashvars);
			video.setAttribute("src",src);
			video.setAttribute("allowfullscreen",true);
			video.setAttribute("wmode","transparent");
			video.setAttribute("quality","high");
			video.setAttribute("pluginspage","http://www.macromedia.com/go/getflashplayer");
			video.setAttribute("type","application/x-shockwave-flash");
			jQuery("#"+t.options.id).html(video);
		}
	}
})(window);