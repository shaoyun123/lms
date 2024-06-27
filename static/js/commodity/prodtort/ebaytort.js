layui.use(['admin', 'form', 'table', 'laydate', 'upload', 'jquery','formSelects'], function() {
	var $ = layui.$,
		layer = layui.layer,
		laydate = layui.laydate,
		table = layui.table,
		formSelects = layui.formSelects,
		form = layui.form;
      form.render();
      render_hp_orgs_users("#ebayTortSearchForm"); //渲染部门销售员店铺三级联动



    $(function() {
		//侵权类型
		listAllTortType();
        //eBay店铺
		listEbayAcct();
		//产品归属人
		listProdOwner();

	});

	//表格渲染结果
	//展示已知数据
	table.render({
		elem: "#ebayTortTable",
		method: 'post',
		url: ctx + "/tort/ebayTortMsgPage.html",
		cols: [
			[
                { checkbox: true, width: 30 },
                //标题栏
				{
					title: '缩略图',
					toolbar: '#ebayTortImageBar',
					width: 75
				},
				{
					title: 'itemId',
					toolbar: '#ebayTortItemIdBar',
				},
				{
					field: "storeAcct",
					title: "店铺",
				},
				{
					field: "storePSku",
					title: "店铺父sku",
				},
				{
					field: "pSku",
					title: "商品父sku",
					templet: '#ebay_sync_tort_tpl'
				},
				{
					field: "prodOwner",
					title: "产品归属人",
				},
				{
					field: "tortTypeName",
					title: "侵权类型",
				},
                {
                    field: "tortBrand",
                    title: "侵权品牌",
                },
				{
					field: "complainant",
					title: "投诉人",
				},
				{
					title: '时间',
					toolbar: '#ebayTortTimeBar',
					width:'10%',
				},
				{
					field: "customerSrvNote",
					title: "客服备注",
				},
				{
					title: '开发建议',
					toolbar: '#ebayTortDeveAdviceBar',
				},
				{
					title: '销售处理',
					toolbar: '#ebayTortSaleOperBar',
				},
				{
					title: '操作',
					align: 'center',
					toolbar: '#ebayTortOperBar'
				}
			],
		],
		page: true,
		id: "ebayTortMsgTable",
		limits: [20, 50, 100],
		limit: 50,
		done: function(res, curr, count) {
			$("#ebayTortNumSp").html(count);
			//表头固定
			$('#ebayTortTable').next('.layui-table-view').find('.layui-table-header').addClass('toFixedContain')
			imageLazyload();
		}
	});
	//同时绑定多个
	laydate.render({
		elem: '#ebayTortStartTime'
	});
	laydate.render({
		elem: '#ebayTortEndTime'
	});

	var active = {
		//搜索
		reload: function() {
			// debugger;
			var storeAcctIds = '';
			var currentStoreAccts = formSelects.value("ebayTortSearchAcctSel", "val"); //所选店铺
			if (currentStoreAccts == null || currentStoreAccts.length < 1) { //没有选择店铺
				var acctIds = $("#ebayTortSearchAcctSel").attr("acct_ids");
				if (acctIds && acctIds.length > 1) {
					storeAcctIds = acctIds;
				} else {
					storeAcctIds = 99999;
				}
			} else {
				storeAcctIds = currentStoreAccts.join(","); //选择的店铺
			}
			table.reload('ebayTortMsgTable', {
				page: {
					curr: 1
				},
				where: {
					tortType: $("#ebayTortSearchForm #ebayTortTypeSearchSel").val(),
					// storeAcctId: $("#ebayTortSearchForm #ebayTortSearchAcctSel").val(),
					storeAcctIds: storeAcctIds,
					bizzOwnerId: $("#ebayTortSearchForm #ebayTortSearchOwnerIdSel").val(),
					devProcStatus: $("#ebayTortSearchForm #ebayTortSearchDevProcSel").val(),
					sellerProcStatus: $("#ebayTortSearchForm #ebayTortSearchSellProcSel").val(),
					emailStartTime: $.trim($("#ebayTortSearchForm #ebayTortStartTime").val()),
					emailEndTime: $.trim($("#ebayTortSearchForm #ebayTortEndTime").val()),
					searchType: $("#ebayTortSearchForm #ebayTortSearchTypeSel").val(),
                    syncTortBrand: $("#ebayTortSearchForm #ebaySyncTortSel").val(),
					searchVal: $.trim($("#ebayTortSearchForm #ebayTortSearchVal").val()),
				}
			});
		}
	};

	$("#ebayTortSearchBtn").on('click', function() {
		var type = $(this).data('type');
		active[type] ? active[type].call(this) : '';
	});
	$('#ebayTortResetBtn').on('click', function(e){
		$('#ebayTortSearchDepartSel').next().find('dd[lay-value=""]').trigger('click');
	});

	// 开发建议 - 批量
	$('#devSuggestBatch').click(function() {
		var ids = '';
		var trObj = table.checkStatus('ebayTortMsgTable');
		for (var i = 0; i < trObj.data.length; i++) {
			ids += ',' + trObj.data[i].id;
		}
		if (ids.length < 1) {
			layer.msg("未选中商品");
			return;
		}
		layer.open({
			title: '开发建议',
			type: 1,
			area: ["600px", "300px"],
			id: 'ebayTortDevSuggestBatchLayerSuccess',
			content: $('#ebayTortDevSuggestLayer').html(),
			success: function (layero, index) {
				$("#ebayTortDevSuggestForm input[name='id']").val(ids);
				form.render('radio');
			},
			end: function () {
				$("#ebayTortDevSuggestForm").trigger('reset');
			},
			btn: ['保存', '关闭'],
			yes: function (index, layero) {
				$("#submitEbayTortDevSuggest").click();
			}
		})
	});
	// 销售处理 - 批量
	$('#saleHandleBatch').click(function() {
		var ids = '';
		var trObj = table.checkStatus('ebayTortMsgTable');
		for (var i = 0; i < trObj.data.length; i++) {
			ids += ',' + trObj.data[i].id;
		}
		if (ids.length < 1) {
			layer.msg("未选中商品");
			return;
		}
		layer.open({
			title: '销售处理',
			type: 1,
			area: ["600px", "300px"],
			id: 'ebayTortSaleHandleBatchLayerSuccess',
			content: $('#ebayTortSaleHandleLayer').html(),
			success: function (layero, index) {
				$("#ebayTortSaleHandleForm input[name='id']").val(ids);
				form.render('radio');
			},
			end: function () {
				$("#ebayTortSaleHandleForm").trigger('reset');
			},
			btn: ['保存', '关闭'],
			yes: function (index, layero) {
				$("#submitEbaySaleHandleSuggest").click();
			}
		})
	});

	// 新增侵权弹出框
	$('#addEbayTortMsg').click(function() {
		layer.open({
			title: '增加侵权',
			type: 1, //不加该属性,就会出现[object Object]
			area: ['800px', 'auto'],
			id: 'addEbayTortMsgSuccess',
			content: $('#addEbayTortLayer').html(),
			success: function(layero, index) {
                $("#addEbayTortTypeSel").html('<option value="">请选择</option>');
                $(ebay_tort_tort_data).each(function() {
                    $("#addEbayTortTypeSel").append("<option value='" + this.id + "'>" + this.name + "</option>");
                });
                $("#addEbayTortStoreAcctSel").html('<option value="">请选择</option>');
                $(ebay_tort_ebay_acct).each(function() {
                    $("#addEbayTortStoreAcctSel").append("<option value='" + this.id + "'>" + this.storeAcct + "</option>");
                });
                $("#addEbayTortOwnerIdSel").html('<option value="">请选择</option>');
                $(ebay_tort_prod_owner).each(function() {
                    $("#addEbayTortOwnerIdSel").append("<option value='" + this.id + "'>" + this.userName + "</option>");
                });
                /**
                 * item id查询事件
                 */
                $("#addEbayTortSyncInfoBtn").click(function() {
                    var itemId = $.trim($("#addEbayTortForm input[name='itemId']").val());
                    if(itemId==null||itemId==''){
                        layer.msg("itemId不能为空",{icon:0});
                        return false;
                    }
                    $.ajax({
                        type: "post",
                        url: ctx + "/tort/getSyncInfoByItemId.html",
                        data: {"itemId": itemId},
                        dataType: "json",
                        success: function(returnData) {
                            if(returnData.code == "0000") {
                                var obj = returnData.data;
                                $("#addEbayTortForm input[name='storePSku']").val(obj.storePSku);
                                $("#addEbayTortForm input[name='pSku']").val(obj.pSku);
                                $("#addEbayTortForm input[name='imgUri']").val(obj.imgUri);
                                $("#addEbayTortForm #addEbayTortStoreAcctSel").val(obj.storeAcctId);
                                $("#addEbayTortForm #addEbayTortOwnerIdSel").val(obj.bizzOwnerId);
                                form.render();
                            } else {
                                layer.msg(returnData.msg);
                            }
                        }
                    });
                    return false;
                })
				form.render('select');
				laydate.render({
					elem: "#addEbayTortEmatilTime",
					type: 'datetime',
				});
			},
			end: function() {
				$("#addEbayTortForm").trigger('reset');
			},
			btn: ['保存', '关闭'],
			yes: function(index, layero) {
				var obj={};
                obj.itemId=$.trim($("#ebay_tort_itemId").val());
                obj.storeAcctId=$.trim($("#addEbayTortStoreAcctSel").val());
                obj.bizzOwnerId=$.trim($("#addEbayTortOwnerIdSel").val());
                obj.storePSku=$.trim($("#ebay_tort_storePSku").val());
                obj.pSku=$.trim($("#ebay_tort_pSku").val());
                obj.tortType=$.trim($("#addEbayTortTypeSel").val());
                obj.tortBrand=$.trim($("#ebay_tort_brand").val());
                obj.imgUri=$.trim($("#ebay_tort_imgUri").val());
                obj.complainant=$.trim($("#ebay_tort_complainant").val());
                obj.emailTime=$.trim($("#addEbayTortEmatilTime").val());
                obj.customerSrvNote=$.trim($("#ebay_tort_customerSrvNote").val());
                obj.emailContent=$.trim($("#ebay_tort_emailContent").val());
                if(obj.itemId==null|| obj.itemId==''){
                    layer.msg("Item ID不能为空");
                    return false;
                }else{
                    var reg=/^[1-9]\d*$/;
                    if(!reg.test(obj.itemId)){
                        layer.msg("Item ID格式不正确");
                        return false;
                    }else{
                        layer.load(1);
                        $.ajax({
                            url: ctx + "/tort/addEbayTortMsg.html",
                            dataType: "json",
                            type: "post",
                            data: obj,
                            success: function(returnData) {
                                if(returnData.code == "0000") {
                                    layer.closeAll();
                                    layer.msg("新增侵权成功");
                                    active['reload'].call();
                                } else {
                                    layer.msg(returnData.msg);
                                }
                            },
                            error: function() {
                                layer.msg("发送请求失败");
                            }
                        })
                    }
                }
			}
		})
	})

    //批量修改侵权类型
    $('#updateEbayTortType').click(function() {
        var layer = layui.layer,
            $ = layui.$;
        var ids = [];
		var trObj = table.checkStatus('ebayTortMsgTable');
		for (var i = 0; i < trObj.data.length; i++) {
			ids.push(trObj.data[i].id);
		}
        if(ids.length<1){
            layer.msg("未选中商品");
            return;
        }
        layer.open({
            type: 1,
            title: '修改侵权类型',
            // id: 'updateEbayTortTypeLayer',
            area:['800px', '600px'],
            btn: ['保存', '关闭'],
            content: $('#updateEbayTortTypeLayer').html(),
            success: function(layero, index) {
                $("#updateEbayTortTypeSel").html('<option value="">请选择</option>');
                $(ebay_tort_tort_data).each(function() {
                    $("#updateEbayTortTypeSel").append("<option value='" + this.id + "'>" + this.name + "</option>");
                });
                form.render('select');
            },
            yes: function(index, layero){
                var tortType =$.trim($("#updateEbayTortTypeSel").val());
                if(tortType){
				} else{
                    layer.msg("侵权类型不能为空");
                    return;
                }
                layui.admin.load.show();
                $.ajax({
                    type:"post",
                    url: ctx + "/tort/updateEbayTortType.html",
                    dataType:"json",
                    data:{
                        ids:ids.join(","),
                        tortType:tortType
                    },
                    success:function(returnData){
                        layui.admin.load.hide();
                        if(returnData.code != "0000"){
                            layer.msg(returnData.msg);
                        }else{
                            layer.closeAll();
                            layer.msg('修改成功');
                            active['reload'].call();
                        }
                    }
                });
            }
        })
    })

	//工具条的监听事件,table.on(tool(表格的lay-filter的值))
	table.on('tool(ebayTortTable)', function(obj) {
		var data = obj.data, //获得当前行数据
			layEvent = obj.event; //获得 lay-event 对应的值
		var id = data.id;
		if(layEvent === 'detail') {
			var index = layer.open({
				type: 1,
				title: "修改侵权",
				id: 'editEbayTortLayerSuccess',
				area: ["800px", "auto"],
				content: $("#editEbayTortLayer").html(),
				success: function(layero, index) {
                    $("#editEbayTortForm input[name='id']").val(id);
                    $("#editEbayTortTypeSel").html('<option value="">请选择</option>');
                    $(ebay_tort_tort_data).each(function() {
                        $("#editEbayTortTypeSel").append("<option value='" + this.id + "'>" + this.name + "</option>");
                    });
                    $("#editEbayTortStoreAcctSel").html('<option value="">请选择</option>');
                    $(ebay_tort_ebay_acct).each(function() {
                        $("#editEbayTortStoreAcctSel").append("<option value='" + this.id + "'>" + this.storeAcct + "</option>");
                    });
                    $("#editEbayTortOwnerIdSel").html('<option value="">请选择</option>');
                    $(ebay_tort_prod_owner).each(function() {
                        $("#editEbayTortOwnerIdSel").append("<option value='" + this.id + "'>" + this.userName + "</option>");
                    });
                    /**显示详情*/
                    $.ajax({
                        type: "post",
                        url: ctx + '/tort/getEbayTortById.html',
                        data: {"id": id},
                        dataType: "json",
                        async: false,
                        success: function(returnData) {
                            if(returnData.code == "0000") {
                                var obj = returnData.data;
                                $("#editEbayTortForm input[name='itemId']").val(obj.itemId);
                                $("#editEbayTortForm input[name='storePSku']").val(obj.storePSku);
                                $("#editEbayTortForm input[name='pSku']").val(obj.pSku);
                                $("#editEbayTortForm input[name='tortBrand']").val(obj.tortBrand);
                                $("#editEbayTortForm input[name='complainant']").val(obj.complainant);
                                $("#editEbayTortForm input[name='imgUri']").val(obj.imgUri);
                                $("#editEbayTortForm input[name='emailTime']").val(Format(obj.emailTime, "yyyy-MM-dd hh:mm:ss"));
                                $("#editEbayTortForm #editEbayTortStoreAcctSel").val(obj.storeAcctId);
                                $("#editEbayTortForm #editEbayTortOwnerIdSel").val(obj.bizzOwnerId);
                                $("#editEbayTortForm #editEbayTortTypeSel").val(obj.tortType);
                                $("#editEbayTortForm textarea[name='customerSrvNote']").val(obj.customerSrvNote);
                                $("#editEbayTortForm textarea[name='emailContent']").val(obj.emailContent);
                                form.render();
                            } else {
                                layer.msg(returnData.msg);
                            }
                        }
                    });
					form.render('select');
					laydate.render({
						elem: "#editEbayTortEmatilTime",
						type: 'datetime',
					});
				},
				end: function() {
					$("#editEbayTortForm").trigger('reset');
				},
				btn: ['保存', '关闭'],
				yes: function(index, layero) {
					$("#submitEditEbayTortMsgBtn").click();
				}
			});
		} else if(layEvent === 'devSuggest') {
			var index = layer.open({
				type: 1,
				title: "开发建议",
				id:'ebayTortDevSuggestLayerSuccess',
				area: ["600px", "300px"],
				content: $("#ebayTortDevSuggestLayer").html(),
				success: function(){
                    $("#ebayTortDevSuggestForm input[name='id']").val(id);
				},
				end: function() {
					$("#ebayTortDevSuggestForm").trigger('reset');
				},
				btn: ['提交', '关闭'],
				yes: function(index, layero) {
					$("#submitEbayTortDevSuggest").click();
				}
			});
		} else if(layEvent === 'saleHandle') {
			var index = layer.open({
				type: 1,
				title: "销售处理",
				id:'ebayTortSaleHandleLayerSuccess',
				area: ["600px", "300px"],
				content: $("#ebayTortSaleHandleLayer").html(),
				success: function(){
                    $("#ebayTortSaleHandleForm input[name='id']").val(id);
                    form.render('radio');
				},
				end: function() {
					$("#ebayTortSaleHandleForm").trigger('reset');
				},
				btn: ['提交', '关闭'],
				yes: function(index, layero) {
					$("#submitEbaySaleHandleSuggest").click();
				}
			});
		} else if(layEvent === 'syncTort') {
            layer.confirm('确定同步该条数据吗？', {
                btn: ['确定','取消'], //按钮
                shade: false //不显示遮罩
            }, function(index){
                var id = data.id;
                var tortTypeName = data.tortTypeName;
                var cateId = data.cateId;
                var pCateIds = data.pCateIds;
                var cnName = data.cnName;
                var enName = data.enName;
                var syncTortBrandStatus = true;//同步
                $.ajax({
                    type: "POST",
                    url: ctx + "/tort/syncTortBrand.html",
                    data: {
                    	id: id,
						syncTortBrand : syncTortBrandStatus,
						tortTypeName:tortTypeName,
						cnName:cnName,
						enName:enName,
						cateId:cateId,
						pCateIds:pCateIds
					},
                    async: false,
                    dataType: "json",
                    success: function (returnData) {
                        if (returnData.code == "0000") {
                            $("#ebayTortSearchBtn").trigger('click');
                            layer.msg("同步成功");
                        } else {
                            layer.msg(returnData.msg);
                        }
                    },
                    error: function () {
                        layer.msg("服务器正忙");
                    }
                });
            });
        }
	})

	//修改的查询按钮
	$("#editEbayTortSyncInfoBtn").click(function() {
		var itemId = $.trim($("#editEbayTortForm input[name='itemId']").val());
		$.ajax({
			type: "post",
			url: ctx + "/tort/getSyncInfoByItemId.html",
			data: {
				"itemId": itemId
			},
			dataType: "json",
			success: function(returnData) {
				if(returnData.code == "0000") {
					var obj = returnData.data;
					$("#editEbayTortForm input[name='storePSku']").val(obj.storePSku);
					$("#editEbayTortForm input[name='pSku']").val(obj.pSku);
					$("#editEbayTortForm input[name='imgUri']").val(obj.imgUri);
					$("#editEbayTortForm #editEbayTortStoreAcctSel").val(obj.storeAcctId);
					$("#editEbayTortForm #editEbayTortOwnerIdSel").val(obj.bizzOwnerId);
					form.render();
				} else {
					layer.msg(returnData.msg);
				}
			}
		});
		return false;
	})

    //修改侵权
	form.on('submit(submitEditEbayTortMsg)', function(data) {
		$.ajax({
			type: "post",
			url: ctx + "/tort/editEbayTortMsg.html",
			dataType: "json",
			data: data.field,
			success: function(returnData) {
				if(returnData.code == "0000") {
					layer.closeAll();
					active['reload'].call();
					layer.msg("修改侵权成功");
				} else {
					layer.msg(returnData.msg);
				}
			},
			error: function() {
				layer.msg("发送请求失败");
			}
		})
		return false;
	});

	//开发建议
	form.on('submit(ebayTortDevSug)', function(data) {
		$.ajax({
			type: "post",
			url: ctx + "/tort/ebayTortDevSuggest.html",
			dataType: "json",
			data: data.field,
			success: function(returnData) {
				if(returnData.code == "0000") {
					layer.closeAll();
					active['reload'].call();
					layer.msg("建议提交成功");
				} else {
					layer.msg(returnData.msg);
				}
			},
			error: function() {
				layer.msg("发送请求失败");
			}
		})
		return false;
	});

	//销售处理
	form.on('submit(ebayTortSaleHandle)', function(data) {
		$.ajax({
			type: "post",
			url: ctx + "/tort/ebayTortSaleHandle.html",
			dataType: "json",
			data: data.field,
			success: function(returnData) {
				if(returnData.code == "0000") {
					layer.closeAll();
					active['reload'].call();
					layer.msg("处理提交成功");
				} else {
					layer.msg(returnData.msg);
				}
			},
			error: function() {
				layer.msg("发送请求失败");
			}
		})
		return false;
	});

    /**
	 * 列取所有的ebay侵权类型
     */
    var ebay_tort_tort_data={};
	function listAllTortType() {
        $("#ebayTortTypeSearchSel").html('<option value="">请选择</option>');
		$.ajax({
			type: "post",
			url: ctx + "/tort/ebayTortTypeList.html",
			dataType: "json",
			success: function(returnData) {
				if(returnData.code == "0000") {
                    ebay_tort_tort_data=returnData.data;
					$(returnData.data).each(function() {
						$("#ebayTortSearchForm #ebayTortTypeSearchSel").append("<option value='" + this.id + "'>" + this.name + "</option>");
					});
					form.render();
				} else {
					layer.msg(returnData.msg);
				}
			}
		})
	}

    /**
	 * 列取所有的ebay店铺
     */
    var ebay_tort_ebay_acct={};
	function listEbayAcct() {
		// $("#ebayTortSearchAcctSel").html('<option value="">请选择</option>');
		$.ajax({
			type: "post",
			url: ctx + "/salesplat/listAcctByPlatCode.html",
			data: {
				"platCode": "ebay"
			},
			dataType: "json",
			success: function(returnData) {
				if(returnData.code == "0000") {
                    ebay_tort_ebay_acct=returnData.data;
					$(returnData.data).each(function() {
						// $("#ebayTortSearchAcctSel").append("<option value='" + this.id + "'>" + this.storeAcct + "</option>");
					});
					form.render();
				} else {
					layer.msg(returnData.msg);
				}
			}
		})
	}
    /**
	 * 列取所有的产品归属人
     */
    var ebay_tort_prod_owner={};
	function listProdOwner() {
		$("#ebayTortSearchOwnerIdSel").html('<option value="">请选择</option>');
		$.ajax({
			type: "post",
			url: ctx + "/sys/prodOwnerList.html",
			dataType: "json",
			success: function(returnData) {
				if(returnData.code == "0000") {
                    ebay_tort_prod_owner=returnData.data;
					$(returnData.data).each(function() {
						$("#ebayTortSearchForm #ebayTortSearchOwnerIdSel").append("<option value='" + this.id + "'>" + this.userName + "</option>");
					});
					form.render();
				} else {
					layer.msg(returnData.msg);
				}
			}
		})
	}

});

