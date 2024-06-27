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
    form.render('radio');
    render_hp_orgs_users("#stopPublishForm");//渲染部门销售员店铺三级联动
    //表格渲染结果
    //展示已知数据
    var data = {};
    if (stopAmazonArr.length > 0) {
        data.idList = [];
        data.asinList = [];
        for (var i = 0; i < stopAmazonArr.length; i++) {
            if(stopAmazonArr[i].id != null && stopAmazonArr[i].id!=''){
                data.idList.push(stopAmazonArr[i].id);
            }else{
                data.asinList.push(stopAmazonArr[i].asin)
            }
        }
        data.idList = data.idList.join(",");
        data.asinList = data.asinList.join(",");
    }
    if(stopAmazonArr.length > 0){
        tableRelode(data);
    }
    if(timeUnit != null){
        clearInterval(timeUnit);//清除定时查询进度
    }
	function tableRelode(data) {
        tableIns = table.render({
            elem: "#stopPublishTable_amazon",
            method:'post',
            url: ctx + "/amazonBatchOperationController/searchStopPublish.html",
            cols: [[
                {type: "checkbox"},
                { field: "id", title: "id" ,width: 100},
                { field: "storeAcctId", title: "店铺id" , width: 100},
                { field: "storeAcct", title: "店铺" , width: 100},
                { field: "storeSSku", title: "店铺子SKU", width: 130},
                { field: "prodSSku", title: "商品子SKU" , width: 120},
                { field: "asin", title: "asin", width: 130},
                { field: "siteId", title: "站点", width: 60},
                { field: "currency", title: "币种" , width: 50},
                { field: "stock", title: "库存", width: 130},
                { field: "newStock", title: "调整数量",templet: '#new_stock'},
                { field: "result",title: '操作结果', width: 200, align: 'center'}
            ]],
			where:data,
            page:false,
            height: 500,
            id:"stopPublishTable_amazon",
            done:function(res, curr, count){
            	$("[data-field='id']").css('display', 'none');
                $("[data-field='storeAcctId']").css('display', 'none');
                $("#tolnum_span_amazon_stop").text("共"+count+"条");
            }
        });

    }
    var active = {
        reload: function () {
        	 var data = new Object();
        	 data.sSkuList = [];
             var logisAttrContents = formSelects.value("selectAttr_store","val");
             if (logisAttrContents == null || logisAttrContents.length < 1) {
                var acct_ids = $('[fs_id=selectAttr_store]').find('dd[tree-folder=false]');
                if(acct_ids.length > 0){
                    var acct_idsArr = Array.prototype.slice.call(acct_ids);
                    data.storeAcctIdList = acct_idsArr.map(function(item){
                        return $(item).attr('lay-value');
                    }).join();
                }else{
                    data.storeAcctIdList = '';
                }
             }else {
				data.storeAcctIdList = logisAttrContents.join(","); //选择的店铺
			}
            var skuType = $("#amazon_stop_searchType_sku option:selected").val();
            var skuStr = $.trim($("#stopPublishForm input[name='sSkuList']").val());
            if(skuStr !="" && skuStr!=null){
				if(skuType == 1) {
                	data.sSkuList = $.trim(skuStr.split(","));
				}else if(skuType == 0){
					data.pSkuList = $.trim(skuStr.split(","));
				}
            }
            data.searchType = $("#amazon_stop_searchType").val();//搜索类型
            tableRelode(data);
        }
    };
    $("#storeListingSearchBtn").click(function () {
    	var type = $(this).data('type');
        active[type] ? active[type].call(this) : '';
    });
    $("#storeListingResetBtn").click(function () {
        $("#stopPublishForm input[name='sSku']").val('');
        formSelects.value('selectAttr', []);
    });

    form.on('radio(apply)', function(data){
        var value = data.value;
        if(value==='1'){
            $('#addinvntory').val('').attr('disabled',true);
            $('#adjustto').attr('disabled',false);
        }else{
            $('#adjustto').val('').attr('disabled',true);
            $('#addinvntory').attr('disabled',false);
        }
    });

    form.on('submit(amazonModStock_applyBtn)', function(data){
        var checkStatus = table.checkStatus('stopPublishTable_amazon');
        var addvalue = $('#addinvntory').val();
        var adjustvalue = $('#adjustto').val();
        if(checkStatus.data.length>0&&tableIns){
            var layFilterIndex = 'LAY-table-'+tableIns.config.index;
            var tableContainer = $('div[lay-filter="'+layFilterIndex+'"]');
            var value = data.field.apply;
            if(value==='1'){
                if(adjustvalue!==''){
                    tableContainer.find('input[name="layTableCheckbox"]:checked').each(function(){
                        var tr= $(this).parents('tr');
                        var input = tr.find('input[name="adjustStock"]');
                        if(parseInt(adjustvalue)>=0){
                            input.val(adjustvalue);
                        }else{
                            layer.msg('库存不可低于0');
                        }
                    });
                }else{
                    layer.msg("请填写调整后的数量");
                }
            }else{
                if(addvalue!==''){
                    tableContainer.find('input[name="layTableCheckbox"]:checked').each(function(){
                        var tr= $(this).parents('tr');
                        var input = tr.find('input[name="adjustStock"]');
                        var origincalue = tr.find('td[data-field="stock"]').text();
                        var value = parseInt(addvalue)+parseInt(origincalue);
                        // console.log('addvalue',addvalue);
                        // console.log('origincalue',origincalue);
                        if(value<0){
                            value = 0;
                            layer.msg('库存不可低于0');
                            input.val(value);
                        }else{
                            input.val(value);
                        }
                    });
                }else{
                    layer.msg("请填写调整后的数量");
                }
            }
        }else{
            layer.msg("请选择需要修改的数据！");
        }
        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });

    //批量修改
    $('#batchEnableProd').click(function(){
        if(timeUnit != null){
            clearInterval(timeUnit);//清除定时查询进度
        }
    	//获取表格行对象
		 var trObj =  $('#stopPublishTable_amazon').next().find('.layui-table-body tbody').find('tr');
    	 var  arr = [];
    	for(var i=0;i<trObj.length;i++){
    		 var obj = new Object();
    		 obj.id =  $.trim(trObj.eq(i).find('td').eq(1).find('div').text());//同步数据id
    		 obj.storeAcctId =  $.trim(trObj.eq(i).find('td').eq(2).find('div').text());//店铺id
			 obj.storeAcct =  $.trim(trObj.eq(i).find('td').eq(3).find('div').text());//店铺名称
			 obj.storeSSku =  $.trim(trObj.eq(i).find('td').eq(4).find('div').text());//店铺子sku
			 obj.prodSSku =  $.trim(trObj.eq(i).find('td').eq(5).find('div').text());//店铺sku
    		 obj.asin =  $.trim(trObj.eq(i).find('td').eq(6).find('div').text());//平台商品Id
    		 obj.siteId =  $.trim(trObj.eq(i).find('td').eq(7).find('div').text());//站点
    		 obj.currency =  $.trim(trObj.eq(i).find('td').eq(8).find('div').text());//币种
            obj.newStock =  $.trim(trObj.eq(i).find('td').eq(10).find('input').val());//币种
    		 var checkStat = trObj.eq(i).find('td').eq(0).find('div').find('input').is(":checked");
    		 if(checkStat){
    			 arr.push(obj)
    		 }
    	}
        if(arr==null ||arr.length==0){
            layer.msg("请选择需要操作数据！");
            return;
        }
    	 $.ajax({
    		 beforeSend: function(){
				 loading.show();
	          },
			 type: "POST",
			 url: ctx + "/amazonBatchOperationController/stopPublishAmazon.html",
			 data: {'prodObj':JSON.stringify(arr)},
			 async: true,
			 dataType: "json",
			 success: function (returnData) {
				 if (returnData.code == "0000") {
                     result()
					 loading.hide();
			    	 layer.msg(returnData.msg,{icon:1});
				 } else {
					 loading.hide();
					 layer.msg(returnData.msg);
				 }
			 },
			 error: function () {
				 loading.hide()
				 layer.msg("服务器错误");
			 }
		 });
        let ids = arr.map(item=>item.id)
        timeUnit = setInterval(function () {
    		sel(ids,timeUnit)
    	}, 5000);
    });
    function result(){
        var trObj =  $('#stopPublishTable_amazon').next().find('.layui-table-body tbody').find('tr');
        for(var i=0;i<trObj.length;i++){
            var checkStat = trObj.eq(i).find('td').eq(0).find('div').find('input').is(":checked");
            if(checkStat){
                trObj.eq(i).find('td').eq(11).find('.layui-table-cell').html("<div style='color:green'>处理中</div>");
            }
        }
    }
    
    function sel(idArr,timeUnit){
        commonReturnPromiseRes({
            isLoading: false,
            type: 'POST',
            contentType: 'application/json;charset=UTF-8',
            url: `${ctx}/amazonBatchOperationController/getAllProcessResult?operType=MODIFY_INVENTORY`,
            params:JSON.stringify(idArr)
        }).then(res => {
            if(res.code == "0000"){
                clearInterval(timeUnit);
                var trObj =  $('#stopPublishTable_amazon').next().find('.layui-table-body tbody').find('tr');
                for(var i=0;i<trObj.length;i++){
                    var id = trObj.eq(i).find('td').eq(1).find('div').text();
                    var msg = res.data[id];

                    if(msg != undefined){
                        if(msg.indexOf("成功") != -1){
                            trObj.eq(i).find('td').eq(11).find('.layui-table-cell').html("<div style='color:green'>"+msg+"</div>");
                        }else {
                            trObj.eq(i).find('td').eq(11).find('.layui-table-cell').html("<div style='color:red'>"+msg+"</div>");
                        }
                    }
                }
            }
        }).catch(err => {
            // clearInterval(amazonModifyTitle_timer);
        })
        // var trObj =  $('#stopPublishTable_amazon').next().find('.layui-table-body tbody').find('tr');
    	// for(var i=0;i<trObj.length;i++){
      	// 	 var obj = new Object();
      	// 	 obj.storeAcctId =  $.trim(trObj.eq(i).find('td').eq(2).find('div').text());//平台商品Id
      	// 	 obj.prodStoreSku =  $.trim(trObj.eq(i).find('td').eq(4).find('div').text());//店铺sku
         //     obj.siteId =  $.trim(trObj.eq(i).find('td').eq(7).find('div').text());//店铺sku
      	// 	 var checkStat = trObj.eq(i).find('td').eq(0).find('div').find('input').is(":checked");
     	// 	 if(checkStat){
     	// 		 selectResult(obj,trObj,i);
     	// 	 }
       	// }
    }
    function selectResult(obj,trObj,i){
		 $.ajax({
			 type: "POST",
			 url: ctx + "/amazonBatchOperationController/selectModifyStock.html",
			 data: {'prodObj':JSON.stringify(obj)},
			 async: true,
			 dataType: "json",
			 success: function (returnData) {
				 if (returnData.code == "0000") {
					 if(returnData.msg =='成功'){
						 trObj.eq(i).find('td').eq(11).find('.layui-table-cell').html("<div style='color:green'>"+returnData.msg+"</div>");
					 }else if(returnData.msg!=''&& returnData.msg!=null &&returnData.msg != 'undefined'){
						 trObj.eq(i).find('td').eq(11).find('.layui-table-cell').html("<div style='color:red'>"+returnData.msg+"</div>");
					 }
                     // clearInterval(timeUnit);//清除定时查询进度
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