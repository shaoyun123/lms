var stopPublishTimeUnit;
layui.use(['admin', 'form', 'layer', 'table', 'formSelects', 'element', 'laydate'], function () {
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

	render_hp_orgs_users("#adjustPriceSearchForm"); //渲染部门销售员店铺三级联动

	form.render('select');
	//表格渲染结果
	//展示已知数据
	var data = new Object();
	if (shop_arr.length > 0) {
		data.idList = [];
		for (var i = 0; i < shop_arr.length; i++) {
			data.idList.push(shop_arr[i].id);
		}
		data.idList = data.idList.join(",");
	}
	if (shop_arr.length > 0) {
		tableReloda(data);
	}
	function tableReloda (data) {
		table.render({
			elem: "#stopPublishTable",
			method: 'post',
			url: ctx + "/shopee/shopeeIsEnableProduct/prodStopPublish.html",
			cols: [[
				{ type: "checkbox" },
				{ field: "id", title: "id", width: '10%' },
				{ field: "storeAcctId", title: "店铺id", width: '10%' },
				{ field: "pStoreSku", title: "店铺父SKU", width: '13%' },
				{ field: "itemId", title: "item_id", width: '13%' },
				{ field: "storeAcct", title: "店铺", width: '13%' },
				{ field: "pSku", title: "商品父SKU", width: '13%' },
				{ field: "salesSite", title: "站点", width: '13%' },
				{ field: "siteId", title: "站点", width: '13%' },
				/*{ field: "location", title: "location", width: 130},
				 { field: "soldNums", title: "销售数量", width: 90},*/
				{ field: "currency", title: "币种", width: '13%' },
				/*{ field: "stock", title: "库存", width: 130},*/
				{ field: "result", title: '操作结果', width: '13%', align: 'center', }
			]],
			where: data,
			page: false,
			id: "stopPublishTable",
			height: 500,
			limits: [10, 20, 50],
			limit: 10,
			done: function (res, curr, count) {
				$("[data-field='id']").css('display', 'none');
				$("[data-field='storeAcctId']").css('display', 'none');
				$("[data-field='siteId']").css('display', 'none');
				$("#tolnum_span_shopee_stop").text("共" + count + "条");

			}
		});
	}

	/**
	 * 初始化shopee站点
	 */
	shopeeBoost_initShopeeSite();//初始化shopee站点下拉框
	function shopeeBoost_initShopeeSite () {
		$.ajax({
			type: "post",
			url: ctx + "/shopee/onlineProductShopee/getShopeeOnlineEnum.html",
			dataType: "json",
			success: function (returnData) {
				if (returnData.code == "0000") {
					var sites = [];
					var siteList = returnData.data.siteList;//站点
					$(siteList).each(function () {
						var a = { name: this.name, value: this.code };
						sites.push(a);
					});
					formSelects.data('shopee_stop_publish_site_sel', 'local', { arr: sites });
					form.render();
				} else {
					layer.msg(returnData.msg);
				}
			}
		});
	}
	var active = {
		reload: function () {
			var data = new Object();
			data.storeAcctIdList = [];
			data.sSkuList = [];
			var acctIdList = formSelects.value("shopee_stop_publish_store_sel");
			if (acctIdList != null && acctIdList.length > 0) { //选择店铺了
				for (var i = 0; i < acctIdList.length; i++) {
					var logisAttr = acctIdList[i].value;
					data.storeAcctIdList.push($.trim(logisAttr));
				}
			} else {
				var acctIds = $('#shopee_stop_publish_store_sel').attr('acct_ids');
				if (acctIds != null && acctIds != '') {
					data.storeAcctIdList = acctIds;
					// data.storeAcctIdList = '';
				}
			}
			data.storeAcctIdList = $.trim(data.storeAcctIdList)
			var skuStr = $.trim($("#adjustPriceSearchForm input[name='sSkuList']").val());
			if (skuStr != "" && skuStr != null) {
				data.sSkuList = $.trim(skuStr.split(","));
			}
			data.searchType = $("#shopee_stopPublish_skuSearchType").val();//搜索类型
			var itemIds = $("#shopee_stop_publish_itemid_input").val();
			data.itemIdstr = itemIds;
			var siteIds = formSelects.value('shopee_stop_publish_site_sel');
			var siteIds1 = (siteIds || []).map(function (item) {
				return $.trim(item.value)
			})
			data.siteIdstr = siteIds1.join(",");
			//执行重载
			/*  table.reload('stopPublishTable', {
				  where: data,
			  });*/
			tableReloda(data);
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
	$('#batchEnableProd').click(function () {
		var arrStat = [];
		var arr = [];
		//获取表格行对象
		var trObj = $('#stopPublishTable').next().find('.layui-table-body tbody').find('tr');

		for (var i = 0; i < trObj.length; i++) {
			var checkStat = trObj.eq(i).find('td').eq(0).find('div').find('input').is(":checked");
			var obj = new Object();
			obj.id = $.trim(trObj.eq(i).find('td').eq(1).find('div').text());//同步数据id
			//只修改被选中的商品信息
			if (checkStat) {
				arrStat[i] = obj;
			}

		}
		if (arrStat == null || arrStat.length == 0) {
			layer.msg("请选择需要操作数据！");
			return;
		}
		var arr = new Array();
		for (var i = 0; i < trObj.length; i++) {
			var obj = new Object();
			obj.id = $.trim(trObj.eq(i).find('td').eq(1).find('div').text());//同步数据id
			obj.storeAcctId = $.trim(trObj.eq(i).find('td').eq(2).find('div').text());//店铺id
			obj.prodStoreSku = $.trim(trObj.eq(i).find('td').eq(3).find('div').text());//店铺sku
			obj.itemId = $.trim(trObj.eq(i).find('td').eq(4).find('div').text());//平台商品Id
			obj.storeAcct = $.trim(trObj.eq(i).find('td').eq(5).find('div').text());//店铺名称
			obj.prodSSku = $.trim(trObj.eq(i).find('td').eq(6).find('div').text());//商品sku
			obj.siteId = $.trim(trObj.eq(i).find('td').eq(8).find('div').text());//站点
			obj.currency = $.trim(trObj.eq(i).find('td').eq(9).find('div').text());//币种
			var checkStat = trObj.eq(i).find('td').eq(0).find('div').find('input').is(":checked");
			if (checkStat) {
				arr.push(obj)
			}
		}
		//以当前时间戳作为批次号
		var batchNo = new Date().getTime();
		$.ajax({
			beforeSend: function () {
				loading.show();
			},
			type: "POST",
			url: ctx + "/shopee/shopeeIsEnableProduct/batchStopPublish.html",
			data: { 'prodObj': JSON.stringify(arr), 'batchNo': batchNo },
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

		stopPublishTimeUnit = setInterval(function () {
			sel(batchNo)
		}, 30000);
	});

	function sel (batchNo) {
		var trObj = $('#stopPublishTable').next().find('.layui-table-body tbody').find('tr');
		var count = 0;
		for (var i = 0; i < trObj.length; i++) {
			var checkStat = trObj.eq(i).find('td').eq(0).find('div').find('input').is(":checked");
			var resultMsg = trObj.eq(i).find('td').eq(10).find('.layui-table-cell').find('div').text();
			if ((resultMsg == '' || resultMsg == null) && checkStat) {
				count++;
			}
		}
		if (count == 0) {
			clearInterval(stopPublishTimeUnit);
			return;
		}
		$.ajax({
			type: "POST",
			url: ctx + "/shopee/shopeeIsEnableProduct/selectResult.html",
			data: { 'batchNo': batchNo },
			async: true,
			dataType: "json",
			success: function (returnData) {
				if (returnData.code == "0000") {
					var data = returnData.data;

					for (var i = 0; i < trObj.length; i++) {
						var itemId = $.trim(trObj.eq(i).find('td').eq(4).find('div').text());//平台商品Id
						var checkStat = trObj.eq(i).find('td').eq(0).find('div').find('input').is(":checked");
						var resultMsg = trObj.eq(i).find('td').eq(10).find('.layui-table-cell').find('div').text();

						var logMsg = data['TR_SHOPEE_STOP_PUBLISH' + itemId];
						if ((resultMsg == '' || resultMsg == null) && checkStat) {
							if (logMsg == '删除listing') {
								trObj.eq(i).find('td').eq(10).find('.layui-table-cell').html("<div style='color:blue'>" + logMsg + "</div>");
							} else if (logMsg != '' && logMsg != null && logMsg != 'undefined') {
								trObj.eq(i).find('td').eq(10).find('.layui-table-cell').html("<div style='color:red'>" + logMsg + "</div>");
							}
						}
					}
				}
			},
			error: function () {
				layer.msg("服务器正忙");
				clearInterval(stopPublishTimeUnit);
			}
		});
	}
});