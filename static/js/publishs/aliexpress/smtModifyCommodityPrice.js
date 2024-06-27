var smtMoCommodPriceTimeUnit = null
var smtMoCommodTableData = null
let smtMoCommodPrice_exchangeRate = null
layui.use(['admin', 'table', 'form', 'layer', 'laytpl'], function () {
    var admin = layui.admin,
        table = layui.table,
        layer = layui.layer,
        laytpl = layui.laytpl,
        form = layui.form;

    form.render()
    //smt  onlineproduct 打开当前弹窗 获取缓存数据 
    smtModifyCommodityPriceCache = window.localStorage["smtOnlineproductIsAdjust"];
    // 初始化
    smtModifyCommodityPrice_init()
    function smtModifyCommodityPrice_init(){
        Promise.all([
            commonReturnPromise({
                url: '/lms/prodCommon/getRate',
                type: 'post',
                params: {fromCurrency:'USD',toCurrency:'CNY'}
            })
        ]).then(res=>{
            smtMoCommodPrice_exchangeRate = res[0]
        })
    }

    if (smtModifyCommodityPriceCache) {
        //取到值之后清空缓存
        delete window.localStorage["smtOnlineproductIsAdjust"];
        let obj = JSON.parse(smtModifyCommodityPriceCache);
        let tableParams = obj.map(item => item.id).join(',')
        // 活动名称
        $('#smtModifyCommodityPriceForm_activityName').text(obj[0].promotionName)
        $.ajax({
            type: 'post',
            dataType: 'json',
            url: ctx + "/batchOperation/getPromotionModifyPrice.html",
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
            data: { idList: tableParams },
            beforeSend: function () { loading.show() },
            success: function (res) {
                loading.hide();
                if (res.code == '0000') {
                    res.data = res.data.map(item => ({...item, priceCny: ( item.price * smtMoCommodPrice_exchangeRate ).toFixed(2)}))
                    smtModifyCommodity_tableRender(res)
                    smtMoCommodTableData = res   //赋值方便后面进行筛选
                } else {
                    layer.msg(res.message || '请求接口失败', { icon: 2 })
                }
            },
            error: function (err) {
                layer.msg(err || err.message, { icon: 2 })
            }
        })
    }

    //table的checkbox全选、全不选
    form.on('checkbox(smtModifyCommodity_allCheked)', function (obj) {
        if (obj.elem.checked) {
            $('#smtModifyCommodityPriceTable').find('input[type=checkbox]').prop('checked', true)
        } else {
            $('#smtModifyCommodityPriceTable').find('input[type=checkbox]').prop('checked', false)
        }
        form.render('checkbox')
    })

    //table的checkbox单选、单不选
    form.on("checkbox(smtModifyCommodity_sCheked)", function (obj) {
        if (obj.elem.checked) {
            var rowsLength = $('#smtModifyCommodityPriceTable').find('input[name=singlechecked]').length
            var checkedLength = $('#smtModifyCommodityPriceTable').find('input[name=singlechecked]:checked').length
            if (rowsLength === checkedLength) {
                $('#smtModifyCommodityPriceTable').find('input[name=allchecked]').prop('checked', true)
            }
        } else {
            $('#smtModifyCommodityPriceTable').find('input[name=allchecked]').prop('checked', false)
        }
        form.render('checkbox')
    })

    /**
	 * 一键写入价格值
	 */
    let smtModifyCommodityIsNewPriceLayer = false
	$("#smtModifyCommodityPricenewPriceBtn").click(function () {
        var checkedR = $('#smtModifyCommodityPriceTable').find('input[name=singlechecked]:checked').parents('tr')
		if (checkedR.length) {
			var secondPrice = $("#smtModifyCommodityPriceForm input[name='newPriceInput']").val();
			//获取表格行对象
			var calType = $("#smtModifyCommodityPriceForm select[name='calculateType']").val()
			var priceType= $("#smtModifyCommodityPriceForm select[name='priceType']").val()
			if (secondPrice !== '') {
				checkedR.each(function () {
                    const id = $(this).data('id')
                    console.log('id :>> ', id);
                    const basicPriceObj = {
						curPrice: $(`#smtModifyCommodity_price_${id}`).text(),
						curPriceCny: $(`#smtModifyCommodity_priceCny_${id}`).text(),
						newPrice: $(`#smtModifyCommodity_newPrice_${id}`).val(),
						newPriceCny: $(`#smtModifyCommodity_newPriceCny_${id}`).val(),
					}
					if(priceType.includes('Cny')){
                        $(`#smtModifyCommodity_newPriceCny_${id}`).val(calculatePrice(basicPriceObj[priceType],calType, secondPrice))			
                        smtModifyCommodityPriceCny_blurNewP($(`#smtModifyCommodity_newPriceCny_${id}`))
					}else{
                        $(`#smtModifyCommodity_newPrice_${id}`).val(calculatePrice(basicPriceObj[priceType],calType, secondPrice))		
                        smtModifyCommodityPrice_blurNewP($(`#smtModifyCommodity_newPrice_${id}`))
					}					
				});
				smtModifyCommodityIsNewPriceLayer && layer.msg('价格调整不得低于0');
				smtModifyCommodityIsNewPriceLayer = false
			} else {
				layer.msg('请输入调整的价格');
			}
		} else {
			layer.msg('请选择需要调价的商品')
		}

	});
	//选自对应计算类型计算修改后的价格
	function calculatePrice (firstPrice, calType, secondPrice) {
        if(calType==='1'){
            return (parseFloat(firstPrice) + parseFloat(secondPrice)).toFixed(2)
        }else if(calType==='2'){
            let result = (parseFloat(firstPrice) - parseFloat(secondPrice)).toFixed(2)
            if (+result < 0) {
				result=''
				smtModifyCommodityIsNewPriceLayer = true
			}	
            return result
        }else if(calType==='3'){
            return (parseFloat(firstPrice) * parseFloat(secondPrice)).toFixed(2);
        }else{
            return secondPrice
        }
	}
});
//渲染表格
function smtModifyCommodity_tableRender(obj) {
    var getTpl = smtModifyCommodityPriceTableTpl.innerHTML
        , view = document.getElementById('smtModifyCommodityPriceTableId');
    layui.laytpl(getTpl).render(obj.data, function (html) {
        view.innerHTML = html;
    });
    layui.form.render()
    $('#smtModifyCommodity_listCount').text(obj.count)
}

