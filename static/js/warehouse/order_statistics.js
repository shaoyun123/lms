/**点货进度汇总**/
layui.use(["admin", "layer", "table", "form", "laytpl", "laydate", "element","formSelects"], function () {
    var layer = layui.layer,
        admin = layui.admin,
        table = layui.table,
        element = layui.element,
        form = layui.form,
        formSelects = layui.formSelects,
        laydate = layui.laydate;

    //点货时间渲染
    laydate.render({elem: '#orderStatistics_createTime_input', range: true , type: 'datetime'});
    orderStatistics_setLatestMonth();
    fillWarehouse();
    orderStatistics_initOrgList()


    /**
     * 初始化仓库信息
     */
    function fillWarehouse() {
        console.log("-------------");
        commonReturnPromise({
          url: ctx+'/skuLocationTransfer/getAuthedProdWarehouseList.html'
        }).then(res => {
          commonRenderSelect('orderStatistics_storeId', res, { name: 'warehouseName', code: 'id' }).then(function () {
            formSelects.render('orderStatistics_storeId');
          });
        });
    };

    function appendSelect(pre, dom, data, code, label, attachment) {
        $('#' + pre + ' #' + dom).empty();
        var option = '<option value="">请选择</option>'
        for (var i in data) {
            if (typeof data[i] !== 'string') {
                attachment ?
                    data[i].code = data[i][code] + '_' + data[i][attachment] :
                    data[i].code = data[i][code] || data[i].code
                data[i].label = data[i][label] || data[i].label;
            }
            option += '<option value="' + (data[i].code || data[i]) + '">' + (data[i].label || data[i]) + '</option>'
        }
        $('#' + pre + ' #' + dom).append(option)
    }

    //初始化ajax请求
    function initAjax(url, method, data, func, contentType, showLoading, layerLoadingHidden) {
        //默认loading
        if (!showLoading) {
            loading.show();
        }
        $.ajax({
            type: method,
            url: ctx + url,
            dataType: 'json',
            async: true,
            data: data,
            contentType: contentType || 'application/json',
            success: function (returnData) {
                loading.hide();
                if (!layerLoadingHidden) {
                    layui.admin.load.hide();
                }
                if (returnData.code == "0000") {
                    func(returnData)
                } else if (returnData.code == "0001") {
                    layer.alert(returnData.msg, {icon: 2});
                } else {
                    layer.msg(returnData.msg, {icon: 2});
                }
            },
            error: function (returnData) {
                layui.admin.load.hide();
                if (XMLHttpRequest.status == 200) {
                    layer.msg("请重新登录", {icon: 7});
                } else {
                    layer.msg("服务器错误");
                }
            },
            complete: function (returnData) {
                if (!layerLoadingHidden) {
                    layui.admin.load.hide();
                }
                loading.hide();
            }
        });
    }

    // 初始化 部门数据下拉框
    function orderStatistics_initOrgList(orgId = '', init = true) {
        commonReturnPromise({
            url: ctx + '/orderStatistics/getOrderStatisticsPageEnum.html',
            params: { orgId },
        }).then(data => {
            init && commonRenderSelect('orderStatistics_orgId', data.dep, { name: 'name', code: 'id' })
            commonRenderSelect('orderStatistics_creator_sel', data.listerList, { name: 'name', code: 'value' })
        }).then(() => {
            form.render()
        }).catch(err => layui.layer.msg(err || err.message, { icon: 2 }))
    }
    
    // 部门与制单/点货人联动
    form.on('select(orderStatistics_org)', function (data) {
        orderStatistics_initOrgList(data.value, false)
    })

    /**初始化下拉框数据**/
    // $.ajax({
    //     url: ctx + "/orderStatistics/getOrderStatisticsPageEnum.html",
    //     type: 'post',
    //     dataType: 'json',
    //     success: function (returnData) {
    //         if (returnData.code == "0000") {
    //             var str = "<option value=''></option>"
    //             $(returnData.data.listerList).each(function () {
    //                 str += '<option value="' + this.value + '">' + this.name + '</option>'
    //             });
    //             $("#orderStatistics_creator_sel").html(str);
    //             form.render('select');
    //         } else {
    //             layer.msg(returnData.msg, {icon: 3});
    //         }
    //     }
    // });
    $("#orderStatistics_search_btn").click(function(){
        orderStatistics_render_fun();
    });
    $('#orderStatistics_zhidan_wieght').keydown(function(e) {
        if (e.keyCode == 13) {
            orderStatistics_render_fun();
            return false;
        }
    });
    element.on('tab(orderStatistics_tab)', function (data) {
        orderStatistics_render_fun();
    });
    /**搜索**/
    function orderStatistics_render_fun() {
        var createTime=$("#orderStatistics_createTime_input").val();
        if (createTime == null || createTime == '') {
            layer.msg("请选择日期",{icon:0});
            return false;
        }
        table.render({
            elem: '#orderStatistics_data_table',
            url: ctx + "/orderStatistics/countOrderStatistics.html",
            page: false, //开启分页
            method: 'post',
            totalRow: true,
            where: orderStatistics_getSearchData(),
            cols: [
                [ //表头
                    {field: 'scanPerson', rowspan: 2, title: '点货人员'},
                    {field: 'deptName', rowspan: 2, title: '点货部门-子部门',},
                    {field: 'days', rowspan: 2, title: '统计日期',},
                    {field: 'dayOfWeek', rowspan: 2, title: '星期几',},
                    {colspan: 9, title: '点货入库SKU次数',},
                    {field: 'dayloadTimesTotal',rowspan: 2, sort: true, totalRow: true, title: '装车个数'},
                    {colspan: 9, title: '点货入库SKU数量',},
                    {field: 'dayloadNumTotal',rowspan: 2, sort: true, totalRow: true, title: '装车求和'},
                ], [
                    {field: 'tTimes', sort: true, totalRow: true, title: 'T类'},
                    {field: 'aTimes', sort: true, totalRow: true, title: 'A类'},
                    {field: 'bTimes', sort: true, totalRow: true, title: 'B类'},
                    {field: 'cTimes', sort: true, totalRow: true, title: 'C类'},
                    {field: 'dTimes', sort: true, totalRow: true, title: 'D类'},
                    {field: 'eTimes', sort: true, totalRow: true, title: 'E类'},
                    {field: 'fTimes', sort: true, totalRow: true, title: 'F类'},
                    {field: 'noTimes', sort: true, totalRow: true, title: '无类型'},
                    {field: 'daystorageTimesSum', sort: true, totalRow: true, title: '求和'},
                    {field: 'tCount', sort: true, totalRow: true, title: 'T类' ,templet: function(d){return d.tCount||0}},
                    {field: 'aCount', sort: true, totalRow: true, title: 'A类' ,templet: function(d){return d.aCount||0}},
                    {field: 'bCount', sort: true, totalRow: true, title: 'B类' ,templet: function(d){return d.bCount||0}},
                    {field: 'cCount', sort: true, totalRow: true, title: 'C类' ,templet: function(d){return d.cCount||0}},
                    {field: 'dCount', sort: true, totalRow: true, title: 'D类' ,templet: function(d){return d.dCount||0}},
                    {field: 'eCount', sort: true, totalRow: true, title: 'E类' ,templet: function(d){return d.eCount||0}},
                    {field: 'fCount', sort: true, totalRow: true, title: 'F类' ,templet: function(d){return d.fCount||0}},
                    {field: 'nCount', sort: true, totalRow: true, title: '无类型' ,templet: function(d){return d.nCount||0}},
                    {field: 'dayStorageNumCountSum',sort:true,totalRow: true, title: '求和'},

                ]
            ],
            done: function (res, curr, count) {
                $("#orderStatistics_count_num").html(count);
            }
        });
    };
    //导出
    $("#orderStatistics_export_btn").click(function () {
        var data = orderStatistics_getSearchData();
        if (data.startDate == null || data.startDate == '') {
            layer.msg("请选择时间区间", {icon: 0});
            return false;
        }
        if (!orderStatistics_dateCheck_fun(data.startDate, data.endDate)) {
            return;
        }
        var confirmindex = layer.confirm('确认导出当前搜索条件下的点货进度汇总信息？', {btn: ['确认', '取消']}, function () {
            submitForm(data, ctx + '/orderStatistics/exportOrderStatistics.html', "_blank")
            layer.close(confirmindex);
        }, function () {
            layer.close(confirmindex);
        })
    });
    /**
     * 获取当前月份
     */
    function orderStatistics_setLatestMonth() {
        var createTimeEnd = Format(new Date(), 'yyyy-MM-dd hh:mm:ss');
        var createTimeStart = Format((new Date()).setMonth(new Date().getMonth() - 1), 'yyyy-MM-dd hh:mm:ss');
        $('#orderStatistics_createTime_input').val(createTimeStart + ' - ' + createTimeEnd);
    };

    /**获取搜索参数**/
    function orderStatistics_getSearchData() {
        var data = serializeObject($("#orderStatistics_search_form"));
        var createTime = $.trim(data.createTime);
        if (createTime != null && createTime != '') {
            data.startDate = createTime.split(" - ")[0];
            data.endDate =createTime.split(" - ")[1];
        }
        var weight = $("#orderStatistics_zhidan_wieght").val(); //制单权重
        if (weight != null && weight != ''&&$.isNumeric(weight)) {
            data.weight=weight;
        }else{
            data.weight=1.0;
        }
        return data;
    }

    //判断开始日期是否大于结束日期
    function orderStatistics_dateCheck_fun(t1, t2) {
        var start = new Date(t1).getTime();
        var end = new Date(t2).getTime();
        if (start > end) {
            layer.msg("开始日期不能大于结束日期", {icon: 0});
            return false;
        }
        var days = parseInt((end - start) / (1000 * 60 * 60 * 24));
        if (days > 180) {
            layer.msg("日期范围超过半年", {icon: 0});
            return false;
        }
        return true;
    }
});