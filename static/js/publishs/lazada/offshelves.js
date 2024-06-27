/**
 * 下架
 */
var lazadaOffShelvesTUnit;
let lazadaOffShelvesTUnit_tableData;
let lazadaOffShelvesTUnit_thSelect = 0;
layui.use(['admin', 'form', 'layer', 'table', 'formSelects', 'element', 'laydate'], function () {
    var form = layui.form,
        layer = layui.layer,
        table = layui.table;
    $ = layui.$;
    //渲染部门销售员店铺三级联动
    render_hp_orgs_users("#lazadaOnlineOffshelves_form");

    form.render(null, 'component-form-element');
    form.render(null, 'component-form-group');
    formSelects = layui.formSelects
    form.render('select');
    form.render('checkbox');


    var idList = localStorage.getItem('itemIds');
    var tableIns = {};
    if (idList) {
        lazadatablerender({'idList': idList});
    }

    // lazadaOffShelves_init()
    // lazadaOffShelves_ProductStatusHtmlStr = ''
    // function lazadaOffShelves_init(){
    //     commonReturnPromise({
    //         url: '/lms/onlineProductLazada/getProductStatus', // 获取父商品状态枚举
    //     })
    //    .then(res=>{
    //     lazadaOffShelves_ProductStatusHtmlStr = "<option value='0'>全部</option>"
    //         for(let key in res){
    //             lazadaOffShelves_ProductStatusHtmlStr += `<option value='${res[key]}'>${res[key]}</option>`
    //         }
    //     })
    // }

    function lazadatablerender(data) {
        commonReturnPromiseRes({
            url: ctx + "/lazadaBatchOperation/getIsEnableProduct.html",
            type: 'POST',
            params: data
        }).then(res=>{
            lazadaOffShelvesTUnit_tableData = res.data;
        tableIns = table.render({
            elem: "#lazadaoffshelftable",
            data:res.data,
            // method: 'post',
            // url: ctx + "/lazadaBatchOperation/getIsEnableProduct.html",
            cols: [
                [
                    {type: "checkbox"},
                    {field: "storeAcctName", title: "店铺"},
                    {field: "itemId", title: "item_id"},
                    {field: "prodSSku", title: "商品SKU"},
                    {field: "storeSubSku", title: "店铺SKU"},
                    {field: "storeSubSku", title: "商品状态", templet: '#productisSaleTpl'},
                    {field: "productStatus", title: "<span style='display: flex'><span style='width: 70px;'>状态</span><select id='lazadaoffshelfTHeader' lay-filter='lazadaoffshelfTHeader'><option value='0'>全部</option><option value='1'>上架中</option><option value='2'>已下架</option></select></span>", templet: '#productStatusTpl'},
                    {field: "operationresult", title: '操作结果'}
                ]
            ],
            page: false,
            height: 500,
            limit:res.count,
            id: "lazadaoffshelftable",
            done:function(){
                $('#lazadaoffshelfNum').text(res.count)
                $("#lazadaoffshelftable").next().find(".layui-table-header").css('overflow','visible')
                $("[lay-filter='lazadaoffshelfTHeader']").val(lazadaOffShelvesTUnit_thSelect)
                form.render("select")
            }
        });
        });
    }

    //批量下架商品
    $('#lazadabatchoffshelf').click(function () {
        //获取表格行对象
        var prodObj = [];
        applytoReloadChecked('lazadaoffshelftable', tableIns, function (tr, data, i) {
            prodObj.push(data);
        });
        //以当前时间戳作为批次号
        var batchNo = new Date().getTime();
        if (prodObj.length > 0) {
            $.ajax({
                beforeSend: function () {
                    loading.show();
                },
                type: "POST",
                url: ctx + "/lazadaBatchOperation/batchIsEnableProduct.html",
                data: {'prodObj': JSON.stringify(prodObj), 'type': "inactive", 'batchNo': batchNo},
                async: true,
                dataType: "json",
                success: function (returnData) {
                    loading.hide()
                    if (returnData.code == "0000") {
                        layer.msg(returnData.msg);
                    } else {
                        loading.hide()
                        layer.msg(returnData.msg);
                    }
                },
                error: function () {
                    loading.hide()
                    layer.msg("服务器正忙");
                }
            });
            lazadaOffShelvesTUnit = setInterval(function () {
                sel(batchNo, "inactive")
            }, 5000);
        }
    });

    /**
     *  查询操作结果
     * @param batchNo 批次号
     * @param operationType 新增操作类型
     */
    function sel(batchNo , operationType) {
        var trObj = $('#lazadaoffshelftable').next().find('.layui-table-body tbody').find('tr');
        var count = 0;
        for (var i = 0; i < trObj.length; i++) {
            var checkStat = trObj.eq(i).find('td').eq(0).find('div').find('input').is(":checked");
            var resultMsg = trObj.eq(i).find('td').eq(6).find('.layui-table-cell').find('div').text();
            if ((resultMsg == '' || resultMsg == null) && checkStat) {
                count++;
            }
        }
        if (count == 0) {
            clearInterval(lazadaOffShelvesTUnit);
            return;
        }

        $.ajax({
            type: "POST",
            url: ctx + "/sys/selectResult.html",
            data: {'batchNo': batchNo},
            async: true,
            dataType: "json",
            success: function (returnData) {
                if (returnData.code == "0000") {
                    var data = returnData.data;

                    for (var i = 0; i < trObj.length; i++) {
                        var itemId = $.trim(trObj.eq(i).find('td').eq(2).find('div').text());//平台商品Id
                        var prodStoreSku = $.trim(trObj.eq(i).find('td').eq(4).find('div').text());//店铺sku
                        var checkStat = trObj.eq(i).find('td').eq(0).find('div').find('input').is(":checked");
                        var resultMsg = trObj.eq(i).find('td').eq(6).find('.layui-table-cell').find('div').text();

                        // 新增操作类型值
                        var logMsg = data['TR_LAZADA_STOPPUBLISH_LOG' + itemId + prodStoreSku + operationType];
                        if ((resultMsg == '' || resultMsg == null) && checkStat) {
                            if (logMsg == '商品下架成功') {
                                trObj.eq(i).find('td').eq(6).find('.layui-table-cell').html("<div style='color:blue'>" + logMsg + "</div>");
                            } else if (logMsg != '' && logMsg != null && logMsg != 'undefined') {
                                trObj.eq(i).find('td').eq(6).find('.layui-table-cell').html("<div style='color:red'>" + logMsg + "</div>");
                            }
                        }
                    }
                }
            },
            error: function () {
                layer.msg("服务器正忙");
                clearInterval(lazadaOffShelvesTUnit);
            }
        });

    }

    //批量删除商品
    $('#lazadabatchdelete').click(function () {
        //获取表格行对象
        var prodObj = [];
        applytoReloadChecked('lazadaoffshelftable', tableIns, function (tr, data, i) {
            prodObj.push(data);
        });
        if (prodObj.length > 0) {
            //以当前时间戳作为批次号
            var batchNo = new Date().getTime();
            $.ajax({
                beforeSend: function () {
                    loading.show();
                },
                type: "POST",
                url: ctx + "/lazadaBatchOperation/batchIsEnableProduct.html",
                data: {'prodObj': JSON.stringify(prodObj), 'type': "delete", 'batchNo': batchNo},
                async: true,
                dataType: "json",
                success: function (returnData) {
                    loading.hide()
                    if (returnData.code == "0000") {
                        layer.msg(returnData.msg);
                    } else {
                        loading.hide()
                        layer.msg(returnData.msg);
                    }
                },
                error: function () {
                    loading.hide()
                    layer.msg("服务器正忙");
                }
            });
            lazadaOffShelvesTUnit = setInterval(function () {
                sel(batchNo,"deleted")
            }, 20000);
        }
    });


    function getResult(prodObj, timer, i) {
        $.ajax({
            type: "POST",
            url: ctx + "/lazadaBatchOperation/selectStopPublishResult.html",
            data: {'prodObj': JSON.stringify(prodObj)},
            async: false,
            dataType: "json",
            success: function (returnData) {
                var $tr = {}
                applytoReloadChecked('lazadaoffshelftable', tableIns, function (tr, data, index) {
                    if (index == i) {
                        $tr = tr;
                    }
                });
                clearInterval(timer);
                if (returnData.code = "0000") {
                    if (returnData.msg == '商品下架成功') {
                        $tr.find('td[data-field="operationresult"] div').html("<div style='color:blue'>" + returnData.msg + "</div>")
                    } else if (returnData.msg != '' && returnData.msg != null && returnData.msg != 'undefined') {
                        $tr.find('td[data-field="operationresult"] div').html("<div style='color:red'>" + returnData.msg + "</div>");
                    }
                }
            },
            error: function () {
                layer.msg("服务器正忙");
                clearInterval(timer);
            }
        });
    }

    form.on('select(lazadaoffshelfTHeader)', function (data) {
        let newData = [];
        lazadaOffShelvesTUnit_thSelect = data.value;
        if(data.value == '0'){
            newData = lazadaOffShelvesTUnit_tableData
        }else if(data.value == '1'){
            newData = lazadaOffShelvesTUnit_tableData.filter(item => item.productStatus == 'active')
        }else if(data.value == '2'){
            newData = lazadaOffShelvesTUnit_tableData.filter(item => item.productStatus == 'inactive')
        }
        table.reload('lazadaoffshelftable', {data:newData})
    })

    form.on('submit(lazadaoffshelfSearch)', function (data) {
        var data = data.field;
        data.searchType = 1 // 精确查询
        var skuListArr = data.skuList.split(',').filter(function (item) {
            return $.trim(item);
        })
        if (!skuListArr.length) {
            return layer.msg('请输入需要查询的sku', {icon: 7});
        }
        if (skuListArr.length > 100) {
            return layer.msg('查询的sku长度不能大于100', {icon: 7});
        }
        data.skuType == "0" ? data.sSkuList = skuListArr.join(',') : data.pSkuList = skuListArr.join(',');

        //获取选中的店铺
        var storesStr = $('#lazadaOffshelvesstoreAcctIdList').find('input').eq(0).val();//店铺id
        if (storesStr != null && storesStr.length > 0) { //选择店铺了
            data.storeAcctIdList = storesStr;
        } else {
            var acctIds = $('#lazadaOffshelvesstoreAcctIdList').attr('acct_ids');
            if (acctIds != null && acctIds != '') {
                data.storeAcctIdList = acctIds;
            }
        }
        //ztt 2.10 暂时未找到哪里加了select字段,删除可解决问题
        delete data.select;
        lazadatablerender(data);
        return false;
    })

});