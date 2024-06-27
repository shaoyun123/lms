/**
 * 下架
 */
var smtIsEnableTimeUnit;
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
    render_hp_orgs_users("#smt_theShelves_searchForm");//渲染部门销售员店铺三级联动
    form.render(null, 'component-form-element');
    form.render(null, 'component-form-group');
    formSelects = layui.formSelects
    form.render('select');
    form.render('checkbox');

    //表格渲染结果
    //展示已知数据
    var data = new Object();
    if(smt_arr.length > 0){
        data.idList=[];
        for (var i = 0; i < smt_arr.length; i++){
            if($("#smt_online_online_num1_span").parents("li").hasClass("layui-this")){
                data.idList.push(smt_arr[i].id);
            }else{
                layer.msg("只能下架上架中商品");
                return;
            }
        }
        data.idList = data.idList.join(",");
    }
    if(smt_arr.length > 0){
        tableReload(data);
    }
    function tableReload(data) {
        table.render({
            elem: "#enableProdTable",
            method:'post',
            url: ctx + "/batchOperation/getIsEnableProduct.html",
            cols: [[
                {type: "checkbox"},
                { field: "id", title: "id"},
                { field: "storeAcctId", title:"店铺id" },
                { field: "storeAcct", title: "店铺" , width: 200},
                { field: "prodSSku", title: "商品子SKU" , width: 200},
                { field: "storeSubSku", title: "店铺子SKU", width: 200},
                { field: "itemId", title: "Item ID", width: 200},
                { field: "result",title: '操作结果'}
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
                $("#tolnum_span_smt_stop").text("共"+count+"条");
            }
        });
    }


    var active = {
        reload: function () {
        	 var data = new Object();
        	 data.storeAcctIdList = [];
        	 data.sSkuList = [];
			 data.pSkuList = [];
        	 var logisAttrContents = formSelects.value("selectAttr_store");
        	 for (var i = 0; i < logisAttrContents.length; i++) {
        	        var logisAttr = logisAttrContents[i].value;
        	        data.storeAcctIdList.push($.trim(logisAttr));
        	    }
            var skuStr = $.trim($("#smt_theShelves_searchForm input[name='skuList']").val());
			 if($("#smtProdSales_is_pAnds_sku").val() == 0){
                 if(skuStr !="" && skuStr!=null){
                     data.sSkuList = $.trim(skuStr.split(","));
                 }
			 }else {
                 if(skuStr !="" && skuStr!=null){
                     data.pSkuList = $.trim(skuStr.split(","));
                 }
			 }

        	 data.storeAcctIdList = $.trim(data.storeAcctIdList);
        	 var salepersonId = $.trim($("#smt_theShelves_searchForm select[name='saleName']").val());
        	 data.salepersonId = salepersonId;
        	 data.orgId = $.trim($("#smt_theShelves_searchForm select[name='orgId']").val());
            data.searchType = $("#smt_idEnable_skuSearchType").val();//搜索类型

            tableReload(data);

        }
    };
    $("#smtIsEnableProductSearchBtn").click(function () {
    	var type = $(this).data('type');
        active[type] ? active[type].call(this) : '';
    });
    $("#smtIsEnableProductResetBtn").click(function () {
        $("#smt_theShelves_searchForm input[name='sSku']").val('');
        formSelects.value('selectAttr', [])
    });


    //批量下架商品
    $('#smt_batchDisEnableProd').click(function(){
    	//获取表格行对象
		var trObj =  $('#enableProdTable').next().find('.layui-table-body tbody').find('tr');
    	var  arr = new Array();
    	for(var i=0;i<trObj.length;i++){
    		 var obj = new Object();
    		 obj.id =  $.trim(trObj.eq(i).find('td').eq(1).find('div').text());//id
    		 obj.storeAcctId =  $.trim(trObj.eq(i).find('td').eq(2).find('div').text());//店铺id
    		 obj.storeAcct =  $.trim(trObj.eq(i).find('td').eq(3).find('div').text());//店铺名称
    		 obj.prodSSku =  $.trim(trObj.eq(i).find('td').eq(4).find('div').text());//子sku
    		 obj.storeSubSku =  $.trim(trObj.eq(i).find('td').eq(5).find('div').text());//店铺子sku
    		 obj.itemId =  $.trim(trObj.eq(i).find('td').eq(6).find('div').text());//itemId
    		 var checkStat = trObj.eq(i).find('td').eq(0).find('div').find('input').is(":checked");
    		 //只下架上架中商品
    		 if(checkStat){
                 arr.push(obj)
    		 }
    	}
        if(arr==null ||arr.length==0){
            layer.msg("没有可以下架的商品！");
            return;
        }
		//以当前时间戳作为批次号
		var batchNo = new Date().getTime();
    	 $.ajax({
    		 beforeSend: function(){
				 loading.show();
	          },
			 type: "POST",
			 url: ctx + "/batchOperation/batchDisEnableProd.html",
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
		smtIsEnableTimeUnit = setInterval(function () {
    		sel(batchNo)
    	}, 5000);
    });
	function sel(batchNo){
		var trObj =  $('#enableProdTable').next().find('.layui-table-body tbody').find('tr');
		var count = 0;
		for (var i = 0; i < trObj.length; i++) {
			var checkStat = trObj.eq(i).find('td').eq(0).find('div').find('input').is(":checked");
			var resultMsg = trObj.eq(i).find('td').eq(7).find('.layui-table-cell').find('div').text();
			if ((resultMsg == '' || resultMsg == null) && checkStat) {
				count++;
			}
		}
		if(count == 0){
			clearInterval(smtIsEnableTimeUnit);
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
						var itemId = $.trim(trObj.eq(i).find('td').eq(6).find('div').text());//平台商品Id
						var prodStoreSku =  $.trim(trObj.eq(i).find('td').eq(5).find('div').text());//店铺sku
						var checkStat = trObj.eq(i).find('td').eq(0).find('div').find('input').is(":checked");
						var resultMsg = trObj.eq(i).find('td').eq(7).find('.layui-table-cell').find('div').text();

						var logMsg = data['SMT_BATCH_DIS_ENABLE_PROD'+ prodStoreSku + itemId ];
						if ((resultMsg == '' || resultMsg == null) && checkStat) {
							if (logMsg == '下架成功') {
								trObj.eq(i).find('td').eq(7).find('.layui-table-cell').html("<div style='color:blue'>" + logMsg + "</div>");
							} else if (logMsg != '' && logMsg != null && logMsg != 'undefined') {
								trObj.eq(i).find('td').eq(7).find('.layui-table-cell').html("<div style='color:red'>" + logMsg + "</div>");
							}
						}
					}
				}
			},
			error: function () {
				layer.msg("服务器正忙");
				clearInterval(smtIsEnableTimeUnit);
			}
		});

	}
});