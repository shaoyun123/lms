console.log("shopee_cnscPublish");
// var shopeeCNSCPublishWangEditor
let detailDescWangEditor;
let detailCnscDescWangEditor;
/**layui.use开始 */
layui.use(['admin', 'form', 'layer', 'formSelects', 'table', 'element', 'laydate', 'laypage','upload','layCascader'], function () {
    var admin = layui.admin,
        form = layui.form,
        layer = layui.layer,
        formSelects = layui.formSelects,
        element = layui.element,
        laydate = layui.laydate,
        laypage = layui.laypage,
        upload = layui.upload,
        layCascader = layui.layCascader
        $ = layui.$

    $("#shopeeCNSCPublish_searchForm select[name=tortBanListing]").val("CURRENT_PLAT");
    form.render('select')
    form.render('radio')
    form.render('checkbox')
    render_hp_orgs_users("#shopeeCNSCPublish_searchForm");
    formSelects.render('shopeeCNSCPublish_searchForm_saleStatusList')

    //初始化发货仓库
    initShopeeWarehouseSelect('shopeeCNSCPublishWarehouseId');

    //绑定更改事件
    form.on('select(shopeeCNSCPublish_showHideVagueFlag)', function (data) {
        if ("pSkus" == data.value
            || "sSkus" == data.value) {
            $("#shopee_cnscPublish #shopee_cnscPublish_skuVagueFlag_div").removeClass("disN");
        } else {
            $("#shopee_cnscPublish #shopee_cnscPublish_skuVagueFlag_div").addClass("disN");
        }
    });

    laydate.render({
        elem: '#shopeeCNSCPublishTime', //渲染时间
        range: true
    });
    laydate.render({
        elem: '#shopeeCNSCPublish_endTime', //渲染时间
    })

    //ztt20240515--选择店铺,自动获取店铺对应的仓库
    form.on('select(shopeeCNSCPublish_searchForm_storeAcctId)', function (data) {
      let val = data.value;
      commonReturnPromise({
        url: ctx +'/sys/getSysSalesAcctConfigByStoreAcctId',
        type: 'post',
        contentType: 'application/json',
        params: JSON.stringify({
          storeAcctIdList: [val]
        })
      }).then(res => {
        let shippingWarehouseId = res[0]['shippingWarehouseId'] || '';
        $('#shopeeCNSCPublishWarehouseId').val(shippingWarehouseId);
        form.render('select');
      });
    });

    //ztt20240515--监听预计可用库存点击
    form.on('select(shopeeCNSCPublishIsIncludeStockAll)', function(){
      let warehouseId =$('#shopeeCNSCPublishWarehouseId').val();
      if(!warehouseId){
        layer.msg('请先选择发货仓库',{icon:7});
        return;
      }
    });

    // 模板查询赋值
    commonSaveSearchTpl({
        id: "shopeeCNSCPublish_save",
        formId: "shopeeCNSCPublish_searchForm",
        pageName: "shopee_cnscPublish",
        searchBtnId: "shopeeCNSCPublishSearch",
        cb: (param) => shopeeCNSCPublish_formVal(param),
      });
      
      function shopeeCNSCPublish_formVal(param) {
        // tab赋值
        $("#shopeeCNSCPublishCard .layui-tab-title li").each(function () {
          if ($(this).data("value") == param.listingStatus) {
            $(this).addClass("layui-this");
          } else {
            $(this).removeClass("layui-this");
          }
        });
        // 店铺 赋值
        commonReturnPromise({
          url: "/lms/sys/listStoreForRenderHpStoreCommonComponent.html",
          type: "post",
          params: {
            roleNames: `shopee专员`,
            orgId: param.orgId,
            salePersonId: param.sellerId,
            platCode: "shopee",
          },
        }).then((res) => {
          commonRenderSelect("shopeeCNSCPublish_searchForm_storeAcctId", res || [], {
            name: "storeAcct",
            code: "id",
            selected: param.storeAcctId,
          }).then(()=>{
              form.render();
          })
          // 给表单赋值
          form.val("shopeeCNSCPublish_searchForm", param);
          // 多选的 name: xm-select
          let multiSelectObj = {
            logisAttrContents: "selectAttr_shopee_cnscPublish",
            bizzOwnerIds: "selectMan_shopee_cnscPublish",
            saleStatusList: 'shopeeCNSCPublish_searchForm_saleStatusList',
          };
          Object.keys(multiSelectObj).forEach((item) => {
            if (param[item]) {
              formSelects.value(multiSelectObj[item], param[item].split(","), true);
            } else {
              formSelects.render(multiSelectObj[item]);
            }
          });
          // 多选
          let cascaderObj = {
            oaNewCates: ShopeCnscOaNewcates,
            cnscCates: ShopeCnscCnscCates,
          };
          Object.keys(cascaderObj).forEach((item) => {
            if (param[item]) {
              cascaderObj[item].setValue(JSON.parse(param[item]));
            } else {
              cascaderObj[item].setValue([]);
            }
          });
          // 执行搜索
          $("#shopeeCNSCPublishCard .layui-tab-title li.layui-this").click()
        //   $("#shopeeCNSCPublish_search").trigger("click");
        });
      }

    // 批量以图搜图 上传文件
     upload.render({
        elem: "#shopeeCNSCPublish_importSearchImage", //绑定元素
        url: "/lms/shopee/shopeelisting/importSearchImage", //上传接口
        contentType: "multipart/form-data",
        accept: 'file',
        done: function (res) {
            //上传完毕回调
            if(res.code=='0000'){
                layer.alert('<div  class="ztt-a" onclick="cnscpublishImagejumpTotaskcenter()">上传成功！操作结果需在任务中心查看</div>',{icon:1,title:'操作结果'});
            }else{
                layer.msg(res.msg, { icon: 2 });
            }
        },
        error: function (err) {
            //请求异常回调
            layer.msg(err, { icon: 2 });
        },
        });

    //选择分类弹框
    shopCnscShowCateCascader()
    let ShopeCnscOaNewcates =''
    let ShopeCnscCnscCates =''
    function shopCnscShowCateCascader() {
    Promise.all([
        commonReturnPromise({
        url: "/lms/prodCateOa/get/cate/tree",
        }),
        commonReturnPromise({
        url: "/lms/shopee/shopeeCate/cnscCategoryTree",
        }),
    ]).then(res => {
        ShopeCnscOaNewcates= layCascader({
            elem: "#shop_cnsc_oaNewCates",
            clearable: true,
            filterable: true,
            collapseTags: true,
            // minCollapseTagsNumber: 2,
            options: JSON.parse(res[0]),
            props: {
                multiple: true,
                label: "title",
                value: "value",
                children: "data",
                // checkStrictly: true
            },
        })
        ShopeCnscCnscCates = layCascader({
            elem: "#shop_cnsc_cnscCates",
            clearable: true,
            filterable: true,
            collapseTags: true,
            // minCollapseTagsNumber: 2,
            options: res[1],
            props: {
                multiple: true,
                // checkStrictly: true
            },
            })
        })
    }

    // $('#shopeeCNSCPublish_item').click(function () {
    //     admin.itemCat_select('layer-publishs-shopee-cnscPublish', 'LAY-publishs-shopee-cnscPublish-hidden', 'LAY-publishs-shopee-cnscPublish-div')
    // });

    //清空按钮的点击事件
    $('#shopeeCNSCPublish_reset').click(function () {
        $('#LAY-publishs-shopee-cnscPublish-hidden').val('')
        $('#LAY-publishs-shopee-cnscPublish-div').html('')
        formSelects.value('selectAttr_shopee_cnscPublish', [])
        formSelects.value('selectMan_shopee_cnscPublish', [])
        $('#shopeeCNSCPublish_group_sel').next().find('dd[lay-value=""]').trigger('click');
        // 类目为空
        // $('#shop_cnsc_oaNewCates').val()
        ShopeCnscOaNewcates.setValue(null)
        ShopeCnscCnscCates.setValue(null)
        setTimeout(() => {
            formSelects.value('shopeeCNSCPublish_searchForm_saleStatusList', ['2','1'])
        }, 100);
    });

    form.on('select(shopeeCNSCPublish_selPubStyle_filter)', function (data) {
        var selPubStyle = data.value;
        if (1 == selPubStyle) {
            $("#shopeeCNSCPublish_btn_pubNow").trigger("click");
        }
        if (2 == selPubStyle) {
            $("#shopeeCNSCPublish_btn_pubOnTime").trigger("click");
        }
        $('#shopeeCNSCPublish_selPubStyle').val('');
        form.render('select')
    })

    var first = true;
    //监听tab切换来选中不同的tab页
    element.on('tab(shopeeCNSCPublish_tab)', function (data) {
        var btn1 = $('#shopeeCNSCPublish_btn_genListing'),//生成店铺商品
            btn3 = $('#shopeeCNSCPublish_btn_delListing'),//删除店铺商品
            btn4 = $('#shopeeCNSCPublish_btn_exportListing'),//生成并导出listing
            // btn5 = $('#shopeeCNSCPublish_btn_exportSku'),//导出SKU映射
            btn6 = $('#shopeeCNSCPublish_btn_genListing2'),//生成店铺商品2
            btn7 = $('#shopeeCNSCPublish_btn_cancleOnTime'),//取消定时刊登
            btn8 = $('#shopeeCNSCPublish_btn_rePublish'),//重新看的呢过
            btn9 = $('#shopeeCNSCPublish_btn_copyListing'),//复制刊登信息
            btn10 = $('#shopeeCNSCPublish_btn_editListingTitle'),//批量修改标题 
            formItemDom1 = $('#shopeeCNSCPublish_searchForm').find('.cnscTitleRepeated');// 查询条件中的cnsc标题重复下拉选项
            formClassDom1 = $('#shopeeCNSCPublish_searchForm').find('.show-basic-list');// 查询条件中的只在商品tab展示


        $('#shopeeCNSCPublish_div_selPubStyle').addClass('disN');
        btn1.addClass('disN');
        btn3.addClass('disN');
        btn4.addClass('disN');
        btn6.addClass('disN');
        btn7.addClass('disN');
        btn8.addClass('disN');
        btn9.addClass('disN');
        btn10.addClass('disN');
        formItemDom1.addClass('disN')
        formClassDom1.addClass('disN')

        const salesSortStr = `<option value="1">7日销量倒序排列</option>
        <option value="2">15日销量倒序排列</option>
        <option value="3">30日销量倒序排列</option>
        <option value="4">模板创建时间升序</option>
        <option value="5">模板创建时间降序</option>
        <option value="6">模板刊登时间升序 </option>
        <option value="7">模板刊登时间降序</option>
        <option value="8">模板审核时间升序</option>
        <option value="9">模板审核时间降序</option>`

        const commoditySalesSortStr=`<option value="1">7日销量倒序排列</option>
        <option value="2">15日销量倒序排列</option>
        <option value="3">30日销量倒序排列</option>
        <option value="4">模板创建时间升序</option>
        <option value="5">模板创建时间降序</option>
        <option value="8">模板审核时间升序</option>
        <option value="9">模板审核时间降序</option>`

        //相当于触发一次搜索
        if (data.index == 0) {//商品
            btn6.removeClass('disN');
            $("#shopee_cnscPublish .failInfo").hide();
            $("#shopeeCNSCPublish_searchForm input[name=listingStatus]").val('-2');//全部
            $('#shopee_cnscPublish_salesSort').html(commoditySalesSortStr)
            formClassDom1.removeClass('disN')

        } else if (data.index == 1) {//待待刊登
            $('#shopeeCNSCPublish_div_selPubStyle').removeClass('disN');
            btn3.removeClass('disN');
            btn9.removeClass('disN');
            btn10.removeClass('disN');
            formItemDom1.removeClass('disN')
            $("#shopee_cnscPublish .failInfo").hide();
            $("#shopeeCNSCPublish_searchForm input[name=listingStatus]").val('0');//待刊登
            $('#shopee_cnscPublish_salesSort').html(commoditySalesSortStr)

        } else if (data.index == 2) {//刊登中
            btn7.removeClass('disN');
            formItemDom1.removeClass('disN')
            $("#shopee_cnscPublish .failInfo").hide();
            $("#shopeeCNSCPublish_searchForm input[name=listingStatus]").val('3')
            $('#shopee_cnscPublish_salesSort').html(commoditySalesSortStr)

        } else if (data.index == 3) {//刊登成功
            btn8.removeClass('disN');
            btn9.removeClass('disN');
            formItemDom1.removeClass('disN')
            $("#shopee_cnscPublish .failInfo").hide();
            $("#shopeeCNSCPublish_searchForm input[name=listingStatus]").val('1')
            $('#shopee_cnscPublish_salesSort').html(salesSortStr)

        } else if (data.index == 4) {//刊登失败
            btn8.removeClass('disN');
            $('#shopeeCNSCPublish_div_selPubStyle').removeClass('disN');
            btn3.removeClass('disN');
            $("#shopee_cnscPublish .failInfo").show();
            $("#shopeeCNSCPublish_searchForm input[name=listingStatus]").val('2')
            $('#shopee_cnscPublish_salesSort').html(salesSortStr)
        } else if (data.index == 5) {//已删除刊登
            $('#shopeeCNSCPublish_div_selPubStyle').removeClass('disN');
            btn3.removeClass('disN');
            btn9.removeClass('disN');
            $("#shopee_cnscPublish .failInfo").hide();
            $("#shopeeCNSCPublish_searchForm input[name=listingStatus]").val('4');//待刊登
            $('#shopee_cnscPublish_salesSort').html(salesSortStr)
        }
        form.render()
        //每次触发,执行依次查询
        shopee_cnscPublish_searchBtn();
    })

    form.on('select(shopeeCNSCPublish_sufixSetType)', function (obj) {
        if (obj.value == 1 || obj.value == 3) {
            $('.shopeeCNSCPublish_replacehide').addClass('disN')
        } else {
            $('.shopeeCNSCPublish_replacehide').removeClass('disN')
        }
    })

    $('#pSku_copyBtn').click(function(){
        // 若复选框选中数据，仅复制复选框选中数据；2.无选中数据，复制查询数据里前1w个数据
        var checkTrList = $("#shopeeCNSCPublish_table tbody input[name=id]:checked").parents('tr');
        if(checkTrList.length){
            let skuList = []
            checkTrList.each(function(){
                let pSku =  $(this).find('[id=prodDetail]').data('psku')
                if(pSku){
                    skuList.push(pSku)
                }
            })
            copyTxtToClipboard(skuList.join(','),'textarea')
        }else{
            let searchData = getSearchData_shopeeCNSCPublish();
            commonReturnPromise({
                type: "POST",
                url: '/lms/shopee/shopeelisting/cnsc/copyProdPSkus',
                params: JSON.stringify(searchData),
                contentType: 'application/json',
            }).then(res=>{
                let skuList = res || []
                layer.confirm(`查出父SKU ${skuList.length}条，点击确认复制`,{icon: 3}, function() {
                    copyTxtToClipboard(skuList.join(','),'textarea')
                });
            })
        }
    })
})

