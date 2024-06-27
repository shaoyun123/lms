var addtoFBA = null;
layui.use(['admin', 'form', 'table', 'layer', 'layedit'], function() {
    var admin = layui.admin,
        form = layui.form,
        table = layui.table,
        element = layui.element,
        layedit = layui.layedit,
        layer = layui.layer;
    form.render('select');

    addtoFBATableRender(batchArr);

    function addtoFBATableRender(data) {
        addtoFBA = table.render({
            elem: '#addtoFBATable',
            method: 'get',
            data: data,
            cols: [
                [ //表头
                    { checkbox: true, width: 30 },
                    { title: "图片", field: "image", templet: "#addtoFBA_imageTpl" },
                    { title: "店铺", field: "storeAcct" },
                    { title: "站点", field: "siteName" },
                    { title: "店铺SKU", field: "storeSSku" },
                    { title: "ASIN", field: "asin" },
                    { title: "计划发货数量", field: "promotionSaleType", templet: '#addtoFBA_planNumber' },
                    { title: '操作结果', field: "addtoFBAResult" }
                ]
            ],
            page: false,
            id: "addtoFBATable",
            done: function(data) {
                imageLazyloadAll();
            }
        })
    }

    $('#addtoFBAApply').click(function() {
        var newplanNum = $(this).siblings('input').val();
        if (newplanNum !== "") {
            applytoChecked('addtoFBATable', addtoFBA, function(tr, data, i) {
                tr.find('input[name="planNumber"]').val(newplanNum)
            })
        } else {
            layer.msg("请填写需要应用的计划发货数量！")
        }
    })

    $('#batchAddtoFBA').click(function() {
        var plans = [];
        applytoChecked('addtoFBATable', addtoFBA, function(tr, data, i) {
            data.planQuality = tr.find('input[name="planNumber"]').val();
            data.salesSite = data.siteId
            const { id, planQuality, salesSite, storeAcctId, storeSSku } = data
            plans.push({ id, planQuality, salesSite, storeAcctId, storeSSku })
        })
        if (plans) {
            bacthAddToFBA(plans)
        }

    })

    function bacthAddToFBA(data) {
        initAjax('/amazonFBA/shipPlan/add.html', 'POST', data, function(returnData) {
            var obj = { '0': '已存在', '1': '已加入' }
            layer.msg(obj[returnData.data.resultStatus])
            console.log(returnData)
        })
    }

    function initAjax(url, method, data, func, contentType) { //初始化ajax请求
        $.ajax({
            type: method,
            url: ctx + url,
            dataType: 'json',
            async: true,
            data: data,
            contentType: contentType || 'application/json',
            success: function(returnData) {
                loading.hide()
                if (returnData.code == "0000") {
                    func(returnData)
                } else {
                    layer.msg(returnData.msg, { icon: 2 });
                }
            },
            error: function(returnData) {
                layui.admin.load.hide();
                if (XMLHttpRequest.status == 200) {
                    layer.msg("请重新登录", { icon: 7 });
                } else {
                    layer.msg("服务器错误");
                }
            }
        })
    }
});