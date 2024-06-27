var wishEditVarMainImgArr = [];//用来存储上一步的图片url
/**layui.use开始 */
layui.use(['admin', 'form', 'layer', 'formSelects', 'table', 'element', 'laydate', 'laypage'], function () {
    var admin = layui.admin,
        form = layui.form,
        layer = layui.layer,
        element = layui.element,
        laydate = layui.laydate,
        laypage = layui.laypage,
        $ = layui.$,
        table = layui.table;

    render_hp_orgs_users("#wish_edit_variantMainImg_searchForm");
    form.render('select');
    form.render('radio');
    form.render('checkbox');


    //展示已知数据
    table.render({
        elem: "#wishVarImgEdit_table",
        method: "post",
        url: ctx + "/wishProductImage/querySubSKuImage.html?",
        where: wishEditVarMainImg_getTaleRequest(),
        height: 500,
        cols: [
            [
                //标题栏
                {type: "checkbox"},
                {field: "storeAcct", title: "店铺"},
                { field: "id", title: "id",width: 100 },//隐藏
                { field: "imgDomain", title: "店铺域名",width: 100 },//隐藏
                { field: "pId", title: "pId",width: 100 },//隐藏
                {
                    field: "storeSSku",
                    title: "店铺子sku",
                },
                {
                    field: "subMainImage",
                    title: "属性图",
                    templet: "#variantMainImageJs",
                    width: 400
                },
                {
                    field: "isPromotion",
                    templet:"#wishEditVariantImgIsTpl",
                    title: "是否黄钻"
                },
                {
                    field: "optStatus",
                    templet: "#wishVarImgEdit_optStatusJs",
                    title: "操作结果",
                },
            ],
        ],
        done: function (res, curr, count) {
            $('#wishVarImgEdit_table').next().find("[data-field='id']").css('display','none');//隐藏列
            $('#wishVarImgEdit_table').next().find("[data-field='imgDomain']").css('display','none');//隐藏列
            $('#wishVarImgEdit_table').next().find("[data-field='pId']").css('display','none');//隐藏列
            if(res.data) {
                $("#wish_edit_variantMainImg_num").text(res.data.length);
            }else{
                $("#wish_edit_variantMainImg_num").text('0');
            }
        },
        id: "wishVarImgEdit_table"
    });

    // 搜索
    var active = {
        reload: function () {
            var status = $(
                "#wishAcctSearchForm select[name='status'] option:selected"
            ).val();
            var syncStatus = $("#wishSyncListingStatus").val();//同步listing状态
            var storeAcct = $("#wishAcctSearchForm input[name='storeAcct']").val();
            var orgId = $("#wishAcctSearchForm select[name='orgId']").val();
            var salespersonId = $("#wishAcctSearchForm select[name='salespersonId']").val();
            //执行重载
            table.reload("wishVarImgEdit_table", {
                where: wishEditVarMainImg_getTaleRequest(),
            });
        },
    };

    $("#wish_edit_variantMainImg_searchBtn").click(function () {
        var type = $(this).data("type");
        active[type] ? active[type].call(this) : "";
    });

});

//替换主图
function wishEditVarMainImg_replaceVariantImg() {
    //用于替换的主图
    var replaceMianImg = $("#wishEditVarMainImg_imgText").val();
    if (replaceMianImg == null || replaceMianImg == "") {
        layer.msg("图片地址不能为空！", {icon: 5});
        return false;
    }
    //获取需要被替换的主图和
    //草,只能通过tble获取
    if ($('#wishVarImgEdit_table').parent().find('.layui-form-checked').length < 1) {
        layer.alert("至少选择一条数据");
        return;
    }

    wishEditVarMainImgArr = [];
    $('.wishEditVarMainImg_revert').removeClass('layui-btn-disabled')

    // console.log(2);
    var trList = $('#wishVarImgEdit_table').next().find('.layui-table-body table tbody tr');
    for (var i = 0; i < trList.length; i++) {
        if (trList.eq(i).find('input[type=checkbox]').prop('checked')) {
            // //获取主图
            // var mainImg=trList.eq(i).find('.wishEditVarMainImg_imgs_div .wish_edit_var_mainImg img').attr("src");
            var storeImgDomain = trList.eq(i).find('td[data-field="imgDomain"] div').text();
            var saveImg = replaceMianImg.replace(imgDomainName, storeImgDomain);
            var varImg = trList.eq(i).find('.wishEditVarMainImg_imgs_div .wish_edit_var_mainImg img');
            wishEditVarMainImgArr.push(varImg.attr('src'))
            // console.log(storeImgDomain);
            // console.log(saveImg);
            varImg.attr("src", saveImg);
        }
    }

    //看是否被勾选
}



