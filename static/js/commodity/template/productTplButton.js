/**
 * 竞品链接点击事件
 * @param {Object} pSku
 * @param {Object} pid
 * @param {Object} callbackfunc 回调函数 add by zhaoyd 0710
 */
function compUrl_producttpl(pSku, pid,callbackfunc) { // ifCheck  是否有审核权
    if (typeof(pSku) == undefined || pSku =='') {
        layer.msg("添加竞品链接失败，没有基础商品sku!",{icon:5});
        return;
    }
    if(currencyArrayprodButton != null &&currencyArrayprodButton.length > 0 ){//如果已有币种枚举
        var index = layer.open({
            type: 1,
            title: '竞品链接',
            area: ['80%', '90%'],
            btn: ['保存', '关闭'],
            yes: function (index, layero) {
                layer.close(index);
            },
            shadeClose: false,
            content: $('#tpl_compUrlLayer').html(),
            success: function () {
                // 初始化站点选项
                initSalesSiteOption_productTplButton()
                // 平台选择事件
                layui.form.on('select(compSelPlatChose)',function (data) {
                    setSiteCodeOption_productTplButton(data.elem)
                })
                tpl_genCompTable(pSku);

                $('#tpl_compAdd').click(function () {
                    add_competitionTable_tplButton('tpl_compList')
                    layui.form.render('select')
                    layui.form.render('checkbox','tpl_compList')
                })
            },
            yes: function () {
                tpl_submitComp(pSku, pid);
            },
            end: function () {
                $('#tpl_compList').html("");
            }
        })
    }else{
        //获取币种枚举
        $.ajax({
            type: 'post',
            url: ctx + '/sysdict/getCurrencyEnums.html',
            dataType: 'json',
            success: function (returnData) {
                if (returnData.code == '0000') {
                    $.each(returnData.data,function(index,element){
                        currencyArrayprodButton.push(element.name);
                    });
                    if(currencyArrayprodButton.length > 0){
                      compUrl_producttpl(pSku, pid);
                    }
                } else {
                    console.log("竞品链接，获取币种枚举值失败！")
                }
            },
            error: function () {
                console.log("竞品链接，获取币种枚举值失败！")
            }
        })
    }
    //回调函数
    if(callbackfunc){
        callbackfunc();
    }
}

function initSalesSiteOption_productTplButton() {
    if (!$('#salesSiteBox_productTplButton').prop('data-init')) {
        loading.show()
        $.ajax({
            type: 'post',
            url: ctx + '/prodTpl/getAllSalesSiteOption.html',
            dataType: 'json',
            success: function (res) {
                loading.hide()
                if (res.code == '0000') {
                    $('#salesSiteBox_productTplButton').prop('data-init', 'true')
                    var list = res.data
                    for (var i = 0; i < list.length; ++i) {
                        $('#salesSite_productTplButton_' + list[i].platCode).append('<option value="'+ list[i].code +'">'+ list[i].name +'</option>')
                    }
                }
            }
        })
    }
}
/**
 * 设置可选站点选项
 * @param platCodeSelect 当前平台选项 element 元素
 */
function setSiteCodeOption_productTplButton(platCodeSelect) {
    var platCode = $(platCodeSelect).val()
    if (!platCode) {
        return
    }
    $(platCodeSelect).closest('tr').find('[name=siteCode]').html($('#salesSite_productTplButton_' + platCode).html());
    layui.form.render('select','tpl_compList')
}

function tpl_genCompTable(pSku) {
    $.ajax({
        type: 'post',
        url: ctx + '/prodTpl/getCompByPsku.html',
        data: {'psku': pSku},
        // async: false,
        dataType: 'json',
        success: function (returnData) {
            if (returnData.code != '0000') {
                layer.msg(returnData.msg, {icon: 5})
            } else {
                var compList = returnData.data
                for (var i in compList) {
                    var comp = compList[i]
                    //undefined处理
                    comp.grossInRate = comp.grossInRate || ''
                    comp.profit = comp.profit || ''
                    comp.isSimilar = comp.isSimilar || false
                    //平台和币种处理
                    var plat_sel = [],
                        currency_sel = []
                    /*getProdDetail里面的内容*/
                    plat_curr_sel_product(plat_sel, salesPlatArray, comp.platCode) //平台
                    plat_curr_sel_product(currency_sel, currencyArrayprodButton, comp.currency) //币种
                    //html数组处理
                    var tr_arr = [
                        '<tr>',

                        '<td width="100"><div class="layui-form"><select name="platCode" lay-filter="compSelPlatChose" disabled>' + plat_sel.join('') + '</select></div></td>',
                        '<td width="100"><div class="layui-form"><select disabled name="siteCode" value="'+ (comp.siteCode || '') +'">' + $('#salesSite_productTplButton_' + comp.platCode).html() + '</select></div></td>',

                        '<td width="300"><input type="hidden" disabled name="id" value="' + (comp.id || '') + '"><input type="text" name="url" disabled value="' + comp.url + '" class="layui-input" style="display:inline-block;width:80%"><a href="' + (comp.url || '') + '" target="_blank" style="display:inline-block;width:20%;color: steelblue;">点击跳转</a></td>',

                        '<td><input name="salesNum" type="text" disabled value="' + (comp.salesNum != null ? comp.salesNum : '') + '" class="layui-input" ztt-verify="isNumber"></td>',

                        '<td><input name="price" type="text" disabled value="' + (comp.price || '') + '" class="layui-input" ztt-verify="isNumber"></td>',

                        '<td width="80"><div class="layui-form"><select name="currency" disabled>' + currency_sel.join('') + '</select></div></td>',

                        '<td>' + '<input name="isSimilar" disabled lay-skin="primary" type="checkbox" '+ (comp.isSimilar ? 'checked' : '') + '>' + '</td>',

                        '<td><input name="grossInRate" type="number" disabled value="' + (comp.grossInRate || '') + '" class="layui-input"></td>',

                        '<td><input name="profit" type="number" disabled value="' + (comp.profit || '') + '" class="layui-input"></td>',
                        '<td>' + (comp.creator || '') + '</td>',
                        '<td>' + layui.admin.Format(comp.createTime, 'yyyy-MM-dd hh:mm:ss') + '</td>',
                        '<td>' +
                        // '<button class="layui-btn layui-btn-sm layui-btn-primary tplCompRemove">移除</button>' +
                        '</td>',
                        '</tr>'
                    ]
                    $('#tpl_compList').append(tr_arr.join(''))
                }
                var siteCodeSelectList = $('#tpl_compList [name=siteCode]')
                for (var i = 0; i < siteCodeSelectList.length; ++i) {
                    $(siteCodeSelectList[i]).find('option[value='+ siteCodeSelectList[i].getAttribute('value') +']').attr('selected','selected')
                }
                layui.form.render('select','tpl_compList');
                layui.form.render('checkbox','tpl_compList');
                //移除事件
                $('.tplCompRemove').click(function () {
                    var _this = this,
                        complistId = $(this).parents('tr').find('input[type="hidden"]').val()
                    if ($('#tpl_compList tr').length == 1) {
                        layer.msg('至少保留一条竞品数据')
                        return
                    }
                    layer.confirm('确定删除本条竞品数据', {icon: 3, title: '提示'}, function (index) {
                        $(_this).parents('tr').remove()
                        $.ajax({
                            type: 'post',
                            url: ctx + "/preProdDev/delComp.html",
                            dataType: 'json',
                            data: {id: complistId},
                            success: function (data) {
                                if (data.code = "0000") {
                                    layer.msg('操作成功!');
                                } else {
                                    layer.alert('移除失败')
                                    return
                                }

                            }
                        })
                    })
                })
            }
        },
        error: function () {
            layer.msg('发送请求失败')
        }
    })
}

