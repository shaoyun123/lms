
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
    // $("#fyndiqNewPublish_searchForm select[name=tortBanListing]").val("CURRENT_PLAT");

    form.render('select')
    form.render('radio')
    form.render('checkbox')
    formSelects.render('selectMan_newFyndiq');
    formSelects.render('selectAttr_newFyndiq');
    render_hp_orgs_users("#fyndiqNewPublish_searchForm");
    laydate.render({
        elem: '#fyndiqNewPublishTime', //渲染时间
        range: true
    });
    // alertCateSelect($('#newFyndiqPublishBtn'),$('#newFyndiqPublishHidden'),$('#newFyndiqPublishDiv'));
    //弹出分类框
    $("#newFyndiqPublishBtn").click(function() {
        admin.itemCat_select('layer-commodity-template-newFyndiqPublish', 'newFyndiqPublishHidden', 'newFyndiqPublishDiv')
    });
    // 选择店铺所在组织
    // form.on('select(fyndiqNewPublish_group_sel)', function (data) {
    //     var orgId = $.trim($("#fyndiqNewPublish_group_sel").val());
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
    //                     $("#fyndiqNewPublish_salesman_sel").html(str);
    //                     form.render('select');
    //                 } else {
    //                     layer.msg(returnData.msg);
    //                 }
    //             }
    //         });
    //     } else {
    //         var str = "<option value=''></option>";
    //         $("#fyndiqNewPublish_salesman_sel").html(str);  //清空人员框
    //     }
    // });

    // 选择店铺所在组
    // form.on('select(fyndiqNewPublish_salesman_sel)', function (data) {
    //     var userId = $.trim($("#fyndiqNewPublish_salesman_sel").val());
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
    //                 $("#fyndiqNewPublish_searchForm select[name=storeAcctId]").html(str);
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
        fyndiqNewPublish_searchProd();
    });

    //绑定更改事件
    form.on('select(fyndiqNewPublish_showHideVagueFlag)', function(data){
        console.log(data.value);
        if("pSkus"==data.value
            ||"sSkus"==data.value ){
            $("#fyndiq_newpublish #newFyndiq_skuVagueFlag_div").removeClass("disN");
        }else{
            $("#fyndiq_newpublish #newFyndiq_skuVagueFlag_div").addClass("disN");
        }
    });

    //清空按钮的点击事件
    $('#fyndiqNewPublish_reset').click(function () {
        $('#LAY-publishs-joom-publish-hidden').val('')
        $('#LAY-publishs-joom-publish-div').html('')
        formSelects.value('selectAttr', [])
        formSelects.value('selectMan', [])
        $('#fyndiqNewPublish_group_sel').next().find('dd[lay-value=""]').trigger('click');
        $('#newFyndiqPublishHidden').val('');
        $('#newFyndiqPublishDiv').html('');
    });

    var first = true;
    //监听tab切换来选中不同的tab页
    element.on('tab(fyndiqNewPublish_tab)', function (data) {
        $('#fyndiqNewPublish_div_selPubStyle').addClass('disN');

        var btn1 = $('#fyndiqNewPublish_btn_genListing');//生成店铺商品
        var btn3 = $('#fyndiqNewPublish_btn_delListing');//删除店铺商品
        var btn8 = $('#fyndiqNewPublish_btn_cancleOnTime'); //取消定时刊登
        var btn9 = $('#fyndiqNewPublish_btn_rePubNow'); //批量重新刊登
        var btn10 = $('#fyndiqNewPublish_btn_failRequest'); //刊登失败转换为图片刊登失败
        let con1 = $("#fyndiqNewPublish_searchForm .sortTypeCon")
        btn1.addClass('disN');
        btn3.addClass('disN');
        btn8.addClass('disN');
        btn9.addClass('disN');
        btn10.addClass('disN');
        con1.addClass('disN');
        $("#fyndiqNewPublish_searchForm input[name=shippingStatus]").val('')
        //相当于触发一次搜索
        if (data.index == 0) {
            btn1.removeClass('disN')
            con1.removeClass('disN')
            $("#fyndiqNewPublish_searchForm input[name=listingStatus]").val('-2')
        } else if (data.index == 1) {//待刊登
            $('#fyndiqNewPublish_div_selPubStyle').removeClass('disN');
            btn3.removeClass('disN')
            $("#fyndiqNewPublish_searchForm input[name=listingStatus]").val('0')
        } else if (data.index == 2) {//刊登中
            btn8.removeClass('disN');
            $("#fyndiqNewPublish_searchForm input[name=listingStatus]").val('3')
        } else if (data.index == 3) {//刊登成功
            btn10.removeClass('disN');
            $("#fyndiqNewPublish_searchForm input[name=listingStatus]").val('1')
        } else if (data.index == 4) {//刊登失败
            btn10.removeClass('disN');
            btn3.removeClass('disN');
            btn9.removeClass('disN');
            $("#fyndiqNewPublish_searchForm input[name=listingStatus]").val('2')
        }

        //每次触发,执行依次查询
        fyndiqNewPublish_searchProd();
    })

    form.on('select(fyndiqNewPublish_selPubStyle_filter)', function (data) {
        var selPubStyle = data.value;
        if (1 == selPubStyle) {
            $("#fyndiqNewPublish_btn_pubNow").trigger("click");
        }
        if (2 == selPubStyle) {
            $("#fyndiqNewPublish_btn_pubOnTime").trigger("click");
        }
        $('#fyndiqNewPublish_selPubStyle').val('');
        form.render('select')
    })


})

/*layui.use结束*/
function fyndiqNewPublish__layer_newFyndiq(id) {
    var listingStatus = $("#fyndiqNewPublish_searchForm input[name=listingStatus]").val();
    fyndiqNewPublish_getlistingDetail(id)
}

