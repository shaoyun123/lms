var lazadaPublishWang_desc_editor
var lazadaPublishWang_highlights_editor
    /**layui.use开始 */
layui.use(['admin', 'form', 'layer', 'formSelects', 'table', 'element', 'laydate', 'laypage','layCascader'], function() {
    var admin = layui.admin,
        form = layui.form,
        layer = layui.layer,
        formSelects = layui.formSelects,
        element = layui.element,
        laydate = layui.laydate,
        laypage = layui.laypage,
        layCascader = layui.layCascader,
        $ = layui.$;
    $("#lazadaPublish_searchForm select[name=tortBanListing]").val("CURRENT_PLAT");

    form.render('select');
    form.render('radio');
    form.render('checkbox');
    formSelects.render('selectMan_lazada');
    formSelects.render('selectAttr_lazada');
    render_hp_orgs_users("#lazadaPublish_searchForm");

    initAjaxSync('/sys/getPersonAndOrgsByRole.html', 'POST', { roleNames: "lazada专员" }, function(returnData) {
        appendSelect($('#lazadaPublish_searchForm select[name=modelCreatorId]'), returnData.data.userList, 'id', 'user_name')
        form.render('select');
    }, 'application/x-www-form-urlencoded')

    laydate.render({
        elem: '#lazadaPublishTime', //渲染时间
        range: true
    });
    laydate.render({
        elem: '#lazadaPublish_endTime', //渲染时间
    })

    let lazadaPublishLazadacates = layCascader({
        elem: "#lazadaPublish_lazadaCates",
        clearable: true,
        filterable: true,
        collapseTags: true,
        placeholder: '请先选择店铺',
        // options: res,
        props: {
            multiple: true,
            label: "enName",
            value: "categoryId"
        },
    })
    // $('#lazadaPublish_cateSelBtn').click(function() {
    //     console.log("类目树展开");
    //     var siteCode = $("#lazadaPublish_searchForm   select[name=storeAcctId] option:selected").data("sites");
    //     if (siteCode) {
    //         console.log(siteCode);
    //         admin.itemCat_select('lazadaCate_cateSelEvent',
    //             'LAY-publishs-lazada-publish-hidden',
    //             'LAY-publishs-lazada-publish-div',
    //             "/lazada/getLazadaCateList.html?siteId=" + siteCode,
    //             "/lazada/searchLazadaCate.html?siteId=" + siteCode
    //         );
    //     } else {
    //         layer.msg("必须先选择店铺");
    //     }
    // });
    function getLazadaCate(siteCode){
        if(siteCode){
            commonReturnPromise({
                url: "/lms/lazada/getLazadaCategoryTree?site=" + siteCode,
            }).then((res)=>{
                lazadaPublishLazadacates.setOptions(res)
            })
        }
    }

    //填充下拉框
    function appendSelect(dom, data, id, name) {
        dom.empty();
        var option = '<option value="">请选择</option>'
        for (var i in data) {
            data[i].id = data[i].id || data[i][id];
            data[i].name = data[i].name || data[i][name];
            option += '<option value="' + data[i].id + '">' + data[i].name + '</option>'
        }
        dom.append(option)
    }

    function initAjaxSync(url, method, data, func, contentType, isLoad) { //初始化ajax请求
        if (!isLoad) {
            loading.show()
        }
        $.ajax({
            type: method,
            url: ctx + url,
            dataType: 'json',
            async: false,
            data: data,
            contentType: contentType || 'application/json',
            success: function(returnData) {
                loading.hide()
                if (returnData.code == "0000") {
                    func(returnData)
                } else {
                    layer.msg(returnData.msg, { icon: 2 });
                }
            },
            error: function(returnData) {
                layui.admin.load.hide();
                if (XMLHttpRequest.status == 200) {
                    layer.msg("请重新登录", { icon: 7 });
                } else {
                    layer.msg("服务器错误");
                }
            },
            complete: function(returnData) {
                loading.hide()
            }
        })
    }


    //绑定店铺更改事件
    form.on('select(lazadaPublish_storeAcctId)', function(data) {
        let salesSite = $(`[name='storeAcctId'] option[value=${data.value}]`).data("sites");
        if(salesSite == ''){
            salesSite = '国家'
        }
        $(".lazadaPublishSalessite").text(salesSite)

        currentPageAllAppoint = 1; //当点击搜索的时候，应该回到第一页
        dataLength = 0;
        $('#lazadaPublish_table').html("");
        $('#lazada_publish #totalNum').text("商品");
        $("#lazada_publish #toListingNum").text("待刊登");
        $("#lazada_publish #lazada_listingNum").text("刊登中");
        $("#lazada_publish #listingSucNum").text("刊登成功");
        $("#lazada_publish #listingFailNum").text("刊登失败");

        if(data.value == ''){
            lazadaPublishLazadacates.setOptions([])
        }else{
            getLazadaCate($(`[name='storeAcctId'] option[value=${data.value}]`).data("sites"))
        }
    });

    //绑定更改事件
    form.on('select(lazadaPublish_showHideVagueFlag)', function(data) {
        console.log(data.value);
        if ("pSkus" == data.value ||
            "sSkus" == data.value) {
            $("#lazada_publish #lazada_skuVagueFlag_div").removeClass("disN");
        } else {
            $("#lazada_publish #lazada_skuVagueFlag_div").addClass("disN");
        }
    });

    //清空按钮的点击事件
    $('#lazadaPublish_reset').click(function() {
        $('#LAY-publishs-lazada-publish-hidden').val('')
        $('#LAY-publishs-lazada-publish-div').html('')
        formSelects.value('selectAttr', [])
        formSelects.value('selectMan', [])
        $('#lazadaPublish_group_sel').next().find('dd[lay-value=""]').trigger('click');
        lazadaPublishLazadacates.setValue(null)
        setTimeout(() => {
            formSelects.value('isSaleListLazadaPublish', ['2','1'])
        }, 100);
    });

    var first = true;
    let currentListingStat = 0;
    //监听tab切换来选中不同的tab页
    element.on('tab(lazadaPublish_tab)', function(data) {
        $('#lazadaPublish_div_selPubStyle').addClass('disN');
        let timeType;
        let listingStatus = $("#lazadaPublish_searchForm input[name=listingStatus]").val();
        if($(this).attr('data-value') == listingStatus){ // 切换tab
            timeType = $("#lazadaPublish_searchForm select[name=timeType]").val()
        }else{
            timeType = ''
        }

        var btn1 = $('#lazadaPublish_btn_genListing'), //生成店铺商品
            // btn2 = $('#lazadaPublish_btn_genListing'),//一件重发
            btn3 = $('#lazadaPublish_btn_delListing'), //删除店铺商品
            // btn4 = $('#lazadaPublish_btn_pubNow'), //立即刊登
            // btn5 = $('#lazadaPublish_btn_exportSku'), //导出SKU映射
            // btn6 = $('#lazadaPublish_btn_pubOnTime'), //定时刊登
            btn7 = $('#lazadaPublish_btn_setShipping') //设置运费
        btn8 = $('#lazadaPublish_btn_cancleOnTime') //取消定时刊登
        btn9 = $('#lazadaPublish_btn_rePubNow') //批量重新刊登

        btn10 = $('#lazadaPublish_btn_stockType') //预计可用库存查询
        btn11 = $('#lazadaPublish_btn_needFilterStock') //过滤零库存查询条件
        btn10.addClass('disN');
        btn11.addClass('disN');
        ct_show1 = $('#lazadaPublish_btn_modelcreator');
        ct_show1.addClass('disN');

        btn1.addClass('disN');
        btn3.addClass('disN');
        btn7.addClass('disN');
        btn8.addClass('disN');
        btn9.addClass('disN');
        let div1 = $(".listingRespMsgDiv")
        div1.addClass('disN');
        const searchTotalPart = $('#lazadaPublish_searchForm').find('.showInTotalTab')
        const searchTotalToListingPart = $('#lazadaPublish_searchForm').find('.showInTotalAndToListingTab')
        let specialTab = ` <option class="sortTypeHide" value="10">预计可用库存不含在途正序</option>
                           <option class="sortTypeHide" value="11">预计可用库存不含在途倒序</option>
                           <option class="sortTypeHide" value="12">预计可用库存含在途正序</option>
                           <option class="sortTypeHide" value="13">预计可用库存含在途倒序</option>`;
         //相当于触发一次搜索
        if (data.index == 0) {
            ct_show1.removeClass('disN');
            btn1.removeClass('disN')
            btn10.removeClass('disN')
            btn11.removeClass('disN')
            $(".salesSortStyle").removeClass("layui-col-md-offset10").removeClass("layui-col-md-offset8").addClass("layui-col-md-offset6")
            $("#lazadaPublish_searchForm .sortTypeHide").length > 0?'':$("#lazadaPublish_searchForm [name=salesSort]").append(specialTab)
            $("#lazadaPublish_searchForm input[name=listingStatus]").val('-2')
            searchTotalPart.show()
            searchTotalToListingPart.show()
            $('#lazadaPublishTimeType').html('<option value="CREATE_TIME">创建时间</option><option value="AUDIT_TIME">审核时间</option><option value="PUBLISH_TIME">刊登时间</option>')
        } else if (data.index == 1) { //待刊登
            $('#lazadaPublish_div_selPubStyle').removeClass('disN');
            btn3.removeClass('disN')
            btn10.removeClass('disN')
            btn11.removeClass('disN')
            $(".salesSortStyle").removeClass("layui-col-md-offset10").addClass("layui-col-md-offset8")
            $("#lazadaPublish_searchForm .sortTypeHide").length > 0?'':$("#lazadaPublish_searchForm [name=salesSort]").append(specialTab)
            $("#lazadaPublish_searchForm input[name=listingStatus]").val('0')
            searchTotalPart.hide()
            searchTotalToListingPart.show()
            $('#lazadaPublishTimeType').html('<option value="GENERATE_TIME">生成时间</option>')
        } else if (data.index == 2) {
            btn8.removeClass('disN');
            $("#lazadaPublish_searchForm .sortTypeHide").remove()
            $("#lazadaPublish_searchForm input[name=listingStatus]").val('3')
            $(".salesSortStyle").removeClass("layui-col-md-offset10").removeClass("layui-col-md-offset8").removeClass("layui-col-md-offset6")
            searchTotalPart.hide()
            searchTotalToListingPart.hide()
            $('#lazadaPublishTimeType').html('<option value="GENERATE_TIME">生成时间</option>')
        } else if (data.index == 3) {
            $("#lazadaPublish_searchForm .sortTypeHide").remove()
            $(".salesSortStyle").removeClass("layui-col-md-offset10").removeClass("layui-col-md-offset8").removeClass("layui-col-md-offset6")
            $("#lazadaPublish_searchForm input[name=listingStatus]").val('1')
            searchTotalPart.hide()
            searchTotalToListingPart.hide()
            $('#lazadaPublishTimeType').html('<option value="GENERATE_TIME">生成时间</option><option value="PUBLISH_TIME">刊登时间</option>')
        } else if (data.index == 4) {
            btn3.removeClass('disN');
            btn9.removeClass('disN');
            div1.removeClass('disN')
            $("#lazadaPublish_searchForm .sortTypeHide").remove()
            // $(".salesSortStyle").addClass("layui-col-md-offset10")
            $(".salesSortStyle").removeClass("layui-col-md-offset4").removeClass("layui-col-md-offset8").removeClass("layui-col-md-offset6")
            $("#lazadaPublish_searchForm input[name=listingStatus]").val('2')
            searchTotalPart.hide()
            searchTotalToListingPart.hide()
            $('#lazadaPublishTimeType').html('<option value="GENERATE_TIME">生成时间</option><option value="PUBLISH_TIME">刊登时间</option>')
        } else if (data.index == 5) {
            btn7.removeClass('disN')
            $("#lazadaPublish_searchForm .sortTypeHide").remove()
            $(".salesSortStyle").removeClass("layui-col-md-offset4").removeClass("layui-col-md-offset8").addClass("layui-col-md-offset6")
            $("#lazadaPublish_searchForm input[name=shippingStatus]").val('2') //未设置运费状态
            searchTotalPart.hide()
            searchTotalToListingPart.hide()
            $('#lazadaPublishTimeType').html('<option value="GENERATE_TIME">生成时间</option><option value="PUBLISH_TIME">刊登时间</option>')
        }
        timeType && $("#lazadaPublish_searchForm select[name=timeType]").val(timeType)
        form.render('select');
        //每次触发,执行依次查询
        lazadaPublish_searchProd();
    })

    form.on('select(lazadaPublish_selPubStyle_filter)', function(data) {
        var selPubStyle = data.value;
        if (1 == selPubStyle) {
            lazadaListingPublish_selGlobelSite()
        }
        if (2 == selPubStyle) {
            $("#lazadaPublish_btn_pubOnTime").trigger("click");
        }
        $('#lazadaPublish_selPubStyle').val('');
        form.render('select')
    })

    //站点全选
    form.on('checkbox(lazada_LFS_P_c)', function(data) {
        var a = data.elem.checked;
        if (a == true) {
            $(".lazada_LFS_S_c").prop("checked", true);
            form.render('checkbox');
        } else {
            $(".lazada_LFS_S_c").prop("checked", false);
            form.render('checkbox');
        }

    });

    //有一个未选中全选取消选中
    form.on('checkbox(lazada_LFS_S_c)', function(data) {
        var item = $(".lazada_LFS_S_c");
        for (var i = 0; i < item.length; i++) {
            if (item[i].checked == false) {
                $(".lazada_LFS_P_c").prop("checked", false);
                form.render('checkbox');
                break;
            }
        }
        //如果都勾选了  勾上全选
        var all = item.length;
        for (var i = 0; i < item.length; i++) {
            if (item[i].checked == true) {
                all--;
            }
        }
        if (all == 0) {
            $(".lazada_LFS_P_c").prop("checked", true);
            form.render('checkbox');
        }
    });

});

