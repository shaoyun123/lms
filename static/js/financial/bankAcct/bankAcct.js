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
    $("#resetBtn_bankAcct").click(function () {
        $("form[name=searchForm_bankAcct] [name]:not(.hiddenContent)").val('')
        form.render('select')
    })

    function queryPage_bankAcct (obj) {
        var data = {
            payType: 1,
            orderBy: 'id desc',
            status: true
        }
        if (obj) {
            $.extend(data, obj);
        }
        table.render({
            elem: "#bankAcctTab",
            method: "post",
            url: ctx + "/msgBankAcct/queryLogPage.html",
            where: data,
            cols: [
                [
                    //标题栏
                    {field: 'acctName', title:'账户名'},
                    {field: "creatTime", title: "时间", templet: '<div>{{Format(new Date(d.createTime), "yyyy-MM-dd hh:mm:ss")}}</div>'},
                    {field: "amount", title: "转入", templet: '<div>{{d.tradeType == 1 ? d.amount : ""}}</div>'},
                    {field: "amount", title: "转出", templet: '#tradeOutDiv_bankAcct'},
                    {field: "currentBalance", title: "余额"},
                    {field: "remark", title: "备注"},
                ],
            ],
            id: 'bankAcctReloadTable',
            page: true,
            limits: [100, 500, 1000],
            limit: 100,
            done: function(){
                $('#bankAcctTab').next('.layui-table-view').find('.layui-table-header').addClass('toFixedContain')
            }
        });
    }

    var active_bankAcct = {
        // 表格数据重载
        reload: function(data){
            //执行重载
            table.reload('bankAcctReloadTable', {
                page: {
                    curr: 1 //重新从第 1 页开始
                }
                ,where: data
            });
        }
    }

    //展示已知数据
    searchForPayOrder()

    //初始化2个日期框
    laydate.render({
        elem: '#beginDate_bankAcct'
        , type:'datetime'
    });
    laydate.render({
        elem: '#endDate_bankAcct'
       , type:'datetime'
       ,ready: function () {
        $(".layui-laydate-footer [lay-type='datetime'].laydate-btns-time").click();
        $(".laydate-main-list-0 .layui-laydate-content li ol li:last-child").click();
        $(".layui-laydate-footer [lay-type='date'].laydate-btns-time").click();
       }
    });

    // 搜索按钮
    $('#search_bankAcct').click(function () {
        searchForPayOrder(true)
    })

    // 查询方法
    function searchForPayOrder(ifReload) {
        var data ={
            receiveAcctId: $('form[name=searchForm_bankAcct] [name=receiveAcctId]').val(),
            bankAcctId: $('form[name=searchForm_bankAcct] [name=bankAcctId]').val(),
            beginDate : $('form[name=searchForm_bankAcct] #beginDate_bankAcct').val(),
            endDate : $('form[name=searchForm_bankAcct] #endDate_bankAcct').val()
        }
        if (ifReload) {
            active_bankAcct.reload(data)
        } else {
            queryPage_bankAcct(data)
        }
        checkNull(data)
    }

    // 充值
    $('#addmoney_bankAcct').click(function () {
        var index = layer.open({
            type: 1,
            title: "充值",
            area: ["30%", "45%"],
            shadeClose: false,
            content: $("#add_money_pop").html(),
            btn: ['充值', '关闭'],
            success: function (layero, index) {
                // 初始化必填项
                initNotNull()
                // 初始化收款账户名选项
                $('#addMoneyForm [name=bankAcctId]').html($('form[name=searchForm_bankAcct] [name=bankAcctId]').html())
                $('#addMoneyForm [name=bankAcctId] option')[0].text = ''
                // 绑定选择事件--赋值收款账号
                form.on('select(add_money_bankAcctId)', function(data){
                    var self = $('#addMoneyForm [name=bankAcctId] option:selected')
                    $('#addMoneyForm [name=cardNo]').val(self.attr('data-cardNo'))
                });
                form.render('select');
            },
            yes: function () {

                var Adata = {
                    bankAcctId: $("#addMoneyForm [name=bankAcctId]").val().trim(),
                    amount: $("#addMoneyForm [name=amount]").val().trim(),
                    tradeType: 1,
                    remark: $("#addMoneyForm [name=remark]").val().trim()
                }
                // 校验必填项
                if (!checkNotNull('#addMoneyForm',layer)) {
                    return
                }

                var confirmId = layer.confirm('确认给账户:' + $("#addMoneyForm [name=bankAcctId] option:selected").text() + ' 充值' + Adata.amount + $("#addMoneyForm [name=currency] option:selected").text() +'吗',
                    {btn: ['确认' ,'取消']},
                    function () {
                        var ajax = new Ajax(true)
                        loading.show()
                        ajax.post({
                            url: ctx + "/msgBankAcct/assetChange.html",
                            data: JSON.stringify(Adata),
                            contentType: 'application/json',
                            success: function (data) {
                                loading.hide()
                                if (data.code == '0000') {
                                    layer.msg('操作成功')
                                    searchForPayOrder(true)
                                    layer.closeAll();
                                }
                            }
                        })
                    }, function () {
                        layer.close(confirmId)
                    }
                    )
            }
        });
    })

    //工具条的监听事件,table.on(tool(表格的lay-filter的值))
    table.on('tool(bankAcctTab)', function (obj) {
        var data = obj.data, //获得当前行数据
            layEvent = obj.event; //获得 lay-event 对应的值
        // 查看请款单详情
        if (layEvent == 'detail') {
            layer.open({
                type: 1,
                title: "请款单详情",
                area: ["70%", "80%"],
                shadeClose: false,
                content: $("#detail_money_request_pop").html(),
                btn: ['关闭'],
                success: function (layero, index) {
                    form.render('select');
                    var Adata = {
                        orderNo: data.remark
                    }
                    var ajax = new Ajax()
                    loading.show()
                    ajax.post({
                        url: ctx + '/msgMoneyRequest/detail.html',
                        data: JSON.stringify(Adata),
                        success: function (res) {
                            loading.hide()
                            if (res.code == '0000') {
                                var data = res.data
                                $("#moneyRequestDetailForm [name=payType]").val(data.payType == 1 ? '转账' : '充值')
                                $("#moneyRequestDetailForm [name=company]").val(data.company)
                                $("#moneyRequestDetailForm [name=receiveAcctName]").val(data.receiveAcctName)
                                $("#moneyRequestDetailForm [name=receiveAcct]").val(data.receiveAcct)
                                $("#moneyRequestDetailForm [name=currency]").val(data.currency)
                                $("#moneyRequestDetailForm [name=amount]").val(data.amount)
                                $("#moneyRequestDetailForm [name=requireUser]").val(data.requireUser)
                                $("#moneyRequestDetailForm [name=bankCardNo]").val(data.bankCardNo)
                                $("#moneyRequestDetailForm [name=bankAcctName]").val(data.bankAcctName)
                                $("#moneyRequestDetailForm [name=realOperator]").val(data.realOperator)
                                $("#moneyRequestDetailForm [name=checkUser]").val(data.checkUser)
                                $("#moneyRequestDetailForm [name=checkRemark]").val(data.checkRemark)
                                $("#moneyRequestDetailForm [name=remark]").val(data.remark)

                                if (data.extraFileUrl) {
                                    $("#extraFileDownLoadBtn_bankAcct").css("display","block")
                                    if (data.extraFileName) {
                                        $("#extraFileDownLoadBtn_bankAcct").text(data.extraFileName)
                                    }
                                    $("#extraFileDownLoadBtn_bankAcct").click(function () {
                                        downLoadExtraFile(data.extraFileName,data.extraFileUrl)
                                    })
                                }
                                if (data.rebackImgUrl) {
                                    $("#moneyRequestDetailForm [name=rebackImgUrl]").attr('src',data.rebackImgUrl)
                                }
                            } else {
                                layer.msg(res.msg)
                            }
                        }
                    })
                },
                yes: function () {
                   layer.closeAll()
                }
            });
        }
    });

    function downLoadExtraFile(fileName,fileSavePath) {
        if (!fileSavePath) {
            return
        }
        if (!fileName) {
            fileName = ''
        }
        var fileSaveName = fileSavePath.substring(fileSavePath.lastIndexOf('/') + 1,fileSavePath.length)
        var data = {
            fileName: fileName,
            fileSaveName: fileSaveName
        }
        submitForm(data,ctx + '/msgMoneyRequest/downExtraFile.html')
    }
});



