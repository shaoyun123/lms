/**
 * @desc 海外仓销量统计
 * @author zhangtt
 * @time 9.16-9.16
 * @tips 使用自执行匿名函数来实现闭包
 */
;(function(){
    layui.use(['admin','table','form','element','layer','laytpl', 'laypage','laydate'],function(){
        var admin = layui.admin,
            table = layui.table,
            element = layui.element,
            layer = layui.layer,
            laytpl = layui.laytpl,
            laydate = layui.laydate,
            laypage = layui.laypage,
            form = layui.form;
        form.render('select');
        // 人员选择
        render_hp_orgs_users("#orgs_hp_devPerson_dailysaleForm", function(){
            form.render('select');
        });
        render_hp_orgs_users("#orgs_hp_saler_dailysaleForm", function(){
            form.render('select');
        });
        //渲染时间范围
        laydate.render({
            elem: '#dailysale_orderTimes', //指定元素
            range: true
        });
        //监听tab点击
        element.on('tab(dailysale-tabs)', function(data){
            if(data.index == 0) { //注册SKU
                $('#dailysale_tabType').val('registerSku');
            }else if(data.index == 1){ //开发专员销售
                $('#dailysale_tabType').val('prodSeller');
            }else if(data.index == 2){ //商品SKU
                $('#dailysale_tabType').val('prodSellerNow');
            }else if(data.index == 3){ //商品SKU
                $('#dailysale_tabType').val('prodSku');
            }else { //开发
                $('#dailysale_tabType').val('prodBizzOwner');
            }
            $('[lay-filter="dailysale_submit"]').trigger('click');
        });
        var dailysaleName = {
            dataHanle: function(data){
                if(data.orderTimes){
                    var timeArr =data.orderTimes.split(' - ');
                    data.orderTimeStart = timeArr[0] + ' 00:00:00';
                    data.orderTimeEnd = timeArr[1] + ' 23:59:59';
                }else{
                    data.orderTimeStart = '';
                    data.orderTimeEnd='';
                }
                delete data.orderTimes;
                return data;
            },
            theadCols: function(statisticsType){//根据类型决定cols
                var cols = [];
                var colsChild = [];
                if(statisticsType == 'registerSku'){ //注册sku
                    colsChild = [
                        {title: '注册sku',field: 'dailySale_registerSku',totalRowText: '总计'},
                        {title: '国家/地区',field: 'dailySale_orderCountry'},
                        {title: '仓库',field: 'dailySale_oswhWarehouseName'},
                        {title: '海外仓销售',field: 'dailySale_oswhProdOwnerName'},
                        {title: '订单数',field: 'dailySale_orderNum',sort: true,totalRow: true},
                        {title: '订单金额($)',field: 'dailySale_orderAmt',sort: true,totalRow: true},
                        {title: '平台成交费($)',field: 'dailySale_orderFee',sort: true,totalRow: true},
                        {title: 'ebay成交费($)',field: 'dailySale_otherCurrencyFee',sort: true,totalRow: true},
                        {title: '退款订单数',field: 'dailySale_orderRefundNum',sort: true,totalRow: true},
                        {title: '退款金额($)',field: 'dailySale_orderRefundAmt',sort: true,totalRow: true},
                        {title: '退款率',field: 'dailySale_orderRefundRate'},
                        {title: '库存成本(¥)',field: 'dailySale_prodCost',sort: true,totalRow: true},
                        {title: '尾程费用(¥)',field: 'dailySale_shippingCost',sort: true,totalRow: true},
                        {title: '仓储费(¥)',field: 'dailySale_storageCost',sort: true,totalRow: true},
                        {title: '实收利润',field: 'dailySale_profit',sort: true,totalRow: true},
                        {title: '利润率',field: 'dailySale_profitRate'}
                    ];
                }else if(statisticsType == 'prodSeller'){ //开发专员销售
                    colsChild = [
                        {title: '开发专员销售',field: 'dailySale_oswhProdSellerName',totalRowText: '总计'},
                        {title: '订单数量',field: 'dailySale_orderNum',sort: true,totalRow: true},
                        {title: '订单金额($)',field: 'dailySale_orderAmt',sort: true,totalRow: true},
                        {title: '客单价($)',field: 'dailySale_avgOrderAmt',sort: true,totalRow: true},
                        {title: '平台成交费($)',field: 'dailySale_orderFee',sort: true,totalRow: true},
                        {title: 'ebay成交费($)',field: 'dailySale_otherCurrencyFee',sort: true,totalRow: true},
                        {title: '退款订单数',field: 'dailySale_orderRefundNum',sort: true,totalRow: true},
                        {title: '退款金额($)',field: 'dailySale_orderRefundAmt',sort: true,totalRow: true},
                        {title: '退款率',field: 'dailySale_orderRefundRate'},
                        {title: '库存成本(¥)',field: 'dailySale_prodCost',sort: true,totalRow: true},
                        {title: '尾程费用(¥)',field: 'dailySale_shippingCost',sort: true,totalRow: true},
                        {title: '仓储费(¥)',field: 'dailySale_storageCost',sort: true,totalRow: true},
                        {title: '实收利润',field: 'dailySale_profit',sort: true,totalRow: true},
                        {title: '利润率',field: 'dailySale_profitRate'}
                    ];
                }else if(statisticsType == 'prodSellerNow'){ //开发专员销售(now)
                    colsChild = [
                        {title: '开发专员销售',field: 'dailySale_oswhProdSellerName',totalRowText: '总计'},
                        {title: '订单数量',field: 'dailySale_orderNum',sort: true,totalRow: true},
                        {title: '订单金额($)',field: 'dailySale_orderAmt',sort: true,totalRow: true},
                        {title: '客单价($)',field: 'dailySale_avgOrderAmt',sort: true,totalRow: true},
                        {title: '平台成交费($)',field: 'dailySale_orderFee',sort: true,totalRow: true},
                        {title: 'ebay成交费($)',field: 'dailySale_otherCurrencyFee',sort: true},
                        {title: '退款订单数',field: 'dailySale_orderRefundNum',sort: true,totalRow: true},
                        {title: '退款金额($)',field: 'dailySale_orderRefundAmt',sort: true,totalRow: true},
                        {title: '退款率',field: 'dailySale_orderRefundRate'},
                        {title: '库存成本(¥)',field: 'dailySale_prodCost',sort: true,totalRow: true},
                        {title: '尾程费用(¥)',field: 'dailySale_shippingCost',sort: true,totalRow: true},
                        {title: '仓储费(¥)',field: 'dailySale_storageCost',sort: true,totalRow: true},
                        {title: '实收利润',field: 'dailySale_profit',sort: true,totalRow: true},
                        {title: '利润率',field: 'dailySale_profitRate'}
                    ];
                }else if(statisticsType == 'prodSku'){//商品sku
                    colsChild = [
                        {title: '商品sku',field: 'dailySale_prodSku',totalRowText: '总计'},
                        {title: '国家/地区',field: 'dailySale_orderCountry'},
                        {title: '仓库',field: 'dailySale_oswhWarehouseName'},
                        {title: '开发',field: 'dailySale_prodBizzOwnerName'},
                        {title: '订单数',field: 'dailySale_orderNum',sort: true,totalRow: true},
                        {title: '订单金额($)',field: 'dailySale_orderAmt',sort: true,totalRow: true},
                        {title: '平台成交费($)',field: 'dailySale_orderFee',sort: true,totalRow: true},
                        {title: 'ebay成交费($)',field: 'dailySale_otherCurrencyFee',sort: true,totalRow: true},
                        {title: '退款订单数',field: 'dailySale_orderRefundNum',sort: true,totalRow: true},
                        {title: '退款金额($)',field: 'dailySale_orderRefundAmt',sort: true,totalRow: true},
                        {title: '退款率',field: 'dailySale_orderRefundRate'},
                        {title: '库存成本(¥)',field: 'dailySale_prodCost',sort: true,totalRow: true},
                        {title: '尾程费用(¥)',field: 'dailySale_shippingCost',sort: true,totalRow: true},
                        {title: '仓储费(¥)',field: 'dailySale_storageCost',sort: true,totalRow: true},
                        {title: '实收利润',field: 'dailySale_profit',sort: true,totalRow: true},
                        {title: '利润率',field: 'dailySale_profitRate',}
                    ];
                }else if(statisticsType == 'prodBizzOwner'){ //开发人员
                    colsChild = [
                        {title: '开发',field: 'dailySale_prodBizzOwnerName'},
                        {title: '订单数量',field: 'dailySale_orderNum',sort: true,totalRow: true},
                        {title: '订单金额($)',field: 'dailySale_orderAmt',sort: true,totalRow: true},
                        {title: '客单价($)',field: 'dailySale_avgOrderAmt',sort: true,totalRow: true},
                        {title: '平台成交费($)',field: 'dailySale_orderFee',sort: true,totalRow: true},
                        {title: 'ebay成交费($)',field: 'dailySale_otherCurrencyFee',sort: true,totalRow: true},
                        {title: '退款订单数',field: 'dailySale_orderRefundNum',sort: true,totalRow: true},
                        {title: '退款金额($)',field: 'dailySale_orderRefundAmt',sort: true,totalRow: true},
                        {title: '退款率',field: 'dailySale_orderRefundRate'},
                        {title: '库存成本(¥)',field: 'dailySale_prodCost',sort: true,totalRow: true},
                        {title: '尾程费用(¥)',field: 'dailySale_shippingCost',sort: true,totalRow: true},
                        {title: '仓储费(¥)',field: 'dailySale_storageCost',sort: true,totalRow: true},
                        {title: '实收利润',field: 'dailySale_profit',sort: true,totalRow: true},
                        {title: '利润率',field: 'dailySale_profitRate'}
                    ];
                }
                cols.push(colsChild);
                return cols;
            },
            dealTableData: function(_result,data){
                let result =[]
                if(data.statisticsType == 'registerSku'){ //注册sku
                    result = _result.map(d=>({
                        ...d,
                        orderAmt: d.orderAmt.toFixed(2),
                        orderFee: d.orderFee.toFixed(2),
                        otherCurrencyFee:d.otherCurrencyFee.toFixed(2),
                        orderRefundAmt:d.orderRefundAmt.toFixed(2),
                        orderRefundRate:((d.orderRefundRate*100).toFixed(2) || '0.00') + '%',
                        prodCost: d.prodCost.toFixed(2),
                        shippingCost: d.shippingCost.toFixed(2),
                        storageCost: d.storageCost.toFixed(2),
                        profit: d.profit.toFixed(2),
                        profitRate: ((d.profitRate*100).toFixed(2) || '0.00') + '%',
                    }))
                } else if(data.statisticsType == 'prodSeller'){ //开发专员销售
                    result = _result.map(d=>({
                        ...d,
                        orderAmt: d.orderAmt.toFixed(2),
                        avgOrderAmt: d.avgOrderAmt.toFixed(2),
                        orderFee: d.orderFee.toFixed(2),
                        otherCurrencyFee:d.otherCurrencyFee.toFixed(2),
                        orderRefundAmt:d.orderRefundAmt.toFixed(2),
                        orderRefundRate:((d.orderRefundRate*100).toFixed(2) || '0.00') + '%',
                        prodCost: d.prodCost.toFixed(2),
                        shippingCost: d.shippingCost.toFixed(2),
                        storageCost: d.storageCost.toFixed(2),
                        profit: d.profit.toFixed(2),
                        profitRate: ((d.profitRate*100).toFixed(2) || '0.00') + '%',
                    }))
                } else if(data.statisticsType == 'prodSellerNow'){ //开发专员销售(now)
                    result = _result.map(d=>({
                        ...d,
                        orderAmt: d.orderAmt.toFixed(2),
                        avgOrderAmt: d.avgOrderAmt.toFixed(2),
                        orderFee: d.orderFee.toFixed(2),
                        otherCurrencyFee:d.otherCurrencyFee.toFixed(2),
                        orderRefundAmt:d.orderRefundAmt.toFixed(2),
                        orderRefundRate:((d.orderRefundRate*100).toFixed(2) || '0.00') + '%',
                        prodCost: d.prodCost.toFixed(2),
                        shippingCost: d.shippingCost.toFixed(2),
                        storageCost: d.storageCost.toFixed(2),
                        profit: d.profit.toFixed(2),
                        profitRate: ((d.profitRate*100).toFixed(2) || '0.00') + '%',
                    }))
                } else if(data.statisticsType == 'prodSku'){//商品sku
                    result = _result.map(d=>({
                        ...d,
                        orderAmt: d.orderAmt.toFixed(2),
                        orderFee: d.orderFee.toFixed(2),
                        otherCurrencyFee:d.otherCurrencyFee.toFixed(2),
                        orderRefundAmt:d.orderRefundAmt.toFixed(2),
                        orderRefundRate:((d.orderRefundRate*100).toFixed(2) || '0.00') + '%',
                        prodCost: d.prodCost.toFixed(2),
                        shippingCost: d.shippingCost.toFixed(2),
                        storageCost: d.storageCost.toFixed(2),
                        profit: d.profit.toFixed(2),
                        profitRate: ((d.profitRate*100).toFixed(2) || '0.00') + '%',
                    }))
                } else if(data.statisticsType == 'prodBizzOwner'){ //开发人员
                    result = _result.map(d=>({
                        ...d,
                        orderAmt: d.orderAmt.toFixed(2),
                        avgOrderAmt: d.avgOrderAmt.toFixed(2),
                        orderFee: d.orderFee.toFixed(2),
                        otherCurrencyFee:d.otherCurrencyFee.toFixed(2),
                        orderRefundAmt:d.orderRefundAmt.toFixed(2),
                        orderRefundRate:((d.orderRefundRate*100).toFixed(2) || '0.00') + '%',
                        prodCost: d.prodCost.toFixed(2),
                        shippingCost: d.shippingCost.toFixed(2),
                        storageCost: d.storageCost.toFixed(2),
                        profit: d.profit.toFixed(2),
                        profitRate: ((d.profitRate*100).toFixed(2) || '0.00') + '%',
                    }))
                }
                return result
            },
            tableRender: function(data){
                var _this = this;
                this.tableAjax(data).then(function(_result){
                    let result = _this.dealTableData(_result, data)
                    //表格渲染
                    _this.tableRenderFn(result, data.statisticsType, 300);
                    //分页
                    laypage.render({
                        elem: 'dailysale_page',
                        count: result.length,
                        limit: 300,
                        limits: [300,500,1000],
                        layout: ['prev', 'page', 'next', 'count','limit'],
                        jump: function(obj){
                            var currLimit = obj.limit;
                            var curr = obj.curr;
                            var thisData = result.concat().splice((curr-1)*currLimit,currLimit);
                            _this.tableRenderFn(thisData, data.statisticsType, currLimit);
                            setTimeout(function(){
                                layer.closeAll();
                            },100);
                        }
                    });
                }).catch(function(err){
                    layer.msg(err,{icon:2});
                })
            },
            tableRenderFn: function(data,statisticsType, limit){
                let newData = [];
                data.forEach(item => {
                    let obj = {}
                    for(let key in item){
                        obj['dailySale_' + key] = item[key]
                    }
                    newData.push(obj)
                })
                console.log(newData)
                var _this =this;
                table.render({
                    elem: "#dailysale_table",
                    id: 'dailysale_tableId',
                    data: newData,
                    cols: _this.theadCols(statisticsType),
                    limit: limit,
                    totalRow: true,
                    loading:false,
                    page: false,
                    done: function(){
                        $('#dailysale-tabs').find('li span').html('');
                        $('#dailysale-tabs').find('li.layui-this span').html(`(${data.length})`);
                    }
                });
            },
            tableAjax:function(obj){
                return commonReturnPromise({
                    type: 'post',
                    contentType: 'application/x-www-form-urlencoded',
                    url: '/lms/ordersale/oswh/statistics',
                    params: obj
                })
            }
            // tableRender: function(data){
            //     var _this = this;
            //     table.render({
            //         elem: "#dailysale_table",
            //         method: "post",
            //         url: '/lms/ordersale/oswh/statistics',
            //         where: data,
            //         cols: _this.theadCols(data.statisticsType),
            //         limit: 20000
            //     })
            // }
        };

        //监听表单提交事件
        form.on('submit(dailysale_submit)', function(obj){
            var formData = dailysaleName.dataHanle(obj.field);
            if(!formData.orderTimeStart){
                return layer.msg('请先选择订单时间',{icon: 7});
            }
            dailysaleName.tableRender(formData);
        });
        // 表单export
        form.on('submit(dailysale_export)', function(obj) {
            var formData = dailysaleName.dataHanle(obj.field);
            if(!formData.orderTimeStart){
                return layer.msg('请先选择订单时间',{icon: 7});
            }
            layer.confirm('根据页面查询时间导出明细信息？', function (result) {
                if (result) {
                    submitForm(formData, ctx + '/ordersale/oswh/exportorder.html',"_blank");
                    layer.closeAll();
                }
            });
        });
        //固定表头
        UnifiedFixedFn('dailysaleCard');
    });//layui结束
})();//匿名函数结束