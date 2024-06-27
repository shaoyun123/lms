/**layui.use开始 */
layui.use(['admin', 'form', 'layer', 'formSelects', 'table', 'element', 'laydate', 'laypage'], function () {
    var admin = layui.admin,
        form = layui.form,
        layer = layui.layer,
        formSelects = layui.formSelects,
        element = layui.element,
        laydate = layui.laydate,
        laypage = layui.laypage,
        $ = layui.$
    // $("#shopifyPublish_searchForm select[name=tortBanListing]").val("CURRENT_PLAT");

    form.render('select')
    form.render('radio')
    form.render('checkbox')
    formSelects.render('selectMan_shopify');
    formSelects.render('selectAttr_shopify');
    render_hp_orgs_users("#shopifyPublish_searchForm");
    laydate.render({
        elem: '#shopifyPublishTime', //渲染时间
        range: true
    });

    // 选择店铺所在组织
    // form.on('select(shopifyPublish_group_sel)', function (data) {
    //     var orgId = $.trim($("#shopifyPublish_group_sel").val());
    //     if (orgId != null) {
    //         $.ajax({
    //             type: "post",
    //             url: ctx + "/sys/listuserbyorgcode.html",
    //             dataType: "json",
    //             data: {orgId: orgId},
    //             success: function (returnData) {
    //                 if (returnData.code == "0000") {
    //                     var str = "<option value=''></option>";
    //                     $.each(returnData.data, function (i, v) {
    //                         str += "<option value='" + v.id + "'>" + v.userName + "</option>";
    //                     });
    //                     $("#shopifyPublish_salesman_sel").html(str);
    //                     form.render('select');
    //                 } else {
    //                     layer.msg(returnData.msg);
    //                 }
    //             }
    //         });
    //     } else {
    //         var str = "<option value=''></option>";
    //         $("#shopifyPublish_salesman_sel").html(str);  //清空人员框
    //     }
    // });

    // 选择店铺所在组
    // form.on('select(shopifyPublish_salesman_sel)', function (data) {
    //     var userId = $.trim($("#shopifyPublish_salesman_sel").val());
    //     var input = {};
    //     input.userId = userId;
    //
    //     $.ajax({
    //         type: "post",
    //         data: input,
    //         url: ctx + "/onlineProductJoom/getUserJoomPlatAcct.html",
    //         dataType: "json",
    //         success: function (returnData) {
    //             if (returnData.code == "0000") {
    //                 var str = "<option value=''></option>";
    //                 currentStoreAccts = []
    //                 $.each(returnData.data, function (i, v) {
    //                     str += "<option value='" + v.id + "'>" + v.storeAcct + "</option>";
    //                     currentStoreAccts.push(v.id);
    //                 });
    //                 $("#shopifyPublish_searchForm select[name=storeAcctId]").html(str);
    //                 form.render('select');
    //             } else {
    //                 layer.msg(returnData.msg);
    //             }
    //         }
    //     })
    // });

    //选择分类弹框
    $('#joomPublish_item').click(function () {
        admin.itemCat_select('layer-publishs-joom-publish', 'LAY-publishs-joom-publish-hidden', 'LAY-publishs-joom-publish-div')
    });


    //绑定店铺更改事件
    form.on('select(joomPublish_storeAcctId)', function (data) {
        shopifyPublish_searchProd();
    });

    //绑定更改事件
    form.on('select(shopifyPublish_showHideVagueFlag)', function(data){
        console.log(data.value);
        if("pSkus"==data.value
            ||"sSkus"==data.value ){
            $("#shopify_publish #shopify_skuVagueFlag_div").removeClass("disN");
        }else{
            $("#shopify_publish #shopify_skuVagueFlag_div").addClass("disN");
        }
    });

    //清空按钮的点击事件
    $('#shopifyPublish_reset').click(function () {
        $('#LAY-publishs-joom-publish-hidden').val('')
        $('#LAY-publishs-joom-publish-div').html('')
        formSelects.value('selectAttr', [])
        formSelects.value('selectMan', [])
        $('#shopifyPublish_group_sel').next().find('dd[lay-value=""]').trigger('click');
    });

    var first = true;
    //监听tab切换来选中不同的tab页
    element.on('tab(shopifyPublish_tab)', function (data) {
        $('#shopifyPublish_div_selPubStyle').addClass('disN');

        var btn1 = $('#shopifyPublish_btn_genListing');//生成店铺商品
        var btn3 = $('#shopifyPublish_btn_delListing');//删除店铺商品
        var btn8 = $('#shopifyPublish_btn_cancleOnTime'); //取消定时刊登
        var btn9 = $('#shopifyPublish_btn_rePubNow'); //批量重新刊登
        var btn10 = $('#shopifyPublish_btn_failRequest'); //刊登失败转换为图片刊登失败
        btn1.addClass('disN');
        btn3.addClass('disN');
        btn8.addClass('disN');
        btn9.addClass('disN');
        btn10.addClass('disN');
        $("#shopifyPublish_searchForm input[name=shippingStatus]").val('')
        //相当于触发一次搜索
        if (data.index == 0) {
            btn1.removeClass('disN')
            $("#shopifyPublish_searchForm input[name=listingStatus]").val('-2')
        } else if (data.index == 1) {//待刊登
            $('#shopifyPublish_div_selPubStyle').removeClass('disN');
            btn3.removeClass('disN')
            $("#shopifyPublish_searchForm input[name=listingStatus]").val('0')
        } else if (data.index == 2) {//刊登中
            btn8.removeClass('disN');
            $("#shopifyPublish_searchForm input[name=listingStatus]").val('3')
        } else if (data.index == 3) {//刊登成功
            btn10.removeClass('disN');
            $("#shopifyPublish_searchForm input[name=listingStatus]").val('1')
        } else if (data.index == 4) {//刊登成功图片上传失败
            $("#shopifyPublish_searchForm input[name=listingStatus]").val('5')
        }else if (data.index == 5) {//刊登失败
            btn10.removeClass('disN');
            btn3.removeClass('disN');
            btn9.removeClass('disN');
            $("#shopifyPublish_searchForm input[name=listingStatus]").val('2')
        }

        //每次触发,执行依次查询
        shopifyPublish_searchProd();
    })

    form.on('select(shopifyPublish_selPubStyle_filter)', function (data) {
        var selPubStyle = data.value;
        if (1 == selPubStyle) {
            $("#shopifyPublish_btn_pubNow").trigger("click");
        }
        if (2 == selPubStyle) {
            $("#shopifyPublish_btn_pubOnTime").trigger("click");
        }
        $('#shopifyPublish_selPubStyle').val('');
        form.render('select')
    })


})

/*layui.use结束*/
function shopifyPublish__layer_shopify(id) {
    var listingStatus = $("#shopifyPublish_searchForm input[name=listingStatus]").val();
    shopifyPublish_getlistingDetail(id)
}

