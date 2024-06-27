/**
 *修改标题
 */
layui.use(['admin', 'form', 'layer','table', 'formSelects', 'element', 'laydate'], function() {
	 var admin = layui.admin,
     form = layui.form,
     layer = layui.layer,
     table = layui.table,
     formSelects = layui.formSelects,
     element = layui.element,
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
            //if($("#smt_online_online_num1_span").parents("li").hasClass("layui-this")){
                data.idList.push(smt_arr[i].id);
            /*}else{
                layer.msg("只能修改上架中商品");
                return;
            }*/
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
            url: ctx + "/batchOperation/getModifyMainTitleAliexoress.html",
            cols: [[
                {type: "checkbox"},
                { field: "id", title: "id"},
                { field: "storeAcctId", title:"店铺id" },
                { field: "storeAcct", title: "店铺" , width: 200},
                { field: "prodPSku", title: "商品父SKU" , width: 200},
                { field: "storeSubPku", title: "店铺父SKU", width: 200},
                { field: "itemId", title: "Item ID", width: 150},
                { field: "newStock", title: "标题",templet: '#new_title', width: 500},
                { field: "result",title: '操作结果'}
            ]],
            page:false,
            where:data,
            height: 500,
            id:"smtModifyStockTable",
            limits:[10,20,50],
            limit:10,
            done:function(res, curr, count){
                commonAddEventTitleToggle($('#smtModifyStockTable').next(), 'smt');
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
			 if($("#smtModTitle_is_pAnds_sku").val() == 0){
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
    console.log(1)
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
             obj.prodPSku =  $.trim(trObj.eq(i).find('td').eq(4).find('div').text());//父sku
             obj.storeSubPku =  $.trim(trObj.eq(i).find('td').eq(5).find('div').text());//店铺sku
    		 obj.itemId =  $.trim(trObj.eq(i).find('td').eq(6).find('div').text());//itemId
			 obj.newTitle =  $.trim(trObj.eq(i).find('td').eq(7).find('textarea').val());//新库存
    		 var checkStat = trObj.eq(i).find('td').eq(0).find('div').find('input').is(":checked");
             //只修改选中的
    		 if(checkStat){
                 arr.push(obj)
    		 }
    	}
        if(arr==null ||arr.length==0){
            layer.msg("没有需要修改的商品！");
            return;
        }
    	 $.ajax({
    		 beforeSend: function(){
				 loading.show();
	          },
			 type: "POST",
			 url: ctx + "/batchOperation/modifyMainTitleAliexpress.html",
			 data: {'prodObj':JSON.stringify(arr)},
			 async: true,
			 dataType: "json",
			 success: function (data) {
                 var trObj =  $('#smtModifyStockTable').next().find('.layui-table-body tbody').find('tr');
                 for(var i=0;i<trObj.length;i++){
                     var arr_itemId = trObj.eq(i).find('td').eq(6).find('div').text();
                     var msg = data.data[arr_itemId];

                     if(msg != undefined){
                         if(msg == "修改成功"){
                             trObj.eq(i).find('td').eq(8).find('.layui-table-cell').html("<div style='color:green'>" + msg + "</div>");
                         }else{
                             trObj.eq(i).find('td').eq(8).find('.layui-table-cell').html("<div style='color:red;posion: relative' class='errordata'>修改失败</div>");
                             trObj.eq(i).find('td').eq(8).find('.layui-table-cell').append("<textarea class='layui-hide'>"+ msg +"</textarea>");
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

    form.on('submit(smt_replace)', function(data){
        var checkStatus = table.checkStatus('smtModifyStockTable');
        if(checkStatus.data.length>0&&tableIns){
            var layFilterIndex = 'LAY-table-'+tableIns.config.index;
            var tableContainer = $('div[lay-filter="'+layFilterIndex+'"]');
            tableContainer.find('input[name="layTableCheckbox"]:checked').each(function(){
                var tr= $(this).parents('tr');
                var wh_title = tr.find('textarea[name="title_js"]').val()||tr.find('.title_js').text();
                wh_title=replace_string(wh_title,data.field.old_string,data.field.new_string);
                tr.find('textarea[name="title_js"]').val(wh_title);
                tr.find('.title_js').text(wh_title);
            });
        }else{
            layer.msg("请选择需要修改的数据！")
        }
        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });
});
$('body').on('mouseover','.errordata',function(){
    var content = $(this).next("textarea").val()
    layer.tips(content, $(this), {
        time: 3000
    });

});