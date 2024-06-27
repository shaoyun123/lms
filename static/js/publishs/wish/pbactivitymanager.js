var wishpbActivTimestamp = null;
(function ($, layui, echarts, window, document, undefined) {
    layui.use(['admin', 'form', 'table', 'layer', 'laytpl', 'laydate', 'formSelects'], function () {
        var $ = layui.$,
            layer = layui.layer,
            laydate = layui.laydate,
            table = layui.table,
            form = layui.form,
            formSelects = layui.formSelects,
            laytpl = layui.laytpl;
        form.render();
        render_hp_orgs_users("#wishpb_activity_searchForm");

        laydate.render({
            elem: '#wishpbActiv_listTime',
            range: true,
        })
        laydate.render({
            elem: '#wishpbActiv_activityStartTime',
            range: true,
        })
        laydate.render({
            elem: '#wishpbActiv_activityEndTime',
            range: true,
        })

        //wish  onlineproduct 跳转当前页面 获取缓存数据，打开创建PB活动弹窗 
        fbaDeliveryCache = window.localStorage["wishOnlineproductPB"];

        if (fbaDeliveryCache) {
            //取到值之后清空缓存
            delete window.localStorage["wishOnlineproductPB"];
            let obj = JSON.parse(fbaDeliveryCache);
            wishpbActivEdit(obj, 2)
        }

        // 商品标签
        getProdTag()
        //物流属性
        getlistlogisattr()

        function getProdTag() {
            commonReturnPromise({
                url: ctx + '/product/getProdTags.html',
                type: 'post'
            }).then(data => {
                commonRenderSelect('wishpbactivity_goodstag', data, { name: 'name', code: 'name' })
            }).then(
                () => form.render()
            ).catch(err => layer.msg(err || err.message, { icon: 2 }))
        }

        function getlistlogisattr() {
            commonReturnPromise({
                url: ctx + '/sys/listlogisattr.html',
                type: 'post'
            }).then(data => {
                commonRenderSelect('wishpbactivity_logisAttr', data, { name: 'name', code: 'value' })
                formSelects.render()
            }).catch(err => layer.catch(err || err.message, { icon: 2 }))
        }

        //清空
        $("#wishpb_activity_reset").click(function () {
            $("#wishpb_activity_searchForm")[0].reset();
        })

        // 搜索
        form.on('submit(wishpb_activity_search)', function (data) {
            var field = wishpbActivGetFormData()
            var getTpl = wishpb_activ_batchSet_option.innerHTML
            var view = document.getElementById('wishpb_activity_batchSet')
            laytpl(getTpl).render(data.field, function (html) {
                view.innerHTML = html
            })
            form.render()
            tableRender(field)
        })

        //表格渲染结果
        //展示已知数据
        function tableRender(obj) {
            table.render({
                elem: "#wishpbActivTable",
                id: "wishpbActiv_Table",
                method: "post",
                contentType: "application/json",
                url: ctx + '/wishPbV3/queryActivityPage.html', // 数据接口
                where: obj,
                page: true,
                limits: [50, 100, 150], // 每页条数的选择项
                limit: 50,
                cols: [
                    [{
                        type: 'checkbox'
                    },
                    {
                        field: "image",
                        title: "图片",
                        templet: "#wishpbActiv_Table_imageTpl",
                        width: '6%'
                    }, {
                        field: "alltitle",
                        title: "标题",
                        // width: '8%',
                        templet: '<div><div><span style="color:#999">标题：</span>{{d.title || ""}}</div><div><span style="color:#999">名称：</span>{{d.cnTitle || ""}}</div></div>'
                    }, {
                        field: "storeseller",
                        title: "店铺名/销售员",
                        width: '5%',
                        templet: '<div><div>{{d.storeAcctName || ""}}</div><div>{{d.seller || ""}}</div></div>'
                    }, {
                        field: "activityInfo",
                        title: "活动名称/活动ID",
                        templet: '#wishpbActiv_Table_activityTpl',
                        width: '11%'
                    }, {
                        field: "productInfo",
                        title: "产品名称",
                        width: '12%',
                        templet: `<div><div><span style="color:#999">产品ID：</span>{{d.listingStoreSubId || ""}}</div><div><span style="color:#999">商品SKU：</span>{{d.prodPSku || ""}}</div><div><span style="color:#999">店铺SKU：</span>{{d.storePSku || ""}}</div></div>`
                    }, {
                        field: "budgetInfo",
                        title: "预算",
                        width: '5%',
                        templet: `<div><div data-attr='budgetInfo'>{{d.budget }}</div><div class="{{d.state=='ENDED'||d.state=='CANCELLED'?'hidden':''}}"><i class="layui-icon layui-icon-edit" style="color: #009688;cursor: pointer;" lay-event="budget"></i></div></div>`
                    }, {
                        field: "cost",
                        title: "花费",
                        width: '7%',
                        templet: `<div><div>花费：{{d.cost}}</div><div>PB销售额：{{d.orderTotalAmt || "0"}}</div></div>`
                    }, {
                        field: "orderNum",
                        title: "订单",
                        width: '7%',
                        templet: `<div><div>PB订单量：{{d.orderNum || "0"}}</div></div>`
                    }, {
                        field: "pvInfo",
                        title: "流量",
                        width: '7%',
                        templet: '<div><div>流量：{{d.flow || 0}}</div><div class="fRed">1000pv订单：{{d .pvOrderNum1000 || 0}}</div><div class="fRed">1000pv销售额：{{d.pvOrderTotalAmt1000 || 0}}</div></div>'
                    }, {
                        field: "orderTotalAmt",
                        title: "状态类型",
                        width: '5%',
                        templet: '#wishpbAcitiv_statusTpl'
                    }, {
                        field: "proportion",
                        title: "时间",
                        templet: '#wishpbAcitiv_timeTpl',
                        width: '7%'
                    }, {
                        field: "activityStatus",
                        title: "备注",
                        templet: '<div><div data-attr=status>{{d.activityType || ""}}</div><div><i class="layui-icon layui-icon-edit" style="color: #009688;cursor: pointer;" lay-event="note"></i></div></div>',
                        width: '6%'
                    }, {
                        field: "experience7",
                        title: "操作",
                        toolbar: '#wishpbAcitiv_barDemo',
                        width: '5%'
                    },
                    ],
                ],
                done: function () {
                    imageLazyload();
                }
            });
        }

        // 批量设置
        form.on('select(wishpb_activity_batchSet)', function (data) {
            var chooseRows = layui.table.checkStatus('wishpbActiv_Table').data
            if (!chooseRows.length && data.value != '') return layer.msg('至少选中一条数据')
            switch (data.value) {
                case "0":  //设置预算
                    wishpbActivSetBudget(chooseRows)
                    break;
                case "1": //停止
                    wishpbActivStop(chooseRows)
                    break;
                case "2":    //设置为连续活动
                    wishpbActivSetStatus(chooseRows, true)
                    break;
                case "3":    //设置为单次活动
                    wishpbActivSetStatus(chooseRows, false)
                    break;
                case "4":    //设置结束时间
                    wishpbActivSetEndtime(chooseRows)
                    break;
                case "5":    //添加备注
                    wishpbActivAddNote(chooseRows)
                    break;
                default:
                    break;
            }
        })

        // 同步
        form.on('select(wishpb_activity_sync)', function (obj) {
            var chooseRows = layui.table.checkStatus('wishpbActiv_Table').data
            if (!chooseRows.length && obj.value != '') return layer.msg('至少选中一条数据')
            switch (obj.value) {
                case "0": //同步选中
                    wishpbActivSyncChoosed(chooseRows)
                    break;
                default:
                    break;
            }
        })

        // 按钮
        table.on("tool(wishpb_activ_table)", function (obj) {
            var _arr = [].concat(obj.data)
            switch (obj.event) {
                case 'start':
                    wishpbActivWishStart(obj.data)
                    break;
                case 'edit':
                    wishpbActivEdit(obj.data, 3)
                    break;
                case 'copy':
                    wishpbActivCopyActiv(obj.data)
                    break;
                // case 'addBudget':
                //     wishpbActivAddBudget(_arr)
                //     break;
                case 'stop':
                    wishpbActivStop(_arr)
                    break;
                case 'wishstop':
                    wishpbActivWishStop(obj.data)
                    break;
                case 'note':
                    wishpbActivAddNote(_arr, obj.tr)
                    break;
                case 'budget':
                    wishpbActivSetBudget(_arr, obj.tr)
                    break;
                case 'justView':
                    wishpbActivJustView(obj.data)
                    break;
                case 'viewLog':   //查看日志
                    wishpbActivViewLog(obj.data)
                    break;
                case 'table':
                    wishpbActivEveryPerform(obj.data)
                    break;
            }
        })

        //wish推荐 开启
        function wishpbActivWishStart(obj) {
            commonReturnPromise({
                url: ctx + `/wishPbV3/updateCampaignState/${obj.promotionId}?storeAcctId=${obj.storeAcctId}&automatedCampaign=${obj.automatedCampaign}&state=NEW`,
                type: 'put',
                contentType: 'application/json'
            }).then(() => {
                layer.msg('开启成功', { icon: 1 })
                $("#wishpb_activity_submit").click()
            }).catch(err => layer.msg(err || err.message, { icon: 2 }))
        }

        //wish推荐 停止
        function wishpbActivWishStop(obj) {
            commonReturnPromise({
                url: ctx + `/wishPbV3/updateCampaignState/${obj.promotionId}?storeAcctId=${obj.storeAcctId}&automatedCampaign=${obj.automatedCampaign}&state=CANCELLED`,
                type: 'put',
                contentType: 'application/json'
            }).then(() => {
                layer.msg('操作成功', { icon: 1 })
                $("#wishpb_activity_submit").click()
            }).catch(err => layer.msg(err || err.message, { icon: 2 }))
        }

        //设置预算
        function wishpbActivSetBudget(arr, trDom = '') {
            layer.open({
                type: 1,
                title: '设置预算',
                btn: ['保存', '取消'],
                area: ['400px', '200px'],
                content: '<div class="disflex" style="padding:20px;align-items:center"><div class="mr10 w40">预算</div><input class="layui-input" type="number" min="0"/></div>',
                yes: function (index, layero) {
                    var budget = $(layero).find('input').val()
                    //处理已停止、已结束、已取消的不进行预算的设置
                    if (!budget) return layer.msg('请填写预算值')
                    if (arr.filter(item => item.state == 'ENDED' || item.state == 'CANCELLED').length > 0) return layer.msg('该状态下不允许设置预算')
                    if (budget < 0 || budget == 0) return layer.msg('预算不能小于0')
                    var _params = arr.map(item => ({
                        budget: budget,
                        currencyCode: item.currencyCode,
                        id: item.id,
                        promotionId: item.promotionId,
                        storeAcctId: item.storeAcctId,
                    }))

                    commonReturnPromise({
                        url: ctx + '/wishPbV3/updateSelectedCampaignsBudget',
                        params: JSON.stringify(_params),
                        type: 'post',
                        contentType: 'application/json'
                    }).then(data => {
                        layer.close(index)
                        wishpbActivViewTaskProgress(data)
                    }).catch(err => layer.msg(err || err.message, { icon: 2 }))
                }
            })
        }

        //停止
        function wishpbActivStop(arr) {
            //state值为STARTED,NEW,PENDING时才可以停止
            if (arr.filter(item => (item.state == 'STARTED' || item.state == 'NEW' || item.state == 'PENDING')).length != arr.length) return layer.msg('该状态下不允许批量设置停止')
            //wish推荐
            var wishArr = arr.filter(item => item.automatedCampaign)
            wishArr.length && wishArr.forEach(item => {
                wishpbActivWishStop(item)
            });
            //非wish推荐的
            var notWishArr = arr.filter(item => !item.automatedCampaign)
            if (notWishArr.length) {
                var _params = notWishArr.map(item => ({
                    state: item.state,
                    id: item.id,
                    promotionId: item.promotionId,
                    storeAcctId: item.storeAcctId,
                }))
                commonReturnPromise({
                    url: ctx + '/wishPbV3/stopSelectedCampaigns',
                    params: JSON.stringify(_params),
                    type: 'post',
                    contentType: 'application/json'
                }).then(data => {
                    wishpbActivViewTaskProgress(data)
                }).catch(err => layer.msg(err || err.message, { icon: 2 }))
            }
        }

        //设置为连续活动true,/设置为单次活动false
        function wishpbActivSetStatus(arr, status) {
            //处理已停止、已结束、已取消的不设置为连续活动或者单词活动
            if (arr.filter(item => item.state == 'ENDED' || item.state == 'CANCELLED').length > 0) return layer.msg('该状态下不允许设置活动状态')
            var _params = arr.map(item => ({
                isAutoRenew: status,
                id: item.id,
                promotionId: item.promotionId,
                storeAcctId: item.storeAcctId,
            }))
            commonReturnPromise({
                url: ctx + '/wishPbV3/updateSelectedCampaignsAutoRenew',
                params: JSON.stringify(_params),
                type: 'post',
                contentType: 'application/json'
            }).then(data => {
                wishpbActivViewTaskProgress(data)
            }).catch(err => layer.msg(err || err.message, { icon: 2 }))
        }

        //设置结束时间
        function wishpbActivSetEndtime(arr) {
            layer.open({
                type: 1,
                title: '设置结束时间',
                btn: ['保存', '取消'],
                area: ['400px', '200px'],
                content: '<div class="disflex" style="padding:20px;align-items:center"><div class="mr10 w90">结束时间</div><input class="layui-input" id="wishpbActiv_setEndtime"/></div>',
                success: function () {
                    laydate.render({
                        elem: '#wishpbActiv_setEndtime',
                        format: 'yyyy-MM-dd HH:mm:ss',
                        min: `${Format(Date.now(), 'yyyy-MM-dd')}`,
                        ready: function (date) {
                            //可以自定义时分秒
                            this.dateTime.hours = 7;
                            this.dateTime.minutes = '00';
                            this.dateTime.seconds = '00';
                        },
                    })
                },
                yes: function (index, layero) {
                    var endTime = new Date($(layero).find('input').val()).getTime()
                    var _params = arr.map(item => ({
                        endTime: endTime,
                        id: item.id,
                        promotionId: item.promotionId,
                        storeAcctId: item.storeAcctId,
                        budget: item.budget
                    }))
                    commonReturnPromise({
                        url: ctx + '/wishPbV3/updateSelectedCampaignsEndTime',
                        params: JSON.stringify(_params),
                        type: 'post',
                        contentType: 'application/json'
                    }).then(data => {
                        layer.close(index)
                        wishpbActivViewTaskProgress(data)
                    }).catch(err => layer.msg(err || err.message, { icon: 2 }))
                }
            })
        }

        //添加备注
        function wishpbActivAddNote(arr, trDom = '') {
            layer.open({
                type: 1,
                title: '修改备注(字数最多50)',
                area: ["500px", "300px"],
                btn: ["保存", "取消"],
                content: `<div style="padding:20px"><textarea class="layui-textarea" maxlength="50">${trDom ? trDom.find('td[data-field=activityStatus] div[data-attr=status]').html() : ''}</textarea></div>`,
                yes: function (index, layero) {
                    var noteNew = $(layero).find("textarea").val();
                    var _params = arr.map(item => ({
                        activityType: noteNew,
                        id: item.pbListingId,
                    }))
                    commonReturnPromise({
                        url: ctx + '/wishPbV3/updateSelectedCampaignsActivityType',
                        params: JSON.stringify(_params),
                        type: 'post',
                        contentType: 'application/json'
                    }).then(() => {
                        layer.close(index)
                        layer.msg('修改成功', { icon: 1 })
                        if (trDom) {
                            trDom.find('td[data-field=activityStatus] div[data-attr=status]').html(noteNew)
                        } else {
                            $("#wishpb_activity_submit").click()
                        }
                    }).catch(err => layer.msg(err || err.message, { icon: 2 }))
                }
            });
        }

        //同步活动选中
        function wishpbActivSyncChoosed(arr) {
            var _params = arr.map(item => ({
                promotionId: item.promotionId,
                storeAcctId: item.storeAcctId,
            }))
            commonReturnPromise({
                url: ctx + '/wishPbV3/syncSelectedCampaigns',
                params: JSON.stringify(_params),
                type: 'post',
                contentType: 'application/json'
            }).then(() => {
                layer.msg('同步成功', { icon: 1 })
                $("#wishpb_activity_submit").click()
            }).catch(err => layer.msg(err || err.message, { icon: 2 }))
        }

        // 追加预算
        // function wishpbActivAddBudget(arr) {
        //     layer.open({
        //         type: 1,
        //         title: '追加预算',
        //         btn: ['保存', '取消'],
        //         area: ['600px', '250px'],
        //         content: $("#wishpbAcitiv_addBudget").html(),
        //         success: function (index, layero) {
        //             form.render()
        //         },
        //         yes: function (index, layero) {
        //             var scheduledAddBudgetAmount = $('#wishpbAcitiv_addBudgetform').find('input[name=scheduledAddBudgetAmount]').val()
        //             var scheduledAddBudgetDays = Array.from($('#wishpbAcitiv_addBudgetform').find('input[name=scheduledAddBudgetDays]:checked')).map(item => $(item).val()).join(',')
        //             var _params = arr.map(item => ({
        //                 scheduledAddBudgetAmount,
        //                 scheduledAddBudgetDays,
        //                 id: item.id,
        //                 promotionId: item.promotionId,
        //                 storeAcctId: item.storeAcctId,
        //             }))
        //             commonReturnPromise({
        //                 url: ctx + '/wishPbV3/updateSelectedCampaignsMoreBudget',
        //                 params: JSON.stringify(_params),
        //                 type: 'post',
        //                 contentType: 'application/json'
        //             }).then(() => {
        //                 layer.close(index)
        //                 layer.msg('追加预算成功', { icon: 1 })
        //                 $("#wishpb_activity_submit").click()
        //             }).catch(err => layer.msg(err || err.message, { icon: 2 }))
        //         },
        //     })
        // }

        //复制
        function wishpbActivCopyActiv(obj) {
            var params = {}
            params.storeAcctId = obj.storeAcctId
            params.promotionName = obj.listingStoreSubId
            params.promotionId = obj.promotionId
            params.listingStoreSubId = obj.listingStoreSubId
            var tommrowTime = Format(Date.now() + 24 * 60 * 60 * 1000 * 2 - 54000000, 'yyyy-MM-dd') + ' 07:00:00'
            var sevenTime = Format(Date.now() + 24 * 60 * 60 * 1000 * 8 - 54000000, 'yyyy-MM-dd') + ' 07:00:00'
            params.startTime = new Date(tommrowTime).getTime()
            params.expectedEndTime = new Date(sevenTime).getTime()
            params.isAutoRenew = obj.isAutoRenew
            params.intenseBoost = obj.intenseBoost
            params.budget = obj.budget
            if (obj.scheduledAddBudgetDays) params.scheduledAddBudgetDays = obj.scheduledAddBudgetDays
            if (obj.scheduledAddBudgetAmount) params.scheduledAddBudgetAmount = obj.scheduledAddBudgetAmount

            params.prodPbListingWishList = [{
                keyword: obj.tag,
                listingStoreSubId: obj.listingStoreSubId,
                title: obj.title,
                image: obj.image
            }]
            delete params.obj

            wishpbActivEdit(params, 4)
        }

        //每日表现  表格
        function wishpbActivEveryPerform(obj) {
            var params = {}
            params.campaignId = obj.promotionId
            params.endAnalysisTime = obj.expectedEndTime
            params.productId = obj.listingStoreSubId
            params.startAnalysisTime = obj.startTime
            layui.layer.open({
                type: 1,
                title: '详情',
                area: ['80%', '90%'],
                content: $('#wishpbAcitiv_layerEcharts').html(),
                success: function (layero) {
                    //渲染select
                    $('#wishpbAcitiv_layerEcharts_id').val(obj.promotionName)
                    $('#wishpbAcitiv_layerEcharts_times').val(`${Format(obj.startTime, 'yyyy-MM-dd')} - ${Format(obj.expectedEndTime, 'yyyy-MM-dd')}`)

                    var idDom = layero.find('#wishpbAcitiv_echartsContainer')[0];
                    //渲染时间
                    // echartTime(promotionInfoList[0], idDom);
                    //默认执行一次echart渲染
                    echartsHandle(params, idDom);
                    //切换select活动id时重新渲染图表
                    // _this.watchEchart(promotionInfoList, idDom);
                }
            })
        }

        //echart-接口ajax
        function echartsAjax(obj) {
            return commonReturnPromise({
                url: '/lms/wishPbV3/listProductionDailyPerformance',
                params: obj
            });
        }
        //echart数据处理
        function echartsHandle(obj, idDom) {
            echartsAjax(obj).then(res => {
                //进行数据转换配置
                echartRender(idDom, res);
            }).catch(err => {
                layer.msg(err.message, { icon: 2 });
            })
        }

        //echart配置
        function echartRender(idDom, res) {
            // 基于准备好的dom，初始化echarts实例
            var myChart = echarts.init(idDom);
            var opts = echartConfig(res);
            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(opts);
        }
        //echart_config
        function echartConfig(res) {
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
        }

        //创建活动的预算
        form.on('switch(wishpbAcitiv_showBudgetInfo)', function (data) {
            if (data.elem.checked) {
                $('#wishpbAcitiv_addBudgetInfo').show()
            } else {
                $('#wishpbAcitiv_addBudgetInfo').hide()
            }
        })

        //当重新选择店铺时，促销商品清空，
        form.on('select(wishpbAcitiv_createActiv_store)', function (data) {
            $('#wishpb_activ_prodcut_table').find('tbody tr').remove()
        })

    })
})(jQuery, layui, echarts, window, document);