function genJoomListingDetailTpl(laytpl, $, returnData, layero) {
    laytpl($("#shopifyPulish_listDetailTpl").html()).render(returnData, function (html) {
        $(layero).find('.layui-layer-content').html(html);
        // form.render();
        $('#shopifyPublish_extImg').sortable();
        $('#prodJoomTagsNum').text($('input[name="tag"]').val().split(',').length);
        $('input[data-role="tagsinput"]').tagsinput();

        //产品joom敏感货属性
        layui.formSelects.on('wishPublish_select_joomSens', function (id, vals, val, isAdd, isDisabled) {//需要多传个参数true,这样才能保证获取的vals是当前选择之后的结果(按选择过程排序)
            var newJoomSensProd = "";
            var oldDangerousKindValue=$("#shopifyPublish_editDetailForm input[name=dangerousKindValue]").val();//变更前的值
            if(vals.length>0) {
                newJoomSensProd=vals[0].name;
                $("#shopifyPublish_editDetailForm input[name=dangerousKindName]").val(vals[0].name);
                $("#shopifyPublish_editDetailForm input[name=dangerousKindValue]").val(vals[0].value);
            }else{
                $("#shopifyPublish_editDetailForm input[name=dangerousKindName]").val("普货");
                $("#shopifyPublish_editDetailForm input[name=dangerousKindValue]").val("notDangerous");
            }
            var newDangerousKindValue=$("#shopifyPublish_editDetailForm input[name=dangerousKindValue]").val();//变更后的值
            if(newDangerousKindValue!=oldDangerousKindValue){
                //需要求新的并回显
                var listingId = $("#shopifyPublish_editDetailForm input[name=joomListingId]").val();
                loading.show();
                $.ajax({
                    type: "post",
                    data: {"listingId": listingId, "newJoomSensProd": newJoomSensProd},
                    url: ctx + "/joomlisting/getNewSubListingPrice.html",
                    dataType: "json",
                    success: function (returnData) {
                        loading.hide();
                        if (returnData.code == "0000") {
                            //回显
                            $("#shopifyPublish_SubSkuInfo").find("tr").each(function () {
                                tdArr = $(this).children();
                                if (returnData.data.length > 0) {
                                    for (var i = 0; i < returnData.data.length; i++) {
                                        if (returnData.data[i].id == tdArr.eq(0).text()) {
                                            tdArr.eq(6).find('input').val(returnData.data[i].price);
                                            tdArr.eq(7).find('input').val(returnData.data[i].shipping);
                                            break;
                                        }
                                    }
                                }
                            });
                        } else {
                            layer.alert(returnData.msg, {icon: 2});
                        }
                    }
                });
            }


        },true);

        layui.formSelects.render('wishPublish_select_joomSens');
        //回显敏感货
        if(returnData.prodJoomDangerousKind) { //prod_p_info存的是中文,需要转换成value
            var cnList=returnData.prodJoomDangerousKind.split(',');
            var list=[];
            for(var j1 = 0;j1<cnList.length;j1++) {
                for (var i1 = 0; i1 < joomSensArray1.length; i1++) {
                    if (joomSensArray1[i1].name == cnList[j1]) {
                        list.push(joomSensArray1[i1].value);
                    }
                }
            }
            console.log(list);
            layui.formSelects.value('wishPublish_select_joomSens', list);//赋值父产品的敏感属性列表

        }
        // $("#shopifyPublish_editDetailForm input[name=dangerousKindValue]").val(returnData.prodListingJoom.dangerousKind);//listing敏感属性
        // if(returnData.prodListingJoom.dangerousKind=='notDangerous'){
        //     $("#shopifyPublish_editDetailForm input[name=dangerousKindName]").val("普货");
        // }else{
        //     console.log(joomSensArray1);
        //     for(var i=0;i<joomSensArray1.length;i++){
        //         if(joomSensArray1[i].value==returnData.prodListingJoom.dangerousKind){
        //             $("#shopifyPublish_editDetailForm input[name=dangerousKindName]").val(joomSensArray1[i].name);
        //             break;
        //         }
        //     }
        // }
    });
    var listingStatus = $("#shopifyPublish_searchForm input[name=listingStatus]").val();
    // console.log('状态是', listingStatus);
    if (0 == listingStatus || 2 == listingStatus) {
        $('.addShopifySubListing').removeClass("disN");
    }
    else {
        $('.addShopifySubListing').addClass("disN");
    }
    //设置数量
    var skuImgNum = 0;
    $("#shopifyPublish_editDetailForm .img_ssku_uri").each(function () {
        if ($(this).text()) {
            skuImgNum++;
        }
    });
    $("#shopifyPublish_editDetailForm #sSkuImgNum").text(skuImgNum);
}

//已生成的详情框
function shopifyPublish_getlistingDetail(id) {
    var layer = layui.layer,
        laytpl = layui.laytpl,
        $ = layui.$,
        form = layui.form
    layer.open({
        type: 1,
        title: '产品详情',
        btn: ['保存并刊登', '保存', '取消'],
        area: ['100%', '100%'],
        content: "加载中...",
        end: function (index, layero) {
        },
        yes: function (index, layero) {
            shopifyPublish_editListingProd(id, true, layero)
            return false;
        },
        btn2: function (index, layero) {
            shopifyPublish_editListingProd(id, false, layero)
            return false;
        },
        success: function (layero, index) {
            //只有带刊登的详情可以修改
            var listingStatus = $("#shopifyPublish_searchForm input[name=listingStatus]").val();
            if ('0' == listingStatus || '2' == listingStatus) {
                $(layero).find(".layui-layer-btn0").show();
            } else {
                $(layero).find(".layui-layer-btn0").hide();
                $(layero).find(".layui-layer-btn1").hide();
            }
            loading.show();
            $.ajax({
                url: ctx + '/shopifyListing/getListingInfo.html',
                type: 'post',
                dataType: 'json',
                data: {id: id, listingStatus: listingStatus},
                success: function (returnData) {
                    loading.hide();
                    if (returnData.code != "0000") {
                        layer.alert(returnData.msg, {icon: 2});
                        return;
                    }
                    genJoomListingDetailTpl(laytpl, $, returnData.data, layero);
                }
            });
        }
    });
}


