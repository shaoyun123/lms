/**layui.use开始 */
var ebayWangEditor,ebayPublish_displayAccurateCount
layui.use(['admin', 'form', 'layer', 'formSelects', 'element', 'laydate', 'laypage','table'], function() {
    var admin = layui.admin,
        form = layui.form,
        layer = layui.layer,
        formSelects = layui.formSelects,
        element = layui.element,
        laydate = layui.laydate,
        laypage = layui.laypage,
        table = layui.table
        $ = layui.$
    form.render('select');

    // 记录 tabindex 减少部分渲染
    let eabyPublish_LastTabIndex = 0

    function initAjax(url, method, data, func, contentType) { //初始化ajax请求
        loading.show()
        $.ajax({
            type: method,
            url: ctx + url,
            dataType: 'json',
            async: true,
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
        })
    }

    // 在售状态
    formSelects.render('ebayPulish_saleStatusList')

    //填充下拉框
    function appendSelect(aDom, data, code, label, attachment) {
        aDom.empty();
        var option = '<option value="">请选择</option>'
        for (var i in data) {
            if (typeof data[i] !== 'string') {
                data[i].code = data[i][code] || data[i].code
                data[i].label = data[i][label] || data[i].label;
            }
            option += '<option value="' + (typeof data[i].code!='undefined'?data[i].code:data[i]) + '">' + (data[i].label || data[i]) + '</option>'
        }
        aDom.append(option)
        form.render()
    }

    //创建人枚举数据
    function followSellGetOwner(func){
        initAjax('/sys/listAllUser.html', 'POST', {}, function(returnData) {
            if(func){
                func(returnData)
            }
        }, 'application/x-www-form-urlencoded');
    }

    // 规则弹窗获取下拉框渲染数据
    ebaypublish_initdevTypes()
    function ebaypublish_initdevTypes () {
        commonReturnPromise({
            url: ctx + '/fyndiq/new/listing/manage.html'
        }).then(data => {
            commonRenderSelect('devTypes_ebay_public', data.devTypeEnums).then(() => {
                formSelects.render('devTypes_ebay_public');
            })
        })

    }

    followSellGetOwner(function(returnData){
        let data = returnData.data.unshift({id:-1,userName: "system"})
        appendSelect($('#followSell_person_search_select'), returnData.data, 'id', 'userName');
        formSelects.render('followSell_person_search_select');
    })

    //ebay获取账号类型
    inieEbayAccountType()
    function inieEbayAccountType() {
        commonReturnPromise({
            url: '/lms/sys/ebayAcctTypeEnum.html',
            type: 'post',
        }).then((res)=> {
            commonRenderSelect('ebayPublish_Account_type', res, {code: 'name', name: 'name'})
            formSelects.render('ebayPublish_Account_type');
        }).catch((err)=>{
            layer.msg(err, {icon:2});
        })
    }

    var colArr =
        [
            [
                {type: "checkbox", width: 30,maptag:["-2","0","3","1","2"]},
                {title: "缩略图",width: 80, field: 'mainImgUri',templet:'#ebaypubish_imageTpl',maptag:["-2","0","3","1","2"]},
                {title: "标题", width:150,field: 'title',maptag:["-2","0","3","1","2"]},
                {title: "父sku", width: 200,field: 'pSku',templet:"#ebaypublish_prodPSku_tpl",maptag:["-2","0","3","1","2"]},
                {title: "侵权状态",templet:"#ebaypublish_tort_tpl",width:'20%',maptag:["-2"]},
                {title: "开发备注", field: 'devNote',maptag:["-2"],templet:"#ebaypubish_devNote_Tpl"},
                {title: "店铺", width: 150, field: 'storeAcctName',maptag:["0","3","1","2"]},
                // {title: "店铺sku",width: 150,field: 'storePSku',maptag:["0","3","1","2"],templet:'#ebaypubish_storePSku_Tpl'},
                {title: "刊登失败信息", field: '',maptag:["2"],templet:"#ebaypubish_respShortMsg_Tpl"},
                { field: "prodListingSubSkuEbays", width:'30%',
                    title: "<div style='display:flex;justify-content:space-between'><div style='width:10%;text-aligh:center;'> </div>"+
                    "<div style='width:20%;text-aligh:center'>模板子SKU</div> " +
                    "<div style='width:10%;text-aligh:center'>成本</div> " +
                    "<div style='width:15%;text-aligh:center'>颜色</div>"+
                    "<div style='width:10%;text-aligh:center'>尺寸</div>" +
                    "<div style='width:15%;text-aligh:center'>样式</div>" +
                    "<div style='width:10%;text-aligh:center'>可用/在途/未派</div>",
                   templet: '#ebaypublish_prodSSku_tpl',maptag:["-2"]},
                   { field: "prodListingSubSkuEbays",
                   title: "<div style='display:flex;justify-content:space-between'>"+
                   "<div style='width:20%;text-aligh:center'>模板子SKU</div>" +
                   "<div style='width:20%;text-aligh:center'>店铺子SKU</div>" +
                   "<div style='width:10%;text-aligh:center'>刊登价</div> " +
                   "<div style='width:10%;text-aligh:center'>颜色</div>"+
                   "<div style='width:10%;text-aligh:center'>尺寸</div>" +
                   "<div style='width:10%;text-aligh:center'>样式</div>" +
                   "<div style='width:10%;text-aligh:center'>可用/在途/未派</div>"+
                   "<div style='width:10%;text-aligh:center'>在线数量</div>",
                  templet: '#ebaypublish_prodSSku_tpl1',maptag:["0","3","1"]},
                  { field: "prodListingSubSkuEbays1", width:'35%',
                  title: "<div style='display:flex;justify-content:space-between'>"+
                  "<div style='width:20%;text-aligh:center'>模板子SKU</div> " +
                  "<div style='width:20%;text-aligh:center'>店铺子SKU</div> " +
                  "<div style='width:10%;text-aligh:center'>刊登价</div> " +
                  "<div style='width:10%;text-aligh:center'>颜色</div>"+
                  "<div style='width:10%;text-aligh:center'>尺寸</div>" +
                  "<div style='width:10%;text-aligh:center'>样式</div>" +
                  "<div style='width:10%;text-aligh:center'>可用/在途/未派</div>"+
                  "<div style='width:10%;text-aligh:center'>在线数量</div>",
                 templet: '#ebaypublish_prodSSku_tpl1',maptag:["2"]},

                {title: "操作",width: 100, toolbar:'#ebaypublish_option_tpl',maptag:["-2","3","0","1","2"]},
            ]
        ]
    laydate.render({
        elem: '#ebayPublish_time', //渲染时间
        range: true
    });
    render_hp_orgs_users("#eabyPublish_searchForm");
    //选择分类弹框
    $('#ebayPublish_item').click(function() {
            admin.itemCat_select('layer-publishs-ebay-publish', 'LAY-publishs-ebay-publish-hidden', 'LAY-publishs-ebay-publish-div')
        })
        //初始化值
    $("#eabyPublish_searchForm select[name=tortBanListing]").val("CURRENT_PLAT");
    form.render();
    //修改店铺触发站点
    form.on('select(ebayPublish_search-store)', function(data) {
        ebayPublishInitSite();
        $('#eabyPublish_searchForm select[name=isOverSeasWh]').html('')

        if (ebayPublishStoreList && ebayPublishStoreList.length) {
            let ebayStoreWarehouse = ebayPublishStoreList.filter((v) => data.value == v.id)[0] || {}, //过滤出等于当前选择的店铺
             warehouse = ebayStoreWarehouse.storeWarehouses || '', //得到其仓库
             specificWarehouse = warehouse.split(',') || [], //分割
             warehouseStr = ''; //option渲染

            specificWarehouse.forEach(function (value) {
                let warehouseStrTem = ''
                if (value == 0) {
                    warehouseStrTem = `<option value="false">国内仓</option>`
                }else if (value == 1) {
                    warehouseStrTem = `<option value="true">虚拟仓</option>`
                }else {
                    warehouseStrTem = ''
                }
                warehouseStr += warehouseStrTem
            })
            $('#eabyPublish_searchForm select[name=isOverSeasWh]').html(warehouseStr)
            form.render()
        }else {
            layer.msg('获取店铺失败！')
        }

    });

    function ebayPublishInitSite() {
        var siteIds = $("#eabyPublish_searchForm select[name=platAcctId] option:selected").data("sites");
        //清空site
        $("#eabyPublish_searchForm select[name=siteId]").empty();
        if (siteIds || siteIds == 0) {
            siteIds = siteIds.toString();
            for (var i = 0; i < siteIds.split(",").length; i++) {
                var siteId = siteIds.split(",")[i];
                var siteName = ebayPublishSiteData[siteId];
                if (siteName) {
                    var optionTpl = "<option value=':siteId'>:siteName</option>";
                    optionTpl = optionTpl.replace(":siteId", siteId);
                    optionTpl = optionTpl.replace(":siteName", siteName);
                    $("#eabyPublish_searchForm select[name=siteId]").append(optionTpl);
                }
            }
        }
        form.render('select');
    }

    //清空按钮的点击事件
    $('#ebayPublish_reset').click(function() {
        $('#LAY-publishs-ebay-publish-hidden').val('')
        $('#LAY-publishs-ebay-publish-div').html('')
        formSelects.value('ebayPulish_selectAttr', [])
        formSelects.value('ebayPublish_Account_type', [])
        formSelects.value('ebayPulish_selectMan', [])
        formSelects.value('followSell_person_search_select', [])
        $('#ebay_publish_organization').next().find('dd[lay-value=""]').trigger('click');
        form.render();
    })

    function getEbayPublishSearchData() {
        var data = {};
        data.orgId = $("#eabyPublish_searchForm select[name=orgId]").val();
        data.salePersonId = $("#eabyPublish_searchForm select[name=salePersonId]").val();
        data.roleNames = $("#eabyPublish_searchForm select[name=salePersonId]").data("rolelist");
        data.storeAcctId = $("#eabyPublish_searchForm select[name=platAcctId]").val();
        data.cateId = $("#eabyPublish_searchForm input[name=cateId]").val();
        data.tag = $("#eabyPublish_searchForm select[name=tag]").val();
        let ebayCategoryType = $("#eabyPublish_searchForm").find("select[name=ebayCategoryType]").val()
        data[ebayCategoryType] = $.trim($("#ebay_online_ebayCategory2").val());
        if(ebayCategoryType === 'ebayCategory1'){
            data.ebayCategory1Type = $('input[name="ebayCategory2Type"]:checked').val() ? 1 : 0;
        }else{
            data.ebayCategory2Type = $('input[name="ebayCategory2Type"]:checked').val() ? 1 : 0;
        }
        data.acctTypeList = formSelects.value("ebayPublish_Account_type", "val");
        data.devTypes = formSelects.value("devTypes_ebay_public", "val");
        //物流属性
        data.existLogisAttrs = [];
        data.notExistLogisAttrs = [];
        var logisAttrContents = formSelects.value("ebayPulish_selectAttr");
        for (var i = 0; i < logisAttrContents.length; i++) {
            var logisAttr = logisAttrContents[i].val;
            if (logisAttr.indexOf("no_") > -1) {
                logisAttr = logisAttr.replace("no_", "");
                data.notExistLogisAttrs.push(logisAttr);
            } else {
                data.existLogisAttrs.push(logisAttr);
            }
        }

        let followSell_person_search_select = formSelects.value("followSell_person_search_select");

        data.creatorList = followSell_person_search_select.map(item => item.name) || '';
        data.siteId = $("#eabyPublish_searchForm select[name=siteId]").val();
        //产品归属人
        data.bizzOwnerIds = [];
        var bizzOwnerContents = formSelects.value("ebayPulish_selectMan");
        for (var i = 0; i < bizzOwnerContents.length; i++) {
            data.bizzOwnerIds.push(bizzOwnerContents[i].val);
        }
        //侵权状态
        data.tortBanListing = $("#eabyPublish_searchForm select[name=tortBanListing]").val();
        //日期
        var timeStr = $("#eabyPublish_searchForm input[name=time]").val();
        if (timeStr) {
            data.startTime = Date.parse(timeStr.split(" - ")[0] + " 00:00:00");
            data.endTime = Date.parse(timeStr.split(" - ")[1] + " 23:59:59");
            data.timeType = $("#eabyPublish_searchForm select[name=timeType]").val();
        }
        data.isOverSeasWh = $("#eabyPublish_searchForm select[name=isOverSeasWh]").val();
        // data.isComplete = $("#eabyPublish_searchForm select[name=isComplete]").val();
        // 已添加且完整：isCateComplete true  isAspectsComplete true
        // 未添加：补充信息表内不存在 isComplete false
        // 类目不完整：isCateComplete false
        // 属性不完整：isCateComplete true  isAspectsComplete false
        const ebayAttr = $("#eabyPublish_searchForm select[name=ebayAttr]").val();

          if(ebayAttr === 'addComplete') {
                data.isCateComplete=true,
                data.isAspectsComplete=true
            }else if(ebayAttr === 'unAdd') {
                data.isComplete = false
            }else if(ebayAttr === 'cateInComplete') {
                data.isCateComplete = false
            }else if(ebayAttr === 'attrInComplete') {
                data.isCateComplete = true,
                data.isAspectsComplete = false
            }

        data.cnTitle = "";
        data.enTitle = "";
        data.pSkus = "";
        data.sSkus = "";
        var searchType = $("#eabyPublish_searchForm select[name=searchType]").val();
        data[searchType] = $("#eabyPublish_searchForm input[name=searchValue]").val();
        //刊登状态
        data.listingStatus = $("#eabyPublish_searchForm input[name=listingStatus]").val();
        data.isListingAble = $("#eabyPublish_searchForm select[name=isListingAble]").val();
        //是否在售
        data.saleStatusList = formSelects.value('ebayPulish_saleStatusList','val')
        //是否存在刊登
        data.isListing = $("#eabyPublish_searchForm select[name=isListing]").val();
        data.isGenerate = $("#eabyPublish_searchForm select[name=isGenerate]").val();
        //子模板重量、成本
        data.minCost = $("#eabyPublish_searchForm input[name=minCost]").val();
        data.maxCost = $("#eabyPublish_searchForm input[name=maxCost]").val();
        data.minWeight = $("#eabyPublish_searchForm input[name=minWeight]").val();
        data.maxWeight = $("#eabyPublish_searchForm input[name=maxWeight]").val();
        //错误码
        data.listingRespCode = $("#eabyPublish_searchForm  select[name=listingRespCode]").val();
        data.respShortMsg = $("#eabyPublish_searchForm input[name=respShortMsg]").val();
        data.isMultiSku = $("#eabyPublish_searchForm select[name=isMultiSku]").val();
        data.listingMode = $("#eabyPublish_searchForm select[name=listingMode]").val();
        //是否有库存
        // data.isStock = $("#eabyPublish_searchForm input[name=isStock]").prop('checked');
        //刊登类型
        data.durationType = $("#eabyPublish_searchForm select[name=durationType]").val();
        //排序类型
        data.orderField = $("#eabyPublish_searchForm select[name=orderField]").val();
        ebayPublish_displayAccurateCount = $('#ebay_displayAccurateCount input[name=ebay_accurateCount]').prop('checked') ? 1 : 0
        data.displayAccurateCount = $('#ebay_displayAccurateCount input[name=ebay_accurateCount]').prop('checked') ? 1 : 0
        //预计可用库存 只在全部商品里面有
        if($('#ebayPublish_tab').find('.layui-this').attr("data-value") === '-2'){
            if($("#eabyPublish_searchForm select[name=stockType]").val()=='available'){
                data.stockMin = $("#eabyPublish_searchForm input[name=stockMin]").val()
                data.stockMax = $("#eabyPublish_searchForm input[name=stockMax]").val()
            }else{
                data.availableStockMin = $("#eabyPublish_searchForm input[name=stockMin]").val()
                data.availableStockMax = $("#eabyPublish_searchForm input[name=stockMax]").val()
            }
        }
        return data;
    }
    var eabyPublishPage = {};
    eabyPublishPage.curr = 1;
    eabyPublishPage.limit = 100
    eabyPublishPage.count = 0;
    $("#eabyPublish_search").click(function() {
        eabyPublishPage.curr = 1;
        ebayPublishTableRender(eabyPublishPage.limit,eabyPublishPage.curr)
        // eabyPublishPage.curr = 1;
        // ebayPublishSearch(eabyPublishPage.curr, eabyPublishPage.limit);
    });

    /**页面表格渲染 */
    function ebayPublishTableRender(limit,pageNum){
        var searchData = getEbayPublishSearchData()
        searchData.page = pageNum;
        searchData.limit = limit;
        var colinner = colArr[0].filter(function(item){
            return item.maptag.includes(searchData.listingStatus)
        })
        layui.admin.load.show();
        $.ajax({
            type: "post",
            url: ctx + "/ebaylisting/list.html",
            data: JSON.stringify(searchData),
            dataType: "json",
            async: true, //需要同步
            contentType: 'application/json',
            success: function(returnData) {
                layui.admin.load.hide();
                if (returnData.code != "0000") {
                    layer.msg(returnData.msg);
                    return;
                }
                table.render({
                    elem: "#ebayPublish_table",
                    method: "post",
                    data:returnData.data,
                    id: 'ebayPublish_table',
                    cols: [colinner],
                    page: false,
                    limit:1000,
                    done: function(res) {
                        imageLazyloadAll();
                        $('#LAY-publishs-ebay-publish .layui-table-header').addClass('toFixedContain')
                    },
                });
                eabyPublishPage.count = returnData.count;
                let temCount = '',tenCou = ''
                if (ebayPublish_displayAccurateCount) {
                    temCount = returnData.count
                    tenCou = returnData.count
                }else {
                    temCount = returnData.count >= 10000 ? '>10000' : returnData.count
                    tenCou = returnData.count >= 10000 ? 9999999 : returnData.count
                }
                $("#ebayPublish_tab ul li[data-value="+searchData.listingStatus+"] span").html(temCount);
                 //处理分页
                 laypage.render({
                    elem: 'ebayPublish_pagination',
                    limits: [30,50, 100, 300,1000],
                    limit:100,
                    // first: false, //显示首页
                    // last: false, //显示尾页
                    count: eabyPublishPage.count, //数据总数，从服务端得到
                    curr: eabyPublishPage.curr,
                    limit: eabyPublishPage.limit,
                    // prev: '<上一页',
                    // next: '下一页>',
                    layout: ['prev', 'page', 'next', 'count', 'limit', 'refresh', 'skip'],
                    jump: function(obj, first) {
                        //obj包含了当前分页的所有参数，比如：
                        eabyPublishPage.curr = obj.curr;
                        eabyPublishPage.limit = obj.limit;
                        //首次不执行
                        if (!first) {
                            //do something
                            ebayPublishTableRender(obj.limit,obj.curr)
                        }
                        let count = eabyPublishPage.count <= 10000 ? eabyPublishPage.count : '>10000'
                        if (ebayPublish_displayAccurateCount) {
                            count = eabyPublishPage.count
                        }
                        $('#ebayPublish_pagination .layui-laypage-count').text(`共 ${count} 条`)
                    }
                });
            },
            error: function(XMLHttpRequest) {
                layui.admin.load.hide();
                if (XMLHttpRequest.status == 200) {
                    layer.msg("请重新登录", { icon: 7 });
                } else {
                    layer.msg("服务器错误");
                }
            }
        });
    }

    //监听tab切换来选中不同的tab页
    element.on('tab(ebayPublish_tab)', function(data) {
            var btn1 = $('#ebay_btn_show_hide').find('button:first-child'), //生成店铺商品
                btn2 = btn1.next(), //超额转待发布
                btn3 = btn2.next(), //删除店铺商品
                btn4 = btn3.next(), //发布上架
                btn5 = btn4.next(), //定时刊登
                btn10=btn5.next(), //批量取消刊登
                btn6 = btn10.next() //取消定时刊登
            btn7 = btn6.next() //刊登拍卖
            btn8 = btn7.next() //复制模板
            btn9 = btn8.next() //标记刊登方式
            var listingStatus = $(this).attr("data-value");
            $("#eabyPublish_searchForm input[name=listingStatus]").val(listingStatus);
            $("#eabyPublish_search").trigger("click");
            //页面按钮切换
            btn1.addClass('disN')
            btn2.addClass('disN')
            btn3.addClass('disN')
            btn4.addClass('disN')
            btn5.addClass('disN')
            btn6.addClass('disN')
            btn7.addClass('disN')
            btn8.addClass('disN')
            btn9.addClass('disN')
            btn10.addClass('disN')
                //默认刊登tab
            $("#eabyPublish_searchForm .ebayPublish-all").hide();
            $("#eabyPublish_searchForm .ebayPublish-listing").show();
            if (data.index == 0) {
                btn1.removeClass('disN')
                btn2.removeClass('disN')
                btn7.removeClass('disN')
                $("#ebayPublish_table .ebayPublish-all").removeClass('disN');
                //全部tab
                $("#eabyPublish_searchForm .ebayPublish-all").show();
                $("#eabyPublish_searchForm .ebayPublish-ebayAttr").show();
                $("#eabyPublish_searchForm .ebayPublish-listing").hide();
                eabyPublish_LastTabIndex !=0 && $("#eabyPublish_searchForm select[name=timeType]").html('<option value="AUDIT_TIME">审核时间</option>')
                $("#eabyPublish_searchForm #ebayPublish_time").val('')
            } else if (data.index == 1) {
                btn2.removeClass('disN')
                btn3.removeClass('disN')
                btn4.removeClass('disN')
                btn5.removeClass('disN')
                btn8.removeClass('disN')
                $("#eabyPublish_searchForm .ebayPublish-ebayAttr").show();
                eabyPublish_LastTabIndex ==0 && $("#eabyPublish_searchForm select[name=timeType]").html('<option value="CREATE_TIME">创建时间</option><option value="AUDIT_TIME">审核时间</option><option value="LISTING_TIME" selected>刊登时间</option>')
                eabyPublish_LastTabIndex ==0 && $("#eabyPublish_searchForm select[name=timeType]").val('LISTING_TIME')
                // btn9.removeClass('disN')
            } else if (data.index == 2) {
                btn2.removeClass('disN')
                btn6.removeClass('disN')
                btn8.removeClass('disN')
                btn10.removeClass('disN')
                $("#eabyPublish_searchForm .ebayPublish-ebayAttr").show();
                eabyPublish_LastTabIndex ==0 && $("#eabyPublish_searchForm select[name=timeType]").html('<option value="CREATE_TIME">创建时间</option><option value="AUDIT_TIME">审核时间</option><option value="LISTING_TIME" selected>刊登时间</option>')
                eabyPublish_LastTabIndex ==0 && $("#eabyPublish_searchForm select[name=timeType]").val('LISTING_TIME')
                // btn9.removeClass('disN')
            } else if (data.index == 3) {
                btn2.removeClass('disN')
                btn8.removeClass('disN')
                $("#eabyPublish_searchForm .ebayPublish-ebayAttr").hide();
                eabyPublish_LastTabIndex ==0 && $("#eabyPublish_searchForm select[name=timeType]").html('<option value="CREATE_TIME">创建时间</option><option value="AUDIT_TIME">审核时间</option><option value="LISTING_TIME" selected>刊登时间</option>')
                eabyPublish_LastTabIndex ==0 && $("#eabyPublish_searchForm select[name=timeType]").val('LISTING_TIME')
                // btn9.removeClass('disN')
            } else if (data.index == 4) {
                btn2.removeClass('disN')
                btn3.removeClass('disN')
                btn4.removeClass('disN')
                btn5.removeClass('disN')
                $("#eabyPublish_searchForm .ebayPublish-ebayAttr").hide();
                eabyPublish_LastTabIndex ==0 && $("#eabyPublish_searchForm select[name=timeType]").html('<option value="CREATE_TIME">创建时间</option><option value="AUDIT_TIME">审核时间</option><option value="LISTING_TIME">刊登时间</option>')
                eabyPublish_LastTabIndex ==0 && $("#eabyPublish_searchForm select[name=timeType]").val('LISTING_TIME')
                    //btn4.removeClass('disN')
                // btn9.removeClass('disN')
            }
            // 全部页签，取消店铺父子sku的条件，其他页签保留  // 在售状态
            if(eabyPublish_LastTabIndex !== data.index){
                let isCurallTab = data.index == 0
                let isLastListingTab = eabyPublish_LastTabIndex == 0
                if((isCurallTab && !isLastListingTab) || (!isCurallTab && isLastListingTab)){
                    let skuSearchList=[
                        {value:'pSkus',label:'父SKU'},
                        {value:'sSkus',label:'模板子SKU'},
                        {value:'storePSkus',label:'店铺父SKU'},
                        {value:'storeSSkus',label:'店铺子SKU'},
                        {value:'cnTitle',label:'商品中文'},
                        {value:'enTitle',label:'商品英文'},
                    ]
                    let saleStatusList = [
                        { value: "2", name: "在售", selected: "selected" },
                        { value: "1", name: "部分在售", selected: "selected" },
                        { value: "0", name: "停售" },
                      ]                      
                    let _skuSearchStr = JSON.parse(JSON.stringify(skuSearchList))
                    let _saleStatusList = JSON.parse(JSON.stringify(saleStatusList))
                    if(data.index == 0){
                        _skuSearchStr = skuSearchList.filter(item=>!item.value.includes('store'))
                        _saleStatusList = saleStatusList.concat({ value: "-1", name: "无映射" })
                    }
                    _skuSearchStr = _skuSearchStr.map(item=>`<option value="${item.value}">${item.label}</option>`).join('')
                    $("#eabyPublish_searchForm select[name=searchType]").html(_skuSearchStr)
                    formSelects.data("ebayPulish_saleStatusList", "local", { arr: _saleStatusList })
                }                           
            }
            eabyPublish_LastTabIndex = data.index
            //TODO 页面查询条件变更 listingStatus
        form.render()
        })
        //导出普源SKU映射
    $("#ebayPublishExportSkuMappingBtn").click(function() {
        layer.open({
            type:1,
            title:'导出SKU映射',
            area:['600px','500px'],
            btn:["确定",'取消'],
            // shadeClose:0,
            content:$('#ebayPublish_exportsku_modal').html(),
            success:function(layero,index){
                form.render()
                laydate.render({
                    elem:'#ebayPublish_exportsku_modal_date',
                    range:true,
                    max:admin.Format(new Date(),'yyyy-MM-dd'),
                    done:function(value,date,endDate){
                       var startTime=value.split(' - ')[0]+' 00:00:00'
                       var endTime=value.split(' - ')[1]+' 23:59:59'
                       var getDaysDiffBetweenDates=(new Date(endTime) - new Date(startTime))/(1000*3600*24)
                        if(getDaysDiffBetweenDates>7) return layer.msg('时间范围7天')
                    }
                })
                render_hp_orgs_users('#ebayPublish_exportsku_modal_form')
                // 销售员
                form.on('select(ep_sellerFilter_exportsku)',function(data){
                    var salePersonId=data.value
                    var platCode='ebay'
                    commonReturnPromise({
                        url:ctx + '/salesplat/listPlatAcctInfosBySalePersonIdAndPlatCode.html',
                        params:{salePersonId,platCode}
                    }).then(res=>{
                        $('#ebayPublish_exportsku_modal_stores').val(res.map(item=>item.storeAcct).join('\n'))
                    }).catch(function(err){
                        layer.msg(err, {icon:2});
                    })
                })
                //显示隐藏下面选项
                form.on('radio(ebayPublish_exportsku_modal_form_radio)',function(data){
                    if(data.value==2){
                        $('#ebayPublish_exportsku_modal_form_hide_show').show()
                    }else{
                        $('#ebayPublish_exportsku_modal_form_hide_show').hide()
                    }
                })
            },
            yes:function(index,layero){
                var exportSKUform= serializeObject($('#ebayPublish_exportsku_modal_form'))
                var tabValueisAll=$('#ebayPublish_tab').find('.layui-this').attr("data-value")=='2'
                if(!exportSKUform.exportType) return layer.msg('请选择导出类型')
                let {exportType}=exportSKUform
                if(exportType == '2'){
                    if(!exportSKUform.storeAcctNameStr) return layer.msg('请输入店铺')
                    if(!exportSKUform.listingDate) return layer.msg('请选择刊登创建时间')
                    var startTime=new Date(exportSKUform.listingDate.split(' - ')[0]+' 00:00:00')
                    var endTime=new Date(exportSKUform.listingDate.split(' - ')[1]+' 23:59:59')
                    var getDaysDiffBetweenDates=(endTime - startTime)/(1000*3600*24)
                    if(getDaysDiffBetweenDates>7) return layer.msg('刊登创建时间范围7天')
                    if(!exportSKUform.listingStatus) return layer.msg('请选择刊登状态')
                }
                if(exportType == '1'){
                    var chooseId=[]
                    var chooseData=table.checkStatus('ebayPublish_table')
                    if(!chooseData.data.length) return layer.msg('需要选择列表项')
                    chooseId=!tabValueisAll?chooseData.data.map(item=>item.id):chooseData.data.map(item=>item.prodPId)
                }
                submitForm({
                    exportType:Number(exportType),
                    endTime:exportType==2?endTime.getTime():'',
                    startTime:exportType==2?startTime.getTime():'',
                    listingStatus:exportType==2?Number(exportSKUform.listingStatus):'',
                    storeAcctNameStr:exportType==2?exportSKUform.storeAcctNameStr.replace(/\r\n/g,","):'',
                    prodPIdList:exportType==1?tabValueisAll?chooseId:[]:[],
                    prodListingEbayIds:exportType==1?tabValueisAll?[]:chooseId:[],
                }, ctx + '/ebaylisting/exportskumapping.html',"_blank");
                layer.msg('下载成功')
                layer.close(index)
            },
        })
    });
    //TODO
    //显示全部错误信息
    $("#ebayPublish_tab").on('click', '.ebayPublish-respMsg pre i', function() {
        var content = "<div style='padding:20px; font-size:15px'><pre>" + $(this).parent("pre").next("pre").text() + "</pre></div>";
        layer.open({
            type: 1,
            title: '错误信息',
            area: ['60%', '80%'],
            content: content
        })
    });

    form.on('checkbox(ebayPulish_worldwilde)', function(data) {
        $(data.elem).parent("div").next("div").find("input").prop("checked", false);
        $(data.elem).parent("div").next("div").find("input").prop("disabled", data.elem.checked);
        form.render('checkbox');
    });
    // 如果页面是静态刷新，可能会影响到这
    table.on('checkbox(ebayPublish_table)', function(obj){
        const { checked, type, data } = obj;
        const tableDom = $('#ebayPublish_table').next()
        if(checked && type === 'all'){ // 全选
            tableDom.find('input[name="prodTempVarietyId"]').prop('checked', true)
        }else if(checked && type === 'one'){ // 选中父checkbox，子checkbox全选
            const trDom = tableDom.find('.layui-table-body>table>tbody>tr').eq(data.LAY_TABLE_INDEX)
            trDom.find('input[name="prodTempVarietyId"]').prop('checked', true)
        }else if(!checked && type === 'all'){ // 全不选
            tableDom.find('input[name="prodTempVarietyId"]').prop('checked', false)
        }else if(!checked && type === 'one'){ // 不选中父checkbox，子checkbox全不选中
            const trDom = tableDom.find('.layui-table-body>table>tbody>tr').eq(data.LAY_TABLE_INDEX)
            trDom.find('input[name="prodTempVarietyId"]').prop('checked', false)
        }
        form.render('checkbox')
    })
    form.on('checkbox(ebayPublish_prodTempVarietyId)', function(data) {
        const { checked } = data.elem;
        const trCheckDom = $(data.elem).parents("tr").last().find("input[name=layTableCheckbox]")
        if(checked){
            // 选中一个子checkbox，父checkbox状态为选中
            if(!trCheckDom.prop("checked")){
                trCheckDom.prop("checked", true);
            }
        }else{
            // 子checkbox全不选的话，父checkbox状态为不选中
            let isNotCheckedAll = true
            $(data.elem).parents("table").eq(0).find("input[name=prodTempVarietyId]").each(function(){
                $(this).prop('checked') && (isNotCheckedAll = false)
            })
            isNotCheckedAll && trCheckDom.prop("checked", false)
        }
        form.render('checkbox');
    });

    form.on('switch(ep_isAttractSku)', function(data) {
        layer.msg("修改引流SKU,请重新更新引流价格");
        if (data.elem.checked) {
            $("#ebayPulish_listDetailForm .sub-sku-ebay tbody tr").each(function() {
                $(this).find("input[name=isAttractSku]").prop("checked", false);
            });
            data.elem.checked = true;
        }
        form.render("checkbox");
    });
    form.on('select(sufixSetType)',function(obj){
        if(obj.value==1||obj.value==3){
            obj.othis.siblings('.replacehide').addClass('hide')
        }else{
            obj.othis.siblings('.replacehide').removeClass('hide')
        }
        // if()
    });
    //选择图片关联属性，渲染表格
    form.on('radio(ep_pictureField)', function(data){
        var currentField = data.value;
        //将其他radio取消选中
        $(data.elem).parents(".pictureFieldDiv").find(".pictureField").prop("checked", false);
        $(data.elem).prop("checked", true);
        layui.form.render("radio");
        $("#ebayPulish_listDetailForm .sub-sku-ebay .specificsField").removeClass("specificsFieldPicture");
        $("#ebayPulish_listDetailForm .sub-sku-ebay .specificsField input[name='specifics'][value="+currentField+"]")
            .parent("th")
            .addClass("specificsFieldPicture");
        $("#ebayPulish_listDetailForm .sub-sku-ebay .specificsField input[name='specifics']").each(function(){
            if($(this).val() == currentField){
                $(this).parent("th").addClass("specificsFieldPicture");
            }
        });
    });
})

