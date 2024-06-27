console.log("test use");
var mgmtCateTree;
var prodCateTree;
var prodCateData;
layui.use(["admin", "form", "table", "laydate", "upload"], function() {
    Current_mgmtCateId_peopleitem = 0
    var $ = layui.$,
        admin = layui.admin,
        element = layui.element,
        layer = layui.layer,
        laydate = layui.laydate,
        table = layui.table,
        upload = layui.upload,
        form = layui.form;
    form.render(null, "component-form-element");
    form.render(null, "component-form-group");
    //添加分组
    $("#addItems").on("click", function() {
        layer.open({
            type: 1,
            title: "添加分组",
            id: 'addItemSuccess',
            area: ["500px", "200px"],
            btn: ["保存", "取消"],
            content:
                '<div style="padding:20px"><input type="text" id="inp" class="layui-input"></div>',
            yes: function(index, layero) {
                var groupName = $("#inp").val();
                if (groupName != "") {
                    $.ajax({
                        type: "post",
                        url: ctx + "/prodmgmtcate/savemgmtgroup.html",
                        async: true,
                        dataType: "json",
                        data: { name: groupName },
                        success: function(returnData) {
                            if (returnData.code != "0000") {
                                layer.alert(returnData.msg, { icon: 2 });
                            } else {
                                $('select[name="pid"]').append(
                                    "<option value=" +
                                    returnData.data +
                                    ">" +
                                    groupName +
                                    "</option>"
                                );
                                $('select[name="pid"] option:last').prop("selected", true);
                                form.render("select");
                            }
                        },
                    });
                }
                layer.close(index);
            },
        });
    });

    //添加类目
    $("#addPeopleItem").on("click", function() {
        layer.open({
            title: "添加类目",
            type: 1, //不加该属性,就会出现[object Object]
            area: ["600px", "300px"],
            move: false,
            id: 'peopleItemSuccess',
            shadeClose: false,
            btn: ["保存", "关闭"],
            content: $("#editMgmtCateLayer"),
            success: function(layero) {
                console.log(layero);
                var mask = $(".layui-layer-shade");
                mask.appendTo(layero.parent());
            },
            yes: function(index, layero) {
                saveMgmtCate(index);
            },
        });
        //清除
        $("#editMgmtCateLayer input[name=id]").val("");
        $("#editMgmtCateLayer input[name=name]").val("");
        $("#editMgmtCateLayer select[name=pid] option:first").prop("selected",true);
        form.render("select");
    });
    //修改类目
    $("#editPeopleItem").on("click", function() {
        var id = $("#mgmtCateContent input[name=id]").val();
        if (parseInt(id) != id) {
            layer.msg("请选择类目");
            return;
        }
        layer.open({
            title: "修改类目",
            type: 1, //不加该属性,就会出现[object Object]
            area: ["600px", "300px"],
            id: 'peopleItemSuc',
            move: false,
            shadeClose: false,
            btn: ["保存", "关闭"],
            content: $("#editMgmtCateLayer"),
            success: function(layero) {
                // console.log(layero);
                var mask = $(".layui-layer-shade");
                mask.appendTo(layero.parent());
            },
            yes: function(index, layero) {
                saveMgmtCate(index);
            },
        });
        //读取
        $("#editMgmtCateLayer input[name=id]").val(id);
        $("#editMgmtCateLayer input[name=name]").val(
            $("#mgmtCateContent .mgmt-cate-name").text()
        );
        $("#editMgmtCateLayer select[name=pid]").val(
            $("#mgmtCateContent input[name=pid]").val()
        );
        form.render("select");
    });
    function saveMgmtCate(index) {
        var id = $("#editMgmtCateLayer input[name=id]").val();
        var name = $("#editMgmtCateLayer input[name=name]").val();
        var pid = $("#editMgmtCateLayer select[name=pid]").val();
        $.ajax({
            type: "post",
            url: ctx + "/prodmgmtcate/savemgmtcate.html",
            dataType: "json",
            data: {
                id: id,
                name: name,
                pid: pid,
            },
            success: function(returnData) {
                if (returnData.code != "0000") {
                    layer.alert(returnData.msg, { icon: 2 });
                } else {
                    layer.msg("修改成功");
                    layer.close(index);
                    initMgmtCateTree(returnData.data);
                }
            },
        });
    }
    //删除类目
    $("#removePeopleItem").on("click", function() {
        var nodes = mgmtCateTree.getSelectedNodes();
        if (nodes.length == 0) {
            layer.msg("未选择类目或分组");
            return;
        }
        var ids = new Set();
        for (var i = 0; i < nodes.length; i++) {
            ids.add(nodes[i].id);
            if (nodes[i].isParent) {
                //不允许删除父分组
                layer.alert("分组下有类目不能删除", { icon: 2 });
                return;
            }
        }
        ids = Array.from(ids);
        //询问框
        layer.confirm(
            "删除选中的分组和类目吗(已选中" + nodes.length + "项)？<br> 与smt类目的绑定关系也会被删除",
            {
                btn: ["确定", "取消"], //按钮
            },
            function() {
                $.ajax({
                    type: "post",
                    url: ctx + "/prodmgmtcate/deletemgmtcate.html",
                    async: true,
                    dataType: "json",
                    data: { ids: ids.join(",") },
                    success: function(returnData) {
                        if (returnData.code != "0000") {
                            layer.alert(returnData.msg, { icon: 2 });
                        } else {
                            layer.msg("删除成功");
                            initMgmtCateTree();
                        }
                    },
                });
            },
            function() {}
        );
    });
    //修改商品类目
    $("#editProdCate").on("click", function() {
        layer.open({
            title: "修改商品类目",
            type: 1, //不加该属性,就会出现[object Object]
            area: ["600px", "75%"],
            id:'cateSuccess',
            btn: ["保存", "关闭"],
            move: false,
            shadeClose: false,
            content: $("#editProdCateLayer"),
            success:function(layero){
                console.log(layero);
                var mask = $(".layui-layer-shade");
                mask.appendTo(layero.parent());
            },
            yes: function(index, layero) {
                //保存
                var prodCateIds = [];
                var selectNodes = prodCateTree.getCheckedNodes(true);
                for (var i = 0; i < selectNodes.length; i++) {
                    if (!selectNodes[i].chkDisabled) {
                        prodCateIds.push(selectNodes[i].id);
                    }
                }
                var id = $("#mgmtCateContent input[name=id]").val();
                $.ajax({
                    type: "post",
                    url: ctx + "/prodmgmtcate/saveprodcate.html",
                    async: true,
                    dataType: "json",
                    data: {
                        id: id,
                        prodCateIds: prodCateIds.join(","),
                    },
                    success: function(returnData) {
                        if (returnData.code != "0000") {
                            layer.alert(returnData.msg, { icon: 2 });
                            return;
                        } else {
                            layer.msg("修改成功");
                            layer.close(index);
                            showMgmtCate(id);
                        }
                    },
                });
            },
        });
        //初始化
        initProdCateTree();
        //赋值
        var prodCateIds = $("#mgmtCateContent input[name=prodCateIds]").val();
        if (prodCateIds.length > 0) {
            prodCateIds = prodCateIds.split(",");
            for (var i = 0; i < prodCateIds.length; i++) {
                var node = prodCateTree.getNodeByParam("id", prodCateIds[i]);
                prodCateTree.checkNode(node, true, false, true);
            }
        }
    });

    // 绑定人员点击事件
    $('#bindDeveloper_peopleitem').click(function () {
        if (!Current_mgmtCateId_peopleitem) {
            layer.msg('请选择绑定的管理类目')
            return
        }
        var outerIndex = layer.open({
            title: '绑定人员',
            type: 1, //不加该属性,就会出现[object Object]
            area: ['1000px', '600px'],
            id: 'developerBindPop',
            btn: ['确定', '关闭'],
            content: $('#developerBindPop_peopleitem').html(),
            success: function () {
                $('#developerBindForm_peopleitem [name=mgmtCateId]').val(Current_mgmtCateId_peopleitem)
                getDeveloperByMgmtCateId(Current_mgmtCateId_peopleitem,true)
                form.on('checkbox(selectAll_developerBindPop_peopleitem)', function (data) {
                    var checked = data.elem.checked
                    $('#developerBindForm_peopleitem input[type=checkbox]:enabled').prop('checked', checked)
                    form.render('checkbox')
                })
                form.render('checkbox')
            },
            yes: function () {
                var checkedDeveloper = $('#developerBindForm_peopleitem [name=developerId]:checked')
                var developerIdList = []
                for (var i = 0; i < checkedDeveloper.length; ++i) {
                    developerIdList.push(checkedDeveloper[i].value)
                }
                var AData = {
                    mgmtCateId : $('#developerBindForm_peopleitem [name=mgmtCateId]').val(),
                    developerIdListStr: developerIdList.join(',')
                }
                loading.show()
                $.ajax({
                    type: "post",
                    url: ctx + "/prodmgmtcate/bindDeveloper.html",
                    dataType: "json",
                    data: AData,
                    success: function(res) {
                        loading.hide()
                        if (res.code == '0000') {
                            layer.msg('绑定成功')
                            layer.close(outerIndex)
                            getDeveloperByMgmtCateId(AData.mgmtCateId,false)
                        } else {
                            layer.msg(res.msg)
                        }
                    }
                })
            }
        })
    })
});
//初始化管理类目tree
function initMgmtCateTree(checkedId) {
    //左侧类目tree
    var setting = {
        check: {
            enable: false,
        },
        data: {
            simpleData: {
                enable: true,
                idKey: "id",
                pIdKey: "pId",
            },
        },
        callback: {
            beforeClick: function(treeId, treeNode) {
                var parentNode = treeNode.getParentNode();
                Current_mgmtCateId_peopleitem = treeNode.id
                // 查询已经绑定的人员
                getDeveloperByMgmtCateId(Current_mgmtCateId_peopleitem)
                if (parentNode != null) {
                    //类目
                    showMgmtCate(treeNode.id);
                } else {
                    //分组
                }
                return true;
            },
        },
    };
    $.ajax({
        type: "post",
        url: ctx + "/prodmgmtcate/list.html",
        dataType: "json",
        async: true,
        success: function(returnData) {
            if (returnData.code != "0000") {
                layer.alert(returnData.msg, { icon: 2 });
                return;
            }
            var zNodes = returnData.data;
            var t = $("#mgmtCateTree");
            t = $.fn.zTree.init(t, setting, zNodes);
            mgmtCateTree = $.fn.zTree.getZTreeObj("mgmtCateTree");
            mgmtCateTree.expandAll(true);
            //初始化选中的node
            if ((checkedId = parseInt(checkedId))) {
                mgmtCateTree.selectNode(mgmtCateTree.getNodeByParam("id", checkedId));
                $("#mgmtCateTree .curSelectedNode").trigger("click");
            } else {
                clearMgmtCate();
            }
            //初始化分组select
            //返回根节点集合
            var rootNodes = mgmtCateTree.getNodesByFilter(function(node) {
                return node.level == 0;
            });
            $("#editMgmtCateLayer select[name=pid]").html(
                "<option value=''>请选择</option>"
            );
            for (var i = 0; i < rootNodes.length; i++) {
                $("#editMgmtCateLayer select[name=pid]").append(
                    "<option value='" +
                    rootNodes[i].id +
                    "'>" +
                    rootNodes[i].name +
                    "</option>"
                );
            }
        },
    });
}