//单行添加图片
function wishEditVarMainImg_replaceImg(obj) {
    var index = layer.open({
        type: 1,
        title: '替换图片',
        id: 'wishEditVarMainImg_replaceImgId',
        area: ['50%', '40%'],
        btn: ['保存', '关闭'],
        content: '<div style="padding:20px"><textarea class="layui-textarea" placeholder="请输入图片地址" id="wishEditVarMainImg_addImgVal"></textarea></div>',
        success: function (layero, index) {
            console.log(layero);
        },
        yes: function (index, layero) {
            var addImg = $("#wishEditVarMainImg_addImgVal").val();
            if (addImg == null || addImg == "") {
                layer.msg("图片地址不能为空！", {icon: 5});
                return false;
            }
            var storeImgDomain = $(obj).parents('tr').find('td[data-field="imgDomain"] div').text();
            var saveImg = addImg.replace(imgDomainName, storeImgDomain);
            $(obj).parent().find(".wish_edit_var_mainImg img").attr("src",saveImg);
            layer.close(index);
        },
        end: function () {
            layer.close(index);
        },
    })
}

//查询请求参数
function wishEditVarMainImg_getTaleRequest() {
    var request = {};
    /**
     * 初始化时搜索
     */
    if ($("#wish_edit_variantMainImg_ids_hidden").length > 0) {
        //获取在线商品被勾选的id列表
        request.syncPIds = $("#wish_edit_variantMainImg_ids_hidden").val();
    }
    $("#wish_edit_variantMainImg_ids_hidden").remove();
    request.skuVagueFlag = $("#wish_edit_variantMainImg_searchForm select[name='skuVagueFlag']").val();
    request.prodSSkus = $("#wish_edit_variantMainImg_searchForm input[name='prodSSkus']").val();
    request.storeAcctId = $("#wish_edit_variantMainImg_searchForm select[name='storeAcctId']").val();

    return request;
}

var eidtVarImg_timeUnit;
var editVarImg_allItemSize=0;

function  wishEditVarMainImg_batchEdit() {
    eidtVarImg_timeUnit=0;
    editVarImg_allItemSize=0;
    //草,只能通过tble获取,依靠layui页面的元素解析
    if ($('#wishVarImgEdit_table').parent().find('.layui-form-checked').length < 1) {
        layer.alert("至少选择一条数据");
        return;
    }
    console.log(2);
    var request=[];
    var ids = [];
    var trList = $('#wishVarImgEdit_table').next().find('.layui-table-body table tbody tr');
    for (var i = 0; i < trList.length; i++) {
        if (trList.eq(i).find('input[type=checkbox]').prop('checked')) {
            var dto={};
            // //获取主图
            dto.mainImg=trList.eq(i).find('.wishEditVarMainImg_imgs_div .wish_edit_var_mainImg img').attr("src");
            dto.id=trList.eq(i).find('td[data-field="id"] div').text();
            dto.storeSSku=trList.eq(i).find('td[data-field="storeSSku"] div').text();
            dto.pId=trList.eq(i).find('td[data-field="pId"] div').text();
            request.push(dto);
            ids.push(dto.id);
        }
    }
    editVarImg_allItemSize=request.length;

    //请求
    loading.show();
    $.ajax({
        type: "POST",
        // url: ctx + "/wishProductImage/batchEditSubSKuImage.html",
        url: ctx + "/wishProductImage/batchEditSubSKuImage",
        data: JSON.stringify(request),
        contentType:'application/json',
        async: true,
        dataType: "json",
        success: function (returnData) {
            loading.hide();
            if (returnData.code == "0000") {
                layui.layer.msg(returnData.msg,{icon:1});
                eidtVarImg_timeUnit= setInterval(function () {
                    wishEditVarMainImg_getDealProcess(ids);
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
function wishEditVarMainImg_getDealProcess(ids){
    $.ajax({
        type: "POST",
        url: ctx + "/wishProductImage/getEditVarMainImgProcess.html",
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
                    $('#wishVarImgEdit_optStatus_' + this).html(tips);
                });
                if (dealItemSize == editVarImg_allItemSize) {//全部完成
                    clearInterval(eidtVarImg_timeUnit);//清除定时查询进度
                    console.log("已全部完成，清除定时任务");
                }
            }
        }
    });
}

//还原功能函数
function wishEditVarMainImg_revert(obj){
   if($(obj).hasClass('layui-btn-disabled')){
       return;
   }
//    console.log(wishEditVarMainImgArr)
$("#wishEditVarMainImg_imgText").val('');
   var  ckdes = $('#wishVarImgEdit_table').next().find('.layui-table-body table tbody tr .layui-form-checked');
   for(var i = 0; i< ckdes.length; i++){
       $(ckdes[i]).parents('tr').find('.wish_edit_var_mainImg img').attr('src',wishEditVarMainImgArr[i])
   }
}