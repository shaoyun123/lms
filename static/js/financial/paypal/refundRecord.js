/**
 * time: 2018/01/02
 */
var active_refundRecord
layui.use(["admin", "form", "table", "layer", "laytpl", "laydate"], function () {
    var admin = layui.admin,
        form = layui.form,
        table = layui.table,
        layer = layui.layer,
        laytpl = layui.laytpl,
        laydate = layui.laydate,
        $ = layui.$;

    $("#payPalAu").click(function () {
        layer.open({
            type: 1,
            title: "PayPal授权",
            area: ["550px", "300px"],
            shade: 0,
            content: $("#payPalAuLayer"),
            btn: ["关闭"],
        });
    });

    //同时绑定多个
    laydate.render({
        elem: '#beginDate_refundRecord'
        ,type: 'datetime'
    });
    laydate.render({
        elem: '#endDate_refundRecord'
        ,type: 'datetime'
        ,ready: function (date) {
          $(".layui-laydate-footer [lay-type='datetime'].laydate-btns-time").click();
          $(".laydate-main-list-0 .layui-laydate-content li ol li:last-child").click();
          $(".layui-laydate-footer [lay-type='date'].laydate-btns-time").click();
         }
    });
    // 初始化页面
    queryPage()
    // 查询列表
    function queryPage(obj) {
        var data = {
            orderBy: 'id desc'
        }
        if (obj) {
            $.extend(data, obj);
        }
        table.render({
            elem: "#refundRecordTable",
            method: "post",
            url: ctx + "/sysPaypalRefundRecord/queryList.html",
            where: data,
            cols: [
                [
                    //标题栏
                    // {type: "checkbox"},
                    {field: "transactionId", title: "原始交易ID"},
                    {field: "fromPaypalAcct", title: "paypal首选邮箱"},
                    {field: "amount", title: "退款金额"},
                    {field: "remark", title: "备注"},
                    {field: "dealResult", title: "处理结果"},
                    {field: "createTime", title: "创建时间", templet: '<div>{{ Format(d.createTime,"yyyy-M-d h:m:s")}}</div>',width: 155},
                    //绑定工具条
                    {title: '操作', align: 'center', toolbar: '#refund_bar'}
                ],
            ],
            id: 'paypalRefundRecordReloadTable',
            page: true,
            orderBy: 'id desc',
            limits: [100, 500, 1000],
            limit: 100,
            done:function(){
                // theadHandle().fixTh({id:'#refoundrecordCard'});
                $('#refundRecordTable').next('.layui-table-view').find('.layui-table-header').addClass('toFixedContain')
            }
        })
    }

    // 表格数据重载
    active_refundRecord = {
        reload: function(data){
            //执行重载
            table.reload('paypalRefundRecordReloadTable', {
                page: {
                    curr: 1 //重新从第 1 页开始
                }
                ,where: data
            });
        }
    }

    // 搜索功能
    $('#redundRecordSearch').click(function () {
        searchByCondition(true)
    })

    function searchByCondition(ifReload) {
        var data = {
            fromPaypalAcct: $('form[name=searchForm_refundRecord] [name=paypalEmail]').val(),
            beginDate: $('form[name=searchForm_refundRecord] #beginDate_refundRecord').val(),
            endDate: $('form[name=searchForm_refundRecord] #endDate_refundRecord').val(),
            dealResult: $('form[name=searchForm_refundRecord] [name=dealResult]').val(),
            transactionIdList: $('form[name=searchForm_refundRecord] [name=transactionIdList]').val().replace(/，/ig,',')
        }
        if (ifReload) {
            active_refundRecord.reload(data)
        } else {
            queryPage(data)
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
                    var paypalEmailSelect = $("form[name=searchForm_refundRecord] [name=paypalEmail]")
                    var paypalEmailSelectAvailable = $("form[name=searchForm_refundRecord] [name=paypalEmail_available]")
                    for (var i = 0; i < list.length; ++i) {
                        obj = $('<option value="' + list[i].paypalEmail + '">' + list[i].paypalEmail + '</option>')
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

    // 新建退款单
    $('#addOneRefundRecodBtn').click(function () {
        var index = admin.popup({
            type: 1,
            title: "新建Paypal退款单",
            area: ["60%", "80%"],
            shadeClose: false,
            content: $("#add_refund_record").html(),
            btn: ["创建", "关闭"],
            success: function () {
                $("#addRefundRecordForm  [name=fromPaypalAcct]").html($("form[name=searchForm_refundRecord] [name=paypalEmail_available]").html())
                $("#addRefundRecordForm  [name=fromPaypalAcct] option")[0].text = "请选择paypal首选邮箱"
                form.render("select")
            },
            yes: function () {
                toAddAjax()
            }
        });
    })

    function toAddAjax(ifRepeat) {
        var data = {
            transactionId : $('#addRefundRecordForm [name=transactionId]').val().trim(),
            amount : $('#addRefundRecordForm [name=amount]').val().trim(),
            remark : $('#addRefundRecordForm [name=remark]').val().trim(),
            dealResult : $('#addRefundRecordForm [name=dealResult]').val().trim(),
            fromPaypalAcct : $('#addRefundRecordForm [name=fromPaypalAcct]').val().trim()
        }
        if (ifRepeat) {
            data.ifRepeat = ifRepeat
        }
        if (!data.transactionId) {
            layer.msg('请输入paypal交易ID')
            return
        }
        if (!data.fromPaypalAcct) {
            layer.msg('请选择首选邮箱')
            return
        }
        if (!data.amount) {
            layer.msg('请输入退款金额')
            return
        }

        var ajax = new Ajax()
        ajax.post({
            url: ctx + "/sysPaypalRefundRecord/addOne.html",
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function (data) {
                if (data.code == '0000') {
                    $('#redundRecordSearch').trigger('click')
                    layer.closeAll();
                    layer.msg('创建成功')
                } else if (data.code == '0909') {
                    var index = layer.confirm(data.msg,{btn:['继续创建','取消']},
                    function () {
                        toAddAjax(true)
                    }, function () {
                        layer.close(index)
                    }
                    )

                }
            }
        })
    }

    // 下载模板
    $('#downLoadTemplet').click(function () {
        window.location.href = ctx + '/static/templet/importExample.xlsx'
    })

    // 导入
    $('#importFileBtn').click(function () {
        // 先清空文件夹
        $('#importFile').val('')
        $('#importFile').click()
    })
    // 文件变化事件
    $('#importFile').on('change', function () {
        importFileAjax()
    })

    function importFileAjax(ifImportTheSameId) {
        var files = $('#importFile')[0].files
        // 如果没有文件则终止
        if (files.length ==0) {
            return
        }
        var formData = new FormData();
        if (ifImportTheSameId) {
            formData.append("ifImportTheSameId",ifImportTheSameId);
        }
        formData.append("file",files[0]);

        $.ajax({
            url : ctx + '/sysPaypalRefundRecord/addByImport.html',
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
                        $('#redundRecordSearch').trigger('click')
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
            }
        });
    }

    // 导出 test
    $('#exportBtn').click(function () {
        var data = {
            fromPaypalAcct: $('form[name=searchForm_refundRecord] [name=paypalEmail]').val(),
            beginDate: $('form[name=searchForm_refundRecord] #beginDate_refundRecord').val(),
            endDate: $('form[name=searchForm_refundRecord] #endDate_refundRecord').val(),
            transactionIdList: $('form[name=searchForm_refundRecord] [name=transactionIdList]').val().replace(/，/ig,',')
        }
        if (!data.beginDate.trim()) {
            layer.msg('请选择一个开始日期')
            return
        }

        var form = $("<form></form>");
        form.attr('action',ctx + '/sysPaypalRefundRecord/export.html');
        form.attr('method','post');

        for(var key in data){
            var temp= $("<input type='hidden' name='" + key + "' value='" +data[key] + "'/>")
            form.append(temp);
        }
        form.appendTo("body");
        form.css('display','none');
        form.submit();
    })
    // 删除/修改
    table.on('tool(refundRecordTable)', function (obj) {
        var data = obj.data, //获得当前行数据
            layEvent = obj.event; //获得 lay-event 对应的值
        if (layEvent == 'update') {
            layer.open({
                    type: 1,
                    title: "修改Paypal退款单",
                    area: ["60%", "80%"],
                    shadeClose: false,
                    content: $("#add_refund_record").html(),
                    btn: ['保存', '关闭'],
                    success: function (layero, index) {
                        $("#addRefundRecordForm  [name=fromPaypalAcct]").html($("form[name=searchForm_refundRecord] [name=paypalEmail_available]").html())
                        $("#addRefundRecordForm  [name=fromPaypalAcct] option")[0].text = "请选择paypal首选邮箱"
                        $('#addRefundRecordForm [name=transactionId]').val(data.transactionId)
                        $('#addRefundRecordForm [name=fromPaypalAcct]').val(data.fromPaypalAcct)
                        $('#addRefundRecordForm [name=amount]').val(data.amount)
                        $('#addRefundRecordForm [name=dealResult]').val(data.dealResult)
                        $('#addRefundRecordForm [name=remark]').val(data.remark)
                        form.render('select')
                    },
                yes: function () {
                    var AData = {
                        id: data.id,
                        transactionId: $('#addRefundRecordForm [name=transactionId]').val().trim(),
                        fromPaypalAcct: $('#addRefundRecordForm [name=fromPaypalAcct]').val().trim(),
                        amount: $('#addRefundRecordForm [name=amount]').val().trim(),
                        dealResult: $('#addRefundRecordForm [name=dealResult]').val().trim(),
                        remark: $('#addRefundRecordForm [name=remark]').val().trim()
                    }
                    var ajax = new Ajax()
                    ajax.post({
                        url: ctx + '/sysPaypalRefundRecord/update.html',
                        data: JSON.stringify(AData),
                        success: function (res) {
                            if (res.code == '0000') {
                                layer.closeAll()
                                $('#redundRecordSearch').trigger('click')
                            }
                        }
                    })
                }
            })
        }else if (layEvent == 'delete') {
            layer.confirm(
                '确认删除该打款单？',
                {btn: ['确认', '取消']},
                function () {
                    var ajax = new Ajax()
                    ajax.post({
                        url: ctx + '/sysPaypalRefundRecord/delete.html',
                            data: JSON.stringify({id: data.id}),
                        success: function (res) {
                        if (res.code == '0000') {
                            layer.closeAll()
                            $('#redundRecordSearch').trigger('click')
                        }
                    }
                    })
                },
                function () {
                    layer.closeAll()
                }
            )
        }
    })
});