/*layui.use结束*/

//生成待刊登
function ebayPublishGenList(prodPId) {
    var layer = layui.layer,
        $ = layui.$;
    var prodPIds = [];
    if(prodPId){
        prodPIds.push(prodPId)
    }else{
        prodPIds = (layui.table.checkStatus('ebayPublish_table').data||[]).map(function(item){
        return item.prodPId
    });
   }
    if (prodPIds.length < 1) {
        layer.msg("未选中商品");
        return;
    }
    var platAcctId = $("#eabyPublish_searchForm select[name=platAcctId]").val();
    var siteId = $("#eabyPublish_searchForm select[name=siteId]").val();
    var isOverSeasWh = $("#eabyPublish_searchForm select[name=isOverSeasWh]").val();
    //弹框输入刊登在线商品数量
    layer.open({
        type: 1,
        title: '生成待刊登商品',
        area: ['30%', '45%'],
        content: "",
        btn: ['生成'],
        success: function(layero, index) {
            layui.form.render();
            $(layero).find('.layui-layer-content').html($("#ebayPulish_genListTpl").html());
            $("#ebayPulish_genListTpl select[name=watermarkImage]");
            var platAcctId = $("#eabyPublish_searchForm select[name=platAcctId]").val();
            // console.log(platAcctId);
            $.ajax({
                type: "post",
                url: ctx + "/watermark/searchWatermarkBySalePlatAcctId.html",
                dataType: "json",
                data: {
                    salesPlatAcctid: platAcctId,
                    waterMarkType: 0
                },
                success: function(data) {
                    ebayPublishInitWatermarkImage(data.data, "ebayPulish_genListTpl_water")
                },
                error: function(e) {
                    console.error(e);
                }
            });
            $.ajax({
                type: "post",
                url: ctx + "/watermark/searchWatermarkBySalePlatAcctId.html",
                dataType: "json",
                data: {
                    salesPlatAcctid: platAcctId,
                    waterMarkType: 1
                },
                success: function(data) {
                    ebayPublishInitWatermarkFont(data.data, "ebayPulish_genListTpl_water");
                },
                error: function(e) {
                    console.error(e);
                }
            });

        },
        yes: function(index, layero) {
            layui.admin.load.show();
            var quantity = $(layero).find("form input[name='quantity']").val();
            var waterImageId = $("#ebayPulish_genListTpl_water select[name=watermarkImage] option:selected").val();
            var waterFontId = $("#ebayPulish_genListTpl_water select[name=watermarkFont] option:selected").val();
            const isSale = $("#ebayPulish_genListTpl_water input[name=isSale]:checked").val()
            var waterIds = "";
            if (waterImageId && waterImageId != '') {
                waterIds = waterImageId;
            }
            if (waterFontId && waterFontId != '') {
                waterIds = waterIds + "," + waterFontId;
            }
            var allowAttract = $(layero).find("input[name=allowAttract]").prop("checked")
            $.ajax({
                type: "post",
                url: ctx + "/ebaylisting/genlisting.html",
                dataType: "json",
                data: {
                    platAcctId: platAcctId,
                    siteId: siteId,
                    isOverSeasWh: isOverSeasWh,
                    isSale,
                    prodPIds: prodPIds.join(","),
                    quantity: quantity,
                    waterIds: waterIds,
                    allowAttract:allowAttract
                },
                success: function(returnData) {
                    layui.admin.load.hide();
                    if (returnData.code != "0000") {
                        layer.msg(returnData.msg, { icon: 2 });
                    } else {
                        layer.close(index);
                        if (returnData.data.length > 0) {
                            layer.alert(returnData.data.join("<br>"), { icon: 7, skin: 'errAlert' });
                        } else {
                            layer.msg("生成待刊登成功");
                        }
                        $("#eabyPublish_search").trigger("click");
                    }
                },
                error: function(XMLHttpRequest) {
                    layui.admin.load.hide();
                    if (XMLHttpRequest.status == 200) {
                        layer.msg("请重新登录", { icon: 7 });
                    } else {
                        layer.msg("服务器错误");
                    }
                }
            });
        }
    })
}

