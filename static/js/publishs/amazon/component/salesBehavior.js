/**
 * Created by EPEAN on 2021-07-01.
 */


// 表现详情
function amazon_fba_component_showBehavior(data) {
    let layer = layui.layer
    let laydate = layui.laydate
    let form  = layui.form
    var index = layer.open({
        type: 1,
        title: '表现详情',
        id: 'amazon_component_salesBehaviorLayer',
        area: ['95%', '90%'],
        shadeClose: false,
        content: $('#amazon_component_salesBehavior_pop').html(),
        success: function (layero) {
            // 固定表头
            $('#FBAhistory_begaviorPop').scroll(function() {
                toFixedTabHead(this)
            })

            let storeAcctList = data.statisticInfo.storeIdList.split(',')
            let siteIdList = data.statisticInfo.salesSiteList.split(',')
            let storeNameList = data.statisticInfo.storeNameList.split(',')
            let storeOption = '<option></option>'
            for (let i = 0; i < storeAcctList.length; ++i) {
                storeOption += '<option value="'+ storeAcctList[i] +'" '+ (storeAcctList[i] == data.storeAcctId ? 'selected' : '') +'>'+ storeNameList[i] +'</option>'
            }
            let siteOption = '<option></option>'
            for (let i = 0; i < siteIdList.length; ++i) {
                siteOption += '<option value="'+ siteIdList[i] +'" '+ (siteIdList[i] == data.salesSite ? 'selected' : '') +'>'+ siteIdList[i] +'</option>'
            }
            let formElem = $('#FBAhistory_detail_search_form')
            formElem.find('[name = storeIdListStr]').html(storeOption)
            formElem.find('[name = salesSiteListStr]').html(siteOption)
            form.render('select','FBAhistory_detail_search_form')

            //渲染 asin数据start
            $("#FBAhistory_tabledetail_img").attr("src", data.picUrl);
            $("#FBAhistory_detail_search_form_asin").text(data.asin);
            $('#FBAhistory_detail_search_form').find('[name=asin]').val(data.asin)
            imageLazyload();

            //渲染 列表日期 默认昨日
            var date = new Date()
            date.setDate(date.getDate() - 1);
            var endTime = format(date, 'yyyy-MM-dd')
            date.setDate(date.getDate() - 7);
            var beginTime = format(date, 'yyyy-MM-dd')
            var timeStr = beginTime + ' - ' + endTime
            $("#FBAhistory_detail_timerange_input").val(timeStr)
            //日期范围
            laydate.render({
                elem: '#FBAhistory_detail_timerange_input',
                range: true,
                done: function(value, date, endDate){
                    window.setTimeout(function () {
                        FBAhistory_searchSameAsinBehavior()
                    },100)
                }
            });
            FBAhistory_searchSameAsinBehavior()

            // 店铺、站点选择事件
            form.on('select(FBAhistory_detail_search_form_sel)', function () {
                FBAhistory_searchSameAsinBehavior()
            })
        },
    })
}

