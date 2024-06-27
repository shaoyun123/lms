let shopeeCateData
let shopeeCateTree
layui.use(['admin', 'form', 'layer', 'formSelects', 'element', 'table', 'laypage', 'tree', 'laydate','upload','layCascader'], function () {
    var admin = layui.admin,
        form = layui.form,
        table = layui.table,
        layer = layui.layer,
        formSelects = layui.formSelects,
        element = layui.element,
        laydate = layui.laydate,
        laytpl = layui.laytpl,
        laypage = layui.laypage,
        tree = layui.tree,
        upload = layui.upload,
        layCascader = layui.layCascader
    $ = layui.$

    form.render()

    render_hp_orgs_users('#shopeerules_searchForm')//渲染部门销售员店铺三级联动

    // 初始化shopee创建人
    commonReturnPromise({
        url: `/lms/shopee/shopeeAutoListingRuleController/rule/createUserList`,
    }).then(function (result) {
        commonRenderSelect('shopeerules_creatorId', result.filter(n => n), {
            name: 'userName',
            code: 'id'
        }).then(() => form.render())
    }).catch(err => layer.msg(err, { icon: 2 }))

    // 初始化站点
    shopeerules_initAmazonSiteAjax()
        .then(data => {
            let siteData = data.siteList.map(item => ({ ...item, value: item.code }))
            formSelects.data('shopeerules_site_sel', 'local', { arr: siteData })
        })
        .then(() => form.render())
        .catch(err => layer.msg(err, { icon: 2 }))
    // 类目
    shopeerules_ShowCateCascader()
    let shopeerules_cateCascader = null
    let shopeerules_cateCascaderList = []
    let shopeerules_cnscCateCascader = null
    let shopeerules_cnscCateCascaderList = []
    function shopeerules_ShowCateCascader() {
    Promise.all([
        commonReturnPromise({
            url: "/lms/prodcate/listCategoryTree",
        }),
        commonReturnPromise({
            url: "/lms/shopee/shopeeCate/cnscCategoryTree",
        }),
    ])
        .then(res => {
            shopeerules_cateCascaderList = res[0]
            shopeerules_cnscCateCascaderList = res[1]
            shopeerules_cateCascader = layCascader({
                elem: "#shopeerules_cateIds",
                clearable: true,
                filterable: true,
                collapseTags: true,
                options: res[0],
                props: {
                multiple: true,
                label: "title",
                value: "value",
                children: "data",
                checkStrictly: false,
                },
            });
            shopeerules_cnscCateCascader = layCascader({
                elem: "#shopeerules_cnscCateIds",
                clearable: true,
                filterable: true,
                collapseTags: true,
                options: res[1],
                props: {
                multiple: true,
                label: "label",
                value: "value",
                children: "children",
                checkStrictly: false,
                },
            })
        })
        .catch(err => {
            layer.msg(err, { icon: 2 })
        })
    }

    // 搜索
    $('#shopeerules_searchBtn').on('click', function () {
        shopeerules_tableRender()
    })

    // 清空
    $('#shopeerules_resetBtn').on('click', function () {
        shopeerules_cateCascader.setValue()
        shopeerules_cnscCateCascader.setValue()
    })

    function shopeerules_tableRender () {
        const tabStatus = $('#shopee_rules_tab_header').find('.layui-this').data('status')
        var whereData = serializeObject($('#shopeerules_searchForm')) // 获取form表单数据
        // 如果没有选择店铺  如果部门没选值，销售人员没选
        let orgId = $('#shopeeRules_depart_sel').val()
        let salesmanId = $('#shopeeRules_salesman_sel').val()
        if (whereData.storeAcctIdList == '' && (orgId || salesmanId)) {
            whereData.storeAcctIdList = $('#shopeeRules_store_sel').attr('acct_ids') == '' ? [99999]
                : $('#shopeeRules_store_sel').attr('acct_ids').split(',')

        } else if (whereData.storeAcctIdList == '' && orgId == '' && salesmanId == '') {
            whereData.storeAcctIdList = []
        } else {
            whereData.storeAcctIdList = whereData.storeAcctIdList.split(',')
        }
        if(tabStatus==2){
            whereData.status = tabStatus
        }
        if(whereData.status!==''){
            whereData.status = Number(whereData.status)
        }
        whereData.ruleIds = whereData.ruleIds.length ? whereData.ruleIds.split(',').map(Number) : []
        // 站点
        whereData.siteIdList = whereData.siteIdList == '' ? [] : whereData.siteIdList.split(',')
        // OA类目
        whereData.cateIds = JSON.parse($('#shopeerules_cateIds').val() || '[]')
        // CNSC类目
        whereData.cateIdsCNSC = JSON.parse($("#shopeerules_cnscCateIds").val() || "[]")
        let mainCols = [[
            { type:'checkbox', width:40 },
            { field: 'status', title: '状态', templet: '#shopeerules_tabletemplet_type', width:80 },
            { field: 'id', title: '规则ID' },
            { field: 'ruleName', title: '规则名称' },
            { field: 'saleSite', title: '站点', width:80 },
            {
                field: 'storeNums',
                title: '应用店铺数量',
                templet: '#shopeerules_tabletemplet_count'
            },
            { field: 'executionWeekTime', title: '执行日期（每周）' },
            { field: 'categoryLevelAndName', title: 'OA类目', width:300, templet: '<div class="taLeft"><div class="line-feet">{{d.categoryLevelAndName ||""}}</div></div>'},
            { field: 'categoryLevelAndNameCnsc', title: 'CNSC类目', width:300, templet: d=>{
                let showInfo = ''
                if(d.cnscAssiDataOnly){
                    showInfo = '<span class="blue ml10">仅取值自商品补充信息</span>'

                }
                if(d.categoryLevelAndNameCnsc && d.categoryLevelAndName){
                    return `<div class="taLeft"><div>${d.cateAndOr ? 'and' : 'or'}${showInfo}</div><div class="line-feet">${d.categoryLevelAndNameCnsc ||""}</div></div>`
                }
                return `<div class="taLeft"><div class="line-feet">${d.categoryLevelAndNameCnsc ||""}</div></div>`
            }},
            { field: 'remark', title: '备注' },
            { field: 'creator', title: '创建人' },
            { field: 'modifier', title: '修改人' },
            { title: '操作', align: 'center', toolbar: '#shopeerules_tabletemplet_optionbtn' }
        ]]
        let delCols = [[
            { field: 'status', title: '状态', templet: '#shopeerules_tabletemplet_Deltype',width:80 },
            { field: 'id', title: '规则ID' },
            { field: 'ruleName', title: '规则名称' },
            { field: 'saleSite', title: '站点', width:80 },
            {
                field: 'storeNums',
                title: '应用店铺数量',
                templet: '#shopeerules_tabletemplet_count'
            },
            { field: 'executionWeekTime', title: '执行日期（每周）' },
            { field: 'categoryLevelAndName', title: 'OA类目', width:300, templet: '<div class="taLeft"><div class="line-feet">{{d.categoryLevelAndName ||""}}</div></div>'},
            { field: 'categoryLevelAndNameCnsc', title: 'CNSC类目', width:300, templet: d=>{
                let showInfo = ''
                if(d.cnscAssiDataOnly){
                    showInfo = '<span class="blue ml10">仅取值自商品补充信息</span>'

                }
                if(d.categoryLevelAndNameCnsc && d.categoryLevelAndName){
                    return `<div class="taLeft"><div>${d.cateAndOr ? 'and' : 'or'}${showInfo}</div><div class="line-feet">${d.categoryLevelAndNameCnsc ||""}</div></div>`
                }
                return `<div class="taLeft"><div class="line-feet">${d.categoryLevelAndNameCnsc ||""}</div></div>`
            }},
            { field: 'remark', title: '备注' },
            { field: 'creator', title: '创建人' },
            { field: 'modifier', title: '修改人' },
            { title: '操作', align: 'center', toolbar: '#shopeerules_tabletemplet_deloptionbtn' }
        ]]
        // 规则表
        var tableIns = table.render({
            elem: '#shopeerules_table_addrules',
            method: 'post',
            url: ctx + '/shopee/shopeeAutoListingRuleController/rule/queryPage',
            where: whereData,
            contentType: 'application/json',
            cols: tabStatus == 2 ? delCols : mainCols,
            id: 'shopeerules_table_addrules',
            page: true,
            limits: [100, 200, 500],
            limit: 100,
            done: function (res, curr, count) {
                $('#shopee_rules_tab_header').find('.layui-this span').text(count)
            }
        })
    }

    // 验证规则信息
    function checkAddrulesData () {
        let obj = serializeObject($('#shopeerules_form_addrules')),
            err = ''

        if (obj.ruleType == 2 && obj.listingTemplateNum == '') err = '刊登模板数不能为空'
        if (obj.ruleType == 2 && obj.listingStoreNum == '') err = '每个模板刊登店铺数不能为空'
        if (obj.ruleType == '' || obj.ruleType == undefined) err = '请选择刊登规则'
        if (obj.executionWeekTime == '' || obj.executionWeekTime == undefined) err = '刊登日期不能为空'
        if (obj.saleSite == '' || obj.saleSite == undefined) err = 'Shopee站点不能为空'
        if (obj.ruleName == '') err = '规则名称不能为空'

        if (err) {
            layer.alert(err, { icon: 2 })
            return 0
        }

        return 1
    }

    // 重载规则表
    function reloadAddrules () {
        table.reload('shopeerules_table_addrules', {
            page: { curr: 1 }
        })
    }

    // 规则表格操作监听
    table.on('tool(shopeerules_table_addrules)', function (obj) {
        var layEvent = obj.event //获得 lay-event 对应的值
        var trdata = obj.data //获得当前行数据
        let xtree
        if (layEvent === 'remark') {
            toShopeeRules(1, trdata)
        } else if (layEvent === 'delete') {
            let popIndex = layer.confirm('确定要删除此条规则吗？', function () {
                getDataShopeeRulesDelete(trdata.id).then(function (result) {
                    layer.msg(result, { icon: 1 })
                    reloadAddrules()
                    layer.close(popIndex)
                }).catch(err => layer.msg(err, { icon: 2 }))
            })
        } else if (layEvent === 'shopeerules_tabletemplet_count') {
            // 应用店铺数量弹框
            let ruleId = trdata.id,
                rulename = trdata.ruleName
            let popIndex = layer.open({
                title: '设置店铺',
                type: 1, //不加该属性,就会出现[object Object]
                area: ['80%', '70%'],
                content: $('#shopeerules_layer_storemanage').html(),
                success: function () {
                    render_hp_orgs_users('#shopeerules_storemanage_searchForm')//渲染部门销售员店铺三级联动
                    $('.shopeerules_storemanage_name').text(rulename)
                    $('.shopeerules_storemanage_id').val(ruleId)
                    handleStoremanageTable(ruleId)
                    const tabStatus = $('#shopee_rules_tab_header').find('.layui-this').data('status')
                    if(tabStatus == 2 ){
                        $('.shopeerules_showNomal').hide()
                    }
                    form.render()
                    // 一键应用
                    $('#shopeeRules_batchSetDailyListingBtn').click(function () {
                        var checkStatus = table.checkStatus('shopeerules_table_storemanage'),
                            data = checkStatus.data
                        if (data.length === 0) {
                            layer.msg('请选择需要应用的店铺')
                            return
                        }
                        const showTr = $('#shopeerules_table_storemanage')
                            .next()
                            .find('table')
                            .find('tbody')
                            .find('tr[class=show]')
                        if (checkStatus.isAll && showTr.length) {
                            // 经过隐藏和显示
                            const showStoreAcctIdArr = []
                            showTr.find('td[data-field="storeAcctId"]').each(function () {
                                showStoreAcctIdArr.push(Number($(this).text()))
                            })
                            data = data.filter((item) =>
                                showStoreAcctIdArr.includes(Number(item.storeAcctId))
                            )
                        }
                        let idMap = {}
                        for (let i = 0; i < data.length; ++i) {
                            idMap[data[i].id] = 1
                        }
                        // 一键应用值
                        let toSetValue = $('#shopeeRules_batchSetDailyListing').val()
                        if (!isInteger(toSetValue)) {
                            layer.msg('请输入一个正整数')
                            return
                        }
                        console.log(11)
                        // 获取表格元素
                        let tableEle = $('#shopeerules_table_storemanage').next('.layui-table-view')
                        let tableData = layui.table.cache.shopeerules_table_storemanage
                        for (let i = 0; i < tableData.length; ++i) {
                            if (!idMap[tableData[i].id]) {
                                continue
                            }
                            // 更新缓存值
                            tableData[i].dailyPublishNums = toSetValue
                            // 更新展示值
                            tableEle.find('.shopeeRules_IdInp' + '[value=' + tableData[i].id + ']')
                                .closest('tr').find('[data-field=dailyPublishNums] .layui-table-cell').text(toSetValue)
                        }
                    })

                    // 输入监听
                    table.on('edit(shopeerules_table_storemanage)', function (obj) {
                        var value = obj.value //得到修改后的值
                            , data = obj.data //得到所在行所有键值
                            , field = obj.field; //得到字段
                        // 修改后，选中当前行
                        // let curTr = $(this).closest('tr')
                        // curTr.find('.layui-form-checkbox:eq(0):not(.layui-form-checked)').click()
                        // 调接口保存当前行
                        if (!value || !isInteger(value) || value < 0) {
                            layer.msg('每天刊登量必须为正整数')
                            return
                        }
                        if (value > 3000) {
                            layer.msg('每天刊登量最大为3000')
                            return
                        }
                        let params = [{
                            id: data.id,
                            dailyPublishNums: value
                        }]
                        oneAjax.post({
                            url: '/shopee/shopeeAutoListingRuleStoreController/store/editStoreInfoList',
                            data: params,
                            success: function (res) {
                                if (res.code === '0000') {
                                    layer.msg('修改成功', { icon: 1 })
                                }
                            }
                        })
                    })
                    // 批量保存
                    $('#shopeerules_storemanage_batchSaveBtn').click(function () {
                        var checkStatus = table.checkStatus('shopeerules_table_storemanage'),
                            data = checkStatus.data
                        if (data.length === 0) {
                            layer.msg('请选择需要保存的店铺')
                            return
                        }
                        const showTr = $('#shopeerules_table_storemanage')
                            .next()
                            .find('table')
                            .find('tbody')
                            .find('tr[class=show]')
                        if (checkStatus.isAll && showTr.length) {
                            // 经过隐藏和显示
                            const showStoreAcctIdArr = []
                            showTr.find('td[data-field="storeAcctId"]').each(function () {
                                showStoreAcctIdArr.push(Number($(this).text()))
                            })
                            data = data.filter((item) =>
                                showStoreAcctIdArr.includes(Number(item.storeAcctId))
                            )
                        }
                        let dtoList = []

                        for (let i = 0; i < data.length; ++i) {
                            if (!data[i].dailyPublishNums || !isInteger(data[i].dailyPublishNums) || data[i].dailyPublishNums < 0) {
                                layer.msg('每天刊登量必须为正整数')
                                return
                            }
                            if (data[i].dailyPublishNums > 3000) {
                                layer.msg('每天刊登量最大为3000')
                                return
                            }
                            dtoList.push({
                                id: data[i].id,
                                dailyPublishNums: data[i].dailyPublishNums
                            })
                        }
                        console.log(dtoList)
                        oneAjax.post({
                            url: '/shopee/shopeeAutoListingRuleStoreController/store/editStoreInfoList',
                            data: dtoList,
                            success: function (res) {
                                if (res.code === '0000') {
                                    layer.msg('修改成功', { icon: 1 })
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
                content: $('#shopeeRules_addCopy_layer').html(),
                success: () => {
                    // 初始化站点
                    request.sendAjax('/shopee/onlineProductShopee/getShopeeOnlineEnum.html', null, res => {
                        let siteData = res.data.siteList.map(e => ({ ...e, value: e.code }))
                        formSelects.data('shopeeRules_addCopy_salesSite_sel', 'local', { arr: siteData })
                        form.render()
                    }, 'POST')
                },
                yes: () => {
                    let salesSites = []
                    formSelects.value('shopeeRules_addCopy_salesSite_sel').forEach(e => {
                        let obj = { saleSite: e.code, siteName: e.name }
                        salesSites.push(obj)
                    })
                    let data = {
                        id: trdata.id,
                        salesSites
                    }
                    request.sendAjax('/shopee/shopeeAutoListingRuleController/rule/addCopy', JSON.stringify(data), res => {
                        layer.msg('复制成功', { icon: 1 })
                        shopeerules_tableRender()
                        layer.close(index)
                    }, 'POST')
                }
            })
        }else if(layEvent === 'readonly'){
            // 查看
            toShopeeRules(2, trdata)
        }else if(layEvent === 'ruleDel'){
            let popIndex = layer.confirm('刊登规则删除后，将无法进行编辑，确定继续删除此规则吗？', function () {
                getDataShopeeRulesDelRule(trdata.id).then(function (result) {
                    layer.close(popIndex)
                    layer.msg(result||'操作成功',{icon:1})
                    shopeerules_tableRender()
                }).catch(err => layer.msg(err, { icon: 2 }))
            })
        }
    })

    // 类目属性全选或全不选
    form.on('checkbox(shopee_rule_cateAllchecked)', function (data) {
        var valArr = JSON.parse(JSON.stringify(cateXTreeForSupplier))
        if (data.elem.checked) {
            iterateValArr(valArr, true)
            shopee_reload_CateTree(valArr, data.elem.checked)
        } else {
            iterateValArr(valArr, false)
            shopee_reload_CateTree(valArr, data.elem.checked)
        }
    })

    // 遍历得出全选的值
    function iterateValArr (arr, isChecked) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].data.length) {
                arr[i].checked = isChecked
                iterateValArr(arr[i].data, isChecked)
            } else {
                arr[i].checked = isChecked
            }
        }
    }

    function shopee_reload_CateTree (valArr, isChecked) {
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
                if ($('#xtree1').find('input[name=shopee-allchecked-cate]').length) {
                    saveXtreeData(xtree, $('#xtreeSearchHidden'), $('#xtreeSearchDiv'))
                    var categoryIdListLength = serializeObject($('#shopeerules_form_addrules')).categoryIdList.split(',').length
                    var count = iterateArrLength(0, cateXTreeForSupplier)
                    categoryIdListLength == count ? $('#xtree1').find('input[name=shopee-allchecked-cate]').prop('checked', true)
                        : $('#xtree1').find('input[name=shopee-allchecked-cate]').prop('checked', false)
                    form.render()
                }
            }
        })
        let allCheckdom = `<input type="checkbox" name="shopee-allchecked-cate" lay-skin="primary" id="" value="0" title="全选" ${isChecked ? 'checked' : ''} lay-filter="shopee_rule_cateAllchecked">`
        $('#xtree1').prepend(allCheckdom)
        form.render()
    }

    // 添加规则弹框
    $('#shopeerules_btn_addrules').click(function () {
        toShopeeRules(0)
    })

    // 下载模板
    // $('#shopeerules_btn_downLoad').click(function () {
    //     // transBlob({
    //     //     url: ctx+'/shopee/shopeeAutoListingRuleController/rule/downloadTemplate',
    //     //     fileName:'刊登规则模板.xlsx'
    //     //   },'get')
    //     //     .then(res=>layer.msg('下载开始',{icon:1}))
    //     window.open(
    //         ctx + "/static/templet/ShopeeListingRuleStoreTemplate.xlsx",
    //         "_blank"
    //       )
    // })

    // 导入修改
    upload.render({
        elem: "#shopeerules_btn_exportEdit", //绑定元素
        url: ctx + "/shopee/shopeeAutoListingRuleController/rule/importEdit", //上传接口
        accept: "file",
        field: "file",
        before: function () {
          loading.show()
        },
        done: function (res) {
          loading.hide()
          let str = `<div style="white-space: break-spaces;">${res.msg}</div>`
          if (res.code === "0000") {
            layer.alert(str, {
                icon: 1,
                title: '操作结果'
              })
          } else {
            layer.alert(str, {
                icon: 2,
                title: '操作结果'
              })
          }
          //上传完毕回调
          $('#shopeerules_searchBtn').click()
        },
        error: function (res) {
          loading.hide()
          layer.msg("上传失败", { icon: 2 })
          //请求异常回调
        },
      })

    function toShopeeRules (type, obj) {
        // let xtree
        let oaCateCascader = null
        let cnscCateCascader = null
        let popIndex = layer.open({
            title: type == 2 ? '查看' : type == 0 ? '添加规则' : '编辑规则',
            type: 1, //不加该属性,就会出现[object Object]
            area: ['1000px', '70%'],
            btn: type == 2 ? '' : ['保存', '关闭'],
            id: '_shopeerules_layer_addrulesLayerCreatAndEdit',
            content: $('#shopeerules_layer_addrulesLayerCreatAndEdit').html(),
            success: function () {
                if (type == 0) {
                    laytpl($('#shopeerules_layer_addrulesDemo').html()).render({}, function (html) {
                        $('#shopeerules_layer_addrulesView').html(html)
                    })
                } else {
                    laytpl($('#shopeerules_layer_addrulesDemo').html()).render(obj, function (html) {
                        $('#shopeerules_layer_addrulesView').html(html)
                    })
                }
                Promise.all([shopeerules_initAmazonSiteAjax(), newpublishRenderSelect()]).then(function (res) {
                    //开发类型[数组对象]
                    commonRenderSelect('devType', res[1].devTypeEnums).then(() => {
                        formSelects.render('devType')
                        if (obj && obj.devType) {
                            let devType = obj.devType.split(',')
                            formSelects.value('devType', devType)
                        }
                    }).catch(err => layer.msg(err, { icon: 2 }))
                    //商品标签prodTagMap[数组对象]
                    commonRenderSelect('prodAttrList', res[1].prodTagMap, {
                        name: 'name',
                        code: 'name'
                    }).then(() => {
                        formSelects.render('prodAttrList')
                        if (obj && obj.prodAttrList) {
                            let prodAttrList = obj.prodAttrList.split(',')
                            formSelects.value('prodAttrList', prodAttrList)
                        }
                    }).catch(err => layer.msg(err, { icon: 2 }))
                    //物流属性logisAttrEnums[数组]
                    commonRenderSelect('logisAttrList', res[1].logisAttrEnums).then(() => {
                        formSelects.render('logisAttrList')
                        if (obj && obj.logisAttrList) {
                            let logisAttrList = obj.logisAttrList.split(',')
                            formSelects.value('logisAttrList', logisAttrList)
                        }
                    }).catch(err => layer.msg(err, { icon: 2 }))
                    // 站点
                    commonRenderSelect('saleSite', res[0].siteList, {
                        name: 'name',
                        code: 'code'
                    }).then(() => {
                        $('#shopeerules_form_addrules #saleSite').val(obj && obj.saleSite ? obj.saleSite : '')
                        form.render()
                    }).catch(err => layer.msg(err, { icon: 2 }))

                    // OA类目
                    oaCateCascader = layCascader({
                        elem: '#shopeerules_form_addrules_oaCate',
                        clearable: true,
                        filterable: true,
                        collapseTags: true,
                        options: shopeerules_cateCascaderList,
                        props:{
                            multiple: true,
                            label: 'title',
                            value: 'value',
                            children: 'data',
                        }
                    })
                    if(obj && obj.categoryIdList){
                        oaCateCascader.setValue(obj.categoryIdList.split(','))
                    };
                    // CNSC类目
                    cnscCateCascader = layCascader({
                        elem: '#shopeerules_form_addrules_cnscCate',
                        clearable: true,
                        filterable: true,
                        collapseTags: true,
                        options: shopeerules_cnscCateCascaderList,
                        props:{
                            multiple: true,
                            label: 'label',
                            value: 'value',
                            children: 'children',
                        }
                    })
                    if(obj && obj.categoryIdListCNSC){
                        cnscCateCascader.setValue(obj.categoryIdListCNSC.split(',').map(Number))
                    };

                    if (obj && obj.ruleType == 2) {
                        $('#shopeerules_listingNum').show()
                    } else if (obj && obj.ruleType == 1) {
                        $('#shopeerules_listingNum').hide()
                    }

                    // obj && obj.categoryIdList ? $('#shopeerules_form_addrules input[name="categoryIdList"]').val(obj.categoryIdList) : ''
                    // xtree = alertCateSelectDIV($('#xtreeContentDiv'), $('#xtreeSearchHidden'), $('#xtreeSearchDiv'))

                    // var count = iterateArrLength(0, cateXTreeForSupplier)
                    // var categoryIdListLength = obj && obj.categoryIdList ? obj.categoryIdList.split(',').length : ''
                    // let allCheckdom = `<input type="checkbox" lay-skin="primary" value="0" name="shopee-allchecked-cate" ${categoryIdListLength == count ? 'checked' : ''} title="全选" lay-filter="shopee_rule_cateAllchecked">`
                    // $('#xtree1').prepend(allCheckdom)

                    // 商品类目
                    // initShopeeCateTree().then(function (result) {
                    //     var prodCateIds =
                    //       obj && obj.categoryIdList ? obj.categoryIdList.split(",") : []
                    //     for (var i = 0; i < prodCateIds.length; i++) {
                    //       var node = shopeeCateTree.getNodeByParam("value", prodCateIds[i])
                    //       if (node != null) {
                    //         shopeeCateTree.checkNode(node, true, false, true)
                    //       }
                    //     }
                    //   })

                    form.render()
                }).catch(err => layer.msg(err, { icon: 2 }))
            },
            yes: function (index, layero) {
                // 类目树
                // let chkedNodeId = shopeeCateTree.getCheckedNodes(true)
                // let autoPublishCateIds = chkedNodeId
                //     .map(function (item) {
                //         return item.value
                //     })
                //     .join()
                // if (!autoPublishCateIds.length) return layer.msg("站点类目不能为空")
                // 校验
                var flag = checkAddrulesData()
                if (flag == 0) return
                // 校验通过，提交数据
                let submitObj = serializeObject($('#shopeerules_form_addrules'))
                // 类目
                // OA类目
                submitObj.categoryIdList = JSON.parse($('#shopeerules_form_addrules_oaCate').val() || '[]').join()
                // CNSC类目
                submitObj.categoryIdListCNSC = JSON.parse($("#shopeerules_form_addrules_cnscCate").val() || "[]").join()
                // 校验：未选中任一类目时点击保存按钮，提示：刊登类目不能为空；
                if(!submitObj.categoryIdList && !submitObj.categoryIdListCNSC){
                    return layer.msg("刊登类目不能为空")
                }
                // submitObj.categoryIdList = autoPublishCateIds
                submitObj.siteName = $.trim($('#shopeerules_form_addrules select[name="saleSite"] option:selected').text())
                submitObj.devType = formSelects.value('devType', 'val').join(',').trim()
                submitObj.logisAttrList = formSelects.value('logisAttrList', 'val').join(',').trim()
                submitObj.prodAttrList = formSelects.value('prodAttrList', 'val').join(',').trim()
                // 模板SKU
                if(submitObj.prodPSkuListStr){
                    submitObj.prodPSkuListStr = submitObj.prodPSkuListStr.replaceAll('，',',').split(',').filter(item=>!!item).join()
                }
                // 仅取值自商品补充信息
                submitObj.cnscAssiDataOnly = $('#shopeerules_form_addrules').find('input[name="cnscAssiDataOnly"][value=true]').prop('checked')
                // 转数字
                submitObj.preAvailableStockType = Number(submitObj.preAvailableStockType)
                submitObj.preAvailableStockNum = submitObj.preAvailableStockNum ? Number(submitObj.preAvailableStockNum) : ''
                if (submitObj.ruleType == 1) {
                    submitObj.listingTemplateNum = ''
                    submitObj.listingStoreNum = ''
                }

                delete submitObj.undefined
                if (type == 0) {
                    getDataShopeeRulesAddRule(submitObj).then(function (result) {
                        layer.msg(result.msg || '保存成功', { icon: 1 })
                        layer.close(popIndex)
                        reloadAddrules()
                    }).catch(err => layer.msg(err, { icon: 2 }))
                } else {
                    let newObj = { ...obj, ...submitObj }
                    getDataShopeeRulesEditInfo(newObj).then(function (result) {
                        layer.msg(result.msg || '保存成功', { icon: 1 })
                        layer.close(popIndex)
                        reloadAddrules()
                    }).catch(err => layer.msg(err, { icon: 2 }))
                }
            },
            end: function () {
                shopeeCateData = undefined;
                // shopeeCateTree.destroy();
                oaCateCascader = null
                cnscCateCascader = null
            }
        })
    }

    // 监听规则弹窗的刊登规则选择
    form.on('radio(shopeerules_addRule_ruleType)', function (data) {
        if (data.value == 1) {
            $('#shopeerules_listingNum').hide()
        } else if (data.value == 2) {
            $('#shopeerules_form_addrules input[name=listingTemplateNum]').val('')
            $('#shopeerules_form_addrules input[name=listingStoreNum]').val('')
            $('#shopeerules_listingNum').show()
        }
    })

    //店铺表
    function handleStoremanageTable (ruleId) {
        var shopeeStoremanageTable = table.render({
            elem: '#shopeerules_table_storemanage',
            method: 'get',
            url: ctx + `/shopee/shopeeAutoListingRuleStoreController/store/list/${ruleId}`, // 店铺列表接口
            cols: [
                [
                    { type: 'checkbox', width: 30 },
                    { field: 'storeAcctId', title: '店铺id' },
                    { field: 'storeAcct', title: '店铺名', width: 180 },
                    { field: 'listingLimit', title: '总额度' },
                    { field: 'canListingCount', title: '可用额度' },
                    { field: 'dailyPublishNums', title: '每天刊登量(可编辑)', edit: 'text', style: 'background-color: #7FFFD4;' },
                    {
                        field: 'autoDelete', title: '自动删除', templet: function (res) {
                            return res.autoDelete == 1 ? '开启' : '关闭'
                        }
                    },
                    { field: 'autoDeleteNum', title: '每天删除数量' },
                    {
                        field: 'autoDeleteGreatListingTime', title: '删除刊登时间', templet: function (res) {
                            return '大于' + res.autoDeleteGreatListingTime + '天'
                        }
                    },
                    {
                        field: 'autoDeleteSalesType', title: '删除销量设置', templet: function (res) {
                            if (res.autoDeleteSalesType == 1) {
                                return '30天销量=0'
                            } else if (res.autoDeleteSalesType == 2) {
                                return '60天销量=0'
                            } else if (res.autoDeleteSalesType == 3) {
                                return '90天销量=0'
                            } else if (res.autoDeleteSalesType == 4) {
                                return '7天销量=0'
                            }
                        }
                    },
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
                    { title: '操作', field:'operation', align: 'center', toolbar: '#shopeerules_tabletemplet_optionbtn' }
                ],
            ],
            id: 'shopeerules_table_storemanage',
            page: true,
            limits: [100, 200, 500],
            limit: 100,
            done: function (res, curr, count) {
                const tabStatus = $('#shopee_rules_tab_header').find('.layui-this').data('status')
                var layFilterIndex = 'LAY-table-' + shopeeStoremanageTable.config.index;
                var tableContainer = $('div[lay-filter="' + layFilterIndex + '"]');
                tableContainer.find('tbody').find('tr td[data-field="operation"]').each(function () {
                    if(tabStatus==2){
                         $(this).find('div button').each(function(){
                            let trEvent = $(this).attr('lay-event')
                            trEvent == 'remark' && $(this).hide()
                            trEvent == 'delete' && $(this).hide()
                         })
                    }
                })
                //  隐藏店铺id
                $("[data-field='storeAcctId']").css('display', 'none');
                //   点击查询，页面table data前端筛选
                $('#shopeerules_storemanage_searchBtn').click(function () {
                    let storeAcctIdLIst = $('#shopeerules_storemanage_store_sel').attr('acct_ids').split(',')
                    let ordId = $('#shopeerules_storemanage_depart_sel').val()
                    let salesmanId = $('#shopeerules_storemanage_salesman_sel').val()
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
    function reloadStoremanage () {
        table.reload('shopeerules_table_storemanage', {
            page: { curr: 1 }
        })
        reloadAddrules()
    }

    // 验证店铺信息
    function checkStoremanageData () {
        let obj = serializeObject($('#shopeerules_storeadd')), err = ''

        if (obj.stock != '' && obj.stock > 32767) err = '在线库存超过最大限制'
        if (obj.dailyPublishNums != '' && obj.dailyPublishNums > 3000) err = '每天刊登量超过最大限制'
        if (obj.storeNameStr == '') err = '店铺名不能为空'
        if (obj.stock == '') err = '在线库存不能为空'
        if (obj.dailyPublishNums == '') err = '每天刊登量不能为空'
        if(obj.publishTime == '') err = '请选择上架开始时间'

        if (err) {
            layer.alert(err, { icon: 2 })
            return 0
        }

        return 1
    }

    // 店铺表格操作监听
    table.on('tool(shopeerules_table_storemanage)', function (obj) {
        var layEvent = obj.event //获得 lay-event 对应的值
        var trdata = obj.data //获得当前行数据
        if (layEvent === 'remark') { //编辑店铺
            toAddStore(1, $('.shopeerules_storemanage_id').val(), trdata)
        } else if (layEvent === 'delete') {
            let popIndex = layer.confirm('确定要删除此店铺吗？', function () {
                getDataShopeeRulesDeleteStoreInfo(trdata.id).then(function (result) {
                    layer.msg(result, { icon: 1 })
                    layer.close(popIndex)
                    reloadStoremanage()
                }).catch(err => layer.msg(err, { icon: 2 }))
            })
        } else if (layEvent === 'readonly') {
            toAddStore(2, $('.shopeerules_storemanage_id').val(), trdata)
        }
    })

    //添加店铺
    $(document).on('click', '#shopeerules_storemanage_storeaddbtn', function () {
        let ruleId = $('.shopeerules_storemanage_id').val().trim()
        toAddStore(0, ruleId)
    })

    function toAddStore (type, ruleId, objData) {
        let popIndex = layer.open({
            title: type == 2 ? '查看' : type == 0 ? '添加店铺' : '设置店铺',
            type: 1, //不加该属性,就会出现[object Object]
            area: ['500px', '70%'],
            btn: type == 2 ? '' : ['保存', '关闭'],
            id: '_shopeerules_layer_storeAddEdit',
            content: $('#shopeerules_layer_storeAddEdit').html(),
            success: function () {
                if (type == 0) {
                    laytpl($('#shopeerules_layer_storeaddDemo').html()).render({}, function (html) {
                        $('#shopeerules_layer_storeaddView').html(html)
                    })
                } else if (type == 1 || type == 2) {
                    laytpl($('#shopeerules_layer_storeaddDemo').html()).render(objData, function (html) {
                        $('#shopeerules_layer_storeaddView').html(html)
                    })
                }
                form.render()
            },
            yes: function (index, layero) {
                var flag = checkStoremanageData()
                if (flag == 0) return
                let obj = serializeObject($('#shopeerules_storeadd'))

                if (type == 0) {
                    obj.ruleId = ruleId
                    getDataShopeeRulesSetStoreForRule(obj).then(function (result) {
                        layer.msg(result, { icon: 1 })
                        layer.close(popIndex)
                        reloadStoremanage()
                    }).catch(err => layer.msg(err, { icon: 2 }))
                } else if (type == 1) {
                    obj.id = objData.id
                    getDataShopeeRulesEditStoreInfo(obj).then(function (result) {
                        layer.msg(result, { icon: 1 })
                        layer.close(popIndex)
                        reloadStoremanage()
                    }).catch(err => layer.msg(err, { icon: 2 }))
                }
            }
        })
    }

    // 更新规则状态
    form.on('switch(orderDownloadStatus)', function (data) {
        let id = data.value,
            status = data.elem.checked == true ? 1 : 0
        let checked = data.elem.checked
        let popIndex = layer.open({
            title: "提示",
            icon: 7,
            btn: ["确认",'取消'],
            content: '确定要修改此规则状态吗？',
            yes: function () {
                getDataShopeeRulesUpdateStatus({ 'id': id, 'status': status }).then(function (result) {
                    layer.msg(result, { icon: 1 })
                    $('#shopeerules_searchBtn').click()
                    layer.close(popIndex)
                }).catch(err => {
                    layer.msg(err, { icon: 2 })
                    $('#shopeerules_searchBtn').click()
                })
            },
            btn2:function(){
                data.elem.checked = !checked
                form.render()
            },
            cancel: function () {
                data.elem.checked = !checked
                form.render()
            },
          })
    })

    // tab
    element.on('tab(shopee_rules_tab)', function (obj) {
        let status = $(this).data('status')
        if(status == 2){
            $('.shopeerules_showNomal').hide()
        }else{
            $('.shopeerules_showNomal').show()
        }
        $('#shopeerules_searchBtn').click()
    })

    // 批量操作
    form.on('select(shopee_rules_batchOp)',function(obj){
        const { value } = obj
        const { data } = table.checkStatus('shopeerules_table_addrules')
        let ids = data.map(item=>Number(item.id)).join()
        if(!data.length) return layer.msg('请选择数据',{icon:7})
        if(value==='0'){ // 开启
            getDataShopeeRulesBatchStatus({ids,status:true})
            .then(res=>{
                layer.msg('操作成功',{icon:1})
                $('#shopeerules_searchBtn').click()
            })
        }else if(value==='1'){ // 关闭
            getDataShopeeRulesBatchStatus({ids,status:false})
            .then(res=>{
                layer.msg('操作成功',{icon:1})
                $('#shopeerules_searchBtn').click()
            })
        }
    })

    //导出店铺
    $(document).on('click', '#shopeerules_storemanage_exportbtn', function () {
        let ruleId = $('.shopeerules_storemanage_id').val().trim()
        let targetData = {}
        targetData.ruleId = ruleId
        transBlob({
            url: ctx + `/shopee/shopeeAutoListingRuleStoreController/store/exportStoreDetails`,
            formData: JSON.stringify(targetData),
            contentType: 'application/json',
            fileName: `Shopee规则店铺${Date.now()}`,
        }, 'POST').then(function (result) {
            loading.hide()
        }).catch(function (err) {
            layer.msg(err.message, { icon: 2 })
        })
    })

    //批量移除店铺
    $(document).on('click', '#shopeerules_storemanage_removebtn', function () {
        let ruleId = $('.shopeerules_storemanage_id').val().trim()
        let popIndex = layer.open({
            title: '批量操作',
            type: 1, //不加该属性,就会出现[object Object]
            area: ['500px', '50%'],
            btn: ['保存', '关闭'],
            id: '_shopee_layer_removestore',
            content: $('#shopee_layer_removestore').html(),
            success: function () {
                form.render()
            },
            yes: function (index, layero) {
                let storeAcctNames = $('#shopee_layer_removestore_form .allStoreName').val()
                let obj = {}
                obj.ruleId = ruleId
                obj.storeNameStr = storeAcctNames
                if (storeAcctNames == '') {
                    layer.msg('请输入店铺名', { icon: 2 })
                } else {
                    getDataShopeeRulesBatchRemoveStores(obj).then(function (data) {
                        layer.msg(data, { icon: 1 })
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

    //初始化shopee站点请求
    function shopeerules_initAmazonSiteAjax () {
        return commonReturnPromise({
            type: 'post',
            url: ctx + '/shopee/onlineProductShopee/getShopeeOnlineEnum.html',
        })
    }

    //渲染开发类型,商品标签和物流属性,商品归属人
    function newpublishRenderSelect () {
        return commonReturnPromise({
            url: '/lms/fyndiq/new/listing/manage.html'
        })
    }

    // 规则-修改
    function getDataShopeeRulesEditInfo (obj) {
        return commonReturnPromise({
            url: ctx + `/shopee/shopeeAutoListingRuleController/rule/editInfo`,
            type: 'post',
            contentType: 'application/json',
            params: JSON.stringify(obj)
        })
    }

    // // 规则详情
    // function getDataShopeeRulesGetRule(id) {
    //     return commonReturnPromise({
    //         url: ctx + `/shopee/shopeeAutoListingRuleController/rule/get/${id}`,
    //         type: 'get',
    //     })
    // }

    // 规则-删除
    function getDataShopeeRulesDelete (id) {
        return commonReturnPromise({
            url: ctx + `/shopee/shopeeAutoListingRuleController/rule/delete/${id}`,
            type: 'delete',
        })
    }

    // 规则-修改状态
    function getDataShopeeRulesUpdateStatus (obj) {
        return commonReturnPromise({
            url: ctx + `/shopee/shopeeAutoListingRuleController/rule/updateStatus/${obj.id}`,
            type: 'put',
            params: {
                'status': obj.status
            }
        })
    }

    // 规则-新增规则
    function getDataShopeeRulesAddRule (obj) {
        return commonReturnPromise({
            url: ctx + `/shopee/shopeeAutoListingRuleController/rule/addRule`,
            type: 'post',
            contentType: 'application/json',
            params: JSON.stringify(obj)
        })
    }
    // 规则-删除规则
    function getDataShopeeRulesDelRule (id) {
        return commonReturnPromise({
            url: ctx + `/shopee/shopeeAutoListingRuleController/rule/delete/${id}`,
            type: 'DELETE',
        })
    }

    // 规则-批量关闭/开启
    function getDataShopeeRulesBatchStatus (obj) {
        return commonReturnPromise({
            url: ctx + `/shopee/shopeeAutoListingRuleController/rule/batchUpdate`,
            type: 'get',
            contentType: 'application/json',
            params: obj
        })
    }

    // 店铺-为自动刊登规则设置店铺
    function getDataShopeeRulesSetStoreForRule (obj) {
        return commonReturnPromise({
            url: ctx + `/shopee/shopeeAutoListingRuleStoreController/store/setStoreForRule`,
            type: 'post',
            contentType: 'application/json',
            params: JSON.stringify(obj)
        })
    }

    // // 店铺-刊登规则下的某个店铺详情
    // function getDataShopeeRulesGetStore(id) {
    //     return commonReturnPromise({
    //         url: ctx + `/shopee/shopeeAutoListingRuleStoreController/store/get/${id}`,
    //         type: 'get',
    //     })
    // }

    // 店铺-修改某一个规则下的店铺信息
    function getDataShopeeRulesEditStoreInfo (obj) {
        return commonReturnPromise({
            url: ctx + `/shopee/shopeeAutoListingRuleStoreController/store/editStoreInfo`,
            type: 'post',
            contentType: 'application/json',
            params: JSON.stringify(obj)
        })
    }

    // 店铺-删除规则下的店铺
    function getDataShopeeRulesDeleteStoreInfo (id) {
        return commonReturnPromise({
            url: ctx + `/shopee/shopeeAutoListingRuleStoreController/store/delete/${id}`,
            type: 'delete'
        })
    }

    // 店铺-批量移除店铺
    function getDataShopeeRulesBatchRemoveStores (obj) {
        return commonReturnPromise({
            url: ctx + `/shopee/shopeeAutoListingRuleStoreController/store/batchRemoveStores`,
            type: 'delete',
            contentType: 'application/json',
            params: JSON.stringify(obj)
        })
    }
})

//初始化shopee商品类目
function initShopeeCateAjax() {
    return commonReturnPromise({
      url: ctx + "/prodcate/listCategoryTree",
    })
  }

  function initShopeeCateTree() {
    //左侧类目tree
    return new Promise(function (resolve) {
      initShopeeCateAjax()
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
                      shopeeCateTree.setChkDisabled(
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
                  var childrenIds = getShopeeChildren([], treeNode)
                  for (var i = 0; i < childrenIds.length; i++) {
                    var node = shopeeCateTree.getNodeByParam("value", childrenIds[i])
                    shopeeCateTree.checkNode(node, treeNode.checked, false, true)
                  }
                }
              },
            },
          }
          setting.check.chkboxType = {
            Y: "s",
            N: "s",
          }
          shopeeCateData = result
          var t = $("#shopeerulesCateTree")
          t = $.fn.zTree.init(t, setting, shopeeCateData)
          shopeeCateTree = $.fn.zTree.getZTreeObj("shopeerulesCateTree")
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
  function getShopeeChildren(values, treeNode) {
    values.push(treeNode.value)
    if (treeNode.isParent) {
      for (var obj in treeNode.data) {
        getShopeeChildren(values, treeNode.data[obj])
      }
    }
    return values
  }


function shopeeRules_inputInt(event){
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
