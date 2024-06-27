console.log('营收')
layui.use(['admin', 'form', 'table', 'laydate', 'upload', 'formSelects'], function () {
    var $ = layui.$,
        admin = layui.admin,
        element = layui.element,
        layer = layui.layer,
        laydate = layui.laydate,
        table = layui.table,
        upload = layui.upload,
        form = layui.form;
    form.render(null, 'component-form-element');
    form.render(null, 'component-form-group');
    form.render();
    formSelects = layui.formSelects,
        render_hp_orgs_users("#amazon_analysis_search_form");//渲染部门销售员店铺三级联动
    var orderType = 0;//订单类型
    listByStoreAcctId(orderType);
    /**
     * 查询类型选项卡改变
     */
    element.on('tab(amazon_analysis_tab_filter)', function (data) {
        orderType = $(this).attr("orderType");
        listByStoreAcctId(orderType);
    });

    /**
     * 获取请求参数
     * @param type --->指代 orderType
     */
    function getData(type) {
        var orgId = $("#amazon_analysis_search_form select[name=orgId]").val();
        var salePersonIds = $("#amazon_analysis_search_form select[name=salePersonId]").val();
        var roleNames = $("#amazon_analysis_search_form select[name=salePersonId]").data("rolelist");
        var storeAcctId = $("#amazon_analysis_search_form select[name=platAcctId]").val();
        //TODO: 需要修改
        var orderTime = $.trim($("#amazonAnalysisOrderTimeDiv input[name='amazonAnalysisOrderTime']").val());
        var start = "";
        var end = "";
        if (!orderTime || orderTime === "") {
            return null;
        }
        if (orderTime != '') {
            // orderTime '2024-01 - 2024-02'
            // 获取所选年月endTime 对应多少天endDays
            const orderTimeList = orderTime.split(' - ')
            const [endYear, endMonth] = orderTimeList[1].split('-')
            const endDays = new Date(endYear, endMonth, 0).getDate()

            start = orderTimeList[0] + "-01 00:00:00";
            end = orderTimeList[1] + '-' + endDays + ' ' + "23:59:59";
        }
        var requestData = {};
        requestData.orgId = orgId;
        requestData.salePersonIds = salePersonIds;
        requestData.roleNames = roleNames;
        requestData.storeAcctId = storeAcctId;
        requestData.start = start;
        requestData.end = end;
        if (type) {
            requestData.orderType = type;
        } else {
            requestData.orderType = orderType;
        }
        return requestData;
    }

    function listByStoreAcctId(orderType) {
        var requestData = getData(orderType);
        if (!requestData) {
            layer.msg("时间必选", {icon: 2});
            showTable(orderType, "[]");
            return;
        }
        sendRequest(requestData).then(function (response) {
            loading.hide()
            showTable(orderType, response);
        }).catch(function (response) {
            loading.hide()
            showTable(orderType, "[]");
        });
    }


    /**
     * 发送请求
     */
    function sendRequest(data) {
        loading.show()
        return new Promise(function (resolve, reject) {
            $.ajax({
                method: "POST",
                url: ctx + '/amazonFinancialAnalysisController/searchAmazonAnalysisList.html',
                data: data,
                contentType: "application/x-www-form-urlencoded",
                success: function (responseData) {
                    loading.hide()
                    var $responseData = responseData
                    if ($responseData.code === "0000") {
                        resolve(responseData);
                    } else {
                        reject(responseData);
                        layer.msg(responseData.msg, {icon: 2});
                    }
                },
                error: function (errorData) {
                    layer.msg(errorData.msg, {icon: 2});
                    reject(errorData);
                }
            });
        });
    }

    /**
     * 展示table表格
     * @param orderType 订单类型
     * @param data 数据
     */
    function showTable(orderType, data) {
        // var $data = JSON.parse(data);
        var $data = data;
        if (orderType == 1) {
            table.render({
                elem: '#amazon_analysis_table_filter',
                data: $data.data,
                totalRow: true,
                cols: [
                    [ //表头
                        {field: 'storeName', title: '店铺', width: '5%', sort: true, totalRowText: '合计'},
                        {field: 'orderNum', title: '订单数', width: '4%', sort: true, totalRow: true},
                        {field: 'salesAmount', title: '销售额($)', sort: true, width: '5%', totalRow: true},
                        {field: 'unitAmount', title: '客单价($)', sort: true, width: '5%', totalRow: true},
                        {field: 'refundOrderNum', title: '退款订单数', width: '5%', sort: true, totalRow: true},
                        {field: 'refundAmount', title: '退款金额($)', width: '4%', sort: true, totalRow: true},
                        {
                            field: 'refundRate',
                            templet: '<div>{{d.refundRate}}%</div>',
                            title: '退款率',
                            width: '5%',
                            totalRow: false,
                            sort: true
                        },
                        {field: 'adjustmentAmount', title: 'FBA调整收益($)', sort: true, width: '5%', totalRow: true},
                        {field: 'liquidationsAmount', title: 'FBA清算收益($)', sort: true, width: '5%', totalRow: true},
                        {field: 'disposalAmount', title: 'FBA移除订单费($)', sort: true, width: '5%', totalRow: true},
                        {field: 'returnStoreAmount', title: 'FBA退货费($)', sort: true, width: '5%', totalRow: true},
                        {field: 'storageAmount', title: 'FBA仓储费($)', sort: true, width: '5%', totalRow: true},
                        {field: 'platTranAmount', title: '平台成交费($)', sort: true, width: '5%', totalRow: true},
                        {field: 'deliveryAmount', title: 'FBA派送费($)', sort: true, width: '5%', totalRow: true},
                        {field: 'adAmount', title: '广告费($)', sort: true, width: '4%', totalRow: true},
                        {field: 'goodsCost', title: '商品成本(￥)', sort: true, width: '4%', totalRow: true},
                        {field: 'logisticsAmount', title: '物流成本(￥)', sort: true, width: '4%', totalRow: true},
                        {field: 'packageAmount', title: '包装成本 (￥)', sort: true, width: '4%', totalRow: true},
                        {field: 'removalSkuPurchaseCast', title: '移除商品成本 (￥)', sort: true, width: '4%', totalRow: true},
                        {field: 'removalSkuHeadFreight', title: '移除头程运费 (￥)', sort: true, width: '4%', totalRow: true},
                        {field: 'profit', title: '实收利润 (￥)', sort: true, width: '5%', totalRow: true},
                        {
                            field: 'profitRate',
                            templet: '<div>{{d.profitRate}}%</div>',
                            title: '实收利润率',
                            sort: true,
                            width: '4%',
                            totalRow: false
                        }
                    ]
                ],
                page: false,
                limit: Number.MAX_VALUE, 
                done: function (res, curr, count) {
                    if ($data.code == "0000") {
                        var map = JSON.parse($data.msg);
                        var refundRateDiv = $("div .layui-table-total [data-field= 'refundRate']>div");
                        var profitRateDiv = $("div .layui-table-total [data-field= 'profitRate']>div");
                        if (undefined != refundRateDiv) {
                            refundRateDiv.html(map.refundRateSum + "%");
                        }
                        if (undefined != profitRateDiv) {
                            profitRateDiv.html(map.profitRateSum + "%");
                        }
                    }
                }
            });
        } else {
            //表格渲染
            table.render({
                elem: '#amazon_analysis_table_filter',
                data: $data.data,
                totalRow: true,
                cols: [
                    [ //表头
                        {field: 'storeName', title: '店铺', width: '7%', sort: true, totalRowText: '合计'},
                        {field: 'orderNum', title: '订单数', width: '7%', sort: true, totalRow: true},
                        {field: 'salesAmount', title: '销售额($)', sort: true, width: '7%', totalRow: true},
                        {field: 'platTranAmount', title: '平台成交费($)', sort: true, width: '7%', totalRow: true},
                        {field: 'unitAmount', title: '客单价($)', sort: true, width: '7%', totalRow: true},
                        {field: 'refundOrderNum', title: '退款订单数', width: '7%', sort: true, totalRow: true},
                        {field: 'refundAmount', title: '退款金额($)', width: '7%', sort: true, totalRow: true},
                        {
                            field: 'refundRate',
                            templet: '<div>{{d.refundRate}}%</div>',
                            title: '退款率',
                            width: '7%',
                            totalRow: false,
                            sort: true
                        },
                        {field: 'subscriptionAmount', title: '月租费($)', sort: true, width: '7%', totalRow: true},
                        {field: 'goodsCost', title: '商品成本 (￥)', sort: true, width: '7%', totalRow: true},
                        {field: 'logisticsAmount', title: '物流成本 (￥)', sort: true, width: '7%', totalRow: true},
                        {field: 'packageAmount', title: '包装成本 (￥)', sort: true, width: '7%', totalRow: true},
                        {field: 'profit', title: '实收利润 (￥)', sort: true, width: '7%', totalRow: true},
                        {
                            field: 'profitRate',
                            templet: '<div>{{d.profitRate}}%</div>',
                            title: '实收利润率',
                            sort: true,
                            width: '7%',
                            totalRow: false
                        }
                    ]
                ],
                page: false,
                limit: Number.MAX_VALUE, //默认显示50条
                done: function (res, curr, count) {
                    if ($data.code == "0000") {
                        var map = JSON.parse($data.msg);
                        var refundRateDiv = $("div .layui-table-total [data-field= 'refundRate']>div");
                        var profitRateDiv = $("div .layui-table-total [data-field= 'profitRate']>div");
                        if (undefined != refundRateDiv) {
                            refundRateDiv.html(map.refundRateSum + "%");
                        }
                        if (undefined != profitRateDiv) {
                            profitRateDiv.html(map.profitRateSum + "%");
                        }
                    }
                }
            });
        }
    }

    //日期范围
    laydate.render({
        elem: '#amazonAnalysisOrderTime',
        type: 'month',
        range: true
    });
    /**
     * 查询按钮绑定事件
     */
    $("#amazon_financial_search_btn").click(function () {
        var requestData = getData();
        if (!requestData) {
            layer.msg("时间必选", {icon: 2});
            showTable(orderType, "[]");
            return;
        }

        sendRequest(requestData).then(function (response) {
            loading.hide()
            showTable(orderType, response);
        }).catch(function (response) {
            loading.hide()
            console.log("searchAmazonAnalysisList  back error --> ", response);
            showTable(orderType, "[]");
        });
    });
});
