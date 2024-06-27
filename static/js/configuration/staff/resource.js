/**
 * time: 2018/01/02
 */

layui.use(["admin", "layer", "table", "form", "laytpl", "jquery"], function() {
    var layer = layui.layer,
        table = layui.table,
        form = layui.form,
        laytpl = layui.laytpl,
        $ = layui.$,
        admin = layui.admin;

    var checkedResId = 0;

    //渲染表格
    table.render({
        elem: "#resourceTable",
        method: 'post',
        url: ctx + "/sys/sysResourcePage.html",
        cols: [
            [
                //标题栏
                { field: "name", title: "名称" },
                { title: '类型', toolbar: '#resourceTypeBar' },
                { field: "url", title: "url" },
                { field: "sort", title: "排序"},
                { field: "tabName", title: "标签页名称"},
                { field: "smallIcon", title: "图标" },
                { title: '操作', toolbar: '#resourceOperBar',width:'30%'},
            ],
        ],
        id: "sysResourceTable",
    });

    function tableReload(resourceId) {
        table.reload('sysResourceTable', {
            where: {
                id: resourceId,
            }
        });
    }


    var resXTree = new layuiXtree({
        elem: 'resourceMangeXTree', //(必填) 放置xtree的容器id，不要带#号,
        form: form, //(必填) layui 的 from,
        isopen: false, //加载完毕后的展开状态，默认值：true,
        isCheckOnly: true,
        data: ctx + "/sys/listAllResource.html", //(必填) json数组
        color: { //三种图标颜色，独立配色，更改几个都可以
            open: "#EE9A00", //节点图标打开的颜色
            close: "#EEC591", //节点图标关闭的颜色
            end: "#828282", //末级节点图标的颜色
        },
        click: function(data) { //节点选中状态改变事件监听，全选框有自己的监听事件
            if (data.elem.checked) {
                tableReload(data.value);
                checkedResId = data.value;
            }
            resXTree.SetOtherCheckedFalse(data.value);
        }
    });

    //添加顶层菜单弹出框
    $("#addSysResourceBtn").click(function() {
        var index = layer.open({
            type: 1,
            title: "添加顶层菜单",
            // shade: 0, //遮罩透明度
            shadeClose: false,
            area: ["800px", "450px"],
            content: $("#addLayer"),
            move: false,
            success: function(layero) {
                $("#addForm input[name='smallIcon']").attr("disabled","disabled").css({"background-color":"#ccc"});
                var mask = $(".layui-layer-shade");
                mask.appendTo(layero.parent());
            },
            end: function() {
                //关闭时清空表格内容
                // $("#addForm")[0].reset();
                $("#addForm").trigger('reset');
            },
            btn: ['确定', '取消'],
            yes: lms_debounce(function (index, layero) {
                $("#submitAddResource").click();
            }, 1000)
        });
        $("#addForm input[name='parentId']").val(0);
        form.render('select');

    });

    //添加
    form.on('submit(addBtn)', function(data) {
        $.ajax({
            type: "post",
            url: ctx + "/sys/addSysResource.html",
            dataType: "json",
            data: data.field,
            success: function(returnData) {
                if (returnData.code == "0000") {
                    layer.closeAll();
                    layer.msg("添加资源成功");
                    // resXTree.render();
                } else {
                    layer.msg(returnData.msg);
                }
            },
            error: function() {
                layer.msg("发送请求失败");
            }
        })
        return false;
    });

    //工具条的监听事件,table.on(tool(表格的lay-filter的值))
    table.on('tool(resourceTable)', function(obj) {
        var data = obj.data, //获得当前行数据
            layEvent = obj.event; //获得 lay-event 对应的值
        if (layEvent === 'edit') {
            var id = data.id;
            $("#editForm input[name='id']").val(id);
            var index = layer.open({
                type: 1,
                title: "编辑资源",
                // shade: 0, //遮罩透明度
                shadeClose: false,
                area: ["800px", "450px"],
                content: $("#editLayer"),
                move: false,
                success: function(layero) {
                    if(data.parentId == 667){
                        $("#editForm input[name='smallIcon']").removeAttr("disabled").css({"background-color":"#fff"})
                    }else{
                        // $("#editForm input[name='smallIcon']").attr("disabled","disabled").css({"background-color":"#ccc"});
                        $("#editForm input[name='smallIcon']").css({"background-color":"#ccc"});
                    }
                    var mask = $(".layui-layer-shade");
                    mask.appendTo(layero.parent());
                },
                end: function() {
                    $("#editForm")[0].reset();
                },
                btn: ['确定', '取消'],
                yes: lms_debounce(function(index, layero) {
                    $("#resource_submitEditResource").click();
                },1000)
            });

            $.ajax({
                type: "post",
                url: ctx + '/sys/getSysResourceById.html',
                data: { "id": id },
                dataType: "json",
                async: false,
                success: function(returnData) {
                    if (returnData.code == "0000") {
                        var obj = returnData.data;
                        $("#editTypeSel").val(obj.type);
                        $("#editForm input[name='name']").val(obj.name);
                        $("#editForm input[name='code']").val(obj.code);
                        $("#editForm input[name='tabName']").val(obj.tabName);
                        $("#editForm input[name='smallIcon']").val(obj.smallIcon);
                        $("#editForm input[name='sort']").val(obj.sort);
                        $("#editForm input[name='url']").val(obj.url);
                        $("#editForm input[name='bigIcon']").val(obj.bigIcon);
                    } else {
                        layer.msg(returnData.msg);
                    }
                }
            });
            form.render('select');
        } else if (layEvent === 'del') {
            deleteResource(data.id);
        } else if (layEvent == "addSub") {
            var index = layer.open({
                type: 1,
                title: "添加子资源",
                // shade: 0, //遮罩透明度
                shadeClose: false,
                area: ["800px", "450px"],
                move: false,
                content: $("#addLayer"),
                success: function(layero) {
                    $("#addForm input[name='parentId']").val(data.id);
                    if(data.id == 667){
                        $("#addForm input[name='smallIcon']").removeAttr("disabled").css({"background-color":"#fff"})
                    }else{
                        $("#addForm input[name='smallIcon']").attr("disabled","disabled").css({"background-color":"#ccc"});
                    }
                    var mask = $(".layui-layer-shade");
                    mask.appendTo(layero.parent());
                },
                end: function() {
                    //关闭时清空表格内容
                    $("#addForm")[0].reset();
                },
                btn: ['确定', '取消'],
                yes: lms_debounce(function (index, layero) {
                    $("#submitAddResource").click();
                },1000)
            });
            form.render('select');
        }else if(layEvent == "queryRoleAndUser"){
            layer.open({
                type: 1,
                title: '查看授权的角色和人员',
                area: ['750px', '600px'],
                shade: 0, //遮罩透明度
                btn: ['关闭'],
                content: $('#queryRoleAndUserLayer').html(),
                success: function(){
                    table.render({
                        elem: '#queryRoleAndUserTable',
                        url:ctx + '/sys/queryUserAndRole.html?id='+data.id  //数据接口
                        // ,page: true //开启分页
                        ,cols: [[ //表头
                            {title: '类别',field: 'type',width:'30%',templet: '#typeTpl'}
                            ,{title: '名称',field: 'name',width:'35%'}
                            ,{title: '状态', field: 'status',width:'30%',templet: '#statusTpl'}
                        ]]
                    });
                }
            })
        }else if(layEvent == "editRoleResource"){
            layer.open({
                type: 1,
                title: '授与角色资源',
                area: ['520px','600px'],
                shade: 0, //遮罩透明度
                btn: ['保存','关闭'],
                content: $('#resource_editRoleResourceLayer').html(),
                success: function(){
                    table.render({
                        elem: '#resource_resource_editRoleResourceTable',
                        url:ctx + '/sys/listAllRolesByResource.html?resourceId='+data.id,  //数据接口
                        method:'post',
                        width:500,
                        cols: [[//表头
                             {type: 'checkbox'},
                             {title: '角色名称',field: 'name',width:400}
                        ]],
                        id: "resource_role_tableId"
                    });
                },
                yes: lms_debounce(function(){
                    var checkStatus = table.checkStatus('resource_role_tableId'),
                        selData = checkStatus.data;
                    var idsArr = [];
                    for(var i=0; i<selData.length; i++){
                        idsArr.push(selData[i].id);
                    }
                    if(!idsArr.length){
                        layer.msg('请先选中要保存的数据!');
                        return false;
                    }
                    editRoleResource(idsArr,data.id);
                }, 1000)
            })
        }
    })

    //修改
    form.on('submit(resource_editBtn)', function(data) {
        //处理资源图标
        if(data.field.url && data.field.smallIcon){
            data.field.smallIcon = data.field.smallIcon.substring(0,data.field.smallIcon.lastIndexOf("/")+1)+data.field.url;
        }
        $.ajax({
            type: "post",
            url: ctx + "/sys/editSysResource.html",
            dataType: "json",
            data: data.field,
            success: function(returnData) {
                if (returnData.code == "0000") {
                    layer.closeAll();
                    layer.msg("修改资源成功");
                    // resXTree.render();
                } else {
                    layer.msg(returnData.msg);
                }
            },
            error: function() {
                layer.msg("发送请求失败");
            }
        })
        return false;
    });


    //删除
    function deleteResource(id) {
        layer.confirm('删除后不可恢复，是否确认删除？', function(result) {
            if (result) {
                $.ajax({
                    type: "post",
                    url: ctx + '/sys/delSysResource.html',
                    data: { "id": id },
                    dataType: "json",
                    success: function(returnData) {
                        if (returnData.code == "0000") {
                            layer.msg("删除成功");
                            // resXTree.render();
                        } else {
                            layer.msg(returnData.msg);
                        }
                    },
                    error: function() {
                        layer.msg("发送请求失败");
                    }
                });
            }
        });
    }


    //授予角色资源
    function editRoleResource(roleIdList,resourceId) {
        $.ajax({
            type: "post",
            url: ctx + "/sys/editResourceForRoleList.html",
            dataType: "json",
            data: { "roleId": roleIdList.toString(),
                "resourceId":resourceId },
            beforeSend: function () {
                loading.show() 
            },
            success: function(returnData) {
                loading.hide()
                if (returnData.code == "0000") {
                    layer.closeAll();
                    layer.msg("授予角色资源成功");
                    // resXTree.render();
                } else {
                    layer.msg(returnData.msg);
                }
            },
            error: function() {
                loading.hide()
                layer.msg("发送请求失败");
            }
        })
    }
});