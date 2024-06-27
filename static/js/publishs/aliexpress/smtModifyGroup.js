/**
 * 调整运费模板
 */
var storeTemp="";
layui.use(['admin', 'form', 'layer','table', 'formSelects', 'upload', 'element', 'laydate'], function() {
	 var admin = layui.admin,
     form = layui.form,
     layer = layui.layer,
     table = layui.table,
     formSelects = layui.formSelects,
     upload = layui.upload,
     $ = layui.$;
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
            	data.idList.push(smt_arr[i].id);
        }
        data.idList = data.idList.join(",");
    }
    if(smt_arr.length > 0){
        tableReload(data);
    }

    form.on('select(smt_group_online_store_sel_modifyGroup)', function(data){
        storeTemp = data.value;
      });  

    function tableReload(data) {
        tableIns =table.render({
            elem: "#smtModifyGroupsTable",
            method:'post',
            url: ctx + "/batchOperation/getModifyGroup.html",
            cols: [[
                {type: "checkbox"},
                { field: "id", title: "id"},
                { field: "storeAcctId", title:"店铺id" ,width:150},
                { field: "storeAcct", title: "店铺" , width: 150},
                { field: "itemId", title: "Item ID", width: 150},
                { field: "prodPSku", title: "商品父SKU" , width: 200},
                { field: "storePSku", title: "店铺父SKU", width: 200},
                { field: "groupSmtList", title: "所属分组",width:350,templet:"#group_g_name"},
                { field: "result",title: '操作结果'}
            ]],
            page:false,
            where:data,
            id:"smtModifyGroupsTable",
            limits:[10,20,50],
            limit:10,
            height: 500,
            done:function(res, curr, count){
            	$("[data-field='id']").css('display', 'none');
                $("#tolnum_span_smt_templat").text("共"+count+"条");
                if(res.code == "0000" && res.data&&res.data.length > 0){
                    var storeAcctId = res.data[0].storeAcctId;
                    $("#smt_group_online_store_sel_modifyGroup option[value=storeAcctId]").attr("selected","selected");
                    $.ajax({
                        type:"GET",
                        url: ctx + "/batchOperation/getStoreAcctGroup.html?storeAcctId="+storeAcctId,
                        async: false,
                        dataType:'json',
                        success:function (data){
                            smtModifyGroup_initGroupSel(data);
                            var storeAcctId = res.data[0].storeAcctId;
                            setTimeout(function(){
                                $("#smt_group_online_store_sel_modifyGroup option").each(function(){
                                    if($(this).val()==storeAcctId){
                                        $(this).attr('selected',true);
                                        storeTemp = $('#smt_group_online_store_sel_modifyGroup').val();
                                    }
                            });
                            form.render('select');
                            },1000);
                        }
					})
				}
            }
        });
    }
    var active = {
        reload: function () {
             var data = new Object(),
             logisAttrContents =[];
        	 data.storeAcctIdList = [];
        	 data.sSkuList = [];
             logisAttrContents.push(storeTemp);
        	 for (var i = 0; i < logisAttrContents.length; i++) {
        	        var logisAttr = logisAttrContents[i];
        	        data.storeAcctIdList.push($.trim(logisAttr));
                }
            var skuStr = $.trim($("#smt_theShelves_searchForm input[name='groups_skuList']").val());
			 if($("#group_pAnds_sku").val() == 0){
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
              data.searchType = $("#smt_groups_idEnable_skuSearchType").val();//搜索类型
             tableReload(data);
        }
    };
    /*同步最新产品分组*/
    $("#smt_product_group_sync").click(function(){
        var storeAcctId = $("#smt_group_online_store_sel_modifyGroup").val();
        if (storeAcctId == '' || storeAcctId == null) {
            layer.msg("请选择店铺", {icon: 0});
            return false;
        }
        loading.show();
        $.ajax({
            type: "post",
            url: ctx + "/onlineProductSmt/syncSmtProductGroups.html",
            data: {"storeAcctId": storeAcctId},
            dataType: "json",
            success: function (returnData) {
                loading.hide();
                if (returnData.code == "0000") {
                    layer.msg(returnData.msg, {icon: 1});
                    smtModifyGroup_initGroupSel(returnData);
                } else {
                    layer.msg(returnData.msg, {icon: 2});
                }
            }
        });
        return false;
    });

    /**
     * 初始化店铺分组下拉框
     * @param data
     */
    function smtModifyGroup_initGroupSel(data){
        let _data = data.data.map(item=>({...item,name:item.groupName,value:item.groupId}))
        let treeData = commonArrToTree(_data,'groupId','parentGroup')
        formSelects.data('smt_group_templat','local',{arr: treeData})
        var isFirst = true;
        formSelects.opened('smt_group_templat', function(id){
            if(isFirst){
                isFirst = false;
                $('[fs_id="smt_group_templat"]').find('.xm-cz i.icon-caidan').click();
            }
        });
    }
    $("#smtModifyGroupsSearchBtn").click(function () {
    	var type = $(this).data('type');
        active[type] ? active[type].call(this) : '';
    });
    $("#smtModifyGroupsResetBtn").click(function () {
        $("#smt_theShelves_searchForm input[name='sSku']").val('');
        formSelects.value('selectAttr', [])
    });
    //批量修改
    $('#modifyGroupsButtn').click(function(){
    	var trObj =  $('#smtModifyGroupsTable').next().find('.layui-table-body tbody').find('tr');
    	var  arr = new Array();
        var logisAttrContents = formSelects.value("smt_group_templat");
        var logisAttr = "";
        if(logisAttrContents.length>3) return layer.msg('目前最多支持三个分组')
        for (var x = 0; x < logisAttrContents.length; x++) {
            if(x == logisAttrContents.length-1) {
                logisAttr = logisAttr + logisAttrContents[x].value;
            }else {
                logisAttr = logisAttr + logisAttrContents[x].value+',';
            }
        }
    	for(var i=0;i<trObj.length;i++){
    		 var obj = new Object();
    		 obj.id =  $.trim(trObj.eq(i).find('td').eq(1).find('div').text());//id
    		 obj.storeAcctId =  $.trim(trObj.eq(i).find('td').eq(2).find('div').text());//店铺id
    		 obj.storeAcct =  $.trim(trObj.eq(i).find('td').eq(3).find('div').text());//店铺名称
    		 obj.itemId =  $.trim(trObj.eq(i).find('td').eq(4).find('div').text());//itemId\
             obj.newGroups = logisAttr;
    		 var checkStat = trObj.eq(i).find('td').eq(0).find('div').find('input').is(":checked");
			 //修改选中商品
    		 if(checkStat){
                 arr.push(obj)
    		 }
    	}
        if(arr==null ||arr.length==0){
            layer.msg("没有可以修改的商品！");
            return;
        }
        $.ajax({
            beforeSend: function(){
                loading.show();
             },
            type: "POST",
            url: ctx + '/batchOperation/modifyMainGroup.html',
            data: {'prodObj':JSON.stringify(arr)},
            async: true,
            dataType: "json",
            success: function (data) {
                    var trObj =  $('#smtModifyGroupsTable').next().find('.layui-table-body tbody').find('tr');
                    for(var i=0;i<trObj.length;i++){
                        var smt_itemid = trObj.eq(i).find('td').eq(4).find('div').text();
                        var msg = data.data[smt_itemid];
                        if(msg != undefined){
                            if(msg == "修改成功"){
                                trObj.eq(i).find('td').eq(8).find('.layui-table-cell').html("<div style='color:green'>" + msg + "</div>");
                            }else{
                                trObj.eq(i).find('td').eq(8).find('.layui-table-cell').html("<div style='color:red;posion: relative' class='errordata'>" + msg + "</div>");
                                trObj.eq(i).find('td').eq(8).find('.layui-table-cell').append("<textarea class='layui-hide'>"+msg+"</textarea>");
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

    // 批量增加
    $("#modifyAddGroupsButtn").click(function(){
        var trObj =  $('#smtModifyGroupsTable').next().find('.layui-table-body tbody').find('tr');
    	var  arr = new Array();
        var logisAttrContents = formSelects.value("smt_group_templat");
        var logisAttr = "";
        if(logisAttrContents.length>3) return layer.msg('目前最多支持三个分组')
        for (var x = 0; x < logisAttrContents.length; x++) {
            if(x == logisAttrContents.length-1) {
                logisAttr = logisAttr + logisAttrContents[x].value;
            }else {
                logisAttr = logisAttr + logisAttrContents[x].value+',';
            }
        }
    	for(var i=0;i<trObj.length;i++){
    		 var obj = new Object();
    		 obj.id =  $.trim(trObj.eq(i).find('td').eq(1).find('div').text());//id
    		 obj.storeAcctId =  $.trim(trObj.eq(i).find('td').eq(2).find('div').text());//店铺id
    		 obj.storeAcct =  $.trim(trObj.eq(i).find('td').eq(3).find('div').text());//店铺名称
    		 obj.itemId =  $.trim(trObj.eq(i).find('td').eq(4).find('div').text());//itemId\
             obj.newGroups = logisAttr;
    		 var checkStat = trObj.eq(i).find('td').eq(0).find('div').find('input').is(":checked");
			 //修改选中商品
    		 if(checkStat){
                 arr.push(obj)
    		 }
    	}
        if(arr==null ||arr.length==0){
            layer.msg("没有可以修改的商品！");
            return;
        }
        $.ajax({
            beforeSend: function(){
                loading.show();
             },
            type: "POST",
            url: ctx + '/batchOperation/addNewGroup',
            data: JSON.stringify(arr),
            contentType:'application/json',
            async: true,
            dataType: "json",
            success: function (data) {
                    var trObj =  $('#smtModifyGroupsTable').next().find('.layui-table-body tbody').find('tr');
                    for(var i=0;i<trObj.length;i++){
                        var smt_itemid = trObj.eq(i).find('td').eq(4).find('div').text();
                        var msg = data.data[smt_itemid];
                        if(msg != undefined){
                            if(msg == "修改成功"){
                                trObj.eq(i).find('td').eq(8).find('.layui-table-cell').html("<div style='color:green'>" + msg + "</div>");
                            }else{
                                trObj.eq(i).find('td').eq(8).find('.layui-table-cell').html("<div style='color:red;posion: relative' class='errordata'>" + msg + "</div>");
                                trObj.eq(i).find('td').eq(8).find('.layui-table-cell').append("<textarea class='layui-hide'>"+msg+"</textarea>");
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
    })

    // 初始化
    smt_modifyGroup_log_tableApi()
    // 下载模板
    $('#smt_modifyGroup_export').click(function(){
        window.location.href = ctx + '/static/templet/smtModifyGroupId.xlsx'
    })

    // 刷新列表
    $('#smt_modifyGroup_refreshResult').click(function(){
        smt_modifyGroup_log_tableApi()
    })
    
    // 上传excel
    upload.render({
        elem: "#smt_modifyGroup_uplaod", //绑定元素
        url: "/lms/aliexpressOnlineOperateController/modifyGroupIdByExcel", //上传接口
        contentType: "multipart/form-data",
        accept: 'file',
        done: function (res) {
            //上传完毕回调
            if(res.code=='0000'){
                layer.msg(res.msg||'操作成功', { icon: 1 });
                let tableData=[{
                    createTime:new Date().getTime(),
                    creator:localStorage.getItem('lmsAppUserName'),
                    result:"上传成功，操作中，稍后请点击刷新按钮",
                }].concat()
                if(table.cache.smt_modifyGroup_log_table_id &&table.cache.smt_modifyGroup_log_table_id.length){
                    tableData = tableData.concat(table.cache.smt_modifyGroup_log_table_id)
                }
                smt_modifyGroup_log_tableRender(tableData)
            }else{
                layer.msg(res.msg||'操作失败', { icon: 2 });
            }
        },
        error: function (err) {
            //请求异常回调
            layer.msg(err, { icon: 2 });
        },
        });
   
    function smt_modifyGroup_log_tableApi(){
        commonReturnPromise({
            url: '/lms/taskCenter/query',
            type: 'post',
            contentType: 'application/json',
            params:JSON.stringify({businessType:'smt在线商品导入Excel修改分组'})
        }).then(res=>{
            smt_modifyGroup_log_tableRender(res)
        })
    }

    function smt_modifyGroup_log_tableRender(data){
        table.render({
            elem: "#smt_modifyGroup_log_table",
            id: "smt_modifyGroup_log_table_id",
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
                { title: "失败文件", field: "filePath",toolbar: "#smt_modifyGroup_filePath",},
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
})