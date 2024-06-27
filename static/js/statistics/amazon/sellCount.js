layui.use(['form', 'table', 'laydate', 'formSelects'], function() {
    var $ = layui.$,
        layer = layui.layer,
        laydate = layui.laydate,
        table = layui.table,
        form = layui.form;
    form.render()
    render_hp_orgs_users("#amazonsellCount_form"); 

    //日期范围
    laydate.render({
        elem: '#amazonsellcount_time',
        type: 'date',
        range: true
    });

    var nowdate = new Date()
    var endDate = Format(new Date(), 'yyyy-MM-dd')
    var oneweekdate = Format(new Date(nowdate - 7 * 24 * 3600 * 1000), 'yyyy-MM-dd')
    $('#amazonsellcount_time').val(oneweekdate + ' - ' + endDate)
    // setTimeout(function() {
    //     $('#amazonsellcount_submit').click()
    // }, 0)


    form.on('submit(amazonsellcount_submit)', function(obj) {
        var data = obj.field
        const [startTime,endTime] = (data.time || "").split(' - ')

        data.startTime = startTime
        data.endTime  = endTime
        delete data.time

        getamazonSellcountTableData(data)
    })



    function amazonSellcountTablerender(data) {
        table.render({
            elem: '#amazonsellcount_table',
            data:data,
            cols: [
                [ //表头
                    { field: 'orderDay', title: '时间/站点' },
                    {title: '参数',templet: '#amazonsellcountArgustpl'},
                    { field: 'US', title: '美国', templet: '#amazonsellcountUS_tpl'},
                    { field: 'CA', title: '加拿大', templet: '#amazonsellcountCA_tpl'},
                    { field: 'GB', title: '英国', templet: '#amazonsellcountGB_tpl'},
                    { field: 'DE', title: '德国', templet: "#amazonsellcountDE_tpl"},
                    { field: 'JP', title: '日本', templet: "#amazonsellcountJP_tpl"}
                ]
            ],
            page: false,
            limit:10000, //默认显示50条
            done: function(res, curr, count) {
            }
        });
    }

    function getamazonSellcountTableData(data){
        initAjax('/platorder/fba/sale/statistics.html','get',data,function(returnData){
            for(var i in returnData.data){
                Object.assign(returnData.data[i],returnData.data[i].siteResult)
            }
            amazonSellcountTablerender(returnData.data)
        })
    }

    function initAjax(url, method, data, func, contentType, isLoad) { //初始化ajax请求
        if (!isLoad) {
            loading.show()
        }
        $.ajax({
            type: method,
            url: ctx + url,
            dataType: 'json',
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
            },
            complete: function(returnData) {
                loading.hide()
            }
        })
    }

});