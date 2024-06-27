// 定义一个纠纷处理的命名空间
var objj = new Object();
var index;
var issue_process_type = "1";//issue选择查看
var sellerLoginId;
var disputeHandle = {
    layer: layui.layer,
    layerModel: function(data) {//弹框封装
        var layer = this.layer;
        var obj = {
            type: 1,
            title: '标题',
            area: ['100%', '100%'],
            content: 'body',
            btn: ['提交', '关闭'],
            yes: function(index, layero) {},
            success: function(layero, index) {}
        };
        $.extend(obj, data);
        var index = layer.open({
            type: obj.type,
            title: obj.title,
            area: obj.area,
            btn: obj.btn,
            content: obj.content,
            yes: obj.yes,
            success: obj.success,
						end: obj.end
        });
    },
		needChangeStatus: 0, //详情弹窗中记录订单是否被同意或者拒绝
		// 处理状态
		IssueStatus:{
			'-1':'-1',
			'1':'待卖家处理',
			'2':'买家确认中',
			'3':'待平台介入',
			'4':'平台退款中',
			'5':'买家退货中',
			'6':'待卖家收货',
			'7':'处理中'
		},
    detail: function(data,trData) {//纠纷详情的弹框处理
    	var datareturn;
    	$.ajax({
  			 type: "POST",
  			 url: ctx + "/smtIssue/getIssueInfo.html",
  			 data: {'issueId':JSON.stringify(data)},
  			 async: false,
  			 dataType: "json",
  			 success: function (returnData) {
  				datareturn = returnData;
  				//  console.log(returnData);
  			 },
  			 error: function () {
  				 layer.msg("服务器正忙");
  			 }
  		 });
        var _this = this,
        table = layui.table
        var data = {
            title: '纠纷详情',
            content: $('#disputeDetailLayer').html(),
            success: function(layero, index) {
                _this.solution(datareturn);//展示方案信息
                _this.picture(datareturn);//展示纠纷图片
                _this.orderInfo(datareturn);//展示订单信息
                _this.tracking(datareturn);//展示物流信息
                _this.processMsg(datareturn);//展示流程信息
                _this.sellerBuyerMsg(datareturn.orderId);//站内信
                _this.buyerSolutionAgree(datareturn);//同意买家方案弹框
	            _this.platFormSolutionAgree(datareturn);//同意平台方案弹框
	            _this.refuseAdd(datareturn);//拒绝并新增弹框
	            _this.upload(datareturn);//上传证据弹框
	            _this.stepBar(datareturn);//步骤条处理函数
	            _this.orderMsg();//订单留言处理函数
	            _this.messageSubmit(datareturn);
	            _this.childOrder(datareturn);//子订单展示
	            _this.delayOrderReceive(datareturn);//延长收货按钮
            },
            yes: function(index, layero) {
						// console.log(index);
            },
						end: function(){
							if(_this.needChangeStatus){
								_this.changeOrderStatus(trData)
							}
							_this.needChangeStatus = 0
						}

        };
        this.layerModel(data);
    },
    reloadMsg: function(data){//重置所有渲染模块
    	var _this=this;
    	var datareturn;
    	$.ajax({
  			 type: "POST",
  			 url: ctx + "/smtIssue/getIssueInfo.html",
  			 data: {'issueId':JSON.stringify(data)},
  			 async: false,
  			 dataType: "json",
  			 success: function (returnData) {
  				datareturn = returnData;
  				//  console.log(returnData);
  			 },
  			 error: function () {
  				 layer.msg("服务器正忙");
  			 }
  		 });
    	$("#buyer_seller_message_info").html("");
        $("#img_li").html("");
        $("#message_info_img").html('');
        $("#seller_solution_table").html('')
        $("#buyer_solution_table").html('')
         document.getElementById("platSoluDiv").style.display='none';
        document.getElementById("buyerSoluDiv").style.display='none';
        document.getElementById("sellerSoluDiv").style.display='none';
        $("#platform_solution_table").html('')
        $("#seller_picture").html('')
        document.getElementById("sellerPicDiv").style.display='none';
        $("#buyer_picture").append('')
        document.getElementById("buyerPicDiv").style.display='none';
        document.getElementById("zhengjuPicDiv").style.display='none';
       /**
        * 解除原事件绑定
        */
        $('#platformSolutionAgreeBtn').off("click").on("click",function(){
        })
        $('#batchRefuseSolution').off("click").on("click",function(){
		 });
        $('.disputeUploadProof').off("click").on("click",function(){
            })
        $('#delayOrderReceive').off("click").on("click",function(){
        })
         $('#buyerSolutionAgreeBtn').off("click").on("click",function(){
        })
        $('#messageSubmit').off("click").on("click",function(){
        })
        $('.disputeRefuseAdd').off("click").on("click",function(){
        })
        $("#issue_order_info").html('')
        $("#issue_tracking_msg").html('')
        _this.solution(datareturn);//展示方案信息
        _this.picture(datareturn);//展示纠纷图片
        _this.orderInfo(datareturn);//展示订单信息
        _this.tracking(datareturn);//展示物流信息
        _this.processMsg(datareturn);//展示流程信息
        _this.sellerBuyerMsg(datareturn.orderId);//站内信
        _this.buyerSolutionAgree(datareturn);//同意买家方案弹框
        _this.platFormSolutionAgree(datareturn);//同意平台方案弹框
        _this.refuseAdd(datareturn);//拒绝并新增弹框
        _this.upload(datareturn);//上传证据弹框
        _this.stepBar(datareturn);//步骤条处理函数
        _this.orderMsg();//订单留言处理函数
        _this.messageSubmit(datareturn);
        _this.childOrder(datareturn);
        _this.delayOrderReceive(datareturn);//延长收货按钮
    },
    sellerBuyerMsg: function(orderId){//站内信
    	$.ajax({
			 type: "POST",
			 url: ctx + "/smtIssue/getMessageInfo.html",
			 data: {orderId:orderId},
			 async: false,
			 dataType: "json",
			 success: function (data) {
				 sellerLoginId = data.sellerLoginName;
				 var sellerLoginName = data.sellerLoginName;
				 var dataList = data.detailList;
				 var sendername = '';
				//  console.log(data)
				 if(dataList!=null&& dataList!='[]' && dataList.length!=0){
					 sendername = dataList[0].senderName;
					 /**
					  * 站内信参数
					  */
					 objj.prodMessageDetaiSmt = dataList[0];
					 var html = '';
					 for(var x = 0;x<dataList.length;x++){
						 if(dataList[x].senderName !=sendername){
							 html +='<div class="disputeMsgRecordR"><div class="disputeMsgRecordRTitle">'+dataList[x].senderName+'(merchant):'+Format(dataList[x].gmtCreate,"yyyy-MM-dd hh:mm:ss")+'</div>';
					         html += '<div class="disputeMsgRecordRCont">'+dataList[x].content+'</div></div>';
						 }else{
							 html +='<div class="disputeMsgRecordL"><div class="disputeMsgRecordLTitle">'+dataList[x].senderName+':'+Format(dataList[x].gmtCreate,"yyyy-MM-dd hh:mm:ss")+'</div>';
					         html += '<div class="disputeMsgRecordLCont">'+dataList[x].content+'</div></div>';
						 }
					 }
					 $("#buyer_seller_message_info").html(html);
				 }
			 },
			 error: function () {
				 layer.msg("服务器正忙");
			 }
		 });

    },
    delayOrderReceive: function(datareturn){//延长收货
        var _this = this;
        var data = datareturn.storeAcctId+'&'+datareturn.orderId;
      /*  var  options = {
			title: '批量延长收货',
	        type: 1,
	        btn: ['提交', '关闭'],
	        content: $('#delayDaysInfotpl').html(),
	        area: ['450px', '250px'],
            yes:function(index,layero){
            	var delayDay = $("#delay_days").val();
            	$.ajax({
       			 type: "POST",
       			 url: ctx + "/smtIssue/batchDelayDays.html",
       			 data:{itemIds:data,delayDay:delayDay},
       			 async: false,
       			 dataType: "json",
       			 success: function (data) {
       				if(data!=null && data!=""){
       					layer.msg(data.msg);
       				}
    				_this.reloadMsg(datareturn.issueId);
       			 },
       			 error: function () {
       				 layer.msg("服务器正忙");
       			 }
       		 });
            }
        }*/

        $('#delayOrderReceive').on("click",function(){
         	window.open("https://trade.aliexpress.com/order_detail.htm?orderId="+datareturn.orderId+"");
//             _this.layerModel(options);
        })
  },
    buyerSolutionAgree: function(datareturn){//同意方案的弹框处理
        var _this = this;
        var  options = {
            title: '同意买家方案',
            area: ['500px','200px'],
            btn: ['确定','取消'],
            content: '<div style="padding:20px">当双方都同意后,纠纷会按照该方案执行,同意后无法取消,请确认是否执行该方案?</div>',
            yes:function(index,layero){
            	var obj = new Object();
         	   obj.issueId = datareturn.issueId;
         	   obj.buyerLoginId = datareturn.buyerLoginId;
         	   obj.storeAcctId = datareturn.storeAcctId;
         	   for(var i=0;i<datareturn.list.length;i++){
         		   if(datareturn.list[i].solutionOwner =='buyer'){
         			  obj.buyerSolutionId = datareturn.list[i].solutionId;
         			  obj.addSolutionType = datareturn.list[i].solutionType;
         		   }
         	   }
         	//    console.log(JSON.stringify(obj))
         	   $.ajax({
         		  beforeSend: function(){
						 loading.show();
			          },
         			 type: "POST",
         			 url: ctx + "/smtIssue/agreeSolution.html",
         			 data: obj,
         			 async: true,
         			 dataType: "json",
         			 success: function (data) {
         				loading.hide();
         				if(data.code=='0000'){
        					layer.msg("同意买家方案成功");
									_this.needChangeStatus = 1
        				}else{
        					layer.msg("同意买家方案失败");
        				}
        				_this.reloadMsg(datareturn.issueId);
         			 },
         			 error: function () {
         				 layer.msg("服务器正忙");
         			 }
         		 });
            }
        }

        $('#buyerSolutionAgreeBtn').on("click",function(){
             _this.layerModel(options);
        })
  },
  platFormSolutionAgree: function(datareturn){//同意平台方案的弹框处理
      var _this = this;
      var  options = {
          title: '同意平台方案',
          area: ['500px','200px'],
          btn: ['确定','取消'],
          content: '<div style="padding:20px">当双方都同意后,纠纷会按照该方案执行,同意后无法取消,请确认是否执行该方案?</div>',
          yes:function(index,layero){
        	  var obj = new Object();
        	   obj.issueId = datareturn.issueId;
        	   obj.buyerLoginId = datareturn.buyerLoginId;
        	   obj.storeAcctId = datareturn.storeAcctId;
        	   for(var i=0;i<datareturn.list.length;i++){
        		   if(datareturn.list[i].solutionOwner =='platform'){
        			  obj.buyerSolutionId = datareturn.list[i].solutionId;
        			  obj.addSolutionType = datareturn.list[i].solutionType;
        		   }
        	   }
        	//    console.log(JSON.stringify(obj))
        	   $.ajax({
        		   beforeSend: function(){
						 loading.show();
			          },
        			 type: "POST",
        			 url: ctx + "/smtIssue/agreeSolution.html",
        			 data: obj,
        			 async: true,
        			 dataType: "json",
        			 success: function (data) {
        				 loading.hide();
        				if(data.code='0000'){
        					layer.msg("同意平台方案成功");
        				}else{
        					layer.msg("同意平台方案失败");
        				}
        				_this.reloadMsg(datareturn.issueId);
        			 },
        			 error: function () {
        				 layer.msg("服务器正忙");
        			 }
        		 });
          }
      }

      $('#platformSolutionAgreeBtn').on("click",function(){
           _this.layerModel(options);
      })
},
  messageSubmit: function(datareturn){//提交留言
	  var _this = this;
	  $('#messageSubmit').on("click",function(){
		  var aa = layui.layedit.getContent(index);
          objj.content = aa;
          objj.orderId = datareturn.orderId;
          objj.buyerLoginId = datareturn.buyerLoginId;
          objj.storeAcctId = datareturn.storeAcctId;
          objj.sellerLoginId = datareturn.clientId;
		//   console.log(objj)
		  $.ajax({
			  beforeSend: function(){
					 loading.show();
		          },
 			 type: "POST",
 			 url: ctx + "/smtIssue/submitMessage.html",
 			 data: {obj:JSON.stringify(objj)},
 			 async: true,
 			 dataType: "json",
 			 success: function (data) {
 				loading.hide();
 				if(data.code='0000'){
 					layer.msg("处理成功");
 				}else{
 					layer.msg("处理失败");
 				}
 				_this.reloadMsg(datareturn.issueId);
 			 },
 			 error: function () {
 				 layer.msg("服务器正忙");
 			 }
 		 });
     })
  },
    refuseAdd: function(datareturn){//拒绝并新增方案弹框处理
    	// console.log('1314520'+JSON.stringify(datareturn))
      var _this = this;
      var options = {
        title:'拒绝并新增方案',
        content: $('#disputeRefuseAddLayer').html(),
        area:['50%','50%'],
        yes:function(index,layero){
    	   var obj = new Object();
       	   var queryType = $("#refundTypeDiv input[name=refundType]:checked").val();
    	   obj.refundAmount = $("#refund_amount").val()
    	   obj.solutionContext = $("#smtIssue_refund_remark").val();
    	   obj.issueId = datareturn.issueId;
    	   obj.buyerLoginId = datareturn.buyerLoginId;
    	   obj.addSellerSolution = true;
    	   obj.storeAcctId = datareturn.storeAcctId;
    	   obj.addSolutionType = queryType;
    	   for(var i=0;i<datareturn.list.length;i++){
    		   if(datareturn.list[i].solutionOwner =='buyer'){
    			   obj.buyerSolutionId = datareturn.list[i].solutionId;
    			   obj.refundAmountCurrency =datareturn.list[i].refundMoneyCurrency;
    		   }
    	   }
    	//    console.log(JSON.stringify(obj))
    	   $.ajax({
    		   beforeSend: function(){
					 loading.show();
		          },
    			 type: "POST",
    			 url: ctx + "/smtIssue/addOrUpdateSolution.html",
    			 data: obj,
    			 async: true,
    			 dataType: "json",
    			 success: function (data) {
    				 loading.hide();
    				if(data.code=='0000'){
    					layer.msg("处理成功");
							_this.needChangeStatus = 1
    					layer.close(index);
    				}else{
    					layer.msg(data.msg);
    				}
    				_this.reloadMsg(datareturn.issueId);
    			 },
    			 error: function () {
    				 layer.msg("服务器正忙");
    			 }
    		 });
        },
        success:function(layero){
          layui.form.render('radio');
			Promise.all([smtissue_getEmailType(), smtissue_etEmailName()]).then(function(result){
				//邮件数组
				var emailTypeArr = result[0];
				//邮件名数组
				var emailNameArr = result[1];
				//邮件dom渲染
				commonRenderSelect('issue_template_type', emailTypeArr, {
					name: 'name',
					code: 'name'
				}).then(function(){
					layui.form.render('select');
				});
				//邮件名称dom渲染
				commonRenderSelect('issue_template_sel', emailNameArr, {
					name: 'name',
					code: 'id'
				}).then(function(){
					layui.form.render('select');
				});
				//联动
				var issue_targetSel = layero.find('#issue_template_sel');
				layui.form.on('select(issue_template_type_filter)', function(data){
					smtissue_etEmailName(data.value).then(function(emailNameresult){
						var optStrs = '';
						if(emailNameresult.length){
							for(var j=0;j<emailNameresult.length; j++){
								var emailNameItem = emailNameresult[j];
								optStrs +=`<option value="${emailNameItem.id}">${emailNameItem.name}</option>`;
							}
						}else{
							optStrs +=`<option value="">请选择</option>`;
						}
						issue_targetSel.html(optStrs);
						layui.form.render('select');
					});
				});
			})
        }
      };

      $('.disputeRefuseAdd').on("click",function(){
           _this.layerModel(options);
      });
    },
    upload: function(datareturn){//上传证据
           var _this = this;
           var options = {
             title: '上传证据',
             area: ['50%','50%'],
             btn: ['确定','关闭'],
             content: $('#disputeUploadProofLayer').html(),
             success: function(){
                _this.uploadImg();
             },
             yes: function(){
            	 var issueId = datareturn.issueId
            	//  console.log("订单id："+issueId)
            	 var img = document.getElementById('img_li').childNodes;
            	 var imageList = [];
            	 for(var i=0;i<img.length;i++){
            		 imageList.push(img[i].src)
            	 }
            	 var object = new Object();
            	 object.issueId = issueId;
            	 object.buyerLoginId = datareturn.buyerLoginId;
            	 object.imageList  = imageList;
            	 object.storeAcctId = datareturn.storeAcctId;
            	 $.ajax({
            		 beforeSend: function(){
						 loading.show();
			          },
        			 type: "POST",
        			 url: ctx + "/smtIssue/uploadLoadIssueImg.html",
        			 data:{data:JSON.stringify(object)},
        			 async: true,
        			 dataType: "json",
        			 success: function (data) {
        				 loading.hide()
        				if(data.code=='0000'){
        					layer.msg("处理成功");
        				}else{
        					layer.msg(data.msg);
        				}
        				_this.reloadMsg(datareturn.issueId);
        			 },
        			 error: function () {
        				 layer.msg("服务器正忙");
        			 }
        		 });
             }
           };

           $('.disputeUploadProof').on("click",function(){
              _this.layerModel(options);
           })
    },
    stepBar: function(datareturn) {//步骤条
    	//进度条开始时间
    	var createDate = new Date(datareturn.gmtCreate);
    	$("#issue_start_date").text(Format(datareturn.gmtCreate,"yyyy-MM-dd"));
    	var smtProcessYuji = createDate.setDate(createDate.getDate()+5);
    	// console.log(smtProcessYuji)
    	var solution = datareturn.list;
    	$("#issue_smt_process_date").text("预计时间："+Format(smtProcessYuji,"yyyy-MM-dd"));
    	var smtEndYuji = createDate.setDate(createDate.getDate()+7);
    	$("#issue_smt_end_date").text("预计时间："+Format(smtEndYuji,"yyyy-MM-dd"));
        if(solution.length!=0){
        	/**
        	 * 预计平台介入时间为五天
        	 */
            for(var i=0;i<solution.length;i++){
                if(solution[i].solutionOwner =='platform'){
                	document.getElementById("startDisputeDash").setAttribute("class","disputeDash disputeProcessD");
                	document.getElementById("proDisputeCircle").setAttribute("class","disputeCircle disputeSuccessC");
                	$("#issue_smt_process_date").text(Format(solution[i].gmtCreate,"yyyy-MM-dd"));
                }
                if(solution[i].status =='reached'){
                	document.getElementById("startDisputeDash").setAttribute("class","disputeDash disputeProcessD");
                	document.getElementById("proDisputeDash").setAttribute("class","disputeDash disputeProcessD");
                	document.getElementById("proDisputeCircle").setAttribute("class","disputeCircle disputeSuccessC");
                	document.getElementById("endDisputeCircle").setAttribute("class","disputeCircle disputeSuccessC");
                	$("#issue_smt_end_date").text(Format(solution[i].gmtCreate,"yyyy-MM-dd"));
                }
            }
        }


    },
    uploadImg: function(){//上传图片功能
      var opts = {
        uploader:ctx + "/prodTpl/uploadPic.html",
        onSelect: function(files){
            // console.log(files);
            // console.log('select');
            return true;
        },
        onUploadSuccess: function(file, data){
           if(data.code === '9999'){
        	   layer.msg(data.msg);
        	   return;
           }
           var chid = document.getElementById('img_li').childNodes.length;
           var endmsg = data.msg.substring(data.msg.lastIndexOf(".")+1,data.msg.length)
           if(endmsg!=='jpg' && endmsg!=='jpeg' && endmsg!=='png'){
        	   layer.msg("文件格式必须是JPG/JPEG/PNG。");
        	   return;
           }
           if(chid>2){
        	   layer.msg("最多上传三张证据图片。");
        	   return;
           }
        //    console.log("图片个数："+chid);
           var HTML= '<img src='+ data.msg +' alt=""  width="150" height="150">';
           $("#img_li").append(HTML);
        }
      };
      lmsUploadImg('#disputeUploadImg',opts);
    },
    orderMsg: function(){//订单留言
        // 富文本处理
        index = layui.layedit.build('disputeRichText', {
            tool: ['face'],
            height: 180 //设置编辑器高度
        });
        //上传图片
        var opts = {
            multi: false,
            uploader:ctx + "/prodTpl/uploadPic.html",
            onSelect: function(files){
                // console.log(files);
                // console.log('select');
                return true;
            },
            onUploadSuccess: function(file, data){
                // console.log(file);
                // console.log(data);
                // console.log('success')
                $("#message_info_img").html('<img src='+data.msg+' alt=""  width="150" height="150">');
                objj.img = data.msg;
            }
        };
      lmsUploadImg('#disputeOrderImg',opts);
    },
    solution: function(datareturn){//展示方案信息
        $("#orderid_one").html('<a href="https://trade.aliexpress.com/order_detail.htm?orderId='+datareturn.orderId+'"target="_blank">'+datareturn.orderId+'</a>');
        $("#issue_reason_one").text(datareturn.reasonChinese);

        if(datareturn.issueStatus=='processing'){
        	$("#issue_status_one").text("纠纷处理中");
        }else{
        	$("#issue_status_one").text("纠纷已结束");
        }
    	var createDate = new Date(datareturn.gmtCreate);

    	var smtendDate = createDate.setDate(createDate.getDate()+5);
    	if(datareturn.sellerResponseTime.search("分钟") != -1){
    		$("#issue_click_one").text('买家已经提起纠纷，处理时间还有：'+datareturn.sellerResponseTime+'，否则将按照买家方案进行退货或退款');
    	}else{
    		$("#issue_click_one").text(datareturn.sellerResponseTime);
    	}
        var solution = datareturn.list;
        // console.log(solution)
        if(solution.length!=0){
            for(var i=0;i<solution.length;i++){
                if(solution[i].solutionOwner =='seller'){
                	document.getElementById("uploadImgBtn").setAttribute("class","layui-btn layui-btn-sm disputeUploadProof");
                	document.getElementById("uploadImgBtn").disabled=false;
                	var html = '<tr><td>备&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注:</td><td>'+solution[i].content+'</td></tr>';
                    if(solution[i].solutionType=='refund'){
                    	html+='<tr><td>方案类型:</td><td>退        款</td></tr>';
                    }else if(solution[i].solutionType=='return_and_refund'){
                    	html+='<tr><td>方案类型:</td><td>退货并且退款</td></tr>';
                    }                    html+='<tr><td>退款金额:</td><td>'+solution[i].refundMoneyPost+'('+solution[i].refundMoneyPostCurrency+')</td></tr>';
                    if(solution[i].status=='wait_buyer_accept'){
                    	html+='<tr><td>状&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;态:</td><td>等待买家同意</td></tr>';
                    }else if(solution[i].status=='buyer_refused'){
                    	html+='<tr><td>状&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;态:</td><td>买家拒绝方案</td></tr>';
                    }else if(solution[i].status=='reached'){
                    	html+='<tr><td>状&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;态:</td><td>方案结束</td></tr>';
                    }
                    $("#seller_solution_table").append(html)
                    document.getElementById("sellerSoluDiv").style.display='';
                }else if(solution[i].solutionOwner =='buyer'){
                    var html = '<tr><td>备&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注:</td><td>'+solution[i].content+'</td></tr>';
                    if(solution[i].solutionType=='refund'){
                    	html+='<tr><td>方案类型:</td><td>退       款</td></tr>';
                    }else if(solution[i].solutionType=='return_and_refund'){
                    	html+='<tr><td>方案类型:</td><td>退货并且退款</td></tr>';
                    }                    html+='<tr><td>退款金额:</td><td>'+solution[i].refundMoneyPost+'('+solution[i].refundMoneyPostCurrency+')</td></tr>';
                    if(solution[i].status=='wait_seller_accept'){
                    	html+='<tr><td>状&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;态:</td><td>等待卖家同意</td></tr>';
                    }else if(solution[i].status=='reached'){
                    	html+='<tr><td>状&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;态:</td><td>方案结束</td></tr>';
                    }else{
                    	html+='<tr><td>状&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;态:</td><td>'+solution[i].status+'</td></tr>';
                    }
                    $("#buyer_solution_table").append(html)
                    document.getElementById("buyerSoluDiv").style.display='';
                }else{
                    var html = '<tr><td>备&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注:</td><td></td></tr>';
                    if(solution[i].solutionType=='refund'){
                    	html+='<tr><td>方案类型:</td><td>退款</td></tr>';
                    }else if(solution[i].solutionType=='return_and_refund'){
                    	html+='<tr><td>方案类型:</td><td>退货并且退款</td></tr>';
                    }
                    html+='<tr><td>退款金额:</td><td>'+solution[i].refundMoneyPost+'('+solution[i].refundMoneyPostCurrency+')</td></tr>';
                    if(solution[i].status=='wait_buyer_and_seller_accept'){
                    	html+='<tr><td>状&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;态:</td><td>等待卖家买家同意</td></tr>';
                    }else if(solution[i].status=='reached'){
                    	html+='<tr><td>状&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;态:</td><td>方案结束</td></tr>';
                    }else{
                    	html+='<tr><td>状&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;态:</td><td>'+solution[i].status+'</td></tr>';
                    }

                    $("#platform_solution_table").append(html)
                    document.getElementById("platSoluDiv").style.display='';
                }
            }
        }

    },
    picture: function(datareturn){//展示纠纷图片
        var picture = datareturn.listPicture;
        if(picture.length!=0){
            for(var i=0;i<picture.length;i++){
                if(picture[i].owner =='seller'){
                    var html = '<li><img src='+picture[i].filePath+' alt="" width="150" height="150" class="img_show_hide"></li>';
                    $("#seller_picture").append(html)
                    document.getElementById("sellerPicDiv").style.display='';
                    document.getElementById("zhengjuPicDiv").style.display='';

                }else if(picture[i].owner =='buyer'){
                    var html = '<li><img src='+picture[i].filePath+' alt="" width="150" height="150" class="img_show_hide"></li>';
                    $("#buyer_picture").append(html)
                    document.getElementById("buyerPicDiv").style.display='';
                    document.getElementById("zhengjuPicDiv").style.display='';

                }
            }
        }
    },
    orderInfo: function(datareturn){//展示订单信息
        var orderInfo = datareturn.prodOrderInfoSmt;
        // console.log(orderInfo);
        var Html = '<tr><td>订单编号:</td><td>'+datareturn.orderId+'</td></tr>';
        Html +='<tr><td>物流方式:</td><td>'+orderInfo.logisticsServiceName+'</td></tr>';
        Html +='<tr><td>订单金额:</td><td>'+orderInfo.orderAmount+'('+orderInfo.orderAmountCurrency+')</td></tr>';
        Html +='<tr><td>创建时间:</td><td>'+Format(orderInfo.gmtCreate,"yyyy-MM-dd hh:mm:ss")+'</td></tr>';
        Html +='<tr><td>纠纷商品:</td><td>'+datareturn.productName+'</td></tr>';
        Html +='<tr><td>收货地址:</td><td>'+orderInfo.receDetailAddress+' '+orderInfo.receCity+' '+orderInfo.receCountry+' '+orderInfo.receZip+'</td></tr>';

        $("#issue_order_info").append(Html)
    },
    tracking: function(datareturn){//展示物流信息
    	$("#trackingInfo").text("物流方式："+datareturn.prodOrderInfoSmt.logisticsServiceName+"物流跟踪号："+datareturn.prodOrderInfoSmt.logisticsNo);
        $("#trackingDateReceive").text("剩余收货时间："+datareturn.timeToReceive);
    	var trackingList = datareturn.listTracking;
        if(trackingList.length!=0){
            for(var i=0;i<trackingList.length;i++){
                var htmltrack = '<tr><td>'+Format(trackingList[i].eventDate,"yyyy-MM-dd hh:mm:ss")+':</td><td>'+trackingList[i].eventDesc+'</td></tr>';
                $("#issue_tracking_msg").append(htmltrack)
            }
        }
    },
    processMsg: function(datareturn){//展示流程信息
        var table = layui.table;
        table.render({
            elem: '#issue_process_table',
            url: ctx + "/smtIssue/getIssueProcess.html",
            cols: [
                [ //表头
                    {field: 'processDate', templet: '<div>{{ Format(d.processDate,"yyyy-MM-dd hh:mm:ss")}}</div>', title: '时间'},
                    {field: 'ower', title: '角色'},
                    {field: 'processType', templet: '#smt_process_type_tpl', title: '事件'},
                    {field: 'detail', title: '详情', templet: '#smt_issue_process_tpl'},
                  ]
            ],
            where:{issueId:datareturn.issueId,orderId:datareturn.prodOrderInfoSmt.orderId},
            id: "issue_process_table",
            done: function(res, curr, count){
                // console.log(res)
            }
        });
    },
    batchDelayOrder: function(){
    	var _this = this;
    	$("#batchDelayOrder").click(function() {
        	var itemData = _this.getItemData();
        	if (itemData == null || itemData.length < 1) {
                layer.msg("请选择需要操作的纠纷信息！",{icon:0});
                return;
            }
        	 var itemIds = [];

             for (var index in itemData) {
            	 var flag = 0;
                 var obj = itemData[index];
                 if(itemIds.length!=0){
                	 for(var index1 in itemIds){
                		 var de = itemIds[index1];
                		 if(de.orderId == obj.orderId){
                			 flag = 1;
                		 }
                	 }
                 }
                 if(flag == 0){
                	 itemIds.push(obj);
                 }
             }
            //  console.log(itemIds.length);
             for(var ind in itemIds){
            	 var ob = itemIds[ind];
            	 window.open("https://trade.aliexpress.com/order_detail.htm?orderId="+ob.orderId+"");
             }
             /**
              * 延迟发货api暂时无法操作，打开多个页面进行延迟发货
              */
        	/*var index = layer.open({
                title: '批量延长收货',
                type: 1,
                btn: ['提交', '关闭'],
                content: $('#delayDaysInfotpl').html(),
                area: ['450px', '250px'],
                success: function () {
                    initNotNull('#elayDaysInfoForm_producttpl')
                },
                yes: function () {
                	var delayDay = $("#delay_days").val();
                	$.ajax({
           			 type: "POST",
           			 url: ctx + "/smtIssue/batchDelayDays.html",
           			 data:{itemIds:itemIds.join(","),delayDay:delayDay},
           			 async: false,
           			 dataType: "json",
           			 success: function (data) {
           				if(data.data!=null && data.data!=""){
           					layer.msg("处理结束-->失败Oder："+data.data);
           				}else{
           					layer.msg("处理成功");
           				}
           			 },
           			 error: function () {
           				 layer.msg("服务器正忙");
           			 }
           		 });
                    layer.close(index);
                }
            })*/
        });
    },
    getItemData: function(){
        	var itemData;
        	var table =layui.table;
        	if(issue_process_type=='1'){
        		itemData = table.checkStatus('issue_processing_table').data;
        	}else if(issue_process_type=='2'){
        		itemData = table.checkStatus('wait_seller_process_table').data;
        	}else if(issue_process_type=='3'){
        		itemData = table.checkStatus('wait_platform_in_table').data;
        	}else if(issue_process_type=='4'){
        		itemData = table.checkStatus('platform_in_table').data;
        	}else if(issue_process_type=='5'){
        		itemData = table.checkStatus('after_sale_warranty_table').data;
        	}else if(issue_process_type=='6'){
        		itemData = table.checkStatus('waitSellerReceive').data;
        	}else if(issue_process_type=='7'){
        		itemData = table.checkStatus('cancel_table').data;
        	}else if(issue_process_type=='8'){
        		itemData = table.checkStatus('finish_table').data;
        	}
        	return itemData;
    },
    batchRefuseSolution:function(){
    	 var _this = this;
		 var options = {
			 title:'批量拒绝方案',
			 content: $('#disputeRefuseAddLayer').html(),
			 area:['70%','70%'],
			 yes:function(index,layero){
				 var  ind = index;
				 var itemData = _this.getItemData();
				 if (itemData == null || itemData.length < 1) {
		             layer.msg("请选择需要操作的纠纷信息！",{icon:0});
		             return;
		         }
		     	 var objectList = [];
				 var queryType = $("#refundTypeDiv input[name=refundType]:checked").val();
		          for (var index in itemData) {
		              var object = itemData[index];
					  var obj = new Object();
					  obj.refundAmount = $("#refund_amount").val()
					  obj.solutionContext = $("#smtIssue_refund_remark").val();
					  obj.issueId = object.issueId;
					  obj.buyerLoginId = object.buyerLoginId;
					  obj.addSellerSolution = true;
					  obj.storeAcctId = object.storeAcctId;
					  obj.addSolutionType = queryType;
		              objectList.push(obj);
		          }
				 $.ajax({
					 beforeSend: function(){
						 loading.show();
			          },
					 type: "POST",
					 url: ctx + "/smtIssue/batchRefuseSolution.html",
					 data: {objectList:JSON.stringify(objectList)},
					 async: true,
					 dataType: "json",
					 success: function (data) {
						 loading.hide()
						 if(data.data!=null && data.data!=""){
	           					layer.msg("处理结束-->失败Issue："+data.data);
							}else{
								if(data.code==='0000'){
									layer.msg("处理成功");
								// 以逗号拼接
								//
								let failData = data.data.split(',')
								let _itemData = itemData.filter(item=> !failData.includes(item.issueId))
								_this.changeOrderStatus(_itemData,_itemData.length,'wait_seller_process_table')
								}
							}
						 layer.close(ind);
					 },
					 error: function () {
						 layer.msg("服务器正忙");
					 }
				 });
			 },
			 success:function(layero,index){
				 layui.form.render('radio');
				 $("#refund_amount").val("0");
				Promise.all([smtissue_getEmailType(), smtissue_etEmailName()]).then(function(result){
					//邮件数组
					var emailTypeArr = result[0];
					//邮件名数组
					var emailNameArr = result[1];
					//邮件dom渲染
					commonRenderSelect('issue_template_type', emailTypeArr, {
						name: 'name',
						code: 'name'
					}).then(function(){
							layui.form.render('select');
						});
					//邮件名称dom渲染
					commonRenderSelect('issue_template_sel', emailNameArr, {
						name: 'name',
						code: 'id'
					}).then(function(){
						layui.form.render('select');
					});
					//联动
					var issue_targetSel = layero.find('#issue_template_sel');
					layui.form.on('select(issue_template_type_filter)', function(data){
						smtissue_etEmailName(data.value).then(function(emailNameresult){
							var optStrs = '';
							if(emailNameresult.length){
								for(var j=0;j<emailNameresult.length; j++){
									var emailNameItem = emailNameresult[j];
									optStrs +=`<option value="${emailNameItem.id}">${emailNameItem.name}</option>`;
								}
							}else{
								optStrs +=`<option value="">请选择</option>`;
							}
							issue_targetSel.html(optStrs);
							layui.form.render('select');
						});
					});
				})
			 }
		 };

		 $('#batchRefuseSolution').on("click",function(){
			 if(issue_process_type!=='2' && issue_process_type !=='1'){
				//  layer.msg("只能够操作等待卖家处理的数据");
				 layer.msg("当前数据的状态不支持该操作");
				 return;
			 }
			 _this.layerModel(options);
		 });
    },
    updateReceiveTimeInfo:function(){
	   	var _this = this;
		$("#updateOrderReceiveInfo").click(function() {
	    	var itemData = _this.getItemData();
	    	if (itemData == null || itemData.length < 1) {
	            layer.msg("请选择需要操作的纠纷信息！",{icon:0});
	            return;
	        }
	    	 var objectList = [];
	    	 for (var index in itemData) {
				  var flag = 0;
	              var object = itemData[index];
				  var obj = new Object();
				  obj.storeAcctId = object.storeAcctId;
				  obj.orderId = object.orderId;
				  if(objectList.length!=0){
					  for(var index1 in objectList){//根据orderID去重
						  var detail = objectList[index1];
						  if(detail.orderId == object.orderId){
							  flag = 1;
						  }
					  }
				  }
				  if(flag==0){
					  objectList.push(obj);
				  }
	          }
	         $.ajax({
				 type: "POST",
				 url: ctx + "/smtIssue/updateOrderReceiveInfo.html",
				 data: {objectList:JSON.stringify(objectList)},
				 async: false,
				 dataType: "json",
				 success: function (data) {
					 if(data.data!=null && data.data!=""){
           				layer.msg("处理结束-->失败Issue："+data.data);
      				 }else{
      					layer.msg("更新成功");
      				 }
					 reload(new Object,'reload');
				 },
				 error: function () {
					 layer.msg("服务器正忙");
				 }
			 });
         });
   },
    batchSendMsg:function(){
   	 var _this = this;
		 var options = {
			 title:'批量回复站内信',
			 content: $('#batchSendMsgTpl').html(),
			 area:['50%','50%'],
			 yes:function(index,layero){
				 var  ind = index;
				 var itemData = _this.getItemData();
				 if (itemData == null || itemData.length < 1) {
		             layer.msg("请选择需要回复的纠纷信息！",{icon:0});
		             return;
		         }
		     	 var objectList = [];
		          for (var index in itemData) {
		              var object = itemData[index];
					  var obj = new Object();
					  var flag = 0;
					  obj.content = $("#seng_msg_area").val();
					  obj.orderId = object.orderId;
					  obj.buyerLoginId = object.buyerLoginId;
					  obj.storeAcctId = object.storeAcctId;
					  obj.sellerLoginId = object.clientId;
					  if(objectList.length!=0){
						  for(var index1 in objectList){//根据orderID去重
							  var detail = objectList[index1];
							  if(detail.orderId == object.orderId){
								  flag = 1;
							  }
						  }
					  }
					  if(flag==0){
						  objectList.push(obj);
					  }
		          }
				 $.ajax({
					 beforeSend: function(){
						 loading.show();
			          },
					 type: "POST",
					 url: ctx + "/smtIssue/batchSendMsg.html",
					 data: {objectList:JSON.stringify(objectList)},
					 async: true,
					 dataType: "json",
					 success: function (data) {
						 loading.hide()
						 if(data.data!=null && data.data!=""){
	           					layer.msg("处理结束-->失败Issue："+data.data);
          				 }else{
          					layer.msg("回复成功");
          				 }
						 layer.close(ind);
					 },
					 error: function () {
						 layer.msg("服务器正忙");
					 }
				 });
			 },
			 success:function(){
				 layui.form.render('radio');
				 $("#refund_amount").val("0");
				 $('#hiBtn').on('click',function (){
					$('#seng_msg_area').val("hi!");
				 })
				 $('#helloBtn').on('click',function (){
					$('#seng_msg_area').val("hello !");
				 })
				 $('#worryBtn').on('click',function (){
					$('#seng_msg_area').val("hi! don't worry!");
				 })
			 }
		 };
		 $('#batchSendMsg').on("click",function(){
			 _this.layerModel(options);
		 });
   },
   childOrder: function(datareturn){//展示子订单商品
        var listChildOrder = datareturn.listChildOrder;
        if(listChildOrder.length!=0){
            for(var i=0;i<listChildOrder.length;i++){
                var src = listChildOrder[i].snapshotSmallPhotoPath,
                    name =listChildOrder[i].productName;
                var html = '<tr>';
                	html += '          <td>';
                	html += '              <p style="float:left;overflow:hidden;margin-right:10px"><img src='+src+' width="100" height="100"></p>';
                	if(listChildOrder[i].issueTime!=null && listChildOrder[i].	issueTime!=''){
                		html += '               <p style="color:red">'+name+'</p>';
                	}else{
                		html += '               <p>'+name+'</p>';
                	}
                	html += '               <p>SKU:<b>'+listChildOrder[i].skuCode+'</b></p>';
                	html += '                   <p>单价:<b>'+listChildOrder[i].initOrderAmt+'('+listChildOrder[i].initCurrencyCode+')</b></p>';
                	html += '               <p>数量:<b>'+listChildOrder[i].productCount+'</b></p>';
                	html += '            </td>';
                	html += '          </tr>';
                $("#child_order_table").append(html)
            }
        }

    },
 /**
  * @description: 页面上删除数据
  * @param {*} checkedData 选中的数据或者是通过tool获取的当前行
  * @param {*} len
  * @param {*} tableKey
  * @return {*}
  */
	changeOrderStatus: function(checkedData=[],len=1,tableKey){
		let totalIdsObj ={
			'2':'tolnum_span_seller_process'
		}
		let totalId = totalIdsObj[issue_process_type]
		if(Array.isArray(checkedData)){
			if(issue_process_type==='2'){
				let checkIdObj = {}
				checkedData.forEach(item=>{
					checkIdObj[item.id] = true
				})
				layui.table.cache[tableKey].forEach((item,index)=>{
					if(checkIdObj[item.id]){
						layui.table.cache[tableKey][index] = []
					}
				})
				$(`#${tableKey}`).next().find('tbody tr').each(function(){
						let curId = $(this).find('input[name=id]').val()
						if(checkIdObj[curId]){
							$(this).remove()
						}
				})
			}
		}else if(Object.prototype.toString.call(checkedData)==='[object Object]'){ //dom数据 tr
			if(issue_process_type==='2'){
				checkedData.del()
			}
		}else{
			return console.log('参数格式不对')
		}

		let lastTotal = $(`#${totalId}`).text()
		let curTotal = lastTotal-len
		if(curTotal){
			$(`#${totalId}`).text(curTotal)
			$(`#${tableKey}`).next().find('.layui-laypage-count').text(`共 ${curTotal} 条`)
		}else{
			$('#issueSearchBtn').click()
		}

	}

};

