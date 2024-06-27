var winitstockinorder_removeCase,winitstockinorder_caseWeightInp,winitstockinorder_firstWayCompanyList,WinitStockInOrder_materialCoefficient
layui.use(['form', 'admin', 'table', 'layer', 'element', 'laypage', 'laydate', 'formSelects'], function() {
    let form = layui.form,
        table = layui.table,
        element = layui.element,
        laydate = layui.laydate,
        formSelects = layui.formSelects,
        layer = layui.layer;
    formSelects.render('winitstockinorder_firstWayTypeBox')
    formSelects.render('winitstockinorder_deliverStatusListStr')
    form.render('select');
    form.render('checkbox');
    laydate.render({
        elem: '#winitstockinorder_time',
        type: 'date',
        range: true
    });

    // 初始化货代公司选项
    function winitstockinorder_initGoodsCompany() {
        if (!winitstockinorder_firstWayCompanyList) {
            winitstockinorder_initFirstWayType()
        }
        console.log(winitstockinorder_firstWayCompanyList)
        let goodsCompanyJSON = {}
        for (let i = 0; i < winitstockinorder_firstWayCompanyList.length; ++i) {
            if (winitstockinorder_firstWayCompanyList[i].agent) {
                goodsCompanyJSON[winitstockinorder_firstWayCompanyList[i].agent] = 1
            }
        }
        let optionHtml = '<option></option>'
        for (let key in goodsCompanyJSON) {
            optionHtml += '<option value="'+ key +'">'+ key +'</option>'
        }
        $('#winitstockinorder_goodsCompanySel').append(optionHtml)
        form.render('select','winitstockinorder_goodsCompanyDiv')
    }

    form.on('select(winitstockinorder_goodsCompanySel)',function (target) {
        let searchForm = $('#winitstockinorderForm')
        let firstWayCompanyIdSel = searchForm.find('[name=firstWayCompanyIdListStr]')
        let arr = winitstockinorder_getFirstWayCompanyListByAgent(target.value)
        formSelects.data('winitstockinorder_firstWayTypeBox','local',{arr: arr})
    })

    function winitstockinorder_getFirstWayCompanyListByAgent(agent) {
        let arr =[]
        if (agent) {
            for (let i = 0; i < winitstockinorder_firstWayCompanyList.length; ++i) {
                if (agent === winitstockinorder_firstWayCompanyList[i].agent) {
                    arr.push({
                        name: winitstockinorder_firstWayCompanyList[i].name,
                        value: winitstockinorder_firstWayCompanyList[i].id
                    })
                }
            }
        } else {
            for (let i = 0; i < winitstockinorder_firstWayCompanyList.length; ++i) {
                arr.push({
                    name: winitstockinorder_firstWayCompanyList[i].name,
                    value: winitstockinorder_firstWayCompanyList[i].id
                })
            }
        }
        return arr
    }

    function winitstockinorder_initFirstWayType () {
        let ajax = new Ajax(false)
        ajax.post({
            url: ctx + '/winitDeliverGoodsPlan/getFirstWayCompanyList.html',
            success: function (res) {
                if (res.code === '0000') {
                    winitstockinorder_firstWayCompanyList = res.data
                    winitstockinorder_initGoodsCompany()
                } else {
                    layer.msg('初始化头程方式失败: ' + res.msg)
                }
            }
        })
    }
    winitstockinorder_initFirstWayType()


    // 人员选择
    render_hp_orgs_users("#winitstockinorderForm",function () {
        formSelects.render('winitstockinorder_saler');
    });
    // 清空按钮事件
    $("#winitstockinorder_searchReset").click(function() {
        let searchForm = $('#winitstockinorderForm');
        searchForm.find('[name]:not(.hiddenContent)').val('');
        $("#winitstockinorder_search_cate").html('');
        form.render('select','winitstockinorderForm')
    });

    // 限制查询sku 条件输入长度
    form.on('select(skuTypeSelect_winitstockinorder)', function(data){
        let value = data.value;
        let searchForm = $('#winitstockinorderForm');
        searchForm.find('[name=searchValue]').attr('maxlength','2000');
        if (value === 'pSku2' || value === 'sSku2') {
            searchForm.find('[name=searchValue]').attr('maxlength','40000')
        }
    });

    // 查询
    $("#winitstockinorder_searchBtn").click(function () {
        let formElem = $('#winitstockinorderForm')
        let data = serializeObject(formElem);
        winitstockinorderTableorder(data)
    });
    $('#winitstockinorder_syncOrderBtn').hide()
    function winitstockinorder_initBtn() {
        $('#winitstockinorder_preCreateBtn').hide()
        $('#winitstockinorder_cancelPlanDeliverBtn').hide()
        $('#winitstockinorder_syncOrderBtn').hide()
        $('.winitstockinorder_feeStatusCheckbox').hide()
    }

    // 页签切换
    element.on('tab(winitstockinorder_Tab)', function (data) {
        let searchForm = $('#winitstockinorderForm');
        let status = data.elem.context.dataset.status;
        searchForm.find('[name="oaStatus"]').val(status);
        winitstockinorder_initBtn()
        switch (status){
            case '-1' :
                $('#winitstockinorder_preCreateBtn').show()
                $('#winitstockinorder_cancelPlanDeliverBtn').show()
                break;
            case '1' :
                $('#winitstockinorder_syncOrderBtn').show()
                break
            case '2':
                $('#winitstockinorder_syncOrderBtn').show()
                $('.winitstockinorder_feeStatusCheckbox').show()
                break
            case '3':
            case '4':
                $('#winitstockinorder_syncOrderBtn').show()
                break
            default :
        }

        let searchData = serializeObject(searchForm);
        winitstockinorderTableorder(searchData)
    });

    // 统计各页签的商品数量
    function winitstockinorder_countForAllTab(data) {
        $.ajax({
            type: "post",
            url: ctx + "/winitStockInOrder/countForAllTab.html",
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify(data),
            success: function(res) {
                if (res.code === '0000') {
                    let list = res.data;
                    let tabBox = $('#winitstockinorder_Tab');
                    tabBox.find('[data-status] span').text('(0)');
                    for (let i = 0; i < list.length; ++i) {
                        tabBox.find('[data-status='+ list[i].oaStatus +'] span').text('(' + list[i].num+ ')')
                    }

                } else {
                    layer.msg(res.msg)
                }
            }
        })
    }

    //渲染表格数据
    function winitstockinorderTableorder(data) {
        data.orderBy = 't1.id desc';
        if (data.salerOrganize && !data.salerIdListStr) {
            data.salerIdListStr = formElem.find('[lay-filter=users_hp_saler_winitstockinorder]').attr('user_ids')
        }
        if (data.oaStatus != '2') {
            data.feeStatus = null
        }
        if (data.goodsCompany && !data.firstWayCompanyIdListStr) {
            let firstWayCompanyArr = winitstockinorder_getFirstWayCompanyListByAgent(data.goodsCompany)
            let firstWayCompanyIdList = []
            for (let i = 0; i < firstWayCompanyArr.length; ++i) {
                firstWayCompanyIdList.push(firstWayCompanyArr[i].value)
            }
            data.firstWayCompanyIdListStr = firstWayCompanyIdList.join(',')
        }
        console.log(data)
        let col
        if (data.oaStatus === '-2') {
            col = [
                {type: "checkbox", width: 30 },
                {title: "分配明细单", field: 'id'},
                {title: "发货计划单", field: "planNo"},
                {title: "收货仓库", field: "winitStoreName"},
                {title: "头程渠道", field: "saleLogisticsType"},
                {title: "注册sku", field: "registerSku"},
                {title: "商品sku", field: "sSku"},
                {title: "销售", field: "saler"},
                {title: "数量", field: "amount"},
                {title: "状态", templet: "#winitstockinorder_tab_deliverStatus"},
                {title: "分配人", field: "matcher"},
                {title: "分配时间", templet: '<div>{{Format(d.matchTime,"yyyy-MM-dd hh:mm:ss")}}</div>',width: 80},
                {title: '操作', toolbar: "#winitstockinorder_tab_2_toolBar", width: 100 }
            ]
        } else if (data.oaStatus === '-1') {
            col = [
                {type: "checkbox", width: 30 },
                {title: "分配明细单", field: 'id'},
                {title: "发货计划单", field: "planNo"},
                {title: "收货仓库", field: "winitStoreName"},
                {title: "头程渠道", field: "saleLogisticsType"},
                {title: "注册sku", field: "registerSku"},
                {title: "商品sku", field: "sSku"},
                {title: "销售", field: "saler"},
                {title: "数量", field: "amount", totalRow: true},
                {title: "商品重量(kg)", field: "prodWeight", totalRow: true, templet: '<div>{{accDiv(accMul(d.suttleWeight + d.packWeight,d.amount),1000)}}</div>'},
                {title: "分配人", field: "matcher"},
                {title: "分配时间", templet: '<div>{{Format(d.matchTime,"yyyy-MM-dd hh:mm:ss")}}</div>',width: 80},
                {title: '操作', toolbar: "#winitstockinorder_tab_1_toolBar", width: 100 }
            ]
        } else {
            col = [
                {type: "checkbox", width: 30 },
                {title: "预建入库单", field: "sellerOrderNo"},
                {title: "物流商单号", field: 'expressNo'},
                {title: "收货仓库", field: "winitStoreName"},
                {title: "头程渠道", templet: "#winitstockinorder_logisticsType"},
                {title: "箱数", field: "totalPackageQty"},
                {title: "总重量(kg)", field: "totalWeight"},
                {title: "商品种类", field: "totalMerchandiseQty"},
                {title: "商品总数", field: "totalItemQty"},
                {title: "摊分状态", templet: "<div><span style='color:{{d.feeStatus ? `green`: `grey`}}'>{{d.feeStatus ? '已摊分' : '未摊分'}}</span></div>"},
                {title: "创建人", field: "creator"},
                {title: "时间", templet: '<div>{{Format(d.createTime, "yyyy-MM-dd hh:mm:ss")}}</div>'},
                {title: '操作', toolbar: "#winitstockinorder_tab_toolBar", width: 100 }
            ]
        }

        switch (data.oaStatus) {
            case "-1" :
                break
            case "0" :
            case "1" :
                col.splice(2,0,{title: "海外仓入库单", field: 'winitOrderNo'})
                break
            case "2" :
                 col.splice(2,0,{title: "海外仓入库单", field: 'winitOrderNo'})
                 col.splice(8,0,{title: "到仓", templet: '<div><div class="layui-unselect layui-form-checkbox {{d.ifArrive ? `layui-form-checked` : ``}} layui-checkbox-disbaled layui-disabled"lay-skin="primary"> <i class="layui-icon layui-icon-ok"></i> </div></div>',width: 40})
                break
            case "3" :
                 col.splice(2,0,{title: "海外仓入库单", field: 'winitOrderNo'})
                break
            case "4" :
                 col.splice(2,0,{title: "海外仓入库单", field: 'winitOrderNo'})
                break
        }
        table.render({
            elem: '#winitstockinorder_table',
            method: 'POST',
            url: ctx + '/winitStockInOrder/queryPage.html',
            where: data,
            cols: [
                col
            ],
            totalRow: true,
            page: true,
            limit: 50,
            limits: [50, 100, 500],
            id: 'winitstockinorder_table',
            done: function (res) {
                winitstockinorder_countForAllTab(data);

                let allWeight = 0
                layui.each(res.data, function(index, d) {
                    allWeight += accDiv(accMul(d.suttleWeight + d.packWeight,d.amount),1000)
                })
                $("#winitstockinorder_table").next().find('.layui-table-total td[data-field="prodWeight"] div').html(`(${allWeight.toFixed(3)}) kg`);

                imageLazyload();
            }
        })
    }

    form.on('checkbox(winitstockinorder_feeStatusCheckbox)',function (obj) {
        console.log(obj)
        let checked = obj.elem.checked
        $('[lay-filter=winitstockinorder_feeStatusCheckbox]').prop('checked',false)
        obj.elem.checked = checked
        form.render('checkbox','winitstockinorder_feeStatusCheckboxDiv')
        let val = ''
        if (checked) {
            val = obj.value
        }
        let searchForm = $('#winitstockinorderForm')
        searchForm.find('[name=feeStatus]').val(val)
        let data = serializeObject(searchForm)
        winitstockinorderTableorder(data)
    })

    // 监听表格点击事件
    table.on('tool(winitstockinorder_table)', function(obj) {
        let data = obj.data;
        if (obj.event === "cancelPlanDeliver") {
            winitstockinorder_cancelPlanDeliver([data.id])
        } else if (obj.event === "editDeliverAmount") {
            winitstockinorder_editDeliverAmount(data)
        } else if (obj.event === "submitOrder") {
            winitstockinorder_submitOrder([data.id])
        } else if (obj.event === "detail") {
            winitstockinorder_detail(data)
        } else if (obj.event === "cancelPreOrder") {
            winitstockinorder_cancelOrder(data.id)
        } else if (obj.event === "markDeliver") {
            winitstockinorder_markDeliver([data.id])
        } else if (obj.event === "queryProcess") {
            winitstockinorder_queryProcess(data.winitOrderNo)
        } else if (obj.event === 'avgCalCost') {
            winitstockinorder_avgCalCost(data,true)
        } else if (obj.event === 'exportOrder') {
            winitstockinorder_exportOrder(data)
        } else if (obj.event === 'editExpressNo') {
            winitstockinorder_editExpressNo(data)
        } else if (obj.event === 'disableOrder') {
            winitstockinorder_disableOrder(data)
        } else if (obj.event === 'avgCostDetail') {
            winitstockinorder_avgCalCost(data,false)
        } else if (obj.event === 'recoveryDeliver') {
            winitstockinorder_recoveryDeliver(data)
        }
    });

    function winitstockinorder_recoveryDeliver(deliverInfo) {
        let popIndex = layer.confirm('是否确认驳回发货？该操作不可逆，请谨慎操作', {icon: 3, title:'提示'}, function(index){
            let Adata = {
                id: deliverInfo.id
            }
            let ajax = new Ajax(false)
            ajax.post({
                url: ctx + '/winitStockInOrder/recoveryDeliver.html',
                data: JSON.stringify(Adata),
                success: function (res) {
                    if (res.code === '0000') {
                        layer.msg('驳回成功')
                        layer.close(popIndex)
                    }
                }
            })
        })
    }

    function winitstockinorder_disableOrder(orderInfo) {
        let confirm = layer.confirm('确认作废这个入库单吗',{btn:['确认','取消']}, function () {
            let ajax = new Ajax(true);
            ajax.post({
                url: ctx + "/winitStockInOrder/disAbleOrder.html",
                data: JSON.stringify(orderInfo.id),
                contentType: 'application/json',
                success: function (res) {
                    if (res.code === '0000') {
                        table.reload('winitstockinorder_table')
                    }
                }
            })
            layer.close(confirm)
        })
    }

    function winitstockinorder_editExpressNo(orderInfo) {
        let popIndex = layer.open({
            title: '修改物流商单号',
            type: 1,
            area: ['600px', '55%'],
            btn: ['保存','关闭'],
            content: $('#winitstockinorder_editExpressNoPop').html(),
            id: "winitstockinorder_editExpressNoLayer",
            success: function () {
                let dataForm = $('#winitstockinorder_editExpressNoForm')
                console.log(orderInfo)
                dataForm.find('[name=firstWayCompanyId]').val(orderInfo.firstWayCompanyId)
                dataForm.find('[name=expressNo]').val(orderInfo.expressNo || '')
                dataForm.find('[name=transferNo]').val(orderInfo.transferNo || '')

                initNotNull('#winitstockinorder_editExpressNoForm')
                form.render('select','winitstockinorder_editExpressNoForm')
            },yes: function () {
                if (!checkNotNull('#winitstockinorder_editExpressNoForm')) {
                    return false
                }
                let dataForm = $('#winitstockinorder_editExpressNoForm')
                let Adata = {
                    id: orderInfo.id,
                    expressNo: dataForm.find('[name=expressNo]').val(),
                    transferNo: dataForm.find('[name=transferNo]').val(),
                    firstWayCompanyId: dataForm.find('[name=firstWayCompanyId]').val(),
                    firstWayCompany: dataForm.find('[name=firstWayCompanyId] option:selected').text(),
                }
                let ajax = new Ajax(true)
                ajax.post({
                    url: ctx + '/winitStockInOrder/updateExpressNo.html',
                    data: JSON.stringify(Adata),
                    success: function (res) {
                        if (res.code === '0000') {
                            layer.close(popIndex)
                            table.reload('winitstockinorder_table')
                        }
                    }
                })
            }
        })
    }

    function winitstockinorder_exportOrder(orderInfo) {
        let data = {
            firstWayCompanyId: orderInfo.firstWayCompanyId
        }
        let popIndex = layer.open({
            title: '导出模板选择',
            type: 1,
            area: ['70%', '80%'],
            btn: ['导出','关闭'],
            content: $('#winitstockinorder_exportTempSelectPop').html(),
            id: "winitstockinorder_exportTempSelectLayer",
            success: function () {
                table.render({
                    elem: '#winitstockinorder_exportTempTable',
                    method: 'POST',
                    url: ctx + '/winitStockInOrder/getTemplateList.html',
                    where: data,
                    cols: [
                        [
                            {type: "checkbox", width: 30 },
                            {title: "模板名称", field: "name",width: 120},
                            {title: "导出字段内容",templet: function (res) {
                                let sheetList = JSON.parse(res.titleJson)
                                let html = ''
                                for (let k = 0; k < sheetList.length; k++) {
                                    let titleList = sheetList[k].titleList
                                    let titleArr = []
                                    for (let i = 0; i < titleList.length; ++i) {
                                        titleArr.push(titleList[i].excelField)
                                    }
                                    html += '<div class="b1">' + titleArr.join(',') + '</div>'
                                }


                                return ('<em>' + html + '</em>')
                            }
                            },
                            {title: "备注", field: "remark",width: 250},
                        ]
                    ],
                    page: false,
                    limit: 50,
                    id: 'winitstockinorder_exportTempTable',
                })
            },
            yes: function () {
                let checkStatus = table.checkStatus('winitstockinorder_exportTempTable'),
                    data = checkStatus.data;
                if (data.length === 0) {
                    layer.msg('请选择要导出模板')
                    return
                }
                if (data.length > 1) {
                    layer.msg('请选择一个模板进行导出')
                    return
                }
                let Adata = {
                    id: orderInfo.id,
                    tempId: data[0].id
                }
                submitForm(Adata, ctx + '/winitStockInOrder/exportOneOrderWithTemplate.html')
            }
        })


    }
    function winitstockinorder_avgCalCost(data,ifEditAble) {
        let ifChange = false
        let btnArr = []
        if (ifEditAble) {
            btnArr = ['摊分', '关闭']
        } else {
            btnArr = ['关闭']
        }
        let popIndex = layer.open({
            title: '分摊详情',
            type: 1,
            area: ['90%', '80%'],
            btn: btnArr,
            content: $('#winitstockinorder_avgCalCostPop').html(),
            id: "winitstockinorder_avgCalCostLayer",
            success: function () {
                $('#winitstockinorder_avgCalCostLayer').scroll(function() {
                    toFixedTabHead(this)
                })
                if (!ifEditAble) {
                    $('#winitstockinorder_updateOrderCostBtn').hide()
                }
                winitstockinorder_showAvgCostTable(data.id)
                // 更新入库成本
                $('#winitstockinorder_updateOrderCostBtn').click(function () {
                    ifChange = true
                    let form = $('#winitstockinorder_avgCalCostForm')
                    let Adata = {
                        id: data.id,
                        packFee: form.find('[name=packFee]').val(),
                        firstWayFee: form.find('[name=firstWayFee]').val(),
                        customsFee: form.find('[name=customsFee]').val()
                    }
                    let ajax = new Ajax(false)
                    ajax.post({
                        url: ctx + '/winitStockInOrder/updateOrderCost.html',
                        data: JSON.stringify(Adata),
                        success: function (res) {
                            if (res.code === '0000') {
                                layer.msg('更新成本成功')
                                table.reload('winitstockinorder_avgCalCostShowTable')
                            } else {
                                layer.msg(res.msg)
                            }
                        }
                    })
                })
            },
            yes: function () {
                if (ifEditAble) {
                    let form = $('#winitstockinorder_avgCalCostForm')
                    let originPackFee = form.find('[name=packFee]').attr('data-origin')
                    let originfirstWayFee = form.find('[name=firstWayFee]').attr('data-origin')
                    let origincustomsFee = form.find('[name=customsFee]').attr('data-origin')

                    let packFee = form.find('[name=packFee]').val()
                    let firstWayFee = form.find('[name=firstWayFee]').val()
                    let customsFee = form.find('[name=customsFee]').val()
                    if (packFee != originPackFee || firstWayFee != originfirstWayFee || customsFee != origincustomsFee) {
                        layer.msg('检测到有数据变动，未更新成本')
                        return false
                    }
                    let ajax = new Ajax(true)
                    ajax.post({
                        url: ctx + '/winitStockInOrder/confirmAvgCost.html',
                        data: JSON.stringify(data.id),
                        success: function (res) {
                            if (res.code === '0000') {
                                layer.close(popIndex)
                                table.reload('winitstockinorder_table')
                            }
                        }
                    })
                } else {
                    layer.close(popIndex)
                }
            },
            end: function () {
                if (ifChange) {
                    table.reload('winitstockinorder_table')
                }
            }
        })
    }

    function winitstockinorder_showAvgCostTable(id) {
        table.render({
            method: 'post',
            elem: '#winitstockinorder_avgCalCostShowTable',
            url: ctx + '/winitStockInOrder/queryCost.html',
            where: {id: id},
            cols: [
                [
                    {title: "注册sku", field: 'registerSku'},
                    {title: "商品sku", field: "sSku"},
                    {title: "商品名称", field: "title"},
                    {title: "发货成本(￥)", field: "oaOutCost"},
                    {title: "发货数量", field: "quantity"},
                    {title: "出库金额(￥)", templet: '<div>{{accMul(d.oaOutCost,d.quantity)}}</div>'},
                    {title: "包装材料费(￥)", field: "packCost"},
                    {title: "头程运费(￥)", field: "firstWayCost"},
                    {title: "入库费(￥)", field: "winitInStockCost"},
                    {title: "理货费(￥)", field: "arrangeCost"},
                    {title: "VAT+关税(￥)", field: "customCost"},
                    {title: "入库成本(￥)", field: "avgCost"},
                    {title: "入库金额(￥)", templet: '<div>{{accMul(d.avgCost,d.quantity)}}</div>'},
                ]
            ],
            page: false,
            id: 'winitstockinorder_avgCalCostShowTable',
            done: function (res) {
                let orderInfo = res.extra
                // 初始化数据
                let form = $('#winitstockinorder_avgCalCostForm')
                form.find('[name=packFee]').val(orderInfo.packFee)
                form.find('[name=firstWayFee]').val(orderInfo.firstWayFee)
                form.find('[name=customsFee]').val(orderInfo.customsFee)

                form.find('[name=packFee]').attr('data-origin',orderInfo.packFee)
                form.find('[name=firstWayFee]').attr('data-origin',orderInfo.firstWayFee)
                form.find('[name=customsFee]').attr('data-origin',orderInfo.customsFee)

                form.find('[name=prePackFee]').val(orderInfo.prePackFee)
                form.find('[name=preFirstWayFee]').val(orderInfo.preFirstWayFee)
                form.find('[name=preCustomsFee]').val(orderInfo.preCustomsFee)
            }
        })
    }
    // 修改配货数量
    function winitstockinorder_editDeliverAmount(data) {
        let popIndex = layer.open({
            title: '修改配货数量',
            type: 1,
            area: ['500px', '200px'],
            btn: ['保存','关闭'],
            content: $('#winitstockinorder_editDeliverAmountPop').html(),
            id: "winitstockinorder_editDeliverAmountLayer",
            success: function () {
                $('#winitstockinorder_editDeliverAmountForm').find('[name=amount]').val(data.amount)
            },
            yes: function () {
                let Adata = {
                    id: data.id,
                    amount: $('#winitstockinorder_editDeliverAmountForm').find('[name=amount]').val()
                }
                if (!isInteger(Adata.amount) || Adata.amount <= 0) {
                    layer.msg('请填入正整数')
                    return
                }
                let ajax = new Ajax(true)
                ajax.post({
                    url: ctx + "/winitStockInOrder/updateDeliverAmount.html",
                    data: JSON.stringify(Adata),
                    success: function (res) {
                        if (res.code === '0000') {
                            table.reload('winitstockinorder_table')
                            layer.close(popIndex)
                            // 打印配货标签
                            let deliverPrint = {
                                jspaper: 'winitMatch.jasper',
                                printDetailDtoList: [{
                                    titleMap: {
                                        deliverId: data.id,
                                        amount: Adata.amount,
                                        sku: data.registerSku + (data.isCombination ? '(组合)' : ''),
                                        firstWayCompany: data.firstWayCompany,
                                        storeName: data.winitStoreName
                                    }
                                }]
                            }
                            // 打印配货面单
                            printStandard(deliverPrint)
                        }
                    }
                })
            }
        })
    }

    // 查询入库轨迹
    function winitstockinorder_queryProcess(winitOrderNo) {
        layer.open({
            title: '入库轨迹',
            type: 1,
            area: ['70%', '600px'],
            btn: ['关闭'],
            content: $('#winitstockinorder_orderProcessPop').html(),
            id: "winitstockinorder_orderProcessLayer",
            success: function () {
                let ajax = new Ajax(false);
                ajax.post({
                    url: ctx + "/winitStockInOrder/queryProcess.html",
                    data: winitOrderNo,
                    contentType: 'application/json',
                    success: function (res) {
                        if (res.code === '0000') {
                            winitstockinorder_showWinitOrderProcess(res.data.data.trackingList)
                        }
                    }
                })
            },

        })
    }

    function winitstockinorder_showWinitOrderProcess(list=[]) {
        table.render({
            elem: '#winitstockinorder_orderProcessTable',
            data: list,
            cols: [
                [
                    {title: "时间", field: "date"},
                    {title: "描述", field: "trackingDesc"},
                    {title: "地点", field: "location"},
                    {title: "轨迹代码", field: "trackingCode"},
                ]
            ],
            page: false,
            limit: list.length,
            height: '500px',
            id: 'winitstockinorder_orderProcessTable',
            done: function () {

            }
        })
    }


    // 取消入库单
    function winitstockinorder_cancelOrder(id) {
        let confirm = layer.confirm('确认取消这个入库单吗',{btn:['确认','取消']}, function () {
            let ajax = new Ajax(true);
            ajax.post({
                url: ctx + "/winitStockInOrder/cancelOrder.html",
                data: JSON.stringify(id),
                contentType: 'application/json',
                success: function (res) {
                    if (res.code === '0000') {
                        table.reload('winitstockinorder_table')
                    }
                }
            })
            layer.close(confirm)
        })
    }

    /**
     * 查看入库单详情时， 将箱子数据转换成前端数据格式
     * @param orderDto
     * @param deliverList
     * @returns {Array}
     */
    function winitstockinorder_getCaseData(orderDto,deliverList) {
        let deliverJson = {}
        for (let i = 0; i < deliverList.length; ++i) {
            deliverJson[deliverList[i].id] = deliverList[i]
        }

        let caseList = []
        for (let i = 0; i < orderDto.caseDtoList.length; ++i) {
            let oneCase = orderDto.caseDtoList[i]
            let jsCase = {
                sellerCaseNo: oneCase.sellerCaseNo,
                sellerLength: oneCase.sellerLength,
                sellerWidth: oneCase.sellerWidth,
                sellerHeight: oneCase.sellerHeight,
                caseType: oneCase.caseType,
                weight: oneCase.sellerWeight,
                packageJson: {}
            }
            for (let j = 0; j < oneCase.packageList.length; ++j) {
                let onePackage = oneCase.packageList[j]
                jsCase.packageJson[onePackage.deliverId] = {
                    deliverId: onePackage.deliverId,
                    quantity: onePackage.quantity,
                    registerSku: onePackage.registerSku,
                    winitCode: onePackage.winitCode,
                    packWeight: deliverJson[onePackage.deliverId].packWeight,
                    prodSId: deliverJson[onePackage.deliverId].prodSId,
                    suttleWeight: deliverJson[onePackage.deliverId].suttleWeight,
                }
            }
            caseList.push(jsCase)
        }
        console.log(caseList)
        return caseList
    }

    /**
     * 打开详情弹窗
     */
    function winitstockinorder_detail(data) {
        let ajax = new Ajax(false)
        ajax.post({
            url: ctx + "/winitStockInOrder/queryDetail.html",
            data: JSON.stringify(data.id),
            contentType: 'application/json',
            success: function (res) {
                if (res.code === '0000') {
                    let caseList = winitstockinorder_getCaseData(res.data.orderDto, res.data.deliverList)
                    winitstockinorder_openPreCreatePop(res.data.deliverList, caseList, res.data.orderDto)
                } else {
                    layer.msg(res.msg)
                }
            }
        })

    }

    function winitstockinorder_markDeliver(idList) {
        let confirm = layer.confirm('确认将这些入库单标记发货吗',{btn:['确认','取消']}, function () {
            let ajax = new Ajax(true);
            ajax.post({
                url: ctx + "/winitStockInOrder/markDeliver.html",
                data: JSON.stringify(idList),
                contentType: 'application/json',
                success: function (res) {
                    if (res.code === '0000') {
                        table.reload('winitstockinorder_table')
                    }
                }
            })
            layer.close(confirm)
        })
    }

    function winitstockinorder_submitOrder(idList) {
        let confirm = layer.confirm('确认提交这些入库单吗',{btn:['确认','取消']}, function () {
            let ajax = new Ajax(true);
            ajax.post({
                url: ctx + "/winitStockInOrder/submitOrder.html",
                data: JSON.stringify(idList),
                contentType: 'application/json',
                success: function (res) {
                    if (res.code === '0000') {
                        table.reload('winitstockinorder_table')
                    }
                }
            })
            layer.close(confirm)
        })
    }

    $('#winitstockinorder_cancelPlanDeliverBtn').click(function () {
        let checkStatus = table.checkStatus('winitstockinorder_table'),
            data = checkStatus.data;
        if (data.length === 0) {
            layer.msg('请选择要取消的配货记录')
            return
        }
        let idList = []
        for (let i = 0; i < data.length; ++i) {
            idList.push(data[i].id)
        }
        winitstockinorder_cancelPlanDeliver(idList)
    })
    function winitstockinorder_cancelPlanDeliver(idList) {
        let confirm = layer.confirm('确认取消这些配货记录吗',{btn:['确认','取消']}, function () {
            let ajax = new Ajax(true);
            ajax.post({
                url: ctx + "/winitStockInOrder/cancelPlanDeliver.html",
                data: JSON.stringify(idList),
                contentType: 'application/json',
                success: function (res) {
                    if (res.code === '0000') {
                        table.reload('winitstockinorder_table')
                    }
                }
            })
            layer.close(confirm)
        })
    }

    function winitstockinorder_addOneCase(num) {
        // 获取最大箱号
        let maxSellerCaseNo = 0
        if (winitstockinorder_caseList && winitstockinorder_caseList.length > 0 ) {
            for (let i = 0; i < winitstockinorder_caseList.length; ++i) {
                if (maxSellerCaseNo < winitstockinorder_caseList[i].sellerCaseNo) {
                    maxSellerCaseNo = winitstockinorder_caseList[i].sellerCaseNo
                }
            }
        }
        for (let i = 0; i < num; ++i) {
            winitstockinorder_caseList.push({
                sellerCaseNo: ++maxSellerCaseNo,
                packageJson: {}
            })
        }
    }
    // 预建入库单
    $('#winitstockinorder_preCreateBtn').click(function () {
        let checkStatus = table.checkStatus('winitstockinorder_table'),
            data = checkStatus.data;
        // 检查是否有未提交的预建单
        if (window.localStorage['winitstockinorder_caseList']) {
            let popIndex = layer.confirm('检测到有未提交的预建入库单，是否恢复数据',{btn: ['确认','取消']},
                function () {
                    winitstockinorder_openPreCreatePop(JSON.parse(window.localStorage['winitstockinorder_deliverList']), JSON.parse(window.localStorage['winitstockinorder_caseList']))
                    layer.close(popIndex)
                },
                function () {
                    winitstockinorder_openPreCreatePop(data, [])
                    layer.close(popIndex)
                }
            )
        } else {
            winitstockinorder_openPreCreatePop(data, [])
        }
    })

    function winitstockinorder_validWaitPack(deliverList,caseList,originData) {
        let notFinish = [] // 未装货完全的配货单id
        for (let j = 0; j < deliverList.length;++j) {
            let totalPackAmount = 0
            for (let i = 0; i <caseList.length; ++i) {
                totalPackAmount +=  (caseList[i]['packageJson'][deliverList[j].id] ? caseList[i]['packageJson'][deliverList[j].id].quantity : 0)
            }
            if (totalPackAmount > 0 && totalPackAmount < deliverList[j].amount) {
                notFinish.push(deliverList[j].id)
            }
        }
        if (notFinish.length > 0) {
            layer.msg('存在分配单未全部装货:' + notFinish.join(','))
            return false
        }
        return true
    }

    // 获取材积系数
    function getMaterialCoefficientByAjax(firstWayCompanyId) {
        let Adada = {
            firstWayCompanyId: firstWayCompanyId
        }

        let ajax = new Ajax(false)
        ajax.post({
            url: ctx + "/winitStockInOrder/getMaterialCoefficient.html",
            data: JSON.stringify(Adada),
            success: function (res) {
                if (res.code === '0000') {
                    WinitStockInOrder_materialCoefficient = res.data
                } else {
                    layer.msg(res.msg)
                }
            }
        })
    }

    function checkWeight(prod) {
        switch (prod.channel){
            case 'ebay英国':
                return prod.suttleWeight + prod.packWeight <= 300
            case 'ebay美国':
                return prod.suttleWeight + prod.packWeight <= 450
            case 'ebay澳洲':
                return prod.suttleWeight + prod.packWeight <= 350
            case 'ebay德国':
                return prod.suttleWeight + prod.packWeight <= 300
        }
        return true;
    }
    /**
     * 新增/查看入库单
     * @param data 配货明细列表
     * @param caseList 箱子信息
     * @param originOrderData 原入库单信息
     */
    function winitstockinorder_openPreCreatePop(data,caseList,originOrderData) {
        if (data.length === 0) {
            layer.msg('请选择要建入库单的分配明细单');
            return
        }
        winitstockinorder_deliverList = data
        winitstockinorder_caseList = caseList
        if (winitstockinorder_caseList.length === 0) {
            winitstockinorder_addOneCase(5)
        }

        // 校验是否同一目的仓库、同一头程类型
        let storeList = {}
        let firstWayList = {}
        let winitStoreId
        let firstWayCompany
        let overWeightSku = [] // 超出重量范围的sku
        for (let i = 0; i < data.length; ++i) {
            storeList[data[i].winitStoreId] = 1
            firstWayList[data[i].saleLogisticsType] = 1
            firstWayCompany = data[i].firstWayCompany
            if (!checkWeight(data[i])){
                overWeightSku.push(data[i].registerSku)
            }
        }
        if (overWeightSku.length > 0) {
            layer.alert('以下商品，重量超出【万邑通备货无忧】下单限制：' + overWeightSku.join(','))
            return
        }
        let storeNum = 0;
        for (let key in storeList) {
            storeNum++;
            winitStoreId = key
        }
        let firstWayNum = 0;
        for (let key in firstWayList) {
            firstWayNum++;
        }
        if (!originOrderData) {
            if (storeNum > 1) {
                layer.msg('请选择同一收货仓库的待发货记录预建入库单')
                return
            }
            if (firstWayNum > 1) {
                layer.msg('请选择同一销售头程的待发货记录预建入库单')
                return
            }
        }
        let btn
        if (!originOrderData) {
            btn = ['预建','关闭']
        } else if (originOrderData.oaStatus <= 1) {
            btn = ['保存','关闭']
        } else {
            btn = ['关闭']
        }
        WinitStockInOrder_materialCoefficient = 0
        if (originOrderData) {
            WinitStockInOrder_materialCoefficient = originOrderData.materialCoefficient
        } else {
            getMaterialCoefficientByAjax(data[0].firstWayCompanyId)
        }
        let popIndex = layer.open({
            title: '预建入库单',
            type: 1,
            area: ['95%', '95%'],
            btn: btn,
            content: $('#winitstockinorder_preCreatePop').html(),
            id: "winitstockinorder_preCreateLayer",
            success: function () {
                winitstockinorder_showPreCreateTable(winitstockinorder_deliverList,winitstockinorder_caseList,originOrderData)
                // 缓存
                setLocalCache('winitstockinorder_deliverList',winitstockinorder_deliverList)
                setLocalCache('winitstockinorder_caseList',winitstockinorder_caseList)

                $('#winitstockinorder_addCaseBtn').click(function () {
                    let addAmount = $('#winitstockinorder_addCaseInp').val()
                    if (addAmount === '0') {
                        layer.msg('箱子数量需要大于0')
                        return
                    }
                    if (!isInteger(addAmount)) {
                        layer.msg('箱子数量为正整数')
                        return
                    }
                    addAmount = parseInt(addAmount)
                    winitstockinorder_addOneCase(addAmount)
                    winitstockinorder_showPreCreateTable(winitstockinorder_deliverList,winitstockinorder_caseList,originOrderData)
                    setLocalCache('winitstockinorder_caseList',winitstockinorder_caseList)
                })
                $('#winitstockinorder_preCreateLayer').on('input','.winitstockinorder_putToCaseInp',function (event) {
                    let tableData = layui.table.cache.winitstockinorder_preCreateTable
                    let curInp = event.currentTarget
                    let curTr = $(event.currentTarget).closest('tr')
                    let curTrIndex = curTr.attr('data-index')
                    let caseIndex = curInp.getAttribute('data-caseindex')
                    let deliverid = curInp.getAttribute('data-deliverid')
                    if (!curInp.value) {
                        // 变更箱子统计数据展示
                        delete winitstockinorder_caseList[caseIndex]['packageJson'][deliverid]
                        winitstockinorder_changeCaseCountTableShow(caseIndex, winitstockinorder_caseList[caseIndex])
                        setLocalCache('winitstockinorder_caseList',winitstockinorder_caseList)
                        return
                    }
                    if (!isInteger(curInp.value) || curInp.value < 0) {
                        layer.msg('请输入正整数')
                        curInp.value = ''
                        // 变更箱子统计数据展示
                        delete winitstockinorder_caseList[caseIndex]['packageJson'][deliverid]
                        winitstockinorder_changeCaseCountTableShow(caseIndex, winitstockinorder_caseList[caseIndex])
                        setLocalCache('winitstockinorder_caseList',winitstockinorder_caseList)
                        return
                    }
                    // 校验是否装多
                    let totalPackAmount = 0
                    let allInp = curTr.find('.winitstockinorder_putToCaseInp')
                    for (let i = 0; i < allInp.length; ++i) {
                        totalPackAmount += parseInt(allInp[i].value || 0)
                    }
                    if (totalPackAmount > tableData[curTrIndex].amount) {
                        layer.msg('装入数量大于待装箱数量')
                        curInp.value = ''
                        let totalPackAmount = 0
                        let allInp = curTr.find('.winitstockinorder_putToCaseInp')
                        for (let i = 0; i < allInp.length; ++i) {
                            totalPackAmount += parseInt(allInp[i].value || 0)
                        }
                        curTr.find('[data-field=totalPackAmount] div').text(totalPackAmount)
                        // 变更箱子统计数据展示
                        delete winitstockinorder_caseList[caseIndex]['packageJson'][deliverid]
                        winitstockinorder_changeCaseCountTableShow(caseIndex, winitstockinorder_caseList[caseIndex])
                        setLocalCache('winitstockinorder_caseList',winitstockinorder_caseList)
                        return
                    }
                    winitstockinorder_caseList[caseIndex]['packageJson'][deliverid] = {
                        deliverId: tableData[curTrIndex].id,
                        registerSku: tableData[curTrIndex].registerSku,
                        prodSId: tableData[curTrIndex].prodSId,
                        quantity: parseInt(curInp.value),
                        suttleWeight: tableData[curTrIndex].suttleWeight,
                        packWeight: tableData[curTrIndex].packWeight,
                        winitCode: tableData[curTrIndex].winitCode,
                    }
                    curTr.find('[data-field=totalPackAmount] div').text(totalPackAmount)
                    // 变更箱子统计数据展示
                    winitstockinorder_changeCaseCountTableShow(caseIndex, winitstockinorder_caseList[caseIndex])
                    // 缓存
                    setLocalCache('winitstockinorder_caseList',winitstockinorder_caseList)
                })
            },
            yes: function () {
                if (originOrderData && originOrderData.oaStatus > 1 ) {
                    winitstockinorder_preCreatePopCloseReback(popIndex,originOrderData)
                    return
                }
                // 组装数据
                if (!winitstockinorder_caseList || !winitstockinorder_caseList.length) {
                    layer.msg('无箱子数据')
                    return
                }
                // 校验所选明细单 已装箱数量是否等于 待装箱数量
                if (!winitstockinorder_validWaitPack(winitstockinorder_deliverList,winitstockinorder_caseList,originOrderData)) {
                    return
                }
                let caseList = []
                let packageList
                let packageJson
                let oneCase
                for (let i = 0; i < winitstockinorder_caseList.length; ++i) {
                    packageList = []
                    packageJson = winitstockinorder_caseList[i].packageJson
                    let skuJson = {}
                    let goodsAmount = 0
                    for (let dId in packageJson) {
                        if (packageJson[dId].quantity && packageJson[dId].quantity > 0) {
                            packageList.push({
                                deliverId: packageJson[dId].deliverId,
                                quantity: packageJson[dId].quantity,
                                winitCode: packageJson[dId].winitCode,
                                registerSku: packageJson[dId].registerSku,
                                prodSId: packageJson[dId].prodSId
                            })
                            skuJson[packageJson[dId].registerSku] = 1
                            goodsAmount += packageJson[dId].quantity
                        }
                    }
                    if (packageList.length > 0) {
                        let skuAmount = 0
                        for (let sku in skuJson) {
                            skuAmount++
                        }
                        if (!winitstockinorder_caseList[i].weight) {
                            layer.msg('请填写称重')
                            return
                        }
                        oneCase = {
                            packageList: packageList,
                            sellerCaseNo: winitstockinorder_caseList[i].sellerCaseNo,
                            goodsAmount: goodsAmount,
                            skuAmount: skuAmount,
                            sellerWeight: parseFloat(winitstockinorder_caseList[i].weight),
                            sellerLength: caseTypeJson[winitstockinorder_caseList[i].caseType].length,
                            sellerWidth: caseTypeJson[winitstockinorder_caseList[i].caseType].width,
                            sellerHeight: caseTypeJson[winitstockinorder_caseList[i].caseType].height,
                            caseType: caseTypeJson[winitstockinorder_caseList[i].caseType].name,
                            caseCost: caseTypeJson[winitstockinorder_caseList[i].caseType].cost,
                        }

                        caseList.push(oneCase)
                    }
                }
                if (!originOrderData) {
                    let Adada = {
                        caseDtoList: caseList,
                        orderType: 'DI',
                        winitStoreId: winitStoreId,
                        firstWayCompany: firstWayCompany
                    }

                    let ajax = new Ajax(false)
                    ajax.post({
                        url: ctx + "/winitStockInOrder/addOneOrder.html",
                        data: JSON.stringify(Adada),
                        success: function (res) {
                            if (res.code === '0000') {
                                layer.msg('预建成功')
                                layer.close(popIndex)
                                table.reload('winitstockinorder_table');
                                // 删除缓存数据
                                delete window.localStorage['winitstockinorder_deliverList']
                                delete window.localStorage['winitstockinorder_caseList']
                            } else {
                                layer.msg(res.msg)
                            }
                        }
                    })
                } else {
                    let Adada = {
                        id: originOrderData.id,
                        winitStoreId: originOrderData.winitStoreId,
                        caseDtoList: caseList
                    }

                    let ajax = new Ajax(false)
                    ajax.post({
                        url: ctx + "/winitStockInOrder/updateOrder.html",
                        data: JSON.stringify(Adada),
                        success: function (res) {
                            if (res.code === '0000') {
                                layer.msg('修改成功')
                                layer.close(popIndex)
                                table.reload('winitstockinorder_table');
                                // 删除缓存数据
                                delete window.localStorage['winitstockinorder_deliverList']
                                delete window.localStorage['winitstockinorder_caseList']
                            } else {
                                layer.msg(res.msg)
                            }
                        }
                    })
                }
            },cancel: function() {
                winitstockinorder_preCreatePopCloseReback(popIndex,originOrderData)
                return false
            }, btn2: function () {
                winitstockinorder_preCreatePopCloseReback(popIndex,originOrderData)
                return false
            }
        })
    }
    function winitstockinorder_preCreatePopCloseReback(popIndex,originOrderData) {
        if (!originOrderData) {
            let confirmIndex = layer.confirm('存在未提交的预建入库单，是否关闭弹窗。正常关闭将不缓存数据',{btn:['确认','取消']},
                function () {
                    delete window.localStorage['winitstockinorder_deliverList']
                    delete window.localStorage['winitstockinorder_caseList']
                    layer.close(popIndex)
                    layer.close(confirmIndex)
                }
            )
        } else {
            delete window.localStorage['winitstockinorder_deliverList']
            delete window.localStorage['winitstockinorder_caseList']
            layer.close(popIndex)
        }
    }
    function winitstockinorder_changeCaseCountTableShow(caseIndex,caseInfo) {
        let typeNumHtml = winitstockinoder_getCaseCountTableCellHtml(1, caseInfo, caseIndex,caseOptionHtml,defaultCaseType)
        let weightHtml = winitstockinoder_getCaseCountTableCellHtml(4, caseInfo, caseIndex,caseOptionHtml,defaultCaseType)
        let tableDiv = $('#winitstockinorder_caseCountDiv')
        tableDiv.find('em[data-caseindex=' + caseIndex + '][data-type=1]').html(typeNumHtml)
        tableDiv.find('em[data-caseindex=' + caseIndex + '][data-type=4]').html(weightHtml)
    }

    /**
     * 渲染预建入库单表格
     * @param deliverList
     * @param caseList
     */
    function winitstockinorder_showPreCreateTable(deliverList, caseList, originOrderData) {
        let col = [
            {title: "图片", templet: "#winitstockinorder_tab_image",width: 70, fixed: 'left'},
            {title: "商品信息", templet: "#winitstockinorder_preCreatetab_prodInfo",width: 200, fixed: 'left'},
            {title: "待装箱数量", field: "amount",width: 80, fixed: 'left'},
        ]
        col.push({
            title: "已装箱总计",
            width: 80,
            field: 'totalPackAmount',
            fixed: 'left',
            templet: function(res) {
                let totalPackAmount = 0
                for (let i = 0; i <caseList.length; ++i) {
                    totalPackAmount +=  (caseList[i]['packageJson'][res.id] ? caseList[i]['packageJson'][res.id].quantity : 0)
                }
                return ('<em>'+ totalPackAmount +'</em>')
            }
        })
        let inpClass
        let inpAttr
        if (!originOrderData || originOrderData.oaStatus <= 1) {
            inpClass = "winitstockinorder_putToCaseInp"
            inpAttr = ""
        } else {
            inpClass = "disAbleInp"
            inpAttr = "disabled"
        }
        for (let i = 0; i < caseList.length; i++) {
            let title
            if (!originOrderData || originOrderData.oaStatus <= 1) {
                title = "<div data-index='"+ i +"'>箱子"+ caseList[i].sellerCaseNo +"<i title='移除箱子' class='layui-icon layui-icon-delete' onclick='winitstockinorder_removeCase("+ i +")'></i></div>"
            } else {
                title = "<div data-index='"+ i +"'>箱子"+ caseList[i].sellerCaseNo +"</div>"
            }
            col.push({
                title: title,
                width: 80,
                templet: function(res){
                    let amount = caseList[i]['packageJson'][res.id] ? caseList[i]['packageJson'][res.id].quantity : ''
                    return ('<em><input class="'+ inpClass +' layui-input" type="number" data-caseindex="'+ i +'" '+ inpAttr +' data-deliverid="'+ res.id +'" value="'+ amount +'"></em> ')
                }
            })
        }
        col.push({title: "", templet: "<div>...</div>"})
        if (!originOrderData || originOrderData.oaStatus <= 1) {
            col.push({title: "操作", toolbar: "#winitstockinorder_preCreatetab_toolBar", width: 100})
        }
        // 获取弹窗高度
        let layerHeight = $('#winitstockinorder_preCreateLayer')[0].clientHeight
        let tableHeight = layerHeight-380
        console.log(layerHeight)
        table.render({
            elem: '#winitstockinorder_preCreateTable',
            data: deliverList,
            cols: [
                col
            ],
            page: false,
            limit: deliverList.length,
            height: tableHeight,
            id: 'winitstockinorder_preCreateTable',
            done: function () {
                imageLazyload();
                winitstockinorder_showPreCreateCaseTable(caseList)
            }
        })
    }


    /**
     * 移除箱子
     * @param index
     */
    winitstockinorder_removeCase = function (index) {
        winitstockinorder_caseList.splice(index,1)
        winitstockinorder_showPreCreateTable(winitstockinorder_deliverList,winitstockinorder_caseList)
        setLocalCache('winitstockinorder_caseList',winitstockinorder_caseList)
    }

    /**
     * 预建入库单表格事件
     */
    table.on('tool(winitstockinorder_preCreateTable)', function(obj) {
        let data = obj.data;
        if (obj.event === "remove") {
            // 移除行
            let index = obj.tr[0].getAttribute('data-index')
            winitstockinorder_deliverList.splice(index,1)
            // 更新箱子信息
            for (let i = 0; i < winitstockinorder_caseList.length; ++i) {
                if (winitstockinorder_caseList[i].packageJson[data.id]) {
                    delete winitstockinorder_caseList[i].packageJson[data.id]
                }
            }
            console.log(winitstockinorder_caseList)
            winitstockinorder_showPreCreateTable(winitstockinorder_deliverList,winitstockinorder_caseList)


            // 缓存
            setLocalCache('winitstockinorder_deliverList',winitstockinorder_deliverList)
        }
    })
    function winitstockinorder_getCaseTypeList() {
        $.ajax({
            type: "post",
            url: ctx + "/winitStockInOrder/getCaseTypeList.html",
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify(),
            success: function(res) {
                if (res.code === '0000') {
                    caseTypeList = res.data
                    defaultCaseType = caseTypeList[0].name
                    defaultCaseLength = caseTypeList[0].length
                    defaultCaseWidth = caseTypeList[0].width
                    defaultCaseHeight = caseTypeList[0].height

                    caseTypeJson = {}
                    caseOptionHtml = ''
                    for (let i = 0; i < caseTypeList.length; ++i) {
                        caseTypeJson[caseTypeList[i].name] = caseTypeList[i]
                        caseOptionHtml += '<option data-length="'+ caseTypeList[i].length +'" data-width="'+ caseTypeList[i].width +'" data-height="'+ caseTypeList[i].height +'" value="'+ caseTypeList[i].name +'">' + caseTypeList[i].name + '</option>'
                    }

                } else {
                    layer.msg(res.msg)
                }
            }
        })
    }
    winitstockinorder_getCaseTypeList()

    /**
     * 渲染箱子统计数据表格
     * @param caseList
     */
    function winitstockinorder_showPreCreateCaseTable(caseList) {
        let rows = [{name: '种类',type: 1},{name: '箱子类型',type: 2},{name: '实际称重(kg)',type: 3},{name: '系统估算重量(kg)',type: 4},{name: '抛重/实重比',type: 5}]
        let col = [
            {title: "...",templet: "", width:280, fixed: 'left'},
            {title: "箱号", field: 'name', width: 150, fixed: 'left'}
        ]

        for (let i = 0; i < caseList.length; ++i) {
            col.push({
                title: "<div data-index='"+ i +"'>箱子"+ caseList[i].sellerCaseNo + "</div>",
                width: 80,
                templet: function(res){
                    let html = winitstockinoder_getCaseCountTableCellHtml(res.type,caseList[i],i,caseOptionHtml,defaultCaseType)
                    return ('<em data-caseindex="'+ i +'" data-type="'+ res.type +'">'+ html +'</em>')
                }
            })
        }
        col.push({title: "...",templet: ""})
        table.render({
            elem: '#winitstockinorder_preCreateCaseTable',
            data: rows,
            cols: [
                col
            ],
            page: false,
            limit: rows.length,
            height: 250,
            id: 'winitstockinorder_preCreateCaseTable',
            done: function () {
                let countDiv = $('#winitstockinorder_caseCountDiv')
                let caseTypeSelectList = countDiv.find('[lay-filter=winitstockinorder_caseTypeSelect]')
                for (let i = 0; i < caseTypeSelectList.length; ++i) {
                    let initValue = caseTypeSelectList[i].getAttribute('data-initvalue')
                    if (initValue) {
                        caseTypeSelectList[i].value =initValue
                    }
                }
                form.render('select','winitstockinorder_caseCountDiv')
            }
        })
    }

    /**
     * 获取箱子统计表格 单元格内容
     * @param type
     * @param caseInfo
     * @param caseIndex
     * @param caseOptionHtml
     * @param defaultCaseType
     * @param originOrderData 原入库单数据
     * @returns {*}
     */
    function winitstockinoder_getCaseCountTableCellHtml(type, caseInfo, caseIndex,caseOptionHtml,defaultCaseType) {
        let html
        let packageJson = caseInfo.packageJson
        switch (type) {
            case 1:
                let typeJson = {}
                for (let dId in packageJson) {
                    if (packageJson[dId].quantity > 0) {
                        typeJson[packageJson[dId].registerSku] = 1
                    }
                }
                let typeAmount = 0
                for (let rSku in typeJson) {
                    typeAmount +=1;
                }
                html = typeAmount
                break
            case 2:
                html = '<select data-caseindex="'+ caseIndex +'" lay-filter="winitstockinorder_caseTypeSelect" '
                if (caseInfo.caseType) {
                    html += 'data-initvalue="' + caseInfo.caseType + '"'
                } else {
                    caseInfo.caseType = defaultCaseType
                    caseInfo.sellerLength = defaultCaseLength
                    caseInfo.sellerWidth = defaultCaseWidth
                    caseInfo.sellerHeight = defaultCaseHeight
                }
                html += '>'
                html += caseOptionHtml
                html += '</select>'
                break
            case 3:
                html = '<input data-caseindex="'+ caseIndex +'" oninput="winitstockinorder_caseWeightInp(this)" class="layui-input"'
                if (caseInfo.weight) {
                    html += 'value="' + caseInfo.weight + '"'
                }
                html += ' />'
                break
            case 4 :
                let weight = 0
                for (let dId in packageJson) {
                    weight = accAdd(weight,accDiv(accMul(packageJson[dId].quantity,accAdd(packageJson[dId].suttleWeight,packageJson[dId].packWeight || 0)), 1000))
                }
                html = weight
                break
            case 5:
                if (!caseInfo.weight || !caseInfo.caseType || !WinitStockInOrder_materialCoefficient) {
                    html = ''
                } else {
                    let throwWeight = caseInfo.sellerWidth * caseInfo.sellerHeight * caseInfo.sellerLength / WinitStockInOrder_materialCoefficient
                    html = (throwWeight / caseInfo.weight).toFixed(2)
                }

        }
        return html
    }

    form.on('select(winitstockinorder_caseTypeSelect)',function (obj) {
        let select = obj.elem
        let caseindex = select.getAttribute("data-caseindex")
        let option = $(select).find("option:selected")
        winitstockinorder_caseList[caseindex].caseType = obj.value
        winitstockinorder_caseList[caseindex].sellerLength = option.attr('data-length')
        winitstockinorder_caseList[caseindex].sellerWidth = option.attr('data-width')
        winitstockinorder_caseList[caseindex].sellerHeight = option.attr('data-height')
        setLocalCache('winitstockinorder_caseList',winitstockinorder_caseList)
        freshThrowWeightRate(caseindex)
    })

    winitstockinorder_caseWeightInp = function (self) {
        let caseindex = self.getAttribute('data-caseindex')
        if (isNaN(self.value)) {
            layer.msg('请填入数字')
            self.value = ''
            winitstockinorder_caseList[caseindex].weight = null
            return
        }
        winitstockinorder_caseList[caseindex].weight = self.value
        setLocalCache('winitstockinorder_caseList',winitstockinorder_caseList)
        // 更新抛重比
        freshThrowWeightRate(caseindex)
    }

    // 更新抛重比
    function freshThrowWeightRate(caseIndex) {
        let html = ''
        let caseInfo = winitstockinorder_caseList[caseIndex]
        if (!WinitStockInOrder_materialCoefficient || !caseInfo.sellerHeight || !caseInfo.weight) {
            return
        }

        let throwWeightRate = winitstockinoder_getCaseCountTableCellHtml(5, caseInfo)
        let tableDiv = $('#winitstockinorder_caseCountDiv')
        tableDiv.find('em[data-caseindex=' + caseIndex + '][data-type=5]').html(throwWeightRate)
    }

    // 同步入库单
    $('#winitstockinorder_syncOrderBtn').click(function () {
        let checkStatus = table.checkStatus('winitstockinorder_table'),
            data = checkStatus.data;
        if (data.length === 0) {
            layer.msg('请选择要同步的入库单')
            return
        }
        let confirmIndex = layer.confirm('确认同步这些入库单吗',function () {
            let idList = []
            for (let i = 0; i < data.length; ++i) {
                idList.push(data[i].id)
            }
            let ajax = new Ajax();
            ajax.post({
                url: ctx+ '/winitStockInOrder/syncOrderDetail.html',
                data: JSON.stringify(idList),
                success: function (res) {
                    if (res.code === '0000') {
                        if (res.msg) {
                            layer.msg(res.msg)
                        } else {
                            layer.msg('同步成功')
                        }
                        table.reload('winitstockinorder_table')
                    } else {
                        layer.msg(res.msg)
                    }
                }
            })
        })
    })

    // 补打配货标签
    $('#winitstockinorder_printDeliverDetailBtn').click(function () {
        let id = $('#winitstockinorder_printDeliverDetail').val()
        if (!id) {
            layer.msg('请填写要补打的配货明细单id')
            return
        }
        printDeliverDetail(id)
    })

    // 补打商品标签
    $('#winitstockinorder_printBtn').click(function () {
        let id = $('#winitstockinorder_printDeliverDetail').val()
        if (!id) {
            layer.msg('请填写要补打的配货明细单id')
            return
        }

        let amt = $('#winitstockinorder_printAmount').val()
        if (!amt || amt === '0' || !isInteger(amt)) {
            layer.msg('补打商品标签数量需为正整数')
            return
        }

        let ajax = new Ajax(false);
        ajax.post({
            url: ctx + "/winitMatchChannel/queryDeliverDetail.html",
            data: id,
            contentType: 'application/json',
            success: function (res) {
                if (res.code === '0000') {
                    switch (res.data.serviceType){
                        case 1:
                            // 打印万邑通商品条码
                            printWinitProd([{registerSku: res.data.registerSku,actAmount: amt}])
                            break
                        case 2:
                            printGoodcangProd({registerSku: res.data.registerSku,actAmount: amt})
                            break
                        case 3:
                            printDsfProd({registerSku: res.data.winitCode,actAmount: amt})
                            break
                    }
                }
            }
        })
    })

    $('#winitstockinorder_exportBtn').click(function () {
        var outerIndex = layer.open({
            title: '导出入库单',
            type: 1, //不加该属性,就会出现[object Object]
            area: ['1450px', '650px'],
            btn: ['确定', '关闭'],
            content: $('#winitstockinorder_exportPop').html(),
            success: function() {
                form.on('checkbox(selectAll_winitstockinorder_export)', function(data) {
                    var checked = data.elem.checked
                    $('#winitstockinorder_exportForm input[type=checkbox]:enabled').prop('checked', checked)
                    form.render('checkbox')
                })
                form.render('checkbox')
            },
            yes: function() {
                var searchParam = serializeObject($('#winitstockinorderForm'));
                checkNull(searchParam)
                if (searchParam.oaStatus == -1) {
                    layer.msg('请选择预建入库单之后的状态进行导出')
                    return false
                }
                var data = serializeObject($('#winitstockinorder_exportForm'))
                data.searchParam = JSON.stringify(searchParam)
                var Confirmindex = layer.confirm('确认导出当前搜索条件下的商品信息？', { btn: ['确认', '取消'] }, function() {
                    layer.alert('如果导出数据量大 ，需要十几分钟处理数据，请不要关闭和操作网页，后台正在进行导出文件')
                    submitForm(data, ctx + '/winitStockInOrder/export.html')
                    layer.close(outerIndex);
                })
            }
        })
    })
});
