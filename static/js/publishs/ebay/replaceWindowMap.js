/**
 * ebay修改橱窗图
 */
var ebay_replace_windowMap_addItemImage;//公共函数
var ebay_first_addItemImage;
var getWaterMarkPicture;
var ebay_add_water_mark;
var ebay_show_templet_picture;//公共函数
var ebay_checked_picture;
layui.use(['admin', 'form', 'layer', 'formSelects', 'element', 'table', 'laypage'], function () {
    var admin = layui.admin,
        form = layui.form,
        table=layui.table;
        layer = layui.layer,
        $ = layui.$;
        form.render();
        var timeUnit;
        var allItemSize=0;
        var dealItemSize=0;

    /**
     * 批量加水印
     */
    $("#ebay_replace_first_pic_btn").click(function(){
        var itemData = table.checkStatus('ebay_replace_windowMap_data_table').data; //获取选择的店铺
        var storeAcctId;
        if (itemData == null || itemData.length < 1) {
            layer.msg("请选择lisiting",{icon:0});
            return;
        }else{
            for (var index in itemData) {
                if(storeAcctId){
                    if(storeAcctId !=itemData[index].storeAcctId){
                        layer.msg("不可将同一模板水印应用于不同店铺");
                        return;
                    }
                }else{
                    storeAcctId = itemData[index].storeAcctId;
                }
            };
        }
        var index = layer.open({
            type: 1,
            title: '首图添加水印',
            area: ['30%', '40%'],
            content: "",
            btn: ['添加'],
            success: function(layero, index) {
                getWaterMarkPicture(layero, index,storeAcctId);
            },
            yes: function(index, layero) {
                layui.admin.load.show();
                for (var index1 in itemData) {
                    var obj = itemData[index1];
                    ebay_add_water_mark(index,obj);
                }
            }
        })
    });

    //查询水印模板
    getWaterMarkPicture =  function getWaterMarkPicture(layero, index,storeAcctId){
        layui.form.render();
        $(layero).find('.layui-layer-content').html($("#ebayPic_info_add_water").html());
        $("#ebayPulish_genListTpl select[name=watermarkImage]");
        console.log(storeAcctId);
        $.ajax(
            {
                type:"post",
                url:ctx + "/watermark/searchWatermarkBySalePlatAcctId.html",
                dataType:"json",
                data:{
                    salesPlatAcctid : storeAcctId,
                    waterMarkType : 0
                },
                success:function (data) {
                    ebayPublishInitWatermarkImage(data.data,"ebayPulish_info_water")
                },
                error : function (e) {
                    console.error(e);
                }
            }
        );
        $.ajax(
            {
                type:"post",
                url:ctx + "/watermark/searchWatermarkBySalePlatAcctId.html",
                dataType:"json",
                data:{
                    salesPlatAcctid : storeAcctId,
                    waterMarkType : 1
                },
                success:function (data) {
                    ebayPublishInitWatermarkFont(data.data,"ebayPulish_info_water");
                },
                error : function (e) {
                    console.error(e);
                }
            }
        );
    }
    ebay_add_water_mark = function(index,obj){
        var ulObj = $('#window_map_imgDiv_ul_' + obj.itemId);
        var firstObj = ulObj.find("li").first();
        var imgPath = firstObj.find("img").attr("src");
        var waterImageId = $("#ebayPulish_info_water select[name=watermarkImage] option:selected").val();
        var waterFontId = $("#ebayPulish_info_water select[name=watermarkFont] option:selected").val();
        var watermarkIds = "";
        if (waterImageId && waterImageId != '') {
            watermarkIds = waterImageId;
        }
        if (waterFontId && waterFontId != '') {
            watermarkIds = watermarkIds + "," + waterFontId;
        }
        console.log(imgPath);
        console.log(watermarkIds);
        $.ajax({
            type: "post",
            url: ctx + "/watermark/getWatermarkImgPath.html",
            dataType: "json",
            data: {
                imgPath: imgPath,
                watermarkIds: watermarkIds,
                itemId:obj.itemId,
                platCode:"ebay"
            },
            success: function (returnData) {
                layui.admin.load.hide();
                console.log(returnData);
                if (returnData.code == "0000") {
                    layer.msg(returnData.msg+"添加成功");
                    //将新返回的水印图地址放进首图
                    var ulObj=$('#window_map_imgDiv_ul_'+returnData.msg);
                    var firstObj=ulObj.find("li").first();
                    firstObj.find("img").attr("src",returnData.data);
                    document.getElementById("window_first_picture_"+returnData.msg).style.color="green";
                    $('#window_first_picture_'+returnData.msg).text("添加成功")
                } else {
                    document.getElementById("window_first_picture_"+returnData.msg).style.color="red";
                    $('#window_first_picture_'+returnData.msg).text("添加失败")
                    layer.msg("添加失败");
                }
                layer.close(index);
            },
            error: function (XMLHttpRequest) {
                layer.close(index);
                layui.admin.load.hide();
                if (XMLHttpRequest.status == 200) {
                    layer.msg("请重新登录", {icon: 7});
                } else {
                    layer.msg("服务器错误");
                }
            }
        });
    }
    /**
     * 批量随机修改主图并添加水印（从模板选取主图）
     */
    $("#batch_modify_main_picture").click(function(){
        var itemData = table.checkStatus('ebay_replace_windowMap_data_table').data; //获取选择的店铺
        var storeAcctId;
        if (itemData == null || itemData.length < 1) {
            layer.msg("请选择lisiting",{icon:0});
            return;
        }else{
            for (var index in itemData) {
                if(storeAcctId){
                    if(storeAcctId !=itemData[index].storeAcctId){
                        layer.msg("不可将同一模板水印应用于不同店铺");
                        return;
                    }
                }else{
                    storeAcctId = itemData[index].storeAcctId;
                }
            };
        }
        var index = layer.open({
            type: 1,
            title: '选择水印模板并添加',
            area: ['30%', '40%'],
            content: "",
            btn: ['添加'],
            success: function(layero, index) {
                getWaterMarkPicture(layero, index,storeAcctId);
                var itemids = [];
                for (var index in itemData) {
                    var obj = itemData[index];
                    itemids.push(obj.itemId);
                };
                $.ajax({
                    type: "post",
                    url: ctx + "/ebayOnlineOperateController/batchReplaceMainPic.html",
                    dataType: "json",
                    data: {
                        itemids: JSON.stringify(itemids)
                    },
                    success: function (returnData) {
                        var imgdata = returnData.data;
                        imgdata.forEach(function(index1){
                            for (var index in itemData) {
                                var obj = itemData[index];
                                if(index1[obj.itemId]){
                                    var ulObj = $('#window_map_imgDiv_ul_' + obj.itemId);
                                    ulObj.find("li").first().find("img").attr("src",index1[obj.itemId]);
                                }
                            };
                        })
                    },
                    error: function (XMLHttpRequest) {
                        layui.admin.load.hide();
                        if (XMLHttpRequest.status == 200) {
                            layer.msg("请重新登录", {icon: 7});
                        } else {
                            layer.msg("服务器错误");
                        }
                    }
                });

            },
            yes: function(index, layero) {
                layui.admin.load.show();
                for (var index1 in itemData) {
                    var obj = itemData[index1];
                    ebay_add_water_mark(index,obj);
                }
            }
        })
    });





    /**
     * 批量修改橱窗图
     */
    $("#ebay_replace_windowMap_bacthUpdate_btn").click(function(){
        allItemSize=0;
        dealItemSize=0;
        if(timeUnit != null){
            clearInterval(timeUnit);//清除定时查询进度
        }
        var itemData = table.checkStatus('ebay_replace_windowMap_data_table').data; //获取选择的店铺
        if (itemData == null || itemData.length < 1) {
            layer.msg("请选择lisiting",{icon:0});
            return;
        }
        var itemIds = [];
        var updateArray=[];
        for (var index in itemData) {
            var obj = itemData[index];
            var updateObj={};
            var imageArray=[];
            updateObj.itemId=obj.itemId;
            $('#window_map_imgDiv_ul_'+obj.itemId).find("img").each(function(){
                   var imageUrl=$(this).attr("src");
                   if(imageUrl != null && imageUrl != ''){
                       imageArray.push(imageUrl);
                   }
            });
            if(imageArray.length>12){
                layer.msg(obj.itemId+':橱窗图超过12张，请检查！')
                return;
            }else {
                updateObj.imageUrls = imageArray.join(",");
                updateArray.push(updateObj);
                itemIds.push(obj.itemId);
                $('#window_map_operate_tips_' + obj.itemId).html("");
                allItemSize = itemIds.length;
            }
        };
        loading.show();
        $.ajax({
            type: "POST",
            url: ctx + "/ebayOnlineOperateController/batchUpdateImage.html",
            data: {'updateArray':JSON.stringify(updateArray)},
            async: true,
            dataType: "json",
            success: function (returnData) {
                loading.hide();
                if (returnData.code == "0000") {
                    layer.msg(returnData.msg,{icon:1});
                    timeUnit= setInterval(function () {
                        replaceWindowMap_getDealProcess(itemIds);
                    }, 5000); //每间隔5s查询一次进度
                } else {
                    layer.msg(returnData.msg,{icon:2});
                }
            },
            error: function () {
                loading.hide()
                layer.msg("服务器正忙",{icon:2});
            }
        });
    });

    /**
     * 获取调整进度
     * @param itemIds
     */
    function replaceWindowMap_getDealProcess(itemIds){
        $.ajax({
            type: "POST",
            url: ctx + "/ebayOnlineOperateController/getItemReplaceImageProcess.html",
            data: {itemIds: itemIds.join(",")},
            dataType: "json",
            success: function (returnData) {
                if (returnData.code == "0000") {
                    dealItemSize=0;
                    $(itemIds).each(function () {
                        var tips = returnData.data[this] || ""; //默认等待中
                        if (tips.indexOf("处理中") > -1) {
                            tips = '<span style="color:blue">' + tips + "</span>";
                        } else if (tips.indexOf("处理中") > -1) {
                            tips = '<span style="color:#1E9FFF">' + tips + "</span>";
                        } else if (tips.indexOf("成功") > -1) {
                            dealItemSize++;
                            tips = '<span style="color:green">' + tips + "</span>";
                        } else if (tips.indexOf("失败") > -1) {
                            dealItemSize++;
                            tips = '<span style="color:#FF5722">' + tips + "</span>";
                        }
                        $('#window_map_operate_tips_' + this).html(tips);
                    });
                    if (dealItemSize == allItemSize) {//全部完成
                        clearInterval(timeUnit);//清除定时查询进度
                        console.log("已全部完成，清除定时任务");
                    }
                }
            }
        });
    }
    /**
     * 初始化时搜索
     */
    if ($("#ebay_replace_windowMap_itemIds_hidden").length > 0) {
        replaceWindowMap_loadTable();
    };
    /**
     * 搜索
     */
    $("#ebay_replace_windowMap_search_btn").click(function () {
        replaceWindowMap_loadTable();
    });

    /**
     * 添加图片,先不着急转换，点击批量修改后转换
     */
    $("#ebay_replace_windowMap_image_add_btn").click(function(){
         var imageurl=$.trim($("#ebay_replace_windowMap_image_input").val());
         if(imageurl ==null || imageurl ==''){
             layer.msg("图片地址不能为空",{icon:2});
             return ;
         }
         $("#ebay_replace_windowMap_tab_content").find("ul").each(function(){
             if($(this).find("li").length<12){ //不超过10张
                 var lastObj=$(this).find("li").last();
                 var newObj= lastObj.clone();
                 $(newObj).find("img").attr("src",imageurl);
                 lastObj.after(newObj);//添加新元素
             }
         })
    });
    /**
     * 加载数据
     */
    function replaceWindowMap_loadTable(){
        table.render({
            elem: "#ebay_replace_windowMap_data_table",
            method: 'post',
            url: ctx + "/ebayOnlineOperateController/searchEbayProductBySkuOrItemIds.html",
            where: replaceWindowMap_getSerachData(),
            height: 500,
            cols: [
                [
                    {checkbox:true,width:30},
                    { field: "storeAcct",title: "店铺" ,width:120, style:"vertical-align: top;"},
                    { field: "itemId",title: "item_id" ,width:120, style:"vertical-align: top;"},
                    { field: "pimgs",title: "橱窗图" , style:"vertical-align: top;", templet: '#ebay_replace_windowMap_pImgs_tpl' },
                    { title: '操作结果',width:100, align: 'center', style:"vertical-align: top;", templet: '#ebay_replace_windowMap_operate_tpl'},
                    { title: '首图加水印结果',width:100, align: 'center', style:"vertical-align: top;", templet: '#ebay_replace_firste_tpl'}
                ],
            ],
            done: function(res, curr, count){
                if (res.code == '0000') {
                    $("#ebay_replace_windowMap_num_span").html(res.count);//数量
                    $("#ebay_replace_windowMap_itemIds_hidden").remove();
                    $(res.data).each(function (index, item) { //拖拽
                        var obj=$('#window_map_imgDiv_ul_'+this.itemId);
                        obj.sortable({
                            revert: true,
                            containment: "parent",
                            cursor: "move",
                        });
                        $('#window_map_operate_tips_' + this.itemId).html("");
                        $('#window_map_imgDiv_ul_'+this.itemId+",li").disableSelection();
                        //调用公共方法
                        uploadInit(item.itemId)
                    });
                }
            },
            id: "ebay_replace_windowMap_data_table",
        });
    }

    /**
     * 获取检索数据
     */
    function replaceWindowMap_getSerachData(){
        var obj = {};
        obj.isOffline = 0;//上架的
        var prodPSku = $.trim($("#ebay_replace_windowMap_storePSku_input").val());
        obj.prodPSku = prodPSku;
        if ($("#ebay_replace_windowMap_itemIds_hidden").length > 0) {
            var itemIds = $("#ebay_replace_windowMap_itemIds_hidden").val();
            obj.itemIds = itemIds;
        }
        obj.searchType = $("#ebay_replaceWindowMap_pskuSearchType").val();//搜索类型
        return obj;
    };

    /**
     * 添加每行item的图片
     */
     ebay_replace_windowMap_addItemImage = function (itemId){
         var index = layer.open({
             type: 1,
             title: '添加lisiting图片-橱窗图不能超过12张',
             area: ['800px', '300px'],
             id: 'mainNetImgSuccess',
             content: '<div class="p20 pl20"><textarea class="layui-textarea" id="ebay_replace_windowMap_addItem_url_input" placeholder="请填写URL,多个地址用回车换行"></textarea></div>',
             btn: ['确定', '关闭'],
             success: function (layero) {
                 form.render();
             },
             yes: function (index, layero) {
                 var url = $.trim($("#ebay_replace_windowMap_addItem_url_input").val());
                 if (url == null || url == "") {
                     layer.msg("图片地址不能为空！", {icon: 5});
                     return false;
                 }
                 var urlArray = url.split("\n");
                 // 去一下空格
                 var ulObj=$('#window_map_imgDiv_ul_'+itemId);
                 for (var i in urlArray) {
                     var imageUrl = $.trim(urlArray[i]);
                     if(ulObj.find("li").length>11){
                         layer.msg('图片最多为12张!');
                         layer.close(index);
                         return ;
                     }
                     var lastObj=ulObj.find("li").last();
                     var newObj= lastObj.clone();
                     $(newObj).find("img").attr("src",imageUrl);
                     lastObj.after(newObj);//添加新元素
                 }
                 layer.close(index);
             },
             end:function(){
                 layer.close(index);
             },
         });
    }

    /**
     * 打开模板图片
     */
    ebay_show_templet_picture = function (prodPId,itemId){
        console.log(prodPId)
        var index = layer.open({
            type: 1,
            title: '选择模板图片添加-橱窗图不能超过12张',
            area: ['1200px', '500px'],
            id: 'templetImgSuccess',
            content: '<form id="ebay_picture_form" class="layui-form"><div style="width:1200px;height:80px;float:left;dispaly:block;"><label class="layui-form-label">主图:</label>' +
                '                <ul class="" id="main_picture">' +
                '               </ul></div><br>'+
                '              <div style="width:1200px;height:80px;float:left;dispaly:block;"><label class="layui-form-label">辅图:</label>' +
                '                    <ul class="" id = "ass_picture">' +
                '              </ul></div></form>' +
                '',
            btn: ['确定', '关闭'],
            success: function (layero) {
                $.ajax({
                        beforeSend: function(){
                            loading.show();
                        },
                        type: "POST",
                        url: ctx + "/publish/getprodImg.html",
                        data: {prodPId:prodPId},
                        dataType: "json",
                        success: function (returnData) {
                            loading.hide(returnData.data);
                            if (returnData.code == "0000") {
                                console.log(returnData)
                                var mainObj = $("#main_picture");
                                var assObj = $("#ass_picture");
                                var mainHtml = '';
                                var assHtml = '';
                                if(returnData.data!=null && returnData.data.length != 0){
                                    var imgarr = returnData.data
                                    for(var i in imgarr){
                                        if(imgarr[i].isMain == true){
                                            mainHtml +='<li style="padding: 5px 0;" class="window_map_imgLi">' +
                                                '                        <div class="window_map_imgDiv">' +
                                                '                            <input type="checkbox" name="check_picture" value="'+imgarr[i].name+'"/><img src="'+imgarr[i].name+'" onclick="ebay_checked_picture(this)"  class="templet_map_imgCss">' +
                                                '                        </div>' +
                                                '                    </li>';
                                        }
                                        if(imgarr[i].isAssist == true){
                                            assHtml +='<li style="padding: 5px 0;" class="window_map_imgLi">' +
                                                '                        <div class="window_map_imgDiv">' +
                                                '                            <input value="'+imgarr[i].name+'" name="check_picture" type="checkbox"/><img src="'+imgarr[i].name+'" onclick="ebay_checked_picture(this)"   class="templet_map_imgCss">' +
                                                '                        </div>' +
                                                '                    </li>';
                                        }

                                    }
                                    mainObj.append(mainHtml);
                                    assObj.append(assHtml);
                                }
                                form.render('checkbox')
                            } else {
                                layer.close(index);
                                layer.msg(returnData.msg);
                            }
                        },
                        error: function () {
                            loading.hide();
                            layer.msg("服务器正忙");
                        }
                    }
                )
                form.render('checkbox');
            },
            yes: function (index, layero) {
                var ulObj=$('#window_map_imgDiv_ul_'+itemId);
                var oripictLen = ulObj.find("li").length;
                var templetPic = [];
                $("#ebay_picture_form input[type=checkbox]:checked").each(function() {
                    var name = $(this).val();
                    templetPic.push(name);
                });
                for (var i in templetPic) {
                    var imageUrl = $.trim(templetPic[i]);
                    var lastObj=ulObj.find("li").last();
                    var newObj= lastObj.clone();
                    $(newObj).find("img").attr("src",imageUrl);
                    lastObj.after(newObj);//添加新元素
                }
                layer.close(index);
            },
            end:function(){
                layer.close(index);
            },
        });
    }

    /**
     * 点击图片选中checkbox
     * @param obj
     */
    ebay_checked_picture = function (obj) {
        var isCheck =  $(obj).parents().children("input[type=checkbox]").is(":checked");
        if(isCheck){
            $(obj).parents().children("input[type=checkbox]").prop("checked", false);
        }else{
            $(obj).parents().children("input[type=checkbox]").prop("checked", true);
        }
        form.render('checkbox');
    }
});
/**
 * 添加首图加上水印
 */