function add_competitionTable_tplButton(id) {
    /*1.有关竞品的平台和币种数据以及移除按钮*/
    var select_plat = [],
        select_currency = []
    plat_curr_sel_product(select_plat, salesPlatArray) //平台
    plat_curr_sel_product(select_currency, currencyArrayprodButton) //币种

    var tr_arr = [
        '<tr>',
        '<td  width="100"><div class="layui-form"><select name="platCode" lay-filter="compSelPlatChose">' + select_plat.join('') + '</select></div></td>',
        '<td  width="100"><div class="layui-form"><select name="siteCode"></select></div></td>',
        '<td width="250"><input name="url" type="text" class="layui-input"></td>',
        '<td><input name="salesNum" class="layui-input" ztt-verify="isNumber"></td>',
        '<td><input name="price" class="layui-input" ztt-verify="isNumber"></td>',
        '<td  width="80"><div class="layui-form"><select name="currency">' + select_currency.join('') + '</select></div></td>',
        '<td align="center"><input name="isSimilar" type="checkbox" lay-skin="primary"></td>',
        '<td><input name="grossInRate" type="number" class="layui-input"></td>',
        '<td><input name="profit" type="number" class="layui-input"></td>',
        '<td></td>',
        '<td></td>',
        '<td><button type="button" class="layui-btn layui-btn-primary layui-btn-sm tplCompRemove">移除</button></td>',
        '</tr>'
    ]
    $('#' + id).append(tr_arr.join(''))

    /*2.移除按钮事件*/
    $('.tplCompRemove').click(function () {
        $(this).parents('tr').remove()
    })
}

function tpl_submitComp(pSku, pid) {
    var comps = tpl_getCompData();
    if (!comps) {
        return
    }
    var receiveDataObj = {};
    receiveDataObj.pSku = pSku;
    receiveDataObj.prodPId = pid;
    receiveDataObj.compList = comps;
    var admin = layui.admin;
    admin.load.show();
    $.ajax({
        type: 'post',
        url: ctx + '/prodTpl/addComp.html',
        dataType: 'json',
        contentType: 'application/json;charset=utf-8',
        data: JSON.stringify(receiveDataObj),
        success: function (returnData) {
            admin.load.hide();
            if (returnData.code == '0000') {
                layer.closeAll();
                layer.msg(returnData.msg)
            } else {
                layer.msg(returnData.msg)
            }
            // active['reload'].call()
        },
        error: function () {
            admin.load.hide();
            layer.msg('发送请求失败')
        }
    })
}

// 3. 获取竞品数据
function tpl_getCompData() {
    // 1-2.获取竞品的数据
    var comps = []
    var ifUrlTooLong = false
    var trs = $('#tpl_compList').find('tr')
    for (var i = 0; i < trs.length; ++i) {
        var tdArr = $(trs[i])
        var comp = {}
        comp.id = tdArr.find('[name=id]').val(); // id
        comp.platCode = tdArr.find('[name=platCode]').val(); // 平台
        comp.siteCode = tdArr.find('[name=siteCode]').val(); // 站点
        comp.url = tdArr.find('[name=url]').val(); // 链接
        comp.salesNum = tdArr.find('[name=salesNum]').val(); // 销量
        comp.price = tdArr.find('[name=price]').val(); // 价格
        comp.currency = tdArr.find('[name=currency]').val(); // 币种
        comp.isSimilar = tdArr.find('[name=isSimilar]').prop('checked'); // 是否相似品
        comp.grossInRate = tdArr.find('[name=grossInRate]').val(); // 毛利率
        comp.profit = tdArr.find('[name=profit]').val(); // 利润

        if (comp.url.length > 2000) {
            ifUrlTooLong = true
        }
        if (!comp.id && (comp.platCode == 'ebay' || comp.platCode == 'amazon' ||comp.platCode == 'shopee' ||comp.platCode == 'lazada') && !comp.siteCode) {
            layer.msg('请选择站点')
            return false
        }
        comps.push(comp)
    }
    // 检查是否有竞品链接过长
    if (ifUrlTooLong) {
        layer.msg('竞品链接过长.请将连接中不必要的参数去除掉。长度不可超过2000字符')
        return false
    }
    return comps
}

/**
 * 平台和币种函数
 * arr1:定义空数组,存放数据;arr2:循环的平台数据或者币种数据;obj:存在就输入,不存在默认为空
 */
function plat_curr_sel_product(arr1, arr2, obj) {
    if (!obj) {
        obj = ''
    }
    $.each(arr2, function (i, v) {
        var v_sel = '<option value="' + v + '">' + v + '</option>'
        if (v == obj) {
            v_sel = '<option value="' + v + '" selected>' + v + '</option>'
        }
        arr1.push(v_sel)
    });
    return arr1;
}

function producttpl_getListingStatus(prodPId,platCode) {
    layer = layui.layer;
    layer.open({
        type: 1,
        title: '刊登状态',
        area: ['90%','90%'],
        move: false,
        btn: ['关闭'],
        content: $('#producttpl_listingStatus').html(),
        success: function(layero,index){
            $('#producttpl_listing_status_prodPId').val(prodPId);
            if(platCode){
                producttpl_AjaxToGetListingStatus(platCode);
            }else{
                producttpl_AjaxToGetListingStatus('ebay');
            }
        }
    })
}

function producttpl_AjaxToGetListingStatus(platCode) {
    var ifHadAjax = $('#ifHadAjax_' + platCode).val();
    if (ifHadAjax == '1') {
        showPlatTree(platCode);
    } else {
        var data = {
            platCode: platCode,
            prodPId: parseInt($('#producttpl_listing_status_prodPId').val())
        };
        loading.show();
        $.ajax({
            type: 'post',
            url: ctx + '/prodTpl/getListingStatus.html',
            dataType: 'json',
            data: data,
            success: function (returnData) {
                loading.hide();
                if (returnData.code == '0000') {
                    setPlatTree(platCode,returnData.data)
                } else {
                    layer.msg(returnData.msg)
                }
            },
            error: function () {
                loading.hide();
            }
        })
    }
}

function showPlatTree (platCode) {
    $('.platTree').hide()
    $('#producttpl_Tree_' + platCode).show()
}

