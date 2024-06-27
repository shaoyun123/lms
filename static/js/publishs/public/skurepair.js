/**
 * SKU映射修复的js
 */
layui.use(['admin', 'layer', 'table', 'form', 'laytpl', 'element', 'formSelects'], function () {
    var admin = layui.admin,
        layer = layui.layer,
        $ = layui.$,
        table = layui.table,
        formSelects = layui.formSelects,
        form = layui.form;


    form.render('checkbox');
    form.render('select'); //刷新select选择框渲染
    skurepair_initStroreAcct("wish");//初始化店铺选择框
    var  skurepair_storeAcctData;//店铺数据
    $("#publish_skurepair_searchBtn").click(function(){
        skurepair_searchDataTable();
    });
    /**平台更改**/
    form.on('select(publish_skurepair_platList_sel)', function (data) {
        var platCode=$("#publish_skurepair_platList_sel").val();
        skurepair_initStroreAcct(platCode)
    });
   /**导出查询数据**/
    $("#publish_skurepair_reportBtn").click(function(){
        var data=skurepair_getSerachData();//搜索参数
        skuType=data.skuType;
        data.prodId=0;//未映射的
        if(data.storeSkus ==null || data.storeSkus ==""){
            var tips="";
            var isSale =$.trim($("#publish_skurepair_isSale_sel").val());//上下架状态
            var exportType="全部的 ";
            if(isSale=="1"){
                exportType="上架的";
            }else if(isSale=="0"){
                exportType="下架的";
            }
            if(skuType==1){
                tips=" <span style='color:blue'>"+exportType+" 店铺父SKU </span>";
            }else if(skuType==2){
                tips="  <span style='color:blue'> "+exportType+"店铺子SKU </span> ";
            }
            var confirmindex = layer.confirm('确认导出 <span style="color:blue">'+data.platCode+'</span> 平台店铺下'+tips+'的未映射信息？',{btn:['确认','取消']},function (result) {
                if(result){
                    layer.close(confirmindex );
                    submitForm(data,ctx + '/skuRepair/exportRepairNoMappingSkuMapping.html',"_blank");
                }
            })
        }else{
            var Confirmindex = layer.confirm('确认导出当前搜索条件下的未映射信息？',{btn:['确认','取消']},function (result) {
                if(result){
                    layer.close(Confirmindex );
                    submitForm(data,ctx + '/skuRepair/exportRepairNoMappingSkuMapping.html',"_blank");
                }
            })
        }
    });
    /**新增店铺父sku映射*/
    $("#publish_skurepair_add_storePSku_btn").click(function () {
        skurepair_addSkuMapping($(this).attr("title"));
    });

    /**新增店铺子sku映射*/
    $("#publish_skurepair_add_storeSubSku_btn").click(function () {
        var title=$(this).attr("title");
        skurepair_addSkuMapping(title);
    });
    /**新增映射弹框**/
    function skurepair_addSkuMapping(title) {
        var aad_index = layer.open({
            type: 1,
            title: title,
            area: ['60%', '60%'],
            btn: ['保存', '关闭'],
            content: $('#publish_skurepair_add_layer').html(),
            success: function (layero, index) {
                var str="<option value=''>请选择</option>";
                if($.isEmptyObject(skurepair_storeAcctData) ){
                    $.ajax({
                        type: "post",
                        url: ctx + "/skuRepair/getAllStroreAcctByPaltCode.html",
                        dataType: "json",
                        success: function (returnData) {
                            if (returnData.code == "0000") {
                                skurepair_storeAcctData=returnData.data;//存储店铺数据
                                $(returnData.data).each(function () {
                                    str += "<option value='" + this.id + "'>" + this.store_acct + "</option>";
                                });
                                $("#publish_skurepair_add_platList_sel").html(str);
                                form.render();
                            } else {
                                layer.msg(returnData.msg);
                            }
                        }
                    });
                }else{
                    $(skurepair_storeAcctData).each(function () {
                        str += "<option value='" + this.id + "'>" + this.store_acct + "</option>";
                    });
                    $("#publish_skurepair_add_platList_sel").html(str);
                    form.render();
                }
            },
            yes: function (index, layero) {
                var store_acct_id=$("#publish_skurepair_add_platList_sel").val();//店铺
                var store_sku=$.trim($("#publish_skurepair_add_store_sku").val());//店铺sku
                var prod_sku=$.trim($("#publish_skurepair_add_prod_sku").val());//基础商品sku
                if(store_acct_id == null || store_acct_id == ''){
                    layer.msg("店铺不能为空", {icon: 0});
                    return;
                }
                if(store_sku==null||store_sku==''){
                    layer.msg("店铺SKU不能为空", {icon: 0});
                    return;
                }
                if(prod_sku==null||prod_sku==''){
                    layer.msg("基础商品SKU不能为空", {icon: 0});
                    return;
                }
                var sendUrl="";
                var sendData={};
                sendData.store_acct_id=store_acct_id;
                if(title.indexOf("父") >-1 ){
                    sendData.store_p_sku=store_sku;
                    sendData.prod_p_sku=prod_sku;
                    sendUrl=ctx + "/skuRepair/addOneStorePSkuMapping.html";
                }else if(title.indexOf("子") >-1 ){
                    sendData.store_sub_sku=store_sku;
                    sendData.prod_sub_sku=prod_sku;
                    sendUrl=ctx + "/skuRepair/addOneStoreSubSkuMapping.html";
                }
                loading.show();
                $.ajax({
                    type: "post",
                    url:sendUrl,
                    data: sendData,
                    dataType: "json",
                    success: function (returnData) {
                        loading.hide();
                        if (returnData.code == "0000") {
                            layer.close(aad_index);
                            layer.msg(returnData.msg,{icon:1});
                        } else {
                            layer.msg(returnData.msg,{icon:5,time:5000});
                        }
                    }
                });
            }
        });
    };

    /**
     * 根据平台渲染店铺选择框
     */
    function skurepair_initStroreAcct(platCode) {
        $.ajax({
            type: "post",
            url: ctx + "/skuRepair/getAllStroreAcctByPaltCode.html",
            data: {"platCode": platCode},
            dataType: "json",
            success: function (returnData) {
                if (returnData.code == "0000") {
                    var currentStoreAccts= [];
                    for (var i = 0; i < returnData.data.length; i++) {
                        var a = {name: returnData.data[i].store_acct, value: returnData.data[i].id}
                        currentStoreAccts.push(a);
                    }
                    formSelects.data('publish_skurepair_storeAcct_sel', 'local', {arr: currentStoreAccts})
                    form.render();
                } else {
                    layer.msg(returnData.msg,{icon:5});
                }
            }
        });
    };
    /**
     *
     */
    function  skurepair_searchDataTable(){
        var storeSku=$.trim($("#publish_skurepair_storeSku_text").val());
        var data=skurepair_getSerachData();
        if(storeSku==null||storeSku==''){
            data.prodId=0;//默认未映射
            data.limitSize=1000;//检索1000条
        }
        table.render({
            elem: "#publish_skurepair_data_table",
            method: 'post',
            url: ctx + "/skuRepair/getSkuMappingByCondition.html",
            where: data,
            cols: [
                [
                    {checkbox:true},
                    { field: "store_acct",title: "店铺" , style:"vertical-align: top;",},
                    { field: 'store_sku', title: "店铺SKU", align: 'left',style:"text-align:left;vertical-align: top;", },
                    // { field: "prod_sku", title: "<span id='publish_skurepair_prod_sku_span'></span>", style:"vertical-align: top;" , templet: '#publish_skurepair_prod_sku_tpl' },
                    // { title: '操作', width:80, align: 'center', style:"vertical-align: top;", templet: '#publish_skurepair_table_operate_tpl' }
                ],
            ],
            done:function (res) {
                $("#publish_skurepair_table_data_num").html(res.count);
                var skuType = $("#publish_skurepair_skutype_sel").val();
                var title="";
                if(skuType==1){
                    title="基础商品父SKU";
                }else if(skuType==2){
                    title="基础商品子SKU";
                }
                var str='<span class="span_repair">'+title+'<img src="/lms/static/img/edit.png" id="publish_skurepair_prod_sku_img" title="点击一键应用"></span>';
                str+='   <span class="span_repair"> <input type="text" class="layui-input" style="width:70%;" id="publish_skurepair_prod_sku_th_input">'
                str+=       '<span id="publish_skurepair_skuposition1" class="publish_skurepair_skuposition1" title="确认应用">√</span>';
                str+=       '<span id="publish_skurepair_skuposition2" class="publish_skurepair_skuposition2" title="取消应用">×</span>'
                str+='   </span>';
                $("#publish_skurepair_prod_sku_span").html(str);
                $("#publish_skurepair_prod_sku_span").find(".span_repair").eq(1).toggle();
                $("#publish_skurepair_prod_sku_img").click(function(){
                    $("#publish_skurepair_prod_sku_th_input").val('');
                    $("#publish_skurepair_prod_sku_span").find(".span_repair").toggle();
                });
                $("#publish_skurepair_skuposition1").click(function(){
                    var prod_sku=$("#publish_skurepair_prod_sku_th_input").val();
                    $("#publish_skurepair_data_table_content").find(".publish_skurepair_prod_sku_td_input").val(prod_sku);
                    $("#publish_skurepair_prod_sku_span").find(".span_repair").toggle();
                });
                $("#publish_skurepair_skuposition2").click(function(){
                    $("#publish_skurepair_prod_sku_span").find(".span_repair").toggle();
                });
            },
        });
    };
    /**
     * 表格工具条的保存
     */
    table.on('tool(publish_skurepair_data_table)', function(obj) {
        var data = obj.data, //获得当前行数据
            layEvent = obj.event; //获得 lay-event 对应的值
        if (layEvent === 'edit') {
            var itemDataArray=[];
            itemDataArray.push(data);
            skurepair_updateBatchSkuMapping(itemDataArray);
        }
    });
    /**
     * 批量更新sku映射关系
     */
    $("#publish_skurepair_batchsave_btn").click(function() {
        var itemData = [];
        itemData = table.checkStatus('publish_skurepair_data_table').data; //获取选择的店铺
        if (itemData == null || itemData.length < 1) {
            layer.msg("请选择要保存的映射", {icon: 0});
            return;
        }
        var skuType = $("#publish_skurepair_skutype_sel").val();
        var title = "";
        if (skuType == 1) {
            title = "店铺父SKU";
        } else if (skuType == 2) {
            title = "店铺子SKU";
        }
        if (itemData.length > 1) {
            var confirmsave= layer.confirm("确认保存 " + itemData.length + " 条<span style='color:blue;'>" + title + "</span>映射", function (result) {
                if (result) {
                    skurepair_updateBatchSkuMapping(itemData);
                    layer.close(confirmsave);
                }
            })
        } else {
            skurepair_updateBatchSkuMapping(itemData);
        }
    });

    /**
     * 批量保存映射
     * @param itemData
     */
    function skurepair_updateBatchSkuMapping(itemData) {
        if (itemData == null || itemData.length < 1) {
            layer.msg("请选择要保存的映射",{icon:0});
            return;
        }
        var updateArray = [];
        for (var index in itemData) {
            var obj = itemData[index];
            var new_obj = {};
            new_obj.id = obj.id;
            new_obj.storeSku=obj.store_sku;//原来的店铺sku
            new_obj.oldProdSku = obj.prod_sku;//旧的商品 sku
            new_obj.prodSku = $.trim($("#publish_skurepair_prod_sku_" + obj.id).val());
            if (new_obj.prodSku == null || new_obj.prodSku == '') {
                layer.msg("基础商品sku不能为空，请检查数据", {icon: 0});
                return;
            }
            if (new_obj.prodSku != new_obj.oldProdSku) { //新的映射值不等于旧的
                updateArray.push(new_obj);
            }
        };
        var skuType = $("#publish_skurepair_skutype_sel").val();
        loading.show();
        $.ajax({
            type: "post",
            url: ctx + "/skuRepair/updateBatchSkuMapping.html",
            data: {"skuType": skuType,"updateArray":JSON.stringify(updateArray),"platCode": $("#publish_skurepair_platList_sel").val()},
            dataType: "json",
            success: function (returnData) {
                loading.hide();
                if (returnData.code == "0000") {
                    layer.msg(returnData.msg,{icon:1});
                } else {
                    var data=returnData.data;
                    if(data != null && data.length >0){
                        var content= "<div style='text-indent: 2em'><div style='line-height: 32px;'>"+returnData.msg+"</div><hr>";
                        for(var i in data){
                            content+="<div style='line-height: 32px;'>"+data[i]+"</div>"
                        }
                        content+="</div>";
                       var tipIndex= layer.open({
                            title: '修改映射错误提示',
                            type: 1, //不加该属性,就会出现[object Object]
                            area: ['600px', '50%'],
                            shadeClose: false,
                            btn: ['关闭'],
                            content: content,
                            yes: function(index, layero) {
                                layer.close(tipIndex);
                            },
                        })
                    }else{
                        layer.msg(returnData.msg,{icon:5});
                    }
                }
            }
        });
    };
    //获取搜索数据
    function skurepair_getSerachData(){
        var obj = {};
        var platCode = $.trim($("#publish_skurepair_platList_sel").val());
        var storeAcctIds =[];//选择的多个店铺
        var storeSkus=$.trim($("#publish_skurepair_storeSku_text").val());
        var skuType = $("#publish_skurepair_skutype_sel").val();
        var isSale =$.trim($("#publish_skurepair_isSale_sel").val());
        if(storeSkus != null){
            storeSkus=storeSkus.replace("，",",");
        }
        obj.storeSkus = storeSkus;
        var storeAcctIdObj = formSelects.value("publish_skurepair_storeAcct_sel");
        for (var i = 0; i < storeAcctIdObj.length; i++) {
             storeAcctIds.push($.trim(storeAcctIdObj[i].val));
        }
        obj.platCode = platCode;
        obj.storeAcctIds = storeAcctIds.join(",");
        obj.isSale=isSale;
        obj.skuType=skuType;
        return obj;
    }
});