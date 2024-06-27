/**
 * Created by huangpeng on 2018-12-20.
 */
function NewWindow(option) {
    // 获取屏幕尺寸
    var screenHeight = window.screen.height
    var screenWidth = window.screen.width

    var left = option.width ? (screenWidth - option.width)/2 : screenWidth * 0.125
    var top = option.height ? (screenHeight - option.height)/2 : screenHeight * 0.125
    var paramList = {
    }
    var windowParam = {
        originData: option.originData,
        childWindowBtn : option.btn
    }
    if (option.paramList) {
        $.extend(paramList, option.paramList);
    }
    this.conf = {
        url: ctx + '/childWindow.html' + (option.urlParam || ''),
        title: option.title || 'childWindow',// 新窗口名,如果想开启多个不同的窗口，此项数据需唯一
        width: option.width || screenWidth * 0.75, // 新窗口的宽度，仅能使用正整数， 不支持百分比
        height: option.height || screenHeight * 0.75, // 新窗口的宽度，仅能使用正整数， 不支持百分比
        location: option.location || 'no', //设置新窗口中是否显示地址栏，可选值为"yes"或"no"
        menubar: option.menubar || 'no',  // 设置是否显示菜单
        toolbar: option.toolbar || 'no',  // 决定新窗口是否显示工具栏("back"、"home"和"reload")
        status: option.status || 'no',  // 决定新窗口中是否显示状态栏。警告：如果没有状态栏，可能会失去一部分用户
        scrollbars: option.scrollbars || 'no',  // 决定新窗口是否出现滚动条，除非想要隐藏一部分内容，否则不要使用这个选项
        resizable: option.resizable || 'yes',  // 决定用户是否能通过按住页面右下角来缩放新窗口
        screenX: option.screenX || left,  // 打开新窗口的左边界到右边界的以像素表示的水平距离
        screenY: option.screenY || top,  // 打开的窗口的上边界到下边界的以像素表示的垂直距离
        importCSSList: option.importCSSList|| [],// 引入css文件  传入文件的路径
        importJSList: option.importJSList || [], //引入js文件  传入文件的路径
        scriptBoxList: option.scriptBoxList || [], //js盒子，传入对应的<script id="tempjs"> 标签的id  如tempjs
        htmlBoxList: option.htmlBoxList || [], // 内容盒子  传入对应的Html 标签的id   如<div id="testDiv">  传入testDiv。后续将会在窗口中写入  div.innerHtml
        paramList: paramList,
        windowParam: windowParam
    }
}

NewWindow.prototype.pop = function () {
    var self = this
    var newWindowObi=window.open(this.conf.url,this.conf.title,
        "width="+ this.conf.width
        +",height=" + this.conf.height
        +",location=" + this.conf.location
        +",menubar=" + this.conf.menubar
        +",resizable=" + this.conf.resizable
        +",screenX="+ this.conf.screenX
        +",screenY="+ this.conf.screenY
        +",status=" + this.conf.status
        +",toolbar="+ this.conf.toolbar);
    if (!newWindowObi) {
        newWindowObi=window.open(this.conf.url,this.conf.title,
            "width="+ this.conf.width
            +",height=" + this.conf.height
            +",location=" + this.conf.location
            +",menubar=" + this.conf.menubar
            +",resizable=" + this.conf.resizable
            +",screenX="+ this.conf.screenX
            +",screenY="+ this.conf.screenY
            +",status=" + this.conf.status
            +",toolbar="+ this.conf.toolbar);
    }
    newWindowObi.onload= function()
    {
        for (var key in self.conf.windowParam) {
            newWindowObi.window[key] = self.conf.windowParam[key]
        }
        var headDom = newWindowObi.document.head
        // 引入css
        var importCSSList = self.conf.importCSSList
        for (var i = 0; i < importCSSList.length; ++i) {
            headDom.appendChild(newCssLink(importCSSList[i]))
        }
        // 引入js
        var importJSList = self.conf.importJSList
        for (var i = 0; i < importJSList.length; ++i) {
            headDom.appendChild(newJsLink(importJSList[i]))
        }
        // 初始化全局参数
        var writeJs = ''
        var paramList = self.conf.paramList
        for (var key in paramList) {
            writeJs += 'var ' + key + " = `" + paramList[key] + "`\n"
        }
        console.log(writeJs)
        // 写入js
        var scriptBoxList = self.conf.scriptBoxList
        for (var i = 0; i < scriptBoxList.length; ++i) {
            writeJs += document.getElementById(scriptBoxList[i]).innerHTML + '\n'
        }
        var toappendJsDom = document.createElement('script')
        var toappendJs = document.createTextNode(writeJs)
        toappendJsDom.appendChild(toappendJs)
        headDom.appendChild(toappendJsDom)
        // 写入内容
        var html = ''
        var htmlBoxList = self.conf.htmlBoxList
        for (var i = 0; i < htmlBoxList.length; ++i) {
            html += document.getElementById(htmlBoxList[i]).innerHTML + '\n'
        }
        newWindowObi.document.body.innerHTML = html
    }
}

function newCssLink(src) {
    var css = document.createElement('link')
    var href = document.createAttribute("href")
    href.value = src
    var rel = document.createAttribute("rel")
    rel.value = 'stylesheet'
    var media = document.createAttribute("media")
    media.value = 'all'
    css.setAttributeNode(href)
    css.setAttributeNode(rel)
    css.setAttributeNode(media)
    return css
}
function newJsLink(src) {
    var script = document.createElement('script')
    var srcAttr = document.createAttribute("src")
    srcAttr.value = src
    script.setAttributeNode(srcAttr)
    return script
}