function setPlatTree(platCode,data) {
    var tree = dealTreeData(data)
    var contains = $('#producttpl_Tree_' + platCode)
    var groupDIV = contains.find('.group_content')
    var group
    var saleperson
    var groupDom
    var salepersonDom
    var salepersonListDom
    var storeListDom
    var store
    // var totalListing = 0 // 总刊登数
    var total = 0 // 总店铺数
    // var groupListing // 该组刊登数
    var groupTotal // 该组总店铺数
    var totalOnline = 0 // 总在线数
    var totalOffline = 0 // 总下架数
    var groupOnline // 该组在线数
    var groupOffline // 该组下架数
    // var salepersonListing   // 销售员刊登数
    var salepersonTotal // 销售员总店铺数
    var salepersonOnline // 销售员在线数
    var salepersonOffline    // 销售员下架数
    for (var i in tree) {
        // groupListing = 0
        groupTotal = 0
        groupOnline = 0
        groupOffline = 0
        group = tree[i]
        salepersonListDom = ''
        for (var j in group) {
            // salepersonListing = 0
            salepersonTotal = 0
            salepersonOnline = 0
            salepersonOffline = 0
            saleperson = group[j]
            storeListDom = ''
            for (var k in saleperson) {
                total++
                groupTotal++
                salepersonTotal++
                store = saleperson[k]
                if (store.check) {
                    // totalListing++
                    // salepersonListing++
                    // groupListing++
                    if (store.is_offline) {
                        salepersonOffline++
                        groupOffline++
                        totalOffline++
                        storeListDom += '<span class="storeBox_producttpl"><div class="layui-unselect layui-form-checkbox layui-form-checked" lay-skin="gray" onclick="urlToListing(`'+ platCode+'`,`'+ store.itemId +'`,`'+ store.storeAndSite +'`,`'+ store.salesSite +'`)"><span>'+ store.storeAndSite +'</span><i class="layui-icon layui-icon-ok"></i></div>'+ (store.country ? ('【' + '海' + '】') : '') + (store.totalPbNum != undefined ? ('【' + store.totalPbNum + '】') : '') +'</span>'
                    } else {
                        salepersonOnline++
                        groupOnline++
                        totalOnline++
                        storeListDom += '<span class="storeBox_producttpl"><div class="layui-unselect layui-form-checkbox layui-form-checked" lay-skin="primary" onclick="urlToListing(`'+ platCode+'`,`'+ store.itemId +'`,`'+ store.storeAndSite +'`,`'+ store.salesSite +'`)"><span>'+ store.storeAndSite +'</span><i class="layui-icon layui-icon-ok"></i></div>'+ (store.country ? ('【' + '海' + '】') : '') + (store.totalPbNum != undefined ? ('【' + store.totalPbNum + '】') : '') +'</span>'
                    }
                } else {
                    storeListDom += '<span class="storeBox_producttpl"><div class="layui-unselect layui-form-checkbox layui-disabled" lay-skin="primary"><span>'+ store.storeAndSite +'</span><i class="layui-icon layui-icon-ok"></i></div>'+ (store.country ? ('【' + '海' + '】') : '') + (store.totalPbNum != undefined ? ('【' + store.totalPbNum + '】') : '') +'</span>'
                }
            }
            salepersonDom = '<div class="salesName" onclick="showOrHideTree(this)">'+ j + '('+ salepersonOnline + '/' + salepersonOffline +'/'+ salepersonTotal +') <i class="layui-icon fl tohideIcon">&#xe619;</i><i class="layui-icon fl toshowIcon disN">&#xe61a;</i></div>'
            salepersonDom += '<div class="salesDetail">'
            salepersonDom += storeListDom
            salepersonDom += '<div class="clearLeft"></div>'
            salepersonDom += '</div>'
            salepersonListDom += salepersonDom
        }
        groupDom = '<div class="treeGroup" onclick="showOrHideTree(this)">'+ i + '('+ groupOnline + '/' + groupOffline +'/'+ groupTotal +') <i class="layui-icon fl tohideIcon">&#xe619;</i><i class="layui-icon fl toshowIcon disN">&#xe61a;</i></div>'
            +' <div class="treeDetail">'
            +  '<div class="salesTree">'
            + salepersonListDom
            +'</div>'
            +'</div>'

        groupDIV.append(groupDom)
    }
    $('#producttpl_listing_num_span_' + platCode).text('('+ totalOnline + '/' + totalOffline + '/' + total +')')

    showPlatTree(platCode)
    $('#ifHadAjax_' + platCode).val('1')
    layui.form.render('checkbox','treeContent_producttpl')
    layui.form.render('select','treeContent_producttpl')
}

function dealTreeData(data) {
    var tree = {}
    var group
    var salesperson
    var one
    for (var i in data) {
        group = data[i].group_tag
        salesperson = data[i].salesperson
        if (!tree[group]) {
            tree[group] = {}
        }
        if (!tree[group][salesperson]) {
            tree[group][salesperson] = []
        }
        one = {}
        one.storeAndSite = data[i].storeAndSite
        one.salesSite = data[i].salesSite
        one.check = data[i].check
        one.itemId = data[i].itemId
        one.is_offline = data[i].is_offline
        one.totalPbNum = data[i].totalPbNum
        one.country = data[i].country
        tree[group][salesperson].push(one)
    }
    return tree
}


function urlToListing(platCode,itemId,storeAndSite,salesSite) {
    var urlPrex
    switch (platCode) {
        case 'ebay': urlPrex = 'https://www.ebay.com/itm/[itemId]'
            break
        case 'wish': urlPrex = 'https://www.wish.com/product/[itemId]'
            break
        case 'shopee': urlPrex = getShopeeUrlPrex(storeAndSite) + '[itemId]'
            break
        case 'aliexpress': urlPrex = 'http://www.aliexpress.com/item/info/[itemId].html'
            break
        case 'amazon' :
            urlPrex =  getAmazonProdPagePrex(salesSite) + '[itemId]'
            break
        case 'tiktok':
            urlPrex = 'https://shop.tiktok.com/view/product/[itemId]?region=' + salesSite + '&locale=zh-CN'
            break
        case 'lazada' : urlPrex = getLazadaUrlPrefix(salesSite) + '[itemId].html'
            break
    }
    console.log(urlPrex)
    var itemIdArr = itemId.split('||')
    for (var i in itemIdArr) {
        let oneItemId = itemIdArr[i]
        if (!oneItemId) {
            continue
        }
        let target = urlPrex.replace('[itemId]',oneItemId)
        window.open(target,'_blank')
    }
}

function getShopeeUrlPrex(storeAndSite) {
    let dopIndex = storeAndSite.lastIndexOf('.')
    if (!dopIndex) {
        layui.layer.msg('店铺命名不规范')
        return
    }
    let site = storeAndSite.substring(dopIndex + 1).toUpperCase();
    switch (site) {
        case 'MY': return 'https://shopee.com.my/product/'
        case 'TW': return 'https://shopee.tw/product/'
        case 'SG': return 'https://shopee.sg/product/'
        case 'ID': return 'https://shopee.co.id/product/'
        case 'TH': return 'https://shopee.co.th/product/'
        case 'PH': return 'https://shopee.ph/product/'
        case 'VN': return 'https://shopee.vn/product/'
        case 'BR': return 'https://shopee.com.br/product/'
        case 'CL': return 'https://shopee.cl/product/'
        case 'CO': return 'https://shopee.com.co/product/'
        case 'MX': return 'https://shopee.com.mx/product/'
    }
}

