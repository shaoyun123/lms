var ebatstopPublishTimeUnit;
layui.use(['admin', 'form', 'layer','table', 'formSelects', 'element', 'laydate'], function() {
	 var admin = layui.admin,
     form = layui.form,
     layer = layui.layer,
     table = layui.table,
     formSelects = layui.formSelects,
     element = layui.element,
     laydate = layui.laydate,
     laypage = layui.laypage,
     $ = layui.$

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
        tableRelode(data);
    }
	function tableRelode(data) {
        table.render({
            elem: "#stopPublishTable",
            method:'post',
            url: ctx + "/ebayIsEnableProduct/prodStopPublish.html",
            cols: [[
                {type: "checkbox"},
                { field: "id", title: "id" ,width: 100},
                { field: "storeAcctId", title: "店铺id" , width: 100},
                { field: "storePSku", title: "店铺父SKU", width: 130},
                { field: "itemId", title: "item_id", width: 130},
                { field: "storeAcct", title: "店铺" , width: 100},
                { field: "prodPSku", title: "商品父SKU" , width: 120},
                { field: "siteName", title: "站点", width: 60},
                { field: "location", title: "location",templet:'#locationCountryTpl', width: 130},
                { field: "soldNums", title: "销售数量", width: 90},
                { field: "currency", title: "币种" , width: 50},
                { field: "stock", title: "在线数量", width: 130},
                { field: "result",title: '操作结果', width: 200, align: 'center',}
            ]],
			where:data,
            page:false,
			id:"stopPublishTable",
			height: 500,
            limits:[10,20,50],
            limit:1000,
            done:function(res, curr, count){
            	$("[data-field='id']").css('display', 'none');
                $("[data-field='storeAcctId']").css('display', 'none');
                $("#tolnum_span_ebay_stop").text("共"+count+"条");

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
            data.searchType = $("#Ebay_stopListing_pskuSearchType").val();//搜索类型
            //执行重载
            /*table.reload('stopPublishTable', {
                where: data,
            });*/
            tableRelode(data);
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
    
    
    //批量修改调价消息
    $('#batchEnableProd').click(function(){
    	var arrStat = [];
    	var arr = [];
    	//获取表格行对象
		 var trObj =  $('#stopPublishTable').next().find('.layui-table-body tbody').find('tr');

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
    		layer.msg("请选择需要操作数据！");
    		return;
    	}
		//以当前时间戳作为批次号
		var batchNo = new Date().getTime();
		layer.confirm('确认提交本次操作?', {icon: 3, title:'提示'}, function(index){
			 var  arr = new Array();
			for(var i=0;i<trObj.length;i++){
				 var obj = new Object();
				 obj.id =  $.trim(trObj.eq(i).find('td').eq(1).find('div').text());//同步数据id
				 obj.storeAcctId =  $.trim(trObj.eq(i).find('td').eq(2).find('div').text());//店铺id
				 obj.prodStoreSku =  $.trim(trObj.eq(i).find('td').eq(3).find('div').text());//店铺sku
				 obj.itemId =  $.trim(trObj.eq(i).find('td').eq(4).find('div').text());//平台商品Id
				 obj.storeAcct =  $.trim(trObj.eq(i).find('td').eq(5).find('div').text());//店铺名称
				 obj.prodSSku =  $.trim(trObj.eq(i).find('td').eq(6).find('div').text());//商品sku
				 obj.siteName =  $.trim(trObj.eq(i).find('td').eq(7).find('div').text());//站点
				 obj.soldNums =  $.trim(trObj.eq(i).find('td').eq(9).find('div').text());//库存

				 obj.currency =  $.trim(trObj.eq(i).find('td').eq(10).find('div').text());//币种
				 var checkStat = trObj.eq(i).find('td').eq(0).find('div').find('input').is(":checked");
				 if(checkStat){
					 arr.push(obj)
				 }
			}

			 $.ajax({
				 beforeSend: function(){
					 loading.show();
				  },
				 type: "POST",
				 url: ctx + "/ebayIsEnableProduct/batchStopPublish.html",
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
			ebatstopPublishTimeUnit = setInterval(function () {
				sel(batchNo)
			}, 10000);
			layer.close(index);
		});


    });
    
    function sel(batchNo){
		var trObj =  $('#stopPublishTable').next().find('.layui-table-body tbody').find('tr');
		var count = 0;
		for (var i = 0; i < trObj.length; i++) {
			var checkStat = trObj.eq(i).find('td').eq(0).find('div').find('input').is(":checked");
			var resultMsg = trObj.eq(i).find('td').eq(12).find('.layui-table-cell').find('div').text();
			if ((resultMsg == '' || resultMsg == null) && checkStat) {
				count++;
			}
		}
		if(count == 0){
			clearInterval(ebatstopPublishTimeUnit);
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
						var resultMsg = trObj.eq(i).find('td').eq(12).find('.layui-table-cell').find('div').text();

						var logMsg = data['TR_EBAY_STOP_PUBLISH' + itemId + prodStoreSku];
						if ((resultMsg == '' || resultMsg == null) && checkStat) {
							if (logMsg == '终止刊登成功') {
								trObj.eq(i).find('td').eq(12).find('.layui-table-cell').html("<div style='color:blue'>" + logMsg + "</div>");
							} else if (logMsg != '' && logMsg != null && logMsg != 'undefined') {
								trObj.eq(i).find('td').eq(12).find('.layui-table-cell').html("<div style='color:red'>" + logMsg + "</div>");
							}
						}
					}
				}
			},
			error: function () {
				layer.msg("服务器正忙");
				clearInterval(ebatstopPublishTimeUnit);
			}
		});
    }

    
});