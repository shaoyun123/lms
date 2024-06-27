/**
 * 上下架
 */
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
    if(joom_arr.length > 0){
        data.idList=[];
        for (var i = 0; i < joom_arr.length; i++){
            if($("#joom_online_online_num_span").parents("li").hasClass("layui-this")){
                data.isSale =1;
                $("#is_sale_s option[value='1']").attr("selected","selected");//根据值让option选中
            }
            if($("#joom_online_offline_num_span").parents("li").hasClass("layui-this")){
                data.isSale =0;
                $("#is_sale_s option[value='0']").attr("selected","selected");//根据值让option选中
                form.render('select');
            }
            data.idList.push(joom_arr[i].id);
        }
        data.idList = data.idList.join(",");
    }
    if(joom_arr.length > 0){
        tableReload(data);
    }
	function tableReload(data) {
        table.render({
            elem: "#enableProdTable",
            method:'post',
            url: ctx + "/joomIsEnableProduct/prodIsEnableS.html",
            cols: [[
                {type: "checkbox"},
                { field: "id", title: "id" ,width: 100},
                { field: "storeAcctId", title: "店铺id" , width: 100},
                { field: "storeAcct", title: "店铺" , width: 100},
                { field: "sSku", title: "商品SKU" , width: 160},
                { field: "storeSku", title: "店铺SKU", width: 130},
                { field: "storeProdSId", title: "平台商品子id", width: 180},
                { field: "shipping", title: "运费" , width: 100},
                { field: "currPrice", title: "当前刊登价", width: 100},
                { field: "stock", title: "库存", width: 100 },
                { field: "isSale", title: "当前状态",templet:'#saleStatsTpl', width: 100 },
                { field: "result",title: '操作结果', width: 200, align: 'center',}
            ]],
            where:data,
            page:false,
            id:"enableProdTable",
            limits:[10,20,50],
            limit:10,
            done:function(res, curr, count){
            	$("[data-field='id']").css('display', 'none');
                $("[data-field='storeAcctId']").css('display', 'none');
                $("#tolnum_span_joom_stop").text("共"+count+"条");

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
        	 var isSale = $.trim($("#adjustPriceSearchForm select[name='is_sale_s']").val());
        	 data.isSale = isSale;
            data.searchType = $("#joom_idEnable_skuSearchType").val();//搜索类型
            //执行重载
            /*table.reload('enableProdTable', {
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
    //批量下架商品消息
    $('#joom_batchDisEnableProd').click(function(){
    	var arrStat = [];
    	var arr = [];
    	//获取表格行对象
		var trObj =  $('#enableProdTable').next().find('.layui-table-body tbody').find('tr');
    	for(var i=0;i<trObj.length;i++){
    		 var checkStat = trObj.eq(i).find('td').eq(0).find('div').find('input').is(":checked");
    		 var obj = new Object();
    		 obj.id =  $.trim(trObj.eq(i).find('td').eq(1).find('div').text());//同步数据id
    		 var isSale =  $.trim(trObj.eq(i).find('td').eq(10).find('div').text());//商品状态
    		 //只修改被选中的商品信息
    		 if(checkStat && isSale=='上架中'){
    			 arrStat[i] = obj;
    		 }
    		
    	}
    	if(arrStat==null ||arrStat.length==0){
    		layer.msg("没有可以下架的商品！");
    		return;
    	}
    	var  arr = new Array();
    	for(var i=0;i<trObj.length;i++){
    		 var obj = new Object();
    		 obj.id =  $.trim(trObj.eq(i).find('td').eq(1).find('div').text());//同步数据id
    		 obj.storeAcctId =  $.trim(trObj.eq(i).find('td').eq(2).find('div').text());//店铺id
    		 obj.storeAcct =  $.trim(trObj.eq(i).find('td').eq(3).find('div').text());//店铺名称
    		 obj.prodSSku =  $.trim(trObj.eq(i).find('td').eq(4).find('div').text());//店铺sku
    		 obj.prodStoreSku =  $.trim(trObj.eq(i).find('td').eq(5).find('div').text());//店铺sku 
    		 obj.productId =  $.trim(trObj.eq(i).find('td').eq(6).find('div').text());//平台商品Id
    		 obj.shipping =  $.trim(trObj.eq(i).find('td').eq(7).find('div').text());//运费
    		 obj.currPrice =  $.trim(trObj.eq(i).find('td').eq(8).find('div').text());//旧的刊登价
    		 obj.stock =  $.trim(trObj.eq(i).find('td').eq(9).find('div').text());//库存
    		 var isSale =  $.trim(trObj.eq(i).find('td').eq(10).find('div').text());//商品状态
    		 obj.isSale =  isSale;
    		 var checkStat = trObj.eq(i).find('td').eq(0).find('div').find('input').is(":checked");
    		 //只下架上架中商品
    		 if(checkStat && isSale=='上架中'){
    			 obj.isEnableType = '0';//0代表下架
    			 arr.push(obj)
    		 }
    	}
    	 $.ajax({
    		 beforeSend: function(){
				 loading.show();
	          },
			 type: "POST",
			 url: ctx + "/joomIsEnableProduct/batchDisEnableProd.html",
			 data: {'prodObj':JSON.stringify(arr)},
			 async: true,
			 dataType: "json",
			 success: function (returnData) {
				 if (returnData.code == "0000") {
					 loading.hide()
			    	 layer.msg("操作成功");
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

        timeUnit = setInterval(function () {
    		sel()
    	}, 5000);
    });
    
  //批量上架商品信息
    $('#batchEnableProd').click(function(){
    	var arrStat = [];
    	var arr = [];
    	//获取表格行对象
		var trObj =  $('#enableProdTable').next().find('.layui-table-body tbody').find('tr');
    	for(var i=0;i<trObj.length;i++){
    		 var checkStat = trObj.eq(i).find('td').eq(0).find('div').find('input').is(":checked");
    		 var obj = new Object();
    		 obj.id =  $.trim(trObj.eq(i).find('td').eq(1).find('div').text());//同步数据id
    		 var isSale =  $.trim(trObj.eq(i).find('td').eq(10).find('div').text());//商品状态
    		 //只修改被选中的商品信息
    		 if(checkStat && isSale=='已下架'){
    			 arrStat[i] = obj;
    		 }
    		
    	}
    	if(arrStat==null ||arrStat.length==0){
    		layer.msg("没有可以上架的商品！");
    		return;
    	}
    	var  arr = new Array();
    	for(var i=0;i<trObj.length;i++){
    		 var obj = new Object();
    		 obj.id =  $.trim(trObj.eq(i).find('td').eq(1).find('div').text());//同步数据id
    		 obj.storeAcctId =  $.trim(trObj.eq(i).find('td').eq(2).find('div').text());//店铺id
    		 obj.storeAcct =  $.trim(trObj.eq(i).find('td').eq(3).find('div').text());//店铺名称
    		 obj.prodSSku =  $.trim(trObj.eq(i).find('td').eq(4).find('div').text());//店铺sku
    		 obj.prodStoreSku =  $.trim(trObj.eq(i).find('td').eq(5).find('div').text());//店铺sku 
    		 obj.productId =  $.trim(trObj.eq(i).find('td').eq(6).find('div').text());//平台商品Id
    		 obj.shipping =  $.trim(trObj.eq(i).find('td').eq(7).find('div').text());//运费
    		 obj.currPrice =  $.trim(trObj.eq(i).find('td').eq(8).find('div').text());//旧的刊登价
    		 obj.stock =  $.trim(trObj.eq(i).find('td').eq(9).find('div').text());//库存
    		 var isSale =  $.trim(trObj.eq(i).find('td').eq(10).find('div').text());//商品状态
    		 obj.isSale =  isSale;
    		 var checkStat = trObj.eq(i).find('td').eq(0).find('div').find('input').is(":checked");
    		 //只下架上架中商品
    		 if(checkStat && isSale=='已下架'){
    			 obj.isEnableType = '1';//1代表上架
    			 arr.push(obj)
    		 }
    	}
    	 $.ajax({
    		 beforeSend: function(){
				 loading.show();
	          },
			 type: "POST",
			 url: ctx + "/joomIsEnableProduct/batchEnableProd.html",
			 data: {'prodObj':JSON.stringify(arr)},
			 async: true,
			 dataType: "json",
			 success: function (returnData) {
				 if (returnData.code == "0000") {
					 loading.hide()
			    	 layer.msg("操作成功");
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
		 
    	setInterval(function () {
    		sel()
    	}, 5000);
    });
    
    function sel(){
		var trObj =  $('#enableProdTable').next().find('.layui-table-body tbody').find('tr');
    	for(var i=0;i<trObj.length;i++){
      		 var obj = new Object();
      		 obj.storeAcctId =  $.trim(trObj.eq(i).find('td').eq(2).find('div').text());//店铺id
      		 obj.prodStoreSku =  $.trim(trObj.eq(i).find('td').eq(5).find('div').text());//商品子sku
      		 var checkStat = trObj.eq(i).find('td').eq(0).find('div').find('input').is(":checked");
     		 var resultMsg = trObj.eq(i).find('td').eq(11).find('.layui-table-cell').find('div').text();
     		 if((resultMsg=='' || resultMsg==null) && checkStat){
     			 selectResult(obj,trObj,i);
     		 }
       	}
    }
    function selectResult(obj,trObj,i){
		 $.ajax({
			 type: "POST",
			 url: ctx + "/joomIsEnableProduct/selectResult.html",
			 data: {'prodObj':JSON.stringify(obj)},
			 async: true,
			 dataType: "json",
			 success: function (returnData) {
				 if (returnData.code == "0000") {
					 if(returnData.msg =='上架成功' || returnData.msg =='下架成功'){
						 trObj.eq(i).find('td').eq(11).find('.layui-table-cell').html("<div style='color:blue'>"+returnData.msg+"</div>");
					 }else if(returnData.msg!=''&& returnData.msg!=null &&returnData.msg != 'undefined'){
						 trObj.eq(i).find('td').eq(11).find('.layui-table-cell').html("<div style='color:red'>"+returnData.msg+"</div>");
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
    
});