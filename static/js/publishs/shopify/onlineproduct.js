/**shopify在线商品的js*/
var shop_arr = new Array();
var timeUnit;
var shopifySkus;
layui.use(['admin', 'layer', 'table', 'form', 'laytpl', 'element', 'laydate', 'laytpl', 'formSelects'], function () {
    var admin = layui.admin,
        layer = layui.layer,
        $ = layui.$,
        table = layui.table,
        laydate = layui.laydate,
        element = layui.element,
        formSelects = layui.formSelects,
        laytpl = layui.laytpl,
        form = layui.form;
    form.render('checkbox');
    form.render('select'); //刷新select选择框渲染
    //远程搜索功能
    var dim = new DimSearch('#shopify_pl_searchSysUser', 'shopify_online_userId',{
        url: '/sys/searchSysUser.html',
        query: 'name',
        label:'name',
        name:'.shopifyOnline_dimResultDiv'
    });
    dim.init();
    /**
     * 日期渲染
     */
    laydate.render({
        elem: '#shopify_online_listtime',
        range: true
    });
    render_hp_orgs_users("#pl_shopify_searchForm");//渲染部门销售员店铺三级联动


    $("#shopify_online_search_reset").click(function () {
        $("#pl_shopify_searchForm")[0].reset();
        $("#pl_shopify_searchForm input[type='hidden']").val('');
        $("#shopify_online__search_cate_div").html('');
        $('#shopify_online_depart_sel').next().find('dd[lay-value=""]').trigger('click');
    });


    /**
     * 批量操作(上下架，调价等)
     */
    form.on('select(shopify_online_isEnableSel)', function (data) {

        var selected = $.trim(data.value);
        if (selected == null || selected == '') {
            return false;
        }
        if (selected === '0') { //批量更新
            var itemData = table.checkStatus('shopify_online_data_table').data; //获取选择的lisiting
            if (itemData == null || itemData.length < 1) {
                layer.msg("请选择lisiting", {icon: 0});
                return;
            }
            var productIdStr = [];
            for (var index in itemData) {
                var obj = itemData[index];
                productIdStr.push(obj.storeAcctId + "&" + obj.productId);
            }
            updateBacthshopifyItem(productIdStr.join(","));
            return false;
        }

        /**
         * 弹窗
         */
        var sobj = $("#shopify_online_isEnableSel").find("[value=" + selected + "]");
        var title = $(sobj).attr("data-title");
        var link = $(sobj).attr("data-link");
        var index = layer.open({
            type: 1,
            id: Date.now(),
            title: title,
            area: ['1200px', '90%'],
            success: function () {
                layui.view(this.id).render(link).done(function () {
                    //渲染完成以后执行的函数
                })
            }
        });

    });

    /**
     * 搜索
     */
    $("#shopify_online_search_submit").click(function () {
        table.render({
            elem: "#shopify_online_data_table",
            method: 'post',
            url: ctx + "/onlineProductShopify/queryList.html",
            where: shopifyOnline_getSerachData(),
            cols: [
                [
                    {checkbox: true, width: 25, style: "vertical-align: top;"},
                    {field: "mainImage", unresize: true, width: 66, title: "图片", style: "vertical-align: top;", templet: '#shopify_online_pImgs_tpl'},
                    {title: "标题/产品id", width: 380, style: "vertical-align: top;", templet: '#shopify_online_title_tpl'},
                    {title: "店铺父SKU", style: "vertical-align: top;", templet: '#shopify_online_storePSku_tpl', width: 300},
                    { width:750,style:"vertical-align: top;",templet: '#shopify_online_storeSSku_tpl',
                        title:
                            "<div style='width:100px;float: left;'>SKU</div> " +
                            "<div style='width:120px;float: left;'>颜色</div> " +
                            "<div style='width:120px;float: left;'>尺寸</div> " +
                            "<div style='width:120px;float: left;'>样式</div> " +
                            "<div style='width:100px;float: left;'>价格($)</div> " +
                            "<div style='width:80px;float: left;'>在线数量</div>" +
                            "<div style='width:100px;float: left;'>可用/在途/未派</div> "
                       },
                    {field: "listingStartTime", width: 150, title: "时间", templet: '#shopify_online_listTime_tpl'},
                    {title: '操作', width: 100, align: 'center', style: "vertical-align: top;", templet: '#shopify_online_operate_tpl'}
                ],
            ],
            done: function (res) {
                //懒加载
                theadHandle().fixTh('#shopifyOnlineProCard', 200);
                imageLazyloadAll();
                if (res.code === '0000') {
                    $("#shopify_online_online_num1_span").html(res.count);//在线
                }else {
                    layer.msg(res.msg, {icon: 0});
                }
            },
            page: true,
            id: "shopify_online_data_table",
            limits: [50, 100, 300],
            limit: 50
        });
        //工具条的监听事件,table.on(tool(表格的lay-filter的值))
        table.on('tool(shopify_online_data_table)', function (obj) {
            var data = obj.data, //获得当前行数据
                layEvent = obj.event; //获得 lay-event 对应的值
            var productIdStr = data.storeAcctId + "&" + data.productId;
            if (layEvent === "shopify_online_updateOneItem") { //更新一条item
                updateBacthshopifyItem(productIdStr);
            }

            var productId = data.productId;
            if (layEvent == 'shopify_online_searchLog') {
                layer.open({
                    type: 1,
                    title: '查看日志',
                    shadeClose: false,
                    area: ['60%', '60%'],
                    content: $('#log_table_shopify').html(),
                    success: function () {
                        shopifyOnline_searchLog(productId);
                    }
                })
            }
        });
    });

    /**
     * 查看日志
     * @param itemId
     */
    function shopifyOnline_searchLog(productId) {
        table.render({
            elem: '#shopify_log_table',
            method: 'post',
            url: ctx + '/onlineProductShopify/searchShopifyOnlineLog.html',
            where: {'productId': productId}
            , cols: [[ //标题栏
                {field: 'createTime', title: '时间',width: '15%',
                    templet: "<div>{{layui.util.toDateString(d.createTime,'yyyy-MM-dd HH:mm:ss')}}</div>"
                }
                , {field: 'creator', title: '操作人',width: '7%'}
                , {field: 'prodSSku', title: '子SKU',width: '10%'}
                , {field: 'operType', title: '事件', templet: '#shopify_log_operation',width: '13%'}
                , {field: 'origData', title: '原值',width: '20%'}
                , {field: 'newData', title: '调整值', width: '20%'}
                , {field: 'operDesc', title: '结果', width: '15%'}
            ]],
        })
    }

    /**
     * 批量更新
     * @param productIdStr 产品id和店铺组成的字符串
     */
    function updateBacthshopifyItem(productIdStr) {
        loading.show();
        if (productIdStr == null || productIdStr == '') {
            layer.msg("请选择lisiting", {icon: 0});
            return;
        }
        $.ajax({
            type: "post",
            url: ctx + "/onlineProductShopify/batchSyncProductInfo.html",
            data: {"productIdStr": productIdStr},
            dataType: "json",
            success: function (returnData) {
                loading.hide();
                if (returnData.code == "0000") {
                    layer.msg(returnData.msg, {icon: 1});
                    $("#shopify_online_search_submit").click();
                } else {
                    layer.open({
                        title: '更新lisiting结果',
                        content: returnData.msg,
                        offset: '100px',
                        area: '500px',
                        yes: function (index, layero) {
                            layer.close(index); //如果设定了yes回调，需进行手工关闭
                        }
                    });
                }
            }
        })
    };

    /**
     * 获取搜索参数
     */
    function shopifyOnline_getSerachData() {
        var obj = {};
        //所选店铺
        var currentStoreAccts = formSelects.value("shopify_online_store_sel", "val");
        obj.roleNames = "shopify专员";
        //选择的店铺
        obj.storeAcctIdStr = currentStoreAccts.join(",");

        //搜索类型
        var searchType = $.trim($("#shopify_online_searchtype_sel").val());
        var skuValue = $.trim($("#shopify_online_searchtype_input").val());
        if (searchType === "prodPSKu") {obj.prodPSku =skuValue;}
        if (searchType === "prodSSku") {obj.prodSSku = skuValue;}
        if (searchType === "storePSku") {obj.storePSku = skuValue;}
        if (searchType === "storeSSku") {obj.storeSSku = skuValue;}
        //标题检索类型
        var titleSearchType = $.trim($("#shopify_online_title_search_type").val());
        //刊登标题
        var title = $.trim($("#shopify_online_title").val());
        if (title != null && title !== '') {
            //标题模糊
            if (titleSearchType === '0') {
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
            }
            //标题精准
            if (titleSearchType === '1') {
                obj.title = "%" + title + "%";
            }
        }
        //排序类型
        obj.sortType = $.trim($("#shopify_online_sortdesc_sel").val());
        //刊登时间
        var lisitingTime = $.trim($("#shopify_online_listtime").val());
        if (lisitingTime != null) {
            obj.listingStartTime = lisitingTime.substring(0, 10);
            obj.listingEndTime = lisitingTime.substring(13);
        }
        //产品id
        obj.productId = $.trim($("#shopify_online_productId").val());
        var shopify_online_userId =   $.trim($("#pl_shopify_searchForm input[name=shopify_online_userId]").val());
        if(shopify_online_userId != null && shopify_online_userId !=''){
            obj.shopify_online_userId = shopify_online_userId;
        }
        return obj;
    }

    //监听表格复选框选择
    table.on('checkbox(shopify_online_data_table)', function (obj) {
        var checkStatus = table.checkStatus('shopify_online_data_table'), date = checkStatus.data;
        if (obj.data.isOffline) {
            layer.msg("商品已下线");
        } else {
            shop_arr = date;
        }
    });
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



