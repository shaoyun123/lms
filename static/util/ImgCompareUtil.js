/**
 * Created by huangpeng on 2019-12-17.
 */

/**
 * 检查是否有重复的图片
 * @param allImges 待检查的图片元素
 * @returns {boolean}
 */
function checkImgRepeat(allImges) {
    // 取消所有的红框标记
    allImges.removeClass('shine_red')
    if (!allImges || allImges.length == 0) { // 无图默认成功
        return true
    }
    var imgList = []
    for (var i = 0; i < allImges.length; ++i) {
        imgList.push({
            ele: allImges[i],
            pixels: getpixels(allImges[i],40,40)
        })
    }
    var pixelsJson = {}
    var ifRepeat = false
    for (var i =0; i < imgList.length; ++i) {
        if (pixelsJson[imgList[i].pixels]) {
            $(pixelsJson[imgList[i].pixels]).addClass('shine_red')
            $(imgList[i].ele).addClass('shine_red')
            ifRepeat = true
            continue
        }
        pixelsJson[imgList[i].pixels] = imgList[i].ele
    }
    if (ifRepeat) {
        return false
    }
    return true
}
/**
 * 比较两张图片的相似度
 * @param image1  待比较的图片1
 * @param image2  待比较的图片2
 * @param tmplw
 * @param tmplh
 * @returns {number}
 */
function searchImage(image1, image2, tmplw, tmplh) {
    var canvas = document.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        sw = image1.width,  // 原图宽度
        sh = image1.height,  // 原图高度
        tw = tmplw || 8,  // 模板宽度
        th = tmplh || 8;  // 模板高度
    canvas.width = tw;
    canvas.height = th;
    ctx.drawImage(image1, 0, 0, sw, sh, 0, 0, tw, th);
    var pixels = ctx.getImageData(0, 0, tw, th);
    pixels = toGrayBinary(pixels, true, null, true);
    var canvas2 = document.createElement('canvas');
    var ctx2 = canvas2.getContext('2d');
    canvas2.width = tw;
    canvas2.height = th;
    ctx2.drawImage(image2, 0, 0, image2.width, image2.height, 0, 0, tw, th);
    var pixels2 = ctx2.getImageData(0, 0, tw, th);
    pixels2 = toGrayBinary(pixels2, true, null, true);
    var similar = 0;
    for (var i = 0, len = tw * th; i < len; i++) {
        if (pixels[i] == pixels2[i]) similar++;
    }
    similar = (similar / (tw * th)) * 100;
    return similar;
}

/**
 * 获取图片灰度
 * @param image
 * @param tmplw 压缩宽
 * @param tmplh 压缩高
 * @returns {ImageData}
 */
function getpixels(image, tmplw, tmplh) {
    var canvas = document.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        sw = image.width,  // 原图宽度
        sh = image.height  // 原图高度
        image.crossOrigin = "Anonymous";
    canvas.width = tmplw
    canvas.height = tmplh
    try {
        ctx.drawImage(image, 0, 0, sw, sh, 0, 0, tmplw, tmplh);
    } catch (e){
        layui.layer.msg('存在图片未加载完成或者图片无效，请等待加载完成或者删除掉无效图片。')
        throw e
    }
    // var img = new Image()
    // img.crossOrigin = ''
    // img.src = image.src
    // img.onload = function () {
    //     ctx.drawImage(img, 0, 0, sw, sh, 0, 0, tmplw, tmplh);
    //     var pixels = ctx.getImageData(0, 0, tmplw, tmplh);
    //     console.log(pixels)
    // }

    var pixels = ctx.getImageData(0, 0, tmplw, tmplh);
    pixels = toGrayBinary(pixels, true, null, true);
    return pixels
}

function getSimilar(pixels,pixels2,tmplw, tmplh) {
    var similar = 0;
    for (var i = 0, len = tmplw * tmplh; i < len; i++) {
        if (pixels[i] == pixels2[i]) similar++;
    }
    similar = (similar / (tmplw * tmplh)) * 100;
    return similar;
}

// 像素数据，是否二值化（bool），二值化闵值（0-255），是否返回二值化后序列（bool）
function toGrayBinary(pixels, binary, value, sn) {
    var r, g, b, g, avg = 0, len = pixels.data.length, s = '';
    for (var i = 0; i < len; i += 4) {
        avg += (.299 * pixels.data[i] + .587 * pixels.data[i + 1] + .114 * pixels.data[i + 2]);
    }
    avg /= (len / 4);
    for (var i = 0; i < len; i += 4) {
        r = .299 * pixels.data[i],
            g = .587 * pixels.data[i + 1],
            b = .114 * pixels.data[i + 2];
        if (binary) {
            if ((r + g + b) >= (value || avg)) {
                g = 255;
                if (sn) s += '1';
            } else {
                g = 0;
                if (sn) s += '0';
            }
            g = (r + g + b) > (value || avg) ? 255 : 0;
        } else {
            g = r + g + b;
        }
        pixels.data[i] = g,
            pixels.data[i + 1] = g,
            pixels.data[i + 2] = g;
    }
    if (sn) return s;
    else return pixels;
}