//已生成的详情框
function getlistingDetail_shopeeCNSCPublish (id) {
    var layer = layui.layer,
        laytpl = layui.laytpl,
        $ = layui.$,
        form = layui.form;
    // 用来存放分类属性信息 用来获取得到的值
    var attrDomNameArray
    layer.open({
        type: 1,
        title: '产品详情',
        btn: ['保存', '取消'],
        area: ['100%', '100%'],
        id: 'cnscpublish_detailLayerId',
        content: "加载中...",
        success: function (layero, index) {
            //只有带刊登的详情可以修改
            var listingStatus = $("#shopeeCNSCPublish_searchForm input[name=listingStatus]").val();
            if ('0' == listingStatus || '2' == listingStatus) {
                $(layero).find(".layui-layer-btn0").show();
            } else {
                $(layero).find(".layui-layer-btn0").hide();
            }

            layui.admin.load.show();
            $.ajax({
                url: ctx + '/shopee/shopeelisting/getlistingDetail.html',
                type: 'post',
                dataType: 'json',
                data: { id: id },
                success: function (returnData) {
                    layui.admin.load.hide();
                    if (returnData.code != "0000") {
                        layer.alert(returnData.msg, { icon: 2 });
                        return;
                    }
                    var salesSite = returnData.data.prodListingShopee.salesSite;

                    laytpl($("#shopeePulish_listDetailTpl").html()).render(returnData.data, function (html) {
                        $(layero).find('.layui-layer-content').html(html);
                        form.render();
                        // addEventTitleToggle('#cnscpublish_detailLayerId')
                        commonAddEventTitleToggle($('#cnscpublish_detailLayerId'),'shopee');
                        $('#shopeeCNSCPublish_extImg').sortable({
                            containment: "parent"
                        });
                        categoryInput_blur(true, returnData.data.prodListingShopee.attributes)
                            .then(data => {
                                attrDomNameArray = data
                            })

                        //监听类目改变
                        $("#shopeeCNSCPublish_cateId").change(function () {
                            categoryInput_blur(false)
                                .then(data => {
                                    attrDomNameArray = data
                                })
                        });
                        // 富文本
                        const { globalProductDescription = '', description = '', prodPId } = returnData.data.prodListingShopee || {}
                        detailDescWangEditor = renderEditor('shopeeCNSCPublish_detail_Desc', description, {prodPIds: [prodPId], platCode: 'shopee'} )
                        detailCnscDescWangEditor = renderEditor('shopeeCNSCPublish_detail_cnscDesc', globalProductDescription, {prodPIds: [prodPId], platCode: 'shopee'} )
                    });
                    //类目选择
                    //shopee类目树
                    $('#shopeeCNSCPublish_cateIdBtn').click(function () {
                        if (salesSite) {
                            layui.admin.itemCat_select('shopeeCNSCPublish_cateIdEvent',
                                'shopeeCNSCPublish_cateId',
                                'shopeeCNSCPublish_cateText',
                                "/shopee/shopeeCate/getShopeeCateList.html?siteId=" + salesSite,
                                "/shopee/shopeeCate/searchShopeeCate.html?siteId=" + salesSite
                            );
                        } else {
                            layer.msg("必须选择站点");
                        }
                    });

                    //查询推荐
                    $("#shopeeCNSCPublish_cateRecomm").click(function () {
                        var shopeeCNSCPublish_cateRecomm_index = layer.open({
                            type: 1,
                            title: '搜索shopee分类',
                            content: $("#shopeeCNSCPublish_cateSearchTpl").html(),
                            area: ['65%', '60%'],
                            success: function (layero, index) {
                                var searchKey = $("#shopeeCNSCPublish_cateSearchForm input[name='title']").val();
                                $('#shopeeCNSCPublish_cateSearchBtn').click(function () {
                                    layui.table.render({
                                        elem: '#shopeeCNSCPublish_cateSearchTable'
                                        , method: 'post'
                                        , url: ctx + '/shopee/shopeeExtraInfo/searchShopeeCate.html' //数据接口
                                        , where: {
                                            searchKey: searchKey,
                                            salesSite: salesSite
                                        }
                                        , method: 'post'
                                        , page: false
                                        , cols: [[ //表头
                                            { field: 'categoryId', title: '类目ID', width: '10%' },
                                            { field: 'fullCateNameTrans', title: '类目', width: '80%' },
                                            {
                                                field: '', title: '操作', width: '10%',
                                                templet: `<div><button class="layui-btn layui-btn-sm" lay-event="select">选择</button></div>`
                                            }
                                        ]]
                                        , done: function (res) {
                                            //初始化监听
                                            layui.table.on('tool(shopeeCNSCPublish_cateSearchTable)', function (obj) {
                                                var data = obj.data;
                                                var layEvent = obj.event;
                                                if (layEvent === 'select') {
                                                    $("#shopeeCNSCPublish_cateId").val(data.id);
                                                    $("#shopeeCNSCPublish_cateText").html(data.fullCateNameTrans);
                                                }
                                                layer.close(shopeeCNSCPublish_cateRecomm_index);
                                            });
                                        }
                                    });
                                });
                            },
                        });
                    });

                    shopeeCNSCPublish_extPic_exchangeLocal($("#shopeeCNSCPublish_editDetailForm .shopeeCNSCPublish_extPic_edit_local"));//初始化按钮
                    if (0 == listingStatus || 2 == listingStatus) {
                        $('.addShopeeSubListing').removeClass("disN");
                    }
                    else {
                        $('.addShopeeSubListing').addClass("disN");
                    }
                }
            });

        },
        yes: function (layero, index) {
            editListingProd_shopeeCNSCPublish(attrDomNameArray);
            // return false;
        }
    })
}

// 删除cnsc标题重复标签
function shopeeCNSCPublish_editDetailForm_delTag(dom){
    const tagDom = $(dom).parents('.tag_repeat')
    tagDom.remove()
    $('#shopeeCNSCPublish_editDetailForm').find('input[name=globalProductName]').data('tagliststr','')
}

//抽象出一个公共的checkbox全选和反全选的组件
function checkbox_no_all_shopeeCNSCPublish (tableId) {
    /*获取表头checkbox和美化后的元素*/
    var $ = layui.$

    //
    var listingStatus = $("#shopeeCNSCPublish_searchForm input[name=listingStatus]").val();
    var unlist_td = $('#' + tableId).find('.shopeeCNSCPublish_status').parent().parent().children('td:first-child');
    if (listingStatus == -2) {
        unlist_td.empty();
    }

    var th_checkbox = $('#' + tableId).find('thead th:first-child input[type="checkbox"]'),
        oth_checkbox = th_checkbox.next()
    /*获取表内checkbox和美化后的元素*/
    var td_checkbox = $('#' + tableId).find('tbody td:first-child input[type="checkbox"]'),
        otd_checkbox = td_checkbox.next()
    /*全选和反全选事件*/
    oth_checkbox.click(function () {
        /*获取checkbox的状态*/
        var isChecked = th_checkbox.prop('checked')
        if (isChecked) {
            otd_checkbox.addClass('layui-form-checked')
            td_checkbox.prop('checked', true)
        } else {
            otd_checkbox.removeClass('layui-form-checked')
            td_checkbox.prop('checked', false)
        }
    });
    otd_checkbox.click(function () {
        /*获取选中的checkbox的长度*/
        var len = $('#' + tableId).find('tbody td:first-child input[type="checkbox"]:checked').length;
        if (td_checkbox.length == len) {
            oth_checkbox.addClass('layui-form-checked')
            th_checkbox.prop('checked', true)
        } else {
            oth_checkbox.removeClass('layui-form-checked');
            th_checkbox.prop('checked', false)
        }

    })
}

function getSearchData_shopeeCNSCPublish () {
    var data = new Object();
    //默认查待生成
    data.listingStatus = $("#shopeeCNSCPublish_searchForm input[name=listingStatus]").val();

    if (data.listingStatus == 2) {
        data.listingRespMsg = $("#shopeeCNSCPublish_searchForm input[name=listingRespMsg]").val();
        data.listingRespCode = $("#shopeeCNSCPublish_searchForm select[name=listingRespCode]").val();
    }
    data.storeAcctId = $("#shopeeCNSCPublish_searchForm select[name=storeAcctId]").val();
    data.cateId = $("#shopeeCNSCPublish_searchForm input[name=cateId]").val();
    data.tag = $("#shopeeCNSCPublish_searchForm select[name=tag]").val();
    // data.specFlag = $("#shopeeCNSCPublish_searchForm select[name=specFlag]").val();
    // data.isSale = $("#shopeeCNSCPublish_searchForm select[name=isSale]").val();
    // data.filterZeroStock = $("#shopeeCNSCPublish_searchForm input[name=filterZeroStock]").prop('checked');
    // 
    data.warehouseId = $("#shopeeCNSCPublish_searchForm select[name=warehouseId]").val()
    data.isIncludeStockAll = $("#shopeeCNSCPublish_searchForm select[name=isIncludeStockAll]").val();
    data.stockAttrType = $("#shopeeCNSCPublish_searchForm select[name=stockAttrType]").val();
    data.stockMin = $("#shopeeCNSCPublish_searchForm input[name=stockMin]").val();
    data.stockMax = $("#shopeeCNSCPublish_searchForm input[name=stockMax]").val();

    data.saleStatusList = layui.formSelects.value('shopeeCNSCPublish_searchForm_saleStatusList', 'val')// 在售状态
    data.isPublish = $("#shopeeCNSCPublish_searchForm select[name=isPublish]").val();
    data.devType = $("#shopeeCNSCPublish_searchForm select[name=devType]").val();
    data.existListing = $("#shopeeCNSCPublish_searchForm select[name=existListing]").val();
    data.canSaleBool = $("#shopeeCNSCPublish_searchForm select[name=canSaleBool]").val();
    data.salesSite = $("#shopeeCNSCPublish_searchForm select[name=salesSite]").val();

    data.salesSort = $("#shopeeCNSCPublish_searchForm select[name=salesSort]").val();
    data.searchSalesType = $("#shopeeCNSCPublish_searchForm select[name=searchSalesType]").val();
    data.salesMin = $("#shopeeCNSCPublish_searchForm input[name=salesMin]").val();
    data.salesMax = $("#shopeeCNSCPublish_searchForm input[name=salesMax]").val();

    //物流属性
    data.existLogisAttrs = [];
    data.notExistLogisAttrs = [];
    var logisAttrContents = layui.formSelects.value("selectAttr_shopee_cnscPublish");

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
    var bizzOwnerContents = layui.formSelects.value("selectMan_shopee_cnscPublish");
    for (var i = 0; i < bizzOwnerContents.length; i++) {
        data.bizzOwnerIds.push(bizzOwnerContents[i].val);
    }
    //侵权状态
    data.tortBanListing = $("#shopeeCNSCPublish_searchForm select[name=tortBanListing]").val();

    //日期
    var timeStr = $("#shopeeCNSCPublish_searchForm input[name=time]").val();
    if (timeStr) {
        data.startTime = Date.parse(timeStr.split(" - ")[0] + " 00:00:00");
        data.endTime = Date.parse(timeStr.split(" - ")[1] + " 23:59:59");
    }
    data.timeType = $("#shopeeCNSCPublish_searchForm select[name=timeType]").val();
    data.cnTitle = "";
    data.enTitle = "";
    data.pSkus = [];
    data.sSkus = [];
    data.skuVagueFlag = $("#shopeeCNSCPublish_searchForm select[name=skuVagueFlag]").val()
    if ("cnTitle" == $("#shopeeCNSCPublish_searchForm select[name=searchType]").val()) {
        data.cnTitle = ($("#shopeeCNSCPublish_searchForm input[name=searchText]").val());
    }
    if ("enTitle" == $("#shopeeCNSCPublish_searchForm select[name=searchType]").val()) {
        data.enTitle = ($("#shopeeCNSCPublish_searchForm input[name=searchText]").val());
    }
    if ("pSkus" == $("#shopeeCNSCPublish_searchForm select[name=searchType]").val()) {
        var pSkustmp = $("#shopeeCNSCPublish_searchForm input[name=searchText]").val()
        if (pSkustmp.length > 0) {
            pSkustmp = pSkustmp.split(",");
            if (pSkustmp.length > 0) {
                for (i = 0; i < pSkustmp.length; i++) {
                    data.pSkus.push(pSkustmp[i]);
                }
            }
        }
    }
    if ("sSkus" == $("#shopeeCNSCPublish_searchForm select[name=searchType]").val()) {
        var sSkustmp = $("#shopeeCNSCPublish_searchForm input[name=searchText]").val();
        if (sSkustmp.length > 0) {
            sSkustmp = sSkustmp.split(",");
        }
        if (sSkustmp.length > 0) {
            for (i = 0; i < sSkustmp.length; i++) {
                data.sSkus.push(sSkustmp[i]);
            }
        }
    }
    //设置本人
    data.mackListingType = $("#shopee_cnscPublish_mack_listing_select_unqiue_id").val();

    // 类目
    data.cateOaIdList =JSON.parse($('#shop_cnsc_oaNewCates').val() || '[]')
    let cateOaIdListInput=$("#shopeeCNSCPublish_searchForm input[name=cateOaIdListInput]").val();
    data.cateOaIdListInput =cateOaIdListInput ? cateOaIdListInput.split(','):[]
    data.cateIdListCNSC =JSON.parse($('#shop_cnsc_cnscCates').val() || '[]')
    let cateIdListCNSCInput = $("#shopeeCNSCPublish_searchForm input[name=cateIdListCNSCInput]").val()
    data.cateIdListCNSCInput =cateIdListCNSCInput ? cateIdListCNSCInput.split(',') : [];
    // 重量
    data.weightMin = $("#shopeeCNSCPublish_searchForm input[name=weightMin]").val();
    data.weightMax = $("#shopeeCNSCPublish_searchForm input[name=weightMax]").val();
    if (![-2,2,4].includes(Number(data.listingStatus))) {
        data.cnscTitleRepeated =  $("#shopeeCNSCPublish_searchForm select[name=cnscTitleRepeated]").val();
    }
    // 失败原因
    if(data.listingStatus == -2){
        data.generateFailedTag = $('#shopee_cnscPublish_generateFailedTag').val()
        data.generateFailedErrMsg = $('#shopee_cnscPublish_generateFailedErrMsg').val()
    }
    //ztt20240130
    data.allProperties = $("#shopeeCNSCPublish_searchForm select[name=allProperties]").val();
    data.costMin = $("#shopeeCNSCPublish_searchForm input[name=costMin]").val();
    data.costMax = $("#shopeeCNSCPublish_searchForm input[name=costMax]").val();
    return data;
}


