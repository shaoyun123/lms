/**
 * time: 2018/02/07
 */
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

    function prodPackSpecChangeStatus(id,ifVoiceBroadcast){
        return commonReturnPromise({
            type: 'post',
            url: '/lms/prodPackSpec/updateVoiceBroadcast.html',
            params:{
                id: id,
                ifVoiceBroadcast:ifVoiceBroadcast
            }
        })
    }

   function queryData(searchData){
       //展示已知数据
       table.render({
           elem: "#prodPackSpecTable",
           method: "post",
           url: ctx + "/prodPackSpec/getProdPackSpecs.html",
           where: searchData,
           cols: [
               [
                   //标题栏
                   {type: "checkbox"},
                   {field: "code", title: "规格代码"},
                   {field: "name", title: "规格名称"},
                   {field: "unitCost", title: "成本单价（￥）"},
                   {field: "weight", title: "重量（克）"},
                   {title: '语音播报', align: 'center', toolbar: '#prodPackSpec_ifVoiceBroadcast'},
                   {title: '是否默认', align: 'center', toolbar: '#prodPackSpec_ifDefault'},
                   {field: "remark", title: "备注"},
                   { title: '操作', align: 'center', toolbar: '#prodPackSpec_toolBar' }
               ],
           ],
           id: 'prodPackSpecTable',
           page: true,
           limits: [20, 50, 100],
           limit: 100,
           done: function(){
               //表头固定处理
               // theadHandle().fixTh({ id:'#prodPackSpecCard',dv1:'.layui-table-header',dv2:'',h:74 })
           }
       });
   }
    queryData({});

    table.on('tool(prodPackSpecTable)', function(obj) {
        var layEvent = obj.event; //获得 lay-event 对应的值
        var data = obj.data; //获得当前行数据
        switch (layEvent){
            case 'upd':
                updProdPackSpec(data.id);
                break
            case 'del':
                deleteProdPackSpec(data.id);
                break
            case 'setDefault':
                setDefault(data.id);
                break
        }
    })

    //监听表格事件
    form.on('switch(ifVoiceBroadcast_switch)', function(obj){
        var id = obj.elem.dataset.id;
        var ifVoiceBroadcast = obj.elem.checked;
        if(!id){
            return layer.msg('没有id',{icon:2});
        }
        prodPackSpecChangeStatus(id,ifVoiceBroadcast).then(function(result){
            layer.msg(result || '修改成功', {icon:1})
            $('#prodPackSpecSearch').trigger('click');
        }).catch(function(err){
            layer.msg(err || err.message, {icon:2});
        })
    });



    $('#prodPackSpecSearch').click(function () {
        let searchData = serializeObject($('#prodPackSpecSearchForm'))
        queryData(searchData)
    });

    form.on('submit(addProdPackSpecInfo)', function (data) {
        let ifUpdateProdSInfo = $('#addProdPackSpecForm [name=ifUpdateProdSInfo]').prop('checked')
        loading.show()
        $.ajax({
            type: "post",
            url: ctx + "/prodPackSpec/addOrUpdProdPackSpec.html",
            dataType: "json",
            data: data.field,
            success: function (returnData) {
                loading.hide()
                if (returnData.code == "0000") {
                    layer.closeAll();
                    refreshTable()

                    if (ifUpdateProdSInfo) {
                        let title = '修改成功，本次修改影响到的商品数量为' + returnData.data
                        if (!returnData.data) {
                            layer.msg(title)
                        } else {
                            let confirmIndex = layer.confirm(title + ';是否更新商品信息?',{btn: ['确认', '取消']},function (){
                                layer.close(confirmIndex)
                                oneAjax.post({
                                    url: '/prodPackSpec/updProdInfoForProdPackEdit',
                                    data: {id: data.field.id},
                                    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                                    success:function (returnData) {
                                        let processData = returnData.data
                                        if (processData.id) {
                                            processBegin(ctx + '/msgProcess/queryProcess', JSON.stringify(processData), '共计需修改' + processData.totalNum + '个商品', 3000, null)
                                        }
                                    }
                                })
                            })
                        }
                    }
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
            url: ctx + "/prodPackSpec/getProdPackSpecs.html",
            data: {"id": id},
            async: false,
            dataType: "json",
            success: function (returnData) {
                $("#addProdPackSpecForm input[name='id']").val(returnData.data[0].id);
                $("#addProdPackSpecForm input[name='code']").val(returnData.data[0].code);
                $("#addProdPackSpecForm input[name='name']").val(returnData.data[0].name);
                $("#addProdPackSpecForm input[name='unitCost']").val(returnData.data[0].unitCost);
                $("#addProdPackSpecForm input[name='weight']").val(returnData.data[0].weight);
                $("#addProdPackSpecForm input[name='note']").val(returnData.data[0].note);
                $("#addProdPackSpecForm input[name='barcode']").val(returnData.data[0].barcode);
                $("#addProdPackSpecForm textarea[name='remark']").val(returnData.data[0].remark);
            },
            error: function () {
                layer.msg("服务器正忙");
            }
        });
    }

    // 新增包装规格
    $("#addProdPackSpec").click(function () {
        var index = layer.open({
            type: 1,
            title: "新增包装规格",
            area: ["800px", "450px"],
            shadeClose: false,
            btn: ['保存','关闭'],
            content: $("#addProdPackSpecLayer").html(),
            yes: function () {
                $("#addProdPackSpecForm #addProdPackSpecInfo").click();
            },
            end: function () {
                $("#addProdPackSpecForm").trigger('reset');
                $("#addProdPackSpecForm input[name='id']").val("");
            }
        });
    });

    //删除包装规格
    function deleteProdPackSpec(id) {
        if (typeof (id) == "undefined") {
            layer.msg('服务器正忙');
            return;
        }
        layer.confirm('是否删除此包装规格？', function (result) {
            if (result) {
                $.ajax({
                    url: ctx + '/prodPackSpec/delProdPackSpec.html',
                    data: {"id": id},
                    dataType: "json",
                    success: function (returnData) {
                        if (returnData.code == "0000") {
                            layer.closeAll();
                            layer.msg('操作成功');
                            refreshTable()
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

    // 修改包装规格
    function updProdPackSpec (id) { //获取选中数据
        layer.open({
            type: 1,
            title: "修改包装规格",
            area: ["800px", "450px"],
            shadeClose: false,
            btn: ['保存','取消'],
            content: $("#addProdPackSpecLayer").html(),
            success: function (layero, index) {
                $('#prodPacKSpec_ifUpdateProdSInfo_Div').show()
                getProdPackSpecInfo(id);
                form.render('select','addProdPackSpecForm');
                form.render('radio','addProdPackSpecForm');
                form.render('checkbox','addProdPackSpecForm');
            },
            yes: function(){
                $("#addProdPackSpecForm #addProdPackSpecInfo").click();
            },
            end: function () {
                $("#addProdPackSpecForm").trigger('reset');
                $("#addProdPackSpecForm input[name='id']").val("");
                $("#addProdPackSpecForm input[name='code']").removeAttr("readonly");
            }
        });
    }

    function setDefault(id){
        oneAjax.post({
            url: '/prodPackSpec/setDefault',
            data: {id: id},
            success:function (res){
                if (res.code === '0000') {
                    layer.msg('操作成功')
                    refreshTable()
                } else {
                    layer.msg(res.msg);
                }
            }
        })
    }
});
