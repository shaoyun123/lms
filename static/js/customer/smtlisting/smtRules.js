var smtRulesCateData
var smtRulesCateTree;
layui.use(['admin', 'form', 'layer', 'formSelects', 'element', 'table', 'laypage', 'laydate'], function () {
    var form = layui.form,
        table = layui.table,
        layer = layui.layer,
        formSelects = layui.formSelects,
        $ = layui.$;

    smtRules_init()// 初始化创建人和店铺
    form.render();

    function smtRules_init () {
        Promise.all([commonReturnPromise({
            type: 'post',
            url: ctx + '/sys/listStoreForRenderHpStoreCommonComponent.html',
            params: { roleNames: "smt专员", platCode: 'aliexpress' }
        }), commonReturnPromise({
            type: 'post',
            url: ctx + '/sys/listAllUser.html',
        })]).then(data => {
            commonRenderSelect('smtRules_storeAcctIds', data[0], { name: 'storeAcct', code: 'id' })
            commonRenderSelect('smtRules_creator', data[1], { name: 'loginName', code: 'id' })
        }).then(() => {
            form.render()
            formSelects.render("smtRules_storeAcctIds")
            formSelects.render("smtRules_creator")
        }).catch(err => layer.msg(err || err.msg, { icon: 2 }))
    }

    //搜索
    $("#smtRules_searchBtn").click(function () {
        smtRules_tableRender()
    })

    // 清空
    $("#smtRules_resetBtn").click(function () {
        $("#smtRules_search_form")[0].reset()
    })

    function smtRules_tableRender () {
        var whereData = serializeObject($('#smtRules_search_form'));  // 获取form表单数据
        table.render({
            elem: '#smtRules_tpl_table',
            method: 'get',
            url: ctx + '/aliexpressAutoListingRuleController/rule/queryPage',
            where: whereData,
            cols: [[
                { field: "status", title: "状态", templet: '#smtRules_table_status' },
                { field: "ruleName", title: "规则名称" },
                { field: "storeNums", title: '应用店铺数量', templet: '#smtRules_table_storeCount' },
                { field: "executionWeekTime", title: '执行日期' },
                { field: "remark", title: '备注' },
                { field: "creator", title: '创建人' },
                { field: "modifier", title: '修改人' },
                { field: "modifyTime", title: '修改时间', templet: '<div>{{format(d.modifyTime,"yyyy-MM-dd hh:mm:ss")}}</div>' },
                { title: '操作', align: 'center', toolbar: '#smtRules_toolbar' }
            ]],
            page: true,
            limit: 50,
            limits: [50, 100, 150],
        })
    }

    // 监听规则table的操作项
    table.on('tool(smtRules_tpl_table)', function (obj) {
        switch (obj.event) {
            case 'update':
                smtRules_addRule(true, obj.data,obj)
                break;
            case 'delete':
                smtRules_delRule(obj.data.id)
                break;
            case 'storeCount':
                smtRules_viewStoreInfo(obj.data)
                break;
            case 'log':
                getSmtRulesLog(obj.data)
                break;
            default:
                break;
        }
    })

    // 监听店铺table的操作项
    table.on('tool(smtRules_store_table)', function (obj) {
        switch (obj.event) {
            case 'update':
                smtRules_addstore(true, obj.data)
                break;
            case 'delete':
                smtRules_delStore(obj.data.id)
                break;
            default:
                break;
        }
    })

    // 更新规则状态
    form.on('switch(smtRules_changeStatus)', function (data) {
        let id = data.value, status = data.elem.checked == true ? 1 : 0;
        let checked = data.elem.checked;
        let popIndex = layer.confirm("确定要修改此规则状态吗？", function () {
            $.ajax({
                url: ctx + `/aliexpressAutoListingRuleController/rule/updateStatus/` + id, // 修改店铺信息
                type: 'put',
                data: { status: status },
                success: function (returnData) {
                    if (returnData.code == '0000') {
                        $("#smtRules_searchBtn").click();
                        layer.msg(returnData.msg, { icon: 1 });
                        layer.close(popIndex);
                    } else {
                        data.elem.checked = !checked;
                        form.render();
                        layer.alert(returnData.msg, { icon: 2 });
                    }
                }
            })
        }, function () {
            data.elem.checked = !checked;
            form.render();
        });
    });

    // 监听规则弹窗的刊登规则选择
    form.on('radio(smtRules_addRule_ruleType)', function (data) {
        if (data.value == 1) {
            $('#smtRules_listingNum').hide()
        } else if (data.value == 2) {
            $('#smtRules_listingNum').show()
        }
    })

    table.on('edit(smtRules_store_table)', function(obj) {
        //  获取单元格编辑之前td的选择器
        let oldValue = $(this).prev('div').text()
        var value = obj.value //得到修改后的值
            , data = obj.data //得到所在行所有键值
            , field = obj.field; //得到字段
        var Adata = {id: data.id}
        Adata[field] = value
        // 校验参数
        if (field == 'stock' && (value <= 0 || value.toString().includes("."))) {
            // 校验不通过，恢复原值
            this.value = oldValue
            layer.msg("修改失败，在线库存仅支持正整数",{icon:7})
            return
        }
        if (field == 'dailyPublishNums' && (value <= 0 || value >500 || value.toString().includes("."))) {
            // 校验不通过，恢复原值
            this.value = oldValue
            layer.msg("修改失败，刊登量仅支持输入0-500的整数",{icon:7})
            return
        }

        data[field] = value
        commonReturnPromise({
            url: ctx + '/aliexpressAutoListingRuleStoreController/batchEditStoreInfo',
            type: 'POST',
            contentType: 'application/json',
            params: JSON.stringify([data])
        }).then(res => {
            layer.alert("修改成功", { icon: 1 })
        })
    })

})

