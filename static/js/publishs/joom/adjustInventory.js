var adjustInterval;
layui.use(['admin', 'form', 'layer','table', 'formSelects', 'element', 'laydate','laytpl'], function() {
	 var admin = layui.admin,
     form = layui.form,
     layer = layui.layer,
     table = layui.table,
     formSelects = layui.formSelects,
     element = layui.element,
     laydate = layui.laydate,
     laypage = layui.laypage,
	 laytpl = layui.laytpl,
	 $ = layui.$,
	 tableIns = {}

    form.render(null, 'component-form-element');
    form.render(null, 'component-form-group');
    form.render('select');
    //表格渲染结果
    //展示已知数据
    var data = new Object();
    if(joom_arr.length > 0){
        data.idList=[];
        for (var i = 0; i < joom_arr.length; i++){
            data.idList.push(joom_arr[i].id);
        }
        data.idList = data.idList.join(",");
        $('#adjustInventory_Form_idList').val(data.idList)
        tableRoload({idList:data.idList,searchType: 1})
    }
   
     //初始化店铺
     commonReturnPromise({
        url: ctx + '/sys/listStoreForRenderHpStoreCommonComponent.html',
        type: 'post',
        params: {roleNames: 'joom专员', platCode: 'joom'}
    }).then(res => {
        commonRenderSelect('joom_selectAttr_store', res, {name: 'storeAcct', code: 'id'})
        formSelects.render('joom_selectAttr_store');
    }).catch(err => layer.msg(err || err.message, { icon: 2 }))


	function tableRoload(data) {
        tableIns = table.render({
            elem: "#joom_adjustInventoryTable",
            method:'get',
            url: "/lms/onlineProductJoom/getJoomModifyStockPage",
            cols: [[
                {type: "checkbox"},
                { field: "id", title: "id" ,width: '9%'},
                { field: "storeAcctId", title: "店铺id"},
                { field: "sSku", title: "店铺SKU", width: '15%'},
                { field: "storeProdPId", title: "item_id", width: '15%'},//店铺父商品Id
                { field: "storeProdSId", title: "vari_id", width: '10%'},
                { field: "storeAcct", title: "店铺" , width: '10%'},
                { field: "prodSSku", title: "商品SKU" , width: '10%'},
                { field: "stock", title: "库存", width: '10%'},
                { field: "newStock", title: "调整库存",templet:'#joom_newStockTpl', width: '14%' },
                { field: "result",title: '操作结果', width: '10%', align: 'center',},
				{ field: "isPromotion", title: "是否黄钻" },

			]],
            where:data,
            page:true,
			id:"joom_adjustInventoryTable",
			height: 500,
            limits:[10,20,50],
            limit:10,
            done:function(res, curr, count){
            	$("[data-field='id']").hide()
                $("[data-field='storeAcctId']").hide()
                $("#tolnum_span_joomAI_stock").text("共"+count+"条");
				$("[data-field='isPromotion']").hide()
				// $("[data-field='sSku']").hide()
            }
        });
    }

    $("#adjustPriceSearchBtn").click(function () {
        let temporaryObj = serializeObject($('#adjustInventory_Form'))
        if (temporaryObj.prodSSkuList) {
            delete temporaryObj.idList
        }
        temporaryObj.searchType = 1
    	tableRoload(temporaryObj);
    });
    $("#adjustPriceResetBtn").click(function () {
        $("#adjustInventory_Form input[name='sSku']").val('');
        formSelects.value('selectAttr', []);
    });
    
    /**
     * 一键写入库存值
     */
    $("#adjustInventory_Form_newStockBtn").click(function () {
        var newStock = $("#adjustInventory_Form input[name='newStockInput']").val();
        //获取表格行对象
		if(newStock!==""){
			applytoChecked('joom_adjustInventoryTable',tableIns,function(tr){
				$.trim(tr.find('.joom_newStockTpl_newStock').val(newStock));//新的价格
                form.render()
			});
		}
    });
    
    function addRequestData(arr) {
        return  commonReturnPromise({
            url: '/lms/onlineProductJoom/batchModifyStock',
            type: 'post',
            params: JSON.stringify(arr),
            contentType: 'application/json'
        })
    }
    
    //批量修改库存消息
    $('#batchEnableProd').click(function(){
    	var arrStat = [];
    	var arr = [];
    	//获取表格行对象
		 var trObj =  $('#joom_adjustInventoryTable').next().find('.layui-table-body tbody').find('tr');
    	for(var i=0;i<trObj.length;i++){
    		 var checkStat = trObj.eq(i).find('[data-field="0"]').find('input').is(":checked");
    		 var obj = new Object();
    		 obj.id =  $.trim(trObj.eq(i).find('[data-field="id"]').text());//同步数据id
    		 //只修改被选中的商品信息
    		 if(checkStat){
    			 arrStat[i] = obj;
    		 }
    	}
    	if(arrStat==null ||arrStat.length==0){
    		layer.msg("请选择数据！");
    		return;
    	}
    	var  arr = new Array();
    	for(var i=0;i<trObj.length;i++){
    		 var obj = new Object();
    		 obj.id =  $.trim(trObj.eq(i).find('[data-field="id"]').text());//同步数据id
    		 obj.storeAcctId =  $.trim(trObj.eq(i).find('[data-field="storeAcctId"]').text());//店铺id
    		 obj.storeProdSId =  $.trim(trObj.eq(i).find('[data-field="storeProdSId"]').text());//店铺sku
    		 obj.storeProdPId =  $.trim(trObj.eq(i).find('[data-field="storeProdPId"]').text());//平台商品Id
    		 obj.variId =  $.trim(trObj.eq(i).find('[data-field="variId"]').eq(5).find('div').text());//variId
    		 obj.storeAcct =  $.trim(trObj.eq(i).find('[data-field="storeAcct"]').text());//店铺名称
    		 obj.sSku =  $.trim(trObj.eq(i).find('[data-field="sSku"]').text());//商品sku
    		 obj.stock =  $.trim(trObj.eq(i).find('[data-field="stock"]').text());//当前库存
    		 obj.newStock =  $.trim(trObj.eq(i).find('[data-field="newStock"]').find('input').val());//新的库存
			 obj.isPromotion =  $.trim(trObj.eq(i).find('[data-field="isPromotion"]').text());
			 obj.prodSSku =  $.trim(trObj.eq(i).find('[data-field="prodSSku"]').text());

			var checkStat = trObj.eq(i).find('[data-field="0"]').find('input').is(":checked");
    		 if(checkStat){
    		 	if(obj.stock ==obj.newStock){
					trObj.eq(i).find('[data-field="result"]').html("<div style='color:blue'>"+"与原值相同不修改"+"</div>");
				}else{
					arr.push(obj)
				}
			 }
    	}
        addRequestData(arr).then(res => {
            layer.msg('操作成功！')
            adjustInterval = setInterval(function () {
                sel()
            }, 5000);
        })
    });
    
    function sel(){
		var trObj =  $('#joom_adjustInventoryTable').next().find('.layui-table-body tbody').find('tr');
		for (var i = 0; i < trObj.length; i++) {
            let obj = {}
            obj.storeAcctId =  $.trim(trObj.eq(i).find('[data-field="storeAcctId"]').text());//店铺id
            obj.sSku =  $.trim(trObj.eq(i).find('[data-field="sSku"]').text());//商品sku
			var checkStat = trObj.eq(i).find('[data-field="0"]').find('input').is(":checked");
			var resultMsg = trObj.eq(i).find('[data-field="result"]').text();
			if ((resultMsg == '' || resultMsg == null) && checkStat) {
				selectResult(obj,trObj,i);
			}
		}
    }

    function selectResult(obj,trObj,i){
		delete obj.id
		commonReturnPromise({
			type: 'get',
			url: '/lms/onlineProductJoom/selectModifyStockResult',
			params: obj,
		}).then(returnData=> {
			if(returnData =='调整库存成功'){
				trObj.eq(i).find("[data-field='result']").html("<div style='color:blue'>"+returnData+"</div>");
			}else if(!!returnData){
				trObj.eq(i).find("[data-field='result']").html("<div style='color:red'>"+returnData+"</div>");
			}
		})
	}

	// 通过sku调整库存
	$('#joomadjustInventory_newStockBySku').click(function () {
		let _skuStr = $.trim($("#adjustInventory_Form input[name='prodSSkuList']").val());
		if (_skuStr == "" || _skuStr == null) return layer.msg('该方法调整库存，商品SKU必填', { icon: 0 })
		let skuStr = _skuStr.split(",").filter(item => item.trim())  //删除数组中空字符
		if(!skuStr.length) return layer.msg('请输入有效值', { icon: 0 })
		joomadjustInventory_getStockBySku(skuStr).then(res => {
			layer.open({
				type: 1,
				id: Date.now(),
				title: '调整库存',
				area: ['400px', '245px'],
				btn: !!res && res != 0 ? ["确认", "取消"] : "",
				success: function (layero) {
					laytpl($('#joomadjustInventory_stockBySku_modal').html()).render({count: res.length}, function (html) {
						$(layero).find('.layui-layer-content').html(html)
					})
				},
				yes: function (index, layero) {
					let _stock = $("#joomadjustInventory_stockBySku_form input[name=count]").val()
					if (_stock == '') return layer.msg('请填写调整库存量')
                    let temporaryArr = []
					res.forEach(value => {
                        let temporaryObj = deepCopy(value)
                        temporaryObj.newStock = _stock
                        temporaryArr.push(temporaryObj)
                    })
                    addRequestData(temporaryArr).then(res => {
                        layer.msg('操作成功！')
                        layer.close(index)
                    })
				},
				end: function () { }
			})
		})
	})
});

// type必须
// type=1  查询符合数据的数据量
// type=2  提交更改库存请求
function joomadjustInventory_getStockBySku(skuStr,stock='') {
    let params = {}
    params.storeAcctIdList = layui.formSelects.value("joom_selectAttr_store", 'val').join(',')
    params.prodSSkuList = skuStr.join(',')
    params.page = 1
    params.limit = 999999999
    params.searchType = 1

    return commonReturnPromise({
        url: '/lms/onlineProductJoom/getJoomModifyStockPage',
        type: 'get',
        params,
    })
}

/**
 * 匹配sku数量，中英文逗号和空格
 * @param {string} skuStr 输入框内容
 * @param event
 * 抄的user.js的公共方法handleSku(),没有了数量的限制
 */
 function joomadjustInventory_handleSku(skuStr,event){
    let str = skuStr.replace(/，/g,',').replace(/\s+/g,"");//中文逗号转为英文逗号，空格全部删掉
	event.target.value = str
 }