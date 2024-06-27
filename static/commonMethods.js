/**
 * ztt通用ajax数据返回promise对象
 * @param {object} obj  ajax请求参数,传递数据使用params,其他和$相同
 */
function commonReturnPromise1 (obj, hasCode=true) {
    var defaultObj = {
        type: 'get',
        url: '',
        isLoading: true
    }
    var data = Object.assign(defaultObj, obj);
    return new Promise(function (resolve, reject) {
        $.ajax({
            type: data.type,
            dataType: 'json',
            url: data.url,
            contentType: data.contentType ? data.contentType : 'application/x-www-form-urlencoded; charset=UTF-8',
            data: data.params ? data.params : null,
            timeout: data.timeout || 900000, // 设置为15分钟
            beforeSend: function () {
                data.isLoading ? loading.show() : loading.hide();
            },
            success: function (res) {
                loading.hide();
                if(hasCode){
                  if (res.code == '0000') {
                    resolve(res.data || res.msg)
                  } else {
                      reject(res.msg || '请求接口失败')
                  }
                }else{
                  resolve(res)
                }
            },
            error: function (err) {
                loading.hide();
                let errInfo = err.responseJSON ? (err.responseJSON.message || err.responseJSON.msg) : err.responseText;
                reject(errInfo || '接口请求出错');
            }
        })
    })
}
/**
 * ztt通用ajax数据返回promise对象,封装catch[增加默认]
 * @param {object} obj  ajax请求参数,传递数据使用params,其他和$相同
 */
function commonReturnPromise (obj, hasCode=true) {
    let ajaxPromise = commonReturnPromise1(obj, hasCode);
    ajaxPromise.hasThen = false;
    ajaxPromise.hasCatch = false;
    const oldThen = ajaxPromise.then;
    ajaxPromise.then = (onFullfilled, onRejected) => {
        ajaxPromise.hasThen = true;
        const afterThen = oldThen.call(ajaxPromise, res => {
            return onFullfilled(res)
        }, err => {
            if (ajaxPromise.hasCatch) {
                throw err;
            }
            if (onRejected) {
                return onRejected(err)
            } else {
                layer.alert(err, { icon: 2 });
                console.log('默认异常处理', err);
                return err;
            }
        });
        const oldCatch = afterThen.catch;
        afterThen.catch = onRejected => {
            ajaxPromise.hasCatch = true;
            return oldCatch.call(afterThen, err => {
                return onRejected(err);
            })
        }
        return afterThen;
    };
    return ajaxPromise;
 }

/**
 * ztt通用ajax数据返回promise对象
 * @param {object} obj  ajax请求参数,传递数据使用params,其他和$相同
 */
function commonReturnPromiseRes (obj) {
    var defaultObj = {
        type: 'get',
        url: '',
        isLoading: true
    }
    var data = Object.assign(defaultObj, obj);
    return new Promise(function (resolve, reject) {
        $.ajax({
            type: data.type,
            dataType: 'json',
            url: data.url,
            contentType: data.contentType ? data.contentType : 'application/x-www-form-urlencoded; charset=UTF-8',
            data: data.params ? data.params : null,
            beforeSend: function () {
                data.isLoading ? loading.show() : loading.hide();
            },
            success: function (res) {
                loading.hide();
                if (res.code == '0000') {
                    resolve(res)
                } else {
                    reject(res.msg || '请求接口失败')
                }
            },
            error: function (err) {
                loading.hide();
                let errInfo = err.responseJSON ? (err.responseJSON.message || err.responseJSON.msg) : err.responseText;
                reject(errInfo || '接口请求出错');
            }
        })
    })
}

function commonReturnPromiseOrder (obj) {
    var defaultObj = {
        type: 'get',
        url: '',
        isLoading: true
    }
    var data = Object.assign(defaultObj, obj);
    return new Promise(function (resolve, reject) {
        $.ajax({
            type: data.type,
            dataType: 'json',
            url: data.url,
            contentType: data.contentType ? data.contentType : 'application/x-www-form-urlencoded; charset=UTF-8',
            data: data.params ? data.params : null,
            beforeSend: function () {
                data.isLoading ? loading.show() : loading.hide();
            },
            success: function (res) {
                loading.hide();
                if (res.code == '0000') {
                    res.msg ? resolve({ ...res.data, msg: res.msg }) : resolve(res.data);
                } else {
                    reject(res);
                }
            },
            error: function (err) {
                loading.hide();
                let errInfo = err.responseJSON ? (err.responseJSON.message || err.responseJSON.msg) : err.responseText;
                reject(errInfo || '接口请求出错');
            }
        })
    })
}
/**
 * ztt通用表格复选框选中处理
 * @param {string} id 表格id
 */
function commonTableCksSelected (id) {
    return new Promise(function (resolve, reject) {
        var checkStatus = layui.table.checkStatus(id),
            data = checkStatus.data;
        if (!data.length) {
            reject('请先选中一条数据');
        };
        resolve(data)
    })
}
/**
 * ztt判空函数
 * @param {any} value 需要判断的值
 */
function commonJudgeIsEmpty (value) {
    return (
        value === undefined ||
        value === null ||
        value === 0 ||
        (typeof value === "object" && Object.keys(value).length === 0) ||
        (typeof value === "string" && value.trim().length === 0)
    );
}
/**
 * ztt多层判空返回0或者空
 * @param {object} obj 需要判断的对象,键最好用first,second,...
 */
function commonJudgeReturn (obj) {
    var defaultObj = {
        val: ''
    };
    var data = $.extend(defaultObj, obj);
    var keyLenArr = Object.keys(data);
    var emptyArr = [];
    for (let item of keyLenArr.values()) {
        if (item !== 'val') {
            var isEmpty = data[item] === undefined || data[item] === null || data[item] === 0 || (typeof data[item] === "object" && Object.keys(data[item]).length === 0) || (typeof data[item] === "string" && data[item].trim().length === 0);
            if (isEmpty) {
                emptyArr.push(1)
            }
        }
    }
    if (emptyArr.length) {
        return data.val;
    } else {
        return data[keyLenArr[keyLenArr.length - 1]]
    }
}

/**
 * 通用的渲染select
 * @param {string} id 需要渲染的select框
 * @param {array} data 渲染的数据,数组格式
 */
function commonRenderSelect (id, data, opts) {
    return new Promise(function (resolve, reject) {
        var defaultOpts = Object.assign({ str: '<option value="">请选择</option>', name: '', code: '', selected: '' }, opts);
        var dataFirst = data[0] ? data[0] : '';
        var isObject = Object.prototype.toString.call(dataFirst) === "[object Object]" ? true : false;
        let optionStr = defaultOpts.str;
        let selected = defaultOpts.selected;
        if (isObject) {
            let $name = defaultOpts.name;
            let $code = defaultOpts.code;
            for (let [index, item] of data.entries()) {
                if (selected != '' && selected == item[$code]) {
                    optionStr += `<option value="${item[$code]}" selected>${item[$name]}</options>`
                } else {
                    optionStr += `<option value="${item[$code]}">${item[$name]}</options>`
                }
            }
        } else {
            for (let elem of data.values()) {
                if (selected === elem) {
                    optionStr += `<option value="${elem}" selected>${elem}</options>`
                } else {
                    optionStr += `<option value="${elem}">${elem}</options>`
                }

            }
        }
        $('#' + id).html(optionStr);
        resolve('渲染成功');
    })
}
//判断是否是正常全称url(带http或者https)
function commonUrlHandle (url) {
    if (url) {
        if (url.indexOf('http') != 0) {
            return 'https://' + url
        } else {
            return url
        }
    }
}
//如果是带http的图片截取http
function commonUrlHandleWithHttp (url) {
    if (url && url.indexOf('http') == 0 && url.indexOf('https') != 0) {
        return url.substring(5)
    } else {
        return url
    }
}
/**显示时替换刊登商品图片域名**/
template.defaults.imports.GlobalDomainImgSrc = GlobalDomainImgSrc;

function GlobalDomainImgSrc (src) {
    /*图片服务器的海外域名*/
    if (src != null && src.indexOf('epean') == -1 && (src.indexOf('lms') > -1 || src.indexOf('trade') > -1)) {
        var rep = new RegExp('(http://\|https://\){1}[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\\.?'); //域名正则
        if (location.href.indexOf("lms.epean.com.cn") > -1) { //亿品
            src = src.replace(rep, 'http://img.epean.com.cn')
        } else if (location.href.indexOf("mx.epean.com.cn") > -1) {
            src = src.replace(rep, 'http://imgmx.epean.com.cn')
        }
    }
    return src;
}
//删除行功能
window.commonDelTr = function (obj) {
    $(obj).parents('tr').remove();
}
//删除表格所有行功能
window.commonDelAllTr = function (obj) {
    $(obj).parents('table').find('tbody').empty();
}
//判断图片链接是否有效
function isEffectiveUrl (event) {
    var img = event.srcElement;
    img.src = ctx + "/static/img/kong.png";
    var $td = $(img).parents('td');
    if ($td.length > 0) {
        $td.empty().html('<span>暂无图片</span>');
    }
    img.onerror = null;
}
/**
 * 获取表单提交对象
 * @returns 返回表单对象
 */
$.fn.serializeObject = function () {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function () {
        if (o[this.name]) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
}

/**
 * 转化blob文件下载-只适合excel,其他类型需要改type,暂时不考虑
 * @param {Object} obj
 * @param obj.fileName: 下载下来的文件名称
 * @param obj.url: 需要执行的ajax链接,请求方式指定了必须是post
 * @param obj.formData: new FormData生成的表单数据
 * @param obj.contentType 请求头 'application/json'
 * @param methodType 请求类型 get,post
 */
function transBlob (obj, methodType, type) {
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest(); //创建请求
        if (methodType) {
            xhr.open(methodType, obj.url, true); //true表示异步
        } else {
            xhr.open('post', obj.url, true); //true表示异步
        }
        if (obj.contentType) {
            xhr.setRequestHeader('content-type', obj.contentType);
        }
        xhr.responseType = 'blob'; //设置返回格式
        loading.show();
        xhr.send(obj.formData);
        xhr.onload = function () {
            loading.hide();
            if (xhr.readyState == 4 && xhr.status == 200) {
                var result = xhr.response;
                if(result.type == 'application/json'){ //不期望返回结果
                    let reader = new FileReader();
                    reader.readAsText(result, 'utf-8');
                    reader.onload = function () {
                        let res = JSON.parse(reader.result);
                        if(res.msg.indexOf('至少设置一条')>-1){
                            layer.msg('页面无数据，无法导出!', {icon: 7});
                        }else{
                          layer.msg(res.msg, {icon: 7});
                        }

                    }
                }else{
                  const downloadA = document.createElement('a');
                  const blob = new Blob([result], { type: type?type:'application/vnd.ms-excel' });
                  downloadA.href = window.URL.createObjectURL(blob);
                  let defaultFileName = window.decodeURI(xhr.getResponseHeader("Content-disposition")?.split('=')[1], "UTF-8");
                  downloadA.download = obj.fileName || defaultFileName;
                  downloadA.click();
                  window.URL.revokeObjectURL(downloadA.href);
                  resolve('下载完成');
                }
            } else {
                reject('请求出错');
            }
        }
    });
}

/**
 * 函数防抖---最后一个人说了算
 * 抖动结束以后执行?
 * @param fn --执行的函数
 * @param wait --延迟时间
 * @param isImmediate --是否立即执行
 */
function lms_debounce (fn, wait, isImmediate = false) {
    var timer = null;
    var flag = true;
    return function () {
        var context = this;
        var args = arguments;
        if (timer) {
            clearTimeout(timer);
        }
        if (isImmediate) {
            if (flag) {
                fn.apply(context, args)
                flag = false
            }
            timer = setTimeout(function () {
                flag = true
            }, wait)
        } else {
            timer = setTimeout(function () {
                fn.apply(context, args)
            }, wait)
        }
        // timer = setTimeout(function(){
        //     fn.apply(_this, args);
        // }, wait);
    }
}
/**
 * 函数节流--第一个人说了算
 * timeFrame时间内只执行第一次
 * @param fn --执行的函数
 * @param timeFrame -- 时间范围
 */
function lms_throttle (fn, timeFrame) {
    var last = 0;
    return function () {
        var args = arguments;
        var _this = this;
        var now = Date.now();
        if (now - last >= timeFrame) { //超过规定的时间了
            last = now;
            fn.apply(_this, args);
        }
    }
}



//以下为通用弹框
/**
 * 图片加载错误的处理
 * @param {}
 */
function errorImgHandle (event) {
    var img = event.srcElement;
    img.src = ctx + "/static/img/kong.png";
    img.onerror = null;
}
/**
 * 销售产品管理,销售选品,商品注册等页面增加定价功能
 */
function commonSetPriceFn (data) {
    layui.use(['admin', 'form'], function () {
        var admin = layui.admin;
        var form = layui.form;
        admin.popup({
            type: 1,
            title: '定价',
            shadeClose: false,
            id: data.id,
            area: ['100%', '90%'],
            btn: ['关闭'],
            success: function (layero, index) {
                var obj = {};
                var prodSInfo = data.prodSInfo;
                //物流属性
                if (prodSInfo.logisAttrList) {
                    obj.logisAttr = prodSInfo.logisAttrList.split(',')[0];
                } else {
                    obj.logisAttr = [];
                }
                //商品成本
                obj.prodCost = Number(prodSInfo.innerPackCost || 0) + Number(prodSInfo.purchaseCostPrice || 0);
                //重量
                obj.prodWeight = Number(prodSInfo.suttleWeight || 0) + Number(prodSInfo.packWeight || 0);
                //长
                obj.wrapLength = prodSInfo.winitLength || 0;
                //宽
                obj.wrapWidth = prodSInfo.winitWidth || 0;
                //高
                obj.wrapHeight = prodSInfo.winitHeight || 0;
                //平均成本
                obj.avgCost = data.totalStock || data.reserveQty ? accDiv((Number(data.totalCostStock) + Number(data.waitDeliverCost) + Number(data.onwayCost)), (Number(data.totalStock) + Number(data.reserveQty))).toFixed(2) : ''
                //渲染弹框
                layui.view(data.id).render('route/iframe/wyt/setpriceCopy').done(function () {
                    commonReturnPromise({ url: '/lms/winitPricing/queryParams.html' }).then(function (result) {
                        var logisAttrList = result.logisAttrList; //物流属性
                        var warehouseArr = result.winitWarehouses; //万邑通仓库
                        commonRenderSelect('setpriceCopy_warehouse', warehouseArr, {
                            name: 'name',
                            code: 'id'
                        });
                        commonRenderSelect('setpriceCopy_logisticAttr', logisAttrList, {
                            name: 'name',
                            code: 'name',
                            selected: obj.logisAttr
                        });
                        layero.find('#setpriceCopy_searchForm [name=prodCost]').val(obj.prodCost);
                        layero.find('#setpriceCopy_searchForm [name=wrapLength]').val(obj.wrapLength);
                        layero.find('#setpriceCopy_searchForm [name=prodWeight]').val(obj.prodWeight);
                        layero.find('#setpriceCopy_searchForm [name=wrapWidth]').val(obj.wrapWidth);
                        layero.find('#setpriceCopy_searchForm [name=wrapHeight]').val(obj.wrapHeight);
                        layero.find('#setpriceCopy_searchForm [name=avgCost]').val(data.avgCost || ''); //平均成本
                        layero.find('#setpriceCopy_searchForm [name=registerSku]').val(data.registerSku); //注册sku
                        form.render('select');
                    })
                })
            }
        });
    })
}
/** delSameObjValue 数组对象相同值相加去重
 * arr 需要处理的数组
 * resultNum 最终计算结果的键名
 * keyName 用于计算判断的键名
 * keyValue 用于计算结果的键名 --> 对应的键值为number类型
 */
function delSameObjValue(arr, resultNum, keyName, keyValue) {
    const warp = new Map();
    arr.forEach(i => {
        let str = keyName.map(v => i[v]).join('_');
        i[resultNum] = keyValue.reduce((p, c) => p += Number(i[c]), 0);
        warp.has(str) ? warp.get(str)[resultNum] += i[resultNum] : warp.set(str, i);
    });
    return Array.from(warp).map(([, v]) => v);
};

/**
 * 订单页面详情的统一处理
 * @param {} obj
 */
function commonOrderDetailFn (data,gridOptions, platCode) {
    let platCodeArr = ['allStatusOrder','toAuditOrder','toDespatchOrder'];
    layui.use(['admin', 'form', 'laytpl'], function () {
        var admin = layui.admin;
        var form = layui.form;
        var laytpl = layui.laytpl;
        var hasDetailLayer = $('#orderDetail_detailTabs');
        var orderId = data.id;
        var lastIndex = null
        var lastColIndex = null
        var lastId = null
        // 申报价 页面
        const declaredValPageList = ['toDespatchOrder', 'allStatusOrder']
        const curPage = window.location.href.split('/').slice(-1)[0]
        data.declaredValTag = declaredValPageList.includes(curPage)
        console.log('data.orderDetails',data.orderDetails);
        data.orderDetails = (Object.prototype.toString.call(data.orderDetails) == '[object Object]' ? data.orderDetails.orderDetails : data.orderDetails).sort(function (a, b) {
            return a.availableStock - b.availableStock;
        });
        let newArr = delSameObjValue(data.orderDetails, 'allCount', ['prodSSku'], ['prodQuantity']);
        data.orderDetails.forEach((item,index) => {
          //ztt20230912-数据结构中增加prodCost,costPrice
          item.costPrice = data.costPrice || 0;
          item.prodCost = data.prodCost || 0;


            newArr.forEach(cItem => {
                if (item.prodSSku == cItem.prodSSku) {
                    item.allCount = cItem.allCount
                }
            })
        })
        data['prodSSkuOrderBy'] = data['availableStockOrderBy'] = data['allCountOrderBy'] = '';

        if (hasDetailLayer.length > 0) {
            var getTpl = $('#orderDetail_detailTab1ContainerTpl').html(),
                view = $('#orderDetail_detailTab1Container')[0];
            laytpl(getTpl).render(data, function (html) {
                view.innerHTML = html;
                form.render();

                var $layerTitle = $('#orderDetail_detailTab1Container').parents('.layui-layer.layui-layer-page').find('.layui-layer-title');
                $layerTitle.text(`订单详情 - ${data.id}`);
            });
            //渲染日志
            commonReturnPromise({
                type: 'post',
                url: '/lms/orderlog/listorderlog.html',
                params: {
                    orderId: orderId
                }
            }).then(result => {
                var getTpl2 = $('#orderDetail_detailTab2ContainerTpl').html(),
                    view2 = document.getElementById('orderDetail_detailTab2Container');
                laytpl(getTpl2).render(result, function (html) {
                    view2.innerHTML = html;
                });
            }).catch(err => {
                layer.msg(err, { icon: 2 });
            });
            //渲染平台费用-shopee
            commonReturnPromise({
              url: `/lms/platorder/getPlatFee.html?orderId=${orderId}`
            }).then(result => {
                var getTpl3 = $('#orderDetail_detailTab3ContainerTpl').html(),
                    view3 = document.getElementById('orderDetail_detailTab3Container');
                laytpl(getTpl3).render(result, function (html) {
                    view3.innerHTML = html;
                    if(Object.keys(result).length>0 && result.escrowDetail &&Object.keys(result.escrowDetail).length>0){
                      $('#orderDetail_detailTabs li.platFee').removeClass('disNI');
                    }else{
                      $('#orderDetail_detailTabs li.platFee').addClass('disNI');
                    }
                });
            }).catch(err => {
              var getTpl3 = $('#orderDetail_detailTab3ContainerTpl').html(),
              view3 = document.getElementById('orderDetail_detailTab3Container');
              laytpl(getTpl3).render({}, function (html) {
                  view3.innerHTML = html;
                  $('#orderDetail_detailTabs li.platFee').addClass('disNI');
              });
            });
            //ztt20240104-渲染合单明细
            commonReturnPromise({
              url: `/lms/platorder/getMergeOrderInfo.html?orderId=${orderId}`
            }).then(result => {
                var getTpl4 = $('#orderDetail_detailTab4ContainerTpl').html(),
                    view4 = document.getElementById('orderDetail_detailTab4Container');
                laytpl(getTpl4).render(result, function (html) {
                    view4.innerHTML = html;
                });
            }).catch(err => {
              var getTpl4 = $('#orderDetail_detailTab4ContainerTpl').html(),
              view4 = document.getElementById('orderDetail_detailTab4Container');
              laytpl(getTpl4).render({}, function (html) {
                  view4.innerHTML = html;
              });
            });
        } else {
            layer.open({
                type: 1,
                title: '订单详情 - ' + orderId,
                offset: 'b',
                maxmin: true,
                shade: false,
                id: orderId,
                area: ['100%', '40%'],
                success: function (layero, index) {
                    // console.log('id', data.id)
                    layui.view(data.id).render('route/iframe/order/orderDetail').done(function () {
                        var getTpl = layero.find('#orderDetail_detailTab1ContainerTpl').html(),
                            view = layero.find('#orderDetail_detailTab1Container')[0];
                        // console.log('get', getTpl)
                        laytpl(getTpl).render(data, function (html) {
                            view.innerHTML = html;
                            form.render();
                        });
                        //渲染日志
                        commonReturnPromise({
                            type: 'post',
                            url: '/lms/orderlog/listorderlog.html',
                            params: {
                                orderId: orderId
                            }
                        }).then(result => {
                            var getTpl2 = layero.find('#orderDetail_detailTab2ContainerTpl').html(),
                                view2 = layero.find('#orderDetail_detailTab2Container')[0];
                            laytpl(getTpl2).render(result, function (html) {
                                view2.innerHTML = html;
                            });
                        }).catch(err => {
                            layer.msg(err, { icon: 2 });
                        });
                        //渲染平台费用-shopee
                        commonReturnPromise({
                          url: `/lms/platorder/getPlatFee.html?orderId=${orderId}`
                        }).then(result => {
                            var getTpl3 = $('#orderDetail_detailTab3ContainerTpl').html(),
                                view3 = document.getElementById('orderDetail_detailTab3Container');
                            laytpl(getTpl3).render(result, function (html) {
                                view3.innerHTML = html;
                                if(Object.keys(result).length>0 && result.escrowDetail &&Object.keys(result.escrowDetail).length>0){
                                  layero.find('#orderDetail_detailTabs li.platFee').removeClass('disNI');
                                }else{
                                  layero.find('#orderDetail_detailTabs li.platFee').addClass('disNI');
                                }
                            });
                        }).catch(err => {
                          var getTpl3 = $('#orderDetail_detailTab3ContainerTpl').html(),
                          view3 = document.getElementById('orderDetail_detailTab3Container');
                          laytpl(getTpl3).render({}, function (html) {
                              view3.innerHTML = html;
                              layero.find('#orderDetail_detailTabs li.platFee').addClass('disNI');
                          });
                        });
                        //ztt20240104-渲染合单明细
                        commonReturnPromise({
                          url: `/lms/platorder/getMergeOrderInfo.html?orderId=${orderId}`
                        }).then(result => {
                            var getTpl4 = $('#orderDetail_detailTab4ContainerTpl').html(),
                                view4 = document.getElementById('orderDetail_detailTab4Container');
                            laytpl(getTpl4).render(result, function (html) {
                                view4.innerHTML = html;
                            });
                        }).catch(err => {
                          var getTpl4 = $('#orderDetail_detailTab4ContainerTpl').html(),
                          view4 = document.getElementById('orderDetail_detailTab4Container');
                          laytpl(getTpl4).render({}, function (html) {
                              view4.innerHTML = html;
                          });
                        });
                    })
                    this.sortby = function(e){
                        data = $(e.target).parents('div').find('[name=allDetailData]').val()!=''?JSON.parse($(e.target).parents('div').find('[name=allDetailData]').val()):[];
                        var type = $(e.target).data('orderby').split(' ')[1],orderby = $(e.target).data('orderby').split(' ')[0];
                        data['prodSSkuOrderBy'] = data['availableStockOrderBy'] = data['allCountOrderBy'] = '';
                        data[type + 'OrderBy'] = orderby
                        if(orderby == 'asc' && type != 'prodSSku'){
                            data.orderDetails.sort(function(a,b){
                                return a[type] - b[type]
                            })
                        }else if(orderby == 'asc' && type == 'prodSSku'){
                            data.orderDetails.sort(function(a,b){
                                return a[type].localeCompare(b[type])
                            })
                        }else if(orderby == 'desc' && type != 'prodSSku'){
                            data.orderDetails.sort(function(a,b){
                                return b[type] - a[type]
                            })
                        }else if(orderby == 'desc' && type == 'prodSSku'){
                            data.orderDetails.sort(function(a,b){
                                return b[type].localeCompare(a[type])
                            })
                        }

                        var getTpl = layero.find('#orderDetail_detailTab1ContainerTpl').html(),
                            view = layero.find('#orderDetail_detailTab1Container')[0];
                        laytpl(getTpl).render(data, function (html) {
                            view.innerHTML = html;
                            form.render();
                        });
                    }
                    this.upDownKeyDown = function(event) {
                        if(gridOptions && (event.keyCode===38 || event.keyCode===40)){
                            let curCell = gridOptions.api.getFocusedCell()
                            // 如果弹窗未关闭，鼠标点击其它地方，cell的选中效果就会没有，所以添上cell选中的效果
                            let rowIndex = lastIndex
                            let colIndex = lastColIndex
                            if(curCell){
                                rowIndex = curCell.rowIndex
                                colIndex = curCell.column.instanceId
                            }
                            let curData = null
                            gridOptions.api.forEachLeafNode(function(node,index){
                                    if(index==rowIndex){
                                        curData = node.data
                                    }
                            })
                            const firstCol = gridOptions.columnApi.getAllDisplayedColumns()[colIndex]
                            gridOptions.api.setFocusedCell(rowIndex, firstCol)
                            if (lastId != curData.id) {
                                if(platCode && platCodeArr.includes(platCode)){
                                  curData.showLogisAttrList = true;
                                  curData.showSale = true;
                                }
                                commonOrderDetailFn(curData, gridOptions)
                            }
                            if(curCell){
                                lastIndex = curCell.rowIndex
                                lastColIndex = curCell.column.instanceId
                            }
                            lastId = curData.id
                        }
                    };
                    $(document).on('click','.layui-edge', this.sortby); //监听排序
                    $(document).on('keydown', this.upDownKeyDown); //监听键盘事件，关闭层
                },
                end:function(){
                    $(document).off('click','.layui-edge', this.sortby); //监听排序
                    $(document).off('keydown', this.upDownKeyDown); //解除键盘关闭事件
                    gridOptions.api.clearFocusedCell()
                }
            });
        }
    })
}


//首页查找货源小工具
function handleFindSource(){
  layui.use(['admin', 'laytpl'], function () {
    var admin = layui.admin;
    var laytpl = layui.laytpl;
    layer.open({
        type: 1,
        id: Date.now(),
        title: '查找货源',
        area: ['80%', '90%'],
        move: false,
        success: function(layero, index) {
          layui.view(this.id).render('route/iframe/amazon/findSource').done(function () {
            var getTpl = layero.find('#index1_findSource_layer').html(),
                view = layero.find('#findSourceContainer')[0];
            laytpl(getTpl).render({}, function (html) {
                view.innerHTML = html;
                //黏贴图片上传
                new UploadImage('findSource_editImg', ctx + '/preProdDev/getBase64Img.html').upload(function(xhr) { // 上传完成后的回调
                  succUploadImg(this, xhr)
                });
                //查找货源事件
                layero.find('.findSourceBtn').on('click', function(){
                  //获取到input输入的图片链接
                  let inputUrl = layero.find('#findSource_inputImageEl').val().trim();
                  //获取到黏贴框的图片链接
                  let divUrl = layero.find('#findSource_editImg img').attr('src');
                  //整合链接
                  let imgUrl = inputUrl || divUrl;
                  //如果输入框没有链接
                  layero.find('#findSource_editImg').empty().append(`<img src="${imgUrl}">`);
                  //监听del事件
                  layero.find('#findSource_editImg')[0].addEventListener("keydown", function (e) {
                    // 检测是否按下的是删除键
                    if(e.keyCode == 8 || e.keyCode == 46){
                      layero.find('#findSource_editImg').empty();
                    }
                  });
                  window.open('https://www.1688.com?pordUrl=' + imgUrl)
                  //调用事件
                  // commonReturnPromise({
                  //   url: '/lms/prodhotsale/searchSimilar',
                  //   type: 'post',
                  //   contentType: 'application/json',
                  //   params: JSON.stringify({
                  //     picUrl: imgUrl,
                  //     page: 1
                  //   })
                  // }).then(res => {
                  //   let $str = $('<div style="padding:20px;"></div>');
                  //   let $ul = $('<ul style="display: flex;justify-content: start;flex-wrap: wrap;"></ul>');
                  //   for(let i=0; i< res.length; i++){
                  //     let item= res[i];
                  //     let $li = $(`<li class="searchSupply-li">
                  //       <a target="_blank" href="${item.detailUrl}">
                  //       <img width="120" height="120" data-original="${item.imageUrl}" class="img_show_hide b1 lazy" data-onerror="layui.admin.img_noFind()" />
                  //       </a>
                  //       <div class="searchSupply-li-div">
                  //         <div><span class="gray">价&nbsp;&nbsp;&nbsp;格:</span> ${(item.oldPrice/100).toFixed(2)}</div>
                  //         <div><span class="gray">起购量:</span> ${item.quantityBegin}</div>
                  //         <div><span class="gray">地&nbsp;&nbsp;&nbsp;址:</span> ${item.province} ${item.city}</div>
                  //       </div>
                  //       </li>`);
                  //     $ul.append($li);
                  //   }
                  //   $str.append($ul);
                  //   $('#findSource_imageInfoView').empty().append($str);
                  //   imageLazyload();
                  //   imageLazyloadOrigin();
                  // });
                });
            });
          });
        }
    });
  });
}

/**
 * 以图搜图
 */
function checkRepeat(self, formDom) {
    let url = $(self).prev().val()
    if (!url) {
        layer.msg('请输入商品链接！')
        return
    }
    $.ajax({
        type: "post",
        url: ctx + "/preProdDev/queryRepeatedUrl.html",
        data: JSON.stringify({
            url: url
        }),
        contentType: 'application/json',
        dataType: "json",
        success: function(returnData) {
            if (returnData.code == "0000") {
                $('#' + formDom).find('.repeatDev').removeClass('disN')
                let skuStr = returnData.data?.join(',') || ''
                $('#' + formDom).find('.repeatSku').text(skuStr)
            } else {
                layer.msg(returnData.msg);
            }
        }
    });
}
var filterImgList = []
var tortTypeList = []
function handleSearchImage(type = '', btnEl = '',succBack) {
    localStorage.removeItem('cropImgUrl')
    baseDataURL = ''
    layui.use(['admin', 'form', 'laytpl'], function () {
        var admin = layui.admin;
        var form = layui.form;
        var laytpl = layui.laytpl;
        layer.open({
            type: 1,
            id: Date.now(),
            title: '以图搜图',
            area: ['80%', '90%'],
            move: false,
            success: function(layero, index) {
                /**
                 * 列举侵权类型
                 */
                $.ajax({
                    type: "post",
                    url: ctx + "/tort/prodTortTypeList.html",
                    dataType: "json",
                    success: function(returnData) {
                        if (returnData.code == "0000") {
                            tortTypeList = returnData.data || []
                        } else {
                            layer.msg(returnData.msg);
                        }
                    }
                });
                layui.view(this.id).render('route/iframe/amazon/searchImage').done(function () {
                    var getTpl = layero.find('#index1_searchImage_layer').html(),
                        view = layero.find('#searchImageContainer')[0];
                    laytpl(getTpl).render({}, function (html) {
                        view.innerHTML = html;
                        form.render();

                        if (type == 'showDevelopNew') {
                            $('#developNew').show();
                        }
                        // 获取OA新类目
                        let oaCateList = []
                        commonReturnPromise({
                            type: "get",
                            url: ctx + "/prodCateOa/get/cate/tree",
                            contentType:"application/json"
                        }).then(res => {
                            let list = JSON.parse(res)
                            list?.forEach(item => {
                                let obj = {
                                    label: item.title,
                                    value: item.value
                                }
                                oaCateList.push(obj)
                            })
                            appendSelect($('#searchIamgeForm').find('select[name="oaCate"]'), oaCateList, 'value', 'label')
            
                            form.render()
                        })

                        if (btnEl) {
                            $(btnEl).removeClass('keyHandle');
                        }
            
                        $('#inputImageEl').on('keydown', function(event) {
                            if(event.keyCode == 13) {
                                document.querySelector('#cropImg').src = $('#inputImageEl').val();
                                baseDataURL = $('#inputImageEl').val();
                            }
                        })          
                        new UploadImage('edit-img', ctx + '/preProdDev/getBase64Img.html').upload(function(xhr) { // 上传完成后的回调
                             succUploadImg(this, xhr)
                         })     
                         
                         window.addEventListener('message', receiveMessageFromUploadImgPage, false);

                        if (succBack) {
                            succBack()
                        }
                        // 监听产品来源和产品状态 
                        form.on('checkbox(search_img_chk)', function(e) {
                            let obj = filterSearchImg(visibleImageList)
                            laytpl($("#imageItemLayer").html()).render(obj, function (html) {
                                $("#imageInfo").html('')
                                $("#imageInfo").html(html);
                                form.render();
                            })
                        })
                    });
                })

                this.enterEsc = function(event) {
                    if (event.keyCode === 13) {
                        return false; //阻止系统默认回车事件
                    }
                };
                $(document).on('keydown', this.enterEsc); //监听键盘事件，关闭层
            },
            end: function() {
                localStorage.removeItem('cropImgUrl')
                if (btnEl) {
                    $(btnEl).addClass('keyHandle');
                }
                $(document).off('keydown', this.enterEsc); //解除键盘关闭事件
            }
        })
    })
}
function filterSearchImg(list) {
    let el = document.getElementsByName('original')
    let elSale = document.getElementsByName('sale')
    let checkVal = []
    let checkSaleVal = []
    for (k in el) {
        if (el[k].checked) {
            checkVal.push(el[k].value)
        }
    }
    for (k in elSale) {
        if (elSale[k].checked) {
            checkSaleVal.push(elSale[k].value)
            $(elSale[k]).attr('other') && checkSaleVal.push($(elSale[k]).attr('other'))
        }
    }
    if (checkVal?.length == 0 && checkSaleVal?.length == 0) {
        filterImgList = list
    } else {
        filterImgList = list.filter(item => {
            let originBool = checkVal?.length === 0 ? true : checkVal.includes(String(item.original))
            let saleBool = checkSaleVal?.length === 0 ? true : checkSaleVal.includes(String(item.saleStatus))
            return originBool && saleBool
        })
    }
    let obj = {
        data: filterImgList
    }
    return obj

}
function receiveMessageFromUploadImgPage(event) {
    if (event.data?.name === 'imageHtmlPaste') {
        baseDataURL = $('#edit-img img').attr('src')
        $('#cropImg').attr('src', baseDataURL)
        $('#edit-img').html('')
    }
}

function receiveMessageFromUploadImgPage1(event) {
    if (event.data?.name === 'imageHtmlPaste') {
        baseDataURL = $('#edit-img1 img').attr('src')
        $('#cropImg1').attr('src', baseDataURL)
        $('#edit-img1').html('')
    }
}

function succUploadImg(self, xhr, dom='cropImg') {
    console.log('粘贴图片=====', xhr.responseText)
    if (xhr.responseText == '') {
        layer.msg('上传出错!')
    }else {
        $('#' + dom).attr('src', xhr.responseText)
        baseDataURL = xhr.responseText
        $(self).empty()
    }
}

