 layui.use(['admin', 'form', 'table','laydate','upload','formSelects'], function() {
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
        formSelects = layui.formSelects,
        render_hp_orgs_users("#ebay_refund_searchForm");//渲染部门销售员店铺三级联动
        var orderTimeType = "1";//订单时间类型
        listByStoreAcctId(orderTimeType);
        /**
         * 查询类型选项卡改变
         */
        element.on('tab(ebay_analysis_tab_filter)', function (data) {
        	orderTimeType = $(this).attr("orderTimeType");
        });
        
        
        
       function listByStoreAcctId(orderTimeType){
    	   console.log("jinlai"+orderTimeType);
		var orgId = $("#ebay_refund_searchForm select[name=orgId]").val();
        var salePersonId = $("#ebay_refund_searchForm select[name=salePersonId]").val();
        var roleNames = $("#ebay_refund_searchForm select[name=salePersonId]").data("rolelist");
        var storeAcctId = $("#ebay_refund_searchForm select[name=platAcctId]").val();
       	var orderTime = $.trim($("#ordeTimeDiv input[name='ebayOrderTime']").val());
    	 //表格渲染
           table.render({
   			   method:'post',
               elem:'#ebay_refund_table',
               url: ctx+'/ebayRefundAnalysis/list.html', // 数据接口
               totalRow: true,
               cols: [
                   [ //表头
                       { field: 'storeAcct', title: '店铺', width: '9%', sort:true, totalRowText: '合计'},
                       { field: 'orderNum', title: '订单数', width: '9%', sort:true, totalRow: true},
                       { field: 'orderTotalAmt', title: '订单金额(￥)', sort: true, width: '9%', totalRow: true},
                       { field: 'refundOrderNum', title: '退款订单数量', sort: true, width: '9%', totalRow: true},
                       { field: 'refundAmt', title: '退款金额(￥)', width: '9%', sort:true, totalRow: true},
                       { field: 'refundProbility',templet:'<div>{{d.refundProbility || ""}}%</div>', title: '退款率', width: '9%',totalRow: true, sort:true},
                       { field: 'unitPrice', title: '客单价(￥)', sort: true, width: '9%'},
                       { field: 'suffix', title: '总利润(￥)', sort: true, width: '9%', totalRow: true},
                       { field: 'subSuffix', title: '总利润-退款金额 (￥)', sort: true, width: '9%', totalRow: true},
                       { field: 'suffixProbility',templet:'<div>{{d.suffixProbility || ""}}%</div>', title: '利润率', sort: true, width: '10%'}
                   ]
               ],
               where:{orderTime:orderTime,orderTimeType:orderTimeType,orgId:orgId,salePersonId:salePersonId,roleNames:roleNames,storeAcctId:storeAcctId},
               page: false,
   	        limits: [50, 100, 500], // 每页条数的选择项
			   limit: 50, //默认显示20条
			   done:function(res,curr,count){
							// theadHandle().fixTh({h:200,id:'#ebayRefundCard'});
			   }
           });
       } 
       //日期范围
       laydate.render({
		   elem: '#ebayOrderTime',
		   type: 'month',
           range: true
       });
        $("#ebay_refund_searchBtn").click(function(){
        	var queryType = $("#ebayRefundAnalysisType input[name=statisticsType]:checked").val();
        	var orderTime = $.trim($("#ordeTimeDiv input[name='ebayOrderTime']").val());
        	var orgId = $("#ebay_refund_searchForm select[name=orgId]").val();
            var salePersonId = $("#ebay_refund_searchForm select[name=salePersonId]").val();
            var roleNames = $("#ebay_refund_searchForm select[name=salePersonId]").data("rolelist");
            var storeAcctId = $("#ebay_refund_searchForm select[name=platAcctId]").val();
           	var orderTime = $.trim($("#ordeTimeDiv input[name='ebayOrderTime']").val());
        	if(queryType=='country'){
        		table.render({
        			method:'post',
        			elem:'#ebay_refund_table',
        			url: ctx+'/ebayRefundAnalysis/listByCountry.html', // 数据接口
                    totalRow: true,
        			cols: [
        			       [ //表头
        			         { field: 'countryTpl',title: '国家',templet:"#ebayRefundCountryTpl" ,width: '9%', sort:true, totalRowText: '合计'},
        			         { field: 'orderNum', title: '订单数', width: '9%', sort:true, totalRow: true},
        			         { field: 'orderTotalAmt', title: '订单金额(￥)', sort: true, width: '9%', totalRow: true},
        			         { field: 'refundOrderNum', title: '退款订单数量', sort: true, width: '9%', totalRow: true},
        			         { field: 'refundAmt', title: '退款金额(￥)', width: '9%', sort:true, totalRow: true},
        			         { field: 'refundProbility',templet:'<div>{{d.refundProbility || ""}}%</div>', title: '退款率', width: '9%', sort:true},
        			         { field: 'unitPrice', title: '客单价(￥)', sort: true, width: '8%'},
        			         { field: 'suffix', title: '总利润(￥)', sort: true, width: '9%', totalRow: true},
        			         { field: 'subSuffix', title: '总利润-退款金额 (￥)', sort: true, width: '9%', totalRow: true},
        			         { field: 'suffixProbility',templet:'<div>{{d.suffixProbility || ""}}%</div>', title: '利润率', sort: true, width: '9%'}
        			         ]
        			       ],
        			       where:{orderTime:orderTime,orderTimeType:orderTimeType},
        			       page: false,
        			       limits: [50, 100, 200], // 每页条数的选择项
										 limit: 50, //默认显示20条
										 done:function(res,curr,count){
											// theadHandle().fixTh({h:200,id:'#ebayRefundCard'});
								    }
        		});
        	}else if(queryType=='platAcctId'){
        		listByStoreAcctId(orderTimeType);
        	}else if(queryType=='platAcctIdAll'){
        		table.render({
        			method:'post',
        			elem:'#ebay_refund_table',
        			url: ctx+'/ebayRefundAnalysis/listAll.html', // 数据接口
                    totalRow: true,
        			cols: [
        			       [ //表头
        			         { field: 'storeAcct', title: '店铺', width: '9%', sort:true, totalRowText: '合计'},
                             { field: 'orderNum', title: '订单数', width: '9%', sort:true, totalRow: true},
                             { field: 'orderTotalAmt', title: '订单金额(￥)', sort: true, width: '9%', totalRow: true},
                             { field: 'refundOrderNum', title: '退款订单数量', sort: true, width: '9%', totalRow: true},
                             { field: 'refundAmt', title: '退款金额(￥)', width: '9%', totalRow: true},
                             { field: 'refundProbility',templet:'<div>{{d.refundProbility || ""}}%</div>', title: '退款率', width: '9%'},
                             { field: 'unitPrice', title: '客单价(￥)', sort: true, width: '9%'},
                             { field: 'suffix', title: '总利润(￥)', sort: true, width: '9%', totalRow: true},
                             { field: 'subSuffix', title: '总利润-退款金额 (￥)', sort: true, width: '9%', totalRow: true},
                             { field: 'suffixProbility',templet:'<div>{{d.suffixProbility || ""}}%</div>', title: '利润率', sort: true, width: '9%'}
        			         ]
        			       ],
        			       where:{orderTime:orderTime,orderTimeType:orderTimeType,orgId:orgId,salePersonId:salePersonId,roleNames:roleNames,storeAcctId:storeAcctId},
        			       page: false,
        			       limits: [50, 100, 500], // 每页条数的选择项
										 limit: 50, //默认显示20条
										 done:function(res,curr,count){
											// theadHandle().fixTh({h:200,id:'#ebayRefundCard'});
								    }
        		});
        	}else  if(queryType=='refundReason'){
        		table.render({
        			method:'post',
        			elem:'#ebay_refund_table',
        			url: ctx+'/ebayRefundAnalysis/listByResean.html', // 数据接口
                    totalRow: true,
        			cols: [
        			       [ //表头
        			         { field: 'storeAcct', title: '店铺', width: '12%', sort:true, totalRowText: '合计'},
        			         { field: 'refundOrderNum', title: '退款订单数量', sort: true, width: '12%', totalRow: true},
        			         { field: 'refundProbility',templet:'<div>{{d.refundProbility || ""}}%</div>', title: '退款率', width: '12%', sort:true},
        			         { field: 'ebayRequest', title: 'ebayRequest', width: '12%', sort:true, totalRow: true},
        			         { field: 'ebayReturn', title: 'ebayReturn', width: '12%', sort:true, totalRow: true},
        			         { field: 'paypalCase', title: 'paypalCase', width: '12%', sort:true, totalRow: true},
        			         { field: 'allrootAfter', title: 'allrootAfter', width: '12%', sort:true, totalRow: true},
        			         { field: 'other', title: '其它', width: '12%', sort:true},
        			         ]
        			       ],
        			       where:{orderTime:orderTime,orderTimeType:orderTimeType,orgId:orgId,salePersonId:salePersonId,roleNames:roleNames,storeAcctId:storeAcctId},
        			       page: false,
        			       limits: [50, 100, 200], // 每页条数的选择项
										 limit: 50, //默认显示20条
										 done:function(res,curr,count){
											// theadHandle().fixTh({h:200,id:'#ebayRefundCard'});
								    }
        		});
        	}else if(queryType=='logistics'){
        		table.render({
        			method:'post',
        			elem:'#ebay_refund_table',
        			url: ctx+'/ebayRefundAnalysis/listByShip.html', // 数据接口
                    totalRow: true,
        			cols: [
        			       [ //表头
        			         { field: 'shipTpl',title: '物流方式',templet:"#shipTpl", width: '9%', sort:true, totalRowText: '合计'},
        			         { field: 'orderNum', title: '订单数', width: '9%', sort:true, totalRow: true},
        			         { field: 'orderTotalAmt', title: '订单金额(￥)', sort: true, width: '9%', totalRow: true},
        			         { field: 'refundOrderNum', title: '退款订单数量', sort: true, width: '9%', totalRow: true},
        			         { field: 'refundAmt', title: '退款金额(￥)', width: '9%', sort:true, totalRow: true},
        			         { field: 'refundProbility',templet:'<div>{{d.refundProbility || ""}}%</div>', title: '退款率', width: '9%', sort:true},
        			         { field: 'unitPrice', title: '客单价(￥)', sort: true, width: '9%'},
        			         { field: 'suffix', title: '总利润(￥)', sort: true, width: '9%', totalRow: true},
        			         { field: 'subSuffix', title: '总利润-退款金额 (￥)', sort: true, width: '9%', totalRow: true},
        			         { field: 'suffixProbility',templet:'<div>{{d.suffixProbility || ""}}%</div>', title: '利润率', sort: true, width: '9%'}
        			         ]
        			       ],
        			       where:{orderTime:orderTime,orderTimeType:orderTimeType},
        			       page: false,
        			       limits: [50, 100, 200], // 每页条数的选择项
										 limit: 50, //默认显示20条
										 done:function(res,curr,count){
											// theadHandle().fixTh({h:200,id:'#ebayRefundCard'});
								    }
        		});
        	}else if(queryType=='cateId'){
        		table.render({
        			method:'post',
        			elem:'#ebay_refund_table',
        			url: ctx+'/ebayRefundAnalysis/listByCateClass1.html', // 数据接口
        			cols: [
        			       [ //表头
        			         { field: 'cateIdTpl',title: '一级类目',templet:"#cateIdTpl", width: '9%', sort:true},
        			         { field: 'orderNum', title: '订单数', width: '9%', sort:true},
        			         { field: 'orderTotalAmt', title: '订单金额(￥)', sort: true, width: '9%'},
        			         { field: 'refundOrderNum', title: '退款订单数量', sort: true, width: '9%'},
        			         { field: 'refundAmt', title: '退款金额(￥)', width: '9%', sort:true},
        			         { field: 'refundProbility',templet:'<div>{{d.refundProbility || ""}}%</div>', title: '退款率', width: '9%', sort:true},
        			         { field: 'unitPrice', title: '客单价(￥)', sort: true, width: '9%'},
        			         { field: 'suffix', title: '总利润(￥)', sort: true, width: '9%'},
        			         { field: 'subSuffix', title: '总利润-退款金额 (￥)', sort: true, width: '9%'},
        			         { field: 'suffixProbility',templet:'<div>{{d.suffixProbility || ""}}%</div>', title: '利润率', sort: true, width: '9%'}
        			         ]
        			       ],
        			       where:{orderTime:orderTime,orderTimeType:orderTimeType},
        			       page: false,
        			       limits: [50, 100, 200], // 每页条数的选择项
										 limit: 50, //默认显示20条
										 done:function(res,curr,count){
											// theadHandle().fixTh({h:200,id:'#ebayRefundCard'});
								 }
        		});
        	}
        });  
        table.on('tool(ebay_refund_tablefilter)', function(obj) {
            var layEvent = obj.event; //获得 lay-event 对应的值
            var data = obj.data; //获得当前行数据
            var orderTime = $.trim($("#ordeTimeDiv input[name='ebayOrderTime']").val());
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
                    		method:'post',
                			elem:'#ebay_ship_table',
                			url: ctx+'/ebayRefundAnalysis/listByCountryShip.html', // 数据接口
                			where: data,
                			cols: [
                			       [ //表头
                			         { field: 'allrootLogisType', title: '物流方式', width: '9%', sort:true},
                			         { field: 'orderNum', title: '订单数', width: '9%', sort:true},
                			         { field: 'orderTotalAmt', title: '订单金额(￥)', sort: true, width: '9%'},
                			         { field: 'refundOrderNum', title: '退款订单数量', sort: true, width: '9%'},
                			         { field: 'refundAmt', title: '退款金额(￥)', width: '9%', sort:true},
                			         { field: 'refundProbility',templet:'<div>{{d.refundProbility || ""}}%</div>', title: '退款率', width: '9%', sort:true},
                			         { field: 'unitPrice', title: '客单价(￥)', sort: true, width: '9%'},
                			         { field: 'suffix', title: '总利润(￥)', sort: true, width: '9%'},
                			         { field: 'subSuffix', title: '总利润-退款金额 (￥)', sort: true, width: '9%'},
                			         { field: 'suffixProbility',templet:'<div>{{d.suffixProbility || ""}}%</div>', title: '利润率', sort: true, width: '9%'}
                			         ]
                			       ],
                			       where:{orderTime:orderTime,country:data.adCountry,orderTimeType:orderTimeType},
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
                    		method:'post',
                			elem:'#ebay_country_table',
                			url: ctx+'/ebayRefundAnalysis/listByShipCountry.html', // 数据接口
                			method:'post',
                			cols: [
                			       [ //表头
                			         { field: 'adCountry', title: '国家', width: '9%', sort:true},
                			         { field: 'orderNum', title: '订单数', width: '9%', sort:true},
                			         { field: 'orderTotalAmt', title: '订单金额(￥)', sort: true, width: '9%'},
                			         { field: 'refundOrderNum', title: '退款订单数量', sort: true, width: '9%'},
                			         { field: 'refundAmt', title: '退款金额(￥)', width: '9%', sort:true},
                			         { field: 'refundProbility',templet:'<div>{{d.refundProbility || ""}}%</div>', title: '退款率', width: '9%', sort:true},
                			         { field: 'unitPrice', title: '客单价(￥)', sort: true, width: '9%'},
                			         { field: 'suffix', title: '总利润(￥)', sort: true, width: '9%'},
                			         { field: 'subSuffix', title: '总利润-退款金额 (￥)', sort: true, width: '9%'},
                			         { field: 'suffixProbility',templet:'<div>{{d.suffixProbility || ""}}%</div>', title: '利润率', sort: true, width: '9%'}
                			         ]
                			       ],
                			       where:{orderTime:orderTime,allrootLogisType:data.allrootLogisType,orderTimeType:orderTimeType},
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
                    		method:'post',
                			elem:'#ebay_cateClass_table',
                			url: ctx+'/ebayRefundAnalysis/listByCateClass2.html', // 数据接口
							method:"post",
                			cols: [
                			       [ //表头
                			         { field: 'prodCateClass2', title: '二级类目', width: '9%', sort:true,templet:"#smt_refund_analysis_prodCate_tpl"},
                			         { field: 'orderNum', title: '订单数', width: '9%', sort:true},
                			         { field: 'orderTotalAmt', title: '订单金额(￥)', sort: true, width: '9%'},
                			         { field: 'refundOrderNum', title: '退款订单数量', sort: true, width: '9%'},
                			         { field: 'refundAmt', title: '退款金额(￥)', width: '9%', sort:true},
                			         { field: 'refundProbility',templet:'<div>{{d.refundProbility || ""}}%</div>', title: '退款率', width: '9%', sort:true},
                			         { field: 'unitPrice', title: '客单价(￥)', sort: true, width: '9%'},
                			         { field: 'suffix', title: '总利润(￥)', sort: true, width: '9%'},
                			         { field: 'subSuffix', title: '总利润-退款金额 (￥)', sort: true, width: '9%'},
                			         { field: 'suffixProbility',templet:'<div>{{d.suffixProbility || ""}}%</div>', title: '利润率', sort: true, width: '9%'}
                			         ]
                			       ],
                			       where:{orderTime:orderTime,prodCateClass1:data.prodCateClass1,orderTimeType:orderTimeType},
                			       page: false,
                		});
                    }
                })
            }
        })
    });