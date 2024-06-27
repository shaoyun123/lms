var joomtableIns = {}
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
    //表格渲染结果
    //展示已知数据
	var batchModifedWeightcheckStatus,checkedCheckStatus,checkdataResult = [],timeUnit_bWM
    var data = new Object();
	var  dataIdlist = '';
	var adddataObj_bmw = []
    if(joom_arr.length > 0){
        data.idList=[];
        for (var i = 0; i < joom_arr.length; i++){
            data.idList.push(joom_arr[i].id);
        }
        data.idList = data.idList.join(",");
		dataIdlist = data.idList;
    }
    if(joom_arr.length > 0){
        tanleReload(data);
        $('#batchModifedWeight_Form input[name=idList]').val(dataIdlist)
    }

    //初始化店铺
    commonReturnPromise({
        url: ctx + '/sys/listStoreForRenderHpStoreCommonComponent.html',
        type: 'post',
        params: {roleNames: 'joom专员', platCode: 'joom'}
    }).then(res => {
        commonRenderSelect('batchModifedWeight_Form_selectStore', res, {name: 'storeAcct', code: 'id'})
        formSelects.render('batchModifedWeight_Form_selectStore');
    }).catch(err => layer.msg(err || err.message, { icon: 2 }))

	//新增接口
	function requeset_barchMW(dataObj) {
		return commonReturnPromise({
			url: ctx + '/joomAdjustPrice/batchAdjustWeightAndShipping',
			type: 'post',
			params: JSON.stringify(dataObj),
			contentType: 'application/json'
		})
	}

	function tanleReload(data) {
		loading.show()
        joomtableIns = table.render({
            elem: "#batchModifedWeight_table",
            method:'get',
            url: ctx + "/joomAdjustPrice/prodAdjustShippingAndWeightPage",
            cols: [[
                {type: "checkbox"},
                { field: "id", title: "id" ,width: 100},
                { field: "storeAcctId", title: "店铺id" , width: 100},
                { field: "storeAcct", title: "店铺" , width: 100},
                { field: "sSku", title: "商品SKU" , width: 160},
                { field: "storeSku", title: "店铺SKU", width: 130},
                { field: "storeProdSId", title: "平台商品子id", width: 190},
                { field: "curr", title: "币种" , width: 90},
                { field: "currPrice", title: "当前刊登价", width: 90},
                { field: "shipping", title: "原运费", width: 80},
                { title: "新运费",templet:function (d) {
					let temporaryStrnewShipping = filterData_Bwm(`<input type="number" class="layui-input" id="bmw_newShipping" onblur="linkageEffect(this, 'newShipping')" onkeyup="linkageEffect(this, 'newShipping')" :Tem style="height:28px">`, checkdataResult, 'newShipping', d.id, d)
					return temporaryStrnewShipping
				}, width: 90},
                { field: "shippingWeight", title: "原sku重量(kg)", width: 80 },
				{ title: "新sku重量(kg)",templet:function (d) {
					let temporaryStrnewShippingWeight = filterData_Bwm(`<input type="number" class="layui-input" id="bmw_newShippingWeight" onblur="linkageEffect(this, 'newShippingWeight')" onkeyup="linkageEffect(this, 'newShippingWeight')" :Tem style="height:28px">`, checkdataResult, 'newShippingWeight', d.id, d)
					return temporaryStrnewShippingWeight
				}, width: 90},
                { title: "运费差价",templet:function (d) {
					let temporaryStrdifferShipping = filterData_Bwm('<input type="number" class="layui-input" id="bmw_differShipping" disabled :Tem style="height:28px">', checkdataResult, 'differShipping', d.id, d)
					return temporaryStrdifferShipping
				}, width: 80},
                { title: "重量差",templet:function (d) {
					let temporaryStrdifferShippingWeight = filterData_Bwm('<input type="number" class="layui-input" id="bmw_differShippingWeight" disabled :Tem style="height:28px">', checkdataResult, 'differShippingWeight', d.id, d)
					return temporaryStrdifferShippingWeight
				}, width: 80},
                { title: "操作结果", width: 150, templet: `<span id="result_batchMW"></span>`},
            ]],
            where:data,
            page:true,
            id:"batchModifedWeight_table",
            limits:[100,200,500],
            limit:100,
            done:function(res, curr, count){
            	$("[data-field='id']").css('display', 'none');
                $("[data-field='storeAcctId']").css('display', 'none');
                $("#tolnum_span_joom").text("共"+count+"条");
				loading.hide()
            }
        });

    }

	function filterData_Bwm(VirtualDom, renderData, specificData, id, initData) {
		let temporaryStr = VirtualDom,
		  temporaryObj = {}
		if (renderData && renderData.length) {
			temporaryObj = renderData.filter(v=>v.id == id)[0] || {}
			if (temporaryObj && Object.keys(temporaryObj).length) {
				temporaryStr = temporaryStr.replace(':Tem', `value="${temporaryObj[specificData] || ''}"`)
			}
		}else {
			let result = initData[specificData] == '0' ? '0' : initData[specificData]
			temporaryStr = temporaryStr.replace(':Tem', `value="${result || ''}"`)
		}
		return temporaryStr
	}

    table.on('checkbox(batchModifedWeight_table)', function(obj) {
        batchModifedWeightcheckStatus = table.checkStatus('batchModifedWeight_table') || {}
		checkedCheckStatus = batchModifedWeightcheckStatus.data || []
		$('#checkedNum_span_bmw_num').text(checkedCheckStatus.length)
    });

    form.on('submit(batchModifedWeight_searchBtn)', function(data){
        // console.log(data.elem) //被执行事件的元素DOM对象，一般为button对象
        // console.log(data.form) //被执行提交的form对象，一般在存在form标签时才会返回
        // console.log(data.field) //当前容器的全部表单字段，名值对形式：{name: value}
		if (data.field.sSkuList && data.field.sSkuList.length) {
			delete data.field.idList
		}
        delete data.field.bmw_currentFrieght_symbol
        delete data.field.bmw_currentFrieght
        delete data.field.bmw_currentWeight_symbol
        delete data.field.bmw_currentWeight
		$('#checkedNum_span_bmw_num').text(0)
		adddataObj_bmw = []
		checkedCheckStatus = []
        tanleReload(data.field)
        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
      });
	 
	//一键应用
	$('#batchModifedWeight_WeightFee').click(function () {
		let checkedCheckTem = checkedCheckStatus ? checkedCheckStatus : []
		if (!checkedCheckTem || !checkedCheckTem.length) {
			return layer.msg('请选择需要调整的数据')
		}
		let bmw_table_id = Array.from($("[data-field='id']"))
		if (checkedCheckTem) {
			adddataObj_bmw = collectData(checkedCheckTem)
			bmw_table_id.forEach(vDom => {
				adddataObj_bmw.forEach(v=> {
					if ($(vDom).text() == v.id) {
						if (v.newShipping) {
							$(vDom).parents('tr').find('#bmw_newShipping').val(v.newShipping)
						}
						if (v.newShippingWeight) {
							$(vDom).parents('tr').find('#bmw_newShippingWeight').val(v.newShippingWeight)
						}
						if (v.newShipping) {
							let differShipping_show = (v.newShipping - v.shipping).toFixed(2)
							$(vDom).parents('tr').find('#bmw_differShipping').val(differShipping_show)
						}
						if (v.newShippingWeight) {
							let differShippingWeight_show = (v.newShippingWeight - v.shippingWeight).toFixed(4)
							$(vDom).parents('tr').find('#bmw_differShippingWeight').val(differShippingWeight_show)
						}
					}
				})
			})
		}
	})
	clearInterval(timeUnit_bWM)
	//批量调整
	$('#batchModifedWeight_application').click(function () {
		let checkedCheckTem = checkedCheckStatus ? checkedCheckStatus : []
		if (!checkedCheckTem || !checkedCheckTem.length) {
			return layer.msg('请选择需要调整的数据')
		}
		let add_bmw = [] 
		if (checkedCheckTem) {
			add_bmw = collextTableData(checkedCheckTem)
		}
		clearInterval(timeUnit_bWM)
		requeset_barchMW(add_bmw).then(res => {
			checkdataResult = []
			checkdataResult = res
			let bmw_table_id = Array.from($("[data-field='id']"))
			if (checkedCheckTem) {
				bmw_table_id.forEach(vDom => {
					res.forEach(v=> {
						if ($(vDom).text() == v.id) {
							$(vDom).parents('tr').find('#bmw_newShipping').val(v.newShipping)
							$(vDom).parents('tr').find('#bmw_newShippingWeight').val(v.newShippingWeight)
							$(vDom).parents('tr').find('#bmw_differShipping').val(v.differShipping)
							$(vDom).parents('tr').find('#bmw_differShippingWeight').val(v.differShippingWeight)
						}
					})
				})
			}
			if (res && res.length) {
				layer.msg('操作成功')
			}
			// $('#batchModifedWeight_searchBtn').click()
			timeUnit_bWM = setInterval(function () {
				sel()
			}, 5000);
		}).catch(err => layer.msg(err || err.message, { icon: 2 }))
	})

	//收集table中选中的所有数据
	function collextTableData(checkedCheckTem) {
		let bmw_table_id = Array.from($("[data-field='id']")),
			temcollect = []
			checkedCheckTem = checkedCheckTem || []
		bmw_table_id.forEach(vDom => {
			checkedCheckTem.forEach(v => {
				if ($(vDom).text() == v.id) {
					let temcollectObj = v || {}
					temcollectObj.newShipping = $(vDom).parents('tr').find('#bmw_newShipping').val()
					temcollectObj.newShippingWeight = $(vDom).parents('tr').find('#bmw_newShippingWeight').val()
					temcollect.push(temcollect)
				}
			})
		})
		return checkedCheckTem
	}

	// 收集数据
	function collectData(checkedCheckTem) {
		let dataArr = [],
			dataObjTemSelFri = $('#batchModifedWeight_Form select[name=bmw_currentFrieght_symbol]').val(),
			dataObjTemNumFri = $('#batchModifedWeight_Form input[name=bmw_currentFrieght]').val(),
			dataObjTemSelWei = $('#batchModifedWeight_Form select[name=bmw_currentWeight_symbol]').val(),
			dataObjTemNumWei = $('#batchModifedWeight_Form input[name=bmw_currentWeight]').val()
			
		checkedCheckTem.forEach(v => {
			let dataObj ={},
				newShipping = calculationData(dataObjTemSelFri, dataObjTemNumFri, $('#batchModifedWeight_Form select[name=bmw_currentFrieght]'), v.shipping),
				newShippingWeight = calculationData(dataObjTemSelWei, dataObjTemNumWei, $('#batchModifedWeight_Form select[name=bmw_currentWeight]'), v.shippingWeight, 4)
			dataObj.newShipping = newShipping ? newShipping : ''
			dataObj.newShippingWeight = newShippingWeight ? newShippingWeight : ''
			dataObj.id = v.id
			dataObj.storeAcctId = v.storeAcctId
			dataObj.storeAcct = v.storeAcct
			dataObj.prodSSku = v.sSku
			dataObj.prodStoreSku = v.storeSku
			dataObj.productId = v.storeProdPId
			dataObj.currPrice = v.currPrice
			dataObj.shipping = v.shipping
			dataObj.shippingWeight = v.shippingWeight
			dataArr.push(dataObj)
		})
		return dataArr
	}

	//计算
	function calculationData(sel, num, Dom, originalNum, tofix) {
		let result
		if (num.indexOf('e') != -1) {
			Dom.text('')
			layer.msg('含有非法字符e，请重新输入')
			form.render()
			return null
		}
		num = Number(num)
		if (num) {
			if (sel == 1) {
				result = originalNum + num
			}else if (sel == 2) {
				result = originalNum - num
			}else if (sel == 3) {
				result = originalNum * num
			}else if (sel == 4) {
				result = originalNum / num
			}
			return tofix ? result.toFixed(tofix) : result.toFixed(2)
		}else {
			result = ''
			return result
		}
	}

	function sel(){
		var trObj =  $('#batchModifedWeight_table').next().find('.layui-table-body tbody').find('tr');
    	for(var i=0;i<trObj.length;i++){
      		var obj = new Object();
      		obj.id =  $.trim(trObj.eq(i).find("[data-field='id']").text());//id
      		obj.storeAcctId =  $.trim(trObj.eq(i).find("[data-field='storeAcctId']").text());//店铺id
      		obj.prodStoreSku =  $.trim(trObj.eq(i).find("[data-field='sSku']").text());//商品子sku
      		var checkStat = false
     		var resultMsg = trObj.eq(i).find("[data-field='result']").text();
     		let bmw_newShipping = trObj.eq(i).find('td').find('#bmw_newShipping').val();
			let resultTem = checkdataResult.filter(v=>v.id == obj.id)[0] || {}
			if (resultTem && Object.keys(resultTem).length && bmw_newShipping) {
				checkStat = true
			}
     		if((resultMsg=='' || resultMsg==null) && checkStat){
     		 selectResult(obj,trObj,i);
     		}
       	}
    }
    
    function selectResult(obj,trObj,i){
		delete obj.id
		commonReturnPromise({
			type: 'post',
			url: ctx + '/joomAdjustPrice/selectResult.html',
			params: {'prodObj':JSON.stringify(obj)},
		}).then(returnData=> {
			// console.log(returnData);
			if(returnData =='调价成功'){
				trObj.eq(i).find("[data-field='result']").html("<div style='color:blue'>"+returnData+"</div>");
			}else if(returnData!=''&& returnData!=null &&returnData != 'undefined'){
				trObj.eq(i).find("[data-field='result']").html("<div style='color:red'>"+returnData+"</div>");
			}
		}).catch(err => layer.msg(err || err.message, { icon: 2 }))
    	
	}
});
function linkageEffect(thisDom, tips) {
	let newPri = $(thisDom).val()
	let oldPri = 0,result = 0
	if (tips == 'newShipping') {
		oldPri = $(thisDom).parents('tr').find('td[data-field=shipping]').text()
		result = (newPri - oldPri).toFixed(2)
		$(thisDom).parents('tr').find('#bmw_differShipping').val(result)
		if (newPri == '') {
			$(thisDom).parents('tr').find('#bmw_differShipping').val('')
		}
	}else {
		oldPri = $(thisDom).parents('tr').find('td[data-field=shippingWeight]').text()
		result = (newPri - oldPri).toFixed(4)
		$(thisDom).parents('tr').find('#bmw_differShippingWeight').val(result)
		if (newPri == '') {
			$(thisDom).parents('tr').find('#bmw_differShippingWeight').val('')
		}
	}
}