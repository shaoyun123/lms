
layui.use(['admin', 'form', 'table','laydate','upload'], function() {
    var $ = layui.$,
        admin = layui.admin,
        layer = layui.layer,
        laydate = layui.laydate,
        table = layui.table,
        upload = layui.upload,
        form = layui.form;

        form.render(null, 'component-form-element');
        form.render(null, 'component-form-group');


    //上传
    var uploadStockOut = upload.render({
        elem: '#uploadStockOutBtn',
        url: ctx+"/prodStock/uploadOutStockProd.html",
        accept:'file',
        exts: 'xls|xlsx',
        done: function(res){
            //上传失败
            if(res.code != "0000"){
                return layer.msg(res.msg);
            }else{
                 var str = "导入条数：" + res.data.rows +"\n导入成功：" + res.data.successNumber + "\n导入失败：" + res.data.failNumber;
                 if (res.data.failNumber != 0){
                     str = str +"\n失败所在行："+res.data.failRow;
                 }
                return alert(str);
            }
        }
    });

    //计算表格所占高度

    function table_height(){
        var bodyheight = $(window).height();
        var cardheight1 =  $("#LAY_app_body").find('.layui-card').eq(0).outerHeight();
        var cardheight2 =   $("#LAY_app_body").find('.layui-card').eq(1).children('.layui-card-header').outerHeight();
         return bodyheight-cardheight2-110;
    }

    // 表格渲染
    table.render({
        elem: '#prodStockOutTable',
        method: 'post',
        url: ctx + '/prodStock/prodStockPage.html',
        cols: [
            [
                //标题栏
                { type: "checkbox" },
                {title: 'sku', field: 'prodSSku',width: 100},
                {title: '采购专员', field: 'buyer',width: 100},
                { title: "开发专员",field: "developer", width: 100 },
                { title: "采购处理",toolbar: '#purchaseStockOutBar',width: 150},
                { title: "开发处理",toolbar: '#devStockOutBar',width: 150 },
                { title: "销售本人状态",toolbar: '#saleSelfStatusBar', width: 250 },
                { title: "平台状态",toolbar: '#platStatusBar', width: 250 },
                { title: "采购备注",field: "purchaseNote", width: 150 },
                {title: '日期', toolbar: '#stockoutTimeBar',width: 250},
                {title: "到货天数", field: "arrivalDays", width: 100 },

                {title: '操作', width: 200,  toolbar: '#stockOutOperBar'}
            ]
        ],
        page: true,
        id: 'prodStockOutTable',
        limits: [20, 50, 100],
        limit: 20,
        height:table_height(),
        done: function(res, curr, count){
            $("#prodStockOutNumSp").html(count);
        }
    })

    var active = {
        //搜索
        reload: function() {
            table.reload('prodStockOutTable', {
                page: { curr: 1 },
                where: {

                }
            });
        },
        reloadDetail:function () {
            table.reload('stockoutSaleTable',{
                where: {
                    stockId:$("#stockIdHiddenInput").val(),
                    platCode:$("#stockPlatCodeHiddenInput").val(),
                    isLookSelf:$("#stockOutDetailSel").val(),
                }
            });
        }
    };
  
    //表格重载触发事件
    $('#stockOutBtn').click(function () {
        var type = $(this).data('type');
        active[type] ? active[type].call(this) : '';
    });
    
    form.on('select(stockOutDetailSel)', function(data){
        active['reloadDetail'].call();
    });

      // 展示已知数据
    // $('#stockoutSaleBtn').click(function () {
    //    stockoutDetail(1,'wish');
    // })
});


// TODO 方法写在外面无法使用 layui的模块。写在里面，页面提示方法 is not defined。


//采购处理
function purchaseHandleStock(stockId,purchaseProc) {
    $.ajax({
        type: "POST",
        url: ctx + "/prodStock/purchaseStockOut.html",
        data: {"stockId":stockId,"purchaseProc":purchaseProc},
        dataType: "json",
        success: function(res) {
        	console.log(res);
            if (res.code == "0000") {
                layer.msg("操作成功");
                //重载表格
                //active['reload'].call();（迷之报错，无法调用函数）
                var spanObj = $('#prodStockOutTable').next().find('.layui-table-body tbody').find('tr').eq(0).find('td').eq(4).find('span');
                //页面返显
                if(res.data=='1'){
                	spanObj.text("1-7天到货");
                }else if(res.data=='2'){
                	spanObj.text(">7天到货");
                }else if(res.data=='3'){
                	spanObj.text("找不到供应商");
                }
                //重载表格
                $('#stockOutBtn').click();
            } else {
                layer.msg(res.msg);
            }
        },
        error: function () {
            layer.msg("服务器正忙");
        }
    });
}

