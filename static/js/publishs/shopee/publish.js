console.log("shopee_publish");
// var shopeePublishWangEditor
/**layui.use开始 */
layui.use(['admin', 'form', 'layer', 'formSelects','table', 'element', 'laydate','laypage'], function() {
    var admin = layui.admin,
        form = layui.form,
        layer = layui.layer,
        formSelects = layui.formSelects,
        element = layui.element,
        laydate = layui.laydate,
        laypage = layui.laypage,
        $ = layui.$

    $("#shopeePublish_searchForm select[name=tortBanListing]").val("CURRENT_PLAT");
    form.render('select')
    form.render('radio')
    form.render('checkbox')
    render_hp_orgs_users("#shopeePublish_searchForm");


    //绑定更改事件
    form.on('select(shopeePublish_showHideVagueFlag)', function (data) {
        // console.log(data.value);
        if ("pSkus" == data.value
            || "sSkus" == data.value) {
            $("#shopee_publish #shopee_skuVagueFlag_div").removeClass("disN");
        } else {
            $("#shopee_publish #shopee_skuVagueFlag_div").addClass("disN");
        }
    });

    laydate.render({
        elem: '#shopeePublishTime', //渲染时间
        range: true
    });
    laydate.render({
        elem: '#shopeePublish_endTime', //渲染时间
    })

    //选择分类弹框
    $('#shopeePublish_item').click(function () {
        admin.itemCat_select('layer-publishs-shopee-publish', 'LAY-publishs-shopee-publish-hidden', 'LAY-publishs-shopee-publish-div')
    });

    //清空按钮的点击事件
    $('#shopeePublish_reset').click(function () {
        $('#LAY-publishs-shopee-publish-hidden').val('')
        $('#LAY-publishs-shopee-publish-div').html('')
        formSelects.value('selectAttr_shopee', [])
        formSelects.value('selectMan_shopee', [])
        $('#shopeePublish_group_sel').next().find('dd[lay-value=""]').trigger('click');
    });

    form.on('select(shopeePublish_selPubStyle_filter)', function (data) {
        var selPubStyle = data.value;
        if (1 == selPubStyle) {
            $("#shopeePublish_btn_pubNow").trigger("click");
        }
        if (2 == selPubStyle) {
            $("#shopeePublish_btn_pubOnTime").trigger("click");
        }
        $('#shopeePublish_selPubStyle').val('');
        form.render('select')
    })

    var first = true;
    //监听tab切换来选中不同的tab页
    element.on('tab(shopeePublish_tab)', function (data) {
        var btn1 = $('#shopeePublish_btn_genListing'),//生成店铺商品
            btn3 = $('#shopeePublish_btn_delListing'),//删除店铺商品
            btn4 = $('#shopeePublish_btn_exportListing'),//生成并导出listing
            // btn5 = $('#shopeePublish_btn_exportSku'),//导出SKU映射
            btn6 = $('#shopeePublish_btn_genListing2'),//生成店铺商品2
            btn7 = $('#shopeePublish_btn_cancleOnTime'),//取消定时刊登
            btn8 = $('#shopeePublish_btn_rePublish');//重新看的呢过
            btn9 = $('#shopeePublish_btn_copyListing');//复制刊登信息


        $('#shopeePublish_div_selPubStyle').addClass('disN');
        btn1.addClass('disN');
        btn3.addClass('disN');
        btn4.addClass('disN');
        btn6.addClass('disN');
        btn7.addClass('disN');
        btn8.addClass('disN');
        btn9.addClass('disN');

        //相当于触发一次搜索
        if (data.index == 0) {//商品
            btn6.removeClass('disN');
            $("#shopee_publish .failInfo").show();
            $("#shopee_publish .failInfo").hide();
            $("#shopeePublish_searchForm input[name=listingStatus]").val('-2');//全部
            
        } else if (data.index == 1) {//待待刊登
            $('#shopeePublish_div_selPubStyle').removeClass('disN');
            btn3.removeClass('disN');
            btn9.removeClass('disN');
            $("#shopee_publish .failInfo").hide();
            $("#shopeePublish_searchForm input[name=listingStatus]").val('0');//待刊登
            
        } else if (data.index == 2) {//刊登中
            btn7.removeClass('disN');
            $("#shopee_publish .failInfo").hide();
            $("#shopeePublish_searchForm input[name=listingStatus]").val('3')
            
        } else if (data.index == 3) {//刊登成功
            btn8.removeClass('disN');
            btn9.removeClass('disN');
            $("#shopee_publish .failInfo").hide();
            $("#shopeePublish_searchForm input[name=listingStatus]").val('1')
            
        } else if (data.index == 4) {//刊登失败
            btn8.removeClass('disN');
            $('#shopeePublish_div_selPubStyle').removeClass('disN');
            btn3.removeClass('disN');
            $("#shopee_publish .failInfo").show();
            $("#shopeePublish_searchForm input[name=listingStatus]").val('2')
        }else if (data.index == 5) {//已下架刊登
            $('#shopeePublish_div_selPubStyle').removeClass('disN');
            btn3.removeClass('disN');
            btn9.removeClass('disN');
            $("#shopee_publish .failInfo").hide();
            $("#shopeePublish_searchForm input[name=listingStatus]").val('4');//待刊登
        }
        //每次触发,执行依次查询
        shopee_publish_searchBtn();
    })

    form.on('select(shopeePublish_sufixSetType)',function(obj){
        if(obj.value==1||obj.value==3){
            $('.shopeePublish_replacehide').addClass('disN')
        }else{
            $('.shopeePublish_replacehide').removeClass('disN')
        }
    })

})

//已生成的详情框
function getlistingDetail_shopeePublish(id) {
    var layer = layui.layer,
        laytpl = layui.laytpl,
        $ = layui.$,
        form = layui.form
    layer.open({
        type: 1,
        title: '产品详情',
        btn: ['保存','取消'],
        area: ['100%', '100%'],
        content: "加载中...",
        success: function(layero, index) {
            //只有带刊登的详情可以修改
            var listingStatus=$("#shopeePublish_searchForm input[name=listingStatus]").val();
            if('0'==listingStatus||'2'==listingStatus){
                $(layero).find(".layui-layer-btn0").show();
            }else{
                $(layero).find(".layui-layer-btn0").hide();
            }

            layui.admin.load.show();
            $.ajax({
                url: ctx + '/shopee/shopeelisting/getlistingDetail.html',
                type: 'post',
                dataType: 'json',
                data: {id: id},
                success:function(returnData){
                    layui.admin.load.hide();
                    if(returnData.code != "0000"){
                        layer.alert(returnData.msg,{icon:2});
                        return;
                    }
                    var salesSite=returnData.data.prodListingShopee.salesSite;
                    laytpl($("#shopeePulish_listDetailTpl").html()).render(returnData.data, function(html){
                        $(layero).find('.layui-layer-content').html(html);
                        form.render();
                        // countSta('shopeePublish_SubSkuInfo','subSkuShopeeDtoPrice');//数量统计处理
                        $('#shopeePublish_extImg').sortable({
                            containment: "parent"
                        });
                        // shopeePublishWangEditor= wangEditorRender('shopeePublish_wangEditor');
                        categoryInput_blur(true);//
                        //监听类目改变
                        $("#shopeePublish_cateId").change(function(){
                            categoryInput_blur(false);//
                        });
                    });
                    //类目选择
                    //shopee类目树
                    $('#shopeePublish_cateIdBtn').click(function() {
                        if(salesSite) {
                            layui.admin.itemCat_select('shopeePublish_cateIdEvent',
                                'shopeePublish_cateId',
                                'shopeePublish_cateText',
                                "/shopee/shopeeCate/getShopeeCateList.html?siteId=" + salesSite,
                                "/shopee/shopeeCate/searchShopeeCate.html?siteId=" + salesSite
                            );
                        }else{
                            layer.msg("必须选择站点");
                        }
                    });

                    //查询推荐
                    $("#shopeePublish_cateRecomm").click(function(){
                        var  shopeePublish_cateRecomm_index=layer.open({
                            type: 1,
                            title: '搜索shopee分类',
                            content: $("#shopeePublish_cateSearchTpl").html(),
                            area: ['65%', '60%'],
                            success: function(layero,index){
                                var searchKey = $("#shopeePublish_cateSearchForm input[name='title']").val();
                                $('#shopeePublish_cateSearchBtn').click(function() {
                                    layui.table.render({
                                        elem: '#shopeePublish_cateSearchTable'
                                        , method: 'post'
                                        , url: ctx + '/shopee/shopeeExtraInfo/searchShopeeCate.html' //数据接口
                                        , where: {
                                            searchKey: searchKey,
                                            salesSite: salesSite
                                        }
                                        , method: 'post'
                                        , page: false
                                        , cols: [[ //表头
                                            {field: 'categoryId', title: '类目ID', width: '10%'},
                                            {field: 'fullCateNameTrans', title: '类目', width: '80%'},
                                            {
                                                field: '', title: '操作', width: '10%',
                                                templet: `<div><button class="layui-btn layui-btn-sm" lay-event="select">选择</button></div>`
                                            }
                                        ]]
                                        , done: function (res) {
                                            //初始化监听
                                            layui.table.on('tool(shopeePublish_cateSearchTable)', function (obj) {
                                                var data = obj.data;
                                                var layEvent = obj.event;
                                                if (layEvent === 'select') {
                                                    $("#shopeePublish_cateId").val(data.id);
                                                    $("#shopeePublish_cateText").html(data.fullCateNameTrans);
                                                }
                                                layer.close(shopeePublish_cateRecomm_index);
                                            });
                                        }
                                    });
                                });
                            },
                        });
                    });

                    shopeePublish_extPic_exchangeLocal($("#shopeePublish_editDetailForm .shopeePublish_extPic_edit_local"));//初始化按钮
                    if(0==listingStatus||2==listingStatus){
                        $('.addShopeeSubListing').removeClass("disN");
                    }
                    else{
                        $('.addShopeeSubListing').addClass("disN");
                    }
                }
            });

        },
        yes: function(layero, index){
            editListingProd_shopeePublish();
            // return false;
        }
    })
}

