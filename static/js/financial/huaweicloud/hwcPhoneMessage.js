/**
 * time: 2018/09/18  huangpeng
 */

layui.use(["admin", "form", "table", "layer", "laytpl",'element','laydate'], function() {
    var admin = layui.admin,
        form = layui.form,
        table = layui.table,
        layer = layui.layer,
        element = layui.element,
        laytpl = layui.laytpl,
        laydate = layui.laydate,
        $ = layui.$;
    form.render("select");
    form.render("radio");
    form.render("checkbox");

    laydate.render({
        elem: '#hwcPhoneMessageSearchForm_timeSection',
        range: true
    })
    // 初始化设置日期为当前1个月内时间
    var date = new Date()
    var endTime = format(date, 'yyyy-MM-dd')
    date.setDate(date.getDate() - 30);
    var beginTime = format(date, 'yyyy-MM-dd')
    var timeStr = beginTime + ' - ' + endTime
    $('#hwcPhoneMessageSearchForm_timeSection').val(timeStr)

    function hwcPhoneMessage_queryPage(where) {
        table.render({
            elem: "#hwcPhoneMessageTable",
            method: "post",
            url: ctx + "/huaWeiCloud/searchMessage.html",
            where: where,
            cols: [
                [
                    //标题栏
                    {type: "checkbox"},
                    // {field: "ifRead", title: "已读", templet: `#hwcPhoneMessage_ifReadTpl`,width: 50},
                    {field: "virtualPhone", title: "虚拟号",width: 150},
                    {field: "fromPhone", title: "发送端",width: 150},
                    {field: "toPhone", title: "接收端",width: 150},
                    {field: "createTime", title: "时间",templet: '<div>{{Format(d.createTime,"yyyy-MM-dd hh:mm:ss")}}</div>',width: 150},
                    {field: "content", title: "短信内容"},
                ],
            ],
            id: "hwcPhoneMessageTable",
            page: true, //是否显示分页
            limits: [100, 500, 1000],
            limit: 100, //每页默认显示的数量
            done: function () {
            }
        });
    }
    // 搜索
    var active = {
        reload: function () {
            //执行重载
            table.reload("hwcPhoneMessageTable", {
                where: {
                    status: $("#hwcPhoneMessageSearchForm [name='status']").val(),
                    acct: $("#hwcPhoneMessageSearchForm [name='acct']").val(),
                    auditStatus: $("#hwcPhoneMessageSearchForm [name='auditStatus']").val()
                },
            });
        },
    };

    $("#hwcPhoneMessageSearch").click(function () {
        let data = serializeObject($('#hwcPhoneMessageSearchForm'))
        hwcPhoneMessage_queryPage(data)
    });

    //展示已知数据
    $("#hwcPhoneMessageSearch").click()

    //工具条的监听事件,table.on(tool(表格的lay-filter的值))
    table.on("tool(hwcPhoneMessageTable)", function (obj) {
        var data = obj.data, //获得当前行数据
            //getTpl = $("#detailM").html(), //获取模板引擎的内容
            layEvent = obj.event; //获得 lay-event 对应的值

        if (layEvent === "edit") {

        }
    })
})