<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<title>joom修改图片</title>
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
                    <div class="layui-tab" lay-filter="joom_replace_windowMap_tab_filter">
                        <ul class="layui-tab-title">
                            <li class="layui-this">数量(<span id="joom_replace_windowMap_num_span"></span>)</li>
                        </ul>
                        <div style="position: absolute;top: 10px;right: 100px;" width="600px;">
                            <form class="layui-form" lay-filter="joom_replace_windowMap_url_form"
                                  id="joom_replace_windowMap_url_form">
                                <div class="layui-inline">
<%--                                    <label class="layui-form-label">图片URL<span style="color: red;">*</span></label>--%>
<%--                                    <div class="layui-input-inline" style="width: 400px;">--%>
<%--                                        <input type="text" id="joom_replace_windowMap_image_input" autocomplete="off"--%>
<%--                                               class="layui-input">--%>
<%--                                    </div>--%>
<%--                                    <button class="layui-btn ml20 layui-btn-sm" type="button"--%>
<%--                                            id="joom_replace_windowMap_image_add_btn">新增图片--%>
<%--                                    </button>--%>
<%--                                    <button class="layui-btn ml20 layui-btn-sm" type="button" id="joom_reback">还原--%>
<%--                                    </button>--%>
<%--                                    <button type="reset" class="layui-btn layui-btn-primary layui-btn-sm">清空</button>--%>
                                    <span style="color:red">(每个lisiting的图片不能超过8张)</span>
                                    <button type="button" id="joom_replace_windowMap_bacthUpdate_btn"
                                            class="layui-btn layui-btn-normal layui-btn-sm">批量修改
                                    </button>
                                </div>
                            </form>
                        </div>
                        <div id="joom_replace_windowMap_tab_content">
                            <table class="layui-table" id="joom_replace_img_table"
                                   lay-filter="joom_replace_img_table"></table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<!--图片显示模板-->
