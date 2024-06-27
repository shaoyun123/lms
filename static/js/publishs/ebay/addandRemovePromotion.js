var addPromotionTableIns = null;
layui.use(['form', 'layer', 'formSelects', 'table', 'laypage', 'laydate'], function() {
    var form = layui.form,
        table = layui.table,
        layer = layui.layer,
        formSelects = layui.formSelects,
        laydate = layui.laydate,
        $ = layui.$;
    form.render();
    var storeId = localStorage.getItem('storeId')
    getPromotion(storeId)
    addPromotionTable(modifyTitle_arr)
        //获取促销活动下拉列表
    function getPromotion(storeId) {
        initAjax('/ebayDiscount/getAllPromotion.html', 'POST', { storeAcctId: storeId }, function(returnData) {
            appendSelect('ebayaddpromotionForm', 'promotionAct', returnData.data, 'promotionSaleId', 'promotionSaleName')
            form.render()
        }, 'application/x-www-form-urlencoded')
    }

    //查询添加促销结果
    function queryAddResult(prodObj, func, timer) {
        initAjax('/ebayDiscount/selectAddPromotionResult.html', 'GET', { prodObj: JSON.stringify(prodObj) }, function(returnData) {
            func(returnData)
        }, 'application/x-www-form-urlencoded', timer)
    }

    //查询移除促销结果
    function queryRemoveResult(prodObj, func, timer) {
        initAjax('/ebayDiscount/selectRemovePromotionResult.html', 'GET', { prodObj: JSON.stringify(prodObj) }, function(returnData) {
            if (func) {
                func(returnData)
            }
        }, 'application/x-www-form-urlencoded', timer)
    }

    $('#batchAddPromotion').click(function() {
        batchAddPromotion()
    })

    $('#batchRemovePromotion').click(function() {
        batchRemovePromotion()
    })

    //批量添加促销
    function batchAddPromotion() {
        var itemArr = table.checkStatus('ebayaddpromotionTable').data
        itemArr = itemArr.map(function(item) {
            return item.itemId
        })
        var isOnly = $('input[name="isOnly"]').siblings('.layui-form-checkbox').hasClass('layui-form-checked')
        var promotionSaleId = $('#promotionAct').val();
        if (itemArr.length > 0) {
            initAjax('/ebayDiscount/setPromotionalSaleListings.html', 'POST', { itemArr: JSON.stringify(itemArr), promotionSaleId: promotionSaleId, isOnly: isOnly }, function(returnData) {
                if (returnData.code === "0000") {
                    applytoChecked('ebayaddpromotionTable', addPromotionTableIns, function(tr, data, i) {
                        var timer = setInterval(function() {
                            queryAddResult({ itemId: data.itemId, storeAcctId: storeId }, function(returnData) {
                                if (returnData.msg) {
                                    clearInterval(timer)
                                    $(tr).find('td[data-field="addPromotionResult"] div').text(returnData.msg)
                                    var color = returnData.msg === '商品添加促销成功' ? 'blue' : 'red';
                                    $(tr).find('td[data-field="addPromotionResult"] div').css('color', color)
                                }
                            }, timer)
                        }, 3000)
                    })
                }
                layer.msg(returnData.msg)
            }, 'application/x-www-form-urlencoded')
        } else {
            layer.msg('请勾选要添加的商品');
        }
    }

    //批量移除促销
    function batchRemovePromotion(data) {
        var itemArr = table.checkStatus('ebayaddpromotionTable').data
        itemArr = itemArr.map(function(item) {
            return item.itemId
        })
        if (itemArr.length > 0) {
            initAjax('/ebayDiscount/removePromotionalSaleListings.html', 'POST', { itemArr: JSON.stringify(itemArr), storeAcctId: storeId }, function(returnData) {
                if (returnData.code === "0000") {
                    applytoChecked('ebayaddpromotionTable', addPromotionTableIns, function(tr, data, i) {
                        var timer = setInterval(function() {
                            queryRemoveResult({ itemId: data.itemId, storeAcctId: storeId }, function(returnData) {
                                if (returnData.msg) {
                                    clearInterval(timer)
                                    $(tr).find('td[data-field="addPromotionResult"] div').text(returnData.msg)
                                    var color = returnData.msg === '商品移除促销成功' ? 'blue' : 'red';
                                    $(tr).find('td[data-field="addPromotionResult"] div').css('color', color)
                                }
                            }, timer)
                        }, 3000)
                    })
                }
                layer.msg(returnData.msg)
            }, 'application/x-www-form-urlencoded')
        }
    }

    //渲染表格
    function addPromotionTable(data) {
        addPromotionTableIns = table.render({
            elem: '#ebayaddpromotionTable',
            method: 'get',
            data: data,
            height: 500,
            cols: [
                [ //表头
                    { checkbox: true, width: 30 },
                    { title: "item_Id", field: "itemId" },
                    { title: "操作结果", field: "addPromotionResult" },
                ]
            ],
            page: false,
            id: "ebayaddpromotionTable",
            done: function(data) {}
        })
    }

    //填充下拉框
    function appendSelect(pre, dom, data, id, name) {
        $('#' + pre + ' #' + dom + '').empty();
        var option = '<option value="">请选择</option>'
        for (var i in data) {
            data[i].id = data[i][id] || data[i].id;
            data[i].name = data[i].name || data[i][name];
            option += '<option value="' + data[i].id + '">' + data[i].name + '</option>'
        }
        $('#' + pre + ' #' + dom + '').append(option)
    }

    //封装ajax请求
    function initAjax(url, method, data, func, contentType, timer) { //初始化ajax请求
        $.ajax({
            type: method,
            url: ctx + url,
            dataType: 'json',
            async: true,
            data: data,
            contentType: contentType || 'application/json',
            success: function(returnData) {
                loading.hide()
                if (returnData.code == "0000") {
                    if (timer) {
                        clearInterval(timer)
                    }
                    func(returnData)
                } else {
                    if (timer) {
                        clearInterval(timer)
                    }
                    layer.msg(returnData.msg, { icon: 2 });
                }
            },
            error: function(returnData) {
                layui.admin.load.hide();
                if (XMLHttpRequest.status == 200) {
                    layer.msg("请重新登录", { icon: 7 });
                } else {
                    layer.msg("服务器错误");
                }
                if (timer) {
                    clearInterval(timer)
                }
            }
        })
    }

});