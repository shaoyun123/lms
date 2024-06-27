/**ebay在线商品的js*/
var modifyTitle_arr = new Array();
var timeUnit;
var ebaySkus;
var ebayOnPro_displayAccurateCount;
var subSkuEbayOriginList = [];
layui.use(['admin', 'layer', 'table', 'form', 'laytpl', 'element', 'laydate', 'formSelects','laypage'], function() {
    var admin = layui.admin,
        layer = layui.layer,
        $ = layui.$,
        table = layui.table,
        element = layui.element,
        laydate = layui.laydate,
        formSelects = layui.formSelects,
        laypage = layui.laypage,
        form = layui.form;
    form.render('checkbox');
    form.render('select'); //刷新select选择框渲染
    //远程搜索功能
    var dim = new DimSearch('#pl_searchSysUser', 'ebay_online_userId',{
        url: '/sys/searchSysUser.html',
        query: 'name',
        label:'name',
        name:'.ebayOnline_dimResultDiv'
    });
    dim.init();
    /**
     * 日期渲染
     */
    laydate.render({
        elem: '#ebay_online_listtime',
        range: true
    });
    render_hp_orgs_users("#ebay_online_searchForm", function(){
        formSelects.render('ebay_online_store_sel');
    }); //渲染部门销售员店铺三级联动
    ebayOnline_initEbaySite(); //初始化ebay站点下拉框
    ebayOnline_initEbaySiteFromStore(); //店铺联动赋值促销1.0 2.0
    var ebayOnline_marksCheckData = []; //初始ebay在线商品标签
    ebayOnline_getEnableRules()
    ebayOnline_init()  //初始化
    /**
     * 初始化商品标签
     */
    ebayOnline_initProdTags();
    function ebayOnline_initProdTags(){
        $.ajax({
            type: "post",
            url: ctx + "/product/getProdTags.html",
            dataType: "json",
            success: function (returnData) {
                console.log(returnData.data);
                if (returnData.code == "0000") {
                    //商品标签
                    var productLabelList=returnData.data;
                    var labelStr="<option value=''>请选择</option>";
                    $(productLabelList).each(function () {
                        labelStr+="<option value='"+this.name+"'>"+this.name+"</option>";
                    });
                    $("#ebay_online_productLabel_sel").html(labelStr);
                    form.render();
                } else {
                    layer.msg(returnData.msg);
                }
            }
        });
    }

    // 初始化
    function ebayOnline_init() {
        // 初始化 平台
        commonReturnPromise({
            url: "/lms/enum/getSalesPlatEnum.html",
            type: "post",
            contentType: "application/json;charset=UTF-8",
          })
            .then(res => {
              commonRenderSelect("ebayOnline_prohibitPlat", res, { name: "name", code: "name" })
              formSelects.data("ebayOnline_prohibitSalesSiteId", "local", { arr: [] })
            })
            .then(() => form.render())
          
        // 初始化侵权状态
        formSelects.data("ebayOnline_tortPlat", "local", {
          arr: [
            { name: "wish侵权", value: "isWishTort_1" },
            { name: "wish不侵权", value: "isWishTort_0" },
            { name: "ebay侵权", value: "isEbayTort_1" },
            { name: "ebay不侵权", value: "isEbayTort_0" },
            { name: "smt侵权", value: "isSmtTort_1" },
            { name: "smt不侵权", value: "isSmtTort_0" },
            { name: "joom侵权", value: "isJoomTort_1" },
            { name: "joom不侵权", value: "isJoomTort_0" },
            { name: "amazon侵权", value: "isAmazonTort_1" },
            { name: "amazon不侵权", value: "isAmazonTort_0" },
            { name: "shopee侵权", value: "isShopeeTort_1" },
            { name: "shopee不侵权", value: "isShopeeTort_0" },
            { name: "lazada侵权", value: "isLazadaTort_1" },
            { name: "lazada不侵权", value: "isLazadaTort_0" },
          ],
        })
      }

    // 展示和隐藏 更多查询条件
    $('#showMoreSearchCondition_ebayOnline').click(function() {
        var self = this
        if ($(self).hasClass('showExternal')) {
            $(self).closest('.layui-form').find('.externalContain_ebayOnline').hide()
            $('#hide_icon_ebayOnline').show()
            $('#show_icon_ebayOnline').hide()
            // 如果有查询条件
            let listSearchType = $('#ebay_online_listtype_sel').val() //刊登类型
            let subtile = $('#ebay_online_subtile_sel').val() // 副标题
            let bestoffer = $('#ebay_online_bestoffer_sel').val() //best offer
            let returnback = $('#ebay_online_returnback_sel').val() //退货时间
            let promotion = $('#ebay_online_marketing_promotion_sel').val() //促销2.0
            let ruleId = $('#ebay_online_ruleId').val() //调价模板
            let ebayCategory1 = $('#ebay_online_ebayCategory1').val() // ebay第一分类
            let ebayCategory1Type = $('#ebay_online_searchForm').find('input[name="ebayCategory1Type"]:checked').val() // 反选
            let ebayCategory2 = $('#ebay_online_ebayCategory2').val() // ebay第二分类
            let ebayCategory2Type = $('#ebay_online_searchForm').find('input[name="ebayCategory2Type"]:checked').val() // 反选
            let listingBySystem = $('#ebay_online_listing_creator').val() // 刊登人
            if(listSearchType || subtile || bestoffer || returnback || promotion || ruleId || ebayCategory1 ||ebayCategory1Type || ebayCategory2 || ebayCategory2Type || listingBySystem){
                $('#moreSearch_ebayOnline_text').text('更多查询条件(有条件)')
                $('#moreSearch_ebayOnline_text').addClass('fRed')
            }else{
                $('#moreSearch_ebayOnline_text').text('更多查询条件')
                $('#moreSearch_ebayOnline_text').removeClass('fRed')
            }
            $(self).removeClass('showExternal')
        } else {
            $(self).closest('.layui-form').find('.externalContain_ebayOnline').show()
            $('#hide_icon_ebayOnline').hide()
            $('#show_icon_ebayOnline').show()
            $(self).addClass('showExternal')
        }
    })

    // 调价模板
    function ebayOnline_getEnableRules(storeAcctIdList=[]){
        commonReturnPromise({
            url: ctx + '/ebayAutoModifyPriceRule/listEnableRules',
            type:'post',
            params: JSON.stringify(storeAcctIdList),
            contentType:'application/json;charset=UTF-8'
        }).then(res=>{
            commonRenderSelect('ebay_online_ruleId',res,{name:'ruleName',code:'id'})
            .then(()=>form.render())
        })
    }

    // 规则弹窗获取下拉框渲染数据
    ebayOnline_initdevTypes()
    function ebayOnline_initdevTypes () {
        commonReturnPromise({
            url: ctx + '/fyndiq/new/listing/manage.html'
        }).then(data => {
            commonRenderSelect('devTypes_ebay_online', data.devTypeEnums).then(() => {
                formSelects.render('devTypes_ebay_online');
            })
        })

    }
    /**
     * 获取日志渲染信息
     */
    let ebay_logRendering_online
    logRendering().then(res => {
        ebay_logRendering_online = res
    })
    function logRendering() {
        return commonReturnPromise({
            url: '/lms/prodListingOperTypeEnum/ebay'
        })
    }

    /**
     * 禁售站点
    */
    form.on("select(ebayOnline_prohibitPlat)", function ({ value }) {
        commonReturnPromise({
        url: `/lms/enum/getSiteEnum.html?platCode=${value}`,
        type: "post",
        contentType: "application/json;charset=UTF-8",
        }).then(res => {
        formSelects.data("ebayOnline_prohibitSalesSiteId", "local", {
            arr: res.map(item => ({ ...item, value: item.code })),
        })
        })
    })
  

    /**
     * 批量操作(上下架，调价等)
     */
    var selected = -1;
    form.on('select(ebay_online_isEnableSel)', function(data) {
        selected = $.trim(data.value);
        if (selected == null || selected == '') {
            return false;
        }
        /**
         * 跳转
         */
        var sobj = $("#ebay_online_isEnableSel").find("[value=" + selected + "]");
        var title = $(sobj).attr("data-title");
        var link = $(sobj).attr("data-link");
        if (selected == 0) {
            var itemData = table.checkStatus('ebay_online_data_table').data; //获取选择的店铺
            if (itemData == null || itemData.length < 1) {
                layer.msg("请选择lisiting", { icon: 0 });
                return;
            }
            var itemIds = [];
            for (var index in itemData) {
                var obj = itemData[index];
                itemIds.push(obj.storeAcctId + "&" + obj.itemId);
            }
            updateBacthEbayItem(itemIds.join(","));
            return false;
        } else if (selected == 5 || selected == 6) {
            if (modifyTitle_arr.length <= 0) {
                layer.msg("请选择需要修改的商品");
                return;
            }
            if ($("#ebay_online_offline_num_span").parents("li").hasClass("layui-this")) {
                modifyTitle_arr = [];
                layer.msg("商品已下线");
                return;
            }
        } else if (selected == 7) { //如果是橱窗图修改
            var itemData = table.checkStatus('ebay_online_data_table').data; //获取选择的店铺
            if (itemData != null && itemData.length > 0) {
                var itemIds = [];
                for (var index in itemData) {
                    var obj = itemData[index];
                    itemIds.push(obj.itemId);
                }

                var itemIdStr = itemIds.join(",");
                var ele = $("<input type='hidden' id='ebay_replace_windowMap_itemIds_hidden' value='" + itemIdStr + "'></input >");
                $("body").append(ele);
            }
        } else if (selected == 8) {
            if (modifyTitle_arr.length <= 0) {
                layer.msg("请选择需要修改的商品");
                return;
            }
            var boo;
            
            let newArr = []
            modifyTitle_arr.forEach(item => {
                let obj = { 
                    id: item.id,
                    itemId: item.itemId
                }
                newArr.push(obj)
            })
            $.ajax({
                type: 'POST',
                url: ctx + '/ebayIsEnableProduct/searchEbayProdByIdsAndSide.html',
                data: { 'modifyTitle_arr': JSON.stringify(newArr) },
                dataType: 'JSON',
                async: false,
                success: function(data) {
                    if (data.code == '1111') {
                        layer.msg(data.msg);
                        boo = true;
                    }
                }
            });
            if (boo) {
                return;
            }
        } else if (selected == 9) {
            //var storeAcctId = $('select[name="ebay_online_store_sel"]').val();
            var currentStoreAccts = formSelects.value("ebay_online_store_sel", "val"); //所选店铺
            if (currentStoreAccts.length < 1) {
                layer.msg("请先选择店铺");
                return;
            } else if (currentStoreAccts.length > 1) {
                layer.msg("只能选择一个店铺");
                return;
            }
            var storeAcctId = currentStoreAccts[0]
            localStorage.setItem('storeAcctId', storeAcctId);
        } else if (selected == 10 || selected == 11) {
            if (modifyTitle_arr.length <= 0) {
                layer.msg('请选择商品');
                return;
            }
        } else if (selected == 12) {
            //修改SKU
            if (modifyTitle_arr.length <= 0) {
                layer.msg('请选择商品');
                return;
            }
            //判断是否有单属性商品或拍卖
            for (var i = 0; i < modifyTitle_arr.length; i++) {
                var modifyData = modifyTitle_arr[i];
                if (!modifyData.isMultiSku || modifyData.listingType != "FIXED_PRICE_ITEM") {
                    layer.msg("不能修改单属性或拍卖商品, ItemID:" + modifyData.itemId, { icon: 0 });
                    return;
                }
            }
        } else if (selected == 13) {
            var itemData = table.checkStatus('ebay_online_data_table').data; //获取选择的店铺
            var storeArr = [];
            for (var i in itemData) {
                if (!(storeArr.indexOf(itemData[i].storeAcctId) > -1)) {
                    storeArr.push(itemData[i].storeAcctId)
                }
            }
            if (storeArr.length > 1) {
                layer.msg("只能选择同一店铺的商品!");
                return;
            } else if (storeArr.length < 1) {
                layer.msg("请先选择商品!");
                return;
            }
            localStorage.setItem('storeId', storeArr)
            modifyTitle_arr = itemData
        }else if(selected == 15){
            if (modifyTitle_arr.length <= 0) {
                layer.msg("请选择需要生成拍卖的商品");
                return;
            }
            const data = modifyTitle_arr.map(item=>{
                let _item = item.prodSyncSEbayDtos.map(elem=>({
                    ...elem,
                    mainImgUri:elem.pictureUrl,
                    fixedPrice: elem.currentPrice || elem.startPrice,
                    sSku: elem.prodSSku,
                    prodSyncSId: elem.id
                }))
                return _item
            })
            window.localStorage.setItem('ebay_genauction', JSON.stringify({type: 'online', data: data.flat() }))
        }
        var index = layer.open({
            type: 1,
            id: Date.now(),
            title: title,
            area: ['80%', '70%'],
            success: function() {
                layui.view(this.id).render(link).done(function() {
                    //渲染完成以后执行的函数
                    if (ebaySkus) {
                        $("input[name='sSkuList']").val(ebaySkus);
                        setTimeout(function() {
                            $('#adjustPriceSearchBtn').click();
                        }, 1000); //延迟1s
                    }
                })
            },
            end: function() {
                if (timeUnit != null) {
                    clearInterval(timeUnit); //清除定时查询进度
                }
            }
        });
    });
    /**
     * 在线下线选项卡改变
     */
    var currentIsOffline = "0"; //在线
    element.on('tab(ebay_online_tab_filter)', function(data) {
        currentIsOffline = $(this).attr("isOffline");
        $("#ebay_online_search_submit").click();
    });
    /**
     * 标签选择监听
     */
    form.on('checkbox(ebayonline_marksCheck)', function(data) {
        var savl = data.value;
        var objForm = $("#ebay_online_marks_form");
        if (savl == "") { //点击了全选
            if (data.elem.checked) { //全部选中
                objForm.children().each(function() {
                    $(this).prop("checked", true);
                })
            } else { //反选
                objForm.children().each(function() {
                    $(this).prop("checked", false);
                })
            }
        } else {
            if (data.elem.checked) {
                var length = objForm.find(".layui-form-checked").length;
                if (length == (objForm.find("input").length - 1)) {
                    objForm.children().first().prop("checked", true);
                }
            } else {
                objForm.children().first().prop("checked", false);
            }
        }
        form.render('checkbox');
    });
    /**
     * 批量打标签(增加标签)
     */
    form.on('select(ebay_online_tagsOperate_sel)', function(data) {
        var marks = $.trim(data.value); //标签id
        if (marks == null || marks == '') {
            return false;
        }
        var marksName = ""; //标签名称
        var waitAjdustPrice = ""; //待调价标签id
        $.each(ebayOnline_marksCheckData, function(index, element) {
            if (element.id == marks) {
                marksName = element.name;
            }
            if (element.name == '待调价') {
                waitAjdustPrice = element.id + '';
            }
        });
        var itemData = table.checkStatus('ebay_online_data_table').data; //获取选择的店铺
        if (itemData == null || itemData.length < 1) {
            layer.msg("请选择要打标签的lisiting", { icon: 0 });
            return;
        }
        var updateJson = [];
        var needBack = 'no';
        if (marksName.indexOf('调价完成') > -1) {
            needBack = 'yes';
        }
        for (var index in itemData) {
            var obj = itemData[index];
            var oldMarks = obj.listingMarks;
            if (oldMarks == null) {
                oldMarks = "";
            }
            if ($.inArray(marks, oldMarks.split(',')) == -1) { //如果旧标签不含有当前添加的标签
                var udata = {};
                udata.id = obj.id;
                udata.needBack = needBack;
                var markArray = oldMarks.split(',');
                markArray.push(marks);
                if (marksName.indexOf('调价完成') > -1) { //如果点击的是调价完成
                    var index = markArray.indexOf(waitAjdustPrice); //移除待调价标签
                    if (index > -1) {
                        markArray.splice(index, 1);
                    }
                }
                udata.marks = markArray.join(",");
                updateJson.push(udata);
            }
        }
        if (itemData.length > 1) {
            var confirmindex = layer.confirm('确认将<span style="color:blue"> ' + itemData.length + ' </span>条lisiting打上<span style="color:blue"> ' + marksName + '</span> 标签', { btn: ['确认', '取消'] }, function(result) {
                if (result) {
                    layer.close(confirmindex);
                    if (updateJson.length > 0) {
                        ebayOnline_bacthMarksEbayItem(updateJson);
                    } else {
                        layer.msg('操作成功', { icon: 1 });
                    }
                }
            })
        } else {
            if (updateJson.length > 0) {
                ebayOnline_bacthMarksEbayItem(updateJson);
            } else {
                layer.msg('操作成功', { icon: 1 });
            }
        }
    });

    /**
     * 搜索
     */
    var eabyOnlineproductPage = {};
    eabyOnlineproductPage.curr = 1;
    eabyOnlineproductPage.limit = 100
    eabyOnlineproductPage.count = 0;
    $("#ebay_online_search_submit").on("click", function() {
        eaby_onlineProduction_tableRender(eabyOnlineproductPage.limit,eabyOnlineproductPage.curr)
    });
    function eaby_onlineProduction_tableRender(limit,pageNum){
        layui.admin.load.show();
        var whereData = getSerachData();
        whereData.page = pageNum;
        whereData.limit = limit;
        $.ajax({
            type: 'POST',
            url: ctx + "/onlineProductEbay/searchEbayProductByDto.html",
            data: whereData,
            dataType: 'JSON',
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
            async: true,
            success: function(returnData) {
                layui.admin.load.hide();
                eabyOnlineproductPage.count = returnData.count
                if (returnData.msg != null) {
                    var msgArray = returnData.msg.split("&");
                    let temCount0 = ''
                    let temCount1 = ''
                    if (ebayOnPro_displayAccurateCount) {
                        temCount0 = msgArray[0]
                        temCount1 = msgArray[1]
                    }else {
                        temCount0 = msgArray[0] >= 10000 ? '>10000' : msgArray[0]
                        temCount1 = msgArray[1] >= 10000 ? '>10000' : msgArray[1]
                    }
                    $("#ebay_online_online_num_span").html(temCount0); //在线
                    $("#ebay_online_offline_num_span").html(temCount1); //下线
                }
                var cols = [
                    { checkbox: true, width: 30 },
                    { field: "pImgs", unresize: true, width: 65, title: "图片", templet: '#ebay_online_pImgs_tpl' },
                    { field: "itemId", title: "标题/产品id",width:200, style: "vertical-align: top;", templet: '#ebay_online_title_tpl' },
                    { field: "storePSku", title: "Parent SKU", width: 120, style: "vertical-align: top;", templet: '#ebay_online_storePSku_tpl' },
                    {
                        field: "storeSSku",
                        unresize: true,
                        width: 460,
                        title: "<div style='width:100px;float: left;'>SKU</div> " +
                             "<div style='width:80px;float: left;'>属性</div> " +
                            //  "<div style='width:80px;float: left;'>价格</div> " +
                             "<div style='width:60px;float: left;'>在线数量</div>" +
                             "<div style='width:90px;float: left;'>可用/在途/未派</div> " +
                             "<div style='width:60px;float: left;'>销量</div>" +
                             "<div style='width:60px;float: left;'>引流</div>",
                        style: "vertical-align: top;",
                        templet: '#ebay_online_storeSSku_tpl'
                    },
                    { field: "listingStartTime", title: "时间", style: "vertical-align: top;", templet: '#ebay_online_listTime_tpl' },
                    { field: "effive", title: "效果", width: 100, style: "vertical-align: top;", templet: '#ebay_online_effive_tpl' },
                    { field: "shipCost", title: "运费", width: 245, style: "vertical-align: top;", templet: '#ebay_online_shipCost_tpl' },
                    { field: "bidPercentage", title: "费率", templet: '#ebay_online_Rate_tpl'},
                    { field: "promotionName", title: "促销", style: "vertical-align: top;", style: "font-size:12px;", templet: '#ebay_online_promotionName_tpl' },
                    { title: '操作', width: 100, align: 'center', templet: '#ebay_online_operate_tpl',width: 80 }
                ];
                if (whereData.isOptimized != null && whereData.isOptimized == 1) { //优化完成
                    cols = [
                        { checkbox: true, width: 30 },
                        { field: "pImgs", unresize: true, width: 65, title: "图片", templet: '#ebay_online_pImgs_tpl' },
                        { field: "itemId", title: "标题/产品id", style: "vertical-align: top;", templet: '#ebay_online_title_tpl' },
                        { field: "optimizedItemId", title: "竞品标题/产品id", style: "vertical-align: top;", templet: '#ebay_online_comp_title_tpl' },
                        { field: "optimizedIdea", title: "优化思路", style: "vertical-align: top;", templet: '#ebay_online_optimizedIdea_tpl' },
                        { field: "optimizedPrice", title: "价格比对", width: 110, style: "vertical-align: top;", templet: '#ebay_online_optimizedPrice_tpl' },
                        { field: "listingStartTime", title: "刊登时间", width: 110, style: "vertical-align: top;", templet: '#ebay_online_listTime_tpl' },
                        { field: "optimizedBeforeSales", title: "优化前销量", width: 70, style: "vertical-align: top;", templet: '#ebay_online_optimizedBeforeSales_tpl' },
                        { field: "optimizedTime", title: "优化时间", width: 90, style: "vertical-align: top;", templet: '#ebay_online_optimizedTime_tpl' },
                        { field: "effive", title: "效果", width: 100, style: "vertical-align: top;", templet: '#ebay_online_optimized_effive_tpl' },
                        { title: '操作', align: 'center', templet: '#ebay_online_operate_tpl',width:80 }
                    ];
                };
                table.render({
                    elem: "#ebay_online_data_table",
                    // method: 'post',
                    data:returnData.data,
                    // url: ctx + "/onlineProductEbay/searchEbayProductByDto.html",
                    // where: whereData,
                    layFilter: "ebay_online_data_table",
                    cols: [
                        cols,
                    ],
                    done: function(res, curr, count) {
                        modifyTitle_arr = [];
                        //懒加载
                        // theadHandle().fixTh('#ebayOnlineCard',200);
                        imageLazyload();
                        $('td[data-field="bidPercentage"]').click(function(){
                            var index = $(this).parents('tr').data('index')
                            var rowdata = res.data[index]
                            var {itemId,mainId,site,storeAcctId}  = rowdata
                            getAdRate({itemId,mainId,site,storeAcctId},function(returnData){
                                //returnData.data.
                                editbidPercentage(returnData.data)
                            })
                        })
                        $('#ebay_onlilne_product .layui-table-header').addClass('toFixedContain')

                            if (whereData.isOptimized != null && whereData.isOptimized == 1) { //优化完成
                                $('.ebay_online_optimize_idea_tip').on('mouseenter', function() {
                                    var that = this;
                                    var tips = $(this).attr("sellerNote");
                                    if (tips) {
                                        layer.tips($(this).attr("sellerNote"), that, { tips: [1, '#333'], time: 0 }); //在元素的事件回调体中，follow直接赋予this即可
                                    }
                                }).on('mouseleave', function() {
                                    layer.closeAll("tips");
                                });
                            }
                            $('.ebay_online_promotion_tip').on('mouseenter', function(){
                                var that = this;
                                var pstart=$(this).attr("pstart");
                                if(pstart){
                                    var promotionStr='开始时间：'+pstart+"</br>"+"结束时间："+$(this).attr("pend");
                                    layer.tips(promotionStr, that,{tips:[1,'#333'],time: 0}); //在元素的事件回调体中，follow直接赋予this即可
                                }
                            }).on('mouseleave', function(){
                                layer.closeAll("tips");
                            });

                            $('.ebay_online_publishPerson_tip').on('mouseenter', function(){
                                var that = this;
                                var tips=$(this).attr("tips");
                                if(tips){
                                    tips="刊登者：</br><div style='word-wrap:break-word;'>"+tips+"</div>";
                                    layer.tips(tips, that,{tips:[1,'#333'],time: 0}); //在元素的事件回调体中，follow直接赋予this即可
                                }
                            }).on('mouseleave', function(){
                                layer.closeAll("tips");
                            });
                            $('.ebay_online_autoModifyPriceMark').on('mouseenter', function(){
                                const that = this;
                                let tipRes = $(this).data("ruledata")
                                const type = tipRes.floatPositive===true ? '每次调增':'每次调减'
                                const percentUnit = tipRes.floatType === 2 ? '%' :''
                                let weekDay = tipRes.weekDay.split(',').map(item=>{
                                    let _item = item -1
                                    return _item=='0' ? 7 : _item
                                }).join(',')
                                let  tips=`规则名称: ${tipRes.ruleName}<br>
                                    调价对象:
                                    <div>
                                        <span class="ml10">近7日销量[${ebay_online_dealUndefind(tipRes.currentSevenDaysSalesMin)}, ${ebay_online_dealUndefind(tipRes.currentSevenDaysSalesMax)}]</span>
                                        <span class="ml10">多少天未售出[${ebay_online_dealUndefind(tipRes.notSoldDays)}]</span>
                                    </div>
                                    <div>
                                        <span class="ml10">listing总销量[${ebay_online_dealUndefind(tipRes.soldNumsMin)}, ${ebay_online_dealUndefind(tipRes.soldNumsMax)}]</span>
                                        <span class="ml10">价格[${ebay_online_dealUndefind(tipRes.priceMin)}, ${ebay_online_dealUndefind(tipRes.priceMax)}]</span>
                                    </div>
                                    <div class="ml10">刊登时间[${ebay_online_dealUndefind(Format(tipRes.listingTimeMin,'yyyy-MM-dd  hh:mm:ss'))}, ${ebay_online_dealUndefind(Format(tipRes.listingTimeMax,'yyyy-MM-dd  hh:mm:ss'))}]</div>
                                    <div class="ml10">在线库存[${ebay_online_dealUndefind(tipRes.stockMin)}, ${ebay_online_dealUndefind(tipRes.stockMax)}]</div>
                                    <div class="ml10">itemID[${tipRes.itemIdStr}]</div>
                                    调价策略: ${type}${tipRes.floatNum}${percentUnit}<br>
                                    执行日期: 每周${weekDay},每天${tipRes.excecuteTime}点<br>
                                    周期起止时间: ${Format(tipRes.startDay,'yyyy-MM-dd  hh:mm:ss')} ~ ${Format(tipRes.endDay,'yyyy-MM-dd  hh:mm:ss')}<br`;
                                layer.tips(tips, that,{tips:[1,'#333'],time: 0,area:300}); //在元素的事件回调体中，follow直接赋予this即可

                            }).on('mouseleave', function(){
                                layer.closeAll("tips");
                            });
                        // $('#ebay_online_data_table').css('overflow','hidden');
                    },
                    page: false,
                    id: "ebay_online_data_table",
                    limit: eabyOnlineproductPage.limit
                });
                function ebay_online_dealUndefind(val){
                    let _val = val === undefined ? 'N/A' : val
                    return _val
                }
                //工具条的监听事件,table.on(tool(表格的lay-filter的值))
                table.on('tool(ebay_online_data_table)', function(obj) {
                    var data = obj.data, //获得当前行数据
                        layEvent = obj.event; //获得 lay-event 对应的值
                    var itemIds = data.storeAcctId + "&" + data.itemId;
                    var id = data.id;
                    if (layEvent == "ebay_online_syncOneItem") { //更新一条item
                        updateBacthEbayItem(itemIds);
                    } else if (layEvent == "ebay_online_markOneItem") { //标记一条在线listing
                        ebayOnline_updateBatchEbayItemMarks(data.id, data.listingMarks);
                    } else if (layEvent == 'ebay_online_searchLog') { //查看日志
                        layer.open({
                            type: 1,
                            title: '查看日志',
                            shadeClose: false,
                            area: ['60%', '60%'],
                            content: $('#log_table_ebay').html(),
                            success: function() {
                                searchLog(id);
                            }
                        })
                    } else if(layEvent == 'ebay_online_listing'){ //修改listing
                        // console.log('修改listing')
                        ebayOnlineproduct_editListingHandle(id);
                    }else if(layEvent == 'ebay_online_comments'){ //查看评价
                        ebayOnlineproduct_commentsHandle(data);
                    }
                    else if (layEvent == 'ebay_online_show_optimize') { //优化完成
                        var index = layer.open({
                            type: 1,
                            title: '优化完成',
                            area: ["1200px", "600px"],
                            btn: ["提交", "关闭"],
                            content: $('#ebayOnline_updateBatchEbayTobeOptimizeLayer').html(),
                            success: function() {
                                laydate.render({
                                    elem: '#ebay_online_optimized_time',
                                    range: false
                                });
                                $("#ebay_online_zhuqu_button").click(function() {
                                    var itemId = $.trim($("#ebay_online_optimize_itemId").val());
                                    ebayOnline_resolveItem(itemId, data); //解析竞品数据
                                });
                            },
                            yes: function(index, layero) {

                                var tobj = {};
                                tobj.id = data.id;
                                tobj.competItemId = $.trim($("#ebay_online_optimize_itemId").val()); //竞品id
                                tobj.competItemTitle = $.trim($("#ebay_online_optimize_comp_title").html()); //竞品title
                                tobj.competItemPrice = $.trim($("#ebay_online_optimize_comp_price").html()); //竞品价格
                                tobj.competItemSpec = $.trim($("#ebay_online_optimize_comp_desc").html()); //竞品价格
                                tobj.optimizeIdea = $.trim($("#ebay_online_optimize_idea").val()); //优化思路
                                if (tobj.competItemId == null || tobj.competItemId == '') {
                                    layer.msg("竞品itemId不能为空！", { icon: 0 });
                                    return false;
                                }
                                if (tobj.optimizeIdea == null || tobj.optimizeIdea == '') {
                                    layer.msg("优化思路不能为空！", { icon: 0 });
                                    return false;
                                }
                                tobj.optimizeTime = $.trim($("#ebay_online_optimized_time").val()); //优化时间
                                if (tobj.optimizeTime == null || tobj.optimizeTime == '') {
                                    layer.msg("优化时间不能为空！", { icon: 0 });
                                    return false;
                                }
                                tobj.competItemSpec = "";
                                loading.show();
                                $.ajax({
                                    url: ctx + '/onlineProductEbay/optimizedOneEbayItem.html',
                                    data: tobj,
                                    dataType: "json",
                                    type: "post",
                                    success: function(returnData) {
                                        loading.hide();
                                        if (returnData.code == "0000") {
                                            layer.closeAll();
                                            layer.msg(returnData.msg, { icon: 1 });
                                        } else {
                                            layer.msg(returnData.msg, { icon: 5 });
                                        }
                                    },
                                    error: function() {
                                        layer.msg("服务器正忙", { icon: 5 });
                                    }
                                });
                            },
                            end: function() {
                                layer.close(index);
                            }
                        });
                    }
                });
                laypage.render({
                    elem: 'ebay_onlineproduct_pageSort',
                    limits: [30,50, 100, 300, 500, 1000],
                    // first: false, //显示首页
                    // last: false, //显示尾页
                    count: eabyOnlineproductPage.count, //数据总数，从服务端得到
                    curr: eabyOnlineproductPage.curr,
                    limit: eabyOnlineproductPage.limit,
                    // prev: '上一页',
                    // next: '下一页>',
                    layout: ['prev', 'page', 'next', 'count', 'limit', 'refresh', 'skip'],
                    jump: function(obj, first) {
                        //obj包含了当前分页的所有参数，比如：
                        eabyOnlineproductPage.curr = obj.curr;
                        eabyOnlineproductPage.limit = obj.limit;
                        //首次不执行
                        if (!first) {
                            //do something
                            eaby_onlineProduction_tableRender(obj.limit,obj.curr)
                        }
                        let count = eabyOnlineproductPage.count <= 10000 ? eabyOnlineproductPage.count : '>10000'
                        if (ebayOnPro_displayAccurateCount) {
                            count = eabyOnlineproductPage.count
                        }
                        $('#ebay_onlineproduct_pageSort .layui-laypage-count').text(`共 ${count} 条`)
                    }
                });
            },
            error:function(returnData){
                layui.admin.load.hide();
            }
        });
    }

    $('#ebay_online_search_reset').on('click', function(){
        $('#ebay_online_depart_sel1').next().find('dd[lay-value=""]').trigger('click');
    })

    /**
     * 获取广告推荐费率，广告活动名称
     * @param {*} data
     * @param {*} func
     */
    function getAdRate(data,func){
        initAjax('/ebayCampaign/getRecommendBidPercentage.html',
        'POST', data,
        function(returnData) {
            if(func){
                func(returnData)
            }
        },'application/x-www-form-urlencoded'
    );
    }

    function submitEditrRate(data,func){
        initAjax('/ebayCampaign/updateListingBidPercentage.html',
        'POST', JSON.stringify(data),
        function(returnData) {
            if(func){
                func(returnData)
            }
        }
    );
    }

    /**
     * 编辑费率
     * @param {表格行数据} data
     */
    function editbidPercentage(data){
        layer.open({
            type: 1,
            title: '编辑费率',
            btn: ['提交', '取消'],
            area: ['40%', '50%'],
            content: template('pop_eabayonlineprducts_edit_rate', {
                data: data
            }),
            success: function(layero, index) {
                form.render()
            },
            yes: function(index, layero) {
                setTimeout(function(){
                    $('#submit_ebayonlineproduct_EditRate').click()
                })
                form.on('submit(submit_ebayonlineproduct_EditRate)',function(formdata){
                    data.bidPercentage = formdata.field.bidPercentage
                    data.listingType = formdata.field.listingType
                    submitEditrRate(data,function(returnData){
                        layer.msg(returnData.msg||'修改费率成功')
                        layer.close(index)
                    })
                })
            }
        });
    }

    function initAjax(url, method, data, func, contentType, isLoad, func2, func3) { //初始化ajax请求
        if (!isLoad) {
            loading.show()
        }
        $.ajax({
            type: method,
            url: ctx + url,
            dataType: 'json',
            async: true,
            data: data,
            contentType: contentType || 'application/json',
            beforeSend: function(returnData) {
                if (func2) {
                    func2(returnData)
                }
            },
            success: function(returnData) {
                loading.hide()
                if (returnData.code == "0000") {
                    func(returnData)
                } else {
                    layer.msg(returnData.msg, {
                        icon: 2
                    });
                }
            },
            error: function() {
                layui.admin.load.hide();
                if (XMLHttpRequest.status == 200) {
                    layer.msg("请重新登录", {
                        icon: 7
                    });
                } else {
                    layer.msg("服务器错误");
                }
            },
            complete: function(returnData) {
                loading.hide()
                if (func3) {
                    func3(returnData)
                }
            }
        })
    }


    /**
     * 展示listing日志
     * @param id
     */
    function searchLog(id) {
        table.render({
            elem: '#ebay_log_table',
            method: 'post',
            url: ctx + '/onlineProductEbay/searchLog.html',
            where: { 'id': id },
            cols: [
                [ //标题栏
                    { field: 'createTime', title: '时间', templet: "<div>{{layui.util.toDateString(d.createTime,'yyyy-MM-dd HH:mm:ss')}}</div>" }
                    , { field: 'creator', title: '操作人' }
                    , { field: 'prodSSku', title: '子SKU' }
                    , { field: 'operType', title: '事件', templet: function (d) {
                        return ebay_logRendering_online[d.operType] || ''
                    } }
                    , { field: 'origData', title: '原值' }
                    , { field: 'newData', title: '调整值', width: '25%' }
                    , { field: 'operDesc', title: '结果', width: '18%' }
                    , { field: 'operation', title: '操作' }

                ]
            ],
        })
    }

     /**
     * 监听表格 是否引流
     * 可以开启关闭，同一个listing只能选择一个子sku为开启状态，或者都不开启
     */
    form.on('checkbox(ebay_onlline_isAttractSku)',function(obj){
        let id = $(obj.elem).data('id')
        let itemId = $(obj.elem).data('itemid')
        let trDoms = obj.othis.parents('.colspantable').find('tbody tr')
        let params = [{id, isAttractSku: obj.elem.checked}]
        trDoms.each(function(){
            let curDom = $(this).find('input[name=isAttractSku]')
            if(curDom.data('id') !== id){
                params.push({id:curDom.data('id'), isAttractSku: false })
            }
        })
        commonReturnPromiseRes({
            url: ctx + '/onlineProductEbay/updateAtrractSku',
            type: 'post',
            contentType: 'application/json',
            params:JSON.stringify(params)
        }).then(()=>{
            // 同一个listing只能选择一个子sku为开启状态，或者都不开启
            if(obj.elem.checked){
                trDoms.each(function(){
                    let curDom = $(this).find('input[name=isAttractSku]')
                    if(curDom.data('id') !== id){
                        curDom.prop('checked',false)
                    }
                })
                form.render()
            }
            // update
            table.cache.ebay_online_data_table.some((item,index)=>{
                if(item.itemId == itemId ){
                    table.cache.ebay_online_data_table[index].prodSyncSEbayDtos = table.cache.ebay_online_data_table[index].prodSyncSEbayDtos.map(elem=>({
                        ...elem, isAttractSku: elem.id==id ? obj.elem.checked : false
                    }))
                    return true
                }
            })
        }).catch(err=>{
            layer.msg(err, {icon: 2})
            // 没修改成功,恢复原样
            $(obj.elem).prop('checked',!obj.elem.checked)
            form.render()
        })

    })
    /**
     * 监听表格复选框选择添加选中数据到arr中
     */
    table.on('checkbox(ebay_online_data_table)', function(obj) {
        var checkStatus = table.checkStatus('ebay_online_data_table'),
            date = checkStatus.data;
        if ($("#ebay_online_online_num_span").parents("li").hasClass("layui-this")) {
            modifyTitle_arr = date;
        }
    });
    /**
     * 批量更新
     * @param itemIds
     */
    function updateBacthEbayItem(itemIds) {
        loading.show();
        if (itemIds == null || itemIds == '') {
            layer.msg("请选择lisiting", { icon: 0 });
            return;
        }
        $.ajax({
            type: "post",
            url: ctx + "/onlineProductEbay/updateBacthItem.html",
            data: { "itemIds": itemIds },
            dataType: "json",
            success: function(returnData) {
                loading.hide();
                if (returnData.code == "0000") {
                    layer.msg(returnData.msg, { icon: 1 });
                } else {
                    layer.open({
                        title: '更新lisiting结果',
                        content: returnData.msg,
                        offset: '100px',
                        area: '500px',
                        yes: function(index, layero) {
                            layer.close(index); //如果设定了yes回调，需进行手工关闭
                        }
                    });
                }
            }
        })
    }
    /**
     * 初始化ebay站点和促销信息以及物流属性配置信息(初始化,未触发店铺选择)
     */
    function ebayOnline_initEbaySite() {
        var storeAcctId=null;
        var Sites = [];
        $.ajax({
            type: "post",
            url: ctx + "/onlineProductEbay/getAllEbaySiteAndLogisAttr",
            // data: { "storeAcctId": storeAcctId },
            dataType: "json",
            success: function(returnData) {
                if (returnData.code == "0000") {
                    var str = "<option value=''></option>";
                    $(returnData.data.ebaySiteList).each(function() {
                        Sites.push({ name: this.siteName, value: this.siteId })
                    });
                    // var promotionStr = "<option value=''></option>";
                    // $(returnData.data.promotionNameList).each(function() {
                    //     promotionStr += "<option value='" + this + "'>" + this + "</option>";
                    // });
                    // $("#ebay_online_promotion_sel").html(promotionStr);
                    // var marketingPromotionStr = "<option value=''></option> <option value='noPromotion'>无促销</option>";
                    // $(returnData.data.marketingPromotionNameList).each(function() {
                    //     marketingPromotionStr += "<option value='" + this + "'>" + this + "</option>";
                    // });
                    // $("#ebay_online_marketing_promotion_sel").html(marketingPromotionStr);
                    var currentLogisAttr = [];
                    $(returnData.data.logisAttrList).each(function() {
                        var a = { name: this.name, value: this.name };
                        currentLogisAttr.push(a);
                    });
                    formSelects.data('ebay_online_logistics_sel', 'local', { arr: currentLogisAttr });
                    formSelects.data('ebay_online_site_sel', 'local', { arr: Sites })
                    form.render();
                } else {
                    layer.msg(returnData.msg);
                }
            }
        })
    };
    /**
     * 根据选择的店铺赋值促销1.0和2.0
    */
    function ebayOnline_initEbaySiteFromStore(){

        $('#syncIcon').click(function() {
            // formSelects.opened('ebayOnline_tortPlat', function(id){
                //id:点击select的id
                var $vals = $('[name=ebay_online_store_sel_name]').val();
                let storeList = $vals?.split(',')
                if (storeList?.length > 1) {
                    return layer.msg('只能选择一个店铺')
                }
                if($vals == ''){
                    return layer.msg('请先选择一个店铺')
                }else{
                    $.ajax({
                        type: "post",
                        url: ctx + "/onlineProductEbay/getAllPromotionName",
                        data: JSON.stringify([$vals]),
                        dataType: "json",
                        contentType: "application/json",
                        success: function(returnData){
                            if(returnData.code == '0000'){
                                var marketingPromotionStr = "<option value=''></option> <option value='noPromotion'>无促销</option>";
                                $(returnData.data).each(function(index, item) {
                                    marketingPromotionStr += "<option value='" + item + "'>" + item + "</option>";
                                });
                                $("#ebay_online_marketing_promotion_sel").html(marketingPromotionStr);
                            }
                            form.render('select');
                        }
                    })
    
                }
                const arr = $vals === '' ? [] :$vals.split(',')
                ebayOnline_getEnableRules(arr)
    
            // }, true)
        })
    }

    /**
     * 修改某一条记录的标签信息
     * @param id
     * @param oldMarks
     */
    function ebayOnline_updateBatchEbayItemMarks(id, oldMarks) {
        if (oldMarks == null) {
            oldMarks = "";
        } else {
            oldMarks = oldMarks + ",";
        }
        var options = {
            type: 1,
            title: "修改ebay在线listing标签",
            btn: ['保存', '关闭'],
            area: ["800px", "500px"],
            content: $('#ebayOnline_updateBatchEbayItemMarksLayer').html(),
            success: function(layero, index) {
                var str = "";
                $.each(ebayOnline_marksCheckData, function(index, element) {
                    var tempstr = element.id + ",";
                    var isFixed = element.name == '待调价' || element.name == '国内仓<10%毛利率' || element.name == '虚拟仓<15%毛利率' || element.name == '无流量';
                    isFixed = isFixed || element.name == '系统待优化' || element.name == '优化完成';
                    if (oldMarks.indexOf(tempstr) > -1) { //含有
                        if (isFixed) {
                            str += '<input type="checkbox"  value="' + element.id + '" lay-skin="primary" title="' + element.name + '" lay-filter="ebayonline_marksCheck" checked disabled>';
                        } else {
                            str += '<input type="checkbox"  value="' + element.id + '" lay-skin="primary" title="' + element.name + '" lay-filter="ebayonline_marksCheck" checked>';
                        }
                    } else {
                        if (isFixed) {
                            str += '<input type="checkbox"  value="' + element.id + '" lay-skin="primary" title="' + element.name + '" lay-filter="ebayonline_marksCheck" disabled>';
                        } else {
                            str += '<input type="checkbox"  value="' + element.id + '" lay-skin="primary" title="' + element.name + '" lay-filter="ebayonline_marksCheck" >';
                        }
                    }
                });
                $("#ebay_online_update_marks_form").html($(str));
                form.render('checkbox');
                form.on('checkbox(ebayonline_marksCheck)', function(data) { //标签复选框监听
                    var cvalue = $(data.elem).attr("title");
                    if (cvalue == '待调价' && data.elem.checked) {
                        $("#ebay_online_update_marks_form").find(".layui-form-checked").each(function() {
                            var markVal = $(this).prev().attr("title");
                            if (markVal != null && markVal == '调价完成') {
                                $(this).prev().prop("checked", false);
                                return;
                            }
                        });
                        form.render('checkbox');
                    } else if (cvalue == '调价完成' && data.elem.checked) {
                        $("#ebay_online_update_marks_form").find(".layui-form-checked").each(function() {
                            var markVal = $(this).prev().attr("title");
                            if (markVal != null && markVal == '待调价') {
                                $(this).prev().prop("checked", false);
                                return;
                            }
                        });
                    } else if (cvalue == '国内仓<10%毛利率' && data.elem.checked) {
                        $("#ebay_online_update_marks_form").find(".layui-form-checked").each(function() {
                            var markVal = $(this).prev().attr("title");
                            if (markVal != null && markVal == '虚拟仓<15%毛利率') {
                                $(this).prev().prop("checked", false);
                                return;
                            }
                        });
                    } else if (cvalue == '虚拟仓<15%毛利率' && data.elem.checked) {
                        $("#ebay_online_update_marks_form").find(".layui-form-checked").each(function() {
                            var markVal = $(this).prev().attr("title");
                            if (markVal != null && markVal == '国内仓<10%毛利率') {
                                $(this).prev().prop("checked", false);
                                return;
                            }
                        });
                    }
                    form.render('checkbox');
                })

            },
            yes: function(index, layero) {
                var marks = []; //审核状态
                $("#ebay_online_update_marks_form").find(".layui-form-checked").each(function() {
                    marks.push($(this).prev().val());
                });
                var updateJson = [];
                var obj = {};
                obj.id = id;
                obj.marks = marks.join(",");
                if (oldMarks.indexOf("调价完成") == -1 && obj.marks.indexOf('调价完成') > -1) { //原先没有调价完成，本次操作调价完成
                    obj.needBack = 'yes';
                } else {
                    obj.needBack = 'no';
                }
                updateJson.push(obj);
                ebayOnline_bacthMarksEbayItem(updateJson);
            }
        }
        var index = admin.popup(options);
    }

    /**
     * 打标签
     * @param updateJson
     */
    function ebayOnline_bacthMarksEbayItem(updateJson) {
        loading.show();
        $.ajax({
            type: "post",
            url: ctx + "/onlineProductEbay/updateBatchEbayItemMarks.html",
            data: { "updateJson": JSON.stringify(updateJson) },
            dataType: "json",
            success: function(returnData) {
                loading.hide();
                if (returnData.code == "0000") {
                    layer.msg(returnData.msg, { icon: 1 });
                } else {
                    layer.msg(returnData.msg, { icon: 2 });
                }
            }
        })
        return;
    };

    // 导出采购入库单
    $("#ebay_onlilne_export_btn").click(function() {
        var confirmindex = layer.confirm('确认导出当前搜索条件下的ebay在线商品？', { btn: ['确认', '取消'] }, function() {
            var itemData = table.checkStatus('ebay_online_data_table').data; //获取选择的店铺
            var itemIds = [];
            for (var index in itemData) {
                var obj = itemData[index];
                itemIds.push(obj.itemId);
            }
            var data = getSerachData();
            if (itemData != null && itemData.length > 0) {
                data.itemID = itemIds.join(",");
            }
            submitForm(data, ctx + '/onlineProductEbay/exportEbayOnlineInfo.html', "_blank")
            layer.close(confirmindex);
        }, function() {
            layer.close(confirmindex);
        })
    });
    /**
     * 根据itemId获取竞品链接数据
     * @param itemId
     */
    function ebayOnline_resolveItem(itemId, data) {
        if (itemId == null || itemId == '') {
            return;
        }
        $("#ebay_online_optimize_our_title").html(data.title);
        $("#ebay_online_optimize_our_price").html(data.currentPrice);
        $("#ebay_online_optimize_our_desc").html("");
        admin.load.show();
        $.ajax({
            url: ctx + '/itemcollect/resolveEbayItem.html',
            data: { "itemId": itemId },
            dataType: "json",
            type: "post",
            success: function(returnData) {
                admin.load.hide();
                if (returnData.code == "0000") {
                    $("#ebay_online_optimize_comp_title").html(returnData.data.title);
                    $("#ebay_online_optimize_comp_price").html(returnData.data.minPrice);
                    $("#ebay_online_optimize_comp_desc").html(returnData.data.descSrc);
                    layer.msg('获取竞品信息成功', { icon: 1 });
                } else {
                    layer.msg(returnData.msg, { icon: 5 });
                }
            },
            error: function() {
                layer.msg("服务器正忙", { icon: 5 });
            }
        });
    }
    /**
     * 获取ebay在线商品配置的标签属性
     */
    ebayOnline_getEbayOnlineMarks(); //初始化ebay在线商品标签
    function ebayOnline_getEbayOnlineMarks() {
        $.ajax({
            type: "post",
            url: ctx + "/onlineProductEbay/getEbayOnlineMarks.html",
            dataType: "json",
            success: function(returnData) {
                if (returnData.code == "0000") {
                    var str = '';
                    var tagStr = '';
                    ebayOnline_marksCheckData = returnData.data;
                    $.each(returnData.data, function(index, element) {
                        if (element.name.indexOf("调价完成") == -1) {
                            str += '<input type="checkbox"  value="' + element.id + '" lay-skin="primary" title="' + element.name + '" lay-filter="ebayonline_marksCheck" >';
                            if (element.name.indexOf("人工待优化") > -1) {
                                tagStr += '<option value="' + element.id + '"  >' + element.name + '</option>';
                            }
                        } else {
                            tagStr += '<option value="' + element.id + '"  >' + element.name + '</option>';
                        }
                    });
                    commonReturnPromise({
                        url: '/lms/sys/ebayAcctTypeEnum.html',
                        type: 'post',
                    }).then((res)=> {
                        commonRenderSelect('ebay_online_Account_type', res, {code: 'name', name: 'name'})
                        formSelects.render('ebay_online_Account_type');
                    }).catch((err)=>{
                        layer.msg(err, {icon:2});
                    })
                    $("#ebay_online_tagsOperate_sel").append(tagStr);
                    $("#ebay_online_marks_form").append($(str));
                    form.render('checkbox');
                    form.render('select');
                } else {
                    console.log("获取getEBayOnlineMarks标签枚举出错");
                }
            }
        });
        if ($("#outof_stock_prod_sku_hidden").length == 1) {
            $("#ebay_online_searchtype_sel").val('prodSSku'); //商品子sku
            ebaySkus = $("#outof_stock_prod_sku_hidden").val();
            form.render();
            setTimeout(function() {
                // $("#ebay_online_search_submit").trigger('click');//搜索对应的在线商品
                $('#ebay_online_isEnableSel').next().find('dd:nth-child(4)').trigger('click')
            }, 500); //延迟2s
        }
    }
    /**
     * 获取搜索参数
     */
    function getSerachData() {
        var obj = {};
        var sites = formSelects.value("ebay_online_site_sel", "val"); //站点id
        obj.siteId = sites.join(",");
        var currentStoreAccts = formSelects.value("ebay_online_store_sel", "val"); //所选店铺
        if (currentStoreAccts == null || currentStoreAccts.length == 0) { //没有选择店铺
            var acctIds = $("#ebay_online_store_sel").attr("acct_ids");
            if (acctIds != null && acctIds != '') {
                obj.storeAcctId = acctIds;
            } else {
                obj.storeAcctId = 99999;
            }
        } else {
            obj.storeAcctId = currentStoreAccts.join(","); //选择的店铺
        }
        obj.listSearchType = $.trim($("#ebay_online_listtype_sel").val()); //刊登搜索类型
        obj.isMultiSku = $.trim($("#ebay_online_producttype_sel").val()); //是否多属性
        obj.itemID = $.trim($("#ebay_online_itemId").val()); //物品号
        obj.quantityType = $.trim($("#ebay_noline_quantitytype_sel").val());
        obj.quantity = $.trim($("#ebay_online_quantity").val());
        obj.soldNumType = $.trim($("#ebay_noline_soldnumtype_sel").val());
        obj.soldNums = $.trim($("#ebay_online_soldnum").val());
        obj.subTitleType = $.trim($("#ebay_online_subtile_sel").val());
        obj.isBestoffer = $.trim($("#ebay_online_bestoffer_sel").val());
        obj.listingTimeType = $.trim($("#ebay_online_listtime_sel").val());
        obj.marketingPromotionName = $.trim($("#ebay_online_marketing_promotion_sel").val());
        var listingTimeType = $.trim($("#ebay_online_listtime_sel").val());
        obj.prodAttrs = $.trim($("#ebay_online_productLabel_sel").val());
        obj.saleStatusListStr = layui.formSelects.value('ebay_online_productStatus', 'valStr');
        obj.ebayCategory1 = $.trim($("#ebay_online_ebayCategory1").val());
        obj.ebayCategory1Type = $('input[name="ebayCategory1Type"]:checked').val() ? 1 : 0;
        obj.ebayCategory2Type = $('input[name="ebayCategory2Type"]:checked').val() ? 1 : 0;
        obj.ebayCategory2 = $.trim($("#ebay_online_ebayCategory2").val());
        obj.pSoldNumsStart = $.trim($("#ebay_online_pSoldNumsStart").val());
        obj.pSoldNumsEnd = $.trim($("#ebay_online_pSoldNumsEnd").val());
        obj.notSoldDays = $.trim($("#ebay_online_notSoldDays").val());
        obj.acctTypeList = formSelects.value("ebay_online_Account_type", "val").join(',');
        obj.devTypes  = formSelects.value("devTypes_ebay_online", "val").join(',');
        obj.ruleId  = $.trim($("#ebay_online_ruleId").val());

        // 更多查询 - 境内物流1运费
        obj.shippingSrv1CostMin  = $.trim($("#shippingSrv1CostMin").val()) || '';
        obj.shippingSrv1CostMax  = $.trim($("#shippingSrv1CostMax").val()) || '';

        var lisitingTime = $.trim($("#ebay_online_listtime").val());
        if (listingTimeType != null) {
            if (lisitingTime != null) {
                if (listingTimeType == 1) { //刊登时间区间
                    obj.listingStartTimeFrom = lisitingTime.substring(0, 10);
                    obj.listingStartTimeEnd = lisitingTime.substring(13);
                } else if (listingTimeType == 2){ //结束时间区间
                    obj.listingEndTimeFrom = lisitingTime.substring(0, 10);
                    obj.listingEndTimeEnd = lisitingTime.substring(13);
                }else{//优化时间
                    obj.listingOptimizedFrom = lisitingTime.substring(0, 10);
                    obj.listingOptimizedEnd = lisitingTime.substring(13);
                }
            }
        }
        obj.dispatchTimeMax = $.trim($("#ebay_online_dispatch_time_max").val());
        obj.returnsWithinOption = $.trim($("#ebay_online_returnback_sel").val());
        obj.listingBySystem = $.trim($("#ebay_online_listing_creator").val());
        var searchType = $.trim($("#ebay_online_searchtype_sel").val()); //搜索类型
        if (searchType == "prodPSKu") {
            obj.prodPSKu = $.trim($("#ebay_online_searchtype_input").val());
        } else if (searchType == "prodSSku") {
            obj.prodSSku = $.trim($("#ebay_online_searchtype_input").val());
        } else if (searchType == "storePSku") {
            obj.storePSku = $.trim($("#ebay_online_searchtype_input").val());
        } else if (searchType == "storeSSku") {
            obj.storeSSku = $.trim($("#ebay_online_searchtype_input").val());
        }
        var titleSearchType = $.trim($("#ebay_online_title_search_type").val()); //标题检索类型
        obj.titleSearchType = titleSearchType;
        // var ebay_online_userId =   $.trim($("#ebay_online_searchForm input[name=ebay_online_userId]").val());
        // if(ebay_online_userId != null && ebay_online_userId !=''){
        //     obj.ebay_online_userId = ebay_online_userId;
        // } //开发专员销售

        var title = $.trim($("#ebay_online_title").val()); //刊登标题
        if (title != null && title != '') {
            if (titleSearchType == 0) { //标题模糊
                var array = title.split(" ");
                obj.title = "";
                for (var i = 0; i < array.length; i++) {
                    if ($.trim(array[i]) != null && $.trim(array[i]) != '') {
                        obj.title += "+" + $.trim(array[i]);
                        if (i != array.length - 1) {
                            obj.title += " ";
                        }
                    }
                }
            } else if (titleSearchType == 1) { //标题精准
                obj.title = "%" + title + "%";
            }
        }
        var locationType = $.trim($("#ebay_online_location_search_type").val()); //所在地类型查询
        if (locationType != null && locationType != '') {
            var locationText = $.trim($("#ebay_online_location_text").val());
            if (!$.isEmptyObject(locationText)) {
                if (locationType == '1') { //商品所在地
                    obj.country = locationText;
                }else if (locationType == '2') { //location
                    obj.location = locationText;
                }
            }
        }
        var logisAttrStrObj = formSelects.value("ebay_online_logistics_sel");
        var logisAttrArray = []; //选择的多个物流属性
        obj.notLogisAttrStr = "";
        if (!$.isEmptyObject(logisAttrStrObj)) {
            for (var i = 0; i < logisAttrStrObj.length; i++) {
                var elestr = $.trim(logisAttrStrObj[i].val);
                logisAttrArray.push(elestr);
                if (elestr.indexOf('普货') > -1 || elestr.indexOf('无物流属性') > -1) {
                    obj.notLogisAttrStr = "1";
                }
            }
        }
        obj.logisAttrStr = logisAttrArray.join(","); //物流属性
        obj.logisAttrStrType = $.trim($("#ebay_online_logistics_search_type").val());
        obj.listingMethod = $.trim($("#ebay_online_lisitingMethod_sel").val());//刊登方式
        obj.isOffline = currentIsOffline;
        obj.lastWeekSales = ''; //上周销量
        obj.orderBy = $.trim($("#ebay_online_sortdesc_sel").val()); //排序类型
        var marks = []; //审核状态
        $("#ebay_online_marks_form").find(".layui-form-checked").each(function() {
            var markVal = $(this).prev().val();
            var markTitle = $(this).prev().attr('title');
            if (markVal != null && markVal != '') {
                marks.push(markVal);
            }
            if (markTitle.indexOf('优化完成') > -1) {
                obj.isOptimized = 1;
            }
        });
        if (obj.isOptimized == 1) { //优化完成
            if (obj.orderBy == null || obj.orderBy == '') {
                obj.orderBy = "e.optimized_time desc"; //默认优化时间倒序
            }
        } else {
            if (obj.orderBy != null && obj.orderBy.indexOf("four_week_count") > -1) {
                obj.orderBy = null;
            }
        }
        obj.marks = marks.join(",");
        obj.priceStart = $.trim($("#ebay_online_priceStart_text").val());
        obj.priceEnd = $.trim($("#ebay_online_priceEnd_text").val());
        obj.primaryCateId = $.trim($("#ebay_online_primary_cate_id").val()); //类目id
        var logisticsType=$("#ebay_online_logisticsType_sel").val();
        if(logisticsType=="1"){ //境内物流1
            obj.shippingService1=$.trim($("#ebay_online_logisticsType_input").val());
        }else if(logisticsType=="2"){//境外物流1
            obj.intShippingService1=$.trim($("#ebay_online_logisticsType_input").val());
        }
        ebayOnPro_displayAccurateCount = $('#ebayOnPro_displayAccurateCount input[name=ebayOnPro_accurateCount]').prop('checked') ? 1 : 0
        obj.displayAccurateCount = $('#ebayOnPro_displayAccurateCount input[name=ebayOnPro_accurateCount]').prop('checked') ? 1 : 0

        //预计可用库存
        if($("#ebay_online_searchForm select[name=stockType]").val()=='available'){
            obj.preAvailableStockAllMin = $("#ebay_online_searchForm input[name=stockMin]").val()
            obj.preAvailableStockAllMax = $("#ebay_online_searchForm input[name=stockMax]").val()
        }else{
            obj.preAvailableStockMin  = $("#ebay_online_searchForm input[name=stockMin]").val()
            obj.preAvailableStockMax = $("#ebay_online_searchForm input[name=stockMax]").val()
        }

        // 更多查询-重量
        if($("#ebay_online_searchForm select[name=weightType]").val()){
            obj.weightType = Number($("#ebay_online_searchForm select[name=weightType]").val())
            obj.minWeight = $.trim($("#ebay_online_minWeight_text").val()) || ''
            obj.maxWeight = $.trim($("#ebay_online_maxWeight_text").val()) || ''

        }

        // 禁售平台
        obj.prohibitPlat = $('#ebayOnline_prohibitPlat').val()
        // 禁售站点
        obj.prohibitSalesSiteIdStr = formSelects.value("ebayOnline_prohibitSalesSiteId",'valStr')
        // 侵权状态
        let tortPlats = formSelects.value("ebayOnline_tortPlat",'val')
        if(tortPlats.length){
            tortPlats.forEach(item=>{
                // 都选了就传个0,1以外的值，-1也行
                if(obj[item.split('_')[0]]!==undefined){
                    obj[item.split('_')[0]] = -1
                }else{
                    obj[item.split('_')[0]] = Number(item.split('_')[1])
                }
            })
        }

        return obj;
    }
});

