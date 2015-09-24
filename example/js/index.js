$(function(){
	/***参数说明
		id:"playvideo",//容器id
		type:"qq",//视频类型(qq/youku)
		sid:"",//视频id
		pic:"",//默认图片(只对腾讯视频有效)
		autoplay:false//是否自动播放
		调用方法
		video.init(opt)//重新初始化参数,然后播放。
	***/
	var video=new playVideo({id:"playvideo"});//实例化一个对象
	$("#playvideo").height($("#playvideo").width()*0.5);
	if($(".play_list .cur").length>0){
		var sid=$(".play_list .cur").attr("sid");
		var typeid=$(".play_list .cur").attr("typeid");
		var pic=$(".play_list .cur").attr("pic");
		if(sid&&typeid){
			//使用
			var opt={type:typeid,sid:sid,pic:pic,autoplay:false};
			video.init(opt);
			//每次调用都传入新的参数。(相同的参数可以不重复设置，如：上一个设置了autoplay:false，那么下一个不设置那么autoplay也是false)
			//这里id已经在实例化的时候设置过，所以可以不重复设置。
			//或new playVideo({id:"playvideo",type:typeid,sid:sid,pic:pic,autoplay:false}); //重新new一个
		}
	}
	$(".play_list li").bind("click",function(){
		var sid=$(this).attr("sid");
		var typeid=$(this).attr("typeid");
		var pic=$(this).attr("pic");
		if(sid&&typeid){
			$(this).addClass("cur").siblings(".cur").removeClass("cur");
			var opt={type:typeid,sid:sid,pic:pic,autoplay:false}
			video.init(opt);
			//或new playVideo({id:"playvideo",type:typeid,sid:sid,pic:pic,autoplay:false});
		}
	});
});
$(window).resize(function(){
	$("#playvideo").height($("#playvideo").width()*0.5);
});