function getLazadaUrlPrefix(salesSite) {
    switch (salesSite) {
        case 'SG': return 'https://www.lazada.sg/'
        case 'MY': return 'https://www.lazada.com.my/'
        case 'ID': return 'https://www.lazada.co.id/'
        case 'TH': return 'https://www.lazada.co.th/'
        case 'PH': return 'https://www.lazada.com.ph/'
        case 'VN': return 'https://www.lazada.vn/'
    }
}

function showOrHideTree(self) {
    var ifHasShow = $(self).find('.toshowIcon').hasClass('disN')
    if (ifHasShow) {
        $(self).find('.toshowIcon').removeClass('disN')
        $(self).find('.tohideIcon').addClass('disN')
        $(self).next().addClass('disN')
    } else {
        $(self).find('.tohideIcon').removeClass('disN')
        $(self).find('.toshowIcon').addClass('disN')
        $(self).next().removeClass('disN')
    }
}

var productTplButton_transLanguageList
function producttpl_getTraslation(prodPId,language) {
    layer = layui.layer;
    var index = layer.open({
        type: 1,
        title: '小语种译文',
        area: ['75%','98%'],
        btn: ['保存','关闭'],
        content: $('#producttpl_TranslationPop').html(),
        success: function(layero,index){
            // 获取当前翻译的小语种列表
            if (!productTplButton_transLanguageList) {
                oneAjax.post({
                    url: ctx + '/prodTpl/getTransLanguageEnum',
                    success: function (res) {
                        // 初始翻译面板
                        if (res.code === '0000') {
                            productTplButton_transLanguageList = res.data
                            initTransContains(prodPId,language)
                        }
                    }
                })
            } else {
                initTransContains(prodPId,language)
            }
        },
        yes: function () {
            let transList = []
            let transFormBoxList = $('#producttpl_TranslationForm').find('.traslationBox')
            let prodPId = $('#producttpl_TranslationSrcForm').find('[name=prodPId]').val()
            for (let i = 0; i < transFormBoxList.length; ++i) {
                let transObj = {prodPId: prodPId}
                let box = $(transFormBoxList[i])
                transObj.id = box.find('[name=id]').val() || null
                transObj.language = box.attr('data-language')
                transObj.keyWords = box.find('[name=keyWords]').val()
                transObj.randDesc = box.find('[name=randDesc]').val()
                transObj.fixDesc = box.find('[name=fixDesc]').val()
                let appObjectInps = box.find('[name=appObject]')
                let appObjectArr = []
                for (let i = 0; i < appObjectInps.length; ++i) {
                    if (appObjectInps[i].value.trim()) {
                        appObjectArr.push(appObjectInps[i].value.trim())
                    }
                }
                transObj.appObject = appObjectArr.join('|')
                let specNumInps = box.find('[name=specNum]')
                let specNumArr = []
                for (let i = 0; i < specNumInps.length; ++i) {
                    if (specNumInps[i].value.trim()) {
                        specNumArr.push(specNumInps[i].value.trim())
                    }
                }
                transObj.specNum = specNumArr.join('|')
                transList.push(transObj)
            }
            oneAjax.post({
                url: ctx + '/prodTpl/addOrEditTranslation.html',
                data: transList,
                success: function (returnData) {
                    if (returnData.code === '0000') {
                        layer.close(index)
                        layer.msg('保存成功')
                    } else {
                        layer.msg(returnData.msg)
                    }
                },
                complete: function () {
                    loading.hide();
                }
            })
        }
    })
}
// 初始化翻译面板组件
function initTransContains(prodPId,language){
    // 初始化语种选择tab
    let langugeBoxUl = $('#productTplButton_langugeBoxUl')
    let lis = ``
    let forms = ``
    for (let key in productTplButton_transLanguageList) {
        lis += `<li class="productTplButton_transLanguageTabLi" onclick="producttpl_showTranslationByLanguage('`+ key +`')" data-language="`+ key +`">` + productTplButton_transLanguageList[key] + `</li>`
        forms += productTplButton_getOneLangugeForm(key)
    }
    langugeBoxUl.append(lis)
    // 初始化各语种翻译结果展示表单
    let traslationContains = $('#productTplButton_TraslationContains')
    traslationContains.append(forms)
    ajaxToGetTranslation(prodPId,language)
}

function productTplButton_getOneLangugeForm(language) {
    return `<div class="traslationBox disN" data-language="`+ language +`">
                                <input type="hidden" name="id" />
                                <div class="traslation_content">
                                    <div class="layui-form-item">
                                        <label class="layui-form-label">关键词</label>
                                        <div class="layui-input-block">
                                            <input type="text" name="keyWords" class="layui-input">
                                        </div>
                                    </div>
                                    <div class="layui-form-item">
                                        <label class="layui-form-label">随机描述</label>
                                        <div class="layui-input-block">
                                            <textarea type="text" name="randDesc" class="layui-textarea"></textarea>
                                        </div>
                                    </div>
                                    <div class="layui-form-item">
                                        <label class="layui-form-label">固定描述</label>
                                        <div class="layui-input-block">
                                            <textarea type="text" name="fixDesc" class="layui-textarea"></textarea>
                                        </div>
                                    </div>
                                    <div class="layui-form-item">
                                        <label class="layui-form-label">适用对象</label>
                                        <div class="layui-input-block">
                                            <div class="layui-col-lg2 layui-col-md2">
                                                <input class="layui-input" name="appObject">
                                            </div>
                                            <div class="layui-col-lg2 layui-col-md2">
                                                <input class="layui-input" name="appObject">
                                            </div>
                                            <div class="layui-col-lg2 layui-col-md2">
                                                <input class="layui-input" name="appObject">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="layui-form-item">
                                        <label class="layui-form-label">特殊数量</label>
                                        <div class="layui-input-block">
                                            <div class="layui-col-lg2 layui-col-md2">
                                                <input class="layui-input" name="specNum">
                                            </div>
                                            <div class="layui-col-lg2 layui-col-md2">
                                                <input class="layui-input" name="specNum">
                                            </div>
                                            <div class="layui-col-lg2 layui-col-md2">
                                                <input class="layui-input" name="specNum">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>`
}

// 复现翻译数据
function ajaxToGetTranslation(prodPId,language) {
    oneAjax.post({
        type: 'post',
        url: ctx + '/prodTpl/getTranslation.html',
        dataType: 'json',
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        data: {prodPId: prodPId},
        success: function (returnData) {
            if (language) {
                $('.productTplButton_transLanguageTabLi[data-language='+ language +']').click()
            } else  {
                $('.productTplButton_transLanguageTabLi[data-language=de]').click()
            }
            if (returnData.code === '0000') {
                setTraslationData(returnData)
            } else {
                layer.msg(returnData.msg)
            }
        },
        complete: function () {
            loading.hide();
        }
    })
}