//获取搜索数据
function wishpbActivGetFormData() {
    var field = {}
    var formDom = $('#wishpb_activity_searchForm')
    field.salesPersonOrgId = formDom.find('select[name=orgId]').val()
    field.salesPersonId = formDom.find('select[name=sellerId]').val()
    field.storeAcctIdList = formDom.find('input[name=storeAcctIdList]').val() ? formDom.find('input[name=storeAcctIdList]').val().split(',') : []
    var listingTime = formDom.find('input[name=listingTime]').val()
    if (listingTime) {
        var listingTimes = listingTime.split(' - ')
        field.listingStartTime = new Date(listingTimes[0] + ' 00:00:00').getTime()
        field.listingEndTime = new Date(listingTimes[1] + ' 23:59:59').getTime()
    }
    var activityEndTime = formDom.find('input[name=activityEndTime]').val()
    if (activityEndTime) {
        var activityEndTimes = activityEndTime.split(' - ')
        field.activityEndTimeBegin = new Date(activityEndTimes[0] + ' 00:00:00').getTime()
        field.activityEndTimeEnd = new Date(activityEndTimes[1] + ' 23:59:59').getTime()
    }
    var activityStartTime = formDom.find('input[name=activityStartTime]').val()
    if (activityStartTime) {
        var activityStartTimes = activityStartTime.split(' - ')
        field.activityStartTimeBegin = new Date(activityStartTimes[0] + ' 00:00:00').getTime()
        field.activityStartTimeEnd = new Date(activityStartTimes[1] + ' 23:59:59').getTime()
    }
    field.minProportion = formDom.find('input[name=minProportion]').val() || ''
    field.maxProportion = formDom.find('input[name=maxProportion]').val() || ''
    field[formDom.find('select[name=searchType] option:selected').val()] = formDom.find('input[name=searchValue]').val() || ''
    field.prodAttrList = formDom.find('select[name=prodAttrList]').val() || ''
    field.logisAttr = formDom.find('input[name=logisAttr]').val() ? formDom.find('input[name=logisAttr]').val().split(',') : []
    field.logisAttrRelation = formDom.find('select[name=logisAttrRelation] option:selected').val() || ''
    field.state = formDom.find('input[name=state]:checked').val()
    field.intenseBoost = formDom.find('select[name=intenseBoost] option:selected').val() || ''
    field.orderByType = formDom.find('select[name=orderByType] option:selected').val()
    field.automatedCampaign = formDom.find('select[name=automatedCampaign] option:selected').val() || ''
    console.log('field :>> ', field);
    return field
}

