/**
 * time: 2019/07/25
 */

layui.use(["admin", "form", "table", "layer", "laydate"], function () {
    var admin = layui.admin,
        form = layui.form,
        table = layui.table,
        layer = layui.layer,
        element = layui.element,
        laydate = layui.laydate,
        $ = layui.$;

    form.render('select');

    // 供应商搜索
    var dim = new DimSearch('#searchSupplier_purchaseparam', 'supplierId');
    dim.init();

    $("#searchReset_purchaseparam").click(function() {
        $("#purchaseParamSearchForm")[0].reset();
        $("#purchaseParamSearchForm input[type='hidden']").val('');
    });
    // 初始化仓库
    initSelectByAjax('/prodWarehouse/searchProdWarehouse',{storeType: 1,status: 1},{name: 'warehouseName',value: 'id'},'#purchaseParamSearchForm [name=warehouseId]',form,null,)

    //展示已知数据
    function search_purchaseParam(data) {
        table.render({
            elem: "#purchaseParamTable",
            id: 'purchaseParamTable',
            method: "post",
            url: ctx + "/whPurchaseParam/queryPage.html",
            where: data,
            cols: [
                [
                    //标题栏
                    {type: "checkbox"},
                    {title: "子SKU",templet: '#sku_purchaseparam'},
                    {title: "在售", templet: '#isSale_purchaseparam',width: 25},
                    {title: "时间", templet: '#tableTime_purchaseparam'},
                    {title: "采购到货天数",templet:'#purchaseDlvrDays_purchaseparam'},
                    {title: "库存预警周期",templet:'#stockWarnCycle_purchaseparam'},
                    {title: "库存上限",templet:`#upperStock_purchaseparam`},
                    {title: "库存下限",templet:`#lowerStock_purchaseparam`},
                    {title: "库存周转天数",templet: '#stockAbleDays_purchaseparam'},
                    {title: "5/15/30天订单量",templet: '#orderNum_purchaseparam'},
                    {title: "人员",templet: '#person_purchaseparam'},
                    {field: "lastMonthBuyTime", title: "月采购次数"},
                    {title: "加权日均销量",templet: '#dailySaleNum3_purchaseparam'},
                    {title: "供应商", templet: '#supplier_purchaseparam'},
                ],
            ],
            done: function(res, curr, count){
                $("#purchaseParam_colLen").text(res.count);
                // 固定表头
                $('#purchaseParamTable').next('.layui-table-view').find('.layui-table-header').addClass('toFixedContain')

            },
            page: true, //是否显示分页
            limits: [100, 500, 1000],
            limit: 100, //每页默认显示的数量
        });
    }

    $('#searchBtn_purchaseParam').click(function () {
        var data = serializeObject($('#purchaseParamSearchForm'))
        search_purchaseParam(data)
    });

    $('#recalculate_purchaseparam').click(function () {

        var confirmIndex = layer.confirm('确认发起请求-重新计算理论采购参数吗？', { btn: ['确认', '取消'] }, function() {
            var ajax = new Ajax(true)
            ajax.post({
                url: ctx + "/whPurchaseParam/recalculatePurchaseparam.html",
                data: JSON.stringify({}),
                contentType: 'application/json',
                timeout: 800000,
                success: function (data) {
                    if (data.code == '0000') {
                        $('#searchBtn_purchaseParam').click()
                    }
                },
            },{showLoading:false})
            layer.close(confirmIndex)
            layer.msg("后台正在计算，请稍等",{icon:6})
        },function () {
        })
    })

    $('#toChangeProdSInfo_purchaseparam').click(function () {
        var confirmIndex = layer.confirm('确认发起请求-将商品的采购参数改为理论参数吗？', { btn: ['确认', '取消'] }, function() {
            var ajax = new Ajax(true)
            ajax.post({
                url: ctx + "/whPurchaseParam/updateProdSInfoPurchaseParam.html",
                data: JSON.stringify({}),
                contentType: 'application/json',
                timeout: 800000,
                success: function (data) {
                    if (data.code == '0000') {
                        $('#searchBtn_purchaseParam').click()
                    }
                }
            })
        },function () {
            layer.close(confirmIndex)
        })
    })

    $('#downTemp_purchaseparam').click(function () {
        window.location.href = ctx + '/static/templet/ebayPurParamUpdateTemp.xlsx'
    })

    // 导入excel 修改ebay虚拟仓参数
    $('#updateEbayPurParamByExcel_purchaseparam').click(function () {
        $('#updateEbayPurParamFile_purchaseparam').click()
    })

    $('#updateEbayPurParamFile_purchaseparam').on('change', function() {
        var files = $('#updateEbayPurParamFile_purchaseparam')[0].files
        // 如果没有文件则终止
        if (files.length == 0) {
            return
        }
        // 校验文件类型
        var fileName = files[0].name
        var seat = fileName.lastIndexOf(".");
        var extension = fileName.substring(seat).toLowerCase();
        if (extension != '.xlsx' && extension != 'xls') {
            layer.msg('请传入后缀为.xlsx或者.xls 的Excel文件')
            return
        }
        var formData = new FormData();
        formData.append("file", files[0]);
        layer.confirm('确认导入这个文件进行批量修改ebay虚拟仓参数吗', { btn: ['确认', '取消'] },
            function() {
                loading.show()
                $.ajax({
                    url: ctx + '/whPurchaseParam/updateEbayPurParamByExcel.html',
                    type: 'POST',
                    // async : false,
                    data: formData,
                    // 告诉jQuery不要去处理发送的数据
                    processData: false,
                    // 告诉jQuery不要去设置Content-Type请求头
                    contentType: false,
                    success: function(data) {
                        loading.hide()
                        $('#updateEbayPurParamFile_purchaseparam').val('')

                        if (data.code === '0000') {
                            layer.msg("修改成功");
                        } else {
                            layer.msg(data.msg)
                        }
                    },
                    error: function() {
                        loading.hide()
                        $('#updateEbayPurParamFile_purchaseparam').val('')
                    }
                });
            },
            function() {
                layer.closeAll()
            }
        )
    })

    // 批量计算
    $('#purchaseparam_calculateBatch').click(function () {
        let checkStatus = table.checkStatus('purchaseParamTable'),
            data = checkStatus.data
        if (data.length === 0) {
            layer.msg('请选择需要计算的商品')
            return
        }
        let idList = []
        for (let i = 0; i < data.length; ++i) {
            idList.push(data[i].id)
        }
        let Adata = {
            prodIdList: idList,
            storeId: $('#purchaseParamSearchForm').find('[name=warehouseId]').val()
        }
        oneAjax.post({
            url: '/whPurchaseParam/calByProdSIdList',
            data: Adata,
            success: function (res) {
                if (res.code === '0000') {
                    layer.msg('计算成功')
                    refreshTable()
                }
            }
        })
    })
    // 批量修改
    $('#purchaseparam_updateBatch').click(function () {
        let checkStatus = table.checkStatus('purchaseParamTable'),
            data = checkStatus.data
        if (data.length === 0) {
            layer.msg('请选择需要计算的商品')
            return
        }
        let idList = []
        for (let i = 0; i < data.length; ++i) {
            idList.push(data[i].id)
        }
        oneAjax.post({
            url: '/whPurchaseParam/updateProdSInfoPurchaseParamByProdSIdList',
            data: idList,
            success: function (res) {
                if (res.code === '0000') {
                    layer.msg('修改成功')
                    refreshTable()
                }
            }
        })
    })

    // 下载导入模板
    $('#purchaseparam_downUpdateTemplate').click(function() {
        window.location.href = ctx + '/static/templet/updatePurchaseParam.xlsx'
    })


    // 通过导入excel修改采购参数
    $('#purchaseparam_updateByExcelFile').on('change', function() {
        var files = $('#purchaseparam_updateByExcelFile')[0].files
        // 如果没有文件则终止
        if (files.length == 0) {
            return
        }
        // 校验文件类型
        var fileName = files[0].name
        var seat = fileName.lastIndexOf('.')
        var extension = fileName.substring(seat).toLowerCase()
        if (extension != '.xlsx' && extension != 'xls') {
            layer.msg('请传入后缀为.xlsx或者.xls 的Excel文件')
            return
        }
        var formData = new FormData()
        formData.append('file', files[0])
        layer.confirm('确认导入这个文件进行批量新增子商品吗', { btn: ['确认', '取消'] },
            function() {
                loading.show()
                $.ajax({
                    url: ctx + '/whPurchaseParam/updatePurchaseParamByExcel.html',
                    type: 'POST',
                    // async : false,
                    data: formData,
                    // 告诉jQuery不要去处理发送的数据
                    processData: false,
                    // 告诉jQuery不要去设置Content-Type请求头
                    contentType: false,
                    success: function(data) {
                        loading.hide()
                        // 清空 excel
                        $('#purchaseparam_updateByExcelFile').val('')
                        if (data.code == '0000') {
                            layer.msg('修改成功')
                        } else {
                            layer.alert(data.msg)
                        }
                    },
                    error: function() {
                        loading.hide()
                        $('#purchaseparam_updateByExcelFile').val('')
                    }
                })
            },
            function() {
                layer.closeAll()
            }
        )
    })
});