/*layui.use结束*/

function lazada_publish_addImgByTpl(prodPId){
    const existImgs = $('#lazadaImgContainer').find(".commonImg-imgsChild").length
    const params = {
        param: {prodPIds: [prodPId]},
        limit: 8,
        existImgs,
        cb: function (tplUrlList, fullImgList) {
            if (Array.isArray(tplUrlList) && tplUrlList.length) {
                tplUrlList.forEach(item=> {
                    console.log(item)
                    checkImgExists(item).then(res => {
                        var childDiv = `
                    <div class="commonImg-imgsChild">
                        <img src="${item}" width="100" height="100" onerror="layui.admin.img_noFind()" class="img_show_hide">
                        <div class="opte" onclick="imgRemove_handleFn(this)">
                            <span class="removeImg">移除</span>
                        </div>
                    </div>
                    `;
                        $("#lazadaImgContainer").append(childDiv);
                    }).catch(err => {
                        return layer.msg('url不能为空或不能访问', { icon: 2 });
                    })
                })
            }
        },
    }
    comPickImageTpl(params,'lazada')
}

function lazadaPublish__layer_lazada(id) {
    var listingStatus = $("#lazadaPublish_searchForm input[name=listingStatus]").val();
    lazadaPublish_getlistingDetail(id)
}