// 添加  编辑  弹窗
function smtRules_addRule (isUpdate, obj = '',tableObj) {
    let isUpdateId = ''
    let layer = layui.layer
    let formSelects = layui.formSelects
    let form = layui.form
    let getOriginalParams
    layer.open({
        type: 1,
        title: isUpdate ? "编辑规则" : "添加规则",
        content: $("#smtRules_addRules_modal").html(),
        area: ['900px', '800px'],
        btn: ['保存', '取消'],
        success: function (layero, index) {
            smtRules_addRuleRenderSelects()
                .then(() => {
                    !isUpdate && smtRulesCateZtree()
                }).then(() => {
                    if (isUpdate) {  //有默认值
                        commonReturnPromise({
                            url: ctx + `/aliexpressAutoListingRuleController/rule/get/${obj.id}`
                        }).then(data => {
                            let layerFormDom = $('#smtRules_addRules_form')
                            isUpdateId = data.id
                            getOriginalParams = data
                            layerFormDom.find('input[name=ruleName]').val(data.ruleName)
                            layerFormDom.find('textarea[name=remark]').val(data.remark)
                            layerFormDom.find(`input[name=status]:radio[value=${data.status}]`).prop('checked', 'true')
                            let executionWeekTime = data.executionWeekTime.split(',');
                            executionWeekTime.forEach(function (item) {
                                $("input[name='executionWeekTime']:checkbox[value=" + item + "]").attr('checked', 'true');
                            })
                            layerFormDom.find('select[name=devType]').val(data.devType)
                            let _prodAttrList = data.prodAttrList.split(',')
                            let _notPublishedProdAttrList = (data.notPublishedProdAttrList||'').split(',')
                            let _logisAttrList = data.logisAttrList.split(',')
                            let _bizzOwnerIdList = data.bizzOwnerIdList.split(',')
                            formSelects.value('smtRules_prodAttrList', _prodAttrList)
                            formSelects.value('smtRules_notPublishedProdAttrList', _notPublishedProdAttrList)
                            formSelects.value('smtRules_logisAttrList', _logisAttrList)
                            formSelects.value('smtRules_bizzOwnerIdList', _bizzOwnerIdList)
                            layerFormDom.find('input[name=auditDays]').val(data.auditDays)
                            layerFormDom.find('input[name=modelCreateDays]').val(data.modelCreateDays)
                            layerFormDom.find('input[name=thirtySalesStart]').val(data.thirtySalesStart)
                            layerFormDom.find('input[name=thirtySalesEnd]').val(data.thirtySalesEnd)
                            layerFormDom.find('input[name=costMax]').val(data.costMax)
                            layerFormDom.find('input[name=costMin]').val(data.costMin)
                            layerFormDom.find('input[name=weightMax]').val(data.weightMax)
                            layerFormDom.find('input[name=weightMin]').val(data.weightMin)
                            layerFormDom.find('input[name=modelCreateMaxDays]').val(data.modelCreateMaxDays)
                            layerFormDom.find('input[name=modelCreateMinDays]').val(data.modelCreateMinDays)
                            if (data.expectedStockExway != undefined) {
                                layerFormDom.find(`select[name=expectedStockType] option[value=expectedStockExway]`).attr("selected", true)
                                layerFormDom.find('input[name=expectedStockNum]').val(data.expectedStockExway)
                            } else if (data.expectedStockOnway != undefined) {
                                layerFormDom.find(`select[name=expectedStockType] option[value=expectedStockOnway]`).attr("selected", true)
                                layerFormDom.find('input[name=expectedStockNum]').val(data.expectedStockOnway)
                            }
                            layerFormDom.find(`select[name=preAvailableAllSku] option[value=${data.preAvailableAllSku}]`).attr("selected", true)
                            layerFormDom.find(`select[name=orderField] option[value=${data.orderField}]`).attr("selected", true)
                            layerFormDom.find(`input[name=ruleType]:radio[value=${data.ruleType}]`).attr("checked", true)
                            // 模板sku
                            layerFormDom.find('textarea[name=prodPSkuListStr]').val(data.prodPSkuListStr)
                            layerFormDom.find('textarea[name=notPublishedProdPSkuListStr]').val(data.notPublishedProdPSkuListStr)
                            if (data.ruleType == 2) {
                                layerFormDom.find('input[name=listingTemplateNum]').val(data.listingTemplateNum)
                                layerFormDom.find('input[name=listingStoreNum]').val(data.listingStoreNum)
                                layerFormDom.find('select[name=listingMaxNumType]').val(data.listingMaxNumType)
                                layerFormDom.find('input[name=listingMaxNum]').val(data.listingMaxNum)
                            } else {
                                $('#smtRules_listingNum').hide()
                            }
                            // 类目渲染
                            smtRulesCateZtree().then(function (result) {
                                var prodCateIds = data.categoryIdList.split(",");
                                for (var i = 0; i < prodCateIds.length; i++) {
                                    var node = smtRulesCateTree.getNodeByParam("id", prodCateIds[i]);
                                    if (node != null) {
                                        smtRulesCateTree.checkNode(node, true, false, true);
                                    }
                                }
                            })
                            form.render()
                        }).catch(err => layer.msg(err || err.msg, { icon: 2 }))
                    }
                }).then(() => {
                    formSelects.render("smtRules_prodAttrList")
                    formSelects.render("smtRules_logisAttrList")
                    formSelects.render("smtRules_bizzOwnerIdList")
                    formSelects.render("smtRules_notPublishedProdAttrList")
                    form.render()
                }).catch(err => layer.msg(err || err.msg, { icon: 2 }))
        },
        yes: function (index, layero) {
            let params = serializeObject($('#smtRules_addRules_form'))
            var chkedNodeId = smtRulesCateTree.getCheckedNodes(true);
            //选中节点
            params.categoryIdList = chkedNodeId.map(function (item) {
                return item.id;
            }).join();
            params[params.expectedStockType] = params.expectedStockNum == '' ? '' : Number(params.expectedStockNum)
            // 因为要和之前的原参数进行混合，避免俩个都出现
            if (isUpdate) { 
                params.id = isUpdateId
                if (params.expectedStockType == 'expectedStockOnway') {
                    getOriginalParams.expectedStockExway != undefined && delete getOriginalParams.expectedStockExway
                } else if (params.expectedStockType == 'expectedStockExway') {
                    getOriginalParams.expectedStockOnway != undefined && delete getOriginalParams.expectedStockOnway
                }
             }
            delete params.expectedStockType
            delete params.expectedStockNum
            //  // 模板SKU
             if(params.prodPSkuListStr){
                params.prodPSkuListStr = params.prodPSkuListStr.replaceAll('，',',').split(',').filter(item=>!!item).join()
            }
              //  // 不刊登商品父sku
              if(params.notPublishedProdPSkuListStr){
                params.notPublishedProdPSkuListStr = params.notPublishedProdPSkuListStr.replaceAll('，',',').split(',').filter(item=>!!item).join()
            }
            var flag = smtRules_verifyRulesParmas(params)
            if (flag == 0) return;
            let _params = { ...getOriginalParams, ...params }
            if (params.ruleType == 1) {
                _params.listingStoreNum = ''
                _params.listingTemplateNum = ''
            }
            commonReturnPromise({
                url: isUpdate ? ctx + '/aliexpressAutoListingRuleController/rule/editInfo' : ctx + '/aliexpressAutoListingRuleController/rule/addRule',
                type: 'post',
                params: isUpdate ? JSON.stringify(_params) : JSON.stringify(params),
                contentType: 'application/json',
            }).then(data => {
                layer.close(index)
                layer.msg(isUpdate ? '编辑成功' : '添加成功')
                if(isUpdate){ // 编辑保存
                    tableObj.update({
                        // status: _params.status,
                        ruleName: _params.ruleName,
                        executionWeekTime: _params.executionWeekTime,
                        remark: _params.remark,
                        modifier: localStorage.getItem('lmsAppUserName'),
                        modifyTime: new Date().getTime()
                    });
                    let bool = _params.status == 'true' ? true : false;
                    $("#smtRules_tpl_table").next().find(`.trCheckbox${_params.id}`).prop("checked", bool)
                    form.render()
                }else{
                $("#smtRules_searchBtn").click()
                }
            }).catch(err => layer.msg(err || err.msg, { icon: 2 }))
        },
        end: function () {
            smtRulesCateData = undefined;
            smtRulesCateTree.destroy();
        }
    })
}

