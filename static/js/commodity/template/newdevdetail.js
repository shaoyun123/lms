var newdevelop_logisAttrList
var newdevelop_onEditDetailDto
var priceTableList = []
// 新增1个fba定价信息
function newdevdetail_addOneFbaProd(data) {
    if (!data) {
        data = {}
    }
    let tbody = $('#newdevdetail_detail_fbaProdTbody')
    let tr = '<tr>'
    tr += '<td><input data-name1="id" value="'+ (data.id || '') +'" type="hidden" ><input data-name1="sSku" maxlength="50" value="'+ (data.sSku || '') +'" class="layui-input" disabled></td>'
    tr += '<td><input data-name1="style" maxlength="50" value="'+ (data.style || '') +'" class="layui-input" disabled></td>'
    tr += '<td><input data-name1="packType" maxlength="50" value="'+ (data.packType || '') +'" class="layui-input" disabled></td>'
    tr += '<td><input data-name1="cost" maxlength="9" value="'+ (data.cost || '') +'" class="layui-input" disabled></td>'
    tr += '<td><input data-name1="weight" maxlength="9" value="'+ (data.weight || '') +'" class="layui-input" disabled></td>'
    tr += '<td><input data-name1="deliverLength" maxlength="9" value="'+ (data.deliverLength || '') +'" class="layui-input" disabled></td>'
    tr += '<td><input data-name1="deliverWidth" maxlength="9" value="'+ (data.deliverWidth || '') +'" class="layui-input" disabled></td>'
    tr += '<td><input data-name1="deliverHeight" maxlength="9" value="'+ (data.deliverHeight || '') +'" class="layui-input" disabled></td>'
    tr += '<td colspan="6" style="padding: 0"><table data-arr="priceList">'
    for (let i = 0; i < data.priceList.length; ++i) {
        tr += '<tr>'
        tr += '<td width="60px"><input data-name2="country" value="'+ (data.priceList[i].country || '') +'" class="layui-input" disabled style="border: 0"></td>'
        tr += '<td><input data-name2="preListingPrice" value="'+ (data.priceList[i].preListingPrice || '') +'" class="layui-input" disabled></td>'
        tr += '<td><input data-name2="airTransportProfitRate" value="'+ (data.priceList[i].airTransportProfitRate || '') +'" class="layui-input" disabled ></td>'
        tr += '<td><input data-name2="airDeliveryProfitRate" value="'+ (data.priceList[i].airDeliveryProfitRate || '') +'" class="layui-input" disabled ></td>'
        tr += '<td><input data-name2="seaTransportProfitRate" value="'+ (data.priceList[i].seaTransportProfitRate || '') +'" class="layui-input" disabled ></td>'
        tr += '<td><input data-name2="deliveryAmount" value="'+ (data.priceList[i].deliveryAmount || '') +'" class="layui-input" disabled></td>'
        tr += '</tr>'
    }
    tr += '</table></td>'
    tr += '</tr>'
    tbody.append(tr)
    layui.form.render('checkbox','newdevdetail_detail_fbaProdTbody')
}
// 计算价格
function newdevdetail_getPrice(selector) {
    let data = {
        'price': $('#' + selector + " input[name='cost']").val(),
        'weight': $('#' + selector + " input[name='weight']").val()
    }
    if (!data.price || !data.weight) {
        return
    }
    $.ajax({
        type: 'post',
        url: ctx + '/preProdDev/getPrice.html',
        dataType: 'json',
        data: data,
        success: function (returnData) {
            if (returnData.code != '0000') {
                layer.alert(returnData.msg)
            } else {
                $('#newdevdetail_smtPrice_edit').val(returnData.data.smtPrice)
                $('#newdevdetail_wishPrice_edit').val(returnData.data.wishPrice)
                $('#newdevdetail_ebayPrice_edit').val(returnData.data.ebayPrice)
                $('#ebayUSPrice_edit').val(returnData.data.ebayUSPrice)
                $('#ebayUKPrice_edit').val(returnData.data.ebayUKPrice)
                $('#ebayAUPrice_edit').val(returnData.data.ebayAUPrice)
            
                var smtCompPrice = $('#' + selector + " input[name=smtCompPrice]").val()
                var wishCompPrice = $('#' + selector + " input[name=wishCompPrice]").val()
                var ebayCompPrice = $('#' + selector + " input[name=ebayCompPrice]").val()
        
                newdevdetail_getPercentage(returnData.data.smtPrice, smtCompPrice, 'newdevdetail_smtPercent_edit')
                newdevdetail_getPercentage(returnData.data.wishPrice, wishCompPrice, 'newdevdetail_wishPercent_edit')
                newdevdetail_getPercentage(returnData.data.ebayPrice, ebayCompPrice, 'newdevdetail_ebayPercent_edit')
            }
        }
    })
}
// 计算我们定价与竞品价格差异百分比
function newdevdetail_getPercentage(ourPrice, compPrice, id) {
    if (!compPrice) {
        return
    }
    var percent = Math.round((ourPrice - compPrice) / compPrice * 10000) / 100.00 + '%'
    $('#' + id).val(percent)
}
function newdevdetail_changeTotalValue(self) {
    var box = $(self).closest('.layui-form-item')
    var cost = box.find('[name=cost]').val()
    var weight = box.find('[name=weight]').val()
    cost = cost ? parseFloat(cost) : 0
    weight = weight ? parseFloat(weight) : 0
    if (cost && weight) {
        box.find('[name=totalValue]').val(accAdd(cost,accMul(weight,0.1)))
    }
}
function newdevdetail_routerTo(url) {
    if (!url) {
        return
    }
    window.open(url)
}
function newdevdetail_getProdDetail(prodPId,pSku,isLink = false) {
    if (!prodPId && !pSku) {
        return
    }
    // isLink 是否从以图搜图跳转
    let url = isLink ? ctx + '/preProdDev/getPreProdDetail.html' : ctx + '/preProdDev/getPreProdDetailByProdPId.html'
    let params = {}
    if (isLink) {
        params = {'id': prodPId }
    } else {
        params = {'prodPId': prodPId, 'pSku': pSku}
    }
    loading.show()
    $.ajax({
        type: 'post',
        url,
        data: params,
        dataType: 'json',
        success: function (returnData) {
            loading.hide()
            if (returnData.code !== '0000') {
                layer.msg(returnData.msg, {icon: 5})
            } else {
                newdevelop_onEditDetailDto = returnData.data
                getLogisAttrList1()
                getDevTypeList()
                let pojo = returnData.data
                $("#newdevdetail_xtreeDetailDiv").text(pojo.cateName)
                // 赋值
                let formEle = $('#newdevDetail_preProdEditFrom')
                let inps = formEle.find('[name]')
                for (let i = 0; i < inps.length; ++i) {
                    inps[i].value = pojo[inps[i].getAttribute('name')] || ''
                    inps[i].setAttribute('disabled','disabled')
                    if (inps[i].getAttribute('name') === 'grossProfitRate') {
                        inps[i].value = 15
                    }
                }
                formEle.find('[name=isAlonePack]').val(pojo.isAlonePack ? '是' : '否')
                formEle.find('[name=isSpecialPack]').val(pojo.isSpecialPack ? '是' : '否')
                // 计算价值
                newdevdetail_changeTotalValue($('#newdevDetail_preProdEditFrom [name=cost]')[0])
                // newdevdetail_getPrice('newdevDetail_preProdEditFrom')
                //计算事件
                getPrice('newdevDetail_preProdEditFrom')
                //图片
                let imageArr = returnData.data.image.split('||')
                for (let i = 0; i < imageArr.length; ++i) {
                    $('#newdevdetail_image_edit' + i).html('<img src=' + prepIVP + imageArr[i] + " class='imgCss img_show_hide' style='width:150px;height:150px;border:1px solid #f2f2f2' />")
                }
                //竞品数据渲染
                var compList = returnData.data.compList
                // console.log(compList,'compList')
                for (var i in compList) {
                    var comp = compList[i]
                    //undefined处理
                    comp.grossInRate = comp.grossInRate || ''
                    comp.profit = comp.profit || ''
                    comp.isSimilar = comp.isSimilar || false
                    //平台和币种处理
                    var plat_sel = [],
                        currency_sel = []

                    //html数组处理
                    var tr_arr = [
                        '<tr>',
                        '<td width="100px"><div class="layui-form">' + comp.platCode + '</div></td>',
                        '<td width="100px"><div class="layui-form">' + comp.siteCode + '</div></td>',
                        '<td width="250px"><div onclick="newdevdetail_routerTo(this.innerText)" class="canClickEl overContentEllipsis w250">' + comp.url + '</div></td>',
                        '<td>' + (comp.salesNum != null ? comp.salesNum : '') + '</td>',
                        '<td>' + (comp.salesMoney || '') + '</td>',
                        '<td>' + (comp.price || '') + '</td>',
                        '<td width="80px">' + comp.currency + '</td>',
                        '<td>'+ (comp.isSimilar ? '是' : '否') + '</td>',
                        '<td>' + (comp.score || '') + '</td>',
                        '<td>' + (comp.cateRanking || '') + '</td>',
                        '<td>' + (comp.launchTime || '') + '</td>',
                        '<td>' + (comp.creator || '') + '</td>',
                        '<td>' + layui.admin.Format(comp.createTime, 'yyyy-MM-dd hh:mm:ss') + '</td>',
                        '</tr>'
                    ]
                    $('#newdevDetail_compList_editTbody').append(tr_arr.join(''))
                }

                // 渲染fba商品信息
                if (returnData.data.fbaProdList && returnData.data.fbaProdList.length > 0) {
                    for (let i = 0; i < returnData.data.fbaProdList.length; ++i) {
                        newdevdetail_addOneFbaProd(returnData.data.fbaProdList[i])
                    }
                }
                newdevdetail_calFbaTotalCost()
                layui.form.render('select','newdevDetail_preProdEditFrom')
                newdevelopRenderProdTags('newdevelop_prodTags', returnData.data.prodTags || '');
                renderFormInput('newdevDetail_preProdEditFrom', 'prodHotSaleId', returnData.data.prodHotSaleId || '')
                setTimeout(() => {
                    if (returnData.data.logisticAttr) {
                        var combLogisAttrList = returnData.data.logisticAttr.split(',')
                        for (var i = 0; i < combLogisAttrList.length; i++) {
                            var checkAttr = $('#newdevelop_logisticAttr :checkbox[value=\'' + combLogisAttrList[i] + '\']')
                            checkAttr.prop('checked', true)
                        }
                    }
                    $('#preProdEditFrom_devtype').val(pojo.type)
                    layui.form.render()
                }, 500)
            }
        },
        error: function () {
            loading.hide()
            layer.msg('发送请求失败')
        }
    })
}
function getLogisAttrList1() {
    let ajax = new Ajax(false)
    let Adata = { enumNameListStr: 'LogisAttrEnum' }
    ajax.post({
        url: ctx + '/enum/getLogisAttrEnum.html',
        success: function(res) {
            if (res.code === '0000') {
                newdevelop_logisAttrList = []
                for (let i = 0; i < res.data.length; ++i) {
                    newdevelop_logisAttrList.push(res.data[i].name)
                }
                let allStr = ''
                newdevelop_logisAttrList?.forEach(item => {
                    let str = `<input type='checkbox' lay-skin='primary' name='logisticAttr' title='${item}' value='${item}'>`
                    allStr += str
                })
                console.log(allStr)
                $('#newdevelop_logisticAttr').html(allStr)
                layui.form.render()
            } else {
                layer.msg('初始化物流属性失败:' + res.msg)
            }
        }
    })
}