//请求需要包含参数,首次获取默认,使用分页控件修改属性,并使用修改后的属性,在页面中搜索,重置为第一页
var limitAllAppoint = 100;//每页显示数据条数
var currentPageAllAppoint = 1;//当前页数
var dataLength = 0;//数据总条数

// 搜索商品按钮事件
function shopee_cnscPublish_searchBtn () {
    // var storeAcctId = $("#shopeeCNSCPublish_searchForm select[name=storeAcctId]").val();
    //     // var listingStatus = $("#shopeeCNSCPublish_searchForm input[name=listingStatus]").val();
    //     // if((null==storeAcctId||''==storeAcctId)){
    //     //     layer.msg("店铺不得为空");
    //     //     return;
    //     // }
    currentPageAllAppoint = 1; //当点击搜索的时候，应该回到第一页
    dataLength = 0;
    search_shopeeCNSCPublish();
}

function search_shopeeCNSCPublish () {

    var form = layui.form,
        laypage = layui.laypage;
    var data = getSearchData_shopeeCNSCPublish();

    data.page = currentPageAllAppoint;
    data.limit = limitAllAppoint;
    /*未选店铺*/
    if (data.storeAcctId == null || data.storeAcctId == '') {
        if ((data.startTime == null || data.startTime == '') && (data.pSkus == null || data.pSkus == '')) {
            layer.msg("未选店铺,请至少选填 时间或模板SKU", { icon: 0 });
            return false;
        }
    }
    loading.show();
    $.ajax({
        url: ctx + '/shopee/shopeelisting/cnsc/querylist.html',
        type: "post",
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify(data),
        traditional: true,//确保数组传参正确
        success: function (returnData) {
            if (returnData.code != '0000') {
                loading.hide();
                layer.alert(returnData.msg, { icon: 2 });
                return;
            }

            var shopeeCol = {
                one: '<colgroup><col width="3%"/><col width="70px" /><col width="15%"/><col width="8%" /><col width="8%"/><col width="120px"/><col width="120px"/><col width="80px"/><col width="60px"/><col width="60px"/><col width="60px"/><col width="80px"/><col width="100px" /></colgroup>',
                twoThr: '<colgroup><col width="3%"/><col width="70px" /><col width="10%" /><col width="5%" /><col width="5%"/><col width="100px"/><col width="120px"/><col width="120px"/><col width="80px"/><col width="60px"/><col width="60px"/><col width="60px"/><col width="80px"/><col width="80px" /><col/><col width="80px"/><col width="80px"/></colgroup>',
                four: '<colgroup><col width="3%"/><col width="70px" /><col width="10%" /><col width="5%" /><col width="5%"/><col width="100px"/><col width="120px"/><col width="120px"/><col width="80px"/><col width="60px"/><col width="60px"/><col width="60px"/><col width="80px"/><col width="80px"/><col/><col/><col width="80px" /></colgroup>',
                five: '<colgroup><col width="3%"/><col width="70px" /><col width="10%" /><col width="5%" /><col width="5%"/><col width="100px"/><col width="120px"/><col width="120px"/><col width="80px"/><col width="60px"/><col width="60px"/><col width="60px"/><col width="80px"/><col width="80px"/><col/><col width="100px"/><col width="80px"/><col width="80px"/></colgroup>',
                rep: function (str) {
                    $('.shopeeCNSCPublish_table_head').find('.layui-table colgroup').remove()
                    $('.shopeeCNSCPublish_table_body').find('.layui-table colgroup').remove()
                    $('.shopeeCNSCPublish_table_head').find('.layui-table').prepend(str)
                    $('.shopeeCNSCPublish_table_body').find('.layui-table').prepend(str)
                }
            }
            dataLength = returnData.count;
            if(returnData.data && Array.isArray(returnData.data)){
                returnData.data = returnData.data.map(item=>({...item,listingStatus:Number(data.listingStatus)}))
            }
            html = template('shopeeCNSCPublish_tpl', returnData);
            $('#shopeeCNSCPublish_table').html(html);
            theadHandle().fixTh({ id: '#shopeeCNSCPublishCard', h: 150, dv1: '.layui-tab-title', dv2: '.shopeeCNSCPublish_table_head', dv3: '#shopee_btn_show_hide', i: 40 });
            form.render('checkbox');
            var listingStatus = $("#shopeeCNSCPublish_searchForm input[name=listingStatus]").val();
            //懒加载
            imageLazyload();

            // $("#shopee_cnscPublish .cateInfo").hide();
            $("#shopee_cnscPublish .timeClass").hide();
            $("#shopee_cnscPublish .listTiming").hide();
            $("#shopee_cnscPublish .listingTime").hide();
            $("#shopee_cnscPublish .creator").hide();
            $("#shopee_cnscPublish .shopeeCNSCPublish_publishBtn").hide();
            //仅刊登失败对应的展示,展示状态和失败原因
            if (-2 == listingStatus) {
                $("#shopee_cnscPublish .colspan_td").attr("colSpan", 6);
                $("#shopee_cnscPublish .storeSubSkuInfo").hide();
                $("#shopee_cnscPublish .detailInfoBtn").hide();
                $("#shopee_cnscPublish .failInfo").hide();
                $("#shopee_cnscPublish .sonListingStatus").hide();
                shopeeCol.rep(shopeeCol.one)
                $("#shopeeCNSCPublish_totalNum").text("商品(" + returnData.count + ")");
            }
            else if (0 == listingStatus) {
                $("#shopee_cnscPublish .colspan_td").attr("colSpan", 8);
                $("#shopee_cnscPublish .detailInfoBtn").show();
                // $("#shopee_cnscPublish .cateInfo").show();
                $("#shopee_cnscPublish .creator").show();
                shopeeCol.rep(shopeeCol.twoThr)
                $("#shopeeCNSCPublish_toListingNum").text("待刊登(" + returnData.count + ")");
                $('.shopeeCNSCPublish-unlist').on('mouseenter', function () {
                    var contentshow = $(this).next(".shopeeCNSCPublish-unlistreason").text();
                    if (!!contentshow) {
                        layer.tips(contentshow, $(this), {
                            tips: [2, 'red'],
                            area: ['40%', 'auto'],
                            time: 0,
                        });
                    }
                }).on('mouseleave', function () {
                    layer.closeAll("tips");
                });
            }
            else if (1 == listingStatus) {
                $("#shopee_cnscPublish .colspan_td").attr("colSpan", 8);
                $("#shopee_cnscPublish .timeClass").show();
                $("#shopee_cnscPublish .listingTime").show();
                $("#shopee_cnscPublish .detailInfoBtn").show();
                // $("#shopee_cnscPublish .cateInfo").show();
                $("#shopee_cnscPublish .creator").show();
                shopeeCol.rep(shopeeCol.four)
                $("#shopeeCNSCPublish_listingSucNum").text("刊登成功(" + returnData.count + ")");
            }
            else if (2 == listingStatus) {
                $("#shopee_cnscPublish .colspan_td").attr("colSpan", 8);
                $("#shopee_cnscPublish .timeClass").show();
                $("#shopee_cnscPublish .detailInfoBtn").show();
                // $("#shopee_cnscPublish .cateInfo").show();
                $("#shopee_cnscPublish .creator").show();
                $("#shopee_cnscPublish .listingTime").show();
                $("#shopee_cnscPublish .shopeeCNSCPublish_publishBtn").show();
                shopeeCol.rep(shopeeCol.five)
                //刊登失败
                $("#shopeeCNSCPublish_listingFailNum").text("刊登失败(" + returnData.count + ")");
            }
            else if (3 == listingStatus) {
                $("#shopee_cnscPublish .colspan_td").attr("colSpan", 8);
                $("#shopee_cnscPublish .timeClass").show();
                $("#shopee_cnscPublish .listTiming").show();
                $("#shopee_cnscPublish .detailInfoBtn").show();
                $("#shopee_cnscPublish .creator").show();
                shopeeCol.rep(shopeeCol.twoThr)
                $("#shopeeCNSCPublish_listingNum").text("刊登中(" + returnData.count + ")");
            } else if (4 == listingStatus) {
                $("#shopee_cnscPublish .colspan_td").attr("colSpan", 8);
                $("#shopee_cnscPublish .detailInfoBtn").show();
                $("#shopee_cnscPublish .creator").show();
                // $("#shopee_cnscPublish .cateInfo").show();
                shopeeCol.rep(shopeeCol.twoThr)
                $("#shopeeCNSCPublish_notInSale").text("已删除(" + returnData.count + ")");
            }

            if (-1 == listingStatus || -2 == listingStatus) {
                $("#shopee_cnscPublish .detailInfoBtn").hide();
            } else {
                $("#shopee_cnscPublish .detailInfoBtn").show();
            }
            //全选和反全选事件
            checkbox_no_all_shopeeCNSCPublish('shopeeCNSCPublish_table')
            toPage_shopeeCNSCPublish();
            //设置
            loading.hide();
        },
        error:function(){
            loading.hide();
        }
    });
}
function toPage_shopeeCNSCPublish () {
    laypage = layui.laypage;
    //处理分页
    laypage.render({
        elem: 'shopeeCNSCPublish_pagination',
        count: dataLength, //数据总数，从服务端得到
        layout: ['count', 'prev', 'page', 'next', 'limit', 'refresh', 'skip'],
        limits: [50, 100, 500, 1000],
        curr: currentPageAllAppoint,
        limit: limitAllAppoint,
        jump: function (obj, first) {
            currentPageAllAppoint = obj.curr;
            limitAllAppoint = obj.limit;
            //首次不执行
            if (!first) {
                search_shopeeCNSCPublish()
            }
        }
    });
}

function genToListingProd_shopeeCNSCPublish2 () {
    var layer = layui.layer,
        $ = layui.$;
    var checkData = $("#shopeeCNSCPublish_table tbody input[name=id]:checked");
    if (checkData.length > 0) {
        layer.open({
            type: 1,
            title: '生成刊登',
            btn: ['立即生成', '取消'],
            area: ['800px', '400px'],
            content: $('#shopeePulish_selWaterTp2').html(),
            success: function (layero, index) {
                layui.form.render()
                $("#shopeePulish_selWaterForm2 textarea[name=shopName]").text($("#shopeeCNSCPublish_searchForm select[name=storeAcctId]").find("option:selected").text())
            },
            yes: function (layero, index) {
                let storeAcctStr = $("#shopeePulish_selWaterForm2 textarea[name='shopName']").val().replace(/，/g, ",");//兼容中文逗号;
                var paramData = [], storeAcctArr = [];
                storeAcctArr = storeAcctStr.split(",")
                const filterConditionList = []
                $('#shopeePulish_selWaterForm2').find('input[name=filterCondition]:checked').each(function(){
                    filterConditionList.push($(this).val())
                })
                if (storeAcctStr.length > 0) {
                    for (var i = 0; i < checkData.length; i++) {
                        paramData.push(checkData[i].value);
                    }
                    loading.show();
                    $.ajax({
                        url: ctx + '/shopee/shopeelisting/cnsc/addStoreProds.html',
                        type: "post",
                        dataType: "json",
                        data: { "prodPIdArr": paramData, "storeAcctArr": storeAcctArr, allowBrSpecialCategoryId:false,filterCondition:filterConditionList.join()},
                        traditional: true,
                        success: function (returnData) {
                            if (returnData.code != "0000") {
                                layer.alert(returnData.msg, { icon: 2 });
                                loading.hide();
                            } else {
                                loading.hide();
                                const wrongPublishList = returnData.data.filter(item=>!item.success)
                                let needFresh = wrongPublishList.length !== returnData.data.length
                                if (wrongPublishList.length) {
                                    layer.open({
                                        type: 1,
                                        title: '信息提示',
                                        btn: ['确认', '关闭'],
                                        area: ['800px', '500px'],
                                        content: $('#shopeePulish_generateListTpl').html(),
                                        success:function(){
                                            layui.table.render({
                                                elem: "#shopeePulish_generateListTpl_table",
                                                id: "shopeePulish_generateListTpl_table",
                                                data: wrongPublishList,
                                                cols: [
                                                    [
                                                        { field: "storeAcct", title: "店铺名称", width: 150 },
                                                        { field: "prodPSku", title: "商品父SKU", width: 150 },
                                                        { field: "errorMessage", title: "提示信息"}
                                                    ],
                                                ],
                                                page: false,
                                            })
                                        },
                                        yes:function(){
                                            // 仅巴西站点other类重新刊登 brSpecialCategoryId为true
                                            const specialWrongList = wrongPublishList.filter(item=>item.brSpecialCategoryId)
                                            const specialWrongListProdId = specialWrongList.map(item=>item.prodPId)
                                            const specialWrongListStoreAcct = specialWrongList.map(item=>item.storeAcct)
                                            if(specialWrongList.length){
                                                commonReturnPromise({
                                                    url: ctx + '/shopee/shopeelisting/cnsc/addStoreProds.html',
                                                    type: "post",
                                                    params:{ "prodPIdArr": specialWrongListProdId.join(), "storeAcctArr": specialWrongListStoreAcct.join(), allowBrSpecialCategoryId:true,filterCondition:filterConditionList.join()}
                                                }).then((data)=>{
                                                    const wrongAgainPublishList = data.filter(item=>!item.success)
                                                    if(wrongAgainPublishList.length){
                                                        const msgStr = wrongAgainPublishList.map(item=>item.errorMessage).join("<br>")
                                                        layer.alert(msgStr, { icon: 7 });
                                                    } else {
                                                        layer.closeAll();
                                                        layer.msg('生成待刊登成功');
                                                    }
                                                })
                                            }else{
                                                layer.closeAll()
                                            }
                                        },
                                        end:function(){
                                            needFresh && $("#shopeeCNSCPublish_search").trigger("click")
                                        }
                                    })
                                }else {
                                    layer.closeAll();
                                    layer.msg('生成待刊登成功');
                                    needFresh && $("#shopeeCNSCPublish_search").trigger("click");
                                }
                            }
                        },
                    });
                } else {
                    loading.hide();
                    layer.msg("请至少填写一个店铺");
                }

            }
        });
    } else {
        loading.hide();
        layer.msg("请至少选择1条数据");
    }
}

