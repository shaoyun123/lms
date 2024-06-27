// console.log("FbaGoodsMatch");
//结构
//初始化和数据结构定义
//click事件定义
//表单事件最后
//无业务意义的方法
layui.use(['admin', 'form', 'table', 'layer', 'layedit', 'element', 'laypage', 'upload', 'laydate'], function () {
    var form = layui.form,
        table = layui.table,
        laypage = layui.laypage,
        layer = layui.layer,
        upload = layui.upload;
    laydate = layui.laydate;
    form.render('checkbox');
    form.render('radio');

    // 表格列信息
    var tablecol = {
        'FbaGoodsMatch_table': [
            [ //FBA
                {title: "编号", field: "shipBoxCode",templet:`
                    <div>
                    <div class="alignLeft">
                        <div>仓箱:{{d.shipBoxCode || ''}}</div>
                        <div>篮子:{{d.boxCode || ''}}</div>
                        <div>货件:
                            {{# if(d.shipmentId){ }}
                                {{ d.shipmentId }}<br>
                                {{ d.storeAcct }}--{{ d.salesSite }}
                            {{# } }}
                        </div>
                    </div>
                    </div>
                `,width:180,rowspan:2},
                {title: "SKU图片", field: "psiImage",width:70,templet:"#FbaGoodsMatch_psiImage_tpl",rowspan:2},
                {title: "SKU/ASIN", field: "prodSSku",width:180,templet:`
                    <div>
                    <div class="alignLeft">
                        <div>商品:{{d.prodSInfoDto.sSku || ''}}</div>
                        <div>店铺:{{d.sellerSku || ''}}</div>
                        <div>ASIN:{{d.asin || ''}}</div>
                        <div>FNSKU:{{d.fnSku || ''}}</div>
                    </div>
                    </div>
                `,rowspan:2},
                // {title: "刊登图片", field: "image",width:70,templet:"#FbaGoodsMatch_image_tpl",rowspan:2},
                {title: "是否配货", field: "ifMatch",templet:"<div>{{d.ifMatch ? '是' : '否'}}</div>",width:70,rowspan:2},
                {title: "包装备注", field: "packDesc",rowspan:2},
                {title: "包装规格", field: "packType",templet:"#FbaGoodsMatch_packType_tpl",rowspan:2},
                {title: "小号产品", field: "isSmallSize",templet:"#FbaGoodsMatch_ifSmallSize_tpl",width:30,rowspan:2},
                {title: "组合品", field: "combBool",templet:"#FbaGoodsMatch_combBool_tpl",width:50,rowspan:2},
                {title: "组合品详情",colspan:5},
                // {title: "下步处理动作", field: "shipCreateTime",width:100,templet:"#FbaGoodsMatch_nextStep_tpl"}
                {title: "计划发货数量", field: "planQuality",width:50,rowspan:2},
                {title: "剩余可用",field: "remainAbleStock",width:50,rowspan:2},
                {title: "配货数量(点击可编辑)",field: "actQuality",width:80, edit: 'text', style:"background-color: #7FFFD4;",rowspan:2},
                {title: '操作', field: "", toolbar: "#FbaGoodsMatch_nextStep_opt_tpl",rowspan:2},
            ],
            [
                {title: "图片", templet: '#fbaGoodsMatch_combDetail_image',width:70},
                {title: "商品sku", templet: '#fbaGoodsMatch_combDetail_sku'},
                {title: "库位", templet: '#fbaGoodsMatch_combDetail_locationCode'},
                {title: "组合数", templet: '#fbaGoodsMatch_combDetail_num',width:50},
                {title: "总数量", templet: '#fbaGoodsMatch_combDetail_totalNum',width:50},
            ]
        ],
        'FbaGoodsMatch_canMatch_search_table': [
            [ //FBA
                {checkbox:true,width:30},
                {title: "商品子sku", field: "prodSSku",templet: function (res) {
                    return `<div>`+ res.prodSInfoDto.sSku + `</div>`
                }},
                {title: "配货状态", field: "matchStatus", templet: '#fbaGoodsMatch_matchStatus', sort: true, filter: true},
                {title: "可配数量", field: "planQuality"},
                {title: "剩余可用", field: "remainAbleStock"},
                {title: "库位", field: "locationCode", sort: true},
                {title: "货件号", field: "shipmentId"},
                {title: "最后入库时间", field: "lastPurTime",sort: true,templet: '<div>{{d.lastPurTime ? Format(d.lastPurTime, "yyyy-MM-dd hh:mm:ss") : ""}}</div>'},
                {title: "最后入库数量", field: "lastPurAmount"}
            ]
        ],
        'FbaGoodsMatch_canPut_search_table': [
            [ //FBA
                {checkbox:true,width:30},
                {title: "货品SKU", field: "fnSku"},
                {title: "商品SKU", field: "prodSSku"},
                {title: "库位", field: "locationCode", sort: true},
                {title: "数量", field: "planQuality"},
                {title: "箱号", field: "shipBoxCode"},
                {title: "货件号", field: "shipmentId"},
                {title: "配货人", field: "matcher"},
                {title: "配货时间", field: "matchTime"},
                {title: "备注(点击可修改)", field: "whRemark", edit: 'text', style:"background-color: #7FFFD4;"},
            ]
        ],
        'FbaGoodsMatch_canMatchMulti_search_table': [
            [
                {checkbox:true,rowspan:2,width:'30px'},
                {title: "组合sku", field: "prodSSku",width: 150,rowspan:2,templet: `<div>{{d.prodSInfoDto.sSku}}</div>`},
                {title: "配货状态", field: "matchStatus",rowspan:2, templet: '#fbaGoodsMatch_matchStatus', sort: true, filter: true},
                {title: "可配数量", field: "planQuality",rowspan:2,width: 80},
                {title: "剩余可用", field: "remainAbleStock",rowspan:2,width: 80},
                {title: "货件号", field: "shipmentId",width: 120,rowspan:2},
                {title: '组合品详情',field:"combDetail", colspan: 6},
            ],
            [
                {field: "combDetailSku", title: "商品sku", templet: '#fbaGoodsMatch_combDetail_sku',width:180},
                {field: "combDetailLocation", title: "库位", templet: '#fbaGoodsMatch_combDetail_locationCode',width:180},
                {field: "combDetailNum", title: "组合数", templet: '#fbaGoodsMatch_combDetail_num',width:80},
                {field: "combDetailtotalNum", title: "总数量", templet: '#fbaGoodsMatch_combDetail_totalNum',width:80},
                {field: "combDetailLastInTime", title: "最后入库时间", templet: '#fbaGoodsMatch_combDetail_lastInTime',width:180},
                {field: "combDetailLastInAmount", title: "最后入库数量", templet: '#fbaGoodsMatch_combDetail_lastInAmount',width:80},
            ]
        ]
    };

    //查询可配单品
    $('#FbaGoodsMatch_canMatch_search').click(function () {
        layer.open({
            type: 1,
            title: '可配单品',
            btn: ['关闭'],
            area: ['80%', '80%'],
            content: $('#FbaGoodsMatch_canMatch_search_tpl').html(),
            id: 'FbaGoodsMatch_canMatch_search_pop',
            success: function (index, layero) {
                // 固定表头
                $('#FbaGoodsMatch_canMatch_search_pop').scroll(function() {
                    toFixedTabHead(this)
                })
                table.render({
                    elem: '#FbaGoodsMatch_canMatch_search_table',
                    method: 'POST',
                    url: ctx + '/amazonFbaGoodsMatch/queryAllCanMatchInfoSingle.html',
                    cols: tablecol['FbaGoodsMatch_canMatch_search_table'],
                    page: false,
                    limit: Number.MAX_VALUE,
                    id: 'FbaGoodsMatch_canMatch_search_table',
                    done: function (returnData) {
                        $('#FbaGoodsMatch_canMatchNum').text(returnData.data.length)
                    },
                    initSort: {
                        field: 'matchStatus' //排序字段，对应 cols 设定的各字段名
                        ,type: 'desc' //排序方式  asc: 升序、desc: 降序、null: 默认排序
                    }
                })
                // 标记已配
                $('#FbaGoodsMatch_markMatch').click(function () {
                    let data = table.checkStatus('FbaGoodsMatch_canMatch_search_table').data
                    if (!data || data.length === 0) {
                        layer.msg('请选择要打印的数据')
                        return
                    }
                    let idList = []
                    for (let i = 0; i < data.length; ++i) {
                        idList.push(data[i].id)
                    }
                    FbaGoodsMatch_markMatch(idList)
                })

                $('#FbaGoodsMatch_canMatch_print').click(function () {
                    let data = table.checkStatus('FbaGoodsMatch_canMatch_search_table').data
                    if (!data || data.length === 0) {
                        layer.msg('请选择要打印的数据')
                        return
                    }
                    let title = '可配SKU'
                    for (let i = 0; i < data.length; ++i) {
                        data[i].prodSSku = data[i].prodSInfoDto.sSku
                    }
                    let tableColNameArr = [
                        {title: "商品子sku", field: "prodSSku"},
                        {title: "可配数量", field: "planQuality"},
                        {title: "剩余可用", field: "remainAbleStock"},
                        {title: "库位", field: "locationCode"},
                        {title: "货件号", field: "shipmentId"},
                        {title: "最后入库时间", field: "lastPurTime", type: 'time'},
                        {title: "最后入库数量", field: "lastPurAmount"}
                    ]
                    openPrintTab(title,tableColNameArr,data)
                })
            }
        });
    });

    //查询可配多品
    $('#FbaGoodsMatch_canMatchMulti_search').click(function () {
        layer.open({
            type: 1,
            title: '可配多品',
            btn: ['关闭'],
            area: ['1350px', '80%'],
            content: $('#FbaGoodsMatch_canMatchMulti_search_tpl').html(),
            id: 'FbaGoodsMatch_canMatchMulti_search_pop',
            success: function (index, layero) {
                // 固定表头
                $('#FbaGoodsMatch_canMatchMulti_search_pop').scroll(function() {
                    toFixedTabHead(this)
                })
                table.render({
                    elem: '#FbaGoodsMatch_canMatchMulti_search_table',
                    method: 'POST',
                    url: ctx + '/amazonFbaGoodsMatch/queryAllCanMatchInfoMulti.html',
                    cols: tablecol['FbaGoodsMatch_canMatchMulti_search_table'],
                    page: false,
                    limit: Number.MAX_VALUE,
                    id: 'FbaGoodsMatch_canMatchMulti_search_table',
                    done: function (returnData) {
                        $('#FbaGoodsMatch_canMatchMultiNum').text(returnData.data.length)
                    },
                    initSort: {
                        field: 'matchStatus' //排序字段，对应 cols 设定的各字段名
                        ,type: 'desc' //排序方式  asc: 升序、desc: 降序、null: 默认排序
                    }
                })

                // //导出
                // $('#FbaGoodsMatch_canMatch_search_export').click(function () {
                //     submitForm(null, ctx + '/amazonFbaGoodsMatch/exportAllCanMatchInfo.html');
                // });
                // 标记已配
                $('#FbaGoodsMatch_markMatchMulti').click(function () {
                    let data = table.checkStatus('FbaGoodsMatch_canMatchMulti_search_table').data
                    if (!data || data.length === 0) {
                        layer.msg('请选择要打印的数据')
                        return
                    }
                    let idList = []
                    for (let i = 0; i < data.length; ++i) {
                        idList.push(data[i].id)
                    }
                    FbaGoodsMatch_markMatch(idList)
                })
                $('#FbaGoodsMatch_canMatchMulti_print').click(function () {
                    let data = table.checkStatus('FbaGoodsMatch_canMatchMulti_search_table').data
                    if (!data || data.length === 0) {
                        layer.msg('请选择要打印的数据')
                        return
                    }
                    let title = '可配多品sku'
                    for (let i = 0; i < data.length; ++i) {
                        data[i].prodSSku = data[i].prodSInfoDto.sSku
                        data[i].combSubProds = data[i].prodSInfoDto.combSubProds
                        for (let j = 0; j < data[i].combSubProds.length; ++j) {
                            data[i].combSubProds[j].locationCode = data[i].combSubProds[j].combLocation? data[i].combSubProds[j].combLocation.locationCode: '/'
                            data[i].combSubProds[j].totalNums = data[i].combSubProds[j].prodDetailNums * data[i].actQuality
                            data[i].combSubProds[j].lastPurTime = data[i].combSubProds[j].lastPurTime ? Format(data[i].combSubProds[j].lastPurTime,'yyyy-MM-dd') : '/'
                        }
                    }
                    let tableColNameArr = [
                        {title: "组合sku",field: 'prodSSku'},
                        {title: "可配数量", field: "planQuality",width:50},
                        {title: "剩余可用", field: "remainAbleStock",width:50},
                        {title: "货件号", field: "shipmentId"},
                        {title: '组合品详情', field:'combSubProds', children: [
                            {title: "商品sku", field: 'sSku',width:140},
                            {title: "库位",  field: 'locationCode',width:140},
                            {title: "组合数", field: 'prodDetailNums',width:50},
                            {title: "总数量", field: 'totalNums',width:50},
                            {title: "最后入库时间", field: 'lastPurTime',width:100},
                            {title: "最后入库数量", field: 'lastPurAmount',width:80},
                        ]
                        },
                    ]
                    openPrintTab(title,tableColNameArr,data)
                })
            }
        });
    });

    // 补充打印
    $('#FbaGoodsMatch_extraPrintBtn').click(function () {
        let printDiv = $('#fbaGoodsMatch_extraPrintDiv')
        let Adata = {
            prodSSku: printDiv.find('[name=prodSSku]').val().trim(),
            shipmentId: printDiv.find('[name=shipmentId]').val().trim()
        }
        let customPrintNum = printDiv.find('[name=printAmount]').val()
        if (!Adata.prodSSku || !Adata.shipmentId) {
            layer.msg('请填写sku和货件编码')
            return
        }

        initAjax('/amazonFbaGoodsMatch/queryHadPackInfo.html', 'POST', JSON.stringify(Adata), function (returnData) {
            let reqInfo = {
                printNumStyleInput: 0,
                customPrintNum: customPrintNum,
                prodSSku: returnData.data.prodSSku
            }
            if (!returnData.data.combBool) {
                if (!customPrintNum || !isInteger(customPrintNum) || customPrintNum <= 0) {
                    layer.msg('请填写正确打印数量')
                    return
                }
            }
            FbaGoodsMatch_dealToPrint(reqInfo,returnData.data)
        }, null, true, true);
    })

    //查询已配未投
    $('#FbaGoodsMatch_canPut_search').click(function () {
        layer.open({
            type: 1,
            title: '查询已配上架货品',
            btn: ['关闭'],
            area: ['80%', '80%'],
            content: $('#FbaGoodsMatch_canPut_search_tpl').html(),
            id: 'FbaGoodsMatch_canPut_search_pop',
            success: function (index, layero) {
                // 固定表头
                $('#FbaGoodsMatch_canPut_search_pop').scroll(function() {
                    toFixedTabHead(this)
                })
                initAjax('/amazonFbaGoodsMatch/queryAllCanPutInfo.html', 'POST', null, function (returnData) {
                    renderTable(returnData.data, 'FbaGoodsMatch_canPut_search_table');
                    $('#FbaGoodsMatch_canPutNum').text(returnData.data.length || 0)
                }, null, true, true);

                //下载模板
                $('#FbaGoodsMatch_canPut_search_export').click(function () {
                    submitForm(null, ctx + '/amazonFbaGoodsMatch/exportAllCanPutInfo.html');
                });

                $('#FbaGoodsMatch_canPut_print').click(function () {
                    let data = table.checkStatus('FbaGoodsMatch_canPut_search_table').data
                    if (!data || data.length === 0) {
                        layer.msg('请选择要打印的数据')
                        return
                    }
                    let title = '已配未上架货品'
                    let tableColNameArr = [
                        {title: "货品SKU", field: "fnSku"},
                        {title: "商品SKU", field: "prodSSku"},
                        {title: "库位", field: "locationCode"},
                        {title: "数量", field: "planQuality"},
                        {title: "货件号", field: "shipmentId"},
                        {title: "箱号", field: "shipBoxCode"},
                    ]
                    openPrintTab(title,tableColNameArr,data)
                })
            }
        });
    });

    // 监听表格事件
    for (let i in tablecol) {
        table.on('tool(' + i + ')', function (obj) {
            let data = obj.data;
            let layEvent = obj.event;
            let reqInfo = getFormReqObj("FbaGoodsMatch_Form");
            switch (layEvent) {
                case 'FbaGoodsMatch_op_matchOrUpdate' :
                    fbaGoodsMatch_matchOrUpdateActQuality(data,reqInfo);
                    break
                case 'FbaGoodsMatch_op_printFnSku' :
                    FbaGoodsMatch_dealToPrint(reqInfo,data);
                    break
                case 'FbaGoodsMatch_op_printCombDetail' :
                    FbaGoodsMatch_printCombDetail([data])
                    break
            }
        });
    }

    // 打印组合品明细
    function FbaGoodsMatch_printCombDetail(data){
        let printList = []
        for (let i = 0; i < data.length; ++i) {
            let printOne = {
                titleMap: {
                    shipmentId: data[i].shipmentId,
                    boxCode: ''
                },
                amount: 1
            }
            let skuList = []
            let locationList = []
            let numList = []
            debugger
            for (let j = 0; j < data[i].prodSInfoDto.combSubProds.length; j++) {
                skuList.push(data[i].prodSInfoDto.combSubProds[j].sSku)
                locationList.push(data[i].prodSInfoDto.combSubProds[j].combLocation ? data[i].prodSInfoDto.combSubProds[j].combLocation.locationCode : '')
                numList.push(data[i].prodSInfoDto.combSubProds[j].prodDetailNums * data[i].actQuality)
            }
            printOne.titleMap.skuList = skuList
            printOne.titleMap.locationList = locationList
            printOne.titleMap.numList = numList
            printList.push(printOne)
        }
        let printDto = {
            jspaper: 'fbaCombDetail.jasper',
            printDetailDtoList: printList
        }
        printStandard(printDto)
    }

    // 配货打印
    function FbaGoodsMatch_dealToPrint(reqInfo,oneDataItem){
        let printNumStyleInput=reqInfo.printNumStyleInput;//1随计划0随自定义
        let customPrintNum=reqInfo.customPrintNum;
        let realPrintNum=oneDataItem.actQuality;
        if(printNumStyleInput == "0"){
            if($.isEmptyObject(customPrintNum)||customPrintNum<1) {
                layui.layer.msg("自定义打印需要指定数量", {icon: 2});
                return;
            }else{
                realPrintNum=customPrintNum;
            }
        }
        let printarr=[];
        let printData = getFnSKUPrintData(oneDataItem,realPrintNum);
        printarr.push(printData);
        console.log(printarr)
        epeanPrint_plugin_fun(9,printarr);
        $("#FbaGoodsMatch_Form input[name=prodSSku]").focus()
    }

    // 表单提交
    //验证 //分页效果,从按钮触发是否可以重置//如果不能重置,则改为非表单提交,表单的目的做数据校验
    form.on('submit(FbaGoodsMatch_Search)', function (data) {//作为初次提交
        form_search(data.field);
    });

//监听已完成tab状态单选筛选
    form.on('radio(FbaGoodsMatch_printNumStyle)', function(data) {
        form.render('radio');
        $('#FbaGoodsMatch_Form input[name="printNumStyleInput"]').val(data.value)
    })

    $("#FbaGoodsMatch_Form input[name=prodSSku]").on('keydown', function (event) {
        if (event.keyCode == 13) {
            event.preventDefault();
            event.stopPropagation();
            $('#FbaGoodsMatch_Search').click();
        }
    });
    $("#FbaGoodsMatch_Form input[name=shipmentId]").on('keydown', function (event) {
        if (event.keyCode == 13) {
            event.preventDefault();
            event.stopPropagation();
            $('#FbaGoodsMatch_Search').click();
        }
    });

    // 发送ajax
    function initAjax(url, method, data, succFunc, contentType, loadingShow, laodingHide,failFunc) { //初始化ajax请求
        if (loadingShow) {
            loading.show();
        }
        $.ajax({
            type: method,
            url: ctx + url,
            dataType: 'json',
            async: true,
            data: data,
            contentType: contentType || 'application/json',
            success: function (returnData) {
                if (laodingHide) {
                    loading.hide();
                }
                if (returnData.code == "0000") {
                    succFunc(returnData)
                } else {
                    if(failFunc){
                        failFunc(returnData);
                    }else{
                        layer.msg(returnData.msg, {icon: 2});
                    }
                }
            },
            error: function (returnData) {
                if (laodingHide) {
                    loading.hide();
                }
                if (XMLHttpRequest.status == 200) {
                    layer.msg("请重新登录", {icon: 7});
                } else {
                    layer.msg("服务器错误");
                }
            }
        })
    }

    // 查询
    function form_search(reqInfo) {//初次search的入口
        initAjax('/amazonFbaGoodsMatch/queryPackAbleInfo.html', 'POST', JSON.stringify(reqInfo), function (returnData) {
            // renderPage(returnData.count, data.page, data.limit);

            if (returnData.data.ifSingle) {
                let oneDataItem = returnData.data.list[0]
                let range = oneDataItem.planQuality * 0.05 > 6 ? oneDataItem.planQuality * 0.05 : 6
                oneDataItem.combBool = false
                // 获取剩余可用数量
                let remainStockNum = oneDataItem.whStock.currentStock - oneDataItem.whStock.reservationStock
                oneDataItem.remainAbleStock = remainStockNum

                oneDataItem.actQuality = oneDataItem.planQuality

                renderTable(returnData.data.list, 'FbaGoodsMatch_table');
                // 剩余可用数量 > 可修改范围 或者 等于0 自动配货
                if(remainStockNum > range || remainStockNum === 0 ){
                    fbaGoodsMatch_matchOrUpdateActQuality(oneDataItem,reqInfo)
                }
            } else {
                for (let k = 0;k < returnData.data.list.length; ++k) {
                    let oneDataItem = returnData.data.list[k]
                    oneDataItem.combBool = true
                    // 计算本次配货数量
                    let remainAbleStock
                    let combList = oneDataItem.prodSInfoDto.combSubProds
                    for (let i = 0; i < combList.length; ++i) {
                        let curAbleNum = Math.floor((combList[i].whStock.currentStock - combList[i].whStock.reservationStock) / combList[i].prodDetailNums)
                        if (!remainAbleStock || remainAbleStock > curAbleNum) {
                            remainAbleStock = curAbleNum
                        }
                    }
                    oneDataItem.remainAbleStock = remainAbleStock
                    oneDataItem.actQuality = oneDataItem.planQuality
                }
                renderTable(returnData.data.list, 'FbaGoodsMatch_table');
            }
            $('#FbaGoodsMatch_Form').find('[name=prodSSku]').val('')
            $('#FbaGoodsMatch_Form').find('[name=prodSSku]').focus()
        }, null, true, true,function (res) {
            layer.msg(res.msg)
            $('#FbaGoodsMatch_Form').find('[name=prodSSku]').val('')
            $('#FbaGoodsMatch_Form').find('[name=prodSSku]').focus()
        });
    }

    // 配货或者修改配货数量
    function fbaGoodsMatch_matchOrUpdateActQuality(oneDataItem,reqInfo) {
        let ajax = new Ajax(false)
        ajax.post({
            url: ctx + '/amazonFbaGoodsMatch/packRelSku',
            data: JSON.stringify({id: oneDataItem.id,actQuality: oneDataItem.actQuality}),
            success: function (res) {
                if (res.code === '0000') {
                    layer.msg('配货/修改成功')
                    // 自动打印货品标签
                    if (!oneDataItem.ifMatch && reqInfo.needAutoPrint) {
                        FbaGoodsMatch_dealToPrint(reqInfo, oneDataItem);
                        // 打印组合品明细
                        if (oneDataItem.combBool) {
                            FbaGoodsMatch_printCombDetail([oneDataItem])
                        }
                    }
                    // 重新渲染
                    oneDataItem.ifMatch = true
                    renderTable([oneDataItem], 'FbaGoodsMatch_table');
                } else {
                    layer.msg(res.msg)
                }
                $('#FbaGoodsMatch_Form').find('[name=prodSSku]').val('')
                $('#FbaGoodsMatch_Form').find('[name=prodSSku]').focus()
            }
        })
    }
    function getTitleAli(title) {
        let titleArr = title.split(' ')
        if (titleArr.length > 5) {
            return titleArr[0] + ' ' + titleArr[1] + ' ... ' + titleArr[titleArr.length - 2] + " " + titleArr[titleArr.length - 1]
        } else {
            return title
        }
    }
    // 组装打印参数
    function getFnSKUPrintData(item,realPrintNum) {
        return {
            fnSku: item.fnSku,
            mixStyle: item.mixStyle,
            title: getTitleAli(item.title),
            printNumber: realPrintNum,
            planQuality: item.actQuality,
            printerName: "10040",
            onlyPreView: false,
            prodSSku: item.prodSInfoDto.sSku,
            locationCode:item.locationCode || '',
            shipmentId: item.shipmentId,
            shipBoxCode: item.shipBoxCode
        }
    }

    // 渲染表格
    function renderTable(data, tablename, func) {
        var tableIns = table.render({
            elem: '#' + tablename,
            method: 'POST',
            data: data,
            cols: tablecol[tablename],
            page: false,
            limit: Number.MAX_VALUE,
            id: tablename,
            done: function (data) {
                if (func) {
                    func(data);
                }
            }
        })
    }

    //获取表单参数
    function getFormReqObj(formIdName) {
        var d = {};
        var t = $('#' + formIdName + ' [name]').serializeArray();
        $.each(t, function () {
            d[this.name] = this.value;
        });
        return d;
    }

    $('#FbaGoodsMatch').on('focus','.layui-table-edit',function (even) {
        even.target.select()
    })
    table.on('edit(FbaGoodsMatch_table)',function (obj) {
        renderTable([obj.data], 'FbaGoodsMatch_table');
    })

    // 修改配货备注
    table.on('edit(FbaGoodsMatch_canPut_search_table)',function (obj) {
        let data = {
            id: obj.data.id,
            whRemark: obj.value
        }
        let ajax = new Ajax(true)
        ajax.post({
            url: '/amazonFbaGoodsMatch/editWhRemark.html',
            data: JSON.stringify(data)
        })
    })

    function FbaGoodsMatch_markMatch(idList) {
        let ajax = new Ajax(true)
        ajax.post({
            url: '/amazonFbaGoodsMatch/markHasMatch.html',
            data: JSON.stringify(idList),
            success: function (res) {
                if (res.code === '0000') {

                }
            }
        })
    }
    
    $('#FbaGoodsMatch_exportDullStock').click(function () {
        submitForm(null, ctx + '/amazonFbaGoodsMatch/exportDullStock.html');
    })
})