// 删除规则
function smtRules_delRule (id) {
    if (id) {
        commonReturnPromise({
            url: ctx + `/aliexpressAutoListingRuleController/rule/delete/${id}`,
            type: 'delete'
        }).then(() => {
            layui.layer.msg('删除成功', { icon: 1 })
            $("#smtRules_searchBtn").click()
        }).catch(err => layui.layer.msg(err || err.msg, { icon: 2 }))
    }
}

// 删除店铺
function smtRules_delStore (id) {
    if (id) {
        commonReturnPromise({
            url: ctx + `/aliexpressAutoListingRuleStoreController//store/delete/${id}`,
            type: 'delete'
        }).then(() => {
            layui.layer.msg('删除成功', { icon: 1 })
            smtRules_storeTableRender($('#smtRules_storeInfo_id').text())
        }).catch(err => layui.layer.msg(err || err.msg, { icon: 2 }))
    }
}

function getSmtRulesLog(trdata){
    //渲染日志
    commonReturnPromise({
        type: 'GET',
        url: '/lms/aliexpressAutoListingRuleController/getRuleModifyLogs?ruleId=' + trdata.id,
    }).then(result => {
        publishRulesLogLayer(result,trdata.ruleName)
    }).catch(err => {
        layer.msg(err, {icon: 2});
    });
}