/**
 * 根据管理类目id 获取已经绑定的从属人员
 * @param mgmtCateId   管理类目id
 * @param ifToBind  是否正在进行绑定操作
 */
function getDeveloperByMgmtCateId(mgmtCateId,ifToBind) {
    loading.show()
    $.ajax({
        type: "post",
        url: ctx + "/prodmgmtcate/getdeveloperByMgmtCateId.html",
        data: {mgmtCateId: mgmtCateId},
        dataType: "json",
        async: true,
        success: function(res) {
            loading.hide()
            if (res.code == '0000') {
                if (ifToBind) {
                    for (var i = 0; i < res.data.length; ++i) {
                        $('#developerBindForm_peopleitem [name=developerId][value='+ res.data[i].developerId +']').prop('checked','true')
                    }
                    layui.form.render('checkbox','developerBindForm_peopleitem')
                } else {
                    var developerList = ''
                    for (var i = 0; i < res.data.length; ++i) {
                        developerList += '<span class="nameBox_peopleitem">' + res.data[i].developer + '</span>'
                    }
                    $('#developerBox_peopleitem').html(developerList)
                }
            } else {
                layui.layer.msg(res.msg)
            }
        }
    })
}
//选中tree
function showMgmtCate(id) {
    //清空值
    clearMgmtCate();
    //初始化
    $.ajax({
        type: "post",
        url: ctx + "/prodmgmtcate/get.html",
        async: true,
        dataType: "json",
        data: { id: id },
        success: function(returnData) {
            if (returnData.code != "0000") {
                layer.alert(returnData.msg, { icon: 2 });
                return;
            }
            //赋值
            var data = returnData.data;
            $("#mgmtCateContent input[name=id]").val(data.id);
            $("#mgmtCateContent input[name=pid]").val(data.pId);
            $("#mgmtCateContent .mgmt-cate-name").text(data.name);
            //组名
            var pname = mgmtCateTree.getNodeByParam("id", data.pId).name;
            $("#mgmtCateContent .mgmt-cate-pname").text(pname);
            //商品类目
            var prodCateIds = [];
            var str = "";
            if (data.prodCates != undefined && data.prodCates.length > 0) {
                for (var i = 0; i < data.prodCates.length; i++) {
                    var cateNames = getProdCateNameById(data.prodCates[i].id, []);
                    str += "<tr><td>" + cateNames.reverse().join(">>") + "</td></tr>";
                    prodCateIds.push(data.prodCates[i].id);
                }
            }
            $("#mgmtCateContent .smt-cate-table tbody").html(str);
            $("#mgmtCateContent input[name=prodCateIds]").val(prodCateIds.join(","));
        },
    });
}
//从商品分类ztree获取商品完整的名称
function getProdCateNameById(id, cateNames) {
    var node = prodCateTree.getNodeByParam("id", id);
    cateNames.push(node.name);
    if (node.getParentNode() != null) {
        getProdCateNameById(node.pid, cateNames);
    }
    return cateNames;
}
function clearMgmtCate() {
    $("#mgmtCateContent input[name=id]").val("");
    $("#mgmtCateContent input[name=pid]").val("");
    $("#mgmtCateContent .mgmt-cate-name").text("");
    $("#mgmtCateContent .mgmt-cate-pname").text("");
    $("#mgmtCateContent .smt-cate-table tbody").html("");
    $("#mgmtCateContent input[name=prodCateIds]").val("");
}
//初始化商品类目tree
function initProdCateTree() {
    //左侧类目tree
    var setting = {
        check: {
            enable: true,
            chkDisabledInherit: true,
        },
        data: {
            simpleData: {
                enable: true,
                idKey: "id",
                pIdKey: "pid",
            },
        },
        callback: {
            onCheck: function(event, treeId, treeNode) {
                //禁用所有子类
                if (treeNode.isParent) {
                    var childrenNodes = treeNode.children;
                    try {
                        for (var i = 0; i <= childrenNodes.length; i++) {
                            prodCateTree.setChkDisabled(
                                childrenNodes[i],
                                treeNode.checked,
                                false,
                                true
                            );
                        }
                    } catch (e) {
                        //TODO handle the exception
                        console.log(e)
                    }
                    var childrenIds = getChildren([], treeNode);
                    for (var i = 0; i < childrenIds.length; i++) {
                        var node = prodCateTree.getNodeByParam("id", childrenIds[i]);
                        prodCateTree.checkNode(node, treeNode.checked, false, true);
                    }
                }
            }
        },
    };
    setting.check.chkboxType = { Y: "s", N: "s" };
    if (prodCateData == undefined) {
        $.ajax({
            type: "post",
            url: ctx + "/prodcate/listtree.html",
            dataType: "json",
            async: true,
            success: function(returnData) {
                if (returnData.code != "0000") {
                    layer.alert(returnData.msg, { icon: 2 });
                    return;
                }
                prodCateData = returnData.data;
                var t = $("#prodCateTree");
                t = $.fn.zTree.init(t, setting, prodCateData);
                prodCateTree = $.fn.zTree.getZTreeObj("prodCateTree");
                // prodCateTree.expandAll(true);
            },
        });
    } else {
        prodCateTree.destroy();
        var t = $("#prodCateTree");
        t = $.fn.zTree.init(t, setting, prodCateData);
        prodCateTree = $.fn.zTree.getZTreeObj("prodCateTree");
    }
}
//获取ztree所有字节点id
function getChildren(ids, treeNode) {
    ids.push(treeNode.id);
    if (treeNode.isParent) {
        for (var obj in treeNode.children) {
            getChildren(ids, treeNode.children[obj]);
        }
    }
    return ids;
}
//初始化tree
$(document).ready(function() {
    initMgmtCateTree();
    initProdCateTree();
});
