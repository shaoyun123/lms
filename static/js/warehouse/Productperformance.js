(function () {
    layui.use(['admin','table', 'form','laydate','element', 'layer', 'laytpl', 'formSelects','laypage'], function () {
        var form = layui.form,
            admin = layui.admin,
            table = layui.table,
            laydate = layui.laydate,
            laypage = layui.laypage,
            formSelects = layui.formSelects;
        $("#Productperformance_timerange_input").val(getLatestMonth().createTimeStart + ' - ' + getLatestMonth().createTimeEnd)

        // 判断是否从其他页面跳转过来。带有查询参数
        let  searchParam = window.sessionStorage.ProductperformanceQueryParam
        if (searchParam) {
            searchParam = JSON.parse(searchParam)
            let time = $("#Productperformance_timerange_input").val()
            searchParam.postedDateStrStart = time.split(" - ")[0] + " 00:00:00";
            searchParam.postedDateStrEnd = time.split(" - ")[1] + " 23:59:59";
            queryTable(searchParam, '/amazonProductPerformanceController/queryPage.html')
            $('#Productperformance_search_form [name=searchValue]').val(searchParam.searchValue)
            window.sessionStorage.ProductperformanceQueryParam = ''
            window.setTimeout(function () {
                formSelects.value('Productperformance_site',[searchParam.siteIdList])
                formSelects.value('Productperformance_online_store_sel',[searchParam.storeAcctIdList])
            },1500)
        }

        form.render();
        fillsite();


        //日期范围
        laydate.render({
            elem: '#Productperformance_timerange_input',
            range: true
            ,min: -61 //61天前
        });
        render_hp_orgs_users("#Productperformance_search_form");//渲染部门销售员店铺三级联动

        //绑定asin更改事件
        form.on('select(Productperformance_asin)', function(data) {
            // Productperformance_listCard();
            if(data.value == 1){ // ASIN
                // Productperformance_listCard('/amazonProductPerformanceController/queryPage.html');
                $(".Productperformance_casin_hide_div").hide();
                $(".Productperformance_pasin_hide_div").show();
            }else if(data.value == 2){  // 父ASIN
                // Productperformance_listCard('/amazonProductPerformanceController/queryPageForParentAsin.html');
                $(".Productperformance_casin_hide_div").show();
                $(".Productperformance_pasin_hide_div").hide();
            }
        });

        //绑定refundKey更改事件
        form.on('select(Productperformance_refundKey)', function(data) {
            $("#refundValueBegin").val('');
            $("#refundValueEnd").val('');
            if(data.value == 1){
                // 退款量  验证正整数
                $("#refundValueBegin").attr({
                    'onkeyup':"if(this.value && ! /^[+]{0,1}(\\d+)$/.test(this.value)){alert('只能输入正整数');this.value='';}",
                    'type':'number',
                    'max':''
                })
                $("#refundValueEnd").attr({
                    'onkeyup':"if(this.value && ! /^[+]{0,1}(\\d+)$/.test(this.value)){alert('只能输入正整数');this.value='';}",
                    'type':'number',
                    'max':''
                })
            }else if(data.value == 2){
                // 退款率  验证大于0小于1的数字
                $("#refundValueBegin").attr({
                    'onkeyup':"if(this.value && ! /^(0(\\.\\d+)?|1(\\.0+))$/.test(this.value)){alert('只能输入大于等于0 小于1');this.value='';}",
                    'type':'number',
                    'max':'0'
                })
                $("#refundValueEnd").attr({
                    'onkeyup':"if(this.value && ! /^(0(\\.\\d+)?|1(\\.0+))$/.test(this.value)){alert('只能输入大于等于0 小于1');this.value='';}",
                    'type':'number',
                    'max':'0'
                })
            }
        });

        // 搜索
        $("#Productperformance_searchBtn").click(function() {
            var Productperformance_asin_val = $("#Productperformance_asin").val()
                if(Productperformance_asin_val == 1){ // ASIN
                    Productperformance_listCard('/amazonProductPerformanceController/queryPage.html');
                }else if(Productperformance_asin_val == 2){  // 父ASIN
                    Productperformance_listCard('/amazonProductPerformanceController/queryPageForParentAsin.html');
                }
            // Productperformance_listCard()
        });

        Productperformance_listCard = (toUrl) =>{
            var data = serializeObject($('#Productperformance_search_form'));
            if(data.Productperformance_timerange_input) {
                data.postedDateStrStart = data.Productperformance_timerange_input.split(" - ")[0] + " 00:00:00";
                data.postedDateStrEnd = data.Productperformance_timerange_input.split(" - ")[1] + " 23:59:59";
            };
            queryTable(data,toUrl)
        }
        function queryTable(data,toUrl) {
            table.render({
                elem: "#Productperformance_data_table",
                method: 'post',
                // url: `${ctx}/amazonProductPerformanceController/queryPage.html`,
                url: `${ctx}${toUrl}`,
                where: data,
                totalRow: true,
                cols: [
                    [
                        { field: "picUrl", templet: "#Productperformance_imageTp1", title: "商品信息",width:150,totalRowText: '合计'},
                        { title: "分析", templet: "#Productperformance_table1",field: "fen",width:40},
                        { field: "asin", title: "ASIN"},
                        { field: "storeAcct", title: "店铺",width:50},
                        { field: "siteName", title: "站点",width:40 },
                        { title: "品名", field: "productName", },
                        { field: "prodSSku", title: "SKU",},
                        { title: "销量",field: "salesNums",sort: true},
                        { title: `订单量<i class="layui-icon layui-icon-tips layTitle" lay-title="包含企业买家订单"></i>`,field: "orderNums", sort: true,},
                        { field: "salesAmount", title: "销售额",sort: true,},
                        { field: "refundNums", title: "退款量",sort: true,},
                        { title: `退款率<i class="layui-icon layui-icon-tips layTitle" lay-title="退款量/销量；退款订单量按照退款时间统计"></i>`, field: "refundRate",sort: true,},
                        { title: "最新排名", field: "latesRanking" ,sort: true,width:80},
                        { title: "评分",field: "score",sort: true},
                        { title: "评论数",field: "commentsNums",sort: true,},
                        { title: "展示",field: "showNums",},
                        { title: "点击",field: "clickNums",},
                        { title: `CTR<i class="layui-icon layui-icon-tips layTitle" lay-title="点击量/展示量"></i>`,templet: "#Productperformance_data2",},
                        { title: "花费($)",field: "cost",sort: true},
                        { title: `CPC<i class="layui-icon layui-icon-tips layTitle" lay-title="每次点击花费=花费/点击量"></i>`,field: "cpc",},
                        { title: `ACOS<i class="layui-icon layui-icon-tips layTitle" lay-title="广告花费/广告销售额"></i>`,templet: "#Productperformance_data3",field:"acos"},
                        { title: `ACoAS<i class="layui-icon layui-icon-tips layTitle" lay-title="广告花费/总销售额"></i>`,templet: "#Productperformance_data4",},
                        { title: `ASoAS<i class="layui-icon layui-icon-tips layTitle" lay-title="广告销售额/总销售额"></i>`,templet: "#Productperformance_data5", },
                        { title: "广告总订单量",field: "advertisingTotalOrderNums",sort: true,},
                        { title: "广告总订单占比",field: "advertisingTotalOrderRate",templet: "#Productperformance_data6"},
                        { title: "广告总销售额",field: "advertisingTotalSalesAmount",sort: true,},
                        { title: "广告直接订单量",field: "advertisingDirectOrderNums",},
                        { title: "广告间接订单量",field: "advertisingIndirectOrderNums",},
                        { title: "广告直接销售额",field: "advertisingDirectSalesAmount",},
                        { title: "广告间接销售额",field: "advertisingIndirectSalesAmount",},

                    ],
                ],
                id: "fbaProjectTable",
                page: true,
                limits: [50, 200, 500],
                limit: 50,
                done: function(res, curr, count) {
                    if(res.msg == "null" || res.msg == null){}else{
                    $('#Productperformance_data_table').next('.layui-table-view').find('.layui-table-header').addClass('toFixedContain')
                    // $('#Productperformance_data_table').next('.layui-table-view').find('.layui-table-total').addClass('toFixedContain')
                    this.elem.next().find('.layui-table-total td[data-field="salesNums"] .layui-table-cell').text(JSON.parse(res.msg).salesNums);
                    this.elem.next().find('.layui-table-total td[data-field="salesAmount"] .layui-table-cell').text(JSON.parse(res.msg).salesAmount);
                    this.elem.next().find('.layui-table-total td[data-field="orderNums"] .layui-table-cell').text(JSON.parse(res.msg).orderNums);
                    this.elem.next().find('.layui-table-total td[data-field="refundNums"] .layui-table-cell').text(JSON.parse(res.msg).refundNums);
                    this.elem.next().find('.layui-table-total td[data-field="forecastOfAvailableDays"] .layui-table-cell').text(JSON.parse(res.msg).forecastOfAvailableDays);
                    this.elem.next().find('.layui-table-total td[data-field="commentsNums"] .layui-table-cell').text(JSON.parse(res.msg).commentsNums);
                    this.elem.next().find('.layui-table-total td[data-field="sessions"] .layui-table-cell').text(JSON.parse(res.msg).sessions);
                    this.elem.next().find('.layui-table-total td[data-field="pv"] .layui-table-cell').text(JSON.parse(res.msg).pv);
                    this.elem.next().find('.layui-table-total td[data-field="showNums"] .layui-table-cell').text(JSON.parse(res.msg).showNums);
                    this.elem.next().find('.layui-table-total td[data-field="clickNums"] .layui-table-cell').text(JSON.parse(res.msg).clickNums);
                    this.elem.next().find('.layui-table-total td[data-field="cost"] .layui-table-cell').text(JSON.parse(res.msg).cost);
                    this.elem.next().find('.layui-table-total td[data-field="cpc"] .layui-table-cell').text(JSON.parse(res.msg).cpc);
                    this.elem.next().find('.layui-table-total td[data-field="acoas"] .layui-table-cell').text(JSON.parse(res.msg).acoas);
                    this.elem.next().find('.layui-table-total td[data-field="asoas"] .layui-table-cell').text(JSON.parse(res.msg).asoas);
                    this.elem.next().find('.layui-table-total td[data-field="advertisingOrderNums"] .layui-table-cell').text(JSON.parse(res.msg).advertisingOrderNums);
                    this.elem.next().find('.layui-table-total td[data-field="advertisingSalesAmount"] .layui-table-cell').text(JSON.parse(res.msg).advertisingSalesAmount);
                    //懒加载
                    imageLazyload();
                    }
                }
            });
        }

        // 一键应用
        $(document).on("click","#PPFM_apply",function(){
            // refundRate // 退款率
            // grossProfitMargin // 毛利率
            // couponDiscount // 优惠券折扣
            // couponExchangeRate // 优惠券兑换率
            // profitRateOfCollection // 回款利润率
            // collection // 回款
            let grossProfitMargin = $(document).find("input[name=grossProfitMarginName]").val(),
                couponDiscount = $(document).find("input[name=couponDiscountName]").val(),
                couponExchangeRate = $(document).find("input[name=couponExchangeRateName]").val();
            let newData = deepCopy(layui.table.cache.Productperformance_datadetail_table),collection = [];
            // 修改缓存的值，方便导出
            newData.forEach((item,index) => {
                layui.table.cache.Productperformance_datadetail_table[index].grossProfitMargin = grossProfitMargin;
                layui.table.cache.Productperformance_datadetail_table[index].couponDiscount = couponDiscount;
                layui.table.cache.Productperformance_datadetail_table[index].couponExchangeRate = couponExchangeRate;
                item.profitRateOfCollection = (((grossProfitMargin/100) - (item.acoas/100) - (item.refundRate/100) - commonAdd(couponDiscount/100,couponExchangeRate/100,"*")) * 100).toFixed(2)
                item.collection = commonAdd(item.profitRateOfCollection/100,item.salesAmount,"*").toFixed(2);
                layui.table.cache.Productperformance_datadetail_table[index].profitRateOfCollection = item.profitRateOfCollection
                layui.table.cache.Productperformance_datadetail_table[index].collection = item.collection
                $("#Productperformance_datadetail_table").next().find("tr[data-index="+ index +"]").find("td[data-field=grossProfitMargin]>div").text(grossProfitMargin)
                $("#Productperformance_datadetail_table").next().find("tr[data-index="+ index +"]").find("td[data-field=couponDiscount]>div").text(couponDiscount)
                $("#Productperformance_datadetail_table").next().find("tr[data-index="+ index +"]").find("td[data-field=couponExchangeRate]>div").text(couponExchangeRate)
                $("#Productperformance_datadetail_table").next().find("tr[data-index="+ index +"]").find("td[data-field=profitRateOfCollection]>div").text(item.profitRateOfCollection)
                $("#Productperformance_datadetail_table").next().find("tr[data-index="+ index +"]").find("td[data-field=collection]>div").text(item.collection)
                // 获取计算出的回款值，回款列需要前段手动求和
                collection.push(item.collection)
            })
            // 求和
            let costTotal = $("#Productperformance_datadetail_table").next().find(".layui-table-total td[data-field=cost]>div").text(), // 广告花费求和
                salesAmountTotal = $("#Productperformance_datadetail_table").next().find(".layui-table-total td[data-field=salesAmount]>div").text(); // 广告总销售额
                $("#Productperformance_datadetail_table").next().find(".layui-table-total td[data-field=acoas]>div").text(salesAmountTotal == 0?0:costTotal/salesAmountTotal)
            $("#Productperformance_datadetail_table").next().find(".layui-table-total td[data-field=collection]>div").text(arrSum(collection))
        })

        //触发行单击事件
        table.on('edit(Productperformance_datadetail_table)', function(obj){
            let data = obj.data;
            let oldCollection = data.collection;
            let profitRateOfCollection = 100 * (((data.grossProfitMargin/100) - (data.acoas/100) - (data.refundRate/100) - commonAdd(data.couponDiscount/100,data.couponExchangeRate/100,"*"))).toFixed(2);
            let collection = commonAdd(profitRateOfCollection/100,data.salesAmount,"*").toFixed(2);

            data["profitRateOfCollection"] = profitRateOfCollection
            data["collection"] = collection
            $(this).closest("tr").find('td[data-field="profitRateOfCollection"] div').text(profitRateOfCollection)
            $(this).closest("tr").find('td[data-field="collection"] div').text(collection)

            // 回款求和
            let oldCollectionTotal = $("#Productperformance_datadetail_table").next().find(".layui-table-total td[data-field=collection]>div").text()
            let newCollectionTotal = oldCollectionTotal - oldCollection + collection;
            $("#Productperformance_datadetail_table").next().find(".layui-table-total td[data-field=collection]>div").text(newCollectionTotal)
        });
        
        /**
         * 查询明细列表
         * @param where 查询条件对象
         */
        function searchDetailForm(where) {
            table.render({
                elem: "#Productperformance_datadetail_table",
                id:'Productperformance_datadetail_table',
                method: 'post',
                url: `${ctx}/amazonProductPerformanceController/getAsinDetail`,
                where: where,
                totalRow: true,
                cols: [
                    [
                        { field: "statisticsTime", title: "时间",totalRowText: '合计'},
                        { field: "salesNums", title: "销量",sort: true,totalRow: true},
                        { field: "orderNums", title: "订单量",totalRow: true},
                        { field: "latesRanking", title: "排名",},
                        { title: "评分", field: "score", },
                        { field: "commentsNums", title: "评论数",},
                        { title: "销售额",field: "salesAmount",sort: true,width:80,totalRow: true},
                        { title: "退款量",field: "refundNums", sort: true,width:80,totalRow: true},
                        { title: "退款率", field: "refundRate" ,sort: true,width:80},
                        { title: `展示量`,field: "showNums",totalRow: true},
                        { title: "点击",field: "clickNums",sort: true},
                        { title: `CTR<i class="layui-icon layui-icon-tips layTitle" lay-title="点击量/展示量"></i>`,field: "ctr",templet: "#Productdetails_data1"},
                        { title: "花费",field: "cost",totalRow: true},
                        { title: `CPC<i class="layui-icon layui-icon-tips layTitle" lay-title="每次点击花费=花费/点击量"></i>`,field: "cpc",field: "cpc",totalRow: true},
                        { title: `ACOS<i class="layui-icon layui-icon-tips layTitle" lay-title="广告花费/广告销售额"></i>`,field: "acos",templet: "#Productdetails_data3",width:100},
                        { title: `ACoAS<i class="layui-icon layui-icon-tips layTitle" lay-title="广告花费/总销售额"></i>`,field: "acoas",templet: "#Productdetails_data4",width:100,totalRow: true},
                        { title: `ASoAS<i class="layui-icon layui-icon-tips layTitle" lay-title="广告销售额/总销售额"></i>`,field: "asoas",templet: "#Productdetails_data5",width:100},
                        { title: "广告总订单量",field: "advertisingTotalOrderNums",sort: true,width:120},
                        { title: "广告总订单量占比",field: "advertisingTotalOrderRate",width:120,templet: "#Productdetails_data6"},
                        { title: "广告总销售额",field: "advertisingTotalSalesAmount",sort: true,width:120},
                        { title: "广告直接订单量",field: "advertisingDirectOrderNums",},
                        { title: "广告间接订单量",field: "advertisingIndirectOrderNums",},
                        { title: "广告直接销售额",field: "advertisingDirectSalesAmount",},
                        { title: "广告间接销售额",field: "advertisingIndirectSalesAmount",},

                        { title: "毛利率(%)",field: "grossProfitMargin",edit:'text'},
                        { title: "优惠券折扣(%)",field: "couponDiscount",edit:'text'},
                        { title: "优惠券兑换率(%)",field: "couponExchangeRate",edit:'text'},
                        { title: "回款利润率(%)",field: "profitRateOfCollection",}, // 回款利润率=毛利率 - ACoAS（促销折扣）- 退款率 -（优惠券折扣率*优惠券兑换率）
                        { title: "回款",field: "collection",totalRow: true}, // 回款利润=回款利润率*总销售额
                    ],
                ],
                limit: 100,
                done: function (res) {
                    this.elem.next().find('.layui-table-total td[data-field="showNums"] .layui-table-cell').text(JSON.parse(res.msg).showNums);
                    this.elem.next().find('.layui-table-total td[data-field="cost"] .layui-table-cell').text(JSON.parse(res.msg).cost);
                    this.elem.next().find('.layui-table-total td[data-field="refundNums"] .layui-table-cell').text(JSON.parse(res.msg).refundNums);
                    this.elem.next().find('.layui-table-total td[data-field="clickNums"] .layui-table-cell').text(JSON.parse(res.msg).clickNums);
                    this.elem.next().find('.layui-table-total td[data-field="advertisingOrderNums"] .layui-table-cell').text(JSON.parse(res.msg).advertisingOrderNums);
                    this.elem.next().find('.layui-table-total td[data-field="advertisingSalesAmount"] .layui-table-cell').text(JSON.parse(res.msg).advertisingSalesAmount);
                    this.elem.next().find('.layui-table-total td[data-field="salesAmount"] .layui-table-cell').text(JSON.parse(res.msg).salesAmount);
                    this.elem.next().find('.layui-table-total td[data-field="commentsNums"] .layui-table-cell').text(JSON.parse(res.msg).commentsNums);
                    this.elem.next().find('.layui-table-total td[data-field="forecastOfAvailableDays"] .layui-table-cell').text(JSON.parse(res.msg).forecastOfAvailableDays);
                    this.elem.next().find('.layui-table-total td[data-field="salesNums"] .layui-table-cell').text(JSON.parse(res.msg).salesNums);
                    this.elem.next().find('.layui-table-total td[data-field="cpc"] .layui-table-cell').text(JSON.parse(res.msg).cpc);
                    this.elem.next().find('.layui-table-total td[data-field="orderNums"] .layui-table-cell').text(JSON.parse(res.msg).orderNums);
                    imageLazyload();
                }
            });
        }
    
    table.on('tool(Productperformance_data_table)', function (obj) {
        var layEvent = obj.event; // 获得 lay-event 对应的值
        var data = obj.data; // 获得当前行数据
        var $this = $(this);
        var tr = $this.parents('tr');
        var trIndex = tr.data('index');
        if (layEvent === 'Productperformance_detail') {
            createDetailTable(data);
        } else if(layEvent === 'Productperformance_asinadd'){
            $(this).attr('lay-event', 'fold').html('-');
            var tableId = 'tableOut_tableIn_' + trIndex;
            var _html = [
                '<tr class="table-item">',
                '<td colspan="' + tr.find('td').length + '">',
                '<table id="' + tableId + '" lay-filter ='+ tableId+'></table>',//可以嵌套表格也可以是其他内容，如是其他内容则无须渲染该表格
                '</td>',
                '</tr>'
            ];
            tr.after(_html.join('\n'));
            // 渲染table
            table.render({
                elem: '#' + tableId,
                data: data.asinList || [],
                cols: [[
                    { field: "picUrl", templet: "#Productperformance_imageTp2",width:150},
                    { title: "分析", templet: "#Productperformance_table2",field: "fen",width:40},
                        { field: "asin", title: "ASIN"},
                        { field: "storeAcct", title: "店铺",width:50},
                        { field: "siteName", title: "站点",width:40 },
                        { title: "品名", field: "productName", },
                        { field: "prodSSku", title: "SKU",},
                        { title: "销量",field: "salesNums",sort: true},
                        { title: `订单量<i class="layui-icon layui-icon-tips layTitle" lay-title="包含企业买家订单"></i>`,field: "orderNums", sort: true,},
                        { field: "salesAmount", title: "销售额",sort: true,},
                        { field: "refundNums", title: "退款量",sort: true,},
                        { title: `退款率<i class="layui-icon layui-icon-tips layTitle" lay-title="退款量/销量；退款订单量按照退款时间统计"></i>`, field: "refundRate",sort: true,},
                        { title: "最新排名", field: "latesRanking" ,sort: true,width:80},
                        { title: "评分",field: "score",sort: true},
                        { title: "评论数",field: "commentsNums",sort: true,},
                        { title: "展示",field: "showNums",},
                        { title: "点击",field: "clickNums",},
                        { title: "CTR",templet:"#Productperformance_datas2",},
                        { title: "花费",field: "cost",sort: true},
                        { title: `CPC<i class="layui-icon layui-icon-tips layTitle" lay-title="每次点击花费=花费/点击量"></i>`,field: "cpc",},
                        { title: `ACOS<i class="layui-icon layui-icon-tips layTitle" lay-title="广告花费/广告销售额"></i>`,templet:"#Productperformance_datas3",},
                        { title: `ACoAS<i class="layui-icon layui-icon-tips layTitle" lay-title="广告花费/总销售额"></i>`,templet:"#Productperformance_datas4",},
                        { title: `ASoAS<i class="layui-icon layui-icon-tips layTitle" lay-title="广告销售额/总销售额"></i>`,templet:"#Productperformance_datas5", },
                        { title: "广告总订单量",field: "advertisingTotalOrderNums",sort: true,},
                        { title: "广告总订单占比",field: "advertisingTotalOrderRate",templet:"#Productperformance_datas6"},
                        { title: "广告总销售额",field: "advertisingTotalSalesAmount",sort: true,},
                        { title: "广告直接订单量",field: "advertisingDirectOrderNums",},
                        { title: "广告间接订单量",field: "advertisingIndirectOrderNums",},
                        { title: "广告直接销售额",field: "advertisingDirectSalesAmount",},
                        { title: "广告间接销售额",field: "advertisingIndirectSalesAmount",},
                ]],
                done: function (res, curr, count) {
                    imageLazyload()
                    var tables = $("#" + tableId).next().find('table');
                    if (tables && tables.length > 1) {
                        $(tables[0]).hide();
                    }
                    },
            });
            table.on('tool(' + tableId + ')', function (obj) {
                var layEvent = obj.event; // 获得 lay-event 对应的值
                var data = obj.data; // 获得当前行数据
                if (layEvent === 'Productperformance_detail_table2') {
                    createDetailTable(data);
                }
            })
        } else if (layEvent === 'fold') {
            $(this).attr('lay-event', 'Productperformance_asinadd').html('+');
            tr.next().remove();
        }
    })

        $(document).off("click","#amazon_prodperformance_export").on("click","#amazon_prodperformance_export",function(){
            table.exportFile("Productperformance_datadetail_table", layui.table.cache.Productperformance_datadetail_table, '表现详情.xlsx')
        })

        /**
         * 创建点击加号按钮 时间
         * @param data 需要传入的数据
         */
        function createDetailTable(data) {
            var index = layer.open({
                type: 1,
                title: '表现详情',
                area: ['85%', '600px'],
                shadeClose: false,
                content: $('#Productperformance_tabledetail').html(),
                success: function (layero) {
                    $(layero).append('<permTag:perm funcCode="productperformance_export"><span style="position: absolute;top: 10px;left: 110px;"><a class="layui-btn layui-btn-xs" id="amazon_prodperformance_export">导出</a></span></permTag:perm>')
                    //渲染 asin数据start
                    $("#Productperformance_tabledetail_img").attr("src", data.picUrl);
                    var price;
                    if(data.minPrice === data.maxPrice){
                        price = data.maxPrice;
                    } else if (data.minPrice != data.maxPrice){
                        price = `${data.minPrice}-${data.maxPrice}`
                    } 
                    if(data.searchType === 2) {
                        // console.log("我是2")
                        var asinInfo = `ASIN: <a class="asin" target="_blank" style="color:#01AAED" href="${data.parentAsinSrc}">${data.parentAsin}</a> | 站点: ${data.siteName} | 店铺：${data.storeAcct} | 价格：${price} `
                    } else {
                        // console.log("我是1")
                        var asinInfo = `ASIN: <a class="asin" target="_blank" style="color:#01AAED" href="${data.asinSrc}">${data.asin }</a> | 站点: ${data.siteName} | 店铺：${data.storeAcct} | 价格：${price}`
                    }
                    $("#Productperformance_tabledetail_asin_info").html(asinInfo);
                    $("#Productperformance_detail_search_form_asin").val(data.asin);
                    imageLazyload();
                    //渲染 列表日期
                    var data1 = serializeObject($('#Productperformance_search_form'));
                    $("#Productperformance_detail_timerange_input").val(data1.Productperformance_timerange_input)
                    //日期范围
                    laydate.render({
                        elem: '#Productperformance_detail_timerange_input',
                        range: true,
                        done: function(value, date, endDate){
                            var datas = serializeObject($('#Productperformance_detail_search_form'));
                            datas.siteIdList = data.siteCode;
                            datas.storeAcctIds = data.storeAcctIdStr;
                            if(value && value.trim() != "") {
                                datas.postedDateStrStart = value.split(" - ")[0] + " 00:00:00";
                                datas.postedDateStrEnd = value.split(" - ")[1] + " 23:59:59";
                            };
                            if(data.searchType === 2){
                                datas.parentAsin = data.parentAsin;
                            } else {
                                datas.asin = data.asin;
                            }
                            searchDetailForm(datas);
                        }
                    });

                    // //绑定 明细里面的月周日的变化
                    form.on('select(Productperformance_detail_cycle)' ,function (operationData){
                        var datas = serializeObject($('#Productperformance_detail_search_form'));
                        datas.siteIdList = data.siteCode;
                        datas.storeAcctIds = data.storeAcctIdStr;
                        if(datas.Productperformance_detail_timerange_input) {
                            datas.postedDateStrStart = datas.Productperformance_detail_timerange_input.split(" - ")[0] + " 00:00:00";
                            datas.postedDateStrEnd = datas.Productperformance_detail_timerange_input.split(" - ")[1] + " 23:59:59";
                        };
                        if(data.searchType === 2){
                            datas.parentAsin = data.parentAsin;
                        } else {
                            datas.asin = data.asin;
                        }
                        searchDetailForm(datas);
                    })
                    var datas = serializeObject($('#Productperformance_detail_search_form'));
                    if(datas.Productperformance_detail_timerange_input) {
                        datas.postedDateStrStart = datas.Productperformance_detail_timerange_input.split(" - ")[0] + " 00:00:00";
                        datas.postedDateStrEnd = datas.Productperformance_detail_timerange_input.split(" - ")[1] + " 23:59:59";
                    };
                    form.render();
                    if(data.searchType === 2) {
                        var searchData = {
                            "parentAsin": data.parentAsin,
                            "postedDateStrStart": datas.postedDateStrStart,
                            "postedDateStrEnd": datas.postedDateStrEnd,
                            "statisticsPeriod": datas.statisticsPeriod,
                            "siteIdList":data.siteCode,
                            "storeAcctIds":data.storeAcctIdStr,
                        };
                    } else {
                        var searchData = {
                            "asin": data.asin,
                            "postedDateStrStart": datas.postedDateStrStart,
                            "postedDateStrEnd": datas.postedDateStrEnd,
                            "statisticsPeriod": datas.statisticsPeriod,
                            "siteIdList":data.siteCode,
                            "storeAcctIds":data.storeAcctIdStr,
                        };
                    }
                    
                    searchDetailForm(searchData);
                },
            })
        }


        // 站点渲染
        function fillsite() {
            $.ajax({
                url: `${ctx}/enum/getSiteEnum.html?platCode=amazon`,
                type: 'POST',
                dataType: 'json',
                success: function (returnData) {
                    if (returnData.code == "0000") {
                        var arr = [];
                        for (let i = 0; i < returnData.data.length; i++) {
                            var temp = {};
                            temp.name = returnData.data[i].name;
                            temp.value = returnData.data[i].code;
                            arr.push(temp);
                        }
                        formSelects.data('Productperformance_site', 'local', {arr: arr})
                    }
                }
            });
        };
        
        /**获取前一天时间区间**/
        function getLatestMonth() {
            var data = {};
            var nowdate = new Date();
            nowdate.setDate(nowdate.getDate() - 1);
            var y = nowdate.getFullYear();
            var m = nowdate.getMonth() + 1 < 10 ? "0" + (nowdate.getMonth() + 1) : nowdate.getMonth() + 1;
            var d = nowdate.getDate() < 10 ? "0" + nowdate.getDate() : nowdate.getDate();
            var formatwdate = y + '-' + m + '-' + d;
            data.createTimeEnd = Format(formatwdate, 'yyyy-MM-dd');
            data.createTimeStart = Format(formatwdate, 'yyyy-MM-dd');
            data.processStatus = "0";
            return data;
        };

    })
})()