function FBAhistory_searchSameAsinBehavior() {
    let layer = layui.layer
    let table = layui.table
    let form  = layui.form
    let Adata = serializeObject($('#FBAhistory_detail_search_form'))
    if(Adata.timeStr && Adata.timeStr.trim() != "") {
        Adata.postedDateStrStart = Adata.timeStr.split(" - ")[0]
        Adata.postedDateStrEnd = Adata.timeStr.split(" - ")[1]
    }
    if (!Adata.postedDateStrStart || !Adata.postedDateStrEnd) {
        layer.msg('请选择日期')
        return
    }
    // 获取弹窗高度
    table.render({
        elem: "#FBAhistory_datadetail_table",
        method: 'post',
        url: ctx + `/amazonFbaInventory/getSaleBehaviorByAsin`,
        where: Adata,
        totalRow: true,
        cols: [
            [
                { field: "analysisTime", title: "时间", templet: '<div>{{Format(d.analysisTime,`yyyy-MM-dd`)}}</div>',totalRowText: '合计',sort: true},
                { field: "salesNums", title: "销量",sort: true},
                { field: "orderNums", title: "订单量",sort: true},
                { field: "latesRanking", title: "排名"},
                { title: "评分", field: "score" },
                { field: "commentsNums", title: "评论数"},
                { field: "listingPrice", title: '当日刊登价格<i class="layui-icon layui-icon-tips" title="只有选择了店铺和站点。价格数值才有意义"></i>'},
                { title: "销售额$",field: "salesAmount",sort: true,width:80},
                { title: "退款量",field: "refundNums", sort: true,width:80},
                { title: "退款率", field: "refundRate" ,sort: true,width:80},
                { title: `展示`,field: "showNums",sort: true},
                { title: "点击",field: "clickNums",sort: true},
                { title: `CTR<i class="layui-icon layui-icon-tips" title="点击量/展示量"></i>`,field: 'ctr', templet: '<div>{{d.ctr ? (d.ctr + `%`) : ``}}</div>',sort: true},
                { title: "花费$",field: "cost",sort: true},
                { title: `CPC<i class="layui-icon layui-icon-tips" title="每次点击花费=花费/点击量"></i>`,sort: true,field: "cpc"},
                { title: `ACOS<i class="layui-icon layui-icon-tips" title="广告花费/广告销售额"></i>`,sort: true,field: "acos",templet: "<div>{{d.advertisingTotalSalesAmount ? (accMul(accDiv(d.cost,d.advertisingTotalSalesAmount),100).toFixed(2) + '%'): ''}}</div>",width:100},
                { title: `ACOAS<i class="layui-icon layui-icon-tips" title="广告花费/总销售额"></i>`,sort: true,field: "acoas",templet: "<div>{{d.salesAmount ? (accMul(accDiv(d.cost,d.salesAmount),100).toFixed(2) + '%'): ''}}</div>",width:100},
                { title: `ASoAS<i class="layui-icon layui-icon-tips" title="广告销售额/总销售额"></i>`,sort: true,field: "asoas",templet: "<div>{{d.salesAmount ? (accMul(accDiv(d.advertisingTotalSalesAmount,d.salesAmount),100).toFixed(2) + '%'): ''}}</div>",width:100},
                { title: "广告总订单量",field: "advertisingTotalOrderNums",sort: true},
                { title: "广告总订单量占比",field: "advertisingTotalOrderRate",sort: true,templet: "<div>{{d.orderNums ? (accMul(accDiv(d.advertisingTotalOrderNums,d.orderNums),100).toFixed(2) + '%'): ''}}</div>"},
                { title: "广告总销售额$",field: "advertisingTotalSalesAmount",sort: true},
                { title: "广告直接订单量",field: "advertisingDirectOrderNums",sort: true},
                { title: "广告间接订单量",field: "advertisingIndirectOrderNums",sort: true},
                { title: "广告直接销售额$",field: "advertisingDirectSalesAmount",sort: true},
                { title: "广告间接销售额$",field: "advertisingIndirectSalesAmount",sort: true},
            ],
        ],
        limit: 1000,
        done: function (res) {
            let totalObj = {}
            let list = res.data

            for (let i = 0; i < list.length; ++i) {
                for (let key in list[i]) {
                    if (!isNaN(list[i][key])) {
                        totalObj[key] = (totalObj[key] || 0) + list[i][key]
                    }
                }
            }
            for (let key in totalObj) {
                try {
                    totalObj[key] = tofixed(totalObj[key], 2)
                } catch(e) {
                }
            }
            totalObj.ctr = totalObj.showNums ? accDiv(totalObj.clickNums, totalObj.showNums) : 0
            totalObj.refundRate = totalObj.orderNums ? accDiv(totalObj.refundNums,totalObj.orderNums) : 0
            totalObj.cpc = totalObj.clickNums ? accDiv(totalObj.cost, totalObj.clickNums).toFixed(2) : 0
            totalObj.acos = totalObj.advertisingTotalSalesAmount ? (accMul(accDiv(totalObj.cost, totalObj.advertisingTotalSalesAmount),100).toFixed(2) + '%'): 0
            totalObj.acoas = totalObj.salesAmount ? (accMul(accDiv(totalObj.cost, totalObj.salesAmount),100).toFixed(2) + '%'): 0
            totalObj.asoas = totalObj.salesAmount ? (accMul(accDiv(totalObj.advertisingTotalSalesAmount, totalObj.salesAmount),100).toFixed(2) + '%') : 0
            totalObj.advertisingTotalOrderRate = totalObj.orderNums ? (accMul(accDiv(totalObj.advertisingTotalOrderNums, totalObj.orderNums),100).toFixed(2) + '%') : 0


            this.elem.next().find('.layui-table-total td[data-field="salesNums"] .layui-table-cell').text(totalObj.salesNums);
            this.elem.next().find('.layui-table-total td[data-field="orderNums"] .layui-table-cell').text(totalObj.orderNums);
            this.elem.next().find('.layui-table-total td[data-field="salesAmount"] .layui-table-cell').text(totalObj.salesAmount);
            this.elem.next().find('.layui-table-total td[data-field="refundNums"] .layui-table-cell').text(totalObj.refundNums);
            this.elem.next().find('.layui-table-total td[data-field="refundRate"] .layui-table-cell').text(totalObj.refundRate);
            this.elem.next().find('.layui-table-total td[data-field="showNums"] .layui-table-cell').text(tofixed(totalObj.showNums,0));
            this.elem.next().find('.layui-table-total td[data-field="clickNums"] .layui-table-cell').text(tofixed(totalObj.clickNums,0));
            this.elem.next().find('.layui-table-total td[data-field="ctr"] .layui-table-cell').text(tofixed(totalObj.ctr * 100,2) + '%');
            this.elem.next().find('.layui-table-total td[data-field="cost"] .layui-table-cell').text(totalObj.cost);
            this.elem.next().find('.layui-table-total td[data-field="cpc"] .layui-table-cell').text(totalObj.cpc);
            this.elem.next().find('.layui-table-total td[data-field="acos"] .layui-table-cell').text(totalObj.acos);
            this.elem.next().find('.layui-table-total td[data-field="acoas"] .layui-table-cell').text(totalObj.acoas);
            this.elem.next().find('.layui-table-total td[data-field="asoas"] .layui-table-cell').text(totalObj.asoas);
            this.elem.next().find('.layui-table-total td[data-field="advertisingTotalOrderNums"] .layui-table-cell').text(totalObj.advertisingTotalOrderNums);
            this.elem.next().find('.layui-table-total td[data-field="advertisingTotalOrderRate"] .layui-table-cell').text(totalObj.advertisingTotalOrderRate);
            this.elem.next().find('.layui-table-total td[data-field="advertisingTotalSalesAmount"] .layui-table-cell').text(totalObj.advertisingTotalSalesAmount);
            this.elem.next().find('.layui-table-total td[data-field="advertisingDirectOrderNums"] .layui-table-cell').text(totalObj.advertisingDirectOrderNums);
            this.elem.next().find('.layui-table-total td[data-field="advertisingIndirectOrderNums"] .layui-table-cell').text(totalObj.advertisingIndirectOrderNums);
            this.elem.next().find('.layui-table-total td[data-field="advertisingDirectSalesAmount"] .layui-table-cell').text(totalObj.advertisingDirectSalesAmount);
            this.elem.next().find('.layui-table-total td[data-field="advertisingIndirectSalesAmount"] .layui-table-cell').text(totalObj.advertisingIndirectSalesAmount);
        }
    });
}

function tofixed(num, q) {
    if (!num) {
        return 0
    }
    num = parseFloat(num)
    return num.toFixed(q)
}