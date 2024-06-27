var WaitToConfirmCheckTable_SingleArr
layui.use(['form', 'table', 'layer', 'element', 'laypage', 'upload', 'tableMerge', 'laydate', 'formSelects'], function() {
    var form = layui.form,
        table = layui.table,
        element = layui.element,
        laypage = layui.laypage,
        laydate = layui.laydate,
        tableMerge = layui.tableMerge,
        formSelects = layui.formSelects,
        upload = layui.upload;
    layer = layui.layer;
    form.render('select');
    var toPickUporder_company = [],
        toPickUpOrder_allstore = [],
        toPickUporder_companyType = "";
    laydate.render({
        elem: '#toPickUporder_time',
        type: 'date',
        range: true
    });

    // 初始化设置日期为当前1个月内时间
    var date = new Date()
    var endTime = format(date, 'yyyy-MM-dd')
    date.setDate(date.getDate() - 30);
    var beginTime = format(date, 'yyyy-MM-dd')
    var timeStr = beginTime + ' - ' + endTime
    $('#toPickUporder_time').val(timeStr)

    // 展示和隐藏 更多查询条件
    $('#showMoreSearchCondition_toPickUpOrder').click(function() {
        var self = this
        if ($(self).hasClass('showExternal')) {
            $(self).closest('.layui-form').find('.externalContainAuditorder').hide()
            $('#hide_icon_toPickUporder').show()
            $('#show_icon_toPickUporder').hide()
            $(self).removeClass('showExternal')
        } else {
            $(self).closest('.layui-form').find('.externalContainAuditorder').show()
            $('#hide_icon_toPickUporder').hide()
            $('#show_icon_toPickUporder').show()
            $(self).addClass('showExternal')
        }
    })

    element.on('tab(toPickUpOrder_Tab)', function(data) {
        var processStatus = data.elem.context.dataset.processstatus
        $('#toPickUporderForm input[name="processStatus"]').val(processStatus)
        $('#toPickUpOrderSearch').click()
    });

    // 查询
    $("#toPickUpOrderSearch").click(function () {
        var data = serializeObject($('#toPickUporderForm'))
        var time = $('#toPickUporderForm #toPickUporder_time').val()
        if (!time) {
            layer.msg('请选择订单时间范围')
            return
        }
        var timeArr = time.split(' - ')
        data.orderTimeStart = timeArr[0]
        data.orderTimeEnd = timeArr[1]
        toPickUpOrderTableorder(data)
    })

    //监听平台下拉选择
    form.on('select(platCodes_toPickUpOrder)', function(obj) {
        getStoreByPlatform(obj.value)
    })

    //监听公司下拉选择
    form.on('select(companyType)', function(obj) {
            toPickUporder_companyType = obj.value
            appendSelect('toPickUporderForm', 'company_toPickUpOrder', toPickUporder_company[toPickUporder_companyType], 'name', 'value')
            form.render()
    })

    //监听物流公司下拉选择
    form.on('select(company)', function(obj) {
        var agent = "",
            logisticsCompanyId = "";
        toPickUporder_companyType === 'agents' ? agent = obj.value : logisticsCompanyId = obj.value
        getAllLogicsType(agent, logisticsCompanyId)
        form.render()
    })

    getAllCompanies();
    getStoreByPlatform('', function(returnData) {
        toPickUpOrder_allstore = returnData.data
    });
    getAllLogicsType('', '', function(returnData) {
        toPickUporder_logisType = returnData.data
    });


    //获取所有物流公司以及货代公司
    function getAllCompanies() {
        initAjax('/unauditorder/listcompanyandagent.html', 'post', {}, function(res) {
            toPickUporder_company = res.data
            appendSelect('toPickUporderForm', 'company_toPickUpOrder', res.data.companys, 'id', 'cnName')
            form.render()
        })
    }

    //获取所有物流方式
    function getAllLogicsType(agent, logisticsCompanyId, func) {
        initAjax('/unauditorder/listlogistype.html', 'get', { agent, logisticsCompanyId, specialType: "直发物流" }, function(res) {
            if (func) {
                func(res)
            }
            appendSelect('toPickUporderForm', 'logisTypeIds', res.data, 'id', 'name')
            form.render()
        })
    }

    //根据平台code获取店铺列表
    function getStoreByPlatform(platcode, func) {
        initAjax('/sys/liststorebyplatcode.html', 'get', { platCode: platcode }, function(returnData) {
            appendSelect('toPickUporderForm', 'storeAcct', returnData.data, 'id', 'storeAcct')
            if (func) {
                func(returnData)
            }
            formSelects.render('storeAcct')
        }, 'application/x-www-form-urlencoded')
    }

    function toPickUpOrderDetail(data) {
        layer.open({
            type: 1,
            title: '详情',
            btn: ['关闭'],
            area: ['90%', '40%'],
            btnAlign: 'l',
            maxmin: true,
            content: $('#pop_toPickUporder_detail').html(),
            success: function(layero, index) {
                table.render({
                    elem: '#toPickUporder_detail_table',
                    method: 'POST',
                    data: data.detailList,
                    cols: [
                        [
                            { title: "图片", field: "imageUrl", templet: "#toPickUporder_detail_img_tpl" },
                            { title: "Listing_ID", field: "itemId" },
                            { title: "店铺SKU", field: "storeSSku" },
                            { title: "商品SKU", field: "prodSSku" },
                            { title: "库位", field: "asstockLocation" },
                            { title: "商品名称", field: "prodTitle" },
                            { title: "包装备注", field: "packDesc" },
                            { title: '款式', field: "style" },
                            { title: '可用库存', field: "availableStock" },
                            { title: '商品成本', field: "prodUnitCost" },
                            { title: '累计净重', field: "prodUnitWeight" },
                            { title: '报关信息', field: "style" },
                            { title: '销售单价', field: "platUnitPrice" },
                            { title: '销售数量', field: "platQuantity" },
                            { title: '销售金额', field: "platOrderDetailAmt" }
                        ]
                    ],
                    page: true,
                    id: 'toAuditorder_detail_table',
                    done: function(res) {
                        imageLazyload();
                    }
                })
            }
        })
    }

    //渲染表格数据
    function toPickUpOrderTableorder(data) {
        table.render({
            elem: '#toPickUpOrder_table',
            method: 'POST',
            url: ctx + '/orderPickUp/queryPage.html',
            where: data,
            cols: [
                [
                    { checkbox: true, width: 30 },
                    { title: "订单号", field: "id", templet: "#toPickUporder_id_tpl" },
                    { title: "订单金额", field: "platOrderAmt", templet: "#toPickUporder_platOrderAmt_tpl" },
                    { title: "商品", field: "prodQuantity", templet: "#toPickUporder_prodQuantity_tpl" },
                    { title: "收件人", field: "shippingUsername", templet: "#toPickUporder_shippingUsername_tpl" },
                    { title: "物流", field: "logisTypeName", templet: '#toPickUporder_logisTypeName_tpl' },
                    { title: "时间", field: "time", templet: "#toPickUporder_time_tpl" },
                    { title: "状态", field: "platOrderStatus", templet: "#toPickUporder_platOrderStatus_tpl" },
                    // { title: '操作', toolbar: "#toPickUporder_option_tpl", width: 100 }
                ]
            ],
            page: true,
            limit: 50,
            limits: [50,100,500],
            id: 'toPickUpOrder_table',
            done: function(res) {
                $('#LAY-toPickUpOrder #toPickUpOrder_Tab').find('.layui-this').find('span').text('('+ res.count + ')')
                setRowEvent('#toPickUpOrder_table', '.toPickUpOrder_col_id', 'click', function(dom) {
                    var index = $(dom).attr('data-index')
                    toPickUpOrderDetail(res.data[index])
                }, ['.showContent', '.doubleClickToSet', '.laytable-cell-checkbox', '.freeClickBox', '[data-edit]'])
            }
        })
    }

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
            option += '<option data-code="' + data[i].attachment + '" value="' + (data[i].code || data[i]) + '">' + (data[i].label || data[i]) + '</option>'
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

    // 生成分拣批次按钮点击弹窗
    $('#toPickUpOrder_setPickBatch').click(function () {
        layer.open({
            type: 1,
            title: '生成分拣批次',
            btn: ['关闭'],
            area: ['95%', '90%'],
            id: "toPickUporder_generatePickUpBatchTpl",
            content: $('#toPickUporder_generatePickUpBatchPop').html(),
            success: function(layero, index) {
                form.render('select','generatePickUpBatchSearchForm')
                formSelects.render('platCode_generatePickUpBatchSearchForm')
                // formSelects.render('logistTypeCollectionId_generatePickUpBatchSearchForm')
                formSelects.render('logistTypeIdList_generatePickUpBatchSearchForm')
                $('#searchOrderBtn_generatePickUpBatchSearchForm').click(function () {
                    searchOrder_generatePickUpBatchSearchForm()
                })
                $('#generateBatchBtn_generatePickUpBatchSearchForm').click(function () {
                    generateBatch_generatePickUpBatchSearchForm()
                })
                $('#searchPickBatchBtn_generatePickUpBatchSearchForm').click(function () {
                    searchPickBatch_generatePickUpBatchSearchForm()
                })
                $('#toPickUporder_generatePickUpBatchTpl').scroll(function() {
                    toFixedTabHead(this)
                })
                form.on('select(orderType_generatePickUpBatchSearchForm)',function (data) {
                    switch (data.value) {
                        case "1": $('#generatePickUpBatchSearchForm [name=orderAmount]').val(50000)
                            break
                        case "3": $('#generatePickUpBatchSearchForm [name=orderAmount]').val(100)
                            break
                    }
                })
                // 初始化物流方式可选OPTION
                iniLogisticTypeOption(null,'logistTypeIdList_generatePickUpBatchSearchForm')
                form.on('select(logistTypeCollectionId_generatePickUpBatchSearchForm)',function (data) {
                    var id = data.value || null
                    iniLogisticTypeOption(id,'logistTypeIdList_generatePickUpBatchSearchForm')
                })
            }
        })
    })

    // 查询待生成批次订单
    function searchOrder_generatePickUpBatchSearchForm() {
        var data = serializeObject($("#generatePickUpBatchSearchForm"))
        data.ifSelectForBatch = false
        table.render({
            elem: "#pickUpOrderBatch_toPickUpOrder",
            method: 'post',
            url: ctx + "/orderPickUp/queryForGeneratePickBatch.html",
            where: data,
            cols: [
                [
                    {type:'numbers'},
                    { type: "checkbox", width: 30 },
                    { title: "订单编号", field: "id"  },
                    { title: "交易时间", templet: "<div>{{Format(d.orderTimeCn,'yyyy-MM-dd hh:mm:ss')}}</div>"  },
                    { title: "延迟天数", templet: "<div>{{getDaysBetween(d.orderTimeCn)}}</div>"  },
                    { title: "商品明细", field: "skuOverview"  },
                    { title: "库位明细", field: "stockLocationOverView"  },
                    { title: "sku个数", field: "skuQuantity"  },
                    { title: "是否临近", templet: "<div>{{getIfNear(d.nearAreaQuantity)}}</div>"  },
                    { title: "是否同栋", templet: "<div>{{getIfNear(d.bulidQuantity)}}</div>"  },
                    { title: "是否同层", templet: "<div>{{getIfNear(d.floorQuantity)}}</div>"  },
                ],
            ],
            id: "pickUpOrderBatch_toPickUpOrder",
            page: true,
            limits: [100, 200, 500],
            limit: 100,
            done: function(res, curr, count) {
            }
        });
    }

    // 发送请求 生成分拣单
    function generateBatch_generatePickUpBatchSearchForm() {
        var data = serializeObject($("#generatePickUpBatchSearchForm"))
        if (data.platCodeList) {
            data.platCodeList = data.platCodeList.split(',')
        } else {
            data.platCodeList = null
        }
        if (data.logistTypeIdList) {
            data.logistTypeIdList = data.logistTypeIdList.split(',')
        } else {
            data.logistTypeIdList = null
        }
        data.prePicker = $('#generatePickUpBatchSearchForm [name=prePickerId] option:selected').text()

        // 获取选择的订单id
        var checkStatus = table.checkStatus('pickUpOrderBatch_toPickUpOrder'),
            selected = checkStatus.data;
        if (selected && selected.length > 0) {
            var tradeOrderIdList = []
            for (var i = 0; i < selected.length; ++i) {
                tradeOrderIdList.push(selected[i].id)
            }
            data.tradeOrderIdListStr = tradeOrderIdList.join(',')
        }
        loading.show()
        $.ajax({
            type: "post",
            url: ctx + "/orderPickUp/generatePickUpBatch.html",
            dataType: "json",
            data: JSON.stringify(data),
            contentType: "application/json;charset=utf-8",
            success: function (res) {
                loading.hide()
                if (res.code == '0000') {
                    searchOrder_generatePickUpBatchSearchForm()
                    layer.alert('生成分拣单成功，分拣单为: ' + res.data.batchNo + '; 共需分拣sku: ' + res.data.skuNum + ' 个')
                } else {
                    layer.msg(res.msg)
                }
            },error: function (res) {
                loading.hide()
                layer.msg('服务器繁忙，请稍后再试')
            }
        })
    }

    // 查询已生成批次的订单信息
    function searchPickBatch_generatePickUpBatchSearchForm() {
        var data = serializeObject($("#generatePickUpBatchSearchForm"))
        data.ifSelectForBatch = false
        table.render({
            elem: "#pickUpOrderBatch_toPickUpOrder",
            method: 'post',
            url: ctx + "/orderPickUp/queryPickBatch.html",
            where: data,
            cols: [
                [
                    {type:'numbers'},
                    { type: "checkbox", width: 30 },
                    { title: "订单编号", field: "id"  },
                    { title: "交易时间", templet: "<div>{{Format(d.orderTimeCn,'yyyy-MM-dd hh:mm:ss')}}</div>"  },
                    { title: "延迟天数", templet: "<div>{{getDaysBetween(d.orderTimeCn)}}</div>"  },
                    { title: "商品明细", field: "skuOverview"  },
                    { title: "库位明细", field: "stockLocationOverView"  },
                    { title: "sku个数", field: "skuQuantity"  },
                    { title: "是否临近", templet: "<div>{{getIfNear(d.nearAreaQuantity)}}</div>"  },
                    { title: "是否同栋", templet: "<div>{{getIfNear(d.bulidQuantity)}}</div>"  },
                    { title: "是否同层", templet: "<div>{{getIfNear(d.floorQuantity)}}</div>"  },
                    { title: "分拣单号", templet: "<div>{{d.pickInfo.batchNo}}</div>"  },
                ],
            ],
            id: "pickUpOrderBatch_toPickUpOrder",
            page: true,
            limits: [100, 200, 500],
            limit: 100,
            done: function(res, curr, count) {
            }
        });
    }

    // 配货弹窗
    $("#toPickUpOrder_pickGoods").click(function () {
        layer.open({
            type: 1,
            title: '配货',
            btn: ['关闭'],
            area: ['95%', '90%'],
            id: "toPickUporder_pickUpTpl",
            content: $('#toPickUporder_pickUpPop').html(),
            success: function(layero, index) {
                // 禁用回车搜索
                layuiOpenPop = true
                form.render('select','toPickUpOrder_ToPickSearchForm')
                // 初始化展示空列表
                showPickDetailTable([])
                TOPICKORDERLIST = []
                TOPICKORDERLISTJSON = {}
                // 获取待拣信息
                $('#getOrRobPickUpOrderBtn').click(function () {
                    var Adata = {
                        buildingNo: $('#toPickUpOrder_ToPickSearchForm [name=buildingNo]').val(),
                        floorNo: $('#toPickUpOrder_ToPickSearchForm [name=floorNo]').val(),
                        orderType: $('#toPickUpOrder_ToPickSearchForm [name=orderType]').val(),
                        ifRob: false
                    }
                    if (!Adata.buildingNo) {
                        layer.msg('请选择楼栋')
                        return
                    }
                    ajaxToGetOrRobPickOrder(Adata)
                })
                // 聚焦当前sku栏时。回车事件确认当前sku
                $('#toPickUpOrder_ToPickSearchForm [name=sSku]').on('keyup',function (event) {
                    if (event.keyCode == "13") {
                        var sku = this.value.trim()
                        confirmCurrentSku(sku)
                        $('#toPickUpOrder_ToPickSearchForm [name=actAmount]').focus()
                    }
                })
                // 监听sku输入栏变更时，清空当前sku信息
                $('#toPickUpOrder_ToPickSearchForm [name=sSku]').on('input propertychange',function () {
                    $('#toPickUpOrder_ToPickSearchForm [name=prodSId]').val('')
                    $('#toPickUpOrder_ToPickSearchForm [name=sortNumber]').val('')
                    $('#toPickUpOrder_ToPickSearchForm [name=stockLocation]').val('')
                    $('#toPickUpOrder_ToPickSearchForm [name=currentStock]').val('')
                    $('#toPickUpOrder_ToPickSearchForm [name=actAmount]').val('')
                    $('#toPickUpOrder_ToPickSearchForm [name=amount]').val('')
                    $('#toPickUpOrder_ToPickSearchForm #toPickUpOrder_needPickAmount').text('')
                    $('#toPickUpOrder_CurrentSkuImage').prop('src','')

                })
                // 聚焦实拣数量栏时。回车事件发起拣货完成
                $('#toPickUpOrder_ToPickSearchForm [name=actAmount]').on('keyup',function (event) {
                    if (event.keyCode == "13") {
                        ajaxToFinishPick()
                    }
                })

                $('#toPickUpOrder_pickFinish').click(function () {
                    ajaxToFinishPick()
                })
                $('#toPickUpOrder_lackWaitPick').click(function () {
                    var index = layer.confirm('确认该sku缺货待拣吗?',function () {
                        ajaxToLackWaitPick()
                        layer.close(index)
                    })
                })
            },end : function () {
                layuiOpenPop = false
            }
        })
    })

    // 展示当前sku
    function confirmCurrentSku(sku) {
        if (!sku) {
            layer.msg('请输入sku')
            return
        }
        var info = TOPICKORDERLISTJSON[sku]
        if (info == null) {
            layer.msg('未检测到该sku的待拣需求')
            return
        }
        $('#toPickUpOrder_ToPickSearchForm [name=prodSId]').val(info.prodSId)
        $('#toPickUpOrder_ToPickSearchForm [name=sortNumber]').val(info.sortNumber)
        $('#toPickUpOrder_ToPickSearchForm [name=stockLocation]').val(info.location.locationCode)
        $('#toPickUpOrder_ToPickSearchForm [name=currentStock]').val(info.whStock.currentStock)
        $('#toPickUpOrder_ToPickSearchForm [name=actAmount]').val(info.amount)
        $('#toPickUpOrder_ToPickSearchForm [name=amount]').val(info.amount)
        $('#toPickUpOrder_ToPickSearchForm #toPickUpOrder_needPickAmount').text(info.amount)
        $('#toPickUpOrder_CurrentSkuImage').prop('src',tplIVP + info.prodSInfo.image + "!size=250x250")
    }
    
    // 发送请求获取/抢单  待分拣信息
    function ajaxToGetOrRobPickOrder(Adata) {
        loading.show()
        $.ajax({
            type: "post",
            url: ctx + "/orderPickUp/getPickBatchDetail.html",
            dataType: "json",
            data: JSON.stringify(Adata),
            contentType: "application/json;charset=utf-8",
            success: function (res) {
                loading.hide()
                if (res.code == '0000') {
                    $('#toPickUpOrder_ToPickSearchForm [name=batchNo]').val(res.extra)
                    TOPICKORDERLIST = res.data
                    TOPICKORDERLISTJSON = {}
                    for (var i = 0; i < TOPICKORDERLIST.length; ++i) {
                        TOPICKORDERLIST[i].sortNumber = i + 1;
                        TOPICKORDERLISTJSON[TOPICKORDERLIST[i].prodSInfo.sSku] = TOPICKORDERLIST[i]
                    }
                    showPickDetailTable(res.data)
                } else if (res.code == 'NODETAIL') {
                    var index = layer.confirm(res.msg,{ btn: ['确认', '取消'] }, function () {
                        Adata.ifRob = true
                        ajaxToGetOrRobPickOrder(Adata)
                        layer.close(index)
                    })
                } else if (res.code == 'NOSAMEBUILDING') {
                    var index = layer.confirm(res.msg,{ btn: ['确认', '取消'] }, function () {
                        Adata.ifRob = true
                        Adata.ifRobCrossBuildingNo = true
                        ajaxToGetOrRobPickOrder(Adata)
                        layer.close(index)
                    })
                } else {
                    layer.msg(res.msg)
                }
            }
        })
    }

    // 发送请求- 拣货完成
    function ajaxToFinishPick() {
        var data = {
            batchNo: $('#toPickUpOrder_ToPickSearchForm [name=batchNo]').val(),
            prodSId: $('#toPickUpOrder_ToPickSearchForm [name=prodSId]').val(),
            sSku: $('#toPickUpOrder_ToPickSearchForm [name=sSku]').val(),
            actAmount: $('#toPickUpOrder_ToPickSearchForm [name=actAmount]').val(),
        }
        if (!data.prodSId) {
            layer.msg('请填入(扫描)sku')
            return
        }
        if (!data.actAmount || data.actAmount != $('#toPickUpOrder_ToPickSearchForm [name=amount]').val()) {
            layer.msg('实拣数量必须等于应拣数量才可拣货完成')
            return
        }
        loading.show()
        $.ajax({
            type: "post",
            url: ctx + "/orderPickUp/finishPick.html",
            dataType: "json",
            data: JSON.stringify(data),
            contentType: "application/json;charset=utf-8",
            success: function (res) {
                loading.hide()
                if (res.code == '0000') {
                    if (res.data) {
                        layer.alert('检测到有订单取消(退货)。该sku目前只需要拣' + res.data.needPick + '个，请放回' + res.data.cancleNum + "个")
                        changeTableBackColor(data.prodSId,true,res.data.needPick)
                    } else {
                        changeTableBackColor(data.prodSId,true,data.actAmount)
                    }
                } else {
                    layer.msg(res.msg)
                }
            },
            error: function () {
                loading.hide()
                layer.msg('服务器繁忙,请稍后再试')
            }
        })
    }

    // 发送请求- 缺货待拣
    function ajaxToLackWaitPick() {
        var data = {
            batchNo: $('#toPickUpOrder_ToPickSearchForm [name=batchNo]').val(),
            prodSId: $('#toPickUpOrder_ToPickSearchForm [name=prodSId]').val(),
            sSku: $('#toPickUpOrder_ToPickSearchForm [name=sSku]').val(),
            actAmount: $('#toPickUpOrder_ToPickSearchForm [name=actAmount]').val() || 0,
        }
        if (!data.prodSId) {
            layer.msg('请填入(扫描)sku')
            return
        }

        loading.show()
        $.ajax({
            type: "post",
            url: ctx + "/orderPickUp/lackWaitPick.html",
            dataType: "json",
            data: JSON.stringify(data),
            contentType: "application/json;charset=utf-8",
            success: function (res) {
                loading.hide()
                if (res.code == '0000') {
                    if (res.data) {
                        layer.alert('检测到可满足的订单拣货数量为' + res.data + ';' + ((data.actAmount - res.data) ? ('多出' + (data.actAmount - res.data) + '个请放回') : '') )
                        $('#toPickUpOrder_ToPickSearchForm [name=actAmount]').val()
                    }
                    changeTableBackColor(data.prodSId,false,res.data)
                } else {
                    layer.msg(res.msg)
                }
            },
            error: function () {
                loading.hide()
                layer.msg('服务器繁忙,请稍后再试')
            }
        })
    }

    function changeTableBackColor(prodSId, ifFinish, actAmount) {
        var tableBody = $('#toPickUporder_pickGoodsShowTable').next('.layui-table-view').find('.layui-table-body')
        if (ifFinish) {
            tableBody.find('.ifPickfinishSpan[data-prodSId='+ prodSId +']').text('是')
            tableBody.find('.needPickAmountSpan[data-prodSId='+ prodSId +']').text(actAmount)
            tableBody.find('.needPickAmountSpan[data-prodSId='+ prodSId +']').closest('tr').css('background-color','pink')
        } else {
            tableBody.find('.ifPickfinishSpan[data-prodSId='+ prodSId +']').text('缺货')
            tableBody.find('.needPickAmountSpan[data-prodSId='+ prodSId +']').text(actAmount)
            tableBody.find('.needPickAmountSpan[data-prodSId='+ prodSId +']').closest('tr').css('background-color','yellow')
        }
    }
    
    function showPickDetailTable(data) {
        var screenHeigh = window.screen.height
        table.render({
            elem: "#toPickUporder_pickGoodsShowTable",
            height: screenHeigh * 0.65,
            data: data,
            cols: [
                [
                    {type:'numbers'},
                    { title: "sku", templet: "<div>{{d.prodSInfo.sSku}}</div>",width: 130  },
                    { title: "商品名称", templet: "<div>{{d.prodSInfo.title}}</div>"  },
                    { title: "仓库", templet: "<div>{{d.whStock.storeName}}</div>",width: 80 },
                    { title: "是否捡完", templet: "<div><span class='ifPickfinishSpan' data-prodSId='{{d.prodSId}}' >否</span></div>",width: 80  },
                    { title: "应拣数量", field: "amount",width: 80},
                    { title: "已拣数量", templet: "<div><span class='needPickAmountSpan' data-prodSId='{{d.prodSId}}' >0</span></div>",width: 80},
                    { title: "库位", templet: "<div>{{d.location.locationCode}}</div>",width: 130},
                    { title: "拣货楼栋", templet: "<div>{{d.location.buildingNo}}</div>",width: 80},
                    { title: "拣货楼层", templet: "<div>{{d.location.floorNo}}</div>",width: 80},
                    { title: "临近库位", templet: "<div>{{d.location.nearArea}}</div>",width: 80},
                ],
            ],
            id: "toPickUporder_pickGoodsShowTable",
            limit: data.length,
            done: function(res, curr, count) {
            }
        });
    }

    // 单品扫描核单
    $('#toPickUpOrder_singleScan').click(function () {
        layer.open({
            type: 1,
            title: '单品扫描核单',
            btn: ['关闭'],
            maxmin: true,
            area: ['1300px', '90%'],
            id: "toPickUporder_singleCheckTpl",
            content: $('#toPickUpOrder_singleCheckPop').html(),
            success: function (layero, index) {
                // 查询之前未确认核单的 订单信息
                show_checkSingleTable([])
                searchWaitConfirmCheckOrder()
                // 初始化配置信息
                initPageConf(form, $('#toPickUpOrder_singleCheckBody'),'toPickUpOrder','singleCheckConf')

                initNotNull("#toPickUpOrder_singleCheckSelectForm")
                $("#toPickUpOrder_singleCheckSelectForm [name=batchNo]").focus()
                // 页面组件初始化
                form.render('checkbox','toPickUpOrder_singleCheckOperForm')
                form.render('select','toPickUpOrder_singleCheckOperForm')

                form.render('select','toPickUpOrder_singleCheckSelectForm')
                form.render('checkbox','toPickUpOrder_singleCheckSelectForm')
                formSelects.render('logistTypeIdList_toPickUpOrder_singleCheckSelectForm')
                iniLogisticTypeOption(null,'logistTypeIdList_toPickUpOrder_singleCheckSelectForm')
                // 物流方式集选择
                form.on('select(logistTypeCollectionId_toPickUpOrder_singleCheckSelectForm)',function (data) {
                    var id = data.value || null
                    iniLogisticTypeOption(id,'logistTypeIdList_toPickUpOrder_singleCheckSelectForm')
                })
                // sku扫描回车
                $('#toPickUpOrder_singleCheckSelectForm [name=skuScan]').on('keyup',function (event) {
                    if (event.keyCode == "13") {
                        skuScanConfirm()
                    }
                })
                // 物品sku回车
                $('#toPickUpOrder_singleCheckSelectForm [name=sku]').on('keyup',function (event) {
                    if (event.keyCode == "13") {
                        prodSkuConfirm()
                    }
                })
                // 重量回车确认
                $('#toPickUpOrder_singleCheckSelectForm [name=realWeight]').on('keyup',function (event) {
                    if (event.keyCode == "13") {
                        if (!this.value) {
                            layer.msg('重量必须大于0')
                            return
                        }
                        if (isNaN(this.value)) {
                            layer.msg('重量请填写数字')
                            return
                        }
                        var realWeight = $('#toPickUpOrder_singleCheckSelectForm [name=realWeight]').val()
                        var remindOver2kg = $('#toPickUpOrder_singleCheckSelectForm [name=remindOver2kg]').prop('checked')
                        if (remindOver2kg && realWeight > 2000) {
                            var index = layer.confirm('重量超过2kg',{ btn: ['确认', '取消'] }, function() {
                                CurrentCheckSingleOrderJSON.realWeight = realWeight
                                ajaxToConfirmRealWeight()
                                layer.close(index)
                            })
                        } else {
                            CurrentCheckSingleOrderJSON.realWeight = realWeight
                            ajaxToConfirmRealWeight()
                        }

                    }
                })
                // 确认核单
                $('#toPickUpOrder_singleCheckOperForm #confirmCheckSingleBtn').click(function () {
                    var checkStatus = table.checkStatus('toPickUpOrder_singleCheckTable'),
                        data = checkStatus.data;
                    if (data.length == 0) {
                        layer.msg('请选择要确认核单的单据')
                        return
                    }
                    var idList = []
                    for (var i = 0; i < data.length; ++i) {
                        idList.push(data[i].id)
                    }
                    ajaxToConfirmCheck(idList)
                })
                // 移除单据
                $('#toPickUpOrder_singleCheckOperForm #removeScanInfoBtn').click(function () {
                    var checkStatus = table.checkStatus('toPickUpOrder_singleCheckTable'),
                        data = checkStatus.data;
                    if (data.length == 0) {
                        layer.msg('请选择要移除的单据')
                        return
                    }
                    var idList = []
                    for (var i = 0; i < data.length; ++i) {
                        idList.push(data[i].id)
                    }
                    ajaxToRemoveScanInfo(idList)
                })
                // 标记缺货
                $('#toPickUpOrder_singleCheckOperForm #markLackBtn').click(function () {
                    var checkStatus = table.checkStatus('toPickUpOrder_singleCheckTable'),
                        data = checkStatus.data;
                    if (data.length == 0) {
                        layer.msg('请选择要移除的单据')
                        return
                    }
                    var idList = []
                    for (var i = 0; i < data.length; ++i) {
                        idList.push(data[i].id)
                    }
                    ajaxToMarkLack(idList)
                })
                // 监听更新页面配置
                listenPageConfChange(form, 'singleCheckConf', $('#toPickUpOrder_singleCheckBody'),'toPickUpOrder')
            }
        })
    })

    // 发送ajax  确认重量
    function ajaxToConfirmRealWeight() {
        var ifAutoSubmit = $('#toPickUpOrder_singleCheckOperForm [name=ifAutoSubmit]').prop('checked')
        var autoSubmitAmount = $('#toPickUpOrder_singleCheckOperForm [name=autoSubmitAmount]').val()
        var countLogisFee = $('#toPickUpOrder_singleCheckSelectForm [name=countLogisFee]').prop('checked') // 是否计算运费
        CurrentCheckSingleOrderJSON.countLogisFee = countLogisFee
        if (ifAutoSubmit && autoSubmitAmount == 1) {
            CurrentCheckSingleOrderJSON.ifCheckSucc = true
        }
        var ajax = new Ajax()
        ajax.post({
            url: ctx + "/orderPickUp/confirmTotalWeight.html",
            contentType: 'application/json',
            data: JSON.stringify(CurrentCheckSingleOrderJSON),
            success: function (res) {
                if (res.code == '0000') {
                    if (CurrentCheckSingleOrderJSON.ifCheckSucc) {
                        // 如果自动提交了，则将当前核单信息移出 待确认核单列表
                        removeObjFromArr(WaitToConfirmCheckTable_SingleArr,CurrentCheckSingleOrderJSON)
                    }
                    show_checkSingleTable(WaitToConfirmCheckTable_SingleArr)
                    // 清空当前核单信息
                    clearCurrentInfo()
                    // 重新聚焦在扫描sku栏
                    $('#toPickUpOrder_singleCheckSelectForm [name=skuScan]').focus()
                    // 如果累计数达到自动提交数。则发起请求确认核单
                    if (ifAutoSubmit && !isNaN(autoSubmitAmount) && WaitToConfirmCheckTable_SingleArr.length >= autoSubmitAmount) {
                        var idList = [WaitToConfirmCheckTable_SingleArr[0].id]
                        // for (var i = 0; i < WaitToConfirmCheckTable_SingleArr.length; ++i) {
                        //     idList.push(WaitToConfirmCheckTable_SingleArr[i].id)
                        // }
                        if (idList.length > 0) {
                            ajaxToConfirmCheck(idList)
                        }
                    }
                }
            }
        })
    }
    // 清除当前核单信息
    function clearCurrentInfo() {
        // 右边栏
        $('#toPickUpOrder_singleCheckSelectForm [name=sku]').val('')
        $('#toPickUpOrder_singleCheckSelectForm [name=checkedNum]').val('')
        $('#toPickUpOrder_singleCheckSelectForm [name=tradeOrderId]').val('')
        $('#toPickUpOrder_singleCheckSelectForm [name=logisTrackingNo]').val('')
        $('#toPickUpOrder_singleCheckSelectForm [name=shippingUsername]').val('')
        $('#toPickUpOrder_singleCheckSelectForm [name=shippingCountryCnName]').val('')
        $('#toPickUpOrder_singleCheckSelectForm [name=logisTypeName]').val('')
        $('#toPickUpOrder_singleCheckSelectForm [name=skuScan]').val('')
        $('#toPickUpOrder_singleCheckSelectForm [name=sku]').val('')
        $('#toPickUpOrder_singleCheckSelectForm [name=realWeight]').val('')
        // 左下侧栏
        $('#toPickUpOrder_checkSingleLeftSaleDetailDiv [name=image]').attr('src','')
        $('#toPickUpOrder_checkSingleLeftSaleDetailDiv [name=tradeOrderId]').val('')
        $('#toPickUpOrder_checkSingleLeftSaleDetailDiv [name=prodSSku]').val('')
        $('#toPickUpOrder_checkSingleLeftSaleDetailDiv [name=itemId]').val('')
        $('#toPickUpOrder_checkSingleLeftSaleDetailDiv [name=prodTitle]').val('')
        $('#toPickUpOrder_checkSingleLeftSaleDetailDiv [name=prodQuantity]').val('')
        $('#toPickUpOrder_checkSingleLeftSaleDetailDiv [name=specification]').val('')
        $('#toPickUpOrder_checkSingleLeftSaleDetailDiv [name=model]').val('')
        $('#toPickUpOrder_checkSingleLeftSaleDetailDiv [name=style]').val('')
        $('#toPickUpOrder_checkSingleLeftSaleDetailDiv [name=unit]').val('')
        $('#toPickUpOrder_checkSingleLeftSaleDetailDiv [name=packSpecification]').val('')
        $('#toPickUpOrder_checkSingleLeftSaleDetailDiv [name=locationCode]').val('')
        // 右下侧栏
        $('#toPickUpOrder_checkSingleRightSaleDetailDiv [name=tradeOrderId]').val('')
        $('#toPickUpOrder_checkSingleRightSaleDetailDiv [name=sSku]').val('')
        $('#toPickUpOrder_checkSingleRightSaleDetailDiv [name=title]').val('')
        $('#toPickUpOrder_checkSingleRightSaleDetailDiv [name=checkedNum]').val('')
        $('#toPickUpOrder_checkSingleRightSaleDetailDiv [name=packSpecification]').val('')
    }
    // 发送ajax确认单品核单
    function ajaxToConfirmCheck(idList) {
        $.ajax({
            type : 'POST',
            dataType: "json",
            url: ctx + "/orderPickUp/confirmCheck.html",
            contentType: 'application/json',
            data: JSON.stringify(idList),
            success: function (res) {
                if (res.code == '0000') {
                    // 更新待确认核单表格
                    searchWaitConfirmCheckOrder()
                } else {
                    layer.msg(res.msg)
                }
            }
        })
    }
    // 发送ajax 移除单据
    function ajaxToRemoveScanInfo(idList) {
        $.ajax({
            type : 'POST',
            dataType: "json",
            url: ctx + "/orderPickUp/removeScanInfo.html",
            contentType: 'application/json',
            data: JSON.stringify(idList),
            success: function (res) {
                if (res.code == '0000') {
                    // 更新待确认核单表格
                    searchWaitConfirmCheckOrder()
                } else {
                    layer.msg(res.msg)
                }
            }
        })
    }
    function ajaxToMarkLack(idList) {
        $.ajax({
            type : 'POST',
            dataType: "json",
            url: ctx + "/orderPickUp/markLack.html",
            contentType: 'application/json',
            data: JSON.stringify(idList),
            success: function (res) {
                if (res.code == '0000') {
                    // 更新待确认核单表格
                    searchWaitConfirmCheckOrder()
                } else {
                    layer.msg(res.msg)
                }
            }
        })
    }
    // 赋值物流方式可选option
    function iniLogisticTypeOption(collectionId, contain) {
        loading.show()
        $.ajax({
            type: "post",
            url: ctx + "/logistTypeCollection/getAllLogisType.html",
            dataType: "json",
            data: {collectionId: collectionId},
            success: function (res) {
                loading.hide()
                if (res.code == '0000') {
                    var arr = []
                    var list = res.data
                    for (var i = 0; i < list.length; i++) {
                        arr.push({name : list[i].name, value : list[i].id})
                    }
                    formSelects.data(contain,'local', {arr: arr});
                } else {
                    layer.msg(res.msg)
                }
            }
        })
    }

    // 查询之前已扫描但未确认核单的 订单
    function searchWaitConfirmCheckOrder() {
        var ajax = new Ajax()
        ajax.post({
            url: ctx + "/orderPickUp/searchWaitConfirmCheckOrder.html",
            contentType: 'application/json',
            success: function (res) {
                if (res.code == '0000') {
                    WaitToConfirmCheckTable_SingleArr = res.data
                    show_checkSingleTable(WaitToConfirmCheckTable_SingleArr)
                }
            }
        })
    }

    // sku扫描确认
    function skuScanConfirm() {
        var batchNo = $('#toPickUpOrder_singleCheckSelectForm [name=batchNo]').val()
        if (!batchNo.trim()) {
            layer.msg('请扫描或者输入批次号')
            return
        }
        var sku = $('#toPickUpOrder_singleCheckSelectForm [name=skuScan]').val()
        if (!sku.trim()) {
            layer.msg('请扫描或者输入sku')
            return
        }
        var data = {
            logistTypeCollectionId: $('#toPickUpOrder_singleCheckSelectForm [name=logistTypeCollectionId]').val(),
            logistTypeIdList: $('#toPickUpOrder_singleCheckSelectForm [name=logistTypeIdList]').val(),
            batchNo:  $('#toPickUpOrder_singleCheckSelectForm [name=batchNo]').val(),
            sSku:  $('#toPickUpOrder_singleCheckSelectForm [name=skuScan]').val(),
            orderType: 1
        }
        if (data.logistTypeIdList) {
            data.logistTypeIdList = data.logistTypeIdList.split(',')
        } else {
            data.logistTypeIdList = null
        }
        var ajax = new Ajax()
        ajax.post({
            url: ctx + "/orderPickUp/scanGetPlatOrderToCheck.html",
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function (res) {
                console.log(res)
                if (res.code == '0000') {
                    // 当前正在核查的订单数据
                    CurrentCheckSingleOrderJSON = res.data
                    // 判断是否直接显示 全部数量
                    var ifDefaultAllAmount = $('#toPickUpOrder_singleCheckSelectForm [name=defaultAllAmount]').prop('checked')
                    if (ifDefaultAllAmount) {
                        CurrentCheckSingleOrderJSON.checkedNum = CurrentCheckSingleOrderJSON.detailList[0].prodQuantity
                    } else {
                        CurrentCheckSingleOrderJSON.checkedNum = 1
                    }
                    // 如果检查数已经足够。则自动聚焦重量栏。 否则聚焦物品sku栏
                    if (CurrentCheckSingleOrderJSON.checkedNum == CurrentCheckSingleOrderJSON.detailList[0].prodQuantity) {
                        // 如果使用理论重量
                        if ($('#toPickUpOrder_singleCheckSelectForm [name=theoryWeight]').prop('checked')) {
                            $('#toPickUpOrder_singleCheckSelectForm [name=realWeight]').val(CurrentCheckSingleOrderJSON.preWeight + (CurrentCheckSingleOrderJSON.platOrderPack.packWeight || CurrentCheckSingleOrderJSON.detailList[0].prodSInfo.packWeight))
                        }
                        $('#toPickUpOrder_singleCheckSelectForm [name=realWeight]').focus()
                    } else {
                        $('#toPickUpOrder_singleCheckSelectForm [name=sku]').focus()
                    }
                    // 展示右侧详情
                    showRightInfo(CurrentCheckSingleOrderJSON)

                    // 展示左下侧详情
                    showCurrentCheckInfoLeft(CurrentCheckSingleOrderJSON)
                    // 展示右下侧详情
                    showCurrentCheckInfoRight(CurrentCheckSingleOrderJSON)
                    // 待核单确认表格展示
                    if (!WaitToConfirmCheckTable_SingleArr) {
                        WaitToConfirmCheckTable_SingleArr = []
                    }
                    WaitToConfirmCheckTable_SingleArr.push(CurrentCheckSingleOrderJSON)
                    show_checkSingleTable(WaitToConfirmCheckTable_SingleArr)

                }
            }
        })
    }
    // 物品sku扫描确认
    function prodSkuConfirm() {
        var sku = $('#toPickUpOrder_singleCheckSelectForm [name=sku]').val()
        if (sku != CurrentCheckSingleOrderJSON.detailList[0].prodSSku.trim()) {
            layer.msg('该商品非本订单需求')
            return
        }
        if (CurrentCheckSingleOrderJSON.detailList[0].prodQuantity == CurrentCheckSingleOrderJSON.checkedNum) {
            layer.msg('该订单需求数量已足够')
            return
        }
        CurrentCheckSingleOrderJSON.checkedNum++
        $('#toPickUpOrder_singleCheckSelectForm [name=checkedNum]').val(CurrentCheckSingleOrderJSON.checkedNum)

        // 展示右下侧详情
        showCurrentCheckInfoRight(CurrentCheckSingleOrderJSON)
        // 重新渲染待确认核单表格
        show_checkSingleTable(WaitToConfirmCheckTable_SingleArr)
        // 如果数量足够订单所需。则自动聚焦  包裹重量输入框
        if (CurrentCheckSingleOrderJSON.detailList[0].prodQuantity == CurrentCheckSingleOrderJSON.checkedNum) {
            $('#toPickUpOrder_singleCheckSelectForm [name=realWeight]').focus()
        }
    }
    // 显示当前核单的订单信息- 右边栏
    function showRightInfo(json){
        $('#toPickUpOrder_singleCheckSelectForm [name=sku]').val(json.detailList[0].prodSInfo.sSku)
        $('#toPickUpOrder_singleCheckSelectForm [name=checkedNum]').val(json.checkedNum)
        $('#toPickUpOrder_singleCheckSelectForm [name=unit]').text(json.detailList[0].prodSInfo.unit)
        $('#toPickUpOrder_singleCheckSelectForm [name=tradeOrderId]').val(json.id)
        $('#toPickUpOrder_singleCheckSelectForm [name=logisTrackingNo]').val(json.logisTrackingNo)
        $('#toPickUpOrder_singleCheckSelectForm [name=shippingUsername]').val(json.shippingUsername)
        $('#toPickUpOrder_singleCheckSelectForm [name=shippingCountryCnName]').val(json.shippingCountryCnName)
        $('#toPickUpOrder_singleCheckSelectForm [name=logisTypeName]').val(json.logisTypeName)

        // 如果核查数 = 销售数量 光标聚焦在重量栏
        if (json.checkedNum == json.detailList[0].prodQuantity) {
            // 是否使用理论重量
            var ifTheoryWeight =  $('#toPickUpOrder_singleCheckSelectForm [name=theoryWeight]').prop('checked')
            if (ifTheoryWeight) {
                var packWeight = 0
                if (json.platOrderPack && json.platOrderPack.packSpecification) {
                    packWeight = json.platOrderPack.packWeight
                } else {
                    packWeight = json.detailList[0].prodSInfo.packWeight
                }
                var theoryWeight = packWeight + accMul(json.detailList[0].prodSInfo.suttleWeight, json.detailList[0].prodQuantity)
                $('toPickUpOrder_singleCheckSelectForm [name=realWeight]').val(theoryWeight)
            }
            $('toPickUpOrder_singleCheckSelectForm [name=realWeight]').focus()
        }
    }

    // 显示当前核单的订单信息-左下侧栏
    function showCurrentCheckInfoLeft(json) {
        $('#toPickUpOrder_checkSingleLeftSaleDetailDiv [name=image]').attr('src',tplIVP + json.detailList[0].prodSInfo.image)
        $('#toPickUpOrder_checkSingleLeftSaleDetailDiv [name=tradeOrderId]').val(json.id)
        $('#toPickUpOrder_checkSingleLeftSaleDetailDiv [name=prodSSku]').val(json.detailList[0].prodSSku)
        $('#toPickUpOrder_checkSingleLeftSaleDetailDiv [name=itemId]').val(json.detailList[0].itemId)
        $('#toPickUpOrder_checkSingleLeftSaleDetailDiv [name=prodTitle]').val(json.detailList[0].prodTitle)
        $('#toPickUpOrder_checkSingleLeftSaleDetailDiv [name=prodQuantity]').val(json.detailList[0].prodQuantity)
        $('#toPickUpOrder_checkSingleLeftSaleDetailDiv [name=specification]').val(json.detailList[0].prodSInfo.specification)
        $('#toPickUpOrder_checkSingleLeftSaleDetailDiv [name=model]').val(json.detailList[0].prodSInfo.model)
        $('#toPickUpOrder_checkSingleLeftSaleDetailDiv [name=style]').val(json.detailList[0].prodSInfo.style)
        $('#toPickUpOrder_checkSingleLeftSaleDetailDiv [name=unit]').val(json.detailList[0].prodSInfo.unit)
        $('#toPickUpOrder_checkSingleLeftSaleDetailDiv [name=packSpecification]').val(json.detailList[0].prodSInfo.packSpecification)
        $('#toPickUpOrder_checkSingleLeftSaleDetailDiv [name=locationCode]').val(json.detailList[0].prodSInfo.locationCode)
    }

    // 显示当前核单的订单信息-右下侧栏
    function showCurrentCheckInfoRight(json) {
        $('#toPickUpOrder_checkSingleRightSaleDetailDiv [name=tradeOrderId]').val(json.id)
        $('#toPickUpOrder_checkSingleRightSaleDetailDiv [name=sSku]').val(json.detailList[0].prodSInfo.sSku)
        $('#toPickUpOrder_checkSingleRightSaleDetailDiv [name=title]').val(json.detailList[0].prodSInfo.title)
        $('#toPickUpOrder_checkSingleRightSaleDetailDiv [name=checkedNum]').val(json.checkedNum)
        $('#toPickUpOrder_checkSingleRightSaleDetailDiv [name=packSpecification]').val(json.platOrderPack ? json.platOrderPack.packSpecification : "")
    }

    // 显示核单的单品订单信息
    function show_checkSingleTable(data) {
        var height = $('#toPickUporder_singleCheckTpl').height()
        table.render({
            elem: "#toPickUpOrder_singleCheckTable",
            height: height * 0.50,
            data: data,
            cols: [
                [
                    { type: "checkbox", width: 30 },
                    { type:'numbers'},
                    { title: "单号", field: 'id',width: 80  },
                    { title: "交易时间", templet: "<div>{{Format(d.orderTimeCn, 'yyyy-MM-dd hh:mm:ss')}}</div>", width: 140   },
                    { title: "收件人", field: 'shippingUsername' },
                    { title: "收件国家", field: 'shippingCountryCnName'  },
                    { title: "物流方式", field: 'logisTypeName' },
                    { title: "跟踪号", field: 'logisTrackingNo'  },
                    { title: "买家留言", field: 'buyerNote' },
                    // { title: "paypal留言", field: '' },
                    { title: "内部便签", field: 'remark' },
                    // { title: "扫描时间", field: '' },
                    { title: "卖家简称", field: 'sellerEmail' },
                    { title: "重量", field: 'realWeight' },
                    { title: "运费", field: 'logisFee' },
                    // { title: "快递公司", field: '' },
                    { title: "销售数量", templet: '<div>{{d.detailList[0].prodQuantity}}</div>' },
                    { title: "拣货人", templet: '<div>{{d.detailList[0].pickInfo.actPicker}}</div>' },
                    { title: "平台", field: 'platCode' },
                ],
            ],
            id: "toPickUpOrder_singleCheckTable",
            limit: data.length,
            done: function(res, curr, count) {
            }
        });
    }

    // 多品投篮
    $('#toPickUpOrder_multipleMatchBasket').click(function () {
        layer.open({
            type: 1,
            title: '多品投篮',
            btn: ['关闭'],
            maxmin: true,
            area: ['1366px', '90%'],
            content: $('#toPickUpOrder_MultiplePreCheckPop').html(),
            id: 'toPickUpOrder_MultiplePreCheckTpl',
            success: function (layero, index) {
                form.render('checkbox','toPickUpOrder_singleCheckOperForm')
                // 初始化配置信息
                initPageConf(form, $('#toPickUpOrder_MultiplePreCheckBody'),'toPickUpOrder','multiplePreCheckConf')
                $("#toPickUpOrder_singleCheckSelectForm [name=batchNo]").focus()
                // 监听更新页面配置
                listenPageConfChange(form, 'multiplePreCheckConf', $('#toPickUpOrder_MultiplePreCheckBody'),'toPickUpOrder')
                // 初始化各表格
                showLeftTopTab([])
                showRightTopTab([])
                showLeftBottomTab([])
                showRightBottomTab([])
                // 批次 回车事件
                $('#toPickUpOrder_MultiplePreCheckSelectForm [name=batchNo]').on('keyup',function (event) {
                    if (event.keyCode == "13") {
                        multiplePreCheckSearch()
                    }
                })
                // sku 回车事件
                $('#toPickUpOrder_MultiplePreCheckSelectForm [name=sSku]').on('keyup',function (event) {
                    if (event.keyCode == "13") {
                        $('#toPickUpOrder_MultiplePreCheckSelectForm [name=scanAmount]').val('')
                        multiplePreCheckScanSku()
                    }
                })
                // 核单数量 回车事件
                $('#toPickUpOrder_MultiplePreCheckSelectForm [name=scanAmount]').on('keyup',function (event) {
                    if (event.keyCode == "13") {
                        multiplePreCheckScanSku()
                    }
                })
                form.on('checkbox(multipleCheck_checkStrict)',function (data) {
                    if (data.elem.checked) {
                        $('#toPickUpOrder_MultiplePreCheckSelectForm [name=scanAmount]').attr('disabled','disabled')
                        $('#toPickUpOrder_MultiplePreCheckSelectForm [name=scanAmount]').addClass('disAbleInp')
                    } else {
                        $('#toPickUpOrder_MultiplePreCheckSelectForm [name=scanAmount]').removeAttr('disabled')
                        $('#toPickUpOrder_MultiplePreCheckSelectForm [name=scanAmount]').removeClass('disAbleInp')
                    }
                })
            }
        })
    })

    // 展示多品投篮-左上表格
    function showLeftTopTab(data) {
        var height = $('#toPickUpOrder_MultiplePreCheckTpl').height()
        table.render({
            elem: "#toPickUpOrder_multiplePreCheckTotalOrderTable",
            height: height * 0.40,
            data: data,
            cols: [
                [
                    { type: "checkbox", width: 30 },
                    { type:'numbers'},
                    { title: "单号", field: 'id',width: 80  },
                    { title: "收件人", field: 'shippingUsername' },
                    { title: "收件国家", field: 'shippingCountryCnName'  },
                    { title: "物流方式", field: 'logisTypeName' },
                    { title: "跟踪号", field: 'logisTrackingNo'  },
                    { title: "卖家简称", field: 'allrootAliasName',width: 120 },
                    // { title: "批次号", templet: '<div>{{d.pickInfo.batchNo}}</div>' },
                    { title: "是否核完", templet: '<div>{{d.ifCheckOver ? `是` : `否`}}</div>' },
                    { title: "总数量", field: 'prodQuantity' },
                    { title: "存放篮号", templet: '<div>{{d.detailList[0].pickInfo.basketNo}}</div>' },
                    { title: "商品概览", field: 'skuOverview', width: 300 },
                ],
            ],
            id: "toPickUpOrder_multiplePreCheckTotalOrderTable",
            limit: data.length,
            done: function(res, curr, count) {
            }
        });
    }
    // 展示多品投篮-右上表格
    function showRightTopTab(data) {
        var height = $('#toPickUpOrder_MultiplePreCheckTpl').height()
        table.render({
            elem: "#toPickUpOrder_multiplePreCheckCurrentOrderProdTable",
            height: height * 0.40,
            data: data,
            cols: [
                [
                    { type:'numbers'},
                    { title: "单号", field: 'parentId',width: 80  },
                    { title: "商品sku", field: 'prodSSku' },
                    { title: "已核数", templet: '<div>{{d.pickInfo.scanAmount}}</div>'  },
                    { title: "未核数",  templet: '<div>{{d.pickInfo.amount - d.pickInfo.scanAmount}}</div>'  },
                    { title: "库位", templet: '<div>{{d.stockLocation.locationCode}}</div>' },
                ],
            ],
            id: "toPickUpOrder_multiplePreCheckCurrentOrderProdTable",
            limit: data.length,
            done: function(res, curr, count) {
            }
        });
    }
    // 展示多品投篮-左下表格
    function showLeftBottomTab(data) {
        var height = $('#toPickUpOrder_MultiplePreCheckTpl').height()
        table.render({
            elem: "#toPickUpOrder_multiplePreCheckTotalProdTable",
            height: height * 0.35,
            data: data,
            cols: [
                [
                    { type:'numbers'},
                    { title: "单号", field: 'parentId',width: 80  },
                    { title: "商品sku", field: 'prodSSku' },
                    { title: "总数量", field: 'prodQuantity'  },
                    { title: "库位", templet: '<div>{{d.stockLocation.locationCode}}</div>'  },
                    { title: "未核数", templet: '<div>{{d.prodQuantity - d.pickInfo.scanAmount}}</div>' },
                ],
            ],
            id: "toPickUpOrder_multiplePreCheckTotalProdTable",
            limit: data.length,
            done: function(res, curr, count) {
            }
        });
    }
    // 展示多品投篮-右下表格
    function showRightBottomTab(data) {
        var height = $('#toPickUpOrder_MultiplePreCheckTpl').height()
        table.render({
            elem: "#toPickUpOrder_multiplePreCheckHasCheckedProdTable",
            height: height * 0.35,
            data: data,
            cols: [
                [
                    { type:'numbers'},
                    { title: "单号", field: 'parentId',width: 80  },
                    { title: "商品sku", field: 'prodSSku' },
                    { title: "已核数", templet: '<div>{{d.pickInfo.scanAmount}}</div>'  },
                    { title: "总数", templet: '<div>{{d.prodQuantity}}</div>'  },
                ],
            ],
            id: "toPickUpOrder_multiplePreCheckHasCheckedProdTable",
            limit: data.length,
            done: function(res, curr, count) {
            }
        });
    }

    // 多品投篮-根据批次号查询 订单信息
    function multiplePreCheckSearch() {
        var data = {
            batchNo: $('#toPickUpOrder_MultiplePreCheckSelectForm [name=batchNo]').val().trim()
        }
        if (!data.batchNo.trim()) {
            layer.msg('请填写批次号')
            return
        }
        loading.show()
        $.ajax({
            type : 'POST',
            dataType: "json",
            url: ctx + "/orderPickUp/searchMultipleOrderPickUpInfo.html",
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function (res) {
                loading.hide()
                if (res.code == '0000') {
                    // 初始化主表信息
                    Current_multiplePreCheckOrderList = res.data
                    Current_multiplePreCheckOrderJSON = {}
                    for (var i = 0; i < Current_multiplePreCheckOrderList.length; ++i) {
                        Current_multiplePreCheckOrderJSON[Current_multiplePreCheckOrderList[i].id] = Current_multiplePreCheckOrderList[i]
                    }
                    showLeftTopTab(Current_multiplePreCheckOrderList)
                    // 初始化核单进度表格
                    Current_multiplePreCheckScanOrder = {detailList: []}
                    showRightTopTab(Current_multiplePreCheckScanOrder.detailList)
                    // 初始化未核sku信息
                    Current_multiplePreCheckNotScanSkuList = []
                    Current_multiplePreCheckNotScanSkuJSON = {}
                    // 初始化已核sku信息
                    Current_multiplePreCheckHadScanSkuList = []
                    Current_multiplePreCheckHadScanSkuJSON = {}
                    for (var i = 0; i < Current_multiplePreCheckOrderList.length;i++){
                        for (var j = 0; j <  Current_multiplePreCheckOrderList[i].detailList.length; ++j) {
                            var scanSkuInfo = Current_multiplePreCheckOrderList[i].detailList[j]
                            if (scanSkuInfo.pickInfo.scanAmount < scanSkuInfo.pickInfo.amount) {
                                Current_multiplePreCheckNotScanSkuList.push(scanSkuInfo)
                                Current_multiplePreCheckNotScanSkuJSON[Current_multiplePreCheckOrderList[i].id
                                + '_' + Current_multiplePreCheckOrderList[i].detailList[j].prodSSku] = scanSkuInfo
                            } else {
                                Current_multiplePreCheckHadScanSkuList.push(scanSkuInfo)
                                Current_multiplePreCheckHadScanSkuJSON[Current_multiplePreCheckOrderList[i].id
                                + '_' + Current_multiplePreCheckOrderList[i].detailList[j].prodSSku] = scanSkuInfo
                            }

                        }
                    }
                    showLeftBottomTab(Current_multiplePreCheckNotScanSkuList)
                    showRightBottomTab(Current_multiplePreCheckHadScanSkuList)


                } else {
                    layer.msg(res.msg)
                }
            }
        })
    }

    // 多品投篮-扫描sku
    function multiplePreCheckScanSku() {
        var Adata = {
            orderType: 3,
            batchNo: $('#toPickUpOrder_MultiplePreCheckSelectForm [name=batchNo]').val(),
            sSku : $('#toPickUpOrder_MultiplePreCheckSelectForm [name=sSku]').val(),
            scanAmount : $('#toPickUpOrder_MultiplePreCheckSelectForm [name=scanAmount]').val(),
            checkStrict : $('#toPickUpOrder_MultiplePreCheckSelectForm [name=checkStrict]').prop('checked'),
        }
        var checkStatus = table.checkStatus('toPickUpOrder_multiplePreCheckTotalOrderTable'),
            data = checkStatus.data;
        if (data.length > 1) {
            layer.msg('不可选择多条订单进行扫描核单。请取消勾选或者勾选你想要进行核单的一个订单，再进行扫描')
            return
        }
        if (data.length == 1) {
            Adata.tradeOrderId = data[0].id
        }
        loading.show()
        $.ajax({
            type : 'POST',
            dataType: "json",
            url: ctx + "/orderPickUp/scanGetPlatOrderToCheck.html",
            contentType: 'application/json',
            data: JSON.stringify(Adata),
            success: function (res) {
                loading.hide()
                if (res.code == '0000') {
                    // 更新核单进度表数据
                    Current_multiplePreCheckScanOrder = Current_multiplePreCheckOrderJSON[res.data.id]
                    Current_multiplePreCheckScanOrderProcessJson = {}
                    for (var i = 0; i < Current_multiplePreCheckScanOrder.detailList.length; ++i) {
                        Current_multiplePreCheckScanOrderProcessJson[Current_multiplePreCheckScanOrder.detailList[i].prodSSku] = Current_multiplePreCheckScanOrder.detailList[i]
                    }
                    Current_multiplePreCheckScanOrderProcessJson[Adata.sSku].pickInfo.scanAmount = res.data.detailList[0].pickInfo.scanAmount   // 核单进度表数量

                    // 更新篮号、数量、单位、图片
                    $('#toPickUpOrder_MultiplePreCheckSelectForm [name=basketNo]').text(Current_multiplePreCheckScanOrder.detailList[0].pickInfo.basketNo)
                    $('#toPickUpOrder_MultiplePreCheckSelectForm [name=amount]').text(Current_multiplePreCheckScanOrder.detailList[0].pickInfo.amount)
                    $('#toPickUpOrder_MultiplePreCheckSelectForm [name=unit]').text(Current_multiplePreCheckScanOrder.detailList[0].prodSInfo.unit)
                    $('#toPickUpOrder_MultiplePreCheckSelectForm [name=image]').attr('src',tplIVP + Current_multiplePreCheckScanOrder.detailList[0].prodSInfo.image)
                    $('#toPickUpOrder_MultiplePreCheckSelectForm [name=scanAmount]').val(res.data.detailList[0].pickInfo.amount) // 右边栏数量

                    // 更新未核单sku表数据
                    Current_multiplePreCheckNotScanSkuJSON[res.data.id + '_' + Adata.sSku].pickInfo.scanAmount = res.data.detailList[0].pickInfo.scanAmount
                    if (Current_multiplePreCheckScanOrder.detailList[0].pickInfo.scanAmount == Current_multiplePreCheckScanOrder.detailList[0].pickInfo.amount) {
                        // 如果该sku数量全部核单完毕,从未核单表格中移除
                        removeObjFromArr(Current_multiplePreCheckNotScanSkuList, Current_multiplePreCheckNotScanSkuJSON[res.data.id + '_' + Adata.sSku])
                        // 如果已经将该订单所有sku全部核完，则发起状态变更-  转到待包装
                        var ifFinish = true
                        for (var i = 0; i < Current_multiplePreCheckScanOrder.detailList.length; ++i) {
                            if (Current_multiplePreCheckScanOrder.detailList[i].pickInfo.scanAmount < Current_multiplePreCheckScanOrder.detailList[i].prodQuantity) {
                                ifFinish = false
                                break
                            }
                        }
                        if (ifFinish) {
                            ajaxToChangeMultipleOrderToWaitPack([Current_multiplePreCheckScanOrder.id])
                        }
                    } else if (!Adata.checkStrict) {
                        // 如果该sku未核单完毕，且未勾选严格核查数量。此时光标聚焦在数量一栏
                        $('#toPickUpOrder_MultiplePreCheckSelectForm [name=scanAmount]').focus()
                    }
                    // 更新已核单表格数据
                    if (!Current_multiplePreCheckHadScanSkuJSON[res.data.id + '_' + Adata.sSku]) {
                        Current_multiplePreCheckHadScanSkuList.push(Current_multiplePreCheckNotScanSkuJSON[res.data.id + '_' + Adata.sSku])
                    } else {
                        Current_multiplePreCheckHadScanSkuJSON[res.data.id + '_' + Adata.sSku].pickInfo.scanAmount = res.data.detailList[0].pickInfo.scanAmount
                    }

                    // 重新渲染核单进度表
                    showRightTopTab(Current_multiplePreCheckScanOrder.detailList)
                    // 重新渲染未核表格
                    showLeftBottomTab(Current_multiplePreCheckNotScanSkuList)
                    // 重新渲染已核 表格
                    showRightBottomTab(Current_multiplePreCheckHadScanSkuList)
                } else  {
                    layer.msg(res.msg)
                }
            }, error: function () {
                layer.msg('服务繁忙，请稍后再试')
            }
        })
    }

    // 发送ajax请求 将指定的多品订单状态变更为待包装
    function ajaxToChangeMultipleOrderToWaitPack(idList) {
        $.ajax({
            type : 'POST',
            dataType: "json",
            url: ctx + "/orderPickUp/markMultiPleOrderToWaitPack.html",
            contentType: 'application/json',
            data: JSON.stringify(idList),
            success: function (res) {
                if (res.code == '0000') {
                    // 变更当前订单的 核单状态
                    Current_multiplePreCheckOrderJSON[idList[0]].ifCheckOver = true

                    // 如果勾选了核完一单删除一单，则将订单信息从总表中移除
                    var deleteWhenFinish = $('#toPickUpOrder_multiplePreCheckOperForm [name=deleteWhenFinish]').prop('checked')
                    if (deleteWhenFinish) {
                        removeObjFromArr(Current_multiplePreCheckOrderList,Current_multiplePreCheckOrderJSON[idList[0]])
                    }
                    // 重新渲染总表信息
                    showLeftTopTab(Current_multiplePreCheckOrderList)

                    // 聚焦sku扫描栏
                    $('#toPickUpOrder_MultiplePreCheckSelectForm [name=sSku]').focus()
                } else {
                    layer.msg(res.msg)
                }
            }
        })
    }

})

function getIfNear(nearAreaQuanlity) {
    switch (nearAreaQuanlity) {
        case 0 : return '无'
        case 1 : return '是'
        default : return '否'
    }
}

function  getDaysBetween(time1){
    var time2 = (new Date()).getTime()
    var days= Math.floor((time2 - time1)/(1*24*60*60*1000))
    return  days;
}