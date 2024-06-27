(function($, layui, echarts, window, document, undefined) {
    layui.use(
        [
            'admin',
            'table',
            'form',
            'element',
            'layer',
            'laytpl',
            'formSelects',
            'laydate',
            'selectInput',
        ],
        function() {
            var admin = layui.admin,
                table = layui.table,
                element = layui.element,
                layer = layui.layer,
                laytpl = layui.laytpl,
                laydate = layui.laydate,
                selectInput = layui.selectInput,
                formSelects = layui.formSelects,
                form = layui.form;
            form.render('select');
            //命名空间
            var pbproductshowName = {
                //数据处理
                dataHandle: function(data) {
                    //刊登时间
                    if (data.listingTimes) {
                        var timeArr = data.listingTimes.split(" - ");
                        data.startListingTime = new Date(timeArr[0]).getTime();
                        data.endListingTime = new Date(timeArr[1]).getTime();
                    } else {
                        data.startListingTime = "";
                        data.endListingTime = "";
                    }
                    delete data.listingTimes;
                    //统计时间
                    if (data.analysisTimes) {
                        var timeArr = data.analysisTimes.split(" - ");
                        data.startAnalysisTime = new Date(timeArr[0]).getTime();
                        data.endAnalysisTime = new Date(timeArr[1]).getTime();
                    } else {
                        data.startAnalysisTime = "";
                        data.endAnalysisTime = "";
                    }
                    delete data.analysisTimes;
                    //物流属性
                    data.logisAttr = data.logisAttr ? data.logisAttr.split(',') : [];
                    //店铺
                    data.storeAcctIds = data.storeAcctIds ? data.storeAcctIds.split(',') : [];
                    //搜索类型和内容
                    if (data.type == 'listingStoreSubId') {
                        data.listingStoreSubId = data.content;
                    } else if (data.type == 'cnTitle') {
                        data.cnTitle = data.content;
                    } else if (data.type == 'pSkus') {
                        data.pSkus = data.content;
                    } else if (data.type == 'storePSku') {
                        data.storePSku = data.content;
                    }
                    return data;
                },
                //渲染时间
                renderTime: function() {
                    laydate.render({
                        elem: "#pbproductshow_listingTime",
                        type: "date",
                        range: true,
                    });
                    var nowdate = Date.now();
                    var endTime = Format(nowdate, 'yyyy-MM-dd');
                    var startTime = Format((nowdate - 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd');
                    var timeVal = startTime + ' - ' + endTime;
                    laydate.render({
                        elem: "#pbproductshow_AnalysisTime",
                        type: "date",
                        range: true,
                        value: timeVal
                    });
                },
                //渲染select
                renderSelect: function() {
                    //渲染商品标签(单选)
                    this.tagAjax().then(res => {
                        commonRenderSelect('pbproductshow_prodAttrList', res, {
                            name: 'name',
                            code: 'name'
                        }).then(() => {
                            form.render('select');
                        })
                    });
                    //渲染物流属性(多选)
                    this.logisAjax().then(res => {
                        commonRenderSelect('pbproductshow_logisticsAttrStr', res, {
                            name: 'name',
                            code: 'name'
                        }).then(() => {
                            formSelects.render('pbproductshow_logisticsAttrStr');
                        })
                    })
                },
                //渲染表格
                tableRender: function(data) {
                    var _this = this;
                    table.render({
                        elem: "#pbproductshow_table",
                        id: "pbproductshow_tableId",
                        method: "POST",
                        contentType: 'application/json',
                        where: data,
                        url: " /lms/wishPbV3/queryProductionPeformancePage.html",
                        cols: _this.colsHandle(),
                        page: true,
                        limit: 300,
                        limits: [300, 500, 1000],
                        done: function() {
                            imageLazyload();
                            _this.watchBar();
                        },
                    });
                },
                colsHandle: function() {
                    var cols = [
                        [{
                                title: "图片",
                                templet: "#pbproductshow_img",
                                field: "img",
                            },
                            {
                                title: "标题",
                                field: "title",
                                templet: "#pbproductshow_title",
                                width: 350,
                            },
                            {
                                title: "店铺/销售",
                                field: "store",
                                templet: "#pbproductshow_store",
                            },
                            {
                                title: "产品",
                                field: "product",
                                templet: "#pbproductshow_product",
                            },
                            {
                                title: "参加活动次数",
                                field: "nums",
                            },
                            {
                                title: "总花费￥",
                                field: "cost",
                                templet: "#pbproductshow_cost",
                            },
                            {
                                title: "总订单",
                                field: "orderNum",
                            },
                            {
                                title: "总流量",
                                field: "flow",
                            },
                            {
                                title: "最近活动状态",
                                field: "currentCampaignState",
                            },
                            {
                                title: "时间",
                                field: "time",
                                templet: "#pbproductshow_time",
                            },
                            {
                                title: "操作",
                                field: "handleBar",
                                templet: "#pbproductshow_toolbar",
                                width: 135,
                            },
                        ]
                    ];
                    return cols;
                },
                watchBar: function() {
                    var _this = this;
                    table.on("tool(pbproductshow_tableFilter)", function(obj) {
                        var layEvent = obj.event; //获得 lay-event 对应的值
                        var data = obj.data;
                        if (layEvent == "detail") {
                            _this.detailLayer(data.promotionInfoList);
                        } else if (layEvent == "export") {
                            _this.singleExport(data.listingStoreSubId);
                        }
                    });
                },
                //商品标签接口
                tagAjax: function() {
                    return commonReturnPromise({
                        url: '/lms/product/getProdTags.html',
                    });
                },
                //物流属性接口
                logisAjax: function() {
                    return commonReturnPromise({
                        url: '/lms/sys/listlogisattr.html'
                    })
                },
                //单个导出功能
                singleExport: function(id) {
                    transBlob({
                            url: '/lms/wishPbV3/exportProductionCampaignDetail',
                            formData: `listingStoreSubId=${id}`,
                            contentType: 'application/x-www-form-urlencoded',
                            fileName: `商品${Date.now()}`,
                        })
                        .then(function(result) {
                            loading.hide();
                            console.log(result);
                        })
                        .catch(function(err) {
                            layer.msg(err.message, { icon: 2 });
                        });
                },
                //导出功能
                export: function() {
                    var _this = this;
                    $('#pbproductshow_batchSubmit').on('click', function() {
                        var formData = $('#pbproductshowForm').serializeObject();
                        var data = _this.dataHandle(formData);
                        if (!data.startAnalysisTime) {
                            return layer.msg('统计时间必选', { icon: 7 });
                        }
                        transBlob({
                                url: '/lms/wishPbV3/exportProductionPeformance',
                                formData: JSON.stringify(data),
                                contentType: 'application/json',
                                fileName: `产品表现${Date.now()}`,
                            })
                            .then(function(result) {
                                loading.hide();
                                console.log(result);
                            })
                            .catch(function(err) {
                                layer.msg(err.message, { icon: 2 });
                            });
                    });
                },
                //详情弹框
                detailLayer: function(promotionInfoList) {
                    if (!promotionInfoList.length) {
                        return layer.msg('查看详情必须有活动ID', { icon: 2 });
                    }
                    var _this = this;
                    layer.open({
                        type: 1,
                        title: '详情',
                        area: ['80%', '90%'],
                        content: $('#pbproductshow_layerEcharts').html(),
                        success: function(layero) {
                            var promotionIds = promotionInfoList.map(item => item.promotion_id);
                            //渲染select
                            commonRenderSelect('pbproductshow_layerEcharts_id', promotionIds, {
                                selected: promotionIds[0],
                                str: ''
                            }).then(() => {
                                form.render();
                            })

                            var idDom = layero.find('#pbproductshow_echartsContainer')[0];
                            //渲染时间
                            _this.echartTime(promotionInfoList[0], idDom);
                            //默认执行一次echart渲染
                            _this.echartsHandle(promotionInfoList, idDom);
                            //切换select活动id时重新渲染图表
                            _this.watchEchart(promotionInfoList, idDom);
                        }
                    })
                },
                //渲染echart时间
                echartTime: function(data, idDom) {
                    var _this = this;
                    laydate.render({
                        elem: "#pbproductshow_layerEcharts_times",
                        type: "date",
                        range: true,
                        value: `${data['start_time']} - ${data['expected_end_time']}`,
                        done: function(value) {
                            if (!value) {
                                return layer.msg('日期不能为空,请选择', { icon: 2 });
                            } else {
                                _this.echartTimeChange(value, data, idDom);
                            }
                        }
                    });
                },
                //echart配置
                echartRender: function(idDom, res) {
                    // 基于准备好的dom，初始化echarts实例
                    var myChart = echarts.init(idDom);
                    var opts = this.echartConfig(res);
                    // 使用刚指定的配置项和数据显示图表。
                    myChart.setOption(opts);
                },
                //echart_config
                echartConfig: function(res) {
                    //数据分类
                    // 时间数组
                    var timeArr = res.map(item => {
                        return Format(item.analysisTime, 'yyyy-MM-dd');
                    });
                    //费用数组
                    var costArr = res.map(item => item.cost);
                    //成交额数组
                    var amtArr = res.map(item => item.orderTotalAmt);
                    //总流量数组
                    var flowArr = res.map(item => item.flow);
                    //订单数组
                    var orderArr = res.map(item => item.orderNum);
                    //花费成交比数组
                    var rateArr = res.map(item => item.costAmountRate);
                    // 指定图表的配置项和数据
                    var option = {
                        tooltip: {
                            trigger: 'axis'
                        },
                        legend: {
                            data: ['费用', '成交额', '总流量', '订单', '花费成交比']
                        },
                        grid: {
                            left: '3%',
                            right: '4%',
                            bottom: '3%',
                            containLabel: true
                        },
                        toolbox: {
                            feature: {
                                saveAsImage: {}
                            }
                        },
                        xAxis: {
                            type: 'category',
                            boundaryGap: false,
                            data: timeArr
                        },
                        yAxis: {
                            type: 'value'
                        },
                        series: [{
                                name: '费用',
                                type: 'line',
                                stack: '总量',
                                data: costArr
                            },
                            {
                                name: '成交额',
                                type: 'line',
                                stack: '总量',
                                data: amtArr
                            },
                            {
                                name: '总流量',
                                type: 'line',
                                stack: '总量',
                                data: flowArr
                            },
                            {
                                name: '订单',
                                type: 'line',
                                stack: '总量',
                                data: orderArr
                            },
                            {
                                name: '花费成交比',
                                type: 'line',
                                stack: '总量',
                                data: rateArr
                            }
                        ]
                    };
                    return option;
                },
                //echart-接口ajax
                echartsAjax: function(obj) {
                    return commonReturnPromise({
                        url: '/lms/wishPbV3/listProductionDailyPerformance',
                        params: obj
                    });
                },
                //echart数据处理
                echartsHandle: function(promotionInfoList, idDom) {
                    var firstData = promotionInfoList[0];
                    var _this = this;
                    this.echartsAjax({
                        campaignId: firstData.promotion_id,
                        endAnalysisTime: new Date(firstData.expected_end_time).getTime(),
                        productId: firstData.listing_store_sub_id,
                        startAnalysisTime: new Date(firstData.start_time).getTime()
                    }).then(res => {
                        //进行数据转换配置
                        _this.echartRender(idDom, res);
                    }).catch(err => {
                        layer.msg(err.message, { icon: 2 });
                    })
                },
                //监听echart弹框select变化,更新图表
                watchEchart: function(promotionInfoList, idDom) {
                    var _this = this;
                    form.on('select(pbproductshow_echartSelectFilter)', function(obj) {
                        var promotion_id = obj.value;
                        var data = promotionInfoList.filter(item => item.promotion_id == promotion_id);
                        //渲染时间
                        var obj = data[0];
                        _this.echartTime(obj, idDom);
                        _this.echartsAjax({
                            campaignId: obj.promotion_id,
                            endAnalysisTime: new Date(obj.expected_end_time).getTime(),
                            productId: obj.listing_store_sub_id,
                            startAnalysisTime: new Date(obj.start_time).getTime()
                        }).then(res => {
                            //进行数据转换配置
                            _this.echartRender(idDom, res);
                        }).catch(err => {
                            layer.msg(err.message, { icon: 2 });
                        })
                    });
                },
                //监听时间变化更新图表
                echartTimeChange: function(value, data, idDom) {
                    var _this = this;
                    var timeArr = value.split(" - ");
                    var startAnalysisTime = new Date(timeArr[0]).getTime();
                    var endAnalysisTime = new Date(timeArr[1]).getTime();
                    var campaignId = $('#pbproductshow_layerEcharts_id').val();
                    var obj = {
                        startAnalysisTime: startAnalysisTime,
                        endAnalysisTime: endAnalysisTime,
                        campaignId: campaignId,
                        productId: data.listing_store_sub_id,
                    };
                    this.echartsAjax(obj).then(res => {
                        //进行数据转换配置
                        _this.echartRender(idDom, res);
                    }).catch(err => {
                        layer.msg(err.message, { icon: 2 });
                    })
                }
            };
            //渲染部门销售员店铺三级联动
            render_hp_orgs_users("#pbproductshowForm");
            //渲染select
            pbproductshowName.renderSelect();
            //渲染时间
            pbproductshowName.renderTime();
            //导出功能
            pbproductshowName.export();
            //表单提交事件
            form.on("submit(pbproductshow_filter)", function(data) {
                var data = data.field; //获取到表单提交对象
                var obj = pbproductshowName.dataHandle(data);
                pbproductshowName.tableRender(obj);
            });
        }
    );
})(jQuery, layui, echarts, window, document);