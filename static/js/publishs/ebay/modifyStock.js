var ebaymodifyStockTimeUnit;
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
	 tableIns = {}

    form.render(null, 'component-form-element');
    form.render(null, 'component-form-group');
    form.render('select');
    //表格渲染结果
    //展示已知数据
    var data = new Object();
    if(modifyTitle_arr.length > 0){
        data.idList=[];
        for (var i = 0; i < modifyTitle_arr.length; i++){
            data.idList.push(modifyTitle_arr[i].id);
        }
        data.idList = data.idList.join(",");
    }
    if(modifyTitle_arr.length > 0){
        tableReload(data);
    }
	function tableReload(data) {
        tableIns = table.render({
            elem: "#modifyStockTable",
            method:'post',
            url: ctx + "/ebayIsEnableProduct/prodAdjustPage.html",
            cols: [[
                {type: "checkbox"},
                { field: "id", title: "id" ,width: 60},
                { field: "storeAcctId", title: "店铺id" , width: 60},
                { field: "storeSku", title: "店铺SKU", width: 130},
                { field: "itemId", title: "item_id", width: 100},
                { field: "storeAcct", title: "店铺" , width: 100},
                { field: "sSku", title: "商品SKU" , width: 120},
                { field: "siteName", title: "站点", width: 60},
                { field: "location", title: "location",templet:'#locationCountryTpl', width: 130},
                { field: "soldNums", title: "销售数量", width: 60},
                { field: "currency", title: "币种" , width: 50},
                { field: "stock", title: "库存", width: 130},
                { field: "newStock", title: "调整库存",templet:'#newStockTpl', width: 100 },
                { field: "result",title: '操作结果', width: 200, align: 'center',}
			]],
			id:"modifyStockTable",
            where:data,
			page:false,
			height: 500,
            limits:[10,20,50],
            limit:10,
            done:function(res, curr, count){
            	$("[data-field='id']").css('display', 'none');
                $("[data-field='storeAcctId']").css('display', 'none');
                $("#tolnum_span_ebay_stock").text("共"+count+"条");
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
            data.searchType = $("#Ebay_modifyStock_sskuSearchType").val();//搜索类型
			data.soldNumsBegin = $.trim($("#adjustPriceSearchForm input[name='soldNumsBegin']").val());
            data.soldNumsEnd = $.trim($("#adjustPriceSearchForm input[name='soldNumsEnd']").val());
            //执行重载
          /*  table.reload('modifyStockTable', {
//                page: {curr: 1},
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
     * 一键写入库存值
     */
    $("#newStockBtn").click(function () {
		var newStock = $("#adjustPriceSearchForm input[name='newStockInput']").val();
		if(newStock!==""){
		applytoChecked('modifyStockTable',tableIns,function(tr){
			$.trim(tr.find('.newStock').val(newStock));//新的价格
		});
	    }
	});   
    
    //批量修改库存消息
    $('#batchEnableProd').click(function(){
    	var arrStat = [];
    	var arr = [];
    	//获取表格行对象
		 var trObj =  $('#modifyStockTable').next().find('.layui-table-body tbody').find('tr');
		var calType = $("#adjustPriceSearchForm select[name='calculateType']").val();
		var newStock = $("#adjustPriceSearchForm input[name='newStockAllInput']").val();

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
    		 obj.prodSSku =  $.trim(trObj.eq(i).find('td').eq(6).find('div').text());//商品sku
    		 obj.siteId =  $.trim(trObj.eq(i).find('td').eq(7).find('div').text());//站点
    		 obj.soldNums =  $.trim(trObj.eq(i).find('td').eq(9).find('div').text());//库存
    		 
    		 obj.currency =  $.trim(trObj.eq(i).find('td').eq(10).find('div').text());//币种
    		 obj.stock =  $.trim(trObj.eq(i).find('td').eq(11).find('div').text());//当前库存
    		 obj.newStock =  $.trim(trObj.eq(i).find('td').eq(12).find('input').val());//新的库存
    		 var checkStat = trObj.eq(i).find('td').eq(0).find('div').find('input').is(":checked");
    		 //    		 arrStat[i] = obj;
    		 if(checkStat){
    		 	if(obj.newStock != obj.stock){
					if(calType == '1'){
						if(parseInt(obj.stock)<=parseInt(newStock)){
							arr.push(obj)
						}else{
							trObj.eq(i).find('td').eq(13).find('.layui-table-cell').html("<div style='color:blue'>库存大于"+newStock+"不处理</div>");
						}
					}else if(calType == '2'){
						if(parseInt(obj.stock)!=parseInt(newStock)){
							arr.push(obj)
						}else{
							trObj.eq(i).find('td').eq(13).find('.layui-table-cell').html("<div style='color:blue'>库存等于"+newStock+"不处理</div>");
						}
					}else{
						if(parseInt(obj.stock)>=parseInt(newStock)){
							arr.push(obj)
						}else{
							trObj.eq(i).find('td').eq(13).find('.layui-table-cell').html("<div style='color:blue'>库存小于"+newStock+"不处理</div>");
						}
					}
				}else{
					trObj.eq(i).find('td').eq(13).find('.layui-table-cell').html("<div style='color:blue'>与原库存一样</div>");
				}
    		 }
    	}
		//以当前时间戳作为批次号
		var batchNo = new Date().getTime();
    	$.ajax({
    		beforeSend: function(){
				 loading.show();
	          },
			 type: "POST",
			 url: ctx + "/ebayIsEnableProduct/batchModifyStock.html",
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
				 loading.hide()
				 layer.msg("服务器正忙");
			 }
		 });


		ebaymodifyStockTimeUnit = setInterval(function () {
    		sel(batchNo)
    	}, 20000);
    });

    function sel(batchNo){
		var trObj =  $('#modifyStockTable').next().find('.layui-table-body tbody').find('tr');
		var count = 0;
		for (var i = 0; i < trObj.length; i++) {
			var checkStat = trObj.eq(i).find('td').eq(0).find('div').find('input').is(":checked");
			var resultMsg = trObj.eq(i).find('td').eq(13).find('.layui-table-cell').find('div').text();
			if ((resultMsg == '' || resultMsg == null) && checkStat) {
				count++;
			}
		}
		if(count == 0){
			clearInterval(ebaymodifyStockTimeUnit);
			return;
		}
		$.ajax({
			type: "POST",
			url: ctx + "/sys/selectResult.html",
			data: {'batchNo':batchNo},
			async: true,
			dataType: "json",
			success: function (returnData) {
				if (returnData.code == "0000") {
					var data = returnData.data;

					for (var i = 0; i < trObj.length; i++) {
						var itemId = $.trim(trObj.eq(i).find('td').eq(4).find('div').text());//平台商品Id
						var prodStoreSku =  $.trim(trObj.eq(i).find('td').eq(3).find('div').text());//店铺sku
						var checkStat = trObj.eq(i).find('td').eq(0).find('div').find('input').is(":checked");
						var resultMsg = trObj.eq(i).find('td').eq(13).find('.layui-table-cell').find('div').text();

						var logMsg = data['TR_EBAY_MODIFY_STOCK' + itemId + prodStoreSku];
						if ((resultMsg == '' || resultMsg == null) && checkStat) {
							if (logMsg == '调整库存成功') {
								trObj.eq(i).find('td').eq(13).find('.layui-table-cell').html("<div style='color:blue'>" + logMsg + "</div>");
							} else if (logMsg != '' && logMsg != null && logMsg != 'undefined') {
								trObj.eq(i).find('td').eq(13).find('.layui-table-cell').html("<div style='color:red'>" + logMsg + "</div>");
							}
						}
					}
				}
			},
			error: function () {
				layer.msg("服务器正忙");
				clearInterval(ebaymodifyStockTimeUnit);
			}
		});
    }
});