//刊登商品
function ebayPublishListing(id, unConfirm) {
    var layer = layui.layer,
        $ = layui.$;
        var ids = [];
        if(id){
        ids.push(id)
        }else{
        ids = (layui.table.checkStatus('ebayPublish_table').data||[]).map(function(item){
            return item.id
        });
       }
    if (ids.length < 1) {
        layer.msg("未选中商品");
        return;
    }
    if (unConfirm) {
        layui.admin.load.show();
        $.ajax({
            type: "post",
            url: ctx + "/ebaylisting/listing.html",
            dataType: "json",
            data: {
                ids: ids.join(",")
            },
            success: function(returnData) {
                layui.admin.load.hide();
                if (returnData.code != "0000") {
                    layer.alert(returnData.msg, { icon: 2 });
                } else {
                    layer.msg("刊登成功，商品进入刊登流程");
                    $("#eabyPublish_search").trigger("click");
                }

            },
            error: function(XMLHttpRequest) {
                layui.admin.load.hide();

                if (XMLHttpRequest.status == 200) {
                    layer.msg("请重新登录", { icon: 7 });
                } else {
                    layer.msg("服务器错误");
                }
            }
        });
    } else {
        layer.confirm('刊登商品', { icon: 3, btn: ['刊登', '插队刊登', '再想想'] }, function(index) {
            layui.admin.load.show();
            $.ajax({
                type: "post",
                url: ctx + "/ebaylisting/listing.html",
                dataType: "json",
                data: {
                    ids: ids.join(","),
                    listNow: false
                },
                success: function(returnData) {
                    layui.admin.load.hide();
                    if (returnData.code != "0000") {
                        layer.alert(returnData.msg, { icon: 2 });
                    } else {
                        layer.msg("刊登成功，商品进入刊登流程");
                        $("#eabyPublish_search").trigger("click");
                    }

                },
                error: function(XMLHttpRequest) {
                    layui.admin.load.hide();

                    if (XMLHttpRequest.status == 200) {
                        layer.msg("请重新登录", { icon: 7 });
                    } else {
                        layer.msg("服务器错误");
                    }
                }
            });
        }, function(index) {
            if (ids.length > 1) {
                layer.alert("插队刊登每次只允许刊登1个", { icon: 2 });
                return;
            }
            layui.admin.load.show();
            $.ajax({
                type: "post",
                url: ctx + "/ebaylisting/listing.html",
                dataType: "json",
                data: {
                    ids: ids.join(","),
                    listNow: true
                },
                success: function(returnData) {
                    layui.admin.load.hide();
                    if (returnData.code != "0000") {
                        layer.alert(returnData.msg, { icon: 2 });
                    } else {
                        layer.msg("刊登成功，商品进入插队刊登流程");
                        $("#eabyPublish_search").trigger("click");
                    }

                },
                error: function(XMLHttpRequest) {
                    layui.admin.load.hide();

                    if (XMLHttpRequest.status == 200) {
                        layer.msg("请重新登录", { icon: 7 });
                    } else {
                        layer.msg("服务器错误");
                    }
                }
            });
        });
    }
}
//定时刊登商品
function ebayPublishListTiming() {
    var layer = layui.layer,
        $ = layui.$;
        var ids = [];
        ids = (layui.table.checkStatus('ebayPublish_table').data||[]).map(function(item){
            return item.id
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
            $(layero).find('.layui-layer-content').html($("#ebayPulish_listTimingTpl").html());
            //时间选择器
            layui.laydate.render({
                elem: '#ebayPulish_listTiming',
                type: 'datetime',
                format: 'yyyy-MM-dd HH:mm',
                min: layui.admin.Format(new Date().getTime(), "yyyy-MM-dd hh:mm:ss")
            });
        },
        yes: function(index, layero) {
            //保存并发布
            var listTiming = $(layero).find("input[name=listTiming]").val();
            var listInterval = $(layero).find("input[name=listInterval]").val();
            if (!listTiming) {
                layer.msg("定时刊登开始时间为空");
            }
            layui.admin.load.show();
            $.ajax({
                type: "post",
                url: ctx + "/ebaylisting/listtiming.html",
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
                        layer.msg("定时刊登成功");
                        layer.close(index);
                        $("#eabyPublish_search").trigger("click");
                    }
                },
                error: function(XMLHttpRequest) {
                    layui.admin.load.hide();

                    if (XMLHttpRequest.status == 200) {
                        layer.msg("请重新登录", { icon: 7 });
                    } else {
                        layer.msg("服务器错误");
                    }
                }
            });
        }
    })
}
//测算刊登费
function ebayPublishVerifyListing(id) {
    var layer = layui.layer,
        $ = layui.$;
    layui.admin.load.show();
    $.ajax({
        url: ctx + '/ebaylisting/verifylistingfee.html',
        type: 'post',
        dataType: 'json',
        data: { id: id },
        success: function(returnData) {
            layui.admin.load.hide();
            if (returnData.code != "0000") {
                layer.msg(returnData.msg);
                return;
            }
            layer.open({
                type: 1,
                title: '刊登费',
                btn: ['确定'],
                area: ['100%', '100%'],
                content: "加载中...",
                success: function(layero, index) {
                    //填充信息 模板方式
                    layui.laytpl($("#ebayPulish_verifyListingFeeTpl").html()).render(returnData.data, function(html) {
                        $(layero).find('.layui-layer-content').html(html);
                        // layui.form.render();
                    });
                },
                yes: function(index, layero) {
                    layer.close(index);
                }
            })
        },
        error: function(XMLHttpRequest) {
            layui.admin.load.hide();

            if (XMLHttpRequest.status == 200) {
                layer.msg("请重新登录", { icon: 7 });
            } else {
                layer.msg("服务器错误");
            }
        }
    })
}

//删除店铺商品
function ebayPublishDeleteListing(id) {
    var layer = layui.layer,
        $ = layui.$;
        var ids = [];
        if(id){
        ids.push(id)
        }else{
        ids = (layui.table.checkStatus('ebayPublish_table').data||[]).map(function(item){
            return item.id
        });
       }
        if (ids.length < 1) {
            layer.msg("未选中商品");
            return;
        }
    layer.confirm('删除店铺商品', { icon: 3 }, function(index) {
        layui.admin.load.show();
        $.ajax({
            type: "post",
            url: ctx + "/ebaylisting/deletelisting.html",
            dataType: "json",
            data: {
                ids: ids.join(",")
            },
            success: function(returnData) {
                layui.admin.load.hide();
                if (returnData.code != "0000") {
                    layer.alert(returnData.msg, { icon: 2 });
                } else {
                    layer.msg("删除店铺商品成功");
                    $("#eabyPublish_search").trigger("click");
                }

            },
            error: function(XMLHttpRequest) {
                layui.admin.load.hide();

                if (XMLHttpRequest.status == 200) {
                    layer.msg("请重新登录", { icon: 7 });
                } else {
                    layer.msg("服务器错误");
                }
            }
        });
    });

}

//超额转待发布
function ebayPublishOverToUnListing() {
    layer.confirm('将ebay超额导致发布失败的商品转为待发布', { icon: 3 }, function(index) {
        layui.admin.load.show();
        $.ajax({
            type: "post",
            url: ctx + "/ebaylisting/overtounlisting.html",
            dataType: "json",
            success: function(returnData) {
                layui.admin.load.hide();
                layer.msg(returnData.msg);
            },
            error: function(XMLHttpRequest) {
                layui.admin.load.hide();

                if (XMLHttpRequest.status == 200) {
                    layer.msg("请重新登录", { icon: 7 });
                } else {
                    layer.msg("服务器错误");
                }
            }
        });
    });
}
//生成拍卖待刊登
function ebayPublishListingAuction() {
    const {layer, $, form, view} = layui
    var data = [];
    var storeAcctId = $("#eabyPublish_searchForm select[name=platAcctId]").val();
    var siteId = $("#eabyPublish_searchForm select[name=siteId]").val();
    var isOverSeasWh = $("#eabyPublish_searchForm select[name=isOverSeasWh]").val() ==='false' ? false :true;
    $("#ebayPublish_table").next().find("input[name=prodTempVarietyId]:checked").each(function() {
        data.push({
            prodTempVarietyId: $(this).val(),
            prodPId: $(this).data('prodpid'),
            sSku: $(this).data('ssku'),
            isOverSeasWh,
            siteId,
            storeAcctId
        })
    });
    if (!data.length) {
        layer.msg("未选中子模板");
        return;
    }

    window.localStorage.setItem('ebay_genauction', JSON.stringify({type: 'publish', data }))

    //确认框输入
    layer.open({
        type: 1,
        title: '刊登拍卖',
        area: ['80%', '80%'],
        content: "",
        id: Date.now(),
        success: function(layero, index) {
            view(this.id).render('route/iframe/ebay/genauctionModel').done(function() {
                //渲染完成以后执行的函数
                form.render()
            })
        },
    });
}
//取消定时刊登
function ebayPublishCancleListTiming(id) {
    var layer = layui.layer,
        $ = layui.$;
        var ids = [];
        if(id){
        ids.push(id)
        }else{
        ids = (layui.table.checkStatus('ebayPublish_table').data||[]).map(function(item){
            return item.id
        });
       }
    if (ids.length < 1) {
        layer.msg("未选中商品");
        return;
    }
    layer.confirm('取消定时刊登', { icon: 3 }, function(index) {
        layui.admin.load.show();
        $.ajax({
            type: "post",
            url: ctx + "/ebaylisting/canclelisttiming.html",
            dataType: "json",
            data: {
                ids: ids.join(",")
            },
            success: function(returnData) {
                layui.admin.load.hide();
                if (returnData.code != "0000") {
                    layer.msg(returnData.msg, { icon: 2 });
                } else {
                    layer.msg("取消定时刊登成功");
                    $("#eabyPublish_search").trigger("click");
                }

            },
            error: function(XMLHttpRequest) {
                layui.admin.load.hide();

                if (XMLHttpRequest.status == 200) {
                    layer.msg("请重新登录", { icon: 7 });
                } else {
                    layer.msg("服务器错误");
                }
            }
        });
    });
}

// 批量取消刊登
function ebayPublishBatchCancleList() {
    const ids = (layui.table.checkStatus("ebayPublish_table").data || []).map(
      (item) => Number(item.id)
    );
    if (!ids.length) {
      return layui.layer.msg("请选择刊登商品！", { icon: 0 });
    } else {
      commonReturnPromise({
        url: ctx + "/ebaylisting/batchCanclelist",
        type: "post",
        params: JSON.stringify(ids),
        contentType: "application/json",
      }).then((res) => {
        layer.msg(res || "批量取消刊登成功");
        $("#eabyPublish_search").trigger("click");
      });
    }
  }

//取消刊登
function ebayPublishCancleList(id) {
    var layer = layui.layer,
        $ = layui.$;
    var ids = [];
    if(!id){
        return;
    }
    layer.confirm('取消刊登（转为待刊登状态）', { icon: 3 }, function(index) {
        layui.admin.load.show();
        $.ajax({
            type: "post",
            url: ctx + "/ebaylisting/canclelist.html",
            dataType: "json",
            data: {
                id: id
            },
            success: function(returnData) {
                layui.admin.load.hide();
                if (returnData.code != "0000") {
                    layer.msg(returnData.msg, { icon: 2 });
                } else {
                    layer.msg("取消刊登成功");
                    $("#eabyPublish_search").trigger("click");
                }

            },
            error: function(XMLHttpRequest) {
                layui.admin.load.hide();
                if (XMLHttpRequest.status == 200) {
                    layer.msg("请重新登录", { icon: 7 });
                } else {
                    layer.msg("服务器错误");
                }
            }
        });
    });
}


//待生成详情
function ebayPulish_unGenDetail(prodPId) {
    var layer = layui.layer,
        laytpl = layui.laytpl,
        $ = layui.$,
        form = layui.form;
    var siteId = $("#eabyPublish_searchForm select[name=siteId] option:selected").val();
    layer.open({
        type: 1,
        title: '补充信息',
        //id: 'ebayPulish_unGenDetailTpl',
        area: ['30%', '40%'],
        content: "",
        success: function(layero, index) {
            layui.admin.load.show();
            $.ajax({
                url: ctx + '/ebaylisting/getungen.html',
                type: 'post',
                dataType: 'json',
                data: {
                    prodPId: prodPId,
                    siteId: siteId
                },
                success: function(returnData) {
                    layui.admin.load.hide();
                    if (returnData.code != "0000") {
                        $(layero).find('.layui-layer-content').html(returnData.msg);
                        return;
                    }
                    laytpl($("#ebayPulish_unGenDetailTpl").html()).render(returnData.data, function(html) {
                        $(layero).find('.layui-layer-content').html(html);
                        // form.render();
                    });
                }
            });
        },
        yes: function(index, layero) {
            layer.close(index); //如果设定了yes回调，需进行手工关闭
        }
    })
}

