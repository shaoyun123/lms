layui.use(['admin', 'form', 'layer', 'formSelects', 'element', 'table', 'laypage', 'laydate', 'upload'], function () {
    var admin = layui.admin,
        form = layui.form,
        table = layui.table,
        layer = layui.layer,
        formSelects = layui.formSelects,
        laydate = layui.laydate,
        laypage = layui.laypage,
        upload = layui.upload,
        $ = layui.$;

    form.render();
    formSelects.render();

    //创建人枚举数据
    commonReturnPromise({
        url: `/lms/lazadaAutoListingRule/getLazadaRuleCreates`,
        type: 'GET',
    }).then(function(result){
        commonRenderSelect("creatorIds", result, {
            name: 'userName',
            code: 'id'
        }).then(()=> form.render())
    }).catch(function(err){
        layer.msg(err, {icon:2});
    })

    //初始化lazada店铺
    commonReturnPromise({
        url: `/lms/sys/listStoreForRenderHpStoreCommonComponent.html`,
        type: 'POST',
        params:{roleNames: "lazada专员",platCode: 'lazada'}
    }).then(function(result){
        commonRenderSelect("storeAcctIds", result, {
            name: 'storeAcct',
            code: 'id'
        }).then(()=> formSelects.render('storeAcctIds'))
    }).catch(function(err){
        layer.msg(err, {icon:2});
    })

    // 初始化lazada站点
    function getDatalazadarulesInitLazadaSite() {
        return commonReturnPromise({
            type: 'get',
            url: ctx + "/enum/getSiteEnum.html?platCode=lazada",
            contentType: 'application/json'
        })
    }

    // 编辑规则数据回显
    // ruleId：number [规则id]
    function getDatalazadarulesRuleById(ruleId) {
        return commonReturnPromise({
            url: "/lms/lazadaAutoListingRule/getLazadaAutoListingRuleById/" + ruleId
        })
    }

    // 编辑规则保存接口
    // obj:object [需要保存的数据信息]
    function getDatalazadarulesUpdateRule(obj) {
        return commonReturnPromise({
            url: `/lms/lazadaAutoListingRule/updateLazadaAutoListingRule.html`,
            type: 'put',
            contentType: 'application/json',
            params: JSON.stringify(obj)
        })
    }

    // 添加规则保存接口
    // obj:object [需要保存的数据信息]
    function getDatalazadarulesInsertRule(obj) {
        return commonReturnPromise({
            url: `/lms/lazadaAutoListingRule/insertLazadaAutoListingRule.html`,
            type: 'POST',
            contentType: 'application/json',
            params: JSON.stringify(obj)
        })
    }

    // 删除规则接口
    // ruleId：number [规则id]
    function getDatalazadarulesDeleteRule(ruleId) {
        return commonReturnPromise({
            url: `/lms/lazadaAutoListingRule/deleteLazadaAutoListingRuleById/` + ruleId,
            type: 'delete',
        })
    }

    // 添加店铺保存接口
    // obj:object [需要保存的数据信息]
    function getDatalazadarulesInsertStore(obj) {
        return commonReturnPromise({
            url: "/lms/lazadaAutoListingRuleStore/insertLazadaAutoListingRuleStore.html",
            type: 'post',
            contentType: 'application/json',
            params: JSON.stringify(obj)
        })
    }

    // 编辑店铺回显数据
    // ruleId：number [店铺id]
    function getDatalazadarulesGetStore(ruleId) {
        return commonReturnPromise({
            url: "/lms/lazadaAutoListingRuleStore/getLazadaAutoListingRuleStoreById/" + ruleId
        })
    }

    // 编辑店铺保存接口
    // obj:object [需要保存的数据信息]
    function getDatalazadarulesUpdateStore(obj) {
        return commonReturnPromise({
            url: `/lms/lazadaAutoListingRuleStore/updateLazadaAutoListingRuleStore.html`,
            type: 'put',
            contentType: 'application/json',
            params: JSON.stringify(obj)
        })
    }

    // 删除店铺接口
    //
    // ruleId：number [店铺id]
    function getDatalazadarulesDeleteStore(ruleId, obj) {
        return commonReturnPromise({
            url: `/lms/lazadaAutoListingRuleStore/deleteLazadaAutoListingRuleStoreById/` + ruleId,
            type: 'delete',
            contentType: 'application/json',
            params: JSON.stringify(obj)
        })
    }

    // 批量移除店铺接口
    function getDatalazadarulesRelatedStoreByStoreAcctName(obj) {
        return commonReturnPromise({
            url: "/lms/lazadaAutoListingRule/batchDeleteLazadaAutoListingRuleRelatedStoreByStoreAcctName",
            type: 'delete',
            contentType: 'application/json',
            params: JSON.stringify(obj)
        })
    }

    // 更新规则状态接口
    function getDatalazadarulesUpdateStatus(ruleId, status) {
        return commonReturnPromise({
            url: `/lms/lazadaAutoListingRule/updateLazadaAutoListingRuleForPartAttributes.html`,
            type: 'put',
            contentType: 'application/json',
            params: JSON.stringify({
                id: ruleId,
                status: status
            })
        })
    }

    function newpublishRenderSelect() {
        return commonReturnPromise({
            url: '/lms/fyndiq/new/listing/manage.html'
        })
    }

    // 搜索
    $("#lazadarules_searchBtn").on("click", function () {
        lazadarulesTableRender()
    });

    function lazadarulesTableRender() {
        var whereData = serializeObject($('#lazadarules_searchForm')); // 获取form表单数据
        // 规则id，限制1000个
        if(whereData.ruleIdList.split(',').length > 1000){
            return layer.msg('规则id超过1000个，请重新填写', {icon: 7})
        }
        layui.admin.load.show();
        // 规则表
        var tableIns = table.render({
            elem: "#lazadarules_table_addrules",
            method: 'post',
            url: ctx + "/lazadaAutoListingRule/searchLazadaAutoListingRuleList.html",
            where: whereData,
            cols: [
                [{ checkbox: true, width: 30 },{
                    field: "status",
                    title: "状态",
                    templet: '#lazadarules_tabletemplet_type'
                },{
                    field: "id",
                    title: "规则id"
                },
                {
                    field: "ruleName",
                    title: "规则名称"
                },
                {
                    field: "saleSiteCn",
                    title: "站点"
                },
                {
                    field: "storeNums",
                    title: '应用店铺数量',
                    templet: '#lazadarules_tabletemplet_count'
                },
                {
                    field: "executionWeekTime",
                    title: '执行日期（每周）'
                },
                {
                    field: "remark",
                    title: '备注'
                },
                {
                    field: "creator",
                    title: '创建人'
                },
                {
                    field: "modifier",
                    title: '修改人'
                },
                {
                    title: '操作',
                    align: 'center',
                    width: 200,
                    toolbar: '#lazadarules_tabletemplet_optionbtn'
                }
                ],
            ],
            id: "lazadarules_table_addrules",
            page: true,
            limits: [50, 100, 150],
            limit: 50
        });
    }

    // 验证规则信息
    function checkAddrulesData(elem) {
        let obj = serializeObject(elem),
            err = '';

        if (obj.costMax != '' && obj.costMin != '' && parseFloat(obj.costMax) < parseFloat(obj.costMin)) {
            checkAddrulesFocus('input', 'costMax')
            err = '成本(RMB)数据不合法';
        }else if (obj.weightMax != '' && obj.weightMin != '' && parseFloat(obj.weightMax) < parseFloat(obj.weightMin)) {
            checkAddrulesFocus('input', 'weightMax')
            err = '重量(克)数据不合法';
        }else if (obj.listingMax != '' && obj.listingMin != '' && parseFloat(obj.listingMax) < parseFloat(obj.listingMin)) {
            checkAddrulesFocus('input', 'listingMax')
            err = '刊登量数据不合法';
        }else if (obj.moduleType == '') {
            checkAddrulesFocus('input', 'moduleType')
            err = 'lazada模板类型不能为空';
        }else if (obj.executionWeekTime == '' || obj.executionWeekTime == undefined) {
            checkAddrulesBorderRed('.lazadarules_executionWeekTime_checkbox')
            err = '刊登日期不能为空';
        }else if (obj.saleSite == '') {
            checkAddrulesFocus('select', 'saleSite')
            err = 'Lazada站点不能为空';
        }else if (obj.ruleName == '') {
            checkAddrulesFocus('input', 'ruleName')
            err = '规则名称不能为空';
        }else if (obj.ruleType == '' || obj.ruleType == undefined) {
            checkAddrulesBorderRed('.lazadarules_ruleType_radio')
            err = '请选择刊登规则'
        }else if (obj.ruleType == 2 && obj.listingTemplateNum == '') {
            err = '刊登模板数量需必填'
            checkAddrulesFocus('input', 'listingTemplateNum')
        }else if (obj.ruleType == 2 && obj.listingStoreNum == '') {
            err = '刊登店铺数量需必填'
            checkAddrulesFocus('input', 'listingStoreNum')
        }
        if (err) {
            layer.alert(err, {icon: 2});
            return 0;
        }

        return 1;
    }

    function checkAddrulesFocus(type, name) {
        $('#lazadarules_form_addrules ' + type + '[name=' + name + ']').addClass('layui-form-danger').focus();
        setTimeout(function () {
            $('#lazadarules_form_addrules ' + type + '[name=' + name + ']').removeClass('layui-form-danger')
        }, 1500);
    }

    function checkAddrulesBorderRed(className) {
        $('#lazadarules_form_addrules').find(`${className}`).css('border', '1px solid red');
        setTimeout(function () {
            $('#lazadarules_form_addrules').find(`${className}`).css('border', '');
        }, 1500);
    }




    // 重载规则表
    function reloadAddrules() {
        table.reload('lazadarules_table_addrules', {
            page: {
                curr: 1
            }
        });
    }

    // 全部类目：0 &指定类目： 1
    form.on('radio(lazadaCateTreeAllChecked)', function (data) {

        if (data.value == 0) {
            $("#lazadarules_form_addrules .lazadaCateTreeIsShow").hide()
        } else {
            $("#lazadarules_form_addrules .lazadaCateTreeIsShow").show()
        }
    });

    // 规则表格操作监听
    table.on('tool(lazadarules_table_addrules)', function (obj) {
        var layEvent = obj.event;
        var trdata = obj.data;
        // let xtree;
        if (layEvent === 'edit'||layEvent === 'copy') {
            let defaultObj = {};  // 默认规则
            let popIndex = layer.open({
                title: layEvent === 'edit'?'编辑规则':"复制规则",
                type: 1, //不加该属性,就会出现[object Object]
                area: ['1000px', '70%'],
                btn: ['保存', '关闭'],
                id: 'lazadarules_layer_addrulesId',
                content: $('#lazadarules_layer_addrules').html(),
                success: function (layero, index) {
                    Promise.all([getDatalazadarulesInitLazadaSite(), newpublishRenderSelect(), getDatalazadarulesRuleById(trdata.id)]).then(function (results) {
                        let lazadaSiteList = results[0],
                            prodTagMap = results[1].prodTagMap,
                            logisAttrEnums = results[1].logisAttrEnums,
                            devTypeEnums = results[1].devTypeEnums;

                        // 站点
                        commonRenderSelect("saleSite", lazadaSiteList, {
                            name: 'name',
                            code: 'code'
                        })

                        let lazadaRulesSaleSite = ``
                        lazadaSiteList.forEach(item => {
                            if (item.code != "ID")
                                lazadaRulesSaleSite += `<input type="checkbox" name="globalSaleSite" lay-skin="primary" value="${item.code}" title="${item.name}">`
                        })
                        $("#lazadaRulesSaleSite").html(lazadaRulesSaleSite)

                        // 开发类型，商品标签和物流属性
                        // 开发类型devTypeEnums[数组]
                        commonRenderSelect("devType", devTypeEnums)
                        // 商品标签prodTagMap
                        commonRenderSelect("prodAttrList", prodTagMap, {
                            name: 'name',
                            code: 'name'
                        })
                        //
                        commonRenderSelect("unProdAttrList", prodTagMap, {
                            name: 'name',
                            code: 'name'
                        })
                        //物流属性logisAttrEnums[数组]
                        commonRenderSelect("logisAttrList", logisAttrEnums)

                        form.render()
                        formSelects.render()

                        return results[2]
                    }).then((data) => {
                        defaultObj.id = data.id;
                        defaultObj.isProhibit = data.isProhibit
                        defaultObj.isSale = data.isSale
                        defaultObj.tortPlat = data.tortPlat
                        defaultObj.categoryProhibited = data.categoryProhibited
                        defaultObj.isGenerate = data.isGenerate
                        defaultObj.isListing = data.isListing
                        defaultObj.creatorId = data.creatorId
                        defaultObj.creator = data.creator

                        // 站点，开发类型，物流属性赋值
                        $("#lazadarules_form_addrules select[name=saleSite]").val(data.saleSite)

                        let devType = data.devType.split(",");
                        formSelects.value("devType", devType);
                        let prodAttrList = data.prodAttrList.split(",");
                        formSelects.value("prodAttrList", prodAttrList);
                        let unProdAttrList = data.unProdAttrList?data.unProdAttrList.split(","):'';
                        formSelects.value("unProdAttrList", unProdAttrList);
                        let logisAttrList = data.logisAttrList.split(",");
                        formSelects.value("logisAttrList", logisAttrList);

                        // 商品类目
                        initLazadaCateTree(data.saleSite).then(function (result) {
                            var prodCateIds = data.categoryIdList.split(",");
                            for (var i = 0; i < prodCateIds.length; i++) {
                                var node = lazadaCateTree.getNodeByParam("id", prodCateIds[i]);
                                if (node != null) {
                                    lazadaCateTree.checkNode(node, true, false, true);
                                }
                            }
                        });

                        $('#lazadarules_form_addrules input[name="ruleName"]').val(data.ruleName);
                        $('#lazadarules_form_addrules select[name="saleSite"]').val(data.saleSite);
                        // 全部类目&指定类目
                        if (data.categoryIdList == 0) {
                            $('#lazadarules_form_addrules input[name="lazadarulesCateTreeRadioChecked"][value="0"]').attr("checked", true);
                            ;
                            $("#lazadarules_form_addrules .lazadaCateTreeIsShow").hide()
                        }

                        let executionWeekTime = data.executionWeekTime.split(',');
                        executionWeekTime.forEach(function (item) {
                            $("#lazadarules_form_addrules input[name='executionWeekTime']:checkbox[value=" + item + "]").attr('checked', 'true');
                        })

                        $('#lazadarules_form_addrules input[name="bizzOwnerList"]').val(data.bizzOwnerList);
                        $('#lazadarules_form_addrules textarea[name="modelPSku"]').val(data.modelPSku);
                        $('#lazadarules_form_addrules select[name="moduleType"]').val(data.moduleType);
                        $('#lazadarules_form_addrules input[name="createDays"]').val(data.createDays);
                        $('#lazadarules_form_addrules input[name="costMax"]').val(data.costMax);
                        $('#lazadarules_form_addrules input[name="costMin"]').val(data.costMin);
                        $('#lazadarules_form_addrules input[name="weightMin"]').val(data.weightMin);
                        $('#lazadarules_form_addrules input[name="listingMax"]').val(data.listingMax);
                        $('#lazadarules_form_addrules input[name="weightMax"]').val(data.weightMax);
                        $('#lazadarules_form_addrules input[name="listingMin"]').val(data.listingMin);
                        $('#lazadarules_form_addrules select[name="preAvailableStockType"]').val(data.preAvailableStockType);
                        $('#lazadarules_form_addrules input[name="preAvailableStockNum"]').val(data.preAvailableStockNum);
                        $('#lazadarules_form_addrules input[name="thirtySalesStart"]').val(data.thirtySalesStart);
                        $('#lazadarules_form_addrules input[name="thirtySalesEnd"]').val(data.thirtySalesEnd);
                        $('#lazadarules_form_addrules input[name="listingMaxNum"]').val(data.listingMaxNum);
                        $('#lazadarules_form_addrules select[name="orderField"]').val(data.orderField);
                        $('#lazadarules_form_addrules input[name="remark"]').val(data.remark);
                        $('#lazadarules_form_addrules input[name="status"]:radio[value=' + data.status + ']').attr('checked', 'true')
                        $('#lazadarules_form_addrules select[name="globalListing"]').val(data.globalListing.toString());
                        // 如果当前站点不是 全球刊登，修改当前站点为可选
                        if (!data.globalListing) {
                            $("#lazadarules_form_addrules select[name=saleSite]").attr("disabled", false)
                        } else {
                            $("#lazadarules_form_addrules select[name=saleSite]").attr("disabled", true)
                            $("#lazadarules_form_addrules select[name=globalListing]").attr("disabled", true)
                            let globalSaleSite = data.globalSaleSite;
                            if (globalSaleSite && globalSaleSite != '') {
                                globalSaleSite.split(",").forEach(function (item) {
                                    $("#lazadaRulesSaleSite input[name='globalSaleSite']:checkbox[value=" + item + "]").attr('checked', 'true');
                                })
                            } else {
                                // 因为字段为后加字段;如果没有返回则默认给全选中
                                $("#lazadaRulesSaleSite input[name='globalSaleSite']").each(function () {
                                    $(this).attr('checked', true);
                                });
                            }
                            $(".lazadaRulesSaleSiteHide").show();
                        }
                        // 刊登规则  刊登模板数
                        $('#lazadarules_form_addrules').find(`input[name=ruleType]:radio[value=${data.ruleType}]`).attr("checked", true)
                        if (data.ruleType == 2) {
                            $('#lazadarules_form_addrules').find('input[name=listingTemplateNum]').val(data.listingTemplateNum)
                            $('#lazadarules_form_addrules').find('input[name=listingStoreNum]').val(data.listingStoreNum)
                        } else {
                            $('#lazadarules_listingNum').hide()
                        }
                        form.render();
                    }).catch(function (err) {
                        layer.msg(err, {
                            icon: 2
                        });
                    })
                },
                yes: function (index, layero) {
                    let flag = checkAddrulesData($('#lazadarules_form_addrules'));
                    if (flag == 0) return;

                    let chkedNodeId = lazadaCateTree.getCheckedNodes(true);
                    let autoPublishCateIds = chkedNodeId.map(function (item) {
                        return item.id;
                    }).join();

                    let obj = serializeObject($('#lazadarules_form_addrules'))
                    obj.saleSite = $('#lazadarules_form_addrules select[name="saleSite"]').val();
                    obj.globalListing = $('#lazadarules_form_addrules select[name="globalListing"]').val();

                    // 模板SKU
                    if(obj.modelPSku){
                        obj.modelPSku  = obj.modelPSku .replaceAll('，',',').split(',').filter(item=>!!item).join()
                    }

                    let lazadaCateTreeRadioChecked = $("input[name=lazadarulesCateTreeRadioChecked]:checked").val();
                    if (autoPublishCateIds == '' && lazadaCateTreeRadioChecked == 1) {
                        layer.alert("类目id不能为空", {
                            icon: 2
                        });
                        return false
                    } else if (lazadaCateTreeRadioChecked == 0) {
                        obj.categoryIdList = 0;
                    } else {
                        obj.categoryIdList = autoPublishCateIds;
                    }

                    if(layEvent === 'edit'){
                        // 获取默认规则参数
                        for (key in defaultObj) {
                            obj[key] = defaultObj[key]
                        }

                        getDatalazadarulesUpdateRule(obj).then(function (result) {
                            layer.msg("保存成功", { icon: 1 });
                            reloadAddrules()
                            layer.close(popIndex);
                        }).catch(function (err) {
                            layer.msg(err, { icon: 2 });
                        })
                    }else if(layEvent === 'copy'){
                        // 新增规则保存接口
                        getDatalazadarulesInsertRule(obj).then(function (result) {
                            layer.msg(result, { icon: 1 });
                            layer.close(popIndex);
                            reloadAddrules()
                        }).catch(function (err) {
                            layer.msg(err, { icon: 2 });
                        })
                    }
                }
            })
        } else if (layEvent === 'delete') {
            let popIndex = layer.confirm("确定要删除此条规则吗？", function () {
                getDatalazadarulesDeleteRule(trdata.id).then(function (result) {
                    layer.msg("删除成功", { icon: 1 });
                    reloadAddrules()
                    layer.close(popIndex);
                }).catch(function (err) {
                    layer.msg(err, { icon: 2 });
                })
            })
        } else if (layEvent === 'lazadarules_tabletemplet_count') {
            // 应用店铺数量弹框
            let ruleId = trdata.id,
                rulename = trdata.ruleName;
            let popIndex = layer.open({
                title: '设置店铺',
                type: 1, //不加该属性,就会出现[object Object]
                area: ['1200px', '70%'],
                content: $('#lazadarules_layer_storemanage').html(),
                id: 'lazadarules_layer_storemanageId',
                success: function () {
                    $(".storemanage_name").text(rulename);
                    $(".storemanage_id").val(ruleId)
                    handleStoremanageTable(ruleId);
                    form.render();
                }
            })
        } else if (layEvent === 'log'){ // 日志
            //渲染日志
            commonReturnPromise({
                type: 'GET',
                url: '/lms/lazadaAutoListingRule/getRuleModifyLogs?ruleId=' + trdata.id,
            }).then(result => {
                publishRulesLogLayer(result,trdata.ruleName)
            }).catch(err => {
                layer.msg(err, {icon: 2});
            });
        }
    })

    // 添加规则弹框
    $("#lazadarules_btn_addrules").click(function () {
        let popIndex = layer.open({
            title: '添加规则',
            type: 1, //不加该属性,就会出现[object Object]
            area: ['1000px', '70%'],
            btn: ['保存', '关闭'],
            id: 'lazadarules_layer_addrulesId',
            content: $('#lazadarules_layer_addrules').html(),
            success: function (layero, index) {
                $("#lazadarules_form_addrules input[name='executionWeekTime']").attr('checked', 'true');
                // 渲染开发类型,商品标签和物流属性,商品归属人
                Promise.all([getDatalazadarulesInitLazadaSite(), newpublishRenderSelect()]).then(function (results) {
                    let lazadaSiteList = results[0],
                        prodTagMap = results[1].prodTagMap,
                        logisAttrEnums = results[1].logisAttrEnums,
                        devTypeEnums = results[1].devTypeEnums;

                    // 站点 -- start
                    commonRenderSelect("saleSite", lazadaSiteList, {
                        name: 'name',
                        code: 'code'
                    })
                    // 站点 -- end

                    let lazadaRulesSaleSite = ``
                    lazadaSiteList.forEach(item => {
                        if (item.code != "ID")
                            lazadaRulesSaleSite += `<input type="checkbox" name="globalSaleSite" lay-skin="primary" value="${item.code}" title="${item.name}">`
                    })
                    $("#lazadaRulesSaleSite").html(lazadaRulesSaleSite)

                    // 开发类型，商品标签和物流属性 -- start
                    // 开发类型devTypeEnums[数组]
                    commonRenderSelect("devType", devTypeEnums)
                    // 商品标签prodTagMap
                    commonRenderSelect("prodAttrList", prodTagMap, {
                        name: 'name',
                        code: 'name'
                    })
                    //
                    commonRenderSelect("unProdAttrList", prodTagMap, {
                        name: 'name',
                        code: 'name'
                    })
                    //物流属性logisAttrEnums[数组]
                    commonRenderSelect("logisAttrList", logisAttrEnums)
                    // 商品标签和物流属性 -- end

                    form.render();
                    formSelects.render();
                })
                $('#lazadarulesCateTree').html('该站点下无类目');
            },
            yes: function (index, layero) {
                let flag = checkAddrulesData($('#lazadarules_form_addrules'));
                if (flag == 0) return;

                let chkedNodeId = lazadaCateTree.getCheckedNodes(true);
                let autoPublishCateIds = chkedNodeId.map(function (item) {
                    return item.id;
                }).join();

                let obj = serializeObject($('#lazadarules_form_addrules'))
                obj.saleSite = $('#lazadarules_form_addrules select[name="saleSite"]').val();

                let lazadaCateTreeRadioChecked = $("input[name=lazadarulesCateTreeRadioChecked]:checked").val();
                if (autoPublishCateIds == '' && lazadaCateTreeRadioChecked == 1) {
                    layer.alert("类目id不能为空", {
                        icon: 2
                    });
                    return false
                } else if (lazadaCateTreeRadioChecked == 0) {
                    obj.categoryIdList = 0;
                } else {
                    obj.categoryIdList = autoPublishCateIds;
                }

                getDatalazadarulesInsertRule(obj).then(function (result) {
                    layer.msg(result, { icon: 1 });
                    layer.close(popIndex);
                    reloadAddrules()
                }).catch(function (err) {
                    layer.msg(err, { icon: 2 });
                })
            }
        })
    })

    // 批量修改弹框
    $("#lazadarules_btn_batchModify").click(function () {
        let checkTableData = layui.table.checkStatus("lazadarules_table_addrules").data;
        let ids = checkTableData.map(item=>item.id);
        if(ids.length <= 0){
            return layer.msg("请选择需要修改的规则")
        }
        let checkData = [{
            name:"备注",
            field:'remark',
            isReq:false
        },{
            name:"状态",
            field:'status',
            isReq:true
        },{
            name:"刊登日期",
            field:'executionWeekTime',
            isReq:true
        // },{
        //     name:"刊登类型",
        //     field:'globalListing',
        //     isReq:true
        // },{
        //     name:"Lazada站点",
        //     field:'saleSite',
        //     isReq:true
        // },{
        //     name:"站点类目",
        //     field:'lazadarulesCateTreeRadioChecked',
        //     isReq:true
        },{
            name:"开发类型",
            field:'devType',
            isReq:false
        },{
            name:"商品标签",
            field:'prodAttrList',
            isReq:false
        },{
            name:"物流属性",
            field:'logisAttrList',
            isReq:false
        },{
            name:"商品归属人",
            field:'bizzOwnerList',
            isReq:false
        },{
            name:"模板sku",
            field:'modelPSku',
            isReq:false
        },{
            name:"lazada模板类型",
            field:'moduleType',
            isReq:true
        },{
            name:"lazada模板创建时间",
            field:'createDays',
            isReq:false
        },{
            name:"30天销量",
            field:'thirtySalesStart',
            isReq:false
        },{
            name:"成本",
            field:'costMin',
            isReq:false
        },{
            name:"重量",
            field:'weightMin',
            isReq:false
        },{
            name:"预计可用库存",
            field:'preAvailableStockType',
            isReq:false
        },{
            name:"刊登量",
            field:'listingMin',
            isReq:false
        },{
            name:"获取数据顺序",
            field:'orderField',
            isReq:true
        },{
            name:"刊登方式",
            field:'ruleType',
            isReq:true
        }]
        let popIndex = layer.open({
            title: '批量修改规则',
            type: 1, //不加该属性,就会出现[object Object]
            area: ['1000px', '70%'],
            btn: ['保存', '关闭'],
            id: 'lazadarules_layer_addrulesId',
            content: $('#lazadarules_layer_batchModify').html(),
            success: function (layero, index) {
                // let checkData = ["备注","状态","刊登日期","刊登类型&站点","站点类目","开发类型","商品标签","物流属性","商品归属人","模板sku","lazada模板类型","lazada模板创建时间","30天销量","成本","重量","预计可用库存","刊登量","获取数据顺序","刊登方式"]
                let str1 = '',str2 = '';
                checkData.forEach(item => {
                    $("." + item.field).hide()
                    str1 += `<div class="lazadarules_batchModify_checkboxCon"><input type="checkbox" lay-filter="lazadarules_layer_batchModify_checkbox" lay-skin="primary" title="${item.isReq?"<span style='float:left;color:red;padding:1px;'>*</span>":''}${item.name}" value="${item.field}" name="lazadarules_layer_batchModify_checkbox"></div>`
                })
                layero.find(".checkForm").html(str1)
                // let filterData = ["不刊登商品标签"]
                // filterData.forEach(item => {
                //     str2 += `<input type="checkbox" lay-skin="primary" title="${item}" name="lazadarules_layer_batchModify_checkbox">`
                // })
                // layero.find(".filterForm").html(str2)
                form.render("checkbox")

                form.on('checkbox(lazadarules_layer_batchModify_checkbox)', function (obj) {
                    let checked = obj.elem.checked,
                        field = obj.value;

                    if(checked){
                        $("." + field).show()
                    }else{
                        $("." + field).hide()
                        // $(`[name=${field}]`).val('')
                    }
                })

                $("#lazadarules_form_batchModify input[name='executionWeekTime']").attr('checked', 'true');
                // 渲染开发类型,商品标签和物流属性,商品归属人
                Promise.all([getDatalazadarulesInitLazadaSite(), newpublishRenderSelect()]).then(function (results) {
                    let lazadaSiteList = results[0],
                        prodTagMap = results[1].prodTagMap,
                        logisAttrEnums = results[1].logisAttrEnums,
                        devTypeEnums = results[1].devTypeEnums;

                    // // 站点 -- start
                    // commonRenderSelect("saleSite", lazadaSiteList, {
                    //     name: 'name',
                    //     code: 'code'
                    // })
                    // // 站点 -- end

                    // let lazadaRulesSaleSite = ``
                    // lazadaSiteList.forEach(item => {
                    //     if (item.code != "ID")
                    //         lazadaRulesSaleSite += `<input type="checkbox" name="globalSaleSite" lay-skin="primary" value="${item.code}" title="${item.name}">`
                    // })
                    // $("#lazadaRulesSaleSite").html(lazadaRulesSaleSite)

                    // 开发类型，商品标签和物流属性 -- start
                    // 开发类型devTypeEnums[数组]
                    commonRenderSelect("devType", devTypeEnums)
                    // 商品标签prodTagMap
                    commonRenderSelect("prodAttrList", prodTagMap, {
                        name: 'name',
                        code: 'name'
                    })
                    //
                    commonRenderSelect("unProdAttrList", prodTagMap, {
                        name: 'name',
                        code: 'name'
                    })
                    //物流属性logisAttrEnums[数组]
                    commonRenderSelect("logisAttrList", logisAttrEnums)
                    // 商品标签和物流属性 -- end

                    form.render();
                    formSelects.render();
                })
                // $('#lazadarulesCateTree').html('该站点下无类目');
            },
            yes: function (index, layero) {
                // checkbox选中的数据
                let checkedData = serializeObject(layero.find(".checkForm"))
                // // 类目
                // let chkedNodeId = lazadaCateTree.getCheckedNodes(true);
                // let autoPublishCateIds = chkedNodeId.map(function (item) {
                //     return item.id;
                // }).join();
                // 表单数据
                let obj = serializeObject($('#_lazadarules_form_batchModify'))
                // obj.saleSite = $('#_lazadarules_form_batchModify select[name="saleSite"]').val();
                // obj.globalListing = $('#_lazadarules_form_batchModify select[name="globalListing"]').val();
                // 模板SKU
                if(obj.modelPSku){
                    obj.modelPSku  = obj.modelPSku .replaceAll('，',',').split(',').filter(item=>!!item).join()
                }
                // // 站点类目
                // let lazadaCateTreeRadioChecked = $("input[name=lazadarulesCateTreeRadioChecked]:checked").val();
                // if (autoPublishCateIds == '' && lazadaCateTreeRadioChecked == 1) { // 指定类目
                //     layer.alert("类目id不能为空", {
                //         icon: 2
                //     });
                //     return false
                // } else if (lazadaCateTreeRadioChecked == 0) { // 全部类目
                //     obj.categoryIdList = 0;
                // } else {
                //     obj.categoryIdList = autoPublishCateIds;
                // }
                // checkedData?.lazadarules_layer_batchModify_checkbox
                if(!(checkedData?.lazadarules_layer_batchModify_checkbox&&checkedData?.lazadarules_layer_batchModify_checkbox != '')){
                    return layer.msg("请选中需要修改的数据")
                }
                let isReq = false,saveData = {},minAndMax = {
                    // 'globalListing': 'globalSaleSite',       // GSP刊登，刊登站点
                    'thirtySalesStart': 'thirtySalesEnd',
                    'costMin': 'costMax',
                    'weightMin': 'weightMax',
                    'preAvailableStockType': 'preAvailableStockNum',
                    'listingMin': 'listingMax'
                }
                checkData.forEach(item => {
                    if(checkedData.lazadarules_layer_batchModify_checkbox.includes(item.field)){
                        if(minAndMax[item.field]){
                            saveData[minAndMax[item.field]] = obj[minAndMax[item.field]]
                        }
                        saveData[item.field] = obj[item.field]
                    }
                    if(item.isReq && checkedData.lazadarules_layer_batchModify_checkbox.includes(item.field) && (saveData[item.field] == ''||!saveData[item.field])){
                        isReq = true
                    }
                })

                if(saveData['globalListing'] && saveData['globalListing'] == true){ // 刊登类型
                    if(!obj.globalSaleSite){
                        isReq = true
                    }
                    saveData['globalSaleSite'] = obj.globalSaleSite
                }
                if(saveData['ruleType'] && saveData['ruleType'] == 2){ // 刊登方式
                    if(!obj.listingTemplateNum||!obj.listingStoreNum||!obj.listingMaxNum){
                        isReq = true
                    }
                    saveData['listingTemplateNum'] = obj.listingTemplateNum
                    saveData['listingStoreNum'] = obj.listingStoreNum
                    saveData['listingMaxNum'] = obj.listingMaxNum
                }

                let _checkedData = serializeObject(layero.find(".filterForm"))
                if(_checkedData?.lazadarules_layer_batchModify_checkbox){
                    saveData['unProdAttrList'] = obj.unProdAttrList
                }
                if(isReq){
                    return layer.msg("选中的必填项的数据，不能为空")
                }
                let saveDataObj = []
                ids.forEach(item => {
                    saveDataObj.push({
                        id:item,
                        ...saveData
                    })
                })

                // 批量修改规则保存接口
                commonReturnPromiseRes({
                    url: `/lms/lazadaAutoListingRule/batchupdateLazadaAutoListingRule`,
                    type: 'POST',
                    contentType: 'application/json',
                    params: JSON.stringify({
                        ids,
                        "rule":saveData,
                        "updateColumns":Object.keys(saveData)
                    })
                }).then(function (result) {
                    if(result.code == '0000'){
                        if(result.data && JSON.stringify(result.data) != '{}'){
                            layer.msg(JSON.stringify(result.data), { icon: 7 });
                        }else{
                            layer.msg(result.msg, { icon: 1 });
                            layer.close(popIndex);
                            reloadAddrules()
                        }
                    }else{
                        layer.msg(JSON.stringify(result.data), { icon: 2 });
                    }
                }).catch(function (err) {
                    layer.msg(err, { icon: 2 });
                })
            }
        })
    })

    //批量操作
    form.on('select(lazada_rules_patch)', function (data) {
        var selected = $.trim(data.value);
        if (selected == null || selected == '') {
            return false;
        }
        if(selected == 1){
            handleOnOff(true) // 批量开启
        }else if(selected == 2){
            handleOnOff(false) // 批量关闭
        }
    })

    // // 导入
    // $("#lazadarules_btn_import").click(function () {
    //     commonReturnPromise({
    //         url: `/lms/lazadaAutoListingRule/importListingRuleStore.html`,
    //         type: 'put',
    //         contentType: 'application/json',
    //         params: JSON.stringify({
    //             id: ruleId,
    //             status: status
    //         })
    //     })
    // })

    // 导入
    upload.render({
        elem: '#lazadarules_btn_import' //绑定元素
        , url: `${ctx}/lazadaAutoListingRule/importListingRuleStore.html`//上传接口
        , accept: 'file' //允许上传的文件类型
        , exts: 'xlsx'
        ,before: function (obj) { //obj参数包含的信息，跟 choose回调完全一致，可参见上文。
            layui.admin.load.show();
        }
        , done: function (res) {
            layui.admin.load.hide();
            if (res.code == "0000") {
                if(JSON.stringify(res.data) == '{}') {
                    layer.msg('导入成功', {icon: 1});
                } else {
                    let str = ''
                    for(let key in res.data){
                        str += `第${key}行` + res.data[key] + '<br/>'
                    }
                    layer.alert(str, {icon: 5});
                }
            } else {
                layer.alert(res.msg, {icon: 5});
            }
        }
        , error: function () {
            layui.admin.load.hide();
            layer.msg('服务器出现故障!');
        }
    });

    function handleOnOff(status){
        var checkData = layui.table.checkStatus("lazadarules_table_addrules").data;
        let ids = checkData.map(item=>item.id);

        if(ids.length <= 0){
            return layer.msg("请选择需要开启/关闭的规则")
        }
        let popIndex = layer.confirm("确定要修改这些规则状态吗？", {
            btn: ['确认', '取消']
        }, function () {
            layer.close(popIndex);

            getDatalazadarulesUpdateStatus(ids.join(","), status).then(function (result) {
                $("#lazadarules_searchBtn").click();
                layer.msg("修改成功", { icon: 1 });
            }).catch(function (err) {
                layer.alert(err, { icon: 2 });
            })
        });
    }

    // 监听站点，根据站点选择类目
    form.on('select(lazadarules_saleSite)', function (data) {
        let saleSite = data.value

        if (saleSite) {
            initLazadaCateTree(saleSite).then(function (result) {
            });
        } else {
            $('#lazadarulesCateTree').html('该站点下无类目');
        }
    })

    // 监听刊登类型，如果是GSP刊登，站点只读，选中
    form.on('select(lazadarulesGlobalListing)', function (data) {
        let globalListing = data.value

        if (globalListing == "true") {   // GSP刊登
            $("#lazadarules_form_addrules select[name=saleSite]").val("MY")
            $("#lazadarules_form_addrules select[name=saleSite]").attr("disabled", true)
            initLazadaCateTree("MY").then(function (result) {
            });
            $(".lazadaRulesSaleSiteHide").show()
        } else {  // 单站点刊登
            $("#lazadarules_form_addrules select[name=saleSite]").val("")
            $("#lazadarules_form_addrules select[name=saleSite]").attr("disabled", false)
            $('#lazadarulesCateTree').html('该站点下无类目');
            // 清除选中值并隐藏
            $("#lazadaRulesSaleSite input[type='checkbox']").each(function () {
                this.checked = false;
            });
            $(".lazadaRulesSaleSiteHide").hide()
        }
        form.render();
    })

    //店铺表
    function handleStoremanageTable(ruleId) {
        table.render({
            elem: "#lazadarules_table_storemanage",
            method: 'get',
            url: ctx + "/lazadaAutoListingRuleStore/searchLazadaAutoListingRuleStoreList/" + ruleId, // 店铺列表接口
            cols: [
                [{
                    field: "storeAcct",
                    title: "店铺名"
                }, {
                    field: "listingLimit",
                    title: "总额度"
                },
                {
                    field: "canListingCount",
                    title: "可用额度"
                },
                {
                    field: "dailyPublishNums",
                    title: '每天刊登量'
                },
                {
                    field: "autoDelete",
                    title: "自动删除",
                    templet: function (res) {
                        return res.autoDelete == 1 ? "开启" : "关闭"
                    }
                },
                {
                    field: "autoDeleteNum",
                    title: "每天删除数量",
                    templet: function (res) {
                        return `${res.autoDeleteNum == undefined ? "0" : res.autoDeleteNum}`
                    }
                },
                {
                    field: "autoDeleteGreatListingTime",
                    title: "删除刊登时间",
                    templet: function (res) {
                        return `大于${res.autoDeleteGreatListingTime == undefined ? "90" : res.autoDeleteGreatListingTime}天`
                    }
                },
                {
                    field: "autoDeleteSalesTypeValue",
                    title: "删除销量设置",
                    templet: function (res) {
                        return `${res.autoDeleteSalesTypeValue == undefined ? "90天销量" : res.autoDeleteSalesTypeValue}=0`
                    }
                },
                {
                    field: "stock",
                    title: "在线库存"
                },
                {
                    field: "publishTime",
                    title: '上架开始时间',
                    templet: function (res) {
                        return "中国时间：" + res.publishTime + ":00"
                    }
                },
                {
                    field: "publishInterval",
                    title: '上架间隔时间',
                    templet: function (res) {
                        return res.publishInterval + "分钟"
                    }
                },
                {
                    title: '操作',
                    align: 'center',
                    toolbar: '#lazadarules_tabletemplet_storeoptionbtn'
                }
                ],
            ],
            id: "lazadarules_table_storemanage",
            page: true,
            limits: [50, 100, 150],
            limit: 50,
        });
    }

    // 刷新表格
    function reloadStoremanage() {
        table.reload('lazadarules_table_storemanage', {
            page: {
                curr: 1
            }
        });
        reloadAddrules();
    }

    // 验证店铺信息
    function checkStoremanageData() {
        let obj = serializeObject($('#lazadarules_storeadd'));
        let err = '';

        if (obj.dailyPublishNums * obj.publishInterval >= 1200)
            err = '刊登量 x 间隔时间 必须小于 1200';
        if (obj.dailyPublishNums == '')
            err = '每天刊登量不能为空';
        if (obj.storeAccts == '')
            err = '店铺名称不能为空';
        if (err) {
            layer.alert(err, {
                icon: 2
            });
            return 0;
        }
        return 1;
    }

    // 店铺表格操作监听
    table.on('tool(lazadarules_table_storemanage)', function (obj) {
        var layEvent = obj.event; //获得 lay-event 对应的值
        var trdata = obj.data; //获得当前行数据
        if (layEvent === 'edit') { //编辑店铺
            let popIndex = layer.open({
                title: '编辑店铺',
                type: 1, //不加该属性,就会出现[object Object]
                area: ['500px', '70%'],
                btn: ['保存', '关闭'],
                id: 'lazadarules_layer_storeadId',
                content: $('#lazadarules_layer_storeadd').html(),
                success: function () {

                    getDatalazadarulesGetStore(trdata.id).then(function (data) {
                        $('#lazadarules_storeadd input[name="storeAccts"]').val(data.storeAcct);
                        $('#lazadarules_storeadd input[name="storeAccts"]').attr("readonly", true)
                        $('#lazadarules_storeadd input[name="stock"]').val(data.stock);
                        $('#lazadarules_storeadd input[name="dailyPublishNums"]').val(data.dailyPublishNums);
                        $('#lazadarules_storeadd select[name="publishInterval"]').val(data.publishInterval);
                        $('#lazadarules_storeadd select[name="publishTime"]').val(data.publishTime);
                        form.render();
                    })
                        .catch(function (err) {
                            layer.msg(err, {
                                icon: 2
                            });
                        });
                },
                yes: function (index, layero) {
                    var flag = checkStoremanageData();
                    if (flag == 0) return;

                    let obj = serializeObject($('#lazadarules_storeadd'));
                    // 当前店铺所对应的 规则id
                    obj.ruleId = trdata.ruleId;
                    obj.id = trdata.id;

                    getDatalazadarulesUpdateStore(obj).then(function (result) {
                        layer.msg("保存成功", { icon: 1 });
                        layer.close(popIndex);
                        reloadStoremanage();
                    }).catch(function (err) {
                        layer.msg(err, { icon: 2 });
                    })
                }
            })
        } else if (layEvent === 'delete') {
            let popIndex = layer.confirm("确定要删除此店铺吗？", { btn: ['确认', '取消'] }, function () {
                layer.close(popIndex);
                getDatalazadarulesDeleteStore(trdata.id, obj).then(function (result) {
                    layer.msg("删除成功", { icon: 1 });
                    reloadStoremanage();
                }).catch(function (err) {
                    layer.msg(err, { icon: 2 });
                })
            })
        }
    })

    //添加店铺
    $(document).on("click", "#lazadarules_storemanage_storeaddbtn", function () {
        let ruleId = $("#lazadarules_id").val().trim();
        let popIndex = layer.open({
            title: '添加店铺',
            type: 1, //不加该属性,就会出现[object Object]
            area: ['500px', '70%'],
            btn: ['保存', '关闭'],
            id: 'lazadarules_layer_storeadId',
            content: $('#lazadarules_layer_storeadd').html(),
            success: function () {
                form.render();
            },
            yes: function (index, layero) {
                var flag = checkStoremanageData();
                if (flag == 0) return;

                let obj = serializeObject($('#lazadarules_storeadd'));
                obj.ruleId = ruleId;

                // 模板SKU
                if(obj.modelPSku){
                    obj.modelPSku  = obj.modelPSku .replaceAll('，',',').split(',').filter(item=>!!item).join()
                }

                getDatalazadarulesInsertStore(obj).then(function (data) {
                    layer.msg(data, { icon: 1 });
                    layer.close(popIndex);
                    reloadStoremanage();
                })
                    .catch(function (err) {
                        layer.msg(err, {
                            icon: 2
                        });
                    });
            }
        })
    })

    // 监听规则弹窗的刊登规则选择
    form.on('radio(lazadarules_addRule_ruleType)', function (data) {
        if (data.value == 1) {
            $('#lazadarules_listingNum').hide()
        } else if (data.value == 2) {
            $('#lazadarules_listingNum').show()
        }
    })

    //导出店铺
    $(document).on("click", "#lazadarules_storemanage_exportbtn", function () {
        let ruleId = $("#lazadarules_id").val().trim();
        let targetData = {};
        targetData.ruleId = ruleId;
        transBlob({
            url: '/lms/lazadaAutoListingRuleStore/exportLazadaAutoRuleRelatedStores',
            formData: JSON.stringify(targetData),
            contentType: 'application/json',
            fileName: `lazada规则店铺${Date.now()}`,
        }, "POST").then(function (result) {
            loading.hide();
        }).catch(function (err) {
            layer.msg(err.message, { icon: 2 });
        });
    })

    //批量移除店铺
    $(document).on("click", "#lazadarules_storemanage_removebtn", function () {
        let ruleId = $("#lazadarules_id").val().trim();
        let popIndex = layer.open({
            title: '批量操作',
            type: 1, //不加该属性,就会出现[object Object]
            area: ['500px', '50%'],
            btn: ['保存', '关闭'],
            id: 'lazadarules_layer_storeadId',
            content: $('#lazadarules_layer_removestore').html(),
            success: function () {
                form.render();
            },
            yes: function (index, layero) {
                let storeAcctNames = $("#lazadarules_layer_removestore_form #allStoreName").val().replace(/\n/g, ",");
                let obj = {};
                obj.ruleId = ruleId;
                obj.storeAcctNames = storeAcctNames;
                if (storeAcctNames == '') {
                    layer.msg("请输入店铺名", { icon: 2 });
                } else {
                    getDatalazadarulesRelatedStoreByStoreAcctName(obj).then(function (data) {
                        layer.msg(data, { icon: 1 });
                        layer.close(popIndex);
                        reloadStoremanage();
                    }).catch(function (err) {
                        layer.msg(err, {
                            icon: 2
                        });
                    });
                }
            }
        })
    })

    // 更新规则状态
    form.on('switch(lazadarules_orderDownloadStatus)', function (data) {
        let ruleId = data.value,
            status = data.elem.checked == true;
        let checked = data.elem.checked;
        let popIndex = layer.confirm("确定要修改此规则状态吗？", {
            btn: ['确认', '取消'],
            cancel: function (index, layero) {
                data.elem.checked = !checked;
                form.render();
            }
        }, function () {
            layer.close(popIndex);

            getDatalazadarulesUpdateStatus(ruleId, status).then(function (result) {
                $("#lazadarules_searchBtn").click();
                layer.msg("修改成功", { icon: 1 });
            }).catch(function (err) {
                data.elem.checked = !checked;
                form.render();
                layer.alert(err, { icon: 2 });
            })
        }, function () {
            data.elem.checked = !checked;
            form.render();
        });
    });
});

