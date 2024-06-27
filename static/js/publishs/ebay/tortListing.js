var ebayTortListingTimeUnit;
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
		var isOffline = $.trim($("#adjustPriceSearchForm select[name='is_offline_tort']").val());
		data.isOffline = isOffline;
		data.idList = data.idList.join(",");
    }
    if(modifyTitle_arr.length > 0){
        tableReload(data);
    }
    var a = 1;
	function tableReload(data) {
        table.render({
            elem: "#tortListngTable",
            method:'post',
            url: ctx + "/ebayIsEnableProduct/tortListingQuery.html",
            cols: [[
                {type: "checkbox"},
                { field: "id", title: "id" ,width: 100},
                { field: "storeAcctId", title: "店铺id" , width: 100},
				/* { field: "storePSku", title: "店铺父SKU", width: 130},*/
                { field: "itemId", title: "item_id", width: 130},
                { field: "storeAcct", title: "店铺" , width: 100},
                { field: "storePSku", title: "店铺父SKU" , width: 120},
				/* { field: "siteName", title: "站点", width: 60},
				 { field: "location", title: "location", width: 130},
				 { field: "soldNums", title: "销售数量", width: 90},
				 { field: "currency", title: "币种" , width: 50},
				 { field: "stock", title: "库存", width: 130},*/
                { field: "title", title: "原标题",templet: '#titleTpl', width: 250},
                { field: "isOffline", title: "listing状态", width: 130,templet: '#offlineStatsTpl'},
                { field: "result",title: '操作结果', width: 200, align: 'center'}
            ]],
			where:data,
            page:false,
            id:"tortListngTable",
			limits:[10,20,50],
			height: 500,
            limit:10,
            done:function(res, curr, count){
            	$("[data-field='id']").css('display', 'none');
                $("[data-field='storeAcctId']").css('display', 'none');
                if(a==2 && count==0){
                    layer.msg("没有侵权数据！");
                }else{
                    $("#tolnum_span").text("共"+count+"条");
                }

            }
        });
    }



    var active = {
        reload: function () {
        	 a=2;
        	 var data = new Object();
        	 data.storeAcctIdList = [];
        	 data.sSkuList = [];
        	 var logisAttrContents = formSelects.value("selectAttr_store");
        	 for (var i = 0; i < logisAttrContents.length; i++) {
        	        var logisAttr = logisAttrContents[i].val;
        	        data.storeAcctIdList.push($.trim(logisAttr));
        	    }
        	 var skuStr = $.trim($("#adjustPriceSearchForm input[name='sSkuList']").val());
        	 if(skuStr !="" && skuStr!=null){
        		 data.sSkuList = $.trim(skuStr.split(","));
        	 }
        	 var isOffline = $.trim($("#adjustPriceSearchForm select[name='is_offline_tort']").val());
        	 data.isOffline = isOffline;
        	 data.storeAcctIdList = $.trim(data.storeAcctIdList);
            data.searchType = $("#EBAY_torListing_pskuSearchType").val();//搜索类型
            //执行重载
           /* table.reload('tortListngTable', {
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
    
    
    table.on('tool(tortListngTable)', function(obj) {
        var layEvent = obj.event; //获得 lay-event 对应的值
        var data = obj.data; //获得当前行数据
        if(layEvent === 'show_item'){
        	window.open("http://www.ebay.com/itm/"+data.itemId+"");  
        }
    })
    
    //批量处理
    $('#batchEnableProd').click(function(){
    	var arrStat = [];
    	var arr = [];
    	//获取表格行对象
		 var trObj =  $('#tortListngTable').next().find('.layui-table-body tbody').find('tr');

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
    	 var  arr = new Array();
    	for(var i=0;i<trObj.length;i++){
    		 var obj = new Object();
    		 obj.id =  $.trim(trObj.eq(i).find('td').eq(1).find('div').text());//同步数据id
    		 obj.storeAcctId =  $.trim(trObj.eq(i).find('td').eq(2).find('div').text());//店铺id
             obj.itemId =  $.trim(trObj.eq(i).find('td').eq(3).find('div').text());//平台商品Id
             obj.storeAcct =  $.trim(trObj.eq(i).find('td').eq(4).find('div').text());//店铺名称
    		 obj.prodStoreSku =  $.trim(trObj.eq(i).find('td').eq(5).find('div').text());//店铺sku
             obj.isOffline =  $.trim(trObj.eq(i).find('td').eq(7).find('div').text());//店铺sku
    		 var checkStat = trObj.eq(i).find('td').eq(0).find('div').find('input').is(":checked");
    		 if(checkStat && obj.isOffline=='上架中'){
        		 arr.push(obj)
    		 }else if(checkStat && obj.isOffline=='已下架'){
                 trObj.eq(i).find('td').eq(8).find('div').text('无需处理')
                 continue;
    		 }
    	}
		//以当前时间戳作为批次号
		var batchNo = new Date().getTime();
		 $.ajax({
			 beforeSend: function(){
				 loading.show();
			  },
			 type: "POST",
			 url: ctx + "/ebayIsEnableProduct/checkTortListing.html",
			 data: {'prodObj':JSON.stringify(arr),'batchNo':batchNo},
			 async: true,
			 dataType: "json",
			 success: function (returnData) {
				 if (returnData.code == "0000") {
					 layer.msg(returnData.msg);
					 loading.hide()
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
		ebayTortListingTimeUnit = setInterval(function () {
    		sel(batchNo)
    	}, 10000);
    });
    
    function sel(batchNo){
		var trObj =  $('#tortListngTable').next().find('.layui-table-body tbody').find('tr');
		var count = 0;
		for (var i = 0; i < trObj.length; i++) {
			var checkStat = trObj.eq(i).find('td').eq(0).find('div').find('input').is(":checked");
			var resultMsg = trObj.eq(i).find('td').eq(8).find('.layui-table-cell').find('div').text();
			if ((resultMsg == '' || resultMsg == null) && checkStat) {
				count++;
			}
		}
		if(count == 0){
			clearInterval(ebayTortListingTimeUnit);
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
						var itemId = $.trim(trObj.eq(i).find('td').eq(3).find('div').text());//平台商品Id
						var prodStoreSku =  $.trim(trObj.eq(i).find('td').eq(5).find('div').text());//店铺sku
						var checkStat = trObj.eq(i).find('td').eq(0).find('div').find('input').is(":checked");
						var resultMsg = trObj.eq(i).find('td').eq(8).find('.layui-table-cell').find('div').text();

						var logMsg = data['TR_EBAY_TORTLISTING' + itemId + prodStoreSku];
						if ((resultMsg == '' || resultMsg == null) && checkStat) {
							if (logMsg == '处理成功') {
								trObj.eq(i).find('td').eq(8).find('.layui-table-cell').html("<div style='color:blue'>" + logMsg + "</div>");
							} else if (logMsg != '' && logMsg != null && logMsg != 'undefined') {
								trObj.eq(i).find('td').eq(8).find('.layui-table-cell').html("<div style='color:red'>" + logMsg + "</div>");
							}
						}
					}
				}
			},
			error: function () {
				layer.msg("服务器正忙");
				clearInterval(ebayTortListingTimeUnit);
			}
		});
    }
});