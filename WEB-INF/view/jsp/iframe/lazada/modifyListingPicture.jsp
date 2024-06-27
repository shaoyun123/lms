<%--copy shopee在线商品和lazada修改子sku图片--%>
<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<title>lazada修改图片</title>
<link rel="stylesheet" href="${ctx}/static/Huploadify/Huploadify.css" media="all">
<style>
    .imgBox_prodTpl {
        width: 150px;
        border: 1px solid rgb(204, 204, 204);
        overflow: hidden;
    }

    .detailImg_prodtpl {
        width: 100px;
        height: 100px;
        border: 1px solid #f2f2f2
    }

    @-webkit-keyframes shineRed {
        from {
            -webkit-box-shadow: 0 0 5px #bbb;
        }
        50% {
            -webkit-box-shadow: 5px 10px 10px #B22222;
        }
        to {
            -webkit-box-shadow: 0 0 5px #bbb;
        }
    }

    .shine_red {
        -webkit-animation-name: shineRed;
        -webkit-animation-duration: 2s;
        -webkit-animation-iteration-count: infinite;
    }

    li.window_map_imgLi{
        float: left;
    }
    img.window_map_imgCss {
        width:auto;
        height:auto;
        max-width: 100%;
        max-height: 100%;
        margin: auto;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        position: absolute;
    }
    img.templet_map_imgCss {
        width:auto;
        height:auto;
        max-width: 100%;
        max-height: 100%;
        margin: auto;
        top: 0;
        bottom: 0;
        left: 33px;
        right: 0;
        position: absolute;
    }
    div.window_map_imgDiv{
        width:120px;
        height:80px;
        display:inline-block;
        vertical-align: middle;
        margin-right:5px;
        position:relative;
        border: 1px solid #ccc;
    }
</style>
<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form">
                        <div class="layui-inline">
                            <input type="text" id="lazada_replace_itemId" autocomplete="off"
                                   class="layui-input" placeholder="itemId，多个逗号分隔">
                        </div>
                        <div class="layui-inline" style="width:100px;">
                            <select name='lazada_replace_type' placeholder="店铺水印类型">
                                <option value=''>全部</option>
                                <option value='0'>图片</option>
                                <option value='1'>文字</option>
                                <option value='2'>其它图片</option>
                            </select>
                        </div>
                        <div class="layui-inline">
                            <button class="layui-btn ml20 layui-btn-sm" type="button"
                                    id="lazada_replace_itemId_btn">查询
                            </button>
                        </div>
                    </form>
                    <div class="layui-tab" lay-filter="lazada_replace_windowMap_tab_filter">
                        <ul class="layui-tab-title">
                            <li class="layui-this">数量(<span id="lazada_replace_windowMap_num_span"></span>)</li>
                        </ul>
                        <div style="position: absolute;top: 50px;left: 120px;" width="600px;">
                            <form class="layui-form" lay-filter="lazada_replace_windowMap_url_form"
                                  id="lazada_replace_windowMap_url_form">
                                <div class="layui-inline">
                                    <label class="layui-form-label">图片URL<span style="color: red;">*</span></label>
                                    <div class="layui-input-inline" style="width: 400px;">
                                        <input type="text" id="lazada_replace_windowMap_image_input" autocomplete="off"
                                               class="layui-input">
                                    </div>
                                    <button class="layui-btn ml20 layui-btn-sm" type="button"
                                            id="lazada_replace_windowMap_image_add_btn">新增图片
                                    </button>
                                    <button class="layui-btn ml20 layui-btn-sm" type="button" id="lazada_reback">还原
                                    </button>
                                    <button type="reset" class="layui-btn layui-btn-primary layui-btn-sm">清空</button>
                                    <span style="color:red">(每个lisiting的图片不能超过8张)</span>
                                    <button type="button" id="lazada_replace_windowMap_bacthUpdate_btn"
                                            class="layui-btn layui-btn-normal layui-btn-sm">批量修改
                                    </button>
                                    <button type="button" id="lazada_replace_first_pic_btn"
                                            class="layui-btn layui-btn-normal layui-btn-sm">批量首图加水印
                                    </button>
                                </div>
                            </form>
                        </div>
                        <div id="lazada_replace_windowMap_tab_content">
                            <table class="layui-table" id="lazada_replace_img_table"
                                   lay-filter="lazada_replace_img_table"></table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<%--首图加水印结果--%>
