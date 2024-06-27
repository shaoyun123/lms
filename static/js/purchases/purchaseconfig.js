/**
 * time: 2018/01/02
 */
var purchaseconfig_dynamicBtn
layui.use(["admin", "form", "table", "layer", "formSelects"], function () {
    var admin = layui.admin,
        form = layui.form,
        table = layui.table,
        layer = layui.layer,
        formSelects = layui.formSelects,
        $ = layui.$;
        
    form.render('select');
    form.render('radio');
    form.render('checkbox');

    //展示销量权重
    function search_whSalesRatio() {
        table.render({
            elem: "#whSalesRatioTable",
            id: 'whSalesRatioTable',
            method: "post",
            url: ctx + "/whSalesRatio/queryPage.html",
            cols: [
                [
                    //标题栏
                    {title: "7天销量权重(%)",templet: '#saleRatioSeven_purchaseconfig'},
                    {title: "15天销量权重(%)",templet: '#saleRatioFifteen_purchaseconfig'},
                    {title: "30天销量权重(%)",templet: '#saleRatioThirty_purchaseconfig'},
                    { title: '操作', align: 'center', toolbar: '#whSalesRatioTool_purchaseconfig' }
                ],
            ],
            unFixedTableHead: true, // 不固定表头
            page: false //是否显示分页
        });
    }
    search_whSalesRatio()
    // 销量权重表格操作
    table.on('tool(whSalesRatioTable)', function(obj) {
        var layEvent = obj.event; //获得 lay-event 对应的值
        var data = obj.data; //获得当前行数据
        var tr = $(obj.tr)
        console.log(tr)
        if (layEvent == 'update') {
            var confirmIndex = layer.confirm('确认修改?', { btn: ['确认', '取消'] },
                function() {
                    console.log(111)
                    var Adata = {
                        id: data.id,
                        saleRatioSeven: tr.find('[name=saleRatioSeven]').val().trim(),
                        saleRatioFifteen: tr.find('[name=saleRatioFifteen]').val().trim(),
                        saleRatioThirty: tr.find('[name=saleRatioThirty]').val().trim()
                    }
                    if (Adata.saleRatioSeven == '' || Adata.saleRatioFifteen == '' || Adata.saleRatioThirty == '') {
                        layer.msg('三个权重都必须填写')
                        return
                    }

                    Adata.saleRatioSeven = accDiv(parseInt(Adata.saleRatioSeven),100)
                    Adata.saleRatioFifteen = accDiv(parseInt(Adata.saleRatioFifteen),100)
                    Adata.saleRatioThirty = accDiv(parseInt(Adata.saleRatioThirty),100)
                    if (accAdd(accAdd(Adata.saleRatioSeven,Adata.saleRatioFifteen),Adata.saleRatioThirty) != 1) {
                        layer.msg('三个权重必须相加为 100%')
                        return
                    }
                    var ajax = new Ajax(true)
                    ajax.post({
                        url: ctx + "/whSalesRatio/update.html",
                        data: JSON.stringify(Adata),
                        contentType: 'application/json',
                        success: function (data) {
                            if (data.code == '0000') {
                                search_whSalesRatio()
                            }
                        }
                    })
                },
                function () {
                    layer.close(confirmIndex)
                })
        }
    })
    // 重新计算权重销量按钮
    $('#recountDailySales_purchaseconfig').click(function () {
        var ajax = new Ajax(true)
        ajax.post({
            url: ctx + "/whSalesParam/reCalDailySales.html",
            data: JSON.stringify({}),
            contentType: 'application/json',
            success: function (data) {
            }
        })

    })

    //展示高频次销量权重
    function search_whSalesRatioExtra() {
        table.render({
            elem: "#whSalesRatioExtraTable",
            id: 'whSalesRatioExtraTable',
            method: "post",
            url: ctx + "/whSalesRatio/queryPageExtra.html",
            cols: [
                [
                    //标题栏
                    {title: "天数",templet: '#purPeriod_purchaseconfig'},
                    {title: "已采购次数",templet: '#purTimes_purchaseconfig'},
                    {title: "7天销量权重(%)",templet: '#saleRatioSeven_purchaseconfig'},
                    {title: "15天销量权重(%)",templet: '#saleRatioFifteen_purchaseconfig'},
                    {title: "30天销量权重(%)",templet: '#saleRatioThirty_purchaseconfig'},
                    { title: '操作', align: 'center', toolbar: '#whSalesRatioTool_purchaseconfig' }
                ],
            ],
            unFixedTableHead: true, // 不固定表头
            page: false //是否显示分页
        });
    }
    search_whSalesRatioExtra()
    // 高频次采购销量权重表格操作
    table.on('tool(whSalesRatioExtraTable)', function(obj) {
        var layEvent = obj.event; //获得 lay-event 对应的值
        var data = obj.data; //获得当前行数据
        var tr = $(obj.tr)
        if (layEvent === 'update') {
            var confirmIndex = layer.confirm('确认修改?', { btn: ['确认', '取消'] },
                function() {
                    var Adata = {
                        id: data.id,
                        purPeriod: tr.find('[name=purPeriod]').val().trim(),
                        purTimes: tr.find('[name=purTimes]').val().trim(),
                        saleRatioSeven: tr.find('[name=saleRatioSeven]').val().trim(),
                        saleRatioFifteen: tr.find('[name=saleRatioFifteen]').val().trim(),
                        saleRatioThirty: tr.find('[name=saleRatioThirty]').val().trim()
                    }
                    if (Adata.purPeriod === '' || Adata.purTimes === '' || Adata.saleRatioSeven === ''
                        || Adata.saleRatioFifteen === '' || Adata.saleRatioThirty === '') {
                        layer.msg('请填写完整参数')
                        return
                    }
                    if (Adata.purPeriod < 1 || Adata.purPeriod > 30 || Adata.purTimes < 1 || Adata.purTimes > 30) {
                        layer.msg('天数和已采购次数需在[1,30]之间')
                        return
                    }

                    Adata.saleRatioSeven = accDiv(parseInt(Adata.saleRatioSeven),100)
                    Adata.saleRatioFifteen = accDiv(parseInt(Adata.saleRatioFifteen),100)
                    Adata.saleRatioThirty = accDiv(parseInt(Adata.saleRatioThirty),100)

                    let ajax = new Ajax(true)
                    ajax.post({
                        url: ctx + "/whSalesRatio/updateExtra.html",
                        data: JSON.stringify(Adata),
                        contentType: 'application/json',
                        success: function (data) {
                            if (data.code === '0000') {
                                search_whSalesRatioExtra()
                            }
                        }
                    })
                },
                function () {
                    layer.close(confirmIndex)
                })
        }
    })

    //展示 销量级数
    function search_salesParam() {
        table.render({
            elem: "#whSalesParamTable",
            id: 'whSalesParamTable',
            method: "post",
            url: ctx + "/whSalesParam/queryPage.html",
            cols: [
                [
                    //标题栏
                    {title: "阶级名称",templet: '#stepName_salesParam_purchaseconfig'},
                    {title: "最小日均销量(包含)",templet: '#minDailySales_salesParam_purchaseconfig'},
                    {title: "最大日均销量(不包含)",templet: '#maxDailySales_salesParam_purchaseconfig'},
                    {title: "采购到货天数",templet: '#purchaseDlvrDays_salesParam_purchaseconfig'},
                    {title: "库存预警周期",templet: '#stockWarnCycle_salesParam_purchaseconfig'},
                    { title: '操作', align: 'center', toolbar: '#whSalesParamTool_purchaseconfig' }
                ],
            ],
            limit: 10000,
            unFixedTableHead: true, // 不固定表头
            page: false //是否显示分页
        });
    }
    search_salesParam()
    // 销量级数表格操作
    table.on('tool(whSalesParamTable)', function(obj) {
        var layEvent = obj.event; //获得 lay-event 对应的值
        var data = obj.data; //获得当前行数据
        var tr = $(obj.tr)
        if (layEvent == 'update') {
            var confirmIndex = layer.confirm('确认修改?', { btn: ['确认', '取消'] },
                function() {
                    var Adata = {
                        id: data.id,
                        stepName: tr.find('[name=stepName]').val().trim(),
                        minDailySales: tr.find('[name=minDailySales]').val().trim(),
                        maxDailySales: tr.find('[name=maxDailySales]').val().trim(),
                        purchaseDlvrDays: tr.find('[name=purchaseDlvrDays]').val().trim(),
                        stockWarnCycle: tr.find('[name=stockWarnCycle]').val().trim()
                    }
                    if (Adata.stepName == '' || Adata.minDailySales == '' || Adata.maxDailySales == '' || Adata.purchaseDlvrDays == ''|| Adata.stockWarnCycle == '') {
                        layer.msg('所有参数都必须填写')
                        return
                    }
                    Adata.minDailySales = parseFloat(Adata.minDailySales)
                    Adata.maxDailySales = parseFloat(Adata.maxDailySales)
                    Adata.purchaseDlvrDays = parseInt(Adata.purchaseDlvrDays)
                    Adata.stockWarnCycle = parseInt(Adata.stockWarnCycle)

                    var ajax = new Ajax(true)
                    ajax.post({
                        url: ctx + "/whSalesParam/update.html",
                        data: JSON.stringify(Adata),
                        contentType: 'application/json',
                        success: function (data) {
                            if (data.code == '0000') {
                                search_salesParam()
                            }
                        }
                    })
                },
                function () {
                    layer.close(confirmIndex)
                })
        } else if (layEvent == 'add') {
            var confirmIndex = layer.confirm('确认新增?', { btn: ['确认', '取消'] },
                function() {
                    var Adata = {
                        stepName: tr.find('[name=stepName]').val().trim(),
                        minDailySales: tr.find('[name=minDailySales]').val().trim(),
                        maxDailySales: tr.find('[name=maxDailySales]').val().trim(),
                        purchaseDlvrDays: tr.find('[name=purchaseDlvrDays]').val().trim(),
                        stockWarnCycle: tr.find('[name=stockWarnCycle]').val().trim()
                    }
                    if (Adata.stepName == '' || Adata.minDailySales == '' || Adata.maxDailySales == '' || Adata.purchaseDlvrDays == ''|| Adata.stockWarnCycle == '') {
                        layer.msg('所有参数都必须填写')
                        return
                    }

                    Adata.minDailySales = parseInt(Adata.minDailySales)
                    Adata.maxDailySales = parseInt(Adata.maxDailySales)
                    Adata.purchaseDlvrDays = parseInt(Adata.purchaseDlvrDays)
                    Adata.stockWarnCycle = parseInt(Adata.stockWarnCycle)

                    var ajax = new Ajax(true)
                    ajax.post({
                        url: ctx + "/whSalesParam/addOne.html",
                        data: JSON.stringify(Adata),
                        contentType: 'application/json',
                        success: function (data) {
                            if (data.code == '0000') {
                                search_salesParam()
                            }
                        }
                    })
                },
                function () {
                    layer.close(confirmIndex)
                })
        } else if (layEvent == 'delete') {
            var confirmIndex = layer.confirm('确认删除?', { btn: ['确认', '取消'] },
                function() {
                    var Adata = {
                        id: data.id
                    }

                    var ajax = new Ajax(true)
                    ajax.post({
                        url: ctx + "/whSalesParam/delete.html",
                        data: JSON.stringify(Adata),
                        contentType: 'application/json',
                        success: function (data) {
                            if (data.code == '0000') {
                                search_salesParam()
                            }
                        }
                    })
                },
                function () {
                    layer.close(confirmIndex)
                })
        }
    })

    // 获取平台
    let platList = [];
    getPlatList()
    // 获取所有平台数据
    function getPlatList() {
        $.ajax({
            type: 'POST',
            url: '/lms/whPurchaseParam/getHasOrderPlatCode',
            async: false,
            success: function(res){
                if(res.code == '0000'){
                    let data = res.data || []
                    let result = [];
                    data.forEach(item => {
                        result.push({
                            name: item,
                            code: item
                        })
                    })
                    platList = result;
                }
            }
        });
    }
    let search_salesParam_platData = [];
    //展示 销量级数2
    function search_salesParam_plat(data) {
        // 剩余平台在最后一行
        data.forEach(item => {
            item.platPurParamList?.forEach((cItem, index) => {
                let obj = {};
                if(cItem.platCode == '剩余平台'){
                    obj = cItem
                    item.platPurParamList.splice(index,1)
                    item.platPurParamList.push(obj)
                }
            })
        })
        table.render({
            elem: "#whSalesParamTable_plat",
            id: 'whSalesParamTable_plat',
            // method: "post",
            // url: ctx + "/whSalesParam/queryPage.html",
            data: data,
            cols: [
                [
                    //标题栏
                    {title: "平台销量阶级名称",templet: '#stepName_salesParam_purchaseconfig'},
                    {title: "平台最小日均销量(包含)",templet: '#minDailySales_salesParam_purchaseconfig'},
                    {title: "平台最大日均销量(不包含)",templet: '#maxDailySales_salesParam_purchaseconfig'},
                    {title: "<div style='display: flex;justify-content:space-around'><span style='width:180px;'>适用平台</span><span style='width:50px;'>采购到货天数</span><span style='width:50px;'>库存预警周期</span><span>操作</span></div>",rowspan:4,width:400,templet: '#maxDailySales_salesParam_purchaseconfig_plat'},
                    { title: '操作',width:130, align: 'center', toolbar: '#whSalesParamTool_purchaseconfig' }
                ],
            ],
            done: function (res) {
                let data = res.data || []
                search_salesParam_platData = data;
                // 填充商品属性下拉框
                data.forEach((cItem) => {
                    cItem.platPurParamList?.forEach((dItem, index) => {
                        if(dItem.platCode == '剩余平台'){
                            return;
                        }
                        commonRenderSelect(`table_plat${cItem.id}_${index}`, platList, { name: "name", code: "name" }).then(function () {
                            formSelects.render(`table_plat${cItem.id}_${index}`);
                            formSelects.value(`table_plat${cItem.id}_${index}`, dItem.platCode?.split(","))
                        })
                    })
                    commonRenderSelect(`table_plat${cItem.id||'new'}_${cItem.platPurParamList?.length || 0}`, platList, { name: "name", code: "name" }).then(function () {
                        formSelects.render(`table_plat${cItem.id||'new'}_${cItem.platPurParamList?.length || 0}`);
                    })
                })
            },
            limit: 10000,
            unFixedTableHead: true, // 不固定表头
            page: false //是否显示分页
        });
    }
    // 获取销量级数数据
    function getData_search_salesParam_plat(){
        commonReturnPromise({
            type: "post",
            url: ctx + "/whPurchaseParam/queryAllProdPlatStepParam"
        }).then(res => {
            res.push({})
            search_salesParam_plat(res)
        })
    }
    getData_search_salesParam_plat()
    // 销量级数表格操作
    table.on('tool(whSalesParamTable_plat)', function(obj) {
        var layEvent = obj.event; //获得 lay-event 对应的值
        var data = obj.data; //获得当前行数据
        var tr = $(obj.tr)
        if (layEvent == 'add') {
            var confirmIndex = layer.confirm('确认新增?', { btn: ['确认', '取消'] },
                function() {
                    let platPurParamList = [],checkNull = false;
                    if(data.platPurParamList && data.platPurParamList.length != 0){
                        data.platPurParamList.forEach((item,index) => {
                            let platCode = $(`#table_plat${data.id}_${index}`).val()||formSelects.value(`table_plat${data.id}_${index}`, 'val').join(",");
                            let purchaseDlvrDays = $(`#table_plat${data.id}_${index}`).closest("tr").find("input[name=purchaseDlvrDays]").val()
                            let stockWarnCycle = $(`#table_plat${data.id}_${index}`).closest("tr").find("input[name=stockWarnCycle]").val()
                            if(platCode == '' || (purchaseDlvrDays != 0 && purchaseDlvrDays == '') || (stockWarnCycle != 0 && stockWarnCycle == '')){
                                checkNull = true;
                            }
                            platPurParamList.push({
                                platCode,
                                purchaseDlvrDays: purchaseDlvrDays,
                                stockWarnCycle: stockWarnCycle
                            })
                        })
                    }else{
                        let platCode = formSelects.value(`table_plat${data.id?data.id:'new'}_0`, 'val').join(",");
                        let purchaseDlvrDays = $(`#table_plat${data.id?data.id:'new'}_0`).closest("tr").find("input[name=purchaseDlvrDays]").val()
                        let stockWarnCycle = $(`#table_plat${data.id?data.id:'new'}_0`).closest("tr").find("input[name=stockWarnCycle]").val()
                        if(platCode == '' || (purchaseDlvrDays != 0 && purchaseDlvrDays == '') || (stockWarnCycle != 0 && stockWarnCycle == '')){
                            checkNull = true;
                        }
                        platPurParamList = [{
                            platCode,
                            purchaseDlvrDays: purchaseDlvrDays,
                            stockWarnCycle: stockWarnCycle
                        }]
                    }

                    var Adata = {
                        stepName: tr.find('[name=stepName]').val().trim(),
                        minDailySales: tr.find('[name=minDailySales]').val().trim(),
                        maxDailySales: tr.find('[name=maxDailySales]').val().trim(),
                        platPurParamList
                    }
                    if (Adata.stepName == '' || Adata.minDailySales == '' || Adata.maxDailySales == '' || checkNull || (Adata.platPurParamList && Adata.platPurParamList.length == 0)) {
                        layer.msg('所有参数都必须填写')
                        return
                    }

                    Adata.minDailySales = parseFloat(Adata.minDailySales)
                    Adata.maxDailySales = parseFloat(Adata.maxDailySales)

                    // 剩余平台
                    let isReq = Adata.platPurParamList.filter(item => item.platCode == '剩余平台')
                    if(isReq.length == 0){
                        Adata.platPurParamList.push({
                            platCode: '剩余平台',
                            purchaseDlvrDays: 0,
                            stockWarnCycle: 0
                        })
                    }

                    save_salesParam_plat(Adata)
                },
                function () {
                    layer.close(confirmIndex)
                })
        }else if (layEvent == 'update') {
            var confirmIndex = layer.confirm('确认修改?', { btn: ['确认', '取消'] },
                function() {
                    let platPurParamList = [],checkNull = false;
                    data.platPurParamList.forEach((item,index) => {
                        let platCode = $(`#table_plat${data.id}_${index}`).val()||formSelects.value(`table_plat${data.id}_${index}`, 'val').join(",");
                        let purchaseDlvrDays = $(`#table_plat${data.id}_${index}`).closest("tr").find("input[name=purchaseDlvrDays]").val()
                        let stockWarnCycle = $(`#table_plat${data.id}_${index}`).closest("tr").find("input[name=stockWarnCycle]").val()
                        if(platCode == '' ||  (purchaseDlvrDays != 0 && purchaseDlvrDays == '') || (stockWarnCycle != 0 && stockWarnCycle == '')){
                            checkNull = true;
                        }
                        platPurParamList.push({
                            platCode,
                            purchaseDlvrDays: purchaseDlvrDays,
                            stockWarnCycle: stockWarnCycle
                        })
                    })

                    var Adata = {
                        id: data.id || '',
                        stepName: tr.find('[name=stepName]').val().trim(),
                        minDailySales: tr.find('[name=minDailySales]').val().trim(),
                        maxDailySales: tr.find('[name=maxDailySales]').val().trim(),
                        creatorId: data.creatorId || '',
                        remark: data.remark || '',
                        platPurParamList
                    }
                    if (Adata.stepName == '' || Adata.minDailySales == '' || Adata.maxDailySales == '' || checkNull) {
                        layer.msg('所有参数都必须填写')
                        return
                    }

                    Adata.minDailySales = parseFloat(Adata.minDailySales)
                    Adata.maxDailySales = parseFloat(Adata.maxDailySales)

                    save_salesParam_plat(Adata)
                },
                function () {
                    layer.close(confirmIndex)
                })
        } else if (layEvent == 'delete') {
            var confirmIndex = layer.confirm('确认删除?', { btn: ['确认', '取消'] },
                function() {
                    var Adata = {
                        id: data.id
                    }

                    var ajax = new Ajax(true)
                    ajax.post({
                        url: ctx + "/whPurchaseParam/deleteProdPlatStepParam",
                        data: JSON.stringify(Adata),
                        contentType: 'application/json',
                        success: function (data) {
                            if (data.code == '0000') {
                                getData_search_salesParam_plat()
                            }
                        }
                    })
                },
                function () {
                    layer.close(confirmIndex)
                })
        } else if (layEvent == 'childAdd') {
            let stepId = $(obj.tr).data("id");
            let purchaseDlvrDays = $(obj.tr).find("[name=purchaseDlvrDays]").val();
            let stockWarnCycle = $(obj.tr).find("[name=stockWarnCycle]").val();
            let childIndex = $(obj.tr).data("index");
            let platCode = $(`#table_plat${childIndex}`).val()||formSelects.value(`table_plat${childIndex}`, 'val');
            if(!(purchaseDlvrDays&&stockWarnCycle&&platCode.length != 0)){
                return layer.alert("数据不能为空",{icon:2})
            }
            let Adata = [];
            if(stepId == 'new'){
                if(search_salesParam_platData[search_salesParam_platData.length - 1]["platPurParamList"]){
                    search_salesParam_platData[search_salesParam_platData.length - 1]["platPurParamList"].push({
                        platCode: platCode.join(","),
                        purchaseDlvrDays,
                        stockWarnCycle
                    })
                }else{
                    search_salesParam_platData[search_salesParam_platData.length - 1]["platPurParamList"] = [{
                        platCode: platCode.join(","),
                        purchaseDlvrDays,
                        stockWarnCycle
                    }]
                }
                search_salesParam_platData[search_salesParam_platData.length - 1]["stepName"] = $("#table_platnew_0").closest('table').closest('tr').find("[name=stepName]").val();
                search_salesParam_platData[search_salesParam_platData.length - 1]["minDailySales"] = $("#table_platnew_0").closest('table').closest('tr').find("[name=minDailySales]").val();
                search_salesParam_platData[search_salesParam_platData.length - 1]["maxDailySales"] = $("#table_platnew_0").closest('table').closest('tr').find("[name=maxDailySales]").val();
                Adata = [search_salesParam_platData[search_salesParam_platData.length - 1]]
            }else{
                search_salesParam_platData.forEach(item => {
                    if(item.id == stepId){
                        item["platPurParamList"].push({
                            platCode: platCode.join(","),
                            purchaseDlvrDays,
                            stepId,
                            stockWarnCycle
                        })
                    }
                })
                Adata = search_salesParam_platData.filter(item => item.id == stepId)
            }

            // 剩余平台
            let isReq = Adata[0].platPurParamList.filter(item => item.platCode == '剩余平台')
            if(isReq.length == 0){
                Adata[0].platPurParamList.push({
                    platCode: '剩余平台',
                    purchaseDlvrDays: 0,
                    stockWarnCycle: 0
                })
            }

            save_salesParam_plat(Adata[0])
            // search_salesParam_plat(search_salesParam_platData)
        } else if (layEvent == 'childDel') {
            let id = $(obj.tr).data("index").split("_")[0],
                index = $(obj.tr).data("index").split("_")[1];
            search_salesParam_platData.forEach(item => {
                if(item.id == id){
                    item["platPurParamList"].splice(index,1)
                }
            })
            // search_salesParam_plat(search_salesParam_platData)
            let Adata = search_salesParam_platData.filter(item => item.id == id)
            save_salesParam_plat(Adata[0])
        }
    })

    function save_salesParam_plat(data){
        var ajax = new Ajax(true)
        ajax.post({
            url: ctx + "/whPurchaseParam/addOrUpdateProdPlatStepParam",
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function (data) {
                if (data.code == '0000') {
                    getData_search_salesParam_plat()
                }
            }
        })
    }

    //展示 商品标签影响参数
    function search_prodAttrParam() {
        table.render({
            elem: "#whProdAttrParamTable",
            id: 'whProdAttrParamTable',
            method: "post",
            url: ctx + "/whProdAttrParam/queryPage.html",
            cols: [
                [
                    //标题栏
                    {field: 'sort',title: "优先级",templet: `<div><input name="sort" class="layui-input" value="{{d.sort != null ? d.sort : ''}}"/></div>`},
                    {title: "商品属性", width:300, templet: '#prodAttr_prodAttrParam_purchaseconfig'},
                    {title: "开始时间(包含)",templet: '#beginTime_prodAttrParam_purchaseconfig'},
                    {title: "结束时间(不包含)",templet: '#endTime_prodAttrParam_purchaseconfig'},
                    {title: "采购到货天数",templet: '#purchaseDlvrDays_prodAttrParam_purchaseconfig'},
                    {title: "库存预警周期",templet: '#stockWarnCycle_prodAttrParam_purchaseconfig'},
                    { title: '操作', align: 'center', toolbar: '#whProdAttrParamTool_purchaseconfig' }
                ],
            ],
            limit: 10000,
            unFixedTableHead: true,
            page: false, //是否显示分页
            created(res) {
                res.data?.forEach((item, index) => {
                    item.index = index
                })
            },
            done: function (res) {
                let data = res.data || []
                getProdAttrList(data)
                
            }
        });
    }

    function getProdAttrList(list) {
        $.ajax({
            type: 'get',
            dataType: 'json',
            url: '/lms/product/getProdTags.html',
            success: function(res){
                if(res.code == '0000'){
                    let data = res.data || []
                    // 填充商品属性下拉框
                    $('.prodAttrWrap').each(function (index, item){
                        commonRenderSelect(`table_prodAttr${index}`, data, { name: "name", code: "name" }).then(function () {
                            formSelects.render(`table_prodAttr${index}`);
                            let attr = $(`#table_prodAttr${index}`).attr('tag') || ''
                            list.forEach((cItem, index) => {
                                if (cItem.prodAttr == attr) {
                                    formSelects.render(`table_prodAttr${index}`);
                                    formSelects.value(`table_prodAttr${index}`, cItem.prodAttr?.split(','))
                                }
                            })
                        })
                    })
                }
            }
        }); 
    }

    search_prodAttrParam()
    // 商品标签影响参数表格操作
    table.on('tool(whProdAttrParamTable)', function(obj) {
        var layEvent = obj.event; //获得 lay-event 对应的值
        var data = obj.data; //获得当前行数据
        var tr = $(obj.tr)
        if (layEvent == 'update') {
            var confirmIndex = layer.confirm('确认修改?', { btn: ['确认', '取消'] },
                function() {
                    var Adata = {
                        id: data.id,
                        sort: tr.find('[name=sort]').val().trim(),
                        prodAttr: tr.find('[name=prodAttr]').val().trim(),
                        beginTime: tr.find('[name=beginTime]').val().trim(),
                        endTime: tr.find('[name=endTime]').val().trim(),
                        purchaseDlvrDays: tr.find('[name=purchaseDlvrDays]').val().trim(),
                        stockWarnCycle: tr.find('[name=stockWarnCycle]').val().trim()
                    }
                    if (Adata.prodAttr == '' || Adata.beginTime == '' || Adata.endTime == '' || Adata.purchaseDlvrDays == ''|| Adata.stockWarnCycle == '') {
                        layer.msg('所有参数都必须填写')
                        return
                    }
                    Adata.purchaseDlvrDays = parseInt(Adata.purchaseDlvrDays)
                    Adata.stockWarnCycle = parseInt(Adata.stockWarnCycle)

                    var ajax = new Ajax(true)
                    ajax.post({
                        url: ctx + "/whProdAttrParam/update.html",
                        data: JSON.stringify(Adata),
                        contentType: 'application/json',
                        success: function (data) {
                            if (data.code == '0000') {
                                search_prodAttrParam()
                            }
                        }
                    })
                },
                function () {
                    layer.close(confirmIndex)
                })
        } else if (layEvent == 'add') {
            var confirmIndex = layer.confirm('确认新增?', { btn: ['确认', '取消'] },
                function() {
                    var Adata = {
                        type: 1,
                        sort: tr.find('[name=sort]').val().trim(),
                        prodAttr: tr.find('[name=prodAttr]').val().trim(),
                        beginTime: tr.find('[name=beginTime]').val().trim(),
                        endTime: tr.find('[name=endTime]').val().trim(),
                        purchaseDlvrDays: tr.find('[name=purchaseDlvrDays]').val().trim(),
                        stockWarnCycle: tr.find('[name=stockWarnCycle]').val().trim()
                    }
                    if (Adata.prodAttr == '' || Adata.beginTime == '' || Adata.endTime == '' || Adata.purchaseDlvrDays == ''|| Adata.stockWarnCycle == '') {
                        layer.msg('所有参数都必须填写')
                        return
                    }
                    Adata.purchaseDlvrDays = parseInt(Adata.purchaseDlvrDays)
                    Adata.stockWarnCycle = parseInt(Adata.stockWarnCycle)


                    var ajax = new Ajax(true)
                    ajax.post({
                        url: ctx + "/whProdAttrParam/addOne.html",
                        data: JSON.stringify(Adata),
                        contentType: 'application/json',
                        success: function (data) {
                            if (data.code == '0000') {
                                search_prodAttrParam()
                            }
                        }
                    })
                },
                function () {
                    layer.close(confirmIndex)
                })
        } else if (layEvent == 'delete') {
            var confirmIndex = layer.confirm('确认删除?', { btn: ['确认', '取消'] },
                function() {
                    var Adata = {
                        id: data.id
                    }

                    var ajax = new Ajax(true)
                    ajax.post({
                        url: ctx + "/whProdAttrParam/delete.html",
                        data: JSON.stringify(Adata),
                        contentType: 'application/json',
                        success: function (data) {
                            if (data.code == '0000') {
                                search_prodAttrParam()
                            }
                        }
                    })
                },
                function () {
                    layer.close(confirmIndex)
                })
        }
    })


    // 展示长销款设置参数
    function search_whSalesParamStable() {
        table.render({
            elem: "#whSalesParamStableTable",
            id: 'whSalesParamStableTable',
            method: "post",
            url: ctx + "/whSalesParam/queryWhSalesParamStable",
            cols: [
                [
                    //标题栏
                    {field: 'sort',title: "排序ID",templet: `<div><input name="sort" class="layui-input" value="{{d.sort != null ? d.sort : ''}}"/></div>`},
                    {field: 'stepName',title: "阶级名称",templet: `<div><input name="stepName" class="layui-input" value="{{d.stepName != null ? d.stepName : ''}}"/></div>`},
                    {field: 'minDailySales',title: "最小日均销量(包含)",templet: `<div><input name="minDailySales" class="layui-input" value="{{d.minDailySales != null ? d.minDailySales : ''}}"/></div>`},
                    {field: 'maxDailySales',title: "最大日均销量(不包含)",templet: `<div><input name="maxDailySales" class="layui-input" value="{{d.maxDailySales != null ? d.maxDailySales : ''}}"/></div>`},
                    {field: 'minPurCost',title: "最小采购价￥(包含)",templet: `<div><input name="minPurCost" class="layui-input" value="{{d.minPurCost != null ? d.minPurCost : ''}}"/></div>`},
                    {field: 'maxPurCost',title: "最大采购价￥(不包含)",templet: `<div><input name="maxPurCost" class="layui-input" value="{{d.maxPurCost != null ? d.maxPurCost : ''}}"/></div>`},
                    {field: 'purchaseDlvrDay',title: "采购到货天数",templet: `<div><input name="purchaseDlvrDay" class="layui-input" value="{{d.purchaseDlvrDay != null ? d.purchaseDlvrDay : ''}}"/></div>`},
                    {field: 'stockWarnCycle',title: "库存预警周期",templet: `<div><input name="stockWarnCycle" class="layui-input" value="{{d.stockWarnCycle != null ? d.stockWarnCycle : ''}}"/></div>`},
                    {field: 'safeStock',title: "安全库存",templet: `<div><input name="safeStock" class="layui-input" value="{{d.safeStock != null ? d.safeStock : ''}}"/></div>`},
                    { title: '操作', align: 'center', toolbar: '#whSalesParamTool_purchaseconfig',width:150 }
                ],
            ],
            limit: 10000,
            unFixedTableHead: true, // 不固定表头
            page: false //是否显示分页
        });
    }
    search_whSalesParamStable()
    // 长销款设置参数表格操作
    table.on('tool(whSalesParamStableTable)', function(obj) {
        let layEvent = obj.event; //获得 lay-event 对应的值
        let data = obj.data; //获得当前行数据
        let tr = $(obj.tr)
        if (layEvent === 'update') {
            let confirmIndex = layer.confirm('确认修改?', { btn: ['确认', '取消'] },
                function() {
                    layer.close(confirmIndex)
                    let Adata = {
                        id: data.id,
                        sort: tr.find('[name=sort]').val().trim(),
                        stepName: tr.find('[name=stepName]').val().trim(),
                        minDailySales: tr.find('[name=minDailySales]').val().trim(),
                        maxDailySales: tr.find('[name=maxDailySales]').val().trim(),
                        minPurCost: tr.find('[name=minPurCost]').val().trim(),
                        maxPurCost: tr.find('[name=maxPurCost]').val().trim(),
                        purchaseDlvrDay: tr.find('[name=purchaseDlvrDay]').val().trim(),
                        stockWarnCycle: tr.find('[name=stockWarnCycle]').val().trim(),
                        safeStock: tr.find('[name=safeStock]').val().trim()
                    }
                    if (Adata.sort === '' ||Adata.stepName === '' || Adata.minDailySales === '' || Adata.maxDailySales === '' || Adata.minPurCost === '' || Adata.maxPurCost === ''
                        || Adata.purchaseDlvrDays === ''|| Adata.stockWarnCycle === ''|| Adata.safeStock === '') {
                        layer.msg('所有参数都必须填写')
                        return
                    }

                    oneAjax.post({
                        url: ctx + "/whSalesParam/updateWhSalesParamStable",
                        data: JSON.stringify(Adata),
                        contentType: 'application/json',
                        success: function (data) {
                            if (data.code === '0000') {
                                layer.msg('操作成功')
                                search_whSalesParamStable()
                            }
                        }
                    })
                },
                function () {
                    layer.close(confirmIndex)
                })
        } else if (layEvent === 'add') {
            let confirmIndex = layer.confirm('确认新增?', { btn: ['确认', '取消'] },
                function() {
                    layer.close(confirmIndex)
                    var Adata = {
                        id: data.id,
                        sort: tr.find('[name=sort]').val().trim(),
                        stepName: tr.find('[name=stepName]').val().trim(),
                        minDailySales: tr.find('[name=minDailySales]').val().trim(),
                        maxDailySales: tr.find('[name=maxDailySales]').val().trim(),
                        minPurCost: tr.find('[name=minPurCost]').val().trim(),
                        maxPurCost: tr.find('[name=maxPurCost]').val().trim(),
                        purchaseDlvrDay: tr.find('[name=purchaseDlvrDay]').val().trim(),
                        stockWarnCycle: tr.find('[name=stockWarnCycle]').val().trim(),
                        safeStock: tr.find('[name=safeStock]').val().trim()
                    }
                    if (Adata.sort === '' ||Adata.stepName === '' || Adata.minDailySales === '' || Adata.maxDailySales === '' || Adata.minPurCost === '' || Adata.maxPurCost === ''
                        || Adata.purchaseDlvrDays === ''|| Adata.stockWarnCycle === ''|| Adata.safeStock === '') {
                        layer.msg('所有参数都必须填写')
                        return
                    }

                    oneAjax.post({
                        url: ctx + "/whSalesParam/addOneWhSalesParamStable",
                        data: JSON.stringify(Adata),
                        contentType: 'application/json',
                        success: function (data) {
                            if (data.code === '0000') {
                                layer.msg('操作成功')
                                search_whSalesParamStable()
                            }
                        }
                    })
                },
                function () {
                    layer.close(confirmIndex)
                })
        } else if (layEvent === 'delete') {
            let confirmIndex = layer.confirm('确认删除?', { btn: ['确认', '取消'] },
                function() {
                    layer.close(confirmIndex)
                    let Adata = {
                        id: data.id
                    }

                    oneAjax.post({
                        url: ctx + "/whSalesParam/deleteWhSalesParamStable",
                        data: JSON.stringify(Adata),
                        contentType: 'application/json',
                        success: function (data) {
                            if (data.code === '0000') {
                                layer.msg('操作成功')
                                search_whSalesParamStable()
                            }
                        }
                    })
                },
                function () {
                    layer.close(confirmIndex)
                })
        }
    })

    // 展示长销款定义
    function search_whStableSalesDefinition() {
        table.render({
            elem: "#whStableSalesDefinitionTable",
            id: 'whStableSalesDefinitionTable',
            method: "post",
            url: ctx + "/whSalesParam/queryWhStableSalesDefinition",
            cols: [
                [
                    //标题栏
                    {field: 'dayOfCycle',title: "一个周期多少天",templet: `<div><input name="dayOfCycle" class="layui-input" value="{{d.dayOfCycle != null ? d.dayOfCycle : ''}}"/></div>`},
                    {field: 'totalCycle',title: "总共统计周期数",templet: `<div><input name="totalCycle" class="layui-input" value="{{d.totalCycle != null ? d.totalCycle : ''}}"/></div>`},
                    {field: 'hasSalesCycle',title: "有销量的周期数",templet: `<div><input name="hasSalesCycle" class="layui-input" value="{{d.hasSalesCycle != null ? d.hasSalesCycle : ''}}"/></div>`},
                    { title: '操作', align: 'center', toolbar: '#whSalesParamTool_purchaseconfig',width:150 }
                ],
            ],
            unFixedTableHead: true, // 不固定表头
            page: false, //是否显示分页
            limit: 10000
        });
    }
    search_whStableSalesDefinition()
    // 长销款定义表格操作
    table.on('tool(whStableSalesDefinitionTable)', function(obj) {
        let layEvent = obj.event; //获得 lay-event 对应的值
        let data = obj.data; //获得当前行数据
        let tr = $(obj.tr)
        if (layEvent === 'update') {
            let confirmIndex = layer.confirm('确认修改?', { btn: ['确认', '取消'] },
                function() {
                    layer.close(confirmIndex)
                    let Adata = {
                        id: data.id,
                        dayOfCycle: tr.find('[name=dayOfCycle]').val().trim(),
                        totalCycle: tr.find('[name=totalCycle]').val().trim(),
                        hasSalesCycle: tr.find('[name=hasSalesCycle]').val().trim()
                    }
                    if (Adata.dayOfCycle === '' ||Adata.totalCycle === '' || Adata.hasSalesCycle === '') {
                        layer.msg('所有参数都必须填写')
                        return
                    }

                    oneAjax.post({
                        url: ctx + "/whSalesParam/updateWhStableSalesDefinition",
                        data: JSON.stringify(Adata),
                        contentType: 'application/json',
                        success: function (data) {
                            if (data.code === '0000') {
                                layer.msg('操作成功')
                                search_whStableSalesDefinition()
                            }
                        }
                    })
                },
                function () {
                    layer.close(confirmIndex)
                })
        } else if (layEvent === 'add') {
            let confirmIndex = layer.confirm('确认新增?', { btn: ['确认', '取消'] },
                function() {
                    layer.close(confirmIndex)
                    let Adata = {
                        dayOfCycle: tr.find('[name=dayOfCycle]').val().trim(),
                        totalCycle: tr.find('[name=totalCycle]').val().trim(),
                        hasSalesCycle: tr.find('[name=hasSalesCycle]').val().trim()
                    }
                    if (Adata.dayOfCycle === '' ||Adata.totalCycle === '' || Adata.hasSalesCycle === '') {
                        layer.msg('所有参数都必须填写')
                        return
                    }

                    oneAjax.post({
                        url: ctx + "/whSalesParam/addOneWhStableSalesDefinition.html",
                        data: JSON.stringify(Adata),
                        contentType: 'application/json',
                        success: function (data) {
                            if (data.code === '0000') {
                                layer.msg('操作成功')
                                search_whStableSalesDefinition()
                            }
                        }
                    })
                },
                function () {
                    layer.close(confirmIndex)
                })
        } else if (layEvent === 'delete') {
            let confirmIndex = layer.confirm('确认删除?', { btn: ['确认', '取消'] },
                function() {
                    layer.close(confirmIndex)
                    let Adata = {
                        id: data.id
                    }

                    oneAjax.post({
                        url: ctx + "/whSalesParam/deleteWhStableSalesDefinition.html",
                        data: JSON.stringify(Adata),
                        contentType: 'application/json',
                        success: function (data) {
                            if (data.code === '0000') {
                                layer.msg('操作成功')
                                search_whStableSalesDefinition()
                            }
                        }
                    })
                },
                function () {
                    layer.close(confirmIndex)
                })
        }
    })


    function searchDynamicConfig() {
        oneAjax.post({
            url: '/whSalesParam/queryDynamicParam',
            data: {pageName: 'purchaseconfig',status: true},
            success: function (res) {
                if (res.code !== '0000') {
                    layer.msg('查询动态参数失败')
                    return
                }
                let list = res.data
                // 动态添加表格
                let tableElementList = ''
                for (let i = 0; i < list.length; ++i) {
                    let param = list[i]
                    let oneTable = `<div class="fl purchaseconfig_dynamicConfig" style="width: 50%">
                                        <input type="hidden" class="purchaseconfig_dynamicConfig_id" value="`+ param.id +`">
                                        <input type="hidden" class="purchaseconfig_isArray" value="`+ param.isArray +`">
                                        <div class="purchaseconfig_dynamicConfig_name">`+ param.paramName +`</div>
                                        <form autocomplete="off" class="layui-form" lay-filter="dynamicParamForm_`+ param.id +`">
                                            <div class="layui-card-body">
                                                <table class="layui-table" id="dynamicParam`+ param.paramType + `Table" lay-filter="dynamicParam`+ param.paramType + `Table"></table>
                                            </div>
                                        </form>
                                    </div>`
                    tableElementList += oneTable
                }
                tableElementList += ` <div class="clearLeft"></div>`
                let containsElement = $("#purchaseconfig_dynamicConfigContains")
                containsElement.html('')
                containsElement.append(tableElementList)
                // 渲染表格数据
                for (let i = 0; i < list.length; ++i) {
                    let param = list[i]
                    renderDynamicParamTable(param)
                }
            }
        })
    }

    function renderDynamicParamTable(dynamicParam) {
        let tableId = 'dynamicParam' + dynamicParam.paramType + 'Table'
        let data = JSON.parse(dynamicParam.totalJson)
        let cols = JSON.parse(dynamicParam.layuiCol)
        cols[0].push({ title: '操作', align: 'center', toolbar: '#dynamicParamTool_purchaseconfig',width:150 })
        if (!dynamicParam.isArray) {
            data = [data]
        }
        // 旧数据赋值id
        for (let i = 0; i < data.length; ++i) {
            data[i].id = i + 1
        }
        if (dynamicParam.ifAddPermit) {
            data.push({})
        }
        table.render({
            elem: "#" + tableId,
            id: tableId,
            data: data,
            cols: cols,
            limit: 10000,
            unFixedTableHead: true, // 不固定表头
            page: false, //是否显示分页
            done: function (res,r,s,d){
                let trList = $('#' + tableId).next('.layui-table-view').find('.layui-table-main tr[data-index]')
                for (let i = 0; i < trList.length; ++i) {
                    let tr = trList[i]
                    let selectElems = $(tr).find('select[name]')
                    if (!selectElems || !selectElems.length) {
                        return
                    }
                    let index = tr.getAttribute('data-index')
                    for (let s = 0; s < selectElems.length; ++s) {
                        let curSelect = selectElems[s]
                        let curName = curSelect.getAttribute('name')
                        if (!data[index][curName]) {
                            continue
                        }
                        curSelect.value = data[index][curName]
                    }
                }
                console.log(dynamicParam)
                form.render('select','dynamicParamForm_' + dynamicParam.id)
            }
        });
    }
    searchDynamicConfig()

    purchaseconfig_dynamicBtn = function(operType,self) {
        // 当前参数容器
        let configElem = $(self).closest('.purchaseconfig_dynamicConfig')
        // 当前参数数据
        let data = {
            id : configElem.find('.purchaseconfig_dynamicConfig_id').val()
        }
        let isArray = configElem.find('.purchaseconfig_isArray').val()
        // 表格数据
        let tableElem = $(self).closest('tbody')
        let totalJson
        let newOne = {}
        // 获取旧数据


        switch (operType){
            case 1:
                totalJson = getTableData(tableElem,false,null,isArray)
                break;
            case 2:
                // 获取当前行
                let curId = $(self).closest('tr').find('[dname=id]').val()
                totalJson = getTableData(tableElem,false,curId,isArray)
                break;
            case 3:
                totalJson = getTableData(tableElem,true,null,isArray)
                break;
        }
        console.log(totalJson)
        data.totalJson = JSON.stringify(totalJson)
        oneAjax.post({
            url: '/whSalesParam/updateDynamicParam',
            data: data,
            success: function (res) {
                if (res.code === '0000') {
                    layer.msg('操作成功')
                    searchDynamicConfig()
                }
            }
        })
    }


    /**
     * 获取表格数据
     * @param tableElem 数据所在表格元素, 这是个jquery对象
     * @param pushWithoutId 是否获取 无id的数据行
     * @param excludeId 需要排除的id
     * @param isArray 是否数组
     */
    function getTableData(tableElem, pushWithoutId, excludeId,isArray) {
        let trList = tableElem.find('tr')
        let data = []
        if (!trList) {
            return data
        }
        for (let i = 0; i < trList.length; ++i) {
            let tr = trList[i]
            let id = $(tr).find('[dname]').val()
            if (!pushWithoutId && !id) {
                continue
            }
            if (excludeId && excludeId === id) {
                continue
            }
            let filedInpList = $(tr).find('[name]')
            let one = {}
            for (let j = 0; j < filedInpList.length; ++j) {
                let filedInp = filedInpList[j]
                one[filedInp.getAttribute('name')] = filedInp.value
            }
            data.push(one)
        }
        if (isArray === 'false') {
            return data[0]
        }
        return data;
    }

});

