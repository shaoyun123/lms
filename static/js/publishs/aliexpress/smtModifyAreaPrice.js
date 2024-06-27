layui.use(['admin', 'table', 'form', 'layer', 'laytpl'], function () {
    var admin = layui.admin,
        table = layui.table,
        layer = layui.layer,
        laytpl = layui.laytpl,
        form = layui.form;
    // render_hp_orgs_users("#smtModifyAreaPriceForm");//渲染部门销售员店铺三级联动
    //命名空间
    var smtModifyAreaPriceName = {
        getTemplates: function (arr) { //获取所有的模板并渲染
            this.getTemplatesAjax(arr)
                .then(res => {
                    commonRenderSelect('smtModifyAreaPrice_templateId', res, { name: 'templateName', code: 'id' })
                        .then(() => form.render())
                }).catch(err => layer.msg(err || err.msg, { icon: 2 }))
        },
        getTemplatesAjax: function (data) {
            return commonReturnPromise({
                url: ctx + '/smtRegionPrice/getTemplateByStore',
                type: 'post',
                params: JSON.stringify(data),
                contentType: 'application/json'
            })
        },
        tableRender: function (data) { //渲染表格
            var _this = this;
            table.render({
                elem: "#smtModifyAreaPriceTable",
                method: 'post',
                url: ctx + "/batchOperation/getModifyFreightTemplat.html",
                where: data,
                cols: [[
                    { type: "checkbox" },
                    // { field: "id", title: "id"},
                    // { field: "storeAcctId", title:"店铺id" },
                    { field: "storeAcct", title: "店铺", width: 200 },
                    { field: "itemId", title: "Item ID", width: 200 },
                    { field: "result", title: '操作结果' }
                ]],
                page: false,
                limits: [50, 100],
                height: 500,
                limit: 50,
                id: "smtModifyAreaPriceTableId",
                done: function () {
                    _this.batchHandle();
                    _this.batchHandleCancel()
                }
            });
        },
        getHandleResultAjax: function (tarArr, url) { // 批量操作和批量取消操作,动态显示操作结果
            //点击批量操作,发送ajax同时请求动态返回操作结果
            return new Promise(function (resolve, reject) {
                $.ajax({
                    type: 'post',
                    dataType: 'json',
                    data: JSON.stringify(tarArr),
                    url: url,
                    contentType: 'application/json',
                    beforeSend: function () {
                        loading.show();
                    },
                    success: function (res) {
                        loading.hide();
                        layer.msg(res.msg);
                        resolve(res.data);
                    },
                    error: function () {
                        loading.hide();
                        reject('服务器有错误, 请联系开发者解决');
                    }
                });
            });
        },
        showHandleResult: function (result) {  //调用批量取消和批量修改后，将结果显示在列表中
            //获取到返回结果的属性值
            if (Object.keys(result).length) {
                var idsArr = Object.keys(result)

                //获取到所有的表格元素
                var trs = $('#smtModifyAreaPriceTable').next().find('tr[data-index]');
                //如果idsArr.length<trs.length
                for (var i = 0; i < trs.length; i++) {
                    var tr = trs[i];
                    var trItemId = $(tr).find('td[data-field=itemId]>div').text();
                    var trResult = $(tr).find('td[data-field=result]>div');
                    // trResult.html('');
                    for (var j = 0; j < idsArr.length; j++) {
                        let itemArr = idsArr[j].split('/')
                        let itemId = itemArr[itemArr.length - 1]
                        if (trItemId == itemId) {
                            trResult.text(result[idsArr[j]]);
                        }
                    }
                }
            }
        },
        batchHandle: function () {
            var _this = this;
            $('#smtModifyAreaPrice_batchEdit').on('click', function () {
                var templateId = $('[name=templateId]').find('option:selected').val();
                //获取表格选中的数据,然后组装数据
                var cks = table.checkStatus('smtModifyAreaPriceTableId').data; //获取选择的店铺
                if (!cks.length || !templateId) {
                    layer.msg('请先选中需要操作的数据和模板!');
                    return;
                };
                // 将选中的元素的操作结果置空
                _this.chekedTrEmpty()
                var tarArr = cks.map(function (item) {
                    return {
                        id: item.id,
                        itemId: item.itemId,
                        storeAcct: item.storeAcct,
                        templateId: templateId,
                    }
                });
                let url = ctx + '/batchOperation/batchRegionPrice.html'
                if (smtMoAreaPriceTimeUnit != null) {
                    clearInterval(smtMoAreaPriceTimeUnit)
                }
                _this.batchSelectResult(tarArr, url)
            });
        },

        batchHandleCancel: function () {  //批量取消
            var _this = this;
            $('#smtModifyAreaPrice_batchEditCancel').on('click', function () {
                //获取表格选中的数据,然后组装数据
                var cks = table.checkStatus('smtModifyAreaPriceTableId').data; //获取选择的店铺
                if (!cks.length) {
                    layer.msg('请先选中需要操作的数据!');
                    return;
                };
                // 将选中的元素的操作结果置空
                _this.chekedTrEmpty()
                var tarArr = cks.map(function (item) {
                    return {
                        id: item.id,
                        itemId: item.itemId,
                        storeAcct: item.storeAcct,
                    }
                });
                let url = ctx + '/batchOperation/cancelRegionPrice'
                if (smtMoAreaPriceTimeUnit != null) {
                    clearInterval(smtMoAreaPriceTimeUnit)
                }
                _this.batchSelectResult(tarArr, url)
            })
        },
        // 通过选中数据获取批次号，然后setInterval查询结果，直到选中数据的操作结果都有值
        batchSelectResult: function (tarArr, url) {
            var _this = this
            _this.getHandleResultAjax(tarArr, url)
                .then(function (batchNo) {
                    smtMoAreaPriceTimeUnit = setInterval(function () {
                        var count = _this.trResultEmptyCount()
                        if (count == 0) {
                            clearInterval(smtMoAreaPriceTimeUnit);
                            return;
                        }
                        commonReturnPromise({
                            type: "POST",
                            url: ctx + "/sys/selectResult.html",
                            params: { 'batchNo': batchNo },
                        }).then(data => {
                            _this.showHandleResult(data)
                        })
                    }, 5000);
                })
                .catch(function (reason) {
                    layer.msg(reason);
                })
        },
        chekedTrEmpty: function () {
            //获取到所有的表格元素
            var trs = $('#smtModifyAreaPriceTable').next().find('tr[data-index]');
            for (var i = 0; i < trs.length; i++) {
                var tr = trs[i];
                var checkStat = $(tr).find('td').eq(0).find('div').find('input').is(":checked");
                var trResult = $(tr).find('td[data-field=result]>div');
                // 将选中的元素的操作结果置空
                checkStat && trResult.html('');
            }
        },
        trResultEmptyCount: function () {
            var count = 0
            //获取到所有的表格元素
            var trs = $('#smtModifyAreaPriceTable').next().find('tr[data-index]');
            for (var i = 0; i < trs.length; i++) {
                var tr = trs[i];
                var checkStat = $(tr).find('td').eq(0).find('div').find('input').is(":checked");
                var trResult = $(tr).find('td[data-field=result]>div').text();
                if ((trResult == '' || trResult == null) && checkStat) {
                    count++;
                }
            }
            return count
        }
    };

    //如果smt_arr有值 就赋值给表格
    if (smt_arr.length) {
        var idListArr = smt_arr.map(function (item) {
            return item.id;
        });
        var storeIdArr = smt_arr.map(item => item.storeAcctId)
        var obj = {};
        obj.idList = idListArr.join(',');
        smtModifyAreaPriceName.getTemplates([...new Set(storeIdArr)])   //店铺id去重,渲染模板
        smtModifyAreaPriceName.tableRender(obj);
    } else {
        layer.msg('因为反应太慢,表格为渲染,重新打开试试呗!');
    }
    //监听表单提交事件
    form.on('submit(smtModifyAreaPrice_submit)', function (obj) {
        var data = obj.field;
        var val = $('#smtModifyAreaPriceInput').val();
        if (!val) {
            delete data.pAndsSkuList;
        } else {
            data[data.pAndsSkuList] = val;
            delete data.pAndsSkuList;
        }
        smtModifyAreaPriceName.tableRender(data);
    });
});