//抽象出一个公共的checkbox全选和反全选的组件
function shopifyPublishcheckbox_no_all(tableId) {
    /*获取表头checkbox和美化后的元素*/
    var $ = layui.$;
    //默认查待生成
    var listingStatus = $("#shopifyPublish_searchForm input[name=listingStatus]").val();

    var shippingStatus = $("#shopifyPublish_searchForm input[name=shippingStatus]").val();

    var isSale = $("#shopifyPublish_searchForm select[name=isSale]").val();

    //父id全选
    var pId_cbox_All = $('#' + tableId).find('thead input.pid-all-cbox'),
        pId_layui_All = pId_cbox_All.next()
    // //子id全选

    /*获取表内父id的checkbox和美化后的元素*/
    var pId_cbox_td = $('#' + tableId).find('tbody input.pid-cbox'),
        pId_layui_td = pId_cbox_td.next()
    /*获取表内子id的checkbox和美化后的元素*/
    var sId_cbox_td = $('#' + tableId).find('tbody  input.sid-cbox'),
        sId_layui_td = sId_cbox_td.next()

    /*父id全选和反全选事件*/
    pId_layui_All.click(function () {
        /*获取checkbox的状态*/
        var isChecked = pId_cbox_All.prop('checked')
        if (isChecked) {
            pId_layui_td.addClass('layui-form-checked')
            pId_cbox_td.prop('checked', true)
            sId_layui_td.addClass('layui-form-checked')
            sId_cbox_td.prop('checked', true)
        } else {
            pId_layui_td.removeClass('layui-form-checked')
            pId_cbox_td.prop('checked', false)
            sId_layui_td.removeClass('layui-form-checked')
            sId_cbox_td.prop('checked', false)
        }
    });
    //子sku被选,勾选父sku,如果子sku都未被勾选,取消父sku的勾选
    sId_layui_td.click(function () {
        var pid_cbox = $(this).parents('tr').find('input.pid-cbox');//父sku
        if ($(this).prev().prop('checked')) {
            var pid_layui = pid_cbox.next();
            pid_cbox.prop('checked', true)
            pid_layui.addClass('layui-form-checked')
        }
        else {
            var checkLen = $(this).parents('.skus-tr').find('input.sid-cbox:checked').length;
            if (checkLen < 1) {
                var pid_layui_1 = pid_cbox.next();
                pid_cbox.prop('checked', false)
                pid_layui_1.removeClass('layui-form-checked')
            }
        }

    });

    pId_layui_td.click(function () {
        //全选子sku
        var subs_cbox = $(this).parents('tr').find('input.sid-cbox');
        if ($(this).prev().prop('checked')) {
            var subs_layui = subs_cbox.next();
            subs_cbox.prop('checked', true)
            subs_layui.addClass('layui-form-checked')
        } else {
            var subs_layui_x = subs_cbox.next();
            subs_cbox.prop('checked', false)
            subs_layui_x.removeClass('layui-form-checked')
        }
        /*获取选中的checkbox的长度*/
        var len = $('#' + tableId).find('tbody td:first-child input[type="checkbox"]:checked').length;
        if (pId_cbox_td.length == len) {
            pId_layui_All.addClass('layui-form-checked')
            pId_cbox_All.prop('checked', true)
        } else {
            pId_layui_All.removeClass('layui-form-checked');
            pId_cbox_All.prop('checked', false)
        }
    });

    var unlist_td = $('#' + tableId).find('.joomPublish-unlist').parent().prev();
    var listsucc_td = $('#' + tableId).find('.joomPublish-listsucc').parent().prev();
    var listfail_td = $('#' + tableId).find('.joomPublish-listfail').parent().prev();
    var inlist_td = $('#' + tableId).find('.joomPublish-inlist').parent().prev();

    //在售,和停售
    var isSale_td = $('#' + tableId).find('.joomPublish-isSale').parent().parent().children('td:first-child');
    var isNotSale_td = $('#' + tableId).find('.joomPublish-isNotSale').parent().parent().children('td:first-child');

    if (listingStatus == -2) {
        unlist_td.empty();
        listsucc_td.empty();
        listfail_td.empty();
        inlist_td.empty();
        if (isSale == 'true') {
            isNotSale_td.empty();
        } else if (isSale == 'false') {
            isSale_td.empty();
        }
    }
}

function shopifyPublish_getSearchData() {
    var data = new Object();
    //默认查待生成
    data.listingStatus = $("#shopifyPublish_searchForm input[name=listingStatus]").val();

    data.shippingStatus = $("#shopifyPublish_searchForm input[name=shippingStatus]").val();


    data.storeAcctId = $("#shopifyPublish_searchForm select[name=storeAcctId]").val();
    // data.cateId = $("#shopifyPublish_searchForm input[name=cateId]").val();//类目不需要
    data.tag = $("#shopifyPublish_searchForm select[name=tag]").val();
    data.devType = $("#shopifyPublish_searchForm select[name=devType]").val();

    //物流属性
    data.existLogisAttrs = [];
    data.notExistLogisAttrs = [];
    var logisAttrContents = layui.formSelects.value("selectAttr_shopify");

    for (var i = 0; i < logisAttrContents.length; i++) {
        var logisAttr = logisAttrContents[i].val;

        if (logisAttr.substring(0, 3) == ("no_")) {
            logisAttr = logisAttr.replace("no_", "");
            data.notExistLogisAttrs.push(logisAttr);
        } else {
            data.existLogisAttrs.push(logisAttr);
        }
    }
    //产品归属人
    data.bizzOwnerIds = [];
    var bizzOwnerContents = layui.formSelects.value("selectMan_shopify");
    for (var j = 0; j < bizzOwnerContents.length; j++) {
        data.bizzOwnerIds.push(bizzOwnerContents[j].val);
    }
    //侵权状态
    // data.tortBanListing = $("#shopifyPublish_searchForm select[name=tortBanListing]").val();

    //日期
    var timeStr = $("#shopifyPublish_searchForm input[name=time]").val();
    if (timeStr) {
        data.startTime = Date.parse(timeStr.split(" - ")[0] + " 00:00:00");
        data.endTime = Date.parse(timeStr.split(" - ")[1] + " 23:59:59");
    }
    data.timeType = $("#shopifyPublish_searchForm select[name=timeType]").val();
    data.isSale = $("#shopifyPublish_searchForm select[name=isSale]").val();
    data.isPublish = $("#shopifyPublish_searchForm select[name=isPublish]").val();
    data.cnTitle = "";
    data.enTitle = "";
    data.pSkus = [];
    data.sSkus = [];
    data.skuVagueFlag=$("#shopifyPublish_searchForm select[name=skuVagueFlag]").val()
    if ("cnTitle" == $("#shopifyPublish_searchForm select[name=searchType]").val()) {
        data.cnTitle = ($("#shopifyPublish_searchForm input[name=searchText]").val());
    }
    if ("enTitle" == $("#shopifyPublish_searchForm select[name=searchType]").val()) {
        data.enTitle = ($("#shopifyPublish_searchForm input[name=searchText]").val());
    }
    if ("pSkus" == $("#shopifyPublish_searchForm select[name=searchType]").val()) {
        var pSkustmp = $("#shopifyPublish_searchForm input[name=searchText]").val()
        if (pSkustmp.length > 0) {
            pSkustmp = pSkustmp.split(",");
            if (pSkustmp.length > 0) {
                for (i = 0; i < pSkustmp.length; i++) {
                    data.pSkus.push(pSkustmp[i]);
                }
            }
        }
    }
    if ("sSkus" == $("#shopifyPublish_searchForm select[name=searchType]").val()) {
        var sSkustmp = $("#shopifyPublish_searchForm input[name=searchText]").val();
        if (sSkustmp.length > 0) {
            sSkustmp = sSkustmp.split(",");
        }
        if (sSkustmp.length > 0) {
            for (i = 0; i < sSkustmp.length; i++) {
                data.sSkus.push(sSkustmp[i]);
            }
        }
    }
    return data;
}


//请求需要包含参数,首次获取默认,使用分页控件修改属性,并使用修改后的属性,在页面中搜索,重置为第一页
var limitAllAppoint = 100;//每页显示数据条数
var currentPageAllAppoint = 1;//当前页数
var dataLength = 0;//数据总条数

