var joomtableIns = {}
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
	var  dataIdlist = '';
    if(joom_arr.length > 0){
        data.idList=[];
        for (var i = 0; i < joom_arr.length; i++){
            data.idList.push(joom_arr[i].id);
        }
        data.idList = data.idList.join(",");
		dataIdlist = data.idList;
    }
    if(joom_arr.length > 0){
        tanleReload(data);
    }
	function tanleReload(data) {
        joomtableIns = table.render({
            elem: "#adjustPriceTable",
            method:'post',
            url: ctx + "/joomAdjustPrice/prodAdjustPage.html",
            cols: [[
                {type: "checkbox"},
                { field: "id", title: "id" ,width: 100},
                { field: "storeAcctId", title: "店铺id" , width: 100},
                { field: "storeAcct", title: "店铺" , width: 100},
                { field: "sSku", title: "商品SKU" , width: 160},
                { field: "storeSku", title: "店铺SKU", width: 130},
                { field: "storeProdSId", title: "平台商品子id", width: 180},
                { field: "curr", title: "币种" , width: 90},
                { field: "msrp", title: "MSRP" , width: 90, templet: '#adjustPriceProcess_Msrp'},
                { field: "oldMsrp", title: "oldMsrp" , width: 90, templet: '#adjustPriceProcess_oldMsrp'},
                { field: "currPrice", title: "当前刊登价", width: 90},
                { field: "shipping", title: "原运费", width: 80},
                { field: "newPrice", title: "新的刊登价",templet:'#newPriceTpl', width: 90 },
                { field: "newShipping", title: "新运费",templet:'#newShippingTpl', width: 90},
                { field: "shippingWeight", title: "原sku重量(kg)", width: 80 },
                { field: "newShippingWeight", title: "新sku重量(kg)",templet:'#newShippingWeightTpl', width: 90},
                { field: "diffPrice", title: "差价", width: 100 },
                { field: "result",title: '操作结果', width: 180, align: 'center',}
            ]],
            where:data,
            page:false,
            id:"adjustPriceTable",
            limits:[10,20,50],
            limit:10,
            done:function(res, curr, count){
            	$("[data-field='id']").css('display', 'none');
                $("[data-field='storeAcctId']").css('display', 'none');
                $("[data-field='noticeId']").css('display', 'none');
                $("[data-field='oldMsrp']").hide();
                $("#tolnum_span_joom").text("共"+count+"条");
								$('#adjustPriceTable').next().find('tr').each(function () {
									let newPrice = $(this).find('td[data-field="newPrice"] input').val() || 0
									let msrp = $(this).find('td[data-field="msrp"] input').val() || 0
									if (Number(newPrice) >= Number(msrp)) {
										$(this).css('background', 'yellow')
									}
								})
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
        	 }else{
				 if(dataIdlist){
					 data.idList = dataIdlist;
				 }
			 }
        	 data.storeAcctIdList = $.trim(data.storeAcctIdList);
            data.searchType = $("#joom_adjustPrice_skuSearchType").val();//搜索类型
			var subPriceType = $("#adjustPriceSearchForm select[name='subPriceType']").val()//差价查询类型

			var subPrice = $.trim($("#adjustPriceSearchForm input[name='subPriceInput']").val());//差价搜索
			data.subPriceType = subPriceType;
			data.subPrice = subPrice;
          /*  //执行重载
            table.reload('adjustPriceTable', {
                where: data,
            });*/
            tanleReload(data);
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
    $('#batchUpadatePrice').click(function(){
    	var arrStat = [];
    	var arr = [];
    	//获取表格行对象
		 var trObj =  $('#adjustPriceTable').next().find('.layui-table-body tbody').find('tr');

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
    		layer.msg("请选择需要调价的数据！");
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
    		 obj.productId =  $.trim(trObj.eq(i).find('td[data-field="storeProdSId"]').text());//平台商品Id
    		 obj.msrp =  $.trim(trObj.eq(i).find('td[data-field="msrp"] input').val());//新msrp
    		 obj.oldMsrp =  $.trim(trObj.eq(i).find('td[data-field="oldMsrp"]').text());//旧msrp
    		 obj.currPrice =  $.trim(trObj.eq(i).find('td[data-field="currPrice"]').text());//旧的刊登价
			 // $.trim(trObj.eq(i).find('td').eq(9).find('div').text());//运费
    		 obj.shipping = ''
    		 obj.newPrice =  $.trim(trObj.eq(i).find('td[data-field="newPrice"] input').val());//新的价格
    		 obj.newShipping =  $.trim(trObj.eq(i).find('td[data-field="newShipping"] input').val());//新的运费
    		 obj.newShippingWeight =  $.trim(trObj.eq(i).find('td[data-field="newShippingWeight"] input').val());//新的sku重量

    		 var checkStat = trObj.eq(i).find('td').eq(0).find('div').find('input').is(":checked");
    		 if(checkStat){
				if(obj.newPrice==""||obj.newPrice=="0.00"||obj.newPrice=="0"){
					layer.msg('新刊登价不能为空或者为零')
					return false
				 }else{
					arr.push(obj)					 
				 }
    		 }
    	}
    	 $.ajax({
    		 beforeSend: function(){
				 loading.show();
	          },
			 type: "POST",
			 url: ctx + "/joomAdjustPrice/batchAdjustPrice.html",
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
    
    function sel(){
		var trObj =  $('#adjustPriceTable').next().find('.layui-table-body tbody').find('tr');
    	for(var i=0;i<trObj.length;i++){
      		 var obj = new Object();
      		 obj.storeAcctId =  $.trim(trObj.eq(i).find('td').eq(2).find('div').text());//店铺id
      		 obj.prodStoreSku =  $.trim(trObj.eq(i).find('td').eq(5).find('div').text());//商品子sku
      		 var checkStat = trObj.eq(i).find('td').eq(0).find('div').find('input').is(":checked");
     		 var resultMsg = trObj.eq(i).find('td').eq(17).find('.layui-table-cell').find('div').text();
     		 if((resultMsg=='' || resultMsg==null) && checkStat){
     			 selectResult(obj,trObj,i);
     		 }
       	}
    }
    
    
    
    function selectResult(obj,trObj,i){
		 $.ajax({
			 type: "POST",
			 url: ctx + "/joomAdjustPrice/selectResult.html",
			 data: {'prodObj':JSON.stringify(obj)},
			 async: true,
			 dataType: "json",
			 success: function (returnData) {
				 if (returnData.code == "0000") {
					 if(returnData.msg =='调价成功'){
						 trObj.eq(i).find('td').eq(17).find('.layui-table-cell').html("<div style='color:blue'>"+returnData.msg+"</div>");
					 }else if(returnData.msg!=''&& returnData.msg!=null &&returnData.msg != 'undefined'){
						 trObj.eq(i).find('td').eq(17).find('.layui-table-cell').html("<div style='color:red'>"+returnData.msg+"</div>");
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
	
	//校验价格输入不能低于0

	$('input[name="newPriceInput"]').change(function(){
		if(parseFloat($(this).val())<0){
			$(this).val("");
		}
	});
    /**
     * 一键写入价格值
     */
    $("#newPriceBtn").click(function () {
		var checkStatus = table.checkStatus('adjustPriceTable');
		if(checkStatus.data.length>0&&joomtableIns){
		var layFilterIndex = 'LAY-table-'+joomtableIns.config.index;
		var tableContainer = $('div[lay-filter="'+layFilterIndex+'"]');
		var newPrice = $("#adjustPriceSearchForm input[name='newPriceInput']").val();
		//获取表格行对象
		var calType = $("#adjustPriceSearchForm select[name='calculateType']").val();
		if(newPrice!==''){
			tableContainer.find('input[name="layTableCheckbox"]:checked').each(function(){
				 var tr= $(this).parents('tr');
				 var originprice = tr.find('td[data-field="currPrice"] div').text();
                 var input = tr.find('td[data-field="newPrice"] div input');
				 let msrp = tr.find('td[data-field="msrp"] input').val()
		         calculatePrice(calType,originprice,newPrice,input);
				 if (Number(input.val()) >= Number(msrp)) {
					tr.css('background', 'yellow')
				 }else {
					tr.css('background', 'none')
				 }
			});
		}else{
			layer.msg('请输入调整的价格');
		}
		}else{
			layer.msg('请选择需要调价的商品')
		}
	});
	//选自对应计算类型计算修改后的价格
	function calculatePrice(calType,originprice,newprice,input){
		switch (calType){
			case "1":
				var finalprice = (parseFloat(originprice)+parseFloat(newprice)).toFixed(2);
				input.val(finalprice);//新的价格
		   break;
		   case "2":
			var finalprice = (parseFloat(originprice)-parseFloat(newprice)).toFixed(2);
			if(finalprice>0){
				input.val(finalprice);//新的价格
			}else{
				input.val("");
				layer.msg('价格调整不得低于0');
			}
		   break;
		   case "3":
			var finalprice = (parseFloat(originprice)*parseFloat(newprice)).toFixed(2);
			input.val(finalprice);//新的价格
		   break;
		   default:
		   input.val(newprice);
		}
	}
    
    
    
    
});
function adjustPriceProcess_Msrp_KeyUp(_this) {
	let newPrice = Number($(_this).parents('tr').find('td[data-field="newPrice"] input').val()),
		newMsrp = Number($(_this).val()),
		parentsTr = $(_this).parents('tr')
		if (newPrice >= newMsrp) {
		parentsTr.css('background', 'yellow')
	}else {
		parentsTr.css('background', 'white')
	}
}
function adjustPriceProcess_newPriceTpl_KeyUp(_this) {
	let newPrice = Number($(_this).val()),
		newMsrp = Number($(_this).parents('tr').find('td[data-field="msrp"] input').val()),
		parentsTr = $(_this).parents('tr')
		if (newPrice >= newMsrp) {
		parentsTr.css('background', 'yellow')
	}else {
		parentsTr.css('background', 'white')
	}
}