//查看活动
function wishpbActivJustView(obj) {
    var layer = layui.layer,
        laytpl = layui.laytpl;
    layer.open({
        type: 1,
        title: '查看活动',
        content: '加载中...',
        area: ['100%', '100%'],
        success: function (layero) {
            //弹窗渲染
            commonReturnPromise({
                url: ctx + `/wishPbV3/listCampaignDetailByCampaignId/${obj.promotionId}`,
            }).then((res) => {
                res.obj = obj
                wishpbActivDetailTplRender(laytpl, $, res, layero);
            }).catch(err => layer.msg(err || err.message, { icon: 2 }))
        },
    })
}

// 查看日志
function wishpbActivViewLog(obj) {
    var layer = layui.layer,
        laytpl = layui.laytpl;
    layer.open({
        type: 1,
        title: '操作日志',
        content: '加载中...',
        area: ['80%', '80%'],
        success: function (layero) {
            //弹窗渲染
            commonReturnPromise({
                url: ctx + `/wishPbOperLog/listOperLogByPromotionIdAndProductId`,
                type: 'post',
                contentType: 'application/json',
                params: JSON.stringify({ promotionId: obj.promotionId })
            }).then(res => {
                laytpl($("#wishpb_activ_operation_log").html()).render(res, function (html) {
                    $(layero).find('.layui-layer-content').html(html);
                })
            }).catch(err => layer.msg(err || err.message, { icon: 2 }))
        },
    })

}