// 搜索商品按钮事件
function shopifyPublish_searchProd() {
    var storeAcctId = $("#shopifyPublish_searchForm select[name=storeAcctId]").val();
    if (null == storeAcctId || '' == storeAcctId) {
        layer.msg("店铺不得为空");
        return;
    }
    currentPageAllAppoint = 1; //当点击搜索的时候，应该回到第一页
    dataLength = 0;
    shopifyPublish_search();
}

function shopifyPublish_search() {
    var form = layui.form,
        laypage = layui.laypage;
    var data = shopifyPublish_getSearchData();

    data.page = currentPageAllAppoint;
    data.limit = limitAllAppoint;
    loading.show();
    $.ajax({
        url: ctx + '/shopifyListing/queryList.html',
        type: "post",
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify(data),
        traditional: true,//确保数组传参正确
        success: function (returnData) {
            dataLength = returnData.count;
            var joomCol = {
                two: '<colgroup><col width="30px"/><col width="70px" /><col width="10%" /><col width="5%" /><col width="5%"/><col width="30px"/><col width="140px"/><col width="120px"/><col width="60px"/><col width="5%"/><col width="7%"/><col width="7%"/><col width="7%"/><col width="7%"/><col width="7%"/></colgroup>',
                three: '<colgroup><col width="30px"/><col width="70px" /><col width="200px" /><col width="120px" /><col width="120px"/><col width="30px"/><col width="140px"/><col width="120px"/><col width="60px"/><col width="60px"/><col width="60px"/><col width="60px"/><col width="60px"/><col width="60px"/><col width="60px"/> <col width="60px"/><col width="7%"/><colwidth="7%"/></colgroup>',
                four:'<colgroup><col width="30px"/><col width="70px" /><col width="200px" /><col width="120px" /><col width="120px"/><col width="30px"/><col width="140px"/><col width="120px"/><col width="60px"/><col width="60px"/><col width="60px"/><col width="60px"/><col width="60px"/><col width="60px"/><col width="60px"/> <col width="60px"/><col width="7%"/><colwidth="7%"/></colgroup>',
                five: '<colgroup><col width="30px"/><col width="70px" /><col width="200px" /><col width="120px" /><col width="120px"/><col width="30px"/><col width="140px"/><col width="120px"/><col width="60px"/><col width="60px"/><col width="60px"/><col width="60px"/><col width="60px"/><col width="60px"/><col width="60px"/> <col width="60px"/><col width="7%"/></colgroup>',
                rep: function(str) {
                    $('.shopifyPublish_table_head').find('.layui-table colgroup').remove()
                    $('.shopifyPublish_table_body').find('.layui-table colgroup').remove()
                    $('.shopifyPublish_table_head').find('.layui-table').prepend(str)
                    $('.shopifyPublish_table_body').find('.layui-table').prepend(str)
                }
            }
            html = template('shopifyPublish_tpl', returnData);
            $('#shopifyPublish_table').html(html);
            //固定表头
            theadHandle().fixTh({id:'#shopifyPublishCard',h:150,dv1:'.layui-tab-title',dv2:'.shopifyPublish_table_head',dv3:'#shopify_btn_show_hide',i:35});
            form.render('checkbox');
            imageLazyload();//懒加载
            var listingStatus = $("#shopifyPublish_searchForm input[name=listingStatus]").val();
            var shippingStatus = $("#shopifyPublish_searchForm input[name=shippingStatus]").val();
            $("#shopify_publish .listingSuccInfo").hide();
            $("#shopify_publish .timeClass").hide();
            $('.joomPublish-listfail').on('mouseenter', function () {
                var contentshow = $(this).next(".joomPublish-listfailreason").text();
                layer.tips(contentshow, $(this), {
                    tips: [2, 'red'],
                    area: ['40%', 'auto'],
                    time: 0,
                });
            }).on('mouseleave', function () {
                layer.closeAll("tips");
            });
            // 他类名应该写错了，和joom的一毛一样，既然没人提bug，就先这样...
            $('.joomPublish-listfail').on('click', function() {
                var contentshow = $(this).next(".joomPublish-listfailreason").text();
                copyTxtToClipboard(contentshow)
            })
            //仅刊登失败对应的展示,展示状态和失败原因
            if (-2 == listingStatus) {//商品
                $("#shopify_publish .colspan_td").attr("colSpan", 6);
                $("#shopify_publish .failInfo").hide();
                $("#shopify_publish .shippingInfo").hide();
                $("#shopify_publish .timeClass").show();
                $("#shopify_publish .listTiming").hide();
                $("#shopify_publish .auditTime").show();
                $("#shopify_publish .storeSubSkuInfo").hide();
                $("#shopify_publish .listingInfo").hide();
                $("#shopify_publish .prodStock").show();
                $("#shopify_publish .listingStock").hide();
                $("#shopify_publish .detailInfoBtn").hide();
                $("#shopify_publish .publishBtn").hide();
                console.log('商品')
            }
            else if (0 == listingStatus) {
                $("#shopify_publish .colspan_td").attr("colSpan", 9);
                $("#shopify_publish .failInfo").hide();
                $("#shopify_publish .shippingInfo").hide();
                $("#shopify_publish .listTiming").hide();
                $("#shopify_publish .auditTime").hide();
                $("#shopify_publish .storeSubSkuInfo").show();
                $("#shopify_publish .listingInfo").show();
                $("#shopify_publish .prodStock").hide();
                $("#shopify_publish .listingStock").show();
                $("#shopify_publish .detailInfoBtn").show();
                $("#shopify_publish .publishBtn").hide();
                joomCol.rep(joomCol.two)
                console.log('待刊登')
            }
            else if (1 == listingStatus) {
                $("#shopify_publish .colspan_td").attr("colSpan", 9);
                $("#shopify_publish .failInfo").hide();
                $("#shopify_publish .shippingInfo").hide();
                $("#shopify_publish .timeClass").show();
                $("#shopify_publish .listingTime").show();
                $("#shopify_publish .listTiming").hide();
                $("#shopify_publish .auditTime").hide();
                $("#shopify_publish .storeSubSkuInfo").show();
                $("#shopify_publish .listingInfo").show();
                $("#shopify_publish .prodStock").hide();
                $("#shopify_publish .listingStock").show();
                $("#shopify_publish .listingSuccInfo").show();
                $("#shopify_publish .detailInfoBtn").show();
                $("#shopify_publish .publishBtn").hide();
                joomCol.rep(joomCol.two)
                console.log('刊登成功')
            }
            else if (2 == listingStatus) {
                $("#shopify_publish .colspan_td").attr("colSpan", 9);
                $("#shopify_publish .failInfo").show();
                $("#shopify_publish .shippingInfo").hide();
                $("#shopify_publish .listTiming").hide();
                $("#shopify_publish .auditTime").hide();
                $("#shopify_publish .storeSubSkuInfo").show();
                $("#shopify_publish .listingInfo").show();
                $("#shopify_publish .prodStock").hide();
                $("#shopify_publish .listingStock").show();
                $("#shopify_publish .detailInfoBtn").show();
                $("#shopify_publish .publishBtn").show();
                joomCol.rep(joomCol.two)
                console.log('刊登失败')

            }
            else if (3 == listingStatus) {
                $("#shopify_publish .colspan_td").attr("colSpan", 9);
                $("#shopify_publish .failInfo").hide();
                $("#shopify_publish .shippingInfo").hide();
                $("#shopify_publish .timeClass").show();
                $("#shopify_publish .listTiming").show();
                $("#shopify_publish .auditTime").hide();
                $("#shopify_publish .storeSubSkuInfo").show();
                $("#shopify_publish .listingInfo").show();
                $("#shopify_publish .prodStock").hide();
                $("#shopify_publish .listingStock").show();
                $("#shopify_publish .detailInfoBtn").show();
                $("#shopify_publish .publishBtn").hide();
                joomCol.rep(joomCol.two)
                console.log('刊登中')
            }
            else if (5 == listingStatus) {
                $("#shopify_publish .colspan_td").attr("colSpan", 9);
                $("#shopify_publish .failInfo").hide();
                $("#shopify_publish .shippingInfo").hide();
                $("#shopify_publish .timeClass").show();
                $("#shopify_publish .listTiming").show();
                $("#shopify_publish .auditTime").hide();
                $("#shopify_publish .storeSubSkuInfo").show();
                $("#shopify_publish .listingInfo").show();
                $("#shopify_publish .prodStock").hide();
                $("#shopify_publish .listingStock").show();
                $("#shopify_publish .detailInfoBtn").show();
                $("#shopify_publish .publishBtn").hide();
                joomCol.rep(joomCol.two)
                console.log('刊登中')
            }

            //全选和反全选事件
            shopifyPublishcheckbox_no_all('shopifyPublish_table')
            loading.hide();
            joomPublish_toPage();
        }
    });
    $.ajax({
        beforeSend: function () {
            // loading.show();
        },
        url: ctx + '/shopifyListing/countNums.html',
        type: "post",
        dataType: "json",
        data: JSON.stringify(data),
        contentType: "application/json;charset=utf-8",
        traditional: true,
        success: function (returnData) {
            $('#shopify_publish #shopify_totalNum').text("商品(" + returnData.data.totalNum + ")");
            $("#shopify_publish #shopify_toListingNum").text("待刊登(" + returnData.data.toListingNum + ")");
            $("#shopify_publish #shopify_listingNum").text("刊登中(" + returnData.data.listingNum + ")");
            $("#shopify_publish #shopify_listingSucNum").text("刊登成功(" + returnData.data.listingSucNum + ")");
            $("#shopify_publish #shopify_listingFailNum").text("刊登失败(" + returnData.data.listingFailNum + ")");
            $("#shopify_publish #shopify_listingImgNum").text("刊登成功图片上传失败(" + returnData.data.listingImgNum + ")");
        },
        complete: function () {
            // loading.hide();
        },
    });
}