layui.use(['admin', 'form','laydate', 'element', 'table','layedit', 'formSelects'], function() {
    var $ = layui.$,
    laydate = layui.laydate,
        admin = layui.admin,
        element = layui.element,
        form = layui.form,
        table = layui.table,
				formSelects = layui.formSelects
        layedit = layui.layedit;
	form.render('select');
	formSelects.render('smt_issuse_issueSubdivideStatus')

    form.render(null, 'component-form-element');
    render_hp_orgs_users("#aliExpress_online_searchForm");//渲染部门销售员店铺三级联动
    disputeHandle.batchDelayOrder();
    disputeHandle.batchRefuseSolution();
    disputeHandle.updateReceiveTimeInfo();
    disputeHandle.batchSendMsg();
    /**
     * 查询类型选项卡改变
     */
    element.on('tab(smt_issue_tab_filter)', function (data) {
    	issue_process_type = $(this).attr("issue_process_type");
    	// console.log(issue_process_type)
    	document.getElementById("issue_processing_div").style.display = "none";
    	document.getElementById("wait_seller_process_div").style.display = "none";
    	document.getElementById("wait_platform_in_div").style.display = "none";
    	document.getElementById("platform_in_div").style.display = "none";
    	document.getElementById("after_sale_warranty_div").style.display = "none";
    	document.getElementById("wait_seller_receive_div").style.display = "none";
    	document.getElementById("cancel_div").style.display = "none";
    	document.getElementById("finish_div").style.display = "none";
    	if(issue_process_type=='1'){
        	document.getElementById("issue_processing_div").style.display = "";
					$('#aliExpress_online_searchForm').find('.onlyShowProcess').css('display','')
				}else if(issue_process_type==2){
					document.getElementById("wait_seller_process_div").style.display = "";
					$('#aliExpress_online_searchForm').find('.onlyShowProcess').css('display','none')
    	}else if(issue_process_type==3){
        	document.getElementById("wait_platform_in_div").style.display = "";
					$('#aliExpress_online_searchForm').find('.onlyShowProcess').css('display','none')
    	}else if(issue_process_type==4){
        	document.getElementById("platform_in_div").style.display = "";
					$('#aliExpress_online_searchForm').find('.onlyShowProcess').css('display','none')
    	}else if(issue_process_type==5){
        	document.getElementById("after_sale_warranty_div").style.display = "";
					$('#aliExpress_online_searchForm').find('.onlyShowProcess').css('display','none')
    	}else if(issue_process_type==6){
        	document.getElementById("wait_seller_receive_div").style.display = "";
					$('#aliExpress_online_searchForm').find('.onlyShowProcess').css('display','none')
    	}else if(issue_process_type==7){
        	document.getElementById("cancel_div").style.display = "";
					$('#aliExpress_online_searchForm').find('.onlyShowProcess').css('display','none')
    	}else if(issue_process_type==8){
        	document.getElementById("finish_div").style.display = "";
					$('#aliExpress_online_searchForm').find('.onlyShowProcess').css('display','none')
    	}
			$('#issueSearchBtn').click()
    });
   var object = new Object();
   object.storeAcctIdA = null;
   object.issueProcessType=issue_process_type;
   var type='reload';
   reload = tableReload;
    tableReload(object,type)




    //执行一个 table 实例
    function tableReload(obj,type)
     {
    	// console.log('开始执行');

    	if(type!='query'){
    		document.getElementById("issue_processing_div").style.display = "";
    	}
    	if(obj.storeAcctIdA!=null){
    		if(issue_process_type=='1'){  //纠纷处理中
                loading.show();
                table.render({
                    elem: '#issue_processing_table',
                    url: ctx + "/smtIssue/pageInfoProcessing.html",
                    page: true, //开启分页
                    cols: [
                        [ //表头
                            {type: 'checkbox',width:30},
														{field: 'issueId', title: '纠纷ID'},
                            {field: 'orderId', title: '订单号/卖家信息',templet: '#orderIdTpl',width:'10%'},
                            {field: 'orderAmount', title: '订单金额（$）', sort:true,},
                            {field: 'refundMoneyPost', title: '订单纠纷金额（$）',sort:true,},
                            {field: 'reasonChinese', title: '纠纷原因',width: '9%'},
                            {field: 'content', title: '买家备注',width: '22%',templet:'#smtIssue_content'},
                            {field: 'logisticsNo',templet: '#logisticsNoTpl', title: '跟踪号',width: '22%'},
                            {field: 'issueSubdivideStatus', title: '处理状态',templet:function(d){
															let str = ''
															if(d.issueSubdivideStatus){
																str = disputeHandle.IssueStatus[d.issueSubdivideStatus]
															}
															return str
														}},
                            {field: 'gmtCreate', templet: '#allTimeTpl', title: '时间' ,width: 200},
                            {toolbar: '#issue_editBar', title: '操作'}
                        ]

                    ],
                    where:obj,
                    id: "issue_processing_table",
                    limits: [100, 200, 500],
                    limit: 100,
                    done: function (res, curr, count) {
											// 表头固定操作
											  theadHandle().fixTh({id:'#smtissueinfoCard',dv1:'.layui-tab-title',h:99,i:38})
                        $("#tolnum_span_process").text(count);
                        loading.hide();
                    }
                });

            }
            if(issue_process_type=='2') {  //待买家处理
                loading.show();
                table.render({
                    elem: '#wait_seller_process_table',
                    url: ctx + "/smtIssue/waitSellerProcess.html",
                    page: true, //开启分页
                    cols: [
                        [ //表头
													{type: 'checkbox',width:30},
													{field: 'issueId', title: '纠纷ID'},
													{field: 'orderId', title: '订单号/卖家信息',templet: '#orderIdTpl',width:'10%'},
													{field: 'orderAmount', title: '订单金额（$）', sort:true,},
													{field: 'refundMoneyPost', title: '订单纠纷金额（$）',sort:true,},
													{field: 'reasonChinese', title: '纠纷原因',width: '9%'},
													{field: 'content', title: '买家备注',width: '22%',templet:'#smtIssue_content'},
													{field: 'logisticsNo',templet: '#logisticsNoTpl', title: '跟踪号',width: '22%'},
													{field: 'gmtCreate', templet: '#allTimeTpl', title: '时间' ,width: 200},
													{toolbar: '#issue_editBar', title: '操作'}
                        ]
                    ],
                    where: obj,
                    id: "wait_seller_process_table",
										limits: [100, 200, 500],
										limit: 100,
                    done: function (res, curr, count) {
											// 表头固定操作
											theadHandle().fixTh({id:'#smtissueinfoCard',dv1:'.layui-tab-title',h:99,i:38})
                        $("#tolnum_span_seller_process").text(count);
                        loading.hide();
                    }
                });
            }
            if(issue_process_type=='3') {
                loading.show();
                table.render({
                    elem: '#wait_platform_in_table',
                    url: ctx + "/smtIssue/waitPlatformIn.html",
                    page: true, //开启分页
                    cols: [
                        [ //表头
                            {type: 'checkbox'},
														{field: 'issueId', title: '纠纷ID'},
                            {field: 'orderId', title: '订单号', templet: '#orderIdTpl', width: '200px'},
                            // {field: 'country', title: '国家', width: '5%'},
                            // {field: 'buyerSingerFullname', title: '买家姓名', width: '5%'},
                            {field: 'orderAmount', title: '订单金额（$）', sort:true,templet: '#priceTpl'},
                            {field: 'refundMoneyPost', title: '订单纠纷金额（$）',sort:true, templet: '#refundMoneyPostTpl'},
                            {field: 'reasonChinese', title: '纠纷原因', width: '9%'},
                            {field: 'content', title: '买家备注', width: '9%'},
                            {field: 'logisticsNo', templet: '#logisticsNoTpl', title: '跟踪号', width: '22%'},
                            // {field: 'timeToReceive', title: '剩余收货时间', width: '10%'},
                            {field: 'gmtCreate', templet: '#allTimeTpl', title: '时间', width: '11%'},
                            {toolbar: '#issue_editBar', title: '操作', width: '7%'}
                        ]

                    ],
                    where: obj,
                    id: "wait_platform_in_table",
					limits: [100, 200, 500],
					limit: 100,
                    done: function (res, curr, count) {
                        $("#tolnum_span_platform_process").text(count);
                        loading.hide();
                    }
                });
            }
            if(issue_process_type=='4') {
                loading.show();
                table.render({
                    elem: '#platform_in_table',
                    url: ctx + "/smtIssue/platformIn.html",
                    page: true, //开启分页
                    cols: [
                        [ //表头
                            {type: 'checkbox'},
														{field: 'issueId', title: '纠纷ID'},
                            {field: 'orderId', title: '订单号', templet: '#orderIdTpl', width: '7%'},
                            {field: 'country', title: '国家', width: '5%'},
                            {field: 'buyerSingerFullname', title: '买家姓名', width: '5%'},
                            {field: 'orderAmount', title: '订单金额', templet: '#priceTpl', width: '5%'},
                            {field: 'refundMoneyPost', title: '订单纠纷金额', templet: '#refundMoneyPostTpl', width: '5%'},
                            {field: 'reasonChinese', title: '纠纷原因', width: '9%'},
                            {field: 'content', title: '买家备注', width: '9%'},
                            {field: 'logisticsNo', templet: '#logisticsNoTpl', title: '跟踪号', width: '22%'},
                            {field: 'timeToReceive', title: '剩余收货时间', width: '10%'},
                            {field: 'gmtCreate', templet: '#allTimeTpl', title: '时间', width: '11%'},
                            {toolbar: '#issue_editBar', title: '操作', width: '7%'}
                        ]

                    ],
                    where: obj,
                    id: "platform_in_table",
					limits: [100, 200, 500],
					limit: 100,
                    done: function (res, curr, count) {
                        $("#tolnum_span_platform_processing").text(count);
                        loading.hide();
                    }
                });
            }
            if(issue_process_type=='5') {
                loading.show();
                table.render({
                    elem: '#after_sale_warranty_table',
                    url: ctx + "/smtIssue/afterSaleWarranty.html",
                    page: true, //开启分页
                    cols: [
                        [ //表头
                            {type: 'checkbox'},
														{field: 'issueId', title: '纠纷ID'},
                            {field: 'orderId', title: '订单号', templet: '#orderIdTpl', width: '7%'},
                            {field: 'country', title: '国家', width: '5%'},
                            {field: 'buyerSingerFullname', title: '买家姓名', width: '5%'},
                            {field: 'orderAmount', title: '订单金额', templet: '#priceTpl', width: '5%'},
                            {field: 'refundMoneyPost', title: '订单纠纷金额', templet: '#refundMoneyPostTpl', width: '5%'},
                            {field: 'reasonChinese', title: '纠纷原因', width: '9%'},
                            {field: 'content', title: '买家备注', width: '9%'},
                            {field: 'logisticsNo', templet: '#logisticsNoTpl', title: '跟踪号', width: '22%'},
                            {field: 'timeToReceive', title: '剩余收货时间', width: '10%'},
                            {field: 'gmtCreate', templet: '#allTimeTpl', title: '时间', width: '11%'},
                            {toolbar: '#issue_editBar', title: '操作', width: '7%'}
                        ]

                    ],
                    where: obj,
                    id: "after_sale_warranty_table",
					limits: [100, 200, 500],
					limit: 100,
                    done: function (res, curr, count) {
                        $("#tolnum_span_buyend").text(count);
                        loading.hide();
                    }
                });
            }
            if(issue_process_type=='6') { //待卖家收货
                loading.show();
                table.render({
                    elem: '#wait_seller_receive_table',
                    url: ctx + "/smtIssue/waitSellerReceive.html",
                    page: true, //开启分页
                    cols: [
                        [ //表头
													{type: 'checkbox',width:30},
													{field: 'issueId', title: '纠纷ID'},
													{field: 'orderId', title: '订单号/卖家信息',templet: '#orderIdTpl',width:'10%'},
													{field: 'orderAmount', title: '订单金额（$）', sort:true,},
													{field: 'refundMoneyPost', title: '订单纠纷金额（$）',sort:true,},
													{field: 'reasonChinese', title: '纠纷原因',width: '9%'},
													{field: 'content', title: '买家备注',width: '22%',templet:'#smtIssue_content'},
													{field: 'logisticsNo',templet: '#logisticsNoTpl', title: '跟踪号',width: '22%'},
													{field: 'gmtCreate', templet: '#allTimeTpl', title: '时间' ,width: 200},
													{toolbar: '#issue_editBar', title: '操作'}
                        ]

                    ],
                    where: obj,
                    id: "wait_seller_receive_table",
										limits: [100, 200, 500],
										limit: 100,
                    done: function (res, curr, count) {
											// 表头固定操作
											theadHandle().fixTh({id:'#smtissueinfoCard',dv1:'.layui-tab-title',h:99,i:38})
                        $("#tolnum_span_seller_recive").text(count);
                        loading.hide();
                    }
                });
            }
            if(issue_process_type=='7') { //已取消
                loading.show();
                table.render({
                    elem: '#cancel_table',
                    url: ctx + "/smtIssue/cancel.html",
                    page: true, //开启分页
                    cols: [
                        [ //表头
													{type: 'checkbox',width:30},
													{field: 'issueId', title: '纠纷ID'},
													{field: 'orderId', title: '订单号/卖家信息',templet: '#orderIdTpl',width:'10%'},
													{field: 'orderAmount', title: '订单金额（$）', sort:true,},
													{field: 'refundMoneyPost', title: '订单纠纷金额（$）',sort:true,},
													{field: 'reasonChinese', title: '纠纷原因',width: '9%'},
													{field: 'content', title: '买家备注',width: '22%',templet:'#smtIssue_content'},
													{field: 'logisticsNo',templet: '#logisticsNoTpl', title: '跟踪号',width: '22%'},
													{field: 'gmtCreate', templet: '#allTimeTpl', title: '时间' ,width: 200},
													{toolbar: '#issue_editBar', title: '操作'}
                        ]

                    ],
                    where: obj,
                    id: "cancel_table",
										limits: [100, 200, 500],
										limit: 100,
                    done: function (res, curr, count) {
											// 表头固定操作
											theadHandle().fixTh({id:'#smtissueinfoCard',dv1:'.layui-tab-title',h:99,i:38})
                        $("#tolnum_span_cannel").text(count);
                        loading.hide();
                    }
                });
            }
            if(issue_process_type=='8') { //已结束
                loading.show();
                table.render({
                    elem: '#finish_table',
                    url: ctx + "/smtIssue/finish.html",
                    page: true, //开启分页
                    cols: [
                        [ //表头
													{type: 'checkbox',width:30},
													{field: 'issueId', title: '纠纷ID'},
													{field: 'orderId', title: '订单号/卖家信息',templet: '#orderIdTpl',width:'10%'},
													{field: 'orderAmount', title: '订单金额（$）', sort:true,},
													{field: 'refundMoneyPost', title: '订单纠纷金额（$）',sort:true,},
													{field: 'reasonChinese', title: '纠纷原因',width: '9%'},
													{field: 'content', title: '买家备注',width: '22%',templet:'#smtIssue_content'},
													{field: 'logisticsNo',templet: '#logisticsNoTpl', title: '跟踪号',width: '22%'},
													{field: 'gmtCreate', templet: '#allTimeTpl', title: '时间' ,width: 200},
													{toolbar: '#issue_editBar', title: '操作'}
                        ]

                    ],
                    where: obj,
                    id: "finish_table",
										limits: [100, 200, 500],
										limit: 100,
                    done: function (res, curr, count) {
											// 表头固定操作
											theadHandle().fixTh({id:'#smtissueinfoCard',dv1:'.layui-tab-title',h:99,i:38})
                        $("#tolnum_span_finish").text(count);
                        loading.hide();
                    }
                });
            }
    	}
     }
  //日期范围
    laydate.render({
        elem: '#queryTime',
        range: true
    });
    //日期范围
    laydate.render({
        elem: '#payQueryTime',
        range: true
    });

    $("#issueSearchBtn").click(function () {
    	 var obj = {};
         var currentStoreAccts=[];
         var storeAcctId= $('[name=smt_issue_aliExpress_searchForm_select]').val();//所选店铺
         if(storeAcctId == null||storeAcctId==''){//没有选择店铺
             $("#smt_online_store_sel").children().each(function(){
                 if($(this).val() != ""){
                     currentStoreAccts.push($(this).val());
                 }
             });
             if(currentStoreAccts.length > 0){
                 obj.storeAcctIdA = currentStoreAccts.join(",");
             }else{
            	 layer.msg("必须选择店铺查询");
            	 return;
            	 obj.storeAcctIdA = '999999';
             }
         }else{
             obj.storeAcctIdA = storeAcctId;
         }
        var issueTime = $.trim($("#issueTimeDiv input[name='queryTime']").val());
        var payTime = $.trim($("#payTimeDiv input[name='payQueryTime']").val());
        var  sumOrderMoney = $.trim($("#sumOrderMoneyText").val());

        // console.log($("#sumOrderMoneyText").val());
        var selectType = $.trim($("#selectType").val());
        var selectReceiveTimeType = $.trim($("#selectReceiveTimeType").val());
        var issueReasonType = $.trim($("#issueReasonType").val());
        var issuetext = $.trim($("#issueInputText").val());
        obj.selectType = selectType;
        obj.sumOrderMoney = sumOrderMoney;
        obj.selectReceiveTimeType = selectReceiveTimeType;
        obj.issueReasonType = issueReasonType;
        if(selectType=='0'){
        	obj.orderId = $.trim(issuetext);
        }else if(selectType=='1'){
        	obj.buyerSingerFullname =$.trim(issuetext);
        }
        if(issueTime !=""){
        	var arr = issueTime.split(' - ');
        	obj.startDate = arr[0]+' 00:00:00';
        	obj.endDate = arr[1]+' 23:59:59';
        }
        if(payTime !=""){
        	var arr = payTime.split(' - ');
        	obj.startPayDate = arr[0]+' 00:00:00';
        	obj.endPayDate = arr[1]+' 23:59:59';
        }
        obj.issueProcessType = issue_process_type;
				if(issue_process_type=='1'){
					obj.issueSubdivideStatus =layui.formSelects.value('smt_issuse_issueSubdivideStatus', 'valStr')
				}
				// 纠纷ID
				obj.issueId = $('#aliExpress_online_searchForm').find('input[name=issueId]').val()
        //  console.log(obj)
        type='query';
        tableReload(obj,type);
    });
    //弹框按钮
    $('.disputeDetail').click(function() {
        disputeHandle.detail();
    });






    table.on('tool(issue_table_filter)', function (obj) {
    	var data = obj.data; // 获得当前行数据
    	 var layEvent = obj.event; //获得 lay-event 对应的值
         var data = obj.data; //获得当前行数据
         if(layEvent === 'show_item'){
         	window.open("https://trade.aliexpress.com/order_detail.htm?orderId="+data.orderId+"");
         }
         if(layEvent ==='pd_detail'){
        	 disputeHandle.detail(data.issueId,obj);
         }
    })

});