/**
 * 显示商品详情
 */
function changeColspantable(obj) {
    $(obj).prev().find(".myj-hide").toggle();
    var str = $(obj).html();
    if (str.indexOf("展开") > -1) {
        $(obj).html("- 收起")
    } else {
        $(obj).html("+ 展开")
    }
}

// 评价弹窗
function ebayOnlineproduct_commentsHandle(data) {
    let prodSSku = []
    data.prodSyncSEbayDtos?.forEach(item => {
        if (item.prodSSku) {
            let obj = { 
                name: item.prodSSku
            }
            prodSSku.push(obj)
        }
    })
    layer.open({
        type: 1,
        title: data.itemId + '的评价内容',
        shadeClose: false,
        area: ['60%', '60%'],
        content: $('#comments_table_ebay').html(),
        success: function() {
            layui.laydate.render({
                elem: '#ebayCommentTime',
                range: true
            });
            appendSelect($('#ebay_online_comment_sku'), prodSSku || [], 'name', 'name')
            ebayOnlineproduct_editCommentHandle(data)
            layui.formSelects.render('ebay_online_comment_sku')
            layui.form.render()

            $('#ebay_online_search_comment').on('click', function() {
                ebayOnlineproduct_editCommentHandle(data)
            })
        }
    })

}

function ebayOnlineproduct_editCommentHandle(data) {
    let infoObj = serializeObject($('#commentTableForm'))
    let commentTime = $.trim($('#ebayCommentTime').val())
    let commentTimeStart = ''
    let commentTimeEnd = ''
    if (commentTime) {
        commentTimeStart = new Date(commentTime.substring(0, 10) + ' 00:00:00').getTime()
        commentTimeEnd = new Date(commentTime.substring(13) + ' 23:59:59').getTime()
    }
    let params = {
        commentTimeStart,
        commentTimeEnd,
        itemIdList: [data.itemId],
        prodSSkuList: infoObj.ebay_online_comment_sku ? infoObj.ebay_online_comment_sku?.split(',') : [],
        commentType: $('#commentType').val()
    }
   layui.table.render({
        elem: '#ebay_comments_table',
        method: 'post',
        url: ctx + '/msgFeedbackEbay/showCommentsPage',
        contentType: 'application/json',
        where: params,
        page: true,
        limits: [50, 100, 300],
        limit: 50,
        cols: [
            [  { field: 'prodSSku', title: 'SKU' },
               { field: 'commentType', title: '评价类型',  templet: "#commentTpeTpl" },
               { field: 'commentTime', title: '评价时间', templet: "<div>{{layui.util.toDateString(d.commentTime,'yyyy-MM-dd HH:mm:ss')}}</div>" },
               { field: 'commentText', title: '评价内容', width: '25%' }

            ]
        ],
    })
}

