/**
 *调整商品毛重
 */
layui.use(['admin', 'form', 'layer','table', 'formSelects', 'element', 'laydate'], function() {
	 var admin = layui.admin,
     form = layui.form,
     layer = layui.layer,
     table = layui.table,
     formSelects = layui.formSelects,
     element = layui.element,
     laydate = layui.laydate,
     laypage = layui.laypage,
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
    let smtModifyMainGrossWeightTableDataLen = 0
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
            elem: "#smt_Modify_weight_Table",
            method:'post',
            url: ctx + "/batchOperation/getModifyMainTitleAliexoress.html",
            cols: [[
                {type: "checkbox"},
                { field: "id", title: "id"},
                { field: "storeAcctId", title:"店铺id" },
                { field: "storeAcct", title: "店铺" , width: 200},
                { field: "prodPSku", title: "商品SKU" , width: 200},
                { field: "storeSubPku", title: "店铺SKU", width: 200},
                { field: "itemId", title: "Item ID", width: 200},
                { field: "grossWeight", title: "当前重量"},
                { field: "newGrossWeight", title: "调整重量",templet: '#new_stock'},
                { field: "result",title: '操作结果'}
            ]],
            page:false,
            where:data,
            height: 500,
            id:"smt_Modify_weight_Table",
            limits:[10,20,50],
            limit:10,
            done:function(res, curr, count){
            	$("[data-field='id']").css('display', 'none');
                $("[data-field='storeAcctId']").css('display', 'none');
                $("#tolnum_span_smt_stock").text("共"+count+"条");
                smtModifyMainGrossWeightTableDataLen = count
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
			 if($("#weight_is_smt_sku").val() == 0){
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
            data.searchType = $("#smt_weight_skuSearchType").val();//搜索类型
            tableReload(data);
        }
    };
    $("#smt_Modify_weight_SearchBtn").click(function () {
    	var type = $(this).data('type');
        active[type] ? active[type].call(this) : '';
    });
    $("#smt_Modify_weight_ResetBtn").click(function () {
        $("#smt_theShelves_searchForm input[name='sSku']").val('');
        formSelects.value('selectAttr', [])
    });


    //批量调价
    $('#modify_weight_Buttn').click(function(){
    	//获取表格行对象
		var trObj =  $('#smt_Modify_weight_Table').next().find('.layui-table-body tbody').find('tr');
    	var  arr = new Array();
    	for(var i=0;i<trObj.length;i++){
    		 var obj = new Object();
    		 obj.id =  $.trim(trObj.eq(i).find('td').eq(1).find('div').text());//id
    		 obj.storeAcctId =  $.trim(trObj.eq(i).find('td').eq(2).find('div').text());//店铺id
    		 obj.storeAcct =  $.trim(trObj.eq(i).find('td').eq(3).find('div').text());//店铺名称
    		 obj.prodPSku =  $.trim(trObj.eq(i).find('td').eq(4).find('div').text());//子sku
    		 obj.storeSubPku =  $.trim(trObj.eq(i).find('td').eq(5).find('div').text());//店铺子sku
    		 obj.itemId =  $.trim(trObj.eq(i).find('td').eq(6).find('div').text());//itemId
			 obj.grossWeight = $.trim(trObj.eq(i).find('td').eq(7).find('div').text());//库存
			 obj.newGrossWeight =  $.trim(trObj.eq(i).find('td').eq(8).find('input').val());//新库存
    		 var checkStat = trObj.eq(i).find('td').eq(0).find('div').find('input').is(":checked");
    		 if(checkStat && trObj.eq(i).css('display')!=='none'){
                 arr.push(obj)
    		 }
    	}
        if(arr==null ||arr.length==0){
            layer.msg("请选择商品！");
            return;
        }
    	 $.ajax({
    		 beforeSend: function(){
				 loading.show();
	          },
			 type: "POST",
			 url: ctx + "/batchOperation/modifyMainGrossWeight.html",
			 data: {'prodObj':JSON.stringify(arr)},
			 async: true,
			 dataType: "json",
			 success: function (data) {
                 var trObj =  $('#smt_Modify_weight_Table').next().find('.layui-table-body tbody').find('tr');
                 for(var i=0;i<trObj.length;i++){
                     var smt_itemid = trObj.eq(i).find('td').eq(6).find('div').text();
                     var msg = data.data[smt_itemid];
                     if(msg != undefined){
                         if(msg == "修改成功"){
                             trObj.eq(i).find('td').eq(9).find('.layui-table-cell').html("<div style='color:green'>" + msg + "</div>");
                         }else{
                             trObj.eq(i).find('td').eq(9).find('.layui-table-cell').html("<div style='color:red;posion: relative' class='errordata'>修改失败</div>");
                             trObj.eq(i).find('td').eq(9).find('.layui-table-cell').append("<textarea class='layui-hide'>"+msg+"</textarea>");
                         }
                     }
                 }
                 loading.hide()
			 },
			 error: function () {
				 loading.hide()
				 layer.msg("服务器正忙");
			 }
		 });

    });
    $('body').on('mouseover','.errordata',function(){
        var content = $(this).next("textarea").val();
        layer.tips(content, $(this), {
            time: 3000
        });
    });
    form.on('radio(apply)', function(data){
        var value = data.value;
        if(value==='1'){
            $('#smt_add_weight').val('').attr('disabled',true);
            $('#smt_adjustto_weight').attr('disabled',false);
        }else{
            $('#smt_adjustto_weight').val('').attr('disabled',true);
            $('#smt_add_weight').attr('disabled',false);
        }
      }); 

    form.on('submit(smt_weight_applyBtn)', function(data){
        var checkStatus = table.checkStatus('smt_Modify_weight_Table');
        var addvalue = $('#smt_add_weight').val();
        var adjustvalue = $('#smt_adjustto_weight').val();
        if(checkStatus.data.length>0&&tableIns){
        var layFilterIndex = 'LAY-table-'+tableIns.config.index;
        var tableContainer = $('div[lay-filter="'+layFilterIndex+'"]');
        var value = data.field.apply;
        if(value==='1'){
            if(adjustvalue!==''){
            tableContainer.find('input[name="layTableCheckbox"]:checked').each(function(){
                var tr= $(this).parents('tr');
                if(tr.css('display')!=='none'){
                    var input = tr.find('input[name="adjustWeight"]');
                    if(parseInt(adjustvalue)>=0){
                       input.val(adjustvalue);
                   }else{
                        layer.msg('重量不可低于0');
                   }
                }
            });
        }else{
            layer.msg("请填写调整后的数量");
        }
        }else{
            if(addvalue!==''){
                tableContainer.find('input[name="layTableCheckbox"]:checked').each(function(){
                    var tr= $(this).parents('tr');
                    if(tr.css('display')!=='none'){
                        var input = tr.find('input[name="adjustWeight"]');
                        var origincalue = tr.find('td[data-field="grossWeight"]').text();
                        var value = (parseFloat(addvalue)+parseFloat(origincalue)).toFixed(3);
                        if(value<0){
                            value = 0;
                            layer.msg('重量不可低于0');
                            input.val(value);
                        }else{
                            input.val(value);
                        }
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

      	// 差价查询
	$('#smt_ModifyMainGrossWeightfilterWeight').click(function(){
		let formDom = $('#smt_ModifyMainGrossWeight_filtForm')
		let curCondition = {
			operatorType :formDom.find('select[name=operator]').val(),
			diffWeight : parseFloat(formDom.find('input[name=diffWeight]').val())
		}
		if(!curCondition.operatorType) return showOrigin()
		var layFilterIndex = 'LAY-table-'+tableIns.config.index;
		var tableContainer = $('div[lay-filter="'+layFilterIndex+'"]');
		tableContainer.find('tbody tr').each(function(){
			let newWeight = $(this).find('input[name=adjustWeight]').val()
			let originWeight = $(this).find('td[data-field="grossWeight"] div').text()
			let diffWeight = parseFloat(newWeight) - parseFloat(originWeight)
			filterWeight($(this),diffWeight,curCondition)
		})
		changeTotal(tableContainer)
	})

	function filterWeight(tr,diffWeight,curCondition){
		switch (curCondition.operatorType){
			case "1":
				if((diffWeight - curCondition.diffWeight).toFixed(2) > 0){
					tr.css('display','block')
				}else{
					uncheckedTrs(tr)
				}
		   break;
		   case "2":
				if((diffWeight - curCondition.diffWeight).toFixed(2) < 0){
					tr.css('display','block')
				}else{
					uncheckedTrs(tr)
				}
		   break;
		   case "3":
				if(diffWeight.toFixed(2) == curCondition.diffWeight.toFixed(2)){
					tr.css('display','block')
				}else{
					uncheckedTrs(tr)
				}
		   break;
		}
	}

	// 将未显示的选中数据设置为未选中
	function uncheckedTrs(tr){
		tr.find('input[name="layTableCheckbox"]').prop('checked',false)
		tr.css('display','none')
		table.cache.smt_Modify_weight_Table[tr.data('index')].LAY_CHECKED = false
	}

	// 差价筛选 是否全选
	function isAllChecked(){
		var layFilterIndex = 'LAY-table-'+tableIns.config.index;
		var tableContainer = $('div[lay-filter="'+layFilterIndex+'"]');
		let curTotalTr =smtModifyMainGrossWeightTableDataLen - tableContainer.find('tbody tr[style="display: none;"]').length
		let checkedTr = tableContainer.find('tbody input[name="layTableCheckbox"]:checked').length
		tableContainer.find('thead input[name="layTableCheckbox"]').prop('checked',curTotalTr==checkedTr)
	}

	// 差价清空
	$('#smt_ModifyMainGrossWeightOrigin').click(function(){
		let formDom = $("#smt_ModifyMainGrossWeight_filtForm")
        formDom[0].reset()
		showOrigin()
	})

	function showOrigin(){
		var layFilterIndex = 'LAY-table-'+tableIns.config.index;
		var tableContainer = $('div[lay-filter="'+layFilterIndex+'"]');
		tableContainer.find('tbody tr').each(function(){
			$(this).css('display','block')
		})
		changeTotal(tableContainer)
	}
	// 改变总数量
	function changeTotal(tableContainer){
		let hideNum = tableContainer.find('tbody tr[style="display: none;"]').length
		$('#tolnum_span_smt_stock').text(smtModifyMainGrossWeightTableDataLen - hideNum)
		isAllChecked()
		form.render()
	}
});