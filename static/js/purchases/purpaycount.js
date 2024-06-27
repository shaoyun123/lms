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
        elem: '#queryTime_purPayCount',
        range: true
    })
    // 初始化设置日期为当前1个月内时间
    var date = new Date()
    var endTime = format(date, 'yyyy-MM-dd')
    date.setDate(date.getDate() - 30);
    var beginTime = format(date, 'yyyy-MM-dd')
    var timeStr = beginTime + ' - ' + endTime
    $('#queryTime_purPayCount').val(timeStr)

    //表格渲染结果
    //展示已知数据
    function search_purPayCount(data) {
        table.render({
            elem: "#purPayCountTable",
            id: 'purPayCountTable',
            method: "post",
            url: ctx + "/purchaseReport/queryPurPayCountList.html",
            where: data,
            cols: [
                [
                    //标题栏
                    // {type: "checkbox"},
                    { title: "统计日期", templet: '<div>{{format(d.countDate,"yyyy-MM-dd")}}</div>'},
                    {field: "auditor", title: "审核员"},
                    {field: "firstPayTime", title: "最早付款时间",templet: '<div>{{format(d.firstPayTime,"yyyy-MM-dd hh:mm:ss")}}</div>'},
                    {field: "lastPayTime", title: "最晚付款时间",templet: '<div>{{format(d.lastPayTime,"yyyy-MM-dd hh:mm:ss")}}</div>'},
                    {field: "avgPayTime", title: "标记可付到实际付款平均时间(分)",templet: '<div>{{(d.avgPayTime/60).toFixed(2)}}</div>'},
                    {field: "personPayNum", title: "个人付款订单"},
                    {field: "totalPayNum", title: "总付款订单"},
                    {field: "personNumRate", title: "个人付款订单占比",templet: '<div>{{toPercent(d.personNumRate)}}</div>'},
                    {field: "personPayMoney", title: "个人付款金额"},
                    {field: "totalPayMoney", title: "总付款金额"},
                    {field: "personMoneyRate", title: "个人付款金额占比",templet: '<div>{{toPercent(d.personMoneyRate)}}</div>'},
                ],
            ],
            done: function(res, curr, count){
                $("#purPayCount_colLen").text(res.count);
                // 表头固定
                theadHandle().fixTh({ id:'#purPayCountmanageCard',h:200 })
            },
            page: true, //是否显示分页
            limits: [100, 500, 1000],
            limit: 100, //每页默认显示的数量
        });
    }

    $('#purPayCountSearch').click(function () {
        var time = $('#queryTime_purPayCount').val()
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
        search_purPayCount(data)
    });

    $('#exportPurpaycountBtn').click(function () {
        var time = $('#queryTime_purPayCount').val()
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
            submitForm(data, ctx + '/purchaseReport/exportPurPayCount.html')
            layer.close(Confirmindex);
        })
    })

});