//修改listing弹框
function ebayOnlineproduct_editListingHandle(id, readOnly){
    var layer = layui.layer,
    laytpl = layui.laytpl,
    $ = layui.$,
    form = layui.form
    var btn = [];
    if (!readOnly) {
        // btn = ['保存并发布', '保存', '关闭'];
        btn = ['提交', '关闭'];
    }
    layer.open({
        type: 1,
        title: '产品详情',
        btn: btn,
        area: ['100%', '100%'],
        content: "加载中...",
        id: 'ebayOnlineproductIdLayer',
        success: function(layero, index) {
            form.on('select(ebay_onlineproduct_sufixSetType)',function(obj){
                if(obj.value==1||obj.value==3){
                    obj.othis.siblings('.replacehide').addClass('hide')
                }else{
                    obj.othis.siblings('.replacehide').removeClass('hide')
                }
                // if()
            });
            //绑定修改标题显示剩余字符数量
            layero.on('input', '#ebayOnlineproduct_listDetailForm input[name=title]', function() {
                var title = $(this).val();
                var lastNum = 80 - title.length;
                $(this).next('b').text(lastNum);
                if (lastNum >= 0) {
                    $(this).next('b').css("color", "green");
                } else {
                    $(this).next('b').css("color", "red");
                }
            });
            $.ajax({
                url: ctx + '/onlineProductEbay/getItemDetail.html',
                type: 'post',
                dataType: 'json',
                data: { id: id },
                beforeSend: function(){
                    loading.show();
                },
                success: function(returnData) {
                    loading.hide();
                    if (returnData.code != "0000") {
                        layer.msg(returnData.msg, { icon: 2 });
                        return;
                    }
                    laytpl($("#ebayOnlineproduct_listDetailTpl").html()).render(returnData.data, function(html) {
                        $(layero).find('.layui-layer-content').html(html);
                        $("#ebayOnlineproduct_listDetailForm .ebayPublish_subSkuImg_edit_local").each(function() { //初始化本地按钮
                            ebayPublish_subSkuImg_exchangeLocal($(this));
                        });
                        ebayPublish_extImg_exchangeLocal($('.ebayPublish_extImg_edit_local'));
                        form.render('radio');
                        //拖拽
                        $('#ebayOnlineproduct_extImg').sortable({
                            cursor: "move", //拖拽时鼠标样式
                            containment: "parent",
                            items: ".imageRight", //定义可拖拽的元素
                            deactivate: function(event, ui) {
                                setMainAndExtVal();
                            },
                        });
                        ebayImgHandle();
                        //主图添加水印
                        $("#ebayOnlineproductMainImgAddWatermark").on('click', function() {
                            var layer = layui.layer,
                                $ = layui.$;
                            //弹框输入刊登在线商品数量
                            layer.open({
                                type: 1,
                                title: '主图添加水印',
                                area: ['30%', '40%'],
                                content: "",
                                btn: ['生成'],
                                success: function(layero, index) {
                                    layui.form.render();
                                    $(layero).find('.layui-layer-content').html($("#ebayPulish_info_add_water").html());
                                    $("#ebayPulish_genListTpl select[name=watermarkImage]");

                                    // var platAcctId = $("#eabyPublish_searchForm select[name=platAcctId]").val();
                                    var platAcctId = returnData.data.prodListingEbay.storeAcctId;
                                    $.ajax({
                                        type: "post",
                                        url: ctx + "/watermark/searchWatermarkBySalePlatAcctId.html",
                                        dataType: "json",
                                        data: {
                                            salesPlatAcctid: platAcctId,
                                            waterMarkType: 0
                                        },
                                        success: function(data) {
                                            ebayPublishInitWatermarkImage(data.data, "ebayPulish_info_water");
                                            layui.form.render('select');
                                        },
                                        error: function(e) {
                                            console.error(e);
                                        }
                                    });
                                    $.ajax({
                                        type: "post",
                                        url: ctx + "/watermark/searchWatermarkBySalePlatAcctId.html",
                                        dataType: "json",
                                        data: {
                                            salesPlatAcctid: platAcctId,
                                            waterMarkType: 1
                                        },
                                        success: function(data) {
                                            ebayPublishInitWatermarkFont(data.data, "ebayPulish_info_water");
                                        },
                                        error: function(e) {
                                            console.error(e);
                                        }
                                    });

                                },
                                yes: function(index, layero) {
                                    var imgPath = $("div .imageLeft").find("img")[0].src;
                                    var waterImageId = $("#ebayPulish_info_water select[name=watermarkImage] option:selected").val();
                                    var waterFontId = $("#ebayPulish_info_water select[name=watermarkFont] option:selected").val();
                                    var watermarkIds = "";
                                    if (waterImageId && waterImageId != '') {
                                        watermarkIds = waterImageId;
                                    }
                                    if (waterFontId && waterFontId != '') {
                                        watermarkIds = watermarkIds + "," + waterFontId;
                                    }
                                    $.ajax({
                                        type: "post",
                                        url: ctx + "/watermark/getWatermarkImgPath.html",
                                        dataType: "json",
                                        data: {
                                            imgPath: imgPath,
                                            watermarkIds: watermarkIds,
                                            platCode: "ebay"
                                        },
                                        beforeSend: function(){
                                            loading.show();
                                        },
                                        success: function(returnData) {
                                            loading.hide();
                                            if (returnData.code != "0000") {
                                                layer.msg(returnData.msg, { icon: 2 });
                                            } else {
                                                layer.close(index);
                                                $($("div .imageLeft").find("img")[0]).attr('src', returnData.data + "?" + new Date().getTime());
                                                $('#ebayOnlineproduct_listDetailForm input[name="mainImgUri"]').val(returnData.data);
                                                // if(returnData.data.length>0){
                                                //     layer.alert(returnData.data.join("<br>"),{icon:7});
                                                // }else{
                                                //     layer.msg("生成待刊登成功");
                                                // }
                                                // $("#eabyPublish_search").trigger("click");
                                            }
                                        },
                                        error: function(XMLHttpRequest) {
                                            loading.hide();
                                            if (XMLHttpRequest.status == 200) {
                                                layer.msg("请重新登录", { icon: 7 });
                                            } else {
                                                layer.msg("服务器错误");
                                            }
                                        }
                                    });
                                }
                            })
                        });
                        initSubSkuSpecitics(returnData.data.subSkuEbayDtos);
                    });
                    //填充信息 js方式
                    var prodListingEbay = returnData.data.prodListingEbay;
                    //初始化运送国家
                    var siteId = prodListingEbay.siteId;
                    selectebayShipTo(siteId, $(layero).find("form .ebayShipTo1"), "intShip1ToLocal");
                    selectebayShipTo(siteId, $(layero).find("form .ebayShipTo2"), "intShip2ToLocal");
                    selectebayShipTo(siteId, $(layero).find("form .ebayShipTo3"), "intShip3ToLocal");
                    selectebayShipTo(siteId, $(layero).find("form .ebayShipTo4"), "intShip4ToLocal");
                    selectebayShipTo(siteId, $(layero).find("form .ebayShipTo5"), "intShip5ToLocal");
                    //非站点运输国家
                    if (prodListingEbay.intShip1ToLocal) {
                        var intShip1ToLocal = prodListingEbay.intShip1ToLocal.split(",");
                        for (var i = 0; i < intShip1ToLocal.length; i++) {
                            $(layero).find("form input[name=intShip1ToLocal][value=" + intShip1ToLocal[i] + "]").prop("checked", true);
                        }
                    }
                    if (prodListingEbay.intShip2ToLocal) {
                        var intShip2ToLocal = prodListingEbay.intShip2ToLocal.split(",");
                        for (var i = 0; i < intShip2ToLocal.length; i++) {
                            $(layero).find("form input[name=intShip2ToLocal][value=" + intShip2ToLocal[i] + "]").prop("checked", true);
                        }
                    }
                    if (prodListingEbay.intShip3ToLocal) {
                        var intShip3ToLocal = prodListingEbay.intShip3ToLocal.split(",");
                        for (var i = 0; i < intShip3ToLocal.length; i++) {
                            $(layero).find("form input[name=intShip3ToLocal][value=" + intShip3ToLocal[i] + "]").prop("checked", true);
                        }
                    }
                    if (prodListingEbay.intShip4ToLocal) {
                        var intShip4ToLocal = prodListingEbay.intShip4ToLocal.split(",");
                        for (var i = 0; i < intShip4ToLocal.length; i++) {
                            $(layero).find("form input[name=intShip4ToLocal][value=" + intShip4ToLocal[i] + "]").prop("checked", true);
                        }
                    }
                    if (prodListingEbay.intShip5ToLocal) {
                        var intShip5ToLocal = prodListingEbay.intShip5ToLocal.split(",");
                        for (var i = 0; i < intShip5ToLocal.length; i++) {
                            $(layero).find("form input[name=intShip5ToLocal][value=" + intShip5ToLocal[i] + "]").prop("checked", true);
                        }
                    };
                    //应用公共模块
                    var assiFieldShipMap = {};
                    $.ajax({
                        type: "post",
                        url: ctx + "/assifieldebay/listsiteship.html",
                        dataType: 'json',
                        data: { siteId: siteId },
                        success: function(returnData) {
                            if (returnData.code != "0000") {
                                layer.msg(returnData.msg);
                            } else {
                                // console.log('物流详情', returnData.data)
                                var str = '<option value=""></value>';
                                for (var i = 0; i < returnData.data.length; i++) {
                                    assiFieldShipMap[returnData.data[i].id] = returnData.data[i];
                                    str += '<option value="' + returnData.data[i].id + '">' + returnData.data[i].name + '</option>';
                                }
                                $("#ebayOnlineproduct_listDetailForm select[name=shippingTpl]").html(str);
                                form.render('select');
                            }
                        },
                        error: function(XMLHttpRequest) {
                            layui.admin.load.hide();

                            if (XMLHttpRequest.status == 200) {
                                layer.msg("请重新登录", { icon: 7 });
                            } else {
                                layer.msg("服务器错误");
                            }
                        }
                    });
                    $("#ebayPublish_applyShipping").click(function() {
                        var shippingTplId = $("#ebayOnlineproduct_listDetailForm select[name=shippingTpl]").val();
                        if (!shippingTplId) {
                            layer.msg("未选中物流模板");
                            return;
                        }
                        var assiFieldShip = assiFieldShipMap[shippingTplId];
                        //国内1
                        $("#ebayOnlineproduct_listDetailForm input[name=shippingService1]").val(assiFieldShip.shipSrv1);
                        $("#ebayOnlineproduct_listDetailForm input[name=shippingSrv1Cost]").val(assiFieldShip.shipSrv1Cost);
                        $("#ebayOnlineproduct_listDetailForm input[name=shippingSrv1AddiCost]").val(assiFieldShip.shipSrv1AddedCost);
                        //国内2
                        $("#ebayOnlineproduct_listDetailForm input[name=shippingService2]").val(assiFieldShip.shipSrv2);
                        $("#ebayOnlineproduct_listDetailForm input[name=shippingSrv2Cost]").val(assiFieldShip.shipSrv2Cost);
                        $("#ebayOnlineproduct_listDetailForm input[name=shippingSrv2AddiCost]").val(assiFieldShip.shipSrv2AddedCost);
                        //国内运输方式3
                        $("#ebayOnlineproduct_listDetailForm input[name=shippingService3]").val(assiFieldShip.shipSrv3);
                        $("#ebayOnlineproduct_listDetailForm input[name=shippingSrv3Cost]").val(assiFieldShip.shipSrv3Cost);
                        $("#ebayOnlineproduct_listDetailForm input[name=shippingSrv3AddiCost]").val(assiFieldShip.shipSrv3AddedCost);
                        //国内运输方式4
                        $("#ebayOnlineproduct_listDetailForm input[name=shippingService4]").val(assiFieldShip.shipSrv4);
                        $("#ebayOnlineproduct_listDetailForm input[name=shippingSrv4Cost]").val(assiFieldShip.shipSrv4Cost);
                        $("#ebayOnlineproduct_listDetailForm input[name=shippingSrv4AddiCost]").val(assiFieldShip.shipSrv4AddedCost);
                        //境外1
                        $("#ebayOnlineproduct_listDetailForm input[name=intShippingService1]").val(assiFieldShip.intlShipSrv1);
                        $("#ebayOnlineproduct_listDetailForm input[name=intShippingSrv1Cost]").val(assiFieldShip.intlShipSrv1Cost);
                        $("#ebayOnlineproduct_listDetailForm input[name=intShippingSrv1AddiCost]").val(assiFieldShip.intlShipSrv1AddedCost);
                        $("#ebayOnlineproduct_listDetailForm input[name=intShip1ToLocal]").prop("checked", false);
                        if (assiFieldShip.intlShip1ToCountries) {
                            var intlShip1ToCountries = assiFieldShip.intlShip1ToCountries.split(",");
                            for (var i = 0; i < intlShip1ToCountries.length; i++) {
                                $("#ebayOnlineproduct_listDetailForm input[name=intShip1ToLocal][value=" + intlShip1ToCountries[i] + "]").prop("checked", true);
                            }
                        }
                        //境外2
                        $("#ebayOnlineproduct_listDetailForm input[name=intShippingService2]").val(assiFieldShip.intlShipSrv2);
                        $("#ebayOnlineproduct_listDetailForm input[name=intShippingSrv2Cost]").val(assiFieldShip.intlShipSrv2Cost);
                        $("#ebayOnlineproduct_listDetailForm input[name=intShippingSrv2AddiCost]").val(assiFieldShip.intlShipSrv2AddedCost);
                        $("#ebayOnlineproduct_listDetailForm input[name=intShip2ToLocal]").prop("checked", false);
                        if (assiFieldShip.intlShip2ToCountries) {
                            var intlShip2ToCountries = assiFieldShip.intlShip2ToCountries.split(",");
                            for (var i = 0; i < intlShip2ToCountries.length; i++) {
                                $("#ebayOnlineproduct_listDetailForm input[name=intShip2ToLocal][value=" + intlShip2ToCountries[i] + "]").prop("checked", true);
                            }
                        }
                        //境外运输方式3
                        $("#ebayOnlineproduct_listDetailForm input[name=intShippingService3]").val(assiFieldShip.intlShipSrv3);
                        $("#ebayOnlineproduct_listDetailForm input[name=intShippingSrv3Cost]").val(assiFieldShip.intlShipSrv3Cost);
                        $("#ebayOnlineproduct_listDetailForm input[name=intShippingSrv3AddiCost]").val(assiFieldShip.intlShipSrv3AddedCost);
                        $("#ebayOnlineproduct_listDetailForm input[name=intShip3ToLocal]").prop("checked", false);
                        if (assiFieldShip.intlShip3ToCountries) {
                            var intlShip3ToCountries = assiFieldShip.intlShip3ToCountries.split(",");
                            for (var i = 0; i < intlShip3ToCountries.length; i++) {
                                $("#ebayOnlineproduct_listDetailForm input[name=intShip3ToLocal][value=" + intlShip3ToCountries[i] + "]").prop("checked", true);
                            }
                        }

                        //境外运输方式4
                        $("#ebayOnlineproduct_listDetailForm input[name=intShippingService4]").val(assiFieldShip.intlShipSrv4);
                        $("#ebayOnlineproduct_listDetailForm input[name=intShippingSrv4Cost]").val(assiFieldShip.intlShipSrv4Cost);
                        $("#ebayOnlineproduct_listDetailForm input[name=intShippingSrv4AddiCost]").val(assiFieldShip.intlShipSrv4AddedCost);
                        $("#ebayOnlineproduct_listDetailForm input[name=intShip4ToLocal]").prop("checked", false);
                        if (assiFieldShip.intlShip4ToCountries) {
                            var intlShip4ToCountries = assiFieldShip.intlShip4ToCountries.split(",");
                            for (var i = 0; i < intlShip4ToCountries.length; i++) {
                                $("#ebayOnlineproduct_listDetailForm input[name=intShip4ToLocal][value=" + intlShip4ToCountries[i] + "]").prop("checked", true);
                            }
                        }

                        //境外运输方式5
                        $("#ebayOnlineproduct_listDetailForm input[name=intShippingService5]").val(assiFieldShip.intlShipSrv5);
                        $("#ebayOnlineproduct_listDetailForm input[name=intShippingSrv5Cost]").val(assiFieldShip.intlShipSrv5Cost);
                        $("#ebayOnlineproduct_listDetailForm input[name=intShippingSrv5AddiCost]").val(assiFieldShip.intlShipSrv5AddedCost);
                        $("#ebayOnlineproduct_listDetailForm input[name=intShip5ToLocal]").prop("checked", false);
                        if (assiFieldShip.intlShip5ToCountries) {
                            var intlShip5ToCountries = assiFieldShip.intlShip5ToCountries.split(",");
                            for (var i = 0; i < intlShip5ToCountries.length; i++) {
                                $("#ebayOnlineproduct_listDetailForm input[name=intShip5ToLocal][value=" + intlShip5ToCountries[i] + "]").prop("checked", true);
                            }
                        }
                        form.render();
                    });

                    $("#ebayPublish_batchChangePriceBtn").click(function() {
                        var operator = $(this).parents(".pricemodify").find("select[name=operator]").val();
                        var deviation = $(this).parents(".pricemodify").find("input[name=deviation]").val();
                        if (!deviation) {
                            layer.msg("数字有误");
                            return;
                        }
                        deviation = parseFloat(deviation);
                        $("#ebayOnlineproduct_listDetailForm .sub-sku-ebay tbody tr").each(function() {
                            var buyItNowPrice = parseFloat($(this).find("input[name=buyItNowPrice]").val());
                            if (operator == "=") {
                                buyItNowPrice = (deviation).toFixed(2);
                            } else if (operator == "+") {
                                buyItNowPrice = (buyItNowPrice + deviation).toFixed(2);
                            } else if (operator == "-") {
                                buyItNowPrice = (buyItNowPrice - deviation).toFixed(2);
                            } else if (operator == "*") {
                                buyItNowPrice = (buyItNowPrice * deviation).toFixed(2);
                            } else if (operator == "/") {
                                buyItNowPrice = (buyItNowPrice / deviation).toFixed(2);
                            }
                            if (buyItNowPrice < 0) {
                                buyItNowPrice = 0;
                            }
                            $(this).find("input[name=buyItNowPrice]").val(buyItNowPrice);
                        });
                    });
                    $("#ebayPublish_batchChangeQuantityBtn").click(function() {
                        var operator = $(this).parents(".numbermodify").find("select[name=operator]").val();
                        var deviation = $(this).parents(".numbermodify").find("input[name=deviation]").val();
                        if (!deviation) {
                            layer.msg("数字有误");
                            return;
                        }
                        deviation = parseFloat(deviation);
                        $("#ebayOnlineproduct_listDetailForm .sub-sku-ebay tbody tr").each(function() {
                            var quantity = parseFloat($(this).find("input[name=quantity]").val());
                            if (operator == "=") {
                                quantity = (deviation).toFixed(0);
                            } else if (operator == "+") {
                                quantity = (quantity + deviation).toFixed(0);
                            } else if (operator == "-") {
                                quantity = (quantity - deviation).toFixed(0);
                            } else if (operator == "*") {
                                quantity = (quantity * deviation).toFixed(0);
                            } else if (operator == "/") {
                                quantity = (quantity / deviation).toFixed(0);
                            }
                            $(this).find("input[name=quantity]").val(quantity);
                        });
                    });
                    form.render();
                    form.on('switch(ep_isAttractSku)', function(data) {
                        layer.msg("修改引流SKU,请重新更新引流价格");
                        if (data.elem.checked) {
                            $("#ebayOnlineproduct_listDetailForm .sub-sku-ebay tbody tr").each(function() {
                                $(this).find("input[name=isAttractSku]").prop("checked", false);
                            });
                            data.elem.checked = true;
                        }
                        form.render("checkbox");
                    });
                    //初始化title字数提示
                    $('#ebayOnlineproduct_listDetailForm input[name=title]').trigger('input');
                    $('#editspecifics').click(function() {
                        var specifics = $('textarea[name="specifics"]').val()
                        editspecific(prodListingEbay.category1, siteId, specifics)
                    })
                    //使用店铺不寄送国家
                    $("#ebay_exclude_country").on('click',function () {
                        layui.admin.load.show();
                        var storeAcctId = returnData.data.prodListingEbay.storeAcctId;
                        $.ajax({
                            type : "post" ,
                            url: ctx + "/ebaylisting/getExcludeShippingLocation.html",
                            data :{platId : storeAcctId},
                            dataType : "json" ,
                            success : function (returnData) {
                                layui.admin.load.hide();
                                if (returnData.code !== "0000"){
                                    layer.msg("使用店铺不寄送国家失败;" + returnData.msg, {icon: 2});
                                    return;
                                }
                                $("#ebay_listing_not_ship_to_countries_textarea").val(returnData.data);
                                layer.msg("使用店铺不寄送国家设置成功", {icon: 1});
                            },
                            error : function (XMLHttpRequest) {
                                layui.admin.load.hide();
                                if (XMLHttpRequest.status == 200) {
                                    layer.msg("请重新登录", { icon: 7 });
                                } else {
                                    layer.msg("服务器错误");
                                }
                            }
                        });
                    });

                }//success结束
            });
        },
        yes: function(index, layero) {
            //保存并发布
            // ebayPulish_saveListDetail(index, layero, true);
            ebayPulish_saveListDetail(index, layero, false);
        },
        // btn2: function(index, layero) {
        //     //保存
        //     ebayPulish_saveListDetail(index, layero, false);
        // }
    });

}
     /**
     * 获取境内物流1运费
     */
     function changeIntShippingSrv1Cost(e) {
        if(e.target.value !== ''){
            const reg = /^(\d+)?(\.\d{1,2})?$/;
            if (!reg.test(e.target.value)) {
                return layer.msg('境内物流1运费: 请输入有效的数字，最多保留两位小数');
            }
        }
    }