ebay_first_addItemImage = function (itemId,platAcctId){
    var ulObj=$('#window_map_imgDiv_ul_'+itemId);
    var firstObj=ulObj.find("li").first();
    var src = firstObj.find("img").attr("src");
    var index = layer.open({
        type: 1,
        title: '首图添加水印',
        area: ['30%', '40%'],
        content: "",
        btn: ['添加'],
        success: function(layero, index) {
            getWaterMarkPicture(layero, index,platAcctId);
        },
        yes: function(index, layero){
            layui.admin.load.show();
            var imgPath= src;
            var waterImageId = $("#ebayPulish_info_water select[name=watermarkImage] option:selected").val();
            var waterFontId =  $("#ebayPulish_info_water select[name=watermarkFont] option:selected").val();
            var watermarkIds = "";
            if ( waterImageId && waterImageId != '') {
                watermarkIds = waterImageId;
            }
            if (waterFontId && waterFontId!=''){
                watermarkIds = watermarkIds + "," + waterFontId;
            }
            console.log(imgPath);
            console.log(watermarkIds);
            $.ajax({
                type:"post",
                url:ctx + "/watermark/getWatermarkImgPath.html",
                dataType:"json",
                data:{
                    imgPath : imgPath,
                    watermarkIds:watermarkIds,
                    platCode:"ebay",
                    itemId:itemId
                },
                success:function(returnData){
                    layui.admin.load.hide();
                    console.log(returnData);
                    if(returnData.code != "0000"){
                        layer.msg(returnData.msg,{icon:2});
                    }else{
                        firstObj.find("img").attr("src",returnData.data);
                    }
                    layer.close(index);
                },
                error: function (XMLHttpRequest) {
                    layui.admin.load.hide();
                    if(XMLHttpRequest.status == 200){
                        layer.msg("请重新登录",{icon:7});
                    }else{
                        layer.msg("服务器错误");
                    }
                }
            });
        },
        end:function(){
            layer.close(index);
        },
    })
}


