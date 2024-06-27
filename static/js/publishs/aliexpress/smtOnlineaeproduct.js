; (function ($, layui, window, document, undefined) {
    layui.use(['admin', 'form', 'layer', 'table', 'formSelects', 'element', 'upload', 'laydate', 'laytpl'], function () {
        var admin = layui.admin,
            form = layui.form,
            layer = layui.layer,
            table = layui.table,
            formSelects = layui.formSelects,
            element = layui.element,
            upload = layui.upload,
            laydate = layui.laydate,
            laypage = layui.laypage,
            laytpl = layui.laytpl
        $ = layui.$
        // smt_arr 获取的数据
        smtOnlineaeproductName = {
            init: function () {
                let arr = smt_arr.map(item => ({ storeAcct: item.storeAcct, itemId: item.itemId }))
                this.tableRender(arr)
            },
            tableRender: function (arr) {
                table.render({
                    elem: '#smtOnlineaeproductTable',
                    data: arr,
                    cols: [[
                        { type: "checkbox" },
                        { field: "storeAcct", title: "店铺" },
                        { field: "itemId", title: "itemId" },
                        { field: "result", title: "操作结果" },
                    ]],
                    page: false,
                    limit: 10000,
                    id: "smtOnlineaeproductTable",
                    done: function (res, curr, count) {
                        $("#smtOnlineaeproductTable_total").text(count);
                    }
                })

            },
            // 监听批量上架按钮
            batchOnline: function () {
                var _this = this
                $('#smtOnlineaeproduct_batchEdit').click(function () {
                    var checkStatus = table.checkStatus('smtOnlineaeproductTable'); //idTest 即为基础参数 id 对应的值
                    var data = checkStatus.data
                    if (!data.length) return layer.msg('请选择数据', { icon: 7 })
                    const _data = data.map(item => item.itemId)
                    if (smtOnlineaeproductUnit != null) {
                        clearInterval(smtOnlineaeproductUnit)
                    }
                    _this.batchOnlineAjax(_data)
                        .then(batchNo => {
                            layer.msg('操作成功', { icon: 1 })
                            smtOnlineaeproductUnit = setInterval(function () {
                                var count = _this.trResultEmptyCount()
                                if (count == 0) {
                                    clearInterval(smtOnlineaeproductUnit);
                                    return;
                                }
                                _this.selectResultAjax(batchNo)
                                    .then(res => {
                                        _this.showHandleResult(res)
                                    })
                            }, 5000);
                        })
                        .catch(function (reason) {
                            layer.msg(reason);
                        })
                })
            },
            showHandleResult: function (result) {  //显示操作结果
                //获取到返回结果的属性值
                if (Object.keys(result).length) {
                    var itemIdArr = Object.keys(result)

                    //获取到所有的表格元素
                    var trs = $('#smtOnlineaeproductTable').next().find('tr[data-index]');
                    //如果idsArr.length<trs.length
                    for (var i = 0; i < trs.length; i++) {
                        var tr = trs[i];
                        var trItemId = $(tr).find('td[data-field=itemId]>div').text();
                        var trResult = $(tr).find('td[data-field=result]>div');
                        for (var j = 0; j < itemIdArr.length; j++) {
                            let itemArr = itemIdArr[j].split('/')
                            let itemId = itemArr[itemArr.length - 1]
                            if (trItemId == itemId) {
                                trResult.text(result[itemIdArr[j]]);
                                result[itemIdArr[j]].includes('失败') ? trResult.addClass('fRed') : trResult.removeClass('fRed')
                            }
                        }
                    }
                }
            },
            trResultEmptyCount: function () {
                var count = 0
                //获取到所有的表格元素
                var trs = $('#smtOnlineaeproductTable').next().find('tr[data-index]');
                for (var i = 0; i < trs.length; i++) {
                    var tr = trs[i];
                    var checkStat = $(tr).find('td').eq(0).find('div').find('input').is(":checked");
                    var trResult = $(tr).find('td[data-field=result]>div').text();
                    if ((trResult == '' || trResult == null) && checkStat) {
                        count++;
                    }
                }
                return count
            },
            batchOnlineAjax: function (arr) {
                return commonReturnPromise({
                    url: ctx + '/batchOperation/onlineProduct',
                    params: JSON.stringify(arr),
                    type: "POST",
                    contentType: 'application/json;charset=UTF-8'
                })
            },
            selectResultAjax: function (batchNo) {
                return commonReturnPromise({
                    type: "POST",
                    url: ctx + "/sys/selectResult.html",
                    params: { 'batchNo': batchNo },
                })
            }
        }
        // 初始化
        smtOnlineaeproductName.init()
        // 监听批量上架按钮
        smtOnlineaeproductName.batchOnline()

    });

})(jQuery, layui, window, document);