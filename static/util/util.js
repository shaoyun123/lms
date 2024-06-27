/**
 * Created by 10745 on 2018/5/9.
 */
/**
 * Created by huangpeng on 2018/5/8.
 */
/**
 * 创建ajax类，
 *@param  当前页，每页记录数 ，扩展参数
 */

/**
 * 使用示例
 *  var ajax = new Ajax()
    ajax.post({
                url: ctx + "/sysPaypalEmail/delGroup.html",
                data: JSON.stringify(toDelData),
                contentType: 'application/json',
                success: function (data) {
                    if (data.code == '0000') {
                        layer.msg('操作成功')
                        $('#searchPaypalBtn_accM').trigger('click')
                    } else {
                        layer.msg(data.msg)
                    }
                },
                complete: function () {
                    toDelData = {}
                }
    })
 *
 *  使用该方法的有点:  无需关注loading层的实现、避免重复提交、减少ajax的参数配置、 不用关注请求失败的返回处理
 *
 * @param ifShowSuccess  是否使用默认的 返回处理方法
 * @constructor
 */
function OneAjax() {}
OneAjax.prototype.post = function(postConfig, type,noloading) {
    let ajax = new Ajax()
    ajax.post(postConfig, type,noloading)
    return ajax
}
var oneAjax = new OneAjax()

function Ajax(ifShowSuccess) {
    this.ifShowSuccess = ifShowSuccess
}
//添加post函数
/**
 * 发送ajax
 * @param JsonObj 参数实体
 * @param type 报错弹窗类型
 * @param noLoading 关闭loading
 */
Ajax.prototype.post = function(JsonObj, type, noLoading) {
    if(!noLoading){
        loading.show()
    }
    // 整理参数
    var obj = {
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json;charset=utf-8'
    }
    $.extend(obj, JsonObj) // 将obj对象与object对象合并，object覆盖obj已有属性
    var self = this
    if (obj.url.indexOf(ctx) < 0) {
        obj.url = ctx + obj.url
    }
    // 如果合并后的参数，入参类型为json. 而传入的data非json字符串. 自动转为json字符串
    if (obj.contentType.indexOf('application/json') > -1 && obj.data && typeof obj.data !== 'string') {
        obj.data = JSON.stringify(obj.data)
    }
    // 组合出ajax参数
    var ajaxObj = {
        timeout: obj.timeout || 60000, //超时时间设置，单位毫秒
        type: obj.type,
        dataType: obj.dataType,
        url: obj.url,
        contentType: obj.contentType,
        processData: obj.processData,
        data: obj.data,
        async: obj.async != null ? obj.async : true,
        success: function(data) {
            loading.hide()
            if (obj.success) {
                obj.success(data)
            }
            if (self.ifShowSuccess && data.code == '0000') {
                layer.msg('操作成功')
            }
            if (data.code != '0000' && data.code != '0909') {
                if (type === 'area') {
                    layer.alert(data.msg, {
                        area: ['600px', '400px']
                    })
                } else {
                    layer.alert(data.msg)
                }
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            loading.hide()
            if (obj.error) {
                obj.error(XMLHttpRequest, textStatus, errorThrown)
            }
            layui.layer.msg('请求出错')
        },
        complete: function(XMLHttpRequest, status) {
            if (obj.complete) {
                obj.complete(XMLHttpRequest, status)
            }
            self.ajaxFlag = null
            if (status == 'timeout') {
                //超时,status还有success,error等值的情况
                console.log('超时')
            }
        }
    }
    // 发送ajax请求
    if (!ajaxObj.async) {
        // 如果是同步请求，则延迟0.3S  使遮罩层得以生效
        window.setTimeout(function() {
            $.ajax(ajaxObj)
        }, 300)
    } else {
        $.ajax(ajaxObj)
    }
}

// 添加upload函数， 用于上传文件
Ajax.prototype.upload = function(JsonObj) {
    var obj = {
        type: 'POST',
        async: false,
        // 告诉jQuery不要去处理发送的数据
        processData: false,
        // 告诉jQuery不要去设置Content-Type请求头
        contentType: false
    }
}

// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
//Format("2016-10-04 8:9:4.423","yyyy-MM-dd hh:mm:ss.S") ==> 2016-10-04 08:09:04.423
//Format("1507353913000","yyyy-M-d h:m:s.S")      ==> 2017-10-7 13:25:13.0
function Format(datetime, fmt) {
    if (datetime == 'Invalid Date') {
        return ''
    }
    if (datetime) {
        datetime = datetime.toString()
        if (parseInt(datetime) == datetime) {
            if (datetime.length == 10) {
                datetime = parseInt(datetime) * 1000
            } else if (datetime.length == 13) {
                datetime = parseInt(datetime)
            }
        }
        datetime = new Date(datetime)
        var o = {
            'M+': datetime.getMonth() + 1, //月份
            'd+': datetime.getDate(), //日
            'h+': datetime.getHours(), //小时
            'm+': datetime.getMinutes(), //分
            's+': datetime.getSeconds(), //秒
            'q+': Math.floor((datetime.getMonth() + 3) / 3), //季度
            S: datetime.getMilliseconds() //毫秒
        }
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (datetime.getFullYear() + '').substr(4 - RegExp.$1.length))
        for (var k in o)
            if (new RegExp('(' + k + ')').test(fmt))
                fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
        return fmt
    } else {
        return ''
    }
}

/**
 * 获取当前时间年月日eg:2019-07-16
 * @returns {string}
 */
function getNowFormatDate() {
    var date = new Date()
    var seperator1 = '-'
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var strDate = date.getDate()
    if (month >= 1 && month <= 9) {
        month = '0' + month
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = '0' + strDate
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate
    return currentdate
}
/**
 * 获取标签字典
 * @param headCode 标签字典头
 * @param selector 标签选择元素的 选择器
 * @param sync true:同步 false:不同步
 */
function initSelectIcon(form, headCode, selector, sync) {
    var asyncFlag = true
    if (sync) {
        asyncFlag = false
    }
    $.ajax({
        type: 'post',
        url: ctx + '/sysdict/getBizDictByCode.html',
        data: { headCode: headCode },
        async: asyncFlag,
        success: function(res) {
            console.log('getBizDictByCode返回')
            if (res.code === '0000') {
                var list = res.data
                var select = $(selector)
                var html = ''
                for (var i = 0; i < list.length; ++i) {
                    html += '<option value="' + list[i].code + '">' + list[i].name + '</option>'
                }
                select.append(html)
                form.render('select')
            } else {
                layer.msg(res.msg)
            }
        }
    })
}

/**
 * 检查数组中是否有重复对象
 * @param arr 要检查的数组
 * @param one 要比较的对象
 * @param filed 对象要比较的字段
 * @returns {boolean}  为true 则有重复
 */
function checkIfRepeat(arr, one, filed) {
    var flag = false
    for (var i in arr) {
        if (arr[i][filed] == one[filed]) {
            flag = true
        }
    }
    return flag
}

/**
 * 鼠标悬停展示大图
 * 通过 onmouseover=onImgHover(this)  引用  this限定img本身
 * @param elem  img元素的引用
 */
function onImgHover(elem) {
    var self = elem
    var pos = self.getBoundingClientRect()
    var bigImgWidth = 500 // 大图的宽
    var bigImgHeight = 500 // 大图的高
    var bigImgLeft = pos.left + 60 + 10
    var bigImgTop = pos.top - (bigImgHeight - 60) / 2

    // 创建一个父元素，以便删除图片
    var parent = document.createElement('div')
    parent.style.width = 0
    parent.style.height = 0
    parent.setAttribute('id', 'bigImg_hp_20180518')

    var bigImg = document.createElement('img')
    bigImg.style.position = 'fixed'
    bigImg.style.left = bigImgLeft + 'px'
    bigImg.style.top = bigImgTop + 'px'
    bigImg.style.width = bigImgWidth + 'px'
    bigImg.style.height = bigImgHeight + 'px'
    bigImg.style.zIndex = 20180615111
    bigImg.setAttribute('src', self.getAttribute('src'))
    parent.appendChild(bigImg)

    document.body.appendChild(parent)
}

/**
 * 删除大图
 */
function onImgOut() {
    var bigImgParent = document.getElementById('bigImg_hp_20180518')
    document.body.removeChild(bigImgParent)
}
/**
 * 冒泡排序
 * @param order
 * @param arr
 * @param property
 * @returns {*}
 */
function sortArr(order, arr, property) {
    //                 order  1 从小到大   2  从大到小
    //                 arr 循环数组
    //                 property 要比较的属性  例如（arr[i][property]）
    var p = 0
    var q = 0
    var temp = {}
    if (property) {
        if (order === 1) {
            for (p = 0; p < arr.length; ++p) {
                for (q = 1; q < arr.length - p; ++q) {
                    if (
                        (parseFloat(arr[q - 1][property]) ? parseFloat(arr[q - 1][property]) : 0) >
                        (parseFloat(arr[q][property]) ? parseFloat(arr[q][property]) : 0)
                    ) {
                        temp = arr[q - 1]
                        arr[q - 1] = arr[q]
                        arr[q] = temp
                    }
                }
            }
        } else {
            for (p = 0; p < arr.length; ++p) {
                for (q = 1; q < arr.length - p; ++q) {
                    if (
                        (parseFloat(arr[q - 1][property]) ? parseFloat(arr[q - 1][property]) : 0) <
                        (parseFloat(arr[q][property]) ? parseFloat(arr[q][property]) : 0)
                    ) {
                        temp = arr[q - 1]
                        arr[q - 1] = arr[q]
                        arr[q] = temp
                    }
                }
            }
        }
    } else {
        if (order === 1) {
            for (p = 0; p < arr.length - 1; ++p) {
                for (q = 1; q < arr.length - p; ++q) {
                    if (parseFloat(arr[q - 1]) > parseFloat(arr[q])) {
                        temp = arr[q - 1]
                        arr[q - 1] = arr[q]
                        arr[q] = temp
                    }
                }
            }
        } else {
            for (p = 0; p < arr.length - 1; ++p) {
                for (q = 1; q < arr.length - p; ++q) {
                    if (parseFloat(arr[q - 1]) < parseFloat(arr[q])) {
                        temp = arr[q - 1]
                        arr[q - 1] = arr[q]
                        arr[q] = temp
                    }
                }
            }
        }
    }
    return arr
}

function checkNull(data) {
    for (var key in data) {
        if (typeof data[key] == 'string' && data[key] != null && !data[key].trim()) {
            delete data[key]
        }
    }
}

var initNotNull, checkNotNull, submitForm

$(function() {
    initNotNull = function(formSelector) {
        if (formSelector) {
            formSelector += ' '
        } else {
            formSelector = ''
        }
        var span = $('<span style="color: red">*</span>')
        $(formSelector + '[notNull] label').prepend(span)
    }

    // 不符合要求返回false
    checkNotNull = function(parentSelector, a) {
        var layer = layui.layer
        var parent = $(parentSelector)
        var notNullContains = parent.find('[notNull]:visible')
        if (!notNullContains) {
            return true
        }
        var label, tagName, value
        console.log(111)
        for (var i = 0; i < notNullContains.length; ++i) {
            label = $(notNullContains[i]).find('label').text()
            label = label.substr(1, label.length - 1)
            tagName = $(notNullContains[i]).find('[name]')[0].tagName
            let type = $(notNullContains[i]).find('[name]')[0].getAttribute('type')
            if (tagName === 'INPUT' && type === 'checkbox') {
                let checkedOne = $(notNullContains[i]).find('[name]:checked')
                if (checkedOne && checkedOne.length > 0) {
                    value = checkedOne[0].value
                } else {
                    value = ''
                }
            } else {
                value = $(notNullContains[i]).find('[name]').val()
            }

            if (!value || !value.trim()) {
                if (tagName == 'SELECT') {
                    layer.msg('请选择' + label)
                    return false
                } else {
                    if (type === 'checkbox') {
                        layer.msg('请选择' + label)
                        return false
                    } else {
                        layer.msg('请输入' + label)
                        return false
                    }
                }
            }
        }
        return true
    }
    /**
             * 模拟表单提交
             * @param data  表单数据 json 格式
             * @param url  请求路径
             * @param target 可选，表单打开方式:_blank _self _parent _top
             */
    submitForm = function(data, url, target) {
        var form = $('<form></form>')
        form.attr('action', url)
        form.attr('method', 'post')
        if (target) {
            form.attr('target', target)
        } else {
            form.attr('target', '_blank')
        }

        for (var key in data) {
            var temp = $("<input type='hidden' name='" + key + "' value='" + data[key] + "'/>")
            form.append(temp)
        }
        form.appendTo('body')
        form.css('display', 'none')
        form.submit()
    }
})

//商品详情按钮弹窗
$('body').on('click', '#prodDetail', function(event) {
    let id = $(this).attr('data-id')
    let pSku = $(this).attr('data-psku')
    let options = {
        showOaNewCate: $(this).attr('data-oanewcate')
    }
    if (!isNaN(id) || pSku) {
        layui.admin.publicDetail(
            function() {
                renderProduct(id, pSku, options)
            },
            function(layero) {
                //一键下载图片
                let downLoadImgBtn =
                    '<button id="downLoadImgBtn" class="layui-btn layui-btn-primary layui-btn-sm"  style="float: left;">图片下载</button>'
                $(layero).find('.layui-layer-btn a:first').before(downLoadImgBtn)
                $('#downLoadImgBtn').click(function() {
                    let pSku = $('.unEditProdTplForm [name=pSku]').val()
                    $(layero).find('img').each(function(index, item) {
                        downLoadImg(item, pSku)
                    })
                })
            }
        )
    }
})
$('body').on('click', '#prodDetail_smtListing', function(event) {
    var id = $(this).attr('data-id')
    var prodPSku = $(this).attr('prodpsku') //产品sku
    var type = $(this).attr('type')
    let options = {
        showOaNewCate: $(this).attr('data-oanewcate')
    }
	const storeAcctId=$(this).attr("data-storeacctid")
    if (!isNaN(id)) {
        layui.admin.publicDetail(
            function() {
                renderProduct(id, prodPSku,options)
            },
            function(layero) {
                if (type !== 'amazon') {
                    var smtPriceBtn =
                        '<button id="smtPriceBtn" data-id="' +
                        id + '" data-storeacctid="' + 
                        storeAcctId + '" class="layui-btn-sm layui-btn layui-btn-primary" style="float: left;">刊登价预估</button>'
                    $(layero).find('.layui-layer-btn a:first').before(smtPriceBtn)
                    //美工评分按钮
                    var artBtn =
                        '<button class="layui-btn layui-btn-sm" onclick="evaluate_selfImg(' +
                        "'" +
                        prodPSku +
                        "'" +
                        ', 2)" style="float: left;">美工评分</button>'
                    $(layero).find('.layui-layer-btn a:first').before(artBtn)
                }
                //一键下载图片
                var downLoadImgBtn =
                    '<button id="downLoadImgBtn" class="layui-btn-sm layui-btn layui-btn-primary"  style="float: left;">图片下载</button>'
                $(layero).find('.layui-layer-btn a:first').before(downLoadImgBtn)
                $('#downLoadImgBtn').click(function() {
                    $(layero).find('img').each(function(index, item) {
                        downLoadImg(item, prodPSku)
                    })
                })
            }
        )
    } else if (prodPSku != null && prodPSku != '') {
        $.ajax({
            type: 'post',
            url: ctx + '/onlineProductSmt/getProdPIdByProdPSku.html',
            data: { prodPSku: prodPSku },
            dataType: 'json',
            success: function(returnData) {
                if (returnData.code == '0000') {
                    if (returnData.data == null || isNaN(returnData.data.id)) {
                        layer.msg('没有找到该商品对应的模板', { icon: 1 })
                        return
                    } else {
                        id = returnData.data.id
                        layui.admin.publicDetail(
                            function() {
                                renderProduct(id, prodPSku,options)
                            },
                            function(layero) {
                                var smtPriceBtn =
                                    '<button id="smtOnlinePriceBtn" data-id="' +
                                    id +
                                    '" class="layui-btn layui-btn-primary" style="float: left;">刊登价预估</button>'
                                $(layero).find('.layui-layer-btn a:first').before(smtPriceBtn)
                                // //美工评分按钮
                                // var artBtn = '<button class="layui-btn" onclick="evaluate_selfImg('+"'"+prodPSku+"'"+', 2)" style="float: left;">美工评分</button>'
                                // $(layero).find('.layui-layer-btn a:first').before(artBtn);
                            }
                        )
                    }
                } else {
                    console.log('smt根据商品sku获取商品信息失败')
                }
            }
        })
    }
})
// smt刊登价预估
 $("body").on("click","#smtPriceBtn", function(){
    	var id = $(this).attr("data-id");
        const storeAcctId=$(this).attr("data-storeacctid")
    	layer.open({
	        type: 1,
	        title: '刊登价预估',
	        btn: ['关闭'],
            id,
	        area: ["1155px", "800px"],
	        content: '',
	        success: function (layero,index) {
                layui.view(id).render('route/iframe/smt/smtListingPriceTpl').done(function () {
                })				
	        }
	    });
    });
//校验url
function validURL(url) {
    const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
    return reg.test(url)
}

//公共弹框-构造函数
function loading() {
    var _this = this
    layui.use('layer', function() {
        var layer1 = layui.layer
        _this.layer = layer1
    })
}
$.extend(loading.prototype, {
    index: '',
    show: function() {
        this.index = this.layer.load(1, {
            shade: [ 0.3, '#ccc' ]
        })
    },
    hide: function() {
        this.layer.close(this.index)
    }
})
var loading = new loading()

//表单转对象
function serializeObject(form) {
    var o = {}
    $.each(form.serializeArray(), function(index) {
        if (o[this['name']]) {
            o[this['name']] =
                o[this['name']] +
                ',' +
                (this['value'] != null && typeof this['value'] == 'string' ? this['value'].trim() : this['value'])
        } else {
            o[this['name']] =
                this['value'] != null && typeof this['value'] == 'string' ? this['value'].trim() : this['value']
        }
    })
    return o
}

/**
 * 修改单个字段弹窗
 * @param id 当前对象的id
 * @param oldData  原数据
 * @param title 弹窗名称
 * @param fieldName 字段名
 * @param url 请求地址
 */
function updateField(id, oldData, title, fieldName, url, success) {
    // console.log(id,oldData)
    var updateFieldPop =
        '<div style="padding: 20px 40px 0 40px;"> <form class="layui-form" lay-filter="component-form-element" id="updateFieldForm">  <div class="layui-form-item layui-form-text"><textarea type="text" name="' +
        fieldName +
        '" class="layui-textarea"></textarea></div>  </form></div>'

    layer = layui.layer
    var index = layer.open({
        type: 1,
        title: title,
        area: [ '40%', '30%' ],
        shadeClose: false,
        content: updateFieldPop,
        btn: [ '保存', '关闭' ],
        success: function(layero, index) {
            if (!oldData || oldData == 'null' || oldData == 'undefined') {
                oldData = ''
            }
            $('#updateFieldForm [name=' + fieldName + ']').val(oldData)
        },
        yes: function() {
            var data = {
                id: id
            }
            data[fieldName] = $('#updateFieldForm [name=' + fieldName + ']').val()
            $.ajax({
                url: url,
                type: 'post',
                dataType: 'json',
                data: JSON.stringify(data),
                contentType: 'application/json',
                success: function(data) {
                    if (data.code == '0000') {
                        layer.close(index)
                        success()
                        layer.msg('修改成功')
                    } else {
                        layer.msg(data.msg)
                    }
                }
            })
        }
    })
}

/**
 * 判断值是否为null，undefined
 * @param value
 * @param ifNullReturn  如果是null 、undefined 则返回
 */
function ifNull(value, ifNullReturn) {
    return value ? value : ifNullReturn
}

/**
 * 字符串中特殊字符转义   todo
 * @param srcString
 * @returns {*}
 */
function escapeJquery(_s) {
    _s = _s.replace(/(^\s*)|(\s*$)/g, '')

    var _r = ''

    for (var i = 0; i < _s.length; i++) {
        _r += i == 0 ? _s.charCodeAt(i) : '|' + _s.charCodeAt(i)
    }

    return _r
}

/**
 * 创建一个进度条
 * @param title 进度条描述
 * @param percent  初始百分比
 * @param cancleReback  取消进程 回调
 * @param cancleData  取消进程回调参数
 * return processId 返回进度条Id
 */
function createProcessBar(title, percent, cancleReback, cancleData) {
    var element = layui.element
    var processId = 'processBar_' + randomString(5)
    var bar = $(
        `<div id="` +
            processId +
            `" style="position: fixed;width: 100vw;height: 100vh; background-color: rgb(0, 0, 0);opacity: 0.3;z-index: 20180712">
            <div style="position: fixed;top: 15vh;left:40vw;width: 20vw;opacity: 1" >
            <div style="width: 100%;text-align: center;color: white"><span class="animated flash infinite">` +
            title +
            `</span></div>
                 <div class="layui-progress layui-progress-big" lay-showPercent="yes"  lay-filter="` +
            processId +
            `">
                       <div class="layui-progress-bar layui-bg-blue" lay-percent="` +
            percent +
            `"></div>
                 </div>
                 ` +
            (cancleReback
                ? `<div style="text-align: center;margin-top: 30px">
                    <div class="layui-btn layui-btn-sm layui-btn-primary downOnSystemBtn" >后台下载</div>
                    <div class="layui-btn layui-btn-sm layui-btn-danger processBoxCancleBtn" >取消</div>
                 </div>`
                : ``) +
            `
            </div>
        </div>`
    )
    $('body').append(bar)
    element.render('progress', processId)
    if (cancleReback && typeof cancleReback == 'function') {
        bar.find('.processBoxCancleBtn').click(function() {
            delete processIdArr[processId]
            delProcessBar(processId) //销毁进度条
            cancleReback(cancleData)
        })
    }
    bar.find('.downOnSystemBtn').click(function() {
        delete processIdArr[processId]
        delProcessBar(processId) //销毁进度条
    })
    return processId
}

/**
 * 更新进度条
 * @param processId
 * @param percent
 */
function updateProcessBar(processId, percent) {
    var element = layui.element
    $('#' + processId).find('.layui-progress-bar').attr('lay-percent', percent)
    element.render('progress', processId)
}

/**
 * 销毁进度条
 * @param id
 * @param percent
 */
function delProcessBar(id) {
    $('#' + id).remove()
}

/**
 * 产生随机字符串
 * @param len 长度
 * @returns {string}
 */
function randomString(len) {
    len = len || 32
    var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678' /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
    var maxPos = $chars.length
    var pwd = ''
    for (i = 0; i < len; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos))
    }
    return pwd
}

