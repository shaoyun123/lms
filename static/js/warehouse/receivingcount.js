/**收货包裹统计**/
layui.use(["admin", "layer", "table", "form", "laytpl", "laydate", "element", "formSelects"],function () {
    var layer = layui.layer,
        table = layui.table,
        element=layui.element,
        form = layui.form,
        formSelects = layui.formSelects,
        laydate = layui.laydate;

    //时间渲染
    laydate.render({elem: '#receivingcount_createTime_input', range: true,type: 'datetime'});
    /**初始化下拉框数据**/
    $.ajax({
        url: ctx + "/checkGoods/getCheckGoodsPageEnum.html",
        type: 'post',
        dataType: 'json',
        success: function (returnData) {
            if (returnData.code == "0000") {
                var str = "<option value=''></option>"
                $(returnData.data.buyerList).each(function () {
                    str += '<option value="' + this + '">' + this + '</option>'
                });
                $("#receivingcount_creator").html(str);
                formSelects.render('receivingcount_creator');
            }else{
                layer.msg(returnData.msg,{icon:3});
            }
        }
    });
    receivingcount_setLatestMonth();
    //查询渲染表格
    $("#receivingcount_search_btn").click(function () {
        receivingcount_count_fun();
    });
    /**监听tab选项卡切换**/
    element.on('tab(receivingcount_tab)', function (data) {
        receivingcount_count_fun();
    });

    /**根据条件统计收货包裹**/
    function receivingcount_count_fun(){
        var data = receivingcount_getSeacrhData();
        table.render({
            elem: '#receivingcount_data_table',
            url: ctx + "/checkGoods/countCheckGoodsByPackageType.html",
            page: false, //开启分页
            method: 'post',
            where: data,
            cols: [
                [ //表头
                    {field: 'creator', title: '收货人'},
                    {field: 'deptName', title: '收货部门'},
                    {field: 'totalParcelNumber', title: '总包裹数',},
                    {field: 'totalCountNum', title: '总快递单',},
                    {field: 'notRelationCount', title: '未关联',},
                    {field: 'returnCount', title: '退货',},
                    {field: 'stockCrashCount', title: '缺货紧急',},
                    {field: 'stockCrashCount', title: '缺货紧急(虚拟仓)',},
                    {field: 'stockCrashCount', title: '缺货紧急(托管单)',},
                    {field: 'buyerCrashCount', title: '采购紧急',},
                    {field: 'directPackCount', title: '直接包装'},
                    {field: 'overseaCount', title: '海外仓'},
                    {field: 'fangyiCount', title: '防疫包裹'},
                    {field: 'zhijianCount', title: '质检包裹'},
                    {field: 'buySampleCount', title: '采样订单'},
                    {field: 'normalCount', title: '正常包裹'},
                ]
            ],
            done: function (res, curr, count) {
                if(res.code=='0000'){
                    $("#receivingcount_total_num").html(count);
                }else{
                  layer.msg(res.msg,{icon:0});
                }

            }
        });
    }
    //导出收货包裹统计
    $("#receivingcount_export_btn").click(function () {
        var data = receivingcount_getSeacrhData();
        data.exportType=1;
        if (data.startDate == null || data.startDate == '') {
            layer.msg("请选择日期", {icon: 0})
            return false;
        }
        if(!receivingcount_dateCheck_fun(data.startDate,data.endDate)){
            return;
        }
        var confirmindex = layer.confirm('确认导出当前搜索条件下的收货包裹统计信息？', {btn: ['确认', '取消']}, function () {
            submitForm(data, ctx + '/checkGoods/exportCollectGoods.html', "_blank")
            layer.close(confirmindex);
        }, function () {
            layer.close(confirmindex);
        })
    });
    /**获取收货包裹统计页面查询参数**/
    function receivingcount_getSeacrhData(){
        var data = serializeObject($('#receivingcount_search_form'));
        var dateTimeStr = $.trim(data.startAndEndTime);
        if (dateTimeStr != null && dateTimeStr != '') {
            data.startDate = dateTimeStr.split(" - ")[0];
            data.endDate =dateTimeStr.split(" - ")[1];
        }
        if(data.creatorId && data.creatorId.length>0){
          let creatorIdArr = layui.formSelects.value('receivingcount_creator');
          let consigneeNameList = creatorIdArr.map(item => item.val);
          data.consigneeNameList = consigneeNameList.join(',');
        }else{
          data.consigneeNameList = '';
        }
        delete data.creatorId;
        return data;
    }
    /**
     * 获取当前月份
     */
    function receivingcount_setLatestMonth() {
        var createTimeEnd = Format(new Date().setHours(23,59,59,999), 'yyyy-MM-dd hh:mm:ss');
        var createTimeStart = Format(new Date((new Date()).setMonth(new Date().getMonth() - 1)).setHours(0,0,0,0), 'yyyy-MM-dd hh:mm:ss');
        $('#receivingcount_createTime_input').val(createTimeStart + ' - ' + createTimeEnd);
    };
});
//判断开始日期是否大于结束日期
function receivingcount_dateCheck_fun(t1,t2) {
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
