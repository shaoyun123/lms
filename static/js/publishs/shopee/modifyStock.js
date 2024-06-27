var modifyStockTimeUnit;
layui.use(['admin', 'form', 'layer','table', 'formSelects', 'element', 'laydate','laytpl'], function() {
	 var admin = layui.admin,
     form = layui.form,
     layer = layui.layer,
     table = layui.table,
     formSelects = layui.formSelects,
     element = layui.element,
     laydate = layui.laydate,
     laypage = layui.laypage,
	 laytpl = layui.laytpl,
	 $ = layui.$,
	 tableIns = {}

    form.render(null, 'component-form-element');
    form.render(null, 'component-form-group');
    form.render('select');
    //表格渲染结果
    //展示已知数据
    var data = new Object();
    if(shop_arr.length > 0){
        data.idList=[];
        for (var i = 0; i < shop_arr.length; i++){
            data.idList.push(shop_arr[i].id);
        }
        data.idList = data.idList.join(",");
    }
    if(shop_arr.length > 0){
        tableRoload(data);
    }
	function tableRoload(data) {
        tableIns = table.render({
            elem: "#modifyStockTable",
            method:'post',
            url: ctx + "/shopee/shopeeIsEnableProduct/prodModifyStock.html",
            cols: [[
                {type: "checkbox"},
                { field: "id", title: "id" ,width: '9%'},
                { field: "storeAcctId", title: "店铺id" , width: '9%'},
                { field: "storeSku", title: "店铺SKU", width: '10%'},
                { field: "itemId", title: "item_id", width: '10%'},
                { field: "variId", title: "vari_id", width: '10%'},
                { field: "storeAcct", title: "店铺" , width: '10%'},
                { field: "sSku", title: "商品SKU" , width: '10%'},
                { field: "siteId", title: "站点id", width: '10%'},
				{ field: "salesSite", title: "站点", width: '10%'},
                { field: "stock", title: "卖家可用库存", width: '10%'},
                { field: "newStock", title: "调整库存",templet:'#newStockTpl', width: '10%' },
                { field: "result",title: '操作结果', width: '15%', align: 'center',},
				{ field: "isMultiSku", title: "是否多属性" }

			]],
            where:data,
            page:false,
			id:"modifyStockTable",
			height: 500,
            limits:[10,20,50],
            limit:10,
            done:function(res, curr, count){
            	$("[data-field='id']").css('display', 'none');
                $("[data-field='storeAcctId']").css('display', 'none');
				$("[data-field='siteId']").css('display', 'none');
                $("#tolnum_span_shopee_stock").text("共"+count+"条");
				$("[data-field='isMultiSku']").css('display', 'none');

            }
        });
    }



    var active = {
        reload: function () {
        	 var data = new Object();
        	 data.storeAcctIdList = [];
        	 data.sSkuList = [];
        	 var logisAttrContents = formSelects.value("shopee_selectAttr_store");
        	 for (var i = 0; i < logisAttrContents.length; i++) {
        	        var logisAttr = logisAttrContents[i].value;
        	        data.storeAcctIdList.push($.trim(logisAttr));
        	    }
        	 var skuStr = $.trim($("#adjustPriceSearchForm input[name='sSkuList']").val());
        	 if(skuStr !="" && skuStr!=null){
        		 data.sSkuList = $.trim(skuStr.split(","));
        	 }
        	 data.storeAcctIdList = $.trim(data.storeAcctIdList);
            data.searchType = $("#shopee_modifyStock_skuSearchType").val();//搜索类型

            //执行重载
         /*   table.reload('modifyStockTable', {
                where: data,
            });*/
            tableRoload(data);
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
        //获取表格行对象
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
    		 obj.variId =  $.trim(trObj.eq(i).find('td').eq(5).find('div').text());//variId
    		 obj.storeAcct =  $.trim(trObj.eq(i).find('td').eq(6).find('div').text());//店铺名称
    		 obj.prodSSku =  $.trim(trObj.eq(i).find('td').eq(7).find('div').text());//商品sku
    		 obj.siteId =  $.trim(trObj.eq(i).find('td').eq(8).find('div').text());//站点
    		 obj.stock =  $.trim(trObj.eq(i).find('td').eq(10).find('div').text());//当前库存
    		 obj.newStock =  $.trim(trObj.eq(i).find('td').eq(11).find('input').val());//新的库存
			 obj.isMultiSku =  $.trim(trObj.eq(i).find('td').eq(13).find('div').text());

			var checkStat = trObj.eq(i).find('td').eq(0).find('div').find('input').is(":checked");
    		 if(checkStat){
    		 	if(obj.stock ==obj.newStock){
					trObj.eq(i).find('td').eq(12).find('.layui-table-cell').html("<div style='color:blue'>"+"与原值相同不修改"+"</div>");
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
			 url: ctx + "/shopee/shopeeIsEnableProduct/batchModifyStock.html",
			 data: {'prodObj':JSON.stringify(arr), 'batchNo': batchNo},
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
		modifyStockTimeUnit = setInterval(function () {
    		sel(batchNo)
    	}, 5000);

    });
    
    function sel(batchNo){
		var trObj =  $('#modifyStockTable').next().find('.layui-table-body tbody').find('tr');
		var count = 0;
		for (var i = 0; i < trObj.length; i++) {
			var checkStat = trObj.eq(i).find('td').eq(0).find('div').find('input').is(":checked");
			var resultMsg = trObj.eq(i).find('td').eq(12).find('.layui-table-cell').find('div').text();
			if ((resultMsg == '' || resultMsg == null) && checkStat) {
				count++;
			}
		}
		if(count == 0){
			clearInterval(modifyStockTimeUnit);
			return;
		}
		$.ajax({
			type: "POST",
			url: ctx + "/shopee/shopeeIsEnableProduct/selectResult.html",
			data: {'batchNo':batchNo},
			async: true,
			dataType: "json",
			success: function (returnData) {
				if (returnData.code == "0000") {
					var data = returnData.data;
					for (var i = 0; i < trObj.length; i++) {
						var itemId = $.trim(trObj.eq(i).find('td').eq(4).find('div').text());//平台商品Id
						var variId = $.trim(trObj.eq(i).find('td').eq(5).find('div').text());//variId
						var checkStat = trObj.eq(i).find('td').eq(0).find('div').find('input').is(":checked");
						var resultMsg = trObj.eq(i).find('td').eq(12).find('.layui-table-cell').find('div').text();

						var logMsg = data['TR_SHOPEE_MODIFY_STOCK' + itemId + variId];
						if ((resultMsg == '' || resultMsg == null) && checkStat) {
							if (logMsg == '调整库存成功') {
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
				clearInterval(modifyStockTimeUnit);
			}
		});

    }

	// 通过sku调整库存
	$('#shopeeAdjustStock_newStockBySku').click(function () {
		let _skuStr = $.trim($("#adjustPriceSearchForm input[name='sSkuList']").val());
		if (_skuStr == "" || _skuStr == null) return layer.msg('该方法调整库存，商品SKU必填', { icon: 0 })
		let skuStr = _skuStr.split(",").filter(item => item.trim())  //删除数组中空字符
		if(!skuStr.length) return layer.msg('请输入有效值', { icon: 0 })
		shopeeAdjustStock_getStockBySku(1, skuStr).then(count => {
			layer.open({
				type: 1,
				id: Date.now(),
				title: '调整库存',
				area: ['400px', '245px'],
				btn: !!count && count != 0 ? ["确认", "取消"] : "",
				success: function (layero) {
					laytpl($('#shopeeAdjustStock_stockBySku_modal').html()).render({count: count}, function (html) {
						$(layero).find('.layui-layer-content').html(html)
					})
				},
				yes: function (index, layero) {
					let _stock = $("#shopeeAdjustStock_stockBySku_form input[name=count]").val()
					if (_stock == '') return layer.msg('请填写调整库存量')
					shopeeAdjustStock_getStockBySku(2, skuStr, _stock)
						.then(() => {
							layer.close(index)
							layer.msg('操作成功', { icon: 1 })
						}).catch(err => layer.msg(err.responseJSON.msg, { icon: 2 }))
				},
				end: function () { }
			})
		}).catch(err => layer.msg(err.responseJSON.msg, { icon: 2 }))
	})
});

// type必须
// type=1  查询符合数据的数据量
// type=2  提交更改库存请求
function shopeeAdjustStock_getStockBySku(type,skuStr,stock='') {
    let params = {}
    params.storeAcctIdList = layui.formSelects.value("shopee_selectAttr_store", 'val')
    params.prodSSkuList = skuStr
    params.type = type
    if (type == 2) {
        params.stock = stock
    }
    return new Promise(function (resolve, reject) {
        $.ajax({
            type: 'put',
            dataType: 'json',
            url: ctx + '/shopee/shopeeIsEnableProduct/update/batch/stock',
            contentType: 'application/json; charset=UTF-8',
            data: JSON.stringify(params),
            beforeSend: function () { loading.show() },
            success: function (res) {
                loading.hide();
                if (res.code == '0000') {
                    resolve(res.count)
                } else {
                    reject(res.msg || '请求接口失败')
                }
            },
            error: function (err) {
                loading.hide();
                reject(err);
            }
        })
    })
}

/**
 * 匹配sku数量，中英文逗号和空格
 * @param {string} skuStr 输入框内容
 * @param event
 * 抄的user.js的公共方法handleSku(),没有了数量的限制
 */
 function shopeeAdjustStock_handleSku(skuStr,event){
    let str = skuStr.replace(/，/g,',').replace(/\s+/g,"");//中文逗号转为英文逗号，空格全部删掉
	event.target.value = str
 }