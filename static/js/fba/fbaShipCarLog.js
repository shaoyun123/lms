layui.use(['admin', 'form', 'table', 'layer', 'layedit', 'element', 'laypage', 'upload', 'laydate'], function () {
    var form = layui.form,
        table = layui.table,
        laypage = layui.laypage,
        layer = layui.layer,
        upload = layui.upload,
        laydate = layui.laydate;
    form.render('select');
    initBizzTag('#fbaShipCarLog_Form_carNumber','FBA_SHIP_CAR_NUMBER',true, true, null,null,null)
    laydate.render({elem: '#fbaShipCarLog_Form_timeStr', range: true})

    $('#fbaShipCarLog_Search').click(function () {
        let data = serializeObject($('#fbaShipCarLog_Form'))
        table.render({
            elem: "#fbaShipCarLog_table",
            method: 'post',
            url: ctx + "/fbaShipCarLog/queryPage.html",
            where: data,
            cols: [
                [
                    { type: "checkbox", width: 30 },
                    { field: "carNumber", title: "车牌号", width: 150 },
                    {title: "装车时间", width: 150, templet: '<div>{{format(d.createTime,"yyyy-MM-dd hh:mm:ss")}}</div>' },
                    { field: "totalBox", title: "总箱数", width: 100 },
                    { title: "货件计划", width: 150, templet: '#fbaShipCarLog_shipmentIdTpl' },
                    { title: "装车箱数", width: 100, templet: '#fbaShipCarLog_boxNumTpl' },
                    { title: "运单号",  templet: '#fbaShipCarLog_relTransferNoTpl' },
                    { title: "品名",  templet: '#fbaShipCarLog_cnNameTpl' },
                    { title: "材质",  templet: '#fbaShipCarLog_meterialTpl' },
                    {title: "操作", width: 150, toolbar: '#fbaShipCarLog_toolBar'}
                ],
            ],
            id: "fbaShipCarLog_table",
            page: true,
            limits: [100, 200, 1000],
            limit: 100,
            done: function(res, curr, count) {
                $("#sSkuNum").html(count);
                //懒加载
                imageLazyload();
            }
        });
    })

    //
    table.on('tool(fbaShipCarLog_table)', function (obj) {
        let data = obj.data;
        let layEvent = obj.event;
        switch (layEvent) {
            case "print":
                fbaShipCarLog_print(data)
                break
            default:
        }
    });

    function fbaShipCarLog_print(data) {
        let title = "车牌号:" + data.carNumber+ ' — 时间:' + format(data.createTime,'yyyy-MM-dd hh:mm:ss') + '【'+ data.totalBox +'】'
        let tableColNameArr = [
            {title: "货件计划", field: "shipmentId"},
            {title: "箱数", field: "boxNum"},
            {title: "运单号", field: "relTransferNo"},
        ]
        openPrintTab(title,tableColNameArr,data.detailList)
    }
})