function getDevTypeList() {
    commonReturnPromise({
        url: '/lms/enum/getPreProdDevTypeEnum.html'
      }).then(res => {
        commonRenderSelect('preProdEditFrom_devtype', res, { name: "name", code: "code" })
      }).then(() => {
        layui.form.render()
    })
}
function renderFormInput(selector, name, value) {
    $('#' + selector + ' [name="' + name + '"]').val(value)
}
//渲染商品标签
function newdevelopRenderProdTags(id, defaultVal){
    commonReturnPromise({
      url: '/lms/preProdDev/queryProdTags.html'
    }).then(res => {
      commonRenderSelect(id, res, { name: "name", code: "name" }).then(function () {
        layui.formSelects.render(id);
        if(defaultVal){
            layui.formSelects.value(id, defaultVal.split(','));
        }
      })
    });
  }
function newdevdetail_getFbaProdByTrEle(trEle) {
    let fbaProd = {}
    let attrs = trEle.find('[data-name1]')
    for (let i = 0; i < attrs.length; ++i) {
        fbaProd[attrs[i].getAttribute('data-name1')] = attrs[i].value
    }
    let pricelistTr = trEle.find('[data-arr=priceList] tr')
    fbaProd.priceList = []
    for (let i = 0; i < pricelistTr.length; ++i) {
        let one = {}
        let priceAttrs = $(pricelistTr[i]).find('[data-name2]')
        for (let j = 0; j < priceAttrs.length; ++j) {
            one[priceAttrs[j].getAttribute('data-name2')] = priceAttrs[j].value.trim()
        }
        fbaProd.priceList.push(one)
    }
    return fbaProd
}
function newdevdetail_calFbaTotalCost() {
    // 获取所有完整的fba信息
    let trList = $('#newdevdetail_detail_fbaProdTbody>tr')
    let fbaProdList = []
    for (let i = 0; i < trList.length; ++i) {
        let currentTr = $(trList[i])
        let one = newdevdetail_getFbaProdByTrEle(currentTr)
        if (!one.cost || !isMoney(one.cost)) {
            continue
        }
        if (!one.weight || !isMoney(one.weight)) {
            continue
        }
        if (!one.deliverLength || !isMoney(one.deliverLength)) {
            continue
        }
        if (!one.deliverWidth || !isMoney(one.deliverWidth)) {
            continue
        }
        if (!one.deliverHeight || !isMoney(one.deliverHeight)) {
            continue
        }
        fbaProdList.push(one)
    }

    let amtEle = $('#newdevdetail_totalFbaProdDeliverAmount')
    let prodCostEle = $('#newdevdetail_totalFbaProdCost')
    let freightFeeEle = $('#newdevdetail_totalFbaFreightFee')
    let totalCostEle = $('#newdevdetail_totalFbaCost')

    if (fbaProdList.length === 0) {
        amtEle.html('0')
        prodCostEle.html('0')
        freightFeeEle.html('0')
        totalCostEle.html('0')
    }
    let amt = 0,prodCost = 0,freightFee = 0, totalCost = 0
    for (let i = 0; i < fbaProdList.length; ++i) {
        let camt = 0;   // 当前款式的总发货数量
        let weight = fbaProdList[i].weight // 当前款式的重量
        let vWeight = accDiv(accMul(accMul(fbaProdList[i].deliverLength,fbaProdList[i].deliverWidth),fbaProdList[i].deliverHeight),6)   // 当前款式的抛重
        if (weight < vWeight) {
            weight = vWeight
        }
        let oneFreightCost = accMul(weight,0.04)    // 当前款式的运费成本
        for (let j = 0; j < fbaProdList[i].priceList.length; ++j) {
            if (!fbaProdList[i].priceList[j].deliveryAmount || !isInteger(fbaProdList[i].priceList[j].deliveryAmount)) {
                continue
            }
            camt = accAdd(camt,fbaProdList[i].priceList[j].deliveryAmount)
        }
        let cprodCost = accMul(camt,fbaProdList[i].cost)
        let cFreightFee = accMul(camt,oneFreightCost)
        let cTotalCost = accAdd(cprodCost,cFreightFee)
        amt = accAdd(amt,camt)
        prodCost = accAdd(prodCost,cprodCost)
        freightFee = accAdd(freightFee,cFreightFee)
        totalCost = accAdd(totalCost,cTotalCost)
    }
    amtEle.html(amt)
    prodCostEle.html(prodCost.toFixed(2))
    freightFeeEle.html(freightFee.toFixed(2))
    totalCostEle.html(totalCost.toFixed(2))
}
function newdevdetail_openDevDetail(prodPId,pSku, isLink=false) {
    var index = layer.open({
        type: 1,
        title: '开发详情',
        area: ['90%', '100%'],
        shadeClose: false,
        content: $('#newdevdetail_detailPop').html(),
        success: function (layero) {
            // 获取原数据
            // 计算价格
            $('#newDevCalculate').click(function() {
                getPrice('newdevDetail_preProdEditFrom')
            })
            newdevdetail_getProdDetail(prodPId,pSku, isLink)
        },
        btn: ['关闭'],
        end: function() {
            $('#priceList_Tbody').html()
             priceTableList = []
        }
    })
}

