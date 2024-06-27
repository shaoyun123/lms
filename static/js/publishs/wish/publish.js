console.log("wishPublish");
/**layui.use开始 */
layui.use(['admin', 'form', 'layer', 'formSelects', 'table', 'element', 'laydate', 'laypage'], function() {
    var admin = layui.admin,
        form = layui.form,
        layer = layui.layer,
        formSelects = layui.formSelects,
        element = layui.element,
        laydate = layui.laydate,
        laypage = layui.laypage,
        $ = layui.$,
        table = layui.table;


    $("#wishPublish_searchForm select[name=tortBanListing]").val("CURRENT_PLAT");
    form.render('select')
    form.render('radio')
    form.render('checkbox')
    formSelects.render('selectMan_wish');
    formSelects.render('selectAttr_wish');
    formSelects.render('wishPublish_searchForm_prodIsSaleStatus')
    render_hp_orgs_users("#wishPublish_searchForm");

    laydate.render({
        elem: '#wishPublishTime', //渲染时间
        range: true
    });
    laydate.render({
        elem: '#wishPublish_endTime', //渲染时间
    });

    //  初始化
    (function init(){
        commonReturnPromise({
            url: '/lms/wishlisting/getOrderByEnum'
        }).then(res=>{
            commonRenderSelect("wishPublish_orderBy", res)
            .then(()=>form.render('select'))
        })
    }());


    //选择分类弹框
    $('#wishPublish_item').click(function() {
        admin.itemCat_select('layer-publishs-wish-publish', 'LAY-publishs-wish-publish-hidden', 'LAY-publishs-wish-publish-div')
    });


    //绑定店铺更改事件
    form.on('select(wishPublish_storeAcctId)', function(data) {
        wishPublish_searchProd();
    });

    //绑定更改事件
    form.on('select(wishPublish_showHideVagueFlag)', function(data) {
        console.log(data.value);
        if ("pSkus" == data.value ||
            "sSkus" == data.value) {
            $("#wish_publish #wish_skuVagueFlag_div").removeClass("disN");
        } else {
            $("#wish_publish #wish_skuVagueFlag_div").addClass("disN");
        }
    });


    //清空按钮的点击事件
    $('#wishPublish_reset').click(function() {
        $('#LAY-publishs-wish-publish-hidden').val('');
        $('#LAY-publishs-wish-publish-div').html('');
        formSelects.value('selectAttr_wish', []);
        formSelects.value('selectMan_wish', []);
        $('#wishPublish_group_sel').next().find('dd[lay-value=""]').trigger('click');
        setTimeout(() => {
            formSelects.value('wishPublish_searchForm_prodIsSaleStatus', ['2', '1'])
        }, 100);
    });

    var first = true;
    //监听tab切换来选中不同的tab页
    element.on('tab(wishPublish_tab)', function(data) {
        $('#wishPublish_div_selPubStyle').addClass('disN');

        var btn1 = $('#wishPublish_btn_genListing'), //生成店铺商品
            // btn2 = $('#wishPublish_btn_genListing'),//一件重发
            btn3 = $('#wishPublish_btn_delListing'), //删除店铺商品
            // btn4 = $('#wishPublish_btn_pubNow'), //立即刊登
            btn5 = $('#wishPublish_btn_exportSku'), //导出SKU映射
            // btn6 = $('#wishPublish_btn_pubOnTime'), //定时刊登
            btn7 = $('#wishPublish_btn_setShipping') //设置运费
        btn8 = $('#wishPublish_btn_cancleOnTime') //取消定时刊登
        btn9 = $('#wishPublish_btn_rePubNow') //批量重新刊登
        btn10 = $('#wishPublish_btn_copyListing') //复制listing
        btn1.addClass('disN');
        btn3.addClass('disN');
        btn7.addClass('disN');
        btn8.addClass('disN');
        btn9.addClass('disN');
        btn10.addClass('disN');
        btn12 = $('#wishPublish_btn_stockType') //预计可用库存查询
        btn11 = $('#wishPublish_btn_needFilterStock') //过滤零库存查询条件
        btn12.addClass('disN');
        btn11.addClass('disN');
        $("#wishPublish_searchForm input[name=shippingStatus]").val('')
            //相当于触发一次搜索
        if (data.index == 0) {
            btn1.removeClass('disN')
            btn12.removeClass('disN');
            btn11.removeClass('disN');
            $("#wishPublish_searchForm input[name=listingStatus]").val('-2')
        } else if (data.index == 1) { //待刊登
            btn10.removeClass('disN');
            btn12.removeClass('disN');
            btn11.removeClass('disN');
            $('#wishPublish_div_selPubStyle').removeClass('disN');
            btn3.removeClass('disN')
            $("#wishPublish_searchForm input[name=listingStatus]").val('0')
        } else if (data.index == 2) { //刊登中
            btn10.removeClass('disN');
            btn8.removeClass('disN');
            $("#wishPublish_searchForm input[name=listingStatus]").val('3')
        } else if (data.index == 3) { //成功
            btn10.removeClass('disN');
            $("#wishPublish_searchForm input[name=listingStatus]").val('1')
        } else if (data.index == 4) { //失败
            btn3.removeClass('disN');
            btn9.removeClass('disN');
            $("#wishPublish_searchForm input[name=listingStatus]").val('2')
        } else if (data.index == 5) { //运费设置失败
            btn7.removeClass('disN')
            $("#wishPublish_searchForm input[name=shippingStatus]").val('2') //未设置运费状态
        }
        //每次触发,执行依次查询
        wishPublish_searchProd();
    })

    form.on('select(wishPublish_selPubStyle_filter)', function(data) {
        var selPubStyle = data.value;
        if (1 == selPubStyle) {
            $("#wishPublish_btn_pubNow").trigger("click");
        }
        if (2 == selPubStyle) {
            $("#wishPublish_btn_pubOnTime").trigger("click");
        }
        $('#wishPublish_selPubStyle').val('');
        form.render('select')
    })

    //没办法,只能写在这里
    form.on('checkbox(wishPublish_cleanImgCheck_filter)', function(data) {
        let checked = data.elem.checked
        var allItem = $("#wishPublish_editDetailForm input[name=cleanImgCheck]").prop("checked", false);
        if (checked) {
            $(data.elem).prop("checked", true);
        }
        form.render('checkbox','wishPublish_imgContent');
    })

})

/*layui.use结束*/
function wishPublish__layer_wish(id) {
    var listingStatus = $("#wishPublish_searchForm input[name=listingStatus]").val();
    wishPublish_getlistingDetail(id)
}

function genWishListingDetailTpl(laytpl, $, returnData, layero) {
    laytpl($("#wishPulish_listDetailTpl").html()).render(returnData.data, function(html) {
        $(layero).find('.layui-layer-content').html(html);
        commonAddEventTitleToggle($('#wishPublish_editDetailForm'))
        $("#wishPublish_editDetailForm .ImgDivOut").each(function() {
            if (!$.isEmptyObject(returnData.data.prodListingWish.cleanImgUri) && returnData.data.prodListingWish.cleanImgUri == $(this).find('input[name=mainImg]').val()) {
                $(this).find("input[name=cleanImgCheck]").attr('checked', true);
                return false; //类似break
            }
            if (!$.isEmptyObject(returnData.data.prodListingWish.cleanImgUri) && returnData.data.prodListingWish.cleanImgUri == $(this).find('input[name=extImg]').val()) {
                $(this).find("input[name=cleanImgCheck]").attr('checked', true);
                return false; //类似break
            }
        })


        $('#wishpublish_MSRP_btn').click(function() {
            var wishpublish_MRSP = $('#wishpublish_MSRP_input').val();
            $('input[name="wishpublish_td_msrp"]').val(wishpublish_MRSP);
        })

        $('#wishpublish_price_btn').click(function() {
            var wishpublish_price = $('#wishpublish_price_input').val()
            if (wishpublish_price !== "") {
                $('input[name="wishpublish_td_price"]').val(wishpublish_price)
            } else {
                layer.msg("刊登价格不能为空")
            }
        })

        $('#wishpublish_number_btn').click(function() {
            var wishpublish_number = $('#wishpublish_number_input').val()
            if (wishpublish_number !== "") {
                $('input[name="wishpublish_td_number"]').val(wishpublish_number)
            } else {
                layer.msg("刊登数量不能为空")
            }
        })

        layui.form.render("checkbox");
        $('#wishPublish_extImg').sortable({
            containment: "parent"
        });
        $('#prodWishTagsNum').text($('input[name="tag"]').val().split(',').length);
        $('input[data-role="tagsinput"]').tagsinput();
    });
    var listingStatus = $("#wishPublish_searchForm input[name=listingStatus]").val();
    if (0 == listingStatus || 2 == listingStatus) {
        $('.addWishSubListing').removeClass("disN");
    } else {
        $('.addWishSubListing').addClass("disN");
    }
    //设置数量
    var skuImgNum = 0;
    $("#wishPublish_editDetailForm .img_ssku_uri").each(function() {
        if ($(this).text()) {
            skuImgNum++;
        }
    });
    $("#wishPublish_editDetailForm #sSkuImgNum").text(skuImgNum);

    //本地图片绑定
    $("#wishPublish_SubSkuInfo .wishPublish_subImgUri_edit_local").each(function() { //初始化本地按钮
        wishPublish_subImgUri_exchangeLocal($(this));
    });
    wishPublish_mainImg_exchangeLocal($("#wishPublish_editDetailForm .wishPublish_mainImg_edit_local")); //初始化按钮

}

