// 店铺表现   目标值
// "Non-Compliance Points" ： 0
// "Cancellation Rate" ： <=1%,
// "Ship-on-Time (SOT)" ： >=95%,
// "Product Rating Coverage" ： >=85%,
// "Positive Seller Rating" ： >=85%,
// "Chat Same-day Response Rate" ： >=70%,
// "Chat Response Time" ： <=30min,
// "Return Rate" ： <=1%,
// "Basket size" ： >=1.5,

var lazadaAcctPerfsortList = [
    { name: 'modifyTime', value: "modifyTime" },
    { name: 'onlineListing', value: "onlineListing" },
    { name: 'inlineListing', value: "inlineListing" },
    { name: "nonCompliancePoints", value: "Non-Compliance Points" },
    { name: "cancellationRate", value: "Cancellation Rate" },
    { name: "shipOnTime", value: "Ship-on-Time (SOT)" },
    { name: "productRating", value: "Product Rating Coverage" },
    { name: "positiveSeller", value: "Positive Seller Rating" },
    { name: "chatSameDayResponseRate", value: "Chat Same-day Response Rate" },
    { name: "chatResponseTime", value: "Chat Response Time" },
    { name: "returnRate", value: "Return Rate" },
    { name: "basketSize", value: "Basket size" },
    { name: "storePerformancePenaltyPoint", value: "Store Performance penaltyPoint" },
    { name: "总罚分差值", value: "总罚分差值" },
    { name: "fulfilmentViolationsPoint", value: "Fulfilment Violations point" },
    { name: "listingViolationsPoint", value: "Listing Violations point" },
    { name: "serviceStandardsPoint", value: "Service Standards point" },
    { name: "othersPoint", value: "Others point" },
]

    ; (function ($, layui, window, document, undefined) {
        layui.use(['admin', 'table', 'form', 'element', 'layer', 'laytpl', 'formSelects', 'laydate', 'selectInput'], function () {
            var admin = layui.admin,
                table = layui.table,
                element = layui.element,
                layer = layui.layer,
                laytpl = layui.laytpl,
                laydate = layui.laydate,
                selectInput = layui.selectInput,
                formSelects = layui.formSelects,
                form = layui.form;
            form.render();
            //渲染部门销售员店铺三级联动
            render_hp_orgs_users("#lazada_acctperf_searchForm");
            //命名空间
            var lazadaAccPerformanceName = {
                initisupervisor: function () {
                    this.supervisorAjax()
                        .then(data => {
                            commonRenderSelect('lazada_accer_customServicer_sel', data, { name: 'userName', code: 'id' })
                        })
                        .then(data => form.render())
                        .catch(err => layer.msg(err || err.msg, { icon: 2 }))
                },
                tabMonitor:function(){
                    element.on('tab(lazada_acctperf_tab)', function (data) {
                        $("#lazada_acctperf_search").click()
                    });
                },
                tableRender: function (data) {
                    data.storeIdList = data.select;
                    var _this = this;
                    table.render({
                        elem: "#lazada_acctperf_data_table",
                        id: "lazada_acctperf_data_tableId",
                        method: "POST",
                        contentType: 'application/x-www-form-urlencoded',
                        where: data,
                        url: ctx + "/lazadaAccountPerformance/getLazadaAccountPerformance",
                        cols: _this.colsHandle(),
                        autoSort: false,
                        page: true,
                        limit: 100,
                        limits: [100, 200, 300, 500],
                        done: function (res, cur, count) {
                            $("#lazada_acctperf_dataCount_num1").text(count)
                            _this.tableSort()
                        },
                    });
                },
                colsHandle: function () {
                    var cols = [
                        [{
                            title: "店铺",
                            field: "storeAcct",
                            templet: "<div>{{d.storeAcct||''}}<br />更新：{{Format(d.modifyTime,'yyyy-MM-dd hh:mm:ss')}}</div>",
                            // sort: true,
                        // }, {
                        //     title: "更新时间",
                        //     field: "modifyTime",
                        //     templet: "<div>{{Format(d.modifyTime,'yyyy-MM-dd hh:mm:ss')}}</div>",
                        //     sort: true,
                        }, {
                            title: "人员",
                            field: "salesMan",
                            templet: "<div>销售：{{d.salesMan||''}}<br />主管：{{d.salesSupervisor||''}}</div>",
                        // }, {
                        //     title: "销售主管",
                        //     field: "salesSupervisor",
                        //     // sort: true,
                        }, {
                            title: "在线listing数量",
                            field: "onlineListing",
                            sort: true,
                        // }, {
                        //     title: "刊登额度",
                        //     field: "inlineListing",
                        //     sort: true,
                        // }, {
                        //     title: `Non-Compliance Points  (0)`,
                        //     field: "nonCompliancePoints",
                        //     templet: "#lazada_acctperf_nonCompliancePoints",
                        //     sort: true,
                        }, {
                            title: "Store Performance penaltyPoint（≤10）",
                            field: "storePerformancePenaltyPoint",
                            templet: "#lazada_acctperf_penaltyPoint",
                            sort: true,
                        }, {
                            title: "总罚分差值",
                            templet: "#lazada_acctperf_all",
                            field: "总罚分差值",
                            sort: true,
                        }, {
                            title: "Fulfilment Violations point",
                            field: "fulfilmentViolationsPoint",
                            templet: "#lazada_acctperf_Fulfilment",
                            sort: true,
                        }, {
                            title: "Listing Violations point",
                            field: "listingViolationsPoint",
                            templet: "#lazada_acctperf_Listing",
                            sort: true,
                        }, {
                            title: "Service Standards point",
                            field: "serviceStandardsPoint",
                            templet: "#lazada_acctperf_Service",
                            sort: true,
                        }, {
                            title: "Others point",
                            field: "othersPoint",
                            templet: "#lazada_acctperf_Others",
                            sort: true,
                        }, {
                            title: "Cancellation Rate  (≤1%)",
                            field: "cancellationRate",
                            templet: "#lazada_acctperf_cancellationRate",
                            sort: true,
                        }, {
                            title: "Ship-on-Time (SOT)  (≥95%)",
                            field: "shipOnTime",
                            templet: "#lazada_acctperf_shipOnTime",
                            sort: true,
                        }, {
                            title: "Product Rating Coverage  (≥70%)",
                            field: "productRating",
                            templet: "#lazada_acctperf_productRating",
                            sort: true,
                        }, {
                            title: "Positive Seller Rating  (≥85%)",
                            field: "positiveSeller",
                            templet: "#lazada_acctperf_positiveSeller",
                            sort: true,
                        }, {
                            title: "Chat Same-day Response Rate  (≥85%)",
                            field: "chatSameDayResponseRate",
                            templet: "#lazada_acctperf_chatSameDayResponseRate",
                            sort: true,
                        }, {
                            title: "Chat Response Time  (≤30min)",
                            field: "chatResponseTime",
                            templet: "#lazada_acctperf_chatResponseTime",
                            sort: true,
                        }, {
                            title: "Return Rate  (≤1%)",
                            field: 'returnRate',
                            templet: "#lazada_acctperf_returnRate",
                            sort: true,
                        }, {
                            title: "Basket size  (≥1.5)",
                            field: "basketSize",
                            templet: "#lazada_acctperf_basketSize",
                            sort: true,
                        },]
                    ];
                    return cols;
                },
                tableSort: function () {  //排序
                    var _this = this;
                    table.on('sort(lazada_acctperf_data_table)', function (obj) {
                        let data = serializeObject($('#lazada_acctperf_searchForm'));
                        let sortObj = lazadaAcctPerfsortList.filter(item => item.name == obj.field)
                            data.sortField = sortObj[0].value
                            data[obj.type] = 1
                        if(sortObj[0].value == '总罚分差值'){
                            data['sortByTotalPenaltyPoint'] = true
                        }else{
                            data['sortByTotalPenaltyPoint'] = false
                        }
                        _this.tableRender(data);
                    })
                },
                export: function () {
                    var _this = this;
                    $('#lazada_acctperf_exportBtn').on('click', function () {
                        var data = {};
                        data.salepersonId = $.trim($("#lazada_acctperf_searchForm select[name='salesman']").val());
                        data.storeId = $.trim($("#lazada_acctperf_searchForm select[name='store']").val());
                        _this.logExportLayer()
                    });
                },
                logExportLayer: function (data) {
                    var _this = this
                    layer.confirm('确认导出当前搜索条件账号表现？', { btn: ['确认', '取消'] }, function () {
                        submitForm(data, ctx + '/shopee/shopeeAccountPerformance/exportShopeeAccountPerformance.html')
                        layer.closeAll('dialog');//关闭选择框
                    });
                },
                suspensionDisplay: function (data) {
                    $("body").on('mouseover', `.lazada_${data}`, function () {
                        var content = "<pre>" + $(this).nextAll("pre").text() + "</pre>";
                        var color = 'green';
                        if (content.indexOf("超出指标") != -1) {
                            color = 'red';
                        }
                        layer.tips(content, $(this), {
                            tips: [2, color],
                            time: 0
                        });
                    });
                    $("body").on('mouseout', `.lazada_${data}`, function () {
                        layer.closeAll('tips');
                    });
                },
                supervisorAjax: function () {
                    return commonReturnPromise({
                        url: ctx + '/lazadaAccountPerformance/getLazadaSupervisor'
                    })
                },
                // 获取lazada站点的接口
                getDataAccperformanceGetAllSite() {
                    return commonReturnPromise({
                        url: `/lms/onlineProductLazada/getAllSite.html`,
                        type: 'GET',
                    })
                }
            }
            // 初始化站点
            lazadaAccPerformanceName.getDataAccperformanceGetAllSite().then(function (result) {
                commonRenderSelect("accperformanceSalesSite", result, {
                    name: 'name',
                    code: 'code'
                }).then(() => form.render("accperformanceSalesSite"))
            }).catch(err=>layer.msg(err, {icon: 2}))
            
            // 初始化主管
            lazadaAccPerformanceName.initisupervisor()
            //导出功能
            lazadaAccPerformanceName.export();

            $("#lazada_acctperf_search").click(function () {
                let data = serializeObject($('#lazada_acctperf_searchForm'))
                lazadaAccPerformanceName.tableRender(data)
            })

            // tab监听
            lazadaAccPerformanceName.tabMonitor()

            // // 悬浮 lazada_nonCompliancePoints
            // lazadaAccPerformanceName.suspensionDisplay('nonCompliancePoints')

            // // 悬浮 lazada_cancellationRate
            // lazadaAccPerformanceName.suspensionDisplay('cancellationRate')

            // // 悬浮 lazada_shipOnTime
            // lazadaAccPerformanceName.suspensionDisplay('shipOnTime')

            // // 悬浮 lazada_productRating
            // lazadaAccPerformanceName.suspensionDisplay('productRating')

            // // 悬浮 lazada_positiveSeller
            // lazadaAccPerformanceName.suspensionDisplay('positiveSeller')

            // // 悬浮 lazada_chatSameDayResponseRate
            // lazadaAccPerformanceName.suspensionDisplay('chatSameDayResponseRate')

            // // 悬浮 lazada_chatResponseTime
            // lazadaAccPerformanceName.suspensionDisplay('chatResponseTime')

            // // 悬浮 lazada_returnRate
            // lazadaAccPerformanceName.suspensionDisplay('returnRate')

            // // 悬浮 lazada_basketSize
            // lazadaAccPerformanceName.suspensionDisplay('basketSize')
        });
    })(jQuery, layui, window, document);