//listing图片处理
function ebayPublish_subSkuImg_exchangeLocal(obj) {
    var divDom = $(obj).parent("div");
    //上传本地图片
    $(obj).Huploadify({
        auto: true,
        fileTypeExts: '*.jpg;*.png;*.jpeg;*.JPG;*.JPEG;*.PNG;*.bmp;*.BMP;*.gif;',
        multi: true,
        fileSizeLimit: 2048, //默认单位是KB
        buttonText: '本地图片',
        breakPoints: false,
        saveInfoLocal: false,
        showUploadedPercent: true,
        showUploadedSize: true,
        removeTimeout: 500,
        uploader: ctx + "/publish/uploadPic.html",
        onSelect: function(files) {
            return true;
        },
        onUploadStart: function(file) {},
        onUploadSuccess: function(file, data, response) {
            data = $.parseJSON(data);

            if (data != null && data.code == '0000') {
                divDom.find("input[name=imgUri]").val(data.msg);
                divDom.find("img").attr("src", data.msg);
                divDom.find("input[name=imgUri]").trigger("change");
            } else {
                layer.msg(data.msg); //这里面的内容不知道写啥,同OA系统
            }
        }
    });
}
//主辅图本地上传
function ebayPublish_extImg_exchangeLocal(obj) {
    var divDom = $(obj).parent("div");
    //上传本地图片
    $(obj).Huploadify({
        auto: true,
        fileTypeExts: '*.jpg;*.png;*.jpeg;*.JPG;*.JPEG;*.PNG;*.bmp;*.BMP;*.gif;',
        multi: true,
        fileSizeLimit: 2048, //默认单位是KB
        buttonText: '本地图片',
        breakPoints: false,
        saveInfoLocal: false,
        showUploadedPercent: true,
        showUploadedSize: true,
        removeTimeout: 500,
        uploader: ctx + "/publish/uploadPic.html",
        onSelect: function(files) {
            return true;
        },
        onUploadStart: function(file) {},
        onUploadSuccess: function(file, data, response) {
            data = $.parseJSON(data);

            if (data != null && data.code == '0000') {
                console.log(data.msg);
                appendMainExtImg(data.msg);
            } else {
                layer.msg(data.msg);
            }
        }
    });
}
//公共的函数给input[hidden]赋值
function setMainAndExtVal() {
    var mainImg = $('#ebayOnlineproduct_listDetailForm .imageLeft img').attr('src'); //获取主图
    var imgs = $('#ebayOnlineproduct_extImg').find('img');
    var extImgs = [];
    $.each(imgs, function(i, v) {
        var src = $(v).attr('src');
        extImgs.push(src);
    })
    $('#ebayOnlineproduct_listDetailForm input[name="mainImgUri"]').val(mainImg);
    $('#ebayOnlineproduct_listDetailForm input[name="extImgUris"]').val(extImgs.join('|'));
}
/**
 * ebay弹框图片的设置主图/移除/数量统计处理
 */