//ebay非站点运送方式寄送国家
var ebayShipTo = {};
initEbayShipTo();
//初始化
function initEbayShipTo() {
    // console.log("初始化ebay非站点运送方式寄送国家");
    $.ajax({
        type: "post",
        url: ctx + "/assifieldebay/shipto.html",
        async: true,
        dataType: 'json',
        success: function(returnData) {
            if (returnData.code == "0000") {
                ebayShipTo = returnData.data;
            } else {
                layer.alert(returnData.msg);
            }
        },
        error: function(XMLHttpRequest) {
            layui.admin.load.hide();

            if (XMLHttpRequest.status == 200) {
                layer.msg("请重新登录", { icon: 7 });
            } else {
                layer.msg("服务器错误");
            }
        }
    });
}
//初始化站点运送国家
function selectebayShipTo(siteId, ebayShipToDom, inputName) {
  var countryCodes = ebayShipTo[siteId];
  //封装html
  var str = "";
  for (var i in countryCodes) {
      str += '<input name="' + inputName + '" type="checkbox" title="' + countryCodes[i] + '" value="' + countryCodes[i] + '" lay-skin="primary">';
  }
  //初始化
  ebayShipToDom.html(str);
  layui.form.render();
}
//待发布详情框
function ebayPulish_listDetail(id, readOnly) {
    var layer = layui.layer,
        laytpl = layui.laytpl,
        $ = layui.$,
        form = layui.form
    var btn = [];
    if (!readOnly) {
        btn = ['保存并发布', '保存', '关闭'];
    }
    layer.open({
        type: 1,
        title: '产品详情',
        btn: btn,
        area: ['100%', '100%'],
        content: "加载中...",
        id: 'ebayPulishIdLayer',
        success: function(layero, index) {
            layui.admin.load.show();
            $.ajax({
                url: ctx + '/ebaylisting/getlist.html',
                type: 'post',
                dataType: 'json',
                data: { id: id },
                success: function(returnData) {
                    layui.admin.load.hide();
                    if (returnData.code != "0000") {
                        layer.msg(returnData.msg, { icon: 2 });
                        return;
                    }
                    //填充信息 模板方式
                    laytpl($("#ebayPulish_listDetailTpl").html()).render(returnData.data, function(html) {
                        $(layero).find('.layui-layer-content').html(html);
                        $("#ebayPulish_listDetailForm .ebayPublish_subSkuImg_edit_local").each(function() { //初始化本地按钮
                            ebayPublish_subSkuImg_exchangeLocal($(this));
                        });
                        commonAddEventTitleToggle($('#ebayPulishIdLayer'), 'ebay')
                        ebayPublish_extImg_exchangeLocal($('.ebayPublish_extImg_edit_local'));
                        form.render('radio');
                        $('#ebayPublish_extImg').sortable({
                            cursor: "move", //拖拽时鼠标样式
                            containment: "parent",
                            items: ".imageRight", //定义可拖拽的元素
                            deactivate: function(event, ui) {
                                setMainAndExtVal();
                            },
                        });
                        ebayImgHandle();
                        const prodskuList = Array.from($("#ebayPublish_SubSkuInfo_body tr").map((_, item) => $(item).data("prodssku")))
                        let tplRequestParam = { prodSSkus: prodskuList } 
                        ebayWangEditor = wangEditorRender('wangEditor', '', tplRequestParam); //富文本渲染
                        //选择风格的点击事件
                        $('.ebayPublish_selStyle').on('click', function() {
                            var index = layer.open({
                                type: 1,
                                title: '选择风格',
                                id: 'ebayPublish_selStyleSuccess',
                                area: ['1000px', '660px'],
                                btn: ['保存', '关闭'],
                                content: $('#ebayPublish_selStyleLayer').html(),
                                success: function(layero, index) {
                                    $.ajax({
                                        type: "post",
                                        url: ctx + "/ebaylisting/liststylecate.html",
                                        dataType: 'json',
                                        async: true,
                                        success: function(returnData) {
                                            if (returnData.code != '0000') {
                                                layer.msg(returnData.msg, { icon: 2 });
                                                layer.close(index);
                                            } else {
                                                //分类
                                                var cates = returnData.data;
                                                $('.ebayPublishStyleLeftBar').empty();
                                                for (var i = 0; i < cates.length; i++) {
                                                    var tpl = "<div data-id=':id' class='hoverBgColor'>:cateCnName</div>";
                                                    tpl = tpl.replace(":id", cates[i].id);
                                                    tpl = tpl.replace(":cateCnName", cates[i].cateCnName);
                                                    $('.ebayPublishStyleLeftBar').append(tpl);
                                                    $('.ebayPublishStyleLeftBar').on('click', '.hoverBgColor', function() {
                                                        $(this).addClass('clickBgColor')
                                                        $(this).siblings().removeClass('clickBgColor')
                                                    })
                                                }
                                                //请求风格
                                                $(".ebayPublishStyleLeftBar>div").click(function() {
                                                    var cateId = $(this).data('id');
                                                    layui.admin.load.show();
                                                    $.ajax({
                                                        type: "post",
                                                        url: ctx + "/ebaylisting/liststyle.html",
                                                        data: { cateId: cateId },
                                                        dataType: 'json',
                                                        async: true,
                                                        success: function(returnData) {
                                                            layui.admin.load.hide()
                                                            if (returnData.code != '0000') {
                                                                layer.msg(returnData.msg, { icon: 2 });
                                                                layer.close(index);
                                                            } else {
                                                                var styles = returnData.data;
                                                                $('.ebayPublishStyleRightTem ul').empty();
                                                                for (var i = 0; i < styles.length; i++) {
                                                                    var tpl = "<li><img src=':imgUri' data-id=':id' alt=':name'><br><span>:name</span></li>";
                                                                    tpl = tpl.replace(":imgUri", styles[i].imgUri);
                                                                    tpl = tpl.replace(":id", styles[i].id);
                                                                    tpl = tpl.replace(/:name/g, styles[i].name);
                                                                    $('.ebayPublishStyleRightTem ul').append(tpl);
                                                                }
                                                                //增加触发事件
                                                                $('.ebayPublishStyleRightTem ul li').click(function() {
                                                                    $(this).siblings().find('img').removeClass('et_activeStyle');
                                                                    if ($(this).find('img').hasClass('et_activeStyle')) {
                                                                        $(this).find('img').removeClass('et_activeStyle');
                                                                    } else {
                                                                        $(this).find('img').addClass('et_activeStyle');
                                                                    }
                                                                })
                                                            }
                                                        }
                                                    });
                                                });
                                            }
                                        },
                                        error: function(XMLHttpRequest) {
                                            layui.admin.load.hide();

                                            if (XMLHttpRequest.status == 200) {
                                                layer.msg("请重新登录", { icon: 7 });
                                            } else {
                                                layer.msg("服务器错误");
                                            }
                                        }
                                    });
                                },
                                yes: function() {
                                    var img = $('img.et_activeStyle')
                                    if (!img[0]) {
                                        layer.alert('请选择一个刊登风格')
                                        return false
                                    }
                                    var src = img.attr('src'),
                                        txt = img.attr('alt'),
                                        styleId = img.attr('data-id')
                                    $('#et_moduleStyle').attr('src', src)
                                    $('.et_moduleStyleDesc').val(txt)
                                    $("#ebayPulish_listDetailForm input[name=listingStyleId]").val(styleId);
                                    layer.close(index)
                                }
                            })
                        });
                        //主图添加水印
                        $("#ebayMainImgAddWatermark").on('click', function() {
                            var layer = layui.layer,
                                $ = layui.$;
                            //弹框输入刊登在线商品数量
                            layer.open({
                                type: 1,
                                title: '主图添加水印',
                                area: ['30%', '40%'],
                                content: "",
                                btn: ['生成'],
                                success: function(layero, index) {
                                    layui.form.render();
                                    $(layero).find('.layui-layer-content').html($("#ebayPulish_info_add_water").html());
                                    $("#ebayPulish_genListTpl select[name=watermarkImage]");
                                    // var platAcctId = $("#eabyPublish_searchForm select[name=platAcctId]").val();
                                    var platAcctId = returnData.data.prodListingEbay.storeAcctId;
                                    $.ajax({
                                        type: "post",
                                        url: ctx + "/watermark/searchWatermarkBySalePlatAcctId.html",
                                        dataType: "json",
                                        data: {
                                            salesPlatAcctid: platAcctId,
                                            waterMarkType: 0
                                        },
                                        success: function(data) {
                                            ebayPublishInitWatermarkImage(data.data, "ebayPulish_info_water")
                                        },
                                        error: function(e) {
                                            console.error(e);
                                        }
                                    });
                                    $.ajax({
                                        type: "post",
                                        url: ctx + "/watermark/searchWatermarkBySalePlatAcctId.html",
                                        dataType: "json",
                                        data: {
                                            salesPlatAcctid: platAcctId,
                                            waterMarkType: 1
                                        },
                                        success: function(data) {
                                            ebayPublishInitWatermarkFont(data.data, "ebayPulish_info_water");
                                        },
                                        error: function(e) {
                                            console.error(e);
                                        }
                                    });

                                },
                                yes: function(index, layero) {
                                    layui.admin.load.show();
                                    var imgPath = $("div .imageLeft").find("img")[0].src;
                                    var waterImageId = $("#ebayPulish_info_water select[name=watermarkImage] option:selected").val();
                                    var waterFontId = $("#ebayPulish_info_water select[name=watermarkFont] option:selected").val();
                                    var watermarkIds = "";
                                    if (waterImageId && waterImageId != '') {
                                        watermarkIds = waterImageId;
                                    }
                                    if (waterFontId && waterFontId != '') {
                                        watermarkIds = watermarkIds + "," + waterFontId;
                                    }
                                    // console.log(imgPath);
                                    // console.log(watermarkIds);
                                    $.ajax({
                                        type: "post",
                                        url: ctx + "/watermark/getWatermarkImgPath.html",
                                        dataType: "json",
                                        data: {
                                            imgPath: imgPath,
                                            watermarkIds: watermarkIds,
                                            platCode: "ebay"
                                        },
                                        success: function(returnData) {
                                            layui.admin.load.hide();
                                            if (returnData.code != "0000") {
                                                layer.msg(returnData.msg, { icon: 2 });
                                            } else {
                                                layer.close(index);
                                                $($("div .imageLeft").find("img")[0]).attr('src', returnData.data + "?" + new Date().getTime());
                                                $('#ebayPulish_listDetailForm input[name="mainImgUri"]').val(returnData.data);
                                                // if(returnData.data.length>0){
                                                //     layer.alert(returnData.data.join("<br>"),{icon:7});
                                                // }else{
                                                //     layer.msg("生成待刊登成功");
                                                // }
                                                // $("#eabyPublish_search").trigger("click");
                                            }
                                        },
                                        error: function(XMLHttpRequest) {
                                            layui.admin.load.hide();
                                            if (XMLHttpRequest.status == 200) {
                                                layer.msg("请重新登录", { icon: 7 });
                                            } else {
                                                layer.msg("服务器错误");
                                            }
                                        }
                                    });
                                }
                            })
                        });
                        initSubSkuSpecitics(returnData.data.subSkuEbayDtos);
                   
                    //填充信息 js方式
                    var prodListingEbay = returnData.data.prodListingEbay;
                    //初始化运送国家
                    var siteId = prodListingEbay.siteId;
                    // console.log('siteId', siteId);
                    selectebayShipTo(siteId, $(layero).find("form .ebayShipTo1"), "intShip1ToLocal");
                    selectebayShipTo(siteId, $(layero).find("form .ebayShipTo2"), "intShip2ToLocal");
                    selectebayShipTo(siteId, $(layero).find("form .ebayShipTo3"), "intShip3ToLocal");
                    selectebayShipTo(siteId, $(layero).find("form .ebayShipTo4"), "intShip4ToLocal");
                    selectebayShipTo(siteId, $(layero).find("form .ebayShipTo5"), "intShip5ToLocal");

                    //非站点运输国家
                    if (prodListingEbay.intShip1ToLocal) {
                        var intShip1ToLocal = prodListingEbay.intShip1ToLocal.split(",");
                        for (var i = 0; i < intShip1ToLocal.length; i++) {
                            $(layero).find("form input[name=intShip1ToLocal][value=" + intShip1ToLocal[i] + "]").prop("checked", true);
                        }
                    }
                    if (prodListingEbay.intShip2ToLocal) {
                        var intShip2ToLocal = prodListingEbay.intShip2ToLocal.split(",");
                        for (var i = 0; i < intShip2ToLocal.length; i++) {
                            $(layero).find("form input[name=intShip2ToLocal][value=" + intShip2ToLocal[i] + "]").prop("checked", true);
                        }
                    }
                    if (prodListingEbay.intShip3ToLocal) {
                        var intShip3ToLocal = prodListingEbay.intShip3ToLocal.split(",");
                        for (var i = 0; i < intShip3ToLocal.length; i++) {
                            $(layero).find("form input[name=intShip3ToLocal][value=" + intShip3ToLocal[i] + "]").prop("checked", true);
                        }
                    }
                    if (prodListingEbay.intShip4ToLocal) {
                        var intShip4ToLocal = prodListingEbay.intShip4ToLocal.split(",");
                        for (var i = 0; i < intShip4ToLocal.length; i++) {
                            $(layero).find("form input[name=intShip4ToLocal][value=" + intShip4ToLocal[i] + "]").prop("checked", true);
                        }
                    }
                    if (prodListingEbay.intShip5ToLocal) {
                        var intShip5ToLocal = prodListingEbay.intShip5ToLocal.split(",");
                        for (var i = 0; i < intShip5ToLocal.length; i++) {
                            $(layero).find("form input[name=intShip5ToLocal][value=" + intShip5ToLocal[i] + "]").prop("checked", true);
                        }
                    }
                    //刊登风格
                    if (prodListingEbay.listingStyleId) {
                        $.ajax({
                            type: "post",
                            url: ctx + "/ebaylisting/getstyle.html",
                            async: true,
                            dataType: 'json',
                            data: { id: prodListingEbay.listingStyleId },
                            success: function(returnData) {
                                if (returnData.code != "0000") {
                                    layer.msg(returnData.msg);
                                    return;
                                }
                                $("#ebayPulish_listDetailForm input[name=listingStyleId]").val(returnData.data.id);
                                $("#ebayPulish_listDetailForm input[name=listingStyleName]").val(returnData.data.name);
                                $('#et_moduleStyle').attr('src', returnData.data.imgUri);
                            },
                            error: function(XMLHttpRequest) {
                                layui.admin.load.hide();

                                if (XMLHttpRequest.status == 200) {
                                    layer.msg("请重新登录", { icon: 7 });
                                } else {
                                    layer.msg("服务器错误");
                                }
                            }
                        });
                    }

                    //销售模板
                    $.ajax({
                        type: "post",
                        url: ctx + "/assifieldebay/listinfo.html",
                        async: true,
                        dataType: 'json',
                        success: function(returnData) {
                            if (returnData.code != "0000") {
                                layer.msg(returnData.msg);
                                return;
                            }
                            var assiFieldEbays = returnData.data;
                            for (var i = 0; i < assiFieldEbays.length; i++) {
                                var tpl = "<option value='" + assiFieldEbays[i].id + "'>" + assiFieldEbays[i].name + "</option>";
                                $("#ebayPulish_listDetailForm select[name=assiFieldInfoId]").append(tpl);
                            }
                            if (prodListingEbay.assiFieldInfoId) {
                                $("#ebayPulish_listDetailForm select[name=assiFieldInfoId]").val(prodListingEbay.assiFieldInfoId);
                            }
                            // form.render();
                            form.render('select');
                        },
                        error: function(XMLHttpRequest) {
                            layui.admin.load.hide();

                            if (XMLHttpRequest.status == 200) {
                                layer.msg("请重新登录", { icon: 7 });
                            } else {
                                layer.msg("服务器错误");
                            }
                        }
                    });
                    setMainAndExtVal();
                    //预览销售风格
                    $("#ebayPulish_previewStyleBtn").click(function() {
                        var prodListingEbayId = prodListingEbay.id;
                        var assiFieldInfoId = $("#ebayPulish_listDetailForm select[name=assiFieldInfoId]").val();
                        var listingStyleId = $("#ebayPulish_listDetailForm input[name=listingStyleId]").val();
                        var url = ctx + "/ebaylisting/previewstyle.html?prodListingEbayId=" +
                            prodListingEbayId +
                            "&listingStyleId=" +
                            listingStyleId +
                            "&assiFieldInfoId=" +
                            assiFieldInfoId;
                        window.open(url, "_blank");
                    });
                    //应用公共模块
                    var assiFieldShipMap = {};
                    $.ajax({
                        type: "post",
                        url: ctx + "/assifieldebay/listsiteship.html",
                        dataType: 'json',
                        data: { siteId: siteId },
                        success: function(returnData) {
                            if (returnData.code != "0000") {
                                layer.msg(returnData.msg);
                            } else {
                                var str = '<option value=""></value>';
                                for (var i = 0; i < returnData.data.length; i++) {
                                    assiFieldShipMap[returnData.data[i].id] = returnData.data[i];
                                    str += '<option value="' + returnData.data[i].id + '">' + returnData.data[i].name + '</option>';
                                }
                                $("#ebayPulish_listDetailForm select[name=shippingTpl]").html(str);
                            }
                        },
                        error: function(XMLHttpRequest) {
                            layui.admin.load.hide();

                            if (XMLHttpRequest.status == 200) {
                                layer.msg("请重新登录", { icon: 7 });
                            } else {
                                layer.msg("服务器错误");
                            }
                        }
                    });
                    $("#ebayPublish_applyShipping").click(function() {
                        var shippingTplId = $("#ebayPulish_listDetailForm select[name=shippingTpl]").val();
                        if (!shippingTplId) {
                            layer.msg("未选中物流模板");
                            return;
                        }
                        var assiFieldShip = assiFieldShipMap[shippingTplId];
                        //国内1
                        $("#ebayPulish_listDetailForm input[name=shippingService1]").val(assiFieldShip.shipSrv1);
                        $("#ebayPulish_listDetailForm input[name=shippingSrv1Cost]").val(assiFieldShip.shipSrv1Cost);
                        $("#ebayPulish_listDetailForm input[name=shippingSrv1AddiCost]").val(assiFieldShip.shipSrv1AddedCost);
                        //国内2
                        $("#ebayPulish_listDetailForm input[name=shippingService2]").val(assiFieldShip.shipSrv2);
                        $("#ebayPulish_listDetailForm input[name=shippingSrv2Cost]").val(assiFieldShip.shipSrv2Cost);
                        $("#ebayPulish_listDetailForm input[name=shippingSrv2AddiCost]").val(assiFieldShip.shipSrv2AddedCost);
                        //国内运输方式3
                        $("#ebayPulish_listDetailForm input[name=shippingService3]").val(assiFieldShip.shipSrv3);
                        $("#ebayPulish_listDetailForm input[name=shippingSrv3Cost]").val(assiFieldShip.shipSrv3Cost);
                        $("#ebayPulish_listDetailForm input[name=shippingSrv3AddiCost]").val(assiFieldShip.shipSrv3AddedCost);
                        //国内运输方式4
                        $("#ebayPulish_listDetailForm input[name=shippingService4]").val(assiFieldShip.shipSrv4);
                        $("#ebayPulish_listDetailForm input[name=shippingSrv4Cost]").val(assiFieldShip.shipSrv4Cost);
                        $("#ebayPulish_listDetailForm input[name=shippingSrv4AddiCost]").val(assiFieldShip.shipSrv4AddedCost);
                        //境外1
                        $("#ebayPulish_listDetailForm input[name=intShippingService1]").val(assiFieldShip.intlShipSrv1);
                        $("#ebayPulish_listDetailForm input[name=intShippingSrv1Cost]").val(assiFieldShip.intlShipSrv1Cost);
                        $("#ebayPulish_listDetailForm input[name=intShippingSrv1AddiCost]").val(assiFieldShip.intlShipSrv1AddedCost);
                        $("#ebayPulish_listDetailForm input[name=intShip1ToLocal]").prop("checked", false);
                        if (assiFieldShip.intlShip1ToCountries) {
                            var intlShip1ToCountries = assiFieldShip.intlShip1ToCountries.split(",");
                            for (var i = 0; i < intlShip1ToCountries.length; i++) {
                                $("#ebayPulish_listDetailForm input[name=intShip1ToLocal][value=" + intlShip1ToCountries[i] + "]").prop("checked", true);
                            }
                        }
                        //境外2
                        $("#ebayPulish_listDetailForm input[name=intShippingService2]").val(assiFieldShip.intlShipSrv2);
                        $("#ebayPulish_listDetailForm input[name=intShippingSrv2Cost]").val(assiFieldShip.intlShipSrv2Cost);
                        $("#ebayPulish_listDetailForm input[name=intShippingSrv2AddiCost]").val(assiFieldShip.intlShipSrv2AddedCost);
                        $("#ebayPulish_listDetailForm input[name=intShip2ToLocal]").prop("checked", false);
                        if (assiFieldShip.intlShip2ToCountries) {
                            var intlShip2ToCountries = assiFieldShip.intlShip2ToCountries.split(",");
                            for (var i = 0; i < intlShip2ToCountries.length; i++) {
                                $("#ebayPulish_listDetailForm input[name=intShip2ToLocal][value=" + intlShip2ToCountries[i] + "]").prop("checked", true);
                            }
                        }
                        //境外运输方式3
                        $("#ebayPulish_listDetailForm input[name=intShippingService3]").val(assiFieldShip.intlShipSrv3);
                        $("#ebayPulish_listDetailForm input[name=intShippingSrv3Cost]").val(assiFieldShip.intlShipSrv3Cost);
                        $("#ebayPulish_listDetailForm input[name=intShippingSrv3AddiCost]").val(assiFieldShip.intlShipSrv3AddedCost);
                        $("#ebayPulish_listDetailForm input[name=intShip3ToLocal]").prop("checked", false);
                        if (assiFieldShip.intlShip3ToCountries) {
                            var intlShip3ToCountries = assiFieldShip.intlShip3ToCountries.split(",");
                            for (var i = 0; i < intlShip3ToCountries.length; i++) {
                                $("#ebayPulish_listDetailForm input[name=intShip3ToLocal][value=" + intlShip3ToCountries[i] + "]").prop("checked", true);
                            }
                        }

                        //境外运输方式4
                        $("#ebayPulish_listDetailForm input[name=intShippingService4]").val(assiFieldShip.intlShipSrv4);
                        $("#ebayPulish_listDetailForm input[name=intShippingSrv4Cost]").val(assiFieldShip.intlShipSrv4Cost);
                        $("#ebayPulish_listDetailForm input[name=intShippingSrv4AddiCost]").val(assiFieldShip.intlShipSrv4AddedCost);
                        $("#ebayPulish_listDetailForm input[name=intShip4ToLocal]").prop("checked", false);
                        if (assiFieldShip.intlShip4ToCountries) {
                            var intlShip4ToCountries = assiFieldShip.intlShip4ToCountries.split(",");
                            for (var i = 0; i < intlShip4ToCountries.length; i++) {
                                $("#ebayPulish_listDetailForm input[name=intShip4ToLocal][value=" + intlShip4ToCountries[i] + "]").prop("checked", true);
                            }
                        }

                        //境外运输方式5
                        $("#ebayPulish_listDetailForm input[name=intShippingService5]").val(assiFieldShip.intlShipSrv5);
                        $("#ebayPulish_listDetailForm input[name=intShippingSrv5Cost]").val(assiFieldShip.intlShipSrv5Cost);
                        $("#ebayPulish_listDetailForm input[name=intShippingSrv5AddiCost]").val(assiFieldShip.intlShipSrv5AddedCost);
                        $("#ebayPulish_listDetailForm input[name=intShip5ToLocal]").prop("checked", false);
                        if (assiFieldShip.intlShip5ToCountries) {
                            var intlShip5ToCountries = assiFieldShip.intlShip5ToCountries.split(",");
                            for (var i = 0; i < intlShip5ToCountries.length; i++) {
                                $("#ebayPulish_listDetailForm input[name=intShip5ToLocal][value=" + intlShip5ToCountries[i] + "]").prop("checked", true);
                            }
                        }
                        form.render();
                    });

                    $("#ebayPublish_batchChangePriceBtn").click(function() {
                        var operator = $(this).parents(".pricemodify").find("select[name=operator]").val();
                        var deviation = $(this).parents(".pricemodify").find("input[name=deviation]").val();
                        if (!deviation) {
                            layer.msg("数字有误");
                            return;
                        }
                        deviation = parseFloat(deviation);
                        $("#ebayPulish_listDetailForm .sub-sku-ebay tbody tr").each(function() {
                            var buyItNowPrice = parseFloat($(this).find("input[name=buyItNowPrice]").val());
                            if (operator == "=") {
                                buyItNowPrice = (deviation).toFixed(2);
                            } else if (operator == "+") {
                                buyItNowPrice = (buyItNowPrice + deviation).toFixed(2);
                            } else if (operator == "-") {
                                buyItNowPrice = (buyItNowPrice - deviation).toFixed(2);
                            } else if (operator == "*") {
                                buyItNowPrice = (buyItNowPrice * deviation).toFixed(2);
                            } else if (operator == "/") {
                                buyItNowPrice = (buyItNowPrice / deviation).toFixed(2);
                            }
                            if (buyItNowPrice < 0) {
                                buyItNowPrice = 0;
                            }
                            $(this).find("input[name=buyItNowPrice]").val(buyItNowPrice);
                        });
                    });
                    $("#ebayPublish_batchChangeQuantityBtn").click(function() {
                        var operator = $(this).parents(".numbermodify").find("select[name=operator]").val();
                        var deviation = $(this).parents(".numbermodify").find("input[name=deviation]").val();
                        if (!deviation) {
                            layer.msg("数字有误");
                            return;
                        }
                        deviation = parseFloat(deviation);
                        $("#ebayPulish_listDetailForm .sub-sku-ebay tbody tr").each(function() {
                            var quantity = parseFloat($(this).find("input[name=quantity]").val());
                            if (operator == "=") {
                                quantity = (deviation).toFixed(0);
                            } else if (operator == "+") {
                                quantity = (quantity + deviation).toFixed(0);
                            } else if (operator == "-") {
                                quantity = (quantity - deviation).toFixed(0);
                            } else if (operator == "*") {
                                quantity = (quantity * deviation).toFixed(0);
                            } else if (operator == "/") {
                                quantity = (quantity / deviation).toFixed(0);
                            }
                            $(this).find("input[name=quantity]").val(quantity);
                        });
                    });
                    form.render();
                    //初始化title字数提示
                    $('#ebayPulish_listDetailForm input[name=title]').trigger('input');
                    $('#editspecifics').click(function() {
                        var specifics = $('textarea[name="specifics"]').val()
                        editspecific(prodListingEbay.category1, siteId, specifics)
                    })
                    //使用店铺不寄送国家
                    $("#ebay_exclude_country").on( 'click',function () {
                        layui.admin.load.show();
                        var storeAcctId = returnData.data.prodListingEbay.storeAcctId;
                        $.ajax({
                            type : "post" ,
                            url: ctx + "/ebaylisting/getExcludeShippingLocation.html",
                            data :{platId : storeAcctId},
                            dataType : "json" ,
                            success : function (returnData) {
                                layui.admin.load.hide();
                                if (returnData.code !== "0000"){
                                    layer.msg("使用店铺不寄送国家失败;" + returnData.msg, {icon: 2});
                                    return;
                                }
                                $("#ebay_listing_not_ship_to_countries_textarea").val(returnData.data);
                                layer.msg("使用店铺不寄送国家设置成功", {icon: 1});
                            },
                            error : function (XMLHttpRequest) {
                                layui.admin.load.hide();
                                if (XMLHttpRequest.status == 200) {
                                    layer.msg("请重新登录", { icon: 7 });
                                } else {
                                    layer.msg("服务器错误");
                                }
                            }
                        });
                    });

                    //初始化默认毛利率
                    //销售模板
                    // $.ajax({
                    //     type: "post",
                    //     url: ctx + "/ebaylisting/getDefaultGrossProfitRate.html",
                    //     async: true,
                    //     dataType: 'json',
                    //     data: { id: id },
                    //     success: function (returnData) {
                    //         if (returnData.code != "0000") {
                    //             layer.msg(returnData.msg);
                    //             return;
                    //         }else{
                    //             $('#ebayPulish_listDetailForm input[name=defaultGrossProfitRate]').val(returnData.data);
                    //         }
                    //     }
                    // });
                    $("#ebayPublish_add_sub_btn").click(function(){
                        ebayPublish_addSubListing();
                    });

                    // 定价方式
                    commonReturnPromise({
                        url:ctx+`/plat/platListingPriceFormulaConfig/listFormulaConfig`,
                        type: 'post',
                        contentType: "application/json;charset=UTF-8",
                        params: JSON.stringify({
                          platCode: 'ebay',
                          salesSite: returnData.data.prodListingEbay.siteId,
                          page:1,
                          limit:1000,
                          storeWarehousesType: '',
                          storeAcctType: '',
                          logisAttrList: ''
                        })
                    }).then(res=>{
                        if(res && res.length){
                            let listFormulaOption = ''
                            res.forEach(item=>{
                                listFormulaOption += `<option value='${item.id}'>${item.formula}</option>`
                            })
                            $(layero).find('select[name=platListingPriceFormulaConfigId]').html(listFormulaOption)
                            form.render()
                        }
                    });
                  });
                }
            });
        },
        yes: function(index, layero) {
            //保存并发布
            ebayPulish_saveListDetail(index, layero, true);
        },
        btn2: function(index, layero) {
            //保存
            ebayPulish_saveListDetail(index, layero, false);
        }
    })
}

