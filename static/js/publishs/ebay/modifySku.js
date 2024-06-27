/**
 * ebay修改SKU
 */
console.log("ebay修改子SKU js");
layui.use(['element','laytpl', 'form'], function() {
    var element = layui.element;
    var laytpl = layui.laytpl;
    var form = layui.form;
    //初始化表格
    //modifyTitle_arr
    //选中的ebay商品id
    var ids = [];
    modifyTitle_arr.forEach(function(modifyData) {
        ids.push(modifyData.id);
    });
    //初始化弹框数据
    initItems(ids);
    
    
    
    //
    function initItems(ids){
        layui.admin.load.show();
        $.ajax({
        	type:"post",
        	url: ctx + "/ebayIsEnableProduct/skuinfoQuery.html",
        	data:{idList:ids.join(",")},
        	dataType:"json",
        	success:function(returnData){
        	    layui.admin.load.hide();
        	    if(returnData.code != "0000"){
        	        layer.msg(returnData.msg, { icon: 2 });
        	        return;
        	    }
        	    //TODO 应用tpl
        	    $("#eo_modifySkuDiv").html($("#eo_modifySkuTpl").html());
        	    //处理单个商品数据
        	    returnData.data.forEach(function(itemData){
        	        initItem(itemData);
        	    });
        	    layui.form.render();
        	    //init本地图片
        	    eo_initSubSkuImgExchangeLocal();
        	}
        });
    }
    //初始化单个商品
    function initItem(itemData){
        //item Dom元素Id
        var divDomId = "eo_modifyItemDiv_" + itemData.id;
        var itemHtml = "";
        laytpl($("#eo_modifySkuItemTpl").html()).render(itemData, function (html) {
            itemHtml = html;
        });
        $("#eo_modifySkuDiv .layui-collapse").append(itemHtml);
        //处理specifics
        var specificsFields = dealSpecifics(itemData.list);
        //key value数据
        var specificsData = itemData.list.specifics;
        //是否为图片属性
        var specificsFieldPicture = true;
        specificsFields.forEach(function(specificsField){
            var tableDom = $("#"+divDomId).find("table");
            //增加th
            tableDom.find("thead tr .stock").before(
                $("#eo_specificsThTpl").html()
                    .replace(":key",specificsField)
                    .replace(":specificsFieldPicture", specificsFieldPicture ? "specificsFieldPicture": "")
            );
            specificsFieldPicture = false;
            //增加td
            var i = 0;
            tableDom.find("tbody tr .stock").each(function(){
                var value = itemData.list[i].specifics[specificsField];
                if(!value){
                    value="";
                }
                $(this).before("<td><input name='specifics' value=':value' class='layui-input'></td>".replace(":value",value));
                i++;
            });
        });
//      //处理表格
//      itemData.list.forEach(function(subItemDatas){
//          var tableHtml = initItemTable(subItemDatas);
//      });
        //处理图片关联属性
        initPictureField($("#"+divDomId));
    }
    /**
     * 处理specifics
     * 1、转换成key-value形式
     * 2、返回每一项specifics的列名合集
     */
    function dealSpecifics(subItemDatas){
        var specificsFields = [];
        subItemDatas.forEach(function(subItemData){
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
        //处理ebay绑定图片specificsField优先
        var pictureSpecific = subItemDatas[0].pictureSpecific;
        if(pictureSpecific && pictureSpecific!=""){
            if(specificsFields.indexOf(pictureSpecific)>0){
                specificsFields.splice(specificsFields.indexOf(pictureSpecific),1);
                specificsFields.unshift(pictureSpecific);
            }
        }
        return specificsFields;
    }
    
    //增加一列属性(stock列之前)
    $('#eo_modifySkuDiv').on('click', '.addSpecificsBtn', function() {
        var tableDom = $(this).parents(".layui-colla-item").find("table");
        tableDom.find("thead tr .stock").before(
            $("#eo_specificsThTpl").html()
                .replace(":key","")
                .replace(":specificsFieldPicture","")
        );
        tableDom.find("tbody tr .stock").each(function(){
            $(this).before("<td><input name='specifics' class='layui-input'></td>");
        });
    });
    //删除specifics属性
    $('#eo_modifySkuDiv').on('click', '.delSpecificsBtn', function() {
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
        var layuiCollaTtemDom = $(this).parents(".layui-colla-item");
        //删除th
        $(this).parents("thead").find("th").eq(index).remove();
        //刷新图片关联属性
        initPictureField(layuiCollaTtemDom);
    });


    //使用商品sku
    $('#eo_modifySkuDiv').on('click', '.useProdSSkuBtn', function() {
        var tableDom = $(this).parents(".layui-colla-item").find("table");
        tableDom.find("tbody tr").each(function(){
            var prodSSku = $(this).find("input[name=prodSSku]").val();
            $(this).find("input[name=storeSubSku]").val(prodSSku);
        });
    });
    $('#eo_modifySkuDiv').on('blur', '.specificsField input[name=specifics]', function() {
        //刷新图片关联属性
        initPictureField($(this).parents(".layui-colla-item"));
    });

    
    // 增加一行(从最后一行copy一行)
    $('#eo_modifySkuDiv').on('click', '.addSkuBtn', function() {
        var tableDom = $(this).parents(".layui-colla-item").find("table");
        var lastTrDom = $(this).parents(".layui-colla-item").find("table tbody tr:last");
        tableDom.find("tbody").append("<tr>"+lastTrDom.html()+"</tr>");
        //初始化tr数据
        lastTrDom = $(this).parents(".layui-colla-item").find("table tbody tr:last");
        lastTrDom.find("input[name=upc]").val("");
        lastTrDom.find("input[name=ean]").val("");
        lastTrDom.find("input[name=imgUri]").val("");
        lastTrDom.find("img").attr("src", "");
        lastTrDom.find("input[name=specifics]").val("");
        lastTrDom.find("input[name=stock]").val("");
        lastTrDom.find("input[name=price]").val("");
        lastTrDom.find("input[name=storeSubSku]").val("");
        lastTrDom.find("input[name=status]").prop("checked", false);
        //注册本地图片上传
        eo_subSkuImgExchangeLocal(lastTrDom.find(".eo_subSkuImg_edit_local"));
        layui.form.render();
    });

    //修改价格
    $('#eo_modifySkuDiv').on('click', '.batchChangePriceBtn', function() {
        var operator = $(this).parents(".layui-inline").find("select[name=operator]").val();
        var deviation = $(this).parents(".layui-inline").find("input[name=deviation]").val();
        if(!deviation){
            layer.msg("数字有误");
            return;
        }
        deviation = parseFloat(deviation);
        $(this).parents(".layui-colla-item").find("tbody tr").each(function(){
            var price = parseFloat($(this).find("input[name=price]").val());
            if(operator == "="){
                price = (deviation).toFixed(2);
            }else if(operator == "+"){
                price = (price + deviation).toFixed(2);
            }else if(operator == "-"){
                price = (price - deviation).toFixed(2);
            }else if(operator == "*"){
                price = (price * deviation).toFixed(2);
            }else if(operator == "/"){
                price = (price / deviation).toFixed(2);
            }
            if(price<0){
                price=0;
            }
            $(this).find("input[name=price]").val(price);
        });
    });
    //修改在线数量
    $('#eo_modifySkuDiv').on('click', '.batchChangeStockBtn', function() {
        var operator = $(this).parents(".layui-inline").find("select[name=operator]").val();
        var deviation = $(this).parents(".layui-inline").find("input[name=deviation]").val();
        if(!deviation){
            layer.msg("数字有误");
            return;
        }
        deviation = parseFloat(deviation);
        $(this).parents(".layui-colla-item").find("tbody tr").each(function(){
            var stock = parseFloat($(this).find("input[name=stock]").val());
            if(operator == "="){
                stock = (deviation).toFixed(0);
            }else if(operator == "+"){
                stock = (stock + deviation).toFixed(0);
            }else if(operator == "-"){
                stock = (stock - deviation).toFixed(0);
            }else if(operator == "*"){
                stock = (stock * deviation).toFixed(0);
            }else if(operator == "/"){
                stock = (stock / deviation).toFixed(0);
            }
            $(this).find("input[name=stock]").val(stock);
        });
    });
    
    //提交修改
    $('#eo_modifySkuDiv').on('click', "#eo_modifySkuSaveBtn", function() {
        allItemSize=0;
        dealItemSize=0;
        if(timeUnit != null){
            clearInterval(timeUnit);//清除定时查询进度
        }
        console.log("保存数据");
        //封装对象
        var itemIds = [];
        var itemDatas = [];
        $("#eo_modifySkuDiv .layui-colla-item").each(function(){
            if($(this).find("input[name=itemId]").prop("checked")){
                var itemData = {};
                itemData.itemId = $(this).find("input[name=itemId]").val();
                itemIds.push(itemData.itemId);
                itemData.siteId = $(this).find("input[name=siteId]").val();
                itemData.storeAcctId = $(this).find("input[name=storeAcctId]").val();
                //选中的图片属性
                var specificsFieldPicture = $(this).find(".pictureFieldDiv input[class=pictureField]:checked").val();
                //子属性
                var subItemDatas = [];
                $(this).find("table tbody tr").each(function(){
                    var subItemData = {};
                    if($(this).find("input[name=imgUri]").val()){
                        subItemData.pictureUrl = $(this).find("input[name=imgUri]").val();
                    }
                    subItemData.stock = $(this).find("input[name=stock]").val();
                    subItemData.price = $(this).find("input[name=price]").val();
                    subItemData.storeSubSku = $(this).find("input[name=storeSubSku]").val();
                    if($(this).find("input[name=upc]").val()){
                        subItemData.upc = $(this).find("input[name=upc]").val();
                    }
                    if($(this).find("input[name=ean]").val()){
                        subItemData.ean = $(this).find("input[name=ean]").val();
                    }
                    subItemData.status = $(this).find("input[name=status]").prop("checked");
                    //specifics属性
                    var specifics = [];
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
                    subItemData.specifics = specifics.join(";");
                    if(subItemData.storeSubSku){
                        subItemDatas.push(subItemData);
                    }
                });
                itemData.list = subItemDatas;
                itemDatas.push(itemData);
            }
            allItemSize = itemIds.length;
        });
        if(itemDatas.length==0){
            layer.msg("未选择要修改的item", {icon:0});
            return;
        }
        console.log(itemDatas);
        //ajax请求
        layui.admin.load.show();
        $.ajax({
        	type:"post",
        	url: ctx + "/ebayIsEnableProduct/saveskuinfo.html",
        	dataType:"json",
        	data:{data:JSON.stringify(itemDatas)},
        	success:function(returnData){
        	    layui.admin.load.hide();
        	    if(returnData.code != "0000"){
        	        layer.msg(returnData.msg, {icon:2});
        	    }else{
        	        layer.msg(returnData.msg, {icon:1});
                    $(itemIds).each(function () {
                        var  tips = '<span style="color:green">' + "处理中" + "</span>";
                        $('#result_tips_' + this).html(tips);
                    });
                    timeUnit= setInterval(function () {
                        savesku_resultquery(itemIds);
                    }, 5000); //每间隔5s查询一次进度
        	    }
        	}
        });
    });


    //修改图片时监听 
    $('#eo_modifySkuDiv').on('change', "tbody input[name=imgUri]", function() {
        console.log("监听图片修改");
        //选中的图片属性
        var index = $(this).parents(".layui-colla-item").find(".specificsField")
            .index($(this).parents(".layui-colla-item").find(".specificsFieldPicture"));
        //debugger;
        if(index < 0){
            index=0;
        }
        //获取当前SKU图片绑定的specifics
        var specificsVal = $(this).parents("tr").find("input[name=specifics]").eq(index).val();
        if(!specificsVal || specificsVal == ""){
            return;
        }
        //将修改应用到所有相同specifics
        layer.msg("修改属性图片:"+specificsVal);
        var imgUri = $(this).val();
        $('#eo_modifySkuDiv tbody input[name=imgUri]').each(function(){
            if($(this).parents("tr").find("input[name=specifics]").eq(index).val() == specificsVal){
                $(this).val(imgUri);
                $(this).parent("div").find("img").attr("src", imgUri);
            }
        });
    });
    
    //全选反选
    form.on('checkbox(eo_selectAllFilter)', function(data){
      $('#eo_modifySkuDiv input[name=itemId]').prop("checked", data.elem.checked);
      layui.form.render("checkbox");
    });

    //选择图片关联属性，渲染表格
    form.on('radio(pictureField)', function(data){
        var currentField = data.value;
        //将其他radio取消选中
        $(data.elem).parents(".pictureFieldDiv").find(".pictureField").prop("checked", false);
        $(data.elem).prop("checked", true);
        layui.form.render("radio");
        $(data.elem).parents(".layui-colla-item")
            .find("table .specificsField")
            .removeClass("specificsFieldPicture");
        $(data.elem).parents(".layui-colla-item")
            .find("table .specificsField input[name='specifics'][value="+currentField+"]")
            .parent("th")
            .addClass("specificsFieldPicture");
        $(data.elem).parents(".layui-colla-item").find("table .specificsField input[name='specifics']").each(function(){
            if($(this).val() == currentField){
                $(this).parent("th").addClass("specificsFieldPicture");
            }
        });
    });

});
//从表格中加载图片
function initPictureField(parentDom){
    var currentField = parentDom.find("table .specificsFieldPicture input[name='specifics']").val();
    //获取pictureFields
    var specificsFields = [];
    parentDom.find("table .specificsField input[name='specifics']").each(function(){
        specificsFields.push($(this).val());
    });
    //更新dom
    parentDom.find(".pictureFieldDiv").empty();
    for(var specificsField of specificsFields){
        parentDom.find(".pictureFieldDiv").append('<input type="radio" class="pictureField" value="'+specificsField+'" title="'+specificsField+'" lay-filter="pictureField">')
    }
    //选中默认的
    if(currentField){
        parentDom.find(".pictureFieldDiv input[class=pictureField][value="+currentField+"]").prop("checked", true);
    }
    layui.form.render("radio");
}
//图片操作
function eo_subSkuImg_exchangeNet(obj) {
    console.log("上传子sku图片");
    var divDom = $(obj).parent("div");
    //prompt层
    layer.prompt({title : '填写网络图片url'}, function(text, index){
        if(text){
            layer.close(index);
            divDom.find("input[name=imgUri]").val(text);
            divDom.find("img").attr("src", text);
            divDom.find("input[name=imgUri]").trigger("change");
        }else{
            layer.msg("图片url不能为空");
        }
    });
}

function eo_initSubSkuImgExchangeLocal(){
    $(".eo_subSkuImg_edit_local").each(function () {//初始化本地按钮
        eo_subSkuImgExchangeLocal($(this));
    });
}

//初始化本地上传图片
function eo_subSkuImgExchangeLocal(obj) {
    var divDom = $(obj).parent("div");
    //上传本地图片
    $(obj).Huploadify({
        auto: true,
        fileTypeExts: '*.jpg;*.png;*.jpeg;*.JPG;*.JPEG;*.PNG;*.bmp;*.BMP;*.gif;',
        multi: true,
        fileSizeLimit: 2048,    //默认单位是KB
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
                divDom.find("input[name=imgUri]").val(data.msg);
                divDom.find("img").attr("src", data.msg);
                divDom.find("input[name=imgUri]").trigger("change");
            } else {
                layer.msg(data.msg);//这里面的内容不知道写啥,同OA系统
            }
        }
    });

}
var timeUnit;
var allItemSize=0;
var dealItemSize=0;
/**
 * 获取调整进度
 * @param itemIds
 */
function savesku_resultquery(itemIds){
    $.ajax({
        type: "POST",
        url: ctx + "/ebayIsEnableProduct/getSaveSkuInfoResult.html",
        data: {itemIds: itemIds.join(",")},
        dataType: "json",
        success: function (returnData) {
            console.log(returnData)
            if (returnData.code == "0000") {
                dealItemSize=0;
                $(itemIds).each(function () {
                    var tips = returnData.data[this] || ""; //默认等待中
                    if (tips.indexOf("处理成功") > -1) {
                        tips = '<span style="color:blue">' + tips + "</span>";
                        $('#result_tips_' + this).html(tips);
                    }else if(tips!=""){
                        dealItemSize++;
                        tips = '<span style="color:#FF5722">' + tips + "</span>";
                        $('#result_tips_' + this).html(tips);
                    }
                });
                if (dealItemSize == allItemSize) {//全部完成
                    clearInterval(timeUnit);//清除定时查询进度
                    console.log("已全部完成，清除定时任务");
                }
            }
        }
    });
}