/**
 *调整库存
 */
var smtMoStockTimeUnit;
layui.use(['admin', 'form', 'layer','table', 'formSelects', 'element', 'laydate','laytpl'], function() {
	 var admin = layui.admin,
     form = layui.form,
     layer = layui.layer,
     table = layui.table,
     formSelects = layui.formSelects,
     element = layui.element,
     laydate = layui.laydate,
     laypage = layui.laypage,
     laytpl=layui.laytpl
     $ = layui.$,
     tableIns = {};
    render_hp_orgs_users("#smt_theShelves_searchForm");//渲染部门销售员店铺三级联动
    form.render(null, 'component-form-element');
    form.render(null, 'component-form-group');
    formSelects = layui.formSelects
    form.render('select');
    form.render('checkbox');
    form.render('radio');

    //表格渲染结果
    //展示已知数据
    var data = new Object();
    if(smt_arr.length > 0){
        data.idList=[];
        for (var i = 0; i < smt_arr.length; i++){
            if($("#smt_online_online_num1_span").parents("li").hasClass("layui-this")){
                data.idList.push(smt_arr[i].id);
            }else{
                layer.msg("只能修改上架中商品");
                return;
            }
        }
        data.idList = data.idList.join(",");
    }
    if(smt_arr.length > 0){
        tableReload(data);
    }
    function tableReload(data) {
        tableIns = table.render({
            elem: "#smtModifyStockTable",
            method:'post',
            url: ctx + "/batchOperation/getModifyMainStock.html",
            cols: [[
                {type: "checkbox"},
                { field: "id", title: "id"},
                { field: "storeAcctId", title:"店铺id" },
                { field: "storeAcct", title: "店铺" , width: 200},
                { field: "prodSSku", title: "商品子SKU" , width: 200},
                { field: "storeSubSku", title: "店铺子SKU", width: 200},
                { field: "itemId", title: "Item ID", width: 200},
                { field: "ipmSkuStock", title: "当前数量"},
                { field: "newStock", title: "调整数量",templet: '#new_stock'},
                { field: "result",title: '操作结果'}
            ]],
            page:false,
            where:data,
            height: 500,
            id:"smtModifyStockTable",
            limits:[10,20,50],
            limit:10,
            done:function(res, curr, count){
            	$("[data-field='id']").css('display', 'none');
                $("[data-field='storeAcctId']").css('display', 'none');
                $("#tolnum_span_smt_stock").text("共"+count+"条");
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
			 if($("#smtModStock_is_pAnds_sku").val() == 0){
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
    $("#smtModifyStockSearchBtn").click(function () {
    	var type = $(this).data('type');
        active[type] ? active[type].call(this) : '';
    });
    $("#smtModifyStockResetBtn").click(function () {
        $("#smt_theShelves_searchForm input[name='sSku']").val('');
        formSelects.value('selectAttr', [])
    });


    //批量调价
    $('#modifyStockButtn').click(function(){
    	//获取表格行对象
		var trObj =  $('#smtModifyStockTable').next().find('.layui-table-body tbody').find('tr');
    	var  arr = new Array();
    	for(var i=0;i<trObj.length;i++){
    		 var obj = new Object();
    		 obj.id =  $.trim(trObj.eq(i).find('td').eq(1).find('div').text());//id
    		 obj.storeAcctId =  $.trim(trObj.eq(i).find('td').eq(2).find('div').text());//店铺id
    		 obj.storeAcct =  $.trim(trObj.eq(i).find('td').eq(3).find('div').text());//店铺名称
    		 obj.prodSSku =  $.trim(trObj.eq(i).find('td').eq(4).find('div').text());//子sku
    		 obj.storeSubSku =  $.trim(trObj.eq(i).find('td').eq(5).find('div').text());//店铺子sku
    		 obj.itemId =  $.trim(trObj.eq(i).find('td').eq(6).find('div').text());//itemId
			 obj.ipmSkuStock = $.trim(trObj.eq(i).find('td').eq(7).find('div').text());//库存
			 obj.newStock =  $.trim(trObj.eq(i).find('td').eq(8).find('input').val());//新库存
    		 var checkStat = trObj.eq(i).find('td').eq(0).find('div').find('input').is(":checked");
    		 //只下架上架中商品
    		 if(checkStat){
                 if(obj.ipmSkuStock==obj.newStock){
                     trObj.eq(i).find('td').eq(9).find('.layui-table-cell').html("<div style='color:green'>"+"与原值相同不修改"+"</div>");
                 }else{
                     arr.push(obj)
                 }
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
			 url: ctx + "/batchOperation/modifyMainStock.html",
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
        smtMoStockTimeUnit = setInterval(function () {
    		sel(batchNo)
    	}, 5000);
    });

    function sel(batchNo){
        var trObj =  $('#smtModifyStockTable').next().find('.layui-table-body tbody').find('tr');
        var count = 0;
        for (var i = 0; i < trObj.length; i++) {
            var checkStat = trObj.eq(i).find('td').eq(0).find('div').find('input').is(":checked");
            var resultMsg = trObj.eq(i).find('td').eq(9).find('.layui-table-cell').find('div').text();
            if ((resultMsg == '' || resultMsg == null) && checkStat) {
                count++;
            }
        }
        if(count == 0){
            clearInterval(smtMoStockTimeUnit);
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
                        var resultMsg = trObj.eq(i).find('td').eq(9).find('.layui-table-cell').find('div').text();

                        var logMsg = data['SMT_MODIFY_STOCK_PROD'+ prodStoreSku + itemId ];
                        if ((resultMsg == '' || resultMsg == null) && checkStat) {
                            if (logMsg == '调整库存成功') {
                                trObj.eq(i).find('td').eq(9).find('.layui-table-cell').html("<div style='color:blue'>" + logMsg + "</div>");
                            } else if (logMsg != '' && logMsg != null && logMsg != 'undefined') {
                                trObj.eq(i).find('td').eq(9).find('.layui-table-cell').html("<div style='color:red'>" + logMsg + "</div>");
                            }
                        }
                    }
                }
            },
            error: function () {
                layer.msg("服务器正忙");
                clearInterval(smtMoStockTimeUnit);
            }
        });

    }

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

    form.on('submit(applyBtn)', function(data){
        var checkStatus = table.checkStatus('smtModifyStockTable');
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
                     var origincalue = tr.find('td[data-field="ipmSkuStock"]').text();
                     var value = parseInt(addvalue)+parseInt(origincalue);
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

    // 一键调整
$("#smtModifyStock_newStockBySku").click(function () {
    var obj = new Object()
    obj.storeAcctIdList = formSelects.value("selectAttr_store", "valStr")
  
    if (obj.storeAcctIdList === "") {
      obj.storeAcctIdList = $("#smt_theShelves_searchForm")
        .find("#smt_online_store_sel")
        .attr("acct_ids")
    }
    obj.skuList = $.trim(
      $("#smt_theShelves_searchForm input[name='skuList']").val()
    )
    obj.skuType = $("#smtModStock_is_pAnds_sku").val()
    if (obj.skuList.length > 0) {
      obj.skuType == "0"
        ? (obj.sSkuList = obj.skuList)
        : (obj.pSkuList = obj.skuList)
    } else {
      layer.msg("当前没有输入sku无法查询!")
      return
    }
  
    obj.storeAcctIdList = $.trim(obj.storeAcctIdList)
    obj.searchType = $("#smt_idEnable_skuSearchType").val() //搜索类型
  
    smtModifyStock_getStockBySku(obj)
      .then((res) => {
        let count = res.count
        let adjustStockIndex = layer.open({
          type: 1,
          id: Date.now(),
          title: "调整库存",
          area: ["400px", "245px"],
          btn: !!count && count != 0 ? ["确认", "取消"] : "",
          success: function (layero) {
            laytpl($("#smtModifyStockBySkuModal").html()).render(
              { count: count },
              function (html) {
                $(layero).find(".layui-layer-content").html(html)
              }
            )
          },
          yes: function (index, layero) {
            let _stock = $("#smtModifyStockBySkuForm input[name=count]").val()
            if (_stock == "") return layer.msg("请填写调整库存量")
            obj.newStock = _stock
            smtModifyStock_sureToBatchUpdateStock(obj)
              .then((res) => {
                layer.close(adjustStockIndex)
                layer.msg(res.msg || "操作成功", { icon: 1 })
              })
              .catch((err) => layer.msg(err.msg, { icon: 2 }))
          },
          end: function () {},
        })
      })
      .catch((err) => layer.msg(err.msg, { icon: 2 }))
  })
  
  // 数量查询接口
  // obj ： Object
  function smtModifyStock_getStockBySku(obj) {
    var formData = new FormData()
    for (let key in obj) {
      formData.append(key, obj[key])
    }
    return new Promise(function (resolve, reject) {
      $.ajax({
        type: "POST",
        dataType: "json",
        url: "/lms/batchOperation/getModifyMainStockCount",
        cache: false,
        processData: false,
        contentType: false,
        data: formData,
        success: function (res) {
          loading.hide()
          if (res.code == "0000") {
            resolve(res)
          } else {
            reject(res)
          }
        },
        error: function (err) {
          loading.hide()
          reject(err)
        },
      })
    })
  }
  
  // 确认一键调整库存接口
  // obj ： Object
  function smtModifyStock_sureToBatchUpdateStock(obj) {
    var formData = new FormData()
    for (let key in obj) {
      formData.append(key, obj[key])
    }
    return new Promise(function (resolve, reject) {
      $.ajax({
        type: "POST",
        dataType: "json",
        url: "/lms/batchOperation/sureToModifyMainStock",
        cache: false,
        processData: false,
        contentType: false,
        data: formData,
        success: function (res) {
          loading.hide()
          if (res.code == "0000") {
            resolve(res)
          } else {
            reject(res)
          }
        },
        error: function (err) {
          loading.hide()
          reject(err)
        },
      })
    })
  }
  
});