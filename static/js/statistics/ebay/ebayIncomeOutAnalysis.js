 layui.use(['admin', 'form', 'table','laydate','upload','formSelects'], function() {
        var $ = layui.$,
            admin = layui.admin,
            element = layui.element,
            layer = layui.layer,
            laydate = layui.laydate,
            table = layui.table,
            upload = layui.upload,
            form = layui.form;
        formSelects = layui.formSelects,
        render_hp_orgs_users("#ebay_income_searchForm");//渲染部门销售员店铺三级联动
        form.render(null, 'component-form-element');
        form.render(null, 'component-form-group');
        form.render();
        var orderTimeTypeIn = "1";//订单时间类型
        listByStoreAcctId(orderTimeTypeIn);
        /**
         * 查询类型选项卡改变
         */
        element.on('tab(ebay_analysis_income_tab_filter)', function (data) {
        	orderTimeTypeIn = $(this).attr("orderTimeTypeIn");
        });
        
       function listByStoreAcctId(orderTimeTypeIn){
       	var orderTime = $.trim($("#orderTimeDiv input[name='ebayIncomeTime']").val());
       	var orgId = $("#ebay_income_searchForm select[name=orgId]").val();
        var salePersonId = $("#ebay_income_searchForm select[name=salePersonId]").val();
        var roleNames = $("#ebay_income_searchForm select[name=salePersonId]").data("rolelist");
        var storeAcctId = $("#ebay_income_searchForm select[name=platAcctId]").val();
        console.log(roleNames)
        console.log('orgId:'+orgId+'    salePersonId:'+salePersonId+'   roleNames:'+roleNames+'   storeAcctId'+storeAcctId);
    	 //表格渲染
           table.render({
        	   method:'post',
               elem:'#ebay_order_table',
               url: ctx+'/ebayRefundAnalysis/listIncome.html', // 数据接口
               totalRow: true,
               cols: [
                   [ //表头
                       { field: 'storeAcct', title: '店铺', width: '7%', sort:true, totalRowText: '合计'},
                       { field: 'orderNum', title: '订单数', width: '7%', sort:true, totalRow: true},
                       { field: 'orderTotalAmt', title: '订单金额(￥)', sort: true, width: '7%', totalRow: true},
                       { field: 'refundOrderNum', title: '退款订单数量', sort: true, width: '6%', totalRow: true},
                       { field: 'refundAmt', title: '退款金额(￥)', width: '7%', sort:true, totalRow: true},
                       { field: 'unitPrice', title: '客单价(￥)', width: '7%', sort:true},
                       { field: 'billAmt', title: '账单费用(￥)', width: '7%', sort:true, totalRow: true},
                       { field: 'billProbility',templet:'<div>{{#  if(d.billProbility!=100){ }}{{d.billProbility}}%{{# }else{ }}0.00%{{# } }}</div>', title: '账单费用比例', width: '7%', sort:true},
                       { field: 'refundProbility',templet:'<div>{{d.refundProbility}}%</div>', title: '退款率', width: '7%', sort:true},
                       { field: 'ppAmt', title: 'pp费用(￥)', width: '7%', sort:true, totalRow: true},
                       { field: 'shippingCost', title: '物流成本(￥)', width: '7%', sort:true, totalRow: true},
                       { field: 'insuranceCost', title: '包装成本(￥)', width: '7%', sort:true, totalRow: true},
                       { field: 'cost', title: '商品成本(￥)', width: '6%', sort:true, totalRow: true},
                       { field: 'suffix', title: '实收总利润(￥)', width: '5%', sort:true, totalRow: true},
                       { field: 'suffixProbility', title: '实收利润率',templet:'<div>{{d.suffixProbility}}%</div>', width: '5%', sort:true}
                   ]
               ],
               where:{orderTime:orderTime,orderTimeTypeIn:orderTimeTypeIn,orgId:orgId,salePersonId:salePersonId,roleNames:roleNames,storeAcctId:storeAcctId},
               page: false,
   	        limits: [50, 100, 200], // 每页条数的选择项
               limit: 50, //默认显示20条,
               done:function(res,curr,count){
                // theadHandle().fixTh({h:200,id:'#ebayIncomeOutCard',i:0});
               }
           });
       } 
       //日期范围
       laydate.render({
           elem: '#ebayIncomeTime',
           type: 'month',
           range: true
       });
       $("#ebay_income_searchBtn").click(function(){
       		listByStoreAcctId(orderTimeTypeIn);
       	})
        $(function(){
            $.ajax({
                type:"post",
                url:ctx + "/srse/listmainsite.html?platCode=ebay",
                dataType:"json",
                success:function(returnData){
                    console.log(returnData);
                    if(returnData.code != "0000"){
                        layer.msg("主站点初始化失败");
                    }else{
                        var $option="<option value=''>全部</option>";
                        returnData.data.forEach(function(item){
                            $option += '<option value='+item+'>'+item+'</option>';
                        });
                        $('#ebay_income_searchForm select[name="mainSite"]').append($option);
                    }
                    form.render('select');
                }
            });
        });
    });