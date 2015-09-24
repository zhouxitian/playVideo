/**
 * playVideo 1.0.1
 * https://github.com/zhouxitian/playVideo
 * author:zhouxitian@163.com
 */
;(function($){
	playVideo=function (opt){
		this.init(opt);
	}
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
			$.extend(t.options,opt);
			t.play();
		},
		play:function(){
			var t=this;
			if(t.options.sid){
				$("#"+t.options.id).html("");
				if(t.options.type=="youku"){
					if(!window.YKU){
						$.ajaxSetup({
						  cache:true
						});
						$.getScript("http://player.youku.com/jsapi",function(){
							t.playYouku();
						});
					}else{
						t.playYouku();
					}
				}else if(t.options.type=="qq"){
					if(!window.tvp){
						$.getScript("http://qzs.qq.com/tencentvideo_v1/js/tvp/tvp.player.js",function(){
							t.playQQ();
						});
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
			var width=$("#"+t.options.id).width();
			var height=$("#"+t.options.id).height();
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
})(jQuery);