// 点击店铺 设置店铺弹窗
function smtRules_viewStoreInfo (obj) {
    let layer = layui.layer
    let laytpl = layui.laytpl
    let form = layui.form
    layer.open({
        type: 1,
        title: "设置店铺",
        content: "加载中",
        area: ['90%', '800px'],
        success: function (layero, index) {
            laytpl($('#smtRules_storeInfo_modal').html()).render(obj, function (html) {
                $(layero).find('.layui-layer-content').html(html)
            })
            smtRules_storeTableRender(obj.id)
            let publishTimeList = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24],publishTimeStr = '<option></option>',
                publishIntervalList = [1,2,3,4,5,10,15,20,25,30],publishIntervalStr = '<option></option>';
            publishTimeList.forEach(item => {
                publishTimeStr += `<option value="${item}">${item}点</option>`
            })
            publishIntervalList.forEach(item => {
                publishIntervalStr += `<option value="${item}">${item}分钟</option>`
            })
            layero.find("[name=publishTime]").html(publishTimeStr)
            layero.find("[name=publishInterval]").html(publishIntervalStr)
            form.render()

            // 一键应用
            layero.find(".batchApply").click(function (){
                let checkTableData = layui.table.checkStatus("smtRules_store_table").data;
                if(checkTableData.length == 0){
                    return layer.alert("请选择需要修改的数据",{ icon:7 })
                }
                let stock = layero.find("[name=stock]").val(),
                    dailyPublishNums = layero.find("[name=dailyPublishNums]").val(),
                    publishTime = layero.find("[name=publishTime]").val(),
                    publishInterval = layero.find("[name=publishInterval]").val();
                if(stock && stock <= 0){
                    layer.msg("在线库存仅支持正整数,请重新输入",{icon:7})
                    return
                }
                if(dailyPublishNums && (dailyPublishNums <= 0 || dailyPublishNums > 500)){
                    layer.msg("刊登量仅支持输入0-500的整数,请重新输入",{icon:7})
                    return
                }
                if(dailyPublishNums && publishInterval && dailyPublishNums * publishInterval > 1200){
                    layer.msg("刊登量与间隔时间的积须小于1200",{icon:7})
                    return
                }
                checkTableData.forEach(item => {
                    stock ? item.stock = stock : '';
                    dailyPublishNums ? item.dailyPublishNums = dailyPublishNums : '';
                    publishTime ? item.publishTime = publishTime : '';
                    publishInterval ? item.publishInterval = publishInterval : '';
                })
                commonReturnPromise({
                    url: ctx + '/aliexpressAutoListingRuleStoreController/batchEditStoreInfo',
                    type: 'POST',
                    contentType: 'application/json',
                    params: JSON.stringify(checkTableData)
                }).then(res => {
                    layer.alert("修改成功", { icon: 1 })
                    smtRules_storeTableRender(obj.id)
                })
            })
            // 批量移除
            layero.find(".batchDel").click(function (){
                let checkTableData = layui.table.checkStatus("smtRules_store_table").data;
                if(checkTableData.length == 0){
                    return layer.alert("请选择需要删除的数据",{ icon:7 })
                }
                layer.confirm("确定要删除选中的数据吗？", function () {
                    commonReturnPromise({
                        url: ctx + '/aliexpressAutoListingRuleStoreController/batchDeleteStoreInfoList',
                        type: 'DELETE',
                        contentType: 'application/json',
                        params: JSON.stringify(checkTableData.map(item => item.id))
                    }).then(res => {
                        layer.alert("删除成功", { icon: 1 })
                        smtRules_storeTableRender(obj.id)
                    })
                });
            })
        },
        end: function () {
            $("#smtRules_searchBtn").click()
        }
    })
}

