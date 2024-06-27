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
    if(currencyArray != null &&currencyArray.length > 0 ){//如果已有币种枚举
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
                tpl_genCompTable(pSku);
                $('#tpl_compAdd').click(function () {
                    add_competitionTable('tpl_compList')
                    layui.form.render('select')
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
                        currencyArray.push(element.name);
                    });
                    if(currencyArray.length > 0){
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
                    var complist = compList[i]
                    //undefined处理
                    complist.grossInRate = complist.grossInRate || ''
                    complist.profit = complist.profit || ''
                    complist.isSimilar = complist.isSimilar || false
                    if (complist.isSimilar) {
                        similarStr = '<input type="checkbox" checked disabled>';
                    } else {
                        similarStr = '<input type="checkbox" disabled>';
                    }

                    //平台和币种处理
                    var plat_sel = [],
                        currency_sel = []

                    plat_curr_sel(plat_sel, salesPlatArray, complist.platCode) //平台
                    plat_curr_sel(currency_sel, currencyArray, complist.currency) //币种

                    //html数组处理
                    var tr_arr = [
                        '<tr>',

                        '<td><div class="layui-form"><select disabled>' + plat_sel.join('') + '</select></div></td>',

                        '<td width="300"><input type="hidden" value="' + complist.id + '"><a href="' + complist.url + '" target="_blank" style="position:absolute;right:1px;top:16px"><i style="font-size:12px" class="layui-icon layui-icon-lianjie"></i></a><input type="text" value="' + complist.url + '" class="layui-input" disabled></td>',

                        '<td><input type="number" value="' + complist.salesNum + '" class="layui-input" disabled></td>',

                        '<td><input type="number" value="' + complist.price + '" class="layui-input" disabled></td>',

                        '<td><div class="layui-form"><select disabled>' + currency_sel.join('') + '</select></div></td>',

                        '<td>' + similarStr + '</td>',

                        '<td><input type="number" value="' + complist.grossInRate + '" class="layui-input" disabled></td>',

                        '<td><input type="number" value="' + complist.profit + '" class="layui-input" disabled></td>',
                        '<td>' + complist.creator + '</td>',
                        '<td>' + layui.admin.Format(complist.createTime, 'yyyy-MM-dd hh:mm:ss') + '</td>',

                        // '<td><button class="layui-btn layui-btn-sm layui-btn-primary tplCompRemove">移除</button></td>',

                        '</tr>'
                    ]
                    $('#tpl_compList').append(tr_arr.join(''))
                }

                var form = layui.form;
                form.render('select');
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

function add_competitionTable(id) {
    /*1.有关竞品的平台和币种数据以及移除按钮*/
    var select_plat = [],
        select_currency = []

    plat_curr_sel(select_plat, salesPlatArray) //平台
    plat_curr_sel(select_currency, currencyArray) //币种

    var tr_arr = [
        '<tr>',
        '<td><div class="layui-form"><select>' + select_plat.join('') + '</select></div></td>',
        '<td width="300"><input type="text" class="layui-input"></td>',
        '<td><input type="number" class="layui-input"></td>',
        '<td><input type="number" class="layui-input"></td>',
        '<td><div class="layui-form"><select>' + select_currency.join('') + '</select></div></td>',
        '<td><input type="checkbox"></td>',
        '<td><input type="number" class="layui-input"></td>',
        '<td><input type="number" class="layui-input"></td>',
        '<td>--</td><td>--</td>',
        // '<td><button type="button" class="layui-btn layui-btn-primary layui-btn-sm tplCompRemove" >移除</button></td>',
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
    var comps = []
    $('#tpl_compList').find('tr').each(function () {
        var tdArr = $(this).children()
        var comp = {}
        comp.id = tdArr.eq(1).find('input[type="hidden"]').val()
        comp.platCode = tdArr.eq(0).find('select').val(); // 平台
        comp.url = tdArr.eq(1).find('input[type="text"]').val(); // 链接
        comp.salesNum = tdArr.eq(2).find('input').val(); // 销量
        comp.price = tdArr.eq(3).find('input').val(); // 价格
        comp.currency = tdArr.eq(4).find('select').val(); // 币种
        comp.isSimilar = tdArr.eq(5).find('input').prop('checked'); // 是否相似品
        comp.grossInRate = tdArr.eq(6).find('input').val(); // 毛利率
        comp.profit = tdArr.eq(7).find('input').val(); // 利润
        comps.push(comp)
    })
    return comps
}

/**
 * 平台和币种函数
 * arr1:定义空数组,存放数据;arr2:循环的平台数据或者币种数据;obj:存在就输入,不存在默认为空
 */
function plat_curr_sel(arr1, arr2, obj) {
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
        btn: ['关闭'],
        content: $('#producttpl_listingStatus').html(),
        success: function(layero,index){
            $('#producttpl_listing_status_prodPId').val(prodPId);
            if(platCode){
                producttpl_AjaxToGetListingStatus(platCode);
                $("#producttpl_listing_num_span_ebay").parents("li").removeClass("layui-this");
                $("#producttpl_listing_num_span_aliexpress").parents("li").addClass("layui-this");
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
                        storeListDom += '<span class="storeBox_producttpl"><div class="layui-unselect layui-form-checkbox layui-form-checked" lay-skin="gray" onclick="urlToListing(`'+ platCode+'`,`'+ store.itemId +'`,`'+ store.storeAndSite +'`)"><span>'+ store.storeAndSite +'</span><i class="layui-icon layui-icon-ok"></i></div>'+ (store.totalPbNum != undefined ? ('【' + store.totalPbNum + '】') : '') +'</span>'
                    } else {
                        salepersonOnline++
                        groupOnline++
                        totalOnline++
                        storeListDom += '<span class="storeBox_producttpl"><div class="layui-unselect layui-form-checkbox layui-form-checked" lay-skin="primary" onclick="urlToListing(`'+ platCode+'`,`'+ store.itemId +'`,`'+ store.storeAndSite +'`)"><span>'+ store.storeAndSite +'</span><i class="layui-icon layui-icon-ok"></i></div>'+ (store.totalPbNum != undefined ? ('【' + store.totalPbNum + '】') : '') +'</span>'
                    }
                } else {
                    storeListDom += '<span class="storeBox_producttpl"><div class="layui-unselect layui-form-checkbox layui-disabled" lay-skin="primary"><span>'+ store.storeAndSite +'</span><i class="layui-icon layui-icon-ok"></i></div>'+ (store.totalPbNum != undefined ? ('【' + store.totalPbNum + '】') : '') +'</span>'
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
        one.check = data[i].check
        one.itemId = data[i].itemId
        one.is_offline = data[i].is_offline
        one.totalPbNum = data[i].totalPbNum
        tree[group][salesperson].push(one)
    }
    return tree
}

function urlToListing(platCode,itemId,storeAndSite) {
    var urlPrex
    switch (platCode) {
        case 'ebay': urlPrex = 'https://www.ebay.com/itm/'
            break
        case 'wish': urlPrex = 'https://www.wish.com/product/'
            break
        case 'shopee': urlPrex = getShopeeUrlPrex(storeAndSite)
            break
        case 'aliexpress': urlPrex = 'http://www.aliexpress.com/item/info/'
            break
    }
    var target
    if (itemId.indexOf('||' > 0)) {
        var itemIdArr = itemId.split('||')
        for (var i in itemIdArr) {
            if (platCode == 'aliexpress') {
                target = urlPrex + itemIdArr[i] + '.html'
            } else  {
                target = urlPrex + itemIdArr[i]
            }
            window.open(target,'_blank')
        }
    } else {
        target = urlPrex + itemId + '.html'
        window.open(urlPrex + itemId)
    }
}
function getShopeeUrlPrex(storeAndSite) {
    if (storeAndSite.indexOf('马来西亚') > 0) {
        return 'https://shopee.com.my/product/'
    }
    if (storeAndSite.indexOf('台湾') > 0) {
        return 'https://shopee.tw/product/'
    }
    if (storeAndSite.indexOf('新加坡') > 0) {
        return 'https://shopee.sg/product/'
    }
    if (storeAndSite.indexOf('印尼') > 0) {
        return 'https://shopee.co.id/product/'
    }
    if (storeAndSite.indexOf('泰国') > 0) {
        return 'https://shopee.co.th/product/'
    }
    if (storeAndSite.indexOf('菲律宾') > 0) {
        return 'https://shopee.ph/product/'
    }
    if (storeAndSite.indexOf('越南') > 0) {
        return 'https://shopee.vn/product/'
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

function tpl_listReferPrice(prodSTempId,self) {
    var data = {"prodSTempId": prodSTempId}
    if (self != null) {
        var tr = $(self).closest('tr')
        data.cost = tr.find('[name=priced]').val()
        data.weight = tr.find('[name=weight]').val()
        data.prodSId = tr.find('[name=prodSId]').val()
    }

    if((!data.weight || !data.cost) && !data.prodSTempId){
        return;
    }
    var index = layer.open({
        type: 1,
        title: '刊登价格预估',
        area: ['1000px', '600px'],
        btn: ['关闭'],
        yes: function (index, layero) {
            layer.close(index);
        },
        shadeClose: false,
        content: $('#tpl_listPriceLayer').html(),
        success: function () {
            //debugger;
            $('#listingPriceForm_ptb [name=price]').val(data.cost)
            $('#listingPriceForm_ptb [name=weight]').val(data.weight)
            $('#listingPriceForm_ptb [name=prodSId]').val(data.prodSId)
            $('#listingPriceForm_ptb [name=prodSTempId]').val(prodSTempId)
            ajaxTogetListingPrice(data)
            $('[data-field="5"]').css('display','none');
            $('[data-field="4"]').width('10%');
            $('#listingPriceForm_ptb .layui-col-md2 ').css('display','none');
        }
    })
}

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
                    layui.table.render({
                        elem: "#listingPriceTable_productTplButton",
                        id: 'listingPriceTable_productTplButton',
                        data: res.data.list,
                        cols: [
                            [
                                //标题栏
                                {field: 'platCode', title:'平台'},
                                {title: "站点",templet: '<div>{{(d.siteName || "") + (d.stockLocationShow || "")}}</div>'},
                                {title: "毛利率", templet: '#grossRate_productTplButton'},
                                {title: "刊登价",templet: '#listingPriceShow_productTplButton'},
                                {title: "刊登价($)",templet: '#listingDollarShow_productTplButton'}
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
            area: ['1000px','500px'],
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
                            var devNote = data.devNote
                            var logs = data.logs
                            if (devNote) {
                                $('#devIdeaWayShowForm [name=devNote]').val(devNote)
                            }
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

