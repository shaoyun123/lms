layui.use(["admin", "form", "table", "layer", "laytpl", 'element'], function () {
        var admin = layui.admin,
            form = layui.form,
            table = layui.table,
            layer = layui.layer,
            laytpl = layui.laytpl,
            element = layui.element;
        $ = layui.$;
        form.render("select");
        form.render("radio");
        form.render("checkbox");
        table.render({
            elem: "#warehouse_table1",
            method: "post",
            url: ctx + "/prodWarehouse/getWarehouseByAuth",
            cols: [
                [
                    //标题栏
                    {type: "checkbox"},
                    {field: "id", title: "id",width: 70},
                    {field: "warehouseName", title: "仓库"},
                    {field: "overseasWhCountry", title: "海外仓国家"},
                    {field: "address", title: "仓库地址"},
                    // {field: "allRootId", title: "普源仓库ID"},
                    {field: "remark", title: "备注"},
                    {
                        title: "操作",
                        align: "center",
                        toolbar: "#warehouse_bar",
                    },
                ],
            ],
            done: function (res, curr, count) {
            },
            id: "warehouse_table1",
        });

        //行事件
        table.on("tool(warehouse_table1)", function (obj) {
                var data = obj.data;
                if (obj.event == "warehouse_tr_edit") {
                    layer.open({
                        type: 1,
                        title: "编辑",
                        area: ["1000px", "500px"],
                        btn: ["保存", "关闭"],
                        content: $("#warehouse_tpl1").html(),
                        success: function (index, layero) {
                            //初始(回显)
                            loading.show();
                            $.ajax({
                                type: "POST",
                                url: ctx + "/prodWarehouse/detail.html",
                                data: {id: data.id},
                                async: false,
                                dataType: "json",
                                success: function (returnData) {
                                    if (returnData.code == "0000") {
                                        var data = returnData.data;
                                        // debugger
                                        $('#warehouse_form2 input[name=warehouseName]').val(data.warehouseName);
                                        $('#warehouse_form2 input[name=overseasWhCountry]').val(data.overseasWhCountry);
                                        $('#warehouse_form2 input[name=address]').val(data.address);
                                        $('#warehouse_form2 input[name=allRootId]').val(data.allRootId);
                                        $('#warehouse_form2 textarea[name=remark]').val(data.remark);
                                        $('#warehouse_form2 input[name=isDefault]').prop("checked",data.isDefault);
                                        $('#warehouse_form2 input[name=ifFbaDefault]').prop("checked",data.ifFbaDefault);
                                        // $('#warehouse_form2 input[name=shelfCheck]').prop("checked",data.shelfCheck);
                                        $('#warehouse_form2 input[name=isSplitComp]').prop("checked",data.isSplitComp);
                                        $('#warehouse_form2 input[name=osoOrderNum]').val(data.osoOrderNum);
                                        $('#warehouse_form2 input[name=osoSkuNum]').val(data.osoSkuNum);
                                        form.render("checkbox");
                                    } else {
                                        layer.msg(returnData.msg, {icon: 5});
                                    }
                                },
                                error: function () {
                                    layer.msg("服务器正忙");
                                },
                                complete: function () {
                                    loading.hide();
                                }
                            });
                            return false;
                        },
                        yes: function (index, layero) {
                            var req = {};
                            // debugger
                            req.id = data.id;
                            req.warehouseName = $('#warehouse_form2 input[name=warehouseName]').val();
                            req.overseasWhCountry = $('#warehouse_form2 input[name=overseasWhCountry]').val();
                            req.address = $('#warehouse_form2 input[name=address]').val();
                            req.allRootId = $('#warehouse_form2 input[name=allRootId]').val();
                            req.remark = $('#warehouse_form2 textarea[name=remark]').val();
                            req.isDefault = $("#warehouse_form2 input[name=isDefault]").is(':checked');
                            req.ifFbaDefault = $("#warehouse_form2 input[name=ifFbaDefault]").is(':checked');
                            // req.shelfCheck = $("#warehouse_form2 input[name=shelfCheck]").is(':checked');
                            req.isSplitComp = $("#warehouse_form2 input[name=isSplitComp]").is(':checked');
                            req.osoOrderNum = $('#warehouse_form2 input[name=osoOrderNum]').val();
                            req.osoSkuNum = $('#warehouse_form2 input[name=osoSkuNum]').val();

                            //确认钮
                            $.ajax({
                                type: "POST",
                                url: ctx + "/prodWarehouse/edit.html",
                                data: JSON.stringify(req),
                                contentType: 'application/json',
                                dataType: 'json',
                                success: function (returnData) {
                                    if (returnData.code == "0000") {
                                        layer.close(index);
                                        layer.msg("编辑成功");
                                        $("#warehouse_search").trigger("click");
                                    } else {
                                        layer.msg(returnData.msg);
                                    }
                                },
                                error: function () {
                                    layer.msg("服务器正忙");
                                },
                                complete: function () {
                                    loading.hide();
                                }
                            });
                            return false;
                        }
                    })
                }
                if (obj.event == "warehouse_tr_del") {

                    layer.confirm("确认删除?",{icon: 3, title: '提示'}, function () {
                        //初始(回显)
                        loading.show();
                        $.ajax({
                            type: "POST",
                            url: ctx + "/prodWarehouse/delete.html",
                            data: {id: data.id},
                            dataType: "json",
                            success: function (returnData) {
                                if (returnData.code == "0000") {
                                    layer.msg("删除成功");
                                    $("#warehouse_search").trigger("click");
                                } else {
                                    layer.msg(returnData.msg, {icon: 5});
                                }
                            },
                            error: function () {
                                layer.msg("服务器正忙");
                            },
                            complete: function () {
                                loading.hide();
                            }
                        });
                    });
                }
                if (obj.event == "warehouse_tr_edit_resource") {
                    layer.open({
                        type: 1,
                        title: '授与角色资源',
                        area: ['520px','600px'],
                        shade: 0, //遮罩透明度
                        btn: ['保存','关闭'],
                        content: $('#editRoleResourceLayer').html(),
                        success: function(){
                            table.render({
                                elem: '#editRoleResourceTable',
                                url:ctx + '/sys/queryRoleIdsByWarehouseId.html?resourceId='+data.id,  //数据接口
                                method:'get',
                                cols: [[//表头
                                    {type: 'checkbox'},
                                    {title: '角色名称',field: 'name',width:400}
                                ]],
                                id: "role_tableId"
                            });
                        },
                        yes: function(){
                            var checkStatus = table.checkStatus('role_tableId'),
                                selData = checkStatus.data;
                            var idsArr = [];
                            for(var i=0; i<selData.length; i++){
                                idsArr.push(selData[i].id);
                            }
                            if(!idsArr.length){
                                layer.msg('请先选中要保存的数据!');
                                return false;
                            }

                            $.ajax({
                                type: "post",
                                url: ctx + "/sys/editWarehouseForRoleList.html",
                                dataType: "json",
                                data: {
                                    "roleId": idsArr.toString(),
                                    "resourceId": data.id
                                },
                                success: function (returnData) {
                                    if (returnData.code == "0000") {
                                        layer.closeAll();
                                        layer.msg("授予角色资源成功");
                                    } else {
                                        layer.msg(returnData.msg);
                                    }
                                },
                                error: function () {
                                    layer.msg("发送请求失败");
                                }
                            })
                        }
                    })
                }
            }
        );

        //搜索事件
        $("#warehouse_search").click( function () {
            table.reload("warehouse_table1");
        });

        //新增
        $("#warehouse_add").click( function () {
            layer.open({
                type: 1,
                title: "新增",
                area: ["500px", "500px"],
                btn: ["保存", "关闭"],
                content: $("#warehouse_tpl1").html(),
                success:function(index, layero){
                    form.render("checkbox");
                    return false;
                },
                yes: function (index, layero) {
                    var req = {};
                    req.warehouseName = $('#warehouse_form2 input[name=warehouseName]').val();
                    req.overseasWhCountry = $('#warehouse_form2 input[name=overseasWhCountry]').val();
                    req.address = $('#warehouse_form2 input[name=address]').val();
                    req.allRootId = $('#warehouse_form2 input[name=allRootId]').val();
                    req.remark = $('#warehouse_form2 textarea[name=remark]').val();
                    req.isDefault = $("#warehouse_form2 input[name=isDefault]").is(':checked');
                    req.ifFbaDefault = $("#warehouse_form2 input[name=ifFbaDefault]").is(':checked');
                    // req.shelfCheck = $("#warehouse_form2 input[name=shelfCheck]").is(':checked');
                    req.osoOrderNum = $('#warehouse_form2 input[name=osoOrderNum]').val();
                    req.osoSkuNum = $('#warehouse_form2 input[name=osoSkuNum]').val();
                    //确认钮
                    loading.show();
                    $.ajax({
                        type: "POST",
                        url: ctx + "/prodWarehouse/save.html",
                        data: JSON.stringify(req),
                        contentType: 'application/json',
                        dataType: 'json',
                        success: function (returnData) {
                            if (returnData.code == "0000") {
                                layer.close(index);
                                layer.msg("新增成功");
                                $("#warehouse_search").trigger("click");
                            } else {
                                layer.msg(returnData.code+":"+returnData.msg);
                            }
                        },
                        error: function () {
                            layer.msg("服务器正忙");
                        },
                        complete: function () {
                            loading.hide();
                        }
                    });
                    return false;
                },
                end: function (index, layero) {
                    return false;
                },
            })
        });

    }
);