function producttpl_showTranslationByLanguage(language) {
    $('.traslationBox').addClass('disN')
    $('.traslationBox[data-language='+ language +']').removeClass('disN')
    $('#producttpl_TranslationSrcForm [name=currentLanguage]').val(language)
}

function setTraslationData(returnData) {
    // 复现模板待翻译原文数据
    var prodPInfo = returnData.data.prodPInfo
    let prodInfoForm = $('#producttpl_TranslationSrcForm')
    prodInfoForm.find('[name=prodPId]').val(prodPInfo.id)
    prodInfoForm.find('[name=keyword]').val(prodPInfo.keyword)
    prodInfoForm.find('[name=prodDesc]').val(prodPInfo.prodDesc)
    prodInfoForm.find('[name=fixDesc]').val(prodPInfo.fixDesc)
    if (prodPInfo.appObject) {
        let appObjectArr = prodPInfo.appObject.split('|')
        let appObjectInps = prodInfoForm.find('[name=appObject]')
        for (let i = 0; i < appObjectArr.length; ++i) {
            appObjectInps[i].value = appObjectArr[i]
        }
    }
    if (prodPInfo.specNum) {
        let specNumArr = prodPInfo.specNum.split('|')
        let specNumInps = prodInfoForm.find('[name=specNum]')
        for (let i = 0; i < specNumArr.length; ++i) {
            specNumInps[i].value = specNumArr[i]
        }
    }
    // 复现翻译数据
    var prodTranslationList = returnData.data.prodTranslationList
    setTranResult(prodTranslationList)
}
function setTranResult(prodTranslationList) {
    if (!prodTranslationList || prodTranslationList.length === 0) {
        return
    }
    let prodInfoForm = $('#producttpl_TranslationForm')
    for (let i = 0; i < prodTranslationList.length; ++i) {
        let traslationBox = prodInfoForm.find('.traslationBox[data-language='+ prodTranslationList[i].language +']')
        if (!traslationBox.find('[name=id]').val()) {
            traslationBox.find('[name=id]').val(prodTranslationList[i].id)
        }
        traslationBox.find('[name=keyWords]').val(prodTranslationList[i].keyWords)
        traslationBox.find('[name=randDesc]').val(prodTranslationList[i].randDesc)
        traslationBox.find('[name=fixDesc]').val(prodTranslationList[i].fixDesc)
        if (prodTranslationList[i].appObject) {
            let appObjectArr = prodTranslationList[i].appObject.split('|')
            let appObjectInps = traslationBox.find('[name=appObject]')
            for (let i = 0; i < appObjectArr.length; ++i) {
                appObjectInps[i].value = appObjectArr[i]
            }
        }
        if (prodTranslationList[i].specNum) {
            let specNumArr = prodTranslationList[i].specNum.split('|')
            let specNumInps = traslationBox.find('[name=specNum]')
            for (let i = 0; i < specNumArr.length; ++i) {
                specNumInps[i].value = specNumArr[i]
            }
        }
    }
}

function traslateByLanguage(ifByLanguage) {
    let dataForm = $('#producttpl_TranslationSrcForm')
    let data = {
        keyWords: dataForm.find('[name=keyword]').val(),
        prodDesc: dataForm.find('[name=prodDesc]').val(),
        fixDesc: dataForm.find('[name=fixDesc]').val()
    }
    let specNumInps = dataForm.find('[name=specNum]')
    let specNumArr = []
    for (let i = 0; i < specNumInps.length; ++i) {
        if (specNumInps[i].value) {
            specNumArr.push(specNumInps[i].value)
        }
    }
    let appObjectInps = dataForm.find('[name=appObject]')
    let appObjectArr = []
    for (let i = 0; i < appObjectInps.length; ++i) {
        if (appObjectInps[i].value) {
            appObjectArr.push(appObjectInps[i].value)
        }
    }
    data.specNum = specNumArr.join("|")
    data.appObject = appObjectArr.join("|")
    if (ifByLanguage) {
        data.language = dataForm.find('[name=currentLanguage]').val()
    }
    oneAjax.post({
        type: 'post',
        url: ctx + '/prodTpl/translateByMap.html',
        data: data,
        success: function (returnData) {
            if (returnData.code === '0000') {
                setTranResult(returnData.data)
                layer.msg('翻译成功')
            } else {
                layer.msg(returnData.msg)
            }
        },
        complete: function () {
            loading.hide();
        }
    })
}

function tpl_listReferPrice(prodSTempId, self, Adata) {
    var data = {
        prodSTempId: prodSTempId,
    }
    if (self != null) {
        var tr = $(self).closest('tr')
        data.cost = tr.find('[name=priced]').val()
        data.weight = tr.find('[name=weight]').val()
        data.prodSId = tr.find('[name=prodSId]').val()
    }

    if((!data.weight || !data.cost) && !data.prodSTempId && !Adata){
        return;
    }
    if (Adata) {
        data = Adata
    }
    var index = layer.open({
        type: 1,
        title: '刊登价格预估',
        area: ['1000px', '600px'],
        btn: ['关闭'],
        yes: function (index, layero) {
            layer.close(index);
        },
        id: 'listPrice_contain',
        shadeClose: false,
        content: $('#tpl_listPriceLayer').html(),
        success: function () {
            $('#listingPriceForm_ptb [name=price]').val(data.cost)
            $('#listingPriceForm_ptb [name=weight]').val(data.weight)
            $('#listingPriceForm_ptb [name=prodSId]').val(data.prodSId)
            $('#listingPriceForm_ptb [name=prodSTempId]').val(prodSTempId)
            ajaxTogetListingPrice(data)
            
            $('#listPrice_contain').scroll(function () {
                toFixedTabHead(this)
            })
            
            layui.table.on('tool(listingPriceTable_productTplButton)', function (obj) {
                var data = obj.data, //获得当前行数据
                    layEvent = obj.event; //获得 lay-event 对应的值
                console.log(data)
                if (layEvent === 'update') {
                    var Adata = {
                        prodSTempId: $('#listingPriceForm_ptb [name=prodSTempId]').val(),
                        prodSId: $('#listingPriceForm_ptb [name=prodSId]').val(),
                        price: $('#listingPriceForm_ptb [name=price]').val(),
                        weight: $('#listingPriceForm_ptb [name=weight]').val(),
                        platCode: data.platCode,
                        siteId: data.siteId,
                        stockLocation: data.stockLocation,
                        grossProfitRate: accDiv($(obj.tr).find('[name=grossRate]').val(),100)
                    }

                    if (!Adata.price) {
                        layer.msg('请输入价格')
                        return
                    }
                    if (!Adata.weight) {
                        layer.msg('请输入重量')
                        return
                    }
                    if (!Adata.grossProfitRate) {
                        layer.msg('请输入毛利率')
                        return
                    }
                    var ajax = new Ajax(true)
                    ajax.post({
                        data: JSON.stringify(Adata),
                        url: ctx + '/prodTpl/reCountListingPrice.html',
                        success: function (res) {
                            if (res.code == '0000') {
                                $(obj.tr).find('[name=listingPriceShow]').text(res.data.listingPriceShow)
                                $(obj.tr).find('[name=listingDollarShow]').text(res.data.listingDollarShow)
                            }
                        }

                    })
                }
            })
        }
    })
}
var platPriceSort = [
    'smt',
    'ebay美国国内仓', 'ebay美国虚拟仓', 'ebay加拿大国内仓', 'ebay英国国内仓', 'ebay英国虚拟仓', 'ebay澳大利亚国内仓', 'ebay澳大利亚虚拟仓', 'ebay法国国内仓', 'ebay德国国内仓', 'ebay西班牙国内仓', 'ebay意大利国内仓',
    'shopee新加坡', 'shopee马来西亚','shopee印尼', 'shopee泰国', 'shopee台湾', 'shopee菲律宾', 'shopee越南', 'shopee巴西', 'shopee墨西哥', 'shopee智利', 'shopee哥伦比亚', 'shopeecnsc', 'shopee波兰',
    'tiktok越南', 'tiktok泰国', 'tiktok马来西亚', 'tiktok新加坡', 'tiktok菲律宾', 'tiktok美国', 'tiktok全球',
    'amazon德国', 'amazon西班牙', 'amazon法国', 'amazon英国', 'amazon意大利', 'amazon荷兰', 'amazon瑞典', 'amazon波兰', 'amazon美国', 'amazon加拿大', 'amazon墨西哥', 'amazon澳大利亚', 'amazon日本',
    'lazada新加坡', 'lazada马来西亚', 'lazada印尼', 'lazada泰国', 'lazada菲律宾', 'lazada越南',
    'wish', 'walmart', 'joom', 
    'mercadoBrazil', 'mercadoMexico', 'mercadoColombia', 'mercadoChile', 'mercadoCBT',
    'daraz',
    'ozon',
    'miravia',
    'fyndiq瑞典', 'fyndiq芬兰', 'fyndiq挪威', 'fyndiq丹麦', 'fyndiq美国',
    'temu美国'
  ]

