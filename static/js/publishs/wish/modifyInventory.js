var wishModifyStockTimeUnit;
layui.use(['admin', 'form', 'layer', 'formSelects', 'element', 'laydate','table'], function () {
    var formSelects = layui.formSelects,
        table = layui.table,
        tableIns={};
        form = layui.form;
        form.render('checkbox');
        form.render('radio');
        form.render('select');
        //初始化店铺/销售员/部门
        render_hp_orgs_users("#wishModifyStore");
        //渲染数据
        var data = new Object();
        if(op_arr.length > 0){
            data.idList=[];
            data.storeAcctIdList = [];
       	 	data.storeAcctIdList = $.trim(data.storeAcctIdList);
            for (var i = 0; i < op_arr.length; i++){
                data.idList.push(op_arr[i].id);
            }
            data.idList = data.idList.join(",");
        }
        if(op_arr.length > 0){
            //执行重载
            tableReload(data);
        }
    function tableReload(data) {
     tableIns = table.render({
         method:'post'
        ,elem: '#wish_inventory_table'
        ,url: ctx + '/wishModifyStock/getModigyStock.html' //数据接口
        ,page: true //开启分页
        ,height: 500
        ,cols: [[ //表头
            {type: 'checkbox'}
            ,{ field: "id", title: "id" }
            ,{ field: "storeAcctId", title: "店铺id"}
            ,{field: 'storeAcct', title: '店铺'}
            ,{field: 'prodSSku', title: '商品SKU', width: 150}
            ,{field: 'sSku', title: '店铺SKU', width: 150 }
            ,{field: 'storeProdSId', title: '平台商品子ID', width: 190}
            ,{field: 'sales', title: '销量', width: 80}
            ,{field: 'price', title: '刊登价' , width: 80}
            ,{field: 'stock', title: '当前数量' , width: 80}
            ,{field: 'newStock', title: '调整数量' ,templet: '#new_stock', width: 80}
            ,{field: 'isPromotion', title: '是否黄钻',templet:'#wish_isPromotion', width: 90}
            ,{field: 'returnData', title: '操作结果', width: 100 }
            ,{field: 'storeProdPId', title: 'storeProdPId'}
        ]],
        id:"wish_inventory_table",
        limits:[10,20,50],
        limit:10,
        where:data,
        done:function(res, curr, count){
            $("#LAY-wish-inventory [data-field='id']").css('display', 'none');
            $("#LAY-wish-inventory [data-field='storeAcctId']").css('display', 'none');
            $("#LAY-wish-inventory [data-field='storeProdPId']").css('display', 'none');
            $("#num_span_wish").text("共"+count+"条");
        }
    });
    }
    $("#wish_inventoryBtn").click(function () {
        var type = $(this).data('type');
        active[type] ? active[type].call(this) : '';
    });
    var active = {
        reload: function () {
            var data = new Object();
            data.storeAcctIdList = [];
            data.sSkuList = [];
           /* var logisAttrContents = formSelects.value("selectAttr_store_wish_in");
            for (var i = 0; i < logisAttrContents.length; i++) {
                var logisAttr = logisAttrContents[i].value;
                data.storeAcctIdList.push($.trim(logisAttr));
            }*/
            var storeAcct = $("#wish_modifystock_store_sel").val();

            if(storeAcct!=null && storeAcct!='') {
                data.storeAcctIdList.push(storeAcct);
            }else{
                $("#wish_modifystock_store_sel").children().each(function () {
                    if ($(this).val() != "") {
                        data.storeAcctIdList.push($(this).val());
                    }
                });
            }
            console.log(data.storeAcctIdList)
            var skuStr = $.trim($("#wishModifyStore input[name='sSkuList']").val());
            if(skuStr !="" && skuStr!=null){
                data.sSkuList = $.trim(skuStr.split(","));
            }
            data.storeAcctIdList = $.trim(data.storeAcctIdList);

            // var salepersonId = $.trim($("#wishModifyStore select[name='saleName']").val());
            // data.salepersonId = salepersonId;
            data.searchType = $("#wish_modifyStock_sskuSearchType").val();//搜索类型
            var storeAcctId= [];
           /* $(".xm-select-dl").children().each(function () {
                  if($(this).attr("lay-value")!='undefined' && $(this).attr("lay-value")!=''){
                  	storeAcctId.push($(this).attr("lay-value"));
                  }
              })*/
            /*if(data.storeAcctIdList == null||data.storeAcctIdList=='' ||data.storeAcctIdList==[]){
          	  data.storeAcctIdList = $.trim(storeAcctId);

            }*/
            //执行重载
            tableReload(data);
        }
    };

    //批量修改调价消息
    $('#wish_upadateMainStock').click(function(){
        //获取表格行对象
        var trObj =  $('#wish_inventory_table').next().find('.layui-table-body tbody').find('tr');

        var  arr = new Array();
        for(var i=0;i<trObj.length;i++){
            var obj = new Object();
            obj.id =  $.trim(trObj.eq(i).find('td').eq(1).find('div').text());//同步数据id
            obj.storeAcctId =  $.trim(trObj.eq(i).find('td').eq(2).find('div').text());//店铺id
            obj.storeAcct =  $.trim(trObj.eq(i).find('td').eq(3).find('div').text());//店铺名称
            obj.prodSSku =  $.trim(trObj.eq(i).find('td').eq(4).find('div').text());//子sku
            obj.prodStoreSku =  $.trim(trObj.eq(i).find('td').eq(5).find('div').text());//店铺sku
            obj.productId =  $.trim(trObj.eq(i).find('td').eq(6).find('div').text());//平台商品Id
            obj.stock =  $.trim(trObj.eq(i).find('td').eq(9).find('div').text());//旧的库存
            obj.newStock =  $.trim(trObj.eq(i).find('td').eq(10).find('input').val());//新库存
            obj.isPromotion =  $.trim(trObj.eq(i).find('td').eq(11).find('div').text());//是否黄钻
            var checkStat = trObj.eq(i).find('td').eq(0).find('div').find('input').is(":checked");
            obj.storeProdPId =  $.trim(trObj.eq(i).find('td[data-field=storeProdPId]').find('div').text());
            if(checkStat){
                if(obj.stock == obj.newStock){
                    trObj.eq(i).find('td').eq(12).find('.layui-table-cell').html("<div style='color:green'>"+"与原值相同不修改"+"</div>");
                }else{
                    if($("#wish_modifyStock_isPromotion_id").prop("checked")){  //选中 全部修改
                        if($("#wish_modifyStock_num_id").prop("checked")){
                            //数量低于10被选中
                            arr.push(obj);
                        }else{
                            //数量低于10没有选中 判断数量是否大于10
                            if( obj.stock >= 10){
                                arr.push(obj);
                            }
                        }
                    }else{ //没选中, 只修改非黄钻
                        if(obj.isPromotion == '否'){
                            if($("#wish_modifyStock_num_id").prop("checked")){
                                //数量低于10被选中
                                arr.push(obj);
                            }else{
                                //数量低于10没有选中 判断数量是否大于10
                                if( obj.stock >= 10){
                                    arr.push(obj);
                                }
                            }
                        }
                    }
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
            url: ctx + "/wishModifyStock/updateStockNumber.html",
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

        wishModifyStockTimeUnit = setInterval(function () {
            sel(batchNo)
        }, 5000);
    });

    function sel(batchNo){
        var trObj =  $('#wish_inventory_table').next().find('.layui-table-body tbody').find('tr');
        var count = 0;
        for (var i = 0; i < trObj.length; i++) {
            var checkStat = trObj.eq(i).find('td').eq(0).find('div').find('input').is(":checked");
            var resultMsg = trObj.eq(i).find('td').eq(12).find('.layui-table-cell').find('div').text();
            if ((resultMsg == '' || resultMsg == null) && checkStat) {
                count++;
            }
        }
        if(count == 0){
            clearInterval(wishModifyStockTimeUnit);
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
                        var storeAcctId =  $.trim(trObj.eq(i).find('td').eq(2).find('div').text());//店铺id
                        var prodStoreSku =  $.trim(trObj.eq(i).find('td').eq(5).find('div').text());//商品子sku
                        var checkStat = trObj.eq(i).find('td').eq(0).find('div').find('input').is(":checked");
                        var resultMsg = trObj.eq(i).find('td').eq(12).find('.layui-table-cell').find('div').text();

                        var logMsg = data['TR_WISH_ADJUSTSTOCK_LOG' + prodStoreSku + storeAcctId];
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
                clearInterval(wishModifyStockTimeUnit);
            }
        });
    }

    form.on('radio(apply)', function(data){
        var value = data.value;
        if(value==='1'){
            $('#wish_in_addinvntory').val('').attr('disabled',true);
            $('#wish_in_adjustto').attr('disabled',false);
        }else{
            $('#wish_in_adjustto').val('').attr('disabled',true);
            $('#wish_in_addinvntory').attr('disabled',false);
        }
      }); 

      form.on('submit(wish_in_applyBtn)', function(data){
        var checkStatus = table.checkStatus('wish_inventory_table');
        var addvalue = $('#wish_in_addinvntory').val();
        var adjustvalue = $('#wish_in_adjustto').val();
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
      table.on('checkbox(wish_inventory_table)', function(obj){
        if(!obj.checked){
            $(this).parents('tr').find('td[data-field="newStock"]').find('input').val("");
        }
      });

});