//定价
function smtModifyCommodity_getPrice() {
    var checkedR = $('#smtModifyCommodityPriceTable').find('input[name=singlechecked]:checked').parents('tr')
    if (!checkedR.length) {
        return layui.layer.msg('至少选择一条数据')
    } else {
        var grossProfitRate = $('#smtModifyCommodityPriceForm input[name=grossProfitRate]').val()
        var discountRate = $("#smtModifyCommodityPriceForm input[name=discountRate]").val()
        var shippingType = $('#smtModifyCommodityPriceForm select[name=shippingType] option:selected').val()
        var skuDtoList = Array.from(checkedR.map((_, item) => ({
            prodSSku: $(item).find(`td div[name=prodSSku]`).text(),   // 子sku
            storeAcctId: $(item).find(`td div[name=storeAcctId]`).text(),  //店铺id
            freightTemplateId: $(item).find(`td div[name=freightTemplateId]`).text(),  //物流模板id
            storeSubSku:$(item).find(`td div[name=storeSubSku]`).text() //店铺子sku
        })))
        commonReturnPromise({
            url: ctx + '/batchOperation/fixPrice',
            params: JSON.stringify({ grossProfitRate, discountRate, shippingType, skuDtoList }),
            contentType: 'application/json',
            type: "post",
        }).then(data => {
            if (data.length) {
                let _checkedR = Array.from(checkedR)
                _checkedR.forEach(item => {
                    for (var i = 0; i < data.length; i++) {
                        if ($(item).find(`td div[name=storeSubSku]`).text() == data[i].storeSubSku && $(item).find(`td div[name=freightTemplateId]`).text() == data[i].freightTemplateId) {
                            const trId = $(item).data('id')
                            if (data[i].price != 0) {
                                $(item).find('td input[name=newPrice]').val(data[i].price)
                                $(item).find('td input[name=newPriceCny]').val(data[i].priceCny)
                                smtModifyCommodity_getDiffPrice(trId)
                                $(item).css('background-color','transparent')
                                break;
                            } else {
                                $(item).css('background-color','yellow')
                                $(item).find('td input[name=newPrice]').val('')
                                $(item).find('td input[name=newPriceCny]').val('')
                                smtModifyCommodity_getDiffPrice(trId)
                            }
                        }
                    }
                })
                //赋值
                let _smtMoCommodTableData = []
                _checkedR.forEach(item => {
                    let id = $(item).find('td input[name=newPrice]').attr('data-id')
                    _smtMoCommodTableData = smtMoCommodTableData.data.map(originItem => ({
                        ...originItem,
                        newPrice: id == originItem.id ? $(item).find('td input[name=newPrice]').val() : originItem.newPrice,
                        diffPrice: id == originItem.id ? $(item).find('td div[name=diffPrice]').text() : originItem.diffPrice,
                    }))
                    smtMoCommodTableData.data = _smtMoCommodTableData
                })
            } else {
                return layui.layer.msg('暂无数据')
            }
        }).catch(err => layui.layer.msg(err || err.message, { icon: 2 }))
    }
}