// 编辑、创建活动  type的值，如果
// 默认type为1(创建PB),type为2（wish在线商品跳转当前创建PB）,type为3(编辑按钮)，4复制
function wishpbActivEdit(obj = '', type = 1) {
    var layer = layui.layer,
        laytpl = layui.laytpl;
    layer.open({
        type: 1,
        title: type == 3 ? '编辑活动' : '创建活动',
        content: '加载中...',
        btn: ["保存", "取消"],
        area: ['100%', '100%'],
        success: function (layero) {
            //弹窗渲染
            if (type == 3) {
                commonReturnPromise({
                    url: ctx + `/wishPbV3/listCampaignDetailByCampaignId/${obj.promotionId}`,
                }).then((res) => {
                    let _res = {
                        ...res,
                        prodPbListingWishList: res.prodPbListingWishList.map(item => ({ ...item, promotionName: res.promotionName, promotionId: res.promotionId })),
                        obj: obj,
                        type: type,
                    }
                    wishpbActivDetailTplRender(laytpl, $, _res, layero);
                }).catch(err => layer.msg(err || err.message, { icon: 2 }))
            } else if (type == 1) {
                wishpbActivDetailTplRender(laytpl, $, { obj: '', type: type }, layero);
            } else if (type == 2) {
                commonReturnPromise({
                    url: ctx + '/wishPbV3/listProdSyncPWishByProductIds',
                    type: 'post',
                    params: JSON.stringify({ storeAcctId: obj[0].storeAcctId, listingStoreSubIdList: obj.map(item => item.promotionId) }),
                    contentType: "application/json",
                }).then(res => {
                    let _obj = {
                        expectedEndTime: obj[0].expectedEndTime,
                        isAutoRenew: obj[0].isAutoRenew,
                        startTime: obj[0].startTime,
                        storeAcctId: obj[0].storeAcctId,
                        obj: '',
                        type: type,
                        prodPbListingWishList: res.map((item) => ({
                            ...item,
                            keyword: item.tags,
                            keywordHotnessMap: item.keywordHotnessMap,
                            title: item.title,
                            storeProdPId: item.storeProdPId,
                            image: item.mainImage,
                            promotionId: item.storeProdPId,
                            promotionName: item.storeProdPId,
                        }))
                    }
                    wishpbActivDetailTplRender(laytpl, $, _obj, layero);
                }).catch(err => layer.msg(err || err.message, { icon: 2 }))
            } else if (type == 4) {
                let activtyObj = {
                    ...obj,
                    prodPbListingWishList: obj.prodPbListingWishList.map(item => ({
                        ...item,
                        promotionId: obj.promotionId,
                        promotionName: obj.promotionName,
                    })),
                    type: type,
                    obj: obj,
                }
                wishpbActivDetailTplRender(laytpl, $, activtyObj, layero);
            }
        },
        yes: function (index) {
            var params = {
                productList: []
            }
            var formDom = $('#wishpbAcitiv_createform')
            params.storeAcctId = formDom.find('select[name=storeAcctId] option:selected').val()
            if (!params.storeAcctId) return layer.msg('请选择店铺')
            params.startTime = new Date(formDom.find('input[name=activTimeStart]').val()).getTime()
            params.endTime = new Date(formDom.find('input[name=activTimeEnd]').val()).getTime()
            if (!params.startTime) return layer.msg('请选择活动开始时间')
            if (!params.endTime) return layer.msg('请选择活动结束时间')
            if ((params.endTime - params.startTime) / 86400000 > 28) return layer.msg('活动时间范围最多4周')
            params.isAutoRenew = formDom.find('input[name=isAutoRenew]').prop('checked')
            params.intenseBoost = formDom.find('input[name=intenseBoost]').prop('checked')
            params.budget = formDom.find('input[name=budget]').val()
            if (!params.budget) return layer.msg('请填写推广总预算')
            var mostCost = $('#wishpbAcitiv_createform').find('.most_amount_code').text()
            console.log('object :>> ', params);
            if (params.budget - mostCost > 0) return layer.msg('推广总预算不应超过花费的最大额度')
            var ontimeBudget = formDom.find('input[name=ontimeBudget]').prop('checked')
            if (ontimeBudget) {
                params.scheduledAddBudgetDays = Array.from(formDom.find('input[name=scheduledAddBudgetDays]:checked')).map(item => $(item).val()).join(',')
                params.scheduledAddBudgetAmount = formDom.find('input[name=scheduledAddBudgetAmount]').val()
                if (!params.scheduledAddBudgetDays) return layer.msg('请选择时间预设')
                if (!params.scheduledAddBudgetAmount) return layer.msg('请填写每次增加金额')
            }

            var trProduct = Array.from($('#wishpb_activ_prodcut_table tbody').find('tr'))
            if (!trProduct.length) return layer.msg('请添加促销产品')
            var _productList = trProduct.map(item => ({
                keywords: Array.from($(item).find('td div[name=keyword]')).map(keyItem => $(keyItem).attr('data-keyword')),
                product_id: $(item).find('td[name=storeProdPId]').attr('data-storeProdPId')
            }))
            params.productList = _productList.reduce((pre, cur) => {
                if (pre.filter(item => item.product_id == cur.product_id).length == 0) {
                    return pre.concat(cur)
                } else {
                    return pre
                }
            }, [])
            if (params.productList.length != _productList.length) return layer.msg('不支持多个相同的促销产品')
            //去重

            //活动名称
            var promotionList = trProduct.map(item => ({
                promotionName: $(item).find('td input[name=promotionName]').val(),
                promotionId: type==3?formDom.find('input[name=promotionId]').val():$(item).find('td input[name=promotionName]').attr('data-promotionId')
            }))
            if (promotionList.filter(item => !item.promotionName).length) return layer.msg('请输入活动名称')
            // type为1，创建活动允许同个活动名称与不同产品分别生成活动 ,,type为2,wish在线商品批量创建
            if (type == 1 || type == 2) {
                let _params = []
                params.productList.forEach((item, listIndex) => {
                    _params.push({ ...params, productList: [].concat(item), promotionName: promotionList[listIndex].promotionName })
                })
                commonReturnPromise({
                    url:ctx+'/wishPbV3/batchCreateProductBoostCampaign',
                    params: JSON.stringify(_params),
                    type: 'post',
                    contentType: 'application/json',
                }).then(() => {
                    layui.layer.close(index)
                    layer.msg('创建成功', { icon: 1 })
                    $("#wishpb_activity_submit").click()
                }).catch(err => layer.msg(err || err.message, { icon: 2 }))
            } else {
                if (params.productList.length > 1) return layer.msg('目前仅不支持多个促销产品')
                params.promotionName = promotionList[0].promotionName
                if (!params.promotionName) return layer.msg('请输入活动名称')
                if (type == 3) {
                    params.promotionId = promotionList[0].promotionId
                }
                commonReturnPromise({
                    url: type == 3 ? ctx + '/wishPbV3/updateCampaignInfo' : ctx + '/wishPbV3/createProductBoostCampaign',
                    params: JSON.stringify(params),
                    type: 'post',
                    contentType: 'application/json',
                }).then(() => {
                    layui.layer.close(index)
                    layer.msg('修改成功', { icon: 1 })
                    $("#wishpb_activity_submit").click()
                }).catch(err => layer.msg(err || err.message, { icon: 2 }))
            }
        }
    })
}

