layui.use(['admin', 'form', 'table', 'laydate', 'laytpl','element','upload','formSelects'], function() {
    var $ = layui.$,
        admin = layui.admin,
        element = layui.element,
        layer = layui.layer,
        laydate = layui.laydate,
        table = layui.table,
        form = layui.form,
        upload = layui.upload,
        laytpl = layui.laytpl,
        formSelects = layui.formSelects;

        form.render();
    form.render(null, 'component-form-element');
    form.render(null, 'component-form-group');
    // dexcept_initStroreAcct("wish");//初始化店铺选择框
    let OperatorObj ={}

    //渲染平台-ztt20230718
    commonReturnPromise({
      url: '/lms/unauditorder/listenum.html',
      type: 'post'
    }).then(res => {
      let {platCodes } = res;
      commonRenderSelect('publish_dexcept_platList_sel', platCodes).then(()=> {
        form.render('select');
      })
    });
    function getOperatorObj(){
        commonReturnPromise({
            url: '/lms/deliveryIssue/initQueryPage',
        }).then(res=>{
            OperatorObj = res
            // 获取操作人类型
            const operatorType = $('#dexcept_searchForm').find('select[name=operatorType]').val()
            commonRenderSelect('de_search_form_operator', OperatorObj[operatorType+'s']).then(()=> {
                form.render('select');
            })
        })
    }
    getOperatorObj()
    laydate.render({
        elem: '#search_time'
        ,range: true
        ,type: 'datetime'
    });
    form.on('select(de_search_form_operatorType_filter)',function(obj){
        commonRenderSelect('de_search_form_operator', OperatorObj[obj.value+'s']).then(()=> {
            form.render('select');
        })
    })
    form.verify({

    });
    //监听tab切换来选中不同的tab页
    element.on('tab(deliveryexception_mark_div)', function (data) {
        if (data.index === 0) {
            //修改数据状态
            $("#deliveryexception_hidden_mark").val(0);
            $("#de_search_form").trigger('click');
        } else if (data.index === 1) {
            //修改数据状态
            $("#deliveryexception_hidden_mark").val(1);
            $("#de_search_form").trigger('click');
        }
    });
    //展示已知数据
    table.render({
        elem: "#deliveryexception_table",
        method:"POST",
        url: ctx + "/deliveryIssue/pageQuery.html",
        where: serializeObject($('#dexcept_searchForm'),formSelects,'dexcept_searchForm'),
        page: true,
        even: true,
        unFixedTableHead: true,
        limits: [10,50, 100, 300], // 每页条数的选择项
        limit: 50, //默认显示50条
        cols: [
            [
                {type: "checkbox",width: "2%"},
                {field: "orderNo",title: "订单号", templet: "#tpl_orderNo",width: "13%"},
                // {field: "storeAcct", title: "店铺",width: "5%"},
                {field: "issueSku", title: "SKU",templet:"#tpl_sku_status",width: "9.5%"},
                // {field: "stockLocation", title: "库位",width: "5%"},
                {field: "title", title: "商品名称",width: "15%"},
                {field: "specifications", title: "规格", templet:'#tpl_specifications',width: "7%"},
                // {field: "deliverySku", title: "实发sku",width: "6%"},
                {field: "quality", title: "数量/重量", templet:'#tpl_quality',width: "4.5%"},
                {field: "money", title: "金额", templet:'#tpl_money',width: "3%"},
                {field: "issueRemark", title: "问题类型/描述", templet:'#tpl_issue',width: "6%"},
                {field: "issueImg", title: "反馈图片", templet:'#tpl_img',width: "6%"},
                {field: "teamLeaderRemark",  align: "center", title: "备注",edit:'text',event: 'teamLeaderRemarkChange',width: "6%"},
                {field: "stuff", title: "订单人员", templet:'#tpl_stuff',width: "6%"},
                {field: "packager", title: "仓库人员", templet:'#tpl_packager',width: "6%"},
                {field: "optTime", title: "时间", templet:'#tpl_time',width: "10%"},
                {title: "操作", toolbar: '#tpl_operation', width: "5%"},
            ],
        ],
        id:'deliveryexception_table',
        created:function (res) {
        },
        done: function(res, curr, count){
            const res_count=res.extra
            admin.load.hide();
            $("#deliveryexception_need_number").html(res_count[0].count);
            $("#deliveryexception_number").html(res_count[1].count);
            imageLazyload();
            // theadHandle().fixTh({id:'#dexceptionCard'});
            UnifiedFixedFn('dexceptionCard');
            table.on("edit(deliveryexception_table)",
                function (obj) {
                  const { field, value, data } = obj;
                  const params={
                      id:data.id,
                      teamLeaderRemark:value
                  }
                  if (field === "teamLeaderRemark") {
                    commonReturnPromise({
                      url: "/lms/deliveryIssue/updateTeamLeaderRemark.html",
                      type: "GET",
                      contentType: "application/json",
                      params: params,
                    }).then(() => {
                      layer.msg("操作成功", { icon: 1 });
                    }).catch(()=>{
                        $("#scan_error_search_button").click()
                    })
                  }
                }
            );
        }
    });

    /**平台更改**/
    // form.on('select(publish_dexcept_platList_sel)', function (data) {
    //     var platCode=$("#publish_dexcept_platList_sel").val();
    //     dexcept_initStroreAcct(platCode)
    // });
    /**
     * 根据平台渲染店铺选择框
     */
    function dexcept_initStroreAcct(platCode) {
        $.ajax({
            type: "post",
            url: ctx + "/skuRepair/getAllStroreAcctByPaltCode.html",
            data: {"platCode": platCode},
            dataType: "json",
            success: function (returnData) {
                if (returnData.code == "0000") {
                    var currentStoreAccts= [];
                    for (var i = 0; i < returnData.data.length; i++) {
                        var a = {name: returnData.data[i].store_acct, value: returnData.data[i].id}
                        currentStoreAccts.push(a);
                    }
                    formSelects.data('publish_dexcept_storeAcct_sel', 'local', {arr: currentStoreAccts})
                    form.render();
                } else {
                    layer.msg(returnData.msg,{icon:5});
                }
            }
        });
    };

    $("#de_search_form").click(function () {
        admin.load.show();
        table.reload('deliveryexception_table', {
            page: {
                curr: 1
            },
            where: serializeObject($('#dexcept_searchForm'),formSelects,'dexcept_searchForm')
        })
    })

    $('#inputexceptions').click(function(){
        layer.open({
            type: 1,
            title: "录入异常",
            area: ["60%", "65%"],
            btn:['提交','关闭'],
            shadeClose: false,
            content: $("#layer_inputexcept").html(),
            success:function () {
                laydate.render({
                    elem: '#delivery_time_str'
                    ,type: 'datetime'
                });
                form.render();
                $('#layer_nid_refresh').click(function () {
                    sycnAllRootData('issue_addForm');
                });
                //上传图片
                upload.render({
                    elem: '#delivery_issue_upload' //绑定元素
                    , url: ctx + '/deliveryIssue/upload.html' //上传接口
                    , done: function (res) {
                        //上传完毕回调
                        console.log("response -->", res);
                        if (res.code === "0000") {
                            layer.open({
                                title: '上传图片'
                                , content: '上传成功;图片url-->' + res.data
                            });
                        } else {
                            layer.msg("上传失败;" + res.msg);
                        }
                    }
                    , error: function (res) {
                        //请求异常回调
                        layer.msg("上传失败;" + res.msg);
                    }
                });
            },
            yes:function (index, layero) {
                var data = serializeObject($('#issue_addForm'),formSelects,'issue_addForm');
                if(null == data['issueType'] || data['issueType']==''){
                    layer.msg("请选择问题类型");
                    return;
                }
                if(null == data['allrootNid'] || data['allrootNid']==''){
                    layer.msg("请输入普源订单号");
                    return;
                }
                if(null == data['issueSku'] || data['issueSku']==''){
                    layer.msg("请输入异常sku");
                    return;
                }
                var imgs = $('#issue_addForm textarea[name=issueImgs]').val().toString().trim(" ");
                if(null != imgs && imgs != ''){
                    imgs = imgs.replace(new RegExp("\n","gm"), ",");
                }
                data['issueImgs'] = imgs;
                layer.load(1);
                $.ajax({
                    type: 'post',
                    url: ctx + '/deliveryIssue/addIssue.html',
                    dataType: 'json',
                    data: data,
                    success: function (returnData) {
                        layer.closeAll('loading');
                        if (returnData.code == '0000') {
                            layer.msg('提交成功')
                            sync_packager(returnData.data);
                            $("#issue_addForm")[0].reset();
                            form.render();

                            layer.close(index);
                            admin.load.show();
                            table.reload('deliveryexception_table', {
                                page: {
                                    curr: 1
                                },
                                where: serializeObject($('#dexcept_searchForm'),formSelects,'dexcept_searchForm')
                            })

                        } else {
                            layer.msg(returnData.msg)
                        }
                    },
                    error: function () {
                        layer.msg('发送请求失败')
                    }
                })
            }
        });
    });
    //动态添加包装员
    function sync_packager(packagers) {
        var packager_arr = [];
        var curtPackager =  $('#dexcept_searchForm select[name=packager]').val();
        var flag = true;
        if(''==curtPackager){
            packager_arr.push('<option value="" selected>请选择</option>');
            $.each(packagers, function (i, v) {
                var opt = '<option value="' + v + '" >' + v + '</option>'
                packager_arr.push(opt)
            })
        }else{
            packager_arr.push('<option value="" >请选择</option>');
            $.each(packagers, function (i, v) {
                var opt = '<option value="' + v + '" >' + v + '</option>'
                if (v == curtPackager) {
                    flag = false;
                    opt = '<option value="' + v + '" selected>' + v + '</option>'
                }
                packager_arr.push(opt)
            })
            if(flag){
                packager_arr.push('<option value="' + curtPackager + '" selected>' + curtPackager + '</option>');
            }
        }
        $('#packager').html(packager_arr.join(''))

        form.render();
    }
    //更新发货异常
    table.on('tool(deliveryexception_table)', function(obj) {
        var rowData = obj.data;
        var layEvent = obj.event;
        var tr = obj.tr;
        id = rowData.id;
        if (layEvent === 'modify') {
            var index = layer.open({
                type: 1,
                title: "录入异常修改",
                area: ["60%", "65%"],
                btn:['提交','关闭'],
                shadeClose: false,
                content: $("#mofidy_layer").html(),
                success:function () {
                    laydate.render({
                        elem: '#delivery_time_str'
                        ,type: 'datetime'
                    });
                    $('#issue_mofidy_form select[name=issueType]').val(rowData.issueType);
                    $('#issue_mofidy_form input[name=allrootNid]').val(rowData.allrootNid);
                    $('#issue_mofidy_form input[name=platCode]').val(rowData.platCode);
                    $('#issue_mofidy_form input[name=storeAcct]').val(rowData.storeAcct);
                    $('#issue_mofidy_form input[name=orderId]').val(rowData.orderId);
                    $('#issue_mofidy_form input[name=issueSku]').val(rowData.issueSku);
                    $('#issue_mofidy_form input[name=issueNum]').val(rowData.issueNum);
                    $('#issue_mofidy_form input[name=issueWeight]').val(rowData.issueWeight);
                    $('#issue_mofidy_form input[name=deliverySku]').val(rowData.deliverySku);
                    $('#issue_mofidy_form select[name=issueCurrency]').val(rowData.issueCurrency);
                    $('#issue_mofidy_form input[name=issueAmount]').val(rowData.issueAmount);
                    $('#issue_mofidy_form input[name=packager]').val(rowData.packager);
                    $('#issue_mofidy_form input[name=deliveryTime]').val(rowData.deliveryTime);
                    $('#issue_mofidy_form textarea[name=issueRemark]').val(rowData.issueRemark);
                    var imgs = rowData.issueImgs;
                    if(null != imgs && imgs != ''){
                        imgs = imgs.replace(new RegExp(",","gm"), "\n");
                    }
                    $('#issue_mofidy_form textarea[name=issueImgs]').val(imgs);


                    form.render();
                    // form.render('select')

                    $('#layer_nid_refresh').click(function () {
                        sycnAllRootData('issue_mofidy_form');
                    })
                },
                yes:function (index, layero) {
                    var param = serializeObject($('#issue_mofidy_form'),formSelects,'issue_mofidy_form');
                    if(null == param['allrootNid'] || param['allrootNid']==''){
                        layer.msg("请输入普源订单号");
                        return;
                    }
                    if(null == param['issueSku'] || param['issueSku']==''){
                        layer.msg("请输入异常sku");
                        return;
                    }
                    if(null == param['platCode'] || param['platCode']==''){
                        layer.msg("请输入平台");
                        return;
                    }
                    if(null == param['storeAcct'] || param['storeAcct']==''){
                        layer.msg("请输入店铺");
                        return;
                    }
                    if(null == param['orderId'] || param['orderId']==''){
                        layer.msg("请输入店铺单号");
                        return;
                    }
                    param['id'] = rowData.id;
                    var imgs = $('#issue_mofidy_form textarea[name=issueImgs]').val().toString().trim(" ");
                    if(null != imgs && imgs != ''){
                        imgs = imgs.replace(new RegExp("\n","gm"), ",");
                    }
                    param['issueImgs'] = imgs;
                    $.ajax({
                        type: 'post',
                        url: ctx + '/deliveryIssue/updateIsse.html',
                        dataType: 'json',
                        data: param,
                        success: function (returnData) {
                            layer.closeAll('loading');
                            if (returnData.code == '0000') {
                                layer.msg('修改成功');
                                sync_packager(returnData.data);
                                $("#issue_mofidy_form")[0].reset();
                                form.render();

                                layer.close(index);
                                admin.load.show();
                                table.reload('deliveryexception_table', {
                                    page: {
                                        curr: 1
                                    },
                                    where: serializeObject($('#dexcept_searchForm'),formSelects,'dexcept_searchForm')
                                })
                            } else {
                                layer.msg(returnData.msg)
                            }
                        },
                        error: function () {
                            layer.msg('发送请求失败')
                        }
                    })
                }
                ,btn2: function(index, layero){

                }
            });
        }else if(layEvent === 'deal'){
            layer.open({
                title: '处理',
                content:'确认处理?',
                btn: ['处理','取消'],
               yes:function (index, layero) {
                let params_data={id};
                $.ajax({
                    type: "GET",
                    url: ctx + "/deliveryIssue/dealIssue.html",
                    // data: JSON.stringify(params_data),
                    data: params_data,
                    contentType: 'application/json',
                    dataType: 'json',
                    success: function (returnData) {
                        if (returnData.code == "0000") {
                            layer.close(index);
                            layer.msg('审核成功');
                            $("#de_search_form").trigger('click');
                        } else {
                            layer.msg(returnData.msg);
                        }
                    },
                    error: function (returnData) {
                        console.error("send change--->", returnData);
                        layer.msg("服务器正忙");
                    }, complete: function () {
                        loading.hide();
                    }
                });
               }
            })
        }
    })


    //导出
    $('#export_issuelist').click(function() {
        var outerIndex = layer.open({
            title: '导出详情',
            type: 1,
            area: ['1000px', '600px'],
            // id: 'exportSSkuPop',
            btn: ['确定', '关闭'],
            content: $('#issue_exportPop').html(),
            success: function() {
                form.on('checkbox(selectAll_issuelist)', function(data) {
                    var checked = data.elem.checked
                    $('#exportForm_issuelist input[type=checkbox]:enabled').prop('checked', checked)
                    form.render('checkbox')
                })
                form.render('checkbox')
            },
            yes: function() {
                var data = serializeObject($('#exportForm_issuelist'),formSelects,'exportForm_issuelist')
                var searchParam = serializeObject($('#dexcept_searchForm'),formSelects,'dexcept_searchForm')
                checkNull(searchParam)
                data.searchParam = JSON.stringify(searchParam)
                var Confirmindex = layer.confirm('确认导出当前搜索条件下的数据？', { btn: ['确认', '取消'] }, function() {
                    layer.alert('如果导出数据量大，需要几分钟处理数据，请不要关闭和操作网页，后台正在进行导出文件')
                    submitForm(data, ctx + '/deliveryIssue/exportIssueList.html')
                    layer.close(outerIndex);
                })
            }
        })
    })

    $('#exception_downLoadTemplet').click(function(){
        // submitForm(null, ctx + '/static/templet/deliveryIssueAddTemplate.xlsx')
        window.location.href = ctx + '/static/templet/deliveryIssueAddTemplate.xlsx';
    });

    // excel导入
    $('#import_issuelist').on('change', function() {
        var files = $('#import_issuelist')[0].files
        if (files.length == 0) {
            return
        }
        // 校验文件类型
        var fileName = files[0].name
        var seat = fileName.lastIndexOf(".");
        var extension = fileName.substring(seat).toLowerCase();
        if (extension != '.xlsx' && extension != 'xls') {
            layer.msg('请传入后缀为.xlsx或者.xls 的Excel文件')
            return
        }
        var formData = new FormData();
        formData.append("file", files[0]);
        layer.confirm('确认导入这个文件吗', { btn: ['确认', '取消'] },
            function() {
                loading.show()
                $.ajax({
                    url: ctx + '/deliveryIssue/addByExcel.html',
                    type: 'POST',
                    // async : false,
                    data: formData,
                    processData: false,
                    contentType: false,
                    success: function(data) {
                        loading.hide()
                        // 清空 excel
                        $('#import_issuelist').val('')
                        if (data.code == '0000') {
                            var resData = data.data;
                            if(data.data.avalidRowList){
                                layer.confirm('提交'+ resData.count + '条, 失败'+resData.avalidRowList.length + '条,失败行号: ' + resData.avalidRowList.join(','), { btn: ['确认', '取消'] });
                            }else{
                                layer.msg('新增成功' + resData.count + '条')
                            }
                        } else {
                            layer.alert(data.msg)
                        }
                    },
                    error: function() {
                        loading.hide()
                        $('#import_issuelist').val('')
                    }
                });
            },
            function() {
                layer.closeAll()
            }
        )
    })
});

