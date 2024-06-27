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
        form.render('select');
        formSelects = layui.formSelects
        var orderTimeType = "1";//订单时间类型
        var storeAcctIdList;

        render_hp_orgs_users("#amazon_refund_searchForm");//渲染部门销售员店铺三级联动
        listByStoreAcctId(orderTimeType);
        /**
         * 查询类型选项卡改变
         */
        element.on('tab(amazon_analysis_tab_filter)', function (data) {
        	orderTimeType = $(this).attr("orderTimeType");
        });
        
        
        
       function listByStoreAcctId(orderTimeType){
       	var orderTime = $.trim($("#amazonOrdeTimeDiv input[name='amazonOrderTime']").val());
    	 //表格渲染
           table.render({
               elem:'#amazonRefund_table',
               url: ctx+'/amazonRefundAnalysis/list.html', // 数据接口
               method:'post',
               totalRow: true,
               cols: [
                   [ //表头
                       { field: 'storeAcct', title: '店铺', sort:true, width: '10%',totalRowText: '合计'},
                       { field: 'orderNum', title: '订单数', sort:true, totalRow: true, width: '10%'},
                       { field: 'orderTotalAmt', title: '订单金额($)', sort: true, totalRow: true, width: '10%'},
                       { field: 'refundOrderNum', title: '退款订单数量', sort: true, totalRow: true, width: '10%'},
                       { field: 'refundAmt', title: '退款金额($)', width: '9%', sort:true, totalRow: true, width: '10%'},
                       { field: 'refundProbility',templet:'<div><span>{{d.refundProbility||""}}</span><span>%</span></div>', title: '退款率', sort:true, width: '10%'},
                       { field: 'unitPrice', title: '客单价($)', sort: true, width: '10%'},
                       { field: 'suffix', title: '总利润(￥)', sort: true, width: '10%'},
                       { field: 'subSuffix', title: '总利润-退款金额 (￥)', sort: true, totalRow: true, width: '10%'},
                       { field: 'suffixProbility',templet:'<div>{{d.suffixProbility}}%</div>', title: '利润率', sort: true, width: '8%' }
                   ]
               ],
               where:{orderTime:orderTime,orderTimeType:orderTimeType,storeAcctIdList:storeAcctIdList},
               page: false,
   	        limits: [50, 100, 500], // 每页条数的选择项
			   limit: 50, //默认显示20条
			   done:function(res,curr,count){
			   }
           });
       } 
       //日期范围
       laydate.render({
		   elem: '#amazonOrderTime',
		   type: 'month',
           range: true
       });
        $("#amazonRefund_searchBtn").click(function(){
        	var queryType = $("#refundAnalysisType input[name=statisticsType]:checked").val();
        	var orderTime = $.trim($("#amazonOrdeTimeDiv input[name='amazonOrderTime']").val());
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
        		}
        	}else{
        		storeAcctIdList = storeAcctIdQuery.join(',');
        	}
        	if(queryType=='country'){
        		table.render({
        			method:'post',
        			elem:'#amazonRefund_table',
					url: ctx+'/amazonRefundAnalysis/listByCountry.html', // 数据接口
					totalRow: true,
        			cols: [
        			       [ //表头
        			         { field: 'countryTpl',title: '国家',templet:"#amazonRefundCountryTpl" , width: '10%',totalRowText: '合计', sort:true},
        			         { field: 'orderNum', title: '订单数', width: '10%', sort:true,totalRow: true},
        			         { field: 'orderTotalAmt', title: '订单金额($)', sort: true, width: '10%',totalRow: true},
        			         { field: 'refundOrderNum', title: '退款订单数量', sort: true, width: '10%',totalRow: true},
        			         { field: 'refundAmt', title: '退款金额($)', width: '10%', sort:true,totalRow: true},
        			         { field: 'refundProbility',templet:'<div>{{d.refundProbility}}%</div>', title: '退款率', width: '10%', sort:true},
        			         { field: 'unitPrice', title: '客单价($)', sort: true, width: '10%'},
        			         { field: 'suffix', title: '总利润(￥)', sort: true, width: '10%',totalRow: true},
        			         { field: 'subSuffix', title: '总利润-退款金额 (￥)', sort: true, width: '10%',totalRow: true},
        			         { field: 'suffixProbility',templet:'<div>{{d.suffixProbility}}%</div>', title: '利润率', sort: true, width: '9%'}
        			         ]
        			       ],
        			       where:{orderTime:orderTime,orderTimeType:orderTimeType,},
        			       page: false,
        			       limits: [50, 100, 200], // 每页条数的选择项
						   limit: 50, //默认显示20条
						   done:function(res,curr,count){
								// theadHandle().fixTh({h:200,id:'#amazonRefundCard'});
						   }
        		});
        	}else if(queryType=='platAcctId'){
        		listByStoreAcctId(orderTimeType);
        	}else if(queryType=='platAcctIdAll'){
        		table.render({
        			method:'post',
        			elem:'#amazonRefund_table',
					url: ctx+'/amazonRefundAnalysis/listAll.html', // 数据接口
					totalRow: true,
        			cols: [
        			       [ //表头
        			         { field: 'storeAcct', title: '店铺',sort:true,width: '10%',totalRowText: '合计'},
                             { field: 'orderNum', title: '订单数', width: '10%',totalRow: true, sort:true},
                             { field: 'orderTotalAmt', title: '订单金额($)', sort: true, width: '10%',totalRow: true},
                             { field: 'refundOrderNum', title: '退款订单数量', sort: true,width: '10%',totalRow: true},
                             { field: 'refundAmt', title: '退款金额($)', width: '10%',totalRow: true},
                             { field: 'refundProbility',templet:'{{# if(d.refundProbility){ }}<div>{{d.refundProbility||""}}%{{# } }}</div>', title: '退款率', width: '10%'},
                             { field: 'unitPrice', title: '客单价($)', sort: true, width: '10%'},
                             { field: 'suffix', title: '总利润(￥)', sort: true, width: '10%',totalRow: true},
                             { field: 'subSuffix', title: '总利润-退款金额 (￥)', sort: true,width: '10%',totalRow: true},
                             { field: 'suffixProbility',templet:'<div>{{d.suffixProbility}}%</div>', title: '利润率', sort: true, width: '9%'}
        			         ]
        			       ],
        			       where:{orderTime:orderTime,orderTimeType:orderTimeType,storeAcctIdList:storeAcctIdList},
        			       page: false,
        			       limits: [50, 100, 500], // 每页条数的选择项
						   limit: 50, //默认显示20条
						   done:function(res,curr,count){
							// theadHandle().fixTh({h:200,id:'#amazonRefundCard'});
						   }
        		});
        	}else if(queryType=='logistics'){
        		table.render({
        			method:'post',
        			elem:'#amazonRefund_table',
					url: ctx+'/amazonRefundAnalysis/listByShip.html', // 数据接口
					totalRow: true,
        			cols: [
        			       [ //表头
        			         { field: 'shipTpl',title: '物流方式',templet:"#shipTpl", width: '10%', sort:true,totalRowText: '合计'},
        			         { field: 'orderNum', title: '订单数', width: '10%',totalRow: true, sort:true},
        			         { field: 'orderTotalAmt', title: '订单金额($)', sort: true, width: '10%',totalRow: true},
        			         { field: 'refundOrderNum', title: '退款订单数量', sort: true, width: '10%',totalRow: true},
        			         { field: 'refundAmt', title: '退款金额($)', width: '10%',totalRow: true, sort:true},
        			         { field: 'refundProbility',templet:'<div>{{# if(d.refundProbility){ }}<div>{{d.refundProbility||""}}%{{# } }}</div></div>', title: '退款率', width: '10%', sort:true},
        			         { field: 'unitPrice', title: '客单价($)', sort: true, width: '10%'},
        			         { field: 'suffix', title: '总利润(￥)', sort: true, width: '10%',totalRow: true},
        			         { field: 'subSuffix', title: '总利润-退款金额 (￥)', sort: true,width: '10%',totalRow: true},
        			         { field: 'suffixProbility',templet:'<div>{{# if(d.suffixProbility){ }}<div>{{d.suffixProbility||""}}%{{# } }}</div></div>', title: '利润率', sort: true, width: '9%'}
        			         ]
        			       ],
        			       where:{orderTime:orderTime,orderTimeType:orderTimeType},
        			       page: false,
        			       limits: [50, 100, 200], // 每页条数的选择项
						   limit: 50, //默认显示20条
						   done:function(res,curr,count){
							// theadHandle().fixTh({h:200,id:'#amazonRefundCard'});
						   }
        		});
			}else if(queryType=='cateId'){
				table.render({
					method:'post',
					elem:'#amazonRefund_table',
					url: ctx+'/amazonRefundAnalysis/listByCateClass1.html', // 数据接口
					totalRow: true,
					cols: [
						[ //表头
							{ field: 'cateIdTpl',title: '一级类目',templet:"#cateIdTpl", width: '10%',totalRowText: '合计', sort:true},
							{ field: 'orderNum', title: '订单数', width: '10%',totalRow: true, sort:true},
							{ field: 'orderTotalAmt', title: '订单金额($)', sort: true, width: '10%',totalRow: true},
							{ field: 'refundOrderNum', title: '退款订单数量', sort: true, width: '10%',totalRow: true},
							{ field: 'refundAmt', title: '退款金额($)', width: '10%',totalRow: true, sort:true},
							{ field: 'refundProbility',templet:'<div>{{# if(d.refundProbility){ }}<div>{{d.refundProbility||""}}%{{# } }}</div></div>', title: '退款率', width: '10%', sort:true},
							{ field: 'unitPrice', title: '客单价($)', sort: true, width: '10%'},
							{ field: 'suffix', title: '总利润(￥)', sort: true, width: '10%',totalRow: true},
							{ field: 'subSuffix', title: '总利润-退款金额 (￥)', sort: true, width: '10%',totalRow: true},
							{ field: 'suffixProbility',templet:'<div>{{# if(d.suffixProbility){ }}<div>{{d.suffixProbility||""}}%{{# } }}</div></div>', title: '利润率', sort: true, width: '9%'}
						]
					],
					where:{orderTime:orderTime,orderTimeType:orderTimeType},
					page: false,
					limits: [50, 100, 200], // 每页条数的选择项
					limit: 50, //默认显示20条
					done:function(res,curr,count){
						// theadHandle().fixTh({h:200,id:'#amazonRefundCard'});
					}
				});
        	}
        });  
        table.on('tool(refund_tablefilter)', function(obj) {
            var layEvent = obj.event; //获得 lay-event 对应的值
            var data = obj.data; //获得当前行数据
            var orderTime = $.trim($("#amazonOrdeTimeDiv input[name='amazonOrderTime']").val());
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
                			method:'post',
                			url: ctx+'/amazonRefundAnalysis/listByCountryShip.html', // 数据接口
                			where: data,
                			cols: [
                			       [ //表头
                			         { field: 'allrootLogisType', title: '物流方式', width: '9%', sort:true},
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
							elem:'#country_table',
							method:'post',
							url: ctx+'/amazonRefundAnalysis/listByShipCountry.html', // 数据接口
							method:'post',
							cols: [
								[ //表头
									{ field: 'adCountry', title: '国家', width: '9%', sort:true},
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
							elem:'#cateClass_table',
							method:'post',
							url: ctx+'/amazonRefundAnalysis/listByCateClass2.html', // 数据接口
							method:"post",
							cols: [
								[ //表头
									{ field: 'prodCateClass2', title: '二级类目', width: '9%', sort:true,templet:"#amazon_refund_analysis_prodCate_tpl"},
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
							where:{orderTime:orderTime,prodCateClass1:data.prodCateClass1,orderTimeType:orderTimeType},
							page: false,
						});
					}
				})
            }
        })
    });