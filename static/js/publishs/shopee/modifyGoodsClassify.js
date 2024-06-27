layui.use(['admin', 'form', 'layer','table', 'formSelects', 'element', 'laydate','upload'], function() {
	 var admin = layui.admin,
     form = layui.form,
     layer = layui.layer,
     table = layui.table,
     formSelects = layui.formSelects,
     element = layui.element,
     laydate = layui.laydate,
     laypage = layui.laypage,
     upload = layui.upload
     $ = layui.$,
     tableIns={}

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
        console.log('1111 :>> ', 1111);
        tableRoload(data);
    }
	function tableRoload(data) {
        tableIns = table.render({
            elem: "#modifyIdTable",
            method:'post',
            url: ctx + "/shopee/shopeeIsEnableProduct/prodModifyClassify.html",
            height: 500,
            cols: [[
                {type: "checkbox"},
                { field: "id", title: "id" },
                { field: "storeAcctId", title: "店铺id" },
                { field: "storeAcct", title: "店铺",width:'10%'},
                { field: "prodPSku", title: "商品父SKU",width:'10%'},
                { field: "pSku", title: "店铺父SKU",width:'10%'},
                { field: "platCateId", title: "原分类ID",width:'10%'},
                 { field: "newCategoryId", title: "新分类ID",width:'10%'},
                { field: "specifics", title: "修改为",width:'20%'},
                { field: "itemId", title: "item_id"},
                { field: "result",title: '操作结果'}
            ]],
            where:data,
            page:false,
            id:"modifyIdTable",
            limits:[10,20,50],
            limit:10,
            done:function(res, curr, count){
            	$("#shopee-sort-modify [data-field='id']").css('display', 'none');
                $("#shopee-sort-modify [data-field='storeAcctId']").css('display', 'none');
                $("#shopee-sort-modify [data-field='itemId']").css('display', 'none');
                $("#tolnum_span_shopee_Id").text("共"+count+"条");

            }
        });
    }
    shopee_modify_clssify_log_tableApi()

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
        	 var skuStr = $.trim($("#modifyGoodsClassifyForm input[name='sSkuList']").val());
        	 if(skuStr !="" && skuStr!=null){
        		 data.sSkuList = $.trim(skuStr.split(","));
        	 }
        	 data.storeAcctIdList = $.trim(data.storeAcctIdList);
            data.searchType = $("#shopee_modifyStock_skuSearchType").val();//搜索类型
            tableRoload(data);
        }
    };
    $("#adjustPriceSearchBtn").click(function () {
    	var type = $(this).data('type');
        active[type] ? active[type].call(this) : '';
    });
    $("#adjustPriceResetBtn").click(function () {
        $("#modifyGoodsClassifyForm input[name='sSku']").val('');
        formSelects.value('selectAttr', []);
    });


    // $("#newIdBtn").click(function () {
    //     var newId = $("#modifyGoodsClassifyForm input[name='newIdInput']").val();
    //     //获取表格行对象
    //
    //     applytoChecked('modifyIdTable',tableIns,function(tr){
    //         var a = tr.find('td[data-field="platCateId"] div').text();
    //         tr.find('.new_PlatCateId').val(newId);
		// });
    //
		// // var trObj =  $('#modifyIdTable').next().find('.layui-table-body tbody').find('tr');
		// // for(var i=0;i<trObj.length;i++){
		// // 	 $.trim(trObj.eq(i).find('td').eq(7).find('input').val(newId));//新id
    // 	// }
    // });
    /**
     * 批量处理
     */
    $("#batchEnableProd").click(function () {
        var shop_arr = [];
        //获取表格行对象
        var trObj =  $('#modifyIdTable').next().find('.layui-table-body tbody').find('tr');
        for(var i=0;i<trObj.length;i++){
            var checkStat = trObj.eq(i).find('td').eq(0).find('div').find('input').is(":checked");
            //
            // var obj = {};
            // obj.id = trObj.eq(i).find('td').eq(1).find('div').text();//id
            // obj.storeAcctId = trObj.eq(i).find('td').eq(2).find('div').text();//店铺id
            // obj.storeAcct = trObj.eq(i).find('td').eq(3).find('div').text();//店铺
            // obj.prodPSku = trObj.eq(i).find('td').eq(4).find('div').text();//商品父sku
            // obj.pSku = trObj.eq(i).find('td').eq(5).find('div').text();//店铺父sku
            // // obj.platCateId = trObj.eq(i).find('td').eq(7).find('input').val();//新分类id
            // obj.platCateId = trObj.eq(i).find('td').eq(7).find('div').text();//新分类id
            // obj.itemId = trObj.eq(i).find('td').eq(8).find('div').text();
            if(checkStat){
                shop_arr.push({
                    "itemId":trObj.eq(i).find('td').eq(9).find('div').text(),
                    "specifics":trObj.eq(i).find('td').eq(8).find('div').text(),
                    "newCategoryId":trObj.eq(i).find('td').eq(7).find('div').text()
                });
            }
        }
        if(shop_arr.length <= 0){
            layer.msg("请选择需要修改的数据");
            return;
        }
        loading.show();
        $.ajax({
            type: "PUT",
            url: ctx + "/shopee/shopeeIsEnableProduct/update/specifics/batch",
            contentType: 'application/json',
            data:JSON.stringify(shop_arr),
            dataType: "JSON",
            success:function (data) {
                var trObj =  $('#modifyIdTable').next().find('.layui-table-body tbody').find('tr');
                for(var i=0;i<trObj.length;i++){
                    var arr_storeProdPId = trObj.eq(i).find('td').eq(9).find('div').text();
                    data.data.forEach(function(item){
                        if(item.operationCode == 1 && item.itemId == arr_storeProdPId){
                            trObj.eq(i).find('td').eq(10).find('.layui-table-cell').html("<div style='color:green'>" + item.operationResult + "</div>");
                        }else if(item.operationCode == 0 && item.itemId == arr_storeProdPId){
                            trObj.eq(i).find('td').eq(10).find('.layui-table-cell').html("<div style='color:red;posion: relative' class='errordata'>修改失败</div>");
                            trObj.eq(i).find('td').eq(10).find('.layui-table-cell').append("<textarea class='layui-hide'>"+item.operationResult+"</textarea>");
                        }
                    })
                }
                loading.hide()
            }
        })
    });

    $('#shopee_modify_clssify_export').click(function(){
        transBlob(
            {
              url: "/lms/shopee/shopeeIsEnableProduct/downTemplate",
              fileName: "在线商品修改分类模板.xlsx",
            },
            "get"
          )
            .then(function () {
              layer.msg("下载开始", { icon: 1 });
            })
            .catch(function (err) {
              layer.msg(err, { icon: 2 });
            });
    })

    $('#shopee_modify_clssify_refreshResult').click(function(){
        shopee_modify_clssify_log_tableApi()
    })
    
    upload.render({
        elem: "#shopee_modify_clssify_uplaod", //绑定元素
        url: "/lms/shopee/shopeeIsEnableProduct/importModifyClassify", //上传接口
        contentType: "multipart/form-data",
        accept: 'file',
        done: function (res) {
            //上传完毕回调
            if(res.code=='0000'){
                layer.msg(res.msg, { icon: 1 });
                let tableData=[{
                    createTime:new Date().getTime(),
                    creator:localStorage.getItem('lmsAppUserName'),
                    result:"上传成功，操作中，稍后请点击刷新按钮",
                }].concat()
                if(table.cache.shopee_modify_clssify_log_table_id &&table.cache.shopee_modify_clssify_log_table_id.length){
                    tableData = tableData.concat(table.cache.shopee_modify_clssify_log_table_id)
                }
                shopee_modify_clssify_log_tableRender(tableData)
            }else{
                layer.msg(res.msg, { icon: 2 });
            }
        },
        error: function (err) {
            //请求异常回调
            layer.msg(err, { icon: 2 });
        },
        });
   
    function shopee_modify_clssify_log_tableApi(){
        commonReturnPromise({
            url: '/lms/taskCenter/query',
            type: 'post',
            contentType: 'application/json',
            params:JSON.stringify({businessType:'shopee在线商品导入Excel修改商品分类'})
        }).then(res=>{
            shopee_modify_clssify_log_tableRender(res)
        })
    }

    function shopee_modify_clssify_log_tableRender(data){
        table.render({
            elem: "#shopee_modify_clssify_log_table",
            id: "shopee_modify_clssify_log_table_id",
            data: data,
            limit: 99999,
            page:false,
            cols: [
                [
                { field: "createTime", title: "导入时间",templet:'<div>{{Format(d.createTime,"yyyy-MM-dd hh:mm:ss")}}</div>' },
                { field: "creator", title: "操作人"},
                { field: "result", title: "操作结果",templet: function(d){
                    if(d.result){
                        return d.result
                    }
                    let successStr=''
                    if(d.totalNumber - d.failNumber >0){
                        successStr = `成功<span class="fGreen"> ${d.totalNumber - d.failNumber } </span>条`
                    }
                    let failStr=''
                    if(d.failNumber > 0){
                        failStr = `失败<span class="fRed"> ${d.failNumber} </span>条`
                    }
                    return successStr + failStr
                }},
                { title: "失败文件", field: "filePath",toolbar: "#shopee_modify_clssify_filePath",},
                ],
            ],
        });
    }

});

$('body').on('mouseover','.errordata',function(){
    var content = $(this).next("textarea").val()
    layer.tips(content, $(this), {
        time: 3000
    });

});