//以图搜图设为重复-ztt20230817
function commonSetImgRepeatHandle(id,repeatPSku){
  commonReturnPromise({
    url: '/lms/prodhotsale/resetRepeatPSku',
    type: 'post',
    contentType: 'application/json',
    params: JSON.stringify({
      id: id,
      repeatPSku: repeatPSku
    })
  }).then(res=> {
    layer.msg(res || '操作成功', {icon: 1});
  })
}

// 以图搜图 开发新品
function handleDevelopNew() {
    let lastCropImg = $('#cropImg').attr('src')
    localStorage.setItem('cropImgUrl', lastCropImg)
    if (!lastCropImg) {
        return layer.msg('当前没有图片！')
    }
    $('#newdevelop_NewdevelopBtn').click()
}

// 以图搜图 本地上传图片
function uploadImage() {
    document.querySelector('#imgReader').click()
}

// 以图搜图 原图库搜索
function handleSearchOrigin() {
    searchImage(false);
};

// 以图搜图 一键复制所有sku
function handleCopy(copyDom='hideCopy') {
    let skuList = []
    searchImageList?.forEach(item => {
        if (item.original == 1 || item.original == 3) {
            item.psku && skuList.push(item.psku)
        }
        if (item.original == 2 || item.original == 4) {
            item.ssku && skuList.push(item.ssku)
        }
    })
    // sku 去重
    skuList = Array.from(new Set(skuList))
    $('#' + copyDom).attr('value', skuList.join(',')).show()
    $('#' + copyDom).select()
    document.execCommand('copy')
    $('#' + copyDom).hide()
}

function loadingImg(event, cropImgDom='cropImg') {
    // 读取上传文件
    let reader = new FileReader();
    let file = event?.target.files[0]
    if (file) {
        var formData = new FormData();
        formData.append('file', file);

        $.ajax({
            url: ctx + "/prodImageAliyun/uploadPic.html",
            data: formData,
            type: "POST",
            async: true,
            cache: false,
            contentType: false,
            processData: false,
            dataType: 'json',
            beforeSend: function () {
                loading.show();
            },
            success: function (res) {
                loading.hide();
                if (res.code == '0000') {
                    document.querySelector('#' + cropImgDom).src = res?.msg;  
                    baseDataURL = res?.msg;
                    if (!res?.msg) {
                        // readAsDataURL方法可以将File对象转化为data:URL格式的字符串（base64编码）
                        reader.readAsDataURL(event.target.files[0]);
                        reader.onload = (e)=>{
                            let dataURL = reader.result;
                            //将img的src改为刚上传的文件的转换格式
                            document.querySelector('#' + cropImgDom).src = dataURL;  
                        }
                    }
                } else {
                    layer.msg(res.msg, { icon: 2 });
                }
            },
            error: function (error) {
                loading.hide();
                layer.msg(`${error.statusText}`, { icon: 2 });
            }
        })
    }
}

var baseDataURL = ''

function croppingImage(obj, editImgDom='edit-img', cropImgDom='cropImg', croppingDom='croppingImg') {
    let url = $(obj).prev().attr('src') || $('#' + editImgDom + ' img').attr('src')
    if (!url) {
        layer.msg('缺少图片进行框选')
        return
    }
    layer.open({
        type: 1,
        title: '',
        area: ['600px', '500px'],
        btn: ['确认', '取消'],
        move:false,
        content: $('#index1_cropImage_layer').html(),
        success: function() {
            document.querySelector('#' + croppingDom).src = url;
            $('#' + croppingDom).cropper({
                viewMode:0,
                minContainerWidth: 400,
                minContainerHeight: 400,
                dragMode:'move'
            })
        },
        yes: function(index, layero) {
            baseDataURL = $('#' + croppingDom).cropper('getCroppedCanvas').toDataURL('image/png')
            $('#' + cropImgDom).prop('src', baseDataURL)
            layer.close(index);
        }
    })
}

// 搜索图片
function searchImage(ifNew, containerId, viewId, cropImgDom='cropImg') {
    // 将框选后的图片 base64 转成 url
    let reg = /^\s*data:([a-z]+\/[a-z0-9-+.]+(;[a-z-]+=[a-z0-9-]+)?)?(;base64)?,([a-z0-9!$&',()*+;=\-._~:@\/?%\s]*?)\s*$/i;
    // 判断图片是BASE64还是图片链接
    if(reg.test(baseDataURL)) {
        loading.show();
        let obj = {
            base64: baseDataURL.split(";base64,")[1],
            source:"zh",
            target:"en"
        };
        commonReturnPromiseRes({
            isLoading: true,
            type: 'POST',
            contentType: 'application/json;charset=UTF-8',
            url: `${ctx}/imageProcess/imageTranslateByBase64`,
            params:JSON.stringify(obj)
        }).then(res => {
            loading.hide()
            if (res.code == "0000") {
                baseDataURL = res?.data;
                $('#' + cropImgDom).prop('src', res?.data)
                handleSearch(ifNew, containerId, viewId);
            }else{
                layer.alert(res.msg,{icon:2})
            }
        }).catch(err => {
            loading.hide()
            layer.alert(err,{icon:2})
        })
    } else {
        handleSearch(ifNew, containerId, viewId)
    }
}

// 将图片 url 转为 file
function urlToFile(url, filename) {
    return new Promise((resolve, reject) => {
      loading.show();
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url);
      xhr.responseType = 'blob';
  
      xhr.onload = () => {
        if (xhr.status === 200) {
          const blob = xhr.response;
          const file = new File([blob], filename);
          loading.hide();
          resolve(file);
        } else {
          loading.hide();
          reject(new Error('Failed to download file'));
        }
      };
      xhr.onerror = () => {
        loading.hide();
        reject(new Error('Failed to download file'));
      };
      xhr.send();
      
    });
  }

var searchImageList = []
var visibleImageList = []
function handleSearch(ifNew = false, containerId="imageItemLayer", viewId="imageInfo") {
    var admin = layui.admin;
    var form = layui.form;
    var laytpl = layui.laytpl;
    let categoryId = $('#searchIamgeForm select[name=oaCate]').val();
    if (!baseDataURL) {
        return layer.msg('请先上传图片！')
    }
    // 清空产品来源和产品状态
    $('input[name=original]').each(function() {
        $(this).attr('checked', false);
    })
    $('input[name=sale]').each(function() {
        $(this).attr('checked', false);
    })
    const fileName = 'image.jpg'; // 文件名
    urlToFile(baseDataURL, fileName)
    .then((file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('categoryId', categoryId ? Number(categoryId) : '');
        // 在这里可以使用File对象进行后续操作，例如上传文件等
        $.ajax({
            url: ctx + "/prodImageAliyun/queryImageByFile",
            data: formData,
            type: "POST",
            async: true,
            cache: false,
            contentType: false,
            processData: false,
            dataType: 'json',
            beforeSend: function () {
                loading.show();
            },
            success: function (res) {
                loading.hide();
                if (res.code == '0000') {
                    // res.data = res.data.concat(res.data).concat(res.data).concat(res.data).concat(res.data)
                    searchImageList = res.data || []
                    searchImageList.forEach(item => {
                        if (item.isSale == '0') {
                            item.saleStatus = 0
                        }
                        if (item.isSale && item.isSale !== '0') {
                            item.saleStatus = 1
                        }
                    })
                    visibleImageList = searchImageList.slice(0, 9) || []
                    var startIndex = 0; // 当前展示数据的起始索引
                    var endIndex = 9; // 当前展示数据的结束索引
                    let result = {
                        data: res.data.slice(startIndex, endIndex),
                        searchImageList
                    }
                    laytpl($("#"+ containerId).html()).render(result, function (html) {
                        $("#"+ viewId).html(html);
                        form.render();
                    })
                    var divElement = $("#"+ viewId)
                    divElement[0].addEventListener('scroll', function() {
                        // 检查滚动条是否到达底部
                        if (divElement[0].scrollTop + divElement[0].clientHeight >= divElement[0].scrollHeight) {
                            // 滚动条到达底部的逻辑
                            // 更新索引
                            startIndex += 9;
                            endIndex += 9;
                            // result = {
                            //     data: res.data.slice(startIndex, endIndex)
                            // }
                            visibleImageList = res.data.slice(0, endIndex)
                            result = filterSearchImg(res.data.slice(startIndex, endIndex))
                            laytpl($("#"+ containerId).html()).render(result, function (html) {
                                $("#"+ viewId).append(html);
                                form.render();
                            })
                            // 判断是否已展示完全部数据
                            if (endIndex >= res.data.length) {
                                // 数据已全部展示完毕，移除滚动事件监听器
                                console.log('展示完毕')
                                divElement[0].removeEventListener('scroll', arguments.callee);
                            }
                        }
                    })
                }
            },
            error: function (error) {
                loading.hide();
                layer.msg(`${error}`, { icon: 2 });
            }
        })
    })
    .catch((error) => {
        console.error(error);
    });

}

function getSite(status) {
    let obj = {
        1: '全站点',
        11: 'wish',
        12: 'ebay',
        13: 'aliexpress',
        14: 'joom',
        15: 'amazon',
        16: 'shopee',
    }
    return obj[status] || ''
}

function getReason(reason) {
    let result = ''
    tortTypeList.forEach(item => {
        if (item.code == reason) {
            result = item.name
        }
    })
    return result
}

 //填充下拉框
 function appendSelect(aDom, data, code, label, attachment) {
    aDom.empty();
    var option = '<option value="">请选择</option>'
    for (var i in data) {
        if (typeof data[i] !== 'string') {
            attachment ?
                data[i].code = data[i][code] + '_' + data[i][attachment] :
                data[i].code = data[i][code].toString() || data[i].code
            data[i].label = data[i][label] || data[i].label;
        }
        option += '<option value="' + (typeof data[i].code!='undefined'?data[i].code:data[i]) + '">' + (data[i].label || data[i]) + '</option>'
    }
    aDom.append(option)
}


    // 订单页面 amazon邮件
    /**
     *
     * @param tableConfig table
     */
    function orderAmazonEmail(tableConfig) {
        // 获取选中数据
        const curOrders = tableConfig.api.getSelectedRows()
        if (curOrders.length) {
            const { form, view } = layui
            let amazonOrders = curOrders.filter(item => item.platCode === "amazon")
            if (amazonOrders.length && amazonOrders.length === curOrders.length) {
                let orderIds = amazonOrders.map(item => Number(item.id))
                let _emailTemplateNameList = []
                layer.open({
                    type: 1,
                    title: "发送邮件",
                    btn: ["发送", "取消"],
                    area: ["700px", "500px"],
                    id: Date.now(),
                    success: function () {
                        view(this.id)
                            .render("route/iframe/order/orderAmazonEmail")
                            .done(function () {
                            var app = new Vue({
                                el: "#orderAmazonEmailForm",
                                data: {
                                emailTypeList: [],
                                emailTemplateNameList: null,
                                },
                                mounted() {
                                    let that = this
                                    // 获取邮件模板类型
                                    commonReturnPromise({
                                        url: "/lms/amazonMessageController/findEmailByOrderId",
                                        type: "post",
                                        params: JSON.stringify(orderIds),
                                        contentType: 'application/json'
                                    }).then(res => {
                                        that.emailTypeList = res
                                        setTimeout(() => form.render(), 0)
                                    })
                                    // 获取邮件模板列表
                                    form.on("select(orderAmazonEmailForm_emailType)", function (data) {
                                        commonReturnPromise({
                                        url: "/lms/amazonMessageController/findTemplateNameByTypeName",
                                        params: { typeName: data.value }
                                        }).then(res => {
                                        that.emailTemplateNameList = res
                                        _emailTemplateNameList = res
                                        setTimeout(() => form.render(), 0)
                                        })
                                    })
                                    // 获取邮件正文
                                    form.on("select(orderAmazonEmailForm_emailTemplateName)", function (data) {
                                        commonReturnPromise({
                                        url: "/lms/amazonMessageController/findEmailTemplateByTemplateId",
                                        params: { templateId: data.value }
                                        }).then(res => {
                                            if(res.emailContent !== undefined){
                                                $('#orderAmazonEmailForm').find('textarea[name=emailContent]').val(res.emailContent)
                                            }
                                        })
                                    })
                                },
                            })
                        })
                    },
                    yes: function (index, layero) {
                    let formData = serializeObject($("#orderAmazonEmailForm"))
                    if (formData.emailType === "") {
                        return layer.msg("请选择模板类型")
                    } else if ( formData.emailTemplateName === "") {
                        return layer.msg("请选择模板名称")
                    } else if (formData.sendType === undefined || formData.sendType === "") {
                        return layer.msg("请选择联系原因")
                    } else if (formData.emailContent === "") {
                        return layer.msg("请输入正文")
                    }
                    formData.emailTemplateName = _emailTemplateNameList.filter(item=>item.id.toString()===formData.emailTemplateName)[0].name
                    commonReturnPromise({
                        url: "/lms/amazonMessageController/sendMailByOrderId",
                        type: "post",
                        contentType: "application/json",
                        params: JSON.stringify({ orderIds, ...formData }),
                    }).then(res => {
                        layer.msg(res || "操作成功", { icon: 1 })
                        layer.close(index)
                    })
                    },
                })
            } else {
            return layer.msg("存在非Amazon订单，无法处理！", { icon: 7 })
            }
        } else {
            return layer.msg("请勾选一笔订单", { icon: 7 })
        }
    }

// 订单页面 ebay邮件
/**
 *
 * @param tableConfig table
 */
function orderEbayEmail(tableConfig,layuiTableId) {
    // 获取选中数据
    // const curOrders = tableConfig.api.getSelectedRows()
    let curOrders;
    if(tableConfig == '' && layuiTableId != undefined){
        curOrders = layui.table.checkStatus(layuiTableId).data
    }else{
        curOrders = tableConfig.api.getSelectedRows()
    }
    if (curOrders.length) {
        const { form, view } = layui
        let amazonOrders = curOrders.filter(item => item.platCode === "ebay")
        if (amazonOrders.length && amazonOrders.length === curOrders.length) {
            let orderIds = amazonOrders.map(item => Number(item.id))
            let _emailTemplateNameList = []
            layer.open({
                type: 1,
                title: "发送邮件",
                btn: ["发送", "取消"],
                area: ["700px", "500px"],
                id: Date.now(),
                success: function () {
                    view(this.id)
                        .render("route/iframe/order/orderEbayEmail")
                        .done(function () {
                        var app = new Vue({
                            el: "#orderEbayEmailForm",
                            data: {
                            emailTypeList: [],
                            emailTemplateNameList: null,
                            },
                            mounted() {
                                let that = this
                                // 获取邮件模板类型
                                commonReturnPromise({
                                    url: "/lms/ebaysellerinr/batchSendEmailPage",
                                    type: "get",
                                    // params: JSON.stringify(orderIds),
                                    contentType: 'application/json'
                                }).then(res => {
                                    that.emailTypeList = res
                                    setTimeout(() => form.render(), 0)
                                })
                                // 获取邮件模板列表
                                form.on("select(orderEbayEmailForm_emailType)", function (data) {
                                    commonReturnPromise({
                                    url: "/lms/ebaysellerinr/findTemplateNameByTypeName",
                                    params: { typeName: data.value }
                                    }).then(res => {
                                    that.emailTemplateNameList = res
                                    _emailTemplateNameList = res
                                    setTimeout(() => form.render(), 0)
                                    })
                                })
                                // 获取邮件正文
                                form.on("select(orderEbayEmailForm_emailTemplateName)", function (data) {
                                    commonReturnPromise({
                                    url: "/lms/ebaysellerinr/findEmailTemplateByTemplateId",
                                    params: { templateId: data.value }
                                    }).then(res => {
                                        if(res.emailContent !== undefined){
                                            $('#orderEbayEmailForm').find('textarea[name=emailContent]').val(res.emailContent)
                                        }
                                        if(res.emailSubject !== undefined){
                                            $('#orderEbayEmailForm').find('input[name=subject]').val(res.emailSubject)
                                        }
                                    })
                                })
                            },
                        })
                    })
                },
                yes: function (index, layero) {
                let formData = serializeObject($("#orderEbayEmailForm"))
                if (formData.emailType === "") {
                    return layer.msg("请选择模板类型")
                } else if ( formData.emailTemplateName === "") {
                    return layer.msg("请选择模板名称")
                } else if (formData.subject=== "") {
                    return layer.msg("请输入标题")
                } else if (formData.emailContent === "") {
                    return layer.msg("请输入正文")
                }
                formData.emailTemplateName = _emailTemplateNameList.filter(item=>item.id.toString()===formData.emailTemplateName)[0].name
                formData.platOrderMainDtoList = []

                amazonOrders && amazonOrders.forEach(item => {
                    let params = {};
                    params.id = Number(item.id);
                    params.storeAcctId = item.storeAcctId || ''
                    params.buyerUserId = item.buyerUserId || ''
                    item.orderDetails && item.orderDetails.forEach(cItem => {
                        let itemParams = {};
                        let dtList = [];
                        itemParams.itemId = cItem.itemId;
                        dtList.push(itemParams);
                        params.dtList = dtList;
                    });
                    formData.platOrderMainDtoList.push(params);
                })
                commonReturnPromise({
                    url: "/lms/ebaysellerinr/batchSendMail",
                    type: "post",
                    contentType: "application/json",
                    params: JSON.stringify({ ...formData }),
                }).then(res => {
                    layer.msg(res || "操作成功", { icon: 1 })
                    layer.close(index)
                })
                },
            })
        } else {
        return layer.msg("存在非eBay订单，无法处理！", { icon: 7 })
        }
    } else {
        return layer.msg("请勾选一笔订单", { icon: 7 })
    }
}

/**
 * 统一的全选和反全选功能[所有参数必填,必须使用layui的checkbox]
 * @param {string} obj.container 容器[jq的dom元素]
 * @param {string} obj.parentClass 父checkbox的class值,filter必须存在
 * @param {string} obj.sonClass 子checkbox的class值
 */
function commonSelectAllAndInvert (obj) {
    layui.use(['form'], function () {
        var form = layui.form;
        try {
            //解构[字段要都存在,而且不能为空]
            let { container, parentClass, sonClass } = obj;
            //获取到所有的子checkbox
            let allSonCheckboxes = container.find(`.${sonClass}`);
            //子checkbox的length
            let allSonCheckboxLen = allSonCheckboxes.length;
            //获取到lay-filter值
            let parentFilter = container.find(`.${parentClass}`).attr('lay-filter');
            //[全选checkbox]layui的表单监听选中
            form.on(`checkbox(${parentFilter})`, function (data) {
                if (data.elem.checked) {
                    allSonCheckboxes.each(function (index, item) {
                        $(item).prop('checked', true);
                    });
                } else {
                    allSonCheckboxes.each(function (index, item) {
                        $(item).prop('checked', false);
                    });
                }
                form.render('checkbox');
            });
            //[单个checkbox的监听操作]子checkbox全选-反选父checkbox
            container.on('click', '.layui-form-checkbox', function () {
                let $inputs = container.find(`input.${sonClass}:checked`);
                if ($inputs.length < allSonCheckboxLen) {
                    $(`input.${parentClass}`).prop('checked', false);
                } else if ($inputs.length == allSonCheckboxLen) {
                    $(`input.${parentClass}`).prop('checked', true);
                }
                form.render('checkbox');
            });
        } catch (err) {
            console.log(err);
        }
    });
}

/**
 * 指定select添加
 * @param aDom dom对象
 * @param data 数据
 * @param code option标签的 value值
 * @param label option标签展示的值
 * @param defaultOpts option默认值,有才取用
 */
function selectAppendDataThenRender (aDom, data, code, label, defaultOpts) {
    $(aDom).empty();
    var option = '<option value="">请选择</option>'
    if(defaultOpts == ''){
      option = '';
    }
    for (var i in data) {
        if (typeof data[i] !== 'string') {
            data[i].code = data[i].code || data[i][code]
            data[i].label = data[i][label] || data[i].label;
        }
        option += '<option value="' + (typeof data[i].code != 'undefined' ? data[i].code : data[i]) + '">' + (data[i].label || data[i]) + '</option>'
    }
    $(aDom).append(option)
}


/**
 * 通用删除功能
 * @param {Dom} self ---元素自身,取this
 */
function imgRemove_handleFn (self) {
    $(self).parents('.commonImg-imgsChild').remove()
}

/**
 * 函数: 网络图片上传
 * @param {String} obj.imgBtn --网络图片按钮,唯一性,不可重名{可class/ID,#id, .class}
 * @param {String} obj.imgContainer --图片容器,唯一性,不可重名{不区分本地还是网络图片,#id, .class}
 * @param {String} obj.max --最大图片数量{不区分本地还是网络图片}
 * @param {String} obj.isAuto -- 按钮是不是动态增加的,就是相同的图片容器有多个
 * @param {String} obj.btnAndImgParent -- 只有isAuto=true才有这个字段,图片和按钮共同容器
 */
function netImg_handleFn (obj) {
    var maxImgCount = obj.max;
    //默认不是动态增加,按钮和图片不具有统一的父元素,且存在多套
    var obj = Object.assign({ isAuto: false, btnAndImgParent: '' }, obj);
    //网络图片的点击事件
    var netImgLayer = `
        <div style="padding:20px;">
            <textarea placeholder="一行一个,多个回车分隔" class="layui-textarea"></textarea>
        </div>
    `;
    $('body').on('click', obj.imgBtn, function (event) {
        var _this = this;
        //获取到已存在的图片数量
        var existCount = 0;
        if (obj.isAuto) {
            if (!obj.btnAndImgParent) {
                return layer.msg('动态增加套图必须传递字段btnAndImgParent');
            }
            existCount = $(_this).parents(obj.btnAndImgParent).find(obj.imgContainer).find('.commonImg-imgsChild').length;
        } else {
            existCount = $(obj.imgContainer).find('.commonImg-imgsChild').length;
        }
        if (existCount >= maxImgCount) {
            return layer.msg(`最多只允许${maxImgCount}张图片`, { icon: 7 });
        }
        layer.open({
            type: 1,
            title: '网络图片',
            area: ['600px', '400px'],
            content: netImgLayer,
            id: `${obj.imgContainer.slice(1)}LayerId`,
            btn: ['保存', '关闭'],
            yes: function (index, layero) {
                var $val = layero.find('textarea').val();
                var allImgUrl = $val.split('\n');
                if (allImgUrl[0] == '') {
                    return layer.msg('url不能为空', { icon: 2 });
                }
                var totalCount = existCount + allImgUrl.length;
                if (totalCount > +maxImgCount) {
                    return layer.msg(`最多只允许${maxImgCount}张图片`, { icon: 7 });
                }
                for (let item of allImgUrl) {
                    var childDiv = `
                    <div class="commonImg-imgsChild">
                        <img src="${item}" width="100" height="100" onerror="layui.admin.img_noFind()" class="img_show_hide">
                        <div class="opte" onclick="imgRemove_handleFn(this)">
                            <span class="removeImg">移除</span>
                        </div>
                    </div>
                    `;
                    if (obj.isAuto) {
                        if (!obj.btnAndImgParent) {
                            return layer.msg('动态增加套图必须传递字段btnAndImgParent');
                        }
                        $(_this).parents(obj.btnAndImgParent).find(obj.imgContainer).append(childDiv);
                    } else {
                        $(obj.imgContainer).append(childDiv);
                    }
                }
                layer.close(index);
            }
        });
        event.preventDefault();
        event.stopPropagation();
    });
}

/**
 * 函数: 本地图片上传
 * @param {String} obj.imgBtn --本地图片按钮,唯一性,不可重名{可class/ID,#id,.class}
 * @param {String} obj.imgContainer --图片容器,唯一性,不可重名{不区分本地还是网络图片,#id, .class}
 * @param {String} obj.max --最大图片数量{不区分本地还是网络图片}
 * @param {String} obj.isAuto -- 按钮是不是动态增加的,就是相同的图片容器有多个
 * @param {String} obj.btnAndImgParent -- 只有isAuto=true才有这个字段,参考smt刊登管理套图
 */
function localImg_handleFn (obj) {
    //默认不是动态增加,按钮和图片不具有统一的父元素,且存在多套
    var obj = Object.assign({ isAuto: false, btnAndImgParent: '' }, obj);
    var maxImgCount = obj.max;
    $('body').on('click', obj.imgBtn, function () {
        var _this = this;
        console.log('触发本地上传点击事件')
        //获取到已存在的图片数量
        var existCount = 0;
        if (obj.isAuto) {
            if (!obj.btnAndImgParent) {
                return layer.msg('动态增加套图必须传递字段btnAndImgParent');
            }
            existCount = $(_this).parents(obj.btnAndImgParent).find(obj.imgContainer).find('.commonImg-imgsChild').length;
        } else {
            existCount = $(obj.imgContainer).find('.commonImg-imgsChild').length;
        }
        if (existCount >= maxImgCount) {
            return layer.msg(`最多只允许${maxImgCount}张图片`, { icon: 7 });
        }
        var $next = $(this).next('input[type=file]');
        $next.trigger('click');
        $next.unbind().change(function (e) {
            var files = e.target.files;
            if (!files.length) return;
            var file = files[0];
            var formData = new FormData();
            formData.append('file', file);
            //把formData传递给后台,执行提交操作
            $.ajax({
                url: ctx + "/prodTpl/uploadPic.html",
                data: formData,
                type: "POST",
                async: true,
                cache: false,
                contentType: false,
                processData: false,
                dataType: 'json',
                beforeSend: function () {
                    loading.show();
                },
                success: function (data) {
                    loading.hide();
                    if (data.code == '0000') {
                        var childDiv = `
                            <div class="commonImg-imgsChild">
                                <img src="${data.msg}" width="100" height="100" onerror="layui.admin.img_noFind()" class="img_show_hide">
                                <div class="opte" onclick="imgRemove_handleFn(this)">
                                    <span class="removeImg">移除</span>
                                </div>
                            </div>`;
                        if (obj.isAuto) {
                            $(_this).parents(obj.btnAndImgParent).find(obj.imgContainer).append(childDiv);
                        } else {
                            $(obj.imgContainer).append(childDiv);
                        }
                    } else {
                        layer.msg(data.msg, { icon: 2 });
                    }
                    //传递完成以后清空input的value
                    e.target.value = '';
                },
                error: function (error) {
                    loading.hide();
                    layer.msg(`${error.statusText}`, { icon: 2 });
                }
            })
            //传递完成以后清空input的value
            e.target.value = '';
            e.preventDefault();
            e.stopPropagation();
        });
    })

}


// #region 统一备注弹框start
/**
 * 直邮--统一的备注弹框-单个备注
 * @param data --当前行数据
 */
function commonDirectMailRemark (data,gridOptionsData) {
    var remarkStr = `
        <script type="text/html">
            <form class="layui-form p20">
                <div class="layui-form-item">
                    <label class="layui-form-label">类型</label>
                    <div class="layui-input-block">
                        <select name="notetype" id="notetype${data.id}" lay-search>
                        </select>
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">备注</label>
                    <div class="layui-input-block">
                        <textarea name="remark" placeholder="请输入内容" class="layui-textarea"></textarea>
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">备注纪录</label>
                    <div class="layui-input-block">
                        <table class="layui-table">
                            <thead>
                                <tr>
                                    <th>时间</th>
                                    <th>操作人</th>
                                    <th>类型</th>
                                    <th>内容</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody id="remark_record${data.id}">

                            </tbody>
                        </table>
                    </div>
                </div>
            </form>
        </script>`;
    layui.layer.open({
        type: 1,
        title: '备注',
        btn: ['提交', '取消'],
        area: ['40%', '60%'],
        content: $(remarkStr).html(),
        id: 'commonDirectMailRemarkId',
        move: false,
        success: async function (layero, index) {
            //渲染类型
            let allTypes = await remark_getAllTags('PLAT_ORDER_LABEL');
            await commonRenderSelect(`notetype${data.id}`, allTypes, { name: 'name', code: 'name' });
            layui.form.render('select');
            //渲染表格
            let tbodyRecordArr = await remark_showTagByTime(data.id);
            let trStr = '';
            for (let i = 0; i < tbodyRecordArr.length; i++){
                let item = tbodyRecordArr[i];
                trStr += `
                    <tr>
                        <td>${Format(item.createTime || '',"yyyy-MM-dd hh:mm:ss")}</td>
                        <td>${item.creator || ''}</td>
                        <td>${item.noteType || ''}</td>
                        <td>${item.noteContent || ''}</td>
                        <td><span class="layui-btn layui-btn-sm layui-btn-danger" onclick="commonDeleteRemark('${item.id}', this)">删除</span></td>
                    </tr>
                `;
            }
            $(`#remark_record${data.id}`).append(trStr);
            // var $textarea = layero.find('textarea[name=remark]');
            // if (data.pickNote || data.orderNote) { //备注值
            //     $textarea.val(data.pickNote || data.orderNote)
            // }
        },
        yes: function (index, layero) {
            let ids = data.id;
            let noteContent = layero.find('textarea[name=remark]').val();
            let noteType = layero.find(`#notetype${data.id}`).val() || '';
            if (!noteContent && !noteType) {
                return layer.msg('类型和备注不能都为空', { icon: 7 });
            }
            remark_addTagAndContent({
                ids: ids,
                noteType: noteType,
                noteContent: noteContent
            }).then(function (result) {
                layer.msg(result || '修改备注成功', { icon: 1 });
                layer.close(index);
                updataOrderRow_remark(data,gridOptionsData,noteContent,noteType)
                // $('.layadmin-tabsbody-item.layui-show').find('.commonDirectMailRemarkSearch').trigger('click');
            }).catch(function (err) {
              console.log(err);
                layer.msg(err || err.message, { icon: 2 });
            })
        }
    })
}
function commonDeleteRemark(id, obj){
  commonReturnPromise({
    url: '/lms/platOrderNote/deleteNoteById',
    params: {
      id: id
    }
  }).then(res => {
    $(obj).parents('tr').remove();
    layer.msg(res || '删除成功', {icon:1});
  })
}

/**
 * 直邮--统一的备注弹框-批量备注
 * @param id --选中行数据id字符串
 */
function commonDirectMailRemarkBatch (ids,gridOptionsData,plat) {
    let remarkStr = `
        <script type="text/html">
            <form class="layui-form p20">
                <div class="layui-form-item">
                    <label class="layui-form-label">类型</label>
                    <div class="layui-input-block">
                        <select name="notetype" id="notetype${ids}" lay-search>
                        </select>
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">备注</label>
                    <div class="layui-input-block">
                        <textarea name="remark" placeholder="请输入内容" class="layui-textarea"></textarea>
                    </div>
                </div>
            </form>
        </script>`;
    layer.open({
        type: 1,
        title: '备注',
        btn: ['下载模板','上传','保存','关闭'],
        area: ['40%', '60%'],
        content: $(remarkStr).html(),
        id: `commonDirectMailRemarkId${ids}`,
        move: false,
        success: async function (layero, index) {
            //渲染类型
            let allTypes = await remark_getAllTags(plat == '平台仓订单' ? 'FBP_PLAT_ORDER_LABEL' : 'PLAT_ORDER_LABEL');
            await commonRenderSelect(`notetype${ids}`, allTypes, { name: 'name', code: 'name' });
            layui.form.render('select');
            //绑定上传功能
            batchRemark_uploadHandle(`commonDirectMailRemarkId${ids}`);
            if(plat == '平台仓订单'){ // 4766 平台仓订单界面支持备注
                $(layero).find('.layui-layer-btn0').hide()
                $(layero).find('.layui-layer-btn1').hide()
            }
        },
        btn4: function (index, layero) {
            //保存
            console.log('btn3');
            let newIds = ids.split('-').join(',');
            let noteContent = layero.find('textarea[name=remark]').val();
            let noteType = layero.find(`#notetype${ids}`).val() || '';
            if (!noteContent && !noteType) {
                layer.msg('类型和备注不能都为空', { icon: 7 });
                return false;
            }
            remark_addTagAndContent({
                ids: newIds,
                noteType: noteType,
                noteContent: noteContent
            }).then(function (result) {
                layer.msg(result || '修改备注成功', { icon: 1 });
                layer.close(index);
                if(plat == '平台仓订单'){ // 4766 平台仓订单界面支持备注
                    $("#fbpOrderSearch").click()
                    return false;
                }
                updataOrderRow_remarkBatch(gridOptionsData,noteContent,noteType)
                // $('.layadmin-tabsbody-item.layui-show').find('.commonDirectMailRemarkSearch').trigger('click');
            }).catch(function (err) {
                layer.msg(err || err.message, { icon: 2 });
            })
            return false;
        },
        yes: function (index, layero) {
            //下载模板
            window.location.href = ctx + '/static/templet/batchAddLabelNoteTemplate.xls';
        },
        btn2: function (index, layero) {
            //上传
            // console.log('上传')
            return false;
        },
    })
}

//批量备注上传功能
function batchRemark_uploadHandle (id) {
    layui.use('upload', function () {
        let upload = layui.upload;
        //获取dom元素
        let targetUploadDom = $(`#${id}`).parent().find('.layui-layer-btn.layui-layer-btn- >.layui-layer-btn1')[0];
        upload.render({
            elem: targetUploadDom, //绑定元素
            url: `${ctx}/unauditorder/importLabelNoteTemplate.html`, //上传接口
            accept: 'file',//允许上传的文件类型
            exts: 'xlsx|xls',
            done: function(res) {
                if (res.code == '0000') {
                    return layer.msg('上传成功',{ icon: 1 });
                } else {
                    return layer.msg(res.msg || '上传失败',{ icon: 2 });
                }
            },
            error: function() {
                layer.msg('服务器出现故障!');
            }
        });
    })
}


//获取所有标签列表接口
function remark_getAllTags (headCode) {
    return commonReturnPromise({
        url: '/lms/sysdict/getBizDictByCode.html',
        params: {
            'headCode': headCode
        }
    });
}

//按时间顺序展示订单标签接口
function remark_showTagByTime (orderId) {
    return commonReturnPromise({
        url: '/lms/unauditorder/getlabelbyorderId.html',
        params: {
            orderId: orderId
        }
    });
}

//增加订单标签和订单备注内容保存-单个和批量通用接口
function remark_addTagAndContent (obj) {
    return commonReturnPromise({
        url: '/lms/unauditorder/addorderlabelnote.html',
        type: 'post',
        contentType: 'application/x-www-form-urlencoded',
        params: obj
    });
}


//#endregion  统一备注弹框end

// 【1、待派单/缺货订单、待包装订单、待发货订单】wish退款
// type==‘batch’，批量操作；type==‘’，单个操作
function originOrderWishRefund(data,type,func) {
    layui.use(['form','layer', 'table','element'], function() {
        var form = layui.form,
            element = layui.element,
            table = layui.table,
            layer = layui.layer;
        if(type == 'batch'){ // 批量
            let obj = [];
            data.forEach(item => {
                if(item.platCode == 'wish'){
                    obj.push({
                        "storeAcctId": item.storeAcctId,
                        // "refundReason":'',
                        "id" : item.id,
                        // "refundReasonNote" : "",
                        "platOrderId" : item.platOrderId
                    })
                }
            })
            let str = `本次共选中 ${data.length} 条，申请退款的wish订单数为 ${obj.length} 条，请确认是否全部执行`
            layer.confirm(str, function (index) {
                commonReturnPromise({
                    type: "post",
                    contentType: "application/json",
                    url: "/lms/wishRefundOrder/refundOrders",
                    params:JSON.stringify(obj)
                }).then((res) => {
                    let msg = '退款成功id：<br/>' + res['退款成功id'].join("<br/>") + '退款失败id：<br/>' + res['退款失败id'].join("<br/>")
                    layer.open({
                        title: '操作结果'
                        ,content: msg
                        ,btn: ['确定']
                        ,yes: function(index){
                            func()
                            layer.close(index)
                        }
                    });
                });
            });
        }else{
            let obj = {
                "storeAcctId": data[0].storeAcctId,
                // "refundReason":'',
                "id" : data[0].id,
                // "refundReasonNote" : "",
                "platOrderId" : data[0].platOrderId
            }
            layer.confirm('确定要退款吗？', function (index) {
            commonReturnPromise({
                type: "post",
                contentType: "application/json",
                url: "/lms/wishRefundOrder/refundOrder",
                params:JSON.stringify(obj)
            }).then((res) => {
                layer.alert(res,{icon:1})
                func()
                layer.close(index);
            });
            });
        }
    })
}
// 待包装订单--拆单--start--copy toAuditOrder
function tplOrginal_order_products(d){
    let str = `<div class="dis_flex">
        <img width="60" height="60" data-original="${d.imageUrl||''}" class="img_show_hide b1 lazy" data-onerror="layui.admin.img_noFind()">
        <div>
            <div :Style>${d.prodSSku||""}:Tag</div>
            <div><span>Color</span>${d.style||""}</div>
        </div>
        <div><span>×</span><span>${d.platQuantity||""}</span></div>
    </div>`;
    if(!d.isSale){
        str = str.replaceAll(':Tag','<span class="layui-badge">停</span>')
    }else{
        str = str.replaceAll(':Tag','')
    }
    if(d.platOrderDetailStatus.includes('canceled')){
        str = str.replaceAll(':Style','style="font-weight:700;font-size:24px;color:#ffa500;"')
    }
    return str;
}
// 排序
function sortBy(props) {
    return function(a,b) {
        return a[props] - b[props];
    }
}
// 原始订单拆单弹框
function originOrderDemolimotion_wait(data,waittopack_gridOptions) {
    let str = `<div style="margin: 20px 50px">
       <div class="layui-form fixLeft" style="margin:10px 0 0 30px;color:red;">
            拆出商品请及时还库！
        </div>
<!--       <div class="layui-form fixRight">-->
<!--            <input type="checkbox" title="拆出订单转至其它异常订单" lay-skin="primary" id="common_demolition_original_abnormal">-->
<!--        </div>-->
        <table class="layui-table" id="common_demolition_original_table" lay-filter="common_demolition_original_table"></table>
    </div>`
    layui.use(['form','layer', 'table'], function() {
        var form = layui.form,
            table = layui.table,
            layer = layui.layer;
        // var orderDetails = data.orderDetails;
        // data.orderDetails && data.orderDetails.sort(sortBy('availableStock'));
        layer.open({
            type: 1,
            title: '订单拆分',
            btn: ['拆分', '关闭'],
            area: ['100%', '80%'],
            content: str,
            success: function (layero, index) {
                demolitiontableIns = table.render({
                    elem: '#common_demolition_original_table',
                    data: data,
                    totalRow: true,
                    cols: [[
                            {title: "商品信息", field: "imageUrl", templet: tplOrginal_order_products, width: 300},
                            {title: "子店铺单号", field: "platOrderItemId"},
                            {title: "子订单类型", field: "platOrderDetailType" },
                            {title: "子订单状态", field: "platOrderDetailStatus",templet: function (d) {
                                if(d.platOrderDetailStatus.includes('canceled')){
                                    return `<span style="font-weight:700;font-size:24px;color:#ffa500;">${d.platOrderDetailStatus}</span>`
                                }else{
                                    return d.platOrderDetailStatus
                                }
                            }},
                            {
                                title: "总重量(g)",
                                field: "prodWeight",
                                templet:'<div>{{d.prodQuantity?d.prodQuantity * d.prodUnitWeight:""}}</div>'
                            },
                            {title: "销售金额", field: "platOrderDetailAmt", totalRow: true},
                            {title: "物流属性", field: "prodLogisAttrList"},
                            {title: "sku重量(g)", field: "prodUnitWeight"},
                            {title: "可用库存",field: "availableStock"},
                            {title: "平台数量", field: "platQuantity"},
                            {title: "商品数量", field: "prodQuantity"},
                            {title: "拆分数量", field: "prodQuantity1"
                                , templet: function (d) {
                                    if(d.platOrderDetailStatus.includes('canceled')){
                                        return `<span style="font-weight:700;font-size:24px;color:#ffa500;">${d.prodQuantity||''}</span>`
                                    }else{
                                        return '';
                                    }
                                }},
                            {title: "拆分重量(g)", field: "prodSSkuWeight", templet:function (d) {
                                    if(d.platOrderDetailStatus.includes('canceled')&&d.prodQuantity){
                                        return d.prodQuantity * d.prodUnitWeight
                                    }else{
                                        return ''
                                    }
                                }},
                            {title: "拆分金额", field: "splitCost",
                                templet:'<div>{{d.platOrderDetailStatus.includes("canceled")?d.platOrderDetailAmt:""}}</div>', totalRow: true},
                        ]],
                    height: 480,
                    page: true,
                    limit: 500,
                    limits: [200, 500],
                    id: 'common_demolition_original_table',
                    done: function (res) {
                        //变化以后,更新拆分重量和拆分数量
                        let $tr = layero.find('.layui-table-box .layui-table-body tr');
                        let totalWeight = 0;
                        let totalNum = 0;
                        let totalSplitMoney = 0;
                        for (let i = 0, len = res.data.length; i < len; i++) {
                            let TableDom = $("#common_demolition_original_table").next();
                            TableDom.find(`tr[data-index=${i}] td[data-field=allCount] span`).text(res.data[i].allCount)
                            let prodWeight = TableDom.find(`tr[data-index=${i}] td[data-field=prodSSkuWeight]>div`).text() || 0;
                            let skuNum = TableDom.find(`tr[data-index=${i}] td[data-field=prodQuantity1]>div`).text() || 0;
                            let money = TableDom.find(`tr[data-index=${i}] td[data-field=splitCost]>div`).text() || 0;
                            totalWeight += Number(prodWeight);
                            totalNum += Number(skuNum);
                            totalSplitMoney += Number(money);
                        }
                        layero.find('.layui-table-total td[data-field=prodSSkuWeight]>div').html(totalWeight.toFixed(2));
                        layero.find('.layui-table-total td[data-field=prodQuantity1]>div').html(totalNum);
                        layero.find('.layui-table-total td[data-field=splitCost]>div').html(totalSplitMoney.toFixed(2));

                        form.render()
                        imageLazyload();
                        //总计展示
                        originOrderDemolimotionTotalHandle(layero);
                        //监听tr的input变化
                        originOrderDemolimotionTbodyHandle(layero);
                    }
                })
            },
            yes: function (index, layero) {
                var trs = layero.find('.layui-table-body tbody>tr');
                var dataArr = [];
                for (var i = 0; i < trs.length; i++) {
                    var tr = trs[i];
                    // var orderDetail = orderDetails[i];
                    var orderDetail = data[i];
                    var orderDetailId = orderDetail.id;
                    // var demolitionQuality = $(tr).find('input[name=demolitionQuality]').val();
                    if(orderDetail.platOrderDetailStatus.includes('canceled')){
                        dataArr.push({orderDetailId: orderDetailId,prodQuantity:orderDetail.prodQuantity});
                    }
                };
                // dataArr = dataArr.filter((value) => value.prodQuantity)
                // const turnToAbnormalOrderTag = $('#common_demolition_original_abnormal').prop('checked')
                commonReturnPromise({
                    type: 'post',
                    url: '/lms/unauditorder/splitorder.html',
                    contentType: 'application/json',
                    params: JSON.stringify({
                        id: data[0].parentId,
                        isSplitCancel:true, // true代表lazada拆出取消订单,其他拆单操作都为false
                        orderSplitDetailDtos: dataArr
                    })
                }).then(res => {
                    layer.msg('操作成功', {icon: 1});
                    commonReturnPromise({
                        url: '/lms/abnormalorder/tocancel.html',
                        type: 'post',
                        params: {
                            ids: res
                        }
                    }).then(res => {
                        layer.close(index);
                        layui.admin.batchResultAlert("转取消订单:",res,function(){
                            // $('[lay-filter=waittopackSearch]').trigger('click');
                            // 选中的数据
                            let waittopack_gridOptions_data = waittopack_gridOptions.api.getRowNode(data[0].parentId);
                            commonReturnPromise({
                                url: ctx + '/pickpackorder/listorder.html',
                                type: 'POST',
                                params:{orderIds:data[0].parentId}
                            }).then(function(result){
                                waittopack_gridOptions_data.setData(result[0]?result[0]:[]);
                            })
                        });
                    });
                })
            },
        })
    })
}
function originOrderDemolimotionTotalHandle (layero) {
    //总计文字展示
    layero.find('.layui-table-total td[data-field=imageUrl]>div').html('<b>总计</b>');
    //重量求和
    let $tr = layero.find('.layui-table-box .layui-table-body tr');
    let totalWeight = 0;
    for (let i = 0; i < $tr.length; i++){
        let tr = $tr[i];
        let prodWeight = $(tr).find('td[data-field=prodWeight]>div').text();
        totalWeight += Number(prodWeight);
    }
    layero.find('.layui-table-total td[data-field=prodWeight]>div').html(totalWeight.toFixed(2));
}
function originOrderDemolimotionTbodyHandle (layero) {
    layero.on('change', 'input[name=demolitionQuality]', function (event) {
        let val = event.target.value;
        let $parentTr = $(this).parents('tr');
        let unitWeight = $parentTr.find('td[data-field=prodUnitWeight]>div').text();
        let targetDom = $parentTr.find('td[data-field=prodSSkuWeight]>div');
        let splitMoneyDom = $parentTr.find('td[data-field=splitCost]>div');//拆分金额容器
        let totalMoney = $parentTr.find('td[data-field=platOrderDetailAmt]>div').text(); //总金额
        let prodNum = $parentTr.find('td[data-field=prodQuantity]>div').text(); //总数量
        if (val) {
            let totalWeight = val * unitWeight;
            let splitMoney = (totalMoney / prodNum) * val;
            targetDom.html(`${totalWeight}`);
            splitMoneyDom.html(`${splitMoney.toFixed(2)}`);
        } else {
            targetDom.html('');
            splitMoneyDom.html('');
        }
        //变化以后,更新拆分重量和拆分数量
        let $tr = layero.find('.layui-table-box .layui-table-body tr');
        let totalWeight = 0;
        let totalNum = 0;
        let totalSplitMoney = 0;
        for (let i = 0; i < $tr.length; i++){
            let tr = $tr[i];
            let prodWeight = $(tr).find('td[data-field=prodSSkuWeight]>div').text() || 0;
            let skuNum = $(tr).find('td[data-field=prodSSku]>div>input').val() || 0;
            let money = $(tr).find('td[data-field=splitCost]>div').text() || 0;
            totalWeight += Number(prodWeight);
            totalNum += Number(skuNum);
            totalSplitMoney += Number(money);
        }
        layero.find('.layui-table-total td[data-field=prodSSkuWeight]>div').html(totalWeight.toFixed(2));
        layero.find('.layui-table-total td[data-field=prodSSku]>div').html(totalNum);
        layero.find('.layui-table-total td[data-field=splitCost]>div').html(totalSplitMoney.toFixed(2));
    });
}
// 待包装订单--拆单--end

/**
 * 正则匹配实时更改input内容
 * @param {string} dom  绑定的元素
 * @param {string} type int(正整数)/float(浮点型)
 */
function commonRegInput (dom, type) {
    if (!type) {
        type = 'float'
    }
    var value = dom.value
    var min = dom.min || -Infinity
    var max = dom.max || Infinity
    var val = Number(value)
    if (!val) {
        type == 'float' ? (dom.value = value.match(/\d+|\.|\-*/g).join('')) : value.match(/\d+/g).join('')
    }

    Number(dom.value) > max ? (dom.value = max) : dom.value

    Number(dom.value) < min ? (dom.value = min) : dom.value
}

/**
 * 触发事件onkeyPress
 * 精度为小数点后2位
 * 非负数
 */
function commonKeyPressInputFloat(event) {
    const value = event.target.value
    const char = event.key
    if (value) {
        const res = value.match(/\d+.(\d+)/)
      if (res && res[1].length > 1) {
        event.preventDefault()
      }
      if (!/\.|^\d/.test(char) || (value.includes('.') && char === '.')) {
        event.preventDefault()
      }
    } else {
      if (!/^\d/.test(char)) {
        event.preventDefault()
      }
    }
  }
// 输入框仅支持填入数字及小数点符号, 支持填写至小数点后2位，长度限制10字符
  function commonFormatBlur(input){
    // 移除除数字和小数点以外的字符
    input.value = input.value.replace(/[^\d\.]/g, '');
    // 移除多余的小数点
    input.value = input.value.replace(/\.{2,}/g, '.');
    // 限制小数点后最多只能有两位数字
    const decimalIndex = input.value.indexOf('.');
    if (decimalIndex !== -1 && input.value.slice(decimalIndex + 1).length > 2) {
        input.value = input.value.slice(0, decimalIndex + 3);
    }
    // 限制长度
    if (input.value.length > 10) {
        input.value = input.value.slice(0, 10);
    }
  }
// 输入框仅支持填入0和正数
function commonFormatNonnegativeBlur(input,needEmpty=false){
  // 移除除数字和小数点以外的字符
  const val = input.value.replace(/[^\d\.]/g, '');
  if(val===''&& needEmpty){
    input.value =''
  }else{
      input.value = Number(val)
  }
}  

  /**
 * 触发事件onkeyPress
 * 精度为小数点后2位,最小值为1
 * 正数
 */
   function commonKeyPressPositiveFloat(event) {
    const value = event.target.value
    const char = event.key
    if (value) {
      const res = value.match(/\d+.(\d+)/)
      if (res && res[1].length > 1) {
        event.preventDefault()
      }
      if (!/\.|^\d/.test(char) || (value.includes(".") && char === ".")) {
        event.preventDefault()
      }
    } else {
      if (!/(^[1-9]*$)/.test(char)) {
        event.preventDefault()
      }
    }
  }

//   正数和0 保留俩位小数
  function commonBlurPositiveFloat(event) {
    let value = event.target.value
    value = value.replace(/[^0-9.]/g, "")
    let pointLen = value.split(".").length
    for (let i = 0; i < pointLen - 1; i++) {
      value = value.replace(/^\./g, "") //验证第一个字符是数字而不是小数点
    }
    value = value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".") //只保留第一个小数点, 清除多余的
    value = value.replace(/^(\-)*(\d+)\.(\d{2}).*$/, "$1$2.$3") //只能输入2个小数

    event.target.value = value
  }
