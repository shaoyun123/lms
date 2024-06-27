 layui.use(['admin', 'form', 'table','laydate','upload','formSelects'], function() {
        var $ = layui.$,
            admin = layui.admin,
            element = layui.element,
            layer = layui.layer,
            laydate = layui.laydate,
            table = layui.table,
            formSelects = layui.formSelects,
            upload = layui.upload,
            form = layui.form;
        form.render(null, 'component-form-element');
        form.render(null, 'component-form-group');
        form.render();
        var orderTimeTypeIn = "1";//订单时间类型
        listByStoreAcctId(orderTimeTypeIn);
        render_hp_orgs_users("#ebay_entries_analysis_searchForm");//渲染部门销售员店铺三级联动

        
       function listByStoreAcctId(orderTimeTypeIn){
		   var orgId = $("#ebay_entries_analysis_searchForm select[name=orgId]").val();
	       var salePersonId = $("#ebay_entries_analysis_searchForm select[name=salePersonId]").val();
	       var roleNames = $("#ebay_entries_analysis_searchForm select[name=salePersonId]").data("rolelist");
	       var storeAcctId = $("#ebay_entries_analysis_searchForm select[name=platAcctId]").val();
	       var mainsite =   $("#ebay_entries_analysis_searchForm select[name=mainSite]").val();

	       	var orderTime = $.trim($("#entriesOrderTimeDiv input[name='ebayEntriesTime']").val());
    	 //表格渲染
           table.render({
   				method:'post',
               elem:'#ebay_order_entries_table',
               url: ctx+'/ebayRefundAnalysis/listEntries.html', // 数据接口
               totalRow: true,
               cols: [
                   [ //表头
                       { field: 'storeAcct', title: '店铺', width: '7%', sort:true, totalRowText: '合计'},
                       { field: 'storeSite', title: '店铺主站点', width: '7%', sort:true},
                       { field: 'storeLevel', title: '店铺等级', sort: true, width: '7%'},
                       {  title: '免费刊登数量',templet:'<div></div>', sort: true, width: '6%'},
                       { field: 'saleTotalAmt', title: '销售额(￥)', width: '7%', sort:true, totalRow: true},
                       { field: 'totalEntriesAmt', title: '账单费用(￥)', width: '7%', sort:true, totalRow: true},
                       { field: 'listingFee', title: '刊登费用(￥)', width: '7%', sort:true, totalRow: true},
                       { field: 'specialFee', title: '特色功能费用(￥)', width: '8%', sort:true, totalRow: true},
                       { field: 'dealFee', title: '成交费(￥)', width: '7%', sort:true, totalRow: true},
                       { field: 'monthFee', title: '月租费用(￥)', width: '6%', sort:true, totalRow: true},
                       { field: 'advertFee', title: '广告费(￥)', width: '6%', sort:true, totalRow: true},
                       { field: 'ortherFee', title: '其它费用(￥)', width: '6%', sort:true, totalRow: true},
                       { field: 'entriesProbility',templet:'<div>{{d.entriesProbility}}%</div>', title: '账单占比', width: '5%', sort:true},
                       { field: 'entriesDate',templet:'<div>'+orderTime+'</div>', title: '账单日期', width: '8%', sort:true},
                       { field: 'entriesCycle', title: '账单周期', width: '6%', sort:true}

                   ]
               ],
               where:{orderTime:orderTime,orderTimeTypeIn:orderTimeTypeIn,orgId:orgId,salePersonId:salePersonId,roleNames:roleNames,storeAcctId:storeAcctId,mainsite:mainsite},
               page: false,
   	        limits: [50, 100, 200], // 每页条数的选择项
               limit: 50, //默认显示20条,
               done:function(res,curr,count){
            	// console.log(orderTime)
                // theadHandle().fixTh({h:140, id:'#incomeOutCard', i:  6 });
               }
           });
       } 
       //日期范围
       laydate.render({
           elem: '#ebayEntriesTime',
           type: 'month',
           range: true
       });
       $("#ebay_entries_searchBtn").click(function(){
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
                        $('#ebay_entries_analysis_searchForm select[name="mainSite"]').append($option);
                    }
                    form.render('select');
                }
            });
        });
    });