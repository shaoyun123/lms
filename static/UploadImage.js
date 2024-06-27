"use strict";
(function(mod) {
    if (typeof exports == "object" && typeof module == "object") // CommonJS
        module.exports = mod();
    else if (typeof define == "function" && define.amd) // AMD
        return define([], mod);
    else // Plain browser env
        window.UploadImage = mod();
})(function () {
    //public
    function UploadImage(id, url, key) { //创建一个对象类
        this.element = document.getElementById(id);
        this.url = url; //后端处理图片的路径
        this.imgKey = key || "AreaImgKey"; //提到到后端的name

    }

    /**
     * 2021-07-15 废弃不用，  有些图使用该方法压缩后，反而更大
     * 图片压缩，默认同比例压缩
     * @param {Object} path
     * pc端传入的路径可以为相对路径，但是在移动端上必须传入的路径是照相图片储存的绝对路径
     * @param {Object} obj
     * obj 对象 有 width， height， quality(0-1)
     * @param {Object} callback
     * 回调函数有一个参数，base64的字符串数据
     */
    function dealImage(path, obj, callback){
        var img = new Image();
        img.src = path;
        img.onload = function(){
            var that = this;
            // 默认按比例压缩
            var w = that.width,
                h = that.height,
                scale = w / h;
            w = obj.width || w;
            h = obj.height || (w / scale);
            var quality = obj.quality || 0.8; // 默认图片质量为0.8
            //生成canvas
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');
            // 创建属性节点
            var anw = document.createAttribute("width");
            anw.nodeValue = w;
            var anh = document.createAttribute("height");
            anh.nodeValue = h;
            canvas.setAttributeNode(anw);
            canvas.setAttributeNode(anh);
            ctx.drawImage(that, 0, 0, w, h);
            // 图像质量
            if(obj.quality && obj.quality <= 1 && obj.quality > 0){
                quality = obj.quality;
            }
            // quality值越小，所绘制出的图像越模糊
            var base64 = canvas.toDataURL('image/jpeg', quality );
            // 回调函数返回base64的值
            callback(base64);
        }
    }

    UploadImage.prototype.paste = function (callback, formData) {
        var thatthat = this;  //此时的this指向的是uploadImage实例 
        this.element.addEventListener('paste', function (e) {//处理目标容器（id）的paste事件
            if (e.clipboardData && (e.clipboardData.items[0].type.indexOf('image') > -1)) {
                var that = this,//这里的this指向的是this.element
                file = e.clipboardData.items[0].getAsFile();//读取e.clipboardData中的数据
                lrz(file, {
                    quality: 0.8,
                }).then(function (rst) {
                    var fd = formData || (new FormData());
                    fd.append(thatthat.imgKey, rst.base64);
                    xhRequest('POST',thatthat.url,fd,callback,that);
                });
                // var fd = formData || (new FormData());
                // dataReader(file,function (e) { //reader读取完成后，xhr上传
                    // dealImage(this.result,{quality: 0.8},function (base) {
                    //     fd.append(thatthat.imgKey, base); // this.result得到图片的base64
                    //     xhRequest('POST',thatthat.url,fd,callback,that);
                    // })
                // });

            }
            if (e.clipboardData && (e.clipboardData.items[0].type.indexOf('html') > -1)) {
                // 可能是浏览器右键的复制图片 此时复制的不是image file 而是 html
                window.postMessage({name:'imageHtmlPaste'},'*')
            }
        }, false);

    };

    UploadImage.prototype.drag=function(callback,formData)
    {
        var thatthat = this; 
        this.element.addEventListener('drop', function (e) {//处理目标容器（id）的drop事件
            var that = this;//这里的this指向的是this.element
            e.preventDefault(); //取消默认浏览器拖拽效果
            var fileList = e.dataTransfer.files; //获取文件对象
            //检测是否是拖拽文件到页面的操作
            if(fileList.length == 0){
                return false;
            }
            //检测文件是不是图片
            if(fileList[0].type.indexOf('image') === -1){
                console.log&&console.log("您拖的不是图片！");
                return false;
            }

            lrz(fileList[0], {
                quality: 0.8,
            }).then(function (rst) {
                var fd = formData || (new FormData());
                fd.append(thatthat.imgKey, rst.base64);
                xhRequest('POST',thatthat.url,fd,callback,that);
            });

            // dataReader(fileList[0],function (e) { //reader读取完成后，xhr上传
            //     var fd = formData || (new FormData());
            //     lrz(file, {
            //         quality: 0.8,
            //     }).then(function (rst) {
            //         fd.append(thatthat.imgKey, rst.base64);
            //         xhRequest('POST',thatthat.url,fd,callback,that);
            //     });
            //     // dealImage(this.result,{quality: 0.8},function (base) {
            //     //     fd.append(thatthat.imgKey, base); // this.result得到图片的base64
            //     //     xhRequest('POST',thatthat.url,fd,callback,that);
            //     // })
            // });
        }, false);
    };

    UploadImage.prototype.upload=function(callback,formData)
    {
        this.drag(callback,formData);
        this.paste(callback,formData);
    };

    preventDragDefault();
    //private

    function xhRequest(method,url,formData,callback,callbackContext)
    {
        var xhr=new XMLHttpRequest();
        xhr.open(method,url,true);
        xhr.onloadstart = function(){
            loading.show();
        };
        xhr.onload=function()
        {
            loading.hide();
            callback&&callback.call(callbackContext||this,xhr);
        };
        xhr.send(formData||(new FormData()));

    }

    function preventDragDefault()//阻止浏览器默认将图片打开的行为
    {
        document.addEventListener("dragleave",preventDefault);//拖离
        document.addEventListener("drop",preventDefault);//拖后放
        document.addEventListener("dragenter",preventDefault);//拖进
        document.addEventListener("dragover",preventDefault);//拖来拖去
    }

    function preventDefault(e){
        e.preventDefault();
    }

    function dataReader(file,callback)
    {
        var  reader = new FileReader();
        reader.onload =callback;
        reader.readAsDataURL(file);//获取base64编码
    }
    return UploadImage;
});