/**
 * ebay广告 js
 */
    //选择指定商品---------选择添加的商品
    var ebayAd_selectedProduct = []
layui.use(['form', 'layer', 'table', 'laypage', 'laydate', 'element', 'upload', 'laytpl','echarts'], function() {
    var form = layui.form,
        table = layui.table,
        layer = layui.layer,
        element = layui.element,
        laydate = layui.laydate,
        laypage = layui.laypage,
        echarts = layui.echarts,
        $ = layui.$;
    //全局信息
    //定时器,ajax error时判断是否关闭
    var timer = null;
    //eBay产品类目
    var ebayProdCateCache = {};
    //用户拥有店铺
    var userStores = null;
    //ebay站点
    var ebaySites = null;

    //商品类型枚举数据
    var productsTypeEnumData = null
    //tree setting
    var setting = {
        check: {
            enable: true,
            chkStyle: "checkbox",
            chkDisabledInherit: true,
            chkboxType: { "Y": "s", "N": "s" }
        },
        data: {
            key: {
                children: "children",
                name: "cateName",
            },
            simpleData: {
                enable: true,
                idKey: "cateId",
                pIdKey: "pCateId",
            },
            view: {
                selectedMulti: true,
                showIcon: false
            }
        },
        callback: {
            onCheck: function(treeId, treeNode) {}
        },
    };
        //初始化加载
        //加载部门、人员、店铺
    render_hp_orgs_users("#ebayAddvertisement_searchForm");
    //加载用户拥有的店铺
    initUserStore();
    //加载eBay站点
    initEbaySite();
    //加载商品类型枚举数据
    initproductsTypeEnum()
    //初始化日期
    laydate.render({
        elem: '#ebayAddvertisement_searchForm input[name=searchDate]',
        type: 'date'
    });

    laydate.render({
        elem: '#syncTime',
        type: 'datetime'
    });

    form.render();

    //功能
    //搜索表单提交
    form.on('submit(ebayAddvertisement_searchBtn)', function(formData) {
        var data = formData.field;
        //渲染表格
        getebayAd_Tabledata(data)
    });

    //渲染表格
    function ebayad_tablerender(data) {
        table.render({
            elem: '#ebayAddvertisement_table',
            data: data,
            cols: [
                [
                    { checkbox: true, width: 30 },
                    { title: "广告活动名称", field: "campaignName" },
                    { title: "店铺", field: "storeAcctName" },
                    { title: "销售额", field: "saleAmount" },
                    { title: "销量", field: "saleNum",width:100 },
                    { title: "产品数量", field: "childNum",width:100 },
                    { title: "广告费", field: "adAmount",width:100 },
                    { title: "创建类型", field: "campaignType", templet: '<div>{{d.campaignType=="0"?"指定商品":"按照规则"}}</div>' },
                    { title: "时间", templet: '<div><div><span>开始时间</span>：<span>{{Format(d.startDate,"yyyy-MM-dd hh:mm:ss")}}</span></div><div><span>结束时间：</span><span>{{Format(d.endDate,"yyyy-MM-dd hh:mm:ss")}}</span?</div></div>' },
                    { title: "状态", field: "campaignStatus" },
                    { title: '操作', toolbar: '#ebayAddvertisement_tableBar', width: 80 }
                ]
            ],
            page: false,
            limit: 300,
            done: function(returnData) {
                $('#ebayAddvertisement_Tab').find('.layui-this').find('span').text(returnData.count)
            }
        });
    }
    //渲染分页
    function ebayAdrenderpage(count, current, limit) {
        laypage.render({
            elem: 'ebayAdpage',
            curr: current,
            limit: limit,
            limits: [100, 300, 500],
            layout: ['prev', 'page', 'next', 'limit'],
            count: count,
            jump: function(obj, first) {
                $('#ebayAddvertisement_searchForm input[name="limit"]').val(obj.limit);//保障下次的分页请求中带有的值正确
                $('#ebayAddvertisement_searchForm input[name="page"]').val(obj.curr);//保障下次的分页请求中带有的值正确
                //首次不执行
                if (!first) {
                    var data = getFormReqObj("ebayAddvertisement_searchForm");
                    data.page = obj.curr;
                    data.limit = obj.limit;
                    $('#ebayAddvertisement_searchBtn').click()
                }
            }
        });
    }

    function getFormReqObj(formIdName) {//获取表单参数
        var d = {};
        var t = $('#' + formIdName + ' [name]').serializeArray();
        $.each(t, function () {
            d[this.name] = this.value;
        });
        return d;
    }

    //促销状态tab切换重新查询
    element.on('tab(ebayAddvertisement_Tab)', function(data) {
        var index = $(this).attr('data-index')
        $('#ebayAddvertisement_searchForm input[name=showType]').val(index)
        $('#ebayAddvertisement_searchBtn').click();
    });
    //监听表格工具栏
    table.on('tool(ebayAddvertisement_table)', function(obj) {
        var data = obj.data, //获得当前行数据
            layEvent = obj.event;
        if (layEvent === 'ebayAd_edit') {
            //编辑广告
            getAdDetail(data,function(returnData){
                newandEditAdvertisement(returnData.data)
            })
        } else if (layEvent === 'ebayAd_delete') {
            //删除广告
            layer.confirm('确定删除该条广告活动吗?', function(index){
                const {campaignId,id,marketplaceId,storeAcctId}=data
                deleteCompaign({campaignId,id,marketplaceId,storeAcctId},function(returnData){
                    layer.msg(returnData.msg||'删除成功')
                    $('#ebayAddvertisement_searchBtn').click();
                    layer.close(index)
                })
            });
        } else if (layEvent === 'ebayAd_pause' || layEvent === 'ebayAd_run') {
            //暂停/启用广告
            layer.confirm('确定暂停该条广告活动吗?', function(index){
                const {campaignId,id,marketplaceId,storeAcctId}=data
                pauseAdCompaign({campaignId,id,marketplaceId,storeAcctId},function(returnData){
                    layer.msg(returnData.msg||'暂停成功')
                    $('#ebayAddvertisement_searchBtn').click();
                    layer.close(index)
                })
            });
        } else if (layEvent === 'ebayAd_stop') {
            //终止广告
            layer.confirm('确定终止该条广告活动吗?', function(index){
                const {campaignId,id,marketplaceId,storeAcctId}=data
                stopAdCompaign({campaignId,id,marketplaceId,storeAcctId},function(returnData){
                    layer.msg(returnData.msg||'终止成功')
                    $('#ebayAddvertisement_searchBtn').click();
                    layer.close(index)
                })
            });
        } else if(layEvent ==="ebayAd_reback"){
                        //恢复广告
                        layer.confirm('确定恢复该条广告活动吗?', function(index){
                            const {campaignId,id,marketplaceId,storeAcctId}=data
                            rebackCompaign({campaignId,id,marketplaceId,storeAcctId},function(returnData){
                                layer.msg(returnData.msg||'恢复成功')
                                $('#ebayAddvertisement_searchBtn').click();
                                layer.close(index)
                            })
                        });
            
        }else if(layEvent ==="ebayAd_update"){
            syncCampagin(data,function(returnData){
                layer.msg('更新成功'||returnData.msg)
                $('#ebayAddvertisement_searchBtn').click();
            })
        }else if (layEvent === 'ebayAd_performance') {
            //表现
            ebayAd_performance_pop(data)
        } else if (layEvent === "ebayAd_download") {
            //下载报告
            // location.url = "/ebayCampaign/downReport.html?storeAcctId=" +data.storeAcctId + "&campaignId=" + data.campaignId;
            layer.msg("广告下载时间较长;请勿重复点击！", {time: 5 * 1000});
            submitForm(data, ctx + '/ebayCampaign/downReport.html')

        }
    });

    //创建广告活动
    $('#createAdvertisement').click(function() {
            newandEditAdvertisement()
        })

    //同步店铺
    $('#ebayAdsyncStore').click(function(){
        var storeAcctId = $('#ebayAddvertisement_searchForm select[name="storeAcctId"]').val()
        var startDate = $('#LAY-ebayAddvertisement #syncTime').val()
        if(storeAcctId!=""&&startDate!=""){
            syncStore({storeAcctId,startDate},function(returnData){
                layer.msg('同步成功'||returnData.msg)
            })
        }else{
            layer.msg('请选择店铺和时间')
        }
    })

    // 广告表现弹框
    function ebayAd_performance_pop(data){
        layer.open({
            title: 'ebay广告表现',
            content:  $("#ebayAd_performance_tpl").html(),
            offset: '100px',
            area: ['80%','auto'],
            btn:['关闭'],
            success:function(){
                appendSelect('performace_form', 'perfomance_store', userStores, 'id', 'storeAcct')
                form.render(); 
                data.timeCycle = "7" 
                form.val("performace_form", data);  
                getEbayAdData(data,function(returnData){
                    displayPerformanceData(returnData)
                })
                form.on('submit(ebayAd_submitStaticData)',function(formdata){
                    getEbayAdData(formdata.field,function(returnData){
                        displayPerformanceData(returnData)
                    })
                })
            },
            yes: function(index, layero){
                layer.close(index); //如果设定了yes回调，需进行手工关闭
            }
        });
    }

    //获取数据展示
    function displayPerformanceData(data){
        console.log(data,'data')
        var titleObj = {'adFees':'ad fees($)','campaignNum':'Campaigns','clicks':'Clicks','impressions':'Impressions','promoted':'Listing promoted','saleAmount':'Sales','sold':'Sold'}            
        var extradata = []
            for(var i in data.extra){
                extradata.push({name:titleObj[i]+'( $)',number:data.extra[i]})
                $('#ebayAdperformance_Tab').find('li[data-index="'+i+'"] span').text(data.extra[i])
            }
        $('#ebayAdperformance_title').empty()
        var html = template('ebayAdperformance_title_tpl', {
            data: extradata
        })
        $('#ebayAdperformance_title').append(html)
        var sortData = {
            impressions:[],
            clicks:[],
            sold:[],
            analysisDateStr:[]
        }
        for(var i = data.data.length-1;i>=0;i--){
            sortData.impressions.push(data.data[i].impressions)
            sortData.clicks.push(data.data[i].clicks)
            sortData.sold.push(data.data[i].sold)
            sortData.analysisDateStr.push(data.data[i].analysisDateStr)
        }
        renderLineChart(sortData.impressions,sortData.analysisDateStr,'impressions')
        $('#ebayAdperformance_Tab li').click(function(){
            var index = $(this).attr('data-index')
            console.log(index)
            renderLineChart(sortData[index],sortData.analysisDateStr,index)
        })
    }

    //渲染折线图
    function renderLineChart(ydata,xdata,index){
        if ($.isEmptyObject(ydata)) {
            return false;
        }
        var eabyAd_lineChart_option = {
            title: {
                text: index,
            },
            grid: {
              left: 10,
              right: 10,
              bottom: 20,
              top: 60,
              containLabel: true
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'cross'
              },
              padding: [5, 10]
            },
            legend: {
                data: []
            },
            toolbox: {
                show: true,
            },
            calculable: true,
            xAxis: [
                {
                    type: 'category',
                    data:xdata
                }
            ],
            yAxis: [
                {
                    type: 'value',
                },
            ],
            series: [{
                name: index,
                type: 'bar',
                data: [],
                smooth: false,
                type: 'line',
                data: ydata,
                animationDuration: 2800,
                animationEasing: 'cubicInOut'
            }]
        };
        var myChart = echarts.init(document.getElementById('ebayAd_performance_linechart'));
        myChart.setOption(eabyAd_lineChart_option);
    }

    //获取广告表现数据
    function getEbayAdData(data,func){
        initAjax('/ebayCampaign/showAnalysisChart.html',
        'POST', JSON.stringify(data),
        function(returnData) {
           if(func){
               func(returnData)
           }
        },
    );
    }
        //初始化店铺
    function initUserStore() {
        initAjax('/sys/liststore.html',
            'POST', { roleNames: 'ebay专员', platCode: 'ebay' },
            function(returnData) {
                userStores = returnData.data;
            },
            'application/x-www-form-urlencoded'
        );
    }
    //初始化站点
    function initEbaySite() {
        initAjax('/ebayMarketingDiscount/getEbaySiteList.html',
            'GET', {},
            function(returnData) {
                ebaySites = returnData.data.ebaySiteList;
            },
            'application/x-www-form-urlencoded'
        );
    }

    //获取商品类型枚举数据 productsTypeEnumData

    function initproductsTypeEnum() {
        initAjax('/ebayCampaign/getListingConditionIds.html',
            'GET', {},
            function(returnData) {
                productsTypeEnumData = returnData.data;
            },
            'application/x-www-form-urlencoded'
        );
    }
    function getebayAd_Tabledata(data) {
        initAjax('/ebayCampaign/search.html',
            'post', JSON.stringify(data),
            function(returnData) {
                ebayad_tablerender(returnData.data)
                ebayAdrenderpage(returnData.count,data.page,data.limit)
                if(returnData.extra){
                    for(var i in returnData.extra){
                        $('#ebayAddvertisement_Tab').find('li[data-index="'+i+'"] span').text(returnData.extra[i])
                    }
                }
            }
        );
    }

    function syncStore(data,func) {
        initAjax('/ebayCampaign/syncStore.html',
            'post', data ,
            function(returnData) {
               if(func){
                   func(returnData)
               }
            },
            'application/x-www-form-urlencoded'
        );
    }

    function syncCampagin(data,func) {
        initAjax('/ebayCampaign/' + data.storeAcctId + '/' + data.campaignId + '/' + data.marketplaceId + '/syncCampaign.html',
            'post', JSON.stringify(data),
            function(returnData) {
               if(func){
                   func(returnData)
               }
            }
        );
    }

    //删除广告活动
    function deleteCompaign(data,func) {
        initAjax('/ebayCampaign/deleteCampaign.html',
            'post', JSON.stringify(data),
            function(returnData) {
               if(func){
                   func(returnData)
               }
            }
        );
    }

    //按照规则/指定产品创建广告
    function createAdByRules(data,func){
        initAjax('/ebayCampaign/createCampaignNew.html', 'post', JSON.stringify(data), function(returnData) {
            if(func){
                func(returnData)
            }
        })
    }

        //编辑广告
        function modifyAdByRules(data,func){
            initAjax('/ebayCampaign/updateCampaignNew.html', 'post', JSON.stringify(data), function(returnData) {
                if(func){
                    func(returnData)
                }
            })
        }

        //暂停广告
        function pauseAdCompaign(data,func){
            initAjax('/ebayCampaign/pauseCampaign.html', 'POST', JSON.stringify(data), function(returnData) {
                if(func){
                    func(returnData)
                }
            })
        }

        //终止广告
        function stopAdCompaign(data,func){
            initAjax('/ebayCampaign/endCampaign.html','POST', JSON.stringify(data), function(returnData) {
                if(func){
                    func(returnData)
                }
            })
        }

        //恢复广告
        function rebackCompaign(data,func){
            initAjax('/ebayCampaign/resumeCampaign.html','POST', JSON.stringify(data), function(returnData) {
                if(func){
                    func(returnData)
                }
            })
        }

    //获取广告详情
    function getAdDetail(data,func){
    initAjax('/ebayCampaign/getCampaignDetail.html','POST', JSON.stringify(data), function(returnData) {
        if(func){
            func(returnData)
        }
    })
}
    //所有选择的商品到平台请求一次获取费率
    function acquisitionRate(data,func){
        initAjax('/ebayCampaign/backShowTable.html', 'post', JSON.stringify(data), function(returnData) {
            if(func){
                func(returnData)
            }
        })
    }

    //选择指定产品-------------------------------PREPARED------------------------------------------------------------------------------------------------------------------------------------------------
    // 获取在线商品
    function getOnlineProducts(data) {
        const { limit, page, excludeItemIds, isSelected, currentPriceEnd, currentPriceStart, primaryCateIds, marketplaceId, storeAcctId,skus,itemIds,orderType,recommendType,storePrimaryCateIds, title } = data
        initAjax('/ebayCampaign/searchOnlineProduct.html',
            'POST', JSON.stringify({ limit, page, excludeItemIds, isSelected, currentPriceEnd, currentPriceStart, primaryCateIds, marketplaceId,skus,itemIds,orderType,recommendType, storeAcctId, storePrimaryCateIds, title }),
            function(returnData) {
                $('#ebayAd_selectableproduct li[data-index="0"]').find('span').text('(' + returnData.extra.notSelectedCount + ')')
                $('#ebayAd_selectableproduct li[data-index="1"]').find('span').text('(' + returnData.extra.isSelectedCount + ')')
                for (var i in returnData.data) {
                    returnData.data[i].isSelected = isSelected
                }
                table.render({
                    elem: '#ebayAd_OnlineProductTable',
                    data: returnData.data||[],
                    cols: [
                        [ //表头
                            { checkbox: true, width: 30 },
                            { title: "图片", field: "firstImage", templet: '#ebayAd_product_imageTpl' },
                            { title: "标题", field: "title", width: 200,templet: '#ebayAd_product_title' },
                            { title: "店铺父SKU", field: "storePSku" },
                            { title: "价格", field: "currentPrice", templet: '#ebayAd_product_currentPrice'},
                            { title: "在线数量", field: "quantity" },
                            { title: "销量", field: "soldNums" },
                            { title: "浏览量", field: "watchCount" },
                            { title: "时间", field: "listingEndTime", templet: "#ebayAd_product_time", width: 200 },
                            { title: "操作", field: "promotionEndTime", templet: "#ebayAd_product_Option" },
                        ]
                    ],
                    page: false,
                    limit: 300,
                    id: 'ebayAd_OnlineProductTable',
                    done: function(res, count) {
                        imageLazyload();
                    }
                })
                layui.laypage.render({
                    elem: 'ebayAd_chooseproduct',
                    count: returnData.count, //数据总数，从服务端得到
                    limit: limit,
                    limits: [50, 100, 300],
                    curr: page,
                    jump: function(obj, first) {
                        //obj包含了当前分页的所有参数，比如：
                        $('#ebayAd_searchOnlineProductForm input[name="limit"]').val(obj.limit)
                        $('#ebayAd_searchOnlineProductForm input[name="page"]').val(obj.curr)
                            //首次不执行
                        if (!first) {
                            $('#ebayAd_searchOnlineproducts').click()
                        }
                    }
                });
            })
    }

    table.on('tool(ebayAd_OnlineProductTable)', function(obj) {
        if (obj.event === "addproducts") {
            ebayAd_selectedProduct.push(obj.data.itemId)
            $('#ebayAd_searchOnlineproducts').click()
        } else if (obj.event === "removeproducts") {
            var index = ebayAd_selectedProduct.indexOf(obj.data.itemId)
            ebayAd_selectedProduct.splice(index, 1)
            $('#ebayAd_searchOnlineproducts').click()
        }
    })
    $(document).on('click', '.ebayAdchooseProduct', function() {
        var storeAcctId = $('#new_advertisement_form select[name=storeAcctId]').val();
        var marketplaceId = $('#new_advertisement_form select[name=marketplaceId]').val();
        if(storeAcctId!==""&&marketplaceId!==""){
        layer.open({
            type: 1,
            title: '选择指定产品',
            btn: ['保存', '关闭'],
            area: ['70%', '80%'],
            content: $('#pop_ebayAd_specificproduct').html(),
            success: function(layero, index) {
                form.render()
                $(layero).find('.layui-layer-btn0').addClass('hide')
                $(layero).find('#ebayAd_batchremove').addClass('hide')
                $("#ebayAd_chooseCategoryInput").click(debounce(function(event) {
                    event.stopPropagation()
                    event.preventDefault()
                    var index = $(this).attr('data-index')
                    getebayAdProductsTreepop(storeAcctId, marketplaceId)
                }, 1000, 2000))
                $('#ebayAd_searchOnlineproducts').click(function() {
                    var data = serializeObject($('#ebayAd_searchOnlineProductForm'))
                    if ($('#ebayAd_producttypeSpan').text() !== "All Inventory") {
                        var treeType = $('#ebayAd_producttypeSpan').text()
                        treeType === ">>eBay catrgories" ?
                            data.primaryCateIds = data.categoryids : data.storePrimaryCateIds = data.categoryids
                    }
                    data.excludeItemIds = ebayAd_selectedProduct.length > 0 ? ebayAd_selectedProduct.join(',') : ''
                    data.marketplaceId = marketplaceId //修改为当前站点
                    data.storeAcctId = storeAcctId //修改为当前店铺
                    getOnlineProducts(data)
                })
                $('#ebayAd_selectableproduct li').click(function() {
                    var isSelected = $(this).attr('data-index')
                    $('#ebayAd_searchOnlineProductForm input[name="isSelected"]').val(isSelected)
                    $('#ebayAd_searchOnlineproducts').click()
                    if (isSelected === "0") {
                        $(layero).find('.layui-layer-btn0').addClass('hide')
                        $(layero).find('#ebayAd_batchremove').addClass('hide')
                        $(layero).find('#ebayAd_batchadd').removeClass('hide')
                    } else {
                        $(layero).find('.layui-layer-btn0').removeClass('hide')
                        $(layero).find('#ebayAd_batchadd').addClass('hide')
                        $(layero).find('#ebayAd_batchremove').removeClass('hide')
                    }
                })
                $('#ebayAd_batchadd').click(function() {
                    var data = table.checkStatus('ebayAd_OnlineProductTable').data
                    if (data.length > 0) {
                        for (var i in data) {
                            ebayAd_selectedProduct.push(data[i].itemId)
                        }
                        $('#ebayAd_searchOnlineproducts').click()
                    } else {
                        layer.msg('请勾选要添加的商品')
                    }
                })
                $('#ebayAd_batchremove').click(function() {
                    var data = table.checkStatus('ebayAd_OnlineProductTable').data
                    if (data.length > 0) {
                        for (var i in data) {
                            var index = ebayAd_selectedProduct.indexOf(data[i].itemId)
                            ebayAd_selectedProduct.splice(index, 1)
                        }
                        $('#ebayAd_searchOnlineproducts').click()
                    } else {
                        layer.msg('请勾选要移除的商品')
                    }
                })
            },
            yes: function(index, layero) {
                //返回选择商品的itemid ----------------------
                var datas = table.checkStatus('ebayAd_OnlineProductTable').data;
                var exchangeData = {
                    marketplaceId:marketplaceId,
                    storeAcctId:storeAcctId,
                    campaignType:'0'
                }
                var campaignItemIds = datas.map(function(item){
                    const {itemId,currentPrice,bidPercentage} = item
                    return {itemId,currentPrice,bidPercentage}
                })
                exchangeData.campaignItemIds = campaignItemIds
                acquisitionRate(exchangeData,function(returnData){
                    layer.msg(returnData.msg||'获取费率成功')
                    var rateData = returnData.data
                    var ruleItemDom = $('.createByProductTable').parents('.layui-colla-item');
                    (rateData||[]).forEach(item => {
                        if (ruleItemDom.find(".createByProductTable tbody .item_id[data-id=" + item.itemId + "]").length == 0) {
                            //如果不存在，加一行
                            var html = template('ebayAd_createByProductsTrTpl', {
                                data: item
                            })
                            ruleItemDom.find(".createByProductTable tbody").append(html);
                            form.render()
                        }                    
                    });
                    ruleItemDom.find('span .listingIdNum').text(returnData.count)
                    layer.close(index);
                })
                return false;
            }
        });
    }else{
        layer.msg('请先选择店铺和站点')
    }
    })

    $(document).on('click', '.ebayAdchooseProduct', function() {
        var storeAcctId = $('#new_advertisement_form select[name=storeAcctId]').val();
        var marketplaceId = $('#new_advertisement_form select[name=marketplaceId]').val();
        if(storeAcctId!==""&&marketplaceId!==""){

    }else{
        layer.msg('请先选择店铺和站点')
    }
    })


    function newandEditAdvertisement(addata) {
        var title = addata?'编辑广告':'新增广告';
        layer.open({
            type: 1,
            title: title,
            btn: ['提交', '关闭'],
            area: ['60%', '60%'],
            content: $('#pop_new_advertisement').html(),
            success: function(layero,index) {
                laydate.render({
                    type: 'datetime',
                    elem: '#new_advertisement_form input[name=startDate]',
                    format: 'yyyy-MM-dd HH:mm:ss'
                });
                laydate.render({
                    type: 'datetime',
                    elem: '#new_advertisement_form input[name=endDate]',
                    format: 'yyyy-MM-dd HH:mm:ss'
                });
                layui.element.render("collapse");
                appendSelect('new_advertisement_form', 'storeAcctId', userStores, 'id', 'storeAcct')
                appendSelect('new_advertisement_form', 'marketplaceId', ebaySites, 'marketplaceId', 'siteName')
                form.render();
                if(addata){
                    addata.startDate = Format(addata.startDate,'yyyy-MM-dd hh:mm:ss')
                    addata.endDate = Format(addata.endDate,'yyyy-MM-dd hh:mm:ss')
                    form.val("new_advertisement_form", addata);
                    $(layero).find('select[name="campaignType"]').attr('disabled',true)
                    $(layero).find('input[name="startDate"]').attr('disabled',true)
                    setTimeout(function(){
                        refreshInventoryCriterionType()
                        $(layero).find('input[name="bidPercentage"]').val(addata.bidPercentage)
                        if(addata.campaignType=='0'){                           
                            (addata.campaignItemIds).forEach(item => {
                                if ($(layero).find(".createByProductTable tbody .item_id[data-id=" + item.itemId + "]").length == 0) {
                                    //如果不存在，加一行
                                    var html = template('ebayAd_createByProductsTrTpl', {
                                        data: item
                                    })
                                    $(layero).find(".createByProductTable tbody").append(html);
                                    ebayAd_selectedProduct.push(item.itemId)
                                    form.render()
                                }                    
                            });
                        }else{
                            $(layero).find('select[name="autoSelectFutureInventory"]').val(addata.autoSelectFutureInventory=='1'?"true":"false")
                            for (var item of addata.campaignCriterion) {
                                //操作dom
                                var categoryIds = item.cateId;
                                item.isedit = true;
                                item.productsTypeEnumData = productsTypeEnumData
                                $(layero).find('input[name="bidPercentage"]').attr('readonly',true)
                                $(layero).find('select[name="categoryScope"]').attr('disabled',true)
                                $(layero).find('.ebayAd_categoryChoose').attr('disabled',true)
                                if ($(layero).find(".categoryRuleTable tbody .cateName[data-id=" + categoryIds + "]").length == 0) {
                                    //如果不存在，加一行
                                    var html = template('ebayAd_categoryPriceTrTpl', {
                                        data: item
                                    })
                                    $(layero).find(".categoryRuleTable tbody").append(html);
                                    $(layero).find(".categoryRuleTable tbody").find('select').attr('disabled',true)
                                    $(layero).find(".categoryRuleTable tbody").find('input').attr('readonly',true)
                                    form.render()
                                }
                            }
                        }
                    },0)
                }else{
                    $(layero).find('select[name="campaignType"]').attr('disabled',false)
                    $(layero).find('input[name="startDate"]').attr('disabled',false)
                }
                initebayAd_Product();
                var ischeckedTag = 0
                form.on('checkbox(all)', function(data){
                    var allrow = $(layero).find('input[name="perrow"]')
                    $(data.elem).attr('checked',data.elem.checked)
                    if(data.elem.checked){
                        ischeckedTag=0
                        allrow.each(function(index,item){
                            $(item).attr('checked',true)
                            ischeckedTag++
                            $(item).next('.layui-form-checkbox').addClass('layui-form-checked')
                        })
                    }else{
                        ischeckedTag=0
                        allrow.each(function(index,item){
                            $(item).attr('checked',false)
                            $(item).next('.layui-form-checkbox').removeClass('layui-form-checked')
                        })
                    }
                  }); 
                  form.on('checkbox(perrow)', function(data){
                    $(data.elem).attr('checked',data.elem.checked)
                    var allrow = $(layero).find('input[name="perrow"]')
                    if(data.elem.checked){  
                        ischeckedTag++                
                        allrow.each(function(index,item){
                            if($(item).attr('checked')!=='checked'){
                                $(layero).find('input[name="all"]').attr('checked',false)
                                $(layero).find('input[name="all"]').next('.layui-form-checkbox').removeClass('layui-form-checked')
                                return;
                            }else{
                                if(index ==allrow.length-1){
                                    $(layero).find('input[name="all"]').attr('checked',true)
                                    $(layero).find('input[name="all"]').next('.layui-form-checkbox').addClass('layui-form-checked')
                                }
                            }
                        })
                    }else{
                        ischeckedTag--
                        $(layero).find('input[name="all"]').attr('checked',false)
                        $(layero).find('input[name="all"]').next('.layui-form-checkbox').removeClass('layui-form-checked')
                    }
                  }) 
                  $('body').on('click','.patchModifyRate',function(e){
                      e.stopPropagation()
                      e.preventDefault()
                      var commonRate = $(layero).find('input[name="patchRate"]').val();
                      if(commonRate!==""){
                        if(ischeckedTag>0){
                            var allrow = $(layero).find('input[name="perrow"]')
                            allrow.each(function(index,item){
                            if($(item).next('.layui-form-checkbox').hasClass('layui-form-checked')){
                                $(item).parents('tr').find('input[name="itembidPercentage"]').val(commonRate)
                            }
                            })
                        }else{
                            layer.msg('请勾选需要修改的数据')
                        }
                      }else{
                          layer.msg('请填写需要调整的费率')
                      }
                  })      
            },
            yes: function(index, layero) {
                var campaignCriterion = [],campaignItemIds=[]
                $(layero).find('tr[data-field="datarow"]').each(function(index,item){
                    var CriterionItem = {}
                    CriterionItem.categoryIds = $(item).find('.cateName').attr('data-id')
                    CriterionItem.cateName = $(item).find('.cateName').text()
                    CriterionItem.categoryScope = $(layero).find('select[name="categoryScope"]').val()
                    CriterionItem.listingConditionIds = $(item).find('select[name="listingConditionIds"]').val()
                    CriterionItem.maxPrice = $(item).find('input[name="maxPrice"]').val()
                    CriterionItem.minPrice = $(item).find('input[name="minPrice"]').val()
                    campaignCriterion.push(CriterionItem)
                })
                $(layero).find('tr[data-field="productrow"]').each(function(index,item){
                    var campaignItem = {}
                    campaignItem.itemId = $(item).find('.item_id').attr('data-id')
                    campaignItem.bidPercentage = $(item).find('input[name="itembidPercentage"]').val()
                    campaignItemIds.push(campaignItem)
                })
                form.on('submit(submitebayAd_editForm)',function(data){
                    if(data.field.campaignType=='1'){
                    data.field.campaignCriterion = campaignCriterion
                    }else{
                        $('.inventoryByRule').find('input[name="bidPercentage"]').attr('lay-verify',"")
                        data.field.campaignItemIds = campaignItemIds
                    }
                    if(addata){
                        data.field.campaignSysStatus = addata.campaignSysStatus
                        data.field.campaignId = addata.campaignId
                        data.field.id = addata.id
                        console.log(data.field)
                        //data.field.bidPercentage = $(layero).find('input[name="bidPercentage"]').val()
                        modifyAdByRules(data.field,function(returnData){
                            layer.msg(returnData.msg||'编辑成功')
                            $('#ebayAddvertisement_searchBtn').click();
                            layer.close(index)
                        })
                }else{
                    createAdByRules(data.field,function(returnData){
                        layer.msg(returnData.msg||'创建成功')
                        $('#ebayAddvertisement_searchBtn').click();
                        layer.close(index)
                    })
                }
                })
                $('#submitebayAd_editForm').click()
                // 
            },
            end:function(){
                ebayAd_selectedProduct=[]
            }
        });
    }

    //促销产品获取方式  全部/按规则/指定产品
    form.on('select(campaignType)', function(data) {
        refreshInventoryCriterionType();
    });
    //促销产品获取方式  全部/按规则/指定产品
    function refreshInventoryCriterionType() {
        $("#new_advertisement_form .layui-colla-item:first .layui-colla-title span").show();
        $("#new_advertisement_form .layui-colla-item").show();

        $("#new_advertisement_form .ebayAdProductBox .inventoryAny").hide();
        $("#new_advertisement_form .ebayAdProductBox .inventoryByRule").hide();
        $("#new_advertisement_form .ebayAdProductBox .inventoryByValue").hide();
        var campaignType = $("#new_advertisement_form .ebayAdProductBox select[name=campaignType]").val();
        if (campaignType == "1") {
            //按规则获取
        $('#new_advertisement_form').find('.producttipsspan').hide()    
        $("#new_advertisement_form").find('.RateIo').show();
        $("#new_advertisement_form").find('.inventoryByRule').show();
        } else if (campaignType == "0") {
            //按指定产品
            $('#new_advertisement_form').find('.producttipsspan').show()
            $("#new_advertisement_form").find('.RateIo').show();
            $("#new_advertisement_form").find('.inventoryByValue').show();
        } else {
            //全部产品
            $("#new_advertisement_form .ebayAdProductBox .inventoryAny").show();
            //只展示第一个item
            $("#new_advertisement_form .layui-colla-item:first .layui-colla-title span").hide();
            $("#new_advertisement_form .layui-colla-item:not(:first-child)").hide();
        }
        layui.form.render();
    }

    /**
     * 初始化促销产品
     */
    function initebayAd_Product() {
        $("#new_advertisement_form .ebayAdProductBox .ruleCriteria").append($('#ebayAd_ProductItemTpl').html());
    }

    //促销商品选择分类触发
    $(document).on('click', '#new_advertisement_form .inventoryByRule .ebayAd_categoryChoose', function() {
        var storeAcctId = $('#new_advertisement_form select[name=storeAcctId]').val();
        var marketplaceId = $('#new_advertisement_form select[name=marketplaceId]').val();
        var flag = 1
        if (!(storeAcctId && marketplaceId)) {
            layer.msg("请选选择店铺和站点", { icon: 0 });
            return;
        }
        var ruleItemDom = $(this).parents('.layui-colla-item');
        //获取分类类型
        var categoryScope = ruleItemDom.find('select[name="categoryScope"]').val();
        //获取类目
        var categoryData;
        if (categoryScope == 'MARKETPLACE') {
            //产品分类
            categoryData = loadEbayProdCate(storeAcctId, marketplaceId);
        } else if (categoryScope == 'STORE') {
            //店铺分类
            layer.msg("暂不支持店铺分类", { icon: 2 });
            return;
        } else {
            console.error("分类类型不正确：%s", categoryScope);
            return;
        }
        //选择分类
        var zTreeObj = {}
        if(flag){
        layer.open({
            type: 1,
            title: '选择产品分类',
            btn: ['保存', '关闭'],
            area: ['70%', '80%'],
            content: $('#ebayAd_categoryTreeTpl').html(),
            success: function(index, layero) {
                // zTree 的参数配置，深入使用请参考 API 文档（setting 配置详解）
                flag=0
                var setting = {
                    check: {
                        enable: true,
                        chkStyle: "checkbox",
                        chkDisabledInherit: true,
                        chkboxType: { Y: "s", N: "s" }
                    },
                    data: {
                        key: {
                            children: "children",
                            name: "cateName",
                        },
                        simpleData: {
                            enable: true,
                            idKey: "cateId",
                            pIdKey: "pCateId",
                        },
                        view: {
                            selectedMulti: true,
                            showIcon: false
                        }
                    },
                    callback: {
                        onCheck: function(event, treeId, treeNode) {
                            //禁用所有子类
                            if (treeNode.isParent) {
                                var childrenNodes = treeNode.children;
                                try {
                                    for (var i = 0; i <= childrenNodes.length; i++) {
                                        zTreeObj.setChkDisabled(
                                            childrenNodes[i],
                                            treeNode.checked,
                                            false,
                                            true
                                        );
                                    }
                                } catch (e) {
                                    console.log(e)
                                }
                                var childrenIds = getChildren([], treeNode);
                                for (var i = 0; i < childrenIds.length; i++) {
                                    var node = zTreeObj.getNodeByParam("cateId", childrenIds[i]);
                                    zTreeObj.checkNode(node, treeNode.checked, false, true);
                                }
                            }
                        }
                    },
                };
                // zTree 的数据属性，深入使用请参考 API 文档（zTreeNode 节点数据详解）
                zTreeObj = $.fn.zTree.init($("#ebayAd_categoryTree"), setting, categoryData);
                //回显已选中的值
                var selectedCateIds = [];
                ruleItemDom.find(".categoryRuleTable tbody .cateName").each(function() {
                    var selectedCateId = $(this).data("id");
                    var selectedNode = zTreeObj.getNodeByParam("cateId", selectedCateId);
                    zTreeObj.checkNode(selectedNode||[], true, true, true);
                });
            },
            yes: function(index, layero) {
                //获取非禁用、选中节点
                var selectNodes = zTreeObj.getCheckedNodes(true);
                // debugger;
                for (var selectNode of selectNodes) {
                    //操作dom
                    var cateId = selectNode.cateId;
                    var cateName = selectNode.cateName;
                    selectNode.productsTypeEnumData = productsTypeEnumData
                    if (ruleItemDom.find(".categoryRuleTable tbody .cateName[data-id=" + cateId + "]").length == 0) {
                        //如果不存在，加一行
                        var html = template('ebayAd_categoryPriceTrTpl', {
                            data: selectNode
                        })
                        ruleItemDom.find(".categoryRuleTable tbody").append(html);
                        //最后一行赋值
                        form.render()
                    }
                }
                layer.close(index);
            },
            end:function(){
                flag=1
            }
        });
    }

    });

    //选择类目弹框
    function getebayAdProductsTreepop(storeAcctId, marketplaceId) {
        var zTreeObj = {}
        layer.open({
            type: 1,
            title: '选择产品',
            btn: ['保存', '关闭'],
            area: ['70%', '80%'],
            content: $('#pop_ebayAdproductsTree').html(),
            success: function(index, layero) {
                form.render('radio');
                zTreeObj = $.fn.zTree.init($("#ebayAd_productsTree"), setting, loadEbayProdCate(storeAcctId, marketplaceId));
                form.on('radio(catetype)', function(obj) {
                    if (obj.value === 'eBay catrgories') {
                        //站点id
                        zTreeObj = $.fn.zTree.init($("#ebayAd_productsTree"), setting, loadEbayProdCate(storeAcctId, marketplaceId));
                    } else if ((obj.value === 'All Inventory')) {
                        zTreeObj = $.fn.zTree.init($("#ebayAd_productsTree"), setting, []);
                    }
                })
            },
            yes: function(index, layero) {
                var nodes = zTreeObj.getCheckedNodes(true);
                var choosename = (nodes || []).map(function(item) {
                    return item.cateName
                }).join('/')
                var chooseid = (nodes || []).map(function(item) {
                    return item.cateId
                }).join(',')
                $('#ebayAd_chooseCategoryidInput').val(chooseid)
                $('#ebayAd_chooseCategoryInput').val(choosename)
                $('#ebayAd_producttypeSpan').text($('input[name="catetype"]').val())
                layer.close(index)
            }
        });
    }
    /**
     * 加载eBay类目
     * @param storeAcctId
     * @param marketplaceId
     */
    function loadEbayProdCate(storeAcctId, marketplaceId, callback) {
        var cacheKey = /*storeAcctId + */ marketplaceId;
        if (!ebayProdCateCache[cacheKey]) {
            //如果缓存中没有，ajax同步方法加载
            layer.msg("初始化eBay商品类目,稍等一会");
            loading.show()
            $.ajax({
                url: ctx + '/ebayMarketingDiscount/getEbayProdCateList.html',
                type: 'get',
                dataType: 'json',
                async: false,
                data: {
                    "storeAcctId": storeAcctId,
                    "marketplaceId": marketplaceId
                },
                success: function(returnData) {
                    loading.hide()
                    if (returnData.code == '0000') {
                        ebayProdCateCache[cacheKey] = returnData.data;
                    } else {
                        layer.msg("加载eBay产品类目失败" + returnData.msg, { icon: 2 });
                    }
                },
                error: function() {
                    loading.hide();
                    layer.msg('网络错误，请联系管理员');
                }
            })
        }
        console.log("加载eBay产品类目树,%s,%s", storeAcctId, marketplaceId);
        if (callback) {
            callback(ebayProdCateCache[cacheKey]);
        }
        return ebayProdCateCache[cacheKey];
    }

    //获取ztree所有字节点id
    function getChildren(ids, treeNode) {
        ids.push(treeNode.cateId);
        if (treeNode.isParent) {
            for (var obj in treeNode.children) {
                getChildren(ids, treeNode.children[obj]);
            }
        }
        return ids;
    }
    //填充select选项
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
            option += '<option data-code="' + data[i].attachment + '" value="' + (data[i].code || data[i]) + '">' + (data[i].label || data[i]) + '</option>'
        }
        $('#' + pre + ' #' + dom).append(option)
    }
    //初始化ajax请求
    function initAjax(url, method, data, func, contentType, showLoading) {
        //默认loading
        if (!showLoading) {
            loading.show()
        }
        $.ajax({
            type: method,
            url: ctx + url,
            dataType: 'json',
            async: true,
            data: data,
            contentType: contentType || 'application/json',
            success: function(returnData) {
                loading.hide()
                if (returnData.code == "0000") {
                    func(returnData)
                } else if(returnData.code == "0001"){
                    layer.alert(returnData.msg, { icon: 2 });
                }else {
                    if (timer) {
                        clearProcessBar();
                    }
                    layer.msg(returnData.msg, { icon: 2 });
                }
            },
            error: function(returnData) {
                layui.admin.load.hide();
                if (XMLHttpRequest.status == 200) {
                    layer.msg("请重新登录", { icon: 7 });
                } else {
                    layer.msg("服务器错误");
                }
            },
            complete: function(returnData) {
                loading.hide()
            }
        });
    }
    //点击防抖函数
    function debounce(fn, delay, mustRunDelay) {
        var timer = null;
        var t_start;
        return function() {
            var context = this;
            var args = arguments;
            var t_curr = +new Date();
            clearTimeout(timer);
            if (!t_start) {
                t_start = t_curr;
                fn.apply(context, args);
            }
            if (t_curr - t_start >= mustRunDelay) {
                fn.apply(context, args);
                t_start = t_curr
            }
        }
    }
});
function removeThis(aDom,itemId){
    var itemId = aDom.parents('tr').find('.item_id').data('id')
    var index = ebayAd_selectedProduct.indexOf(itemId)
    ebayAd_selectedProduct.splice(index,1)
    aDom.parents('tr').remove();
}