function genLazadaListingDetailTpl(laytpl, $, returnData, layero) {
    laytpl($("#lazadaPulish_listDetailTpl").html()).render(returnData, function(html) {
        $(layero).find('.layui-layer-content').html(html);
        $('input[data-role="tagsinput"]').tagsinput();
        console.log(returnData)
        // lazadaPublishWang_desc_editor = lazada_autoSimditor('lazadaPublish_desc_editor_ID', returnData.prodListingLazada.description);
        // lazadaPublishWang_highlights_editor = lazada_autoSimditor('lazadaPublishWang_highlights_editor_ID', returnData.prodListingLazada.highlights);
        lazadaPublishWang_desc_editor = wangEditorRender('lazadaPublish_desc_editor_ID', returnData.prodListingLazada.description,{platCode:'lazada',prodPIds: [returnData.prodListingLazada.prodPId]});
        lazadaPublishWang_highlights_editor = wangEditorRender('lazadaPublishWang_highlights_editor_ID', returnData.prodListingLazada.highlights,{platCode:'lazada',prodPIds: [returnData.prodListingLazada.prodPId]});
        var arr = $('#lazadaPublish_editDetailForm .lazadaSubImg_UL');
        if (arr) {
            for (var i = 0; i < arr.length; i++) {
                $(arr[i]).sortable({
                    containment: "parent",
                    cursor: "move",
                });
            }
        }
        //render 时间
        // $("#lazadaPublish_SubSkuInfo").find("tr").each(function() {
        //     if ($(this).hasClass('lazadaPublish_detail_pic_class')) { //图层无法获取时间
        //         return;
        //     }
        //     var currentId = $(this).children().eq(0).text();
        //     layui.laydate.render({
        //         elem: "#promStartDate_" + currentId, //垃圾控件,不能使用元素传递,传的是字符串
        //         type: 'datetime',
        //         format: 'yyyy-MM-dd HH:mm',
        //     });
        //     layui.laydate.render({
        //         elem: '#promEndDate_' + currentId, //垃圾控件,不能使用元素传递,传的是字符串
        //         type: 'datetime',
        //         format: 'yyyy-MM-dd HH:mm',
        //     });
        // });
        //本地图片绑定
        // $("#lazadaPublish_SubSkuInfo .lazadaPublish_extPic_edit_local").each(function() { //初始化本地按钮
        //     lazadaPublish_extPic_exchangeLocal($(this));
        // });
        //绑定图片[ztt-2021/7/1]
        netImg_handleFn({
            imgBtn: '.lazadaInternetImgBtn',
            imgContainer: '#lazadaImgContainer',
            max: 8,
        });
        localImg_handleFn({
            imgBtn: '.lazadaLocalImgBtn',
            imgContainer: '#lazadaImgContainer',
            max: 8,
        });
        //拖拽元素
        $('#lazadaImgContainer').sortable({
            cursor: "move", //拖拽时鼠标样式
            containment: "parent",
            items: ".commonImg-imgsChild", //定义可拖拽的元素
            axis: "x",
        });
        //ztt-渲染表格图片
        lazadaPublish_subImgHandle();

        commonAddEventTitleToggle($('#lazadaPublish_editDetailForm'), 'lazada')
    });

    var listingStatus = $("#lazadaPublish_searchForm input[name=listingStatus]").val();
    if (0 == listingStatus || 2 == listingStatus) {
        $('.addLazadaSubListing').removeClass("disN");
    } else {
        $('.addLazadaSubListing').addClass("disN");
    }
}

//已生成的详情框
function lazadaPublish_getlistingDetail(id) {
    var layer = layui.layer,
        laytpl = layui.laytpl,
        $ = layui.$,
        form = layui.form
    layer.open({
        type: 1,
        title: '产品详情',
        btn: ['保存', '取消'],
        area: ['100%', '100%'],
        content: "加载中...",
        end: function(index, layero) {},
        yes: function(index, layero) {
            lazadaPublish_editListingProd(id, false, layero)
            return false;
        },
        success: function(layero, index) {
            //只有带刊登的详情可以修改
            var listingStatus = $("#lazadaPublish_searchForm input[name=listingStatus]").val();
            if ('0' == listingStatus || '2' == listingStatus) {
                $(layero).find(".layui-layer-btn0").show();
            } else {
                $(layero).find(".layui-layer-btn0").hide();
                $(layero).find(".layui-layer-btn1").hide();
            }
            loading.show();
            $.ajax({
                url: ctx + '/lazadaListing/getListingInfo.html',
                type: 'post',
                dataType: 'json',
                data: { id: id, listingStatus: listingStatus },
                success: function(returnData) {
                    loading.hide();
                    if (returnData.code != "0000") {
                        layer.alert(returnData.msg, { icon: 2 });
                        return;
                    }
                    genLazadaListingDetailTpl(laytpl, $, returnData.data, layero);
                }
            });
        }
    });
}


//抽象出一个公共的checkbox全选和反全选的组件
function lazadaPublishcheckbox_no_all(tableId) {
    /*获取表头checkbox和美化后的元素*/
    var $ = layui.$;
    //默认查待生成
    var listingStatus = $("#lazadaPublish_searchForm input[name=listingStatus]").val();

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

    var unlist_td = $('#' + tableId).find('.lazadaPublish-unlist').parent().prev();
    var listsucc_td = $('#' + tableId).find('.lazadaPublish-listsucc').parent().prev();
    var listfail_td = $('#' + tableId).find('.lazadaPublish-listfail').parent().prev();
    var inlist_td = $('#' + tableId).find('.lazadaPublish-inlist').parent().prev();

    //在售,和停售
    var isSale_td = $('#' + tableId).find('.lazadaPublish-isSale').parent().parent().children('td:first-child');
    var isNotSale_td = $('#' + tableId).find('.lazadaPublish-isNotSale').parent().parent().children('td:first-child');

    let isSale = layui.formSelects.value("isSaleListLazadaPublish", 'val');
    if (listingStatus == -2) {
        unlist_td.empty();
        listsucc_td.empty();
        listfail_td.empty();
        inlist_td.empty();
        // if (isSale.includes('1')) {
        //     isNotSale_td.empty();
        // } else if (isSale == 'false') {
        //     isSale_td.empty();
        // }
    }
}

function lazadaPublish_getSearchData() {
    var data = new Object();
    //默认查待生成

    data.listingStatus = $("#lazadaPublish_searchForm input[name=listingStatus]").val();

    data.storeAcctId = $("#lazadaPublish_searchForm select[name=storeAcctId]").val();
    data.cateId = JSON.parse($('#lazadaPublish_lazadaCates').val() || '[]').join(",")
    // data.cateId = $("#lazadaPublish_searchForm input[name=cateId]").val();
    data.tag = $("#lazadaPublish_searchForm select[name=tag]").val();
    data.devType = $("#lazadaPublish_searchForm select[name=devType]").val();
    data.canSaleBool = $("#lazadaPublish_searchForm select[name=canSaleBool]").val();

    data.salesSort = $("#lazadaPublish_searchForm select[name=salesSort]").val();
    data.searchSalesType = $("#lazadaPublish_searchForm select[name=searchSalesType]").val();
    data.salesMin = $("#lazadaPublish_searchForm input[name=salesMin]").val();
    data.salesMax = $("#lazadaPublish_searchForm input[name=salesMax]").val();
    data.allPlatCuntSaleType = $("#lazadaPublish_searchForm select[name=allPlatCuntSaleType]").val();
    data.allPlatCountGreat = $("#lazadaPublish_searchForm input[name=allPlatCountGreat]").val();
    data.allPlatCountLess = $("#lazadaPublish_searchForm input[name=allPlatCountLess]").val();

    //物流属性
    data.existLogisAttrs = [];
    data.notExistLogisAttrs = [];
    var logisAttrContents = layui.formSelects.value("selectAttr_lazada");

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
    var bizzOwnerContents = layui.formSelects.value("selectMan_lazada");
    for (var j = 0; j < bizzOwnerContents.length; j++) {
        data.bizzOwnerIds.push(bizzOwnerContents[j].val);
    }
    //侵权状态
    data.tortBanListing = $("#lazadaPublish_searchForm select[name=tortBanListing]").val();

    //日期
    var timeStr = $("#lazadaPublish_searchForm input[name=time]").val();
    if (timeStr) {
        data.startTime = Date.parse(timeStr.split(" - ")[0] + " 00:00:00");
        data.endTime = Date.parse(timeStr.split(" - ")[1] + " 23:59:59");
    }
    data.timeType = $("#lazadaPublish_searchForm select[name=timeType]").val();
    data.isSaleList = layui.formSelects.value("isSaleListLazadaPublish", 'val').map(item => item*1);
    data.isPublish = $("#lazadaPublish_searchForm select[name=isPublish]").val();
    data.multiSub = $("#lazadaPublish_searchForm select[name=multiSub]").val();
    data.existListing = $("#lazadaPublish_searchForm select[name=existListing]").val();
    data.modelCreatorId = $("#lazadaPublish_searchForm select[name=modelCreatorId]").val();
    data.cnTitle = "";
    data.enTitle = "";
    data.pSkus = [];
    data.sSkus = [];
    data.skuVagueFlag = $("#lazadaPublish_searchForm select[name=skuVagueFlag]").val()
    data.priceMin = $("#lazadaPublish_searchForm input[name=priceMin]").val()
    data.priceMax = $("#lazadaPublish_searchForm input[name=priceMax]").val()
    data.weightMin = $("#lazadaPublish_searchForm input[name=weightMin]").val()
    data.weightMax = $("#lazadaPublish_searchForm input[name=weightMax]").val()
    if(data.listingStatus == 2){
        data.listingRespMsg = $("#lazadaPublish_searchForm input[name=listingRespMsg]").val()
    }else{
        data.listingRespMsg = ''
    }
    if ("cnTitle" == $("#lazadaPublish_searchForm select[name=searchType]").val()) {
        data.cnTitle = ($("#lazadaPublish_searchForm input[name=searchText]").val());
    }
    if ("enTitle" == $("#lazadaPublish_searchForm select[name=searchType]").val()) {
        data.enTitle = ($("#lazadaPublish_searchForm input[name=searchText]").val());
    }
    if ("pSkus" == $("#lazadaPublish_searchForm select[name=searchType]").val()) {
        var pSkustmp = $("#lazadaPublish_searchForm input[name=searchText]").val()
        if (pSkustmp.length > 0) {
            pSkustmp = pSkustmp.split(",");
            if (pSkustmp.length > 0) {
                for (i = 0; i < pSkustmp.length; i++) {
                    data.pSkus.push(pSkustmp[i]);
                }
            }
        }
    }
    if ("sSkus" == $("#lazadaPublish_searchForm select[name=searchType]").val()) {
        var sSkustmp = $("#lazadaPublish_searchForm input[name=searchText]").val();
        if (sSkustmp.length > 0) {
            sSkustmp = sSkustmp.split(",");
        }
        if (sSkustmp.length > 0) {
            for (i = 0; i < sSkustmp.length; i++) {
                data.sSkus.push(sSkustmp[i]);
            }
        }
    }
    data.stockType = $("#lazadaPublish_searchForm select[name=stockType]").val();
    data.preAvailableAllSku = $("#lazadaPublish_searchForm select[name=preAvailableAllSku]").val();
    data.lessThenStock = $("#lazadaPublish_searchForm input[name=lessThenStock]").val();
    data.greaterThenStock = $("#lazadaPublish_searchForm input[name=greaterThenStock]").val();
    data.needFilterStock = $("#lazadaPublish_searchForm input[name=needFilterStock]:checked").val();
    if ( !(data.listingStatus == -2 || data.listingStatus == 0)) {
        data.needFilterStock = false;
    }
    return data;
}


