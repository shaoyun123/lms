/**
 * time: 2018/01/02
 */
var queryPage_payOrder,queryPage2_payOrder,active_payOrder

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
    $("#resetBtn_payOrder").click(function () {
        $("form[name=searchForm_payOrder] [name]:not(.hiddenContent)").val('')
        form.render('select')
    })

    queryPage_payOrder = function (obj) {
        var data = {
            payType: 1,
            orderBy: 'id desc',
            status: true
        }
        if (obj) {
            $.extend(data, obj);
        }
        table.render({
            elem: "#payOrderTab",
            method: "post",
            url: ctx + "/sysPaypalPayOrder/getPayOrderPage.html",
            where: data,
            cols: [
                [
                    //标题栏
                    {field: 'payImgUrl', title:'图片', templet: '#payImg', width:66},
                    {field: "companyName", title: "公司"},
                    {field: "channel", title: "平台"},
                    {field: "fromPaypalEmail", title: "付款账号"},
                    {field: "toPaypalEmail", title: "对方账号"},
                    {field: "amount", title: "金额",templet: '<div>{{d.currencyCode}}:{{d.amount}}</div>'},
                    {field: "reason", title: "打款原因"},
                    {field: "remark", title: "备注",templet:'#remark_payOrder'},
                    {field: "checkRemark", title: "审核备注",templet:'#checkRemark_payOrder'},
                    {field: "checkStatus", title: "状态", templet: '#payOrderStatus'},
                    {field: "transactionId", title: "PPID"},
                    {field: "creator", title: "创建人"},
                    {field: "creatTime", title: "创建时间", templet: '<div>{{Format(new Date(d.createTime), "yyyy-MM-dd hh:mm:ss")}}</div>'},
                    //绑定工具条
                    {title: '操作', align: 'center', toolbar: '#payOrder_bar'}
                ],
            ],
            id: 'payOrderReloadTable',
            page: true,
            limits: [100, 500, 1000],
            limit: 100,
            done:function(){
                // theadHandle().fixTh({id:'#payorderCard',h:'300'});
            }
        });
    }

    // 表格数据重载
    active_payOrder = {
        reload: function(data){
            //执行重载
            table.reload('payOrderReloadTable', {
                page: {
                    curr: 1 //重新从第 1 页开始
                }
                ,where: data
            });
        }
    }

    // 标签搜索
    queryPage2_payOrder = function (checkStatus) {
        // 设置 checkStatus  和 payStatus 的值
        $('form[name=searchForm_payOrder] [name=checkStatus]').val(checkStatus)
        searchForPayOrder(true)
    }

    //展示已知数据
    searchForPayOrder()

    // 统计待审核数量
    function countPayOrder (data) {
        console.log(data)
        var ajax = new Ajax()
        ajax.post({
            url: ctx + "/sysPaypalPayOrder/countPayOrder.html",
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function (res) {
                if (res.code == '0000') {
                    $('#waitToCheckNum').text(res.data.waitCheckNum)
                    $('#HasCheckedNum').text(res.data.hadCheckedNum)
                    $('#failNum').text(res.data.failNum)
                    $('#paidNum').text(res.data.paidNum)
                    $('#totalNum').text(res.data.totalNum)
                }
            }
        })
    }

    //初始化2个日期框
    laydate.render({
        elem: '#beginDate_payOrder'
        , type:'datetime'
    });
    laydate.render({
        elem: '#endDate_payOrder'
       , type:'datetime'
       ,ready: function (date) {
        $(".layui-laydate-footer [lay-type='datetime'].laydate-btns-time").click();
        $(".laydate-main-list-0 .layui-laydate-content li ol li:last-child").click();
        $(".layui-laydate-footer [lay-type='date'].laydate-btns-time").click();
       }
    });

    // 搜索按钮
    $('#searchPaypalBtn_payO').click(function () {
        searchForPayOrder(true)
    })

    function searchForPayOrder(ifReload) {
        var data ={
            toPaypalEmail: '',
            amount: '',
            remark: '',
            checkRemark: '',
            transactionId: '',
            creator: '',
            checkUserName: '',
            payType: 1,
            fromPaypalEmail : $('form[name=searchForm_payOrder] [name=paypalEmail]').val(),
            reason : $('form[name=searchForm_payOrder] [name=reason]').val(),
            channel : $('form[name=searchForm_payOrder] [name=channel]').val(),
            checkStatus: $('form[name=searchForm_payOrder] [name=checkStatus]').val(),
            beginDate : $('form[name=searchForm_payOrder] #beginDate_payOrder').val().trim(),
            endDate : $('form[name=searchForm_payOrder] #endDate_payOrder').val().trim()
        }
        var searchType = $('form[name=searchForm_payOrder] [name=searchType]').val()
        if (searchType) {
            data[searchType] = $('form[name=searchForm_payOrder] [name=searchData]').val().trim()
        }
        if (ifReload) {
            active_payOrder.reload(data)
        } else {
            queryPage_payOrder(data)
        }
        checkNull(data)
        countPayOrder(data)
    }


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
                    var paypalEmailSelect = $("form[name=searchForm_payOrder] [name=paypalEmail]")
                    var paypalEmailSelectAvailable = $("form[name=searchForm_payOrder] [name=paypalEmail_available]")
                    for (var i = 0;i < list.length; ++i) {
                        obj = $('<option value="'+ list[i].paypalEmail +'" data-company="'+ list[i].belongsCompany +'">'+ list[i].paypalEmail +'</option>')
                        paypalEmailSelect.append(obj)
                        if (list[i].status == true) {
                            paypalEmailSelectAvailable.append(obj.clone())
                        }
                    }
                    form.render('select')

                }
            }
        })

        // 查询可付paypal账号
        var ajax = new Ajax()
        ajax.post({
            url: ctx + "/sysPaypalEmail/queryPayAbleAcct.html",
            contentType: 'application/json',
            success: function (res) {
                if (res.code == '0000') {
                    var list = res.data.sort(admin.compare('paypalEmail'))
                    var obj
                    var paypalEmailSelectAvailable = $("form[name=searchForm_payOrder] [name=paypalEmail_payAble]")
                    for (var i = 0;i < list.length; ++i) {
                        obj = $('<option value="'+ list[i].paypalEmail +'" data-company="'+ list[i].belongsCompany +'">'+ list[i].paypalEmail +'</option>')
                        if (list[i].status == true) {
                            paypalEmailSelectAvailable.append(obj)
                        }
                    }
                    form.render('select')

                }
            }
        })
    }

    // 初始化授权账号
    initSelect()
    // 初始化 币种和 打款原因 可选公司选项
    initSelectIcon(form,'PAY_ORDER_CURRENCY','form[name=searchForm_payOrder] [name=currencyCode]')
    initSelectIcon(form,'PAY_ORDER_REASON','form[name=searchForm_payOrder] [name=reason]')
    initSelectIcon(form, 'COMPANY_NAME', 'form[name=searchForm_payOrder] [name=companyName]')
    // 新建打款单
    $('#addPayOrder').click(function () {
        var index = layer.open({
            type: 1,
            title: "新建打款单",
            area: ["50%", "70%"],
            shadeClose: false,
            content: $("#add_pay_order_pop").html(),
            btn: ['创建', '关闭'],
            success: function (layero, index) {
                // 设置公司
                $('#addPayOrderForm [name=companyName]').html($('form[name=searchForm_payOrder] [name=companyName]').html())
                // // 初始化可选账号
                $("#addPayOrderForm [name=fromPaypalEmail]").html($("form[name=searchForm_payOrder] [name=paypalEmail_payAble]").html())

                // 设置币种
                $("#addPayOrderForm [name=currencyCode]").html($("form[name=searchForm_payOrder] [name=currencyCode]").html())
                // 设置打款原因
                $("#addPayOrderForm [name=reason]").html($("form[name=searchForm_payOrder] [name=reason]").html())
                
                form.render('select');
                // // 绑定筛选事件
                // form.on('select(companySelect_payOrder)', function(data){
                //     var companyName = data.value
                //     var filterByCompanyOption = $("form[name=searchForm_payOrder] [name=paypalEmail] [data-company="+ companyName +"]").clone(true)
                //     $("#addPayOrderForm [name=fromPaypalEmail]").html('')
                //     var option
                //     for (var i = 0; i < filterByCompanyOption.length; ++i) {
                //         $("#addPayOrderForm [name=fromPaypalEmail]").append(filterByCompanyOption[i])
                //     }
                //     form.render('select')
                // });
            },
            yes: function () {
                var data = {
                    payType: 1,
                    companyName: $("#addPayOrderForm [name=companyName]").val().trim(),
                    channel: $("#addPayOrderForm [name=channel]").val().trim(),
                    fromPaypalEmail: $("#addPayOrderForm [name=fromPaypalEmail]").val().trim(),
                    toPaypalEmail: $("#addPayOrderForm [name=toPaypalEmail]").val().trim(),
                    currencyCode: $("#addPayOrderForm [name=currencyCode]").val().trim(),
                    amount: $("#addPayOrderForm [name=amount]").val().trim(),
                    reason: $("#addPayOrderForm [name=reason]").val().trim(),
                    remark: $("#addPayOrderForm [name=remark]").val().trim()
                }
                if (!data.companyName) {
                    layer.msg('请选择公司')
                    return
                }
                if (!data.channel) {
                    layer.msg('请选择平台')
                    return
                }
                if (!data.fromPaypalEmail) {
                    layer.msg('请选择付款账号')
                    return
                }
                if (!data.toPaypalEmail) {
                    layer.msg('请输入对方账号')
                    return
                }
                if (!data.currencyCode) {
                    layer.msg('请输入币种')
                    return
                }
                if (!data.amount) {
                    layer.msg('请输入金额')
                    return
                }
                if (!data.reason) {
                    layer.msg('请选择打款原因')
                    return
                }
                var ajax = new Ajax(true)
                ajax.post({
                    url: ctx + "/sysPaypalPayOrder/addPayOrder.html",
                    data: JSON.stringify(data),
                    contentType: 'application/json',
                    success: function (data) {
                        if (data.code == '0000') {
                            layer.msg('操作成功')
                            searchForPayOrder(true)
                            layer.closeAll();
                        }
                    }
                })
            }
        });
    })

    //工具条的监听事件,table.on(tool(表格的lay-filter的值))
    table.on('tool(payOrderTab)', function (obj) {
        var data = obj.data, //获得当前行数据
            layEvent = obj.event; //获得 lay-event 对应的值
        if (layEvent == 'check') {
            layer.open({
                type: 1,
                title: "审核打款单",
                area: ["800px", "80%"],
                shadeClose: false,
                content: $("#add_pay_order_pop").html(),
                btn: ['保存', '关闭'],
                success: function (layero, index) {
                    // 设置公司
                    $('#addPayOrderForm [name=companyName]').html($('form[name=searchForm_payOrder] [name=companyName]').html())
                    // 设置可选账号
                    $("#addPayOrderForm [name=fromPaypalEmail]").html($("form[name=searchForm_payOrder] [name=paypalEmail]").html())
                    // 设置币种
                    $("#addPayOrderForm [name=currencyCode]").html($("form[name=searchForm_payOrder] [name=currencyCode]").html())
                    // 设置打款原因
                    $("#addPayOrderForm [name=reason]").html($("form[name=searchForm_payOrder] [name=reason]").html())
                    // 显示审核域
                    $("#checkPayOrderForm").removeAttr('hidden')
                    // 初始化数据
                    $("#addPayOrderForm [name=companyName]").val(data.companyName)
                    $("#addPayOrderForm [name=channel]").val(data.channel)
                    $("#addPayOrderForm [name=fromPaypalEmail]").val(data.fromPaypalEmail)
                    $("#addPayOrderForm [name=toPaypalEmail]").val(data.toPaypalEmail)
                    $("#addPayOrderForm [name=currencyCode]").val(data.currencyCode)
                    $("#addPayOrderForm [name=amount]").val(data.amount)
                    $("#addPayOrderForm [name=reason]").val(data.reason)
                    $("#addPayOrderForm [name=remark]").val(data.remark)

                    $("#checkPayOrderForm [name=checkStatus]").val(data.checkStatus)
                    $("#checkPayOrderForm [name=checkRemark]").val(data.checkRemark)

                    // 数据不可更改设置
                    $("#addPayOrderForm [name=companyName]").attr('readonly','readonly')
                    $("#addPayOrderForm [name=channel]").attr('readonly','readonly')
                    $("#addPayOrderForm [name=fromPaypalEmail]").attr('readonly','readonly')
                    $("#addPayOrderForm [name=toPaypalEmail]").attr('readonly','readonly')
                    $("#addPayOrderForm [name=currencyCode]").attr('readonly','readonly')
                    $("#addPayOrderForm [name=amount]").attr('readonly','readonly')
                    $("#addPayOrderForm [name=reason]").attr('readonly','readonly')
                    $("#addPayOrderForm [name=remark]").attr('readonly','readonly')

                    form.render('select');
                },
                yes: function () {
                    var Adata = {
                        id : data.id,
                        checkStatus: $('#checkPayOrderForm [name=checkStatus]').val().trim(),
                        checkRemark: $('#checkPayOrderForm [name=checkRemark]').val().trim(),
                    }
                    if (!Adata.checkStatus) {
                        layer.msg('请选择审核结果')
                        return
                    }
                    var ajax = new Ajax(true)
                    ajax.post({
                        url: ctx + "/sysPaypalPayOrder/checkPayOrder.html",
                        data: JSON.stringify(Adata),
                        contentType: 'application/json',
                        success: function (data) {
                            if (data.code == '0000') {
                                layer.msg('操作成功')
                                searchForPayOrder(true)
                                // 隐藏审核域
                                $("#checkPayOrderForm").attr('hidden','hidden')
                                // 移除 数据不可更改设置
                                $("#addPayOrderForm [name=companyName]").removeAttr('readonly')
                                $("#addPayOrderForm [name=channel]").removeAttr('readonly')
                                $("#addPayOrderForm [name=fromPaypalEmail]").removeAttr('readonly')
                                $("#addPayOrderForm [name=toPaypalEmail]").removeAttr('readonly')
                                $("#addPayOrderForm [name=currencyCode]").removeAttr('readonly')
                                $("#addPayOrderForm [name=amount]").removeAttr('readonly')
                                $("#addPayOrderForm [name=reason]").removeAttr('readonly')
                                $("#addPayOrderForm [name=remark]").removeAttr('readonly')
                                layer.closeAll();
                            }
                        }
                    })
                },
                end: function () {
                    // 隐藏审核域
                    $("#checkPayOrderForm").attr('hidden','hidden')
                    // 移除 数据不可更改设置
                    $("#addPayOrderForm [name=companyName]").removeAttr('readonly')
                    $("#addPayOrderForm [name=channel]").removeAttr('readonly')
                    $("#addPayOrderForm [name=fromPaypalEmail]").removeAttr('readonly')
                    $("#addPayOrderForm [name=toPaypalEmail]").removeAttr('readonly')
                    $("#addPayOrderForm [name=currencyCode]").removeAttr('readonly')
                    $("#addPayOrderForm [name=amount]").removeAttr('readonly')
                    $("#addPayOrderForm [name=reason]").removeAttr('readonly')
                    $("#addPayOrderForm [name=remark]").removeAttr('readonly')
                }
            });
        } else if (layEvent === 'rebackInp') {
            layer.open({
                type: 1,
                title: "回填打款单",
                area: ["800px", "80%"],
                shadeClose: false,
                content: $("#add_pay_order_pop").html(),
                btn: ['保存', '关闭'],
                success: function (layero, index) {
                    // 设置公司
                    $('#addPayOrderForm [name=companyName]').html($('form[name=searchForm_payOrder] [name=companyName]').html())
                    // 设置可选账号
                    $("#addPayOrderForm [name=fromPaypalEmail]").html($("form[name=searchForm_payOrder] [name=paypalEmail]").html())
                    // 设置币种
                    $("#addPayOrderForm [name=currencyCode]").html($("form[name=searchForm_payOrder] [name=currencyCode]").html())
                    // 设置打款原因
                    $("#addPayOrderForm [name=reason]").html($("form[name=searchForm_payOrder] [name=reason]").html())

                    // 显示回填域
                    $("#rebackInpForm").removeAttr('hidden')
                    // 初始化数据
                    $("#addPayOrderForm [name=companyName]").val(data.companyName)
                    $("#addPayOrderForm [name=channel]").val(data.channel)
                    $("#addPayOrderForm [name=fromPaypalEmail]").val(data.fromPaypalEmail)
                    $("#addPayOrderForm [name=toPaypalEmail]").val(data.toPaypalEmail)
                    $("#addPayOrderForm [name=currencyCode]").val(data.currencyCode)
                    $("#addPayOrderForm [name=amount]").val(data.amount)
                    $("#addPayOrderForm [name=reason]").val(data.reason)
                    $("#addPayOrderForm [name=remark]").val(data.remark)

                    $("#rebackInpForm [name=transactionId]").val(data.transactionId)

                    // 数据不可更改设置
                    $("#addPayOrderForm [name=companyName]").attr('readonly','readonly')
                    $("#addPayOrderForm [name=channel]").attr('readonly','readonly')
                    $("#addPayOrderForm [name=fromPaypalEmail]").attr('readonly','readonly')
                    $("#addPayOrderForm [name=toPaypalEmail]").attr('readonly','readonly')
                    $("#addPayOrderForm [name=currencyCode]").attr('readonly','readonly')
                    $("#addPayOrderForm [name=amount]").attr('readonly','readonly')
                    $("#addPayOrderForm [name=reason]").attr('readonly','readonly')
                    $("#addPayOrderForm [name=remark]").attr('readonly','readonly')

                    form.render('select');
                },
                yes: function () {
                    var files = $('#rebackInpForm input[name=file]')[0].files
                    var transactionId = $("#rebackInpForm [name=transactionId]").val().trim()
                    // 如果没有文件则终止
                    var origineImg = data.payImgUrl
                    if (files.length ==0 && !origineImg) {
                        layer.msg('请上传打款截图')
                        return
                    }
                    if (!transactionId.trim()) {
                        layer.msg('请填写paypal交易ID')
                        return
                    }
                    var formData = new FormData();
                    formData.append("payImgUrl", origineImg)
                    formData.append("file",files[0]);
                    formData.append("transactionId",transactionId);
                    formData.append("id",data.id);
                    loading.show()
                    window.setTimeout(function () {
                        $.ajax({
                            url: ctx + "/sysPaypalPayOrder/rebackPayOrder.html",
                            type : 'POST',
                            async : false,
                            data : formData,
                            // 告诉jQuery不要去处理发送的数据
                            processData : false,
                            // 告诉jQuery不要去设置Content-Type请求头
                            contentType : false,
                            success: function (data) {
                                loading.hide()
                                if (data.code === '0000') {
                                    searchForPayOrder(true)
                                    // 隐藏回填
                                    $("#rebackInpForm").attr('hidden','hidden')
                                    // 移除 数据不可更改设置
                                    $("#addPayOrderForm [name=companyName]").removeAttr('readonly')
                                    $("#addPayOrderForm [name=channel]").removeAttr('readonly')
                                    $("#addPayOrderForm [name=fromPaypalEmail]").removeAttr('readonly')
                                    $("#addPayOrderForm [name=toPaypalEmail]").removeAttr('readonly')
                                    $("#addPayOrderForm [name=currencyCode]").removeAttr('readonly')
                                    $("#addPayOrderForm [name=amount]").removeAttr('readonly')
                                    $("#addPayOrderForm [name=reason]").removeAttr('readonly')
                                    $("#addPayOrderForm [name=remark]").removeAttr('readonly')
                                    layer.closeAll();
                                    layer.msg('操作成功')
                                } else {
                                    layer.msg(data.msg)
                                }
                            }
                        })
                    },300)
                },
                end: function () {
                    // 隐藏审核域
                    $("#checkPayOrderForm").attr('hidden','hidden')
                    // 移除 数据不可更改设置
                    $("#addPayOrderForm [name=companyName]").removeAttr('readonly')
                    $("#addPayOrderForm [name=channel]").removeAttr('readonly')
                    $("#addPayOrderForm [name=fromPaypalEmail]").removeAttr('readonly')
                    $("#addPayOrderForm [name=toPaypalEmail]").removeAttr('readonly')
                    $("#addPayOrderForm [name=currencyCode]").removeAttr('readonly')
                    $("#addPayOrderForm [name=amount]").removeAttr('readonly')
                    $("#addPayOrderForm [name=reason]").removeAttr('readonly')
                    $("#addPayOrderForm [name=remark]").removeAttr('readonly')
                }
            });
        } else if (layEvent == 'update') {
            layer.open({
                type: 1,
                title: "修改打款单",
                area: ["800px", "80%"],
                shadeClose: false,
                content: $("#add_pay_order_pop").html(),
                btn: ['保存', '关闭'],
                success: function (layero, index) {
                    // 设置公司
                    $('#addPayOrderForm [name=companyName]').html($('form[name=searchForm_payOrder] [name=companyName]').html())
                    // // 设置可选账号
                    $("#addPayOrderForm [name=fromPaypalEmail]").html($("form[name=searchForm_payOrder] [name=paypalEmail_payAble]").html())
                    // 设置币种
                    $("#addPayOrderForm [name=currencyCode]").html($("form[name=searchForm_payOrder] [name=currencyCode]").html())
                    // 设置打款原因
                    $("#addPayOrderForm [name=reason]").html($("form[name=searchForm_payOrder] [name=reason]").html())
                    // 初始化数据
                    $("#addPayOrderForm [name=companyName]").val(data.companyName)
                    $("#addPayOrderForm [name=channel]").val(data.channel)
                    $("#addPayOrderForm [name=fromPaypalEmail]").val(data.fromPaypalEmail)
                    $("#addPayOrderForm [name=toPaypalEmail]").val(data.toPaypalEmail)
                    $("#addPayOrderForm [name=currencyCode]").val(data.currencyCode)
                    $("#addPayOrderForm [name=amount]").val(data.amount)
                    $("#addPayOrderForm [name=reason]").val(data.reason)
                    $("#addPayOrderForm [name=remark]").val(data.remark)
                    form.render('select');
                },
                yes: function () {
                    var Adata = {
                        id : data.id,
                        companyName: $("#addPayOrderForm [name=companyName]").val().trim(),
                        channel: $("#addPayOrderForm [name=channel]").val().trim(),
                        fromPaypalEmail: $("#addPayOrderForm [name=fromPaypalEmail]").val().trim(),
                        toPaypalEmail: $("#addPayOrderForm [name=toPaypalEmail]").val().trim(),
                        currencyCode: $("#addPayOrderForm [name=currencyCode]").val().trim(),
                        amount: $("#addPayOrderForm [name=amount]").val().trim(),
                        reason: $("#addPayOrderForm [name=reason]").val().trim(),
                        remark: $("#addPayOrderForm [name=remark]").val().trim()
                    }
                    if (!Adata.companyName) {
                        layer.msg('请选择公司')
                        return
                    }
                    if (!Adata.channel) {
                        layer.msg('请选择平台')
                        return
                    }
                    if (!Adata.fromPaypalEmail) {
                        layer.msg('请选择付款账号')
                        return
                    }
                    if (!Adata.toPaypalEmail) {
                        layer.msg('请输入对方账号')
                        return
                    }
                    if (!Adata.currencyCode) {
                        layer.msg('请输入币种')
                        return
                    }
                    if (!Adata.amount) {
                        layer.msg('请输入金额')
                        return
                    }
                    if (!Adata.reason) {
                        layer.msg('请选择打款原因')
                        return
                    }
                    var ajax = new Ajax(true)
                    ajax.post({
                        url: ctx + "/sysPaypalPayOrder/updPayOrder.html",
                        data: JSON.stringify(Adata),
                        contentType: 'application/json',
                        success: function (data) {
                            if (data.code == '0000') {
                                layer.msg('操作成功')
                                searchForPayOrder(true)
                                layer.closeAll();
                            }
                        }
                    })
                },
                end: function () {
                    // 隐藏审核域
                    $("#checkPayOrderForm").attr('hidden','hidden')
                    // 移除 数据不可更改设置
                    $("#addPayOrderForm [name=companyName]").removeAttr('readonly')
                    $("#addPayOrderForm [name=channel]").removeAttr('readonly')
                    $("#addPayOrderForm [name=fromPaypalEmail]").removeAttr('readonly')
                    $("#addPayOrderForm [name=toPaypalEmail]").removeAttr('readonly')
                    $("#addPayOrderForm [name=currencyCode]").removeAttr('readonly')
                    $("#addPayOrderForm [name=amount]").removeAttr('readonly')
                    $("#addPayOrderForm [name=reason]").removeAttr('readonly')
                    $("#addPayOrderForm [name=remark]").removeAttr('readonly')
                }
            });
        } else if (layEvent == 'delete') {
            layer.confirm('确认删除该打款单吗？',{
               btn: ['确认', '取消']
            }, function () {
                var Adata = {
                    id : data.id,
                    status: false
                }
                var ajax = new Ajax(true)
                ajax.post({
                    url: ctx + "/sysPaypalPayOrder/updPayOrder.html",
                    data: JSON.stringify(Adata),
                    contentType: 'application/json',
                    success: function (data) {
                        if (data.code == '0000') {
                            layer.msg('操作成功')
                            searchForPayOrder(true)
                            layer.closeAll();
                        }
                    }
                })
            }, function () {
                layer.closeAll()
            })
        }
    });

    $('#exportOrder').click(function () {
        var data ={
            payType: 1,
            status: '1',
            fromPaypalEmail : $('form[name=searchForm_payOrder] [name=paypalEmail]').val(),
            reason : $('form[name=searchForm_payOrder] [name=reason]').val(),
            channel : $('form[name=searchForm_payOrder] [name=channel]').val(),
            checkStatus: $('form[name=searchForm_payOrder] [name=checkStatus]').val(),
            beginDate : $('form[name=searchForm_payOrder] #beginDate_payOrder').val(),
            endDate : $('form[name=searchForm_payOrder] #endDate_payOrder').val()
        }
        if (!data.beginDate.trim()) {
            layer.msg('请选择一个开始日期')
            return
        }

        var form = $("<form></form>");
        form.attr('action',ctx + '/sysPaypalPayOrder/export.html');
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



