layui.use(['admin', 'form', 'layer', 'formSelects', 'element', 'table', 'laypage', 'laydate'], function () {
    var admin = layui.admin,
        form = layui.form,
        table = layui.table,
        layer = layui.layer,
        formSelects = layui.formSelects,
        laydate = layui.laydate,
        laypage = layui.laypage,
        $ = layui.$;

    form.render();
    formSelects.render("wishrules_storeAcctIds")

    //创建人枚举数据
    commonReturnPromise({
        url: `/lms/sys/listAllUser.html`,
        type: 'POST',
    }).then(function(result){
        result.unshift({id:-1,userName: "system"})
        commonRenderSelect("wishrules_creator", result, {
            name: 'userName',
            code: 'id'
        }).then(()=> form.render())
    }).catch(function(err){
        layer.msg(err, {icon:2});
    })

    // 搜索条件，店铺下拉框
    // commonReturnPromise({
    //     url: `/lms/sys/listStoreForRenderHpStoreCommonComponent.html`,
    //     type: 'POST',
    //     params:{roleNames: "wish专员,joom专员", platCode: 'wish'}
    // }).then(function(result){
    //     commonRenderSelect("storeAcctIds", result, {
    //         name: 'storeAcct',
    //         code: 'id'
    //     }).then(()=> formSelects.render('storeAcctIds'))
    // }).catch(function(err){
    //     layer.msg(err, {icon:2});
    // })
    commonReturnPromise({
        url: `/lms/sys/listStoreForRenderHpStoreCommonComponentWishAndJoom`,
        params:{roleNames: "wish专员,joom专员"}
    }).then(function(result){
        commonRenderSelect("wishrules_storeAcctIds", result, {
            name: 'storeAcct',
            code: 'id'
        }).then(()=> formSelects.render('wishrules_storeAcctIds'))
    }).catch(function(err){
        layer.msg(err, {icon:2});
    })

    //渲染开发类型,商品标签和物流属性,商品归属人
    function newpublishRenderSelect(){
        commonReturnPromise({
            url: '/lms/fyndiq/new/listing/manage.html'
        })
            .then(function(result){
                //商品标签prodTagMap[数组对象]
                var prodTagMap=result.prodTagMap;
                commonRenderSelect("prodAttrList", prodTagMap, {
                    name: 'name',
                    code: 'name'
                }).then(function(){
                    formSelects.render('prodAttrList');
                });
                //物流属性logisAttrEnums[数组]
                var logisAttrEnums = result.logisAttrEnums;
                commonRenderSelect("logisAttrList", logisAttrEnums).then(function(){
                    formSelects.render("logisAttrList");
                })
            })
            .catch(function(err){
                layer.msg(err,{icon:2});
            });
    }

    // // 搜索
    // var wishrulesPage = {};
    // wishrulesPage.curr = 1;
    // wishrulesPage.limit = 50
    // wishrulesPage.count = 0;

    $("#wishrules_searchBtn").on("click", function() {
        wishrules_tableRender()
    });

    function wishrules_tableRender() {
        layui.admin.load.show();
        // var whereData = wishrulesGetSerachData();
        var whereData = serializeObject($('#wishrules_searchForm'));  // 获取form表单数据
        // whereData.page = pageNum;
        // whereData.limit = limit;
        // 规则表
        var tableIns = table.render({
            elem: "#wishrules_table_addrules",
            method: 'post',
            url: ctx + "/wishAutoListingRuleController/rule/queryPage.html",
            where:whereData,
            cols: [
                [
                    {field: "status", title: "状态", templet: '#wishrules_tabletemplet_type'},
                    {field: "ruleName", title: "规则名称"},
                    {
                        field: "storeNums", title: '应用店铺数量', templet: '#wishrules_tabletemplet_count'
                    },
                    {field: "executionWeekTime", title: '执行日期（每周）'},
                    {field: "remark", title: '备注'},
                    {field: "creator", title: '创建人'},
                    {field: "modifier", title: '修改人'},
                    {title: '操作', align: 'center', toolbar: '#wishrules_tabletemplet_optionbtn'}
                ],
            ],
            id: "wishrules_table_addrules",
            page: true,
            limits: [50, 100, 150],
            limit: 50,
        });
    }

    // 监听规则弹窗的刊登规则选择
    form.on('radio(wishrules_addRule_ruleType)', function (data) {
        if (data.value == 1) {
            $('#wishrules_listingNum').hide()
        } else if (data.value == 2) {
            $('#wishrules_listingNum').show()
        }
    })

    // 验证规则信息
    function checkAddrulesData(){
        let obj = serializeObject($('#wishrules_form_addrules')),err='';

        if (obj.ruleType == '' || obj.ruleType == undefined) {
            wishcheckAddrulesBorderRed('.wishrules_ruleType_radio')
            err = '请选择刊登规则'
        }
        if (obj.ruleType == 2 && obj.listingTemplateNum == '') {
            err = '刊登模板数量需必填'
            wishcheckAddrulesFocus('input', 'listingTemplateNum')
        }
        if (obj.ruleType == 2 && obj.listingStoreNum == '') {
            err = '刊登店铺数量需必填'
            wishcheckAddrulesFocus('input', 'listingStoreNum')
        }
        if(obj.executionWeekTime == ''||obj.executionWeekTime == undefined)
            err = '刊登日期不能为空';
        if(obj.siteCode == '')
            err = 'WISH站点不能为空';
        if(obj.ruleName == '')
            err = '规则名称不能为空';

        if(err){
            layer.alert(err, {icon: 2});
            return 0;
        }

        return 1;
    }


    function wishcheckAddrulesFocus(type, name) {
        $('#wishrules_form_addrules ' + type + '[name=' + name + ']').addClass('layui-form-danger').focus();
        setTimeout(function () {
            $('#wishrules_form_addrules ' + type + '[name=' + name + ']').removeClass('layui-form-danger')
        }, 1500);
    }

    function wishcheckAddrulesBorderRed(className) {
        $('#wishrules_form_addrules').find(`${className}`).css('border', '1px solid red');
        setTimeout(function () {
            $('#wishrules_form_addrules').find(`${className}`).css('border', '');
        }, 1500);
    }


    // 重载规则表
    function reloadAddrules(){
        table.reload('wishrules_table_addrules');
    }

    //批量移除店铺
    $(document).on('click', '#wishrules_storemanage_removebtn', function () {
        let ruleId = $('.wishrules_storemanage_id').val().trim()
        let popIndex = layer.open({
            title: '批量操作',
            type: 1, //不加该属性,就会出现[object Object]
            area: ['500px', '50%'],
            btn: ['保存', '关闭'],
            id: '_wish_layer_removestore',
            content: $('#wish_layer_removestore').html(),
            success: function () {
                form.render()
            },
            yes: function (index, layero) {
                let storeAcctNames = $('#wish_layer_removestore_form .allStoreName').val()
                let obj = {}
                obj.id = ruleId
                if (storeAcctNames == '') {
                    layer.msg('请输入店铺名', { icon: 2 })
                } else {
                    obj.storeAcctNames = storeAcctNames.replace(/\n/g, ",")
                    getDataWishRulesBatchRemoveStores(obj).then(function (data) {
                        layer.alert(data, { icon: 1 })
                        layer.close(popIndex)
                        reloadStoremanage()
                    }).catch(function (err) {
                        layer.msg(err, {
                            icon: 2
                        })
                    })
                }
            }
        })
    })

    // 编辑回显
    function wishRuleEdit(trdata, title){
        newpublishRenderSelect();
        let popIndex = layer.open({
            title: title,
            type: 1, //不加该属性,就会出现[object Object]
            area: ['1000px', '70%'],
            btn: ['保存', '关闭'],
            id:'wishrules_layer_addrulesId',
            content: $('#wishrules_layer_addrules').html(),
            success: function () {
                $.ajax({
                    type: "get",
                    url: ctx + "/wishAutoListingRuleController/rule/get/" + trdata.id,
                    success: function (returnData) {
                        if (returnData.code == "0000") {
                            let data = returnData.data;

                            $('#wishrules_form_addrules input[name="auditDays"]').val(data.auditDays);
                            // 商品类目
                            initWishCateTree().then(function (result) {
                                var prodCateIds = data.categoryIdList ? data.categoryIdList.split(",") : []
                                for (var i = 0; i < prodCateIds.length; i++) {
                                    var node = wishCateTree.getNodeByParam("value", prodCateIds[i])
                                    if (node != null) {
                                        wishCateTree.checkNode(node, true, false, true)
                                    }
                                }
                            })

                            $('#wishrules_form_addrules input[name="costMax"]').val(data.costMax);
                            $('#wishrules_form_addrules input[name="costMin"]').val(data.costMin);

                            let executionWeekTime = data.executionWeekTime.split(',');
                            executionWeekTime.forEach(function(item){
                                $("input[name='executionWeekTime']:checkbox[value="+ item +"]").attr('checked','true');
                            })

                            if(data.expectedStockOnway == "" || data.expectedStockOnway == undefined){  // 预计可用含在途大于
                                $('#wishrules_form_addrules select[name="wishrules_sel_expectedStock"]').val(1);
                                $('#wishrules_form_addrules input[name="expectedStockExway"]').val(data.expectedStockExway); // 不含显示
                                $("input[name='expectedStockOnway']").hide();
                                $("input[name='expectedStockExway']").show();

                            }else{
                                $('#wishrules_form_addrules select[name="wishrules_sel_expectedStock"]').val(0);
                                $('#wishrules_form_addrules input[name="expectedStockOnway"]').val(data.expectedStockOnway);
                                $("input[name='expectedStockOnway']").show();
                                $("input[name='expectedStockExway']").hide(); // 预计可用不含在途大于 输入框隐藏
                            }

                            $('#wishrules_form_addrules select[name="multiSub"]').val(data.multiSub==undefined?0:(data.multiSub+''));
                            $('#wishrules_form_addrules select[name="orderField"]').val(data.orderField);

                            $('#wishrules_form_addrules input[name="bizzOwnerIdList"]').val(data.bizzOwnerIdList);
                            $('#wishrules_form_addrules textarea[name="modelPSku"]').val(data.modelPSku); //模板SKU

                            let logisAttrList = data.logisAttrList.split(",");
                            formSelects.value("logisAttrList",logisAttrList);

                            let prodAttrList = data.prodAttrList.split(",");
                            formSelects.value("prodAttrList",prodAttrList);

                            $('#wishrules_form_addrules input[name="remark"]').val(data.remark);
                            $('#wishrules_form_addrules input[name="ruleName"]').val(data.ruleName);

                            $('#wishrules_form_addrules select[name="siteCode"]').val(data.siteCode);

                            $('#wishrules_form_addrules input[name="status"]:radio[value='+ data.status +']').attr('checked','true')
                            $('#wishrules_form_addrules input[name="weightMax"]').val(data.weightMax);
                            $('#wishrules_form_addrules input[name="weightMin"]').val(data.weightMin);
                            $('#wishrules_form_addrules select[name="warehouseId"]').val(data.warehouseId);  //仓库
                            $('#wishrules_form_addrules input[name="isProhibit"]').val(data.prohibit);
                            $('#wishrules_form_addrules input[name="isSale"]').val(data.sale);
                            $('#wishrules_form_addrules input[name="tortPlat"]').val(data.tortPlat);
                            $('#wishrules_form_addrules input[name="isListing"]').val(data.listing);
                            $('#wishrules_form_addrules input[name="creatorId"]').val(data.creatorId);
                            $('#wishrules_form_addrules input[name="createTime"]').val(data.createTime);
                            $('#wishrules_form_addrules input[name="creator"]').val(data.creator);
                            $('#wishrules_form_addrules input[name="thirtySalesStart"]').val(data.thirtySalesStart);
                            $('#wishrules_form_addrules input[name="thirtySalesEnd"]').val(data.thirtySalesEnd);
                            $('#wishrules_form_addrules input[name="listingMaxNum"]').val(data.listingMaxNum);

                            // 刊登规则  刊登模板数
                            $('#wishrules_form_addrules').find(`input[name=ruleType]:radio[value=${data.ruleType}]`).attr("checked", true)
                            if (data.ruleType == 2) {
                                $('#wishrules_form_addrules').find('input[name=listingTemplateNum]').val(data.listingTemplateNum)
                                $('#wishrules_form_addrules').find('input[name=listingStoreNum]').val(data.listingStoreNum)
                            } else {
                                $('#wishrules_listingNum').hide()
                            }
                            form.render();
                        }else{
                            layer.alert(returnData.msg, {icon: 2});
                        }
                    }
                })
            },
            yes: function (index, layero) {
                // 类目树
                let chkedNodeId = wishCateTree.getCheckedNodes(true)
                let autoPublishCateIds = chkedNodeId
                    .map(function (item) {
                        return item.value
                    })
                    .join()

                var flag = checkAddrulesData();
                if(flag == 0) return;

                let obj = serializeObject($('#wishrules_form_addrules'));
                obj.logisAttrList =formSelects.value('logisAttrList', 'val').join(",").trim();
                obj.prodAttrList =formSelects.value('prodAttrList', 'val').join(",").trim();
                obj.categoryIdList = autoPublishCateIds //商品类目
                obj.multiSub == "0"?obj.multiSub = null:'';

                // 模板SKU
                if(obj.modelPSku){
                    obj.modelPSku  = obj.modelPSku .replaceAll('，',',').split(',').filter(item=>!!item).join()
                }

                delete obj.undefined
                if(title == '编辑规则'){
                    obj.id = trdata.id;

                    obj.expectedStockOnway == ''?obj.expectedStockOnway = -9999:obj.expectedStockOnway = obj.expectedStockOnway *1;
                    obj.expectedStockExway == ''?obj.expectedStockExway = -9999:obj.expectedStockExway = obj.expectedStockExway *1;

                    // obj.isComplete = trdata.isComplete;
                    obj.isProhibit = $('#wishrules_form_addrules input[name="isProhibit"]').val();
                    obj.isSale = $('#wishrules_form_addrules input[name="isSale"]').val();
                    obj.tortPlat = $('#wishrules_form_addrules input[name="tortPlat"]').val();
                    obj.isListing = $('#wishrules_form_addrules input[name="isListing"]').val();
                    // obj.isGenerate = trdata.isGenerate;
                    obj.createTime = $('#wishrules_form_addrules input[name="createTime"]').val();
                    obj.creator = $('#wishrules_form_addrules input[name="creator"]').val();
                    // obj.creator = trdata.creator;
                    obj.creatorId = $('#wishrules_form_addrules input[name="creatorId"]').val();

                    commonReturnPromise({
                        url: `/lms/wishAutoListingRuleController/rule/editInfo`,
                        type: 'POST',
                        contentType: 'application/json',
                        params:JSON.stringify(obj)
                    }).then(function(result){
                        layer.msg(result, {icon: 1});
                        reloadAddrules()
                        layer.close(popIndex);
                    }).catch(function(err){
                        layer.msg(err, {icon:2});
                    })
                }else{
                    obj.isComplete = '';
                    obj.isProhibit = '';
                    obj.isSale = '';
                    obj.tortPlat = '';
                    obj.isListing = '';
                    obj.isGenerate = '';
                    obj.createTime = '';

                    commonReturnPromise({
                        url: `/lms/wishAutoListingRuleController/rule/addRule`,
                        type: 'post',
                        contentType: 'application/json',
                        params:JSON.stringify(obj)
                    }).then(function(result){
                        layer.msg("添加规则成功", {icon: 1});
                        reloadAddrules()
                        layer.close(popIndex);
                    }).catch(function(err){
                        layer.msg(err, {icon:2});
                    })
                }
            }
        })
    }

    // 规则表格操作监听
    table.on('tool(wishrules_table_addrules)', function (obj) {
        var layEvent = obj.event; //获得 lay-event 对应的值
        var trdata = obj.data; //获得当前行数据
        if (layEvent === 'remark') {
            wishRuleEdit(trdata, '编辑规则')
        } else if (layEvent === 'delete') {
            let popIndex = layer.confirm("确定要删除此条规则吗？", function () {
                commonReturnPromise({
                    url: `/lms/wishAutoListingRuleController/rule/delete/` + trdata.id,
                    type: 'delete'
                }).then(function(result){
                    layer.msg(result, {icon: 1});
                    reloadAddrules()
                    layer.close(popIndex);
                }).catch(function(err){
                    layer.msg(err, {icon:2});
                })
            })
        }else if(layEvent === 'wishrules_tabletemplet_count'){
            // 应用店铺数量弹框
            let ruleId = trdata.id,rulename = trdata.ruleName;
            let popIndex = layer.open({
                title: '设置店铺',
                type: 1, //不加该属性,就会出现[object Object]
                area: ['1000px', '70%'],
                content: $('#wishrules_layer_storemanage').html(),
                id:'wishrules_layer_storemanageId',
                success: function () {
                    $(".storemanage_name").text(rulename);
                    $(".wishrules_storemanage_id").val(ruleId)
                    handleStoremanageTable(ruleId);
                    form.render();
                }
            })
        } else if (layEvent === 'copy') {
            wishRuleEdit(trdata, '复制新增规则')
        }else if (layEvent === 'log') {
            //渲染日志
            commonReturnPromise({
                type: 'GET',
                url: `/lms/amazonAutoListingRule/logs?ruleId=${trdata.id}&platCode=wish`,
            }).then(result => {
                publishRulesLogLayer(result,trdata.ruleName)
            }).catch(err => {
                layer.msg(err, {icon: 2});
            });
        }
    })

    // 添加规则弹框
    $("#wishrules_btn_addrules").click(function () {
        newpublishRenderSelect();
        let popIndex = layer.open({
            title: '添加规则',
            type: 1, //不加该属性,就会出现[object Object]
            area: ['1000px', '70%'],
            btn: ['保存', '关闭'],
            id:'wishrules_layer_addrulesId',
            content: $('#wishrules_layer_addrules').html(),
            success: function () {
                form.render();
                $('input[name="expectedStockExway"]').hide(); // 预计可用不含在途大于 输入框隐藏
                // 商品类目
                initWishCateTree().then(function (result) {
                    var prodCateIds = []
                    for (var i = 0; i < prodCateIds.length; i++) {
                      var node = wishCateTree.getNodeByParam("value", prodCateIds[i])
                      if (node != null) {
                        wishCateTree.checkNode(node, true, false, true)
                      }
                    }
                  })
            },
            yes: function (index, layero) {
                let chkedNodeId = wishCateTree.getCheckedNodes(true)
                let autoPublishCateIds = chkedNodeId
                    .map(function (item) {
                        return item.value
                    })
                    .join()

                var flag = checkAddrulesData();
                if(flag == 0) return;

                let obj = serializeObject($('#wishrules_form_addrules'));
                obj.logisAttrList =formSelects.value('logisAttrList', 'val').join(",").trim();
                obj.prodAttrList =formSelects.value('prodAttrList', 'val').join(",").trim();
                obj.categoryIdList = autoPublishCateIds
                obj.multiSub == "0"?obj.multiSub = null:'';

                // 模板SKU
                if(obj.modelPSku){
                    obj.modelPSku  = obj.modelPSku .replaceAll('，',',').split(',').filter(item=>!!item).join()
                }

                obj.isComplete = '';
                obj.isProhibit = '';
                obj.isSale = '';
                obj.tortPlat = '';
                obj.isListing = '';
                obj.isGenerate = '';
                obj.createTime = '';

                delete obj.undefined
                commonReturnPromise({
                    url: `/lms/wishAutoListingRuleController/rule/addRule`,
                    type: 'post',
                    contentType: 'application/json',
                    params:JSON.stringify(obj)
                }).then(function(result){
                    layer.msg("添加规则成功", {icon: 1});
                    reloadAddrules()
                    layer.close(popIndex);
                }).catch(function(err){
                    layer.msg(err, {icon:2});
                })
            }
        })
    })

    //店铺表
    function handleStoremanageTable(ruleId) {
        table.render({
            elem: "#wishrules_table_storemanage",
            method: 'get',
            url: ctx + "/wishAutoListingRuleStoreController/store/list/" + ruleId,  // 店铺列表接口
            cols: [
                [
                    {field: "storeAcct", title: "店铺名"},
                    {field: "stock", title: "在线库存"},
                    {field: "dailyPublishNums", title: '刊登量'},
                    {field: "publishTime", title: '上架开始时间', templet: function (res) {
                            return "中国时间："+res.publishTime+":00"
                        }},
                    {field: "publishInterval", title: '上架间隔时间', templet: function (res) {
                            return res.publishInterval+"分钟"
                        }},
                    {field: "creator", title: '创建人'},
                    {field: "modifier", title: '修改人'},
                    {title: '操作', align: 'center', toolbar: '#wishrules_tabletemplet_optionbtn'}
                ],
            ],
            id: "wishrules_table_storemanage",
            page: true,
            limits: [50, 100, 150],
            limit: 50,
        });
    }

    function reloadStoremanage(){
        table.reload('wishrules_table_storemanage');
        reloadAddrules();
    }

    // 验证店铺信息
    function checkStoremanageData(){
        let obj = serializeObject($('#wishrules_storeadd'))
        let err = '';

        if(obj.storeNameStr == ''){
            err = '店铺名不能为空';
        }
        if(obj.stock == ''){
            err = '在线库存不能为空';
        }
        if(obj.dailyPublishNums == ''){
            err = '每天刊登量不能为空';
        }
        if(obj.publishTime == ''){
            err = '上架开始时间不能为空';
        }

        if(err){
            layer.alert(err, {icon: 2});
            return 0;
        }

        return 1;
    }

    // 店铺表格操作监听
    table.on('tool(wishrules_table_storemanage)', function (obj) {
        var layEvent = obj.event; //获得 lay-event 对应的值
        var trdata = obj.data; //获得当前行数据
        if (layEvent === 'remark') {//编辑店铺
            let popIndex = layer.open({
                title: '编辑店铺',
                type: 1, //不加该属性,就会出现[object Object]
                area: ['500px', '70%'],
                btn: ['保存', '关闭'],
                id:'wishrules_layer_storeadId',
                content: $('#wishrules_layer_storeadd').html(),
                success: function () {
                    commonReturnPromise({
                        url: `/lms/wishAutoListingRuleStoreController/store/get/` + trdata.id,// 店铺详情接口
                        type: 'get'
                    }).then(function(result){
                        let data = result;
                        data.allowAttract == true?$("input[name='allowAttract']:checkbox").attr('checked','true'):'';
                        $('input[name="dailyPublishNums"]').val(data.dailyPublishNums);
                        $('select[name="publishInterval"]').val(data.publishInterval);
                        $('select[name="publishTime"]').val(data.publishTime);
                        $('input[name="stock"]').val(data.stock);
                        $('input[name="storeNameStr"]').val(data.storeAcct);
                        $('input[name="storeNameStr"]').attr("disabled","true");

                        form.render();
                    }).catch(function(err){
                        layer.msg(err, {icon:2});
                    })
                },
                yes: function (index, layero) {
                    var flag = checkStoremanageData();
                    if(flag == 0) return;

                    let obj = serializeObject($('#wishrules_storeadd'));
                    obj.allowAttract = $.trim($('input[name="allowAttract"]').prop('checked'));
                    obj.id = trdata.id;
                    commonReturnPromise({
                        url: `/lms/wishAutoListingRuleStoreController/store/editInfo`,// 修改店铺信息接口
                        type: 'put',
                        contentType: 'application/json',
                        params:JSON.stringify(obj)
                    }).then(function(result){
                        layer.msg(result, {icon: 1});
                        reloadStoremanage();
                        layer.close(popIndex);
                    }).catch(function(err){
                        layer.msg(err, {icon:2});
                    })
                }
            })
        } else if (layEvent === 'delete') {
            let popIndex = layer.confirm("确定要删除此店铺吗？", function () {
                commonReturnPromise({
                    url: `/lms/wishAutoListingRuleStoreController/store/delete/` + trdata.id, // 修改店铺信息
                    type: 'delete'
                }).then(function(result){
                    layer.msg(result, {icon: 1});
                    reloadStoremanage();
                    layer.close(popIndex);
                }).catch(function(err){
                    layer.msg(err, {icon:2});
                })
            })
        }
    })

    //添加店铺
    $(document).on("click", "#wishrules_storemanage_storeaddbtn", function () {
        let ruleId = $(this).next().val().trim();
        let popIndex = layer.open({
            title: '添加店铺',
            type: 1, //不加该属性,就会出现[object Object]
            area: ['500px', '70%'],
            btn: ['保存', '关闭'],
            id:'wishrules_layer_storeadId',
            content: $('#wishrules_layer_storeadd').html(),
            success: function () {
                form.render();
            },
            yes: function (index, layero) {
                var flag = checkStoremanageData();
                if(flag == 0) return;

                let obj = serializeObject($('#wishrules_storeadd'));
                obj.allowAttract = $.trim($('input[name="allowAttract"]').prop('checked'));
                obj.ruleId = ruleId;

                obj.storeNameStr = obj.storeNameStr.replace('，',',');
                commonReturnPromise({
                    url: `/lms/wishAutoListingRuleStoreController/store/setStoreForRule`, // 设置店铺接口
                    type: 'post',
                    contentType: 'application/json',
                    params:JSON.stringify(obj)
                }).then(function(result){
                    layer.msg(result, {icon: 1});
                    reloadStoremanage();
                    layer.close(popIndex);
                }).catch(function(err){
                    layer.msg(err, {icon:2});
                })
            }
        })
    })

    // 添加规则--预计可用在途
    form.on('select(wishrules_sel_expectedStock)', function (data) {
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
    form.on('switch(wishrules_orderDownloadStatus)', function (data) {
        let id = data.value,status = data.elem.checked==true?1:0;
        let checked = data.elem.checked;
        let popIndex = layer.confirm("确定要修改此规则状态吗？", function () {
            commonReturnPromise({
                url: `/lms/wishAutoListingRuleController/rule/updateStatus/` + id, // 修改店铺信息
                type: 'put',
                params:{status:status}
            }).then(function(result){
                $("#wishrules_searchBtn").click();
                layer.msg(result, {icon: 1});
                layer.close(popIndex);
            }).catch(function(err){
                layer.msg(err, {icon:2});
            })
        },function(){
            data.elem.checked = !checked;
            form.render();
        });
    });

    //初始化wish商品类目
function initWishCateAjax() {
    return commonReturnPromise({
      url: ctx + "/prodcate/listCategoryTree",
    })
  }
    // 店铺-批量移除店铺
    function getDataWishRulesBatchRemoveStores (obj) {
        return commonReturnPromise({
            url: ctx + `/wishAutoListingRuleController/batchDeleteAutoListingRuleStoreByStoreAcctName`,
            type: 'delete',
            contentType: 'application/json',
            params: JSON.stringify(obj)
        })
    }
  
  function initWishCateTree() {
    //左侧类目tree
    return new Promise(function (resolve) {
      initWishCateAjax()
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
                      wishCateTree.setChkDisabled(
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
                  var childrenIds = getWishChildren([], treeNode)
                  for (var i = 0; i < childrenIds.length; i++) {
                    var node = wishCateTree.getNodeByParam("value", childrenIds[i])
                    wishCateTree.checkNode(node, treeNode.checked, false, true)
                  }
                }
              },
            },
          }
          setting.check.chkboxType = {
            Y: "s",
            N: "s",
          }
          wishCateData = result
          var t = $("#wishrulesCateTree")
          t = $.fn.zTree.init(t, setting, wishCateData)
          wishCateTree = $.fn.zTree.getZTreeObj("wishrulesCateTree")
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
  function getWishChildren(values, treeNode) {
    values.push(treeNode.value)
    if (treeNode.isParent) {
      for (var obj in treeNode.data) {
        getWishChildren(values, treeNode.data[obj])
      }
    }
    return values
  }
});