//请求需要包含参数,首次获取默认,使用分页控件修改属性,并使用修改后的属性,在页面中搜索,重置为第一页
var limitAllAppoint = 100; //每页显示数据条数
var currentPageAllAppoint = 1; //当前页数
var dataLength = 0; //数据总条数

// 搜索商品按钮事件
function lazadaPublish_searchProd() {
    var storeAcctId = $("#lazadaPublish_searchForm select[name=storeAcctId]").val();
    var listingStatus = $("#lazadaPublish_searchForm input[name=listingStatus]").val();
    if ((null == storeAcctId || '' == storeAcctId)&&listingStatus == -2) { //只有商品判断店铺
        layer.msg("店铺不得为空");
        return;
    }
    // oa全平台XX销量
    let minD = $("#lazadaPublish_searchForm input[name=allPlatCountGreat]").val(),
        maxD = $("#lazadaPublish_searchForm input[name=allPlatCountLess]").val();
    if (minD != ''||maxD != '') { //只有商品判断店铺
        if(null == storeAcctId || '' == storeAcctId){
            layer.msg("oa全平台国家销量需要根据选中店铺所在站点查询，请选择店铺");
            return;
        }
    }
    currentPageAllAppoint = 1; //当点击搜索的时候，应该回到第一页
    dataLength = 0;
    lazadaPublish_search();
}

function lazadaPublish_search() {
    var form = layui.form,
        laypage = layui.laypage;
    var data = lazadaPublish_getSearchData();

    data.page = currentPageAllAppoint;
    data.limit = limitAllAppoint;
    loading.show();
    $.ajax({
        url: ctx + '/lazadaListing/queryList.html',
        type: "post",
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify(data),
        traditional: true, //确保数组传参正确
        success: function(returnData) {
            if (returnData.code != '0000') {
                loading.hide();
                layer.alert(returnData.msg, { icon: 2 });
                return;
            }
            dataLength = returnData.count;
            var lazadaCol = {
                two: `<colgroup>
<col width="30px"/>
<col width="70px" />
<col width="10%" />
<col width="10%" />
<col width="70px" />
<col width="10%" />
<col width="100px"/>
<col width="100px"/>
<col width="30px"/>
<col width="140px"/>
<col width="120px"/>
<col width="60px"/>
<col width="60px"/>
<col width="7%"/>
<col width="60px"/>
<col width="60px"/>
<col width="60px"/>
<col width="60px"/>
<col width="10%"/>
<col width="10%"/>
<col width="60px"/>
<col width="5%"/>
</colgroup>`,
                three: `<colgroup>
<col width="30px"/>
<col width="70px" />
<col width="10%" />
<col width="10%" />
<col width="70px" />
<col width="10%" />
<col width="100px"/>
<col width="100px"/>
<col width="30px"/>
<col width="140px"/>
<col width="120px"/>
<col width="60px"/>
<col width="60px"/>
<col width="7%"/>
<col width="60px"/>
<col width="60px"/>
<col width="60px"/>
<col width="60px"/>
<col width="10%"/>
<col width="10%"/>
<col width="60px"/>
<col width="5%"/>
</colgroup>`,
                four: `<colgroup>
<col width="30px"/>
<col width="70px" />
<col width="10%" />
<col width="10%" />
<col width="70px" />
<col width="10%" />
<col width="100px"/>
<col width="100px"/>
<col width="30px"/>
<col width="140px"/>
<col width="120px"/>
<col width="60px"/>
<col width="60px"/>
<col width="7%"/>
<col width="60px"/>
<col width="60px"/>
<col width="60px"/>
<col width="60px"/>
<col width="10%"/>
<col width="10%"/>
<col width="60px"/>
<col width="5%"/>
</colgroup>`,
                five: `<colgroup>
<col width="30px"/>
<col width="70px" />
<col width="10%" />
<col width="10%" />
<col width="70px" />
<col width="10%" />
<col width="100px"/>
<col width="100px"/>
<col width="30px"/>
<col width="140px"/>
<col width="120px"/>
<col width="60px"/>
<col width="60px"/>
<col width="7%"/>
<col width="60px"/>
<col width="60px"/>
<col width="60px"/>
<col width="60px"/>
<col width="10%"/>
<col width="10%"/>
<col width="60px"/>
<col width="5%"/>
</colgroup>`,
                rep: function(str) {
                    $('.lazadaPublish_table_head').find('.layui-table colgroup').remove()
                    $('.lazadaPublish_table_body').find('.layui-table colgroup').remove()
                    $('.lazadaPublish_table_head').find('.layui-table').prepend(str)
                    $('.lazadaPublish_table_body').find('.layui-table').prepend(str)
                }
            }
            html = template('lazadaPublish_tpl', returnData.data);
            $('#lazadaPublish_table').html(html);
            $('#lazadaPublish_currency_th').html("售价(" + returnData.data.currency + ")");
            //固定表头
            theadHandle().fixTh({ id: '#lazadaPublishCard', h: 150, dv1: '.layui-tab-title', dv2: '.lazadaPublish_table_head', dv3: '#lazada_btn_show_hide', i: 35 });
            form.render('checkbox');
            imageLazyload(); //懒加载
            var listingStatus = $("#lazadaPublish_searchForm input[name=listingStatus]").val();
            var shippingStatus = $("#lazadaPublish_searchForm input[name=shippingStatus]").val();
            $("#lazada_publish .timeClass").hide();
            $("#lazada_publish .creatorClass").hide();
            $('.lazadaPublish-listfail').on('mouseenter', function() {
                var contentshow = $(this).next(".lazadaPublish-listfailreason").text();
                layer.tips(contentshow, $(this), {
                    tips: [2, 'red'],
                    area: ['40%', 'auto'],
                    time: 0,
                });
            }).on('mouseleave', function() {
                layer.closeAll("tips");
            });
            $(".lazadaPublishSalessite_th").text($(".lazadaPublishSalessite").text())
            $('.lazadaPublish-listfail').on('click', function() {
                var contentshow = $(this).next(".lazadaPublish-listfailreason").text();
                copyTxtToClipboard(contentshow)
            })
            $('.lazadaPublish-unlist').on('mouseenter', function() {
                var contentshow = $(this).next(".lazadaPublish-unlistreason").text();
                if (!!contentshow) {
                    layer.tips(contentshow, $(this), {
                        tips: [2, 'red'],
                        area: ['40%', 'auto'],
                        time: 0,
                    });
                }
            }).on('mouseleave', function() {
                layer.closeAll("tips");
            });

            $('#lazada_publish #totalNum').text("商品");
            $("#lazada_publish #toListingNum").text("待刊登");
            $("#lazada_publish #lazada_listingNum").text("刊登中");
            $("#lazada_publish #listingSucNum").text("刊登成功");
            $("#lazada_publish #listingFailNum").text("刊登失败");
            if (-2 != listingStatus && 0 != listingStatus) {
                $("#lazada_publish .quantityInfo").hide();
            }

            //仅刊登失败对应的展示,展示状态和失败原因
            if (-2 == listingStatus) { //商品
                $('#lazada_publish #totalNum').text("商品(" + (returnData.count > 1000?' > 1000 ': returnData.count) + ")");
                $("#lazada_publish .colspan_td").attr("colSpan", 8);
                $("#lazada_publish .failInfo").hide();
                $("#lazada_publish .timeClass").show();
                $("#lazada_publish .listTiming").hide();
                $("#lazada_publish .auditTime").show();
                $("#lazada_publish .storeSubSkuInfo").hide();
                $("#lazada_publish .listingInfo").hide();
                $("#lazada_publish .detailInfoBtn").hide();
                $("#lazada_publish .publishBtn").hide();
                $("#lazada_publish .quantityInfo").show();
                $("#lazada_publish .creatorClass").hide();
                console.log('商品')
            } else if (0 == listingStatus) {
                $('#lazada_publish #toListingNum').text("待刊登(" + returnData.count + ")");
                $("#lazada_publish .colspan_td").attr("colSpan", 10);
                $("#lazada_publish .failInfo").hide();
                $("#lazada_publish .listTiming").hide();
                $("#lazada_publish .auditTime").hide();
                $("#lazada_publish .storeSubSkuInfo").show();
                $("#lazada_publish .listingInfo").show();
                $("#lazada_publish .detailInfoBtn").show();
                $("#lazada_publish .publishBtn").hide();
                $("#lazada_publish .creatorClass").show();
                lazadaCol.rep(lazadaCol.two)
                console.log('待刊登')
            } else if (1 == listingStatus) {
                $('#lazada_publish #listingSucNum').text("刊登成功(" + returnData.count + ")");
                $("#lazada_publish .colspan_td").attr("colSpan", 9);
                $("#lazada_publish .failInfo").hide();
                $("#lazada_publish .timeClass").show();
                $("#lazada_publish .listingTime").show();
                $("#lazada_publish .listTiming").hide();
                $("#lazada_publish .auditTime").hide();
                $("#lazada_publish .storeSubSkuInfo").show();
                $("#lazada_publish .listingInfo").show();
                $("#lazada_publish .detailInfoBtn").show();
                $("#lazada_publish .publishBtn").hide();
                $("#lazada_publish .creatorClass").show();
                lazadaCol.rep(lazadaCol.four)
                console.log('刊登成功')
            } else if (2 == listingStatus) {
                $('#lazada_publish #listingFailNum').text("刊登失败(" + returnData.count + ")");
                $("#lazada_publish .colspan_td").attr("colSpan", 9);
                $("#lazada_publish .failInfo").show();
                $("#lazada_publish .timeClass").show();
                $("#lazada_publish .listingTime").show();
                $("#lazada_publish .listTiming").hide();
                $("#lazada_publish .auditTime").hide();
                $("#lazada_publish .storeSubSkuInfo").show();
                $("#lazada_publish .listingInfo").show();
                $("#lazada_publish .detailInfoBtn").show();
                $("#lazada_publish .publishBtn").show();
                $("#lazada_publish .creatorClass").show();
                lazadaCol.rep(lazadaCol.five)
                console.log('刊登失败')

            } else if (3 == listingStatus) {
                $('#lazada_publish #lazada_listingNum').text("刊登中(" + returnData.count + ")");
                $("#lazada_publish .colspan_td").attr("colSpan", 9);
                $("#lazada_publish .failInfo").hide();
                $("#lazada_publish .timeClass").show();
                $("#lazada_publish .listTiming").show();
                $("#lazada_publish .auditTime").hide();
                $("#lazada_publish .storeSubSkuInfo").show();
                $("#lazada_publish .listingInfo").show();
                $("#lazada_publish .detailInfoBtn").show();
                $("#lazada_publish .publishBtn").hide();
                $("#lazada_publish .creatorClass").show();
                lazadaCol.rep(lazadaCol.three)
                console.log('刊登中')
            }

            //全选和反全选事件
            lazadaPublishcheckbox_no_all('lazadaPublish_table')
            loading.hide();
            lazadaPublish_toPage();
        }
    });
}