/**
 * 橱窗图删除
 * @param obj
 */
function ebay_replace_windowMap_delImg(obj) {
    var oripictLen =$(obj).parents().children('li').length;
    if(oripictLen<=1){
        layer.msg("至少保留一张图片！");
        return;
    }
    $(obj).closest('li').remove();
    // var index = layer.confirm('您确认要删除图片？', {icon: 3, title: '提示'}, function () {
    //     layer.close(index);
    //     $(obj).closest('li').remove();
    // });
}


function ebayPublishInitWatermarkImage(data,id) {
    $("#"+id+" select[name=watermarkImage]").empty();
    if(data) {
        data.forEach(function (val, index) {
            var watermarkName = val.watermarkTemplateName;
            var watermarkId = val.id;
            var optionTpl = "<option value=':watermarkId'>:watermarkName</option>";
            optionTpl = optionTpl.replace(":watermarkId", watermarkId);
            optionTpl = optionTpl.replace(":watermarkName", watermarkName);
            $("#"+id+" select[name='watermarkImage']").append(optionTpl);
        });
        $("#"+id+" select[name='watermarkImage']").append("<option value='' selected>请选择</option>");
        layui.form.render();
    }
}



function ebayPublishInitWatermarkFont(data,id ) {
    $("#"+id+" select[name=watermarkFont]").empty();
    if(data) {
        data.forEach(function (val, index) {
            var watermarkName = val.watermarkTemplateName;
            var watermarkId = val.id;
            var optionTpl = "<option value=':watermarkId'>:watermarkName</option>";
            optionTpl = optionTpl.replace(":watermarkId", watermarkId);
            optionTpl = optionTpl.replace(":watermarkName", watermarkName);
            $("#"+id+" select[name=watermarkFont]").append(optionTpl);
        });
        $("#"+id+" select[name=watermarkFont]").append("<option value='' selected>请选择</option>");
        layui.form.render();
    }
}



