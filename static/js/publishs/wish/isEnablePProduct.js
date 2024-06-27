/**
 * 上下架
 */
var wishPskuIsenTimeUnit;
layui.use(['admin', 'form', 'layer','table', 'formSelects', 'element', 'laydate'], function() {
	 var admin = layui.admin,
     form = layui.form,
     layer = layui.layer,
     table = layui.table,
	 formSelects = layui.formSelects,
	 tableisPPEnable={},
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
   	 	data.storeAcctIdList = $.trim(data.storeAcctIdList);
        for (var i = 0; i < op_arr.length; i++){
            if($("#wish_online_online_num_span").parents("li").hasClass("layui-this")){
                data.isSale =1;
                $("#is_sale_p option[value='1']").attr("selected","selected");//根据值让option选中
			}
            if($("#wish_online_offline_num_span").parents("li").hasClass("layui-this")){
                data.isSale =0;
                $("#is_sale_p option[value='0']").attr("selected","selected");//根据值让option选中
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
        tableisPPEnable =table.render({
            elem: "#enableProdTable",
            method:'post',
            url: ctx + "/wishIsEnableProduct/prodIsEnableP.html",
            where:data,
            cols: [[
                {type: "checkbox"},
                { field: "id", title: "id" ,width: 90},
                { field: "storeAcctId", title: "店铺id" , width: 90},
                { field: "storeAcct", title: "店铺" , width: 80},
                { field: "pSku", title: "商品父SKU" , width: 120},
                { field: "pStoreSku", title: "店铺父SKU", width: 150},
                { field: "storeProdPId", title: "平台商品子id", width: 180},
                { field: "sales", title: "销量" , width: 60},
                { field: "wishes", title: "收藏数", width: 60},
                { field: "auditStatus", title: "审核状态", width: 60 },
                { field: "isPromotion", title: "是否黄钻", width: 60 },
                { field: "isSale", title: "当前状态",templet:'#saleStatsTpl', width: 90 },
                { field: "result",title: '操作结果', width: 180, align: 'center'},
                { field: "listingTimes",title: 'listingTimes', width: 160, align: 'center'}
			]],
            page:false,
			id:"enableProdTable",
			height: 500,
            limits:[10,20,50],
            limit:10,
            done:function(res, curr, count){
            	$("[data-field='id']").css('display', 'none');
                $("[data-field='storeAcctId']").css('display', 'none');
                $("[data-field='listingTimes']").css('display', 'none');
                $("#tolnum_span_wish_stop").text("共"+count+"条");
            }
        });
    }

    //渲染已选择数据
	function tableR() {
		if(op_arr.length > 0){
			var date = new Object();
			date.storeAcctIdList = '';
			date.sSkuList = [];
			//date.pSkuList=[];
			for (var i = 0; i < op_arr.length; i++){
				//date.pSkuList.push(op_arr[i].prodPSku)
				date.pSkuList = op_arr[i].prodPSku;
				if(op_arr[i].isSale){
					date.isSale =1;
				}else {
					date.isSale =2;
				}
			}
			//执行重载
			table.reload('enableProdTable', {
				where: date,
			});
		}
	}
    
    var currentStoreAccts=[];

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
        		 data.pSkuList = $.trim(skuStr.split(","));
        	 }
        	 data.searchType = $("#wish_idEnable_skuSearchType").val();//搜索类型
        	 data.storeAcctIdList = $.trim(data.storeAcctIdList);
        	 var salepersonId = $.trim($("#adjustPriceSearchForm select[name='saleName']").val());
        	 data.salepersonId = salepersonId;
        	 var isSale = $.trim($("#adjustPriceSearchForm select[name='is_sale_p']").val());
        	 data.isSale = isSale;
        	/* var storeAcctId= [];
             $(".xm-select-dl").children().each(function () {
                   if($(this).attr("lay-value")!='undefined' && $(this).attr("lay-value")!=''){
                   	storeAcctId.push($(this).attr("lay-value"));
                   }
               })
             if(data.storeAcctIdList == null||data.storeAcctIdList=='' ||data.storeAcctIdList==[]){
           	  data.storeAcctIdList = $.trim(storeAcctId);
           	  
             }*/
            //执行重载
           /* table.reload('enableProdTable', {
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
    //批量下架商品消息
    $('#wish_batchDisEnableParentProd').click(function(){
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
    		 obj.prodPSku =  $.trim(trObj.eq(i).find('td').eq(4).find('div').text());//店铺sku
    		 obj.prodPStoreSku =  $.trim(trObj.eq(i).find('td').eq(5).find('div').text());//店铺sku 
    		 obj.productId =  $.trim(trObj.eq(i).find('td').eq(6).find('div').text());//平台商品Id
    		 obj.sales =  $.trim(trObj.eq(i).find('td').eq(7).find('div').text());//销售数
    		 obj.wishes =  $.trim(trObj.eq(i).find('td').eq(8).find('div').text());//收藏数
    		 obj.auditStatus =  $.trim(trObj.eq(i).find('td').eq(9).find('div').text());//审核状态
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
				 if($("#epp_isYellow").prop("checked")){
					 //选中
					 obj.isEnableType = '0';//0代表下架
					 arr.push(obj)
				 }else{
					 //非选中
					 if(obj.isPromotion == 0){ //只修改非黄钻
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
			 url: ctx + "/wishIsEnableProduct/batchDisEnablePProd.html",
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

		wishPskuIsenTimeUnit = setInterval(function () {
    		sel(batchNo)
    	}, 5000);
    });
    
  //批量上架商品信息
    $('#batchEnableProd').click(function(){
		// var checkStatus = table.checkStatus('enableProdTable');
		// var is_sellamount =$('#pp_is_sellamount').siblings().hasClass('layui-form-checked');
		// var is_zero = $('#pp_is_zero').siblings().hasClass('layui-form-checked');
		// var tag1=1,tag2=1;
		// if(checkStatus.data.length>0&&tableisPPEnable){
		// 	var msgArr = []
		// 	for(var i =0;i<checkStatus.data.length;i++){
        //         if(!checkStatus.data[i].stock<=0&&!is_zero){
		// 			tag1 = 0;
		// 			msgArr.push('库存为0商品');
		// 		}else if(!(parseInt(checkStatus.data[i].listingTimes)>180&&checkStatus.data[i].sales<=0)&&!is_sellamount){
		// 			tag2 = 0;
		// 			msgArr.push('刊登180天0销量商品')
		// 		}
		// 	}
		// 	if(tag1&&tag2){
		// 		var arrStat = [];
		// 		var arr = [];
		// 		for(var i =0;i<checkStatus.data.length;i++){
		// 			if(!checkStatus.data.isSale){
		// 				checkStatus.data[i].prodSSku=checkStatus.data[i].storeSku;
		// 				arrStat.push(checkStatus.data[i]);
		// 			}
		// 		}
		// 		if(arrStat.length>0){
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
				 console.log(obj);
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
			 obj.prodPSku =  $.trim(trObj.eq(i).find('td').eq(4).find('div').text());//店铺sku
			 obj.prodPStoreSku =  $.trim(trObj.eq(i).find('td').eq(5).find('div').text());//店铺sku
			 obj.productId =  $.trim(trObj.eq(i).find('td').eq(6).find('div').text());//平台商品Id
			 obj.sales =  $.trim(trObj.eq(i).find('td').eq(7).find('div').text());//销售数
			 obj.wishes =  $.trim(trObj.eq(i).find('td').eq(8).find('div').text());//收藏数
			 obj.auditStatus =  $.trim(trObj.eq(i).find('td').eq(9).find('div').text());//审核状态
			 obj.isPromotion =  $.trim(trObj.eq(i).find('td').eq(10).find('div').text());//是否黄钻
			 var isSale =  $.trim(trObj.eq(i).find('td').eq(11).find('div').text());//商品状态
			 var listingTimes =  $.trim(trObj.eq(i).find('td').eq(13).find('div').text());//刊登天数
			 obj.isSale =  isSale;
			 var checkStat = trObj.eq(i).find('td').eq(0).find('div').find('input').is(":checked");
			 obj.is_modify_stock_zero = '0'

			var isAddYellow = false;
			var isAddSales = false;
			 //只下架上架中商品
			 if(checkStat && isSale=='已下架'){
				 if($("#epp_isYellow").prop("checked")){
					 isAddYellow = true; //选中 不限制是否黄钻都可上架
				}else{
					if(obj.isPromotion == 0){ //未选中 只上架非黄钻
						isAddYellow = true;
					}
				}
				 if($("#pp_is_sellamount").prop("checked")){
					 isAddSales = true; //未选中 上架180销量且销量为0的不可上架
				 }else {
					 if(listingTimes >= 180 && obj.sales > 0){//未选中 上架180销量且销量为0的不可上架
						 isAddSales = true;
					 }
					 if(listingTimes < 180){//上架时间小于180天不限制
						 isAddSales = true;
					 }
				 }
				if(isAddYellow && isAddSales){
					obj.isEnableType = '1';//1代表上架
					arr.push(obj)
				}
			 }
		}
		console.log(arr);
		//以当前时间戳作为批次号
		var batchNo = new Date().getTime();
		 $.ajax({
			 beforeSend: function(){
				 loading.show();
			  },
			 type: "POST",
			 url: ctx + "/wishIsEnableProduct/batchDisEnablePProd.html",
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
		wishPskuIsenTimeUnit = setInterval(function () {
			sel(batchNo)
		}, 5000);
					   
		// 		}else{
		// 			layer.msg("没有可以上架的商品")
		// 		}						
		// 	}else{
		// 		layer.msg('所选商品中包含'+uniq(msgArr).join(',')+',请勾选相应选项');
		// 	}

		// }else{
		// 	layer.msg("请选择需要上架的商品")
		// }

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
			clearInterval(wishPskuIsenTimeUnit);
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
						var prodPStoreSku =  $.trim(trObj.eq(i).find('td').eq(5).find('div').text());//店铺sku
						var productId =  $.trim(trObj.eq(i).find('td').eq(6).find('div').text());//平台商品Id

						var checkStat = trObj.eq(i).find('td').eq(0).find('div').find('input').is(":checked");
						var resultMsg = trObj.eq(i).find('td').eq(12).find('.layui-table-cell').find('div').text();

						var logMsg = data['TR_WISH_ISENABLE_LOG' + prodPStoreSku + storeAcctId + productId];
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
				clearInterval(wishPskuIsenTimeUnit);
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