/**
 * time: 2018/02/07
 */
layui.use(["admin", "form", "table", "layer", "laytpl", "laydate"], function () {
    var admin = layui.admin,
        form = layui.form,
        table = layui.table,
        layer = layui.layer,
        laytpl = layui.laytpl,
        laydate = layui.laydate,
        $ = layui.$;
    form.render('select');
    form.render('radio');
    form.render('checkbox');


    //表格渲染结果
    //展示已知数据
    table.render({
        elem: "#aliyunTable",
        method: "post",
        url: ctx + "/sysAliEcs/getSysAliEcsList.html",
        cols: [
            [
                //标题栏
                {type: "checkbox"},
                {field: "ip", title: "IP", width: 160},
                {field: "alias", title: "备注"},
                //绑定工具条
                {title: '操作', width: 150, align: 'center', toolbar: '#aliyunTableBar'}
            ],
        ],
        id: 'aliyunReloadTable',
        page: true,
        limits: [20, 50, 100],
        limit: 20
    });

    // 搜索
    var active = {
        reload: function () {
            var ip = $("#aliyunSearchForm input[name='ip']").val();
            var alias = $("#aliyunSearchForm input[name='alias']").val();
            //执行重载
            table.reload('aliyunReloadTable', {
                page: {curr: 1},
                where: {
                    ip: ip,
                    alias: alias,
                }
            });
        },
    };

    $('#aliyunSearch').click(function () {
        var type = $(this).data('type');
        active[type] ? active[type].call(this) : '';
    });

    //工具条的监听事件,table.on(tool(表格的lay-filter的值))
    table.on("tool(aliyunTable)", function (obj) {
        var data = obj.data, //获得当前行数据
        //getTpl = $("#detailM").html(), //获取模板引擎的内容
            layEvent = obj.event; //获得 lay-event 对应的值
        if (layEvent === "restart") {
            $.ajax({
                type: "POST",
                url: ctx + "/salesplat/rebootInstance.html",
                data: {ip: data.ip},
                async: false,
                dataType: "json",
                success: function (returnData) {
                    if (returnData.code == "0000") {
                        layer.closeAll();
                        layer.msg(returnData.msg);
                    } else {
                        layer.msg(returnData.msg);
                    }
                },
                error: function () {
                    layer.msg("服务器正忙");
                },
            });
        }
    });

});

// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
//Format("2016-10-04 8:9:4.423","yyyy-MM-dd hh:mm:ss.S") ==> 2016-10-04 08:09:04.423
//Format("1507353913000","yyyy-M-d h:m:s.S")      ==> 2017-10-7 13:25:13.0
function Format(datetime, fmt) {
    if (datetime) {
        datetime = datetime.toString();
        if (parseInt(datetime) == datetime) {
            if (datetime.length == 10) {
                datetime = parseInt(datetime) * 1000;
            } else if (datetime.length == 13) {
                datetime = parseInt(datetime);
            }
        }
        datetime = new Date(datetime);
        var o = {
            "M+": datetime.getMonth() + 1,                 //月份
            "d+": datetime.getDate(),                    //日
            "h+": datetime.getHours(),                   //小时
            "m+": datetime.getMinutes(),                 //分
            "s+": datetime.getSeconds(),                 //秒
            "q+": Math.floor((datetime.getMonth() + 3) / 3), //季度
            "S": datetime.getMilliseconds()             //毫秒
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (datetime.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    } else {
        return "";
    }
}

console.log(123);