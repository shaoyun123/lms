var lazadamodifystockTUnit;
let lazadamodifystockTUnit_tableData,
    lazadamodifystockTUnit_thSelect = 0,
    lazadaIsSaleTUnit_thSelect = 0,
    lazadamodifystockTUnit_thInput = '';
layui.use(['admin', 'form', 'layer', 'table', 'formSelects', 'element', 'laydate'], function() {
    var form = layui.form,
        laytpl = layui.laytpl,
        table = layui.table;
    render_hp_orgs_users("#lazadamodifystockForm");
    form.render();
    var idList = localStorage.getItem('itemIds');
    var tableIns = {};
    if (idList) {
        lazadatable({ 'idList': idList });
    }

    function lazadatable(data) {
        commonReturnPromiseRes({
            url: ctx + "/lazadaBatchOperation/prodModifyStock.html",
            type: 'POST',
            params: data
        }).then(result=>{
            lazadamodifystockTUnit_tableData = result.data;
        tableIns = table.render({
            elem: "#lazadamodifyStockTable",
            data:result.data,
            // method: "post",
            // url: ctx + "/lazadaBatchOperation/prodModifyStock.html",
            // where: data,
            cols: [
                [
                    //标题栏
                    { type: "checkbox", width: 30 },
                    { title: '店铺', field: 'storeAcctName' },
                    { title: "item_id", field: 'itemId' },
                    { title: "店铺SKU", field: 'storeSubSku' },
                    { title: "商品SKU", field: 'prodSSku' },
                    { title: "<span style='display: flex'><span style='width: 190px;'>商品状态</span><select id='lazadaIsSaleTHeader' lay-filter='lazadaIsSaleTHeader'><option value='0'>全部</option><option value='1'>在售</option><option value='2'>停售</option></select></span>", field: 'isSale', templet: "#lazadastock_isSale"},
                    { title: "<span style='display: flex'><span style='width: 190px;'>当前库存</span><select id='lazadamodifystockTHeader' lay-filter='lazadamodifystockTHeader'><option value='0'>全部</option><option value='1'>=</option><option value='2'>≠</option></select><input class='layui-input' id='lazadamodifystockTHeader_input'></span>", field: 'stock' },
                    { title: "新库存", field: '', templet: "#lazadastock_priceInfo" },
                    { title: "操作结果", field: 'operationresult' },
                ],
            ],
            id: 'lazadamodifyStockTable',
            page: false,
            limit:result.count,
            height: 500,
            created: function(res) {},
            done: function(res,curr,count) {
                $('#lazadastockNum').text(count);
                $("#lazadamodifyStockTable").next().find(".layui-table-header").css('overflow','visible')
                $("[lay-filter='lazadamodifystockTHeader']").val(lazadamodifystockTUnit_thSelect)
                $("[lay-filter='lazadaIsSaleTHeader']").val(lazadaIsSaleTUnit_thSelect)
                $("#lazadamodifystockTHeader_input").val(lazadamodifystockTUnit_thInput)
                form.render("select")
            }
        });
        });
    }

    $('#lazadastockApply').click(function() {
        var newStock = $('#newStockpatch').val();
        if (newStock != "") {
            applytoReloadChecked('lazadamodifyStockTable', tableIns, function(tr) {
                $.trim(tr.find('.newStock').val(newStock)); //新的价格
            });
        } else {
            layer.msg('请输入新库存');
        }
    });

    $('#adjustpatch').click(function() {
        var prodObj = [];
        let checkFlag = false,alertMsg='';
        applytoReloadChecked('lazadamodifyStockTable', tableIns, function(tr, data, i) {
            var newStock = tr.find('.newStock').val();
            if(newStock!=""){
                if(data.stock == newStock){
                    alertMsg = "存在库存值相同，相同数据不提交修改api -----> ";
                }else{
                data.newStock  = newStock;
                prodObj.push(data);
                }
            }else{
                layer.msg("请填写新的库存");
                checkFlag = true
            }
        });
        if(checkFlag){
            return;
        }
        //以当前时间戳作为批次号
        var batchNo = new Date().getTime();
        if(prodObj.length>0){
            $.ajax({
                type: "POST",
                url: ctx + "/lazadaBatchOperation/batchAdjustStock.html",
                data: { 'prodObj': JSON.stringify(prodObj) ,'batchNo':batchNo},
                async: false,
                dataType: "json",
                success: function(returnData) {
                    clearInterval(lazadamodifystockTUnit);
                    if (returnData.code = "0000") {
                        layer.alert(alertMsg + returnData.msg);
                    }
                },
                error: function() {
                    clearInterval(lazadamodifystockTUnit);
                    layer.msg("服务器正忙");
                }
            });
            lazadamodifystockTUnit = setInterval(function () {
                sel(batchNo)
            }, 20000);
        }else{
            layer.msg('请选择要批量调整的数据');
        }
    });

    function sel(batchNo){
        var trObj =  $('#lazadamodifyStockTable').next().find('.layui-table-body tbody').find('tr');
        var count = 0;
        for (var i = 0; i < trObj.length; i++) {
            var checkStat = trObj.eq(i).find('td').eq(0).find('div').find('input').is(":checked");
            var resultMsg = trObj.eq(i).find('td').eq(8).find('.layui-table-cell').find('div').text();
            if ((resultMsg == '' || resultMsg == null) && checkStat) {
                count++;
            }
        }
        if(count == 0){
            clearInterval(lazadamodifystockTUnit);
            return;
        }

        $.ajax({
            type: "POST",
            url: ctx + "/sys/selectResult.html",
            data: {'batchNo':batchNo},
            async: true,
            dataType: "json",
            success: function (returnData) {
                if (returnData.code == "0000") {
                    var data = returnData.data;

                    for (var i = 0; i < trObj.length; i++) {
                        var itemId = $.trim(trObj.eq(i).find('td').eq(2).find('div').text());//平台商品Id
                        var prodStoreSku =  $.trim(trObj.eq(i).find('td').eq(3).find('div').text());//店铺sku
                        var checkStat = trObj.eq(i).find('td').eq(0).find('div').find('input').is(":checked");
                        var resultMsg = trObj.eq(i).find('td').eq(8).find('.layui-table-cell').find('div').text();

                        var logMsg = data['TR_LAZADA_MODIFY_STOCK_LOG' + itemId + prodStoreSku];
                        if ((resultMsg == '' || resultMsg == null) && checkStat) {
                            if (logMsg == '调整库存成功') {
                                trObj.eq(i).find('td').eq(8).find('.layui-table-cell').html("<div style='color:blue'>" + logMsg + "</div>");
                            } else if (logMsg != '' && logMsg != null && logMsg != 'undefined') {
                                trObj.eq(i).find('td').eq(8).find('.layui-table-cell').html("<div style='color:red'>" + logMsg + "</div>");
                            }
                        }
                    }
                }
            },
            error: function () {
                layer.msg("服务器正忙");
                clearInterval(lazadamodifystockTUnit);
            }
        });

    }

    form.on('submit(lazadaadjustSearch)', function(data) {
        var data = data.field;
        var storeAcct = data.storeAcctIdList;
        var list = [];
        if(storeAcct!=null && storeAcct!='') {
            data.storeAcctIdList = storeAcct;
        }else{
            $("#lazada_adjuststock_store").children().each(function () {
                if ($(this).val() != "") {
                    list.push($(this).val()) ;
                }
                data.storeAcctIdList = list.join(",");
            });
        }
        if(data.skuList.length>0 ) {
            if (data.skuList.split(",").length <= 100) {
            data.skuType == "0" ? data.sSkuList = data.skuList : data.pSkuList = data.skuList;
            lazadatable(data);
            }else {
                layer.msg("当前输入的sku个数超过了100,无法执行查询!");
            }
        }else {
            layer.msg("当前没有输入sku无法查询!");
        }
        return false;
    })
    // 商品状态
    form.on('select(lazadaIsSaleTHeader)', function (data) {
        // let newData = [];
        // lazadaIsSaleTUnit_thSelect = data.value;
        // if(data.value == '0'){
        //     newData = lazadamodifystockTUnit_tableData
        // }else if(data.value == '1'){
        //     newData = lazadamodifystockTUnit_tableData.filter(item => item.isSale == 1)
        // }else if(data.value == '2'){
        //     newData = lazadamodifystockTUnit_tableData.filter(item => item.isSale == 0)
        // }
        // table.reload('lazadamodifyStockTable', {data:newData})
        filterLazadaOnlineAdData()
    })
    //当前库存
    form.on('select(lazadamodifystockTHeader)', function (data) {
        // let newData = [],inputData = $("#lazadamodifystockTHeader_input").val();
        // if(inputData == '' && data.value != 0){
        //     return layer.msg("请输入对应的值！再次点击可查询！")
        // }
        // lazadamodifystockTUnit_thSelect = data.value;
        // lazadamodifystockTUnit_thInput = inputData;
        // if(data.value == '0'){
        //     newData = lazadamodifystockTUnit_tableData
        // }else if(data.value == '1'){
        //     newData = lazadamodifystockTUnit_tableData.filter(item => item.stock == inputData)
        // }else if(data.value == '2'){
        //     newData = lazadamodifystockTUnit_tableData.filter(item => item.stock != inputData)
        // }
        // table.reload('lazadamodifyStockTable', {data:newData})
        filterLazadaOnlineAdData()
    })
    // 商品状态&在线库存联动筛选
    function filterLazadaOnlineAdData(){
        let newData = [];
        let lazadaIsSaleTHeader = $("[lay-filter='lazadaIsSaleTHeader']").val(),
            lazadamodifystockTHeader = $("[lay-filter='lazadamodifystockTHeader']").val(),
            inputData = $("#lazadamodifystockTHeader_input").val();

        if(inputData == '' && lazadamodifystockTHeader != 0){
            return layer.msg("请输入对应的值！再次点击可查询！")
        }
        lazadamodifystockTUnit_thInput = inputData;
        lazadaIsSaleTUnit_thSelect = lazadaIsSaleTHeader; // 商品状态
        lazadamodifystockTUnit_thSelect = lazadamodifystockTHeader; // 当前库存
        newData = lazadamodifystockTUnit_tableData.filter(item => {
            if(lazadaIsSaleTHeader == '0'&&lazadamodifystockTHeader == '0'){
                return item
            }else if(lazadaIsSaleTHeader == '0'&&lazadamodifystockTHeader == '1'){
                return item.stock == inputData
            }else if(lazadaIsSaleTHeader == '0'&&lazadamodifystockTHeader == '2'){
                return item.stock != inputData
            }else if(lazadaIsSaleTHeader == '1'&&lazadamodifystockTHeader == '0'){
                return item.isSale == true
            }else if(lazadaIsSaleTHeader == '1'&&lazadamodifystockTHeader == '1'){
                return item.isSale == true&&item.stock == inputData
            }else if(lazadaIsSaleTHeader == '1'&&lazadamodifystockTHeader == '2'){
                return item.isSale == true&&item.stock != inputData
            }else if(lazadaIsSaleTHeader == '2'&&lazadamodifystockTHeader == '0'){
                return item.isSale == false
            }else if(lazadaIsSaleTHeader == '2'&&lazadamodifystockTHeader == '1'){
                return item.isSale == false&&item.stock == inputData
            }else if(lazadaIsSaleTHeader == '2'&&lazadamodifystockTHeader == '2'){
                return item.isSale == false&&item.stock != inputData
            }
        })
        table.reload('lazadamodifyStockTable', {data:newData})
    }
    // 一键调整
    $("#lazadaAdjustStock_newStockBySku").click(function(){
        let obj = serializeObject($('#lazadamodifystockForm'));

        if(obj.skuList.length > 0) {
            // if (obj.skuList.split(",").length <= 100) {
                obj.skuType == "0" ? obj.sSkuList = obj.skuList : obj.pSkuList = obj.skuList;
            // }else {
            //     layer.msg("当前输入的sku个数超过了100,无法执行查询!");
            //     return;
            // }
        }else {
            layer.msg("当前没有输入sku无法查询!");
            return;
        }
        lazadaAdjustStock_getStockBySku(obj).then(res => {
            let count = res.count
            let adjustStockIndex = layer.open({
                type: 1,
                id: Date.now(),
                title: '调整库存',
                area: ['400px', '245px'],
                btn: !!count && count != 0 ? ["确认", "取消"] : "",
                success: function (layero) {
                    laytpl($('#lazadaAdjustStockBySkuModal').html()).render({count: count}, function (html) {
                        $(layero).find('.layui-layer-content').html(html)
                    })
                },
                yes: function (index, layero) {
                    let _stock = $("#lazadaAdjustStockBySkuForm input[name=count]").val()
                    if (_stock == '') return layer.msg('请填写调整库存量')
                    obj.newStock = _stock
                    lazadaAdjustStock_sureToBatchUpdateStock(obj)
                        .then(res => {
                            layer.close(adjustStockIndex)
                            layer.msg(res.msg||'操作成功', { icon: 1 })
                        }).catch(err => layer.msg(err.msg, { icon: 2 }))
                },
                end: function () { }
            })
        }).catch(err => layer.msg(err.msg, { icon: 2 }))
    })

    // 数量查询接口
    // obj ： Object
    function lazadaAdjustStock_getStockBySku(obj){
        // return commonReturnPromise({
        //     url: `/lms/lazadaBatchOperation/searchBatchUpdateStockCounts.html`,
        //     type: 'POST',
        //     params:JSON.stringify(obj)
        // })

        if(obj.storeAcctIdList==null || obj.storeAcctIdList=='') {
            let list = []
            $("#lazada_adjuststock_store").children().each(function () {
                if ($(this).val() != "") {
                    list.push($(this).val()) ;
                }
                obj.storeAcctIdList = list.join(",");
            });
        }
        var formData = new FormData();
        for(let key in obj){
            formData.append(key,obj[key])
        }
        return new Promise(function(resolve, reject) {
            $.ajax({
                type: 'POST',
                dataType: 'json',
                url: '/lms/lazadaBatchOperation/searchBatchUpdateStockCounts.html',
                cache: false,
                processData: false,
                contentType: false,
                data: formData,
                success: function(res) {
                    loading.hide();
                    if (res.code == '200') {
                        resolve(res)
                    } else {
                        reject(res)
                    }
                },
                error: function(err) {
                    loading.hide();
                    reject(err);
                }
            })
        })
    }

    // 确认一键调整库存接口
    // obj ： Object
    function lazadaAdjustStock_sureToBatchUpdateStock(obj){
        // return commonReturnPromise({
        //     url: `/lms/lazadaBatchOperation/sureToBatchUpdateStock.html`,
        //     type: 'POST',
        //     params:JSON.stringify(obj)
        // })
        var formData = new FormData();
        for(let key in obj){
            formData.append(key,obj[key])
        }
        return new Promise(function(resolve, reject) {
            $.ajax({
                type: 'POST',
                dataType: 'json',
                url: '/lms/lazadaBatchOperation/sureToBatchUpdateStock.html',
                cache: false,
                processData: false,
                contentType: false,
                data: formData,
                success: function(res) {
                    loading.hide();
                    if (res.code == '0000') {
                        resolve(res)
                    } else {
                        reject(res)
                    }
                },
                error: function(err) {
                    loading.hide();
                    reject(err);
                }
            })
        })
    }
});