// 批量修改cnsc标题
function batchEditTitle_shopeeCNSCPublish() {
    var data = $("#shopeeCNSCPublish_table tbody input[name=id]:checked");
    var paramData = [];
    if (data.length > 0) {
      for (var i = 0; i < data.length; i++) {
        paramData.push({ id: data[i].value });
      }
      commonReturnPromise({
        url: "/lms/shopee/shopeelisting/listGlobalItemNameListByIds",
        type: "post",
        params: JSON.stringify(paramData),
        contentType: "application/json;charset=utf-8",
      }).then((res) => {
        layer.open({
          type: 1,
          id:'shopeePulish_batchEditTitltTpl_Table_layer',
          title: "批量修改CNSC标题",
          area: ["1000px", "800px"],
          content: "加载中...",
          success: function (layero, index) {
            $(layero)
              .find(".layui-layer-content")
              .html($("#shopeePulish_batchEditTitltTpl").html());
            layui.table.render({
              elem: "#shopeePulish_batchEditTitltTpl_Table",
              id: "shopeePulish_batchEditTitltTpl_Table",
              data: res || [],
              cols: [
                [
                  { type: "checkbox" },
                  { field: "storeAcct", title: "店铺", width: 100 },
                  {
                    field: "salesSite",
                    title: "父SKU",
                    width: 150,
                    templet:
                      "<div><div>商品:{{d.pSku}}</div><div>店铺{{d.storePSku}}</div></div>",
                  },
                  {
                    title: "CNSC标题",
                    templet: `<div><textarea
                                      class="layui-textarea ifFocusInput"
                                      name="title"
                                      data-id="{{d.id}}"
                                      data-prodpid="{{d.prodPId}}"
                                      style="min-height:80px;"
                                      cols="40"
                                    >{{ d.globalProductName || '' }}</textarea
                                    ></div>`,
                  },
                  {
                    title: "操作结果",
                    width: 150,
                    field: "result",
                  },
                ],
              ],
              done: function () {
                layui.form.render();
                commonAddEventTitleToggle($('#shopeePulish_batchEditTitltTpl_Table').next(),'shopee');
              },
              limit: 9999999,
              page: false,
            });
            layui.form.render();
            // 一键应用
            $("#shopeePulish_batchEditTitltTpl_apply_btn").click(function () {
              let originTitle = $(
                "#shopeePulish_batchEditTitltTpl_old_title"
              ).val();
              let newTitle = $("#shopeePulish_batchEditTitltTpl_new_title").val();
              var trObj = layui.table.checkStatus(
                "shopeePulish_batchEditTitltTpl_Table"
              );
              if (trObj.data.length > 0) {
                var tableContainer = $(
                  "#shopeePulish_batchEditTitltTpl_Table"
                ).next();
                tableContainer
                  .find('tbody input[name="layTableCheckbox"]:checked')
                  .each(function (index, item) {
                    var tr = $(this).parents("tr");
                    // 原替换与修改合并，若原标题/描述后输入框内容存在，则替换，若原标题/描述后输入框内容为空，则修改；
                    // 若替换/修改输入框内输入下划线，则将第一个下划线视为原标题或原描述，在其前后整体拼接词；存在多个下划线时，除第一个下划线，其余均按照普通符号添加至标题/描述
                    // 标题
                    let title = tr.find("textarea[name=title]").val();
                    if (originTitle || newTitle) {
                      if (originTitle) {
                        if (!newTitle) {
                          // 有原替换值，无新替换值
                          title = title
                            .split(" ")
                            .filter(
                              (item) =>
                                item.toLowerCase() !== originTitle.toLowerCase()
                            )
                            .join(" "); // 去除替换值为单词的情况
                        }
                        title = replace_string(title, originTitle, newTitle);
                        // title = title.replace(new RegExp(originTitle + "\\s*", "g"), newTitle);
                      } else {
                        if (newTitle.includes("_")) {
                          title = replace_string(newTitle.replace("_", title));
                        } else {
                          title = replace_string(newTitle);
                        }
                      }
                      tr.find("textarea[name=title]").val(title);
                        // 修改显示字数
                        const showWordsLengthDom = tr.find("textarea[name=title]").next().find('.currentLength')
                        showWordsLengthDom.text(title.length)
                        if(title.length>180){
                            showWordsLengthDom.css({'color': 'red'})
                        }else{
                            showWordsLengthDom.css({'color': 'unset'})   
                        }
                    }
                  });
              } else {
                layer.msg("请选择需替换/修改商品数据");
              }
            });
            // 保存
            $("#shopeePulish_batchEditTitltTpl_save_btn").click(function () {
              const removeTag = $(
                "#shopeePulish_batchEditTitltTpl_removeTag_btn"
              ).prop("checked");
  
              var tableContainer = $(
                "#shopeePulish_batchEditTitltTpl_Table"
              ).next();
              const paramsList = [];
              tableContainer
                .find('tbody input[name="layTableCheckbox"]:checked')
                .each(function (index, item) {
                  const trDom = $(this).parents("tr");
                  const inputDom = trDom.find("textarea[name=title]");
                  paramsList.push({
                    id: inputDom.data("id"),
                    removeTag,
                    globalProductName: inputDom.val(),
                  });
                });
              if (!paramsList.length) {
                return layer.msg("请至少选择1条数据");
              }
            // 全球商品标题长度改为180
             const isOverLength = paramsList.some(v=>v.globalProductName.length > 180)
             if(isOverLength){
                return layer.msg("全球商品标题最大长度为180");
             }
              commonReturnPromise({
                url: "/lms/shopee/shopeelisting/updateListingTitleBatch",
                type: "put",
                contentType: "application/json;charset=utf-8",
                params: JSON.stringify(paramsList),
              }).then((res) => {
                let obj = {};
                (res || []).forEach((v) => {
                  obj[v.id] = v;
                });
                tableContainer
                  .find('tbody input[name="layTableCheckbox"]:checked')
                  .each(function (index, item) {
                    const trDom = $(this).parents("tr");
                    const trId = trDom.find("textarea[name=title]").data("id");
                    const trResultDom = trDom.find("td[data-field=result] div");
                    const resultStr = `<div class="${
                      obj[trId].success ? "fGreen" : "fRed"
                    }">${obj[trId].operateMessage}</div>`;
                    trResultDom.html(resultStr);
                  });
              });
            });
          },
          yes: function (index, layero) {
            $("#shopeeCNSCPublish_search").trigger("click");
          },
        });
      });
    } else {
      layui.layer.msg("请至少选择1条数据");
    }
  }

function deletelisting_shopeeCNSCPublish () {
    var data = $("#shopeeCNSCPublish_table tbody input[name=id]:checked");

    var paramData = [];
    if (data.length > 0) {
        for (var i = 0; i < data.length; i++) {
            paramData.push(data[i].value);
        }
        $.ajax({
            beforeSend: function () {
                loading.show();
            },
            url: ctx + '/shopee/shopeelisting/deletelisting.html',
            type: "post",
            dataType: "json",
            data: { "idArr": paramData },
            traditional: true,
            success: function (returnData) {
                if (returnData.code != "0000") {
                    layer.alert(returnData.msg, { icon: 2 });
                } else {
                    layer.msg('删除店铺商品成功');
                    $("#shopeeCNSCPublish_search").trigger("click");
                }
            },
            complete: function () {
                loading.hide();
            },
        });
    }
    else {
        layui.layer.msg("请至少选择1条数据");
    }
}


function exportListing_shopeeCNSCPublish () {
    var isExport = false;

    var request = {};
    var data;
    data = $("#shopeeCNSCPublish_table tbody input[name=id]:checked");
    var storeAcctId = $("#shopeeCNSCPublish_searchForm select[name=storeAcctId]").val();
    var listingStatus = $("#shopeeCNSCPublish_searchForm input[name=listingStatus]").val();
    // var isSale=$("#shopeeCNSCPublish_searchForm select[name=isSale]").val();
    request.storeAcctId = storeAcctId;
    // request.isSale=isSale;
    request.currentlistingStatus = listingStatus;
    var paramData = new Array();
    if (data.length > 0) {
        for (var i = 0; i < data.length; i++) {
            paramData.push(data[i].value);
        }
        request.ids = paramData;
        $.ajax({
            beforeSend: function () {
                loading.show();
            },
            url: ctx + '/shopee/shopeelisting/beforeExportListing.html',
            type: "post",
            dataType: "json",
            data: request,
            traditional: true,
            async: false,
            success: function (returnData) {
                if (returnData.code != "0000") {
                    layer.alert(returnData.msg, { icon: 2 });
                } else {
                    if (returnData.data) {
                        if (returnData.data.length > 0) {
                            layer.alert(returnData.data.join("<br>"), { icon: 7 });
                        }
                    }
                    isExport = true;
                }
            },
            complete: function () {
                loading.hide();
            }
        });
        if (isExport) {
            submitForm(request, ctx + '/shopee/shopeelisting/exportListing.html');
            $("#shopeeCNSCPublish_search").trigger("click");
        }
    }
    else {
        layui.layer.msg("请至少选择1条数据");
    }
}


function delImg_shopeeCNSCPublish (obj) {
    layer.confirm('您确认要删除图片？', { icon: 3, title: '提示' }, function (index) {
        $(obj).closest('li').remove();
        var imgTotalNum = $("#shopeeCNSCPublish_extImg li").length;
        $("#shopeePulish_listDetailTpl #shopeeCNSCPublish_curImgNum").text(imgTotalNum);
        layer.close(index);
    });
}

function setMainImg_shopeeCNSCPublish (obj) {
    var extImgUrl = $(obj).closest('.ImgDivOut').find('img').attr('src');
    var mainImgUrl = $("#shopeeCNSCPublish_mainImg .ImgDivIn").find('img').attr('src');
    $(obj).closest('.ImgDivOut').find('img').attr('src', mainImgUrl);
    $(obj).closest('.ImgDivOut').find('input').attr('value', mainImgUrl);
    $("#shopeeCNSCPublish_mainImg .ImgDivIn").find('img').attr('src', extImgUrl);
    $("#shopeeCNSCPublish_mainImg .ImgDivIn").find('input').attr('value', extImgUrl);

}

function editListingProd_shopeeCNSCPublish (attrDomNameArray) {
    var layer = layui.layer,
        laytpl = layui.laytpl,
        formSelects = layui.formSelects
    $ = layui.$;
    var detailData = {};
    detailData.id = $("#shopeeCNSCPublish_editDetailForm input[name=listingId]").val();
    detailData.storePSku = $("#shopeeCNSCPublish_editDetailForm input[name=storePSku]").val();
    detailData.listingStatus = $("#shopeeCNSCPublish_searchForm input[name=listingStatus]").val();
    detailData.name = $("#shopeeCNSCPublish_editDetailForm input[name=name]").val();
    // 全球商品标题长度改为180
    detailData.globalProductName = $("#shopeeCNSCPublish_editDetailForm input[name=globalProductName]").val();  //CNSC标题
    if(detailData.globalProductName.length > 180){
        return layer.msg(`全球商品标题最大长度为180`)
    }
    detailData.tagListStr = $("#shopeeCNSCPublish_editDetailForm input[name=globalProductName]").data('tagliststr');  //CNSC标题重复标签
    // detailData.description = $("#shopeeCNSCPublish_editDetailForm textarea[name=description]").val();
    // detailData.globalProductDescription = $("#shopeeCNSCPublish_editDetailForm textarea[name=globalProductDescription]").val(); //CNSC描述
     detailData.description =detailDescWangEditor.txt.html() //获取富文本的值;
    detailData.globalProductDescription = detailCnscDescWangEditor.txt.html() //获取富文本的值; //CNSC描述
    detailData.categoryId = $("#shopeeCNSCPublish_editDetailForm input[name=categoryId]").val();

    var mainImgUrl = $("#shopeeCNSCPublish_mainImg .ImgDivIn").find('input[name=mainImg]').val();
    var extImg = "";
    $("#shopeeCNSCPublish_extImg .ImgDivIn").each(function () {
        if ("" != extImg) {
            extImg += "|" + $(this).find('input[name=extImg]').val();
        } else {
            extImg = $(this).find('input[name=extImg]').val();
        }
    })

    //获取图片地址
    detailData.images = mainImgUrl + "|" + extImg;
    detailData.logistics = $("#shopeeCNSCPublish_editDetailForm input[name=logistics]").val();


    //添加子sku
    detailData.prodListingSubSkuShopees = getSkusInfo_shopeeCNSCPublish();
    //拼接获取类目属性
    let $shopeeCnscEditAssiDataForm = $("#shopeeCNSCPublish_detail_atributes")
    let specs = []
    if (attrDomNameArray && attrDomNameArray.length) {
        attrDomNameArray = distinctUniqueAttributeIdObjArray(attrDomNameArray)
        for (let obj of attrDomNameArray) {
            let originalAttributeName = obj.originalAttributeName
            let displayAttributeName = obj.displayAttributeName
            let attributeId = obj.attributeId
            let classname = obj.classname
            let inputType = obj.inputType
            let isMandatory = obj.isMandatory
            let formatType = obj.formatType
            let value
            let tempAttributeId = '' + attributeId
            let spec
            switch (inputType) {
                // 单选输入
                case 'COMBO_BOX':
                    value = $shopeeCnscEditAssiDataForm.find(classname).val()
                    if (isMandatory) {
                        if (value === '' || value === undefined) {
                            layer.msg(`${originalAttributeName}必填项不能为空`)
                            return
                        }
                    }
                    if (value !== '' && value !== undefined) {
                        let valueId = $shopeeCnscEditAssiDataForm.find(classname).next().find(`[value="${value}"]`).attr('data-id')
                        spec = {
                            displayAttributeName, originalAttributeName, attributeId, inputType, isMandatory, attrValues: [{
                                valueId: +valueId, originalValueName: value
                            }]
                        }
                        let $attributeUnit = $shopeeCnscEditAssiDataForm.find(`[name="unit-${attributeId}"]`)
                        spec.attributeUnit = $attributeUnit ? $attributeUnit.val() : ''
                        if (formatType === 'QUANTITATIVE' && spec.attributeUnit === '' && spec.attrValues.length > 0) {
                            layer.msg(`${displayAttributeName}请选择单位`, { icon: 2 })
                            return
                        }
                        specs.push(spec)
                    }
                    break
                // 单选
                case 'DROP_DOWN':
                    value = $shopeeCnscEditAssiDataForm.find(classname).val()
                    if (isMandatory) {
                        if (value === '' || value === undefined) {
                            layer.msg(`${originalAttributeName}必填项不能为空`)
                            return
                        }
                    }
                    if (value !== '' && value !== undefined) {
                        let valueId = $shopeeCnscEditAssiDataForm.find(classname).find(`[value="${value}"]`).attr('data-id')
                        spec = {
                            displayAttributeName, originalAttributeName, attributeId, inputType, isMandatory, attrValues: [{
                                valueId: +valueId, originalValueName: value
                            }]
                        }
                        let $attributeUnit = $shopeeCnscEditAssiDataForm.find(`[name="unit-${attributeId}"]`)
                        spec.attributeUnit = $attributeUnit ? $attributeUnit.val() : ''
                        if (formatType === 'QUANTITATIVE' && spec.attributeUnit === '' && spec.attrValues.length > 0) {
                            layer.msg(`${displayAttributeName}请选择单位`, { icon: 2 })
                            return
                        }
                        specs.push(spec)
                    }
                    break
                case 'TEXT_FILED':
                    value = $shopeeCnscEditAssiDataForm.find(classname).val()
                    if (isMandatory) {
                        if (value === '' || value === undefined) {
                            layer.msg(`${originalAttributeName}必填项不能为空`)
                            return
                        }
                    }
                    if (value !== '' && value !== undefined) {
                        spec = {
                            displayAttributeName, originalAttributeName, attributeId, inputType, isMandatory, attrValues: [{
                                valueId: 0, originalValueName: value
                            }]
                        }
                        let $attributeUnit = $shopeeCnscEditAssiDataForm.find(`[name="unit-${attributeId}"]`)
                        spec.attributeUnit = $attributeUnit ? $attributeUnit.val() : ''
                        if (formatType === 'QUANTITATIVE' && spec.attributeUnit === '' && spec.attrValues.length > 0) {
                            layer.msg(`${displayAttributeName}请选择单位`, { icon: 2 })
                            return
                        }
                        specs.push(spec)
                    }
                    break
                // 多选
                case 'MULTIPLE_SELECT_COMBO_BOX':
                case 'MULTIPLE_SELECT':
                    value = formSelects.value(tempAttributeId)
                    let $select = $shopeeCnscEditAssiDataForm.find(`[xm-select=${tempAttributeId}]`)
                    if (value && value.length > 0) {
                        let attrValues = []
                        for (let v of value) {
                            let valueOption = $select.find(`[value="${v.name}"]`)
                            let valueId = valueOption.attr('data-id')
                            let attrValue = {
                                valueId: +valueId, originalValueName: v.name
                            }
                            attrValues.push(attrValue)
                        }
                        if (isMandatory) {
                            if (attrValues.length === 0) {
                                layer.msg(`${originalAttributeName}必填项不能为空`)
                                return
                            }
                        }
                        spec = {
                            displayAttributeName, originalAttributeName, attributeId, inputType, isMandatory, attrValues
                        }
                        let $attributeUnit = $shopeeCnscEditAssiDataForm.find(`[name="unit-${attributeId}"]`)
                        spec.attributeUnit = $attributeUnit ? $attributeUnit.val() : ''
                        if (formatType === 'QUANTITATIVE' && spec.attributeUnit === '' && spec.attrValues.length > 0) {
                            layer.msg(`${displayAttributeName}请选择单位`, { icon: 2 })
                            return
                        }
                        specs.push(spec)
                    }
                    break
                default:
                    break
            }
        }
        // 存json
        // 封装specific
        specs = distinctUniqueAttributeIdObjArray(specs)
    }
    detailData.attributes = specs.length ? JSON.stringify(specs) : '';

    $.ajax({
        beforeSend: function () {
            loading.show();
        },
        url: ctx + '/shopee/shopeelisting/editListingDetail.html',
        type: "post",
        data: JSON.stringify(detailData),
        contentType: "application/json;charset=utf-8",
        success: function (returnData) {
            var resp = returnData
            if (resp.code === "0000") {
                layer.closeAll();
                layer.msg('修改成功');
                $("#shopeeCNSCPublish_search").trigger("click");
            } else {
                layer.alert(resp.msg, { icon: 2 });
            }
        },
        complete: function () {
            loading.hide();
        },
    });
}

