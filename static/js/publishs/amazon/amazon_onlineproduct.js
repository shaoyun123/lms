/**amazon在线商品的js*/
var stopAmazonArr = [];
var timeUnit;
var batchArr = [];
layui.use(['admin', 'layer', 'table', 'form', 'laytpl', 'element', 'laydate', 'upload', 'formSelects'], function() {
    var amazon_online_creatListing_prodDesc_simditor //富文本的返回值

    var admin = layui.admin,
        layer = layui.layer,
        $ = layui.$,
        table = layui.table,
        element = layui.element,
        laydate = layui.laydate,
        upload = layui.upload,
        formSelects = layui.formSelects,
        form = layui.form;
    form.render('checkbox');
    form.render('select'); //刷新select选择框渲染

    /**
     * 日期渲染
     */
    laydate.render({
        elem: '#amazon_online_listtime',
        range: true
    });
    render_hp_orgs_users("#amazon_online_searchForm"); //渲染部门销售员店铺三级联动
    amazonOnline_initSite(); //初始化amazon站点下拉框

    /**
     * 初始化商品标签
     */
    amazonOnline_initProdTags();
    function amazonOnline_initProdTags(){
        $.ajax({
            type: "post",
            url: ctx + "/product/getProdTags.html",
            dataType: "json",
            success: function (returnData) {
                console.log(returnData.data);
                if (returnData.code == "0000") {
                    //商品标签
                    var productLabelList=returnData.data;
                    var labelStr="<option value=''>请选择</option>";
                    $(productLabelList).each(function () {
                        labelStr+="<option value='"+this.name+"'>"+this.name+"</option>";
                    });
                    $("#amazon_online_productLabel_sel").html(labelStr);
                    form.render();
                } else {
                    layer.msg(returnData.msg);
                }
            }
        });
    }

    // 导出
    $("[name=amazon_onlineprod_export]").click(function(){
        let checkData = layui.table.checkStatus("amazon_online_data_table").data,idList=[],pIdList=[];

        checkData.map(item => {
            if(item.id){
                idList.push(item.id)
            }else if(item.pId){
                pIdList.push(item.pId)
            }
        })
        // submitForm(checkData.map(item => item.asin), ctx + '/onlineProductAmazon/exportSelectData')
        loading.show()
        transBlob({
            url: ctx + "/onlineProductAmazon/exportSelectData",
            formData: JSON.stringify({"idList":idList,"pIdList":pIdList}),
            fileName: '',
            contentType: 'application/json'
        }).then(function (result) {
            loading.hide();
            layer.alert("导出成功",{icon:1})
        }).catch(function (err) {
            layer.msg(err, {icon: 2});
        });
    })

    /**
     * 获取日志渲染
     */
    let amazon_logRendering_online
     amazon_logRendering().then(res => {
        amazon_logRendering_online = res
     })
    function amazon_logRendering(params) {
        return commonReturnPromise({
            url: '/lms/prodListingOperTypeEnum/amazon'
        })
    }
    // 导入导出
    form.on('select(amazon_online_export_import)', function(data) {
        var selected = $.trim(data.value);
        if (selected == 1) { // 下载模板
            window.open('/lms/static/templet/amazon_fbm导入调整店铺处理时间.xlsx','_blank');
        } else if (selected == 2){ // 导入模板
            $("#amazon_online_import_btn").click()
        }
    })
    upload.render({
        elem: "#amazon_online_import_btn", //绑定元素
        url: `${ctx}/onlineProductAmazon/fbm/batchAdjustFulfillmentLatency`, //上传接口
        accept: 'file',//允许上传的文件类型
        exts: 'xlsx|xls',
        before: function () {
            loading.show()
        },
        done: function(res) {
            loading.hide()
            if (res.code == '0000') {
                // if(res.msg == '操作成功!'){
                    layer.alert(res.msg || '上传成功',{ icon: 1 });
                // }else{
                //     let msg = JSON.parse(res.msg),msgStr = '';
                //     for(let key in msg){
                //         msgStr += key +'：'+ msg[key].join().split("\n").join("<br>") + "<br>";
                //     }
                //     layer.alert(msgStr || '上传成功',{ icon: 1 });
                // }
            } else {
                layer.alert(res.msg || '上传失败',{ icon: 2 });
            }
        },
        error: function() {
            layer.msg('服务器出现故障!');
        }
    });
    /**
     * 批量操作(上下架，调价等)
     */
    form.on('select(amazon_online_apiOperate_sel)', function(data) {
        var selected = $.trim(data.value);
        if (selected == null || selected == '') {
            return false;
        }
        if (selected == 0) { //批量更新
            var itemData = table.checkStatus('amazon_online_data_table').data; //获取选择的店铺
            if (itemData == null || itemData.length < 1) {
                layer.msg("请选择lisiting", { icon: 0 });
                return;
            }
            var itemIds = [];
            for (var index in itemData) {
                var obj = itemData[index];
                itemIds.push(obj.storeAcctId + "&" + obj.storeSSku + "&" + obj.siteId);
            }
            amazonOnline_syncBacthItem(itemIds.join(","));
            return;
        } else if (selected == 6) {
            batchArr = table.checkStatus('amazon_online_data_table').data; //获取选择的店铺
            var storeArr = [];
            var siteArr = [];
            for (var i in batchArr) {
                if (!(storeArr.indexOf(batchArr[i].storeAcctId) > -1)) {
                    storeArr.push(batchArr[i].storeAcctId)
                }
            }
            for (var i in batchArr) {
                if (!(siteArr.indexOf(batchArr[i].siteId) > -1)) {
                    siteArr.push(batchArr[i].siteId)
                }
            }
            if (storeArr.length > 1) {
                layer.msg("只能选择同一店铺的商品!");
                return;
            } else if (storeArr.length < 1) {
                layer.msg("请先选择商品!");
                return;
            } else if (siteArr.length > 1) {
                layer.msg("只能选择同一站点的商品!");
                return;
            }
            localStorage.setItem('storeId', storeArr)
        }
        /**
         * 弹窗
         */
        var sobj = $("#amazon_online_apiOperate_sel").find("[value=" + selected + "]");
        var title = $(sobj).attr("data-title");
        var link = $(sobj).attr("data-link");
        var index = layer.open({
            type: 1,
            id: Date.now(),
            title: title,
            area: ['80%', '70%'],
            success: function() {
                layui.view(this.id).render(link).done(function() {
                    //渲染完成以后执行的函数
                })
            },
            end: function() {
                if (timeUnit != null) {
                    clearInterval(timeUnit); //清除定时查询进度
                }
            }
        });
    });
    /**
     * 产品状态选项卡改变
     */
    var currentProductStatusType = "1";
    element.on('tab(amazon_online_tab_filter)', function(data) {
        currentProductStatusType = $(this).attr("product_status_type");
        $("#amazon_online_search_submit").click();
    });

    form.on('select(amazonOnlineProductSalesTime)', function(selData) {
        if(selData.value != ''){
            $("#amazon_online_searchForm select[name=salesType]").val("FBM")
        }else{
            $("#amazon_online_searchForm select[name=salesType]").val("")
        }
        form.render();
    })
    let amazon_online_limits = 100

    /**
     * 搜索
     */
    $("#amazon_online_search_submit").on("click", function() {
        var searchData = smtOnline_getSerachData();
        let amazon_online_data_table = table.render({
            elem: "#amazon_online_data_table",
            method: 'post',
            url: ctx + "/onlineProductAmazon/searchAmazonProductByDto.html",
            where: searchData,
            cols: [
                [
                    { checkbox: true, width: 25 },
                    { field: "firstImage", unresize: true, width: 70, title: "图片", style: "vertical-align: top;", templet: "#amazon_online_firstImage_tpl" },
                    { field: 'asin', title: "标题/ASIN/成色", align: 'left', style: "text-align:left;vertical-align: top;", templet: '#amazon_online_asin_tpl' },
                    { field: "sellerSku", title: "sellerSku", width: 150, style: "vertical-align: top;", templet: '#amazon_online_sellerSku_tpl' },
                    { field: "", title: "FBM销量", width: 100, align: 'left', templet: '#amazon_online_salesNum_tpl' },
                    { field: "siteName", title: "国家", width: 60, style: "vertical-align: top;", templet: '#amazon_online_siteName_tpl' },
                    { field: "listingPrice", width: 90, title: "刊登价", templet: '#amazon_online_listingPrice_tpl' },
                    { field: "promotionPrice", width: 90, title: "促销", templet: '#amazon_online_PromotionPrice_tpl' },
                    { field: 'stock', width: 80, title: "库存", align: 'left', templet: '#amazon_online_freightTemplateId_tpl' },
                    { field: 'avaiableStock', width: 100, title: "可用/在途/未派", align: 'left', templet: '#amazon_online_avaiableStock_tpl' },
                    { field: 'property', width: 100, title: "属性", align: 'left', templet: '#amazon_online_propery_tpl' },
                    { field: "listingTime", width: 120, title: "刊登时间", templet: '#amazon_online_listingTime_tpl' },
                    { title: '操作', align: 'center', style: "vertical-align: top;", templet: '#amazon_online_operate_tpl', width: 120 }
                ],
            ],
            done: function(res, curr, count) {
                amazon_online_limits = amazon_online_data_table.config.limit
                 theadHandle().fixTh({id:'#amazon_onlineproductCard',h:200,i:85});
                imageLazyloadAll();
                if (res.code == '0000') {
                    if (res.msg != null) {
                        var msgArray = res.msg.split("&");
                        if(currentProductStatusType==1){
                            $("#amazon_online_online_num1_span").html(msgArray[0]); //在线
                            $("#amazon_online_online_num2_span").html("点击显示"); //取消报告
                            $("#amazon_online_online_num3_span").html("点击显示"); //
                            $("#amazon_online_online_num4_span").html("点击显示"); //
                        }else if(currentProductStatusType==2){
                            $("#amazon_online_online_num2_span").html(msgArray[0]); //在线
                            $("#amazon_online_online_num1_span").html("点击显示"); //取消报告
                            $("#amazon_online_online_num3_span").html("点击显示"); //
                            $("#amazon_online_online_num4_span").html("点击显示"); //
                        }else if(currentProductStatusType==3){
                            $("#amazon_online_online_num2_span").html("点击显示"); //在线
                            $("#amazon_online_online_num1_span").html("点击显示"); //取消报告
                            $("#amazon_online_online_num3_span").html(msgArray[0]); //
                            $("#amazon_online_online_num4_span").html("点击显示"); //
                        }else if(currentProductStatusType==4){
                            $("#amazon_online_online_num2_span").html("点击显示"); //在线
                            $("#amazon_online_online_num1_span").html("点击显示"); //取消报告
                            $("#amazon_online_online_num3_span").html("点击显示"); //
                            $("#amazon_online_online_num4_span").html(msgArray[0]); //
                        }

                    }
                }
                // theadHandle().fixTh({ id:'#amazon_onlineproductCard',h:130 })
            },
            page: true,
            id: "amazon_online_data_table",
            limits: [20,50,100,1000,3000],
            limit: amazon_online_limits
        });
        //工具条的监听事件,table.on(tool(表格的lay-filter的值))
        table.on('tool(amazon_online_data_table)', function(obj) {
            var data = obj.data, //获得当前行数据
                layEvent = obj.event; //获得 lay-event 对应的值
            var itemIds = data.storeAcctId + "&" + data.storeSSku + "&" + data.siteId;
            if (layEvent == "amazon_online_updateOneItem") { //更新一条item
                amazonOnline_syncBacthItem(itemIds);
            } else if (layEvent == 'amazon_online_update_listingRemark') {
                var title = $(this).attr("title");
                var oldData = obj.data.listingRemark || '';
                var index = layer.open({
                    type: 1,
                    title: title,
                    area: ["500px", "300px"],
                    btn: ["保存", "取消"],
                    content: '<div style="padding:20px"><textarea id="amazon_online_listingRemark_text" class="layui-textarea" rows="50">' + oldData + '</textarea></div>',
                    yes: function(index, layero) {
                        var listingRemark = $("#amazon_online_listingRemark_text").val();
                        var tobj = {};
                        tobj.id = data.id;
                        tobj.listingRemark = listingRemark;
                        var updateRemarkJson = [];
                        updateRemarkJson.push(tobj);
                        smtOnline_bacthUpdateItemRemark(updateRemarkJson, title);
                    },
                    end: function() {
                        layer.close(index);
                    }
                });
            } else if (layEvent == 'amazon_oper_listing') { //查询amaozn批量操作日志
                console.log(111)
                layer.open({
                    type: 1,
                    title: '查看日志',
                    shadeClose: false,
                    area: ['60%', '60%'],
                    content: $('#amazon_oper_liting_layer').html(),
                    success: function() {
                        from_amazon_show_log(data.storeAcctId, data.storeSSku, data.siteId);
                    }
                })
            }

            if(layEvent == "amazon_online_createListing"){
                layer.open({
                    type: 1,
                    title: '创建listing',
                    btn: ['生成','生成并刊登','关闭'],
                    area: ['100%', '100%'],
                    content: $('#amazon_online_creatListing_tpl').html(),
                    success: function (layero, index) {
                        var oldstoreId=null;
                        var oldsaleSite=null;
                        var oldCateId=null;
                        var oldCateName=null;
                        var oldexternalProductIdType=null;
                        var oldCurrency=null;
                        var oldweightUnit=null;

                        easy_ajax("/onlineProductAmazon/getForCreatListing.html", JSON.stringify({ "pId": data.pId }),function (returnData) {
                            //todo 也可以使用layui 表单赋值,但是这里不适用,因为是从其他表里拿到的数据,字段和提交的字段name不一样
                            var tmphtml1 = template('amazon_online_creatListing_p_info_tpl',  (!$.isEmptyObject(returnData.data)?returnData.data.pInfo:{}));
                                oldstoreId=returnData.data.pInfo.storeAcctId;
                                oldsaleSite=returnData.data.pInfo.salesSite;
                                oldCateId=returnData.data.pInfo.storeAcctId;
                                oldCateName=returnData.data.pInfo.storeAcctId;
                                oldexternalProductIdType=returnData.data.pInfo.externalProductIdType;
                                oldCurrency=returnData.data.pInfo.currency;
                                oldweightUnit=returnData.data.pInfo.weightUnit;

                            //
                            $('#amazon_online_creatListing_p_info_tpl_div').append(tmphtml1);

                            var tmphtml2 = template('amazon_online_creatListing_s_info_tpl',  (!$.isEmptyObject(returnData.data)?returnData.data:[]));
                            //
                            $('#amazon_online_creatListing_s_info_tpl_div').append(tmphtml2);
                            rest_div_img_move()
                            layui.form.render();
                            //设置刊登描述
                            amazon_online_creatListing_prodDesc_simditor = autoSimditor('amazon_online_creatListing_prodDesc',!$.isEmptyObject(returnData.data.pInfo)?returnData.data.pInfo.productDescription||'':''); //设置描述头内容

                        },false);





                        //1.初始化店铺 2站点
                        var siteMap=new Map();
                        easy_ajax("/sys/liststore.html", { roleNames: 'amazon专员', platCode: 'amazon' },function (returnData) {
                            easy_appendSelect($('#amazon_online_creatListing_Form select[name=storeAcctId]'),returnData.data, 'id', 'storeAcct',oldstoreId,function (eachOne) {
                                return 'data-sites="'+(eachOne.salesSite || '')+'"'+'data-brand="'+(eachOne.brand || '')+'"';
                            });
                            layui.form.render('select');
                        },false,'application/x-www-form-urlencoded');
                        easy_ajax("/enum/getSiteEnum.html?platCode=amazon", JSON.stringify({}),function (returnData) {
                            var siteData=returnData.data;
                            for (var i in siteData) {
                                siteMap.set(siteData[i].code, siteData[i]);
                            }
                            easy_appendSelect($('#amazon_online_creatListing_Form select[name=salesSite]'), siteData, 'code', 'name',oldsaleSite);
                        },false);


                        //重量单位 upc/ean 货币类型 的初始化
                        $('#aoc_s_info_SubSkuInfo .aoc_s_info_td_weightUnit').each(function (index, unitDiv) {
                            $(unitDiv).html(oldweightUnit)
                        });

                        $('#aoc_s_info_SubSkuInfo .aoc_s_info_td_currency').each(function (index, currencyDiv) {
                            $(currencyDiv).html(oldCurrency)
                        });
                        $('#aoc_s_info_SubSkuInfo td[class=aoc_s_info_td_externalProductIdType_td]').each(function (index, externalProductIdTypeDiv) {
                            $(externalProductIdTypeDiv).html(oldexternalProductIdType)
                        });

                        easy_ajax("/amazonCateMapping/listTempFileName.html", {salesSite:oldsaleSite},function (returnData) {
                            easy_appendSelect($('#amazon_online_creatListing_Form select[name=tempFileName]'),returnData.data, 'name', 'desc',null);
                            form.render('select');
                        },false,'application/x-www-form-urlencoded');


                        layui.form.render();
                        layui.form.render('select');

                        //监听店铺下拉选择
                        form.on('select(amazon_online_creatListing_selAcct_filter)', function(selData) {
                            var storeTmp=selData.value;
                            var brand = selData.elem[selData.elem.selectedIndex].dataset.brand;
                            $('#amazon_online_creatListing_Form input[name=brand]').val(brand);
                            var sites = selData.elem[selData.elem.selectedIndex].dataset.sites;

                            var canSelSiteList = [];
                            if(storeTmp) {//选择了店铺
                                if (sites) {
                                    var siteList = sites.split(",");
                                    for (var i = 0; i < siteList.length; i++) {
                                        var obj = {};
                                        obj.site = siteList[i];
                                        obj.siteName = siteMap.get(siteList[i]).name;
                                        canSelSiteList.push(obj);
                                    }
                                }
                            }else{
                                siteMap.forEach(function(value,key){
                                    var obj = {};
                                    obj.site = key;
                                    obj.siteName = value.name;
                                    canSelSiteList.push(obj);
                                });
                            }
                            easy_appendSelect($('#amazon_online_creatListing_Form select[name=salesSite]'), canSelSiteList, 'site', 'siteName');
                            form.render('select');
                        });
                        //监听站点选择,转换值
                        form.on('select(amazon_online_creatListing_selSite_filter)', function(selData) {
                            //转换汇率和UPC等...  初始化模板和站点 ,品牌
                            var oldtempFileName = $('#amazon_online_creatListing_Form select[name=tempFileName]').val();

                            var oldexternalProductIdType = $('#amazon_online_creatListing_Form input[name=externalProductIdType]').val();
                            var oldcurrency = $('#amazon_online_creatListing_Form input[name=currency]').val();
                            var oldweightUnit = $('#amazon_online_creatListing_Form input[name=weightUnit]').val();

                            $('#amazon_online_creatListing_Form input[name=recommendedBrowseNode]').val("");
                            $('#amazon_online_creatListing_cateItem').empty();

                            //重量单位 upc/ean 货币类型 的初始化
                            var currency=siteMap.get(selData.value).currency;
                            var weightUnit=getWeightUnit(siteMap.get(selData.value).region);
                            var externalProductIdType=getExternalProductIdType(siteMap.get(selData.value).region);
                            $('#amazon_online_creatListing_Form input[name=currency]').val(currency);
                            $('#amazon_online_creatListing_Form input[name=externalProductIdType]').val(externalProductIdType);
                            $('#amazon_online_creatListing_Form input[name=weightUnit]').val(weightUnit);


                            //todo 转换
                            if(weightUnit != oldweightUnit) {
                                $('#aoc_s_info_SubSkuInfo .aoc_s_info_td_weightUnit').each(function (index, unitDiv) {
                                    $(unitDiv).html(weightUnit)
                                });
                            }

                            if(currency != oldcurrency){
                                $('#aoc_s_info_SubSkuInfo .aoc_s_info_td_currency').each(function(index,currencyDiv){
                                    $(currencyDiv).html(currency)
                                });
                            }
                            if(oldexternalProductIdType != externalProductIdType) {//改变了
                                $('#aoc_s_info_SubSkuInfo td[class=aoc_s_info_td_externalProductIdType_td]').each(function(index,externalProductIdTypeDiv){
                                    $(externalProductIdTypeDiv).html(externalProductIdType)
                                });
                                $('#aoc_s_info_SubSkuInfo input[class=aoc_s_info_externalProductId_input]').each(function (index, externalProductIdInputDiv) {
                                    $(externalProductIdInputDiv).html("")
                                });
                            }

                            //TODO 货币转换+重量转换

                            easy_ajax("/amazonCateMapping/listTempFileName.html", {salesSite: selData.value},function (returnData) {
                                easy_appendSelect($('#amazon_online_creatListing_Form select[name=tempFileName]'),returnData.data, 'name', 'desc',null,oldtempFileName);
                                form.render('select');
                            },false,'application/x-www-form-urlencoded');
                            $('#aoc_s_info_refreshProductId_btn').click();
                        });

                        //类目绑定
                        $('#amazon_online_creatListing_cateItem_btn').on('click', function () {
                            console.log("类目树展开");
                            var siteCode = $("#amazon_online_creatListing_Form select[name=salesSite]").val();
                            if(siteCode) {
                                console.log(siteCode);
                                layui.admin.itemCat_select('amazon_online_creatListing-publish2',
                                    'amazon_online_creatListing_cateItem-hidden2',
                                    'amazon_online_creatListing_cateItem-div2',
                                    "/amazon/getAmazonCateList.html?siteId=" + siteCode,
                                    "/amazon/searchAmazonCate.html?siteId=" + siteCode
                                );
                            }else{
                                layer.msg("必须先选择站点");
                            }
                        });

                        $('#amazon_online_creatListing_recom_cate').click(function() {
                            var prodPSku=$("#amazon_online_creatListing_Form input[name=prodPSku]").val();
                            var salesSite = $('#amazon_online_creatListing_Form select[name=salesSite]').val();
                            if($.isEmptyObject(salesSite)){
                                layer.msg("请先指定店铺站点",{ icon: 5 });
                            }else {
                                if (prodPSku) {
                                    //初始化
                                    $('#amazon_online_creatListing_cateItem-div2').empty();
                                    $('#amazon_online_creatListing_Form input[name=recommendedBrowseNode]').val("");
                                    $('#amazon_online_creatListing_Form input[name=feedProductType]').val("");
                                    $('#amazon_online_creatListing_Form input[name=itemType]').val("");
                                    $('#amazon_online_creatListing_Form input[name=colorKeyName]').val("");
                                    $('#amazon_online_creatListing_Form input[name=sizeKeyName]').val("");
                                    $('#amazon_online_creatListing_Form input[name=colorSizeKeyName]').val("");
                                    $('#amazon_online_creatListing_Form input[name=bulletPoint_0]').val("");
                                    $('#amazon_online_creatListing_Form input[name=bulletPoint_1]').val("");
                                    $('#amazon_online_creatListing_Form input[name=bulletPoint_2]').val("");
                                    $('#amazon_online_creatListing_Form input[name=bulletPoint_3]').val("");
                                    $('#amazon_online_creatListing_Form input[name=bulletPoint_4]').val("");
                                    easy_ajax("/amazonCateMapping/recomByProdSSku.html", JSON.stringify({
                                        salesSite: salesSite,
                                        prodPSku: prodPSku
                                    }), function (returnData) {
                                        if (returnData.data.mapInfo) {
                                            var mapInfo = returnData.data.mapInfo;
                                            $('#amazon_online_creatListing_Form input[name=feedProductType]').val(mapInfo.feedProductType);
                                            $('#amazon_online_creatListing_Form select[name=tempFileName]').val(mapInfo.tempFileName);
                                            $('#amazon_online_creatListing_Form input[name=itemType]').val(mapInfo.itemType);
                                            $('#amazon_online_creatListing_Form input[name=colorKeyName]').val(mapInfo.colorKeyName);
                                            $('#amazon_online_creatListing_Form input[name=sizeKeyName]').val(mapInfo.sizeKeyName);
                                            $('#amazon_online_creatListing_Form input[name=colorSizeKeyName]').val(mapInfo.colorSizeKeyName);
                                            if (returnData.data.cateInfo) {
                                                $('#amazon_online_creatListing_cateItem-div2').append(returnData.data.cateInfo);
                                                $('#amazon_online_creatListing_Form input[name=recommendedBrowseNode]').val(mapInfo.recommendedBrowseNode);
                                            }
                                        }
                                        if (returnData.data.bulletPoints) {
                                            var bullList = returnData.data.bulletPoints.split("#,#");
                                            for (var i = 0; i < bullList.length; i++) {
                                                $('#amazon_online_creatListing_Form input[name=bulletPoint_' + i + ']').val(bullList[i]);
                                            }
                                        }
                                        form.render('select')
                                    }, false);
                                } else {
                                    layer.msg("缺少父商品SKU",{ icon: 5 });
                                }
                            }
                        });



                        $('#aoc_s_info_addOne_btn').click(function(){
                            var oldexternalProductIdType = $('#amazon_online_creatListing_Form input[name=externalProductIdType]').val();
                            var oldcurrency = $('#amazon_online_creatListing_Form input[name=currency]').val();
                            var oldweightUnit = $('#amazon_online_creatListing_Form input[name=weightUnit]').val();
                            var trtmp = amazonOnline_onSubInfoData.replace(/&{externalProductIdType}/g, oldexternalProductIdType)
                                .replace(/&{currency}/g, oldcurrency)
                                .replace(/&{weightUnit}/g, oldweightUnit);
                            $('#aoc_s_info_SubSkuInfo').append(trtmp);
                            rest_div_img_move();
                        });
                        $('#aoc_s_info_refreshProductId_btn').click(function(){
                            var externalProductIdType=$('#amazon_online_creatListing_Form input[name=externalProductIdType]').val();
                            if(externalProductIdType) {
                                $("#aoc_s_info_SubSkuInfo").find("tr").each(function (index,element) {
                                    if ($(this).hasClass('aoc_s_info_pic_class')) {

                                    }else {
                                        //校验参数
                                        var tdArr = $(this).children();
                                        tdArr.find('.aoc_s_info_td_clickGenUpcEan').click();
                                    }
                                });
                            }else{
                                layer.msg("必须先选择站点");
                            }
                            //先批量获取
                        });

                        reset_class_click_image();

                    },
                    yes: function(){//
                        amazonOnline_addListingProd(false);
                    },
                    btn2: function(){
                        amazonOnline_addListingProd(true);
                    }
                })
            }

        });
    });
    //店铺+站点+店铺子sku 可以确定唯一条记录
    function from_amazon_show_log(storeAcctId, storeSSku, site) {
        table.render({
            elem: '#amazon_online_showlog_table',
            method: 'post',
            url: ctx + '/onlineProductAmazon/showListingOperLog.html',
            where: { 'storeAcctId': storeAcctId, 'storeSSku': storeSSku, 'site': site },
            cols: [
                [ //标题栏
                    { field: 'createTime', width: '136', title: '时间', templet: "<div>{{layui.util.toDateString(d.createTime,'yyyy-MM-dd HH:mm:ss')}}</div>" }
                    , { field: 'creator', title: '操作人' }
                    , { field: 'prodSSku', width: '136', title: '商品子SKU' }
                    , { field: 'operateTypeStr', title: '事件', templet: function (d) {
                        return amazon_logRendering_online[d.operType] || ''
                    } }
                    , { field: 'origData', title: '原值' }
                    , { field: 'newData', title: '调整值', width: '100' }
                    , { field: 'operDesc', title: '结果', width: '20%' }

                ]
            ]
        })
    }

    /**
     * 批量备注
     */
    function smtOnline_bacthUpdateItemRemark(updateRemarkJson, title) {
        loading.show();
        $.ajax({
            url: ctx + '/onlineProductSmt/updateOneSmtItemRemark.html',
            data: { "updateRemarkJson": JSON.stringify(updateRemarkJson) },
            dataType: "json",
            type: "post",
            success: function(returnData) {
                loading.hide();
                if (returnData.code == "0000") {
                    layer.closeAll();
                    layer.msg(title + '成功', { icon: 1 });
                } else {
                    layer.msg(returnData.msg, { icon: 5 });
                }
            },
            error: function() {
                layer.msg("服务器正忙", { icon: 5 });
            }
        });
    }
    /**
     * 批量更新
     * @param itemIds
     */
    function amazonOnline_syncBacthItem(itemIds) {
        if (itemIds == null || itemIds == '') {
            layer.msg("请选择lisiting", { icon: 0 });
            return;
        }
        loading.show();
        $.ajax({
            type: "post",
            url: ctx + "/onlineProductAmazon/syncBacthAmazonItem.html",
            data: { "itemIds": itemIds },
            dataType: "json",
            success: function(returnData) {
                loading.hide();
                if (returnData.code == "0000") {
                    layer.msg(returnData.msg, { icon: 1 });
                } else {
                    layer.open({
                        title: '更新lisiting结果',
                        content: returnData.msg,
                        offset: '100px',
                        area: '500px',
                        yes: function(index, layero) {
                            layer.close(index); //如果设定了yes回调，需进行手工关闭
                        }
                    });
                }
            }
        })
    };
    /**
     * 初始化amazon站点
     */
    function amazonOnline_initSite() {
        var Sites = [];
        $.ajax({
            type: "post",
            url: ctx + "/onlineProductAmazon/getAllAmazonSite.html",
            dataType: "json",
            success: function(returnData) {
                if (returnData.code == "0000") {
                    var str = "<option value=''></option>";
                    $(returnData.data.amzonSiteList).each(function() {
                        // str += "<option value='" + this.siteId + "'>" + this.siteName + "</option>";
                        Sites.push({ name: this.siteName, value: this.siteId })
                    });
                    //$("#amazon_online_site_sel").html(str);
                    formSelects.data('amazon_online_site_sel', 'local', { arr: Sites })
                    form.render();
                } else {
                    layer.msg(returnData.msg);
                }
            }
        })
    };
    formSelects.render('amazon_online_isSaleStr');
    formSelects.value('amazon_online_isSaleStr', ["2","1","0"]);

    /**
     * 监听表格复选框选择添加选中数据到arr中
     */
    table.on('checkbox(amazon_online_data_table)', function(obj) {
        var checkStatus = table.checkStatus('amazon_online_data_table'),
            date = checkStatus.data;
        stopAmazonArr = date;
    });
    /**
     * 获取搜索参数
     */
    function smtOnline_getSerachData() {
        var obj = {};
        var currentStoreAccts=formSelects.value("amazon_online_store_sel","val");//所选店铺
        if (currentStoreAccts == null || currentStoreAccts.length == 0) {//没有选择店铺
            var acctIds=$("#amazon_online_store_sel").attr("acct_ids");
            if(acctIds !=null && acctIds !='' ){
                obj.storeAcctId=acctIds;
            }else{
                obj.storeAcctId=99999;
            }
        }else{
            obj.storeAcctId = currentStoreAccts.join(",");//选择的店铺
        }
        //obj.siteId=$.trim($("#amazon_online_site_sel").val());
        var sites = formSelects.value("amazon_online_site_sel", "val"); //站点id
        obj.siteId = sites.join(",");
        obj.listingId = $.trim($("#amazon_online_listingId").val()); //物品号
        obj.asin = $.trim($("#amazon_online_asin_text").val()); //asin
        obj.productId = $.trim($("#amazon_online_productId_text").val()); //productId
        obj.stockStart = $.trim($("#amazon_online_stockStart_text").val()); //在线数量
        obj.stockEnd = $.trim($("#amazon_online_stockEnd_text").val());
        obj.prodAttrs=$.trim($("#amazon_online_productLabel_sel").val());
        obj.creator=$.trim($("#amazon_online_creator_sel").val());
        obj.tortBanListing= $.trim($("#amazon_online_searchForm [name=tortBanListing]").val());
        obj.isCanSale= $.trim($("#amazon_online_searchForm [name=isCanSale]").val());
        obj.promotionPriceValid= $.trim($("#amazon_online_searchForm [name=promotionPriceValid]").val());
        obj.isSaleStr= formSelects.value("amazon_online_isSaleStr", "val").join(",");

        /**产品标题处理**/
        var title = $.trim($("#amazon_online_item_title").val()); //产品标题
        if (title != null && title != '') {
            var titleSearchType = $.trim($("#amazon_online_title_search_type").val()); //标题检索类型
            obj.titleSearchType = titleSearchType;
            if (titleSearchType == 0) { //标题模糊
                var array = title.split(" ");
                obj.title = "";
                for (var i = 0; i < array.length; i++) {
                    if ($.trim(array[i]) != null && $.trim(array[i]) != '') {
                        obj.title += "+" + $.trim(array[i]);
                        if (i != array.length - 1) {
                            obj.title += " ";
                        }
                    }
                }
            } else if (titleSearchType == 1) { //标题精准
                obj.title = "%" + title + "%";
            }
        }
        var searchType = $("#amazon_online_skuSearchType_sel").val();
        var searchText = $.trim($("#amazon_online_skuSearchType_text").val());
        obj.skuSearchType = 0; //sku检索类型
        if (searchType == 1) { //商品子SKU
            obj.prodSSku = searchText;
        } else if (searchType == 2) { //店铺子SKU
            obj.storeSubSku = searchText;
        } else if (searchType == 3) { //商品子SKU模糊
            obj.skuSearchType = 1;
            obj.prodSSku = searchText;
        } else if (searchType == 4) { //店铺子SKU精确
            obj.skuSearchType = 1;
            obj.storeSubSku = searchText;
        }
        let prodStatus = {1:'',2:'',3:'inactive',4:'incomplete'},
            productStatusType = {1:1,2:2,3:1,4:1}
        obj.productStatusType = productStatusType[currentProductStatusType];
        obj.prodStatus = prodStatus[currentProductStatusType]

        obj.isMultiSku = $.trim($("#amazon_online_searchForm select[name=isMultiSku]").val())// 是否多属性
        obj.salesTime = $.trim($("#amazon_online_searchForm select[name=salesTime]").val())
        obj.salesStart  = $.trim($("#amazon_online_searchForm input[name=salesStart]").val()) // 销量最小值
        obj.salesEnd  = $.trim($("#amazon_online_searchForm input[name=salesEnd]").val())// 销量最大值
        obj.salesType  = $.trim($("#amazon_online_searchForm select[name=salesType]").val())// 分类

        obj.isMultiSkuTemp = $.trim($("#amazon_online_isMultiSkuTemp_sel").val()); //是否多属性
        var listingTimeType = $.trim($("#amazon_online_listtime_sel").val());
        var lisitingTime = $.trim($("#amazon_online_listtime").val());
        if (lisitingTime != '' && listingTimeType != null) {
            obj.listingTimeType = listingTimeType;
            if (listingTimeType == 1) { //刊登时间区间
                obj.listingStartTimeFrom = lisitingTime.substring(0, 10) + ' 00:00:00';
                obj.listingStartTimeEnd = lisitingTime.substring(13) + ' 23:59:59';
            } else { //结束时间区间
                obj.listingEndTimeFrom = lisitingTime.substring(0, 10) + ' 00:00:00';
                obj.listingEndTimeEnd = lisitingTime.substring(13) + ' 23:59:59';
            }
        }
        obj.orderBy = $.trim($("#amazon_online_sortdesc_sel").val()); //排序类型
        return obj;
    }

    function easy_appendSelect( dom, data, id, name,selectId,addfun) {
        dom.empty();
        var option = '<option value="">请选择</option>';
        for (var i in data) {
            if(selectId&& data[i][id]==selectId){
                option += '<option selected value="' + data[i][id] + '">' + data[i][name] + '</option>'
            }else {
                if(addfun){
                    option += '<option value="' + data[i][id] +'" '+addfun(data[i])+ '>' + data[i][name] + '</option>'
                }else {
                    option += '<option value="' + data[i][id] + '">' + data[i][name] + '</option>'
                }
            }
        }
        dom.html(option);
    }

    function easy_ajax(url, data, succFunc,async ,contentType, ignoreLoading) { //初始化ajax请求
        if (!ignoreLoading) {
            loading.show();
        }
        $.ajax({
            type: "post",
            url: ctx + url,
            dataType: 'json',
            async: async,
            data: data,
            contentType: contentType || 'application/json',
            success: function (returnData) {
                if (!ignoreLoading) {
                    loading.hide();
                }
                if (returnData.code == "0000") {
                    succFunc(returnData)
                } else {
                    layer.msg(returnData.msg, {icon: 2});
                }
            },
            error: function (returnData) {
                if (laodingHide) {
                    loading.hide();
                }
                if (XMLHttpRequest.status == 200) {
                    layer.msg("请重新登录", {icon: 7});
                } else {
                    layer.msg("服务器错误");
                }
            }
        })
    }

    function getWeightUnit(region){
        var weightUnit="GR";
        if(region == "EU" ){
            weightUnit="GR";
        }else if(region == "NA"){
            weightUnit="OZ";
        }else if(region == "FE") {
            weightUnit="GR";
        }
        return weightUnit;
    }

    function getExternalProductIdType(region){
        //指定EAN/UPC类型
        var aamzonPublish_productType='EAN';
        if(region == "EU" ){
            aamzonPublish_productType="EAN";
        }else if(region == "NA"){
            aamzonPublish_productType="UPC";
        }else if(region == "FE") {
            aamzonPublish_productType="UPC";
        }
        return aamzonPublish_productType;
    }

    //网络辅图处理
    /**
     * isLocal 是否本地
     */
    function amazonOnline_downImgFromUrl5(obj,url,isLocal) {
        if (url == null || url == "") {
            layer.msg("图片地址不能为空！", {icon: 5});
            return false;
        }
        var urlArray = url.split("\n");
        // 去一下空格
        for (var j in urlArray) {
            urlArray[j] = $.trim(urlArray[j]);
            //图片需要校验
            //需要以http开头
            if(!isLocal) {//网络图片url校验
                var startHttp = new RegExp(
                    '^((https|http|ftp)+://){1}[^\\s]+$'
                );
                if (startHttp.test(urlArray[j]) != true) {
                    layer.msg("网址格式不正确！url必须以http或https开头", {icon: 7});
                    return false;
                } else {
                }
                //端口开头的报错
                var ipPort = new RegExp(
                    '^((https|http|ftp)+://){1}/?([0-9]{1,3}.){3}[0-9]{1,3}(:[0-9]{1,4}){1}/?[^\\s]*$'
                );


                if (ipPort.test(urlArray[j]) != true) {
                } else {
                    layer.msg("网址格式不正确！amazon不支持url使用ip+端口,必须使用域名", {icon: 7});
                    return false;
                }
            }

        }

        var imgTotalNum2 = $(obj).closest('tr').find(".amazonSubImg_UL li").length;
        //辅图和子图最多6张
        var remainNum2 = 6 - imgTotalNum2;
        if ((urlArray.length + imgTotalNum2) > 6) {
            remainNum2 = remainNum2 < 0 ? 0 : remainNum2;
            // $.fn.message({type: "success", msg: "最大支持" + maxUploadNum2 + "张图片,您还能上传" + remainNum2 + "张!"});
            layer.msg("最大支持共" + 6 + "张辅图,您最多还能上传" + remainNum2 + "张!", {icon: 7});
            return false;
        }
        remainNum2 = urlArray.length > remainNum2 ? remainNum2 : urlArray.length;
        for (var i = 0; i < remainNum2; i++) {
            amazonOnline_showImg5(urlArray[i],obj);
        }
        return true;
    }

    function amazonOnline_showImg5(url,obj) {
        var tpl = '';
        tpl += amazonOnline_imgData['img']['tpl'];
        var div = tpl.replace(/&{url}/g, url);
        $(obj).closest('tr').find('.amazonSubImg_UL').append(div);
        var imgTotalNum = $(obj).closest('tr').find(".amazonSubImg_UL li").length;
        $(obj).closest('tr').find(".curImgNum").text(imgTotalNum);

        reset_class_click_image();
    }

    function reset_class_click_image(){
        $('.aoc_s_info_subInfo_setAsmainImage').click(function() {
            var  extImgUrl = $(this).closest('li').find('img').attr('originImage');
            var  mainImgUrl = $(this).closest('tr').find('.aoc_s_info_mainImg img').attr('originImage');
            if (mainImgUrl) {
                $(this).closest('li').find('img').attr('src', mainImgUrl);
                $(this).closest('li').find('img').attr('originImage', mainImgUrl);
            }
            if (extImgUrl) {
                $(this).closest('tr').find('.aoc_s_info_mainImg img').attr('src', extImgUrl);
                $(this).closest('tr').find('.aoc_s_info_mainImg img').attr('originImage', extImgUrl);
            }
        });
        $('.aoc_s_info_subInfo_removeImage').click(function() {
            // layer.confirm('您确认要删除图片？', {icon: 3, title: '提示'}, function (index) {
            var imgTotalNum = $(this).closest('tr').find('li').length;
            imgTotalNum--;
            $(this).closest('tr').find(".curImgNum").text(imgTotalNum);
            $(this).closest('li').remove();
        });
    }

    function rest_div_img_move(){
        $('#aoc_s_info_SubSkuInfo .amazonSubImg_UL').sortable({
            containment: "parent",
            cursor: "move",
        });//支持 移动图片


        $('.aoc_s_info_addPic_btn').click(function() {
            var clicObj=$(this);
            var index = layer.open({
                type: 1,
                title: '辅图网络图片',
                area: ['800px', '300px'],
                content: '<div style="padding: 20px"><textarea class="layui-textarea" id="aoc_s_info_addPic_url" placeholder="请填写URL,多个地址用回车换行"></textarea></div>',
                btn: ['确定', '关闭'],
                yes: function () {
                    //网络主图处理
                    var url = $.trim($("#aoc_s_info_addPic_url").val());
                    if(amazonOnline_downImgFromUrl5(clicObj,url,false)){
                        $("#aoc_s_info_addPic_url").val("");
                        layer.close(index);
                    }//这个函数在最下面,然后ajax那里的话,我不知道传什么数据data,返回的类型是啥,就没改,只改了一个URL

                }
            })
        });

        //移除子listing,仅删除样式
        $('.aoc_s_info_td_remove').click(function() {
            console.log($($(this)));
            // TODO 删除的时候至少要有一个sku
            if ($("#aoc_s_info_SubSkuInfo .aoc_s_info_subInfo_class").length == 1) {
                layer.msg("至少保存一条子listing");
                return;
            }
            $(this).closest('tr').next("tr").remove();
            $(this).closest('tr').remove();
        });

        $('.aoc_s_info_td_clickGenUpcEan').click(function() {
            var clickObj=$(this);
            var externalProductIdType=$('#amazon_online_creatListing_Form input[name=externalProductIdType]').val();
            if(externalProductIdType) {
                easy_ajax('/amazonListing/reFreshProductId.html', {type: externalProductIdType}, function (returnSkuData) {
                    clickObj.closest('td').find('input').val(returnSkuData.data);
                },null,'application/x-www-form-urlencoded')
            }else{
                layer.msg("请先选择店铺",{ icon: 5 });
            }
        });

        $('.aoc_s_info_td_empty').click(function() {
            $(this).closest('td').find('input').val("");
        });
    }
    var amazonOnline_onSubInfoData =`<tr class="aoc_s_info_subInfo_class">
                    <td><input type='text'  class="layui-input aoc_s_info_storeSSku_input" value=""></td>
                    <td class="aoc_s_info_td_externalProductIdType_td">&{externalProductIdType}</td>
                    <td>
                        <input type='text' readonly class="layui-input aoc_s_info_externalProductId_input" value="">
                        <button type="button"  class="layui-btn layui-btn-xs aoc_s_info_td_clickGenUpcEan">重新生成</button>
                        <button type="button" class="layui-btn layui-btn-xs aoc_s_info_td_empty">清空</button>
                    </td>
                    <td><input type='text'  class="layui-input" value=''><label class="aoc_s_info_td_weightUnit">&{weightUnit}</label></td>
                    <td><input type='text' class="layui-input" value=''
                               onkeyup="value=value.replace(/[^/&apos;/&quot;\\a-\\z\\A-\\Z0-9\u4E00-\u9FA5\\[\\]\\{\\}\\(\\)\\-\\&\\'\\.\\ ]/g,'')">
                    </td>
                    <td><input type='text' class="layui-input" value=''
                               onkeyup="value=value.replace(/[^/&apos;/&quot;\\a-\\z\\A-\\Z0-9\u4E00-\u9FA5\\[\\]\\{\\}\\(\\)\\-\\&\\'\\.\\ ]/g,'')">
                    </td>
                    <td><div class="layui-input-inline"><input type='number' class="layui-input" value=''><label class="aoc_s_info_td_currency">&{currency}</label></div></td>
                    <td><input type='number' class="layui-input" value='9999'></td>
                    <td>
                        <button type="button" class="layui-btn layui-btn-sm aoc_s_info_td_remove">移除</button>
                    </td>
                </tr>
                <tr class="aoc_s_info_pic_class">
                    <td colspan="10">
                        <div>
                            <div class="ImgDivIn aoc_s_info_mainImg" style="height:300px;width: 280px;float: left">
                                <img style="height:150px;max-width: 150px" originImage="" src="" class='b1'>
                            </div>

                            <div style="overflow: hidden">
                                <div>
                                    <button style="float:left" type="button" class="layui-btn layui-btn-sm aoc_s_info_addPic_btn">网络图片</button>
                                    <div style="float:left" class="aoc_s_info_extPic_edit_local"></div>
                                    <div class="p0">
                                        <div class="mTop5" style="margin-top: 1px;margin-bottom: 10px;">
                                            <span class="layui-bg-red">说明！</span>
                                            <span class="fColor2">点击图片拖动，即可调整图片顺序！</span>
                                            <span class="fColor2 mLeft10">「子sku辅图最多选用<span class="maxImgNum fRed">6</span>张，已经选用了<span class="curImgNum">
                                             0
                                      </span>张辅图</span>
                                        </div>
                                    </div>
                                </div>
                                <ul class="amazonSubImg_UL" style="overflow: hidden">

                                </ul>
                            </div>
                        </div>
                    </td>
                </tr>`


    var amazonOnline_imgData = {
        img: {
            head: '',
            tpl: '<li draggable="true" style="width: 150px;margin-bottom:40px;border:1px solid #ccc;overflow:hidden">' +
            '<div class="ImgDivOut">' +
            '<div class="ImgDivIn">' +
            '<img  style="height:150px;max-width: 150px" originImage="&{url}" src="&{url}">' +
            '</div>' +
            '<div class="imgDivDown" style="width:150px">' +
            '<a class="aoc_s_info_subInfo_setAsmainImage" style="float:left; color: #73a1bf;">设为主图</a><a class="aoc_s_info_subInfo_removeImage"  style="float:right; color: #73a1bf;">移除</a>' +
            '</div></div></div></li>'
        }
    }

    //publishNow 是否立即发布
    function amazonOnline_addListingProd(publishNow) {
        var detailData=easy_getFormReqObj('amazon_online_creatListing_Form');
        detailData.publishNow = publishNow;


        detailData.productDescription = amazon_online_creatListing_prodDesc_simditor.getValue(); //获取富文本的值

        if(detailData.productDescription){
            if(detailData.productDescription.length>2000){
                layer.msg('描述过长,不能超过2000字符');
                return false;
            }
        }else{
            layer.msg('描述不得为空');
            return false;
        }

        var editBulletPoints ="";
        $("#amazon_online_creatListing_bullet input").each(function(){
            if(editBulletPoints) {
                editBulletPoints += "#,#"+$(this).val();
            }else{
                editBulletPoints =$(this).val();
            }
        })

        detailData.bulletPoints =editBulletPoints;


        //添加子sku
        detailData.prodListingSubSkuAmazons = amazonOnline_getSkusInfo();
        if (detailData.prodListingSubSkuAmazons.length < 1) {
            layer.msg('请至少保留一条子sku信息');
            return false;
        }

        var hasColor = false;
        var hasSize = false;
        //
        var errMsg = "";
        var colorSizeJSON = {}; // 用于校验是否有重复的color_size
        var colorSize;
        $("#aoc_s_info_SubSkuInfo").find("tr").each(function () {
            if($(this).hasClass('aoc_s_info_pic_class')){
                return false;
            }

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
                    return false;
                }
            }
            varient.color = tdArr.eq(5).find('input').val();
            if (varient.color) {
                hasColor = true;
            }
            if (hasColor) {
                if (varient.color) {
                    //20190718取消了颜色校验
                    // colorNew = varient.color.toLowerCase();
                    // var colorArr = colorNew.split('&');//对每个颜色都要验证
                    // var dataColor;
                    // for (var i = 0; i < colorArr.length; ++i) {
                    //     dataColor = colorArr[i];
                    //     if ($.inArray(dataColor, merchantColors.toLowerCase().split(',')) == -1) {//判断是不是在amazon扩展色里面
                    //         errMsg = "存在非法颜色" + varient.color;
                    //         return;
                    //     }
                    // }
                } else {
                    errMsg = "多变种模板，任一变种有颜色，其他变种也当有颜色";
                    return false;
                }
            }
            var colorSize = escapeJquery(varient.color + '-' + varient.size).replace(/[&\|\\\*^%$#@\s\/]/g, "")
            if (colorSizeJSON[colorSize]) {
                errMsg = "存在颜色和尺寸都相同的变种";//校验(颜色_尺寸)相同
                return false;
            } else {
                colorSizeJSON[colorSize] = 1;
            }
        });

        if (errMsg) {
            layer.msg(errMsg);
            return false;
        }
        var result=false
        easy_ajax('/amazonListing/addListingDetail.html',JSON.stringify(detailData),function(){
            layer.closeAll();
            if (publishNow) {
                layer.msg('新增成功,并进入刊登流程');
            } else {
                layer.msg('新增成功');
            }
            result=true;
        },false,null,false);
        return result;
    }
    function easy_getFormReqObj(formIdName) {//获取表单参数
        var d = {};
        var t = $('#' + formIdName + ' [name]').serializeArray();
        $.each(t, function () {
            d[this.name] = this.value;
        });
        return d;
    }

    function amazonOnline_getSkusInfo() {
        var subSkus = [];
        var tdArr;
        var varient;
        $("#aoc_s_info_SubSkuInfo").find("tr").each(function () {
            if($(this).hasClass('aoc_s_info_pic_class')){
                return;
            }

            tdArr = $(this).children();
            varient = {};
            varient.storeSSku = tdArr.eq(0).find('input').val();
            varient.weight = tdArr.eq(3).find('input').val();
            varient.externalProductId = tdArr.eq(2).find('input').val();
            varient.size = tdArr.eq(4).find('input').val();
            varient.color = tdArr.eq(5).find('input').val();
            varient.standardPrice = tdArr.eq(6).find('input').val();
            varient.quantity = tdArr.eq(7).find('input').val();

            var nextTr= $(this).next("tr");
            if($(nextTr).hasClass('aoc_s_info_pic_class')){//存储的图片
                varient.mainImageUrl = $(nextTr).find('.aoc_s_info_mainImg img').attr('originImage');
                //辅图
                var otherImageUrl="";
                $(nextTr).find('.amazonSubImg_UL li').each(function () {
                    var extImg=$(this).find('img').attr('originImage');
                    if(extImg){
                        if(otherImageUrl) {
                            otherImageUrl=otherImageUrl+"|"+extImg
                        }else{
                            otherImageUrl=extImg;
                        }
                    }
                });
                varient.otherImageUrl = otherImageUrl;
            }
            subSkus.push(varient);
        });
        return subSkus;
    }

    //task#1912---在线商品的问题
    form.on('select(amazon_online_sortdesc_sel)', function (obj) {
        let val = obj.value;
        let valArr = ['5', '6', '7', '8'];
        let $salesType = $('#amazon_online_searchForm').find('select[name=salesType]');
        if (valArr.includes(val)) {
            $salesType.val('FBM');
        }
        form.render('select');
    })
});