//导出
function wishpbActivExport() {
    var data = wishpbActivGetFormData()
    transBlob({
        url: '/lms/wishPbV3/exportActivity',
        formData: JSON.stringify(data),
        fileName: 'PB活动管理',
        contentType: 'application/json'
    }).then(function (result) {
        loading.hide();
    }).catch(function (err) {
        layer.msg(err, { icon: 2 });
    });
}

//售出量、收藏和关键词热度查询
function wishpbActivQueryInfo(laytpl, obj) {
    if (obj.prodPbListingWishList[0].keyword) {
        Promise.all([wishpbActivQuerySalesInfo(obj.prodPbListingWishList[0].listingStoreSubId), wishpbActivQueryKeywordInfo(obj.prodPbListingWishList[0].keyword)])
            .then(res => {
                var _prodPbListingWishList = obj.prodPbListingWishList.map(item => ({
                    ...item,
                    keywordHotnessMap: res[1],
                    wishes: res[0].wishes || '',
                    sales: res[0].sales || '',
                    promotionId: obj.promotionId,
                    promotionName: obj.promotionName,
                    disable: $('#wishpbAcitiv_createform input[name=storeProdPId]').next().hasClass('layui-btn-disabled')
                }))

                laytpl($('#wishpb_activ_prodcut_table_tr').html()).render(_prodPbListingWishList, function (trhtml) {
                    $('#wishpb_activ_prodcut_table').find('tbody').html(trhtml)
                    imageLazyload();
                })
                // 关键词
                $('.wishpb_activ_keyword').find('.ant-tag').on('mouseenter', function () {
                    var contentshow = $(this).next(".wishpb_activ_keyword_hot").text();
                    if (!!contentshow && contentshow != 'undefined') {
                        layer.tips(contentshow, $(this), {
                            tips: [2, 'red'],
                            area: ['100px', 'auto'],
                            time: 0,
                        });
                    }
                }).on('mouseleave', function () {
                    layer.closeAll("tips");
                });
            }).catch(err => layer.msg(err || err.message, { icon: 2 }))
    } else {
        wishpbActivQuerySalesInfo(obj.prodPbListingWishList[0].listingStoreSubId)
            .then(res => {
                var _prodPbListingWishList = obj.prodPbListingWishList.map(item => ({
                    ...item,
                    wishes: res.wishes || '',
                    sales: res.sales || '',
                    promotionId: obj.promotionId,
                    promotionName: obj.promotionName,
                    disable: $('#wishpbAcitiv_createform input[name=storeProdPId]').next().hasClass('layui-btn-disabled')
                }))
                laytpl($('#wishpb_activ_prodcut_table_tr').html()).render(_prodPbListingWishList, function (trhtml) {
                    $('#wishpb_activ_prodcut_table').find('tbody').html(trhtml)
                    imageLazyload();
                })
            }).catch(err => layer.msg(err || err.message, { icon: 2 }))
    }
}