var shopeeCNSCPublish_imgData = {
    img: {
        head: '',
        tpl: '<li draggable="false" style="width: 150px;margin-bottom:40px;border:1px solid #ccc;overflow:hidden">' +
            '<div class="ImgDivOut">' +
            '<div class="ImgDivIn" style="width:150px;height:150px;">' +
            '<input type="hidden" name="extImg" value="&{url}">' +
            '<img width="150" height="150" src="&{url}">' +
            '</div>' +
            '<div class="imgDivDown" style="width:150px">' +
            '<a onclick="setMainImg_shopeeCNSCPublish(this);" href="javascript:void(0);" style="float:left;\
color: #73a1bf;">设为主图</a><a onclick="delImg_shopeeCNSCPublish(this);" href="javascript:void(0);" style="float:right;\
color: #73a1bf;">移除</a>'+
            '</div></div></li>'
    }
}

function getSkusInfo_shopeeCNSCPublish () {
    var subSkus = [];
    var tdArr;
    var varient;
    $("#shopeeCNSCPublish_SubSkuInfo").find("tr").each(function () {
        tdArr = $(this).children();
        varient = {};
        varient.id = tdArr.eq(0).text();
        varient.storeSSku = tdArr.find('input[name=storeSSku]').val();
        // varient.name = tdArr.eq(3).find('input').val();
        // varient.nameStyle = tdArr.eq(4).find('input').val();
        varient.oaSize = tdArr.eq(3).find('input').val();
        varient.oaColor = tdArr.eq(4).find('input').val();
        varient.oaStyle = tdArr.eq(5).find('input').val();
        varient.price = tdArr.eq(6).find('input').val();
        varient.globalProductVariationPrice = tdArr.eq(7).find('input').val();
        varient.stock = tdArr.eq(8).find('input').val();
        varient.subImgUrl = tdArr.find('img.shopeeCNSCPublish_subImgUrl').attr('data-original');
        subSkus.push(varient);
    });
    return subSkus;
}

function shopeeListingCNSCPublish (id) {
    var layer = layui.layer,
        $ = layui.$;
    var ids = [];
    if (id) {
        ids.push(id);
    } else {
        //生成多个
        $("#shopeeCNSCPublish_table tbody input[name=id]:checked").each(function () {
            ids.push($(this).val());
        });
        if (ids.length < 1) {
            layer.msg("未选中商品");
            return;
        }
    }

    layer.open({
        type: 1,
        title: '立即刊登',
        btn: ['立即刊登'],
        area: ['500px', '500px'],
        content: "加载中...",
        success: function (layero, index) {
            $(layero).find('.layui-layer-content').html($("#shopeePulish_publishNowTpl").html());
            var storeAcctId = $("#shopeeCNSCPublish_searchForm select[name=storeAcctId]").val();
            $.ajax({
                type: 'post',
                url: ctx + "/shopee/shopeeDiscount/getAllPromotion.html",
                data: { 'storeAcctId': storeAcctId },
                page: false,
                async: false,
                dataType: 'json',
                success: function (data) {
                    if (data.data) {
                        var promotion_arr = JSON.parse(JSON.stringify(data.data));
                        for (var i = 0; i < promotion_arr.length; i++) {
                            $("#shopeePulish_publishNowForm select[name=stortAcctPromotion]").append("<option value='" + promotion_arr[i].discountId + "'>" + promotion_arr[i].discountName + "</option>");
                        }
                    }
                    layui.form.render('select');
                }
            })
        },
        yes: function (index, layero) {
            loading.show();
            var listingStatus = $("#shopeeCNSCPublish_searchForm input[name=listingStatus]").val();
            var paramData = new Array();
            if (id) {
                paramData.push(id);
            }
            else {
                var data = $("#shopeeCNSCPublish_table tbody input[name=id]:checked");
                if (data.length > 0) {
                    for (var i = 0; i < data.length; i++) {
                        paramData.push(data[i].value);
                    }
                }
            }
            var promotionId = $("#shopeePulish_publishNowForm select[name=stortAcctPromotion]").val();

            if (paramData.length > 0) {
                $.ajax({
                    url: ctx + '/shopee/shopeelisting/cnsc/publishShopeeListing.html',
                    type: "post",
                    dataType: "json",
                    data: { "ids": paramData, "listingStatus": listingStatus, "promotionId": promotionId },//是否子sku重发
                    traditional: true,
                    success: function (returnData) {
                        if (returnData.code != "0000") {
                            layer.alert(returnData.msg, { icon: 2 });
                        } else {
                            layer.msg('商品成功进入刊登流程');    //?
                            layer.close(index);
                            $("#shopeeCNSCPublish_search").trigger("click");
                        }
                    },
                    complete: function () {
                        loading.hide();
                    },
                });
            }
            else {
                layui.layer.msg("请至少选择1条数据");
                loading.hide();
                return;
            }
        }
    });
}

// 如果time2大于time1 返回true 否则 返回false
function compareTime (time1, time2) {
    if (time_to_sec(time2) - time_to_sec(time1) > 0) {
        return true;
    }
    return false;
}

//将时分秒转为时间戳
function time_to_sec (time) {
    if (time !== null) {
        let s = "";
        let hour = time.split(":")[0];
        let min = time.split(":")[1];
        let sec = time.split(":")[2];
        s = Number(hour * 3600) + Number(min * 60) + Number(sec);
        return s;
    }
}

//定时刊登商品
function shopeeCNSCPublish_OnTiming () {
    var layer = layui.layer,
        $ = layui.$;
    var ids = [];
    //生成多个
    $("#shopeeCNSCPublish_table tbody input[name=id]:checked").each(function () {
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
        area: ['500px', '80%'],
        content: $('#shopeePulish_listTimingTpl').html(),
        success: function (layero, index) {
            layui.form.on('switch(shopeePulish_autoProm_filter)', function (data) {
                if (data.elem.checked) {
                    $(".shopeePulish_show_promotionIdList").removeClass("disN");
                    $(".shopeePulish_show_promotionId").addClass("disN");
                } else {
                    $(".shopeePulish_show_promotionIdList").addClass("disN");
                    $(".shopeePulish_show_promotionId").removeClass("disN");
                }
            });

            //时间选择器
            layui.laydate.render({
                elem: '#shopeePulish_listTiming'
                , type: 'datetime'
                , format: 'yyyy-MM-dd HH:mm'
            });

            layui.laydate.render({
                elem: '#shopeePulish_canPublish_listTiming'
                , type: 'time'
                , range: true
                , done: function (value, date) {
                    let startTime = value.split(" - ")[0],
                        endTime = value.split(" - ")[1]
                    if (!compareTime(startTime, endTime)) {
                        $("#shopeePulish_canPublish_listTiming").val("")
                        layer.msg(value + " 时间有误", {
                            zIndex: 2147483647
                        })
                        form.render()
                    }
                }
            });

            var storeAcctId = $("#shopeeCNSCPublish_searchForm select[name=storeAcctId]").val();

            $.ajax({
                type: 'post',
                url: ctx + "/shopee/shopeeDiscount/getAllPromotion.html",
                data: { 'storeAcctId': storeAcctId },
                page: false,
                async: false,
                dataType: 'json',
                success: function (data) {
                    if (data.data) {
                        var promotion_arr = JSON.parse(JSON.stringify(data.data));
                        var promInfoList = [];
                        for (var i = 0; i < promotion_arr.length; i++) {
                            $("#shopeePulish_listTimingForm select[name=stortAcctPromotion]").append("<option value='" + promotion_arr[i].discountId + "'>" + promotion_arr[i].discountName + "</option>");
                            promInfoList.push({ name: promotion_arr[i].discountName, value: promotion_arr[i].discountId });
                        }

                        layui.formSelects.data('stortAcctPromotionList', 'local', { arr: promInfoList });

                    }
                    layui.form.render('select');
                }
            })

            layui.form.render('checkbox');

        },
        yes: function (index, layero) {
            var listTiming = $(layero).find("input[name=listTiming]").val();
            var listInterval = $(layero).find("input[name=listInterval]").val();
            var autoProm = $(layero).find("input[name=autoProm]").prop("checked");
            var promotionId = $(layero).find("select[name=stortAcctPromotion]").val();

            var canPublishListTimingStr = $(layero).find("input[name=canPublishListTiming]").val();
            var canPublishStartTime;
            var canPublishEndTime;
            if (canPublishListTimingStr) {
                canPublishStartTime = canPublishListTimingStr.split(" - ")[0];
                canPublishEndTime = canPublishListTimingStr.split(" - ")[1];
            }
            var promotionIdList = [];
            var tempPromIdList = layui.formSelects.value("stortAcctPromotionList");
            for (var i = 0; i < tempPromIdList.length; i++) {
                promotionIdList.push(tempPromIdList[i].val);
            }
            if (autoProm) {
                if (promotionIdList <= 0) {
                    layer.msg("自动分配促销,需要指定促销方式");
                    return;
                }
            }
            if (listTiming) {

            }
            else {
                layer.msg("定时刊登开始时间不能为空");
                return;
            }
            loading.show();
            $.ajax({
                type: "post",
                url: ctx + "/shopee/shopeelisting/listtiming.html",
                dataType: "json",
                contentType: 'application/json',
                data: JSON.stringify({
                    idList: ids,
                    listTiming: new Date(listTiming).getTime(),
                    listInterval: listInterval,
                    promotionId: promotionId,
                    autoProm: autoProm,
                    promotionIdList: promotionIdList,
                    canPublishStartTime: canPublishStartTime,
                    canPublishEndTime: canPublishEndTime,
                }),
                success: function (returnData) {
                    loading.hide();
                    if (returnData.code != "0000") {
                        layer.msg(returnData.msg);
                    } else {
                        layer.msg("定时刊登成功");
                        layer.close(index);
                        $("#shopeeCNSCPublish_search").trigger("click");
                    }
                }
            });
        }
    })
}

//取消定时刊登商品
function shopeeCNSCPublish__canclePublishOnTiming () {
    var layer = layui.layer,
        $ = layui.$;
    var ids = [];
    //生成多个
    $("#shopeeCNSCPublish_table tbody input[name=id]:checked").each(function () {
        ids.push($(this).val());
    });
    if (ids.length < 1) {
        layer.msg("未选中商品");
        return;
    }

    loading.show();
    $.ajax({
        type: "post",
        url: ctx + "/shopee/shopeelisting/cancleListTiming.html",
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
                $("#shopeeCNSCPublish_search").trigger("click");
            }
        }
    });
}

//移除子listing,仅删除样式
function removeShopeeSubListing (obj) {
    var listingStatus = $("#shopeeCNSCPublish_searchForm input[name=listingStatus]").val();
    if (listingStatus == 0 || listingStatus == 2) {
        $(obj).closest('tr').remove();
        var skuImgNum = 0;
    }
}