<script type="text/html" id="lazada_replace_firste_tpl">
    <span id="window_first_picture_{{d.itemId}}{{d.storeSubId}}" class="window_map_imgDiv_ul"> </span>
</script>
<!--图片显示模板-->
<script type="text/html" id="lazada_replace_imgs_tpl">
    <div class="layui-clear pl20 imgContains" data-maxImg="8" data-minImg="1"
         data-imgObjType="11"
         data-id="lazadaModifyListingaPicture">
    <ul id="window_{{d.itemId}}{{d.storeSubId}}" class="uploadImgUL ui-sortable">
        {{# layui.each((d.pImages||'').split('|'),function(i,item){ }}
        {{# if(item != null && item != ''){ }}
        <li draggable="true" class="imgBox_prodTpl ui-sortable-handle">
            <div class="ImgDivOut">
                <div>
                    <input type="hidden" name="" value="{{item}}"/>
                </div>
                <div class="ImgDivIn">
                    <img src="{{item}}" alt="" class="imgCss img_show_hide detailImg_prodtpl dbclickCopyUrl lazy" title="双击即可复制路径"/>
                </div>
                <div class="h20"><a onclick="lazada_replace_windowMap_delImg(this);" href="javascript:void(0);">移除</a>
                </div>
            </div>
        </li>
        {{# } }}
        {{# });}}
        <div style="float:right;">
            <div>
                <div id="{{d.itemId}}{{d.storeSubId}}"></div><!--图片上传按钮-->
            </div>
            <button class="layui-btn layui-btn-sm" type="button" style="margin:3px 0;"
                    onclick="lazada_replace_windowMap_addItemImage('{{d.itemId}}','{{d.storeSubId}}')">网络图片
            </button>
            <br/>
            <button class="layui-btn layui-btn-sm" type="button" style="margin:3px 0;"
                    onclick="lazada_replace_windowMap_tempImg('{{d.prodPId}}','{{d.itemId}}','{{d.storeSubId}}')">模板图片
            </button>
            <br/>
            <button class="layui-btn layui-btn-sm" type="button"
                    onclick="lazada_first_addItemImage('{{d.itemId}}','{{d.storeAcctId}}','{{d.storeSubId}}')">首图加水印
            </button>
        </div>
        <div style="clear:both;"></div>
    </ul>
        </div>
</script>
<script type="text/html" id="lazada_replace_img_operate_tpl">
    <span id="window_map_operate_tips_{{d.itemId}}"></span>
</script>
<%--查询水印模板--%>
<script type="text/html" id="lazadaPulish_info_add_water">
    <form class="layui-form" action="" lay-filter="component-form-group" id="lazadaPulish_info_water">
    <div class="layui-input-block">
        <input type="radio" name="watermarkType" value="0" title="日常图片水印" checked lay-filter="lazadaWatermarkTypeRadio">
        <input type="radio" name="watermarkType" value="1" title="文字水印" lay-filter="lazadaWatermarkTypeRadio">
        <input type="radio" name="watermarkType" value="2" title="其它图片水印" lay-filter="lazadaWatermarkTypeRadio">
    </div>
    </form>
</script>
<script src="${ctx}/static/jquery-ui.min.js"></script>
<script type="text/javascript" src="${ctx}/static/Huploadify/jquery.Huploadify.js"></script>
<script src="${ctx}/static/util/ImgCompareUtil.js?v=${ver}"></script>
<script>
    /**
     * lazada修改图片
     */
    var lazada_replace_windowMap_addItemImage;//公共函数
    var lazada_replace_windowMap_tempImg; // 模板图片
    var lazada_first_addItemImage;//公共函数
    // var getWaterMarkPicture;
    var checked_picture;
    var checked_main_picture;
    var checked_ass_picture;
    var ImgtimeUnit;
    let lazada_modify_listingImg_tableData;
    layui.use(['admin', 'form', 'layer', 'element', 'table', 'laypage'], function () {
        var admin = layui.admin,
            form = layui.form,
            table = layui.table,
            layer = layui.layer,
            $ = layui.$;
        form.render();

        var idList = localStorage.getItem('itemIds'); // id
        if (idList) {
            // replaceWindowMap_loadTable({"ids":idList});
            commonReturnPromise({
                url: ctx + "/lazadaWatermark/getProductInfo",
                type: 'post',
                params:{
                    ids: idList
                }
            }).then(res=>{
                lazada_modify_listingImg_tableData = res
                replaceWindowMap_loadTable(res)
            })
        }

        // 批量首图加水印
        $("#lazada_replace_first_pic_btn").click(function () {
            var itemData = table.checkStatus('lazada_replace_img_table').data; //获取选择的店铺
            let dataList = [];
            if (itemData == null || itemData.length < 1) {
                layer.msg("请选择lisiting", {icon: 0});
                return;
            } else {
                itemData.forEach(item => {
                    var ulObj = $('#window_' + item.itemId + item.storeSubId);
                    var firstObj = ulObj.find("li").first();
                    var src = firstObj.find("img").attr("src");
                    dataList.push({
                        imgPath: src,
                        storeSubId: item.storeSubId,
                        itemId: item.itemId,
                        storeAcctId: item.storeAcctId
                    })
                })
            }
            var index = layer.open({
                type: 1,
                title: '批量首图添加水印',
                area: ['30%', '40%'],
                content: $("#lazadaPulish_info_add_water").html(),
                btn: ['添加'],
                success: function (layero, index) {
                    form.render()
                },
                yes: function (index, layero) {
                    layui.admin.load.show();
                    let watermarkType = $.trim($('#lazadaPulish_info_water [name=watermarkType]:checked').val()); //获取水印类型
                    commonReturnPromise({
                        url: ctx + `/lazadaWatermark/addWatermarkByWaterType`,
                        type: 'POST',
                        contentType: 'application/json',
                        params:JSON.stringify({
                            watermarkType: watermarkType,
                            dataList:dataList
                        })
                    }).then(returnData => {
                        let errKey = [];
                        for(let key in returnData.errorItemIdMap){
                            errKey.push(key)
                        }
                        let errList = returnData.notWatermarkItemIdList.concat(errKey)
                        if(returnData.success == true){
                            layer.alert('添加成功');
                        }else{
                            let msg = `部分item添加水印成功，错误信息如下<br>`
                            msg += "店铺没有"+['日常图片','文字','其它图片'][watermarkType]+"水印模板导致添加失败的itemid为："+ returnData.notWatermarkItemIdList.join(",")+'<br>其它失败itemid为：'+errKey.join(",")
                            layer.alert(msg);
                        }
                        layer.close(index)
                        returnData.dataList.map(item => {
                            if (errList.indexOf(item.itemId) == -1) {
                                //将新返回的水印图地址放进首图
                                var ulObj = $('#window_'  + item.itemId + item.storeSubId);
                                var firstObj = ulObj.find("li").first();
                                firstObj.find("img").attr("src", item.imgPath);
                                $('#window_first_picture_'  + item.itemId + item.storeSubId).text("添加成功").css('color',"green")
                            } else {
                                $('#window_first_picture_' + item.itemId + item.storeSubId).text("添加失败").css('color',"red")

                            }
                        })
                    })
                }
            })
        });

        // 首图加水印
        lazada_first_addItemImage = function (itemId, platAcctId,id) {
            var storeAccts = [];
            storeAccts.push(platAcctId)
            var ulObj = $('#window_' + itemId + id);
            var firstObj = ulObj.find("li").first();
            var src = firstObj.find("img").attr("src");
            var index = layer.open({
                type: 1,
                title: '首图添加水印',
                area: ['30%', '40%'],
                content: $("#lazadaPulish_info_add_water").html(),
                btn: ['添加'],
                success: function (layero, index) {
                //     getWaterMarkPicture(layero, index, storeAccts);
                    form.render()
                },
                yes: function (index, layero) {
                    var imgPath = src;
                    getDataMLPQueryWatermarkByStoreAcctIds(storeAccts.join()).then(res => {
                        let watermarkIds,
                            watermarkType = $.trim($('#lazadaPulish_info_water [name=watermarkType]:checked').val()); //获取水印类型
                        if(watermarkType == 0 && res.picList.length != 0){ // 日常图片水印
                            watermarkIds = res.picList[0].id;
                        }else if(watermarkType == 0 && res.picList.length == 0){
                            layer.alert("日常图片水印为空",{icon:2})
                            return false
                        }
                        if(watermarkType == 1 && res.wordList.length != 0){ // 文字水印
                            watermarkIds = res.wordList[0].id;
                        }else if(watermarkType == 1 && res.wordList.length == 0){
                            layer.alert("文字水印为空",{icon:2})
                            return false
                        }
                        if(watermarkType == 2 && res.otherPicList.length != 0){ // 其它图片水印
                            watermarkIds = res.otherPicList[0].id;
                        }else if(watermarkType == 2 && res.otherPicList.length == 0){
                            layer.alert("其它图片水印为空",{icon:2})
                            return false
                        }
                        layui.admin.load.show();
                        getDataMLPBatchAddAndGetWatermarkUrl([{
                            //物品id
                            "itemId": itemId,
                            //首图url
                            "imgPath": imgPath,
                            //店铺id
                            "storeAcctId": platAcctId,
                            //水印id集合
                            "watermarkIds": watermarkIds,
                            "storeSubId":id
                        }]).then(res => {
                            firstObj.find("img").attr("src", res[0].imgPath);
                            layer.alert("添加成功",{icon:1})
                            layer.close(index);
                        }).catch(err => layer.msg(err, {icon:2}))
                    }).catch(err => layer.msg(err, {icon:2}))
                },
                end: function () {
                    layer.close(index);
                },
            })
        }

        /**
         * 批量修改
         */
        $("#lazada_replace_windowMap_bacthUpdate_btn").click(function () {
            var itemData = table.checkStatus('lazada_replace_img_table').data; //获取选择的店铺
            if (itemData == null || itemData.length < 1) {
                layer.msg("请选择lisiting", {icon: 0});
                return;
            }
            var itemIds = [];
            var updateArray = [];
            for (var index in itemData) {
                var obj = itemData[index];
                var updateObj = {};
                var imageArray = [],oldImages = [];
                updateObj.id = obj.id;
                updateObj.storeSubSku = obj.storeSubSku;
                updateObj.storeAcctId = obj.storeAcctId;
                updateObj.storeAcct = obj.storeAcct;
                updateObj.itemId = obj.itemId;
                updateObj.storeSubId = obj.storeSubId;
                $('#window_' + obj.itemId + obj.storeSubId).find("img").each(function () {
                    var imageUrl = $(this).attr("src");
                    if (imageUrl != null && imageUrl != '') {
                        imageArray.push(imageUrl);
                    }
                });
                if (imageArray.length > 8) {
                    layer.msg(obj.itemId + ':橱窗图超过8张，请检查！')
                    return;
                } else {
                    imageArray == ''?updateObj.images = []:updateObj.images = imageArray;
                    obj.pImages=''?oldImages = []:oldImages.push(obj.pImages.split("|")[0])
                    updateObj.oldImages = oldImages
                    updateArray.push(updateObj);
                    itemIds.push(obj.itemId);
                    $('#window_map_operate_tips_' + obj.itemId).html("");
                    allItemSize = itemIds.length;
                }
            }
            ;
            loading.show();
            //以当前时间戳作为批次号
            var batchNo = new Date().getTime();
            $.ajax({
                type: "POST",
                url: ctx + "/lazadaWatermark/batchUpdateWatermarks",
                data: JSON.stringify({'updateData': updateArray, 'batchNo': batchNo}),
                contentType:"application/json",
                async: true,
                dataType: "json",
                success: function (returnData) {
                    if (returnData.code == "0000") {
                        loading.hide()
                        layer.msg("操作成功,稍等片刻为您显示操作结果");
                    } else {
                        setTimeout(function () {
                            loading.hide();
                            layer.msg(returnData.msg);
                        }, 3000);
                    }
                },
                error: function (err) {
                    loading.hide()
                    layer.msg(err.msg||"请求失败",{icon:2});
                }
            });
            ImgtimeUnit = setInterval(function () {
                sel(batchNo)
            }, 5000);
        });

        function sel(batchNo) {
            var trObj = $('#lazada_replace_img_table').next().find('.layui-table-body tbody').find('tr');
            var count = 0;
            for (var i = 0; i < trObj.length; i++) {
                var checkStat = trObj.eq(i).find('td').eq(0).find('div').find('input').is(":checked");
                var resultMsg = trObj.eq(i).find('td').eq(6).find('.layui-table-cell').find('div').text();
                if ((resultMsg == '' || resultMsg == null) && checkStat) {
                    count++;
                }
            }
            if (count == 0) {
                clearInterval(ImgtimeUnit);
                return;
            }
            $.ajax({
                type: "POST",
                url: ctx + "/sys/selectResult.html",
                data: {'batchNo': batchNo},
                async: true,
                dataType: "json",
                success: function (returnData) {
                    if (returnData.code == "0000") {
                        var data = returnData.data;

                        for (var i = 0; i < trObj.length; i++) {
                            var itemId = $.trim(trObj.eq(i).find('td').eq(2).find('div').text());//平台商品Id
                            var checkStat = trObj.eq(i).find('td').eq(0).find('div').find('input').is(":checked");
                            var resultMsg = trObj.eq(i).find('td').eq(6).find('.layui-table-cell').find('div').text();

                            var logMsg = data['TR_LAZADA_UPDATE_WATERMARKS_MQ' + itemId];
                            if ((resultMsg == '' || resultMsg == null) && checkStat) {
                                if (logMsg.includes('成功')) {
                                    trObj.eq(i).find('td').eq(6).find('.layui-table-cell').html("<div style='color:blue'>" + logMsg + "</div>");
                                } else if (logMsg != '' && logMsg != null && logMsg != 'undefined') {
                                    trObj.eq(i).find('td').eq(6).find('.layui-table-cell').html("<div style='color:red'>" + logMsg + "</div>");
                                }
                            }
                        }
                    }
                },
                error: function (err) {
                    layer.msg(err.msg||"请求失败",{icon:2});
                    clearInterval(ImgtimeUnit);
                }
            });
        }

        /**
         * 初始化时搜索
         */
        if ($("#lazada_replace_windowMap_itemIds_hidden").length > 0) {
            // replaceWindowMap_loadTable({});
            commonReturnPromise({
                url: ctx + "/lazadaWatermark/getProductInfo",
                type: 'post',
                params:{}
            }).then(res=>{
                lazada_modify_listingImg_tableData = res
                replaceWindowMap_loadTable(res)
            })
        }
        ;
        // 前端查询
        $("#lazada_replace_itemId_btn").click(function () {
            let itemId = $.trim($("#lazada_replace_itemId").val()) == ''?[]:$.trim($("#lazada_replace_itemId").val()).split(","),
                type = $.trim($("select[name=lazada_replace_type]").val());
            let typeList = ['图片水印','文字水印','其他水印']
            if(itemId.length == 0 && type === ''){
                replaceWindowMap_loadTable(lazada_modify_listingImg_tableData)
            }else if(itemId.length == 0 && type !== ''){
                let res = lazada_modify_listingImg_tableData.filter(item => item.waterTypeList&&item.waterTypeList.includes(typeList[type*1]))
                replaceWindowMap_loadTable(res)
            }else if(itemId.length != 0 && type === ''){
                let res = lazada_modify_listingImg_tableData.filter(item => itemId.includes(item.itemId.toString()))
                replaceWindowMap_loadTable(res)
            }else if(itemId.length != 0 && type !== ''){
                let res = lazada_modify_listingImg_tableData.filter(item => itemId.includes(item.itemId.toString()))
                res = res.filter(item => item.waterTypeList&&item.waterTypeList.includes(typeList[type*1]))
                replaceWindowMap_loadTable(res)
            }
        })

        var imageurl;
        /**
         * 添加图片,先不着急转换，点击批量修改后转换
         */
        $("#lazada_replace_windowMap_image_add_btn").click(function () {
            //点击添加保存图片url
            imageurl = $.trim($("#lazada_replace_windowMap_image_input").val());
            if (imageurl == null || imageurl == '') {
                layer.msg("图片地址不能为空", {icon: 2});
                return;
            }
            //判断复选框是否被选择
            var checkStatus = table.checkStatus('lazada_replace_img_table');
            if (checkStatus.data.length < 1) {
                layer.msg("请选择数据");
                return;
            }

            $("#lazada_replace_windowMap_tab_content").find("td").each(function () {
                if ($(this).find('div').find('input').is(":checked")) {
                    if ($(this).parent().find("ul").find("li").length < 8) { //不超过8张
                        var lastObj = $(this).parent().find("ul").find("li").last();
                        var newObj;
                        if(lastObj.length != 0){
                            newObj = lastObj.clone();
                            $(newObj).find("img").attr("src", imageurl);
                            $(newObj).find("img").attr("name", "add");//新增标识
                            lastObj.after(newObj);//添加新元素
                        }else{
                            newObj = '<li draggable="true" class="imgBox_prodTpl ui-sortable-handle"><div class="ImgDivOut"><div><input type="hidden" name="" value="'+ imageurl +'"/></div><div class="ImgDivIn"> <img src="'+ imageurl +'" alt="" class="imgCss img_show_hide detailImg_prodtpl dbclickCopyUrl lazy" title="双击即可复制路径"/> </div><div class="h20"><a onclick="lazada_replace_windowMap_delImg(this);" href="javascript:void(0);">移除</a></div></div></li>'
                            $(this).parent().find("ul").find(".ui-sortable-handle").first().before(newObj);//添加新元素
                        }
                    }
                }
            });
        });
        /**
         * 还原
         */
        $('#lazada_reback').click(function () {
            if (imageurl == undefined) {
                layer.msg("没有添加图片")
            } else {
                //获取每行的最后一张的图片url
                $("#lazada_replace_windowMap_tab_content").find("ul").each(function () {
                    var lastObj = $(this).find("li").last();
                    var lastUrl = lastObj.find("img").attr("src");
                    if (imageurl == lastUrl) {
                        var isAdd = lastObj.find("img").attr("name");//查看是否有新增标识
                        if (isAdd != undefined) {
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
        function replaceWindowMap_loadTable(data) {
            table.render({
                elem: "#lazada_replace_img_table",
                // method: 'post',
                // url: ctx + "/lazadaWatermark/getProductInfo",
                // where: data,
                data:data,
                page:false,
                limit:data.length,
                height: 500,
                cols: [
                    [
                        {checkbox: true, width: 30},
                        {field: "storeAcct", title: "店铺", width: 100, style: "vertical-align: top;"},
                        {field: "itemId", title: "item_id", width: 100, style: "vertical-align: top;"},
                        {field: "prodPSku", title: "商品父sku", width: 110, style: "vertical-align: top;"},
                        {field: "waterTypeList", title: "店铺水印类型", width: 110, templet: function (d) {
                                return d.waterTypeList?d.waterTypeList.join(","):''
                            }},
                        {
                            field: "pImages",
                            title: "橱窗图",
                            style: "vertical-align: top;",
                            templet: '#lazada_replace_imgs_tpl'
                        },
                        {title: '操作结果', width: 80, align: 'center', style: "vertical-align: top;"},
                        {
                            title: '首图加水印结果',
                            width: 120,
                            align: 'center',
                            style: "vertical-align: top;",
                            templet: '#lazada_replace_firste_tpl'
                        }

                    ],
                ],
                done: function (res, curr, count) {
                    $("[data-field='storeAcctId']").css('display', 'none');
                    // if (res.code == '0000') {
                        $("#lazada_replace_windowMap_num_span").html(res.count);//数量
                        $("#lazada_replace_windowMap_itemIds_hidden").remove();
                        $(res.data).each(function (index, item) { //拖拽
                            //调用公共方法
                            uploadInit(item.itemId,item.storeSubId)
                        });
                    // }
                },
                id: "lazada_replace_img_table",
            });
        }
        // 模板图片
        lazada_replace_windowMap_tempImg = function (prodPId,itemId,id){
            var index = layer.open({
                type: 1,
                title: '选择模板图片添加-橱窗图不能超过8张',
                area: ['1200px', '500px'],
                id: 'templetImgSuccess',
                content: '<form id="lazada_picture_form" class="layui-form"><div style="width:1200px;height:80px;float:left;dispaly:block;"><label class="layui-form-label">主图:</label>' +
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
                                                    '                            <input type="checkbox" name="check_picture" value="'+imgarr[i].name+'"/><img src="'+imgarr[i].name+'" onclick="lazada_checked_picture(this)"  class="templet_map_imgCss">' +
                                                    '                        </div>' +
                                                    '                    </li>';
                                            }
                                            if(imgarr[i].isAssist == true){
                                                assHtml +='<li style="padding: 5px 0;" class="window_map_imgLi">' +
                                                    '                        <div class="window_map_imgDiv">' +
                                                    '                            <input value="'+imgarr[i].name+'" name="check_picture" type="checkbox"/><img src="'+imgarr[i].name+'" onclick="lazada_checked_picture(this)"   class="templet_map_imgCss">' +
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
                    var ulObj = $('#window_' + itemId+id);
                    var oripictLen = ulObj.find("li").length;
                    var templetPic = [];
                    $("#lazada_picture_form input[type=checkbox]:checked").each(function() {
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
        lazada_checked_picture = function (obj) {
            var isCheck =  $(obj).parents().children("input[type=checkbox]").is(":checked");
            if(isCheck){
                $(obj).parents().children("input[type=checkbox]").prop("checked", false);
            }else{
                $(obj).parents().children("input[type=checkbox]").prop("checked", true);
            }
            form.render('checkbox');
        }

        /**
         * 添加每行item的图片
         */
        lazada_replace_windowMap_addItemImage = function (itemId,id) {
            var index = layer.open({
                type: 1,
                title: '添加lisiting图片-橱窗图不能超过8张',
                area: ['800px', '300px'],
                id: 'mainNetImgSuccess',
                content: '<div class="p20 pl20"><textarea class="layui-textarea" id="lazada_replace_windowMap_addItem_url_input" placeholder="请填写URL,多个地址用回车换行"></textarea></div>',
                btn: ['确定', '关闭'],
                success: function (layero) {
                    form.render();
                },
                yes: function (index, layero) {
                    var url = $.trim($("#lazada_replace_windowMap_addItem_url_input").val());
                    if (url == null || url == "") {
                        layer.msg("图片地址不能为空！", {icon: 5});
                        return false;
                    }
                    var urlArray = url.split("\n");
                    // 去一下空格
                    var ulObj = $('#window_' + itemId+id);
                    for (var i in urlArray) {
                        var imageUrl = $.trim(urlArray[i]);
                        if (ulObj.find("li").length >= 8) {
                            layer.close(index);
                            return;
                        }
                        var lastObj = ulObj.find("li").last();
                        var newObj;
                        if(lastObj.length != 0){
                            newObj = lastObj.clone();
                            $(newObj).find("img").attr("src", imageUrl);
                            lastObj.after(newObj);//添加新元素
                        }else{
                            newObj = '<li draggable="true" class="imgBox_prodTpl ui-sortable-handle"><div class="ImgDivOut"><div><input type="hidden" name="" value="'+ imageurl +'"/></div><div class="ImgDivIn">\n' +
                                '                                <img src="'+ imageurl +'" alt="" class="imgCss img_show_hide detailImg_prodtpl dbclickCopyUrl lazy" title="双击即可复制路径"/>\n' +
                                '                                </div><div class="h20"><a onclick="lazada_replace_windowMap_delImg(this);" href="javascript:void(0);">移除</a></div></div></li>';
                            ulObj.prepend(newObj)
                        }
                    }
                    layer.close(index);
                },
                end: function () {
                    layer.close(index);
                },
            });
        }

        function checkImgRepeatlazada(allImges) {
            // 取消所有的红框标记
            allImges.forEach(function (value, index) {
                $(value).removeClass('shine_red');
            })
            if (!allImges || allImges.length == 0) { // 无图默认成功
                return true
            }
            var imgList = []
            for (var i = 0; i < allImges.length; ++i) {
                imgList.push({
                    ele: allImges[i],
                    pixels: getpixels(allImges[i], 40, 40)
                })
            }
            var pixelsJson = {}
            var ifRepeat = false
            for (var i = 0; i < imgList.length; ++i) {
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
         * 点击图片选中checkbox
         * @param obj
         */
        checked_picture = function (obj) {
            var isCheck = $(obj).parents().children("input[type=checkbox]").is(":checked");
            if (isCheck) {
                $(obj).parents().children("input[type=checkbox]").prop("checked", false);
            } else {
                $(obj).parents().children("input[type=checkbox]").prop("checked", true);
            }
            form.render('checkbox');
        }

        form.on('checkbox(checked_main_picture)', function (obj) {
            if (obj.elem.checked == true) {
                var $ul = $(obj.elem).parents('ul');
                $ul.find('input[type=checkbox]').prop('checked', true);
            } else {
                var $ul = $(obj.elem).parents('ul');
                $ul.find('input[type=checkbox]').prop('checked', false);
            }
            form.render('checkbox')
        });

        form.on('checkbox(checked_ass_picture)', function (obj) {
            if (obj.elem.checked == true) {
                var $ul = $(obj.elem).parents('ul');
                $ul.find('input[type=checkbox]').prop('checked', true);
            } else {
                var $ul = $(obj.elem).parents('ul');
                $ul.find('input[type=checkbox]').prop('checked', false);
            }
            form.render('checkbox')
        })
        /**
         * 点击图片选中checkbox
         * @param obj
         */
        checked_main_picture = function (obj) {
            var isCheck = $(obj).parents().children("input[type=checkbox]").is(":checked");
            if (isCheck) {
                $(obj).parents().children("input[type=checkbox]").prop("checked", false);
            } else {
                $(obj).parents().children("input[type=checkbox]").prop("checked", true);
            }
            form.render('checkbox');
        }

        // 通过传入多个店铺id查询下面的水印模板
        function getDataMLPQueryWatermarkByStoreAcctIds(storeAcctId) {
            return commonReturnPromise({
                url: ctx + `/lazadaWatermark/queryWatermarkByStoreAcctIds`,
                type: 'get',
                // contentType: 'application/json',
                params:{"storeAcctId": storeAcctId}
            })
        }

        // 添加水印
        function getDataMLPBatchAddAndGetWatermarkUrl(obj) {
            return commonReturnPromise({
                url: ctx + `/lazadaWatermark/batchAddAndGetWatermarkUrl`,
                type: 'post',
                contentType: 'application/json',
                params:JSON.stringify(obj)
            })
        }

    });

    /**
     * 橱窗图删除
     * @param obj
     */
    function lazada_replace_windowMap_delImg(obj) {
        var oripictLen = $(obj).parents().children('li').length;
        if (oripictLen <= 1) {
            layer.msg("至少保留一张图片！");
            return;
        }
        $(obj).closest('li').remove()
    }

    function lazadaPublishInitWatermarkImage(data, id) {
        $("#" + id + " select[name=watermarkImage]").empty();
        if (data && data.picList) {
            $("#" + id + " select[name='watermarkImage']").append("<option value='' selected>请选择</option>");
            data.picList.forEach(function (val, index) {
                var watermarkName = val.watermarkTemplateName;
                var watermarkId = val.id;
                var optionTpl = "<option value=':watermarkId'>:watermarkName</option>";
                optionTpl = optionTpl.replace(":watermarkId", watermarkId);
                optionTpl = optionTpl.replace(":watermarkName", watermarkName);
                $("#" + id + " select[name='watermarkImage']").append(optionTpl);
            });
            layui.form.render();
        }
        $("#" + id + " select[name=watermarkFont]").empty();
        if (data && data.wordList) {
            $("#" + id + " select[name=watermarkFont]").append("<option value='' selected>请选择</option>");
            data.wordList.forEach(function (val, index) {
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

    function uploadInit(domName,id) {
        $("#" + domName+id).Huploadify({
            auto: true,
            fileTypeExts: '*.jpg;*.png;*.jpeg;*.JPG;*.JPEG;*.PNG;*.bmp;*.BMP;*.gif;',
            multi: true, // 开启多选
            fileSizeLimit: 2048,	//默认单位是KB
            buttonText: '本地图片',
            breakPoints: false,
            saveInfoLocal: false,
            showUploadedPercent: true,
            showUploadedSize: true,
            removeTimeout: 500,
            uploader: ctx + "/publish/uploadPic.html",
            onSelect: function (files) {
                var $ul = $('#window_' + domName + id);
                var $lis = $ul.find('li');
                if ($lis.length + files.length > 8) {
                    layer.msg('图片最多为8张!');
                    return false;
                }
                return true;
            },
            onUploadSuccess: function (file, datas, response) {
                let data = JSON.parse(datas)
                var url = data.msg;
                if (data.code == '9999') {
                    layer.msg(data.msg);
                    return;
                }
                var $ul = $('#window_' + domName + id);
                var lastObj = $ul.find("li").last();
                var newObj;
                if(lastObj.length != 0){
                    newObj = lastObj.clone();
                    $(newObj).find("img").attr("src", url);
                    lastObj.after(newObj);//添加新元素
                }else{
                    newObj = '<li draggable="true" class="imgBox_prodTpl ui-sortable-handle"><div class="ImgDivOut"><div><input type="hidden" name="" value="'+ url +'"/></div><div class="ImgDivIn">\n' +
                             '                    <img src="'+ url +'" alt="" class="imgCss img_show_hide detailImg_prodtpl dbclickCopyUrl lazy" title="双击即可复制路径"/>\n' +
                             '                    </div><div class="h20"><a onclick="lazada_replace_windowMap_delImg(this);" href="javascript:void(0);">移除</a></div></div></li>';
                    $ul.prepend(newObj)
                }
            }
        });
    }
</script>