//编辑specific弹框
function editspecific(categoryid, siteId, specifics) {
    //获取到类目1,类目2的id和内容
    let categoryId1 = $('#ebayPulish_listDetailForm input[name="category1"]').val();
    let categoryId2 = $('#ebayPulish_listDetailForm input[name="category2"]').val();
    let category1Name = $('#ebayPulish_listDetailForm .category1Name').text();
    let category2Name = $('#ebayPulish_listDetailForm .category2Name').text();
    layer.open({
        type: 1,
        title: '编辑specific',
        content: $("#publish_editspecific").html(),
        btn: ['保存', '取消'],
        area: ['70%', '90%'],
        success: function(layero, index) {
            $('#ee_editspecificForm input[name=siteId]').val(siteId);
                    //类目赋值
                    if(categoryid){
                        $("#publish_ebayCateId1").val(categoryId1);
                        $("#publish_ebayCateId2").val(categoryId2);
                        $("#publish_ebayCateText1").html(category1Name);
                        $("#publish_ebayCateText2").html(category2Name);
                    }
                    //ebay类目与specifics处理
                    $('#publish_ebayCateIdBtn1').click(function() {
                        layui.admin.itemCat_select('ebayCateSelect1',
                        'publish_ebayCateId1',
                        'publish_ebayCateText1',
                        "/prodcate/getEbayCateList.html?siteId="+siteId,
                        "/prodcate/searchEbayCate.html?siteId="+siteId);
                    });
                    $('#publish_ebayCateIdBtn2').click(function() {
                        layui.admin.itemCat_select('ebayCateSelect2',
                        'publish_ebayCateId2',
                        'publish_ebayCateText2',
                        "/prodcate/getEbayCateList.html?siteId="+siteId,
                        "/prodcate/searchEbayCate.html?siteId="+siteId);
                    })
                    $("#publish_ebayCateText1").change(function(){
                        //根据cateId, siteId获取分类属性
                        //$(this).html($(this).text());
                        initSpecificAttr($("#publish_ebayCateId1").val(), siteId,specifics);
                    });
                    $("#publish_ebayCateText2").change(function(){
                        //$(this).html($(this).text());
                    });
                        //查询分类
                $(layero).find('#publish_ebayCateSearch1,#publish_ebayCateSearch2').click(function(event){
    // $("body").on("click","#publish_ebayCateSearch1,#publish_ebayCateSearch2",function(event){
        event.preventDefault();
        event.stopPropagation();
        var sourceDom = $(this);
        var currentTitle = $('#ebayPulish_listDetailForm input[name="title"]').val()
        layer.open({
            type: 1,
            title: '搜索ebay分类',
            content: $("#publish_ebayCateSearchTpl").html(),
            area: ['65%', '60%'],
            success: function(layero,index){
                //搜索事件
                $(layero).find("input[name=sourceBtnId]").val(sourceDom.attr("id"));
                $(layero).find("button").click(function(){
                    var title = $(layero).find("input[name='title']").val();
                    // var siteId = $('#publish_editAssiDataForm input[name=siteId]').val();
                    layui.table.render({
                        elem: '#publish_ebayCateSearchTable'
                        ,method: 'post'
                        ,url: ctx + '/ebaylisting/assidata/seatchebaycategroy.html' //数据接口
                        ,where:{
                            title:title,
                            siteId:siteId
                        }
                        ,method: 'post'
                        ,page: false
                        ,cols: [[ //表头
                          {field: 'id', title: 'ID',width:'10%'},
                          {field: 'categoryName', title: '类目',width:'80%'},
                          {field: 'percentItem', title: '操作', width: '10%',
                          templet:'<div>{{d.percentItem}}% <a data-id="{{d.id}}" class="selectCategory" href="javascrpt:;" style="color:blue">选择</a></div>'}
                        ]]
                        ,done: function(res){
                            $(layero).find(".selectCategory").click(function(){
                                var sourceBtnId = $(layero).find("input[name=sourceBtnId]").val();
                                if(sourceBtnId == "publish_ebayCateSearch1"){
                                    $("#publish_ebayCateId1").val($(this).data("id"));
                                    $("#publish_ebayCateText1").html($(this).parents("tr").find("td[data-field=categoryName] div").html());
                                    $("#publish_ebayCateText1").trigger('change');
                                }else if(sourceBtnId == "publish_ebayCateSearch2"){
                                    $("#publish_ebayCateId2").val($(this).data("id"));
                                    $("#publish_ebayCateText2").html($(this).parents("tr").find("td[data-field=categoryName] div").html());
                                    $("#publish_ebayCateText2").trigger('change');
                                }
                                layer.close(index);
                            });
                        }
                    });
                });
                //如果currentTitle有值，默认搜索
                if(currentTitle && currentTitle.length>5){
                  $(layero).find("input[name='title']").val(currentTitle);
                  $(layero).find("button").trigger("click");
                }
            },
        });
    });
            initSpecificAttr(categoryid, siteId, specifics);
            layui.form.render();
        },
        yes: function(index, layero) {
            //封装specific
            var dataArr = []
            var data = pubulishserializeObject($('#ee_editspecificForm'))
            var ebayCateId1 = data.ebayCateId1
            var ebayCateId2 = data.ebayCateId2
            $('#ebayPulish_listDetailForm input[name="category1"]').val(ebayCateId1)
            $('#ebayPulish_listDetailForm input[name="category2"]').val(ebayCateId2)
            $('#ebayPulish_listDetailForm .category1Name').text($('#publish_ebayCateText1').text());
            $('#ebayPulish_listDetailForm .category2Name').text($('#publish_ebayCateText2').text());
            delete data.ebayCateId1
            delete data.ebayCateId2
            var customAttrName = (data.customAttrName || "").split('_#|#_')
            var customAttrValue = (data.customAttrValue || "").split('_#|#_')
            for (var i in data) {
                if (i && data[i] !== "" && i !== "customAttrName" && i !== "customAttrValue") {
                    dataArr.push(i + ':' + data[i])
                }
            }
            for (var i in customAttrName) {
                for (var j in customAttrValue) {
                    if (i === j && customAttrName[i] !== "") {
                        dataArr.push(customAttrName[i] + ':' + customAttrValue[j])
                    }
                }
            }
            $('textarea[name="specifics"]').val(dataArr.join('\n'))
            layer.close(index)
            return false
        }
    });
}

function pubulishserializeObject(form) {
    var o = {}
    $.each(form.serializeArray(), function(index) {
        if (o[this['name']]) {
            o[this['name']] = o[this['name']] + '_#|#_' + this['value']
        } else {
            o[this['name']] = this['value']
        }
    })
    return o
}

function initSpecificAttr(ebayCateId, siteId, specifics) {
    if (!ebayCateId) {
        return;
    }
    layui.admin.load.show();
    $.ajax({
        type: "post",
        url: ctx + "/ebaylisting/assidata/listebaycatespecifics.html",
        async: true,
        dataType: "json",
        data: {
            cateId: ebayCateId,
            siteId: siteId
        },
        success: function(returnData) {
            layui.admin.load.hide()
            if (returnData.code != "0000") {
                layer.msg(returnData.msg);
                return;
            }
            var attrList = returnData.data;
            $("#ee_editspecificForm .ebayCateSpecifics .layui-card-body").empty();
            for (var i = 0; i < attrList.length; i++) {
                //单选可输入
                var inputTpl = '<div class="layui-form-item">' +
                    '<label class="layui-form-label">:attrName</label>' +
                    '<div class="layui-input-inline dropdown-datalist">' +
                    '<input type="text" class="layui-input" name=":attrName">' +
                    '<ul>' +
                    ':optionList' +
                    '</ul>' +
                    '</div>' +
                    '<div class="layui-form-mid layui-word-aux" style="float: none; display: inline;">:description</div>' +
                    '</div>';
                //单选不可输入
                var selectTpl = '<div class="layui-form-item">' +
                    '<label class="layui-form-label">:attrName</label>' +
                    '<div class="layui-input-inline">' +
                    '    <select name=":attrName">' +
                    ':optionList' +
                    '    </select>' +
                    '</div>' +
                    '<div class="layui-form-mid layui-word-aux" style="float: none; display: inline;">:description</div>' +
                    '</div>';
                //多选可输入
                var muliSelectTpl = '<div class="layui-form-item">' +
                    '<label class="layui-form-label">:attrName</label>' +
                    '<div class="layui-input-block">' +
                    '  :inputList' +
                    '  <div class="layui-input-inline" style="float: none;margin-top: 3px;">' +
                    '      <input type="text" name=":attrName" class="layui-input" placeholder="自定义属性">' +
                    '  </div>' +
                    '<div class="layui-form-mid layui-word-aux" style="float: none; display: inline;">:description</div>' +
                    '</div>' +
                    '</div>';
                //多选不可输入
                var muliSelectOnlyTpl = '<div class="layui-form-item">' +
                    '<label class="layui-form-label">:attrName</label>' +
                    '<div class="layui-input-block">' +
                    '  :inputList' +
                    '<div class="layui-form-mid layui-word-aux" style="float: none; display: inline;">:description</div>' +
                    '</div>' +
                    '</div>';
                var attr = attrList[i];
                var dom = "";
                var isMulti = attr.itemToAspectCardinality=="MULTI";
                var isMust = attr.isVariMustAttr==1;
                var description = "";
                if (isMust) {
                    description += "必填";
                }
                if (isMulti) {
                    description += "多选";
                }
                if (isMulti) {
                    if (attr.aspectMode == 'FREE_TEXT') {
                        //多选可填写
                        dom = muliSelectTpl;
                    } else {
                        //多选不可填
                        dom = muliSelectOnlyTpl;
                    }
                    var inputList = '';
                    attr.attrValList.split("#|").forEach(function(attrVal) {
                        inputList += '<input type="checkbox" name=":attrName" value="' + attrVal + '"  lay-skin="primary" title="' + attrVal + '">';
                    });
                    dom = dom.replace(":inputList", inputList);
                } else {
                    if (attr.aspectMode == 'FREE_TEXT') {
                        //单选可填写
                        dom = inputTpl;
                        let optionList = '';
                        attr.attrValList.split("#|").forEach(function(attrVal) {
                          if(attrVal.trim() != ''){
                            optionList += '<li>' + attrVal + '</li>';
                          }
                        });
                        dom = dom.replace(":optionList", optionList);
                    } else {
                        //单选不可填写
                        dom = selectTpl;
                        // let optionList = '';
                        var optionList = '<option value="">请选择</option>';
                        attr.attrValList.split("#|").forEach(function(attrVal) {
                            optionList += '<option value="' + attrVal + '">' + attrVal + '</option>';
                        });
                        dom = dom.replace(":optionList", optionList);
                    }
                }
                dom = dom.replace(":description", description);
                dom = dom.replace(/:attrName/g, attr.attrName);

                $("#ee_editspecificForm .ebayCateSpecifics .layui-card-body").append(dom);
            }
            //清除自定义属性
            $("#ee_editspecificForm .ebayCustomSpecifics .layui-card-body").empty();
            //specifics赋值
            var attr = getSpecifics(specifics);
            for (var attrName in attr) {
                var attrValue = attr[attrName];
                var attrDom = $("#ee_editspecificForm .ebayCateSpecifics").find("input[name='" + attrName + "']");
                if (attrDom.length > 1) {
                    //多选checkbox处理
                    var selfVals = [];
                    attrValue.split(',').forEach(function(v) {
                        var dom = $("#ee_editspecificForm .ebayCateSpecifics")
                            .find("input[name='" + attrName + "'][value='" + v + "']");
                        if (dom.length > 0) {
                            dom.prop("checked", true);
                        } else {
                            selfVals.push(v);
                        }
                    });
                    //自定义属性
                    $("#ee_editspecificForm .ebayCateSpecifics")
                        .find("input[name='" + attrName + "'][type=text]").val(selfVals.join(","));
                } else if (attrDom.length == 1) {
                    //input text处理
                    $("#ee_editspecificForm .ebayCateSpecifics")
                        .find("input[name='" + attrName + "'][type=text]").val(attrValue);
                } else {
                    //select处理
                    attrDom = $("#ee_editspecificForm .ebayCateSpecifics").find("select[name='" + attrName + "']");
                    if (attrDom.length > 0) {
                        attrDom.val(attrValue);
                    } else {
                        //自定义属性
                        addCustomAttr(attrName, attrValue);
                    }

                }
            }
            layui.form.render();
            const dropdowns = document.querySelectorAll(".dropdown-datalist");
            dropdowns.forEach((dropdown) => {
              new Dropdown(dropdown);
            });
        }
    });

}