//添加字sku
function addShopeeSubListing () {
    var tr = '<tr>';
    tr += '<td hidden></td>\
            <td><img width="60" height="60" data-original="" src="" class="shopeeCNSCPublish_subImgUrl img_show_hide lazy b1"></td>\
            <td class="shopeeStoreSSku"><input type="text"  name="storeSSku" data-sku="" class="layui-input" value=""></td>\
        <td><input type="text" class="layui-input shopeeCNSCPublish_subSize" value=""></td>\
        <td><input type="text" class="layui-input shopeeCNSCPublish_subColor" value=""></td>\
        <td><input type="text" class="layui-input shopeeCNSCPublish_subStyle" value=""></td>\
        <td><input type="number" class="layui-input" value=""></td>\
        <td><input type="number" class="layui-input" value=""></td>\
        <td><input type="number" class="layui-input" value=""></td>\
        <td><button type="button" class="layui-btn layui-btn-sm" onclick="removeShopeeSubListing(this)">移除</button>\
        <button type="button" class="layui-btn layui-btn-sm" onclick="shopeeCNSCPublish_editVarPic(this)">修改图片</button></td>\
        ';
    tr += '</tr>';
    $('#shopeeCNSCPublish_SubSkuInfo').append(tr);
}

//重新刊登
function shopeeCNSCPublish_rePublish (id) {
    var listingStatus = $("#shopeeCNSCPublish_searchForm input[name=listingStatus]").val();
    var paramData = new Array();
    if (id) {
        paramData.push(id);
    }
    else {
        var data = $("#shopeeCNSCPublish_table tbody input[name=id]:checked");
        if (data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                paramData.push(data[i].value);
            }
        }
    }
    if (paramData.length < 1) {
        layui.layer.msg("请至少选择1条数据");
        return;
    } else {

        $.ajax({
            beforeSend: function () {
                loading.show();
            },
            url: ctx + '/shopee/shopeelisting/rePublish.html',
            type: "post",
            dataType: "json",
            data: { "ids": paramData },//是否子sku重发
            traditional: true,
            success: function (returnData) {
                if (returnData.code != "0000") {
                    layer.alert(returnData.msg, { icon: 2 });
                } else {
                    layer.msg('商品已标记为待刊登');
                    $("#shopeeCNSCPublish_search").trigger("click");
                }
            },
            complete: function () {
                loading.hide();
            },
        });
    }
}


/**详情页的批量修改颜色尺寸样式 */
function shopeeCNSCPublishFailColorStyleSize (obj) {
    let parentDom = $('#shopeeCNSCPublish_batchSku')
    const oacolor =  parentDom.find('input[name=oacolor]').val()
    const oastyle =  parentDom.find('input[name=oastyle]').val()
    const oasize =  parentDom.find('input[name=oasize]').val()
    if (!oacolor && !oastyle && !oasize ) {
        layer.alert('请填写修改值!');
        return false;
    }
    $('#shopeeCNSCPublish_SubSkuInfo tr').each(function(){
        if(oacolor){
            $(this).find('.shopeeCNSCPublish_subColor').val(oacolor)
        }
        if(oastyle){
            $(this).find('.shopeeCNSCPublish_subStyle').val(oastyle)
        }
        if(oasize){
            $(this).find('.shopeeCNSCPublish_subSize').val(oasize)
        }
    })
    parentDom.find('input[name=oacolor]').val('')
    parentDom.find('input[name=oastyle]').val('')
    parentDom.find('input[name=oasize]').val('')
}
/**
* 绑定类目属性焦点事件
* @param isListingDetail 是否查listing详情,按详情装配属性
*/
async function categoryInput_blur (isListingDetail, attributes) {
    var categoryId = $("#shopeeCNSCPublish_editDetailForm input[name=categoryId]").val();
    const data = await commonReturnPromise({
        url: ctx + `/shopee/shopeeCnscExtraInfo/listShopeeCateCnscSpecifics/${categoryId}`,
    })
    let attrLst = data.sort(sortBy('isMandatory', false))
    let $shopeeCnscEditAssiDataForm = $("#shopeeCNSCPublish_detail_atributes")
    $shopeeCnscEditAssiDataForm.empty()
    let attrDomNameArray = []
    let attValueHtml = ''
    var form = layui.form
    var formSelects = layui.formSelects
    for (let attr of attrLst) {
        // 展示元素
        let isMandatory = attr.isMandatory, // 属性名
            originalAttributeName = attr.originalAttributeName, // 展示属名
            displayAttributeName = attr.displayAttributeName, // Json字符串
            attributeValueList_json = attr.attributeValueList, // 输入类型
            inputType = attr.inputType, // 值类型
            inputValidationType = attr.inputValidationType, // 属性符号
            attributeUnitListJson = attr.attributeUnit, formatType = attr.formatType, // 属性id
            attributeId = attr.attributeId
        let isMust = isMandatory === 1
        let attributeValues = []
        if (attributeValueList_json !== '') {
            attributeValues = JSON.parse(attributeValueList_json)
        }
        let obj = {
            attributeId,
            inputType,
            formatType,
            displayAttributeName,
            isMandatory: isMandatory === 1,
            originalAttributeName: originalAttributeName,
            classname: `[name=${attributeId}]`
        }
        attrDomNameArray.push(obj)
        let attributeUnitList = []
        if (formatType === 'QUANTITATIVE') {
            attributeUnitList = JSON.parse(attributeUnitListJson)
        }
        // 根据不同类型进行动态渲染
        switch (inputType) {
            case 'COMBO_BOX':
                attValueHtml += '<div class="layui-form-item">'
                if (isMust) {
                    attValueHtml += '<label class="layui-form-label label-attr-width"><font class="fRed">*</font>' + displayAttributeName + '(' + originalAttributeName + ')' + '</label>'
                } else {
                    attValueHtml += '<label class="layui-form-label label-attr-width">' + displayAttributeName + '(' + originalAttributeName + ')' + '</label>'
                }
                attValueHtml += '<div class="layui-input-inline">' + '<input type="text" class="layui-input" name="' + attributeId + '" list="attrValueList' + attributeId + '">' + '<datalist id="attrValueList' + attributeId + '">'
                for (let item of attributeValues) {
                    attValueHtml += '<option data-id="' + item.valueId + '" value="' + item.originalValueName + '">' + item.displayValueName + '</option>'
                }
                attValueHtml += '</datalist></div>'
                if (formatType === 'QUANTITATIVE') {
                    attValueHtml += '<div class="layui-input-inline" style="width: 100px"><select name="unit-' + attributeId + '"><option value="">单位</option>'
                    for (let unit of attributeUnitList) {
                        attValueHtml += '<option  value="' + unit + '">' + unit + '</option>'
                    }
                    attValueHtml += '</select></div>'
                }
                attValueHtml += '</div>'
                break
            case 'DROP_DOWN':
                attValueHtml += '<div class="layui-form-item">'
                if (isMust) {
                    attValueHtml += '<label class="layui-form-label label-attr-width"><font class="fRed">*</font>' + displayAttributeName + '(' + originalAttributeName + ')' + '</label>'
                } else {
                    attValueHtml += '<label class="layui-form-label label-attr-width">' + displayAttributeName + '(' + originalAttributeName + ')' + '</label>'
                }
                attValueHtml += '<div class="layui-input-inline">' + '<select name="' + attributeId + '"><option value="">请选择</option>'
                for (let item of attributeValues) {
                    attValueHtml += '<option data-id="' + item.valueId + '" value="' + item.originalValueName + '">' + item.displayValueName + '</option>'
                }
                attValueHtml += '</select></div>'
                if (formatType === 'QUANTITATIVE') {
                    attValueHtml += '<div class="layui-input-inline" style="width: 100px"><select name="unit-' + attributeId + '"><option value="">单位</option>'
                    for (let unit of attributeUnitList) {
                        attValueHtml += '<option  value="' + unit + '">' + unit + '</option>'
                    }
                    attValueHtml += '</select></div>'
                }
                attValueHtml += '</div>'
                break
            case 'TEXT_FILED':
                attValueHtml += '<div class="layui-form-item">'
                if (isMust) {
                    attValueHtml += '<label class="layui-form-label label-attr-width"><font class="fRed">*</font>' + displayAttributeName + '(' + originalAttributeName + ')' + '</label>'
                } else {
                    attValueHtml += '<label class="layui-form-label label-attr-width">' + displayAttributeName + '(' + originalAttributeName + ')' + '</label>'
                }
                attValueHtml += '<div class="layui-input-inline">'
                switch (inputValidationType) {
                    case 'INT_TYPE':
                        attValueHtml += '<input  name="' + attributeId + '" value="" type="number" class="layui-input canChangeInput" lay-verify="Integer"/>'
                        break
                    case 'FLOAT_TYPE':
                        attValueHtml += '<input  name="' + attributeId + '" value="" type="number" class="layui-input canChangeInput" />'
                        break
                    default:
                        attValueHtml += '<input  name="' + attributeId + '" value="" type="text" class="layui-input canChangeInput" />'
                        break
                }
                attValueHtml += '</div>'
                if (formatType === 'QUANTITATIVE') {
                    attValueHtml += '<div class="layui-input-inline" style="width: 100px"><select name="unit-' + attributeId + '"><option value="">单位</option>'
                    for (let unit of attributeUnitList) {
                        attValueHtml += '<option  value="' + unit + '">' + unit + '</option>'
                    }
                    attValueHtml += '</select></div>'
                }
                attValueHtml += '</div>'
                break
            case 'MULTIPLE_SELECT_COMBO_BOX':
            case 'MULTIPLE_SELECT':
                attValueHtml += '<div class="layui-form-item">'
                if (isMust) {
                    attValueHtml += '<label class="layui-form-label label-attr-width"><font class="fRed">*</font>' + displayAttributeName + '(' + originalAttributeName + ')' + '</label>'
                } else {
                    attValueHtml += '<label class="layui-form-label label-attr-width">' + displayAttributeName + '(' + originalAttributeName + ')' + '</label>'
                }
                attValueHtml += '<div class="layui-input-inline">' + ' <select  name="' + attributeId + '" xm-select="' + attributeId + '" xm-select-search xm-select-search-type="dl" xm-select-skin="normal"><option value="">请选择</option>'
                for (let item of attributeValues) {
                    attValueHtml += '<option data-id="' + item.valueId + '" value="' + item.originalValueName + '" >' + item.displayValueName + '</option>'
                }
                attValueHtml += '</select></div>'
                if (formatType === 'QUANTITATIVE') {
                    attValueHtml += '<div class="layui-input-inline" style="width: 100px"><select name="unit-' + attributeId + '"><option value="">单位</option>'
                    for (let unit of attributeUnitList) {
                        attValueHtml += '<option  value="' + unit + '">' + unit + '</option>'
                    }
                    attValueHtml += '</select></div>'
                }
                attValueHtml += '</div>'
                break
            default:
                break
        }
    }
    $shopeeCnscEditAssiDataForm.html(attValueHtml)
    formSelects.render()
    if (isListingDetail && !!attributes) {
        let hasAddSpecificList = JSON.parse(attributes)
        for (let attr of attrLst) {
            let tempAttributeId = '' + attr.attributeId
            for (let item of hasAddSpecificList) {
                if (item.attributeId === attr.attributeId) {
                    let tmp_inputType = attr.inputType
                    let value_list = item.attrValues
                    let $attributeUnit
                    switch (tmp_inputType) {
                        // 单选输入
                        case 'DROP_DOWN':
                        case 'COMBO_BOX':
                        case 'TEXT_FILED':
                            $shopeeCnscEditAssiDataForm.find(`[name=${tempAttributeId}]`).val(value_list[0].originalValueName)
                            $attributeUnit = $shopeeCnscEditAssiDataForm.find(`[name="unit-${tempAttributeId}"]`)
                            if ($attributeUnit) {
                                $attributeUnit.val(item.attributeUnit)
                            }
                            break
                        // 多选
                        case 'MULTIPLE_SELECT_COMBO_BOX':
                        case 'MULTIPLE_SELECT':
                            let m_valueOptions = []
                            $attributeUnit = $shopeeCnscEditAssiDataForm.find(`[name="unit-${tempAttributeId}"]`)
                            value_list.forEach(elem => {
                                let _originalValueName = item.attributeUnit ? elem.originalValueName.split(item.attributeUnit)[0] : elem.originalValueName
                                m_valueOptions.push(_originalValueName)
                            })
                            if ($attributeUnit) {
                                $attributeUnit.val(item.attributeUnit)
                            }
                            formSelects.value(`${tempAttributeId}`, m_valueOptions)
                            break
                        default:
                            break
                    }
                }
            }
        }
    }
    form.render()
    return attrDomNameArray
}

// 2-2.辅图网络图片
function addExtPic_shopeeCNSCPublish () {
    var index = layer.open({
        type: 1,
        title: '辅图网络图片',
        area: ['800px', '300px'],
        content: '<div class="p20"><textarea class="layui-textarea" id="shopeeCNSCPublish_netImgUrl4" placeholder="请填写URL,多个地址用回车换行"></textarea></div>',
        btn: ['确定', '关闭'],
        yes: function () {
            //网络主图处理
            var url = $.trim($("#shopeeCNSCPublish_netImgUrl4").val());
            shopeeCNSCPublish_downImgFromUrl4(url);//这个函数在最下面,然后ajax那里的话,我不知道传什么数据data,返回的类型是啥,就没改,只改了一个URL
            $("#shopeeCNSCPublish_netImgUrl4").val("");
            layer.close(index);
        }
    })
}

//网络辅图处理
function shopeeCNSCPublish_downImgFromUrl4 (url) {
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
    // var skuImgNum=0;
    // $("#shopeeCNSCPublish_editDetailForm .img_ssku_uri").each(function (){
    //     if($(this).text()){
    //         skuImgNum++;
    //     }
    // });

    var imgTotalNum2 = $("#shopeeCNSCPublish_extImg li").length;
    //辅图最多8张
    var remainNum2 = 8 - imgTotalNum2;
    if ((urlArray.length + imgTotalNum2) > 8) {
        remainNum2 = remainNum2 < 0 ? 0 : remainNum2;
        layer.msg("最大支持共" + 8 + "张辅图,您最多还能上传" + remainNum2 + "张!", { icon: 7 });
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
        shopeeCNSCPublish_showImg4(urlArray[i]);
    }
}

function shopeeCNSCPublish_showImg4 (url) {
    var tpl = '';
    tpl += shopeeCNSCPublish_imgData['img']['tpl'];
    //layer.msg(url);
    var div = tpl.replace(/&{url}/g, url);
    $('#shopeeCNSCPublish_extImg').append(div);
    var imgTotalNum = $("#shopeeCNSCPublish_extImg li").length;
    $("#shopeeCNSCPublish_editDetailForm #curImgNum").text(imgTotalNum);
}