function genJoomListingDetailTpl(laytpl, $, returnData, layero) {
    laytpl($("#newFyndiqPulish_listDetailTpl").html()).render(returnData, function (html) {
        $(layero).find('.layui-layer-content').html(html);
        // form.render();
        $('#fyndiqNewPublish_extImg').sortable();
        commonAddEventTitleToggle($('#newFyndiqPublish_editContent'))
        // $('#prodJoomTagsNum').text($('input[name="tag"]').val().split(',').length);
        // $('input[data-role="tagsinput"]').tagsinput();

        //产品joom敏感货属性
        layui.formSelects.on('wishPublish_select_joomSens', function (id, vals, val, isAdd, isDisabled) {//需要多传个参数true,这样才能保证获取的vals是当前选择之后的结果(按选择过程排序)
            var newJoomSensProd = "";
            var oldDangerousKindValue=$("#fyndiqNewPublish_editDetailForm input[name=dangerousKindValue]").val();//变更前的值
            if(vals.length>0) {
                newJoomSensProd=vals[0].name;
                $("#fyndiqNewPublish_editDetailForm input[name=dangerousKindName]").val(vals[0].name);
                $("#fyndiqNewPublish_editDetailForm input[name=dangerousKindValue]").val(vals[0].value);
            }else{
                $("#fyndiqNewPublish_editDetailForm input[name=dangerousKindName]").val("普货");
                $("#fyndiqNewPublish_editDetailForm input[name=dangerousKindValue]").val("notDangerous");
            }
            var newDangerousKindValue=$("#fyndiqNewPublish_editDetailForm input[name=dangerousKindValue]").val();//变更后的值
            if(newDangerousKindValue!=oldDangerousKindValue){
                //需要求新的并回显
                var listingId = $("#fyndiqNewPublish_editDetailForm input[name=joomListingId]").val();
                $.ajax({
                    type: "post",
                    data: {"listingId": listingId, "newJoomSensProd": newJoomSensProd},
                    url: ctx + "/joomlisting/getNewSubListingPrice.html",
                    dataType: "json",
                    beforeSend: function(){
                        loading.show();
                    },
                    success: function (returnData) {
                        loading.hide();
                        if (returnData.code == "0000") {
                            //回显
                            $("#fyndiqNewPublish_SubSkuInfo").find("tr").each(function () {
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
        // $("#fyndiqNewPublish_editDetailForm input[name=dangerousKindValue]").val(returnData.prodListingJoom.dangerousKind);//listing敏感属性
        // if(returnData.prodListingJoom.dangerousKind=='notDangerous'){
        //     $("#fyndiqNewPublish_editDetailForm input[name=dangerousKindName]").val("普货");
        // }else{
        //     console.log(joomSensArray1);
        //     for(var i=0;i<joomSensArray1.length;i++){
        //         if(joomSensArray1[i].value==returnData.prodListingJoom.dangerousKind){
        //             $("#fyndiqNewPublish_editDetailForm input[name=dangerousKindName]").val(joomSensArray1[i].name);
        //             break;
        //         }
        //     }
        // }
    });
    var listingStatus = $("#fyndiqNewPublish_searchForm input[name=listingStatus]").val();
    // console.log('状态是', listingStatus);
    if (0 == listingStatus || 2 == listingStatus) {
        $('.addShopifySubListing').removeClass("disN");
    }
    else {
        $('.addShopifySubListing').addClass("disN");
    }
    //设置数量
    var skuImgNum = 0;
    $("#fyndiqNewPublish_editDetailForm .img_ssku_uri").each(function () {
        if ($(this).text()) {
            skuImgNum++;
        }
    });
    $("#sSkuImgNum").text(skuImgNum);
}

//已生成的详情框
function fyndiqNewPublish_getlistingDetail(id) {
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
            fyndiqNewPublish_editListingProd(id, true, layero)
            return false;
        },
        btn2: function (index, layero) {
            fyndiqNewPublish_editListingProd(id, false, layero)
            return false;
        },
        success: function (layero, index) {
            //只有带刊登的详情可以修改
            var listingStatus = $("#fyndiqNewPublish_searchForm input[name=listingStatus]").val();
            if ('0' == listingStatus || '2' == listingStatus) {
                $(layero).find(".layui-layer-btn0").show();
            } else {
                $(layero).find(".layui-layer-btn0").hide();
                $(layero).find(".layui-layer-btn1").hide();
            }
            
            $.ajax({
                // url: ctx + '/shopifyListing/getListingInfo.html',
                url: ctx + '/fyndiq/new/listing/getListingInfo.html',
                type: 'post',
                dataType: 'json',
                data: {id: id, listingStatus: listingStatus},
                beforeSend: function(){
                    loading.show();
                },
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
function fyndiqNewPublishcheckbox_no_all(tableId) {
    /*获取表头checkbox和美化后的元素*/
    var $ = layui.$;
    //默认查待生成
    var listingStatus = $("#fyndiqNewPublish_searchForm input[name=listingStatus]").val();

    var shippingStatus = $("#fyndiqNewPublish_searchForm input[name=shippingStatus]").val();

    var isSale =layui.formSelects?.value('fyndiq_is_sale_status_sel', 'val');

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
        // if (isSale == 'true') {
        //     isNotSale_td.empty();
        // } else if (isSale == 'false') {
        //     isSale_td.empty();
        // }
        if (['1','2'].includes(isSale)) {
            isNotSale_td.empty();
        } else if (isSale == '0') {
            isSale_td.empty();
        }
    }
}

function fyndiqNewPublish_getSearchData() {
    var data = new Object();
    //默认查待生成
    data.listingStatus = $("#fyndiqNewPublish_searchForm input[name=listingStatus]").val();

    data.shippingStatus = $("#fyndiqNewPublish_searchForm input[name=shippingStatus]").val();
    data.storeAcctId = $("#fyndiqNewPublish_searchForm select[name=storeAcctId]").val();
    data.tag = $("#fyndiqNewPublish_searchForm select[name=tag]").val();
    data.devType = $("#fyndiqNewPublish_searchForm select[name=devType]").val();

    //物流属性
    data.existLogisAttrs = [];
    data.notExistLogisAttrs = [];
    data.prodCateId = $("#fyndiqNewPublish_searchForm #newFyndiqPublishHidden").val(); //类目id
    var logisAttrContents = layui.formSelects.value("selectAttr_newFyndiq");

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
    var bizzOwnerContents = layui.formSelects.value("selectMan_newFyndiq");
    for (var j = 0; j < bizzOwnerContents.length; j++) {
        data.bizzOwnerIds.push(bizzOwnerContents[j].val);
    }
    //日期
    var timeStr = $("#fyndiqNewPublish_searchForm input[name=time]").val();
    if (timeStr) {
        data.startTime = Date.parse(timeStr.split(" - ")[0] + " 00:00:00");
        data.endTime = Date.parse(timeStr.split(" - ")[1] + " 23:59:59");
    }
    data.timeType = $("#fyndiqNewPublish_searchForm select[name=timeType]").val();
    data.saleStatusList = layui.formSelects?.value('fyndiq_is_sale_status_sel', 'val');
    data.isPublish = $("#fyndiqNewPublish_searchForm select[name=isPublish]").val();
    data.pSkus = [];
    data.sSkus = [];
    data.skuVagueFlag=$("#fyndiqNewPublish_searchForm select[name=skuVagueFlag]").val()
    if ("pSkus" == $("#fyndiqNewPublish_searchForm select[name=searchType]").val()) {
        var pSkustmp = $("#fyndiqNewPublish_searchForm input[name=searchText]").val()
        if (pSkustmp.length > 0) {
            pSkustmp = pSkustmp.split(",");
            if (pSkustmp.length > 0) {
                for (i = 0; i < pSkustmp.length; i++) {
                    data.pSkus.push(pSkustmp[i]);
                }
            }
        }
    }
    if ("sSkus" == $("#fyndiqNewPublish_searchForm select[name=searchType]").val()) {
        var sSkustmp = $("#fyndiqNewPublish_searchForm input[name=searchText]").val();
        if (sSkustmp.length > 0) {
            sSkustmp = sSkustmp.split(",");
        }
        if (sSkustmp.length > 0) {
            for (i = 0; i < sSkustmp.length; i++) {
                data.sSkus.push(sSkustmp[i]);
            }
        }
    }
    // 排序
    if(data.listingStatus == -2){
        data.sortType = $("#fyndiqNewPublish_searchForm select[name=sortType]").val()
    } else {
        data.sortType = ''
    }
    //禁售
    data.isProhibit=$("#fyndiqNewPublish_searchForm select[name=isProhibit]").val()
    return data;
}


//请求需要包含参数,首次获取默认,使用分页控件修改属性,并使用修改后的属性,在页面中搜索,重置为第一页
var limitAllAppoint = 100;//每页显示数据条数
var currentPageAllAppoint = 1;//当前页数
var dataLength = 0;//数据总条数

// 搜索商品按钮事件
function fyndiqNewPublish_searchProd() {
    var storeAcctId = $("#fyndiqNewPublish_searchForm select[name=storeAcctId]").val();
    if (null == storeAcctId || '' == storeAcctId) {
        layer.msg("店铺不得为空");
        return;
    }
    currentPageAllAppoint = 1; //当点击搜索的时候，应该回到第一页
    dataLength = 0;
    fyndiqNewPublish_search();
}

function fyndiqNewPublish_search() {
    var form = layui.form,
        laypage = layui.laypage;
    var data = fyndiqNewPublish_getSearchData();

    data.page = currentPageAllAppoint;
    data.limit = limitAllAppoint;
    $.ajax({
        // url: ctx + '/shopifyListing/queryList.html',
        url: ctx + '/fyndiq/new/listing/queryList.html',
        type: "post",
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify(data),
        traditional: true,//确保数组传参正确
        beforeSend: function(){
            loading.show();
        },
        success: function (returnData) {
            dataLength = returnData.count;
            var joomCol = {
                one: '<colgroup><col width="30px"/><col width="50px" /><col width="15%" /><col width="10%"/><col width="30px"/><col width="70px"/><col width="70px"/><col width="7%"/><col width="7%"/><col width="7%"/><col width="7%"/><col width="7%"/><col width="7%"/><col width="7%"/></colgroup>',
                two: '<colgroup><col width="10px"/><col width="50px" /><col width="15%" /><col width="15%"/><col width="10px"/><col width="60px"/><col width="60px"/><col width="7%"/><col width="7%"/><col width="7%"/><col width="7%"/><col width="7%"/><col width="7%"/><col width="7%"/></colgroup>',
                three: '<colgroup><col width="30px"/><col width="70px" /><col width="200px" /><col width="120px"/><col width="30px"/><col width="100px"/><col width="100px"/><col width="60px"/><col width="60px"/><col width="60px"/><col width="60px"/><col width="60px"/><col width="60px"/><col width="60px"/> <col width="60px"/><col width="17%"/></colgroup>',
                four:'<colgroup><col width="30px"/><col width="70px" /><col width="200px" /><col width="120px"/><col width="30px"/><col width="100px"/><col width="100px"/><col width="60px"/><col width="60px"/><col width="60px"/><col width="60px"/><col width="60px"/><col width="60px"/><col width="60px"/> <col width="60px"/><col width="7%"/></colgroup>',
                five: '<colgroup><col width="30px"/><col width="70px" /><col width="200px" /><col width="120px"/><col width="30px"/><col width="140px"/><col width="120px"/><col width="60px"/><col width="60px"/><col width="60px"/><col width="60px"/><col width="60px"/><col width="60px"/><col width="60px"/> <col width="60px"/><col width="7%"/></colgroup>',
                rep: function(str) {
                    $('.fyndiqNewPublish_table_head').find('.layui-table colgroup').remove()
                    $('.fyndiqNewPublish_table_body').find('.layui-table colgroup').remove()
                    $('.fyndiqNewPublish_table_head').find('.layui-table').prepend(str)
                    $('.fyndiqNewPublish_table_body').find('.layui-table').prepend(str)
                }
            }
            html = template('fyndiqNewPublish_tpl', returnData);
            $('#fyndiqNewPublish_table').html(html);
            //固定表头
            theadHandle().fixTh({id:'#fyndiqNewPublishCard',h:150,dv1:'.layui-tab-title',dv2:'.fyndiqNewPublish_table_head',dv3:'#newFyndiq_btn_show_hide',i:35});
            form.render('checkbox');
            imageLazyload();//懒加载
            var listingStatus = $("#fyndiqNewPublish_searchForm input[name=listingStatus]").val();
            var shippingStatus = $("#fyndiqNewPublish_searchForm input[name=shippingStatus]").val();
            $("#fyndiq_newpublish .listingSuccInfo").hide();
            $("#fyndiq_newpublish .timeClass").hide();
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

            if(returnData.count * 1 > 10000){
                returnData.count = '>10000'
            }

            //仅刊登失败对应的展示,展示状态和失败原因
            if (-2 == listingStatus) {//商品
                $("#fyndiq_newpublish .colspan_td").attr("colSpan", 6);
                $("#fyndiq_newpublish .failInfo").hide();
                $("#fyndiq_newpublish .shippingInfo").hide();
                $("#fyndiq_newpublish .timeClass").show();
                $("#fyndiq_newpublish .listTiming").hide();
                $("#fyndiq_newpublish .auditTime").show();
                $("#fyndiq_newpublish .saleNum").show();
                $("#fyndiq_newpublish .storeSubSkuInfo").hide();
                $("#fyndiq_newpublish .listingInfo").hide();
                $("#fyndiq_newpublish .prodStock").show();
                $("#fyndiq_newpublish .listingStock").hide();
                $("#fyndiq_newpublish .detailInfoBtn").hide();
                $("#fyndiq_newpublish .publishBtn").hide();
                $('#fyndiq_newpublish #newFyndiq_totalNum').text(`商品(${returnData.count})`);
                $("#fyndiq_newpublish #newFyndiq_toListingNum").text("待刊登");
                $("#fyndiq_newpublish #newFyndiq_listingNum").text("刊登中");
                $("#fyndiq_newpublish #newFyndiq_listingSucNum").text("刊登成功");
                $("#fyndiq_newpublish #newFyndiq_listingFailNum").text("刊登失败");
                $("#fyndiq_newpublish #newFyndiq_listingImgNum").text("图片上传失败");
                console.log('商品')
            }
            else if (0 == listingStatus) {
                $("#fyndiq_newpublish .colspan_td").attr("colSpan", 9);
                $("#fyndiq_newpublish .failInfo").hide();
                $("#fyndiq_newpublish .shippingInfo").hide();
                $("#fyndiq_newpublish .listTiming").hide();
                $("#fyndiq_newpublish .auditTime").hide();
                $("#fyndiq_newpublish .saleNum").hide();
                $("#fyndiq_newpublish .storeSubSkuInfo").show();
                $("#fyndiq_newpublish .listingInfo").show();
                $("#fyndiq_newpublish .prodStock").hide();
                $("#fyndiq_newpublish .listingStock").show();
                $("#fyndiq_newpublish .detailInfoBtn").show();
                $("#fyndiq_newpublish .publishBtn").hide();
                joomCol.rep(joomCol.one)
                $('#fyndiq_newpublish #newFyndiq_totalNum').text(`商品`);
                $("#fyndiq_newpublish #newFyndiq_toListingNum").text(`待刊登(${returnData.count})`);
                $("#fyndiq_newpublish #newFyndiq_listingNum").text(`刊登中`);
                $("#fyndiq_newpublish #newFyndiq_listingSucNum").text(`刊登成功`);
                $("#fyndiq_newpublish #newFyndiq_listingFailNum").text(`刊登失败`);
                $("#fyndiq_newpublish #newFyndiq_listingImgNum").text(`图片上传失败`);
                console.log('待刊登')
            }
            else if (1 == listingStatus) {
                $("#fyndiq_newpublish .colspan_td").attr("colSpan", 9);
                $("#fyndiq_newpublish .failInfo").hide();
                $("#fyndiq_newpublish .shippingInfo").hide();
                $("#fyndiq_newpublish .timeClass").show();
                $("#fyndiq_newpublish .listingTime").show();
                $("#fyndiq_newpublish .listTiming").hide();
                $("#fyndiq_newpublish .auditTime").hide();
                $("#fyndiq_newpublish .saleNum").hide();
                $("#fyndiq_newpublish .storeSubSkuInfo").show();
                $("#fyndiq_newpublish .listingInfo").show();
                $("#fyndiq_newpublish .prodStock").hide();
                $("#fyndiq_newpublish .listingStock").show();
                $("#fyndiq_newpublish .listingSuccInfo").show();
                $("#fyndiq_newpublish .detailInfoBtn").show();
                $("#fyndiq_newpublish .publishBtn").hide();
                joomCol.rep(joomCol.four)
                $('#fyndiq_newpublish #newFyndiq_totalNum').text(`商品`);
                $("#fyndiq_newpublish #newFyndiq_toListingNum").text(`待刊登`);
                $("#fyndiq_newpublish #newFyndiq_listingNum").text(`刊登中`);
                $("#fyndiq_newpublish #newFyndiq_listingSucNum").text(`刊登成功(${returnData.count})`);
                $("#fyndiq_newpublish #newFyndiq_listingFailNum").text(`刊登失败`);
                $("#fyndiq_newpublish #newFyndiq_listingImgNum").text(`图片上传失败`);
                console.log('刊登成功')
            }
            else if (2 == listingStatus) {
                $("#fyndiq_newpublish .colspan_td").attr("colSpan", 9);
                $("#fyndiq_newpublish .failInfo").show();
                $("#fyndiq_newpublish .shippingInfo").hide();
                $("#fyndiq_newpublish .listTiming").hide();
                $("#fyndiq_newpublish .auditTime").hide();
                $("#fyndiq_newpublish .saleNum").hide();
                $("#fyndiq_newpublish .storeSubSkuInfo").show();
                $("#fyndiq_newpublish .listingInfo").show();
                $("#fyndiq_newpublish .prodStock").hide();
                $("#fyndiq_newpublish .listingStock").show();
                $("#fyndiq_newpublish .detailInfoBtn").show();
                $("#fyndiq_newpublish .publishBtn").show();
                joomCol.rep(joomCol.two)
                $('#fyndiq_newpublish #newFyndiq_totalNum').text(`商品`);
                $("#fyndiq_newpublish #newFyndiq_toListingNum").text(`待刊登`);
                $("#fyndiq_newpublish #newFyndiq_listingNum").text(`刊登中`);
                $("#fyndiq_newpublish #newFyndiq_listingSucNum").text(`刊登成功`);
                $("#fyndiq_newpublish #newFyndiq_listingFailNum").text(`刊登失败(${returnData.count})`);
                $("#fyndiq_newpublish #newFyndiq_listingImgNum").text(`图片上传失败`);
                console.log('刊登失败')

            }
            else if (3 == listingStatus) {
                $("#fyndiq_newpublish .colspan_td").attr("colSpan", 9);
                $("#fyndiq_newpublish .failInfo").hide();
                $("#fyndiq_newpublish .shippingInfo").hide();
                $("#fyndiq_newpublish .timeClass").show();
                $("#fyndiq_newpublish .listTiming").show();
                $("#fyndiq_newpublish .auditTime").hide();
                $("#fyndiq_newpublish .saleNum").hide();
                $("#fyndiq_newpublish .storeSubSkuInfo").show();
                $("#fyndiq_newpublish .listingInfo").show();
                $("#fyndiq_newpublish .prodStock").hide();
                $("#fyndiq_newpublish .listingStock").show();
                $("#fyndiq_newpublish .detailInfoBtn").show();
                $("#fyndiq_newpublish .publishBtn").hide();
                joomCol.rep(joomCol.three)
                $('#fyndiq_newpublish #newFyndiq_totalNum').text(`商品`);
                $("#fyndiq_newpublish #newFyndiq_toListingNum").text(`待刊登`);
                $("#fyndiq_newpublish #newFyndiq_listingNum").text(`刊登中(${returnData.count})`);
                $("#fyndiq_newpublish #newFyndiq_listingSucNum").text(`刊登成功`);
                $("#fyndiq_newpublish #newFyndiq_listingFailNum").text(`刊登失败`);
                $("#fyndiq_newpublish #newFyndiq_listingImgNum").text(`图片上传失败`);
                console.log('刊登中')
            }
            else if (5 == listingStatus) {
                $("#fyndiq_newpublish .colspan_td").attr("colSpan", 9);
                $("#fyndiq_newpublish .failInfo").hide();
                $("#fyndiq_newpublish .shippingInfo").hide();
                $("#fyndiq_newpublish .timeClass").show();
                $("#fyndiq_newpublish .listTiming").show();
                $("#fyndiq_newpublish .auditTime").hide();
                $("#fyndiq_newpublish .saleNum").hide();
                $("#fyndiq_newpublish .storeSubSkuInfo").show();
                $("#fyndiq_newpublish .listingInfo").show();
                $("#fyndiq_newpublish .prodStock").hide();
                $("#fyndiq_newpublish .listingStock").show();
                $("#fyndiq_newpublish .detailInfoBtn").show();
                $("#fyndiq_newpublish .publishBtn").hide();
                joomCol.rep(joomCol.two)
                $('#fyndiq_newpublish #newFyndiq_totalNum').text(`商品`);
                $("#fyndiq_newpublish #newFyndiq_toListingNum").text(`待刊登`);
                $("#fyndiq_newpublish #newFyndiq_listingNum").text(`刊登中`);
                $("#fyndiq_newpublish #newFyndiq_listingSucNum").text(`刊登成功`);
                $("#fyndiq_newpublish #newFyndiq_listingFailNum").text(`刊登失败`);
                $("#fyndiq_newpublish #newFyndiq_listingImgNum").text(`图片上传失败(${returnData.count})`);
                console.log('图片上传失败')
            }

            //全选和反全选事件
            fyndiqNewPublishcheckbox_no_all('fyndiqNewPublish_table')
            loading.hide();
            joomPublish_toPage();
        }
    });
}

function joomPublish_toPage() {
    laypage = layui.laypage;
    //处理分页
    laypage.render({
        layout: ['prev', 'page', 'next'],
        groups: 5,
        prev: '<上一页',
        next: '下一页>',
        first: false, //显示首页
        last: false, //显示尾页
        limit: 50,
        limits: [50, 100, 300],
        elem: 'fyndiqNewPublish_pagination',
        count: dataLength, //数据总数，从服务端得到
        // layout: ['count', 'prev', 'page', 'next', 'limit', 'refresh', 'skip'],
        layout: [ 'prev', 'page', 'next', 'skip','refresh','count', 'limit'],
        // limits: [30, 50, 100, 300],
        curr: currentPageAllAppoint,
        // limit: limitAllAppoint,
        jump: function (obj, first) {
            currentPageAllAppoint = obj.curr;
            limitAllAppoint = obj.limit;
            //首次不执行
            if (!first) {
                fyndiqNewPublish_search()
            }
        }
    });
}

function fyndiqNewPublish_genToListingProd() {
    var wrapData = $("#fyndiqNewPublish_table tbody input.pid-cbox:checked");
    var storeAcctId = $("#fyndiqNewPublish_searchForm select[name=storeAcctId]").val();
    var paramData = [];
    if (wrapData.length > 0) {
        for (var i = 0; i < wrapData.length; i++) {
            paramData.push(wrapData[i].value);
        }
        $.ajax({
            beforeSend: function () {
                loading.show();
            },
            url: ctx + `/fyndiq/new/listing/addStoreProds.html?storeAcctId=${storeAcctId}`,
            type: "post",
            dataType: "json",
            contentType: 'application/json',
            data: JSON.stringify(paramData),
            traditional: true,
            success: function (returnData) {
                loading.hide();
                if (returnData.code != "0000") {
                    let content = returnData.data && returnData.data.join('')
                    
                    layer.open({
                        title: '生成商品失败',
                        content: content
                    });
                } else {
                    layer.msg('生成待刊登信息成功', {icon: 1});
                    $("#fyndiqNewPublish_search").trigger("click");
                }
            }
        });
    }
    else {
        layer.msg("请至少选择1条数据");
    }
}

//删除店铺商品
function fyndiqNewPublish_deletelisting(id) {
    var paramData = [];
    if (id) {
        paramData.push(id);
    } else {
        var data = $("#fyndiqNewPublish_table tbody input.sid-cbox:checked");
        if (data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                paramData.push(data[i].value);
            }
        }
    }
    var listingStatus = $("#fyndiqNewPublish_searchForm input[name=listingStatus]").val();
    if (paramData.length > 0) {
        $.ajax({
            url: ctx + '/fyndiq/new/listing/deletelisting.html',
            type: "post",
            dataType: "json",
            data: {"idArr": paramData, "listingStatus": listingStatus},
            traditional: true,
            beforeSend: function(){
                loading.show();
            },
            success: function (returnData) {
                loading.hide();
                if (returnData.code != "0000") {
                    layer.alert(returnData.msg || '删除商品失败', {icon: 2});
                } else {
                    layer.msg('删除店铺刊登信息成功');
                    $("#fyndiqNewPublish_search").trigger("click");
                }
            },
        });
    }
    else {
        layui.layer.msg("请至少选择1条数据");
    }
}

// 立即刊登
function newFyndiqListingPublish(listingId, singleReListingSub) {

    var listingStatus = $("#fyndiqNewPublish_searchForm input[name=listingStatus]").val();
    var paramData = new Array();
    var data;
    if (listingId) {//
        paramData.push(listingId);
    } else {
        //非单个子商品重新刊登
        if (!singleReListingSub) {
            data = $("#fyndiqNewPublish_table tbody input.pid-cbox:checked");
        } else {
            data = $("#fyndiqNewPublish_table tbody input.sid-cbox:checked");
        }

        if (data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                paramData.push(data[i].value);
            }

        }
    }
    if (paramData.length > 0) {
        let layerIndex = layer.open({
            type: 1,
            title: '立即刊登',
            btn: ['立即刊登',"取消"],
            content: "加载中...",
            id:new Date().getTime(),
            success: function (layero, index) {
                $(layero).find('.layui-layer-content').html($("#newFyndiqPulish_TimingTpl").html());
                layui.form.render("checkbox");
            },
            yes: function (index, layero) {
                let _data = serializeObject($("#fyndiqNewPublish_TimingTplForm"))
        layer.open({
            title: '刊登提示'
            ,content: '商品成功进入刊登流程,稍后查看刊登结果,请勿重复点击刊登！'
        });
                layer.close(layerIndex)
        $.ajax({
            url: ctx + '/fyndiq/new/listing/publishListing.html',
            type: "post",
            dataType: "json",
            data: {"idArr": paramData,"markets":_data.markets},//是否子sku重发
            traditional: true,
            success: function (returnData) {
            },
            complete: function () {
                loading.hide();
            },
        });
            }
        })
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
                $("#fyndiqNewPublish_search").trigger("click");
            }
        },
        complete: function () {
            loading.hide();
        },
    });
}

function joomPublish_exportskumapping() {
    var data = fyndiqNewPublish_getSearchData();
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

function fyndiqNewPublish_delImg(obj) {
    layer.confirm('您确认要删除图片？', {icon: 3, title: '提示'}, function (index) {
        $(obj).closest('li').remove();
        var imgTotalNum = $("#fyndiqNewPublish_extImg li").length;
        $("#fyndiqNewPublish_editDetailForm #curImgNum").text(imgTotalNum);

        //设置数量
        var skuImgNum = 0;
        $("#fyndiqNewPublish_editDetailForm .img_ssku_uri").each(function () {
            if ($(this).text()) {
                skuImgNum++;
            }
        });
        $("#sSkuImgNum").text(skuImgNum);
        layer.close(index);
    });
}

function fyndiqNewPublish_setMainImg(obj) {
    var extImgUrl = $(obj).closest('.ImgDivOut').find('input').val();
    var mainImgUrl = $("#fyndiqNewPublish_mainImg .ImgDivIn").find('input').val();
    if (mainImgUrl) {
        $(obj).closest('.ImgDivOut').find('img').attr('src', mainImgUrl);
        $(obj).closest('.ImgDivOut').find('input').attr('value', mainImgUrl);
    } else {
        $(obj).closest('li').remove();
        var imgTotalNum = $("#fyndiqNewPublish_extImg li").length;
        $("#fyndiqNewPublish_editDetailForm #curImgNum").text(imgTotalNum);
        var skuImgNum = 0;
        $("#fyndiqNewPublish_SubSkuInfo .img_ssku_uri").each(function () {
            if ($(this).val()) {
                skuImgNum++;
            }
        });
        $("#sSkuImgNum").text(skuImgNum);
    }
    if (extImgUrl) {
        $("#fyndiqNewPublish_mainImg .ImgDivIn").find('img').attr('src', extImgUrl);
        $("#fyndiqNewPublish_mainImg .ImgDivIn").find('input').attr('value', extImgUrl);
    }
}

//isPublish 是否立即发布
function fyndiqNewPublish_editListingProd(id, isPublish, layero) {
    var layer = layui.layer,
        laytpl = layui.laytpl,
        $ = layui.$;
    var mainImgUrl = $("#fyndiqNewPublish_mainImg .ImgDivIn").find('img').attr('src');
    var extImg = "";
    $("#fyndiqNewPublish_extImg .ImgDivIn").each(function () {
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
    detailData.title = $("#fyndiqNewPublish_editDetailForm input[name=title]").val(); //刊登标题
    detailData.bodyHtml = $("#fyndiqNewPublish_editDetailForm textarea[name=prodDesc]").val();//描述
    detailData.tag = $("#fyndiqNewPublish_editDetailForm input[name=tag]").val(); //tag
    detailData.listingStatus = $("#fyndiqNewPublish_searchForm input[name=listingStatus]").val(); //刊登状态
    
    //添加子sku
    detailData.prodListingSubSkuFyndiqNewDtoList = fyndiqNewPublish_getSkusInfo(); //详情表格数据
    if (detailData.prodListingSubSkuFyndiqNewDtoList.length < 1) {
        layer.msg('请至少保留一条子sku信息');
        return;
    }
    var minPrice = 0;
    for (var m = 0; m < detailData.prodListingSubSkuFyndiqNewDtoList.length; m++) {
        if (minPrice == 0 || minPrice > detailData.prodListingSubSkuFyndiqNewDtoList[m].price) {
            minPrice = detailData.prodListingSubSkuFyndiqNewDtoList[m].price;
        }
    }
    for (var n = 0; n < detailData.prodListingSubSkuFyndiqNewDtoList.length; n++) {
        if (detailData.prodListingSubSkuFyndiqNewDtoList[n].price > minPrice * 4) {
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
    $("#fyndiqNewPublish_SubSkuInfo").find("tr").each(function () {
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
    var subs = detailData.prodListingSubSkuFyndiqNewDtoList;
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
        url: ctx + '/fyndiq/new/listing/editListingDetail.html',
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
                $("#fyndiqNewPublish_search").trigger("click");
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
function fyndiqNewPublish_addExtPic() {
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

function fyndiqNewPublish_addtempPic() {
    const limit = $('#maxImgNum').text()
    const existImgs = $('#curImgNum').text()
    const prodTempIdList = Array.from($("#fyndiqNewPublish_SubSkuInfo tr").map((_, item) => $(item).data("prodtempid")))

    const params = {
        param: {prodTempIds: prodTempIdList},
        limit,
        existImgs,
        cb: function (tplUrlList, fullImgList) {
            if (Array.isArray(tplUrlList) && tplUrlList.length) {
                tplUrlList.forEach(item=> {
                    joomPublish_showImg4(item);
                })
            }
        },
    }
    comPickImageTpl(params,'fyndiq')
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
    $("#fyndiqNewPublish_editDetailForm .img_ssku_uri").each(function () {
        if ($(this).text()) {
            skuImgNum++;
        }
    });

    var imgTotalNum2 = $("#fyndiqNewPublish_extImg li").length;
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
    $("#sSkuImgNum").text(skuImgNum);
}

function joomPublish_showImg4(url) {
    var tpl = '';
    tpl += joomPublish_imgData['img']['tpl'];
    //layer.msg(url);
    var div = tpl.replace(/&{url}/g, url);
    $('#fyndiqNewPublish_extImg').append(div);
    var imgTotalNum = $("#fyndiqNewPublish_extImg li").length;
    $("#fyndiqNewPublish_editDetailForm #curImgNum").text(imgTotalNum);
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
        '<a onclick="fyndiqNewPublish_setMainImg(this);" href="javascript:void(0);" style="float:left; color: #73a1bf;">设为主图</a><a onclick="fyndiqNewPublish_delImg(this);" href="javascript:void(0);" style="float:right; color: #73a1bf;">移除</a>' +
        '</div></div></div></li>'
    }
}

// 获取SKU信息表的数据
function fyndiqNewPublish_getSkusInfo() {
    var subSkus = [];
    var tdArr;
    var varient;
    $("#fyndiqNewPublish_SubSkuInfo").find("tr").each(function () {
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
        // varient.price = tdArr.eq(5).find('input').val();
        // 瑞典(sek)
        varient.price = tdArr.eq(5).find('input:eq(0)').val();
        // 芬兰(eur)
        varient.fiPrice  = tdArr.eq(5).find('input:eq(1)').val();
        varient.fiOriginalPrice  = tdArr.eq(5).find('input:eq(2)').val();
        varient.fiShipping  = tdArr.eq(5).find('input:eq(3)').val();

        varient.noPrice = tdArr.eq(5).find('input:eq(4)').val();
        varient.dkPrice = tdArr.eq(5).find('input:eq(5)').val();
        varient.noShipping  = tdArr.eq(5).find('input:eq(6)').val();
        varient.noOriginalPrice  = tdArr.eq(5).find('input:eq(7)').val();
        varient.dkShipping  = tdArr.eq(5).find('input:eq(8)').val();
        varient.dkOriginalPrice  = tdArr.eq(5).find('input:eq(9)').val();

        varient.stock = tdArr.eq(6).find('input').val();
        subSkus.push(varient);
    });
    return subSkus;
}

//定时刊登商品
function fyndiqNewPublish_OnTiming() {
    var layer = layui.layer,
        $ = layui.$;
    var ids = [];
    //生成多个
    $("#fyndiqNewPublish_table tbody tr  input.pid-cbox:checked").each(function () {
        ids.push($(this).val());
    });
    if (ids.length < 1) {
        layer.msg("未选中商品");
        return;
    }
    layer.open({
        type: 1,
        title: '定时刊登',
        btn: ['定时刊登',"取消"],
        //area: ['100%', '100%'],
        content: "加载中...",
        success: function (layero, index) {
            $(layero).find('.layui-layer-content').html($("#newFyndiqPulish_listTimingTpl").html());
            //时间选择器
            layui.laydate.render({
                elem: '#newFyndiqPulish_listTiming'
                , type: 'datetime'
                , format: 'yyyy-MM-dd HH:mm'
            });
            layui.form.render("checkbox");
        },
        yes: function (index, layero) {
            let _data = serializeObject($("#fyndiqNewPublish_listTimingTplForm"))
            if (_data.listTiming == ''){
                layer.msg("定时刊登开始时间不能为空");
                return;
            }
            $.ajax({
                type: "post",
                url: ctx + '/fyndiq/new/listing/listTiming.html',
                dataType: "json",
                data: {
                    ids: ids.join(","),
                    listTiming: new Date(_data.listTiming).getTime(),
                    markets: _data.markets
                },
                beforeSend: function(){
                    loading.show();
                },
                success: function (returnData) {
                    loading.hide();
                    if (returnData.code != "0000") {
                        layer.msg(returnData.msg);
                    } else {
                        layer.msg("定时刊登成功");
                        layer.close(index);
                        $("#fyndiqNewPublish_search").trigger("click");
                    }
                }
            });
        }
    })
}

//取消定时刊登商品
function fyndiqNewPublish__canclePublishOnTiming() {
    var layer = layui.layer,
        $ = layui.$;
    var ids = [];
    //生成多个
    $("#fyndiqNewPublish_table tbody tr  input.pid-cbox:checked").each(function () {
        ids.push($(this).val());
    });
    if (ids.length < 1) {
        layer.msg("未选中商品");
        return;
    }

    $.ajax({
        type: "post",
        url: ctx + "/fyndiq/new/listing/cancelListTiming.html",
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
                $("#fyndiqNewPublish_search").trigger("click");
            }
        }
    });
}

function fyndiqNewPublish__setShipping() {
    var ids = [];
    //生成多个
    $("#fyndiqNewPublish_table tbody tr  input.pid-cbox:checked").each(function () {
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
    var oldStr = $("#fyndiqNewPublish_editDetailForm input[name=title]").val();
    $("#fyndiqNewPublish_editDetailForm input[name=title]").val(changeUpCase(oldStr));
}

//移除子listing,仅删除样式
function removeShopifySubListing(obj) {
    var listingStatus = $("#fyndiqNewPublish_searchForm input[name=listingStatus]").val();
    if (listingStatus == 0 || listingStatus == 2) {
        $(obj).closest('tr').remove();
        var skuImgNum = 0;
        $("#fyndiqNewPublish_editDetailForm .img_ssku_uri").each(function () {
            if ($(this).text()) {
                skuImgNum++;
            }
        });
        $("#sSkuImgNum").text(skuImgNum);
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
        <td><div class="fyndiq_price"><span>瑞典(sek)</span><span>芬兰(eur)</span><span><input type="number" class="layui-input" value=""></span><span><input type="number" class="layui-input" value=""></span><input type="hidden"><input type="hidden"></div></td>\
        <td><input type="number" class="layui-input" value=""></td>\
        <td></td>\
        <td><button type="button" class="layui-btn layui-btn-sm" onclick="removeShopifySubListing(this)">移除</button></td>';
    tr += '</tr>';
    $('#fyndiqNewPublish_SubSkuInfo').append(tr);
}

//全选和反全选事件
fyndiqNewPublishcheckbox_no_all('fyndiqNewPublish_table')


//渲染开发类型,商品标签和物流属性
function newpublishRenderSelect(){
    commonReturnPromise({
        url: '/lms/fyndiq/new/listing/manage.html'
    })
    .then(function(result){
        //开发类型devTypeEnums[数组]
        var devTypeEnums = result.devTypeEnums;
        commonRenderSelect("newpublish_devType", devTypeEnums).then(function(){
            layui.form.render('select');
        });
        //商品标签prodTagMap[数组对象]
        var prodTagMap=result.prodTagMap;
        commonRenderSelect("newpublish_prodTagMap", prodTagMap, {
            name: 'name',
            code: 'name'
        }).then(function(){
            layui.form.render('select');
        });
        //物流属性logisAttrEnums[数组]
        var logisAttrEnums = result.logisAttrEnums;
        commonRenderSelect("newpublish_logisAttrEnum", logisAttrEnums).then(function(){
            layui.formSelects.render("selectAttr_newFyndiq");
        })
        //商品归属人[数组对象]
        var bizzOwners = result.bizzOwners;
        commonRenderSelect("newpublish_bizzOwnerIds", bizzOwners, {
            name: 'userName',
            code: 'id'
        }).then(function(){
            layui.formSelects.render("selectMan_newFyndiq");
        })
    })
    .catch(function(err){
        layer.msg(err,{icon:2});
    });
}
newpublishRenderSelect();