//抽象出一个公共的checkbox全选和反全选的组件
function checkbox_no_all_shopeePublish(tableId) {
    /*获取表头checkbox和美化后的元素*/
    var $ = layui.$

    //
    var listingStatus = $("#shopeePublish_searchForm input[name=listingStatus]").val();
    var unlist_td=$('#' + tableId).find('.shopeePublish_status').parent().parent().children('td:first-child');
    if(listingStatus==-2){
        unlist_td.empty();
    }

    var th_checkbox = $('#' + tableId).find('thead th:first-child input[type="checkbox"]'),
        oth_checkbox = th_checkbox.next()
    /*获取表内checkbox和美化后的元素*/
    var td_checkbox = $('#' + tableId).find('tbody td:first-child input[type="checkbox"]'),
        otd_checkbox = td_checkbox.next()
    /*全选和反全选事件*/
    oth_checkbox.click(function() {
        /*获取checkbox的状态*/
        var isChecked = th_checkbox.prop('checked')
        if (isChecked) {
            otd_checkbox.addClass('layui-form-checked')
            td_checkbox.prop('checked', true)
        } else {
            otd_checkbox.removeClass('layui-form-checked')
            td_checkbox.prop('checked', false)
        }
    });
    otd_checkbox.click(function() {
        /*获取选中的checkbox的长度*/
        var len = $('#' + tableId).find('tbody td:first-child input[type="checkbox"]:checked').length;
        if (td_checkbox.length == len) {
            oth_checkbox.addClass('layui-form-checked')
            th_checkbox.prop('checked', true)
        } else {
            oth_checkbox.removeClass('layui-form-checked');
            th_checkbox.prop('checked', false)
        }

    })
}

function getSearchData_shopeePublish() {
    var data = new Object();
    //默认查待生成
    data.listingStatus = $("#shopeePublish_searchForm input[name=listingStatus]").val();

    if (data.listingStatus == 2) {
        data.listingRespMsg = $("#shopeePublish_searchForm input[name=listingRespMsg]").val();
        data.listingRespCode = $("#shopeePublish_searchForm select[name=listingRespCode]").val();
    }
    data.storeAcctId = $("#shopeePublish_searchForm select[name=storeAcctId]").val();
    data.cateId = $("#shopeePublish_searchForm input[name=cateId]").val();
    data.tag = $("#shopeePublish_searchForm select[name=tag]").val();
    // data.specFlag = $("#shopeePublish_searchForm select[name=specFlag]").val();
    // data.isSale = $("#shopeePublish_searchForm select[name=isSale]").val();
    data.filterZeroStock = $("#shopeePublish_searchForm input[name=filterZeroStock]").prop('checked');
    data.saleBoolType = $("#shopeePublish_searchForm select[name=saleBoolType]").val();
    data.isPublish = $("#shopeePublish_searchForm select[name=isPublish]").val();
    data.devType = $("#shopeePublish_searchForm select[name=devType]").val();
    data.existListing = $("#shopeePublish_searchForm select[name=existListing]").val();
    data.canSaleBool = $("#shopeePublish_searchForm select[name=canSaleBool]").val();
    data.salesSite = $("#shopeePublish_searchForm select[name=salesSite]").val();

    data.salesSort = $("#shopeePublish_searchForm select[name=salesSort]").val();
    data.searchSalesType = $("#shopeePublish_searchForm select[name=searchSalesType]").val();
    data.salesMin = $("#shopeePublish_searchForm input[name=salesMin]").val();
    data.salesMax = $("#shopeePublish_searchForm input[name=salesMax]").val();

    //物流属性
    data.existLogisAttrs = [];
    data.notExistLogisAttrs = [];
    var logisAttrContents = layui.formSelects.value("selectAttr_shopee");

    for (var i = 0; i < logisAttrContents.length; i++) {
        var logisAttr = logisAttrContents[i].val;

        if (logisAttr.substring(0, 3) == ("no_")) {
            logisAttr = logisAttr.replace("no_", "");
            data.notExistLogisAttrs.push(logisAttr);
        } else {
            data.existLogisAttrs.push(logisAttr);
        }
    }
    //产品归属人
    data.bizzOwnerIds = [];
    var bizzOwnerContents = layui.formSelects.value("selectMan_shopee");
    for (var i = 0; i < bizzOwnerContents.length; i++) {
        data.bizzOwnerIds.push(bizzOwnerContents[i].val);
    }
    //侵权状态
    data.tortBanListing = $("#shopeePublish_searchForm select[name=tortBanListing]").val();

    //日期
    var timeStr = $("#shopeePublish_searchForm input[name=time]").val();
    if(timeStr) {
        data.startTime = Date.parse(timeStr.split(" - ")[0] + " 00:00:00");
        data.endTime =Date.parse(timeStr.split(" - ")[1] + " 23:59:59");
    }
    data.timeType = $("#shopeePublish_searchForm select[name=timeType]").val();
    data.cnTitle  = "";
    data.enTitle  = "";
    data.pSkus  = [];
    data.sSkus  = [];
    data.skuVagueFlag=$("#shopeePublish_searchForm select[name=skuVagueFlag]").val()
    if("cnTitle"==$("#shopeePublish_searchForm select[name=searchType]").val()){
        data.cnTitle=($("#shopeePublish_searchForm input[name=searchText]").val());
    }
    if("enTitle"==$("#shopeePublish_searchForm select[name=searchType]").val()){
        data.enTitle=($("#shopeePublish_searchForm input[name=searchText]").val());
    }
    if("pSkus"==$("#shopeePublish_searchForm select[name=searchType]").val()){
        var pSkustmp = $("#shopeePublish_searchForm input[name=searchText]").val()
        if (pSkustmp.length>0) {
            pSkustmp=pSkustmp.split(",");
            if (pSkustmp.length > 0) {
                for (i = 0; i < pSkustmp.length; i++) {
                    data.pSkus.push(pSkustmp[i]);
                }
            }
        }
    }
    if("sSkus"==$("#shopeePublish_searchForm select[name=searchType]").val()){
        var sSkustmp=$("#shopeePublish_searchForm input[name=searchText]").val();
        if(sSkustmp.length>0){
            sSkustmp=sSkustmp.split(",");
        }
        if(sSkustmp.length>0){
            for(i=0;i<sSkustmp.length;i++){
                data.sSkus.push(sSkustmp[i]);
            }
        }
    }
    //设置本人
    data.mackListingType = $("#shopee_publish_mack_listing_select_unqiue_id").val();
    return data;
}


//请求需要包含参数,首次获取默认,使用分页控件修改属性,并使用修改后的属性,在页面中搜索,重置为第一页
var limitAllAppoint = 100;//每页显示数据条数
var currentPageAllAppoint = 1;//当前页数
var dataLength = 0;//数据总条数

// 搜索商品按钮事件
function shopee_publish_searchBtn() {
    // var storeAcctId = $("#shopeePublish_searchForm select[name=storeAcctId]").val();
    //     // var listingStatus = $("#shopeePublish_searchForm input[name=listingStatus]").val();
    //     // if((null==storeAcctId||''==storeAcctId)){
    //     //     layer.msg("店铺不得为空");
    //     //     return;
    //     // }
    currentPageAllAppoint = 1; //当点击搜索的时候，应该回到第一页
    dataLength = 0;
    search_shopeePublish();
}