// 店铺table
function smtRules_storeTableRender (id) {
    layui.table.render({
        elem: '#smtRules_store_table',
        url: ctx + `/aliexpressAutoListingRuleStoreController/store/list/${id}`,
        cols: [[
            { type: "checkbox" },
            { field: "storeAcct", title: "店铺名" },
            { field: "stock", title: "在线库存(点击编辑)",edit: 'text' },
            { field: "isOpenDrainage", title: '是否开启引流', templet: "<div>{{!!d.status?'已开启':''}}</div>" },
            { field: "dailyPublishNums", title: '刊登量(点击编辑)',edit: 'text' },
            { field: "publishTime", title: '上架开始时间', templet: '<div>中国时间：{{d.publishTime}}:00</div>', sort: true, width: 110 },
            { field: "publishInterval", title: '上架间隔时间', templet: '<div>{{d.publishInterval}}分钟</div>', sort: true, width: 110 },
            { field: "creator", title: '创建人' },
            { field: "modifier", title: '修改人' },
            { title: '操作', align: 'center',width: 120, toolbar: '#smtRules_toolbar' }
        ]],
        limit: 999,
        done: function (res, cur, count) {
            $("#smtRules_storeTotalNum").find('span').text(res.data.length)
        }
    })
}

//添加店铺弹窗
function smtRules_addstore (isUpdate, obj = {}) {
    let layer = layui.layer
    let form = layui.form
    let formSelects = layui.formSelects
    let isUpdateDate
    layer.open({
        type: 1,
        title: isUpdate ? "编辑店铺" : "添加店铺",
        content: $('#smtRules_addStores_modal').html(),
        area: ['500px', '500px'],
        btn: ['保存', '取消'],
        success: function (layero, index) {
            commonReturnPromise({
                url: ctx + '/sys/listStoreForRenderHpStoreCommonComponent.html',
                type: 'post',
                params: {
                    roleNames: 'smt专员',
                    orgId: '',
                    salePersonId: '',
                    platCode: 'aliexpress',
                }
            }).then(res => {
                commonRenderSelect(isUpdate ?"smtRules_editStore_store" :'smtRules_addStore_store', res, { name: 'storeAcct', code: 'id' })
            }
            ).then(() => {
                formSelects.render('smtRules_addStore_store')
                if (isUpdate) {  //编辑，有默认值
                    commonReturnPromise({
                        url: ctx + `/aliexpressAutoListingRuleStoreController/store/get/${obj.id}`
                    }).then(data => { //赋值
                        isUpdateDate = data
                        $("#smtRules_addStore_store").attr('disabled', true)
                        $("#smtRules_addStore_form").find('select[name=storeAcctId]').val(data.storeAcctId)
                        $("#smtRules_addStore_form").find('input[name=stock]').val(data.stock)
                        $("#smtRules_addStore_form").find('input[name=dailyPublishNums]').val(data.dailyPublishNums)
                        $("#smtRules_addStore_form").find('select[name=publishTime]').val(data.publishTime)
                        $("#smtRules_addStore_form").find('select[name=publishInterval]').val(data.publishInterval)
                        form.render()
                    }).catch(err => layui.layer.msg(err || err.message, { icon: 2 }))
                }else{
                    formSelects.render('smtRules_addStore_store')
                }
                form.render()
                if(isUpdate){
                    $('#smtRules_addStore_store').css('display','none')
                    $('#smtRules_addStore_store').next().css('display','none')
                }else{
                    $('#smtRules_editStore_store').css('display','none')
                    $('#smtRules_editStore_store').next().css('display','none')
                }
            }).catch(err => layui.layer.msg(err || err.message, { icon: 2 }))
        },
        yes: function (index, layero) {
            let params = serializeObject($('#smtRules_addStore_form'))
            if (!isUpdate) {
                params.storeNameStr = formSelects.value('smtRules_addStore_store', 'name').join()
                if (params.storeNameStr == '') return layer.msg('店铺名不能为空')
                delete params.storeAcctId
            }else{
                params.storeAcct = $('#smtRules_addStore_form').find('select[name=storeAcctId] option:selected').text()
                if (params.storeAcct == '') return layer.msg('店铺名不能为空')
            }
            params.ruleId = $('#smtRules_storeInfo_id').text()   //规则id
            if (params.stock == '') return layer.msg('在线库存不能为空')
            if (params.dailyPublishNums == '') return layer.msg(' 每天刊登量不能为空')
            if (params.dailyPublishNums <= 0) return layer.msg('每天刊登量须大于0')
            if (params.dailyPublishNums > 500) return layer.msg('每天刊登量须小于500')
            if (params.publishTime == '') return layer.msg('请选择上架时间')
            if (params.publishInterval * params.dailyPublishNums >= 1200) return layer.msg('刊登量与间隔时间的积须小于1200')
            commonReturnPromise({
                url: isUpdate ? ctx + '/aliexpressAutoListingRuleStoreController/store/editInfo' : ctx + '/aliexpressAutoListingRuleStoreController/store/setStoreForRule',
                type: isUpdate ? 'put' : 'post',
                params: isUpdate ? JSON.stringify({ ...params, id: obj.id }) : JSON.stringify(params),
                contentType: 'application/json',
            }).then(data => {
                layer.msg(data ? data : isUpdate ? '编辑成功' : '修改成功')
                layer.close(index)
                smtRules_storeTableRender($('#smtRules_storeInfo_id').text())
            }).catch(err => layui.layer.msg(err || err.message, { icon: 2 }))
        },
        end: function () {
            layui.formSelects.value('smtRules_addStore_store', []);
        },
    })
}

