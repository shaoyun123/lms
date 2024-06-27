/**
 * time: 2018/01/02
 */

layui.use(["admin", "form", "table", "layer", "laytpl"], function () {
    var admin = layui.admin,
        form = layui.form,
        table = layui.table,
        layer = layui.layer,
        laytpl = layui.laytpl,
        element = layui.element,
        $ = layui.$;
    form.render('select');
    form.render('radio');
    form.render('checkbox');

    //表格渲染结果
    //展示已知数据
    table.render({
        elem: "#ali1688AcctGrantTable",
        method: "post",
        url: ctx + "/ali1688AcctGrant/queryPage.html",
        cols: [
            [
                //标题栏
                {type: "checkbox"},
                { field: "buyer", title: "采购员", width:150},
                { field: "orgName", title: "部门", width:150},
                { title: "授权账号", templet: "#pemitAcctListLayer"},
                //绑定工具条
                {title: '操作', align: 'center', toolbar: '#ali1688AcctGrantTableBar',width:150}
            ],
        ],
        done: function(res, curr, count){
            $("#ali1688AccountGrantNum").text(res.count);
            // 表头固定
            theadHandle().fixTh({ id:'#ali1688acctgrantCard',h:200 })

        },
        id: 'ali1688AcctGrantTable',
        page: false, //是否显示分页
        limits: [5, 7, 10],
        limit: 5, //每页默认显示的数量
    });

    // 搜索
    var active = {
        reload: function () {
            var data = {
                orgId : $("#ali1688AcctGrantSearchForm [name='orgId']").val(),
                buyerId : $("#ali1688AcctGrantSearchForm [name='buyerId']").val(),
                purAcctId : $("#ali1688AcctGrantSearchForm [name='purAcctId']").val()
            }

            //执行重载
            table.reload('ali1688AcctGrantTable', {
                where: data
            });
        }
    };

    // 初始化部门-采购员选项
    render_hp_orgs_users("#ali1688AcctGrantSearchForm")

    // 搜索按钮事件
    $('#ali1688AcctGrantSearch').click(function () {
        var type = $(this).data('type');
        active[type] ? active[type].call(this) : '';
    });

    //新增授权
    $("#add1688AcctGrantBtn").click(function () {
        var index = layer.open({
            title: "添加授权",
            area: ["1000px", "400px"],
            content: $("#addali1688AcctGrantLayer").html(),
            btn: ['保存', '关闭'],
            success:function(){
                form.render('select','ali1688Authorization_AcctAddForm')
                form.render('checkbox','ali1688Authorization_AcctAddForm')
            },
            yes: function(){
                var Adata = {
                    buyerId: $('#ali1688Authorization_AcctAddForm [name=buyerId]').val(),
                    buyer: $('#ali1688Authorization_AcctAddForm [name=buyerId] option:selected').text().trim(),
                    purAcctId: $('#ali1688Authorization_AcctAddForm [name=purAcctId]').val(),
                    ifDefault: $('#ali1688Authorization_AcctAddForm [name=ifDefault]').prop('checked')
                }
                console.log(Adata)
                var data = {
                    buyerList: [{buyerId: Adata.buyerId, buyer: Adata.buyer}],
                    purAcctId: Adata.purAcctId,
                    ifDefault: Adata.ifDefault
                }
                loading.show()
                $.ajax({
                    url: ctx + '/ali1688AcctGrant/addPemitList.html',
                    type: 'post',
                    contentType: 'application/json;charset=utf-8',
                    data: JSON.stringify(data),
                    dataType: "json",
                    success: function (res) {
                        loading.hide()
                        if (res.code == "0000") {
                            layer.close(index)
                            active.reload()
                            layer.msg('添加成功')
                        } else {
                            layer.msg(res.msg)
                        }
                    },
                    error: function () {
                        loading.hide()
                        layer.msg("服务器正忙");
                    }
                })
            }
        });
    });

    // 批量授权
    $("#addPemitListBtn").click(function () {
        var checkStatus = table.checkStatus('ali1688AcctGrantTable'),
            data = checkStatus.data;
        if (!data || data.length == 0) {
            layer.msg('请选择采购员')
            return
        }
        var buyerList = []
        for (var i =0 ; i < data.length; ++i) {
            buyerList.push({buyerId: data[i].buyerId, buyer: data[i].buyer})
        }
        var index = layer.open({
            type: 1,
            title: "批量添加授权",
            area: ["1000px", "400px"],
            content: $("#addAli1688PemitListLayer").html(),
            btn: ['保存', '关闭'],
            success:function(){
                form.render('select','addAli1688PemitListForm')
                form.render('checkbox','addAli1688PemitListForm')
            },
            yes: function(){
                var Adata = {
                    buyerList: buyerList,
                    purAcctId: $('#addAli1688PemitListForm [name=purAcctId]').val(),
                    ifDefault: $('#addAli1688PemitListForm [name=ifDefault]').prop('checked')
                }

                loading.show()
                $.ajax({
                    url: ctx + '/ali1688AcctGrant/addPemitList.html',
                    type: 'post',
                    contentType: "application/json;charset=utf-8",
                    data: JSON.stringify(Adata),
                    dataType: "json",
                    success: function (res) {
                        loading.hide()
                        if (res.code == '0000') {
                            layer.msg("新增成功")
                            layer.close(index)
                            active.reload()
                        } else {
                            layer.msg(res.msg)
                        }
                    },
                    complete: function (XMLHttpRequest, status) {
                        loading.hide()
                        if (status == 'timeout') {//超时,status还有success,error等值的情况
                            layer.msg('正在向1688发起请求中，请稍后刷新查看')
                        }
                    }
                })
            }
        })
    })

    // 批量删除授权
    $("#delPemitListBtn").click(function () {
        var checkStatus = table.checkStatus('ali1688AcctGrantTable'),
            data = checkStatus.data;
        if (!data || data.length == 0) {
            layer.msg('请选择采购员')
            return
        }
        var buyerIdList = []
        for (var i =0 ; i < data.length; ++i) {
            buyerIdList.push(data[i].buyerId)
        }
        var index = layer.confirm('确认删除这些采购员的账号授权吗?',function () {
            loading.show()
            $.ajax({
                url: ctx + '/ali1688AcctGrant/delPemitList.html',
                type: 'post',
                contentType: "application/json;charset=utf-8",
                data: JSON.stringify({buyerIdList: buyerIdList}),
                dataType: "json",
                success: function (res) {
                    loading.hide()
                    if (res.code == '0000') {
                        layer.msg("删除成功")
                        active.reload()
                    } else {
                        layer.msg(res.msg)
                    }
                },
                complete: function (XMLHttpRequest, status) {
                    loading.hide()
                    if (status == 'timeout') {//超时,status还有success,error等值的情况
                        layer.msg('正在向1688发起请求中，请稍后刷新查看')
                    }
                }
            })
        },function () {
            layer.close(index)
        })
    })

    //工具条的监听事件,table.on(tool(表格的lay-filter的值))
    table.on('tool(ali1688AcctGrantTable)', function (obj) {
        var data = obj.data, //获得当前行数据
            layEvent = obj.event; //获得 lay-event 对应的值
        ifFresh_detailList_ali1688acctgrant = false
        acctList_ali1688acctgrant = data.purBuyerAccts
        if (layEvent === 'edit') {
            var index = layer.open({
                type: 1,
                title: "授权编辑",
                area: ["1000px", "480px"],
                shadeClose: false,
                content: $("#purBuyerAcctTabLayer").html(),
                btn: ['关闭'],
                success: function (layero, index) {
                     // 复现数据
                    showPurAcct_purBuyerAcct(acctList_ali1688acctgrant)
                },
                end: function() {
                    if (ifFresh_detailList_ali1688acctgrant) {
                        active.reload()
                    }
                },
                cancel: function() {
                    if (ifFresh_detailList_ali1688acctgrant) {
                        active.reload()
                    }
                },
            });
        }
    });

    function showPurAcct_purBuyerAcct(data) {
        table.render({
            elem: "#purBuyerAcctTab",
            data: data,
            cols: [
                [
                    //标题栏
                    {type: "checkbox"},
                    { field: "acct", title: "授权账号"},
                    { title: "默认", templet: "#ifDefaultBox_purBuyerAcctTab"},
                    // { field: 'addressId', title: "默认地址"},
                    { field: 'fullName', title: "默认地址"},
                    //绑定工具条
                    {title: '操作', align: 'center', toolbar: '#purBuyerAcctTableBar',width:200}
                ],
            ],
            id: 'purBuyerAcctTab',
            page: false, //是否显示分页
            limit: data.length, //每页默认显示的数量
        });
    }

    // 展现该账号的所有收货地址
    function selectAddressTable_ali1688acctgrant(acctId) {
        table.render({
            elem: "#addressTable_ali1688acctgrant",
            method: "post",
            url: ctx + "/ali1688Acct/getAddressList.html",
            where: {acctId: acctId},
            cols: [
                [
                    //标题栏
                    {type: "checkbox"},
                    {field: "addressId", title: "阿里地址id"},
                    {field: "fullName", title: "收货人姓名"},
                    {title: "地址", templet : '<div>{{(d.addressCodeText||"") + (d.townName|| "") + (d.address||"")}}</div>'},
                    {title: "同步时间", templet: '<div>{{format(d.syncDate,"yyyy-MM-dd hh:mm:ss")}}</div>'},
                    // {title: "是否默认", templet: '#ifDefault_address_ali1688acctgrant'},
                    {title: '操作', align: 'center', toolbar: '#addressTabBar_ali1688acctgrant'}
                ],
            ],
            done: function(res, curr, count){
                $("#addressNumber_ali1688acctgrant").text(res.count);
            },
            id: 'addressTable_ali1688acctgrant',
            page: false, //是否显示分页
            limits: [5, 7, 10],
            limit: 5, //每页默认显示的数量
        });
    }
    // 设置权限默认地址
    table.on('tool(addressTable_ali1688acctgrant)', function (obj) {
        var data = obj.data, //获得当前行数据
            layEvent = obj.event; //获得 lay-event 对应的值
        var Adata = {
            id: parseInt($('#grantId_ali1688acctgrant').val()),
            addressId: data.addressId
        }
        if (layEvent === 'setDefault') {
            var cIndex = layer.confirm('是否设置此地址为默认地址', { btn: ['确认', '取消'] },
                function () {
                    loading.show()
                    $.ajax({
                        url: ctx + '/ali1688AcctGrant/setDefaultAddress.html',
                        type: 'post',
                        contentType: "application/json;charset=utf-8",
                        data: JSON.stringify(Adata),
                        dataType: 'json',
                        success: function (res) {
                            loading.hide()
                            if (res.code == '0000') {
                                layer.msg("设置成功")
                                layer.closeAll()
                                active.reload()
                            } else {
                                layer.msg(res.msg)
                            }
                        },
                        complete: function () {
                            loading.hide()
                        }
                    })
                },
                function () {
                    layer.close(cIndex)
                })
        }
    })

    table.on('tool(purBuyerAcctTab)', function (obj) {
        var data = obj.data, //获得当前行数据
            layEvent = obj.event; //获得 lay-event 对应的值
        var index = obj.tr.attr('data-index')  // 当前数据的序列号

        if (layEvent === 'setDefault') {
            var Adata = {
                id : data.id
            }
            loading.show()
            $.ajax({
                url: ctx + '/ali1688AcctGrant/toSetDefaultAcct.html',
                type: 'post',
                contentType: "application/json;charset=utf-8",
                data: JSON.stringify(Adata),
                dataType: "json",
                success: function (res) {
                    loading.hide()
                    if (res.code == '0000') {
                        ifFresh_detailList_ali1688acctgrant = true
                        layer.msg('设置成功')
                        // 刷新数据
                        for (var i = 0; i < acctList_ali1688acctgrant.length; ++i) {
                            acctList_ali1688acctgrant[i].ifDefault = false
                        }
                        data.ifDefault = true
                        acctList_ali1688acctgrant[index] = data
                        showPurAcct_purBuyerAcct(acctList_ali1688acctgrant)
                    }else {
                        layer.msg(res.msg)
                    }
                },
                complete: function () {
                    loading.hide()
                }
            })

        } else if (layEvent === 'defaultAddress') {
            var popAddressTableIndex = layer.open({
                type: 1,
                title: "收货地址",
                area: ["1000px", "650px"],
                shadeClose: false,
                content: $("#addressTablePop_ali1688acctgrant").html(),
                btn: ['关闭'],
                success:function(){
                    selectAddressTable_ali1688acctgrant(data.purAcctId)
                    $('#grantId_ali1688acctgrant').val(data.id)
                }
            })
        }
        else if (layEvent === 'delete') {
            var Adata = {
                idList : [data.id]
            }
            loading.show()
            $.ajax({
                url: ctx + '/ali1688AcctGrant/delPemitList.html',
                type: 'post',
                contentType: "application/json;charset=utf-8",
                data: JSON.stringify(Adata),
                dataType: "json",
                success: function (res) {
                    loading.hide()
                    if (res.code == '0000') {
                        ifFresh_detailList_ali1688acctgrant = true
                        layer.msg('删除成功')
                        // 刷新数据
                        acctList_ali1688acctgrant.splice(index,1)
                        showPurAcct_purBuyerAcct(acctList_ali1688acctgrant)
                    }else {
                        layer.msg(res.msg)
                    }
                },
                complete: function () {
                    loading.hide()
                }
            })
        }
    })
});