function search_shopeePublish(){

    var form = layui.form,
        laypage = layui.laypage;
    var data=getSearchData_shopeePublish();

    data.page=currentPageAllAppoint;
    data.limit=limitAllAppoint;
    /*未选店铺*/
    if (data.storeAcctId == null || data.storeAcctId == '') {
        if ((data.startTime == null || data.startTime == '') && (data.pSkus == null || data.pSkus == '')) {
            layer.msg("未选店铺,请至少选填 时间或模板SKU", {icon: 0});
            return false;
        }
    }
    loading.show();
    $.ajax({
        url: ctx + '/shopee/shopeelisting/querylist.html',
        type:"post",
        dataType: "json",
        contentType:"application/json;charset=utf-8",
        data: JSON.stringify(data),
        traditional: true,//确保数组传参正确
        success: function (returnData) {
            if(returnData.code!='0000'){
                loading.hide();
                layer.alert(returnData.msg, {icon: 2});
                return;
            }

            var shopeeCol = {
                one:'<colgroup><col width="3%"/><col width="70px" /><col width="10%" /><col width="5%" /><col width="5%"/><col width="8%"/><col width="60px"/><col width="60px"/><col width="60px"/><col width="5%"/><col width="7%"/></colgroup>',
                twoThr:'<colgroup><col width="3%"/><col width="70px" /><col width="10%" /><col width="5%" /><col width="5%"/><col width="8%"/><col width="100px"/><col width="100px"/><col width="60px"/><col width="60px"/><col width="60px"/><col width="60px"/><col width="7%"/><col width="70px" /></colgroup>',
                four:'<colgroup><col width="3%"/><col width="70px" /><col width="10%" /><col width="5%" /><col width="5%"/><col width="8%"/><col width="160px"/><col width="100px"/><col width="60px"/><col width="60px"/><col width="60px"/><col width="60px"/><col width="7%"/><col width="7%"/><col width="70px" /></colgroup>',
                five: '<colgroup><col width="3%"/><col width="70px" /><col width="10%" /><col width="5%" /><col width="5%"/><col width="8%"/><col width="160px"/><col width="100px"/><col width="60px"/><col width="60px"/><col width="60px"/><col width="60px"/><col width="7%"/><col width="7%"/><col width="7%"/><col width="7%"/><col width="70px" /></colgroup>',
                rep: function(str){
                    $('.shopeePublish_table_head').find('.layui-table colgroup').remove()
                    $('.shopeePublish_table_body').find('.layui-table colgroup').remove()
                    $('.shopeePublish_table_head').find('.layui-table').prepend(str)
                    $('.shopeePublish_table_body').find('.layui-table').prepend(str)
                }
            }
            dataLength=returnData.count;
            html = template('shopeePublish_tpl', returnData);
            $('#shopeePublish_table').html(html);
            theadHandle().fixTh({id:'#shopeePublishCard',h:150,dv1:'.layui-tab-title',dv2:'.shopeePublish_table_head',dv3:'#shopee_btn_show_hide',i:40});
            form.render('checkbox');
            var listingStatus=$("#shopeePublish_searchForm input[name=listingStatus]").val();
            //懒加载
            imageLazyload();

            $("#shopee_publish .cateInfo").hide();
            $("#shopee_publish .timeClass").hide();
            $("#shopee_publish .listTiming").hide();
            $("#shopee_publish .listingTime").hide();
            $("#shopee_publish .creator").hide();
            $("#shopee_publish .shopeePublish_publishBtn").hide();
            //仅刊登失败对应的展示,展示状态和失败原因
            if (-2 == listingStatus) {
                $("#shopee_publish .colspan_td").attr("colSpan", 5);
                $("#shopee_publish .storeSubSkuInfo").hide();
                $("#shopee_publish .detailInfoBtn").hide();
                // console.log('商品')
                $("#shopeePublish_totalNum").text("商品("+returnData.count+")");
            }
            else if(0 == listingStatus){
                $("#shopee_publish .colspan_td").attr("colSpan", 6);
                $("#shopee_publish .detailInfoBtn").show();
                $("#shopee_publish .cateInfo").show();
                $("#shopee_publish .creator").show();
                shopeeCol.rep(shopeeCol.twoThr)
                // console.log('待刊登')
                $("#shopeePublish_toListingNum").text("待刊登("+returnData.count+")");
                $('.shopeePublish-unlist').on('mouseenter', function () {
                    var contentshow = $(this).next(".shopeePublish-unlistreason").text();
                    if(!!contentshow){
                        layer.tips(contentshow, $(this), {
                            tips: [2, 'red'],
                            area: ['40%', 'auto'],
                            time: 0,
                        });
                    }
                }).on('mouseleave', function () {
                    layer.closeAll("tips");
                });
            }
            else if(1 == listingStatus){
                $("#shopee_publish .colspan_td").attr("colSpan", 6);
                $("#shopee_publish .timeClass").show();
                $("#shopee_publish .listingTime").show();
                $("#shopee_publish .detailInfoBtn").show();
                $("#shopee_publish .cateInfo").show();
                $("#shopee_publish .creator").show();
                shopeeCol.rep(shopeeCol.four)
                // console.log('刊登成功')
                $("#shopeePublish_listingSucNum").text("刊登成功("+returnData.count+")");
            }
            else if(2 == listingStatus){
                $("#shopee_publish .colspan_td").attr("colSpan",7);
                $("#shopee_publish .timeClass").show();
                $("#shopee_publish .detailInfoBtn").show();
                $("#shopee_publish .cateInfo").show();
                $("#shopee_publish .creator").show();
                $("#shopee_publish .listingTime").show();
                $("#shopee_publish .shopeePublish_publishBtn").show();
                shopeeCol.rep(shopeeCol.five)
                //刊登失败
                $("#shopeePublish_listingFailNum").text("刊登失败("+returnData.count+")");
            }
            else if(3 == listingStatus){
                $("#shopee_publish .colspan_td").attr("colSpan", 6);
                $("#shopee_publish .timeClass").show();
                $("#shopee_publish .listTiming").show();
                $("#shopee_publish .detailInfoBtn").show();
                $("#shopee_publish .creator").show();
                shopeeCol.rep(shopeeCol.twoThr)
                // console.log('刊登中')
                $("#shopeePublish_listingNum").text("刊登中("+returnData.count+")");
            }else if(4 == listingStatus){
                $("#shopee_publish .colspan_td").attr("colSpan", 6);
                $("#shopee_publish .detailInfoBtn").show();
                $("#shopee_publish .creator").show();
                $("#shopee_publish .cateInfo").show();
                shopeeCol.rep(shopeeCol.twoThr)
                $("#shopeePublish_notInSale").text("已下架("+returnData.count+")");
                // console.log('已下架')
            }

            if(-1==listingStatus||-2==listingStatus){
                $("#shopee_publish .detailInfoBtn").hide();
            }else{
                $("#shopee_publish .detailInfoBtn").show();
            }
            //全选和反全选事件
            checkbox_no_all_shopeePublish('shopeePublish_table')
            toPage_shopeePublish();
            //设置
            loading.hide();
        },
    });
}
function toPage_shopeePublish() {
    laypage = layui.laypage;
    //处理分页
    laypage.render({
        elem: 'shopeePublish_pagination',
        count: dataLength, //数据总数，从服务端得到
        layout: ['count', 'prev', 'page', 'next', 'limit', 'refresh', 'skip'],
        limits:[50,100,500,1000],
        curr:currentPageAllAppoint,
        limit:limitAllAppoint,
        jump: function (obj, first) {
            currentPageAllAppoint = obj.curr;
            limitAllAppoint = obj.limit;
            //首次不执行
            if (!first) {
                search_shopeePublish()
            }
        }
    });
}

function genToListingProd_shopeePublish2() {
    var layer = layui.layer,
        $ = layui.$;
    var checkData= $("#shopeePublish_table tbody input[name=id]:checked");
    if (checkData.length > 0) {
        layer.open({
            type: 1,
            title: '生成刊登',
            btn: ['立即生成', '取消'],
            area: ['45%', '40%'],
            content: $('#shopeePulish_selWaterTp2').html(),
            success: function (layero, index) {
                $("#shopeePulish_selWaterForm2 textarea[name=shopName]").text($("#shopeePublish_searchForm select[name=storeAcctId]").find("option:selected").text())
            },
            yes: function (layero, index) {
                let storeAcctStr = $("#shopeePulish_selWaterForm2 textarea[name='shopName']").val().replace(/，/g, ",");//兼容中文逗号;
                var paramData = [],storeAcctArr = [];
                storeAcctArr = storeAcctStr.split(",")
                if (storeAcctStr.length > 0) {
                    for (var i = 0; i < checkData.length; i++) {
                        paramData.push(checkData[i].value);
                    }
                    loading.show();
                    $.ajax({
                        url: ctx + '/shopee/shopeelisting/addStoreProds.html',
                        type: "post",
                        dataType: "json",
                        data: {"prodPIdArr": paramData, "storeAcctArr": storeAcctArr},
                        traditional: true,
                        success: function (returnData) {
                            if (returnData.code != "0000") {
                                layer.alert(returnData.msg, {icon: 2});
                                loading.hide();
                            } else {
                                if (returnData.data.length > 0) {
                                    layer.alert(returnData.data.join("<br>"), {icon: 7});
                                } else {
                                    layer.closeAll();
                                    layer.msg('生成待刊登成功');
                                }
                                $("#shopeePublish_search").trigger("click");
                            }
                        },
                    });
                }else{
                    loading.hide();
                    layer.msg("请至少填写一个店铺");
                }

            }
        });
    } else {
        loading.hide();
        layer.msg("请至少选择1条数据");
    }
}

function deletelisting_shopeePublish() {
    var data = $("#shopeePublish_table tbody input[name=id]:checked");

    var paramData = [];
    if (data.length > 0) {
        for (var i = 0; i < data.length; i++) {
            paramData.push(data[i].value);
        }
        $.ajax({
            beforeSend: function(){
                loading.show();
            },
            url: ctx + '/shopee/shopeelisting/deletelisting.html',
            type: "post",
            dataType: "json",
            data: {"idArr": paramData},
            traditional: true,
            success: function (returnData) {
                if(returnData.code != "0000"){
                    layer.alert(returnData.msg,{icon:2});
                }else{
                    layer.msg('删除店铺商品成功');
                    $("#shopeePublish_search").trigger("click");
                }
            },
            complete: function () {
                loading.hide();
            },
        });
    }
    else {
        layui.layer.msg("请至少选择1条数据");
    }
}


function exportListing_shopeePublish() {
    var isExport=false;

    var  request={};
    var data;
    data = $("#shopeePublish_table tbody input[name=id]:checked");
    var storeAcctId = $("#shopeePublish_searchForm select[name=storeAcctId]").val();
    var listingStatus=$("#shopeePublish_searchForm input[name=listingStatus]").val();
    // var isSale=$("#shopeePublish_searchForm select[name=isSale]").val();
    request.storeAcctId=storeAcctId;
    // request.isSale=isSale;
    request.currentlistingStatus=listingStatus;
    var paramData = new Array();
    if (data.length > 0) {
        for (var i = 0; i < data.length; i++) {
            paramData.push(data[i].value);
        }
        request.ids=paramData;
        $.ajax({
            beforeSend: function(){
                loading.show();
            },
            url: ctx + '/shopee/shopeelisting/beforeExportListing.html',
            type: "post",
            dataType: "json",
            data: request,
            traditional: true,
            async:false,
            success: function (returnData) {
                if(returnData.code != "0000"){
                    layer.alert(returnData.msg,{icon:2});
                }else{
                    if(returnData.data) {
                        if (returnData.data.length > 0) {
                            layer.alert(returnData.data.join("<br>"), {icon: 7});
                        }
                    }
                    isExport=true;
                }
            },
            complete: function () {
                loading.hide();
            }
        });
        // console.log(isExport);
        if(isExport){
            submitForm(request, ctx + '/shopee/shopeelisting/exportListing.html');
            $("#shopeePublish_search").trigger("click");
        }
    }
    else {
        layui.layer.msg("请至少选择1条数据");
    }
}

// function exportskumapping_shopeePublish(){
//     var data=getSearchData_shopeePublish();
//     var isExport=false;
//     $.ajax({
//         url: ctx + '/shopee/shopeelisting/checkBeforeExportskumapping.html',
//         type: "post",
//         data:JSON.stringify(data),
//         contentType: 'application/json;charset=utf-8',
//         dataType: "json",
//         async:false,
//         success: function (returnData) {
//             if (returnData.code != "0000") {
//                 layer.alert(returnData.msg, {icon: 2});
//
//             }else{
//                 isExport=true;
//             }
//         }
//     });
//     if(isExport) {
//         var Confirmindex = layer.confirm('确认导出当前搜索条件下的sku映射,导出时间较慢,请勿频繁尝试',{btn:['确认','取消']},function (result) {
//             if(result){
//                 layer.close(Confirmindex );
//                 submitForm(data, ctx + '/shopee/shopeelisting/exportskumapping.html')
//             }
//         })
//     }
// }

function delImg_shopeePublish(obj) {
    layer.confirm('您确认要删除图片？', {icon: 3, title: '提示'}, function (index) {
        $(obj).closest('li').remove();
        var imgTotalNum=$("#shopeePublish_extImg li").length;
        $("#shopeePulish_listDetailTpl #shopeePublish_curImgNum").text(imgTotalNum);
        layer.close(index);
    });
}