var reload;
var showLogisticsInfo= function(obj,obj1,obj2) {
	   layer.tips("物流类型："+obj1+'<br/>'+"剩余收货日期："+obj, '#'+obj2);
	}


//邮件请求
function smtissue_getEmailType(){
	return commonReturnPromise({
		type: 'post',
		contentType: 'application/x-www-form-urlencoded',
		url: '/lms/emailTemplate/queryTemplateTypeName.html',
		params: {
			platformCode: 'aliexpress'
		}
	})
}

//邮件名请求
function smtissue_etEmailName(templateTypeName){
	if(!templateTypeName){
		templateTypeName = '';
	};
	return commonReturnPromise({
		url: '/lms/emailTemplate/queryTemplateByPlatCodeAndName.html',
		params: {templateTypeName: templateTypeName,platCode: 'aliexpress'}
	})
}

//点击应用
function useTemplate(){
	var $val = $('#issue_template_sel').val();
	$.ajax({
		type: 'post',
		dataType: 'json',
		url: '/lms/emailTemplate/queryTemplateInfoById.html',
		data: {id: $val},
		beforeSend: function(){
			loading.show();
		},
		success: function(response){
			loading.hide();
			if(response.code=='0000'){
				$('#smtIssue_refund_remark').val(response.data);
			}
		}
	})
};

function smtIssue_showInfo(dom){
	let parentDom = $(dom).parent()
	let isNeedHide = parentDom.hasClass('moreLineText')
	if(!isNeedHide){
		parentDom.css('-webkit-line-clamp','999')
		parentDom.addClass('moreLineText')
	}else{
		parentDom.removeClass('moreLineText')
		parentDom.css('-webkit-line-clamp','4')
	}
}