function ajaxTogetListingPrice(data) {
    loading.show()
    $.ajax({
        type: 'post',
        url: ctx + '/prodTpl/listReferPrice.html',
        data: data,
        dataType: 'json',
        success: function (res) {
            loading.hide()
            // 渲染表格
            if (res.code = '0000') {
                if (res.data.cost) {
                    $('#listingPriceForm_ptb [name=price]').val(res.data.cost)
                    $('#listingPriceForm_ptb [name=weight]').val(res.data.weight)
                }
                if (res.data.list) {
                    let list = res.data.list
                    list.forEach(item => {
                        if (item.platCode === 'daraz') {
                            item.sortIndex =  platPriceSort.indexOf(item.platCode)
                        } else {
                            item.sortIndex = platPriceSort.indexOf(item.platCode + (item.siteName || '') + (item.stockLocationShow || ''))
                        }
                    })
                    list.sort(function(a, b) {
                        return a.sortIndex - b.sortIndex; // 按照 sortIndex 属性进行升序排序
                    });
                    let notExistSite = list.filter(item => item.sortIndex === -1)
                    let existSite = list.filter(item => item.sortIndex !== -1)
                    list = existSite.concat(notExistSite)
                    layui.table.render({
                        elem: "#listingPriceTable_productTplButton",
                        id: 'listingPriceTable_productTplButton',
                        data: list,
                        cols: [
                            [
                                //标题栏
                                {field: 'platCode', title:'平台'},
                                {title: "站点",templet: '<div>{{(d.siteName || "") + (d.stockLocationShow || "")}}</div>'},
                                {title: "计费重", field: 'priceWeight'},
                                {title: "毛利率", templet: '#grossRate_productTplButton'},
                                {title: "销售价",templet: '#listingPriceShow_productTplButton'},
                                {title: "销售价($)",templet: '#listingDollarShow_productTplButton'},
                                //绑定工具条
                                {title: '操作', align: 'center', toolbar: '#listingPriceTable_productTplButton_bar',width:70}
                            ],
                        ],
                        page: false,
                        limit: res.data.list.length,
                        done: function() {

                        }
                    })
                }
            } else {
                layer.msg(res.msg)
            }

        },
        error: function () {
            loading.hide()
            layer.msg('发送请求失败')
        }
    })
}

function reGetListingPrice() {
    var data = {
        cost:$('#listingPriceForm_ptb [name=price]').val(),
        weight:$('#listingPriceForm_ptb [name=weight]').val(),
        prodSId:$('#listingPriceForm_ptb [name=prodSId]').val(),
        prodSTempId:$('#listingPriceForm_ptb [name=prodSTempId]').val(),
        grossProfitRate: $('#listingPriceForm_ptb [name=grossProfitRate]').val() ? parseFloat($('#listingPriceForm_ptb [name=grossProfitRate]').val()) /100 : null
    }

    ajaxTogetListingPrice(data)
}

function reCountListingPrice(self,platCode, site, isOverseasWh) {
    var data = {
        grossProfitRate: parseFloat($(self).parent().parent().find('.gpRate').val())/100,
        platCode: platCode,
        site: site + '',
        isOverseasWh: isOverseasWh,
        prodSTempId: $('#listingPriceForm_ptb [name=prodSTempId]').val(),
        prodSId: $('#listingPriceForm_ptb [name=prodSId]').val(),
        price: $('#listingPriceForm_ptb [name=price]').val(),
        weight: $('#listingPriceForm_ptb [name=weight]').val()
    }

    if (!data.price) {
        layer.msg('请输入价格')
        return
    }
    if (!data.weight) {
        layer.msg('请输入重量')
        return
    }
    if (!data.grossProfitRate) {
        layer.msg('请输入毛利率')
        return
    }
    loading.show()
    $.ajax({
        type: 'post',
        url: ctx + '/prodTpl/reCountListingPrice.html',
        data: JSON.stringify(data),
        contentType: 'application/json',
        dataType: 'json',
        success: function (res) {
            loading.hide()
            if (res.code == '0000') {
                $(self).parent().parent().find('[id$=Price]').text(res.data.listingPrice + (res.data.listingFreight ? (' + ' + res.data.listingFreight) : ''))
                $(self).parent().parent().find('[id$=USD]').text(res.data.listingUSD + (res.data.listingFreight ? (' + ' + res.data.listingFreight) : ''))
            } else {
                layer.msg(res.msg)
            }
        },
        fail: function () {
            loading.hide()
            layer.msg('服务器繁忙，请稍后再试')
        }

    })
}
/**
 * 自定义禁售映射
 * @param prodPId
 */
function setProdProhibitMapping(prodPId) {
    layer = layui.layer;
    layer.open({
        type: 1,
        title: '自定义禁售映射',
        area: ['1260px','800px'],
        btn: ['关闭'],
        content: $('#tpl_setProdProhibitMapping').html(),
        success: function(layero,index){
            $('#prodPId_tpl_setProdProhibitMapping').val(prodPId);
            queryProdProhibitDetail_tplButton(prodPId);
        }
    })
}

