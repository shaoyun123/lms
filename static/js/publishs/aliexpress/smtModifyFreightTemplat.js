/**
 * 调整运费模板
 */
//  var storegroupTemp="";
layui.use(['admin', 'form', 'layer', 'table', 'formSelects', 'element', 'laydate'], function () {
    var admin = layui.admin,
        form = layui.form,
        layer = layui.layer,
        table = layui.table,
        formSelects = layui.formSelects,
        $ = layui.$;
    render_hp_orgs_users("#smt_theShelves_searchForm");//渲染部门销售员店铺三级联动
    form.render(null, 'component-form-element');
    form.render(null, 'component-form-group');
    formSelects = layui.formSelects
    form.render('select');
    form.render('checkbox');
    form.render('radio');

    //表格渲染结果
    //展示已知数据
    var data = new Object();
    if (smt_arr.length > 0) {
        data.idList = [];
        for (var i = 0; i < smt_arr.length; i++) {
            data.idList.push(smt_arr[i].id);
        }
        data.idList = data.idList.join(",");
    }
    if (smt_arr.length > 0) {
        // 因为是同个店铺才可以，，所以取第一项就可以了
        tableReload(data, smt_arr[0].storeAcctId)
    }

    function tableReload (data, _storeAcctId) {
        tableIns = table.render({
            elem: "#smtModifyfreightTemplatTable",
            method: 'post',
            url: ctx + "/batchOperation/getModifyFreightTemplat.html",
            cols: [[
                { type: "checkbox" },
                { field: "id", title: "id" },
                { field: "storeAcctId", title: "店铺id" },
                { field: "storeAcct", title: "店铺", width: 130 },
                { field: "prodPSku", title: "商品父SKU", width: 130 },
                { field: "storePSku", title: "店铺父SKU", width: 130 },
                { field: "itemId", title: "Item ID", width: 130 },
                { field: "sales", title: "销量" },
                { field: "templateName", title: "运费模板", width: 200 },
                { field: 'regionPriceTemplateName', title: '区域调价模板', width: 200 },
                { field: "result", title: '操作结果' }
            ]],
            page: false,
            where: data,
            id: "smtModifyfreightTemplatTable",
            height: 500,
            limits: [10, 20, 50],
            limit: 10,
            done: function (res, curr, count) {
                $("[data-field='id']").css('display', 'none');
                $("#tolnum_span_smt_templat").text("共" + count + "条");
                if (res.code == "0000") {
                    $("#smt_template_online_store_sel").val(_storeAcctId)
                    smt_fyfreight_fetchFreightTpl(_storeAcctId)
                    smt_fyfreight_fetchRegionPriceTpl([].concat(_storeAcctId))
                } else {
                    $("#smt_fyfreight_templat").children().filter("option").remove();//清空option
                    $("#smt_fyfreight_regionPriceTpl").children().filter("option").remove();//清空option
                }
                form.render('select');
            }
        });
    }

    //区域调价模板
    function smt_fyfreight_fetchRegionPriceTpl (storeAcctIdList = []) {
        commonReturnPromise({
            url: ctx + '/smtRegionPrice/getTemplateByStore.html',
            type: 'post',
            contentType: 'application/json;charset=UTF-8',
            params: JSON.stringify(storeAcctIdList)
        }).then(res => {
            commonRenderSelect('smt_fyfreight_regionPriceTpl', res, { name: 'templateName', code: 'id' })
                .then(() => form.render())
        })
    }

    // 运费模板
    function smt_fyfreight_fetchFreightTpl (storeAcctId) {
        commonReturnPromise({
            url: ctx + '/batchOperation/getStoreAcctFreightTemp.html',
            params: { storeAcctId }
        }).then(res => {
            commonRenderSelect('smt_fyfreight_templat', res, { name: 'templateName', code: 'templateId' })
                .then(() => form.render())
        })
    }

    var active = {
        reload: function () {
            var data = new Object();
            let storeAcctId = $('#smt_template_online_store_sel').val()
            storeAcctId == '' ? [] : (data.storeAcctIdList = [].concat(storeAcctId))
            data.sSkuList = [];
            var skuStr = $.trim($("#smt_theShelves_searchForm input[name='temp_skuList']").val());
            if ($("#temp_pAnds_sku").val() == 0) {
                if (skuStr != "" && skuStr != null) {
                    data.sSkuList = $.trim(skuStr.split(","));
                }
            } else {
                if (skuStr != "" && skuStr != null) {
                    data.pSkuList = $.trim(skuStr.split(","));
                }
            }
            data.storeAcctIdList = $.trim(data.storeAcctIdList);
            var salepersonId = $.trim($("#smt_theShelves_searchForm select[name='saleName']").val());
            data.salepersonId = salepersonId;
            data.searchType = $("#smt_temp_idEnable_skuSearchType").val();//搜索类型
            tableReload(data, storeAcctId);
        }
    };
    $("#smtModifyTempSearchBtn").click(function () {
        var type = $(this).data('type');
        active[type] ? active[type].call(this) : '';
    });
    $("#smtModifyTemppltResetBtn").click(function () {
        $("#smt_theShelves_searchForm input").each(function () {
            $(this).val("");
        });
        $("#smt_theShelves_searchForm option").each(function () {
            $(this).attr('selected', false);
        })
        form.render('select');
    });
    /*同步最新运费模板*/
    $("#smt_product_template_sync").click(function () {
        var storeAcctId = $("#smt_template_online_store_sel").val();
        if (storeAcctId == '' || storeAcctId == null) {
            layer.msg("请选择店铺", { icon: 0 });
            return false;
        }
        loading.show();
        $.ajax({
            type: "post",
            url: ctx + "/onlineProductSmt/syncSmtProductTemplate.html",
            data: { "storeAcctId": storeAcctId },
            dataType: "json",
            success: function (returnData) {
                loading.hide();
                if (returnData.code == "0000") {
                    layer.msg(returnData.msg, { icon: 1 });
                    $("#smt_fyfreight_templat").html('<option value="0">请选择</option>');
                    for (var i = 0; i < returnData.data.length; i++) {
                        $("#smt_fyfreight_templat").append("<option value='" + returnData.data[i].templateId + "'>" + returnData.data[i].templateName + "</option>")
                    }
                    form.render('select');
                } else {
                    layer.msg(returnData.msg, { icon: 2 });
                }
            }
        });
    });
    var smtModifyFreightTemplatName = {
        chekedTrEmpty: function () {
            //获取到所有的表格元素
            var trs = $('#smtModifyfreightTemplatTable').next().find('.layui-table-body tbody tr');
            for (var i = 0; i < trs.length; i++) {
                var tr = trs[i];
                var checkStat = $(tr).find('td').eq(0).find('div').find('input').is(":checked");
                var trResult = $(tr).find('td[data-field=result]>div');
                // 将选中的元素的操作结果置空
                checkStat && trResult.html('');
            }
        },
        batchHandle: function () {
            var _this = this;
            $('#smt_fyfreight__batchEdit').on('click', function () {
                let freightTemplateId = $('#smt_fyfreight_templat').val()  //运费模板
                let regionPriceTemplateId = $('#smt_fyfreight_regionPriceTpl').val()  //区域调价模板
                //获取表格选中的数据,然后组装数据
                var cks = table.checkStatus('smtModifyfreightTemplatTable').data; //获取选择的店铺
                if (!cks.length) {
                    layer.msg('请先选中需要操作的数据!');
                    return;
                };
                if (!freightTemplateId && !regionPriceTemplateId) {
                    return layer.msg('请选择运费模板或者区域调价模板')
                }
                // 将选中的元素的操作结果置空
                _this.chekedTrEmpty()
                var tarArr = cks.map(function (item) {
                    let obj = {}
                    obj.id = item.id
                    obj.itemId = item.itemId
                    obj.storeAcct = item.storeAcct
                    obj.prodPSku = item.prodPSku
                    !!freightTemplateId && (obj.freightTemplateId = freightTemplateId)//运费模板
                    !!regionPriceTemplateId && (obj.regionPriceTemplateId = regionPriceTemplateId)//区域调价模板
                    return obj
                });
                let url = ctx + '/batchOperation/batchRegionPrice.html'
                if (smtMoFreightTplTimeUnit != null) {
                    clearInterval(smtMoFreightTplTimeUnit)
                }
                _this.batchSelectResult(tarArr, url)
            });
        },
        batchRegionPrcTplCancel: function () {  //批量取消区域调价
            var _this = this;
            $('#smt_fyfreight_regionPrcCancel').on('click', function () {
                //获取表格选中的数据,然后组装数据
                var cks = table.checkStatus('smtModifyfreightTemplatTable').data; //获取选择的店铺
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
                if (smtMoFreightTplTimeUnit != null) {
                    clearInterval(smtMoFreightTplTimeUnit)
                }
                _this.batchSelectResult(tarArr, url)
            })
        },
        // 通过选中数据获取批次号，然后setInterval查询结果，直到选中数据的操作结果都有值
        batchSelectResult: function (tarArr, url) {
            var _this = this
            _this.getHandleResultAjax(tarArr, url)
                .then(function (batchNo) {
                    clearInterval(smtMoFreightTplTimeUnit);
                    layer.msg('处理中，请稍等...')
                    smtMoFreightTplTimeUnit = setInterval(function () {
                        var count = _this.trResultEmptyCount()
                        if (count == 0) {
                            clearInterval(smtMoFreightTplTimeUnit);
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
        showHandleResult: function (result) {  //调用批量取消和批量修改后，将结果显示在列表中
            //获取到返回结果的属性值
            if (Object.keys(result).length) {
                var idsArr = Object.keys(result)

                //获取到所有的表格元素
                var trs = $('#smtModifyfreightTemplatTable').next().find('tr[data-index]');
                //如果idsArr.length<trs.length
                for (var i = 0; i < trs.length; i++) {
                    var tr = trs[i];
                    var trItemId = $(tr).find('td[data-field=itemId]>div').text();
                    var trResult = $(tr).find('td[data-field=result]>div');
                    for (var j = 0; j < idsArr.length; j++) {
                        let itemArr = idsArr[j].split('/')
                        let itemId = itemArr[itemArr.length - 1]
                        let resMsg = result[idsArr[j]]
                        if (trItemId == itemId) {
                            trResult.text(resMsg);
                            let color = resMsg == '修改成功' || resMsg == '调价成功' ? 'blue' : 'red'
                            trResult.css('color', color)
                        }
                    }
                }
            }
        },
        trResultEmptyCount: function () {
            var count = 0
            //获取到所有的表格元素
            var trs = $('#smtModifyfreightTemplatTable').next().find('.layui-table-body tbody tr');
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
    }

    // 批量调整
    smtModifyFreightTemplatName.batchHandle()
    //取消区域调价 
    smtModifyFreightTemplatName.batchRegionPrcTplCancel()
});
$('body').on('mouseover', '.errordata', function () {
    var content = $(this).next("textarea").val()
    layer.tips(content, $(this), {
        time: 3000
    });
})