function joomPublish_toPage() {
    laypage = layui.laypage;
    //处理分页
    laypage.render({
        elem: 'shopifyPublish_pagination',
        count: dataLength, //数据总数，从服务端得到
        layout: ['count', 'prev', 'page', 'next', 'limit', 'refresh', 'skip'],
        limits: [30, 50, 100, 300],
        curr: currentPageAllAppoint,
        limit: limitAllAppoint,
        jump: function (obj, first) {
            currentPageAllAppoint = obj.curr;
            limitAllAppoint = obj.limit;
            //首次不执行
            if (!first) {
                shopifyPublish_search()
            }
        }
    });
}

function shopifyPublish_genToListingProd() {
    var data = $("#shopifyPublish_table tbody input.sid-cbox:checked");
    var storeAcctId = $("#shopifyPublish_searchForm select[name=storeAcctId]").val();
    var isSale = $("#shopifyPublish_searchForm select[name=isSale]").val();
    var paramData = [];
    if (data.length > 0) {
        for (var i = 0; i < data.length; i++) {
            paramData.push(data[i].value);
        }
        $.ajax({
            beforeSend: function () {
                loading.show();
            },
            url: ctx + '/shopifyListing/addStoreProds.html',
            type: "post",
            dataType: "json",
            data: {
                "prodTmpIdAttr": paramData,
                "storeAcctId": storeAcctId,
                "isSale": isSale,
            },
            traditional: true,
            success: function (returnData) {
                loading.hide();
                if (returnData.code != "0000") {
                    layer.msg(returnData.msg|| '生成商品失败', {icon: 2});
                } else {
                    layer.msg('生成待刊登信息成功', {icon: 1});
                    $("#shopifyPublish_search").trigger("click");
                }
            }
        });
    }
    else {
        layer.msg("请至少选择1条数据");
    }
}

//删除店铺商品
function shopifyPublish_deletelisting(id) {
    var paramData = [];
    if (id) {
        paramData.push(id);
    } else {
        var data = $("#shopifyPublish_table tbody input.sid-cbox:checked");
        if (data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                paramData.push(data[i].value);
            }
        }
    }
    var listingStatus = $("#shopifyPublish_searchForm input[name=listingStatus]").val();
    if (paramData.length > 0) {
        loading.show();
        $.ajax({
            url: ctx + '/shopifyListing/deletelisting.html',
            type: "post",
            dataType: "json",
            data: {"idArr": paramData, "listingStatus": listingStatus},
            traditional: true,
            success: function (returnData) {
                loading.hide();
                if (returnData.code != "0000") {
                    layer.alert(returnData.msg || '删除商品失败', {icon: 2});
                } else {
                    layer.msg('删除店铺刊登信息成功');
                    $("#shopifyPublish_search").trigger("click");
                }
            },
        });
    }
    else {
        layui.layer.msg("请至少选择1条数据");
    }
}


function shopifyListingPublish(listingId, singleReListingSub) {

    var listingStatus = $("#shopifyPublish_searchForm input[name=listingStatus]").val();
    var paramData = new Array();
    var data;
    if (listingId) {//
        paramData.push(listingId);
    } else {
        //非单个子商品重新刊登
        if (!singleReListingSub) {
            data = $("#shopifyPublish_table tbody input.pid-cbox:checked");
        } else {
            data = $("#shopifyPublish_table tbody input.sid-cbox:checked");
        }

        if (data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                paramData.push(data[i].value);
            }

        }
    }
    if (paramData.length > 0) {
        layer.open({
            title: '刊登提示'
            ,content: '商品成功进入刊登流程,稍后查看刊登结果,请勿重复点击刊登！'
        });
        $.ajax({
            // beforeSend: function () {
            //     loading.show();
            // },
            url: ctx + '/shopifyListing/publishListing.html',
            type: "post",
            dataType: "json",
            data: {"idArr": paramData},//是否子sku重发
            traditional: true,
            success: function (returnData) {
                // if (returnData.code != "0000") {
                //     layer.alert(returnData.msg, {icon: 2});
                // } else {
                //     layer.msg('商品成功进入刊登流程,稍后查看刊登结果');
                //     $("#shopifyPublish_search").trigger("click");
                // }
            },
            complete: function () {
                loading.hide();
            },
        });
    }
    else {
        layui.layer.msg("请至少选择1条数据");
        return;
    }
}