var lazadaCateData;
var lazadaCateTree;

//初始化lazada商品类目
function initLazadaCateAjax(saleSite) {
    return commonReturnPromise({
        url: ctx + "/salesplat/listLazadaCateTree.html?saleSite=" + saleSite
    });
}

function initLazadaCateTree(saleSite) {
    //左侧类目tree
    return new Promise(function (resolve) {
        initLazadaCateAjax(saleSite).then(function (result) {
            var setting = {
                check: {
                    enable: true,
                    chkDisabledInherit: true,
                },
                data: {
                    simpleData: {
                        enable: true,
                        idKey: "id",
                        pIdKey: "pid",
                    },
                },
                callback: {
                    onCheck: function (event, treeId, treeNode) {
                        //禁用所有子类
                        if (treeNode.isParent) {
                            var childrenNodes = treeNode.children;
                            try {
                                for (var i = 0; i <= childrenNodes.length; i++) {
                                    lazadaCateTree.setChkDisabled(
                                        childrenNodes[i],
                                        treeNode.checked,
                                        false,
                                        true
                                    );
                                }
                            } catch (e) {
                                //TODO handle the exception
                                console.log(e)
                            }
                            var childrenIds = getLazadaChildren([], treeNode);
                            for (var i = 0; i < childrenIds.length; i++) {
                                var node = lazadaCateTree.getNodeByParam("id", childrenIds[i]);
                                lazadaCateTree.checkNode(node, treeNode.checked, false, true);
                            }
                        }
                    }
                }
            };
            setting.check.chkboxType = {
                Y: "s",
                N: "s"
            };
            // if (lazadaCateData == undefined) {
            //     lazadaCateData = result;
            //     var t = $("#lazadarulesCateTree");
            //     t = $.fn.zTree.init(t, setting, lazadaCateData);
            //     lazadaCateTree = $.fn.zTree.getZTreeObj("lazadarulesCateTree");
            // } else {
            //     lazadaCateTree.destroy();
            //     var t = $("#lazadarulesCateTree");
            //     t = $.fn.zTree.init(t, setting, lazadaCateData);
            //     lazadaCateTree = $.fn.zTree.getZTreeObj("lazadarulesCateTree");
            // }
            // if (lazadaCateData == undefined) {
            //     lazadaCateTree.destroy();
            lazadaCateData = result;
            var t = $("#lazadarulesCateTree");
            t = $.fn.zTree.init(t, setting, lazadaCateData);
            lazadaCateTree = $.fn.zTree.getZTreeObj("lazadarulesCateTree");
            // } else {
            //     lazadaCateTree.destroy();
            //     var t = $("#lazadarulesCateTree");
            //     t = $.fn.zTree.init(t, setting, lazadaCateData);
            //     lazadaCateTree = $.fn.zTree.getZTreeObj("lazadarulesCateTree");
            // }
            resolve('tree');
        }).catch(function (err) {
            layer.alert(err, {
                icon: 2
            });
        });
    });
}

//获取ztree所有字节点id
function getLazadaChildren(ids, treeNode) {
    ids.push(treeNode.id);
    if (treeNode.isParent) {
        for (var obj in treeNode.children) {
            getLazadaChildren(ids, treeNode.children[obj]);
        }
    }
    return ids;
}
