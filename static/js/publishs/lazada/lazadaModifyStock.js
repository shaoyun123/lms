layui.use(['admin', 'form', 'layer','table', 'formSelects', 'element', 'laydate','laytpl'], function() {
    var admin = layui.admin,
        form = layui.form,
        layer = layui.layer,
        laytpl = layui.laytpl,
        $ = layui.$;

    // 通过sku调整库存
    $('#lazadaAdjustStockNewStockBySku').click(function () {
        let _skuStr = $.trim($("#LazadaAdjustPriceSearchForm input[name='sSkuList']").val());
        if (_skuStr == "" || _skuStr == null) return layer.msg('该方法调整库存，商品SKU必填', { icon: 0 })
        let skuStr = _skuStr.split(",").filter(item => item.trim())  //删除数组中空字符
        if(!skuStr.length) return layer.msg('请输入有效值', { icon: 0 })
        shopeeAdjustStock_getStockBySku(1, skuStr).then(count => {
            layer.open({
                type: 1,
                id: Date.now(),
                title: '调整库存',
                area: ['400px', '245px'],
                btn: !!count && count != 0 ? ["确认", "取消"] : "",
                success: function (layero) {
                    laytpl($('#lazadaAdjustStockBySkuModal').html()).render({count: count}, function (html) {
                        $(layero).find('.layui-layer-content').html(html)
                    })
                },
                yes: function (index, layero) {
                    let _stock = $("#lazadaAdjustStockBySkuForm input[name=count]").val()
                    if (_stock == '') return layer.msg('请填写调整库存量')
                    shopeeAdjustStock_getStockBySku(2, skuStr, _stock)
                        .then(() => {
                            layer.close(index)
                            layer.msg('操作成功', { icon: 1 })
                        }).catch(err => layer.msg(err.responseJSON.msg, { icon: 2 }))
                },
                end: function () { }
            })
        }).catch(err => layer.msg(err.responseJSON.msg, { icon: 2 }))
    })

})

// copy start ---- shopee/modifyStock.jsp
// type必须
// type=1  查询符合数据的数据量
// type=2  提交更改库存请求
function shopeeAdjustStock_getStockBySku(type,skuStr,stock='') {
    let params = {}
    params.storeAcctIdList = layui.formSelects.value("shopee_selectAttr_store", 'val')
    params.prodSSkuList = skuStr
    params.type = type
    if (type == 2) {
        params.stock = stock
    }
    return new Promise(function (resolve, reject) {
        $.ajax({
            type: 'put',
            dataType: 'json',
            url: ctx + '/shopee/shopeeIsEnableProduct/update/batch/stock',
            contentType: 'application/json; charset=UTF-8',
            data: JSON.stringify(params),
            beforeSend: function () { loading.show() },
            success: function (res) {
                loading.hide();
                if (res.code == '0000') {
                    resolve(res.count)
                } else {
                    reject(res.msg || '请求接口失败')
                }
            },
            error: function (err) {
                loading.hide();
                reject(err);
            }
        })
    })
}
// copy end ---- shopee/modifyStock.jsp