function lazadaPublish_toPage() {
    laypage = layui.laypage;
    //处理分页
    laypage.render({
        elem: 'lazadaPublish_pagination',
        count: dataLength, //数据总数，从服务端得到
        layout: [ 'prev', 'page', 'next', 'limit', 'refresh', 'skip'],
        limits: [30, 50, 100, 300],
        curr: currentPageAllAppoint,
        limit: limitAllAppoint,
        jump: function(obj, first) {
            currentPageAllAppoint = obj.curr;
            limitAllAppoint = obj.limit;
            //首次不执行
            if (!first) {
                lazadaPublish_search()
            }
        }
    });
}
function lazadaPublish_genToListingProd() {
    var checkedList = $("#lazadaPublish_table tbody input.sid-cbox:checked");
    const storeAcctId = $('#lazadaPublish_searchForm select[name=storeAcctId]').val()
    if (checkedList.length > 0) {
        layer.open({
            type: 1,
            title: '生成待刊登商品',
            btn: ['立即生成', '立即生成并刊登', '取消'],
            area: ['500px', '500px'],
            content: $('#lazadaPublish_goodsTpl').html(),
            success: function (layero, index) {
                commonReturnPromise({
                    url: '/lms/sys/listStoreForRenderHpStoreCommonComponent.html',
                    type:'post',
                    params: {platCode: 'lazada',roleNames: 'lazada专员'}
                }).then(res=>{
                    layui.formSelects.data('lazadaPublish_goods_storeAcctId', 'local',{ arr: res.map(v=>({...v,value:v.id,name:v.storeAcct, selected:storeAcctId==v.id}))})
                })
            },
            yes: function (index, layero) {
                lazadaPublish_publishOrGenerated(layero, index, false)
            },
            btn2:function (index, layero) {
              const errorFlag = lazadaPublish_publishOrGenerated(layero, index, true)
              if(errorFlag){
                return false
              }
            }
        });
    } else {
        layer.msg("请至少选择1条数据");
    }
}
async function lazadaPublish_publishOrGenerated(layero,_index,publishAfterGenerated=false){
    var checkedList = $("#lazadaPublish_table tbody input.sid-cbox:checked");
    const lazadaModelSIdList = []
    const storeAcctIdList = layui.formSelects.value('lazadaPublish_goods_storeAcctId', 'val');        // ["2","4"]
    if (storeAcctIdList.length > 0) {
        for (var i = 0; i < checkedList.length; i++) {
            lazadaModelSIdList.push(checkedList[i].value);
        }
        try{
            const {code, msg, data={}, extra={}} = await commonReturnPromiseRes({
                   url: '/lms/lazadaListing/addStoreProds.html',
                   type: 'post',
                   contentType: 'application/json',
                   params: JSON.stringify({ storeAcctIdList, lazadaModelSIdList, publishAfterGenerated })
           })
            layer.close(_index)
            if (code != "0000") {
                layer.alert(msg, { icon: 2 });
            } else {
                // 成功的id
                let len = 0
                Object.keys(extra).forEach(item=>{
                    (extra[item].successModelPIdList || []).forEach(v=>{
                        $(".tr" + v).remove()
                    })
                    len = len + (extra[item].successModelPIdList || []).length
                })
                $("#lazadaPublish_table .layui-form-checked").removeClass("layui-form-checked")
                $("#lazadaPublish_table input.sid-cbox:checked").prop("checked",false)
                $("#lazadaPublish_table input.pid-cbox:checked").prop("checked",false)
                if(!$("#lazada_publish #totalNum").text().includes(">")){
                    let leftText = $("#lazada_publish #totalNum").text().split("(")[1];
                    let text = leftText.split(")")[0];
                    $("#lazada_publish #totalNum").text(`商品(${text - len})`)
                }
                let repeatStr = ''
                const repeatPSkuList = []
                Object.keys(extra).forEach(v=>{
                    if(extra[v].repeatPSkuList.length){
                        const curRepeatPSkuListStr = extra[v].repeatPSkuList.join(',')
                        repeatPSkuList.push(`店铺[${v}]父lazada模板ID[${v}]：${curRepeatPSkuListStr}`)
                    }
                })
                const isExistFail = Object.keys(data).some(v=>data[v].length)
                if (isExistFail) {
                    if(repeatPSkuList.length){
                        repeatStr = `已过滤重复的父SKU：${repeatPSkuList.join(',')}` + '<br>'
                    }
                    const failInfoList = []
                    Object.keys(data).forEach(v=>{
                        failInfoList.push( `店铺[${v}]`+data[v].join(";"))
                    })
                    layer.open({
                        type: 1,
                        title: '信息',
                        closeBtn: 0, //不显示关闭按钮
                        btn: ['确认'],
                        area: ['500px', '600px'],
                        anim: 2,
                        shadeClose: true, //开启遮罩关闭
                        content: '<div style="padding:20px">' + repeatStr + failInfoList.join("<br>") + '</div>',
                        yes: function(index) {
                            layer.close(index);
                        }
                    });
                } else {
                    if(repeatPSkuList.length){
                        repeatStr = `已过滤重复的父SKU：${repeatPSkuList.join(',')}` + '<br>'
                        layer.alert(repeatStr, { icon: 1 });
                    }else{
                        layer.msg(publishAfterGenerated ? '操作成功': '生成待刊登信息成功',{icon:1});
                    }
                }
            }
        }catch(err){
            layer.alert(err, { icon: 2 });
            return true
        }
    } else {
        layer.msg("请至少选择一个店铺");
        return true
    }
}


