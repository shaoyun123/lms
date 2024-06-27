layui.use(['form', 'table', 'layer', 'element', 'laypage', 'upload', 'tableMerge', 'laydate', 'formSelects'], function () {
    var form = layui.form,
        table = layui.table,
        formSelects = layui.formSelects,
        laydate = layui.laydate
    layer = layui.layer;
    var consolidatableOrder_formData = {}
    form.render('select');

    // 初始化
    consolidatableOrder_init()
    // 订单时间渲染默认一周    
    function consolidatableOrder_init () {
        var nowdate = new Date(new Date().toLocaleDateString()).getTime();
        var endTime = Format(nowdate + 24 * 60 * 60 * 1000 - 1, 'yyyy-MM-dd hh:mm:ss');
        var startTime = Format((nowdate - 60 * 24 * 60 * 60 * 1000) , 'yyyy-MM-dd hh:mm:ss');
        var timeVal = startTime + ' - ' + endTime;
        laydate.render({
            elem: '#consolidatableOrder_orderTime',
            type: 'datetime',
            inputAuto: true,
            range: true,
            showShortcuts: true,
        });
        $('#consolidatableOrder_orderTime').val(timeVal)
    }

    commonOrderAddSalePerson('consolidatableOrder', form);

    // 表单提交
    form.on('submit(consolidatableOrderSearch)', function (data) {
        if (data.field.times) {
            var timesArr = data.field.times.split(' - ');
            data.field.orderTimeStart = timesArr[0];
            data.field.orderTimeEnd = timesArr[1];
        } else {
            data.field.orderTimeStart = '';
            data.field.orderTimeEnd = '';
        }
        delete data.field.times
        consolidatableOrder_formData = data.field
        consolidataableTableorder(data.field)
    });

    //监听平台下拉选择
    form.on('select(platCodes)', function (obj) {
        commonOrderAddSalePerson('consolidatableOrder', form, obj.value);
        getStoreByPlatform(obj.value)
    })

    //ztt-合并订单物流ID, 提交ID处理函数-2.14
    function consolidatable_mergeIdHandle (data, field, fn) {
        let newArr = [];
        let ids = data.map(item => item[field]) // 选择所有数据
        let dataInfo = {}
        for (let i = 0; i < data.length; i++) {
            
            let { flag } = data[i]
            if (!dataInfo[flag]) {
                dataInfo[flag] = {
                    flag,
                    data: []
                }
            }
            dataInfo[flag].data.push(data[i][field])
        }
        Object.values(dataInfo).forEach(item => {
            newArr.push(item.data)
        })
        return fn(newArr);
    }

    // 数组交集
    let interSection = (arr1, arr2) => {
        return arr1.reduce((prev, next) => !prev.includes(next) && arr2.includes(next) ? [...prev, next] : prev, []);
    }
    //ztt-接口调用[单独合单]-2.14
    function consolidatable_mergeOrderAjax (data, status) {
        return commonReturnPromise({
            url: `/lms/order/merge/mergeorder.html?isIgnoreLogis=${status}`,
            type: 'post',
            contentType: 'application/json',
            params: JSON.stringify(data)
        });
    }
    //合并已选订单---ztt改-2.14
    $('#LAY-consolidatableOrder #mergeChoosedOrders').click(function () {
        var checkStatus = table.checkStatus('consolidatableOrder_table')
        var data = checkStatus.data;
        if (data.length == 0) {
            return layer.msg('请选择订单', { icon: 7 });
        }
        //#region   ztt-2.11新增判断处理物流相同的情况
        let judgeArr = consolidatable_mergeIdHandle(data, 'buyerRequireShippingType', function (arr) {
            let containerArr = [];
            for (let i = 0; i < arr.length; i++) {
                let itemArr = arr[i];
                if (Array.from(new Set(itemArr)).length == 1) {
                    //说明物流方式都一样
                    containerArr.push(1); //1--表示有相同的
                } else {
                    //说明有物流方式不同
                    containerArr.push(0); //0--表示有不同的
                }
            };
            return containerArr;
        });
        //把id做拼接,格式["1,2,3","4,5,6"]
        let submitArr = consolidatable_mergeIdHandle(data, 'id', function (arr) {
            let containerArr = [];
            for (let i = 0; i < arr.length; i++) {
                let itemArr = arr[i];
                let itemStr = itemArr.join(',');
                containerArr.push(itemStr);
            };
            return containerArr;
        });
        //如果judgeArr包含0,需要弹框;如果不包含0,不弹框直接调用接口
        if (judgeArr.includes(0)) {
            //弹框逻辑
            layer.open({
                type: 1,
                title: '合并订单',
                btn: ['合单', '关闭'],
                area: ['60%', '25%'],
                content: $('#pop_consolidatable_mergeOrder').html(),
                success: function (layero, index) {
                    form.render()
                    form.on('radio(isIgnoreLogis)', function (obj) {
                        data.isIgnoreLogis = obj.value
                    });
                },
                yes: function (index, layero) {
                    consolidatable_mergeOrderAjax(submitArr, data.isIgnoreLogis).then(res => {
                        // layer.msg(res.msg || '合单成功', {icon:1});
                        // $('#consolidatableOrderSearch').click()
                        layer.close(index);
                        let {submitCount,newOrderCount,newOrderIdStr } = res;
                        let str = `<div>提交${submitCount}单,合成${newOrderCount}单,合成订单号如下:</div><div>${newOrderIdStr}</div>`;
                        layer.confirm(str, {title:'合单结果'}, function(index1){
                            $('#consolidatableOrderSearch').click()
                            layer.close(index1)
                        });
                    });
                }
            });
        } else {
            //直接调用接口
            consolidatable_mergeOrderAjax(submitArr, false).then(res => {
                // layer.msg(res.msg || '合单成功', { icon: 1 });
                // $('#consolidatableOrderSearch').click();
                let {submitCount,newOrderCount,newOrderIdStr } = res;
                let str = `<div>提交${submitCount}单,合成${newOrderCount}单,合成订单号如下:</div><div>${newOrderIdStr}</div>`;
                layer.confirm(str, {title:'合单结果'}, function(index){
                    $('#consolidatableOrderSearch').click()
                    layer.close(index);
                });
            });
        }
        //#endregion
        // var ids = (data || []).map(function (item) {
        //     return item.id
        // })
        // if (ids.length > 0) {
        //     mergeOrder('1', { ids: ids.join(',') }, data)
        // } else {
        //     layer.msg('请选择订单', { icon: 7 });
        // }
    })
    //合并所有订单
    $('#LAY-consolidatableOrder #mergeAllOrders').click(function () {
        mergeOrder('2', consolidatableOrder_formData)
    })


    getPageEnum();
    getStoreByPlatform('', function (returnData) {
        toAuditOrder_allstore = returnData.data
    });
    consolidataableTableorder({})



    // 页面数据请求----------------------------------------
    //  获取页面枚举数
    function getPageEnum () {
        initAjax('/unauditorder/listenum.html', 'post', {}, function (returnData) {
            form.render()
            appendSelect('consolidatableOrderForm', 'platCodes', returnData.data.platCodes, '', '')
            form.render()
        })
    }


    //根据平台code获取店铺列表
    function getStoreByPlatform (platcode, func) {
        initAjax('/sys/orderliststorebyplatcode.html', 'get', { platCode: platcode }, function (returnData) {
            appendSelect('consolidatableOrderForm', 'storeAcct', returnData.data, 'id', 'storeAcct')
            if (func) {
                func(returnData)
            }
            formSelects.render('storeAcct')
        }, 'application/x-www-form-urlencoded')
    }

    // 合并已选订单
    function mergeCheckedOrder (data, func) {
        initAjax('/order/merge/mergeorder.html', 'post', data, function (returnData) {
            if (func) {
                func(returnData)
            }
        }, 'application/x-www-form-urlencoded')
    }

    // 合并所有订单
    function mergeAllOrder (data, func) {
        initAjax('/order/merge/mergeallorder.html', 'post', JSON.stringify({ data }), function (returnData) {
            if (func) {
                func(returnData)
            }
        })
    }

    //渲染表格数据
    //状态枚举
    var csdtorder_statusMap = {
      504: '未付款订单',
      501: '黑名单订单',
      502: '缺货订单',
      503: '取消订单',
      500: '其他异常订单',
      110: '待审核',
      115: '待派单',
      120: '待配货',
      125: '待核单',
      130: '待包装',
      135: '仓库缺货',
      136: '仓库拦截单',
      140: '待发货',
      180: '已发货',
      200: '已归档'
    }
    function consolidataableTableorder (data) {
        table.render({
            elem: '#consolidatableOrder_table',
            method: 'POST',
            url: ctx + '/order/merge/list.html',
            where: data,
            cols: [
                [
                    { checkbox: true, width: 30 },
                    { title: "订单号", field: "id", templet: "#toAuditorder_id_tpl" },
                    { title: "订单金额", field: "platOrderAmt", templet: "#toAuditorder_platOrderAmt_tpl" },
                    { title: "商品", field: "prodQuantity", templet: "#toAuditorder_prodQuantity_tpl" },
                    { title: "收件人", field: "shippingUsername", templet: "#toAuditorder_shippingUsername_tpl" },
                    { title: "物流", field: "logisTypeName", templet: '#toAuditorder_logisTypeName_tpl' },
                    { title: "时间", field: "time", templet: "#toAuditorder_time_tpl" },
                    { title: "状态", field: "platOrderStatus", templet: `
                      <div class="alignLeft">
                        <div><span style="color:#999">平台状态: </span>{{ d.platOrderStatus || ''}}</div>
                        <div><span style="color:#999">OA状态: </span>
                        {{#  if(d.processStatus == 110){   }}
                        <span>待审核</span>
                        {{# }else if(d.processStatus == 115){ }}
                        <span>待派单</span>
                        {{# }else if(d.processStatus == 502){ }}
                        <span>缺货单</span>
                        {{# }else{ }}
                        <span>异常单</span>
                        {{# } }}
                        </div>
                      </div>
                    ` },
                ]
            ],
            page: true,
            id: 'consolidatableOrder_table',
            created: function (res) {
                if (res.code == '0000' && res.data && Array.isArray(res.data)) {
                    res.data = res.data.map(cItem => ({ ...cItem, flag: cItem.id }))
                    var _data = deepCopy(res.data)
                    let _index = 1
                    _data.forEach((elem, index) => {
                        let howmany = elem.otherPlatOrders && Array.isArray(elem.otherPlatOrders) ? elem.otherPlatOrders.length : 0
                        if (howmany) {
                            let otherPlatOrders = elem.otherPlatOrders.map(item => ({ ...item, isSonOrder: true, flag: elem.id }))
                            res.data.splice(index + _index, 0, ...otherPlatOrders)
                            _index += howmany
                        }
                    });
                }
            },
            done: function (res) {
                // consolidatableOrder_watchTableTr()
                // 合并行
                !!res.data && Array.isArray(res.data) && res.data.length && mergeRows(res)
            }
        })
    }

    function mergeRows (res) {
        var { data } = res
        var mergeIndex = 0 //定位需要添加合并属性的行数
        var mark = 1 //这里涉及到简单的运算，mark是计算每次合并的格子数
        // var columnsName = ['0'] //需要合并的列名称
        var columnsIndex = [0] //需要合并的列的索引值

        for (var k = 0; k < columnsIndex.length; k++) { //这里循环所有要合并的列
            var trArr = $('#consolidatableOrder_table').next().find('.layui-table-body>.layui-table tr');  //所有行
            for (var i = 1; i < data.length; i++) { // 循环表格当前的数据
                var tdCurArr = trArr.eq(i).find('td').eq(columnsIndex[k])  //获取当前行的当前列 
                var tdPreArr = trArr.eq(mergeIndex).find('td').eq(columnsIndex[k]) // 获取相同列的第一列
                if (data[i].isSonOrder) {//如果是子订单就和父订单合并
                    mark += 1
                    tdPreArr.each(function () { //相同列的第一列增加count属性
                        $(this).attr('count', mark)
                    })
                } else {
                    mergeIndex = i;
                    mark = 1;  //如果不是就重新计算
                }
            }
        }
        let rowspanTds = $('#consolidatableOrder_table').next().find('.layui-table-body>.layui-table td[count]'); // 所有的第一列
        //循环-根据rowspan的值设置样式
        for (let j = 0; j < rowspanTds.length; j++){

            let rowspanTd = rowspanTds[j];
            let rowspanVal = $(rowspanTd).attr('count');
            let targetTrArr = $(rowspanTd).parent().nextAll();
            $(targetTrArr[`${rowspanVal-2}`]).find('td').css('cssText', 'border-bottom-color: #f00 !important');
            
        }
    }

    // table.on('tool(consolidatableOrder_table)', function(obj) {
    //     if (obj.event == 'platOrderStatus') {
    //         commonOrderDetailFn(obj.data);
    //     }
    // });
    //监听表格tr的点击[查看详情]
    // function consolidatableOrder_watchTableTr() {
    //     $('#consolidatableOrder_table .layui-table-main').on('click', 'td[data-field=platOrderStatus]', function (event) {
    //         var $targetBtn = $(this).parents('tr').find('span[lay-event=platOrderStatus]');
    //         $targetBtn.trigger('click');
    //         event.stopPropagation();
    //         event.preventDefault();
    //     });
    // }
    // 页面数据请求----------------------------------------

    function mergeOrder (type, data, chosedArr = []) {
        layer.open({
            type: 1,
            title: '合并订单',
            btn: ['合单', '关闭'],
            area: ['60%', '25%'],
            content: $('#pop_consolidatable_mergeOrder').html(),
            success: function (layero, index) {
                form.render()
                form.on('radio(isIgnoreLogis)', function (obj) {
                    data.isIgnoreLogis = obj.value
                });
            },
            yes: function (index, layero) {
                if (type === "1") {
                    // 选中的id值
                    let _idsArr = chosedArr.map(item => {
                        if (item.otherPlatOrders && Array.isArray(item.otherPlatOrders) && item.otherPlatOrders.length) {
                            let itemids = item.otherPlatOrders.map(elem => elem.id)
                            return itemids.concat(item.id)
                        }
                        return item.id
                    })
                    let idsArr = _idsArr.flat(Infinity)
                    data.ids = idsArr.join(',')
                    mergeCheckedOrder(data, function (returnData) {
                        let {submitCount,newOrderCount,newOrderIdStr } = returnData;
                        let str = `<div>提交${submitCount}单,合成${newOrderCount}单,合成订单号如下:</div><div>${newOrderIdStr}</div>`;
                        layer.close(index);
                        layer.confirm(str, {title:'合单结果'}, function(index1){
                            $('#consolidatableOrderSearch').click()
                            layer.close(index1)
                        });
                    })
                } else if (type == "2") {
                    mergeAllOrder(data, function (returnData) {
                        layer.close(index);
                        let {submitCount,newOrderCount,newOrderIdStr } = returnData;
                        let str = `<div>提交${submitCount}单,合成${newOrderCount}单,合成订单号如下:</div><div>${newOrderIdStr}</div>`;
                        layer.confirm(str, {title:'合单结果'}, function(index2){
                            $('#consolidatableOrderSearch').click()
                            layer.close(index2)
                        });
                    })
                }
            },
        })
    }

    //填充下拉框
    function appendSelect (pre, dom, data, code, label, attachment) {
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

    function initAjax (url, method, data, func, contentType, isLoad, func2, func3) { //初始化ajax请求
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
            beforeSend: function (returnData) {
                if (func2) {
                    func2(returnData)
                }
            },
            success: function (returnData) {
                loading.hide()
                if (returnData.code == "0000") {
                    func(returnData)
                } else {
                    layer.msg(returnData.msg, { icon: 2 });
                }
            },
            error: function (returnData) {
                layui.admin.load.hide();
                if (XMLHttpRequest.status == 200) {
                    layer.msg("请重新登录", { icon: 7 });
                } else {
                    layer.msg("服务器错误");
                }
            },
            complete: function (returnData) {
                loading.hide()
                if (func3) {
                    func3(returnData)
                }
            }
        })
    }

})

function getIndex (id, arr, value) { //获取某个取值属性在对象数组中的下标
    for (var i = 0; i < arr.length; i++) {
        if (value == arr[i][id]) {
            return i;
        }
    }
    return -1;
}