function addTplPic_shopeeCNSCPublish(){
    var imgTotalNum2 = $("#shopeeCNSCPublish_extImg li").length;
    //辅图最多8张
    const limit = 8
    const prodSSkus = Array.from($("#shopeeCNSCPublish_SubSkuInfo tr").map((_, item) => $(item).find('input[name=storeSSku]').data('ssku')))
    let param = {prodSSkus}
    const params = {
        param,
        limit,
        existImgs:imgTotalNum2,
        cb: function (tplUrlList) {
            if (Array.isArray(tplUrlList) && tplUrlList.length) {
                tplUrlList.forEach(item=>{
                    // 生成展示图片
                    shopeeCNSCPublish_showImg4(item);
                })
            }
        },
    }
    comPickImageTpl(params,'shopee')
}

//已生成的详情框
function shopeeCNSCPublish__copy_listing () {
    var layer = layui.layer,
        laytpl = layui.laytpl,
        $ = layui.$,
        form = layui.form;
    var ids = [];
    $("#shopeeCNSCPublish_table tbody input[name=id]:checked").each(function () {
        ids.push($(this).val());
    });
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
        end: function (index, layero) { },
        yes: function (index, layero) {

            var copyStore = layui.formSelects.value("copyStore_shopeeCNSCPublish");
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
                url: ctx + '/shopee/shopeelisting/copyListing.html',
                contentType: "application/json;charset=utf-8",
                dataType: "json",
                data: JSON.stringify(detailData),
                success: function (returnData) {
                    if (returnData.code != "0000") {
                        layer.alert(returnData.msg, { icon: 2 });
                        return;
                    } else {
                        layer.closeAll();
                        layer.msg("复制成功");
                        $("#shopeeCNSCPublish_search").trigger("click");
                    }
                }
            })
        },
        success: function (layero, index) {
            var ids = [];
            $("#shopeeCNSCPublish_table tbody input[name=id]:checked").each(function () {
                ids.push($(this).val());
            });
            if (ids.length < 1) {
                layer.msg("必须先选中商品");
                return false;
            }

            $.ajax({
                type: 'post',
                url: ctx + '/sys/liststore.html',
                dataType: 'json',
                data: {
                    roleNames: "shopee专员",
                    platCode: "shopee"
                },
                traditional: true,
                success: function (returnData) {
                    if (returnData.code != "0000") {
                        layer.alert(returnData.msg, { icon: 2 });
                        return;
                    }
                    laytpl($("#shopeePulish_copyListingTpl").html()).render(returnData.data, function (html) {
                        $(layero).find('.layui-layer-content').html(html);
                        layui.formSelects.render('copyStore_shopeeCNSCPublish');
                    });
                    $.ajax({
                        type: 'post',
                        url: ctx + '/shopee/shopeelisting/listSelectAllSkuInfo.html',
                        dataType: 'json',
                        async: false,
                        traditional: true,
                        data: {
                            ids: ids
                        },
                        success: function (returnSkuData) {
                            if (returnSkuData.code != "0000") {
                                layer.alert(returnSkuData.msg, { icon: 2 });
                                return;
                            }

                            var skuInfoStr = "";
                            $(returnSkuData.data).each(function () {
                                skuInfoStr += "店铺父SKU:" + this.storePSku + "(商品父SKU:" + this.pSku + ")<br>";
                            })
                            $("#shopeeCNSCPublish_skusInfo").append(skuInfoStr);
                        }
                    })
                }
            })
        }
    });
}

function shopeeListingCNSCPublish_updatePrice () {
    var subListingIds = [];
    $("#shopeeCNSCPublish_SubSkuInfo").find("tr").each(function () {
        var tdArr = $(this).children();
        subListingIds.push(tdArr.eq(0).text());
    });
    //按子listingid更新刊登价格
    $.ajax({
        beforeSend: function () {
            loading.show();
        },
        url: ctx + '/shopee/shopeelisting/getUpdateListingPrice.html',
        type: "post",
        dataType: "json",
        traditional: true,
        data: { subListingIds: subListingIds },
        success: function (returnData) {
            if (returnData.code != "0000") {
                layer.alert(returnData.msg, { icon: 2 });
            } else {
                if (returnData.msg) {
                    layer.msg('更新价格成功:<br>' + returnData.msg);
                } else {
                    layer.msg('更新价格成功');
                }
                //更新为新价格
                $("#shopeeCNSCPublish_SubSkuInfo").find("tr").each(function () {
                    var tdArr = $(this).children();
                    var currentId = tdArr.eq(0).text();
                    var upList = returnData.data;
                    for (var i = 0; i < upList.length; i++) {
                        if (currentId == upList[i].id) {
                            tdArr.eq(5).find('input').val(upList[i].price);
                        }
                    }
                });
            }
        },
        complete: function () {
            loading.hide();
        },
    });
}

//主辅图本地上传
function shopeeCNSCPublish_extPic_exchangeLocal (obj) {
    //上传本地图片
    $(obj).Huploadify({
        auto: true,
        fileTypeExts: '*.jpg;*.png;*.jpeg;*.JPG;*.JPEG;*.PNG;*.bmp;*.BMP;*.gif;',
        multi: true,
        fileSizeLimit: 2048,	//默认单位是KB
        buttonText: '本地图片',
        breakPoints: false,
        saveInfoLocal: false,
        showUploadedPercent: true,
        showUploadedSize: true,
        removeTimeout: 500,
        uploader: ctx + "/publish/uploadPic.html",
        onSelect: function (files) {
            return true;
        },
        onUploadStart: function (file) {
        },
        onUploadSuccess: function (file, data, response) {
            data = $.parseJSON(data);
            if (data != null && data.code == '0000') {
                shopeeCNSCPublish_downImgFromUrl4(data.msg);
            } else {
                layer.msg(data.msg);//这里面的内容不知道写啥,同OA系统
            }
        }
    });
}


function shopeeCNSCPublish_setOtherSubImg(obj, newImg) {
    //获取颜色尺寸和style
    const curColor = $(obj)
      .parents("tr")
      .find("input.shopeeCNSCPublish_subColor")
      .val();
    const curStyle = $(obj)
      .parents("tr")
      .find("input.shopeeCNSCPublish_subStyle")
      .val();
    const curSize = $(obj)
      .parents("tr")
      .find("input.shopeeCNSCPublish_subSize")
      .val();
    let temp = {};
    if (curColor) {
      temp.typeStr = "OA_Color";
      temp.classname = "shopeeCNSCPublish_subColor";
      temp.val = curColor;
    } else if (curStyle) {
      temp.typeStr = "OA_Style";
      temp.classname = "shopeeCNSCPublish_subStyle";
      temp.val = curStyle;
    } else if (curSize) {
      temp.typeStr = "OA_Size";
      temp.classname = "shopeeCNSCPublish_subSize";
      temp.val = curSize;
    }
    if (!$.isEmptyObject(temp)) {
      var confirIndex = layui.layer.confirm(
        "此图片是否替换到其他" +
          temp.typeStr +
          "同样为" +
          temp.val +
          "的子属性商品？",
        function () {
          //查询所有tr列表
          $("#shopeeCNSCPublish_SubSkuInfo")
            .find("tr")
            .each(function () {
              const curVal = $(this).find(`input.${temp.classname}`).val();
              if (curVal == temp.val) {
                $(this)
                  .find("img.shopeeCNSCPublish_subImgUrl")
                  .attr("src", newImg)
                  .attr("data-original", newImg);
              }
            });
          layer.close(confirIndex);
        }
      );
    }
  }
  

//移除子listing,仅删除样式
function shopeeCNSCPublish_editVarPic (obj) {
    var layer = layui.layer,
        laytpl = layui.laytpl,
        $ = layui.$,
        upload = layui.upload,
        form = layui.form;
    layer.open({
        type: 1,
        title: '选择图片上传方式',
        btn: ['取消'],
        area: ['300px', '150px'],
        content: `<div class="layui-row">
                    
                    <div class="layui-col-md3">
                        <div id="shopeeCNSCPublish_localPicSubmit" >本地图片</div>
                    </div>
                    <div class="layui-col-md3">
                        <button type="button" class="layui-btn layui-btn-sm" id="shopeeCNSCPublish_onlinePicSubmit" >网络图片</button>
                    </div>
                    
                </div>`,
        success: function (layero, upIndex) {
            $('#shopeeCNSCPublish_localPicSubmit').Huploadify({
                auto: true,
                fileTypeExts: '*.jpg;*.png;*.jpeg;*.JPG;*.JPEG;*.PNG;*.bmp;*.BMP;*.gif;',
                multi: true,
                fileSizeLimit: 2048,	//默认单位是KB
                buttonText: '本地图片',
                breakPoints: false,
                saveInfoLocal: false,
                showUploadedPercent: true,
                showUploadedSize: true,
                removeTimeout: 500,
                uploader: ctx + "/publish/uploadPic.html",
                onSelect: function (files) {
                    return true;
                },
                onUploadStart: function (file) {
                    layer.close(upIndex);
                    layui.admin.load.show();
                },
                onUploadSuccess: function (file, data, response) {
                    var dataObj = JSON.parse(data || '{}');
                    layui.admin.load.hide();
                    if (dataObj != null && dataObj.code === '0000') {
                        $(obj).parents('tr').find('img.shopeeCNSCPublish_subImgUrl').attr('src', dataObj.msg);
                        $(obj).parents('tr').find('img.shopeeCNSCPublish_subImgUrl').attr('data-original', dataObj.msg);
                        shopeeCNSCPublish_setOtherSubImg(obj, dataObj.msg);
                    } else {
                        layer.msg(dataObj.msg || '操作失败' );//这里面的内容不知道写啥,同OA系统
                    }
                }
            });

            $("#shopeeCNSCPublish_onlinePicSubmit").click(function () {
                layer.close(upIndex);
                //填写网络图片
                layer.open({
                    type: 1,
                    title: '填入网络图片',
                    area: ['800px', '300px'],
                    content: '<div class="p20"><textarea class="layui-textarea" id="shopeeCNSCPublish_netImgUrl_info" placeholder="请填写URL"></textarea></div>',
                    btn: ['确定', '关闭'],
                    yes: function (secondIndex, layero) {
                        //网络主图处理
                        var url = $.trim($("#shopeeCNSCPublish_netImgUrl_info").val());
                        if (url == null || url == "") {
                            layer.msg("图片地址不能为空！", { icon: 5 });
                            return false;
                        }
                        //找到图片并替换掉
                        //todo
                        $(obj).parents('tr').find('img.shopeeCNSCPublish_subImgUrl').attr('src', url);
                        $(obj).parents('tr').find('img.shopeeCNSCPublish_subImgUrl').attr('data-original', url);
                        shopeeCNSCPublish_setOtherSubImg(obj, url);
                        layer.close(secondIndex);
                    }
                })
            });
        },
        yes: function (theIndex, layero) {
            layer.close(theIndex);
        }
    })
}
//移除图片
function shopeeCNSCPublish_deleteVarPic (obj) {
    layer.confirm('确定移除该行图片吗?', function (index) {
        $(obj).parents('tr').find('img.shopeeCNSCPublish_subImgUrl').attr('src', ctx + "/static/img/kong.png");
        $(obj).parents('tr').find('img.shopeeCNSCPublish_subImgUrl').attr('data-original', ctx + "/static/img/kong.png");
        // shopeeCNSCPublish_setOtherSubImg(obj, ctx + "/static/img/kong.png");
        layer.close(index);
    })
}

function shopePublish_initAjax (url, data, method, contentType, loadingShow, laodingHide, succFunc) { //初始化ajax请求
    if (loadingShow) {
        loading.show();
    }
    $.ajax({
        type: method || 'POST',
        url: ctx + url,
        dataType: 'json',
        async: true,
        data: data,
        contentType: contentType || 'application/json',
        success: function (returnData) {
            if (laodingHide) {
                loading.hide();
            }
            if (returnData.code == "0000") {
                succFunc(returnData)
            } else {
                layer.msg(returnData.msg, { icon: 2 });
            }
        },
        error: function (returnData) {
            if (laodingHide) {
                loading.hide();
            }
            if (XMLHttpRequest.status == 200) {
                layer.msg("请重新登录", { icon: 7 });
            } else {
                layer.msg("服务器错误");
            }
        }
    })
}

/**
 * 水印
 */
function waterFirstPic_shopeeCNSCPublish () {
    layer.open({
        type: 1,
        title: '选择水印',
        btn: ['生成', '关闭'],
        area: ['65%', '70%'],
        content: $('#shopeePulish_selWaterTpl').html(),
        success: function (index, layero) {
            var storeAcctId = $("#shopeeCNSCPublish_editDetailForm input[name=storeAcctId]").val();
            shopePublish_initAjax("/shopee/shoppeWatermark/searchWatermarkBySalePlatAcctId.html", JSON.stringify({ "storeAcctId": storeAcctId }), null, null, true, true, function (returnData) {
                $("#shopeePulish_selWaterForm select[name=waterImageId]").empty();
                $("#shopeePulish_selWaterForm select[name='waterImageId']").append("<option value='' selected>请选择</option>");
                $("#shopeePulish_selWaterForm select[name=waterFontId]").empty();
                $("#shopeePulish_selWaterForm select[name='waterFontId']").append("<option value='' selected>请选择</option>");
                //初始化
                if (returnData.data) {
                    if (returnData.data.picList) {
                        returnData.data.picList.forEach(function (val, index) {
                            $("#shopeePulish_selWaterForm select[name='waterImageId']").append("<option value='" + val.id + "'>" + val.watermarkTemplateName + "</option>");
                        });
                    }
                    if (returnData.data.wordList) {
                        returnData.data.wordList.forEach(function (val, index) {
                            $("#shopeePulish_selWaterForm select[name='waterFontId']").append("<option value='" + val.id + "'>" + val.watermarkTemplateName + "</option>");
                        });
                    }
                }
                layui.form.render();
            });
        },
        yes: function (index, layero) {
            var mainImgUrl = $("#shopeeCNSCPublish_mainImg .ImgDivIn").find('img').attr('src');
            var waterImageId = $("#shopeePulish_selWaterForm select[name='waterImageId']").val();
            var waterFontId = $("#shopeePulish_selWaterForm select[name='waterFontId']").val();
            var watermarkIds = "";
            if (waterImageId) {
                watermarkIds = waterImageId;
                if (waterFontId) {
                    watermarkIds += "," + waterFontId;
                }
            } else {
                if (waterFontId) {
                    watermarkIds += waterFontId;
                }
            }
            var storeAcctId = $("#shopeeCNSCPublish_editDetailForm input[name=storeAcctId]").val();
            shopePublish_initAjax("/shopee/shoppeWatermark/getWatermarkImgPath.html", JSON.stringify({ "imgPath": mainImgUrl, "watermarkIds": watermarkIds, "storeAcctId": storeAcctId }), null, null, true, true, function (returnData) {
                $("#shopeeCNSCPublish_mainImg .ImgDivIn").find('img').attr('src', returnData.data);
                $("#shopeeCNSCPublish_mainImg .ImgDivIn").find('input').attr('value', returnData.data);
                layer.close(index);
                layui.layer.msg("首图水印成功");
            });

        }
    });

}