function smtRulesCateZtree () {
    return new Promise(function (resolve) {
        commonReturnPromise({
            url: ctx + "/aliexpressAutoListingRuleController/listSmtCateTree.html"
        }).then(data => {
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
                                    smtRulesCateTree.setChkDisabled(
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
                                var node = smtRulesCateTree.getNodeByParam("id", childrenIds[i]);
                                smtRulesCateTree.checkNode(node, treeNode.checked, false, true);
                            }
                        }
                    }
                }
            }
            setting.check.chkboxType = { Y: "s", N: "s" };
            if (smtRulesCateData == undefined) {
                smtRulesCateData = data;
                var t = $("#smtRulesCateTree");
                t = $.fn.zTree.init(t, setting, smtRulesCateData);
                smtRulesCateTree = $.fn.zTree.getZTreeObj("smtRulesCateTree");
            } else {
                smtRulesCateTree.destroy();
                var t = $("#smtRulesCateTree");
                t = $.fn.zTree.init(t, setting, smtRulesCateData);
                smtRulesCateTree = $.fn.zTree.getZTreeObj("smtRulesCateTree");
            }
            resolve('tree');
        }).catch(err => layui.layer.msg(err || err.msg, { icon: 2 }))
    })
}

//获取ztree所有字节点id
function getLazadaChildren (ids, treeNode) {
    ids.push(treeNode.id);
    if (treeNode.isParent) {
        for (var obj in treeNode.children) {
            getLazadaChildren(ids, treeNode.children[obj]);
        }
    }
    return ids;
}