function serializeObject(form,formSelects,type) {
    // var platCode=$("#publish_dexcept_platList_sel").val();
    var o = {processStatus:$("#deliveryexception_hidden_mark").val()}
    $.each(form.serializeArray(), function (index) {
        if (o[this['name']]) {
            o[this['name']] = o[this['name']] + ',' + this['value']
        } else {
            o[this['name']] = this['value']
        }
    })
    if(type=='dexcept_searchForm'){
        o.storeAcctStr =  (o.storeAcctStr || '').replace(/，/g,',');
        o.platCodeStr =  (o.platCodeStr || '').replace(/，/g,',');
        // 开发，创建人
        o[o.operatorType] = o.operator
        delete o.operatorType
        delete o.operator
    }

    /*var storeAcctIds = [];
    var storeAcctIdObj = formSelects.value("publish_dexcept_storeAcct_sel");
    console.log(storeAcctIdObj)
    for (var i = 0; i < storeAcctIdObj.length; i++) {
        storeAcctIds.push($.trim(storeAcctIdObj[i].val));
    }
    if(storeAcctIds!=null && storeAcctIds.length!=0 && storeAcctIds!=''){
        o.storeAcctIdStr =storeAcctIds.join(',');
    }else{
        o.storeAcctIdStr =""
    }
    if(platCode!=null && platCode!=''){
        o.platCode=platCode;
    }*/
    return o
}