function ebayImgHandle() {
    //1. 设为主图的处理
    (function() {
        var mainImg = $('#ebayOnlineproduct_listDetailForm .imageLeft').find('img');
        $('#ebayOnlineproduct_extImg').on('click', '.setEbayMainImg', function() {
            var img = $(this).prev(), //获取辅图
                src1 = img.attr('src'), //获取辅图路径
                src2 = mainImg.attr('src'); //获取主图路径
            mainImg.attr('src', src1);
            img.attr('src', src2);
            setMainAndExtVal();
        });
    })();
    //2.移除的处理
    (function() {
        $('#ebayOnlineproduct_extImg').on('click', '.removeEbayImg', function() {
            var span = $('.ebaySecondImgNum'),
                num = span.text(),
                img = $(this).parent();
            num--;
            img.remove();
            span.text(num);
            setMainAndExtVal();
        })
    })();
    //3.弹框处理
    (function() {
        var netBtn = $('.ebayInternetImgBtn');
        netBtn.on('click', function() {
            var index = layer.open({
                type: 1,
                title: '网络图片',
                content: '<div style="padding:20px"><textarea class="layui-textarea netImgs" placeholder="请填写URL,多个地址用回车换行"></textarea></div>',
                area: ['800px', '400px'],
                btn: ['保存', '关闭'],
                yes: function(index, layero) {
                    var imgText = $.trim(layero.find("textarea").val());
                    if (appendMainExtImg(imgText)) {
                        layer.close(index);
                    }
                }
            })
        })
    })();
}

