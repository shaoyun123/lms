// 记录还原的数据
let shopee_accper_lastTab = 'acc_Performance'
layui.use(['admin', 'form', 'laydate', 'table','element','upload','formSelects','laytpl'], function() {
    var $ = layui.$,
        element = layui.element,
        table = layui.table,
        layer = layui.layer,
        formSelects = layui.formSelects,
        laytpl = layui.laytpl, 
        form = layui.form;
    render_hp_orgs_users("#shopee_accper_searchForm");//渲染部门销售员店铺三级联动
    form.render(null, 'component-form-element');
    element.render('breadcrumb', 'breadcrumb');
    shopee_accper_init()
    formSelects.render('shopee_accperformance_picNum')
    let shopee_accper_storeTableList = []

    function shopee_accper_init() {
        commonReturnPromise({
          type: "post",
          url: ctx + "/shopee/onlineProductShopee/getShopeeOnlineEnum.html",
        }).then(({ siteList }) => {
          formSelects.data("shopee_accer_site", "local", {
            arr: siteList.map((item) => ({ ...item, value: item.code })),
          })
        })
        // 店铺标签
        commonReturnPromise({
            url: '/lms/sysdict/getStoreTagByCode',
            type: 'post',
            params: {codes: 'shopee'}
        }).then(res=>{
            formSelects.data('shopee_accper_storeTagList','local',{arr: res.map(item=>({...item, value:item.name}))})
        })
        // GP
        commonReturnPromise({
            url: '/lms/salesplat/listAllMerchantName'
        }).then(res=>{
            formSelects.data('shopee_accper_search_GP','local',{arr: res.map(item=>({...item, value: item, name: item}))})
        })
    }

    form.on('submit(component-form-element)', function(data) {
        layer.msg(JSON.stringify(data.field));
        return false;
    });

    var acc_Performance_col = [[ //表头
        {
            field: 'storeAcct',
            title: '账户(shopId)',
            templet:'#accountTem_shopee',
            rowspan:2,
            sort:true,
        }, {
            field: "merchant",
            title: "GP<span class='ml5' lay-tips='店铺所属营业执照'><i class='layui-icon'>&#xe60b;</i><span>",
            templet: "<div>{{d.merchantName||''}}</br>{{d.merchantId||''}}</div>",
            rowspan:2,
        }, {
            field: 'salesman',
            title: '销售员',
            rowspan:2,
            sort:true,
        }, {
            field: 'customServicer',
            title: '客服',
            rowspan:2,
            sort:true,
        },{
            field: 'listingNum',
            title: '在线listing数量',
            rowspan:2,
            sort:true,
        }, {
            field: 'Fulfillment',
            title: 'Fulfillment',
            colspan:3
        }, {
            field: 'Shipping',
            title: 'Shipping',
            colspan:2
        }, {
            field: 'Customersatisfaction',
            title: 'Customer Satisfaction',
            colspan:4,
        }, {
            field: 'Listingviolations',
            title: 'Listing Violations',
            colspan:4
        }
    ],
    [
        {
            field:'cancellationRateMy',
            title:'取消率',
            templet:'#cancellationRate_shopee',
            sort:true,
        },
        {
            field:'nonFulfillmentRateMy',
            title:'未完成率',
            templet:'#non_shopee',
            sort:true,
        },
        {
            field:'returnRefundRate',
            title:'退货退款率',
            templet:'#return_refund_rate_shopee',
            sort:true,
        },
        {
            field:'averagePreparationTimeMy',
            title:'平均备货时间(天)',
            templet:'#average_shopee',
            sort:true,
        },{
            field:'lateShipmentRateTypeMy',
            title:'延迟发货率',
            templet:'#late_shopee',
            sort:true,
        },{
            field:'reviewRatingMy',
            title:'商品评分',
            templet:'#review_shopee',
            sort:true,
        },{
            field:'shopRatingMy',
            title:'店铺评分',
            templet:'#shop_shopee',
            sort:true,
        },{
            field:'responseRateMy',
            title:'回复速度',
            templet:'#response_shopee',
            sort:true,
        },{
            field:'responseTimeMy',
            title:'回复时间',
            templet:'#response_time_shopee',
            sort:true,
        },{
            field:'spamMy',
            title:'垃圾邮件违规',
            templet:'#spam_shopee',
            sort:true,
        },{
            field:'prohibitedMy',
            title:'禁止上市违规',
            templet:'#prohibited_shopee',
            sort:true
        },{
            field:'counterfeitMy',
            title:'假冒上市违规',
            templet:'#counterfeit_shopee',
            sort:true
        }
    ]],
    store_Info_col = [[ //表头
        {
             type: "checkbox" 
        } ,{
            field: 'storeAcctName',
            title: '店铺'
            ,width:'10%',
            templet: d=>{
                let tagDoms = ''
                if(d.storeTagList && d.storeTagList.length){
                    tagDoms = d.storeTagList.map(item=>`<span class="hp-badge layui-bg-blue" style="width:auto;padding:0 5px!important;">${item}</span>`).join('')
                }
                return `<div>${d.storeAcctName}${tagDoms}</div>`
            }
        }, {
            field: 'salesman',
            title: '销售员'
            ,width:'5%'
        },
        {
            field: 'customServicer',
            title: '客服',
            width:'5%'
        },
        {
            field: 'shopId',
            title: '店铺id',
            templet:'#shopee_shopeId_url'
            ,width:'7%'
        }, {
            field: 'storeAcct',
            title: '平台店铺名'
            ,width:'7%'
        }, {
            field: 'country',
            title: '站点'
            ,width:'5%'
        },{
            field:'shopDescription',
            title:'店铺描述',
            templet:'#shopDescription'
        // },{
        //     field:'images',
        //     title:'店铺图片',
        //     templet:'#shopee_store_images'
        //     ,width:'20%'
        },{
            field:'itemLimit',
            title:'店铺额度'
            ,width:'7%',
            templet: function(d){
                if(d.shopId){
                    let shopIdHref = `https://seller.shopee.cn/portal/product/list/all/listing-limit/?cnsc_shop_id=${d.shopId}`
                    return `<a class="shopId" target="_blank" href="${shopIdHref}">${d.itemLimit}</a>`
                }
                return d.itemLimit===undefined ? '' : d.itemLimit
            },
        },{
            field:'status',
            title:'状态',
            templet:'#shopee_store_status'
            ,width:'5%'
        },{
            field:'opation',
            title:'操作',
            templet:'#operationTpl'
            ,width:'5%'
        }
    ]],
    store_compliance_rate_col =[[
        {
            field: 'supervisor',
            title: '销售主管'
        }, {
            field: 'storeCount',
            title: '店铺数量'
        },
        {
            field: 'stockingReachCount',
            title: '平均备货达标店铺数',
        },
        {
            field: 'stockingReachRate',
            title: '平均备货天数达标率',
        }, {
            field: 'scoreReachCount',
            title: '店铺评分达标店铺数',
        }, {
            field: 'scoreReachRate',
            title: '店铺评分达标店铺率',
        }
    ]],
    publish_sale_erformance_col = [[
        {
            field: 'storeAcct',
            title: '店铺(shopId)',
            templet: function(d){
                let tagDoms = ''
                if(d.storeTagList && d.storeTagList.length){
                    tagDoms = d.storeTagList.map(item=>`<span class="hp-badge layui-bg-blue" style="width:auto;padding:0 5px!important;">${item}</span>`).join('')
                }
                return `${d.storeAcct||''}<br>(${d.shopId||''})${tagDoms}`
            },
            sort:true,
        },{
            field: "merchant",
            title: "GP<span class='ml5' lay-tips='店铺所属营业执照'><i class='layui-icon'>&#xe60b;</i><span>",
            templet: "<div>{{d.merchantName||''}}</br>{{d.merchantId||''}}</div>"
        }, {
            field: 'salesperson',
            title: '销售',
            sort:true,
        },{
            field: 'orgName',
            title: '部门',
            sort:true,
        },{
            field: 'storeListingLimit',
            title: '店铺额度',
            templet: function(d){
                if(d.shopId){
                    let shopIdHref = `https://seller.shopee.cn/portal/product/list/all/listing-limit/?cnsc_shop_id=${d.shopId}`
                    return `<a class="shopId" target="_blank" href="${shopIdHref}">${d.storeListingLimit}</a>`
                }
                return d.storeListingLimit
            },
            // templet: "<a class='shopId' target='_blank' href='https://seller.shopee.cn/portal/product/list/all/listing-limit/?cnsc_shop_id={{d.shopId}}'>{{d.storeListingLimit}}</a>",
            sort:true,
        },{
            field: 'onlineItemCount',
            title: '在线listing数量',
            sort:true,
        },{
            field: 'shopee_accer_listingLimit',           
            title: '可刊登数量',
            templet: function(d){
                return d.listingLimit
            },
            sort:true,
        },{
            field: 'shopee_accer_listingLimitRate',
            title: '可刊登率',
            templet: function(d){
                let str =''
                if (d.listingLimitRate != null) {
                    str = d.listingLimitRate + "%";
                }
                return str
            },
            sort:true,
        },{
            field: 'zeroStockItemNum',
            title: 'listing全标零数量',
            sort:true,
        },{
            field: 'zeroStockItemRatio',
            title: 'listing全标零占比',
            templet:'<div>{{d.zeroStockItemRatio}}%</div>',
            sort:true,
        },{
            field: 'nonZeroBannedNum',
            title: '违规(流量非0)',
            sort:true,
        },{
            field: 'nonZeroUnlistOrCheckNum',
            title: '审查中&暂时下架(流量非0)',
            sort:true,
        },{
            field: 'zeroUnlistOrCheckNum',
            title: '审查中&暂时下架(流量0)',
            sort:true,
        },{
            field: 'ordersCountFifteenDays',
            title: '近15天单数<br>合计/日均',
            templet:'<div>{{d.ordersCountFifteenDays}}/{{d.ordersAverageCountFifteenDays}}</div>',
            sort:true,
        },{
            field: 'ordersCountThirtyDays',
            title: '近30天单数<br>合计/日均',
            templet:'<div>{{d.ordersCountThirtyDays}}/{{d.ordersAverageCountThirtyDays}}</div>',
            sort:true,
        },{
            field: 'ordersCountNinetyDays',
            title: '近90天单数<br>合计/日均',
            templet:'<div>{{d.ordersCountNinetyDays}}/{{d.ordersAverageCountNinetyDays}}</div>',
            sort:true,
        },{
            field: 'salesAmountThirty',
            title: '近30天销售额（人民币）',
            sort:true,
        },{
            field: 'salesAmountThirtyUsd',
            title: '近30天销售额（美元）',
            sort:true,
        },{
            field: 'salesPerAmountThirty',
            title: '近30天客单价（美元）',
            sort:true,
        // },{
        //     field: 'scoreReachRate',     //暂不展示 字段是错的
        //     title: '降价标准',
        },{
            field: 'openingDays',
            title: '开店天数',
            sort:true,
        },{
            field: 'storeCreateTime',
            title: '开店时间',
            templet:'<div>{{ Format(d.storeCreateTime,"yyyy-MM-dd hh:mm:ss")}}</div>',
            sort:true,
        // },{
        //     field: 'scoreReachRate',   //暂不展示 字段是错的
        //     title: '是否降价',
        },{
            field: 'publishSalePublishListingNum',           
            title: '<span class="first">3</span>/<span class="second">7</span>日店铺刊登listing数',
            templet: function(d){
                const sevenSalesStr ='3日：'+ (d.threePublishListingNum === undefined ? '' : d.threePublishListingNum)
                const thirtySalesStr = '7日：'+  (d.sevenPublishListingNum === undefined ? '' : d.sevenPublishListingNum)
                return sevenSalesStr+'<br>'+thirtySalesStr
            },
            sort:true,
        },{
            field: 'publishSalelistingSale',           
            title: '<span class="first">7</span>/<span class="second">30</span>/<span class="third">90</span>日销量>0的listing数',
            templet: function(d){
                const sevenSalesStr ='7天：'+ d.sevenSalesListingNum    
                const thirtySalesStr = '30天：'+  d.thirtySalesListingNum        
                const ninetySalesStr = '90天：'+ d.ninetySalesListingNum    
                return sevenSalesStr+'<br>'+thirtySalesStr+'<br>'+ninetySalesStr
            },
            sort:true,
        },{
            field: 'publishSalegrossRate',           
            title: '<span class="first">毛利率</span>/<span class="second">优惠幅度</span>/<span class="third">平台提成</span>',
            templet: function(d){
                const arr = [d.grossRate||'_',d.discountRate||'_',d.platDeduct||'_']
                let str = ''
                if(d.grossRate!==undefined || d.discountRate!==undefined ||d.platDeduct!==undefined ){
                    str = arr.join('/')
                }
                return str
            },
            sort:true,
        },
    ]]
    ;


    //封装表格渲染函数
    let shopeeAccerSortNumObj = {
        publishSalePublishListingNumAsc:0,
        publishSalePublishListingNumDesc:0,
        publishSalelistingSaleAsc:0,
        publishSalelistingSaleDesc:0,
        publishSalegrossRateAsc:0,
        publishSalegrossRateDesc:0,
    }
    function tablerender(tablename){
        // 将 shopeeAccerSortNumObj 置空
        Object.keys(shopeeAccerSortNumObj).forEach(item=>{
            shopeeAccerSortNumObj[item]=0
        })
        //不同表名对应对应请求url
        var urlbobj = {
            "acc_Performance": "/shopee/shopeeAccountPerformance/getShopeeAccountPerformance.html",
            "store_Info": "/shopee/shopeeAccountPerformance/getShopeeStoreAccount.html",
            "store_rate": "/shopee/shopeeAccountPerformance/getShopeeStoreRate.html",
            "publish_sale": "/shopee/shopeeAccountPerformance/getShopeeStoreListingAndSalePerformence",
        };
        commonReturnPromise({
            url:ctx +urlbobj[tablename],
            contentType: tablename =='publish_sale' ? 'application/json;charset=UTF-8' : '',
            type: 'post',
            params: tablename =='publish_sale' ? JSON.stringify(getSearchData(tablename)): getSearchData(tablename),
        }).then(res=>{
            $('#shopee_accper_dataCount_num').text(res.length);
            res = res || []
            if (tablename == "acc_Performance") {
                $('#shopee_accper_dataCount_num1').text(res.length);
            }else if (tablename == "store_Info") {
                $('#shopee_accper_dataCount_num2').text(res.length);
                for(var i = 0;i<res.length;i++){
                     if(res[i].shopDescription){
                        res[i].shopDescription = res[i].shopDescription.replace(/\n/g, '<br>');
                     }
                }
            }else if(tablename == "store_rate"){
                $('#shopee_accper_dataCount_num3').text(res.length);
                for(var i = 0;i<res.length;i++){
                    var obj=  res[i];
                    if(obj.stockingReachRate !=null ){
                        obj.stockingReachRate=obj.stockingReachRate+"%";
                    }
                    if(obj.scoreReachRate !=null ){
                        obj.scoreReachRate=obj.scoreReachRate+"%";
                    }
                }
            } else if (tablename == 'publish_sale') {
                $("#shopee_accper_dataCount_num4").text(res.length);
            }
            tableRenderData(res,tablename)
        })
    }

    function tableRenderData(data,tablename,changeColorObj={}){
        //不同表名对应表头列数据对象
        var obj = {
            'acc_Performance': acc_Performance_col,
            'store_Info': store_Info_col,
            'store_rate': store_compliance_rate_col,
            'publish_sale': publish_sale_erformance_col
        }
        table.render({
            elem: "#shopee_accper_data_table",
            data,
            cols:obj[tablename],
            done: function(res, curr, count){
               if(tablename === 'publish_sale' &&changeColorObj.class){
                const trDom = $('#shopee_accper_data_table').next().find('thead tr')
                trDom.find(`th[data-field="${changeColorObj.filed}"]`).find(`.${changeColorObj.class}`).css('color','#FF5722')
               }
                if(res.data && Array.isArray(res.data)){
                    shopee_accper_storeTableList = tablename == "store_Info"
                        ? [
                            res.data.map((item) => ({
                            id: item.id,
                            storeAcctId: item.storeAcctId,
                            images:
                                item.images != "" && item.images != undefined
                                ? JSON.parse(item.images)
                                : [],
                            })),
                        ]
                        : []
                    table.on('sort(acc_Performance)',function(obj) {
                        const { field , type} = obj
                        // 刊登及销售表现 3/7日店铺刊登listing数
                        if(field === 'publishSalePublishListingNum'){
                            let byFiledList =[
                                {class:'first',key:'threePublishListingNum',filed:'publishSalePublishListingNum'},
                                {class:'second',key:'sevenPublishListingNum',filed:'publishSalePublishListingNum'},
                            ]
                            changeTheadColorAndSort({type,byFiledList})
                        // 刊登及销售表现 7/30/90日销量>0的listing数
                        }else if(field === 'publishSalelistingSale'){
                            let byFiledList =[
                                {class:'first',key:'sevenSalesListingNum',filed:'publishSalelistingSale'},
                                {class:'second',key:'thirtySalesListingNum',filed:'publishSalelistingSale'},
                                {class:'third',key:'ninetySalesListingNum',filed:'publishSalelistingSale'},
                            ]
                            changeTheadColorAndSort({type,byFiledList})
                        // 刊登及销售表现 毛利率/优惠幅度/平台提成
                        }else if(field === 'publishSalegrossRate'){
                            let byFiledList =[
                                {class:'first',key:'grossRate',filed:'publishSalegrossRate'},
                                {class:'second',key:'discountRate',filed:'publishSalegrossRate'},
                                {class:'third',key:'platDeduct',filed:'publishSalegrossRate'},
                            ]
                            changeTheadColorAndSort({type,byFiledList,})
                        }
                    })
                } else {
                    shopee_accper_storeTableList = []
                }
            },
            id: tablename,
            limit:999999,
            page:false,
        });
    }

    function changeTheadColorAndSort({type,byFiledList}){
        let filedSpanIndex= 0
        if(type==='desc'){
            filedSpanIndex = shopeeAccerSortNumObj.publishSalegrossRateDesc % byFiledList.length
            table.cache.publish_sale = table.cache.publish_sale.sort((a,b)=>b[byFiledList[filedSpanIndex].key]- a[byFiledList[filedSpanIndex].key])
            shopeeAccerSortNumObj.publishSalegrossRateDesc = shopeeAccerSortNumObj.publishSalegrossRateDesc + 1
        }else{
            filedSpanIndex = shopeeAccerSortNumObj.publishSalegrossRateAsc % byFiledList.length
            table.cache.publish_sale = table.cache.publish_sale.sort((a,b)=>a[byFiledList[filedSpanIndex].key]- b[byFiledList[filedSpanIndex].key])
            shopeeAccerSortNumObj.publishSalegrossRateAsc = shopeeAccerSortNumObj.publishSalegrossRateAsc + 1
        }
        tableRenderData(table.cache.publish_sale,'publish_sale',byFiledList[filedSpanIndex])
    }


    //获取表单数据
    function getSearchData(tablename){
         var data = serializeObject($('#shopee_accper_searchForm'));
         if(data!=null && data.salespersonId !=null && data.salespersonId !='' ){
             data.salepersonId=data.salespersonId;
         }
        //  if(tablename !== 'store_Info'){
        //     delete data.imgSizes
        //  }
         if(tablename !== 'store_Info' && tablename !== 'publish_sale'){
            delete data.salesSites
         }
        // //  现在后端统一用storeAcctId，用storeId不能用店铺单独查询
        // data.storeAcctIds = data.storeAcctIds.split(',')
         if(tablename == 'publish_sale'){
             data.storeAcctIdList = data.storeAcctIds.split(',').filter(item=>item!=='').map(item=>Number(item))
             data.siteIdList = data.salesSites==='' ?[] :data.salesSites.split(',')
             delete data.storeAcctIds
             //  店铺标签
             data.storeTagList = data.storeTagList ? data.storeTagList.split(',') : []
             data.merchantNameList = data.merchantNameList ? data.merchantNameList.split(',') : []
         }
         if(tablename == 'store_Info'){
            delete data.merchantNameList
         }
         if(tablename == 'store_rate'){
            delete data.merchantNameList
         }
         return data;
    }
 
    $('#shopee_accper_search').click(function(){
        var title = $('.table_tab .layui-this').attr('data-title');
        tablerender(title);
    });

    $('.table_tab ul li').click(function(){
        var title = $(this).attr('data-title');
        let _threeTabs =['acc_Performance' ,'store_Info' ,'publish_sale']
        const _lastTab =_threeTabs.includes(shopee_accper_lastTab)
        const _title =_threeTabs.includes(title) 
        if(_lastTab!==_title){
            let getTpl = shopee_accer_store_sel_tpl.innerHTML
            let view = document.getElementById('shopee_accer_store_sel_div');
            laytpl(getTpl).render(title, function(html){
            view.innerHTML = html;
            });
            render_hp_orgs_users("#shopee_accper_searchForm")
            $('#shopee_accer_depart_sel').next().find('dd[lay-value=""]').trigger('click')
        }
        if (title == 'store_Info') {
            $('#exportBtn_shopee').hide()
            if($('#shopee_accper_searchForm').find('.onlyStoreInfoTab').css('display')=='none'){
                $('#shopeeaccperformCard').find('.onlyStoreInfoTab').addClass('disflex')
                $('.onlyStoreInfoTab').show()
            }
        } else {
            $('#exportBtn_shopee').show()
            $('#shopeeaccperformCard').find('.onlyStoreInfoTab').removeClass('disflex')
            $('.onlyStoreInfoTab').hide()
        }
        if(title == 'store_Info' || title == "publish_sale"){
            $('.onlyStoreInfoPublishSaleTab').show()
        }else{
            $('.onlyStoreInfoPublishSaleTab').hide()
        }
        if(title=='publish_sale'){
            $('.onlyPublishSaleTab').show()
        }else{
            $('.onlyPublishSaleTab').hide()
        }
        if(title == 'store_rate'){
            $('.notInStoreRate').hide()
        }else{
            $('.notInStoreRate').show()
        }
        if(title =='publish_sale' || title == 'acc_Performance'){
            $('.showInAccPerformancePublishSale').show()
        }else{
            $('.showInAccPerformancePublishSale').hide()
        }
        shopee_accper_lastTab = title
        tablerender(title);
    });
    /**初始化客服人员查询**/
    shopeeAccerformance_getSalesPerson();
    function shopeeAccerformance_getSalesPerson() {
        $("#shopee_accer_customServicer_sel").html("");
        $.ajax({
            type: "post",
            url: ctx + "/sys/listuserbyrole.html",
            data: {role: "shopee客服"},
            dataType: "json",
            async: false,
            success: function (returnData) {
                if (returnData.code != "0000") {
                    layer.alert(returnData.msg,{icon:5});
                } else {
                    var str = '<option value=""></option>';
                    var datas = returnData.data;
                    if (datas.length > 0) {
                        for (var i = 0; i < datas.length; i++) {
                            str += '<option value="' + datas[i].id + '">' + datas[i].userName + '</option>';
                        }
                    }
                    $("#shopee_accer_customServicer_sel").html(str);
                }
            }
        });
    }
    //悬浮显示全部错误信息
    $("body").on('mouseover', '.shopee_storeAcct', function() {
        var content = "<pre>" + $(this).next("pre").text() + "</pre>";
        var color = 'green';
        if(content.indexOf("同步成功")==-1){
            color = 'red';
        }
        layer.tips(content, $(this),{
            tips: [2, color],
            time: 0
        });
    });
    $("body").on('mouseout', '.shopee_storeAcct', function() {
        layer.closeAll('tips');
    });

    //悬浮显示全部错误信息
    $("body").on('mouseover', '.cancellationRate_shopee', function() {
        var content = "<pre>" + $(this).next("pre").text() + "</pre>";
        var color = 'green';
        if(content.indexOf("超出指标")!=-1){
            color = 'red';
        }
        layer.tips(content, $(this),{
            tips: [2, color],
            time: 0
        });
    });
    $("body").on('mouseout', '.cancellationRate_shopee', function() {
        layer.closeAll('tips');
    });

    //悬浮显示全部错误信息
    $("body").on('mouseover', '.non_shopee', function() {
        var content = "<pre>" + $(this).next("pre").text() + "</pre>";
        var color = 'green';
        if(content.indexOf("超出指标")!=-1){
            color = 'red';
        }
        layer.tips(content, $(this),{
            tips: [2, color],
            time: 0
        });
    });
    $("body").on('mouseout', '.non_shopee', function() {
        layer.closeAll('tips');
    });

    //悬浮显示全部错误信息
    $("body").on('mouseover', '.average_shopee', function() {
        var content = "<pre>" + $(this).next("pre").text() + "</pre>";
        var color = 'green';
        if(content.indexOf("超出指标")!=-1){
            color = 'red';
        }
        layer.tips(content, $(this),{
            tips: [2, color],
            time: 0
        });
    });
    $("body").on('mouseout', '.average_shopee', function() {
        layer.closeAll('tips');
    });

    $("body").on('mouseover', '.late_shopee', function() {
        var content = "<pre>" + $(this).next("pre").text() + "</pre>";
        var color = 'green';
        if(content.indexOf("超出指标")!=-1){
            color = 'red';
        }
        layer.tips(content, $(this),{
            tips: [2, color],
            time: 0
        });
    });
    $("body").on('mouseout', '.late_shopee', function() {
        layer.closeAll('tips');
    });

    $("body").on('mouseover', '.shop_shopee', function() {
        var content = "<pre>" + $(this).next("pre").text() + "</pre>";
        var color = 'green';
        layer.tips(content, $(this),{
            tips: [2, color],
            time: 0
        });
    });
    $("body").on('mouseout', '.shop_shopee', function() {
        layer.closeAll('tips');
    });

    $("body").on('mouseover', '.response_shopee', function() {
        var content = "<pre>" + $(this).next("pre").text() + "</pre>";
        var color = 'green';
        if(content.indexOf("低于指标")!=-1){
            color = 'red';
        }
        layer.tips(content, $(this),{
            tips: [2, color],
            time: 0
        });
    });
    $("body").on('mouseout', '.response_shopee', function() {
        layer.closeAll('tips');
    });

    $("body").on('mouseover', '.response_time_shopee', function() {
        var content = "<pre>" + $(this).next("pre").text() + "</pre>";
        var color = 'green';
        if(content.indexOf("高于指标")!=-1){
            color = 'red';
        }
        layer.tips(content, $(this),{
            tips: [2, color],
            time: 0
        });
    });
    $("body").on('mouseout', '.response_time_shopee', function() {
        layer.closeAll('tips');
    });

    $("body").on('mouseover', '.spam_shopee', function() {
        var content = "<pre>" + $(this).next("pre").text() + "</pre>";
        var color = 'green';
        if(content.indexOf("高于指标")!=-1){
            color = 'red';
        }
        layer.tips(content, $(this),{
            tips: [2, color],
            time: 0
        });
    });
    $("body").on('mouseout', '.spam_shopee', function() {
        layer.closeAll('tips');
    });

    $("body").on('mouseover', '.prohibited_shopee', function() {
        var content = "<pre>" + $(this).next("pre").text() + "</pre>";
        var color = 'green';
        if(content.indexOf("高于指标")!=-1){
            color = 'red';
        }
        layer.tips(content, $(this),{
            tips: [2, color],
            time: 0
        });
    });
    $("body").on('mouseout', '.prohibited_shopee', function() {
        layer.closeAll('tips');
    });

    $("body").on('mouseover', '.counterfeit_shopee', function() {
        var content = "<pre>" + $(this).next("pre").text() + "</pre>";
        var color = 'green';
        if(content.indexOf("高于指标")!=-1){
            color = 'red';
        }
        layer.tips(content, $(this),{
            tips: [2, color],
            time: 0
        });
    });
    $("body").on('mouseout', '.counterfeit_shopee', function() {
        layer.closeAll('tips');
    });

    $("body").on('mouseover', '.review_shopee', function() {
        var content = "<pre>" + $(this).next("pre").text() + "</pre>";
        var color = 'green';

        layer.tips(content, $(this),{
            tips: [2, color],
            time: 0
        });
    });
    $("body").on('mouseout', '.review_shopee', function() {
        layer.closeAll('tips');
    });

    $("#exportBtn_shopee").click(function () {
        // 
        var title = $('.table_tab .layui-this').attr('data-title');
        //不同tab名对应对应请求url
        var urlbobj = {
            "acc_Performance": "/shopee/shopeeAccountPerformance/exportShopeeAccountPerformance.html",
            // "store_Info": "/shopee/shopeeAccountPerformance/getShopeeStoreAccount.html",
            "store_rate": "/shopee/shopeeAccountPerformance/exportShopeeStoreRate",
            "publish_sale": "/shopee/shopeeAccountPerformance/exportShopeeStoreListingAndSalePerformance",
        };
        var name = {
            "acc_Performance": "确认导出当前搜索条件账号表现?",
            // "store_Info": "确认导出当前搜索条件店铺信息?",
            "store_rate": "确认导出当前店铺达标率统计?",
            "publish_sale": "确认导出当前搜索条件刊登及销售表现?",
        }

        var data = {};
        if(title=='acc_Performance'){
            data.salepersonId = $.trim($("#shopee_accper_searchForm select[name='shopee_salesman']").val());
            data.storeAcctIds = formSelects.value('shopee_accer_store_sel','val')
            data.orgId = $.trim($('#shopee_accer_depart_sel').val())
            data.storeTagList = formSelects.value('shopee_accper_storeTagList', 'valStr')
            data.merchantNameList = formSelects.value('shopee_accper_search_GP', 'valStr')
            layer.confirm(name[title], { btn: ['确认', '取消'] }, function() {
                submitForm(data, ctx + urlbobj[title])
                layer.closeAll('dialog');//关闭选择框
            });
        }else if(title=='store_rate'){
            data = serializeObject($("#shopee_accper_searchForm"))
            if(data!=null && data.salespersonId !=null && data.salespersonId !='' ){
                data.salepersonId=data.salespersonId;
            }
            delete data.merchantNameList
            // delete data.imgSizes
            layer.confirm(name[title], { btn: ['确认', '取消'] }, function() {
                submitForm(data, ctx + urlbobj[title])
                layer.closeAll('dialog');//关闭选择框
            });
        }else if(title=='publish_sale'){
            data =serializeObject($("#shopee_accper_searchForm"))
            data.storeAcctIdList = data.storeAcctIds.split(',').filter(item=>item!=='').map(item=>Number(item))
            //  店铺标签
            data.storeTagList = data.storeTagList ? data.storeTagList.split(',') : []
            data.merchantNameList = data.merchantNameList ? data.merchantNameList.split(',') : []
            delete data.storeAcctIds
            layer.confirm(name[title], { btn: ['确认', '取消'] }, function() {
                transBlob({
                    url: ctx + urlbobj[title],
                    formData: JSON.stringify(data),
                    fileName: `Shopee店铺刊登及销售表现${Format(new Date().getTime(),'yyyy-MM-dd')}.xlsx`,
                    contentType: 'application/json'
                }).then(function (result) {
                    loading.hide();
                    layer.closeAll('dialog');//关闭选择框
                }).catch(function (err) {
                    layer.msg(err, { icon: 2 });
                });
            });
        }
    })

    // 确认
    $("#shopee_accper_picConfim").click(function () {
        const curType = $('#shopeeaccperformCard').find('select[name=picOperat]').val()
        const TypeEnum={
            add:'add',
            replace:'replace',
            restore:'restore'
        }
        // type值为 add,replace,restore
        //图片URL。支持填入0-5项
        if(curType==TypeEnum.restore){
            shopee_accper_restorePic()
        }else{
            const { data } = table.checkStatus("store_Info")
            if(!data.length) return layer.msg('请选择数据',{icon:7})
            const picUrlList = $('#shopeeaccperformCard').find('input[name=picUrl]').val().replace('，',',').split(',').filter(item=>item!=='')
            if(!picUrlList.length ) return layer.msg('请输入有效数据',{icon:7})
            // 正则校验图片地址
            const isImgType = picUrlList.every(item=>shopee_accper_is_img_url(item,true))
            if(!isImgType) return layer.msg('请输入正确的图片URL',{icon:7})
            curType==TypeEnum.add && shopee_accper_addPic(picUrlList)
            curType==TypeEnum.replace && shopee_accper_replacePic(picUrlList)
        }

    })
    function shopee_accper_is_img_url (url, isImg = false) {
        var strRegex = /^\b(((https|https?|ftp):\/\/)?[-a-z0-9]+(\.[-a-z0-9]+)*\.(?:com|edu|gov|int|mil|net|org|biz|info|name|museum|asia|coop|aero|[a-z][a-z]|((25[0-5])|(2[0-4]\d)|(1\d\d)|([1-9]\d)|\d))\b(\/[-a-z0-9_:\@&?=+,.!\/~%\$]*)?)$/i
        // if (isImg) {
        //     var isImgType = /\.(gif|jpg|jpeg|png|GIF|JPEG|JPG|PNG)$/.test(url)
        //     return strRegex.test(url) && isImgType ? true : false
        // } else {
            return strRegex.test(url) ? true : false
        // }
    }
    // 添加图片
    function shopee_accper_addPic(urlList){
        const checkedTrDom=$('#shopee_accper_data_table').next().find('tbody tr td input[name="layTableCheckbox"]:checked').parents('tr')
        //图片URL。支持填入0-5项
        const isInLimit = checkedTrDom.is(function(){
            const imgDoms = $(this).find('[data-field=images] .imgDiv img')
            return urlList.length + imgDoms.length >= 6
        })
       if(isInLimit) return layer.msg('图片上传失败，店铺图片数量不能超过五张',{icon:7})
        let picHtml = ''
        urlList.forEach(element => {
            picHtml +=`<img src="${element}" alt="加载失败" class="lazy" data-onerror="layui.admin.img_noFind()">` 
        })
        checkedTrDom.each(function(){
            $(this).find('[data-field=images] .imgDiv').append(picHtml)
        })
        // 记录操作步骤
        shopee_accper_recordPicStep(checkedTrDom)
        layer.msg('添加成功',{icon:1})
    }
    // 替换首图
    function shopee_accper_replacePic(urlList){
        if(urlList.length>1) return layer.msg('当前仅允许一张图片替换首图',{icon:7})
        let picSrc = urlList[0]
        const checkedTrDom=$('#shopee_accper_data_table').next().find('tbody tr td input[name="layTableCheckbox"]:checked').parents('tr')
        checkedTrDom.each(function(){
            const imgDivDom = $(this).find('[data-field=images] .imgDiv')
            if(imgDivDom.find('img').length){
                imgDivDom.find('img:first').attr('src',picSrc)
            }else{
                imgDivDom.append(`<img src="${picSrc}" class="lazy" data-onerror="layui.admin.img_noFind()">`)
            }
        })
        // 记录操作步骤
        shopee_accper_recordPicStep(checkedTrDom)
        layer.msg('替换成功',{icon:1})
    }

    // 记录操作步骤
    function shopee_accper_recordPicStep(checkedTrDom){
        const lastListData = shopee_accper_storeTableList[shopee_accper_storeTableList.length-1]
        const curListData=JSON.parse(JSON.stringify(lastListData))
        checkedTrDom.each(function(){
            const curStoreAcctId = $(this).find('[data-field=images] .imgDiv').data('storeacctid')
            const curTrImgList = []
            $(this).find('[data-field=images] .imgDiv img').each(function(){
                curTrImgList.push($(this).prop('src'))
            })

            lastListData.some((item,index)=>{ 
                if(item.storeAcctId==curStoreAcctId){
                    curListData[index].images =curTrImgList
                }
                return item.storeAcctId==curStoreAcctId
            })
        })
        shopee_accper_storeTableList.push(curListData)
    }
    // 还原
    function shopee_accper_restorePic(){
        if(shopee_accper_storeTableList.length == 1 ){
            return layer.msg('已是最初的状态')
        }else{
            const lastListData = shopee_accper_storeTableList[shopee_accper_storeTableList.length-2]
            const trDoms= $('#shopee_accper_data_table').next().find('tbody tr')
            trDoms.each(function(){
                const imgDivDom = $(this).find('[data-field=images] .imgDiv')
                const curStoreAcctId = $(this).find('[data-field=images] .imgDiv').data('storeacctid')
                let picHtml = ''
                lastListData.some((item)=>{
                    if(item.storeAcctId == curStoreAcctId){
                        item.images.forEach(element => {
                            picHtml +=`<img src="${element}" alt="加载失败" class="lazy" data-onerror="layui.admin.img_noFind()">` 
                        })
                        imgDivDom.html(picHtml)
                    }
                    return item.storeAcctId == curStoreAcctId
                })
            })
            shopee_accper_storeTableList.pop()
            layer.msg('还原成功',{icon:1})
        }
    }
    // 批量修改
    $("#shopee_accper_batchConfirm").click(function () {
        const checkedTrDom=$('#shopee_accper_data_table').next().find('tbody tr td input[name="layTableCheckbox"]:checked').parents('tr')
        if(!checkedTrDom.length) return layer.msg('请选择数据',{icon:7})
        let param = []
        checkedTrDom.each(function(){
            const storeAcctId=Number($(this).find('[data-field=images] .imgDiv').data('storeacctid'))
             let imgUrls=[]
            $(this).find('[data-field=images] .imgDiv img').each(function(){
                imgUrls.push($(this).prop('src'))
            })
            const storeAcct = $(this).find('[data-field=storeAcct] div').text()
            param.push({storeAcctId,imgUrls,storeAcct})
        })
        commonReturnPromise({
            url: ctx + '/shopee/shopeeAccountPerformance/batchUpdateShopeeShopInfo.html',
            contentType: 'application/json',
            type: 'post',
            params: JSON.stringify(param)
        }).then(res=>{
            layer.open({
                title:'操作结果',
                area:['600px','800px'],
                content:$("#shopee_accper_storeInfo_resultTpl").html(),
                success: function (layero) {
                    table.render({
                        elem: "#shopee_accper_storeInfo_result",
                        data:res,
                        cols:[[
                            {field: 'storeAcct', title: '平台店铺名', },
                            {field: 'operationResult', title: '操作结果', templet: function(d){
                                const curTextClass = d.operationCode===1 ? 'fGreen' : 'fRed'
                                return `<div class="${curTextClass}">${d.operationResult}</div>`
                            }}
                        ]],
                        id: "shopee_accper_storeInfo_resultId",
                        page:false,
                    })
                },
                end:function(){
                    $('#shopee_accper_search').click()
                }
            })
        })

    })
});
var urlArr = [];//用于保存修改后的图片url数组,提交的图片数据
function shopeeAccper_modifypic(dom, id){
    const curTrDom = $(dom).parents('tr')
    const imgDoms = curTrDom.find('[data-field=images] .imgDiv img')
    const imgList = []
    if(imgDoms.length){
        imgDoms.each(function(){
            imgList.push($(this).prop('src'))
        })
    }
    layer.open({
        type: 1,
        title: '修改店铺信息',
        btn: ['提交'],
        area:['80%', '500px'],
        content: $("#modifypicture_Template").html(),
        end: function () {
            urlArr = [];
        },
        success: function(layero, index) {
            layui.form.render();
            $.ajax({
                type: "POST",
                url: ctx + "/shopee/shopeeAccountPerformance/getShopeeStoreAccount.html",
                data:{'storeAcctId':id},
                dataType: "JSON",
                success:function (returnData) {
                    if(returnData.code == "9999"){
                        layer.msg(res.msg);
                        return;
                    }
                    var storeData=returnData.data[0];
                    $("#storeAcctName").html(storeData.storeAcctName);
                    $("#storeAcct").val(storeData.storeAcct);
                    $("textarea[name = 'shopDescription']").html(storeData.shopDescription);
                    const imgArr = imgList
                    if(imgArr.length){
                        if(imgArr.length>0){
                            for(var i = 0 ;i< imgArr.length;i++){
                                urlArr.push(imgArr[i]);
                                $("#div_prev").append('<div class="img"><img src="'+imgArr[i]+'" onclick="show($(this))"><div class="close" onclick="deleteImg($(this))">×</div></div>');
                            }
                            $('#chooseimg').click(function(){
                                if(urlArr.length<5){
                                    layer.open({
                                        type: 1,
                                        title: '添加图不能超过5张',
                                        area: ['800px', '300px'],
                                        id: 'mainNetImgSuccess',
                                        content: '<div class="p20 pl20"><textarea class="layui-textarea" id="ebay_replace_windowMap_addItem_url_input" placeholder="请填写URL,多个地址用回车换行"></textarea></div>',
                                        btn: ['确定', '关闭'],
                                        success: function (layero) {
                                            layui.form.render();
                                        },
                                        yes: function(index, layero){
                                            var url = $.trim($("#ebay_replace_windowMap_addItem_url_input").val());
                                                 var urlArray = url.split("\n");
                                                 // 去一下空格
                                                 var ulObj=$('#window_map_imgDiv_ul_');
                                                 for (var i in urlArray) {
                                                    $("#div_prev").append('<div class="img"><img src="'+urlArray[i]+'" onclick="show($this)"><div class="close" onclick="deleteImg($(this))">×</div></div>');
                                                    urlArr.push(urlArray[i].trim(" "));
                                                 }
                                                 layer.close(index);
                                        },
                                    })
                                }else{
                                 layer.msg("最多上传5张图片")
                                }
                            });
                        }
                    }else {
                        $('#chooseimg').click(function(){
                            if(urlArr.length<5){
                                layer.open({
                                    type: 1,
                                    title: '添加图不能超过5张',
                                    area: ['800px', '300px'],
                                    id: 'mainNetImgSuccess',
                                    content: '<div class="p20 pl20"><textarea class="layui-textarea" id="ebay_replace_windowMap_addItem_url_input" placeholder="请填写URL,多个地址用回车换行"></textarea></div>',
                                    btn: ['确定', '关闭'],
                                    success: function (layero) {
                                        layui.form.render();
                                    },
                                    yes: function(index, layero){
                                        var url = $.trim($("#ebay_replace_windowMap_addItem_url_input").val());
                                        var urlArray = url.split("\n");
                                        // 去一下空格
                                        var ulObj=$('#window_map_imgDiv_ul_');
                                        for (var i in urlArray) {
                                            $("#div_prev").append('<div class="img" data-ind ="'+urlArray[i]+'"><img src="'+urlArray[i]+'"><div class="close" onclick="deleteImg($(this))">×</div></div>');
                                            urlArr.push(urlArray[i].trim(" "));
                                        }
                                        layer.close(index);
                                    },
                                })
                            }else{
                                layer.msg("最多上传5张图片")
                            }
                        });
                     }
                }
            });
        },
        yes: function(index, layero){
            //封装参数
            var obj = new Object();
            obj.imgUrl = [];
            obj.storeAcctId = id;
            obj.storeAcct = $("#storeAcct").val();
            // obj.imgUrl = urlArr;
            obj.shopDescription =  $("textarea[name = 'shopDescription']").val();
            if(obj.storeAcct == "" || obj.storeAcct == null){
                layer.msg("平台店铺名称不能为空");
                return;
            }
            // if(urlArr.length>5) return layer.msg("最多上传5张图片")
            if(obj.shopDescription == "" || obj.shopDescription == null){
                layer.msg("描述不能为空");
                return;
            }
            $.ajax({
                type: "POST",
                url: ctx + "/shopee/shopeeAccountPerformance/updateShopeeShopInfo.html",
                data:{'obj' : JSON.stringify(obj)},
                beforeSend: function(){
                    loading.show();
                },
                dataType: "JSON",
                success:function (data) {
                    loading.hide();
                    if(data.code==='0000'){
                        // 当前行数据更新
                        // 店铺名称
                        curTrDom.find('[data-field=storeAcctName] div').text(obj.storeAcct)
                        // 店铺图片
                        // let picHtml = ''
                        // urlArr.forEach(element=>{
                        //     picHtml +=`<img src="${element}" alt="加载失败" class="lazy" data-onerror="layui.admin.img_noFind()">` 
                        // })
                        // curTrDom.find('[data-field=images] .imgDiv').html(picHtml)
                        // 店铺描述
                        curTrDom.find('[data-field=shopDescription] div div').html(obj.shopDescription)
                        //
                        layui.table.cache.store_Info.some(item=>{
                            if(item.storeAcctId==id){
                                item.images = JSON.stringify(obj.imgUrl)
                                item.shopDescription = obj.shopDescription
                                item.storeAcctNameStr = obj.storeAcct
                            }
                            return item.storeAcctId==id
                        })
                        // // 操作步骤 去除关于这行的操作
                        // shopee_accper_storeTableList=(shopee_accper_storeTableList||[]).map(itemArr=>{
                        //     const _itemArr = itemArr.map(item=>{
                        //         if(item.storeAcctId==obj.storeAcctId){
                        //             item.images = urlArr
                        //         }
                        //         return item
                        //     })
                        //     return _itemArr
                        // })
                        $('#shopee_accper_search').click()
                        layer.msg(data.msg,{icon:1});
                        
                    }else{
                        layer.msg(data.msg,{icon:2});
                    }
                    layer.close(index);
                },
                error:function(err){
                    loading.hide();
                    console.log(err);
                }
            })
        },
        cancel:function(index,layero){
            layer.close(index);
        } 
    });
}

