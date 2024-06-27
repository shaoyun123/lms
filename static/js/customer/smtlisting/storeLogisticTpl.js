var smtStoreLOG_isUpdateList = false
var smtStoreLOG_isSameParams = null
layui.use(['admin', 'form', 'layer', 'table', 'formSelects', 'laypage', 'laydate', 'upload'], function () {
    var form = layui.form,
        admin = layui.admin,
        formSelects = layui.formSelects,
        laydate = layui.laydate,
        laypage = layui.laypage,
        upload = layui.upload,
        table = layui.table;

    form.render()
    render_hp_orgs_users("#smtStoreLOG_search_form")

    // 搜索
    $('#smtStoreLOG_search_submit').click(function () {
        // let searchParams = { storeAcctId: $("#smtStoreLOG_search_form").find('select[name=storeAcctId]').val() }
        var searchParams = {};
        var currentStoreAccts = formSelects.value("smtStoreLOG_storeAcct_sel", "val"); //所选店铺
        if (currentStoreAccts == null || currentStoreAccts.length < 1) { //没有选择店铺
            var acctIds = $("#smtStoreLOG_storeAcct_sel").attr("acct_ids");
            if (acctIds && acctIds.length > 1) {
                searchParams.storeAcctIdStr = acctIds;
            } else {
                searchParams.storeAcctIdStr = 99999;
            }
        } else {
            searchParams.storeAcctIdStr = currentStoreAccts.join(","); //选择的店铺
        }
        table.render({
            elem: "#smtStoreLOG_tpl_table",
            url: ctx + '/freight/config/search.html',
            where: searchParams,
            method: 'post',
            cols: [[
                { field: 'storeAcct', title: '店铺' },
                { field: 'shippingTypeName', title: '定价公式' },
                { field: 'weightSection', title: '重量区间', templet: '#smtStoreLOG_table_weight' },
                { field: 'templateNmae', title: '运费模板' },
                { title: '操作', toolbar: "#smtStoreLOG_toolbar" },
            ]],
            id: 'smtStoreLOG_tpl_table',
            page: true,
            limits: [50, 100, 150],
            limit: 50,
            done: function (res, cur, count) {
                $("#smtStoreLOG_listNum").find('span').text(count)
            }
        })
    })

    table.on('tool(smtStoreLOG_tpl_table)', function (obj) {
        switch (obj.event) {
            case 'delete':
                smtStoreLOG_delete(obj.data)
                break;
            case 'update':
                smtStoreLOG_renderAddEditTpl(2, obj.data);
                break;
            default:
                break;
        };
    })

    // 弹窗选择店铺 触发运费模板数据渲染
    form.on('select(smtStoreLOG_opera_storeAcct)', function (data) {
        smtStoreLOG_syncFreightTpl(false)
    })
})

//查询无数据源店铺
function smtStoreLOG_noDataStore() {
    let table = layui.table;
    let layer = layui.layer;
    commonReturnPromise({
        url: ctx + '/freight/config/searchNotConfig.html',
    }).then(data => {
        layer.open({
            type: 1,
            content: $('#smtStoreLOG_noData_table_tpl').html(),
            title: `<div>无数据店铺(<span id="smtStoreLOG_noData_num"></span>)</div>`,
            area: ['500px', '500px'],
            success: function (layero, index) {
                table.render({
                    elem: "#smtStoreLOG_noData_table",
                    data: data,
                    cols: [[
                        { field: 'storeAcct', title: '店铺' },
                        { field: 'salesperson', title: '销售员' },
                    ]],
                    id: 'smtStoreLOG_noData_table',
                    done: function (res, cur, count) {
                        $("#smtStoreLOG_noData_num").text(data.length)
                    }
                })
            }
        })
    }).catch(err => layer.msg(err || err.msg, { icon: 2 }))
}

//添加
function smtStoreLOG_add() {
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
        smtStoreLOG_renderAddEditTpl(1, { storeInfo: res })
    }).catch(err => layui.layer.msg(err || err.message, { icon: 2 }))
}

//删除
function smtStoreLOG_delete(obj) {
    commonReturnPromise({
        url: ctx + '/freight/config/delete.html',
        params: { id: obj.id },
        contentType: 'application/json',
    }).then(() => {
        layer.msg('删除成功', { icon: 1 })
        $('#smtStoreLOG_search_submit').click()
    }).catch(err => layui.layer.msg(err || err.message, { icon: 2 }))
}

