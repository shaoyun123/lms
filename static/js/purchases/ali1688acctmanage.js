/**
 * time: 2018/01/02
 */

layui.use(["admin", "form", "table", "layer", "laytpl"], function () {
    let
        form = layui.form,
        table = layui.table,
        layer = layui.layer,
        $ = layui.$;
    form.render('select');
    form.render('radio');
    form.render('checkbox');



    //表格渲染结果
    //展示已知数据
    table.render({
        elem: "#ali1688AcctTable",
        method: "post",
        url: ctx + "/ali1688Acct/queryPage.html",
        cols: [
            [
                //标题栏
                {type: "checkbox"},
                {field: "acctType", title: "类型", templet: '#ali1688AcctTypeTpl'},
                {field: "acctName", title: "昵称"},
                {field: "acct", title: "登录账号"},
                {field: "remark", title: "备注"},
                { title: "refresh_token到期时间", templet: '<div>{{format(d.refreshTokenTimeout,"yyyy-MM-dd hh:mm:ss")}}</div>'},
                {field: "status", title: "状态", templet: '#ali1688AcctStatusTpl'},
                //绑定工具条
                {title: '操作', align: 'center', toolbar: '#ali1688TableBar'}
            ],
        ],
        done: function(res, curr, count){
            $("#ali1688Account_colLen").text(res.count);
            // 表头固定
            theadHandle().fixTh({ id:'#ali1688acctmanageCard',h:200 })
        },
        id: 'ali1688AcctTable',
        page: false, //是否显示分页
        limits: [5, 7, 10],
        limit: 5, //每页默认显示的数量
    });

    // 搜索
    let active = {
        reload: function () {
            let searchForm = $("#ali1688AcctSearchForm");
            let data = {
                status : searchForm.find("[name='status']").val(),
                acctName : searchForm.find("[name='acctName']").val().trim(),
                acct : searchForm.find("[name='acct']").val().trim()
            };

            //执行重载
            table.reload('ali1688AcctTable', {
                where: data
            });
        }
    };

    $('#ali1688Search').click(function () {
        let type = $(this).data('type');
        active[type] ? active[type].call(this) : '';
    });

    //新增账号
    $("#add1688AcctBtn").click(function () {
        let index = layer.open({
            type: 1,
            title: "添加ali采购账号",
            area: ["1000px", "450px"],
            shadeClose: false,
            content: $("#ali1688Account_addInfoLayer").html(),
            btn: ['保存', '关闭'],
            success:function(){
                getAcctTypeList()
                form.render('checkbox','ali1688AcctAddForm');
                form.render('select','ali1688AcctAddForm');
                form.on('checkbox(ifSubAcct_ali1688AcctAddForm)', function(data){
                   if (data.elem.checked) {
                       $('#mainAcctIdBox_ali1688AcctAddForm').show()
                   } else {
                       $('#mainAcctIdBox_ali1688AcctAddForm').hide()
                   }
                });
                initNotNull('#ali1688AcctAddForm')
            },
            yes: function(){
                if (!checkNotNull('#ali1688AcctAddForm')) {
                    return
                }
                let Adata = serializeObject($('#ali1688AcctAddForm'));
                $.ajax({
                    url: ctx + '/ali1688Acct/addAcct.html',
                    type: 'post',
                    data: Adata,
                    dataType: "json",
                    success: function (returnData) {
                        if (returnData.code === "0000") {
                            layer.close(index);
                            active.reload();
                            layer.msg('添加成功')
                        } else {
                            layer.msg(returnData.msg)
                        }
                    },
                    error: function () {
                        layer.msg("服务器正忙");
                    }
                })
            }
        });
    });

    $("#syncReceiveAddressBtn").click(function () {
        let checkStatus = table.checkStatus('ali1688AcctTable'),
            data = checkStatus.data;
        if (!data || data.length == 0) {
            layer.msg('请选择账号')
            return
        }
        let idList = []
        for (let i =0 ; i < data.length; ++i) {
            idList.push(data[i].id)
        }
        loading.show()
        $.ajax({
            url: ctx + '/ali1688Acct/toSyncAddress.html',
            type: 'post',
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify({idList: idList}),
            dataType: "json",
            success: function (res) {
                if (res.code == '0000') {
                    layer.msg("同步成功")
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
    })

    //工具条的监听事件,table.on(tool(表格的lay-filter的值))
    table.on('tool(ali1688AcctTable)', function (obj) {
        let data = obj.data, //获得当前行数据
            layEvent = obj.event; //获得 lay-event 对应的值
        let index;
        switch (layEvent) {
            case "edit":
                index = layer.open({
                    type: 1,
                    title: "编辑账号",
                    area: ["1000px", "480px"],
                    shadeClose: false,
                    content: $("#ali1688Account_addInfoLayer").html(),
                    btn: ['保存', '关闭'],
                    success: function (layero, index) {
                        getAcctTypeList(data.acctType)
                        let addForm = $('#ali1688AcctAddForm');
                        // 复现数据
                        addForm.find('[name=acctName]').val(data.acctName);
                        addForm.find('[name=acctType]').val(data.acctType);
                        
                        addForm.find('[name=remark]').val(data.remark);
                        addForm.find('[name=acct]').val(data.acct)
                        layui.form.render()
                    },
                    yes: function(){
                        let addForm = $('#ali1688AcctAddForm');
                        let Adata = {
                            id: data.id,
                            acctName: addForm.find('[name=acctName]').val(),
                            acctType: addForm.find('[name=acctType]').val(),
                            remark: addForm.find('[name=remark]').val()
                        };
                        $.ajax({
                            url: ctx + '/ali1688Acct/updateAcct.html',
                            type: 'post',
                            data: Adata,
                            dataType: "json",
                            success: function (returnData) {
                                if (returnData.code === "0000") {
                                    layer.close(index);
                                    active.reload();
                                    layer.msg('编辑成功')
                                } else {
                                    layer.msg(returnData.msg)
                                }
                            },
                            error: function () {
                                layer.msg("服务器正忙");
                            },
                            complete: function () {
                                loading.hide()
                            }
                        })
                    }
                });
                break;
            case "generateAccessToken" :
                index = layer.open({
                    type: 1,
                    title: "授权",
                    area: ["800px", "300px"],
                    shadeClose: false,
                    content: $("#ali1688TokenModalLayer").html(),
                    btn: ['关闭'],
                    // btn: ['保存','关闭'],
                    success:function(){
                        // 获取授权网址
                        loading.show();
                        $.ajax({
                            url: ctx + '/ali1688Acct/getAuthCodeUrl.html',
                            type: 'post',
                            dataType: 'json',
                            data: {id: data.id},
                            success: function (res) {
                                if (res.code === "0000") {
                                    let url = res.data + "&state=" + data.id;
                                    let tokenForm = $('#ali1688TokenAddForm');
                                    tokenForm.find('#code1688Url').text(url);
                                    tokenForm.find('#code1688Url').attr('href',url)
                                } else {
                                    layer.msg(res.msg)
                                }
                            },
                            error: function () {
                                layer.msg("服务器正忙");
                            },
                            complete: function () {
                                loading.hide()
                            }
                        })
                    }
                });
                break;
            case "address" :
                let popAddressTableIndex = layer.open({
                    type: 1,
                    title: "收货地址",
                    area: ["1000px", "650px"],
                    shadeClose: false,
                    content: $("#addressTablePop_ali1688acctmanage").html(),
                    btn: ['关闭'],
                    success:function(){
                        selectAddressTable(data.id)
                    }
                })
                break
            case "disable":
                changeStatus(data,false)
                break;
            case "enable":
                changeStatus(data,true)
                break;
            default:
        }
    });

    function getAcctTypeList(type) {
        $.ajax({
            url: ctx + '/ali1688Acct/queryAcctTypeEnums',
            type: 'post',
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
            dataType: 'json',
            success: function (res) {
                loading.hide()
                if (res.code == '0000') {
                    let list = res.data || []
                    list = list.filter(item => item.code != 2)
                    appendSelect($('#ali1688AcctAddForm').find('select[name="acctType"]'), list, 'code', 'name')
                    
                    if (type) {
                        $('#acctType').val(type)
                    }
                    layui.form.render('select')
                }
            }
        })

    }

    function changeStatus(data,status) {
        let confirmIndex = layer.confirm('确认' + (status ? '启用': '停用') + '账号' + data.acct + '吗？',{btn: ['确认','取消']},function () {
            layer.close(confirmIndex)
            let ajax = new Ajax(true)
            let Adata = {
                id: data.id,
                status: status
            }
            ajax.post({
                url: ctx + '/ali1688Acct/updateAcct.html',
                data: Adata,
                contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                success: function (res) {
                    if (res.code === '0000') {
                        active.reload();
                    }
                }
            })
        })
    }

    function selectAddressTable(acctId) {
        table.render({
            elem: "#addressTable_ali1688acctmanage",
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
                    {title: "是否默认", templet: '#ifDefault_address_ali1688acctmanage'},
                    //绑定工具条
                    {title: '操作', align: 'center', toolbar: '#addressTabBar'}
                ],
            ],
            done: function(res, curr, count){
                $("#addressNumber").text(res.count);
            },
            id: 'addressTable_ali1688acctmanage',
            page: false, //是否显示分页
            limits: [5, 7, 10],
            limit: 5, //每页默认显示的数量
        });
    }

    table.on('tool(addressTable_ali1688acctmanage)', function (obj) {
        let data = obj.data, //获得当前行数据
            layEvent = obj.event; //获得 lay-event 对应的值
        let Adata = {
            id: data.id,
            acctId: data.acctId
        }
        if (layEvent === 'setDefault') {
            let cIndex = layer.confirm('是否设置此地址为默认地址', { btn: ['确认', '取消'] },
                function () {
                    loading.show()
                    $.ajax({
                        url: ctx + '/ali1688Acct/setDefaultAddress.html',
                        type: 'post',
                        contentType: "application/json;charset=utf-8",
                        data: JSON.stringify(Adata),
                        dataType: 'json',
                        success: function (res) {
                            loading.hide()
                            if (res.code == '0000') {
                                layer.msg("设置成功")
                                selectAddressTable(data.acctId)
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
});
