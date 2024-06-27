var daytoshipTimeUnit;
layui.use(['admin', 'form', 'layer','table', 'formSelects', 'element', 'laydate'], function() {
	 var admin = layui.admin,
     form = layui.form,
     layer = layui.layer,
     table = layui.table,
     formSelects = layui.formSelects,
     element = layui.element,
     laydate = layui.laydate,
     laypage = layui.laypage,
	 $ = layui.$,
	 tableIns={};

    form.render(null, 'component-form-element');
    form.render(null, 'component-form-group');
    form.render('select');
    //表格渲染结果
    //展示已知数据
    var data = new Object();
    if(shop_arr.length > 0){
        data.idList=[];
        for (var i = 0; i < shop_arr.length; i++){
            data.idList.push(shop_arr[i].id);
        }
        data.idList = data.idList.join(",");
    }
    if(shop_arr.length > 0){
        tableReload(data);
    }
	function tableReload(data) {
        tableIns = table.render({
            elem: "#modifyDaysToShipTable",
            method:'post',
            url: ctx + "/shopee/shopeeIsEnableProduct/prodStopPublish.html",
            cols: [[
                {type: "checkbox"},
                { field: "id", title: "id" ,width: '10%'},
                { field: "storeAcctId", title: "店铺id" , width: '10%'},
                { field: "pStoreSku", title: "店铺父SKU", width: '12%'},
                { field: "itemId", title: "item_id", width: '12%'},
                { field: "storeAcct", title: "店铺" , width: '12%'},
                { field: "pSku", title: "商品父SKU" , width: '12%'},
                { field: "daysToShip", title: "备货天数", width: '12%'},
                { field: "newDaysToShip", title: "新备货天数",templet:'#newDaysToShipTpl', width: '12%' },
                { field: "salesSite", title: "站点", width: '12%' },
                { field: "result",title: '操作结果', width: '12%', align: 'center',}
            ]],
            where:data,
			page:false,
			height: 500,
            id:"modifyDaysToShipTable",
            limits:[10,20,50],
            limit:10,
            done:function(res, curr, count){
            	$("[data-field='id']").css('display', 'none');
                $("[data-field='storeAcctId']").css('display', 'none');
                $("#tolnum_span_shopee_daytoship").text("共"+count+"条");

            }
        });

    }


    var active = {
        reload: function () {
        	 var data = new Object();
        	 data.storeAcctIdList = [];
        	 data.sSkuList = [];
        	 var logisAttrContents = formSelects.value("selectAttr_store");
        	 for (var i = 0; i < logisAttrContents.length; i++) {
        	        var logisAttr = logisAttrContents[i].value;
        	        data.storeAcctIdList.push($.trim(logisAttr));
        	    }
        	 var skuStr = $.trim($("#adjustPriceSearchForm input[name='sSkuList']").val());
        	 if(skuStr !="" && skuStr!=null){
        		 data.sSkuList = $.trim(skuStr.split(","));
        	 }
        	 data.storeAcctIdList = $.trim(data.storeAcctIdList);
            data.searchType = $("#shopee_modifyStoct_skuSearchType").val();//搜索类型

            //执行重载
         /*   table.reload('modifyDaysToShipTable', {
                where: data,
            });*/
            tableReload(data);
        }
    };
    $("#adjustPriceSearchBtn").click(function () {
    	var type = $(this).data('type');
        active[type] ? active[type].call(this) : '';
    });
    $("#adjustPriceResetBtn").click(function () {
        $("#adjustPriceSearchForm input[name='sSku']").val('');
        formSelects.value('selectAttr', []);
    });
    
    /**
     * 一键写入备货天数
     */
    $("#newStockBtn").click(function () {
		var newDaysToShip = $("#adjustPriceSearchForm input[name='newDaysToShip']").val();

		/*if(newDaysToShip!=2 && newDaysToShip<7) {
			layer.msg("备货天数必需等于2或者大于等于7");
			return;
		}*/
		if(newDaysToShip!==""){
			applytoChecked('modifyDaysToShipTable',tableIns,function(tr){
					$.trim(tr.find('input[name=newDaysToShip]').val(newDaysToShip));//新的备货天数
			});
		}

	});
    
    
    //批量修改库存消息
    $('#batchEnableProd').click(function(){
    	var arrStat = [];
    	var arr = [];
    	//获取表格行对象
		 var trObj =  $('#modifyDaysToShipTable').next().find('.layui-table-body tbody').find('tr');
    	for(var i=0;i<trObj.length;i++){
    		 var checkStat = trObj.eq(i).find('td').eq(0).find('div').find('input').is(":checked");
    		 var obj = new Object();
    		 obj.id =  $.trim(trObj.eq(i).find('td').eq(1).find('div').text());//同步数据id
    		 //只修改被选中的商品信息
    		 if(checkStat){
    			 arrStat[i] = obj;
    		 }
    		
    	}
    	if(arrStat==null ||arrStat.length==0){
    		layer.msg("请选择数据！");
    		return;
    	}
    	var  arr = new Array();
    	for(var i=0;i<trObj.length;i++){
    		 var obj = new Object();
    		 obj.id =  $.trim(trObj.eq(i).find('td').eq(1).find('div').text());//同步数据id
    		 obj.storeAcctId =  $.trim(trObj.eq(i).find('td').eq(2).find('div').text());//店铺id
    		 obj.prodStoreSku =  $.trim(trObj.eq(i).find('td').eq(3).find('div').text());//店铺sku
    		 obj.itemId =  $.trim(trObj.eq(i).find('td').eq(4).find('div').text());//平台商品Id
    		 obj.storeAcct =  $.trim(trObj.eq(i).find('td').eq(5).find('div').text());//店铺名称
    		 obj.prodPSku =  $.trim(trObj.eq(i).find('td').eq(6).find('div').text());//商品sku
    		 obj.daysToShip =  $.trim(trObj.eq(i).find('td').eq(7).find('div').text());//当前备货天数
    		 obj.newDaysToShip =  $.trim(trObj.eq(i).find('td').eq(8).find('input[name=newDaysToShip]').val());//新的备货天数
    		 obj.globalItemId =  $.trim(trObj.eq(i).find('td').eq(8).find('input[name=globalItemId]').val());//globalItemId
    		 var checkStat = trObj.eq(i).find('td').eq(0).find('div').find('input').is(":checked");
    		 if(checkStat){
    			/* if(obj.newDaysToShip!=2 && obj.newDaysToShip<7) {
    				 layer.msg("备货天数必需等于2或者大于等于7");
    				 return;
    			 }*/
    			 arr.push(obj)
    		 }
    	}
		//以当前时间戳作为批次号
		var batchNo = new Date().getTime();
    	 $.ajax({
    		 beforeSend: function(){
				 loading.show();
	          },
			 type: "POST",
			 url: ctx + "/shopee/shopeeIsEnableProduct/batchModifyDaysToShip.html",
			 data: {'prodObj':JSON.stringify(arr), 'batchNo': batchNo},
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
				 loading.hide()
				 layer.msg("服务器正忙");
			 }
		 });
		daytoshipTimeUnit = setInterval(function () {
    		sel(batchNo)
    	}, 5000);
    });
    
    function sel(batchNo){
		var trObj =  $('#modifyDaysToShipTable').next().find('.layui-table-body tbody').find('tr');
		var count = 0;
		for (var i = 0; i < trObj.length; i++) {
			var checkStat = trObj.eq(i).find('td').eq(0).find('div').find('input').is(":checked");
			var resultMsg = trObj.eq(i).find('td').eq(10).find('.layui-table-cell').find('div').text();
			if ((resultMsg == '' || resultMsg == null) && checkStat) {
				count++;
			}
		}
		if(count == 0){
			console.log("清楚定時")
			clearInterval(daytoshipTimeUnit);
			return;
		}

		$.ajax({
			type: "POST",
			url: ctx + "/shopee/shopeeIsEnableProduct/selectResult.html",
			data: {'batchNo':batchNo},
			async: true,
			dataType: "json",
			success: function (returnData) {
				if (returnData.code == "0000") {
					var data = returnData.data;

					for (var i = 0; i < trObj.length; i++) {
						var itemId = $.trim(trObj.eq(i).find('td').eq(4).find('div').text());//平台商品Id
						var checkStat = trObj.eq(i).find('td').eq(0).find('div').find('input').is(":checked");
						var resultMsg = trObj.eq(i).find('td').eq(10).find('.layui-table-cell').find('div').text();

						var logMsg = data['TR_SHOPEE_MODIFY_DAYSTOSHIP' + itemId];
						if ((resultMsg == '' || resultMsg == null) && checkStat) {
							if (logMsg == '调整备货天数成功') {
								trObj.eq(i).find('td').eq(10).find('.layui-table-cell').html("<div style='color:blue'>" + logMsg + "</div>");
							} else if (logMsg != '' && logMsg != null && logMsg != 'undefined') {
								trObj.eq(i).find('td').eq(10).find('.layui-table-cell').html("<div style='color:red'>" + logMsg + "</div>");
							}
						}
					}
				}
			},
			error: function () {
				layer.msg("服务器正忙");
				clearInterval(daytoshipTimeUnit);
			}
		});
    }
});