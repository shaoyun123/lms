
layui.use(['form', 'admin', 'table', 'layer', 'element', 'laypage', 'laydate', 'formSelects'], function() {
    let form = layui.form,
        table = layui.table,
        element = layui.element,
        laydate = layui.laydate,
        formSelects = layui.formSelects,
        layer = layui.layer;

    form.render('select');
    form.render('checkbox');
    laydate.render({
        elem: '#winitplan_time',
        type: 'date',
        range: true
    });

    // 初始化设置日期为当前1个月内时间
    // var date = new Date()
    // var endTime = format(date, 'yyyy-MM-dd')
    // date.setDate(date.getDate() - 60);
    // var beginTime = format(date, 'yyyy-MM-dd')
    // var timeStr = beginTime + ' - ' + endTime
    // $('#winitplan_time').val(timeStr)

    // 人员选择
    render_hp_orgs_users("#winitplanForm",function () {
        formSelects.render('winitplan_saler');
    });
    // 清空按钮事件
    $("#winitplan_searchReset").click(function() {
        let searchForm = $('#winitplanForm');
        searchForm.find('[name]:not(.hiddenContent)').val('');
        $("#winitplan_search_cate").html('');
        form.render('select','winitplanForm')
    });

    // 限制查询sku 条件输入长度
    form.on('select(skuTypeSelect_winitplan)', function(data){
        let value = data.value;
        let searchForm = $('#winitplanForm');
        searchForm.find('[name=searchValue]').attr('maxlength','2000');
        if (value === 'pSku2' || value === 'sSku2') {
            searchForm.find('[name=searchValue]').attr('maxlength','40000')
        }
    });

    // 配货状态 绑定
    form.on('checkbox(winitplan_matchStatusCheckBox)', function(data) {
        let value = data.value
        let ifChecked = data.elem.checked
        let div = $('#winitplan_matchStatusCheckDiv')
        div.find('input[name=matchStatus]').prop('checked',false)
        if (ifChecked) {
            data.elem.checked = ifChecked
            $('#winitplanForm').find('[name=matchStatus]').val(value)
        } else {
            $('#winitplanForm').find('[name=matchStatus]').val('')
        }
        console.log($('#winitplanForm').find('[name=matchStatus]').val())
        form.render('checkbox','winitplan_matchStatusCheckDiv')
    });

    // 查询
    $("#winitplan_searchBtn").click(function () {
        let formElem = $('#winitplanForm')
        let data = serializeObject(formElem);
        data.orderBy = 't1.id desc';
        if (data.salerOrganize && !data.salerIdListStr) {
            data.salerIdListStr = formElem.find('[lay-filter=users_hp_saler_winitplan]').attr('user_ids')
        }
        winitplanTableorder(data)
    });
    // 初始隐藏按钮
    $('#winitplan_purchaseBtn').hide()
    $('#winitplan_checkStockBtn').hide()
    $('#winitplan_markFinishPurBtn').hide()
    $('#winitplan_exportWaitPurDetailBtn').hide()
    $('#winitplan_deleteBtn').hide()
    $('#winitplan_disableBtn').hide()
    $('#winitplan_putInvalidBtn').hide()
    $('#winitplan_exportLackDetailBtn').hide()

    // 页签切换
    element.on('tab(winitplan_Tab)', function (data) {
        let searchForm = $('#winitplanForm');
        let status = data.elem.context.dataset.status;
        let matchStatus = data.elem.context.dataset.matchstatus;
        searchForm.find('[name="processStatusListStr"]').val(status);
        searchForm.find('[name="matchStatus"]').val(matchStatus || '');
        let queryIfMatch = false
        $('#winitplan_requestPurchaseBtn').hide()
        $('#winitplan_purchaseBtn').hide()
        $('#winitplan_checkStockBtn').hide()
        $('#winitplan_markFinishPurBtn').hide()
        $('#winitplan_exportWaitPurDetailBtn').hide()
        $('#winitplan_matchStatusCheckDiv').hide()
        $('#winitplan_deleteBtn').hide()
        $('#winitplan_disableBtn').hide()
        $('#winitplan_putInvalidBtn').hide()
        $('#winitplan_exportLackDetailBtn').hide()
        switch (status){
            case '0' :
                $('#winitplan_requestPurchaseBtn').show()
                $('#winitplan_deleteBtn').show()
                break;
            case '1' :
                $('#winitplan_disableBtn').show()
                $('#winitplan_purchaseBtn').show()
                $('#winitplan_checkStockBtn').show()
                $('#winitplan_markFinishPurBtn').show()
                $('#winitplan_exportWaitPurDetailBtn').show()
                break
            case '2,3':
            case '3':
                $('#winitplan_matchStatusCheckDiv').show()
                $('#winitplan_putInvalidBtn').show()
                $('#winitplan_exportLackDetailBtn').show()
                queryIfMatch = true
                break
            default :
        }

        let searchData = serializeObject(searchForm);
        searchData.orderBy = 't1.id desc';
        if (searchData.salerOrganize && !searchData.salerIdListStr) {
            searchData.salerIdListStr = searchForm.find('[lay-filter=users_hp_saler_winitplan]').attr('user_ids')
        }
        winitplanTableorder(searchData)
    });

    // 统计各页签的商品数量
    function winitplan_countForAllTab(data) {
        $.ajax({
            type: "post",
            url: ctx + "/winitDeliverGoodsPlan/countForAllTab.html",
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify(data),
            success: function(res) {
                if (res.code === '0000') {
                    let list = res.data;
                    let tabBox = $('#winitplan_Tab');
                    // 初始化统计数量为0
                    tabBox.find('[data-status] span').text('(0)');
                    let statusJson = {}
                    for (let i = 0; i < list.length; ++i) {
                        if (!statusJson[list[i].process_status]) {
                            statusJson[list[i].process_status] = []
                        }
                        statusJson[list[i].process_status].push(list[i])
                    }
                    let tabList = tabBox.find('[data-status]')
                    for (let i = 0; i < tabList.length; ++i) {
                        let processStatusArr = tabList[i].getAttribute('data-status').split(',')
                        let num = 0
                        let numList = []
                        for (let q = 0; q < processStatusArr.length; ++q ) {
                            if (statusJson[processStatusArr[q]]) {
                                numList = numList.concat(statusJson[processStatusArr[q]])
                            }
                        }

                        let matchStatusListStr = tabList[i].getAttribute('data-matchstatus')

                        if (numList.length === 0) {
                            continue
                        }
                        if (matchStatusListStr === null) {
                            for (let j = 0; j < numList.length; ++j) {
                                num += numList[j].num
                            }
                        } else {
                            let matchStatusList = matchStatusListStr.split(',')
                            for (let j = 0; j < numList.length; ++j) {
                                for (let k = 0; k < matchStatusList.length; ++k) {
                                    if (numList[j].match_status == matchStatusList[k]) {
                                        num += numList[j].num
                                    }
                                }
                            }
                        }
                        $(tabList[i]).find('span').text('('+ num +')')
                    }
                } else {
                    layer.msg(res.msg)
                }
            }
        })
    }

    // 导出待采购详情
    $('#winitplan_exportWaitPurDetailBtn').click(function () {
        let data = {}
        submitForm(data, ctx + '/winitDeliverGoodsPlan/exportWaitPurDetail.html',"_blank")
    })
    
    $('#winitplan_exportLackDetailBtn').click(function () {
        let data = {}
        submitForm(data, ctx + '/winitDeliverGoodsPlan/exportLackInfo.html',"_blank")
    })
    $('#winitplan_exportHasStockWithoutPlanBtn').click(function () {
        let data = {}
        submitForm(data, ctx + '/winitDeliverGoodsPlan/exportHasStockWithoutPlan.html',"_blank")
    })


    // 标记已采购
    $('#winitplan_markFinishPurBtn').click(function () {
        let checkStatus = table.checkStatus('winitplan_table'),
            data = checkStatus.data;
        if (data.length === 0) {
            layer.msg('请选择要标记已采购的计划');
            return
        }
        let idList = [];
        for (let i = 0; i < data.length; ++i) {
            idList.push(data[i].id)
        }
        let ajax = new Ajax(true);
        ajax.post({
            url: ctx + "/winitDeliverGoodsPlan/markFinishPur.html",
            data: JSON.stringify(idList),
            contentType: 'application/json',
            success: function (res) {
                if (res.code === '0000') {
                    table.reload('winitplan_table')
                }
            }
        })
    })

    //渲染表格数据
    function winitplanTableorder(data) {
        let col = [
            {type: "checkbox", width: 30 },
            {title: "单号", field: 'planNo'},
            {title: "图片", templet: "#winitplan_tab_image"},
            {title: "注册sku", field: "registerSku"},
            {title: "商品sku", templet: "#winitplan_skuTemplet"},
            {title: "英国信件", templet: "#winitplan_UKLetterBox"},
            {title: "德国信件", templet: "#winitplan_DELetterBox"},
            {title: "销售", field: "saler"},
            {title: "销售渠道", field: "channel"},
            {title: "收货仓库", field: "storeName"},
            {title: "头程渠道", field: "saleLogisticsType"},
            {title: "是否组合品", templet: '#winitplan_tab_isCombinationBox',width: 80},
            {title: "商品重量(kg)", field: 'prodWeight',totalRow: true, templet: '<div>{{accDiv(accMul(d.prodSInfo?.suttleWeight + d.prodSInfo?.packWeight,d.planAmount),1000)}}</div>'},
            {title: "可用数量", field: 'availableStock', templet: '<div>{{(d.availableStock || 0)}}</div>'},

            {title: "计划发货数量", field: 'planAmount', totalRow: '({{d.TOTAL_NUMS}})'}
        ]
        switch (data.processStatusListStr) {
            case "0" :
            case "1" : break
            case "3" :
            case "2,3" :
                col.push({title: "未分配数量", templet: "<div>{{d.planAmount - d.actAmount}}</div>"})
                col.push({title: "未发货数量", templet: "<div>{{d.planAmount - d.actDeliverAmount}}</div>"})
                break
            case "4" :
                col.push({title: "已发货数量", templet: "<div>{{d.actDeliverAmount}}</div>"})
                break
            case "8" : break
            case "9" :
                col.push({title: "已发货数量", templet: "<div>{{d.actDeliverAmount}}</div>"})
                break
        }
        col.push({title: "创建人", field: 'creator'})
        col.push({title: "时间", templet: '#winitplan_tab_timeBox'})
        col.push({title: '操作', toolbar: "#winitplan_tab_toolBar", width: 100 })
        table.render({
            elem: '#winitplan_table',
            method: 'POST',
            url: ctx + '/winitDeliverGoodsPlan/queryPage.html',
            where: data,
            cols: [
                col
            ],
            totalRow: true,
            page: true,
            limit: 50,
            limits: [50, 100, 500],
            id: 'winitplan_table',
            done: function (res) {
                winitplan_countForAllTab(data);

                let allWeight = 0

                layui.each(res.data, function(index, d) {
                    allWeight += accDiv(accMul(d.prodSInfo?.suttleWeight + d.prodSInfo?.packWeight,d.planAmount),1000)
                })
                $("#winitplan_table").next().find('.layui-table-total td[data-field="prodWeight"] div').html(`(${allWeight.toFixed(2)}) kg`);

                imageLazyload();
            }
        })
    }

    // 导入新增
    $('#winitplan_addPlanExcel').on('change', function() {
        let files = $('#winitplan_addPlanExcel')[0].files;
        // 如果没有文件则终止
        if (files.length === 0) {
            return
        }
        // 校验文件类型
        let fileName = files[0].name;
        let seat = fileName.lastIndexOf(".");
        let extension = fileName.substring(seat).toLowerCase();
        if (extension !== '.xlsx' && extension !== '.xls') {
            layer.msg('请传入后缀为.xlsx或者.xls 的Excel文件');
            return
        }
        let formData = new FormData();
        formData.append("file", files[0]);
        layer.confirm('确认导入这个文件进行新增发货计划吗', { btn: ['确认', '取消'] },
            function() {
                loading.show();
                $.ajax({
                    url: ctx + '/winitDeliverGoodsPlan/addByExcel.html',
                    type: 'POST',
                    // async : false,
                    data: formData,
                    // 告诉jQuery不要去处理发送的数据
                    processData: false,
                    // 告诉jQuery不要去设置Content-Type请求头
                    contentType: false,
                    dataType: 'json',
                    success: function(res) {
                        loading.hide();
                        $('#winitplan_addPlanExcel').val('');
                        if (res.code === '0000') {
                            table.reload('winitplan_table')
                            layer.msg("导入新增成功");
                        } else {
                            layer.alert(res.msg)
                        }
                    },
                    error: function() {
                        loading.hide();
                        $('#winitplan_addPlanExcel').val('')
                    }
                });
            },
            function() {
                layer.closeAll()
            }
        )
    });

    // 监听表格点击事件
    table.on('tool(winitplan_table)', function(obj) {
        let data = obj.data;
        if (obj.event === "edit") {
            let popIndex = layer.open({
                title: '修改货件计划',
                type: 1, //不加该属性,就会出现[object Object]
                area: ['600px', '600px'],
                btn: ['保存', '关闭'],
                content: $('#winitplan_editPlanPop').html(),
                success: function () {
                    initNotNull('#winitplanEditForm');
                    let editForm = $('#winitplanEditForm');
                    editForm.find('[name=registerSku]').text(data.registerSku);
                    editForm.find('[name=winitStoreId]').val(data.winitStoreId);
                    editForm.find('[name=saleLogisticsType]').val(data.saleLogisticsType);
                    editForm.find('[name=planAmount]').val(data.planAmount);
                    form.render('select','winitplanEditForm')
                    if (data.processStatus === 2) {
                        editForm.find('[name=planAmount]').attr('disabled','disabled')
                        editForm.find('[name=planAmount]').addClass('disAbleInp')
                    }
                },
                yes: function () {
                    let editForm = $('#winitplanEditForm');
                    let Adata = {
                        id: data.id,
                        winitStoreId: editForm.find('[name=winitStoreId]').val(),
                        saleLogisticsType: editForm.find('[name=saleLogisticsType]').val(),
                        planAmount: editForm.find('[name=planAmount]').val()
                    };
                    if (!isInteger(Adata.planAmount) || Adata.planAmount <= 0) {
                        layer.msg('发货数量必须为正整数');
                        return
                    }
                    let ajax = new Ajax(true);
                    ajax.post({
                        url: ctx + "/winitDeliverGoodsPlan/updateOne.html",
                        data: JSON.stringify(Adata),
                        contentType: 'application/json',
                        success: function (res) {
                            if (res.code === '0000') {
                                layer.close(popIndex)
                                table.reload('winitplan_table')
                            }
                        }
                    })
                }
            })
        } else if (obj.event === "delete") {
            let index = layer.confirm('确认删除该计划吗', {btn: ['确认', '取消']},
                function () {
                    winitplan_deletePlan([data.id]);
                    layer.close(index)
                })
        } else if (obj.event === "disable") {
            let index = layer.confirm('确认作废该计划吗', {btn: ['确认', '取消']},
                function () {
                    winitplan_disablePlan([data.id]);
                    layer.close(index)
                })
        } else if (obj.event === "putInvalid") {
            let index = layer.confirm('确认归档该计划吗', {btn: ['确认', '取消']},
                function () {
                    winitplan_putInvalidPlan([data.id]);
                    layer.close(index)
                })
        }
    });

    function winitplan_deletePlan(idList) {
        let ajax = new Ajax(true);
        ajax.post({
            url: ctx + "/winitDeliverGoodsPlan/deletByIdList.html",
            data: JSON.stringify(idList),
            contentType: 'application/json',
            success: function (res) {
                if (res.code === '0000') {
                    table.reload('winitplan_table')
                }
            }
        })
    }

    function winitplan_disablePlan(idList) {
        let ajax = new Ajax(true);
        ajax.post({
            url: ctx + "/winitDeliverGoodsPlan/disable.html",
            data: JSON.stringify(idList),
            contentType: 'application/json',
            success: function (res) {
                if (res.code === '0000') {
                    table.reload('winitplan_table')
                }
            }
        })
    }

    function winitplan_putInvalidPlan(idList) {
        let ajax = new Ajax(true);
        ajax.post({
            url: ctx + "/winitDeliverGoodsPlan/putInvalid.html",
            data: JSON.stringify(idList),
            contentType: 'application/json',
            success: function (res) {
                if (res.code === '0000') {
                    table.reload('winitplan_table')
                }
            }
        })
    }

    // 删除
    $('#winitplan_deleteBtn').click(function () {
        let checkStatus = table.checkStatus('winitplan_table'),
            data = checkStatus.data;
        if (data.length === 0) {
            layer.msg('请选择要删除的计划');
            return
        }
        let idList = [];
        for (let i = 0; i < data.length; ++i) {
            idList.push(data[i].id)
        }
        let index = layer.confirm('确认删除这些计划吗', {btn: ['确认', '取消']},
            function () {
                winitplan_deletePlan(idList)
                layer.close(index)
            })
    })

    // 作废
    $('#winitplan_disableBtn').click(function () {
        let checkStatus = table.checkStatus('winitplan_table'),
            data = checkStatus.data;
        if (data.length === 0) {
            layer.msg('请选择要作废的计划');
            return
        }
        let idList = [];
        for (let i = 0; i < data.length; ++i) {
            idList.push(data[i].id)
        }
        let index = layer.confirm('确认作废这些计划吗', {btn: ['确认', '取消']},
            function () {
                winitplan_disablePlan(idList)
                layer.close(index)
            })
    })
    // 归档
    $('#winitplan_putInvalidBtn').click(function () {
        let checkStatus = table.checkStatus('winitplan_table'),
            data = checkStatus.data;
        if (data.length === 0) {
            layer.msg('请选择要归档的计划');
            return
        }
        let idList = [];
        for (let i = 0; i < data.length; ++i) {
            idList.push(data[i].id)
        }
        let index = layer.confirm('确认归档这些计划吗', {btn: ['确认', '取消']},
            function () {
                winitplan_putInvalidPlan(idList)
                layer.close(index)
            })
    })
    // 提交采购
    $('#winitplan_requestPurchaseBtn').click(function () {
        let checkStatus = table.checkStatus('winitplan_table'),
            data = checkStatus.data;
        if (data.length === 0) {
            layer.msg('请选择要提交采购的商品');
            return
        }
        let idList = [];
        for (let i = 0; i < data.length; ++i) {
            idList.push(data[i].id)
        }
        let ajax = new Ajax(true);
        ajax.post({
            url: ctx + "/winitDeliverGoodsPlan/requestPurchase.html",
            data: JSON.stringify(idList),
            contentType: 'application/json',
            success: function (res) {
                if (res.code === '0000') {
                    table.reload('winitplan_table')
                }
            }
        })
    })

    // 一键采购
    $('#winitplan_purchaseBtn').click(function () {
        let title = '确认按照当前搜索条件计划进行采购吗?'
        let checkStatus = table.checkStatus('winitplan_table'),
            data = checkStatus.data;
        let idList = [];
        if (data && data.length > 0) {
            for (let i = 0; i < data.length; ++i) {
                idList.push(data[i].id)
            }
        }
        if (idList.length > 0) {
            title = '确认对所选择的发货计划进行采购吗?'
        }
        layer.confirm(title,{btn: ['确认','取消']}, function () {
            let Adata = serializeObject($('#winitplanForm'))
            Adata.idListStr = idList.join(',')

            let ajax = new Ajax(true);
            ajax.post({
                timeout: 3600000,
                url: ctx + "/winitDeliverGoodsPlan/purchase.html",
                data: JSON.stringify(Adata),
                success: function (res) {
                    if (res.code === '0000') {
                        table.reload('winitplan_table')
                    }
                }
            })
        })
    })

    // 库存检查
    $('#winitplan_checkStockBtn').click(function () {
        let popIndex = layer.open({
            title: '库存检查',
            type: 1, //不加该属性,就会出现[object Object]
            area: ['1000px', '80%'],
            btn: ['关闭'],
            content: $('#winitplan_checkStockPop').html(),
            success: function () {
                form.render('select', 'winitplan_checkStockForm')
                checkStockTableRender()
                $('#winitplan_checkStockSearchBtn').click(function () {
                    checkStockTableRender()
                })
                $('#winitplan_checkStockPrintBtn').click(function () {
                    let eForm = $('#winitplan_checkStockForm')
                    let storeId = eForm.find('[name=storeId]').val()
                    let checkStatus = table.checkStatus('winitplan_table'),
                        data = checkStatus.data;
                    let prodSIdList = []
                    for (let i = 0; i < data.length; ++i) {
                        prodSIdList.push(data[i].prodSId)
                    }
                    let param = '?storeId=' + storeId + '&prodSIdList=' + prodSIdList.join(',')
                    window.open("/lms/static/html/winitStockCheckPrint.html" + param, "_blank");
                })
            }
        })
    })

    function checkStockTableRender() {
        let data = {
            storeId: $('#winitplan_checkStockForm').find('[name=storeId]').val()
        }
        table.render({
            elem: '#winitplan_checkStockTable',
            method: 'POST',
            url: ctx + '/winitDeliverGoodsPlan/checkStock.html',
            where: data,
            cols: [
                [
                    {type: "checkbox", width: 30},
                    {title: "商品SKU", field: 'sSku'},
                    {title: "仓库", field: 'storeName'},
                    {title: "库位", templet: '<div>{{d.location.locationCode}}</div>'},
                    {title: "真实库存", templet: '<div>{{d.whStock.currentStock}}</div>'},
                    {title: "可用库存", templet: '<div>{{d.whStock.currentStock - d.whStock.reservationStock}}</div>'},
                    {title: "计划发货数量", field: 'planAmount'},
                    {title: "周转天数", templet: '<div>{{d.dailySaleNum3 ? accDiv(d.whStock.currentStock - d.whStock.reservationStock, d.dailySaleNum3).toFixed(2) : ""}}</div>'},
                ]
            ],
            page: true,
            limit: 100,
            limits: [100, 200, 500],
            id: 'winitplan_table',
            done: function () {
                console.log(layui.table)
            }
        })
    }


    // 导出
    $('#winitplan_exportBtn').click(function() {
        var outerIndex = layer.open({
            title: '导出发货计划',
            type: 1, //不加该属性,就会出现[object Object]
            area: ['1450px', '650px'],
            btn: ['确定', '关闭'],
            content: $('#winitplan_exportPop').html(),
            success: function() {
                form.on('checkbox(selectAll_winitplan_export)', function(data) {
                    var checked = data.elem.checked
                    $('#winitplan_exportForm input[type=checkbox]:enabled').prop('checked', checked)
                    form.render('checkbox')
                })
                form.render('checkbox')
            },
            yes: function() {
                var searchParam = serializeObject($('#winitplanForm'));
                checkNull(searchParam)
                var data = serializeObject($('#winitplan_exportForm'))
                data.searchParam = JSON.stringify(searchParam)
                var Confirmindex = layer.confirm('确认导出当前搜索条件下的商品信息？', { btn: ['确认', '取消'] }, function() {
                    layer.alert('如果导出数据量大 ，需要十几分钟处理数据，请不要关闭和操作网页，后台正在进行导出文件')
                    submitForm(data, ctx + '/winitDeliverGoodsPlan/export.html')
                    layer.close(outerIndex);
                })
            }
        })
    })
});
