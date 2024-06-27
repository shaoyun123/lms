/**
 * by linzhen 
 * 20180509
 * @returns
 */
layui.use(["admin", "layer", "table", "form", "laytpl", "jquery"], function() {
	var admin = layui.admin,
		layer = layui.layer,
		$ = layui.$,
		form = layui.form,
	    table = layui.table;
	var companyObj={};//名称id和名称对象,预先加载
	loadAllCompanyName();//预先加载公司枚举值
	function alipayAcct_renderTable(){
        //渲染页面数据
        table.render({
            elem: "#alipayAcctTable",
            method: 'post',
            url: ctx + "/msgAlipayAcct/getMsgAlipayAcctList.html",
            cols: [
                [
                    //标题栏
                    { field: "alipayAcct", title: "alipay账号",width:"22%"},
                    { field: 'compName',title: "公司名称",align: 'left',width:"22%", templet: function(d){
                            return getCompNameByCompID(d);
                        }},
					{field:"appAuthToken",title:"授权状态",templet:'#app_token_status_templet',width:"20%"},
                    { title: '操作',  align: 'center', toolbar: '#alipay_operate',width:"35%" }
                ],
            ],
            page: true,
            id: "alipayAcctTable",
            skin: 'line', //行边框风格
            even: true, //开启隔行背景
            limits: [20, 50, 100],
            limit: 20
        });
	}
	    //工具条的监听事件,table.on(tool(表格的lay-filter的值))
	    table.on('tool(alipayAcctTable)', function(obj) {
	        var data = obj.data, //获得当前行数据
	            layEvent = obj.event; //获得 lay-event 对应的值
	        var id = data.id;
	        var compName=data.compName;//公司名称
	        var alipayAcct=data.alipayAcct;//账号
			var autoDownloadBillStatus = data.autoDownloadBillStatus;
	        if(layEvent=="update"){//编辑
	        	updateAlipayAcct(id,alipayAcct,compName,autoDownloadBillStatus);
	        }else if(layEvent=="stopUse"){//停用
	        	stopUseAlipayAcct(id,data.alipayAcct);
	        }else if(layEvent=="openUse"){//启用
	        	openUseAlipayAcct(id);
	        }else if(layEvent=="authToken"){
				authToken(id);
			}else if(layEvent=="cancelAuthToken"){
				cancelAuthToken(id);
			}
	    })
	    /**
	     * 搜索,重新渲染
	     */
	    var active = {
	    	reload: function() {
	            table.reload('alipayAcctTable', {
	                page: { curr: 1 }
	            });
        	}
	    };
	    /**
	     * 添加账号事件
	     */
		$('#add_alipay').click(function() {
            var options = {
                type: 1,
                title: '新增Alipay',
                btn: ['保存','关闭'],
                area: ["800px", "500px"],
                content: $('#addAlipayAcctlayer').html(),
                success: function(layero, index) {
                    form.render('select');
                },
                yes: function(index,layero) {
                	 $("#addAlipayAcctForm #submitAddAlipayAcct")[1].click();
                }
            }
            listAllCompanyName();
            var index = admin.popup(options);
        })
	/**
	 * 添加账号表单提交
	 */
	  form.on('submit(addAlipayAcct)', function(data){
		  var alipayAcct=data.field.alipayAcct;
		  if(alipayAcct==null||$.trim(alipayAcct)==''){
			  layer.msg("添加支付宝账号失败,支付宝账号不能为空!",{icon:0});
			  return false;
		  }
		  // else if(!validateEmail(alipayAcct)){
			//   layer.msg("添加支付宝账号失败,支付宝账号格式不对!",{icon:0});
			//   return false;
		  // }
		  $.ajax({
	            type: "post",
	            url: ctx + "/msgAlipayAcct/addOneAlipayAcct.html",
	            dataType: "json",
	            data: data.field,
	            success: function(returnData) {
	                if (returnData.code == "0000") {
	                    layer.closeAll();
	                    active['reload'].call();
	                    layer.msg("添加支付宝账号成功",{icon: 1});
	                } else {
	                    layer.msg(returnData.msg,{icon: 0});
	                }
	            },
	            error: function() {
	                layer.msg("发送请求失败",{icon:1});
	            }
	      })
	      return false;
	  });
	  /**
	   * 修改账号表单提交
	   */
	  form.on('submit(updateAlipayAcct)', function(data){
			  $.ajax({
		            type: "post",
		            url: ctx + "/msgAlipayAcct/updateAlipayAcctCompany.html",
		            dataType: "json",
		            data: data.field,
		            success: function(returnData) {
		                if (returnData.code == "0000") {
		                    layer.closeAll();
		                    active['reload'].call();
		                    layer.msg("修改支付宝账号成功",{icon:1});
		                } else {
		                    layer.msg(returnData.msg,{icon:0});
		                }
		            },
		            error: function() {
		                layer.msg("发送请求失败");
		            }
		      })
		      return false;
		  });
      /**
       * 列举所有配置的公司名称
       */
      function listAllCompanyName(companyName) {
		$.ajax({
			type: "post",
			url: ctx + "/sys/companyNameList.html",
			dataType: "json",
			success: function(returnData) {
				if(returnData.code == "0000") {
					$("#addAlipayAcctForm #addAplipayCompSelect").html("");
					$("#updateAlipayAcctForm #updateAplipayCompSelect").html("");
					$(returnData.data).each(function() {
						$("#addAlipayAcctForm #addAplipayCompSelect").append("<option value='" + this.id + "'>" + this.name + "</option>");
						if(this.id ==companyName){
							$("#updateAlipayAcctForm #updateAplipayCompSelect").append("<option value='" + this.id + "' selected='selected'>" + this.name + "</option>");
						}else{
							$("#updateAlipayAcctForm #updateAplipayCompSelect").append("<option value='" + this.id + "'>" + this.name + "</option>");
						}
					});
					form.render();
				} else {
					layer.msg(returnData.msg,{icon:0});
				}
			}
		})
     }
      
      /**
       *加载公司配置
       */
      function loadAllCompanyName() {
		$.ajax({
			type: "post",
			url: ctx + "/msgAlipayAcct/loadAllCompanyName.html",
			dataType: "json",
			success: function(returnData) {
				if(returnData.code == "0000") {
					$(returnData.data).each(function() {
						companyObj[this.id]=this.name;
					});
					form.render();
                    alipayAcct_renderTable();
				} else {
					layer.msg(returnData.msg,{icon:0});
				}
			}
		})
     }
     /**
      * 停止使用某个账号
      */
     function stopUseAlipayAcct(id,alipayAcct){
    	 layer.confirm('是否确认停用支付宝账号'+alipayAcct+'？', function(result) {
             if (result) {
				$.ajax({
					type: "post",
					url: ctx + "/msgAlipayAcct/deleteAlipayAcctById.html",
					dataType: "json",
		            data: { "id": id },
					success: function(returnData) {
					     if (returnData.code == "0000") {
		                     layer.msg("停用支付宝账号成功",{icon:1});
		                     active['reload'].call();
		                 } else {
		                     layer.msg(returnData.msg,{icon:0});
		                 }
					}
				})
          }
     	});
     }
     /**
      * 启用使用某个账号
      */
     function openUseAlipayAcct(id){
		$.ajax({
			type: "post",
			url: ctx + "/msgAlipayAcct/recoverAlipayAcctById.html",
			dataType: "json",
            data: { "id": id },
			success: function(returnData) {
			     if (returnData.code == "0000") {
                     layer.msg("启用支付宝账号成功",{icon:1});
                     active['reload'].call();
                 } else {
                     layer.msg(returnData.msg,{icon:0});
                 }
			}
		})
     }
     /**
      * 修改某个账号的公司名称
      */
     function updateAlipayAcct(id,alipayAcct,companyName,autoDownloadBillStatus){
    	 var options = {
                 type: 1,
                 title: '修改Alipay',
                 btn: ['保存','关闭'],
                 area: ["800px", "500px"],
                 content: $('#updateAlipayAcctlayer').html(),
                 success: function(layero, index) {
                	 listAllCompanyName(companyName);//赋公司默认值
                   	 $("#updateAlipayAcctForm").find("input[name='alipayAcct']").val(alipayAcct);
                   	 $("#updateAlipayAcctForm").find("input[name='id']").val(id);
					 $("#autoDownloadBillSelect").find(`option[value='${autoDownloadBillStatus}']`).prop("selected", true);
                 },
                 yes: function(index,layero) {
                 	$("#updateAlipayAcctForm #submitUpdateAlipayAcct").click();
                 }
             }
             var index = admin.popup(options);
     }
	/**
	 * 支付宝账号邮箱校验(邮箱或则手机号)
	 */
	 function validateEmail(str){
		  var regEmail = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;//邮箱正则
		  var regTelephone=/^[1][0-9]{10}$/;  //手机号正则
		  return regEmail.test(str)||regTelephone.test(str);
	 }
	 /**
	  * 根据公司id查询字典表获取对应的公司名称
	  */
	 function  getCompNameByCompID(obj){
		 if($.isEmptyObject(companyObj)){//判断公司枚举值是否为空
			 new Promise(function(resolve,rejeact){
                 console.log("公司为空加载");
				 loadAllCompanyName();//如果没有加载公司id,名称,则执行加载
			 }).then(function(){
                 console.log("公司为空加载返回");
				 return companyObj[obj.compName]?companyObj[obj.compName]:obj.compName;
			 })
		 }else{
			 return companyObj[obj.compName];
		 }
	 }

	 function cancelAuthToken(id) {
		var index = layer.open({
			title:"取消授权",
			content:"本次操作只会取消OA里面的授权，如果想彻底取消授权，请登录支付宝账户后台取消授权！",
			btn: ["确定", "关闭"],
			yes:function () {
				loading.show();
				$.ajax({
					url: ctx + '/msgAlipayAcct/cancelAlipayAcctAuthToken.html',
					type: 'POST',
					dataType: "json",
					data: {id:id},
					success: function (response) {
						loading.hide()
						if (response.code == '0000') {
							layer.closeAll()
							active['reload'].call();
							layer.msg('取消授权成功')
						} else {
							layer.msg(response.msg)
						}
					},
					error: function () {
						loading.hide()
						layer.msg('网络繁忙')
					}
				})
			}
		})
	 }
	 function authToken(id) {
		 var index =  layer.open({
			 type: 1,
			 title: "获取authToken",
			 area: ['800px', '300px'],
			 shadeClose: false,
			 content: $("#alipayGetAuthTokenLayer").html(),
			 btn: ["获取token", "关闭"],
			 yes: function(layero){
				var authCode =  $('#alipayGetAuthTokenForm [name=code]').val();
				if(!authCode){
					layer.msg('authCode不能为空!')
					return;
				}
				 loading.show()
				 $.ajax({
					 url: ctx + '/msgAlipayAcct/getAlipayAcctAuthToken.html',
					 type: 'POST',
					 dataType: "json",
					 data: {code:authCode,
					 		id:id},
					 success: function (response) {
						 loading.hide()
						 if (response.code == '0000') {
							 layer.closeAll()
							 active['reload'].call();
							 layer.msg('授权成功')
						 } else {
							 layer.msg(response.msg)
						 }
					 },
					 error: function () {
						 loading.hide()
						 layer.msg('网络繁忙')
					 }
				 })
			 },
		 });
	 }
})