//运费模板同步
function smtStoreLOG_syncFreightTpl(isSync = true, freightTemplateId = '') {
    let storeAcctId = $("#smtStoreLOG_opera_form").find('select[name=storeAcct]').val()
    if (!storeAcctId) return layui.layer.msg('需要选择店铺后才能同步', { icon: 0 })
    commonReturnPromise({
        url: ctx + '/aliexpress/publish/listfreighttpl.html',
        params: { storeAcctId: storeAcctId, isSync }
    }).then(data => {
        commonRenderSelect('smtStoreLOG_opera_freightTpl', data, { name: 'templateName', code: 'templateId', selected: freightTemplateId })
    }).then(() => {
        layui.form.render()
    }).catch(err => layui.layer.msg(err || err.message, { icon: 2 }))
}

//添加 1、编辑 2 模板引擎
function smtStoreLOG_renderAddEditTpl(oType = 1, obj = '') {
    let layer = layui.layer
    let laytpl = layui.laytpl
    let form = layui.form
    let _obj = {
        ...obj,
        type: oType
    }
    layer.open({
        type: 1,
        title: oType == 1 ? '添加' : '编辑',
        content: '加载中',
        area: ['600px', '600px'],
        btn: ['保存', '关闭'],
        success: function (layero, index) {
            laytpl($("#smtStoreLOG_opera_modal").html()).render(_obj, function (html) {
                $(layero).find('.layui-layer-content').html(html);
            })
            if (oType == 1) {
                commonRenderSelect('smtStoreLOG_opera_storeAcct', obj.storeInfo, { name: 'storeAcct', code: 'id' })
                    .then(() => form.render())
            } else {
                smtStoreLOG_syncFreightTpl(false, _obj.freightTemplateId)
            }
        },
        yes: function (index, layero) {
            let params = {}
            params.storeAcctId = $("#smtStoreLOG_opera_form").find('select[name=storeAcct]').val()
            if (!params.storeAcctId) return layer.msg('请选择店铺')
            params.shippingType = $("#smtStoreLOG_opera_form").find('select[name=shippingType]').val()
            if (!params.shippingType) return layer.msg('请选择定价公式')
            params.minWeight = $("#smtStoreLOG_opera_form").find('input[name=minWeight]').val()
            if (params.minWeight == '') return layer.msg('请选择重量区间最小值')
            params.maxWeight = $("#smtStoreLOG_opera_form").find('input[name=maxWeight]').val()
            if (params.maxWeight == '') return layer.msg('请选择重量区间最大值')
            params.freightTemplateId = $("#smtStoreLOG_opera_form").find('select[name=freightTemplate]').val()
            if (!params.freightTemplateId) return layer.msg('请选择运费模板')
            if (oType == 1) {
                if (smtStoreLOG_isSame(params, smtStoreLOG_isSameParams)) return layer.msg('该数据已经保存过')
                commonReturnPromise({
                    url: ctx + '/freight/config/add.html',
                    params: { ...params },
                    contentType: 'application/json',
                }).then(() => {
                    smtStoreLOG_isUpdateList = true
                    smtStoreLOG_isSameParams = params
                    layer.msg('添加成功', { icon: 1 })
                }).catch(err => layui.layer.msg(err || err.message, { icon: 2 }))
            } else {
                commonReturnPromise({
                    url: ctx + '/freight/config/update.html',
                    params: { ...params, id: obj.id },
                    contentType: 'application/json',
                }).then(() => {
                    layer.msg('修改成功', { icon: 1 })
                    layer.close(index)
                    $('#smtStoreLOG_search_submit').click()
                }).catch(err => layui.layer.msg(err || err.message, { icon: 2 }))
            }
        },
        cancel: function (index, layero) {
            smtStoreLOG_isSameParams = null
            layer.close(index)
            if (smtStoreLOG_isUpdateList) {
                $('#smtStoreLOG_search_submit').click()
                smtStoreLOG_isUpdateList = false
            }
        }, btn2: function (index, layero) {
            smtStoreLOG_isSameParams = null
            layer.close(index)
            if (smtStoreLOG_isUpdateList) {
                $('#smtStoreLOG_search_submit').click()
                smtStoreLOG_isUpdateList = false
            }
        }
    })
}

function smtStoreLOG_isSame(res1, res2) {
    if (!!res2 && res1.freightTemplateId == res2.freightTemplateId &&
        res1.maxWeight == res2.maxWeight &&
        res1.minWeight == res2.minWeight &&
        res1.shippingType == res2.shippingType &&
        res1.storeAcctId == res2.storeAcctId)
        return true
    else return false
}