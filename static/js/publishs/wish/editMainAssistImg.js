/**
 * wish修改主辅图
 */
var editMainAssistImgSwitch = false,//定义一个全局变量判断替换主图按钮 有没有被点击
editMainAssistImgOrigin = [],//原始的空数组 用来存放主图url
editMainAssistImgInput = '';//接受input的值
var wish_show_templet_picture;
var wish_checked_picture;

layui.use(['admin', 'form', 'layer', 'formSelects', 'element', 'table', 'laypage'], function () {
    var admin = layui.admin,
        form = layui.form,
        table=layui.table;
        layer = layui.layer,
        $ = layui.$;
        form.render();
    render_hp_orgs_users("#wish_edit_mainAssistImg_searchForm");

    //展示已知数据
    table.render({
        elem: "#wish_edit_mainAssistImg_table",
        method: "post",
        where:wishEditMAImg_getTaleRequest(),
        url: ctx + "/wishProductImage/queryMainAssistImage.html",
        height: 500,
        cols: [
            [
                //标题栏
                { type: "checkbox" },
                { field: "storeAcct", title: "店铺"},
                { field: "id", title: "id" },//隐藏
                { field: "imgDomain", title: "店铺域名" },//隐藏
                {
                    field: "pSku",
                    title: "店铺父sku"
                },
                {
                    field: "mainAssistImgs",
                    title: "属性图",
                    templet: "#mainAssistImageJs",
                    width: 800
                },
                {
                    field: "isPromotion",
                    title: "是否黄钻",
                    templet:"#trueFalseTpl"
                },
                {
                    field: "optStatus",
                    templet: "#wishEditMAImg_optStatusJs",
                    title: "操作结果"
                },
            ],
        ],
        done: function(res, curr, count){
            // $("[data-field='id']").css('display','none');//隐藏列
            $('#wish_edit_mainAssistImg_table').next().find("[data-field='id']").css('display','none');//隐藏列
            // $("[data-field='imgDomain']").css('display','none');//隐藏列
            $('#wish_edit_mainAssistImg_table').next().find("[data-field='imgDomain']").css('display','none');//隐藏列
            if(res.data) {
                $("#wish_edit_mainAssistImg_num").text(res.data.length);
            }else{
                $("#wish_edit_mainAssistImg_num").text('0');
            }
            //获取所有的辅图图片所在的li
            var assistImg = $('.wish_edit_mainAssistImg_ul');
            for(var i=0;i<assistImg.length;i++){
                var obj = assistImg[i];
                $(obj).sortable({
                    revert: true,
                    containment: "parent",
                    cursor: "move",
                    opacity: 0.6
                });
            }
        },
        id: "wish_edit_mainAssistImg_table"
    });

    // 搜索
    var active = {
        reload: function() {
            //执行重载
            table.reload("wish_edit_mainAssistImg_table", {
                where:wishEditMAImg_getTaleRequest(),
            });
        },
    };

    $("#wish_edit_mainAssistImg_searchBtn").click(function() {
        var type = $(this).data("type");
        active[type] ? active[type].call(this) : "";
    });


    /**
     * 打开模板图片
     */
    wish_show_templet_picture = function (prodPId,itemId,obj){
        console.log(prodPId)
        var index = layer.open({
            type: 1,
            title: '选择模板图片添加',
            area: ['1200px', '500px'],
            id: 'templetImgSuccess',
            content: '<form id="wish_picture_form" class="layui-form"><div style="width:1200px;height:80px;float:left;dispaly:block;"><label class="layui-form-label">主图:</label>' +
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
                                                '                            <input type="checkbox" name="check_picture" value="'+imgarr[i].name+'"/><img src="'+imgarr[i].name+'" onclick="wish_checked_picture(this)" class="templet_map_imgCss">' +
                                                '                        </div>' +
                                                '                    </li>';
                                        }
                                        if(imgarr[i].isAssist == true){
                                            assHtml +='<li style="padding: 5px 0;" class="window_map_imgLi">' +
                                                '                        <div class="window_map_imgDiv">' +
                                                '                            <input value="'+imgarr[i].name+'" name="check_picture" type="checkbox"/><img src="'+imgarr[i].name+'"  onclick="wish_checked_picture(this)" class="templet_map_imgCss">' +
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
                var templetPic = [];
                $("#wish_picture_form input[type=checkbox]:checked").each(function() {
                    var name = $(this).val();
                    templetPic.push(name);
                });

                if(templetPic){
                    for (var i in templetPic) {
                        var imageUrl = $.trim(templetPic[i]);
                        $(obj).closest('.wishEditMAImg_imgs_div').find('ul').append(
                            '<li>' +
                            '<img src=' + imageUrl +'>'+
                            '<div class="ovhi handle-img">' +
                            '<span class="setMain-img" onclick="wishEditMAImg_setAsMainImg(this)">设为主图</span>' +
                            '<span class="remove-img" onclick="wishEditMAImg_delImg(this)">移除</span>' +
                            '</div>' +
                            '</li>');
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
     * 点击图片选中checkbox
     * @param obj
     */
    wish_checked_picture = function (obj) {
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
function wishEditMAImg_delImg(obj) {
    var index = layer.confirm('您确认要删除图片？', {icon: 3, title: '提示'}, function () {
        layer.close(index);
        $(obj).closest('li').remove();
    });
}

/**
 * 设置为主图
 * @param obj
 */
function wishEditMAImg_setAsMainImg(obj) {
    var index = layer.confirm('您确认要设置为图片？', {icon: 3, title: '提示'}, function () {
        layer.close(index);
        var thisImg = $(obj).closest('li').find('img').attr('src');
        var mianImg = $(obj).closest('.wishEditMAImg_imgs_div').find('.wish_edit_mainImg').find('img').attr('src');
        // console.log(thisImg);
        // console.log(mianImg);

        $(obj).closest('li').find('img').attr('src',mianImg);
        $(obj).closest('.wishEditMAImg_imgs_div').find('.wish_edit_mainImg').find('img').attr('src',thisImg);
    });
}

//替换主图
function wishEditMAImg_replaceMainImg(){
    //用于替换的主图
    var replaceMianImg=$("#wishEditMAImg_imgText").val();//input内容
    if (replaceMianImg == null || replaceMianImg == "") {
        layer.msg("图片地址不能为空！", {icon: 5});
        return false;
    }
    //获取需要被替换的主图和
    //草,只能通过tble获取
    if($('#wish_edit_mainAssistImg_table').parent().find('.layui-form-checked').length<1){
        layer.alert("至少选择一条数据");
        return;
    }

    editMainAssistImgOrigin = []
    $('.wish_edit_mainAssistImg_revert').removeClass('layui-btn-disabled')


    var trList=$('#wish_edit_mainAssistImg_table').next().find('.layui-table-body table tbody tr');
    for(var i=0;i<trList.length;i++){
        if(trList.eq(i).find('input[type=checkbox]').prop('checked')){
            // //获取主图
            // var mainImg=trList.eq(i).find('.wishEditMAImg_imgs_div .wish_edit_mainImg img').attr("src");
            var storeImgDomain=trList.eq(i).find('td[data-field="imgDomain"] div').text(),
             saveImg=replaceMianImg.replace(imgDomainName,storeImgDomain),
             mainImg = trList.eq(i).find('.wishEditMAImg_imgs_div .wish_edit_mainImg img');
             editMainAssistImgOrigin.push(mainImg.attr('src'));
             mainImg.attr("src",saveImg);
        }
    }

    //看是否被勾选
}


//添加辅助图
function wishEditMAImg_addAssistImg(){
    //用于替换的图
    var addAssistImg=$("#wishEditMAImg_imgText").val();
    if (addAssistImg == null || addAssistImg == "") {
        layer.msg("图片地址不能为空！", {icon: 5});
        return false;
    }
    //草,只能通过tble获取
    if($('#wish_edit_mainAssistImg_table').parent().find('.layui-form-checked').length<1){
        layer.alert("至少选择一条数据");
        return;
    }
    //选择数据和input有值以后 移除disabled类名
    $('.wish_edit_assistImg_revert').removeClass('layui-btn-disabled');
    editMainAssistImgInput = addAssistImg;
    // console.log(2);
    var trList=$('#wish_edit_mainAssistImg_table').next().find('.layui-table-body table tbody tr');//获取tr列表
    for(var i=0;i<trList.length;i++){
        if(trList.eq(i).find('input[type=checkbox]').prop('checked')){
            var storeImgDomain=trList.eq(i).find('td[data-field="imgDomain"] div').text();
            var saveImg=addAssistImg.replace(imgDomainName,storeImgDomain);

            trList.eq(i).find('td[data-field="mainAssistImgs"] ul').append(
                '<li>' +
                '<img src=' + saveImg +'>'+
                '<div class="ovhi handle-img">' +
                '<span class="setMain-img" onclick="wishEditMAImg_setAsMainImg(this)">设为主图</span>' +
                '<span class="remove-img" onclick="wishEditMAImg_delImg(this)">移除</span>' +
                '</div>' +
                '</li>');
        }
    }
}

//单行添加图片
function wishEditMAImg_addImg(obj){
    var index = layer.open({
        type: 1,
        title: '添加图片',
        id: 'wish_edit_mainAssistImg_addId',
        area: ['50%','40%'],
        btn: ['保存','关闭'],
        content: '<div style="padding:20px"><textarea class="layui-textarea" placeholder="请输入图片地址，多个换行" id="wishEditMAImg_addImgVal"></textarea></div>',
        success: function(layero,index){
            // console.log(layero);
        },
        yes: function(index,layero){
            var addImg=$("#wishEditMAImg_addImgVal").val();
            if (addImg == null || addImg == "") {
                layer.msg("图片地址不能为空！", {icon: 5});
                return false;
            }
            if(addImg){
                var urlArray = addImg.split("\n");
                for (var i in urlArray) {
                    var imageUrl = $.trim(urlArray[i]);
                    $(obj).closest('.wishEditMAImg_imgs_div').find('ul').append(
                        '<li>' +
                        '<img src=' + imageUrl +'>'+
                        '<div class="ovhi handle-img">' +
                        '<span class="setMain-img" onclick="wishEditMAImg_setAsMainImg(this)">设为主图</span>' +
                        '<span class="remove-img" onclick="wishEditMAImg_delImg(this)">移除</span>' +
                        '</div>' +
                        '</li>');
                }
            }
            layer.close(index);
        },
        end:function(){
            layer.close(index);
        },
    })
}
//查询请求参数
function wishEditMAImg_getTaleRequest(){
    var request={};
    /**
     * 初始化时搜索
     */
    if ($("#wish_edit_mainAssistImg_ids_hidden").length > 0) {
        //获取在线商品被勾选的id列表
        request.syncPIds = $("#wish_edit_mainAssistImg_ids_hidden").val();
    }
    $("#wish_edit_mainAssistImg_ids_hidden").remove();
    request.skuVagueFlag = $("#wish_edit_mainAssistImg_searchForm select[name='skuVagueFlag']").val();
    request.prodPSkus = $("#wish_edit_mainAssistImg_searchForm input[name='prodPSkus']").val();
    request.storeAcctId = $("#wish_edit_mainAssistImg_searchForm select[name='storeAcctId']").val();

    return request;
}

var eidtMAImg_timeUnit;
var eidtMAImg_allItemSize=0;

function  wishEditMAImg_batchEdit() {
    eidtMAImg_timeUnit=0;
    eidtMAImg_allItemSize=0;
    //草,只能通过tble获取,依靠layui页面的元素解析
    if ($('#wish_edit_mainAssistImg_table').parent().find('.layui-form-checked').length < 1) {
        layer.alert("至少选择一条数据");
        return;
    }
    // console.log(2);
    var request=[];
    var ids = [];
    var trList = $('#wish_edit_mainAssistImg_table').next().find('.layui-table-body table tbody tr');
    for (var i = 0; i < trList.length; i++) {
        if (trList.eq(i).find('input[type=checkbox]').prop('checked')) {
            var dto={};
            // //获取主图
            dto.mainImg=trList.eq(i).find('.wishEditMAImg_imgs_div .wish_edit_mainImg img').attr("src");

            var assistImgs=[];
            //获取辅助图
            trList.eq(i).find('td[data-field="mainAssistImgs"] ul li').each(function () {
                var assImg=$(this).find('img').attr("src");
                assistImgs.push(assImg);
            })
            dto.assistImgs=assistImgs.join('|');
            dto.id=trList.eq(i).find('td[data-field="id"] div').text();
            request.push(dto);
            ids.push(dto.id);
        }
    }
    eidtMAImg_allItemSize=request.length;

    //请求
    loading.show();
    $.ajax({
        type: "POST",
        url: ctx + "/wishProductImage/batchEditMainAssistImage.html",
        data: {'updateArray':JSON.stringify(request)},
        async: true,
        dataType: "json",
        success: function (returnData) {
            loading.hide();
            if (returnData.code == "0000") {
                layui.layer.msg(returnData.msg,{icon:1});
                eidtMAImg_timeUnit= setInterval(function () {
                    wishEditMAImg_getDealProcess(ids);
                }, 5000); //每间隔5s查询一次进度
            } else {
                layui.layer.msg(returnData.msg,{icon:2});
            }
        },
        error: function () {
            loading.hide();
            layui.layer.msg("服务器正忙",{icon:2});
        }
    });

}

/**
 * 获取调整进度
 * @param ids
 */
function wishEditMAImg_getDealProcess(ids){
    $.ajax({
        type: "POST",
        url: ctx + "/wishProductImage/getEditMainAssistImgProcess.html",
        data: {ids: ids.join(",")},
        dataType: "json",
        success: function (returnData) {
            var dealItemSize=0;
            if (returnData.code == "0000") {
                $(ids).each(function () {
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
                    $('#wishEditMAImg_optStatus_' + this).html(tips);
                });
                if (dealItemSize == eidtMAImg_allItemSize) {//全部完成
                    clearInterval(eidtMAImg_timeUnit);//清除定时查询进度
                    console.log("已全部完成，清除定时任务");
                }
            }
        }
    });
}
//主图还原功能
function wishEditMAImg_revert(obj){
    if($(obj).hasClass('layui-btn-disabled')){
        return;
    }
    // console.log(editMainAssistImgOrigin);
    $("#wishEditMAImg_imgText").val('');
    // console.log(newArr);
    var ckdes = $('#wish_edit_mainAssistImg_table').next().find('.layui-table-body table tbody .layui-form-checked');//获取到被选中checkbox
    // console.log(ckdes)
    for(var i =0; i<ckdes.length;i++){
        $(ckdes[i]).parents('tr').find('.wish_edit_mainImg img').attr('src',editMainAssistImgOrigin[i])
    }
 }
 //辅图还原功能
 function wishEditAssistImg_revert(obj){
     if($(obj).hasClass('layui-btn-disabled')){
         return;
     }
    //  console.log(editMainAssistImgInput);
     var ckdes = $('#wish_edit_mainAssistImg_table').next().find('.layui-table-body table tbody tr .layui-form-checked');//获取checked列表
     for(var i=0;i<ckdes.length;i++){
        var li = $(ckdes[i]).parents('tr').find('.wish_edit_mainAssistImg_ul li:last-child');
        if(li.find('img').attr('src') == editMainAssistImgInput){
            li.remove();
        }
     }
     $("#wishEditMAImg_imgText").val('')
 }