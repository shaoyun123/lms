/**
 * time: 2018/01/02
 */
var queryPage_stockwarningvalid,active_stockwarningvalid

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
    // 勾选合并采购必定勾选建议采购
    form.on('checkbox(stockwarningvalid_ifPurMergeCheckbox)', function(data) {
        let checked = data.elem.checked
        if (checked) {
            $('#stockwarningvalid_searchForm').find('[name=ifAdvicePurchase]').prop('checked', checked)
        }
        form.render('checkbox','stockwarningvalid_searchForm')
    })

    queryPage_stockwarningvalid = function () {
        let data = serializeObject($('#stockwarningvalid_searchForm'))

        table.render({
            elem: "#stockWarningValidTable",
            method: "post",
            url: ctx + "/whStockWarning/getValidStockWarningList.html",
            where: data,
            cols: [
                [
                    //标题栏
                    { type: "checkbox", width: 30 },
                    {title:'图片', templet: '#image_stockWarning', width:70},
                    {title: "建议采购",templet: '#stockWarningValid_ifAdvicePurchase',width:70},
                    {title: "SKU",templet: '#stockWarningValid_skuInfo'},
                    {title: "商品信息",templet: '#stockWarningValid_Info'},
                    {title: "人员",templet: "#stockWarningValid_userInfo"},
                    {title: "价格",templet: "#stockWarningValid_priceInfo"},
                    {title: "采购参数",templet: "#stockWarningValid_purchaseInfo"},
                    {title: "库存",templet: "#stockWarningValid_stockInfo"},
                    {title: "销量",templet: "#stockWarningValid_salesInfo"},
                    {title: "订单数",templet: "#stockWarningValid_orderInfo", width: 200},
                    {title: "供应商",templet: "#stockWarningValid_supplierInfo"},
                    // //绑定工具条
                    // {title: '操作', align: 'center', toolbar: '#stockwarningvalid_bar'}
                ],
            ],
            id: 'stockWarningValidTable',
            // height:table_height(),
            page: true,
            limits: [100, 500, 1000],
            created: function (res) {
                let lastSyncTime = res.extra
                if (!lastSyncTime || !res.data || !res.data.length) {
                    return
                }
                let lastSyncDate = new Date(lastSyncTime)
                let lastSyncMillionSecond = lastSyncDate.getTime()
                let list = res.data
                for (let i = 0; i < list.length; ++i) {
                    list[i].updateTime = list[i].updateTime && list[i].updateTime > lastSyncMillionSecond ? list[i].updateTime :lastSyncMillionSecond
                }
            },
            done: function (res) {
                $('#total_stockWarning').text(res.count)
                //懒加载
                imageLazyloadAll();

                // 悬停操作
                $('.stockwarningvalid_showupperlowerstock').on('mouseenter',function () {
                    let curData = getCurTrData(this,'stockWarningValidTable')
                    let whPurchaseParam = curData.whPurchaseParam
                    let list = []
                    list.push({
                        name: '按销量计算'
                        ,upperStock: whPurchaseParam.upperStockSale
                        ,lowerStock: whPurchaseParam.lowerStockSale
                    })
                    list.push({
                        name: '30天有销量设置计算'
                        ,upperStock: whPurchaseParam.upperStockConfig
                        ,lowerStock: whPurchaseParam.lowerStockConfig
                    })
                    list.push({
                        name: '采购单价设置计算'
                        ,upperStock: whPurchaseParam.upperStockCostConfig
                        ,lowerStock: whPurchaseParam.lowerStockCostConfig
                    })
                    onmouseShowTable(this,list,stockwarningvalid_upperLowerStockCol)
                })

            },
            limit: 100
        });
    }

    // 表格数据重载
    active_stockwarningvalid = {
        reload: function(data){
            //执行重载
            table.reload('stockWarningValidTable', {
                page: {
                    curr: 1 //重新从第 1 页开始
                },
                where: data
            });
        }
    }

    // sku 筛选输入字符长度限制 提示
    $('#searchInputValue').on('input', function() {
        var inputValue = $('#searchInputValue').val();
        if (inputValue.length > 10000) {
            $('#searchInputValue').val(inputValue.slice(0, 10000))
            layer.msg('输入SKU限制10000个字符长度，请重新输入！', { icon: 7 });
        }
    })


    //弹出分类框
    $("#stockwarningvalid_searchCate_btn").click(function() {
        admin.itemCat_select('layer-work-develop-stockWarning', 'stockwarningvalid_cateId_search_Inp', 'stockwarningvalid_search_cate');
    });

    //初始化2个日期框
    laydate.render({
        elem: '#stockWarningValid_searchTime'
        , range: true
    });

    // 初始化可选人员--搜索栏
    initHpSelect('#stockwarningvalid_searchForm')

    // 搜索按钮
    $('#stockWarningValid_searchBtn').click(function () {
        queryPage_stockwarningvalid()
    })

    // 重置按钮
    $("#stockWarningValid_resetBtn").click(function () {
        $("#stockwarningvalid_searchForm [name]:not(.hiddenContent)").val('')
        $('#stockwarningvalid_search_cate').text('')
        form.render('select')
    })

    table.on('tool(stockWarningValidTable)',function(obj){
        console.log(obj)
        switch (obj.event) {
            case "forecast" :
                stockwarningvalid_forecast(obj.data)
                break;
            case 'stockwarningvalidDetail':
            case 'stockwarningvalidDetail1':
            case 'stockwarningvalidDetail2':
            case 'stockwarningvalidDetail3':
                stockwarningvalidDetailLayer = layer.open({
                    type: 1,
                    title: '库存明细',
                    area: ['80%', '80%'],
                    shadeClose: false,
                    content: $("#stockwarningvalid_detail_goods_occupied_script").html(),
                    id: 'stockwarningvalid_detail_goods_occupied_scriptId',
                    end:function(){
                        stockwarningvalidDetailLayer = undefined
                    },
                    success: function (layero, index) {
                        var dataJson = {};
                        dataJson.sSku = obj.data.sSku;
                        dataJson.storeId = obj.data.storeId;
                        //默认是 1
                        dataJson.showType = 1;
                        dataJson.prodSId = obj.data.prodSId;

                        //进入进行监听
                        element.on('tab(stockwarningvalid_detail_goods_occupied_title_type)', function (data) {
                            showType = $(this).attr("data-value");
                            //showType=10展示说明
                            if(showType == 10){
                                $('#stockwarningvalid_detail_goods_occupied_title_type_10_desc').removeClass('disN');
                            }else{
                                $('#stockwarningvalid_detail_goods_occupied_title_type_10_desc').addClass('disN');
                            }
                            // 重新查询渲染
                            dataJson.showType = parseInt(showType);
                            tableRender(dataJson);
                        });
                        tableRender(dataJson);
                    }
                })
                        
        }
    })
    function tableRender(dataJson) {
        table.render({
            elem: "#stockwarningvalid_detail_goods_occupied_Table",
            method: "post",
            url: ctx + "/whStock/showDetails",
            contentType: "application/json",
            where: dataJson,
            cols: getTableCols(dataJson.showType),
            id: 'stockwarningvalid_detail_goods_occupied_Table',
            page: false,
            created:function(res){
                if (res.code != '0000') {
                    layer.msg(res.msg)
                    return
                }
                $("#stockwarningvalid_detail_goods_occupied_title_type_1").text(res.extra[1]);
                $("#stockwarningvalid_detail_goods_occupied_title_type_2").text(res.extra[2]);
                $("#stockwarningvalid_detail_goods_occupied_title_type_3").text(res.extra[3]);
                $("#stockwarningvalid_detail_goods_occupied_title_type_5").text(res.extra[5]);
                $("#stockwarningvalid_detail_goods_occupied_title_type_4").text(res.extra[4]);
                $("#stockwarningvalid_detail_goods_occupied_title_type_6").text(res.extra[6]);
                $("#stockwarningvalid_detail_goods_occupied_title_type_7").text(res.extra[7]);
                $("#stockwarningvalid_detail_goods_occupied_title_type_8").text(res.extra[8]);
                $("#stockwarningvalid_detail_goods_occupied_title_type_9").text(res.extra[9]);
                $("#stockwarningvalid_detail_goods_occupied_title_type_10").text(res.extra[10]);
                var data = [];
                switch (dataJson.showType) {
                    case 1 :
                        data = data.concat(res.data.otherStorageOccupancyDtos);
                        data = data.concat(res.data.purchaseReturnOccupiedDtos);
                        data = data.concat(res.data.occupiedByTransferOrderDtos);
                        break
                    case 2 :
                        data = data.concat(res.data.orderOccupancyDetailsDtos);
                        break
                    case 3 :
                        data = data.concat(res.data.fbaCargoPlanOccupationDtos);
                        break
                    case 4 :
                        data = data.concat(res.data.purchaseNotInStockDtos);
                        data = data.concat(res.data.stockTransferToBeReceivedDtos);
                        data = data.concat(res.data.otherStorageToBeReceivedDtos);
                        // 组合品生产
                        data = data.concat(res.data.whCombProduceNotInStockDtos);
                        // console.log('data----->' + JSON.stringify(data));
                        break
                    case 5 :
                        data = data.concat(res.data.platWhShipmentStockMessageDtos);
                        break
                    case 6 :
                        data = data.concat(res.data.fbaShipPlanOccDtos);
                        break
                    case 7 :
                        data = data.concat(res.data.combProduceOccDtos);
                        break
                    case 8 :
                        data = data.concat(res.data.preReservationStockList);
                        break
                    case 9:
                      data = data.concat(res.data.selfImgReservationStockList);
                      break
                    case 10:
                      data = data.concat(res.data.prodReserveStockDtoList);
                      break
                }

                res.data = data;
            }
        });
    }
    function getTableCols(showType) {
        switch (showType) {
            case 0:
            case 1:
                return [[{title: '类型', field:  "type", width: 70},
                    {title: "单号", templet: "#stockwarningvalid_detail_goods_occupied_number_1"  },
                    {title: "创建人", templet: "#stockwarningvalid_detail_goods_occupied_creator_1"},
                    {title: "创建时间",templet: '#stockwarningvalid_detail_goods_occupied_creator_time_1'},
                    {title: "数量", templet: '#stockwarningvalid_detail_goods_occupied_back_number_1'},]];
            case 2:
                return [
                    [{title: '单号', field: "platOrderId", width: 70},
                        {title: "店铺", field: "storeAcctName"},
                        {title: "订单时间", templet: '<div>{{ Format( d.orderTimeCn, "yyyy-MM-dd hh:mm:ss")}}</div>'},
                        {title: "店铺sku", field: "storeSSku"},
                        {title: "数量", field: "holdStock"},
                        {title: "订单状态", field: "processStatusName"}]
                ]
            case 3:
                return [
                    [{title: '货件计划·', field: "shipmentId", width: 70},
                        {title: "店铺", field: "fbaStoreAcct"},
                        {title: "创建时间", templet: '<div>{{ Format( d.fbaCreateTime, "yyyy-MM-dd hh:mm:ss")}}</div>'},
                        {title: "店铺sku", field: "sellerSku"},
                        {title: "数量", field: "amount"},
                        {title: "货件计划状态", field: "oaShipStatus"}]
                ]
            case 4 :
                return [
                    [{title: '类型', field: "type", width: 70},
                        {title: "单号", templet: "#stockwarningvalid_detail_goods_occupied_number_1" },
                        {title: "创建人", templet: "#stockwarningvalid_detail_goods_occupied_creator_1" },
                        {title: "创建时间", templet: "#stockwarningvalid_detail_goods_occupied_creator_time_1" },
                        {title: "未入库数量", templet: "#stockwarningvalid_detail_goods_occupied_back_number_1" },]
                ]
            case 5:
                return [
                    [{title: '货件编号', field: "platOrderId", width: 70},
                        {title: "店铺", field: "storeAcct"},
                        {title: "创建时间", templet: '<div>{{ Format( d.createTime, "yyyy-MM-dd hh:mm:ss")}}</div>'},
                        {title: "店铺sku", field: "sellerSku"},
                        {title: "数量", field: "shipmentSkuNum"},
                        {title: "货件计划状态", field: "shipmentStatus"},]
                ]
            case 6:
                return [
                    [
                        {title: "店铺", field: "storeAcct"},
                        {title: "站点", field: "salesSite"},
                        {title: "店铺SKU", field: "sellerSku"},
                        {title: "数量", field: "planQty"},
                        {title: "创建时间", templet: '<div>{{ Format( d.createTime, "yyyy-MM-dd hh:mm:ss")}}</div>'},
                        {title: "发货需求状态", field: "matchStatusName"},]
                ]
            case 7:
                return [
                    [
                        {title: "生产单号", field: "produceNo"},
                        {title: "组合品SKU", field: "prodSSku"},
                        {title: "数量", field: "planQty"},
                        {title: "创建时间", templet: '<div>{{ Format( d.createTime, "yyyy-MM-dd hh:mm:ss")}}</div>'},
                        {title: "创建人", field: "creator"},
                        {title: "生产状态", field: "processStatusName"},
                    ]
                ]
            case 8:
                return [
                    [
                        {title: '业务类型', field: "source"},
                        {title: '单号', field: "id"},
                        {title: '平台', field: "platCode"},
                        {title: "店铺", field: "storeAcct"},
                        {title: "店铺sku", field: "sellerSku"},
                        {title: "时间", templet: '<div>{{ Format( d.createTime, "yyyy-MM-dd hh:mm:ss")}}</div>'},
                        {title: "数量", field: "preReservationStock"},
                        {title: "状态", field: "status"}
                    ]
                ]
            case 9:
              return [
                [
                    {title: '业务类型', field: "selfType"},
                    {title: '单号', field: "id"},
                    {title: "创建人", field: "creator"},
                    {title: "时间", field: 'createTime'},
                    {title: "数量", field: "number"},
                ]
            ]
            case 10: 
              return [
                [
                    {title: '占用数量', field: "holdStock"},
                    {title: 'AE全托管预留数量', field: "aeFullReserveStock"},
                    {title: "AE半托管预留数量", field: "aeHalfReserveStock"}
                ]
            ]
        }
    }
    function stockwarningvalid_forecast(data) {
        let popIndex = layer.open({
            title: '订单量预测',
            type: 1, //不加该属性,就会出现[object Object]
            area: ['1000px', '800px'],
            id: 'exportStockWarningPop',
            btn: ['关闭'],
            content: $('#stockwarningvalid_forecastPop').html(),
            success: function() {
                form.render('select','stockwarningvalid_forecastForm')
                let Adata = serializeObject($('#stockwarningvalid_forecastForm'))
                Adata.prodSId = data.prodSId
                $('#stockwarningvalid_forecastBtn').click(function () {
                    let Adata = serializeObject($('#stockwarningvalid_forecastForm'))
                    Adata.prodSId = data.prodSId
                    stockwarninigvalid_toForecast(Adata)
                })
                stockwarninigvalid_toForecast(Adata)
            }
        })
    }

    function stockwarninigvalid_toForecast(Adata) {
        let ajax = new Ajax(false)
        ajax.post({
            url: ctx + "/whStockWarning/getForecastImg.html",
            data: JSON.stringify(Adata),
            timeout: 120000,
            contentType: 'application/json',
            success: function (res) {
                if (res.code === '0000') {
                    $('#stockwarningvalid_forecastImg').attr('src',res.data)
                }
            }
        })
    }

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
                    {title: "付款方式", templet: '#payType_stockwarningvalid'},
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
    var dim = new DimSearch('#stockwarningvalid_searchSupplier', 'supplierId');
    dim.init();
    // 编辑无效日期设置
    $('#stockWarningValid_addExcludeConf_Btn').click(function () {
        var index = layer.open({
            type: 1,
            title: "设置无效日期",
            area: ["1160px", "70%"],
            shadeClose: false,
            content: $("#addExcludeConf_warningStock_Layer").html(),
            success: function (layero, index) {
                // 渲染platCode
                renderPlatCode()

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

    function renderPlatCode() {
        oneAjax.post({
            url: '/whStockWarning/listHasOrderPlatCode',
            success: function (res) {
                console.log(res)
                if (res.code === '0000') {
                    let platCodeList = res.data
                    let platCodeEnumDiv = $('#stockwarningvalidPlatCodeDiv')
                    let html = ``
                    for (let i = 0; i < platCodeList.length; ++i) {
                        html += `<input type="checkbox" name="platCode" value="`+ platCodeList[i] +`" title="`+ platCodeList[i] +`" lay-skin="primary">`
                    }
                    platCodeEnumDiv.append(html)
                    form.render('checkbox','addExcludeConf_warningStock')
                }
            }
        })
    }

    $('#stockWarningValid_refreshByProdSIdList_Btn').click(function () {
        var checkStatus = table.checkStatus('stockWarningValidTable'),
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
    $('#exportStockWarning_stockwarningvalid').click(function () {
        var checkStatus = table.checkStatus('stockWarningValidTable'),
            selecteddata = checkStatus.data;
        var idList = []
        for (var i = 0; i < selecteddata.length; ++i) {
            idList.push(selecteddata[i].id)
        }
        var outerIndex = layer.open({
            title: '导出详情',
            type: 1, //不加该属性,就会出现[object Object]
            area: ['90%', '600px'],
            id: 'exportStockWarningPop',
            btn: ['确定', '关闭'],
            content: $('#stockwarningvalid_exportPop').html(),
            success: function() {
                let warehouse = $('#stockwarningvalid_searchForm').find('[name=storeId]').val()
                if (warehouse == 65) {
                    $('.notYWField').hide()
                }
                form.on('checkbox(selectAll_export_stockwarningvalid)', function(data) {
                    var checked = data.elem.checked
                    $('#export_stockwarningvalid_form input[type=checkbox]:enabled').prop('checked', checked)
                    form.render('checkbox')
                })
                form.render('checkbox')
            },
            yes: function() {
                var data = serializeObject($('#export_stockwarningvalid_form'))
                var searchParam = serializeObject($('#stockwarningvalid_searchForm'))
                searchParam.idList = idList

                checkNull(searchParam)
                data.searchParam = JSON.stringify(searchParam)


                var Confirmindex = layer.confirm('确认导出当前搜索条件下的库存预警？', { btn: ['确认', '取消'] }, function() {
                    layer.alert('如果需要导出图片，请控制在100个sku以内。否则会失败。如果导出数据量大，需要十几分钟处理数据，请不要关闭和操作网页，后台正在进行导出文件')
                    submitForm(data, ctx + '/whStockWarning/exportValidStockWarning.html')
                    layer.close(outerIndex);
                })
            }
        })
    })
    // 导出异常订单
    $('#exportInvalidSaleOrder_stockwarningvalid').click(function () {
        var outerIndex = layer.confirm('确认导出30天内的异常订单？', { btn: ['确认', '取消'] }, function() {
            layer.alert('请不要关闭和操作网页，后台正在进行导出文件')
            submitForm({}, ctx + '/whStockWarning/exportInvalidSaleOrder.html')
            layer.close(outerIndex);
        })
    })

    // 导出滞销品
    $('#exportUnsalableGoodsInfo_stockwarningvalid').click(function () {
        var outerIndex = layer.confirm('确认导出滞销品汇总信息？', { btn: ['确认', '取消'] }, function() {
            layer.alert('请不要关闭和操作网页，后台正在进行导出文件')
            submitForm({storeId: $('#stockwarningvalid_searchForm').find('[name=storeId]').val()}, ctx + '/whStockWarning/exportUnsalableGoodsInfo.html')
            layer.close(outerIndex);
        })
    })
    // 导出最近一月滞销品
    $('#exportUnsalablePurOrder_stockwarningvalid').click(function () {
        var outerIndex = layer.confirm('导出最近1个月滞销采购单信息？', { btn: ['确认', '取消'] }, function() {
            layer.alert('请不要关闭和操作网页，后台正在进行导出文件')
            submitForm({storeId: $('#stockwarningvalid_searchForm').find('[name=storeId]').val(),month: 1}, ctx + '/whStockWarning/exportUnsalablePurOrder')
            layer.close(outerIndex);
        })
    })
    // 导出最近半年滞销品
    $('#exportUnsalablePurOrder_stockwarningvalidForHalfYear').click(function () {
        var outerIndex = layer.confirm('导出最近半年滞销采购单信息？', { btn: ['确认', '取消'] }, function() {
            layer.alert('请不要关闭和操作网页，后台正在进行导出文件')
            submitForm({storeId: $('#stockwarningvalid_searchForm').find('[name=storeId]').val(),month: 6}, ctx + '/whStockWarning/exportUnsalablePurOrder')
            layer.close(outerIndex);
        })
    })
    //
    $('#stockwarningvalid_importSkuForAdjust_btn').click(function () {
        $('#stockwarningvalid_importSkuForAdjust_file').click()
    })
    // 导入调价sku
    $('#stockwarningvalid_importSkuForAdjust_file').on('change', function() {
        var files = $('#stockwarningvalid_importSkuForAdjust_file')[0].files
        // 如果没有文件则终止
        if (files.length == 0) {
            return
        }
        // 校验文件类型
        var fileName = files[0].name
        var seat = fileName.lastIndexOf(".");
        var extension = fileName.substring(seat).toLowerCase();
        if (extension != '.xlsx' && extension != '.xls') {
            $('#stockwarningvalid_importSkuForAdjust_file').val('')
            layer.msg('请传入后缀为.xlsx或者.xls 的Excel文件')
            return
        }
        var formData = new FormData();
        formData.append("file", files[0]);
        var confirmIndex = layer.confirm('确认导入这个文件覆盖原有的调价sku吗', { btn: ['确认', '取消'] },
            function() {
                loading.show()
                $.ajax({
                    url: ctx + '/whStockWarning/importSkuForAdjust.html',
                    type: 'POST',
                    data: formData,
                    // 告诉jQuery不要去处理发送的数据
                    processData: false,
                    // 告诉jQuery不要去设置Content-Type请求头
                    contentType: false,
                    success: function(data) {
                        layer.close(confirmIndex)
                        loading.hide()
                        // 清空 excel
                        $('#stockwarningvalid_importSkuForAdjust_file').val('')
                        if (data.code == '0000') {
                            layer.alert("修改成功");
                        } else {
                            layer.alert(data.msg)
                        }
                    },
                    error: function() {
                        loading.hide()
                        $('#stockwarningvalid_importSkuForAdjust_file').val('')
                    }
                });
            },
            function() {
                layer.closeAll()
            }
        )
    })
});

function recountSales() {
    var Confirmindex = layer.confirm('确认重新统计销量数据？', { btn: ['确认', '取消'] }, function() {
        layer.close(Confirmindex);
        loading.show()
        $.ajax({
            url: ctx + "/whStockWarning/recountSales.html",
            type : 'POST',
            dataType: "json",
            contentType: 'application/json',
            success: function (data) {
                loading.hide()
                if (data.code === '0000') {
                    layer.alert('后台正在统计中，请不要在20分钟内重复进行此操作')
                } else {
                    layer.msg(data.msg)
                }
            }
        })
    })
}

var stockwarningvalid_upperLowerStockCol = [
    { field: "name", title: "计算方法" },
    { field: "upperStock", title: "库存上限" },
    { field: "lowerStock", title: "库存下限"}
]

