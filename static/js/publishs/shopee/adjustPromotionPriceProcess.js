var shopeetableIns ={};
var shopeeProTimeUint;
layui.use(['admin', 'form', 'layer','table', 'formSelects', 'element', 'laydate'], function() {
	 var admin = layui.admin,
     form = layui.form,
     layer = layui.layer,
     table = layui.table,
     formSelects = layui.formSelects,
     element = layui.element,
     laydate = layui.laydate,
     laypage = layui.laypage,
     $ = layui.$
    form.render(null, 'component-form-element');
    form.render(null, 'component-form-group');
	form.render('select');
	form.render('checkbox');
    //表格渲染结果
    //展示已知数据
		let tableDataLen = 0
    var data = new Object();
    if(shop_arr.length > 0){
        data.idList=[];
        for (var i = 0; i < shop_arr.length; i++){
            data.idList.push(shop_arr[i].id);
        }
        data.idList = data.idList.join(",");
    }
    if(shop_arr.length > 0){
        tableReload(data);
	}
	function tableReload(data) {
        shopeetableIns = table.render({
            elem: "#promoAdjustPriceTable",
            method:'post',
            url: ctx + "/shopee/shopeeIsEnableProduct/prodAdjustPage.html",
            cols: [[
                {type: "checkbox",width:30},
                { field: "storeAcct", title: "店铺" , width: '10%',templet: '#adjustPromotionPriceProcess_storeAcct'},
                { field: "itemId", title: "item_id", width: '8%'},
                { field: "variId", title: "vari_id", width: '8%'},
                { field: "storeSku", title: "店铺SKU", width: '9%'},
                { field: "sSku", title: "商品SKU" , width: '8%'},
                { field: "listingPrice", title: "当前原价", width: '5%'},
                { field: "newCurrPriceWithoutFloat", title: "销售价定价", width: '6%'},
                { field: "currPrice", title: "当前销售价", width: '7%',templet:d=>{
					let radioStr = shopeeadjustPromotionprice_getRadioStr(d.currPriceRadio,d.newCurrPriceWithoutFloat)
					return `<div>${d.currPrice}${radioStr}</div>`
				}},
                { field: "grossRate", title: "当前毛利率", width: '7%'},
                { field: "platDeduct", title: "平台提成", width: '6%'},
                { field: "newCurrPrice", title: "新的销售价",templet:'#newCurrPriceTpl', width: '7%'},
                { field: "isPromotion", title: "是否促销",templet:'#isPromotionTpl', width: '6%' },
                { field: "promotionMsg", title: "促销状态", width: '5%' },
                { field: "result",title: '操作结果', align: 'center',templet:'#adjustPromotionPriceProcess_result', width: '7%'},
            ]],
            where:data,
            page:true,
            id:"promoAdjustPriceTable",
						limits:[3000,5000,1000],
						height: 500,
            limit:3000,
			created(res) {
				if (res.code === '0000') {
				  let list = res.data
				  for (let i = 0; i < list.length; ++i) {
					if(!!list[i].newCurrPriceWithoutFloat){
					  list[i].currPriceRadio = ((list[i].currPrice - list[i].newCurrPriceWithoutFloat)/list[i].newCurrPriceWithoutFloat * 100).toFixed(2)
					  list[i].newCurrPriceRadio = ((list[i].newCurrPrice - list[i].newCurrPriceWithoutFloat)/list[i].newCurrPriceWithoutFloat * 100).toFixed(2)

					}
				  }
				}
			  },
            done:function(res, curr, count){
                // $("[data-field='id']").css('display', 'none');
                // $("[data-field='storeAcctId']").css('display', 'none');
                // $("[data-field='variId']").css('display', 'none');
                // $("[data-field='isMultiSku']").css('display', 'none');
                $("#tolnum_span_shopee").text("共"+count+"条");
								tableDataLen = count
								$('#promoAdjustPriceTable').next().find('.layui-table-body').css('height','430px')
            }
        });
    }



    var active = {
        reload: function () {
        	 var data = new Object();
        	 data.storeAcctIdList = [];
        	 var logisAttrContents = formSelects.value("selectAttr_store");
        	 for (var i = 0; i < logisAttrContents.length; i++) {
        	        var logisAttr = logisAttrContents[i].value;
        	        data.storeAcctIdList.push($.trim(logisAttr));
        	    }
        	 var skuStr = $.trim($("#adjustPriceSearchForm input[name='sSkuList']").val());
					 let listType = $.trim($("#adjustPriceSearchForm select[name='listType']").val())
					 data[listType] = []
        	 if(skuStr !="" && skuStr!=null){
							data[listType] = $.trim(skuStr.split(","));
        	 }
        	 data.storeAcctIdList = $.trim(data.storeAcctIdList);
            data.searchType = $("#shopee_adjustPrice_skuSearchType").val();//搜索类型
            data.isAdjustPromotionPrice = '1';
            //执行重载
           /* table.reload('promoAdjustPriceTable', {
                where: data,
            });*/
            tableReload(data);
        }
    };
    $("#adjustPriceSearchBtn").click(function () {
    	var type = $(this).data('type');
        active[type] ? active[type].call(this) : '';
    });
    $("#adjustPriceResetBtn").click(function () {
        $("#adjustPriceSearchForm input[name='sSku']").val('');
        formSelects.value('selectAttr', []);
    });
    //批量修改调价消息
    $('#batchUpadatePrice').click(function(){
    	let arrStat = [];
    	//获取表格行对象
        let trList =  $('#promoAdjustPriceTable').next().find('.layui-table-body tbody').find('tr');
    	for(let i=0;i<trList.length;i++){
            let checkStat = trList.eq(i).find('td').eq(0).find('div').find('input').is(":checked");
    		 //只修改被选中的商品信息
    		 if(checkStat && trList.eq(i).css('display')!=='none'){
    			 arrStat.push(trList.eq(i))
    		 }
    	}

    	if(arrStat === null || arrStat.length === 0){
    		layer.msg("请选择需要调价的数据！");
    		return;
    	}
        let arr = []
        for(let i = 0; i<arrStat.length; i++){
        	let tr = arrStat[i]
            let obj = {};
        	obj.id =  $.trim(tr.find('[name=id]').val())//同步数据id
            obj.storeAcctId =  $.trim(tr.find('[name=storeAcctId]').val())//店铺id
            let variId = $.trim(tr.find('[name=variId]').val())//variId
			if(variId != null && variId != ''){
				obj.variId =  variId;//variId
			}
			obj.storeAcct =  $.trim(tr.find('[name=storeAcct]').val())
			obj.itemId =  $.trim(tr.find('[name=itemId]').val())
			obj.prodStoreSku =  $.trim(tr.find('[name=prodStoreSku]').val())
			obj.prodSSku =  $.trim(tr.find('[name=prodSSku]').val())
			obj.listingPrice =  $.trim(tr.find('[name=listingPrice]').val())
			obj.currPrice =  $.trim(tr.find('[name=currPrice]').val())
			obj.newPrice =  $.trim(tr.find('[name=newCurrPrice]').val())
			obj.isMultiSku =  $.trim(tr.find('[name=isMultiSku]').val())

			let msgPromotion =  $.trim(tr.find('[name=msgPromotion]').text())
			let isPromotion =  $.trim(tr.find('[name=isPromotion]').text())

            if(!isMoney(obj.newPrice)){
                tr.find('[name=result]').html("<div style='color:red'>请重新输入价格</div>")
                return false
            }else if(obj.newPrice==""||obj.newPrice=="0.00"||obj.newPrice=="0"){
                layer.msg('新刊登价不能为空或者为零')
                return false
            }else if(msgPromotion === '促销未同步' && ispromotion === '是'){
                tr.find('[name=result]').html("<div style='color:red'>请先同步listing促销</div>");
            }else{
                arr.push(obj)
            }
    	}

		//以当前时间戳作为批次号
		let batchNo = new Date().getTime();
        $.ajax({
        	beforeSend: function(){
				 loading.show();
	          },
			 type: "POST",
			 url: ctx + "/shopee/shopeeIsEnableProduct/batchAdjustPromoPrice.html",
			 data: JSON.stringify({'dataList':arr, 'batchNo': batchNo}),
			 async: true,
			 contentType: "application/json",
			 dataType: "json",
			 success: function (returnData) {
				 if (returnData.code === "0000") {
					 loading.hide()
                     layer.msg(returnData.msg);
				 } else {
					 loading.hide()
					 layer.msg(returnData.msg);
				 }
			 },
			 error: function () {
				 loading.hide()
				 layer.msg("服务器正忙");
			 }
		 });


		shopeeProTimeUint = setInterval(function () {
    		sel(batchNo)
    	}, 20000);

    });

    function sel(batchNo){
		var trObj =  $('#promoAdjustPriceTable').next().find('.layui-table-body tbody').find('tr');
		var count = 0;
		for (var i = 0; i < trObj.length; i++) {
			var checkStat = trObj.eq(i).find('td').eq(0).find('div').find('input').is(":checked");
			var resultMsg = trObj.eq(i).find('td[data-field=result]').find('.layui-table-cell').find('div').text();
			if ((resultMsg == '' || resultMsg == null) && checkStat) {
				count++;
			}
		}
		if(count == 0){
			clearInterval(shopeeProTimeUint);
			return;
		}

		$.ajax({
			type: "POST",
			url: ctx + "/shopee/shopeeIsEnableProduct/selectResult.html",
			data: {'batchNo':batchNo},
			async: true,
			dataType: "json",
			success: function (returnData) {
				if (returnData.code == "0000") {
					var data = returnData.data;

					for (var i = 0; i < trObj.length; i++) {
						var itemId = $.trim(trObj.eq(i).find('td[data-field=itemId]').find('div').text());//平台商品Id
						var variId = $.trim(trObj.eq(i).find('td[data-field=variId]').find('div').text());//variId
						var checkStat = trObj.eq(i).find('td').eq(0).find('div').find('input').is(":checked");
						var resultMsg = trObj.eq(i).find('td[data-field=result]').find('.layui-table-cell').find('div').text();

						var logMsg = data['TR_SHOPEE_ADJUSTPRICE_LOG' + itemId + variId];
						if ((resultMsg == '' || resultMsg == null) && checkStat) {
							if (logMsg == '调价成功') {
								trObj.eq(i).find('td[data-field=result]').find('.layui-table-cell').html("<div style='color:blue'>" + logMsg + "</div>");
							} else if (logMsg != '' && logMsg != null && logMsg != 'undefined') {
								trObj.eq(i).find('td[data-field=result]').find('.layui-table-cell').html("<div style='color:red'>" + logMsg + "</div>");
							}
						}
					}
				}
			},
			error: function () {
				layer.msg("服务器正忙");
				clearInterval(shopeeProTimeUint);
			}
		});

    }
    //校验价格输入不能低于0

	$('input[name="newPriceInput"]').change(function(){
		if(parseFloat($(this).val())<0){
			$(this).val("");
		}
	});
    /**
     * 一键写入价格值
     */
    $("#newPriceBtn").click(function () {
		var checkStatus = table.checkStatus('promoAdjustPriceTable');
		if(checkStatus.data.length>0&&shopeetableIns){
			var layFilterIndex = 'LAY-table-'+shopeetableIns.config.index;
			var tableContainer = $('div[lay-filter="'+layFilterIndex+'"]');
			var newPrice = $("#adjustPriceSearchForm input[name='newPriceInput']").val();
			//获取表格行对象
			var calType = $("#adjustPriceSearchForm select[name='calculateType']").val();
			var originPriceType = $("#adjustPriceSearchForm select[name='originPriceType']").val();
			if(newPrice!==''){
				tableContainer.find('tbody input[name="layTableCheckbox"]:checked').each(function(){
					var tr= $(this).parents('tr');
					if(tr.css('display')!=='none'){
						let originprice = ''
						var input = tr.find('td[data-field="newCurrPrice"] div input');
						let fixedPrice = tr.find('input[name=newCurrPriceWithoutFloat]').val() //定价
						if(originPriceType == '0'){
							originprice =tr.find('input[name=currPrice]').val();
							
						}else{
							originprice =tr.find('input[name=newCurrPriceWithoutFloat]').val()
						}
						calculatePrice(calType,originprice,newPrice,input);
						 // 计算比例
						if(input.val()===''){
						input.next().remove()
						}else{
						curRadio =( (input.val()-fixedPrice)/fixedPrice *100).toFixed(2)
						htmlStr = shopeeadjustPromotionprice_getRadioStr(curRadio,fixedPrice)
						input.next().remove()
						input.after(htmlStr)
						}
					}
				});
			}else{
				layer.msg('请输入调整的价格');
			}
		}else{
			layer.msg('请选择需要调价的商品')
		}
	});
  /**
	 * 一键应用毛利率计算销售价
	 */
	$("#adjustPromotionPriceProcess_grossRate_batchSetBtn").click(function () {
		const grossProfitRate = $("#adjustPriceSearchForm [name='newGrossRate']").val()
		if (grossProfitRate == "") {
			layer.msg("请填写需要应用的毛利率")
			return
		}
		if (!isMoney(grossProfitRate)) {
			layer.msg("请填写需要应用的毛利率")
			return
		}
		let { data } = table.checkStatus("promoAdjustPriceTable")
		if (data.length > 0 && shopeetableIns) {
			var layFilterIndex = 'LAY-table-'+shopeetableIns.config.index;
			var tableContainer = $('div[lay-filter="'+layFilterIndex+'"]');
			let idObj = {}
			tableContainer.find('input[name="layTableCheckbox"]:checked').each(function(){
				var tr= $(this).parents('tr');
				if(tr.css('display')!=='none'){
					idObj[tr.find('input[name=id]').val()] = true
				}
			});
			data = data.filter(item=>idObj[item.id])
			if(!data.length){
				return layer.msg("请选择需要调价的商品")
			}
			commonReturnPromise({
				url: "/lms/shopee/shopeeIsEnableProduct/calDiscountPriceByGrossProfitRate",
				type: "post",
				contentType: "application/json",
				params: JSON.stringify({ grossProfitRate, list: data }),
			}).then(res => {
				var layFilterIndex = "LAY-table-" + shopeetableIns.config.index
				var tableContainer = $('div[lay-filter="' + layFilterIndex + '"]')
				tableContainer.find('input[name="layTableCheckbox"]:checked').each(function () {
					const tr = $(this).parents("tr")
					const id = tr.find("[name=id]").val()
					const curObj = res.filter(item => item.id === Number(id))[0]
					if (curObj && curObj.newCurrPrice) {
						tr.find('input[name="newCurrPrice"]').val(curObj.newCurrPrice)
						tr.find('td[data-field="grossRate"] div').text(curObj.grossRate)
						const radioDom = tr.find('input[name="newCurrPrice"]').next()
						if(curObj.newCurrPriceWithoutFloat !==null ||curObj.newCurrPriceWithoutFloat !==undefined  ){
						const newCurrPriceRadio = ((curObj.newCurrPrice - curObj.newCurrPriceWithoutFloat)/curObj.newCurrPriceWithoutFloat * 100).toFixed(2)
                              if(newCurrPriceRadio ==0 ){
                                radioDom.text('-')   
                                radioDom.removeClass('fRed').addClass('fGreen')
                             }else if(newCurrPriceRadio>0){
								radioDom.html(`<i class="el-icon-top"></i>${Math.abs(newCurrPriceRadio)}%`)   
                                radioDom.removeClass('fRed').addClass('fGreen')
                              }else{
								radioDom.html(`<i class="el-icon-bottom"></i>${Math.abs(newCurrPriceRadio)}%`)   
                                radioDom.removeClass('fGreen').addClass('fRed')
                                // <div class="fRed"><i class="el-icon-bottom"></i>{{Math.abs(d.newCurrPriceRadio)}}%</div>
                              }
						}else{
							radioDom.text('') 
						}

						// console.log('newCurrPriceRadio :>> ', newCurrPriceRadio);
					}
				})
			})
		} else {
			layer.msg("请选择需要调价的商品")
		}
	})

	//选自对应计算类型计算修改后的价格
	function calculatePrice(calType,originprice,newprice,input){
		switch (calType){
			case "1":
        var finalprice = (parseFloat(originprice)+parseFloat(newprice)).toFixed(2);
				input.val(finalprice);//新的价格
		   break;
		   case "2":
			var finalprice = (parseFloat(originprice)-parseFloat(newprice)).toFixed(2);
			if(finalprice>0){
				input.val(finalprice);//新的价格
			}else{
				input.val("");
				layer.msg('价格调整不得低于0');
			}
		   break;
		   case "3":
			var finalprice = (parseFloat(originprice)*parseFloat(newprice)).toFixed(2);
			input.val(finalprice);//新的价格
		   break;
		   default:
		   input.val(newprice);
		}
	}

	// 差价查询
	$('#shop_promoadjustPricefilterPrice').click(function(){
		let formDom = $('#shop_promoadjustPrice_filtForm')
		let curCondition = {
			operatorType :formDom.find('select[name=operator]').val(),
			diffPrice : parseFloat(formDom.find('input[name=diffPrice]').val())
		}
		if(!curCondition.operatorType) return showOrigin()
		var layFilterIndex = 'LAY-table-'+shopeetableIns.config.index;
		var tableContainer = $('div[lay-filter="'+layFilterIndex+'"]');
		tableContainer.find('tbody tr').each(function(){
			let newPrice = $(this).find('td[data-field="newCurrPrice"] input').val()
			let originprice = $(this).find('input[name=currPrice]').val()
			let diffPrice = parseFloat(newPrice) - parseFloat(originprice)
			filterPrice($(this),diffPrice,curCondition)
		})
		changeTotal(tableContainer)
	})

	function filterPrice(tr,diffPrice,curCondition){
		switch (curCondition.operatorType){
			case "1":
				if((diffPrice - curCondition.diffPrice).toFixed(2) > 0){
					tr.css('display','block')
				}else{
					uncheckedTrs(tr)
				}
		   break;
		   case "2":
				if((diffPrice - curCondition.diffPrice).toFixed(2) < 0){
					tr.css('display','block')
				}else{
					uncheckedTrs(tr)
				}
		   break;
		   case "3":
				if(diffPrice.toFixed(2) == curCondition.diffPrice.toFixed(2)){
					tr.css('display','block')
				}else{
					uncheckedTrs(tr)
				}
		   break;
		}
	}

	// 将未显示的选中数据设置为未选中
	function uncheckedTrs(tr){
		tr.find('input[name="layTableCheckbox"]').prop('checked',false)
		tr.css('display','none')
		table.cache.promoAdjustPriceTable[tr.data('index')].LAY_CHECKED = false
	}

	// 差价筛选 是否全选
	function isAllChecked(){
		var layFilterIndex = 'LAY-table-'+shopeetableIns.config.index;
		var tableContainer = $('div[lay-filter="'+layFilterIndex+'"]');
		let curTotalTr =tableDataLen - tableContainer.find('tbody tr[style="display: none;"]').length
		let checkedTr = tableContainer.find('tbody input[name="layTableCheckbox"]:checked').length
		tableContainer.find('thead input[name="layTableCheckbox"]').prop('checked',curTotalTr==checkedTr)
	}

	// 差价清空
	$('#shop_promoadjustPriceOrigin').click(function(){
		let formDom = $("#shop_promoadjustPrice_filtForm")
    formDom[0].reset()
		showOrigin()
	})

	function showOrigin(){
		var layFilterIndex = 'LAY-table-'+shopeetableIns.config.index;
		var tableContainer = $('div[lay-filter="'+layFilterIndex+'"]');
		tableContainer.find('tbody tr').each(function(){
			$(this).css('display','block')
		})
		changeTotal(tableContainer)
	}
	// 改变总数量
	function changeTotal(tableContainer){
		let hideNum = tableContainer.find('tbody tr[style="display: none;"]').length
		$('#tolnum_span_shopee').text(tableDataLen - hideNum)
		isAllChecked()
		form.render()
	}

});

// 计算比例
function shopeeadjustPromotionprice_newcurrprice_radio(dom) {
	const trDom = $(dom).parents("tr");
	const curVal = $(dom).val();
	$(dom).next().remove();
	const fixedPrice = trDom
	  .find("input[name=newCurrPriceWithoutFloat]")
	  .val();
	if (curVal !== "") {
	  const curRadio = (((curVal - fixedPrice) / fixedPrice) * 100).toFixed(2);
	  const htmlStr = shopeeadjustPromotionprice_getRadioStr(curRadio,fixedPrice);
	  $(dom).next().remove();
	  $(dom).after(htmlStr);
	}
  }

function shopeeadjustPromotionprice_getRadioStr(radio,fixedPrice) {
	let htmlStr = "";
	if (!Number(fixedPrice)) {
	  htmlStr = ''
	}else if (radio == 0) {
	  htmlStr = `<div class="fGreen">-</div>`;
	} else if (radio > 0) {
	  htmlStr = `<div class="fGreen"><i class="el-icon-top">${Math.abs(radio)}%</div>`;
	} else {
	  htmlStr = `<div class="fRed"><i class="el-icon-bottom">${Math.abs(radio)}%</div>`;
	}
	return htmlStr;
  }