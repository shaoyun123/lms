layui.use(["admin", "form", "table", "layer", "laytpl", "laydate"], function () {
    var admin = layui.admin,
        form = layui.form,
        table = layui.table,
        layer = layui.layer,
        laytpl = layui.laytpl,
        laydate = layui.laydate,
        $ = layui.$;
    form.render('select');
    form.render('radio');
    form.render('checkbox');

    //按钮的点击事件
    $("#addWinitProdPackSpec").click(function () {
        var index = layer.open({
            type: 1,
            title: "新增包装规格",
            area: ["800px", "450px"],
            shadeClose: false,
            btn: ['保存','关闭'],
            content: $("#addWinitProdPackSpecLayer").html(),
            yes: function () {
                $("#addWinitProdPackSpecForm #addWinitProdPackSpecInfo").click();
            },
            end: function () {
                $("#addWinitProdPackSpecForm").trigger('reset');
                $("#addWinitProdPackSpecForm input[name='id']").val("");
            }
        });
    });
    //表格渲染结果
    //展示已知数据
    table.render({
        elem: "#winitProdPackSpecTable",
        method: "post",
        url: ctx + "/winitProdPackSpec/pageData.html",
        cols: [
            [
                //标题栏
                {type: "checkbox"},
                {field: "code", title: "规格代码"},
                {field: "name", title: "规格名称"},
                {field: "unitCost", title: "成本单价（￥）"},
                {field: "weight", title: "重量（克）"},
                {field: "remark", title: "备注"},
                //绑定工具条
                //{title: '操作', width: 300, align: 'center', toolbar: '#prodSupplierTableBar'}
            ],
        ],
        id: 'winitProdPackSpecReloadTable',
        page: true,
        limits: [20, 50, 100],
        limit: 20,
        done: function(){
            //表头固定处理
            // theadHandle().fixTh({ id:'#prodPackSpecCard',dv1:'.layui-table-header',dv2:'',h:74 })
        }
    });

    // 搜索
    var active = {
        reload: function () {
            var code = $("#winitProdPackSpecSearchForm input[name='code']").val();
            var name = $("#winitProdPackSpecSearchForm input[name='name']").val();
            //执行重载
            table.reload('winitProdPackSpecReloadTable', {
                page: {curr: 1},
                where: {
                    code: code,
                    name: name,
                }
            });
        },
        updWinitProdPackSpec: function () { //获取选中数据
            var checkStatus = table.checkStatus('winitProdPackSpecReloadTable')
                , data = checkStatus.data;
            if (data.length == 0) {
                layer.msg("未选中数据");
            } else if (data.length >= 2) {
                layer.msg("请选择单条数据");
            } else {
                layer.open({
                    type: 1,
                    title: "修改包装规格",
                    area: ["800px", "450px"],
                    shadeClose: false,
                    btn: ['保存','取消'],
                    content: $("#addWinitProdPackSpecLayer").html(),
                    success: function (layero, index) {
                        getProdPackSpecInfo(data[0]['id']);
                        form.render('select');
                        form.render('radio');
                        form.render('checkbox');
                        // $("#addProdPackSpecForm input[name='code']").attr("readonly","readonly");
                    },
                    yes: function(){
                        $("#addWinitProdPackSpecForm #addWinitProdPackSpecInfo").click();
                    },
                    end: function () {
                        $("#addWinitProdPackSpecForm").trigger('reset');
                        $("#addWinitProdPackSpecForm input[name='id']").val("");
                        $("#addWinitProdPackSpecForm input[name='code']").removeAttr("readonly");
                    }
                });
            }
        },
        delWinitProdPackSpec: function () { //获取选中数据
            var checkStatus = table.checkStatus('winitProdPackSpecReloadTable')
                , data = checkStatus.data;
            if (data.length == 0) {
                layer.msg("未选中数据");
            } else if (data.length >= 2) {
                layer.msg("请选择单条数据");
            } else {
                deleteProdPackSpec(data[0]['id']);
            }
        }
    };

    $('#winitProdPackSpecSearch').click(function () {
        var type = $(this).data('type');
        active[type] ? active[type].call(this) : '';
    });

    $('#winitProdPackSpecOperateOption .layui-btn').click(function () {
        var type = $(this).data('type');
        active[type] ? active[type].call(this) : '';
    });

    form.on('submit(addWinitProdPackSpecInfo)', function (data) {
        $.ajax({
            type: "post",
            url: ctx + "/winitProdPackSpec/addOrUpdateData.html",
            dataType: "json",
            data: data.field,
            success: function (returnData) {
                if (returnData.code == "0000") {
                    layer.closeAll();
                    layer.msg("操作成功");
                    table.reload('winitProdPackSpecReloadTable');
                } else {
                    layer.msg(returnData.msg);
                }
            },
            error: function () {
                layer.msg("发送请求失败");
            }
        })
        return false;
    });

    // 获取包装规格信息
    function getProdPackSpecInfo(id) {
        if (typeof (id) == "undefined") {
            layer.msg('服务器正忙');
            return;
        }
        $.ajax({
            type: "POST",
            url: ctx + "/winitProdPackSpec/getOneData.html",
            data: {"id": id},
            async: false,
            dataType: "json",
            success: function (returnData) {
                $("#addWinitProdPackSpecForm input[name='id']").val(returnData.data.id);
                $("#addWinitProdPackSpecForm input[name='code']").val(returnData.data.code);
                $("#addWinitProdPackSpecForm input[name='name']").val(returnData.data.name);
                $("#addWinitProdPackSpecForm input[name='unitCost']").val(returnData.data.unitCost);
                $("#addWinitProdPackSpecForm input[name='weight']").val(returnData.data.weight);
                $("#addWinitProdPackSpecForm input[name='note']").val(returnData.data.note);
                $("#addWinitProdPackSpecForm input[name='barcode']").val(returnData.data.barcode);
                $("#addWinitProdPackSpecForm textarea[name='remark']").val(returnData.data.remark);
            },
            error: function () {
                layer.msg("服务器正忙");
            }
        });
    }

    //删除包装规格
    function deleteProdPackSpec(id) {
        if (typeof (id) == "undefined") {
            layer.msg('服务器正忙');
            return;
        }
        layer.confirm('是否删除此包装规格？', function (result) {
            if (result) {
                $.ajax({
                    url: ctx + '/winitProdPackSpec/deleteData.html',
                    data: {"id": id},
                    dataType: "json",
                    success: function (returnData) {
                        if (returnData.code == "0000") {
                            layer.closeAll();
                            layer.msg('操作成功');
                            table.reload('winitProdPackSpecReloadTable');
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