function getSpecifics(specificsStr) {
    var attr = {};
    if (specificsStr) {
        specificsStr.split("\n").forEach(function(v) {
            attr[v.split(":")[0]] = v.split(":")[1];
        });
    }
    return attr;
}

function addCustomAttr(attrName, attrValue) {
    var tpl = '<div class="layui-form-item">' +
        '         <label class="layui-form-label"></label>' +
        '         <div class="layui-inline">' +
        '             <div class="layui-input-inline">' +
        '                 <input type="text" name="customAttrName" value=":attrName" placeholder="自定义属性名称" autocomplete="off" class="layui-input">' +
        '             </div>' +
        '             <div class="layui-form-mid">-</div>' +
        '             <div class="layui-input-inline">' +
        '                 <input type="text" name="customAttrValue" value=":attrValue" placeholder="自定义属性值" autocomplete="off" class="layui-input">' +
        '             </div>' +
        '             <div class="layui-input-inline">' +
        '                <span class="ee_removeCustomAttr" style="cursor: pointer;color: #73a1bf;height: 100%;vertical-align: -webkit-baseline-middle;">移除</span>' +
        '             </div>' +
        '         </div>' +
        '    </div>';
    if (attrName && attrValue) {
        tpl = tpl.replace(":attrName", attrName);
        tpl = tpl.replace(":attrValue", attrValue);
    } else {
        tpl = tpl.replace(":attrName", "");
        tpl = tpl.replace(":attrValue", "");
    }
    $("#ee_editspecificForm .ebayCustomSpecifics .layui-card-body").append(tpl);
}

$("body").on("click", "#publish_addCustomAttr", function() {
    addCustomAttr();
});
$("body").on("click", ".ee_removeCustomAttr", function() {
    $(this).parents(".layui-form-item").remove();
});

function ebayPulish_saveListDetail(index, layero, isPublish) {
    var data = {};
    data.id = $(layero).find("form input[name=id]").val();
    //父SKU
    data.storePSku = $(layero).find("form input[name=storePSku]").val();
    data.pSku = $(layero).find("form input[name=storePSku]").data("sku");
    data.listingDuration = $(layero).find("form select[name=listingDuration]").val();
    data.title = $(layero).find("form input[name=title]").val();
    data.subTitle = $(layero).find("form input[name=subTitle]").val();
    data.isBestoffer = $(layero).find("form input[name=isBestoffer]:checked").val();
    if (data.isBestoffer == "true") {
        data.autoAcceptPrice = $(layero).find("form input[name=autoAcceptPrice]").val();
        data.minimumBoPrice = $(layero).find("form input[name=minimumBoPrice]").val();
    }
    data.category1=$(layero).find("form input[name=category1]").val()
    data.category2=$(layero).find("form input[name=category2]").val()
    data.shippingService1 = $(layero).find("form input[name=shippingService1]").val();
    data.shippingSrv1Cost = $(layero).find("form input[name=shippingSrv1Cost]").val();
    data.shippingSrv1AddiCost = $(layero).find("form input[name=shippingSrv1AddiCost]").val();

    data.shippingService2 = $(layero).find("form input[name=shippingService2]").val();
    data.shippingSrv2Cost = $(layero).find("form input[name=shippingSrv2Cost]").val();
    data.shippingSrv2AddiCost = $(layero).find("form input[name=shippingSrv2AddiCost]").val();

    data.shippingService3 = $(layero).find("form input[name=shippingService3]").val();
    data.shippingSrv3Cost = $(layero).find("form input[name=shippingSrv3Cost]").val();
    data.shippingSrv3AddiCost = $(layero).find("form input[name=shippingSrv3AddiCost]").val();

    data.shippingService4 = $(layero).find("form input[name=shippingService4]").val();
    data.shippingSrv4Cost = $(layero).find("form input[name=shippingSrv4Cost]").val();
    data.shippingSrv4AddiCost = $(layero).find("form input[name=shippingSrv4AddiCost]").val();


    data.intShippingService1 = $(layero).find("form input[name=intShippingService1]").val();
    data.intShippingSrv1Cost = $(layero).find("form input[name=intShippingSrv1Cost]").val();
    data.intShippingSrv1AddiCost = $(layero).find("form input[name=intShippingSrv1AddiCost]").val();
    var intShip1ToLocal = [];
    $(layero).find("form input[name=intShip1ToLocal]:checked").each(function() {
        intShip1ToLocal.push($(this).val());
    });
    data.intShip1ToLocal = intShip1ToLocal.join(",");

    data.intShippingService2 = $(layero).find("form input[name=intShippingService2]").val();
    data.intShippingSrv2Cost = $(layero).find("form input[name=intShippingSrv2Cost]").val();
    data.intShippingSrv2AddiCost = $(layero).find("form input[name=intShippingSrv2AddiCost]").val();
    var intShip2ToLocal = [];
    $(layero).find("form input[name=intShip2ToLocal]:checked").each(function() {
        intShip2ToLocal.push($(this).val());
    });
    data.intShip2ToLocal = intShip2ToLocal.join(",");

    data.intShippingService3 = $(layero).find("form input[name=intShippingService3]").val();
    data.intShippingSrv3Cost = $(layero).find("form input[name=intShippingSrv3Cost]").val();
    data.intShippingSrv3AddiCost = $(layero).find("form input[name=intShippingSrv3AddiCost]").val();
    var intShip3ToLocal = [];
    $(layero).find("form input[name=intShip3ToLocal]:checked").each(function() {
        intShip3ToLocal.push($(this).val());
    });
    data.intShip3ToLocal = intShip3ToLocal.join(",");

    data.intShippingService4 = $(layero).find("form input[name=intShippingService4]").val();
    data.intShippingSrv4Cost = $(layero).find("form input[name=intShippingSrv4Cost]").val();
    data.intShippingSrv4AddiCost = $(layero).find("form input[name=intShippingSrv4AddiCost]").val();
    var intShip4ToLocal = [];
    $(layero).find("form input[name=intShip4ToLocal]:checked").each(function() {
        intShip4ToLocal.push($(this).val());
    });
    data.intShip4ToLocal = intShip4ToLocal.join(",");

    data.intShippingService5 = $(layero).find("form input[name=intShippingService5]").val();
    data.intShippingSrv5Cost = $(layero).find("form input[name=intShippingSrv5Cost]").val();
    data.intShippingSrv5AddiCost = $(layero).find("form input[name=intShippingSrv5AddiCost]").val();
    var intShip5ToLocal = [];
    $(layero).find("form input[name=intShip5ToLocal]:checked").each(function() {
        intShip5ToLocal.push($(this).val());
    });
    data.intShip5ToLocal = intShip5ToLocal.join(",");


    data.notShipToCountries = $(layero).find("form textarea[name=notShipToCountries]").val();
    //图片
    data.mainImgUri = $(layero).find("form input[name=mainImgUri]").val();
    data.extImgUris = $(layero).find("form input[name=extImgUris]").val();
    //specifics
    data.specifics = $(layero).find("form textarea[name=specifics]").val();
    //描述
    // data.description = ebayPublishEditor.txt.html();
    data.description = ebayWangEditor.txt.html();
    //风格和销售模板
    data.assiFieldInfoId = $(layero).find("form select[name=assiFieldInfoId]").val();
    data.listingStyleId = $(layero).find("form input[name=listingStyleId]").val();
    //退货政策
    data.returnsAcceptedOption = $(layero).find("form select[name=returnsAcceptedOption]").val();
    data.refundOptions = $(layero).find("form select[name=refundOptions]").val();
    data.returnsWithinOption = $(layero).find("form select[name=returnsWithinOption]").val();
    data.shippingCostPaidBy = $(layero).find("form select[name=shippingCostPaidBy]").val();
    data.internationalReturnsAcceptedOption = $(layero).find("form select[name=internationalReturnsAcceptedOption]").val();
    data.internationalRefundOptions = $(layero).find("form select[name=internationalRefundOptions]").val();
    data.internationalReturnsWithinOption = $(layero).find("form select[name=internationalReturnsWithinOption]").val();
    data.internationalShippingCostPaidBy = $(layero).find("form select[name=internationalShippingCostPaidBy]").val();
    data.returnDescription = $(layero).find("form textarea[name=returnDescription]").val();
    //子数据
    var subSkuEbayList = [];
    //选中的图片属性
    var specificsFieldPicture = $(layero).find(".pictureFieldDiv input[class=pictureField]:checked").val();
    $(layero).find("form .sub-sku-ebay tbody tr").each(function() {
        var subSkuEbay = {};
        subSkuEbay.id = $(this).find("input[name=id]").val();
        subSkuEbay.storeSSku = $(this).find("input[name=storeSSku]").val();
        //子模板SKU放到remark中
        subSkuEbay.remark = $(this).find("input[name=storeSSku]").data("sku");
        subSkuEbay.imgUri = $(this).find("input[name=imgUri]").val();
        subSkuEbay.buyItNowPrice = $(this).find("input[name=buyItNowPrice]").val();
        subSkuEbay.quantity = $(this).find("input[name=quantity]").val();
        //是否为引流价
        subSkuEbay.isLockPrice = $(this).find("input[name=isLockPrice]").prop("checked");
        //是否为固定价格
        subSkuEbay.isAttractSku = $(this).find("input[name=isAttractSku]").prop("checked");
        //TODO子SKU specifics
        //specifics属性
        var specifics = [];
        //debugger;
        $(this).find("input[name=specifics]").each(function(){
            //获取第几列
            var index = $(this).parents("tr").find("td").index($(this).parents("td"));
            var specificsField = $(this).parents("table").find("thead th").eq(index).find("input").val();
            var specificsValue = $(this).val();
            if(specificsField && specificsField!="" && specificsValue && specificsValue!=""){
                if(specificsFieldPicture && specificsFieldPicture == specificsField){
                    specifics.unshift(specificsField+":"+specificsValue);
                }else{
                    specifics.push(specificsField+":"+specificsValue);
                }
            }
        });
        subSkuEbay.specifics = specifics.join(";");
        subSkuEbayList.push(subSkuEbay);
    });
    data.subSkuEbayList = subSkuEbayList;
    $.ajax({
        url: ctx + '/ebaylisting/savelist.html',
        type: 'post',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function(returnData) {
            if (returnData.code != "0000") {
                layer.msg(returnData.msg);
                return;
            }
            layer.close(index);

            if (isPublish) {
                layer.msg("保存成功,发布商品");
                ebayPublishListing(data.id, true);
            } else {
                layer.msg("保存成功");
                // $("#eabyPublish_search").trigger("click");
            }
        },
        error: function(XMLHttpRequest) {
            layui.admin.load.hide();

            if (XMLHttpRequest.status == 200) {
                layer.msg("请重新登录", { icon: 7 });
            } else {
                layer.msg("服务器错误");
            }
        }
    });
}

function ebayPulish_addSkuBtn() {
    var prodPSku = $("#ebayPulish_addSku").val();
    var prodListingEbayId = $("#ebayPulish_listDetailForm input[name=id]").val();
    $.ajax({
        url: ctx + '/ebaylisting/addsku.html',
        type: 'post',
        dataType: 'json',
        data: {
            prodPSku: prodPSku,
            prodListingEbayId: prodListingEbayId
        },
        success: function(returnData) {
            if (returnData.code != "0000") {
                layer.msg(returnData.msg);
                return;
            }
            // 属性
            const specificsArr=[]
            $('#ebayPulish_listDetailForm .sub-sku-ebay thead').find('input[name=specifics]').each(function(){
                specificsArr.push($(this).val().toLocaleLowerCase())
            })
            var prodListingSubSkuEbays = returnData.data.map(item=>({...item,specificsArr:specificsArr}));
            //填充信息 模板方式
            layui.laytpl($("#ebayPulish_listSubTrTpl").html()).render(prodListingSubSkuEbays, function(html) {
                $('#ebayPulish_listDetailForm .sub-sku-ebay tbody').append(html);
                //本地图片绑定
            $("#ebayPulish_listDetailForm .ebayPublish_subSkuImg_edit_local").each(function() { //初始化本地按钮
                ebayPublish_subSkuImg_exchangeLocal($(this));
            });
            layui.form.render('checkbox')
            });
        },
        error: function(XMLHttpRequest) {
            layui.admin.load.hide();

            if (XMLHttpRequest.status == 200) {
                layer.msg("请重新登录", { icon: 7 });
            } else {
                layer.msg("服务器错误");
            }
        }
    });
}

function ebayPulishNew_removeSkuBtn(obj) {
    $(obj).closest('tr').remove();
}

function ebayPulish_removeSkuBtn(obj) {
    var id = $(obj).parents("tr").find("input[name=id]").val();
    layer.confirm('移除变种', { icon: 3 }, function(index) {
        $.ajax({
            url: ctx + '/ebaylisting/removesku.html',
            type: 'post',
            dataType: 'json',
            data: { id: id },
            success: function(returnData) {
                if (returnData.code != "0000") {
                    layer.msg(returnData.msg);
                    return;
                } else {
                    $(obj).parents("tr").remove();
                }
            },
            error: function(XMLHttpRequest) {
                layui.admin.load.hide();

                if (XMLHttpRequest.status == 200) {
                    layer.msg("请重新登录", { icon: 7 });
                } else {
                    layer.msg("服务器错误");
                }
            }
        });
        layer.close(index);
    });

}


//刊登详情子sku图片
// $("html").on('click', "#ebayPublish_subSkuImg", function() {
//     var divDom = $(this).parent("div");
//     //prompt层
//     layer.prompt({title: '填写图片url'}, function(text, index){
//         layer.close(index);
//         divDom.find("input[name=imgUri]").val(text);
//         divDom.find("img").attr("src", text);
//     });
// });