function setMainImg_shopeePublish(obj){
    var extImgUrl = $(obj).closest('.ImgDivOut').find('img').attr('src');
    var mainImgUrl=$("#shopeePublish_mainImg .ImgDivIn").find('img').attr('src');
    $(obj).closest('.ImgDivOut').find('img').attr('src',mainImgUrl);
    $(obj).closest('.ImgDivOut').find('input').attr('value',mainImgUrl);
    $("#shopeePublish_mainImg .ImgDivIn").find('img').attr('src',extImgUrl);
    $("#shopeePublish_mainImg .ImgDivIn").find('input').attr('value',extImgUrl);

}

function editListingProd_shopeePublish() {
    var layer = layui.layer,
        laytpl = layui.laytpl,
        $ = layui.$;
    // var mainImgUrl = $("#shopeePublish_mainImg .ImgDivIn").find('img').attr('src');
    // var extImg = "";
    // $("#shopeePublish_extImg .ImgDivIn").each(function () {
    //     if (""!=extImg) {
    //         extImg += "|" + $(this).find('img').attr('src');
    //     }else{
    //         extImg =$(this).find('img').attr('src');
    //     }
    // })
    var detailData={};
    detailData.id=$("#shopeePublish_editDetailForm input[name=listingId]").val();
    detailData.storePSku=$("#shopeePublish_editDetailForm input[name=storePSku]").val();
    detailData.listingStatus=$("#shopeePublish_searchForm input[name=listingStatus]").val();
    // detailData.mainImgUri=mainImgUrl;
    // detailData.extImgUris=extImg;
    detailData.name=$("#shopeePublish_editDetailForm input[name=name]").val();
    detailData.description=$("#shopeePublish_editDetailForm textarea[name=description]").val();
    // detailData.description = shopeePublishWangEditor.txt.html();
    detailData.categoryId=$("#shopeePublish_editDetailForm input[name=categoryId]").val();

    var mainImgUrl = $("#shopeePublish_mainImg .ImgDivIn").find('input[name=mainImg]').val();
    var extImg = "";
    $("#shopeePublish_extImg .ImgDivIn").each(function () {
        if (""!=extImg) {
            extImg += "|" + $(this).find('input[name=extImg]').val();
        }else{
            extImg =$(this).find('input[name=extImg]').val();
        }
    })

    //获取图片地址
    detailData.images=mainImgUrl+"|"+extImg;
    detailData.logistics=$("#shopeePublish_editDetailForm input[name=logistics]").val();


    //添加子sku
    detailData.prodListingSubSkuShopees=getSkusInfo_shopeePublish();
    //拼接获取类目属性
    var attr="";
    var cateDom = $("#shopeePublish_detail_atributes .layui-form-item");
    cateDom.each(function () {
        var attributeName;
        var attributeValue;
        if ($(this).find("select").length > 0) {
            attributeName = $(this).find("select").attr("name");
            attributeValue = $(this).find("select").val();
        }
        else {
            attributeName = $(this).find(".canChangeInput").attr("name");//由于input类型会不断变化,所以最好使用class识别
            attributeValue = $(this).find(".canChangeInput").val();//后台转换TIMESTAMP_TYPE或DATE_TYPE
        }
        if (attributeName) {
            if(attributeValue){
                if(attr.length>0){
                    attr=attr+"|"+attributeName+":"+attributeValue;
                }else{
                    attr=attributeName+":"+attributeValue;
                }
            }
        }
    });
    detailData.attributes=attr;

    $.ajax({
        beforeSend: function () {
            loading.show();
        },
        url: ctx + '/shopee/shopeelisting/editListingDetail.html',
        type: "post",
        data:JSON.stringify(detailData),
        contentType: "application/json;charset=utf-8",
        success: function (returnData) {
            var resp=returnData
            if (resp.code === "0000") {
                layer.closeAll();
                layer.msg('修改成功');
                $("#shopeePublish_search").trigger("click");
            } else {
                layer.alert(resp.msg, {icon: 2});
            }
        },
        complete: function () {
            loading.hide();
        },
    });
}

var shopeePublish_imgData={
    img:{
        head:'',
        tpl:'<li draggable="false" style="width: 150px;margin-bottom:40px;border:1px solid #ccc;overflow:hidden">'+
        '<div class="ImgDivOut">'+
        '<div class="ImgDivIn" style="width:150px;height:150px;">'+
        '<input type="hidden" name="extImg" value="&{url}">'+
        '<img width="150" height="150" src="&{url}">'+
        '</div>'+
        '<div class="imgDivDown" style="width:150px">'+
        '<a onclick="setMainImg_shopeePublish(this);" href="javascript:void(0);" style="float:left;\
color: #73a1bf;">设为主图</a><a onclick="delImg_shopeePublish(this);" href="javascript:void(0);" style="float:right;\
color: #73a1bf;">移除</a>'+
        '</div></div></li>'
    }
}

function getSkusInfo_shopeePublish(){
    var subSkus = [];
    var tdArr;
    var varient;
    $("#shopeePublish_SubSkuInfo").find("tr").each(function () {
        tdArr = $(this).children();
        varient = {};
        varient.id = tdArr.eq(0).text();
        varient.storeSSku=tdArr.find('input[name=storeSSku]').val();
        varient.name = tdArr.eq(3).find('input').val();
        varient.nameStyle = tdArr.eq(4).find('input').val();
        varient.price = tdArr.eq(5).find('input').val();
        varient.stock = tdArr.eq(6).find('input').val();
        varient.subImgUrl=tdArr.find('img.shopeePublish_subImgUrl').attr('data-original');
        subSkus.push(varient);
    });
    return subSkus;
}

function shopeeListingPublish(id) {
    var layer = layui.layer,
        $ = layui.$;
    var ids = [];
    if(id) {
        ids.push(id);
    }else{
        //生成多个
        $("#shopeePublish_table tbody input[name=id]:checked").each(function () {
            ids.push($(this).val());
        });
        if (ids.length < 1) {
            layer.msg("未选中商品");
            return;
        }
    }

    layer.open({
        type: 1,
        title: '立即刊登',
        btn: ['立即刊登'],
        area: ['500px', '500px'],
        content: "加载中...",
        success: function (layero, index) {
            $(layero).find('.layui-layer-content').html($("#shopeePulish_publishNowTpl").html());
            var storeAcctId = $("#shopeePublish_searchForm select[name=storeAcctId]").val();
            $.ajax({
                type:'post',
                url: ctx + "/shopee/shopeeDiscount/getAllPromotion.html",
                data:{'storeAcctId':storeAcctId},
                page:false,
                async:false,
                dataType:'json',
                success:function (data) {
                    if(data.data) {
                        var promotion_arr = JSON.parse(JSON.stringify(data.data));
                        for (var i = 0; i < promotion_arr.length; i++) {
                            $("#shopeePulish_publishNowForm select[name=stortAcctPromotion]").append("<option value='" + promotion_arr[i].discountId + "'>" + promotion_arr[i].discountName + "</option>");
                        }
                    }
                    layui.form.render('select');
                }
            })
            $.ajax({
                type:'get',
                url: ctx + `/salesplat/getShopeeBundleDealByStoreAcctId.html/${storeAcctId}`,
                page:false,
                async:false,
                dataType:'json',
                success:function (data) {
                    if(data.data) {
                        var bundleDeal_arr = JSON.parse(JSON.stringify(data.data));
                        for (var i = 0; i < bundleDeal_arr.length; i++) {
                            $("#shopeePulish_publishNowForm select[name=stortAcctBundleDeal]").append("<option value='" + bundleDeal_arr[i].bundleDealId + "'>" + bundleDeal_arr[i].bundleDealName + "</option>");
                        }
                    }
                    layui.form.render('select');
                }
            })
        },
        yes: function (index, layero) {
            loading.show();
            var listingStatus = $("#shopeePublish_searchForm input[name=listingStatus]").val();
            var paramData = new Array();
            if(id){
                paramData.push(id);
            }
            else{
                var data = $("#shopeePublish_table tbody input[name=id]:checked");
                if (data.length > 0) {
                    for (var i = 0; i < data.length; i++) {
                        paramData.push(data[i].value);
                    }
                }
            }
            var promotionId = $("#shopeePulish_publishNowForm select[name=stortAcctPromotion]").val();
            var bundleDealId = $("#shopeePulish_publishNowForm select[name=stortAcctBundleDeal]").val();

            if(paramData.length>0){
                $.ajax({
                    url: ctx + '/shopee/shopeelisting/publishShopeeListing.html',
                    type: "post",
                    dataType: "json",
                    data: {"ids": paramData,"listingStatus":listingStatus,"promotionId":promotionId, "bundleDealId": bundleDealId,},//是否子sku重发
                    traditional: true,
                    success: function (returnData) {
                        if(returnData.code != "0000"){
                            layer.alert(returnData.msg,{icon:2});
                        }else{
                            layer.msg('商品成功进入刊登流程');    //?
                            layer.close(index);
                            $("#shopeePublish_search").trigger("click");
                        }
                    },
                    complete: function () {
                        loading.hide();
                    },
                });
            }
            else {
                layui.layer.msg("请至少选择1条数据");
                loading.hide();
                return;
            }
        }
    });
}

// 如果time2大于time1 返回true 否则 返回false
function compareTime(time1, time2) {
    if (time_to_sec(time2) - time_to_sec(time1) > 0) {
        return true;
    }
    return false;
}

//将时分秒转为时间戳
function time_to_sec(time) {
    if (time !== null) {
        let s = "";
        let hour = time.split(":")[0];
        let min = time.split(":")[1];
        let sec = time.split(":")[2];
        s = Number(hour * 3600) + Number(min * 60) + Number(sec);
        return s;
    }
}