// 用于判断 开启的进程跟踪是否需要继续进行, 例如 使用processBegin返回1个  id= ssss222, 将其加入processIdArr, 当processIdArr中 未因其他原因删除了这个id对象，跟踪将继续
var processIdArr = {}

/**
 * data 进程信息
 * 开启一个简单的进程跟踪
 */
function simpleProcessBegin(data) {
    if (typeof data === 'object') {
        data = JSON.stringify(data)
    }
    processBegin(ctx + '/msgProcess/queryProcess', data, '正在处理数据', 3000)
}

/**
 * 启动一个进程跟踪
 * @param url 请求进度的路径
 * @param data 请求进程的参数    要求返回 0~ 100 数字
 * @param title 进度条的标题
 * @param interval  进度条更新速度  单位ms   如每0.1s 更新  则传100
 * @param succReback  成功 回调方法
 * @param failReback  失败 回调方法
 * @param cancelReback  取消进程 回调方法
 * @param times 网络通信失败次数
 */
function processBegin(url, data, title, interval, succReback, failReback, cancelReback) {
    var layer = layui.layer
    // 创建1个进度条
    var processBarId = createProcessBar(title, '0%', cancelReback, data)
    processIdArr[processBarId] = true

    function processAjax(times) {
        $.ajax({
            type: 'POST',
            url: url,
            data: data,
            async: false,
            dataType: 'json',
            contentType: 'application/json;charset=utf-8',
            success: function(response) {
                if (response.code == '0000') {
                    var map = response.data
                    var percent = map.percent
                    var status = map.processStatus
                    // 更新进度条
                    updateProcessBar(processBarId, percent + '%')
                    if (status && status != 2) {
                        delete processIdArr[processBarId]
                        window.setTimeout(function() {
                            delProcessBar(processBarId) //销毁进度条
                        }, 200)
                        if (succReback && typeof succReback == 'function') {
                            succReback(data)
                        } else {
                            layer.alert("处理完毕")
                        }
                    }
                    // 判断是否继续更新
                    if (processIdArr[processBarId]) {
                        window.setTimeout(function() {
                            processAjax()
                        }, interval)
                    }
                } else {
                    layer.alert(response.msg)
                    delete processIdArr[processBarId]
                    window.setTimeout(function() {
                        delProcessBar(processBarId) //销毁进度条
                    }, 200)
                    if (failReback && typeof failReback == 'function') {
                        failReback(data)
                    }
                }
            },
            error: function(response) {
                if (!times || times < 10) {
                    processAjax(times ? times++ : 1)
                } else {
                    delete processIdArr[processBarId]
                    layer.msg('服务器繁忙，请稍后再试')
                }
            }
        })
    }
    processAjax()
    return processBarId
}

/**
 * 模糊匹配
 * @param keyWord   需要匹配的字符串
 * @param list 可以传  objList  也可以传 strList
 * @param field 需要匹配的字段   不传 则直接匹配列表元素
 * @returns {Array}
 */
function searchData(keyWord, list, field) {
    if (!Array.isArray(list) && keyWord !== '') return
    var arr = []
    var keyword = keyWord.toLocaleLowerCase() // 不区分大小写
    var sortStr
    for (var i = 0; i < list.length; i++) {
        sortStr = list[i]
        if (field) {
            sortStr = list[i][field]
        }
        if (sortStr.indexOf(keyword) !== -1) {
            arr.push(list[i])
        }
    }
    return arr
}

/**
 * 中文 按 拼音顺序排序
 * @param list 可以传  objList  也可以传 strList
 * @param field 需要排序的字段   不传 则直接比较列表元素
 * @returns {*}
 */
function sortByEnForCN(list, field) {
    var sortlist
    if (field) {
        sortlist = list.sort(function(obj1, obj2) {
            return obj1[field].localeCompare(obj2[field], 'zh')
        })
    } else {
        sortlist = list.sort(function(obj1, obj2) {
            return obj1.localeCompare(obj2, 'zh')
        })
    }
    return sortlist
}

/**
 * 初始化自定义  可选可填输入框
 * @param parentSelector  初始化的范围，在此父元素下的 hp-select 元素
 */
function initHpSelect(parentSelector) {
    var selects = $(parentSelector + ' [hp-select]')
    for (var i = 0; i < selects.length; ++i) {
        var selectOne = $(selects[i])
        // 设置聚焦/输入时，根据其已有值，展现所有可选项
        selectOne.find('[hp-select-text]').on('focus', function() {
            showEnableLi(this)
        })
        // 设置聚焦/输入时，根据其已有值，展现所有可选项
        selectOne.find('[hp-select-text]').on('input propertychange', function() {
            showEnableLi(this, true)
        })
        // 设置失去焦点时，隐藏可选项
        selectOne.find('[hp-select-text]').on('blur', function() {
            var self = this
            window.setTimeout(function() {
                $(self).next().hide()
            }, 300)
        })
    }

    // 展示可选项
    function showEnableLi(self, ifFilter) {
        var selectOne = $(self).closest('[hp-select]')
        // 获取所有项
        var allDatali = selectOne.find('[hp-select-data]').clone(true).find('li')
        var allData = []
        var oneData
        for (var j = 0; j < allDatali.length; ++j) {
            oneData = {}
            oneData.value = allDatali[j].getAttribute('data-value')
            oneData.text = allDatali[j].innerText
            oneData.element = allDatali[j]
            allData.push(oneData)
        }

        // 筛选可选项
        var curValue = self.value
        var enableArr = allData
        if (ifFilter && curValue.trim()) {
            enableArr = searchData(curValue, allData, 'text')
        }
        // 按中文拼音排序
        enableArr = sortByEnForCN(enableArr, 'text')

        // 显示可选li
        var ul = $(self).next('ul')
        ul.empty()
        for (var k = 0; k < enableArr.length; ++k) {
            ul.append(enableArr[k].element)
        }

        //样式设置
        ul.css('display', 'block')
        var lis = $(self).next('ul').find('li')
        lis.css('padding', 8)
        lis.mouseover(function() {
            $(this).css({ background: '#f8f8f8', cursor: 'pointer' })
        })
        lis.mouseout(function() {
            $(this).css({ background: '' })
        })
        // 给可选项li  加点击事件
        lis.on('click', function() {
            $(this).closest('[hp-select]').find('[hp-select-text]').val($(this).text())
        })
    }
}

/**
 * 供应商输入模糊搜索
 */
function DimSearch(id, ele, options) {
    this.id = id
    this.ele = ele
    ;(this.url = options ? options.url : '/prodSupplier/searchSupplier.html'),
        (this.query = options ? options.query : 'name'),
        (this.type = options ? options.type : 'post'),
        (this.label = options ? options.label : 'supplier'),
        (this.isIncludeData = options ? options.isIncludeData : false)
    this.name = options ? options.name : '.dimResultDiv'
}

$.extend(DimSearch.prototype, {
    init: function() {
        var id = this.id,
            name = this.name,
            _this = this
        this.keycode()
        $(id).bind('input propertychange', function() {
            _this.render()
        })
    },
    render: function() {
        var _this = this,
            id = this.id,
            name = this.name,
            ele = this.ele,
            type = this.type,
            query = this.query,
            label = this.label,
            isIncludeData = this.isIncludeData
        console.log(name, 'dimResultDivItem')
        window.dimThis = this
        var val = $.trim($(id).val())
        if (val == '') {
            $(name).hide().html('')
            $(id).closest('form').find('[name=' + ele + ']').val('')
            return
        }
        var ajaxUrl = ctx + _this.url

        if ($(id).attr('sourType') == 'outof_stock') {
            //如果来源是缺货列表
            ajaxUrl = ctx + '/outofStock/searchOutofStockPSupplyList.html'
        }

        console.log('ajaxUrl:' + ajaxUrl)
        //根据val值发送ajax请求
        var data = {}
        data[query] = val
        $.ajax({
            url: ajaxUrl,
            type: type,
            data: data,
            success: function(data) {
                var html = '' //自定义一个空字符串
                if (isIncludeData) {
                    data = data.data
                }
                $.each(data, function(i, v) {
                    if (v[label]) {
                        if (v[label].indexOf(val) > -1) {
                            html +=
                                "<div data-supplierid='" +
                                v.id +
                                "' class='dimResultDivItem' onmouseenter='dimThis.getFocus(this)' onClick='dimThis.getCon(this);'>" +
                                v[label] +
                                '</div>'
                        }
                    }
                    // if (v.supplier) {
                    //     v.supplier = v.supplier || v[label]
                    //     if (v.supplier.indexOf(val) > -1) {
                    //         html +=
                    //             "<div data-supplierid='" +
                    //             v.id +
                    //             "' class='dimResultDivItem' onmouseenter='dimThis.getFocus(this)' onClick='dimThis.getCon(this);'>" +
                    //             v.supplier +
                    //             '</div>'
                    //     }
                    // } else if (v.userName) {
                    //     v.userName = v.userName || v[label]
                    //     if (v.userName.indexOf(val) > -1) {
                    //         html +=
                    //             "<div data-supplierid='" +
                    //             v.id +
                    //             "' class='dimResultDivItem' onmouseenter='dimThis.getFocus(this)' onClick='dimThis.getCon(this);'>" +
                    //             v.userName +
                    //             '</div>'
                    //     }
                    // }
                })
                if (html != '') {
                    $(name).show().html(html)
                    $(name).addClass('dimResultDiv')
                } else {
                    $(name).hide().html('')
                }
            }
        })
    },
    keycode: function() {
        var id = this.id,
            name = this.name,
            ele = this.ele
        _this = this
        $(document).on('click', function(e) {
            var cont = $('.dimSearchContent')
            if (!cont.is(e.target) && cont.has(e.target).length === 0) {
                cont.find(name).hide()
            } else {
                cont.find(name).show()
            }
        })
        $(document).keydown(function(e) {
            if (e.keyCode == 38) {
                //上键
                e.stopPropagation()
                e.preventDefault()
                if ($.trim($(name).html()) == '') {
                    return
                }
                $(id).blur() //输入框失去焦点
                if ($('.dimResultDivItem').hasClass('addbg')) {
                    _this.movePrev()
                } else {
                    $('.dimResultDivItem').removeClass('addbg').eq($('.dimResultDivItem').length - 1).addClass('addbg') //第一个选项添加类名
                }
            } else if (e.keyCode == 40) {
                //下键
                e.stopPropagation()
                e.preventDefault()
                if ($.trim($(name).html()) == '') {
                    return
                }
                $(id).blur() //输入框失去焦点
                if ($('.dimResultDivItem').hasClass('addbg')) {
                    _this.moveNext()
                } else {
                    $('.dimResultDivItem').removeClass('addbg').eq(0).addClass('addbg') //第一个选项添加类名
                }
            } else if (e.keyCode == 13) {
                _this.doJob()
            }
        })
    },
    movePrev: function() {
        var len = $('.addbg').prevAll().length //获取有背景色的元素,之前的所有元素的长度
        if (len == 0) {
            $('.dimResultDivItem').removeClass('addbg').eq($('.dimResultDivItem').length - 1).addClass('addbg')
        } else {
            $('.dimResultDivItem').removeClass('addbg').eq(len - 1).addClass('addbg')
        }
    },
    moveNext: function() {
        var len = $('.addbg').prevAll().length //获取到之前的元素长度
        if (len == $('.dimResultDivItem').length - 1) {
            $('.dimResultDivItem').removeClass('addbg').eq(0).addClass('addbg')
        } else {
            $('.dimResultDivItem').removeClass('addbg').eq(len + 1).addClass('addbg')
        }
    },
    doJob: function() {
        var id = this.id,
            name = this.name,
            ele = this.ele,
            _this = this
        $(id).blur()
        var value = $('.addbg').text(),
            supplierid = $('.addbg').data('supplierid')
        $(id).closest('form').find('[name="' + ele + '"]').val(supplierid)
        $(id).val(value)
        $(name).hide().html('')
    },
    getFocus: function(obj) {
        $('.dimResultDivItem').removeClass('addbg')
        $(obj).addClass('addbg')
    },
    getCon: function(obj) {
        var id = this.id,
            ele = this.ele,
            name = this.name
        var value = $(obj).text(),
            supplierid = $(obj).data('supplierid')
        $(id).closest('form').find('[name="' + ele + '"]').val(supplierid)
        $(id).val(value)
        $(name).hide().html('')
    }
})

