/**
 * smt修改橱窗图
 */
var smt_replace_windowMap_addItemImage;//公共函数
var smt_first_addItemImage;
var getWaterMarkPicture;
var smt_add_water_mark;
var smt_show_templet_picture;//公共函数
var smt_checked_picture;
let smt_replace_windowMap_isFirst = true

layui.use(['admin', 'form', 'layer', 'formSelects', 'element', 'table', 'laypage','laytpl'], function () {
    var admin = layui.admin,
        form = layui.form,
        table=layui.table;
        layer = layui.layer,
        $ = layui.$;
        laytpl = layui.laytpl 
        form.render();
    render_hp_orgs_users("#smt_replace_windowMap_form");//渲染部门销售员店铺三级联动
    form.render(null, 'component-form-element');
    form.render(null, 'component-form-group');
    formSelects = layui.formSelects
    form.render('select');
    form.render('checkbox');
    form.render('radio');
    /**
     * 批量加水印
     */
    $("#smt_replace_first_pic_btn").click(function(){
        var itemData = table.checkStatus('smt_replace_windowMap_data_table').data; //获取选择的店铺
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
                    smt_add_water_mark(index,obj);
                }
            }
        })
    });

    //查询水印模板
    getWaterMarkPicture =  function getWaterMarkPicture(layero, index,storeAcctId){
        layui.form.render();
        $(layero).find('.layui-layer-content').html($("#smtPulish_info_add_water").html());
        $("#smtPulish_genListTpl select[name=watermarkImage]");
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
                    smtPublishInitWatermarkImage(data.data,"smtPulish_info_water")
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
                    smtPublishInitWatermarkFont(data.data,"smtPulish_info_water");
                },
                error : function (e) {
                    console.error(e);
                }
            }
        );
    }
    smt_add_water_mark = function(index,obj){
        var ulObj = $('#window_map_imgDiv_ul_' + obj.itemId);
        var firstObj = ulObj.find("li").first();
        var imgPath = firstObj.find("img").attr("src");
        var waterImageId = $("#smtPulish_info_water select[name=watermarkImage] option:selected").val();
        var waterFontId = $("#smtPulish_info_water select[name=watermarkFont] option:selected").val();
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
                platCode:"aliexpress"
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
    $("#batch_modify_main_picture_smt").click(function(){
        var itemData = table.checkStatus('smt_replace_windowMap_data_table').data; //获取选择的店铺
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
                    url: ctx + "/batchOperation/batchReplaceMainPic.html",
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
                    smt_add_water_mark(index,obj);
                }
            }
        })
    });

    /**
     * 批量修改橱窗图
     */
    $("#smt_replace_windowMap_bacthUpdate_btn").click(function(){
        dealItemSize=0;
        var itemData = table.checkStatus('smt_replace_windowMap_data_table').data;
        if (itemData == null || itemData.length < 1) {
            layer.msg("请选择lisiting",{icon:0});
            return;
        }

        var updateArray=[];
        for (var index in itemData) {
            var obj = itemData[index];
            var updateObj={};
            var imageArray=[];
            updateObj.itemId=obj.itemId;
            updateObj.storeAcct = obj.storeAcct;
            $('#window_map_imgDiv_ul_'+obj.itemId).find("img").each(function(){
                   var imageUrl=$(this).attr("src");
                   if(imageUrl != null && imageUrl != ''){
                       imageArray.push(imageUrl);
                   }
            });
            if(imageArray.length>6){
                layer.msg(obj.itemId+':橱窗图超过6张，请检查！')
                return;
            }else {
                updateObj.imageUrls = imageArray.join(";");
                updateArray.push(updateObj);
            }
        };
        loading.show();
        $.ajax({
            type: "POST",
            url: ctx + "/batchOperation/replaceWindowPriceSmt.html",
            data: {'updateArray':JSON.stringify(updateArray)},
            async: true,
            dataType: "json",
            success: function (data) {
                var trObj =  $('#smt_replace_windowMap_data_table').next().find('.layui-table-body tbody').find('tr');
                for(var i=0;i<trObj.length;i++){
                    var smt_itemid = trObj.eq(i).find('td').eq(2).find('div').text();
                    var msg = data.data[smt_itemid];

                    if(msg != undefined){
                        if(msg == "修改成功"){
                            trObj.eq(i).find('td').eq(4).find('.layui-table-cell').html("<div style='color:green'>" + msg + "</div>");
                        }else{
                            trObj.eq(i).find('td').eq(4).find('.layui-table-cell').html("<div style='color:red;posion: relative' class='errordata'>修改失败</div>");
                            trObj.eq(i).find('td').eq(4).find('.layui-table-cell').append("<textarea class='layui-hide'>"+msg+"</textarea>");
                        }
                    }
                }
                loading.hide();
            },
            error: function () {
                loading.hide()
                layer.msg("服务器正忙",{icon:2});
            }
        });
    });
    $('body').on('mouseover','.errordata',function(){
        var content = $(this).next("textarea").val()
        layer.tips(content, $(this), {
            time: 3000
        });
    })
    /**
     * 初始化时搜索
     */
    if ($("#smt_replace_windowMap_itemIds_hidden").length > 0) {
        replaceWindowMap_loadTable();
    };
    /**
     * 搜索
     */
    $("#smt_replace_windowMap_search_btn").click(function () {
        smt_replace_windowMap_isFirst = false
        replaceWindowMap_loadTable();
    });
    var imageurl;
    /**
     * 添加图片,先不着急转换，点击批量修改后转换
     */
    console.log(1)
    $("#smt_replace_windowMap_image_add_btn").click(function(){
          imageurl=$.trim($("#smt_replace_windowMap_image_input").val());
         if(imageurl ==null || imageurl ==''){
             layer.msg("图片地址不能为空",{icon:2});
             return ;
         }
        //判断复选框是否被选择
        var checkStatus = table.checkStatus('smt_replace_windowMap_data_table');
        if(checkStatus.data.length < 1){
            layer.msg("请选择数据");
            return;
        }
        $("#smt_replace_windowMap_tab_content").find("td").each(function () {
            if($(this).find('div').find('input').is(":checked")){
                if($(this).parent().find("ul").find("li").length<6){ //不超过6张
                    var lastObj=$(this).parent().find("ul").find("li").last();
                    var newObj= lastObj.clone();
                    $(newObj).find("img").attr("src",imageurl);
                    $(newObj).find("img").attr("name","add");//新增标识
                    lastObj.after(newObj);//添加新元素
                }
            }
        });
         /*$("#smt_replace_windowMap_tab_content").find("ul").each(function(){
             if($(this).find("li").length<10){ //不超过10张
                 var lastObj=$(this).find("li").last();
                 var newObj= lastObj.clone();
                 $(newObj).find("img").attr("src",imageurl);
                 lastObj.after(newObj);//添加新元素
             }
         })*/
    });
    /**
     * 还原
     */
    $('#smt_reback').click(function(){
        if(imageurl == undefined){
            layer.msg("没有添加图片")
        }else {
            //获取每行的最后一张的图片url
            $("#smt_replace_windowMap_tab_content").find("ul").each(function () {
                var lastObj = $(this).find("li").last();
                var lastUrl = lastObj.find("img").attr("src");
                if(imageurl == lastUrl){
                    var isAdd = lastObj.find("img").attr("name");//查看是否有新增标识
                    if(isAdd != undefined){
                        //存在新增标识删除最后一个元素
                        lastObj.remove();
                    }
                }
            })
        }
    });
    /**
     * 加载数据
     */
    var data = new Object();
    if(smt_arr.length > 0){
        data.idList=[];
        for (var i = 0; i < smt_arr.length; i++){
            //if($("#smt_online_online_num1_span").parents("li").hasClass("layui-this")){
            data.idList.push(smt_arr[i].id);
            /*}else{
             layer.msg("只能修改上架中商品");
             return;
             }*/
        }
        data.idList = data.idList.join(",");
    }
    if(smt_arr.length > 0){
        replaceWindowMap_loadTable(data);
    }
    function replaceWindowMap_loadTable(data){
        table.render({
            elem: "#smt_replace_windowMap_data_table",
            method: 'post',
            url: ctx + "/batchOperation/getListingImgs.html",
            where:data,
            height: 500,
            cols: [
                [
                    {checkbox:true,width:30},
                    { field: "storeAcct",title: "店铺" ,width:120, style:"vertical-align: top;"},
                    { field: "itemId",title: "item_id" ,width:120, style:"vertical-align: top;"},
                    { field: "pImgs",title: "橱窗图" , style:"vertical-align: top;", templet: '#smt_replace_windowMap_pImgs_tpl' },
                    { title: '操作结果',width:100, align: 'center', style:"vertical-align: top;", templet: '#smt_replace_windowMap_operate_tpl'},
                    { title: '首图加水印结果',width:100, align: 'center', style:"vertical-align: top;", templet: '#smt_replace_firste_tpl'}

                ],
            ],
            done: function(res, curr, count){
                if (res.code == '0000') {
                    $("#smt_replace_windowMap_num_span").html(res.count);//数量
                    $("#smt_replace_windowMap_itemIds_hidden").remove();
                    $(res.data).each(function (index, item) { //拖拽
                        var obj=$('#window_map_imgDiv_ul_'+this.itemId);
                        obj.sortable({
                            revert: true,
                            containment: "parent",
                            cursor: "move",
                        });
                        $('#window_map_operate_tips_' + this.itemId).html("");
                        $('#window_map_imgDiv_ul_'+this.itemId+",li").disableSelection();
                        uploadInit(item.itemId)
                    });
                }
            },
            id: "smt_replace_windowMap_data_table",
        });
    }
    $("#smt_replace_windowMap_search_btn").click(function () {
        var type = $(this).data('type');
        active[type] ? active[type].call(this) : '';
    });
    $("#smt_replace_windowMap_btn").click(function () {
        $("#smt_replace_windowMap_form input[name='sSku']").val('');
        formSelects.value('selectAttr', [])
    });
    console.log(1)
    var active = {
        reload: function () {
            var data = new Object();
            data.storeAcctIdList = [];
            data.sSkuList = [];
            data.pSkuList = [];
            var logisAttrContents = formSelects.value("selectAttr_store");
            for (var i = 0; i < logisAttrContents.length; i++) {
                var logisAttr = logisAttrContents[i].value;
                data.storeAcctIdList.push($.trim(logisAttr));
            }
            var skuStr = $.trim($("#smt_replace_windowMap_form input[name='skuList']").val());
            if($("#smtModImg_is_pAnds_sku").val() == 0){
                if(skuStr !="" && skuStr!=null){
                    data.sSkuList = $.trim(skuStr.split(","));
                }
            }else {
                if(skuStr !="" && skuStr!=null){
                    data.pSkuList = $.trim(skuStr.split(","));
                }
            }

            data.storeAcctIdList = $.trim(data.storeAcctIdList);
            var salepersonId = $.trim($("#smt_replace_windowMap_form select[name='saleName']").val());
            data.salepersonId = salepersonId;
            data.orgId = $.trim($("#smt_replace_windowMap_form select[name='orgId']").val());
            data.searchType = $("#smt_replaceWindowMap_pskuSearchType").val();//搜索类型
            replaceWindowMap_loadTable(data);
        }
    };
    /**
     * 打开模板图片
     */
    smt_show_templet_picture = function smt_replace_windowMap_addTplImg(prodPIds,itemId){
        const limit = 6
        const ulObj=$('#window_map_imgDiv_ul_'+itemId);
        const oripictLen = ulObj.find("li").length;
        let param = {
            prodPIds
        }
        if(smt_replace_windowMap_isFirst){
           const curItem= smt_arr.filter(item=>item.itemId==itemId)
           if(curItem.length && Array.isArray(curItem[0].prodSyncSmtDtos)){
                let allProdPSkus = curItem[0].prodSyncSmtDtos.map(item=>item.prodPSku)
                param = {
                    prodPSkus:[...new Set(allProdPSkus)]
                }               
           }
        }
        const params = {
            param,
            limit,
            existImgs: oripictLen,
            cb: function (tplUrlList) {
                if(Array.isArray(tplUrlList) && tplUrlList.length){
                    tplUrlList.forEach(item=>{
                        const lastObj=ulObj.find("li").last();
                        const newObj= lastObj.clone();
                        $(newObj).find("img").attr("src",item);
                        lastObj.after(newObj);//添加新元素
                    })
                }
            }
        }
        comPickImageTpl(params,'aliexpress')
    }
    /**
     * 添加每行item的图片
     */
     smt_replace_windowMap_addItemImage = function (itemId){
         var index = layer.open({
             type: 1,
             title: '添加lisiting图片-橱窗图不能超过6张',
             area: ['800px', '300px'],
             id: 'mainNetImgSuccess',
             content: '<div class="p20 pl20"><textarea class="layui-textarea" id="smt_replace_windowMap_addItem_url_input" placeholder="请填写URL,多个地址用回车换行"></textarea></div>',
             btn: ['确定', '关闭'],
             success: function (layero) {
                 form.render();
             },
             yes: function (index, layero) {
                 var url = $.trim($("#smt_replace_windowMap_addItem_url_input").val());
                 if (url == null || url == "") {
                     layer.msg("图片地址不能为空！", {icon: 5});
                     return false;
                 }
                 var urlArray = url.split("\n");
                 // 去一下空格
                 var ulObj=$('#window_map_imgDiv_ul_'+itemId);
                 for (var i in urlArray) {
                     var imageUrl = $.trim(urlArray[i]);
                     if(ulObj.find("li").length>5){
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
     * 点击图片选中checkbox
     * @param obj
     */
    smt_checked_picture = function (obj) {
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
smt_first_addItemImage = function (itemId,platAcctId){
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
            var waterImageId = $("#smtPulish_info_water select[name=watermarkImage] option:selected").val();
            var waterFontId =  $("#smtPulish_info_water select[name=watermarkFont] option:selected").val();
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
                    platCode:"aliexpress",
                    itemId:itemId
                },
                success:function(returnData){
                    layui.admin.load.hide();
                    console.log(returnData);
                    if(returnData.code != "0000"){
                        layer.msg(returnData.msg,{icon:2});
                        document.getElementById("window_first_picture_"+itemId).style.color="red";
                        $('#window_first_picture_'+itemId).text(returnData.msg)
                    }else{
                        document.getElementById("window_first_picture_"+itemId).style.color="green";
                        firstObj.find("img").attr("src",returnData.data);
                        $('#window_first_picture_'+itemId).text("添加成功")
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
function smt_replace_windowMap_delImg(obj) {
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


function smtPublishInitWatermarkImage(data,id) {
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



function smtPublishInitWatermarkFont(data,id ) {
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
        multi: true,
        fileSizeLimit: 2048,	//默认单位是KB
        buttonText: '本地图片',
        breakPoints: false,
        saveInfoLocal: false,
        showUploadedPercent: true,
        showUploadedSize: true,
        removeTimeout: 500,
        uploader: ctx + "/publish/smt/uploadPic.html",
        onSelect: function (files) {
            var $ul = $('#window_map_imgDiv_ul_'+domName);
            var $lis = $ul.find('li');
            if(files.length + $lis.length > 6){
                layer.msg('图片最多为6张!');
                return false;
            }
            return true;
        },
        onUploadSuccess: function (file, data, response) {
          let result =  JSON.parse(data);
            if(result.code=='9999'){
                layer.msg(result.msg);
                return false;
            }
            var url = result.msg;
            console.log('上传完成')
            var $ul = $('#window_map_imgDiv_ul_'+domName);
            var str = `<li style="padding: 5px 0;" class="window_map_imgLi">
                            <div class="window_map_imgDiv">
                                <img src="${url}" class="window_map_imgCss">
                            </div>
                            <div class="imgDivDown h20 "><a onclick="smt_replace_windowMap_delImg(this);" href="javascript:void(0);">移除</a></div>
                        </li>`;
            if($ul.find('li').length){
                $ul.find('li:last').after(str);
            }else{
                $ul.prepend(str);
            }
        }
    });
}