//定时刊登商品
function shopeePublish_OnTiming()  {
    var layer = layui.layer,
        $ = layui.$;
    var ids = [];
    //生成多个
    $("#shopeePublish_table tbody input[name=id]:checked").each(function () {
        ids.push($(this).val());
    });
    if (ids.length < 1) {
        layer.msg("未选中商品");
        return;
    }
    layer.open({
        type: 1,
        title: '定时刊登',
        btn: ['定时刊登'],
        area: ['500px', '80%'],
        content:$('#shopeePulish_listTimingTpl').html(),
        success: function (layero, index) {
            layui.form.on('switch(shopeePulish_autoProm_filter)', function(data){
                if(data.elem.checked){
                    $(".shopeePulish_show_promotionIdList").removeClass("disN");
                    $(".shopeePulish_show_promotionId").addClass("disN");
                }else{
                    $(".shopeePulish_show_promotionIdList").addClass("disN");
                    $(".shopeePulish_show_promotionId").removeClass("disN");
                }
            });
            layui.form.on('switch(shopeePulish_autoBundleDeal_filter)', function(data){
                if(data.elem.checked){
                    $(".shopeePulish_show_bundleDealIdList").removeClass("disN");
                    $(".shopeePulish_show_bundleDealId").addClass("disN");
                }else{
                    $(".shopeePulish_show_bundleDealIdList").addClass("disN");
                    $(".shopeePulish_show_bundleDealId").removeClass("disN");
                }
            });

            //时间选择器
            layui.laydate.render({
                elem: '#shopeePulish_listTiming'
                , type: 'datetime'
                , format: 'yyyy-MM-dd HH:mm'
            });

            layui.laydate.render({
                elem: '#shopeePulish_canPublish_listTiming'
                ,type: 'time'
                , range: true
                , done: function(value, date) {
                    let startTime = value.split(" - ")[0],
                        endTime = value.split(" - ")[1]
                    if (!compareTime(startTime, endTime)) {
                        $("#shopeePulish_canPublish_listTiming").val("")
                        layer.msg(value + " 时间有误",{
                            zIndex:2147483647
                        })
                        form.render()
                    }
                }
            });

            var storeAcctId = $("#shopeePublish_searchForm select[name=storeAcctId]").val();

            $.ajax({
                type:'post',
                url: ctx + "/shopee/shopeeDiscount/getAllPromotion.html",
                data:{'storeAcctId':storeAcctId},
                page:false,
                async:false,
                dataType:'json',
                success:function (data) {
                    if (data.data) {
                        var promotion_arr = JSON.parse(JSON.stringify(data.data));
                        var promInfoList=[];
                        for (var i = 0; i < promotion_arr.length; i++) {
                            $("#shopeePulish_listTimingForm select[name=stortAcctPromotion]").append("<option value='" + promotion_arr[i].discountId + "'>" + promotion_arr[i].discountName + "</option>");
                            promInfoList.push({name: promotion_arr[i].discountName, value: promotion_arr[i].discountId});
                        }

                        layui.formSelects.data('stortAcctPromotionList','local',{arr:promInfoList});

                    }
                    layui.form.render('select');
                }
            })
            $.ajax({
                type:'get',
                url: ctx + `/salesplat/getShopeeBundleDealByStoreAcctId.html/${storeAcctId}`,
                page:false,
                async:false,
                dataType:'json',
                success:function (data) {
                    if(data.data) {
                        var bundleDeal_arr = JSON.parse(JSON.stringify(data.data));
                        var bundleDealList=[];
                        for (var i = 0; i < bundleDeal_arr.length; i++) {
                            $("#shopeePulish_listTimingForm select[name=stortAcctBundleDeal]").append("<option value='" + bundleDeal_arr[i].bundleDealId + "'>" + bundleDeal_arr[i].bundleDealName + "</option>");
                            bundleDealList.push({name: bundleDeal_arr[i].bundleDealName, value: bundleDeal_arr[i].bundleDealId});
                        }

                        layui.formSelects.data('stortAcctBundleDealList','local',{arr:bundleDealList});
                    }
                    layui.form.render('select');
                }
            })

            layui.form.render('checkbox');

        },
        yes: function (index, layero) {
            var listTiming = $(layero).find("input[name=listTiming]").val();
            var listInterval = $(layero).find("input[name=listInterval]").val();
            var autoProm = $(layero).find("input[name=autoProm]").prop("checked");
            var promotionId =  $(layero).find("select[name=stortAcctPromotion]").val();
            var autoBundleDeal = $(layero).find("input[name=autoBundleDeal]").prop("checked");
            var bundleDealId =  $(layero).find("select[name=stortAcctBundleDeal]").val();

            var canPublishListTimingStr =  $(layero).find("input[name=canPublishListTiming]").val();
            var canPublishStartTime;
            var canPublishEndTime;
            if(canPublishListTimingStr){
                canPublishStartTime=canPublishListTimingStr.split(" - ")[0];
                canPublishEndTime=canPublishListTimingStr.split(" - ")[1];
            }
            var promotionIdList=[];
             var tempPromIdList   = layui.formSelects.value("stortAcctPromotionList");
            for (var i = 0; i < tempPromIdList.length; i++) {
                promotionIdList.push(tempPromIdList[i].val);
            }
            var bundleDealIdList=[];
             var tempPromIdList   = layui.formSelects.value("stortAcctBundleDealList");
            for (var i = 0; i < tempPromIdList.length; i++) {
                bundleDealIdList.push(tempPromIdList[i].val);
            }
            if(autoProm){
                if(promotionIdList<=0){
                    layer.msg("自动分配促销,需要指定促销方式");
                    return;
                }
            }
            if(autoBundleDeal){
                if(bundleDealIdList<=0){
                    layer.msg("自动分配捆绑销售,需要指定捆绑销售方式");
                    return;
                }
            }
            if (listTiming) {

            }
            else {
                layer.msg("定时刊登开始时间不能为空");
                return;
            }
            loading.show();
            $.ajax({
                type: "post",
                url: ctx + "/shopee/shopeelisting/listtiming.html",
                dataType: "json",
                contentType: 'application/json',
                data: JSON.stringify({
                    idList: ids,
                    listTiming: new Date(listTiming).getTime(),
                    listInterval: listInterval,
                    promotionId:promotionId,
                    autoProm:autoProm,
                    promotionIdList:promotionIdList,
                    bundleDealId: bundleDealId,
                    autoBundleDeal: autoBundleDeal,
                    bundleDealIdList: bundleDealIdList,
                    canPublishStartTime:canPublishStartTime,
                    canPublishEndTime:canPublishEndTime,
                }),
                success: function (returnData) {
                    loading.hide();
                    if (returnData.code != "0000") {
                        layer.msg(returnData.msg);
                    } else {
                        layer.msg("定时刊登成功");
                        layer.close(index);
                        $("#shopeePublish_search").trigger("click");
                    }
                }
            });
        }
    })
}

//取消定时刊登商品
function shopeePublish__canclePublishOnTiming() {
    var layer = layui.layer,
        $ = layui.$;
    var ids = [];
    //生成多个
    $("#shopeePublish_table tbody input[name=id]:checked").each(function () {
        ids.push($(this).val());
    });
    if (ids.length < 1) {
        layer.msg("未选中商品");
        return;
    }

    loading.show();
    $.ajax({
        type: "post",
        url: ctx + "/shopee/shopeelisting/cancleListTiming.html",
        dataType: "json",
        data: {
            ids: ids.join(","),
        },
        success: function (returnData) {
            if (returnData.code != "0000") {
                loading.hide();
                layer.msg(returnData.msg);
            } else {
                layer.msg("取消定时刊登成功");
                $("#shopeePublish_search").trigger("click");
            }
        }
    });
}

//移除子listing,仅删除样式
function removeShopeeSubListing(obj){
    var listingStatus=$("#shopeePublish_searchForm input[name=listingStatus]").val();
    if(listingStatus==0||listingStatus==2) {
        $(obj).closest('tr').remove();
        var skuImgNum = 0;
    }
}

//添加字sku
function addShopeeSubListing(){
    var tr = '<tr>';
    tr += '<td hidden></td>\
            <td><img width="60" height="60" data-original="" src="" class="shopeePublish_subImgUrl img_show_hide lazy b1"></td>\
        <td class="shopeeStoreSSku"><input type="text"  name="storeSSku" data-sku="" class="layui-input" value=""></td>\
        <td><input type="text" class="layui-input shopeePublish_subColorSize" value=""></td>\
        <td><input type="text" class="layui-input shopeePublish_subStyle" value=""></td>\
        <td><input type="number" class="layui-input" value=""></td>\
        <td><input type="number" class="layui-input" value=""></td>\
        <td><button type="button" class="layui-btn layui-btn-sm" onclick="removeShopeeSubListing(this)">移除</button>\
        <button type="button" class="layui-btn layui-btn-sm" onclick="shopeePublish_editVarPic(this)">修改图片</button></td>\
        ';
    tr += '</tr>';
    $('#shopeePublish_SubSkuInfo').append(tr);
}

//重新刊登
function shopeePublish_rePublish(id){
    var listingStatus = $("#shopeePublish_searchForm input[name=listingStatus]").val();
    var paramData = new Array();
    if(id){
        paramData.push(id);
    }
    else{
        var data = $("#shopeePublish_table tbody input[name=id]:checked");
        if (data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                paramData.push(data[i].value);
            }
        }
    }
    if (paramData.length < 1) {
        layui.layer.msg("请至少选择1条数据");
        return;
    }else {

        $.ajax({
            beforeSend: function () {
                loading.show();
            },
            url: ctx + '/shopee/shopeelisting/rePublish.html',
            type: "post",
            dataType: "json",
            data: {"ids": paramData},//是否子sku重发
            traditional: true,
            success: function (returnData) {
                if (returnData.code != "0000") {
                    layer.alert(returnData.msg, {icon: 2});
                } else {
                    layer.msg('商品已标记为待刊登');
                    $("#shopeePublish_search").trigger("click");
                }
            },
            complete: function () {
                loading.hide();
            },
        });
    }
}


/**刊登失败详情页的批量修改颜色尺寸 */
function shopeePublishFailColorSize (obj) {
    var val = $(obj).prev().val(), 
        inp = $('.shopeePublish_subColorSize');
    if (!val) {
        layer.alert('替换颜色_尺寸不能为空!');
        return false;
    }
    for (var i=0; i< inp.length; i++) {
        $(inp[i]).val(val);
    }
    $(obj).prev().val('');
}


/**
 * 绑定类目属性焦点事件
 * @param isListingDetail 是否查listing详情,按详情装配属性
 */
