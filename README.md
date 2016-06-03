# playVideo
优酷、腾讯视频统一播放器插件
##关于兼容性：
- pc端测试过都是可以使用的。而且现在也是一直在用。
- 移动端的播放会出现很多兼容性问题。这个目前是难以解决的。
- 首先现在像优酷、腾讯等播放平台手机端都采用了video播放，但有的平台可能会先加载一个伪播放(先加载一个div层覆盖在视频上，视频先不加载)。然后企图先播放广告再播放视频。所以有时会造成功能上的影响。
- 对于自动播放问题。移动端就更为突出。首先是各手机是否支持(android一般支持video的自动播放。ios就不一定了)。
- 还要看各个播放器平台的接口在移动端是否真的会使用自动播放。
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