var cateXtreePop = `<form class="layui-form">
     <div style="margin: 10px">
            <span style="width: 60%;float: left;margin-right: 20px">
                <input class="layui-input" id="cateSearchInp_xtree" placeholder="类目搜索">
            </span>
            <span class="layui-btn layui-btn-sm" id="searchCateBtn_xtree">搜索</span>
     </div>
    <div id="xtree1" style="width:100%;padding: 10px 0 25px 5px;box-sizing:border-box;"></div>
    </form>`
var cateXtreePopSingle = `<div style="background:#fdf6ec;color:#e6a23c;margin: 20px 20px 0 20px;padding: 10px;border-radius: 5px;">
    注意:此处仅允许单选!!</div><form class="layui-form">
    <div id="xtree1" style="width:100%;padding: 10px 0 25px 5px;box-sizing:border-box;"></div></form>`
/**
     * 清空产品类目的选中项目
     * @param {产品类目内容所在div的id} divId
     * @param {input-hidden元素的id} hiddenId
     */
function clearCate(divId, hiddenId) {
    $('#' + divId).html('')
    $('#' + hiddenId).val('')
}

/**
 * 清空产品类目的选中项目以及其他元素集合;
 * <Note>
 *     elementArr : 元素目前只针对常用的  span 和 input 进行了处理;
 *     如果有其他需要进行处理的请自行 添加处理
 * </Note>
 * @param {产品类目内容所在div的id} divId
 * @param {input-hidden元素的id} hiddenId
 * @param {需要清空的其他元素数组} elementArr 
 */
function clearCateAndOtherElementArray(divId, hiddenId, elementArr) {
    $('#' + divId).text('')
    $('#' + hiddenId).val('')

    if (elementArr instanceof Array) {
        elementArr.map((element, index) => {
            clearTextForElement(element)
        })
    } else {
        clearTextForElement(elementArr)
    }
}

/**
 * 单个元素清空；当前只处理了 span 和 input ；
 * 如果有其他需要进行处理的请自行 添加处理
 * @param elementId {需要清空的其他元素id}
 */
function clearTextForElement(elementId) {
    if (!elementId || $.trim(elementId) === '') {
        console.error('clearTextForElement error for empty')
        return
    }
    var $element = $('#' + elementId)
    var tagName = $element[0].tagName

    if (tagName === 'INPUT') {
        $element.val('')
    } else if (tagName === 'SPAN') {
        $element.val('')
    } else {
        console.log('clearTextForElement  -- > element tag --> [' + tagName + '] not support ')
    }
}

/**
 * 获取供应商的一级和二级类目的树形结构
 * @param {渲染的树形结构所在的div的ID值} xtreeId
 */
var cateXTreeForSupplier

function initCateXtreeForSupplier() {
    $.ajax({
        type: 'post',
        url: ctx + '/product/getCateForSupplier.html',
        dataType: 'json',
        async: false,
        success: function(data) {
            if ((data.code = '0000')) {
                cateXTreeForSupplier = data.data
            } else {
                layui.layer.msg('初始化类目选择组件失败:' + data.msg)
            }
        }
    })
}

 // 遍历得出全选的长度
 function iterateArrLength(count,arr){
    for(var i=0;i<arr.length;i++){
        if(arr[i].data.length){
            count = iterateArrLength(count ,arr[i].data)
        }else{
            count++
        }
    }
    return count
}

function getFirstSecondCate(valueInp, nameInp) {
    if (!cateXTreeForSupplier) {
        initCateXtreeForSupplier()
    }
    var form = layui.form
    var json = JSON.parse(JSON.stringify(cateXTreeForSupplier))
    // 复现 已选择类目
    if (valueInp.val()) {
        var ids = valueInp.val().split(',')
        $.each(ids, function(i, id) {
            $.each(json, function(j, val) {
                if (id == val.value) {
                    val.checked = true
                }
                $.each(val.data, function(k, d) {
                    if (d.value == id) {
                        d.checked = true
                    }
                })
            })
        })
    }
    var xtree = new layuiXtree({
        elem: 'xtree1', //必填,放置xtree的容器id，不要带#号
        form: form, //必填,layui 的 from
        data: json, //必填
        isopen: false, //加载完毕后的展开状态，默认值：true
        ckall: false, //启用全选功能，默认值：false
        color: {
            //三种图标颜色，独立配色，更改几个都可以
            open: '#EE9A00', //节点图标打开的颜色
            close: '#EEC591', //节点图标关闭的颜色
            end: '#828282' //末级节点图标的颜色
        },
        click: function(data) {
            //节点选中状态改变事件监听，全选框有自己的监听事件
            if($('#xtree1').find('input[name=shopee-allchecked-cate]').length){
                saveXtreeData(xtree, $('#xtreeSearchHidden'), $('#xtreeSearchDiv'));
                var categoryIdListLength =serializeObject($('#shopeerules_form_addrules')).categoryIdList.split(',').length
                var count =iterateArrLength(0,cateXTreeForSupplier)
                categoryIdListLength == count ? $('#xtree1').find('input[name=shopee-allchecked-cate]').prop('checked',true)
                :$('#xtree1').find('input[name=shopee-allchecked-cate]').prop('checked',false)
                form.render()
            }
        }
    })
    // 绑定搜索功能
    $('#cateSearchInp_xtree').keydown(function(event) {
        if (event.keyCode == 13) {
            var title = $('#cateSearchInp_xtree').val().trim()
            if (title) {
                xtree.searchLikeByTitle(title)
            }
            event.preventDefault()
        }
    })
    $('#searchCateBtn_xtree').click(function() {
        var title = $('#cateSearchInp_xtree').val().trim()
        if (title) {
            xtree.searchLikeByTitle(title)
        }
    })
    return xtree
}
/**
 * 树形二级类目
 * @param {点击弹出树形框的按钮的id} btnId
 * @param {弹层所在的script的id} layId
 * @param {被渲染的xtree结构的div元素} xtreeId
 * @param {点击以后value值渲染到的div的id} xtreeDivId
 * @param {点击完成以后input[hidden]的id,用来接收id} xtreeHiddenId
 * @param {所有参数都是jquery元素}
 */
function alertCateSelect(btn, xtreeHiddenId, xtreeDivId) {
    var xtree
    btn.click(function() {
        var layerHandle = function(content, fn) {
            var index = layer.open({
                type: 1,
                title: '类目',
                id: 'btnIdSuccess',
                // content: cateXtreePop,
                content: content,
                area: [ '600px', '90%' ],
                btn: [ '保存', '关闭' ],
                success: function(layero) {
                    xtree = getFirstSecondCate(xtreeHiddenId, xtreeDivId)
                },
                yes: function(index) {
                    fn(index)
                }
            })
        }
        if (
            window.location.hash == '#/route/work/develop/newdevelop' ||
            window.location.hash == '#/route/commodity/process/selfphotograph' ||
            window.location.hash == '#/route/statistics/export/coverageStatistics'
        ) {
            layerHandle(cateXtreePopSingle, function(index) {
                var _allck = xtree.GetChecked()
                var arrId = [],
                    arrText = []
                if (_allck.length > 1) {
                    layer.alert('此处类目仅允许单选')
                    return
                } else {
                    var v = _allck[0],
                        val = $(v).val(),
                        title = $(v).attr('title')
                    xtreeHiddenId.val(val)
                    xtreeDivId.text(title)
                    layui.layer.close(index)
                }
            })
        } else {
            layerHandle(cateXtreePop, function(index) {
                var _allck = xtree.GetChecked()
                var arrId = [],
                    arrText = []
                $.each(_allck, function(i, v) {
                    var val = $(v).val(),
                        title = $(v).attr('title')
                    arrId.push(val)
                    arrText.push(title)
                })
                xtreeHiddenId.val(arrId.join(','))
                xtreeDivId.text(arrText.join(','))
                layui.layer.close(index)
            })
        }
    })
    return xtree
}

/**
 * 将xtree展示到标签里，不使用弹框,alertCateSelect方法的改造
 * @param {显示被渲染的xtree结构的div元素} xtreeContentDiv
 * @param {点击以后value值渲染到的div的id} xtreeDivId
 * @param {点击完成以后input[hidden]的id,用来接收id} xtreeHiddenId
 * @param {所有参数都是jquery元素}
 */
function alertCateSelectDIV(xtreeContentDiv, xtreeHiddenId, xtreeDivId) {
    var xtree
    let cateXtreePops =
        '<form class="layui-form">' +
        '<div style="margin: 10px">' +
        '<span style="width: 60%;float: left;margin-right: 20px">' +
        '<input class="layui-input" id="cateSearchInp_xtree" placeholder="类目搜索">' +
        '</span>' +
        '<span class="layui-btn layui-btn-sm" id="searchCateBtn_xtree">搜索</span>' +
        '</div>' +
        '<div id="xtree1" style="width:100%;padding: 10px 0 25px 5px;box-sizing:border-box;"></div>' +
        '</form>'

    xtreeContentDiv.html(cateXtreePops)
    xtree = getFirstSecondCate(xtreeHiddenId, xtreeDivId)
    return xtree
}

/**
 * 保存xtree选中的数据
 * @param {数组，选中的xtree的id值} xtree
 * @param {点击以后value值渲染到的div的id，jquery元素} xtreeDivId
 * @param {点击完成以后input[hidden]的id,用来接收id，jquery元素} xtreeHiddenId
 */
function saveXtreeData(xtree, xtreeHiddenId, xtreeDivId) {
    var _allck = xtree.GetChecked()
    var arrId = [],
        arrText = []

    var v = _allck
    $.each(_allck, function(i, v) {
        var val = $(v).val(),
            title = $(v).attr('title')
        arrId.push(val)
        arrText.push(title)
    })
    xtreeHiddenId.val(arrId.join(','))
    xtreeDivId.text(arrText.join(','))
}

/**
 * 审核失败原因鼠标悬停展示
 * @param t
 * @param value
 */
function overShow(t, value) {
    if (value === 'undefined') {
        value = ''
    }
    var showDiv = $(t).parent().next()[0]
    showDiv.style.left = event.clientX
    showDiv.style.top = event.clientY
    showDiv.style.display = 'block'
    showDiv.innerHTML = value
}

function outHide(t) {
    var showDiv = $(t).parent().next()[0]
    showDiv.style.display = 'none'
    showDiv.innerHTML = ''
}

// 保证精确度计算 加
var accAdd = function(num1, num2) {
    num1 = Number(num1)
    num2 = Number(num2)
    var dec1, dec2, times
    try {
        dec1 = countDecimals(num1) + 1
    } catch (e) {
        dec1 = 0
    }
    try {
        dec2 = countDecimals(num2) + 1
    } catch (e) {
        dec2 = 0
    }
    times = Math.pow(10, Math.max(dec1, dec2))
    // var result = (num1 * times + num2 * times) / times;
    var result = (accMul(num1, times) + accMul(num2, times)) / times
    return getCorrectResult('add', num1, num2, result)
    // return result;
}
// 保证精确度计算 减
var accSub = function(num1, num2) {
    num1 = Number(num1)
    num2 = Number(num2)
    var dec1, dec2, times
    try {
        dec1 = countDecimals(num1) + 1
    } catch (e) {
        dec1 = 0
    }
    try {
        dec2 = countDecimals(num2) + 1
    } catch (e) {
        dec2 = 0
    }
    times = Math.pow(10, Math.max(dec1, dec2))
    // var result = Number(((num1 * times - num2 * times) / times);
    var result = Number((accMul(num1, times) - accMul(num2, times)) / times)
    return getCorrectResult('sub', num1, num2, result)
    // return result;
}
// 保证精确度计算 除
var accDiv = function(num1, num2) {
    num1 = Number(num1)
    num2 = Number(num2)
    var t1 = 0,
        t2 = 0,
        dec1,
        dec2
    try {
        t1 = countDecimals(num1)
    } catch (e) {}
    try {
        t2 = countDecimals(num2)
    } catch (e) {}
    dec1 = convertToInt(num1)
    dec2 = convertToInt(num2)
    var result = accMul(dec1 / dec2, Math.pow(10, t2 - t1))
    return getCorrectResult('div', num1, num2, result)
    // return result;
}
// 保证精确度计算 乘
var accMul = function(num1, num2) {
    num1 = Number(num1)
    num2 = Number(num2)
    var times = 0,
        s1 = num1.toString(),
        s2 = num2.toString()
    try {
        times += countDecimals(s1)
    } catch (e) {}
    try {
        times += countDecimals(s2)
    } catch (e) {}
    var result = convertToInt(s1) * convertToInt(s2) / Math.pow(10, times)
    return getCorrectResult('mul', num1, num2, result)
    // return result;
}

var countDecimals = function(num) {
    var len = 0
    try {
        num = Number(num)
        var str = num.toString().toUpperCase()
        if (str.split('E').length === 2) {
            // scientific notation
            var isDecimal = false
            if (str.split('.').length === 2) {
                str = str.split('.')[1]
                if (parseInt(str.split('E')[0]) !== 0) {
                    isDecimal = true
                }
            }
            var x = str.split('E')
            if (isDecimal) {
                len = x[0].length
            }
            len -= parseInt(x[1])
        } else if (str.split('.').length === 2) {
            // decimal
            if (parseInt(str.split('.')[1]) !== 0) {
                len = str.split('.')[1].length
            }
        }
    } catch (e) {
        throw e
    } finally {
        if (isNaN(len) || len < 0) {
            len = 0
        }
        return len
    }
}

var convertToInt = function(num) {
    num = Number(num)
    var newNum = num
    var times = countDecimals(num)
    var temp_num = num.toString().toUpperCase()
    if (temp_num.split('E').length === 2) {
        newNum = Math.round(num * Math.pow(10, times))
    } else {
        newNum = Number(temp_num.replace('.', ''))
    }
    return newNum
}

var getCorrectResult = function(type, num1, num2, result) {
    var temp_result = 0
    switch (type) {
        case 'add':
            temp_result = num1 + num2
            break
        case 'sub':
            temp_result = num1 - num2
            break
        case 'div':
            temp_result = num1 / num2
            break
        case 'mul':
            temp_result = num1 * num2
            break
    }
    if (Math.abs(result - temp_result) > 1) {
        return temp_result
    }
    return result
}

/**
 * 平台和币种函数
 * arr1:定义空数组,存放数据;arr2:循环的平台数据或者币种数据;obj:存在就输入,不存在默认为空
 */
function plat_curr_sel(arr1, arr2, obj) {
    if (!obj) {
        obj = ''
    }
    $.each(arr2, function(i, v) {
        var v_sel = '<option value="' + v + '" >' + v + '</option>'
        if (v == obj) {
            v_sel = '<option value="' + v + '" selected>' + v + '</option>'
        }
        arr1.push(v_sel)
    })
    return arr1
}

/**
 * wishTags复制功能
 */
function copyWishTags(obj) {
    var txt = $(obj).prev('a').text()
    var oInput = document.createElement('input') //创建一个input元素
    oInput.value = txt
    $(obj).parents('span').append(oInput)
    oInput.select() // 选择对象
    document.execCommand('Copy') // 执行浏览器复制命令
    oInput.style.display = 'none'
    layer.msg('复制成功')
}
/**
 * 图片的懒加载
 */
function imageLazyload(container = '.layadmin-tabsbody-item.layui-show') {
    let containerQ = $(container)
    let imgs = containerQ.find('img.lazy').not('[src]')
    if (!imgs || imgs.length === 0) {
        imgs = $('img.lazy').not('[src]')
    }
    imgs.lazyload({
        container: containerQ,
        placeholder: ctx + '/static/img/loading.gif', //用图片提前占位
        threshold: 1000, // 提前开始加载
        failure_limit: 10
    })
}

function imageLazyloadOrigin() {
    $('img.lazy').not('[src]').lazyload({
        container: $('.layui-table-body.layui-table-main'),
        placeholder: ctx + '/static/img/loading.gif', //用图片提前占位
        threshold: 1000, // 提前开始加载
        failure_limit: 10
    })
}

function imageLazyloadAll() {
    imageLazyload()
    imageLazyloadOrigin()
}

function imageLazyloadInner(ele) {
    $('img.lazy').lazyload({
        container: $('.' + ele),
        placeholder: ctx + '/static/img/loading.gif', //用图片提前占位
        threshold: 1000, // 提前开始加载
        failure_limit: 10
    })
}

// 富文本框选择模板图片上传
function showTplImgDialog(tplRequestParam, editor) {
    const params = {
        param: tplRequestParam,
        cb: function (tplUrlList, fullImgList) {
            // 遍历选择的模板图片 生成html内容’
            let str = ''
            tplUrlList?.forEach(item => {
                str += `<img src="${item}" style="max-width:100%" contenteditable="false">`
            })
            let appendStr = str.length ? `<p>${str}</p>` : ''
            // 执行插入图片的命令
            editor.cmd.do('insertHTML', appendStr);
        },
    }
    comPickImageTpl(params, (tplRequestParam && tplRequestParam.platCode) || 'ebay', false)
}

// 富文本框上传图片
function editorUploadImgs(editor) {
    // 创建 input 元素
    var uploadEditor = document.createElement('input');
    uploadEditor.type = 'file';
    uploadEditor.style.display = 'none';
    uploadEditor.id = 'uploadEditor';
    uploadEditor.multiple = true; // 允许选择多张图片
    // 将元素添加到页面中
    document.body.appendChild(uploadEditor);
    document.getElementById('uploadEditor').click()
    // 监听文件选择事件
    var uploadImageInput = document.getElementById('uploadEditor');
    uploadImageInput.addEventListener('change', function() {
        // let files = this.files[0];
        let formData = new FormData()
        Object.keys(this.files)?.forEach( item => {
            formData.append('files', this.files[item])
        })
        $.ajax({
            url: ctx + '/product/uploadPicForWangEditor.html',
            type: 'POST',
            data: formData,
            cache: false,
            processData: false,
            contentType: false,
            success: function(result) {
                if (result.code != '0000') {
                    layer.alert(result.msg)
                    return
                }
                if (result.extra && result.extra.length > 0) {
                    layer.alert('以下图片上传失败:' + result.extra.join())
                }
                var imglist = result.data
                for (var i = 0; i < imglist.length; ++i) {
                    editor.cmd.do('insertHTML', '<img src="' + tplIVP + imglist[i] + '" style="max-width:100%" contenteditable="false">');
                }
            },
            error: function(error) {
                console.log(error)
            },
            complete: function() {
                // 获取父元素
                var parentElement = document.body;
                // 获取要删除的元素
                var uploadEditor = document.getElementById('uploadEditor');
                // 删除元素
                parentElement.removeChild(uploadEditor);
            }
        })
    });
}