//   保留俩位小数
  function commonBlurFloatTwo(event) {
    let value = event.target.value
    let pointLen = value.split(".").length
    for (let i = 0; i < pointLen - 1; i++) {
      value = value.replace(/^\./g, "") //验证第一个字符是数字而不是小数点
    }
    value = value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".") //只保留第一个小数点, 清除多余的
    value = value.replace(/^(\-)*(\d+)\.(\d{2}).*$/, "$1$2.$3") //只能输入2个小数

    event.target.value = value
  }

/**
 * 触发事件onkeyPress
 * 整数
 */
 function commonKeyPressInputInt(event){
    const value = event.target.value
    const char = event.key
    if (value) {
      if (!/^\d/.test(char)) {
        event.preventDefault()
      }
    }
}

/**
 * 触发事件onkeyPress
 * 正整数
 */
 function commonKeyPressInputPositiveInt(event){
    const value = event.target.value
    const char = event.key
    if (value) {
        if (!/^\d/.test(char)) {
            event.preventDefault()
        }
    }else{
        if (!/(^[1-9]*$)/.test(char)) {
            event.preventDefault()
        }
    }
}

/**
 * 触发事件onkeyPress
 * 正整数和0
 */
 function commonKeyPressInputNotNega(event){
    const value = event.target.value
    const char = event.key
    if (value) {
        if (!/^\d/.test(char)) {
            event.preventDefault()
        }
    }else{
        if (!/(^[0-9]*$)/.test(char)) {
            event.preventDefault()
        }
    }
}
/**
 * 触发事件onkeyPress
 * 正整数和0和逗号
 */
function commonKeyPressInputNumComma(event){
    const value = event.target.value
    const char = event.key
    if (value) {
        if (!/(^[0-9 ,]*$)/.test(char)) {
            event.preventDefault()
        }
    }else{
        if (!/(^[0-9]*$)/.test(char)) {
            event.preventDefault()
        }
    }
}
/**
 * 触发事件onblur
 * 正整数和0和逗号
 */
function commonBlurInputNumComma(event){
    let value = event.target.value
    value=value.replaceAll('，',',')
    const valueArr = value.split(',')
    event.target.value=valueArr.filter(item=>{
        let _item = item.trim()
        return Number(_item)||(Number(_item)===0 && _item!=='')
    }).join(',')
}
/**
 * 触发事件onblur
 * 正整数和0
 */
function commonBlurInputNotNega(event){
    const value = event.target.value
    event.target.value = value.replace(/[^0-9]/g,'')
}

/**
 * 触发事件onblur
 * 正整数
 */
function commonBlurPositiveInteger(event){
    const value = event.target.value
    var pattern = /^[1-9]\d*$/;
    if(!pattern.test(value)){
        event.target.value = Math.abs(parseInt(value)) || ''
    }
}

/**
 * 触发事件onblur
 * 整数
 */
function commonBlurInteger(event){
    const value = event.target.value
    var pattern = /^-?\d+$/;
    if(!pattern.test(value)){
        event.target.value = parseInt(value) || ''
    }
}

/**
 * 触发事件onblur
 * 配置
 */
function commonBlurNumberSetting(event, setting){
    const {precision = 0, min = -Infinity, max = Infinity} = setting
    if(event.target.value === '') return;
    let value = Number(event.target.value);
    // 如果输入的不是数字，就使用原来的值
    if (isNaN(value)) {
        event.target.value = ''
        return;
    }

    // 处理最小值和最大值
    if (value < min) {
        value = min;
    }
    if (value > max) {
        value = max;
    }

    // 处理精度和步长
    event.target.value = parseFloat(value.toFixed(precision));
}


//判断图片是否存在
function checkImgExists (imgurl) {
    return new Promise(function (resolve, reject) {
        var ImgObj = new Image();
        ImgObj.src = imgurl;
        ImgObj.onload = function () {
            resolve(true);
        }
        ImgObj.onerror = function () {
            reject(false);
        }
    })
}

/**
 * 倒计时功能
 * @param {string} targetDate
 * @returns 时间范围
 */
function countDownHandle (targetDate, id) {
    let newId = `#activeregisterIdNum${id}`;
    let timer = null;
    timer = setInterval(function () {
        let nowTime = Date.now();
        let targetTime = new Date(targetDate).getTime();
        let dValue = targetTime - nowTime;
        if (dValue <= 0) {
            let result = '<font color="red">活动已过期</font>';
            $(newId).html(result);
            clearInterval(timer);
        } else {
            //转换成日时分秒
            let originDay = Math.floor(dValue / (24 * 60 * 60 * 1000));
            let day = originDay < 10 ? '0' + originDay : originDay;
            let hour = Math.floor((dValue / (60 * 60 * 1000)) % 24);
            let minute = Math.floor(dValue / (60 * 1000) % 60);
            let second = Math.floor((dValue / 1000) % 60);
            let result = `${day}d:${hour}h:${minute}m:${second}s`;
            $(newId).html(result);
        }
    }, 1000);
}

/**
 * 匹配sku数量，中英文逗号和空格，数量不超过1000
 * @param {string} skuStr 输入框内容
 * @param event
 */
function handleSku (skuStr, event) {
    let str = skuStr.replace(/，/g, ',').replace(/\s+/g, ""); //中文逗号转为英文逗号，空格全部删掉
    let skuLen = str.split(",").length;

    if (skuLen > 1000) {
        str = str.split(",").slice(0, 1000).join(",");
        event.target.value = str
        return layer.alert("sku数量不能超过1000个", { icon: 2 });
    } else {
        event.target.value = str
    }
}

/**
 * 匹配sku数量，中英文逗号和空格，数量不超过2000
 * @param {string} skuStr 输入框内容
 * @param event
 */
function handleSkuMax (skuStr, event) {
    let str = skuStr.replace(/，/g, ',').replace(/\s+/g, ""); //中文逗号转为英文逗号，空格全部删掉
    let skuLen = str.split(",").length;

    if (skuLen > 2000) {
        str = str.split(",").slice(0, 2000).join(",");
        event.target.value = str
        return layer.alert("sku数量不能超过2000个", { icon: 2 });
    } else {
        event.target.value = str
    }
}

/**
 * 中文逗号转为英文逗号，空格全部删掉，失焦触发
 * @param {string} inputVal 输入框内容
 * @param event
 */
 function commChangeInputVal (inputVal, event) {
    let str = inputVal.replace(/，/g, ',').replace(/\s+/g, ""); //中文逗号转为英文逗号，空格全部删掉
    str = str.split(',').filter(item=>item!=='').join(',')
     event.target.value = str
}

// 输入多个id，以英文逗号分隔
function commonBlurMoreNum(event){
    let { value } = event.target
    event.target.value = value.replaceAll('，', ',')
    .split(',')
    .filter((item) => (Number(item) || item == 0) && item !== '')
    .join();
}

/**
 * 深拷贝
 * @param {obj} 深拷贝的对象
 * @param 拷贝过后的对象
 */
function deepCopy (obj) {
    let _this = this;
    var result = Array.isArray(obj) ? [] : {};
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            if (typeof obj[key] === 'object' && obj[key] !== null) {
                result[key] = deepCopy(obj[key]); //递归复制
            } else {
                result[key] = obj[key];
            }
        }
    }
    return result;
}

/**
 * 数组转为树形结构
 * @param {Array} data 数组
 * @param {Number} groupId 自己的
 * @param {Number} parentGroup 父级的组id
 * data:[{ "id": 754, "storeAcctId": 2030, "groupName": "Home Decor", "groupId": 10000000832231, "parentGroup": 10000000834549}]
 */
function commonArrToTree (data, groupId, parentGroup) {
    let result = []
    if (!Array.isArray(data)) return data
    data.forEach(item => {
        delete item.children
    })
    let map = {}
    data.forEach(item => {
        map[item[groupId]] = item
    })
    data.forEach(item => {
        let parent = map[item[parentGroup]]
        if (parent) {
            (parent.children || (parent.children = [])).push(item)
        } else {
            result.push(item)
        }
    })
    return result
}

/**
 * @description: 限制input输入范围
 * @param {*} dom 传参this即可
 * @param {*} max
 * @param {*} min
 * @return {*}
 * 使用demo: oninput="commonSetInputMaxMinVal(this,10,1)"
 */
function commonSetInputMaxMinVal (dom, max, min) {
    if (!max) {
        max = Infinity;
    }
    if (!min) {
        min = -Infinity;
    }
    var val = dom.value;
    switch (true) {
        case val == '':
            dom.value = '';
            break;
        case val >= max:
            dom.value = max;
            break;
        case val <= min:
            dom.value = min;
            break;
    }
}
/**
 * @description: 解决精度缺失问题
 * @param {*} num1：number(减数)，num2：number（被减数），type：+-/*
 */
function commonAdd(num1, num2, type) {
    var baseNum, baseNum1, baseNum2,m = 0;
    var baseNum3, baseNum4;
    var precision;// 精度
    try {
        baseNum1 = num1.toString().split(".")[1].length;
    } catch (e) {
        baseNum1 = 0;
    }
    try {
        baseNum2 = num2.toString().split(".")[1].length;
    } catch (e) {
        baseNum2 = 0;
    }
    baseNum = Math.pow(10, Math.max(baseNum1, baseNum2));
    if(type == "+"){
        if (Math.abs(baseNum1 - baseNum2) > 0) {
            let cm = Math.pow(10, Math.abs(baseNum1 - baseNum2));
            if (baseNum1 > baseNum2) {
                num1 = Number(num1.toString().replace(".", ""));
                num2 = Number(num2.toString().replace(".", "")) * cm;
            } else {
                num1 = Number(num1.toString().replace(".", "")) * cm;
                num2 = Number(num2.toString().replace(".", ""));
            }
        } else {
            num1 = Number(num1.toString().replace(".", ""));
            num2 = Number(num2.toString().replace(".", ""));
        }
        return (num1 + num2) / baseNum;
    }else if(type == "-"){
        precision = (baseNum1 >= baseNum2) ? baseNum1 : baseNum2;
        return ((num1 * baseNum - num2 * baseNum) / baseNum).toFixed(precision);
    }else if(type == "*"){
        num1 = num1.toString();
        num2 = num2.toString();
        try {
            m += num1.split(".")[1].length
        } catch (e) {}
        try {
            m += num2.split(".")[1].length
        } catch (e) {}
        return Number(num1.toString().replace(".", "")) * Number(num2.toString().replace(".", "")) / Math.pow(10, m);
    }else if(type == "/"){
        with (Math) {
            baseNum3 = Number(num1.toString().replace(".", ""));
            baseNum4 = Number(num2.toString().replace(".", ""));
            return (baseNum3 / baseNum4) * pow(10, baseNum2 - baseNum1);
        }
    }
}

// 金额的校验
function comMoneyVertify (dom, event) {
    var inputVal = $(dom).val()
    const min = $(dom).attr('min')
    const max = $(dom).attr('max')
    if (event.keyCode == 69) {  // 去除e
        $(dom).val('')
    } else if (inputVal && ! /^\d+(\.\d+)?$/.test(inputVal)) { // 正数
        alert('只能输入正数')
        $(dom).val('')
    } else if (inputVal && min && min > inputVal) {
        // 最小值
        $(dom).val(Number(min).toFixed(2))
    } else if (inputVal && max && max < inputVal) {
        // 最大值
        $(dom).val(Number(max).toFixed(2))
    } else if (inputVal && !(Math.floor(inputVal) == inputVal)) {
        // 精度俩位
        inputVal.split('.')[1].length > 2 && $(dom).val(Number(inputVal).toFixed(2))
    }
}

/**
 * 平台类目弹出框
 * @param {String} plat --需要展示的平台（shopee/lazada/速卖通/ebay/oa）
 * @param {String} divId --展示的容器内容ID
 * @param {String} show --选择完将树名和ID展示的地方
 * @param {String} searchInputDiv -- 搜索按钮
 * @param {String} renderMapping -- 在有oa映射时使用的回调
 * @param {String} storeCateOaAttr -- renderMapping用到的参数
 * @param {String} isRenderCate -- 选择类目后页面是否要显示类目
 */
function cateLayerOpen(plat, divId, show, searchInputDiv,renderMapping,storeCateOaAttr,otherParams,isRenderCate=true) {
    layer.open({
      title: '选择分类',
      type: 1, //不加该属性,就会出现[object Object]
      area: ['100%', '70%'],
      btn: ['保存', '关闭'],
      content: $('#' + divId).html(),
      success: async function (layero) {
          layuiOpenPop = true
        layero.find('.layui-layer-btn.layui-layer-btn->.layui-layer-btn0').attr('id', 'btnYes');
        await listShow(plat, '', '');
        $(searchInputDiv).keypress(async function (e) {
          if (e.keyCode === 13) {
            if ($(this).val().trim() == '' || $(this).val().trim().length<=0) {
              e.stopPropagation();
              layer.alert('搜索内容不能为空', {
                icon: 2,
              });
              $(this).val('')
              form.render()
              return;
            }
            layui.admin.load.show();
            e.stopPropagation();
            let value = $(this).val().trim();
            let mapPlat = window.localStorage.getItem('platformCategoryPlat');
            if(plat == 'shopee' || (mapPlat && mapPlat=='shopee')){
              await listShow(plat, '', value);
            }else{
              if (String(Number(value)) === 'NaN') {
                await listShow(plat, '', value);
                // $('#LAY-iframe-itemCat-getCates').find('.layui-col-xs3.layui-col-md3.mr10').css('width','100%')
              } else {
                await listShow(plat, value, '', 1);
                // $('#LAY-iframe-itemCat-getCates').find('.layui-col-xs3.layui-col-md3.mr10').css('width','100%')
              }
            }
            layui.admin.load.hide();
          }
        });
        //*点击事件委托
        $('#LAY-iframe-itemCat-getCates').on('click', 'li', async function (value) {
          $(this).siblings().removeClass('cat_active');
          $(this).addClass('cat_active');
          $(this).parents('.layui-col-xs3.layui-col-md3.mr10').nextAll('.layui-col-xs3.layui-col-md3.mr10').remove();
          if (typeof $(this).prop('id') == undefined || $(this).attr('isleaf') == 'true') {
            $('#btnYes').click(); //?点击到叶子节点
            return;
          } else {
            let id = $(this).attr('id');
            await listShow(plat, id, '');
            return;
          }
        });
      },
      yes: async function (index, layero) {
          layuiOpenPop = false
        let li = layero.find('ul li.cat_active'),
          lilast = li[li.length - 1],
          cateTreeName = $(lilast).attr('cateTreeName'),
          cateId = $(lilast).attr('id'),
        //   cateName = $(lilast).text(),
          cateName = $(lilast).attr('catename'),
          isleaf = $(lilast).attr('isleaf'),
          pcateIds = $(lilast).attr('pcateIds');
          //只有OA才能不选择叶子节点
        if ((cateTreeName==undefined || isleaf=='false') && plat != 'oa') {
        // if (cateTreeName==undefined) {
          return
        }
        if (cateTreeName==undefined) {
          return
        }
        if (isRenderCate) {
            if (plat === 'oa') {
              $('#' + show).text('OA新类目：' + cateTreeName);
              $('#' + show).next('input').val(cateId)
            } else {
              $('#' + show).next('[name=platCateId]').val(cateId)
              $('#' + show).text(plat + '平台类目：' + cateTreeName);
            }
        } else {
            renderMapping(cateId)
        }
        if (show === 'platAttr') {
          let showData = {
            platCode: plat,
            platCateId: cateId,
          }
          commonReturnPromise({
            url: ctx + '/prodCateOaMapping/getAllCateAttrAndValue',
            type: 'post',
            contentType: 'application/json',
            params: JSON.stringify(showData),
          }).then((res)=>{
              $('#plat_choose_inp').val(cateName);
              $('#plat_chooseid_inp').val(cateId);
              $('#plat_cateIds_inp').val(pcateIds + "," + cateId);
              if (res.length > 0) {
                  localStorage.setItem('storePlatAttrlist', JSON.stringify(res))
                  renderMapping(storeCateOaAttr, res, false);
              }
          })
        }
        // 回调函数，shopee店铺的性感图片过滤
        if(otherParams && otherParams.needCb && otherParams.cb){
            let obj = {
                id: cateId,
                cateTreeName
            }
            otherParams.cb(obj)
        }
        layer.close(index);
      },
      cancel: function (params) {},
    });
  }

//*类目请求及渲染
async function listShow(plat, pcateId, cateName, status) {
  let params =  {
    platCode: plat,
    pcateId: pcateId,
    cateTreeName: cateName,
  }
  let mapPlat = window.localStorage.getItem('platformCategoryPlat');
  let url = '';
  if(plat == 'shopee' || (mapPlat && mapPlat=='shopee')){
    url = '/lms/prodCateOaMapping/searchCatesAndId';
    // url = '/lms/prodCateOaMapping/searchCates';
  }else{
    url = '/lms/prodCateOaMapping/searchCates';
  }
  params = JSON.stringify(params)
  commonReturnPromise({
    url: url,
    type: 'post',
    contentType: 'application/json',
    params,
    }).then(res=>{
      if (res.length == 0) {
        return layer.msg('未查询到类目,请输入其他查询条件!', {icon:7});
      }
      let listr = '',
        str = `<div class="layui-col-xs3 layui-col-md3 mr10"><ul>:listr</ul></div>`;
      res.forEach((value, index) => {
        let isleaf = value.isLeafCate === 1 ? 'true' : 'false';
        let isleafdisplay = value.isLeafCate === 1 ? 'none' : 'block';
        let result = cateName === '' ? value.cateName : value.cateTreeName;
        listr += '<li class="cat_common" isLeaf="' + isleaf + '" id="' + value.id + '" cateTreeName="' + value.cateTreeName + '" catename="'+ value.cateName +'" pcateIds="' + value.pcateIds + '" pcateId="' + value.pcateId + '" >' + result + '<i class="layui-icon layui-icon-right" style="display:' + isleafdisplay + '"></i></li>';
      });
      str = str.replace(':listr', listr);
      if (status) {
        $('#LAY-iframe-itemCat-getCates').html(str);
      } else {
        if (cateName === '') {
          $('#LAY-iframe-itemCat-getCates').append(str);
        } else {
          $('#LAY-iframe-itemCat-getCates').html(str);
          $('#LAY-iframe-itemCat-getCates').find('.layui-col-xs3.layui-col-md3.mr10').css('width','50%')
        }
      }
    })
}

/**
 * 表格批量删除,删除后不刷新表格
 * @param tableId：String 必填  表格id：'test'
 * @param checkedDataId：Array 必填  选中数据的id：[1,2,3]
 * @param trId：String 必填  存放选中数据id的td选择器:'td[data-field="id"]'
 */
function deleteCheckedData(tableId, checkedDataId, tdId, tableDomId,func) {
	tableDomId = tableDomId ? tableDomId : tableId;
    if (!tableId || !checkedDataId || !tdId) {
        return console.log("参数不能为空")
    }
    (layui.table.cache[tableId]|| []).forEach((item, index) => {
        if (checkedDataId.indexOf(item.id) > -1) {
            layui.table.cache[tableId][index] = []
        }
    })
    let removeTable = Array.from($(`#${tableDomId}`).next().find('tbody tr input:checked'));
    removeTable.forEach(v => {
        if (checkedDataId.indexOf($(v).parents('tr').find(tdId).attr("data-content") * 1) > -1) {
            $(v).parents('tr').remove() //删除此行
        }
    })
    // 全选，删除后需要取消全选
    if(checkedDataId.length == (layui.table.cache[tableId] || []).length){
        $(`#${tableDomId}`).next().find(".layui-form-checked").removeClass("layui-form-checked")
    }
    if(func){
        func()
    }
}

    //得到订单ID
    function getOrderId(initArray, status, successNum) {
        let resTem
        if (successNum <= 0) {
            return
        }
        if (status == '驳回订单' || status == '转为待审核') {
            resTem = initArray.join().replace(/订单/g, '').split(',').map(v => parseInt(v))
        }else if (status == '标记异常') {
            resTem = initArray.join().replace(/订单:\[/g, '').replace(/\]标记异常成功/g, '').split(',').map(v => parseInt(v))
        }else if (status == '取消订单' || status == '转已发货') {
            resTem = initArray.join().replace(/订单\[/g, '').replace(/\]手动转取消订单成功/g, '').split(',').map(v => parseInt(v))
        }
        return resTem
    }

    // 更改总数
    function changeCount(tabId, successNum, status) {
        let count = $(tabId).find('.layui-this span').text()
        if (status == 2) {
            count = count.substring(1, count.length - 1)
        }
        $('.layui-laypage-count').text(`共 ${count - successNum} 条`)
        $(tabId).find('.layui-this span').text(`${count - successNum}`)
        if (status == 2) {
            $(tabId).find('.layui-this span').text(`(${count - successNum})`)
        }
    }
  /*
    * status: [Number类型]，0:批量添加备注模板，1:备注模板
    * data: [Array类型]，订单备注渲染的值
    * domObj: [object类型]: renderDomId: layer渲染的domId; mainFormId: 主表格domId; tableDomId: 表格渲染ID
    * temporaryObj: [object类型]，批量添加备注模板传值 渲染详情表格
    *
    */
    // 批量修改备注  修改备注弹窗
    function universalOrder_changeTipsLayer(status, data, domObj, temporaryObj, yesFn) {
        layui.use(['form','layer', 'element', 'laypage', 'laydate', 'formSelects','admin', 'table'], function() {
            var form = layui.form,
                table = layui.table,
                layer = layui.layer;
                let titleTips = ['批量添加备注', '备注']
                let btnTips = [['下载模板', '上传', '保存', '关闭'], ['保存', '关闭']]
                // console.log(titleTips[status], btnTips[status]);
                layer.open({
                    type: 1,
                    title: titleTips[status],
                    btn: btnTips[status],
                    area: ['60%', '70%'],
                    content: $('#' + domObj.renderDomId).html(),
                    success: function (layero, index) {
                        if (status === 0) {
                            layero.find('.layui-layer-btn0').addClass('fl layui-layer-btn23')
                            layero.find('.layui-layer-btn2').addClass('layui-layer-btn0').removeClass('layui-layer-btn2')
                            layero.find('.layui-layer-btn1').addClass('fl')
                            layero.find('.layui-layer-btn23').addClass('fl layui-layer-btn2').removeClass('layui-layer-btn0')

                        }else {
                            table.render({
                                elem: '#' + domObj.tableDomId,
                                // method: 'POST',
                                // url: '',
                                // where: temporaryObj,
                                cols: [
                                    [
                                        { title: "时间", field: "imageUrl"},
                                        { title: "操作人", field: "itemId"},
                                        { title: "类型", field: "storeSSku" },
                                        { title: "内容", field: "prodSSku" },
                                    ]
                                ],
                                data: [{},{},{},{}],
                                page: false,
                                limit:500,
                                id: domObj.tableDomId,
                                done: function(res) {
                                    imageLazyload();
                                }
                            })
                        }
                        commonRenderSelect(domObj.selectDomId, data, {name: 'value', code: 'code'})
                        form.render()
                    },
                    yes: function (index, layero) {
                       if (status) {
                            requestSave(domObj.mainFormId, index)
                       }else {
                        //   下载模板
                       }
                    },
                    btn2: function(index, layero){
                        // 上传按钮

                        //return false 开启该代码可禁止点击该按钮关闭
                    },
                    btn3: function(index, layero){
                        requestSave(domObj.mainFormId, index).then(res => {
                            layui.layer.msg(res || '操作成功!')
                            layui.layer.close(index)
                        }).catch(err => {
                            layui.layer.msg(err || '操作失败')
                        });
                        return false
                    },
                })
        })
    }

    function requestSave(mainFormId, index) {
        let updateProdPInfo = serializeObject($('#' + mainFormId))
        return commonReturnPromise({
            url: 'aaaa/bbbbbbbbbbb/aaaaaaaaaxc/s',
            params: updateProdPInfo
        })
    }