function categoryInput_blur(isListingDetail) {
    // console.log(123);
    $("#shopeePublish_detail_atributes").empty();
    //请求获取类目属性
    var listingId = $("#shopeePublish_editDetailForm input[name=listingId]").val();
    var categoryId = $("#shopeePublish_editDetailForm input[name=categoryId]").val();
    loading.show();
    $.ajax({
        url: ctx + '/shopee/shopeelisting/getAttributeValue.html',
        type: 'post',
        dataType: 'json',
        data: {"categoryId": categoryId, "listingId": listingId,isListingDetail:isListingDetail},
        success: function (returnData) {
            if (returnData && returnData.data) {
                // $("#shopeePublish_editDetailForm input[name=atributes]").val(returnData.data);
                var attrList= returnData.data;
                if (attrList&&attrList.length > 0) {
                    for (var i = 0; i < attrList.length; i++) {
                        //DROP_DOWN
                        var selectTpl = '<div class="layui-form-item">'
                            + '<label class="layui-form-label">:needTips:attrNameTrans</label>'
                            + '<div class="layui-input-inline">'
                            + '    <select name=":attrName" lay-verify=":isMandatory">'
                            + ':optionList'
                            + '    </select>'
                            + '<div class="layui-form-mid layui-word-aux" style="float: none; display: inline;">:description</div>'
                            + '</div>'
                            + '</div>';
                        //COMBO_BOX
                        var comboBoxTpl = '<div class="layui-form-item">'
                            + '<label class="layui-form-label">:needTips:attrNameTrans</label>'
                            + '<div class="layui-input-block">'
                            + '    <select name=":attrName" lay-verify=":isMandatory" lay-search>'
                            + ':inputList'
                            + '    </select>'
                            + '<div class="layui-form-mid layui-word-aux" style="float: none; display: inline;">:description</div>'
                            + '</div>'
                            + '</div>';
                        //TEXT_FILED
                        var inputTpl = '<div class="layui-form-item">'
                            + '<label class="layui-form-label">:needTips:attrNameTrans</label>'
                            + '<div class="layui-input-block">'
                            + '  <input name=":attrName" type=":attrType" value=":attrValue" class="canChangeInput layui-input" lay-verify=":isMandatory:isInteger">'
                            + '<div class="layui-form-mid layui-word-aux" style="float: none; display: inline;">:description</div>'
                            + '</div>'
                            + '</div>';

                        var description = "";
                        var dom = ""; //展示元素
                        var isMandatory = attrList[i].isMandatory,
                            attributeName = attrList[i].attributeName,
                            attributeNameTrans = attrList[i].attributeNameTrans,
                            attributeType = attrList[i].attributeType,
                            attributeId = attrList[i].attributeId,
                            inputType = attrList[i].inputType,
                            options = attrList[i].options,
                            optionsTrans = attrList[i].optionsTrans,
                            attributeValue = attrList[i].attributeValue;
                        var opTransMap = new Map();
                        if(options&&optionsTrans){//构建一个翻译map
                            var optionArry=options.split("#,#");
                            var optionTransArry=optionsTrans.split("#,#");
                            for(var ix=0;ix<optionArry.length;ix++){
                                opTransMap.set(optionArry[ix],optionTransArry[ix]);
                            }
                        }
                        if (inputType == 'COMBO_BOX') {
                            dom = comboBoxTpl;
                            var inputList = '<option value="">请选择</option>';
                            options.split("#,#").forEach(function (attrVal) {

                                var attrValTrans=opTransMap.get(attrVal);
                                if(attrValTrans){
                                    attrValTrans+='('+attrVal+')';
                                }else{attrValTrans=attrVal;}
                                // console.log(attrValTrans);
                                if(attrVal==attributeValue){
                                    inputList += '<option selected value="' + attrVal + '">' + attrValTrans + '</option>';
                                }else{
                                    inputList += '<option  value="' + attrVal + '">' + attrValTrans + '</option>';
                                }
                            });

                            dom = dom.replace(":inputList", inputList);
                        } else if (inputType == 'DROP_DOWN') {
                            dom = selectTpl;
                            var optionList = '<option value="">请选择</option>';
                            options.split("#,#").forEach(function (attrVal) {
                                var attrValTrans=opTransMap.get(attrVal);
                                if(attrValTrans){
                                    attrValTrans +='('+attrVal+')';
                                }else{
                                    attrValTrans=attrVal;
                                }
                                if(attrVal==attributeValue) {
                                    optionList += '<option selected value="' + attrVal + '">' + attrValTrans + '</option>';
                                }else{
                                    optionList += '<option  value="' + attrVal + '">' + attrValTrans + '</option>';
                                }
                            });


                            dom = dom.replace(":optionList", optionList);
                        } else if (inputType == 'TEXT_FILED') {
                            dom = inputTpl;
                            if (attributeType == 'INT_TYPE' || attributeType == 'FLOAT_TYPE') {
                                dom = dom.replace(/:attrType/g, 'number');
                                if (attributeType == 'INT_TYPE') {
                                    dom = dom.replace(/:isInteger/g, 'integer|');//要求整数
                                }
                            } else {
                                dom = dom.replace(/:attrType/g, 'text');
                            }
                            dom = dom.replace(/:isInteger/g, '');//不要求整数
                            if(attributeValue) {
                                dom = dom.replace(/:attrValue/g, attributeValue);
                            }else{
                                dom = dom.replace(/:attrValue/g, '');
                            }
                        }
                        if (isMandatory) {
                            dom = dom.replace(/:isMandatory/g, 'required|');
                            dom = dom.replace(/:isCheckOne/g, 'mustCheckOne|');//要求必选checkbox
                            // dom = dom.replace(/:description/g, '必填'+inputType+"#"+attributeType);
                            dom = dom.replace(/:needTips/g, '<p style="color:red; float: right;" >*</p>');
                        }else {
                            dom = dom.replace(/:isMandatory/g, '');
                            dom = dom.replace(/:isCheckOne/g, '');//不必选checkbox
                            // dom = dom.replace(/:description/g, ''+inputType+'#'+attributeType);
                            dom = dom.replace(/:needTips/g, '');
                        }
                        if(attributeNameTrans) {
                            dom = dom.replace(/:attrNameTrans/g, attributeNameTrans+'('+attributeName+')');
                        }else{
                            dom = dom.replace(/:attrNameTrans/g, attributeName);
                        }
                        dom = dom.replace(/:attrName/g, attributeName);
                        dom = dom.replace(/:description/g, '');
                        //赋值
                        $("#shopeePublish_detail_atributes").append(dom);
                    }
                }
                layui.form.render();
            }else{
                // $("#shopeePublish_editDetailForm input[name=atributes]").val("");
                layui.layer.alert(returnData.msg, {icon: 2});
            }
            loading.hide();
        }
    })
}

// 2-2.辅图网络图片
function addExtPic_shopeePublish() {
    var index = layer.open({
        type: 1,
        title: '辅图网络图片',
        area: ['800px', '300px'],
        content: '<div class="p20"><textarea class="layui-textarea" id="shopeePublish_netImgUrl4" placeholder="请填写URL,多个地址用回车换行"></textarea></div>',
        btn: ['确定', '关闭'],
        yes: function () {
            //网络主图处理
            // console.log($('#netImgUrl'));
            var url = $.trim($("#shopeePublish_netImgUrl4").val());
            shopeePublish_downImgFromUrl4(url);//这个函数在最下面,然后ajax那里的话,我不知道传什么数据data,返回的类型是啥,就没改,只改了一个URL
            $("#shopeePublish_netImgUrl4").val("");
            layer.close(index);
        }
    })
}

//网络辅图处理
function shopeePublish_downImgFromUrl4(url) {
    if (url == null || url == "") {
        layer.msg("图片地址不能为空！", {icon: 5});
        return false;
    }
    var urlArray = url.split("\n");
    // 去一下空格
    for (var j in urlArray) {
        urlArray[j] = $.trim(urlArray[j]);
    }

    //设置数量
    // var skuImgNum=0;
    // $("#shopeePublish_editDetailForm .img_ssku_uri").each(function (){
    //     if($(this).text()){
    //         skuImgNum++;
    //     }
    // });

    var imgTotalNum2=$("#shopeePublish_extImg li").length;
    //辅图最多8张
    var remainNum2 = 8 - imgTotalNum2;
    if ((urlArray.length + imgTotalNum2) > 8) {
        remainNum2 = remainNum2 < 0 ? 0 : remainNum2;
        layer.msg("最大支持共" + 8 + "张辅图,您最多还能上传" + remainNum2 + "张!", {icon: 7});
        return;
    }
    remainNum2 = urlArray.length > remainNum2 ? remainNum2 : urlArray.length;
    for (var i = 0; i < remainNum2; i++) {
        // 生成展示图片
        // showImg(urlArray[i],urlArray[i]);
        // $.ajax({
        //     url: ctx + "/prodTpl/getOnlinePic.html",
        //     data: 'urlString=' + urlArray[i],
        //     success: function (data) {
        //         if (data) {
        //             data = $.parseJSON(data);
        //             if (data.code == '0000') {
        //                 showImg4(data.data);
        //             } else if (data.code == '9999') {
        //                 // $.fn.message({type: 'error', msg: data.msg});
        //                 layer.msg(data.msg, {icon: 5});
        //             }
        //         } else {
        //             // $.fn.message({type: 'error', msg: "图片上传失败!"});
        //             layer.msg("图片上传失败!", {icon: 2})
        //         }
        //     }
        // });
        shopeePublish_showImg4(urlArray[i]);
    }
}

function shopeePublish_showImg4(url) {
    var tpl = '';
    tpl += shopeePublish_imgData['img']['tpl'];
    //layer.msg(url);
    var div = tpl.replace(/&{url}/g,url);
    $('#shopeePublish_extImg').append(div);
    var imgTotalNum=$("#shopeePublish_extImg li").length;
    $("#shopeePublish_editDetailForm #curImgNum").text(imgTotalNum);
}

