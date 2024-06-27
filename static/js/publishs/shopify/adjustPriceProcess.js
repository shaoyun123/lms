var shopifytableIns={}
var shopifyAdjustpriceTimeUnit;
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
    if(shop_arr.length > 0){
        data.idList=[];
        data.storeAcctIdList = [];
   	 	data.storeAcctIdList = $.trim(data.storeAcctIdList);
        for (var i = 0; i < shop_arr.length; i++){
            // data.storeAcctId = shop_arr[i].storeAcctId;
            data.idList.push(shop_arr[i].id);
        }
        data.idList = data.idList.join(",");
		dataIdlist = data.idList;
    }
    if(shop_arr.length > 0){
        //执行重载
        tableReload(data);
    }
    
    function tableReload(data) {
        shopifytableIns = table.render({
            elem: "#adjustPriceTable",
            method:'post',
            url: ctx + "/shopifyBatchOperation/searchAdjustPriceProd.html",
            cols: [[
                {type: "checkbox"},
                { field: "id", title: "id" ,width: 100},
                { field: "storeAcctId", title: "店铺id" , width: 100},
                { field: "storeAcctName", title: "店铺" , width: 100},
                { field: "prodSSku", title: "商品SKU" , width: 100},
                { field: "storeSSku", title: "店铺SKU", width: 100},
                { field: "variantId", title: "平台商品子id", width: 100},
                { field: "currency", title: "币种" , width: 100},
                { field: "price", title: "当前刊登价", width: 80},
                { field: "newPrice", title: "新的刊登价",templet:'#newPriceTpl', width: 80 },
				{ field: "shipping", title: "运费", width: 60 },
//            { field: "newShipping",templet:'<div>1</div>', title: "新运费", width: 60 },
                { field: "diffPrice", title: "差价",templet:'#diffPriceTpl', width: 80 },
                { field: "storePSku", title: "店铺父SKU"},
                { field: "prodPSku", title: "商品父SKU"},
                { field: "productId", title: "平台商品id"},
                { field: "result",title: '操作结果', width: 100, align: 'center',}
            ]],
            where:data,
			page:false,
			height: 500,
            id:"adjustPriceTable",
            limits:[10,20,50],
            limit:10,
            done:function(res, curr, count){
                $("[data-field='id']").css('display', 'none');
                $("[data-field='storeAcctId']").css('display', 'none');
                $("[data-field='storePSku']").css('display', 'none');
                $("[data-field='prodPSku']").css('display', 'none');
                $("[data-field='productId']").css('display', 'none');
                $("#tolnum_span_shopify").text("共"+count+"条");
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
		if(checkStatus.data.length>0&&shopifytableIns){
		var layFilterIndex = 'LAY-table-'+shopifytableIns.config.index;
		var tableContainer = $('div[lay-filter="'+layFilterIndex+'"]');
		var newPrice = $("#adjustPriceSearchForm input[name='newPriceInput']").val();
		//获取表格行对象
		var calType = $("#adjustPriceSearchForm select[name='calculateType']").val()
		var trObj =  $('#adjustPriceTable').next().find('.layui-table-body tbody').find('tr');
		if(newPrice!==''){
			tableContainer.find('input[name="layTableCheckbox"]:checked').each(function(){
				 var tr= $(this).parents('tr');
				 var originprice = tr.find('td[data-field="price"] div').text();
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
            var storeAcct = $("#shopify_adjustPrice_store_sel").val();
            if(storeAcct!=null && storeAcct!='') {
                data.storeAcctIdList.push(storeAcct);
            }else{
                $("#shopify_adjustPrice_store_sel").children().each(function () {
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
             data.searchType = $("#shopify_adjustPric_sskuSearchType").val();//搜索类型
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
            obj.storeAcctName =  $.trim(trObj.eq(i).find('td').eq(3).find('div').text());//店铺名称
            obj.prodSSku =  $.trim(trObj.eq(i).find('td').eq(4).find('div').text());//商品sku
            obj.storeSSku =  $.trim(trObj.eq(i).find('td').eq(5).find('div').text());//店铺sku
            obj.variantId =  $.trim(trObj.eq(i).find('td').eq(6).find('div').text());//平台商品Id
            obj.currency =  $.trim(trObj.eq(i).find('td').eq(7).find('div').text());//本地价格币种
            obj.currPrice =  $.trim(trObj.eq(i).find('td').eq(8).find('div').text());//旧的刊登价
            obj.newPrice =  $.trim(trObj.eq(i).find('td').eq(9).find('input').val());//新的价格
			obj.shipping =  $.trim(trObj.eq(i).find('td').eq(10).find('div').text());//新的运费
			obj.storePSku =  $.trim(trObj.eq(i).find('td').eq(12).find('div').text());
			obj.prodPSku =  $.trim(trObj.eq(i).find('td').eq(13).find('div').text());
			obj.productId =  $.trim(trObj.eq(i).find('td').eq(14).find('div').text());
    		 var checkStat = trObj.eq(i).find('td').eq(0).find('div').find('input').is(":checked");
    		 if(checkStat){
				 if(obj.currPrice==obj.newPrice){
					 trObj.eq(i).find('td').eq(15).find('.layui-table-cell').html("<div style='color:green'>"+"与原值相同不修改"+"</div>");
					 continue;
				 }if(obj.newPrice==""||obj.newPrice=="0.00"||obj.newPrice=="0"){
					 layer.msg('新刊登价不能为空或者为零')
					 return false
				 }else{
					 arr.push(obj)
				 }
    		 }
    	}
    	if(arr.length==0){
			return
		}
		//以当前时间戳作为批次号
		var batchNo = new Date().getTime();
    	 $.ajax({
			 beforeSend: function(){
				 loading.show();
	          },
			 type: "POST",
			 url: ctx + "/shopifyBatchOperation/batchAdjustPrice.html",
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

		shopifyAdjustpriceTimeUnit = setInterval(function () {
    		sel(batchNo)
    	}, 5000);
    });
    
    function sel(batchNo){
		var trObj =  $('#adjustPriceTable').next().find('.layui-table-body tbody').find('tr');
		var count = 0;
		for (var i = 0; i < trObj.length; i++) {
			var checkStat = trObj.eq(i).find('td').eq(0).find('div').find('input').is(":checked");
			var resultMsg = trObj.eq(i).find('td').eq(15).find('.layui-table-cell').find('div').text();
			if ((resultMsg == '' || resultMsg == null) && checkStat) {
				count++;
			}
		}
		if(count == 0){
			clearInterval(shopifyAdjustpriceTimeUnit);
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
						var storeSSku  =  $.trim(trObj.eq(i).find('td').eq(5).find('div').text());//商品子sku
						var variantId =  $.trim(trObj.eq(i).find('td').eq(6).find('div').text());//平台商品Id
						var checkStat = trObj.eq(i).find('td').eq(0).find('div').find('input').is(":checked");
						var resultMsg = trObj.eq(i).find('td').eq(15).find('.layui-table-cell').find('div').text();

						var logMsg = data['TR_SHOPIFY_ADJUSTPRICE_LOG' + variantId + storeSSku];
						if ((resultMsg == '' || resultMsg == null) && checkStat) {
							if (logMsg == '调价成功') {
								trObj.eq(i).find('td').eq(15).find('.layui-table-cell').html("<div style='color:blue'>" + logMsg + "</div>");
							} else if (logMsg != '' && logMsg != null && logMsg != 'undefined') {
								trObj.eq(i).find('td').eq(15).find('.layui-table-cell').html("<div style='color:red'>" + logMsg + "</div>");
							}
						}
					}
				} else {
					layer.msg(returnData.msg);
				}
			},
			error: function () {
				layer.msg("服务器正忙");
				clearInterval(shopifyAdjustpriceTimeUnit);
			}
		});

    }
})