// 规则弹窗获取下拉框渲染数据
function smtRules_addRuleRenderSelects () {
    return new Promise(function (resolve, reject) {
        commonReturnPromise({
            url: ctx + '/fyndiq/new/listing/manage.html'
        }).then(data => {
            commonRenderSelect('smtRules_devType', data.devTypeEnums)
            commonRenderSelect('smtRules_prodAttrList', data.prodTagMap, { name: 'name', code: 'name' })
            commonRenderSelect('smtRules_notPublishedProdAttrList', data.prodTagMap, { name: 'name', code: 'name' })
            commonRenderSelect('smtRules_logisAttrList', data.logisAttrEnums)
            commonRenderSelect('smtRules_bizzOwnerIdList', data.bizzOwners, { name: 'userName', code: 'id' })
        }).then(() => {
            resolve('渲染成功')
        }).catch(err => reject(err))
    })
}

// 规则弹窗的保存验证参数
function smtRules_verifyRulesParmas (params) {
    let err = ''
    if (params.executionWeekTime == '' || params.executionWeekTime == undefined) {
        err = '刊登日期不能为空'
        smtRules_requiredBorderRed('.smtRules_executionWeekTime_checkbox')
    } else if (params.ruleName == '' || params.ruleName == undefined) {
        err = '规则名称不能为空'
        smtRules_requiredFoucs('input', 'ruleName')
    }else if(params.modelCreateMinDays!==''&& params.modelCreateMaxDays!=='' && !(Number(params.modelCreateMaxDays)>Number(params.modelCreateMinDays))){
        err = '模板创建时间的区间值不符合规范'
    } else if (params.costMin < 0) {
        err = '预估刊登价最小值须大于或等于0'
        smtRules_requiredFoucs('input', 'costMin')
    } else if (params.costMax < 0) {
        err = '预估刊登价最大值须大于或等于0'
        smtRules_requiredFoucs('input', 'costMax')
    } else if (params.costMin && params.costMax && params.costMin - params.costMax > 0) {
        err = '预估刊登价数据不合法'
        smtRules_requiredFoucs('input', 'costMin')
        smtRules_requiredFoucs('input', 'costMax')
    } else if (params.weightMin < 0) {
        err = '重量最小值须大于或等于0'
        smtRules_requiredFoucs('input', 'weightMin')
    } else if (params.weightMax < 0) {
        err = '重量最大值须大于或等于0'
        smtRules_requiredFoucs('input', 'weightMax')
    } else if (params.weightMin && params.weightMax && params.weightMin - params.weightMax > 0) {
        err = '重量数据不合法'
        smtRules_requiredFoucs('input', 'weightMin')
        smtRules_requiredFoucs('input', 'weightMax')
    } else if (params.ruleType == '' || params.ruleType == undefined) {
        err = '刊登规则需必选'
        smtRules_requiredBorderRed('.smtRules_ruleType_radio')
    } else if (params.ruleType == 2 && params.listingTemplateNum == '') {
        err = '刊登模板数量需必填'
        smtRules_requiredFoucs('input', 'listingTemplateNum')
    } else if (params.ruleType == '' && params.listingStoreNum == '') {
        err = '刊登店铺数量需必填'
        smtRules_requiredFoucs('input', 'listingStoreNum')
    }
    if (err) {
        layui.layer.msg(err);
        return 0;
    }
    return 1;
}

function smtRules_requiredFoucs (type, name) {
    $('#smtRules_addRules_form ' + type + '[name=' + name + ']').addClass('layui-form-danger').focus();
    setTimeout(function () {
        $('#smtRules_addRules_form ' + type + '[name=' + name + ']').removeClass('layui-form-danger')
    }, 1500);
}
function smtRules_requiredBorderRed (className) {
    $('#smtRules_addRules_form').find(`${className}`).css('border', '1px solid red');
    setTimeout(function () {
        $('#smtRules_addRules_form').find(`${className}`).css('border', '');
    }, 1500);
}

function smtRules_inputInt(event){
    const value = event.target.value
    const char = event.key
    if (value) {
      if (!/^\d/.test(char)) {
        event.preventDefault()
      }
    } else {
      if (!/\-|^\d/.test(char)) {
        event.preventDefault()
      }
    }
}