//已生成的详情框
function shopeePublish__copy_listing() {
    var layer = layui.layer,
        laytpl = layui.laytpl,
        $ = layui.$,
        form = layui.form;
    var ids = [];
    $("#shopeePublish_table tbody input[name=id]:checked").each(function () {
        ids.push($(this).val());
    });
    if (ids.length < 1) {
        layer.msg("必须先选中商品");
        return;
    }

    layer.open({
        type: 1,
        title: '复制模板',
        btn: ['保存','取消'],
        area: ['100%', '100%'],
        content: "加载中...",
        end:function(index,layero){},
        yes: function(index,layero){

            var copyStore = layui.formSelects.value("copyStore_shopeePublish");
            var copyStoreList=[]
            for (var j = 0; j < copyStore.length; j++) {
                copyStoreList.push(copyStore[j].val);
            }

            if(copyStoreList.length<1){
                layer.msg("至少选一个店铺");
                return;
            }
            var detailData={};
            detailData.copyListingIds=ids;
            detailData.copy2StoreIds=copyStoreList;
            $.ajax({
                type:'post',
                url:ctx + '/shopee/shopeelisting/copyListing.html',
                contentType: "application/json;charset=utf-8",
                dataType: "json",
                data: JSON.stringify(detailData),
                success:function(returnData){
                    if(returnData.code != "0000"){
                        layer.alert(returnData.msg,{icon:2});
                        return;
                    }else{
                        layer.closeAll();
                        layer.msg("复制成功");
                        $("#shopeePublish_search").trigger("click");
                    }
                }
            })
        },
        success: function(layero, index) {
            var ids=[];
            $("#shopeePublish_table tbody input[name=id]:checked").each(function () {
                ids.push($(this).val());
            });
            if(ids.length<1){
                layer.msg("必须先选中商品");
                return false;
            }

            $.ajax({
                type:'post',
                url:ctx + '/sys/liststore.html',
                dataType: 'json',
                data: {
                    roleNames : "shopee专员",
                    platCode : "shopee"
                },
                traditional: true,
                success:function(returnData){
                    if(returnData.code != "0000"){
                        layer.alert(returnData.msg,{icon:2});
                        return;
                    }
                    laytpl($("#shopeePulish_copyListingTpl").html()).render(returnData.data, function (html) {
                        $(layero).find('.layui-layer-content').html(html);
                        layui.formSelects.render('copyStore_shopeePublish');
                    });
                    $.ajax({
                        type:'post',
                        url:ctx + '/shopee/shopeelisting/listSelectAllSkuInfo.html',
                        dataType: 'json',
                        async:false,
                        traditional: true,
                        data: {
                            ids:ids
                        },
                        success:function(returnSkuData){
                            if(returnSkuData.code != "0000"){
                                layer.alert(returnSkuData.msg,{icon:2});
                                return;
                            }

                            var skuInfoStr="";
                            $(returnSkuData.data).each(function () {
                                console.log(this);
                                skuInfoStr+="店铺父SKU:"+this.storePSku+"(商品父SKU:"+this.pSku+")<br>";
                            })
                            $("#shopeePublish_skusInfo").append(skuInfoStr);
                        }
                    })
                }
            })
        }
    });
}

function shopeeListingPublish_updatePrice() {
    var subListingIds=[];
    $("#shopeePublish_SubSkuInfo").find("tr").each(function () {
        var tdArr = $(this).children();
        subListingIds.push(tdArr.eq(0).text());
    });
    //按子listingid更新刊登价格
    $.ajax({
        beforeSend: function(){
            loading.show();
        },
        url: ctx + '/shopee/shopeelisting/getUpdateListingPrice.html',
        type: "post",
        dataType: "json",
        traditional: true,
        data:{subListingIds:subListingIds},
        success: function (returnData) {
            if (returnData.code != "0000") {
                layer.alert(returnData.msg, {icon: 2});
            } else {
                if(returnData.msg) {
                    layer.msg('更新价格成功:<br>' + returnData.msg);
                }else{
                    layer.msg('更新价格成功');
                }
                //更新为新价格
                $("#shopeePublish_SubSkuInfo").find("tr").each(function () {
                    var tdArr = $(this).children();
                    var currentId = tdArr.eq(0).text();
                    var upList=returnData.data;
                    for(var i=0;i<upList.length;i++){
                        if(currentId==upList[i].id){
                            tdArr.eq(5).find('input').val(upList[i].price);
                        }
                    }
                });
            }
        },
        complete: function () {
            loading.hide();
        },
    });
}

//主辅图本地上传
function shopeePublish_extPic_exchangeLocal(obj) {
    console.log(123);
    //上传本地图片
    $(obj).Huploadify({
        auto: true,
        fileTypeExts: '*.jpg;*.png;*.jpeg;*.JPG;*.JPEG;*.PNG;*.bmp;*.BMP;*.gif;',
        multi: true,
        fileSizeLimit: 2048,	//默认单位是KB
        buttonText: '本地图片',
        breakPoints: false,
        saveInfoLocal: false,
        showUploadedPercent: true,
        showUploadedSize: true,
        removeTimeout: 500,
        uploader: ctx + "/publish/uploadPic.html",
        onSelect: function (files) {
            return true;
        },
        onUploadStart: function (file) {
        },
        onUploadSuccess: function (file, data, response) {
            data = $.parseJSON(data);
            if (data != null && data.code == '0000') {
                shopeePublish_downImgFromUrl4(data.msg);
            } else {
                layer.msg(data.msg);//这里面的内容不知道写啥,同OA系统
            }
        }
    });
}

function shopeePublish_setOtherSubImg(obj, newImg) {
//获取颜色尺寸和style
    var currentColor = $(obj).parents('tr').find('input.shopeePublish_subColorSize').val();
    var currentSize = $(obj).parents('tr').find('input.shopeePublish_subStyle').val();
    var type1name;
    if (!$.isEmptyObject(currentColor)) {
        if (currentColor.indexOf("_") > -1) {
            type1name = currentColor.substr(0, currentColor.indexOf("_"));
        } else if (!$.isEmptyObject(currentSize)) {
            type1name = currentColor;
        }
    }
    if (type1name) {
        var confirIndex = layui.layer.confirm('此图片是否替换到其他颜色/尺寸同样为' + type1name + '的子属性商品？', function () {
            //查询所有tr列表
            $("#shopeePublish_SubSkuInfo").find("tr").each(function () {
                var thisColorSize = $(this).find('input.shopeePublish_subColorSize').val();
                if (!$.isEmptyObject(thisColorSize) && thisColorSize.startsWith(type1name)) {
                    $(this).find('img.shopeePublish_subImgUrl').attr('src', newImg);
                    $(this).find('img.shopeePublish_subImgUrl').attr('data-original', newImg);
                }
            });
            layer.close(confirIndex);
        })
    }
}

//移除子listing,仅删除样式
function shopeePublish_editVarPic(obj){
    var layer = layui.layer,
        laytpl = layui.laytpl,
        $ = layui.$,
        upload = layui.upload,
        form = layui.form;
    layer.open({
        type: 1,
        title: '选择图片上传方式',
        btn: ['取消'],
        area: ['300px', '150px'],
        content: `<div class="layui-row">
                    
                    <div class="layui-col-md3">
                        <div id="shopeePublish_localPicSubmit" >本地图片</div>
                    </div>
                    <div class="layui-col-md3">
                        <button type="button" class="layui-btn layui-btn-sm" id="shopeePublish_onlinePicSubmit" >网络图片</button>
                    </div>
                    
                </div>`,
        success: function (layero, upIndex) {
            $('#shopeePublish_localPicSubmit').Huploadify({
                auto: true,
                fileTypeExts: '*.jpg;*.png;*.jpeg;*.JPG;*.JPEG;*.PNG;*.bmp;*.BMP;*.gif;',
                multi: true,
                fileSizeLimit: 2048,	//默认单位是KB
                buttonText: '本地图片',
                breakPoints: false,
                saveInfoLocal: false,
                showUploadedPercent: true,
                showUploadedSize: true,
                removeTimeout: 500,
                uploader: ctx + "/publish/uploadPic.html",
                onSelect: function (files) {
                    return true;
                },
                onUploadStart: function (file) {
                    layer.close(upIndex);
                    layui.admin.load.show();
                },
                onUploadSuccess: function (file, data, response) {
                    var dataObj= data;
                    layui.admin.load.hide();
                    if (dataObj != null && dataObj.code === '0000') {
                        $(obj).parents('tr').find('img.shopeePublish_subImgUrl').attr('src', dataObj.msg);
                        $(obj).parents('tr').find('img.shopeePublish_subImgUrl').attr('data-original', dataObj.msg);
                        shopeePublish_setOtherSubImg( obj, dataObj.msg);
                    } else {
                        layer.msg(dataObj.msg);//这里面的内容不知道写啥,同OA系统
                    }
                }
            });

            $("#shopeePublish_onlinePicSubmit").click(function () {
                layer.close(upIndex);
                //填写网络图片
                layer.open({
                    type: 1,
                    title: '填入网络图片',
                    area: ['800px', '300px'],
                    content: '<div class="p20"><textarea class="layui-textarea" id="shopeePublish_netImgUrl_info" placeholder="请填写URL"></textarea></div>',
                    btn: ['确定', '关闭'],
                    yes: function (secondIndex, layero) {
                        //网络主图处理
                        // console.log($('#netImgUrl'));
                        var url = $.trim($("#shopeePublish_netImgUrl_info").val());
                        if (url == null || url == "") {
                            layer.msg("图片地址不能为空！", {icon: 5});
                            return false;
                        }
                        //找到图片并替换掉
                        //todo
                        $(obj).parents('tr').find('img.shopeePublish_subImgUrl').attr('src',url);
                        $(obj).parents('tr').find('img.shopeePublish_subImgUrl').attr('data-original',url);
                        shopeePublish_setOtherSubImg(obj, url);
                        layer.close(secondIndex);
                    }
                })
            });
        },
        yes: function(theIndex, layero) {
            layer.close(theIndex);
        }
    })
}
//移除图片
function shopeePublish_deleteVarPic(obj){
   layer.confirm('确定移除该行图片吗?',function(index){
        $(obj).parents('tr').find('img.shopeePublish_subImgUrl').attr('src',ctx + "/static/img/kong.png");
        $(obj).parents('tr').find('img.shopeePublish_subImgUrl').attr('data-original',ctx + "/static/img/kong.png");
        // shopeePublish_setOtherSubImg(obj, ctx + "/static/img/kong.png");
        layer.close(index);
   })
}

function shopePublish_initAjax(url,data,method, contentType, loadingShow, laodingHide,succFunc) { //初始化ajax请求
    if (loadingShow) {
        loading.show();
    }
    $.ajax({
        type: method||'POST',
        url: ctx + url,
        dataType: 'json',
        async: true,
        data: data,
        contentType: contentType || 'application/json',
        success: function (returnData) {
            if (laodingHide) {
                loading.hide();
            }
            if (returnData.code == "0000") {
                succFunc(returnData)
            } else {
                layer.msg(returnData.msg, {icon: 2});
            }
        },
        error: function (returnData) {
            if (laodingHide) {
                loading.hide();
            }
            if (XMLHttpRequest.status == 200) {
                layer.msg("请重新登录", {icon: 7});
            } else {
                layer.msg("服务器错误");
            }
        }
    })
}

/**
 * 水印
 */