function joomPublish_relisting() {
    $.ajax({
        beforeSend: function () {
            loading.show();
        },
        url: ctx + '/joomlisting/oneClikRelisting.html',
        type: "post",
        dataType: "json",
        traditional: true,
        success: function (returnData) {
            if (returnData.code != "0000") {
                layer.alert(returnData.msg, {icon: 2});
            } else {
                layer.msg('重新刊登成功，商品进入刊登流程');
                $("#shopifyPublish_search").trigger("click");
            }
        },
        complete: function () {
            loading.hide();
        },
    });
}

function joomPublish_exportskumapping() {
    var data = shopifyPublish_getSearchData();
    if (data.storeAcctId) {
        var Confirmindex = layer.confirm('确认导出当前搜索条件下的sku映射,导出时间较慢,请勿频繁尝试',{btn:['确认','取消']},function (result) {
            if(result){
                layer.close(Confirmindex );
             submitForm(data, ctx + '/joomlisting/exportskumapping.html')
            }
        })
    } else {
        layer.msg("店铺不得为空");
    }
}

function shopifyPublish_delImg(obj) {
    layer.confirm('您确认要删除图片？', {icon: 3, title: '提示'}, function (index) {
        $(obj).closest('li').remove();
        var imgTotalNum = $("#shopifyPublish_extImg li").length;
        $("#shopifyPublish_editDetailForm #curImgNum").text(imgTotalNum);

        //设置数量
        var skuImgNum = 0;
        $("#shopifyPublish_editDetailForm .img_ssku_uri").each(function () {
            if ($(this).text()) {
                skuImgNum++;
            }
        });
        $("#shopifyPublish_editDetailForm #sSkuImgNum").text(skuImgNum);
        layer.close(index);
    });
}

function shopifyPublish_setMainImg(obj) {
    var extImgUrl = $(obj).closest('.ImgDivOut').find('input').val();
    var mainImgUrl = $("#shopifyPublish_mainImg .ImgDivIn").find('input').val();
    if (mainImgUrl) {
        $(obj).closest('.ImgDivOut').find('img').attr('src', mainImgUrl);
        $(obj).closest('.ImgDivOut').find('input').attr('value', mainImgUrl);
    } else {
        $(obj).closest('li').remove();
        var imgTotalNum = $("#shopifyPublish_extImg li").length;
        $("#shopifyPublish_editDetailForm #curImgNum").text(imgTotalNum);
        var skuImgNum = 0;
        $("#shopifyPublish_SubSkuInfo .img_ssku_uri").each(function () {
            if ($(this).val()) {
                skuImgNum++;
            }
        });
        $("#sSkuImgNum").text(skuImgNum);
    }
    if (extImgUrl) {
        $("#shopifyPublish_mainImg .ImgDivIn").find('img').attr('src', extImgUrl);
        $("#shopifyPublish_mainImg .ImgDivIn").find('input').attr('value', extImgUrl);
    }
}