function lazadaPublish_deletelisting(id) {
    var paramData = [];
    if (id) {
        paramData.push(id);
    } else {
        var data = $("#lazadaPublish_table tbody input.sid-cbox:checked");
        if (data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                paramData.push(data[i].value);
            }
        }
    }
    var listingStatus = $("#lazadaPublish_searchForm input[name=listingStatus]").val();
    if (paramData.length > 0) {
        loading.show();
        $.ajax({
            url: ctx + '/lazadaListing/deletelisting.html',
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
                    $("#lazadaPublish_search").trigger("click");
                }
            },
        });
    } else {
        layui.layer.msg("请至少选择1条数据");
    }
}

function lazadaListingPublish_selGlobelSite() {
    var currentSite = $("#lazadaPublish_searchForm   select[name=storeAcctId] option:selected").data("sites");
    if (currentSite == "MY") {
        layer.open({
            type: 1,
            title: '选择全球产品站点',
            btn: ['确认', '取消'],
            area: ['500px', '600px'],
            content: $('#lazadaPulish_globelsite_selTpl').html(),
            success: function(layero, index) {
                layui.form.render('checkbox');
            },
            yes: function(index) {
                var siteList = new Array();
                var item = $(".lazada_LFS_S_c");
                for (var i = 0; i < item.length; i++) {
                    if (item[i].checked == true) {
                        siteList.push(item[i].name);
                    }
                }
                lazadaListingPublish(null, false, siteList);
                layer.close(index);
            }
        });
    } else {
        lazadaListingPublish(null, false, null);
    }
}


