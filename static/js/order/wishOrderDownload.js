 layui.use(['admin', 'form', 'table','laydate','upload','laypage'], function() {
        var $ = layui.$,
            admin = layui.admin,
            element = layui.element,
            layer = layui.layer,
            laydate = layui.laydate,
            table = layui.table,
            upload = layui.upload,
            laypage = layui.laypage,
            form = layui.form;
        form.render(null, 'component-form-element');
        form.render(null, 'component-form-group');
        form.render();
    	 //表格渲染
           table.render({
               elem:'#order_table1',
               url: ctx+'/wishOrder/downloadOrder.html', // 数据接口
               method:'post',
               cols: [
                   [ //表头
                       {type: "checkbox"},
                       { field: 'id', title: 'id', width: '5%'},
                       { field: 'jobId', title: 'job_id', width: '12%'},
                       { field: 'storeAcctId', title: '店铺', width: '5%'},
                       { field: 'platCode', title: '平台', width: '5%'},
                       { field: 'jobTime', title: '任务时间',templet: '<div>{{ Format(d.jobTime,"yyyy-MM-dd hh:mm:ss")}}</div>', width: '8%'},
                       { field: 'startDate', title: '开始时间',templet: '<div>{{ Format(d.startDate,"yyyy-MM-dd hh:mm:ss")}}</div>', width: '8%'},
                       { field: 'endDate', title: '结束时间',templet: '<div>{{ Format(d.endDate,"yyyy-MM-dd hh:mm:ss")}}</div>', width: '8%'},
                       { field: 'jobStatus', title: 'job状态', templet:'#jobStatTpl', width: '5%'},
                       { field: 'handleStatus', title: '普源和并状态',templet:'#handleStatTpl', width: '5%'},
                       { field: 'resultMsg', title: '状态信息', width: '10%',},
                       { field: 'downloadLink1', title: '文件连接', width: '10%', templet:'#seafileDownloadLink'},
                       { field: 'totalCount', title: '文件总条数', width: '5%'},
                       { field: 'processedCount', title: '成功条数', width: '5%'}
                   ]
               ],
               page: true,
   	        limits: [50, 100, 200], // 每页条数的选择项
               limit: 50, //默认显示20条
               done:function(){
                // theadHandle().fixTh({i:0}); 
               }
           });
       //日期范围
       laydate.render({
           elem: '#orderTime',
           range: true
       });
      
       
    // 搜索
       var active = {
           reload: function() {
          	var storeAcctId = $.trim($("#orderSearchForm input[name='storeAcctId']").val());
          	var  allrootStatus = $("#orderSearchForm select[name='allrootStatus']").val();
          	var  wishStatus = $("#orderSearchForm select[name='wishStatus']").val();
          	console.log(wishStatus+"-"+allrootStatus+storeAcctId);
               //执行重载
               table.reload('order_table1', {
//                   page: { curr: 1 },
                   where: {
                	   storeAcctId:storeAcctId,
                	   wishStatus:wishStatus,
                	   allrootStatus:allrootStatus
                   }
               });
           }
       };
       $('#refund_searchBtn').click(function() {
           var type = $(this).data('type');
           active[type] ? active[type].call(this) : '';
       });
     //批量处理
       $('#batchGetJobStatus').click(function(){
    	   var checkStatus = table.checkStatus('order_table1')
           ,data = checkStatus.data;
     	  if(data.length==0){
     		  layer.msg("请选择需要处理的信息！");
     		  return;
     	  }
		 $.ajax({
			 type: "POST",
			 url: ctx + "/wishOrder/batchGetJobStatus.html",
			 data: {'data':JSON.stringify(data)},
			 async: true,
			 dataType: "json",
			 success: function (returnData) {
       				 layer.msg("操作成功");
			 },
			 error: function () {
				 layer.msg("服务器正忙");
			 }
		 });
		 layer.msg("提交成功！");	 
       });
       
       //查询定时订单
       $('#getChangeOrders').click(function(){
		 $.ajax({
			 type: "POST",
			 url: ctx + "/wishOrder/batchGetUpdateOrders.html",
			 data: {},
			 async: true,
			 dataType: "json",
			 success: function (returnData) {
       				 layer.msg("操作成功");
			 },
			 error: function () {
				 layer.msg("服务器正忙");
			 }
		 });
		 layer.msg("提交成功！");	 
       });
    });