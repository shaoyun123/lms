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
    $("#joomPublish_searchForm select[name=tortBanListing]").val("CURRENT_PLAT");

    form.render('select')
    form.render('radio')
    form.render('checkbox')
    form.render()
    formSelects.render('selectMan_joom');
    formSelects.render('selectAttr_joom');
    formSelects.render('joomPublish_prodIsSaleStatus')
    render_hp_orgs_users("#joomPublish_searchForm");
    laydate.render({
        elem: '.joomPublishTime', //渲染时间
        range: true
    });
    laydate.render({
        elem: '#joomPublish_endTime', //渲染时间
    })

    $('#joomPublish_sortType').hide()
    $('#joomPublish_sortTypeNew').show()

    commonReturnPromise({
        url: ctx + '/sys/listAllUser.html',
        type: 'post',
    }).then(res=>{
        res = res?res:[]
        res.unshift({id : '-1', loginName: 'system'})
        selectAppendDataThenRender('#joomPublish_searchForm select[name=creatorIdList]', res, 'id', 'loginName')
        form.render()
    }).catch(err=>{
        layer.alert(err, {icon:2})
    })

    commonReturnPromise({
        url: ctx + '/joomlisting/getQuerySortEnums',
        type: 'get',
    }).then(res=> {
        selectAppendDataThenRender('#joomPublish_searchForm select[name=sortTypeNew]', res['排序类型'] || [], 'value', 'type')
        selectAppendDataThenRender('#joomPublish_searchForm select[name=sortRule]', res['排序规则'] || [], 'value', 'desc')
        form.render()

        $('#joomPublish_searchForm select[name=sortTypeNew]').val('createTime')
        $('#joomPublish_searchForm select[name=sortRule]').val(0)

    }).catch(err=>{
        layer.alert(err, {icon:2})
    })

    //选择分类弹框
    $('#joomPublish_item').click(function () {
        admin.itemCat_select('layer-publishs-joom-publish', 'LAY-publishs-joom-publish-hidden', 'LAY-publishs-joom-publish-div')
    });

    //绑定店铺更改事件
    form.on('select(joomPublish_storeAcctId)', function (data) {
        joomPublish_searchProd();
    });

    //绑定更改事件
    form.on('select(joomPublish_showHideVagueFlag)', function(data){
        if("pSkus"==data.value
            ||"sSkus"==data.value ){
            $("#joom_publish .joom_skuVagueFlag_div").removeClass("disN");
        }else{
            $("#joom_publish .joom_skuVagueFlag_div").addClass("disN");
        }
    });

    //清空按钮的点击事件
    $('#joomPublish_reset').click(function () {
        $('#LAY-publishs-joom-publish-hidden').val('')
        $('#LAY-publishs-joom-publish-div').html('')
        formSelects.value('selectAttr', [])
        formSelects.value('selectMan', [])
        $('#joomPublish_group_sel').next().find('dd[lay-value=""]').trigger('click');
        setTimeout(() => {
            formSelects.value('joomPublish_prodIsSaleStatus', ['2', '1'])
        }, 100);
    });

    var first = true;
    //监听tab切换来选中不同的tab页
    element.on('tab(joomPublish_tab)', function (data) {
        $('#joomPublish_div_selPubStyle').addClass('disN');

        var btn1 = $('#joomPublish_btn_genListing'),//生成店铺商品
            // btn2 = $('#joomPublish_btn_genListing'),//一件重发
            btn3 = $('#joomPublish_btn_delListing'),//删除店铺商品
            // btn4 = $('#joomPublish_btn_pubNow'), //立即刊登
            btn5 = $('#joomPublish_btn_exportSku'), //导出SKU映射
            // btn6 = $('#joomPublish_btn_pubOnTime'), //定时刊登
            btn7 = $('#joomPublish_btn_setShipping') //设置运费
        btn8 = $('#joomPublish_btn_cancleOnTime') //取消定时刊登
        btn9 = $('#joomPublish_btn_rePubNow') //批量重新刊登
        btn1.addClass('disN');
        btn3.addClass('disN');
        btn7.addClass('disN');
        btn8.addClass('disN');
        btn9.addClass('disN');
        // btn12 = $('#joomPublish_btn_stockType') //预计可用库存查询
        // btn11 = $('#joomPublish_btn_needFilterStock') //过滤零库存查询条件
        btn13 = $('.joomPublish_btn_hasJoomDesc')
        btn14 = $('#joomPublish_btn_modifyDesc')
        btn15 = $('.joomPublish_searchDisN')
        btnOpt1 = '<option class="sortTypeHide" value="preAvailableStockSumAsc"> 预计可用库存不含在途正序</option>\n' +
            '                                        <option class="sortTypeHide" value="preAvailableStockSumDesc"> 预计可用库存不含在途倒序</option>\n' +
            '                                        <option class="sortTypeHide" value="preAvailableStockAllAsc"> 预计可用库存含在途正序</option>\n' +
            '                                        <option class="sortTypeHide" value="preAvailableStockAllDesc"> 预计可用库存含在途倒序</option>'
        // btn12.addClass('disN');
        // btn11.addClass('disN');
        btn13.addClass('disN');
        btn14.addClass('disN');
        btn15.addClass('disN');
        $('#joomPublish_sortType').hide()
        $('#joomPublish_sortTypeNew').show()
        $("#joomPublish_searchForm input[name=shippingStatus]").val('')
        //相当于触发一次搜索
        if (data.index == 0) {
            btn1.removeClass('disN')
            // btn11.removeClass('disN')
            // btn12.removeClass('disN')
            btn13.removeClass('disN')
            btn14.removeClass('disN')
            btn15.removeClass('disN')
            $("#joomPublish_searchForm .sortTypeHide").length > 0?'':$("#joomPublish_searchForm [name=sortType]").append(btnOpt1)
            $("#joomPublish_searchForm input[name=listingStatus]").val('-2')
        } else if (data.index == 1) {//待刊登
            $('#joomPublish_div_selPubStyle').removeClass('disN');
            btn3.removeClass('disN')
            // btn11.removeClass('disN')
            // btn12.removeClass('disN')
            $('#joomPublish_sortType').show()
            $('#joomPublish_sortTypeNew').hide()
            $("#joomPublish_searchForm .sortTypeHide").length > 0?'':$("#joomPublish_searchForm [name=sortType]").append(btnOpt1)
            $("#joomPublish_searchForm input[name=listingStatus]").val('0')
        } else if (data.index == 2) {
            btn8.removeClass('disN');
            $("#joomPublish_searchForm .sortTypeHide").remove()
            $('#joomPublish_sortType').show()
            $('#joomPublish_sortTypeNew').hide()
            $("#joomPublish_searchForm input[name=listingStatus]").val('3')
        } else if (data.index == 3) {
            $("#joomPublish_searchForm .sortTypeHide").remove()
            $('#joomPublish_sortType').show()
            $('#joomPublish_sortTypeNew').hide()
            $("#joomPublish_searchForm input[name=listingStatus]").val('1')
        } else if (data.index == 4) {
            btn3.removeClass('disN');
            btn9.removeClass('disN');
            $("#joomPublish_searchForm .sortTypeHide").remove()
            $('#joomPublish_sortType').show()
            $('#joomPublish_sortTypeNew').hide()
            $("#joomPublish_searchForm input[name=listingStatus]").val('2')
        }
        else if (data.index == 5) {
            btn7.removeClass('disN')
            $("#joomPublish_searchForm .sortTypeHide").remove()
            $('#joomPublish_sortType').show()
            $('#joomPublish_sortTypeNew').hide()
            $("#joomPublish_searchForm input[name=shippingStatus]").val('2') //未设置运费状态
        }
        form.render('select')
        //每次触发,执行依次查询
        joomPublish_searchProd();
    })

    form.on('select(joomPublish_selPubStyle_filter)', function (data) {
        var selPubStyle = data.value;
        if (1 == selPubStyle) {
            $("#joomPublish_btn_pubNow").trigger("click");
        }
        if (2 == selPubStyle) {
            $("#joomPublish_btn_pubOnTime").trigger("click");
        }
        $('#joomPublish_selPubStyle').val('');
        form.render('select')
    })
})

