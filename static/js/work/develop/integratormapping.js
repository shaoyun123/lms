/**
 * 采购员对应的整合人员映射js
 */
layui.use(["admin", "form", "table", "layer", "laytpl", "laydate"], function () {
    var admin = layui.admin,
        form = layui.form,
        table = layui.table,
        layer = layui.layer,
        $ = layui.$;
    form.render('select');
    form.render('radio');
    form.render('checkbox');
    /**
     * 初始化人员选择框
     */
    initIntegratorMappingSelData();
    //按钮的点击事件
    $("#integrator_mapping_add_btn").click(function () {
        var index = layer.open({
            type: 1,
            title: "新增采购人员映射",
            id: 'newMapSuccess',
            area: ["800px", "450px"],
            shadeClose: false,
            btn: ['保存', '关闭'],
            content: $("#integrator_mapping_add_layer").html(),
            success: function () {
                $("#integrator_mapping_add_buyer_sel").html("<option value=''>请选择</option>");
                $("#integrator_mapping_add_integrator_sel").html("<option value=''>请选择</option>");
                $("#followOrder_mapping_add_sel").html("<option value=''>请选择</option>");
                // $("#integrator_mapping_add_developer_sel").html("<option value=''>请选择</option>");
                $(integrator_mapping_purchasingAgentList).each(function(){
                    $("#integrator_mapping_add_buyer_sel").append("<option value='"+this.id+"'>"+this.userName+"</option>");
                });
                $(integrator_mapping_intergationList).each(function(){
                    $("#integrator_mapping_add_integrator_sel").append("<option value='"+this.id+"'>"+this.userName+"</option>");
                });
                $(follow_order_mapping_userList).each(function(){
                    $("#followOrder_mapping_add_sel").append("<option value='"+this.id+"'>"+this.userName+"</option>");
                });
                // $(integrator_mapping_preprodDevList).each(function(){
                //     $("#integrator_mapping_add_developer_sel").append("<option value='"+this.id+"'>"+this.userName+"</option>");
                // });
                form.render('select');
            },
            yes: function () {
                var obj = {};
                obj.buyerId = $("#integrator_mapping_add_buyer_sel").val();
                obj.integratorId = $("#integrator_mapping_add_integrator_sel").val();
                obj.developerId = $("#integrator_mapping_add_developer_sel").val();
                obj.followOrderUserId = $("#followOrder_mapping_add_sel").val();
                $(integrator_mapping_enableUser).each(function () {
                    if (obj.buyerId == this.id) {
                        obj.buyer = this.user_name;
                    }
                });
                $(integrator_mapping_intergationList).each(function () {
                    if (obj.integratorId == this.id) {
                        obj.integrator = this.userName;
                    }
                });
                $(follow_order_mapping_userList).each(function () {
                    if (obj.followOrderUserId == this.id) {
                        obj.followOrderUserName = this.userName;
                    }
                });
                // $(integrator_mapping_preprodDevList).each(function () {
                //     if (obj.developerId == this.id) {
                //         obj.developer = this.userName;
                //     }
                // });
                if(!obj.buyerId){
                    layer.msg("采购员不能为空", {icon: 0});
                    return false;
                }
                if (!obj.integratorId) {
                    layer.msg("采购整合人员不能为空", {icon: 0});
                    return false;
                }
                if(!obj.followOrderUserId){
                    layer.msg("跟单专员不能为空", {icon: 0});
                    return false;
                }
                // if (!obj.integratorId && (!obj.developerId)) {
                //     layer.msg("采购整合人员或则开发专员不能都为空", {icon: 0});
                //     return false;
                // }
                admin.load.show();
                $.ajax({
                    url: ctx + '/msgPreprodBuyer/addOneMsgPreprodBuyerMapping.html',
                    data: obj,
                    dataType: "json",
                    type: "post",
                    success: function (returnData) {
                        admin.load.hide();
                        if (returnData.code == "0000") {
                            layer.msg('新增映射成功',{icon:1});
                            reloadIntegratorMappingTable();
                            layer.closeAll();
                        } else {
                            layer.msg(returnData.msg,{icon:5});
                        }
                    },
                    error: function () {
                        admin.load.hide();
                        layer.msg("服务器正忙",{icon:5});
                    }
                });
            },
            end:function () {
                layer.closeAll();
            }
        });
    });
    //表格渲染结果
    //展示已知数据
    table.render({
        elem: "#integrator_mapping_data_table",
        method: "post",
        url: ctx + '/msgPreprodBuyer/getMsgPreprodBuyerMappingList.html',
        cols: [
            [
                {field: "buyer", title: "采购员"},
                {field: "integrator", title: "采购整合人员"},
                {field: "followOrderUserName", title: "跟单专员"},
                // {field: "developer", title: "开发专员"},
                {title: '操作', align: 'center', toolbar: '#integrator_mapping_edit_bar'}
            ],
        ],
        id: 'integrator_mapping_data_table',
        page: true,
        limits: [50, 100, 1000],
        limit: 100,
        done: function (res, curr, count) {
            admin.load.hide();
        }
    });

    // 搜索提交
    $('#integrator_mapping_search_btn').click(function () {
        reloadIntegratorMappingTable();
    })
    // 执行重载
    function reloadIntegratorMappingTable(){
        admin.load.show();
        table.reload('integrator_mapping_data_table', {
            page: {
                curr: 1 // 重新从第 1 页开始
            },
            where: getIntegratorMappingSearchData(),
        });
    }
    table.on('tool(integrator_mapping_data_table)', function (obj) {
        var layEvent = obj.event; // 获得 lay-event 对应的值
        var data = obj.data; // 获得当前行数据
        if (layEvent === 'edit') {
            var index = layer.open({
                type: 1,
                title: "编辑人员映射",
                area: ["800px", "450px"],
                shadeClose: false,
                btn: ['保存', '关闭'],
                content: $("#integrator_mapping_edit_layer").html(),
                success: function () {
                    $("#integrator_mapping_edit_buyer_sel").html("<option value=''>请选择</option>");
                    $("#integrator_mapping_edit_integrator_sel").html("<option value=''>请选择</option>");
                    $("#followOrder_mapping_edit_sel").html("<option value=''>请选择</option>");
                   // $("#integrator_mapping_edit_developer_sel").html("<option value=''>请选择</option>");
                    console.log(integrator_mapping_purchasingAgentList);
                    $(integrator_mapping_purchasingAgentList).each(function(){
                        $("#integrator_mapping_edit_buyer_sel").append("<option value='"+this.id+"'>"+this.userName+"</option>");
                    });
                    $(integrator_mapping_intergationList).each(function(){
                        $("#integrator_mapping_edit_integrator_sel").append("<option value='"+this.id+"'>"+this.userName+"</option>");
                    });
                    $(follow_order_mapping_userList).each(function(){
                        $("#followOrder_mapping_edit_sel").append("<option value='"+this.id+"'>"+this.userName+"</option>");
                    });
                    // $(integrator_mapping_preprodDevList).each(function(){
                    //     $("#integrator_mapping_edit_developer_sel").append("<option value='"+this.id+"'>"+this.userName+"</option>");
                    // });
                    $("#integrator_mapping_edit_buyer_sel").val(data.buyerId);
                    $("#integrator_mapping_edit_integrator_sel").val(data.integratorId);
                    $("#followOrder_mapping_edit_sel").val(data.followOrderUserId);
                 //   $("#integrator_mapping_edit_developer_sel").val(data.developerId);
                    form.render('select');
                },
                yes: function () {
                    var obj = {};
                    obj.id=data.id;
                    obj.buyerId = $("#integrator_mapping_edit_buyer_sel").val();
                    obj.integratorId = $("#integrator_mapping_edit_integrator_sel").val();
                    obj.developerId = $("#integrator_mapping_edit_developer_sel").val();
                    obj.followOrderUserId = $("#followOrder_mapping_edit_sel").val();
                    $(integrator_mapping_purchasingAgentList).each(function () {
                        if (obj.buyerId == this.id) {
                            obj.buyer = this.userName;
                        }
                    });
                    $(integrator_mapping_intergationList).each(function () {
                        if (obj.integratorId == this.id) {
                            obj.integrator = this.userName;
                        }
                    });
                    // $(integrator_mapping_preprodDevList).each(function () {
                    //     if (obj.developerId == this.id) {
                    //         obj.developer = this.userName;
                    //     }
                    // });
                    $(follow_order_mapping_userList).each(function () {
                        if (obj.followOrderUserId == this.id) {
                            obj.followOrderUserName = this.userName;
                        }
                    });
                    if((obj.integratorId == null || obj.integratorId=='')){
                        layer.msg("采购整合人员不能为空",{icon:5});
                        return false;
                    }
                    if(!obj.followOrderUserId){
                        layer.msg("跟单专员不能为空",{icon:5});
                        return false;
                    }
                    // if((obj.integratorId == null || obj.integratorId=='')  &&( obj.developerId==null || obj.developerId=='')){
                    //     layer.msg("采购整合人员or开发专员不能都为空",{icon:5});
                    //     return false;
                    // }
                    admin.load.show();
                    $.ajax({
                        url: ctx + '/msgPreprodBuyer/updatePreprodBuyerMappingList.html',
                        data: obj,
                        dataType: "json",
                        type: "post",
                        success: function (returnData) {
                            if (returnData.code == "0000") {
                                layer.closeAll();
                                layer.msg('修改映射成功',{icon:1});
                                layer.closeAll();
                                reloadIntegratorMappingTable();
                            } else {
                                layer.msg(returnData.msg);
                            }
                        },
                        error: function () {
                            admin.load.hide();
                            layer.msg("服务器正忙",{icon:5});
                        }
                    });
                },
                end:function () {
                    layer.closeAll();
                }
            });
        } else if (layEvent === 'del') {
            layer.confirm('是否删除此采购人员<span style="color: red;"> '+data.buyer+' </span>对应的映射？', function (result) {
                if (result) {
                    admin.load.show();
                    $.ajax({
                        url: ctx + '/msgPreprodBuyer/delOneMsgPreprodBuyerMapping.html',
                        data: {"id": data.id},
                        dataType: "json",
                        type: "post",
                        success: function (returnData) {
                            admin.load.hide();
                            if (returnData.code == "0000") {
                                layer.msg('删除映射成功',{icon:1});
                                reloadIntegratorMappingTable();
                            } else {
                                layer.msg(returnData.msg,{icon:5});
                            }
                        },
                        error: function () {
                            admin.load.hide();
                            layer.msg("服务器正忙",{icon:5});
                        }
                    });
                }
            });
        }
    });
    /**
     * 初始化人员选择框
     */
    var integrator_mapping_enableUser = {};//在职人员
    var integrator_mapping_purchasingAgentList = {};//采购专员
    var integrator_mapping_preprodDevList = {};//开发专员
    var integrator_mapping_intergationList = {};//整合人员
    var follow_order_mapping_userList = {};//跟单专员
    function initIntegratorMappingSelData() {
        $("#integrator_mapping_buyer_sel").html("<option value=''>请选择</option>");
        $("#integrator_mapping_integrator_sel").html("<option value=''>请选择</option>");
        $("#integrator_mapping_developer_sel").html("<option value=''>请选择</option>");
        $("#followOrder_mapping_buyer_sel").html("<option value=''>请选择</option>");
        $.ajax({
            url: ctx + "/msgPreprodBuyer/getSysUserList.html",
            dataType: "json",
            type: "post",
            success: function (returnData) {
                if (returnData.code = '0000') {
                    var obj = returnData.data;
                    integrator_mapping_enableUser = obj.allUserList;
                    integrator_mapping_purchasingAgentList = obj.purchasingAgentList;
                    integrator_mapping_preprodDevList = obj.preprodDevList ;
                    integrator_mapping_intergationList = obj.intergationList;
                    follow_order_mapping_userList = obj.followOrderUserList;
                    $(integrator_mapping_purchasingAgentList).each(function(){
                        $("#integrator_mapping_buyer_sel").append("<option value='"+this.id+"'>"+this.userName+"</option>");
                    });
                    $(integrator_mapping_intergationList).each(function(){
                        $("#integrator_mapping_integrator_sel").append("<option value='"+this.id+"'>"+this.userName+"</option>");
                    });
                    $(follow_order_mapping_userList).each(function(){
                        $("#followOrder_mapping_buyer_sel").append("<option value='"+this.id+"'>"+this.userName+"</option>");
                    });
                    // $(integrator_mapping_preprodDevList).each(function(){
                    //     $("#integrator_mapping_developer_sel").append("<option value='"+this.id+"'>"+this.userName+"</option>");
                    // });
                    form.render('select');
                }
            },
            error: function () {
                layer.msg("服务器正忙",{icon:5});
            }
        });
    }

    /**
     * 获取搜索参数
     */
    function getIntegratorMappingSearchData(){
        var obj={};
        obj.buyerId=$.trim($("#integrator_mapping_buyer_sel").val());
        obj.integratorId=$.trim($("#integrator_mapping_integrator_sel").val());
        obj.followOrderUserId=$.trim($("#followOrder_mapping_buyer_sel").val());
       // obj.developerId=$.trim($("#integrator_mapping_developer_sel").val());
        return obj;
    }
});