function waterFirstPic_shopeePublish(){
    layer.open({
        type: 1,
        title: '选择水印',
        btn: ['生成', '关闭'],
        area: ['65%', '70%'],
        content: $('#shopeePulish_selWaterTpl').html(),
        success: function (index,layero) {
            var storeAcctId = $("#shopeePublish_editDetailForm input[name=storeAcctId]").val();
            shopePublish_initAjax("/shopee/shoppeWatermark/searchWatermarkBySalePlatAcctId.html", JSON.stringify({"storeAcctId": storeAcctId}), null, null,true,true,function (returnData) {
                $("#shopeePulish_selWaterForm select[name=waterImageId]").empty();
                $("#shopeePulish_selWaterForm select[name='waterImageId']").append("<option value='' selected>请选择</option>");
                $("#shopeePulish_selWaterForm select[name=waterFontId]").empty();
                $("#shopeePulish_selWaterForm select[name='waterFontId']").append("<option value='' selected>请选择</option>");
                //初始化
                if (returnData.data) {
                    if (returnData.data.picList) {
                        returnData.data.picList.forEach(function (val, index) {
                            $("#shopeePulish_selWaterForm select[name='waterImageId']").append("<option value='" + val.id + "'>" + val.watermarkTemplateName + "</option>");
                        });
                    }
                    if (returnData.data.wordList) {
                        returnData.data.wordList.forEach(function (val, index) {
                            $("#shopeePulish_selWaterForm select[name='waterFontId']").append("<option value='" + val.id + "'>" + val.watermarkTemplateName + "</option>");
                        });
                    }
                }
                layui.form.render();
            });
        },
        yes: function (index,layero) {
            var mainImgUrl=$("#shopeePublish_mainImg .ImgDivIn").find('img').attr('src');
            var waterImageId=$("#shopeePulish_selWaterForm select[name='waterImageId']").val();
            var waterFontId=$("#shopeePulish_selWaterForm select[name='waterFontId']").val();
            var watermarkIds ="";
            if(waterImageId){
                watermarkIds=waterImageId;
                if(waterFontId){
                    watermarkIds+=","+waterFontId;
                }
            }else{
                if(waterFontId){
                    watermarkIds+=waterFontId;
                }
            }
            var storeAcctId = $("#shopeePublish_editDetailForm input[name=storeAcctId]").val();
            shopePublish_initAjax("/shopee/shoppeWatermark/getWatermarkImgPath.html", JSON.stringify({"imgPath": mainImgUrl,"watermarkIds":watermarkIds,"storeAcctId":storeAcctId}), null, null,true,true,function (returnData) {
                $("#shopeePublish_mainImg .ImgDivIn").find('img').attr('src',returnData.data);
                $("#shopeePublish_mainImg .ImgDivIn").find('input').attr('value',returnData.data);
                layer.close(index);
                layui.layer.msg("首图水印成功");
            });

        }
    });

}

//更新店铺SKU为商品sku
function shopeePublish_UpdateSku(id) {
    layui.layer.confirm('您确认要更新,且包含店铺父sku？', {icon: 3, title: '提示'}, function (index) {
        $("#shopeePublish_SubSkuInfo").find("tr").each(function () {
            tdArr = $(this).children();
            tdArr.find('input[name=storeSSku]').val(tdArr.find('input[name=storeSSku]').data("ssku"));
        });
        //父SKU
        var pSkuDom = $("#shopeePublish_editDetailForm input[name=storePSku]");
        pSkuDom.val(pSkuDom.data("sku"));
        layer.close(index);
    });
}

function shopeePublish_batchSetSkuSufix(obj){
    var type = $('#shopeePublish_editDetailForm select[name=sufixSetType]').val()
    var original = $("#shopeePublish_editDetailForm input[name=originalsku]").val()
    var newsku = $("#shopeePublish_editDetailForm input[name=newsku]").val()
    if(original!==""){
        if(type==1){
            shopeePublish_addSufix(original)
        }else if(type==2){
            shopeePublish_replaceSufix(original,newsku)
        }else{
            shopeePublish_deleteSufix(original)
        }
    }else{
        layer.msg('请填写要修改的后缀内容')
    }
}

//添加后缀
function shopeePublish_addSufix(newsufix){
    $("#shopeePublish_SubSkuInfo tr").each(function() {
        var originalsku = $(this).find("input[name=storeSSku]").val()
        $(this).find("input[name=storeSSku]").val(originalsku+newsufix);
    });
}
//删除后缀
function shopeePublish_deleteSufix(original){
    $("#shopeePublish_SubSkuInfo tr").each(function() {
        var originalsku = $(this).find("input[name=storeSSku]").val()
        if(shopeePublish_endWith(originalsku,original)){
            $(this).find("input[name=storeSSku]").val(originalsku.slice(0,originalsku.length-original.length));
        }
    });
}
//替换后缀
function shopeePublish_replaceSufix(originalsufix,newsufix){
    $("#shopeePublish_SubSkuInfo tr").each(function() {
        var original = $(this).find("input[name=storeSSku]").val()
        if(shopeePublish_endWith(original,originalsufix)){
            var originbody = original.slice(0,original.length-originalsufix.length)
            $(this).find("input[name=storeSSku]").val(originbody+newsufix);
        }
    });
}

function shopeePublish_endWith(s,sufix) {
    if (sufix == null || sufix == "" || s.length == 0|| sufix.length > s.length)
        return false;
    if (s.substring(s.length - sufix.length) == sufix)
        return true;
    else
        return false;
    return true;
}

function shopeeProductMackListingType(pSku, pId ,type) {
    layer.open({
        type: 1,
        title: '本人设置刊登/不刊登',
        btn: ['确定', '取消'],
        area: ['20%', '20%'],
        content: $('#shopee_publish_Product_Mack_Listing_Type').html(),
        success:function (index , layero) {
            $("#shopee_pulish_p_sku_lising_type_text").val(pSku);
            $("#shopee_pulish_p_id_hidden_lising_type_text").val(pId);
            var name ;
            if (!type || type === "") {
                name = 2;
            }else {
                name = type;
            }
            if (name != "0") {
                $("#shopee_publish_product_mack_listing_show_txt").text("确定设置当前父商品(" + pSku + ")为不想刊登?");
            } else {
                $("#shopee_publish_product_mack_listing_show_txt").text("确定设置当前父商品(" + pSku + ")为想刊登?");
            }
            layui.form.render();
        },
        yes :function (index , layero) {
            var pSku = $("#shopee_pulish_p_sku_lising_type_text").val();
            var prodId = $("#shopee_pulish_p_id_hidden_lising_type_text").val();
            var listingType = $("#shopee_pulish_product_lising_type").val();
            shopePublish_initAjax("/shopee/shopeelisting/mackForLoginUser.html", JSON.stringify({
                "pSku": pSku,
                "prodId": prodId,
                "type": listingType
            }), null, null, true, true, function (returnData) {
                var data = returnData.data;
                layui.layer.msg("设置成功!");

            });
            layer.close(index);
            search_shopeePublish();
        }
    });
}

//批量操作
function shopee_batchHandle(isCked){
        var $trs = $('.shopeePublish_table_body>table>tbody>tr');
        if(isCked){
            var ckedArr = [];
            for(var i =0; i<$trs.length; i++){
                var $item = $($trs[i]);
                var obj = {};
                var targetAopts = $item.children('td:nth-child(4)').find('a[data-id]');
                obj.pSku = targetAopts.text();
                obj.prodPId = targetAopts.data('id');
                ckedArr.push(obj);
            }
            return ckedArr;
        }else{
            var ckedArr = [];
            for(var i =0; i<$trs.length; i++){
                var $item = $($trs[i]);
                var obj = {};
                var targetCked = $item.children('td:nth-child(1)').find('input[type=checkbox]').is(':checked');
                if(targetCked){
                    var targetAopts = $item.children('td:nth-child(4)').find('a[data-id]');
                    obj.pSku = targetAopts.text();
                    obj.prodPId = targetAopts.data('id');
                    ckedArr.push(obj);
                }
            }
            return ckedArr;
        }
}
$('#shopeePublish_batchHandleBtn').on('click', function(){
    var isCked = $('#shopeePublish_AllChecked').is(':checked');
    var data = shopee_batchHandle(isCked);

    $.ajax({
        type: 'POST',
        url: ctx + "/shopee/shopeelisting/batchMackForLoginUser.html",
        dataType: 'json',
        async: true,
        data: JSON.stringify(data),
        contentType: 'application/json',
        success: function (returnData) {
            loading.hide();
            if (returnData.code == "0000") {
                layer.msg(returnData.msg, {icon: 1});
            } else {
                layer.msg(returnData.msg, {icon: 2});
            }
        },
        error: function (returnData) {
            loading.hide();
            if (XMLHttpRequest.status == 200) {
                layer.msg("请重新登录", {icon: 7});
            } else {
                layer.msg("服务器错误");
            }
        }
    })

})

function shopeePublish_showProhibitList(self, dataList) {
    if(dataList) {
        var layer = layui.layer,
            table = layui.table
        var oldId = self.getAttribute('data-tipId')
        if (oldId) {
            layer.close(oldId)
        }

        var tipsIndex = layer.open({
            type: 4,
            shade: 0,
            area: ['800px', ''],
            tips: [4, 'rgba(5,5,5,0.4)'],
            isOutAnim: false,
            content: [$('#shopee_publish_prohibit_tpl').html(), self], //数组第二项即吸附元素选择器或者DOM
            success: function () {
                table.render({
                    elem: "#shopee_publish_prohibit_Table",
                    id: "shopee_publish_prohibit_Table",
                    data: dataList,
                    cols: [
                        [
                            {field: "platCode", title: "平台", width: 100},
                            {field: "salesSite", title: "站点", width: 100},
                            {
                                title: "仓库",
                                templet: '<div>{{shopeePublish_getStockLocationCn(d.stockLocation)}}</div>',
                                width: 100
                            },
                            {
                                title: "禁售原因",
                                templet: '<div>{{(d.ifFixedInable ? ("手动禁售;" + d.lisintgInableMsg)  : d.lisintgInableMsg)}}</div>'
                            },
                        ],
                    ],
                    page: false,
                });
            }
        });
        self.setAttribute('data-tipId', tipsIndex)
    }
}

function shopeePublish_getStockLocationCn(stockLocation) {
    switch (stockLocation) {
        case 0:
            return '全部'
        case 1:
            return '国内仓'
        case 2:
            return '海外仓'
    }
}