//更新店铺SKU为商品sku
function shopeeCNSCPublish_UpdateSku (id) {
    layui.layer.confirm('您确认要更新,且包含店铺父sku？', { icon: 3, title: '提示' }, function (index) {
        $("#shopeeCNSCPublish_SubSkuInfo").find("tr").each(function () {
            tdArr = $(this).children();
            tdArr.find('input[name=storeSSku]').val(tdArr.find('input[name=storeSSku]').data("ssku"));
        });
        //父SKU
        var pSkuDom = $("#shopeeCNSCPublish_editDetailForm input[name=storePSku]");
        pSkuDom.val(pSkuDom.data("sku"));
        layer.close(index);
    });
}

function shopeeCNSCPublish_batchSetSkuSufix (obj) {
    var type = $('#shopeeCNSCPublish_editDetailForm select[name=sufixSetType]').val()
    var original = $("#shopeeCNSCPublish_editDetailForm input[name=originalsku]").val()
    var newsku = $("#shopeeCNSCPublish_editDetailForm input[name=newsku]").val()
    if (original !== "") {
        if (type == 1) {
            shopeeCNSCPublish_addSufix(original)
        } else if (type == 2) {
            shopeeCNSCPublish_replaceSufix(original, newsku)
        } else {
            shopeeCNSCPublish_deleteSufix(original)
        }
    } else {
        layer.msg('请填写要修改的后缀内容')
    }
}

//添加后缀
function shopeeCNSCPublish_addSufix (newsufix) {
    $("#shopeeCNSCPublish_SubSkuInfo tr").each(function () {
        var originalsku = $(this).find("input[name=storeSSku]").val()
        $(this).find("input[name=storeSSku]").val(originalsku + newsufix);
    });
}
//删除后缀
function shopeeCNSCPublish_deleteSufix (original) {
    $("#shopeeCNSCPublish_SubSkuInfo tr").each(function () {
        var originalsku = $(this).find("input[name=storeSSku]").val()
        if (shopeeCNSCPublish_endWith(originalsku, original)) {
            $(this).find("input[name=storeSSku]").val(originalsku.slice(0, originalsku.length - original.length));
        }
    });
}
//替换后缀
function shopeeCNSCPublish_replaceSufix (originalsufix, newsufix) {
    $("#shopeeCNSCPublish_SubSkuInfo tr").each(function () {
        var original = $(this).find("input[name=storeSSku]").val()
        if (shopeeCNSCPublish_endWith(original, originalsufix)) {
            var originbody = original.slice(0, original.length - originalsufix.length)
            $(this).find("input[name=storeSSku]").val(originbody + newsufix);
        }
    });
}

function shopeeCNSCPublish_endWith (s, sufix) {
    if (sufix == null || sufix == "" || s.length == 0 || sufix.length > s.length)
        return false;
    if (s.substring(s.length - sufix.length) == sufix)
        return true;
    else
        return false;
    return true;
}

function shopeeCNSCProductMackListingType (pSku, pId, type) {
    layer.open({
        type: 1,
        title: '本人设置刊登/不刊登',
        btn: ['确定', '取消'],
        area: ['20%', '20%'],
        content: $('#shopee_cnscPublish_Product_Mack_Listing_Type').html(),
        success: function (index, layero) {
            $("#shopee_cnscPulish_p_sku_lising_type_text").val(pSku);
            $("#shopee_cnscPulish_p_id_hidden_lising_type_text").val(pId);
            var name;
            if (!type || type === "") {
                name = 2;
            } else {
                name = type;
            }
            if (name != "0") {
                $("#shopee_cnscPublish_product_mack_listing_show_txt").text("确定设置当前父商品(" + pSku + ")为不想刊登?");
            } else {
                $("#shopee_cnscPublish_product_mack_listing_show_txt").text("确定设置当前父商品(" + pSku + ")为想刊登?");
            }
            layui.form.render();
        },
        yes: function (index, layero) {
            var pSku = $("#shopee_cnscPulish_p_sku_lising_type_text").val();
            var prodId = $("#shopee_cnscPulish_p_id_hidden_lising_type_text").val();
            var listingType = $("#shopee_cnscPulish_product_lising_type").val();
            shopePublish_initAjax("/shopee/shopeelisting/mackForLoginUser.html", JSON.stringify({
                "pSku": pSku,
                "prodId": prodId,
                "type": listingType
            }), null, null, true, true, function (returnData) {
                var data = returnData.data;
                layui.layer.msg("设置成功!");

            });
            layer.close(index);
            search_shopeeCNSCPublish();
        }
    });
}

// 删除生成待刊登失败标签
function shopeeCNSCDeleteGenerateFailedTag(generateFailedTagId){
    shopeeCNSCBatchDeleteGenerateFailedTag([generateFailedTagId])
}
$('#shopeeCNSCPublish_batchDeleteGenerateFailedTag').click(function(){
    const checkData = $("#shopeeCNSCPublish_table tbody input[name=id]:checked");
    if (checkData.length > 0) {
        const arr = []
        checkData.each(function(){
            const generateFailedTagId = $(this).data('generatefailedtagid')
            if(generateFailedTagId){
                arr.push(generateFailedTagId)
            }
        })
        if(arr.length){
            shopeeCNSCBatchDeleteGenerateFailedTag(arr)
        }else{
            layer.msg("请至少选择1条有生成待刊登失败标签的数据");
        }
    } else {
        loading.hide();
        layer.msg("请至少选择1条数据");
    }
})
// 批量删除生成待刊登失败标签
function shopeeCNSCBatchDeleteGenerateFailedTag(generateFailedTagIdList){
    commonReturnPromise({
        url: "/lms/shopee/shopeelisting/batchDeleteGenerateFailedTag",
        type: 'post',
        contentType: 'application/json',
        params: JSON.stringify(generateFailedTagIdList)
    }).then(res=>{
        layer.msg(res||'操作成功',{icon:1})
        $("#shopeeCNSCPublish_search").trigger("click")
    })
}
//批量操作
function shopee_batchHandle (isCked) {
    var $trs = $('.shopeeCNSCPublish_table_body>table>tbody>tr');
    if (isCked) {
        var ckedArr = [];
        for (var i = 0; i < $trs.length; i++) {
            var $item = $($trs[i]);
            var obj = {};
            obj.pSku = $item.find('input[name=pSku]').val();
            obj.prodPId = $item.find('input[name=prodPId]').val();
            ckedArr.push(obj);
        }
        return ckedArr;
    } else {
        var ckedArr = [];
        for (var i = 0; i < $trs.length; i++) {
            var $item = $($trs[i]);
            var obj = {};
            var targetCked = $item.children('td:nth-child(1)').find('input[type=checkbox]').is(':checked');
            if (targetCked) {
                obj.pSku = $item.find('input[name=pSku]').val();
                obj.prodPId = $item.find('input[name=prodPId]').val();
                ckedArr.push(obj);
            }
        }
        return ckedArr;
    }
}
/**
 * @description:CNSC一对多刊登
 */
$('#shopeeCNSCPublish_morePublishBtn').click(function(){
    layer.open({
        type: 1,
        title: 'CNSC一对多刊登',
        area: ['600px', '250px'],
        content: $('#shopee_cnscPublish_morePublish_tpl').html(),
        success: function (layero, index) {
            layero.find('.layui-form-label').css('width','110px')
            layero.find('.layui-input-block').css('marginLeft','140px')
            layui.form.render()
        },
    })
})

$('#shopeeCNSCPublish_batchHandleBtn').on('click', function () {
    var isCked = $('#shopeeCNSCPublish_AllChecked').is(':checked');
    var data = shopee_batchHandle(isCked);
    $.ajax({
        type: 'POST',
        url: ctx + "/shopee/shopeelisting/batchMackForLoginUser.html",
        dataType: 'json',
        async: true,
        data: JSON.stringify(data),
        contentType: 'application/json',
        success: function (returnData) {
            loading.hide();
            if (returnData.code == "0000") {
                layer.msg(returnData.msg, { icon: 1 });
            } else {
                layer.msg(returnData.msg, { icon: 2 });
            }
        },
        error: function (returnData) {
            loading.hide();
            if (XMLHttpRequest.status == 200) {
                layer.msg("请重新登录", { icon: 7 });
            } else {
                layer.msg("服务器错误");
            }
        }
    })

})

function shopeeCNSCPublish_showProhibitList (self, dataList) {
    if (dataList) {
        var layer = layui.layer,
            table = layui.table
        var oldId = self.getAttribute('data-tipId')
        if (oldId) {
            layer.close(oldId)
        }

        var tipsIndex = layer.open({
            type: 4,
            shade: 0,
            area: ['800px', ''],
            tips: [4, 'rgba(5,5,5,0.4)'],
            isOutAnim: false,
            content: [$('#shopee_cnscPublish_prohibit_tpl').html(), self], //数组第二项即吸附元素选择器或者DOM
            success: function () {
                table.render({
                    elem: "#shopee_cnscPublish_prohibit_Table",
                    id: "shopee_cnscPublish_prohibit_Table",
                    data: dataList,
                    cols: [
                        [
                            { field: "platCode", title: "平台", width: 100 },
                            { field: "salesSite", title: "站点", width: 100 },
                            {
                                title: "仓库",
                                templet: '<div>{{shopeeCNSCPublish_getStockLocationCn(d.stockLocation)}}</div>',
                                width: 100
                            },
                            {
                                title: "禁售原因",
                                templet: '<div>{{(d.ifFixedInable ? ("手动禁售;" + d.lisintgInableMsg)  : d.lisintgInableMsg)}}</div>'
                            },
                        ],
                    ],
                    page: false,
                });
            }
        });
        self.setAttribute('data-tipId', tipsIndex)
    }
}

function shopeeCNSCPublish_getStockLocationCn (stockLocation) {
    switch (stockLocation) {
        case 0:
            return '全部'
        case 1:
            return '国内仓'
        case 2:
            return '海外仓'
    }
}

function sortBy (attr, rev) {
    if (rev === undefined) {
        rev = 1
    } else {
        rev = (rev) ? 1 : -1
    }

    return function (a, b) {
        a = a[attr]
        b = b[attr]
        if (a < b) {
            return rev * -1
        }
        if (a > b) {
            return rev * 1
        }
        return 0
    }
}

function distinctUniqueAttributeIdObjArray (objArray) {
    if (objArray.length > 0) {
        let map = new Map()
        for (let item of objArray) {
            if (!map.has(item.attributeId)) {
                map.set(item.attributeId, item)
            }
        }
        return [...map.values()]
    }
    return []
}

function shopee_cnscPublish_morePublish_exportFile(_, e) {
    let formDom = $('#shopee_cnscPublish_morePublish_form')
    var formData = new FormData()
    //获取该input的所有元素、属性
    var f = document.getElementById(
      "shopee_cnscPublish_morePublish_exportBtn"
    )
    formData.append("file", f.files[0])
    formData.append("allowProhibit", Boolean(Number(formDom.find('input[name=allowProhibit]:checked').val())))
    formData.append("allowRepeat", Boolean(Number(formDom.find('input[name=allowRepeat]:checked').val())))
    $.ajax({
      url: '/lms/shopee/cnscPublish/publishItemToOtherShops',
      data: formData,
      type: "POST",
      async: true,
      cache: false,
      contentType: false,
      processData: false,
      dataType: "json",
      beforeSend: function () {
        loading.show()
      },
      success: function (data) {
        loading.hide()
        if (data.code == "0000") {
            layer.msg(data.msg||'已发送队列执行' ,{icon:1})          
        } else {
            layer.msg(data.msg||'操作失败',{icon:2})
        }
      },
      error: function (error) {
        layui.layer.msg(`${error.statusText}`, { icon: 2 })
      },
    })
    //传递完成以后清空input的value
    e.target.value = ""
    e.preventDefault()
    e.stopPropagation()
  }

  function cnscpublishImagejumpTotaskcenter(){
    layui.layer.closeAll()
    window.parent.postMessage({ name: "shopeeoperatetaskcenter", res: "" }, "*");
  }

function getTplImgDialog(editor) {
    const prodSSkus = Array.from($("#shopeeCNSCPublish_SubSkuInfo tr").map((_, item) => $(item).find('input[name=storeSSku]').data('ssku')))
    const params = { prodSSkus: prodSSkus, platCode: 'shopee'}
    showTplImgDialog(params, editor)
  }

  function renderEditor(id, text, tplRequestParam) {
    var E = window.wangEditor
    // 获取必要的变量
    const { $, BtnMenu } = E
    class tplMenu extends BtnMenu {
        constructor(editor) {
            const $elem = E.$(
                `<div class="w-e-menu" style="width: 60px" data-title="模板图片">
                    <span>模板图片</span>
                </div>`
            )
            super($elem, editor)
        }
        // 模板图片菜单点击事件
        clickHandler() {
            getTplImgDialog(editor)
        }
        tryChangeActive() {
            // 激活菜单
            this.active()
        }
    }
    class uploadMenu extends BtnMenu {
        constructor(editor) {
            const $elem = E.$(
                `<div class="w-e-menu" style="width: 60px" data-title="上传图片">
                    <span>上传图片</span>
                </div>
                `
            )
            super($elem, editor)
        }
        // 上传图片菜单点击事件
        clickHandler() {
            editorUploadImgs(editor)
        }
        tryChangeActive() {
            // 激活菜单
            this.active()
        }
    }
    class netMenu extends BtnMenu {
        constructor(editor) {
            const $elem = E.$(
                `<div class="w-e-menu" style="width: 60px" data-title="网络图片">
                    <span>网络图片</span>
                </div>`
            )
            super($elem, editor)
        }
        // 网络图片菜单点击事件
        clickHandler() {
            showEditorNetImgs(editor)
        }
        tryChangeActive() {
            // 激活菜单
            this.active()
        }
    }
    // 菜单 key ，各个菜单不能重复
    const tplMenuKey = 'tplMenuKey' 
    const uploadMenuKey = 'uploadMenuKey' 
    const netMenuKey = 'netMenuKey' 
    // 注册菜单
    E.registerMenu(tplMenuKey, tplMenu)
    E.registerMenu(uploadMenuKey, uploadMenu)
    E.registerMenu(netMenuKey, netMenu)

    var editor = new E('#' + id)
    editor.config.menus = []

    editor.create()
    
    if (text) {
        editor.txt.html(text)
    }
    return editor
  }