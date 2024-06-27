/**
 * time: 2018/01/02
 */
var queryPage_stockwarning,active_stockwarning

layui.use(["admin", "form", "table", "layer", "laytpl", "laydate","element"], function () {
    var admin = layui.admin,
        form = layui.form,
        table = layui.table,
        layer = layui.layer,
        laytpl = layui.laytpl,
        laydate = layui.laydate,
        element = layui.element,
        $ = layui.$;
    form.render('select');
    form.render('radio');
    form.render('checkbox');

    queryPage_stockwarning = function () {
        var data = serializeObject($('#stockwarning_searchForm'))
        table.render({
            elem: "#stockWarningTable",
            method: "post",
            url: ctx + "/whStockWarning/getStockWarningList.html",
            where: data,
            cols: [
                [
                    //标题栏
                    { type: "checkbox", width: 30 },
                    {title:'图片', templet: '#image_stockWarning', width:70},
                    {title: "建议采购",templet: '#stockWarning_ifAdvicePurchase',width:70},
                    {title: "SKU",templet: '#stockWarning_skuInfo'},
                    {title: "商品信息",templet: '#stockWarning_Info'},
                    {title: "人员",templet: "#stockWarning_userInfo"},
                    {title: "价格",templet: "#stockWarning_priceInfo"},
                    {title: "同款最低",templet: "#stockWarning_lowestPrice"},
                    {title: "采购参数",templet: "#stockWarning_purchaseInfo"},
                    {title: "库存",templet: "#stockWarning_stockInfo"},
                    {title: "销量",templet: "#stockWarning_salesInfo"},
                    {title: "订单数",templet: "#stockWarning_orderInfo"},
                    {title: "供应商",templet: "#stockWarning_supplierInfo"},
                    // //绑定工具条
                    // {title: '操作', align: 'center', toolbar: '#stockwarning_bar'}
                ],
            ],
            id: 'stockWarningTable',
            // height:table_height(),
            page: true,
            limits: [100, 500, 1000],
            done: function (res) {
                $('#total_stockWarning').text(res.count)
                //懒加载
                imageLazyloadAll();
            },
            limit: 100
        });
    }

    // 表格数据重载
    active_stockwarning = {
        reload: function(data){
            //执行重载
            table.reload('stockWarningTable', {
                page: {
                    curr: 1 //重新从第 1 页开始
                },
                where: data
            });
        }
    }

    //弹出分类框
    $("#stockwarning_searchCate_btn").click(function() {
        admin.itemCat_select('layer-work-develop-stockWarning', 'stockwarning_cateId_search_Inp', 'stockwarning_search_cate');
    });

    //展示已知数据
    // queryPage_stockwarning()

    //初始化2个日期框
    laydate.render({
        elem: '#stockWarning_searchTime'
        , range: true
    });

    // 初始化可选人员--搜索栏
    initHpSelect('#stockwarning_searchForm')

    // 搜索按钮
    $('#stockWarning_searchBtn').click(function () {
        queryPage_stockwarning()
    })

    // 重置按钮
    $("#stockWarning_resetBtn").click(function () {
        $("#stockwarning_searchForm [name]:not(.hiddenContent)").val('')
        $('#stockwarning_search_cate').text('')
        form.render('select')
    })

    // 刷新数据
    $('#stockWarning_reFreshData_Btn').click(function () {
        layer.confirm('确认进行数据刷新吗？',["确定","取消"],function(){
            $.ajax({
                url: ctx + "/whStockWarning/reFreshStockWarning.html",
                type : 'POST',
                contentType: 'application/json',
                dataType: 'json',
                success: function (data) {
                    loading.hide()
                    console.log(1111)
                    if (data.code == '0000') {
                        layer.alert('已经发起重新同步，请10分钟后刷新查看数据')
                    } else {
                        layer.msg(data.msg)
                    }
                }
            })
        })
    })

    // 预生成采购订单
    $('#pre_generate_pur_order_btn').click(function () {
        var checkStatus = table.checkStatus('stockWarningTable'),
            selecteddata = checkStatus.data;
        var idList = []
        for (var i = 0; i < selecteddata.length; ++i) {
            idList.push(selecteddata[i].id)
        }

        var confirmIndex = layer.confirm('即将根据查询条件预生成采购订单，如果筛选的数量过多，将造成浏览器卡顿，确认此操作？',["确定","取消"],function(){
            layer.close(confirmIndex)
            var prePurchasePopIndex = layer.open({
                type: 1,
                title: "生成采购订单",
                area: ["1160px", "90%"],
                btn: ['生成订单','关闭'],
                shadeClose: false,
                content: $("#pre_generate_pur_order_pop").html(),
                success: function (layero, index) {
                    form.render('select')
                    loading.show()
                    var data = serializeObject($('#stockwarning_searchForm'))
                    data.idList = idList
                    checkNull(data)

                    $.ajax({
                        url: ctx + "/purOrderMain/preGenerateOrderByStockWarningQueryBean.html",
                        type : 'POST',
                        contentType: 'application/json',
                        dataType: 'json',
                        data: JSON.stringify(data),
                        success: function (res) {
                            // 初始化采购算法
                            $('#pre_generate_pur_order_form [name=countMethod]').val($('#stockwarning_searchForm [name=countMethod] option:selected').text())

                            // 初始化预计到货时间
                            var today = new Date()
                            today.setDate(today.getDate() + 7)
                            $('#pre_generate_pur_order_form [name=preDlvrDate]').val(format(today, 'yyyy-MM-dd'))
                            // 初始化付款方式选择
                            $('#pre_generate_pur_order_form [name=payType]').html($('#payTypeOptionBox').html())
                            // 初始化采购员选择
                            $('#pre_generate_pur_order_form [name=mainBuyerId]').html($('#buyerOptionBox').html())
                            form.render("select")
                            // 批量修改事件
                            $('#UpdatePurOrderMainInfoByListBtn').click(function () {
                                // 获取要修改的条目
                                var checkStatus = table.checkStatus('purOrderMainTable'),
                                    selecteddata = checkStatus.data;
                                if (selecteddata.length == 0) {
                                    layer.msg('请选中你要修改的行')
                                    return
                                }
                                // 获取修改的内容
                                var buyerId = $('#pre_generate_pur_order_form [name=mainBuyerId]').val()
                                var buyer = $('#pre_generate_pur_order_form [name=mainBuyerId] option:selected').text()
                                var payType = $('#pre_generate_pur_order_form [name=payType]').val()

                                var index
                                for (var j = 0; j < selecteddata.length; ++j) {
                                    index = selecteddata[j].sequence
                                    if (buyerId) {
                                        preCreateOrderList[index].mainBuyerId = buyerId
                                        preCreateOrderList[index].mainBuyer = buyer
                                    }
                                    if (payType) {
                                        preCreateOrderList[index].payType = payType
                                    }
                                }

                                // 重新渲染数据
                                showAndAddEventForPurOrderList(preCreateOrderList)
                            })

                            loading.hide()
                            if (res.code == '0000') {
                                var data = res.data
                                // 给主表数据加序列号数据  并指定初始采购员 默认付款方式 支付宝    默认采购仓库第一个子sku的默认仓库
                                for (var i = 0; i < data.length; ++i) {
                                    data[i].sequence = i
                                    data[i].mainBuyer = data[i].subList[0].buyer
                                    data[i].mainBuyerId = data[i].subList[0].buyerId
                                    data[i].payType = 'alipay'
                                    data[i].storeName = data[i].subList[0].defaultDlvrWh
                                    data[i].storeId = data[i].subList[0].defaultDlvrWhId
                                }
                                // 全局保存预生成数据
                                preCreateOrderList = data
                                showAndAddEventForPurOrderList(data)
                            } else {
                                layer.msg(res.msg)
                            }
                        }
                    })
                },
                yes: function () {
                    // 获取选中项进行生成
                    var checkStatus = table.checkStatus('purOrderMainTable'),
                        selecteddata = checkStatus.data;

                    if (selecteddata.length == 0) {
                        layer.msg('请选择要生成的订单')
                        return
                    }
                    var Adata = selecteddata
                    loading.show()
                    $.ajax({
                        url: ctx + "/purOrderMain/generateOrderByPreOrderList.html",
                        type : 'POST',
                        dataType: "json",
                        contentType: 'application/json',
                        data : JSON.stringify(Adata),
                        success: function (data) {
                            loading.hide()
                            if (data.code == '0000') {
                                layer.close(prePurchasePopIndex)
                                layer.msg('生成订单成功，请前往采购订单页面查看订单详情')
                            } else {
                                layer.msg(data.msg)
                            }
                        }
                    })
                }
            })

        })
    })

    // 对采购订单数据 渲染并添加事件
    function showAndAddEventForPurOrderList(data) {
        // 展示主表数据
        showPurMainTable(data)
        if (data.length > 0) {
            // 默认展示第一行主表数据
            showPurDetailTable(data[0].subList)
        }
        // 绑定行点击展示子表数据事件
        setEventByselector('#purOrderMainTable', 'tr', 'click', toShowOrderDetail)
        // 绑定采购备注变更事件
        setEventByselector('#purOrderMainTable', '.purNoteInp', 'input propertychange', toSetPurNote)
        // 绑定加急选择事件
        form.on('checkbox(ifSpeedCheckBox)', function(data){
            var index = $(data.elem).closest('tr').attr('data-index')
            var ifCheck = data.elem.checked
            preCreateOrderList[index].ifSpeed = ifCheck
            console.log(1111)
        })
        // 绑定加急全选事件
        form.on('checkbox(ifSpeedAllPickBtn)', function(data){
            var ifCheck = data.elem.checked
            for (var i = 0; i < preCreateOrderList.length; ++i) {
                preCreateOrderList[i].ifSpeed = ifCheck
            }
            $('#pre_generate_pur_order_form .ifspeedCheckBox').prop('checked',ifCheck)
            form.render('checkbox','pre_generate_pur_order_form')
        })
    }

    // 展示子表数据的事件方法
    function toShowOrderDetail() {
        var index = this.getAttribute('data-index')
        showPurDetailTable(preCreateOrderList[index].subList)
    }

    // 设置采购备注
    function toSetPurNote() {
        var index = $(this).closest('tr').attr('data-index')
        var value = this.value
        preCreateOrderList[index].memo = value
    }

    /**
     * 渲染采购主表数据
     * @param data
     */
    function showPurMainTable(data) {
        table.render({
            elem: "#purOrderMainTable",
            cols: [
                [
                    { type: "checkbox", width: 30 },
                    { type: "numbers", width: 30 },
                    // {title:'单号', field: ""},
                    {title: "付款方式", templet: '#payType_stockwarning'},
                    {title: "采购仓库", field: 'storeName'},
                    {title: "供应商",field: 'supplier'},
                    {title: "采购员",field: 'mainBuyer'},
                    {title: "<div>是否紧急单<input type='checkbox' lay-skin='primary' lay-filter='ifSpeedAllPickBtn'></div>",templet: '#ifSpeedBox'},
                    {title: "采购备注",templet: '#purNoteBox'},
                ],
            ],
            data: data,
            height: 300,
            even: true,
            page: false,
            limit: data.length,
            id: 'purOrderMainTable',
        })
    }

    /**
     * 渲染采购子表数据
     * @param data
     */
    function showPurDetailTable(data) {
        table.render({
            elem: "#purOrderDetailTable",
            cols: [
                [
                    { type: "checkbox", width: 30 },
                    { type: "numbers", width: 30 },
                    {title:'商品SKU', field: "sSku",},
                    {title:'商品名称', field: "title",},
                    {title:'款式', field: "style",},
                    {title:'数量',templet: '<div>{{Math.ceil(d.buyerAmount)}}</div>'},
                    {title:'含税单价',templet:''},
                    {title:'不含税单价', field: "price",},
                    {title:'含税金额', field: "",},
                    {title:'税率', field: "",},
                    {title:'金额', templet: '<div>{{accMul(Math.ceil(d.buyerAmount), d.price)}}</div>',},
                    {title:'库存上限', templet: '<div>{{Math.ceil(accMul(d.dailySales,d.stockWarnCycle))}}</div>',},
                ],
            ],
            data: data,
            height: 300,
            even: true,
            page: false,
            limit: data.length,
            id: 'purOrderDetailTable'
        })
    }

    // 供应商搜索条件
    var dim = new DimSearch('#stockwarning_searchSupplier', 'supplierId');
    dim.init();
    // 编辑无效日期设置
    $('#stockWarning_addExcludeConf_Btn').click(function () {
        var index = layer.open({
            type: 1,
            title: "设置无效日期",
            area: ["1160px", "70%"],
            shadeClose: false,
            content: $("#addExcludeConf_warningStock_Layer").html(),
            success: function (layero, index) {
                laydate.render({
                    elem: '#addExcludeConf_countDate'
                });
                form.render("select")
                form.render("checkbox")
                // 查询设置列表
                queryExcludeConfList()

                // 新增按钮
                $('#addExcludeBtn').click(function () {
                    var Adata = {
                        countDate : $('#addExcludeConf_warningStock [name=countDate]').val(),
                    }
                    var platCode = []
                    var checkBoxS = $('#addExcludeConf_warningStock [name=platCode]:checked')
                    for (var i = 0 ; i <checkBoxS.length; ++i) {
                        platCode.push(checkBoxS[i].value)
                    }
                    Adata.platCode = platCode.join(',')
                    if (!Adata.countDate) {
                        layer.msg('请选择日期')
                        return
                    }
                    loading.show()
                    $.ajax({
                        url: ctx + "/whStockWarning/addSalesExclude.html",
                        type : 'POST',
                        dataType: "json",
                        contentType: 'application/json',
                        data : JSON.stringify(Adata),
                        success: function (data) {
                            loading.hide()
                            if (data.code == '0000') {
                                layer.msg('新增成功,正在重新统计销量,请稍后刷新查看')
                                queryExcludeConfList()
                            } else {
                                layer.msg(data.msg)
                            }
                        }
                    })
                })
                
                $('#delExcludeBtn').click(function () {
                    var checkStatus = table.checkStatus('salesCountExcludeTab')
                        ,data = checkStatus.data;
                    var idList = []
                    var dateList = []
                    for (var i = 0; i < data.length; ++i) {
                        idList.push(data[i].id)
                        dateList.push(data[i].countDate)
                    }
                    if (idList.length == 0) {
                        layer.msg('请选择需要删除的设置')
                        return
                    }
                    loading.show()
                    var Adata = {idList: idList,dateList: dateList}
                    $.ajax({
                        url: ctx + "/whStockWarning/delSalesExclude.html",
                        type : 'POST',
                        dataType: "json",
                        contentType: 'application/json',
                        data : JSON.stringify(Adata),
                        success: function (data) {
                            loading.hide()
                            if (data.code == '0000') {
                                layer.msg('删除成功,正在重新统计销量,请稍后刷新查看')
                                queryExcludeConfList()
                            } else {
                                layer.msg(data.msg)
                            }
                        }
                    })
                })
            }
        });
    })

    $('#stockWarning_refreshByProdSIdList_Btn').click(function () {
        var checkStatus = table.checkStatus('stockWarningTable'),
            selecteddata = checkStatus.data;
        if (selecteddata.length == 0) {
            layer.msg('请选择需要同步的数据')
        }
        var list = []
        var one
        for (var i = 0; i < selecteddata.length; ++i) {
            one = {
                id: selecteddata[i].id,
                prodSId: selecteddata[i].prodSId,
                storeId: selecteddata[i].storeId,
                sSku: selecteddata[i].sSku
            }
            list.push(one)
        }
        var Confirmindex = layer.confirm('确认从普源同步这些商品的库存预警数据？', { btn: ['确认', '取消'] }, function() {
            loading.show()
            $.ajax({
                url: ctx + "/whStockWarning/syncByProdSIdList.html",
                type : 'POST',
                dataType: "json",
                data: JSON.stringify(list),
                contentType: 'application/json',
                success: function (data) {
                    loading.hide()
                    if (data.code == '0000') {
                        layer.alert('已提交后台同步。请注意列表数据的更新时间')
                        layer.close(Confirmindex);
                    } else {
                        layer.msg(data.msg)
                    }
                },
                error: function () {
                    loading.hide()
                }
            })
        })

    })

    function queryExcludeConfList() {
        loading.show()
        table.render({
            elem: "#salesCountExcludeTable",
            method: "post",
            url: ctx + "/whStockWarning/getExcludeList.html",
            cols: [
                [
                    { type: "checkbox" ,width:30},
                    {title:'日期', width: 200,templet: '<div>{{Format(new Date(d.countDate), "yyyy-MM-dd")}}</div>'},
                    {field: "platCode",title: "适用平台" }
                ],
            ],
            id: 'salesCountExcludeTab',
            done: function () {
              loading.hide()
            },
            height: 400,
            page: true,
            limits: [20, 100, 200],
            limit: 20
        });
    }

    // 导出库存预警
    $('#exportStockWarning_stockwarning').click(function () {
        var checkStatus = table.checkStatus('stockWarningTable'),
            selecteddata = checkStatus.data;
        var idList = []
        for (var i = 0; i < selecteddata.length; ++i) {
            idList.push(selecteddata[i].id)
        }
        var outerIndex = layer.open({
            title: '导出详情',
            type: 1, //不加该属性,就会出现[object Object]
            area: ['1450px', '600px'],
            id: 'exportStockWarningPop',
            btn: ['确定', '关闭'],
            content: $('#stockwarning_exportPop').html(),
            success: function() {
                form.on('checkbox(selectAll_export_stockwarning)', function(data) {
                    var checked = data.elem.checked
                    $('#export_stockwarning_form input[type=checkbox]:enabled').prop('checked', checked)
                    form.render('checkbox')
                })
                form.render('checkbox')
            },
            yes: function() {
                var data = serializeObject($('#export_stockwarning_form'))
                var searchParam = serializeObject($('#stockwarning_searchForm'))
                searchParam.idList = idList
                checkNull(searchParam)
                data.searchParam = JSON.stringify(searchParam)

                var Confirmindex = layer.confirm('确认导出当前搜索条件下的库存预警？', { btn: ['确认', '取消'] }, function() {
                    layer.alert('如果需要导出图片，请控制在100个sku以内。否则会失败。如果导出数据量大，需要十几分钟处理数据，请不要关闭和操作网页，后台正在进行导出文件')
                    submitForm(data, ctx + '/whStockWarning/exportStockWarning.html')
                    layer.close(outerIndex);
                })
            }
        })
    })

});

function recountSales() {
    var Confirmindex = layer.confirm('确认重新统计销量数据？', { btn: ['确认', '取消'] }, function() {
        $.ajax({
            url: ctx + "/whStockWarning/recountSales.html",
            type : 'POST',
            dataType: "json",
            contentType: 'application/json',
            success: function (data) {
                loading.hide()
                if (data.code == '0000') {
                    layer.alert('后台正在统计中，请不要在20分钟内重复进行此操作')
                    layer.close(Confirmindex);
                } else {
                    layer.msg(data.msg)
                }
            }
        })
    })
}