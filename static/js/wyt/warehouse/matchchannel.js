
layui.use(['form', 'admin', 'table', 'layer', 'element', 'laypage', 'laydate', 'formSelects'], function() {
    let form = layui.form,
        table = layui.table,
        element = layui.element,
        laydate = layui.laydate,
        formSelects = layui.formSelects,
        layer = layui.layer;

    form.render('select');
    laydate.render({
        elem: '#matchchannel_time',
        type: 'date',
        range: true
    });

    // 查询
    $("#matchchannel_searchBtn").click(function () {
        let data = serializeObject($('#matchchannelForm'));
        data.orderBy = 't1.id desc';
        matchchannelTableorder(data)
    });

    //渲染表格数据
    function matchchannelTableorder(data) {
        if (!data.sku || !data.sku.trim()) {
            layer.msg('请输入sku')
        }
        table.render({
            elem: '#matchchannel_table',
            method: 'POST',
            url: ctx + '/winitMatchChannel/searchMatchAblePlan.html',
            where: data,
            cols: [
                [
                    {type: "checkbox", width: 30 },
                    {title: "单号", field: 'planNo'},
                    {title: "图片", templet: "#matchchannel_tab_image"},
                    {title: "注册sku", field: "registerSku"},
                    // {title: "商品sku", field: "sSku"},
                    {title: "包装规格", templet: '<div>{{ d.prodSInfo.winitPackSpec || ""}}</div>'},
                    {title: "单位", templet: '<div>{{ d.prodSInfo.unit || ""}}</div>'},
                    {title: "库位", templet: '<div>{{ d.whWarehouseProdLocation? d.whWarehouseProdLocation.locationCode : ""}}</div>'},
                    // {title: "计划数量", field: "planAmount",width: 80},
                    {title: "英国信件", templet: "#matchchannel_UKLetterBox"},
                    {title: "德国信件", templet: "#matchchannel_DELetterBox"},
                    {title: "收货仓库", field: "storeName"},
                    {title: "头程渠道", field: "saleLogisticsType"},
                    {title: "数量", templet: '#matchchannel_numberBox'},
                    // {title: "待配货数量", templet: '<div>{{ d.planAmount - d.actAmount}}</div>'},
                    // {title: "可用数量", templet: '<div>{{ d.whStock.currentStock - d.whStock.reservationStock}}</div>'},
                    {title: "本次配货数量(点击可编辑)", field: "currentAmount", edit:'text', style:"background-color: #7FFFD4;"},
                    {title: "是否组合品", templet: '#matchchannel_tab_isCombinationBox',width: 80},
                    {title: "组合品明细", templet: '#matchchannel_tab_combDetail',width: 80},
                    {title: '操作', toolbar: "#matchchannel_tab_toolBar", width: 100 }
                ]
            ],
            page: true,
            limit: 50,
            limits: [50, 100, 500],
            id: 'matchchannel_table',
            created: function (res) {
                if (res.code === '0000') {
                    let list = res.data
                    for (let i = 0; i < list.length; ++i) {
                        list[i].currentAmount = (list[i].planAmount - list[i].actAmount) > (list[i].whStock.currentStock - list[i].whStock.reservationStock)
                            ? (list[i].whStock.currentStock - list[i].whStock.reservationStock) : (list[i].planAmount - list[i].actAmount)
                    }
                } else if (res.code === 'singleComb') {
                    // 弹窗生产 单品组合品
                    layer.open({
                        type: 1,
                        title: '单品组合品生产',
                        area: ['90%', '90%'],
                        btn: ['关闭'],
                        content: $('#matchchannel_makeSingleCombPop').html(),
                        success: function(layero, index){
                            layer.msg('检测到可生产单品组合品')
                            let col = [
                                [
                                    {title: "商品SKU", field: 'sSku',rowspan:2},
                                    {title: "仓库", field: 'storeName',rowspan:2},
                                    {title: "可用数量", field: 'availableAmount',rowspan:2},
                                    {title: "需要发货数量", field: 'needAmount',rowspan:2},
                                    {title: "包装规格", field: 'winitPackSpec',rowspan:2},
                                    {title: "组合品明细", colspan: 5},
                                    {title: "加工数量(点击可编辑)", field: "makeAmount",edit: 'text',style:"background-color: #7FFFD4;",rowspan: 2},
                                    { title: "操作", align: "center", toolbar: "#matchchannel_makeComb_TableBar",rowspan: 2},
                                ],
                                [
                                    {title: "基础商品sku", templet: '#matchchannel_makeComb_combDetail_sku'},
                                    {title: "单位", templet: '#matchchannel_makeComb_combDetail_unit'},
                                    {title: "组合数量", templet: '#matchchannel_makeComb_combDetail_num'},
                                    {title: "基础商品库位", templet: '#matchchannel_makeComb_combDetail_locationCode'},
                                    {title: "商品可用数量", templet: '#matchchannel_makeComb_combDetail_availableAmount'},
                                ]
                            ]
                            let data = {
                                processStatus: 1,
                                searchType: 'combSku2',
                                searchValue: res.msg
                            }
                            table.render({
                                elem: '#matchchannel_makeCombTable',
                                method: 'POST',
                                url: ctx + '/winitPlanCombMake/queryPage.html',
                                where: data,
                                cols: col,
                                page: true,
                                limit: 50,
                                limits: [50, 100, 500],
                                id: 'matchchannel_makeCombTable',
                                created: function (res) {
                                    if (res.code === '0000') {
                                        let list = res.data
                                        let makeAmount
                                        for (let i = 0; i < list.length; ++i) {
                                            let min
                                            let combList = list[i].combDetailDtoList
                                            for (let j = 0; j < combList.length; ++j) {
                                                makeAmount = Math.floor(((combList[j].whStock.currentStock || 0) - (combList[j].whStock.reservationStock || 0)) / combList[j].prodDetailNums)
                                                if (!min || min > makeAmount) {
                                                    min = makeAmount
                                                }
                                            }
                                            list[i].maxMakeAmount = min // 记录最大可生产数
                                            // 设置加工数量
                                            list[i].makeAmount = list[i].needAmount - list[i].availableAmount > min ? min : list[i].needAmount - list[i].availableAmount
                                        }
                                    }
                                },
                                done: function (res) {
                                    imageLazyload();
                                }
                            })
                        }
                    })
                } else {
                    layer.msg(res.msg)
                }
            },
            done: function () {
                imageLazyload();
                // 监听表格点击事件
                table.on('tool(matchchannel_makeCombTable)', function(obj) {
                    let data = obj.data;
                    if (obj.event === "make") {
                        if (data.makeAmount === 0 || data.makeAmount === '0') {
                            layer.msg('本次配货数量必须是正整数')
                            return
                        }
                        if (!data.makeAmount) {
                            layer.msg('请填写本次配货数量')
                            return
                        }
                        if (!isInteger(data.makeAmount)) {
                            layer.msg('本次配货数量必须是正整数')
                            return
                        }
                        data.makeAmount = parseInt(data.makeAmount)
                        if (data.makeAmount > data.maxMakeAmount) {
                            layer.msg('根据库存计算，最大可生产数量为' + data.maxMakeAmount)
                            return
                        }


                        let popIndex = layer.confirm('确认生产？',{btn: ['确认','取消']},function () {
                            let Adata = {
                                prodSId : data.prodSId,
                                makeAmount: data.makeAmount
                            }
                            let ajax = new Ajax(true);
                            ajax.post({
                                url: ctx + "/winitPlanCombMake/makeComb.html",
                                data: JSON.stringify(Adata),
                                contentType: 'application/json',
                                success: function (res) {
                                    if (res.code === '0000') {
                                        let combDetail = ''
                                        for (let i = 0; i < data.combDetailDtoList.length; ++i) {
                                            combDetail += data.combDetailDtoList[i].sSku + '*' + data.combDetailDtoList[i].prodDetailNums + ';'
                                        }
                                        // 打印组合品标签
                                        let time = Format(new Date(),'yyyy-MM-dd')
                                        printStandard({
                                            jspaper: 'combDetail6040.jasper',
                                            printDetailDtoList:[{
                                                titleMap : {
                                                    "prodSSku" : res.data.sSku,
                                                    "prodName" : res.data.title,
                                                    "inPackType" : res.data.inPackType || '',
                                                    "develop" : res.data.parent.bizzOwner,
                                                    "combDetail" : combDetail,
                                                    "time" : time,
                                                }, // 要打印的参数 - 要和所设计的面单参数 一样
                                                amount: 3 // 需要打印的份数, 不填默认为1
                                            }]
                                        })
                                        // 重载表格
                                        table.reload('matchchannel_makeCombTable')
                                    }
                                }
                            })
                            layer.close(popIndex)
                        })
                    }
                });
            }
        })
    }
    $('#LAY-matchchannel').on('focus','.layui-table-edit',function (even) {
        console.log(even)
        even.target.select()
    })

    // 监听表格点击事件
    table.on('tool(matchchannel_table)', function(obj) {
        let data = obj.data;
        if (obj.event === "matchAndPrint") {
            if (data.currentAmount === 0 || data.currentAmount === '0') {
                layer.msg('本次配货数量必须是正整数')
                return
            }
            if (!data.currentAmount) {
                layer.msg('请填写本次配货数量')
                return
            }
            if (!isInteger(data.currentAmount)) {
                layer.msg('本次配货数量必须是正整数')
                return
            }
            data.currentAmount = parseInt(data.currentAmount)
            if (data.currentAmount > data.whStock.currentStock - data.whStock.reservationStock) {
                layer.msg('配货数量不可大于可用数量')
                return
            }
            // 业务要求改回  2020-08-15
            // if (data.currentAmount < Math.min(data.whStock.currentStock - data.whStock.reservationStock,data.planAmount - data.actAmount)) {
            //     layer.msg('配货数量不可小于(可用数，待配货数中较小)的数值')
            //     return
            // }
            let popIndex = layer.confirm('确认分配？',{btn: ['确认','取消']},function () {
                let Adata = {
                    id : data.id,
                    actAmount: data.currentAmount
                }
                let ajax = new Ajax(true);
                ajax.post({
                    url: ctx + "/winitMatchChannel/matchChannel.html",
                    data: JSON.stringify(Adata),
                    contentType: 'application/json',
                    success: function (res) {
                        if (res.code === '0000') {
                            // 判断是否信件
                            let letterTag = ''
                            if (data.channel === 'ebay英国') {
                                letterTag = isUKLetter(data.prodSInfo.winitLength,data.prodSInfo.winitWidth, data.prodSInfo.winitHeight,data.prodSInfo.suttleWeight, data.prodSInfo.packWeight) ? '(信件)' : ''
                            } else if (data.channel === 'ebay德国') {
                                letterTag = isDELetter(data.prodSInfo.winitLength,data.prodSInfo.winitWidth, data.prodSInfo.winitHeight,data.prodSInfo.suttleWeight, data.prodSInfo.packWeight) ? '(信件)' : ''
                            }
                            let deliverPrint = {
                                jspaper: 'winitMatch.jasper',
                                printDetailDtoList: [{
                                    titleMap: {
                                        deliverId: res.data.id,
                                        amount: res.data.amount  + letterTag,
                                        sku: data.registerSku + (data.prodSInfo.isCombination ? '(组合)' : ''),
                                        firstWayCompany: data.saleLogisticsType,
                                        storeName: data.storeName,
                                    }
                                }]
                            }
                            // 打印配货面单
                            printStandard(deliverPrint)
                            console.log('配货单id：' + res.data.id)
                            let ajax2 = new Ajax(false);
                            ajax2.post({
                                url: ctx + "/winitMatchChannel/queryDeliverDetail.html",
                                data: res.data.id + '',
                                contentType: 'application/json',
                                success: function (res2) {
                                    if (res2.code === '0000') {
                                        switch (res2.data.serviceType){
                                            case 1:
                                                // 打印万邑通商品条码
                                                printWinitProd([{registerSku: res2.data.registerSku,actAmount: data.currentAmount}])
                                                break
                                            case 2:
                                                printGoodcangProd({registerSku: res2.data.registerSku,actAmount: data.currentAmount})
                                                break
                                            case 3:
                                                printDsfProd({registerSku: res2.data.winitCode,actAmount: data.currentAmount})
                                                break
                                        }
                                    }
                                }
                            })


                            // switch (data.serviceType){
                            //     case 1:
                            //         // 打印万邑通商品条码
                            //         printWinitProd([{registerSku: data.registerSku,actAmount: data.currentAmount}])
                            //         break
                            //     case 2:
                            //         printGoodcangProd({registerSku: data.registerSku,actAmount: data.currentAmount})
                            //         break
                            //     case 3:
                            //         printDsfProd({registerSku: data.winitCode,actAmount: data.currentAmount})
                            //         break
                            // }
                             // 重载表格
                            table.reload('matchchannel_table')
                            //  光标聚焦
                            $('#matchchannelForm').find('[name=sku]').val('')
                            $('#matchchannelForm').find('[name=sku]').focus()
                        }
                    }
                })
                layer.close(popIndex)
            })
        }
    });
    
    // 可分配商品查询
    $('#matchchannel_queryMatchAbleProd').click(function () {
        layer.open({
            type: 1,
            title: '可分配商品查询',
            area: ['1000px', '850px'],
            btn: ['关闭'],
            content: $('#matchchannel_matchAbleSearchPop').html(),
            success: function(layero, index){
                matchchannel_queryMatchAbleProd()
                $('#matchchannel_matchAblePrintBtn').click(function () {
                    let data = table.checkStatus('matchAbleSearchTable').data
                    if (!data || data.length === 0) {
                        layer.msg('请选择要打印的数据')
                        return
                    }
                    let title = '万邑通-可配货商品'

                    let tableColNameArr = [
                        {title: "商品sku", field: "sSku", totalRowText: '合计'},
                        {title: "库位", field: 'locationCode'},
                        {title: "可用数量", field: 'availabelStock'},
                        {title: "待配货数量", field: "planAmount"},
                        {title: "商品重量(kg)", field: "totalWeight",totalRow: true}
                    ]
                    openPrintTab(title,tableColNameArr,data)
                })
            }
        })
    })
    function matchchannel_queryMatchAbleProd() {

        table.render({
            elem: '#matchAbleSearchTable',
            method: 'POST',
            url: ctx + '/winitMatchChannel/searchMatchAbleProd.html',
            where: {orderBy: '(t5.current_stock - t5.reservation_stock) desc'},
            height: 'full-300',
            totalRow: true,
            cols: [
                [
                    {type: "checkbox", width: 30 },
                    {title: "商品sku", field: "sSku", totalRowText: '合计'},
                    {title: "库位", field: 'locationCode'},
                    {title: "可用数量", field: 'availabelStock'},
                    {title: "待配货数量", field: "planAmount"},
                    {title: "商品重量(kg)", field: "totalWeight",totalRow: true}
                ]
            ],
            page: false,
            limit: 1000,
            id: 'matchAbleSearchTable',
            created:function (res) {
                console.log(res)
                if (res.code !== '0000') {
                    return
                }
                let list = res.data
                for (let i = 0; i < list.length; ++i) {
                    let d = list[i]
                    d.locationCode = d.whWarehouseProdLocation ? d.whWarehouseProdLocation.locationCode : ""
                    d.availabelStock = d.whStock.currentStock - d.whStock.reservationStock
                    d.totalWeight = accDiv(accMul(d.planAmount,accAdd(d.prodSInfo.suttleWeight,d.prodSInfo.packWeight)),1000)
                }
            },
            done: function (res) {
                $('#matchchannel_matchAbleSearchTotal').text(res.count)
                // 计算总重量 并显示到统计栏
            }
        })
    }

    // 补打配货标签
    $('#matchchannel_printDeliverDetailBtn').click(function () {
        let id = $('#matchchannel_printDeliverDetail').val()
        if (!id) {
            layer.msg('请填写要补打的配货明细单id')
            return
        }
        printDeliverDetail(id)
    })

    // 补打商品标签
    $('#matchchannel_printBtn').click(function () {
        let id = $('#matchchannel_printDeliverDetail').val()
        if (!id) {
            layer.msg('请填写要补打的配货明细单id')
            return
        }

        let amt = $('#matchchannel_printAmount').val()
        if (!amt || amt === '0' || !isInteger(amt)) {
            layer.msg('补打商品标签数量需为正整数')
            return
        }

        let ajax = new Ajax(false);
        ajax.post({
            url: ctx + "/winitMatchChannel/queryDeliverDetail.html",
            data: id,
            contentType: 'application/json',
            success: function (res) {
                if (res.code === '0000') {
                    switch (res.data.serviceType){
                        case 1:
                            // 打印万邑通商品条码
                            printWinitProd([{registerSku: res.data.registerSku,actAmount: amt}])
                            break
                        case 2:
                            printGoodcangProd({registerSku: res.data.registerSku,actAmount: amt})
                            break
                        case 3:
                            printDsfProd({registerSku: res.data.winitCode,actAmount: amt})
                            break
                    }
                }
            }
        })
    })

});
