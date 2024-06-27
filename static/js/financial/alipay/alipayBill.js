/**
 * 支付宝账单的js
 * by linzhen 20180510
 * @returns
 */
layui.use(['admin', 'layer', 'table', 'laydate', 'form', 'element', 'upload'], function() {
    var admin = layui.admin,
        layer = layui.layer,
        $ = layui.$,
        table = layui.table,
        form = layui.form,
        laydate = layui.laydate,
        element = layui.element,
        upload = layui.upload;


    /**
     * 赋值默认审核状态为未审核 
     */
    var currentAuditStatus = "2";

    /**
     * 导入初始判断提示
     */
    var importJudge = function(id) {
        $('#' + id).click(function() {
            var file = $(this).parent().parent().find("input").eq(0).val();
            if (file == null || $.trim(file) == "") {
                layer.msg('请先选中文件!', { icon: 0 });
                $(this).preventDefault();//阻止继续冒泡
            }
        })
    }
    importJudge('alipay_alipayOrderImportBtn')
    importJudge('alipay_allRootOrderBtn')
    importJudge('alipay_alipayOrderCheckBtn')
    importJudge('alipay_allRootOrderCheckBtn')

    /**
     * 支付宝订单导入
     */
    upload.render({
        elem: '#alipay_alipayOrderImport', //绑定元素
        url: ctx + '/msgAlipayOrder/addBatchMsgAlipayOrder.html', //上传接口
        accept: 'file',
        exts: 'csv',
        auto: false, //屏蔽自动上传
        bindAction: "#alipay_alipayOrderImportBtn",
        field: "uploadAlipayImportFile",
        choose: function(obj) {
            var inp = $(this)[0].elem.parent().prev().find('input')
            obj.preview(function(index, file, result) {
                inp.val(file.name)
            })
        },
        before: function(obj) { //obj参数包含的信息，跟 choose回调完全一致，可参见上文。
            layer.load(1); //上传loading
        },
        done: function(res, index, result) {
            layer.closeAll('loading'); //关闭loading
            if (res.code == "0000") {
                var content = "本次累计解析记录(" + (res.data.totalLine-1) + ")条";
                var errorPatternOrder = res.data.errorPatternOrder; //商户订单号不对订单
                var notPayoutOrder = res.data.notPayoutOrder; //非支出记录
                var replaceOrderCount = res.data.replaceOrderCount; //已导入未审核
                var ignoreOrderCount = res.data.ignoreOrderCount; //已导入已审核
                var actOrderCount = res.data.actOrderCount; //实际导入订单条数
                if (errorPatternOrder != null && errorPatternOrder.length > 0) {
                    content += "</br>&nbsp;&nbsp;&nbsp;&nbsp;商户订单号不对订单：" + errorPatternOrder.length + "条";
                    for (var i in errorPatternOrder) {
                        content += "</br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + errorPatternOrder[i] + "";
                    }
                }
                if (notPayoutOrder != null && notPayoutOrder.length > 0) {
                    content += "</br>&nbsp;&nbsp;&nbsp;&nbsp;忽略非支出订单：" + (notPayoutOrder.length-1) + "条";
                }
                if (replaceOrderCount != null && replaceOrderCount > 0) {
                    content += "</br>&nbsp;&nbsp;&nbsp;&nbsp;覆盖已导入未审核订单：" + replaceOrderCount + "条";
                }
                if (ignoreOrderCount != null && ignoreOrderCount > 0) {
                    content += "</br>&nbsp;&nbsp;&nbsp;&nbsp;忽略已导入已审核订单：" + ignoreOrderCount + "条";
                }
                content += "</br>&nbsp;&nbsp;&nbsp;&nbsp;<span style='color:green;'>实际导入订单：" + actOrderCount + "条</span>";
                layer.open({
                    title: '支付宝订单导入结果',
                    content: content,
                    offset: '100px',
                    area: '500px',
                    yes: function(index, layero){
                        reloadTable(); //导入后刷新列表
                        layer.close(index); //如果设定了yes回调，需进行手工关闭
                    }
                });

            } else {
                layer.msg(res.msg, { icon: 0 });
            }
            //上传完毕回调
        },
        error: function() { //请求异常回调
            layer.msg("支付宝账单导入异常", { icon: 0 });
            layer.closeAll('loading'); //关闭loading
        }
    });
    /**
     * 支付宝账单校验
     */
    upload.render({
        elem: '#alipay_alipayOrderCheck', //绑定元素
        url: ctx + '/msgAlipayOrder/checkAlipayOrderData.html', //上传接口
        accept: 'file',
        exts: 'csv',
        auto: false, //屏蔽自动上传
        bindAction: "#alipay_alipayOrderCheckBtn",
        field: "uploadAlipayCheckFile",
        choose: function(obj) {
            var inp = $(this)[0].elem.parent().prev().find('input')
            obj.preview(function(index, file, result) {
                inp.val(file.name)
            })
        },
        before: function(obj) { //obj参数包含的信息，跟 choose回调完全一致，可参见上文。
            layer.load(1); //上传loading
        },
        done: function(res, index, result) { //上传完毕回调
            if (res.code == "0000") {
                var content = "";
                var amtMatchDiff = res.data.amtMatchDiff; //单号存在金额不一致
                var notExistsOrder = res.data.notExistsOrder; //单号不存在
                content += "金额不一致的订单：" + amtMatchDiff.length + "条";
                for (var i in amtMatchDiff) {
                    content += "</br>&nbsp;&nbsp;&nbsp;&nbsp;" + amtMatchDiff[i] + "";
                }
                content += "</br>未导入的订单：" + notExistsOrder.length + "条";
                for (var i in notExistsOrder) {
                    content += "</br>&nbsp;&nbsp;&nbsp;&nbsp;" + notExistsOrder[i] + "";
                }
                layer.open({
                    title: '支付宝账单匹配结果(同历史导入数据比较)',
                    content: content,
                    offset: '100px',
                    area: '500px',
                });
            } else {
                layer.msg(res.msg, { icon: 0 });
            }
            layer.closeAll('loading'); //关闭loading
        },
        error: function() { //请求异常回调
            layer.closeAll('loading'); //关闭loading
            layer.msg("支付宝账单校验接口异常", { icon: 0 });
        }
    });

    /**
     * WF订单导入
     */
    upload.render({
        elem: '#alipay_WFOrderImport', //绑定元素
        url: ctx + '/msgAlipayOrder/addByWFExcel.html', //上传接口
        accept: 'file',
        exts: 'xlsx',
        auto: false, //屏蔽自动上传
        bindAction: "#alipay_WFOrderImportBtn",
        field: "uploadAlipayImportFile",
        choose: function(obj) {
            var inp = $(this)[0].elem.parent().prev().find('input')
            obj.preview(function(index, file, result) {
                inp.val(file.name)
            })
        },
        before: function(obj) { //obj参数包含的信息，跟 choose回调完全一致，可参见上文。
            layer.load(1); //上传loading
        },
        done: function(res, index, result) {
            layer.closeAll('loading'); //关闭loading
            if (res.code == "0000") {
                 layer.alert(res.msg)
            } else {
                layer.alert(res.msg, { icon: 0 });
            }
            //上传完毕回调
        },
        error: function() { //请求异常回调
            layer.msg("WF账单导入异常", { icon: 0 });
            layer.closeAll('loading'); //关闭loading
        }
    });


    /**
     * 普源订单导入
     */
    upload.render({
        elem: '#alipay_allRootOrderImport', //绑定元素
        url: ctx + '/msgAllrootOrder/importAllrootOrder.html', //上传接口
        accept: 'file',
        exts: 'xlsx|xls',
        auto: false, //屏蔽自动上传
        bindAction: "#alipay_allRootOrderBtn",
        field: "uploadAllrootImportFile",
        choose: function(obj) {
            var inp = $(this)[0].elem.parent().prev().find('input')
            obj.preview(function(index, file, result) {
                inp.val(file.name)
            })
        },
        before: function(obj) { //obj参数包含的信息，跟 choose回调完全一致，可参见上文。
            layer.load(1); //上传loading    
        },
        done: function(res, index, result) { //上传完毕回调
            layer.closeAll('loading'); //关闭loading
            if (res.code == "0000") {
                var totalLine = res.data.totalLine ? res.data.totalLine : 0;
                var content = "本次累计解析记录(" + totalLine + ")条";
                var errorPatternOrder = res.data.errorPatternOrder; //商户订单号不对订单
                var ignoreOrderCount = res.data.ignoreOrderCount; //已导入已审核
                var actOrderCount = res.data.actOrderCount == null ? 0 : res.data.actOrderCount; //实际导入订单条数
                if (errorPatternOrder != null && errorPatternOrder.length > 0) {
                    content += "</br>&nbsp;&nbsp;&nbsp;&nbsp;商户订单号不对订单：" + errorPatternOrder.length + "条";
                    for (var i in errorPatternOrder) {
                        content += "</br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + errorPatternOrder[i] + "";
                    }
                }
                if (ignoreOrderCount != null && ignoreOrderCount > 0) {
                    content += "</br>&nbsp;&nbsp;&nbsp;&nbsp;忽略已导入的普源订单：" + ignoreOrderCount + "条";
                }
                content += "</br>&nbsp;&nbsp;&nbsp;&nbsp;<span style='color:green;'>实际导入普源订单：" + actOrderCount + "条</span>";
                layer.open({
                    title: '普源订单导入结果',
                    content: content,
                    offset: '100px',
                    area: '500px',
                    yes: function(index, layero){
                            reloadTable(); //导入后刷新列表
                            layer.close(index); //如果设定了yes回调，需进行手工关闭
                         }
                });
            } else {
                layer.msg(res.msg, { icon: 0 });
            }
        },
        error: function() { //请求异常回调
            layer.msg("普源订单导入接口异常", { icon: 0 });
            layer.closeAll('loading'); //关闭loading
        }
    });
    /**
     * 普源订单校验
     */
    upload.render({
        elem: '#alipay_allRootOrderCheck', //绑定元素
        url: ctx + '/msgAllrootOrder/checkAllrootOrderData.html', //上传接口
        accept: 'file',
        exts: 'xlsx|xls',
        auto: false, //屏蔽自动上传
        bindAction: "#alipay_allRootOrderCheckBtn",
        field: "uploadAllrootCheckFile",
        choose: function(obj) {
            var inp = $(this)[0].elem.parent().prev().find('input')
            obj.preview(function(index, file, result) {
                inp.val(file.name)
            })
        },
        before: function(obj) { //obj参数包含的信息，跟 choose回调完全一致，可参见上文。
            layer.load(1); //上传loading
        },
        done: function(res, index, result) { //上传完毕回调
            layer.closeAll('loading'); //关闭loading
            if (res.code == "0000") {
                var content = "金额不一致的订单:";
                var amtMatchDiff = res.data.amtMatchDiff; //单号存在金额不一致
                var notExistsOrder = res.data.notExistsOrder; //单号不存在
                for (var i in amtMatchDiff) {
                    content += "</br>" + amtMatchDiff[i] + "";
                }
                content += "</br>未导入的订单:";
                for (var i in notExistsOrder) {
                    content += "</br>" + notExistsOrder[i] + "";
                }
                layer.open({
                    title: '普源订单匹配结果(同历史导入数据比较)',
                    content: content,
                    offset: '100px',
                    area: '500px',
                });
            } else {
                layer.msg(res.msg, { icon: 0 });
            }
        },
        error: function() { //请求异常回调
            layer.msg("普源订单校验接口异常", { icon: 0 });
            layer.closeAll('loading'); //关闭loading
        }
    });

    /**
     * 日期渲染
     */
    laydate.render({
        elem: '#alipayOrderTime',
        range: true
    });
    /**
     * 检索支付宝账单数据
     */
    $("#alipayOrder_search").click(function() {
            reloadTable();
        })
        /**
         * 下拉匹配结果列表重新选择
         */
    form.on('select(alipayOrder_macthResult)', function(data) {
        reloadTable();
    });
    /**
     * 切换审核状态选项卡重新渲染表格
     */
    element.on('tab(alipayOrder_tab)', function(data) {
        currentAuditStatus = $(this).attr("audit_status");
        reloadTable(); //当前选择的审核状态
    });
    /**
     * 获取有效的支付宝账户
     */
    listAlipayAcct();
    /**
     * 获取每种状态的统计数据
     */
    getMsgAlipayOrderEveryStatusCount("");
    /**
     * 账单匹配
     */
    $("#alipay_alipayOrderMacthBtn").click(function() {
        layer.load(1); //上传loading
            $.ajax({
                type: "post",
                url: ctx + "/msgAlipayOrder/balanceAlipayOrder.html",
                dataType: "json",
                success: function(returnData) {
                    layer.closeAll('loading'); //关闭loading
                    if (returnData.code == "0000") {
                        layer.msg("支付宝账单与采购订单匹配完毕", { icon: 1 });
                        reloadTable(); //当前选择的审核状态
                    } else {
                        layer.msg(returnData.msg, { icon: 0 });
                    }
                }
            })
        })
        /**
         *待定按钮,尚未开发
         */

    $("#alipay_alipayOrderWaitBtn").click(function() {
        layer.msg("待定按钮,尚未开发", { icon: 1 })
    })

    /**
     * 渲染支付宝账单数据
     */
    table.render({
        elem: "#alipay_alipayOrderTable",
        method: 'post',
        url: ctx + "/msgAlipayOrder/getMsgAlipayOrderList.html",
        where: {
            "auditStatus": "2",
        },
        cols: [
            [
                //标题栏
                { field: "alipayAcct", title: "支付宝账号" },
                { field: 'recordTime', title: "入账日期", align: 'left', templet: '#alipay_recordTimeTpl' },
                { field: "mercOrderNo", title: "订单号" },
                { field: 'payoutAmount', title: "金额", width: 80, align: 'left' },
                { field: "diffAmt", title: "差额", width: 80, },
                { field: "matchResult", title: "匹配结果", width: 100, templet: '#alipay_matchResultTpl' },
                { field: 'auditNote', title: "核单备注", align: 'left', templet: '#alipay_auditNote', },
                { field: "auditTime", title: "时间", templet: '#alipay_operateTimeTpl', width: 200, },
                { field: "auditor", title: "核单人" },
                { title: '操作', align: 'center', width: 80, templet: '#alipay_operateAllTpl' }
            ],
        ],
        page: true,
        id: "alipayAlipayOrderTable",
        skin: 'line', //行边框风格
        even: true, //开启隔行背景
        limits: [20, 50, 100],
        limit: 100
    });
    //工具条的监听事件,table.on(tool(表格的lay-filter的值))
    table.on('tool(alipay_alipayOrderTable)', function(obj) {
        var data = obj.data, //获得当前行数据
            layEvent = obj.event; //获得 lay-event 对应的值
        if (layEvent == "auditOrder") { //编辑
            auditAlipayOrder(data.id,data.auditStatus,data.auditNote);
        }
    })

    /**
     * 获取所有有效的支付宝账号
     */
    function listAlipayAcct() {
        $.ajax({
            type: "post",
            url: ctx + "/msgAlipayAcct/getAllMsgAlipayAcct.html",
            dataType: "json",
            success: function(returnData) {
                if (returnData.code == "0000") {
                    var str = "<option value=''></option>";
                    $(returnData.data).each(function() {
                        str += "<option value='" + this.alipayAcct + "'>" + this.alipayAcct + "</option>";
                    });
                    $("#alipayOrder_alipayAcctSelect").html(str);
                    form.render();
                } else {
                    layer.msg(returnData.msg);
                }
            }
        })
    }
    /**
     * 根据条件统计指定审核状态的记录总数
     */
    function getMsgAlipayOrderEveryStatusCount() {
        var startTime="";//入账开始时间
        var endTime="";//入账结束时间
        if($.trim($("#alipayOrderTime").val())){
            startTime=$("#alipayOrderTime").val().substring(0,10);
            endTime=$("#alipayOrderTime").val().substring(13);
        }
        $.ajax({
            type: "post",
            url: ctx + "/msgAlipayOrder/getMsgAlipayOrderEveryStatusCount.html",
            data: {
                "alipayAcct": $("#alipayOrder_alipayAcctSelect").val(),
                "mercOrderNo": $("#alipayOrder_mercOrderNo").val(),
                "matchResult": $("#alipayOrder_macthResult").val(),
                "startTime": startTime,
                "endTime": endTime,
            },
            dataType: "json",
            success: function(returnData) {
                if (returnData.code == "0000") {
                    $("#alipayOrder_noAuditNumSpan").html(returnData.data.noAuditNum);
                    $("#alipayOrder_auditNumSpan").html(returnData.data.auditNum);
                    $("#alipayOrder_allDataNumSpan").html(returnData.data.allDataNum);
                } else {
                    layer.msg(returnData.msg, { icon: 5 });
                }
            }
        })
    }
    /**
     * 重新渲染表格
     */
    function reloadTable() {
        if (isNaN($("#alipayOrder_mercOrderNo").val())) {
            layer.msg("平台单号不合法,请检查", { icon: 0 });
            return;
        }
        getMsgAlipayOrderEveryStatusCount("");
        var startTime="";//入账开始时间
        var endTime="";//入账结束时间
        if($.trim($("#alipayOrderTime").val())){
            startTime=$("#alipayOrderTime").val().substring(0,10);
            endTime=$("#alipayOrderTime").val().substring(13);
        }
        table.reload('alipayAlipayOrderTable', {
            where: {
                "alipayAcct": $.trim($("#alipayOrder_alipayAcctSelect").val()),
                "mercOrderNo": $.trim($("#alipayOrder_mercOrderNo").val()),
                "matchResult": $.trim($("#alipayOrder_macthResult").val()),
                "startTime": $.trim(startTime),
                "endTime": $.trim(endTime),
                "auditStatus": $.trim(currentAuditStatus),
            },
            page: {
                curr: 1 //重新从第 1 页开始
            }
        });
    }
    /**
     * 核单
     */
    function auditAlipayOrder(id,auditStatus,oldAuditNote) {
        var title="核单";
        if(auditStatus != null && auditStatus==3){
            title="再次核单";
        }
        var options = {
            type: 1,
            title: title,
            btn: ['保存', '关闭'],
            area: ["800px", "500px"],
            content: $('#alipay_auditOrderLayer').html(),
            success: function(layero, index) {
                if(oldAuditNote != null){
                    $("#alipay_updateAlipayOrderForm").find("textarea[name='auditNote']").val(oldAuditNote);
                }
            },
            yes: function(index, layero) {
                var auditNote = $("#alipay_updateAlipayOrderForm").find("textarea[name='auditNote']").val(); //审核备注
                if (auditNote == null || $.trim(auditNote) == '') {
                    layer.msg("核单备注不能为空", { icon: 0 });
                } else {
                    $.ajax({
                        type: "post",
                        url: ctx + "/msgAlipayOrder/auditAlipayOrder.html",
                        dataType: "json",
                        data: {
                            "alipayOrderId": id,
                            "auditNote": auditNote
                        },
                        success: function(returnData) {
                            if (returnData.code == "0000") {
                                layer.closeAll();
                                reloadTable();
                                layer.msg("核单成功", { icon: 1 });
                            } else {
                                layer.msg(returnData.msg, { icon: 0 });
                            }
                        },
                        error: function() {
                            layer.msg("发送核单请求失败", { icon: 5 });
                        }
                    })
                }
            }
        }
        var index = admin.popup(options);
    }
})