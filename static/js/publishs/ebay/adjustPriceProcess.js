var ebaytableIns = {}
var ebayAdjustPriceTimeUnit;
layui.use(['admin', 'form', 'layer','table', 'formSelects', 'element', 'laydate'], function() {
	 var admin = layui.admin,
     form = layui.form,
     layer = layui.layer,
     table = layui.table,
     formSelects = layui.formSelects,
     element = layui.element,
     laydate = layui.laydate,
     laypage = layui.laypage,
	 $ = layui.$;

    form.render(null, 'component-form-element');
    form.render(null, 'component-form-group');
    form.render('select');
    //表格渲染结果
    //展示已知数据
    var data = new Object();
	var  dataIdlist = '';
    if(modifyTitle_arr.length > 0){
        data.idList=[];
        data.storeAcctIdList = [];
   	 	data.storeAcctIdList = $.trim(data.storeAcctIdList);
        for (var i = 0; i < modifyTitle_arr.length; i++){
            data.idList.push(modifyTitle_arr[i].id);
        }
		data.pIdList = data.idList.join(",");
		dataIdlist = data.pIdList;
    delete data.idList;
    }
    if(modifyTitle_arr.length > 0){
        tableReload(data);
    }

    //定价按钮点击事件--ztt20240514
    $('#adjustPricePriceBtn').on('click', function(){
      let data = {};
      let value = $("#ebayAdjustPriceCustomsCard input[name='grossProfitRate']").val();
      if (!isFinite(value) || isNaN(value) || value < 0 || value > 1) {
        $("#ebayAdjustPriceCustomsCard input[name='grossProfitRate']").val('');
        return layer.msg('请输入0-1之间的数',{icon:7});
      }
      data.profit = value;
      let idSelectedArr = [];
      let trObj =  $('#adjustPriceTable').next().find('.layui-table-body tbody').find('tr');
    	for(let i=0;i<trObj.length;i++){
    		 let checkStat = trObj.eq(i).find('td').eq(0).find('div').find('input').is(":checked");
    		 //只修改被选中的商品信息
    		 if(checkStat){
           let trId =$.trim(trObj.eq(i).find('td').eq(1).find('div').text());//同步数据id
    			 idSelectedArr.push(trId);
    		 }
    	}
      if(idSelectedArr.length <=0){
        return layer.msg('请选中需要定价的数据', {icon:7});
      }
      data.idList = idSelectedArr.join(",");
      data.page=1;
      data.limit=1000;
      // data.pIdList = dataIdlist; //定价不需要传父id
      data.page =1;
      data.limit=1000;
      commonReturnPromise({
        url: ctx + "/ebayAdjustPrice/prodAdjustPage.html",
        type: 'post',
        params: data
      }).then(res=> {
        //获取到table表格
        let targetTable =$('[lay-filter="adjustPriceTable"]').next().find('.layui-table-main>table');
        //循环匹配表格,如果sku相同,就替换newPrice和diffPrice
        targetTable.find('input[name="layTableCheckbox"]:checked').each(function(){
          let tr= $(this).parents('tr');
          let id = tr.find('input[name=id]').val();
          //循环res
          for(let i=0;i<res.length;i++){
            if(res[i].id == id){
              let newPrice = res[i].newPrice;
              let diffPrice = res[i].diffPrice;
              tr.find('td[data-field="newPrice"] div input[name=newPrice]').val(newPrice);
              tr.find('td[data-field="diffPrice"] div').text(diffPrice);
              break;
            }
          }
       });
      });
    });
    //差价搜索功能-20240620ztt
    $('#ebaySubPriceInput').on('click', function(){
      // console.log('点击了差价查询');
      //获取到表格数据
      let cacheData = layui.table.cache.adjustPriceTableEbayId; //是一个数组
      let priceTable = $('#adjustPriceTable').next().find('.layui-table-body.layui-table-main');
      //获取到差价符号
      let priceSign = $('#ebayAdjustPriceCustomsCard [name=subPriceType]').val();
      //获取到差价值
      let priceVal = $('#ebayAdjustPriceCustomsCard [name=subPriceInput]').val().trim();
      if(priceVal === ''){
        return layer.msg('请输入查询差价',{icon:7});
      }
      for(let i=0; i<cacheData.length; i++){
        let $tr = priceTable.find(`tr[data-index=${i}]`);
        //获取到差价
        let diffPrice = $tr.find('[data-field=diffPrice]>div').text().trim();
        // console.log(diffPrice,diffPrice === '');
        if(diffPrice === ''){//不处理为空的数据
          $tr.css('display','none');
        }else{
          //1> 2< 3=
          if(priceSign ==1){//表示大于priceVal的不隐藏
            if(Number(diffPrice) > Number(priceVal)){
              $tr.css('display','table-row');
            }else{
              $tr.css('display','none');
            }
          }else if(priceSign ==2){ //表示小于priceVal的不隐藏
            if(Number(diffPrice) < Number(priceVal)){
              $tr.css('display','table-row');
            }else{
              $tr.css('display','none');
            }
          }else if(priceSign ==3) { //表示等于priceVal的不隐藏
            if(diffPrice == priceVal){
              $tr.css('display','table-row');
            }else{
              $tr.css('display','none');
            }
          }
        }
      }

    });

	function tableReload(data) {
        ebaytableIns = table.render({
            elem: "#adjustPriceTable",
            method:'post',
            url: ctx + "/ebayAdjustPrice/prodAdjustPage.html",
            cols: [[
                {type: "checkbox"},
                { field: "id", title: "id" ,width: 50},
				        { field: "storeAcctId", title: "店铺id" , width: 100},
                { field: "storeSku", title: "店铺SKU", width: 150},
                { field: "itemId", title: "item_id", width: 100},
                { field: "storeAcct", title: "店铺" , width: 120},
                { field: "sSku", title: "商品SKU" , width: 100},
                { field: "siteName", title: "站点", width: 80},
                { field: "location", title: "location",templet:'#locationCountryTpl', width: 130},
                { field: "stock", title: "库存", width: 50},
                { field: "soldNums", title: "销售数量", width: 40},
                { field: "currency", title: "币种" , width: 50},
                { field: "currPrice", title: "当前刊登价", width: 80},
                { field: "newPrice", title: "新的刊登价",templet:'#newPriceTpl', width: 80 },
                { field: "isLockPrice", title: "固定价格" ,templet:'#isLockPriceTpl', width: 90},
                { field: "isAttractSku", title: "引流SKU" ,templet:'#isAttractSkuTpl', width: 100},
                { field: "priceOffset", title: "浮动比例" , width: 60},
                { field: "diffPrice", title: "差价",templet:'#diffPriceTpl', width: 60 },
                { field: "result",title: '操作结果', width: 100, align: 'center',},
				        { field: "pId", title: "pId" ,width: 50}
			]],
			where:data,
            page:true,
            id:"adjustPriceTableEbayId",
			limits:[1000,2000,5000],
      unFixedTableHead: true,
			height: 500,
            limit:1000,
            done:function(res, curr, count){
            	$("[data-field='id']").css('display', 'none');
				$("[data-field='pId']").css('display', 'none');
				$("[data-field='storeAcctId']").css('display', 'none');
                $("[data-field='noticeId']").css('display', 'none');
				$("[data-field='priceOffset']").css('display', 'none');

				$("#tolnum_span_ebay").text("共"+res.extra+"条");

                // chenke:修改新的刊登价价格收，光标移开，及时计算差价
				$('input[id="newPrice"]').blur(function() {
					var newPrice = parseFloat($(this).val());
					if (newPrice < 0) {
						layer.msg('新的刊登价不可调整为小于0');
						$(this).val(0);
						return false;
					}
					var originPrice = $(this).parents('td').siblings('td[data-field="currPrice"]').find('div').text();
					var diffPriceVal = (parseFloat(newPrice)-parseFloat(originPrice)).toFixed(2);
					$(this).parents('td').siblings('td[data-field="diffPrice"]').find('div').text(diffPriceVal);
				});
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
					 data.pIdList = dataIdlist;
				 }
			 }
        	 data.storeAcctIdList = $.trim(data.storeAcctIdList);
             data.searchType = 1;//搜索类型-精确
			var subPriceType = $("#adjustPriceSearchForm select[name='subPriceType']").val()//差价查询类型

			var subPrice = $.trim($("#adjustPriceSearchForm input[name='subPriceInput']").val());//差价搜索
			data.subPriceType = subPriceType;
			data.subPrice = subPrice;
			data.profit = $("#adjustPriceSearchForm input[name='grossProfitRate']").val()
			console.log(subPrice)
            //执行重载
           /* table.reload('adjustPriceTable', {
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
    		 obj.currPrice =  $.trim(trObj.eq(i).find('td').eq(12).find('div').text());//旧的刊登价
    		 obj.storeAcctId =  $.trim(trObj.eq(i).find('td').eq(2).find('div').text());//店铺id
    		 obj.prodSSku =  $.trim(trObj.eq(i).find('td').eq(6).find('div').text());//商品sku
    		 obj.prodStoreSku =  $.trim(trObj.eq(i).find('td').eq(3).find('div').text());//店铺sku
    		 obj.newPrice =  $.trim(trObj.eq(i).find('td').eq(13).find('input').val());//新的价格
    		 obj.itemId =  $.trim(trObj.eq(i).find('td').eq(4).find('div').text());//平台商品Id
    		 obj.storeAcct =  $.trim(trObj.eq(i).find('td').eq(5).find('div').text());//店铺名称
    		 obj.stock =  $.trim(trObj.eq(i).find('td').eq(9).find('div').text());//库存
				obj.isAttractSku = trObj.eq(i).find('td').eq(15).find(".layui-form-item").data('isattractsku');
				obj.isLockPrice = trObj.eq(i).find('td').eq(14).find("input[name=isLockPrice]").prop("checked");

				obj.pId = $.trim(trObj.eq(i).find('td').eq(19).find('div').text());
    		 var checkStat = trObj.eq(i).find('td').eq(0).find('div').find('input').is(":checked");
    		 //    		 arrStat[i] = obj;
    		 if(checkStat){
    		 	if(obj.newPrice == obj.currPrice){
					trObj.eq(i).find('td').eq(18).find('.layui-table-cell').html("<div style='color:blue'>"+"与原价格相同"+"</div>");
					arr.push(obj)
    		 	}else if(obj.newPrice==""||obj.newPrice=="0.00"||obj.newPrice=="0"){
					layer.msg('新刊登价不能为空或者为0')
					return false
				 }else if(obj.isLockPrice){
					trObj.eq(i).find('td').eq(18).find('.layui-table-cell').html("<div style='color:blue'>"+"锁定价格不可改价"+"</div>");
					arr.push(obj)
    		 	}else{
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
			 url: ctx + "/ebayAdjustPrice/batchAdjustPrice.html",
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
		ebayAdjustPriceTimeUnit = setInterval(function () {
    		sel(batchNo)
    	}, 20000);
    });
	/**
	 * 开启关闭引流sku的功能
	 */
	form.on('switch(isAttractSku)', function(data){
		//手动输入毛利率
		var grossProfitRate = $("#adjustPriceSearchForm input[name='grossProfitRate']").val();
		//取到当前的开启状态和店铺id
			var obj = {
				itemId: data.othis.next().text(),
				storeSku: data.othis.next().next().text(),
				storeAcctId: data.othis.next().next().next().text(),
				isAttractSku: data.elem.checked,
				 pId:data.othis.next().next().next().next().text()
			}
		var list;
		$.ajax({
			beforeSend: function(){
				loading.show();
			},
			type: "POST",
			url: ctx + "/ebayAdjustPrice/getNewPrice.html",
			data: {itemId:obj.itemId,storeSku:obj.storeSku,isAttractSku:obj.isAttractSku,storeAcctId:obj.storeAcctId,pId:obj.pId,grossProfitRate:grossProfitRate},
			async: true,
			dataType: "json",
			success: function (returnData) {
				loading.hide();
				var trObj =  $('#adjustPriceTable').next().find('.layui-table-body tbody').find('tr')
				list = returnData.data;
				if(data.elem.checked){
					trObj.each(function(){
						var check = $(this);
						var itemId = $(this).find('td').eq(4).find('div').text();
						var storeSku = $(this).find('td').eq(3).find('div').text();
						for(var i=0;i<list.length;i++){
							if(list[i].itemId ==itemId && list[i].storeSku == storeSku){
								//需要重新按照费引流sku计算价格
								check.find("input[name=newPrice]").val(list[i].newPrice.toFixed(2));
							}else if(list[i].itemId ==itemId ){
								$(this).find("input[name=isAttractSku]").prop("checked", false);
							}
							// getNewPrice(storeSku);
						}
						data.elem.checked = true;
					});
				}else{
					trObj.each(function(){
						var check = $(this);
						var itemId = $(this).find('td').eq(4).find('div').text();
						var storeSku = $(this).find('td').eq(3).find('div').text();
						for(var i=0;i<list.length;i++){
							if(list[i].itemId ==itemId && list[i].storeSku == storeSku){
								//需要重新按照费引流sku计算价格
								check.find("input[name=newPrice]").val(list[i].newPrice.toFixed(2));
							}else if(list[i].itemId ==itemId ){
								$(this).find("input[name=isAttractSku]").prop("checked", false);
							}
							// getNewPrice(storeSku);
						}
						data.elem.checked = false;
					});
				}
				form.render("checkbox");
			},
			error: function () {
				loading.hide();
				layer.msg("服务器正忙");
			}
		})

	});


    function sel(batchNo){
		var trObj =  $('#adjustPriceTable').next().find('.layui-table-body tbody').find('tr');
		var count = 0;
		for (var i = 0; i < trObj.length; i++) {
			var checkStat = trObj.eq(i).find('td').eq(0).find('div').find('input').is(":checked");
			var resultMsg = trObj.eq(i).find('td').eq(18).find('.layui-table-cell').find('div').text();
			if ((resultMsg == '' || resultMsg == null) && checkStat) {
				count++;
			}
		}
		if(count == 0){
			clearInterval(ebayAdjustPriceTimeUnit);
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
						var resultMsg = trObj.eq(i).find('td').eq(18).find('.layui-table-cell').find('div').text();

						var logMsg = data['TR_EBAY_ADJUSTPRICE_LOG' + itemId + prodStoreSku];
						if ((resultMsg == '' || resultMsg == null) && checkStat) {
							if (logMsg == '调价成功') {
								trObj.eq(i).find('td').eq(18).find('.layui-table-cell').html("<div style='color:blue'>" + logMsg + "</div>");
							} else if (logMsg != '' && logMsg != null && logMsg != 'undefined') {
								trObj.eq(i).find('td').eq(18).find('.layui-table-cell').html("<div style='color:red'>" + logMsg + "</div>");
							}
						}
					}
				}
			},
			error: function () {
				layer.msg("服务器正忙");
				clearInterval(ebayAdjustPriceTimeUnit);
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
			var checkStatus = table.checkStatus('adjustPriceTableEbayId');
			if(checkStatus.data.length>0&&ebaytableIns){
			var layFilterIndex = 'LAY-table-'+ebaytableIns.config.index;
			var tableContainer = $('div[lay-filter="'+layFilterIndex+'"]');
			var newPrice = $("#ebayAdjustPriceCustomsCard input[name='newPriceInput']").val();
			//获取表格行对象
			var calType = $("#ebayAdjustPriceCustomsCard select[name='calculateType']").val()
			if(newPrice!==''){
				tableContainer.find('input[name="layTableCheckbox"]:checked').each(function(){
					 var tr= $(this).parents('tr');
					 var originprice = tr.find('td[data-field="currPrice"] div').text();
					 var input = tr.find('td[data-field="newPrice"] div input');
					 var diffPrice = tr.find('td[data-field="diffPrice"] div');
					 calculatePrice(calType,originprice,newPrice,input,diffPrice);
				});
			}else{
				layer.msg('请输入调整的价格');
			}
			}else{
				layer.msg('请选择需要调价的商品')
			}
		});
		//选自对应计算类型计算修改后的价格
		function calculatePrice(calType,originprice,newprice,input,diffPrice){
			var diffPriceVal;
			switch (calType){
				case "1":
					var finalprice = (parseFloat(originprice)+parseFloat(newprice)).toFixed(2);
					input.val(finalprice);//新的价格
					// chenke: 价格变更后，立即变更差价
					diffPriceVal = (parseFloat(finalprice)-parseFloat(originprice)).toFixed(2);
					diffPrice.text(diffPriceVal);
			   break;
			   case "2":
				var finalprice = (parseFloat(originprice)-parseFloat(newprice)).toFixed(2);
				if(finalprice>0){
					input.val(finalprice);//新的价格
					// chenke: 价格变更后，立即变更差价
					diffPriceVal = (parseFloat(finalprice)-parseFloat(originprice)).toFixed(2);
					diffPrice.text(diffPriceVal);
				}else{
					input.val("");
					layer.msg('价格调整不得低于0');
				}
			   break;
			   case "3":
				var finalprice = (parseFloat(originprice)*parseFloat(newprice)).toFixed(2);
				// console.log('finalprice',finalprice);
				input.val(finalprice);//新的价格
				// chenke: 价格变更后，立即变更差价
				diffPriceVal = (parseFloat(finalprice)-parseFloat(originprice)).toFixed(2);
				diffPrice.text(diffPriceVal);
			   break;
			   default:
         var finalprice = (parseFloat(originprice)/parseFloat(newprice)).toFixed(2);
			   input.val(finalprice);
			   // chenke: 价格变更后，立即变更差价
			   diffPriceVal = (parseFloat(finalprice)-parseFloat(originprice)).toFixed(2);
			   diffPrice.text(diffPriceVal);
			}
		}



	//批量修改调价消息
	$('#grossProfitRateBtn').click(function(){
		var grossProfitRate = $("#adjustPriceSearchForm input[name='grossProfitRate']").val();

		//获取表格行对象
		var trObj =  $('#adjustPriceTable').next().find('.layui-table-body tbody').find('tr');
		var  arr = new Array();
		for(var i=0;i<trObj.length;i++){
			var pId = $.trim(trObj.eq(i).find('td').eq(19).find('div').text());
			arr.push(pId)
		}
		$.ajax({
			beforeSend: function(){
				loading.show();
			},
			type: "POST",
			url: ctx + "/ebayAdjustPrice/batchModifyPriceBygrossProfit.html",
			data: {'prodObj':arr.join(','),'grossProfitRate':grossProfitRate},
			async: true,
			dataType: "json",
			success: function (returnData) {
				if (returnData.code == "0000") {
					loading.hide()
					var list = returnData.data;
					trObj.each(function(){
						var check = $(this);
						var itemId = $(this).find('td').eq(4).find('div').text();
						var storeSku = $(this).find('td').eq(3).find('div').text();
						for(var i=0;i<list.length;i++){
							if(list[i].itemId ==itemId && list[i].storeSku == storeSku){
								check.find("input[name=newPrice]").val(list[i].newPrice.toFixed(2));
								check.find('td').eq(17).find('div').text(list[i].diffPrice.toFixed(2));
							}
						}
					});
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

	});

});