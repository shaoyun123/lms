var tableData;
var queryType;
layui.use(['admin', 'form', 'layer', 'table', 'formSelects', 'element', 'laydate'], function () {
    var admin = layui.admin,
        form = layui.form,
        layer = layui.layer,
        table = layui.table,
        formSelects = layui.formSelects,
        element = layui.element,
        laydate = layui.laydate,
        $ = layui.$;
    form.render(null, 'component-form-element');
    element.render('breadcrumb', 'breadcrumb');
    render_hp_orgs_users("#shopee_activity_searchForm");//渲染部门销售员店铺三级联动
    form.render('select')
    //日期范围
    laydate.render({
        elem: '#activityTime'
        , type: 'datetime'
        , range: true
    });
    queryType = 1;
    function tableReload (queryType) {
        shopeetableIns = table.render({
            elem: "#before_actvt_table",
            method: 'post',
            url: ctx + "/shopee/msgActivityShopee/getMsgActivityShopee.html",
            cols: [[
                { type: "checkbox" },
                { field: "id", title: "id" },
                { field: "storeAcctId", title: "店铺id" },
                { field: "storeAcct", title: "店铺" },
                { field: "itemId", title: "item_id" },
                { field: "prodPSku", title: "商品父SKU" },
                { field: "salePerson", title: "销售员" },
                { field: "listingPrice", title: "原价" },
                { field: "currPrice", title: "现价" },
                { field: "activityPrice", title: "活动价" },
                { field: "activityQuantity", title: "活动数量" },
                { field: "sales", title: "7/30/60/90销量",templet: '<div>{{d.sevenSales||0}}/{{d.thirtySales||0}}/{{d.sixtySales||0}}/{{d.ninetySales||0}}</div>', },
                { field: "views", title: "浏览量" },
                { field: "activityStartTime", templet: '<div>{{ Format(d.activityStartTime,"yyyy-MM-dd")}}</div>', title: "活动开始时间" },
                { field: "activityEndTime", templet: '<div>{{ Format(d.activityEndTime,"yyyy-MM-dd")}}</div>', title: "活动结束时间" },
                { field: "addDays", title: "登记天数" },
                { field: "listingDays", title: "刊登天数" },
                { title: '操作', align: 'center', toolbar: '#processactvtBar' }
            ]],
            where: shopeeActvt_getSerachData(queryType),
            page: true,
            id: "before_actvt_table",
            limits: [10, 20, 50],
            limit: 10,
            done: function (res, curr, count) {
                tableData = res;
                $("[data-field='id']").css('display', 'none');
                $("[data-field='storeAcctId']").css('display', 'none');
                if (queryType == 1) {
                    $("#tolnum_span_before").text("共" + count + "条");
                } else if (queryType == 2) {
                    $("#tolnum_span_on").text("共" + count + "条");
                } else {
                    $("#tolnum_span_after").text("共" + count + "条");
                }
            }
        });
    }

    // tableReload(1);

    /**
     * 获取搜索参数
     */
    function shopeeActvt_getSerachData (queryType) {
        var obj = {};
        var currentStoreAccts = formSelects.value("shopee_activity_store_sel", "val");//所选店铺
        console.log(currentStoreAccts)
        if (currentStoreAccts == null || currentStoreAccts.length == 0) {//没有选择店铺
            var acctIds = $("#shopee_activity_store_sel").attr("acct_ids");
            if (acctIds != null && acctIds != '') {
                obj.storeAcctIdList = acctIds;
            } else {
                obj.storeAcctId = 99999;
            }
        } else {
            obj.storeAcctIdList = currentStoreAccts.join(",");//选择的店铺
        }
        var time = $("#activityTime").val();
        obj.queryType = queryType;
        if (time != null && time != '') {
            var start = time.split(' - ')[0];
            var end = time.split(' - ')[1];
            console.log(start + end)
            obj.activityStartTime = start;
            obj.activityEndTime = end;
        }
        var itemids = $.trim($("#actvt_itemId").val());//物品号
        if (itemids != null && itemids != '') {
            obj.itemIds = itemids;
        }
        var prodPSku = $.trim($("#activityProdPSku").val());//父商品sku
        if (null != prodPSku && prodPSku != '') {
            obj.prodPSku = prodPSku;
        }
        let param = serializeObject($('#shopee_activity_searchForm'))
        delete param.depart
        delete param.salesman
        console.log(obj)
        return {...param,...obj};
    };
    $("#actvtBefore").click(function () {
        tableReload(1);
        queryType = 1
    })
    $("#actvtOn").click(function () {
        tableReload(2);
        queryType = 2
    })
    $("#actvtAfter").click(function () {
        tableReload(3);
        queryType = 3
    })
    //添加活动登记按钮
    $("#add_actvt").click(function () {
        var index = layer.open({
            type: 1,
            id: Date.now(),
            title: "添加活动",
            btn: ['保存', '关闭'],
            area: ['80%', '70%'],
            success: function () {
                layui.view(this.id).render("route/iframe/shopee/addShopeeActvt").done(function () {

                })
            },
            yes: function () {
                var startTime = $("#startTime").val();
                var endTime = $("#endTime").val();
                if (tableData != null && tableData.data.length != 0) {
                    console.log(tableData.data)
                    var flag = true;
                    tableData.data.forEach(function (item, index) {
                        item.activityStartTime = startTime;
                        item.activityEndTime = endTime;
                        var actvtPrice = $("#actvtPrice_" + item.itemId + "").val();
                        var actvtNum = $("#actvtNum_" + item.itemId + "").val();
                        console.log("数量:" + actvtNum + "price" + actvtPrice)
                        if (actvtPrice == null || actvtPrice == '') {
                            layer.msg(item.itemId + ":活动价格不可以为空！")
                            flag = false;
                        } else {
                            if (actvtNum == null || actvtNum == '') {
                                layer.msg(item.itemId + ":活动数量不可以为空！")
                                flag = false;
                            } else {
                                item.activityPrice = actvtPrice;
                                item.activityQuantity = actvtNum;
                            }
                        }
                    })
                }
                if (flag) {
                    loading.show();
                    $.ajax({
                        type: "POST",
                        url: ctx + "/shopee/msgActivityShopee/saveActivityInfo.html",
                        data: { "tabledata": JSON.stringify(tableData.data) },
                        async: true,
                        dataType: "json",
                        success: function (data) {
                            layer.msg(data.msg);
                            table.reload('before_actvt_table', {
                                where: shopeeActvt_getSerachData(queryType)
                            });
                            layer.close(index)
                            loading.hide();

                        },
                        error: function () {
                            loading.hide();
                            layer.msg("服务器正忙");
                        }
                    })
                }
            },
            end: function () {
            }
        })
    })
    $("#issueSearchBtn").click(function () {
        var type = $(this).data('type');
        active[type] ? active[type].call(this) : '';
    });
    var active = {
        reload: function () {
            tableReload(queryType);
        }
    };
    /**
     * 导入活动登记信息
     */
    $('#import_actvt').on("change", function () {
        var self = this
        var files = $(self)[0].files
        // 如果没有文件则终止
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
        layer.confirm('确认导入这个文件进行批量操作活动吗', { btn: ['确认', '取消'] },
            function () {
                loading.show()
                $.ajax({
                    url: ctx + '/shopee/msgActivityShopee/importActvt.html',
                    type: 'POST',
                    // async : false,
                    data: formData,
                    // 告诉jQuery不要去处理发送的数据
                    processData: false,
                    // 告诉jQuery不要去设置Content-Type请求头
                    contentType: false,
                    success: function (data) {
                        loading.hide()
                        $(self).val('')
                        if (data.code === '0000') {
                            layer.msg(data.msg);
                        } else {
                            layer.alert(data.msg)
                        }
                        table.reload('before_actvt_table', {
                            where: shopeeActvt_getSerachData(queryType)
                        });
                    },
                    error: function () {
                        loading.hide()
                        $(self).val('')
                    }
                });
            },
            function () {
                layer.closeAll()
                tableReload(queryType);
            }
        )
    })


    //导出
    $('#actvt_export').click(function () {
       let param = shopeeActvt_getSerachData(queryType)
        if(param.activityStartTime){
            param.activityStartTime = new Date(param.activityStartTime).getTime()
        }
        if(param.activityEndTime){
            param.activityEndTime = new Date(param.activityEndTime).getTime()
        }
        if(param.storeAcctIdList){
            param.storeAcctIdList=param.storeAcctIdList.split(',')
        }else{
            param.storeAcctIdList =[]
        }
        if(param.itemIds){
            param.itemIds=param.itemIds.split(',')
        }else{
            param.itemIds =[]
        }
        if(param.prodPSku){
            param.prodPSkuList=param.prodPSku.split(',')
        }else{
            param.prodPSkuList =[]
        }
        transBlob({
            url:'/lms/shopee/msgActivityShopee/exportActvtInfo.html',
            fileName: '活动登记导出.xls',
            contentType: "application/json;charset=UTF-8",
            formData: JSON.stringify(param),
          })
            .then(function (result) {
              // layer.msg(result, { icon: 1 })
            })
            .catch(function (err) {
              layer.msg(err, { icon: 2 })
            })
    })

    function shopee_actvt_export (data) {
        if (data.Export_Type) {
            submitForm(data, ctx + '/shopee/msgActivityShopee/exportActvtInfo.html')
        } else {
            layer.msg("选择导出类型");
        }
    }

    //工具条的监听事件,table.on(tool(表格的lay-filter的值))
    table.on('tool(before_actvt_table)', function (obj) {
        var data = obj.data, //获得当前行数据
            layEvent = obj.event; //获得 lay-event 对应的值
        if (layEvent === 'edit') {
            var id = data.id;
            var index = layer.open({
                type: 1,
                title: '修改活动信息',
                area: ['600px', '400px'],
                btn: ['保存', '取消'],
                shadeClose: false,
                content: $('#tb_addupdate').html(),
                success: function () {
                    initNotNull('#addOrEditActvtForm_tort')
                    // 复现数据
                    $('#addOrEditActvtForm_tort [name=activityPrice]').val(data.activityPrice)
                    $('#addOrEditActvtForm_tort [name=activityQuantity]').val(data.activityQuantity)
                    $('#addOrEditActvtForm_tort [name=beginTime]').val(Format(data.activityStartTime, "yyyy-MM-dd"))
                    $('#addOrEditActvtForm_tort [name=endTime]').val(Format(data.activityEndTime, "yyyy-MM-dd"))

                    laydate.render({
                        elem: '#actvt_start_time'
                        , type: 'date'
                    });
                    laydate.render({
                        elem: '#actvt_end_time'
                        , type: 'date'
                    });
                },
                yes: function (index, layero) {
                    if (!checkNotNull('#addOrEditActvtForm_tort')) {
                        return
                    }
                    var Adata = {
                        id: id,
                        activityPrice: $('#addOrEditActvtForm_tort [name=activityPrice]').val().trim(),
                        activityQuantity: $('#addOrEditActvtForm_tort [name=activityQuantity]').val().trim(),
                        activityStartTime: $('#addOrEditActvtForm_tort [name=beginTime]').val().trim(),
                        activityEndTime: $('#addOrEditActvtForm_tort [name=endTime]').val().trim()
                    }
                    loading.show();
                    $.ajax({
                        type: "POST",
                        url: ctx + "/shopee/msgActivityShopee/editActvtInfo.html",
                        data: Adata,
                        dataType: "json",
                        success: function (returnData) {
                            loading.hide();
                            tableReload(queryType)
                            if (returnData.code == "0000") {
                                layer.close(index);
                                layer.msg('修改成功');
                            } else {
                                layer.msg(returnData.msg);
                            }
                        },
                        error: function () {
                            loading.hide();
                            layer.msg("服务器正忙");
                        }
                    });
                }
            })
        } else if (layEvent === 'del') {
            layer.confirm('确定删除该条数据吗？', {
                btn: ['确定', '取消'], //按钮
                shade: false //不显示遮罩
            }, function (index) {
                var id = data.id;
                var obj = {};
                obj.id = id;
                loading.show()
                $.ajax({
                    type: "POST",
                    url: ctx + "/shopee/msgActivityShopee/delActvtInfo.html",
                    data: obj,
                    dataType: "json",
                    success: function (returnData) {
                        loading.hide()
                        tableReload(queryType)
                        if (returnData.code == "0000") {
                            $("#issueSearchBtn").trigger('click');
                            if (!status) {
                                layer.msg("删除成功");
                            }
                        } else {
                            layer.msg(returnData.msg);
                        }
                    },
                    error: function () {
                        layer.msg("服务器正忙");
                    }
                });
            });
        }
    });


    /**
     * 批量删除数据
     */
    $("#batch_delete_info").click(function () {
        var checkStatus = table.checkStatus('before_actvt_table')
        var data = checkStatus.data;
        if (data.length == 0) {
            layer.msg("未选中数据")
        } else {
            layer.confirm('确认删除选中数据么？', { btn: ['确认', '取消'] }, function () {
                loading.show();
                var id = [];
                for (var i in data) {
                    id.push(data[i].id)
                }
                if (id.length != 0) {
                    var obj = {};
                    obj.idList = id.join(',');
                    $.ajax({
                        type: "POST",
                        url: ctx + "/shopee/msgActivityShopee/batchDelActvtInfo.html",
                        data: obj,
                        dataType: "json",
                        success: function (returnData) {
                            loading.hide()
                            tableReload(queryType)
                            if (returnData.code == "0000") {
                                $("#issueSearchBtn").trigger('click');
                                if (!status) {
                                    layer.msg("删除成功");
                                }
                            } else {
                                layer.msg(returnData.msg);
                            }
                        },
                        error: function () {
                            layer.msg("服务器正忙");
                        }
                    }
                    )
                }
            }, function () {

            })
        }
    })
});