// 富文本框网络图片
function showEditorNetImgs(editor) {
    var index = layer.open({
        type: 1,
        title: '网络图片',
        area: ['800px', '400px'],
        content: '<div style="padding:20px;"><textarea class="layui-textarea" placeholder="请填写URL,多个地址用回车换行"></textarea></div>',
        btn: ['确定', '关闭'],
        yes: function(index,layero) {
            //网络主图处理
            let $val = layero.find('textarea').val();
            let allImgUrl = $val.split('\n');
            if (allImgUrl[0] == '') {
                return layer.msg('url不能为空', { icon: 2 });
            }
            let str = ''
            allImgUrl?.forEach(item => {
                str += `<img src="${item}" style="max-width:100%" contenteditable="false">`
            })
            let appendStr = str.length ? `<p>${str}</p>` : ''
            // 执行插入图片的命令
            editor.cmd.do('insertHTML', appendStr);
            layer.close(index);
        }
    });
}

/**
 * 富文本渲染
 * prodskuList 根据sku获取模板图片
 * @param {Object} customObject 自定义对象, 用来处理特殊情况的富文本配置-ztt20240506
 */
function wangEditorRender(id, text, tplRequestParam={}, customObject = {}) {
    var E = window.wangEditor
    // 获取必要的变量
    const { $, BtnMenu } = E
    class tplMenu extends BtnMenu {
        constructor(editor) {
            const $elem = E.$(
                `<div class="w-e-menu" style="width: 75px" data-title="模板图片">
                    <span>模板图片</span>
                </div>`
            )
            super($elem, editor)
        }
        // 模板图片菜单点击事件
        clickHandler() {
            showTplImgDialog(tplRequestParam, editor)
        }
        tryChangeActive() {
            // 激活菜单
            this.active()
        }
    }
    class uploadMenu extends BtnMenu {
        constructor(editor) {
            const $elem = E.$(
                `<div class="w-e-menu" style="width: 75px" data-title="上传图片">
                    <span>上传图片</span>
                </div>
                `
            )
            super($elem, editor)
        }
        // 上传图片菜单点击事件
        clickHandler() {
            editorUploadImgs(editor)
        }
        tryChangeActive() {
            // 激活菜单
            this.active()
        }
    }
    class netMenu extends BtnMenu {
        constructor(editor) {
            const $elem = E.$(
                `<div class="w-e-menu" style="width: 75px" data-title="网络图片">
                    <span>网络图片</span>
                </div>`
            )
            super($elem, editor)
        }
        // 网络图片菜单点击事件
        clickHandler() {
            showEditorNetImgs(editor)
        }
        tryChangeActive() {
            // 激活菜单
            this.active()
        }
    }
    // 菜单 key ，各个菜单不能重复
    const tplMenuKey = 'tplMenuKey' 
    const uploadMenuKey = 'uploadMenuKey' 
    const netMenuKey = 'netMenuKey' 
    // 注册菜单
    !customObject.showBtn && E.registerMenu(tplMenuKey, tplMenu);
    !customObject.showBtn && E.registerMenu(uploadMenuKey, uploadMenu)
    !customObject.showBtn && E.registerMenu(netMenuKey, netMenu)

    var editor = new E('#' + id)
    editor.config.menus = customObject.menus ? customObject.menus : [
      'head', // 标题
      'bold', // 粗体
      'fontSize', // 字号
      'fontName', // 字体
      'italic', // 斜体
      'underline', // 下划线
      'strikeThrough', // 删除线
      'foreColor', // 文字颜色
      'backColor', // 背景颜色
      'link', // 插入链接
      'list', // 列表
      'justify', // 对齐方式
      'quote', // 引用
      'emoticon', // 表情
      // 'image', // 插入图片
      'table', // 表格
      'video', // 插入视频
      'code', // 插入代码
      'undo', // 撤销
      'redo' // 重复
    ]

    // 设置上传本地视频事件
    editor.config.uploadVideo = {
        uploadVideo: function(insertVedio, videos, editor) {
            // insertVedio 向富文本编辑器中插入视频的方法
            // vedios  待上传的视频文件
            // editor 编辑器对象

            var formData = new FormData()
            if (videos.length > 0) {
                formData.append('files', videos[0])
            } else {
                return
            }
            var fileName = videos[0].name
            var seat = fileName.lastIndexOf('.')
            var extension = fileName.substring(seat).toLowerCase()
            if (extension != '.mp4' && extension != '.webm' && extension != '.ogg') {
                layer.msg('请传入后缀为mp4|webm|ogg 的视频文件')
                return
            }
            loading.show()
            $.ajax({
                url: ctx + '/product/uploadVedioForWangEditor.html',
                type: 'POST',
                // async : false,
                data: formData,
                // 告诉jQuery不要去处理发送的数据
                cache: false,
                processData: false,
                // 告诉jQuery不要去设置Content-Type请求头
                contentType: false,
                success: function(res) {
                    loading.hide()
                    if (res.code === '0000') {
                        if (res.extra && res.extra.length > 0) {
                            layer.alert('以下视频上传失败:' + res.extra.join())
                        }
                        for (var i = 0; i < res.data.length; ++i) {
                            var vedio = '<iframe src="' + res.data[i] + '"></iframe>'
                            insertVedio(vedio)
                        }
                    } else {
                        layer.alert(res.msg)
                    }
                },
                error: function() {
                    loading.hide()
                }
            })
        }
    }

    if(customObject.showBtn){
      // 网络图片配置alt选项
      editor.config.showLinkImgAlt = false
      // 网络图片配置超链接
      editor.config.showLinkImgHref = false
      editor.config.uploadFileName = customObject.fileName; 
      editor.config.uploadImgServer = customObject.imgUrl // 配置 server 接口地址
      editor.config.uploadImgParams = {
        width: 0,
        height: 0
      }
      editor.config.uploadImgHooks = {
        customInsert: function(insertImgFn, result) {
          // result 即服务端返回的接口
          // insertImgFn 可把图片插入到编辑器，传入图片 src ，执行函数即可
          if(result.code == '0000'){
            insertImgFn(result[customObject.srcCode]);
          }else{
            layer.alert(result.msg, {icon:2});
          }
        }
      }
    }

    editor.create()
    
    if (text) {
        editor.txt.html(text)
    }
    return editor
}

/**
 * 固定表头
 * h:元素到分页tab所在行的距离
 * elem: 需要固定的元素
 */
function fixTableHead(h, elem) {
    //1.获取产生滚动条的元素
    var bar = $('.layadmin-tabsbody-item.layui-show')
    //2.获取目标元素
    var ele = $('#' + elem)
    //3.获取屏幕尺寸
    var width = window.screen.width
    //3.滚动事件
    bar.scroll(function() {
        var top = $(this).scrollTop() //获取到向上滚动的距离
        if (top >= h) {
            ele.css({ position: 'fixed', top: 45, 'z-index': 1000, width: width, background: '#fff' })
        } else {
            ele.css({ position: '', top: '0', width: width, background: '' })
        }
    })
}
/**
 * 固定到指定高度位置
 * h:元素到分页tab所在行的距离
 * elem: 需要固定的元素
 * top:指定高度
 * 
 */
function fixtoTop(h, elem, settop) {
    //1.获取产生滚动条的元素
    var bar = $('.layadmin-tabsbody-item.layui-show')
    //2.获取目标元素
    var ele = $('#' + elem)
    //3.获取屏幕尺寸
    var width = window.screen.width
    //3.滚动事件
    bar.scroll(function() {
        var top = $(this).scrollTop() //获取到向上滚动的距离
        if (top > 0) {
            ele.css({ position: 'fixed', top: settop, 'z-index': 1000, width: width, background: '#fff' })
        } else {
            ele.css({ position: 'static', top: '0', width: width, background: '' })
        }
    })
}
/**
 * 显示商品详情
 */
function changeColspantable(obj) {
    $(obj).prev().find('.myj-hide').toggle()
    var str = $(obj).find('span').html()
    if (str.indexOf('展开') > -1) {
        $(obj).find('span').html('- 收起')
    } else {
        $(obj).find('span').html('+ 展开')
    }
}

/**
 * 备注
 *  三级类名称  users_hp_custom FBAhistory_userList  FBAhistory_storeAcct
 *  lay-filter 要有值
 *
 * @param formSelector
 * @param func
 */
// 部门-人员选择框初始化
function render_hp_orgs_users(formSelector, func) {
    var formDom = $(formSelector)
    if (formDom.length == 0) {
        layer.msg('初始化部门-人员-店铺表单失败，未找到表单')
        console.error('初始化部门-人员-店铺表单失败，未找到:' + formSelector)
    }
    var userSelect = formDom.find('.users_hp_custom') // 销售单选
    var salerSelect = formDom.find('.users_hp_custom_multi')
    var orgSelect = formDom.find('.orgs_hp_custom')
    var storeSelect1 = formDom.find('.store_hp_custom') // 店铺单选
    var storeSelect2 = formDom.find('.users_hp_store_multi') // 店铺多选
    var salesSiteSelect = formDom.find('.salesSite_hp_custom') //站点下拉框,用于过滤前面已经渲染的店铺数据
    var roleNames = userSelect.data('rolelist') || orgSelect.data('rolelist')
    var type = userSelect.data('type')
    var storeSelect = storeSelect1.length ? storeSelect1 : storeSelect2
    var userIsXm = userSelect.attr('xm-select') != null //用户下拉框是否多选
    var orgIsXm = orgSelect.attr('xm-select') != null //部门下拉框是否多选
    // 获取默认展示信息
    var defaultOrgInfo = orgSelect.attr('data-title') || ''
    var defaultUserInfo = userSelect.attr('data-title') || ''
    var defaultStoreInfo = storeSelect.attr('data-title') || ''
    // 发送请求获取相应人员信息及其对应组织
    $.ajax({
        type: 'post',
        url: ctx + '/sys/getPersonAndOrgsByRole.html',
        dataType: 'json',
        data: { roleNames: roleNames },
        success: function(returnData) {
            userSelect.empty()
            salerSelect.empty()
            orgSelect.empty()
            storeSelect.empty()
            if (returnData.code == '0000') {
                var orgList
                var orgOption
                var data
                var orgJSON
                data = returnData.data
                // 初始化部门
                orgSelect.append(getAOption('', defaultOrgInfo))
                for (var i in data.orgTree) {
                    setOrgs(data.orgTree[i], orgSelect, 0)
                }

                // 初始化展示所有人员
                if(formSelector == '#FBAhistory_SkuSalerForm'){
                    data.userList = [{id:-1,user_name:'空'}].concat(data.userList)
                }
                
                var userJSON = dealUser_org(data.userList)
                if (!userIsXm) {
                    userSelect.append(getAOption('', defaultUserInfo))
                    for (var i = 0; i < userJSON.all.length; ++i) {
                        userSelect.append(getAOption(userJSON.all[i].id, userJSON.all[i].userName))
                    }
                } else {
                    displayMultiSelect_user(userSelect, userJSON.all)
                }

                if (formSelector == '#FBAdeliveryForm' || formSelector == '#FBAdistributeForm') {
                    var userJSON = dealUser_org(data.userList)
                    displayMultiSelect_user(salerSelect, userJSON.all)
                }
                
                var _orgId = orgSelect.val()
                var _salePersonId = ''
                selectStore(storeSelect, roleNames, _orgId, _salePersonId, salesSiteSelect, type, func,defaultStoreInfo)             
                // 部门选择联动事件
                if (!$.isEmptyObject(orgSelect.attr('lay-filter'))) {
                    if (!orgIsXm) {
                        layui.form.on('select(' + orgSelect.attr('lay-filter') + ')', function(data) {
                            //选择部门下的用户
                            // storeSelect.siblings('div').find('.xm-select-label').empty();
                            userSelect.html('')
                            var orgId = data.value
                            if (orgId != '') {
                                // 获取所有子部门
                                var subOrgIds = getSubOrgs(orgSelect, orgId)
                                var userList = userJSON[orgId] || []
                                var subOrgArr
                                for (var i = 0; i < subOrgIds.length; ++i) {
                                    subOrgArr = userJSON[subOrgIds[i]]
                                    if (subOrgArr) {
                                        userList = userList.concat(subOrgArr)
                                    }
                                }
                            } else {
                                userList = userJSON.all
                            }
                            userSelect.append(getAOption('', defaultUserInfo))
                            salerSelect.append(getAOption('', defaultUserInfo))
                            if (userList) {
                                if (userIsXm) {
                                    displayMultiSelect_user(userSelect, userList)
                                } else {
                                    for (var i = 0; i < userList.length; ++i) {
                                        userSelect.append(getAOption(userList[i].id, userList[i].userName))
                                    }
                                }
                                if (formSelector == '#FBAdeliveryForm' || formSelector == '#FBAdistributeForm') {
                                    displayMultiSelect_user(salerSelect, userList)
                                }
                            }
                            //部门-店铺联动
                            if (storeSelect.length > 0) {
                                var orgId = orgSelect.val()
                                var salePersonId = userSelect.val()
                                selectStore(storeSelect, roleNames, orgId, salePersonId, salesSiteSelect, type)
                            }
                            // 部门-组长联动
                            selectLeader(orgSelect.val())
                            
                            // 执行自定义的部门选择事件
                            orgSelect.change()

                            layui.form.render('select')
                        })
                    } else {
                        layui.formSelects.on(
                            orgSelect.attr('xm-select'),
                            lms_debounce(function(id, vals, val, isAdd, isDisabled) {
                                // var orgId = orgSelect.val()
                                var orgId = vals.length ? vals.map((item) => item.value) : []
                                if (orgId != '') {
                                    // 获取所有子部门
                                    var subOrgIds = getSubOrgs(orgSelect, orgId)
                                    var userList = []
                                    // 部门和子部门拼接
                                    var dataList = orgId.concat(subOrgIds)
                                    dataList = Array.from(new Set(dataList)) 
                                    for (var i = 0; i < dataList.length; i++) {
                                        if (userJSON[dataList[i]]) {
                                            userList = userList.concat(userJSON[dataList[i]])
                                        }
                                    }
                                } else {
                                    userList = userJSON.all
                                }
                                //手动触发一个事件
                                orgSelect.trigger('change')

                                userSelect.append(getAOption('', defaultUserInfo))
                                if (userList) {
                                    if (userIsXm) {
                                        displayMultiSelect_user(userSelect, userList)
                                    } else {
                                        for (var i = 0; i < userList.length; ++i) {
                                            userSelect.append(getAOption(userList[i].id, userList[i].userName))
                                        }
                                    }
                                }
                                //部门-店铺联动
                                if (storeSelect.length > 0) {
                                    var orgId = vals.length ? vals.map((item) => item.value).join() : ''
                                    // var salePersonId = userSelect.val()
                                    var formSelects = layui.formSelects
                                    var salePersonId = formSelects.value(userSelect.attr('lay-filter')); 
                                    salePersonId = salePersonId.length ? salePersonId.map((item) => item.value).join() : ''
                                    selectStore(storeSelect, roleNames, orgId, salePersonId, salesSiteSelect, type)
                                }
                                // 执行自定义的部门选择事件
                                orgSelect.change()

                                layui.form.render('select')


                            }, true),
                            500
                        )
                    }
                    
                }
                layui.form.render('select')
            } else {
                layer.msg(returnData.msg)
            }
        },
        error: function() {
            layer.msg('发送请求失败')
        }
    })

    function selectLeader(orgId) {
        initUseCommonrFn(orgId, 'ebay组长', 'ebayLeader');
    }

    function initUseCommonrFn(orgId, role, name, container='ebayAcctSearchForm') {
        $.ajax({
            type: "post",
            url: ctx + "/sys/listuserbyrole.html",
            data: {role},
            dataType: "json",
            async: false,
            success: function (returnData) {
                if (returnData.code != "0000") {
                    layer.alert(returnData.msg);
                } else {
                    var accts = returnData.data;
                    if (orgId) {
                        accts = accts?.filter(item => {
                            return item.orgId == orgId
                        })
                    }
                    $("#" + container + " select[name=" + name + "]").html('<option value="">组长</option>')
                    if (accts.length > 0) {
                        for (var i = 0; i < accts.length; i++) {
                            $("#" + container + " select[name=" + name + "]").append('<option value="' + accts[i].id + '">' + accts[i].userName + '</option>');
                        }
                        layui.form.render('select');
                    }
                }
            }
        });
    }

    
    //店铺触发事件
    if (storeSelect.length > 0) {
        // var orgId = orgSelect.val()
        // var salePersonId = userSelect.val()
        // selectStore(storeSelect, roleNames, orgId, salePersonId, salesSiteSelect, type,func)
        //销售员-店铺联动
        if (!$.isEmptyObject(userSelect.attr('lay-filter'))) {
            if (!userIsXm) {
                layui.form.on('select(' + userSelect.attr('lay-filter') + ')', function(data) {             
                    var orgId = orgSelect.val()
                    var salePersonId = userSelect.val()
                    selectStore(storeSelect, roleNames, orgId, salePersonId, salesSiteSelect, type)
                    //手动触发一个事件
                    userSelect.trigger('change')
                })
            } else {
                layui.formSelects.on(
                    userSelect.attr('xm-select'),
                    lms_debounce(function(id, vals, val, isAdd, isDisabled) {
                        // var orgId = orgSelect.val()
                        var formSelects = layui.formSelects
                        var orgId = formSelects.value(orgSelect.attr('lay-filter')); 
                        orgId = orgId.length ? orgId.map((item) => item.value).join() : ''
                        var salePersonId = vals.length ? vals.map((item) => item.value).join() : ''
                        selectStore(storeSelect, roleNames, orgId, salePersonId, salesSiteSelect, type)
                        //手动触发一个事件
                        userSelect.trigger('change')
                    }, true),
                    500
                )
            }
        }
        if (salesSiteSelect.length > 0) {
            //如果有站点,站点店铺联动
            if (!$.isEmptyObject(salesSiteSelect.attr('lay-filter'))) {
                layui.form.on('select(' + salesSiteSelect.attr('lay-filter') + ')', function(data) {
                    var orgId = orgSelect.val()
                    var salePersonId = userSelect.val()
                    var salesSite = salesSiteSelect.val()
                    selectStore(storeSelect, roleNames, orgId, salePersonId, salesSiteSelect, type)
                })
            }
        }
    }
}