//售出量、收藏的查询
function wishpbActivQuerySalesInfo(storeProdPId) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            type: 'get',
            dataType: 'json',
            url: ctx + '/wishPbV3/getProdSyncInfoByProductId',
            contentType: "application/json",
            data: { storeProdPId: storeProdPId },  //商品Id
            success: function (res) {
                if (res.code == '0000') {
                    resolve(res.data || res.msg || '')
                } else {
                    reject(res.msg || '请求接口失败')
                }
            },
            error: function (err) {
                reject(err);
            }
        })
    })
}

//关键词的查询
function wishpbActivQueryKeywordInfo(keywordsList) {
    var storeAcctId = $("#wishpbAcitiv_createform select[name=storeAcctId] option:selected").val()
    return new Promise(function (resolve, reject) {
        $.ajax({
            type: 'post',
            dataType: 'json',
            url: ctx + '/wishPbV3/getKeyWordsHotness',
            contentType: "application/json",
            data: JSON.stringify({ storeAcctId: storeAcctId, keywordsList: keywordsList.split(',') }),  //商品Id
            success: function (res) {
                if (res.code == '0000') {
                    resolve(res.data || res.msg)
                } else {
                    reject(res.msg || '请求接口失败')
                }
            },
            error: function (err) {
                reject(err);
            }
        })
    })
}


