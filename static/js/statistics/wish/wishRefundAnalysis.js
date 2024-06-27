 layui.use(['admin', 'form', 'table','laydate','upload', 'formSelects'], function() {
        var $ = layui.$,
            admin = layui.admin,
            element = layui.element,
            layer = layui.layer,
            laydate = layui.laydate,
            table = layui.table,
            upload = layui.upload,
            form = layui.form;
        form.render(null, 'component-form-element');
        form.render(null, 'component-form-group');
        form.render();
        var orderTimeType = "1";//订单时间类型
        render_hp_orgs_users("#wishAnalysisSearchForm");//渲染部门销售员店铺三级联动
        var storeAcctIdList;
        form.render('select');
        formSelects = layui.formSelects
        listByStoreAcctId(orderTimeType);
        /**
         * 查询类型选项卡改变
         */
        element.on('tab(wish_analysis_tab_filter)', function (data) {
        	orderTimeType = $(this).attr("orderTimeType");
        });
        
        
        
       function listByStoreAcctId(orderTimeType){
    	   console.log('chaxunleixing'+orderTimeType);
       	var orderTime = $.trim($("#ordeTimeDiv input[name='orderTime']").val());
    	 //表格渲染
           table.render({
               elem:'#refund_table',
			   url: ctx+'/wishRefundAnalysis/list.html', // 数据接口
			   totalRow: true,
               cols: [
                   [ //表头
                       { field: 'storeAcct', title: '店铺', width: '10%', sort:true,totalRowText: '合计'},
                       { field: 'orderNum', title: '订单数', width: '10%', totalRow: true, sort:true},
                       { field: 'orderTotalAmt', title: '订单金额($)', sort: true, totalRow: true, width: '10%'},
                       { field: 'refundOrderNum', title: '退款订单数量', sort: true, totalRow: true,width: '10%'},
                       { field: 'refundAmt', title: '退款金额($)', width: '10%',totalRow: true, sort:true},
                       { field: 'refundProbility',templet:'<div>{{d.refundProbility}}%</div>', title: '退款率', width: '10%', sort:true},
                       { field: 'unitPrice', title: '客单价($)', sort: true, width: '10%'},
                       { field: 'suffix', title: '总利润(￥)', sort: true,totalRow: true, width: '10%'},
                       { field: 'subSuffix', title: '总利润-退款金额 (￥)', totalRow: true, sort: true, width: '10%'},
                       { field: 'suffixProbility',templet:'<div>{{d.suffixProbility}}%</div>', title: '利润率', sort: true, width: '9%'}
                   ]
               ],
               where:{orderTime:orderTime,orderTimeType:orderTimeType,storeAcctIdList:storeAcctIdList},
               page: false,
   	        limits: [50, 100, 500], // 每页条数的选择项
			   limit: 50, //默认显示20条
			   done:function(res,curr,count){
			    	// theadHandle().fixTh({h:200,id:'#wishRefundCard'});
			   }
           });
       } 
       //日期范围
       laydate.render({
		   elem: '#orderTime',
		   type: 'month',
           range: true
       });
        $("#refund_searchBtn").click(function(){
        	var queryType = $("#wish_refundAnalysisType input[name=statisticsType]:checked").val();
        	var orderTime = $.trim($("#ordeTimeDiv input[name='orderTime']").val());
        	 var logisAttrContents = formSelects.value("selectAttr_store");
        	 var storeAcctIdQuery = [];
        	 for (var i = 0; i < logisAttrContents.length; i++) {
        	        var logisAttr = logisAttrContents[i].value;
        	        storeAcctIdQuery.push($.trim(logisAttr));
        	    }
        	
        	var storeAcctId= [];
        	if(storeAcctIdQuery==null || storeAcctIdQuery.length==0 ||storeAcctIdQuery==[]){
        		$(".xm-select-dl").children().each(function () {
        			if($(this).attr("lay-value")!=null && $(this).attr("lay-value")!='undefined' && $(this).attr("lay-value")!=''){
        				storeAcctId.push($(this).attr("lay-value"));
        			}
        		})
        		if(storeAcctId.length!=0){
        			storeAcctIdList = storeAcctId.join(',')
        			console.log(storeAcctIdList);
        		}
        	}else{
        		storeAcctIdList = storeAcctIdQuery.join(',');
        	}
        	if(queryType=='country'){
        		table.render({
        			method:'post',
        			elem:'#refund_table',
					url: ctx+'/wishRefundAnalysis/listByCountry.html', // 数据接口
					totalRow: true,
        			cols: [
        			       [ //表头
        			         { field: 'countryTpl',title: '国家',templet:"#wishRefundCountryTpl" ,width: '10%', sort:true,totalRowText: '合计'},
        			         { field: 'orderNum', title: '订单数', width: '10%', totalRow: true,sort:true},
        			         { field: 'orderTotalAmt', title: '订单金额($)', sort: true, totalRow: true, width: '10%'},
        			         { field: 'refundOrderNum', title: '退款订单数量', sort: true, totalRow: true, width: '10%'},
        			         { field: 'refundAmt', title: '退款金额($)', width: '10%',totalRow: true, sort:true},
        			         { field: 'refundProbility',templet:'<div>{{d.refundProbility || ""}}%</div>', title: '退款率', width: '10%', sort:true},
        			         { field: 'unitPrice', title: '客单价($)', sort: true, width: '10%'},
        			         { field: 'suffix', title: '总利润(￥)', sort: true, totalRow: true,width: '10%'},
        			         { field: 'subSuffix', title: '总利润-退款金额 (￥)', sort: true, totalRow: true,width: '10%'},
        			         { field: 'suffixProbility',templet:'<div>{{d.suffixProbility|| ""}}%</div>', title: '利润率', sort: true, width: '9%'}
        			         ]
        			       ],
        			       where:{orderTime:orderTime,orderTimeType:orderTimeType,storeAcctIdList:storeAcctIdList},
        			       page: false,
        			       limits: [50, 100, 200], // 每页条数的选择项
						   limit: 50, //默认显示20条
						   done:function(res,curr,count){
							    // theadHandle().fixTh({h:200,id:'#wishRefundCard'});
						   }
        		});
        	}else if(queryType=='platAcctId'){
        		listByStoreAcctId(orderTimeType);
        	}else if(queryType=='platAcctIdAll'){
        		table.render({
        			method:'post',
        			elem:'#refund_table',
					url: ctx+'/wishRefundAnalysis/listAll.html', // 数据接口
					totalRow: true, 
        			cols: [
        			       [ //表头
        			         { field: 'storeAcct', title: '店铺', width: '9%', sort:true,totalRowText: '合计'},
                             { field: 'orderNum', title: '订单数', width: '9%',totalRow: true, sort:true},
                             { field: 'orderTotalAmt', title: '订单金额($)', sort: true, totalRow: true,width: '9%'},
                             { field: 'actualAmt', title: '实得($)', sort: true, totalRow: true,width: '9%'},
                             { field: 'refundOrderNum', title: '退款订单数量', sort: true, totalRow: true,width: '9%'},
                             { field: 'refundAmt', title: '退款金额($)', totalRow: true,width: '9%'},
                             { field: 'refundProbility',templet:'<div>{{d.refundProbility || ""}}%</div>', title: '退款率', width: '9%'},
                             { field: 'unitPrice', title: '客单价($)', sort: true, width: '9%'},
                             { field: 'suffix', title: '总利润(￥)', sort: true, totalRow: true,width: '9%'},
                             { field: 'subSuffix', title: '总利润-退款金额 (￥)', sort: true, totalRow: true,width: '9%'},
                             { field: 'suffixProbility',templet:'<div>{{d.suffixProbility || ""}}%</div>', title: '利润率', sort: true, width: '9%'}
        			         ]
        			       ],
        			       where:{orderTime:orderTime,orderTimeType:orderTimeType,storeAcctIdList:storeAcctIdList},
        			       page: false,
        			       limits: [50, 100, 500], // 每页条数的选择项
						   limit: 50, //默认显示20条
						   done:function(res,curr,count){
							// theadHandle().fixTh({h:200,id:'#wishRefundCard'});
						   }
        		});
        	}else if(queryType=='logistics'){
        		table.render({
        			method:'post',
        			elem:'#refund_table',
					url: ctx+'/wishRefundAnalysis/listByShip.html', // 数据接口
					totalRow: true, 
        			cols: [
        			       [ //表头
        			         { field: 'shipTpl',title: '物流方式',templet:"#shipTpl", width: '10%', sort:true,totalRowText: '合计'},
        			         { field: 'orderNum', title: '订单数', width: '10%',totalRow: true, sort:true},
        			         { field: 'orderTotalAmt', title: '订单金额($)', sort: true, totalRow: true,width: '10%'},
        			         { field: 'refundOrderNum', title: '退款订单数量', sort: true, totalRow: true,width: '10%'},
        			         { field: 'refundAmt', title: '退款金额($)', width: '10%',totalRow: true, sort:true},
        			         { field: 'refundProbility',templet:'<div>{{d.refundProbility || ""}}%</div>', title: '退款率', width: '10%', sort:true},
        			         { field: 'unitPrice', title: '客单价($)', sort: true, width: '10%'},
        			         { field: 'suffix', title: '总利润(￥)', sort: true, totalRow: true,width: '10%'},
        			         { field: 'subSuffix', title: '总利润-退款金额 (￥)', sort: true, totalRow: true,width: '10%'},
        			         { field: 'suffixProbility',templet:'<div>{{d.suffixProbility || ""}}%</div>', title: '利润率', sort: true, width: '9%'}
        			         ]
        			       ],
        			       where:{orderTime:orderTime,orderTimeType:orderTimeType,storeAcctIdList:storeAcctIdList},
        			       page: false,
        			       limits: [50, 100, 200], // 每页条数的选择项
						   limit: 50, //默认显示20条
						   done:function(res,curr,count){
							//  theadHandle().fixTh({h:200,id:'#wishRefundCard'});
						   }
        		});
        	}else if(queryType=='adName'){
        		table.render({
        			elem:'#refund_table',
					url: ctx+'/wishRefundAnalysis/listByName.html', // 数据接口
					totalRow: true, 
        			cols: [
        			       [ //表头
        			         { field: 'adName', title: '收件人', width: '17%', sort:true,totalRowText: '合计'},
        			         { field: 'orderNum', title: '订单数', width: '17%', sort:true,totalRow: true},
        			         { field: 'orderTotalAmt', title: '订单金额($)', sort: true, totalRow: true,width: '17%'},
        			         { field: 'refundOrderNum', title: '退款订单数量', sort: true,totalRow: true, width: '17%'},
        			         { field: 'refundAmt', title: '退款金额($)', width: '17%', totalRow: true, sort:true},
        			         { field: 'refundProbility',templet:'<div>{{d.refundProbility || ""}}%</div>', title: '退款率', width: '14%', sort:true},
        			         ]
        			       ],
        			       where:{orderTime:orderTime,orderTimeType:orderTimeType},
        			       page: false,
        			       limits: [50, 100, 200], // 每页条数的选择项
						   limit: 50, //默认显示20条
						   done:function(res,curr,count){
							// theadHandle().fixTh({h:200,id:'#wishRefundCard'});
						  }
        		});
        	}else if(queryType=='refundReason'){
        		table.render({
        			elem:'#refund_table',
					url: ctx+'/wishRefundAnalysis/listByResean.html', // 数据接口
					totalRow: true, 
        			cols: [
        			       [ //表头
        			         { field: 'storeAcct', title: '店铺', width: '8%', sort:true,totalRowText: '合计'},
        			         { field: 'refundOrderNum', title: '退款订单数量', sort: true, width: '4%',totalRow: true},
        			         { field: 'refundProbility',templet:'<div>{{d.refundProbility || ""}}%</div>', title: '退款率', width: '4%', sort:true,totalRow: true},
        			         { field: 'shipTakeTLang', title: '配送时间过长', width: '4%', sort:true,totalRow: true},
        			         { field: 'itemIsDamaged', title: '商品已损坏', width: '4%', sort:true,totalRow: true},
        			         { field: 'orderShippedIncomplete', title: '配送的订单不完整', width: '4%', sort:true,totalRow: true},
        			         { field: 'userCancelledOrder', title: '用户取消了订单', width: '4%', sort:true,totalRow: true},
        			         { field: 'itemNotListing', title: '商品与产品描述不符', width: '4%', sort:true,totalRow: true},
        			         { field: 'orderFraudulent', title: '欺诈订单', width: '3%', sort:true,totalRow: true},
        			         { field: 'itemNotFit', title: '商品不合适', width: '4%', sort:true,totalRow: true},
        			         { field: 'itemNotDescribed', title: '商品功能与描述不符', width: '4%', sort:true,totalRow: true},
        			         { field: 'itemNotReceive', title: 'Wish Blue订单买家没有去取', width: '4%', sort:true,totalRow: true},
        			         { field: 'receivedWrongItem', title: '收到错误商品', width: '4%', sort:true,totalRow: true},
        			         { field: 'shipBeyongDeliverydate', title: 'WISH BLUE订单延迟履行', width: '4%', sort:true,totalRow: true},
        			         { field: 'orderMistake', title: '误下单了', width: '3%', sort:true,totalRow: true},
        			         { field: 'buyWrongAdress', title: '用户提供了错误的地址', width: '4%', sort:true,totalRow: true},
        			         { field: 'fulfillOrder', title: '无法履行', width: '3%', sort:true,totalRow: true},
        			         { field: 'qulifiedShippingProvider', title: '不合格的物流承运商', width: '4%', sort:true,totalRow: true},
        			         { field: 'badItem', title: '商品为假冒伪劣品', width: '4%', sort:true,totalRow: true},
        			         { field: 'backToShiper', title: '商品退还至发货人', width: '4%', sort:true,totalRow: true},
        			         { field: 'itemNotExpectation', title: '卖家到期未履行订单', width: '4%', sort:true,totalRow: true},
        			         { field: 'packageEmpty', title: '卖家缺货', width: '3%', sort:true,totalRow: true},
        			         { field: 'delWrongAdress', title: '产品被配送至错误的地址', width: '4%', sort:true,totalRow: true},
							 { field: 'other', title: '物流显示送达实际没有送达', width: '4%', sort:true,totalRow: true}
        			         ]
        			       ],
        			       where:{orderTime:orderTime,orderTimeType:orderTimeType,storeAcctIdList:storeAcctIdList},
        			       page: false,
        			       limits: [50, 100, 200], // 每页条数的选择项
						   limit: 50, //默认显示20条
						   done:function(res,curr,count){
							theadHandle().fixTh({h:200,id:'#wishRefundCard'});
						  }
        		});
        	}else if(queryType=='buyerId'){
        		table.render({
        			elem:'#refund_table',
					url: ctx+'/wishRefundAnalysis/listByBuyerId.html', // 数据接口
					totalRow: true,
        			cols: [
        			       [ //表头
        			         { field: 'buyerId', title: '购买人Id', width: '15%', sort:true,totalRowText: '合计'},
        			         { field: 'orderNum', title: '订单数', width: '15%', sort:true,totalRow: true},
        			         { field: 'orderTotalAmt', title: '订单金额($)', sort: true, width: '15%',totalRow: true},
        			         { field: 'refundOrderNum', title: '退款订单数量', sort: true, width: '15%',totalRow: true},
        			         { field: 'refundAmt', title: '退款金额($)', width: '15%', sort:true,totalRow: true},
        			         { field: 'refundProbility',templet:'<div>{{d.refundProbility || ""}}%</div>', title: '退款率', width: '15%', sort:true},
        			         ]
        			       ],
        			       where:{orderTime:orderTime,orderTimeType:orderTimeType},
        			       page: false,
        			       limits: [50, 100, 200], // 每页条数的选择项
						   limit: 50, //默认显示20条
						   done:function(res,curr,count){
							// theadHandle().fixTh({h:200,id:'#wishRefundCard'});
						   }
        		});
        	}else if(queryType=='cateId'){
        		table.render({
        			method:'post',
        			elem:'#refund_table',
					url: ctx+'/wishRefundAnalysis/listByCateClass1.html', // 数据接口
					totalRow: true, 
        			cols: [
        			       [ //表头
        			         { field: 'cateIdTpl',title: '一级类目',templet:"#cateIdTpl", width: '10%', sort:true,totalRowText: '合计'},
        			         { field: 'orderNum', title: '订单数', width: '10%', sort:true,totalRow: true},
        			         { field: 'orderTotalAmt', title: '订单金额($)', sort: true, width: '10%',totalRow: true},
        			         { field: 'refundOrderNum', title: '退款订单数量', sort: true, width: '10%',totalRow: true},
        			         { field: 'refundAmt', title: '退款金额($)', width: '10%', sort:true,totalRow: true},
        			         { field: 'refundProbility',templet:'<div>{{d.refundProbility || ""}}%</div>', title: '退款率', width: '10%', sort:true},
        			         { field: 'unitPrice', title: '客单价($)', sort: true, width: '10%'},
        			         { field: 'suffix', title: '总利润(￥)', sort: true, width: '10%',totalRow: true},
        			         { field: 'subSuffix', title: '总利润-退款金额 (￥)', sort: true, width: '10%',totalRow: true},
        			         { field: 'suffixProbility',templet:'<div>{{d.suffixProbility}}%</div>', title: '利润率', sort: true, width: '9%'}
        			         ]
        			       ],
        			       where:{orderTime:orderTime,orderTimeType:orderTimeType,storeAcctIdList:storeAcctIdList},
        			       page: false,
        			       limits: [50, 100, 200], // 每页条数的选择项
						   limit: 50, //默认显示20条
						   done:function(res,curr,count){
						    	// theadHandle().fixTh({h:200,id:'#wishRefundCard'});
						  }
        		});
        	}
        });  
        table.on('tool(refund_tablefilter)', function(obj) {
            var layEvent = obj.event; //获得 lay-event 对应的值
            var data = obj.data; //获得当前行数据
            var orderTime = $.trim($("#ordeTimeDiv input[name='orderTime']").val());
            if (layEvent === 'show_country') {	
                layer.open({
                	title: '物流方式详情',
                    type: 1, //不加该属性,就会出现[object Object]
                    area: ['1160px', '80%'],
                    id:'show_country_ship',
                    shadeClose: false,
                    btn: ['关闭'],
                    content: $('#countryShipTpl').html(),
                    yes: function(index, layero) {
                    	layer.closeAll();
                    },
                    success: function(layero, index) {
                    	table.render({
                			elem:'#ship_table',
                			url: ctx+'/wishRefundAnalysis/listByCountryShip.html', // 数据接口
                			where: data,
                            method: 'post',
                			cols: [
                			       [ //表头
                			         { field: 'allrootLogisType', title: '物流方式', width: '9%', sort:true},
                			         { field: 'orderNum', title: '订单数', width: '9%', sort:true},
                			         { field: 'orderTotalAmt', title: '订单金额($)', sort: true, width: '9%'},
                			         { field: 'refundOrderNum', title: '退款订单数量', sort: true, width: '9%'},
                			         { field: 'refundAmt', title: '退款金额($)', width: '9%', sort:true},
                			         { field: 'refundProbility',templet:'<div>{{d.refundProbility || ""}}%</div>', title: '退款率', width: '9%', sort:true},
                			         { field: 'unitPrice', title: '客单价($)', sort: true, width: '9%'},
                			         { field: 'suffix', title: '总利润(￥)', sort: true, width: '9%'},
                			         { field: 'subSuffix', title: '总利润-退款金额 (￥)', sort: true, width: '9%'},
                			         { field: 'suffixProbility',templet:'<div>{{d.suffixProbility || ""}}%</div>', title: '利润率', sort: true, width: '9%'}
                			         ]
                			       ],
                			       where:{orderTime:orderTime,country:data.adCountry,orderTimeType:orderTimeType,storeAcctIdList:storeAcctIdList},
                			       page: false,
                			       limits: [50, 100, 200], // 每页条数的选择项
                			       limit: 50, //默认显示20条
                		});
                    }
                })
            } 
            if (layEvent === 'show_ship') {
                layer.open({
                	title: '国家物流详情',
                    type: 1, //不加该属性,就会出现[object Object]
                    area: ['1160px', '80%'],
                    id:'show_ship_country',
                    shadeClose: false,
                    btn: ['关闭'],
                    content: $('#shipCountryTpl').html(),
                    yes: function(index, layero) {
                    	layer.closeAll();
                    },
                    success: function(layero, index) {
                    	table.render({
                			elem:'#country_table',
                			url: ctx+'/wishRefundAnalysis/listByShipCountry.html', // 数据接口
                			method:'post',
                			cols: [
                			       [ //表头
                			         { field: 'adCountry', title: '国家', width: '9%', sort:true},
                			         { field: 'orderNum', title: '订单数', width: '9%', sort:true},
                			         { field: 'orderTotalAmt', title: '订单金额($)', sort: true, width: '9%'},
                			         { field: 'refundOrderNum', title: '退款订单数量', sort: true, width: '9%'},
                			         { field: 'refundAmt', title: '退款金额($)', width: '9%', sort:true},
                			         { field: 'refundProbility',templet:'<div>{{d.refundProbility || ""}}%</div>', title: '退款率', width: '9%', sort:true},
                			         { field: 'unitPrice', title: '客单价($)', sort: true, width: '9%'},
                			         { field: 'suffix', title: '总利润(￥)', sort: true, width: '9%'},
                			         { field: 'subSuffix', title: '总利润-退款金额 (￥)', sort: true, width: '9%'},
                			         { field: 'suffixProbility',templet:'<div>{{d.suffixProbility || ""}}%</div>', title: '利润率', sort: true, width: '9%'}
                			         ]
                			       ],
                			       where:{orderTime:orderTime,allrootLogisType:data.allrootLogisType,orderTimeType:orderTimeType,storeAcctIdList:storeAcctIdList},
                			       page: false,
                			       limits: [50, 100, 200], // 每页条数的选择项
                			       limit: 50, //默认显示20条
                		});
                    }
                })
            } 
            if (layEvent === 'show_cateclass2') {
                layer.open({
                	title: '二级类目详情',
                    type: 1, //不加该属性,就会出现[object Object]
                    area: ['1160px', '80%'],
                    id:'show_catecateclass2',
                    shadeClose: false,
                    btn: ['关闭'],
                    content: $('#cateClassTpl').html(),
                    yes: function(index, layero) {
                    	layer.closeAll();
                    },
                    success: function(layero, index) {
                    	table.render({
                			elem:'#cateClass_table',
                			url: ctx+'/wishRefundAnalysis/listByCateClass2.html', // 数据接口
							method:"post",
                			cols: [
                			       [ //表头
                			         { field: 'prodCateClass2', title: '二级类目', width: '9%', sort:true,templet:"#wish_refund_analysis_prodCate_tpl"},
                			         { field: 'orderNum', title: '订单数', width: '9%', sort:true},
                			         { field: 'orderTotalAmt', title: '订单金额($)', sort: true, width: '9%'},
                			         { field: 'refundOrderNum', title: '退款订单数量', sort: true, width: '9%'},
                			         { field: 'refundAmt', title: '退款金额($)', width: '9%', sort:true},
                			         { field: 'refundProbility',templet:'<div>{{d.refundProbility}}%</div>', title: '退款率', width: '9%', sort:true},
                			         { field: 'unitPrice', title: '客单价($)', sort: true, width: '9%'},
                			         { field: 'suffix', title: '总利润(￥)', sort: true, width: '9%'},
                			         { field: 'subSuffix', title: '总利润-退款金额 (￥)', sort: true, width: '9%'},
                			         { field: 'suffixProbility',templet:'<div>{{d.suffixProbility}}%</div>', title: '利润率', sort: true, width: '9%'}
                			         ]
                			       ],
                			       where:{orderTime:orderTime,prodCateClass1:data.prodCateClass1,orderTimeType:orderTimeType,storeAcctIdList:storeAcctIdList},
                			       page: false,
                		});
                    }
                })
            }
        })
    });