/**
 * shopee修改图片
 */
var shopee_replace_windowMap_addItemImage;//公共函数
var show_templet_picture;//公共函数
var shopee_first_addItemImage;//公共函数
var getWaterMarkPicture;
var shopee_add_water_mark;
var checked_picture;
var checked_main_picture;
var checked_ass_picture;
layui.use(['admin', 'form', 'layer', 'formSelects', 'element', 'table', 'laypage'], function () {
    var admin = layui.admin,
        form = layui.form,
        table=layui.table,
        layer = layui.layer,
        formSelects = layui.formSelects,
        $ = layui.$;
        form.render();
    render_hp_orgs_users("#shopee_replace_img_form");//渲染部门销售员店铺三级联动

    var data = {};
    if(shop_arr.length > 0){
        data.idList=[];
        for(var i = 0; i<shop_arr.length; i++){
            data.idList.push(shop_arr[i].id);
        }
        data.idList = data.idList.join(",");
    }
    if(shop_arr.length > 0){
        replaceWindowMap_loadTable(data);
    }

    /**
     * 批量加水印
     */
    $("#shopee_replace_first_pic_btn").click(function(){
        var itemData = table.checkStatus('shopee_replace_img_table').data; //获取选择的店铺
        var storeAccts;
        if (itemData == null || itemData.length < 1) {
            layer.msg("请选择lisiting",{icon:0});
            return;
        }else{
            storeAccts = [];
            for (var index in itemData) {
                if(storeAccts.indexOf(itemData[index].storeAcctId)<=-1){
                    storeAccts.push(itemData[index].storeAcctId);
                }
            };
        }
        var index = layer.open({
            type: 1,
            title: '首图批量添加水印',
            area: ['700px', '700px'],
            content: $('#shopee_replace_imgs_batch_add_water').html(),
            btn: ['添加','取消'],
            success: function(layero, index) {
                commonReturnPromise({
                    url:ctx + "/shopee/shoppeWatermark/searchWatermarkBySalePlatAcctIds.html",
                    params:JSON.stringify(storeAccts),
                    type:'post',
                    contentType:'application/json;charset=utf-8',
                }).then(res=>{
                    table.render({
                        elem: "#shopee_replace_imgs_batch_add_water_table",
                        data: res,
                        height: 500,
                        limit:9999999,
                        cols: [
                            [
                                { field: "storeAcct",title: "店铺" ,width:150, style:"vertical-align: top;", templet: '#shopee_replace_imgs_batch_add_water_storeAcct_tpl'},
                                { field: "waterImageId",title: "图片水印" , style:"vertical-align: top;", templet: '#shopee_replace_imgs_batch_add_water_image_tpl' },
                                { field: "waterFontId",title: "文字水印" , style:"vertical-align: top;", templet: '#shopee_replace_imgs_batch_add_water_font_tpl' },
            
                            ],
                        ],
                        done: function(res, curr, count){
                            // 当选择图片水印后，文字水印下拉框不可点击
                            form.on('select(shopee_replace_imgs_batch_add_water_image)', function(data){
                                console.log(data.elem); //得到select原始DOM对象
                                console.log(data.value); //得到被选中的值
                                console.log(data.othis); //得到美化后的DOM对象
                                const {value,elem} =data
                                const $trDom = $(elem).parents('tr')
                                const $waterFontDom = $trDom.find('select[name=waterFont]')
                                $waterFontDom.attr('disabled', value===''?false:true)
                                $waterFontDom.val('')
                                form.render('select')
                              }); 
                            // 当选择文字水印后，图片水印下拉框不可点击
                              form.on('select(shopee_replace_imgs_batch_add_water_font)', function(data){
                                const {value,elem} =data
                                const $trDom = $(elem).parents('tr')
                                const $waterImageDom = $trDom.find('select[name=waterImage]')
                                $waterImageDom.attr('disabled', value===''?false:true)
                                $waterImageDom.val('')
                                form.render('select')
                              }); 
                        },
                        id: "shopee_replace_imgs_batch_add_water_table_id",
                    })
                })
            },
            yes: function(index, layero) {
                // 点击校验存在至少一个店铺选中至少一条水印
               const $trDomList = $('#shopee_replace_imgs_batch_add_water_table').next().find('tbody tr')
               let storeWaterObj = {}
               $trDomList.each(function(){
                   const storeAcctId = $(this).find('input[name=storeAcctId]').val()
                   const waterImageId = $(this).find('select[name=waterImage]').val()
                   const waterFontId = $(this).find('select[name=waterFont]').val()
                if(waterImageId){
                    storeWaterObj[storeAcctId] = waterImageId
                }
                if(waterFontId){
                    storeWaterObj[storeAcctId] = waterFontId
                }
               })
               if(!Object.keys(storeWaterObj).length) return layer.msg('请选择需添加的店铺及水印')

               let params = []
               itemData.forEach(item=>{
                const ulObj = $('#window_map_imgDiv_ul_' + item.itemId);
                const firstObj = ulObj.find("li").first();
                const imgPath = firstObj.find("img").attr("src");
                if(storeWaterObj[item.storeAcctId]){
                    params.push({
                        imgPath,
                        itemId:item.itemId,
                        platCode:item.platCode,
                        storeAcctId:item.storeAcctId,
                        watermarkIds:storeWaterObj[item.storeAcctId]
                    })
                }
               })
               
               commonReturnPromise({
                url:ctx + "/shopee/shoppeWatermark/batchGetWatermarkImgPath",
                params:JSON.stringify(params),
                type:'post',
                contentType:'application/json;charset=utf-8',
            }).then(res=>{
                let msgStr =''
                let successTotal = res.filter(item=>item.success).length
                let failTotal = res.filter(item=>!item.success).length
                if(successTotal){
                    msgStr = successTotal + '个店铺首图水印添加成功；'
                }
                if(failTotal){
                    msgStr =msgStr+ failTotal + '个店铺首图水印添加失败；'
                }
                layer.alert(msgStr, {icon: 1}); 
                // layer.msg(msgStr,{icon:1})
                //将新返回的水印图地址放进首图
                res.forEach(item=>{
                    const ulObj=$('#window_map_imgDiv_ul_'+item.itemId);
                    const firstObj=ulObj.find("li").first();
                    if(item.success){
                        firstObj.find("img").attr("src",item.url);
                        document.getElementById("window_first_picture_"+item.itemId).style.color="green";
                        $('#window_first_picture_'+item.itemId).text("添加成功")
                    }else{
                        document.getElementById("window_first_picture_"+item.itemId).style.color="red";
                        $('#window_first_picture_'+item.itemId).text(item.errorMsg||'添加失败')
                    }
                })
                layer.close(index)
            })
            }
        })
    });

    //查询水印模板
    getWaterMarkPicture =  function getWaterMarkPicture(layero, index,storeAccts){
        layui.form.render();
        $(layero).find('.layui-layer-content').html($("#shopeePulish_info_add_water").html());
        $("#shopeePulish_genListTpl select[name=watermarkImage]");
        var obj = new  Object();
        obj.storeAcctIds = storeAccts.join(',');
        console.log(obj.storeAcctIds);
        commonReturnPromise({
            url:ctx + "/shopee/shoppeWatermark/searchWatermarkBySalePlatAcctIds.html",
            params:JSON.stringify(storeAccts),
            type:'post',
            contentType:'application/json;charset=utf-8',
        }).then(res=>{
            shopeePublishInitWatermarkImage(res[0],"shopeePulish_info_water")
        })
    }
    shopee_add_water_mark = function(index,obj){
        var ulObj = $('#window_map_imgDiv_ul_' + obj.itemId);
        var firstObj = ulObj.find("li").first();
        var imgPath = firstObj.find("img").attr("src");
        var waterImageId = $("#shopeePulish_info_water select[name=watermarkImage] option:selected").val();
        var waterFontId = $("#shopeePulish_info_water select[name=watermarkFont] option:selected").val();
        var watermarkIds = "";
        if (waterImageId && waterImageId != '') {
            watermarkIds = waterImageId;
        }
        if (waterFontId && waterFontId != '') {
            watermarkIds = watermarkIds + "," + waterFontId;
        }
        $.ajax({
            type: "post",
            url: ctx + "/shopee/shoppeWatermark/getWatermarkImgPath.html",
            // dataType: "json",
            contentType:'application/json;charset=utf-8',
            data: JSON.stringify({
                imgPath: imgPath,
                watermarkIds: watermarkIds,
                itemId:obj.itemId,
                platCode:"shopee",
                storeAcctId:obj.storeAcctId
            }),
            success: function (returnData) {
                layui.admin.load.hide();
                if (returnData.code == "0000") {
                    layer.msg(returnData.msg + "添加成功");
                    //将新返回的水印图地址放进首图
                    var ulObj=$('#window_map_imgDiv_ul_'+returnData.msg);
                    var firstObj=ulObj.find("li").first();
                    firstObj.find("img").attr("src",returnData.data);
                    document.getElementById("window_first_picture_"+returnData.msg).style.color="green";
                    $('#window_first_picture_'+returnData.msg).text("添加成功")
                } else {
                    document.getElementById("window_first_picture_"+obj.itemId).style.color="red";
                    $('#window_first_picture_'+obj.itemId).text("添加失败")
                    // layer.msg("添加失败");
                    layer.msg(returnData.msg,{icon:2})
                }
                // layer.close(index);
            },
            error: function (XMLHttpRequest) {
                // layer.close(index);
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
        var itemData = table.checkStatus('shopee_replace_img_table').data; //获取选择的店铺
        var storeAccts = [];
        if (itemData == null || itemData.length < 1) {
            layer.msg("请选择lisiting",{icon:0});
            return;
        }else{
            for (var index in itemData) {
                if(storeAccts.indexOf(itemData[index].storeAcctId)<=-1){
                    storeAccts.push(itemData[index].storeAcctId);
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
                getWaterMarkPicture(layero, index,storeAccts);
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
                    shopee_add_water_mark(index,obj);
                }
            }
        })
    });

    // 重新生成首图
    $('#shopee_replace_generate_first_pic_btn').click(function(){
        var data = table.checkStatus('shopee_replace_img_table').data; 
        if (data.length < 1) {
            layer.msg("请选择lisiting",{icon:0});
            return;
        }
        shopeeReplace_generatePic({type:"firstPic", data})
    })

     // 重新生成橱窗图
     $('#shopee_replace_generate_window_pic_btn').click(function(){
        var data = table.checkStatus('shopee_replace_img_table').data;
        if (data.length < 1) {
            layer.msg("请选择lisiting",{icon:0});
            return;
        }
        shopeeReplace_generatePic({type:"windowPic", data})
    })

    function shopeeReplace_generatePic({type,data}){
        const params = data.map(v=>({itemId:v.itemId}))
        commonReturnPromise({
            url: '/lms/shopee/onlineProductShopee/regenerateImage',
            type:'post',
            contentType:'application/json',
            params:JSON.stringify(params)
        }).then(res=>{
            loading.show()
            res.forEach(v=>{
                var ulObj = $('#window_map_imgDiv_ul_' + v.itemId);
                var firstObj = ulObj.find("li").first();
                // 替换图片
                if(type==='firstPic' && v.firstImage){
                    firstObj.find("img").attr("src",v.firstImage)
                }else if(type === 'windowPic' && v.otherImages && v.otherImages.length){
                    const firstImage = firstObj.find("img").attr("src")
                    v.otherImages.unshift(firstImage)
                    ulObj.empty()
                    const newWindowPicHtml = v.otherImages.slice(0,9).map(item=>`
                    <li style="padding: 5px 0;" class="window_map_imgLi draggable="true"">
                        <div class="window_map_imgDiv">
                            <img class="window_map_imgCss img_show_hide lazy" src="${item}" data-original="${item}" style="display: block;" data-onerror="layui.admin.img_noFind()">
                        </div>
                        <div class="imgDivDown h20 "><a onclick="shopee_replace_windowMap_delImg(this);" href="javascript:void(0);">移除</a></div>
                    </li>`
                    ).join("")
                    ulObj.append(newWindowPicHtml)
                }
            })
            loading.hide()
            const emptyImageStr = res.filter(v=>!v.success).map(v=>v.itemId+':'+v.message).join(';')
            if(emptyImageStr){
                layer.alert(emptyImageStr, {icon: 7}); 
            }else{
                layer.msg('操作成功',{icon:1})
            }
        })
    }

    /**
     * 批量修改
     */
    $("#shopee_replace_windowMap_bacthUpdate_btn").click(function(){
        var itemData = table.checkStatus('shopee_replace_img_table').data; //获取选择的店铺
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
            if(imageArray.length>9){
                layer.msg(obj.itemId+':橱窗图超过9张，请检查！')
                return;
            }else{
                updateObj.imageUrls=imageArray.join(",");
                updateArray.push(updateObj);
                itemIds.push(obj.itemId);
                $('#window_map_operate_tips_' + obj.itemId).html("");
                allItemSize=itemIds.length;
            }
        };
        loading.show();
        //以当前时间戳作为批次号
        var batchNo = new Date().getTime();
        $.ajax({
            type: "POST",
            url: ctx + "/shopee/shopeeIsEnableProduct/updateItemImg.html",
            data: {'updateArray':JSON.stringify(updateArray),'batchNo':batchNo},
            async: true,
            dataType: "json",
            success: function (returnData) {
                loading.hide()
                if (returnData.code == "0000") {
                    layer.msg("操作成功,稍等片刻为您显示操作结果");
                    setTimeout(function(){
                        loading.hide();
                        layer.msg(returnData.msg);
                    },3000);
                    ImgtimeUnit = setInterval(function () {
                        sel(batchNo)
                    }, 5000);
                } else {
                    layer.msg(returnData.msg,{icon:2})
                }
            },
            error: function () {
                loading.hide()
                layer.msg("服务器正忙");
            }
        });
    });

    function sel(batchNo){
        var trObj =  $('#shopee_replace_img_table').next().find('.layui-table-body tbody').find('tr');
        var count = 0;
        for (var i = 0; i < trObj.length; i++) {
            var checkStat = trObj.eq(i).find('td').eq(0).find('div').find('input').is(":checked");
            var resultMsg = trObj.eq(i).find('td').eq(5).find('.layui-table-cell').find('div').text();
            if ((resultMsg == '' || resultMsg == null) && checkStat) {
                count++;
            }
        }
        if(count == 0){
            console.log("清楚定時")
            clearInterval(ImgtimeUnit);
            return;
        }
        $.ajax({
            type: "POST",
            url: ctx + "/shopee/shopeeIsEnableProduct/selectResult.html",
            data: {'batchNo':batchNo},
            async: true,
            dataType: "json",
            success: function (returnData) {
                if (returnData.code == "0000") {
                    var data = returnData.data;

                    for (var i = 0; i < trObj.length; i++) {
                        var itemId = $.trim(trObj.eq(i).find('td').eq(2).find('.itemid').text());//平台商品Id
                        var checkStat = trObj.eq(i).find('td').eq(0).find('div').find('input').is(":checked");
                        var resultMsg = trObj.eq(i).find('td').eq(5).find('.layui-table-cell').find('div').text();

                        var logMsg = data['TR_SHOPEE_UPDATE_IMGS' + itemId ];
                        if ((resultMsg == '' || resultMsg == null) && checkStat) {
                            if (logMsg == '修改成功') {
                                trObj.eq(i).find('td').eq(5).find('.layui-table-cell').html("<div style='color:blue'>" + logMsg + "</div>");
                            } else if (logMsg != '' && logMsg != null && logMsg != 'undefined') {
                                trObj.eq(i).find('td').eq(5).find('.layui-table-cell').html("<div style='color:red'>" + logMsg + "</div>");
                            }
                        }
                    }
                }
            },
            error: function () {
                layer.msg("服务器正忙");
                clearInterval(ImgtimeUnit);
            }
        });
    }
    /**
     * 初始化时搜索
     */
    if ($("#shopee_replace_windowMap_itemIds_hidden").length > 0) {
        replaceWindowMap_loadTable(replaceShopeeImg_getSerachData());
    };
    /**
     * 搜索
     */
    $("#shopee_replace_windowMap_search_btn").click(function () {
        replaceWindowMap_loadTable(replaceShopeeImg_getSerachData());
    });
    var imageurl;
    /**
     * 添加图片,先不着急转换，点击批量修改后转换
     */
    $("#shopee_replace_windowMap_image_add_btn").click(function(){
        //点击添加保存图片url
         imageurl = $.trim($("#shopee_replace_windowMap_image_input").val());
         if(imageurl ==null || imageurl ==''){
             layer.msg("图片地址不能为空",{icon:2});
             return ;
         }
         //判断复选框是否被选择
        var checkStatus = table.checkStatus('shopee_replace_img_table');
        if(checkStatus.data.length < 1){
            layer.msg("请选择数据");
            return;
        }
        $("#shopee_replace_windowMap_tab_content").find("td").each(function () {
            if($(this).find('div').find('input').is(":checked")){
                let ulObj = $(this).parent().find("ul");
                let lastObj=$(this).parent().find("ul").find("li").last();
                let newObj= lastObj.clone();
                $(newObj).find("img").attr("src",imageurl);
                $(newObj).find("img").attr("name","add");//新增标识
                if($(this).parent().find("ul").find("li").length>=9){ //不超过9张
                  layer.confirm('此次修改部分listing图片数量大于九张,是否倒序删除至仅保留九张图片?', {icon: 3, title:'提示'}, function(index){
                    lastObj.remove();
                    ulObj.prepend(newObj);//添加新元素
                    layer.close(index);
                  });
                }else{ //高于九张
                  ulObj.prepend(newObj);//添加新元素
                }
            }
        });
    });
    /**
     * 还原
     */
    $('#shopee_reback').click(function(){
        if(imageurl == undefined){
            layer.msg("没有添加图片")
        }else {
            //获取每行的最后一张的图片url
            $("#shopee_replace_windowMap_tab_content").find("ul").each(function () {
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
    function replaceWindowMap_loadTable(data){
        table.render({
            elem: "#shopee_replace_img_table",
            method: 'post',
            url: ctx + "/shopee/shopeeIsEnableProduct/seatchItemImg.html",
            where: data,
            height: 500,
            cols: [
                [
                    {checkbox:true,width:30},
                    { field: "storeAcct",title: "店铺" ,width:100, style:"vertical-align: top;"},
                    { field: "itemId",title: "item_id" ,width:100, style:"vertical-align: top;",templet: '#shopee_replace_itemId_tpl'},
                    { field: "prodPSku",title: "商品父sku" ,width:110, style:"vertical-align: top;"},
                    { field: "imgs",title: "橱窗图" , style:"vertical-align: top;", templet: '#shopee_replace_imgs_tpl' },
                    { title: '操作结果',width:80, align: 'center', style:"vertical-align: top;"},
                    { field: "storeAcctId",title: "店铺Id" ,width:100, style:"vertical-align: top;"},
                    { title: '首图加水印结果',width:70, align: 'center', style:"vertical-align: top;", templet: '#shopee_replace_firste_tpl'}

                ],
            ],
            done: function(res, curr, count){
                $("[data-field='storeAcctId']").css('display', 'none');
                if (res.code == '0000') {
                    $("#shopee_replace_windowMap_num_span").html(res.count);//数量
                    $("#shopee_replace_windowMap_itemIds_hidden").remove();
                    $(res.data).each(function (index, item) { //拖拽
                    //     var obj=$('#window_map_imgDiv_ul_'+this.itemId);
                    //     obj.sortable({
                    //         revert: true,
                    //         containment: "parent",
                    //         cursor: "move",
                    //     });
                    //     $('#window_map_operate_tips_' + this.itemId).html("");
                    //     $('#window_map_imgDiv_ul_'+this.itemId+",li").disableSelection();
                        //调用公共方法
                        uploadInit(item.itemId)
                    });
                }
            },
            id: "shopee_replace_img_table",
        });
    }

    form.on('select(shopeeModImg_is_pAnds_sku)',function(data){
        const {value} =data
        if(value==2){ 
            $('#shopee_replaceWindowMap_pskuSearchType').html('<option value="1">精确</option>')
        }else{
            $('#shopee_replaceWindowMap_pskuSearchType').html('<option value="0">模糊</option><option value="1">精确</option>')
        }
        form.render('select')
    })

    /**
     * 获取检索数据
     */
    function replaceShopeeImg_getSerachData(){
        var data = {};
        data.storeAcctIdList = [];
        data.sSkuList = [];
        data.pSkuList = [];
        var logisAttrContents = formSelects.value("selectAttr_store");
        for (var i = 0; i < logisAttrContents.length; i++) {
            var logisAttr = logisAttrContents[i].value;
            data.storeAcctIdList.push($.trim(logisAttr));
        }
        var skuStr = $.trim($("#shopee_replace_img_form input[name='skuList']").val());
        const optionSelectedValue = $("#shopeeModImg_is_pAnds_sku  option:selected").val() 
        if(optionSelectedValue == 0){
            if(skuStr !="" && skuStr!=null){
                data.prodSSku = $.trim(skuStr);
            }
        }else if(optionSelectedValue == 1) {
            if(skuStr !="" && skuStr!=null){
                data.prodPSku = $.trim(skuStr);
            }
        }else {
            if(skuStr !="" && skuStr!=null){
                data.itemIds = $.trim(skuStr);
            }
        }

        data.storeAcctIdList = $.trim(data.storeAcctIdList);
        var salepersonId = $.trim($("#shopee_replace_img_form select[name='saleName']").val());
        data.salepersonId = salepersonId;
        data.searchType = $("#shopee_replaceWindowMap_pskuSearchType").val();//搜索类型
        return data;
    };

    /**
     * 添加每行item的图片
     */
     shopee_replace_windowMap_addItemImage = function (itemId){
         var index = layer.open({
             type: 1,
             title: '添加lisiting图片-橱窗图不能超过9张',
             area: ['800px', '300px'],
             id: 'mainNetImgSuccess',
             content: '<div class="p20 pl20"><textarea class="layui-textarea" id="shopee_replace_windowMap_addItem_url_input" placeholder="请填写URL,多个地址用回车换行"></textarea></div>',
             btn: ['确定', '关闭'],
             success: function (layero) {
                 form.render();
             },
             yes: function (index, layero) {
                 var url = $.trim($("#shopee_replace_windowMap_addItem_url_input").val());
                 if (url == null || url == "") {
                     layer.msg("图片地址不能为空！", {icon: 5});
                     return false;
                 }
                 var urlArray = url.split("\n");
                 // 去一下空格
                 var ulObj=$('#window_map_imgDiv_ul_'+itemId);
                 let ulObjLiLength = ulObj.find('li').length;
                 if(ulObjLiLength + urlArray.length >9){
                     layer.confirm('此次修改部分listing图片数量大于九张,是否倒序删除至仅保留九张图片?', {icon: 3, title:'提示'}, function(index){
                         for (let i=0; i<urlArray.length; i++) {
                             var imageUrl = $.trim(urlArray[i]);
                             var lastObj=ulObj.find("li").last();
                             var newObj= lastObj.clone();
                             $(newObj).find("img").attr("src",imageUrl);
                             let currentUlObj=$('#window_map_imgDiv_ul_'+itemId);
                             // 九张之后，需要删除最后一张再添加到前面
                             if(ulObj.find('li').length >= 9){
                                 currentUlObj.find("li").last().remove();
                             }
                            currentUlObj.prepend(newObj);//添加新元素
                        }
                        layer.close(index);
                    });
                 }else{
                    for (let i=0; i<urlArray.length; i++) {
                        var imageUrl = $.trim(urlArray[i]);
                        var lastObj=ulObj.find("li").last();
                        var newObj= lastObj.clone();
                        $(newObj).find("img").attr("src",imageUrl);
                        ulObj.prepend(newObj);//添加新元素
                    }
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
    show_templet_picture = function (prodPId,itemId){
        var ulId = `window_map_imgDiv_ul_${itemId}`;
        var $ul = $('#'+ulId); //图片容器ul
        var trImgs = $ul.find('img'); //当前行所有的图片
        var trImgArr = Array.prototype.slice.call(trImgs); //转化成数组
        var index = layer.open({
            type: 1,
            title: '选择模板图片添加-橱窗图不能超过9张',
            area: ['1200px', '500px'],
            id: 'templetImgSuccess',
            content: '<form id="shopee_picture_form" class="layui-form"><div style="width:1200px;height:80px;float:left;dispaly:block;"><label class="layui-form-label">主图:</label>' +
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
                            // console.log(returnData)
                            var mainObj = $("#main_picture");
                            var assObj = $("#ass_picture");
                            var mainHtml = '<li style="padding: 5px 0;" class="window_map_imgLi"><input type="checkbox" lay-filter="checked_main_picture"/></li>';
                            var assHtml = '<li style="padding: 5px 0;" class="window_map_imgLi"><input type="checkbox" lay-filter="checked_ass_picture"/></li>';
                            if(returnData.data!=null && returnData.data.length != 0){
                                var imgarr = returnData.data
                                for(var i in imgarr){
                                    if(imgarr[i].isMain == true){
                                        mainHtml +='<li style="padding: 5px 0;" class="window_map_imgLi">' +
                                            '                        <div class="window_map_imgDiv">' +
                                            '                            <input type="checkbox" name="check_picture" value="'+imgarr[i].name+'"/><img src="'+imgarr[i].name+'" onclick="checked_picture(this)" class="templet_map_imgCss lazy">' +
                                            '                        </div>' +
                                            '                    </li>';
                                    }
                                    if(imgarr[i].isAssist == true){
                                        assHtml +='<li style="padding: 5px 0;" class="window_map_imgLi">' +
                                            '                        <div class="window_map_imgDiv">' +
                                            '                            <input value="'+imgarr[i].name+'" name="check_picture" type="checkbox"/><img src="'+imgarr[i].name+'" onclick="checked_picture(this)"  class="templet_map_imgCss lazy">' +
                                            '                        </div>' +
                                            '                    </li>';
                                    }

                                }
                                mainObj.append(mainHtml);
                                assObj.append(assHtml);
                                var layerImgs = layero.find('img');
                                var layerImgArr = Array.prototype.slice.call(layerImgs); //转化成数组
                                var allImgArr = trImgArr.concat(layerImgArr);
                                // console.log(layerImgs);
                                if (!checkImgRepeatShopee(allImgArr)) {
                                    layer.msg('主图和辅图中存在重复的图片')
                                    return false
                                }
                            }
                            form.render('checkbox');
                            //获取到当前页的所有图片,以及该点击行所在的所有图片
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
                console.log("原来："+oripictLen)
                var templetPic = [];
                $("#shopee_picture_form input[type=checkbox]:checked").each(function() {
                    var name = $(this).val();
                    if(name){
                        templetPic.push(name);
                    }
                });
                let ulObjLiLength = ulObj.find('li').length;
                if(ulObjLiLength + templetPic.length >9){
                    layer.confirm('此次修改部分listing图片数量大于九张,是否倒序删除至仅保留九张图片?', {icon: 3, title:'提示'}, function(index){
                        for (var i in templetPic) {
                            var imageUrl = $.trim(templetPic[i]);
                            var lastObj=ulObj.find("li").last();
                            var newObj= lastObj.clone();
                            let currentUlObj = $('#window_map_imgDiv_ul_'+itemId);
                            $(newObj).find("img").attr("src",imageUrl);
                            // 九张之后倒序删除再添
                            if(ulObj.find('li').length >= 9){
                                currentUlObj.find("li").last().remove();
                            }
                            currentUlObj.prepend(newObj);//添加新元素
                        }
                        layer.close(index);
                    });
                 }else{
                    for (var i in templetPic) {
                        var imageUrl = $.trim(templetPic[i]);
                        var lastObj=ulObj.find("li").last();
                        var newObj= lastObj.clone();
                        let currentUlObj = $('#window_map_imgDiv_ul_'+itemId);
                        $(newObj).find("img").attr("src",imageUrl);
                        currentUlObj.prepend(newObj);//添加新元素
                    }
                 }
                layer.close(index);
            },
            end:function(){
                layer.close(index);
            },
        });
    }

    function checkImgRepeatShopee(allImges) {
        // 取消所有的红框标记
        // console.log('进入判断');
        allImges.forEach(function(value, index){
            $(value).removeClass('shine_red');
        })
        if (!allImges || allImges.length == 0) { // 无图默认成功
            return true
        }
        var imgList = []
        for (var i = 0; i < allImges.length; ++i) {
            imgList.push({
                ele: allImges[i],
                pixels: getpixels(allImges[i],40,40)
            })
        }
        var pixelsJson = {}
        var ifRepeat = false
        for (var i =0; i < imgList.length; ++i) {
            if (pixelsJson[imgList[i].pixels]) {
                $(pixelsJson[imgList[i].pixels]).addClass('shine_red')
                $(imgList[i].ele).addClass('shine_red')
                ifRepeat = true
                continue
            }
            pixelsJson[imgList[i].pixels] = imgList[i].ele
        }
        if (ifRepeat) {
            return false
        }
        return true
    }




    /**
     * 添加首图加上水印
     */
    shopee_first_addItemImage = function (itemId,platAcctId){
        var storeAccts = [];
        storeAccts.push(platAcctId)
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
                getWaterMarkPicture(layero, index,storeAccts);
            },
            yes: function(index, layero){
                layui.admin.load.show();
                var imgPath= src;
                var waterImageId = $("#shopeePulish_info_water select[name=watermarkImage] option:selected").val();
                var waterFontId =  $("#shopeePulish_info_water select[name=watermarkFont] option:selected").val();
                var watermarkIds = "";
                if ( waterImageId && waterImageId != '') {
                    watermarkIds = waterImageId;
                }
                if (waterFontId && waterFontId!=''){
                    watermarkIds = watermarkIds + "," + waterFontId;
                }
                $.ajax({
                    type:"post",
                    url:ctx + "/shopee/shoppeWatermark/getWatermarkImgPath.html",
                    // dataType:"json",
                    contentType:'application/json;charset=utf-8',
                    data:JSON.stringify({
                        imgPath : imgPath,
                        watermarkIds:watermarkIds,
                        platCode:"shopee",
                        itemId:itemId,
                        storeAcctId:platAcctId
                    }),
                    success:function(returnData){
                        layui.admin.load.hide();
                        // var data = eval ("(" + returnData + ")");
                        if(returnData.code !== "0000"){
                            layer.msg(returnData.msg,{icon:2});
                            if(Number(returnData.msg)){
                                document.getElementById("window_first_picture_"+ returnData.msg).style.color="red";
                                $('#window_first_picture_'+returnData.msg).text("添加失败")
                            }
                        }else{
                            firstObj.find("img").attr("src",returnData.data);
                            layer.msg(returnData.msg + "添加成功");
                            document.getElementById("window_first_picture_"+returnData.msg).style.color="green";
                            $('#window_first_picture_'+returnData.msg).text("添加成功")
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
     * 点击图片选中checkbox
     * @param obj
     */
    checked_picture = function (obj) {
        var isCheck =  $(obj).parents().children("input[type=checkbox]").is(":checked");
        if(isCheck){
            $(obj).parents().children("input[type=checkbox]").prop("checked", false);
        }else{
            $(obj).parents().children("input[type=checkbox]").prop("checked", true);
        }
        form.render('checkbox');
    }

    form.on('checkbox(checked_main_picture)', function(obj){
        if(obj.elem.checked == true){
            var $ul = $(obj.elem).parents('ul');
            $ul.find('input[type=checkbox]').prop('checked',true);
        }else{
            var $ul = $(obj.elem).parents('ul');
            $ul.find('input[type=checkbox]').prop('checked',false);
        }
        form.render('checkbox')
    });

    form.on('checkbox(checked_ass_picture)', function (obj) {
        if(obj.elem.checked == true){
            var $ul = $(obj.elem).parents('ul');
            $ul.find('input[type=checkbox]').prop('checked',true);
        }else{
            var $ul = $(obj.elem).parents('ul');
            $ul.find('input[type=checkbox]').prop('checked',false);
        }
        form.render('checkbox')    })
    /**
     * 点击图片选中checkbox
     * @param obj
     */
    checked_main_picture = function (obj) {
        console.log("dianji")
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
 * 橱窗图删除
 * @param obj
 */
function shopee_replace_windowMap_delImg(obj) {
    var oripictLen =$(obj).parents().children('li').length;
    if(oripictLen<=1){
        layer.msg("至少保留一张图片！");
        return;
    }
    $(obj).closest('li').remove()
}

function shopeePublishInitWatermarkImage(data,id) {
    $("#"+id+" select[name=watermarkImage]").empty();
    console.log("data.picList"+data.picList)
    console.log("data.wordList"+data.wordList)
    if(data && data.picList) {
        $("#"+id+" select[name='watermarkImage']").append("<option value='' selected>请选择</option>");
        data.picList.forEach(function (val, index) {
            var watermarkName = val.watermarkTemplateName;
            var watermarkId = val.id;
            var optionTpl = "<option value=':watermarkId'>:watermarkName</option>";
            optionTpl = optionTpl.replace(":watermarkId", watermarkId);
            optionTpl = optionTpl.replace(":watermarkName", watermarkName);
            $("#"+id+" select[name='watermarkImage']").append(optionTpl);
        });
        layui.form.render();
    }
    $("#"+id+" select[name=watermarkFont]").empty();
    if(data && data.wordList) {
        $("#"+id+" select[name=watermarkFont]").append("<option value='' selected>请选择</option>");
        data.wordList.forEach(function (val, index) {
            var watermarkName = val.watermarkTemplateName;
            var watermarkId = val.id;
            var optionTpl = "<option value=':watermarkId'>:watermarkName</option>";
            optionTpl = optionTpl.replace(":watermarkId", watermarkId);
            optionTpl = optionTpl.replace(":watermarkName", watermarkName);
            $("#"+id+" select[name=watermarkFont]").append(optionTpl);
        });
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
            // var $ul = $('#window_map_imgDiv_ul_'+domName);
            // var $lis = $ul.find('li');
            // if($lis.length >=9){
            //     layer.msg('图片最多为9张!');
            //     console.log('选择完成')
            //     return false;
            // }
            return true;
        },
        onUploadSuccess: function (file, datas, response) {
            let data = JSON.parse(datas)
            var url = data.msg;
            if(data.code == '9999'){
                layer.msg(data.msg);
                return;
            }
            var $ul = $('#window_map_imgDiv_ul_'+domName);
            var str = `<li style="padding: 5px 0;" class="window_map_imgLi" draggable="true">
                            <div class="window_map_imgDiv">
                                <img src="${url}" class="window_map_imgCss img_show_hide">
                            </div>
                            <div class="imgDivDown h20 "><a onclick="shopee_replace_windowMap_delImg(this);" href="javascript:void(0);">移除</a></div>
                        </li>`;
            if($ul.find('li').length>=9){
              layer.confirm('此次修改部分listing图片数量大于九张,是否倒序删除至仅保留九张图片?', {icon: 3, title:'提示'}, function(index){
                $ul.find('li').last().remove();
                $ul.prepend(str);//添加新元素
                layer.close(index);
              });
            }else{
              $ul.prepend(str);
            }

        }
    });
    
}

