let amazonCateData
let amazonCateTree
layui.use(['admin', 'form', 'layer', 'formSelects', 'element', 'table', 'laypage', 'tree', 'laydate'], function () {
    var admin = layui.admin,
        form = layui.form,
        table = layui.table,
        layer = layui.layer,
        formSelects = layui.formSelects,
        laydate = layui.laydate,
        laytpl = layui.laytpl,
        laypage = layui.laypage,
        tree = layui.tree
    $ = layui.$

    form.render()

    render_hp_orgs_users('#amazonrules_searchForm')//渲染部门销售员店铺三级联动

    // 初始化amazon创建人
    commonReturnPromise({
        url: `/lms/sysuser/listUser.html`,
    }).then(function (result) {
        commonRenderSelect('amazonrules_creatorId', result.filter(n => n), {
            name: 'userName',
            code: 'id'
        })
    }).catch(err => layer.msg(err, {icon: 2}))

    // 初始化站点
    let siteData = amazonrules_initAmazonSiteAjax().map(item => ({"name": item.siteName, "value": item.siteId}))
    formSelects.data('amazonrules_site_sel', 'local', {arr: siteData})

    // 搜索
    $('#amazonrules_searchBtn').on('click', function () {
        amazonrules_tableRender()
    })

    function amazonrules_tableRender() {
        var whereData = serializeObject($('#amazonrules_searchForm')) // 获取form表单数据
        // 如果没有选择店铺  如果部门没选值，销售人员没选
        let orgId = $('#amazonRules_depart_sel').val() // 部门
        let salesmanId = $('#amazonRules_salesman_sel').val() // 销售员
        if (whereData.storeAcctIdList == '' && (orgId || salesmanId)) {
            whereData.storeAcctIdList = $('#amazonRules_store_sel').attr('acct_ids') == '' ? [99999]
                : $('#amazonRules_store_sel').attr('acct_ids').split(',')

        } else if (whereData.storeAcctIdList == '' && orgId == '' && salesmanId == '') {
            whereData.storeAcctIdList = []
        } else {
            whereData.storeAcctIdList = whereData.storeAcctIdList.split(',')
        }
        // 站点
        whereData.siteIdList = whereData.siteIdList == '' ? [] : whereData.siteIdList.split(',')
        // 规则表
        var tableIns = table.render({
            elem: '#amazonrules_table_addrules',
            method: 'POST',
            url: ctx + '/amazonAutoListingRule/queryPage',
            where: whereData,
            contentType: 'application/json',
            cols: [
                [
                    {type: 'checkbox', width: 30},
                    {field: 'status', title: '状态', templet: '#amazonrules_tabletemplet_type'},
                    {sort:true,field: 'ruleName', title: '规则名称'},
                    {sort:true,field: 'saleSite', title: '站点'},
                    {
                        sort:true,
                        field: 'storeNums',
                        title: '店铺数量',
                        templet: '#amazonrules_tabletemplet_count'
                    },
                    {field: 'executionWeekTime', title: '执行日期（每周）'},
                    {field: 'remark', title: '备注'},
                    {field: 'creator', title: '创建人'},
                    {field: 'modifier', title: '修改人'},
                    {field: 'modifyTime', title: '最近一次修改时间',templet:function(d){ return `${Format(d.modifyTime||"",'yyyy-MM-dd hh:mm:ss')}` }},
                    {title: '操作', align: 'center', toolbar: '#amazonrules_tabletemplet_optionbtn'}
                ],
            ],
            id: 'amazonrules_table_addrules',
            page: true,
            limits: [100, 200, 500],
            limit: 100,
            done:function(){
                if(whereData.orderBy == '(rule_name USING GBK) asc'){
                    $("[data-field=ruleName]").find(".layui-table-sort").attr("lay-sort","asc")
                }else if(whereData.orderBy == '(rule_name USING GBK) desc'){
                    $("[data-field=ruleName]").find(".layui-table-sort").attr("lay-sort","desc")
                }
            }
        })
    }

    //触发排序事件
    table.on('sort(amazonrules_table_addrules)', function(obj){
        $("#amazonrules_searchForm input[name=orderBy]").val(``)
        if(obj.field == "ruleName"){
            $("#amazonrules_searchForm input[name=orderBy]").val(`(rule_name USING GBK) ${obj.type}`)
            amazonrules_tableRender()
        }
    });

    // 验证规则信息
    function checkAddrulesData() {
        let obj = serializeObject($('#amazonrules_form_addrules')),
            err = ''

        if (obj.ruleType == 2 && obj.listingTemplateNum == '') err = '刊登模板数不能为空'
        if (obj.ruleType == 2 && obj.listingStoreNum == '') err = '每个模板刊登店铺数不能为空'
        if (obj.ruleType == 2 && obj.listingMaxNum == '') err = '刊登模板上限不能为空'

        if (obj.ruleType == '' || obj.ruleType == undefined) err = '请选择刊登规则'
        if (obj.executionWeekTime == '' || obj.executionWeekTime == undefined) err = '刊登日期不能为空'
        if (obj.saleSite == '' || obj.saleSite == undefined) err = 'amazon站点不能为空'
        if (obj.ruleName == '') err = '规则名称不能为空'
        if (obj.selfImgStatus == '') err = '自拍图不能为空'
        if (obj.imgStatus == '') err = '图片状态不能为空'


        // if (obj.amazonrulesCateTreeRadioChecked == 1&& obj.categoryIdList == '') err = '站点类目不能为空'

        if (err) {
            layer.alert(err, {icon: 2})
            return 0
        }

        return 1
    }

    // 重载规则表
    function reloadAddrules() {
        table.reload('amazonrules_table_addrules', {
            page: {curr: 1}
        })
    }

    // 规则表格操作监听
    table.on('tool(amazonrules_table_addrules)', function (obj) {
        var layEvent = obj.event //获得 lay-event 对应的值
        var trdata = obj.data //获得当前行数据
        let xtree
        if (layEvent === 'remark') {
            trdata.expectedStockOnway == undefined?trdata.expectedStock = 2:trdata.expectedStockValue = trdata.expectedStockOnway
            trdata.expectedStockExway == undefined?trdata.expectedStock = 1:trdata.expectedStockValue = trdata.expectedStockExway

            toamazonRules(1, trdata)
        } else if (layEvent === 'delete') {
            let popIndex = layer.confirm('确定要删除此条规则吗？', function () {
                getDataamazonRulesDelete(trdata.id).then(function (result) {
                    layer.msg(result, {icon: 1})
                    reloadAddrules()
                    layer.close(popIndex)
                }).catch(err => layer.msg(err, {icon: 2}))
            })
        } else if (layEvent === 'amazonrules_tabletemplet_count') {
            // 应用店铺数量弹框
            let ruleId = trdata.id
                // orgId = $("#amazonrules_storemanage_depart_sel").val(),
                // salePersonId = $("#amazonrules_storemanage_salesman_sel").val(),
                obj = {
                    "id":trdata.id,
                    "roleNames":'amazon专员',
                    "platCode":'amazon',
                };
            // if(orgId){
            //     obj.orgId = orgId
            // }
            // if(salePersonId){
            //     obj.salePersonId = salePersonId
            // }

            let popIndex = layer.open({
                title: '设置店铺',
                type: 1, //不加该属性,就会出现[object Object]
                area: ['80%', '70%'],
                content: $('#amazonrules_layer_storemanage').html(),
                success: function () {
                    render_hp_orgs_users('#amazonrules_storemanage_searchForm')//渲染部门销售员店铺三级联动

                    $('.amazonrules_storemanage_id').val(ruleId)
                    $(".amazonrules_storemanage_name").text(trdata.ruleName)

                    handleStoremanageTable(obj)
                    form.render()
                    // 一键应用
                    $('#amazonRules_batchSetDailyListingBtn').click(function () {
                        var checkStatus = table.checkStatus('amazonrules_table_storemanage'),
                            data = checkStatus.data
                        if (data.length === 0) {
                            layer.msg('请选择需要应用的店铺')
                            return
                        }
                        let idMap = {}
                        for (let i = 0; i < data.length; ++i) {
                            idMap[data[i].id] = 1
                        }
                        // 一键应用值
                        let toSetValue = $('#amazonRules_batchSetDailyListing').val()
                        if (!isInteger(toSetValue)) {
                            layer.msg('请输入一个正整数')
                            return
                        }

                        // 获取表格元素
                        let tableEle = $('#amazonrules_table_storemanage').next('.layui-table-view')
                        let tableData = layui.table.cache.amazonrules_table_storemanage
                        for (let i = 0; i < tableData.length; ++i) {
                            if (!idMap[tableData[i].id]) {
                                continue
                            }
                            // 更新缓存值
                            tableData[i].dailyPublishNums = toSetValue
                            // 更新展示值
                            tableEle.find('.amazonRules_IdInp' + '[value=' + tableData[i].id + ']')
                                .closest('tr').find('[data-field=dailyPublishNums] .layui-table-cell').text(toSetValue)
                        }
                    })

                    // // 输入监听
                    // table.on('edit(amazonrules_table_storemanage)', function (obj) {
                    //     var value = obj.value //得到修改后的值
                    //         , data = obj.data //得到所在行所有键值
                    //         , field = obj.field; //得到字段
                    //     // 修改后，选中当前行
                    //     // let curTr = $(this).closest('tr')
                    //     // curTr.find('.layui-form-checkbox:eq(0):not(.layui-form-checked)').click()
                    //     // 调接口保存当前行
                    //     if (!value || !isInteger(value) || value < 0) {
                    //         layer.msg('每天刊登量必须为正整数')
                    //         return
                    //     }
                    //     if (value > 3000) {
                    //         layer.msg('每天刊登量最大为3000')
                    //         return
                    //     }
                    //     let params = [{
                    //         id: data.id,
                    //         dailyPublishNums: value
                    //     }]
                    //     oneAjax.post({
                    //         url: '/amazonAutoListingRuleStore/batchUpdate',
                    //         data: params,
                    //         success: function (res) {
                    //             if (res.code === '0000') {
                    //                 layer.msg('修改成功', {icon: 1})
                    //             }
                    //         }
                    //     })
                    // })

                    // 批量保存
                    $('#amazonrules_storemanage_batchSaveBtn').click(function () {
                        var checkStatus = table.checkStatus('amazonrules_table_storemanage'),
                            data = checkStatus.data
                        if (data.length === 0) {
                            layer.msg('请选择需要保存的店铺')
                            return
                        }
                        let dtoList = []

                        for (let i = 0; i < data.length; ++i) {
                            if (!data[i].dailyPublishNums || !isInteger(data[i].dailyPublishNums) || data[i].dailyPublishNums < 0) {
                                layer.msg('每天刊登量必须为正整数',{icon:2})
                                return
                            }
                            if (data[i].dailyPublishNums * 1 > 500) {
                                layer.msg('每天刊登量最大为500',{icon:2})
                                return
                            }
                            dtoList.push({
                                id: data[i].id,
                                dailyPublishNums: data[i].dailyPublishNums
                            })
                        }

                        oneAjax.post({
                            url: '/amazonAutoListingRuleStore/batchUpdate',
                            data: dtoList,
                            success: function (res) {
                                if (res.code === '0000') {
                                    layer.msg('修改成功', {icon: 1})
                                }
                            }
                        })
                    })
                }
            })
        } else if (layEvent === 'addCopy') {
            // 刊登规则复制
            let index = layer.open({
                shadeClose: false,
                type: 1,
                title: '复制新增',
                area: ['500px', '400px'],
                btn: ['新建', '关闭'],
                content: $('#amazonRules_addCopy_layer').html(),
                success: () => {
                    // 初始化站点
                    let siteData = amazonrules_initAmazonSiteAjax().map(item => ({"name": item.siteName, "value": item.siteId}))
                    formSelects.data('amazonRules_addCopy_salesSite_sel', 'local', {arr: siteData})
                },
                yes: () => {
                    let salesSite = [],salesSiteStr = ''
                    formSelects.value('amazonRules_addCopy_salesSite_sel').forEach(e => {
                        salesSite.push(e.value)
                    })
                    salesSiteStr = salesSite.join(",")
                    let data = {
                        id: trdata.id,
                        salesSite:salesSiteStr
                    }
                    if(salesSite.length == 0){
                        layer.msg("站点不能为空",{icon:2})
                    }else{
                        getDataamazonRulesCopyRule(data).then(res=>{
                            reloadAddrules()
                            layer.msg(res)
                        })
                    }
                }
            })
        } else if (layEvent === 'log') {
             //渲染日志
             commonReturnPromise({
                type: 'GET',
                url: `/lms/amazonAutoListingRule/logs?ruleId=${trdata.id}&platCode=amazon`,
            }).then(result => {
                publishRulesLogLayer(result,trdata.ruleName)
            }).catch(err => {
                layer.msg(err, {icon: 2});
            });
        }
    })

    // 类目属性全选或全不选
    form.on('checkbox(amazon_rule_cateAllchecked)', function (data) {
        var valArr = JSON.parse(JSON.stringify(cateXTreeForSupplier))
        if (data.elem.checked) {
            iterateValArr(valArr, true)
            amazon_reload_CateTree(valArr, data.elem.checked)
        } else {
            iterateValArr(valArr, false)
            amazon_reload_CateTree(valArr, data.elem.checked)
        }
    })

    // 遍历得出全选的值
    function iterateValArr(arr, isChecked) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].data.length) {
                arr[i].checked = isChecked
                iterateValArr(arr[i].data, isChecked)
            } else {
                arr[i].checked = isChecked
            }
        }
    }

    function amazon_reload_CateTree(valArr, isChecked) {
        // 复现 已选择类目

        var xtree = new layuiXtree({
            elem: 'xtree1', //必填,放置xtree的容器id，不要带#号
            form: form, //必填,layui 的 from
            data: valArr, //必填
            isopen: false, //加载完毕后的展开状态，默认值：true
            ckall: false, //启用全选功能，默认值：false
            color: {
                //三种图标颜色，独立配色，更改几个都可以
                open: '#EE9A00', //节点图标打开的颜色
                close: '#EEC591', //节点图标关闭的颜色
                end: '#828282' //末级节点图标的颜色
            },
            click: function (data) {
                //节点选中状态改变事件监听，全选框有自己的监听事件
                if ($('#xtree1').find('input[name=amazon-allchecked-cate]').length) {
                    saveXtreeData(xtree, $('#xtreeSearchHidden'), $('#xtreeSearchDiv'))
                    var categoryIdListLength = serializeObject($('#amazonrules_form_addrules')).categoryIdList.split(',').length
                    var count = iterateArrLength(0, cateXTreeForSupplier)
                    categoryIdListLength == count ? $('#xtree1').find('input[name=amazon-allchecked-cate]').prop('checked', true)
                        : $('#xtree1').find('input[name=amazon-allchecked-cate]').prop('checked', false)
                    form.render()
                }
            }
        })
        let allCheckdom = `<input type="checkbox" name="amazon-allchecked-cate" lay-skin="primary" id="" value="0" title="全选" ${isChecked ? 'checked' : ''} lay-filter="amazon_rule_cateAllchecked">`
        $('#xtree1').prepend(allCheckdom)
        form.render()
    }

    // 添加规则弹框
    $('#amazonrules_btn_addrules').click(function () {
        toamazonRules(0)
    })

    // 批量开启规则
    $('#amazonrules_btn_on').click(function () {
        let tableData = table.checkStatus("amazonrules_table_addrules").data
        let tableDataId = tableData.map(item => item.id)
        if(tableDataId.length == 0){
            layer.msg("请选择规则",{icon:2})
            return false
        }
        getDataamazonRulesBatchOpen(tableDataId).then(res => {
            layer.msg(res.msg || '开启成功', {icon: 1})
            reloadAddrules()
        })
    })

    // 批量关闭规则
    $('#amazonrules_btn_off').click(function () {
        let tableData = table.checkStatus("amazonrules_table_addrules").data
        let tableDataId = tableData.map(item => item.id)
        if(tableDataId.length == 0){
            layer.msg("请选择规则",{icon:2})
            return false
        }
        getDataamazonRulesBatchClose(tableDataId).then(res => {
            layer.msg(res.msg || '关闭成功', {icon: 1})
            reloadAddrules()
        })
    })

    // 全部类目：0 &指定类目： 1
    form.on('radio(amazonCateTreeAllChecked)', function (data) {
        if (data.value == 0) {
            $("#amazonrules_form_addrules .amazonCateTreeIsShow").hide()
        } else {
            $("#amazonrules_form_addrules .amazonCateTreeIsShow").show()
        }
    });

    function toamazonRules(type, obj) {
        let xtree
        let popIndex = layer.open({
            title: type == 0 ? '添加规则' : '编辑规则',
            type: 1, //不加该属性,就会出现[object Object]
            area: ['1000px', '70%'],
            btn: ['保存', '关闭'],
            id: '_amazonrules_layer_addrulesLayerCreatAndEdit',
            content: $('#amazonrules_layer_addrulesLayerCreatAndEdit').html(),
            success: function () {
                if (type == 0) {
                    laytpl($('#amazonrules_layer_addrulesDemo').html()).render({}, function (html) {
                        $('#amazonrules_layer_addrulesView').html(html)
                    })
                } else {
                    laytpl($('#amazonrules_layer_addrulesDemo').html()).render(obj, function (html) {
                        $('#amazonrules_layer_addrulesView').html(html)
                    })
                }

                Promise.all([newpublishRenderSelect()]).then(function (res) {
                    //开发类型[数组对象]
                    commonRenderSelect('devTypeList', res[0].devTypeEnums).then(() => {
                        formSelects.render('devTypeList')
                        if (obj && obj.devTypeList) {
                            let devTypeList = obj.devTypeList.split(',')
                            formSelects.value('devTypeList', devTypeList)
                        }
                    }).catch(err => layer.msg(err, {icon: 2}))
                    //商品标签prodTagMap[数组对象]
                    commonRenderSelect('prodAttrList', res[0].prodTagMap, {
                        name: 'name',
                        code: 'name'
                    }).then(() => {
                        formSelects.render('prodAttrList')
                        if (obj && obj.prodAttrList) {
                            let prodAttrList = obj.prodAttrList.split(',')
                            formSelects.value('prodAttrList', prodAttrList)
                        }
                    }).catch(err => layer.msg(err, {icon: 2}))
                    //物流属性logisAttrEnums[数组]
                    commonRenderSelect('logisAttrList', res[0].logisAttrEnums).then(() => {
                        formSelects.render('logisAttrList')
                        if (obj && obj.logisAttrList) {
                            let logisAttrList = obj.logisAttrList.split(',')
                            formSelects.value('logisAttrList', logisAttrList)
                        }
                    }).catch(err => layer.msg(err, {icon: 2}))
                    // 自拍圖
                    commonRenderSelect('selfImgStatus', [{"name":"有图","code":"1"},{"name":"部分有图","code":"2"},{"name":"无图","code":"0"}], {
                        name: 'name',
                        code: 'code'
                    }).then(() => {
                        formSelects.render('selfImgStatus')
                        if (obj && obj.selfImgStatus) {
                            let selfImgStatus = obj.selfImgStatus.split(',')
                            formSelects.value('selfImgStatus', selfImgStatus)
                        }else{
                            formSelects.value('selfImgStatus', [1])
                        }
                    }).catch(err => layer.msg(err, {icon: 2}))
                    // 自拍圖
                    commonRenderSelect('imgStatus', [{"name":"部分有图","code":"1"},{"name":"全有图","code":"2"},{"name":"无图","code":"0"}], {
                        name: 'name',
                        code: 'code'
                    }).then(() => {
                        formSelects.render('imgStatus')
                        if (obj && obj.imgStatus) {
                            let imgStatus = obj.imgStatus.split(',')
                            formSelects.value('imgStatus', imgStatus)
                        }else{
                            formSelects.value('imgStatus', [2])
                        }
                    }).catch(err => layer.msg(err, {icon: 2}))
                    // 全部类目&指定类目
                    if(obj && obj.categoryIdList != ''){
                        $("#amazonrules_form_addrules .amazonCateTreeIsShow").show()
                    }else{
                        $("#amazonrules_form_addrules .amazonCateTreeIsShow").hide()
                    }

                    if (obj && obj.ruleType == 2) {
                        $('#amazonrules_listingNum').show()
                    } else if (obj && obj.ruleType == 1) {
                        $('#amazonrules_listingNum').hide()
                    }

                    // obj && obj.categoryIdList ? $('#amazonrules_form_addrules input[name="categoryIdList"]').val(obj.categoryIdList) : ''
                    // xtree = alertCateSelectDIV($('#xtreeContentDiv'), $('#xtreeSearchHidden'), $('#xtreeSearchDiv'))
                    //
                    // var count = iterateArrLength(0, cateXTreeForSupplier)
                    // var categoryIdListLength = obj && obj.categoryIdList ? obj.categoryIdList.split(',').length : ''
                    //
                    // let allCheckdom = `<input type="checkbox" lay-skin="primary" value="0" name="amazon-allchecked-cate" ${categoryIdListLength == count ? 'checked' : ''} title="全选" lay-filter="amazon_rule_cateAllchecked">`
                    // $('#xtree1').prepend(allCheckdom)
                    // 商品类目
                    initAmazonCateTree().then(function (result) {
                        var prodCateIds =
                            obj && obj.categoryIdList ? obj.categoryIdList.split(",") : []
                        for (var i = 0; i < prodCateIds.length; i++) {
                            var node = amazonCateTree.getNodeByParam("value", prodCateIds[i])
                            if (node != null) {
                                amazonCateTree.checkNode(node, true, false, true)
                            }
                        }
                    })

                    form.render()
                }).catch(err => layer.msg(err, {icon: 2}))
            },
            yes: function (index, layero) {
                // 类目树
                // saveXtreeData(xtree, $('#xtreeSearchHidden'), $('#xtreeSearchDiv'))
                let chkedNodeId = amazonCateTree.getCheckedNodes(true)
                let autoPublishCateIds = chkedNodeId
                    .map(function (item) {
                        return item.value
                    })
                    .join()
                // 校验
                var flag = checkAddrulesData()
                if (flag == 0) return
                // 校验通过，提交数据
                let submitObj = serializeObject($('#amazonrules_form_addrules'))
                if (submitObj.amazonrulesCateTreeRadioChecked == 1&& !autoPublishCateIds.length) return layer.msg("站点类目不能为空")
                // 类目
                submitObj.categoryIdList = autoPublishCateIds
                submitObj.siteName = $.trim($('#amazonrules_form_addrules select[name="saleSite"] option:selected').text())
                submitObj.devTypeList = formSelects.value('devTypeList', 'val').join(',').trim()
                submitObj.logisAttrList = formSelects.value('logisAttrList', 'val').join(',').trim()
                submitObj.selfImgStatus = formSelects.value('selfImgStatus', 'val').join(',').trim()
                submitObj.imgStatus = formSelects.value('imgStatus', 'val').join(',').trim()
                submitObj.prodAttrList = formSelects.value('prodAttrList', 'val').join(',').trim()
                // 模板SKU
                if(submitObj.prodPSkuList){
                    submitObj.prodPSkuList = submitObj.prodPSkuList.replaceAll('，',',').split(',').filter(item=>!!item).join()
                }
                // 转数字
                submitObj.preAvailableStockType = Number(submitObj.preAvailableStockType)
                submitObj.preAvailableStockNum = submitObj.preAvailableStockNum ? Number(submitObj.preAvailableStockNum) : ''
                if (submitObj.ruleType == 1) {
                    submitObj.listingTemplateNum = ''
                    submitObj.listingStoreNum = ''
                    submitObj.listingMaxNum = ''
                }

                if(submitObj.amazonrulesCateTreeRadioChecked == 0){ // 全部类目
                    submitObj.categoryIdList = ''
                }

                // 预计可用库存含在途
                if(submitObj.expectedStock == 1){
                    submitObj.expectedStockOnway = submitObj.expectedStockValue
                    delete submitObj.expectedStockExway
                    obj != undefined ? delete obj.expectedStockExway:''
                }else if(submitObj.expectedStock == 2){
                    submitObj.expectedStockExway = submitObj.expectedStockValue
                    delete submitObj.expectedStockOnway
                    obj != undefined ? delete obj.expectedStockOnway:''
                }
                // 是否站点去重
                submitObj.checkSiteListing = $('#checkSiteListing').val() || false

                delete submitObj.undefined
                if (type == 0) {
                    getDataamazonRulesAddRule(submitObj).then(function (result) {
                        layer.msg(result.msg || '保存成功', {icon: 1})
                        layer.close(popIndex)
                        reloadAddrules()
                    }).catch(err => layer.msg(err, {icon: 2}))
                } else {
                    let newObj = {...obj, ...submitObj}
                    getDataamazonRulesEditInfo(newObj).then(function (result) {
                        layer.msg(result.msg || '保存成功', {icon: 1})
                        layer.close(popIndex)
                        reloadAddrules()
                    }).catch(err => layer.msg(err, {icon: 2}))
                }
            },end: function () {
                amazonCateData = undefined;
                amazonCateTree.destroy();
            }
        })
    }

    // 监听规则弹窗的刊登规则选择
    form.on('radio(amazonrules_addRule_ruleType)', function (data) {
        if (data.value == 1) {
            $('#amazonrules_listingNum').hide()
        } else if (data.value == 2) {
            $('#amazonrules_form_addrules input[name=listingTemplateNum]').val('')
            $('#amazonrules_form_addrules input[name=listingStoreNum]').val('')
            $('#amazonrules_listingNum').show()
        }
    })

    //店铺表
    function handleStoremanageTable(obj) {
        var amazonStoremanageTable = table.render({
            elem: '#amazonrules_table_storemanage',
            method: 'post',
            where:obj,
            contentType: 'application/json',
            url: ctx + `/amazonAutoListingRuleStore/store/query`, // 店铺列表接口
            cols: [
                [
                    {type: 'checkbox', width: 30},
                    { field: 'storeAcctId', title: '店铺id' },
                    {field: 'storeAcct', title: '店铺名', width: 180},
                    {field: 'dailyPublishNums', title: '每日刊登量(可编辑)', edit: 'text', style: 'background-color: #7FFFD4;'},
                    { field: 'stock', title: '在线库存' },
                    {
                        field: 'publishTime', title: '上架开始时间', width: 150, templet: function (res) {
                            return '中国时间：' + res.publishTime + ':00'
                        }
                    },
                    {
                        field: 'publishInterval',
                        title: '上架间隔时间',
                        templet: function (res) {
                            return res.publishInterval + '分钟'
                        }
                    },
                    {title: '操作', align: 'center', toolbar: '#amazonrules_tabletemplet_storeoptionbtn'}
                ],
            ],
            id: 'amazonrules_table_storemanage',
            page: true,
            limits: [100, 200, 500],
            limit: 100,
            done: function (res, curr, count) {
                var layFilterIndex = 'LAY-table-' + amazonStoremanageTable.config.index;
                var tableContainer = $('div[lay-filter="' + layFilterIndex + '"]');
                //  隐藏店铺id
                $("[data-field='storeAcctId']").css('display', 'none');
                //   点击查询，页面table data前端筛选
                $('#amazonrules_storemanage_searchBtn').click(function () {
                    let storeAcctIdLIst = $('#amazonrules_storemanage_store_sel').attr('acct_ids').split(',')
                    let ordId = $('#amazonrules_storemanage_depart_sel').val()
                    let salesmanId = $('#amazonrules_storemanage_salesman_sel').val()
                    tableContainer.find('tbody').find('tr').each(function () {
                        let storeAcctIdTr = $(this).find('td[data-field="storeAcctId"] div').text()
                        if (ordId == '' && salesmanId == '') {
                            $(this).removeClass('hidden')
                            $(this).addClass('show')
                        } else if (storeAcctIdLIst.includes(storeAcctIdTr)) {
                            $(this).removeClass('hidden')
                            $(this).addClass('show')
                        } else {
                            $(this).removeClass('show')
                            $(this).addClass('hidden');
                        }
                    })
                })
            }
        })
    }

    // 重载店铺表
    function reloadStoremanage() {
        table.reload('amazonrules_table_storemanage', {
            page: {curr: 1}
        })
        reloadAddrules()
    }

    // 验证店铺信息
    function checkStoremanageData() {
        let obj = serializeObject($('#amazonrules_storeadd')), err = ''

        if (obj.stock != '' && obj.stock > 32767) err = '在线库存超过最大限制'
        if (obj.dailyPublishNums != '' && obj.dailyPublishNums > 500) err = '每天刊登量最大500'
        if (obj.storeNameStr == '') err = '店铺名不能为空'
        if (obj.stock == '') err = '在线库存不能为空'
        if (obj.dailyPublishNums == '') err = '每天刊登量不能为空'
        if (obj.publishTime == '') err = '上架开始时间不能为空'

        if (err) {
            layer.alert(err, {icon: 2})
            return 0
        }

        return 1
    }

    // 店铺表格操作监听
    table.on('tool(amazonrules_table_storemanage)', function (obj) {
        var layEvent = obj.event //获得 lay-event 对应的值
        var trdata = obj.data //获得当前行数据
        if (layEvent === 'remark') { //编辑店铺
            toAddStore(1, $('.amazonrules_storemanage_id').val(), trdata)
        } else if (layEvent === 'delete') {
            let popIndex = layer.confirm('确定要删除此店铺吗？', function () {
                getDataamazonRulesDeleteStoreInfo(trdata.id).then(function (result) {
                    layer.msg(result, {icon: 1})
                    layer.close(popIndex)
                    reloadStoremanage()
                }).catch(err => layer.msg(err, {icon: 2}))
            })
        }
    })

    //添加店铺
    $(document).on('click', '#amazonrules_storemanage_storeaddbtn', function () {
        let ruleId = $('.amazonrules_storemanage_id').val().trim()
        toAddStore(0, ruleId)
    })

    function toAddStore(type, ruleId, objData) {
        let popIndex = layer.open({
            title: type == 0 ? '添加店铺' : '设置店铺',
            type: 1, //不加该属性,就会出现[object Object]
            area: ['500px', '70%'],
            btn: ['保存', '关闭'],
            id: '_amazonrules_layer_storeAddEdit',
            content: $('#amazonrules_layer_storeAddEdit').html(),
            success: function () {
                if (type == 0) {
                    laytpl($('#amazonrules_layer_storeaddDemo').html()).render({"publishInterval":2}, function (html) {
                        $('#amazonrules_layer_storeaddView').html(html)
                    })
                } else if (type == 1) {
                    laytpl($('#amazonrules_layer_storeaddDemo').html()).render(objData, function (html) {
                        $('#amazonrules_layer_storeaddView').html(html)
                    })
                }
                form.render()
            },
            yes: function (index, layero) {
                var flag = checkStoremanageData()
                if (flag == 0) return
                let obj = serializeObject($('#amazonrules_storeadd'))

                if (type == 0) {
                    obj.ruleId = ruleId
                    getDataamazonRulesSetStoreForRule(obj).then(function (result) {
                        layer.msg(result, {icon: 1})
                        layer.close(popIndex)
                        reloadStoremanage()
                    }).catch(err => layer.msg(err, {icon: 2}))
                } else if (type == 1) {
                    obj.id = objData.id
                    getDataamazonRulesEditStoreInfo(obj).then(function (result) {
                        layer.msg(result, {icon: 1})
                        layer.close(popIndex)
                        reloadStoremanage()
                    }).catch(err => layer.msg(err, {icon: 2}))
                }
            }
        })
    }

    // 更新规则状态
    form.on('switch(orderDownloadStatus)', function (data) {
        let id = data.value,
            status = data.elem.checked == true ? 1 : 0
        let checked = data.elem.checked
        let popIndex = layer.confirm('确定要修改此规则状态吗？', function () {
            getDataamazonRulesUpdateStatus({'id': id, 'status': checked}).then(function (result) {
                layer.msg(result, {icon: 1})
                $('#amazonrules_searchBtn').click()
                layer.close(popIndex)
            }).catch(err => {
                layer.msg(err, {icon: 2})
                $('#amazonrules_searchBtn').click()
            })
        }, function () {
            data.elem.checked = !checked
            form.render()
        })
    })

    //导出店铺
    $(document).off('click','#amazonrules_storemanage_exportbtn').on('click', '#amazonrules_storemanage_exportbtn', function () {
        let ruleId = layui.table.cache["amazonrules_table_storemanage"].map(item=> item.id)

        transBlob({
            url: ctx + `/amazonAutoListingRuleStore/exportData`,
            formData: JSON.stringify(ruleId),
            contentType: 'application/json',
            fileName: `amazon规则店铺${Date.now()}`,
        }, 'POST').then(function (result) {
            loading.hide()
        }).catch(function (err) {
            layer.msg(err.message, {icon: 2})
        })
    })

    //批量移除店铺
    $(document).on('click', '#amazonrules_storemanage_removebtn', function () {
        let ruleId = $('.amazonrules_storemanage_id').val().trim()
        let popIndex = layer.open({
            title: '批量操作',
            type: 1, //不加该属性,就会出现[object Object]
            area: ['500px', '50%'],
            btn: ['保存', '关闭'],
            id: '_amazon_layer_removestore',
            content: $('#amazon_layer_removestore').html(),
            success: function () {
                form.render()
            },
            yes: function (index, layero) {
                let storeAcctNames = $('#amazon_layer_removestore_form .allStoreName').val()
                let obj = {}
                obj.ruleId = ruleId
                obj.storeNameStr = storeAcctNames
                // let arr = storeAcctNames.split(/[(\r\n)\r\n]+/).filter((s) => {
                //     return s && s.trim();
                // });

                if (storeAcctNames == '') {
                    layer.msg('请输入店铺名', { icon: 2 })
                } else {
                    getDataamazonRulesBatchRemoveStores(obj).then(function (data) {
                        layer.msg(data, {icon: 1})
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

    //初始化amazon站点请求
    function amazonrules_initAmazonSiteAjax() {
        // return commonReturnPromise({
        //     type: 'post',
        //     url: ctx + '/onlineProductAmazon/getAllAmazonSite.html',
        // })
        let arr =[{"siteId":"US","siteName":"美国"},
            {"siteId":"CA","siteName":"加拿大"},
            {"siteId":"GB","siteName":"英国"},
            {"siteId":"DE","siteName":"德国"},
            {"siteId":"FR","siteName":"法国"},
            {"siteId":"JP","siteName":"日本"},
            {"siteId":"AU","siteName":"澳大利亚"}]
        return arr
    }

    //渲染开发类型,商品标签和物流属性,商品归属人
    function newpublishRenderSelect() {
        return commonReturnPromise({
            url: '/lms/fyndiq/new/listing/manage.html'
        })
    }

    // 规则-修改
    function getDataamazonRulesEditInfo(obj) {
        return commonReturnPromise({
            url: ctx + `/amazonAutoListingRule/saveEditRule`,
            type: 'post',
            contentType: 'application/json',
            params: JSON.stringify(obj)
        })
    }

    // 规则-批量开启
    function getDataamazonRulesBatchOpen(obj) {
        return commonReturnPromise({
            url: ctx + `/amazonAutoListingRule/batchOpen`,
            type: 'post',
            contentType: 'application/json',
            params: JSON.stringify(obj)
        })
    }

    // 规则-批量关闭
    function getDataamazonRulesBatchClose(obj) {
        return commonReturnPromise({
            url: ctx + `/amazonAutoListingRule/batchClose`,
            type: 'post',
            contentType: 'application/json',
            params: JSON.stringify(obj)
        })
    }

    // 规则-复制
    function getDataamazonRulesCopyRule(obj) {
        return commonReturnPromise({
            url: ctx + `/amazonAutoListingRule/copyRule`,
            type: 'get',
            params:obj
        })
    }

    // // 规则详情
    // function getDataamazonRulesGetRule(id) {
    //     return commonReturnPromise({
    //         url: ctx + `/amazon/amazonAutoListingRuleController/rule/get/${id}`,
    //         type: 'get',
    //     })
    // }

    // 规则-删除
    function getDataamazonRulesDelete(id) {
        return commonReturnPromise({
            url: ctx + `/amazonAutoListingRule/deleteRule`,
            type: 'GET',
            params: {
                'id': id
            }
        })
    }

    // 规则-修改状态
    function getDataamazonRulesUpdateStatus(obj) {
        return commonReturnPromise({
            url: ctx + `/amazonAutoListingRule/editStatus`,
            type: 'get',
            params: {
                "id":obj.id,
                'status': obj.status
            }
        })
    }

    // 规则-新增规则
    function getDataamazonRulesAddRule(obj) {
        return commonReturnPromise({
            url: ctx + `/amazonAutoListingRule/addRule`,
            type: 'post',
            contentType: 'application/json',
            params: JSON.stringify(obj)
        })
    }

    // 店铺-为自动刊登规则设置店铺
    function getDataamazonRulesSetStoreForRule(obj) {
        return commonReturnPromise({
            url: ctx + `/amazonAutoListingRuleStore/addStore`,
            type: 'post',
            contentType: 'application/json',
            params: JSON.stringify(obj)
        })
    }

    // // 店铺-刊登规则下的某个店铺详情
    // function getDataamazonRulesGetStore(id) {
    //     return commonReturnPromise({
    //         url: ctx + `/amazon/amazonAutoListingRuleStoreController/store/get/${id}`,
    //         type: 'get',
    //     })
    // }

    // 店铺-修改某一个规则下的店铺信息
    function getDataamazonRulesEditStoreInfo(obj) {
        return commonReturnPromise({
            url: ctx + `/amazonAutoListingRuleStore/addEditInfo`,
            type: 'POST',
            contentType: 'application/json',
            params: JSON.stringify(obj)
        })
    }

    // 店铺-删除规则下的店铺
    function getDataamazonRulesDeleteStoreInfo(id) {
        return commonReturnPromise({
            url: ctx + `/amazonAutoListingRuleStore/delete?id=${id}`,
            type: 'GET'
        })
    }

    // 店铺-批量移除店铺
    function getDataamazonRulesBatchRemoveStores(obj) {
        return commonReturnPromise({
            url: ctx + `/amazonAutoListingRuleStore/batchDelete`,
            type: 'DELETE',
            params: obj
        })
    }
})

//初始化amazon商品类目
function initAmazonCateAjax() {
    return commonReturnPromise({
        url: ctx + "/prodcate/listCategoryTree",
    })
}

function initAmazonCateTree() {
    //左侧类目tree
    return new Promise(function (resolve) {
        initAmazonCateAjax()
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
                                        amazonCateTree.setChkDisabled(
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
                                var childrenIds = getAmazonChildren([], treeNode)
                                for (var i = 0; i < childrenIds.length; i++) {
                                    var node = amazonCateTree.getNodeByParam("value", childrenIds[i])
                                    amazonCateTree.checkNode(node, treeNode.checked, false, true)
                                }
                            }
                        },
                    },
                }
                setting.check.chkboxType = {
                    Y: "s",
                    N: "s",
                }
                amazonCateData = result
                var t = $("#amazonrulesCateTree")
                t = $.fn.zTree.init(t, setting, amazonCateData)
                amazonCateTree = $.fn.zTree.getZTreeObj("amazonrulesCateTree")
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
function getAmazonChildren(values, treeNode) {
    values.push(treeNode.value)
    if (treeNode.isParent) {
        for (var obj in treeNode.data) {
            getAmazonChildren(values, treeNode.data[obj])
        }
    }
    return values
}


function amazonRules_inputInt(event){
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
