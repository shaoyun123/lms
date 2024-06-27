console.log("AmazonFsAutoPlan");
layui.use(['admin', 'form', 'table', 'layer', 'layedit', 'element', 'laypage','laydate'], function() {
    var form = layui.form,
        table = layui.table,
        laypage = layui.laypage,
        element = layui.element,
        laydate = layui.laydate,
        layer = layui.layer;
    form.render('select');

// 表单提交Search
    form.on('submit(AmazonFsAutoPlanSearch)', function(data) {

        initAjax('/amazonFsAutoPlan/queryList.html', 'POST', JSON.stringify(data.field), function(returnData) {
            table.render({
                elem: '#AmazonFsAutoPlan_table',
                method: 'POST',
                data: returnData.data,
                cols: [[
                    { checkbox: true, width: 30 },
                    { title: "计划名称", field: "planName" },
                    { title: "投诉次数", field: "voteTimes" },
                    { title: "跟卖天数", field: "beginFollowDays",templet: "#AmazonFsAutoPlan_follwArea_tpl" },
                    { title: "计划策略", templet: "#AmazonFsAutoPlan_planInfo_tpl"},
                    { title: "包含产品", field: "totalNum" },
                    { title: "时间", field: "salesSite",templet: "#AmazonFsAutoPlan_Time_tpl" },
                    { title: "状态", field: "status",templet: "#AmazonFsAutoPlan_status_tpl" },
                    { title: '操作', toolbar: "#AmazonFsAutoPlan_op", width: 100 }
                ]],
                page: false,
                id: 'AmazonFsAutoPlan_table',
                limit: Number.MAX_VALUE,
            });
        })
    });

    //最外面的按钮
    $('#AmazonFsAutoPlan_btn_createPlan').click(function() {
        layer.open({
            type: 1,
            title: '创建跟卖计划',
            btn: ['保存', '关闭'],
            area: ['100%', '100%'],
            content: $('#AmazonFsAutoPlan_layer').html(),
            success:function(index, layero){
                form.render();
                //时间的处理
                laydate.render({
                    elem: '#editAmazonFsAutoPlanForm input[name=startTime]' //指定元素
                });
                laydate.render({
                    elem: '#editAmazonFsAutoPlanForm input[name=endTime]' //指定元素
                });
                laydate.render({
                    elem: '#editAmazonFsAutoPlanForm input[name=onlineTime]', //指定元素
                    type:'time'
                });
                laydate.render({
                    elem: '#editAmazonFsAutoPlanForm input[name=offlineTime]', //指定元素
                    type:'time'
                });
            },
            yes: function(index, layero){
                $('#editAmazonFsAutoPlanSubmit').click();
            }
        })
    });

    //提交事件的初始化
    form.on('submit(editAmazonFsAutoPlanSubmit)', function (data) {
        editOrSavePlan(data.field, function (returnData) {
            layer.closeAll();
            if (data.field.id) {
                layer.msg(returnData.msg || "修改成功");
            } else {
                layer.msg(returnData.msg || "创建成功");
            }
            $('#AmazonFsAutoPlanSearch').click();
        })
    });
    table.on('tool(AmazonFsAutoPlan_table)', function(obj) {
        var data = obj.data;
        var layEvent = obj.event;

        if (layEvent === 'AmazonFsAutoPlan_event_edit') { //编辑
            layer.open({
                type: 1,
                title: '编辑跟卖计划',
                btn: ['保存', '关闭'],
                area: ['100%', '100%'],
                content: $('#AmazonFsAutoPlan_layer').html(),
                success:function(index, layero){
                    form.render();
                    //时间的处理
                    laydate.render({
                        elem: '#editAmazonFsAutoPlanForm input[name=startTime]', //指定元素
                        value:new Date(data.startTime)
                    });
                    laydate.render({
                        elem: '#editAmazonFsAutoPlanForm input[name=endTime]', //指定元素
                        value:new Date(data.endTime)
                    });
                    laydate.render({
                        elem: '#editAmazonFsAutoPlanForm input[name=onlineTime]', //指定元素
                        type:'time'
                    });
                    laydate.render({
                        elem: '#editAmazonFsAutoPlanForm input[name=offlineTime]', //指定元素
                        type:'time'
                    });

                    $('#editAmazonFsAutoPlanForm input[name=id]').val(data.id);
                    //TODO 回显
                    $('#editAmazonFsAutoPlanForm input[name=planName]').val(data.planName);

                    $('#editAmazonFsAutoPlanForm input[name=voteTimes]').val(data.voteTimes);
                    $('#editAmazonFsAutoPlanForm input[name=beginFollowDays]').val(data.beginFollowDays);
                    $('#editAmazonFsAutoPlanForm input[name=endFollowDays]').val(data.endFollowDays);

                    $('#editAmazonFsAutoPlanForm input[name=onlineTime]').val(data.onlineTime);
                    $('#editAmazonFsAutoPlanForm input[name=offlineTime]').val(data.offlineTime);
                    if(data.repeateDay.indexOf("星期一")!=-1){
                        $('#editAmazonFsAutoPlanForm input[name=weekOf1]').attr('checked',true)
                    }
                    if(data.repeateDay.indexOf("星期二")!=-1){
                        $('#editAmazonFsAutoPlanForm input[name=weekOf2]').attr('checked',true)
                    }
                    if(data.repeateDay.indexOf("星期三")!=-1){
                        $('#editAmazonFsAutoPlanForm input[name=weekOf3]').attr('checked',true)
                    }
                    if(data.repeateDay.indexOf("星期四")!=-1){
                        $('#editAmazonFsAutoPlanForm input[name=weekOf4]').attr('checked',true)
                    }
                    if(data.repeateDay.indexOf("星期五")!=-1){
                        $('#editAmazonFsAutoPlanForm input[name=weekOf5]').attr('checked',true)
                    }
                    if(data.repeateDay.indexOf("星期六")!=-1){
                        $('#editAmazonFsAutoPlanForm input[name=weekOf6]').attr('checked',true)
                    }
                    if(data.repeateDay.indexOf("星期日")!=-1){
                        $('#editAmazonFsAutoPlanForm input[name=weekOf7]').attr('checked',true)
                    }
                    form.render();
                },
                yes: function(index, layero){
                    $('#editAmazonFsAutoPlanSubmit').click();
                }
            })
        }
        if (layEvent === 'AmazonFsAutoPlan_event_close') {//停用
            layer.confirm('您确认要停用吗？', {icon: 3, title: '提示'}, function () {
                initAjax('/amazonFsAutoPlan/updateStatus.html', 'POST', JSON.stringify({
                    id: data.id,
                    status: false
                }), function (returnData) {
                    layer.msg(returnData.msg || "停用计划成功");
                    $('#AmazonFsAutoPlanSearch').click();
                });
            });
        }
        if (layEvent === 'AmazonFsAutoPlan_event_open') {//启用
            layer.confirm('您确认要启动吗？', {icon: 3, title: '提示'}, function () {
                initAjax('/amazonFsAutoPlan/updateStatus.html', 'POST', JSON.stringify({
                    id: data.id,
                    status: true
                }), function (returnData) {
                    layer.msg(returnData.msg || "启动计划成功");
                    $('#AmazonFsAutoPlanSearch').click();
                });
            });
        }
        if(layEvent === 'AmazonFsAutoPlan_event_delete'){//删除
            layer.confirm('您确认要删除吗？', {icon: 3, title: '提示'}, function () {
                initAjax('/amazonFsAutoPlan/delete.html', 'POST', JSON.stringify({id: data.id}), function (returnData) {
                    layer.msg(returnData.msg || "删除成功");
                    $('#AmazonFsAutoPlanSearch').click();
                });
            });
        }
    });

    function editOrSavePlan(data, fun) {
        initAjax('/amazonFsAutoPlan/editOrSave.html', 'POST', JSON.stringify(data), function (returnData) {
            if (fun) {
                fun(returnData);
            }

        });
    }

    function initAjax(url, method, data, func, contentType) { //初始化ajax请求
        $.ajax({
            type: method,
            url: ctx + url,
            dataType: 'json',
            async: true,
            data: data,
            contentType: contentType || 'application/json',
            success: function(returnData) {
                loading.hide()
                if (returnData.code == "0000") {
                    func(returnData)//回显
                } else {
                    layer.msg(returnData.msg, { icon: 2 });
                }
            },
            error: function(returnData) {
                layui.admin.load.hide();
                if (XMLHttpRequest.status == 200) {
                    layer.msg("请重新登录", { icon: 7 });
                } else {
                    layer.msg("服务器错误");
                }
            }
        })
    }
    function initAjaxSync(url, method, data, func, contentType, isLoad) { //初始化ajax请求
        if (!isLoad) {
            loading.show()
        }
        $.ajax({
            type: method,
            url: ctx + url,
            dataType: 'json',
            async: false,
            data: data,
            contentType: contentType || 'application/json',
            success: function(returnData) {
                loading.hide()
                if (returnData.code == "0000") {
                    func(returnData)//回显
                } else {
                    layer.msg(returnData.msg, { icon: 2 });
                }
            },
            error: function(returnData) {
                layui.admin.load.hide();
                if (XMLHttpRequest.status == 200) {
                    layer.msg("请重新登录", { icon: 7 });
                } else {
                    layer.msg("服务器错误");
                }
            },
            complete: function(returnData) {
                loading.hide()
            }
        })
    }

    $('#AmazonFsAutoPlanSearch').click();
});