// 查询禁售详情
function queryProdProhibitDetail_tplButton(id) {
    layui.table.render({
        elem: "#tpl_setProdProhibitMappingTable",
        method: 'post',
        url: ctx + "/prohibit/getprohibitDetail.html",
        where: {prodPId: id},
        cols: [
            [
                { type: "checkbox", width: 30 },
                { field: "platCode", title: "平台", width: 80 },
                { field: "salesSite", title: "销售站点", width: 100},
                { title: "是否禁售", width: 36, templet: "#tplbtn_isListingAble", width: 30},
                { field: "lisintgInableMsg", title: "禁售原因"},
                { title: "自定义禁售状态", templet: "#tplbtn_ifFixedInable" , width: 70},
                { field: "fixedInableMsg", title: "自定义禁售原因" },
                //绑定工具条
                {title: '操作', align: 'center', toolbar: '#tpl_setProdProhibitMapping_bar',width:70}
            ],
        ],
        id: "tpl_setProdProhibitMappingTab",
        page: false,
        done: function () {
          $('#prodPId_tpl_setProdProhibitMapping').val(id)
        },
        height: '550px'
    });
}
// 新建禁售映射
function addProdProhibitMapping() {
    layer = layui.layer;
    form = layui.form;
    var popIndex = layer.open({
        type: 1,
        title: '新建禁售映射',
        area: ['1000px','500px'],
        btn: ['新建','关闭'],
        content: $('#tpl_AddProdProhibitMappingPop').html(),
        success: function(layero,index){
            initNotNull('#addprohibitconfForm_prodtplButton')
            form.render('select')
            form.render('checkbox')
            // 站点选择
            form.on('select(plateCode_addprohibitconfForm_prodtplButton)', function(data){
                var platCode = data.value
                initSalesSite(platCode)
            });
        },
        yes: function () {
            if (!checkNotNull('#addprohibitconfForm_prodtplButton')) {
                return
            }
            var data = {
                prodPId: $('#prodPId_tpl_setProdProhibitMapping').val(),
                platCode: $('#addprohibitconfForm_prodtplButton [name=platCode]').val(),
                salesSiteId: $('#addprohibitconfForm_prodtplButton [name=salesSiteId]').val(),
                salesSite: $('#addprohibitconfForm_prodtplButton [name=salesSiteId]').text(),
                ifFixedInable: $('#addprohibitconfForm_prodtplButton [name=ifFixedInable]').val() == '1' ? true : false,
                fixedInableMsg: $('#addprohibitconfForm_prodtplButton [name=fixedInableMsg]').val()
            }
            $.ajax({
                type: 'post',
                url: ctx + '/prohibit/editOrAddProdProhibitMapping.html',
                data: JSON.stringify(data),
                contentType: 'application/json',
                dataType: 'json',
                success: function (res) {
                    if (res.code == '0000') {
                        queryProdProhibitDetail_tplButton($('#prodPId_tpl_setProdProhibitMapping').val())
                        layer.msg('新建成功')
                        layer.close(popIndex)
                    } else {
                        layer.msg(res.msg)
                    }
                }
            })
        }
    })
}
// 编辑禁售映射
function editProdProhibitMapping(id,platCode,salesSite,ifFixedInable,fixedInableMsg) {
    layer = layui.layer;
    form = layui.form;
    var popIndex = layer.open({
        type: 1,
        title: '编辑禁售映射',
        area: ['1000px','500px'],
        btn: ['保存','关闭'],
        content: $('#tpl_AddProdProhibitMappingPop').html(),
        success: function(layero,index){
            initNotNull('#addprohibitconfForm_prodtplButton')

            $('#addprohibitconfForm_prodtplButton [name=platCode]').val(platCode)
            $('#addprohibitconfForm_prodtplButton #platCodeInp_addConfForm').val(platCode)
            $('#addprohibitconfForm_prodtplButton #platCodeInp_addConfForm').removeClass('disN')
            $('#addprohibitconfForm_prodtplButton #salesSiteInp_addConfForm').val(salesSite)
            $('#addprohibitconfForm_prodtplButton #salesSiteInp_addConfForm').removeClass('disN')

            $('#addprohibitconfForm_prodtplButton [name=ifFixedInable]').val(ifFixedInable? '1' : '0')
            $('#addprohibitconfForm_prodtplButton [name=fixedInableMsg]').val(fixedInableMsg)
            form.render('select','ifFixedInable_filter')
        },
        yes: function () {
            var data = {
                id : id,
                ifFixedInable: $('#addprohibitconfForm_prodtplButton [name=ifFixedInable]').val() == '1' ? true : false,
                fixedInableMsg: $('#addprohibitconfForm_prodtplButton [name=fixedInableMsg]').val()
            }
            $.ajax({
                type: 'post',
                url: ctx + '/prohibit/editOrAddProdProhibitMapping.html',
                data: JSON.stringify(data),
                contentType: 'application/json',
                dataType: 'json',
                success: function (res) {
                    if (res.code == '0000') {
                        queryProdProhibitDetail_tplButton($('#prodPId_tpl_setProdProhibitMapping').val())
                        layer.msg('保存成功')
                        layer.close(popIndex)
                    } else {
                        layer.msg(res.msg)
                    }
                }
            })
        }
    })
}

function initSalesSite(platCode) {
    $('#addprohibitconfForm_prodtplButton [name=salesSiteId]').html($('#salesSite_addConfForm_' + platCode).html())
    form.render('select')
}

function showDevIdeaWayTip(tip,self) {
    var layer = layui.layer
    var index = layer.tips(tip,self,{tips: [1, 'orange'],time:10000})
    $(self).attr('data-tipId',index)
}

function removeDevIdeaWayTip(self) {
    var index = $(self).attr('data-tipId')
    if (index) {
        layui.layer.close(index)
    }
}