//水印
function ebayPublishInitWatermarkImage(data, id) {
    $("#" + id + " select[name=watermarkImage]").empty();
    if (data) {
        $("#" + id + " select[name='watermarkImage']").append("<option value='' selected>请选择</option>");
        data.forEach(function(val, index) {
            var watermarkName = val.watermarkTemplateName;
            var watermarkId = val.id;
            var optionTpl = "<option value=':watermarkId'>:watermarkName</option>";
            optionTpl = optionTpl.replace(":watermarkId", watermarkId);
            optionTpl = optionTpl.replace(":watermarkName", watermarkName);
            $("#" + id + " select[name='watermarkImage']").append(optionTpl);
        });
        layui.form.render();
    }
}
function ebayPublishInitWatermarkFont(data, id) {
    $("#" + id + " select[name=watermarkFont]").empty();
    if (data) {
        $("#" + id + " select[name=watermarkFont]").append("<option value='' selected>请选择</option>");
        data.forEach(function(val, index) {
            var watermarkName = val.watermarkTemplateName;
            var watermarkId = val.id;
            var optionTpl = "<option value=':watermarkId'>:watermarkName</option>";
            optionTpl = optionTpl.replace(":watermarkId", watermarkId);
            optionTpl = optionTpl.replace(":watermarkName", watermarkName);
            $("#" + id + " select[name=watermarkFont]").append(optionTpl);
        });
        layui.form.render();
    }
}

/**
 * 加载内容初始化页面
 */
function initSubSkuSpecitics(subItemDatas){
    //debugger;
    // specifics字段名，第一个字段为关联图片的字段
    var specificsFields = [];
    // specifics对象
    var specifics = {}
    subItemDatas.forEach(function(subItemData){
        //TODO  旧数据补偿
        if(!subItemData.specifics){
            subItemData.specifics = "";
        }
        var specifics = {};
        if(subItemData.specifics && subItemData.specifics.length > 0){
            subItemData.specifics.split(";").forEach(function(line){
                if(line && line.length>0){
                    var key = line.split(":")[0];
                    var value = line.split(":")[1];
                    //列
                    if(specificsFields.indexOf(key) < 0){
                        specificsFields.push(key);
                    }
                    specifics[key] = value;
                }
            });
        }
        subItemData.specifics = specifics;
    });
    //加载radio
    $("#ebayOnlineproduct_listDetailForm .pictureFieldDiv").empty();
    for(var specificsField of specificsFields){
        //表格
        var tableDom = $("#ebayOnlineproduct_listDetailForm .sub-sku-ebay");
        //增加th
        tableDom.find("thead tr .price").before(
            $("#ep_specificsThTpl").html()
                .replace(":key",specificsField)
        );
        //增加td
        var trIndex = 0;
        tableDom.find("tbody tr").each(function(){
            var specificsValue = subItemDatas[trIndex].specifics[specificsField] || "";
            $(this).find(".price").before(
                "<td><input name='specifics' class='layui-input' value='"+specificsValue+"'></td>"
            );
            trIndex++;
        });
    }
    if(specificsFields.length>0){
        //th表头选中
        $("#ebayOnlineproduct_listDetailForm .sub-sku-ebay th[class=specificsField]:first").addClass("specificsFieldPicture");
    }

    //选中的图片属性
    var specificsFieldPicture = $('#ebayOnlineproduct_listDetailForm .pictureFieldDiv input[class=pictureField]:checked').val();
    subSkuEbayOriginList = []
    $('#ebayOnlineproduct_listDetailForm').find(".sub-sku-ebay tbody tr").each(function() {
        var subSkuEbayOrigin = {};
        subSkuEbayOrigin.id = $(this).find("input[name=id]").val();
        subSkuEbayOrigin.storeSSku = $(this).find("input[name=storeSSku]").val();
        //子模板SKU放到remark中
        subSkuEbayOrigin.remark = $(this).find("input[name=storeSSku]").data("sku");
        subSkuEbayOrigin.imgUri = $(this).find("input[name=imgUri]").val();
        subSkuEbayOrigin.buyItNowPrice = $(this).find("input[name=buyItNowPrice]").val();
        subSkuEbayOrigin.quantity = $(this).find("input[name=quantity]").val();
        //是否为引流价
        subSkuEbayOrigin.isLockPrice = $(this).find("input[name=isLockPrice]").prop("checked");
        //是否为固定价格
        subSkuEbayOrigin.isAttractSku = $(this).find("input[name=isAttractSku]").prop("checked");
        //TODO子SKU specifics
        //specifics属性
        var specifics = [];
        //debugger;
        $(this).find("input[name=specifics]").each(function(){
            //获取第几列
            var index = $(this).parents("tr").find("td").index($(this).parents("td"));
            var specificsField = $(this).parents("table").find("thead th").eq(index).find("input").val();
            var specificsValue = $(this).val();
            if(specificsField && specificsField!="" && specificsValue && specificsValue!=""){
                if(specificsFieldPicture && specificsFieldPicture == specificsField){
                    specifics.unshift(specificsField+":"+specificsValue);
                }else{
                    specifics.push(specificsField+":"+specificsValue);
                }
            }
        });
        subSkuEbayOrigin.specifics = specifics.join(";");
        if (subSkuEbayOrigin.id == '') {
            delete subSkuEbayOrigin.id
        }
        subSkuEbayOriginList.push(subSkuEbayOrigin);
    });

    //加载表格specifics
    initPictureField();
    return specificsFields;
}

//编辑specific弹框
function editspecific(categoryid, siteId, specifics) {
    layer.open({
        type: 1,
        title: '编辑specific',
        content: $("#publish_editspecific").html(),
        btn: ['保存', '取消'],
        area: ['70%', '90%'],
        success: function(layero, index) {
            $('#ee_editspecificForm input[name=siteId]').val(siteId);
                    //类目赋值
                    if(categoryid){
                        $("#publish_ebayCateId1").val(categoryid);
                        $("#publish_ebayCateId2").val();
                        $("#publish_ebayCateText1").html(categoryid);
                        $("#publish_ebayCateText2").html();
                    }
                    //ebay类目与specifics处理
                    $('#publish_ebayCateIdBtn1').click(function() {
                        layui.admin.itemCat_select('ebayCateSelect1',
                        'publish_ebayCateId1',
                        'publish_ebayCateText1',
                        "/prodcate/getEbayCateList.html?siteId="+siteId,
                        "/prodcate/searchEbayCate.html?siteId="+siteId);
                    });
                    $('#publish_ebayCateIdBtn2').click(function() {
                        layui.admin.itemCat_select('ebayCateSelect2',
                        'publish_ebayCateId2',
                        'publish_ebayCateText2',
                        "/prodcate/getEbayCateList.html?siteId="+siteId,
                        "/prodcate/searchEbayCate.html?siteId="+siteId);
                    })
                    $("#publish_ebayCateText1").change(function(){
                        //根据cateId, siteId获取分类属性
                        //$(this).html($(this).text());
                        initSpecificAttr($("#publish_ebayCateId1").val(), siteId,specifics);
                    });
                    $("#publish_ebayCateText2").change(function(){
                        //$(this).html($(this).text());
                    });
                        //查询分类
                $(layero).find('#publish_ebayCateSearch1,#publish_ebayCateSearch2').click(function(event){
    // $("body").on("click","#publish_ebayCateSearch1,#publish_ebayCateSearch2",function(event){
        event.preventDefault();
        event.stopPropagation();
        var sourceDom = $(this);
        var currentTitle = $('#ebayOnlineproduct_listDetailForm input[name="title"]').val()
        layer.open({
            type: 1,
            title: '搜索ebay分类',
            content: $("#publish_ebayCateSearchTpl").html(),
            area: ['65%', '60%'],
            success: function(layero,index){
                //搜索事件
                $(layero).find("input[name=sourceBtnId]").val(sourceDom.attr("id"));
                $(layero).find("button").click(function(){
                    var title = $(layero).find("input[name='title']").val();
                    // var siteId = $('#publish_editAssiDataForm input[name=siteId]').val();
                    layui.table.render({
                        elem: '#publish_ebayCateSearchTable'
                        ,method: 'post'
                        ,url: ctx + '/ebaylisting/assidata/seatchebaycategroy.html' //数据接口
                        ,where:{
                            title:title,
                            siteId:siteId
                        }
                        ,method: 'post'
                        ,page: false
                        ,cols: [[ //表头
                          {field: 'id', title: 'ID',width:'10%'},
                          {field: 'categoryName', title: '类目',width:'80%'},
                          {field: 'percentItem', title: '操作', width: '10%',
                          templet:'<div>{{d.percentItem}}% <a data-id="{{d.id}}" class="selectCategory" href="javascrpt:;" style="color:blue">选择</a></div>'}
                        ]]
                        ,done: function(res){
                            $(layero).find(".selectCategory").click(function(){
                                var sourceBtnId = $(layero).find("input[name=sourceBtnId]").val();
                                if(sourceBtnId == "publish_ebayCateSearch1"){
                                    $("#publish_ebayCateId1").val($(this).data("id"));
                                    $("#publish_ebayCateText1").html($(this).parents("tr").find("td[data-field=categoryName] div").html());
                                    $("#publish_ebayCateText1").trigger('change');
                                }else if(sourceBtnId == "publish_ebayCateSearch2"){
                                    $("#publish_ebayCateId2").val($(this).data("id"));
                                    $("#publish_ebayCateText2").html($(this).parents("tr").find("td[data-field=categoryName] div").html());
                                    $("#publish_ebayCateText2").trigger('change');
                                }
                                layer.close(index);
                            });
                        }
                    });
                });
                //如果currentTitle有值，默认搜索
                if(currentTitle && currentTitle.length>5){
                  $(layero).find("input[name='title']").val(currentTitle);
                  $(layero).find("button").trigger("click");
                }
            },
        });
    });
            initSpecificAttr(categoryid, siteId, specifics);
            layui.form.render();
        },
        yes: function(index, layero) {
            //封装specific
            var dataArr = []
            var data = pubulishserializeObject($('#ee_editspecificForm'))
            var ebayCateId1 = data.ebayCateId1
            var ebayCateId2 = data.ebayCateId2
            $('#ebayOnlineproduct_listDetailForm input[name="category1"]').val(ebayCateId1)
            $('#ebayOnlineproduct_listDetailForm input[name="category2"]').val(ebayCateId2)
            delete data.ebayCateId1
            delete data.ebayCateId2
            var customAttrName = (data.customAttrName || "").split('_#|#_')
            var customAttrValue = (data.customAttrValue || "").split('_#|#_')
            for (var i in data) {
                if (i && data[i] !== "" && i !== "customAttrName" && i !== "customAttrValue") {
                    dataArr.push(i + ':' + data[i])
                }
            }
            for (var i in customAttrName) {
                for (var j in customAttrValue) {
                    if (i === j && customAttrName[i] !== "") {
                        dataArr.push(customAttrName[i] + ':' + customAttrValue[j])
                    }
                }
            }
            $('textarea[name="specifics"]').val(dataArr.join('\n'))
            layer.close(index)
            return false
        }
    });
}

/**
 * 从td加载到radio
 */
function initPictureField(){
    $("#ebayOnlineproduct_listDetailForm .pictureFieldDiv").empty();
    var currentField = $("#ebayOnlineproduct_listDetailForm .specificsFieldPicture input[name='specifics']").val();
    $("#ebayOnlineproduct_listDetailForm .specificsField input[name='specifics']").each(function(){
        var specificsField = $(this).val();
        //radio
        var tpl = '<input type="radio" class="pictureField" value="'+specificsField+'" title="'+specificsField+'" lay-filter="ep_pictureField">';
        $("#ebayOnlineproduct_listDetailForm .pictureFieldDiv").append(tpl);
    });
    //选中默认的
    if(currentField){
        $("#ebayOnlineproduct_listDetailForm .pictureFieldDiv input[class=pictureField][value="+currentField+"]").prop("checked", true);
    }
    layui.form.render("radio");
}


//ebay非站点运送方式寄送国家
var ebayShipTo = {};
initEbayShipTo();
//初始化
function initEbayShipTo() {
    console.log("初始化ebay非站点运送方式寄送国家");
    $.ajax({
        type: "post",
        url: ctx + "/assifieldebay/shipto.html",
        async: true,
        dataType: 'json',
        success: function(returnData) {
            if (returnData.code == "0000") {
                ebayShipTo = returnData.data;
            } else {
                layer.alert(returnData.msg);
            }
        },
        error: function(XMLHttpRequest) {
            layui.admin.load.hide();

            if (XMLHttpRequest.status == 200) {
                layer.msg("请重新登录", { icon: 7 });
            } else {
                layer.msg("服务器错误");
            }
        }
    });
}

//初始化站点运送国家
function selectebayShipTo(siteId, ebayShipToDom, inputName) {
    var countryCodes = ebayShipTo[siteId];
    //封装html
    var str = "";
    for (var i in countryCodes) {
        str += '<input name="' + inputName + '" type="checkbox" title="' + countryCodes[i] + '" value="' + countryCodes[i] + '" lay-skin="primary">';
    }
    //初始化
    ebayShipToDom.html(str);
    layui.form.render();
}

