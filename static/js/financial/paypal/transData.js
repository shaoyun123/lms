var queryByIcon,active_transData
/**
 * time: 2018/01/02
 */
layui.use(["admin", "form", "table", "layer", "laytpl", "laydate","element"], function () {
    var admin = layui.admin,
        form = layui.form,
        table = layui.table,
        layer = layui.layer,
        laydate = layui.laydate,
        $ = layui.$;
    form.render('select');
    form.render('radio');
    form.render('checkbox');
    //初始化2个日期框
    laydate.render({
        elem: '#beginDate_transData',
        type: 'datetime'
    });
    laydate.render({
        elem: '#endDate_transData',
        type: 'datetime'
        ,ready: function () {
          $(".layui-laydate-footer [lay-type='datetime'].laydate-btns-time").click();
          $(".laydate-main-list-0 .layui-laydate-content li ol li:last-child").click();
          $(".layui-laydate-footer [lay-type='date'].laydate-btns-time").click();
         }
    });

    // 重置按钮
    $("#resetBtn_transData").click(function () {
        $("form[name=searchForm_transData] [name]:not(.hiddenContent)").val('')
        form.render('select')
    })

    //表格渲染结果
    function queryPage(data) {
        table.render({
            elem: "#TransDataTable",
            method: "post",
            url: ctx + "/sysPaypalTransData/queryPage.html",
            where: data,
            cols: [
                [
                    //标题栏
                    {type: "checkbox"},
                    {field: 'tradeTime', title:'日期',  width: 165,templet: '<div>{{Format(new Date(d.tradeTime),"yyyy-MM-dd hh:mm:ss")}}</div>'},
                    {field: "fromPaypalEmail", title: "paypal账号", width: 185},
                    {field: "transactionId", title: "PPID", width: 185},
                    {field: "tradeType", title: "交易类型", templet: '#tradeType'},
                    {title: "收款账户",templet: '<div> {{d.payerEmail || ""}}</div>', width:185},
                    {field: "payerDisplayName", title: "姓名"},
                    {field: "payNote", title: "交易状态"},
                    {field: "grousAmount", title: "总额",templet: '<div>{{d.grossCurrency}}:{{d.grossAmount}}</div>'},
                    {field: "checkResult", title: "核单结果", templet: '#checkResult'},
                    {field: "checkRemark", title: "核单备注"},
                    {field: "checkUser", title: "核单人"},
                    //绑定工具条
                    {title: '操作', align: 'center', toolbar: '#trans_data_bar',width:70}
                ],
            ],
            id: 'TransDataTable',
            page: true,
            limits: [100, 500, 1000],
            limit: 100,
            done:function(){
                $('#TransDataTable').next('.layui-table-view').find('.layui-table-header').addClass('toFixedContain')
                countNum(data)
            }
        });
    }

    // 表格数据重载
    active_transData = {
        reload: function(data){
            //执行重载
            table.reload('TransDataTable', {
                where: data
            });
        }
    }

    initSelect()
    function initSelect() {
        // 查询授权paypal账号
        var ajax = new Ajax()
        ajax.post({
            url: ctx + "/sysPaypalEmail/queryAuthPaypalEmailList.html",
            contentType: 'application/json',
            success: function (res) {
                if (res.code == '0000') {
                    var list = res.data.sort(admin.compare('paypalEmail'))
                    var obj
                    var paypalEmailSelect = $("form[name=searchForm_transData] [name=fromPaypalEmail]")
                    for (var i = 0; i < list.length; ++i) {
                        obj = $('<option value="' + list[i].paypalEmail + '">' + list[i].paypalEmail + '</option>')
                        paypalEmailSelect.append(obj)
                    }

                    form.render('select')
                }
            }
        })
    }

    // 搜索
    function tosearch() {
        var data = getSearchData()
        queryPage(data)
    }

    function getSearchData() {
        var data = serializeObject($('#searchForm_transData'))
        trimData(data)
        data[data.searchType] = data.searchValue
        return data
    }

    // 搜索点击
    $('#searchPaypalBtn_traD').click(function () {
        tosearch()
    })

    // 初始化表格
    tosearch()

    // 统计数量
    function countNum(data) {
        $.ajax({
            type: 'post',
            url: ctx + "/sysPaypalTransData/count.html",
            data: JSON.stringify(data),// 统计未核单
            dataType: 'json',
            contentType: 'application/json',
            success: function (res) {
                if (res.code == '0000') {
                    $('#notCheckNum').text(res.data.notCheckNum)
                    $('#checkedNum').text(res.data.checkedNum)
                }
            }
        })
    }

    // 批量系统核单检查
    $('#checkByListBtn').click(function () {
        var ajax = new Ajax(true)
        ajax.post({
            url: ctx + "/sysPaypalTransData/checkData.html",
            data: JSON.stringify({}),
            contentType: 'application/json',
            success: function (data) {
                if (data.code == '0000') {
                    layer.msg('操作成功')
                    active_transData.reload()
                    layer.closeAll();
                }
            }
        })
    })

    //工具条的监听事件,table.on(tool(表格的lay-filter的值))
    table.on('tool(TransDataTable)', function (obj) {
        var data = obj.data, //获得当前行数据
            layEvent = obj.event; //获得 lay-event 对应的值

        if (layEvent == 'check') {
            // 查询对应的打款单
            layer.open({
                type: 1,
                title: "核对paypal账单",
                area: ["60%", "90%"],
                shadeClose: false,
                content: $("#check_paypal_data_pop").html(),
                btn: ['保存', '关闭'],
                success: function (layero, index) {
                    // 初始化数据
                    $('#tradeDataForm [name=transactionId]').val(data.transactionId)
                    var tradeType = ''
                    switch (data.tradeType) {
                        case 1: tradeType = '打款'
                            break
                        case 2: tradeType = 'ebay结账'
                            break
                    }
                    $('#tradeDataForm [name=tradeType]').val(tradeType)
                    $('#tradeDataForm [name=fromPaypalEmail]').val(data.fromPaypalEmail)
                    $('#tradeDataForm [name=payerEmail]').val(data.payerEmail)
                    $('#checkPayOrderForm [name=dealStatus]').val(data.dealStatus)
                    $('#checkPayOrderForm [name=checkRemark]').val(data.checkRemark)
                    form.render('select');
                    // 初始化打款单数据
                    if (data.tradeType == 1 || data.tradeType == 2) {
                        var ajax = new Ajax()
                        ajax.post({
                            url: ctx + "/sysPaypalPayOrder/findByTransactionId.html",
                            data: JSON.stringify({transactionId: data.transactionId}),
                            contentType: 'application/json',
                            success: function (res) {
                                var payOrder = ''
                                if (res.code == '0000') {
                                    payOrder = res.data
                                    if (payOrder) {
                                        $('#payOrderInfoForm [name=companyName]').val(payOrder.companyName)
                                        $('#payOrderInfoForm [name=channel]').val(payOrder.channel)
                                        $('#payOrderInfoForm [name=fromPaypalEmail]').val(payOrder.fromPaypalEmail)
                                        $('#payOrderInfoForm [name=toPaypalEmail]').val(payOrder.toPaypalEmail)
                                        $('#payOrderInfoForm [name=currencyCode]').val(payOrder.currencyCode)
                                        $('#payOrderInfoForm [name=amount]').val(payOrder.amount)
                                        $('#payOrderInfoForm [name=reason]').val(payOrder.reason)
                                        $('#payOrderInfoForm [name=remark]').val(payOrder.remark)
                                    }
                                    form.render('select');
                                }
                            }
                        })

                    }

                },
                yes: function () {
                    if (!$('#checkPayOrderForm [name=dealStatus]').val()) {
                        layer.msg('请选择核单结果')
                        return
                    }
                    var Adata = {
                        id : data.id,
                        dealStatus: parseInt($('#checkPayOrderForm [name=dealStatus]').val().trim()),
                        checkRemark: $('#checkPayOrderForm [name=checkRemark]').val().trim(),
                    }

                    var ajax = new Ajax(true)
                    ajax.post({
                        url: ctx + "/sysPaypalTransData/checkDataByUser.html",
                        data: JSON.stringify(Adata),
                        contentType: 'application/json',
                        success: function (data) {
                            if (data.code == '0000') {
                                layer.msg('操作成功')
                                $('#searchPaypalBtn_traD').trigger('click')
                                layer.closeAll();
                            }
                        }
                    })
                },
                end: function () {
                }
            });
        }
    });

    // 点击状态标签进行搜索
    queryByIcon = function (value) {
        $('form[name=searchForm_transData] [name=dealStatus]').val(value)
        tosearch()
    }
    // 导出
    $('#exportTransDataBtn').click(function () {
        var data = {}
        var searchParam = getSearchData()
        checkNull(searchParam)
        data.searchParam = JSON.stringify(searchParam)
        var Confirmindex = layer.confirm('确认导出当前搜索条件下的交易数据？', { btn: ['确认', '取消'] }, function() {
            layer.alert('如果导出数据量大，需要几分钟处理数据，请不要关闭和操作网页，后台正在进行导出文件')
            submitForm(data, ctx + '/sysPaypalTransData/export.html')
            layer.close(Confirmindex);
        })
    })
    
    // 批量人工核单
    $('#dealByListBtn_paypal_transData').click(function () {
        var checkStatus = table.checkStatus('TransDataTable'),
            data = checkStatus.data;
        console.log(data)
        if (data.length == 0) {
            layer.msg('请选择需要核单的数据')
            return
        }
        var idList = []
        for (var i = 0; i <data.length; ++i) {
            if (data[i].dealStatus != 1) {
                layer.msg('请选择未核单的数据')
                return
            }
            idList.push(data[i].id)
        }

        var popIndex = layer.open({
            type: 1,
            title: "批量核单",
            area: ["30%", "50%"],
            shadeClose: false,
            content: $("#deal_trans_list_pop_paypal_transData").html(),
            btn: ['确认', '关闭'],
            success: function (layero, index) {
                initNotNull('#dealPaypalTransListForm')
                form.render('select','dealPaypalTransListForm')
            },
            yes: function () {
                if (!checkNotNull('#dealPaypalTransListForm')) {
                    return
                }
                Adata= {
                    idList: idList,
                    dealStatus: $('#dealPaypalTransListForm [name=dealStatus]').val(),
                    checkRemark: $('#dealPaypalTransListForm [name=checkRemark]').val()
                }
                var ajax = new Ajax(true)
                ajax.post({
                    url: ctx + "/sysPaypalTransData/dealPaypalTransList.html",
                    data: JSON.stringify(Adata),
                    contentType: 'application/json',
                    success: function (res) {
                        if (res.code == '0000') {
                            layer.msg('核单成功')
                            layer.close(popIndex)
                            active_transData.reload()
                        }
                    }
                })
            }
        })
    })

    // 导入pingpong数据
    $('#importPingpongTradeData_transData').click(function () {
        $('#pingpongFile_transData').click()

    })

    $('#pingpongFile_transData').on('change', function() {
        var files = $('#pingpongFile_transData')[0].files
        // 如果没有文件则终止
        if (files.length == 0) {
            return
        }
        // 校验文件类型
        var fileName = files[0].name
        var seat = fileName.lastIndexOf(".");
        var extension = fileName.substring(seat).toLowerCase();
        if (extension != '.xlsx' && extension != '.xls') {
            $('#pingpongFile_transData').val('')
            layer.msg('请传入后缀为.xlsx或者.xls 的Excel文件')
            return
        }
        var formData = new FormData();
        formData.append("file", files[0]);
        var confirmIndex = layer.confirm('确认导入这个文件中的pingpong交易数据吗', { btn: ['确认', '取消'] },
            function() {
                loading.show()
                $.ajax({
                    url: ctx + '/sysPaypalTransData/importPingpongTrade.html',
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
                        $('#pingpongFile_transData').val('')

                        if (data.code === '0000') {
                            layer.alert("导入成功");
                        } else {
                            layer.alert(data.msg)
                        }
                    },
                    error: function() {
                        loading.hide()
                        $('#pingpongFile_transData').val('')
                    }
                });
            },
            function() {
                layer.closeAll()
            }
        )
    })
});