!(function () {
    if (typeof ifHasBindForDevIdeaWay == 'undefined') {
        ifHasBindForDevIdeaWay = true
    } else {
        return
    }
    $('body').on('mouseover','.devIdeaWayBtn',function () {
        var self = this
        var layer = layui.layer
        var prodPId = $(this).attr('dataid')
        $.ajax({
            type: 'POST',
            url: ctx + '/preProdDev/getDevIdeaWay.html',
            dataType: 'json',
            data: {prodPId: prodPId},
            success: function (res) {
                if (res.code == '0000') {
                    var data = res.data
                    var devNote = data.devNote
                    var logs = data.logs
                    var tip = ''
                    if (devNote) {
                        tip += '开发备注:' + devNote + '<br/>'
                    }
                    if (data.managerNote) {
                        tip += '主管备注:' + data.managerNote + '<br/>'
                    }
                    if (data.bossNote) {
                        tip += '老板备注:' + data.bossNote + '<br/>'
                    }
                    if (logs != null) {
                        var log
                        for (var i = 0; i < logs.length; ++i) {
                            log = logs[i]
                            if (log.operDesc.indexOf('备注') >= 0 ) {
                                tip += getAuditResult(log.flowStatus) + '  ' + log.operDesc.substring(log.operDesc.indexOf('备注')) + '<br/>'
                            }
                        }
                    }
                    showDevIdeaWayTip(tip,self)
                } else {
                    layer.msg(res.msg)
                }
            },
            error: function () {
                layer.msg('服务器繁忙，请稍后再试')
            }
        })
    })
    function getAuditResult (flowStatus) {
        switch (flowStatus) {
            case 12 : return '初审失败'
            case 21 : return '初审通过'
            case 22 : return '组长审核失败'
            case 31 : return '组长审核通过'
        }
    }


    $('body').on('mouseout','.devIdeaWayBtn',function () {
        removeDevIdeaWayTip(this)
    })

    $('body').on('click','.devIdeaWayBtn',function () {
        var self = this
        var layer = layui.layer
        var prodPId = $(this).attr('dataid')
        layer.open({
            type: 1,
            title: '开发思路',
            area: ['1000px','90%'],
            btn: ['关闭'],
            content: $('#tpl_devIdeaWayPop').html(),
            success: function(layero,index){
                $.ajax({
                    type: 'POST',
                    url: ctx + '/preProdDev/getDevIdeaWay.html',
                    dataType: 'json',
                    data: {prodPId: prodPId},
                    success: function (res) {
                        if (res.code == '0000') {
                            var data = res.data
                            var logs = data.logs
                            $('#devIdeaWayShowForm [name=devNote]').val(data.devNote || '')
                            $('#devIdeaWayShowForm [name=managerNote]').val(data.managerNote || '')
                            $('#devIdeaWayShowForm [name=bossNote]').val(data.bossNote || '')
                            if (logs != null) {
                                var log
                                var trs = ''
                                var tr
                                for (var i = 0; i < logs.length; ++i) {
                                    log = logs[i]
                                    if (log.operDesc.indexOf('备注') >= 0 ) {
                                        tr = '<tr>'
                                        tr += '<td>' + format(log.operTime, 'yyyy-MM-dd hh:mm:ss') + '</td>'
                                        tr += '<td>' + log.operator + '</td>'
                                        tr += '<td>' + getAuditResult(log.flowStatus) + '</td>'
                                        tr += '<td>' + log.operDesc.substring(log.operDesc.indexOf('备注')) + '</td>'
                                        tr += '<tr>'
                                        trs += tr
                                    }
                                }
                                $('#tpl_devIdeaWayTab tbody').append(trs)
                            }

                        } else {
                            layer.msg(res.msg)
                        }
                    },
                    error: function () {
                        layer.msg('服务器繁忙，请稍后再试')
                    }
                })
            }
        })
    })
})()


// 自拍图评价
/**
 *
 * @param pSku 父sku
 * @param type 评价类型   1 摄影  2 美工
 */
function evaluate_selfImg(pSku, type) {
    var layer = layui.layer
    var form = layui.form
    var popIndex = layer.open({
        type: 1,
        title: type == 1 ? '摄影评价' : '美工评价',
        area: ['700px','80%'],
        btn: [ '保存' ,'关闭'],
        id: 'evaluate_selfImgLayerId',
        content: $('#evaluate_selfImgLayer').html(),
        success: function(layero,index){
            form.render('radio', 'evaluate_selfImgForm');
            initselfImgEvaluateDetail(pSku);
        },
        yes: function () {
            var data = {
                pSku: pSku,
                type: type,
                score: $('#evaluate_selfImgForm [name=score]:checked').val(),
                remark: $('#evaluate_selfImgForm [name=remark]').val().trim()
            }
            console.log(data)
            if (!data.score) {
                layer.msg('请选择评价')
                return
            }
            if (data.score == '1' && !data.remark) {
                layer.msg('评价为需要改善，必须填写备注')
                return
            }
            loading.show()
            $.ajax({
                type: 'POST',
                url: ctx + '/msgselfimg/evaluateSelfImg.html',
                dataType: 'json',
                contentType: 'application/json',
                data: JSON.stringify(data),
                success: function (res) {
                    loading.hide()
                    if (res.code == '0000') {
                        layer.msg('评价成功')
                        layer.close(popIndex)
                    } else {
                        layer.msg(res.msg)
                    }
                },
                error: function () {
                    loading.hide()
                    layer.msg('服务繁忙，请稍后再试')
                }
            })

        }
    })
}
//评分详情展示
function initselfImgEvaluateDetail(pSku){
    layui.form.render('select','selfImgEvaluateDetailSearchForm')
    $('#selfImgEvaluateDetailSearchForm [name=pSku]').val(pSku)
    var searchSelfImgEvaluateList = function (data){
        layui.table.render({
            elem: "#selfImgEvaluateDetailTable",
            id: "selfImgEvaluateDetailTable",
            method: 'post',
            url: ctx + "/msgselfimg/listSelfMsgScore.html",
            where: data,
            cols: [
                [
                    { title: "时间", templet: '<div>{{format( d.createTime, "yyyy-MM-dd hh:mm:ss")}}</div>' , width: 160},
                    { field: "creator", title: "评价人", width: 100},
                    { title: "类型", templet: "<div>{{ (d.type == 1 ? '摄影' : '美工' ) }}</div>", width: 100},
                    { title: "评价", templet: "#msgSelfScoreTpl", width: 100},
                    { field: "remark", title: "备注"},
                ],
            ],
            page: true,
            limits: [100, 200, 500],
            limit: 100,
            done: function () {
                //统计各类评价
                $.ajax({
                    type: 'POST',
                    url: ctx + '/msgselfimg/countEvaluateSelfImg.html',
                    dataType: 'json',
                    contentType: 'application/json',
                    data: JSON.stringify(data),
                    success: function (res) {
                        if (res.code == '0000') {
                            var map = res.data
                            $('#selfImgEvaluateDetailNum5').text(map.score5Num)
                            $('#selfImgEvaluateDetailNum3').text(map.score3Num)
                            $('#selfImgEvaluateDetailNum1').text(map.score1Num)
                            $('#selfImgEvaluateDetailPer5').text(map.per5)
                            $('#selfImgEvaluateDetailPer3').text(map.per3)
                            $('#selfImgEvaluateDetailPer1').text(map.per1)
                        } else {
                            layer.msg(res.msg);
                        }
                    },
                    error: function () {
                        layer.msg('服务繁忙，请稍后再试');
                    }
                })
            }
        })
    }

    var data = serializeObject($('#selfImgEvaluateDetailSearchForm'))
    searchSelfImgEvaluateList(data)
    $('.score_selfImgEvaluateDetail').click(function () {
        $('#selfImgEvaluateDetailSearchForm [name=score]').val($(this).attr('data-value'))
        var data = serializeObject($('#selfImgEvaluateDetailSearchForm'))
        searchSelfImgEvaluateList(data)
    })

    layui.form.on('select(selfImgEvaluateDetailForm_type)', function(data){
        var data = serializeObject($('#selfImgEvaluateDetailSearchForm'))
        searchSelfImgEvaluateList(data)
    })
}

// function getSelfImgScoreList(pSku) {
//     var layer = layui.layer
//     var table = layui.table
//     var form = layui.form
//
//     layer.open({
//         type: 1,
//         title: '评价详情',
//         area: ['800px','500px'],
//         btn: ['关闭'],
//         content: $('#selfImgEvaluateDetailLayer').html(),
//         success: function(layero,index){
//
//         }
//     })
//
// }