function getSubOrgs(orgSelect, pOrgId) {
    var subOrgIdArr = []
    var allOrgOption = orgSelect.find('option')
    var pOrgIdArr
    var pOrgIds
    loop1: for (var i = 0; i < allOrgOption.length; ++i) {
        pOrgIds = allOrgOption[i].getAttribute('data-remark')
        if (pOrgIds) {
            pOrgIdArr = pOrgIds.split(',')
            for (var j = 0; j < pOrgIdArr.length; ++j) {
                if (pOrgIdArr[j] == pOrgId || [].concat(pOrgId).includes(pOrgIdArr[j])) {
                    subOrgIdArr.push(allOrgOption[i].value)
                }
            }
        }
    }
    return subOrgIdArr
}

/**
 * 根据部门，角色，销售员和站点过滤店铺
 * @param storeSelect
 * @param roleNames
 * @param orgId
 * @param salePersonId
 * @param salesSite
 */
var storeOptionData = []
function selectStore(storeSelect, roleNames, orgId, salePersonId, salesSiteSelect, type, func,defaultStoreInfo) {
    if (!storeSelect || !storeSelect.length) {
        return
    }
    var salesSite = null
    if (salesSiteSelect != null && salesSiteSelect.length > 0) {
        //如果有站点过滤
        salesSite = salesSiteSelect.val()
    }
    var platCode = storeSelect.data('platcode')

    let params = {
        roleNames: roleNames,
        orgId: orgId,
        salePersonId: salePersonId,
        platCode: platCode,
        type: type
    }
    var url = ctx + '/sys/listStoreForRenderHpStoreCommonComponent.html'
    if (storeSelect.attr('unlimited-select')) {
        url = ctx + '/sys/listPlatAllStore.html'
    }

    // if(storeSelect["selector"] == '#FBAhistory_StoreSaler .store_hp_custom'){
    //     url = ctx + '/sys/amazonListStoreForRenderHpStoreCommonComponent.html'
    //     var storeStatus = storeSelect.attr('data-storestatus') || ''
    //     params.status = storeStatus
    // }

    if(storeSelect["selector"] == '#FBAdistributeForm .store_hp_custom'){
        url = ctx + '/FbaDistributePlan/getDistributeStoreAcctList'
    }
    let loadIndex;
    $.ajax({
        type: 'post',
        url: url,
        dataType: 'json',
        beforeSend: function() {
            loadIndex = layer.load(1, {shade: [0.3, '#ccc']})
        },
        data: params,
        success: function(returnData) {
            // loading.hide()
            layer.close(loadIndex)
            if (storeSelect.attr('xm-select')) {
                var platAccts = []
                storeOptionData = returnData.data || []
                for (var i = 0; i < returnData.data.length; i++) {
                    var a = { name: returnData.data[i].storeAcct, value: returnData.data[i].id }
                    platAccts.push(a)
                }
                displayMultiSelect(storeSelect, platAccts)
                if (func) {
                    func(returnData)
                }
            } else {
                storeSelect.empty()
                storeSelect.append(getAOption('', (defaultStoreInfo || '')))
                if (returnData.code == '0000') {
                    for (var i = 0; i < returnData.data.length; ++i) {
                        var curObj = returnData.data[i]
                        var curSite = curObj.salesSite == null ? '' : curObj.salesSite
                        if (salesSite == null || salesSite == '') {
                            storeSelect.append(
                                getAOption(
                                    returnData.data[i].id,
                                    returnData.data[i].storeAcct,
                                    returnData.data[i].salesSite
                                )
                            )
                        } else {
                            if (salesSite == curSite) {
                                //如果有站点过滤
                                storeSelect.append(
                                    getAOption(
                                        returnData.data[i].id,
                                        returnData.data[i].storeAcct,
                                        returnData.data[i].salesSite
                                    )
                                )
                            }
                        }
                        // layui.form.render('select');
                    }
                } else {
                    layer.msg(returnData.msg)
                }
                storeSelect.parents('form').find('.site_hp_custom').empty()
                layui.form.render('select')
            }
        }
    })
}

function setOrgs(orgTree, orgSelect, floor, pOrgIds) {
    var frex = ''
    pOrgIds = pOrgIds || '0'
    for (var k = 0; k < floor; ++k) {
        frex += '|-- '
    }

    orgSelect.append(getAOption(orgTree.id, frex + orgTree.name, null, pOrgIds))
    var childTree = orgTree.childOrgList
    if (childTree) {
        floor++
        var pOrgIdArr = pOrgIds.split(',')
        pOrgIdArr.push(orgTree.id)
        pOrgIds = pOrgIdArr.join(',')
        for (var j = 0; j < childTree.length; ++j) {
            setOrgs(childTree[j], orgSelect, floor, pOrgIds)
        }
    }
}

// 返回组织结构
function dealOrgData(data) {
    var orgJSON = {}
    for (var i = 0; i < data.length; ++i) {
        if (data[i]['p_org_id'] != 0) {
            if (!orgJSON[data[i]['p_org_id']]) {
                orgJSON[data[i]['p_org_id']] = { name: data[i]['p_org_name'] }
            }
            orgJSON[data[i]['p_org_id']][data[i]['org_id']] = { name: data[i]['org_name'] }
        } else {
            if (!orgJSON[data[i]['org_id']]) {
                orgJSON[data[i]['org_id']] = { name: data[i]['org_name'] }
            }
        }
    }
    return orgJSON
}

// 返回对应组织的人员结构
function dealUser_org(data) {
    var userJSON = { all: [] }
    for (var i = 0; i < data.length; ++i) {
        if (!userJSON[data[i]['org_id']]) {
            userJSON[data[i]['org_id']] = []
        }
        userJSON[data[i]['org_id']].push({ id: data[i]['id'], userName: data[i]['user_name'] })
        userJSON.all.push({ id: data[i]['id'], userName: data[i]['user_name'] })
    }
    return userJSON
}

function getAOption(value, text, sites, remark) {
    return $(
        '<option value="' +
            value +
            '" data-sites="' +
            (sites || '') +
            '" data-remark="' +
            (remark || '') +
            '">' +
            text +
            '</option>'
    )
}

function format(datetime, fmt) {
    if (datetime) {
        datetime = datetime.toString()
        if (parseInt(datetime) == datetime) {
            if (datetime.length == 10) {
                datetime = parseInt(datetime) * 1000
            } else if (datetime.length == 13) {
                datetime = parseInt(datetime)
            }
        }
        datetime = new Date(datetime)
        var o = {
            'M+': datetime.getMonth() + 1, //月份
            'd+': datetime.getDate(), //日
            'h+': datetime.getHours(), //小时
            'm+': datetime.getMinutes(), //分
            's+': datetime.getSeconds(), //秒
            'q+': Math.floor((datetime.getMonth() + 3) / 3), //季度
            S: datetime.getMilliseconds() //毫秒
        }
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (datetime.getFullYear() + '').substr(4 - RegExp.$1.length))
        for (var k in o)
            if (new RegExp('(' + k + ')').test(fmt))
                fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
        return fmt
    } else {
        return ''
    }
}

/**
 * 获取部门-人员组件，当前选中值
 * 如果选了人员，则只取选中的人员
 * 如果未选人员，但选中了部门。则取该部门所有人员
 * @param orgElem 部门选择元素
 * @param userElem 人员选择元素
 */
function getParentIdList(orgElem,userElem){
    let organize = orgElem.val()
    let userId = userElem.val()

    if (organize || userId) {
        if (userId) { // 如果选了人，则只查询这个人的。
            return userId.split(',')
        } else { // 如果选了部门没选人，则查询整个部门的
            let userIdList = []
            let elem = userElem
            if (elem.hasClass('xm-hide-input')) {
                elem = elem.closest('.xm-select-parent').prev('select[xm-select]')
                userIdList = elem.attr('user_ids').split(',')
            } else {
                let options = elem.find('option')
                let value
                for (let i = 0; i < options.length; ++i) {
                    value = options[i].getAttribute('value')
                    if (value) {
                        userIdList.push(parseInt(value))
                    }
                }
            }

            return userIdList
        }
    }
}

//渲染多选下拉框
function displayMultiSelect(selectDom, data) {
    var multiSelect = selectDom.attr('xm-select')
    if (data != null) {
        var items = []
        for (var i = 0; i < data.length; i++) {
            items.push(data[i].value)
        }
        selectDom.attr('acct_ids', items.join(','))
    } else {
        selectDom.attr('acct_ids', '')
    }
    // var whiteList = ['lazada_online_store_sel', 'lazadaOffshelvesstoreAcctIdList','activeregister_store_sel']
    var whiteList = ['lazada_online_store_sel','lazada_water_mark_store_sel', 'lazadaOffshelvesstoreAcctIdList','lazadaVideoManage_store_sel','lazadaLSL_storeAcct','lazada_accperformance_store'];
    if (whiteList.includes(multiSelect)) {
        //ztt-2.10新增
        //使用xm-select渲染
        xmSelect.render({
            el: `#${multiSelect}`,
            tips: '多个精确搜索，逗号分隔',
            filterable: true,
            filterMethod: function(val, item, index, prop){
                // 支持批量搜索，单个模糊，多个精确
                let valArr = val.split(",")
                if(valArr.length == 1){ // 单个模糊
                    if(item.name.indexOf(valArr[0]) != -1){
                        return true;
                    }
                }else if(valArr.length > 1){ // 多个精确
                    if(valArr.indexOf(item.name) != -1){
                        return true;
                    }
                }else{
                    return false;
                }
            },
            theme: {
                color: '#0081ff',
            },
            toolbar: {
                show: true,
            },
            data: data,
            paging: true,
            pageSize: 200
        });
    } else {
        layui.use([ 'admin', 'formSelects' ], function() {
            layui.formSelects.data(multiSelect, 'local', { arr: data })
            // layui.formSelects.render();
        })
    }
}

/**
 * 渲染用户多选下拉框
 * @param selectDom
 * @param data
 */
function displayMultiSelect_user(selectDom, data) {
    var multiSelect = selectDom.attr('xm-select')
    var buyerList = []
    selectDom.attr('user_ids', '')
    if (data != null && data.length > 0) {
        var items = []
        $(data).each(function() {
            var a = { name: this.userName, value: this.id }
            items.push(this.id)
            buyerList.push(a)
        })
        selectDom.attr('user_ids', items.join(','))
        layui.use([ 'admin', 'formSelects' ], function() {
            layui.formSelects.data(multiSelect, 'local', { arr: buyerList })
        })
    }
}

/**
 * btn: div#btn
 * opts:选项
 */
function lmsUploadImg(btn, opts) {
    var defaults = {
        fileTypeExts: '*.jpg;*.png;*.jpeg;*.JPG;*.JPEG;*.PNG;*.bmp;*.BMP;*.gif;',
        uploader: '', //文件提交的地址
        auto: true, //是否开启自动上传
        method: 'post', //发送请求的方式，get或post
        multi: true, //是否允许选择多个文件
        fileObjName: 'file', //在后端接受文件的参数名称，如PHP中的$_FILES['file']
        fileSizeLimit: 2048, //允许上传的文件大小，单位KB
        showUploadedPercent: true, //是否实时显示上传的百分比，如20%
        showUploadedSize: false, //是否实时显示已上传的文件大小，如1M/2M
        buttonText: '上传', //上传按钮上的文字
        removeTimeout: 500, //上传完成后进度条的消失时间，单位毫秒
        onUploadStart: null, //上传开始时的动作
        onUploadSuccess: null, //上传成功的动作
        onUploadComplete: null, //上传完成的动作
        onSelect: null, // 选择文件后执行的动作，可传入参数files，文件列表
        onUploadError: null, //上传失败的动作
        onInit: null, //初始化时的动作
        onCancel: null //删除掉某个文件后的回调函数，可传入参数file
    }
    $.extend(defaults, opts) //扩展
    $(btn).Huploadify(defaults)
}
//固定表头的操作
function theadHandle() {
    var inlinecss =
        '.fixeddiv1{z-Index:9999 !important;position:fixed!important;top:8px !important;left:40px !important;right: 2%!important;background:#fff!important;} .fixeddiv2{position:fixed!important;top:40px;left:41px;right: 2%;z-Index:9998;} .fixeddiv3{position:fixed!important;top:5px;right:5px;z-Index:99999!important;} .fixeddiv4{position:fixed;top:40px;z-Index:9996;background:#fff;width:93%;} .unfixeddiv1{position:static;top:0;left:0;right:0;zIndex:99;} .unfixeddiv2{position:static;top:0;left:0;right:0;zIndex:99} .unfixeddiv3{position:absolute,;right:10;top:10;zIndex:99;} .unfixeddiv4{position:static}'
    //将css代码添加到<style>中
    var style = document.createElement('style')
    style.type = 'text/css'
    style.innerHTML = inlinecss
    document.getElementsByTagName('HEAD').item(0).appendChild(style)
    var theadHandle = {
        el: $('.layadmin-tabsbody-item.layui-show'),
        top: function() {
            return this.el.scrollTop()
        },
        fixTh: function(obj) {
            /** 
             * 参数: 需要固定的元素dv1 dv2 按上下顺序;需要固定的距离h
             */
            var def = {
                id: 'body',
                dv1: '.layui-card-header',
                dv2: '.layui-table-header',
                dv3: '',
                dv4: '',
                i: 42, //instance
                h: 0
            }
            $.extend(def, obj)
            var _this = this,
                el = this.el,
                dv1 = $(def.id).find(def.dv1), //获取第一个要固定的元素
                dv2 = $(def.id).find(def.dv2), //获取第二个要固定的元素
                dv3 = $(def.id).find(def.dv3), //获取第三个要固定的元素
                dv4 = $(def.id).find(def.dv4), //获取第四个要固定的元素
                h = def.h //获取固定的起始高度
            el.scroll(function() {
                var top = _this.top()
                if (top > h) {
                    dv1.addClass('fixeddiv1')
                    dv2.addClass('fixeddiv2')
                    if (dv3[0]) {
                        dv3.addClass('fixeddiv3')
                    }
                    if (dv4[0]) {
                        dv4.addClass('fixeddiv4')
                    }
                } else {
                    dv1.removeClass('fixeddiv1')
                    dv2.removeClass('fixeddiv2')
                    if (dv3[0]) {
                        dv3.removeClass('fixeddiv3')
                    }
                    if (dv4[0]) {
                        dv4.removeClass('fixeddiv4')
                    }
                }
            })
        }
    }
    return theadHandle
}

// 阻止冒泡
function stopBuble(event) {
    event.stopPropagation()
}
/**
 * 数量统计的处理
 * 
 */
function countSta(id, clas) {
    var inputs = $('#' + id).find('.' + clas)
    for (var i = 0; i < inputs.length; i++) {
        //定义初始值
        $(inputs[i]).parent().next().find('span:first-child').html($(inputs[i]).val().length)
    }
    $('#' + id).on('input', '.' + clas, function() {
        var span1 = $(this).parent().next().find('span:first-child'),
            len = $(this).val().length
        span1.html(len)
    })
}
/**
 * body绑定监听事件
 */
var layuiOpenPop
$('body').bind('keypress', '.layadmin-tabsbody-item', function(e) {
    if (e.keyCode === 13) {
        // e.stopPropagation()
        let target = e.target
        if ($(e.target).parents('form')?.length && !$(e.target).parents('.layui-layer-page').length) {
            $(this).find('.layadmin-tabsbody-item.layui-show').find('.keyHandle').trigger('click')
        }
        // return false 
    }
    // var hasFocus = $('textarea').is(':focus')
    // var hasFocus1 = $('.bootstrap-tagsinput').hasClass('focus')
    // // var hasFocus2 = $('.bullet_point_class_input');
    // if (e.keyCode == 13 && !$(e.target).hasClass('w-e-text')) {
    //     if (hasFocus || hasFocus1 || layuiOpenPop) {
    //         return
    //     }
    //     $(this).find('.layadmin-tabsbody-item.layui-show').find('.keyHandle').trigger('click')
    // }
})
/**
 * 为表格中包含subSelector元素的行 设置css样式
 * @param subSelector
 * @param color
 */
