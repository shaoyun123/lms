var ajaxAuditpurchaseOrderOff, initAddressOption_purchaseOrderOff, purOrderMainDtoContain_off, deleteAutoPurNote_purchaseOrderOff,initReceiverOption_purchaseOrderOff
layui.use(["layer", "table", "form", "laytpl", "laydate", "element", 'upload', 'formSelects'], function() {
    var layer = layui.layer,
        table = layui.table,
        form = layui.form,
        $ = layui.$,
        formSelects = layui.formSelects,
        laydate = layui.laydate;
    form.render();
    formSelects.render('buyer_purchaseOrderOff');
    formSelects.render('bizzOwner_purchaseOrderOff');
    formSelects.render('logisticName_purchaseOrderOff');
    laydate.render({
            elem: '#timeRange_purchaseOrderOff',
            range: true
        })
        // 初始化设置日期为当前1个月内时间
    var date = new Date()
    var endTime = format(date, 'yyyy-MM-dd')
    date.setDate(date.getDate() - 30);
    var beginTime = format(date, 'yyyy-MM-dd')
    var timeStr = beginTime + ' - ' + endTime
    $('#timeRange_purchaseOrderOff').val(timeStr)

    // 入库状态选择 绑定
    form.on('checkbox(stockInStatusCheckBox_purchaseOrderOff)', function(data) {
        var value = data.value
        var ifChecked = data.elem.checked
        $('#stockInStatusForm_purchaseOrderOff [name=stockInStatus][value=' + value + ']').prop('checked', ifChecked)
    });

    // 表格渲染
    function search_purchaseOrderOff(data) {
        data.ifPullInvalid = data.ifPullInvalid == '1'
        var stockInStatusList = []
        var checkedStockInStatus = $('#stockInStatusForm_purchaseOrderOff [name=stockInStatus]:checked')
        for (var i = 0; i < checkedStockInStatus.length; ++i) {
            stockInStatusList.push(parseInt(checkedStockInStatus[i].value))
        }
        data.stockInStatusListStr = stockInStatusList.join(',')
        data.ifOffLine = true
        table.render({
            elem: "#purchaseOrderOff_table",
            method: 'post',
            url: ctx + "/purOrderMain/queryPage.html",
            where: data,
            cols: [
                [
                    { type: "checkbox", width: 20 },
                    { title: "单号", width: 170, templet: '#orderNo_purchaseOrderOff', width: 205 },
                    { field: "supplierName", title: "供应商", width: 150},
                    // { field: "ali1688Acct", title: "1688付款账号" },
                    { title: "责任人", templet: "#responsor_purchaseOrderOff" },
                    { field: "storeName", title: "采购仓库" },
                    { title: "采购参数", templet: '#purchaseConf_purchaseOrderOff' },
                    { title: "订单费用", width: 150, templet: "#logisticFee_purchaseOrderOff" },
                    { title: "物流信息", width: 150, templet: "#logisticList_purchaseOrderOff" },
                    // { field: "note", title: "标签" },
                    // { field: "scanInfo", title: "扫描收货" },
                    { title: "未入库", templet: '#notInStoreAmount_purchaseOrderOff', width: 115 },
                    { title: "日期", templet: '#date_purchaseOrderOff', width: 120 },
                    { field: "memo", title: "采购备注" },
                    { title: '操作', align: 'center', toolbar: '#purchaseOrderOffTable_bar' }
                ]
            ],
            id: "purchaseOrderOff_table",
            page: true,
            limits: [100, 200, 500],
            limit: 100,
            done: function(res, curr, count) {
                $('#purOrderNum').text(res.count)
                // 统计各状态订单数量
                countForAllAuditStatus_purchaseOrderOff(data)
                // 固定表头
                $('#purchaseOrderOff_table').next('.layui-table-view').find('.layui-table-header').addClass('toFixedContain')

                // 绑定事件
                var tbody = $('#purchaseOrderOff_table').next('.layui-table-view').find('.layui-table-body').find('tr[data-index=0]')
                if (tbody.length > 0) {
                    var ifBind = tbody.attr('data-ifBind')
                    if (!ifBind) {
                        // 给物流单号、1688单号、物流费三个设定 单击修改事件
                        setEventByselector('#purchaseOrderOff_table', '.doubleClickToSet', 'dblclick', toShowEditInp)
                        // 给1688单号上添加单击 跳转页面事件
                        setEventByselector('#purchaseOrderOff_table', '.clcikRoutTo', 'click', routerTo)
                        // 给物流单号、1688单号、物流费三者的编辑框 绑定失去焦点发起修改事件
                        setEventByselector('#purchaseOrderOff_table', '.editInp', 'blur', toUpdateField_purchaseOrderOff)
                        // 标记加急单为黄色背景
                        setRowBackColor('.speed_purchaseOrderOff', { 'background-color': 'rgb(253, 253, 144)' })

                        // 给行加上点击显示详情事件
                        purOrderMainDtoContain_off = {}
                        setRowEvent('#purchaseOrderOff_table', '.purchaseOrderOffMainId', 'click', showPurOrderDetailPop, ['.copyTxt', '.doubleClickToSet', '.laytable-cell-checkbox', '.freeClickBox'])
                        tbody.attr('data-ifBind','1')
                    }
                }
            }
        });

    }

    function showPurOrderDetailPop(self) {
        var id = $(self).find('.purchaseOrderOffMainId').val()
        var ifHasPop = $('#deailShowTable_purchaseOrderOff')
        if (ifHasPop && ifHasPop.length) {
            if (purOrderMainDtoContain_off[id]) {
                popToShowPurOrderDetail(purOrderMainDtoContain_off[id])
                return
            }
            $.ajax({
                url: ctx + "/purOrderMain/onlyGetPurOrderDetailById.html",
                type: 'POST',
                dataType: "json",
                contentType: 'application/json',
                data: JSON.stringify({ id: id }),
                success: function(res) {
                    loading.hide()
                    if (res.code = '0000') {
                        purOrderMainDtoContain_off[id] = res.data
                        popToShowPurOrderDetail(purOrderMainDtoContain_off[id])
                    } else {
                        layer.msg(res.msg)
                    }
                },
                error: function() {
                    loading.hide()
                    layer.msg('服务器繁忙，请稍后再试')
                }
            })
            return
        }

        layer.open({
            type: 1,
            title: "采购订单详情",
            area: ["100%", "30%"],
            offset: 'b',
            maxmin: true,
            shade: false,
            maxmin: true,
            content: $("#deailPop_purchaseOrderOff").html(),
            id: 'deailPop_purchaseOrderOff_contain',
            success: function(layero, index) {
                // 固定表头
                $('#deailPop_purchaseOrderOff_contain').scroll(function() {
                    toFixedTabHead(this)
                })
                if (purOrderMainDtoContain_off[id]) {
                    popToShowPurOrderDetail(purOrderMainDtoContain_off[id])
                    return
                }
                loading.show()
                $.ajax({
                    url: ctx + "/purOrderMain/onlyGetPurOrderDetailById.html",
                    type: 'POST',
                    dataType: "json",
                    contentType: 'application/json',
                    data: JSON.stringify({ id: id }),
                    success: function(res) {
                        loading.hide()
                        if (res.code = '0000') {
                            purOrderMainDtoContain_off[id] = res.data
                            popToShowPurOrderDetail(purOrderMainDtoContain_off[id])
                        } else {
                            layer.msg(res.msg)
                        }
                    },
                    error: function() {
                        loading.hide()
                        layer.msg('服务器繁忙，请稍后再试')
                    }
                })
            }
        })
    }

    function popToShowPurOrderDetail(data) {
        table.render({
            elem: "#deailShowTable_purchaseOrderOff",
            id: "deailShowTable_purchaseOrderOff",
            data: data.detailList,
            cols: [
                [
                    { title: "图片", templet: "#image_purOrderDetail" },
                    { field: "sSku", title: "商品sku" },
                    { field: "bizzOwner", title: "开发专员" },
                    { field: "title", title: "商品名称", templet: '#title_purOrder_subDetailList',width: 220 },
                    { title: "累计净重(g)", templet: '#totalWeight_subDetailList' },
                    { field: "style", title: "款式" },
                    { field: 'originCost', title: "采购单价(￥)" },
                    { title: "含运费单价(￥)", field: 'taxPrice' },
                    { title: "当时同款最低价", templet: '#purOffline_oldLowestPriceBox' },
                    { title: "最新同款", templet: '#newLowestPriceBox_purOrderDetail' },
                    { field: 'amount', title: "采购数量" },
                    { title: "已入库数量", templet: '<div>{{d.inAmount || 0}}</div>' },
                    { title: "未入库数量", templet: '<div>{{d.amount - (d.inAmount || 0)}}</div>' },
                    { title: "未入库金额", templet: '<div>{{accMul(d.amount - (d.inAmount || 0), d.taxPrice)}}</div>' },
                    { title: "历史最低成本", field: 'lowestPrice' },
                    { title: "可用数量", templet: "<div>{{d.stockNum - d.reservationNum}}</div>" },
                    // { field: "orderNotInNum", title: "未入库数量"},
                    { title: "预计可用库存", templet: "<div>{{d.stockNum - d.reservationNum + d.orderNotInNum + d.lackReservationNum - d.lackUnPaiNum}}</div>" },
                    { field: "unit", title: "单位" },
                    { field: "style", title: "款式" },
                    { field: "stockLocation", title: "库位" },
                    { field: "dailySaleNum1", title: "日均销量" },
                    { field: "fiveSalesNum", title: "5/15/30天销量", templet: '#daylysSales_purchaseOrderOff' },
                    { title: "累计金额(￥)", templet: "#subTotalMoney_purOrderDetail" },
                    { title: "供应商", templet: "#subSupplierList_purOrderDetail" },
                ]
            ],
            page: false,
            limit: data.detailList.length,
            done: function() {
                // 固定表头
                $('#deailShowTable_purchaseOrderOff').next('.layui-table-view').find('.layui-table-header').addClass('toFixedContain')
            }
        })
    }

    function routerTo() {

        var span = $(this)
        var id = span.find('a').text()
        if (!id) {
            return
        }
        span.attr('data-ifExcuteClick', 1)
            // 设定时器
        var index = window.setTimeout(function() {
            var ifExcuteClick = span.attr('data-ifExcuteClick')
            if (ifExcuteClick == '1') {
                var routerUrl = span.attr('data-routUrl')
                window.open(routerUrl.replace('{data}', id))
            }
            span.removeAttr('data-ifExcuteClick')
        }, 300)
    }

    function countForAllAuditStatus_purchaseOrderOff(data) {
        $.ajax({
            url: ctx + "/purOrderMain/countForAuditStatus.html",
            type: 'POST',
            dataType: "json",
            data: data,
            success: function(res) {
                if (res.code == '0000') {
                    var list = res.data
                    var map = {}
                    for (var i = 0; i < list.length; ++i) {
                        map[list[i].audit_status + '-' + list[i].stock_in_status + '-' + list[i].if_pull_invalid] = list[i].num
                    }
                    $('#InitNum_purchaseOrderOff').text(map['-1-1-false'] || 0)
                    $('#noAuditNum_purchaseOrderOff').text(map['0-1-false'] || 0)
                    $('#hasAuditNum_purchaseOrderOff').text((map['1-1-false'] || 0) + (map['1-2-false'] || 0) + (map['1-3-false'] || 0))
                    $('#deleteNum_purchaseOrderOff').text((map['3-1-false'] || 0))
                    $('#pullInvalidNum_purchaseOrderOff').text((map['1-1-true'] || 0) + (map['1-2-true'] || 0) + (map['1-3-true'] || 0))
                    $('#NotAllInNum_purchaseOrderOff').text((map['1-1-false'] || 0))
                    $('#NotAuditStockInNum_purchaseOrderOff').text((map['1-2-false'] || 0))
                    $('#AuditStockInNum_purchaseOrderOff').text((map['1-3-false'] || 0))

                } else {
                    layer.msg(res.msg)
                }
            }
        })
    }

    // 展示输入框
    function toShowEditInp() {
        // 隐藏原值
        var span = $(this).find('.showSpan')
        span.attr('data-ifExcuteClick', 0) // 锁住单击事件
        span.hide()
            // 展示编辑输入框 并赋值
        var inp = $(this).find('.editInp')
        inp.val(span.find('a').text())
        inp.show()
        inp.focus()
    }

    // 发起修改
    function toUpdateField_purchaseOrderOff() {
        var inp = $(this)
        inp.hide()
        var span = inp.prev('.showSpan')

        var data = {
            id: inp.attr('data-id')
        }
        var fieldName = inp.attr('data-name')
        var newData = inp.val().trim()
            // 检查是否有修改
        var originData = span.find('a').text().trim()
        if (originData == newData) {
            span.show()
            return
        }
        // 如果修改物流费，若是空字符串，则变更为0
        if (fieldName == 'logisticFee' && !newData) {
            newData = '0'
        }
        data[fieldName] = newData.replace(/，/ig,',')

        $.ajax({
            url: ctx + "/purOrderMain/changeFieldForPurOrderMain.html",
            type: 'POST',
            dataType: "json",
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function(data) {
                span.show()
                if (data.code == '0000') {
                    layer.msg('修改成功')
                    active_purchaseOrderOff.reloadWithoutFresh()
                } else {
                    layer.msg(data.msg)
                }
            },
            complete: function() {
                loading.hide()
            }
        })
    }

    //远程搜索功能
    var dim = new DimSearch('#searchSupplier_purchaseOrderOff', 'supplierId');
    dim.init();

    // 表格数据重载
    active_purchaseOrderOff = {
        reload: function(data) {
            //执行重载
            table.reload('purchaseOrderOff_table', {
                method: 'post',
                page: {
                    curr: 1 //重新从第 1 页开始
                },
                where: data
            });
        },
        reloadWithoutFresh: function (data) {
            $('.layadmin-tabsbody-item.layui-show').find('.layui-table-page .layui-laypage-btn').click()
        }
    }

    $("#reset_purchaseOrderOff").click(function() {
        $("#purchaseOrderOff_searchForm [name]:not(.hiddenContent)").val('')
        formSelects.value('buyer_purchaseOrderOff', [''])
        formSelects.value('bizzOwner_purchaseOrderOff', [''])
        // 重新渲染select， 防止select值被清空
        form.render('select', 'purchaseOrderOff_searchForm')
    });

    // 搜索按钮
    $('#searchBtn_purchaseOrderOff').click(function() {
        var data = getSerachData_purchaseOrderOff()
        search_purchaseOrderOff(data)
    })

    $('.numCount_purchaseOrderOff').click(function() {
        var auditStatus = $(this).attr('data-auditstatus') || ''
        var ifPullInvalid = $(this).attr('data-ifpullinvalid') || ''
        $('#purchaseOrderOff_searchForm [name=auditStatus]').val(auditStatus)
        $('#purchaseOrderOff_searchForm [name=ifPullInvalid]').val(ifPullInvalid)
            // 入库状态的显隐
        if (auditStatus == '1') {
            $('.stockInStatusCheckBox').show()
        } else {
            $('.stockInStatusCheckBox').hide()
        }

        var data = getSerachData_purchaseOrderOff()
        search_purchaseOrderOff(data)
    })

    function getSerachData_purchaseOrderOff() {
        var data = serializeObject($('#purchaseOrderOff_searchForm'))
        data.buyerId = data.buyerId ? parseInt(data.buyerId) : null
        data.supplierId = data.supplierId ? parseInt(data.supplierId) : null
        data.storeId = data.storeId ? parseInt(data.storeId) : null
        // data.purAcctId = data.purAcctId ? parseInt(data.purAcctId) : null
        data.auditStatus = data.auditStatus != '' ? parseInt(data.auditStatus) : null
        data.ifOffLine = true
        // data.createAli1688OrderStatus = data.createAli1688OrderStatus != '' ? parseInt(data.createAli1688OrderStatus) : null
        // data.payAble = data.payAble != '' ? (data.payAble == '1') : null
        // data.ifSpeed = $('#ifSpeed_purchaseOrderOff_searchForm').prop("checked") ? "1" : null
        // data.ifRefund = $('#ifRefund_purchaseOrderOff_searchForm').prop("checked") ? "1" : null
        return data
    }

    $('#createPurOrderBtn_purchaseOrderOff').click(function() {
        var popIndex = layer.open({
            type: 1,
            title: "采购订单",
            area: ["98%", "70%"],
            btn: ['提交', '关闭'],
            id: 'detailPop_purchaseOrderOff',
            shadeClose: true,
            maxmin: true,
            move: '.layui-layer-title',
            content: $("#purOrderDetailOff_pop").html(),
            success: function(layero, index) {
                // 初始化子表数据
                purOrderDetailList_purchaseOrderOff = []
                // 初始化控件
                formSelects.render('note_purchaseOrderOff_AddForm');
                componentInit()
                // 初始化子表
                showSubTable()
                // 到货日期设置
                var today = new Date();
                today.setDate(today.getDate() + 7)
                $('#purOrderMainInfoForm_purchaseOrderOff [name=delivDay]').val(format(today, 'yyyy-MM-dd'))
                // 采购仓库
                $('#purOrderMainInfoForm_purchaseOrderOff [name=storeId]').val(1)
                // 付款方式
                $('#purOrderMainInfoForm_purchaseOrderOff [name=payType]').val('alipay')
                form.render('select', 'purOrderMainInfoForm_purchaseOrderOff')
                // 固定表头
                $('#detailPop_purchaseOrderOff').scroll(function() {
                    toFixedTabHead(this)
                })
            },
            yes: function() {
                var data = getData_purOrderMain();
                if (!data) {
                    return
                }
                data.orderType = 3
                data.logisticFee = data.logisticFee || 0
                data.discountMoney = data.discountMoney || 0
                data.prevPayMoney = data.prevPayMoney || 0
                // if ((data.purAcctId && !data.purReceiveAddressId) || (data.purReceiveAddressId && !data.purAcctId)) {
                //     layer.msg('采购账号和收货地址必须同时指定，否则请不要选择，会自动使用默认账号和收货地址')
                //     return
                // }

                // 提交新增
                loading.show()
                $.ajax({
                    url: ctx + "/purOrderMain/addOrUpdPurOrderMain.html",
                    type: 'POST',
                    dataType: "json",
                    contentType: 'application/json',
                    data: JSON.stringify(data),
                    success: function(data) {
                        if (data.code == '0000') {
                            layer.close(popIndex)
                            active_purchaseOrderOff.reload()
                            layer.msg('新增成功')
                        } else {
                            layer.msg(data.msg)
                        }
                    },
                    complete: function() {
                        loading.hide()
                    }
                })

            }
        })
    });

    // 订单新增弹窗，控件初始化
    function componentInit() {
        // 供应商搜索
        var dim = new DimSearch('#searchSupplier_purchaseOrderOffDetailForm', 'supplierId');
        dim.init();
        // 初始化选项框
        form.render('select', 'purOrderMainInfoForm_purchaseOrderOff');
        form.render('checkbox', 'purOrderMainInfoForm_purchaseOrderOff');
        // 初始化必填项
        initNotNull('#purOrderMainInfoForm_purchaseOrderOff')
        // 预计到货日期初始化
        laydate.render({
            elem: '#purOrderMainInfoForm_purchaseOrderOff [name=delivDay]',
            range: false
        })

        // 付款账号选择
        // form.on('select(pur1688AcctId_purOrderDetail)', function(data) {
        //     var purAcctId = data.value
        //         // 清空收货地址的值
        //     $('#purOrderMainInfoForm_purchaseOrderOff [name=purReceiveAddressId]').val('')
        //     initAddressOption_purchaseOrderOff(purAcctId)
        // });

        // 采购员选择
        form.on('select(buyerId_purOrderDetail)', function(data) {
            var buyerId = data.value
            // 清空收件人
            $('#purOrderMainInfoForm_purchaseOrderOff [name=receiverId]').val('')
            initReceiverOption_purchaseOrderOff(buyerId)
        });

        // 快递费输入
        $('#purOrderMainInfoForm_purchaseOrderOff [name=logisticFee]').on('input propertychange', function() {
                countPrevPayMoney_purchaseOrderOff()
            })
            // 减免金额输入
        $('#purOrderMainInfoForm_purchaseOrderOff [name=discountMoney]').on('input propertychange', function() {
            countPrevPayMoney_purchaseOrderOff()
        })

        // 匹配收货信息
        $('#toMatchReceiverInfo_purOrderInfo').click(function () {
            match_receiverInfo_purchaseOrderOff(true)
        })

        // sku 选择
        $('#toAddSkuInpBtn_purOrderInfo').click(function() {
            //  获取所选仓库
            var storeId = $('#purOrderMainInfoForm_purchaseOrderOff [name=storeId]').val()
            if (!storeId) {
                layer.msg('请先选择仓库')
                return
            }
            var sku = $('#toAddSkuInp_purOrderInfo').val()
            if (!sku) {
                layer.msg('请填写sku')
                return
            }
            var skuSelectPopIndex = layer.open({
                type: 1,
                title: "sku选择",
                area: ["70%", "60%"],
                btn: ['选择', '关闭'],
                shadeClose: false,
                content: $("#skuSelectPop_purchaseOrderOff").html(),
                success: function(layero, index) {
                    showProductBySkuAndIsSale(sku,true)
                    $('#ifSelectStopSale').click(function () {
                        showProductBySkuAndIsSale(sku)
                    })
                },
                yes: function() {
                    var checkStatus = table.checkStatus('skuSelectTab_purchaseOrderOff'),
                        selectSkuList = checkStatus.data;
                    if (!selectSkuList || selectSkuList.length == 0) {
                        layer.msg('请选择sku')
                        return false
                    }
                    var skuArr = []
                    for (var i = 0; i < selectSkuList.length; ++i) {
                        skuArr.push(selectSkuList[i].sSku)
                    }
                    toSearchSku(skuArr.join(','),storeId)
                    return false
                }
            })

            // 搜索选定的skus信息，并展示到子表列表中
            function toSearchSku(skus,storeId) {
                loading.show()
                $.ajax({
                    url: ctx + "/purOrderMain/getprodSInfoBySSkuList.html",
                    type: 'POST',
                    dataType: "json",
                    data: { skus: skus,storeId: storeId },
                    success: function(data) {
                        loading.hide()
                        if (data.code == '0000') {
                            var list = data.data
                            if (!list || list.length == 0) {
                                layer.msg('未找到这些sku的相关数据')
                                return
                            }
                            // 设置默认供应商  默认采购1个  默认单价为商品采购价
                            for (var i = 0; i < list.length; ++i) {
                                list[i].sameProductLowestPrice = list[i].supplierRefDtoList[0].sameProdLowestPrice
                                list[i].sameProductUrl = list[i].supplierRefDtoList[0].lowestSameProdUrl
                                list[i].originCost = list[i].purchaseCostPrice
                                list[i].taxPrice = list[i].purchaseCostPrice
                                list[i].amount = 0
                                list[i].totalWeight = 0
                            }
                            // 合并sku集合。 如有新旧相同的。则不再增加该sku
                            var allSubList = []
                            allSubList = allSubList.concat(purOrderDetailList_purchaseOrderOff)
                            var originMap = {};
                            for (var k = 0; k < allSubList.length; ++k) {
                                originMap[allSubList[k].prodSId] = allSubList[k]
                            }
                            for (var j = 0; j < list.length; ++j) {
                                if (!originMap[list[j].prodSId]) {
                                    allSubList.push(list[j])
                                }
                            }
                            // 检查供应商
                            var checkMsg = checkIfTheSameSupplier(allSubList)
                            if (checkMsg) {
                                layer.msg(checkMsg)
                                return
                            }
                            //  设置默认采购员和部门
                            if (!$('#purOrderMainInfoForm_purchaseOrderOff [name=purOrgId]').val()) {
                                $('#purOrderMainInfoForm_purchaseOrderOff [name=purOrgId]').val(list[0].firstLevelOrgId)
                            }
                            if (!$('#purOrderMainInfoForm_purchaseOrderOff [name=buyerId]').val()) {
                                $('#purOrderMainInfoForm_purchaseOrderOff [name=buyerId]').val(list[0].buyerId)
                            }
                            // 初始化收件人选项
                            initReceiverOption_purchaseOrderOff($('#purOrderMainInfoForm_purchaseOrderOff [name=buyerId]').val())
                            form.render('select', 'purOrderMainInfoForm_purchaseOrderOff')

                            // 更新子表集合
                            purOrderDetailList_purchaseOrderOff = allSubList
                                // 重新渲染子表数据
                            showSubTable(purOrderDetailList_purchaseOrderOff)
                                // 设置自动留言
                                // setAutoPurNote()
                            layer.close(skuSelectPopIndex)
                            // 匹配收货地址
                            match_receiverInfo_purchaseOrderOff(false);
                        } else {
                            layer.msg(data.msg)
                        }
                    },
                    complete: function() {
                        loading.hide()
                    }
                })
            }
        })

        function showProductBySkuAndIsSale(sSku,isSale) {
            table.render({
                elem: "#skuSelectTab_purchaseOrderOff",
                id: "skuSelectTab_purchaseOrderOff",
                method: 'post',
                url: ctx + "/product/getProds.html",
                where: { searchType: 'sSku', searchValue: sSku, page: 1, limit: 300, isCombination: false, isSale: isSale },
                cols: [
                    [
                        { type: "checkbox", width: 20 },
                        { title: "图片", width: 170, templet: '#img_skuSelectPop_purchaseOrderOff', width: 205 },
                        { field: "sSku", title: "sSku" },
                        { title: "pSku", templet: '<div>{{ d.parent.pSku}}</div>' },
                        { field: "title", title: "商品名称" },

                    ]
                ],
                page: false,
                // width: '100%',
                // limits: [100, 200, 500],
                // limit: 200,
                done: function(res, curr, count) {
                    $("#sSkuNum_purchaseOrderOff").html(count);
                    //懒加载
                    imageLazyload();
                }
            })
        }

        function setAutoPurNote() {
            var originPurNote = $('#purOrderMainInfoForm_purchaseOrderOff [name=purNote]').val()
            if (!originPurNote.trim()) {
                var newSubList = purOrderDetailList_purchaseOrderOff
                for (var i = 0; i < newSubList.length; ++i) {
                    if (newSubList[i].supplierRefDtoList[0].autoPurNote && newSubList[i].supplierRefDtoList[0].autoPurNote.trim() && originPurNote.indexOf('【' + newSubList[i].prodSId + '】') < 0) {
                        originPurNote += '【$' + newSubList[i].prodSId + '】' + '【' + newSubList[i].title + '】' + (newSubList[i].supplierRefDtoList[0].attrStr ? ('【' + newSubList[i].supplierRefDtoList[0].attrStr + '】') : '') + ':' + newSubList[i].supplierRefDtoList[0].autoPurNote.trim() + "\n"
                    }
                }
                $('#purOrderMainInfoForm_purchaseOrderOff [name=purNote]').val(originPurNote)
            }
        }

        deleteAutoPurNote_purchaseOrderOff = function(prodSId) {
            var originPurNote = $('#purOrderMainInfoForm_purchaseOrderOff [name=purNote]').val()
            if (originPurNote.indexOf('【' + prodSId + '】') >= 0) {
                var beginIndex = originPurNote.indexOf('【' + prodSId + '】')
                var endIndex = originPurNote.indexOf('\n', beginIndex) + 2
                var note = originPurNote.replace(originPurNote.substring(beginIndex, endIndex), '')
                $('#purOrderMainInfoForm_purchaseOrderOff [name=purNote]').val(note)
            }
        }

        // 批量修改
        $('#updateByList_purOrderDetailList').click(function() {
            var price = $('#detailMoney_purOrderOfflineList').val()
            var amount = $('#detailNum_purOrderDetailList').val()
            if (price && !isNaN(price)) {
                for (var i = 0; i < purOrderDetailList_purchaseOrderOff.length; ++i) {
                    purOrderDetailList_purchaseOrderOff[i].originCost = price
                }
            }
            if (amount && !isNaN(amount)) {
                for (var i = 0; i < purOrderDetailList_purchaseOrderOff.length; ++i) {
                    purOrderDetailList_purchaseOrderOff[i].amount = amount
                        // 计算重量
                    purOrderDetailList_purchaseOrderOff[i].totalWeight = accMul(purOrderDetailList_purchaseOrderOff[i].suttleWeight, amount)
                }
            }

            showSubTable(purOrderDetailList_purchaseOrderOff)
        })
    }

    /**
     * 匹配收件信息
     * @param ifForced   是否强制刷新匹配
     */
    function match_receiverInfo_purchaseOrderOff(ifForced) {
        if (!ifForced) {
            // var purAcctId = $('#purOrderMainInfoForm_purchaseOrderOff [name=purAcctId]').val()
            var receiver = $('#purOrderMainInfoForm_purchaseOrderOff [name=receiverId]').val()
            var receiveAddress = $('#purOrderMainInfoForm_purchaseOrderOff [name=purReceiveAddressId]').val()
            if (receiver || receiveAddress) {
                return
            }
        }
        var storeId = $('#purOrderMainInfoForm_purchaseOrderOff [name=storeId]').val()
        if (!storeId) {
            if (ifForced) {
                layer.msg('请先选择仓库')
            }
            return
        }


        var Adata = serializeObject($('#purOrderMainInfoForm_purchaseOrderOff'))
        Adata.detailList = purOrderDetailList_purchaseOrderOff
        Adata.supplierName = $("#searchSupplier_purchaseOrderOffDetailForm").val()
        Adata.buyer = $("#purOrderMainInfoForm_purchaseOrderOff [name=buyerId] option:selected").text()
        Adata.storeName = $("#purOrderMainInfoForm_purchaseOrderOff [name=storeId] option:selected").text()
        Adata.purAcctId = null
        Adata.receiverId = null
        Adata.purReceiveAddressId = null
        loading.show()
        $.ajax({
            url: ctx + "/purOrderMain/getReceiveInfo.html",
            type: 'POST',
            dataType: "json",
            contentType: 'application/json',
            data: JSON.stringify(Adata),
            success: function(res) {
                loading.hide()
                if (res.code == '0000') {
                    // $('#purOrderMainInfoForm_purchaseOrderOff [name=purAcctId]').val(res.data.purAcctId)
                    $('#purOrderMainInfoForm_purchaseOrderOff [name=receiverId]').val(res.data.receiverId)
                    $('#purOrderMainInfoForm_purchaseOrderOff [name=purReceiveAddressId]').val(res.data.purReceiveAddressId)

                    form.render('select','purOrderMainInfoForm_purchaseOrderOff')
                } else {
                    layer.msg(res.msg)
                }
            },
            complete: function() {
                loading.hide()
            }
        })
    }
    initReceiverOption_purchaseOrderOff = function (buyerId) {
        var optionList = $('#purOrderMainInfoForm_purchaseOrderOff #purReceiverOptionDiv option')
        // 对应账号id的选项可选
        var buyerIdOfReceiver
        var availableOption = []
        for (var i = 0; i < optionList.length; ++i) {
            buyerIdOfReceiver = optionList[i].getAttribute('data-buyerId')
            if (buyerIdOfReceiver == buyerId) {
                availableOption.push($(optionList[i]).clone(true))
            }
        }
        $('#purOrderMainInfoForm_purchaseOrderOff [name=receiverId]').html('')
        $('#purOrderMainInfoForm_purchaseOrderOff [name=receiverId]').append('<option value=""></option>')
        $('#purOrderMainInfoForm_purchaseOrderOff [name=receiverId]').append(availableOption)
        form.render('select', 'purOrderMainInfoForm_purchaseOrderOff')
    }

    initAddressOption_purchaseOrderOff = function(purAcctId) {
        var optionList = $('#purOrderMainInfoForm_purchaseOrderOff #purReceiveAddressOptionDiv option')
        // 初始化全不可选择
        // optionList.attr('disabled','disabled')
        // 对应账号id的选项可选
        var purAcctIdOfAddress
        var availableOption = []
        for (var i = 0; i < optionList.length; ++i) {
            purAcctIdOfAddress = optionList[i].getAttribute('data-acctId')
            if (purAcctIdOfAddress == purAcctId) {
                availableOption.push($(optionList[i]).clone(true))
            }
        }
        $('#purOrderMainInfoForm_purchaseOrderOff [name=purReceiveAddressId]').html('')
        $('#purOrderMainInfoForm_purchaseOrderOff [name=purReceiveAddressId]').append('<option value=""></option>')
        $('#purOrderMainInfoForm_purchaseOrderOff [name=purReceiveAddressId]').append(availableOption)
        form.render('select', 'purOrderMainInfoForm_purchaseOrderOff')
    }

    function checkIfTheSameSupplier(data) {
        var supplierName = $('#searchSupplier_purchaseOrderOffDetailForm').val().trim()
        // 如果未填写供应商，则使用第一个sku的默认供应商
        if (!supplierName) {
            // 获取第一个sku的 默认供应商
            for (var i = 0; i < data[0].supplierRefDtoList.length; ++i) {
                if (data[0].supplierRefDtoList[i].ifDefault) {
                    supplierName = data[0].supplierRefDtoList[i].supplierName.trim()
                    $('#searchSupplier_purchaseOrderOffDetailForm').val(data[0].supplierRefDtoList[i].supplierName)
                    break
                }
            }
        }
        // 检查是否所有sku都有 所填写的供应商
        var noSupplierSkuArr = []
        var supplierList,ifHas,supplierId
        for (var i = 0; i < data.length; ++i) {
            ifHas = false
            supplierList = data[i].supplierRefDtoList
            for (var j = 0; j < supplierList.length; ++j) {
                if (supplierList[j].supplierName == supplierName) {
                    ifHas = true
                    supplierId = supplierList[j].supplierId
                }
            }
            if (!ifHas) {
                noSupplierSkuArr.push(data[i].sSku)
            }
        }
        // supplierName 和supplierId 强相关矫正
        $('#purOrderMainInfoForm_purchaseOrderOff [name=supplierId]').val(supplierId)

        if (noSupplierSkuArr.length > 0) {
            return 'sku:' + noSupplierSkuArr.join(',') + " 不存在供应商 " + $('#searchSupplier_purchaseOrderOffDetailForm').val()
        }
    }

    /**
     * 展示子表
     * @param data  数据
     * @param ifUpdate 是否锁定不可更改
     */
    function showSubTable(data, ifLock) {
        if (!data) {
            data = []
        }
        table.render({
            elem: "#purOrderDetailTable_orderInfo",
            cols: [
                [
                    { title: "图片", templet: "#image_purOrderDetail" },
                    { field: "sSku", title: "商品sku" },
                    { field: "bizzOwner", title: "开发专员" },
                    { field: "stockLocation", title: "库位" },
                    { title: "商品名称", field: 'title',width: 200 },
                    { title: "入库要求", field: 'packDesc' },
                    { title: "<div id='totalSuttleWeight_subdetailList'></div>累计净重(g)", templet: '#totalWeight_subDetailList' },
                    { field: "style", title: "款式" }, !ifLock ? { title: "采购单价(￥)", templet: '#originCost_purOrderOffline' } : { field: 'originCost', title: "采购单价(￥)" },
                    { title: "当时同款最低价", templet: '#purOffline_oldLowestPriceBox' },
                    { title: "最新同款", templet: '#newLowestPriceBox_purOrderDetail' },
                    { title: "可用数量", templet: "<div>{{accSub(d.stockNum , d.reservationNum)}}</div>" },
                    { title: "未入库数量", templet: '<div>{{accSub(d.amount , (d.inAmount || 0))}}</div>' },
                    { title: "预计可用库存", templet: "<div>{{d.stockNum - d.reservationNum + d.orderNotInNum + d.lackReservationNum - d.lackUnPaiNum}}</div>" },
                    { field: "fiveSalesNum", title: "5/15/30天销量", templet: '#daylysSales_purchaseOrderOff' },
                    !ifLock ? { title: "<div id='amount_subdetailList'></div>采购数量", templet: '#buyerAmount_purOrderOffline' } : { field: 'amount', title: "<div id='amount_subdetailList'></div>采购数量" },
                    { title: "含税单价(￥)", field: 'taxPrice' },
                    { title: "<div id='totalMoney_subdetailList'></div>累计金额(￥)", templet: "#subTotalMoney_purOrderDetail" },
                    { title: "供应商", templet: "#subSupplierList_purOrderDetail" }, !ifLock ? { title: '操作', align: 'center', toolbar: '#purOrderDetailTable_bar', width: 60 } : { title: '操作', align: 'center', width: 60 }
                ]
            ],
            data: data,
            id: "layer_purhasetable",
            page: false,
            done: function() {
                imageLazyloadAll();
                // 绑定修改采购数量的方法
                setEventByselector('#purOrderDetailTable_orderInfo', '.amountInp_purOrderDetail', 'input propertychange', toSetBuyAmount)
                    // 绑定修改采购单价的方法
                setEventByselector('#purOrderDetailTable_orderInfo', '.originCostInp_purOrderDetail', 'input propertychange', toSetOriginCost)
                    // 绑定删除子表的方法
                setEventByselector('#purOrderDetailTable_orderInfo', '.deleteBtn_purOrderDetail', 'click', todeletePurOrderDetail)

                // 计算金额
                countTotalProdMoney()
                    // 计算数量
                countAmount_purchaseOrderOff()
                    // 计算预付款
                countPrevPayMoney_purchaseOrderOff()
                    // 设置表头固定
                $('#purOrderDetailTable_orderInfo').next('.layui-table-view').find('.layui-table-header').addClass('toFixedContain')
            },
            limit: data.length
        })
    }
    // 计算预付款
    countPrevPayMoney_purchaseOrderOff = function() {
        var logisticFee = $('#purOrderMainInfoForm_purchaseOrderOff [name=logisticFee]').val()
        if (!logisticFee || isNaN(logisticFee)) {
            logisticFee = 0
        }
        var totalProdMoney = $('#purOrderMainInfoForm_purchaseOrderOff [name=totalProdMoney]').val()
        var disCount = $('#purOrderMainInfoForm_purchaseOrderOff [name=discountMoney]').val()
        if (!disCount || isNaN(disCount)) {
            disCount = 0
        }
        var prevPayMoney = accSub(accAdd(logisticFee, totalProdMoney), disCount)
        $('#purOrderMainInfoForm_purchaseOrderOff [name=prevPayMoney]').val(prevPayMoney.toFixed(2))
    }

    function toSetOriginCost() {
        var currentTr = $(this).closest('tr')
        var index = currentTr.attr('data-index')
        var value = this.value
        if (!value) {
            purOrderDetailList_purchaseOrderOff[index].originCost = 0
        } else if (value && !(/^[0-9]+(.[0-9]{0,4})?$/.test(value))) {
            layer.msg('请输入正确金额')
            this.value = ''
            purOrderDetailList_purchaseOrderOff[index].originCost = 0
        } else {
            purOrderDetailList_purchaseOrderOff[index].originCost = parseFloat(value)
        }
        // 重新计算货物总金额
        countTotalProdMoney()
            // 重新渲染子表的含税单价和累计金额数据
        currentTr.find('.taxPrice_purOrderDetail').text(purOrderDetailList_purchaseOrderOff[index].taxPrice)
        currentTr.find('.subTotalMoney_purOrderDetail').text(accMul(purOrderDetailList_purchaseOrderOff[index].originCost, purOrderDetailList_purchaseOrderOff[index].amount).toFixed(2))
            // 重新计算预付款
        countPrevPayMoney_purchaseOrderOff()
    }

    // 计算总数量
    function countAmount_purchaseOrderOff() {
        var amount = 0;
        var totalWeight = 0;
        for (var i = 0; i < purOrderDetailList_purchaseOrderOff.length; ++i) {
            amount = accAdd(amount, purOrderDetailList_purchaseOrderOff[i].amount || 0)
            totalWeight = accAdd(totalWeight, purOrderDetailList_purchaseOrderOff[i].totalWeight || 0)
        }
        $('#amount_subdetailList').text(amount)
        $('#totalSuttleWeight_subdetailList').text(totalWeight)
    }

    // 设置采购数量
    function toSetBuyAmount() {
        var currentTr = $(this).closest('tr')
        var index = currentTr.attr('data-index')
        var value = this.value
        var currentTrWeight // 当前行总净重
        var allWeight // 所有商品总净重
        if (!value) {
            purOrderDetailList_purchaseOrderOff[index].amount = 0
            purOrderDetailList_purchaseOrderOff[index].totalWeight = 0
            purOrderDetailList_purchaseOrderOff[index].totalMoney = 0
        } else if (value && !(/^[0-9]*$/.test(value))) {
            layer.msg('请输入正整数')
            this.value = ''
            purOrderDetailList_purchaseOrderOff[index].amount = 0
            purOrderDetailList_purchaseOrderOff[index].totalWeight = 0
            purOrderDetailList_purchaseOrderOff[index].totalMoney = 0
            countTotalProdMoney()
            return
        } else {
            purOrderDetailList_purchaseOrderOff[index].amount = parseInt(value)
            purOrderDetailList_purchaseOrderOff[index].totalWeight = parseFloat(accMul(purOrderDetailList_purchaseOrderOff[index].suttleWeight, purOrderDetailList_purchaseOrderOff[index].amount).toFixed(2))
            purOrderDetailList_purchaseOrderOff[index].money = parseFloat(accMul(purOrderDetailList_purchaseOrderOff[index].originCost, purOrderDetailList_purchaseOrderOff[index].amount.toFixed(2)).toFixed(2))
        }
        // 重新计算货物总金额
        countTotalProdMoney()
            // 重新渲染累计金额
        currentTr.find('.subTotalMoney_purOrderDetail').text(purOrderDetailList_purchaseOrderOff[index].money)
        currentTr.find('.subTotalWeight_purOrderDetail').text(purOrderDetailList_purchaseOrderOff[index].totalWeight)
            // 重新计算预付款
        countPrevPayMoney_purchaseOrderOff()
            //计算总数量 和总重量
        countAmount_purchaseOrderOff()
    }

    // 删除子表
    function todeletePurOrderDetail() {
        var index = $(this).closest('tr').attr('data-index')
        var prodSId = purOrderDetailList_purchaseOrderOff[index].prodSId
        purOrderDetailList_purchaseOrderOff.splice(index, 1);
        // 重新渲染子表数据
        showSubTable(purOrderDetailList_purchaseOrderOff)
            // 重新计算预付款
        countPrevPayMoney_purchaseOrderOff()
            // 删除对应的sku的自动采购留言
        deleteAutoPurNote_purchaseOrderOff(prodSId)
    }

    // 计算货物金额
    function countTotalProdMoney() {
        if (!purOrderDetailList_purchaseOrderOff || purOrderDetailList_purchaseOrderOff.length == 0) {
            return
        }
        var totalProdMoney = 0;
        var subTotalMoney
        for (var i = 0; i < purOrderDetailList_purchaseOrderOff.length; ++i) {
            subTotalMoney = accMul(purOrderDetailList_purchaseOrderOff[i].originCost, purOrderDetailList_purchaseOrderOff[i].amount)
            totalProdMoney = accAdd(totalProdMoney, subTotalMoney)
        }
        $('#purOrderMainInfoForm_purchaseOrderOff [name=totalProdMoney]').val(totalProdMoney.toFixed(2))
        $('#totalMoney_subdetailList').text(totalProdMoney.toFixed(2))
    }

    // 组装数据，并进行数据校验
    function getData_purOrderMain() {
        if (!checkNotNull("#purOrderMainInfoForm_purchaseOrderOff")) {
            return false
        }
        if (!purOrderDetailList_purchaseOrderOff || purOrderDetailList_purchaseOrderOff.length == 0) {
            layer.msg("请填写采购明细")
            return false
        }

        // 校验采购数量填写
        for (var i = 0; i < purOrderDetailList_purchaseOrderOff.length; ++i) {
            if (!purOrderDetailList_purchaseOrderOff[i].amount) {
                layer.msg('sku: ' + purOrderDetailList_purchaseOrderOff[i].sSku + '的采购数量 请填写非零正整数')
                return false
            }
        }

        var data = serializeObject($('#purOrderMainInfoForm_purchaseOrderOff'))
        data.detailList = purOrderDetailList_purchaseOrderOff
        data.supplierName = $("#searchSupplier_purchaseOrderOffDetailForm").val()
        data.buyer = $("#purOrderMainInfoForm_purchaseOrderOff [name=buyerId] option:selected").text()
        data.storeName = $("#purOrderMainInfoForm_purchaseOrderOff [name=storeId] option:selected").text()
        data.orderType = 3
        data.ifBuySample = $("#purOrderMainInfoForm_purchaseOrderOff [name=ifBuySample]").prop('checked')
        return data
    }

    table.on('tool(purchaseOrderOff_table)', function(obj) {
        var layEvent = obj.event; //获得 lay-event 对应的值
        var data = obj.data; //获得当前行数据
        if (layEvent == 'detail') {
            var btnArr = []
            console.log(data)
            if (data.status) {
                btnArr = [ '保存', '关闭']
            } else {
                btnArr = [ '保存并同步给普源', '关闭']
            }
            var popIndex = layer.open({
                type: 1,
                title: "采购订单",
                id: "detailPop_purchaseOrderOff",
                area: ["98%", "70%"],
                btn: btnArr,
                maxmin: true,
                move: '.layui-layer-title',
                content: $("#purOrderDetailOff_pop").html(),
                success: function(layero, index) {
                    // 初始化控件
                    if (data.auditStatus < 0) {
                        componentInit()
                            // 初始化审核按钮
                        if ($('#ifCheck_produclist').length > 0) {
                            var $target = layero.find('.layui-layer-btn.layui-layer-btn-'),
                                $html = `<div class="layui-form-item layui-form" style="position:absolute;bottom:2px;width: 80%">
                                                <div class="layui-inline"  style="float: left;">
                                                    <button type="button" class="layui-btn layui-btn-sm layui-btn-normal" onclick="ajaxAuditpurchaseOrderOff(` + data.id + `)">审核</button>
                                                </div>
                                        </div>`;
                            $target.append($html);
                        }
                    }
                    // 查询原数据并初始化
                    formSelects.render('note_purchaseOrderOff_AddForm');
                    originDataInit_purOrderDetail(data.id)

                    // 操作日志初始化
                    $('#purOrderLogLab').show()
                    $('#purOrderLogLab').attr('data-id', data.id)
                    $('#purOrderLogLab').attr('data-init', '1')
                    $('#purOrderLogLab').click(function() {
                        var ifInit = $(this).attr('data-init')
                        if (ifInit == '2') {
                            return
                        }
                        table.render({
                            elem: "#purchaseOrderOffLogTab",
                            id: "purchaseOrderOffLogTab",
                            method: 'post',
                            url: ctx + "/purOrderMain/queryLogList.html",
                            where: { purOrderMainId: data.id },
                            cols: [
                                [
                                    { title: "时间", width: 150, templet: '<div>{{format(d.createTime, "yyyy-MM-dd hh:mm:ss")}}</div>' },
                                    { field: "creator", title: "操作人", width: 100 },
                                    { title: "操作类型", templet: '#operType_purOrderLog', width: 150 },
                                    { field: "operDesc", title: "操作详情" },
                                ]
                            ],
                            page: false,
                            width: '100%',
                            done: function(res, curr, count) {
                                // 标记已经初始化操作日志
                                $('#purOrderLogLab').attr('data-init', '2');
                            }
                        })
                    })

                    // 固定表头
                    $('#detailPop_purchaseOrderOff').scroll(function() {
                        toFixedTabHead(this)
                    })
                },
                yes: function() {
                    var Adata = getData_purOrderMain();
                    if (!Adata) {
                        return
                    }
                    Adata.id = data.id
                    Adata.logisticFee = Adata.logisticFee || 0
                    Adata.discountMoney = Adata.discountMoney || 0
                    Adata.prevPayMoney = Adata.prevPayMoney || 0

                    // if (data.auditStatus == 0 && ((Adata.purAcctId && !Adata.purReceiveAddressId) || (Adata.purReceiveAddressId && !Adata.purAcctId))) {
                    //     layer.msg('采购账号和收货地址必须同时指定，否则请不要选择，会自动使用默认账号和收货地址')
                    //     return
                    // }
                    // 提交修改
                    loading.show()
                    $.ajax({
                        url: ctx + "/purOrderMain/addOrUpdPurOrderMain.html",
                        type: 'POST',
                        dataType: "json",
                        contentType: 'application/json',
                        data: JSON.stringify(Adata),
                        success: function(data) {
                            if (data.code == '0000') {
                                layer.close(popIndex)
                                active_purchaseOrderOff.reloadWithoutFresh()
                                layer.msg('修改成功')
                            } else {
                                layer.msg(data.msg)
                            }
                        },
                        complete: function() {
                            loading.hide()
                        }
                    })

                }
            })
        } else if (layEvent == 'delete') {
            var idList = [data.id]
            var confirmIndex = layer.confirm('确认作废这个采购订单吗', { btn: ['确认', '取消'] },
                function() {
                    loading.show()
                    $.ajax({
                        url: ctx + "/purchaseOff/cancelOrder.html",
                        type: 'POST',
                        dataType: "json",
                        contentType: "application/json;charset=utf-8",
                        data: JSON.stringify({ idList: idList }),
                        success: function(res) {
                            if (res.code == '0000') {
                                layer.msg("作废成功")
                                active_purchaseOrderOff.reload()
                            } else {
                                layer.alert(res.msg)
                                active_purchaseOrderOff.reload()
                            }
                        },
                        complete: function() {
                            loading.hide()
                        }
                    })
                },
                function() {
                    layer.close(confirmIndex)
                })
        } else if (layEvent == 'createstockin') {
            var billNumber = data.billNumber;//生成采购入库单
            stockinorder_add_btn_fun(billNumber);
        } else if (layEvent == 'refund') {
            var index = layer.open({
                type: 1,
                title: "申请退款",
                area: ["35%", '35%'],
                shadeClose: false,
                btn: ['确认', '关闭'],
                content: $("#refundRequirePop_purchaseOrderOff").html(),
                success: function(index, layero) {
                    initNotNull('#refundRequireForm')
                        // 初始化原退款数据
                    initRefundInfo(data.id, true)

                    form.render('select', 'refundRequireForm')
                },
                yes: function() {
                    if (!checkNotNull('#refundRequireForm')) {
                        return
                    }
                    var Adata = serializeObject($('#refundRequireForm'))
                    Adata.id = data.id
                    loading.show()
                    $.ajax({
                        url: ctx + "/purOrderMain/requireRefund.html",
                        type: 'POST',
                        dataType: "json",
                        contentType: "application/json;charset=utf-8",
                        data: JSON.stringify(Adata),
                        success: function(res) {
                            loading.hide()
                            if (res.code == '0000') {
                                layer.close(index)
                                layer.msg('申请成功')
                                active_purchaseOrderOff.reloadWithoutFresh()
                            } else {
                                layer.msg(res.msg)
                            }
                        },
                        error: function() {
                            loading.hide()
                            layer.msg('服务器繁忙，请稍后再试')
                        }
                    })
                }
            })
        } else if (layEvent == 'pullInvalid') {
            var index = layer.open({
                type: 1,
                title: "订单归档",
                area: ["35%", '60%'],
                shadeClose: false,
                btn: ['保存不归档', '归档', '关闭'],
                content: $("#pullInvalidPop_purchaseOrderOff").html(),
                success: function(index, layero) {
                    // 初始化退款数据
                    initRefundInfo(data.id,false,true)
                    // 判断是否1688订单，不是则允许编辑实际退款金额
                    if (!data.ali1688OrderNo || !data.ali1688OrderNo.trim()) {
                        $('#pullInvalidForm [name=aliReceiveRefund]').removeAttr('disabled')
                        $('#pullInvalidForm [name=aliReceiveRefund]').removeClass('gredBack')
                    }

                    initNotNull('#pullInvalidForm')
                    form.render('select', 'pullInvalidForm')
                },
                yes: function() {
                    if (!checkNotNull('#pullInvalidForm')) {
                        return
                    }
                    var Adata = serializeObject($('#pullInvalidForm'))
                    Adata.id = data.id
                    Adata.status = false
                    ajaxToPullInvalid(Adata)
                },
                btn2: function () {
                    if (!checkNotNull('#pullInvalidForm')) {
                        return
                    }
                    var Adata = serializeObject($('#pullInvalidForm'))
                    Adata.id = data.id
                    Adata.status = true
                    ajaxToPullInvalid(Adata)
                }
            })
        } else if (layEvent == 'cancelPullInvalid') {
            var confirmIndex = layer.confirm('确认取消该订单归档吗？', { btn: ['确认', '取消'] }, function() {
                loading.show()
                var Adata = {
                    id: data.id
                }
                $.ajax({
                    url: ctx + "/purOrderMain/cancelPullInvalid.html",
                    type: 'POST',
                    dataType: "json",
                    contentType: "application/json;charset=utf-8",
                    data: JSON.stringify(Adata),
                    success: function(res) {
                        loading.hide()
                        layer.close(confirmIndex)
                        if (res.code == '0000') {
                            layer.msg('取消归档成功')
                            active_purchaseOrderOff.reloadWithoutFresh()
                        } else {
                            layer.msg(res.msg)
                        }
                    },
                    error: function() {
                        loading.hide()
                        layer.msg('服务器繁忙，请稍后再试')
                    }
                })
            })
        }
        else  if (layEvent == 'pullInvalidDetail') {
            var index = layer.open({
                type: 1,
                title: "归档详情",
                area: ["35%", '60%'],
                shadeClose: false,
                btn: ['关闭'],
                content: $("#pullInvalidPop_purchaseOrderOff").html(),
                success: function(index, layero) {
                    // 初始化退款数据
                    initRefundInfo(data.id,false,false)
                    $('#pullInvalidForm [name=pullInvalidTypeInp]').val()
                }
            })
        }
        else if (layEvent == 'cancelRefund') {
            var confirmIndex = layer.confirm('确认取消该订单退款吗？', { btn: ['确认', '取消'] }, function() {
                loading.show()
                var Adata = {
                    id: data.id
                }
                $.ajax({
                    url: ctx + "/purOrderMain/cancelRefund.html",
                    type: 'POST',
                    dataType: "json",
                    contentType: "application/json;charset=utf-8",
                    data: JSON.stringify(Adata),
                    success: function(res) {
                        loading.hide()
                        layer.close(confirmIndex)
                        if (res.code == '0000') {
                            layer.msg('取消退款成功')
                            active_purchaseOrderOff.reloadWithoutFresh()
                        } else {
                            layer.msg(res.msg)
                        }
                    },
                    error: function() {
                        loading.hide()
                        layer.msg('服务器繁忙，请稍后再试')
                    }
                })
            })
        }
        else if (layEvent == 'confirmRefund') {
            var index = layer.open({
                type: 1,
                title: "确认退款申请",
                area: ["35%", '60%'],
                shadeClose: false,
                btn: ['确认', '关闭'],
                content: $("#pullInvalidPop_purchaseOrderOff").html(),
                success: function (index, layero) {
                    // 初始化退款数据
                    initRefundInfo(data.id,true)
                    // 隐藏归档参数
                    $('#pullInvalidForm [name=aliReceiveRefund]').closest('.layui-form-item').hide()
                    $('#pullInvalidForm [name=pullInvalidType]').closest('.layui-form-item').hide()
                    $('#pullInvalidForm [name=pullInvalidRemark]').closest('.layui-form-item').hide()
                },
                yes: function () {
                        loading.show()
                        var Adata = {
                            id: data.id
                        }
                        $.ajax({
                            url: ctx + "/purOrderMain/confirmRefund.html",
                            type: 'POST',
                            dataType: "json",
                            contentType: "application/json;charset=utf-8",
                            data: JSON.stringify(Adata),
                            success: function(res) {
                                loading.hide()
                                layer.close(confirmIndex)
                                if (res.code == '0000') {
                                    layer.msg('确认退款申请成功')
                                    layer.close(index)
                                    active_purchaseOrderOff.reload()
                                } else {
                                    layer.msg(res.msg)
                                }
                            },
                            error: function() {
                                loading.hide()
                                layer.msg('服务器繁忙，请稍后再试')
                            }
                        })
                }
            })
        }
    })

    function ajaxToPullInvalid(Adata) {
        loading.show()
        $.ajax({
            url: ctx + "/purOrderMain/pullInvalid.html",
            type: 'POST',
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify(Adata),
            success: function(res) {
                loading.hide()
                if (res.code == '0000') {
                    layer.closeAll()
                    if (Adata.status) {
                        layer.msg('归档成功')
                    } else {
                        layer.msg('保存成功')
                    }
                    active_purchaseOrderOff.reloadWithoutFresh()
                } else {
                    layer.msg(res.msg)
                }
            },
            error: function() {
                loading.hide()
                layer.msg('服务器繁忙，请稍后再试')
            }
        })
    }

    function initRefundInfo(id, ifRefundPop, changeAble_pullinvalid) {
        loading.show()
        var Adata = {
            id: id
        }
        $.ajax({
            url: ctx + "/purOrderMain/getRefundInfo.html",
            type: 'POST',
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify(Adata),
            success: function(res) {
                loading.hide()
                if (res.code == '0000') {
                    var pojo = res.data
                    if (pojo && pojo.refundInfo) {
                        if (ifRefundPop) { // 退款详情展示
                            $('#refundRequireForm [name=refundReason]').val(pojo.refundInfo.refundReason)
                            $('#refundRequireForm [name=requireRefund]').val(pojo.refundInfo.requireRefund)
                            $('#refundRequireForm [name=refundAmout]').val(pojo.refundInfo.refundAmout)
                            $('#refundRequireForm [name=refundLogisticNo]').val(pojo.refundInfo.refundLogisticNo)
                            $('#refundRequireForm [name=refundRemark]').val(pojo.refundInfo.refundRemark)
                        } else {
                            $('#pullInvalidForm [name=refundReason]').val(pojo.refundInfo.refundReason)
                            $('#pullInvalidForm [name=requireRefund]').val(pojo.refundInfo.requireRefund)
                            $('#pullInvalidForm [name=refundAmout]').val(pojo.refundInfo.refundAmout)
                            $('#pullInvalidForm [name=refundLogisticNo]').val(pojo.refundInfo.refundLogisticNo)
                            $('#pullInvalidForm [name=refundRemark]').val(pojo.refundInfo.refundRemark)
                            $('#pullInvalidForm [name=aliReceiveRefund]').val(pojo.aliReceiveRefund)
                            $('#pullInvalidForm [name=pullInvalidType]').val(pojo.refundInfo.pullInvalidType)
                            $('#pullInvalidForm [name=pullInvalidTypeInp]').val(pojo.refundInfo.pullInvalidType)
                            $('#pullInvalidForm [name=pullInvalidRemark]').val(pojo.refundInfo.pullInvalidRemark)
                        }
                    }
                    if (ifRefundPop) {
                        form.render('select', 'refundRequireForm')
                    }
                    if (!changeAble_pullinvalid) {
                        $('#pullInvalidForm [name=pullInvalidTypeInp]').show()
                        $('#pullInvalidForm [name=pullInvalidRemark]').addClass('gredBack')
                        $('#pullInvalidForm [name=pullInvalidRemark]').attr('disabled','disabled')
                    } else {
                        form.render('select', 'pullInvalidForm')
                    }
                } else {
                    layer.msg(res.msg)
                }
            },
            error: function() {
                loading.hide()
                layer.msg('服务器繁忙，请稍后再试')
            }
        })
    }

    // 批量修改
    $('#updatePurOrderByListBtn_purchaseOrderOff').click(function() {
        var checkStatus = table.checkStatus('purchaseOrderOff_table'),
            data = checkStatus.data;
        if (!data || data.length == 0) {
            layer.msg('请选择采购订单')
            return
        }
        var idList = []
        for (var i = 0; i < data.length; ++i) {
            idList.push(data[i].id)
        }
        var updateListPopIndex = layer.open({
            type: 1,
            title: "批量修改",
            area: ["80%", "70%"],
            btn: ['提交', '关闭'],
            shadeClose: false,
            content: $("#updateListPop_purchaseOrderOff").html(),
            success: function(layero, index) {
                form.render('select', 'updateListForm_purOrderMain')
            },
            yes: function() {
                var purOrderMain = {
                    buyerId: $("#updateListForm_purOrderMain [name=buyerId]").val(),
                    buyer: $("#updateListForm_purOrderMain [name=buyerId] option:selected").text(),
                    purOrgId: $("#updateListForm_purOrderMain [name=purOrgId]").val()
                }
                checkNull(purOrderMain)
                if (!purOrderMain.buyerId && !purOrderMain.buyer && !purOrderMain.purOrgId) {
                    layer.msg('未做任何修改')
                    return
                }
                loading.show()
                $.ajax({
                    url: ctx + "/purOrderMain/updateByIdList.html",
                    type: 'POST',
                    dataType: "json",
                    contentType: "application/json;charset=utf-8",
                    data: JSON.stringify({ idList: idList, purOrderMain: purOrderMain }),
                    success: function(res) {
                        if (res.code == '0000') {
                            layer.msg("修改成功")
                            layer.close(updateListPopIndex)
                            active_purchaseOrderOff.reloadWithoutFresh()
                        } else {
                            layer.msg(res.msg)
                        }
                    },
                    complete: function() {
                        loading.hide()
                    }
                })
            }
        })

    })

    ajaxAuditpurchaseOrderOff = function(idList) {
        if (!Array.isArray(idList)) {
            idList = [idList]
        }
        var confirmIndex = layer.confirm('确认采购订单审核通过吗', { btn: ['确认', '取消'] },
            function() {
                loading.show()
                $.ajax({
                    url: ctx + "/purOrderMain/auditPurOrderByIdList.html",
                    type: 'POST',
                    dataType: "json",
                    contentType: "application/json;charset=utf-8",
                    data: JSON.stringify({ idList: idList }),
                    success: function(res) {
                        if (res.code == '0000') {
                            layer.msg("审核成功")
                            active_purchaseOrderOff.reload()
                        } else {
                            layer.alert(res.msg)
                        }
                    },
                    complete: function() {
                        loading.hide()
                        layer.close(confirmIndex)
                    }
                })
            },
            function() {
                layer.close(confirmIndex)
            })
    }

    ajaxCancelAuditpurchaseOrderOff = function(idList) {
        if (!Array.isArray(idList)) {
            idList = [idList]
        }
        var confirmIndex = layer.confirm('确认取消审核吗', { btn: ['确认', '取消'] },
            function() {
                loading.show()
                $.ajax({
                    url: ctx + "/purOrderMain/cancelAuditPurOrderByIdList.html",
                    type: 'POST',
                    dataType: "json",
                    contentType: "application/json;charset=utf-8",
                    data: JSON.stringify({ idList: idList }),
                    success: function(res) {
                        if (res.code == '0000') {
                            layer.alert("取消审核成功。但仍然需要前往店铺精灵系统，对这些订单进行取消审核操作")
                            active_purchaseOrderOff.reload()
                        } else {
                            layer.alert(res.msg)
                        }
                    },
                    complete: function() {
                        loading.hide()
                        layer.close(confirmIndex)
                    }
                })
            },
            function() {
                layer.close(confirmIndex)
            })
    }

    // 批量作废
    $("#disablePurOrderBtn_purchaseOrderOff").click(function() {
        var checkStatus = table.checkStatus('purchaseOrderOff_table'),
            data = checkStatus.data;
        if (!data || data.length == 0) {
            layer.msg('请选择采购订单')
            return
        }
        var idList = []
        for (var i = 0; i < data.length; ++i) {
            idList.push(data[i].id)
        }
        var confirmIndex = layer.confirm('确认作废这些采购订单吗', { btn: ['确认', '取消'] },
            function() {
                loading.show()
                $.ajax({
                    url: ctx + "/purchaseOff/cancelOrder.html",
                    type: 'POST',
                    dataType: "json",
                    contentType: "application/json;charset=utf-8",
                    data: JSON.stringify({ idList: idList }),
                    success: function(res) {
                        if (res.code == '0000') {
                            layer.msg("作废成功")
                            active_purchaseOrderOff.reload()
                        } else {
                            layer.alert(res.msg)
                            active_purchaseOrderOff.reload()
                        }
                    },
                    complete: function() {
                        loading.hide()
                    }
                })
            },
            function() {
                layer.close(confirmIndex)
            })
    })

    // 查询订单详情
    function originDataInit_purOrderDetail(id) {
        loading.show()
        $.ajax({
            url: ctx + "/purOrderMain/getPurOrderDetailById.html",
            type: 'POST',
            dataType: "json",
            data: { id: id },
            success: function(data) {
                if (data.code == '0000') {
                    var orderMainDto = data.data
                    for (var key in orderMainDto) {
                        $("#purOrderMainInfoForm_purchaseOrderOff [name=" + key + "]").val(orderMainDto[key])
                    }
                    // 制单时间、到货日期format
                    $("#purOrderMainInfoForm_purchaseOrderOff [name=createTime]").val(format(orderMainDto.createTime, 'yyyy-MM-dd hh:mm:ss'))
                    $("#purOrderMainInfoForm_purchaseOrderOff [name=delivDay]").val(format(orderMainDto.delivDay, 'yyyy-MM-dd'))

                    // 如果已经创建1688订单，不可编辑买家留言
                    if (orderMainDto.ali1688OrderNo) {
                        $("#purOrderMainInfoForm_purchaseOrderOff [name=purNote]").attr('readonly', 'readonly')
                        $("#purOrderMainInfoForm_purchaseOrderOff [name=purNote]").addClass('gredBack')
                    }

                    // 赋值内部标签
                    var noteList = orderMainDto.note ? orderMainDto.note.split(',') : []
                    if (noteList.length > 0) {
                        formSelects.value('note_purchaseOrderOff_AddForm', noteList)
                    }

                    $('#purOrderMainInfoForm_purchaseOrderOff [name=ifBuySample]').prop('checked',orderMainDto.ifBuySample)

                    purOrderDetailList_purchaseOrderOff = orderMainDto.detailList
                    $("#searchSupplier_purchaseOrderOffDetailForm").val(orderMainDto.supplierName)
                    if (orderMainDto.auditStatus >= 0) {
                        showSubTable(purOrderDetailList_purchaseOrderOff, true)
                        for (var key in orderMainDto) {
                            $("#purOrderMainInfoForm_purchaseOrderOff [data-name=" + key + "]").val(orderMainDto[key])
                        }
                        $("#purOrderMainInfoForm_purchaseOrderOff [data-name=delivDay]").val(format(orderMainDto['delivDay'],'yyyy-MM-dd'))
                        $("#purOrderMainInfoForm_purchaseOrderOff [name]:not(span)").hide()
                        $("#purOrderMainInfoForm_purchaseOrderOff [data-name]").show()
                        $('#searchSupplier_purchaseOrderOffDetailForm').hide()
                        $("#purOrderMainInfoForm_purchaseOrderOff [name=memo]").show()
                        setValueFoeSelectInp_purchaseOrderOff('#purOrderMainInfoForm_purchaseOrderOff', 'storeId', orderMainDto.storeId)
                        setValueFoeSelectInp_purchaseOrderOff('#purOrderMainInfoForm_purchaseOrderOff', 'purOrgId', orderMainDto.purOrgId)
                        setValueFoeSelectInp_purchaseOrderOff('#purOrderMainInfoForm_purchaseOrderOff', 'buyerId', orderMainDto.buyerId)
                        setValueFoeSelectInp_purchaseOrderOff('#purOrderMainInfoForm_purchaseOrderOff', 'avgType', orderMainDto.avgType)
                        setValueFoeSelectInp_purchaseOrderOff('#purOrderMainInfoForm_purchaseOrderOff', 'payType', orderMainDto.payType)
                        setValueFoeSelectInp_purchaseOrderOff('#purOrderMainInfoForm_purchaseOrderOff', 'purAcctId', orderMainDto.purAcctId)
                        setValueFoeSelectInp_purchaseOrderOff('#purOrderMainInfoForm_purchaseOrderOff', 'receiverId', orderMainDto.receiverId)
                        setValueFoeSelectInp_purchaseOrderOff('#purOrderMainInfoForm_purchaseOrderOff', 'purReceiveAddressId', orderMainDto.purReceiveAddressId)

                        // 设置 淘宝订单  checkbox disabled
                        $('#purOrderMainInfoForm_purchaseOrderOff [name=orderType]').attr('disabled','disabled')
                        // 如果为未接单，允许修改物流费
                        if (orderMainDto.auditStatus == 0) {
                            $('#purOrderMainInfoForm_purchaseOrderOff [name=logisticFee]').show();
                            $('#purOrderMainInfoForm_purchaseOrderOff [data-name=logisticFee]').hide();
                        }
                        form.render('select', 'inside_tagFilter')
                    } else {
                        showSubTable(purOrderDetailList_purchaseOrderOff)
                        // 初始化可选收件人
                        initReceiverOption_purchaseOrderOff(orderMainDto.buyerId)
                        $('#purOrderMainInfoForm_purchaseOrderOff [name=receiverId]').val(orderMainDto.receiverId)
                        $('#purOrderMainInfoForm_purchaseOrderOff [name=purReceiveAddressId]').val(orderMainDto.purReceiveAddressId)
                        form.render("select", "purOrderMainInfoForm_purchaseOrderOff")
                    }
                    form.render('checkbox', 'purOrderMainInfoForm_purchaseOrderOff')
                } else {
                    layer.msg(data.msg)
                }
            },
            complete: function() {
                loading.hide()
            }
        })
    }

    setValueFoeSelectInp_purchaseOrderOff = function(formSelect, name, value) {
        var form = $(formSelect)
        var val = form.find('[name=' + name + '] option[value=' + value + ']').text()
        form.find('[data-name=' + name + ']').val(val)
    }

    table.on('tool(multiPayUrlTable_purchaseOrderOff)', function(obj) {
        var layEvent = obj.event; //获得 lay-event 对应的值
        var data = obj.data; //获得当前行数据
        if (layEvent == 'showDetail') {
            layer.alert(data.subBillNumberList.join(','));
        }
    })

    // // 标记加急
    // $('#speedOrderBtn_purchaseOrderOff').click(function() {
    //     var checkStatus = table.checkStatus('purchaseOrderOff_table'),
    //         data = checkStatus.data;
    //     if (!data || data.length == 0) {
    //         layer.msg('请选择采购订单')
    //         return
    //     }
    //     var idList = []
    //     for (var i = 0; i < data.length; ++i) {
    //         idList.push(data[i].id)
    //     }
    //     var confirmIndex = layer.confirm('确认加急/取消加急这些采购订单吗？', function() {
    //             loading.show()
    //             $.ajax({
    //                 url: ctx + "/purOrderMain/speedOrderByList.html",
    //                 type: 'POST',
    //                 dataType: "json",
    //                 contentType: "application/json;charset=utf-8",
    //                 data: JSON.stringify({ idList: idList }),
    //                 success: function(res) {
    //                     loading.hide()
    //                     layer.close(confirmIndex)
    //                     if (res.code == '0000') {
    //                         layer.msg('加急成功')
    //                         active_purchaseOrderOff.reloadWithoutFresh()
    //                     } else {
    //                         layer.msg(res.msg)
    //                     }
    //                 },
    //                 complete: function() {
    //                     loading.hide()
    //                 }
    //             })
    //         },
    //         function() {
    //             layer.close(confirmIndex)
    //         }
    //     )
    // })

    // 导出采购订单
    $("#exportPurOrderBtn_purchaseOrderOff").click(function() {
        var checkStatus = table.checkStatus('purchaseOrderOff_table'),
            selecteddata = checkStatus.data;
        var idList = []
        for (var i = 0; i < selecteddata.length; ++i) {
            idList.push(selecteddata[i].id)
        }

        var outerIndex = layer.open({
            title: '导出采购订单',
            type: 1, //不加该属性,就会出现[object Object]
            area: ['1000px', '600px'],
            id: 'exportPurMainInfoPop',
            btn: ['确定', '关闭'],
            content: $('#purchaseOrderOff_exportPurMainInfoPop').html(),
            success: function() {
                form.on('checkbox(selectAll_exportPurMainInfo_purchaseOrderOff)', function(data) {
                    var checked = data.elem.checked
                    $('#exportPurMainInfoForm_purchaseOrderOff input[type=checkbox]:enabled').prop('checked', checked)
                    form.render('checkbox')
                })
                form.render('checkbox')
            },
            yes: function() {
                var data = serializeObject($('#exportPurMainInfoForm_purchaseOrderOff'))
                var searchParam = getSerachData_purchaseOrderOff()
                searchParam.ifOffLine = true
                searchParam.ifPullInvalid = searchParam.ifPullInvalid == '1'
                var stockInStatusList = []
                var checkedStockInStatus = $('#stockInStatusForm_purchaseOrderOff [name=stockInStatus]:checked')
                for (var i = 0; i < checkedStockInStatus.length; ++i) {
                    stockInStatusList.push(parseInt(checkedStockInStatus[i].value))
                }
                searchParam.stockInStatusListStr = stockInStatusList.join(',')
                checkNull(searchParam)
                data.searchParam = JSON.stringify(searchParam)
                data.idList = idList.join(',')
                var Confirmindex = layer.confirm('确认导出当前搜索条件下的采购订单？', { btn: ['确认', '取消'] }, function() {
                    layer.alert('如果导出数据量大，需要几分钟处理数据，请不要关闭和操作网页，后台正在进行导出文件')
                    submitForm(data, ctx + '/purOrderMain/exportMainInfo.html')
                    layer.close(outerIndex);
                }, function() {
                    layer.close(Confirmindex);
                })
            }
        })
    })

    // 导出采购订单详情
    $("#exportPurOrderDetailBtn_purchaseOrderOff").click(function() {
        var checkStatus = table.checkStatus('purchaseOrderOff_table'),
            selecteddata = checkStatus.data;
        var idList = []
        for (var i = 0; i < selecteddata.length; ++i) {
            idList.push(selecteddata[i].id)
        }

        var outerIndex = layer.open({
            title: '导出订单详情',
            type: 1, //不加该属性,就会出现[object Object]
            area: ['1000px', '600px'],
            id: 'exportPurMainInfoPop',
            btn: ['确定', '关闭'],
            content: $('#purchaseOrderOff_exportPurDetailInfoPop').html(),
            success: function() {
                form.on('checkbox(selectAll_exportPurDetailInfo_purchaseOrderOff)', function(data) {
                    var checked = data.elem.checked
                    $('#exportPurDetailInfoForm_purchaseOrderOff input[type=checkbox]:enabled').prop('checked', checked)
                    form.render('checkbox')
                })
                form.render('checkbox')
            },
            yes: function() {
                var data = serializeObject($('#exportPurDetailInfoForm_purchaseOrderOff'))
                var searchParam = getSerachData_purchaseOrderOff()
                searchParam.ifOffLine = true
                searchParam.ifPullInvalid = searchParam.ifPullInvalid == '1'
                var stockInStatusList = []
                var checkedStockInStatus = $('#stockInStatusForm_purchaseOrderOff [name=stockInStatus]:checked')
                for (var i = 0; i < checkedStockInStatus.length; ++i) {
                    stockInStatusList.push(parseInt(checkedStockInStatus[i].value))
                }
                searchParam.stockInStatusListStr = stockInStatusList.join(',')
                checkNull(searchParam)
                data.searchParam = JSON.stringify(searchParam)
                data.idList = idList.join(',')

                var Confirmindex = layer.confirm('确认导出当前搜索条件下的采购订单？', { btn: ['确认', '取消'] }, function() {
                    layer.alert('如果导出数据量大，需要几分钟处理数据，请不要关闭和操作网页，后台正在进行导出文件')
                    submitForm(data, ctx + '/purOrderMain/exportDetailInfo.html')
                    layer.close(outerIndex);
                }, function() {
                    layer.close(Confirmindex);
                })
            }
        })
    })

    $('#addPurOrderByExcelBtn').click(function() {
        $('#fileForAddByExcel_purchaseOrderOff').click()
    })

    $('#fileForAddByExcel_purchaseOrderOff').on('change', function() {
        var files = $('#fileForAddByExcel_purchaseOrderOff')[0].files
            // 如果没有文件则终止
        if (files.length == 0) {
            return
        }
        // 校验文件类型
        var fileName = files[0].name
        var seat = fileName.lastIndexOf(".");
        var extension = fileName.substring(seat).toLowerCase();
        if (extension != '.xlsx' && extension != '.xls') {
            $('#fileForAddByExcel_purchaseOrderOff').val('')
            layer.msg('请传入后缀为.xlsx或者.xls 的Excel文件')
            return
        }
        var formData = new FormData();
        formData.append("file", files[0]);
        var confirmIndex = layer.confirm('确认导入这个文件进行批量新增采购订单吗', { btn: ['确认', '取消'] },
            function() {
                loading.show()
                $.ajax({
                    url: ctx + '/purOrderMain/addByExcel.html',
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
                        $('#fileForAddByExcel_purchaseOrderOff').val('')
                        if (data.code == '0000') {
                            // 清空 excel
                            var processData = {
                                processId: data.data.processId,
                                total: data.data.total,
                                redisKeyCode: data.data.redisKeyCode
                            }

                            function succReback(data) {
                                layer.msg("处理完毕");
                            }
                            if (processData.processId) {
                                processBegin(ctx + '/product/queryProcess.html', JSON.stringify(processData), '正在处理数据', 3000, succReback)
                            }
                            layer.msg("上传成功");
                        } else {
                            layer.msg(data.msg)
                        }
                    },
                    error: function() {
                        loading.hide()
                        $('#fileForAddByExcel_purchaseOrderOff').val('')
                    }
                });
            },
            function() {
                layer.closeAll()
            }
        )
    })

    $("#downTemplate_addByExcel_purchaseOrderOff").click(function() {
        window.location.href = ctx + '/static/templet/addpurchaseOrderTemplate.xls'
    })
    // 同步给pms
    $('#syncToPms_purchaseOrderOff').click(function () {
        var checkStatus = table.checkStatus('purchaseOrderOff_table'),
            data = checkStatus.data;
        if (!data || data.length == 0) {
            layer.msg('请选择采购订单')
            return
        }
        var idList = []
        for (var i = 0; i < data.length; ++i) {
            idList.push(data[i].id)
        }
        var confirmIndex = layer.confirm('同步之后将不可修改采购详情，确认同步这些采购订单给pms系统吗？', function() {
                loading.show()
                $.ajax({
                    url: ctx + "/purchaseOff/syncToPms.html",
                    type: 'POST',
                    dataType: "json",
                    contentType: "application/json;charset=utf-8",
                    data: JSON.stringify({ idList: idList }),
                    success: function(res) {
                        loading.hide()
                        layer.close(confirmIndex)
                        if (res.code == '0000') {
                            layer.msg('同步成功')
                            active_purchaseOrderOff.reloadWithoutFresh()
                        } else {
                            layer.msg(res.msg)
                        }
                    },
                    complete: function() {
                        loading.hide()
                    }
                })
            },
            function() {
                layer.close(confirmIndex)
            }
        )
    })

});
// -- 预加载 end

// tip展现生成1688订单失败原因
function showCreate1688FailReason(tip, self) {
    var layer = layui.layer
    var index = layer.tips(tip, self, { tips: [1, 'orange'] })
    $(self).attr('data-tipId', index)
}
// 去掉tip
function removeFailReasonTip(self) {
    var index = $(self).attr('data-tipId')
    if (index) {
        layui.layer.close(index)
    }
}

function getLogisticArr(logisticStr) {
    if (logisticStr) {
        return logisticStr.split(',')
    }
    return []
}