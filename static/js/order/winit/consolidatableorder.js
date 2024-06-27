//可合并订单 for winit
layui.use(['form', 'table', 'layer', 'element', 'laytpl', 'formSelects'], function() {
    var form = layui.form,
        table = layui.table,
        formSelects = layui.formSelects,
        laytpl = layui.laytpl,
        layer = layui.layer;
    var consolidatableOrderWinit_formData = {}
    form.render('select');

    // 表单提交
    form.on('submit(consolidatableOrderWinitSearch)', function(data) {
        consolidatableOrderWinit_formData = data.field
        consolidataableTableorder(data.field)
    });

    //监听平台下拉选择
    form.on('select(platCodes)', function(obj) {
        getStoreByPlatform(obj.value)
    })

    //合并已选订单
    $('#LAY-consolidatableOrderWinit #mergeChoosedOrders').click(function() {
            // var checkStatus = table.checkStatus('consolidatableOrderWinit_table')
            // var data = checkStatus.data
            // var ids = (data || []).map(function(item) {
            //     return item.id
            // })
            var ids = []
            $('#consolidatableOrderWinit_table_body').find('td[data-field]').find('.layui-form-checked').each(function(index,item){
                ids.push($(item).prev().val())
            })
            if (ids.length > 0) {
                mergeOrder('1', { ids: ids.join(',') })
            } else {
                layer.msg('请选择订单')
            }
        })
        //合并所有订单
    $('#LAY-consolidatableOrderWinit #mergeAllOrders').click(function() {
        mergeOrder('2', consolidatableOrderWinit_formData)
    })

    form.on('checkbox(allChecked)',function(obj){
        if(obj.elem.checked){
            $('#consolidatableOrderWinit_table_body').find('td[data-field]').find('.layui-form-checkbox').each(function(index,item){
                $(item).addClass('layui-form-checked')
            })
        }else{
            $('#consolidatableOrderWinit_table_body').find('td[data-field]').find('.layui-form-checkbox').each(function(index,item){
                $(item).removeClass('layui-form-checked')
            })
        }
    })


    getPageEnum();
    getStoreByPlatform('', function(returnData) {
        toAuditOrder_allstore = returnData.data
    });
    consolidataableTableorder({})



    // 页面数据请求----------------------------------------
    //  获取页面枚举数
    function getPageEnum() {
        initAjax('/unauditorder/listenum.html', 'post', {}, function(returnData) {
            form.render()
            appendSelect('consolidatableOrderWinitForm', 'platCodes', returnData.data.platCodes,'','')
            form.render()
        })
    }


    //根据平台code获取店铺列表
    function getStoreByPlatform(platcode, func) {
        initAjax('/sys/liststorebyplatcode.html', 'get', { platCode: platcode }, function(returnData) {
            appendSelect('consolidatableOrderWinitForm', 'storeAcct', returnData.data, 'id', 'storeAcct')
            if (func) {
                func(returnData)
            }
            formSelects.render('storeAcct')
        }, 'application/x-www-form-urlencoded')
    }

    // 合并已选订单
    function mergeCheckedOrder(data, func) {
        initAjax('/mergeorder/winit/mergeorder.html', 'post', data, function(returnData) {
            if (func) {
                func(returnData)
            }
        },'application/x-www-form-urlencoded')
    }

    // 合并所有订单
    function mergeAllOrder(data, func) {
        initAjax('/mergeorder/winit/mergeallorder.html', 'post', data, function(returnData) {
            if (func) {
                func(returnData)
            }
        },'application/x-www-form-urlencoded')
    }

    //获取合单订单列表
    function getMergeOrderList(data,func){
        initAjax('/mergeorder/winit/list.html', 'post', data, function(returnData) {
            if (func) {
                func(returnData)
            }
        },'application/x-www-form-urlencoded')
    }

    //渲染表格数据
    function consolidataableTableorder(data) {
        getMergeOrderList(data,function(returnData){
            console.log(returnData,'data')
            var consolidataableTabletpl = consolidatableOrderWinit_table_bodytpl.innerHTML
            var tablecontainer = $('#consolidatableOrderWinit_table_body')
            laytpl(consolidataableTabletpl).render(returnData.data||[], function(html){
                tablecontainer.html(html);
                form.render()
            });
        })
        // table.render({
        //     elem: '#consolidatableOrderWinit_table',
        //     method: 'POST',
        //     url: ctx + '/mergeorder/winit/list.html',
        //     where: data,
        //     cols: [
        //         [
        //             { checkbox: true, width: 30 },
        //             { title: "订单号", field: "id", templet: "#toAuditorder_id_tpl" },
        //             { title: "订单金额", field: "platOrderAmt", templet: "#toAuditorder_platOrderAmt_tpl" },
        //             { title: "商品", field: "prodQuantity", templet: "#toAuditorder_prodQuantity_tpl" },
        //             { title: "收件人", field: "shippingUsername", templet: "#toAuditorder_shippingUsername_tpl" },
        //             { title: "物流", field: "logisTypeName", templet: '#toAuditorder_logisTypeName_tpl' },
        //             { title: "时间", field: "time", templet: "#toAuditorder_time_tpl" },
        //             { title: "状态", field: "platOrderStatus" },
        //         ]
        //     ],
        //     page: true,
        //     limit:100,
        //     limits:[100,300,500],
        //     id: 'consolidatableOrderWinit_table',
        //     done: function(res) {}
        // })
    }
    // 页面数据请求----------------------------------------

    function mergeOrder(type, data) {
        data.isIgnoreLogis = false
        layer.open({
            type: 1,
            title: '合并订单',
            btn: ['合单', '关闭'],
            area: ['60%', '20%'],
            content: $('#pop_consolidatable_mergeOrder').html(),
            success: function(layero, index) {
                form.render()
                form.on('radio(isIgnoreLogis)', function(obj) {
                    data.isIgnoreLogis = obj.value
                });
            },
            yes: function(index, layero) {
                if (type === "1") {
                    mergeCheckedOrder(data, function(returnData) {
                        layui.admin.batchResultAlert("合并选择订单:",returnData.data,function(){
                            $('#consolidatableOrderWinitSearch').click()
                            layer.close(index)
                        });
                    })
                } else if (type == "2") {
                    mergeAllOrder(data, function(returnData) {
                        layui.admin.batchResultAlert("合并全部订单:",returnData.data,function(){
                            $('#consolidatableOrderWinitSearch').click()
                            layer.close(index)
                        });
                    })
                }
            },
        })
    }

    //填充下拉框
    function appendSelect(pre, dom, data, code, label, attachment) {
        $('#' + pre + ' #' + dom).empty();
        var option = '<option value="">请选择</option>'
        for (var i in data) {
            if (typeof data[i] !== 'string') {
                attachment ?
                    data[i].code = data[i][code] + '_' + data[i][attachment] :
                    data[i].code = data[i][code] || data[i].code
                data[i].label = data[i][label] || data[i].label;
            }
            option += '<option value="' + (data[i].code || data[i]) + '">' + (data[i].label || data[i]) + '</option>'
        }
        $('#' + pre + ' #' + dom).append(option)
    }

    function initAjax(url, method, data, func, contentType, isLoad, func2, func3) { //初始化ajax请求
        if (!isLoad) {
            loading.show()
        }
        $.ajax({
            type: method,
            url: ctx + url,
            dataType: 'json',
            async: true,
            data: data,
            contentType: contentType || 'application/json',
            beforeSend: function(returnData) {
                if (func2) {
                    func2(returnData)
                }
            },
            success: function(returnData) {
                loading.hide()
                if (returnData.code == "0000") {
                    func(returnData)
                } else {
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
            },
            complete: function(returnData) {
                loading.hide()
                if (func3) {
                    func3(returnData)
                }
            }
        })
    }

})

function getIndex(id, arr, value) { //获取某个取值属性在对象数组中的下标
    for (var i = 0; i < arr.length; i++) {
        if (value == arr[i][id]) {
            return i;
        }
    }
    return -1;
}