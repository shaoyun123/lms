var mymalltableIns={}
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
    render_hp_orgs_users("#adjustPriceSearchForm");//渲染部门销售员店铺三级联动
    form.render('select');
    formSelects = layui.formSelects
    //表格渲染结果
    //展示已知数据
	var  dataIdlist = '';
    var data = new Object();
   if(mymall_op_arr.length > 0){
    data.idList=[];
    data.storeAcctIdList = [];
    data.storeAcctIdList = $.trim(data.storeAcctIdList);
        for (var i = 0; i < mymall_op_arr.length; i++){
            data.idList.push(mymall_op_arr[i].id);
        }
        data.idList = data.idList.join(",");
		dataIdlist = data.idList;
    }
    if(mymall_op_arr.length > 0){
        //执行重载
        tableReload(data);
    }
    
    function tableReload(data) {
        mymalltableIns = table.render({
            elem: "#adjustPriceTable",
            method:'post',
            url: ctx + "/mymallBatchOperation/prodAdjustPage.html",
            cols: [[
                {type: "checkbox"},
                { field: "id", title: "id" ,width: 100},
                { field: "storeAcctId", title: "店铺id" , width: 100},
                { field: "storeAcct", title: "店铺" , width: 100},
                { field: "sSku", title: "商品SKU" , width: 150},
                { field: "storeSku", title: "店铺SKU", width: 150},
                { field: "storeProdSId", title: "平台商品子id", width: 150},
                { field: "curr", title: "币种" , width: 80},
                { field: "currPrice", title: "当前刊登价", width: 130},
                { field: "newPrice", title: "新的刊登价",templet:'#newPriceTpl', width: 130 },
                { field: "currShipping", title: "当前运费", width: 130 },
                { field: "newShippingPrice", title: "新的运费", width: 130 },
                { field: "currWeight", title: "当前重量", width: 130 },
                { field: "newWeight", title: "新的重量", width: 130 },
				{ field: "diffPrice", title: "差价",templet:'#diffPriceTpl', width: 80 },
                { field: "result",title: '操作结果', width: 200, align: 'center',}
            ]],
            where:data,
            page:false,
            id:"adjustPriceTable",
			limits:[10,20,50],
			height: 500,
            limit:10,
            done:function(res, curr, count){
                $("[data-field='id']").css('display', 'none');
                $("[data-field='storeAcctId']").css('display', 'none');
                $("[data-field='storeProdSId']").css('display', 'none');
                $("[data-field='curr']").css('display', 'none');
                $("[data-field='diffPrice']").css('display', 'none');
                $("#tolnum_span_mymall").text("共"+count+"条");
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
		if(checkStatus.data.length>0&&mymalltableIns){
		var layFilterIndex = 'LAY-table-'+mymalltableIns.config.index;
		var tableContainer = $('div[lay-filter="'+layFilterIndex+'"]');
		var newPrice = $("#adjustPriceSearchForm input[name='newPriceInput']").val();
		//获取表格行对象
		var calType = $("#adjustPriceSearchForm select[name='calculateType']").val()
		var trObj =  $('#adjustPriceTable').next().find('.layui-table-body tbody').find('tr');
		if(newPrice!==''){
			tableContainer.find('input[name="layTableCheckbox"]:checked').each(function(){
				 var tr= $(this).parents('tr');
				 var originprice = tr.find('td[data-field="currPrice"] div').text();
                 var input = tr.find('td[data-field="newPrice"] div input');
		         calculatePrice(calType,originprice,newPrice,input);
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

    var currentStoreAccts=[];
   
    var active = {
        reload: function () {
            var data = new Object();
        	 data.storeAcctIdList = [];
            var storeAcct = $("#mymall_adjustPrice_store_sel").val();
            if(storeAcct!=null && storeAcct!='') {
                data.storeAcctIdList.push(storeAcct);
            }else{
                $("#mymall_adjustPrice_store_sel").children().each(function () {
                    if ($(this).val() != "") {
                        data.storeAcctIdList.push($(this).val());
                    }
                });
            }
             data.sSkuList = [];
        	 var skuStr = $.trim($("#adjustPriceSearchForm input[name='sSkuList']").val());
        	 if(skuStr !="" && skuStr!=null){
        		 data.sSkuList = $.trim(skuStr.split(","));
        	 }else{
        	 	if(dataIdlist){
					data.idList = dataIdlist;
				}
			 }
        	 data.storeAcctIdList = $.trim(data.storeAcctIdList);
        	 
        	 var salepersonId = $.trim($("#adjustPriceSearchForm select[name='saleName']").val());
        	 data.salepersonId = salepersonId;
             data.searchType = $("#mymall_adjustPric_sskuSearchType").val();//搜索类型
            var subPriceType = $("#adjustPriceSearchForm select[name='subPriceType']").val()//差价查询类型

            var subPrice = $.trim($("#adjustPriceSearchForm input[name='subPriceInput']").val());//差价搜索
            data.subPriceType = subPriceType;
            data.subPrice = subPrice;
            //没有选择店铺
            //执行重载
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
            obj.prodSSku =  $.trim(trObj.eq(i).find('td').eq(4).find('div').text());//商品sku
    		 obj.prodStoreSku =  $.trim(trObj.eq(i).find('td').eq(5).find('div').text());//店铺sku
            obj.productId =  $.trim(trObj.eq(i).find('td').eq(6).find('div').text());//平台商品Id
            obj.currPrice =  $.trim(trObj.eq(i).find('td').eq(8).find('div').text());//旧的刊登价
            obj.newPrice =  $.trim(trObj.eq(i).find('td').eq(9).find('input').val());//新的价格
            obj.shippingPrice =  $.trim(trObj.eq(i).find('td').eq(10).find('div').text());//旧的运费
            obj.newShippingPrice =  $.trim(trObj.eq(i).find('td').eq(11).find('div').text());//新的运费
    		 var checkStat = trObj.eq(i).find('td').eq(0).find('div').find('input').is(":checked");
    		 if(checkStat){
				 if(obj.currPrice==obj.newPrice){
					 trObj.eq(i).find('td').eq(15).find('.layui-table-cell').html("<div style='color:green'>"+"与原值相同不修改"+"</div>");
				 }else if(obj.newPrice==""||obj.newPrice=="0.00"||obj.newPrice=="0"){
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
			 url: ctx + "/mymallBatchOperation/batchAdjustPrice.html",
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
		var trObj =  $('#adjustPriceTable').next().find('.layui-table-body tbody').find('tr');
    	for(var i=0;i<trObj.length;i++){
      		 var obj = new Object();
      		 obj.storeAcctId =  $.trim(trObj.eq(i).find('td').eq(2).find('div').text());//店铺id
      		 obj.prodStoreSku =  $.trim(trObj.eq(i).find('td').eq(5).find('div').text());//店铺子sku
      		 var checkStat = trObj.eq(i).find('td').eq(0).find('div').find('input').is(":checked");
     		 var resultMsg = trObj.eq(i).find('td').eq(15).find('.layui-table-cell').find('div').text();
     		 if((resultMsg=='' || resultMsg==null) && checkStat){
     			 selectResult(obj,trObj,i);
     		 }
       	}
    }
    
    
    
    function selectResult(obj,trObj,i){
		 $.ajax({
			 type: "POST",
			 url: ctx + "/mymallBatchOperation/selectAdjustPriceResult.html",
			 data: {'prodObj':JSON.stringify(obj)},
			 dataType: "json",
			 success: function (returnData) {
				 if (returnData.code == "0000") {
					 if(returnData.msg =='调价成功'){
						 trObj.eq(i).find('td').eq(15).find('.layui-table-cell').html("<div style='color:blue'>"+returnData.msg+"</div>");
					 }else if(returnData.msg!=''&& returnData.msg!=null &&returnData.msg != 'undefined'){
						 trObj.eq(i).find('td').eq(15).find('.layui-table-cell').html("<div style='color:red'>"+returnData.msg+"</div>");
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
    
})