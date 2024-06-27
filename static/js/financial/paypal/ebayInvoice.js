/**
 * time: 2018/01/02
 */
var queryPage_ebayInvoice,queryPage2_ebayInvoice, active_ebayInvoice

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
    $("#resetBtn_ebayInvoice").click(function () {
        $("form[name=searchForm_ebayInvoice] [name]:not(.hiddenContent)").val('')
        form.render('select')
    })

    queryPage_ebayInvoice = function (obj) {
        var data = {
            payType: 2,
            orderBy: 'id desc',
            status: true
        }
        if (obj) {
            $.extend(data, obj);
        }
        table.render({
            elem: "#ebayInvoiceTab",
            method: "post",
            url: ctx + "/sysPaypalPayOrder/getPayOrderPage.html",
            where: data,
            cols: [
                [
                    //标题栏
                    {field: 'payImgUrl', title:'图片', templet: '#payImg_ebayInvoice', width:70},
                    {field: "companyName", title: "公司"},
                    {field: "fromPaypalEmail", title: "付款账号"},
                    {field: "toPaypalEmail", title: "ebay账号"},
                    {field: "amount", title: "金额",templet: '<div>{{d.currencyCode}}:{{d.amount}}</div>'},
                    {field: "remark", title: "备注",templet:'#remark_ebayInvoice'},
                    {field: "transactionId", title: "PPID"},
                    {field: "creator", title: "创建人"},
                    {field: "creatTime", title: "创建时间",templet: '<div>{{Format(new Date(d.createTime), "yyyy-MM-dd hh:mm:ss")}}</div>'},
                    {field: "checkStatus", title: "状态", templet: '#ebayInvoiceStatus'},
                    //绑定工具条
                    {title: '操作', align: 'center', toolbar: '#ebayInvoice_bar'}
                ],
            ],
            id: 'ebayInvoiceReloadTable',
            page: true,
            limits: [100, 500, 1000],
            limit: 100,
            done:function(){
                // theadHandle().fixTh({id:'#ebayinvoiceCard',h:'200',dv4:'.numcountModule',i:80});
                $('#ebayInvoiceTab').next('.layui-table-view').find('.layui-table-header').addClass('toFixedContain')
            }
        });
    }

    // 表格数据重载
    active_ebayInvoice = {
        reload: function(data){
            //执行重载
            table.reload('ebayInvoiceReloadTable', {
                page: {
                    curr: 1 //重新从第 1 页开始
                }
                ,where: data
            });
        }
    }


    // 标签搜索
    queryPage2_ebayInvoice = function (checkStatus) {
        // 设置 checkStatus  和 payStatus 的值
        $('form[name=searchForm_ebayInvoice] [name=checkStatus]').val(checkStatus)
        searchForEbayInvoice(true)
    }

    //展示已知数据
    searchForEbayInvoice()

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
                    $('#waitToCheckNum_ebayInvoice').text(res.data.waitCheckNum)
                    $('#HasCheckedNum_ebayInvoice').text(res.data.hadCheckedNum)
                    $('#failNum_ebayInvoice').text(res.data.failNum)
                    $('#totalNum_ebayInvoice').text(res.data.totalNum)
                }
            }
        })
    }

    //初始化2个日期框
    laydate.render({
        elem: '#beginDate_ebayInvoice'
        , type:'datetime'
    });
    laydate.render({
        elem: '#endDate_ebayInvoice'
        , type:'datetime'
        ,ready: function () {
          $(".layui-laydate-footer [lay-type='datetime'].laydate-btns-time").click();
          $(".laydate-main-list-0 .layui-laydate-content li ol li:last-child").click();
          $(".layui-laydate-footer [lay-type='date'].laydate-btns-time").click();
         }
    });

    // 搜索按钮
    $('#searchPaypalBtn_ebayInvoice').click(function () {
        searchForEbayInvoice(true)
    })

    function searchForEbayInvoice(ifReload) {
        var data ={
            toPaypalEmail: '',
            amount: '',
            remark: '',
            transactionId: '',
            creator: '',
            payType: 2,
            fromPaypalEmail : $('form[name=searchForm_ebayInvoice] [name=paypalEmail]').val(),
            reason : $('form[name=searchForm_ebayInvoice] [name=reason]').val(),
            channel : $('form[name=searchForm_ebayInvoice] [name=channel]').val(),
            checkStatus: $('form[name=searchForm_ebayInvoice] [name=checkStatus]').val(),
            beginDate : $('form[name=searchForm_ebayInvoice] #beginDate_ebayInvoice').val(),
            endDate : $('form[name=searchForm_ebayInvoice] #endDate_ebayInvoice').val()
        }
        var searchType = $('form[name=searchForm_ebayInvoice] [name=searchType]').val()
        if (searchType) {
            data[searchType] = $('form[name=searchForm_ebayInvoice] [name=searchData]').val()
        }
        if (ifReload) {
            active_ebayInvoice.reload(data)
        } else {
            queryPage_ebayInvoice(data)
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
                    var paypalEmailSelect = $("form[name=searchForm_ebayInvoice] [name=paypalEmail]")
                    var paypalEmailSelectAvailable = $("form[name=searchForm_ebayInvoice] [name=paypalEmail_available]")
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
    }

    function initEbayAcct() {
        var ajax = new Ajax()
        ajax.post({
            url: ctx + "/salesplat/listAcctByPlatCode.html",
            contentType: 'application/x-www-form-urlencoded',
            data: {platCode: 'ebay'},
            success: function (res) {
                if (res.code == '0000') {
                    var list = res.data.sort(admin.compare('storeName'))
                    var obj
                    var ebayAcctSelect = $("form[name=searchForm_ebayInvoice] [name=ebayAcct]")
                    for (var i = 0;i < list.length; ++i) {
                        obj = $('<option value="'+ list[i].storeAcct +'">'+ list[i].storeAcct +'</option>')
                        ebayAcctSelect.append(obj)
                    }
                    form.render('select')
                }
            }
        })
    }

    // 初始化可选ebay账号
    // initEbayAcct()
    // 初始化授权账号
    initSelect()
    initSelectIcon(form, 'COMPANY_NAME', 'form[name=searchForm_ebayInvoice] [name=companyName]')
    // 初始化打款币种
    initSelectIcon(form,'PAY_ORDER_CURRENCY','form[name=searchForm_ebayInvoice] [name=currencyCode]')
    // 新建结账单
    $('#addEbayInvoice').click(function () {
        var index = layer.open({
            type: 1,
            title: "新建结账单",
            area: ["50%", "70%"],
            shadeClose: false,
            content: $("#add_ebay_invoice_pop").html(),
            btn: ['创建', '关闭'],
            success: function (layero, index) {
                // 设置公司
                $('#addEbayInvoiceForm [name=companyName]').html($('form[name=searchForm_ebayInvoice] [name=companyName]').html())
                // // 初始化可选账号
                $("#addEbayInvoiceForm [name=fromPaypalEmail]").html($("form[name=searchForm_ebayInvoice] [name=paypalEmail_available]").html())
                $("#addEbayInvoiceForm [name=fromPaypalEmail] option")[0].text = ''
                // 初始化可选ebay账号
                // $("#addEbayInvoiceForm [name=toPaypalEmail]").html($("form[name=searchForm_ebayInvoice] [name=ebayAcct]").html())
                // 初始化可选币种
                $("#addEbayInvoiceForm [name=currencyCode]").html($("form[name=searchForm_ebayInvoice] [name=currencyCode]").html())

                form.render('select');
                // 绑定筛选事件
                form.on('select(companySelect_ebayInvoice)', function(data){
                    var companyName = data.value
                    var filterByCompanyOption = $("form[name=searchForm_ebayInvoice] [name=paypalEmail] [data-company="+ companyName +"]").clone(true)
                    $("#addEbayInvoiceForm [name=fromPaypalEmail]").html('')
                    var option
                    for (var i = 0; i < filterByCompanyOption.length; ++i) {
                        $("#addEbayInvoiceForm [name=fromPaypalEmail]").append(filterByCompanyOption[i])
                    }
                    form.render('select')
                });
            },
            yes: function () {
                var data = {
                    payType: 2,
                    companyName: $("#addEbayInvoiceForm [name=companyName]").val().trim(),
                    channel: $("#addEbayInvoiceForm [name=channel]").val().trim(),
                    fromPaypalEmail: $("#addEbayInvoiceForm [name=fromPaypalEmail]").val().trim(),
                    toPaypalEmail: $("#addEbayInvoiceForm [name=toPaypalEmail]").val().trim(),
                    currencyCode: $("#addEbayInvoiceForm [name=currencyCode]").val(),
                    amount: $("#addEbayInvoiceForm [name=amount]").val().trim(),
                    remark: $("#addEbayInvoiceForm [name=remark]").val().trim(),
                    transactionId: $("#addEbayInvoiceForm [name=transactionId]").val().trim()
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
                if (!data.transactionId) {
                    layer.msg('paypal交易ID')
                    return
                }
                var files = $('#addEbayInvoiceForm input[name=file]')[0].files

                var formData = new FormData();
                if (files[0]) {
                    formData.append("file",files[0]);
                }
                for (var key in data) {
                    formData.append(key, data[key]);
                }
                $.ajax({
                    url: ctx + "/sysPaypalPayOrder/addEbayInvoice.html",
                    type : 'POST',
                    async : false,
                    data : formData,
                    // 告诉jQuery不要去处理发送的数据
                    processData : false,
                    // 告诉jQuery不要去设置Content-Type请求头
                    contentType : false,
                    success: function (data) {
                        if (data.code == '0000') {
                            searchForEbayInvoice(true)
                            layer.closeAll();
                            layer.msg('操作成功')
                        } else {
                            layer.msg(data.msg)
                        }
                    }
                })
            }
        });
    })

    //工具条的监听事件,table.on(tool(表格的lay-filter的值))
    table.on('tool(ebayInvoiceTab)', function (obj) {
        var data = obj.data, //获得当前行数据
            layEvent = obj.event; //获得 lay-event 对应的值
        if (layEvent == 'update') {
            layer.open({
                type: 1,
                title: "修改结账单",
                area: ["800px", "80%"],
                shadeClose: false,
                content: $("#add_ebay_invoice_pop").html(),
                btn: ['保存', '关闭'],
                success: function (layero, index) {
                    console.log(111)
                    // 设置公司
                    $('#addEbayInvoiceForm [name=companyName]').html($('form[name=searchForm_ebayInvoice] [name=companyName]').html())
                    // 初始化可选账号
                    $("#addEbayInvoiceForm [name=fromPaypalEmail]").html($("form[name=searchForm_ebayInvoice] [name=paypalEmail_available]").html())
                    $("#addEbayInvoiceForm [name=fromPaypalEmail] option")[0].text = '请选择付款账号'
                    // 初始化可选ebay账号
                    // $("#addEbayInvoiceForm [name=toPaypalEmail]").html($("form[name=searchForm_ebayInvoice] [name=ebayAcct]").html())
                    // 初始化可选币种
                    $("#addEbayInvoiceForm [name=currencyCode]").html($("form[name=searchForm_ebayInvoice] [name=currencyCode]").html())

                    // 初始化数据
                    $("#addEbayInvoiceForm [name=companyName]").val(data.companyName)
                    $("#addEbayInvoiceForm [name=channel]").val(data.channel)
                    $("#addEbayInvoiceForm [name=fromPaypalEmail]").val(data.fromPaypalEmail)
                    $("#addEbayInvoiceForm [name=toPaypalEmail]").val(data.toPaypalEmail)
                    $("#addEbayInvoiceForm [name=currencyCode]").val(data.currencyCode)
                    $("#addEbayInvoiceForm [name=amount]").val(data.amount)
                    $("#addEbayInvoiceForm [name=reason]").val(data.reason)
                    $("#addEbayInvoiceForm [name=remark]").val(data.remark)
                    $("#addEbayInvoiceForm [name=transactionId]").val(data.transactionId)
                    form.render('select');
                },
                yes: function () {
                    var Adata = {
                        id : data.id,
                        companyName: $("#addEbayInvoiceForm [name=companyName]").val().trim(),
                        channel: $("#addEbayInvoiceForm [name=channel]").val().trim(),
                        fromPaypalEmail: $("#addEbayInvoiceForm [name=fromPaypalEmail]").val().trim(),
                        toPaypalEmail: $("#addEbayInvoiceForm [name=toPaypalEmail]").val().trim(),
                        currencyCode: $("#addEbayInvoiceForm [name=currencyCode]").val().trim(),
                        amount: $("#addEbayInvoiceForm [name=amount]").val().trim(),
                        remark: $("#addEbayInvoiceForm [name=remark]").val().trim(),
                        transactionId: $("#addEbayInvoiceForm [name=transactionId]").val().trim()
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
                    if (!Adata.transactionId) {
                        layer.msg('paypal交易ID')
                        return
                    }
                    var files = $('#addEbayInvoiceForm input[name=file]')[0].files

                    var formData = new FormData();
                    if (files[0]) {
                        formData.append("file",files[0]);
                    }
                    for (var key in Adata) {
                        formData.append(key, Adata[key]);
                    }
                    $.ajax({
                        url: ctx + "/sysPaypalPayOrder/updEbayInvoice.html",
                        type : 'POST',
                        async : false,
                        data : formData,
                        // 告诉jQuery不要去处理发送的数据
                        processData : false,
                        // 告诉jQuery不要去设置Content-Type请求头
                        contentType : false,
                        success: function (res) {
                            if (res.code === '0000') {
                                layer.msg('操作成功')
                                searchForEbayInvoice(true)
                                layer.closeAll();
                            }
                        }
                    })
                }
            });
        } else if (layEvent == 'delete') {
            layer.confirm('确认删除该结账单吗？',{
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
                            searchForEbayInvoice(true)
                            layer.closeAll();
                        }
                    }
                })
            }, function () {
                layer.closeAll()
            })
        }
    });

    $('#exportOrder_ebayInvoice').click(function () {
        var data ={
            payType: 2,
            status: '1',
            fromPaypalEmail : $('form[name=searchForm_ebayInvoice] [name=paypalEmail]').val(),
            checkStatus: $('form[name=searchForm_ebayInvoice] [name=checkStatus]').val(),
            beginDate : $('form[name=searchForm_ebayInvoice] #beginDate_ebayInvoice').val(),
            endDate : $('form[name=searchForm_ebayInvoice] #endDate_ebayInvoice').val()
        }
        var searchType = $('form[name=searchForm_ebayInvoice] [name=searchType]').val()
        if (searchType) {
            data[searchType] = $('form[name=searchForm_ebayInvoice] [name=searchData]').val()
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

    // 导入
    $("#importOrder_ebayInvoice").click(function () {
        // 先清空文件夹
        $('#importFile_ebayInvoice').val('')
        $('#importFile_ebayInvoice').click()
    })
    // 文件变化事件
    $('#importFile_ebayInvoice').on('change', function () {
        importFileAjax()
    })

    function importFileAjax(ifImportTheSameId) {
        var files = $('#importFile_ebayInvoice')[0].files
        // 如果没有文件则终止
        if (files.length ==0) {
            return
        }
        var formData = new FormData();
        if (ifImportTheSameId) {
            formData.append("ifImportTheSameId",ifImportTheSameId);
        }
        formData.append("file",files[0]);
        admin.load.show()
        $.ajax({
            url : ctx + '/sysPaypalPayOrder/addByImport.html',
            type : 'POST',
            async : false,
            data : formData,
            // 告诉jQuery不要去处理发送的数据
            processData : false,
            // 告诉jQuery不要去设置Content-Type请求头
            contentType : false,
            success : function(data) {
                if(data.code === '0000'){
                    var excelRepeatList = data.data.excelRepeatList
                    var databaseRepeatList = data.data.databaseRepeatList
                    if (excelRepeatList.length == 0 && databaseRepeatList.length == 0) {
                        $('#searchPaypalBtn_ebayInvoice').trigger('click')
                        layer.msg('导入成功');
                    } else {
                        var msg1 = ''
                        var msg2 = ''
                        if (excelRepeatList.length > 0) {
                            msg1 += 'excel表中存在相同transactionId的记录:'
                            for (var i = 0; i < excelRepeatList.length; ++i) {
                                msg1 += excelRepeatList[i] + ','
                            }
                        }
                        if (databaseRepeatList.length > 0) {
                            msg2 += '数据库中存在相同transactionId的记录:'
                            for (var i = 0; i < databaseRepeatList.length; ++i) {
                                msg2 += databaseRepeatList[i] + ','
                            }
                        }
                        layer.confirm(msg1 + msg2 + '是否继续导入',{btn: ['继续导入','取消']},
                            function () {
                                importFileAjax(true)
                            },function () {
                                layer.closeAll()
                            })
                    }
                }else{
                    layer.msg(data.msg);
                }
            },
            complete: function () {
               admin.load.hide()
            }
        });
    }

    // 下载模板
    $('#importTemplate_ebayInvoice').click(function () {
        window.location.href = ctx + '/static/templet/ebayInvoiceTemplate.xlsx'
    })

});



