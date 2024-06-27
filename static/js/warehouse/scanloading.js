/**扫描装车**/
layui.use(["admin", "layer", "table", "form", "laytpl", "laydate", "element"],function () {
    var layer = layui.layer,
        table = layui.table,
        element=layui.element,
        form = layui.form,
        laydate = layui.laydate;


    /**入库单输入框**/
    $('#scanloading_storageNumber').keydown(function(e) {
        if (e.keyCode == 13) {
            scanloading_submit();
            return false;
        }
    });

    $("#scanloading_submit_btn").click(function () {
        scanloading_submit();
    });
    /**
     * 终止扫描
     */
    $("#scanloading_endScan_btn").click(function () {
        $.ajax({
            url: ctx + '/scanStorageService/scanLoadingEnd.html',
            dataType: 'json',
            contentType: 'application/json;charset=UTF-8',
            type: 'post',
            data: JSON.stringify({ "channel": "epean"}),
            success: function(returnData) {
                loading.hide();
                if (returnData.code == "0000") {
                    layer.closeAll();
                    layer.msg(returnData.msg, { icon: 1 });
                    $("#scanloading_storageNumber_text").html('');
                    $("#scanloading_stockLocation_input").html('');
                    $("#scanloading_region_input").html('');
                    $("#scanloading_scanNum_input").html(0);
                } else {
                    layer.msg(returnData.msg, { icon: 2 });
                }
                $("#scanloading_storageNumber").val('');
                $("#scanloading_storageNumber").focus();
            },
            error: function(returnData) {
                layer.msg(returnData.msg, { icon: 2 });
            }
        });
    });

    /**
     * 扫描提交
     */
    function scanloading_submit(){
        $("#scanloading_stockLocation_input").val("");
        $("#scanloading_region_input").val("");
        var storageNumber = $("#scanloading_storageNumber").val();//入库单号
        if (storageNumber == null || storageNumber == '') {
            layer.msg("请扫描入库单号", {icon: 0});
            return false;
        }else{
            /**获取入库单信息**/
            loading.show();
            $.ajax({
                url: ctx + '/scanStorageService/scanStorageNumberLoading.html',
                dataType: 'json',
                contentType: 'application/json;charset=UTF-8',
                type: 'post',
                data: JSON.stringify({"storageNumber": storageNumber, "channel": "epean"}),
                success: function(returnData) {
                    loading.hide();
                    var obj=returnData.data;
                    if (returnData.code == "0000") {
                        layer.closeAll();
                        layer.msg(returnData.msg, { icon: 1 });
                        $("#scanloading_storageNumber_text").html(storageNumber);
                        $("#scanloading_stockLocation_input").html(obj.stockLocation);
                        $("#scanloading_region_input").html(obj.region);
                        $("#scanloading_scanNum_input").html(obj.alreadyScanNum);
                    } else {
                        layer.msg(returnData.msg, { icon: 2 });
                    }
                    $("#scanloading_storageNumber").val('');
                    $("#scanloading_storageNumber").focus();
                },
                error: function(returnData) {
                    layer.msg(returnData.msg, { icon: 2 });
                }
            });
            return false;
        }
    };
    /**监听tab选项卡切换**/
    var scanloading_tab_index=0;
    element.on('tab(scanloading_tab)', function (data) {
        if(data.index==0){//详情页面
            scanloading_tab_index=0;
        }else{ //扫描记录页面
            scanloading_data_fun();
        }
    });
    /**展示扫描记录**/
    function scanloading_data_fun(){
        var data = {"pageSize":"30"};
        table.render({
            elem: '#scanloading_data_table',
            url: ctx + "/scanStorageService/getDayAndMonthScanNumFromWeb.html",
            page: false, //开启分页
            method: 'post',
            where: data,
            cols: [
                [ //表头
                    {field: 'storageNumber', title: '入库单'},
                    {field: 'createTime', title: '扫描时间',templet: '<div>{{format(d.createTime,"yyyy-MM-dd hh:mm:ss")}}</div>',},
                ]
            ],
            done: function (res, curr, count) {
                if (res.code != '0000') {
                    layer.msg(res.msg, {icon: 0});
                }
            }
        });
    }
});