function lazadaListingPublish(listingId, singleReListingSub, gobelSiteList) {
    var listingStatus = $("#lazadaPublish_searchForm input[name=listingStatus]").val();
    var paramData = new Array();
    var data;
    if (listingId) { //
        paramData.push(listingId);
    } else {
        //非单个子商品重新刊登
        if (!singleReListingSub) {
            data = $("#lazadaPublish_table tbody input.pid-cbox:checked");
        } else {
            data = $("#lazadaPublish_table tbody input.sid-cbox:checked");
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
            url: ctx + '/lazadaListing/publishListing.html',
            type: "post",
            dataType: "json",
            data: {
                ids: paramData,
                singleReListingSub: singleReListingSub,
                listingStatus: listingStatus,
                gobelSiteList: gobelSiteList
            }, //是否子sku重发
            traditional: true,
            success: function(returnData) {
                if (returnData.code != "0000") {
                    layer.alert(returnData.msg, { icon: 2 });
                } else {
                    layer.msg('商品成功进入刊登流程');
                    $("#lazadaPublish_search").trigger("click");
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

function lazadaPublish_relisting() {
    $.ajax({
        beforeSend: function() {
            loading.show();
        },
        url: ctx + '/lazadaListing/oneClikRelisting.html',
        type: "post",
        dataType: "json",
        traditional: true,
        success: function(returnData) {
            if (returnData.code != "0000") {
                layer.alert(returnData.msg, { icon: 2 });
            } else {
                layer.msg('重新刊登成功，商品进入刊登流程');
                $("#lazadaPublish_search").trigger("click");
            }
        },
        complete: function() {
            loading.hide();
        },
    });
}

// function lazadaPublish_exportskumapping() {
//     var data = lazadaPublish_getSearchData();
//     if (data.storeAcctId) {
//         var Confirmindex = layer.confirm('确认导出当前搜索条件下的sku映射,导出时间较慢,请勿频繁尝试',{btn:['确认','取消']},function (result) {
//             if(result){
//                 layer.close(Confirmindex );
//              submitForm(data, ctx + '/lazadaListing/exportskumapping.html')
//             }
//         })
//     } else {
//         layer.msg("店铺不得为空");
//     }
// }

function lazadaPublish_delImg(obj) {
    layer.confirm('您确认要删除图片？', { icon: 3, title: '提示' }, function(index) {
        var imgTotalNum = $(obj).closest('tr').find('li').length;
        imgTotalNum--;
        $(obj).closest('tr').find(".curImgNum").text(imgTotalNum);
        $(obj).closest('li').remove();
        layer.close(index);
    });
}

function lazadaPublish_setMainImg(obj) {
    var mainImgUrl = $(obj).closest('tr').find('.lazadaPublish_mainImg input[name=thumbnail]').val();
    var extImgUrl = $(obj).closest('li').find('input').val();
    if (mainImgUrl) {
        $(obj).closest('li').find('img').attr('src', mainImgUrl);
        $(obj).closest('li').find('input').attr('value', mainImgUrl);
    }
    if (extImgUrl) {
        $(obj).closest('tr').find('.lazadaPublish_mainImg img').attr('src', extImgUrl);
        $(obj).closest('tr').find('.lazadaPublish_mainImg input[name=thumbnail]').attr('value', extImgUrl);
    }
}


//isPublish 是否立即发布
function lazadaPublish_editListingProd(id, isPublish, layero) {
    console.log(123);
    var layer = layui.layer,
        laytpl = layui.laytpl,
        $ = layui.$;
    var detailData = {};
    detailData.id = id;
    detailData.publishFlag = isPublish;
    detailData.brand = $("#lazadaPublish_editDetailForm input[name=brand]").val();
    detailData.name = $("#lazadaPublish_editDetailForm input[name=title]").val();
    detailData.myName = $("#lazadaPublish_editDetailForm input[name=myName]").val();
    detailData.description = lazadaPublishWang_desc_editor.txt.html();
    detailData.highlights = lazadaPublishWang_highlights_editor.txt.html();
    detailData.taxes = $("#lazadaPublish_editDetailForm input[name=taxes]").val();
    detailData.packageLength = $("#lazadaPublish_editDetailForm input[name=packageLength]").val();
    detailData.packageWidth = $("#lazadaPublish_editDetailForm input[name=packageWidth]").val();
    detailData.packageHeight = $("#lazadaPublish_editDetailForm input[name=packageHeight]").val();
    detailData.packageContent = $("#lazadaPublish_editDetailForm textarea[name=packageContent]").val();
    detailData.attrKeyVal = $("#lazadaPublish_editDetailForm textarea[name=attrKeyVal]").val();
    detailData.listingStatus = $("#lazadaPublish_searchForm input[name=listingStatus]").val();
    //添加图片
    var allImgs = $('#lazadaImgContainer').find('.commonImg-imgsChild>img');
    var imgsArr = [];
    for (var k = 0; k < allImgs.length; k++) {
        var srcUrl = $(allImgs[k]).attr('src');
        imgsArr.push(srcUrl);
    }
    detailData.pImages = imgsArr.join('|');
    //添加子sku
    detailData.prodListingSubSkuLazadas = lazadaPublish_getSkusInfo();
    if (detailData.prodListingSubSkuLazadas.length < 1) {
        layer.msg('请至少保留一条子sku信息');
        return;
    }

    $.ajax({
        beforeSend: function() {
            loading.show();
        },
        url: ctx + '/lazadaListing/editListingDetail.html',
        type: "post",
        data: JSON.stringify(detailData),
        contentType: "application/json;charset=utf-8",
        success: function(returnData) {
            var resp = returnData
            loading.hide();
            if (resp.code == "0000") {
                layer.closeAll();
                if (isPublish) {
                    layer.msg('修改成功,并进入刊登流程');
                } else {
                    layer.msg('修改成功');
                }
                $("#lazadaPublish_search").trigger("click");
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
function lazadaPublish_addExtPic(obj) {
    var index = layer.open({
        type: 1,
        title: '辅图网络图片',
        area: ['800px', '300px'],
        content: '<div style="padding: 20px"><textarea class="layui-textarea" id="netImgUrl6" placeholder="请填写URL,多个地址用回车换行"></textarea></div>',
        btn: ['确定', '关闭'],
        yes: function() {
            //网络主图处理
            var url = $.trim($("#netImgUrl6").val());
            if (lazadaPublish_downImgFromUrl5(obj, url, false)) {
                $("#netImgUrl6").val("");
                layer.close(index);
            } //这个函数在最下面,然后ajax那里的话,我不知道传什么数据data,返回的类型是啥,就没改,只改了一个URL

        }
    })
}

//网络辅图处理
function lazadaPublish_downImgFromUrl5(obj, url, isLocal) {
    if (url == null || url == "") {
        layer.msg("图片地址不能为空！", { icon: 5 });
        return false;
    }
    var urlArray = url.split("\n");
    // 去一下空格
    for (var j in urlArray) {
        urlArray[j] = $.trim(urlArray[j]);
        if (!isLocal) { //非本地图片做校验,(本地图片后台替换域名)
            //图片需要校验
            //需要以http开头
            var startHttp = new RegExp(
                '^((https|http|ftp)+://){1}[^\\s]+$'
            );
            if (startHttp.test(urlArray[j]) != true) {
                layer.msg("网址格式不正确！url必须以http或https开头", { icon: 7 });
                return false;
            } else {}
            //端口开头的报错
            var ipPort = new RegExp(
                '^((https|http|ftp)+://){1}/?([0-9]{1,3}.){3}[0-9]{1,3}(:[0-9]{1,4}){1}/?[^\\s]*$'
            );


            if (ipPort.test(urlArray[j]) != true) {} else {
                layer.msg("网址格式不正确！lazada不支持url使用ip+端口,必须使用域名", { icon: 7 });
                return false;
            }
        }
    }

    var imgTotalNum2 = $(obj).closest('tr').find(".lazadaSubImg_UL li").length;
    //辅图和子图最多8张
    var remainNum2 = 8 - imgTotalNum2;
    if ((urlArray.length + imgTotalNum2) > 8) {
        remainNum2 = remainNum2 < 0 ? 0 : remainNum2;
        // $.fn.message({type: "success", msg: "最大支持" + maxUploadNum2 + "张图片,您还能上传" + remainNum2 + "张!"});
        layer.msg("最大支持共" + 8 + "张辅图,您最多还能上传" + remainNum2 + "张!", { icon: 7 });
        return false;
    }
    remainNum2 = urlArray.length > remainNum2 ? remainNum2 : urlArray.length;
    for (var i = 0; i < remainNum2; i++) {
        lazadaPublish_showImg5(urlArray[i], obj);
    }
    return true;
}

function lazadaPublish_showImg5(url, obj) {
    var tpl = '';
    tpl += lazadaPublish_imgData['img']['tpl'];
    var div = tpl.replace(/&{url}/g, url);
    $(obj).closest('tr').find('.lazadaSubImg_UL').append(div);
    var imgTotalNum = $(obj).closest('tr').find(".lazadaSubImg_UL li").length;
    $(obj).closest('tr').find(".curImgNum").text(imgTotalNum);
}


var lazadaPublish_imgData = {
    img: {
        head: '',
        tpl: '<li draggable="true" style="width: 150px;margin-bottom:40px;border:1px solid #ccc;overflow:hidden">' +
            '<div class="ImgDivOut">' +
            '<div class="ImgDivIn">' +
            '<input type="hidden" name="extImg" value="&{url}">' +
            '<img  style="height:150px;max-width: 150px" src="&{url}">' +
            '</div>' +
            '<div class="imgDivDown" style="width:150px">' +
            '<a onclick="lazadaPublish_setMainImg(this);" href="javascript:void(0);" style="float:left; color: #73a1bf;">设为主图</a><a onclick="lazadaPublish_delImg(this);" href="javascript:void(0);" style="float:right; color: #73a1bf;">移除</a>' +
            '</div></div></div></li>'
    }
}

function lazadaPublish_getSkusInfo() {
    console.log(321);
    var subSkus = [];
    var tdArr;
    var varient;
    $("#lazadaPublish_SubSkuInfo").find("tr").each(function() {
        if ($(this).hasClass('lazadaPublish_detail_pic_class')) {
            return;
        }

        tdArr = $(this).children();
        varient = {};
        varient.id = tdArr.eq(0).text();
        if (varient.id) {} else {
            varient.storeSSku = tdArr.eq(2).find('input').val();
        }


        varient.myRetailPrice = tdArr.eq(5).find('input[name=myRetailPrice]').val();
        varient.sgRetailPrice = tdArr.eq(5).find('input[name=sgRetailPrice]').val();
        varient.idRetailPrice = tdArr.eq(5).find('input[name=idRetailPrice]').val();
        varient.phRetailPrice = tdArr.eq(5).find('input[name=phRetailPrice]').val();
        varient.thRetailPrice = tdArr.eq(5).find('input[name=thRetailPrice]').val();
        varient.vnRetailPrice = tdArr.eq(5).find('input[name=vnRetailPrice]').val();

        // varient.promStartDate = new Date(tdArr.eq(6).find('input').val());
        // varient.promEndDate = new Date(tdArr.eq(7).find('input').val());

        varient.mySalesPrice = tdArr.eq(6).find('input[name=mySalesPrice]').val();
        varient.sgSalesPrice = tdArr.eq(6).find('input[name=sgSalesPrice]').val();
        varient.idSalesPrice = tdArr.eq(6).find('input[name=idSalesPrice]').val();
        varient.phSalesPrice = tdArr.eq(6).find('input[name=phSalesPrice]').val();
        varient.thSalesPrice = tdArr.eq(6).find('input[name=thSalesPrice]').val();
        varient.vnSalesPrice = tdArr.eq(6).find('input[name=vnSalesPrice]').val();


        varient.quantity = tdArr.eq(7).find('input').val();

        var nextTr = $(this).next("tr");
        if ($(nextTr).hasClass('lazadaPublish_detail_pic_class')) { //存储的图片
            varient.attrKeyVal = $(nextTr).find('textarea[name=attrKeyVal]').val();
            varient.thumbnail = $(nextTr).find('.lazadaPublish_mainImg input[name=thumbnail]').val();
        }

        subSkus.push(varient);
    });
    return subSkus;
}

//定时刊登商品
function lazadaPublish_OnTiming() {
    var layer = layui.layer,
        $ = layui.$;
    var ids = [];
    //生成多个
    $("#lazadaPublish_table tbody tr  input.pid-cbox:checked").each(function() {
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
            $(layero).find('.layui-layer-content').html($("#lazadaPulish_listTimingTpl").html());
            var currentSite = $("#lazadaPublish_searchForm   select[name=storeAcctId] option:selected").data("sites");
            if (currentSite == "MY") { //马来西亚站点刊登需要选取全球站点
                $("#lazadaPulish_listTiming_form_site").removeClass("disN");
                layui.form.render('checkbox');
            } else {
                $("#lazadaPulish_listTiming_form_site").addClass("disN");
            }

            //时间选择器
            layui.laydate.render({
                elem: '#lazadaPulish_listTiming',
                type: 'datetime',
                format: 'yyyy-MM-dd HH:mm'
            });

        },
        yes: function(index, layero) {
            var gobelSiteList = new Array();
            var item = $(".lazada_LFS_S_c");
            for (var i = 0; i < item.length; i++) {
                if (item[i].checked == true) {
                    gobelSiteList.push(item[i].name);
                }
            }


            var listTiming = $(layero).find("input[name=listTiming]").val();
            var listInterval = $(layero).find("input[name=listInterval]").val();
            if (listTiming) {} else {
                layer.msg("定时刊登开始时间不能为空");
                return;
            }
            loading.show();
            $.ajax({
                url: ctx + "/lazadaListing/listtiming.html",
                type: "post",
                dataType: "json",
                data: {
                    ids: ids.join(","),
                    listTiming: new Date(listTiming).getTime(),
                    listInterval: listInterval,
                    gobelSiteList: gobelSiteList
                },
                traditional: true,
                success: function(returnData) {
                    loading.hide();
                    if (returnData.code != "0000") {
                        layer.msg(returnData.msg);
                    } else {
                        layer.msg("定时刊登成功");
                        layer.close(index);
                        $("#lazadaPublish_search").trigger("click");
                    }
                }
            });
        }
    })
}

//取消定时刊登商品
function lazadaPublish__canclePublishOnTiming() {
    var layer = layui.layer,
        $ = layui.$;
    var ids = [];
    //生成多个
    $("#lazadaPublish_table tbody tr  input.pid-cbox:checked").each(function() {
        ids.push($(this).val());
    });
    if (ids.length < 1) {
        layer.msg("未选中商品");
        return;
    }

    loading.show();
    $.ajax({
        type: "post",
        url: ctx + "/lazadaListing/cancleListTiming.html",
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
                $("#lazadaPublish_search").trigger("click");
            }
        }
    });
}

function lazadaPublish__setShipping() {
    var ids = [];
    //生成多个
    $("#lazadaPublish_table tbody tr  input.pid-cbox:checked").each(function() {
        ids.push($(this).val());
    });
    if (ids.length < 1) {
        layer.msg("未选中商品");
        return;
    }
    $.ajax({
        type: "post",
        url: ctx + "/lazadaListing/setShipping.html",
        dataType: "json",
        data: {
            ids: ids
        },
        traditional: true,
        success: function(returnData) {
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

function lazadaPublish_upCaseTitle() {
    var oldStr = $("#lazadaPublish_editDetailForm input[name=title]").val();
    $("#lazadaPublish_editDetailForm input[name=title]").val(changeUpCase(oldStr));
}

//移除子listing,仅删除样式
function removeLazadaSubListing(obj) {
    var listingStatus = $("#lazadaPublish_searchForm input[name=listingStatus]").val();
    if (listingStatus == 0 || listingStatus == 2) {
        $(obj).closest('tr').remove();
        var skuImgNum = 0;
        $("#lazadaPublish_editDetailForm .img_ssku_uri").each(function() {
            if ($(this).text()) {
                skuImgNum++;
            }
        });
        $("#lazadaPublish_editDetailForm #sSkuImgNum").text(skuImgNum);
    }
}

function addLazadaSubListing() {
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
        <td><button type="button" class="layui-btn layui-btn-sm" onclick="removeLazadaSubListing(this)">移除</button></td>';
    tr += '</tr>';
    $('#lazadaPublish_SubSkuInfo').append(tr);
}

function lazadaListingPublish_updatePrice() {
    var subListingIds = [];
    $("#lazadaPublish_SubSkuInfo").find("tr").each(function() {
        if ($(this).hasClass('lazadaPublish_detail_pic_class')) {
            return;
        }
        var tdArr = $(this).children();
        subListingIds.push(tdArr.eq(0).text());
    });
    //按子listingid更新刊登价格
    $.ajax({
        beforeSend: function() {
            loading.show();
        },
        url: ctx + '/lazadaListing/getUpdateListingPrice.html',
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
                $("#lazadaPublish_SubSkuInfo").find("tr").each(function() {
                    var tdArr = $(this).children();
                    var currentId = tdArr.eq(0).text();
                    var upList = returnData.data;
                    for (var i = 0; i < upList.length; i++) {
                        if (currentId == upList[i].id) {
                            tdArr.eq(5).find('input[name=myRetailPrice]').val(upList[i].myRetailPrice);
                            tdArr.eq(8).find('input[name=mySalesPrice]').val(upList[i].mySalesPrice);
                            tdArr.eq(5).find('input[name=sgRetailPrice]').val(upList[i].sgRetailPrice);
                            tdArr.eq(8).find('input[name=sgSalesPrice]').val(upList[i].sgSalesPrice);
                            tdArr.eq(5).find('input[name=vnRetailPrice]').val(upList[i].vnRetailPrice);
                            tdArr.eq(8).find('input[name=vnSalesPrice]').val(upList[i].vnSalesPrice);
                            tdArr.eq(5).find('input[name=thRetailPrice]').val(upList[i].thRetailPrice);
                            tdArr.eq(8).find('input[name=thSalesPrice]').val(upList[i].thSalesPrice);
                            tdArr.eq(5).find('input[name=phRetailPrice]').val(upList[i].phRetailPrice);
                            tdArr.eq(8).find('input[name=phSalesPrice]').val(upList[i].phSalesPrice);
                            tdArr.eq(5).find('input[name=idRetailPrice]').val(upList[i].idRetailPrice);
                            tdArr.eq(8).find('input[name=idSalesPrice]').val(upList[i].idSalesPrice);
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

//主辅图本地上传
function lazadaPublish_extPic_exchangeLocal(obj) {
    console.log(123);
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
                lazadaPublish_downImgFromUrl5(obj, data.msg, true);
            } else {
                layer.msg(data.msg); //这里面的内容不知道写啥,同OA系统
            }
        }
    });
}

//构建富文本
var lazada_autoSimditor = function(id, data) {
    //设置内容
    // if(data){
    //     $('#'+id).html(data);
    // }else{
    //     $('#'+id).html("");
    // }
    // layui.use(['layedit'],function () {
    //     var layedit = layui.layedit;
    //     //构建富文本
    //     var index_info = layedit.build(id, {
    //         tool: ['strong','italic','image'],
    //         height: 230 //设置编辑器高度
    //     });
    //     return index_info;
    // })
    var editor = new Simditor({
        textarea: $('#' + id),
        cleanPaste: true, //复制过来的默认清除所有自带样式
        toolbar: ['title',
            'bold',
            'italic',
            'underline',
            'strikethrough',
            'fontScale',
            'color',
            'ol',
            'ul',
            'blockquote',
            'table',
            'image',
            'hr',
            'indent',
            'outdent',
            'alignment'
        ]
    });
    editor.setValue(data || ''); //设置富文本的值
    return editor
};

//标题字数提示 最多255
function lazadaPublish_titleNumNote (dom) {
    var restNum = $(dom).val().length;
    $(dom).next('span').html(`${restNum}`)
    if (restNum > 255) {
        $(dom).next('span').css('color', 'red')
    } else {
        $(dom).next('span').css('color', '#666')
    }
}

//垃圾堆里扔垃圾,算了,不管了
function lazadaPublish_subImgHandle() {
    //网络图片的点击事件
    var netImgLayer = `
        <div style="padding:20px;">
            <textarea placeholder="一个" class="layui-textarea"></textarea>
        </div>`;
    //网络图片
    $('body').on('click', '.lazadaInternetImgSubBtn', function() {
        var $thumbnailInput = $(this).parents('td').find('input[name=thumbnail]');
        var $thumbnailImg = $(this).parents('td').find('img');
        layer.open({
            type: 1,
            title: '网络图片',
            area: ['600px', '400px'],
            content: netImgLayer,
            id: `lazadaInternetImgSubBtn${Date.now()}`,
            btn: ['保存', '关闭'],
            yes: function(index, layero) {
                var $val = layero.find('textarea').val();
                var allImgUrl = $val.split('\n');
                var url = allImgUrl[0];
                checkImgExists(url).then(res => {
                    $thumbnailInput.val(url);
                    $thumbnailImg.attr('src', url);
                    layer.close(index);
                }).catch(err => {
                    return layer.msg('url不能为空或不能访问', { icon: 2 });
                })
            }
        });
    });
    //本地图片
    $('body').on('click', '.lazadaLocalImgSubBtn', function() {
        var $thumbnailInput = $(this).parents('td').find('input[name=thumbnail]');
        var $thumbnailImg = $(this).parents('td').find('img');
        var $next = $(this).next('input[type=file]');
        $next.trigger('click');
        $next.on('change', function(e) {
            var files = e.target.files;
            if (!files.length) return;
            var file = files[0];
            var formData = new FormData();
            formData.append('file', file);
            //把formData传递给后台,执行提交操作
            $.ajax({
                    url: ctx + "/prodTpl/uploadPic.html",
                    data: formData,
                    type: "POST",
                    async: true,
                    cache: false,
                    contentType: false,
                    processData: false,
                    dataType: 'json',
                    beforeSend: function() {
                        loading.show();
                    },
                    success: function(data) {
                        loading.hide();
                        if (data.code == '0000') {
                            $thumbnailInput.val(data.msg);
                            $thumbnailImg.attr('src', data.msg);
                        } else {
                            layer.msg(data.msg, { icon: 2 });
                        }
                        //传递完成以后清空input的value
                        e.target.value = '';
                    },
                    error: function(error) {
                        loading.hide();
                        layer.msg(`${error.statusText}`, { icon: 2 });
                    }
                })
                //传递完成以后清空input的value
            e.target.value = '';
        });
    });
}