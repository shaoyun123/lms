/**扫描装车统计**/
layui.use(["admin", "layer", "table", "form", "laytpl", "laydate", "element"],function () {
    var layer = layui.layer,
        table = layui.table,
        element=layui.element,
        form = layui.form,
        laydate = layui.laydate;

    //时间渲染
    laydate.render({elem: '#scanload_createTime_input', range: true ,type: 'datetime' });
    /**初始化下拉框数据**/
    $.ajax({
        url: ctx + "/scanload/getScanloadPageEnum.html",
        type: 'post',
        dataType: 'json',
        success: function (returnData) {
            if (returnData.code == "0000") {
                var str = "<option value=''></option>"
                $(returnData.data.buyerList).each(function () {
                    str += '<option value="' + this.value + '">' + this.name + '</option>'
                });
                $("#scanload_creator_sel").html(str);
                form.render('select');
            }else{
                layer.msg(returnData.msg,{icon:3});
            }
        }
    });
    scanload_setLatestMonth();
    //查询渲染表格
    $("#scanload_search_btn").click(function () {
        scanload_render_fun();
    });
    /**监听tab选项卡切换**/
    var scanload_tab_index=0;
    element.on('tab(scanload_tab)', function (data) {
        if(data.index==0){//详情页面
            scanload_tab_index=0;
        }else{ //统计页面
            scanload_tab_index=1;
        }
        scanload_render_fun();
    });

    /**查询**/
    function scanload_render_fun(){
        if(scanload_tab_index==0){
            scanload_search_fun();
        }else{
            scanload_count_fun();
        }
    };
    /**
     * 页面搜索
     */
    function scanload_search_fun(){
        var data = scanload_getSeacrhData();
        table.render({
            elem: '#scanload_detail_data_table'  ,
            url: ctx + "/scanload/searchScanloadInfoByDto.html" ,
            page: true  ,//开启分页
            where: data,
            method: 'post',
            cols: [
                [ //表头
                     {field: 'creator', title: '扫描人'},
                     {field: 'deptName', title: '扫描部门'},
                     {field: 'createTime', title: '扫描时间',templet:'#scanload_createTime_tpl'},
                     {field: 'storageNumber', title: '入库单号'},
                     {field: 'storageNum',sort: true, title: '入库数量'},
                     {field: 'stockLocation', title: '库位',templet:'#scanload_stockLocation_tpl'},
                     {field: 'processStatus', title: '是否已审核',templet:'#scanload_processStatus_tpl'},
                     {field: 'auditTime', title: '审核时间',templet:'#scanload_auditTime_tpl'},
                ]
            ],
            limits: [100, 200, 300],
            limit: 100,
            done: function(res, curr, count) {
                if(res.code='0000'){
                    $("#scanload_detail_num").html(count);
                }else{
                    layer.msg(res.msg,{icon:2});
                }
            }
        });
    };
    /**根据条件统计**/
    function scanload_count_fun(){
        var data = scanload_getSeacrhData();
        if(data.startDate==null||data.startDate==''){
            layer.msg("请选择时间区间",{icon:0});
            return false;
        }
        table.render({
            elem: '#scanload_count_data_table',
            url: ctx + "/scanload/summaryScanloadInfoByDto.html",
            page: false, //开启分页
            method: 'post',
            where: data,
            cols: [
                [ //表头
                    {field: 'creator', title: '扫描人'},
                    {field: 'deptName', title: '扫描部门'},
                    {field: 'storageNumber', title: '扫描时间',},
                    {field: 'storageNumCount',sort: true, title: '扫描入库单数',},
                    {field: 'auditStorageCount',sort: true, title: '审核入库单数',},
                ]
            ],
            done: function (res, curr, count) {
                if (res.code == '0000') {
                    $("#scanload_count_num").html(count);
                } else {
                    layer.msg(res.msg, {icon: 2});
                }
            }
        });
    };
    //导出
    $("#scanload_export_btn").click(function () {
        var data = scanload_getSeacrhData();
        data.exportType = scanload_tab_index;
        if(data.startDate==null||data.startDate==''){
            layer.msg("请选择时间区间",{icon:0});
            return false;
        }
        if (!scanload_dateCheck_fun(data.startDate, data.endDate)) {
            return;
        }
        var confirmindex = layer.confirm('确认导出当前搜索条件下的扫描装车信息？', {btn: ['确认', '取消']}, function () {
            submitForm(data, ctx + '/scanload/exportScanloadInfo.html', "_blank")
            layer.close(confirmindex);
        }, function () {
            layer.close(confirmindex);
        })
    });
    /**获取页面查询参数**/
    function scanload_getSeacrhData(){
        var data = serializeObject($('#scanload_search_form'));
        var dateTimeStr = $.trim(data.startAndEndTime);
        if (dateTimeStr != null && dateTimeStr != '') {
            data.startDate = dateTimeStr.split(" - ")[0];
            data.endDate =dateTimeStr.split(" - ")[1];
        }
        if(scanload_tab_index == 1){
            data.storageNumber='';
        }
        if(data.processStatus==''){
            delete  data.processStatus;
        }
        return data;
    }
    /**
     * 获取当前月份
     */
    function scanload_setLatestMonth() {
        var createTimeEnd = Format(new Date(), 'yyyy-MM-dd hh:mm:ss');
        var createTimeStart = Format((new Date()).setMonth(new Date().getMonth() - 1), 'yyyy-MM-dd hh:mm:ss');
        $('#scanload_createTime_input').val(createTimeStart + ' - ' + createTimeEnd);
    };
});
//判断开始日期是否大于结束日期
function scanload_dateCheck_fun(t1,t2) {
    var start = new Date(t1).getTime();
    var end = new Date(t2).getTime();
    if(start > end){
        layer.msg("开始日期不能大于结束日期",{icon:0});
        return false;
    }
    var days = parseInt((end-start) / (1000 * 60 * 60 * 24));
    if(days > 180){
        layer.msg("日期范围超过半年",{icon:0});
        return false;
    }
    return true;
}
