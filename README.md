# playVideo
优酷、腾讯视频统一播放器插件
```javascript
createVideo({id:"playvideo",autoplay:false,qqchannel:true});//单个直接调用。qqchannel调用qq直播时使用
createVideo({//多个直接调用。
	id:"playvideo",//容器id
	autoplay:false,//是否自动播放
	qqchannel:this.getAttribute("channel")||false,//true调用qq直播时使用
	multiple:{
		typeid:this.getAttribute("typeid"),//视频类型：youku or qq
		sid:this.getAttribute("sid"),//视频在优酷或腾讯上的id
		pic:this.getAttribute("pic")//不自动播放时显示的默认图片。腾讯视频点播时有效
	}
});
```