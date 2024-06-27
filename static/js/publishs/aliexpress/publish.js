console.log("aep");
layui.use(['admin', 'form', 'laydate', 'table', 'formSelects', 'layCascader'], function() {
	var $ = layui.$,
		admin = layui.admin,
		element = layui.element,
		table = layui.table,
		laydate = layui.laydate,
		formSelects = layui.formSelects,
		layCascader = layui.layCascader,
		form = layui.form;
	smtShowCateCascader();
	function smtShowCateCascader() {
		commonReturnPromise({
			url: ctx + "/prodcate/listCategoryTree",
		}).then(res => {
			layCascader({
				elem: '#aep_productCates',
				clearable: true,
				filterable: true,
				collapseTags: true,
				// minCollapseTagsNumber: 2,
				options: res,
				props:{
					multiple: true,
					label: 'title',
					value: 'value',
					children: 'data',
					// checkStrictly: true
				}
			});
		}).catch(err => {
			layer.msg(err, { icon: 2 });
		})
	}
		//渲染类目多选
		//选择分类弹框
		$('#aep_selectCateBtn').click(function() {
			admin.itemCat_select('layer-publishs-smt-publish', 'aep_cateId', 'aep_cateDiv')
		});
		
	formSelects.render();
  form.render(null, 'component-form-element');
  element.render('breadcrumb', 'breadcrumb');
	form.render();

    //初始化模板速卖通标签
    var prodAliexpressTags = [];
    var logisAttrs = [];
	initProdTag();
    initProdAliexpressTag();
	initLogisAttrSelect();
	initstaticData();
    
	//默认选中
	formSelects.value('aep_isSales', [2, 1] ,true);
	formSelects.value('aep_imgStatusList', [1, 2] ,true);

    form.on('submit(component-form-element)', function(data) {
        layer.msg(JSON.stringify(data.field));
        return false;
    });
	$("#aep_searchForm select[name=salePersonId]").change(function(){
		var salePersonId = $(this).val();
		$.ajax({
			type:"post",
			url: ctx + "/aliexpresslisting/listdevelopuser.html",
			dataType:"json",
			data:{salePersonId:salePersonId},
			success:function(returnData){
				var str = "<option value=''></option>";
				for(var i=0; i<returnData.data.length; i++){
					str += "<option value='"+returnData.data[i].id+"'>"+returnData.data[i].loginName+"</option>";
				}
				$("#aep_searchForm select[name=bizzOwnerId]").html(str);
				form.render("select");
			}
		});
	});
	$("#aep_searchForm select[name=salePersonId]").trigger("change");
	render_hp_orgs_users("#aep_searchForm");

	//重置的时候处理三级联动
    $('#smt_button_reset').on('click', function(){
        $('#smt_publish_organization').next().find('dd[lay-value=""]').trigger('click');
    })
	
	function getSearchData(){
		var data = {};
		data.orgId = $("#aep_searchForm select[name=orgId]").val();
		data.salePersonId = $("#aep_searchForm select[name=salePersonId]").val();
		data.storeAcctId = $("#aep_searchForm select[name=storeAcctId]").val();
		data.bizzOwnerId = $("#aep_searchForm select[name=bizzOwnerId]").val();
		data.devType = $("#aep_searchForm select[name=devType]").val();
		data.isSmtTort = $("#aep_searchForm select[name=isSmtTort]").val();
		data.isProhibit = $("#aep_searchForm select[name=isProhibit]").val();
		// data.cateId = $("#aep_searchForm input[name=cateId]").val();
		data.cateIds = JSON.parse($('#aep_productCates').val() || '[]').join(',');
		data.isListing = $("#aep_searchForm select[name=isListing]").val();
		data.isUpStandard = $("#aep_searchForm select[name=isUpStandard]").val();
		data.minWeight = $("#aep_searchForm input[name=minWeight]").val();
		data.maxWeight = $("#aep_searchForm input[name=maxWeight]").val();
		data.minSalePrice = $("#aep_searchForm input[name=minSalePrice]").val();
		data.maxSalePrice = $("#aep_searchForm input[name=maxSalePrice]").val();
		//多选
		data.isSales = formSelects.value("aep_isSales","val").length > 0 ? formSelects.value("aep_isSales","val").join(",") : undefined;
		data.imgStatusList = formSelects.value("aep_imgStatusList","val").length > 0 ? formSelects.value("aep_imgStatusList","val").join(",") : undefined;
		data.selfImgStatusList = formSelects.value("aep_selfImgStatusList","val").length > 0 ? formSelects.value("aep_selfImgStatusList","val").join(",") : '';
		//特殊参数处理
		data.pSku = "";
		data.sSku = "";
		data.cnTitle = "";
		data.enTitle = "";
		var searchType = $("#aep_searchForm select[name=searchType]").val();
		var searchValue = $("#aep_searchForm input[name=searchValue]").val();
		data[searchType] = searchValue;
		data.isExactQuery = $("#aep_searchForm input[name=isExactQuery]").prop("checked");
		//自拍图日期
		var selfPortraitTimeStr = $("#aep_searchForm input[name=selfPortraitTime]").val();
		data.selfPortraitTime1 =  "";
		data.selfPortraitTime2 = "";
		if(selfPortraitTimeStr) {
				data.selfPortraitTime1 = Date.parse(selfPortraitTimeStr.split(" - ")[0] + " 00:00:00");
				data.selfPortraitTime2 = Date.parse(selfPortraitTimeStr.split(" - ")[1] + " 23:59:59");
		}
		//审核日期
		var auditTimeStr = $("#aep_searchForm input[name=auditTime]").val();
		data.auditTime1 =  "";
		data.auditTime2 = "";
		if(auditTimeStr) {
				data.auditTime1 = Date.parse(auditTimeStr.split(" - ")[0] + " 00:00:00");
				data.auditTime2 = Date.parse(auditTimeStr.split(" - ")[1] + " 23:59:59");
		}
		//可刊登时间
		data.selfPortraitTime1 =  "";
		data.selfPortraitTime2 = "";
		data.auditTime1 =  "";
		data.auditTime2 = "";
		data.smtPublishAbleTime1 =  "";
		data.smtPublishAbleTime2 = "";
		var searchTimeType = $("#aep_searchForm select[name=searchTimeType]").val();
		var searchTimeStr = $("#aep_searchForm input[name=searchTime]").val();
		if(searchTimeType && searchTimeStr){
			data[searchTimeType+"1"] = Date.parse(searchTimeStr.split(" - ")[0] + " 00:00:00");
			data[searchTimeType+"2"] = Date.parse(searchTimeStr.split(" - ")[1] + " 23:59:59");
		}
		// 预计可用库存含在途/不含在途
		data.preAvailableStockType = $("#aep_searchForm select[name=preAvailableStockType]").val();
		data.preAvailableAllSku =$("#aep_searchForm select[name=preAvailableAllSku]").val();
		data.preAvailableStockMin = $("#aep_searchForm input[name=preAvailableStockMin]").val();
		data.preAvailableStockMax = $("#aep_searchForm input[name=preAvailableStockMax]").val();
		//标签
		var prodAliexpressTags = []
		$("#aep_searchTagForm input[name=prodAliexpressTag]:checked").each(function(){
			prodAliexpressTags.push($(this).val());
		});
		data.prodAliexpressTags = prodAliexpressTags.join(",");
		//排序
		data.orderBy = $("#aep_searchForm select[name=order]").val();
		//物流属性
		data.logisticsType = $("#aep_searchForm select[name=logisticsType]").val();
		var logisAttrs = [];
		var logisAttrContents = formSelects.value("aep_logisticsSelect");
        for(var i = 0; i < logisAttrContents.length; i++) {
            var logisAttr = logisAttrContents[i].val;
            logisAttrs.push(logisAttr);
        }
        data.logisAttrs = logisAttrs.join(",");
        // //是否美工评分
        // data.isAdScore = $("#aep_searchForm select[name=isAdScore]").val();
				// 是否大货
				data.smtBigProduct =  $("#aep_searchForm select[name=smtBigProduct]").val();
		//商品标签
		data.prodAttrList = $("#aep_searchForm select[name=prodAttrList]").val();
		// 销量
		const salesType =  $("#aep_searchForm select[name=salesType]").val();
		if(salesType==='1'){
			data.salesMin
			data.minSmtSalesNum =  $("#aep_searchForm input[name=salesMin]").val();
			data.maxSmtSalesNum =  $("#aep_searchForm input[name=salesMax]").val();
			// if((data.minSmtSalesNum ==='' && data.maxSmtSalesNum !=='') || (data.minSmtSalesNum !=='' && data.maxSmtSalesNum ==='')) return '请将销量填写完整'
		}else if(salesType==='2'){
			data.minTotalSalesNum =  $("#aep_searchForm input[name=salesMin]").val();
			data.maxTotalSalesNum =  $("#aep_searchForm input[name=salesMax]").val();
			// if((data.minTotalSalesNum ==='' && data.maxTotalSalesNum !=='') || (data.minTotalSalesNum !=='' && data.maxTotalSalesNum ==='')) return '请将销量填写完整'
		}else if(salesType==='3'){
			data.minAeFullManagedThirtySalesNum =  $("#aep_searchForm input[name=salesMin]").val();
			data.maxAeFullManagedThirtySalesNum =  $("#aep_searchForm input[name=salesMax]").val();
			// if((data.minAeFullManagedThirtySalesNum ==='' && data.maxAeFullManagedThirtySalesNum !=='') || (data.minAeFullManagedThirtySalesNum !=='' && data.maxAeFullManagedThirtySalesNum ==='')) return '请将销量填写完整'
		}
		data.isAvailableVideo=$("#aep_searchForm select[name=isAvailableVideo]").val()  // 可用视频
		return data;
	}
	//重新搜索
	$("#aep_searchBtn").click(function(){
        var searchData = getSearchData();
				if(typeof searchData ==='string') return layer.msg(searchData)
        if (searchData.storeAcctId == null || searchData.storeAcctId == '') {
            layer.msg('请选择一个店铺', {icon: 0});
            return false;
        }
		table.render({
	        elem: '#aep_table',
	        method:'post',
	        url: ctx + '/aliexpresslisting/list.html', //数据接口
	        where:searchData,
	        title: '刊登管理表',
	        page: true, //开启分页
	        toolbar: false, //开启工具栏，此处显示默认图标，可以自定义模板，详见文档
	        totalRow: true, //开启合计行
	        cols: [
	            [ //表头
	                {
	                    type: 'checkbox'
	                }, {
	                    field: 'thumbnail',
	                    title: '缩略图',
	                    templet:'<div><img class="img_show_hide lazy b1" width="61" height="61" data-original="{{ tplIVP+d.pImg }}!size=60x60" data-onerror="layui.admin.img_noFind()"</div>',
	                    width:80
	                }, {
	                    field: 'cnTitle',
	                    title: '商品',
	                    templet:'#aep_cnTitleTpl'
	                }, {
	                    field: 'pSku',
	                    title: '父SKU',
	                    templet: function (d){
	                    	var spanDom = "";
	                    	if(d.logisAttrList){
	                    		var logisAttrList = d.logisAttrList.split(",");
	                    		for(var i=0; i< logisAttrs.length; i++){
	                    			if($.inArray(logisAttrs[i].name, logisAttrList) >= 0){
	                    				spanDom += "<span class='layui-bg-red hp-badge ml5'>"+logisAttrs[i].alias+"</span>";
	                    			}
	                    		}
	                    	}
	                    	var price = "$"+d.minSalePrice + " ~ $" + d.maxSalePrice;
	                    	return "<div>"+d.pSku+"</div>" + "<div style='color:#999;'>"+d.prodAttrList+"</div>" + "<div title='子SKU刊登价预估'>"+price+"</div><div>"+spanDom+"</div>";
                    	},
               			 width:140
	                }, {
	        			width:400,
						title: "<table border='0' class='layui-table' width='100%'><tr><th width='40%'>subSKU</th><th width='10%'>重量(g)</th><th width='10%'>成本</th><th width='30%'>预计可用库存含在途/不含在途</th><th width='10%'>在售</th></tr></table>",
						templet: "#aep_producttpl"},

					{
	                    field: 'storeNum',
	                    title: '刊登状态',
	                    width:130,
	                    templet:'#aep_storeNumTpl'
	                }, {
	                    field: 'salesNum',
	                    title: '30天销量',
	                    templet: '#aep_salesNumTpl'
	                }, {
	                    field: 'devNote',
	                    title: '开发备注',
	                    templet:'<div><pre class="aep-devNote">{{d.devNote}}</pre></div>',
              			  width:140
	                }, {
	                    field: 'saleNote',
	                    title: '销售备注',
	                    templet:'<div><pre>{{d.saleNote}}</pre><i class="layui-icon layui-icon-edit" style="color: #009688;cursor: pointer;" lay-event="aep_saleNote"></i></div>',
                			width:90
									}, {
	                    field: 'isTort',
	                    title: '侵权状态',
	                    templet:'#aep_tortTpl',
	                    width:200
	                },{
	                    field: 'time',
	                    title: '时间',
						templet:'#aep_timeTpl',
						width: 150
	                }, {
	                    field: 'operation',
	                    title: '操作',
	                    templet:'#aep_operationTpl'
	                }
	            ]
	        ],
					created: function (res) {
						if (res.code == "0000" && Array.isArray(res.data)) {
								res.data = res.data.map(item => ({
									storeAcctId: searchData.storeAcctId,
										...item
								}))
						}
				},
	        done: function(res, curr, count){
	            //懒加载
				imageLazyload();
				//固定表头
				theadHandle().fixTh({id:'#aliexpressPublishCard',h:187})
	            if (res.code == '0000') {
	                $("#aep_num").html(count);
	            }else{
	                $("#aep_num").html(0);
	            }
	        },
	        limits: [50, 100, 500],
	        limit: 50
	    });
        
	});
	$("#aep_exportBtn").click(function(){
		let searchData = getSearchData();
		if(typeof searchData ==='string') return layer.msg(searchData)
		if (searchData.storeAcctId == null || searchData.storeAcctId == '') {
			layer.msg('请选择一个店铺', {icon: 0});
			return false;
		}
		layer.msg('后台正在进行导出文件，这可能需要几分钟，请不要关闭网页',{icon:1});
		submitForm(searchData, ctx + '/aliexpresslisting/export.html')
	});

	// 当前用户刊登统计
   function initstaticData(){
	   $.ajax({
		   url:ctx+'/aliexpresslisting/mystatistics.html',
		   type:'GET',
		   dataType:'json',
		   success:function(res){
			   if(res.code=="0000"){
				   var data = res.data;
				   $('.smtstatictips').html('考核周期('+Format(data.startTime,'yyyy/MM/dd')+'-'+Format(data.endTime,'yyyy/MM/dd')+')&nbsp;&nbsp;需刊登：'+data.smtPublishAbleNum+'&nbsp;&nbsp;实际需刊登：'+data.smtRealPublishAbleNum+'&nbsp;&nbsp;覆盖还未达标：'+data.unUpstandardNum+ '&nbsp;&nbsp;时效未达标：'+data.unUpstandardNum+'&nbsp;&nbsp;近四天新增: '+data.newSmtPublishAbleNum+'&nbsp;&nbsp;覆盖未完成：'+data.newUnUpstandardNum);
			   }
		   },
		   error:function(res){

		   }
	   });
   }




	var smtPublishSearchTime = laydate.render({
		elem: '#aep_searchTime',
		range: true,
		trigger: 'click', //采用click弹出
		//range: true,//开始左右面板选择时间
		done: function(value, date, endDate) {}
	});
    
    
    
    //禁售设置
    form.on('checkbox(aep_prohibit)', function(data){
	    console.log(data);
	    var requestData = {
	        prodPId: data.value,
	        platCode: "aliexpress",
	        ifFixedInable: data.elem.checked
	    }
	  	var msg = data.elem.checked ? "禁售成功":"取消禁售成功"
	  	layui.admin.load.show();
	    $.ajax({
	        type: 'post',
	        url: ctx + '/prohibit/editOrAddProdProhibitMapping.html',
	        data: JSON.stringify(requestData),
	        contentType: 'application/json',
	        dataType: 'json',
	        success: function (res) {
	        	layui.admin.load.hide();
	            console.log(res)
	            if (res.code == '0000') {
	                layer.msg(msg, {icon:1});
	            } else {
	                layer.msg(res.msg, {icon: 5});
	                data.elem.checked = !data.elem.checked;
	                form.render("checkbox");
	                
	            }
	        }
	    })
	});
	
	table.on('tool(aep_table)', function(obj) {
        var data = obj.data, //获得当前行数据
            layEvent = obj.event; //获得 lay-event 对应的值
        var id = data.id;
        var tags = data.prodAliexpressTags;
        data.saleNote = data.saleNote ? data.saleNote:"";
        if (layEvent == "aep_saleNote") { //更新一条item
            layer.open({
		        type: 1,
		        title: '修改销售备注',
		        area: ["500px", "300px"],
		        btn: ["保存", "取消"],
		        content: '<div style="padding:20px"><textarea class="layui-textarea">' + data.saleNote + '</textarea></div>',
		        yes: function (index, layero) {
		            var saleNoteNew = $(layero).find("textarea").val();
		            layui.admin.load.show()
		            $.ajax({
		            	type:"post",
		            	url: ctx + "/aliexpresslisting/updatesalenote.html",
		            	data:{
		            		prodPId:id,
		            		saleNote:saleNoteNew
		            	},
		            	dataType:'json',
		            	success:function(returnData){
		            		layui.admin.load.hide()
		            		if(returnData.code == "0000"){
		            			layer.msg("销售备注修改成功", {icon:1});
		            			obj.update({
									saleNote:saleNoteNew
								});
		            			layer.close(index);
		            		}else{
		            			layer.msg(returnData.msg, {icon:5});
		            		}
		            	}
		            });
		            
		        }
		    });
        }else if (layEvent == "aep_editTag") { 
        	layer.open({
		        type: 1,
		        title: '编辑标签',
		        //area: ["500px", "200px"],
		        btn: ["保存", "取消"],
		        content: $("#aep_editTagTpl").html(),
		        success:function(){
		        	initEditTagForm(tags);
		        },
		        yes: function (index, layero) {
		            var tags = [];
		            $(layero).find("form input[name=prodAliexpressTag]:checked").each(function(){
		            	tags.push($(this).val());
		            });
		            layui.admin.load.show()
		            $.ajax({
		            	type:"post",
		            	url: ctx + "/aliexpresslisting/savetag.html",
		            	data:{
		            		prodPId:id,
		            		tags:tags.join(",")
		            	},
		            	dataType:'json',
		            	success:function(returnData){
		            		layui.admin.load.hide()
		            		if(returnData.code == "0000"){
		            			layer.msg("标签保存成功", {icon:1});
		            			obj.update({
									prodAliexpressTags:tags
								});
		            			layer.close(index);
		            		}else{
		            			layer.msg(returnData.msg, {icon:5});
		            		}
		            	}
		            });
		            
		        }
		    });
        }else if(layEvent == "aep_openItem") {
        	$.ajax({
        		type:"post",
        		url: ctx + "/aliexpresslisting/listitemid.html",
        		dataType:'json',
        		data:{prodPId:id},
        		success:function(returnData){
            		if(returnData.code == "0000"){
            			var itemIds = returnData.data;
            			if(itemIds.length==0){
            				return;
            			}
            			layer.confirm('确认打开'+itemIds.length+"个速卖通商品吗？", {icon:3},function(index){
            				layer.close(index);
				            for(var i=0;i<itemIds.length;i++){
				            	window.open("http://www.aliexpress.com/item/info/"+itemIds[i]+".html");
				            }
				        });
            		}else{
            			layer.msg(returnData.msg, {icon:5});
            		}
            	}
        	});
        }
    });
    
    // $("body").on("click","#smtPriceBtn", function(){
    // 	var id = $(this).attr("data-id");
		// 	const storeAcctId=$(this).attr("data-storeacctid")
    // 	layer.open({
	  //       type: 1,
	  //       title: '刊登价预估',
	  //       btn: ['关闭'],
	  //       area: ["1155px", "800px"],
	  //       content: $("#aep_smtListingPriceTpl").html(),
	  //       success: function (layero,index) {
	  //       	layui.form.render('select');
		// 				$(layero).find("input[name=prodPId]").val(id);
		// 				// 获取国家列表
		// 				aep_smtListing_getRegionCountry()
		// 				// 区域国家选中触发
		// 				aep_smtListing_isShowRegionCountry(layero)
		// 				//批量区域定价和刊登价 
		// 				aep_smtListing_batchEstimateRegionPrice(storeAcctId)
		// 				//单个国家区域定价和刊登价 
		// 				aep_smtListing_estimateRegionPrice(storeAcctId)
		// 				const formObj = serializeObject($('#aep_smtListingPrice'))
		// 				commonReturnPromise({
		// 					type:"post",
		// 					url:ctx+"/aliexpresslisting/listprice.html",
		// 					params:formObj
		// 				}).then(res=>{
		// 					let tr = "";
		// 					for(var i=0;i<res.length;i++){
		// 						let bigTag = res[i].smtBigProduct ? '<span class="layui-bg-orange hp-badge ml5" title="大货">大</span>' :''
		// 						tr+=  "<tr><td class='prodSSku'>"
		// 						+res[i].sSku+"</td><td>"
		// 						+"<input class='layui-input' name='cost' value='"
		// 						+res[i].cost+"'></td><td>"
		// 						+"<input class='layui-input' name='weight' value='"
		// 						+res[i].weight+"'></td><td class='smtVolumeWeigh'>"
		// 						+res[i].smtVolumeWeigh+"</td><td><div class='disFCenter'><div class='listingPrice'>"
		// 						+"$"+res[i].listingPrice+"</div><div class='listingPriceCny'>"
		// 						+"&yen;"+res[i].listingPriceCny+"</div></div></td><td><div class='disFCenter'><div class='finalPrice'>"
		// 						+"$"+res[i].finalPrice+"</div><div class='finalPriceCny'>"
		// 						+"&yen;"+res[i].finalPriceCny+"</div></div></td><td class='estimateProfit'>"
		// 						+'&yen;'+res[i].estimateProfit+"</td>"
		// 						+"<td><button class='layui-btn layui-btn-sm aep_upSkuPrice'>更新</button></td></tr>"
		// 					}
		// 					$("#aep_smtListingPriceTable tbody").html(tr);
		// 				})
	  //       }
	  //   });
    // });
	// 	// 获取国家列表
	// 	function aep_smtListing_getRegionCountry(){
	// 		commonReturnPromise({
	// 			url: ctx + '/aliexpress/publish/regionPriceCountry'
	// 		}).then(data => {
	// 			let str = ''
	// 			const countryList = data.map((item, index) => ({
	// 				code: Object.keys(item)[0],
	// 				name: Object.values(item)[0],
	// 				order: index + 1
	// 			}))
	// 			countryList.forEach(item => {
	// 				str += `<div class="w140">
	// 					<input type="checkbox" name="adjustPriceCountry" lay-skin="primary" 
	// 					lay-filter="aep_smtListing_checkCountry" 
	// 					value="${item.code}" title="${item.name}(${item.code})"
	// 					data-order="${item.order}" data-code="${item.code}" 
	// 					data-name="${item.name}" />
	// 				</div>`
	// 			})
	// 			$('#aep_smtListing_countryList').html(str)
	// 			form.render()
	// 		})
	// 	}

	// 	// 是否展开区域定价列表
	// 	function aep_smtListing_isShowRegionCountry(layero){
	// 		$('#aep_smtListing_country_header').click(function (obj) {
	// 			let showCountryCardDom= $('#aep_smtListing_country_header')
	// 			if (!showCountryCardDom.data('show')) {
	// 				$(layero).find('.aep-smtListing-tohideIcon').show()
	// 				$(layero).find('.aep-smtListing-toShowIcon').hide()
	// 				$('#aep_smtListing_countryList').show()
	// 				showCountryCardDom.data('show',true)
	// 			} else {
	// 				$(layero).find('.aep-smtListing-tohideIcon').hide()
	// 				$(layero).find('.aep-smtListing-toShowIcon').show()
	// 				$('#aep_smtListing_countryList').hide()
	// 				showCountryCardDom.data('show',false)
	// 			}
	// 		})
	// 	}

	// 	// 区域国家选中触发
	// 	form.on('checkbox(aep_smtListing_checkCountry)', function (obj) {
	// 		var { checked, dataset } = obj.elem
	// 		let orderArr = []
	// 		Array.from($('#aep_smtListingPriceTable').find('thead>tr>th')).forEach(item => {
	// 			orderArr.push($(item).attr('data-order') || 0)
	// 		})
	// 		// 选中按顺序添加列
	// 		if (checked) {
	// 			let th = `<th data-field="${dataset.code}" data-order="${dataset.order}" data-code="${dataset.code}"
	// 				data-name="${dataset.name}">
	// 				<div class="w200">${aep_smtListing_countryThColTpl(dataset)}</div></th>>`
	// 			let col = `<td data-field="${dataset.code}" class="taCenter" data-order="${dataset.order}">
	// 				<div class="w200">${aep_smtListing_countryTdColTpl(dataset)}</div></td>`
	// 			let _curIndex = orderArr.findIndex(item => Number(dataset.order) < Number(item))
	// 			if (_curIndex == -1) {
	// 				$('#aep_smtListingPriceTable').find('thead>tr>th').last().before(th)
	// 				$('#aep_smtListingPriceTable').find('tbody>tr').find('[data-field=result]').before(col)
	// 			} else {
	// 				$('#aep_smtListingPriceTable').find('thead>tr>th').eq(_curIndex).before(th);
	// 				$('#aep_smtListingPriceTable').find(`tbody>tr :nth-child(${_curIndex + 1})`).before(col)
	// 			}
	// 			// 取消删除
	// 		} else {
	// 			let _curIndex = orderArr.findIndex(item => Number(dataset.order) == Number(item))
	// 			if (_curIndex != -1) {
	// 				$('#aep_smtListingPriceTable').find('thead>tr>th').eq(_curIndex).remove();
	// 				$('#aep_smtListingPriceTable').find(`tbody>tr :nth-child(${_curIndex + 1})`).remove()
	// 			}
	// 		}
	// 		form.render()
	// 	})

	// 	function aep_smtListing_countryThColTpl (obj) {
	// 		let thTpl = `<div>${obj.name}(${obj.code})</div>
	// 		<div><form class="layui-form">
	// 		<select name="regionPriceFixPriceByShipType" 
	// 		lay-filter="aep_smtListing_regionPriceFixPriceByShipType">
	// 		<option value="GENERALECONOMY">普货-经济</option>
	// 		<option value="GENERALSIMPLE">普货-简易</option>
	// 		<option value="GENERALSTANDARD">普货-标准</option>
	// 		<option value="SPECIALECONOMY">特货-经济</option>
	// 		<option value="SPECIALSIMPLE">特货-简易</option>
	// 		<option value="SPECIALSTANDARD">特货-标准</option>
	// 		</select>
	// 		</form></div>
	// 		<div class="disFCenter" style="fontSize:12px;color:#888"><div>定价</div><div>刊登价</div></div>`
	// 		return thTpl
	// 	}
	// 	function aep_smtListing_countryTdColTpl (obj) {
	// 		let tdTpl = `<div class="disFCenter"
	// 		name="td_${obj.code}" data-code="${obj.code}" 
	// 		data-order="${obj.order}" data-name="${obj.name}">
	// 		<div></div>
	// 		<div></div>
	// 		</div>`
	// 		return tdTpl
	// 	}

	// 	// 批量区域定价刊登价
	// 	function aep_smtListing_batchEstimateRegionPrice(storeAcctId){
	// 		$('#aep_smtListing_batchEstimateRegionPrice').click(function () {
	// 			let params = {}
	// 			params.grossProfitRate = $("#aep_smtListingPrice").find('input[name=grossProfitRate]').val()  //折扣率
	// 			params.discountRate = $("#aep_smtListingPrice").find('input[name=discountRate]').val()   //优惠幅度
	// 			params.adjustType = $('#aep_smtListing_adjustType').val()
	// 			const tbodyTrs = $('#aep_smtListingPriceTable').find('tbody tr')
	// 			// 选中的国家
	// 			const checkedCountryDom = $('#aep_smtListing_countryList').find('input[name=adjustPriceCountry]:checked')
	// 			if (!checkedCountryDom.length) return layer.msg('请至少选择一个国家')
	// 			const countryList = []
	// 			checkedCountryDom.each(function () {
	// 				countryList.push($(this).val())
	// 			})
	// 			// price为空或为0 不添加
	// 			const skuList = []
	// 			tbodyTrs.each(function () {
	// 				const listingPrice = $(this).find('.finalPrice').text().replaceAll('$','').replaceAll('¥','')
	// 				skuList.push({
	// 					prodSSku: $(this).find('.prodSSku').text(),
	// 					storeSubSku: '',     //
	// 					countryList: countryList,
	// 					storeAcctId: Number(storeAcctId),
	// 					listingPrice: listingPrice === '' ? null : Number(listingPrice)
	// 				})
	// 			})
	// 			params.skuList = skuList
	// 			params.type = 'LISTING'
	// 			commonReturnPromise({
	// 				url: ctx + '/aliexpress/publish/regionPriceFixPrice',
	// 				type: 'post',
	// 				contentType: 'application/json;charset=UTF-8',
	// 				// 通过type的值，在线/刊登
	// 				params: JSON.stringify({ ...params })
	// 			}).then(res => {
	// 				tbodyTrs.each(function () {
	// 					var prodSSku = $(this).find('.prodSSku').text()
	// 					let curData = res.filter(item => item.sSku == prodSSku)
	// 					if (curData[0] && curData[0].countryList && curData[0].countryList.length) {
	// 						curData[0].countryList.forEach(item => {
	// 							$(this).find(`td[data-field=${item.countryCode}] div[name=td_${item.countryCode}] div:first`).html('$' + item.noCalculateDiscountRatePrice+'/' + '￥' + item.noCalculateDiscountRatePriceCny)
	// 							$(this).find(`td[data-field=${item.countryCode}] div[name=td_${item.countryCode}] div:last`).html('$' + item.price + '/' + '￥' + item.priceCny)
	// 						})
	// 					}
	// 				})
	// 				res[0].countryList.forEach(item => {
	// 					$('#aep_smtListingPriceTable').find(`thead th[data-code=${item.countryCode}]`).find('select[name=regionPriceFixPriceByShipType]').val(item.countryAdjustType)
	// 				})
	// 				form.render()
	// 			})
	// 		})
	// 	}
	// 	// 	单个区域定价
	// 	function aep_smtListing_estimateRegionPrice(storeAcctId){
	// 		form.on('select(aep_smtListing_regionPriceFixPriceByShipType)', function (data) {
	// 			let code = $(data.othis).parents('th').attr('data-code')
	// 			let params = {}
	// 			params.countryCode = code
	// 			params.grossProfitRate = $("#aep_smtListingPrice").find('input[name=grossProfitRate]').val()  //折扣率
	// 			params.discountRate = $("#aep_smtListingPrice").find('input[name=discountRate]').val()   //优惠幅度
	// 			params.shipType = data.value
	// 			const tbodyTrs = $('#aep_smtListingPriceTable').find('tbody tr'); //获取表格选中行
	// 			var skuList = []
	// 			tbodyTrs.each(function () {
	// 				const listingPrice = $(this).find('.finalPrice').text().replaceAll('$','').replaceAll('¥','')
	// 				skuList.push({
	// 					prodSSku: $(this).find('.prodSSku').text(),
	// 					storeSubSku: '',     //
	// 					storeAcctId: Number(storeAcctId),
	// 					listingPrice: listingPrice === '' ? null : Number(listingPrice)
	// 				})
	// 			})
	// 			params.skuList = skuList
	// 			commonReturnPromise({
	// 				url: ctx + '/aliexpress/publish/regionPriceFixPriceByShipType',
	// 				type: 'post',
	// 				params: JSON.stringify(params),
	// 				contentType: 'application/json;charset=UTF-8'
	// 			}).then(res => {
	// 				tbodyTrs.each(function () {
	// 						var prodSSku = $(this).find('.prodSSku').text()
	// 						let curData = res.filter(item => item.sSku == prodSSku && item.countryCode == code)
	// 						if (curData[0]) {
	// 							$(this).find(`td[data-field=${code}] div[name=td_${code}] div:first`).html('$' + curData[0].noCalculateDiscountRatePrice+'/'+'￥'+curData[0].noCalculateDiscountRatePriceCny)
	// 							$(this).find(`td[data-field=${code}] div[name=td_${code}] div:last`).html('$' + curData[0].price+'/'+'￥'+curData[0].priceCny)
	// 						}
	// 					})
	// 				})
	// 		})
	// 	}

  //   form.on('submit(aep_smtListingPrice)', function(data) {
  //   	layui.admin.load.show();
  //       $.ajax({
  //       	type:"post",
  //       	url:ctx+"/aliexpresslisting/listprice.html",
  //       	data:data.field,
  //       	dataType:'json',
  //       	success:function(returnData){
  //       		layui.admin.load.hide();
  //       		if(returnData.code=="0000"){
	// 						$("#aep_smtListingPriceTable tbody").find('tr').each(function(){
	// 							const prodSSku = $(this).find('.prodSSku').text()
	// 							const curData = returnData.data.filter(item=>item.sSku===prodSSku)
	// 							if(curData.length){
	// 								// 赋值
	// 								$(this).find('input[name=cost]').val(curData[0].cost)  //成本
	// 								$(this).find('input[name=weight]').val(curData[0].weight)  //重量
	// 								$(this).find('.listingPrice').html('$' + curData[0].listingPrice)  //定价
	// 								$(this).find('.listingPriceCny').html('￥' + curData[0].listingPriceCny)  //定价 人民币
	// 								$(this).find('.finalPrice').html('$' + curData[0].finalPrice)  //刊登价
	// 								$(this).find('.finalPriceCny').html('￥' + curData[0].finalPriceCny)  //刊登价 人民币
	// 								$(this).find('.estimateProfit').html('&yen;' + curData[0].estimateProfit)  //预估利润
	// 							}
	// 						})
  //       		}else{
  //       			layer.msg(returnData.msg, {icon:5});
  //       		}
  //       	}
  //       });
  //       return false;
  //   });
  //   form.on('select(aep_smtShippingType)', function(data){
	//     $("#aep_smtListingPrice button[type=submit]").trigger("click");
	// });
  //   //子SKU更新价格
	// $("body").on("click","#aep_smtListingPriceTable .aep_upSkuPrice", function(){
	// 	var reqData = serializeObject($("#aep_smtListingPrice"));
	// 	var trDom = $(this).parents("tr");
	// 	reqData.cost = trDom.find("input[name=cost]").val();
	// 	reqData.weight = trDom.find("input[name=weight]").val();
	// 	reqData.prodSSku = trDom.find(".prodSSku").text();
	// 	layui.admin.load.show();
	// 	$.ajax({
	// 		type:"post",
	// 		url:ctx+"/aliexpresslisting/listprice.html",
	// 		data:reqData,
	// 		dataType:'json',
	// 		success:function(returnData){
	// 			layui.admin.load.hide();
	// 			if(returnData.code=="0000"){
	// 				trDom.find(".listingPrice").html("$"+returnData.data[0].listingPrice);
	// 				trDom.find(".listingPriceCny").html("￥"+returnData.data[0].listingPriceCny);
	// 				trDom.find(".finalPrice").html("$"+returnData.data[0].finalPrice);
	// 				trDom.find(".finalPriceCny").html("￥"+returnData.data[0].finalPriceCny);
	// 				trDom.find(".estimateProfit").html("&yen;"+returnData.data[0].estimateProfit);
	// 			}else{
	// 				layer.msg(returnData.msg, {icon:5});
	// 			}
	// 		}
	// 	});
	// });

	    
    //初始化速卖通标签
    function initProdAliexpressTag(){
    	$.ajax({
    		type:"post",
    		url: ctx + "/sys/listdict.html",
    		dataType:'json',
    		data:{headCode:"PROD_ALIEXPRESS_TAG"},
    		success:function(returnData){
    			if(returnData.code=="0000"){
    				prodAliexpressTags = [];
        			for(var i=0;i<returnData.data.length;i++){
        				prodAliexpressTags.push(returnData.data[i].name);
        			}
        			initSearchTagForm();
        		}else{
        			layer.msg(returnData.msg, {icon:5});
        		}
    		}
    	});
    }
    function initSearchTagForm(){
    	var str = '<input type="checkbox" value="" lay-skin="primary" title="全部" lay-filter="aep_prodAliexpressTagAll">'
    	for(var i=0;i<prodAliexpressTags.length;i++){
    		str+='<input type="checkbox" name="prodAliexpressTag"  value="'+prodAliexpressTags[i]+'" lay-skin="primary" title="'+prodAliexpressTags[i]+'" lay-filter="aep_prodAliexpressTag" >';
    	}
    	$("#aep_searchTagForm").html(str);
    	form.render('checkbox');
    }
    //初始化编辑机标签form
    function initEditTagForm(tags){
    	var str = ''
    	if(!tags){tags=""};
    	for(var i=0;i<prodAliexpressTags.length;i++){
    		if(tags.indexOf(prodAliexpressTags[i])>-1){
    			str+='<input type="checkbox" checked name="prodAliexpressTag"  value="'+prodAliexpressTags[i]+'" lay-skin="primary" title="'+prodAliexpressTags[i]+'" >';
    		}else{
    			str+='<input type="checkbox" name="prodAliexpressTag"  value="'+prodAliexpressTags[i]+'" lay-skin="primary" title="'+prodAliexpressTags[i]+'" >';
    		}
    		
    	}
    	$("#aep_editTagForm").html(str);
    	form.render('checkbox');
    }

	//初始化速卖通标签
	function initProdTag(){
		$.ajax({
			type:"post",
			url: ctx + "/sys/listdict.html",
			dataType:'json',
			data:{headCode:"prod_tag"},
			success:function(returnData){
				if(returnData.code=="0000"){
					var option = "<option></option>";
					for(var i=0;i<returnData.data.length;i++){
						prodAliexpressTags.push(returnData.data[i].name);
						option = option + "<option value='"+returnData.data[i].name+"'>"
								+ returnData.data[i].name
								+ "</option>"
					}
					$("#aep_searchForm select[name=prodAttrList]").html(option);
					form.render('select');
				}else{
					layer.msg(returnData.msg, {icon:5});
				}
			}
		});
	}
    
    
    
    //速卖通模板标签全选反选
    form.on('checkbox(aep_prodAliexpressTagAll)', function(data){
	    console.log(data);
	    $("#aep_searchTagForm input[type=checkbox]").each(function(){
	    	$(this).prop("checked",data.elem.checked)
    	});
    	form.render('checkbox');
	});
	form.on('checkbox(aep_prodAliexpressTag)', function(data){
		var totalNum = $("#aep_searchTagForm input[name=prodAliexpressTag]").length
		var checkedNum = $("#aep_searchTagForm input[name=prodAliexpressTag]:checked").length
		$("#aep_searchTagForm input[type=checkbox]:first").prop("checked",checkedNum==totalNum);
		form.render('checkbox');
	});
	
	
	function initLogisAttrSelect(){
		$.ajax({
			type:"post",
			url: ctx + "/sys/listlogisattr.html",
			dataType:"json",
			success:function(returnData){
				logisAttrs = returnData.data;
				formSelects.data('aep_logisticsSelect', 'local', {arr: logisAttrs})
                form.render();
			}
		});
	}

	/**
	 * 展开全部和收起全部功能
	 */
	function expandAll() {
		var allShow = $('.productListSkuShow')
		for (var i = 0; i < allShow.length; i++) {
			var showi = allShow[i]
			if ($(showi).html().indexOf('展开') > -1) {
				$(showi).trigger('click')
			}
		}
	}

	function PackUpAll() {
		var allShow = $('.productListSkuShow')
		for (var i = 0; i < allShow.length; i++) {
			var showi = allShow[i]
			if ($(showi).html().indexOf('收起') > -1) {
				$(showi).trigger('click')
			}
		}
	}
});


function openSmtComp(pid){
    $.ajax({
    	type:"post",
    	url: ctx + "/prodTpl/listcompUrl.html",
        dataType:"json",
    	data:{
    	    prodPId:pid,
    	    platCode:"aliexpress"
    	},
    	success:function(returnData){
    	    if(returnData.data.length>=1){
    	        for(var i=0;i<returnData.data.length;i++){
                if(returnData.data[i].indexOf("http") < 0){
                  window.open("http://"+returnData.data[i]);
                }else{
                  window.open(returnData.data[i]);
                }
                }
    	    }
    	}
    });
}
