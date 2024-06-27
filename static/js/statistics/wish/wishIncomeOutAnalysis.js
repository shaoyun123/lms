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
        var orderTimeTypeIn = "1";//订单时间类型
        render_hp_orgs_users("#wishIncomeAnalysisSearchForm");//渲染部门销售员店铺三级联动
        var storeAcctIdList;
        listByStoreAcctId(orderTimeTypeIn,storeAcctIdList);
        /**
         * 查询类型选项卡改变
         */
        element.on('tab(wish_analysis_income_tab_filter)', function (data) {
        	orderTimeTypeIn = $(this).attr("orderTimeTypeIn");
        });
        
       function listByStoreAcctId(orderTimeTypeIn,storeAcctIdList){
       	var orderTime = $.trim($("#wishBalanceAnalyze_orderTimeDiv input[name='incomeTime']").val());
    	 //表格渲染
           table.render({
               elem:'#order_table',
               url: ctx+'/wishRefundAnalysis/listIncome.html', // 数据接口
               totalRow: true,
               cols: [
                   [ //表头
                       { field: 'storeAcct', title: '店铺', width: '5%',totalRowText: '合计', sort:true},
                       { field: 'orderNum', title: '订单数', width: '5%', totalRow: true,sort:true},
                       { field: 'orderTotalAmt', title: '订单金额(￥)', sort: true,totalRow: true, width: '5%'},
                       { field: 'refundOrderNum', title: '退款订单数量', sort: true, totalRow: true,width: '5%'},
                       { field: 'refundAmt', title: '退款金额(￥)', width: '4%', totalRow: true,sort:true},
                       { field: 'actualAmt', title: '实得金额(￥)', width: '4%', totalRow: true,sort:true},
                       { field: 'refundProbility',templet:'<div>{{d.refundProbility}}%</div>', title: '退款率', width: '5%', sort:true},
                       { field: 'feeAmt', title: '平台费用(￥)', width: '4%', totalRow: true,sort:true},
                       { field: 'shippingCost', title: '物流成本(￥)', width: '4%',totalRow: true, sort:true},
                       { field: 'insuranceCost', title: '包装成本(￥)', width: '4%',totalRow: true, sort:true},
                       { field: 'cost', title: '商品成本(￥)', width: '4%', totalRow: true,sort:true},
                       { field: 'pbAmt', title: 'pb费用(￥)', width: '4%', totalRow: true,sort:true},
                       { field: 'postSubsidy', title: '邮政补贴(￥)', width: '4%', totalRow: true,sort:true},
                       { field: 'lateOrderNum', title: '延迟发货罚款数量', width: '4%', totalRow: true,sort:true},
                       { field: 'lateOrderAmt', title: '延迟发货罚款金额(￥)', width: '5%', totalRow: true,sort:true},
                       { field: 'fbwAmt', title: '海外仓罚款金额(￥)', width: '5%', totalRow: true,sort:true},
                       { field: 'ortherAmt', title: '其它罚款(￥)', width: '5%', totalRow: true,sort:true},
                       { field: 'fakeIrregAmt', title: '仿品违规(￥)', width: '5%',totalRow: true, sort:true},
                       { field: 'ortherIrregAmt', title: '其他违规(￥)', width: '5%',totalRow: true, sort:true},
                       { field: 'suffix', title: '实收总利润(￥)', width: '5%',totalRow: true, sort:true},
                       { field: 'suffixProbility', title: '实收利润率',templet:'<div>{{d.suffixProbility}}%</div>', width: '4%', sort:true}
                   ]
               ],
               where:{orderTime:orderTime,orderTimeTypeIn:orderTimeTypeIn,storeAcctIdList:storeAcctIdList},
               page: false,
   	           limits: [50, 100, 200], // 每页条数的选择项
               limit: 50, //默认显示20条,
               done:function(res,curr,count){
                // theadHandle().fixTh({h:80,i:40,id:'#incomeOutCard'});
               }
           });
       } 
       //日期范围
       laydate.render({
           elem: '#incomeTime',
           type: 'month',
           range: true
       });
       $("#income_searchBtn").click(function(){
    	   var logisAttrContents = formSelects.value("selectAttr_store");
      	 var storeAcctIdQuery = [];
      	 for (var i = 0; i < logisAttrContents.length; i++) {
      	        var logisAttr = logisAttrContents[i].value;
      	        storeAcctIdQuery.push($.trim(logisAttr));
      	    }
      	
      	 console.log(storeAcctIdQuery);
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
       		listByStoreAcctId(orderTimeTypeIn,storeAcctIdList);
       	})
    });