// 弹窗渲染
function wishpbActivDetailTplRender(laytpl, $, obj, layero) {
    var $ = layui.$,
        laydate = layui.laydate,
        form = layui.form;
    commonReturnPromise({
        url: ctx + '/sys/listStoreForRenderHpStoreCommonComponent.html',
        params: {
            roleNames: 'wish专员',
            orgId: $('#wishpb_activity_searchForm select[name=orgId] option:selected').val(),
            salePersonId: $('#wishpb_activity_searchForm select[name=sellerId] option:selected').val(),
            platCode: 'wish',
        },
    }).then(data => {
        laytpl($("#wishpbAcitiv_createActivModal").html()).render(obj, function (html) {
            $(layero).find('.layui-layer-content').html(html);
            if (obj.obj.state == 'NEW' || obj.type == 2 || obj.type == 1 || obj.type == 4) {
                laydate.render({
                    elem: '#wishpbAcitiv_setActivTimeS',
                    format: 'yyyy-MM-dd HH:mm:ss',
                    min: `${Format(Date.now() + 1000 * 24 * 60 * 60 * 2 - 54000000, 'yyyy-MM-dd')}`,
                    max: `${Format(Date.now() + 1000 * 24 * 60 * 60 * 29 - 54000000, 'yyyy-MM-dd')}`,
                    value: obj.startTime ? `${Format(obj.startTime, 'yyyy-MM-dd 07:00:00')}` : `${Format(Date.now() + 1000 * 24 * 60 * 60 * 2 - 54000000, 'yyyy-MM-dd 07:00:00')}`,
                    ready: function (date) {
                        //可以自定义时分秒
                        this.dateTime.hours = 7;
                        this.dateTime.minutes = '00';
                        this.dateTime.seconds = '00';
                    },
                    done: function (value, date, endDate) {
                        $("#wishpbAcitiv_setActivTimeE").remove()
                        $('#wishpbAcitiv_setActivTimeS').after('<input name="activTimeEnd" class="layui-input w300" id="wishpbAcitiv_setActivTimeE"/>')
                        wishpbActivTimeEndWithS()
                    },
                })
                wishpbActivTimeEndWithS(obj)
            } else {
                $('#wishpbAcitiv_setActivTimeS').val(`${Format(obj.startTime, 'yyyy-MM-dd 07:00:00')}`)
                $('#wishpbAcitiv_setActivTimeE').val(`${Format(obj.expectedEndTime, 'yyyy-MM-dd 07:00:00')}`)
            }
            commonRenderSelect('wishpbAcitiv_createActiv_store', data, { name: 'storeAcct', code: 'id', selected: obj.storeAcctId || '' })
                .then(() => form.render())
        })
        if (obj.prodPbListingWishList) {
            var _prodPbListingWishList = obj.prodPbListingWishList.map(item => ({
                ...item,
                disable: $('#wishpbAcitiv_createform input[name=storeProdPId]').next().hasClass('layui-btn-disabled')
            }))
            laytpl($('#wishpb_activ_prodcut_table_tr').html()).render(_prodPbListingWishList, function (trhtml) {
                $('#wishpb_activ_prodcut_table').find('tbody').html(trhtml)
                imageLazyload();
            })
            if (obj.type != 2) {
                wishpbActivQueryInfo(laytpl, obj)
            }
        }
        if (obj.type != 1) {
            // 最大值
            wishpbActivRefreshMaxCost()
        }
        // 关键词
        $('.wishpb_activ_keyword').find('.ant-tag').on('mouseenter', function () {
            var contentshow = $(this).next(".wishpb_activ_keyword_hot").text();
            if (!!contentshow && contentshow != 'undefined') {
                layer.tips(contentshow, $(this), {
                    tips: [2, 'red'],
                    area: ['100px', 'auto'],
                    time: 0,
                });
            }
        }).on('mouseleave', function () {
            layer.closeAll("tips");
        });
    }).then(() => {
        form.render()
    }).catch(err => layer.msg(err || err.message, { icon: 2 }))
}

//弹窗的结束时间随着开始时间的联动
function wishpbActivTimeEndWithS(obj = '') {
    layui.laydate.render({
        elem: '#wishpbAcitiv_setActivTimeE',
        format: 'yyyy-MM-dd HH:mm:ss',
        min: `${Format(new Date($('#wishpbAcitiv_setActivTimeS').val()).getTime() + 1000 * 24 * 60 * 60, 'yyyy-MM-dd')}`,
        max: `${Format(new Date($('#wishpbAcitiv_setActivTimeS').val()).getTime() + 1000 * 24 * 60 * 60 * 28, 'yyyy-MM-dd')}`,
        value: obj.expectedEndTime ? `${Format(obj.expectedEndTime, 'yyyy-MM-dd 07:00:00')}` : "",
        ready: function (date) {
            //可以自定义时分秒
            this.dateTime.hours = 7;
            this.dateTime.minutes = '00';
            this.dateTime.seconds = '00';
        },
    })
}