// var sss = [
//     {field: 'day',title: "合并采购天数",templet: `<div><input name="day" class="layui-input" value="{{d.day != null ? d.day : ''}}"/></div>`},
//     {field: 'maxSaleSkuNum',title: "最大30天内有销量sku个数(不包含)",templet: `<div><input name="hasSaleSkuNum" class="layui-input" value="{{d.maxSaleSkuNum != null ? d.maxSaleSkuNum : ''}}"/></div>`},
//     {field: 'maxCost',title: "最大采购单价(不包含)",templet: `<div><input name="maxCost" class="layui-input" value="{{d.maxCost != null ? d.maxCost : ''}}"/></div>`},
//     {field: 'safeMoney',title: "<span title='当【预计可用金额-库存下限金额 <= 安全库存金额】，才允许合并采购'>安全库存金额￥</span>",templet: `<div><input name="safeMoney" class="layui-input" value="{{d.safeMoney != null ? d.safeMoney : ''}}"/></div>`},
//     {field: 'safeStock',title: "<span title='当【预计可用数量-库存下限数量 <= 安全库存数量】，才允许合并采购'>安全库存数量</span>",templet: `<div><input name="safeStock" class="layui-input" value="{{d.safeStock != null ? d.safeStock : ''}}"/></div>`},
//
// ]
//
// console.log(sss)
// var ttt = JSON.stringify(sss)
// console.log(ttt)
//
// console.log(JSON.parse(ttt))

