/**
 * 打印万邑通商品标签
 * @param list
 *  传入的数据模型
 *  {
 *      registerSku: "MRZB14B91-9_641",  // 要打印的注册sku
 *      actAmount: 5    // 要打印的数量
 *  }
 */
function printWinitProd(list) {
    let ajax = new Ajax();
    ajax.post({
        url: ctx + "/winitMatchChannel/printProdTag.html",
        data: JSON.stringify(list),
        contentType: 'application/json',
        success: function (res) {
            console.log(res)
            if (res.code === '0000') {
                let obj ={}
                obj.printType = 16;
                obj.base64 = res.data.data
                obj.width = "60";
                obj.height = "40";
                obj.amount = list[0].actAmount
                printBase64(obj);
            }
        }
    })
}

/**
 * 打印谷仓商品标签
 *  * @param json
 *  {
 *      registerSku: "MRZB14B91-9_641",  // 要打印的注册sku
 *      actAmount: 5    // 要打印的数量
 *  }
 */
function printGoodcangProd(json) {
    if (!json) {
        layui.layer.msg('请传入要打印的数据')
        return
    }
    let skuList = [json.registerSku]
    let ajax = new Ajax();
    ajax.post({
        url: ctx + "/winitMatchChannel/printGoodcangSku.html",
        data: JSON.stringify(skuList),
        contentType: 'application/json',
        success: function (res) {
            console.log(res)
            if (res.code === '0000') {
                try {
                    let Adata = JSON.parse(res.data)
                    let response = Adata['SOAP-ENV:Body']['ns1:callServiceResponse']['response']
                    let base64 = response.data.label_image
                    let obj ={}
                    obj.printType = 16;
                    obj.base64 = base64
                    obj.width = "60";
                    obj.height = "40";
                    obj.amount = json.actAmount
                    printBase64(obj);
                } catch(e) {
                    layui.layer.msg(res.data)
                }
            }
        }
    })
}


/**
 * 打印递四方商品标签
 *  * @param json
 *  {
 *      registerSku: "MRZB14B91-9_641",  // 要打印的注册sku
 *      actAmount: 5    // 要打印的数量
 *  }
 */
function printDsfProd(json) {
    if (!json) {
        layui.layer.msg('请传入要打印的数据')
        return
    }
    let ajax = new Ajax();
    ajax.post({
        url: ctx + "/winitMatchChannel/printDsfSku.html",
        data: json.registerSku,
        contentType: 'application/json',
        success: function (res) {
            console.log(res)
            if (res.code === '0000') {
                try {
                    let Adata = JSON.parse(res.data)
                    let response = Adata.data
                    let obj ={}
                    obj.printType = 100;
                    obj.url = response.label_url
                    obj.width = "60";
                    obj.height = "40";
                    obj.amount = json.actAmount + ""
                    StandardPrint(obj);
                } catch(e) {
                    layui.layer.msg(res.data)
                }
            }
        }
    })
}

function printWinitProdTagBySelfTemplate(obj,amount) {
    let printDto = {
        jspaper: 'winitProdCode.jasper',
        printDetailDtoList: [{
            titleMap: {
                winitCode: obj.winitCode,
                registerSku: obj.registerSku,
                label1: 'Made In China',
                label2: 'Please save this label'
            },
            amount: amount
        }]
    }
    printStandard(printDto)
}
/**
 * 打印万邑通配货单
 * @param id  配货明细单id
 */
function printDeliverDetail(id) {
    let ajax = new Ajax(false);
    ajax.post({
        url: ctx + "/winitMatchChannel/queryDeliverDetail.html",
        data: id,
        contentType: 'application/json',
        success: function (res) {
            if (res.code === '0000') {
                // 判断是否信件
                let letterTag = ''
                if (res.data.channel === 'ebay英国') {
                    letterTag = isUKLetter(res.data.winitLength,res.data.winitWidth, res.data.winitHeight,res.data.suttleWeight, res.data.packWeight) ? '(信件)' : ''
                } else if (res.data.channel === 'ebay德国') {
                    letterTag = isDELetter(res.data.winitLength,res.data.winitWidth, res.data.winitHeight,res.data.suttleWeight, res.data.packWeight) ? '(信件)' : ''
                }
                console.log(letterTag)
                let deliverPrint = {
                    jspaper: 'winitMatch.jasper',
                    printDetailDtoList: [{
                        titleMap: {
                            deliverId: res.data.id,
                            amount: res.data.amount + letterTag,
                            sku: res.data.registerSku + (res.data.isCombination ? '(组合)' : ''),
                            firstWayCompany: res.data.saleLogisticsType,
                            storeName: res.data.winitStoreName
                        }
                    }]
                }
                // 打印配货面单
                printStandard(deliverPrint)
            }
        }
    })
}

function isUKLetter(winitLength,winitWidth,winitHeight,suttleWeight,packWeight) {
    if (winitHeight < 2.5 && winitWidth < 25 && winitLength < 35.3
        && (suttleWeight + packWeight) < 750) {
        return true
    }
    return false
}


function isDELetter(winitLength,winitWidth,winitHeight,suttleWeight,packWeight) {
    if (winitHeight < 2 && winitWidth < 25 && winitLength < 35.3
        && (suttleWeight + packWeight) < 500) {
        return true
    }
    return false
}