layui.use(["form"],function () {
    let form = layui.form
    // 全选&反选
    form.on('checkbox(capturePictureModuleUlCheckAll)', function(data){
        let elemCheck = data.elem.checked;
        $('.capturePictureModuleUl').find('input[type=checkbox]').each(function(index){
            $(this).prop("checked",elemCheck);
        })
        form.render('checkbox','capturePictureModuleForm')
    });
    // 子checkbox
    form.on('checkbox(capturePictureModuleUlCheckChild)', function(data){
        let elemCheck = data.elem.checked;
        $("[lay-filter='capturePictureModuleUlCheckAll']").prop("checked",true);
        $('.capturePictureModuleUl').find('input[type=checkbox]').each(function(index){
            if($(this).prop("checked") == false){
                $("[lay-filter='capturePictureModuleUlCheckAll']").prop("checked",false);
                return false;// 只结束each循环
            }
        })
        form.render('checkbox','capturePictureModuleForm')
    });
})

// 根据图片地址获取图片的宽和高
const tpl_calculateImageSize = function(url) {
    return new Promise(function(resolve, reject) {
        const image = document.createElement("img");
        image.addEventListener("load", function(e) {
            resolve({
                width: e.target.width,
                height: e.target.height,
            });
        });

        image.addEventListener("error", function() {
            reject();
        });

        // 将图片的url地址添加到图片地址中
        image.src = url;
    });
}
let prodTpl_mainImg = [],prodTpl_assistImg = [];
function capturePictureModule () {
    let arg = [].slice.call(arguments,0);
    let isapplyMainPic = false;
        arg.indexOf("applyMainPic") != -1?isapplyMainPic = true:'';
    var remarkStr = `
        <script type="text/html">
            <form class="layui-form" οnclick="return false" onkeypress="javascript:return NoSubmit(event);" id="capturePictureModuleForm" lay-filter="capturePictureModuleForm">
                <div style="display: flex;">
                    <input class="layui-input" name="CPMCollectPicturesUrl" placeholder="暂仅支持1688，ebay，smt产品链接" style="margin: 0 10px;">
                    <a class="layui-btn layui-btn-sm layui-btn-normal CPMCollectPictures">采集图片</a>
                </div>
                <div style="display: flex;justify-content: space-between;margin: 10px;">
                    <div>
                        <input type="checkbox" name="" title="全选" lay-skin="primary" lay-filter="capturePictureModuleUlCheckAll">
                        <a class="layui-btn layui-btn-sm CPMPackageDownload">打包下载</a>
                        <a class="layui-btn layui-btn-sm CPMOneClickDelete">一键删除</a>
                        <a class="layui-btn layui-btn-sm CPMChangeWH" lay-tips="固定调整为1000*1000，不等比例调整">修改图片尺寸@</a>
                    </div>
                    <div>
                        <a class="layui-btn layui-btn-sm" id="collectCopyImagesCom">粘贴图片</a>
                        <a class="layui-btn layui-btn-sm CPMLocalImg">本地图片</a>
                        <a class="layui-btn layui-btn-sm layui-btn-primary CPMOneClickUndo">一键撤销</a>
                    ${
                        (function(){
                            if(isapplyMainPic){
                                return `
                                    <a class="layui-btn layui-btn-sm layui-brn-primary CPMApplyToMain">应用至主图</a>
                                    <a class="layui-btn layui-btn-sm layui-brn-primary CPMApplyToOther">应用至辅图</a>`
                            }else{
                                return ``
                            }
                        })()
                    }
                    </div>
                </div>
                <ul class="capturePictureModuleUl" style="display: flex;flex-wrap: wrap">
                :liStr
                </ul>
                <fieldset class="layui-elem-field layui-field-title">
                    <legend>视频</legend>
                </fieldset>
                <ul class="captureMP4ModuleUl" style="display: flex;flex-wrap: wrap">
                :mp4Str
                </ul>
            </form>
            <canvas id="canvas1" style="display: none"> 你的浏览器不支持 HTML5 canvas </canvas>
        </script>`;
    let str = `
                    <li li-index=":liIndex" item-id=":itemId">
                        <div class="photo">
                            <div class="photo-table">
                                <input type="hidden" name="imgSrcHide">
                                <img class="img_show_hide" name="imgSrc" src=":src">
                            </div>
                            <div class="photo-tips">
                                尺寸：<span>:photoWH</span>
                            </div>
                        </div>
                        <div class="group">
                            <div>
                            <a href="javascript:void(0)" title="全选">
                                <input type="checkbox" name="check" value=":liIndex" lay-skin="primary" lay-filter="capturePictureModuleUlCheckChild">
                            </a>
                            <div class="btnSelect_hp fr" style="width: 58px;">
                                <div class="title_btnSelect" style="background-color:#fff;"><img src="${ctx}/static/img/xt.png"><i style="color:#828282;vertical-align:-webkit-baseline-middle" class="layui-icon layui-icon-sanjiao1"></i></div>
                                <div class="optionBox_btnSelect">
                                    <div class="optionCanvas_btnSelect" style="width: 120px">
                                        <div class="option_imgSelect capturePictureModuleTranslate" type="button">图片翻译</div>
                                        <div class="option_imgSelect capturePictureModuleCropping" type="button">修改尺寸</div>
                                        <div class="option_imgSelect capturePictureCutOut" type="button">一键抠图</div>
                                        <div class="option_imgSelect capturePictureModuleMeitu" type="button">美图秀秀</div>
                                        <div class="option_imgSelect capturePictureModuleRuler" type="button">添加标尺</div>
                                        <div class="translate_dialog" style="left: 0px;top: 50px">
                                            <form id="translateForm" lay-fiter="translateForm" class="layui-form" action="">
                                                <div class="layui-form-item">
                                                    <div class="layui-col-md4 layui-col-lg4">
                                                        <select name="transferSource" lay-filter="transferSource">
                                                            <option value="zh" selected>中文</option>
                                                            <option value="en">英文</option>
                                                        </select>
                                                    </div>
                                                    <div class="layui-col-md2 layui-col-lg2">
                                                        <div class="mid-tanfer-icon">
                                                            <img src="${ctx}/static/img/transfer.png" />
                                                        </div>
                                                    </div>
                                                    <div class="layui-col-md4 layui-col-lg4">
                                                        <select name="transferTarget" lay-filter="transferTarget">
                                                            <option value="zh">中文</option>
                                                            <option value="en" selected>英文</option>
                                                            <option value="vi">越南语</option>
                                                            <option value="th">泰国语</option>
                                                        </select>
                                                    </div>
                                                    <div class="layui-col-md2 layui-col-lg2">
                                                        <button type="button" class="layui-btn layui-btn-primary layui-btn-sm languageTranslate">翻译</button>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            </div>
                            <a href="javascript:void(0)" title="删除" class="capturePictureModuleDelete">
                                <img src="${ctx}/static/img/delete.png">
                            </a>
                        </div>
                    </li>
            `,
// <a href="javascript:void(0)" title="美化" className="border-r layui-disabled">
//     <img
//         src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHZpZXdCb3g9IjAgMCAxOCAxOCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE1LjE5NDQgMTYuMzc5QzE1LjI3NTcgMTYuMzgwNCAxNS4zNTY1IDE2LjM2NTYgMTUuNDMyMSAxNi4zMzU0QzE1LjUwNzYgMTYuMzA1MSAxNS41NzY0IDE2LjI2MDEgMTUuNjM0MyAxNi4yMDNDMTUuNjkyMiAxNi4xNDcgMTUuNzM4MyAxNi4wOCAxNS43Njk3IDE2LjAwNTlDMTUuODAxMiAxNS45MzE3IDE1LjgxNzQgMTUuODUyIDE1LjgxNzQgMTUuNzcxNUMxNS44MTc0IDE1LjY5MSAxNS44MDEyIDE1LjYxMTMgMTUuNzY5NyAxNS41MzcyQzE1LjczODMgMTUuNDYzMSAxNS42OTIyIDE1LjM5NiAxNS42MzQzIDE1LjM0MDFMMTEuMjc3MSAxMC44OTk4QzExLjIyMSAxMC44NDEyIDExLjE1MzcgMTAuNzk0NSAxMS4wNzkyIDEwLjc2MjNDMTEuMDA0OCAxMC43MzAxIDEwLjkyNDcgMTAuNzEzMSAxMC44NDM1IDEwLjcxMjNDMTAuNzYyNCAxMC43MTE0IDEwLjY4MiAxMC43MjY3IDEwLjYwNjkgMTAuNzU3NEMxMC41MzE3IDEwLjc4OCAxMC40NjM1IDEwLjgzMzMgMTAuNDA2MSAxMC44OTA2QzEwLjM0ODcgMTAuOTQ3OSAxMC4zMDMzIDExLjAxNjEgMTAuMjcyNiAxMS4wOTEyQzEwLjI0MTkgMTEuMTY2MyAxMC4yMjY1IDExLjI0NjcgMTAuMjI3MiAxMS4zMjc4QzEwLjIyOCAxMS40MDkgMTAuMjQ0OSAxMS40ODkxIDEwLjI3NyAxMS41NjM2QzEwLjMwOTEgMTEuNjM4MSAxMC4zNTU4IDExLjcwNTQgMTAuNDE0MiAxMS43NjE3TDE0Ljc3MTQgMTYuMjAyQzE0Ljg4NDQgMTYuMzEzMiAxNS4wMzU5IDE2LjM3NjYgMTUuMTk0NCAxNi4zNzlaIiBmaWxsPSIjRjE5MjQwIi8+CjxwYXRoIGQ9Ik04Ljg3MDkgMTQuOTAzM0g4LjkwNTg5QzkuMDA3OSAxNC44OTU5IDkuMTA1OTggMTQuODYwOSA5LjE4OTY0IDE0LjgwMjFDOS4yNzMzIDE0Ljc0MzMgOS4zMzkzOSAxNC42NjI4IDkuMzgwODMgMTQuNTY5M0wxMC44ODA2IDExLjEzNjdMMTQuNTU5MiAxMC40MTQ4QzE0LjY1OTMgMTAuMzk3NyAxNC43NTIzIDEwLjM1MjIgMTQuODI3MiAxMC4yODM1QzE0LjkwMiAxMC4yMTQ5IDE0Ljk1NTUgMTAuMTI2MSAxNC45ODExIDEwLjAyNzlDMTUuMDA0NCA5LjkyODM0IDE1LjAwMjIgOS44MjQ1MyAxNC45NzQ1IDkuNzI2MUMxNC45NDY5IDkuNjI3NjcgMTQuODk0OCA5LjUzNzg0IDE0LjgyMzIgOS40NjQ5NUwxMi4wMjM1IDYuOTgzMjZMMTIuNDgxNCAzLjI2OTczQzEyLjQ5MTUgMy4xNjc3NiAxMi40NzQgMy4wNjQ5OCAxMi40MzA3IDIuOTcyMUMxMi4zODc0IDIuODc5MjMgMTIuMzIgMi43OTk2OSAxMi4yMzU1IDIuNzQxNzlDMTIuMTUwNyAyLjY4MzEyIDEyLjA1MDcgMi42NTAyMSAxMS45NDc3IDIuNjQ3MDJDMTEuODQ0NiAyLjY0MzgyIDExLjc0MjggMi42NzA0OSAxMS42NTQ1IDIuNzIzNzlMOC40MTU5NSA0LjYyMzU2TDUuMDE2MzggMy4wMzk3NkM0LjkyMzIxIDIuOTk2MjMgNC44MTk3NiAyLjk3OTU0IDQuNzE3NjQgMi45OTE1N0M0LjYxNTUxIDMuMDAzNiA0LjUxODc3IDMuMDQzODcgNC40MzgyNyAzLjEwNzg1QzQuMzU3NzcgMy4xNzE4MyA0LjI5NjcxIDMuMjU3IDQuMjYxOTUgMy4zNTM3N0M0LjIyNzE4IDMuNDUwNTQgNC4yMjAwOSAzLjU1NTEgNC4yNDE0NyAzLjY1NTY4TDUuMDMzMzcgNy4zMTYyMkwyLjQ4MDY5IDEwLjA2MTlDMi40MDk1IDEwLjEzNDggMi4zNjE0NiAxMC4yMjcyIDIuMzQyNiAxMC4zMjczQzIuMzIzNzQgMTAuNDI3NSAyLjMzNDkxIDEwLjUzMSAyLjM3NDcxIDEwLjYyNDhDMi40MTE2NiAxMC43MTk3IDIuNDczODcgMTAuODAyNiAyLjU1NDU5IDEwLjg2NDdDMi42MzUzMSAxMC45MjY3IDIuNzMxNDcgMTAuOTY1NSAyLjgzMjY1IDEwLjk3NjhMNi41NjQxOCAxMS4zMjg3TDguMzc2OTYgMTQuNjIwM0M4LjQyNjYzIDE0LjcwNzIgOC40OTg2MSAxNC43NzkyIDguNTg1NDQgMTQuODI5QzguNjcyMjggMTQuODc4NyA4Ljc3MDgzIDE0LjkwNDQgOC44NzA5IDE0LjkwMzNaTTEzLjIzNjQgOS41NTI5NEwxMC4zNjc3IDEwLjExNTlDMTAuMjgxMSAxMC4xMzQzIDEwLjIgMTAuMTcyNSAxMC4xMzA2IDEwLjIyNzVDMTAuMDYxMiAxMC4yODI0IDEwLjAwNTUgMTAuMzUyNyA5Ljk2Nzc2IDEwLjQzMjhMOC44MDU5IDEzLjEwODVMNy4zODAwOCAxMC41NTY4QzcuMzM3NjMgMTAuNDc5MyA3LjI3NzExIDEwLjQxMzIgNy4yMDM2NSAxMC4zNjQxQzcuMTMwMTkgMTAuMzE1MSA3LjA0NTk3IDEwLjI4NDQgNi45NTgxMyAxMC4yNzQ4TDQuMDU4NSA5Ljk5Mjg5TDYuMDQ3MjUgNy44NjMxNUM2LjEwNzU1IDcuNzk3NjcgNi4xNTE3IDcuNzE4OTkgNi4xNzYxOCA3LjYzMzRDNi4yMDA2NiA3LjU0NzgxIDYuMjA0NzkgNy40NTc2OCA2LjE4ODIzIDcuMzcwMjFMNS41NTQzMSA0LjUxODU3TDguMjExOTggNS43NTA0MkM4LjI5Mjg0IDUuNzg2NzMgOC4zODA5NiA1LjgwMzk5IDguNDY5NTQgNS44MDA4N0M4LjU1ODEyIDUuNzk3NzUgOC42NDQ4MSA1Ljc3NDMzIDguNzIyOTEgNS43MzI0MkwxMS4yMzk2IDQuMjMyNjFMMTAuODg3NiA3LjEzMjI0QzEwLjg4MDYgNy4yMTk0NSAxMC44OTI3IDcuMzA3MTUgMTAuOTIzMSA3LjM4OTJDMTAuOTUzNSA3LjQ3MTI0IDExLjAwMTQgNy41NDU2NCAxMS4wNjM2IDcuNjA3MThMMTMuMjM2NCA5LjU1Mjk0WiIgZmlsbD0iI0YxOTI0MCIvPgo8cGF0aCBkPSJNOC4yMjI2MiAzLjA1NjczQzguMzY3MjUgMy4wNTYyIDguNTA1ODEgMi45OTg1MiA4LjYwODA3IDIuODk2MjVDOC43MTAzNCAyLjc5Mzk4IDguNzY4MDMgMi42NTU0MyA4Ljc2ODU1IDIuNTEwOFYxLjcwMjlDOC43NjgwMyAxLjU1ODI3IDguNzEwMzQgMS40MTk3MiA4LjYwODA3IDEuMzE3NDVDOC41MDU4MSAxLjIxNTE4IDguMzY3MjUgMS4xNTc0OSA4LjIyMjYyIDEuMTU2OTdDOC4xNTA1OSAxLjE1NTc1IDguMDc5MDYgMS4xNjkwNCA4LjAxMjI3IDEuMTk2MDRDNy45NDU0OSAxLjIyMzA1IDcuODg0ODIgMS4yNjMyMiA3LjgzMzg4IDEuMzE0MTVDNy43ODI5NCAxLjM2NTA5IDcuNzQyNzcgMS40MjU3NiA3LjcxNTc3IDEuNDkyNTVDNy42ODg3NiAxLjU1OTMzIDcuNjc1NDcgMS42MzA4NyA3LjY3NjY5IDEuNzAyOVYyLjUxMjhDNy42Nzc3NCAyLjY1NzA4IDcuNzM1NjYgMi43OTUxMiA3LjgzNzg3IDIuODk2OTZDNy45NDAwOCAyLjk5ODggOC4wNzgzNCAzLjA1NjIxIDguMjIyNjIgMy4wNTY3M1pNMy43MzQxOCA3LjE0MDIyQzMuODYyMyA3LjE0MjQ2IDMuOTg3MTQgNy4wOTk2NCA0LjA4NjkyIDcuMDE5MjNDNC4xODY2OSA2LjkzODgzIDQuMjU1MDcgNi44MjU5NCA0LjI4MDEyIDYuNzAwMjdDNC4zMDQyOSA2LjU1NjA1IDQuMjcyMTEgNi40MDgwNSA0LjE5MDIyIDYuMjg2OUM0LjEwODMzIDYuMTY1NzQgMy45ODMwMSA2LjA4MDY5IDMuODQwMTcgNi4wNDkzNkwxLjc5ODQzIDUuNjQ5NDFDMS42NTYyOSA1LjYyNzQxIDEuNTExMTYgNS42NjEzNyAxLjM5MzUzIDUuNzQ0MTNDMS4yNzU5IDUuODI2ODkgMS4xOTQ5MiA1Ljk1MjAzIDEuMTY3NjEgNi4wOTMyNEMxLjE0MDMgNi4yMzQ0NSAxLjE2ODc4IDYuMzgwNzUgMS4yNDcwNyA2LjUwMTQxQzEuMzI1MzYgNi42MjIwNiAxLjQ0NzM2IDYuNzA3NjggMS41ODc0NSA2Ljc0MDI3TDMuNjI5MiA3LjEyNzIyQzMuNjYyNTQgNy4xNDE3NCAzLjY5ODkyIDcuMTQ3OTEgMy43MzUxOCA3LjE0NTIyTDMuNzM0MTggNy4xNDAyMlpNNC4xMzQxMyAxNS4zMDcyQzQuMjI0NzggMTUuMzA2OSA0LjMxMzk2IDE1LjI4NDMgNC4zOTM4MSAxNS4yNDE0QzQuNDczNjcgMTUuMTk4NSA0LjU0MTc1IDE1LjEzNjYgNC41OTIwOCAxNS4wNjEyTDYuMjI4ODcgMTIuNjE0NUM2LjMwMTIxIDEyLjQ5MzIgNi4zMjM4NyAxMi4zNDg1IDYuMjkyMTEgMTIuMjEwOEM2LjI2MDM1IDEyLjA3MzIgNi4xNzY2MyAxMS45NTMxIDYuMDU4NDMgMTEuODc1N0M1Ljk0MDIzIDExLjc5ODIgNS43OTY2OSAxMS43Njk1IDUuNjU3NzkgMTEuNzk1NEM1LjUxODg4IDExLjgyMTIgNS4zOTUzNSAxMS44OTk4IDUuMzEyOTkgMTIuMDE0NkwzLjY3NjE5IDE0LjQ0MzNDMy42MzQyNyAxNC41MDI1IDMuNjA1MDEgMTQuNTY5OCAzLjU5MDI0IDE0LjY0MDhDMy41NzU0NiAxNC43MTE4IDMuNTc1NDkgMTQuNzg1MSAzLjU5MDMxIDE0Ljg1NjJDMy42MDUxNCAxNC45MjcyIDMuNjM0NDQgMTQuOTk0NCAzLjY3NjQgMTUuMDUzNkMzLjcxODM2IDE1LjExMjggMy43NzIwNiAxNS4xNjI3IDMuODM0MTcgMTUuMjAwMkMzLjkxOTEyIDE1LjI2ODggNC4wMjQ5OCAxNS4zMDYyIDQuMTM0MTMgMTUuMzA2MlYxNS4zMDcyWiIgZmlsbD0iI0YxOTI0MCIvPgo8L3N2Zz4K">
//     </a>
        mp4s = `
                    <li li-index=":liIndex" item-id=":itemId">
                        <div class="photo">
                            <div class="photo-table">
                                <video width="200" height="200" controls>
                                    <source name="imgSrc" src=":src"  type="video/mp4">
                                    您的浏览器不支持 HTML5 video 标签。
                                </video>
                            </div>
                        </div>
                        <div class="group">
                            <a href="javascript:void(0)" title="播放" class="border-l captureMp4ModuleOpen">
                                <i class="layui-icon layui-icon-play"></i>
                            </a>
                            <a href="javascript:void(0)" title="应用" class="border-l captureMp4ModuleApply">
                                <i class="layui-icon layui-icon-ok-circle" style="color: #FFB800;"></i>
                            </a>
                            <a href="javascript:void(0)" title="删除" class="capturePictureModuleDelete">
                                <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUiIGhlaWdodD0iMTUiIHZpZXdCb3g9IjAgMCAxNSAxNSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik05LjcyNDIzIDExLjU1NEM5Ljk4ODI3IDExLjU1NCAxMC4yMDIxIDExLjMzNTUgMTAuMjAyMSAxMS4wNjQ4VjUuODYwNjRDMTAuMjAyMSA1LjU5MDA2IDkuOTg4NzIgNS4zNzE0NCA5LjcyNDIzIDUuMzcxNDRDOS40NjA2IDUuMzcxNDQgOS4yNDY4NyA1LjU5MDA2IDkuMjQ2ODcgNS44NjA2NFYxMS4wNjQ4QzkuMjQ2ODcgMTEuMzM1NSA5LjQ2MDIxIDExLjU1NCA5LjcyNDIzIDExLjU1NFpNNS4yNzU3NiAxMS41NTRDNS41Mzk4NiAxMS41NTQgNS43NTMxMyAxMS4zMzU1IDUuNzUzMTMgMTEuMDY0OFY1Ljg2MDY0QzUuNzUzMTMgNS41OTAwNiA1LjUzOTg2IDUuMzcxNDQgNS4yNzU3NiA1LjM3MTQ0QzUuMDExNzMgNS4zNzE0NCA0Ljc5ODQ3IDUuNTkwMDYgNC43OTg0NyA1Ljg2MDY0VjExLjA2NDhDNC44MDg2MSAxMS4zMzU1IDUuMDIxODcgMTEuNTU0IDUuMjc1NzYgMTEuNTU0Wk03LjUgMTEuNTU0QzcuNzY0MSAxMS41NTQgNy45NzczNiAxMS4zMzU1IDcuOTc3MzYgMTEuMDY0OFY1Ljg2MDY0QzcuOTc3MzYgNS41OTAwNiA3Ljc2NDU1IDUuMzcxNDQgNy41IDUuMzcxNDRDNy4yMzU5NyA1LjM3MTQ0IDcuMDIyNjQgNS41OTAwNiA3LjAyMjY0IDUuODYwNjRWMTEuMDY0OEM3LjAyMjY0IDExLjMzNTUgNy4yMzU5NyAxMS41NTQgNy41IDExLjU1NFpNMTMuNTIyNyAyLjYyMzdIMTAuNTE2NVYyLjEzNDQ5QzEwLjUxNjUgMS41MDk5OSAxMC4wMTg4IDEgOS40MDkzOCAxSDUuNjAwNzdDNC45ODk5NiAxLjAwMTMzIDQuNDk1MTggMS41MDg0NiA0LjQ5Mzc1IDIuMTM0NDlWMi42MjM3SDEuNDc3MzZDMS4yMTMzMyAyLjYyMzcgMSAyLjg0MjI2IDEgMy4xMTI4NEMxIDMuMzgzNDkgMS4yMTMzMyAzLjYwMjA1IDEuNDc3MzYgMy42MDIwNUgyLjg5OTI0VjEyLjIwOThDMi44OTkyNCAxMy4xOTg1IDMuNjgxMzggMTQgNC42NDYxMSAxNEgxMC4zNTRDMTEuMzE4NyAxNCAxMi4xMDA4IDEzLjE5ODUgMTIuMTAwOCAxMi4yMDk4VjMuNTkxNjZIMTMuNTIyN0MxMy43ODY3IDMuNTkxNjYgMTQgMy4zNzMwMyAxNCAzLjEwMjQ1QzE0IDIuODMxODcgMTMuNzg2NyAyLjYyMzcgMTMuNTIyNyAyLjYyMzdaTTUuNDM4MjYgMi4xMzQ0OUM1LjQzODI2IDIuMDQwODMgNS41MDkzNyAxLjk2Nzk2IDUuNjAwNzYgMS45Njc5Nkg5LjQwOTM4QzkuNTAwNzYgMS45Njc5NiA5LjU3MTQ5IDIuMDQwODMgOS41NzE0OSAyLjEzNDQ5VjIuNjIzN0g1LjQzODI2VjIuMTM0NDlaTTExLjE0NjEgMTIuMjA5OEMxMS4xNDYxIDEyLjY1NzMgMTAuNzkwNiAxMy4wMjE2IDEwLjM1NDMgMTMuMDIxNkg0LjY0NjExQzQuMjA4ODUgMTMuMDIwOSAzLjg1NDYgMTIuNjU3OCAzLjg1Mzg5IDEyLjIwOThWMy41OTE2NkgxMS4xNDYxVjEyLjIwOThaIiBmaWxsPSIjRjUyMjJEIi8+Cjwvc3ZnPgo=">
                            </a>
                        </div>
                    </li>
            `;
    remarkStr = remarkStr.replace(":liStr","").replace(":mp4Str","")
    layui.layer.open({
        type: 1,
        title: '采集图片模块',
        btn: ['取消'],
        area: ['80%', '80%'],
        content: $(remarkStr).html(),
        id: new Date().getTime(),
        move: false,
        success: async function (layero, index) {
            prodTpl_mainImg = [];
            prodTpl_assistImg = [];
            layui.form.render();
            

            // 采集图片
            layero.find(".CPMCollectPictures").click(function(){
                CPMCollectPicturesFunc(str,mp4s)
            })
            // 打包下载
            layero.find(".CPMPackageDownload").click(function(){
                CPMPackageDownloadFunc(layero)
            })
            // 一键删除
            layero.find(".CPMOneClickDelete").click(function(){
                CPMOneClickDeleteFunc()
            })
            // 修改图片尺寸
            layero.find(".CPMChangeWH").click(function(){
                let checkData = serializeObject($("#capturePictureModuleForm"))
                if(!checkData.check){
                    return layer.msg("请选择需要修改的图片")
                }
                let checkArr = checkData.check.split(",")
                $(".capturePictureModuleUl").find("li").each(function(index){
                    let _this = this
                    if(checkArr.indexOf($(_this).attr("li-index")) != -1){
                        // 修改为1000*1000
                        getImageBase64($(_this).find("img[name=imgSrc]").attr("src").split("?")[0])
                            .then((response)=>{
                                // 返回的是文件对象，使用变量接收即可
                                getBase64And1000(response)
                                    .then(function(base64){
                                        $(_this).find("[name=imgSrcHide]").val($(_this).find("img[name=imgSrc]").attr("src"))
                                        $(_this).find("img[name=imgSrc]").attr("src",base64)
                                        $(_this).find("[name=imgSrcHide]").attr("size",$(_this).find(".photo-tips>span").text())
                                        $(_this).find(".photo-tips>span").text("1000 * 1000")
                                    },function(err){
                                        console.log(err);//打印异常信息
                                    });
                            })
                            .catch((e)=> {
                                    console.error(e)
                                }
                            )
                    }
                })
            })
            // 本地图片
            // layero.find(".CPMLocalImg").click(function(){
                layui.upload.render({
                    elem: '.CPMLocalImg' //绑定元素
                    ,url:''
                    ,multiple: true
                    ,accept: 'images'
                    ,auto: false //选择文件后不自动上传
                    ,choose: function(obj){
                        //将每次选择的文件追加到文件队列
                        var files = obj.pushFile();
                        //预读本地文件，如果是多文件，则会遍历。(不支持ie8/9)
                        obj.preview(function(index, file, result){
                            tpl_calculateImageSize(result).then(function({width, height}) {
                                if(width > 500 || height > 500){
                                    liStr = str.replaceAll(":src",result).replaceAll(":liIndex",new Date().getTime()).replaceAll(":photoWH",width + " * " + height).replaceAll(":itemId",'本地图片')
                                    $(".capturePictureModuleUl").append(liStr)
                                } else {
                                    layer.alert("图片大小必须大于500*500!",{icon:2})
                                }
                                layui.form.render('checkbox','capturePictureModuleForm')
                            });
                            // 取消全选
                            $("[lay-filter='capturePictureModuleUlCheckAll']").prop("checked",false);
                        });
                    }
                });
            // })
            // 一键撤销
            layero.find(".CPMOneClickUndo").click(function(){
                let checkData = serializeObject($("#capturePictureModuleForm"))
                if(!checkData.check){
                    layer.msg("请选择需要撤销的图片")
                    return false;
                }
                let checkArr = checkData.check.split(",")
                $(".capturePictureModuleUl").find("li").each(function(index) {
                    let _this = this
                    if (checkArr.indexOf($(_this).attr("li-index")) != -1 && $(_this).find("[name=imgSrcHide]").attr("size") != '') {
                        // if($(_this).find("[name=imgSrcHide]").val() == ''){
                        //     layer.alert("没有修改过的图片",{icon:2})
                        // }else{
                            // 恢复图片
                            $(_this).find("img[name=imgSrc]").attr("src",$(_this).find("[name=imgSrcHide]").val())
                            $(_this).find("[name=imgSrcHide]").val("")
                            // 恢复尺寸
                            $(_this).find(".photo-tips>span").text($(_this).find("[name=imgSrcHide]").attr("size"))
                            $(_this).find("[name=imgSrcHide]").attr("size","")
                        // }
                    }
                })
                layer.alert("撤销成功",{icon:1})
            })
            // 应用至主图
            layero.find(".CPMApplyToMain").click(function(){
                CPMApplyToImgFunc("mainImgContains")
            })
            // 应用至辅图
            layero.find(".CPMApplyToOther").click(function(){
                CPMApplyToImgFunc("assistImgContains")
            })
            // 暂时只需要支持smt
            $('#collectCopyImagesCom').click(function() {
                navigator.clipboard.readText().then(text => {
                    let collectInfo = JSON.parse(text)
                    let images = collectInfo.images || []
                    if (images.length === 0) {
                        return layer.msg('没有图片可以粘贴', { icon: 2 });
                    }
                    images?.forEach((item,index) => {
                        let newItem = item?.split('?')[0]
                        let itemSplitLen = newItem?.split(".")
                        if(itemSplitLen[itemSplitLen.length-1] != "mp4"){
                            tpl_calculateImageSize(item).then(function({width, height}) {
                                if(width > 500 || height > 500){
                                    liStr = str.replaceAll(":src",item).replaceAll(":liIndex",new Date().getTime()).replaceAll(":photoWH",width + " * " + height).replaceAll(":itemId", 'image')
                                    $(".capturePictureModuleUl").append(liStr)
                                }
                                layui.form.render('checkbox','capturePictureModuleForm')
                            });
                            // 取消全选
                            $("[lay-filter='capturePictureModuleUlCheckAll']").prop("checked",false);
                        }else{
                            // 视频
                            liStr = mp4s.replaceAll(":src",item).replaceAll(":liIndex",new Date().getTime())
                            $(".captureMP4ModuleUl").append(liStr)
                        }
                    })
                }).catch(err => {
                    layer.msg('读取剪贴板中的文本失败', { icon: 2 });
                })
            })
        }
    })
}
// 回车查询
function NoSubmit(ev) {
    if(ev.keyCode == 13) {
        $(".CPMCollectPictures").click()
        return false;
    }
    return true;
}
// 点击图片勾选|取消
$(document).on("click",".capturePictureModuleUl .photo",function(event){
    $(this).parents("li").find("input[type=checkbox]").next().click()
})
// 应用至主图/辅图
function CPMApplyToImgFunc(_container){
    let container
    if(_container == "mainImgContains"){
        container = $('[data-id=mainImgContains]')
    }else if(_container == "assistImgContains"){
        container = $('[data-id=assistImgContains]')
    }
    let checkData = serializeObject($("#capturePictureModuleForm"))
    if(!checkData.check){
        return layer.msg("请选择需要应用的图片")
    }
    let checkArr = checkData.check.split(","),checkFlag = false;
    // 目的为采集图片&视频添加的图片数量校验
    if(container.find('.uploadImgUL li').length*1 >= container.attr("data-maxImg")){
        return layer.alert("图片数量已达到上限",{icon:2})
    }
    $(".capturePictureModuleUl").find("li").each(function(index) {
        let _this = this
        let liIndex = $(_this).attr("li-index") // 当前索引，用以记录是否应用过主图/辅图
        // prodTpl_mainImg.indexOf(src) == -1  打开弹窗后，从没有应用过主图/辅图
        if(checkArr.indexOf($(_this).attr("li-index")) != -1 && prodTpl_mainImg.indexOf(liIndex) == -1 && $(_this).find(".photo-tips>span").text() == '1000 * 1000') {
            if(_container == "mainImgContains"){
                prodTpl_mainImg.push(liIndex)
            }else if(_container == "assistImgContains"){
                prodTpl_assistImg.push(liIndex)
            }
            let reg = /^\s*data:([a-z]+\/[a-z0-9-+.]+(;[a-z-]+=[a-z0-9-]+)?)?(;base64)?,([a-z0-9!$&',()*+;=\-._~:@\/?%\s]*?)\s*$/i;
            // 判断图片是BASE64还是图片链接
            if(reg.test($(_this).find("img[name=imgSrc]").attr("src"))){
                $.ajax({
                    type: "POST",
                    url: ctx + "/preProdDev/getBase64ImgForTpl.html",
                    data: {"AreaImgKey":$(_this).find("img[name=imgSrc]").attr("src")},
                    success: function (returnData) {
                        proTpl_showImg(returnData, container, false, false,false);
                        layui.form.render('checkbox')
                    },error:function(err){
                        layer.alert(err.msg,{icon:2})
                    }
                })
            }else{
                $.ajax({
                    type: "post",
                    url: ctx + "/prodTpl/getOnlinePic.html",
                    data: 'urlString=' + [$(_this).find("img[name=imgSrc]").attr("src")],
                    success: function(data) {
                        if (data) {
                            if (data.code == '0000') {
                                proTpl_showImg(data.data, container, false, false,false);
                                layui.form.render('checkbox')
                            } else if (data.code == '9999') {
                                layer.msg(data.msg, { icon: 5 });
                            }
                        } else {
                            layer.msg('图片上传失败!', { icon: 2 })
                        }
                    }
                });
            }
        }else if(checkArr.indexOf($(_this).attr("li-index")) != -1 && $(_this).find(".photo-tips>span").text() != '1000 * 1000'){ // 选中图片包含非1000*1000
            checkFlag = true;
        }
    })
    // 非1000*1000，报错提醒
    if(checkFlag){
        layer.alert("只有1000*1000的图片支持应用",{icon:2})
    }else{
        layer.alert("应用成功",{icon:1})
    }
}

// 采集图片
function CPMCollectPicturesFunc(str,mp4s) {
    let liStr = ''
    let data = $("[name=CPMCollectPicturesUrl]").val();
    // 暂时测试使用
    if(data == ''){
        layer.msg("请输入采集链接")
        return false;
    }

    commonReturnPromise({
        url: '/lms/prodSupplier/getWangDuoYunCrawlerApiInformation.html',
        type:'POST',
        contentType:"application/json",
        params:JSON.stringify({"Url":data,"categoryForecast":"false"})
    }).then(res => {
        if(res.sku == undefined){
            res.sku = []
        }
        let newArr = [...res.images, ...res.desc,...res.sku]
        let itemId = res.item_id;
        newArr.forEach((item,index) => {
            let newItem = item?.split('?')[0]
            let itemSplitLen = newItem?.split(".")
            if(itemSplitLen[itemSplitLen.length-1] != "mp4"){
                // 图片
                // let imgUrl = item
                // imgUrl.indexOf(".jpg") != -1?imgUrl = item.split(".jpg")[0] + ".jpg":'';
                // imgUrl.indexOf(".JPG") != -1?imgUrl = item.split(".JPG")[0] + ".JPG":'';
                // tpl_calculateImageSize(imgUrl).then(function({width, height}) {
                tpl_calculateImageSize(item).then(function({width, height}) {
                    if(width > 500 || height > 500){
                        liStr = str.replaceAll(":src",item).replaceAll(":liIndex",new Date().getTime()).replaceAll(":photoWH",width + " * " + height).replaceAll(":itemId",itemId)
                        $(".capturePictureModuleUl").append(liStr)
                    }
                    layui.form.render('checkbox','capturePictureModuleForm')
                });
                // 取消全选
                $("[lay-filter='capturePictureModuleUlCheckAll']").prop("checked",false);
            }else{
                // 视频
                liStr = mp4s.replaceAll(":src",item).replaceAll(":liIndex",new Date().getTime())
                $(".captureMP4ModuleUl").append(liStr)
            }
        })
    }).catch(err => {
        layer.msg(err, { icon: 2 });
    })
}
// 播放视频
$(document).off("click", ".captureMp4ModuleOpen").on("click", ".captureMp4ModuleOpen", function () {
    let video = $(this).closest("li").find("[name=imgSrc]").attr("src");
    layer.open({
        type: 2, //Layer提供了5种层类型。可传入的值有：0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）,
        shade:0.1, //遮罩层透明度
        area:['850px','500px'], //弹出层宽高
        title:'视频',//弹出层标题
        id:new Date().getTime(),
        content: video
    });
})

// 应用到基础模板
$(document).off("click", ".captureMp4ModuleApply").on("click", ".captureMp4ModuleApply", function () {
    let videoUrl = $(this).closest("li").find("[name=imgSrc]").attr("src");
    var formData = new FormData();
    formData.append("savePath", templateVedioUploadPath);
    formData.append("url", videoUrl);

    loading.show()
    $.ajax({
        url: imageUpDomain + "file/uploadFileByUrl",
        type : 'POST',
        async : true,
        data : formData,
        // 告诉jQuery不要去处理发送的数据
        processData : false,
        // 告诉jQuery不要去设置Content-Type请求头
        contentType : false,
        success: function (data) {
            loading.hide()
            if (data.code == '0000') {
                let mp4Str = `
                        <video width="200" height="200" controls>
                            <source name="mp4Url" src=":src"  type="video/mp4">
                            您的浏览器不支持 HTML5 video 标签。
                        </video>`
                mp4Str = mp4Str.replace(":src",templateVedioVisitPath + data.data)
                $(".mp4Contain").html(mp4Str)
                layer.alert("应用成功",{icon:1})
            } else {
                layer.msg(data.msg)
            }
        },
        complete: function () {
            loading.hide()
        }
    })
})

// 删除
$(document).on("click",".capturePictureModuleDelete",function(){
    $(this).closest("li").remove()
    $("[lay-filter='capturePictureModuleUlCheckAll']").prop("checked",true);
    // 全部删除取消全选
    if($('.capturePictureModuleUl').find('li').length == 0){
        $("[lay-filter='capturePictureModuleUlCheckAll']").prop("checked",false);
    }
    // 判断剩余checkbox是否全选
    $('.capturePictureModuleUl').find('input[type=checkbox]').each(function(index){
        if($(this).prop("checked") == false){
            $("[lay-filter='capturePictureModuleUlCheckAll']").prop("checked",false);
            return false;// 只结束each循环
        }
    })
    layui.form.render('checkbox','capturePictureModuleForm')
})

// 一键删除
function CPMOneClickDeleteFunc() {
    let checkData = serializeObject($("#capturePictureModuleForm"))
    if(!checkData.check){
        return layer.msg("请选择需要删除的图片")
    }
    let checkArr = checkData.check.split(",")
    $(".capturePictureModuleUl").find("li").each(function(index){
        let _this = this
        if(checkArr.indexOf($(_this).attr("li-index")) != -1){
            $(_this).remove()
        }
    })
    // 全部删除取消全选
    if($('.capturePictureModuleUl').find('li').length == 0){
        $("[lay-filter='capturePictureModuleUlCheckAll']").prop("checked",false);
        layui.form.render('checkbox','capturePictureModuleForm')
    }
}
$(document).on("click",".capturePictureModuleCropping", function(){
    let _this = this,
    imgSrc = $(_this).closest("li").find("[name=imgSrc]").attr("src")
    layer.open({
        type: 1,
        title: '',
        area: ['600px', '500px'],
        btn: ['裁剪', '关闭'],
        move:false,
        content: $('#collect_cropImage_layer').html(),
        success: function() {
            document.querySelector('#collectCroppingImg').src = imgSrc;
            $('#collectCroppingImg').cropper({
              viewMode:0,
              minContainerWidth: 400,
              minContainerHeight: 400,
              dragMode:'move',
              aspectRatio: 1
            })
        },
        yes: function(index, layero) {
            // 开始裁剪 并将图片压缩到 1000*1000
            let parts = imgSrc.split(';base64,');
            let contentType = parts[0].split(':')[1];
            let newType = contentType.indexOf('jpeg')>-1 ? 'image/png': contentType;
            let url = $('#collectCroppingImg').cropper('getCroppedCanvas').toDataURL(`${newType}`)
            //处理base64图片,把透明部分转换成白底
            commonConvertToWithWhiteBackground(url, contentType).then(whiteBase64 => {
              // console.log('处理完成以后的base64', whiteBase64);
              // 修改为1000*1000
              getImageBase64(whiteBase64).then((response)=>{
                // 返回的是文件对象，使用变量接收即可
                getBase64And1000(response)
                    .then(function(base64){
                        $(_this).closest("li").find("[name=imgSrcHide]").val($(_this).find("img[name=imgSrc]").attr("src"))
                        $(_this).closest("li").find("img[name=imgSrc]").attr("src",base64)
                        $(_this).closest("li").find("[name=imgSrcHide]").attr("size",$(_this).find(".photo-tips>span").text())
                        $(_this).closest("li").find(".photo-tips>span").text("1000 * 1000")
                    },function(err){
                        console.log(err);//打印异常信息
                    });
            })
            .catch((e)=> {
                    console.error(e)
                }
            )
            layer.close(index);
              })
          }
      })
})

//把透明部分转换成白底图
function commonConvertToWithWhiteBackground(base64Image, type) {
  return new Promise(function(resolve){
    // 创建一个Image对象
    let img = new Image();
    // 加载Base64图片，当加载完成时触发onload事件
    img.src = base64Image;
    img.onload = function() {
        // 创建canvas元素，其大小与图片相同
        let canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        let ctx = canvas.getContext('2d');

        // 绘制白色背景
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 在白色背景上绘制原始图片
        ctx.drawImage(img, 0, 0);

        // 将canvas的内容转换为JPG格式的Base64编码字符串
        let base64IMG= canvas.toDataURL(type);

        // 输出处理后的Base64编码字符串（也可以根据需要进行其他处理）
        console.log(base64IMG);
        resolve(base64IMG);
    };
  });
}

// 将Base64编码的图片字符串转换为Blob对象的函数
function commonBase64ToBlob(base64) {
  let parts = base64.split(';base64,');
  let contentType = parts[0].split(':')[1];
  let raw = window.atob(parts[1]);
  let rawLength = raw.length;
  let uInt8Array = new Uint8Array(rawLength);
  for (let i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }

  return new Blob([uInt8Array], { type: contentType });
}

//传入base64结构返回链接
function commonReturnUrlFromBase64(base64, path=''){
  let blobFile = commonBase64ToBlob(base64);
  let parts = base64.split(';base64,');
  let contentType = parts[0].split(':')[1];
  let suffix = 'png';
  if(contentType == 'image/jpeg'){
    suffix='jpg';
  }else{
    suffix='png';
  }
  // 根据时间戳生成文件名
  let timestamp = new Date().getTime();
  let fileName = 'image_' + timestamp + `.${suffix}`;
  // 创建File对象
  let file = new File([blobFile], fileName, { type: 'png' });
  let formData = new FormData();
  formData.append("file", file);
  formData.append("remainDay", 999999);
  formData.append("path", path);
  return new Promise(function(resolve, reject){
    $.ajax({
      type: "post",
      url: "/lms/prodImageAliyun/uploadFile",
      data: formData,
      cache: false,
      contentType: false,
      processData: false,
      dataType: "json",
      beforeSend: function () {
        loading.show();
      },
      success: function (data) {
        loading.hide();
        if (data.code == "0000") {
          resolve(data.msg || '');
        } else {
          reject(data.msg);
        }
      },
      error: function(){
        loading.hide();
      }
    });
  })
}

//base64上传并回显-ztt20240109优化
function commonBase64ToUrl(_this,base64){
  commonReturnUrlFromBase64(base64).then(res => {
    $(_this).closest("li").find("[name=imgSrcHide]").val($(_this).find("img[name=imgSrc]").attr("src"));
    $(_this).closest("li").find("img[name=imgSrc]").attr("src",res);
    $(_this).closest("li").find("[name=imgSrcHide]").attr("size",$(_this).find(".photo-tips>span").text());
    //关闭弹窗
    MTImageEditor.close();
  }).catch(err => {
    layer.msg(err, {icon:2});
  });
}

//点击按钮-调用美图功能
function btnTomeituImg(obj, type=''){
  let imgUrl = $(obj).closest('li').find('.ImgDivIn img').attr('src');
  let newImgUrl = imgUrl ? imgUrl.split('!size')[0]: '';
  let result = newImgUrl.match(/.*\//);
  let defaultPath = result[0]
  MTImageEditor.openImage(newImgUrl);
  //保存回调base64：图片数据
  MTImageEditor.saveImage((base64) => {
    commonReturnUrlFromBase64(base64, defaultPath).then(res => {
      console.log('图片接口返回', res);
      $(obj).closest('li').find('.ImgDivIn img').attr('src', res + '!size=150x150');
      if(type){
        $(obj).closest('li').find(`[name=${type}]`).val(res);
      }
      //关闭弹窗
      MTImageEditor.close();
    }).catch(err => {
      layer.msg(err, {icon:2});
    });
  });
}

//美图秀秀
$(document).on("click",".capturePictureModuleMeitu", function(){
  let _this = this,
  imgSrc = $(_this).closest("li").find("[name=imgSrc]").attr("src");
  // console.log(imgSrc);
  if(imgSrc.indexOf('base64')>-1){
    commonReturnUrlFromBase64(imgSrc).then(res => {
      // console.log('res图片链接', res);
      MTImageEditor.openImage(res);
    }).catch(err => {
    layer.msg(err, {icon:2});
  });
  }else{
    MTImageEditor.openImage(imgSrc);
  }
  //保存回调base64：图片数据
  MTImageEditor.saveImage((base64) => {
    commonBase64ToUrl(_this,base64);
  });
});
// 图片标尺
let moduleRulerCanvas;
function sliderScroll(btn, contain, value, min, max, field){
    btn.slider({
        range: 'min',
        value: value, //默认值
        min: min, //最小值
        max: max, //最大值
        slide: function(event, ui) {
            contain.html(ui.value)
            // 获取Group实例
            let group = moduleRulerCanvas._activeObject;
            if(group){
                // 获取group中的item数组
                let items = group.getObjects();
                if(field == 'fontSize'){
                    items[1].set(field,ui.value);
                } else if(field == 'strokeWidth'){
                    items[0].set(field,ui.value/5);
                }
                // console.log('0 => ', items[0].width,'1 => ', items[1].width,'1 => scaleX', items[1].scaleX,'group => ', group.width)
                // if(items[0].width > items[1].width * items[1].scaleX){
                //     group.set('width',items[0].width)
                // }else{
                //     group.set('width',items[1].width * items[1].scaleX)
                // }
                // 重新设置group的items，这将会更新item的位置
                group.set('objects', items);
                moduleRulerCanvas.renderAll();
            }
        }
    });
}
$(document).off("click",".capturePictureModuleRuler").on("click",".capturePictureModuleRuler", function(e){
    let scale = $(e.target).closest("li").find(".photo-tips span").text();
    let width = scale?.split(" * ")[0],
        height = scale?.split(" * ")[1],
        isMin = width > 1000,
        widthMin = width / 2,
        heightMin = height / 2;

    var remarkStr = `<script type="text/html">
    <div style="display:flex;justify-content: space-evenly;">
        <form class="layui-form" onsubmit="return false">
            <div class="layui-form-item">
                <div class="layui-input-block">
                    <a class="layui-btn layui-btn-xs undo">上一步</a>
                    <a class="layui-btn layui-btn-xs redo">下一步</a>
                    <a class="layui-btn layui-btn-xs reset">还原</a>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">标尺文本</label>
                <div class="layui-input-block">
                    <input type="radio" name="collectRulerImageTxtRadio" value="0" title="长度" checked lay-filter="collectRulerImageTxtRadio">
                    <input type="radio" name="collectRulerImageTxtRadio" value="1" title="文本" lay-filter="collectRulerImageTxtRadio">
                </div>
            </div>
            <div class="layui-form-item">
                <div class="layui-input-block showInput">
                    <div name="txtWidth" style="display:none;"></div>
                    <input name="txt" class="layui-input" style="width:90%;display:inline;" >
                    <span>CM</span>
                </div>
            </div>
            <div class="layui-form-item showTxt">
                <div style="padding-left: 120px; display: flex; justify-content: space-between;">
                    <span class="showInchTxt"></span>
                    <input type="checkbox" name="showInch" title="同时展示英寸" lay-skin="primary" checked lay-filter="collectRulerImageTxtCheckbox">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">文本颜色</label>
                <div class="layui-input-block">
                    <input class="layui-input formInputColor" name="txtColor" type="color">
                </div>
            </div>
            <div class="layui-form-item">
                <div class="layui-input-block">
                    <div class="gray-c slider-range-collect1-txt">18</div>
                    <div class="w250 v-top m-top10 m-bottom20 ui-slider ui-slider-horizontal ui-widget ui-widget-content ui-corner-all slider-range-collect1">
                    <div class="ui-slider-range ui-widget-header ui-corner-all ui-slider-range-min"></div>
                        <span class="ui-slider-handle ui-state-default ui-corner-all" tabindex="0" style="left: 44.4444%;"></span>
                    </div>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">标尺颜色</label>
                <div class="layui-input-block">
                    <input class="layui-input formInputColor" name="rulerColor" type="color">
                </div>
            </div>
            <div class="layui-form-item">
                <div class="layui-input-block">
                    <div class="gray-c slider-range-collect2-txt">2</div>
                    <div class="w250 v-top m-top10 m-bottom20 ui-slider ui-slider-horizontal ui-widget ui-widget-content ui-corner-all slider-range-collect2">
                    <div class="ui-slider-range ui-widget-header ui-corner-all ui-slider-range-min"></div>
                        <span class="ui-slider-handle ui-state-default ui-corner-all" tabindex="0" style="left: 44.4444%;"></span>
                    </div>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">文本位置</label>
                <div class="layui-input-block" style="z-index:9999;">
                    <input type="radio" value="0" name="collectRulerImageRadio" title="标尺下方" checked lay-filter="collectRulerImageRadio">
                    <input type="radio" value="1" name="collectRulerImageRadio" title="标尺上方" lay-filter="collectRulerImageRadio">
                </div>
            </div>
        </form>
        <div>
            <canvas id="c" width="${isMin?widthMin:width}" height="${isMin?heightMin:height}" style="border:1px solid #ccc;"></canvas>
        </div>
    </div>
</script>`
    let _this = this,
        imgSrc = $(_this).closest("li").find("[name=imgSrc]").attr("src");
    layer.open({
        type: 1,
        title: '产品标尺',
        area: ['80%', '750px'],
        btn: ['保存', '关闭'],
        move:false,
        content: $(remarkStr).html(),
        success: function(layero) {
            layui.form.render();
            sliderScroll(layero.find(".slider-range-collect1"), layero.find('.slider-range-collect1-txt'), 18, 12, 64, 'fontSize');
            sliderScroll(layero.find(".slider-range-collect2"), layero.find('.slider-range-collect2-txt'), 2, 1, 10, 'strokeWidth');
            // 文本&长度
            layui.form.on('radio(collectRulerImageTxtRadio)', function(data) {
                let value = data.value;
                if(value == 0){ // 长度
                    // 样式显示&隐藏
                    layero.find(".showInput input").css({'width':'90%','display':'inline'})
                    layero.find(".showTxt").show();
                    layero.find(".showInput span").show()
                }else if(value == 1){ // 文本
                    layero.find(".showTxt").hide()
                    layero.find(".showInput span").hide()
                    layero.find(".showInput input").css({'width':'100%'})
                }
                layero.find("[name=txt]").val('')
                layero.find(".showInchTxt").text('')
                let group = canvas._activeObject;
                if(group){
                    let items = group.getObjects();
                    // 切换，文本置空
                    items[1].set('text','')
                    group.set('objects', items);
                    canvas.renderAll();
                }
            })
            // 是否展示英寸
            layui.form.on('checkbox(collectRulerImageTxtCheckbox)', function(data) {
                let isChecked = data.elem.checked;
                var txt = layero.find('[name=txt]').val()?.trim();
                if(isChecked){
                    // 展示英寸
                    let n = (1 * txt * 0.3937007874).toFixed(2)
                    layero.find(".showInchTxt").text(n + 'inch')
                    txt = `${txt}cm/${n}inch`
                }else{
                    layero.find(".showInchTxt").text('')
                    txt = `${txt}cm`
                }
                let group = canvas._activeObject;
                if(group) {
                    // group.set('width',_getWidth(txt) < 100 ? 100 : _getWidth(txt))
                    let items = group.getObjects();
                    items[1].set('text', txt);
                    group.set('objects', items);
                    canvas.renderAll();
                }
            })
            // 文本在标尺上方/下方
            layui.form.on('radio(collectRulerImageRadio)', function(data) {
                let value = data.value;
                let group = canvas._activeObject;
                let items = group.getObjects();
                // items[0].top > items[1].top // 文字在下      items[0].top < items[1].top // 文字在上
                // value == 0 // 标尺下方，文字在下       value == 1 // 标尺上方，文字在上
                if((value == 0 && items[0].top > items[1].top) || (value == 1 && items[0].top < items[1].top)){
                    let temp = items[0].top;
                    items[0].set('top',items[1].top)
                    items[1].set('top',temp)
                }
                group.set('objects', items);
                canvas.renderAll();
            })
            //文字所在元素的背景色(监听input的onchange事件)
            layero.find('[name=txtColor]').on('change', function(){
                var bgColor = $(this).val();
                let group = canvas._activeObject;
                let items = group.getObjects();
                items[1].set('fill',bgColor);
                group.set('objects', items);
                canvas.renderAll();
            });
            // 标尺颜色
            layero.find('[name=rulerColor]').on('change', function(){
                var bgColor = $(this).val();
                let group = canvas._activeObject;
                let items = group.getObjects();
                items[0].set('fill',bgColor);
                items[0].set('stroke',bgColor);
                group.set('objects', items);
                canvas.renderAll();
            });
            //文本
            layero.find('[name=txt]').on('focus input propertychange', function(){
                var txt = $(this).val();
                // 选择为长度时，是否展示英寸
                if(layero.find("[name=collectRulerImageTxtRadio]:checked").val() == 0){ // 选择长度
                    if( layero.find("[name=showInch]").is(':checked')){ // 展示英寸
                        // if(!(0 <= txt && txt < 1000)){
                        //     return layer.alert("输入数据错误",{icon: 7})
                        // }
                        let n = (1 * txt * 0.3937007874).toFixed(2)
                        layero.find(".showInchTxt").text(n + 'inch')
                        txt = `${txt}cm/${n}inch`
                    }else{ // 不展示
                        layero.find(".showInchTxt").text('')
                        txt = `${txt}cm`
                    }
                }

                let group = canvas._activeObject;
                if(group) {
                    // group.set('width',_getWidth(txt) < 100 ? 100 : _getWidth(txt))
                    let items = group.getObjects();
                    items[1].set('text', txt);
                    group.set('objects', items);
                    canvas.renderAll();
                }
            });
            let lineArray = []; // 这个数组将用来存储所有添加到Canvas的线段
            let removedLines = []; // 这个数组将用于存储所有被撤销的线段
            // 还原
            layero.find('.reset').on("click",function(){
                canvas.clear();
                initBg();
            })
            //ztt20240430上一步
            layero.find('.undo').on("click",function(){
              if (lineArray.length > 0) {
                // 获取数组中的最后一个线段
                let lastLine = lineArray.pop();
                // 从Canvas中移除线段
                canvas.remove(lastLine);
                // 将被撤销的线段添加到removedLines数组中
                removedLines.push(lastLine);
              }
            });
            //ztt20240430下一步
            layero.find('.redo').on("click",function(){
              // 检查是否有线段可恢复
              if (removedLines.length > 0) {
                // 从removedLines数组中取出最后一个被撤销的线段
                let lastRemovedLine = removedLines.pop();

                // 将线段重新添加到Canvas
                canvas.add(lastRemovedLine);

                // 将线段重新添加到lineArray数组中
                lineArray.push(lastRemovedLine);
              }
            });
            var canvas = moduleRulerCanvas = this.__canvas = new fabric.Canvas('c');
            function initBg(){
                // 填充背景图
                fabric.Image.fromURL(imgSrc, (img) => {
                    canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
                        scaleX: canvas.width / img.width, // 计算出图片要拉伸的宽度
                        scaleY: canvas.height / img.height // 计算出图片要拉伸的高度
                    })
                })

                fabric.Object.prototype.transparentCorners = false;
                fabric.Object.prototype.cornerColor = '#ffffff';
                fabric.Object.prototype.cornerStrokeColor = '#000000'; // 定位圆点边框
                fabric.Object.prototype.cornerStyle = 'circle';

            }
            initBg()

            function Add(txt, style) {
            // ┝━━━━━━━━━━━━┥  ├────────┤ ━ ─
                var txt1 = new fabric.IText('▇━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━▇', {
                    originX: 'center',
                    originY: 'center',
                    top: style.txt1.top,
                    // angle: 90,
                    fill: style.txt1.fill,
                    scaleX: 0.2,
                    stroke: style.txt1.fill,
                    strokeWidth: style.txt1.strokeWidth/5,
                    fontSize: 14
                });

                var txt2 = new fabric.IText(txt, {
                    textAlign: 'center',
                    originX: 'center',
                    originY: 'center',
                    scaleX: 1,
                    top: style.txt2.top,
                    fill: style.txt2.fill,
                    fontSize: style.txt2.fontSize
                });


                var group = new fabric.Group([txt1, txt2], {
                    // objectCaching: false, // 不缓存！！！
                    // width: style.width,
                    left: style.left,
                    top: style.top
                });
                canvas.add(group);
                // 将线段存储到数组中
                lineArray.push(group);
                group.setControlVisible("tl",false) // 左上角
                group.setControlVisible("bl",false) // 左下角
                group.setControlVisible("tr",false) // 右上角
                group.setControlVisible("br",false) // 右下角
                group.setControlVisible("mt",false) // 中顶
                group.setControlVisible("mb",false) // 中下
                canvas.setActiveObject(group);
                // 放大缩小文字大小不变
                function updateControlsScaling(obj) {
                    var txt2 = obj.target.item(1),
                        // txt1 = obj.target.item(0),
                        group = obj.target;
                    txt2.set('scaleX', 1 / group.scaleX);
                    canvas.renderAll();
                }
                canvas.on({
                    // 'object:moving': updateControls,
                    'object:scaling': updateControlsScaling,
                    // 'object:resizing': updateControls,
                    // 'object:rotating': updateControls,
                    // 'object:skewing': updateControls
                });
            }
            // Add();
            function deleteObject(eventData, transform) {
                var target = transform;
                var canvas = target.canvas;
                canvas.remove(target);
                canvas.requestRenderAll();
            }

            function _getWidth(txt){
                let fontSize = layero.find(".slider-range-collect1-txt").text()*1;
                layero.find("[name=txtWidth]").text(txt);
                layero.find("[name=txtWidth]").css("fontSize",fontSize + 'px');
                return layero.find("[name=txtWidth]").width()
            }
            // 键盘删除选中项--ztt20240430新增Delete
            document.addEventListener("keydown", function(event) {
                if((event.key == 'Backspace' || event.key == 'Delete') && !$(event.target).hasClass("layui-input")){
                    deleteObject('',canvas._activeObject)
                }
            });
            // 鼠标点击添加--ztt20240430改成双击添加
            document.addEventListener("dblclick", function(event) {
                if(event.button == 0){ // 鼠标左键
                    if($(event.target).css("cursor") == 'default' && $(event.target).hasClass("upper-canvas")){
                        let txt = layero.find('[name=txt]').val()?.trim();
                        // 选择为长度时，是否展示英寸
                        if(layero.find("[name=collectRulerImageTxtRadio]:checked").val() == 0) { // 选择长度
                            if (layero.find("[name=showInch]").is(':checked')) { // 勾选展示
                                let n = (1 * txt * 0.3937007874).toFixed(2)
                                layero.find(".showInchTxt").text(n + 'inch')
                                txt = `${txt}cm/${n}inch`
                            }else{
                                txt = `${txt}cm`
                            }
                        }
                        // 添加
                        let collectRulerImageRadio = layero.find('[name=collectRulerImageRadio]:checked').val(),
                        fontSize = layero.find(".slider-range-collect1-txt").text()*1;
                        let style = {
                            left: event.layerX,
                            top: event.layerY,
                            // width: _getWidth(txt) < 100 ? 100 : _getWidth(txt),
                            txt1:{
                                fill: layero.find("[name=rulerColor]").val(),
                                strokeWidth: Number(layero.find(".slider-range-collect2-txt").text())/20,
                                top: collectRulerImageRadio == 0 ? 0 : 30,
                            },
                            txt2:{
                                fill: layero.find("[name=txtColor]").val(),
                                fontSize,
                                top:collectRulerImageRadio == 0 ? 30 : 0,
                            }
                        };
                        Add(txt, style)
                    }else if($(event.target).css("cursor") == 'move' && $(event.target).hasClass("upper-canvas")){
                        let items = canvas._activeObject.getObjects();
                        if(items[1].text.includes("cm/") && items[1].text.includes("inch")){ // 长度
                            // 样式显示&隐藏
                            layero.find(".showInput input").css({'width':'90%','display':'inline'})
                            layero.find(".showTxt").show();
                            layero.find(".showInput span").show()
                            // 回显赋值
                            layero.find('[name=txt]').val(items[1].text?.split("cm/")[0])
                            layero.find('.showInchTxt').text(items[1].text?.split("cm/")[1]?.split("inch")[0])
                            layero.find('[name=showInch]').prop('checked',true)
                            layero.find('[name=collectRulerImageTxtRadio][value=0]').prop('checked',true)
                        }else if(items[1].text.includes("cm")){ // 长度，不展示英寸
                            // 样式显示&隐藏
                            layero.find(".showInput input").css({'width':'90%','display':'inline'})
                            layero.find(".showTxt").show();
                            layero.find(".showInput span").show()
                            // 回显赋值
                            layero.find('[name=txt]').val(items[1].text?.split("cm")[0])
                            layero.find('.showInchTxt').text('')
                            layero.find('[name=showInch]').prop('checked',false)
                            layero.find('[name=collectRulerImageTxtRadio][value=0]').prop('checked',true)
                        }else{ // 文本
                            layero.find(".showTxt").hide()
                            layero.find(".showInput span").hide()
                            layero.find(".showInput input").css({'width':'100%'})
                            // 回显赋值
                            layero.find('[name=txt]').val(items[1].text)
                            layero.find('.showInchTxt').text('')
                            layero.find('[name=collectRulerImageTxtRadio][value=1]').prop('checked',true)
                        }
                        // 文本颜色
                        layero.find('[name=txtColor]').val(items[1].fill)
                        layero.find('[name=rulerColor]').val(items[0].fill)
                        // 字体大小-滑块
                        sliderScroll(layero.find(".slider-range-collect1"), layero.find('.slider-range-collect1-txt'), items[1].fontSize, 12, 64,'fontSize');
                        sliderScroll(layero.find(".slider-range-collect2"), layero.find('.slider-range-collect2-txt'), items[0].strokeWidth/5, 1, 10,'strokeWidth');
                        // 字体大小-文字显示
                        layero.find('.slider-range-collect1-txt').html(items[1].fontSize)
                        layero.find('.slider-range-collect2-txt').html(items[0].strokeWidth)
                        // 文本位置
                        if(items[0].top > items[1].top){ // 标尺下方
                            layero.find('[name=collectRulerImageRadio][value=1]').prop('checked',true)
                        }else{
                            layero.find('[name=collectRulerImageRadio][value=0]').prop('checked',true)
                        }
                        layui.form.render();
                    }
                }
            });
        },
        yes: function(index, layero) {
            let reg = /^\s*data:([a-z]+\/[a-z0-9-+.]+(;[a-z-]+=[a-z0-9-]+)?)?(;base64)?,([a-z0-9!$&',()*+;=\-._~:/@?%\s]*?)\s*$/i;
            let type = ''
            if (reg.test(imgSrc)) { // 如果是base64格式
                if (imgSrc.includes("jpeg")) {
                    type = 'jpeg'
                } else {
                    type = 'png'
                }
            }else{// 如果是链接
                if(imgSrc.includes(".png")){
                    type = 'png'
                } else {
                    type = 'jpeg'
                }
            }
            // 保存为原图大小
            if(isMin){
                moduleRulerCanvas.viewportTransform = [2, 0, 0, 2, 0, 0]
                moduleRulerCanvas.setWidth(width);
                moduleRulerCanvas.setHeight(height);
            }
            if(type == 'png'){
                $(e.target).closest("li").find("[name=imgSrc]").prop("src",moduleRulerCanvas.toDataURL('png')) // base64填充
            }else{
                convertPngToJpg(moduleRulerCanvas.toDataURL(type), function(jpgBase64) {
                    // 输出转换后的Base64编码的JPG图片
                    $(e.target).closest("li").find("[name=imgSrc]").prop("src",jpgBase64)
                })
            }
            layer.close(index);
        }
    })
});
// pngBase64转jpgBase64
function convertPngToJpg(pngBase64, callback) {
    // 创建一个Image对象
    const img = new Image();
    img.onload = function() {
        // 创建一个Canvas元素
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        // 获取Canvas的2D上下文
        const ctx = canvas.getContext('2d');
        // 将图片绘制到Canvas上
        ctx.drawImage(img, 0, 0);

        // 将Canvas内容转换为JPG格式的Base64字符串
        const jpgBase64 = canvas.toDataURL('image/jpeg', 1.0);
        callback(jpgBase64);
    };
    img.src = pngBase64;
}
//将base64转换成file
function dataURLtoBlob(dataurl, name) {//base64转file
    var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n)
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
    }
    return new File([u8arr], name, {
        type: mime,
    })
}

$(document).off("click",".capturePictureCutOut").on("click",".capturePictureCutOut", function(){
    let that = this,
        url = $(that).closest("li").find("[name=imgSrc]").attr("src");
    let reg =
        /^\s*data:([a-z]+\/[a-z0-9-+.]+(;[a-z-]+=[a-z0-9-]+)?)?(;base64)?,([a-z0-9!$&',()*+;=\-._~:/@?%\s]*?)\s*$/i;

    if (reg.test(url)) {
        // 需要抠图的图片url是base64
        let type = ''
        if(url.includes("jpeg")){
            type = 'image/jpeg'
        } else {
            type = 'image/png'
        }
        let file = dataURLtoBlob(url, '1.jpg')
        let formData = new FormData()
        formData.append("files",file)
        $.ajax({
            url: ctx + '/imageProcess/photoshopByFile',
            data: formData,
            type: "POST",
            async: true,
            cache: false,
            contentType: false,
            processData: false,
            dataType: 'json',
            beforeSend: function () {
                loading.show();
            },
            success: function (res) {
                loading.hide();
                if (res.code == '0000') {
                    getLmsImageUrl(res.data,that,type);
                }else{
                    layer.msg(res.msg, { icon: 2 });
                }
            },
            error: function (error) {
                loading.hide();
                layer.msg(error, { icon: 2 });
            }
        })
    } else {
        // 需要抠图的图片url为网络链接
        commonReturnPromise({
            url: "/lms/imageProcess/photoshopByUrl",
            contentType: "application/json;charset=UTF-8",
            type: "post",
            params: JSON.stringify([url]),
        }).then((res) => {
            loading.show();
            let type = ''
            if(url.includes(".png")){
                type = 'image/png'
            } else {
                type = 'image/jpeg'
            }
            getLmsImageUrl(res,that,type);
        });
    }
})

function getLmsImageUrl(res,that,type){
    if (Array.isArray(res) && res[0].state) {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        let image = new Image();
        image.src = res[0].imageUrl;
        image.setAttribute("crossOrigin", "Anonymous");
        image.onload = function (e) {
            canvas.width = this.width;
            canvas.height = this.height;
            if(type == 'image/png'){
                ctx.fillStyle = "rgba(255, 255, 255, 0)";
            }else {
                ctx.fillStyle = "rgba(255, 255, 255, 1)";
            }
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            // // 在 canvas 上绘制原始图片，并缩放到目标尺寸
            ctx.drawImage(image, 0, 0);
            // // 将 canvas 转换为新的图片文件
            // //   canvasDom.toDataURL('image/jpeg') 图片是黑色底的
            // // canvasDom.toDataURL('image/png') 图片是透明底的
            // const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            // for (let i = 0; i < imageData.data.length; i += 4) {
            //     // 当该像素是透明的，则设置成白色
            //     if (imageData.data[i + 3] === 0) {
            //         imageData.data[i] = 255;
            //         imageData.data[i + 1] = 255;
            //         imageData.data[i + 2] = 255;
            //         imageData.data[i + 3] = 255;
            //     }
            // }
            // ctx.putImageData(imageData, 0, 0);
            const newImageURL = canvas.toDataURL(type);

            // 将图片base64转换为图片链接
            let reg =
                /^\s*data:([a-z]+\/[a-z0-9-+.]+(;[a-z-]+=[a-z0-9-]+)?)?(;base64)?,([a-z0-9!$&',()*+;=\-._~:/@?%\s]*?)\s*$/i;

            if (reg.test(newImageURL)) {
                $.ajax({
                    type: "POST",
                    url: "/lms/preProdDev/getBase64Img.html",
                    data: { AreaImgKey: newImageURL },
                    async: false,
                    success: function (resUrl) {
                        $(that).closest("li").find("[name=imgSrc]").attr("src",resUrl)
                        loading.hide()
                        layer.msg("操作成功", { icon: 1 });
                    },
                    error: function (err) {
                        loading.hide()
                        layer.msg("操作失败", { icon: 2 });
                    },
                });
            } else {
                loading.hide()
                $(that).closest("li").find("[name=imgSrc]").attr("src",newImageURL)
            }
        };
    } else {
        loading.hide()
        layer.msg("操作失败", { icon: 2 });
    }
}
// 图片翻译
$(document).on("click",".capturePictureModuleTranslate", function(){
    $('.translate_dialog').show()
    layui.form.render('select')
})
$(document).on("click",".languageTranslate", function(){
    loading.show()
    let _this = this,
    imgSrc = $(_this).closest("li").find("[name=imgSrc]").attr("src"),obj={},url='';
    let reg = /^\s*data:([a-z]+\/[a-z0-9-+.]+(;[a-z-]+=[a-z0-9-]+)?)?(;base64)?,([a-z0-9!$&',()*+;=\-._~:@\/?%\s]*?)\s*$/i;
    // 判断图片是BASE64还是图片链接
    if(reg.test(imgSrc)){
        obj = {
            base64:imgSrc.split(";base64,")[1],
            source: $(_this).closest("li").find('[name=transferSource]').val(),
            target: $(_this).closest("li").find('[name=transferTarget]').val()
        };
        url = '/imageProcess/imageTranslateByBase64';
    }else{
        obj = {
            url:imgSrc,
            source: $(_this).closest("li").find('[name=transferSource]').val(),
            target: $(_this).closest("li").find('[name=transferTarget]').val()
        };
        url = '/imageProcess/imageTranslateByUrl';
    }
    commonReturnPromiseRes({
        type: 'POST',
        contentType: 'application/json;charset=UTF-8',
        url: `${ctx}${url}`,
        params:JSON.stringify(obj)
    }).then(res => {
        loading.hide()
        if (res.code == "0000") {
            layer.alert(res.msg,{icon:1})
            $(_this).closest("li").find("[name=imgSrcHide]").val(imgSrc)
            $(_this).closest("li").find("img[name=imgSrc]").attr("src",res.data)
        }else{
            layer.alert(res.msg,{icon:2})
        }
    }).catch(err => {
        loading.hide()
        layer.alert(err,{icon:2})
    })
})

// 打包下载
function CPMPackageDownloadFunc(layero){
    let imgArr = [],checkData = serializeObject($('#capturePictureModuleForm'))
    if(!checkData.check){
        return layer.msg("请选择需要打包的图片")
    }
    let checkArr = checkData.check.split(",")
    let liLen = layero.find(".capturePictureModuleUl .layui-form-checked").length;
    layero.find(".capturePictureModuleUl>li").each(function(index) {
        let _this = this;
        if(checkArr.indexOf($(_this).attr("li-index")) != -1){
            let src = $(_this).find("img[name=imgSrc]").attr("src");
            getImageBase64(src.split("?")[0])
                .then((response)=>{
                    imgArr.push({
                        url: response,
                        fileName: $(_this).attr("item-id") +"_" + index
                    })
                    if(imgArr.length == liLen){
                        packageImages(imgArr,getNowTime())
                    }
                })
        }
    });
    // packageImages(imgArr,getNowTime())
}

// 获取当前年月日，时分秒
function getNowTime() {
    const yy = new Date().getFullYear()
    const MM = (new Date().getMonth() + 1) < 10 ? '0' + (new Date().getMonth() + 1) : (new Date().getMonth() + 1)
    const dd = new Date().getDate() < 10 ? '0' + new Date().getDate() : new Date().getDate()
    const HH = new Date().getHours() < 10 ? '0' + new Date().getHours() : new Date().getHours()
    const mm = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes()
    const ss = new Date().getSeconds() < 10 ? '0' + new Date().getSeconds() : new Date().getSeconds()
    return ""+yy+MM+dd+HH+mm+ss
}
// lms/unauditorder/listenum.html
// let orderPlatAndPersonData = {
//     aliexpress:['smt专员','smt客服专员'],
//     amazon:['amazon专员','amazon客服'],
//     amazonMCF:['amazon专员','amazon客服'],
//     lazada:['lazada专员','lazada客服专员'],
//     walmart:['walmart专员','walmart客服'],
//     shopee:['shopee专员','shopee客服'],
//     mercado:['mercado专员','mercado客服'],
//     wish:['wish专员','wish客服'],
//     ebay:['ebay专员','ebay客服专员'],
//     joom:['joom专员','joom客服'],
//     temu:['temu专员','temu客服专员'],
//     tiktok:['tiktok专员','tiktok客服'],
//     coupang:['coupang专员','coupang客服'],
//     fyndiq:['fyndiq专员','fyndiq客服']
// }
let orderPlatAndPersonData = {};
(function () {
    $.ajax({
        type: "get",
        url: "/lms/platorder/init/plat/builtInRole",
        success: function(res) {
            if (res.code == '0000') {
                res.data.forEach(item => {
                    orderPlatAndPersonData[item.platCode] = item.ruleNameStr;
                })
            } else if (res.code == '9999') {
                layer.msg(res.msg, { icon: 2 });
            }
        },error:function(err){
            layer.msg(err, { icon: 2 })
        }
    });
} ());

function getPersonAndOrgsByRole(params){
    return commonReturnPromise({
        // url: '/lms/sys/getPersonAndOrgsByRole.html',
        url: '/lms/sys/getPersonAndOrg',
        params: params
    })
}
function orderliststorebyplatcode(params){
    return commonReturnPromise({
        url: '/lms/sys/orderliststorebyplatcode.html',
        params
    })
}

//初始化渲染角色类型: 销售1&客服2&主管3&组长4
function commonInitRenderRoleType(prefix){
  let formDom = $(`#${prefix}Form`);
  let userSelect = formDom.find('.users_hp_custom');
  let orgSelect = formDom.find('.orgs_hp_custom');
  let filter = `${prefix}_salerAndcustomSelectFilter`;
  let roleType = $(`select[lay-filter=${filter}]`).val();
  let platCode = formDom.find('[name=platCode]').val();
  getPersonAndOrgsByRole({
    platCode: '',
    roleType: roleType
  }).then(res =>{
      // 初始化销售员||客服专员||主管||组长
      let userJSON = dealUser_org(res && res.userList || [])
      displayMultiSelect_user(userSelect, userJSON.all)
      
      layui.form.on(`select(${filter})`, function(obj){
        if(!platCode){
          getPersonAndOrgsByRole({
            platCode: '',
            roleType: obj.value
          }).then(res => {
              // 销售&客服清空
              userSelect.empty()
              // 初始化销售员||客服专员
              let userJSON = dealUser_org(res && res.userList || []);
              displayMultiSelect_user(userSelect, userJSON.all);
              // 初始化部门
              orgSelect.empty()
              orgSelect.append(getAOption('',''))
              for (let i in res[0].orgTree) {
                  setOrgs(res[0].orgTree[i], orgSelect, 0)
              }
          });
        }
      })
  });
}

// 平台-部门-销售
function commonOrderAddOrg(prefix, form, platCode=''){
    let formDom = $(`#${prefix}Form`);
    // 1.销售；2.客服；type=salesperson:代表销售人员。type=customservicer:代表客服人员
    let salerAndcustomType = {1:'salesperson',2:'customservicer', 3: 'leaderId', 4: 'directorId'}
    let filter = `${prefix}_salerAndcustomSelectFilter`;
    let id = `${prefix}_salePersonsSelect`;
    let salerAndcustom = $(`[lay-filter=${filter}]`).val();
    let orgSelect = formDom.find('.orgs_hp_custom');
    var userSelect = formDom.find('.users_hp_custom');
    var userIsXm = userSelect.attr('xm-select') != null //用户下拉框是否多选
    var storeSelect = formDom.find('.users_hp_store_multi')
    storeSelect.data('platcode',platCode);
    //获取到当前的角色类型: 销售1&客服2&主管4&组长3
    let roleType = $(`select[lay-filter=${filter}]`).val();
    // 获取默认展示信息
    layui.use('formSelects', function () {
        let form = layui.form,
            formSelects = layui.formSelects;
        if(platCode == ''){
            // 部门 单选
            orgSelect.empty()
            // 销售1&客服2&主管4&组长3 多选
            userSelect.empty()
            // 店铺 多选
            storeSelect.empty()
            layui.form.render('select')
            formSelects.render(`${prefix}_salePersonsSelect`)
            formSelects.render(`${prefix}_store`)
            // return;
        }
        let obj = {
            roleNames:orderPlatAndPersonData[platCode]?orderPlatAndPersonData[platCode][salerAndcustom-1]:'',  // 角色名：专员||客服专员
        }
        Promise.all([
            getPersonAndOrgsByRole({
              platCode: platCode,
              roleType: roleType
            }),
            orderliststorebyplatcode({platCode:platCode})
        ]).then(res => {
            // 部门 单选
            orgSelect.empty()
            // 销售&客服&主管&组长 多选
            userSelect.empty()
            // 店铺 多选
            storeSelect.empty()
            // 只选择平台--start--------
            // 初始化部门
            orgSelect.append(getAOption('',''))
            for (var i in res[0].orgTree) {
                setOrgs(res[0].orgTree[i], orgSelect, 0)
            }
            // 初始化销售员||客服专员||主管||组长
            var userJSON = dealUser_org(res[0] &&res[0].userList || [])
            if (!userIsXm) {
                userSelect.append(getAOption('', ''))
                for (var i = 0; i < userJSON.all.length; ++i) {
                    userSelect.append(getAOption(userJSON.all[i].id, userJSON.all[i].userName))
                }
            } else {
                displayMultiSelect_user(userSelect, userJSON.all)
            }
            // 初始化店铺
            storeSelect.append(getAOption('',''))
            for (var i = 0; i < res[1].length; i++) {
                storeSelect.append(getAOption(res[1][i].id, res[1][i].storeAcct))
            }
            formSelects.render(`${prefix}_store`);
            // 只选择平台--end--------
            // 修改部门联动--start--------
            if (!$.isEmptyObject(orgSelect.attr('lay-filter'))) {
                orgsChange(orgSelect,userSelect,storeSelect,userJSON,userIsXm,platCode,prefix)
            }
            // 修改部门联动-end--------
            // 修改销售员联动--start--------
            if (storeSelect.length > 0) {
                if (!$.isEmptyObject(userSelect.attr('lay-filter'))) {
                    if (!userIsXm) {
                        layui.form.on('select(' + userSelect.attr('lay-filter') + ')', function (data) {
                            var orgId = orgSelect.val()
                            var salePersonId = userSelect.val()
                            selectStore(storeSelect, orderPlatAndPersonData[platCode][0], orgId, salePersonId, null, salerAndcustomType[salerAndcustom])
                            //手动触发一个事件
                            userSelect.trigger('change')
                        })
                    } else {
                        layui.formSelects.on(
                            userSelect.attr('xm-select'),
                            lms_debounce(function (id, vals, val, isAdd, isDisabled) {
                                var orgId = orgSelect.val()
                                var salePersonId = vals.length ? vals.map((item) => item.value).join() : ''
                                selectStore(storeSelect, orderPlatAndPersonData[platCode][0], orgId, salePersonId, null, salerAndcustomType[salerAndcustom])
                                //手动触发一个事件
                                userSelect.trigger('change')
                            }, true),
                            500
                        )
                    }
                }
            }
            // 修改销售员联动--end--------
            layui.form.render('select')
        })
        // 监听销售&客服下拉选择，change重新调接口
        form.on(`select(${filter})`, function (obj) {
          if(!platCode){
            getPersonAndOrgsByRole({
              platCode: '',
              roleType: obj.value
            }).then(res => {
                // 销售&客服清空
                userSelect.empty()
                // 初始化销售员||客服专员
                let userJSON = dealUser_org(res && res.userList || []);
                displayMultiSelect_user(userSelect, userJSON.all);
                //初始化部门
                orgSelect.empty()
                orgSelect.append(getAOption('',''))
                for (let i in res.orgTree) {
                    setOrgs(res.orgTree[i], orgSelect, 0)
                }
            });
          }else{
            Promise.all([
              getPersonAndOrgsByRole({
                platCode: platCode,
                roleType: obj.value
              }),orderliststorebyplatcode({platCode:platCode})
            ]).then(res => {
                // 销售&客服清空
                userSelect.empty()
                // 部门清空重新赋值
                orgSelect.val('')
                // 店铺清空
                storeSelect.empty()
                // 初始化销售员||客服专员
                var userJSON = dealUser_org(res[0]&& res[0].userList || [])
                if (!userIsXm) {
                    userSelect.append(getAOption('', ''))
                    for (var i = 0; i < userJSON.all.length; ++i) {
                        userSelect.append(getAOption(userJSON.all[i].id, userJSON.all[i].userName))
                    }
                } else {
                    displayMultiSelect_user(userSelect, userJSON.all)
                }
                //初始化部门
                orgSelect.empty()
                orgSelect.append(getAOption('',''))
                for (let i in res[0].orgTree) {
                    setOrgs(res[0].orgTree[i], orgSelect, 0)
                }
                // 初始化店铺
                storeSelect.append(getAOption('',''))
                for (var i = 0; i < res[1].length; i++) {
                    storeSelect.append(getAOption(res[1][i].id, res[1][i].storeAcct))
                }
                formSelects.render(id);
                formSelects.render(`${prefix}_store`);
                // // 执行自定义的部门选择事件
                // orgSelect.change()
                if (!$.isEmptyObject(orgSelect.attr('lay-filter'))) {
                    orgsChange(orgSelect,userSelect,storeSelect,userJSON,userIsXm,platCode,prefix)
                }
                layui.form.render('select')
            });
          }
           
        });
    })
}
/**
 * @description: 部门联动，主要userJSON，所以抽离出来了
 * @param {} orgSelect 部门dom
 * @param {} userSelect 用户dom
 * @param {} storeSelect 店铺dom
 * @param {} userJSON 用户人员对应的数据
 * @param {} userIsXm 用户下拉是否多选
 * @param {} platCode 平台
 */
function orgsChange(orgSelect,userSelect,storeSelect,userJSON,userIsXm,platCode,prefix){
    layui.use('formSelects', function () {
        let form = layui.form,
            formSelects = layui.formSelects;
        layui.form.on('select(' + orgSelect.attr('lay-filter') + ')', function(data) {
            //部门销售员联动
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
            userSelect.append(getAOption('', ''))
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
            let filter = `${prefix}_salerAndcustomSelectFilter`;
            let salerAndcustom = $(`[lay-filter=${filter}]`).val();
            // 1.销售；2.客服；type=salesperson:代表销售人员。type=customservicer:代表客服人员
            let salerAndcustomType = {1:'salesperson',2:'customservicer'}
            if (storeSelect.length > 0) {
                var orgId = orgSelect.val()
                var salePersonId = userSelect.val()
                selectStore(storeSelect, orderPlatAndPersonData[platCode][0], orgId, salePersonId, null, salerAndcustomType[salerAndcustom])
            }
            // 执行自定义的部门选择事件
            orgSelect.change()
            layui.form.render('select')
        })
    })
}

//订单统一处理新增销售员---ztt20220907
//参数应该是各个页面的独立前缀
function commonOrderAddSalePerson (prefix, form, platCode='') {
    layui.use('formSelects', function () {
        let formSelects = layui.formSelects;
        //id= prefix_salePersonsSelect
        let id = `${prefix}_salePersonsSelect`;
        let filter = `${prefix}_salerAndcustomSelectFilter`;
        commonReturnPromise({
            url: '/lms/salesplat/getCustomAndSaleServicerEnum',
            params: {
                platCode: platCode
            }
        }).then(res => {
            let targetVal = $(`select[lay-filter=${filter}]`).val();
            if (targetVal == 1) {
                commonRenderSelect(id, res.salePerson, { name: 'salesperson', code: 'salespersonId' }).then(function () {
                    formSelects.render(id);
                });
            } else {
                commonRenderSelect(id, res.customPerson, { name: 'customServicer', code: 'customServicerId' }).then(function () {
                    formSelects.render(id);
                });
            }
            form.on(`select(${filter})`, function (obj) {
                if (obj.value == 1) {
                    commonRenderSelect(id, res.salePerson, { name: 'salesperson', code: 'salespersonId' }).then(function () {
                        formSelects.render(id);
                    });
                } else {
                    commonRenderSelect(id, res.customPerson, { name: 'customServicer', code: 'customServicerId' }).then(function () {
                        formSelects.render(id);
                    });
                }
            });
        }).catch((err) => {
            layer.msg(err || '获取销售员接口报错', { icon: 2 });
        });
    });
}
function okk(id,e) {
    commonReturnPromise({
        url: '/lms/logistics/preview/' + id,
    }).then(res=>{
        if(res[0] && res[0].errMsg != undefined && res[0].errMsg != ''){
            layer.alert(res[0].errMsg,{icon:7})
        }else{
            window.open(res[0].labelUrl, '_blank');
        }
    })
    window.event.cancelBubble = true;
}

//订单统一的数量弹框提示---ztt20220908
function commonOrderConfirmLayer (length, fn) {
    layer.confirm(`勾选<font color="red" size="10">${length}</font>笔订单处理，请确认是否继续？`, {icon: 3, title:'提示'}, function(index){
        fn(index);
    });
}
/**
 * @description: layui table 删除某数据后,不用刷新,更改总数量
 * @param {*} cardId id
 * @param {array} data 删除的数据
 * @param {function} cb 搜索函数
 */
function commonChangeTotal(cardId,data,cb){
    let lastTotal = $(`#${cardId}`).find(".layui-tab-title li.layui-this>span").html()
    let delTotal = data.length
    let curToal = Number(lastTotal) - delTotal
    if(curToal){
        $(`#${cardId}`).find(".layui-tab-title li.layui-this>span").html(curToal)
        $(`#${cardId}`).find(".layui-laypage-count").text(`共 ${curToal} 条`)
    }else{
        cb()
    }
}

/**
 * @description: layui table 删除某数据后,静态更新table数据
 * @param {*} tableId
 * @param {*} key 唯一
 * @param {* array} data 删除的数据
 * @param {*} cardId
 * @param {function} searchCb 搜索函数
 */
function commonTableBatchDel(layuitableId,tableId,key,cardId,data,searchCb){
    let lastTotal = $(`#${cardId}`).find(".layui-tab-title li.layui-this>span").html()
    let delTotal = data.length
    let curToal = Number(lastTotal) - delTotal
    if(curToal){
        let _data = data.map(item=>item[key])
        $(`#${tableId}`).next().find('.layui-table-main>table>tbody>tr').each(function(){
            let checkedTr = $(this).find('input[name=layTableCheckbox]').prop('checked')
            if(checkedTr){
                $(this).remove()
            }
        })
        layui.table.cache[layuitableId].forEach((item,index)=>{
            if(_data.includes(item[key])){
                layui.table.cache[layuitableId][index] = []
            }
        })
        $(`#${cardId}`).find(".layui-tab-title li.layui-this>span").html(curToal)
        $(`#${cardId}`).find(".layui-laypage-count").text(`共 ${curToal} 条`)
    }else{
        searchCb()
    }
}

function commonTipsShow(dom){
    const contentshow = $(dom).attr('data-text');
    if(contentshow){
        layui.layer.tips(`<span style="color:#008B8B">${contentshow}</span>`, $(dom), {
            tips: [1, '#fff'],
            area: ['40%', 'auto'],
            time: 0,
        });
    }
}
function commonTipsHide(){
    layui.layer.closeAll("tips");
}

// 将英文引号转换中文引号
function comRepEnglishQuote(str){
    var val=str.replace(/"([^"]*)"/g ,"“$1”");
      if(val.indexOf('"')<0){
          return val;
      }
      return replaceDqm(val);
}

//公共进度条信息
function zttCommonProgressBar (obj, fn1) {
    layui.use('element', function(){
        let element = layui.element;
        //type=8为订单派至仓库,type=9为订单申请跟踪号,type=10为订单标记发货
        // let { type, ids } = obj;
        //创建进程接口
        let createBar = function (data) {
            return commonReturnPromise({
                url: '/lms/order/process/create',
                type: 'post',
                contentType: 'application/json',
                params: JSON.stringify(data),
                isLoading: false
            });
        };
        //获取进程过程接口
        let createQuery = function (processId) {
            return commonReturnPromise({
                url: '/lms/order/process/query',
                timeout: 90000,
                params: {
                    processId: processId
                },
                isLoading: false
            });
        };
        createBar(obj).then(res => {
          layer.open({
              type: 1,
              title: '进度',
              area: ["700px", "93px"],
              id: Date.now(),
              closeBtn: 0,
              content: `
              <div style="padding:10px;">
                  <div class="layui-progress layui-progress-big" lay-showPercent="true">
                      <div class="layui-progress-bar layui-bg-blue" lay-percent="0/0" id="orderProgress"></div>
                  </div>
              </div>`,
              success: function (layero, index) {
                  
                      let { processId, totalNum } = res;
                      let count = 0;
                      let times = setInterval(function () {
                          createQuery(processId).then(queryRes => {
                              if (queryRes.errMsg && queryRes.errMsg.length > 0) {
                                  layer.msg(queryRes.errMsg);
                                  layer.close(index);
                                  clearInterval(times);
                                  return;
                              }
                              if (queryRes.batchResult && Object.keys(queryRes.batchResult).length > 0) {
                                  clearInterval(times);
                                  count = 0;
                                  fn1(queryRes.batchResult);
                                  $("#orderProgress").attr("lay-percent",`${totalNum}/${totalNum}`);
                                  element.init();
                                  layer.close(index);
                              } else {
                                  let { finishedNum } = queryRes;
                                  $("#orderProgress").attr("lay-percent", `${finishedNum}/${totalNum}`);
                                  element.init();
                              }
                          }).catch(()=> {
                            clearInterval(times);
                            layer.close(index);
                            layer.alert('操作失败,系统更新,请刷新页面重试!', {icon: 7});
                          })
                      }, 2000);
                  
              }
          });
        });
    });
}
function updataOrderRow_remarkBatch(gridOptionsData,noteContent,noteType){
    let _selRows = gridOptionsData.api.getSelectedRows();
    let creator = localStorage.getItem('lmsAppUserName') || '';
    let createTime = Date.now();
    let selRows = _selRows.map(item=>{
        item.platOrderNotes?item.platOrderNotes.push({
            noteContent:noteContent,
            noteType:noteType,
            createTime: createTime,
            creator: creator
        }):item.platOrderNotes = [{
            noteContent:noteContent,
            noteType:noteType,
            createTime: createTime,
            creator: creator
        }]
        return item
    })
    gridOptionsData.api.updateRowData({update: selRows});
}
function updataOrderRow_remark(data,gridOptionsData,noteContent,noteType){
    let creator = localStorage.getItem('lmsAppUserName') || '';
    let createTime = Date.now();
    data.platOrderNotes?data.platOrderNotes.push({
      noteContent:noteContent,
      noteType:noteType,
      createTime: createTime,
      creator: creator
    }):data.platOrderNotes = [{
        noteContent:noteContent,
        noteType:noteType,
        createTime: createTime,
        creator: creator
    }];
    gridOptionsData.api.updateRowData({update: [data]});
}
 // 播放视频
$(document).off("click", ".common_play_video").on("click", ".common_play_video", function () {
    let that = this;
    let video = $(this).data("video");
    layer.open({
        type: 2, //Layer提供了5种层类型。可传入的值有：0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）,
        shade: 0.1, //遮罩层透明度
        area: ['850px', '500px'], //弹出层宽高
        title: '视频',//弹出层标题
        id: new Date().getTime(),
        content: video
    });
});

function zttTestImg(url) {
    if (/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(url)) {
        return true;
    } else {
        return false;
    }
}


/**
 * 不刷新表格 移除操作已操作数据的函数封装
 * @param {Object} obj 选中的数据
 */
function zttCommonRemoveDataHandle (obj) {
    return new Promise((resolve) => {
        let { selectedIds, gridOptions, tableData, errIds } = obj;
        let newData = [];
        let successIds = []; //选中数据操作成功的ID数组集合
        selectedIds.forEach(item => {
            if (!errIds.includes(item.toString())) {
                successIds.push(Number(item));
            }
        });
        console.log('成功的数据', successIds);
        // tableData.forEach(item => {
        //     if (!successIds.includes(Number(item.id))) {
        //         newData.push(item);
        //     }
        // });
        //重新执行表格渲染
        // gridOptions.api.setRowData(newData);
        // 这样写是为了删除后滚动条还在当前位置
        tableData.forEach(item => {
            if (successIds.includes(Number(item.id))) {
                newData.push(item);
            }
        });
        gridOptions.api.updateRowData({ remove: newData });
        resolve({
            // newData: newData,
            successIds: successIds || []
        });
    })
}

/**
 * 不刷新表格 更新已操作数据的函数封装
 * @param {Object} obj 选中的数据
 */
function zttCommonUpdataDataHandle (obj) {
    return new Promise((resolve) => {
        let { selectedIds, errIds } = obj;
        let successIds = []; //选中数据操作成功的ID数组集合
        selectedIds.forEach(item => {
            if (!errIds.includes(item.toString())) {
                successIds.push(Number(item));
            }
        });
        resolve({
            successIds: successIds || []
        });
    })
}


// 模板图片
// limit,existImgs,cb,parentDom,param
// param：{prodPIds：[]}
// param：{prodPSkus:[]}
// param：{prodTempIds:[]}
// param：{prodSSkus:[]}
function comPickImageTpl(obj,platCode,isNeedImgLimit=true){
    const {laytpl,form} = layui
    obj.param['platCode'] = platCode
    let checkedImgList = []
    commonReturnPromise({
        url: '/lms/prodTpl/getTemplateImageList',
        type: 'post',
        params: JSON.stringify(obj.param),
        contentType: 'application/json;charset=UTF-8'
    }).then(res=>{
        layui.layer.open({
            type: 1,
            title: isNeedImgLimit ? `模板图片-当前可选${obj.limit-obj.existImgs}张图片` : '模板图片',
            btn:['确认','取消'],
            area:['1000px','800px'],
            id: Date.now(),
            success:function(layero){
                layui.view(this.id).render('route/iframe/commonImageTpl').done(function () {
                    const getTpl = layero.find('#common_image_tpl').html()
                    const view = layero.find('#common_image_container');
                    res["platCode"] = platCode
                    laytpl(getTpl).render(res, function (html) {
                        view.html(html);
                        layero.find('.common_image_container-chooseTplImg').click(function(e){
                            const checkboxDOm = $(e.target).parent().find('input[name=tplUrl]')
                            if(checkboxDOm.prop('checked')){
                                checkboxDOm.prop('checked',false)
                            }else{
                                checkboxDOm.prop('checked',true)
                            }
                            form.render();
                        })
                        layero.find(".image-item").click(function () {
                            const checkboxDOm = $(this).find("input[name=tplUrl]");
                            const serialNumDom = $(this).find(".serial-number");
                            // 选中且从未选状态变成已选状态
                            if (
                              checkboxDOm.prop("checked") &&
                              serialNumDom.css("display") === "none"
                            ) {
                              checkedImgList.push({
                                shortUrl: checkboxDOm.attr("shortName"),
                                fullUrl: checkboxDOm.val(),
                                serialNumDom,
                              });
                              serialNumDom.css("display", "block");
                              serialNumDom.text(checkedImgList.length);
                            } else if (!checkboxDOm.prop("checked")) {
                              // 去掉当前选中的
                              const delIndex = Number(serialNumDom.text()) - 1;
                              // 未选且状态冲已选变成未选（未选的text为0）
                              if (delIndex > -1) {
                                serialNumDom.css("display", "none");
                                serialNumDom.text(0)
                                checkedImgList.splice(delIndex, 1);
                                // 将排在后面dom序号减一
                                checkedImgList.forEach((v, index) => {
                                  if (index >= delIndex) {
                                    v.serialNumDom.text(index + 1);
                                  }
                                });
                              }
                            }
                            form.render();
                          });
                        layero.find('.moreThanPart').hide()
                        layero.find('.showMore').click(function(){
                            layero.find('.showMore').text('')
                            layero.find('.moreThanPart').show()
                        })
                        form.render();
                    });
                })

            },
            yes:function(index,layero){
                checkedImgList
                const addImgs = checkedImgList.map(v=>v.fullUrl)
                // amazon新模板图片保存去除域名
                const fullImg = checkedImgList.map(v=>({ fullImg: v.fullUrl, shortName: v.shortUrl}))
                // $(layero).find('input[name=tplUrl]:checked').each(function(){
                //     addImgs.push($(this).val())
                //     let obj = {
                //         fullImg: $(this).val(),
                //         shortName: $(this).attr('shortName')
                //     }
                //     fullImg.push(obj)
                // })
                if(addImgs.length + Number(obj.existImgs) > Number(obj.limit)){
                    layer.msg(`图片数量不超过${obj.limit}`,{icon:7})
                }else{
                    obj.cb(addImgs, fullImg)
                    layui.layer.close(index)
                }
            }
        })
    })


}


/**
 * @description: 订单下载公用组件
 * @param {*} id 调用组件的元素id
 * @param {*} fn 获取导出数据
 * @param {*} fn2 回调函数
 * @return {*}
 */
function componentForOrderDownload (id, fn, fn2) {
  commonReturnPromise({
    url: '/lms/winitExportTemplate/queryPage.html',
    type: 'post',
    params: {
      page: 1,
      limit: 500,
      templateType: 3,
      orderBy: 'logistics_type_id asc'
    }
  }).then(res => {
    // console.log(res);
    //通过id渲染对应的下拉框结构
    let $dropdown = $('#'+ id);
    let $btn = $('<button class="layui-btn layui-btn-sm" type="button">导出</button>');
    let $dropUl = $(`<ul class="hidden"></ul>`);
    let $dropItems = (res || []).map(function (item) {
      return `<li data-id="${item.id}">${item.name}</li>`;
    }).join('');
    $dropUl.append($dropItems);
    $dropdown.append($btn).append($dropUl);

    //封装
    new dropButton(id);
    //监听点击事件
    $dropdown.on('click','li' ,function () {
      let id = $(this).attr('data-id');
      let txt = $(this).text();
      let orderIdArr = fn();
      let formData = new FormData();
      formData.append("tempId", id);
      if(orderIdArr.length == 0){
        if(!fn2){
          return layer.msg('请先选中要导出的数据', {icon:7});
        }else{
          layer.confirm('未选择订单,将以当前查询条件导出,是否确认?', {icon: 7}, function(index){
            let {submitData, url} = fn2(formData);
            transBlob({
              fileName: `订单数据-${txt}.xlsx`,
              url: url,
              formData: submitData
            }, 'post').then(function (result) {
              layer.msg(result || '导出成功', { icon: 1 });
              layer.close(index);
            }).catch(function (err) {
              console.log(err);
              layer.alert(err , { icon: 2 })
            });
          });
        }
      }else{
        formData.append("orderIds", orderIdArr.join(','));
        //调用接口,执行导出功能
        transBlob({
          fileName: `订单数据-${txt}.xlsx`,
          url: ctx + `/platorder/exportOrderInfo.html`,
          formData: formData
          // formData: JSON.stringify({
          //   orderIds: orderIdArr.join(','),
          //   tempId: id
          // }),
          // contentType: 'application/json'
        }, 'post').then(function (result) {
          console.log(result || '导出成功', { icon: 1 })
        }).catch(function (err) {
          layer.alert(err , { icon: 2 })
        });
      }
    });
  });
}

/**
 * @description: 派至仓库的订单加上速卖通物流跟踪号超期拦截
 * @param {array} idList 选中数据的id
 * @param {function} cb 回调函数
 */
function commCheckLogisticsCloseTime(idList, cb) {
    commonReturnPromise({
      url: "/lms/undispatch/checkLogisticsCloseTime",
      type: "post",
      contentType: "application/json",
      params: JSON.stringify(idList),
    })
      .then(res => {
        // 接口返回值中如果有errorList，就弹窗提示。
        // 选择是，把所有的id传到后续接口
        // 选择否，把接口返回的successList传到后续接口
        if (res.errorList.length) {
          let contentStr = `${res.errorList.join(",")}的跟踪号剩余天数小于等于3天，请确认是否继续派至仓库？`
          layer.confirm(
            contentStr,
            {
              btn: ["是", "否"], //按钮
              title: "提示",
              icon: 3,
            },
            function (layerIndex) {
              layer.close(layerIndex)
              cb(idList)
            },
            function () {
              if (res.successList.length) {
                cb(res.successList)
              }
            }
          )
        } else {
          cb(idList)
        }
      })
      .catch(err => {
        console.log("err :>> ", err)
      })
  }

/**
 * @description: 
 * @param {*} id 按钮id
 * @param {*} formId 表单id 需要设置form的lay-filter一致
 * @param {*} pageName 页面名称 唯一值 一级目录/耳机目录 + 该页面名称 
 * @param {*} searchBtnId 搜索id
 * @param {*} cb 赋值和搜索函数 多选和页签的需注意下 
 * @param {*} saveParam 不在表单内的参数 saveParam
 * 具体可参照订单-直邮订单-全部订单页面的传参
 */
function commonSaveSearchTpl({ id, formId, pageName, searchBtnId, cb, btnText, layerTitleText, saveParam=[] }) {
    // if()
    commonReturnPromise({
      url: "/lms/common/searchConditionConfig/list",
      params: JSON.stringify({ searchType: pageName.toUpperCase() }),
      contentType: "application/json",
      type: "post",
    }).then(res => {
      //通过id渲染对应的下拉框结构
      let $btnsContainer = $("#" + id)
      let $saveBtn = $(`<button class="layui-btn layui-btn-normal layui-btn-sm" type="button" id="${id}_save" style="padding-right:5px">${btnText||'保存搜索'}</button>`)
      const $dropIcon = $('<div class="common-save-dropdown"><i class="layui-icon">&#xe61a;</i></div>')
      let dropdownId = id + "_dropdown"
      let $dropdown = $(`<div id="${dropdownId}" class="common-save-dropdown-list hidden"></div>`)
      let $dropUl = $(`<ul></ul>`)
      let $dropItems= ''
      if(res.length){
          $dropItems =res.reverse().map(function (item) {
              return `<li data-id="${item.id}" class="item" data-value='${item.searchCondition}'><span class="text">${item.searchConditionName}</span><span><i class="layui-icon">&#xe640;</i></span>
              </li></li>`
            })
            .join("")
      }else{
        $dropItems = '<div class="common-save-dropdown-empty">暂无数据</div>'
      }
      $dropUl.append($dropItems)
      $dropdown.append($dropUl)
      $btnsContainer.append($saveBtn).append($dropIcon).append($dropdown)
  
      // 保存搜索条件
      $(`#${id}_save`).click(function () {
        layer.open({
          type: 1,
          title: `${layerTitleText || '保存自定义搜索条件' }`,
          id: Date.now(),
          area: ["400px", "200px"],
          btn: ["保存", "取消"],
          content: `<div class="layui-card">
        <div class="layui-card-body layui-form">
            <div class="layui-form-item">
                <div class="layui-col-md12 layui-col-lg12">
                    <label class="layui-form-label">名称<font class="fRed">*</font></label>
                    <div class="layui-input-block">
                        <input type="text" class="layui-input" name="searchConditionName">
                    </div>
                </div>
            </div>
        </div>
    </div>`,
          success: function (layero, index) {},
          yes: function (index, layero) {
            let obj = {}
            let searchCondition = JSON.stringify(serializeObject($("#" + formId)))
            if (saveParam?.length > 0) {
                let saveObj = {}
                saveParam.forEach(item => {
                    if (item.call == 'html') {
                        saveObj[item.name] = $('#' + item.id).html() || ''
                    }
                    if (item.call == 'check') {
                        saveObj[item.name] = $('#' + item.id).prop('checked') || false
                    }
                })
                searchCondition = JSON.stringify({...serializeObject($("#" + formId)), ...saveObj})
            }
            let params = {
              searchConditionName: layero.find("input[name=searchConditionName]").val(),
              searchType: pageName.toUpperCase(),
              searchCondition: searchCondition
            }
            if (params.searchConditionName === "") return layer.msg("请输入名称")
            commonReturnPromise({
              url: "/lms/common/searchConditionConfig/new",
              params: JSON.stringify(params),
              contentType: "application/json",
              type: "post",
            }).then(saveMsg => {
              layer.close(index)
              layer.msg(saveMsg || "保存成功")
              if(searchBtnId){
                  $("#" + searchBtnId).click()
              }
              //   添加数据
              commonReturnPromise({
                url: "/lms/common/searchConditionConfig/list",
                params: JSON.stringify({ searchType: pageName.toUpperCase() }),
                contentType: "application/json",
                type: "post",
              }).then(allData => {
                $dropUl.empty()
                let $_dropItems = allData.reverse()
                  .map(function (item) {
                    return `<li data-id="${item.id}" class="item" data-value='${item.searchCondition}'><span class="text">${item.searchConditionName}</span><span><i class="layui-icon">&#xe640;</i></span>
                    </li></li>`
                  })
                  .join("")
                $dropUl.append($_dropItems)
              })
            })
          },
        })
      })
  
      // 展开下拉列表
      $btnsContainer.find(".common-save-dropdown").click(function () {
        if ($dropdown.hasClass("hidden")) {
          $(this).find(".layui-icon").html("&#xe619;")
          $dropdown.removeClass("hidden")
        } else {
            $(this).find(".layui-icon").html("&#xe61a;")
          $dropdown.addClass("hidden")
        }
      })
  
      // 删除
      $dropdown.on("click", "li .layui-icon", function (e) {
        e.preventDefault()
        e.stopPropagation()
        const liDom = $(this).parents("li")
        const delId = liDom.data("id")
        const ulDom = $(this).parents("ul")
        commonReturnPromise({
          url: `/lms/common/searchConditionConfig/delete/${delId}`,
          type: "DELETE",
        }).then(() => {
          liDom.remove()
          layer.msg('删除成功')
        // 判断是否全部删除
        if(!ulDom.find('li').length){
            ulDom.append('<div class="common-save-dropdown-empty">暂无数据</div>')
        }
        })
      })
  
      //监听点击事件
      $dropdown.on("click", "li", function (e) {
        e.stopPropagation()
        e.preventDefault()
       let that = this;
        commonReturnPromise({
          url: "/lms/common/searchConditionConfig/list",
          params: JSON.stringify({ searchType: pageName.toUpperCase() }),
          contentType: "application/json",
          type: "post",
        }).then((newRes)=>{
          let liId = $(that).attr('data-id');
          let item = newRes.filter(item => item.id == liId)[0];
          let searchCondition = (item && item.searchCondition) ? new Function(`return ${item.searchCondition}`)(): {}
          if (cb) {
            cb(searchCondition)
          }
          $dropdown.addClass("hidden")
          $(that).parents('.common-save-dropdown-list').prev().find(".layui-icon").html("&#xe61a;")
        });
      })
    })
}

/**
 * @description: 监听更多查询条件 是否有选中值
 * @param {*} formId 表单id
 * @param {*} btnId 按钮id
 * @param {*} className 类名
 */
function commonHasValue(formId, btnId, className){
    let inputs = $(`#${formId} .${className}`).find('input');
    let count = 0;
    let showDom = $(`#${btnId} .hasValue`);
    for (let i = 0; i < inputs.length; i++){
        let item = inputs[i];
        let val = $(item).val();
        if ( val&& val != '请选择') {
            count++;
        }
    }
    if (count > 0) {
        showDom.html('<font color="red">(有值)</font>');
    } else {
        showDom.html('');
    }
}

function forTest() {
    console.log('test===')
}

/**
 * 封装一个datalist方法
 */
class Dropdown {
  constructor(element) {
    this.element = element;
    this.inputElement = element.querySelector("input");
    this.listElement = element.querySelector("ul");

    this.bindEvents();
  }

  bindEvents() {
    //点击非this.inputElement区域和this.listElement，隐藏下拉菜单
    document.addEventListener("click", (event) => {
      if (
        event.target !== this.inputElement &&
        event.target !== this.listElement
      ) {
        this.listElement.classList.remove("show");
      }
    });
    /**
     * this.inputElement获取焦点时，做如下操作：
     * 1. 如果this.inputElement的value为空，则显示下拉菜单
     * 2. 如果this.inputElement的value不为空，则分两种情况：
     * 2.1 如果this.inputElement的value在下拉菜单中，则显示下拉菜单,只显示this.inputElement的value对应的li
     * 2.2 如果this.inputElement的value不在下拉菜单中，则不显示下拉菜单
     */
    this.inputElement.addEventListener("focus", (event) => {
      if (this.listElement.querySelectorAll("li").length === 0) {
        this.listElement.classList.remove("show");
      }else{
        if (event.target.value.trim() === "") {
          this.listElement.classList.add("show");
        } else {
          const options = this.listElement.querySelectorAll("li");
          let flag = false;
          options.forEach((option) => {
            if (option.textContent.includes(event.target.value.trim())) {
              flag = true;
            }
          });
          if (flag) {
            this.listElement.classList.add("show");
            options.forEach((option) => {
              if (option.textContent.includes(event.target.value.trim())) {
                option.style.display = "block";
              } else {
                option.style.display = "none";
              }
            });
          } else {
            this.listElement.classList.remove("show");
          }
        }
      }
      
    });
    /**
     * this.inputElement的input事件时，做如下操作：
     * 1. 如果清空input的值,则显示全部下拉菜单
     * 2. 如果input的值不为空，则分两种情况：
     * 2.1 如果input的值在下拉菜单中，则显示下拉菜单,只显示input的值对应的li
     * 2.2 如果input的值不在下拉菜单中，则不显示下拉菜单
     */
    this.inputElement.addEventListener("input", (event) => {
      if (this.listElement.querySelectorAll("li").length === 0) {
        this.listElement.classList.remove("show");
      }else{
        if (event.target.value.trim() === "") {
          this.listElement.classList.add("show");
          const options = this.listElement.querySelectorAll("li");
          options.forEach((option) => {
            option.style.display = "block";
          });
        } else {
          const options = this.listElement.querySelectorAll("li");
          let flag = false;
          options.forEach((option) => {
            if (option.textContent.includes(event.target.value.trim())) {
              flag = true;
            }
          });
          if (flag) {
            this.listElement.classList.add("show");
            options.forEach((option) => {
              if (option.textContent.includes(event.target.value.trim())) {
                option.style.display = "block";
              } else {
                option.style.display = "none";
              }
            });
          } else {
            this.listElement.classList.remove("show");
          }
        }
      }
      
    });

    //点击this.listElement中的li，将li的内容赋值给this.inputElement,且隐藏下拉菜单
    this.listElement.addEventListener("click", (event) => {
      if (event.target.tagName === "LI") {
        this.inputElement.value = event.target.textContent;
        this.listElement.classList.remove("show");
      }
    });
  }
}

/** 
 * @description: 新增和修改订单，子订单销售金额加必填校验
 * @param {*} platOrderDetails 数组 商品具体信息
 * @return {*} 通过返回true
 */
function comVertifyPlatOrderDetails(platOrderDetails){
    // 子订单销售金额加必填校验
   let validPlatOrderDetailAmt = platOrderDetails.some(item=>{
        if(item.platOrderDetailAmt === ''||item.platOrderDetailAmt === ''){
            return true
        }
        return false
    })

    if(validPlatOrderDetailAmt){
        layer.msg('请填写订单销售金额')
        return false
    }
    return true
}
  
function vueIframeJumpAndSearch(param, platCode){
  sessionStorage.setItem('lastJumpParam', JSON.stringify(param));
  let platCodeArr = ['wish', 'ebay','fyndiq', 'Shopify','Walmart'];
  if(!platCodeArr.includes(platCode)){
      if(sessionStorage.getItem("lastJumpParam")){
        $("#"+ platCode +"Search").trigger('click');
      }
  }
}

//订单-通用查询物流方式
function commonOrderGetLogisticAjax(obj){
  let url = '';
  if(obj){
    url = `/lms/type/list?page=1&limit=999999&status=1&agent=&logisticsCompanyId=${obj.logisticsCompanyId}&specialType=直发物流`;
  }else{
    url = '/lms/type/list?page=1&limit=999999&status=1&specialType=直发物流';
  }
  return new Promise((resolve)=> {
    commonReturnPromise({
      url: url
    }).then(res => {
      let arr = [];
      (res || []).forEach(item => {
        let obj = {};
        obj.id = item.id;
        obj.name = item.name;
        arr.push(obj);
      });
      resolve(arr);
    });
  });
}
/**
 * @description: ebay辅图本地上传函数
 * @param {*} obj 
 * @return {*} obj.btn 点击的按钮元素
 * @return {*} obj.max 最大上传数量
 * @return {*} obj.imgNumDom 图片数量容器
 * @return {*} obj.imgDom 图片容器
 * @return {*} obj.fn 拖拽函数
 */
function ebayLocalImgHandleFn (obj) {
  let {btn, max, imgNumDom, imgDom, fn} = obj;
  //创建一个input元素
  let $input = $("<input type='file' name='file' class='disN'>");
  $(body).append($input);
  $(btn).on('click', function () {
      //上传之前先查看现有图片数量是否达到最大值
      let currentImgNum = Number($('#'+imgNumDom).text());
      if(currentImgNum >= max){
        return layer.msg(`最多只允许${max}张图片`, {icon:7});
      }
      //触发input点击事件
      $input.trigger('click');
  });
  $input.change(function (e) {
    let files = e.target.files;
    if (!files.length) return;
    let file = files[0];
    let formData = new FormData();
    formData.append('file', file);
    //把formData传递给后台,执行提交操作
    $.ajax({
        url: ctx + "/prodTpl/uploadPic.html",
        data: formData,
        type: "POST",
        async: true,
        cache: false,
        contentType: false,
        processData: false,
        dataType: 'json',
        beforeSend: function () {
            loading.show();
        },
        success: function (data) {
            loading.hide();
            if (data.code == '0000') {
                let childDiv = `
                    <div class="auxiliary-ebaySubSkuImgsChild">
                        <img src="${data.msg}" width="150" height="150" onerror="layui.admin.img_noFind()">
                        <div style="display:flex; justify-content: space-between">
                            <div class="opte" onclick="ebayImgRemove_handleFn(this, ${imgNumDom})">
                                <span class="removeImg">移除</span>
                            </div>
                            <div class="opte" onclick="ebayImgAdd_handleFn(this)">
                                <span style="color: cornflowerblue;cursor:pointer">添加至其他sku</span>
                            </div>
                        </div>
                    </div>`;
                $(imgDom).append(childDiv);
                //重新渲染拖拽
                fn();
                //更新数量:上传完成现有数量+1
                $('#'+imgNumDom).text(Number($('#'+imgNumDom).text())+1);
            } else {
                layer.msg(data.msg, { icon: 2 });
            }
            //传递完成以后清空input的value
            e.target.value = '';
        },
        error: function (error) {
            loading.hide();
            layer.msg(`${error.statusText}`, { icon: 2 });
        }
    })
    //传递完成以后清空input的value
    e.target.value = '';
    e.preventDefault();
    e.stopPropagation();
  });

}
/**
 * @description: ebay辅图网络上传函数
 * @param {*} obj 
 * @return {*} obj.btn 点击的按钮元素
 * @return {*} obj.max 最大上传数量
 * @return {*} obj.imgNumDom 图片数量容器
 * @return {*} obj.imgDom 图片容器
 * @return {*} obj.fn 拖拽函数
 */
function ebayNetImgHandleFn (obj) {
  let {btn, max, imgNumDom, imgDom, fn} = obj;
  //网络图片的点击事件
  let netImgLayer = `
      <div style="padding:20px;">
          <textarea placeholder="一行一个,多个回车分隔" class="layui-textarea"></textarea>
      </div>
  `;
  $(btn).on('click', function (event) {
      var _this = this;
      //上传之前先查看现有图片数量是否达到最大值
      let currentImgNum = Number($('#'+imgNumDom).text());
      if(currentImgNum >= max){
        return layer.msg(`最多只允许${max}张图片`, {icon:7});
      }
      layer.open({
          type: 1,
          title: '网络图片',
          area: ['600px', '400px'],
          content: netImgLayer,
          id: Date.now(),
          btn: ['保存', '关闭'],
          yes: function (index, layero) {
              var $val = layero.find('textarea').val();
              var allImgUrl = $val.split('\n');
              if (allImgUrl[0] == '') {
                  return layer.msg('url不能为空', { icon: 2 });
              }
              var totalCount = Number($('#'+imgNumDom).text());
              if (totalCount > +max) {
                  return layer.msg(`最多只允许${maxImgCount}张图片`, { icon: 7 });
              }
              for (let item of allImgUrl) {
                  let childDiv = `
                  <div class="auxiliary-ebaySubSkuImgsChild">
                        <img src="${item}" width="150" height="150" onerror="layui.admin.img_noFind()">
                        <div class="opte" onclick="ebayImgRemove_handleFn(this, ${imgNumDom})">
                            <span class="removeImg">移除</span>
                        </div>
                    </div>
                  `;
                  $(imgDom).append(childDiv);
                  //重新渲染拖拽
                  fn();
                  //更新数量:上传完成现有数量+1
                  $('#'+imgNumDom).text(Number($('#'+imgNumDom).text())+1);
              }
              layer.close(index);
          }
      });
      event.preventDefault();
      event.stopPropagation();
  });
}

//删除图片
function ebayImgRemove_handleFn(obj, imgNumDom){
  $(obj).parents('.auxiliary-ebaySubSkuImgsChild').remove();
  let currentNum = Number($(imgNumDom).text()) - 1;
  $(imgNumDom).text(currentNum);
}


//ztt-店铺公共授权功能
//根据店铺id查询已授权的角色和用户
function listAuthorizedRoleUserByStoreAcctIdAjax(id){
  return commonReturnPromise({
    url: `/lms/sys/listAuthorizedRoleUserByStoreAcctId?storeAcctId=${id}`
  });
}
//根据平台查询已授权的角色和用户
function listAuthorizedRoleUserByPlatCodeAjax(platCode){
  return commonReturnPromise({
    url: `/lms/sys/listAuthorizedRoleUserByPlatCode?platCode=${platCode}`
  });
}
//获取可用的用户
function getAvailableListUserAjax(){
  return commonReturnPromise({
    url: `/lms/sysuser/listUser.html`
  });
}
//获取可用的角色
function getAvailableListRoleAjax(){
  return commonReturnPromise({
    url: `/lms/sys/listAllRoles.html`,
    type: 'post'
  });
}

//拼接店铺/平台授权表格
function storeAndPlatCodeTableStr(type, data){
  let $table = $(`<table class="layui-table"></table>`);
  let $thead = $(`<thead><tr><th>类别</th><th>名称</th></tr></thead>`);
  if(type == 'store'){
    $thead = $(`<thead><tr><th>类别</th><th>名称</th><th>操作</th></tr></thead>`);
  }
  let tbodyStr = '<tbody>';
  let trStr = '';
  for(let i=0; i<data.length; i++){
    let item = data[i];
    let tr = '';
    if(type == 'store'){
      tr = `<tr>
      <td>${item.masterTypeStr}</td>
      <td>${item.masterValStr}</td>
      <td><span class="layui-btn layui-btn-xs storeCancelBtn" data-id="${item.id}">取消授权</span></td>
    </tr>`;
    }else{
    tr = `<tr>
      <td>${item.masterTypeStr}</td>
      <td>${item.masterValStr}</td>
    </tr>`;
    }
    trStr += tr;
  }
  trStr +='</tbody>';
  tbodyStr += trStr;
  $table.append($thead).append($(tbodyStr));
  return $table;
}

//组装弹框
function storeAndPlatCodeAuthLayer(){
  let $div = `<div class="layui-row layui-col-space30" style="padding:20px;height:80px;">
            <div class="layui-col-lg6 storeContainer">
            <h2>授权店铺</h2>
              <div class="layui-form layui-col-space10">
                <div class="layui-col-lg3"><span class="layui-btn layui-btn-sm storeAuthBtn">新增授权</span></div>
              </div>
              <div class="authTable" style="width:85%;height: calc(100vh - 150px);overflow-y: auto;"></div>
            </div>
            <div class="layui-col-lg6 platCodeContainer">
            <h2>授权平台</h2>
            <div class="authTable" style="width:85%;height: calc(100vh - 150px);overflow-y: auto;"></div>
            </div>
            </div>`;
  return $div;
}
//创建一个select复选框,渲染传入数据和类型(store/platCode)
function storeAndPlatCodeFormSelects(type,data){
  let $div = $('<div class="layui-col-lg9"></div>');
  let $select =$(`<select xm-select="storeAndPlatCodeAuthLayer_xm${type}"
  xm-select-search xm-select-search-type="dl" xm-select-skin="normal">`);
  let optStr = '';
  for(let i=0; i<data.length; i++){
    let item = data[i];
    //拼接option
    if(Object.keys(item).includes('userName')){
      optStr += `<option value="${item.id}">${item.userName}</option>`
    }else{
      optStr += `<option value="${item.id}">${item.name}</option>`
    }
  }
  $select.html(optStr);
  $div.append($select);
  return $div;
}

function ztt_storeCommonCheckAuthFn(id, platCode){
  //查询平台和店铺,并展示成表格
  Promise.all([listAuthorizedRoleUserByStoreAcctIdAjax(id), listAuthorizedRoleUserByPlatCodeAjax(platCode),getAvailableListUserAjax(),getAvailableListRoleAjax()]).then(res => {
    let storeList = res[2] || [];
    let roleList = res[3] || [];
    let storeTableList =res[0] || [];
    let platCodeTableList = res[1] || [];
    let contentDom = storeAndPlatCodeAuthLayer();
    layui.use(['layer', 'formSelects'], function () {
      let layer = layui.layer,
      formSelects = layui.formSelects;
      layer.open({
        type: 1,
        title: '授权',
        area: ['100%', '100%'],
        content: contentDom,
        id: Date.now(),
        success: function(layero,index){
          //设置样式
          layero.find('.layui-layer-content').css({overflow: 'hidden'});
          //获取并渲染店铺授权元素
          let $storeDom = layero.find('.storeContainer');
          //渲染店铺多选
          let $storeSelectDom = storeAndPlatCodeFormSelects('store', storeList);
          $storeDom.find('.layui-form').prepend($storeSelectDom);
          formSelects.render('storeAndPlatCodeAuthLayer_xmstore');
          //渲染店铺表格
          let $storeTableDom = storeAndPlatCodeTableStr('store', storeTableList);
          $storeDom.find('.authTable').empty().append($storeTableDom);
          layero.find('.storeAuthBtn').on('click', function(){
            let val = formSelects.value('storeAndPlatCodeAuthLayer_xmstore');
            if(val.length == 0){
              return layer.msg('请先选择需要新增的数据', {icon:7});
            }
            let idsArr = val.map(item => item.val);
            let obj = {
              storeAcctId: id,
              userIds: idsArr.join(',')
            };
            userStoreAcctAuthorizeAjax(obj).then(res => {
              layer.msg(res || '操作成功', {icon: 1});
              formSelects.value('storeAndPlatCodeAuthLayer_xmstore', []);
              //更新店铺授权表格渲染
              listAuthorizedRoleUserByStoreAcctIdAjax(id).then(storeRes => {
                  //渲染表格
                  let $storeTableDom = storeAndPlatCodeTableStr('store', storeRes);
                  $storeDom.find('.authTable').empty().append($storeTableDom);
              });
            });
          });
          //店铺取消授权
          layero.find('.authTable').on('click', '.storeCancelBtn', function(){
            let itemId = $(this).attr('data-id');
            let that = this;
            layer.confirm('确定取消授权吗?', {icon: 3, title:'提示'}, function(index){
              storeAcctCancelAuthorizationAjax({
                id: itemId
              }).then(res => {
                layer.close(index);
                layer.msg(res || '操作成功', {icon: 1});
                //更新表格
                $(that).parents('tr').remove();
              })
            });
          });
          //获取并渲染平台授权元素
          let $platCodeDom = layero.find('.platCodeContainer');
          //渲染多选
          let $platCodeSelectDom = storeAndPlatCodeFormSelects('platCode', roleList);
          $platCodeDom.find('.layui-form').prepend($platCodeSelectDom);
          formSelects.render('storeAndPlatCodeAuthLayer_xmplatCode');
          let $platCodeTableDom = storeAndPlatCodeTableStr('platCode', platCodeTableList);
          $platCodeDom.find('.authTable').empty().append($platCodeTableDom);
        //   //平台新增授权事件
        //   layero.find('.platCodeAuthBtn').on('click', function(){
        //     let val = formSelects.value('storeAndPlatCodeAuthLayer_xmplatCode');
        //     if(val.length == 0){
        //       return layer.msg('请先选择需要新增的数据', {icon:7});
        //     }
        //     let idsArr = val.map(item => item.val);
        //     let obj = {
        //       platCode: platCode,
        //       roleIds: idsArr.join(',')
        //     };
        //     rolePlatAuthorizeAjax(obj).then(res => {
        //       layer.msg(res || '操作成功', {icon: 1});
        //       formSelects.value('storeAndPlatCodeAuthLayer_xmplatCode', []);
        //       //更新店铺授权表格渲染
        //       listAuthorizedRoleUserByPlatCodeAjax(platCode).then(platCodeRes => {
        //           //渲染表格
        //           let $platCodeTableDom = storeAndPlatCodeTableStr('platCode', platCodeRes);
        //           $platCodeDom.find('.authTable').empty().append($platCodeTableDom);
        //       });
        //     });
        //   });
        //   //平台取消授权
        //   layero.find('.authTable').on('click', '.platCodeCancelBtn', function(){
        //     let itemId = $(this).attr('data-id');
        //     let masterType = $(this).attr('data-masterType');
        //     let that = this;
        //     layer.confirm('确定取消授权吗?', {icon: 3, title:'提示'}, function(index){
        //       platCancelAuthorizationAjax({
        //         id: itemId,
        //         platCode: platCode,
        //         masterType:masterType
        //       }).then(res => {
        //         layer.close(index);
        //         layer.msg(res || '操作成功', {icon: 1});
        //         //更新表格
        //         $(that).parents('tr').remove();
        //       });
        //     });
        //   });
        }
      });
    });
  }).catch(err =>{
    console.log(err);
  });
}

//新增店铺授权
function userStoreAcctAuthorizeAjax(data){
  return commonReturnPromise({
    url: '/lms/sys/userStoreAcctAuthorize',
    type: 'post',
    params: data
  });
}
//新增平台授权
function rolePlatAuthorizeAjax(data){
  return commonReturnPromise({
    url: '/lms/sys/rolePlatAuthorize',
    type: 'post',
    params: data
  });
}
//店铺取消授权
function storeAcctCancelAuthorizationAjax(data){
  return commonReturnPromise({
    url: '/lms/sys/storeAcctCancelAuthorization',
    type: 'post',
    params: data
  });
}
//平台取消授权
function platCancelAuthorizationAjax(data){
  return commonReturnPromise({
    url: '/lms/sys/platCancelAuthorization',
    type: 'post',
    params: data
  });
}



//标签字典/定时报表公用授权接口
 //查询所有用户接口
function commonTasktimeAndDict_listAllUserAjax(){
  return commonReturnPromise({
    url: '/lms/sysPermissionCommon/listAllUser'
  });
}
//查询所有角色接口
function commonTasktimeAndDict_listAllRoleAjax(){
  return commonReturnPromise({
    url: '/lms/sysPermissionCommon/listAllRole'
  });
}
//根据当前id查询用户权限
function commonTasktimeAndDict_queryByResourceValAjax(id, type, masterType='1'){
  return commonReturnPromise({
    url: '/lms/sysPermissionCommon/queryUserNameAndOrgNameByResourceVal',
    type: 'post',
    contentType: 'application/json',
    params: JSON.stringify({
      "masterType": masterType, //1 用户 2角色， 固定为1，字符串类型
      "resourceType": type, //BIZ_DICT_HEAD 标签字典， TIMING_REPORT 定时报表
      "resourceVal": id //标签头id或者报表id
    })
  });
}
//根据当前id查询角色权限
function commonTasktimeAndDict_queryRoleByResourceValAjax(id, type, masterType='2'){
  return commonReturnPromise({
    url: '/lms/sysPermissionCommon/queryRuleInfoByResourceVal',
    type: 'post',
    contentType: 'application/json',
    params: JSON.stringify({
      "masterType": masterType, //1 用户 2角色， 固定为1，字符串类型
      "resourceType": type, //BIZ_DICT_HEAD 标签字典， TIMING_REPORT 定时报表
      "resourceVal": id //标签头id或者报表id
    })
  });
}
//新增用户授权接口
function commonTasktimeAndDict_AddPermissionAjax(id, masterValStr, type, masterType='1'){
  return commonReturnPromise({
    url: '/lms/sysPermissionCommon/multipleMasterValAddSinglePermission',
    type: 'post',
    contentType: 'application/json',
    params: JSON.stringify({
      "masterType": masterType, //1 用户 2角色， 固定为1，字符串类型
      "resourceType": type, //BIZ_DICT_HEAD 标签字典， TIMING_REPORT 定时报表
      "resourceVal": id, //标签头id或者报表id
      "masterValStr":masterValStr
    })
  });
}

//取消用户授权接口
function commonTasktimeAndDict_cancelPermissionAjax(id, masterVal, type, masterType='1'){
  return commonReturnPromise({
    url: '/lms/sysPermissionCommon/cancelPermission',
    type: 'post',
    contentType: 'application/json',
    params: JSON.stringify({
      "masterType": masterType, //1 用户 2角色， 固定为1，字符串类型
      "resourceType": type, //BIZ_DICT_HEAD 标签字典， TIMING_REPORT 定时报表
      "resourceVal": id, //标签头id或者报表id
      "masterVal":masterVal
    })
  });
}

//新增用户授权--组织用户授权弹框
function commonTasktimeAndDict_singleAddPermissionAjax(id, resourceValStr, type, masterType='1'){
  return commonReturnPromise({
    url: '/lms/sysPermissionCommon/singleMasterValAddMultiplePermission',
    type: 'post',
    contentType: 'application/json',
    params: JSON.stringify({
      "masterType": masterType, //1 用户 2角色， 固定为1，字符串类型
      "resourceType": type, //BIZ_DICT_HEAD 标签字典， TIMING_REPORT 定时报表
      "masterVal": id, //标签头id或者报表id
      "resourceValStr":resourceValStr
    })
  });
}
//组织用户--回显选中项
function commonTasktimeAndDict_showSelectedItemAjax(id, type, masterType='1'){
  return commonReturnPromise({
    url: '/lms/sysPermissionCommon/queryByMasterVal',
    type: 'post',
    contentType: 'application/json',
    params: JSON.stringify({
      "masterType": masterType, //1 用户 2角色， 固定为1，字符串类型
      "resourceType": type, //BIZ_DICT_HEAD 标签字典， TIMING_REPORT 定时报表
      "masterVal": id, //标签头id或者报表id
    })
  });
}

//查找货源公共组件
function commonSearchGoodsComponents(picUrl){
    window.open('https://www.1688.com?pordUrl=' + picUrl)
  // commonReturnPromise({
  //   url: '/lms/prodhotsale/searchSimilar',
  //   type: 'post',
  //   contentType: 'application/json',
  //   params: JSON.stringify({
  //     picUrl: picUrl,
  //     page: 1
  //   })
  // }).then(res => {
  //   let $str = $('<div style="padding:20px;"></div>');
  //   let $ul = $('<ul style="display: flex;justify-content: start;flex-wrap: wrap;"></ul>');
  //   for(let i=0; i< res.length; i++){
  //     let item= res[i];
  //     let $li = $(`<li class="searchSupply-li">
  //       <a target="_blank" href="${item.detailUrl}">
  //       <img width="120" height="120" data-original="${item.imageUrl}" class="img_show_hide b1 lazy" data-onerror="layui.admin.img_noFind()" />
  //       </a>
  //       <div class="searchSupply-li-div">
  //         <div><span class="gray">价&nbsp;&nbsp;&nbsp;格:</span> ${(item.oldPrice/100).toFixed(2)}</div>
  //         <div><span class="gray">起购量:</span> ${item.quantityBegin}</div>
  //         <div><span class="gray">地&nbsp;&nbsp;&nbsp;址:</span> ${item.province} ${item.city}</div>
  //       </div>
  //       </li>`);
  //     $ul.append($li);
  //   }
  //   $str.append($ul);
  //   layer.open({
  //     type: 1,
  //     title: '查找货源',
  //     area: ['70%', '70%'],
  //     content: $str[0].outerHTML,
  //     id: Date.now(),
  //     success: function(){
  //       imageLazyload();
  //       imageLazyloadOrigin();
  //     }
  //   });
  // });
}

//通用下载PDF函数
function commonDownloadPDF(url) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'blob';

  xhr.onload = function() {
    if (xhr.status === 200) {
      var blob = xhr.response;
      var link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = extractFileNameFromURL(url);
      link.click();
    }
  };

  xhr.send();
}

//匹配pdf名称
function extractFileNameFromURL(url) {
  var regex = /\/([^\/?#]+\.pdf)(?:[?#]|$)/i;
  var match = regex.exec(url);
  if (match) {
    return match[1];
  } else {
    return null;
  }
}

//等待元素加载完成jquery
jQuery.fn.wait = function (func, times, interval) {
  var _times = times || -1, //100次
  _interval = interval || 20, //20毫秒每次
  _self = this,
  _selector = this.selector, //选择器
  _iIntervalID; //定时器id
  if( this.length ){ //如果已经获取到了，就直接执行函数
      func && func.call(this);
  } else {
      _iIntervalID = setInterval(function() {
          if(!_times) { //是0就退出
              clearInterval(_iIntervalID);
          }
          _times <= 0 || _times--; //如果是正数就 --
           
          _self = $(_selector); //再次选择
          if( _self.length ) { //判断是否取到
              func && func.call(_self);
              clearInterval(_iIntervalID);
          }
      }, _interval);
  }
  return this;
}

//通用物流计费公式弹框,id: orderId
function commonLogisCostLayerHandle(id){
  commonReturnPromise({
    url: `/lms/platorder/queryOrderLogisticsPriceDetail?orderId=${id}`
  }).then(res => {
    let {logisDto, oaShippingCost, platShippingCost, platLogisticsCompanyPriceWeight, platLogisticsCompanyRealWeight } = res;

    let contStr = `
    <div style="padding:20px;">
      <div style="display: flex;color: tomato;">
        <div style="width:50px;">
          <p style="height:60px;">OA即时</p>
          <p style="height:30px;">OA存</p>
          <p>平台</p>
        </div>
        <div>
          <div style="height:60px;">
            <p>= [(首费+续重倍数*续重费用)*折扣+操作费]*汇率</p>
            <p>= [(${logisDto.firstWeightCost} + (${logisDto.addedWeightSum}/${logisDto.addedWeight})*${logisDto.addedCost})*${logisDto.discountRate} + ${logisDto.operationCost}] * ${logisDto.exchangeRate}</p>
            <p>= ${logisDto.logisticsPrice}(¥)</p>
          </div>
          <p style="height:30px;">= ${oaShippingCost}(¥)</p>
          <p>
            <span>=${platShippingCost || ''}(¥)</span>
            <span style="display:inline-block;margin: 0 10px;">称重: ${platLogisticsCompanyPriceWeight || ''}</span>
            <span>计费重: ${platLogisticsCompanyRealWeight || ''}</span>
          </p>
        </div>
      </div>
      <div style="margin-top:21px;"><strong>*注：续重倍数会向上取整；wish操作费是考虑平台合单后的分摊值</strong></div>
    </div>
    `

    layer.open({
      type: 1,
      title: '物流成本计算公式',
      content: contStr,
      area: ['450px', '230px'],
      id: Date.now()
    });
  })
}

//通用预览图片功能
function commonPreviewExcel(url){
  let b64Encoded = Base64.encode(url);
  window.open('https://imghz.epean.com.cn:16688/onlinePreview?url=' + encodeURIComponent(b64Encoded));
}

/**
 * 通用,优选仓拒单功能
 * @param {*} ids 选中项数组
 * @param {*} delFn 删除行不刷新函数
 */
function commonRejectOrderdabao(ids, delFn){
  commonOrderConfirmLayer(ids.length, function (index) {
    commonReturnPromise({
      url: '/lms/platorder/rejectDabaoOrders.html',
      type: 'post',
      params: {
        ids: ids.join(',')
      }
    }).then(res => {
      layer.close(index);
      layui.admin.batchResultAlert(
        "优选仓拒单:",
        res,
        function (errIdsArr) {
          delFn(ids, errIdsArr);
        });
    });
  });
}

/**
 * 单个抠图
 * @param {*} imgDom 图片dom
 */
function commonMattingImg(imgDom) {
    var url = imgDom.prop('src');
    if (url.indexOf("!size=") > 0) {
      url = url.substring(0, url.indexOf("!size="));
    }
    commonReturnPromise({
      url: "/lms/imageProcess/photoshopByUrl",
      contentType: "application/json;charset=UTF-8",
      type: "post",
      params: JSON.stringify([url]),
    }).then((res) => {
        loading.show()
      if (Array.isArray(res) && res[0].state) {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        let image = new Image();
        image.src = res[0].imageUrl;
        image.setAttribute("crossOrigin", "Anonymous");
        image.onload = function (e) {
            canvas.width = this.width;
          canvas.height = this.height;
          // // 在 canvas 上绘制原始图片，并缩放到目标尺寸
          ctx.drawImage(image, 0, 0);
          // 将 canvas 转换为新的图片文件 
        //   canvasDom.toDataURL('image/jpeg') 图片是黑色底的
        // canvasDom.toDataURL('image/png') 图片是透明底的
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < imageData.data.length; i += 4) {
        // 当该像素是透明的，则设置成白色
        if (imageData.data[i + 3] === 0) {
            imageData.data[i] = 255;
            imageData.data[i + 1] = 255;
            imageData.data[i + 2] = 255;
            imageData.data[i + 3] = 255;
        }
        }
        ctx.putImageData(imageData, 0, 0);
          const newImageURL = canvas.toDataURL("image/png");

          // 将图片base64转换为图片链接
          let reg =
            /^\s*data:([a-z]+\/[a-z0-9-+.]+(;[a-z-]+=[a-z0-9-]+)?)?(;base64)?,([a-z0-9!$&',()*+;=\-._~:/@?%\s]*?)\s*$/i;
          if (reg.test(newImageURL)) {
            $.ajax({
              type: "POST",
              url: "/lms/preProdDev/getBase64Img.html",
              data: { AreaImgKey: newImageURL },
              async: false,
              success: function (resUrl) {
                  imgDom.prop('src', resUrl)
                  loading.hide()
                  layer.msg("操作成功", { icon: 1 });
                },
                error: function (err) {
                    loading.hide()
                    layer.msg("操作失败", { icon: 2 });
                },
            });
          } else {
            const div = smtPublish_markImgDOM({ src: newImageURL, ssize: false });
            $("#smtPublish_market2Images").html(div);
          }
        };
      } else {
        layer.msg("操作失败", { icon: 2 });
      }
    });
  }

//ztt20230912 公共获取打印信息接口
function commonGetPrintInfo(params){
  return commonReturnPromise({
    url: '/lms/printTemplate/printProd',
    type: 'post',
    params: params
  });
}
function commonGetPrintDataByLoopRequest(data){
  let printReqData= [];
  data.forEach((item, index) => {
    printReqData.push(
      new Promise((resolve, reject) => {
        commonGetPrintInfo(item).then(res => {
            return resolve(res)
          }).catch(_ => {
            return resolve(_) // 注意
          })
      })
    )
  })
  return printReqData;
}

function commonPrintRequest(obj, hasType = false) {
  let cur_ip = "http://localhost:9898/";//默认使用ip
  return new Promise((resolve, reject) => {
    if (!hasType) {
        obj.printType = 19;
    }
    $.ajax({
        type: "post",
        url: cur_ip,
        dataType: "json",
        data: obj,
        beforeSend: function(){
          loading.show();
        },
        success: function () {
          loading.hide();
          resolve();
        },
        error: function (jqXHR) {
            loading.hide();
            var responseText = jqXHR.responseText;
            if (responseText == null || responseText.indexOf("打印成功") == -1) {
                layui.layer.msg("打印错误，请检查打印插件是否正常运行或者重新启动插件", {icon: 2});
                reject('打印错误，请检查打印插件是否正常运行或者重新启动插件');
            }else{
              resolve();
            }
        }
    });
  });
}
async function commonExecutePrintJobs(printJobs) {
  for (let job of printJobs) {
    await commonPrintRequest(job);
  }
  console.log("所有打印请求已完成");
}

//ztt20230913 监听悬浮
commonShowPackageDetailFn();
function commonShowPackageDetailFn(){
  //包裹号悬浮
  $('body').on('mouseenter', '.packageNumShow', function(){
    let $this = $(this);
    let $str = $(this).attr('data-str'); //获取到要展示的数据
    let $div= $('<div class="packageNumNumDetail"></div>');
    $div.html($str);
    $this.append($div);
  });
  $('body').on('mouseleave', '.packageNumShow', function(){
    $(this).find('.packageNumNumDetail').remove();
  });

  //详情悬浮展示采购单详细信息
  $('body').on('mouseenter', '.purcaseOrderNum', function(){
    let $this = $(this);
    let $str = $(this).attr('data-str'); //获取到要展示的数据
    let $div= $('<div class="purcaseOrderNumDetail"></div>');
    $div.html($str);
    $this.append($div);
  });
  $('body').on('mouseleave', '.purcaseOrderNum', function(){
    $(this).find('.purcaseOrderNumDetail').remove();
  });
}

// 跳转任务中心
function commonJumpToTaskcenter(){
    layui.layer.closeAll()
    window.parent.postMessage({ name: "shopeeoperatetaskcenter", res: "" }, "*");
}

//比较两个逗号分割字符串是否相等,不考虑顺序
function areCommaSeparatedStringsEqual(str1, str2) {
  // 将逗号分隔的字符串拆分为数组，然后排序数组
  var arr1 = str1.split(',').sort();
  var arr2 = str2.split(',').sort();
  // 比较排序后的数组
  return arr1.join(',') == arr2.join(',');
}

// 页面跳转后读取 storage 的参数 进行查询
function getInitParamsAndQuery(paramsName, initDom, func) {
    let params = sessionStorage.getItem(paramsName)
    if (params !== undefined || params !== '') {
        setTimeout(() => {
            $('#' + initDom).val(params)
            func && func()
        }, 500)
    }
}
//task#6325-公共组件
// 标题首字母大写
function transferText(self) {
    let str = $(self).parent('.wordLimitTool').prev('.ifFocusInput').val() || ''
    if (!str) return
    var newStr = str.replace(/\s[a-z]/g, function($1) {
        return $1.toLocaleUpperCase()
    }).replace(/^[a-z]/, function($1) {
        return $1.toLocaleUpperCase()
    }).replace(/\sOr[^a-zA-Z]|\sAnd[^a-zA-Z]|\sOf[^a-zA-Z]|\sAbout[^a-zA-Z]|\sFor[^a-zA-Z]|\sWith[^a-zA-Z]|\sOn[^a-zA-Z]/g, function($1) {
        return $1.toLowerCase()
    });
    $(self).parent('.wordLimitTool').prev('.ifFocusInput').val(newStr)
};

let platTitleLimitMap = {
   'smt': 128,
   'lazada': 255,
   'ebay': 80,
   'joom': 100,
   'amazon': 150,
   'prodTpl': 500,
   'shopee': 180
}

function commonAddEventTitleToggle($containerDom, platName) {
   // 根据平台获取字符限制数量
    let wordsMaxLength = platTitleLimitMap[platName] || 0
   // 给标题添加 字符数量展示 以及字母大写转换icon
   $containerDom.find('.ifFocusInput')?.each((index, item) => {
       let focusInputLength = $(item).val().length || 0
       $(item).parent().css({'position': 'relative', 'display': 'flex', 'alignItems': 'center'})
       let titleWordsLimitAllStr = ''
       let titleWordsBeforeStr = `<div class="wordLimitTool">`
       let showWordLimitStr = `<span class="showWordLimit">
                <span class="currentLength">${focusInputLength}</span> / <span>${wordsMaxLength}</span>
            </span>`
        let titleWordsAfterStr = `<span style="cursor: pointer" onclick="transferText(this)" onmouseenter="showTip('把单词首字母转为<br>大写（点击生效）',this)"
        onmouseleave="removeTip(this)">
                <img src="${ctx}/static/img/text.png" />
            </span>
        </div>`
        if (wordsMaxLength === 0) {
            titleWordsLimitAllStr = titleWordsBeforeStr + titleWordsAfterStr
        } else {
            titleWordsLimitAllStr = titleWordsBeforeStr + showWordLimitStr + titleWordsAfterStr
        }
        $(item).after(titleWordsLimitAllStr)
        // 判断是 input还是 textarea
        if ($(item).is('input')) {
            $(item).css({'paddingRight': '100px'})
            $(item).next('.wordLimitTool').css({'height': $(item).height() - 2 + 'px'})
            $(item).next().find('.showWordLimit').css({'line-height': $(item).height() - 2 + 'px'})
        }
        if ($(item).is('textarea')) {
            $(item).next('.wordLimitTool').css({'height': '24px', 'bottom': '1px'})
        }
        if (focusInputLength > wordsMaxLength) {
            $(item).next().find('.currentLength').css({'color': 'red'})
        }
   })

    $containerDom.on('input', '.ifFocusInput', function(e){
        $(this).attr('value', $(this).val())        
        $(this).next().find('.currentLength').html($(this).val().length)
        if ($(this).val().length > wordsMaxLength) {
            $(this).next().find('.currentLength').css({'color': 'red'})
        }else{
            $(this).next().find('.currentLength').css({'color': 'unset'})
        }
    })

  //ztt20231025-监听聚焦,基于父元素监听.ifFocusInput
  if ($containerDom.attr('id') == 'producttpl_tplDetail') return // 基础模板
  $containerDom.on('focus', '.ifFocusInput', function(e){
    e.stopPropagation();
    // e.preventDefault();
    let inputDom = e.target;
    let prodPId = inputDom.dataset.prodpid || '';
    let prodPSku = inputDom.dataset.prodpsku || '';
    let prodSId = inputDom.dataset.prodsid || '';
    let inputParams = {
        prodPId,
        prodPSku,
        prodSId
    }
    let titleDom = $(body).find('.platTitle');
    let inputBoudRect =inputDom.getBoundingClientRect();
    let viewHeight = window.innerHeight; //视口高度
    //获取到创建完成的dom结构/需要考虑已存在的情况
    if(titleDom.length>0){
      //console.log('表示已存在,不重新创建');
      let titleBoudRect = titleDom[0].getBoundingClientRect();
      let titleDomHeight = titleBoudRect.height; //获取标题高度
      //说明下拉框在下面
      if(viewHeight - inputBoudRect.top - inputBoudRect.height-60 > titleDomHeight){
        //在判断下拉框和目标元素的距离
        if(titleBoudRect.top - inputBoudRect.height - inputBoudRect.top !=5){
          titleDom.remove();
          commonPlatTitlePannel(inputParams, inputBoudRect).then(domStr => {
            $(body).append(domStr);
            let top = inputBoudRect.top + inputBoudRect.height + 5;
            $(body).find('.platTitle').css('top', `${top}px`);
          });
        }
      }else{
        //下拉框在上面[不重新加载的条件应该是什么?]
        console.log(inputBoudRect.top,titleBoudRect.bottom)
        if(inputBoudRect.top -titleBoudRect.bottom > 10 || inputBoudRect.top -titleBoudRect.bottom< 0){
          titleDom.remove();
          commonPlatTitlePannel(inputParams, inputBoudRect).then(domStr => {
            $(body).append(domStr);
            if(inputDom.tagName == 'INPUT'){
              let top = inputBoudRect.top -$(body).find('.platTitle').height() - inputBoudRect.height;
              $(body).find('.platTitle').css('top', `${top}px`);
            }else{
              let top = inputBoudRect.top -$(body).find('.platTitle').height() - 25;
              $(body).find('.platTitle').css('top', `${top}px`);
            }
          });
        }
      }
    }else{
      commonPlatTitlePannel(inputParams, inputBoudRect).then(domStr => {
        $(body).append(domStr);
        //判断展示位置
        let titleDom = $(body).find('.platTitle');
        let titleDomHeight = titleDom.height(); //获取标题高度
        let top =0;
        //视口高度-点击元素的位置-点击元素的高度>标题高度=>正常展示
        if(viewHeight - inputBoudRect.top - inputBoudRect.height -5 > titleDomHeight){
          top = inputBoudRect.top + inputBoudRect.height +5;
          titleDom.css('top', `${top}px`);
        }else{
          //视口高度-点击元素的位置-点击元素的高<标题高度=>反向展示
          if(inputDom.tagName == 'INPUT'){
            top = inputBoudRect.top -titleDomHeight - inputBoudRect.height;
            titleDom.css('top', `${top}px`);
          }else{
            top = inputBoudRect.top -titleDomHeight - 25;
            titleDom.css('top', `${top}px`);
          }
        }
      });
    }
  });
  
  // 当点击文档的其他地方时关闭下拉框
  $(document).on('click', function(event) {
    // event.preventDefault();
    event.stopPropagation();
    let titleDom = $(body).find('.platTitle');
    //存在下拉框且焦点在input内,不执行
    let x = event.clientX;
    let y = event.clientY;
    // console.log('点击区域', event.clientX,event.clientY);
    if(titleDom.length>0){
      let elementRect =titleDom[0].getBoundingClientRect();
      //存在下拉框且焦点在目标input内不执行
      if(event.target.classList.contains('ifFocusInput')){

      }else if(
        x >= elementRect.left &&
        x <= elementRect.right &&
        y >= elementRect.top &&
        y <= elementRect.bottom
      ) {
        // console.log('鼠标在目标元素内,不执行任何操作');
      } else {
        titleDom.remove();
        // console.log('鼠标不在目标元素内');
      }
    }
  });
}
// 标题面板
function commonPlatTitlePannel(inputParams, inputBoudRect, height=400) {
  //元素配置
  let width = inputBoudRect.width; //面板宽度
  let left = inputBoudRect.left;
  const TITLE_TAGS_MAP = {
      coreKeyWordList: '核心关键词',
      keyWordProdAttrList: '产品属性词',
      keyWordFitList: '使用场景/范围/人群/用途',
      keyWordExtraList: '补充词'
  };
  let {prodPId, prodPSku, prodSId } = inputParams
  let params = {
      prodPId,
      prodPSku,
      prodSId
  }
  return new Promise((resolve, reject)=>{
    commonReturnPromise({
      type: 'post',
      url: '/lms/plat/assist/getProdPInfoAssistInfoByProdPIdOrProdSIdOrProdPSkuOrProdSSku',
      contentType: 'application/json',
      params: JSON.stringify(params)
    }).then(function(res){
        let titleList = res || {};
        let titleContentStr = ''
        let tagStr = ''
        let strAll = ''
        if(Object.keys(titleList).length>0){
            Object.keys(titleList).forEach(item => {
              if (titleList[item]?.length > 0) {
                  titleContentStr += `
                      <div style="color: #aaa">${TITLE_TAGS_MAP[item]}:</div>
                  ` 
              }
              tagStr = ''
              titleList[item].forEach(cItem => {
                  tagStr += `
                      <div class="titleTag">
                          <span class="pora copySpan">
                              <a>${cItem}</a>
                              <button class="layui-btn layui-btn-primary layui-btn-xs copyTxt" onclick="layui.admin.copyTxt(this,event)">复制</button>
                          </span>
                      </div>`
              })
              titleContentStr = titleContentStr + tagStr 
          })
        }else{
          titleContentStr = '<div class="titleTag"><a>暂无数据</a></div>'
        }
        strAll = `<div class="platTitle" style="width: ${width}px;max-height:${height}px;overflow-y:auto;left:${left}px;">` +  titleContentStr + `</div>`
        //导出拼接的面板
        resolve(strAll);
    }).catch(function(err) {
        reject(err)
    });
  });
}

// 订单联系买家
function commonOrderConnectChatBuyer(row) {
    const chatPlatCodeList = ['shopee', 'tiktok', 'lazada']
    const platCodePageNameObj={
     shopee: 'shopeecustomerchat',
     tiktok: 'publishstiktokchat',
     lazada: 'lazadacustomerlazadachat'
    }
    if ( chatPlatCodeList.includes(row.platCode)) {
      let params = {
        storeAcctId: row.storeAcctId,
        orderId: row.platOrderId,
      };
      if(row.platCode == 'lazada'){
          params['siteId'] = row.siteId;
          params['storeAcct'] = row.storeAcct;
          params['buyerId'] = row.buyerUserId;
          params['buyerNameFirst'] = row.buyerNameFirst;
          params['buyerNameLast'] = row.buyerNameLast;
      }
      window.parent.postMessage(
        { name: platCodePageNameObj[row.platCode], params: params },
        "*"
      );
    }
  }

// 发送shopee,tiktok消息给买家
//showStockOutSkuImage: 派至仓库前-缺货单shopee发送消息时，支持发送缺货商品图片
function commonorderShopeeSendMsg(checkedRowList, platCode, showStockOutSkuImage = false) {
    const infoList = [
       {
            platCode:'shopee',
            sendUrl:'/chat/shopee/msg/batchSendMessage4Orders',
            languageBySiteUrl:'/chat/shopee/msg/customizeValues',
        },{
            platCode:'tiktok',
            sendUrl:'/chat/tiktok/msg/batchSendMsg',
            languageBySiteUrl: '/chat/tiktok/msg/customizeValues'
        },{
            platCode:'ozon',
            sendUrl:'/lms/ozon/msg/batchSendOrderMsg',
            languageBySiteUrl: '/lms/ozon/msg/customizeValues'
        }
    ]
    const info = infoList.find(v=>v.platCode === platCode)
    if(info){
      // 获取选中数据
      if (checkedRowList.length) {
      let shopeeOrders = checkedRowList.filter(item => item.platCode === info.platCode)
      const notShopeeOrders = checkedRowList.filter(item => item.platCode !== info.platCode).map(v=>v.platOrderId)
      let orderInfoList = shopeeOrders.map(item => ({
        orderSn: item.platOrderId,
        platOrderId: item.platOrderId,
        storeAcctId: item.storeAcctId,
        buyerUserId: item.buyerUserId,
        platCode: item.platCode,
        orderItems: item.orderDetails.map(v=>({
            storeSSku: v.storeSSku,
            imgUrl: v.imageUrl,
            availableStock: v.availableStock
        }))
      }))
      let orderIds = checkedRowList.map(item => item.id).join(',');
      let sendStockOutSkuImages = false  // 是否发送缺货sku图片
      layer.open({
          type: 1,
          title: "发送消息",
          btn: ["发送", "取消"],
          area: ["800px", "600px"],
          id: Date.now(),
          success: function (layero) {
              layui.view(this.id)
              .render("route/iframe/order/orderShopeeSendMsg")
              .done(function () {
                // 全是shopee缺货订单，展示是否发送缺货商品图片的checkbox
                // const isNotAllOutStock = shopeeOrders.filter(v=>v.processStatus!=502).length
                if(showStockOutSkuImage && platCode=='shopee'){
                    $(layero).append('<div class="layui-form" style="position: absolute;right: 200px;bottom: 20px;"><input type="checkbox" name="sendStockOutSkuImages" title="发送缺货商品图片" lay-skin="primary"></div> ')
                }
              var app = new Vue({
                  el: "#orderShopeeSendMsg",
                  data: {
                  messageList: [{ id: 1 }],
                  languageList: ['12','34'],
                  tplTypeList: [],
                  tplNameList: [],
                  tplInfo: {
                    platCode,
                  },
                  tplId: null,
                  },
                  mounted() {
                    // 获取语言
                    const { form } = layui
                    Promise.all([
                        commonReturnPromise({
                            url: info.languageBySiteUrl,
                            type: "post",
                            params: { salesSite:'' },
                        }),
                        commonReturnPromise({
                            url: '/lms/sys/email/listTemplateType',
                            type: "post",
                            params: { platCode },
                        })
                    ]).then(res=>{
                        if(platCode == 'ozon'){
                            this.tplInfo.languageCode = res[0][0]
                        }
                        this.languageList = res[0]
                        this.tplTypeList = res[1]
                        this.$nextTick(function(){
                            layui.form.render()
                        })
                    })
                    let that = this
                    form.on('select(languageCodeSearch)',function(data){
                        that.tplInfo.languageCode = data.value
                        that.handleGetTplNameList()
                    })
                    form.on('select(templateTypeNameSearch)',function(data){
                        that.tplInfo.templateTypeName = data.value
                        that.handleGetTplNameList()
                    })
                    form.on('select(tplIdSearch)',function(data){
                        that.tplId = data.value
                    })
                  },
                  methods: {
                    handleGetTplNameList(){
                        let that = this
                        that.tplNameList = []
                        that.tplId = null
                        const { form } = layui
                        if (that.tplInfo.languageCode && that.tplInfo.templateTypeName) {
                            commonReturnPromise({
                                url: '/lms/sys/email/listTemplateName',
                                type: "post",
                                contentType: "application/json",
                                params: JSON.stringify(that.tplInfo),
                            }).then(res=>{
                                that.tplNameList =res
                                this.$nextTick(function(){
                                    form.render('select')
                                })
                            })
                        }else{
                            that.tplNameList = []
                            this.$nextTick(function(){
                                form.render('select')
                            })
                        }
                    },
                  // 新增; 若当前存在空白消息，选择模板后，将对应内容填充至空白消息内；若当前无空白消息，则选择模板后，新增一条带有模板内容的消息
                    async orderShopeeSendMsg_add() {
                        let that = this
                        let msgContent = '';
                        if (that.tplId) {
                            const res = await commonReturnPromise({
                                url: '/lms/sys/email/getEmailContent',
                                type: "post",
                                params: {id:that.tplId},
                            });
                            msgContent = res.emailContent;
                        }
                        if (that.messageList.length) {
                        // 取最后一项
                        const lastObj = that.messageList[that.messageList.length - 1]
                        const EmptyIndex = that.messageList.findIndex((v) => !v.value);
                            if ( that.tplId && EmptyIndex !== -1) {
                                const curMsg = that.messageList[EmptyIndex]
                                that.$set(that.messageList,EmptyIndex,{...curMsg,value:msgContent})
                            } else {
                                that.messageList.push({ value: msgContent, id: lastObj.id + 1 });
                            }
                        } else {
                            that.messageList.push({value: msgContent, id: 1 });
                        }
                    },
                  //   删除
                  orderShopeeSendMsg_del(index) {
                    let that = this
                    if (that.messageList.length === 1) return layer.msg("至少一条消息", { icon: 7 })
                    that.messageList.splice(index, 1)
                  },
                  },
              })
              })
          },
          yes: function (index, layero) {
              let messageList = []
              $("#orderShopeeSendMsglForm").find("input[name=msg]").each(function () {
                  const curVal = $(this).val()
                  if (curVal !== "") {
                      messageList.push(curVal)
                    }
              })
              if (!messageList.length) return layer.msg("请输入消息")
              const isOverMaxLength = messageList.some(v=>v.length>600)
              if(isOverMaxLength)  return layer.msg("消息长度不超过600")
              if (!shopeeOrders.length) return layer.msg(`消息发送异常，请选择${info.platCode}平台订单！`)

              //   是否发送图片
              const sendStockOutSkuImagesChecked = $(layero).find('input[name=sendStockOutSkuImages]:checked')
              if(sendStockOutSkuImagesChecked.length){
                sendStockOutSkuImages = true
               }else{
                orderInfoList.forEach(v=>{
                    delete v.orderItems
                })
               }


              commonReturnPromise({
                  url: info.sendUrl,
                  type: "post",
                  contentType: "application/json",
                  params: JSON.stringify(platCode== 'ozon'?{msgList:messageList,ozonOrderInfoList:orderInfoList}:{ messageList, orderInfoList, sendStockOutSkuImages }),
              }).then((res) => {
                  if(res && res.length != 0 && platCode == 'ozon'){
                      res.forEach(item => {
                          item['orderSn'] = item.platOrderId
                      })
                  }
                    const succOrderList = res.filter(v=>v.success).map(v=>v.orderSn)
                    const failOrderList = res.filter(v=>!v.success).map(v=>v.orderSn)
                    if(!failOrderList.length && !notShopeeOrders.length){
                        layer.msg("消息发送成功！", { icon: 1 })
                        layer.close(index)
                    }else{
                        let str = ''
                        if(notShopeeOrders.length){
                            str = str + '非'+ info.platCode +'订单发送失败:'+notShopeeOrders.join()+'<br>'
                        }
                        if(failOrderList.length){
                            str = str + info.platCode +'订单发送失败:'+failOrderList.join(',')+'<br>'
                        }
                        if(succOrderList.length){
                            str = str + info.platCode +'订单发送成功:' + succOrderList.join()+'<br>'
                        }
                        if(failOrderList.length){
                            failOrderMsgStr = res.filter(v=>!v.success).map(v=>v.orderSn+'：'+ v.msg)
                            str = str + info.platCode +'平台消息发送失败明细:'+failOrderMsgStr.join('； ')
                        }
                        layer.alert(str,{title:'消息发送结果',icon:7, area: ['600px', '400px']},function(alertIndex){
                            layer.close(alertIndex);
                            layer.close(index);
                        }); 
                    }
                    //ztt20240110-刷新当前页面,仅处理---派至仓库前
                    if($('#beforedispatchtowhSearch').length > 0){
                      commonReturnPromise({
                        url: '/lms/unauditorder/addorderlabelnote.html',
                        type: 'post',
                        params: {
                          ids: orderIds,
                          noteType: '缺货联系买家',
                          noteContent: ''
                        }
                      }).then(()=>{
                        $('#beforedispatchtowhSearch').trigger('click');
                      }).catch(err=> {
                        layer.msg(err, {icon:2});
                      })
                    }
                })
          },
      })
      } else {
      return layer.msg("请勾选一笔订单", { icon: 7 })
      }
    }
}

// 复制订单id并且跳转到平台订单后台详情
const CommonPlatFormOrderDetailEnum = ['shopee']
function commonJumpPlatformOrderDetail(row){
    if(CommonPlatFormOrderDetailEnum.includes(row.platCode)){
        const platCodeUrlObj={
            shopee: `https://seller.shopee.cn/portal/sale/order?cnsc_shop_id=${row.shopId}&keyword=${row.platOrderId}`
        }
        // 复制订单号
        copyTxtToClipboard(row.platOrderId)
        // 跳转
        window.open(platCodeUrlObj[row.platCode]);
    }
}

// 实时限制字数
function commonInputLimitWord(dom, wordsMaxLength) {
    const wordsLength = $(dom).val().length;
    if (wordsMaxLength < wordsLength) {
      $(dom).addClass("inputBorderRed");
    } else {
      $(dom).removeClass("inputBorderRed");
    }
}


// 各平台刊登规则日志弹窗
function publishRulesLogLayer (data,ruleName) {
    const _data = data.map(item=>({
        ...item,
        ruleName
    }))
    layui.use(['laytpl'], function () {
        let laytpl = layui.laytpl;
        layer.open({
            type: 1,
            title: '日志',
            id: Date.now(),
            area: ['60%', '60%'],
            success: function (layero, index) {
                layui.view(this.id).render('route/publishs/public/publishRulesLog').done(function () {
                   let getTpl = layero.find('#publishRules_logCon').html(),
                       view = layero.find('#publishRules_logTpl')[0];
                   laytpl(getTpl).render(_data, function (html) {
                       view.innerHTML = html;
                   });
                })
            }
        })
    })
}

// 一个数字是否为时间戳
function isTimestamp(number) {
    var timestamp = new Date(number).getTime();
    return !isNaN(timestamp);
  }

//虾皮导入导入调价新增配置弹窗:传入id
function commonImportJudgePriceConfigFn(){
  //弹框配置
  let configLayer = `
      <div style="padding-top:40px;" class="layui-form">
        <div class="layui-form-item" style="display:flex; flex-direction: column;margin-bottom:30px;">
          <label class="layui-form-label"><font color="red">*</font>调整方式</label>
          <div style="margin-left:40px;">
            <input type="radio" name="adjustType" value="0" title="全量调整" checked>
            <input type="radio" name="adjustType" value="1" title="仅调整数据涨价">
            <input type="radio" name="adjustType" value="2" title="仅调整数据降价">
          </div>
        </div>
        <div class="layui-form-item">
          <label class="layui-form-label"><font color="red">*</font>选择文件</label>
          <div class="layui-input-block">
            <span class="layui-btn layui-btn-primary layui-btn-sm upload-file">上传文件</span>
            <span class="file-name"></span>
            <input type='file' name='file' class='disN' accept='.xlsx,.xls'>
          </div>
        </div>
        <div class="fRed" style="margin-left:40px;">tip：当越南站的调价商品[新促销价]<1/2的[当前原价]时，系统会自动调整[原价]。原价=新促销价/(1-优惠幅度)</div>
    </div>
  `;
  layui.use(["form", "upload"], function (){
    let form = layui.form;
    let submitFile = '';
    layer.open({
      type: 1,
      content: configLayer,
      id: Date.now(),
      area: ['740px', '400px'],
      btn: ['确认', '取消'],
      success: function(layero){
        form.render('radio');
        let $next = layero.find('input[type=file]');
        layero.find('.upload-file').on('click', function(){
          $next.trigger('click');
        });
        $next.unbind().change(function (e) {
          let files = e.target.files;
          let file = files[0];
          submitFile = files[0];
          layero.find('.file-name').html(`${file.name}<span class="layui-badge" style="cursor:pointer;">x</span>`);
        });
        //监听删除事件
        layero.on('click', '.layui-badge', function(){
          layero.find('input[type=file]').val('');
          layero.find('.file-name').html('');
        });
      },
      yes: function(index,layero){
        if(layero.find('[name=file]').val() == ''){
          return layer.msg('请先上传文件', {icon:7});
        }
        let formData = new FormData();
        formData.append('file', submitFile);
        formData.append('adjustType', layero.find('[name=adjustType]:checked').val())
        $.ajax({
          url: ctx + "/shopee/shopeeIsEnableProduct/adjustByExcel.html",
          data: formData,
          type: "POST",
          async: true,
          cache: false,
          contentType: false,
          processData: false,
          dataType: 'json',
          beforeSend: function () {
              loading.show();
          },
          success: function (data) {
              loading.hide();
              if (data.code == '0000') {
                layer.alert(data.msg || '操作成功', {icon:1});
              } else {
                layer.alert(data.msg || '操作失败', {icon:2});
              }
              //传递完成以后清空input的value
              layero.find('input[type=file]').val('');
              layero.find('.file-name').html('');
              layer.close(index);
          },
          error: function (error) {
              loading.hide();
              layer.msg(`${error.statusText}`, { icon: 2 });
          }
        });
      }
    });
  });
  
}

// 初始化仓库-楼栋-楼层
// warehouseId: 仓库id
function render_order_build_floor(formSelector,defaultWarehouseId, func) {
    let formDom = $(formSelector)
    if (formDom.length == 0) {
        layer.msg('初始化楼栋楼层失败，未找到表单')
    }
    let warehouseIdDom = formDom.find(".warehouseId"), // 仓库
        buildNoDom = formDom.find(".buildNo"), // 楼栋
        floorNoDom = formDom.find(".floorNo"); // 楼层
    let buildNo_to_floorNo = {};
    // 初始化楼栋,默认义乌仓
    getFloorAndBuild(defaultWarehouseId, buildNoDom, floorNoDom, function(res){
        buildNo_to_floorNo = res
    })

    // 监听仓库下拉
    if (!$.isEmptyObject(warehouseIdDom.attr('lay-filter'))) {
        layui.form.on('select(' + warehouseIdDom.attr('lay-filter') + ')', function(data) {
            if(data.value != ''){
                getFloorAndBuild(data.value, buildNoDom, floorNoDom, function(res){
                    buildNo_to_floorNo = res
                })
            }else{
                orderRenderSelect(buildNoDom, [])
                orderRenderSelect(floorNoDom, [])
                layui.form.render("select")
                buildNoDom.attr('xm-select') && layui.formSelects.render(buildNoDom.attr('xm-select'))
                floorNoDom.attr('xm-select') && layui.formSelects.render(floorNoDom.attr('xm-select'))
            }
        })
    }
    // 监听楼栋下拉
    if(!$.isEmptyObject(buildNoDom.attr('xm-select'))){  // 多选
        layui.formSelects.on(buildNoDom.attr('xm-select'), function (id, vals, val, isAdd, isDisabled) {
            let selectArr = vals.map(item => item.value)
            if(isAdd){
                selectArr.push(val.value)
            }else{
                selectArr = selectArr.filter(item=> item != val.value)
            }
            if(selectArr.length == 0){ // 没选楼栋，展示所有楼层
                orderRenderSelect(floorNoDom, buildNo_to_floorNo.all)
            }else{
                let floorNoList = [];
                selectArr.forEach(item => {
                    floorNoList = floorNoList.concat(buildNo_to_floorNo[item].split(","))
                })
                floorNoList = Array.from(new Set(floorNoList))
                orderRenderSelect(floorNoDom, floorNoList)
            }
            layui.form.render("select")
            floorNoDom.attr('xm-select') && layui.formSelects.render(floorNoDom.attr('xm-select'))
        })
    } else { // 单选
        if (!$.isEmptyObject(buildNoDom.attr('lay-filter'))){
            layui.form.on('select(' + buildNoDom.attr('lay-filter') + ')', function(data) {
                if(data.value != ''){
                    orderRenderSelect(floorNoDom, buildNo_to_floorNo[data.value]?.split(","))
                }else{ // 没选楼栋，展示所有楼层
                    orderRenderSelect(floorNoDom, buildNo_to_floorNo.all)
                }
                layui.form.render("select")
                floorNoDom.attr('xm-select') && layui.formSelects.render(floorNoDom.attr('xm-select'))
            })
        }
    }
}
// 根据仓库id，获取楼栋和楼层的联动关系
function getFloorAndBuild(warehouseId, buildNoDom, floorNoDom, callback){
    commonReturnPromise({
        type: 'GET',
        url: '/lms/stockLocationBindSku/getFloorAndBuild?warehouseId=' + warehouseId,
    }).then(tRes=> {
        let buildNoList = [],floorNoList = [];
        for(let key in tRes){
            buildNoList.push(key)
            floorNoList = floorNoList.concat(tRes[key].split(","))
        }
        floorNoList = Array.from(new Set(floorNoList))
        orderRenderSelect(buildNoDom, buildNoList)
        orderRenderSelect(floorNoDom, floorNoList)
        // 存下楼层的所有
        tRes['all'] = floorNoList;
        callback(tRes)
        layui.form.render("select")
        buildNoDom.attr('xm-select') && layui.formSelects.render(buildNoDom.attr('xm-select'))
        floorNoDom.attr('xm-select') && layui.formSelects.render(floorNoDom.attr('xm-select'))
    });
}

function orderRenderSelect(aDom,data){
    var option = '<option value="">请选择</option>'
    data.forEach(item => {
        option += `<option value="${item}">${item}</option>`
    })
    aDom.html(option)
}

// 复制icon的复制功能
// <a class="itemId" target="_blank" href="http://www.aliexpress.com/item/info/{{d.itemId}}.html">{{d.itemId}}</a>
// <span class="copy-icon-after" data-copy="{{d.itemId}}"  style="display: {{d.itemId ? 'inline-block':'none'}}"></span>
$(document).on("click", ".copy-icon-after", function (e) {
    e.stopPropagation()
    const copyStr = e.target.dataset.copy
    layui.admin.onlyCopyTxt(copyStr)
    return false
})
//获取两个数组的非交集
function commonGetDifferenceArray(arr1, arr2) {
    return arr1.concat(arr2).filter(function(v, i, arr) {
        return arr.indexOf(v) === arr.lastIndexOf(v);
    });
}

//shopee需求8309--只要义乌仓和自建南宁仓
function commonShopeeGetWarehouse(opts){
  return new Promise((resolve, reject) => {
    let url = '/lms/shopee/shop/getShopeeShippingWarehouses'
    if(opts.showAll){
        url = '/lms/prodWarehouse/getAuthedProdWarehouse.html'
    }
    commonReturnPromise({
      url,
    }).then(tRes=> {
      let warehouseSelectedList = tRes;
      resolve(warehouseSelectedList);
    }).catch(err=> {
      reject(err);
    })
  })
}

/**
 * 初始化发货仓库
 * @param {string} id  元素对应的id
 * @param {object} opts  配置项 selected:选中项id，selectName:选中项名称，showAll：是否展示全部的仓库
 * @param {object} opts selected  配置项
 */
function initShopeeWarehouseSelect(id, opts = {}){
  commonShopeeGetWarehouse(opts).then(res=> {
    if(opts.selectName){
        const obj = res.find(v=>{
            return v.warehouseName==opts.selectName
        })
        if(obj){
            opts.selected = obj.id
        }
    }else if(opts.selected){
        const obj = res.find(v=>{
            return v.id==opts.selected
        })
        if(obj){
            opts.selected = obj.id
        }else{
            opts.selected = null
        }
    }
    commonRenderSelect(id, res, {code: 'id', name: 'warehouseName',selected:opts.selected}).then(()=>{
      layui.form.render('select');
    })
  });
}

//key-value转换成数组对象,固定code,name-ztt20240521
function convertObjectToNamedArray(obj) {
  // 使用Object.entries获取对象的所有键值对，然后使用map遍历这些键值对
  const result = Object.entries(obj).map(([key, value]) => {
    // 对于每个键值对，创建一个新对象，该对象包含固定的键name和value
    return { name: value, code: key };
  });
  // 返回结果数组
  return result;
}
//仓储类型枚举并渲染多选,基于id渲染不同页面的选择框,多页面共同使用-ztt2020521
function commonRenderWarehouseTypeRender(id){
  commonReturnPromise({
    url: ctx + '/amazonFBA/getFbaInventoryHistoryStorageTypeEnum'
  }).then(res => {
    let resArray = convertObjectToNamedArray(res);
    console.log(res, resArray);
    commonRenderSelect(id, resArray, {code: 'code', name: 'name'}).then(()=>{
      //这里需要用的是xm-select值,默认设置和id相等
      layui.formSelects.render(id);
    });
  });
}