//开发处理
function devHandleStock(stockId,devProc) {
    $.ajax({
        type: "POST",
        url: ctx + "/prodStock/devStockOut.html",
        data: {"stockId":stockId,"devProc":devProc},
        dataType: "json",
        success: function(res) {
            if (res.code == "0000") {
                layer.msg("操作成功");
                var spanObj = $('#prodStockOutTable').next().find('.layui-table-body tbody').find('tr').eq(0).find('td').eq(5).find('span');
                if(devProc=='1'){
                	spanObj.text("1-7天到货");
                }else if(devProc=='2'){
                	spanObj.text(">7天到货");
                }else if(devProc=='3'){
                	spanObj.text("找不到供应商");
                }
                //重载表格(无法执行)
                //active['reload'].call();
                $('#stockOutBtn').click();
            } else {
                layer.msg(res.msg);
            }
        },
    });
}

//详情
function stockoutDetail(stockId,platCode){
    layer.open({
        type: 1,
        title: platCode+'详情',
        area: ['1100px', '700px'],
        btn: ['关闭'],
        shadeClose: false,
        content: $('#stockoutSaleLayer').html(),
        success: function () {
            $("#stockIdHiddenInput").val(stockId);
            $("#stockPlatCodeHiddenInput").val(platCode);
            form.render('select');
            table.render({
                elem: '#stockoutSaleTable',
                method: 'post',
                url: ctx + '/prodStock/platStockOut.html',
                where:{
                    stockId:$("#stockIdHiddenInput").val(),
                    platCode:$("#stockPlatCodeHiddenInput").val(),
                    isLookSelf:$("#stockOutDetailSel").val(),
                },
                cols: [
                    [
                        //标题栏
                        { type: "checkbox" },
                        {title: '平台', field: 'platCode',width: 100},
                        {title: '店铺', field: 'storeName',width: 100},
                        { title: "销售",field: "seller", width: 100 },
                        { title: "店铺sku",field: "storeSSku", width: 200},
                        { title: "在线库存",field: 'onlineStock',width: 100 },
                        { title: "执行动作",toolbar: '#oosProcActBar', width: 100 },
                        { title: "执行结果",field: 'oosProcResult', width: 200 },
                        { title: "销售确认",field: "isOosConfirm", width: 100 },
                    ]
                ],
                id: 'stockoutSaleTable',
                done: function(res, curr, count){
                }
            });
            $('#stockOutRemarkProcBtn').click(function () {
                var checkStatus = table.checkStatus('stockoutSaleTable')
                    ,data = checkStatus.data;
                if (data.length == 0){
                    layer.alert("请至少选择一条数据");
                    return;
                }
                var ids =[];
                for(var i = 0;i<data.length; i ++){
                    var id = data[i].id;
                    console.info(id);
                    ids.push(id);
                }
                $.ajax({
                    type: "POST",
                    url: ctx + "/prodStock/batchConfirm.html",
                    dataType: "json",
                    traditional: true,
                    data: {"stockCtrlDetailIds":ids,"stockId":stockId},
                    success: function(res) {
                        if (res.code == "0000") {
                            layer.msg("操作成功");
                            active['reloadDetail'].call();
                        } else {
                            layer.msg(res.msg);
                        }
                    },
                });
            })
            $('#stockOutBatchZeroBtn').click(function () {
                var checkStatus = table.checkStatus('stockoutSaleTable')
                    ,data = checkStatus.data;
                if (data.length == 0){
                    layer.alert("请至少选择一条数据");
                    return;
                }
                var ids =[];
                for(var i = 0;i<data.length; i ++){
                    var id = data[i].id;
                    console.info(id);
                    ids.push(id);
                }
                $.ajax({
                    type: "POST",
                    url: ctx + "/prodStock/batchStockZero.html",
                    dataType: "json",
                    traditional: true,
                    data: {"stockCtrlDetailIds":ids,"stockId":stockId},
                    success: function(res) {
                        if (res.code == "0000") {
                            layer.msg("操作成功");
                            active['reloadDetail'].call();
                        } else {
                            layer.msg(res.msg);
                        }
                    },
                });
            })
            $('#stockOutBatchSaleOffBtn').click(function () {
                var checkStatus = table.checkStatus('stockoutSaleTable')
                    ,data = checkStatus.data;
                if (data.length == 0){
                    layer.alert("请至少选择一条数据");
                    return;
                }
                var ids =[];
                for(var i = 0;i<data.length; i ++){
                    var id = data[i].id;
                    console.info(id);
                    ids.push(id);
                }
                $.ajax({
                    type: "POST",
                    url: ctx + "/prodStock/batchSaleOff.html",
                    dataType: "json",
                    traditional: true,
                    data: {"stockCtrlDetailIds":ids,"stockId":stockId},
                    success: function(res) {
                        if (res.code == "0000") {
                            layer.msg("操作成功");
                            active['reloadDetail'].call();
                        } else {
                            layer.msg(res.msg);
                        }
                    },
                });
            })
        }
    })
}









