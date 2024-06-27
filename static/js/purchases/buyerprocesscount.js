/**
 * time: 2018/01/02
 */

layui.use(["admin", "form", "table", "layer", "laydate"], function () {
    var admin = layui.admin,
        form = layui.form,
        table = layui.table,
        layer = layui.layer,
        element = layui.element,
        laydate = layui.laydate,
        $ = layui.$;
    form.render('select');
    form.render('radio');
    form.render('checkbox');

    laydate.render({
        elem: '#queryTime_buyerProcessCount',
        range: true
    })
    // 初始化设置日期为当前1个月内时间
    var date = new Date()
    var endTime = format(date, 'yyyy-MM-dd')
    date.setDate(date.getDate() - 30);
    var beginTime = format(date, 'yyyy-MM-dd')
    var timeStr = beginTime + ' - ' + endTime
    $('#queryTime_buyerProcessCount').val(timeStr)

    // 初始化部门 采购员选项
    render_hp_orgs_users("#buyerProcessCountSearchForm")
    //表格渲染结果
    //展示已知数据
    function search_buyerProcessCount(data) {
        table.render({
            elem: "#buyerProcessCountTable",
            id: 'buyerProcessCountTable',
            method: "post",
            url: ctx + "/purchaseReport/queryBuyerProcessCountList.html",
            where: data,
            cols: [
                [
                    //标题栏
                    // {type: "checkbox"},
                    {field: "buyer", title: "采购员",templet:'#getBuyerProcessDetail_tpl'/*'<div><a data-id="{{d.buyerId}}" class="getBuyerProcessDetail" href="javascrpt:;" style="color:blue" >{{d.buyer}}</a></div>'*/},
                    {field: "orgName", title: "部门"},
                    // { title: "统计日期", templet: '<div>{{format(d.countDate,"yyyy-MM-dd")}}</div>'},
                    {field: "totalNum", title: "采购订单数"},
                    {field: "payAbleNum", title: "可付订单数"},
                    {field: "payAbleNumRate", title: "可付订单比",templet: '<div>{{toPercent(d.payAbleNumRate)}}</div>'},
                    {field: "skuNum", title: "采购sku数"},
                    {field: "totalMoney", title: "采购金额"},
                    {field: "payAbleMoney", title: "可付金额"},
                    {field: "payAbleMoneyRate", title: "可付金额比",templet: '<div>{{toPercent(d.payAbleMoneyRate)}}</div>'},
                ],
            ],
            done: function(res, curr, count){
                $("#buyerProcessCount_colLen").text(res.count);
                // 表头固定
                theadHandle().fixTh({ id:'#buyerProcessCountmanageCard',h:200 })
            },
            page: true, //是否显示分页
            limits: [100, 500, 1000],
            limit: 100, //每页默认显示的数量
        });
       /* table.on('tool(buyerProcessCountTable)', function(obj) {
            var data = obj.data, //获得当前行数据
                layEvent = obj.event; //获得 lay-event 对应的值
           if (layEvent == 'amazon_oper_listing') {
                layer.open({
                    type: 1,
                    title: '详情',
                    shadeClose: false,
                    area: ['60%', '60%'],
                    content: $('#getBuyerProcessDetail_table').html(),
                    success: function() {
                        getBuyerProcessDetail(data);
                    }
                })
            }
        });*/
    }

    
    // 模板查询赋值
    commonSaveSearchTpl({
        id: "buyerprocesscount_save",
        formId: "buyerProcessCountSearchForm",
        pageName: "buyerprocesscount",
        searchBtnId: "search_buyerprocesscount",
        cb: param => buyerprocesscount_formVal(param),
        btnText: '',
        layerTitleText: ''
    })

    function buyerprocesscount_formVal(param) {
        $('#search_buyerprocesscount_reset_btn').trigger('click')
        // 给表单赋值
        form.val("buyerProcessCountSearchForm", param)
        form.render()
        // 执行搜索
        $("#search_buyerprocesscount").click()
    }

 /*   $(".getBuyerProcessDetail").click(function(){
        getBuyerProcessDetail($(this).data)
    });*/

    $('#search_buyerprocesscount').click(function () {
        var time = $('#queryTime_buyerProcessCount').val()
        if (!time) {
            layer.msg('请选择日期，并限制在3个月内')
            return
        }
        var timeArr = time.split(' - ')
        var timeDiff = getTimeDiff(new Date(timeArr[0]),new Date(timeArr[1]),'day')
        if (timeDiff > 92) {
            layer.msg('请选择日期，并限制在3个月内')
            return
        }
        var data = {
            beginDate: timeArr[0],
            endDate: timeArr[1],
            orgId: $('#buyerProcessCountSearchForm [name=orgId]').val(),
            buyerId: $('#buyerProcessCountSearchForm [name=buyerId]').val(),
            ifDelCurrentCount: $('#buyerProcessCountSearchForm [name=ifDelCurrentCount]').prop('checked')
        }
        search_buyerProcessCount(data)
    });

    $('#exportBuyerProcessCountBtn').click(function () {
        var time = $('#queryTime_buyerProcessCount').val()
        if (!time) {
            layer.msg('请选择日期，并限制在3个月内')
            return
        }
        var timeArr = time.split(' - ')
        var timeDiff = getTimeDiff(new Date(timeArr[0]),new Date(timeArr[1]),'day')
        if (timeDiff > 92) {
            layer.msg('请选择日期，并限制在3个月内')
            return
        }
        var data = {
            beginDate: timeArr[0],
            endDate: timeArr[1]
        }

        var Confirmindex = layer.confirm('确认导出当前时间段的采购进度表吗？', { btn: ['确认', '取消'] }, function() {
            submitForm(data, ctx + '/purchaseReport/exportBuyerProcessCount.html')
            layer.close(Confirmindex);
        })
    })

});

function openBuyerProcessDetailTable(buyerId,beginDate,endDate){
    var data = {
        buyerId:buyerId,
        beginDate: beginDate,
        endDate: endDate
    }
    layui.layer.open({
        type: 1,
        title: '详情',
        shadeClose: false,
        area: ['60%', '60%'],
        content: $('#getBuyerProcessDetail_table_tpl').html(),
        success: function() {
            getBuyerProcessDetail(data);
        }
    })
}
function getBuyerProcessDetail(data) {
    layui.table.render({
        elem: "#getBuyerProcessDetail_show_table",
        id: 'getBuyerProcessDetail_show_table',
        method: "get",
        url: ctx + "/purchaseReport/queryBuyerProcessDetailByBuyer.html",
        where: data,
        cols: [
            [
                //标题栏
                // {type: "checkbox"},
                {field: "buyer", title: "采购员"},
                {field: "orgName", title: "部门"},
                { title: "统计日期", templet: '<div>{{format(d.countDate,"yyyy-MM-dd")}}</div>'},
                {field: "totalNum", title: "采购订单数"},
                {field: "payAbleNum", title: "可付订单数"},
                {field: "payAbleNumRate", title: "可付订单比",templet: '<div>{{toPercent(d.payAbleNumRate)}}</div>'},
                {field: "skuNum", title: "采购sku数"},
                {field: "totalMoney", title: "采购金额"},
                {field: "payAbleMoney", title: "可付金额"},
                {field: "payAbleMoneyRate", title: "可付金额比",templet: '<div>{{toPercent(d.payAbleMoneyRate)}}</div>'},
            ],
        ]
    });
}
