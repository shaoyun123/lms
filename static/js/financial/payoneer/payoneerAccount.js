/**
 * time: 2018/09/18  huangpeng
 */

layui.use(["admin", "form", "table", "layer", "laytpl",'element'], function() {
    var admin = layui.admin,
        form = layui.form,
        table = layui.table,
        layer = layui.layer,
        element = layui.element,
        laytpl = layui.laytpl,
        $ = layui.$;
    form.render("select");
    form.render("radio");
    form.render("checkbox");

    //展示已知数据
    table.render({
        elem: "#payoneerAcctTable",
        method: "post",
        url: ctx + "/payoneer/queryPage.html",
        cols: [
            [
                //标题栏
                { type: "checkbox" },
                { field: "acct", title: "账号" },
                {title: "Token到期时间", templet: '#tokenExpireTime_payoneer',width:180},
                {title: "审核状态", templet: "#payoneerAcccount_auditStatus", width: 100,},
                {title: "余额更新时间",templet: '#payoneerAccount_balanceTime' },
                {title: "USD", templet: '<div>{{getBalanceByCurrencyAndAcctList("USD",d.finPayoneerSubAcctDtoList)}}</div>', sort: true},
                {title: "AUD", templet: '<div>{{getBalanceByCurrencyAndAcctList("AUD",d.finPayoneerSubAcctDtoList)}}</div>', sort: true},
                {title: "CAD", templet: '<div>{{getBalanceByCurrencyAndAcctList("CAD",d.finPayoneerSubAcctDtoList)}}</div>', sort: true},
                {title: "EUR", templet: '<div>{{getBalanceByCurrencyAndAcctList("EUR",d.finPayoneerSubAcctDtoList)}}</div>', sort: true},
                {title: "GBP", templet: '<div>{{getBalanceByCurrencyAndAcctList("GBP",d.finPayoneerSubAcctDtoList)}}</div>', sort: true},
                {title: "CNH", templet: '<div>{{getBalanceByCurrencyAndAcctList("CNH",d.finPayoneerSubAcctDtoList)}}</div>', sort: true},
                { field: "remark", title: "备注" },
                { field: "failMsg", title: "错误信息" },
                //绑定工具条
                { title: "操作", width: 200, align: "center", toolbar: "#payoneerTableBar" },
            ],
        ],
        id: "payoneerAcctTable",
        page: true, //是否显示分页
        limits: [100, 500, 1000],
        limit: 100, //每页默认显示的数量
        done: function(){
        }
    });

    // 搜索
    var active = {
        reload: function() {
            //执行重载
            table.reload("payoneerAcctTable", {
                where: {
                    status: $("#payoneerAcctSearchForm [name='status']").val(),
                    acct: $("#payoneerAcctSearchForm [name='acct']").val(),
                    auditStatus:$("#payoneerAcctSearchForm [name='auditStatus']").val()
                },
            });
        },
    };

    $("#payoneerSearch").click(function() {
        console.log(11)
        var type = $(this).data("type");
        active[type] ? active[type].call(this) : "";
    });

    // 新增账号
    $("#addAcct_payoneerAccount").click(function() {
        var popIndex = layer.open({
            type: 1,
            title: "新建payoneer账号",
            area: ["550px", "300px"],
            shadeClose: false,
            content: $("#addPayoneerInfoLayer").html(),
            btn: ["新建","关闭"],
            success: function(layero) {
            },
            yes: function () {
                var data = {
                    acct: $('#payoneerAccountAddForm [name=acct]').val(),
                    remark: $('#payoneerAccountAddForm [name=remark]').val()
                }
                loading.show()
                $.ajax({
                    type: "POST",
                    url: ctx + "/payoneer/createAcct.html",
                    contentType: "application/json;charset=utf-8",
                    data: JSON.stringify(data),
                    dataType: "json",
                    success: function(returnData) {
                        if (returnData.code == "0000") {
                            layer.close(popIndex)
                            active.reload()
                        } else {
                            layer.msg(returnData.msg);
                        }
                    },
                    error: function() {
                        layer.msg("服务器正忙");
                    },
                    complete: function () {
                        loading.hide()
                    }
                });
            }
        });
    });


    //工具条的监听事件,table.on(tool(表格的lay-filter的值))
    table.on("tool(payoneerAcctTable)", function(obj) {
        var data = obj.data, //获得当前行数据
            //getTpl = $("#detailM").html(), //获取模板引擎的内容
            layEvent = obj.event; //获得 lay-event 对应的值

        if (layEvent === "edit") {
            var index = layer.open({
                type: 1,
                title: "编辑账号信息",
                area: ['550px', '300px'],
                shadeClose: false,
                btn: ["保存", "关闭"],
                content: $("#addPayoneerInfoLayer").html(),
                success: function(layero, index) {
                    $('#payoneerAccountAddForm [name=acct]').val(data.acct)
                    $('#payoneerAccountAddForm [name=remark]').val(data.remark)
                },
                yes: function(layero){
                    var Adata = {
                        id: data.id,
                        acct:  $('#payoneerAccountAddForm [name=acct]').val(),
                        remark:  $('#payoneerAccountAddForm [name=remark]').val()
                    }
                    loading.show()
                    $.ajax({
                        type: "POST",
                        url: ctx + "/payoneer/editAcct.html",
                        contentType: "application/json;charset=utf-8",
                        data: JSON.stringify(Adata),
                        dataType: "json",
                        success: function(returnData) {
                            if (returnData.code == "0000") {
                                layer.close(index)
                                active.reload()
                            } else {
                                layer.msg(returnData.msg);
                            }
                        },
                        error: function() {
                            layer.msg("服务器正忙");
                        },
                        complete: function () {
                            loading.hide()
                        }
                    });
                }
            });
        } else if (layEvent == 'toBindAcct') {
            var index = layer.open({
                type: 1,
                title: "账号授权",
                area: ['800px', '300px'],
                shadeClose: false,
                content: $("#payoneerRestfulTokenModalLayer").html(),
                btn: ["关闭"],
                success: function(layero, index) {
                    var Adata = {
                        payeeId: data.payeeId
                    }
                    loading.show()
                    $.ajax({
                        type: "POST",
                        url: ctx + "/payoneer/getBindUrl.html",
                        contentType: "application/json;charset=utf-8",
                        data: JSON.stringify(Adata),
                        dataType: "json",
                        success: function(returnData) {
                            if (returnData.code == "0000") {
                                $('#payoneerRestfulTokenAddForm [name=autoUrl]').val(returnData.data)
                            } else {
                                layer.msg(returnData.msg);
                            }
                        },
                        error: function() {
                            layer.msg("服务器正忙");
                        },
                        complete: function () {
                            loading.hide()
                        }
                    });
                }
            });
        } else if (layEvent == 'refreshStatus') {
            var Adata = {
                idList: [data.id]
            }
            loading.show()
            $.ajax({
                type: "POST",
                url: ctx + "/payoneer/freshAcctStatus.html",
                contentType: "application/json;charset=utf-8",
                data: JSON.stringify(Adata),
                dataType: "json",
                success: function(returnData) {
                    if (returnData.code == "0000") {
                        layer.msg("刷新成功")
                        active.reload()
                    } else {
                        layer.msg(returnData.msg);
                    }
                },
                error: function() {
                    layer.msg("服务器正忙");
                },
                complete: function () {
                    loading.hide()
                }
            })
        } else if (layEvent == 'refreshToken') {
            var Adata = {
                idList: [data.id]
            }
            loading.show()
            $.ajax({
                type: "POST",
                url: ctx + "/payoneer/refreshAccessToken.html",
                contentType: "application/json;charset=utf-8",
                data: JSON.stringify(Adata),
                dataType: "json",
                success: function(returnData) {
                    if (returnData.code == "0000") {
                        layer.msg("刷新成功")
                        active.reload()
                    } else {
                        layer.msg(returnData.msg);
                    }
                },
                error: function() {
                    layer.msg("服务器正忙");
                },
                complete: function () {
                    loading.hide()
                }
            })
        } else if (layEvent == 'refreshBalance') {
            var Adata = {
                idList: [data.id]
            }
            loading.show()
            $.ajax({
                type: "POST",
                url: ctx + "/payoneer/getBalance.html",
                contentType: "application/json;charset=utf-8",
                data: JSON.stringify(Adata),
                dataType: "json",
                success: function(returnData) {
                    if (returnData.code == "0000") {
                        layer.msg("刷新成功")
                        active.reload()
                    } else {
                        layer.msg(returnData.msg);
                    }
                },
                error: function() {
                    layer.msg("服务器正忙");
                },
                complete: function () {
                    loading.hide()
                }
            })
        }
    });

    // 批量操作
    form.on('select(operListBtn_payoneerAccount)', function (data) {
        var optionNum = data.value;
        if (1 == optionNum) {
            var acctIds = getStoreAcctIds();
            var AData = {
                idList: acctIds
            }
            if (acctIds.length < 1) {
                layer.msg("请至少选择1个账号");
                return;
            }
            loading.show()
            $.ajax({
                type: "POST",
                url: ctx + "/payoneer/refreshAccessToken.html",
                contentType: "application/json;charset=utf-8",
                data: JSON.stringify(AData),
                dataType: "json",
                success: function(returnData) {
                    if (returnData.code == "0000") {
                        layer.msg("刷新成功")
                        active.reload()
                    } else {
                        layer.msg(returnData.msg);
                    }
                },
                error: function() {
                    layer.msg("服务器正忙");
                },
                complete: function () {
                    loading.hide()
                }
            })
        } else if (2 == optionNum) {
            var acctIds = getStoreAcctIds();
            var AData = {
                idList: acctIds
            }
            if (acctIds.length < 1) {
                layer.msg("请至少选择1个账号");
                return;
            }
            loading.show()
            $.ajax({
                type: "POST",
                url: ctx + "/payoneer/freshAcctStatus.html",
                contentType: "application/json;charset=utf-8",
                data: JSON.stringify(AData),
                dataType: "json",
                success: function(returnData) {
                    if (returnData.code == "0000") {
                        layer.msg("刷新成功")
                        active.reload()
                    } else {
                        layer.msg(returnData.msg);
                    }
                },
                error: function() {
                    layer.msg("服务器正忙");
                },
                complete: function () {
                    loading.hide()
                }
            })
        } else if (3 == optionNum) {
            var acctIds = getStoreAcctIds();
            var AData = {
                idList: acctIds
            }
            if (acctIds.length < 1) {
                layer.msg("请至少选择1个账号");
                return;
            }
            loading.show()
            $.ajax({
                type: "POST",
                url: ctx + "/payoneer/getBalance.html",
                contentType: "application/json;charset=utf-8",
                data: JSON.stringify(AData),
                dataType: "json",
                success: function(returnData) {
                    if (returnData.code == "0000") {
                        layer.msg("刷新成功")
                        active.reload()
                    } else {
                        layer.msg(returnData.msg);
                    }
                },
                error: function() {
                    layer.msg("服务器正忙");
                },
                complete: function () {
                    loading.hide()
                }
            })
        }
    })

    function getStoreAcctIds(){
        var acctIds = [];
        var checkStatus = table.checkStatus('payoneerAcctTable'); //test即为基础参数id对应的值
        var checkAcctNum = checkStatus.data.length;
        if (checkAcctNum == null || checkAcctNum < 1) {
            return acctIds;
        }
        var acctData = checkStatus.data;
        for (var index in acctData) {
            var obj = acctData[index];
            acctIds.push(acctData[index].id);
        }
        return acctIds;
    }
});


// 获取余额
function getBalanceByCurrencyAndAcctList(currency,acctList) {
    if (!acctList || acctList.length == 0) {
        return ''
    }
    for (var i in acctList) {
        if (currency == acctList[i].currency) {
            return acctList[i].balance
        }
    }
    return ''
}