//已生成的详情框
function wishPublish_getlistingDetail(id) {
    var layer = layui.layer,
        laytpl = layui.laytpl,
        $ = layui.$,
        form = layui.form
    layer.open({
        type: 1,
        title: '产品详情',
        btn: ['保存并发布', '保存', '取消'],
        area: ['100%', '100%'],
        content: "加载中...",
        end: function(index, layero) {},
        yes: function(index, layero) {
            wishPublish_editListingProd(id, true, layero)
            return false;
        },
        btn2: function(index, layero) {
            wishPublish_editListingProd(id, false, layero)
            return false;
        },
        success: function(layero, index) {
            //只有带刊登的详情可以修改
            var listingStatus = $("#wishPublish_searchForm input[name=listingStatus]").val();
            if ('0' == listingStatus || '2' == listingStatus) {
                $(layero).find(".layui-layer-btn0").show();
            } else {
                $(layero).find(".layui-layer-btn0").hide();
                $(layero).find(".layui-layer-btn1").hide();
            }
            layui.admin.load.show();
            $.ajax({
                url: ctx + '/wishlisting/getListingInfo.html',
                type: 'post',
                dataType: 'json',
                data: { id: id, listingStatus: listingStatus },
                success: function(returnData) {
                    layui.admin.load.hide();
                    if (returnData.code != "0000") {
                        layer.alert(returnData.msg, { icon: 2 });
                        return;
                    }
                    genWishListingDetailTpl(laytpl, $, returnData, layero);
                }
            });
        }
    });
}



