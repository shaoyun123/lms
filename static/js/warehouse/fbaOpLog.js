console.log("fbaOpLog");
//结构
//初始化和数据结构定义
//click事件定义
//表单事件最后
//无业务意义的方法
layui.use(['admin', 'form', 'table', 'layer', 'layedit', 'element', 'laypage', 'upload', 'laydate','laytpl' ], function () {
    var form = layui.form,
        table = layui.table,
        laypage = layui.laypage,
        layer = layui.layer,
        laydate = layui.laydate,
        laytpl = layui.laytpl,
        upload = layui.upload;
    laydate = layui.laydate;
    form.render('checkbox');
    form.render('radio');

    laydate.render({
        elem: '#fbaOpLog_Form input[name=time]', //渲染时间
        range: true
    });
    //自定义模板可用函数
    //处理后台8位字符串日期
    laytpl.fbaOpLog_dealOpDay = function(strObj) {
        console.log(strObj);
        console.log(strObj.replace(/^(\d{4})(\d{2})(\d{2})$/, "$1-$2-$3"));
        return strObj.replace(/^(\d{4})(\d{2})(\d{2})$/, "$1-$2-$3");
    };
    var nowdate = new Date()
    var nowdate_y2 = nowdate.getFullYear();
    var nowdate_m2 = nowdate.getMonth()+1;
    var nowdate_d2 = nowdate.getDate();
    //获取系统前一个月的时间
    nowdate.setMonth(nowdate.getMonth()-1);
    var lastMonthday_y2 = nowdate.getFullYear();
    var lastMonthday_m2 = nowdate.getMonth()+1;
    var lastMonthday_d2 = nowdate.getDate();
    var formatwdate = lastMonthday_y2+'-'+lastMonthday_m2+'-'+lastMonthday_d2 +" - "+nowdate_y2+'-'+nowdate_m2+'-'+nowdate_d2;
    $('#fbaOpLog_Form input[name=time]').val(formatwdate);

    var tablecol = {
        'fbaOpLog_table': [
            [
                {title: "作业员", field: "opUserName",style:'background-color: #0099FF;',event:'listDayUserLog', totalRowText: '合计'},
                {title: "配货SKU数量", field: "sumSkuMatchNum", totalRow: true,totalRowDecimals: 0},
                {title: "配货货物数量", field: "sumGoodsNum", totalRow: true,totalRowDecimals: 0},
                {title: "单品贴标<br/>货品SKU数量", field: "sumSiTag", totalRow: true,totalRowDecimals: 0},
                {title: "单品贴标<br/>货品数量", field: "sumSiTagGoodsNum", totalRow: true,totalRowDecimals: 0},
                // {title: "单品存箱<br/>货品SKU数量", field: "sumSiPut"},
                {title: "多品贴标<br/>货品SKU数量", field: "sumCobTag", totalRow: true,totalRowDecimals: 0},
                {title: "多品贴标<br/>货品数量", field: "sumCobTagGoodsNum", totalRow: true,totalRowDecimals: 0},
                // {title: "多品存箱<br/>货品SKU数量", field: "sumCobPut"},
                {title: "存箱货品SKU数量", field: 'newSumCobPut',totalRow: true,totalRowDecimals: 0},
                {title: "打包<br/>货件计划数", field: "sumShipTake", totalRow: true,totalRowDecimals: 0},
                {title: "打包<br/>箱数", field: "sumShipBoxNumTake", totalRow: true,totalRowDecimals: 0},
                {title: "打包<br/>商品数", field: "sumShipUnitsNumTake", totalRow: true,totalRowDecimals: 0},
                {title: "打包<br/>重量(kg)", field: "newSumShipTakeWeight", totalRow: true,totalRowDecimals: 2},
                {title: "发货<br/>货件计划数", field: "sumShipSend", totalRow: true,totalRowDecimals: 0},
                {title: "发货<br/>箱数", field: "sumShipSendBoxNum", totalRow: true,totalRowDecimals: 0},
                {title: "发货<br/>重量(kg)", field: "newSumShipSendWeight",totalRow: true,totalRowDecimals: 2},
            ]
        ],
        'fbaOpLog_userlog_table': [
            [
                {title: "作业员", field: "opUserName"},
                {title: "日期", field: "opDay",templet:"#fbaOpLog_date_trans_tpl"},
                {title: "配货SKU数量", field: "sumSkuMatchNum"},
                {title: "配货货物数量", field: "sumGoodsNum"},
                {title: "单品贴标<br/>货品SKU数量", field: "sumSiTag"},
                {title: "单品贴标<br/>货品数量", field: "sumSiTagGoodsNum"},
                // {title: "单品存箱<br/>货品SKU数量", field: "sumSiPut"},
                {title: "多品贴标<br/>货品SKU数量", field: "sumCobTag"},
                {title: "多品贴标<br/>货品数量", field: "sumCobTagGoodsNum"},
                // {title: "多品存箱<br/>货品SKU数量", field: "sumCobPut"},
                {title: "存箱货品SKU数量", field: "sumCobPut", templet: "<div>{{(d.sumCobPut || 0) + (d.sumSiPut || 0)}}</div>"},
                {title: "打包<br/>货件计划数", field: "sumShipTake"},
                {title: "打包<br/>箱数", field: "sumShipBoxNumTake"},
                {title: "打包<br/>商品数", field: "sumShipUnitsNumTake"},
                {title: "打包<br/>重量(kg)", field: "sumShipTakeWeight",templet: '<div>{{d.sumShipTakeWeight ? (d.sumShipTakeWeight).toFixed(2) : 0}}</div>'},
                {title: "发货<br/>货件计划数", field: "sumShipSend"},
                {title: "发货<br/>箱数", field: "sumShipSendBoxNum"},
                {title: "发货<br/>重量(kg)", field: "sumShipSendWeight",templet: '<div>{{d.sumShipSendWeight ? (d.sumShipSendWeight).toFixed(2) : 0}}</div>'},
            ]
    ],
        'fbaOpLog_dashboard_table' : [
            [ //表头
                {field: 'taskTypeName', title: '仓库流程'},
                {field: 'taskParam', title: '参数'},
                {field: 'completeNum', title: '已完成', templet: "#fba_warehousedashboard_completeNum_tpl"},
                {field: 'waitNum', title: '待完成', templet: "#fba_warehousedashboard_waitNum_tpl"},
                {field: 'highNum', title: '近30天最高完成', templet: "#fba_warehousedashboard_highDays_tpl"},
                {field: 'lowerNum', title: '近30天最低完成', templet: "#fba_warehousedashboard_lowerDays_tpl"},
            ]
        ]
    };




    // 弹框-----------------
//监听工具栏操作(精简化操作,使用封装方法的形式,使代码简洁,简单ajax无需封装)
    for (var i in tablecol) {
        table.on('tool(' + i + ')', function (obj) {
            var data = obj.data;
            var layEvent = obj.event;
            if (layEvent === 'listDayUserLog') {
                //todo
                layer.open({
                    type: 1,
                    title: '存箱',
                    btn: [ '关闭'],
                    area: ['80%', '700px'],
                    content: $('#fbaOpLog_userlog_table_tpl').html(),
                    success: function (index, layero) {

                        var req=tea_getFormReqObj_ver1('fbaOpLog_Form');
                        if (req.time) {
                            req.startDate = Date.parse(req.time.split(" - ")[0].replace(/-/g,"/") + " 00:00:00");
                            req.endDate = Date.parse(req.time.split(" - ")[1].replace(/-/g,"/") + " 23:59:59");
                        }
                        tea_Ajax_ver1('/amazonFbaShipOpLog/queryByUser.html',  JSON.stringify({opUserId:data.opUserId,startDate:req.startDate,endDate:req.endDate}), function (returnData) {
                            tea_renderTable_ver1(returnData.data,'fbaOpLog_userlog_table',tablecol.fbaOpLog_userlog_table,function () {
                                // imageLazyload();
                            }, 550);
                            // tea_renderPage_ver1('FBAhistoryForm','FBAhistory_page',returnData.count, req.page, req.limit,[10,50,100], form_search);
                        });
                    }
                })
            }
        });
    }


    // 表单提交
    //验证 //分页效果,从按钮触发是否可以重置//如果不能重置,则改为非表单提交,表单的目的做数据校验
    form.on('submit(fbaOpLog_Search)', function (data) {//作为初次提交
        // data.field.page = 1;//保障首次分页请求中带有的值正确,分页首次为第一页,如果页面刷新业务需要保持在原有页,则注释此行
        form_search(data.field);
    });


    function form_search(req) {//初次search的入口
        if (req.time) {
            req.startDate = Date.parse(req.time.split(" - ")[0].replace(/-/g,"/") + " 00:00:00");
            req.endDate = Date.parse(req.time.split(" - ")[1].replace(/-/g,"/") + " 23:59:59");
        }
        table.render({
          elem: '#fbaOpLog_table'
          ,url: '/lms/amazonFbaShipOpLog/queryPage.html'
          ,contentType: 'application/json'
          ,method: 'post'
          ,where: req
          ,page: false //开启分页
          ,limit: 10000
          ,cols: tablecol.fbaOpLog_table
          ,totalRow: true
          ,created(res){
            for(let i=0; i<res.data.length; i++){
              let item = res.data[i];
              item.newSumCobPut = (item.sumCobPut || 0) + (item.sumSiPut || 0);
              item.newSumShipTakeWeight = item.sumShipTakeWeight ? (item.sumShipTakeWeight).toFixed(2) : 0;
              item.newSumShipSendWeight = item.sumShipSendWeight ? (item.sumShipSendWeight).toFixed(2) : 0;
            }
            return res;
          }
          ,done(){
            $('#fbaOpLog_table').next().find('.layui-table-total table td[data-field=opUserName]').css('background-color', '#fff')
          }
        })

        var dashboardRequest = {};
        dashboardRequest.storeId = 8;
        tea_Ajax_ver1('/amazonFbaShipOpLog/getFbaTodayWarehouseDashboardByStoreId.html',  JSON.stringify(dashboardRequest), function (returnData) {
            tea_renderTable_ver1(returnData.data,'fbaOpLog_dashboard_table',tablecol.fbaOpLog_dashboard_table,function () {
                // imageLazyload();

                $(".fba_warehousedashboard_complete").each(function(){
                    $(this).parent().parent().css({"background":"#66FFCC"});
                });
                $(".fba_warehousedashboard_wait").each(function(){
                    $(this).parent().parent().css({"background":"#FFFF99"});
                });
                //绑定事件
                $('.fba_warehousedashboard_completeNum_hour').click(function(){
                    var taskType=$(this).attr("taskType");
                    var taskTypeName=$(this).attr("taskTypeName");
                    var storeId=$(this).attr("storeId");
                    var title=taskTypeName+" 今日时效";
                    console.log("======fba_warehousedashboard_completeNum_hour=======")
                    layer.open({
                        type: 1,
                        title: title,
                        id:'fba_warehousedashboard_completeNum_hour_layer',
                        shadeClose: true,
                        area: ['800px', '600px'],
                        content: $('#fba_warehousedashboard_completeNum_layer').html(),
                        success: function () {
                            fba_warehousedashboard_completeNum_show(storeId,taskType,taskTypeName);
                        }
                    })
                });
                $('.fba_warehousedashboard_waitNum_download').click(function(){
                    var taskType=$(this).attr("taskType");
                    var storeId=$(this).attr("storeId");
                    var taskTypeName=$(this).attr("taskTypeName");
                    console.log("=======fba_warehousedashboard_waitNum_download======")
                    fba_warehouseDashboard_export_fun(storeId,taskType,taskTypeName);
                });
            });
            // tea_renderPage_ver1('fbaOpLogForm','FBAhistory_page',returnData.count, req.page, req.limit,[10,50,100], form_search);
        });
    }

    //导出待完成
    function fba_warehouseDashboard_export_fun(storeId, taskType, taskTypeName) {
        if (!storeId) {
            storeId = 19;
        }
        var data = {
            "storeId": storeId,
            "taskType": taskType
        };
        var confirmindex = layer.confirm('确认导出 ' + taskTypeName + ' 待完成数据？', {btn: ['确认', '取消']}, function () {
            submitForm(data, ctx + '/warehouseDashboard/exportTodayWaitInfoByStoreIdAndtype.html', "_blank")
            layer.close(confirmindex);
        }, function () {
            layer.close(confirmindex);
        })
    }

    /**
     * 时效数据
     */
    function fba_warehousedashboard_completeNum_show(storeId,taskType,taskTypeName){
        var expireMinute = 5;
        var cols=[[]];
        if(taskTypeName=='收货'){
            cols= [
                [ //标题栏
                    {field: 'addressName', rowspan: 2,title: '收货地址' }
                    ,{field: 'taskParam',rowspan: 2, title: '参数',templet:' <div>包裹数 </div>'}
                    ,{colspan: 5, title: '今日收货数据',}
                    ,{field: 'waitNum',rowspan: 2, title: '累计待收货'}
                ],[
                    {field: 'fourNum', title: '>5D',templet:'#fba_warehousedashboard_fourNum_tpl'}
                    ,{field: 'thirdNum',title: '3~5D',templet:'#fba_warehousedashboard_thirdNum_tpl'}
                    ,{field: 'secondNum', title: '2~3D',templet:'#fba_warehousedashboard_secondNum_tpl'}
                    ,{field: 'firstNum', title: '<=2D',templet:'#fba_warehousedashboard_firstNum_tpl'}
                    ,{field: 'fiveNum', title: '未关联',templet:'#warehousedashboard_fiveNum_tpl'}
                ]
            ]
        }else if(taskTypeName=='点货'){
            cols= [
                [ //标题栏
                    {field: 'addressName', rowspan: 2,title: '收货地址' }
                    ,{field: 'taskParam',rowspan: 2, title: '参数',templet:'<div>SKU个数 </div>'}
                    ,{colspan: 4, title: '今日点货数据',}
                    ,{field: 'waitNum',rowspan: 2, title: '累计已收货待点货'}
                ],[
                    {field: 'fourNum', title: '>72H',templet:'#fba_warehousedashboard_fourNum_tpl'}
                    ,{field: 'thirdNum',title: '48-72H',templet:'#fba_warehousedashboard_thirdNum_tpl'}
                    ,{field: 'secondNum', title: '15-48H',templet:'#fba_warehousedashboard_secondNum_tpl'}
                    ,{field: 'firstNum', title: '<=15H',templet:'#fba_warehousedashboard_firstNum_tpl'}
                ]
            ]
        }else if(taskTypeName=='扫描装车'){
            cols= [
                [ //标题栏
                    {field: 'addressName', rowspan: 2,title: '收货地址' }
                    ,{field: 'taskParam',rowspan: 2, title: '参数',templet:'<div>SKU个数 </div>'}
                    ,{colspan: 4, title: '今日扫描装车数据',}
                    ,{field: 'waitNum',rowspan: 2, title: '累计已点货待扫描装车'}
                ],[
                    {field: 'fourNum', title: '>48H',templet:'#fba_warehousedashboard_fourNum_tpl'}
                    ,{field: 'thirdNum',title: '24-48H',templet:'#fba_warehousedashboard_thirdNum_tpl'}
                    ,{field: 'secondNum', title: '8.5-24H',templet:'#fba_warehousedashboard_secondNum_tpl'}
                    ,{field: 'firstNum', title: '<=8.5H',templet:'#fba_warehousedashboard_firstNum_tpl'}
                ]
            ]
        }else if(taskTypeName=='上架'){
            cols= [
                [ //标题栏
                    {field: 'addressName', rowspan: 2,title: '收货地址' }
                    ,{field: 'taskParam',rowspan: 2, title: '参数',templet:'<div>SKU个数 </div>'}
                    ,{colspan: 4, title: '今日上架数据',}
                    ,{field: 'waitNum',rowspan: 2, title: '累计待上架'}
                ],[
                    {field: 'fourNum', title: '>72H',templet:'#fba_warehousedashboard_fourNum_tpl'}
                    ,{field: 'thirdNum',title: '48-72H',templet:'#fba_warehousedashboard_thirdNum_tpl'}
                    ,{field: 'secondNum', title: '15-48H',templet:'#fba_warehousedashboard_secondNum_tpl'}
                    ,{field: 'firstNum', title: '<=15H',templet:'#fba_warehousedashboard_firstNum_tpl'}
                ]
            ]
        }
        table.render({
            elem: '#fba_warehousedashboard_completeNum_table',
            method: 'post',
            url: ctx + '/warehouseDashboard/getTodaycompleteDashboardByStoreIdAndtype.html',
            where:{'storeId':storeId,'taskType':taskType, "expireMinute":expireMinute},
            cols: cols
        })
    }
});


function fbaWareHouseGetPercent(numerator,arr){
    let denominator = arr.reduce(function(accumulator, currentValue){
        return accumulator+currentValue
    })
    return denominator?Number(numerator/denominator*100).toFixed(2):0.00
}