function setRowBackColor(subSelector, css) {
    var tds = $(subSelector)
    if (tds != null) {
        for (var i = 0; i < tds.length; ++i) {
            let tr = $(tds[i]).closest('tr')
            let title = $(tds[i]).attr('title')
            if (title){
                tr.attr('title',title)
            }
            tr.css(css)
        }
    }
}

/**
 * 为表格中包含subSelector元素的行 绑定事件event，
 * @param tableSelector  表格选择器
 * @param subSelector
 * @param event 事件
 * @param func 事件执行的方法
 * @param stopClass 豁免执行该事件的区域 一个选择器的数组 ['']
 */
var bindRowEvenClass = []
function setRowEvent(tableSelector, subSelector, event, func, stopClass) {
    var tbody = $(tableSelector).next('.layui-table-view').find('.layui-table-body')
    var tds = $(subSelector)
    var addClass = subSelector ? subSelector.replace('.', '') + '20190531' : '';
    if (tds != null) {
        for (var i = 0; i < tds.length; ++i) {
            var tr = $(tds[i]).closest('tr')
            tr.addClass(addClass)
        }
    }
    tbody.on(event, '.' + addClass, null, function(e) {
        var target = $(e.target)
        if (target.attr('lay-event')) {
            return
        }
        if (stopClass && stopClass.length > 0) {
            for (var i = 0; i < stopClass.length; ++i) {
                if (
                    target.hasClass(stopClass[i].replace('.', '')) ||
                    target.attr('id') == stopClass[i].replace('#', '') ||
                    target.closest(stopClass[i])[0]
                ) {
                    return
                }
            }
        }
        func(this)
    })
    bindRowEvenClass.push(addClass)
}

/**
 * 给表格中 符合选择器的 元素绑定事件
 * @param tableSelector  表格选择器
 * @param targetSelector  目标选择器
 * @param event 事件类型
 * @param func 事件执行方法
 */
function setEventByselector(tableSelector, targetSelector, event, func) {
    var tbody = $(tableSelector).next('.layui-table-view').find('.layui-table-body')
    tbody.on(event, targetSelector, null, func)
}

//字符串全局替换，忽略大小写
function searchSubStr(str, subStr) {
    var positions = new Array()
    var pos = str.indexOf(subStr)
    while (pos > -1) {
        positions.push(pos)
        pos = str.indexOf(subStr, pos + 1)
    }
    return positions
}

function replace_string(s1, s2, s3) {
    if (s2) {
        var finalString = [],
            index = 0
        var positions = searchSubStr(s1.toLowerCase(), s2.toLowerCase())
        if (positions.length > 0) {
            for (var i = 0; i < positions.length; i++) {
                finalString.push(s1.slice(index, positions[i]) + s3)
                index = positions[i] + s2.length
            }
            finalString.push(s1.slice(index, s1.length))
            return finalString.join('')
        } else {
            return s1
        }
    } else {
        return s1
    }
}
/**
 * checkbox选中方法
 * @param checkboxElems
 * @param valueArr
 */
function checkCheckbox(checkboxElems, valueArr) {
    checkboxElems.each(function() {
        if (valueArr.indexOf($(this).val()) >= 0) {
            $(this).prop('checked', true)
        }
    })
}

/**
 * 一键应用表格已勾选行
 * @param tableIns//table实例
 * @param tableId//layui-table的id
 * @param callback//对选取行的操作回调函数
 */

function applytoChecked(tableId, tableIns, func) {
    var trObj = layui.table.checkStatus(tableId)
    if (trObj.data.length > 0 && tableIns) {
        var layFilterIndex = 'LAY-table-' + tableIns.config.index
        var tableContainer = $('div[lay-filter="' + layFilterIndex + '"]')
        tableContainer.find('input[name="layTableCheckbox"]:checked').each(function(index, item) {
            var tr = $(this).parents('tr')
            if (tr.find('td').length > 0 && func) {
                if (trObj.isAll) {
                    if (index != 0) {
                        func(tr, trObj.data[index - 1], index - 1)
                    }
                } else {
                    func(tr, trObj.data[index], index)
                }
            }
        })
    } else {
        layer.msg('请选择需要修改的数据！')
    }
}

function applytoReloadChecked(tableId, tableIns, func) {
    var trObj = layui.table.checkStatus(tableId)
    if (trObj.data.length > 0 && tableIns) {
        var tableContainer = $('#' + tableId).next();
        tableContainer.find('input[name="layTableCheckbox"]:checked').each(function(index, item) {
            var tr = $(this).parents('tr')
            if (tr.find('td').length > 0 && func) {
                if (trObj.isAll) {
                    if (index != 0) {
                        func(tr, trObj.data[index - 1], index - 1)
                    }
                } else {
                    func(tr, trObj.data[index], index)
                }
            }
        })
    } else {
        layer.msg('请选择需要修改的数据！')
    }
}

function pushNoRepeat(arr, option) {
    var repeat = false
    for (var i = 0; i < arr.length; i++) {
        var ele = arr[[ i ]]
        if (ele == option) {
            repeat = true
            break
        }
    }
    if (!repeat) {
        arr.push(option)
    }
}

/**
 * 计算时间差
 * @param date1 时间1
 * @param date2 时间2
 * @param unit 计算单位
 */
function getTimeDiff(date1, date2, unit) {
    var milDiff = date1.getTime() - date2.getTime()

    switch (unit) {
        case 'day':
            return Math.floor(milDiff / (24 * 3600 * 1000))
    }
}
/**
 * 转换百分比
 * @param point
 * @returns {*}
 */
function toPercent(point) {
    if (point == 0) {
        return 0
    }
    var str = Number(point * 100).toFixed(2)
    str += '%'
    return str
}

$('body').on('dblclick', '.dblclickToEnlarge', function(event) {
    event.stopPropagation()
    var self = $(this)
    var status = self.attr('data-enlargeStatus')
    if (!status) {
        // 去放大
        // 记录原先的位置和大小
        self.attr('data-originTop', this.offsetTop)
        self.attr('data-originLeft', this.offsetLeft)
        self.attr('data-originWidth', this.clientWidth)
        self.attr('data-originHeight', this.clientHeight)
        // 放大至全屏
        self.css({ left: 0, top: 0, width: '100%', height: '100%' })
        self.attr('data-enlargeStatus', '1')
    } else {
        // 去还原
        var top = self.attr('data-originTop')
        var left = self.attr('data-originLeft')
        var width = self.attr('data-originWidth')
        var height = self.attr('data-originHeight')
        self.css({ left: left + 'px', top: top + 'px', width: width + 'px', height: height + 'px' })
        self.attr('data-enlargeStatus', '')
    }
})

function clickAndStopPropagation(e) {
    e.stopPropagation()
}

//构建富文本
var autoSimditor = function(id, data) {
    //设置内容
    // if(data){
    //     $('#'+id).html(data);
    // }else{
    //     $('#'+id).html("");
    // }
    // layui.use(['layedit'],function () {
    //     var layedit = layui.layedit;
    //     //构建富文本
    //     var index_info = layedit.build(id, {
    //         tool: ['strong','italic','image'],
    //         height: 230 //设置编辑器高度
    //     });
    //     return index_info;
    // })
    var editor = new Simditor({
        textarea: $('#' + id),
        // cleanPaste: true, //复制过来的默认清除所有自带样式[task-view-540.html]
        toolbar: [ 'bold', 'italic' ] //只允许显示加粗和斜体
    })
    editor.setValue(data || '') //设置富文本的值
    return editor
}
// 同款详情
function lowestPriceCompareHandle(id) {
    layui.use([ 'table', 'layer' ], function() {
        var table = layui.table
        var layer = layui.layer
        var lowestPriceCompareName = {
            render: function(data) {
                table.render({
                    elem: '#stockWarning_lowestPriceLayer_table',
                    method: 'post',
                    url: '/lms/sameProductPriceParity/same/prod/list',
                    id: 'stockWarning_lowestPriceLayer_tableId',
                    where: { offerId: id },
                    cols: [
                        [
                            {
                                title: '图片',
                                templet: '<div class="b1"><img src="{{ d.sjsImg}}" width="60" height="60"></div>'
                            },
                            {
                                title: '标题',
                                templet:
                                    '<div><a href="{{ d.sjsUrl}}" target="_blank" style="color: #1e9fff;">{{d.sjsName}}</a></div>'
                            },
                            { title: '销量', field: 'sjsBookedCount', width: 60 },
                            { title: '区间价', field: 'sjsQuantityPrice' },
                            {
                                title: '店铺',
                                templet:
                                    '<div><a href="{{ d.sjsShopUrl}}" target="_blank" style="color: #1e9fff;">{{d.sjsCompanyName}}</a></div>'
                            }
                        ]
                    ],
                    page: true,
                    limits: [ 20, 100, 300 ],
                    limit: 20
                })
            }
        }
        var index = layer.open({
            type: 1,
            title: '同款详情',
            area: [ '80%', '100%' ],
            shadeClose: true,
            content:
                '<div style="padding:20px;"><table class="layui-table" id="stockWarning_lowestPriceLayer_table"></table></div>',
            success: function(layero, index) {
                lowestPriceCompareName.render()
            }
        })
    })
}

//验证规则
$(document).on('change', '[ztt-verify=isNumber]', function(e) {
    var reg = /(^[1-9]\d*$)|(^\d*\.{1}\d+$)|(^0{1}$)/
    var val = e.target.value //获取到当前输入框的值
    if (val != '') {
        if (reg.test(val)) {
            $(e.target).removeClass('layui-form-danger')
        } else {
            $(e.target).addClass('layui-form-danger').focus()
            layer.msg('输入的内容不是数字,请重新输入', { icon: 5 })
        }
    } else {
        $(e.target).removeClass('layui-form-danger')
    }
})

function arrMinNum(arr) {
    var minNum = Infinity,
        index = -1,
        minVul = ''
    for (var i = 0; i < arr.length; i++) {
        if (typeof arr[i] == 'string') {
            if (arr[i].charCodeAt() < minNum) {
                minNum = arr[i].charCodeAt()
                minVul = arr[i]
                index = i
            }
        } else {
            if (arr[i] < minNum) {
                minNum = arr[i]
                minVul = arr[i]
                index = i
            }
        }
    }
    return { minNum: minVul, index: index }
}
function arrSortMinToMax(arr) {
    var arrNew = []
    var arrOld = arr.concat()
    for (var i = 0; i < arr.length; i++) {
        arrNew.push(arrMinNum(arrOld).minNum)
        arrOld.splice(arrMinNum(arrOld).index, 1)
    }
    return arrNew
}
function arrMaxNum(arr) {
    var maxNum = -Infinity,
        index = -1,
        maxVul = ''
    for (var i = 0; i < arr.length; i++) {
        if (typeof arr[i] == 'string') {
            if (arr[i].charCodeAt() > maxNum) {
                maxNum = arr[i].charCodeAt()
                maxVul = arr[i]
                index = i
            }
        } else {
            if (arr[i] > maxNum) {
                maxNum = arr[i]
                maxVul = arr[i]
                index = i
            }
        }
    }
    return { maxNum: maxVul, index: index }
}
function arrSortMaxToMin(arr) {
    var arrNew = []
    var arrOld = arr.slice(0)
    for (var i = 0; i < arr.length; i++) {
        arrNew.push(arrMaxNum(arrOld).maxNum)
        arrOld.splice(arrMaxNum(arrOld).index, 1)
    }
    return arrNew
}

/**
 * 按指定大小，分割数组
 * @param arr 待分割的数组  例如 {1,2,3,4,5,6,7,8,9}
 * @param size 每组大小 2
 * @returns {Array} [[1,2],[3,4,],[5,6,],[7,8],[9]]
 */
function chunk(arr, size) {
    var arr2 = []
    for (var i = 0; i < arr.length; i = i + size) {
        arr2.push(arr.slice(i, i + size))
    }
    return arr2
}

function copyTxtToClipboard(txt, element='input') {
    var oInput = document.createElement(element) //创建一个元素
    oInput.value = txt
    document.body.appendChild(oInput)
    oInput.select() // 选择对象
    document.execCommand('Copy') // 执行浏览器复制命令
    oInput.style.display = 'none'
    layui.layer.msg('复制成功')
    document.body.removeChild(oInput)
    return false
}


// 悬浮展示tip
function showTip(tip, self) {
    var index = layui.layer.tips(tip, self, { tips: [ 1, 'orange' ], time: 10000 })
    $(self).attr('data-tipId', index)
}
// 移开目标元素时，清除tip
function removeTip(self, timeOut) {
    var index = $(self).attr('data-tipId')
    if (timeOut) {
        if (index) {
            let id = '#layui-layer' + index
            let ifIn = false
            $(id).mouseenter(function() {

                ifIn = true
            })
            $(id).mouseleave(function() {
                layui.layer.close(index)
            })
            window.setTimeout(function() {
                if (!ifIn) {
                    layui.layer.close(index)
                }
            }, timeOut)
        }
    } else {
        if (index) {
            layui.layer.close(index)
        }
    }
}

function trimData(data) {
    for (var key in data) {
        data[key] = data[key].trim()
    }
}

// 双击复制图片路径
$('body').on('dblclick', '.dbclickCopyUrl', function() {
    copyUrlOfImg(this)
})

/**
 * 复制图片的路径
 * @param imgEle  <img>元素的 原生对象
 */
function copyUrlOfImg(imgEle) {
    var url = imgEle.src || imgEle.attr("src")
    if (url.indexOf('!size=') > 0) {
        url = url.substring(0, url.indexOf('!size='))
    }
    if (url) {
        copyTxtToClipboard(url)
    }
}

/**
 * 下载图片的方法
 * @param imgEle   img元素的 js原生对象
 * @param fileName   下载生成的图片名字
 */
function downLoadImg(imgEle, fileName) {
    var src = imgEle.src || imgEle.attr("src")
    if (src.indexOf('!size=') > 0) {
        src = src.substring(0, src.indexOf('!size='))
    }
    if (!imgHttpsAddress) {
        imgHttpsAddress = 'https://imgclubs.com'
    }
    // 将http改成 https
    if (src.indexOf('http://') >= 0) {
        src = imgHttpsAddress + src.substring(src.indexOf('/', 7))
    }
    if (validURL(src) && src.indexOf('/static/img/kong.png') === -1) {
        if (!fileName) {
            fileName = src.substring(src.lastIndexOf('/'))
        }
        fetch(src).then((res) =>
            res.blob().then((blob) => {
                var a = document.createElement('a')
                var url = window.URL.createObjectURL(blob)
                var filename = fileName
                a.href = url
                a.download = filename
                a.click()
                window.URL.revokeObjectURL(url)
            })
        )
    }
}

/**
 * 下载图片的方法,针对首页小工具-抠图
 * @param imgEle   img元素的 js原生对象
 * @param fileName   下载生成的图片名字
 */
function downLoadImg_utils(imgEle, fileName) {
    if(imgEle.indexOf("http:") != -1){
        imgEle = imgEle.replace("http:","https:")
    }
    fetch(imgEle).then((res) =>
        res.blob().then((blob) => {
            var a = document.createElement('a')
            var url = window.URL.createObjectURL(blob)
            var filename = fileName
            a.href = url
            a.download = filename
            a.click()
            window.URL.revokeObjectURL(url)
        })
    )
}

// 数组求和
function arrSum(arr) {
    return arr.reduce(function(acr, cur){
        return acr*1 + cur*1;
    });
}

//函数防抖处理
function fn_debounce(fn, wait) {
    var timeout = null
    return function() {
        if (timeout !== null) clearTimeout(timeout)
        timeout = setTimeout(fn, wait)
    }
}

// 折叠按钮 时间 -begin
$('body').on('mouseover', '.title_btnSelect', function() {
    $(this).next('.optionBox_btnSelect').show()
})
$('body').on('mouseleave', '.btnSelect_hp', function() {
    $(this).find('.optionBox_btnSelect').hide()
    $('.translate_dialog').hide()
})
$('body').on('mouseover', '.option_btnSelect', function() {
    $(this).css('background', '#009688')
    $(this).css('color', '#fff')
})
$('body').on('mouseleave', '.option_btnSelect', function() {
    $(this).css('background', '')
    $(this).css('color', '#000')
})
// 折叠按钮 时间 -end
// 折叠按钮 时间 -begin--->无样式
$('body').on('mouseover', '.option_imgSelect', function() {
    $(this).css('background', '#ccc')
})
$('body').on('mouseleave', '.option_imgSelect', function() {
    $(this).css('background', '')
})
// 折叠按钮 时间 -end

//表头固定的统一处理
function UnifiedFixedFn(id) {
    $('.layadmin-tabsbody-item.layui-show').on('scroll', function() {
        //滚动的高度
        var top = $(this).scrollTop()
        //获取父元素card
        var $card = $('#' + id)
        //获取到需要固定的元素
        var headHeader = $card.find('.layui-card-header')
        var tableHeader = $card.find('.layui-table-header')
        var ckesHeader = $card.find('.ztt-card-checkbox')
        //获取到距离顶部高度的偏移量
        var cardHeaderHeight
        var headHeaderHeight = 0
        var ckesHeaderHeight = 0
        if (headHeader.length > 0) {
            cardHeaderHeight = headHeader[0].offsetTop
            headHeaderHeight = headHeader.height()
            if (ckesHeader.length > 0) {
                ckesHeaderHeight = ckesHeader.height()
            }
        } else if (tableHeader.length > 0) {
            cardHeaderHeight = tableHeader[0].offsetTop
        }
        var fixedObj = {
            position: 'fixed',
            zIndex: 999,
            width: '94vw',
            background: '#fff',
            top: 0,
            padding: 0
        }
        if (top > cardHeaderHeight) {
            if (headHeader.length > 0) {
                headHeader.css(fixedObj)
                if (ckesHeader.length > 0) {
                    ckesHeader.css(Object.assign(fixedObj, { top: headHeaderHeight + 'px', zIndex: 998 }))
                }
            }
            tableHeader.css(
                Object.assign(fixedObj, { top: headHeaderHeight + ckesHeaderHeight + 'px', zIndex: 998 })
            )
        } else {
            if (headHeader.length > 0) {
                headHeader.css({
                    position: 'inherit',
                    zIndex: 20,
                    top: '0px'
                })
                if (ckesHeader.length > 0) {
                    ckesHeader.css({
                        position: 'inherit',
                        zIndex: 10,
                        top: '0px'
                    })
                }
            }
            tableHeader.css({
                position: 'inherit',
                zIndex: 10,
                top: '0px'
            })
        }
    })
}
// layui表格编辑时，去除编辑ICON
$('body').on('focus', '.layui-table-edit', function() {
    this.value = this.value.replace(/  /g, '')
})
/**
 * 展开全部和收起全部功能
 */
