/**checkGoods--仓库收货**/
layui.use(["admin", "layer", "table", "form", "laytpl", "laydate", "element",'formSelects'],function () {
    var layer = layui.layer,
        admin = layui.admin,
        table = layui.table,
        element=layui.element,
        form = layui.form,
        formSelects = layui.formSelects,
        laydate = layui.laydate;

        //监听未关联选中
        form.on('select(checkgoods_pakageType)', function(data){
            var val= data.value;
            if(data.value == 2){
                $('#checkGoods_handleStatus').removeClass('disN');
            }else{
                $('#checkGoods_handleStatus').addClass('disN');
            }
        })
            
        //时间渲染
        laydate.render({elem: '#startEndDate', range: true});
        checkgoods_setLatestDay();//当天数据
        /**初始化下拉框数据**/
        $.ajax({
            url: ctx + "/checkGoods/getCheckGoodsPageEnum.html",
            type: 'post',
            dataType: 'json',
            success: function (returnData) {
                if (returnData.code == "0000") {
                    //收货人
                    var buyerStr = "<option value=''></option>"
                    $(returnData.data.buyerList).each(function () {
                        buyerStr += '<option value="' + this + '">' + this + '</option>'
                    });
                    $("#checkgoods_creator").html(buyerStr);
                    formSelects.render('checkgoods_creator');
                    //包裹类型
                    var packageTypeStr = "<option value=''></option>"
                    $(returnData.data.packageTypeList).each(function () {
                        packageTypeStr += '<option value="' + this.value + '">' + this.name + '</option>'
                    });
                    $("#checkgoods_pakageType").html(packageTypeStr);
                    form.render('select');
                }else{
                    layer.msg(returnData.msg,{icon:3});
                }
            }
        });
        //查询渲染表格
       $("#checkgoods_search_btn").click(function () {
           checkgoods_render_fun();
        });
    /**监听tab选项卡切换**/
    var checkgoods_tab_index=0;
    element.on('tab(checkGoodsCard_tab)', function (data) {
        if(data.index==0){//详情页面
            checkgoods_tab_index=0;
        }else{ //统计页面
            checkgoods_tab_index=1;
        }
        checkgoods_render_fun();
    });

    /**
     * 查询
     */
    function checkgoods_render_fun(){
        if(checkgoods_tab_index==0){
            checkgoods_search_fun();
        }else{
            checkgoods_count_fun();
        }
    }
    /**
     * 页面搜索
     */
    function checkgoods_search_fun() {
        var hiddenButton = $("#checkgoods_parcel_number_button");
        var col = [ //表头
            {type: 'checkbox'}
            // , {field: 'image', title: '图片', templet: '#checkgoods_image_tpl', width: 100}
            , {field: 'courierNumber', title: '快递单号'}
            , {field: 'hasScan', title: '点货状态', templet: '#checkgoods_hasScan_tpl'}
            , {field: 'packageTypeName', title: '包裹类型'}];
        col.push({field: 'recipient', edit: 'text', title: '收件人', templet: '#checkgoods_recipient_tpl'});
        if (hiddenButton && hiddenButton.length == 1) {
            col.push({field: 'parcelNumber', edit: 'text', title: '包裹数量', templet: '#checkgoods_parcel_number_tpl'});
        } else {
            col.push({field: 'parcelNumber', title: '包裹数量', templet: '<div disabled>{{d.parcelNumber ? d.parcelNumber : 1}}</div>'});
        }
        col.push({
          field: 'logisticsMappingCreateTime',
          title: '跟踪号创建时间',
          templet: "<div>{{Format(d.logisticsMappingCreateTime,'yyyy-MM-dd hh:mm:ss')}}</div>"
        });
        col.push({
            field: 'collectgoodsTime',
            title: '收货',
            templet: "<div>{{d.consigneeName || ''}}{{Format(d.collectgoodsTime,'yyyy-MM-dd hh:mm:ss')}}</div>"
        });
        // col.push({field: 'consigneeName', title: '收货人'});
        // col.push({field: 'lastConsigneeName', title: '扫描人'});
        col.push({
            field: 'lastCollectgoodsTime',
            title: '最后一次扫描',
            templet: "<div>{{d.lastConsigneeName || ''}}{{Format(d.lastCollectgoodsTime,'yyyy-MM-dd hh:mm:ss')}}</div>"
        });
        col.push({
            field: '',
            title: '操作',
            toolbar: "#checkgoods_data_table_bar"
        });
        table.render({
            elem: '#checkgoods_data_table',
            id: "checkgoods_data_table",
            url: ctx + "/checkGoods/searchCheckGoods.html",
            page: true,//开启分页
            where: checkgoods_getSeacrhData(),
            method: 'post',
            cols: [
                col
            ],
            limits: [50, 100, 200],
            limit: 50,
            done: function (res, curr, count) {
                for (var i in res.data) {
                    var obj = res.data[i];
                    if (obj.image != null && obj.image != '') {
                        obj.image = ctx + obj.image;
                    }
                }
                imageLazyload();
                $("#checkgoods_orderNum").html(count);
            }
        });
    };
    //工具条的监听事件,table.on(tool(表格的lay-filter的值))
    table.on('tool(checkgoods_data_table)', function (obj) {
        var data = obj.data, //获得当前行数据
            layEvent = obj.event; //获得 lay-event 对应的值
        if (layEvent == 'showLog') {
            var id = data.id;
            console.log(id)
            var index = layer.open({
                type: 1,
                title: '操作日志 - ' + data.courierNumber,
                area: ['1000px', '600px'],
                btn: ['关闭'],
                shadeClose: false,
                content: $('#checkgoods_data_table_logListLayer').html(),
                success: function () {
                    table.render({
                        elem: "#checkgoods_data_table_logTable",
                        method:'GET',
                        size: 'sm',
                        url: ctx + "/gwLog/listLogByGwId",
                        cols: [[
                            { field: "operTime", title: "操作时间",templet : "<div>{{ layui.admin.Format( d.operTime, 'yyyy-MM-dd hh:mm:ss')}}</div>"},
                            { field: "operName", title: "操作人",width: 100},
                            { field: "operTypeCn", title: "操作详情"},
                        ]],
                        page:false,
                        limit: 999999,
                        where:{gwId : id},
                        id:"checkgoods_data_table_logTable",
                        // limits:[100,200,500],
                    });
                }
            })
        }
    })
    /**修改采购包裹收件人**/
    table.on('edit(checkgoods_data_table)', function(obj) {
        console.log(obj)
        var value = obj.value //得到修改后的值
            , data = obj.data //得到所在行所有键值
            , field = obj.field; //得到字段
        var entity = {
            id : data.id
        }
        entity[field] = value;
        if (field && field === "parcelNumber") {
            if (isNaN(value)) {
                layer.msg("修改包裹数量请填写数字!",{icon:2})
                return;
            }
        }
        loading.show();
        $.ajax({
            url: ctx + "/checkGoods/updateCheckGoodRecipient.html",
            type: 'post',
            dataType: "json",
            contentType: 'application/json',
            data: JSON.stringify(entity),
            success: function(res) {
                loading.hide()
                if (res.code == '0000') {
                    layer.msg('修改包裹收件人成功',{icon:1})
                } else {
                    layer.msg(res.msg,{icon:2})
                }
            },
            error: function () {
                loading.hide()
            }
        })
    });
    /**根据条件统计收货包裹**/
  function checkgoods_count_fun(){
        table.render({
            elem: '#checkgoods_count_table',
            url: ctx + "/checkGoods/countCheckGoodsByPackageType.html",
            page: false, //开启分页
            method: 'post',
            where: checkgoods_getSeacrhData(),
            cols: [
                [ //表头
                    {field: 'creator', title: '收货人'},
                    {field: 'totalCountNum', title: '总数量',},
                    {field: 'notRelationCount', title: '未关联',},
                    {field: 'stockCrashCount', title: '缺货紧急',},
                    {field: 'buyerCrashCount', title: '采购紧急',},
                    {field: 'directPackCount', title: '直接包装'},
                    {field: 'overseaCount', title: '海外仓'},
                    {field: 'fangyiCount', title: '防疫包裹'},
                    {field: 'zhijianCount', title: '质检包裹'},
                    {field: 'buySampleCount', title: '采样单'},
                    {field: 'normalCount', title: '正常包裹数'},
                ]
            ],
            done: function (res, curr, count) {
                $("#checkGoodsCard_total_num").html(count);
            }
        });
  }
    //收货弹框
    var count;
    var arr;
    $("#cg_saveOrder").on('click',function (){
        arr = new Array();
        count = 0;//定义累加数量
        var index = layer.open({
            type: 1,
            title: '收货',
            area: ['60%','60%'],
            content: $('#checkGoodsLayer').html(),
            end: function () {
                $("#checkgoods_search_btn").click();//刷新页面
            },
            success:function(layero,index){
                $("#order_id").focus();//获得焦点
                $("#order_id").on('keydown',function(event){
                    if(event.keyCode == 13){
                        if($("#order_id").val() == ''){
                            layer.msg("请扫描快递单号");
                            $("#order_id").focus();
                            return;
                        }else{
                            if(!$("#ck_isWeigh").prop("checked")){
                                cm_addOrUpdate();//添加数据
                                return;
                            }
                        }
                        $("#cg_weight").focus();
                        $("#order_id").blur();
                    }
                })
                //入库
                $("#cg_weight").on('keydown',function (event) {
                    if(event.keyCode == 13){
                        if($("#cg_weight").val() == ''){
                            layer.msg("称重异常,请重新称重");
                            return;
                        }
                        if($("#cg_weight").val() <= 0){
                            layer.msg("重量小于等于0(kg),请重新称重");
                            $("#cg_weight").val("");//清空文本框
                            $("#cg_weight").focus();//获得焦点
                            return;
                        }
                        cm_addOrUpdate();//添加数据
                    }
                });
                table.render({
                    elem: '#checkgoods_layer_table'
                    ,cols: [[ //标题栏
                        {field: 'id', title: 'ID', width: 120 }
                        ,{field: 'courierNumber', title: '快递单号', width: 120}
                        ,{field: 'weight', title: '称重(kg)', minWidth: 120}
                    ]]
                });
            }
        })
        $("#ck_isWeigh").click(function () {
            $("#order_id").focus();//获得焦点
        })
    });
    function cm_addOrUpdate() {
        $.ajax({
            type: "post",
            async:false,
            url: ctx + "/checkGoods/collectGoods.html",
            dataType: "JSON",
            data: {"courierNumber": $("#order_id").val(), "weight": $("#cg_weight").val()},
            success:function (data) {
                loading.hide();
                if(data.code == "9999"){
                    $("#order_id").val("");//清空文本框
                    $("#cg_weight").val("");//清空文本框
                    $("#order_id").focus();//获得焦点
                    data.msg = '操作异常';
                }
                if(data.code == "0000"){
                    if(data.count == 1 ){
                        count ++;//累加数量
                        $("#cg_count").html("订单数量:"+count)
                    }
                    $("#order_id").val("");//清空文本框
                    $("#cg_weight").val("");//清空文本框
                    $("#order_id").focus();//获得焦点
                    layer.msg(data.msg);
                    arr.push(data.data);
                    table.render({
                        elem: '#checkgoods_layer_table'
                        ,cols: [[ //标题栏
                            {field: 'id', title: 'ID', width: 120 }
                            ,{field: 'courierNumber', title: '快递单号', width: 180}
                            ,{field: 'weight', title: '称重(kg)', Width: 120}
                        ]]
                        ,data: arr
                    });

                }else{
                    layer.msg(data.msg,{icon:2});
                }
            }
        });
    };

    //导出订单
    $("#checkgoods_export_btn").click(function () {
        var data = checkgoods_getSeacrhData();
        if (data.startDate == null || data.startDate == '') {
            layer.msg("请选择日期", {icon: 0})
            return false;
        }
        data.exportType=checkgoods_tab_index;
        data.endDate=data.endDate + "";
        var arr = $("#startEndDate").val().split(" - ");
        if(dateOfGudgment(arr[0],arr[1])){
            layer.msg("开始日期不能大于结束日期",{icon:0});
            return;
        }
        if(startAndEndTime(arr[0],arr[1])){
            layer.msg("日期范围超出半年",{icon:0});
            return;
        }
        var confirmindex = layer.confirm('确认导出当前搜索条件下的收货信息？', {btn: ['确认', '取消']}, function () {
            submitForm(data, ctx + '/checkGoods/exportCollectGoods.html', "_blank")
            layer.close(confirmindex);
        }, function () {
            layer.close(confirmindex);
        })
    });

    /**
     * 获取当前月份
     */
    function checkgoods_setLatestDay() {
        var createTimeEnd = Format(new Date(), 'yyyy-MM-dd');
        var createTimeStart = Format(new Date(), 'yyyy-MM-dd');
        $('#startEndDate').val(createTimeStart + ' - ' + createTimeEnd);
    };
    /**获取收货页面查询参数**/
   function checkgoods_getSeacrhData(){
       var data = serializeObject($('#checkgoods_search_form'));
       var dateTimeStr=$.trim(data.startEndDate);
        if($('#checkGoods_handleStatus').hasClass('disN')){
           delete data.dealStatus
        }
       if (dateTimeStr != null && dateTimeStr != '') {
           data.startDate = dateTimeStr.substring(0, 10);
           data.endDate = dateTimeStr.substring(13) +" 23:59:59";
       }
       return data;
   };
});
//判断开始日期是否大于结束日期
function dateOfGudgment(t1,t2) {
    var time1 = new Date(t1).getTime();
    var time2 = new Date(t2).getTime();
    if(time1 > time2){
        return true;
    }
    return false;
}
//判断日期范围是否在一个月之内
function startAndEndTime(startD,endD) {
    var start = new Date(Date.parse(startD.replace(/-/g,"/")));
    var end   = new Date(Date.parse(endD.replace(/-/g,"/")));
    var days = parseInt((end.getTime()-start.getTime()) / (1000 * 60 * 60 * 24));
    if(days > 180){
        return true;
    }
    return false;
}