function uploadInit(domName){
    $("#"+domName).Huploadify({
        auto: true,
        fileTypeExts: '*.jpg;*.png;*.jpeg;*.JPG;*.JPEG;*.PNG;*.bmp;*.BMP;*.gif;',
        multi: false,
        fileSizeLimit: 2048,	//默认单位是KB
        buttonText: '本地图片',
        breakPoints: false,
        saveInfoLocal: false,
        showUploadedPercent: true,
        showUploadedSize: true,
        removeTimeout: 500,
        uploader: ctx + "/publish/uploadPic.html",
        onSelect: function (files) {
            var $ul = $('#window_map_imgDiv_ul_'+domName);
            var $lis = $ul.find('li');
            if($lis.length >=12){
                layer.msg('图片最多为12张!');
                console.log('选择完成')
                return false;
            }
            return true;
        },
        onUploadSuccess: function (file, data, response) {

            if(data.code==='9999'){
                layer.msg(data.msg);
                return false;
            }
            var url = JSON.parse(data).msg;
            var $ul = $('#window_map_imgDiv_ul_'+domName);
            var str = `<li style="padding: 5px 0;" class="window_map_imgLi">
                            <div class="window_map_imgDiv">
                                <img src="${url}" class="window_map_imgCss">
                            </div>
                            <div class="imgDivDown h20 "><a onclick="ebay_replace_windowMap_delImg(this);" href="javascript:void(0);">移除</a></div>
                        </li>`;
            $ul.append(str);
        }

    });



}