function expandAll(id) {
    var allShow = $('#' + id).find('.productListSkuShow')
    for (var i = 0; i < allShow.length; i++) {
        var showi = allShow[i]
        if ($(showi).html().indexOf('展开') > -1) {
            $(showi).trigger('click')
        }
    }
}

function PackUpAll(id) {
    var allShow = $('#' + id).find('.productListSkuShow')
    for (var i = 0; i < allShow.length; i++) {
        var showi = allShow[i]
        if ($(showi).html().indexOf('收起') > -1) {
            $(showi).trigger('click')
        }
    }
}
function reRenderPage() {
    $('.layadmin-tabsbody-item.layui-show .layui-laypage-btn').click()
}

function removeObjFromArr(_arr, _obj) {
    var length = _arr.length
    for (var i = 0; i < length; i++) {
        if (_arr[i] == _obj) {
            if (i == 0) {
                _arr.shift() //删除并返回数组的第一个元素
                return _arr
            } else if (i == length - 1) {
                _arr.pop() //删除并返回数组的最后一个元素
                return _arr
            } else {
                _arr.splice(i, 1) //删除下标为i的元素
                return _arr
            }
        }
    }
}

/**
 * 初始化页面配置
 * @param form layui.form 对象
 * @param formElem 配置所在父元素.  要求传入jquery对象
 * @param pageUrl   页面路径
 * @param confType
 */
function initPageConf(form, formElem, pageUrl, confType) {
    var data = {
        pageUrl: pageUrl,
        confType: confType
    }
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: ctx + '/pageConf/getPageConf.html',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function(res) {
            if (res.code == '0000') {
                var list = res.data
                for (var i = 0; i < list.length; ++i) {
                    var ele = formElem.find('[lay-filter=' + confType + '][name=' + list[i].confName + ']')
                    var tagName = ele[0].tagName
                    switch (tagName) {
                        case 'INPUT':
                            var type = ele.attr('type')
                            switch (type) {
                                case 'checkbox':
                                    ele.prop('checked', list[i].confValue)
                                    break
                                default:
                                    ele.val(list[i].confValue)
                            }
                            break
                        default:
                            console.log('新类型')
                    }
                }
                form.render('checkbox')
                form.render('select')
            }
        }
    })
}

/**
 * 监听页面参数变更
 * @param form layui.form 对象
 * @param filter    lay-filter值 也等于confType
 * @param parentElem  父元素
 * @param pageUrl   页面路径
 */
function listenPageConfChange(form, filter, parentElem, pageUrl) {
    form.on('checkbox(' + filter + ')', function(data) {
        var confElem = parentElem.find('[lay-filter=singleCheckConf]')
        var list = []
        loop1: for (var i = 0; i < confElem.length; ++i) {
            var one = {
                confType: filter,
                confName: confElem[i].name
            }
            var tagName = confElem[i].tagName
            switch (tagName) {
                case 'INPUT':
                    var type = $(confElem[i]).attr('type')
                    switch (type) {
                        case 'checkbox':
                            one.confValue = $(confElem[i]).prop('checked')
                            if (!one.confValue) {
                                continue
                            }
                            break
                        default:
                            one.confValue = $(confElem[i]).val()
                    }
                    break
                default:
                    one.confValue = $(confElem[i]).val()
            }
            list.push(one)
        }
        console.log(list)
        var data = {
            pageUrl: pageUrl,
            confList: list
        }
        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: ctx + '/pageConf/addOrUpdate.html',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function(res) {
                if (res.code != '0000') {
                    layer.msg('记录页面配置失败: ' + res.msg)
                }
            }
        })
    })
}
/**
 * 下拉按钮
 * 以ul列表展示button
 * 提供choose获取点击按钮事件回调
 */
function dropButton(el) {
    this.$el = document.getElementById(el)
    this.isclicked = false
    this.init()
}

dropButton.prototype.init = function() {
    let _this = this
    _this.render()
    _this.trigger()
    _this.hover()
    _this.choose()
    _this.close()
}

dropButton.prototype.render = function() {
    let $el = this.$el
    let ul = $($el).children('ul')
    let button = $($el).children('button')
    button.append('<i class="layui-icon epeanicon">&#xe61a;</i>')
    ul.addClass('btnpanel')
    $(this).css('position', 'relative')
    ul.find('div').addClass('sortTitle')
    ul.find('li').each((index, li) => {
        if (isLeaf(li)) {
            $(li).addClass('leaveLi')
        }
    })
}

dropButton.prototype.trigger = function() {
    let _this = this
    let $el = this.$el
    let button = $($el).children('button')
    button.click(function() {
        let isopen = _this.isopen()
        let isclicked = _this.isclicked
        if (!isclicked || isopen) {
            _this.show()
            _this.isclicked = true
        } else {
            _this.hide()
            _this.isclicked = false
        }
    })
    button
        .mouseenter(function() {
            let isclicked = _this.isclicked
            let isopen = _this.isopen()
            if (!isclicked || isopen) {
                _this.show()
            }
        })
        .mouseleave(function() {
            let isopen = _this.isopen()
            document.addEventListener('mousemove', (e) => {
                if (!isopen && !_this.isOnbtnPanel(e) && !_this.isclicked) {
                    _this.hide()
                }
            })
        })
}

dropButton.prototype.hover = function() {
    let _this = this
    let $el = this.$el
    let ul = $($el).children('ul')
    ul.find('li').each((index, li) => {
        if (isLeaf(li)) {
            $(li)
                .mouseenter(function() {
                    $(this).addClass('hoverLi')
                })
                .mouseleave(function() {
                    $(this).removeClass('hoverLi')
                })
        }
    })
}

dropButton.prototype.show = function() {
    let _this = this
    let $el = _this.$el
    let isopen = _this.isopen()
    if (isopen) {
        $($el).find('.btnpanel').removeClass('hidden')
        $($el).find('button').find('.layui-icon').html('&#xe619;')
    }
}

dropButton.prototype.clearActive = function() {
    let _this = this
    let lis = $(_this.$el).find('li')
    lis.each((index, li) => {
        if ($(li).hasClass('activedLi')) {
            $(li).removeClass('activedLi')
        }
    })
}

dropButton.prototype.hide = function() {
    let _this = this
    let $el = _this.$el
    let isopen = _this.isopen()
    if (!isopen) {
        $($el).find('.btnpanel').addClass('hidden')
        $($el).find('button').find('.layui-icon').html('&#xe61a;')
    }
}

dropButton.prototype.isopen = function() {
    let _this = this
    let $el = _this.$el
    return $($el).find('.btnpanel').hasClass('hidden')
}

let isLeaf = function(li) {
    return li.children.length === 0
}

dropButton.prototype.isOnbtnPanel = function(e) {
    let _this = this
    let path = e.path || (e.composedPath && e.composedPath())
    return [ ...path ].includes(_this.$el)
}

dropButton.prototype.choose = function(func) {
    let _this = this
    let $el = this.$el
    let ul = $($el).children('ul')
    ul.find('li').each((index, li) => {
        if (isLeaf(li)) {
            $(li).click(function() {
                _this.clearActive()
                _this.isclicked = true
                $(this).addClass('activedLi')
                li_event = $(this).data('event')
                if (func) {
                    func(li_event)
                }
            })
        }
    })
}

dropButton.prototype.close = function() {
    let _this = this
    let isopen = _this.isopen()
    if (isopen) {
        document.addEventListener('click', (e) => {
            if (!_this.isOnbtnPanel(e)) {
                _this.hide()
                _this.isclicked = false
                _this.clearActive()
            }
        })
    }
}
/**下拉按钮结束*/

function setLocalCache(key, value) {
    if (typeof value != 'string') {
        value = JSON.stringify(value)
    }
    window.localStorage[key] = value
}

/**
 * 初始化标签字典选择
 * @param selector  目标元素选择器
 * @param headCode 字典头
 * @param withNullOption 是否有空值选项
 * @param useNameAsValue 是否使用字典的 name作为选项的value
 * @param defaultSelect 默认选项值
 * @param formSelects 多选工具
 * @param externalData 额外的选项
 */
function initBizzTag(selector, headCode, withNullOption, useNameAsValue, defaultSelect, formSelects, externalData,NullOptionShowName) {
    let htmls = ''
    if (withNullOption) {
        htmls += '<option value="">' + (NullOptionShowName || '') + '</option>'
    }
    if (externalData) {
        for (let i = 0; i < externalData.length; ++i) {
            htmls += '<option value="' + externalData[i].value + '">' + externalData[i].name + '</option>'
        }
    }
    $.ajax({
        type: 'post',
        url: ctx + '/sys/listdict.html',
        dataType: 'json',
        data: { headCode: headCode },
        success: function(res) {
            if (res.code === '0000') {
                let list = []
                if (externalData) {
                    list = list.concat(externalData)
                }
                if (useNameAsValue) {
                    for (let i = 0; i < res.data.length; i++) {
                        let dict = res.data[i]
                        htmls +=
                            '<option value="' +
                            dict.name +
                            '" ' +
                            (defaultSelect == dict.name ? 'selected' : '') +
                            '>' +
                            dict.name +
                            '</option>'
                        list.push({ name: dict.name, value: dict.name })
                    }
                } else {
                    for (let i = 0; i < res.data.length; i++) {
                        let dict = res.data[i]
                        htmls +=
                            '<option value="' +
                            dict.code +
                            '" ' +
                            (defaultSelect == dict.code ? 'selected' : '') +
                            '>' +
                            dict.name +
                            '</option>'
                        list.push({ name: dict.name, value: dict.code })
                    }
                }
                let selectEle = $(selector)
                if (formSelects) {
                    formSelects.data(selectEle.attr('xm-select'), 'local', { arr: list })
                } else {
                    selectEle.html(htmls)
                    layui.form.render('select')
                }
            } else {
                layer.msg('初始化选项失败,请刷新页面。如多次重试无效，请联系技术人员')
            }
        }
    })
}

/**
 * 初始化人员选择 控件
 * @param selector 需要初始化的组件 的选择器
 * @param formLayFiler 组件所在的<form> 的选择器
 * @param role 需要初始化的人员角色
 * @param formSelects layui多选组件
 */
function initPersonSelect(selector, formLayFiler, role, formSelects) {
    const roleArr = role.split(',')
    let ajax = new Ajax(false)
    console.log(roleArr)
    ajax.post({
        type: 'POST',
        url: ctx + '/sysuser/getUserByRoleList.html',
        data: JSON.stringify({ roleList: roleArr }),
        success: function(res) {
            if (res.code === '0000') {
                if (formSelects) {
                    let arr = []
                    for (let i = 0; i < res.data.length; i++) {
                        arr.push({ name: res.data[i].userName, value: res.data[i].id })
                    }
                    formSelects.data(selector, 'local', { arr: arr })
                } else {
                    let select = $(selector)
                    let options = '<option></option>'
                    for (let i = 0; i < res.data.length; i++) {
                        options += '<option value="' + res.data[i].id + '">' + res.data[i].userName + '</option>'
                    }
                    select.append(options)
                    layui.form.render('select', formLayFiler)
                }
            } else {
                layer.msg('初始化' + role + ' 失败：' + res.msg)
            }
        }
    })
}

function getAllOptionsForMultiSelector(layFilter) {
    let dds = $('[xid=' + layFilter + '] dd[tree-id]')
    let arr = []
    for (let i = 0; i < dds.length; ++i) {
        arr.push({
            value: dds[i].getAttribute('lay-value'),
            name: $(dds[i]).find('span').text().trim()
        })
    }
    return arr
}

function getAmazonProdPagePrex(salesSite) {
    switch (salesSite) {
        case 'DE':
            return 'https://www.amazon.de/dp/'
        case 'ES':
            return 'https://www.amazon.es/dp/'
        case 'FR':
            return 'https://www.amazon.fr/dp/'
        case 'GB':
            return 'https://www.amazon.co.uk/dp/'
        case 'IT':
            return 'https://www.amazon.it/dp/'
        case 'IN':
            return 'https://www.amazon.in/dp/'
        case 'AE':
            return 'https://www.amazon.ae/dp/'
        case 'TR':
            return 'https://www.amazon.com.tr/dp/'
        case 'CA':
            return 'https://www.amazon.ca/dp/'
        case 'MX':
            return 'https://www.amazon.com.mx/dp/'
        case 'BR':
            return 'https://www.amazon.com.br/dp/'
        case 'AU':
            return 'https://www.amazon.com.au/dp/'
        case 'JP':
            return 'https://www.amazon.co.jp/dp/'
        case 'CN':
            return 'https://www.amazon.cn/dp/'
        case 'US':
            return 'https://www.amazon.com/dp/'
        default:
            return 'https://www.amazon.'+ salesSite.toLowerCase() +'/dp/'
    }
}

function procMultiSelect(id, separator) {
    var select = document.getElementById(id)
    var str = []
    for (i = 0; i < select.length; i++) {
        if (select.options[i].selected) {
            str.push(select[i].value)
        }
    }
    var str1 = str.join(separator)
    return str1
}

/**
 * 获取跳转参数。并赋值
 * @param formSelector 搜索框form的 选择器.
 */
function initSearchParam(formSelector) {
    window.setTimeout(function() {
        try {
            let formElem = $(formSelector)
            let paramStr = sessionStorage.getItem('lastJumpParam')
            console.log(paramStr)
            if (!paramStr) {
                return
            }
            let paramObj = JSON.parse(paramStr)
            for (let key in paramObj) {
                let keyElem = formElem.find('[name=' + key + ']')
                if (!keyElem) {
                    continue
                }
                // 如果是多选select
                if (keyElem.hasClass('xm-hide-input')) {
                    let xm_select = keyElem.closest('.xm-select-parent').prev('[xm-select]').attr('xm-select')
                    layui.formSelects.value(xm_select, paramObj[key].split(','))
                } else {
                    keyElem.val(paramObj[key])
                }
            }
            layui.form.render('select')
            layui.form.render('checkbox')
            formElem.find('.keyHandle').click()
        } catch (e) {
            console.log('读取跳转参数出错e=' + e)
        } finally {
            sessionStorage.removeItem('lastJumpParam')
        }
    }, 500)
}

/**
 * 复现数据
 * @param data 数据
 * @param form form的jquery对象
 */
function reappearance(data, form) {
    for (let key in data) {
        if (data[key] != null) {
            form.find('[name=' + key + ']').val(data[key])
        }
    }
    let layFilter = form.attr('lay-filter')
    layui.form.render('select', layFilter)
    layui.form.render('radio', layFilter)
}

/**
 * 时间大小比对,date1>date2返回false
 * @param date1 日期格式:2021-10-06 00:00:00
 */
function checkDate(date1, date2) {
    let oDate1 = new Date(date1)
    let oDate2 = new Date(date2)
    return oDate1.getTime() > oDate2.getTime()
}

/**
 * 获取两个日期的天数
 * @param date1 日期格式:2021-10-06 00:00:00
 */
function getDays(date1, date2) {
    let oDate1 = new Date(date1)
    let oDate2 = new Date(date2)
    let getd = (oDate2.getTime() - oDate1.getTime()) / (3600 * 24 * 1000)
    return Math.abs(getd)
}

/**
 * 获取两个日期的分钟数
 * @param date1 日期格式:2021-10-06 00:00:00
 */
function getMins(date1, date2) {
    let oDate1 = new Date(date1)
    let oDate2 = new Date(date2)
    let getd = (oDate2.getTime() - oDate1.getTime()) / (60 * 1000)
    return Math.abs(getd)
}

function getCurrencyIcon(currency) {
    switch (currency){
        case 'USD': return '$'
        case 'CAD': return 'C$'
        case 'GBP': return '£'
        case 'EUR': return '€'
        case 'AUD': return 'A$'
        case 'CNY': return '¥'
        case 'JPY': return '円'
        default : return currency
    }
    
}


function ajaxEventTrigger(event) {
    var ajaxEvent = new CustomEvent(event, { detail: this });
    if (this.readyState === 1) {
        this.setRequestHeader("lmsUserId",$('#lmsUserId').val())
    }
    window.dispatchEvent(ajaxEvent);
}
// //
// var oldXHR = window.XMLHttpRequest;
// function newXHR() {
//     var realXHR = new oldXHR();
//     realXHR.addEventListener('readystatechange', function() { ajaxEventTrigger.call(this, 'ajaxReadyStateChange'); }, false);
//     return realXHR;
// }
// window.XMLHttpRequest = newXHR;
//
// window.addEventListener('ajaxReadyStateChange', function (e) {
    // console.log(this)
    // console.log(e)