function initSpecificAttr(ebayCateId, siteId, specifics) {
    if (!ebayCateId) {
        return;
    }
    layui.admin.load.show();
    $.ajax({
        type: "post",
        url: ctx + "/ebaylisting/assidata/listebaycatespecifics.html",
        async: true,
        dataType: "json",
        data: {
            cateId: ebayCateId,
            siteId: siteId
        },
        success: function(returnData) {
            layui.admin.load.hide()
            if (returnData.code != "0000") {
                layer.msg(returnData.msg);
                return;
            }
            var attrList = returnData.data;
            $("#ee_editspecificForm .ebayCateSpecifics .layui-card-body").empty();
            for (var i = 0; i < attrList.length; i++) {
                //单选可输入
                var inputTpl = '<div class="layui-form-item">' +
                    '<label class="layui-form-label">:attrName</label>' +
                    '<div class="layui-input-inline dropdown-datalist">' +
                    '<input type="text" class="layui-input" name=":attrName">' +
                    '<ul>' +
                    ':optionList' +
                    '</ul>' +
                    '</div>' +
                    '<div class="layui-form-mid layui-word-aux" style="float: none; display: inline;">:description</div>' +
                    '</div>';
                //单选不可输入
                var selectTpl = '<div class="layui-form-item">' +
                    '<label class="layui-form-label">:attrName</label>' +
                    '<div class="layui-input-inline">' +
                    '    <select name=":attrName">' +
                    ':optionList' +
                    '    </select>' +
                    '</div>' +
                    '<div class="layui-form-mid layui-word-aux" style="float: none; display: inline;">:description</div>' +
                    '</div>';
                //多选可输入
                var muliSelectTpl = '<div class="layui-form-item">' +
                    '<label class="layui-form-label">:attrName</label>' +
                    '<div class="layui-input-block">' +
                    '  :inputList' +
                    '  <div class="layui-input-inline" style="float: none;margin-top: 3px;">' +
                    '      <input type="text" name=":attrName" class="layui-input" placeholder="自定义属性">' +
                    '  </div>' +
                    '<div class="layui-form-mid layui-word-aux" style="float: none; display: inline;">:description</div>' +
                    '</div>' +
                    '</div>';
                //多选不可输入
                var muliSelectOnlyTpl = '<div class="layui-form-item">' +
                    '<label class="layui-form-label">:attrName</label>' +
                    '<div class="layui-input-block">' +
                    '  :inputList' +
                    '<div class="layui-form-mid layui-word-aux" style="float: none; display: inline;">:description</div>' +
                    '</div>' +
                    '</div>';
                var attr = attrList[i];
                var dom = "";
                var isMulti = attr.itemToAspectCardinality=="MULTI";
                var isMust = attr.isVariMustAttr==1;
                var description = "";
                if (isMust) {
                    description += "必填";
                }
                if (isMulti) {
                    description += "多选";
                }
                if (isMulti) {
                    if (attr.aspectMode == 'FREE_TEXT') {
                        //多选可填写
                        dom = muliSelectTpl;
                    } else {
                        //多选不可填
                        dom = muliSelectOnlyTpl;
                    }
                    var inputList = '';
                    attr.attrValList.split("#|").forEach(function(attrVal) {
                        inputList += '<input type="checkbox" name=":attrName" value="' + attrVal + '"  lay-skin="primary" title="' + attrVal + '">';
                    });
                    dom = dom.replace(":inputList", inputList);
                } else {
                    if (attr.aspectMode == 'FREE_TEXT') {
                        //单选可填写
                        dom = inputTpl;
                        let optionList = '';
                        attr.attrValList.split("#|").forEach(function(attrVal) {
                          if(attrVal.trim() != ''){
                            optionList += '<li>' + attrVal + '</li>';
                          }
                        });
                        dom = dom.replace(":optionList", optionList);
                    } else {
                        //单选不可填写
                        dom = selectTpl;
                        let optionList = '<option value="">请选择</option>';
                        attr.attrValList.split("#|").forEach(function(attrVal) {
                            optionList += '<option value="' + attrVal + '">' + attrVal + '</option>';
                        });
                        dom = dom.replace(":optionList", optionList);
                    }
                }
                dom = dom.replace(":description", description);
                dom = dom.replace(/:attrName/g, attr.attrName);

                $("#ee_editspecificForm .ebayCateSpecifics .layui-card-body").append(dom);
            }

            //清除自定义属性
            $("#ee_editspecificForm .ebayCustomSpecifics .layui-card-body").empty();
            //specifics赋值
            var attr = getSpecifics(specifics);
            for (var attrName in attr) {
                var attrValue = attr[attrName];
                var attrDom = $("#ee_editspecificForm .ebayCateSpecifics").find("input[name='" + attrName + "']");
                if (attrDom.length > 1) {
                    //多选checkbox处理
                    var selfVals = [];
                    attrValue.split(',').forEach(function(v) {
                        var dom = $("#ee_editspecificForm .ebayCateSpecifics")
                            .find("input[name='" + attrName + "'][value='" + v + "']");
                        if (dom.length > 0) {
                            dom.prop("checked", true);
                        } else {
                            selfVals.push(v);
                        }
                    });
                    //自定义属性
                    $("#ee_editspecificForm .ebayCateSpecifics")
                        .find("input[name='" + attrName + "'][type=text]").val(selfVals.join(","));
                } else if (attrDom.length == 1) {
                    //input text处理
                    $("#ee_editspecificForm .ebayCateSpecifics")
                        .find("input[name='" + attrName + "'][type=text]").val(attrValue);
                } else {
                    //select处理
                    attrDom = $("#ee_editspecificForm .ebayCateSpecifics").find("select[name='" + attrName + "']");
                    if (attrDom.length > 0) {
                        attrDom.val(attrValue);
                    } else {
                        //自定义属性
                        addCustomAttr(attrName, attrValue);
                    }

                }
            }
            layui.form.render();
            const dropdowns = document.querySelectorAll(".dropdown-datalist");
            dropdowns.forEach((dropdown) => {
              new Dropdown(dropdown);
            });
        }
    });

}

function getSpecifics(specificsStr) {
    var attr = {};
    if (specificsStr) {
        specificsStr.split("\n").forEach(function(v) {
            attr[v.split(":")[0]] = v.split(":")[1];
        });
    }
    return attr;
}

function addCustomAttr(attrName, attrValue) {
    var tpl = '<div class="layui-form-item">' +
        '         <label class="layui-form-label"></label>' +
        '         <div class="layui-inline">' +
        '             <div class="layui-input-inline">' +
        '                 <input type="text" name="customAttrName" value=":attrName" placeholder="自定义属性名称" autocomplete="off" class="layui-input">' +
        '             </div>' +
        '             <div class="layui-form-mid">-</div>' +
        '             <div class="layui-input-inline">' +
        '                 <input type="text" name="customAttrValue" value=":attrValue" placeholder="自定义属性值" autocomplete="off" class="layui-input">' +
        '             </div>' +
        '             <div class="layui-input-inline">' +
        '                <span class="ee_removeCustomAttr" style="cursor: pointer;color: #73a1bf;height: 100%;vertical-align: -webkit-baseline-middle;">移除</span>' +
        '             </div>' +
        '         </div>' +
        '    </div>';
    if (attrName && attrValue) {
        tpl = tpl.replace(":attrName", attrName);
        tpl = tpl.replace(":attrValue", attrValue);
    } else {
        tpl = tpl.replace(":attrName", "");
        tpl = tpl.replace(":attrValue", "");
    }
    $("#ee_editspecificForm .ebayCustomSpecifics .layui-card-body").append(tpl);
}

$("body").on("click", "#publish_addCustomAttr", function() {
    addCustomAttr();
});
$("body").on("click", ".ee_removeCustomAttr", function() {
    $(this).parents(".layui-form-item").remove();
});

function pubulishserializeObject(form) {
    var o = {}
    $.each(form.serializeArray(), function(index) {
        if (o[this['name']]) {
            o[this['name']] = o[this['name']] + '_#|#_' + this['value']
        } else {
            o[this['name']] = this['value']
        }
    })
    return o
}

/**
 * 拼接主副图
 * @param {Object} imgText
 */
function appendMainExtImg(imgText) {
    let valArr = imgText.split('\n'),
        span = $('#ebayOnlineproductIdLayer .ebaySecondImgNum'),
        num = Number(span.text()),
        len = valArr.length,
        total = len + num;
    let ebaySpecialImgNum = Number($('#ebayOnlineproductIdLayer .ebaySpecialImgNum').text());
    if (total > ebaySpecialImgNum) {
        var sx = ebaySpecialImgNum - num;
        layer.alert(`只能上传${ebaySpecialImgNum}张图片,还可以传${sx}张!`)
        return false;
    } else {
        var str = '';
        for (var i = 0; i < valArr.length; i++) {
            str += '<div class="imageRight" draggable="true">\
                        <img src="' + valArr[i] + '" width="150" height="150">\
                        <span class="setEbayMainImg">设为主图</span>\
                        <span class="removeEbayImg">移除</span>\
                    </div>';
        }
        $('#ebayOnlineproduct_extImg').append(str);
        span.text(total);
        setMainAndExtVal();
        return true;
    }
}


//更新店铺SKU
function ebayPublishUpdateSku(id) {
    $("#ebayOnlineproduct_listDetailForm .sub-sku-ebay tbody tr").each(function() {
        //子模板SKU
        var sSku = $(this).find("input[name=storeSSku]").data("sku");
        if (sSku) {
            $(this).find("input[name=storeSSku]").val(sSku);
        }
    });
    //父SKU
    var pSkuDom = $("#ebayOnlineproduct_listDetailForm input[name=storePSku]");
    pSkuDom.val(pSkuDom.data("sku"));
}

function ebayBatchSetSkuSufix(dom){
    var type = dom.siblings('#ebay_onlineproduct_sufixSetType').val()
    var original = dom.siblings('input[name="originalsku"]').val()
    var newsku = dom.siblings('.replacehide').find('input[name="newsku"]').val()
    if(original!==""){
    if(type==1){
        addSufix(original)
    }else if(type==2){
        replaceSufix(original,newsku)
    }else{
        deleteSufix(original)
    }
}else{
    layer.msg('请填写要修改的后缀内容')
}
}



function ebayOnlineproduct_addSkuBtn() {
    var prodPSku = $("#ebayOnlineproduct_addSku").val();
    var prodListingEbayId = $("#ebayOnlineproduct_listDetailForm input[name=id]").val();
    $.ajax({
        url: ctx + '/ebaylisting/addsku.html',
        type: 'post',
        dataType: 'json',
        data: {
            prodPSku: prodPSku,
            prodListingEbayId: prodListingEbayId
        },
        success: function(returnData) {
            if (returnData.code != "0000") {
                layer.msg(returnData.msg);
                return;
            }
            var prodListingSubSkuEbays = returnData.data;
            //填充信息 模板方式
            layui.laytpl($("#ebayPulish_listSubTrTpl").html()).render(prodListingSubSkuEbays, function(html) {
                $('#ebayOnlineproduct_listDetailForm .sub-sku-ebay tbody').append(html);
                // layui.form.render();
            });
        },
        error: function(XMLHttpRequest) {
            layui.admin.load.hide();

            if (XMLHttpRequest.status == 200) {
                layer.msg("请重新登录", { icon: 7 });
            } else {
                layer.msg("服务器错误");
            }
        }
    });
}

//更新刊登定价
function ebayOnlineproductUpdatePrice(id) {
    //获取引流SKU
    var attractSubSkuId;
    var attractSkuDom = $("#ebayOnlineproduct_listDetailForm .sub-sku-ebay tbody tr input[name=isAttractSku]:checked");
    if (attractSkuDom.length > 0) {
        attractSubSkuId = attractSkuDom.parents("tr").find("input[name=id]").val();
    }
    layui.admin.load.show();
    $.ajax({
        type: "post",
        url: ctx + "/ebayAdjustPrice/batchModifyPriceBygrossProfit.html",
        dataType: "json",
        data: {
            prodObj: id,
            attractSubSkuId: attractSubSkuId,
            grossProfitRate:$('#ebayOnlineproduct_listDetailForm input[name=defaultGrossProfitRate]').val()
        },
        success: function(returnData) {
            layui.admin.load.hide();
            if (returnData.code != "0000") {
                layer.msg(returnData.msg, { icon: 7 });
            } else {
                layer.msg("更新刊登定价:<br>" + returnData.msg, { icon: 1 });
                var subSkuEbays = returnData.data;
                $("#ebayOnlineproduct_listDetailForm .sub-sku-ebay tbody tr").each(function() {
                    var storeSSku = $(this).find("input[name=storeSSku]").val();
                    console.log(storeSSku);
                    console.log(subSkuEbays)
                    for (var index in subSkuEbays) {
                        if (subSkuEbays[index].storeSku == storeSSku) {
                            if (!$(this).find("input[name=isLockPrice]").prop("checked")) {
                                $(this).find("input[name=buyItNowPrice]").val(subSkuEbays[index].newPrice);
                            }
                        }
                    }
                });
            }
        },
        error: function(XMLHttpRequest) {
            layui.admin.load.hide();

            if (XMLHttpRequest.status == 200) {
                layer.msg("请重新登录", { icon: 7 });
            } else {
                layer.msg("服务器错误");
            }
        }
    });
}

// 新增一行
$(document).on('click', '#ebayOnline_add_sub_btn', function() {
    console.log('add row')
    ebayOnline_addSubListing();
});

//ztt-20230519 辅图详情
function ebayOnlineproduct_subSkuImg_detailHandle(obj){
  let imgs = $(obj).parent().find('input[name=imgUri]').val();
  let imgsArr = imgs.split(';');
  console.log('imgsArr', imgsArr);
  let isMax12 = Number($('#ebayOnlineproductIdLayer .ebaySpecialImgNum').text()) == 23 ? true: false;
  //获取父级tr,然后获取sku,size和color,待定?
  let combineStr = '';
  let $tr = $(obj).parents('tr');
  let storeSSku = $tr.find('input[name=storeSSku]').val();
  combineStr +=`<b>SKU:</b>${storeSSku}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`;
  let $specificsValDoms = $tr.find('input[name=specifics]');//获取所在行的所有属性value的值元素
  let $specificsKeyDoms = $tr.parents('table').find('th input[name=specifics]');//获取所在行的所有属性key的值元素
  for(let i=0; i<$specificsValDoms.length; i++){
    let valDom = $specificsValDoms[i];
    let keyDom = $specificsKeyDoms[i];
    let val = $(valDom).val() || '';
    let key = $(keyDom).val() || '属性';
    combineStr+= `<b>${key}:</b>${val}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`;
  }
  layer.open({
    type: 1,
    title: combineStr,
    area: ['90%', '70%'],
    btn: ['保存','取消'],
    content: $('#ebayOnlineproduct_subSkuImg_detailLayer').html(),
    id: 'ebayOnlineproduct_subSkuImg_detailLayerId',
    success: function(layero,index){
      //拖拽函数
      let draggableFn = function(){
        $('#onlineproduct-auxiliary-ebaySubSkuImgs').sortable({
          cursor: "move", //拖拽时鼠标样式
          containment: $('#ebayOnlineproduct_subSkuImg_detailLayerId'),
          tolerance: "pointer",
          items: ".auxiliary-ebaySubSkuImgsChild", //定义可拖拽的元素
        });
      }
      draggableFn();
      //默认渲染数量
      layero.find('#subSkuImgLeftOnlineproductImgNum').text(imgsArr.length);
      layero.find('.subSkuImgLeftImgNumTotal').text(isMax12? 12 :1);
      //插入图片
      let imgDiv = '';
      for(let i = 0; i< imgsArr.length; i++) {
        let item = imgsArr[i];
        let imgItem = `<div class="auxiliary-ebaySubSkuImgsChild">
                        <img src="${item}" width="150" height="150" onerror="layui.admin.img_noFind()">
                        <div class="opte" onclick="ebayImgRemove_handleFn(this, $('#subSkuImgLeftOnlineproductImgNum'))">
                            <span class="removeImg">移除</span>
                        </div>
                    </div>`;
        imgDiv+=imgItem;
      }
      $('#onlineproduct-auxiliary-ebaySubSkuImgs').append(imgDiv);
      //本地图片上传
      ebayLocalImgHandleFn({
        btn: '#subSkuImgOnlineproduct_container_localUpload',
        imgDom: '#onlineproduct-auxiliary-ebaySubSkuImgs',
        imgNumDom: 'subSkuImgLeftOnlineproductImgNum',
        max: isMax12? 12 : 1,
        fn: draggableFn
      });
      //网络图片上传
      ebayNetImgHandleFn({
        btn: '#subSkuImgOnlineproduct_container_networkUpload',
        imgDom: '#onlineproduct-auxiliary-ebaySubSkuImgs',
        imgNumDom: 'subSkuImgLeftOnlineproductImgNum',
        max: isMax12? 12 : 1,
        fn: draggableFn
      });
    },
    yes: function(index, layero){
      let subImgsDom = layero.find('.auxiliary-ebaySubSkuImgsChild>img');
      let srcArr = [];
      for(let i=0; i<subImgsDom.length; i++){
        let subImg = subImgsDom[i];
        let src = $(subImg).attr('src');
        srcArr.push(src);
      }
      let srcStr = srcArr.join(';');
      layer.close(index);
      //更新该元素的隐藏input
      $(obj).parent().find('input[name=imgUri]').val(srcStr);
      $(obj).parent().find('img.img_show_hide').attr('src', srcArr[0]);
      //更新图片显示的数量
      $(obj).parent().find('.subImgNum').text(srcArr.length);
    }
  });
}


