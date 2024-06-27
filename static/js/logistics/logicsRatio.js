layui.use(['table', 'form', 'layer', 'formSelects', 'element', 'laydate'], function() {
    var formSelects = layui.formSelects,
        table = layui.table,
        form = layui.form,
        layer = layui.layer;

    form.render()

    getCountryList()
    getPlatform()
    getLogicsProperty()
    getLogisticsTypeIdList()


    form.on('submit(searchLogicsRatio)', function(data) {
        searchLogicsRatio()
    });


    function searchLogicsRatio() {
        var dataOrig = serializeObject($('#logicsRatioForm'));
        var data = {
            countryCode: dataOrig.countryCode,
            weight: dataOrig.weight,
            logisticsAttribute: dataOrig.logicsRatio_logisticsAttribute,
            platCode: dataOrig.logicsRatio_platCode,
            city:dataOrig.logisticsCity,
            zipCode:dataOrig.logisticsZipCode,
            length:dataOrig.length,
            width: dataOrig.width,
            height:dataOrig.height,
            throwingWeightFlag : false,
            logisticsTypeIdList: formSelects.value('logicsRatio_logisticsTypeIdList', 'val') 
        };
        if((data.city != null && data.city != '') && (data.zipCode !=null && data.zipCode != '')){
            layer.msg('邮编和城市只能使用一个', { icon: 5 });
            return;
        }
        if( data.width != '' && data.length != '' && data.height != ''){
            data.throwingWeightFlag = true;
        }
        initAjax('/comparePrice/compare.html', 'post', JSON.stringify(data), function(returnData) {
            logicsTablerender(returnData.data)
        })
    }

    function logicsTablerender(data) { //绘制表格
        table.render({
            elem: '#logicsRatioTable',
            data: data //数据接口
                ,
            method: 'post',
            where: data,
            limit: 10000,
            cols: [
                [ //表头
                    { type: "checkbox", width: 30 },
                    { field: 'logisticsType', title: '物流方式' },
                    { field: 'discountRate', title: '折扣', templet: '#discount' },
                    { field: 'logisticsPrice', title: '运费(RMB)', sort: true },
                    // { field: 'smtRefundRate', title: '速卖通退款率', templet: '<div>{{transToPercent(d.smtRefundRate)}}</div>' },
                    // { field: 'wishRefundRate', title: 'wish退款率', templet: '<div>{{transToPercent(d.wishRefundRate)}}</div>' },
                    // { field: 'ebayRefundRate', title: 'ebay退款率', templet: '<div>{{transToPercent(d.ebayRefundRate)}}</div>' },
                    { field: 'logisticsAttribute', title: '物流属性' },
                ]
            ],
            done: function(res) {
                $('td[data-field="discountRate"] input').blur(function() {
                    var index = $(this).parents('tr').attr('data-index')
                    var rowdata = res.data[Number(index)]
                    var operationCost = rowdata.operationCost
                    var originalvalue = rowdata.discountRate
                    var value = Number($(this).val())
                    if (value > 1 || value < 0) {
                        $(this).val(originalvalue)
                    } else {
                        var newPrice = (parseFloat(((rowdata.logisticsPrice - operationCost) / originalvalue) * value) + parseFloat(operationCost)).toFixed(2)
                        $(this).parents('tr').find('td[data-field="logisticsPrice"] div').text(newPrice)
                    }
                })
            }
        });
    }

    function logics_append_op(domName, obj) {
        var $li = '<option value="">请选择</option>';
        var valuecode = { 'countries': 'attr', 'logicsProperty': 'name', 'platform': 'name' }
        for (var i in obj) {
            if (obj[i] && obj[i].length) { //多级分组
                for (var j in obj[i]) {
                    $li += '<option value=' + obj[i][j].abbr + '>' + obj[i][j].name + '/' + obj[i][j].abbr + '</option>';
                }
            } else if (obj[i]) {
                $li += '<option value=' + obj[i][valuecode[domName]] + '>' + obj[i].name + '</option>';
            }
        }
        $('#' + domName).append($li);
    }

    function getCountryList() {
        initAjax('/type/area/charging/country', 'get', {}, function(returnData) {
            logics_append_op('countries', returnData.data)
                //formSelects.render('countries')
            form.render('select')
        })
    }

    function getLogicsProperty() {
        initAjax('/enum/getLogisAttrEnum.html', 'post', {}, function(returnData) {
            logics_append_op('logicsProperty', returnData.data)
            formSelects.render('logicsProperty')
        })
    }

    function getLogisticsTypeIdList() {
        initAjax("/unauditorder/listlogistype.html", "get", {specialType: "直发物流"}, function (returnData) {
          const arr = [{ id: 0, name: "空" }].concat(returnData.data).map(item => ({ ...item, value: item.id }))
          formSelects.data("logicsRatio_logisticsTypeIdList", "local", { arr })
        })
    }

    function getPlatform() {
        initAjax('/enum/getSalesPlatEnum.html', 'post', {}, function(returnData) {
            logics_append_op('platform', returnData.data)
            formSelects.render('platform')
        })
    }

    function initAjax(url, method, data, func, contentType) { //初始化ajax请求
        loading.show();
        $.ajax({
            type: method,
            url: ctx + url,
            dataType: 'json',
            async: true,
            data: data,
            contentType: contentType || 'application/json',
            success: function(returnData) {
                if (returnData.code == "0000") {
                    func(returnData)
                } else {
                    layer.msg(returnData.msg, { icon: 2 });
                    logicsTablerender(returnData)
                }
                loading.hide();
            },
            error: function(returnData) {
                layui.admin.load.hide();
                if (XMLHttpRequest.status == 200) {
                    layer.msg("请重新登录", { icon: 7 });
                } else {
                    layer.msg("服务器错误");
                }
                loading.hide();
            }
        })
    }

})

function transToPercent(str) {
    if (str !== '-1') {
        return Number(str) * 100 + '%';
    } else {
        return '该物流方式没有配置普源别名'
    }
}