/*layui.use结束*/

function joom_publish_addImgByTpl(prodPId){
    const existImgs = $('#joomPublish_extImg').find("li").length
    const params = {
        param: {prodPIds: [prodPId]},
        limit: 20,
        existImgs,
        cb: function (tplUrlList, fullImgList) {
            if (Array.isArray(tplUrlList) && tplUrlList.length) {
                joomPublish_downImgFromUrl4(tplUrlList.join("\n"));//这个函数在最下面,然后ajax那里的话,我不知道传什么数据data,返回的类型是啥,就没改,只改了一个URL
            }
        },
    }
    comPickImageTpl(params,'joom')
}
function joomPublish__layer_joom(id) {
    var listingStatus = $("#joomPublish_searchForm input[name=listingStatus]").val();
    joomPublish_getlistingDetail(id)
}

function genJoomListingDetailTpl(laytpl, $, returnData, layero) {
    laytpl($("#joomPulish_listDetailTpl").html()).render(returnData, function (html) {
        $(layero).find('.layui-layer-content').html(html);
        commonAddEventTitleToggle($('#joomPublish_editDetailForm'), 'joom')
        $('#joomPublish_extImg').sortable();
        $('#prodJoomTagsNum').text($('input[name="tag"]').val().split(',').length);
        $('input[data-role="tagsinput"]').tagsinput();

        //产品joom敏感货属性
        layui.formSelects.on('wishPublish_select_joomSens', function (id, vals, val, isAdd, isDisabled) {//需要多传个参数true,这样才能保证获取的vals是当前选择之后的结果(按选择过程排序)
            var newJoomSensProd = "";
            var oldDangerousKindValue=$("#joomPublish_editDetailForm input[name=dangerousKindValue]").val();//变更前的值
            if(vals.length>0) {
                newJoomSensProd=vals[0].name;
                $("#joomPublish_editDetailForm input[name=dangerousKindName]").val(vals[0].name);
                $("#joomPublish_editDetailForm input[name=dangerousKindValue]").val(vals[0].value);
            }else{
                $("#joomPublish_editDetailForm input[name=dangerousKindName]").val("普货");
                $("#joomPublish_editDetailForm input[name=dangerousKindValue]").val("notDangerous");
            }
            var newDangerousKindValue=$("#joomPublish_editDetailForm input[name=dangerousKindValue]").val();//变更后的值
            if(newDangerousKindValue!=oldDangerousKindValue){
                //需要求新的并回显
                var listingId = $("#joomPublish_editDetailForm input[name=joomListingId]").val();
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
                            $("#joomPublish_SubSkuInfo").find("tr").each(function () {
                                tdArr = $(this).children();
                                if (returnData.data.length > 0) {
                                    for (var i = 0; i < returnData.data.length; i++) {
                                        if (returnData.data[i].id == tdArr.eq(0).text()) {
                                            tdArr.eq(7).find('input').val(returnData.data[i].price);
                                            tdArr.eq(8).find('input').val(returnData.data[i].shipping);
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
            layui.formSelects.value('wishPublish_select_joomSens', list);//赋值父产品的敏感属性列表
        }
        $("#joomPublish_editDetailForm input[name=dangerousKindValue]").val(returnData.prodListingJoom.dangerousKind);//listing敏感属性
        if(returnData.prodListingJoom.dangerousKind=='notDangerous'){
            $("#joomPublish_editDetailForm input[name=dangerousKindName]").val("普货");
        }else{
            for(var i=0;i<joomSensArray1.length;i++){
                if(joomSensArray1[i].value==returnData.prodListingJoom.dangerousKind){
                    $("#joomPublish_editDetailForm input[name=dangerousKindName]").val(joomSensArray1[i].name);
                    break;
                }
            }
        }
    });
    var listingStatus = $("#joomPublish_searchForm input[name=listingStatus]").val();
    if (0 == listingStatus || 2 == listingStatus) {
        $('.addJoomSubListing').removeClass("disN");
    } else {
        $('.addJoomSubListing').addClass("disN");
    }
    //设置数量
    var skuImgNum = 0;
    $("#joomPublish_editDetailForm .img_ssku_uri").each(function () {
        if ($(this).text()) {
            skuImgNum++;
        }
    });
    $("#joomPublish_editDetailForm #sSkuImgNum").text(skuImgNum);
}

//已生成的详情框
function joomPublish_getlistingDetail(id) {
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
        end: function (index, layero) {
        },
        yes: function (index, layero) {
            joomPublish_editListingProd(id, true, layero)
            return false;
        },
        btn2: function (index, layero) {
            joomPublish_editListingProd(id, false, layero)
            return false;
        },
        success: function (layero, index) {
            //只有带刊登的详情可以修改
            var listingStatus = $("#joomPublish_searchForm input[name=listingStatus]").val();
            if ('0' == listingStatus || '2' == listingStatus) {
                $(layero).find(".layui-layer-btn0").show();
            } else {
                $(layero).find(".layui-layer-btn0").hide();
                $(layero).find(".layui-layer-btn1").hide();
            }
            loading.show();
            $.ajax({
                url: ctx + '/joomlisting/getListingInfo.html',
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
function joomPublishcheckbox_no_all(tableId) {
    /*获取表头checkbox和美化后的元素*/
    var $ = layui.$;
    //默认查待生成
    var listingStatus = $("#joomPublish_searchForm input[name=listingStatus]").val();
    var shippingStatus = $("#joomPublish_searchForm input[name=shippingStatus]").val();
    // var isSale = $("#joomPublish_searchForm select[name=isSale]").val();

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
}

function joomPublish_getSearchData() {
    var data = new Object();
    //默认查待生成
    data.listingStatus = $("#joomPublish_searchForm input[name=listingStatus]").val();
    data.shippingStatus = $("#joomPublish_searchForm input[name=shippingStatus]").val();
    data.storeAcctId = $("#joomPublish_searchForm select[name=storeAcctId]").val();
    data.cateId = $("#joomPublish_searchForm input[name=cateId]").val();
    data.tag = $("#joomPublish_searchForm select[name=tag]").val();
    data.devType = $("#joomPublish_searchForm select[name=devType]").val();
    data.creatorIdList = []
    let creator = $("#joomPublish_searchForm select[name=creatorIdList]").val()
    if (creator && creator.length) {
        data.creatorIdList.push(creator)
    }

    //物流属性
    data.existLogisAttrs = [];
    data.notExistLogisAttrs = [];
    var logisAttrContents = layui.formSelects.value("selectAttr_joom");
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
    var bizzOwnerContents = layui.formSelects.value("selectMan_joom");
    for (var j = 0; j < bizzOwnerContents.length; j++) {
        data.bizzOwnerIds.push(bizzOwnerContents[j].val);
    }
    //侵权状态
    data.tortBanListing = $("#joomPublish_searchForm select[name=tortBanListing]").val();

    //日期
    var timeStr = $("#joomPublish_searchForm input[name=time]").val();
    if (timeStr) {
        data.startTime = Date.parse(timeStr.split(" - ")[0] + " 00:00:00");
        data.endTime = Date.parse(timeStr.split(" - ")[1] + " 23:59:59");
    }
    data.timeType = $("#joomPublish_searchForm select[name=timeType]").val();
    data.prodIsSaleStatus = layui.formSelects.value('joomPublish_prodIsSaleStatus', 'val') // 在售状态
    data.cnTitle = "";
    data.enTitle = "";
    data.pSkus = [];
    data.sSkus = [];
    data.skuVagueFlag=$("#joomPublish_searchForm select[name=skuVagueFlag]").val()
    if ("cnTitle" == $("#joomPublish_searchForm select[name=searchType]").val()) {
        data.cnTitle = ($("#joomPublish_searchForm input[name=searchText]").val());
    }
    if ("enTitle" == $("#joomPublish_searchForm select[name=searchType]").val()) {
        data.enTitle = ($("#joomPublish_searchForm input[name=searchText]").val());
    }
    if ("pSkus" == $("#joomPublish_searchForm select[name=searchType]").val()) {
        var pSkustmp = $("#joomPublish_searchForm input[name=searchText]").val()
        if (pSkustmp.length > 0) {
            pSkustmp = pSkustmp.split(",");
            if (pSkustmp.length > 0) {
                for (i = 0; i < pSkustmp.length; i++) {
                    data.pSkus.push(pSkustmp[i]);
                }
            }
        }
    }
    if ("sSkus" == $("#joomPublish_searchForm select[name=searchType]").val()) {
        var sSkustmp = $("#joomPublish_searchForm input[name=searchText]").val();
        if (sSkustmp.length > 0) {
            sSkustmp = sSkustmp.split(",");
        }
        if (sSkustmp.length > 0) {
            for (i = 0; i < sSkustmp.length; i++) {
                data.sSkus.push(sSkustmp[i]);
            }
        }
    }
    // 排序类型
    data.sortType = data.listingStatus == -2 ? $("#joomPublish_searchForm select[name=sortTypeNew]").val() : $("#joomPublish_searchForm select[name=sortType]").val()
    if (data.listingStatus == -2) {
        data.sortRule = $("#joomPublish_searchForm select[name=sortRule]").val()
    } else {
        delete data.sortRule
    }
    // 预计可用库存含在途/不含在途
    data.preStockType = $("#joomPublish_searchForm select[name=preStockType]").val()
    data.preStockMin = $("#joomPublish_searchForm input[name=preStockMin]").val() == ''?'':$("#joomPublish_searchForm input[name=preStockMin]").val() * 1
    data.preStockMax = $("#joomPublish_searchForm input[name=preStockMax]").val() == ''?'':$("#joomPublish_searchForm input[name=preStockMax]").val() * 1
    // 过滤零库存
    data.filterNotStockBool = $("#joomPublish_searchForm input[name=filterZeroStock]").prop('checked')

    // 商品页签
    if(data.listingStatus == -2){
        // joom模板描述
        data.hasJoomDesc = $("#joomPublish_searchForm select[name=hasJoomDesc]").val();
        // 生成情况
        data.generated = $("#joomPublish_searchForm select[name=generated]").val();
        data.isPublish = $("#joomPublish_searchForm select[name=isPublish]").val();
    }else{
        // joom模板描述
        data.hasJoomDesc = '';
        // 生成情况
        data.generated = '';
        data.isPublish = '';

        data.cateId = '';
        data.devType = '';
        data.tag = '';
        data.existLogisAttrs = [];
        data.notExistLogisAttrs = [];
        data.bizzOwnerIds = [];
        data.preStockMin = '';
        data.preStockMax = '';
        data.filterNotStockBool = false;
    }
    return data;
}

//请求需要包含参数,首次获取默认,使用分页控件修改属性,并使用修改后的属性,在页面中搜索,重置为第一页
var limitAllAppoint = 100;//每页显示数据条数
var currentPageAllAppoint = 1;//当前页数
var dataLength = 0;//数据总条数

// 搜索商品按钮事件
function joomPublish_searchProd() {
    var storeAcctId = $("#joomPublish_searchForm select[name=storeAcctId]").val();
    if (null == storeAcctId || '' == storeAcctId) {
        layer.msg("店铺不得为空");
        return;
    }
    currentPageAllAppoint = 1; //当点击搜索的时候，应该回到第一页
    dataLength = 0;
    joomPublish_search();
}

function joomPublish_search() {
    var form = layui.form,
        laypage = layui.laypage;
    var data = joomPublish_getSearchData();
    data.page = currentPageAllAppoint;
    data.limit = limitAllAppoint;
    loading.show();
    $.ajax({
        url: ctx + '/joomlisting/queryList.html',
        type: "post",
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify(data),
        traditional: true,//确保数组传参正确
        success: function (returnData) {
            dataLength = returnData.count;
            var joomCol = {
                two: '<colgroup><col width="30px"/><col width="70px" /><col width="15%" /><col width="5%" /><col width="30px"/><col width="120px"/><col width="160px"/><col width="70px"/><col width="70px"/><col width="70px"/><col width="80px"/><col width="100px"/><col width="90px"/><col width="7%"/><col width="7%"/></colgroup>',
                three: '<colgroup><col width="30px"/><col width="70px" /><col width="320px" /><col width="120px" /><col width="30px"/><col width="70px"/><col width="120px"/><col width="60px"/><col width="60px"/><col width="60px"/><col width="60px"/><col width="70px"/><col width="60px"/><col width="60px"/><col width="60px"/> <col width="60px"/><col width="7%"/><colwidth="7%"/></colgroup>',
                four:'<colgroup><col width="30px"/><col width="70px" /><col width="220px" /><col width="200px" /><col width="30px"/><col width="130px"/><col width="140px"/><col width="60px"/><col width="60px"/><col width="60px"/><col width="60px"/><col width="70px"/><col width="60px"/><col width="60px"/><col width="120px"/> <col width="120px"/><col width="7%"/><colwidth="7%"/></colgroup>',
                five: '<colgroup><col width="30px"/><col width="70px" /><col width="220px" /><col width="200px" /><col width="30px"/><col width="130px"/><col width="140px"/><col width="60px"/><col width="60px"/><col width="60px"/><col width="60px"/><col width="70px"/><col width="60px"/><col width="60px"/><col width="120px"/> <col width="120px"/><col width="7%"/></colgroup>',
                rep: function(str) {
                    $('.joomPublish_table_head').find('.layui-table colgroup').remove()
                    $('.joomPublish_table_body').find('.layui-table colgroup').remove()
                    $('.joomPublish_table_head').find('.layui-table').prepend(str)
                    $('.joomPublish_table_body').find('.layui-table').prepend(str)
                    // 待刊登two
                    // 刊登中three
                    // 刊登成功four
                    // 刊登失败five
                }
            }
            html = template('joomPublish_tpl', returnData);
            $('#joomPublish_table').html(html);
            
            //固定表头
            theadHandle().fixTh({id:'#joomPublishCard',h:150,dv1:'.layui-tab-title',dv2:'.joomPublish_table_head',dv3:'#joom_btn_show_hide',i:35});
            form.render('checkbox');
            imageLazyload();//懒加载
            var listingStatus = $("#joomPublish_searchForm input[name=listingStatus]").val();
            var shippingStatus = $("#joomPublish_searchForm input[name=shippingStatus]").val();
            $("#joom_publish .listingSuccInfo").hide();
            $("#joom_publish .timeClass").hide();
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
            $('.joomPublish-listfail').on('click', function() {
                var contentshow = $(this).next(".joomPublish-listfailreason").text();
                copyTxtToClipboard(contentshow)
            })
            //仅刊登失败对应的展示,展示状态和失败原因
            // console.log(dataLength);
            if (-2 == listingStatus) {//商品
                $('#joom_publish #totalNum i').text(`(${return1000(dataLength)})`);
                $("#joom_publish .colspan_td").attr("colSpan", 6);
                $("#joom_publish .failInfo").hide();
                $("#joom_publish .shippingInfo").hide();
                $("#joom_publish .timeClass").show();
                $("#joom_publish .listTiming").hide();
                $("#joom_publish .auditTime").show();
                $("#joom_publish .storeSubSkuInfo").hide();
                $("#joom_publish .listingInfo").hide();
                $("#joom_publish .prodStock").show();
                $("#joom_publish .joomquantityInfo").show();
                $("#joom_publish .listingStock").hide();
                $("#joom_publish .detailInfoBtn").hide();
                $("#joom_publish .listingTime").hide();
                $("#joom_publish .publishBtn").hide();
                $("#joom_publish #toListingNum i").text('');
                $("#joom_publish #joom_listingNum i").text('');
                $("#joom_publish #listingSucNum i").text('');
                $("#joom_publish #listingFailNum i").text('');
                console.log('商品')
            }
            else if (0 == listingStatus) {
                $("#joom_publish #toListingNum i").text(`(${return1000(dataLength)})`);
                $("#joom_publish .colspan_td").attr("colSpan", 10);
                $("#joom_publish .failInfo").hide();
                $("#joom_publish .shippingInfo").hide();
                $("#joom_publish .listTiming").hide();
                $("#joom_publish .auditTime").hide();
                $("#joom_publish .storeSubSkuInfo").show();
                $("#joom_publish .listingInfo").show();
                $("#joom_publish .prodStock").hide();
                $("#joom_publish .joomquantityInfo").show();
                $("#joom_publish .listingStock").show();
                $("#joom_publish .detailInfoBtn").show();
                $("#joom_publish .publishBtn").hide();
                $("#joom_publish .listingTime").hide();
                $('#joom_publish #totalNum i').text('');
                $("#joom_publish #joom_listingNum i").text('');
                $("#joom_publish #listingSucNum i").text('');
                $("#joom_publish #listingFailNum i").text('');
                joomCol.rep(joomCol.two)
                console.log('待刊登')
            }
            else if (1 == listingStatus) {
                $("#joom_publish #listingSucNum i").text(`(${return1000(dataLength)})`);
                $("#joom_publish .colspan_td").attr("colSpan", 10);
                $("#joom_publish .failInfo").hide();
                $("#joom_publish .shippingInfo").hide();
                $("#joom_publish .timeClass").show();
                $("#joom_publish .listingTime").show();
                $("#joom_publish .listTiming").hide();
                $("#joom_publish .auditTime").hide();
                $("#joom_publish .storeSubSkuInfo").show();
                $("#joom_publish .listingInfo").show();
                $("#joom_publish .prodStock").hide();
                $("#joom_publish .joomquantityInfo").hide();
                $("#joom_publish .listingStock").show();
                $("#joom_publish .listingSuccInfo").show();
                $("#joom_publish .detailInfoBtn").show();
                $("#joom_publish .publishBtn").hide();
                $('#joom_publish #totalNum i').text('');
                $("#joom_publish #toListingNum i").text('');
                $("#joom_publish #joom_listingNum i").text('');
                $("#joom_publish #listingFailNum i").text('');
                joomCol.rep(joomCol.four)
                console.log('刊登成功')
            }
            else if (2 == listingStatus) {
                $("#joom_publish #listingFailNum i").text(`(${return1000(dataLength)})`);
                $("#joom_publish .colspan_td").attr("colSpan", 10);
                $("#joom_publish .failInfo").show();
                $("#joom_publish .shippingInfo").hide();
                $("#joom_publish .listTiming").hide();
                $("#joom_publish .auditTime").hide();
                $("#joom_publish .storeSubSkuInfo").show();
                $("#joom_publish .listingInfo").show();
                $("#joom_publish .prodStock").hide();
                $("#joom_publish .joomquantityInfo").hide();
                $("#joom_publish .listingStock").show();
                $("#joom_publish .detailInfoBtn").show();
                $("#joom_publish .publishBtn").show();
                $('#joom_publish #totalNum i').text('');
                $("#joom_publish #toListingNum i").text('');
                $("#joom_publish #joom_listingNum i").text('');
                $("#joom_publish #listingSucNum i").text('');
                joomCol.rep(joomCol.five)
                console.log('刊登失败')

            }
            else if (3 == listingStatus) {
                $("#joom_publish #joom_listingNum i").text(`(${return1000(dataLength)})`);
                $("#joom_publish .colspan_td").attr("colSpan", 9);
                $("#joom_publish .failInfo").hide();
                $("#joom_publish .shippingInfo").hide();
                $("#joom_publish .timeClass").show();
                $("#joom_publish .listTiming").show();
                $("#joom_publish .auditTime").hide();
                $("#joom_publish .storeSubSkuInfo").show();
                $("#joom_publish .listingInfo").show();
                $("#joom_publish .prodStock").hide();
                $("#joom_publish .joomquantityInfo").hide();
                $("#joom_publish .listingStock").show();
                $("#joom_publish .detailInfoBtn").show();
                $("#joom_publish .publishBtn").hide();
                $("#joom_publish .listingTime").hide();
                $('#joom_publish #totalNum i').text('');
                $("#joom_publish #toListingNum i").text('');
                $("#joom_publish #listingSucNum i").text('');
                $("#joom_publish #listingFailNum i").text('');
                joomCol.rep(joomCol.three)
                console.log('刊登中')
            }

            //全选和反全选事件
            joomPublishcheckbox_no_all('joomPublish_table')
            loading.hide();
            joomPublish_toPage();
        }
    });
}

function return1000(count) {
    return count >= 10000 ? '>10000' : count 
}

function joomPublish_toPage() {
    laypage = layui.laypage;
    //处理分页
    laypage.render({
        elem: 'joomPublish_pagination',
        count: dataLength, //数据总数，从服务端得到
        layout: ['prev', 'page', 'next'],
        groups: 5,
        prev: '<上一页',
        next: '下一页>',
        limits: [30, 50, 100, 300],
        curr: currentPageAllAppoint,
        limit: limitAllAppoint,
        jump: function (obj, first) {
            currentPageAllAppoint = obj.curr;
            limitAllAppoint = obj.limit;
            //首次不执行
            if (!first) {
                joomPublish_search()
            }
        }
    });
}

function joomPublish_genToListingProd() {
    var data = $("#joomPublish_table tbody input.sid-cbox:checked");
    var storeAcctId = $("#joomPublish_searchForm select[name=storeAcctId]").val();
    // var isSale = $("#joomPublish_searchForm select[name=isSale]").val();
    var paramData = [];
    if (data.length > 0) {
        for (var i = 0; i < data.length; i++) {
            paramData.push(data[i].value);
        }
        $.ajax({
            beforeSend: function () {
                loading.show();
            },
            url: ctx + '/joomlisting/addStoreProds.html',
            type: "post",
            dataType: "json",
            data: {
                "prodTmpIdAttr": paramData,
                "storeAcctId": storeAcctId,
                // "isSale": isSale,
            },
            traditional: true,
            success: function (returnData) {
                loading.hide();
                if (returnData.code != "0000") {
                    layer.alert(returnData.msg, {icon: 2});
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
                            yes: function (index) {
                                // $("#joomPublish_search").trigger("click");
                                layer.close(index);
                            }
                        });
                    } else {
                        layer.msg('生成待刊登信息成功');
                        // $("#joomPublish_search").trigger("click");
                    }

                    returnData.extra.successModelPIdList.forEach(item => {
                        $(".tr" + item).remove()
                    })
                    // returnData.extra.failModelPIdList.forEach(item => {
                    //     $(".tr" + item).find(".pid-cbox").click()
                    // })
                    $("#joomPublish_table .layui-form-checked").removeClass("layui-form-checked")
                    $("#joomPublish_table input.sid-cbox:checked").prop("checked",false)
                    $("#joomPublish_table input.pid-cbox:checked").prop("checked",false)
                    if(!$("#joom_publish #totalNum").text().includes(">")){
                        let len = returnData.extra.successModelPIdList.length;
                        let leftText = $("#joom_publish #totalNum").text().split("(")[1];
                        let text = leftText.split(")")[0];
                        $("#joom_publish #totalNum").text(`商品(${text - len})`)
                    }
                }
            }
        });
    }
    else {
        layer.msg("请至少选择1条数据");
    }
}
// 修改描述
function joomPublish_modifyDesc() {
    var data = $("#joomPublish_table tbody input.pid-cbox:checked");
    var paramData = [];
    if (data.length > 0) {
        for (var i = 0; i < data.length; i++) {
            paramData.push($(data[i]).parents("tr").find('.pSku').text());
        }
        var index = layer.open({
            type: 1,
            title: '修改joom模板描述',
            content: $('#modifyDesc_joomPublish').html(),
            area: ['50%', '75%'],
            btn: ['关闭'],
            success: function (layero, index) {
                let joomPublishModifyDescTableIns;
                commonReturnPromise({
                    type: 'get',
                    url: '/lms/joomlisting/getJoomProdSkuExtra?prodPSkuList=' + paramData.join(","),
                }).then(res=>{
                    joomPublishModifyDescTableIns = layui.table.render({
                        elem: "#joomPublish_modifyDesc_Table",
                        cols: [[
                            {type: "checkbox"},
                            { field: "prodPSku", title: "商品父SKU",width:150},
                            { field: "prodDesc", title: "描述",templet: '#modifyDesc_joomPublish_textarea'},
                        ]],
                        data:res.list,
                        page:false,
                        id:"joomPublish_modifyDesc_Table",
                        limit:res.list.length
                    })
                })
                // 替换
                $(layero).find("#joomPublishReplace").click(function(){
                    let checkTableData = layui.table.checkStatus("joomPublish_modifyDesc_Table").data;
                    if (checkTableData.length > 0) {
                        let oldDesc = $('#joomPublish_old_describe').val(),
                            newDesc = $('#joomPublish_new_describe').val();
                        if(oldDesc!==""){
                            applytoChecked('joomPublish_modifyDesc_Table',joomPublishModifyDescTableIns,function(tr){
                                let desc = tr.find('.descript_textarea').val();
                                desc = replace_string(desc,oldDesc,newDesc);
                                tr.find('td[data-field="prodDesc"] div textarea').val(desc);
                            });
                        }else{
                            layer.msg('请输入需要修改条目的完整数据');
                        }
                    }else{
                        layer.msg("请至少选择一条数据")
                    }
                })
                // 提交
                $(layero).find("#joomPublishSubmit").click(function(){
                    let checkTableData = layui.table.checkStatus("joomPublish_modifyDesc_Table").data;
                    if (checkTableData.length > 0) {
                        let temporayArr = []
                        checkTableData.forEach(function (value) {
                            let temporaryObj = deepCopy(value)
                            temporaryObj.prodDesc = $("#joomPublish_modifyDesc_Table").next().find('.descript_textarea_' + value.prodPSku).val()
                            temporayArr.push(temporaryObj)
                        })
                        commonReturnPromise({
                            type: 'post',
                            url: '/lms/joomlisting/insertOrUpdateJoomProdSkuExtra',
                            params: JSON.stringify(temporayArr),
                            contentType: 'application/json',
                        }).then(res=>{
                            layer.msg('操作成功')
                        })
                    }else{
                        layer.msg("请至少选择一条数据")
                    }
                })
            }
        })
    } else {
        layer.msg("请至少选择1条数据");
    }
}


function joomPublish_deletelisting(id) {
    var paramData = [];
    if (id) {
        paramData.push(id);
    } else {
        var data = $("#joomPublish_table tbody input.sid-cbox:checked");
        if (data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                paramData.push(data[i].value);
            }
        }
    }
    var listingStatus = $("#joomPublish_searchForm input[name=listingStatus]").val();
    if (paramData.length > 0) {
        loading.show();
        $.ajax({
            url: ctx + '/joomlisting/deletelisting.html',
            type: "post",
            dataType: "json",
            data: {"idArr": paramData, "listingStatus": listingStatus},
            traditional: true,
            success: function (returnData) {
                loading.hide();
                if (returnData.code != "0000") {
                    layer.alert(returnData.msg, {icon: 2});
                } else {
                    layer.msg('删除店铺刊登信息成功');
                    $("#joomPublish_search").trigger("click");
                }
            },
        });
    }
    else {
        layui.layer.msg("请至少选择1条数据");
    }
}


function joomListingPublish(listingId, singleReListingSub) {

    var listingStatus = $("#joomPublish_searchForm input[name=listingStatus]").val();
    var paramData = new Array();
    var data;
    if (listingId) {//
        paramData.push(listingId);
    } else {
        //非单个子商品重新刊登
        if (!singleReListingSub) {
            data = $("#joomPublish_table tbody input.pid-cbox:checked");
        } else {
            data = $("#joomPublish_table tbody input.sid-cbox:checked");
        }

        if (data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                paramData.push(data[i].value);
            }

        }
    }
    if (paramData.length > 0) {
        $.ajax({
            beforeSend: function () {
                loading.show();
            },
            url: ctx + '/joomlisting/publishListing.html',
            type: "post",
            dataType: "json",
            data: {"ids": paramData, "singleReListingSub": singleReListingSub, "listingStatus": listingStatus},//是否子sku重发
            traditional: true,
            success: function (returnData) {
                if (returnData.code != "0000") {
                    layer.alert(returnData.msg, {icon: 2});
                } else {
                    layer.msg('商品成功进入刊登流程');
                    $("#joomPublish_search").trigger("click");
                }
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
                $("#joomPublish_search").trigger("click");
            }
        },
        complete: function () {
            loading.hide();
        },
    });
}

function joomPublish_exportskumapping() {
    var data = joomPublish_getSearchData();
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

function joomPublish_delImg(obj) {
    layer.confirm('您确认要删除图片？', {icon: 3, title: '提示'}, function (index) {
        $(obj).closest('li').remove();
        var imgTotalNum = $("#joomPublish_extImg li").length;
        $("#joomPublish_editDetailForm #curImgNum").text(imgTotalNum);

        //设置数量
        var skuImgNum = 0;
        $("#joomPublish_editDetailForm .img_ssku_uri").each(function () {
            if ($(this).text()) {
                skuImgNum++;
            }
        });
        $("#joomPublish_editDetailForm #sSkuImgNum").text(skuImgNum);
        layer.close(index);
    });
}

function joomPublish_setMainImg(obj) {
    var extImgUrl = $(obj).closest('.ImgDivOut').find('input').val();
    var mainImgUrl = $("#joomPublish_mainImg .ImgDivIn").find('input').val();
    if (mainImgUrl) {
        $(obj).closest('.ImgDivOut').find('img').attr('src', mainImgUrl);
        $(obj).closest('.ImgDivOut').find('input').attr('value', mainImgUrl);
    } else {
        $(obj).closest('li').remove();
        var imgTotalNum = $("#joomPublish_extImg li").length;
        $("#joomPublish_editDetailForm #curImgNum").text(imgTotalNum);
        var skuImgNum = 0;
        $("#joomPublish_SubSkuInfo .img_ssku_uri").each(function () {
            if ($(this).val()) {
                skuImgNum++;
            }
        });
        $("#sSkuImgNum").text(skuImgNum);
    }
    if (extImgUrl) {
        $("#joomPublish_mainImg .ImgDivIn").find('img').attr('src', extImgUrl);
        $("#joomPublish_mainImg .ImgDivIn").find('input').attr('value', extImgUrl);
    }
}

//isPublish 是否立即发布
function joomPublish_editListingProd(id, isPublish, layero) {
    var layer = layui.layer,
        laytpl = layui.laytpl,
        $ = layui.$;
    var mainImgUrl = $("#joomPublish_mainImg .ImgDivIn").find('img').attr('src');
    var extImg = "";
    $("#joomPublish_extImg .ImgDivIn").each(function () {
        if ("" != extImg) {
            extImg += "|" + $(this).find('img').attr('src');
        } else {
            extImg = $(this).find('img').attr('src');
        }
    })
    var detailData = {};
    detailData.id = id;
    detailData.publishFlag = isPublish;
    detailData.mainImage = mainImgUrl;
    detailData.extraImages = extImg;
    detailData.name = $("#joomPublish_editDetailForm input[name=title]").val();
    detailData.description = $("#joomPublish_editDetailForm textarea[name=prodDesc]").val();
    detailData.tag = $("#joomPublish_editDetailForm input[name=tag]").val();
    detailData.listingStatus = $("#joomPublish_searchForm input[name=listingStatus]").val();
    //
    var joomSensProdList = layui.formSelects.value("wishPublish_select_joomSens");
    for (var ix = 0; ix < joomSensProdList.length; ix++) {
        if(0==ix){
            detailData.joomSensProd = joomSensProdList[ix].name;
        }else{
            detailData.joomSensProd +=","+joomSensProdList[ix].name;
        }

    }
    detailData.dangerousKind = $("#joomPublish_editDetailForm input[name=dangerousKindValue]").val();

    //添加子sku
    detailData.prodListingSubSkuJooms = joomPublish_getSkusInfo();
    console.log('object :>> ', detailData.prodListingSubSkuJooms );
    if (detailData.prodListingSubSkuJooms.length < 1) {
        layer.msg('请至少保留一条子sku信息');
        return;
    }
    var minPrice = 0;
    for (var m = 0; m < detailData.prodListingSubSkuJooms.length; m++) {
        if (minPrice == 0 || minPrice > detailData.prodListingSubSkuJooms[m].price) {
            minPrice = detailData.prodListingSubSkuJooms[m].price;
        }
    }
    for (var n = 0; n < detailData.prodListingSubSkuJooms.length; n++) {
        const subSkuItem = detailData.prodListingSubSkuJooms[n]
        if (subSkuItem.price > minPrice * 4) {
            layer.msg('最大刊登价格和最低刊登价格不能相差4倍');
            return;
        }
        // 长宽高为必填项
        if(!subSkuItem.length || !subSkuItem.width || !subSkuItem.height){
            layer.msg('长宽高为必填项,请将子sku的长宽高填写完整');
            return;
        }
    }

    var hasColor = false;
    var hasSize = false;
    //
    var errMsg = "";
    var colorSizeJSON = {}; // 用于校验是否有重复的color_size
    var colorSize;
    $("#joomPublish_SubSkuInfo").find("tr").each(function () {
        //校验参数
        tdArr = $(this).children();
        varient = {};
        varient.size = tdArr.eq(4).find('input').val();
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
        varient.color = tdArr.eq(5).find('input').val();
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
    var subs = detailData.prodListingSubSkuJooms;
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
        url: ctx + '/joomlisting/editListingDetail.html',
        type: "post",
        data: JSON.stringify(detailData),
        contentType: "application/json;charset=utf-8",
        success: function (returnData) {
            var resp = returnData
            if (resp.code == "0000") {
                layer.closeAll();
                if (isPublish) {
                    layer.msg('修改成功,并进入刊登流程');
                } else {
                    layer.msg('修改成功');
                }
                $("#joomPublish_search").trigger("click");
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
function joomPublish_addExtPic() {
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
function joomPublish_downImgFromUrl4(urls) {
    var url = ''
    if(urls){
        url = urls
    }else{
        url = $.trim($("#netImgUrl4").val());
    }
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
    $("#joomPublish_editDetailForm .img_ssku_uri").each(function () {
        if ($(this).text()) {
            skuImgNum++;
        }
    });

    var imgTotalNum2 = $("#joomPublish_extImg li").length;
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
        joomPublish_showImg4(urlArray[i]);
    }
    $("#joomPublish_editDetailForm #sSkuImgNum").text(skuImgNum);
}

function joomPublish_showImg4(url) {
    var tpl = '';
    tpl += joomPublish_imgData['img']['tpl'];
    //layer.msg(url);
    var div = tpl.replace(/&{url}/g, url);
    $('#joomPublish_extImg').append(div);
    var imgTotalNum = $("#joomPublish_extImg li").length;
    $("#joomPublish_editDetailForm #curImgNum").text(imgTotalNum);
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
        '<a onclick="joomPublish_setMainImg(this);" href="javascript:void(0);" style="float:left; color: #73a1bf;">设为主图</a><a onclick="joomPublish_delImg(this);" href="javascript:void(0);" style="float:right; color: #73a1bf;">移除</a>' +
        '</div></div></div></li>'
    }
}

function joomPublish_getSkusInfo() {
    var subSkus = [];
    var tdArr;
    var varient;
    $("#joomPublish_SubSkuInfo").find("tr").each(function () {
        tdArr = $(this).children();
        varient = {};
        varient.id = tdArr.eq(0).text();
        if (varient.id) {
        } else {
            varient.storeSSku = tdArr.eq(2).find('input').val();
        }
        varient.length = tdArr.find('input[name=length]').val()
        varient.width = tdArr.find('input[name=width]').val()
        varient.height= tdArr.find('input[name=height]').val()
        varient.size = tdArr.eq(4).find('input').val();
        varient.color = tdArr.eq(5).find('input').val();
        varient.msrp = tdArr.eq(6).find('input').val();
        varient.price = tdArr.eq(7).find('input').val();
        varient.shipping = tdArr.eq(8).find('input').val();
        varient.stock = tdArr.eq(9).find('input').val();
        subSkus.push(varient);
    });
    return subSkus;
}

//定时刊登商品
function joomPublish_OnTiming() {
    var layer = layui.layer,
        $ = layui.$;
    var ids = [];
    //生成多个
    $("#joomPublish_table tbody tr  input.pid-cbox:checked").each(function () {
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
            $(layero).find('.layui-layer-content').html($("#joomPulish_listTimingTpl").html());
            //时间选择器
            layui.laydate.render({
                elem: '#joomPulish_listTiming'
                , type: 'datetime'
                , format: 'yyyy-MM-dd HH:mm'
            });
        },
        yes: function (index, layero) {
            var listTiming = $(layero).find("input[name=listTiming]").val();
            var listInterval = $(layero).find("input[name=listInterval]").val();
            if (listTiming) {
            }
            else {
                layer.msg("定时刊登开始时间不能为空");
                return;
            }
            loading.show();
            $.ajax({
                type: "post",
                url: ctx + "/joomlisting/listtiming.html",
                dataType: "json",
                data: {
                    ids: ids.join(","),
                    listTiming: new Date(listTiming).getTime(),
                    listInterval: listInterval
                },
                success: function (returnData) {
                    loading.hide();
                    if (returnData.code != "0000") {
                        layer.msg(returnData.msg);
                    } else {
                        layer.msg("定时刊登成功");
                        layer.close(index);
                        $("#joomPublish_search").trigger("click");
                    }
                }
            });
        }
    })
}

//取消定时刊登商品
function joomPublish__canclePublishOnTiming() {
    var layer = layui.layer,
        $ = layui.$;
    var ids = [];
    //生成多个
    $("#joomPublish_table tbody tr  input.pid-cbox:checked").each(function () {
        ids.push($(this).val());
    });
    if (ids.length < 1) {
        layer.msg("未选中商品");
        return;
    }

    loading.show();
    $.ajax({
        type: "post",
        url: ctx + "/joomlisting/cancleListTiming.html",
        dataType: "json",
        data: {
            ids: ids.join(","),
        },
        success: function (returnData) {
            if (returnData.code != "0000") {
                loading.hide();
                layer.msg(returnData.msg);
            } else {
                layer.msg("取消定时刊登成功");
                $("#joomPublish_search").trigger("click");
            }
        }
    });
}

function joomPublish__setShipping() {
    var ids = [];
    //生成多个
    $("#joomPublish_table tbody tr  input.pid-cbox:checked").each(function () {
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
    var oldStr = $("#joomPublish_editDetailForm input[name=title]").val();
    $("#joomPublish_editDetailForm input[name=title]").val(changeUpCase(oldStr));
}

//移除子listing,仅删除样式
function removeJoomSubListing(obj) {
    var listingStatus = $("#joomPublish_searchForm input[name=listingStatus]").val();
    if (listingStatus == 0 || listingStatus == 2) {
        $(obj).closest('tr').remove();
        var skuImgNum = 0;
        $("#joomPublish_editDetailForm .img_ssku_uri").each(function () {
            if ($(this).text()) {
                skuImgNum++;
            }
        });
        $("#joomPublish_editDetailForm #sSkuImgNum").text(skuImgNum);
    }
}

function changCheck(value){
    if(value<0.99){
        layer.alert('最小定价为0.99');
    }
}

function addJoomSubListing() {
    var tr = '<tr>';
    tr += '<td hidden></td>\
        <td>\
            <img width="60" height="60" src=\'\' onerror="layui.admin.img_noFind()">\
            <a class="img_ssku_uri disN"></a>\
        </td>\
        <td><input type="text" class="layui-input" value=""></td>\
        <td>\
            <div class="disflex">\
                <input  type="text" class="layui-input w50" name="length" placeholder="长" value="" onblur="commonBlurInputNotNega(event)" />\
                <input  type="text" class="layui-input w50" name="width" placeholder="宽" value="" onblur="commonBlurInputNotNega(event)" />\
                <input  type="text" class="layui-input w50" name="height" placeholder="高" value="" onblur="commonBlurInputNotNega(event)" />\
            </div>\
        </td>\
        <td><input type="text" class="layui-input" value="" onkeyup="value=value.replace(/[^/&apos;/&quot;\\a-\\z\\A-\\Z0-9\\u4E00-\\u9FA5\\[\\]\\{\\}\\(\\)\\-\\&\\\'\\.\\ ]/g,\'\')"></td>\
        <td><input type="text" class="layui-input" value="" onkeyup="value=value.replace(/[^/&apos;/&quot;\\a-\\z\\A-\\Z0-9\\u4E00-\\u9FA5\\[\\]\\{\\}\\(\\)\\-\\&\\\'\\.\\ ]/g,\'\')"></td>\
        <td><input type="number" class="layui-input" value=""></td>\
        <td><input type="number" class="layui-input" onblur="changCheck(value)"></td>\
        <td><input type="number" class="layui-input" value=""></td>\
        <td><input type="number" class="layui-input" value=""></td>\
        <td></td>\
        <td><button type="button" class="layui-btn layui-btn-sm" onclick="removeJoomSubListing(this)">移除</button></td>';
    tr += '</tr>';
    $('#joomPublish_SubSkuInfo').append(tr);
}

function openJoomComp(pid) {
    $.ajax({
        type: "post",
        url: ctx + "/prodTpl/listcompUrl.html",
        dataType: "json",
        data: {
            prodPId: pid,
            platCode: "joom"
        },
        success: function (returnData) {
            if (returnData.data.length >= 1) {
                for (var i = 0; i < returnData.data.length; i++) {
                    if (returnData.data[i].indexOf("http") < 0) {
                        window.open("http://" + returnData.data[i]);
                    } else {
                        window.open(returnData.data[i]);
                    }
                }
            }
        }
    });
}

//编辑侵权信息
function joomPublish_editTortInfo (data){
    var index = layer.open({
        type: 1,
        title: '侵权信息编辑',
        content: $('#tortInfoEditPop_joomPublish').html(),
        area: ['40%', '75%'],
        btn: ['关闭'],
        success: function (layero, index) {
            hasChangeTortInfo = false
            // 初始化数据
            var tortTable = []
            tortTable.push({id: data.id, platCode: 'wish', tortName: 'isWishTort', tortValue: data.wishTort, tortReasonName: 'wishTortReason', tortReasonValue: data.wishTortReason,})
            tortTable.push({id: data.id, platCode: 'joom', tortName: 'isJoomTort', tortValue: data.JoomTort, tortReasonName: 'joomTortReason', tortReasonValue: data.joomTortReason,})
            tortTable.push({id: data.id, platCode: 'ebay', tortName: 'isEbayTort', tortValue: data.EbayTort, tortReasonName: 'ebayTortReason', tortReasonValue: data.ebayTortReason,})
            tortTable.push({id: data.id, platCode: 'amazon', tortName: 'isAmazonTort', tortValue: data.AmazonTort, tortReasonName: 'amazonTortReason', tortReasonValue: data.amazonTortReason,})
            tortTable.push({id: data.id, platCode: 'aliexpress', tortName: 'isSmtTort', tortValue: data.SmtTort, tortReasonName: 'smtTortReason', tortReasonValue: data.smtTortReason,})
            tortTable.push({id: data.id, platCode: 'shopee', tortName: 'isShopeeTort', tortValue: data.ShopeeTort, tortReasonName: 'shopeeTortReason', tortReasonValue: data.shopeeTortReason,})
            tortTable.push({id: data.id, platCode: 'lazada', tortName: 'isLazadaTort', tortValue: data.LazadaTort, tortReasonName: 'lazadaTortReason', tortReasonValue: data.lazadaTortReason,})
            layui.table.render({
                elem: "#tortInfoTable_joomPublish",
                data: tortTable,
                cols: [
                    [
                        { title: "侵权状态",style: 'padding-left:2%', width: '16%',minWidth: 115,templet: function (res) {
                            var html = `<div class="layui-form alignLeft"><input type="checkbox" lay-filter="tortStatusCheckbox" lay-skin="primary" onclick="sendTort(this,"`+ res.platCode +`")" dataid="`+ res.id + `" title="`+ res.platCode +`"`+ (res.tortValue ? 'checked' : '') +`></div>`
                            return '<em>'+ html+'</em>'
                        }},
                        { title: "侵权备注", width: '45%',templet: function (res) {
                            var html =`<span class="w90 inline_table hv20" onclick="editTortReason(this)"  ><input  class="disN focusBorder blurAjaxChangeTort" name="`+ res.tortReasonName +`" dataid="`+res.id+`" value="` + (res.tortReasonValue ?res.tortReasonValue : '') + `" onclick="stopBuble(event)"/><span class="tortReasonText">`+ (res.tortReasonValue ?res.tortReasonValue : '') +`</span>
                                        <i class="layui-icon layui-icon-edit" style="color: #009688;cursor: pointer;">&#xe642;</i>`
                            return '<em>'+ html + '</em>'
                        }},
                    ]
                ],
                done: function () {
                    layui.form.on('checkbox(tortStatusCheckbox)', function(obj){
                        var elem = obj.elem
                        var ok = sendTort(elem,elem.getAttribute('title'))
                        if (!ok) {
                            layui.form.render('checkbox')
                        }
                    })

                    // 绑定事件
                    $('.blurAjaxChangeTort').on('blur', function (event) {
                        var self = this
                        $(self).parent().find('input').addClass('disN')
                        $(self).parent().find('span').removeClass('disN')
                        var originValue = $(self).attr('originValue')
                        var value = $(self).val().trim()
                        if (value != originValue) {
                            // 判断是否已经勾选侵权。如果已经勾选，则变更值不能为空
                            var ifTort = $(self).parent().prev().prop("checked")
                            if (ifTort == true && !value.trim()) {
                                $(self).val(originValue)
                                layui.layer.msg('请先取消侵权勾选')
                                return
                            }
                            var data = {
                                id: $(self).attr('dataid')
                            }
                            var name = $(self).attr('name')
                            data[name] = value
                            var layer = layui.layer
                            $.ajax({
                                type: 'post',
                                url: ctx + '/prodTpl/updateTortReason.html',
                                dataType: 'json',
                                contentType: 'application/json;charset=utf-8',
                                data: JSON.stringify(data),
                                success: function(returnData) {
                                    if (returnData.code == '0000') {
                                        hasChangeTortInfo = true
                                        $(self).next().text(value)
                                        layer.msg('修改成功')
                                    } else {
                                        layer.msg(returnData.msg)
                                    }
                                },
                                error: function() {
                                    layer.msg('发送请求失败')
                                    $(self).val(originValue)
                                }
                            })
                        }
                    })
                }
            })
        },
        end: function () {
            if (hasChangeTortInfo) {
                reRenderPage()
            }
        }
    })
}

function editTortReason(self,event) {
    // 记录开始编辑时的原始值，用于后续判断是否发起ajax修改
    $(self).find('input').attr('originValue', $(self).find('input').val())
    $(self).find('input').removeClass('disN')
    $(self).find('span').addClass('disN')
    var t = $(self).find('input').val();
    $(self).find('input').val("").focus().val(t);
}
//设置模板侵权状况
function sendTort(t, platCode) {
    if (!platCode) {
        layer.msg("参数错误");
        return false;
    }
    var id = $(t).attr('dataid');
    var toStatus = $(t).prop('checked')
    if (toStatus == true) {
        var reason = $(t).closest('td').next().find(".tortReasonText").text()
        if (!reason) {
            layer.msg('请先填写侵权原因')
            $(t).prop('checked', false)
            layui.form.render()
            return false
        }
    }
    $.ajax({
        type: "post",
        url: ctx + "/prodTpl/setPlatTort.html",
        dataType: "json",
        data: {
            id: id,
            isTort: $(t).prop('checked'),
            platCode: platCode
        },
        success: function(returnData) {
            if (returnData.code == '0000') {
                hasChangeTortInfo = true
                layer.msg("设置成功");
            } else {
                layer.msg(returnData.msg);
            }
        },
    });
    return true
}