//差价查询
function smtModifyCommodity_screen() {
    let operator = $('#smtModifyCommodityPriceFormTwo').find('select[name=opreator]').val()
    let diffPriceVal = $('#smtModifyCommodityPriceFormTwo').find('input[name=diffPrice]').val()
    const diffPriceType = $('#smtModifyCommodityPriceFormTwo').find('select[name=diffPriceType]').val()
    let _smtMoCommodTableData = []
    _smtMoCommodTableData = smtMoCommodTableData.data.filter(item => {
        if (item.newPrice != undefined && item.newPrice != '') {
            if (operator == '=') return item[diffPriceType] == Number(diffPriceVal).toFixed(2)
            if (operator == '>') return item[diffPriceType] - Number(diffPriceVal).toFixed(2) > 0
            if (operator == '<') return item[diffPriceType] - Number(diffPriceVal).toFixed(2) < 0
        }
    })
    smtModifyCommodity_tableRender({ data: _smtMoCommodTableData, count: _smtMoCommodTableData.length })
}

function smtModifyCommodity_reset() {
    smtModifyCommodity_tableRender(smtMoCommodTableData)
}

//批量修改
function smtModifyCommodityPrice_batchEdit() {
    var checkedR = Array.from($('#smtModifyCommodityPriceTable').find('input[name=singlechecked]:checked').parents('tr'))
    if (!checkedR.length) return layui.layer.msg('至少选择一条数据')

    var _checkRArr = checkedR.map(item => ({
        id: $(item).find('td div[name=listId]').text(),
        storeAcctId: $(item).find('td div[name=storeAcctId]').text(),
        storeAcct: $(item).find('td div[name=storeAcct]').text(),
        prodSSku: $(item).find('td div[name=prodSSku]').text(),
        storeSubSku: $(item).find('td div[name=storeSubSku]').text(),
        itemId: $(item).find('td div[name=itemId]').text(),
        price: $(item).find('td div[name=price]').text(),
        priceCny: $(item).find('td div[name=priceCny]').text(),
        newPrice: $(item).find('td input[name=newPrice]').val(),
        newPriceCny: $(item).find('td input[name=newPriceCny]').val(),
    }))

    let _smtMoCommodTableData = []
    //去除于原价与新价相同
    var checkRArr = _checkRArr.filter(item => {
        if (item.price == item.newPrice) {
            $(`#smtModifyCommodity_result_${item.id}`).text('与原值相同不修改')
            $(`#smtModifyCommodity_result_${item.id}`).css('color', 'green')
        } else {
            $(`#smtModifyCommodity_result_${item.id}`).text('')
        }

        //更新列表操作项
        _smtMoCommodTableData = smtMoCommodTableData.data.map(originItem => ({
            ...originItem,
            result: (item.id == originItem.id) && (item.price == item.newPrice) ? '与原值相同不修改' : originItem.result ? originItem.result : '',
        }))
        smtMoCommodTableData.data = _smtMoCommodTableData

        return item.price != item.newPrice

    })
    if (!checkRArr.length) return
    //新刊登价不能为空或者为零
    if (checkRArr.filter(item => !Number(item.newPrice)).length) return layui.layer.msg('新刊登价不能为空或者为零')

    //以当前时间戳作为批次号
    var batchNo = new Date().getTime();

    $.ajax({
        beforeSend: function () {
            loading.show();
        },
        type: "POST",
        url: ctx + "/batchOperation/modifyMainPrice.html",
        data: { 'prodObj': JSON.stringify(checkRArr), 'batchNo': batchNo },
        async: true,
        dataType: "json",
        success: function (returnData) {
            if (returnData.code == "0000") {
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

    smtMoCommodPriceTimeUnit = setInterval(function () {
        smtModifyCommodityPrice_sel(batchNo, checkRArr)
    }, 5000);

}

//查询操作结果
function smtModifyCommodityPrice_sel(batchNo, checkRArr) {
    // 当每一项都有操作结果，
    if (!checkRArr.filter(item => !$(`#smtModifyCommodity_result_${item.id}`).text() || ($(`#smtModifyCommodity_result_${item.id}`).text() == 'null')).length) {
        //更新列表操作项
        let _smtMoCommodTableData = []
        checkRArr.forEach(item => {
            _smtMoCommodTableData = smtMoCommodTableData.data.map(originItem => ({
                ...originItem,
                result: (item.id == originItem.id) ? $(`#smtModifyCommodity_result_${item.id}`).text() : originItem.result ? originItem.result : '',
            }))
            smtMoCommodTableData.data = _smtMoCommodTableData
        })
        clearInterval(smtMoCommodPriceTimeUnit);
        return;
    }

    $.ajax({
        type: "POST",
        url: ctx + "/sys/selectResult.html",
        data: { 'batchNo': batchNo },
        async: true,
        dataType: "json",
        success: function (returnData) {
            if (returnData.code == "0000") {
                var data = returnData.data;
                checkRArr.forEach(item => {
                    var logMsg = data['SMT_MODIFY_PRICE_PROD' + item.storeSubSku + item.itemId]
                    $(`#smtModifyCommodity_result_${item.id}`).text(logMsg)
                    logMsg == '调价成功' ? $(`#smtModifyCommodity_result_${item.id}`).css('color', 'blue') : $(`#smtModifyCommodity_result_${item.id}`).css('color', 'red')
                })
            }
        },
        error: function () {
            layer.msg("服务器正忙");
            clearInterval(smtMopriceTimeUnit);
        }
    });

}

// 当前刊登价格($)输入 显示差价
function smtModifyCommodityPrice_blurNewP(dom) {
    let trId = $(dom).attr("data-id")
    let newPrice = $(dom).val()
    let newPriceCny = ""
    if ($(dom).val() != "" && $(dom).val() != undefined) {
        newPriceCny = (newPrice * smtMoCommodPrice_exchangeRate).toFixed(2)
    }
    $(`#smtModifyCommodity_newPriceCny_${trId}`).val(newPriceCny)
    smtModifyCommodity_getDiffPrice(trId)
}

// 当前刊登价格(￥)输入
function smtModifyCommodityPriceCny_blurNewP(dom) {
    let trId = $(dom).attr("data-id")
    let newPriceCny = $(dom).val()
    let newPrice = ""
    if ($(dom).val() != "" && $(dom).val() != undefined) {
        newPrice = (newPriceCny / smtMoCommodPrice_exchangeRate).toFixed(2)
    }
    $(`#smtModifyCommodity_newPrice_${trId}`).val(newPrice)
    smtModifyCommodity_getDiffPrice(trId)
}

// 差价 = 新刊登价 - 当前刊登价
function smtModifyCommodity_getDiffPrice(trId) {
    // 人民币差价
    const curPriceCny = $(`#smtModifyCommodity_priceCny_${trId}`).text()
    const newPriceCny = $(`#smtModifyCommodity_newPriceCny_${trId}`).val()
    let diffPriceCny = ""
    if (newPriceCny != "" && newPriceCny != undefined) {
        diffPriceCny = (newPriceCny - curPriceCny).toFixed(2)
    }
    $(`#smtModifyCommodity_diffPriceCny_${trId}`).text(diffPriceCny)

    // 美元差价
    const curPrice = $(`#smtModifyCommodity_price_${trId}`).text()
    const newPrice = $(`#smtModifyCommodity_newPrice_${trId}`).val()
    let diffPrice = ""
    if (newPrice != "" && newPrice != undefined) {
        diffPrice = (newPrice - curPrice).toFixed(2)
    }
    $(`#smtModifyCommodity_diffPrice_${trId}`).text(diffPrice)

    let _smtMoCommodTableData = smtMoCommodTableData.data.map(item => {
        if (item.id == trId) {
        item.newPrice = newPrice
        item.newPriceCny = newPriceCny
        item.diffPrice = diffPrice
        item.diffPriceCny = diffPriceCny
        }
        return item
    })
    smtMoCommodTableData.data = _smtMoCommodTableData
}
  