<script type="text/html" id="joom_replace_imgs_tpl">
    <div class="layui-clear pl20 imgContains" data-maxImg="8" data-minImg="1"
         data-imgObjType="11"
         data-id="joomModifyListingaPicture">
        <ul id="window_{{d.storeProdPId}}{{d.id}}" class="uploadImgUL ui-sortable">
            {{# if(d.mainImage != null && d.mainImage != ''){ }}
            <li draggable="true" class="imgBox_prodTpl ui-sortable-handle">
                <div class="ImgDivOut">
                    <div>
                        <input type="hidden" name="" value="{{d.mainImage}}"/>
                    </div>
                    <div class="ImgDivIn">
                        <img src="{{d.mainImage}}" alt="" class="imgCss img_show_hide detailImg_prodtpl dbclickCopyUrl lazy" title="双击即可复制路径"/>
                    </div>
                    <div class="h20"><a onclick="joom_replace_windowMap_delImg(this);" href="javascript:void(0);">移除</a>
                    </div>
                </div>
            </li>
            {{# } }}
            {{# layui.each((d.extraImages||'').split('|'),function(i,item){ }}
            {{# if(item != null && item != ''){ }}
            <li draggable="true" class="imgBox_prodTpl ui-sortable-handle">
                <div class="ImgDivOut">
                    <div>
                        <input type="hidden" name="" value="{{item}}"/>
                    </div>
                    <div class="ImgDivIn">
                        <img src="{{item}}" alt="" class="imgCss img_show_hide detailImg_prodtpl dbclickCopyUrl lazy" title="双击即可复制路径"/>
                    </div>
                    <div class="h20"><a onclick="joom_replace_windowMap_delImg(this);" href="javascript:void(0);">移除</a>
                    </div>
                </div>
            </li>
            {{# } }}
            {{# });}}
            <div style="float:right;">
                <div>
                    <div id="{{d.storeProdPId}}{{d.id}}"></div><!--图片上传按钮-->
                </div>
                <button class="layui-btn layui-btn-sm" type="button" style="margin:3px 0;"
                        onclick="joom_replace_windowMap_addItemImage('{{d.storeProdPId}}','{{d.id}}')">网络图片
                </button>
                <br/>
                <button class="layui-btn layui-btn-sm" type="button" style="margin:3px 0;"
                        onclick="joom_replace_windowMap_tempImg('{{d.prodPId}}','{{d.storeProdPId}}','{{d.id}}')">模板图片
                </button>
            </div>
            <div style="clear:both;"></div>
        </ul>
    </div>
</script>
<script type="text/html" id="joom_replace_img_operate_tpl">
    <span id="window_map_operate_tips_{{d.storeProdPId}}"></span>
</script>
<script src="${ctx}/static/jquery-ui.min.js"></script>
<script type="text/javascript" src="${ctx}/static/Huploadify/jquery.Huploadify.js"></script>
<script src="${ctx}/static/util/ImgCompareUtil.js?v=${ver}"></script>
<script>
    /**
     * joom修改图片
     */
    var joom_replace_windowMap_addItemImage;//公共函数
    var joom_replace_windowMap_tempImg; // 模板图片
    var checked_picture;
    var checked_main_picture;
    var checked_ass_picture;
    var ImgtimeUnit;
    layui.use(['admin', 'form', 'layer', 'formSelects', 'element', 'table', 'laypage'], function () {
        var admin = layui.admin,
            form = layui.form,
            table = layui.table,
            layer = layui.layer,
            $ = layui.$;

        /**
         * 批量修改
         */
        $("#joom_replace_windowMap_bacthUpdate_btn").click(function () {
            var itemData = table.checkStatus('joom_replace_img_table').data; //获取选择的店铺
            if (itemData == null || itemData.length < 1) {
                layer.msg("请选择lisiting", {icon: 0});
                return;
            }
            var storeProdPIds = [];
            var updateArray = [];
            for (var index in itemData) {
                var obj = itemData[index];
                var updateObj = {};
                var imageArray = [],oldImages = [];
                updateObj.id = obj.id;
                updateObj.prodPSku = obj.prodPSku;
                updateObj.storeSubSku = obj.storeSubSku;
                updateObj.storeAcctId = obj.storeAcctId;
                updateObj.storeAcct = obj.storeAcct;
                updateObj.storeProdPId = obj.storeProdPId;
                $('#window_' + obj.storeProdPId + obj.id).find("img").each(function () {
                    var imageUrl = $(this).attr("src");
                    if (imageUrl != null && imageUrl != '') {
                        imageArray.push(imageUrl);
                    }
                });
                if (imageArray.length > 8) {
                    layer.msg(obj.storeProdPId + ':橱窗图超过8张，请检查！')
                    return;
                } else {
                    updateObj.mainImage = imageArray[0]
                    updateObj.extraImages = imageArray.filter((item,index)=>index!=0).join("|")
                    updateArray.push(updateObj);
                    storeProdPIds.push(obj.storeProdPId);
                    $('#window_map_operate_tips_' + obj.storeProdPId).html("");
                    allItemSize = storeProdPIds.length;
                }
            }
            ;
            loading.show();
            $.ajax({
                type: "POST",
                url: ctx + "/onlineProductJoom/batchUpdateProdImageInfo",
                data: JSON.stringify({'infoList': updateArray}),
                contentType:"application/json",
                async: true,
                dataType: "json",
                success: function (returnData) {
                    console.log(returnData)
                    if (returnData.code == "0000") {
                        loading.hide()
                        layer.msg("提交成功");
                        let errObj = {}
                        if(returnData.data.failDetail.length != 0){
                            returnData.data.failDetail.forEach(item=>{
                                errObj[item.split(":")[0]] = item.split(item.split(":")[0]+':')[1]
                            })
                        }
                        var trObj = $('#joom_replace_img_table').next().find('.layui-table-body tbody').find('tr');
                        for (var i = 0; i < trObj.length; i++) {
                            var storeProdPId = $.trim(trObj.eq(i).find('td[data-field=storeProdPId] div').text());//平台商品Id
                            var checkStat = trObj.eq(i).find('td[data-field="0"] div').find('input').is(":checked");
                            if(errObj[storeProdPId] && checkStat){
                                trObj.eq(i).find('td[data-field="5"] div').html("<div style='color:red'>" + errObj[storeProdPId] + "</div>");
                            }else if(checkStat){
                                trObj.eq(i).find('td[data-field="5"] div').html("<div style='color:blue'>提交成功</div>");
                            }
                        }
                    }
                },
                error: function (err) {
                    loading.hide()
                    layer.msg(err.msg||"请求失败",{icon:2});
                }
            });
            //以当前时间戳作为批次号
            // var batchNo = new Date().getTime();
            // $.ajax({
            //     type: "POST",
            //     url: ctx + "/joomWatermark/batchUpdateWatermarks",
            //     data: JSON.stringify({'updateData': updateArray, 'batchNo': batchNo}),
            //     contentType:"application/json",
            //     async: true,
            //     dataType: "json",
            //     success: function (returnData) {
            //         if (returnData.code == "0000") {
            //             loading.hide()
            //             layer.msg("操作成功,稍等片刻为您显示操作结果");
            //         } else {
            //             setTimeout(function () {
            //                 loading.hide();
            //                 layer.msg(returnData.msg);
            //             }, 3000);
            //         }
            //     },
            //     error: function (err) {
            //         loading.hide()
            //         layer.msg(err.msg||"请求失败",{icon:2});
            //     }
            // });
            // ImgtimeUnit = setInterval(function () {
            //     sel(batchNo)
            // }, 5000);
        });

        // function sel(batchNo) {
        //     var trObj = $('#joom_replace_img_table').next().find('.layui-table-body tbody').find('tr');
        //     var count = 0;
        //     for (var i = 0; i < trObj.length; i++) {
        //         var checkStat = trObj.eq(i).find('td').eq(0).find('div').find('input').is(":checked");
        //         var resultMsg = trObj.eq(i).find('td').eq(5).find('.layui-table-cell').find('div').text();
        //         if ((resultMsg == '' || resultMsg == null) && checkStat) {
        //             count++;
        //         }
        //     }
        //     if (count == 0) {
        //         clearInterval(ImgtimeUnit);
        //         return;
        //     }
        //     $.ajax({
        //         type: "POST",
        //         url: ctx + "/sys/selectResult.html",
        //         data: {'batchNo': batchNo},
        //         async: true,
        //         dataType: "json",
        //         success: function (returnData) {
        //             if (returnData.code == "0000") {
        //                 var data = returnData.data;
        //
        //                 for (var i = 0; i < trObj.length; i++) {
        //                     var storeProdPId = $.trim(trObj.eq(i).find('td').eq(2).find('div').text());//平台商品Id
        //                     var checkStat = trObj.eq(i).find('td').eq(0).find('div').find('input').is(":checked");
        //                     var resultMsg = trObj.eq(i).find('td').eq(5).find('.layui-table-cell').find('div').text();
        //
        //                     var logMsg = data['TR_JOOM_UPDATE_WATERMARKS_MQ' + storeProdPId];
        //                     if ((resultMsg == '' || resultMsg == null) && checkStat) {
        //                         if (logMsg == '修改成功') {
        //                             trObj.eq(i).find('td').eq(5).find('.layui-table-cell').html("<div style='color:blue'>" + logMsg + "</div>");
        //                         } else if (logMsg != '' && logMsg != null && logMsg != 'undefined') {
        //                             trObj.eq(i).find('td').eq(5).find('.layui-table-cell').html("<div style='color:red'>" + logMsg + "</div>");
        //                         }
        //                     }
        //                 }
        //             }
        //         },
        //         error: function (err) {
        //             layer.msg(err.msg||"请求失败",{icon:2});
        //             clearInterval(ImgtimeUnit);
        //         }
        //     });
        // }

        var imageurl;

        /**
         * 加载数据
         */
        // if(table.checkStatus('joom_online_data_table').data.length == 0){
        //     return layer.alert("请选择数据",{icon:7})
        // }else{
        commonReturnPromise({
            url: ctx + `/onlineProductJoom/getForBatchUpdateProdExtraImageInfo`,
            type: 'post',
            contentType: 'application/json',
            params:JSON.stringify({
                ids:table.checkStatus('joom_online_data_table').data.map(item=>item.id)
            })
        }).then(res=>{
            table.render({
                elem: "#joom_replace_img_table",
                data: res,
                limit: res.length,
                page:false,
                height: 500,
                cols: [
                    [
                        {checkbox: true, width: 30},
                        {field: "storeAcct", title: "店铺", width: 100, style: "vertical-align: top;"},
                        {field: "storeProdPId", title: "产品id", width: 100, style: "vertical-align: top;"},
                        {field: "prodPSku", title: "商品父sku", width: 110, style: "vertical-align: top;"},
                        {
                            field: "pImages",
                            title: "橱窗图(第一张图片为主图)",
                            style: "vertical-align: top;",
                            templet: '#joom_replace_imgs_tpl'
                        },
                        {title: '操作结果', width: 180, align: 'center', style: "vertical-align: top;"}
                    ],
                ],
                done: function (res, curr, count) {
                    console.log(res)
                    $("[data-field='storeAcctId']").css('display', 'none');
                    // if (res.code == '0000') {
                        $("#joom_replace_windowMap_num_span").html(table.checkStatus('joom_online_data_table').data.length);//数量
                        $(res.data).each(function (index, item) { //拖拽
                            //调用公共方法
                            uploadInit(item.storeProdPId,item.id)
                        });
                    // }
                },
                id: "joom_replace_img_table",
            });
        })
        // 模板图片
        joom_replace_windowMap_tempImg = function (prodPId,storeProdPId,id){
            var index = layer.open({
                type: 1,
                title: '选择模板图片添加-橱窗图不能超过8张',
                area: ['1200px', '500px'],
                id: 'templetImgSuccess',
                content: '<form id="joom_picture_form" class="layui-form"><div style="width:1200px;height:80px;float:left;dispaly:block;"><label class="layui-form-label">主图:</label>' +
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
                                                    '                            <input type="checkbox" name="check_picture" value="'+imgarr[i].name+'"/><img src="'+imgarr[i].name+'" onclick="joom_checked_picture(this)"  class="templet_map_imgCss">' +
                                                    '                        </div>' +
                                                    '                    </li>';
                                            }
                                            if(imgarr[i].isAssist == true){
                                                assHtml +='<li style="padding: 5px 0;" class="window_map_imgLi">' +
                                                    '                        <div class="window_map_imgDiv">' +
                                                    '                            <input value="'+imgarr[i].name+'" name="check_picture" type="checkbox"/><img src="'+imgarr[i].name+'" onclick="joom_checked_picture(this)"   class="templet_map_imgCss">' +
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
                    var ulObj = $('#window_' + storeProdPId+id);
                    var oripictLen = ulObj.find("li").length;
                    var templetPic = [];
                    $("#joom_picture_form input[type=checkbox]:checked").each(function() {
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
        joom_checked_picture = function (obj) {
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
        joom_replace_windowMap_addItemImage = function (storeProdPId,id) {
            var index = layer.open({
                type: 1,
                title: '添加lisiting图片-橱窗图不能超过8张',
                area: ['800px', '300px'],
                id: 'mainNetImgSuccess',
                content: '<div class="p20 pl20"><textarea class="layui-textarea" id="joom_replace_windowMap_addItem_url_input" placeholder="请填写URL,多个地址用回车换行"></textarea></div>',
                btn: ['确定', '关闭'],
                success: function (layero) {
                    form.render();
                },
                yes: function (index, layero) {
                    var url = $.trim($("#joom_replace_windowMap_addItem_url_input").val());
                    if (url == null || url == "") {
                        layer.msg("图片地址不能为空！", {icon: 7});
                        return false;
                    }
                    var urlArray = url.split("\n");
                    if (urlArray.length > 8) {
                        layer.msg("图片不能超过8张！", {icon: 7});
                        return false;
                    }
                    // 去一下空格
                    var ulObj = $('#window_' + storeProdPId+id);
                    for (var i in urlArray) {
                        var imageUrl = $.trim(urlArray[i]);
                        // if (ulObj.find("li").length >= 8) {
                        //     layer.close(index);
                        //     return;
                        // }
                        var lastObj = ulObj.find("li").last();
                        var newObj;
                        if(lastObj.length != 0){
                            newObj = lastObj.clone();
                            $(newObj).find("img").attr("src", imageUrl);
                            lastObj.after(newObj);//添加新元素
                        }else{
                            newObj = '<li draggable="true" class="imgBox_prodTpl ui-sortable-handle"><div class="ImgDivOut"><div><input type="hidden" name="" value="'+ imageurl +'"/></div><div class="ImgDivIn">\n' +
                                '                                <img src="'+ imageurl +'" alt="" class="imgCss img_show_hide detailImg_prodtpl dbclickCopyUrl lazy" title="双击即可复制路径"/>\n' +
                                '                                </div><div class="h20"><a onclick="joom_replace_windowMap_delImg(this);" href="javascript:void(0);">移除</a></div></div></li>';
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

        function checkImgRepeatJoom(allImges) {
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
    });

    /**
     * 橱窗图删除
     * @param obj
     */
    function joom_replace_windowMap_delImg(obj) {
        var oripictLen = $(obj).parents().children('li').length;
        if (oripictLen <= 1) {
            layer.msg("至少保留一张图片！");
            return;
        }
        $(obj).closest('li').remove()
    }

    function joomPublishInitWatermarkImage(data, id) {
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
                        '                    </div><div class="h20"><a onclick="joom_replace_windowMap_delImg(this);" href="javascript:void(0);">移除</a></div></div></li>';
                    $ul.prepend(newObj)
                }
            }
        });
    }
</script>