//复制模板
function ebayPulish_listingCopy() {
    //获取选中的id
    var ids = [];
    ids = (layui.table.checkStatus('ebayPublish_table').data||[]).map(function(item){
    return item.id
});
if (ids.length < 1) {
    layer.msg("未选中商品");
    return;
}
    layui.use(['table', 'formSelects'], function() {
        var table = layui.table;
        var formSelects = layui.formSelects;
        layer.open({
            type: 1,
            title: '复制模板',
            content: '<table id="ebayPulish_lcTable"></table>',
            area: ['1200px', '600px'],
            btn: ['保存'],
            success: function(layero, index) {
                //获取sku信息
                $.ajax({
                    type: "post",
                    url: ctx + "/ebaylisting/listsku.html",
                    data: { ids: ids.join(",") },
                    dataType: "json",
                    success: function(returnData) {
                        if (returnData.code != "0000") {
                            layer.msg(returnData.msg);
                        } else {
                            //封装数据
                            //sku列
                            var skuDoms = [];
                            for (var i = 0; i < returnData.data.length; i++) {
                                var storePSku = returnData.data[i].storePSku;
                                var pSku = returnData.data[i].pSku;
                                skuDoms.push(storePSku + "(" + pSku + ")");
                            }
                            //初始化弹框内容
                            table.render({
                                elem: "#ebayPulish_lcTable",
                                //url: ctx + "/ebaylisting/listsku.html",
                                //method: "post",
                                //where: {ids:ids.join(",")},
                                data: [{}],
                                cols: [
                                    [
                                        { field: 'title', title: '本次生成模板父SKU', width: "33%", templet: "<div>" + skuDoms.join("<br>") + "</div>" },
                                        { field: 'title', title: '店铺', width: "33%", templet: '<div><select id="ep_storeSelect" xm-select="ep_storeSelect" xm-select-search xm-select-search-type="dl" xm-select-skin="normal"></select></div>' },
                                        { field: 'title', title: '站点', width: "33%", templet: '<div><select id="ep_siteSelect" xm-select="ep_siteSelect" xm-select-search xm-select-search-type="dl" xm-select-skin="normal"></select></div>' },
                                    ]
                                ]
                            });
                            //店铺多选初始化
                            var storeDatas = [];
                            for (var i = 0; i < ebayPublishStoreList.length; i++) {
                                var storeData = {};
                                storeData.name = ebayPublishStoreList[i].storeAcct;
                                storeData.value = ebayPublishStoreList[i].id;
                                storeDatas.push(storeData);
                            }
                            formSelects.data('ep_storeSelect', 'local', { arr: storeDatas })
                                //站点多选初始化
                            var siteDatas = [];
                            for (var siteId in ebayPublishSiteData) {
                                var siteData = {};
                                siteData.name = ebayPublishSiteData[siteId];
                                siteData.value = siteId;
                                siteDatas.push(siteData);
                            }
                            formSelects.data('ep_siteSelect', 'local', { arr: siteDatas })
                        }
                        // 修改css
                        layero.find('.layui-table-view').css('height','calc(100% - 20px)')
                        layero.find('.layui-table-box').css('height','100%')
                        layero.find('.layui-table-main').css('height','calc(100% - 40px)')
                        layero.find('.layui-table-main').css('overflow','hidden auto')
                    },
                    error: function(XMLHttpRequest) {
                        layui.admin.load.hide();

                        if (XMLHttpRequest.status == 200) {
                            layer.msg("请重新登录", { icon: 7 });
                        } else {
                            layer.msg("服务器错误");
                        }
                    }
                });
            },
            yes: function(index, layero) {
                // console.log("开始复制模板 ");
                //获取多选框数据
                var storeDatas = [];
                var storeContents = formSelects.value("ep_storeSelect");
                for (var i = 0; i < storeContents.length; i++) {
                    var storeData = storeContents[i].val;
                    storeDatas.push(storeData);
                }
                var siteDatas = [];
                var siteContents = formSelects.value("ep_siteSelect");
                for (var i = 0; i < siteContents.length; i++) {
                    var siteData = siteContents[i].val;
                    siteDatas.push(siteData);
                }
                layui.admin.load.show();
                $.ajax({
                    type: "post",
                    url: ctx + "/ebaylisting/listingcopy.html",
                    data: {
                        ids: ids.join(","),
                        storeAcctIds: storeDatas.join(","),
                        siteIds: siteDatas.join(","),
                    },
                    dataType: "json",
                    success: function(returnData) {
                        layui.admin.load.hide();
                        if (returnData.code != "0000") {
                            console.error(returnData.msg);
                            layer.msg(returnData.msg);
                        } else {
                            var sucList = returnData.data.sucList;
                            var errorList = returnData.data.errorList;
                            var resultList = sucList.concat(errorList);
                            var msg = returnData.msg;
                            layer.alert(msg + "<br>" + resultList.join("<br>"), { area: ['auto', '600px'] });
                            layer.close(index);
                        }
                    },
                    error: function(XMLHttpRequest) {
                        layui.admin.load.hide();

                        if (XMLHttpRequest.status == 200) {
                            layer.msg("请重新登录", { icon: 7 });
                        } else {
                            layer.msg("服务器错误");
                        }
                    }
                });
            }
        });
    });
}

//标记刊登方式
function ebayPulish_signListingMode() {
    //获取选中的id
    var ids = [];
    ids = (layui.table.checkStatus('ebayPublish_table').data||[]).map(function(item){
    return item.id
});
if (ids.length < 1) {
    layer.msg("未选中商品");
    return;
}
    layer.open({
        type: 1,
        title: '标记刊登方式',
        btn: ['确定', '取消'],
        //area: ['100%', '100%'],
        content: $("#ebayPublish_listingModeTpl").html(),
        success: function(layero, index) {
            layui.form.render();
        },
        yes: function(index, layero) {
            //保存并发布
            var listingMode = $(layero).find("input[name=listingMode]:checked").val();
            layui.admin.load.show();
            $.ajax({
                type: "post",
                url: ctx + "/ebaylisting/signlistingmode.html",
                dataType: "json",
                data: {
                    ids: ids.join(","),
                    listingMode: listingMode
                },
                success: function(returnData) {
                    layui.admin.load.hide();
                    if (returnData.code != "0000") {
                        layer.msg(returnData.msg);
                    } else {
                        layer.msg("刊登方式标记成功");
                        layer.close(index);
                        $("#eabyPublish_search").trigger("click");
                    }
                },
                error: function(XMLHttpRequest) {
                    layui.admin.load.hide();

                    if (XMLHttpRequest.status == 200) {
                        layer.msg("请重新登录", { icon: 7 });
                    } else {
                        layer.msg("服务器错误");
                    }
                }
            });
        }
    });
}

//更新刊登定价
function ebayPublishUpdatePrice(id) {
    //获取引流SKU
    var attractSubSkuId;
    var attractSkuDom = $("#ebayPulish_listDetailForm .sub-sku-ebay tbody tr input[name=isAttractSku]:checked");
    if (attractSkuDom.length > 0) {
        attractSubSkuId = attractSkuDom.parents("tr").find("input[name=id]").val();
    }
    const grossProfitRate= $('#ebayPulish_listDetailForm input[name=grossProfitRate]').val()
    const discountRate = $('#ebayPulish_listDetailForm input[name=discountRate]').val()
    layui.admin.load.show();
    $.ajax({
        type: "post",
        url: ctx + "/ebaylisting/updateprice.html",
        dataType: "json",
        contentType: 'application/json',
        data: JSON.stringify({
            listingId: Number(id),
            attractSubSkuId: Number(attractSubSkuId),
            grossProfitRate: grossProfitRate!==''? Number(grossProfitRate)/100:'',
            discountRate: discountRate!==''? Number(discountRate)/100:'',
            platListingPriceFormulaConfigId: Number($('#ebayPulish_listDetailForm select[name=platListingPriceFormulaConfigId]').val()),
        }),
        success: function(returnData) {
            layui.admin.load.hide();
            if (returnData.code != "0000") {
                layer.msg(returnData.msg, { icon: 7 });
            } else {
                layer.msg("更新刊登定价:<br>" + returnData.msg, { icon: 1 });
                var subSkuEbays = returnData.data;
                $("#ebayPulish_listDetailForm .sub-sku-ebay tbody tr").each(function() {
                    var subId = $(this).find("input[name=id]").val();
                    for (var index in subSkuEbays) {
                        if (subSkuEbays[index].id == subId) {
                            if (!$(this).find("input[name=isLockPrice]").prop("checked")) {
                                $(this).find("input[name=buyItNowPrice]").val(subSkuEbays[index].buyItNowPrice);
                            }
                        }
                    }
                });
            }
        },
        error: function(XMLHttpRequest) {
            layui.admin.load.hide();

            if (XMLHttpRequest.status == 200) {
                layer.msg("请重新登录", { icon: 7 });
            } else {
                layer.msg("服务器错误");
            }
        }
    });
}
//更新店铺SKU
function ebayPublishUpdateSku(id) {
    $("#ebayPulish_listDetailForm .sub-sku-ebay tbody tr").each(function() {
        //子模板SKU
        var sSku = $(this).find("input[name=storeSSku]").data("sku");
        if (sSku) {
            $(this).find("input[name=storeSSku]").val(sSku);
        }
    });
    //父SKU
    var pSkuDom = $("#ebayPulish_listDetailForm input[name=storePSku]");
    pSkuDom.val(pSkuDom.data("sku"));
}

//抽象出一个公共的checkbox全选和反全选的组件
function checkbox_no_all(tableId) {
    /*获取表头checkbox和美化后的元素*/
    var $ = layui.$
    var th_checkbox = $('#' + tableId).find('thead th:first-child input[type="checkbox"]'),
        oth_checkbox = th_checkbox.next()
        /*获取表内checkbox和美化后的元素*/
    var td_checkbox = $('#' + tableId).find('tbody td:first-child input[type="checkbox"]').not(':disabled'),
        otd_checkbox = td_checkbox.next()
        /*全选和反全选事件*/
    oth_checkbox.click(function() {
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
    otd_checkbox.click(function() {
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
/**
 * ebay弹框图片的设置主图/移除/数量统计处理
 */
function ebayImgHandle() {
    //1. 设为主图的处理
    (function() {
        var mainImg = $('#ebayPulish_listDetailForm .imageLeft').find('img');
        $('#ebayPublish_extImg').on('click', '.setEbayMainImg', function() {
            var img = $(this).prev(), //获取辅图
                src1 = img.attr('src'), //获取辅图路径
                src2 = mainImg.attr('src'); //获取主图路径
            mainImg.attr('src', src1);
            img.attr('src', src2);
            setMainAndExtVal();
        });
    })();
    //2.移除的处理
    (function() {
        $('#ebayPublish_extImg').on('click', '.removeEbayImg', function() {
            var span = $('.ebaySecondImgNum'),
                num = span.text(),
                img = $(this).parent();
            num--;
            img.remove();
            span.text(num);
            setMainAndExtVal();
        })
    })();
    //3.弹框处理
    (function() {
        var netBtn = $('.ebayInternetImgBtn');
        netBtn.on('click', function() {
            var index = layer.open({
                type: 1,
                title: '网络图片',
                content: '<div style="padding:20px"><textarea class="layui-textarea netImgs" placeholder="请填写URL,多个地址用回车换行"></textarea></div>',
                area: ['800px', '400px'],
                btn: ['保存', '关闭'],
                yes: function(index, layero) {
                    var imgText = $.trim(layero.find("textarea").val());
                    if (appendMainExtImg(imgText)) {
                        layer.close(index);
                    }
                }
            })
        })
    })();
}
/**
 * 拼接主副图
 * @param {Object} imgText
 */
function appendMainExtImg(imgText) {
    var valArr = imgText.split('\n'),
        span = $('#ebayPulishIdLayer .ebaySecondImgNum'),
        num = Number(span.text()),
        len = valArr.length,
        total = len + num;
    let ebaySpecialImgNum = Number($('#ebayPulishIdLayer .ebaySpecialImgNum').text());
    if (total > ebaySpecialImgNum) {
        var sx = ebaySpecialImgNum - num;
        layer.alert(`只能上传${ebaySpecialImgNum}张图片,还可以传${sx}张!`);
        return false;
    } else {
        var str = '';
        for (var i = 0; i < valArr.length; i++) {
            str += '<div class="imageRight" draggable="true">\
                        <img src="' + valArr[i] + '" width="150" height="150">\
                        <span class="setEbayMainImg">设为主图</span>\
                        <span class="removeEbayImg">移除</span>\
                    </div>';
        }
        $('#ebayPublish_extImg').append(str);
        span.text(total);
        setMainAndExtVal();
        return true;
    }
}
//公共的函数给input[hidden]赋值
function setMainAndExtVal() {
    var mainImg = $('#ebayPulish_listDetailForm .imageLeft img').attr('src'); //获取主图
    var imgs = $('#ebayPublish_extImg').find('img');
    var extImgs = [];
    $.each(imgs, function(i, v) {
        var src = $(v).attr('src');
        extImgs.push(src);
    })
    $('#ebayPulish_listDetailForm input[name="mainImgUri"]').val(mainImg);
    $('#ebayPulish_listDetailForm input[name="extImgUris"]').val(extImgs.join('|'));
}

// template函数
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
/**
 * 展开全部和收起全部功能
 */
function expandAllEbay() {
    $('#ebayPublish_tab').find('.expandrow').removeClass('hide')
    $('#ebayPublish_tab').find('.expand').attr('data-index','close')
    $('#ebayPublish_tab').find('.expand span').text('收起-')
}

function PackUpAllEbay() {
    $('#ebayPublish_tab').find('.expandrow').addClass('hide')
    $('#ebayPublish_tab').find('.expand').attr('data-index','expand')
    $('#ebayPublish_tab').find('.expand span').text('展开+')
}

function ebayPublish_subSkuImg_exchangeLocal(obj) {
    var divDom = $(obj).parent("div");
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
                divDom.find("input[name=imgUri]").val(data.msg);
                divDom.find("img").attr("src", data.msg);
                divDom.find("input[name=imgUri]").trigger("change");
            } else {
                layer.msg(data.msg); //这里面的内容不知道写啥,同OA系统
            }
        }
    });

}

function ebayPublish_subSkuImg_exchangeNet(obj) {
    var divDom = $(obj).parent("div");
    //prompt层
    layer.prompt({ title: '填写网络图片url' }, function(text, index) {
        if (text) {
            layer.close(index);
            divDom.find("input[name=imgUri]").val(text);
            divDom.find("img").attr("src", text);
            divDom.find("input[name=imgUri]").trigger("change");
        } else {
            layer.msg("图片url不能为空");
        }
    });
}

//辅图详情处理-ztt20230518
var prodSSku = ''
function ebayPublish_subSkuImg_detailHandle(obj){
    prodSSku = $(obj).parents('tr').data("prodssku") || ''

  let imgs = $(obj).parent().find('input[name=imgUri]').val();
  let imgsArr = imgs.split(';') || [];
  let isMax12 = Number($('#ebayPulishIdLayer .ebaySpecialImgNum').text()) == 23 ? true: false;
  //获取父级tr,然后获取sku,size和color,待定?
  let combineStr = '';
  let $tr = $(obj).parents('tr');
  let storeSSku = $tr.find('input[name=storeSSku]').val();
  combineStr +=`<b>SKU:</b>${storeSSku}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`;
  let $specificsValDoms = $tr.find('input[name=specifics]');//获取所在行的所有属性value的值元素
  let $specificsKeyDoms = $tr.parents('table').find('th input[name=specifics]');//获取所在行的所有属性key的值元素
  for(let i=0; i<$specificsValDoms.length; i++){
    let valDom = $specificsValDoms[i];
    let keyDom = $specificsKeyDoms[i];
    let val = $(valDom).val() || '';
    let key = $(keyDom).val() || '属性';
    combineStr+= `<b>${key}:</b>${val}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`;
  }
  layer.open({
    type: 1,
    title: combineStr,
    area: ['90%', '70%'],
    btn: ['保存','取消'],
    content: $('#ebayPublish_subSkuImg_detailLayer').html(),
    id: 'ebayPublish_subSkuImg_detailLayerId',
    success: function(layero,index){
      //拖拽函数
      let draggableFn = function(){
        $('#publish-auxiliary-ebaySubSkuImgs').sortable({
          cursor: "move", //拖拽时鼠标样式
          containment: "parent",
          tolerance: "pointer",
          items: ".auxiliary-ebaySubSkuImgsChild", //定义可拖拽的元素
        });
      }
      draggableFn();
      //默认渲染数量
      layero.find('#subSkuImgLeftPublishImgNum').text(imgsArr.length);
      layero.find('.subSkuImgLeftImgNumTotal').text(isMax12? 12 :1);
      //插入图片
      let imgDiv = '';
      for(let i = 0; i< imgsArr.length; i++) {
        let item = imgsArr[i];
        let imgItem = `<div class="auxiliary-ebaySubSkuImgsChild">
                        <img src="${item}" width="150" height="150" onerror="layui.admin.img_noFind()">
                        <div style="display:flex; justify-content: space-between">
                            <div class="opte" onclick="ebayImgRemove_handleFn(this, $('#subSkuImgLeftPublishImgNum'))">
                                <span class="removeImg">移除</span>
                            </div>
                            <div class="opte" onclick="ebayImgAdd_handleFn(this)">
                                <span style="color: cornflowerblue;cursor:pointer">添加至其他sku</span>
                            </div>
                        </div>
                    </div>`;
        imgDiv+=imgItem;
      }
      $('#publish-auxiliary-ebaySubSkuImgs').append(imgDiv);
      //本地图片上传
      ebayLocalImgHandleFn({
        btn: '#subSkuImg_container_localUpload',
        imgDom: '#publish-auxiliary-ebaySubSkuImgs',
        imgNumDom: 'subSkuImgLeftPublishImgNum',
        max: isMax12 ? 12 : 1,
        fn: draggableFn
      });
      //网络图片上传
      ebayNetImgHandleFn({
        btn: '#subSkuImg_container_networkUpload',
        imgDom: '#publish-auxiliary-ebaySubSkuImgs',
        imgNumDom: 'subSkuImgLeftPublishImgNum',
        max: isMax12? 12 : 1,
        fn: draggableFn
      });
    },
    yes: function(index, layero){
      let subImgsDom = layero.find('.auxiliary-ebaySubSkuImgsChild>img');
      let srcArr = [];
      for(let i=0; i<subImgsDom.length; i++){
        let subImg = subImgsDom[i];
        let src = $(subImg).attr('src');
        srcArr.push(src);
      }
      let srcStr = srcArr.join(';');
      layer.close(index);
      //更新该元素的隐藏input
      $(obj).parent().find('input[name=imgUri]').val(srcStr);
      $(obj).parent().find('img.img_show_hide').attr('src', srcArr[0]);
      //更新图片显示的数量
      $(obj).parent().find('.subImgNum').text(srcArr.length);
    }
  });
}
// 删除图片
function ebayPublish_subSkuImg_removeHandle(obj) {
    let imgArrStr = $(obj).closest('td').find('input[name=imgUri]').val();
    if (imgArrStr) {
        let imgArr = imgArrStr.split(';')
        imgArr = imgArr.slice(1); // 删除第一张图片
        $(obj).closest('td').find('input[name=imgUri]').val(imgArr.join(';'))
        // 需要更新第一张图片
        $(obj).closest('td').find('.img_show_hide').attr('src', imgArr[0] || '/lms/static/img/kong.png')
        $(obj).closest('td').find('.subImgNum').text(imgArr?.length || 0)
    }
}
// 详情表格内 模板图片上传
function ebayPublish_subTableSkuImg_exchangeTemp(obj) {
    let prodSSku = $(obj).parents('tr').data("prodssku") || ''
    console.log('prodSSku', prodSSku);
    const params = {
        param: {prodSSkus: [prodSSku]},
        limit: 1,
        existImgs: 0,
        cb: function (tplUrlList, fullImgList) {
            if (tplUrlList?.length > 1) {
                return layer.msg('只能选择一张图片', { icon: 2 });
            }
            if (Array.isArray(tplUrlList) && tplUrlList.length) {
                // 需要更新第一张图片
                $(obj).closest('td').find('.img_show_hide').attr('src', tplUrlList[0])

                let imgArrStr = $(obj).closest('td').find('input[name=imgUri]').val();
                let imgArr = []
                if (imgArrStr) {
                    imgArr = imgArrStr.split(';')
                    imgArr[0] = tplUrlList[0] || '';
                } else {
                    imgArr.push(tplUrlList[0])
                }
                $(obj).closest('td').find('input[name=imgUri]').val(imgArr.join(';'))
                $(obj).closest('td').find('.subImgNum').text(imgArr?.length || 0)
            }
        },
    }
    comPickImageTpl(params,'ebay')
}
// 详情表格内 网络图片上传
function ebayPublish_subTableSkuImg_exchangeNet(obj) {
    // let {btn, max, imgNumDom, imgDom, fn} = obj;
  //网络图片的点击事件
  let netImgLayer = `
      <div style="padding:20px;">
          <textarea  class="layui-textarea"></textarea>
      </div>
  `;
    var _this = this;
    layer.open({
        type: 1,
        title: '网络图片',
        area: ['600px', '400px'],
        content: netImgLayer,
        id: Date.now(),
        btn: ['保存', '关闭'],
        yes: function (index, layero) {
            var $val = layero.find('textarea').val();
            var allImgUrl = $val.split('\n');
            if (allImgUrl[0] == '') {
                return layer.msg('url不能为空', { icon: 2 });
            }
            if (allImgUrl?.length > 1) {
                return layer.msg('只能上传一张图片', { icon: 2 });
            }
            // 需要更新第一张图片
            $(obj).closest('td').find('.img_show_hide').attr('src', allImgUrl[0])

            let imgArrStr = $(obj).closest('td').find('input[name=imgUri]').val();
            let imgArr = []
            if (imgArrStr) {
                imgArr = imgArrStr.split(';')
                imgArr[0] = allImgUrl[0] || '';
            } else {
                imgArr.push(allImgUrl[0])
            }
            $(obj).closest('td').find('input[name=imgUri]').val(imgArr.join(';'))
            $(obj).closest('td').find('.subImgNum').text(imgArr?.length || 0)
            layer.close(index);
        }
    });
}

// 详情表格内 本地图片上传
function ebayPublish_subTableSkuImg_exchangeLocal(obj) {
  //创建一个input元素
  let $input = $("<input type='file' name='file' class='disN'>");
  $(body).append($input);
  $input.trigger('click');
  $input.change(function (e) {      
    let files = e.target.files;
    if (!files.length) return;
    let file = files[0];
    let formData = new FormData();
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
        beforeSend: function () {
            loading.show();
        },
        success: function (data) {
            loading.hide();
            if (data.code == '0000') {
                // 需要更新第一张图片
                $(obj).closest('td').find('.img_show_hide').attr('src', data.msg)

                let imgArrStr = $(obj).closest('td').find('input[name=imgUri]').val();
                let imgArr = []
                if (imgArrStr) {
                    imgArr = imgArrStr.split(';')
                    imgArr[0] = data.msg || '';
                } else {
                    imgArr.push(data.msg)
                }
                $(obj).closest('td').find('input[name=imgUri]').val(imgArr.join(';'))
                $(obj).closest('td').find('.subImgNum').text(imgArr?.length || 0)
            } else {
                layer.msg(data.msg, { icon: 2 });
            }
            //传递完成以后清空input的value
            e.target.value = '';
        },
        error: function (error) {
            loading.hide();
            layer.msg(`${error.statusText}`, { icon: 2 });
        }
    })
    //传递完成以后清空input的value
    e.target.value = '';
    e.preventDefault();
    e.stopPropagation();
  });
}

