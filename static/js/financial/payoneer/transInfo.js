var queryByIcon_payoneer,active_transData_payoneer
/**
 * time: 2018/01/02
 */
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

    // 重置按钮
    $("#resetBtn_transData_payoneer").click(function () {
        $("form[name=searchForm_transData_payoneer] [name]:not(.hiddenContent)").val('')
        form.render('select')
    })

    //表格渲染结果
    function queryPage(obj) {
        var data = {
            orderBy: 'id desc'
        }
        if (obj) {
            $.extend(data, obj);
        }
        table.render({
            elem: "#TransDataTable_payoneer",
            method: "post",
            url: ctx + "/payoneerTradeInfo/queryPage.html",
            where: data,
            contentType: 'application/json',
            done: function (res) {
            },
            cols: [
                [
                    //标题栏
                    {type: "checkbox"},
                    {field: 'tradeDate', title:'日期',  width: 165,templet: '<div>{{Format(new Date(d.tradeDate),"yyyy-MM-dd hh:mm:ss")}}</div>'},
                    {field: "acct", title: "账号", width: 185},
                    {field: "tradeId", title: "交易ID", width: 185},
                    {field: "tradeType", title: "交易类型", templet: '#tradeType_payoneerTradeInfo'},
                    {field: "payerDisplayName", title: "姓名"},
                    {field: "tradeStatus", title: "交易状态",templet: '#tradeStasu_payoneerTradeInfo'},
                    {field: "grousAmount", title: "总额",templet: '<div>{{d.amountCurrency}}:{{d.amount}}</div>'},
                    {field: "checkResult", title: "核单结果", templet: '#checkResult_payoneerTradeInfo'},
                    {field: "checkRemark", title: "核单备注"},
                    {field: "checkUser", title: "核单人"},
                    //绑定工具条
                    {title: '操作', align: 'center', toolbar: '#payoneerTradeInfo_bar',width:70}
                ],
            ],
            id: 'payoneerTradeInfoReloadTable',
            page: true,
            limits: [100, 500, 1000],
            limit: 100,
            done: function() {
                $('#TransDataTable_payoneer').next('.layui-table-view').find('.layui-table-header').addClass('toFixedContain')
            }
        });
    }

    // 表格数据重载
    active_transData_payoneer = {
        reload: function(data){
            //执行重载
            table.reload('payoneerTradeInfoReloadTable', {
                page: {
                    curr: 1 //重新从第 1 页开始
                }
                ,where: data
            });
        }
    }

    //初始化2个日期框
    laydate.render({
        elem: '#beginDate_transData_payoneer',
        type: 'datetime'
    });
    laydate.render({
        elem: '#endDate_transData_payoneer',
        type: 'datetime'
        ,ready: function () {
          $(".layui-laydate-footer [lay-type='datetime'].laydate-btns-time").click();
          $(".laydate-main-list-0 .layui-laydate-content li ol li:last-child").click();
          $(".layui-laydate-footer [lay-type='date'].laydate-btns-time").click();
         }
    });
    // 搜索
    function tosearch(ifReload) {
        var data ={
            acct : $('form[name=searchForm_transData_payoneer] [name=acct]').val().trim(),
            tradeId : $('form[name=searchForm_transData_payoneer] [name=tradeId]').val().trim(),
            tradeType : $('form[name=searchForm_transData_payoneer] [name=tradeType]').val().trim(),
            checkResult : $('form[name=searchForm_transData_payoneer] [name=checkResult]').val().trim(),
            beginDate : $('form[name=searchForm_transData_payoneer] #beginDate_transData_payoneer').val().trim(),
            endDate : $('form[name=searchForm_transData_payoneer] #endDate_transData_payoneer').val().trim(),
            dealStatus: $('form[name=searchForm_transData_payoneer] [name=dealStatus]').val().trim()
        }

        if (ifReload) {
            active_transData_payoneer.reload(data)
        } else {
            queryPage(data)
        }
        checkNull(data)
        countNum(data)
    }

    // 搜索点击
    $('#searchPaypalBtn_payoneer').click(function () {
        tosearch(true)
    })

    // 初始化列表
    tosearch()

    // 统计数量
    function countNum(data) {
        var ajax = new Ajax()
        ajax.post({
            url: ctx + "/payoneerTradeInfo/countForAllDealStatus.html",
            data: JSON.stringify(data),// 统计未核单
            contentType: 'application/json',
            success: function (res) {
                if (res.code == '0000') {
                    $('#notDealNum_payoneer').text(res.data.notDealNum)
                    $('#HadDealNum_payoneer').text(res.data.HadDealNum)
                    $('#totalNum_payoneer').text(res.data.totalNum)
                }
            }
        })
    }

    // 批量核单
    $('#checkByListBtn').click(function () {
        var ajax = new Ajax(true)
        // ajax.post({
        //     url: ctx + "/sysPaypalTransData/checkData.html",
        //     data: JSON.stringify({}),
        //     contentType: 'application/json',
        //     success: function (data) {
        //         if (data.code == '0000') {
        //             layer.msg('操作成功')
        //             $('#searchPaypalBtn_payoneer').trigger('click')
        //             layer.closeAll();
        //         }
        //     }
        // })
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
                                $('#searchPaypalBtn_payoneer').trigger('click')
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

    queryByIcon_payoneer = function (value) {
        $('form[name=searchForm_transData_payoneer] [name=dealStatus]').val(value)
        $('#searchPaypalBtn_payoneer').trigger('click')
    }

    $('#exportTransDataBtn').click(function () {
        var data ={
            fromPaypalEmail : $('form[name=searchForm_transData_payoneer] [name=fromPaypalEmail]').val(),
            tradeType : $('form[name=searchForm_transData_payoneer] [name=tradeType]').val(),
            checkResult : $('form[name=searchForm_transData_payoneer] [name=checkResult]').val(),
            beginDate : $('form[name=searchForm_transData_payoneer] #beginDate_transData_payoneer').val(),
            endDate : $('form[name=searchForm_transData_payoneer] #endDate_transData_payoneer').val(),
            dealStatus: $('form[name=searchForm_transData_payoneer] [name=dealStatus]').val()
        }
        if (!data.beginDate.trim()) {
            layer.msg('请选择一个开始日期')
            return
        }

        var form = $("<form></form>");
        form.attr('action',ctx + '/sysPaypalTransData/export.html');
        form.attr('method','post');

        for(var key in data){
            var temp= $("<input type='hidden' name='" + key + "' value='" +data[key] + "'/>")
            form.append(temp);
        }
        form.appendTo("body");
        form.css('display','none');
        form.submit();
    })
});


