/**layui.use开始 */
layui.use(['admin', 'form', 'layer', 'formSelects','table', 'element', 'laydate','laypage'], function() {
    var admin = layui.admin,
        form = layui.form,
        layer = layui.layer,
        formSelects = layui.formSelects,
        element = layui.element,
        laydate = layui.laydate,
        laypage = layui.laypage,
        $ = layui.$,
        table = layui.table;
    form.render('select');
    form.render('radio');
    form.render('checkbox');
    laydate.render({
        elem: '#wishMainImageOrderTime', //渲染时间
        range: true
    });
    //选择分类弹框
    $('#wishMainImage_item').click(function(){
        admin.itemCat_select('layer-wish-mian-image','LAY-wish-mian-image-hidden','LAY-wish-mian-image-div')
    });
    //重置
    $("#wishMainImage_reset").click(function() {
        // console.log('reset')
        $("#wishMainImage_searchForm")[0].reset();
        $("#LAY-wish-mian-image-hidden").val('');
        $("#LAY-wish-mian-image-div").html('');
    });

});

//请求需要包含参数,首次获取默认,使用分页控件修改属性,并使用修改后的属性,在页面中搜索,重置为第一页
var limitAllAppoint = 100;//每页显示数据条数
var currentPageAllAppoint = 1;//当前页数
var dataLength = 0;//数据总条数

function wishMainImage_searchProd(notChangePage) {
    if(notChangePage){
        currentPageAllAppoint=notChangePage;
    }else{
        currentPageAllAppoint = 1; //当点击搜索的时候，应该回到第一页
    }
    dataLength = 0;
    wishMainImage_search();
}

function wishMainImage_toPage() {
    laypage = layui.laypage;
    //处理分页
    laypage.render({
        elem: 'wishMainImage_pagination',
        count: dataLength, //数据总数，从服务端得到
        layout: ['count', 'prev', 'page', 'next', 'limit', 'refresh', 'skip'],
        limits:[30,50,100,300],
        curr:currentPageAllAppoint,
        limit:limitAllAppoint,
        jump: function (obj, first) {
            currentPageAllAppoint = obj.curr;
            limitAllAppoint = obj.limit;
            //首次不执行
            if (!first) {
                wishMainImage_search()
            }
        }
    });
}


function wishMainImage_search(){
    var form = layui.form,
        laypage = layui.laypage;
    var data=wishMainImage_getSearchData();
    var table = layui.table;

    data.page=currentPageAllAppoint;
    data.limit=limitAllAppoint;
    loading.show();
    $.ajax({
        url: ctx + '/wishProductImage/queryList.html',
        type:"post",
        dataType: "json",
        contentType:"application/json;charset=utf-8",
        data: JSON.stringify(data),
        traditional: true,//确保数组传参正确
        success: function (returnData) {
            dataLength=returnData.count;
            html = template('wishMainImage_tpl', returnData);
            $('#wishMainImage_table').html(html);
            $('.wishMainImage_table_head table,.wishMainImage_table_body table').css({'width':'100%','margin':0,'table-layout':'fixed'});
            form.render('checkbox');
            loading.hide();
            wishMainImage_toPage();
        }
    });
}

function wishMainImage_getSearchData() {
    var data = new Object();
    //默认查待生成

    data.cateId = $("#wishMainImage_searchForm input[name=cateId]").val();
    //产品归属人
    data.bizzOwnerIds = [];
    var bizzOwnerContents = layui.formSelects.value("selectMan_wishMainImage");
    for (var j = 0; j < bizzOwnerContents.length; j++) {
        data.bizzOwnerIds.push(bizzOwnerContents[j].val);
    }
    data.auditTeam=$("#wishMainImage_searchForm select[name=auditTeam]").val();
    data.isSale = $("#wishMainImage_searchForm select[name=isSale]").val();
    //侵权状态
    data.isWishTort = $("#wishMainImage_searchForm select[name=isWishTort]").val();
    data.wishImgStatus = $("#wishMainImage_searchForm select[name=wishImgStatus]").val();

    //日期
    var timeStr = $("#wishMainImage_searchForm input[name=time]").val();
    if(timeStr) {
        data.startTime = Date.parse(timeStr.split(" - ")[0] + " 00:00:00");
        data.endTime =Date.parse(timeStr.split(" - ")[1] + " 23:59:59");
    }
    data.timeType = $("#wishMainImage_searchForm select[name=timeType]").val();
    data.orderTimeType = $("#wishMainImage_searchForm select[name=orderTimeType]").val();

    data.pSkus  = [];
    data.sSkus  = [];
    if("pSkus"==$("#wishMainImage_searchForm select[name=searchType]").val()){
        var pSkustmp = $("#wishMainImage_searchForm input[name=searchText]").val()
        if (pSkustmp.length>0) {
            pSkustmp=pSkustmp.split(",");
            if (pSkustmp.length > 0) {
                for (i = 0; i < pSkustmp.length; i++) {
                    data.pSkus.push(pSkustmp[i]);
                }
            }
        }
    }
    if("sSkus"==$("#wishMainImage_searchForm select[name=searchType]").val()){
        var sSkustmp=$("#wishMainImage_searchForm input[name=searchText]").val();
        if(sSkustmp.length>0){
            sSkustmp=sSkustmp.split(",");
        }
        if(sSkustmp.length>0){
            for(i=0;i<sSkustmp.length;i++){
                data.sSkus.push(sSkustmp[i]);
            }
        }
    }
    return data;
}

