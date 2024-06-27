/**
 * time: 2018/01/02
 */
var receive_acct_acctTypeMap = {}
layui.use(["admin", "form", "table", "layer", "laytpl", "laydate", "element", 'formSelects'], function() {
    var admin = layui.admin,
        form = layui.form,
        table = layui.table,
        layer = layui.layer,
        laytpl = layui.laytpl,
        laydate = layui.laydate,
        formSelects = layui.formSelects,
        element = layui.element,
        $ = layui.$;
    form.render('select');
    form.render('radio');
    form.render('checkbox');
    var payPlatCode = [];
    var acctTypes = [];
    // 重置按钮
    $("#resetBtn_receiveAcct").click(function() {
            $('#searchForm_receiveAcct').find('[name]:not(.hiddenContent)').val('')
            form.render('select','searchForm_receiveAcct')
        })
        /**
         * 手机号 身份证号 营业执证号的一个简单正则
         * @type {RegExp}
         */
    var checkpatt = /^(\w|-){5,20}$/;

    // 初始化查询参数
    function init_searchParam() {
        oneAjax.post({
            url: '/msgReceiveAcct/getSearchEnum.html',
            success: function (res) {
                payPlatCode = res.data.payPlatCodes;
                acctTypes = res.data.acctTypes;
                receive_acct_acctTypeMap = {}
                for (let i =0; i < acctTypes.length; ++i) {
                    receive_acct_acctTypeMap[acctTypes[i].code] = acctTypes[i].name
                }
                appendSelect('searchForm_receiveAcct', 'ra_searchAcctType', acctTypes, "code", "name");
                form.render('select','searchForm_receiveAcct');
            }
        })
    }
    // 初始化查询参数
    init_searchParam()

    function queryPage_receiveAcct(obj) {
        var data = {
            orderBy: 'id desc',
        }
        if (obj) {
            $.extend(data, obj);
        }
        table.render({
            elem: "#receiveAcctTab",
            method: "post",
            url: ctx + "/msgReceiveAcct/queryPage.html",
            where: data,
            cols: [
                [
                    //标题栏
                    { field: "acctTypeName", title: "账户类型",templet: '<div>{{receive_acct_acctTypeMap[d.acctType] || ""}}</div>' },
                    { field: "acctName", title: "收款账户名" },
                    { field: "simpleName", title: "简称" },
                    { field: "acct", title: "收款账户号" },
                    { field: "subBranch", title: "支行" },
                    { field: "telphone", title: "手机号" },
                    { field: "idCard", title: "身份证" },
                    { field: "businessLicenseNo", title: "营业执照号" },
                    { field: "payPlatCode", title: "支付平台" },
                    { field: "remark", title: "备注" },
                    { field: "creator", title: "创建者" },
                    //绑定工具条
                    { title: '操作', width: 300, align: 'center', toolbar: '#receiveAcct_bar', width: 120 }
                ],
            ],
            id: 'receiveAcctTab',
            page: true,
            limits: [100, 500, 1000],
            limit: 100,
            done: function(res, curr, count) {
                console.log(receive_acct_acctTypeMap)
            }
        });
    }

    // 表格数据重载
    var active_receiveAcct = {
            reload: function(data) {
                //执行重载
                table.reload('receiveAcctReloadTable', {
                    page: {
                        curr: 1 //重新从第 1 页开始
                    },
                    where: data
                });
            }
        }
        //展示已知数据
    // search_receiveAcct()

    //初始化2个日期框
    laydate.render({
        elem: '#beginDate_receiveAcct',
        type: 'datetime'
    });
    laydate.render({
        elem: '#endDate_receiveAcct',
        type: 'datetime'
    });

    // 搜索按钮
    $('#searchBtn_receiveAcct').click(function() {
        search_receiveAcct(true)
    })

    function search_receiveAcct(ifReload) {
        let data = serializeObject($('#searchForm_receiveAcct'))
        queryPage_receiveAcct(data)
    }
    //导出收款账号
    $('#mr_receiveAcctExport').click(function() {
        let data = serializeObject($('#searchForm_receiveAcct'))
        submitForm(data, ctx + '/msgReceiveAcct/export.html')
    })

    // 新建收款账号
    $('#add_receiveAcct').click(function() {
        var index = layer.open({
            type: 1,
            title: "新建收款账号",
            area: ["35%", "55%"],
            shadeClose: false,
            content: $("#add_pop_receiveAcct").html(),
            btn: ['创建', '关闭'],
            success: function(layero, index) {
                initNotNull()
                formSelects.data('receiveAcct_pay_platCode_sel', 'local', { arr: payPlatCode });

                appendSelect('addForm_receiveAcct', 'ra_acctType', acctTypes, "value", "name");
                //初始化页面选项
                //开户行
                initAjax('/msgReceiveAcct/listbank.html', 'POST', {}, function(returnData) {
                        appendSelect('addForm_receiveAcct', 'ra_bank_name', returnData.data)
                        form.render()
                    }, 'application/x-www-form-urlencoded')
                    //省份
                initAjax('/address/listbylevel.html?level=2', 'POST', {}, function(returnData) {
                    appendSelect('addForm_receiveAcct', 'ra_bank_province', returnData.data, "id", "cityName")
                    form.render()
                }, 'application/x-www-form-urlencoded')
            },
            yes: function() {
                var Adata = {
                    acctName: $("#addForm_receiveAcct [name=acctName]").val().trim(),
                    acct: $("#addForm_receiveAcct [name=acct]").val().trim(),
                    simpleName: $("#addForm_receiveAcct [name=simpleName]").val().trim(),
                    remark: $("#addForm_receiveAcct [name=remark]").val().trim(),
                    subBranch: $("#addForm_receiveAcct [name=subBranch]").val().trim(),
                    telphone: $("#addForm_receiveAcct [name=telphone]").val().trim(),
                    idCard: $("#addForm_receiveAcct [name=idCard]").val().trim(),
                    businessLicenseNo: $("#addForm_receiveAcct [name=businessLicenseNo]").val().trim(),
                    payPlatCode: formSelects.value("receiveAcct_pay_platCode_sel", 'val').join(","),
                    acctType: $("#addForm_receiveAcct [name=acctType]").val().trim(),
                    bankName: $("#addForm_receiveAcct [name=bankName]").val().trim(),
                    bankProvince: $("#addForm_receiveAcct select[name=bankProvince] option:selected").text().trim(),
                    bankCity: $("#addForm_receiveAcct select[name=bankCity] option:selected").text().trim(),
                }
                if (!checkNotNull('#addForm_receiveAcct', layer)) {
                    return
                }
                /***
                 * 简单正则校验 字母+数字 或则- 组合
                 * @type {RegExp}
                 */
                if (Adata.telphone != null && Adata.telphone != '') {
                    if (!checkpatt.test(Adata.telphone)) {
                        layer.msg("手机号不合法", { icon: 2 });
                        return;
                    }
                }
                if (Adata.idCard != null && Adata.idCard != '') {
                    if (!checkpatt.test(Adata.idCard)) {
                        layer.msg("身份证号不合法", { icon: 2 });
                        return;
                    }
                }
                if (Adata.businessLicenseNo != null && Adata.businessLicenseNo != '') {
                    if (!checkpatt.test(Adata.businessLicenseNo)) {
                        layer.msg("营业执证号不合法", { icon: 2 });
                        return;
                    }
                }
                var ajax = new Ajax(true)
                loading.show()
                ajax.post({
                    url: ctx + "/msgReceiveAcct/addOne.html",
                    data: JSON.stringify(Adata),
                    contentType: 'application/json',
                    success: function(data) {
                        loading.hide()
                        if (data.code == '0000') {
                            layer.msg('操作成功')
                            search_receiveAcct(true)
                            layer.closeAll();
                        }
                    }
                })
            }
        });
    })


    //工具条的监听事件,table.on(tool(表格的lay-filter的值))
    table.on('tool(receiveAcctTab)', function(obj) {
        var data = obj.data, //获得当前行数据
            layEvent = obj.event; //获得 lay-event 对应的值
        if (layEvent == 'update') {
            layer.open({
                type: 1,
                title: "修改收款账号",
                area: ["35%", "55%"],
                shadeClose: false,
                content: $("#add_pop_receiveAcct").html(),
                btn: ['保存', '关闭'],
                success: function(layero, index) {
                    initNotNull()
                        //初始化页面选项
                        //开户行
                    initAjax('/msgReceiveAcct/listbank.html', 'POST', {}, function(returnData) {
                            appendSelect('addForm_receiveAcct', 'ra_bank_name', returnData.data)
                            $('#addForm_receiveAcct [name=bankName]').val(data.bankName)
                            form.render()
                        }, 'application/x-www-form-urlencoded')
                        //省份
                    initAjax('/address/listbylevel.html?level=2', 'POST', {}, function(returnData) {
                        appendSelect('addForm_receiveAcct', 'ra_bank_province', returnData.data, "id", "cityName")
                            //手动触发省份监听
                        if (data.bankProvince) {
                            //省份选中
                            $("#ra_bank_province option:contains('" + data.bankProvince + "')").attr("selected", "selected");
                            var value = $("#ra_bank_province").val();
                            initAjax('/address/listbyparent.html', 'POST', { pId: value }, function(returnData) {
                                appendSelect('addForm_receiveAcct', 'ra_bank_city', returnData.data, "id", "cityName")
                                    //城市选中
                                if (data.bankCity) {
                                    $("#ra_bank_city option:contains('" + data.bankCity + "')").attr("selected", "selected");
                                }
                                form.render()
                            }, 'application/x-www-form-urlencoded')
                        }
                        form.render()
                    }, 'application/x-www-form-urlencoded')

                    $('#addForm_receiveAcct [name=acctName]').val(data.acctName)
                    $('#addForm_receiveAcct [name=acct]').val(data.acct)
                    $('#addForm_receiveAcct [name=simpleName]').val(data.simpleName)
                    $('#addForm_receiveAcct [name=subBranch]').val(data.subBranch)
                    $('#addForm_receiveAcct [name=remark]').val(data.remark)
                    $('#addForm_receiveAcct [name=telphone]').val(data.telphone)
                    $('#addForm_receiveAcct [name=idCard]').val(data.idCard)
                    $('#addForm_receiveAcct [name=businessLicenseNo]').val(data.businessLicenseNo)


                    formSelects.data('receiveAcct_pay_platCode_sel', 'local', { arr: payPlatCode });
                    if (data.payPlatCode != null && data.payPlatCode != '') {
                        var sCodeArray = data.payPlatCode.split(",");
                        formSelects.value('receiveAcct_pay_platCode_sel', sCodeArray);
                    }
                    appendSelect('addForm_receiveAcct', 'ra_acctType', acctTypes, "value", "name");
                    $('#addForm_receiveAcct [name=acctType]').val(data.acctType)


                },
                yes: function() {
                    var Adata = {
                        id: data.id,
                        acctName: $("#addForm_receiveAcct [name=acctName]").val().trim(),
                        acct: $("#addForm_receiveAcct [name=acct]").val().trim(),
                        simpleName: $("#addForm_receiveAcct [name=simpleName]").val().trim(),
                        remark: $("#addForm_receiveAcct [name=remark]").val().trim(),
                        subBranch: $("#addForm_receiveAcct [name=subBranch]").val().trim(),
                        telphone: $("#addForm_receiveAcct [name=telphone]").val().trim(),
                        idCard: $("#addForm_receiveAcct [name=idCard]").val().trim(),
                        businessLicenseNo: $("#addForm_receiveAcct [name=businessLicenseNo]").val().trim(),
                        payPlatCode: formSelects.value("receiveAcct_pay_platCode_sel", 'val').join(","),
                        acctType: $("#addForm_receiveAcct [name=acctType]").val().trim(),
                        bankName: $("#addForm_receiveAcct [name=bankName]").val().trim(),
                        bankProvince: $("#addForm_receiveAcct select[name=bankProvince] option:selected").text().trim(),
                        bankCity: $("#addForm_receiveAcct select[name=bankCity] option:selected").text().trim(),
                    }
                    if (!checkNotNull('#addForm_receiveAcct', layer)) {
                        return
                    }
                    if (Adata.telphone != null && Adata.telphone != '') {
                        if (!checkpatt.test(Adata.telphone)) {
                            layer.msg("手机号不合法", { icon: 2 });
                            return;
                        }
                    }
                    if (Adata.idCard != null && Adata.idCard != '') {
                        if (!checkpatt.test(Adata.idCard)) {
                            layer.msg("身份证号不合法", { icon: 2 });
                            return;
                        }
                    }
                    if (Adata.businessLicenseNo != null && Adata.businessLicenseNo != '') {
                        if (!checkpatt.test(Adata.businessLicenseNo)) {
                            layer.msg("营业执证号不合法", { icon: 2 });
                            return;
                        }
                    }
                    var ajax = new Ajax(true)
                    loading.show()
                    ajax.post({
                        url: ctx + "/msgReceiveAcct/update.html",
                        data: JSON.stringify(Adata),
                        contentType: 'application/json',
                        success: function(data) {
                            loading.hide()
                            if (data.code == '0000') {
                                layer.msg('操作成功')
                                search_receiveAcct(true)
                                layer.closeAll();
                            }
                        }
                    })
                }
            });
        } else if (layEvent == 'change1' || layEvent == 'change0') {
            let confirmTitle = layEvent == 'charge1' ? '确定启用收款账户吗' : '确定停用收款账户吗'
            layer.confirm(confirmTitle, { icon: 3, title: '提示' }, function(index) {
                var Adata = {
                    id: data.id,
                    status: layEvent == 'change1' ? 1 : 0
                }
                var ajax = new Ajax(true)
                loading.show()
                ajax.post({
                    url: ctx + "/msgReceiveAcct/changeStatus.html",
                    data: JSON.stringify(Adata),
                    contentType: 'application/json',
                    success: function(data) {
                        loading.hide()
                        if (data.code == '0000') {
                            search_receiveAcct(true)
                        }
                    }
                })
            });

        } else if (layEvent == 'updateCheckStatus') {
            var index = layer.open({
                type: 1,
                title: "修改验证状态",
                area: ["800", "200"],
                shadeClose: false,
                content: $("#ra_checkStatusTpl").html(),
                btn: ['确认', '关闭'],
                success: function(layero, index) {
                    var inputStr = "";
                    let i = 0;
                    $("#ra_checkStatus option").each(function() {
                        if (i++ > 0) {
                            inputStr += '<input type="radio" name="checkStatus" value="' + $(this).val() + '" title="' + $(this).text() + '" >';
                        }
                    });
                    $("#ra_checkStatusForm .layui-input-block").html(inputStr);
                    //选中
                    $("#ra_checkStatusForm input[name=checkStatus][value=" + data.checkStatus + "]").attr("checked", true);
                    layui.form.render();
                },
                yes: function(index, layero) {
                    //获取选中状态
                    if ($("#ra_checkStatusForm input[name=checkStatus]:checked").length < 1) {
                        layer.alert("未选择", { icon: 0 });
                        return;
                    }
                    var checkStatus = $("#ra_checkStatusForm input[name=checkStatus]:checked").val();
                    var Adata = {
                        id: data.id,
                        checkStatus: checkStatus
                    }
                    var ajax = new Ajax(true)
                    loading.show()
                    ajax.post({
                        url: ctx + "/msgReceiveAcct/changeStatus.html",
                        data: JSON.stringify(Adata),
                        contentType: 'application/json',
                        success: function(data) {
                            loading.hide()
                            if (data.code == '0000') {
                                search_receiveAcct(true)
                                layer.close(index);
                            }
                        }
                    })
                }
            });



            //del
            // let confirmTitle = layEvent=='checked' ? '确定验证收款账户吗' : '确定取消验证收款账户吗'
            // layer.confirm(confirmTitle, {icon: 3, title:'提示'},function(index){
            //     var Adata = {
            //         id: data.id,
            //         isChecked: layEvent == 'checked' ? 1 : 0
            //     }
            //     var ajax = new Ajax(true)
            //     loading.show()
            //     ajax.post({
            //         url: ctx + "/msgReceiveAcct/changeStatus.html",
            //         data: JSON.stringify(Adata),
            //         contentType: 'application/json',
            //         success: function (data) {
            //             loading.hide()
            //             if (data.code == '0000') {
            //                 search_receiveAcct(true)
            //             }
            //         }
            //     })
            // });
        }
    });
    //监听
    form.on('select(ra_bank_province)', function(data) {
        var value = data.value;
        if (value != null && value != '') {
            initAjax('/address/listbyparent.html', 'POST', { pId: value }, function(returnData) {
                appendSelect('addForm_receiveAcct', 'ra_bank_city', returnData.data, "id", "cityName")
                form.render()
            }, 'application/x-www-form-urlencoded')
        }
    });
    //初始化
    initAjax('/msgReceiveAcct/listenum.html', 'POST', {}, function(returnData) {
        var checkStatus = returnData.data.checkStatus;
        // debugger;
        appendSelect('searchForm_receiveAcct', 'ra_checkStatus', checkStatus, "value", "name")
        form.render()
    }, 'application/x-www-form-urlencoded')

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
                    func(returnData)
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

    function appendSelect(pre, dom, data, code, label, attachment) {
        $('#' + pre + ' #' + dom).empty();
        var option = '<option value="">请选择</option>'
        for (var i in data) {
            if (typeof data[i] !== 'string') {
                attachment ?
                    data[i].code = data[i][code] + '_' + data[i][attachment] :
                    data[i].code = data[i][code] || data[i].code
                data[i].label = data[i][label] || data[i].label;
                // if(data[i].code==0){
                //     data[i].code = '0';
                // }
            }
            option += '<option value="' + ((data[i].code) || data[i]) + '">' + (data[i].label || data[i]) + '</option>'
        }
        $('#' + pre + ' #' + dom).append(option)
    }
});