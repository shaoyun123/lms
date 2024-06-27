layui.use(["admin", "form", "table", "layer", "laytpl",'laydate', 'element'], function () {
    var admin = layui.admin,
        form = layui.form,
        table = layui.table,
        layer = layui.layer,
        laytpl = layui.laytpl,
        element = layui.element,
        laydate = layui.laydate,
        $ = layui.$;

    //初始化操作人
    $.ajax({
        type: "POST",
        url: ctx + "/sysuser/listbyorgid.html",
        contentType: 'application/json',
        dataType: 'json',
        success: function (returnData) {
            if (returnData.code == "0000") {
                $("#stockLocaBindSkuLog_form select[name=bindUserId]").html("<option value=''>请选择</option>");
                $(returnData.data).each(function(){
                    $("#stockLocaBindSkuLog_form select[name=bindUserId]").append("<option value='"+this.id+"'>"+this.userName+"</option>");
                });
                form.render('select');
            } else {
                layer.msg(returnData.msg);
            }
        },
        error: function () {
            layer.msg("服务器正忙");
        },
        // complete: function () {
        //     loading.hide();
        // }
    });
    //初始化仓库
    $.ajax({
        type: "POST",
        url: ctx + "/prodWarehouse/getAllProdWarehouse.html",
        contentType: 'application/json',
        dataType: 'json',
        success: function (returnData) {
            if (returnData.code == "0000") {
                $("#stockLocaBindSkuLog_form select[name=warehouseId]").html("");
                $(returnData.data).each(function(){
                    $("#stockLocaBindSkuLog_form select[name=warehouseId]").append("<option value='"+this.id+"'>"+this.warehouseName+"</option>");
                });
                form.render('select');
            } else {
                layer.msg(returnData.msg);
            }
        },
        error: function () {
            layer.msg("服务器正忙");
        },
        complete: function () {
            loading.hide();
        }
    });


    form.render("select");
    form.render("radio");
    form.render("checkbox");
    laydate.render({
        elem: '#stockLocaBindSkuLog_operTime', //渲染时间
        range: true
    });

    /**
     * 导出日志
     */

    $('#stockLocationBindSkuLog_exportLogInfo').click(function(){
        var data=stockLocationBindSkuLog_getSearchData();//搜索参数
        var Confirmindex = layer.confirm('确认导出当前搜索条件下的日志信息？',{btn:['确认','取消']},function (result) {
            if(result){
                layer.close(Confirmindex );
                submitForm(data,ctx + '/stockLocationBindSku/exportLog.html',"_blank");
            }
        })
    });
    /**
 * 渲染表格
 */
function stockLocationBindSkuLog_search(){
    var data=stockLocationBindSkuLog_getSearchData();//搜索参数
    table.render({
        elem: "#stockLocaBindSkuLog_table1",
        method: "post",
        url: ctx + '/stockLocationBindSku/getLog.html',
        where: data,
        id: "stockLocaBindSkuLog_table1",
        page: true,
        limits:[50,100,200],
        limit:50,
        cols: [
            [
                //标题栏
                {
                    field: "operTime",
                    title: "时间",
                    templet: "<div>{{layui.util.toDateString(d.operTime,'yyyy-MM-dd HH:mm:ss')}}</div>"
                },
                {field: "operater", title: "操作人"},
                {field: "sSku", title: "SKU"},
                {field: "locationCode", title: "新库位"},
                {field: "oldLocationCode", title: "原库位"},
                {field: "operType", title: "动作"},
            ],
        ]
    });
}
function stockLocationBindSkuLog_getSearchData() {
    var data = {};
    var timeStr = $("#stockLocaBindSkuLog_form input[name=time]").val();
    if (timeStr) {
       data.startTime = Date.parse(timeStr.split(" - ")[0] + " 00:00:00");
       data.endTime = Date.parse(timeStr.split(" - ")[1] + " 23:59:59");
    }
    data.warehouseId=$("#stockLocaBindSkuLog_form select[name=warehouseId]").val();
    data.warehouseName = $("#stockLocaBindSkuLog_form select[name=warehouseId]").find("option:selected").text();
    data.bindUserId=$("#stockLocaBindSkuLog_form select[name=bindUserId]").val();
    data.locationCodeSearchType=$.trim($("#stockLocaBindSku_searchtype_sel").val());
    data.stockLocation=$("#stockLocaBindSkuLog_form input[name=stockLocation]").val();
    data.prodSSkuStr=$("#stockLocaBindSkuLog_form input[name=prodSSkuStr]").val();
    return data;
}
$('#stockLocaBindSkuLog_search').on('click', function(){
    stockLocationBindSkuLog_search()
})
});