function ebayOnline_addSubListing () {
    var needTDSpecialTpl = `<td><input name="specifics" class="layui-input" value=""></td>`;
    var addHtml = "";
    var sepcialLength = $('#ebayOnline_sub-sku-ebay_th_tr .specificsField ').length;

    if(sepcialLength > 0){
        for(var i = 0; i < sepcialLength; i++){
            addHtml += needTDSpecialTpl;
        }
    }

        var tr =` <tr>
            <input type="hidden" name="id" value="">
            <input type="hidden" name="tempVarietyId" value="">
            <td>
                <div style="width: 60px;position:relative;">
                    <input type="hidden" name="imgUri" value="/lms/static/img/kong.png">
                    <img class="img_show_hide" width="60" height="60" src="" onerror="layui.admin.img_noFind()">
                    <span class="subImgNum">1</span>
                    <br>
                    <span class="layui-btn layui-btn-xs" onclick="ebayOnlineproduct_subSkuImg_detailHandle(this)">详情</span>
                    <!--<span id="ebayPublish_subSkuImg" style="cursor: pointer;color: #73a1bf;float: right;">修改</span>
                    <div class="ebayPublish_subSkuImg_edit_local"></div>
                    <div class="layui-btn layui-btn-primary layui-btn-sm ebayPublish_subSkuImg_edit_net"
                            onclick="ebayPublish_subSkuImg_exchangeNet(this)">网络图片</div>-->
                </div>
            </td>
            <td>
                <input name="storeSSku" data-sku="" value="" class="layui-input">
            </td>`+addHtml+`
            <td class="price"><input type="number" name="buyItNowPrice" value="" class="layui-input"></td>
            <td><input type="number" name="quantity" value="" class="layui-input"></td>
            <td>
                保存后自动生成
            </td>
            <td>
                <input type="checkbox" name="isLockPrice" lay-filter="ep_isLockPrice" lay-skin="switch" lay-text="是|否">
            </td>
            <td>
                <input type="checkbox" name="isAttractSku" lay-filter="ep_isAttractSku" lay-skin="switch" lay-text="是|否">
            </td>
            <td>
                <button type="button" onclick="ebayPulishNew_removeSkuBtn(this)" class="layui-btn layui-btn-sm layui-btn-danger">删除</button>
            </td>
        </tr>
    `;
    $('#ebayOnline_SubSkuInfo_body').append(tr);

    //本地图片绑定
    // $("#ebayOnlineproduct_listDetailForm .ebayPublish_subSkuImg_edit_local").each(function() { //初始化本地按钮
    //     ebayPublish_subSkuImg_exchangeLocal($(this));
    // });
    layui.form.render('checkbox')
}

/**
 * 增加一列属性(price列之前)
 */
$(document).on('click', '.addSpecificsBtn', function() {
    var tableDom = $("#ebayOnlineproduct_listDetailForm .sub-sku-ebay");
    tableDom.find("thead tr .price").before(
        $("#ep_specificsThTpl").html()
            .replace(":key","")
            .replace(":specificsFieldPicture","")
    );
    tableDom.find("tbody tr .price").each(function(){
        $(this).before("<td><input name='specifics' class='layui-input'></td>");
    });
});

/**
 * 删除specifics属性
 */
$(document).on('click', '.delSpecificsBtn', function() {
    //计算specifics列数量
    if($(this).parents("thead").find("th.specificsField").length<=1){
        layer.msg("至少保留1个specifics",{icon:0});
        return;
    }
    //获取第几列
    var index = $(this).parents("thead").find("th").index($(this).parents("th"));
    //删除td
    $(this).parents("table").find("tbody tr").each(function(){
        $(this).find("td").eq(index).remove();
    });
    //删除th
    $(this).parents("thead").find("th").eq(index).remove();
    //刷新图片关联属性
    initPictureField();
});
$(document).on('blur', '.specificsField input[name=specifics]', function() {
    //刷新图片关联属性
    initPictureField();
});

function ebayPulishNew_removeSkuBtn(obj) {
    $(obj).closest('tr').remove();
}

function ebayPulish_removeSkuBtn(obj) {
    var id = $(obj).parents("tr").find("input[name=id]").val();
    layer.confirm('移除变种', { icon: 3 }, function(index) {
        $.ajax({
            url: ctx + '/ebaylisting/removesku.html',
            type: 'post',
            dataType: 'json',
            data: { id: id },
            success: function(returnData) {
                if (returnData.code != "0000") {
                    layer.msg(returnData.msg);
                    return;
                } else {
                    $(obj).parents("tr").remove();
                }
            },
            error: function(XMLHttpRequest) {
                layui.admin.load.hide();

                if (XMLHttpRequest.status == 200) {
                    layer.msg("请重新登录", { icon: 7 });
                } else {
                    layer.msg("服务器错误");
                }
            }
        });
        layer.close(index);
    });

}


//保存以及保存并发布功能
function ebayPulish_saveListDetail(index, layero, isPublish) {
    var data = {};
    data.id = $(layero).find("form input[name=id]").val();
    data.itemId = $(layero).find('form input[name=itemId]').val();
    //父SKU
    data.storePSku = $(layero).find("form input[name=storePSku]").val();
    data.pSku = $(layero).find("form input[name=storePSku]").data("sku");
    data.listingDuration = $(layero).find("form select[name=listingDuration]").val();
    data.title = $(layero).find("form input[name=title]").val();
    data.subTitle = $(layero).find("form input[name=subTitle]").val();
    data.isBestoffer = $(layero).find("form input[name=isBestoffer]:checked").val();
    if (data.isBestoffer == "true") {
        data.autoAcceptPrice = $(layero).find("form input[name=autoAcceptPrice]").val();
        data.minimumBoPrice = $(layero).find("form input[name=minimumBoPrice]").val();
    }
    data.category1=$(layero).find("form input[name=category1]").val()
    data.category2=$(layero).find("form input[name=category2]").val()
    data.shippingService1 = $(layero).find("form input[name=shippingService1]").val();
    data.shippingSrv1Cost = $(layero).find("form input[name=shippingSrv1Cost]").val();
    data.shippingSrv1AddiCost = $(layero).find("form input[name=shippingSrv1AddiCost]").val();

    data.shippingService2 = $(layero).find("form input[name=shippingService2]").val();
    data.shippingSrv2Cost = $(layero).find("form input[name=shippingSrv2Cost]").val();
    data.shippingSrv2AddiCost = $(layero).find("form input[name=shippingSrv2AddiCost]").val();

    data.shippingService3 = $(layero).find("form input[name=shippingService3]").val();
    data.shippingSrv3Cost = $(layero).find("form input[name=shippingSrv3Cost]").val();
    data.shippingSrv3AddiCost = $(layero).find("form input[name=shippingSrv3AddiCost]").val();

    data.shippingService4 = $(layero).find("form input[name=shippingService4]").val();
    data.shippingSrv4Cost = $(layero).find("form input[name=shippingSrv4Cost]").val();
    data.shippingSrv4AddiCost = $(layero).find("form input[name=shippingSrv4AddiCost]").val();


    data.intShippingService1 = $(layero).find("form input[name=intShippingService1]").val();
    data.intShippingSrv1Cost = $(layero).find("form input[name=intShippingSrv1Cost]").val();
    data.intShippingSrv1AddiCost = $(layero).find("form input[name=intShippingSrv1AddiCost]").val();
    var intShip1ToLocal = [];
    $(layero).find("form input[name=intShip1ToLocal]:checked").each(function() {
        intShip1ToLocal.push($(this).val());
    });
    data.intShip1ToLocal = intShip1ToLocal.join(",");

    data.intShippingService2 = $(layero).find("form input[name=intShippingService2]").val();
    data.intShippingSrv2Cost = $(layero).find("form input[name=intShippingSrv2Cost]").val();
    data.intShippingSrv2AddiCost = $(layero).find("form input[name=intShippingSrv2AddiCost]").val();
    var intShip2ToLocal = [];
    $(layero).find("form input[name=intShip2ToLocal]:checked").each(function() {
        intShip2ToLocal.push($(this).val());
    });
    data.intShip2ToLocal = intShip2ToLocal.join(",");

    data.intShippingService3 = $(layero).find("form input[name=intShippingService3]").val();
    data.intShippingSrv3Cost = $(layero).find("form input[name=intShippingSrv3Cost]").val();
    data.intShippingSrv3AddiCost = $(layero).find("form input[name=intShippingSrv3AddiCost]").val();
    var intShip3ToLocal = [];
    $(layero).find("form input[name=intShip3ToLocal]:checked").each(function() {
        intShip3ToLocal.push($(this).val());
    });
    data.intShip3ToLocal = intShip3ToLocal.join(",");

    data.intShippingService4 = $(layero).find("form input[name=intShippingService4]").val();
    data.intShippingSrv4Cost = $(layero).find("form input[name=intShippingSrv4Cost]").val();
    data.intShippingSrv4AddiCost = $(layero).find("form input[name=intShippingSrv4AddiCost]").val();
    var intShip4ToLocal = [];
    $(layero).find("form input[name=intShip4ToLocal]:checked").each(function() {
        intShip4ToLocal.push($(this).val());
    });
    data.intShip4ToLocal = intShip4ToLocal.join(",");

    data.intShippingService5 = $(layero).find("form input[name=intShippingService5]").val();
    data.intShippingSrv5Cost = $(layero).find("form input[name=intShippingSrv5Cost]").val();
    data.intShippingSrv5AddiCost = $(layero).find("form input[name=intShippingSrv5AddiCost]").val();
    var intShip5ToLocal = [];
    $(layero).find("form input[name=intShip5ToLocal]:checked").each(function() {
        intShip5ToLocal.push($(this).val());
    });
    data.intShip5ToLocal = intShip5ToLocal.join(",");


    data.notShipToCountries = $(layero).find("form textarea[name=notShipToCountries]").val();
    //图片
    data.mainImgUri = $(layero).find("form input[name=mainImgUri]").val();
    data.extImgUris = $(layero).find("form input[name=extImgUris]").val();
    //specifics
    data.specifics = $(layero).find("form textarea[name=specifics]").val();
    data.listingType = $(layero).find("form input[name=listingType]").val();
    data.storeAcctId = $(layero).find("form input[name=storeAcctId]").val();
    data.siteId = $(layero).find("form input[name=siteId]").val();
    data.currency = $(layero).find("form input[name=currency]").val();
    data.isMultiSku = $(layero).find("form input[name=isMultiSku]").val();
    data.locationCountry = $(layero).find("form input[name=locationCountry]").val();
    data.location = $(layero).find("form input[name=location]").val();

    data.refundOptions = $(layero).find("form select[name=refundOptions]").val();
    data.returnsWithinOption = $(layero).find("form select[name=returnsWithinOption]").val();
    data.internationalReturnsAcceptedOption = $(layero).find("form select[name=internationalReturnsAcceptedOption]").val();
    data.internationalRefundOptions = $(layero).find("form select[name=internationalRefundOptions]").val();
    data.internationalReturnsWithinOption = $(layero).find("form select[name=internationalReturnsWithinOption]").val();
    data.internationalShippingCostPaidBy = $(layero).find("form select[name=internationalShippingCostPaidBy]").val();
    data.returnDescription = $(layero).find("form textarea[name=returnDescription]").val();
    data.subSkuEbayOriginList = subSkuEbayOriginList

    data.autoAcceptPrice = $(layero).find("form input[name=autoAcceptPrice]").val();
    data.minimumBoPrice = $(layero).find("form input[name=minimumBoPrice]").val();
    //子数据
    var subSkuEbayList = [];
    //选中的图片属性
    var specificsFieldPicture = $(layero).find(".pictureFieldDiv input[class=pictureField]:checked").val();
    $(layero).find("form .sub-sku-ebay tbody tr").each(function() {
        var subSkuEbay = {};
        subSkuEbay.id = $(this).find("input[name=id]").val();
        subSkuEbay.storeSSku = $(this).find("input[name=storeSSku]").val();
        //子模板SKU放到remark中
        subSkuEbay.remark = $(this).find("input[name=storeSSku]").data("sku");
        subSkuEbay.imgUri = $(this).find("input[name=imgUri]").val();
        subSkuEbay.buyItNowPrice = $(this).find("input[name=buyItNowPrice]").val();
        subSkuEbay.quantity = $(this).find("input[name=quantity]").val();
        //是否为引流价
        subSkuEbay.isLockPrice = $(this).find("input[name=isLockPrice]").prop("checked");
        //是否为固定价格
        subSkuEbay.isAttractSku = $(this).find("input[name=isAttractSku]").prop("checked");
        //TODO子SKU specifics
        //specifics属性
        var specifics = [];
        //debugger;
        $(this).find("input[name=specifics]").each(function(){
            //获取第几列
            var index = $(this).parents("tr").find("td").index($(this).parents("td"));
            var specificsField = $(this).parents("table").find("thead th").eq(index).find("input").val();
            var specificsValue = $(this).val();
            if(specificsField && specificsField!="" && specificsValue && specificsValue!=""){
                if(specificsFieldPicture && specificsFieldPicture == specificsField){
                    specifics.unshift(specificsField+":"+specificsValue);
                }else{
                    specifics.push(specificsField+":"+specificsValue);
                }
            }
        });
        subSkuEbay.specifics = specifics.join(";");
        if (subSkuEbay.id == '') {
            delete subSkuEbay.id
        }
        subSkuEbayList.push(subSkuEbay);
    });
    data.subSkuEbayList = subSkuEbayList;
    $.ajax({
        url: ctx + '/ebayOnlineOperateController/updateItemDetail.html',
        type: 'post',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(data),
        beforeSend: function(){
            loading.show();
        },
        success: function(returnData) {
            loading.hide();
            if (returnData.code != "0000") {
                layer.msg(returnData.msg);
                return;
            }
            layer.close(index);

            if (isPublish) {
                layer.msg("保存成功,发布商品");
                ebayPublishListing(data.id, true);
            } else {
                layer.msg("保存成功");
                // $("#eabyPublish_search").trigger("click");
            }
        },
        error: function(XMLHttpRequest) {
            layui.admin.load.hide();

            if (XMLHttpRequest.status == 200) {
                layer.msg("请重新登录", { icon: 7 });
            } else {
                layer.msg("服务器错误");
            }
        }
    });
}


//添加后缀
function addSufix(newsufix){
    $("#ebayOnlineproduct_listDetailForm .sub-sku-ebay tbody tr").each(function() {
        var originalsku = $(this).find("input[name=storeSSku]").val()
        $(this).find("input[name=storeSSku]").val(originalsku+newsufix);
    });
}
//删除后缀
function deleteSufix(original){
    $("#ebayOnlineproduct_listDetailForm .sub-sku-ebay tbody tr").each(function() {
        var originalsku = $(this).find("input[name=storeSSku]").val()
        if(endWith(originalsku,original)){
            $(this).find("input[name=storeSSku]").val(originalsku.slice(0,originalsku.length-original.length));
        }
    });
}
//替换后缀
function replaceSufix(originalsufix,newsufix){
    $("#ebayOnlineproduct_listDetailForm .sub-sku-ebay tbody tr").each(function() {
        var original = $(this).find("input[name=storeSSku]").val()
        if(endWith(original,originalsufix)){
            var originbody = original.slice(0,original.length-originalsufix.length)
            $(this).find("input[name=storeSSku]").val(originbody+newsufix);
        }
    });
}

function searchSysUser(t) {
    var that = t;
    if (!that.value) {
        return
    }
    $.ajax({
        url: ctx + "/sys/searchSysUser.html",
        type: "post",
        data: { name: $(t).val() },
        success: function(data) {
            $(that).next('ul').empty();
            //字符串拼接
            var userNames = '';
            for (var i = 0; i < data.length; i++) {
                var userName = data[i].userName;
                userNames += '<li id="' + data[i].id + '" class="dimResultDivItem">' + userName + '</li>';
            }
            var ul = $(that).next('ul');
            ul.empty();
            ul.append(userNames);

            //样式设置
            ul.css('display', 'block');
            var lis = $(that).next('ul').find('li');
            lis.mouseover(function() {
                $(this).css({ background: '#009688', color: '#fff' })
            });
            lis.mouseout(function() {
                $(this).css({ background: '', color: '' })
            });
            //li的点击事件
            lis.click(function() {
                $(that).val($(this).text());
                $(that).closest('tr').find('[id]').val($(this).attr('id'));
                ul.css('display', 'none');
            })
            //判断input是否为空
            if ($(that).val() == '') {
                $(that).next('ul').empty();
            };

        }
    })
}

function endWith(s,sufix) {
    if (sufix == null || sufix == "" || s.length == 0|| sufix.length > s.length)
         return false;
    if (s.substring(s.length - sufix.length) == sufix)
         return true;
    else
         return false;
   return true;
}
