/**
 * time: 2018/02/07
 */
layui.use(["admin", "form", "table", "layer", "formSelects"], function () {
    let admin = layui.admin,
        form = layui.form,
        table = layui.table,
        layer = layui.layer,
        formSelects = layui.formSelects,
        $ = layui.$;
    form.render('select');
    form.render('radio');
    form.render('checkbox');

    //按钮的点击事件
    $("#addDevMapping").click(function () {
        devmapping_popToAddOrEditDevMapping("新增人员映射")
    });

    function devmapping_popToAddOrEditDevMapping(title,originData) {
        let index = layer.open({
            type: 1,
            title: title,
            area: ["800px", "450px"],
            shadeClose: false,
            btn: ['保存','关闭'],
            content: $("#dm_addMappingLayer").html(),
            success:function () {
                initNotNull('#dm_addMappingForm')
                formSelects.render('devmapping_managerIdEdit');
                if (originData) {
                    initOriginData(originData);
                }
                form.render('select','dm_addMappingForm');
            },
            yes: function () {
                if (!checkNotNull('#dm_addMappingForm')) {
                    return false
                }
                let dataForm = $('#dm_addMappingForm');
                let Adata = serializeObject(dataForm);
                Adata.developer=dataForm.find("select[name='developerId'] option:selected").text();
                Adata.auditor=dataForm.find("select[name='auditorId'] option:selected").text();
                Adata.teamLeader=dataForm.find("select[name='teamLeaderId'] option:selected").text();
                Adata.purchaseAssi=dataForm.find("select[name='purchaseAssiId'] option:selected").text();
                let managers = formSelects.value('devmapping_managerIdEdit', 'name')
                Adata.managers= managers.join(',')
                if (originData) {
                    Adata.id = originData.id
                    Adata.developerId = originData.developerId
                    Adata.developer = originData.developer
                }
                // 编码规则校验
                if (!validateSKU2(Adata.skuPrefix)) {
                    layer.msg('SKU编码规则不合法，只能由大写字母和数字组成')
                    return
                }

                $.ajax({
                    type: "post",
                    url: ctx + "/preProdDev/addOrEditMapping.html",
                    dataType: "json",
                    data: Adata,
                    success: function (returnData) {
                        if (returnData.code === "0000") {
                            layer.close(index);
                            $('#dm_searchBtn').trigger('click');
                            layer.msg("操作成功");
                        } else {
                            layer.msg(returnData.msg);
                        }
                    },
                    error: function () {
                        layer.msg("发送请求失败");
                    }
                })
            }
        });
    }

    //表格渲染结果
    //展示已知数据
    table.render({
        elem: "#devMappingTable",
        method: "post",
        url: ctx + '/preProdDev/devMappingPage.html',
        cols: [
            [
                {field: "developer", title: "开发专员"},
                {field: "skuPrefix", title: "SKU编码"},
                {field: "orgName", title: "所属部门"},
                {field: "auditor", title: "初审专员"},
                {field: "teamLeader", title: "开发组长"},
                {field: "purchaseAssi", title: "采购助理"},
                {field: "managers", title: "开发主管"},
                //绑定工具条
                {title: '操作',align: 'center', toolbar: '#dm_editBar'}
            ],
        ],
        id: 'devMappingTable',
        page: true,
        limits: [50, 100, 1000],
        limit: 50,
        done: function (res, curr, count) {
            admin.load.hide();
        }
    });

    // 搜索提交
    $('#dm_searchBtn').click(function () {
        let data = serializeObject($('#dm_searchForm'))
        // 执行重载
        admin.load.show();
        table.reload('devMappingTable', {
            page: {
                curr: 1 // 重新从第 1 页开始
            },
            where: data
        })
    })

    table.on('tool(devMappingTable)', function (obj) {
        let layEvent = obj.event; // 获得 lay-event 对应的值
        let data = obj.data; // 获得当前行数据
        if (layEvent === 'edit') {
            devmapping_popToAddOrEditDevMapping("编辑人员映射",data)
        } else if (layEvent === 'del') {
            delDevMapping(data.id);
        }
    })

    // 获取原数据
    function initOriginData(data) {
        console.log(data)
        let form = $('#dm_addMappingForm')
        form.find("select[name='developerId']").val(data.developerId);
        form.find("select[name='auditorId']").val(data.auditorId);
        form.find("select[name='teamLeaderId']").val(data.teamLeaderId);
        form.find("select[name='purchaseAssiId']").val(data.purchaseAssiId);
        form.find("input[name='skuPrefix']").val(data.skuPrefix);
        form.find("select[name='developerId']").prop('disabled',true);
        let managerIdArr = data.managerIds.split(',')
        formSelects.value('devmapping_managerIdEdit', managerIdArr)
    }

    //删除包装规格
    function delDevMapping(id) {
        if (typeof (id) == "undefined") {
            layer.msg('参数错误');
            return;
        }
        layer.confirm('是否删除此映射？', function (result) {
            if (result) {
                $.ajax({
                    url: ctx + '/preProdDev/delMapping.html',
                    data: {"id": id},
                    dataType: "json",
                    success: function (returnData) {
                        if (returnData.code === "0000") {
                            layer.msg('操作成功');
                            $('#dm_searchBtn').trigger('click');
                        } else {
                            layer.msg(returnData.msg);
                        }
                    },
                    error: function () {
                        layer.msg("服务器正忙");
                    }
                });
            }
        });
    }
});




