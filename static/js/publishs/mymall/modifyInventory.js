layui.use(['admin', 'form', 'layer', 'formSelects', 'element', 'laydate','table'], function () {
    var formSelects = layui.formSelects,
        table = layui.table,
        tableIns={};
        form = layui.form;
        form.render('checkbox');
        form.render('radio');
        form.render('select');
        //初始化店铺/销售员/部门
        render_hp_orgs_users("#mymallModifyStore");
        //渲染数据
        var data = new Object();
        if(mymall_op_arr.length > 0){
            data.idList=[];
            data.storeAcctIdList = [];
       	 	data.storeAcctIdList = $.trim(data.storeAcctIdList);
            for (var i = 0; i < mymall_op_arr.length; i++){
                data.idList.push(mymall_op_arr[i].id);
            }
            data.idList = data.idList.join(",");
        }
        if(mymall_op_arr.length > 0){
            //执行重载
            tableReload(data);
        }
    function tableReload(data) {
     tableIns = table.render({
         method:'post'
        ,elem: '#mymall_inventory_table'
        ,url: ctx + '/mymallBatchOperation/getModifyStock.html' //数据接口
        ,page: true //开启分页
        ,cols: [[ //表头
            {type: 'checkbox'}
            ,{ field: "id", title: "id" }
            ,{ field: "storeAcctId", title: "店铺id"}
            ,{field: 'storeAcct', title: '店铺'}
            ,{field: 'sSku', title: '商品SKU', width: 200}
            ,{field: 'storeSku', title: '店铺SKU', width: 200 }
            ,{field: 'storeProdSId', title: '平台商品子ID', width: 190}
            ,{field: 'stock', title: '当前数量' , width: 180}
            ,{field: 'newStock', title: '调整数量' ,templet: '#new_stock', width: 180}
            ,{field: 'returnData', title: '操作结果', width: 130 }
        ]],
        id:"mymall_inventory_table",
        limits:[10,20,50],
        height: 500,
        limit:10,
        where:data,
        done:function(res, curr, count){
            $("#LAY-mymall-inventory [data-field='id']").css('display', 'none');
            $("#LAY-mymall-inventory [data-field='storeAcctId']").css('display', 'none');
            $("#LAY-mymall-inventory [data-field='storeProdSId']").css('display', 'none');
            $("#num_span_mymall").text("共"+count+"条");
        }
    });
    }
    $("#mymall_inventoryBtn").click(function () {
        var type = $(this).data('type');
        active[type] ? active[type].call(this) : '';
    });
    var active = {
        reload: function () {
            var data = new Object();
            data.storeAcctIdList = [];
            data.sSkuList = [];
            var storeAcct = $("#mymall_modifystock_store_sel").val();

            if(storeAcct!=null && storeAcct!='') {
                data.storeAcctIdList.push(storeAcct);
            }else{
                $("#mymall_modifystock_store_sel").children().each(function () {
                    if ($(this).val() != "") {
                        data.storeAcctIdList.push($(this).val());
                    }
                });
            }
            console.log(data.storeAcctIdList)
            var skuStr = $.trim($("#mymallModifyStore input[name='sSkuList']").val());
            if(skuStr !="" && skuStr!=null){
                data.sSkuList = $.trim(skuStr.split(","));
            }
            data.storeAcctIdList = $.trim(data.storeAcctIdList);
            var salepersonId = $.trim($("#adjustPriceSearchForm select[name='saleName']").val());
            data.salepersonId = salepersonId;
            data.searchType = $("#mymall_modifyStock_sskuSearchType").val();//搜索类型
            //执行重载
            tableReload(data);
        }
    };

    //批量修改调价消息
    $('#mymall_upadateMainStock').click(function(){
        //获取表格行对象
        var trObj =  $('#mymall_inventory_table').next().find('.layui-table-body tbody').find('tr');

        var  arr = new Array();
        for(var i=0;i<trObj.length;i++){
            var obj = new Object();
            obj.id =  $.trim(trObj.eq(i).find('td').eq(1).find('div').text());//同步数据id
            obj.storeAcctId =  $.trim(trObj.eq(i).find('td').eq(2).find('div').text());//店铺id
            obj.storeAcct =  $.trim(trObj.eq(i).find('td').eq(3).find('div').text());//店铺名称
            obj.prodSSku =  $.trim(trObj.eq(i).find('td').eq(4).find('div').text());//商品子sku
            obj.prodStoreSku =  $.trim(trObj.eq(i).find('td').eq(5).find('div').text());//店铺sku
            obj.productId =  $.trim(trObj.eq(i).find('td').eq(6).find('div').text());//平台商品Id
            obj.stock =  $.trim(trObj.eq(i).find('td').eq(7).find('div').text());//旧的库存
            obj.newStock =  $.trim(trObj.eq(i).find('td').eq(8).find('input').val());//新库存
            var checkStat = trObj.eq(i).find('td').eq(0).find('div').find('input').is(":checked");
            if(checkStat){
                if(obj.stock == obj.newStock){
                    trObj.eq(i).find('td').eq(9).find('.layui-table-cell').html("<div style='color:green'>"+"与原值相同不修改"+"</div>");
                }else{
                    arr.push(obj);
                }
            }
        }
        if(arr==null ||arr.length==0){
            layer.msg("请选择需要修改的数据！");
            return;
        }
        $.ajax({
            beforeSend: function(){
                loading.show();
            },
            type: "POST",
            url: ctx + "/mymallBatchOperation/updateStockNumber.html",
            data: {'prodObj':JSON.stringify(arr)},
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

        timeUnit = setInterval(function () {
            sel()
        }, 5000);
    });

    function sel(){
        var trObj =  $('#mymall_inventory_table').next().find('.layui-table-body tbody').find('tr');
        for(var i=0;i<trObj.length;i++){
            var obj = new Object();
            obj.storeAcctId =  $.trim(trObj.eq(i).find('td').eq(2).find('div').text());//店铺id
            obj.prodStoreSku =  $.trim(trObj.eq(i).find('td').eq(5).find('div').text());//商品子sku
            var checkStat = trObj.eq(i).find('td').eq(0).find('div').find('input').is(":checked");
            var resultMsg = trObj.eq(i).find('td').eq(9).find('.layui-table-cell').find('div').text();
            if((resultMsg=='' || resultMsg==null) && checkStat){
                selectResult(obj,trObj,i);
            }
        }
    }

    function selectResult(obj,trObj,i){
        $.ajax({
            type: "POST",
            url: ctx + "/mymallBatchOperation/selectModifyStockResult.html",
            data: {'prodObj':JSON.stringify(obj)},
            dataType: "json",
            success: function (returnData) {
                if (returnData.code == "0000") {
                    if(returnData.msg =='调整库存成功'){
                        trObj.eq(i).find('td').eq(9).find('.layui-table-cell').html("<div style='color:blue'>"+returnData.msg+"</div>");
                    }else if(returnData.msg!=''&& returnData.msg!=null &&returnData.msg != 'undefined'){
                        trObj.eq(i).find('td').eq(9).find('.layui-table-cell').html("<div style='color:red'>"+returnData.msg+"</div>");
                    }
                } else {
                    layer.msg(returnData.msg);
                }
            },
            error: function () {
                layer.msg("服务器正忙");
            }
        });
    }


    form.on('radio(apply)', function(data){
        var value = data.value;
        if(value==='1'){
            $('#mymall_in_addinvntory').val('').attr('disabled',true);
            $('#mymall_in_adjustto').attr('disabled',false);
        }else{
            $('#mymall_in_adjustto').val('').attr('disabled',true);
            $('#mymall_in_addinvntory').attr('disabled',false);
        }
      }); 

      form.on('submit(mymall_in_applyBtn)', function(data){
        var checkStatus = table.checkStatus('mymall_inventory_table');
        var addvalue = $('#mymall_in_addinvntory').val();
        var adjustvalue = $('#mymall_in_adjustto').val();
        if(checkStatus.data.length>0&&tableIns){
        var layFilterIndex = 'LAY-table-'+tableIns.config.index;
        var tableContainer = $('div[lay-filter="'+layFilterIndex+'"]');
        var value = data.field.apply;
        if(value==='1'){
            if(adjustvalue!==''){
            tableContainer.find('input[name="layTableCheckbox"]:checked').each(function(){
                var tr= $(this).parents('tr');
                 var input = tr.find('input[name="adjustprice"]');
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
                     var input = tr.find('input[name="adjustprice"]');
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
      table.on('checkbox(mymall_inventory_table)', function(obj){
        if(!obj.checked){
            $(this).parents('tr').find('td[data-field="newStock"]').find('input').val("");
        }
      });

});