// 计算价格
function getPrice(selector) {
    let grossProditRate = $('#' + selector + ' input[name=\'grossProfitRate\']').val() || 0
    let logisticAttrDoms = $("#newdevDetail_preProdEditFrom input[name=logisticAttr]");//得到所有的checkbox
    let logisAttrList = []
    for(var i=0; i < logisticAttrDoms.length; i++) {
        if(logisticAttrDoms[i].checked){ //如果checkbox被选中
        logisAttrList.push(logisticAttrDoms[i].value)
    }}
    let data = {
        'price': $('#' + selector + ' input[name=\'cost\']').val(),
        'weight': $('#' + selector + ' input[name=\'weight\']').val(),
        'grossProfitRate': grossProditRate / 100,
        logisAttrList: logisAttrList.toString(),
        outerBoxLength: $('#' + selector + ' input[name=\'outerBoxLength\']').val(),
        outerBoxWidth: $('#' + selector + ' input[name=\'outerBoxWidth\']').val(),
        outerBoxHeight: $('#' + selector + ' input[name=\'outerBoxHeight\']').val()
    }
    if (!data.price || !data.weight || !data.grossProfitRate) {
        return
    }
    devGetPrice(data)
}

function getRowPrice(self) {
    let dom = $(self).parents('tr')
    let logisticAttrDoms = $("#newdevDetail_preProdEditFrom input[name=logisticAttr]");//得到所有的checkbox
    let logisAttrList = []
    for(var i=0; i < logisticAttrDoms.length; i++) {
        if(logisticAttrDoms[i].checked){ //如果checkbox被选中
        logisAttrList.push(logisticAttrDoms[i].value)
    }}

    let data = {
        weight: $(dom).find("[name=weight1]").text(),
        price: $(dom).find('[name=cost1]').text(),
        priceName: $(dom).find('[name=priceName]').text(),
        grossProfitRate: $(dom).find('[name=grossProfitRate]').val() / 100,
        logisAttrList: logisAttrList.toString(),
        outerBoxLength: $('#newdevDetail_preProdEditFrom input[name=\'outerBoxLength\']').val(),
        outerBoxWidth: $('#newdevDetail_preProdEditFrom input[name=\'outerBoxWidth\']').val(),
        outerBoxHeight: $('#newdevDetail_preProdEditFrom input[name=\'outerBoxHeight\']').val()
    }
    loading.show()
    $.ajax({
        type: 'post',
        url: ctx + '/preProdDev/getPrice.html',
        dataType: 'json',
        data: data,
        success: function(returnData) {
            loading.hide()
            if (returnData.code !== '0000') {
                layer.alert(returnData.msg)
            } else {
                let tableList = []
                // 如果是每行的计算操作
                // 替换该行的计算结果
                let price = returnData.data[Object.keys(returnData.data)[0]]
                $(dom).find('[name=salePrice]').text(price)
                priceTableList?.forEach(item => {
                    if (item.priceName === Object.keys(returnData.data)[0]) {
                        item.price = price
                    }
                })
            }
        }
    })
}
function devGetPrice(data) {
    var layer = layui.layer,
        $ = layui.$,
        laytpl = layui.laytpl;
    loading.show()
    $.ajax({
        type: 'post',
        url: ctx + '/preProdDev/getPrice.html',
        dataType: 'json',
        data: data,
        success: function(returnData) {
            loading.hide()
            if (returnData.code !== '0000') {
                layer.alert(returnData.msg)
            } else {
                let tableList = []
                // 根据 platPriceList 获取表格数据
                Object.keys(platPriceList).forEach(item => {
                    // if (Object.keys(returnData.data)?.includes(item)) {
                        let obj = Object.assign(platPriceList[item], 
                            {   weight: data.weight,
                                grossProfitRate: data.grossProfitRate * 100,
                                price: returnData.data[item]?.listingDollar || '',
                                cost:data.price
                            }) 
                        tableList.push(obj)
                    // }
                })
                priceTableList = tableList;
                
                let list = tableList.slice(0, 5)
                laytpl($("#priceTableContainer1").html()).render(list, function(html){
                    $('#priceList_Tbody').html(html)
                });

                // 回显竞品价格
                if (newdevelop_onEditDetailDto) {
                    showComPrice(newdevelop_onEditDetailDto);
                }
            }
        }
    })
}