//可花费最大额度
function wishpbActivRefreshMaxCost() {
    var storeAcctId = $("#wishpbAcitiv_createform select[name=storeAcctId] option:selected").val()
    if (!storeAcctId) return layui.layer.msg('请先选择店铺')
    commonReturnPromise({
        url: ctx + '/wishPbV3/getProductBoostTotalAvailableBudget',
        params: { storeAcctId },
    }).then(data => {
        $('#wishpbAcitiv_createform').find('.most_amount_code').text(data.amount || '')
        $('#wishpbAcitiv_createform').find('.most_currency_code').text(data.currency_code || '')
    }).catch(err => layer.msg(err || err.message, { icon: 2 }))
}

// 促销产品 添加产品
function wishpbActivhandleAddProd(dom) {
    if ($(dom).hasClass('layui-btn-disabled')) return
    var storeAcctId = $('#wishpbAcitiv_createform').find('select[name=storeAcctId] option:selected').val()
    var storeProdPId = $('#wishpbAcitiv_createform').find('input[name=storeProdPId]').val()
    if (!storeAcctId) return layui.layer.msg('请先选择店铺')
    if (!storeProdPId) return
    commonReturnPromise({
        url: ctx + '/wishPbV3/listProdSyncPWishByProductId',
        params: { storeAcctId: storeAcctId, storeProdPId: storeProdPId },
        contentType: "application/json",
    }).then(data => {
        data.keyword = data.tags
        data.disable = $('#wishpbAcitiv_createform input[name=storeProdPId]').next().hasClass('layui-btn-disabled')
        data.image = data.mainImage
        data.promotionId = storeProdPId
        var dataArr = [].concat(data)
        layui.laytpl($('#wishpb_activ_prodcut_table_tr').html()).render(dataArr, function (trhtml) {
            $('#wishpb_activ_prodcut_table').find('tbody').append(trhtml)
            imageLazyload();
        })
        // 关键词
        $('.wishpb_activ_keyword').find('.ant-tag').on('mouseenter', function () {
            var contentshow = $(this).next(".wishpb_activ_keyword_hot").text();
            if (!!contentshow && contentshow != 'undefined') {
                layui.layer.tips(contentshow, $(this), {
                    tips: [2, 'red'],
                    area: ['100px', 'auto'],
                    time: 0,
                });
            }
        }).on('mouseleave', function () {
            layui.layer.closeAll("tips");
        });
    }).catch(err => layui.layer.msg(err || err.message, { icon: 2 }))
}

//促销产品 移除行
function wishpbActivRemoveTr(dom) {
    if ($(dom).hasClass('layui-btn-disabled')) return
    $(dom).parents('tr').remove()
}

// 促销产品 移除关键词
function wishpbActivDelKeyword(dom) {
    $(dom).parents('.wishpb_activ_keyword').remove()
}

//促销产品 添加关键词的触发输入框
function wishpbActivAddKeyword(dom) {
    $(dom).hide()
    $(dom).next('input').show()
}

//促销产品 添加关键词 enter键时才会把input的数据添加进去
function wishpbActivAddKeywordEnter(event, dom) {
    var storeAcctId = $('#wishpbAcitiv_createform select[name=storeAcctId] option:selected').val()
    var keywordsList = [$(dom).val()]
    if (event.keyCode == 13 && $(dom).val()) {
        layui.admin.load.show();
        $.ajax({
            url: ctx + '/wishPbV3/getKeyWordsHotness',
            data: JSON.stringify({ storeAcctId, keywordsList: keywordsList }),
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            success: function (res) {
                layui.admin.load.hide();
                if (res.code == "0000") {
                    var tagDom = `<div name="keyword" class="wishpb_activ_keyword" data-keyword="${Object.keys(res.data)[0]}"><span class="ant-tag">${Object.keys(res.data)[0]}
                        <i class="layui-icon" style="color: #009688;cursor: pointer;" onclick="wishpbActivDelKeyword(this)">&#x1006;</i>
                    </span>
                        <span class="wishpb_activ_keyword_hot hidden">${Object.values(res.data)[0]}</span>
                    </div>`
                    $(dom).prev('i').before(tagDom)
                    $(dom).prev('i').show()
                    $(dom).hide()
                    $(dom).val('')
                    $('.wishpb_activ_keyword').find('.ant-tag').on('mouseenter', function () {
                        var contentshow = $(this).next(".wishpb_activ_keyword_hot").text();
                        if (!!contentshow && contentshow != 'undefined') {
                            layer.tips(contentshow, $(this), {
                                tips: [2, 'red'],
                                area: ['100px', 'auto'],
                                time: 0,
                            });
                        }
                    }).on('mouseleave', function () {
                        layer.closeAll("tips");
                    });
                } else {
                    layui.layer.msg(res.msg, { icon: 2 })
                }
            },
        })
    }
}

//根据批次获取任务执行状况
function wishpbActivgetTaskProgress(laytpl, layero, redisKey) {
    commonReturnPromise({
        url: ctx + '/wishPbV3/getTaskProgressByBatchNo',
        params: { redisKey },
        isLoading: false,
        contentType: "application/json",
    }).then(data => {
        let _data = { ...data, errMsg: !data.errMsg.replace(/\s*/g, "") ? '' : data.errMsg }
        laytpl($("#wishpb_activ_task_progress").html()).render(_data, function (html) {
            $(layero).find('.layui-layer-content').html(html);
        })
        layui.element.progress('wishpb_activ_task_percent', data.precent)
        if (data.precent == '100%') {
            clearInterval(wishpbActivTimestamp);
        }
    }).catch(err => layui.layer.msg(err || err.msg, { icon: 2 }))
}

//查看批次获取任务执行状况
function wishpbActivViewTaskProgress(redisKey, update = true) {
    var layer = layui.layer,
        laytpl = layui.laytpl;
    layer.open({
        type: 1,
        title: '操作日志',
        content: '加载中...',
        area: ['600px', '400px'],
        success: function (layero) {
            //弹窗渲染
            wishpbActivgetTaskProgress(laytpl, layero, redisKey)
            wishpbActivTimestamp = setInterval(function () {
                wishpbActivgetTaskProgress(laytpl, layero, redisKey)
            }, 5000);
        },
        cancel: function (index, layero) {
            clearInterval(wishpbActivTimestamp);
            layer.close(index)
            if (update) {
                $("#wishpb_activity_submit").click()
            }
        }

    })
}