function deleteImg(dom){
    var index = urlArr.indexOf(dom.siblings('img').attr('src'));
    urlArr.splice(index,1);
    dom.parent('.img').remove();
}

function show(dom){
    var src = dom.attr("src");
    var index = urlArr.indexOf(src);
    layui.layer.open({
        type: 1,
       title: '预览大图',
       area: ['600px', '600px'],
       id: 'mainNetImgSuccess',
       content: '<div><i class="layui-icon layui-icon-left icon_font" onclick="preScan('+index+')"></i><img id="showimg" src="'+src+'" class="showimg"><i class="layui-icon layui-icon-right icon_font" onclick="nextScan('+index+')"></i><div>',
    })
}

function preScan(index){
    if(index-1>=0){
    $('.layui-icon-right').css('color','#4e4e4e'); 
    $('#showimg').attr('src',urlArr[index-1]);
    $('.layui-icon-left').attr('onclick','preScan('+(Number(index)-1>0?Number(index)-1:0)+')');
    $('.layui-icon-right').attr('onclick','nextScan('+((Number(index)-1)<5?Number(index)-1:5)+')');
    }else{
        $('.layui-icon-left').css('color','#ccc'); 
    }
}

function nextScan(index){
    if(Number(index)+1<urlArr.length){
        $('.layui-icon-left').css('color','#4e4e4e') 
        $('#showimg').attr('src',urlArr[index+1]);
        $('.layui-icon-left').attr('onclick','preScan('+(Number(index)+1)+')');
        $('.layui-icon-right').attr('onclick','nextScan('+((Number(index)+1)<urlArr.length?(Number(index)+1):urlArr.length)+')');
    }else{
        $('.layui-icon-right').css('color','#ccc') 
    }
}




