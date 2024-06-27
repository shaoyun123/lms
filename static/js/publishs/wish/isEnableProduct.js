/**
 * 上下架
 */
var wishSskuIsEnaTimeUnit;
layui.use(['admin', 'form', 'layer','table', 'formSelects', 'element', 'laydate'], function() {
	 var admin = layui.admin,
     form = layui.form,
     layer = layui.layer,
     table = layui.table,
     formSelects = layui.formSelects,
	 tableisEnable ={},
     $ = layui.$
     render_hp_orgs_users("#adjustPriceSearchForm");//渲染部门销售员店铺三级联动
    form.render(null, 'component-form-element');
    form.render(null, 'component-form-group');
    formSelects = layui.formSelects
    form.render('select');
    form.render('checkbox');

    //表格渲染结果
    //展示已知数据
    var data = new Object();
    if(op_arr.length > 0){
        data.idList=[];
        data.storeAcctIdList = [];
        var storeAcct = $("#wish_isEnableProd_store_sel").val();
        if(storeAcct!=null && storeAcct!='') {
            data.storeAcctIdList.push(storeAcct);
        }else{
            $("#wish_isEnableProd_store_sel").children().each(function () {
                if ($(this).val() != "") {
                    data.storeAcctIdList.push($(this).val());
                }
            });
        }
   	 	data.storeAcctIdList = $.trim(data.storeAcctIdList);
        for (var i = 0; i < op_arr.length; i++){
            if($("#wish_online_online_num_span").parents("li").hasClass("layui-this")){
                data.isSale =1;
                $("#is_sale_s option[value='1']").attr("selected","selected");//根据值让option选中
            }
            if($("#wish_online_offline_num_span").parents("li").hasClass("layui-this")){
                data.isSale =0;
                $("#is_sale_s option[value='0']").attr("selected","selected");//根据值让option选中
            }
            data.idList.push(op_arr[i].id);
        }
        data.idList = data.idList.join(",");
    }
    if(op_arr.length > 0){
        //console.log(data.idList);
        tableReload(data);
    }
    function tableReload(data) {
        tableisEnable = table.render({
            elem: "#enableProdTable",
            method:'post',
            url: ctx + "/wishIsEnableProduct/prodIsEnableS.html",
            cols: [[
                {type: "checkbox"},
                { field: "id", title: "id" ,width: 100},
                { field: "storeAcctId", title: "店铺id" , width: 100},
                { field: "storeAcct", title: "店铺" , width: 90},
                { field: "sSku", title: "商品SKU" , width: 110},
                { field: "storeSku", title: "店铺SKU", width: 110},
                { field: "storeProdSId", title: "平台商品子id", width: 180},
                { field: "shipping", title: "运费" , width: 50},
                { field: "currPrice", title: "当前刊登价", width: 60},
                { field: "stock", title: "库存", width: 60 },
                { field: "isPromotion", title: "是否黄钻", width: 90 },
                { field: "isSale", title: "当前状态",templet:'#saleStatsTpl', width: 100 },
                { field: "result",title: '操作结果', width: 160, align: 'center'},
                { field: "listingTimes",title: 'listingTimes', width: 160, align: 'center'},
                { field: "isSalesPromotion",title: 'isSalesPromotion', width: 160, align: 'center'},
                { field: "sales",title: 'sales', width: 160, align: 'center'}
            ]],
            page:false,
            where:data,
			id:"enableProdTable",
			height: 500,
            limits:[10,20,50],
            limit:10,
            done:function(res, curr, count){
            	$("[data-field='id']").css('display', 'none');
                $("[data-field='storeAcctId']").css('display', 'none');
                $("[data-field='isSalesPromotion']").css('display', 'none');
                $("[data-field='listingTimes']").css('display', 'none');
                $("[data-field='sales']").css('display', 'none');
				$("#tolnum_span_wish_stop").text("共"+count+"条");
				console.log(res);
            }
        });
    }


    var active = {
        reload: function () {
        	 var data = new Object();
        	 data.storeAcctIdList = [];
            var storeAcct = $("#wish_isEnablePProd_store_sel").val();
            if(storeAcct!=null && storeAcct!='') {
                data.storeAcctIdList.push(storeAcct);
            }else{
                $("#wish_isEnablePProd_store_sel").children().each(function () {
                    if ($(this).val() != "") {
                        data.storeAcctIdList.push($(this).val());
                    }
                });
            }
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
        	 var salepersonId = $.trim($("#adjustPriceSearchForm select[name='saleName']").val());
        	 data.salepersonId = salepersonId;
        	 var isSale = $.trim($("#adjustPriceSearchForm select[name='is_sale_s']").val());
        	 data.isSale = isSale;
            data.searchType = $("#wish_idEnable_sskuSearchType").val();//搜索类型
            //执行重载
          /*  var storeAcctId= [];
            $(".xm-select-dl").children().each(function () {
                  if($(this).attr("lay-value")!='undefined' && $(this).attr("lay-value")!=''){
                  	storeAcctId.push($(this).attr("lay-value"));
                  }
              })
            if(data.storeAcctIdList == null||data.storeAcctIdList=='' ||data.storeAcctIdList==[]){
          	  data.storeAcctIdList = $.trim(storeAcctId);
          	  
            }*/
            tableReload(data);

        }
    };
    $("#adjustPriceSearchBtn").click(function () {
    	var type = $(this).data('type');
        active[type] ? active[type].call(this) : '';
    });
    $("#adjustPriceResetBtn").click(function () {
        $("#adjustPriceSearchForm input[name='sSku']").val('');
        formSelects.value('selectAttr', [])
    });
    //批量下架商品消息
    $('#wish_batchDisEnableProd').click(function(){
    	var arrStat = [];
    	var arr = [];
    	//获取表格行对象
		var trObj =  $('#enableProdTable').next().find('.layui-table-body tbody').find('tr');
    	for(var i=0;i<trObj.length;i++){
    		 var checkStat = trObj.eq(i).find('td').eq(0).find('div').find('input').is(":checked");
    		 var obj = new Object();
    		 obj.id =  $.trim(trObj.eq(i).find('td').eq(1).find('div').text());//同步数据id
            var isSale =  $.trim(trObj.eq(i).find('td').eq(11).find('div').text());//商品状态
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
            obj.isPromotion =  $.trim(trObj.eq(i).find('td').eq(10).find('div').text());//是否黄钻
            var isSale =  $.trim(trObj.eq(i).find('td').eq(11).find('div').text());//商品状态
    		 obj.isSale =  isSale;
    		 var checkStat = trObj.eq(i).find('td').eq(0).find('div').find('input').is(":checked");
    		 //只下架上架中商品
    		 if(checkStat && isSale=='上架中'){
    			 if($("#is_modifystockzero").prop("checked")){
    				 obj.is_modify_stock_zero = '1';
    			 }else{
    				 obj.is_modify_stock_zero = '0'; 
    			 }
                 if($("#iepp_isYellow").prop("checked")){
                     //选中
                     obj.isEnableType = '0';//0代表下架
                     arr.push(obj)
                 }else{
                     if(obj.isPromotion == 0){//只修改非黄钻
                         obj.isEnableType = '0';//0代表下架
                         arr.push(obj)
                     }
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
			 url: ctx + "/wishIsEnableProduct/batchDisEnableProd.html",
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
		wishSskuIsEnaTimeUnit = setInterval(function () {
    		sel(batchNo)
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
			var isSale =  $.trim(trObj.eq(i).find('td').eq(11).find('div').text());//商品状态
			 //只修改被选中的商品信息
			 if(checkStat && isSale=='已下架'){
				 arrStat[i] = obj;
			 }

		}
		if(arrStat==null ||arrStat.length==0){
			layer.msg("没有可以上架的商品！");
			return;
		}
		if($("#is_modifystockzero").prop("checked")){
			layer.msg("上架商品不可以标零！");
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
			obj.isPromotion =  $.trim(trObj.eq(i).find('td').eq(10).find('div').text());//是否黄钻
			var isSale =  $.trim(trObj.eq(i).find('td').eq(11).find('div').text());//商品状态
			var listingTimes =  $.trim(trObj.eq(i).find('td').eq(13).find('div').text());//刊登天数
			var isSalesPromotion =  $.trim(trObj.eq(i).find('td').eq(14).find('div').text());//是否促销
			var sales =  $.trim(trObj.eq(i).find('td').eq(15).find('div').text());//销量

			 obj.isSale =  isSale;
			 var checkStat = trObj.eq(i).find('td').eq(0).find('div').find('input').is(":checked");
			 obj.is_modify_stock_zero = '0';
			//只下架上架中商品
			var isAddYellow = false;
			var isAddSales = false;
			var isAddSalesPromotion = false;
			var isAddStock = false;
			//&& $("#is_sellamount").prop("checked") && $("#is_onsell").prop("checked") && $("#is_zero").prop("checked")
			 if(checkStat && isSale=='已下架'){
				 if($("#iepp_isYellow").prop("checked") ) {
					 isAddYellow = true;//选中  是否是黄钻都可上架
				 }else{
					 if(obj.isPromotion == 0){//未选中  非黄钻都可上架
						 isAddYellow = true;
					 }
				 }
				 if($("#is_sellamount").prop("checked")){
					 isAddSales = true; //未选中 上架180销量且销量为0的不可上架
				 }else {
					 if(listingTimes >= 180 && sales > 0){//未选中 上架180销量且销量为0的不可上架
						 isAddSales = true;
					 }
					 if(listingTimes < 180){//上架时间小于180天不限制
						 isAddSales = true;
					 }
				 }
				 if($("#is_onsell").prop("checked")){
					 isAddSalesPromotion = true;//选中 是否促销都可上架
				 }else {
					if(isSalesPromotion == 'false'){//未选中 非促销才可上架
						isAddSalesPromotion = true;
					}
				 }
				 if($("#is_zero").prop("checked")){
					 isAddStock = true;//选中, 库存是否为0 都可上架
				 }else {
					if(obj.stock > 0){//未选中,库存大于0 才可上架
						isAddStock = true;
					}
				 }

				 if(isAddYellow && isAddSales && isAddSalesPromotion && isAddStock) {
					 obj.isEnableType = '1';//1代表上架
					 arr.push(obj)
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
			 url: ctx + "/wishIsEnableProduct/batchEnableProd.html",
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
		wishSskuIsEnaTimeUnit = setInterval(function () {
								sel(batchNo)
							}, 5000);
    });
    
    function sel(batchNo){
		var trObj =  $('#enableProdTable').next().find('.layui-table-body tbody').find('tr');
		var count = 0;
		for (var i = 0; i < trObj.length; i++) {
			var checkStat = trObj.eq(i).find('td').eq(0).find('div').find('input').is(":checked");
			var resultMsg = trObj.eq(i).find('td').eq(12).find('.layui-table-cell').find('div').text();
			if ((resultMsg == '' || resultMsg == null) && checkStat) {
				count++;
			}
		}
		if(count == 0){
			clearInterval(wishSskuIsEnaTimeUnit);
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

						var logMsg = data['TR_WISH_ISENABLE_LOG' + prodStoreSku + storeAcctId];
						if ((resultMsg == '' || resultMsg == null) && checkStat) {
							if (logMsg == '上架成功' || logMsg == '下架成功') {
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
				clearInterval(wishSskuIsEnaTimeUnit);
			}
		});


    }
	//数组去重
	function uniq(array){
		var temp = []; //一个新的临时数组
		for(var i = 0; i < array.length; i++){
			if(temp.indexOf(array[i]) == -1){
				temp.push(array[i]);
			}
		}
		return temp;
	}
    
});