//获取普源异常订单数据
function sycnAllRootData(id) {
    var allrootNid = $('#' + id + ' input[name=allrootNid]').val();
    if(allrootNid == null || allrootNid.trim(" ")==''){
        layer.msg('请输入普源订单号');
        return;
    }
    layer.load(1);
    $.ajax({
        type: 'post',
        url: ctx + '/deliveryIssue/ptradeInfo.html',
        dataType: 'json',
        data: {allrootNid: allrootNid},
        success: function (returnData) {
            layer.closeAll('loading');
            var ptradeInfo = returnData.data;
            if (returnData.code == '0000') {
                $('#' + id + ' input[name=platCode]').val(ptradeInfo.platCode);
                $('#' + id + ' input[name=storeAcct]').val(ptradeInfo.storeAcct);
                $('#' + id + ' input[name=orderId]').val(ptradeInfo.orderId);
                $('#' + id + ' input[name=storeAcct]').val(ptradeInfo.storeAcct);
                $('#' + id + ' input[name=packager]').val(ptradeInfo.packager);
                $('#' + id + ' input[name=deliveryTime]').val(ptradeInfo.deliveryTime);

            } else {
                layer.msg(returnData.msg)
            }
        },
        error: function () {
            layer.msg('发送请求失败')
        }
    })
}


