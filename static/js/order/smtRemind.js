 layui.use(['admin', 'form', 'table','laydate','upload', 'formSelects'], function() {
        var $ = layui.$,
            admin = layui.admin,
            element = layui.element,
            layer = layui.layer,
            laydate = layui.laydate,
            table = layui.table,
            upload = layui.upload,
			formSelects = layui.formSelects,
	 		form = layui.form;

        render_hp_orgs_users("#smt_order_remind_searchForm");//渲染部门销售员店铺三级联动
       function listByStoreAcctId(){
           var storeAcctId = $('[name=smtRemind_smtorderremindsearchForm_select]').val();
           if (storeAcctId == null || storeAcctId == '') {
                layer.msg("请选择店铺",{icon:0});
                return false;
           }
           //表格渲染
           table.render({
               elem:'#smt_order_remind_table',
               url: ctx+'/orderRemind/storeInfo.html', // 数据接口
               method:'post',
               cols: [
                   [ //表头
                       { field: 'orderType', title: '订单类型', width: '10%'},
                       { field: 'orderNum', title: '订单数', width: '10%'},
                       { field: 'orderTotalAmt', title: '总金额($)',  width: '10%'},
                       { field: 'lastyUpdateTime',templet: '<div>{{ Format(d.lastyUpdateTime,"yyyy-MM-dd hh:mm:ss")}}</div>', title: '更新时间',  width: '10%'},
                       { title: '操作', align: 'center', toolbar: '#smtOrderRemindProcessBar'}
                   ]
               ],
               where:getSearchInfoData(),
               id:"smt_order_remind_table",
               page: false,
   	        	limits: [50, 100, 500], // 每页条数的选择项
			   limit: 50, //默认显示20条
			   done:function(res,curr,count){
			   }
           });
       }
     function getSearchInfoData() {
           var storeAcctId = $('[name=smtRemind_smtorderremindsearchForm_select]').val();
           var obj = new Object();
           obj.storeAcctId = storeAcctId;
           return obj;
     }
        $("#smt_order_remind_searchBtn").click(function(){
        	var storeAcctId = $('[name=smtRemind_smtorderremindsearchForm_select]').val();
        	var obj = new Object();
        	obj.storeAcctId =storeAcctId;
			listByStoreAcctId(obj);
        });


         $("#smt_order_sync_Btn").click(function(){
             var storeAcctId = $('[name=smtRemind_smtorderremindsearchForm_select]').val();
             var obj = new Object();
             obj.storeAcctId =storeAcctId;
             layer.msg('操作成功，正在同步，请稍后查看！')
             $.ajax({
                 url:ctx+'/orderRemind/syncOrderStatus.html',
                 type:'post',
                 dataType:'json',
                 data:obj,
                 success:function(retureData){
                     layer.msg(retureData.msg)
                 }
             })
         });
    });
     function smtRemind_copyTxt(obj, event){
         if (event) {
             event.stopPropagation();
         }
         var parentDom = $(obj).parent();
         var txt = parentDom.find('div.ms-cont1').text();
         var oInput = document.createElement('input'); //创建一个input元素
         oInput.value = txt;
         parentDom.append(oInput);
         oInput.select(); // 选择对象
         document.execCommand("Copy"); // 执行浏览器复制命令
         oInput.remove();
         layer.msg('复制成功');
         return false;
     }