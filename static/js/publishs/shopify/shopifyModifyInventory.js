var shopifyModifyStockTimeUnit;
layui.use(['admin', 'form', 'layer', 'formSelects', 'element', 'laydate','table'], function () {
    var formSelects = layui.formSelects,
        table = layui.table,
        tableIns={};
        form = layui.form;
        form.render('checkbox');
        form.render('radio');
        form.render('select');
        //初始化店铺/销售员/部门
        render_hp_orgs_users("#shopifyModifyStore");
        //渲染数据
        var data = new Object();
        if(shop_arr.length > 0){
            data.idList=[];
            data.storeAcctIdList = [];
       	 	data.storeAcctIdList = $.trim(data.storeAcctIdList);
            for (var i = 0; i < shop_arr.length; i++){
                data.idList.push(shop_arr[i].id);
            }
            data.idList = data.idList.join(",");
        }
        if(shop_arr.length > 0){
            //执行重载
            tableReload(data);
        }
    function tableReload(data) {
     tableIns = table.render({
         method:'post'
        ,elem: '#shopify_inventory_table'
        ,url: ctx + '/shopifyBatchOperation/searchAdjustPriceProd.html' //数据接口
        ,page: true //开启分页
        ,height: 500
        ,cols: [[ //表头
            {type: 'checkbox'}
            ,{ field: "id", title: "id" }
            ,{ field: "storeAcctId", title: "店铺id"}
            ,{field: 'storeAcctName', title: '店铺', width: '15%'}
            ,{field: 'prodSSku', title: '商品SKU', width: '15%'}
            ,{field: 'storeSSku', title: '店铺SKU', width: '15%'}
            ,{field: 'variantId', title: '平台商品子ID', width: '15%'}
            ,{field: 'stock', title: '当前数量', width: '10%'}
            ,{field: 'newStock', title: '调整数量' ,templet: '#new_stock', width: '10%'}
            ,{ field: "locationId", title: "locationId"}
            ,{ field: "inventoryItemId", title: "inventoryItemId"}
            ,{ field: "productId", title: "平台商品id"}
             ,{field: 'returnData', title: '操作结果', width: '10%' }
        ]],
        id:"shopify_inventory_table",
        limits:[10,20,50],
        limit:10,
        where:data,
        done:function(res, curr, count){
            $("#LAY-shopify-inventory [data-field='id']").css('display', 'none');
            $("#LAY-shopify-inventory [data-field='storeAcctId']").css('display', 'none');
            $("#LAY-shopify-inventory [data-field='locationId']").css('display', 'none');
            $("#LAY-shopify-inventory [data-field='inventoryItemId']").css('display', 'none');
            $("#LAY-shopify-inventory [data-field='productId']").css('display', 'none');
            $("#num_span_shopify").text("共"+count+"条");
        }
    });
    }
    $("#shopify_inventoryBtn").click(function () {
        var type = $(this).data('type');
        active[type] ? active[type].call(this) : '';
    });
    var active = {
        reload: function () {
            var data = new Object();
            data.storeAcctIdList = [];
            data.sSkuList = [];
            var storeAcct = $("#shopify_modifystock_store_sel").val();
            if(storeAcct!=null && storeAcct!='') {
                data.storeAcctIdList.push(storeAcct);
            }else{
                $("#shopify_modifystock_store_sel").children().each(function () {
                    if ($(this).val() != "") {
                        data.storeAcctIdList.push($(this).val());
                    }
                });
            }
            console.log(data.storeAcctIdList)
            var skuStr = $.trim($("#shopifyModifyStore input[name='sSkuList']").val());
            if(skuStr !="" && skuStr!=null){
                data.sSkuList = $.trim(skuStr.split(","));
            }
            data.storeAcctIdList = $.trim(data.storeAcctIdList);

            data.searchType = $("#shopify_modifyStock_sskuSearchType").val();//搜索类型
            //执行重载
            tableReload(data);
        }
    };

    //批量修改调价消息
    $('#shopify_upadateMainStock').click(function(){
        //获取表格行对象
        var trObj =  $('#shopify_inventory_table').next().find('.layui-table-body tbody').find('tr');

        var  arr = new Array();
        for(var i=0;i<trObj.length;i++){
            var obj = new Object();
            obj.storeAcctId = $.trim(trObj.eq(i).find('td').eq(2).find('div').text());//店铺名称
            obj.storeAcctName =  $.trim(trObj.eq(i).find('td').eq(3).find('div').text());//店铺名称
            obj.prodSSku =  $.trim(trObj.eq(i).find('td').eq(4).find('div').text());//商品sku
            obj.storeSSku =  $.trim(trObj.eq(i).find('td').eq(5).find('div').text());//店铺sku
            obj.variantId =  $.trim(trObj.eq(i).find('td').eq(6).find('div').text());//平台商品Id
            obj.locationId =  $.trim(trObj.eq(i).find('td').eq(9).find('div').text());
            obj.inventoryItemId =  $.trim(trObj.eq(i).find('td').eq(10).find('div').text());
            obj.productId =  $.trim(trObj.eq(i).find('td').eq(11).find('div').text());
            obj.newStock =  $.trim(trObj.eq(i).find('td').eq(8).find('input').val());//新库存
            obj.stock = $.trim(trObj.eq(i).find('td').eq(7).find('div').text());
            var checkStat = trObj.eq(i).find('td').eq(0).find('div').find('input').is(":checked");
            if(checkStat){
                if(obj.stock == obj.newStock){
                    trObj.eq(i).find('td').eq(12).find('.layui-table-cell').html("<div style='color:green'>"+"与原值相同不修改"+"</div>");
                }else{
                   arr.push(obj);
                }
            }
        }
        if(arr==null ||arr.length==0){
            layer.msg("请选择需要修改的数据！");
            return;
        }
        //以当前时间戳作为批次号
        var batchNo = new Date().getTime();
        $.ajax({
            beforeSend: function(){
                loading.show();
            },
            type: "POST",
            url: ctx + "/shopifyBatchOperation/updateStockNumber.html",
            data: {'prodObj':JSON.stringify(arr),'batchNo':batchNo},
            async: true,
            dataType: "json",
            success: function (returnData) {
                if (returnData.code == "0000") {
                    loading.hide()
                    layer.msg(returnData.msg);
                } else {
                    loading.hide()
                    layer.msg(returnData.msg);
                }
            },
            error: function () {
                layer.msg("服务器正忙");
            }
        });

        shopifyModifyStockTimeUnit = setInterval(function () {
            sel(batchNo)
        }, 5000);
    });

    function sel(batchNo){
        var trObj =  $('#shopify_inventory_table').next().find('.layui-table-body tbody').find('tr');

        var count = 0;
        for (var i = 0; i < trObj.length; i++) {
            var checkStat = trObj.eq(i).find('td').eq(0).find('div').find('input').is(":checked");
            var resultMsg = trObj.eq(i).find('td').eq(12).find('.layui-table-cell').find('div').text();
            if ((resultMsg == '' || resultMsg == null) && checkStat) {
                count++;
            }
        }
        if(count == 0){
            clearInterval(shopifyModifyStockTimeUnit);
            return;
        }

        $.ajax({
            type: "POST",
            url: ctx + "/sys/selectResult.html",
            data: {'batchNo':batchNo},
            dataType: "json",
            success: function (returnData) {
                if (returnData.code == "0000") {
                    var data = returnData.data;

                    for (var i = 0; i < trObj.length; i++) {
                        var storeSSku  =  $.trim(trObj.eq(i).find('td').eq(5).find('div').text());//商品子sku
                        var variantId =  $.trim(trObj.eq(i).find('td').eq(6).find('div').text());//平台商品Id
                        var checkStat = trObj.eq(i).find('td').eq(0).find('div').find('input').is(":checked");
                        var resultMsg = trObj.eq(i).find('td').eq(12).find('.layui-table-cell').find('div').text();

                        var logMsg = data['TR_SHOPIFY_MODIFYSTOCK_LOG' + variantId + storeSSku];
                        if ((resultMsg == '' || resultMsg == null) && checkStat) {
                            if (logMsg == '调整库存成功') {
                                trObj.eq(i).find('td').eq(12).find('.layui-table-cell').html("<div style='color:blue'>" + logMsg + "</div>");
                            } else if (logMsg != '' && logMsg != null && logMsg != 'undefined') {
                                trObj.eq(i).find('td').eq(12).find('.layui-table-cell').html("<div style='color:red'>" + logMsg + "</div>");
                            }
                        }
                    }
                } else {
                    layer.msg(returnData.msg);
                }
            },
            error: function () {
                layer.msg("服务器正忙");
                clearInterval(shopifyModifyStockTimeUnit);
            }
        });

    }

    form.on('radio(apply)', function(data){
        var value = data.value;
        if(value==='1'){
            $('#shopify_in_addinvntory').val('').attr('disabled',true);
            $('#shopify_in_adjustto').attr('disabled',false);
        }else{
            $('#shopify_in_adjustto').val('').attr('disabled',true);
            $('#shopify_in_addinvntory').attr('disabled',false);
        }
      }); 

      form.on('submit(shopify_in_applyBtn)', function(data){
        var checkStatus = table.checkStatus('shopify_inventory_table');
        var addvalue = $('#shopify_in_addinvntory').val();
        var adjustvalue = $('#shopify_in_adjustto').val();
        if(checkStatus.data.length>0&&tableIns){
        var layFilterIndex = 'LAY-table-'+tableIns.config.index;
        var tableContainer = $('div[lay-filter="'+layFilterIndex+'"]');
        var value = data.field.apply;
        if(value==='1'){
            if(adjustvalue!==''){
            tableContainer.find('input[name="layTableCheckbox"]:checked').each(function(){
                var tr= $(this).parents('tr');
                 var input = tr.find('input[name="new_stock"]');
                 if(parseInt(adjustvalue)>=0){
                    input.val(adjustvalue);
                    }else{
                        layer.msg('库存不可低于0');
                }
            });
        }else{
            layer.msg("请填写调整后的数量");
        }
        }else{
            if(addvalue!==''){
                tableContainer.find('input[name="layTableCheckbox"]:checked').each(function(){
                    var tr= $(this).parents('tr');
                     var input = tr.find('input[name="new_stock"]');
                     var origincalue = tr.find('td[data-field="stock"]').text();
                     var value = parseInt(addvalue)+parseInt(origincalue);
                     if(value<0){
                         value = 0;
                         layer.msg('库存不可低于0');
                         input.val(value);
                     }else{
                     input.val(value);
                     }
                });
            }else{
                layer.msg("请填写调整后的数量");
            }  
        }
        }else{
            layer.msg("请选择需要修改的数据！");
        }
        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
      });
      table.on('checkbox(shopify_inventory_table)', function(obj){
        if(!obj.checked){
            $(this).parents('tr').find('td[data-field="newStock"]').find('input').val("");
        }
      });

});