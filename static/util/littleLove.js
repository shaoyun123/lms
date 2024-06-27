// var throttle = function(fn, delay){//闭包节流
//  	var timer = null;
//  	return function(){
//  		var context = this, args = arguments;
//  		clearTimeout(timer);
//  		timer = setTimeout(function(){
//  			fn.apply(context, args);
//  		}, delay);
//  	};
//  };
// var init_egg ,desdroy_egg,toshowEgg;
// var scheduledAnimationFrame = false;
// (function(window,document,undefined){//兼容性处理
//     var elements = [];
//     var elementimg=['christmas_tree.png','mistle_toe-1.png','snowman-1.png','socks-1.png','mistle_toe_2-1.png','bell-1.png','candy-1.png','santa_hat-1.png','gift-1.png','300_dpi-1.png'];
//     window.requestAnimationFrame = (function(){
//     return window.requestAnimationFrame ||
//     window.webkitRequestAnimationFrame ||
//     window.mozRequestAnimationFrame ||
//     window.oRequestAnimationFrame ||
//     window.msRequestAnimationFrame ||
//     function (callback){
//       setTimeout(callback,1000/60);
//     }
// })();
// init_egg = function(){//初始化图标大小
//     css(".ele{width:50px;height:50px;position: fixed;z-index:9999}");
//     attachEvent();
//     if (scheduledAnimationFrame) { return }
//     gameloop();
//     scheduledAnimationFrame = true
// }
// desdroy_egg = function() {
//     window.removeEventListener('click',toshowEgg)
// }
// // var scheduledAnimationFrame =false;
// function gameloop(){
//     for(var i=0;i<elements.length;i++){
//         if(elements[i].alpha <=0){
//             document.body.removeChild(elements[i].el);
//             elements.splice(i,1);
//             continue;
//         }
//         elements[i].y--;
//         elements[i].scale += 0.005;
//         elements[i].alpha -= 0.013;
//         elements[i].el.style.cssText = "left:"+elements[i].x+"px;top:"+elements[i].y+"px;opacity:"+elements[i].alpha+";transform:scale("+elements[i].scale+","+elements[i].scale+") rotate("+elements[i].rotation+"deg);background:"+elements[i].color;
//     }
//     requestAnimationFrame(gameloop);
// }

// function attachEvent(){
//     // var old = typeof window.onclick==="function" && window.onclick;
//     toshowEgg = function (event) {
//         // old && old();  
//         createHeart(event);
//     }
//     window.addEventListener('click',throttle(toshowEgg,200))
// }
// function createHeart(event){
//     var d = document.createElement("img");
//     d.setAttribute('src','static/img/element/'+elementimg[randomImg()]);
//     d.className = "ele";
//     elements.push({
//         el : d,
//         x : event.clientX - 80,
//         y : event.clientY - 40,
//         scale : 1,
//         alpha : 1,
//         rotation:randomImg()*36
//     });
//     document.body.appendChild(d);
// }
// function css(css){
//     var style = document.createElement("style");
//     style.type="text/css";
//     try{
//         style.appendChild(document.createTextNode(css));
//     }catch(ex){
//         style.styleSheet.cssText = css;
//     }
//     document.getElementsByTagName('head')[0].appendChild(style);
// }
// function randomImg(){
//     return Math.floor(Math.random()*10);
// }
// })(window,document);

var redPacket = {
	numredpacket: 30,
	Init:function (){
		for(var i=0;i<redPacket.numredpacket;i++){
			var leftradom = document.body.offsetWidth || 1920;
			var bodyHeight = document.body.offsetHeight || 1000;
			var div = document.createElement('a');
			//div.setAttribute('target','_blank');
			//div.href = '//588ku.com/pintuan/';
			div.href = 'javascript:void(0);';
			var images = document.createElement('img');
			var roateDiv = (Math.random() < 1) ? 'redpacketRote':'redpacketRoteF';
			images.src ='static/img/element//snowfly.png';
			images.style.width = '100%';
			div.className = 'redpack redpack'+i;
			div.style.top = redPacket.GetIntegerRandomNum(-100,-850)+'px';
			div.style.left = redPacket.GetIntegerRandomNum(0,leftradom)+'px';
			div.style.width =  Math.ceil(Math.random()*45)+'px';
			div.style.height = Math.ceil(Math.random()*45)+'px';
			div.style.webkitAnimationName ='dropdown';
			div.style.animationName ='dropdown';
			images.className = roateDiv;
			div.appendChild(images);
			div.style.webkitAnimationDuration = redPacket.delayValue(redPacket.GetrandomFloat(5, 9)) + ', ' + redPacket.GetrandomFloat(redPacket.GetrandomFloat(5, 9));
			div.style.animationDuration = redPacket.delayValue(redPacket.GetrandomFloat(5, 9)) + ', ' + redPacket.delayValue(redPacket.GetrandomFloat(5, 9));
			div.style.webkitAnimationDelay = redPacket.delayValue(redPacket.GetrandomFloat(0, 6)) + ', ' + redPacket.delayValue(redPacket.GetrandomFloat(0, 6));
			div.style.animationDelay = redPacket.delayValue(redPacket.GetrandomFloat(0, 6)) + ', ' + redPacket.delayValue(redPacket.GetrandomFloat(0, 6));
			document.getElementById('redpacketBox').appendChild(div);
		}
		var removetime = setTimeout(function(){
			$('#redpacketBox').remove();
			window.clearTimeout(removetime);
		},15000);
	},
	GetIntegerRandomNum:function(Min, Max) {
	    var Range = Max - Min;
	    var Rand = Math.random();
	    return(Min + Math.round(Rand * Range));
	},
	GetrandomFloat: function (Min, Max) { return Min + Math.random() * (Max - Min); },
	delayValue:function (value) { return value + 's'; }
};
redPacket.Init();

(function(){
	$('body').on('mouseover','.redpack',function(){
		$(this).addClass('pause');
	}).on('mouseout','.redpack',function(){
		$(this).removeClass('pause');
	});
})();