// });

function refreshTable() {
    $('.layadmin-tabsbody-item.layui-show').find('.layui-laypage-btn').click()
}

/**
 *  通过ajax请求 初始化select
 * @param url
 * @param data
 * @param formart
 *  {name: 'nameField', value: 'valueField'}
 * @param selector  选择器
 * @param defaultSelectValue 默认选择的值
 * @param defaultSelectName 默认选择的名字  defaultSelectValue 和 defaultSelectName 只能传1个
 */
function initSelectByAjax(url,data,formart,selector,layuiform,defaultSelectValue, defaultSelectName) {
    oneAjax.post({
        url: url,
        data: data,
        success: function (res) {
            if (res.code === '0000') {
                let list = res.data
                let optionList = ''
                if (layuiform.data != null) {
                    let arr = []
                    for (let i = 0; i < res.data.length; i++) {
                        arr.push({ name: list[i][formart.name], value: list[i][formart.value] })
                    }
                    layuiform.data(selector, 'local', { arr: arr })
                } else {
                    for (let i = 0; i < list.length; ++i) {
                        optionList+= `<option value="` + list[i][formart['value']] +`" `
                            + (defaultSelectValue != null && defaultSelectValue == list[i][formart['value']] ? 'selected' : '')
                            + (defaultSelectName != null && defaultSelectName == list[i][formart['name']] ? 'selected' : '')
                            +` >`+ list[i][formart['name']] +`</option>`
                    }

                    $(selector).append(optionList)
                    layuiform.render('select')
                }
            }
        }
    })
}


// 下划线转驼峰
function toHump(name) {
    return name.replace(/\_(\w)/g, function(all, letter){
        return letter.toUpperCase();
    });
}
// 驼峰转换下划线
function toLine(name) {
    return name.replace(/([A-Z])/g,"_$1").toLowerCase();
}


let onmouseShowTablehtml = `<div class="layui-card">
                    <div class="layui-card-body">
                        <table class="layui-table" id="onMouseTable" lay-filter="onMouseTable"></table>
                    </div>
                </div>`

function onmouseShowTable(self,list,col) {
    let layer = layui.layer,
        table = layui.table
    let oldId = self.getAttribute('data-tipId')
    if (oldId) {
        layer.close(oldId)
    }

    let tipsIndex = layer.open({
        type: 4,
        shade: 0,
        area: ['850px', '250px'],
        tips: [1, 'rgba(5,5,5,0.4)'],
        isOutAnim: false,
        content: [onmouseShowTablehtml, self], //数组第二项即吸附元素选择器或者DOM
        success: function() {
            table.render({
                elem: "#onMouseTable",
                id: "onMouseTable",
                data: list,
                cols: [
                    col
                ],
                page: false,
            });
        }
    });
    self.setAttribute('data-tipId', tipsIndex)
}

function getCurTrData(self,tableId) {
    // 获取当前行数据
    let tr = $(self).closest('tr')
    let index = tr.attr('data-index')
    let list = layui.table.cache[tableId]

    console.log(list)
    return list[parseInt(index)]
}

/**
 * 初始化上传本地视频按钮
 * @param upload layui上传组件
 * @param elem 绑定的按钮选择器
 * @param url  上传的url
 * @param savePath  保存文件的路径
 */
function initUploadVedio(upload,elem,url,savePath) {
    let self
    upload.render({
        elem: elem
        ,url: url //此处配置你自己的上传接口即可
        ,data: {
            "savePath": savePath
        }
        ,accept: 'video' //视频
        , exts: 'mp4|webm' //只允许上传mp4文件
        , size: 1024*20//最大允许上传的单个文件大小,单位KB,30M
        , number: 1 // 设置同时可上传的文件数量
        ,before: async function (obj) {
            self = obj
            let files = obj.pushFile()
            for (let key in files) {
                let file = files[key]
                let fingerpring = window.localStorage.fingerprint
                let nowDate = fingerpring.substring(fingerpring.length - 10)  +  new Date().getTime()
                file = new File([file],nowDate + file.name,{type: file.type})
                mp4Name = file.name
                files[key] = file
                let flag = await validateVideo([file])
                if (!flag) { // 未通过校验， 删除当前文件
                    delete files[key]
                }
                return flag
            }
        }
        ,done: function(res,i){
            // 上传成功后，将组件中待上传文件中，本次上传成功的文件删除
            delete self.pushFile()[i]
            layui.layer.msg('上传成功');
            if(res.code == '0000'){
                let mp4Str = `
                    <video width="200" height="200" controls>
                        <source name="mp4Url" src=":src"  type="video/mp4">
                        您的浏览器不支持 HTML5 video 标签。
                    </video>`
                mp4Str = mp4Str.replace(":src",templateVedioVisitPath + mp4Name)
                $(".mp4Contain").html(mp4Str)
            }else{
                layui.layer.msg(res.msg)
            }
        }
    });
}
/**
 * 初始化Lazada上传URL视频按钮
 * @param upload layui上传组件
 * @param elem 绑定的按钮选择器
 * @param url  上传的url
 */

function initLazadaUrlVedio(url,name) {
    let fileName = name;
    getFileByUrl(url,fileName,'video/mp4').then(async function (res) {
        let flag = await validateVideo([res],[10,60])
        if (flag) {
            var formData = new FormData();
            formData.append("file", res);
            $.ajax({
                url: ctx + '/LazadaVideoMange/saveVideos',
                type: 'POST',
                // async : false,
                data: formData,
                // 告诉jQuery不要去处理发送的数据
                processData: false,
                // 告诉jQuery不要去设置Content-Type请求头
                contentType: false,
                success: function(res) {
                    loading.hide()
                    if(res.code == "0000"){
                        let str = '', str1 = "", str2 = "";
                        res.data["已经存在"].forEach(item => {
                            str1 += item + "<br>"
                        })
                        res.data["sku不存在"].forEach(item => {
                            str2 += item + "<br>"
                        })
                        str += res.msg;
                        str += '<br>已经存在:' + str1;
                        str += '<br>sku不存在:' + str2
                        layer.closeAll();
                        layer.alert(str);
                        $("#lazadaVideoManage_searchBtn").click()
                    }else{
                        layer.alert(res.msg,{icon:2});
                    }
                },
                complete: function () {
                    loading.hide()
                }
            })
        }
    })
}
/**
 * 初始化Lazada上传本地视频按钮
 * @param upload layui上传组件
 * @param elem 绑定的按钮选择器
 * @param url  上传的url
 */
function initLazadaUploadVedio(upload,elem,url) {
    let self
    upload.render({
        elem: elem
        ,url: url //此处配置你自己的上传接口即可
        ,accept: 'video' //视频
        , exts: 'mp4' //只允许上传mp4文件
        , size: 1024*20//最大允许上传的单个文件大小,单位KB,30M
        , number: 1 // 设置同时可上传的文件数量
        ,before: async function (obj) {
            self = obj
            let files = obj.pushFile()
            for (let key in files) {
                let file = files[key]
                let flag = await validateVideo([file],[10,60])
                if (!flag) { // 未通过校验， 删除当前文件
                    delete files[key]
                }
                return flag
            }
        }
        ,done: function(res,i){
            // 上传成功后，将组件中待上传文件中，本次上传成功的文件删除
            delete self.pushFile()[i]
            if(res.code == "0000"){
                let str = '', str1 = "", str2 = "";
                res.data["已经存在"].forEach(item => {
                    str1 += item + "<br>"
                })
                res.data["sku不存在"].forEach(item => {
                    str2 += item + "<br>"
                })
                str += res.msg;
                str += '<br>已经存在:' + str1;
                str += '<br>sku不存在:' + str2
                layer.alert(str);
                $("#lazadaVideoManage_searchBtn").click()
            }else{
                layer.alert(res.msg,{icon:2});
            }
        }
    });
}

/**
 * 校验视频
 * @param files
 * @returns {Promise.<boolean>}
 */
async function validateVideo(files,range) {
    let checkSizes
        checkSizes = await checkSize(files)
    if (range != undefined && (checkSizes.duration > range[1]||checkSizes.duration < range[0])) {
        layui.layer.msg(`视频时间需在${range[0]}-${range[1]}之内`)
        return false
    }
    if (range == undefined && checkSizes.duration > 60) {
        layui.layer.msg('视频时间需在60s之内')
        return false
    }
    if (checkSizes.videoWidth < 480 || checkSizes.videoWidth > 1280 || checkSizes.videoHeight < 480 || checkSizes.videoHeight > 1280) {
        layui.layer.msg('视频分辨率需在480P-1280P之间')
        return false
    }
    return true
}
// 获取最大公约数
function getGcd(a, b) {
    let n1, n2;
    if (a > b) {
        n1 = a;
        n2 = b;
    } else {
        n1 = b;
        n2 = a;
    }
    let remainder = n1 % n2;
    if (remainder === 0) {
        return n2;
    } else {
        return getGcd(n2, remainder)
    }
}
// 创建虚拟dom 并且放回对应的值
let checkSize = async (files, isVideo) => {
    if (!files || !files[0]) return false
    const checktimevideo = document.getElementById('checktimevideo')
    if (checktimevideo) {
        document.body.removeChild(checktimevideo)
    }
    let doms
    if (!isVideo) {
        doms = document.createElement('video')
    } else {
        doms = document.createElement('audio')
    }
    const url = URL.createObjectURL(files[0])
    console.log(url)
    doms.src = url
    doms.id = 'checktimevideo'
    doms.style.display = 'none'
    document.body.appendChild(doms)
    return await gettime(doms);
}
let gettime = (doms) => {
    // 由于loadedmetadata 是异步代码所以需要promise进行封装转换为同步代码执行
    const promise = new Promise(resolve => {
        doms.addEventListener('loadedmetadata', e => {
            const gcd = getGcd(e.target.videoWidth, e.target.videoHeight);
            console.log(gcd)
            let obj = {
                videoWidth: doms.videoWidth, // 尺寸宽 --- 分辨率
                videoHeight: doms.videoHeight, // 尺寸高
                duration: e.target.duration, // 视频时长 1表示一秒
                ccbl: [e.target.videoWidth / gcd, e.target.videoHeight / gcd] // 计算尺寸比例
            }
            resolve(obj)
        })
    })
    return promise
}

function initUploadVedioByUrl(requireUrl, savePath){
    let index = layer.open({
        type: 1,
        title: '视频URL',
        area: ['600px', '300px'],
        id: 'mainNetMp4Success',
        content: '<div class="p20 pl20"><textarea class="layui-textarea" id="netMp4Url" placeholder="请填写URL，仅支持一个URL上传"></textarea></div>',
        btn: ['确定', '关闭'],
        yes: function () {
            var url = $.trim($("#netMp4Url").val());
            if (url == null || url == "") {
                layer.msg("视频URL不能为空！", {icon: 5});
                return false;
            }

            loading.show()
            let fingerpring = window.localStorage.fingerprint
            let fileName
            if (url.indexOf('?') >0) {
                fileName = fingerpring.substring(fingerpring.length - 10)  +  new Date().getTime() + url.substring(url.lastIndexOf('/') + 1,url.indexOf('?'))
            } else {
                fileName = fingerpring.substring(fingerpring.length - 10)  +  new Date().getTime() + url.substring(url.lastIndexOf('/') + 1)
            }
            getFileByUrl(url,fileName,'video/mp4').then(function (res) {
                let flag = validateVideo([res])
                if (flag) {
                    var formData = new FormData();
                    formData.append("savePath", savePath);
                    formData.append("file", res);
                    $.ajax({
                        url: requireUrl,
                        type: 'POST',
                        // async : false,
                        data: formData,
                        // 告诉jQuery不要去处理发送的数据
                        processData: false,
                        // 告诉jQuery不要去设置Content-Type请求头
                        contentType: false,
                        success: function(data) {
                            loading.hide()
                            layer.close(index)
                            if (data.code === '0000') {
                                let mp4Str = `
                                        <video width="200" height="200" controls>
                                            <source name="mp4Url" src=":src"  type="video/mp4">
                                            您的浏览器不支持 HTML5 video 标签。
                                        </video>`
                                mp4Str = mp4Str.replace(":src",templateVedioVisitPath + res.name)
                                $(".mp4Contain").html(mp4Str)
                            } else {
                                layer.msg(data.msg)
                            }
                        },
                        complete: function () {
                            loading.hide()
                        }
                    })
                }
            })
        }
    })
}

/**
 * 将输入内容的首字母，自动转换为大写
 * @param self  dom元素
 */
function setFirstLetterUp(self) {
    let value = self.value
    self.value = titleCase2(value)
}

function titleCase2(s) {
    return s.toLowerCase().replace(/\b([\w|&lsquo;]+)\b/g, function(word) {
        //return word.slice(0, 1).toUpperCase() + word.slice(1);
        return word.replace(word.charAt(0), word.charAt(0).toUpperCase());
    });
}

function initPersonCondition(matchRoleArr, unMatchRoleArr,elem,valType) {
    // 获取当前登录用户的所有角色
    let curRoleArr = selfRoleNameList
    if (!curRoleArr || !curRoleArr.length) {
        return
    }
    // 将matchRoleArr, unMatchRoleArr 转成map。方便使用
    let matchRoleMap = arrToMap(matchRoleArr)
    let unMatchRoleMap = arrToMap(unMatchRoleArr)

    // 遍历角色， 要求存在一个角色在matchRoleArr中，同时不能是任一unMatchRoleArr中的角色
    let match = false
    for (let i = 0; i < curRoleArr.length; ++i) {
        let curRole = curRoleArr[i]
        if (unMatchRoleMap[curRole]) {
            return;
        }
        if (matchRoleMap[curRole]) {
            match = true
        }
    }
    if (!match) {
        return;
    }
    // 获取登录人名和id
    let name = localStorage.getItem('lmsAppUserName')
    let userId = localStorage.getItem('lmsAppUserId')
    let finalVal
    if (valType === 'name') {
        finalVal = name
    } else {
        finalVal = userId
    }
    // 如果elem有类
    let form = elem.closest('.layui-form')
    if (elem.hasClass('xm-hide-input')) {
        elem = elem.closest('.xm-select-parent').prev('select[xm-select]')
    }

    // 判断elem是什么类型，是否需要render
    let elemTagName = elem[0].tagName
    let elemType = elem.attr('type')
    if (elemTagName === 'INPUT'|| elemType === 'TEXTAREA') {

        elem.val(finalVal)
        return;
    }
    let formLayuiFilter = form.attr('lay-filter')
    if (elemTagName === 'SELECT') {
        // 先判断可选值是否已经初始化，如果没有，则循环等待1s
        function setSelectValue(){
            // 判断是否多选框
            let xmSelect = elem.attr('xm-select')
            if (xmSelect) {
                layui.formSelects.value(xmSelect, [finalVal])
            } else {
                elem.val(finalVal)
                layui.form.render('select', formLayuiFilter)
            }
        }
        let times = 0
        let intervalIndex = window.setInterval(function () {
            if (times++ > 3) { // 超过3次仍未成功则不再继续
                clearInterval(intervalIndex)
                return
            }
            let validOption = elem.find('option[value][value!=""]')
            if (validOption && validOption.length > 0) {
                setSelectValue()
                clearInterval(intervalIndex)
            }
        },1000)
    }
}

function arrToMap(arr){
    if (!arr || !arr.length) {
        return {}
    }
    let map = {}
    for (let i = 0; i < arr.length; ++i) {
        map[arr[i]] = 1
    }
    return map
}

function getHpSelectResult(orgElem,userElem){

    if (organize || userId) {
        if (userId) { // 如果选了人，则只查询这个人的。
            return userId
        } else { // 如果选了部门没选人，则查询整个部门的
            let userIdList = []
            let elem = formElem.find('[name=userId]')
            if (elem.hasClass('xm-hide-input')) {
                elem = elem.closest('.xm-select-parent').prev('select[xm-select]')
                userIdList = elem.attr('user_ids').split(',')
            } else {
                let options = elem.find('option')
                let value
                for (let i = 0; i < options.length; ++i) {
                    value = options[i].getAttribute('value')
                    if (value) {
                        userIdList.push(parseInt(value))
                    }
                }
            }

            searchParam[searchParam.userType + 'Str'] = userIdList.join(',')
        }
    }
}

function getParamMapFromUrl(url) {
    if (!url || url.indexOf('?') < 0) {
        return ''
    }
    // let allParamStr = url.substring(url.indexOf('?')
    let allParamStr = url.split('?')[1] || ''
    let paramStrArr = allParamStr.split('&')
    let res = {}
    for (let i = 0; i < paramStrArr.length; ++i) {
        let keyValueArr = paramStrArr[i].split('=')
        res[keyValueArr[0]] = keyValueArr[1]
    }
    return res
}

function getAliasOfDevType(devType) {

    if (!devType) {
        return ''
    }

    switch (devType){
        case "SMT开发" : return 'smt'
        case "ebay英国海外仓" : return '英'
        case "ebay澳洲海外仓" : return '奥'
        case "Shopee开发" : return 'Sh'
        case "Lazada开发" : return 'La'
        case "阿里销量产品" : return 'AL'
        case "供应商新品" : return '新'
        case "ebay直邮" : return 'Eb'
        case "ebay美国海外仓" : return '美'
        case "ebay德国海外仓" : return '德'
        case "亚马逊直邮" : return '直邮'
        case "亚马逊精铺" : return '精铺'
        case "亚马逊精品" : return '精品'
        case "亚马逊铺货" : return '铺货'
        case "Fyndiq开发" : return 'Fy'
        case "wish开发" : return 'Wi'
        case "产品库开发" : return '库'
        case "tk开发" : return 'tk'
    }
}