function wishMainImage_delNedd(id) {
    layer.confirm('您确认要删除这一项吗？', {icon: 3, title: '提示'}, function () {
        loading.show();
        $.ajax({
            type: "post",
            data:{"id":id},
            url: ctx + "/wishProductImage/delete.html",
            dataType: "json",
            success: function (returnData) {
                loading.hide();
                if (returnData.code == "0000") {
                    layui.layer.msg("成功删除");
                    wishMainImage_searchProd();
                } else {
                    layui.layer.msg(returnData.msg);
                }
            }
        })
    })
}

var wishMainImage_imgData = {
    img: {
        head: '',
        tpl: '<li draggable="true" style="width: 150px;margin-bottom:40px;border:1px solid #ccc;overflow:hidden">' +
        '<div class="ImgDivOut">' +
        '<div class="ImgDivIn" style="width:150px;height:150px;">' +
        '<input type="hidden" name="wishMainImg" value="&{url}">' +
        '<p class="wishMainImg_idInfo disN">&{id}</p>' +
        '<p class="wishMainImg_uuidInfo disN">&{uuid}</p>' +
        '<img  width="150" height="150" src="&{url}">' +
        '</div>' +
        '<div class="imgDivDown" style="width:150px">' +
        '<a onclick="wishMainIamge_editImg(this);" href="javascript:void(0);" style="float:left; color: #73a1bf;">编辑</a><a onclick="wishMainIamge_delImg(this);" href="javascript:void(0);" style="float:right; color: #73a1bf;">移除</a>' +
        '</div></div></div></li>'
    }
};

function wishMainIamge_delImg(obj) {
    layer.confirm('您确认要删除图片？', {icon: 3, title: '提示'}, function (index) {
        //设置数量
        var num = 0;
        $("#toEditWishMainImage_ul .ImgDivOut").each(function () {
            num++;
        })
        if(num<=1){
            layer.msg("至少保留一张图");
        }else {
            $(obj).closest('li').remove();
            layer.close(index);
        }
    });
}

var current_edit_uuid;
function wishMainIamge_editImg(obj) {
    // console.log(11);
    var  imgUrl = $(obj).closest('li').find('input').val();
    var  id = $(obj).closest('li').find('.wishMainImg_idInfo').val();
    var  uuid = $(obj).closest('li').find('.wishMainImg_uuidInfo').text();
        if(imgUrl.startsWith(wishMainImgIVP)){//用了wish主图地址

        }else{//用的模板地址
            imgUrl= tplIVP+imgUrl.substring(imgUrl.lastIndexOf("/")+1);
            imgUrl=imgUrl.replace("trade","hefei");
        }
    xiuxiu.loadPhoto(imgUrl, false, "xiuxiuEditor");//修改为要处理的图片url
    current_edit_uuid=uuid;
    $(obj).parents('li').addClass('imgSelected');
    $(obj).parents('li').siblings().removeClass('imgSelected');
}