//isPublish 是否立即发布
function shopifyPublish_editListingProd(id, isPublish, layero) {
    var layer = layui.layer,
        laytpl = layui.laytpl,
        $ = layui.$;
    var mainImgUrl = $("#shopifyPublish_mainImg .ImgDivIn").find('img').attr('src');
    var extImg = "";
    $("#shopifyPublish_extImg .ImgDivIn").each(function () {
        if ("" != extImg) {
            extImg += "|" + $(this).find('img').attr('src');
        } else {
            extImg = $(this).find('img').attr('src');
        }
    })
    var detailData = {};
    detailData.id = id;
    detailData.publishFlag = isPublish;
    detailData.mainImage = mainImgUrl; //主图
    detailData.extraImages = extImg; //辅图
    detailData.title = $("#shopifyPublish_editDetailForm input[name=title]").val(); //刊登标题
    detailData.bodyHtml = $("#shopifyPublish_editDetailForm textarea[name=prodDesc]").val();//描述
    detailData.tag = $("#shopifyPublish_editDetailForm input[name=tag]").val(); //tag
    detailData.listingStatus = $("#shopifyPublish_searchForm input[name=listingStatus]").val(); //刊登状态
    
    //添加子sku
    detailData.prodListingSubSkuShopifyDtoList = shopifyPublish_getSkusInfo(); //详情表格数据
    if (detailData.prodListingSubSkuShopifyDtoList.length < 1) {
        layer.msg('请至少保留一条子sku信息');
        return;
    }
    var minPrice = 0;
    for (var m = 0; m < detailData.prodListingSubSkuShopifyDtoList.length; m++) {
        if (minPrice == 0 || minPrice > detailData.prodListingSubSkuShopifyDtoList[m].price) {
            minPrice = detailData.prodListingSubSkuShopifyDtoList[m].price;
        }
    }
    for (var n = 0; n < detailData.prodListingSubSkuShopifyDtoList.length; n++) {
        if (detailData.prodListingSubSkuShopifyDtoList[n].price > minPrice * 4) {
            layer.msg('最大刊登价格和最低刊登价格不能相差4倍');
            return;
        }
    }

    var hasColor = false;
    var hasSize = false;
    //
    var errMsg = "";
    var colorSizeJSON = {}; // 用于校验是否有重复的color_size
    var colorSize;
    $("#shopifyPublish_SubSkuInfo").find("tr").each(function () {
        //校验参数
        tdArr = $(this).children();
        varient = {};
        varient.size = tdArr.eq(3).find('input').val();
        if (varient.size) {
            hasSize = true;
        }

        if (hasSize) {
            if (varient.size) {
            } else {
                errMsg = "多变种模板，任一变种有尺寸，其他变种也当有尺寸";
                return;
            }
        }
        varient.color = tdArr.eq(4).find('input').val();
        if (varient.color) {
            hasColor = true;
        }
        var colorNew;
        if (hasColor) {
            if (varient.color) {
                colorNew = varient.color.toLowerCase();
                var colorArr = colorNew.split('&');//对每个颜色都要验证
                var dataColor;
                for (var i = 0; i < colorArr.length; ++i) {
                    dataColor = colorArr[i];
                    if ($.inArray(dataColor, merchantColors.toLowerCase().split(',')) == -1) {//判断是不是在joom扩展色里面
                        errMsg = "存在非法颜色" + varient.color;
                        return;
                    }
                }
            } else {
                errMsg = "多变种模板，任一变种有颜色，其他变种也当有颜色";
                return;
            }
        }
        var colorSize = escapeJquery(varient.color + '-' + varient.size).replace(/[&\|\\\*^%$#@\s\/]/g, "")
        if (colorSizeJSON[colorSize]) {
            errMsg = "存在颜色和尺寸都相同的变种";//校验(颜色_尺寸)相同
            return;
        } else {
            colorSizeJSON[colorSize] = 1;
        }
    });
    var subs = detailData.prodListingSubSkuShopifyDtoList;
    if (subs && subs.length > 0) {
        for (var j = 0; j < subs.length; j++) {
            if (subs[j].id) {
            } else {
                if (subs[j].storeSSku) {
                } else {//新增sku不能为空
                    errMsg = '店铺sku不能为空';
                    break;
                }
            }
        }
    }
    if (errMsg) {
        layer.msg(errMsg);
        return;
    }
    $.ajax({
        beforeSend: function () {
            loading.show();
        },
        url: ctx + '/shopifyListing/editListingDetail.html',
        type: "post",
        data: JSON.stringify(detailData),
        contentType: "application/json;charset=utf-8",
        success: function (returnData) {
            var resp = returnData
            if (resp.code === "0000") {
                layer.closeAll();
                if (isPublish) {
                    layer.msg('修改成功,并进入刊登流程');
                } else {
                    layer.msg('修改成功');
                }
                $("#shopifyPublish_search").trigger("click");
            } else {
                layer.alert(resp.msg, {icon: 2});
            }
        },
        complete:function(returnData){
            loading.hide();
        }
    });
}

// 2-2.辅图网络图片
function shopifyPublish_addExtPic() {
    var index = layer.open({
        type: 1,
        title: '辅图网络图片',
        area: ['800px', '300px'],
        content: '<div class="p20"><textarea class="layui-textarea" id="netImgUrl4" placeholder="请填写URL,多个地址用回车换行"></textarea></div>',
        btn: ['确定', '关闭'],
        yes: function () {
            //网络主图处理
            // console.log($('#netImgUrl'));
            joomPublish_downImgFromUrl4();//这个函数在最下面,然后ajax那里的话,我不知道传什么数据data,返回的类型是啥,就没改,只改了一个URL
            $("#netImgUrl4").val("");
            layer.close(index);
        }
    })
}

//网络辅图处理
function joomPublish_downImgFromUrl4() {
    var url = $.trim($("#netImgUrl4").val());
    if (url == null || url == "") {
        layer.msg("图片地址不能为空！", {icon: 5});
        return false;
    }
    var urlArray = url.split("\n");
    // 去一下空格
    for (var j in urlArray) {
        urlArray[j] = $.trim(urlArray[j]);
    }

    //设置数量
    var skuImgNum = 0;
    $("#shopifyPublish_editDetailForm .img_ssku_uri").each(function () {
        if ($(this).text()) {
            skuImgNum++;
        }
    });

    var imgTotalNum2 = $("#shopifyPublish_extImg li").length;
    //辅图和子图最多20张
    var remainNum2 = 20 - skuImgNum - imgTotalNum2;
    if ((urlArray.length + imgTotalNum2 + skuImgNum) > 20) {
        remainNum2 = remainNum2 < 0 ? 0 : remainNum2;
        // $.fn.message({type: "success", msg: "最大支持" + maxUploadNum2 + "张图片,您还能上传" + remainNum2 + "张!"});
        layer.msg("最大支持共" + 20 + "张辅图和子sku图片,您最多还能上传" + remainNum2 + "张!", {icon: 7});
        return;
    }
    remainNum2 = urlArray.length > remainNum2 ? remainNum2 : urlArray.length;
    for (var i = 0; i < remainNum2; i++) {
        // 生成展示图片
        // showImg(urlArray[i],urlArray[i]);
        // $.ajax({
        //     url: ctx + "/prodTpl/getOnlinePic.html",
        //     data: 'urlString=' + urlArray[i],
        //     success: function (data) {
        //         if (data) {
        //             data = $.parseJSON(data);
        //             if (data.code == '0000') {
        //                 showImg4(data.data);
        //             } else if (data.code == '9999') {
        //                 // $.fn.message({type: 'error', msg: data.msg});
        //                 layer.msg(data.msg, {icon: 5});
        //             }
        //         } else {
        //             // $.fn.message({type: 'error', msg: "图片上传失败!"});
        //             layer.msg("图片上传失败!", {icon: 2})
        //         }
        //     }
        // });
        joomPublish_showImg4(urlArray[i]);
    }
    $("#shopifyPublish_editDetailForm #sSkuImgNum").text(skuImgNum);
}

function joomPublish_showImg4(url) {
    var tpl = '';
    tpl += joomPublish_imgData['img']['tpl'];
    //layer.msg(url);
    var div = tpl.replace(/&{url}/g, url);
    $('#shopifyPublish_extImg').append(div);
    var imgTotalNum = $("#shopifyPublish_extImg li").length;
    $("#shopifyPublish_editDetailForm #curImgNum").text(imgTotalNum);
    // $("#img-kong2").hide();
}


var joomPublish_imgData = {
    img: {
        head: '',
        tpl: '<li draggable="true" style="width: 150px;margin-bottom:40px;border:1px solid #ccc;overflow:hidden">' +
        '<div class="ImgDivOut">' +
        '<div class="ImgDivIn" style="width:150px;height:150px;">' +
        '<input type="hidden" name="extImg" value="&{url}">' +
        '<img  width="150" height="150" src="&{url}">' +
        '</div>' +
        '<div class="imgDivDown" style="width:150px">' +
        '<a onclick="shopifyPublish_setMainImg(this);" href="javascript:void(0);" style="float:left; color: #73a1bf;">设为主图</a><a onclick="shopifyPublish_delImg(this);" href="javascript:void(0);" style="float:right; color: #73a1bf;">移除</a>' +
        '</div></div></div></li>'
    }
}

function shopifyPublish_getSkusInfo() {
    var subSkus = [];
    var tdArr;
    var varient;
    $("#shopifyPublish_SubSkuInfo").find("tr").each(function () {
        tdArr = $(this).children();
        varient = {};
        varient.id = tdArr.eq(0).text();
        // if (varient.id) {
        // } else {
        //     varient.storeSSku = tdArr.eq(2).find('input').val();
        // }
        varient.storeSSku = tdArr.eq(2).find('input').val();
        varient.size = tdArr.eq(3).find('input').val();
        varient.color = tdArr.eq(4).find('input').val();
        varient.msrp = tdArr.eq(5).find('input').val();
        varient.price = tdArr.eq(6).find('input').val();
        varient.shipping = tdArr.eq(7).find('input').val();
        varient.stock = tdArr.eq(8).find('input').val();
        subSkus.push(varient);
    });
    return subSkus;
}

//定时刊登商品
function shopifyPublish_OnTiming() {
    var layer = layui.layer,
        $ = layui.$;
    var ids = [];
    //生成多个
    $("#shopifyPublish_table tbody tr  input.pid-cbox:checked").each(function () {
        ids.push($(this).val());
    });
    if (ids.length < 1) {
        layer.msg("未选中商品");
        return;
    }
    layer.open({
        type: 1,
        title: '定时刊登',
        btn: ['定时刊登'],
        //area: ['100%', '100%'],
        content: "加载中...",
        success: function (layero, index) {
            $(layero).find('.layui-layer-content').html($("#shopifyPulish_listTimingTpl").html());
            //时间选择器
            layui.laydate.render({
                elem: '#shopifyPulish_listTiming'
                , type: 'datetime'
                , format: 'yyyy-MM-dd HH:mm'
            });
        },
        yes: function (index, layero) {
            var listTiming = layero.find("input[name=listTiming]").val();
            if (listTiming) {
            }
            else {
                layer.msg("定时刊登开始时间不能为空");
                return;
            }
            loading.show();
            $.ajax({
                type: "post",
                url: ctx + "/shopifyListing/listTiming.html",
                dataType: "json",
                data: {
                    ids: ids.join(","),
                    listTiming: new Date(listTiming).getTime()
                },
                success: function (returnData) {
                    loading.hide();
                    if (returnData.code != "0000") {
                        layer.msg(returnData.msg);
                    } else {
                        layer.msg("定时刊登成功");
                        layer.close(index);
                        $("#shopifyPublish_search").trigger("click");
                    }
                }
            });
        }
    })
}

//取消定时刊登商品
function shopifyPublish__canclePublishOnTiming() {
    var layer = layui.layer,
        $ = layui.$;
    var ids = [];
    //生成多个
    $("#shopifyPublish_table tbody tr  input.pid-cbox:checked").each(function () {
        ids.push($(this).val());
    });
    if (ids.length < 1) {
        layer.msg("未选中商品");
        return;
    }

    $.ajax({
        type: "post",
        url: ctx + "/shopifyListing/cancelListTiming.html",
        dataType: "json",
        data:{"idArr": ids},
        traditional: true,
        beforeSend: function(){
            loading.show();
        },
        success: function (returnData) {
            if (returnData.code != "0000") {
                loading.hide();
                layer.msg(returnData.msg || '取消定时刊登失败');
            } else {
                layer.msg("取消定时刊登成功");
                $("#shopifyPublish_search").trigger("click");
            }
        }
    });
}

function shopifyPublish__setShipping() {
    var ids = [];
    //生成多个
    $("#shopifyPublish_table tbody tr  input.pid-cbox:checked").each(function () {
        ids.push($(this).val());
    });
    if (ids.length < 1) {
        layer.msg("未选中商品");
        return;
    }
    $.ajax({
        type: "post",
        url: ctx + "/joomlisting/setShipping.html",
        dataType: "json",
        data: {
            ids: ids
        },
        traditional: true,
        success: function (returnData) {
            loading.hide();
            if (returnData.code != "0000") {
                layer.msg(returnData.msg);
            } else {
                layer.msg("成功进入设置运费流程");
            }
        }
    });
}

/**
 * art-template语法扩展
 */
template.defaults.imports.dateFormat = function (datetime, fmt) {
    if (datetime) {
        datetime = datetime.toString();
        if (parseInt(datetime) == datetime) {
            if (datetime.length == 10) {
                datetime = parseInt(datetime) * 1000;
            } else if (datetime.length == 13) {
                datetime = parseInt(datetime);
            }
        }
        datetime = new Date(datetime);
        var o = {
            "M+": datetime.getMonth() + 1, //月份
            "d+": datetime.getDate(), //日
            "h+": datetime.getHours(), //小时
            "m+": datetime.getMinutes(), //分
            "s+": datetime.getSeconds(), //秒
            "q+": Math.floor((datetime.getMonth() + 3) / 3), //季度
            "S": datetime.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (datetime.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    } else {
        return "";
    }
};

function changeUpCase(str) {
    // str = str.toLocaleLowerCase();
    var newStr = str.replace(/\s[a-z]/g, function ($1) {
        return $1.toLocaleUpperCase()
    }).replace(/^[a-z]/, function ($1) {
        return $1.toLocaleUpperCase()
    }).replace(/\sOr[^a-zA-Z]|\sAnd[^a-zA-Z]|\sOf[^a-zA-Z]|\sAbout[^a-zA-Z]|\sFor[^a-zA-Z]|\sWith[^a-zA-Z]|\sOn[^a-zA-Z]/g, function ($1) {
        return $1.toLowerCase()
    });
    return newStr;
};

function joomPublish_upCaseTitle() {
    var oldStr = $("#shopifyPublish_editDetailForm input[name=title]").val();
    $("#shopifyPublish_editDetailForm input[name=title]").val(changeUpCase(oldStr));
}

//移除子listing,仅删除样式
function removeShopifySubListing(obj) {
    var listingStatus = $("#shopifyPublish_searchForm input[name=listingStatus]").val();
    if (listingStatus == 0 || listingStatus == 2) {
        $(obj).closest('tr').remove();
        var skuImgNum = 0;
        $("#shopifyPublish_editDetailForm .img_ssku_uri").each(function () {
            if ($(this).text()) {
                skuImgNum++;
            }
        });
        $("#shopifyPublish_editDetailForm #sSkuImgNum").text(skuImgNum);
    }
}

function addShopifySubListing() {
    var tr = '<tr>';
    tr += '<td hidden></td>\
        <td>\
            <img width="60" height="60" src=\'\' onerror="layui.admin.img_noFind()">\
            <a class="img_ssku_uri disN"></a>\
        </td>\
        <td><input type="text" class="layui-input" value=""></td>\
        <td><input type="text" class="layui-input" value="" onkeyup="value=value.replace(/[^/&apos;/&quot;\\a-\\z\\A-\\Z0-9\\u4E00-\\u9FA5\\[\\]\\{\\}\\(\\)\\-\\&\\\'\\.\\ ]/g,\'\')"></td>\
        <td><input type="text" class="layui-input" value="" onkeyup="value=value.replace(/[^/&apos;/&quot;\\a-\\z\\A-\\Z0-9\\u4E00-\\u9FA5\\[\\]\\{\\}\\(\\)\\-\\&\\\'\\.\\ ]/g,\'\')"></td>\
        <td><input type="number" class="layui-input" value=""></td>\
        <td><input type="number" class="layui-input" value=""></td>\
        <td><input type="number" class="layui-input" value=""></td>\
        <td><input type="number" class="layui-input" value=""></td>\
        <td></td>\
        <td><button type="button" class="layui-btn layui-btn-sm" onclick="removeShopifySubListing(this)">移除</button></td>';
    tr += '</tr>';
    $('#shopifyPublish_SubSkuInfo').append(tr);
}

//全选和反全选事件
shopifyPublishcheckbox_no_all('shopifyPublish_table')



//删除店铺商品旁边的按钮处理
function shopifyPublish_failRequestHandle(id) {
    var paramData = [];
    if (id) {
        paramData.push(id);
    } else {
        var data = $("#shopifyPublish_table tbody input.pid-cbox:checked");//改成了父sku
        if (data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                paramData.push(data[i].value);
            }
        }
    }
    if (paramData.length > 0) {
        loading.show();
        $.ajax({
            url: ctx + '/shopifyListing/changeListingStatus.html',
            type: "post",
            dataType: "json",
            data: {"idArr": paramData},
            traditional: true,
            success: function (returnData) {
                loading.hide();
                if (returnData.code != "0000") {
                    layer.alert(returnData.msg || '变更商品状态失败', {icon: 2});
                } else {
                    layer.msg('变更商品状态成功');
                    $("#shopifyPublish_search").trigger("click");
                }
            },
        });
    }
    else {
        layui.layer.msg("请至少选择1条数据");
    }
}