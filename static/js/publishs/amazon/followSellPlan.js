layui.use(['admin', 'form', 'table', 'layer', 'layedit', 'element', 'laypage','laydate'], function() {
    var form = layui.form,
        table = layui.table,
        laypage = layui.laypage,
        element = layui.element,
        laydate = layui.laydate,
        layer = layui.layer;
    form.render('select');

// 表单提交Search
    form.on('submit(AmazonFollowSellPlanSearch)', function(data) {

        initAjax('/amazonFollowSellPlan/queryList.html', 'POST', JSON.stringify(data.field), function(returnData) {
            table.render({
                elem: '#AmazonFollowSellPlan_table',
                method: 'POST',
                data: returnData.data,
                cols: [[
                    { checkbox: true, width: 30 },
                    { title: "计划名称", field: "planName" },
                    { title: "计划策略", templet: "#AmazonFollowSellPlan_planInfo_tpl"},
                    { title: "包含产品", field: "totalNum" },
                    { title: "时间", field: "salesSite",templet: "#AmazonFollowSellPlan_Time_tpl" },
                    { title: "状态", field: "status",templet: "#AmazonFollowSellPlan_status_tpl" },
                    { title: '操作', toolbar: "#AmazonFollowSellPlan_op", width: 100 }
                ]],
                page: false,
                id: 'AmazonFollowSellPlan_table',
                limit: Number.MAX_VALUE,
            });
        })
    });

    //最外面的按钮
    $('#AmazonFollowSellPlan_btn_createPlan').click(function() {
        layer.open({
            type: 1,
            title: '创建跟卖计划',
            btn: ['保存', '关闭'],
            area: ['100%', '100%'],
            content: $('#AmazonFollowSellPlan_layer').html(),
            success:function(index, layero){
                form.render();
                //时间的处理
                laydate.render({
                    elem: '#editAmazonFollowSellPlanForm input[name=startTime]' //指定元素
                });
                laydate.render({
                    elem: '#editAmazonFollowSellPlanForm input[name=endTime]' //指定元素
                });
                laydate.render({
                    elem: '#editAmazonFollowSellPlanForm input[name=onlineTime]', //指定元素
                    type:'time'
                });
                laydate.render({
                    elem: '#editAmazonFollowSellPlanForm input[name=offlineTime]', //指定元素
                    type:'time'
                });

                //提交事件的初始化
                form.on('submit(editAmazonFollowSellPlanSubmit)', function (data) {
                    editOrSavePlan(data.field, function (returnData) {
                            layer.msg(returnData.msg || "新增成功");
                            layer.close(index);
                        $('#AmazonFollowSellPlanSearch').click();
                    })
                });
            },
            yes: function(index, layero){
                $('#editAmazonFollowSellPlanSubmit').click();
            }
        })
    });


    table.on('tool(AmazonFollowSellPlan_table)', function(obj) {
        var data = obj.data;
        var layEvent = obj.event;

        if (layEvent === 'AmazonFollowSellPlan_event_edit') { //编辑
            layer.open({
                type: 1,
                title: '编辑跟卖计划',
                btn: ['保存', '关闭'],
                area: ['100%', '100%'],
                content: $('#AmazonFollowSellPlan_layer').html(),
                success:function(index, layero){
                    form.render();
                    //时间的处理
                    laydate.render({
                        elem: '#editAmazonFollowSellPlanForm input[name=startTime]', //指定元素
                        value:new Date(data.startTime)
                    });
                    laydate.render({
                        elem: '#editAmazonFollowSellPlanForm input[name=endTime]', //指定元素
                        value:new Date(data.endTime)
                    });
                    laydate.render({
                        elem: '#editAmazonFollowSellPlanForm input[name=onlineTime]', //指定元素
                        type:'time'
                    });
                    laydate.render({
                        elem: '#editAmazonFollowSellPlanForm input[name=offlineTime]', //指定元素
                        type:'time'
                    });
                    //提交事件的初始化
                    form.on('submit(editAmazonFollowSellPlanSubmit)', function (data) {
                        editOrSavePlan(data.field, function (returnData) {
                                layer.msg(returnData.msg || "修改成功");
                                layer.close(index);
                                $('#AmazonFollowSellPlanSearch').click();
                        })
                    });

                    $('#editAmazonFollowSellPlanForm input[name=id]').val(data.id);
                    //TODO 回显
                    $('#editAmazonFollowSellPlanForm input[name=planName]').val(data.planName);

                    $('#editAmazonFollowSellPlanForm input[name=onlineTime]').val(data.onlineTime);
                    $('#editAmazonFollowSellPlanForm input[name=offlineTime]').val(data.offlineTime);
                    if(data.repeateDay.indexOf("星期一")!=-1){
                        $('#editAmazonFollowSellPlanForm input[name=weekOf1]').attr('checked',true)
                    }
                    if(data.repeateDay.indexOf("星期二")!=-1){
                        $('#editAmazonFollowSellPlanForm input[name=weekOf2]').attr('checked',true)
                    }
                    if(data.repeateDay.indexOf("星期三")!=-1){
                        $('#editAmazonFollowSellPlanForm input[name=weekOf3]').attr('checked',true)
                    }
                    if(data.repeateDay.indexOf("星期四")!=-1){
                        $('#editAmazonFollowSellPlanForm input[name=weekOf4]').attr('checked',true)
                    }
                    if(data.repeateDay.indexOf("星期五")!=-1){
                        $('#editAmazonFollowSellPlanForm input[name=weekOf5]').attr('checked',true)
                    }
                    if(data.repeateDay.indexOf("星期六")!=-1){
                        $('#editAmazonFollowSellPlanForm input[name=weekOf6]').attr('checked',true)
                    }
                    if(data.repeateDay.indexOf("星期日")!=-1){
                        $('#editAmazonFollowSellPlanForm input[name=weekOf7]').attr('checked',true)
                    }
                    form.render();
                },
                yes: function(index, layero){
                    $('#editAmazonFollowSellPlanSubmit').click();
                }
            })
        }
        if (layEvent === 'AmazonFollowSellPlan_event_close') {//停用
            initAjax('/amazonFollowSellPlan/updateStatus.html', 'POST', JSON.stringify({
                id: data.id,
                status: false
            }), function (returnData) {
                layer.msg(returnData.msg || "停用成功");
                $('#AmazonFollowSellPlanSearch').click();
            });
        }
        if (layEvent === 'AmazonFollowSellPlan_event_open') {//启用
            initAjax('/amazonFollowSellPlan/updateStatus.html', 'POST', JSON.stringify({
                id: data.id,
                status: true
            }), function (returnData) {
                layer.msg(returnData.msg || "启用成功");
                $('#AmazonFollowSellPlanSearch').click();
            });
        }
        if(layEvent === 'AmazonFollowSellPlan_event_delete'){//删除
            initAjax('/amazonFollowSellPlan/delete.html', 'POST', JSON.stringify({id: data.id}), function (returnData) {
                layer.msg(returnData.msg || "删除成功");
                $('#AmazonFollowSellPlanSearch').click();
            });
        }
    });

    function editOrSavePlan(data, fun) {
        initAjax('/amazonFollowSellPlan/editOrSave.html', 'POST', JSON.stringify(data), function (returnData) {
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
});