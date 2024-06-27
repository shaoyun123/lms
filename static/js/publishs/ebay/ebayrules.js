layui.use(['admin', 'form', 'layer', 'formSelects', 'element', 'table', 'laypage', 'laydate'], function() {
    var admin = layui.admin,
        form = layui.form,
        table = layui.table,
        layer = layui.layer,
        formSelects = layui.formSelects,
        laydate = layui.laydate,
        laypage = layui.laypage,
        $ = layui.$;

    form.render();

    // 初始化ebay店铺
    commonReturnPromise({
        url: `/lms/sys/liststorebyplatcode.html?platCode=ebay`,
        type: 'post'
    }).then(function(result){
        commonRenderSelect("ebayrules_storeAcctIds", result, {
            name: 'storeAcct',
            code: 'id'
        }).then(()=>form.render())
    }).catch(err => layer.msg(err, {icon:2}))

    // 初始化ebay站点
    ebayrules_initAmazonSiteAjax().then(function(result){
        commonRenderSelect("ebayrules_siteIds", result.ebaySiteList, {
            name: 'siteName',
            code: 'siteId'
        }).then(()=>{$("#ebayrules_searchForm #ebayrules_siteIds").val("");form.render("select")})
    }).catch(err => layer.msg(err, {icon:2}))

    //初始化ebay站点请求
    function ebayrules_initAmazonSiteAjax() {
        return commonReturnPromise({
            type: 'post',
            url: ctx + "/onlineProductEbay/getAllEbaySiteAndLogisAttr",
        })
    }

    // 初始化创建人
    commonReturnPromise({
        url: ctx + `/ebayAutoListingRuleController/rule/listEbayRuleCreator`,
        type: 'get'
    }).then(function(res){
        const arr=res.map(item=>({
            name: item.creator,
            value:item.creatorId,
        }))
        formSelects.data('ebayRule_serach_creatorId', 'local', {arr})
    })

    //渲染开发类型,商品标签和物流属性,商品归属人
    function newpublishRenderSelect() {
        return commonReturnPromise({
                url: '/lms/fyndiq/new/listing/manage.html'
            })
    }

    $("#ebayrules_searchBtn").on("click", function() {
        ebayrules_tableRender()
    });

    function ebayrules_tableRender() {
        layui.admin.load.show();
        var whereData = serializeObject($('#ebayrules_searchForm')); // 获取form表单数据
        whereData.storeAcctIdList = whereData.storeAcctIds.split(',').filter(item=>!!item).map(item=>Number(item))
        whereData.siteIdList = whereData.siteIds.split(',').filter(item=>!!item).map(item=>Number(item))
        whereData.creatorIdList = whereData.creatorId.split(',').filter(item=>!!item).map(item=>Number(item))
        delete whereData.storeAcctIds
        delete whereData.siteIds
        delete whereData.creatorId
        // 规则表
        var tableIns = table.render({
            elem: "#ebayrules_table_addrules",
            method: 'post',
            url: ctx + "/ebayAutoListingRuleController/rule/queryPage.html",
            contentType: 'application/json;charset=UTF-8',
            where: whereData,
            cols: [
                [
                    { field: "status", title: "状态", templet: '#ebayrules_tabletemplet_type' },
                    { field: "ruleName", title: "规则名称" },
                    { field: "siteName", title: "站点" },
                    {
                        field: "storeNums",
                        title: '应用店铺数量',
                        templet: '#ebayrules_tabletemplet_count'
                    },
                    { field: "executionWeekTime", title: '执行日期（每周）' },
                    { field: "remark", title: '备注' },
                    { field: "creator", title: '创建人' },
                    { field: "modifier", title: '修改人' },
                    { title: '操作', align: 'center', toolbar: '#ebayrules_tabletemplet_optionbtn' }
                ],
            ],
            id: "ebayrules_table_addrules",
            page: true,
            limits: [100, 200, 500],
            limit: 100,
        });
    }

    // // 监听规则弹窗的刊登规则选择
    form.on('radio(ebayrules_addRule_ruleType)', function (data) {
        if (data.value == 1) {
            $('#ebayrules_listingNum').hide()
        } else if (data.value == 2) {
            $('#ebayrules_listingNum').show()
        }
    })

    // 验证规则信息
    function checkAddrulesData() {
        let obj = serializeObject($('#ebayrules_form_addrules')),
            err = '';

        // if (obj.ruleType == '' || obj.ruleType == undefined) {
        //     ebaycheckAddrulesBorderRed('.ebayrules_ruleType_radio')
        //     err = '请选择刊登规则'
        // }
        // if (obj.ruleType == 2 && obj.listingTemplateNum == '') {
        //     err = '刊登模板数量需必填'
        //     ebaycheckAddrulesFocus('input', 'listingTemplateNum')
        // }
        // if (obj.ruleType == 2 && obj.listingStoreNum == '') {
        //     err = '刊登店铺数量需必填'
        //     ebaycheckAddrulesFocus('input', 'listingStoreNum')
        // }
        if (obj.executionWeekTime == '' || obj.executionWeekTime == undefined) err = '刊登日期不能为空';
        if (obj.siteCode == '') err = 'EBAY站点不能为空';
        if (obj.ruleName == '') err = '规则名称不能为空';
        if (!obj.ruleType) err = '请选择刊登规则';
        if (obj.ruleType === '2'){
            if(obj.listingTemplateNum==="") err = '请输入刊登模板数'
            if(obj.listingStoreNum==="") err = '请输入每个模板刊登店铺数'
        }

        if (err) {
            layer.alert(err, { icon: 2 });
            return 0;
        }

        return 1;
    }


    // function ebaycheckAddrulesFocus(type, name) {
    //     $('#ebayrules_form_addrules ' + type + '[name=' + name + ']').addClass('layui-form-danger').focus();
    //     setTimeout(function () {
    //         $('#ebayrules_form_addrules ' + type + '[name=' + name + ']').removeClass('layui-form-danger')
    //     }, 1500);
    // }
    //
    // function ebaycheckAddrulesBorderRed(className) {
    //     $('#ebayrules_form_addrules').find(`${className}`).css('border', '1px solid red');
    //     setTimeout(function () {
    //         $('#ebayrules_form_addrules').find(`${className}`).css('border', '');
    //     }, 1500);
    // }

    // 重载规则表
    function reloadAddrules() {
        table.reload('ebayrules_table_addrules', {
            page: { curr: 1 }
        });
    }

    // 规则表格操作监听
    table.on('tool(ebayrules_table_addrules)', function(obj) {
        var layEvent = obj.event; //获得 lay-event 对应的值
        var trdata = obj.data; //获得当前行数据
        let xtree;
        if (layEvent === 'remark') {
            layer.open({
                title: '编辑规则',
                type: 1, //不加该属性,就会出现[object Object]
                area: ['1000px', '70%'],
                btn: ['保存', '关闭'],
                content: $('#ebayrules_layer_addrules').html(),
                success: function() {
                    Promise.all([ebayrules_initAmazonSiteAjax(), newpublishRenderSelect()]).then(function(res){
                        //商品标签prodTagMap[数组对象]
                        commonRenderSelect("prodAttrList", res[1].prodTagMap, {
                            name: 'name',
                            code: 'name'
                        }).then(()=> formSelects.render("prodAttrList"));
                        //物流属性logisAttrEnums[数组]
                        commonRenderSelect("logisAttrList", res[1].logisAttrEnums).then(()=> formSelects.render("logisAttrList"))
                        // 开发类型
                        commonRenderSelect('ebayRules_devType', res[1].devTypeEnums).then(()=>formSelects.render('ebayRules_devType'))
                        //商品归属人[数组对象]
                        commonRenderSelect("bizzOwnerIdList", res[1].bizzOwners, {
                            name: 'userName',
                            code: 'id'
                        }).then(()=> formSelects.render("bizzOwnerIdList"))

                        commonReturnPromise({
                            url: ctx + "/ebayAutoListingRuleController/rule/get/" + trdata.id
                        }).then(function(data) {
                            let siteCodeDom = $("#siteCode");
                            let optStr = '';
                            // 站点
                            commonRenderSelect("siteCode", res[0].ebaySiteList, {
                                name: 'siteName',
                                code: 'siteId'
                            }).then(()=>{$("#ebayrules_form_addrules #siteCode").val(data.siteCode);form.render()})

                            $('#ebayrules_form_addrules input[name="auditDays"]').val(data.auditDays);
                            // 商品类目
                            initEbayCateTree().then(function (result) {
                                var prodCateIds =
                                data && data.categoryIdList ? data.categoryIdList.split(",") : []
                                for (var i = 0; i < prodCateIds.length; i++) {
                                var node = ebayCateTree.getNodeByParam("value", prodCateIds[i])
                                if (node != null) {
                                    ebayCateTree.checkNode(node, true, false, true)
                                }
                                }
                            })
                            //模板sku
                            $('#ebayrules_form_addrules textarea[name="prodPSkuListStr"]').val(data.prodPSkuListStr)

                            $('#ebayrules_form_addrules input[name="costMax"]').val(data.costMax);
                            $('#ebayrules_form_addrules input[name="costMin"]').val(data.costMin);

                            let executionWeekTime = data.executionWeekTime.split(',');
                            executionWeekTime.forEach(function(item) {
                                $("input[name='executionWeekTime']:checkbox[value=" + item + "]").attr('checked', 'true');
                            })

                            if (data.expectedStockOnway === "" || data.expectedStockOnway === undefined) { // 预计可用含在途大于
                                $('#ebayrules_form_addrules select[name="ebayrules_sel_expectedStock"]').val(1);
                                $('#ebayrules_form_addrules input[name="expectedStockExway"]').val(data.expectedStockExway); // 不含显示
                                $("input[name='expectedStockOnway']").hide();
                                $("input[name='expectedStockExway']").show();

                            } else {
                                $('#ebayrules_form_addrules select[name="ebayrules_sel_expectedStock"]').val(0);
                                $('#ebayrules_form_addrules input[name="expectedStockOnway"]').val(data.expectedStockOnway);
                                $("input[name='expectedStockOnway']").show();
                                $("input[name='expectedStockExway']").hide(); // 预计可用不含在途大于 输入框隐藏
                            }

                            $('#ebayrules_form_addrules select[name="multiSub"]').val(data.multiSub == undefined ? 0 : (data.multiSub + ''));
                            $('#ebayrules_form_addrules select[name="orderField"]').val(data.orderField);


                            $('#ebayrules_form_addrules input[name="remark"]').val(data.remark);
                            $('#ebayrules_form_addrules input[name="ruleName"]').val(data.ruleName);
                            // $('#ebayrules_form_addrules select[name="siteCode"]').val(data.siteCode);

                            $('#ebayrules_form_addrules input[name="status"]:radio[value=' + data.status + ']').attr('checked', 'true')
                            $('#ebayrules_form_addrules input[name="weightMax"]').val(data.weightMax);
                            $('#ebayrules_form_addrules input[name="weightMin"]').val(data.weightMin);

                            $('#ebayrules_form_addrules select[name="warehouseId"]').val(data.warehouseId); //仓库

                            let bizzOwnerIdList = data.bizzOwnerIdList.split(",");
                            formSelects.value("bizzOwnerIdList", bizzOwnerIdList);

                            let logisAttrList = data.logisAttrList.split(",");
                            formSelects.value("logisAttrList", logisAttrList);

                            let devTypeStr = (data.devTypeStr||'').split(',')
                            formSelects.value("ebayRules_devType", devTypeStr);

                            let prodAttrList = data.prodAttrList.split(",");
                            formSelects.value("prodAttrList", prodAttrList);

                            // // 刊登规则  刊登模板数
                            $('#ebayrules_form_addrules').find(`input[name=ruleType]:radio[value=${data.ruleType}]`).attr("checked", true)
                            if (data.ruleType == 2) {
                                $('#ebayrules_form_addrules').find('input[name=listingTemplateNum]').val(data.listingTemplateNum)
                                $('#ebayrules_form_addrules').find('input[name=listingStoreNum]').val(data.listingStoreNum)
                                $('#ebayrules_form_addrules').find('input[name=listingMaxNum]').val(data.listingMaxNum)
                            } else {
                                $('#ebayrules_listingNum').hide()
                            }
                            form.render();
                        }).catch(err=>layer.msg(err, {icon:2}));
                    }).catch(err=>layer.msg(err, {icon:2}))
                },
                yes: function(index, layero) {
                    // 类目树
                    let chkedNodeId = ebayCateTree.getCheckedNodes(true)
                    let autoPublishCateIds = chkedNodeId
                        .map(function (item) {
                            return item.value
                        })
                        .join()

                    var flag = checkAddrulesData();
                    if (flag == 0) return;

                    let obj = serializeObject($('#ebayrules_form_addrules'));
                    obj.categoryIdList = autoPublishCateIds
                    obj.siteName = $.trim($('#ebayrules_form_addrules select[name="siteCode"] option:selected').text());
                    obj.bizzOwnerIdList = formSelects.value('bizzOwnerIdList', 'val').join(",").trim();
                    // 模板sku
                    if(obj.prodPSkuListStr){
                        obj.prodPSkuListStr = obj.prodPSkuListStr.replaceAll('，',',').split(',').filter(item=>!!item).join()
                    }
                    obj.logisAttrList = formSelects.value('logisAttrList', 'val').join(",").trim();
                    obj.prodAttrList = formSelects.value('prodAttrList', 'val').join(",").trim();
                    obj.id = trdata.id;

                    obj.expectedStockOnway == '' ? obj.expectedStockOnway = -9999 : obj.expectedStockOnway = obj.expectedStockOnway * 1;
                    obj.expectedStockExway == '' ? obj.expectedStockExway = -9999 : obj.expectedStockExway = obj.expectedStockExway * 1;

                    obj.multiSub == "0" ? obj.multiSub = null : '';

                    obj.isComplete = trdata.isComplete;
                    obj.isProhibit = trdata.isProhibit;
                    obj.isSale = trdata.isSale;
                    obj.tortPlat = trdata.tortPlat;
                    obj.isListing = trdata.isListing;
                    obj.isGenerate = trdata.isGenerate;
                    obj.createTime = trdata.createTime;

                    obj.creator = trdata.creator;
                    obj.creatorId = trdata.creatorId;
                    delete obj.undefined
                    commonReturnPromise({
                        type: 'post',
                        url: ctx + '/ebayAutoListingRuleController/rule/editInfo',
                        contentType: 'application/json',
                        params: JSON.stringify(obj)
                    }).then(function(result) {
                        layer.msg(result.msg || '保存成功', { icon: 1 });
                        reloadAddrules()
                        layer.close(index);
                    }).catch(err=>layer.msg(err, {icon:2}))
                }
            });

        } else if (layEvent === 'delete') {
            let popIndex = layer.confirm("确定要删除此条规则吗？", function() {
                commonReturnPromise({
                    url: `/lms/ebayAutoListingRuleController/rule/delete/` + trdata.id, // 规则-删除规则接口
                    type: 'delete'
                }).then(function(result){
                    layer.msg(result, { icon: 1 });
                    reloadAddrules()
                    layer.close(popIndex);
                }).catch(err=>layer.msg(err, {icon:2}))
            })
        } else if (layEvent === 'ebayrules_tabletemplet_count') {
            // 应用店铺数量弹框
            let ruleId = trdata.id,
                rulename = trdata.ruleName;
            let popIndex = layer.open({
                title: '设置店铺',
                type: 1, //不加该属性,就会出现[object Object]
                area: ['1000px', '70%'],
                content: $('#ebayrules_layer_storemanage').html(),
                success: function() {
                    $(".storemanage_name").text(rulename);
                    $(".storemanage_id").val(ruleId)
                    ebayRule_batchRemove(ruleId)
                    handleStoremanageTable(ruleId);
                    form.render();
                }
            })
        }else if(layEvent === 'addCopy'){
            // 刊登规则复制
            let popIndex = layer.open({
                shadeClose: false,
                type: 1,
                title: '复制新增',
                area: ['500px', '400px'],
                btn: ['新建', '关闭'],
                content: $('#ebayRules_addCopy_layer').html(),
                success: () => {
                    // 初始化站点
                    ebayrules_initAmazonSiteAjax().then(function(res){
                        let siteData = res.ebaySiteList.map(e => ({ ...e, value: e.siteId,name:e.siteName }))
                        formSelects.data('ebayRules_addCopy_salesSite_sel', 'local', { arr: siteData })
                    }).catch(err => layer.msg(err, {icon:2}))
                },
                yes: () => {
                    let salesSites = formSelects.value('ebayRules_addCopy_salesSite_sel', 'val'); 
                    if(!salesSites.length) return layer.msg("请选择站点")
                    commonReturnPromise({
                        url: ctx + `/ebayAutoListingRuleController/rule/addCopy/${trdata.id}`,
                        type:'post',
                        contentType:'application/json;charset=UTF-8',
                        params: JSON.stringify(salesSites)
                    }).then(res=>{
                        layer.msg(res,{icon:1})
                        $('#ebayrules_searchBtn').click()
                        layer.close(popIndex)
                    })
                }
            })
        }else if(layEvent === 'log'){
            //渲染日志
            commonReturnPromise({
                type: 'GET',
                url: `/lms/amazonAutoListingRule/logs?ruleId=${trdata.id}&platCode=ebay`,
            }).then(result => {
                publishRulesLogLayer(result,trdata.ruleName)
            }).catch(err => {
                layer.msg(err, {icon: 2});
            });
        }
    })

    // 添加规则弹框
    $("#ebayrules_btn_addrules").click(function() {
        let xtree;
        let popIndex = layer.open({
            title: '添加规则',
            type: 1, //不加该属性,就会出现[object Object]
            area: ['1000px', '70%'],
            btn: ['保存', '关闭'],
            content: $('#ebayrules_layer_addrules').html(),
            success: function() {
                Promise.all([ebayrules_initAmazonSiteAjax(), newpublishRenderSelect()]).then(function(res){
                    //商品标签prodTagMap[数组对象]
                    commonRenderSelect("prodAttrList", res[1].prodTagMap, {
                        name: 'name',
                        code: 'name'
                    }).then(()=> formSelects.render("prodAttrList"));
                    // 开发类型
                    commonRenderSelect('ebayRules_devType', res[1].devTypeEnums).then(()=>formSelects.render('ebayRules_devType'))
                    //物流属性logisAttrEnums[数组]
                    commonRenderSelect("logisAttrList", res[1].logisAttrEnums).then(()=> formSelects.render("logisAttrList"))
                    //商品归属人[数组对象]
                    commonRenderSelect("bizzOwnerIdList", res[1].bizzOwners, {
                        name: 'userName',
                        code: 'id'
                    }).then(()=> formSelects.render("bizzOwnerIdList"))
                    // 站点
                    commonRenderSelect("siteCode", res[0].ebaySiteList, {
                        name: 'siteName',
                        code: 'siteId'
                    }).then(()=>{$("#ebayrules_form_addrules #siteCode").val("");form.render()})

                }).catch(err=>layer.msg(err,{icon:2}))

                $('input[name="expectedStockExway"]').hide(); // 预计可用不含在途大于 输入框隐藏
                // 商品类目
                initEbayCateTree().then(function (result) {
                    var prodCateIds = []
                    for (var i = 0; i < prodCateIds.length; i++) {
                    var node = ebayCateTree.getNodeByParam("value", prodCateIds[i])
                    if (node != null) {
                        ebayCateTree.checkNode(node, true, false, true)
                    }
                    }
                })
            },
            yes: function(index, layero) {
                // 类目树
                let chkedNodeId = ebayCateTree.getCheckedNodes(true)
                let autoPublishCateIds = chkedNodeId
                    .map(function (item) {
                        return item.value
                    })
                    .join()

                var flag = checkAddrulesData();
                if (flag == 0) return;

                let obj = serializeObject($('#ebayrules_form_addrules'));
                // 类目
                obj.categoryIdList = autoPublishCateIds
                obj.siteName = $.trim($('#ebayrules_form_addrules select[name="siteCode"] option:selected').text());
                obj.bizzOwnerIdList = formSelects.value('bizzOwnerIdList', 'val').join(",").trim();
                // 模板SKU
                if(obj.prodPSkuListStr){
                    obj.prodPSkuListStr = obj.prodPSkuListStr.replaceAll('，',',').split(',').filter(item=>!!item).join()
                }
                obj.logisAttrList = formSelects.value('logisAttrList', 'val').join(",").trim();
                obj.prodAttrList = formSelects.value('prodAttrList', 'val').join(",").trim();

                obj.multiSub == "0" ? obj.multiSub = null : '';

                obj.isComplete = '';
                obj.isProhibit = '';
                obj.isSale = '';
                obj.tortPlat = '';
                obj.isListing = '';
                obj.isGenerate = '';
                obj.createTime = '';
                    
                delete obj.undefined
                commonReturnPromise({
                    url: `/lms/ebayAutoListingRuleController/rule/addRule`,
                    type: 'post',
                    contentType: 'application/json',
                    params:JSON.stringify(obj)
                }).then(function(result){
                    layer.msg("添加规则成功!", { icon: 1 });
                    layer.close(popIndex);
                    // reloadAddrules();
                    $('#ebayrules_searchBtn').click()
                }).catch(err=>layer.msg(err, {icon:2}))
            }
        })
    })

    //店铺表
    function handleStoremanageTable(ruleId) {
        table.render({
            elem: "#ebayrules_table_storemanage",
            method: 'get',
            url: ctx + "/ebayAutoListingRuleStoreController/store/list/" + ruleId, // 店铺列表接口
            cols: [
                [
                    { type: 'checkbox' },
                    { field: "storeAcct", title: "店铺名" },
                    { field: "stock", title: "在线库存" },
                    {
                        field: "allowAttract",
                        title: "是否开启引流",
                        templet: function(res) {
                            return res.allowAttract == true ? '已开启' : '未开启';
                        }
                    },
                    { field: "dailyPublishNums", title: '刊登量' },
                    {
                        field: "publishTime",
                        title: '上架开始时间',
                        templet: function(res) {
                            return "中国时间：" + res.publishTime + ":00"
                        }
                    },
                    {
                        field: "publishInterval",
                        title: '上架间隔时间',
                        templet: function(res) {
                            if(res.publishInterval < 60){
                                return res.publishInterval + "秒"
                            }else {
                                return res.publishInterval/60 + "分钟"
                            }

                        }
                    },
                    { field: "creator", title: '创建人' },
                    { field: "modifier", title: '修改人' },
                    { title: '操作', align: 'center', toolbar: '#ebayrules_tabletemplet_optionbtn_store' }
                ],
            ],
            id: "ebayrules_table_storemanage",
            page: true,
            limits: [100, 200, 500],
            limit: 100,
        });
    }

    function reloadStoremanage() {
        table.reload('ebayrules_table_storemanage', {
            page: { curr: 1 }
        });
        reloadAddrules();
    }

    // 验证店铺信息
    function checkStoremanageData() {
        let stock = $('input[name="stock"]').val(),
            dailyPublishNums = $('input[name="dailyPublishNums"]').val(),
            storeNameStr = $('input[name="storeNameStr"]').val(),
            publishTime = $('select[name="publishTime"]').val();
        let err = '';

        if (storeNameStr == '') err = '店铺名不能为空';
        if (stock == '') err = '在线库存不能为空';
        if (dailyPublishNums == '') err = '每天刊登量不能为空';
        if (publishTime == '') err = '请选择上架开始时间';

        if (err) {
            layer.alert(err, { icon: 2 });
            return 0;
        }

        return 1;
    }

    // 店铺表格操作监听
    table.on('tool(ebayrules_table_storemanage)', function(obj) {
        var layEvent = obj.event; //获得 lay-event 对应的值
        var trdata = obj.data; //获得当前行数据
        if (layEvent === 'remark') { //编辑店铺
            let popIndex = layer.open({
                title: '编辑店铺',
                type: 1, //不加该属性,就会出现[object Object]
                area: ['500px', '70%'],
                btn: ['保存', '关闭'],
                content: $('#ebayrules_layer_storeadd').html(),
                success: function() {
                    commonReturnPromise({
                        url: `/lms/ebayAutoListingRuleStoreController/store/get/` + trdata.id, // 店铺详情接口
                        type: 'get'
                    }).then(function(data){
                        data.allowAttract == true ? $("input[name='allowAttract']:checkbox").attr('checked', 'true') : '';
                        $('input[name="dailyPublishNums"]').val(data.dailyPublishNums);
                        $('select[name="publishInterval"]').val(data.publishInterval);
                        $('select[name="publishTime"]').val(data.publishTime);
                        $('input[name="stock"]').val(data.stock);
                        $('input[name="storeNameStr"]').val(data.storeAcct);
                        $('input[name="storeNameStr"]').attr("disabled", "true");

                        form.render();
                    }).catch(err=>layer.msg(err, {icon:2}))
                },
                yes: function(index, layero) {

                    var flag = checkStoremanageData();
                    if (flag == 0) return;

                    let obj = serializeObject($('#ebayrules_storeadd'));
                    obj.allowAttract = $.trim($('input[name="allowAttract"]').prop('checked'));
                    obj.id = trdata.id;
                    commonReturnPromise({
                        url: `/lms/ebayAutoListingRuleStoreController/store/editInfo`, // 修改店铺信息接口
                        type: 'put',
                        contentType: 'application/json',
                        params:JSON.stringify(obj)
                    }).then(function(result){
                        layer.msg(result, { icon: 1 });
                        layer.close(popIndex);
                        reloadStoremanage();
                    }).catch(err=>layer.msg(err, {icon:2}))
                }
            })
        } else if (layEvent === 'delete') {
            let popIndex = layer.confirm("确定要删除此店铺吗？", function() {
                commonReturnPromise({
                    url: `/lms/ebayAutoListingRuleStoreController/store/delete/` + trdata.id, // 删除店铺信息
                    type: 'delete'
                }).then(function(result){
                    layer.msg(result, { icon: 1 });
                    layer.close(popIndex);
                    reloadStoremanage();
                }).catch(err=>layer.msg(err, {icon:2}))
            })
        }
    })

    //添加店铺
    $(document).on("click", "#ebayrules_storemanage_storeaddbtn", function() {
        let ruleId = $(this).next().val().trim();
        let popIndex = layer.open({
            title: '添加店铺',
            type: 1, //不加该属性,就会出现[object Object]
            area: ['500px', '70%'],
            btn: ['保存', '关闭'],
            content: $('#ebayrules_layer_storeadd').html(),
            success: function() {
                form.render();
            },
            yes: function(index, layero) {
                var flag = checkStoremanageData();
                if (flag == 0) return;

                let obj = serializeObject($('#ebayrules_storeadd'));
                obj.allowAttract = $.trim($('input[name="allowAttract"]').prop('checked'));
                obj.ruleId = ruleId;

                obj.storeNameStr = obj.storeNameStr.replace('，', ',');
                commonReturnPromise({
                    url: `/lms/ebayAutoListingRuleStoreController/store/setStoreForRule`, // 添加店铺接口
                    type: 'post',
                    contentType: 'application/json',
                    params:JSON.stringify(obj)
                }).then(function(result){
                    layer.msg(result, { icon: 1 });
                    layer.close(popIndex);
                    reloadStoremanage();
                }).catch(err=>layer.msg(err, {icon:2}))
            }
        })
    })

    function ebayRule_batchRemove(ruleId){
        $('#ebayrules_storemanage_storeRemovebtn').click(function(){
            const { data } = table.checkStatus('ebayrules_table_storemanage')
            // if(!data.length) return layer.msg('请选择店铺',{icon:7})
            const storeNameStr = data.map(item=>item.storeAcct).join('\n')
        let popIndex = layer.open({
            title: '删除店铺',
            type: 1, //不加该属性,就会出现[object Object]
            area: ['500px', '70%'],
            btn: ['保存', '关闭'],
            content: $('#ebayrules_layer_storedel').html(),
            success: function(layero) {
                layero.find('textarea[name=storeNameStr]').val(storeNameStr)
                // layero.find('textarea[name=storeNameStr]').blur(function(){
                //     const str = $(this).val().replaceAll('，',',').split(',').filter(item=>!!item).join(',')
                //     $(this).val(str)
                // })
                form.render();
            },
            yes: function(index, layero) {
                let storeNameStr = layero.find('textarea[name=storeNameStr]').val()
                if(!storeNameStr) layer.msg('请输入要删除店铺的名称')
                let params = {storeNameStr,ruleId}
                ebayRule_removeStoreAjax(params)
                .then(res=>{
                    layer.msg(res,{icon:1})
                    reloadStoremanage()
                    layer.close(popIndex);
                })
            }
        })
        })
    }

    function ebayRule_removeStoreAjax(obj){
        return commonReturnPromise({
            url: ctx + '/ebayAutoListingRuleStoreController/store/removeByStoreNames',
            contentType: 'application/json;charset=UTF-8',
            params: JSON.stringify(obj),
            type: 'post'
        })
    }

    // 添加规则--预计可用在途
    form.on('select(ebayrules_sel_expectedStock)', function(data) {
        if (data.value == 0) { // 预计可用含在途大于
            $("input[name='expectedStockOnway']").show();
            $("input[name='expectedStockExway']").hide(); // 预计可用不含在途大于 输入框隐藏
        } else if (data.value == 1) {
            $("input[name='expectedStockOnway']").hide();
            $("input[name='expectedStockExway']").show();
        }
        $("input[name='expectedStockOnway']").val("");
        $("input[name='expectedStockExway']").val("");
    });

    // 更新规则状态
    form.on('switch(orderDownloadStatus)', function(data) {
        let id = data.value,
            status = data.elem.checked == true ? 1 : 0;
        let checked = data.elem.checked;
        let popIndex = layer.confirm("确定要修改此规则状态吗？", function() {
            commonReturnPromise({
                url: `/lms/ebayAutoListingRuleController/rule/updateStatus/` + id,
                type: 'put',
                params:{ status: status }
            }).then(function(result){
                $("#ebayrules_searchBtn").click();
                layer.msg(result, { icon: 1 });
                layer.close(popIndex);
            }).catch(err=>layer.msg(err, {icon:2}))
        }, function() {
            data.elem.checked = !checked;
            form.render();
        });
    });

    //初始化ebay商品类目
function initEbayCateAjax() {
    return commonReturnPromise({
      url: ctx + "/prodcate/listCategoryTree",
    })
  }
    function initEbayCateTree(){
//左侧类目tree
return new Promise(function (resolve) {
    initEbayCateAjax()
      .then(function (result) {
        var setting = {
          check: {
            enable: true,
            chkDisabledInherit: true,
          },
          data: {
              key:{
                  checked:'checked',
                  children:'data',
                  name:'title'
              },
          },
          callback: {
            onCheck: function (event, treeId, treeNode) {
              //禁用所有子类
              if (treeNode.isParent) {
                var childrenNodes = treeNode.data
                try {
                  for (var i = 0; i <= childrenNodes.length; i++) {
                    ebayCateTree.setChkDisabled(
                      childrenNodes[i],
                      treeNode.checked,
                      false,
                      true
                    )
                  }
                } catch (e) {
                  //TODO handle the exception
                  console.log(e)
                }
                var childrenIds = getEbayChildren([], treeNode)
                for (var i = 0; i < childrenIds.length; i++) {
                  var node = ebayCateTree.getNodeByParam("value", childrenIds[i])
                  ebayCateTree.checkNode(node, treeNode.checked, false, true)
                }
              }
            },
          },
        }
        setting.check.chkboxType = {
          Y: "s",
          N: "s",
        }
        ebayCateData = result
        var t = $("#ebayrulesCateTree")
        t = $.fn.zTree.init(t, setting, ebayCateData)
        ebayCateTree = $.fn.zTree.getZTreeObj("ebayrulesCateTree")
        resolve("tree")
      })
      .catch(function (err) {
        layer.alert(err, {
          icon: 2,
        })
      })
  })
    }
    
  //获取ztree所有字节点value
  function getEbayChildren(values, treeNode) {
    values.push(treeNode.value)
    if (treeNode.isParent) {
      for (var obj in treeNode.data) {
        getEbayChildren(values, treeNode.data[obj])
      }
    }
    return values
  }

});