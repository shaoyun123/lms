/**仓库人员作业一览**/
layui.use(["admin", "layer", "table", "form", "laytpl", "laydate", "element","formSelects"],function () {
    var layer = layui.layer,
        table = layui.table,
        element=layui.element,
        formSelects =layui.formSelects ,
        form = layui.form,
        laydate = layui.laydate;
    form.render('select'); //刷新select选择框渲染
    //时间渲染
    laydate.render({elem: '#homeworklist_workTime_input', range: true ,type: 'datetime' });
    homeworklist_initPage();//初始化页面

    //查询渲染表格
    $("#homeworklist_search_btn").click(function () {
        homeworklist_count_fun();
    });
    /**监听tab选项卡切换**/
    element.on('tab(homeworklist_tab)', function (data) {
        homeworklist_count_fun();
    });

    /**渲染**/
    function homeworklist_count_fun(){
        var data = homeworklist_getSeacrhData();
        if (data.timerange == null || data.timerange == '') {
            layer.msg("请选择日期", {icon: 0})
            return false;
        }
        table.render({
            elem: '#homeworklist_data_table',
            url: ctx + "/homeWorkList/countHomeWorkListByDays.html",
            page: false, //开启分页
            method: 'post',
            where: data,
            cols: [
                [ //表头
                    {field: 'creator', title: '作业员'},
                    {field: 'deptName', title: '部门'},
                    {field: 'days', title: '日期',},
                    {field: 'dayOfWeek', title: '星期几',},
                    {field: 'receiptNum', title: '收货数',},
                    {field: 'scanNum', title: '点货入库单数',width:95},
                    {field: 'loadNum', title: '扫描装车数',},
                    {field: 'shelfNum', title: '上架(审核入库单数)'},
                ]
            ],
            done: function (res, curr, count) {
                if(res.code=='0000'){
                    $("#homeworklist_total_num").html(count);
                }else{
                    layer.msg(res.msg,{icon:0});
                }
            }
        });
    }
    //导出作业一览表
    $("#homeworklist_export_btn").click(function () {
        var data = homeworklist_getSeacrhData();
        if (data.timerange == null || data.timerange == '') {
            layer.msg("请选择日期", {icon: 0})
            return false;
        }
        var startDate = data.timerange.substring(0, 10);
        var endDate = data.timerange.substring(13);
        if (!homeworklist_dateCheck_fun(startDate, endDate)) {
            return;
        }
        var confirmindex = layer.confirm('确认导出当前搜索条件下的仓库人员作业信息？', {btn: ['确认', '取消']}, function () {
            submitForm(data, ctx + '/homeWorkList/exportHomeWorkListByDays.html', "_blank")
            layer.close(confirmindex);
        }, function () {
            layer.close(confirmindex);
        })
    });
    /**获取入库明细页面查询参数**/
    function homeworklist_getSeacrhData(){
        var data = serializeObject($('#homeworklist_search_form'));
        var dateTimeStr = $.trim(data.timerange);
        if (dateTimeStr != null && dateTimeStr != '') {
            data.startDate = dateTimeStr.split(" - ")[0];
            data.endDate =dateTimeStr.split(" - ")[1];
        }
        return data;
    }
    /**
     * 获取默认当天
     */
    function homeworklist_initPage() {
        var createTimeEnd = Format(new Date(), 'yyyy-MM-dd hh:mm:ss');
        var createTimeStart = Format((new Date()).setMonth(new Date().getMonth() - 1), 'yyyy-MM-dd hh:mm:ss');
        $('#homeworklist_workTime_input').val(createTimeStart + ' - ' + createTimeEnd); //最近一个月出具
        /**初始化下拉框数据**/
        $.ajax({
            url: ctx + "/homeWorkList/getHomeWorkListPageEnum.html",
            type: 'post',
            dataType: 'json',
            success: function (returnData) {
                if (returnData.code == "0000") {
                    var sysUserList = [];
                    $(returnData.data.sysUserList).each(function() {
                        var a = { name: this.name, value: this.value };
                        sysUserList.push(a);
                    });
                    formSelects.data('homeworklist_person_sel', 'local', { arr: sysUserList });
                    form.render();
                } else {
                    layer.msg(returnData.msg, {icon: 3});
                }
            }
        });
    };
});
//判断开始日期是否大于结束日期
function homeworklist_dateCheck_fun(t1,t2) {
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