//抽象出一个公共的checkbox全选和反全选的组件
function wishPublishcheckbox_no_all(tableId) {
    /*获取表头checkbox和美化后的元素*/
    var $ = layui.$;
    //默认查待生成
    var listingStatus = $("#wishPublish_searchForm input[name=listingStatus]").val();

    var shippingStatus = $("#wishPublish_searchForm input[name=shippingStatus]").val();

    var isSale = $("#wishPublish_searchForm select[name=isSale]").val();

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
    pId_layui_All.click(function() {
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
    sId_layui_td.click(function() {
        var pid_cbox = $(this).parents('tr').find('input.pid-cbox'); //父sku
        if ($(this).prev().prop('checked')) {
            var pid_layui = pid_cbox.next();
            pid_cbox.prop('checked', true)
            pid_layui.addClass('layui-form-checked')
        } else {
            var checkLen = $(this).parents('.skus-tr').find('input.sid-cbox:checked').length;
            if (checkLen < 1) {
                var pid_layui_1 = pid_cbox.next();
                pid_cbox.prop('checked', false)
                pid_layui_1.removeClass('layui-form-checked')
            }
        }

    });

    pId_layui_td.click(function() {
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

    var unlist_td = $('#' + tableId).find('.wishPublish-unlist').parent().prev();
    var listsucc_td = $('#' + tableId).find('.wishPublish-listsucc').parent().prev();
    var listfail_td = $('#' + tableId).find('.wishPublish-listfail').parent().prev();
    var inlist_td = $('#' + tableId).find('.wishPublish-inlist').parent().prev();

    // //在售,和停售
    // var isSale_td = $('#' + tableId).find('.wishPublish-isSale').parent().parent().children('td:first-child');
    // var isNotSale_td = $('#' + tableId).find('.wishPublish-isNotSale').parent().parent().children('td:first-child');

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
    }
}

function wishPublish_getSearchData() {
    var data = new Object();
    //默认查待生成
    data.listingStatus = $("#wishPublish_searchForm input[name=listingStatus]").val();

    data.shippingStatus = $("#wishPublish_searchForm input[name=shippingStatus]").val();


    data.storeAcctId = $("#wishPublish_searchForm select[name=storeAcctId]").val();
    data.cateId = $("#wishPublish_searchForm input[name=cateId]").val();
    data.tag = $("#wishPublish_searchForm select[name=tag]").val();
    data.devType = $("#wishPublish_searchForm select[name=devType]").val();

    //物流属性
    data.existLogisAttrs = [];
    data.notExistLogisAttrs = [];
    var logisAttrContents = layui.formSelects.value("selectAttr_wish");

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
    var bizzOwnerContents = layui.formSelects.value("selectMan_wish");
    for (var j = 0; j < bizzOwnerContents.length; j++) {
        data.bizzOwnerIds.push(bizzOwnerContents[j].val);
    }
    //侵权状态
    data.tortBanListing = $("#wishPublish_searchForm select[name=tortBanListing]").val();

    //日期
    var timeStr = $("#wishPublish_searchForm input[name=time]").val();
    if (timeStr) {
        data.startTime = Date.parse(timeStr.split(" - ")[0] + " 00:00:00");
        data.endTime = Date.parse(timeStr.split(" - ")[1] + " 23:59:59");
    }
    data.timeType = $("#wishPublish_searchForm select[name=timeType]").val();
    data.prodIsSaleStatus = layui.formSelects.value('wishPublish_searchForm_prodIsSaleStatus','val') // 在售状态
    data.isPublish = $("#wishPublish_searchForm select[name=isPublish]").val();
    data.isCanSale = $("#wishPublish_searchForm select[name=isCanSale]").val();
    data.cnTitle = "";
    data.enTitle = "";
    data.pSkus = [];
    data.sSkus = [];
    data.skuVagueFlag = $("#wishPublish_searchForm select[name=skuVagueFlag]").val()
    if ("cnTitle" == $("#wishPublish_searchForm select[name=searchType]").val()) {
        data.cnTitle = ($("#wishPublish_searchForm input[name=searchText]").val());
    }
    if ("enTitle" == $("#wishPublish_searchForm select[name=searchType]").val()) {
        data.enTitle = ($("#wishPublish_searchForm input[name=searchText]").val());
    }
    if ("pSkus" == $("#wishPublish_searchForm select[name=searchType]").val()) {
        var pSkustmp = $("#wishPublish_searchForm input[name=searchText]").val()
        if (pSkustmp.length > 0) {
            pSkustmp = pSkustmp.split(",");
            if (pSkustmp.length > 0) {
                for (i = 0; i < pSkustmp.length; i++) {
                    data.pSkus.push(pSkustmp[i]);
                }
            }
        }
    }
    if ("sSkus" == $("#wishPublish_searchForm select[name=searchType]").val()) {
        var sSkustmp = $("#wishPublish_searchForm input[name=searchText]").val();
        if (sSkustmp.length > 0) {
            sSkustmp = sSkustmp.split(",");
        }
        if (sSkustmp.length > 0) {
            for (i = 0; i < sSkustmp.length; i++) {
                data.sSkus.push(sSkustmp[i]);
            }
        }
    }
    // 预计可用库存含在途/不含在途
    data.preStockType = $("#wishPublish_searchForm select[name=preStockType]").val()
    data.preStockMin = $("#wishPublish_searchForm input[name=preStockMin]").val() == ''?'':$("#wishPublish_searchForm input[name=preStockMin]").val() * 1
    data.preStockMax = $("#wishPublish_searchForm input[name=preStockMax]").val() == ''?'':$("#wishPublish_searchForm input[name=preStockMax]").val() * 1
    // 过滤零库存
    data.filterZeroStock = $("#wishPublish_searchForm input[name=filterZeroStock]").prop('checked')
    // 排序
    data.orderByEnum = $("#wishPublish_orderBy").val() || null
    return data;
}


//请求需要包含参数,首次获取默认,使用分页控件修改属性,并使用修改后的属性,在页面中搜索,重置为第一页
var limitAllAppoint = 100; //每页显示数据条数
var currentPageAllAppoint = 1; //当前页数
var dataLength = 0; //数据总条数

// 搜索商品按钮事件
/**
 * @param notChangePage 传入的值存在时,指定页的数字
 */
function wishPublish_searchProd(notChangePage) {
    var storeAcctId = $("#wishPublish_searchForm select[name=storeAcctId]").val();
    if (null == storeAcctId || '' == storeAcctId) {
        layer.msg("店铺不得为空");
        return;
    }
    if (notChangePage) {
        currentPageAllAppoint = notChangePage;
    } else {
        currentPageAllAppoint = 1; //当点击搜索的时候，应该回到第一页
    }
    dataLength = 0;
    wishPublish_search();
}

function table_height() {
    var bodyheight = $(window).height();
    // var cardheight1 =  $("#LAY_app_body").find('.layui-card').eq(0).outerHeight();
    var cardheight2 = $("#LAY_app_body").find('.layui-card').eq(1).children('.layui-card-header').outerHeight();
    return bodyheight - cardheight2 - 210;
}

function wishPublish_search() {
    var form = layui.form,
        laypage = layui.laypage;
    var data = wishPublish_getSearchData();
    var table = layui.table;

    data.page = currentPageAllAppoint;
    data.limit = limitAllAppoint;
    loading.show();
    $.ajax({
        url: ctx + '/wishlisting/queryList.html',
        type: "post",
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify(data),
        traditional: true, //确保数组传参正确
        success: function(returnData) {
            dataLength = returnData.count;
            html = template('wishPublish_tpl', returnData);
            $('#wishPublish_table').html(html);
            theadHandle().fixTh({ id: '#wishPublishCard', h: 150, dv1: '.layui-tab-title', dv3: '#wish_btn_show_hide', i: 40 });
            //给table添加滚动条
            // $('.wishPublish_table_head').css({'padding-right':'17px',});
            // $('.wishPublish_table_body').css({'height':table_height(),'overflow':'scroll','width':'100%'});
            $('.wishPublish_table_head table,.wishPublish_table_body table').css({ 'width': '100%', 'margin': 0, 'table-layout': 'fixed' });
            form.render('checkbox');
            imageLazyload(); //懒加载
            var listingStatus = $("#wishPublish_searchForm input[name=listingStatus]").val();
            var shippingStatus = $("#wishPublish_searchForm input[name=shippingStatus]").val();
            $("#wish_publish .listingSuccInfo").hide();
            $("#wish_publish .timeClass").hide();
            $('.wishPublish-listfail').on('mouseenter', function() {
                var contentshow = $(this).next(".wishPublish-listfailreason").text();
                layer.tips(contentshow, $(this), {
                    tips: [2, 'red'],
                    area: ['40%', 'auto'],
                    time: 0,
                });
            }).on('mouseleave', function() {
                layer.closeAll("tips");
            });
            $('.wishPublish-listfail').on('click', function() {
                var contentshow = $(this).next(".wishPublish-listfailreason").text();
                copyTxtToClipboard(contentshow)
            })
            //用来替代默认表格布局,col设置单框
            // 商品
            var colgroup1 = '<colgroup><col width="3%"/><col width="6%" /><col width="17%" /><col width="11%" /><col width="11%" /><col width="2%"/><col width="8%"/><col width="5%"/><col width="5%"/><col width="5%"/><col width="5%"/><col width="7%"/><col width="7%"/></colgroup>';
            var colgroup1_1 = '<colgroup><col width="4%"/><col width="20%"/><col width="20%"/><col width="16%"/><col width="16%"/><col width="16%"/></colgroup>';
            // 待刊登
            var colgroup2 = '<colgroup><col width="3%" /><col width="6%" /><col width="17%" /><col width="10%" /><col width="10%"/><col width="10%"/><col width="1%"/><col width="10%"/><col width="8%"/><col width="5%"/><col width="5%"/><col width="5%"/><col width="5%"/><col width="5%"/><col width="7%"/><col width="7%"/></colgroup>';
            var colgroup2_2 = '<colgroup><col width="4%" /><col width="17%" /><col width="23%" /><col width="10%"/><col width="10%"/><col width="10%"/><col width="11%"/></colgroup>';
            // 刊登失败
            var colgroup3 = '<colgroup><col width="3%" /><col width="6%" /><col width="18%" /><col width="13%" /><col width="2%"/><col width="8%"/><col width="8%"/><col width="5%"/><col width="5%"/><col width="5%"/><col width="5%"/><col width="7%"/><col width="7%"/></colgroup>';
            // 刊登中
            var colgroup5 = '<colgroup><col width="3%" /><col width="6%" /><col width="18%" /><col width="11%" /><col width="2%"/><col width="8%"/><col width="8%"/><col width="5%"/><col width="5%"/><col width="5%"/><col width="5%"/><col width="6%"/><col width="5%"/><col width="7%"/></colgroup>';
            // 刊登成功
            var colgroup6 = '<colgroup><col width="3%" /><col width="6%" /><col width="18%" /><col width="11%" /><col width="2%"/><col width="8%"/><col width="8%"/><col width="5%"/><col width="5%"/><col width="5%"/><col width="5%"/><col width="5%"/><col width="6%"/><col width="5%"/><col width="7%"/></colgroup>';
            // 运费设置失败
            var colgroup4 = '<colgroup><col width="3%" /><col width="5%" /><col width="9%" /><col width="8%" /><col width="6%" /><col width="6%"/><col width="6%"/><col width="6%"/><col width="2%"/><col width="5%"/><col width="9%"/><col width="4%"/><col width="4%"/><col width="4%"/><col width="4%"/><col width="6%"/><col width="7%"/></colgroup>';
            var colgroup4_2 = '<colgroup><col width="3%" /><col width="17%" /><col width="23%" /><col width="10%"/><col width="10%"/><col width="10%"/><col width="11%"/></colgroup>';

            $('#wish_publish #totalNum').text("商品");
            $("#wish_publish #toListingNum").text("待刊登");
            $("#wish_publish #wish_listingNum").text("刊登中"); //colgroup5
            $("#wish_publish #listingSucNum").text("刊登成功"); //colgroup5
            $("#wish_publish #listingFailNum").text("刊登失败"); //colgroup3
            $("#wish_publish #failSetShippingNum").text("运费设置失败"); //colgroup4


            $("#wish_publish .failInfo").hide();
            $("#wish_publish .shippingInfo").hide();
            $("#wish_publish .timeClass").hide();
            $("#wish_publish .listingTime").hide();
            $("#wish_publish .listTiming").hide();
            $("#wish_publish .auditTime").hide();
            $("#wish_publish .listingInfo").hide();
            $("#wish_publish .listingInfo").hide();
            $("#wish_publish .detailInfoBtn").hide();
            $("#wish_publish .publishBtn").hide();
            $("#wish_publish .storePSkuInfo").hide();
            $("#wish_publish .devNoteInfo").hide();
            $("#wish_publish .tortStatusInfo").hide();
            $("#wish_publish .storeSubSkuInfo").hide();

            //运费设置失败的按钮设置
            if (2 == shippingStatus) {
                let temStr = returnData.count >= 10000 ? '>10000' : returnData.count
                $("#wish_publish #failSetShippingNum").text("运费设置失败(" + temStr + ")");

                $("#wish_publish .colspan_td").attr("colSpan", 7);
                $("#wish_publish .tortStatusInfo").show();
                $("#wish_publish .shippingInfo").show();
                $("#wish_publish .devNoteInfo").show();
                $("#wish_publish .timeClass").hide();
                $("#wish_publish .storeSubSkuInfo").show();
                $("#wish_publish .wishquantityInfo").hide();
                $("#wish_publish .listingInfo").show();
                $("#wish_publish .storePSkuInfo").show();
                $('.wishPublish_table_body>table>colgroup,.wishPublish_table_head>table>colgroup').remove();
                $('.wishPublish_table_body>table,.wishPublish_table_head>table').append(colgroup4);
                $('.inner_table>colgroup').remove();
                $('.inner_table').prepend(colgroup4_2);
            }else{
                //仅刊登失败对应的展示,展示状态和失败原因
                if (-2 == listingStatus) { //商品
                    let temStr = returnData.count >= 10000 ? '>10000' : returnData.count
                    $('#wish_publish #totalNum').text("商品(" + temStr + ")");

                    $("#wish_publish .colspan_td").attr("colSpan", 6);
                    $("#wish_publish .timeClass").show();
                    $("#wish_publish .auditTime").show();
                    $("#wish_publish .devNoteInfo").show();
                    $('.wishPublish_table_body>table>colgroup,.wishPublish_table_head>table>colgroup').remove();
                    $('.wishPublish_table_body>table,.wishPublish_table_head>table').prepend(colgroup1);
                    $('.inner_table>colgroup').remove();
                    $('.inner_table').prepend(colgroup1_1);
                } else if (0 == listingStatus) {
                    let temStr = returnData.count >= 10000 ? '>10000' : returnData.count
                    $("#wish_publish #toListingNum").text("待刊登(" + temStr + ")");
                    $("#wish_publish .tortStatusInfo").show();
                    $("#wish_publish .devNoteInfo").show();
                    $("#wish_publish .colspan_td").attr("colSpan", 8);
                    $("#wish_publish .storeSubSkuInfo").show();
                    $("#wish_publish .wishquantityInfo").show();
                    $("#wish_publish .listingInfo").show();
                    $("#wish_publish .detailInfoBtn").show();
                    $("#wish_publish .storePSkuInfo").show();
                    $("#ebayPublish_table .ebayPublish-listingfail").show();
                    $('.wishPublish_table_body>table>colgroup,.wishPublish_table_head>table>colgroup').remove();
                    $('.wishPublish_table_body>table,.wishPublish_table_head>table').prepend(colgroup2);
                    $('.inner_table>colgroup').remove();
                    $('.inner_table').prepend(colgroup2_2);
                } else if (1 == listingStatus) {
                    let temStr = returnData.count >= 10000 ? '>10000' : returnData.count
                    $("#wish_publish #listingSucNum").text("刊登成功(" + temStr + ")");

                    $("#wish_publish .colspan_td").attr("colSpan", 8);
                    $("#wish_publish .timeClass").show();
                    $("#wish_publish .listingTime").show();
                    $("#wish_publish .storeSubSkuInfo").show();
                    $("#wish_publish .wishquantityInfo").show();
                    $("#wish_publish .listingInfo").show();
                    $("#wish_publish .listingSuccInfo").show();
                    $("#wish_publish .detailInfoBtn").show();
                    $("#wish_publish .storePSkuInfo").show();
                    $('.wishPublish_table_body>table>colgroup,.wishPublish_table_head>table>colgroup').remove();
                    $('.wishPublish_table_body>table,.wishPublish_table_head>table').append(colgroup6);
                    $('.inner_table>colgroup').remove();
                    $('.inner_table').prepend(colgroup2_2);
                } else if (2 == listingStatus) {
                    let temStr = returnData.count >= 10000 ? '>10000' : returnData.count
                    $("#wish_publish #listingFailNum").text("刊登失败(" + temStr + ")");

                    $("#wish_publish .colspan_td").attr("colSpan", 7);
                    $("#wish_publish .failInfo").show();
                    $("#wish_publish .storeSubSkuInfo").show();
                    $("#wish_publish .wishquantityInfo").hide();
                    $("#wish_publish .listingInfo").show();
                    $("#wish_publish .detailInfoBtn").show();
                    $("#wish_publish .publishBtn").show();
                    $("#wish_publish .storePSkuInfo").show();
                    $('.wishPublish_table_body>table>colgroup,.wishPublish_table_head>table>colgroup').remove();
                    $('.wishPublish_table_body>table,.wishPublish_table_head>table').append(colgroup3);
                    $('.inner_table>colgroup').remove();
                    $('.inner_table').prepend(colgroup2_2);
                } else if (3 == listingStatus) {
                    let temStr = returnData.count >= 10000 ? '>10000' : returnData.count
                    $("#wish_publish #wish_listingNum").text("刊登中(" + temStr + ")");

                    $("#wish_publish .colspan_td").attr("colSpan", 7);
                    $("#wish_publish .timeClass").show();
                    $("#wish_publish .listTiming").show();
                    $("#wish_publish .storeSubSkuInfo").show();
                    $("#wish_publish .wishquantityInfo").hide();
                    $("#wish_publish .listingInfo").show();
                    $("#wish_publish .detailInfoBtn").show();
                    $("#wish_publish .storePSkuInfo").show();
                    $('.wishPublish_table_body>table>colgroup,.wishPublish_table_head>table>colgroup').remove();
                    $('.wishPublish_table_body>table,.wishPublish_table_head>table').append(colgroup5);
                    $('.inner_table>colgroup').remove();
                    $('.inner_table').prepend(colgroup2_2);
                }
            }

            //全选和反全选事件
            wishPublishcheckbox_no_all('wishPublish_table')
            loading.hide();
            wishPublish_toPage();
        }
    });
    // $.ajax({
    //     beforeSend: function(){
    //         // loading.show();
    //     },
    //     url: ctx + '/wishlisting/countNums.html',
    //     type:"post",
    //     dataType: "json",
    //     data: JSON.stringify(data),
    //     contentType:"application/json;charset=utf-8",
    //     traditional: true,
    //     success: function (returnData) {
    //         $('#wish_publish #totalNum').text("商品("+returnData.data.totalNum+")");
    //         $("#wish_publish #toListingNum").text("待刊登("+returnData.data.toListingNum+")");
    //         $("#wish_publish #wish_listingNum").text("刊登中("+returnData.data.wish_listingNum+")");
    //         $("#wish_publish #listingSucNum").text("刊登成功("+returnData.data.listingSucNum+")");
    //         $("#wish_publish #listingFailNum").text("刊登失败("+returnData.data.listingFailNum+")");
    //         $("#wish_publish #failSetShippingNum").text("运费设置失败("+returnData.data.failSetShippingNum+")");
    //     },
    //     complete: function () {
    //         // loading.hide();
    //     },
    // });
}

function wishPublish_toPage() {
    laypage = layui.laypage;
    //处理分页
    laypage.render({
        elem: 'wishPublish_pagination',
        count: dataLength, //数据总数，从服务端得到
        layout: ['prev', 'page', 'next'],
        prev: '<上一页',
        next: '下一页>',
        limits: [30, 50, 100, 300],
        curr: currentPageAllAppoint,
        limit: limitAllAppoint,
        jump: function(obj, first) {
            currentPageAllAppoint = obj.curr;
            limitAllAppoint = obj.limit;
            //首次不执行
            if (!first) {
                wishPublish_search()
            }
        }
    });
}

function wishPublish_genToListingProd() {
    var data = $("#wishPublish_table tbody input.sid-cbox:checked");
    var storeAcctId = $("#wishPublish_searchForm select[name=storeAcctId]").val();
    // var isSale = $("#wishPublish_searchForm select[name=isSale]").val();
    var isPromotion = $("#wishPublish_searchForm select[name=isPromotion]").val();
    var paramData = [];
    if (data.length > 0) {
        for (var i = 0; i < data.length; i++) {
            paramData.push(data[i].value);
        }
        $.ajax({
            beforeSend: function() {
                loading.show();
            },
            url: ctx + '/wishlisting/addStoreProds.html',
            type: "post",
            dataType: "json",
            data: { 
                "prodTmpIdAttr": paramData,
                "storeAcctId": storeAcctId,
                // "isSale": isSale,
                "isPromotion": isPromotion 
                },
            traditional: true,
            success: function(returnData) {
                loading.hide();
                if (returnData.code != "0000") {
                    layer.alert(returnData.msg, { icon: 2 });
                } else {
                    if (returnData.data.length > 0) {
                        // layer.alert(returnData.data.join("<br>"),{icon:7});
                        layer.open({
                            type: 1,
                            title: '信息',
                            closeBtn: 0, //不显示关闭按钮
                            btn: ['确认'],
                            area: ['500px', '600px'],
                            anim: 2,
                            shadeClose: true, //开启遮罩关闭
                            content: '<div style="padding:20px">' + returnData.data.join("<br>") + '</div>',
                            yes: function(index) {
                                // wishPublish_searchProd(currentPageAllAppoint);
                                layer.close(index);
                            }
                        });
                    } else {
                        layer.msg('生成待刊登信息成功');
                        // wishPublish_searchProd(currentPageAllAppoint);
                    }

                    returnData.extra.successModelPIdList.forEach(item => {
                        $(".tr" + item).remove()
                    })
                    // returnData.extra.failModelPIdList.forEach(item => {
                    //     $(".tr" + item).find(".pid-cbox").click()
                    // })
                    $("#wishPublish_table .layui-form-checked").removeClass("layui-form-checked")
                    $("#wishPublish_table input.sid-cbox:checked").prop("checked",false)
                    $("#wishPublish_table input.pid-cbox:checked").prop("checked",false)
                    if(!$("#wish_publish #totalNum").text().includes(">")){
                        let len = returnData.extra.successModelPIdList.length;
                        let leftText = $("#wish_publish #totalNum").text().split("(")[1];
                        let text = leftText.split(")")[0];
                        $("#wish_publish #totalNum").text(`商品(${text - len})`)
                    }
                }
            }
        });
    } else {
        layer.msg("请至少选择1条数据");
    }
}


function wishPublish_deletelisting(id) {
    var paramData = [];
    if (id) {
        paramData.push(id);
    } else {
        var data = $("#wishPublish_table tbody input.sid-cbox:checked");
        if (data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                paramData.push(data[i].value);
            }
        }
    }
    var listingStatus = $("#wishPublish_searchForm input[name=listingStatus]").val();
    if (paramData.length > 0) {
        loading.show();
        $.ajax({
            url: ctx + '/wishlisting/deletelisting.html',
            type: "post",
            dataType: "json",
            data: { "idArr": paramData, "listingStatus": listingStatus },
            traditional: true,
            success: function(returnData) {
                loading.hide();
                if (returnData.code != "0000") {
                    layer.alert(returnData.msg, { icon: 2 });
                } else {
                    layer.msg('删除店铺刊登信息成功');
                    wishPublish_searchProd(currentPageAllAppoint);
                }
            },
        });
    } else {
        layui.layer.msg("请至少选择1条数据");
    }
}


function wishListingPublish(listingId, singleReListingSub) {

    var listingStatus = $("#wishPublish_searchForm input[name=listingStatus]").val();
    var paramData = new Array();
    var data;
    if (listingId) { //
        paramData.push(listingId);
    } else {
        //非单个子商品重新刊登
        if (!singleReListingSub) {
            data = $("#wishPublish_table tbody input.pid-cbox:checked");
        } else {
            data = $("#wishPublish_table tbody input.sid-cbox:checked");
        }

        if (data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                paramData.push(data[i].value);
            }

        }
    }
    if (paramData.length > 0) {
        $.ajax({
            beforeSend: function() {
                loading.show();
            },
            url: ctx + '/wishlisting/publishListing.html',
            type: "post",
            dataType: "json",
            data: { "ids": paramData, "singleReListingSub": singleReListingSub, "listingStatus": listingStatus }, //是否子sku重发
            traditional: true,
            success: function(returnData) {
                if (returnData.code != "0000") {
                    layer.alert(returnData.msg, { icon: 2 });
                } else {
                    if ($.isEmptyObject(returnData.msg)) {
                        layer.msg('商品成功进入刊登流程');
                    } else {
                        layer.alert(returnData.msg, { icon: 1 }); //即使成功也可能是部分成功
                    }
                    wishPublish_searchProd(currentPageAllAppoint);
                }
            },
            complete: function() {
                loading.hide();
            },
        });
    } else {
        layui.layer.msg("请至少选择1条数据");
        return;
    }
}

function wishPublish_relisting() {
    $.ajax({
        beforeSend: function() {
            loading.show();
        },
        url: ctx + '/wishlisting/oneClikRelisting.html',
        type: "post",
        dataType: "json",
        traditional: true,
        success: function(returnData) {
            if (returnData.code != "0000") {
                layer.alert(returnData.msg, { icon: 2 });
            } else {
                layer.msg('重新刊登成功，商品进入刊登流程');
                wishPublish_searchProd(currentPageAllAppoint);
            }
        },
        complete: function() {
            loading.hide();
        },
    });
}

function wishPublish_exportskumapping() {
    var data = wishPublish_getSearchData();
    if (data.storeAcctId) {
        var Confirmindex = layer.confirm('确认导出当前搜索条件下的sku映射,导出时间较慢,请勿频繁尝试', { btn: ['确认', '取消'] }, function(result) {
            if (result) {
                layer.close(Confirmindex);
                submitForm(data, ctx + '/wishlisting/exportskumapping.html')
            }
        })
    } else {
        layer.msg("店铺不得为空");
    }
}

function delImg(obj) {
    layer.confirm('您确认要删除图片？', { icon: 3, title: '提示' }, function(index) {
        $(obj).closest('li').remove();
        var imgTotalNum = $("#wishPublish_extImg li").length;
        $("#wishPublish_editDetailForm #curImgNum").text(imgTotalNum);

        //设置数量
        var skuImgNum = 0;
        $("#wishPublish_editDetailForm .img_ssku_uri").each(function() {
            if ($(this).text()) {
                skuImgNum++;
            }
        });
        $("#wishPublish_editDetailForm #sSkuImgNum").text(skuImgNum);
        layer.close(index);
    });
}

function setMainImg(obj) {
    var extImgUrl = $(obj).closest('.ImgDivOut').find('input').val();
    var mainImgUrl = $("#wishPublish_mainImg .ImgDivIn").find('input').val();
    if (mainImgUrl) {
        $(obj).closest('.ImgDivOut').find('img').attr('src', mainImgUrl);
        $(obj).closest('.ImgDivOut').find('input').attr('value', mainImgUrl);
    } else {
        $(obj).closest('li').remove();
        var imgTotalNum = $("#wishPublish_extImg li").length;
        $("#wishPublish_editDetailForm #curImgNum").text(imgTotalNum);
        var skuImgNum = 0;
        $("#wishPublish_SubSkuInfo .img_ssku_uri").each(function() {
            if ($(this).val()) {
                skuImgNum++;
            }
        });
        $("#sSkuImgNum").text(skuImgNum);
    }
    if (extImgUrl) {
        $("#wishPublish_mainImg .ImgDivIn").find('img').attr('src', extImgUrl);
        $("#wishPublish_mainImg .ImgDivIn").find('input').attr('value', extImgUrl);
    }
}
//isPublish 是否立即发布
function wishPublish_editListingProd(id, isPublish, layero) {
    var layer = layui.layer,
        laytpl = layui.laytpl,
        $ = layui.$;
    var mainImgUrl = $("#wishPublish_mainImg .ImgDivIn").find('input[name=mainImg]').val();
    var cleanImgUri;
    if ($("#wishPublish_mainImg input[name=cleanImgCheck]").prop("checked")) {
        cleanImgUri = mainImgUrl;
    }

    var extImg = "";
    $("#wishPublish_extImg .ImgDivOut").each(function() {
        if ("" != extImg) {
            extImg += "|" + $(this).find('input[name=extImg]').val();
        } else {
            extImg = $(this).find('input[name=extImg]').val();
        }
        if ($(this).find("input[name=cleanImgCheck]").prop("checked")) {
            cleanImgUri = $(this).find('input[name=extImg]').val();
        }

    })
    var detailData = {};
    detailData.id = id;
    detailData.publishFlag = isPublish;
    detailData.mainImgUri = mainImgUrl;
    detailData.extImgUris = extImg;
    detailData.cleanImgUri = cleanImgUri;
    detailData.title = $("#wishPublish_editDetailForm input[name=title]").val();
    detailData.prodDesc = $("#wishPublish_editDetailForm textarea[name=prodDesc]").val();
    detailData.tag = $("#wishPublish_editDetailForm input[name=tag]").val();
    detailData.listingStatus = $("#wishPublish_searchForm input[name=listingStatus]").val();
    //添加子sku
    detailData.prodListingSubSkuWishs = getSkusInfo();
    if (detailData.prodListingSubSkuWishs.length < 1) {
        layer.msg('请至少保留一条子sku信息');
        return;
    }
    var minPrice = 0;
    for (var m = 0; m < detailData.prodListingSubSkuWishs.length; m++) {
        if (minPrice == 0 || minPrice > detailData.prodListingSubSkuWishs[m].price) {
            minPrice = detailData.prodListingSubSkuWishs[m].price;
        }
    }
    for (var n = 0; n < detailData.prodListingSubSkuWishs.length; n++) {
        if (detailData.prodListingSubSkuWishs[n].price > minPrice * 4) {
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
    $("#wishPublish_SubSkuInfo").find("tr").each(function() {
        //校验参数
        tdArr = $(this).children();
        varient = {};
        varient.size = tdArr.eq(3).find('input').val();
        if (varient.size) {
            hasSize = true;
        }

        if (hasSize) {
            if (varient.size) {} else {
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
                var colorArr = colorNew.split('&'); //对每个颜色都要验证
                var dataColor;
                for (var i = 0; i < colorArr.length; ++i) {
                    dataColor = colorArr[i];
                    if ($.inArray(dataColor, merchantColors.toLowerCase().split(',')) == -1) { //判断是不是在wish扩展色里面
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
            errMsg = "存在颜色和尺寸都相同的变种"; //校验(颜色_尺寸)相同
            return;
        } else {
            colorSizeJSON[colorSize] = 1;
        }
    });
    var subs = detailData.prodListingSubSkuWishs;
    if (subs && subs.length > 0) {
        for (var j = 0; j < subs.length; j++) {
            if (subs[j].id) {} else {
                if (subs[j].storeSSku) {} else { //新增sku不能为空
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
        beforeSend: function() {
            loading.show();
        },
        url: ctx + '/wishlisting/editListingDetail.html',
        type: "post",
        data: JSON.stringify(detailData),
        contentType: "application/json;charset=utf-8",
        success: function(returnData) {
            var resp = returnData
            if (resp.code == "0000") {
                layer.closeAll();
                if (isPublish) {
                    layer.msg('修改成功,并进入刊登流程');
                } else {
                    layer.msg('修改成功');
                }
                wishPublish_searchProd(currentPageAllAppoint);
            } else {
                layer.alert(resp.msg, { icon: 2 });
            }
        },
        complete: function(returnData) {
            loading.hide();
        }
    });
}
// 2-2.辅图网络图片
function wishPublish_addExtPic() {
    var index = layer.open({
        type: 1,
        title: '辅图网络图片',
        area: ['800px', '300px'],
        content: '<div class="p20"><textarea class="layui-textarea" id="netImgUrl4" placeholder="请填写URL,多个地址用回车换行"></textarea></div>',
        btn: ['确定', '关闭'],
        yes: function() {
            //网络主图处理
            // console.log($('#netImgUrl'));
            var url = $.trim($("#netImgUrl4").val());
            downImgFromUrl4(url); //这个函数在最下面,然后ajax那里的话,我不知道传什么数据data,返回的类型是啥,就没改,只改了一个URL
            $("#netImgUrl4").val("");
            layer.close(index);
        }
    })
}

//网络辅图处理
function downImgFromUrl4(url) {
    if (url == null || url == "") {
        layer.msg("图片地址不能为空！", { icon: 5 });
        return false;
    }
    var urlArray = url.split("\n");
    // 去一下空格
    for (var j in urlArray) {
        urlArray[j] = $.trim(urlArray[j]);
    }

    //设置数量
    var skuImgNum = 0;
    $("#wishPublish_editDetailForm .img_ssku_uri").each(function() {
        if ($(this).text()) {
            skuImgNum++;
        }
    });

    var imgTotalNum2 = $("#wishPublish_extImg li").length;
    //辅图和子图最多20张
    var remainNum2 = 20 - skuImgNum - imgTotalNum2;
    if ((urlArray.length + imgTotalNum2 + skuImgNum) > 20) {
        remainNum2 = remainNum2 < 0 ? 0 : remainNum2;
        // $.fn.message({type: "success", msg: "最大支持" + maxUploadNum2 + "张图片,您还能上传" + remainNum2 + "张!"});
        layer.msg("最大支持共" + 20 + "张辅图和子sku图片,您最多还能上传" + remainNum2 + "张!", { icon: 7 });
        return;
    }
    remainNum2 = urlArray.length > remainNum2 ? remainNum2 : urlArray.length;
    for (var i = 0; i < remainNum2; i++) {
        showImg4(urlArray[i]);
    }
    $("#wishPublish_editDetailForm #sSkuImgNum").text(skuImgNum);
}

function showImg4(url) {
    var tpl = '';
    tpl += wishPublish_imgData['img']['tpl'];
    //layer.msg(url);
    var div = tpl.replace(/&{url}/g, url);
    $('#wishPublish_extImg').append(div);
    var imgTotalNum = $("#wishPublish_extImg li").length;
    $("#wishPublish_editDetailForm #curImgNum").text(imgTotalNum);
    // $("#img-kong2").hide();
    layui.form.render('checkbox');
}


var wishPublish_imgData = {
    img: {
        head: '',
        tpl: '<li draggable="true" style="width: 150px;margin-bottom:40px;border:1px solid #ccc;overflow:hidden">' +
            '<div class="ImgDivOut">' +
            '<div class="ImgDivIn" style="width:150px;height:150px;">' +
            '<input type="hidden" name="extImg" value="&{url}">' +
            '<img  width="150" height="150" src="&{url}">' +
            '</div>' +
            '<div class="imgDivDown" style="width:150px">' +
            '<a onclick="setMainImg(this);" href="javascript:void(0);" style="float:left; color: #73a1bf;">设为主图</a><a onclick="delImg(this);" href="javascript:void(0);" style="float:right; color: #73a1bf;">移除</a>' +
            '</div>' +
            '<div class="imgDivCheck" style="width:150px">' +
            '<input type="checkbox" name="cleanImgCheck" lay-skin="primary" title="清晰"  lay-filter="wishPublish_cleanImgCheck_filter">' +
            '</div>' +
            '</div></div></li>'
    }
}

function getSkusInfo() {
    var subSkus = [];
    var tdArr;
    var varient;
    $("#wishPublish_SubSkuInfo").find("tr").each(function() {
        tdArr = $(this).children();
        varient = {};
        varient.id = tdArr.eq(0).text();
        varient.subImgUri = tdArr.eq(1).find('.img_ssku_uri').html();
        if (varient.id) {} else {
            varient.storeSSku = tdArr.eq(2).find('input').val();
        }
        varient.size = tdArr.eq(3).find('input').val();
        varient.color = tdArr.eq(4).find('input').val();
        varient.msrp = tdArr.eq(5).find('input').val();
        varient.price = tdArr.eq(6).find('input').val();
        varient.stock = tdArr.eq(7).find('input').val();
        subSkus.push(varient);
    });
    return subSkus;
}

//定时刊登商品
function wishListingPublishOnTiming() {
    var layer = layui.layer,
        $ = layui.$;
    var ids = [];
    //生成多个
    $("#wishPublish_table tbody tr  input.pid-cbox:checked").each(function() {
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
        success: function(layero, index) {
            $(layero).find('.layui-layer-content').html($("#wishPulish_listTimingTpl").html());
            //时间选择器
            layui.laydate.render({
                elem: '#wishPulish_listTiming',
                type: 'datetime',
                format: 'yyyy-MM-dd HH:mm'
            });
        },
        yes: function(index, layero) {
            var listTiming = $(layero).find("input[name=listTiming]").val();
            var listInterval = $(layero).find("input[name=listInterval]").val();
            if (listTiming) {} else {
                layer.msg("定时刊登开始时间不能为空");
                return;
            }
            layui.admin.load.show();



            $.ajax({
                type: "post",
                url: ctx + "/wishlisting/listtiming.html",
                dataType: "json",
                data: {
                    ids: ids.join(","),
                    listTiming: new Date(listTiming).getTime(),
                    listInterval: listInterval
                },
                success: function(returnData) {
                    layui.admin.load.hide();
                    if (returnData.code != "0000") {
                        layer.msg(returnData.msg);
                    } else {
                        if ($.isEmptyObject(returnData.msg)) {
                            layer.msg("定时刊登成功");
                        } else {
                            layer.alert(returnData.msg, { icon: 1 }); //即使成功也可能是部分成功
                        }
                        layer.close(index);
                        wishPublish_searchProd(currentPageAllAppoint);
                    }
                }
            });
        }
    })
}

//取消定时刊登商品
function wishListing_canclePublishOnTiming() {
    var layer = layui.layer,
        $ = layui.$;
    var ids = [];
    //生成多个
    $("#wishPublish_table tbody tr  input.pid-cbox:checked").each(function() {
        ids.push($(this).val());
    });
    if (ids.length < 1) {
        layer.msg("未选中商品");
        return;
    }

    loading.show();
    $.ajax({
        type: "post",
        url: ctx + "/wishlisting/cancleListTiming.html",
        dataType: "json",
        data: {
            ids: ids.join(","),
        },
        success: function(returnData) {
            if (returnData.code != "0000") {
                loading.hide();
                layer.msg(returnData.msg);
            } else {
                layer.msg("取消定时刊登成功");
                wishPublish_searchProd(currentPageAllAppoint);
            }
        }
    });
}

function wishListing_setShipping() {
    var ids = [];
    //生成多个
    $("#wishPublish_table tbody tr  input.pid-cbox:checked").each(function() {
        ids.push($(this).val());
    });
    if (ids.length < 1) {
        layer.msg("未选中商品");
        return;
    }
    $.ajax({
        type: "post",
        url: ctx + "/wishlisting/setShipping.html",
        dataType: "json",
        data: {
            ids: ids
        },
        traditional: true,
        success: function(returnData) {
            layui.admin.load.hide();
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
template.defaults.imports.dateFormat = function(datetime, fmt) {
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
    var newStr = str.replace(/\s[a-z]/g, function($1) {
        return $1.toLocaleUpperCase()
    }).replace(/^[a-z]/, function($1) {
        return $1.toLocaleUpperCase()
    }).replace(/\sOr[^a-zA-Z]|\sAnd[^a-zA-Z]|\sOf[^a-zA-Z]|\sAbout[^a-zA-Z]|\sFor[^a-zA-Z]|\sWith[^a-zA-Z]|\sOn[^a-zA-Z]/g, function($1) {
        return $1.toLowerCase()
    });
    return newStr;
};

function wishpublish_upCaseTitle() {
    var oldStr = $("#wishPublish_editDetailForm input[name=title]").val();
    $("#wishPublish_editDetailForm input[name=title]").val(changeUpCase(oldStr));
}

//移除子listing,仅删除样式
function removeWishSubListing(obj) {
    var listingStatus = $("#wishPublish_searchForm input[name=listingStatus]").val();
    if (listingStatus == 0 || listingStatus == 2) {
        $(obj).closest('tr').remove();
        var skuImgNum = 0;
        $("#wishPublish_editDetailForm .img_ssku_uri").each(function() {
            if ($(this).text()) {
                skuImgNum++;
            }
        });
        $("#wishPublish_editDetailForm #sSkuImgNum").text(skuImgNum);
    }
}

function addWishSubListing() {
    var tr = '<tr>';
    tr += '<td hidden></td>\
        <td>\
            <img width="60" height="60" src=\'\' onerror="layui.admin.img_noFind()">\
            <a class="img_ssku_uri disN"></a>\
        <div class="wishPublish_subImgUri_addBtn wishPublish_subImgUri_edit_local"></div>\
        <div class="layui-btn layui-btn-primary layui-btn-xs wishPublish_subImgUri_edit_net" onclick="wishPublish_subImgUri_exchangeNet(this)">网络图片</div>\
        </td>\
        <td><input type="text" class="layui-input" value=""></td>\
        <td><input type="text" class="layui-input" value="" onkeyup="value=value.replace(/[^/&apos;/&quot;\\a-\\z\\A-\\Z0-9\\u4E00-\\u9FA5\\[\\]\\{\\}\\(\\)\\-\\&\\\'\\.\\ ]/g,\'\')"></td>\
        <td><input type="text" class="layui-input" value="" onkeyup="value=value.replace(/[^/&apos;/&quot;\\a-\\z\\A-\\Z0-9\\u4E00-\\u9FA5\\[\\]\\{\\}\\(\\)\\-\\&\\\'\\.\\ ]/g,\'\')"></td>\
        <td><input type="number" class="layui-input" value="" name="wishpublish_td_msrp"></td>\
        <td><input type="number" class="layui-input" value="" name="wishpublish_td_price"></td>\
        <td><input type="number" class="layui-input" value="" name="wishpublish_td_number"></td>\
        <td></td>\
        <td><button type="button" class="layui-btn layui-btn-sm" onclick="removeWishSubListing(this)">移除</button></td>';
    tr += '</tr>';
    $('#wishPublish_SubSkuInfo').append(tr);
    $("#wishPublish_SubSkuInfo .wishPublish_subImgUri_addBtn").each(function() { //初始化本地按钮
        wishPublish_subImgUri_exchangeLocal($(this));
        $(this).removeClass("wishPublish_subImgUri_addBtn"); //再删除
    });
}

//已生成的详情框
function wishPublish__copy_listing(id) {
    var layer = layui.layer,
        laytpl = layui.laytpl,
        $ = layui.$,
        form = layui.form;
    var ids = [];
    if (id) {
        ids.push(id);
    } else {
        $("#wishPublish_table tbody tr  input.pid-cbox:checked").each(function() {
            ids.push($(this).val());
        });
    }
    if (ids.length < 1) {
        layer.msg("必须先选中商品");
        return;
    }

    layer.open({
        type: 1,
        title: '复制模板',
        btn: ['保存', '取消'],
        area: ['100%', '100%'],
        content: "加载中...",
        end: function(index, layero) {},
        yes: function(index, layero) {

            var copyStore = layui.formSelects.value("copyStore_wishPublish");
            var copyStoreList = []
            for (var j = 0; j < copyStore.length; j++) {
                copyStoreList.push(copyStore[j].val);
            }

            if (copyStoreList.length < 1) {
                layer.msg("至少选一个店铺");
                return;
            }
            var detailData = {};
            detailData.copyListingIds = ids;
            detailData.copy2StoreIds = copyStoreList;
            $.ajax({
                type: 'post',
                url: ctx + '/wishlisting/copyListing.html',
                contentType: "application/json;charset=utf-8",
                dataType: "json",
                data: JSON.stringify(detailData),
                success: function(returnData) {
                    if (returnData.code != "0000") {
                        layer.alert(returnData.msg, { icon: 2 });
                        return;
                    } else {
                        layer.closeAll();
                        layer.msg("复制成功");
                        wishPublish_searchProd(currentPageAllAppoint);
                    }
                }
            })
        },
        success: function(layero, index) {
            var ids = [];
            if (id) {
                ids.push(id);
            } else {
                $("#wishPublish_table tbody tr  input.pid-cbox:checked").each(function() {
                    ids.push($(this).val());
                });
            }
            if (ids.length < 1) {
                layer.msg("必须先选中商品");
                return false;
            }


            $.ajax({
                type: 'post',
                url: ctx + '/sys/liststore.html',
                dataType: 'json',
                data: {
                    roleNames: "wish专员",
                    platCode: "wish"
                },
                traditional: true,
                success: function(returnData) {
                    if (returnData.code != "0000") {
                        layer.alert(returnData.msg, { icon: 2 });
                        return;
                    }
                    laytpl($("#wishPulish_copyListingTpl").html()).render(returnData.data, function(html) {
                        $(layero).find('.layui-layer-content').html(html);
                        layui.formSelects.render('copyStore_wishPublish');
                    });
                    $.ajax({
                        type: 'post',
                        url: ctx + '/wishlisting/listSelectAllSkuInfo.html',
                        dataType: 'json',
                        async: false,
                        traditional: true,
                        data: {
                            ids: ids
                        },
                        success: function(returnSkuData) {
                            if (returnSkuData.code != "0000") {
                                layer.alert(returnSkuData.msg, { icon: 2 });
                                return;
                            }

                            var skuInfoStr = "";
                            $(returnSkuData.data).each(function() {
                                console.log(this);
                                skuInfoStr += "店铺父SKU:" + this.storePSku + "(商品父SKU:" + this.pSku + ")<br>";
                            })
                            $("#wishPublish_skusInfo").append(skuInfoStr);
                        }
                    })
                }
            })
        }
    });
}

function wishListingPublish_updatePrice() {
    var subListingIds = [];
    $("#wishPublish_SubSkuInfo").find("tr").each(function() {
        var tdArr = $(this).children();
        subListingIds.push(tdArr.eq(0).text());
    });
    //按子listingid更新刊登价格
    $.ajax({
        beforeSend: function() {
            loading.show();
        },
        url: ctx + '/wishlisting/getUpdateListingPrice.html',
        type: "post",
        dataType: "json",
        traditional: true,
        data: { subListingIds: subListingIds },
        success: function(returnData) {
            if (returnData.code != "0000") {
                layer.alert(returnData.msg, { icon: 2 });
            } else {
                if (returnData.msg) {
                    layer.msg('更新价格成功:<br>' + returnData.msg);
                } else {
                    layer.msg('更新价格成功');
                }
                //更新为新价格
                $("#wishPublish_SubSkuInfo").find("tr").each(function() {
                    var tdArr = $(this).children();
                    var currentId = tdArr.eq(0).text();
                    var upList = returnData.data;
                    for (var i = 0; i < upList.length; i++) {
                        if (currentId == upList[i].id) {
                            tdArr.eq(5).find('input').val(upList[i].msrp);
                            tdArr.eq(6).find('input').val(upList[i].price);
                        }
                    }
                });
            }
        },
        complete: function() {
            loading.hide();
        },
    });
}
//子图本地上传
function wishPublish_subImgUri_exchangeLocal(obj) {
    //上传本地图片
    $(obj).Huploadify({
        auto: true,
        fileTypeExts: '*.jpg;*.png;*.jpeg;*.JPG;*.JPEG;*.PNG;*.bmp;*.BMP;*.gif;',
        multi: true,
        fileSizeLimit: 2048, //默认单位是KB
        buttonText: '本地图片',
        breakPoints: false,
        saveInfoLocal: false,
        showUploadedPercent: true,
        showUploadedSize: true,
        removeTimeout: 500,
        uploader: ctx + "/publish/uploadPic.html",
        onSelect: function(files) {
            return true;
        },
        onUploadStart: function(file) {},
        onUploadSuccess: function(file, data, response) {
            data = $.parseJSON(data);
            if (data != null && data.code == '0000') {
                console.log(11);
                var tdDiv = $(obj).parent('td');
                var oldUri = tdDiv.find(".img_ssku_uri").html(); //旧的保存,防止传不上去则回滚
                if (oldUri) { //本来就有
                } else { //没有则需要
                    var skuImgNum = 1;
                    //设置数量
                    $("#wishPublish_editDetailForm .img_ssku_uri").each(function() {
                        if ($(this).text()) {
                            skuImgNum++;
                        }
                    });
                    var imgTotalNum2 = $("#wishPublish_extImg li").length;
                    //辅图和子图最多20张
                    var remainNum2 = 20 - skuImgNum - imgTotalNum2;
                    if ((imgTotalNum2 + skuImgNum) > 20) {
                        remainNum2 = remainNum2 < 0 ? 0 : remainNum2;
                        layer.msg("最大支持共" + 20 + "张辅图和子sku图片,您最多还能上传" + remainNum2 + "张!", { icon: 7 });
                        return;
                    }
                    $("#wishPublish_editDetailForm #sSkuImgNum").text(skuImgNum);
                }
                tdDiv.find("img").attr("src", data.msg);
                tdDiv.find(".img_ssku_uri").html(data.msg);
            } else {
                layer.msg(data.msg);
            }
        }
    });

}

//子图网络上传
function wishPublish_subImgUri_exchangeNet(obj) {
    //prompt层
    layer.prompt({ title: '填写网络图片url' }, function(text, index) {
        if (text) {
            var tdDiv = $(obj).parent('td');
            var oldUri = tdDiv.find(".img_ssku_uri").html(); //旧的保存,防止传不上去则回滚
            if (oldUri) { //本来就有
            } else { //没有则需要重新计数
                var skuImgNum = 1;
                //设置数量
                $("#wishPublish_editDetailForm .img_ssku_uri").each(function() {
                    if ($(this).text()) {
                        skuImgNum++;
                    }
                });
                var imgTotalNum2 = $("#wishPublish_extImg li").length;
                //辅图和子图最多20张
                var remainNum2 = 20 - skuImgNum - imgTotalNum2;
                if ((imgTotalNum2 + skuImgNum) > 20) {
                    remainNum2 = remainNum2 < 0 ? 0 : remainNum2;
                    layer.msg("最大支持共" + 20 + "张辅图和子sku图片,您最多还能上传" + remainNum2 + "张!", { icon: 7 });
                    layer.close(index);
                    return;
                }
                $("#wishPublish_editDetailForm #sSkuImgNum").text(skuImgNum);
                layer.close(index);
            }
            tdDiv.find("img").attr("src", text);
            tdDiv.find(".img_ssku_uri").html(text);
        } else {
            layer.msg("图片url不能为空");
        }
    });
}

//主辅图本地上传
function wishPublish_mainImg_exchangeLocal(obj) {
    //上传本地图片
    $(obj).Huploadify({
        auto: true,
        fileTypeExts: '*.jpg;*.png;*.jpeg;*.JPG;*.JPEG;*.PNG;*.bmp;*.BMP;*.gif;',
        multi: true,
        fileSizeLimit: 2048, //默认单位是KB
        buttonText: '本地图片',
        breakPoints: false,
        saveInfoLocal: false,
        showUploadedPercent: true,
        showUploadedSize: true,
        removeTimeout: 500,
        uploader: ctx + "/publish/uploadPic.html",
        onSelect: function(files) {
            return true;
        },
        onUploadStart: function(file) {},
        onUploadSuccess: function(file, data, response) {
            data = $.parseJSON(data);
            if (data != null && data.code == '0000') {
                downImgFromUrl4(data.msg);
            } else {
                layer.msg(data.msg); //这里面的内容不知道写啥,同OA系统
            }
        }
    });

}

//子图网络删除
function wishPublish_subImgUri_del(obj) {
    var tdDiv = $(obj).parent('td');
    tdDiv.find("img").attr("src", '');
    tdDiv.find(".img_ssku_uri").html('');
    layer.msg('已删除');
}