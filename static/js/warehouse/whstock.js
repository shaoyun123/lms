/**
 * time: 2018/01/02
 */
var queryPage_whstock, active_whstock

layui.use(["admin", "form", "table", "layer", "laytpl", "laydate", "element"], function () {
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


    $('#whstock_searchForm').on('change', 'input[name=searchValue]', function (e) {
        let val = e.target.value;
        if (val.length > 100000) {
            layer.msg('注意:SKU输入框输入超过十万个字符自动截取', { icon: 7 });
            e.target.value = val.substring(0, 100000);
        }
    });

    function whstock_updateSkuNumHandleFn (whStockIdList, whIdList) {
        if (whStockIdList) {
            let obj = {
                whStockIdList: whStockIdList
            }
            return commonReturnPromise({
                type: 'post',
                url: '/lms/whStock/repairStock',
                contentType:"application/json",
                params: JSON.stringify(obj)
            })
        } else {
            let obj = {
                whIdList: whIdList
            }
            return commonReturnPromise({
                type: 'post',
                url: '/lms/whStock/repairStock',
                contentType:"application/json",
                params: JSON.stringify(obj)
            })
        }
    }
    //更新选中
    $('#whstock_updateSelectSkuNumBtn').on('click', function () {
        commonTableCksSelected('whstockTable').then(tableRes => {
            let whStockIdList = [];
            let whStockSkuList = [];
            tableRes.forEach(res=>{
                whStockIdList.push(res.id)
                whStockSkuList.push(res.sSku);
            });
            let tips = '确认更新选择的SKU' + whStockSkuList.join(',') + '的sku占用?';
            layer.confirm(tips, {btn: ['确认', '取消'], icon: 3},function(){
              whstock_updateSkuNumHandleFn(whStockIdList, null).then(res => {
                if (!res.finished) {
                    return layer.msg('正在更新SKU占用数量，请稍后查询确认！', { icon: 7, time: 3000 });
                } else {
                    layui.admin.batchResultObjAlert("更新SKU占用数量的任务已完成:", res, function (index) {
                        $('#whstock_searchBtn').trigger('click');
                        layer.close(index);
                    });
                }
              }).catch(err => {
                  layer.msg(err, { icon: 2 });
              });
            });
        }).catch(tableErr => {
            layer.msg(tableErr, { icon: 7 });
        })
        
    });
    //更新所有
    $('#whstock_updateAllSkuNumBtn').on('click', function () {
        let $store = $('#whstock_searchForm select[name=storeId]');
        let storeId = $store.val();
        let selectedTxt = $store.find('option:selected').text();
        if (!storeId) {
            layer.msg('请先选中仓库!', { icon: 7})
            return;
        }
        let tips = '确认全量更新' + selectedTxt + '的sku占用';
        // console.log(options[0][idx].text)
        layer.confirm(tips, {btn: ['确认', '取消'], icon: 3},
            function () {
                whstock_updateSkuNumHandleFn(null, [storeId]).then(res => {
                    if (!res.finished) {
                        return layer.msg('正在全量更新SKU占用数量，请稍后查询确认！', {icon: 7, time: 3000});
                    } else {
                        layui.admin.batchResultObjAlert("全量更新SKU占用数量的任务已完成:", res, function (index) {
                            $('#whstock_searchBtn').trigger('click');
                            layer.close(index);
                        });
                    }
                }).catch(err => {
                    layer.msg(err, {icon: 2});
                })
            })
    });

    var whStockPageEnumData = null

    function getSearchParam() {
        var data = serializeObject($('#whstock_searchForm'))
        let stockType = data.stockType
        if (data.stockMin != null && data.stockMin != '') {
            data[stockType + 'Min'] = data.stockMin
        }
        if (data.stockMax != null && data.stockMax != '') {
            data[stockType + 'Max'] = data.stockMax
        }
        data.locationCodeList=data.locationCodeList.replaceAll('，',',')
        // if(data.locationCodeList.includes(',')){
        //     data.locationCodeList=JSON.stringify(data.locationCodeList.split(','));
        // }
        return data
    }

    queryPage_whstock = function () {
        var data = getSearchParam()
        table.render({
            elem: "#whstockTable",
            method: "post",
            url: ctx + "/whStock/queryPage.html",
            where: data,
            cols: [
                [
                    //标题栏
                    {type: "checkbox", width: 30},
                    {title: '图片', templet: '#image_whstock', width: 70},
                    {title: "SKU", templet: '#whstock_skuInfo'},
                    {title: "库位", templet: '<div>{{d.prodSInfoDto.locationCode || ""}}</div>'},
                    {title: "商品信息", templet: '#whstock_Info'},
                    {title: "人员", templet: "#whstock_userInfo"},
                    {title: "价格", templet: "#whstock_priceInfo"},
                    {title: "采购参数", templet: "#whstock_purchaseInfo"},
                    {title: "真实销量", templet: "#whstock_RealSalesVolume"},
                    {
                        title: "库存", templet: '#whstock_stockInfo'
                    },
                    {title: "供应商", templet: "#whstock_supplierInfo"},
                    // //绑定工具条
                    // {title: '操作', align: 'center', toolbar: '#whstock_bar'}
                ],
            ],
            id: 'whstockTable',
            // height:table_height(),
            page: true,
            limits: [100, 500, 1000],
            done: function (res) {
                $('#total_whstock').text(res.count)
                //懒加载
                imageLazyloadAll();
                // // 固定表头
                // $('#whstockTable').next('.layui-table-view').find('.layui-table-header').addClass('toFixedContain')
                // // 绑定事件
                // var tbody = $('#whstockTable').next('.layui-table-view').find('.layui-table-body').find('tr[data-index=0]')
                // if (tbody.length > 0) {
                //     var ifBind = tbody.attr('data-ifBind')
                //     if (!ifBind) {
                //         // 给行加上点击显示详情事件
                //        whstockContain = {}
                //         setRowEvent('#whstockTable', '.whstockId', 'click', function () {}, ['.copyTxt', '.doubleClickToSet', '.laytable-cell-checkbox', '.freeClickBox', '[data-edit]'])
                //         tbody.attr('data-ifBind','1')
                //     }
                // }
            },
            limit: 100
        });
    }

    // // 行点击事件
    // $('#whstockTableContain').on('click','.whstockId20190531', function (e) {
    //     var target = $(e.target)
    //     if (target.attr('lay-event')) {
    //         return
    //     }
    //     let stopClass = ['.copyTxt', '.doubleClickToSet', '.laytable-cell-checkbox', '.freeClickBox', '[data-edit]']
    //     if (stopClass && stopClass.length > 0) {
    //         for (var i = 0; i < stopClass.length; ++i) {
    //             if (target.hasClass(stopClass[i].replace('.', '')) || target.attr('id') == stopClass[i].replace('#', '') || (target.closest(stopClass[i])[0])) {
    //                 return
    //             }
    //         }
    //     }
    //     showWhDetailPop(this)
    // })

    function showWhDetailPop(self) {
        // let prodSId = $(self).find('.whstock_prodSId').val(),
        //  storeId = $(self).find('.whstock_storeId').val(),
        //  sSku = $(self).find('.whstock_sSku').val();
        let prodSId = self.prodSId,
            storeId = self.storeId,
            sSku = self.sSku;

        whstock_Detail_layer = layer.open({
            type: 1,
            title: "库存明细",
            area: ["100%", "60%"],
            offset: 'b',
            maxmin: true,
            shade: false,
            content: $("#whStockDetail").html(),
            id: 'whStockDetailContain',
            success: function(layero, index) {
                let obj = {
                        showType: 1,
                        storeId: storeId,
                        prodSId: prodSId,
                        sSku: sSku},
                    issueOccupationData=[],
                    orderOccupationTableData=[],
                    FBAOccupationTableData=[],
                    platWhShipmentStockMessageData=[],
                    detailsOccupationTableData=[];
                commonReturnPromiseRes({
                    url: ctx + "/whStock/showDetails",
                    params: JSON.stringify(obj),
                    contentType:"application/json",
                    type:"POST"
                }).then(res=>{
                    if (res.code != '0000') {
                        layer.msg(res.msg)
                        return
                    }
                    $("#issueOccupation span").text(res.extra[1]);
                    $("#orderOccupation span").text(res.extra[2])
                    $("#FBAOccupation span").text(res.extra[3])
                    $("#PlatWhShipmnetOccupation span").text(res.extra[5])
                    $("#detailsOccupation span").text(res.extra[4])

                    // if (dataJson.showType == 1) {
                        var data1 = [];
                        data1 = data1.concat(res.data.otherStorageOccupancyDtos);
                        data1 = data1.concat(res.data.purchaseReturnOccupiedDtos);
                        data1 = data1.concat(res.data.occupiedByTransferOrderDtos);
                        issueOccupationData = data1;
                    // } else if (dataJson.showType == 2) {
                        var data2 = [];
                        data2 = data2.concat(res.data.orderOccupancyDetailsDtos);
                        orderOccupationTableData = data2;
                    // } else if (dataJson.showType == 3) {
                        var data3 = [];
                        data3 = data3.concat(res.data.fbaCargoPlanOccupationDtos);
                        FBAOccupationTableData = data3;
                        var data5 = [];
                        data5 = data5.concat(res.data.platWhShipmentStockMessageDtos);
                        platWhShipmentStockMessageData = data5;
                    // } else if (dataJson.showType == 4) {
                        var data4 = [];
                        data4 = data4.concat(res.data.purchaseNotInStockDtos);
                        data4 = data4.concat(res.data.stockTransferToBeReceivedDtos);
                        data4 = data4.concat(res.data.otherStorageToBeReceivedDtos);
                        // 组合品生产
                        data4 = data4.concat(res.data.whCombProduceNotInStockDtos);
                        // console.log('1111');
                        // console.log('data4----->' + JSON.stringify(data4));
                        detailsOccupationTableData = data4;
                    // }
                    // 出库占用
                    table.render({
                        elem: "#issueOccupationTable",
                        id: 'issueOccupationTable',
                        size: 'sm', //小尺寸的表格
                        cols: getTableCols(1),
                        page: false,
                        data:issueOccupationData
                    })

                    // 订单占用 platOrderResultDtoList
                    table.render({
                        elem: "#orderOccupationTable",
                        id: 'orderOccupationTable',
                        size: 'sm', //小尺寸的表格
                        height:orderOccupationTableData.length == 0?"":300,
                        cols:getTableCols(2),
                        data: orderOccupationTableData,
                        page: false
                    })

                    // FBA货件计划占用 amazonFbaShipDtoList
                    table.render({
                        elem: "#FBAOccupationTable",
                        id: 'FBAOccupationTable',
                        size: 'sm', //小尺寸的表格
                        cols: getTableCols(3),
                        data: FBAOccupationTableData,
                        page: false
                    })

                    //中转仓货件计划占用
                    table.render({
                        elem: "#PlatWhShipmnetOccupationTable",
                        id: 'PlatWhShipmnetOccupationTable',
                        size: 'sm', //小尺寸的表格
                        cols: getTableCols(5),
                        data: platWhShipmentStockMessageData,
                        page: false
                    })

                    // 待入库明细
                    table.render({
                        elem: "#detailsOccupationTable",
                        id: 'detailsOccupationTable',
                        size: 'sm', //小尺寸的表格
                        cols: getTableCols(4),
                        data: detailsOccupationTableData,
                        page: false
                    })
                })
            }
        })
    }

    // 表格数据重载
    active_whstock = {
        reload: function (data) {
            //执行重载
            table.reload('whstockTable', {
                page: {
                    curr: 1 //重新从第 1 页开始
                },
                where: data
            });
        }
    }

    //弹出分类框
    $("#whstock_searchCate_btn").click(function () {
        admin.itemCat_select('layer-work-develop-whstock', 'whstock_cateId_search_Inp', 'whstock_search_cate');
    });


    //展示已知数据
    // queryPage_whstock()

    //初始化2个日期框
    laydate.render({
        elem: '#whstock_searchTime'
        , range: true
    });

    // 初始化可选人员--搜索栏
    initHpSelect('#whstock_searchForm')

    // 搜索按钮
    $('#whstock_searchBtn').click(function () {
        queryPage_whstock()
    })

    // 重置按钮
    $("#whstock_resetBtn").click(function () {
        $("#whstock_searchForm [name]:not(.hiddenContent)").val('')
        $('#whstock_search_cate').text('')
        form.render('select')
    })

    // 刷新数据
    $('#whstock_reFreshData_Btn').click(function () {
        layer.confirm('确认进行数据刷新吗？', ["确定", "取消"], function () {
            $.ajax({
                url: ctx + "/whwhstock/reFreshwhstock.html",
                type: 'POST',
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




    getwhstockPageEnum()
    getwarehouseData()

    function getwhstockPageEnum() {
        $.ajax({
            url: ctx + "/whStock/getBaseSpinnerList.html",
            type: 'POST',
            dataType: "json",
            contentType: 'application/json',
            data: {},
            success: function (data) {
                loading.hide()
                if (data.code == '0000') {
                    whStockPageEnumData = data.data
                    var data = data.data
                    for (var i in data) {
                        var dom = $('#whstock' + i)
                        if (dom.length > 0) {
                            for (var item of data[i]) {
                                dom.append(`<li data-value="${item.id}" hp-select-li>${item.userName}</li>`)
                            }
                        }
                    }
                } else {
                    layer.msg(data.msg)
                }
            }
        })
    }

    function getwarehouseData() {
        $.ajax({
            type: "POST",
            url: ctx + "/prodWarehouse/getAuthedProdWarehouse.html",
            contentType: 'application/json',
            dataType: 'json',
            success: function (returnData) {
                if (returnData.code == "0000") {
                    var tpl = whstockoptionTpl.innerHTML
                    var warehouseDom = $('#whstock_searchForm').find('select[name="storeId"]')
                    var isDefault = returnData.data.filter(item => item.isDefault);
                    var targetId = isDefault && isDefault.length > 0 ? isDefault[0]['id'] : '';
                    // console.log(warehouseDom, 'warehouseDom')
                    laytpl(tpl).render(returnData.data, function (html) {
                        warehouseDom.append(html)
                        warehouseDom.val(targetId);
                        form.render('select')
                    });
                } else {
                    layer.msg(returnData.msg);
                }
            },
            error: function () {
                layer.msg("服务器正忙");
            },
            complete: function () {
                loading.hide();
            }
        });
    }


    // 供应商搜索条件
    var dim = new DimSearch('#whstock_searchSupplier', 'supplierId');
    dim.init();
    // 编辑无效日期设置
    $('#whstock_addExcludeConf_Btn').click(function () {
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
                        countDate: $('#addExcludeConf_warningStock [name=countDate]').val(),
                    }
                    var platCode = []
                    var checkBoxS = $('#addExcludeConf_warningStock [name=platCode]:checked')
                    for (var i = 0; i < checkBoxS.length; ++i) {
                        platCode.push(checkBoxS[i].value)
                    }
                    Adata.platCode = platCode.join(',')
                    if (!Adata.countDate) {
                        layer.msg('请选择日期')
                        return
                    }
                    loading.show()
                    $.ajax({
                        url: ctx + "/whwhstock/addSalesExclude.html",
                        type: 'POST',
                        dataType: "json",
                        contentType: 'application/json',
                        data: JSON.stringify(Adata),
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
                        , data = checkStatus.data;
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
                    var Adata = {idList: idList, dateList: dateList}
                    $.ajax({
                        url: ctx + "/whwhstock/delSalesExclude.html",
                        type: 'POST',
                        dataType: "json",
                        contentType: 'application/json',
                        data: JSON.stringify(Adata),
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


    function queryExcludeConfList() {
        loading.show()
        table.render({
            elem: "#salesCountExcludeTable",
            method: "post",
            url: ctx + "/whwhstock/getExcludeList.html",
            cols: [
                [
                    {type: "checkbox", width: 30},
                    {title: '日期', width: 200, templet: '<div>{{Format(new Date(d.countDate), "yyyy-MM-dd")}}</div>'},
                    {field: "platCode", title: "适用平台"}
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
    $('#exportwhstock_whstock').click(function () {
        var checkStatus = table.checkStatus('whstockTable'),
            selecteddata = checkStatus.data;
        var whStockIdList = []
        for (var i = 0; i < selecteddata.length; ++i) {
            whStockIdList.push(selecteddata[i].id)
        }
        var outerIndex = layer.open({
            title: '导出详情',
            type: 1, //不加该属性,就会出现[object Object]
            area: ['1100px', '600px'],
            id: 'exportwhstockPop',
            btn: ['确定', '关闭'],
            content: $('#whstock_exportPop').html(),
            success: function () {
                form.on('checkbox(selectAll_export_whstock)', function (data) {
                    var checked = data.elem.checked
                    $('#export_whstock_form input[type=checkbox]:enabled').prop('checked', checked)
                    form.render('checkbox')
                })
                form.render('checkbox')
            },
            yes: function () {
                var data = serializeObject($('#export_whstock_form'))
                var searchParam = getSearchParam()
                searchParam.whStockIdList = whStockIdList
                checkNull(searchParam)
                data.searchParam = JSON.stringify(searchParam)

                var Confirmindex = layer.confirm('确认导出当前搜索条件下的库存信息？', {btn: ['确认', '取消']}, function () {
                    layer.alert('如果导出数据量大，需要十几分钟处理数据，请不要关闭和操作网页，后台正在进行导出文件')
                    submitForm(data, ctx + '/whStock/export.html')
                    layer.close(outerIndex);
                })
            }
        })
    })




    let whstockDetailLayer;

    //监听行单击事件（双击事件为：tool）
    table.on('tool(whstockTable)', function (obj) {
        // let {tr} = obj;
        // // 防止tool事件向上冒泡
        // tr.data("off",true);
        var data = obj.data, //获得当前行数据
         layEvent = obj.event //获得 lay-event 对应的值
        var showType = 1;
        switch (layEvent) {
            case 'whstockDetail':
            case 'whstockDetail1':
            case 'whstockDetail2':
                whstockDetailLayer = layer.open({
                    type: 1,
                    title: '库存明细',
                    area: ['80%', '80%'],
                    shadeClose: false,
                    content: $("#whstock_detail_goods_occupied_script").html(),
                    id: 'whstock_detail_goods_occupied_scriptId',
                    end:function(){
                        whstockDetailLayer = undefined
                    },
                    success: function (layero, index) {
                        var dataJson = {};
                        dataJson.sSku = data.sSku;
                        dataJson.storeId = data.storeId;
                        //默认是 1
                        dataJson.showType = showType;
                        dataJson.prodSId = data.prodSId;

                        //进入进行监听
                        element.on('tab(whstock_detail_goods_occupied_title_type)', function (data) {
                            showType = $(this).attr("data-value");
                            //showType=10展示说明
                            if(showType == 10){
                              $('#whstock_detail_goods_occupied_title_type_10_desc').removeClass('disN');
                            }else{
                              $('#whstock_detail_goods_occupied_title_type_10_desc').addClass('disN');
                            }
                            // 重新查询渲染
                            dataJson.showType = parseInt(showType);
                            tableRender(dataJson);
                        });
                        tableRender(dataJson);
                    }
                })
                break
            case 'whstock_Detail':
                if(!whstockDetailLayer){
                    showWhDetailPop(data)
                }
        }
    });

    function tableRender(dataJson) {
        table.render({
            elem: "#whstock_detail_goods_occupied_Table",
            method: "post",
            url: ctx + "/whStock/showDetails",
            contentType: "application/json",
            where: dataJson,
            cols: getTableCols(dataJson.showType),
            id: 'whstock_detail_goods_occupied_Table',
            page: false,
            created:function(res){
                if (res.code != '0000') {
                    layer.msg(res.msg)
                    return
                }
                $("#whstock_detail_goods_occupied_title_type_1").text(res.extra[1]);
                $("#whstock_detail_goods_occupied_title_type_2").text(res.extra[2]);
                $("#whstock_detail_goods_occupied_title_type_3").text(res.extra[3]);
                $("#whstock_detail_goods_occupied_title_type_5").text(res.extra[5]);
                $("#whstock_detail_goods_occupied_title_type_4").text(res.extra[4]);
                $("#whstock_detail_goods_occupied_title_type_6").text(res.extra[6]);
                $("#whstock_detail_goods_occupied_title_type_7").text(res.extra[7]);
                $("#whstock_detail_goods_occupied_title_type_8").text(res.extra[8]);
                $("#whstock_detail_goods_occupied_title_type_9").text(res.extra[9]);
                $("#whstock_detail_goods_occupied_title_type_10").text(res.extra[10]);
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
                    {title: "单号", templet: "#whstock_detail_goods_occupied_number_1"  },
                    {title: "创建人", templet: "#whstock_detail_goods_occupied_creator_1"},
                    {title: "创建时间",templet: '#whstock_detail_goods_occupied_creator_time_1'},
                    {title: "数量", templet: '#whstock_detail_goods_occupied_back_number_1'},]];
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
                        {title: "单号", templet: "#whstock_detail_goods_occupied_number_1" },
                        {title: "创建人", templet: "#whstock_detail_goods_occupied_creator_1" },
                        {title: "创建时间", templet: "#whstock_detail_goods_occupied_creator_time_1" },
                        {title: "未入库数量", templet: "#whstock_detail_goods_occupied_back_number_1" },]
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


});

function recountSales() {
    var Confirmindex = layer.confirm('确认重新统计销量数据？', {btn: ['确认', '取消']}, function () {
        $.ajax({
            url: ctx + "/whwhstock/recountSales.html",
            type: 'POST',
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

//1.右侧固定时间树的锚点定位
function tplLocation(obj) {
    var $id = $(obj).data('id');
    document.getElementById($id).scrollIntoView();
};