//导出触发事件
$("#export_excel_button").click(function () {
    //获取到当前被选中的页签的下标
    var status = $('#scan_storage_error_hidden_mark').val();
    export_error_search_button(status);
});

//导出函数
function export_error_search_button(processStatus) {
    var timeStr = $("#scan_storage_error_form input[name=time]").val();
    var startTime = '';
    var endTime = '';
    if (timeStr) {
        startTime = timeStr.split(" - ")[0] + " 00:00:00";
        endTime = timeStr.split(" - ")[1] + " 23:59:59";
    }
    var dateTypeName = $("#scan_storage_error_form select[name=scan_error_search_type]").val();
    var dateType = 1;
    if (dateTypeName) {
        if (dateTypeName === 'scan_feed_back_time') {
            dateType = 1;
        }
        if (dateTypeName === 'scan_deal_time') {
            dateType = 2;
        }
    }
    //每页显示数据条数
    var SCR_limitAllAppoint = 1000000;
    //当前页数
    var SCR_currentPageAllAppoint = 1;

    var storageNumber = $("#scan_storage_error_form input[name = scan_error_storage_number]").val();
    var scanPersonIds = layui.formSelects.value('scan_error_scan_person', 'valStr');
    var purOrderPersonIds = layui.formSelects.value('scan_error_pur_order_person', 'valStr');
    var errorRemarks = layui.formSelects.value('scan_storage_error_type', 'nameStr');
    var purErrorFeedbackCode = $("#scan_storage_error_form select[name = purErrorFeedbackCode]").val();
    var dealPersonName = $("#scan_storage_error_form input[name = dealPersonName]").val();
    var billNumber = $("#scan_storage_error_form input[name = scan_error_bill_number]").val();
    var skus = $("#scan_storage_error_form input[name = scan_error_sku]").val();
    var warehouseId = $("#scan_storage_error_form select[name = warehouseId]").val();
    var processStatusList = layui.formSelects.value('processStatusList', 'valStr');
    var data = {
        storageNumber: storageNumber,
        scanPersonIds: scanPersonIds,
        errorRemarks: errorRemarks,
        startTime: startTime,
        endTime: endTime,
        dateType: dateType,
        processStatus: processStatus,
        dealPerson: dealPersonName,
        billNumber: billNumber,
        page: SCR_currentPageAllAppoint,
        purOrderPersonIds: purOrderPersonIds,
        skus: skus,
        limit: SCR_limitAllAppoint,
        warehouseId: warehouseId,
        purErrorFeedbackCode: purErrorFeedbackCode,
        processStatusList: processStatusList
    };
    //前端Null 为真 非null为false
    if (data.startTime == '') {
        layer.alert('导出必选时间，且选择的时间区间不能大于180天', {icon: 3});
        return;
    }

    if (IsOvertime(data.startTime,data.endTime)) {
        layer.alert('选择的时间区间不能大于180天', {icon: 3});
        return;
    }

    submitForm(data, ctx + '/errorFeedback/export.html');
}


/**
 * @return {boolean}
 */
function IsOvertime(startTime,endTime) {
    var time1 = Date.parse(new Date(startTime));//起始时间毫秒数
    var time2 = Date.parse(new Date(endTime));//结束时间毫秒数
    var nDays = Math.abs(parseInt((time2 - time1) / 1000 / 3600 / 24));//间隔天数
    return nDays > 180;
}