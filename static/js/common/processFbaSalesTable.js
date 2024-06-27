function processFbaSalesTableTableorder(data,popIndex) {
    let col = [
        [
            {title: "父SKU",  rowspan:2, templet: '#processFbaSalesTable_pSkuTpl'},
            {title: "人员",  rowspan:2, templet: '#processFbaSalesTable_personTpl'},
            {title: "中文名", rowspan:2, templet: '#processFbaSalesTable_cnTitleTpl'},
            {title: "子商品", colspan: 4},
            {title: "流程", rowspan:2, templet: '#processFbaSalesTable_timeTpl',width: 220},
            {title: "货件", rowspan:2, templet: '#processFbaSalesTable_shipmentTpl',width: 155},
            {title: "Listing优化", rowspan:2, templet: '#processFbaSalesTable_ListingTpl',width: 155},
            {title: "CPC", rowspan:2, templet: '#processFbaSalesTable_CPCTpl',width: 155},
            {title: "销售备注(点击可修改)", rowspan:2, field: 'salesRemark', edit: 'text', style:"background-color: #7FFFD4;"},
        ],
        [
            {title: "子sku", templet: '#processFbaSalesTable_subDetail_sSku'},
            {title: "发货数量", templet: '#processFbaSalesTable_subDetail_deliverAmount'},
            {title: "ASIN", templet: '#processFbaSalesTable_subDetail_asin'},
            {title: "发货重量(kg)", templet: '#processFbaSalesTable_subDetail_weight'},
        ]
    ]
    layui.table.render({
        elem: '#processFbaSalesTable_table',
        method: 'POST',
        url: ctx + '/processFbaDev/queryPage.html',
        where: data,
        cols: col,
        page: true,
        limit: 50,
        limits: [50, 100, 500],
        id: 'processFbaSalesTable_table',
        done: function (res) {
            if (res.code !== '0000') {
                layer.close(popIndex)
            } else {

            }
        }
    })
    // 监听表格修改事件
    layui.table.on('edit(processFbaSalesTable_table)', function(obj) {
        var value = obj.value //得到修改后的值
            , data = obj.data //得到所在行所有键值
            , field = obj.field; //得到字段

        var AData = {
            id : data.id
        }
        AData[field] = value
        loading.show()
        $.ajax({
            url: ctx + "/processFbaDev/updateField.html",
            type: 'POST',
            dataType: "json",
            contentType: 'application/json',
            data: JSON.stringify(AData),
            success: function(res) {
                loading.hide()
                if (res.code === '0000') {
                    layer.msg('修改成功')
                } else {
                    layer.msg(res.msg)
                }
            },
            error: function () {
                loading.hide()
            }
        })
    })
}

function popProcessFbaSalesTableTable(pSku) {
    let popIndex = layer.open({
        type: 1,
        title: '销售进度',
        area: ['90%', '80%'],
        shadeClose: false,
        content: $('#proceeFbaSalesTable_layer').html(),
        success: function (layero) {
            let Adta = {
                searchType: 'pSku',
                searchValue: pSku,
                needAuditStatus: true,
                searchMethod: 2
            }
            processFbaSalesTableTableorder(Adta)
        },
        btn: ['关闭'],
    })
}