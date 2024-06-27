/**
 * 下载图片，并打包成zip下载
 * @param imgDtoArr  要下载的<img>元素数组
 *      [
 *          {url: '', fileName: ''}   //  fileName为下载后，图片的名字，无文件后缀时，默认使用url的文件类型后缀。
 *       ]
 * @param zipName  打包后的zip文件名
 */
function packageImages(imgDtoArr,zipName){
    if (imgDtoArr.length === 0) {
        layui.layer.msg('无图片可下载')
        return
    }
    // 缓存当前下载文件名，防止多次点击执行   1分钟内不允许多次执行
    let lastExecTime = localStorage[zipName]
    console.log('上次执行时间：' + lastExecTime)
    let now = new Date().getTime()
    if (lastExecTime && now - parseInt(lastExecTime) < 60000) {
        layui.layer.alert('正在下载中，请稍后再试')
        return
    }
    localStorage[zipName] = now
    layui.layer.msg('开始打包下载，请稍等')

    let imgBase64 = []; // 图片加载成功的base64
    let imageSuffix = [];// 图片后缀
    let zip = new JSZip();

    for(let i=0;i<imgDtoArr.length;i++){
        let src = imgDtoArr[i].url;
        let reg = /^\s*data:([a-z]+\/[a-z0-9-+.]+(;[a-z-]+=[a-z0-9-]+)?)?(;base64)?,([a-z0-9!$&',()*+;=\-._~:@\/?%\s]*?)\s*$/i;
        // 判断图片是BASE64还是图片链接
        if(reg.test(src)){
            imgBase64.push(
                {
                    base64: src.split(";base64,")[1],
                    fileName: imgDtoArr[i].fileName + "." + (src.indexOf("data:image/jpeg;") != -1?"jpg":"png")
                }
            );
        }else{
        let suffix = src.substring(src.lastIndexOf("."));
        imageSuffix.push(suffix);
        let imgTypeSplit = [],imgType = '';
        if(imgDtoArr[i].fileName != ''){
            imgTypeSplit = imgDtoArr[i].fileName.split(".")
        }
        let fileName = imgDtoArr[i].fileName + (imgDtoArr[i].fileName.indexOf(".") > 0 ? "" : suffix)
        // 新增了JPG/PNG参数，前端直接修改文件后缀，图片在ps中打不开，所以在canvas转换的时候，就修改格式
        imgType = imgTypeSplit[imgTypeSplit.length - 1]
        getBase64(src,imgType)
            .then(function(base64){
                imgBase64.push(
                    {
                        base64: base64.substring(22),
                        fileName: fileName
                    }
                );
            },function(err){
                console.log(err);//打印异常信息
            });
        }
    }

    function tt(){
        setTimeout(function(){
            if(imgDtoArr.length === imgBase64.length){
                for(let i=0;i<imgDtoArr.length;i++){
                    zip.file(imgBase64[i].fileName , imgBase64[i].base64, {base64: true});
                }
                zip.generateAsync({type:"blob"}).then(function(content) {
                    saveAs(content, zipName + ".zip");
                    localStorage[zipName] = ''
                });

            }else{
                console.log("总共下载"+ imgDtoArr.length +"个图片,已经准备好" + imgBase64.length + "个图片");//打印异常信息
                tt();
            }
        },100);

    }
    tt();

}


//传入图片路径，返回base64
function getBase64(img,imgType){
    function getBase64Image(img,width,height) {//width、height调用时传入具体像素值，控制大小 ,不传则默认图像大小
        let canvas = document.createElement("canvas");
        canvas.width = width ? width : img.width;
        canvas.height = height ? height : img.height;
        let ctx = canvas.getContext("2d");
        if(imgType == 'jpg'){
            ctx.fillStyle = "rgba(255, 255, 255, 1)";
        }else if(imgType == 'png'){
            ctx.fillStyle = "rgba(255, 255, 255, 0)";
        }
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        let MIME_TYPE = "image/jpeg";
        if(imgType == 'jpg'){
            MIME_TYPE = "image/jpeg";
        }else if(imgType == 'png'){
            MIME_TYPE = "image/png";
        }
        let dataURL = canvas.toDataURL(MIME_TYPE);
        return dataURL;
    }
    let image = new Image();
    image.crossOrigin = 'Anonymous';
    image.src = img;
    let deferred=$.Deferred();
    if(img){
        image.onload =function (){
            deferred.resolve(getBase64Image(image));//将base64传给done上传处理
        }
        return deferred.promise();//问题要让onload完成后再return sessionStorage['imgTest']
    }
}

//采集视频图片模块 传入图片路径，返回base64
function getBase64And1000(img){
    function getBase64Image(img,width,height) {//width、height调用时传入具体像素值，控制大小 ,不传则默认图像大小
        let canvas = document.createElement("canvas");
        canvas.width = width ? width : img.width;
        canvas.height = height ? height : img.height;

        let ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        let MIME_TYPE = 'image/jpeg'
        if(img.src.toLowerCase().indexOf(".jpg") != -1 || img.src.toLowerCase().indexOf(".jpeg") != -1 || img.src.toLowerCase().indexOf("/jpeg") != -1){
            MIME_TYPE = "image/jpeg";
        }else if(img.src.toLowerCase().indexOf(".png") != -1 || img.src.toLowerCase().indexOf("/png") != -1){
            MIME_TYPE = "image/png";
        }
        let dataURL = canvas.toDataURL(MIME_TYPE);
        return dataURL;
    }
    let image = new Image();
    image.crossOrigin = 'Anonymous';
    image.src = img;
    let deferred=$.Deferred();
    if(img){
        image.onload =function (){
            deferred.resolve(getBase64Image(image,1000,1000));//将base64传给done上传处理
        }
        return deferred.promise();//问题要让onload完成后再return sessionStorage['imgTest']
    }
}

/**
 * 根据图片url转为png文件对象
 * @param url
 * @param imageName
 * @returns {Promise<unknown>}
 */
function getImageBase64(url, imageName, resHead) {
    return new Promise((resolve, reject) => {
        let parts = url.split(';base64,');
        let contentType = parts[0].split(':')[1];
        var blob = null;
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        if(resHead == 'no-cache'){
        xhr.setRequestHeader("Cache-Control", "no-cache");
        }
        xhr.setRequestHeader('Accept', `${contentType}`);
        xhr.responseType = "blob";
        // 加载时处理
        xhr.onload = () => {
            let a = new FileReader();
            a.onload = function (e) {
                // 返回base64
                resolve(e.target.result);
            }
            a.readAsDataURL(xhr.response);
        };
        xhr.onerror = (e) => {
            if(e.type == 'error'&&resHead == undefined){
                getImageBase64(url, imageName, 'no-cache')
            }
            reject(e)
        };
        // 发送
        xhr.send();
    });
}


/**
 * 根据图片url转为文件对象
 * @param url
 * @returns {Promise<unknown>}
 */
function getFileByUrl(url,fileName,type) {
    return new Promise((resolve, reject) => {
        var blob = null;
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.setRequestHeader('Accept', type);
        xhr.responseType = "blob";
        // 加载时处理
        xhr.onload = () => {
            blob = xhr.response;
            let file= new File([blob], fileName, { type: type });
            // 返回结果
            resolve(file);
        };
        xhr.onerror = (e) => {
            reject(e)
        };
        // 发送
        xhr.send();
    });
}