function wishMainImage_openDetail(prodPId) {
    console.log("111");
    layer.open({
        type: 1,
        title: "设置wish图",
        area: ["100%", "100%"],
        btn: ["保存","保存并完成", "关闭"],
        content: $("#wishMainIage_Layer").html(),
        success: function(layero, index) {
            wishMainIamge_setxiuxiu();
            $.ajax({
                type: "post",
                data:{"id":prodPId},
                url: ctx + "/wishProductImage/getDetailInfo.html",
                dataType: "json",
                success: function (returnData) {
                    loading.hide();
                    if (returnData.code == "0000") {
                        $(returnData.data).each(function () {
                            var tpl = '';
                            tpl += wishMainImage_imgData['img']['tpl'];
                            //layer.msg(url);
                            //呵呵的url
                            //用的不一定是模板路径前缀
                            var hehe_url
                            if(this.imgName.startsWith("wish/")){//来自wish主图路径
                                hehe_url =wishMainImgIVP+this.imgName.substring(5,this.imgName.length);;//来自wish修改主图
                            }else{
                                hehe_url =tplIVP+this.imgName;//来自模板图
                            }
                            var div = tpl.replace(/&{url}/g, hehe_url).replace(/&{id}/g, this.id).replace(/&{uuid}/g,get_uuid());//图片完整信息

                            $('#toEditWishMainImage_ul').append(div);
                        });
                    } else {
                        layui.layer.msg(returnData.msg);
                    }
                }
            })
        },
        yes: function(index, layero) {
            wishMainIamge_ajax_edit(prodPId,false);
            return false;
        },
         btn2: function (index, layero) {
             wishMainIamge_ajax_edit(prodPId,true);
                return false;
        },
        end: function() {
        },
    });
}
function wishMainIamge_ajax_edit(prodPId,isOK) {
    var picList=[];
    //保存
    $('#toEditWishMainImage_ul').find('li').each(function(){
        picList.push($(this).find('input').val());
    });
    loading.show();

    $.ajax({
        url: ctx + '/wishProductImage/edit.html',
        type: "post",
        dataType: "json",
        data: {
            prodPId:prodPId,
            picArr:picList,
            isOK:isOK
        },
        traditional: true,//确保数组传参正确
        success: function (returnData) {
            loading.hide();
            if(returnData.code=='0000'){
                if(!isOK){
                    layer.msg("保存成功");
                }else{
                    layer.msg("保存并标记成功");
                }
            }else{
                layer.msg(returnData.msg);
            }
        }
    });
}

function wishMainIamge_searchLog(id) {
    layer.open({
        type: 1,
        title: '查看日志',
        shadeClose: false,
        area: ['60%','60%'],
        content: $('#wishProductImage_log_layer').html(),
        success:function () {
            layui.table.render({
                elem: '#wishProductImage_log_table',
                method: 'post',
                url: ctx + '/wishProductImage/searchLog.html',
                where:{'prodPId':id},
                cols: [[ //标题栏
                    {field: 'operTime', title: '时间' ,templet:"<div>{{layui.util.toDateString(d.operTime,'yyyy-MM-dd HH:mm:ss')}}</div>"}
                    ,{field: 'operator', title: '操作人'}
                    ,{field: 'operDesc', title: '操作'}
                ]],
            })
        }
    })
}

function  wishMainIamge_setxiuxiu() {
    // console.log(888);
    xiuxiu.embedSWF("xiuxiuEditor", 3, "100%", "100%", "xiuxiuEditor");
    /*URL信息*/
    xiuxiu.setUploadURL(window.location.protocol+"//"+window.location.host+ctx + "/wishProductImage/uploadPic.html");
    xiuxiu.setUploadType(2);
    // xiuxiu.setUploadArgs ({"id":123,"file":"Filedata.jpg"});//记录数据
    // xiuxiu.setUploadDataFieldName("Filedata");

    xiuxiu.onBeforeUpload = function(data, id) {
        data.width=1000;
        data.height=1000;
        data.type="jpg";
        return true;
    };
    xiuxiu.onInit = function() {};//初始化
    xiuxiu.onUploadResponse = function (returnDataStr)
    {
       var returnData = returnDataStr
        if(returnData.code=='0000'){//响应成功
            //修改当前选中的图片
            $('#toEditWishMainImage_ul').find('li').each(function(){
                if($(this).find('.wishMainImg_uuidInfo').text()==current_edit_uuid){
                    $(this).find('input').val(returnData.msg);
                    $(this).find('img').attr('src',returnData.msg);
                    layer.msg("编辑成功");
                }
            });
        }
    };
    xiuxiu.onDebug = function (data)
    {
        alert("错误响应" + data);
    };
}

function get_uuid() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    var uuid = s.join("");
    return uuid;
}

function  wishMainImage_addNedd() {
    var tpl = '';
    tpl += wishMainImage_imgData['img']['tpl'];
    //layer.msg(url);
    var div = tpl.replace(/&{url}/g,"").replace(/&{id}/g, "").replace(/&{uuid}/g,get_uuid());//图片完整信息
    $('#toEditWishMainImage_ul').append(div);
    
}