function expandAll() {
    var layer = layui.layer,
        $ = layui.$,
        laytpl = layui.laytpl;
    let text = $('.expand').text()
    if (text === '展开所有') {
        laytpl($("#priceTableContainer1").html()).render(priceTableList, function(html){
            $('#priceList_Tbody').html(html)
            $('.expand').text('收起')
        });
    }
    let list = priceTableList.slice(0, 5)
    if (text === '收起') {
        laytpl($("#priceTableContainer1").html()).render(list, function(html){
            $('#priceList_Tbody').html(html)
            $('.expand').text('展开所有')
        });
    }
}

function showComPrice(data) {
    var layer = layui.layer,
        $ = layui.$,
        laytpl = layui.laytpl;
    priceTableList?.forEach(item => {
        if (Object.keys(data).includes(item.comPriceName)) {
            item.comPrice = data[item.comPriceName]
            item.diffVal = Math.round((item.price - item.comPrice) / item.comPrice * 10000) / 100.00 + '%'
        }
    })
    let list = priceTableList.slice(0, 5)
    laytpl($("#priceTableContainer1").html()).render(list, function(html){
        $('#priceList_Tbody').html(html)
        $('.expand').text('展开所有')
    });
}

function newDevCalculateRow(self) {
    getRowPrice(self)
}

function changeComPrice(self) {
    let price = $(self).closest('td').prev().text() || ''
    let comPrice = $(self).val() || ''
    let diffDom = $(self).closest('td').next()
    let tableIndex = $(self).closest('tr').index()
    priceTableList[tableIndex].comPrice = comPrice
    if (isNumber(comPrice)) {
        getPercentage(price, comPrice, diffDom)
    } else {
        $(diffDom).text('')
        return layer.msg('请输入数字')
    }
}

// 计算我们定价与竞品价格差异百分比
function getPercentage(ourPrice, compPrice, dom) {
    if (!compPrice) {
        return
    }
    var percent = Math.round((ourPrice - compPrice) / compPrice * 10000) / 100.00 + '%'
    $(dom).text(percent)
}