/**
 * shopee item boost
 */
var checked_picture;
var timeUnit, shopee_replace_itemBoost_tableIns;
layui.use(['admin', 'form', 'layer', 'formSelects', 'element', 'table', 'laypage'], function() {
    var admin = layui.admin,
        form = layui.form,
        table = layui.table,
        layer = layui.layer,
        formSelects = layui.formSelects,
        $ = layui.$;
    form.render();
    render_hp_orgs_users("#shopee_replace_itemBoost_form"); //渲染部门销售员店铺三级联动

    var nowDate = Format(Date.now(), 'yyyy-MM-dd hh:mm:ss');
    var data = {};
    if (shop_arr.length > 0) {
        data.idList = [];
        for (var i = 0; i < shop_arr.length; i++) {
            data.idList.push(shop_arr[i].id);
        }
        data.idList = data.idList.join(",");
    }
    if (shop_arr.length > 0) {
        replaceItemBoost_loadTable(data);
    }

    //渲染时间组件
    layui.laydate.render({
        elem: '#boostTiming_time',
        type: 'datetime',
        format: 'yyyy-MM-dd HH:mm:ss',
        min: layui.admin.Format(new Date().getTime(), "yyyy-MM-dd hh:mm:ss")
    });

    /**
     * 初始化时搜索
    //  */
    if ($("#shopee_replace_itemBoost_itemIds_hidden").length > 0) {
        replaceItemBoost_loadTable(replaceShopeeItemBoost_getSerachData());
    };
    /**
     * 搜索
     */
    $("#shopee_replace_itemBoost_search_btn").click(function() {
        replaceItemBoost_loadTable(replaceShopeeItemBoost_getSerachData());
    });

    /**
     * 加载数据
     */
    function replaceItemBoost_loadTable(data) {
        shopee_replace_itemBoost_tableIns = table.render({
            elem: "#shopee_replace_itemBoost_table",
            method: 'post',
            url: ctx + "/shopee/shopeeIsEnableProduct/searchBoost.html",
            where: data,
            height: 500,
            cols: [
                [
                    { checkbox: true, width: 30 },
                    { field: "storeAcct", title: "店铺", width: 200, style: "vertical-align: top;" },
                    { field: "itemId", title: "item_id", width: 100, style: "vertical-align: top;" },
                    { field: "variationId", title: "variation_id", width: 100, style: "vertical-align: top;" },
                    { field: "prodPSku", title: "商品父SKU", width: 200, style: "vertical-align: top;" },
                    { field: "boostedTiming", title: "定时时间", templet: '#shopee_online_boostedTiming_tpl', width: 200, style: "vertical-align: top;" },
                    { field: 'optionresult',title: '操作结果', align: 'center',  style: "vertical-align: top;" },
                ],
            ],
            done: function(res, curr, count) {
                $("[data-field='storeAcctId']").css('display', 'none');
                if (res.code == '0000') {
                    $("#shopee_replace_itemBoost_num_span").html(res.count); //数量
                    $("#shopee_replace_itemBoost_itemIds_hidden").remove();
                }
            },
            id: "shopee_replace_itemBoost_table",
        });
    }

    /**
     * 获取检索数据
     */
    function replaceShopeeItemBoost_getSerachData() {
        var data = {};
        data.storeAcctIdList = [];
        var logisAttrContents = formSelects.value('selectAttr_store');
        data.storeAcctIdList = (logisAttrContents || []).map(function(item) {
                return $.trim(item.value)
            })
        var skuStr = $("#shopee_replace_itemBoost_storePSku_input ").val();
        data.prodSSku = skuStr;
        data.storeAcctIdList = $.trim(data.storeAcctIdList);
        var salepersonId = $.trim($("#shopee_replace_itemBoost_form select[name='saleName']").val());
        var orgId = $.trim($("#shopee_replace_itemBoost_form select[name='orgId']").val());
        data.orgId = orgId;
        data.salepersonId = salepersonId;
        data.searchType = $("#shopee_itemBoost_pskuSearchType").val(); //搜索类型
        var itemIds = $("#shopee_boost_itemid_input").val();
        data.itemIdstr = itemIds;

        var siteIds = formSelects.value('shopee_boost_site_sel');
         var siteIds1 = (siteIds || []).map(function(item) {
            return $.trim(item.value)
        })
        data.siteIdstr =siteIds1.join(",");
        return data;
    };
    /**
     * 初始化shopee站点
     */
    shopeeBoost_initShopeeSite();//初始化shopee站点下拉框
    function shopeeBoost_initShopeeSite(){
        $.ajax({
            type: "post",
            url: ctx + "/shopee/onlineProductShopee/getShopeeOnlineEnum.html",
            dataType: "json",
            success: function (returnData) {
                if (returnData.code == "0000") {
                    var sites=[];
                    var siteList=returnData.data.siteList;//站点
                    $(siteList).each(function () {
                        var a = {name: this.name, value: this.code};
                        sites.push(a);
                    });
                    formSelects.data('shopee_boost_site_sel', 'local', {arr: sites});
                    form.render();
                } else {
                    layer.msg(returnData.msg);
                }
            }
        });
    }

    /**
     * 点击图片选中checkbox
     * @param obj
     */
    checked_picture = function(obj) {
        var isCheck = $(obj).parents().children("input[type=checkbox]").is(":checked");
        if (isCheck) {
            $(obj).parents().children("input[type=checkbox]").prop("checked", false);
        } else {
            $(obj).parents().children("input[type=checkbox]").prop("checked", true);
        }
        form.render('checkbox');
    }

    /**
     * 立即批量boost
     */
    $("#shopee_replace_itemBoost_bacthUpdate_btn").click(function() {
        var itemData = table.checkStatus('shopee_replace_itemBoost_table').data; //获取选择的店铺
        if (itemData == null || itemData.length < 1) {
            layer.msg("请选择lisiting", { icon: 0 });
            return;
        }
        var idList = []
        for (var index in itemData) {
            var obj = itemData[index];
            idList.push(obj.id);
        };
        loading.show();
        $.ajax({
            type: "POST",
            url: ctx + "/shopee/shopeeIsEnableProduct/batchBoostItem.html",
            data: { 'idList': JSON.stringify(idList) },
            async: true,
            dataType: "json",
            success: function(returnData) {
                if (returnData.code == "0000") {
                    selectResult(idList);
                    loading.hide();
                } else {
                    loading.hide()
                    layer.open({
                        title: '错误'
                        ,content: returnData.msg
                    });
                }
            },
            error: function() {
                loading.hide()
                layer.msg("服务器正忙");
            }
        });
    });

    function selectResult(idList) {
        $.ajax({
            type: "POST",
            url: ctx + "/shopee/shopeeIsEnableProduct/getBoostItemResult.html",
            data: { 'idList': JSON.stringify(idList) },
            dataType: "json",
            success: function(returnData) {
                if (returnData.code == "0000") {
                    var resultData = returnData.data;
                    for (var i = 0; i < resultData.length; i++) {
                        applytoChecked('shopee_replace_itemBoost_table', shopee_replace_itemBoost_tableIns, function(tr, data, index) {
                            if (resultData[i].id === data.id) {
                                $(tr).find('td[data-field="optionresult"] div').text(resultData[i].boostedResult);
                            }
                        })
                    }
                } else {
                    layer.msg(returnData.msg);
                }
            },
            error: function() {
                layer.msg("服务器正忙");

            }
        });
    }

    /**
     * 取消定时时间
     */
    $("#shopee_replace_itemBoost_cancel_timing_bacthUpdate_btn").click(function() {
        var itemData = table.checkStatus('shopee_replace_itemBoost_table').data; //获取选择的店铺
        if (itemData == null || itemData.length < 1) {
            layer.msg("请选择lisiting", { icon: 0 });
            return;
        }
        var dtoList = []
        for (var index in itemData) {
            var obj = itemData[index];
            var dto = {};
            dto.id = obj.id;
            dto.boostedTiming = obj.boostedTiming;
            dtoList.push(dto);
        };
        loading.show();
        $.ajax({
            type: "POST",
            url: ctx + "/shopee/shopeeIsEnableProduct/batchBoostedTiming.html",
            data: { 'dtoList': JSON.stringify(dtoList),
                    'operationType':2},
            async: true,
            dataType: "json",
            success: function(returnData) {
                if (returnData.code == "0000") {
                    for (var i = 0; i < itemData.length; i++) {
                        applytoChecked('shopee_replace_itemBoost_table', shopee_replace_itemBoost_tableIns, function(tr, data, index) {
                            $(tr).find('td[data-field="optionresult"] div').text("取消成功");
                        })
                    }
                    loading.hide();
                    layer.msg("取消定时boost成功")
                } else {
                    loading.hide()
                    layer.msg(returnData.msg);
                }
            },
            error: function() {
                loading.hide()
                layer.msg("服务器正忙");
            }
        });
    });

    /**
     * 应用定时时间
     */
    $("#update_boost_timing_btn").click(function(){
        var listTiming = $("#boostTiming_time").val();
        if(listTiming == '' || listTiming == null ){
            layer.msg("请选择定时时间", { icon: 0 });
            return;
        }
        var itemData = table.checkStatus('shopee_replace_itemBoost_table').data; //获取选择的店铺
        if (itemData == null || itemData.length < 1) {
            layer.msg("请选择lisiting", { icon: 0 });
            return;
        }
        if(listTiming < nowDate){
            layer.msg("定时时间不能小于当前时间", { icon: 0 });
            return;
        }
        for (var i = 0; i < itemData.length; i++) {
            applytoChecked('shopee_replace_itemBoost_table', shopee_replace_itemBoost_tableIns, function(tr, data, index) {
                $(tr).find('td[data-field="boostedTiming"] div').text(listTiming);
            })
        }
    })

    /**
     * 批量自动定时boost
     */
    $("#shopee_replace_itemBoost_timing_auto_bacthUpdate_btn").click(function(){
        var itemData = table.checkStatus('shopee_replace_itemBoost_table').data; //获取选择的店铺
        if (itemData == null || itemData.length < 1) {
            layer.msg("请选择lisiting", { icon: 0 });
            return;
        }
        var dtoList = [];
        var data = {};
        data.idList = [];
        for (var i = 0; i < itemData.length; i++) {
            var dto = {};
            dto.id = itemData[i].id;
            dto.storeAcctId = itemData[i].storeAcctId;
            dtoList.push(dto);
            data.idList.push(itemData[i].id);
        }
        data.idList = data.idList.join(",");
        loading.show();
        $.ajax({
            type: "POST",
            url: ctx + "/shopee/shopeeIsEnableProduct/autoBatchBoostedTiming.html",
            data: { 'dtoList': JSON.stringify(dtoList),
                'startTime':"",
            "site":"aaa"},
            async: true,
            dataType: "json",
            success: function(returnData) {
                if (returnData.code == "0000") {
                    //重新请求接口，查询时间
                    replaceItemBoost_loadTable(data);
                    loading.hide();
                    layer.msg("批量自动定时boost设置成功")
                } else {
                    loading.hide()
                    layer.msg(returnData.msg);
                }
            },
            error: function() {
                loading.hide()
                layer.msg("服务器正忙");
            }
        });
    })

    /**
     * 巴西批量自动定时boost（间隔时间1分钟）
     */
    $("#shopee_replace_itemBoost_timing_auto_bacthUpdate_brazil_btn").click(function(){
        var itemData = table.checkStatus('shopee_replace_itemBoost_table').data; //获取选择的店铺
        if (itemData == null || itemData.length < 1) {
            layer.msg("请选择lisiting", { icon: 0 });
            return;
        }
        var dtoList = [];
        var data = {};
        data.idList = [];
        for (var i = 0; i < itemData.length; i++) {
            var dto = {};
            dto.id = itemData[i].id;
            dto.storeAcctId = itemData[i].storeAcctId;
            dtoList.push(dto);
            data.idList.push(itemData[i].id);
        }
        data.idList = data.idList.join(",");
        loading.show();
        $.ajax({
            type: "POST",
            url: ctx + "/shopee/shopeeIsEnableProduct/autoBatchBoostedTiming.html",
            data: { 'dtoList': JSON.stringify(dtoList),
                'startTime':"",
                'site':'Brazil'},
            async: true,
            dataType: "json",
            success: function(returnData) {
                if (returnData.code == "0000") {
                    //重新请求接口，查询时间
                    replaceItemBoost_loadTable(data);
                    loading.hide();
                    layer.msg("批量自动定时boost设置成功")
                } else {
                    loading.hide()
                    layer.msg(returnData.msg);
                }
            },
            error: function() {
                loading.hide()
                layer.msg("服务器正忙");
            }
        });
    })

});