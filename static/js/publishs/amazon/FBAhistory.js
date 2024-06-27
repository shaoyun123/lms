//结构
//初始化和数据结构定义
//click事件定义
//表单事件最后
//无业务意义的方法
var FBA_PACKTYPE_LIST,FBA_SALES_TREND1,FBA_SALES_TREND2,FBA_SALES_TREND3
var fbaHistory_cache
layui.use(['admin', 'form', 'table', 'layer', 'layedit', 'element', 'laypage', 'upload', 'laydate', 'formSelects', 'echarts'], function () {
    var form = layui.form,
        table = layui.table,
        laypage = layui.laypage,
        element = layui.element,
        layer = layui.layer,
        formSelects  = layui.formSelects ,
        echarts = layui.echarts,
        upload = layui.upload;
    laydate = layui.laydate;
    formSelects.render('FBAhistory_userList');
    formSelects.render('FBAhistory_FBASalerList');
    formSelects.render('FBAhistory_developerIdList');
    formSelects.render('FBAhistory_orderBy1');
    formSelects.render('FBAhistory_orderBy2');
    formSelects.render('FBAhistory_labelListStr');
    //获取跳转的缓存数据
    fbaHistory_cache = window.localStorage["fbaProjectToFbaHistory"];

    if (fbaHistory_cache) {
        //取到值之后清空缓存
        delete window.localStorage["fbaProjectToFbaHistory"];
        var parse = JSON.parse(fbaHistory_cache);
    }
    initBizzTag('#FBAhistory_prodAttrTag','prod_tag',true, true, null,formSelects,[{name: '无标签',value: '空'}])
    // 展示和隐藏 更多查询条件
    $('#showMoreSearchCondition_Fbahistory').click(function () {
        var self = this
        if ($(self).hasClass('showExternal')){
            $(self).closest('.layui-form').find('.externalContain').hide()
            $('#show_icon_processlist').show()
            $('#hide_icon_processlist').hide()
            $(self).removeClass('showExternal')
        } else {
            $(self).closest('.layui-form').find('.externalContain').show()
            $('#show_icon_processlist').hide()
            $('#hide_icon_processlist').show()
            $(self).addClass('showExternal')
        }
    })

    form.render('select');
    form.render('checkbox');
    render_hp_orgs_users("#FBAhistory_StoreSaler"); //渲染部门销售员店铺三级联动
    render_hp_orgs_users("#FBAhistory_SkuSalerForm"); //渲染部门销售员店铺三级联动
    render_hp_orgs_users("#FBAhistory_developerForm"); //渲染部门销售员店铺三级联动
    //时间渲染
    laydate.render({elem: '#FBAhistory_searchForm_time', range: true})
    //由于弹框的表单提交事件需要控制关闭index,事先声明indx ,命名以弹框关键值组合
   var FBAhistory_setSaleperson_tpl_Form_index;

    var FBAhistory_global_siteEnum;

    var tablecol = {
        'FBAhistory_Table': [
            [ //FBA
                { checkbox: true, width: 30 },
                { title: "图片", field: "picUrl", width: 100 ,templet: "#FBAhistory_imageTpl" },
                { title: "标题", templet: '#FBAhistory_title',minWidth: 150},
                { title: "店铺-站点", templet: '#FBAhistory_store_site',minWidth: 140},
                { title: "SKU", field: "prodSSku", templet: "#FBAhistory_sku",minWidth: 190},
                { title: "成本(￥)", field: "",templet:"#FBAhistory_cost_tpl",width: 155 },
                { title: "定价", field: "listingPrice",templet:"#FBAhistory_price_tpl",width: 120 },
                { title: "销售排名",templet:"#FBAhistory_rank_tpl",minWidth: 120 },
                { title: "销售备注", field: "saleRemark",width: 110,edit: 'text', templet: function(res){
                    return '<div onmouseenter="showTip(`'+ (res.saleRemark || '') + '`,this)" onmouseleave="removeTip(this)"><em>'+ (res.saleRemark || '') +'</em> <i class="layui-icon layui-icon-edit" style="color: #009688">&#xe642;</i> </div>'
                }},
                { title: "销量", field: "salesNum",templet:"#FBAhistory_saleInfo_tpl",width: 100},
                // { title: "预计仓储费", field: "estTotalStorageCost", },
                // { title: "待发货数", field: "oaInPackNum",templet:`<div>{{d.oaInPackNum||0}}</div>` },
                // { title: "待入库数", field: "",templet:`<div>{{(d.fbaInboundShippedQuality||0 + (d.fbaInboundReceivingQuality||0))}}</div>` },
                { title: "库存数量", field: "",templet:"#FBAhistory_invInfo_tpl",width:100 },
                { title: "库龄", field: "",templet:"#FBAhistory_excessfo_tpl",width: 120},
                { title: "仓储表现<br>建议备货", field: "dailySaleCount",templet: "#FBAhistory_prepare_stock_tpl",width: 100},
                // { title: "竞品", templet: "#FBAhistory_compList_tpl",width: 100},
                { title: "汇总", templet: "#FBAhistory_statistic",width: 140},
                { title: '操作', field: "",align: 'left', toolbar: "#FBAhistory_option" }
            ]
        ],
        'FBAhistory_addToPlan_Table':[
            [
                { checkbox: true, width: 30 },
                { title: "图片", field: "picUrl", templet: "#FBAhistory_imageTpl2" },
                { title: "店铺", field: "storeAcct", templet: '#FBAhistory_addToPlan_storeAcct' },
                { title: "店铺sku", field: "sellerSku", templet: '#FBAhistory_addToPlan_sellerSku' },
                { title: "站点", field: "salesSite" },
                { title: "ASIN", field: "asin" },
                { title: "日均销量", field: "dailySales", templet: '#FBAhistory_addToPlan_dailySales' },
                { title: "总日均销量", field: "allDailySales", templet: '#FBAhistory_addToPlan_allDailySales' },
                { title: "最大发货数量", field: "platMaxDeliverAmount", templet: '#FBAhistory_addToPlan_platMaxDeliverAmount' },
                { title: "退款率", field: "refundRate" },
                // { title: `<div style='text-align: left;width:150px'>小号类产品</div>
                //             <div style="text-align: left">
                //             <input id="FBAhistory_batchSet_ifSmallSizeVal" placeholder="1为是,0为否" class="layui-input">
                //                 <div class="layui-btn layui-btn-sm"  style='float: right;' id="FBAhistory_batchSet_ifSmallSizeBtn">批量设置</div>
                //             </div>
                //         `,
                //     unresize: true,
                //     width: 160,
                //     field: "ifSmallSize", templet: function(res){
                //         let html = '<select class="pop_FBAhistory_addForm_ifSmallSize" lay-filter="pop_FBAhistory_addForm_ifSmallSize" data-index="'+ res.index + '">'
                //         html += '<option></option>'
                //         html += '<option value="true" '+ (res.ifSmallSize ? 'selected' :'') +'>是</option>'
                //         html += '<option value="false" '+ (res.ifSmallSize ? '' :'selected') +'>否</option>'
                //         html+= '</select>'
                //         return `<em>` + html + `</em>`
                //     }
                // },
                // { title: `<div style='text-align: left;width:150px'>包装规格</div>
                //             <div style="text-align: left">
                //             <input id="FBAhistory_batchSet_packTypeVal" placeholder="请填写可选值" class="layui-input">
                //                 <div class="layui-btn layui-btn-sm"  style='float: right;' id="FBAhistory_batchSet_packTypeBtn">批量设置</div>
                //             </div>
                //         `,
                //     unresize: true,
                //     width: 160,
                //     field: "packType", templet: function(res){
                //         let html = '<select lay-search class="pop_FBAhistory_addForm_packType" lay-filter="pop_FBAhistory_addForm_packType" data-index="'+ res.index + '" data-value="'+ (res.packType || '') +'">'
                //         html += FBA_PACKTYPE_LIST
                //         html+= '</select>'
                //         return `<em>` + html + `</em>`
                //     }
                // },
                { title: `<div style='text-align: left;width:150px'>计划发货数量</div>
                            <div style="text-align: left">
                                <input type="number"  id="FBAhistory_batchSet_PlanQualityNum_val" style='width:80px;float: left;' class="layui-input" value="0" min="0" oninput="this.value = this.value.replace(/[^0-9]/g, '');">
                                <div class="layui-btn layui-btn-sm"  style='float: right;' id="FBAhistory_batchSet_PlanQualityNum">批量设置</div>
                            </div>
                        `,
                    unresize: true,
                    width: 160,
                    field: "planQuality", templet: '#FBAhistory_proNum' },
                { title: '操作结果', field: "optionresult" }
            ]
            ]
    };
    // 初始化物流标签选择
    initBizzTag('#FBAhistory_logisticLabel','FBA_SHIP_PLAN_LABEL',true, true, null,formSelects,[{name: '无标签',value: '空'}],'标签')

    //  初始化标签
    function FBAhitory_initLabelList() {
        oneAjax.post({
            url: ctx + "/fbaHistoryProduct/getLabelList.html",
            success: function (res) {
                if (res.code == '0000') {
                    let labelList = res.data
                    let html = ''
                    for (let i = 0; i < labelList.length; ++i) {
                        html += '<input name="labelName" type="checkbox" lay-skin="primary" value="' + labelList[i] + '" title="' + labelList[i] + '">'
                    }
                    $('#FBAhistory_labelContains').append(html)
                    $('#FBAhistory_labelOrigin').append(html)
                    form.render('checkbox','FBAhistory_labelContains')
                }
            }
        })
    }
    // 初始化标签
    FBAhitory_initLabelList()
    table.on('edit(FBAhistory_Table)', function(obj){
        var value = obj.value //得到修改后的值
            ,data = obj.data //得到所在行所有键值
            ,field = obj.field; //得到字段
        var ajax = new Ajax()
        var Adata = {
            id: data.id
        }
        Adata[field] = data[field]
        ajax.post({
            url: ctx + "/fbaHistoryProduct/updateField.html",
            data: JSON.stringify(Adata),
            contentType: 'application/json',
            success: function (data) {
                if (data.code == '0000') {
                    layer.msg('修改成功')
                }
            }
        })
    })

    // 店铺状态切换事件
    layui.form.on('switch(FBAStoreSwitch)', function(data) {
        if (data.elem.checked) {
            $('#FBAhistoryForm').find('[name=storeAcctId]').attr('data-storestatus', 1)
        } else {
            $('#FBAhistoryForm').find('[name=storeAcctId]').attr('data-storestatus', 0)
        }
        let formDom = $('#FBAhistory_StoreSaler')
        var userSelect = formDom.find('.users_hp_custom') // 销售
        var orgSelect = formDom.find('.orgs_hp_custom')
        
        var salesSiteSelect = formDom.find('.salesSite_hp_custom') //站点下拉框,用于过滤前面已经渲染的店铺数据
        var roleNames = userSelect.data('rolelist') || orgSelect.data('rolelist')
        var type = userSelect.data('type')
        var orgId = orgSelect.val()

        var salePersonId = $('#FBAhistory_StoreSaler').find('[name=\'salesPersonIdListStr\']').val()
        let storeSelect = $('#FBAhistory_StoreSaler').find('.store_hp_custom')
        selectStore(storeSelect, roleNames, orgId, salePersonId, salesSiteSelect, type)
        
        FBAhistory_global_siteEnum = null
        getInitFBAAmazonSite(true);
    })


    //发货计划表格添加展示当前选中条数
    table.on('checkbox(FBAhistory_Table)', function(obj) {
        //$('#yellowtips').remove();
        var data = table.checkStatus('FBAhistory_Table').data;
        if(data) {
            $('#FBAhistory_table_check_num').html('当前选中' + data.length + '条数据');
        }else{
            $('#FBAhistory_table_check_num').html('当前选中0条数据');
        }

    });

// 弹框-----------------
//监听工具栏操作(精简化操作,使用封装方法的形式,使代码简洁,简单ajax无需封装)
    for (var i in tablecol) {
        table.on('tool(' + i + ')', function (obj) {
            var data = obj.data;
            var layEvent = obj.event;
            if (layEvent === 'FBAhistory_update') {
                var salesSite = data.salesSite;
                var storeAcctId = data.storeAcctId;
                var idList = [data.id];
                tea_Ajax_ver1('/amazonFbaInventory/sync.html', JSON.stringify({ salesSite:salesSite, storeAcctId:storeAcctId, idList:idList }), function(returnData) {
                    layer.msg(returnData.msg || '同步成功');
                    // refreshTable()
                })
            } else if(layEvent === "FBAhistory_estimated"){
                var index = layer.open({
                    type: 1,
                    title: '预估定价',
                    area: ['90%', '85%'],
                    content:$('#pop_FBAhistory_estimate').html(),
                    btn: ['关闭'],
                    success: function (layero) {
                        form.render();
                        form.render('select','FBAhistory_estimate_batchSetForm3')
                        laydate.render({
                            elem: '#price_estimate_time',
                            type: 'datetime',
                            inputAuto: true,
                            range: true
                        });
                        // 复现数据
                        let formElem = $('#FBAestimateForm')
                        formElem.find('[name=oaCost]').val(data.oaCost || '')
                        formElem.find('[name=exchangeRate]').val(data.currencyExchange || '')
                        formElem.find('[name=siteTaxRate]').val(data.siteTaxRate || 0)

                        // 获取同站点同Asin数据
                        let ajax = new Ajax()
                        ajax.post({
                            url: ctx + '/fbaHistoryProduct/getSameSiteAndAsinByIdList.html',
                            data: JSON.stringify({idList: [data.id]}),
                            success: function (res) {
                                if (res.code === '0000') {
                                    let dataList = res.data[0].sameList
                                    // formElem.find('[name=platCommission]').val(res.data[0].defaultCommisionRate || 0)
                                    dataList.push({
                                        storeAcct: '汇总',
                                        sellerSku: '',
                                        fbaAvailableQuality: res.data[0].allAvailableStock,
                                        dailySales: res.data[0].allDailySales,
                                        headFreight: res.data[0].avgHeadFreight,
                                        shippingPrice: res.data[0].avgFbaShippingFee,
                                        listingPrice: res.data[0].avgListingPrice
                                    })
                                    let tableIns = table.render({
                                        elem: '#fbahistory_priceCalTab',
                                        data: dataList,
                                        cols: [[
                                            { checkbox: true, width: 30 },
                                            { title: "店铺", field: 'storeAcct'},
                                            { title: "店铺SKU", field: 'sellerSku'},
                                            { title: "可售库存", field: 'fbaAvailableQuality'},
                                            { title: "日均销量", field: 'dailySales'},
                                            { title: `<div style='text-align: left;width:150px'>头程运费(¥)</div>
                            <div style="text-align: left">
                                <input id="FBAhistory_batchSet_headFreight_val" style='width:80px;float: left;' class="layui-input">
                                <div class="layui-btn layui-btn-sm"  style='float: right;' id="FBAhistory_batchSet_headFreight">批量设置</div>
                            </div>
                        `,
                                                unresize: true,
                                                width: 160,
                                                field: "headFreight", templet: '#FBAhistory_calPrice_headFreight' },
                                            { title: `<div style='text-align: left;width:150px'>FBA派送费</div>
                            <div style="text-align: left">
                                <input id="FBAhistory_batchSet_shippingPrice_val" style='width:80px;float: left;' class="layui-input">
                                <div class="layui-btn layui-btn-sm"  style='float: right;' id="FBAhistory_batchSet_shippingPrice">批量设置</div>
                            </div>
                        `,
                                                unresize: true,
                                                width: 160,
                                                field: "shippingPrice", templet: '#FBAhistory_calPrice_shippingPrice' },
                                            { title: "当前刊登价", field: 'listingPrice'},
                                            { title: "当前毛利率", field: 'profitRate'},
                                            { title: `<div style='text-align: left;width:150px'>毛利率</div>
                            <div style="text-align: left">
                                <input id="FBAhistory_batchSet_prodfitRate_val" style='width:80px;float: left;' class="layui-input">
                                <div class="layui-btn layui-btn-sm"  style='float: right;' id="FBAhistory_batchSet_prodfitRate">批量设置</div>
                            </div>
                        `,
                                                unresize: true,
                                                width: 160,
                                                field: "profitRate", templet: '#FBAhistory_calPrice_profitRate' },
                                            { title: `<div style='text-align: left;width:150px'>新刊登价</div>
                            <div style="text-align: left">
                                <input id="FBAhistory_batchSet_newPrice_val" style='width:80px;float: left;' class="layui-input">
                                <div class="layui-btn layui-btn-sm"  style='float: right;' id="FBAhistory_batchSet_newPrice">批量设置</div>
                            </div>
                        `,
                                                unresize: true,
                                                width: 160,
                                                field: "newPrice", templet: '#FBAhistory_calPrice_newPrice' },
                                            { title: '操作', field: "",align: 'left', toolbar: "#fbahistory_priceCalTab_operate" }
                                        ]],
                                        done: function () {
                                            // 一键设置头程运费
                                            $('#FBAhistory_batchSet_headFreight').click(function() {
                                                $('.FBAhistory_calPrice_headFreight_class').val($('#FBAhistory_batchSet_headFreight_val').val());
                                            });
                                            // 一键设置Fba派送费
                                            $('#FBAhistory_batchSet_shippingPrice').click(function() {
                                                $('.FBAhistory_calPrice_shippingPrice_class').val($('#FBAhistory_batchSet_shippingPrice_val').val());
                                            });
                                            // 一键设置毛利率
                                            $('#FBAhistory_batchSet_prodfitRate').click(function() {
                                                $('.FBAhistory_calPrice_profitRate_class').val($('#FBAhistory_batchSet_prodfitRate_val').val());
                                            });
                                            // 一键设置刊登价格
                                            $('#FBAhistory_batchSet_newPrice').click(function() {
                                                $('.FBAhistory_calPrice_newPrice_class').val($('#FBAhistory_batchSet_newPrice_val').val());
                                            });
                                            // 计算刊登价格
                                            $('#fbahistory_calListingPriceBtn').click(function () {
                                                let layFilterIndex = 'LAY-table-' + tableIns.config.index;
                                                let tableContainer = $('div[lay-filter="' + layFilterIndex + '"]');
                                                let trList = tableContainer.find('.layui-table-body tbody tr')

                                                let formElem = $('#FBAestimateForm')
                                                let oaCost = formElem.find('[name=oaCost]').val().trim()
                                                let packCost = formElem.find('[name=packCost]').val().trim()
                                                let platCommission = formElem.find('[name=platCommission]').val().trim()
                                                let exchangeRate = formElem.find('[name=exchangeRate]').val().trim()
                                                let siteTaxRate = formElem.find('[name=siteTaxRate]').val().trim()
                                                if (!isMoney(oaCost)) {
                                                    layer.msg('请填写正确的商品成本')
                                                    return
                                                }
                                                if (!isMoney(packCost)) {
                                                    layer.msg('请填写正确的包装成本')
                                                    return
                                                }
                                                if (!isMoney(platCommission)) {
                                                    layer.msg('请填写正确的平台佣金费率')
                                                    return
                                                }
                                                if (!isMoney(exchangeRate)) {
                                                    layer.msg('请填写正确的站点汇率')
                                                    return
                                                }
                                                if (!isMoney(siteTaxRate)) {
                                                    layer.msg('请填写正确的站点税率')
                                                    return
                                                }
                                                for (let i = 0; i < trList.length - 1; ++i) {
                                                    let tr = $(trList[i])
                                                    let headFreight = $(tr).find('td[data-field="headFreight"]').find('input').val().trim()
                                                    let shippingPrice = $(tr).find('td[data-field="shippingPrice"]').find('input').val().trim()
                                                    let profitRate = $(tr).find('td[data-field="profitRate"]').find('input').val().trim()
                                                    let salesSite = $(tr).find('.salesSiteVal').val()
                                                    if (!isMoney(headFreight)) {
                                                        continue
                                                    }
                                                    if (!isMoney(shippingPrice)) {
                                                        continue
                                                    }
                                                    if (!profitRate) {
                                                        layer.msg("请输入毛利率",{icon:7})
                                                        continue
                                                    }
                                                    if (!oaCost || !headFreight) {
                                                        layer.msg('请填写商品成本和头程运费')
                                                        return
                                                    }
                                                    // // FBA刊登价=【(商品成本+包装成本+头程运费)/各站点汇率+FBA派送费】/(1-平台佣金费率-毛利率-站点税率)
                                                    // let newPrice = accDiv(accAdd(accDiv(accAdd(accAdd(oaCost,packCost),headFreight),exchangeRate),shippingPrice)
                                                    // ,accSub(accSub(accSub(1,platCommission),profitRate),siteTaxRate)).toFixed(2)
                                                    // console.log('刊登价原始值====', newPrice, salesSite)
                                                    // newPrice = caculatePrice(newPrice, salesSite)
                                                    // $(tr).find('td[data-field="newPrice"]').find('input').val(newPrice)
                                                    commonReturnPromise({
                                                        url: "/lms/fbaPricing/calculateTargetPriceOrGrossRate",
                                                        contentType: "application/json",
                                                        type: "post",
                                                        params: JSON.stringify([{
                                                            id: data.id,// 主键id 用于定位返回的计算结果属于哪一个商品
                                                            targetGrossRate:profitRate,// 目标毛利率
                                                            // targetPrice:newPrice,// 目标刊登价格
                                                            packCost:packCost,// 包装成本
                                                            productCost:oaCost,// 商品成本,必填
                                                            categoryId: data.categoryId,
                                                            fullCateName: data.fullCateName,
                                                            headFreight,// 头程运费,必填
                                                            salesSite,// 站点
                                                            fbaCharge:shippingPrice,// fba派送费
                                                            userInputCommisionRate:platCommission,// 目前仅仅是预估定价弹窗 用户自己输入的平台佣金
                                                            userInputTaxRate:siteTaxRate,// 用户指定的站点税率 预估定价弹窗
                                                            userInputExchangeRate:exchangeRate// 用户指定的站点汇率 预估定价弹窗
                                                        }]),
                                                    }).then((res) => {
                                                        $(tr).find('td[data-field="newPrice"]').find('input').val(res[0]?.targetListingPrice)
                                                    })
                                                }
                                            })
                                            // 计算毛利率
                                            $('#fbahistory_calProfitRateBtn').click(function () {
                                                let layFilterIndex = 'LAY-table-' + tableIns.config.index;
                                                let tableContainer = $('div[lay-filter="' + layFilterIndex + '"]');
                                                let trList = tableContainer.find('.layui-table-body tbody tr')

                                                let formElem = $('#FBAestimateForm')
                                                let oaCost = formElem.find('[name=oaCost]').val().trim()
                                                let packCost = formElem.find('[name=packCost]').val().trim()
                                                let platCommission = formElem.find('[name=platCommission]').val().trim()
                                                let exchangeRate = formElem.find('[name=exchangeRate]').val().trim()
                                                let siteTaxRate = formElem.find('[name=siteTaxRate]').val().trim()
                                                if (!isMoney(oaCost)) {
                                                    layer.msg('请填写正确的商品成本')
                                                    return
                                                }
                                                if (!isMoney(packCost)) {
                                                    layer.msg('请填写正确的包装成本')
                                                    return
                                                }
                                                if (!isMoney(platCommission)) {
                                                    layer.msg('请填写正确的平台佣金费率')
                                                    return
                                                }
                                                if (!isMoney(exchangeRate)) {
                                                    layer.msg('请填写正确的站点汇率')
                                                    return
                                                }
                                                if (!isMoney(siteTaxRate)) {
                                                    layer.msg('请填写正确的站点税率')
                                                    return
                                                }
                                                for (let i = 0; i < trList.length - 1; ++i) {
                                                    let tr = $(trList[i])
                                                    let headFreight = $(tr).find('td[data-field="headFreight"]').find('input').val().trim()
                                                    let shippingPrice = $(tr).find('td[data-field="shippingPrice"]').find('input').val().trim()
                                                    let newPrice = $(tr).find('td[data-field="newPrice"]').find('input').val().trim()
                                                    let salesSite = $(tr).find('.salesSiteVal').val()
                                                    if (!isMoney(headFreight)) {
                                                        continue
                                                    }
                                                    if (!isMoney(shippingPrice)) {
                                                        continue
                                                    }
                                                    if (!newPrice) {
                                                        layer.msg("请输入刊登价",{icon:7})
                                                        continue
                                                    }
                                                    if (!oaCost || !headFreight) {
                                                        layer.msg('请填写商品成本和头程运费')
                                                        return
                                                    }
                                                    // // 毛利率 = 1 - 平台佣金费率 - 站点税率 - 【(商品成本+包装成本+头程运费)/各站点汇率+FBA派送费】/FBA刊登价
                                                    // let profitRate = accSub(accSub(accSub(1,platCommission),siteTaxRate),
                                                    //     accDiv(accAdd(accDiv(accAdd(accAdd(oaCost,packCost),headFreight),exchangeRate),shippingPrice),newPrice)
                                                    // ).toFixed(2)
                                                    // $(tr).find('td[data-field="profitRate"]').find('input').val(profitRate)
                                                    commonReturnPromise({
                                                        url: "/lms/fbaPricing/calculateTargetPriceOrGrossRate",
                                                        contentType: "application/json",
                                                        type: "post",
                                                        params: JSON.stringify([{
                                                            id: data.id,// 主键id 用于定位返回的计算结果属于哪一个商品
                                                            // targetGrossRate:profitRate,// 目标毛利率
                                                            targetPrice:newPrice,// 目标刊登价格
                                                            packCost:packCost,// 包装成本
                                                            productCost:oaCost,// 商品成本
                                                            categoryId: data.categoryId,
                                                            fullCateName: data.fullCateName,
                                                            headFreight,// 头程运费
                                                            salesSite,// 站点
                                                            fbaCharge:shippingPrice,// fba派送费
                                                            userInputCommisionRate:platCommission,// 目前仅仅是预估定价弹窗 用户自己输入的平台佣金
                                                            userInputTaxRate:siteTaxRate,// 用户指定的站点税率 预估定价弹窗
                                                            userInputExchangeRate:exchangeRate// 用户指定的站点汇率 预估定价弹窗
                                                        }]),
                                                    }).then((res) => {
                                                        $(tr).find('td[data-field="profitRate"]').find('input').val(res[0]?.targetGrossRate)
                                                    })
                                                }
                                            })
                                            table.on('tool(fbahistory_priceCalTab)', function (obj) {
                                                var curData = obj.data;
                                                var layEvent = obj.event;
                                                switch (layEvent){
                                                    case 'updateListingPrice' :
                                                        let tr = obj.tr
                                                        let newPrice = $(tr).find('td[data-field="newPrice"]').find('input').val();
                                                        curData.newPrice = newPrice
                                                        fbaHistory_adjustPrice([curData])
                                                }
                                            })
                                            // 批量改价
                                            $('#fbahistory_updateListingPriceForList').click(function () {
                                                let dataList = []
                                                let error = false
                                                applytoChecked('fbahistory_priceCalTab', tableIns, function (tr, data, index) {
                                                    if (!data.id) {
                                                        return
                                                    }
                                                    var newPrice = $(tr).find('td[data-field="newPrice"]').find('input').val();
                                                    if (!isMoney(newPrice)) {
                                                        layer.msg("请填写正确的金额")
                                                        error = true
                                                        return false
                                                    }
                                                    let one = {
                                                        id: data.id,
                                                        storeAcctId: data.storeAcctId,
                                                        sellerSku: data.sellerSku,
                                                        newPrice: newPrice
                                                    }
                                                    dataList.push(one);
                                                });
                                                if (error) {
                                                    return
                                                }
                                                if (!dataList || dataList.length === 0) {
                                                    layer.msg('请选择需要改价的产品')
                                                    return
                                                }
                                                fbaHistory_adjustPrice(dataList);
                                            })
                                        }
                                    })
                                }
                            }
                        })
                    },
                    yes: function (index, layero) {
                        layer.close(index)
                    }
                })
            }else if(layEvent === "FBAhistory_editComp"){
                // 声明一个竞品数据
                FBAhistory_totalCompList = data.compList ? JSON.parse(JSON.stringify(data.compList)) : []
                FBAhistory_newCompList = []
                var index = layer.open({
                    type: 1,
                    title: '竞品',
                    area: ['1050px', '75%'],
                    content:$('#FBAhistory_editCompPop').html(),
                    btn: ['保存','关闭'],
                    id: 'FBAhistory_editCompPopId',
                    success: function (layero) {
                        if (FBAhistory_totalCompList.length > 0) {
                            for (let i in FBAhistory_totalCompList) {
                                FBAhistory_addOneComp(FBAhistory_totalCompList[i],data)
                            }
                        }
                        $('#FBAhistory_editCompPop_optimizeIdea').val(data.optimizeIdea)

                        $('#FBAhistory_editCompPop_crawlingBtn').click(function () {
                            let asin = $('#FBAhistory_editCompPopForm').find('[name=asin]').val()
                            // 判断有无值
                            if (!asin || !asin.trim()) {
                                layer.msg('请填入正确的ASIN值')
                                return
                            }
                            // 判断重复
                            if (FBAhistory_totalCompList.length > 0) {
                                for (let i in FBAhistory_totalCompList) {
                                    if (FBAhistory_totalCompList[i].compAsin === asin) {
                                        layer.msg('已经存在相同asin的竞品')
                                        return
                                    }
                                }
                            }

                            var formData = new FormData();
                            formData.append('asin',asin)
                            formData.append('site',data.salesSite)
                            let ajax = new Ajax(false)
                            ajax.post({
                                url: ctx + '/fbaHistoryProduct/getCompDetail.html',
                                data: formData,
                                contentType: false,
                                processData: false,
                                success: function (res) {
                                    if (res.code === '0000') {
                                        let newOne = res.data
                                        newOne.index = new Date().getTime() + ''
                                        FBAhistory_totalCompList.push(newOne)
                                        FBAhistory_newCompList.push(newOne)
                                        FBAhistory_addOneComp(newOne,data)
                                    }
                                }
                            })
                        })

                        $('#FBAhistory_editCompPopId').on('click','.FBAhistory_deleCompBtn',function (e) {
                            let confirmIndex = layer.confirm('确认删除该竞品？',{'btn': ['确认','取消']},function () {
                                let btn = e.target
                                let compId = btn.getAttribute('data-compid')
                                let index = btn.getAttribute('data-index')
                                // 删除旧有comp
                                if (compId) {
                                    let Adata ={
                                        id : compId
                                    }
                                    let ajax = new Ajax()
                                    ajax.post({
                                        url: ctx + '/fbaHistoryProduct/deleteComp.html',
                                        data: JSON.stringify(Adata),
                                        success: function (res) {
                                            if (res.code === '0000') {
                                            }
                                        }
                                    })
                                } else {    // 删除 尚未保存的comp
                                    if (!index) {
                                        layer.msg('未设置index错误。请联系IT查看问题')
                                        return
                                    }
                                    for (let i = 0; i < FBAhistory_newCompList.length; ++i) {
                                        if (FBAhistory_newCompList[i].index === index) {
                                            FBAhistory_newCompList.splice(i,1)
                                            break
                                        }
                                    }
                                }
                                // 移除当前元素
                                $(btn).prev('table').remove()
                                $(btn).remove()
                                layer.close(confirmIndex)
                            })
                        })
                    },
                    yes: function (index, layero) {
                        let Adata = {
                            id: data.id,
                            compList: FBAhistory_newCompList,
                            optimizeIdea: $('#FBAhistory_editCompPop_optimizeIdea').val()
                        }
                        let ajax = new Ajax()
                        ajax.post({
                            url: ctx + '/fbaHistoryProduct/saveComp.html',
                            data: JSON.stringify(Adata),
                            success: function (res) {
                                if (res.code === '0000') {
                                    layer.close(index)
                                    layer.msg(res.msg || '操作成功', {icon: 1})
                                    // refreshTable()
                                }
                            }
                        })
                    }
                })
            }else if(layEvent === "FBAhistory_setSaleperson_btn"){
                FBAhistory_setSaleperson_tpl_Form_index= layer.open({
                    type: 1,
                    title: '转移',
                    area: ['800px', '450px'],
                    content:$('#FBAhistory_setSaleperson_tpl').html(),
                    btn: ['转移','关闭'],
                    success: function (index, layero) {
                        tea_Ajax_ver1('/sys/listuserbyrole.html',{role : "amazon专员"},function (returnData) {
                            tea_appendSelect_ver1($('#FBAhistory_setSaleperson_tpl_Form select[name=skuSalespersonId]'),returnData.data,'id','userName',data.skuSalespersonId);//带回显
                            form.render('select');

                        },false,'application/x-www-form-urlencoded');

                        $('#FBAhistory_setSaleperson_tpl_Form input[name=idList]').val(data.id);
                    },
                    yes:function (index, layero) {
                        $('#FBAhistory_setSaleperson_tpl_Form_submit').click();
                    }
                });
            } else if (layEvent === 'FBAhistory_getSalesTrend') {
                layer.open({
                    type: 1,
                    title: '销量趋势表现',
                    offset: '100px',
                    area: '80%',
                    content:$('#FBAhistory_salesTrend_Pop').html(),
                    btn: ['关闭'],
                    success: function (index, layero) {
                        FBA_SALES_TREND1 = null
                        FBA_SALES_TREND2 = null
                        FBA_SALES_TREND3 = null
                        form.render('select','FBAhistory_salesTrend_Form')
                        form.on('select(FBAhistory_salesTrend_sel)', function(obj) {
                            let val = obj.value;
                            let Adata = {
                                id: data.id,
                                asin: data.asin,
                                timeType: parseInt(val)

                            }
                            FBAhistory_ajaxGetSalesTrend(Adata)
                        })
                        let Adata = {
                            id: data.id,
                            asin: data.asin,
                            timeType: 2
                        }
                        // 默认展示24小时数据
                        FBAhistory_ajaxGetSalesTrend(Adata)
                    }
                })
            }else if (layEvent === 'FBAhistory_log') {
                layer.open({
                    type: 1,
                    title: '日志',
                    area: ['70%', '450px'],
                    content: $('#FBAhistory_price_log_tpl').html(),
                    btn: ['关闭'],
                    success: function (index, layero) {
                        table.render({
                            elem: "#fba_history_price_log_tab",
                            id: "fba_history_price_log_tab",
                            method: 'post',
                            url: ctx + "/amazonFbaInventory/searchLogByStoreIdAndSellerSku.html",
                            where: {storeAcctId: data.storeAcctId, sellerSku: data.sellerSku, siteId:data.salesSite},
                            cols: [
                                [
                                    {
                                        title: "时间",
                                        width: 150,
                                        templet: '<div>{{format(d.createTime, "yyyy-MM-dd hh:mm:ss")}}</div>'
                                    },
                                    {field: "creator", title: "操作人" },
                                    {field: "storeSSku", title: "SELLER_SKU" },
                                    {field: "storeName", title: "店铺"},
                                    {field: "origData", title: "原始价格"},
                                    {field: "newData", title: "新价格"},
                                    {field: "operTypeStr", title: "操作类型"},
                                    {field: "operDesc", title: "操作结果", width: 250}
                                ]
                            ],
                            page: false
                        });
                    }, yes: function (index, layero) {
                        layer.close(index);
                    }
                });
            }else if (layEvent === 'toProdBehavior') {
                amazon_fba_component_showBehavior(data)
            }else if (layEvent === 'FBAhistory_generateSheinProduct'){
                fbaHistory_generateSheinProduct(data)
            }else if(layEvent === 'FBAsetOwnGoodsProperties'){
                // 单个商品备货参数按钮设置
                let idList = []
                idList.push(data.id);
                let popIndex = layer.open({
                    type: 1,
                    title: '设置备货系数',
                    btn: ['保存','关闭'],
                    area: ['30%', '33%'],
                    offset:['25%','25%'],
                    content: $('#FBAhistory_setPurParamsForList_pop_con').html(),
                    success: function(layero, index) {
                        var getTpl = $('#FBAhistory_setPurParamsForList_pop').html(),
                            view = $('#FBAhistory_setPurParamsForList_popDiv')[0];
                            layui.laytpl(getTpl).render(data, function (html) {
                                view.innerHTML = html;
                                form.render();
                            });
                        layui.form.render('radio')
                    },
                    yes: function(index, layero) {
                        let Adata = serializeObject($('#FBAhistory_setPurParamsForList_form'))
                        Adata.idList = idList
                        let ajax = new Ajax()
                        ajax.post({
                            url: ctx + '/fbaHistoryProduct/setSelfPurParam',
                            data: JSON.stringify(Adata),
                            success: function (res) {
                                if (res.code === '0000') {
                                    layer.close(popIndex)
                                    layer.msg(res.msg || '操作成功', {icon: 1})
                                    // refreshTable();
                                }
                            }
                        })
                    },
                })
            }else if(layEvent === 'packageRemark'){
              let newData = [];
              newData.push(data);
              FBAhistory_updateRemarkFn(newData);
            }
        });
    }

    function fbaHistory_generateSheinProduct(data){
        layer.open({
            type: 1,
            title: '选择店铺',
            area: ['400px','300px'],
            content:$('#FBAhistory_generateSheinProduct_Pop').html(),
            btn: ['生成','取消'],
            success: function (index, layero) {
                commonReturnPromise({
                    url: '/lms/sys/listStoreForRenderHpStoreCommonComponent.html',
                    params: {roleNames: 'shein专员',platCode: 'shein商城'}
                }).then(res=>{
                    commonRenderSelect('FBAhistory_generateSheinProduct_storeAcctId',res,{name:'storeAcct',code:'id'})
                }).then(()=>{
                    form.render()
                })
            },
            yes: function(index, layero){
                const storeAcctId = $('#FBAhistory_generateSheinProduct_storeAcctId').val()
                if(!storeAcctId){
                    return layer.msg('请选择店铺')
                }
                commonReturnPromise({
                    url: `/lms/shein/publish/generateStoreProductFromFba`,
                    type: 'post',
                    params:{fbaProductId:data.id,storeAcctId}
                }).then(res=>{
                    res.listingId = ''
                    res.fbaProductId = data.id
                    res.isFba = true
                    window.parent.postMessage({name:'publishssheinmallsheinmallpublish',res},'*');
                    layer.close(index)
                })
            }
        })
    }

    /**
     * 修改刊登价格
     * @param dataList 待修改的数据列表
     * @param backTodo 发起修改成功后执行的回调方法
     */
    function fbaHistory_adjustPrice(dataList, backTodo){
        let Adata = [] 
        let time = $('#price_time').val() || $('#price_estimate_time').val()
        let promotionStartTime = new Date(time?.split(' - ')[0]).getTime();
        let promotionEndTime = new Date(time?.split(' - ')[1]).getTime();

        let priceType = $('input[name="updatePrice"]:checked').val() || $('input[name="updateEstimatePrice"]:checked').val();
        if (priceType === '2') {
            if (!time) {
                layer.msg('请选择促销价时间')
                return
            }
        }
        for (let i = 0; i < dataList.length; ++i) {
            if (!dataList[i].id) {
                continue
            }
            if (!dataList[i].newPrice) {
                layer.msg("请输入新的目标价格");
                return;
            }
            if (dataList[i].newPrice <= 0) {
                layer.msg("刊登价不能小于等于0");
                return;
            }
            if (priceType === '2') {
                Adata.push({
                    id: dataList[i].id,
                    storeAcctId: dataList[i].storeAcctId,
                    sellerSku: dataList[i].sellerSku,
                    newPrice: dataList[i].newPrice,
                    promotionStartTime,
                    promotionEndTime
                })
            } else {
                Adata.push({
                    id: dataList[i].id,
                    storeAcctId: dataList[i].storeAcctId,
                    sellerSku: dataList[i].sellerSku,
                    newPrice: dataList[i].newPrice
                })
            }
        }
        if (Adata.length === 0) {
            layer.msg('请选择要改价的产品')
            return
        }
        loading.show();
        //发送请求
        $.ajax({
            data: JSON.stringify(Adata),
            contentType: "application/json",
            url : ctx + "/amazonFbaInventory/updateListingPrice.html" ,
            method: "POST",
            dataType: 'json',
            success: function (res) {
                loading.hide();
                if (res.code === "0000") {
                    layer.msg("申请修改价格请求成功!请稍后通过日志查看结果!");
                    if (backTodo && typeof backTodo === 'function') {
                        backTodo(res.data)
                    }
                } else {
                    layer.msg(res.msg, {icon: 2});
                }
            },
            error: function (res) {
                loading.hide();
                layer.msg(res.msg, {icon: 2});
            }
        });
    }

    function FBAhistory_ajaxGetSalesTrend(data) {
        let catchData
        switch (data.timeType) {
            case 1 : catchData = FBA_SALES_TREND1
                break
            case 2 : catchData = FBA_SALES_TREND2
                break
            case 3 : catchData = FBA_SALES_TREND3
                break
        }
        if (!catchData) {
            let ajax = new Ajax(false)
            ajax.post({
                url: ctx + '/fbaHistoryProduct/getSalesTrend.html',
                data: JSON.stringify(data),
                success: function (res) {
                    if (res.code === '0000') {
                        switch (data.timeType) {
                            case 1 : FBA_SALES_TREND1 = res.data
                                break
                            case 2 : FBA_SALES_TREND2 = res.data
                                break
                            case 3 : FBA_SALES_TREND3 = res.data
                                break
                        }
                        FBAhistory_renderOption(data, res.data)
                    }
                }
            })
        } else {
            FBAhistory_renderOption(data, catchData)
        }
    }

    // 展示销量趋势曲线
    function FBAhistory_renderOption(objInfo, dataList) {
        if ($.isEmptyObject(dataList)) {
            return false
        }
        let itemId = dataList.itemId;//物品号
        let wishOnline_saleReportOption = {
            title: {
                text: '销量趋势',
                subtext: objInfo.asin
            },
            tooltip: {
                trigger: 'axis',
                formatter: function (params,ticket,callback) {
                    var weekTime=params[0].name+"";
                    var str="";
                    str+= weekTime
                    for (var i = 0, l = params.length; i < l; i++) {
                        str += '<br/>' + params[i].seriesName + ' : ' + params[i].value;
                    }
                    return str;
                }
            },
            legend: {
                data: ['销量','订单量']
            },
            toolbox: {
                show: true,
                feature: {
                    mark: {show: true},
                    dataView: {show: true, readOnly: false},
                    magicType: {show: true, type: ['line', 'bar']},
                    restore: {show: true},
                    saveAsImage: {show: true}
                }
            },
            calculable: true,
            xAxis: {},
            yAxis: {},
            series: [{
                name: '销量',
                type: 'bar',
                data: [],
            },{
                name: '订单量',
                type: 'bar',
                data: [],
            }
            ]
        };
        let xAxisData = [];
        let y1Data = [];
        let y1Data2 = [];
        $.each(dataList, function (index, element) {
            xAxisData.push(element.timeStr);
            y1Data.push(element.sales);
            y1Data2.push(element.orderNum);
        });
        wishOnline_saleReportOption.xAxis.data = xAxisData;
        wishOnline_saleReportOption.series[0].data = y1Data;
        wishOnline_saleReportOption.series[1].data = y1Data2;
        let myChart = echarts.init(document.getElementById('FBAhistory_salesTrend_echardDiv'));
        myChart.setOption(wishOnline_saleReportOption);
    }
    /**
     * 增加一个竞品数据
     * @param comp 竞品数据
     * @param data oa商品数据
     * @constructor
     */
    function FBAhistory_addOneComp(comp,oaData) {
        let html = '<table class="layui-table fl" style="width:95%">'
        html += `<tr>
                    <th width="100px">类型</th>
                    <th width="360px">竞品</th>
                    <th>我们</th>
                </th>`
        html += `<tr>
                    <td>asin</td>
                    <td><a class="canClickEl" target="_blank" href="`+ 'https://www.amazon.com/dp/' + comp.compAsin +`">`+ comp.compAsin +`</a></td>
                    <td><a class="canClickEl" target="_blank" href="`+ 'https://www.amazon.com/dp/' + oaData.asin +`">`+ oaData.asin +`</a></td>
                </tr>`
        html += `<tr>
                    <td>标题</td>
                    <td>`+ comp.compTitle +`</td>
                    <td>`+ oaData.title +`</td>
                </tr>`
        html += `<tr>
                    <td>类目</td>
                    <td>`+ (comp.compCate || '') +`</td>
                    <td>`+ '' +`</td>
                </tr>`
        html += `<tr>
                    <td>品牌</td>
                    <td>`+ (comp.compBrand || '') +`</td>
                    <td>`+ '' +`</td>
                </tr>`
        html += `<tr>
                    <td>价格</td>
                    <td>`+ (comp.compPrice || '') +`</td>
                    <td>`+ oaData.listingPrice +`</td>
                </tr>`
        html += `<tr>
                    <td>评分</td>
                    <td>`+ (comp.compScore || '') + (comp.ratting ? (' / ' + comp.ratting) : '' ) +`</td>
                    <td>`+ (oaData.score || '')  + (oaData.ratting ? (' / ' + oaData.ratting) : '' ) +`</td>
                </tr>`
        html += `<tr>
                    <td>上架时间</td>
                    <td>`+ (comp.publishTime ? Format(comp.publishTime,'yyyy-MM-dd') : '') +`</td>
                    <td>`+ (oaData.firstOnShelfTime ? Format(oaData.firstOnShelfTime,'yyyy-MM-dd') : '') +`</td>
                </tr>`
        html += `<tr>
                    <td>类目排名</td>
                    <td>`+ (comp.compRank || '') +`</td>
                    <td>`+ (oaData.saleRank || '') +`</td>
                </tr>`
        html += `</table>`
        html += `<div class="layui-btn layui-btn-xs layui-btn-danger fl FBAhistory_deleCompBtn" data-compId="`+ (comp.id || '') +`" data-index="`+ comp.index + `">删除</div>`

        $('#FBAhistory_editCompPop_compContains').append(html)
    }

    //导入
    upload.render({ //允许上传的文件后缀
        elem: '#FBAhistory_excelImport_planQuality',
        url: ctx + '/amazonFbaInventory/uploadPlanQuality.html',
        accept: 'file' //普通文件
        ,
        exts: 'xls|xlsx' //只允许上传excel文件
        ,
        before: function (obj) { //obj参数包含的信息，跟 choose回调完全一致，可参见上文。
            layui.admin.load.show();
        },
        done: function (res) {
            layui.admin.load.hide();
            if (res.msg) {
                layer.msg(res.msg, {icon: 2});
            }else{
                layer.msg("导入成功");
            }

        }
    });

    //下载模板
    $('#FBAhistory_downTemp_planQuality').click(function () {
        submitForm(null, ctx + '/amazonFbaInventory/downPlanQualityTemp.html');
    });

    $('#FBAhistory_exportAllInfo').click(function () {
        let data = serializeObject($('#FBAhistoryForm'))
        if (data.time) {
            data.startTime = data.time.split(' - ')[0] + ' 00:00:00';
            data.endTime = data.time.split(' - ')[1] + ' 23:59:59';
        }
        // 获取标签
        let labels = $('#FBAhistory_labelContains').find('[name=labelName]:checked')
        if (labels && labels.length > 0) {
            let labelArr = []
            for (let i = 0; i < labels.length; ++i) {
                labelArr.push(labels[i].value)
            }
            data.labelListStr = labelArr.join(',')
        }
        if (data.orgId && !data.salesPersonIdListStr) {
            data.salesPersonIdListStr = $('#FBAhistory_userList').attr('user_ids')
        }
        if (data.FBA_skuSaler_orgId && !data.skuSalerPersonIdListStr) {
            data.skuSalerPersonIdListStr = $('#FBAhistory_FBASalerList').attr('user_ids')
        }
        if (data.FBA_developer_orgId && !data.developerIdListStr) {
            data.developerIdListStr = $('#FBAhistory_developerIdList').attr('user_ids')
        }
        //只有第一次跳转的时候才会有值
        if (fbaHistory_cache) {
            //设置下拉被选中
            $('#FBAhistoryForm select[name= skuType] option[value=asinStr]').attr("selected", true);
            var parse = JSON.parse(fbaHistory_cache);
            var asinStr = parse.sAsinList;
            //设置sku的值
            $('#FBAhistoryForm input[name=sku]').val(asinStr);
            data.sku = asinStr;
            data.skuType = "asinStr";
            //清空此数据
            fbaHistory_cache = undefined;
        }
        data[data.skuType] = data.sku;
        submitForm({data:JSON.stringify(data)}, ctx + '/fbaHistoryProduct/exportAllInfo.html');
    });

    // 批量修改
    $('#FBAhistory_updateByListBtn').click(function () {
        var data = table.checkStatus('FBAhistory_Table').data
        if (data.length === 0) {
            layer.msg('请选择需要修改的货品')
            return
        }
        let idList = []
        for (let i in data) {
            idList.push(data[i].id)
        }
        let popIndex = layer.open({
            type: 1,
            title: '批量修改',
            btn: ['保存','关闭'],
            area: ['60%', '600px'],
            content: $('#FBAhistory_updateList_pop').html(),
            success: function(layero, index) {
                let dataForm = $('#FBAhistory_updateList_Form')
                dataForm.find('[name=packType]').html(FBA_PACKTYPE_LIST)
                if (idList.length === 1) {
                    dataForm.find('[name=packType]').val(data[0].packType)
                    dataForm.find('[name=ifSmallSize]').val(data[0].ifSmallSize)
                }
                form.render('select','FBAhistory_updateList_Form')

            },
            yes: function () {
                let dataForm = $('#FBAhistory_updateList_Form')
                let Adata = {
                    idList: idList,
                    ifSmallSize: dataForm.find('[name=ifSmallSize]').val(),
                    packType: dataForm.find('[name=packType]').val(),
                }
                let ajax = new Ajax()
                ajax.post({
                    url: ctx + '/fbaHistoryProduct/updateByList.html',
                    data: JSON.stringify(Adata),
                    success: function (res) {
                        if (res.code === '0000') {
                            layer.close(popIndex)
                            layer.msg(res.msg || '操作成功', {icon: 1})
                            // refreshTable()
                        } else {
                            layer.msg(res.msg)
                        }
                    }
                })
            }
        })
    })
    //ztt20240507批量备注函数
    function FBAhistory_updateRemarkFn(data){
      let idList = []
      for (let i in data) {
          idList.push(data[i].id)
      }
      let FBAhistory_wangEdit_packDesc;
      let popIndex = layer.open({
          type: 1,
          title: '修改包装备注',
          btn: ['保存','关闭'],
          area: ['60%', '500px'],
          content: $('#FBAhistory_updatePackDesc_pop').html(),
          success: function() {
             //渲染并回显
             FBAhistory_wangEdit_packDesc = wangEditorRender('FBAhistory_packDescEditor', idList.length == 1 ? data[0].packDesc: '', {}, {
                showBtn: true,
                menus: ['head', // 标题
                'bold', // 粗体
                'fontSize', // 字号
                'image'
                ],
                imgUrl: ctx + '/prodTpl/uploadPic.html',
                fileName: 'file',
                srcCode: 'msg'
             });
          },
          yes: function () {
            let editorHtml = FBAhistory_wangEdit_packDesc.txt.html();
            //判断内容是否为空
            let editorTxt = editorHtml.trim();
            let newEditorTxt = editorTxt.replace(/<p>|<br\/?>|<\/p>|<br>|\&nbsp;/g, '');
            commonReturnPromise({
              url: ctx + '/fbaHistoryProduct/batchUpdatePackDesc',
              type: 'post',
              contentType: 'application/json',
              params: JSON.stringify({
                packDesc: newEditorTxt.trim()== '' ? '':editorHtml,
                idList: idList
              })
            }).then(res => {
              layer.close(popIndex)
              layer.msg(res || '操作成功', {icon: 1})
              // refreshTable(); //要求不刷新,业务自己点击刷新更新备注
            });
          }
      });
    }
    //批量备注功能
    $('#FBAhistory_updatePackDescByList').click(function () {
        let data = table.checkStatus('FBAhistory_Table').data
        if (data.length === 0) {
            layer.msg('请选择需要修改的货品')
            return
        }
        FBAhistory_updateRemarkFn(data);
    });
    

    // 渲染FBA包装规格
    function initFbaPackType() {
        if (!FBA_PACKTYPE_LIST) {
            let ajax = new Ajax(false)
            ajax.post({
                url: ctx + '/fbaHistoryProduct/getPackType.html',
                success: function (res) {
                    if (res.code === '0000') {
                        let packTypeList = res.data
                        let optionHtml = '<option></option>'
                        for (let i in packTypeList) {
                            optionHtml += '<option value="'+ packTypeList[i].code +'">' + packTypeList[i].code + '</option>'
                        }
                        FBA_PACKTYPE_LIST = optionHtml
                    } else {
                        layer.msg(res.msg)
                    }
                }
            })
        }
    }
    initFbaPackType()

    function renderFbaPackTypeSelector(selector) {


    }

    function getFBAPACKTYPELISTOPTIONS() {
        if (FBA_PACKTYPE_LIST) {
            let optionHtml = '<option></option>'
            for (let i in FBA_PACKTYPE_LIST) {
                optionHtml += '<option value="'+ FBA_PACKTYPE_LIST[i].code +'">' + FBA_PACKTYPE_LIST[i].code + '</option>'
            }
        } else {
            let ajax = new Ajax(false)
            ajax.post({
                url: ctx + '/fbaHistoryProduct/getPackType.html',
                success: function (res) {
                    if (res.code === '0000') {
                        FBA_PACKTYPE_LIST = res.data
                    } else {
                        layer.msg(res.msg)
                    }
                }
            })
        }

        return optionHtml
    }

// 表单提交
    //验证 //分页效果,从按钮触发是否可以重置//如果不能重置,则改为非表单提交,表单的目的做数据校验
    $('#FBAhistory_Search').click(function () {
        let data = serializeObject($('#FBAhistoryForm'))
        if (data.time) {
            data.startTime = data.time.split(' - ')[0] + ' 00:00:00';
            data.endTime = data.time.split(' - ')[1] + ' 23:59:59';
        }
        // 获取标签
        let labels = $('#FBAhistory_labelContains').find('[name=labelName]:checked')
        if (labels && labels.length > 0) {
            let labelArr = []
            for (let i = 0; i < labels.length; ++i) {
                labelArr.push(labels[i].value)
            }
            data.labelListStr += (data.labelListStr ? ',' : '') + labelArr.join(',')
        }
        if (data.orgId && !data.salesPersonIdListStr) {
            data.salesPersonIdListStr = $('#FBAhistory_userList').attr('user_ids')
        }
        if (data.FBA_skuSaler_orgId && !data.skuSalerPersonIdListStr) {
            data.skuSalerPersonIdListStr = $('#FBAhistory_FBASalerList').attr('user_ids')
        }
        if (data.FBA_developer_orgId && !data.developerIdListStr) {
            data.developerIdListStr = $('#FBAhistory_developerIdList').attr('user_ids')
        }
        //只有第一次跳转的时候才会有值
        if (fbaHistory_cache) {
            //设置下拉被选中
            $('#FBAhistoryForm select[name= skuType] option[value=asinStr]').attr("selected", true);
            var parse = JSON.parse(fbaHistory_cache);
            var asinStr = parse.sAsinList;
            //设置sku的值
            $('#FBAhistoryForm input[name=sku]').val(asinStr);
            data.sku = asinStr;
            data.skuType = "asinStr";
            //清空此数据
            fbaHistory_cache = undefined;
        }

        // 默认按照 id desc 排序
        const fba_orderBy1 = formSelects.value('FBAhistory_orderBy', 'val');
        if (!fba_orderBy1.length && !data.orderBy2) {
            data.orderBy = 'afi.id desc'
        }else if(!fba_orderBy1.length || !data.orderBy2){
            data.orderBy = null
        }else{
            if (fba_orderBy1.length) {
                const orderByClauses = fba_orderBy1.map(field => `${field.trim()} ${data.orderBy2}`);
                data.orderBy = orderByClauses.join(',');
              }
        }
        delete data.orderBy1
        delete data.orderBy2

        form_search(data);
    })

    //提交转移销售员
    form.on('submit(FBAhistory_setSaleperson_tpl_Form_submit)', function (data) {
        data.field.idList=data.field.idList.split(',');
        tea_Ajax_ver1('/fbaHistoryProduct/setSaleperson.html',JSON.stringify(data.field),function (returnData){
            layer.close(FBAhistory_setSaleperson_tpl_Form_index);
            layer.msg('转移成功')
            // refreshTable();
        });
    })

    UnifiedFixedFn('FBAhistory_tableHead_card');//

    function form_search(req) {//初次search的入口
        $('#FBAhistory_table_check_num').html('当前选中0条数据');
        req[req.skuType] = req.sku;
        table.render({
            elem: "#FBAhistory_Table",
            method: 'post',
            url: ctx + "/fbaHistoryProduct/queryPage.html",
            where: req,
            cols: tablecol.FBAhistory_Table,
            id: "FBAhistory_Table",
            page: true,
            limits: [100, 200, 500],
            limit: 100,
            created: function (res) {
               if (res.code === '0000') {
                   let list = res.data
                   for (let i = 0; i < list.length; ++i) {
                       list[i].totalStock = (list[i].oaInPackNum || 0) + list[i].fbaInboundShippedQuality + list[i].fbaInboundReceivingQuality + list[i].fbaAvailableQuality + list[i].fbaUnsellableQuality + list[i].fbaResvervedQuality
                       list[i].totalCost =  (list[i].totalStock * (list[i].oaCost + (list[i].headFreight || 0))).toFixed(2)
                       list[i].salableCost =  ((list[i].fbaAvailableQuality || 0) * (list[i].oaCost + (list[i].headFreight || 0))).toFixed(2)
                       list[i].salableDay = list[i].fbaAvailableQuality ? Math.floor(list[i].dailySales ? (list[i].fbaAvailableQuality / list[i].dailySales) : 9999) : 0
                       list[i].stockCycleDay = list[i].totalStock ? Math.floor(list[i].dailySales ? (list[i].totalStock / list[i].dailySales) : 9999) : 0
                       list[i].refundRate = list[i].totalOrder ? (accMul(accDiv(list[i].refundOrder,list[i].totalOrder), 100).toFixed(2) + '%') : ''
                       if (list[i].promotionEndTime && isTimestampToday(list[i].promotionEndTime)) {
                        list[i].isExsitPromotion = true;
                       } else {
                        list[i].isExsitPromotion = false;
                       }
                   }
               }
            },
            done: function(res, curr, count) {
                imageLazyload();
                $('#FBAhistory_Table').next().find('.layui-table-header').removeClass('toFixedContain');
            }
        })

    }

    // 判断时间是不是大于等于今天
    function isTimestampToday(timestamp) {
        const today = new Date().getTime();
        // 比较日期
        if (timestamp >= today) {
          return true;
        } else {
          return false;
        }
      }

    //设置全局备货系数
    $('#FBAsetGoodsProperties').click(function() {
        var salesSite = '';
        var sellerSku = '';
        var storeAcctId='';
        layer.open({
            type: 1,
            title: '设置备货系数',
            btn: ['保存', '取消'],
            area: ['27%', '40%'],
            content: $('#pop_FBAhistory_setGoodsProperty').html(),
            success: function(layero, index) {
                let tableData = []
                $.ajax({
                    url: ctx + "/amazonFbaInventory/searchAmazonFbaSaleParams",
                    type: "get",
                    dataType: 'json',
                    beforeSend: function () {
                        loading.show();
                    },
                    success: function (data) {
                        loading.hide();
                        if (data.code == '0000') {
                            tableData = data.data || []

                            var getTpl = $('#pop_FBAhistory_setGoodsPropertyLayer').html(),
                                view = $('#pop_FBAhistory_setGoodsPropertyDiv')[0];
                                console.log('tableData', tableData)
                            layui.laytpl(getTpl).render(tableData, function (html) {
                                view.innerHTML = html;
                                form.render();
                            });
                        }
                    },
                    error: function (error) {
                        loading.hide();
                        layer.msg(`${error.statusText}`, { icon: 2 });
                    }
                });
            },
            yes: function(index, layero) {
                let paramsList = []
                $('#pop_FBAhistory_setGoodsPropertyDiv').find('.shippingBox')?.each((index, item) => {
                    let obj = {
                        id: $(item).find('[name=id]').val() || '',
                        saleRatioPercentStrSeven: $(item).find('[name=saleRatioSeven]').val() || '',
                        saleRatioPercentStrFifteen: $(item).find('[name=saleRatioFifteen]').val() || '',
                        saleRatioPercentStrThirty: $(item).find('[name=saleRatioThirty]').val() || '',
                        shippingType: $(item).find('[name=shippingType]').val() || '',
                        safeDay: $(item).find('[name=safeDay]').val() || '',
                        purchaseDay: $(item).find('[name=purchaseDay]').val() || '',
                        fbaFreightDay: $(item).find('[name=fbaFreightDay]').val() || '',
                    }
                    paramsList.push(obj)
                })
                let ajax = new Ajax(false)
                loading.show()
                ajax.post({
                    url: ctx + '/amazonFbaInventory/saveAmazonFbaSalesParams',
                    data: JSON.stringify(paramsList),
                    success: function (res) {
                        if (res.code === '0000') {
                            layer.msg('保存成功')
                            layer.close(index)
                        } else {
                            layer.msg(res.msg)
                        }
                        loading.hide()
                    },
                    error: function() {
                        loading.hide()
                        layer.msg('保存失败')
                    }
                })
                
            },
        })
    })

    // 批量设置个性化备货系数
    $('#FBAsetGoodsPropertiesForList').click(function() {
        let data = table.checkStatus('FBAhistory_Table').data;
        if (!data || !data.length) {
            layer.msg('请选择需要设置备货系数的货品')
            return
        }
        let idList = []
        for (let i = 0; i < data.length; ++i) {
            idList.push(data[i].id)
        }
        let popIndex = layer.open({
            type: 1,
            title: '设置备货系数',
            btn: ['保存','关闭'],
            area: ['30%', '33%'],
            offset:['25%','25%'],
            content: $('#FBAhistory_setPurParamsForList_pop_con').html(),
            success: function(layero, index) {
                var getTpl = $('#FBAhistory_setPurParamsForList_pop').html(),
                    view = $('#FBAhistory_setPurParamsForList_popDiv')[0];
                    layui.laytpl(getTpl).render(data, function (html) {
                        view.innerHTML = html;
                        form.render();
                    });
                layui.form.render('radio')
            },
            yes: function(index, layero) {
                let Adata = serializeObject($('#FBAhistory_setPurParamsForList_form'))
                Adata.idList = idList
                let ajax = new Ajax()
                ajax.post({
                    url: ctx + '/fbaHistoryProduct/setSelfPurParam',
                    data: JSON.stringify(Adata),
                    success: function (res) {
                        if (res.code === '0000') {
                            layer.close(popIndex)
                            layer.msg(res.msg || '操作成功', {icon: 1})
                            // refreshTable();
                        }
                    }
                })
            },
        })
    })
    // 批量修改销售备注
    $("#FBAeditSaleRemark").click(function(){
        let data = table.checkStatus('FBAhistory_Table').data;
        if (!data || !data.length) {
            layer.msg('请选择需要修改销售备注的货品')
            return
        }
        let idList = []
        for (let i = 0; i < data.length; ++i) {
            idList.push(data[i].id)
        }
        let popIndex = layer.open({
            type: 1,
            title: '<h2 style="font-weight:600;">批量修改销售备注</h2>',
            btn: ['保存','关闭'],
            area: ['35%', '30%'],
            content: $('#FBAhistory_editSaleRemarkList_pop').html(),
            success: function(layero, index) {
               
                layui.form.render('radio');
                form.on('radio(FBAhistory_remarkType)', function(data){
                    if(data.value.includes('删除原备注')){
                        $('#FBAeditSaleRemarkForm textarea[name="newSaleRemark"]').addClass('layui-disabled').addClass('gray_textarea').prop('disabled', true);
                    }else{
                        $('#FBAeditSaleRemarkForm textarea[name="newSaleRemark"]').removeClass('layui-disabled').removeClass('gray_textarea').prop('disabled', false);
                    }
                  }); 
            },
            yes: function(index, layero) {
                let Adata = serializeObject($('#FBAeditSaleRemarkForm'));
                Adata.idList = idList
                let ajax = new Ajax()
                
                ajax.post({
                    url: ctx + '/fbaHistoryProduct/batchUpdateSaleRemark',
                    data: JSON.stringify(Adata),
                    success: function (res) {
                        if (res.code === '0000') {
                            layer.close(popIndex);
                            layer.msg('操作成功', {icon: 1});
                            // refreshTable();
                        }
                    }
                })
            },
        })
    })
   
    // 批量设置个性化备货系数
    $('#amazon_fba_setting_ifSaleList').click(function() {
        let data = table.checkStatus('FBAhistory_Table').data
        if (!data || !data.length) {
            layer.msg('请先选择货品')
            return
        }
        let idList = []
        for (let i = 0; i < data.length; ++i) {
            idList.push(data[i].id)
        }
        let popIndex = layer.open({
            type: 1,
            title: '修改销售状态',
            btn: ['保存','关闭'],
            area: ['300px', '300px'],
            content: $('#FBAhistory_updateIfSaleForList_pop').html(),
            success: function(layero, index) {
                form.render('select','FBAhistory_updateIfSaleForList_Form')
            },
            yes: function(index, layero) {
                let Adata = serializeObject($('#FBAhistory_updateIfSaleForList_Form'))
                if (!Adata.ifSale) {
                    layer.msg('请选择销售状态')
                    return false
                }
                Adata.idList = idList
                let ajax = new Ajax()
                ajax.post({
                    url: ctx + '/fbaHistoryProduct/setIfSale.html',
                    data: JSON.stringify(Adata),
                    success: function (res) {
                        if (res.code === '0000') {
                            layer.close(popIndex)
                            layer.msg(res.msg || '操作成功', {icon: 1})
                            // refreshTable();

                        }
                    }
                })
            },
        })
    })

    //添加货件计划
    $('#FBAhistory_addPlan').click(function() {
        var data = table.checkStatus('FBAhistory_Table').data
        if (data.length > 0) {
            var tabletableIns = {}
            layer.open({
                type: 1,
                title: '添加至FBA',
                btn: ['<div title="如果已经存在同一产品的发货需求则更新需求数量">添加/更新<i class="layui-icon layui-icon-tips"></i></div>', '关闭'],
                area: ['90%', '700px'],
                content: $('#pop_FBAhistory_add').html(),
                success: function(layero, index) {
                    // 获取同站点同asin数据
                    let idList = []
                    for (let i = 0; i < data.length; ++i) {
                        idList.push(data[i].id)
                    }
                    let formDate = new FormData();
                    formDate.idList = idList
                    let ajax = new Ajax()
                    ajax.post({
                        url: ctx + '/fbaHistoryProduct/getSameSiteAndAsinByIdList.html',
                        data: JSON.stringify({idList: idList}),
                        success: function (res) {
                            if (res.code === '0000') {
                                let sameAsinList = res.data
                                let sameAsinMap = {}
                                for (let i = 0 ; i < sameAsinList.length; ++i) {
                                    sameAsinMap[sameAsinList[i].asin + sameAsinList[i].salesSite] = sameAsinList[i]
                                }
                                for (let i = 0; i < data.length; ++i) {
                                    data[i].sameAsinStatistcInfo = sameAsinMap[data[i].asin + data[i].salesSite]
                                    data[i].hisId = data[i].id
                                }
                                tabletableIns = tea_renderTable_ver1(data, 'FBAhistory_addToPlan_Table', tablecol.FBAhistory_addToPlan_Table
                                    ,function () {
                                        // 选择店铺，变更日均销量、最大发货量、店铺sku
                                        form.on('select(FBAhistory_addToPlan_storeAcctSelect)',function (data) {
                                            let curSelect = data.elem
                                            let storeId = data.value // 选择的店铺
                                            let id = curSelect.getAttribute('data-id')  // 对应的数据id
                                            let selectOption = $(curSelect).find('option:selected')
                                            let sellerSku = selectOption.attr('data-sellerSku')
                                            let dailySales = selectOption.attr('data-dailySales')
                                            let platMaxDeliverAmount = selectOption.attr('data-platMaxDeliverAmount')
                                            let hisId = selectOption.attr('data-hisId')

                                            let tableData = layui.table.cache["FBAhistory_addToPlan_Table"]
                                            for (let i = 0; i < tableData.length; ++i) {
                                                if (tableData[i].id === parseInt(id)) {
                                                    tableData[i].hisId = hisId
                                                    tableData[i].storeAcctId = storeId
                                                    tableData[i].sellerSku = sellerSku
                                                }
                                            }
                                            // 获取当前行重新渲染sellerSku、最大发货数量、日均销量
                                            $(curSelect).closest('tr').find('.FBAhistory_addToPlan_sellerSkuDiv').text(sellerSku)
                                            $(curSelect).closest('tr').find('.FBAhistory_addToPlan_dailySalesDiv').text(dailySales)
                                            $(curSelect).closest('tr').find('.FBAhistory_addToPlan_platMaxDeliverAmountDiv').text(platMaxDeliverAmount)
                                        })
                                        imageLazyload();
                                        $('#FBAhistory_batchSet_PlanQualityNum').click(function() {
                                            //获取所有的
                                            $('.FBAhistory_proNum_class').val($('#FBAhistory_batchSet_PlanQualityNum_val').val());
                                        });

                                        // $('#FBAhistory_batchSet_ifSmallSizeBtn').click(function() {
                                        //     let val = $('#FBAhistory_batchSet_ifSmallSizeVal').val()
                                        //     if (val !=0 && val != 1) {
                                        //         layer.msg('请填写1或者0')
                                        //         return
                                        //     }
                                        //     //获取所有的
                                        //     if (val == 1) {
                                        //         $('.pop_FBAhistory_addForm_ifSmallSize').val('true');
                                        //     } else {
                                        //         $('.pop_FBAhistory_addForm_ifSmallSize').val('false');
                                        //     }
                                        //     form.render('select','pop_FBAhistory_addForm')
                                        // });
                                        // $('#FBAhistory_batchSet_packTypeBtn').click(function() {
                                        //     let val = $('#FBAhistory_batchSet_packTypeVal').val().trim()
                                        //     debugger
                                        //     if (!val) {
                                        //         layer.msg('请填写一个可选的包装规格')
                                        //         return
                                        //     }
                                        //     if (FBA_PACKTYPE_LIST.indexOf('value="'+ val +'"') < 0) {
                                        //         layer.msg('请填写一个可选的包装规格')
                                        //         return
                                        //     }
                                        //     //获取所有的
                                        //     $('.pop_FBAhistory_addForm_packType').val(val);
                                        //     form.render('select','pop_FBAhistory_addForm')
                                        //
                                        // });

                                        // 渲染select
                                        let packTypeSelList = $('#pop_FBAhistory_addForm').find('[lay-filter=pop_FBAhistory_addForm_packType]')
                                        for (let i = 0; i <packTypeSelList.length; ++i) {
                                            let packType = $(packTypeSelList[i]).attr('data-value')
                                            if (packType){
                                                $(packTypeSelList[i]).find('[value="'+ packType +'"]').attr("selected",'selected')
                                            }
                                        }
                                        form.render('select','pop_FBAhistory_addForm')
                                    },600);

                                var layFilterIndex = 'LAY-table-' + tabletableIns.config.index;
                                var tableContainer = $('div[lay-filter="' + layFilterIndex + '"]');
                                tableContainer.css('cssText', 'overflow:visible !important')
                                tableContainer.find('.layui-table-box').css('cssText', 'overflow:visible !important')
                                tableContainer.find('.layui-table-header').css({
                                    position: 'sticky',
                                    top: '0px',
                                    'z-index': 99999999
                                });
                                $('td[data-field="planQuality"]').find('input').blur(function () {
                                    tableContainer.find('#planquailtycount').remove()
                                    $('#addtoFBAboxhx #planquailtycount').remove()
                                    var planQuality = columnsum('planQuality', '2')
                                    tableContainer.find('th[data-field="planQuality"]').append('<div id="planquailtycount">(' + planQuality + ')</div>')
                                });
                            }
                        }
                    })

                },
                yes: function(index, layero) {
                    toAddFbaPlan(tabletableIns);
                    return false;//默认点击后不关闭
                },
            })
        } else {
            layer.msg('请勾选需要添加至FBA的商品')
        }
    });

    // 设置发货类型
    $('#FBAhistory_addType').click(function() {
        var data = table.checkStatus('FBAhistory_Table').data
        
        if (!data || !data.length) {
            layer.msg('请勾选需要设置发货类型的商品')
            return
        }
        let idList = []
        for (let i = 0; i < data.length; ++i) {
            idList.push(data[i].id)
        }
        if (data.length > 0) {
            let popIndex = layer.open({
                type: 1,
                title: '设置发货类型',
                btn: ['保存', '取消'],
                area: ['400px', '400px'],
                content: $('#pop_FBAhistory_setAddType').html(),
                success: function(layero, index) {
                    form.render('select','FBAhistory_setAddType_Form')
                },
                yes: function(index, layero) {
                    let Adata = serializeObject($('#FBAhistory_setAddType_Form'))
                    Adata.idList = idList
                    let ajax = new Ajax()
                    ajax.post({
                        url: ctx + '/fbaHistoryProduct/batchEditShippingType',
                        data: JSON.stringify(Adata),
                        success: function (res) {
                            if (res.code === '0000') {
                                layer.close(popIndex)
                                layer.msg(res.msg || '操作成功', {icon: 1})
                                // refreshTable();

                            }
                        }
                    })
                },
            })
        }
    })

    //添加至FBA
    $('#FBAhistory_batch_setSaleperson').click(function () {
        var data = table.checkStatus('FBAhistory_Table').data
        if (data.length > 0) {
            var idList = data.map(function (item) {
                return item.id
            })
            FBAhistory_setSaleperson_tpl_Form_index= layer.open({
                type: 1,
                title: '批量转移',
                area: ['800px', '450px'],
                content:$('#FBAhistory_setSaleperson_tpl').html(),
                btn: ['转移','关闭'],
                success: function (index, layero) {
                    tea_Ajax_ver1('/sys/listuserbyrole.html',{role : "amazon专员"},function (returnData) {
                        tea_appendSelect_ver1($('#FBAhistory_setSaleperson_tpl_Form select[name=skuSalespersonId]'),returnData.data,'id','userName',data.skuSalespersonId);//带回显
                        form.render('select');

                    },false,'application/x-www-form-urlencoded');

                    $('#FBAhistory_setSaleperson_tpl_Form input[name=idList]').val(idList.join(','));
                },
                yes:function (index, layero) {
                    $('#FBAhistory_setSaleperson_tpl_Form_submit').click();
                }
            });

        }else {
            layer.msg('请勾选需要转移的商品')
        }
    });


    //同步FBA商品
    $('#FBAhistory_asyncInv').click(function() {
        var data = table.checkStatus('FBAhistory_Table').data
        var storeArr = [];
        var siteArr = [];
        for (var i in data) {
            if (!(storeArr.indexOf(data[i].storeAcctId) > -1)) {
                storeArr.push(data[i].storeAcctId)
            }
            if (!(siteArr.indexOf(data[i].salesSite) > -1)) {
                siteArr.push(data[i].salesSite)
            }
        }
        if (storeArr.length > 1 || siteArr.length > 1) {
            layer.msg('请选择同一站点同一店铺的商品，你可以使用店铺，站点条件进行筛选查询')
        } else {
            var idList=[];
            var salesSite;
            var storeAcctId;
            if (data.length < 1) {
                storeAcctId= $('#FBAhistoryForm select[name=storeAcctId]').val();
                salesSite=$('#FBAhistoryForm select[name=salesSite]').val();
            }else {
                salesSite = data[0].salesSite;
                storeAcctId = data[0].storeAcctId;
                idList = data.map(function (item) {
                    return item.id
                })
            }

            tea_Ajax_ver1('/amazonFbaInventory/sync.html', JSON.stringify({ salesSite:salesSite,storeAcctId: storeAcctId, idList:idList }), function(returnData) {
                layer.msg(returnData.msg || '同步成功')
                // refreshTable();
            });
        }
    });

    //监听店铺下拉选择
    form.on('select(FBAhistory_storeAcct)', function(data) {
        var storeTmp=data.value;
        var sites = data.elem[data.elem.selectedIndex].dataset.sites;
        FBAhistory_global_siteEnum = getInitFBAAmazonSite();
        var canSelSiteList = [];

        if(storeTmp){//选择了店铺
            if (!$.isEmptyObject(sites)) {
                var siteList = sites.split(",");
                for (var i = 0; i < siteList.length; i++) {
                    var obj = {};
                    obj.site = siteList[i];
                    obj.siteName = FBAhistory_global_siteEnum.get(siteList[i]);
                    canSelSiteList.push(obj);
                }
            }
        }else{//没选任何店铺,展示所有咋的站点
            FBAhistory_global_siteEnum.forEach(function(value,key){
                var obj = {};
                obj.site = key;
                obj.siteName = value;
                canSelSiteList.push(obj);
            });
        }
        //美国/英国第一位
        canSelSiteList.sort(function (a, b) {
            if(a.site=='US'&&b.site!='US'){
                return -1;
            }
            if(a.site=='GB'&&b.site!='GB'){
                return -1;
            }
            return 0;
        });


        tea_appendSelect_ver1($('#FBAhistoryForm select[name=salesSite]'), canSelSiteList, 'site', 'siteName',null,'站点');
        form.render('select');
    });

    // //监听排序
    // table.on('sort(FBAhistory_Table)', function(obj) {
    //     $('#FBAhistoryForm input[name="orderType"]').val(obj.type)
    //     $('#FBAhistoryForm input[name="orderAttr"]').val(obj.field)
    //     refreshTable();
    //     // }
    // });

    // 纵向合计
    function columnsum(datafield, type) {
        var amount = 0;
        $('.addtoFBAboxhx .layui-table-box').find('td[data-field="' + datafield + '"]').each(function(index, item) {
            if (type === '1') {
                amount += Number($(item).find('div').text())
            } else {
                amount += Number($(item).find('div input').val())
            }
        })
        return amount
    }

    /**
     *
     * @param tableIns
     * @param addFbaOpType //0只更新计划1新增计划2同时更新和新增
     */
    function toAddFbaPlan(tableIns) {
        var plans = [];
        applytoChecked('FBAhistory_addToPlan_Table', tableIns, function (tr, data, index) {
            var planQuality = $(tr).find('td[data-field="planQuality"]').find('input').val();
            var ifSmallSize = $(tr).find('td[data-field="ifSmallSize"]').find('select').val();
            var packType = $(tr).find('td[data-field="packType"]').find('select').val();
            if (!planQuality) {
                layer.msg("计划发货数量必填")
                return
            }
            if (planQuality <= 0) {
                layer.msg("计划发货数量必须大于0")
                return
            }
            data.refundRateNum = 0
            if (data.refundRate) {
                data.refundRateNum = data.refundRate.replace('%','')
            }
            data.planQuality = planQuality
            data.packType = packType
            data.ifSmallSize = ifSmallSize
            data.historyId = data.hisId
            var {id, planQuality, salesSite, storeAcctId, sellerSku,packType,ifSmallSize,historyId,refundRateNum} = data
            plans.push({id, planQuality, salesSite, storeAcctId, sellerSku,packType,ifSmallSize,historyId,refundRateNum});
        });

        if (plans.length > 0) {
            let refundRateOver20Arr = []
            for (let i = 0; i < plans.length; ++i){
                if (plans[i].refundRateNum >= 20) {
                    refundRateOver20Arr.push(plans[i].sellerSku)
                }
            }
            console.log(refundRateOver20Arr)
            if (refundRateOver20Arr.length > 0) {
                layer.confirm('检测到店铺sku:【'+ refundRateOver20Arr.join(',') +'】的退款率大于 20%. 是否继续生成发货需求',{btn:['确认','取消']},function () {
                    FBAhistory_ajaxToAddPlan(plans)
                })
            } else {
                FBAhistory_ajaxToAddPlan(plans)
            }
        }
    }
    function FBAhistory_ajaxToAddPlan(plans) {

            tea_Ajax_ver1('/amazonFbaInventory/addInboundShipment.html', JSON.stringify({plans:plans}), function (returnData) {
                var resultText = {'0': '已存在商品并更新', '1': '已加入', '2': '不操作'};
                if (returnData.code === '0000') {
                    layer.msg('操作成功')
                    for (var i in returnData.data) {
                        applytoChecked('FBAhistory_addToPlan_Table', tableIns, function (tr, data, index) {
                            if (data.id === returnData.data[i].id) {
                                $(tr).find('td[data-field="optionresult"] div').text(resultText[returnData.data[i].insertStatus])
                            }
                        });
                    }
                }
            });

    }

    //获取站点
    function getInitFBAAmazonSite(isFirst) {
        if (FBAhistory_global_siteEnum == null || FBAhistory_global_siteEnum == undefined) {
            //赋值
            tea_Ajax_ver1('/enum/getSiteEnum.html?platCode=amazon', {}, function(returnData) {
                var data = returnData.data;

                var map_FBAhistory_global_siteEnum = new Map();
                for (var i in data) {
                    map_FBAhistory_global_siteEnum.set(data[i].code, data[i].name)
                }
                FBAhistory_global_siteEnum = map_FBAhistory_global_siteEnum;

                if(isFirst){
                    var canSelSiteList = [];
                    FBAhistory_global_siteEnum.forEach(function(value,key){
                        var obj = {};
                        obj.site = key;
                        obj.siteName = value;
                        canSelSiteList.push(obj);
                    });
                    tea_appendSelect_ver1($('#FBAhistoryForm select[name=salesSite]'), canSelSiteList, 'site', 'siteName',null, '站点');
                    form.render('select');
                }
            },false)
        }


        return FBAhistory_global_siteEnum;
    }

    // 初始化
    //赋值
    getInitFBAAmazonSite(true);

    //  $('#FBAhistory_Search').click()

    // 设置标签
    $('#FBAhistory_setLabelBtn').click(function () {
        var data = table.checkStatus('FBAhistory_Table').data
        if (data.length === 0) {
            layer.msg('请选择要设置标签的产品')
            return
        }
        var idList = [];
        for (var i in data) {
            idList.push(data[i].id)
        }
        let popIndex = layer.open({
            type: 1,
            title: '设置标签',
            area: ['800px', '450px'],
            content:$('#FBAhistory_setLablePop').html(),
            btn: ['确定','关闭'],
            success: function (index, layero) {
                $('#FBAhistory_setLablePop_form').html($('#FBAhistory_labelOrigin').html() + '')
                form.render('checkbox','FBAhistory_setLablePop_form')
            },yes: function () {
                let Adata = {
                    idList: idList,
                    labelType: 1
                }
                // 获取标签
                let labels = $('#FBAhistory_setLablePop_form').find('[name=labelName]:checked')
                let labelArr = []
                if (labels.length > 0) {
                    for (let i = 0; i < labels.length; ++i) {
                        labelArr.push(labels[i].value)
                    }
                }
                Adata.labelList = labelArr
                oneAjax.post({
                    url: ctx + '/fbaHistoryProduct/updateLabel',
                    data: Adata,
                    success: function (res) {
                        if (res.code === '0000') {
                            // refreshTable()
                            layer.close(popIndex)
                            layer.msg(res.msg || '操作成功', {icon: 1})
                        }
                    }
                })
            }
        })
    })

    // 设置物流标签
    $('#FBAhistory_setLogisticLabelBtn').click(function () {
        var data = table.checkStatus('FBAhistory_Table').data
        if (data.length === 0) {
            layer.msg('请选择要设置标签的产品')
            return
        }
        var idList = [];
        for (var i in data) {
            idList.push(data[i].id)
        }
        let layerPopId = layer.open({
            type: 1,
            title: '设置物流标签',
            btn: ['提交', '关闭'],
            area: ['400px', '300px'],
            content: $('#FBAhistory_setLogisticLabelPop').html(),
            success: function(layero, index) {
                // 初始化标签
                oneAjax.post({
                    url: '/sys/listdict.html',
                    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                    data:{headCode:"FBA_SHIP_PLAN_LABEL"},
                    success:function(res){
                        if (res.code === '0000') {
                            let list = res.data
                            let html = ''
                            for (let i = 0; i < list.length; ++i) {
                                let one = list[i]
                                html += `<input type="checkbox" name="label" value="`+ one.name +`" title="`+ one.name +`" lay-skin="primary" >`
                            }
                            $('#FBAhistory_setLogisticLabelContains').html(html)
                            form.render('checkbox','FBAhistory_setLogisticLabelForm')
                        }
                    }
                })
            }
            ,yes : function () {
                let formData = serializeObject($('#FBAhistory_setLogisticLabelForm'))
                let labelList = formData.label ? formData.label.split(',') : []
                let Adata = {
                    idList: idList,
                    labelList: labelList,
                    labelType: 3
                }
                oneAjax.post({
                    url: ctx + '/fbaHistoryProduct/updateLabel',
                    data: Adata,
                    success: function (res) {
                        if (res.code === '0000') {
                            // refreshTable()
                            layer.close(layerPopId)
                            layer.msg(res.msg || '操作成功', {icon: 1})
                        }
                    }
                })
            }
        })
    })


    // 批量改价
    $('#FBAhistory_adjustPrice').click(function () {
        // 获取选中的产品
        let data = table.checkStatus('FBAhistory_Table').data;
        if (!data || data.length === 0) {
            layer.msg('请选择要改价的产品')
            return
        }
        for (let i = 0; i < data.length; ++i) {
            data[i].platCommission = 0.15
            data[i].packCost = 0.3
        }
        let intervalArr = []
        let popIndex = layer.open({
            type: 1,
            title: '批量改价',
            area: ['95%', '95%'],
            content: $('#FBAhistory_adjustPriceProcess').html(),
            btn: ['关闭'],
            success: function (index, layero) {
                form.render();
                form.render('select','FBAhistory_batchModify_batchSetForm2')
                laydate.render({
                    elem: '#price_time',
                    type: 'datetime',
                    inputAuto: true,
                    range: true
                });
                $('#FBAhistory_modifyPriceNum').text(data.length)
                FBAhistory_renderBatchModifyPriceTable(data)
                // 第一行一键应用
                $('#FBAhistory_batchModifyPrice_batchSetBtn1').click(function () {
                    var selectedTr = table.checkStatus('FBAhistory_ModifyPriceTable').data;
                    if (selectedTr.length === 0) {
                        layer.msg('请选择要一键应用的行')
                        return
                    }
                    let formData = serializeObject($('#FBAhistory_batchModify_batchSetForm1'))
                    let formData2 = serializeObject($('#FBAhistory_batchModify_batchSetForm2'))
                    if (formData2.newPriceInput && !isMoney(formData2.newPriceInput)) {
                        layer.msg('请填写正确的目标刊登价')
                        return
                    }
                    let selectedIdMap = {}
                    for (let i = 0; i < selectedTr.length; ++i) {
                        selectedIdMap[selectedTr[i].id] = 1
                    }
                    let tableData = layui.table.cache["FBAhistory_ModifyPriceTable"]
                    // 修改其他参数
                    for (let key in formData) {
                        if (!formData[key]) {
                            continue
                        }
                        for (i = 0; i < tableData.length; ++i) {
                            if (selectedIdMap[tableData[i].id]) {
                                tableData[i][key] = formData[key]
                            }
                        }
                    }

                    // 修改目标价
                    if (formData2.newPriceInput) {
                        switch (formData2.calculateType) {
                            case '1' :
                                for (i = 0; i < tableData.length; ++i) {
                                    if (selectedIdMap[tableData[i].id]) {
                                        tableData[i].newPrice = caculatePrice(accAdd(tableData[i].listingPrice || 0,formData2.newPriceInput), tableData[i].salesSite || '')
                                    }
                                }
                                break
                            case '2' :
                                for (i = 0; i < tableData.length; ++i) {
                                    if (selectedIdMap[tableData[i].id]) {
                                        tableData[i].newPrice = caculatePrice(accSub(tableData[i].listingPrice || 0,formData2.newPriceInput), tableData[i].salesSite || '')
                                    }
                                }
                                break
                            case '3' :
                                for (i = 0; i < tableData.length; ++i) {
                                    if (selectedIdMap[tableData[i].id]) {
                                        tableData[i].newPrice = caculatePrice(accMul(tableData[i].listingPrice || 0,formData2.newPriceInput), tableData[i].salesSite || '')
                                    }
                                }
                                break
                            case '4' :
                                for (i = 0; i < tableData.length; ++i) {
                                    if (selectedIdMap[tableData[i].id]) {
                                        tableData[i].newPrice = caculatePrice(formData2.newPriceInput, tableData[i].salesSite || '')
                                    }
                                }
                                break
                        }
                    }
                    FBAhistory_renderBatchModifyPriceTable(tableData)
                })
                // 计算目标刊登价
                $('#FBAhistory_batchModifyPrice_calNewPrice').click(function () {
                    var selectedTr = table.checkStatus('FBAhistory_ModifyPriceTable').data;
                    if (selectedTr.length === 0) {
                        layer.msg('请选择要一键应用的行')
                        return
                    }
                    let selectedIdMap = {}
                    for (let i = 0; i < selectedTr.length; ++i) {
                        selectedIdMap[selectedTr[i].id] = 1
                    }
                    let tableData = layui.table.cache["FBAhistory_ModifyPriceTable"]

                    for (let i = 0; i < tableData.length; ++i) {
                        if (selectedIdMap[tableData[i].id]) {
                            if (!tableData[i].oaCost) {
                                layer.msg(tableData[i].sellerSku + '无商品成本')
                                return
                            }
                            if (!isMoney(tableData[i].headFreight)) {
                                layer.msg(tableData[i].sellerSku + '无头程运费')
                                return
                            }
                            if (!isMoney(tableData[i].shippingPrice)) {
                                layer.msg(tableData[i].sellerSku + '无FBA派送费')
                                return
                            }
                            if (!tableData[i].newProfitRate) {
                                layer.msg(tableData[i].sellerSku + '无目标毛利率')
                                return
                            }

                            // tableData[i].newPrice = accDiv(accAdd(accDiv(accAdd(accAdd(tableData[i].oaCost,tableData[i].packCost),tableData[i].headFreight)
                            //     ,tableData[i].currencyExchange),tableData[i].shippingPrice)
                            //     ,accSub(accSub(accSub(1,tableData[i].platCommission),tableData[i].newProfitRate),tableData[i].siteTaxRate)).toFixed(2)
                            // tableData[i].newPrice = caculatePrice(tableData[i].newPrice, tableData[i].salesSite)
                        }
                    }
                    let newData = [];
                    tableData.forEach(item => {
                        if(item.LAY_CHECKED == true){
                            item['targetGrossRate'] = item.newProfitRate; // 目标毛利率
                            // item['targetPrice'] = item.newPrice; // 目标刊登价格
                            item['productCost'] = item.oaCost; // 商品成本
                            item['fbaCharge'] = item.shippingPrice; // fba派送费
                            // item['userInputCommisionRate'] = ''; // 目前仅仅是预估定价弹窗 用户自己输入的平台佣金费率
                            // item['userInputTaxRate'] = ''; // 用户指定的站点税率 预估定价弹窗
                            // item['userInputExchangeRate'] = ''; // 用户指定的站点汇率 预估定价弹窗
                            delete item.targetPrice
                            newData.push(item)
                        }
                    })
                    commonReturnPromise({
                        url: "/lms/fbaPricing/calculateTargetPriceOrGrossRate",
                        contentType: "application/json",
                        type: "post",
                        params: JSON.stringify(newData),
                    }).then((res) => {
                        if(res && res.length != 0){
                            tableData.forEach(i => {
                                res.forEach(j => {
                                    if(i.id == j.id){
                                        i['newPrice'] = j.targetListingPrice
                                        i['platCommission'] = j.commisionRate;
                                    }
                                })
                            })
                        }
                        FBAhistory_renderBatchModifyPriceTable(tableData)
                    })
                })

                // 计算目标毛利率
                $('#FBAhistory_batchModifyPrice_calNewProfitRate').click(function () {
                    var selectedTr = table.checkStatus('FBAhistory_ModifyPriceTable').data;
                    if (selectedTr.length === 0) {
                        layer.msg('请选择要一键应用的行')
                        return
                    }
                    let selectedIdMap = {}
                    for (let i = 0; i < selectedTr.length; ++i) {
                        selectedIdMap[selectedTr[i].id] = 1
                    }
                    let tableData = layui.table.cache["FBAhistory_ModifyPriceTable"]

                    for (let i = 0; i < tableData.length; ++i) {
                        if (selectedIdMap[tableData[i].id]) {
                            if (!tableData[i].oaCost) {
                                layer.msg(tableData[i].sellerSku + '无商品成本')
                                return
                            }
                            if (!isMoney(tableData[i].headFreight)) {
                                layer.msg(tableData[i].sellerSku + '无头程运费')
                                return
                            }
                            if (!isMoney(tableData[i].shippingPrice)) {
                                layer.msg(tableData[i].sellerSku + '无FBA派送费')
                                return
                            }
                            if (!tableData[i].newPrice) {
                                layer.msg(tableData[i].sellerSku + '无目标刊登价')
                                return
                            }
                            // tableData[i].newProfitRate = accSub(accSub(accSub(1,tableData[i].platCommission),tableData[i].siteTaxRate),
                            //     accDiv(accAdd(accDiv(accAdd(accAdd(tableData[i].oaCost,tableData[i].packCost),tableData[i].headFreight)
                            //         ,tableData[i].currencyExchange),tableData[i].shippingPrice),tableData[i].newPrice)
                            // ).toFixed(2)
                        }
                    }
                    let newData = [];
                    tableData.forEach(item => {
                        if(item.LAY_CHECKED == true){
                            // item['targetGrossRate'] = item.newProfitRate; // 目标毛利率
                            item['targetPrice'] = item.newPrice; // 目标刊登价格
                            item['productCost'] = item.oaCost; // 商品成本
                            item['fbaCharge'] = item.shippingPrice; // fba派送费
                            // item['userInputCommisionRate'] = ''; // 目前仅仅是预估定价弹窗 用户自己输入的平台佣金费率
                            // item['userInputTaxRate'] = ''; // 用户指定的站点税率 预估定价弹窗
                            // item['userInputExchangeRate'] = ''; // 用户指定的站点汇率 预估定价弹窗
                            delete item.targetGrossRate
                            newData.push(item)
                        }
                    })
                    commonReturnPromise({
                        url: "/lms/fbaPricing/calculateTargetPriceOrGrossRate",
                        contentType: "application/json",
                        type: "post",
                        params: JSON.stringify(newData),
                    }).then((res) => {
                        if(res && res.length != 0){
                            tableData.forEach(i => {
                                res.forEach(j => {
                                    if(i.id == j.id){
                                        i['newProfitRate'] = j.targetGrossRate;
                                        i['platCommission'] = j.commisionRate;
                                    }
                                })
                            })
                        }
                        FBAhistory_renderBatchModifyPriceTable(tableData)
                    })
                })
                // 批量改价
                $('#FBAhistory_batchModifyPrice_submit').click(function () {
                    var selectedTr = table.checkStatus('FBAhistory_ModifyPriceTable').data;
                    if (selectedTr.length === 0) {
                        layer.msg('请选择要一键应用的行')
                        return
                    }
                    let dataList = []
                    let selectedIdMap = {}
                    for (let i = 0; i < selectedTr.length; ++i) {
                        if (!isMoney(selectedTr[i].newPrice)) {
                            layer.msg("请填写正确的目标刊登价")
                            return false
                        }
                        let one = {
                            id: selectedTr[i].id,
                            storeAcctId: selectedTr[i].storeAcctId,
                            sellerSku: selectedTr[i].sellerSku,
                            newPrice: selectedTr[i].newPrice
                        }
                        dataList.push(one);
                        selectedIdMap[selectedTr[i].id] = 1
                    }
                    // 设置循环器。 获取改价结果
                    function fbaHistory_setIntervalToGetModifyPriceResult(batchNo) {
                        if (!batchNo) {
                            return
                        }
                        let time = 0; // 查询次数
                        let maxQuery = 50; // 最大查询次数
                        let tableData = layui.table.cache["FBAhistory_ModifyPriceTable"]
                        for (let i = 0; i < tableData.length; ++i) {
                            if (selectedIdMap[tableData[i].id]) {
                                tableData[i].result = '正在执行'
                            }
                        }
                        FBAhistory_renderBatchModifyPriceTable(tableData)

                        let intervalId = window.setInterval(function () {
                            time++
                            if (time >= maxQuery) {
                                window.clearInterval(intervalId)
                            }
                            $.ajax({
                                type: "POST",
                                url: ctx + '/amazonFbaInventory/getModifyPriceResult.html',
                                data: {batchNo: batchNo},
                                contentType: 'application/x-www-form-urlencoded;charset=utf-8;',
                                dataType: "json",
                                success: function (res) {
                                    if (res.code === '0000') {
                                        let list = res.data
                                        if (list && list.length > 0) {
                                            let resJson = {}
                                            for (let i = 0; i < list.length; ++i) {
                                                resJson[list[i].storeAcctId + '_' + list[i].variId + '_' + list[i].storeSSku] = list[i].operDesc
                                            }
                                            for (let i = 0; i < tableData.length; ++i) {
                                                if (resJson[tableData[i].storeAcctId + '_' + tableData[i].salesSite + '_' + tableData[i].sellerSku]) {
                                                    tableData[i].result = resJson[tableData[i].storeAcctId + '_' + tableData[i].salesSite + '_' + tableData[i].sellerSku]
                                                }
                                            }
                                            FBAhistory_renderBatchModifyPriceTable(tableData)
                                        }
                                        // 如果返回结果数等于本次调价数量。 则终止查询
                                        if (list.length === selectedTr.length) {
                                            window.clearInterval(intervalId)
                                        }
                                    } else {
                                        layer.msg('查询执行结果失败：' + res.msg)
                                        window.clearInterval(intervalId)
                                    }
                                }
                            })
                        }, 5000)
                        intervalArr.push(intervalId)
                    }
                    fbaHistory_adjustPrice(dataList,fbaHistory_setIntervalToGetModifyPriceResult);
                })
            },
            end: function () {
                for (let i = 0; i < intervalArr.length; ++i) {
                    window.clearInterval(intervalArr[i])
                }
            }
        })
    })

    function caculatePrice(val, salesSite) {
        let price;
        // 美国站点不低于5.99
        if (val <= 5.99 && salesSite === 'US') {
            return 5.99
        }
        // 如果val小于0.3，则价格不变
        if (val < 0.3) {
            price = val;
        } else {
            // 获取val的小数点后2位数值
            const decimal = Math.round((val - Math.floor(val)) * 100);

            // 判断val属于哪个区间，并计算相应的价格
            if (decimal >= 0 && decimal < 30) {
            price = Math.floor(val) - 1 + 0.99;
            } else if (decimal >= 30 && decimal < 70) {
            price = Math.floor(val) + 0.49;
            } else if (decimal >= 70 && decimal <= 99) {
            price = Math.floor(val) + 0.99;
            }
        }
        return price;
    }


    function FBAhistory_renderBatchModifyPriceTable(data) {
        let tableIns = table.render({
            elem: '#FBAhistory_ModifyPriceTable',
            data: data,
            limit: data.length,
            cols: [[
                { checkbox: true, width: 30 },
                { field: 'storeAcct', title: "店铺",  sort: true,width: 70},
                { field: 'salesSite', title: "站点", sort: true,width: 65},
                { field: 'asin', title: "ASIN", sort: true,width: 100},
                { field: 'sellerSku',title: "店铺SKU",width: 100 },
                { field: 'fbaAvailableQuality', title: "可售库存", sort: true,width: 50},
                { field: 'dailySales', title: "日均销量", sort: true,width: 50},
                { field: "platCommission", title: '平台佣金费率',width: 50 },
                { field: "currencyExchange", title: '站点汇率',width: 50  },
                { field: "siteTaxRate", title: '站点税率',width: 50},
                { field: "oaCost", title: '<div title="点击可修改">商品成本(¥)<i class="layui-icon layui-icon-edit" style="color: #009688;cursor: pointer;">&#xe642;</i></div>', edit: 'text',style:"background-color: #7FFFD4;"  },
                { field: "packCost", title: '包装成本(¥)',width: 50  },
                { field: "headFreight", title: '<div title="点击可修改">头程运费(¥)<i class="layui-icon layui-icon-edit" style="color: #009688;cursor: pointer;">&#xe642;</i></div>', edit: 'text',style:"background-color: #7FFFD4;"  },
                { field: "shippingPrice", title: '<div title="点击可修改">FBA派送费<i class="layui-icon layui-icon-edit" style="color: #009688;cursor: pointer;">&#xe642;</i></div>', edit: 'text',style:"background-color: #7FFFD4;"  },
                { field: 'profitRate', title: "当前毛利率" },
                { field: 'listingPrice', title: "当前刊登价" },
                { field: 'promotionPrice', title: "当前促销价" },
                { field: "newProfitRate", title: '<div title="点击可修改">目标毛利率<i class="layui-icon layui-icon-edit" style="color: #009688;cursor: pointer;">&#xe642;</i></div>', edit: 'text',style:"background-color: #7FFFD4;"  },
                { field: "newPrice", title: '<div title="点击可修改">目标价格<i class="layui-icon layui-icon-edit" style="color: #009688;cursor: pointer;">&#xe642;</i></div>', edit: 'text',style:"background-color: #7FFFD4;"  },
                { field: 'result', title: '操作结果',templet: '#FBAhistory_batchModifyPrice_resultTpl'  }
            ]],
            done: function () {
                // 监听选中多少行
                table.on('checkbox(FBAhistory_ModifyPriceTable)', function(obj){
                    $('#FBAhistory_modifyPriceSelectedNum').text(table.checkStatus('FBAhistory_ModifyPriceTable').data.length)
                });

            }
        })
    }

    /**
     * 对数字进行四舍五入
     * @param num
     * @param round
     */
    function tofixed(num, round) {
        if (!num) {
            return 0
        }
        return Math.round(num * 100) / 100
    }
});
