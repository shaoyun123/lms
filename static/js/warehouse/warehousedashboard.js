/**仓管部看板**/
layui.use(["admin", "layer", "table", "form", "laytpl", "laydate", "upload", "element"],function () {
    var layer = layui.layer,
        table = layui.table,
        element=layui.element,
        formSelects =layui.formSelects ,
        form = layui.form,
        upload = layui.upload,
        laydate = layui.laydate;
    var expireMinute=5;//多少分钟刷新
    var refeshTime=expireMinute * 60 * 1000;

    //增加查询条件
    laydate.render({
        elem:'#warehousedashboard_search_byDate',
        value:Format(new Date().getTime(),'yyyy-MM-dd'),
        max:Format(new Date().getTime(),'yyyy-MM-dd'),
        min:Format(new Date().getTime()-60*60*24*1000*60,'yyyy-MM-dd')
    })
    //仓库渲染
    commonReturnPromise({
        url: '/lms/prodWarehouse/getAuthedProdWarehouse.html'
    }).then(res => {
        let targetData = res.filter(item => item.warehouseName == '昆山仓' || item.warehouseName == '义乌仓');
        let selectedData = res.filter(item => item.warehouseName == '义乌仓');
        commonRenderSelect('warehousedashboard_warehouse', targetData, {
            str: '',
            name: 'warehouseName',
            code: 'id',
            selected: selectedData[0].id
        }).then(() => {
            form.render('select'); //刷新select选择框渲染
            let initStoreId = $('#warehousedashboard_warehouse').val();
            warehousedashboard_count_fun(initStoreId, "warehousedashboard_data_table1", 1);
        });
    });

    //ztt-2021/03/11--start
    $('#warehousedashboard_upload_btn').on('change', function (e) {
        var files = e.target.files
        if (!files.length) {
            //传递完成以后清空input的value
            e.target.value = '';
          return
        }
        let storeId = $("#warehousedashboard_upload_btn_storeId").val()
        var file = files[0]
        let formData = new FormData();
        formData.append('file', file)
        //把formData传递给后台
        transBlob({
            fileName: '缺货SKU',
            url: ctx + "/warehouseDashboard/exportOutOfStockInfoForImportSkuList.html?storeId=" + storeId,//改成您自己的上传接口
            formData: formData
        }).then(function(result){
            //传递完成以后清空input的value
            e.target.value = '';
            alert(result, {icon: 1});
        }).catch(function(err){
            //传递完成以后清空input的value
            e.target.value = '';
            alert(err, {icon: 2});
        })
    });
    //ztt-2021/03/11--end
        /**5分钟自动刷新*/
    var todayTitle=Format(new Date(), 'yyyy年MM月dd')+"日仓管部看板";
    $("#warehousedashboard_pageTitle").html(todayTitle);
    // setInterval(function () {
    //     warehousedashboard_count_fun(1, "warehousedashboard_data_table1", 1)
    // }, refeshTime);
    /**
     * 加载仓库数据
     * @param storeId
     * @param tableId
     * @param one 是否第一个仓库 只有仓库1才有编辑指标
     */
    function warehousedashboard_count_fun(storeId,tableId,one){
        console.log(Format(new Date(), 'yyyy-MM-dd hh:mm:ss'))
        let searchDate = $('#warehousedashboard_search_byDate').val() || Format(new Date().getTime(), 'yyyy-MM-dd')
        let startDate = searchDate + ' 00:00:00'
        let endDate = searchDate + ' 23:59:59'
        var data = {
            startDate: startDate,
            endDate: endDate,
            storeId: storeId,
            expireMinute: expireMinute,
        };
        var htm=todayTitle+"<span id='warehousedashboard_last_refresh_span' title='上次刷新时间'>"+Format(new Date(), 'yyyy-MM-dd hh:mm:ss')+"</span>";
        $("#warehousedashboard_pageTitle").html(htm);
        var cols = [
            [ //表头
                {field: 'taskTypeName', title: '仓库流程'},
                {field: 'taskParam', title: '参数'},
                {field: 'completeNum', title: '已完成', templet: "#warehousedashboard_completeNum_tpl"},
                {field: 'waitNum', title: '待完成', templet: "#warehousedashboard_waitNum_tpl"},
                {field: 'highNum', title: '近30天最高完成', templet: "#warehousedashboard_highDays_tpl"},
                {field: 'lowerNum', title: '近30天最低完成', templet: "#warehousedashboard_lowerDays_tpl"},
            ]
        ];
        var line = {};
        if ($("#warehousedashboard_edit_target").length > 0 && one == 1) {
            line = {field: 'targetNum', title: '指标', edit: "text", templet: "#warehousedashboard_targetNum_tpl"};
        } else {
            line = {field: 'targetNum', title: '指标'};
        }
        cols[0].push(line);
        table.render({
            elem: '#'+tableId,
            id: tableId,
            url: ctx + "/warehouseDashboard/getTodayWarehouseDashboardByStoreId.html",
            page: false, //开启分页
            method: 'post',
            where: data,
            cols:cols,
            done: function (res, curr, count) {
                if(res.code=='0000'){
                    $("#"+tableId+"_warehouseName").html(res.data[0].warehouseName);//显示仓库名
                    $('.warehousedashboard_completeNum_hour').click(function(){
                        var taskType=$(this).attr("taskType");
                        var taskTypeName=$(this).attr("taskTypeName");
                        var storeId=$(this).attr("storeId");
                        var title=taskTypeName+" 今日时效";
                        layer.open({
                            type: 1,
                            title: title,
                            id:'warehousedashboard_completeNum_hour_layer',
                            shadeClose: true,
                            area: ['800px', '600px'],
                            content: $('#warehousedashboard_completeNum_layer').html(),
                            success: function () {
                                warehousedashboard_completeNum_show(storeId,taskType,taskTypeName, startDate, endDate);
                            }
                        })
                    });
                    $('.warehousedashboard_waitNum_download').click(function(){
                        let taskType = $(this).attr("taskType");
                        let storeId = $(this).attr("storeId");
                        let taskTypeName = $(this).attr("taskTypeName");
                        let status = '待完成数据'
                        warehouseDashboard_export_fun(storeId, taskType, taskTypeName, status, startDate, endDate);
                    });
                    $('.warehousedashboard_completeNum_download').click(function(){
                        let taskType = $(this).attr("taskType");
                        let storeId = $(this).attr("storeId");
                        let taskTypeName = $(this).attr("taskTypeName");
                        let status = '已完成数据'
                        warehouseDashboard_export_fun(storeId, taskType, taskTypeName, status, startDate, endDate);
                    });
                    $(".warehousedashboard_complete").each(function(){
                        $(this).parent().parent().css({"background":"#66FFCC"});
                        $(this).parent().css({"display":"flex"});
                        $(this).parent().css({"justify-content":"center"});
                    });
                    $(".warehousedashboard_wait").each(function(){
                        $(this).parent().parent().css({"background":"#FFFF99"});
                    });
                }else{
                    layer.msg(res.msg,{icon:0});
                }
            }
        });
        table.render({
            elem: '#warehousedashboard_data_table2',
            method: 'get',
            url: `${ctx}/warehouseDashboard/getTodayWarHouseAndSkuByStoreId.html`,
            where: data,
            cols: [[ //表头
                { title: "参数", field: 'taskName',},
                { title: "数值", field: 'total',templet: "#warehousedashboard_boardAndSku_tpl"},
                { title: "备注" , field: 'remark',},
            ]],
            page: true,
            id: "warehousedashboard_data_table2",
            done: function(data){
                //获取缓存时间
                if (data.extra) {
                    var htm=todayTitle+"<span id='warehousedashboard_last_refresh_span' title='上次缓存时间'>"+Format(data.extra, 'yyyy-MM-dd hh:mm:ss')+"</span>";
                    $("#warehousedashboard_pageTitle").html(htm);
                }
                $('.warehousedashboard_boardAndSku_download').click(function(){
                    var taskType=$(this).attr("taskType");
                    var taskTypeName=$(this).attr("taskTypeName");
                    warehouseAndSkuDashboard_export_fun(taskType,taskTypeName,storeId);
                });
            }
        })

    };
    /**
     * 时效数据
     */
    function warehousedashboard_completeNum_show(storeId,taskType,taskTypeName, startDate, endDate){
        var cols=[[]];
        if(taskTypeName=='收货'){
            cols= [
                [ //标题栏
                    {field: 'addressName', rowspan: 2,title: '收货地址' }
                    ,{field: 'taskParam',rowspan: 2, title: '参数',templet:'#warehousedashboard_baoguo_tpl'}
                    ,{colspan: 5, title: '今日收货数据',}
                    ,{field: 'waitNum',rowspan: 2, title: '累计待收货'}
                ],[
                    {field: 'fourNum', title: '>5D',templet:'#warehousedashboard_fourNum_tpl'}
                    ,{field: 'thirdNum',title: '3~5D',templet:'#warehousedashboard_thirdNum_tpl'}
                    ,{field: 'secondNum', title: '2~3D',templet:'#warehousedashboard_secondNum_tpl'}
                    ,{field: 'firstNum', title: '<=2D',templet:'#warehousedashboard_firstNum_tpl'}
                    ,{field: 'fiveNum', title: '未关联',templet:'#warehousedashboard_fiveNum_tpl'}
                ]
            ]
        }else if(taskTypeName=='点货'){
            cols= [
                [ //标题栏
                    {field: 'addressName', rowspan: 2,title: '收货地址' }
                    ,{field: 'taskParam',rowspan: 2, title: '参数',templet:'#warehousedashboard_sku_tpl'}
                    ,{colspan: 4, title: '今日点货数据',}
                    ,{field: 'waitNum',rowspan: 2, title: '累计已收货待点货'}
                ],[
                    {field: 'fourNum', title: '>72H',templet:'#warehousedashboard_fourNum_tpl'}
                    ,{field: 'thirdNum',title: '48-72H',templet:'#warehousedashboard_thirdNum_tpl'}
                    ,{field: 'secondNum', title: '15-48H',templet:'#warehousedashboard_secondNum_tpl'}
                    ,{field: 'firstNum', title: '<=15H',templet:'#warehousedashboard_firstNum_tpl'}
                ]
            ]
        }else if(taskTypeName=='扫描装车'){
            cols= [
                    [ //标题栏
                        {field: 'addressName', rowspan: 2,title: '收货地址' }
                        ,{field: 'taskParam',rowspan: 2, title: '参数',templet:'#warehousedashboard_sku_tpl'}
                        ,{colspan: 4, title: '今日扫描装车数据',}
                        ,{field: 'waitNum',rowspan: 2, title: '累计已点货待扫描装车'}
                    ],[
                        {field: 'fourNum', title: '>48H',templet:'#warehousedashboard_fourNum_tpl'}
                        ,{field: 'thirdNum',title: '24-48H',templet:'#warehousedashboard_thirdNum_tpl'}
                        ,{field: 'secondNum', title: '8.5-24H',templet:'#warehousedashboard_secondNum_tpl'}
                        ,{field: 'firstNum', title: '<=8.5H',templet:'#warehousedashboard_firstNum_tpl'}
                    ]
                ]
        }else if(taskTypeName=='上架'){
            cols= [
                    [ //标题栏
                        {field: 'addressName', rowspan: 2,title: '收货地址' }
                        ,{field: 'taskParam',rowspan: 2, title: '参数',templet:'#warehousedashboard_sku_tpl'}
                        ,{colspan: 4, title: '今日上架数据',}
                        ,{field: 'waitNum',rowspan: 2, title: '累计待上架'}
                    ],[
                        {field: 'fourNum', title: '>72H',templet:'#warehousedashboard_fourNum_tpl'}
                        ,{field: 'thirdNum',title: '48-72H',templet:'#warehousedashboard_thirdNum_tpl'}
                        ,{field: 'secondNum', title: '15-48H',templet:'#warehousedashboard_secondNum_tpl'}
                        ,{field: 'firstNum', title: '<=15H',templet:'#warehousedashboard_firstNum_tpl'}
                    ]
               ]
        } else if (taskTypeName == '配货' || taskTypeName == '多品核单' || taskTypeName == '包货' || taskTypeName == '分拣核查' || taskTypeName == '配货-单品' || taskTypeName == '配货-多品') {
            cols= [
                [ //标题栏
                    {field: 'taskTypeName', rowspan: 2,title: '' }
                    ,{field: 'fiveNum', title: '>5H',templet:'#warehousedashboard_fiveNum_tpl'}
                    ,{field: 'fourNum', title: '3-5H',templet:'#warehousedashboard_fourNum_tpl'}
                    ,{field: 'thirdNum',title: '2-3H',templet:'#warehousedashboard_thirdNum_tpl'}
                    ,{field: 'secondNum', title: '1-2H',templet:'#warehousedashboard_secondNum_tpl'}
                    ,{field: 'firstNum', title: '<=1H',templet:'#warehousedashboard_firstNum_tpl'}
                ]
            ]
        }
        table.render({
            elem: '#warehousedashboard_completeNum_table',
            method: 'post',
            url: ctx + '/warehouseDashboard/getTodaycompleteDashboardByStoreIdAndtype.html',
            where: { 'storeId': storeId, 'taskType': taskType, "expireMinute": expireMinute, 'startDate': startDate, 'endDate': endDate },
            cols: cols
        })
    }
    /**修改仓库指标值**/
    table.on('edit(warehousedashboard_data_table1)', function(obj) {
        var value = obj.value //得到修改后的值
            , data = obj.data //得到所在行所有键值
            , field = obj.field; //得到字段
        var entity = {
            id : data.id
        }
        entity[field] = value;
        loading.show()
        $.ajax({
            url: ctx + "/warehouseDashboard/updateWarehouseDashboardIntervalById.html",
            type: 'post',
            dataType: "json",
            data: entity,
            success: function(res) {
                loading.hide()
                if (res.code == '0000') {
                    layer.msg('修改指标成功',{icon:1})
                } else {
                    layer.msg(res.msg,{icon:2})
                }
            },
            error: function () {
                loading.hide()
            }
        })
    });
    //导出待完成 /已完成
    function warehouseDashboard_export_fun(storeId, taskType,taskTypeName,status, startDate, endDate) {
        // if(!storeId){
        //     storeId=1;
        // }
        if (taskType == "outstock") {
            $("#warehousedashboard_upload_btn_storeId").val(storeId)
            $("#warehousedashboard_upload_btn").click();
            return;
        }
        var data = {
            "storeId": storeId,
            "taskType": taskType,
            startDate: startDate,
            endDate: endDate,

        };
        var confirmindex = layer.confirm('确认导出 '+taskTypeName+' '+status, {btn: ['确认', '取消']}, function () {
            submitForm(data, ctx + '/warehouseDashboard/exportTodayWaitInfoByStoreIdAndtype.html', "_blank")
            layer.close(confirmindex);
        }, function () {
            layer.close(confirmindex);
        })
    }
    //导出待完成
    function warehouseAndSkuDashboard_export_fun( taskType,taskTypeName,storeId) {

        var data = {
            "storeId": storeId,
            "taskType": taskType
        };
        var confirmindex = layer.confirm('确认导出 '+taskTypeName+' sku数据？', {btn: ['确认', '取消']}, function () {
            submitForm(data, ctx + '/warehouseDashboard/exportWarHouseAndSkuByStoreId.html', "_blank")
            layer.close(confirmindex);
        }, function () {
            layer.close(confirmindex);
        })
    }

    //时间查询
    $('#warehousedashboard_searchByDate').click(function () {
        let storeId = $('#warehousedashboard_warehouse').val();
        warehousedashboard_count_fun(storeId, "warehousedashboard_data_table1", 1);
    })
});


function wareHouseGetPercent(numerator,arr){
    let denominator = arr.reduce(function(accumulator, currentValue){
        return accumulator+currentValue
    })
    return denominator?Number(numerator/denominator*100).toFixed(2):0.00
}