//主辅图本地上传
function ebayPublish_extImg_exchangeLocal(obj) {
    var divDom = $(obj).parent("div");
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
                // console.log(data.msg);
                appendMainExtImg(data.msg);
            } else {
                layer.msg(data.msg);
            }
        }
    });

}
//绑定修改标题显示剩余字符数量
$("body").on('input', '#ebayPulish_listDetailForm input[name=title]', function() {
    var title = $(this).val();
    var lastNum = 80 - title.length;
    $(this).next('b').text(lastNum);
    if (lastNum >= 0) {
        $(this).next('b').css("color", "green");
    } else {
        $(this).next('b').css("color", "red");
    }
});

function batchSetSkuSufix(dom){
    var type = dom.siblings('#sufixSetType').val()
    var original = dom.siblings('input[name="originalsku"]').val()
    var newsku = dom.siblings('.replacehide').find('input[name="newsku"]').val()
    if(original!==""){
    if(type==1){
        addSufix(original)
    }else if(type==2){
        replaceSufix(original,newsku)
    }else{
        deleteSufix(original)
    }
}else{
    layer.msg('请填写要修改的后缀内容')
}
}
//添加后缀
function addSufix(newsufix){
    $("#ebayPulish_listDetailForm .sub-sku-ebay tbody tr").each(function() {
        var originalsku = $(this).find("input[name=storeSSku]").val()
        $(this).find("input[name=storeSSku]").val(originalsku+newsufix);
    });
}
//删除后缀
function deleteSufix(original){
    $("#ebayPulish_listDetailForm .sub-sku-ebay tbody tr").each(function() {
        var originalsku = $(this).find("input[name=storeSSku]").val()
        if(endWith(originalsku,original)){
            $(this).find("input[name=storeSSku]").val(originalsku.slice(0,originalsku.length-original.length));
        }
    });
}
//替换后缀
function replaceSufix(originalsufix,newsufix){
    $("#ebayPulish_listDetailForm .sub-sku-ebay tbody tr").each(function() {
        var original = $(this).find("input[name=storeSSku]").val()
        if(endWith(original,originalsufix)){
            var originbody = original.slice(0,original.length-originalsufix.length)
            $(this).find("input[name=storeSSku]").val(originbody+newsufix);
        }
    });
}

function endWith(s,sufix) {
    if (sufix == null || sufix == "" || s.length == 0|| sufix.length > s.length)
         return false;
    if (s.substring(s.length - sufix.length) == sufix)
         return true;
    else
         return false;
   return true;
}

function ebayPublishInitWatermarkImage(data, id) {
    $("#" + id + " select[name=watermarkImage]").empty();
    if (data) {
        $("#" + id + " select[name='watermarkImage']").append("<option value='' selected>请选择</option>");
        data.forEach(function(val, index) {
            var watermarkName = val.watermarkTemplateName;
            var watermarkId = val.id;
            var optionTpl = "<option value=':watermarkId'>:watermarkName</option>";
            optionTpl = optionTpl.replace(":watermarkId", watermarkId);
            optionTpl = optionTpl.replace(":watermarkName", watermarkName);
            $("#" + id + " select[name='watermarkImage']").append(optionTpl);
        });
        layui.form.render();
    }
}


function ebayPublishInitWatermarkFont(data, id) {
    $("#" + id + " select[name=watermarkFont]").empty();
    if (data) {
        $("#" + id + " select[name=watermarkFont]").append("<option value='' selected>请选择</option>");
        data.forEach(function(val, index) {
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



//ebay子SKU specifics操作

/**
 * 加载内容初始化页面
 */
function initSubSkuSpecitics(subItemDatas){
    //debugger;
    // specifics字段名，第一个字段为关联图片的字段
    var specificsFields = [];
    // specifics对象
    var specifics = {}
    subItemDatas.forEach(function(subItemData){
        //TODO  旧数据补偿
        if(!subItemData.specifics){
            subItemData.specifics = "";
        }
        var specifics = {};
        if(subItemData.specifics && subItemData.specifics.length > 0){
            subItemData.specifics.split(";").forEach(function(line){
                if(line && line.length>0){
                    var key = line.split(":")[0];
                    var value = line.split(":")[1];
                    //列
                    if(specificsFields.indexOf(key) < 0){
                        specificsFields.push(key);
                    }
                    specifics[key] = value;
                }
            });
        }
        subItemData.specifics = specifics;
    });
    //加载radio
    $("#ebayPulish_listDetailForm .pictureFieldDiv").empty();
    for(var specificsField of specificsFields){
        //表格
        var tableDom = $("#ebayPulish_listDetailForm .sub-sku-ebay");
        //增加th
        tableDom.find("thead tr .price").before(
            $("#ep_specificsThTpl").html()
                .replace(":key",specificsField)
        );
        //增加td
        var trIndex = 0;
        tableDom.find("tbody tr").each(function(){
            var specificsValue = subItemDatas[trIndex].specifics[specificsField] || "";
            $(this).find(".price").before(
                "<td><input name='specifics' class='layui-input' value='"+specificsValue+"'></td>"
            );
            trIndex++;
        });
    }
    if(specificsFields.length>0){
        //th表头选中
        $("#ebayPulish_listDetailForm .sub-sku-ebay th[class=specificsField]:first").addClass("specificsFieldPicture");
    }
    //加载表格specifics
    initPictureField();
    return specificsFields;
}

/**
 * 从td加载到radio
 */
function initPictureField(){
    $("#ebayPulish_listDetailForm .pictureFieldDiv").empty();
    var currentField = $("#ebayPulish_listDetailForm .specificsFieldPicture input[name='specifics']").val();
    $("#ebayPulish_listDetailForm .specificsField input[name='specifics']").each(function(){
        var specificsField = $(this).val();
        //radio
        var tpl = '<input type="radio" class="pictureField" value="'+specificsField+'" title="'+specificsField+'" lay-filter="ep_pictureField">';
        $("#ebayPulish_listDetailForm .pictureFieldDiv").append(tpl);
    });
    //选中默认的
    if(currentField){
        $("#ebayPulish_listDetailForm .pictureFieldDiv input[class=pictureField][value="+currentField+"]").prop("checked", true);
    }
    layui.form.render("radio");
}

/**
 * 增加一列属性(price列之前)
 */
$(document).on('click', '.addSpecificsBtn', function() {
    var tableDom = $("#ebayPulish_listDetailForm .sub-sku-ebay");
    tableDom.find("thead tr .price").before(
        $("#ep_specificsThTpl").html()
            .replace(":key","")
            .replace(":specificsFieldPicture","")
    );
    tableDom.find("tbody tr .price").each(function(){
        $(this).before("<td><input name='specifics' class='layui-input'></td>");
    });
});
/**
 * 删除specifics属性
 */
$(document).on('click', '.delSpecificsBtn', function() {
    //计算specifics列数量
    if($(this).parents("thead").find("th.specificsField").length<=1){
        layer.msg("至少保留1个specifics",{icon:0});
        return;
    }
    //获取第几列
    var index = $(this).parents("thead").find("th").index($(this).parents("th"));
    //删除td
    $(this).parents("table").find("tbody tr").each(function(){
        $(this).find("td").eq(index).remove();
    });
    //删除th
    $(this).parents("thead").find("th").eq(index).remove();
    //刷新图片关联属性
    initPictureField();
});
$(document).on('blur', '.specificsField input[name=specifics]', function() {
    //刷新图片关联属性
    initPictureField();
});
//修改图片时监听
$(document).on('change', "#ebayPulish_listDetailForm .sub-sku-ebay tbody input[name=imgUri]", function() {
    // console.log("监听图片修改");
    //选中的图片属性
    var index = $(this).parents("table").find(".specificsField")
        .index($(this).parents("table").find(".specificsFieldPicture"));
    //debugger;
    if(index < 0){
        return;
    }
    //获取当前SKU图片绑定的specifics
    var specificsVal = $(this).parents("tr").find("input[name=specifics]").eq(index).val();
    if(!specificsVal || specificsVal == ""){
        return;
    }
    //将修改应用到所有相同specifics
    layer.msg("修改属性图片:"+specificsVal);
    var imgUri = $(this).val();
    $('#ebayPulish_listDetailForm .sub-sku-ebay tbody input[name=imgUri]').each(function(){
        if($(this).parents("tr").find("input[name=specifics]").eq(index).val() == specificsVal){
            $(this).val(imgUri);
            $(this).parent("div").find("img").attr("src", imgUri);
        }
    });
});


function ebayPublish_addSubListing() {
    var needTDSpecialTpl=`<td><input name="specifics" class="layui-input" value=""></td>`;
var addHtml="";
var sepcialLength= $('#ebayPulish_sub-sku-ebay_th_tr .specificsField ').length;
if(sepcialLength>0){
    for(var i=0;i<sepcialLength;i++){}
    addHtml+=needTDSpecialTpl;
}
    var tr =` <tr>
                                <input type="hidden" name="id" value="">
                                <input type="hidden" name="tempVarietyId" value="">
                                <td>
                                    <div style="width: 60px;position:relative;">
                                        <input type="hidden" name="imgUri" value="/lms/static/img/kong.png">
                                        <img class="img_show_hide" width="60" height="60" src="" onerror="layui.admin.img_noFind()">
                                        <span class="subImgNum">1</span>
                                        <br>
                                        <span class="layui-btn layui-btn-xs" onclick="ebayPublish_subSkuImg_detailHandle(this)">详情</span>
                                        <!--<span id="ebayPublish_subSkuImg" style="cursor: pointer;color: #73a1bf;float: right;">修改</span>
                                        <div class="ebayPublish_subSkuImg_edit_local"></div>
                                        <div class="layui-btn layui-btn-primary layui-btn-sm ebayPublish_subSkuImg_edit_net"
                                             onclick="ebayPublish_subSkuImg_exchangeNet(this)">网络图片</div>-->
                                    </div>
                                </td>
                                <td>
                                    <input name="storeSSku" data-sku="" value="" class="layui-input">
                                </td>`+addHtml+`
                                <td class="price"><input type="number" name="buyItNowPrice" value="" class="layui-input"></td>
                                <td><input type="number" name="quantity" value="" class="layui-input"></td>
                                <td>
                                    保存后自动生成
                                </td>
                                <td>
                                    <input type="checkbox" name="isLockPrice" lay-filter="ep_isLockPrice" lay-skin="switch" lay-text="是|否">
                                </td>
                                <td>
                                    <input type="checkbox" name="isAttractSku" lay-filter="ep_isAttractSku" lay-skin="switch" lay-text="是|否">
                                </td>
                                <td>
                                    <button type="button" onclick="ebayPulishNew_removeSkuBtn(this)" class="layui-btn layui-btn-sm layui-btn-danger">删除</button>
                                </td>
                            </tr>
`;
    $('#ebayPublish_SubSkuInfo_body').append(tr);

    //本地图片绑定
    // $("#ebayPulish_listDetailForm .ebayPublish_subSkuImg_edit_local").each(function() { //初始化本地按钮
    //     ebayPublish_subSkuImg_exchangeLocal($(this));
    // });
    layui.form.render('checkbox')
}

function ebay_publish_addSubImgByTpl(dom, isNewTpl = false) {
    const limit = $('.subSkuImgLeftImgNumTotal').text()
    const existImgs = $('#subSkuImgLeftPublishImgNum').text()
    const params = {
        param: {prodSSkus: [prodSSku]},
        limit,
        existImgs,
        cb: function (tplUrlList, fullImgList) {
            if (Array.isArray(tplUrlList) && tplUrlList.length) {
                tplUrlList.forEach(item=> {
                    let childDiv = `
                    <div class="auxiliary-ebaySubSkuImgsChild">
                        <img src="${item}" width="150" height="150" onerror="layui.admin.img_noFind()">
                        <div style="display:flex; justify-content: space-between">
                            <div class="opte" onclick="ebayImgRemove_handleFn(this, $('#subSkuImgLeftPublishImgNum'))">
                                <span class="removeImg">移除</span>
                            </div>
                            <div class="opte" onclick="ebayImgAdd_handleFn(this)">
                                <span style="color: cornflowerblue;cursor:pointer">添加至其他sku</span>
                            </div>
                        </div>
                    </div>`;
                    $('#publish-auxiliary-ebaySubSkuImgs').append(childDiv);
                })
            }
        },
    }
    comPickImageTpl(params,'ebay')
}

// 将该图片添加至其他的子sku
function ebayImgAdd_handleFn(obj) {
    layer.confirm('确定要将该图片添加至其他子sku吗?', {icon: 3}, function (index) {
        let src = $(obj).parents('.auxiliary-ebaySubSkuImgsChild').find('img').attr('src')
        $('#ebayPublish_SubSkuInfo_body tr').each(function(index, item) {
            let srcStr = $(item).find('[name=imgUri]').val()
            let srcList
            if(srcStr) {
                srcList = srcStr.split(';')
            } else {
                srcList = []
            }
            srcList.push(src)
            $(item).find('[name=imgUri]').val(srcList.join(';'))
            $(item).find('.subImgNum').text(srcList.length || 0);
        })
        layer.msg('添加成功！')
        layer.close(index);
    })
}

function ebay_publish_addImgByTpl(dom, isNewTpl = false){
    const limit = $('.ebaySpecialImgNum').text()
    const existImgs = $('.ebaySecondImgNum').text()
    const prodskuList = Array.from($("#ebayPublish_SubSkuInfo_body tr").map((_, item) => $(item).data("prodssku")))

    const params = {
        param: {prodSSkus: prodskuList},
        limit,
        existImgs,
        cb: function (tplUrlList, fullImgList) {
            if (Array.isArray(tplUrlList) && tplUrlList.length) {
                tplUrlList.forEach(item=> {
                    appendMainExtImg(item)
                })
            }
        },
    }
    comPickImageTpl(params,'ebay')
}
