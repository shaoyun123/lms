var lazadaAdjustProPriceTimeUnit,LazadaPriceTableData;
layui.use(['admin', 'form', 'layer', 'table', 'formSelects', 'element', 'laydate'], function() {
    var form = layui.form,
        formSelects = layui.formSelects,
        table = layui.table;
    render_hp_orgs_users("#lazadamodifypriceAndPromoForm");
    form.render();
    // var idList = localStorage.getItem('itemIds');
    let checkData_p = layui.table.checkStatus("lazada_online_data_table").data,checkData_p_arr = [];
    checkData_p.forEach(item => checkData_p_arr.push(item.id))
    let idList = checkData_p_arr.join(",")
    var tableIns = {};
    if (idList) {
        getLazadapricetable({ 'idList': idList });
    }

    //lazada站点初始化渲染
    adjustpriceAndpromotion_initLazadaSite(); //初始化lazada站点下拉框
    function adjustpriceAndpromotion_initLazadaSite() {
        $.ajax({
            type: "get",
            url: "/lms/onlineProductLazada/getAllSite.html",
            dataType: "json",
            success: function(returnData) {
                if (returnData.code == "0000") {
                    var sites = [];
                    $(returnData.data).each(function() {
                        var a = { name: this.name, value: this.code };
                        sites.push(a);
                    });
                    formSelects.data('adjustpriceAndpromotion_site_sel', 'local', { arr: sites })
                    form.render();
                } else {
                    layer.msg(returnData.msg);
                }
            },
            error: function() {
                layer.msg("服务器异常", { icon: 5 });
            }
        });
    };

    function getLazadapricetable(searchData) {
        commonReturnPromise({
            url: ctx + "/lazadaBatchOperation/searchModifyMainPrice.html",
            params: searchData,
            type: "post",
        }).then(res => {
            LazadaPriceTableData = res
            lazadapricetable(res)
        })
    }

    function lazadapricetable(data) {
        tableIns = table.render({
            elem: "#lazadamodifypricetable",
            // method: "post",
            // url: ctx + "/lazadaBatchOperation/searchModifyMainPrice.html",
            // where: data,
            data: data,
            height: 500,
            cols: [
                [
                    //标题栏
                    { type: "checkbox", width: 30 },
                    { title: '店铺', field: 'storeAcctName' },
                    { title: "item_id", field: 'itemId' },
                    { title: "店铺SKU", field: 'storeSubSku' },
                    { title: "商品SKU", field: 'prodSSku' },
                    { title: "7/30/60/90/180天销量", templet: "#lazada_sales" },
                    { title: "原价", field: 'price' },
                    { title: "新原价", field: 'newPrice', templet: "#lazada_newprice" },
                    { title: "当前促销价", field: 'specialPrice' },
                    { title: "新促销价", field: 'newSpecialPrice', templet: "#lazada_newSpecialprice" },
                    { title: "促销差价", field: 'promotionSpreadPrice' },
                    { title: "促销价差价幅度", field: 'specialPriceDiffPercent', templet: "#lazada_specialPriceDiffPercent" },
                    { title: "是否促销", field: 'isPromotion ', templet: "<div>{{isPromotion(d.isPromotion.toString()||'')}}</div>" },
                    { title: "操作结果", field: 'operationresult' },
                ],
            ],
            id: 'lazadamodifypricetable',
            // page: true,
            // limits: [100, 500, 1000],
            // created: function(res) {},
            done: function(res) {
                $('#lazadapriceNum').text(res.count);
            },
            limit: data.length
        });
    }
    //校验价格输入不能低于0

    $('#lay_lazadamodifyprice input[name="newPriceInput"]').change(function() {
        if (parseFloat($(this).val()) < 0) {
            $(this).val("");
        }
    });
    /**
     * 一键写入价格值
     */
    $("#lazadapricenewPriceBtn").click(function() {
        var newPrice = $("#lazadamodifypriceAndPromoForm input[name='newPriceInput']").val();
        //获取表格行对象
        var calType = $("#lazadamodifypriceAndPromoForm select[name='calculateType']").val();
        var modifyType = $("#lazadamodifypriceAndPromoForm select[name='modifyType']").val();
        if (newPrice !== '') {
            applytoChecked('lazadamodifypricetable', tableIns, function(tr, data, i) {
                var originprice = modifyType == "0" ? tr.find('td[data-field="price"] div').text() : tr.find('td[data-field="specialPrice"] div').text();
                var input = modifyType == "0" ? tr.find('td[data-field="newPrice"] div input') : tr.find('td[data-field="newSpecialPrice"] div input');
                calculatePrice(calType, originprice, newPrice, input); //新的价格

                // 调整促销价格的时候 0==>原价1==>促销价
                if(modifyType == "1"){
                    let newSpecialprice = tr.find('.newSpecialprice').val(),str='';
                    let promotionSpreadPrice = (newSpecialprice-originprice).toFixed(2)
                    tr.find('td[data-field="promotionSpreadPrice"] div').text(promotionSpreadPrice)
                    let specialPriceDiffPercent = (100*(promotionSpreadPrice/originprice)).toFixed(2)
                    if(specialPriceDiffPercent > 20 || specialPriceDiffPercent < -20){
                        str = `<span style="color:red;">${specialPriceDiffPercent}%</span>`
                    }else{
                        str = `<span>${specialPriceDiffPercent}%</span>`
                    }
                    tr.find("[data-field=specialPriceDiffPercent] div").html(str)
                }

            });
        } else {
            layer.msg('请输入调整的价格');
        }
    });
    //选自对应计算类型计算修改后的价格
    function calculatePrice(calType, originprice, newprice, input) {
        switch (calType) {
            case "1":
                var finalprice = (parseFloat(originprice) + parseFloat(newprice)).toFixed(2);
                input.val(finalprice); //新的价格
                break;
            case "2":
                var finalprice = (parseFloat(originprice) - parseFloat(newprice)).toFixed(2);
                if (finalprice > 0) {
                    input.val(finalprice); //新的价格
                } else {
                    input.val("");
                    layer.msg('价格调整不得低于0');
                }
                break;
            case "3":
                var finalprice = (parseFloat(originprice) * parseFloat(newprice)).toFixed(2);
                input.val(finalprice); //新的价格
                break;
            default:
                input.val(newprice);
        }
    }

    $('#lazadapricebatchUpadatePrice').click(function() {
        var prodObj = [];
        let checkData = layui.table.checkStatus("lazadamodifypricetable").data
        if(checkData.length == 0){
            layer.msg('请选择需要修改的数据');
            return false;
        }

        checkData.forEach(item => {
            let newSpecialPrice = $("[name=newSpecialprice"+ item.id +"]").val();
            let newprice = $("[name=newprice"+ item.id +"]").val();
            item.newSpecialPrice = newSpecialPrice
            item.newPrice = newprice
        })
        prodObj = checkData
        // applytoChecked('lazadamodifypricetable', tableIns, function(tr, data, i) {
        //     var newspecial = tr.find('td[data-field="newSpecialPrice"] div input').val();
        //     var newprice = tr.find('td[data-field="newPrice"] div input').val();
        //     var modifyType = $("#lazadamodifypriceAndPromoForm select[name='modifyType']").val();
        //     var price = modifyType == 0 ? newprice : newspecial;
        //     data.newSpecialPrice = newspecial;
        //     data.newPrice = newprice;
        //     prodObj.push(data);
        // });
        if (prodObj.length > 0) {
            let skuArr = [],newProdObj = [];
            for (let i=0,len=prodObj.length;i<len;i++) {
                if (prodObj[i].newSpecialPrice == "" || prodObj[i].newSpecialPrice == "0.00" || prodObj[i].newSpecialPrice == "0") {
                    layer.msg('请填入修改的价格');
                    return false;
                }
                if (prodObj[i].newSpecialPrice*1 < 0) {
                    layer.msg('修改的价格必须大于0');
                    return false;
                }
                // 差价超出范围，删除此条数据
                if(Math.abs(prodObj[i].newSpecialPrice-prodObj[i].specialPrice)/Math.min(prodObj[i].newSpecialPrice,prodObj[i].specialPrice) > 10){
                    skuArr.push(prodObj[i].prodSSku)
                }else{
                    newProdObj.push(prodObj[i])
                }
            }

            if(skuArr.length != 0){
                layer.open({
                    type:1,
                    title: '注意'
                    ,content: '<div style="padding:10px">部分商品调价成功，调价异常商品请联系技术人员处理。<b>价格异常</b><br>'+skuArr.join(",")+"</div>"
                });
            }
            if(newProdObj.length == 0){
                return false;
            }
            //以当前时间戳作为批次号
            var batchNo = new Date().getTime();
            $.ajax({
                type: "POST",
                url: ctx + "/lazadaBatchOperation/batchAdjustPriceAndPromotionPrice.html",
                data: { 'prodObj': JSON.stringify(newProdObj), 'batchNo': batchNo },
                async: false,
                dataType: "json",
                success: function(returnData) {
                    if (returnData.code = "0000") {
                        layer.msg(returnData.msg);
                    }
                },
                error: function() {
                    clearInterval(lazadaAdjustProPriceTimeUnit);
                    layer.msg("服务器正忙");
                }
            });
            lazadaAdjustProPriceTimeUnit = setInterval(function() {
                sel(batchNo)
            }, 20000);
        } else {
            layer.msg('请选择要批量调整的数据');
        }
    });

    function sel(batchNo) {
        var trObj = $('#lazadamodifypricetable').next().find('.layui-table-body tbody').find('tr');
        var count = 0;
        for (var i = 0; i < trObj.length; i++) {
            var checkStat = trObj.eq(i).find('td').eq(0).find('div').find('input').is(":checked");
            var resultMsg = trObj.eq(i).find('td').eq(13).find('.layui-table-cell').find('div').text();
            if ((resultMsg == '' || resultMsg == null) && checkStat) {
                count++;
            }
        }
        if (count == 0) {
            clearInterval(lazadaAdjustProPriceTimeUnit);
            return;
        }

        $.ajax({
            type: "POST",
            url: ctx + "/sys/selectResult.html",
            data: { 'batchNo': batchNo },
            async: true,
            dataType: "json",
            success: function(returnData) {
                if (returnData.code == "0000") {
                    var data = returnData.data;

                    for (var i = 0; i < trObj.length; i++) {
                        var itemId = $.trim(trObj.eq(i).find('td').eq(2).find('div').text()); //平台商品Id
                        var prodStoreSku = $.trim(trObj.eq(i).find('td').eq(3).find('div').text()); //店铺sku
                        var checkStat = trObj.eq(i).find('td').eq(0).find('div').find('input').is(":checked");
                        var resultMsg = trObj.eq(i).find('td').eq(13).find('.layui-table-cell').find('div').text();

                        var logMsg = data['TR_LAZADA_ADJUSTPRICE_LOG' + itemId + prodStoreSku];
                        if ((resultMsg == '' || resultMsg == null) && checkStat) {
                            if (logMsg == '调价成功') {
                                trObj.eq(i).find('td').eq(13).find('.layui-table-cell').html("<div style='color:blue'>" + logMsg + "</div>");
                            } else if (logMsg != '' && logMsg != null && logMsg != 'undefined') {
                                trObj.eq(i).find('td').eq(13).find('.layui-table-cell').html("<div style='color:red'>" + logMsg + "</div>");
                            }
                        }
                    }
                }
            },
            error: function() {
                layer.msg("服务器正忙");
                clearInterval(lazadaAdjustProPriceTimeUnit);
            }
        });

    }

    form.on('submit(lazadamodifypriceSearch)', function(data) {
        var data = data.field;
        var storeAcct = data.storeAcctIdList;
        var list = [];
        if (storeAcct != null && storeAcct != '') {
            data.storeAcctIdList = storeAcct;
        // } else {
        //     $("#lazada_adjustpriceAndtpromotion_store").children().each(function() {
        //         if ($(this).val() != "") {
        //             list.push($(this).val());
        //         }
        //         data.storeAcctIdList = list.join(",");
        //     });
        }
        //ztt修改-判断出错,输入SKU的数量,不是sku长度啊,逻辑未动,只改了这一处,其他bug和这个无关
        let skuListArr = data.skuList.split(',');
        if (data.skuList!='' && skuListArr.length <= 1000) {
            data.skuType == "0" ? data.sSkuList = data.skuList : data.pSkuList = data.skuList;
            getLazadapricetable(data);
        } else {
            let checkData_p = layui.table.checkStatus("lazada_online_data_table").data,checkData_p_arr = [];
            checkData_p.forEach(item => checkData_p_arr.push(item.id))
            data.idList = checkData_p_arr.join(",")
            getLazadapricetable(data);
        }
        return false;
    })

    $("#lazadamodifypriceFilter").click(function(){
        let searchData = serializeObject($('#lazadamodifypriceAndPromoForm'));
        let tableData = LazadaPriceTableData;
        tableData.forEach(item => {
            if($("#lazadamodifypricetable").next().find("[name=newprice"+  item.id +"]").length != 0){
                item.newPrice = $("#lazadamodifypricetable").next().find("[name=newprice"+  item.id +"]").val()*1;
                item.newSpecialPrice = $("#lazadamodifypricetable").next().find("[name=newSpecialprice"+  item.id +"]").val()*1;
                item.promotionSpreadPrice = (item.newSpecialPrice - item.specialPrice*1).toFixed(2);
                item.specialPriceDiffPercent = (100*(item.promotionSpreadPrice/(item.specialPrice*1))).toFixed(2)
            }
        })
        console.log(tableData)
        // sku
        if(searchData.skuList != ''){ // skuType: 0-子sku[prodSSku]；1-父sku[prodPSku]
            let skuList = searchData.skuList.split(",")
            if(searchData.skuType == 0){
                tableData = tableData.filter(item => skuList.includes(item.prodSSku))
            }else if(searchData.skuType == 1){
                tableData = tableData.filter(item => skuList.includes(item.prodPSku))
            }
        }
        // 店铺 storeAcctIdList
        if(searchData.storeAcctIdList != ''){
            tableData = tableData.filter(item => searchData.storeAcctIdList == item.storeAcctId)
        }
        // 促销差价 symbol promotionSpreadPrice[promotionSpreadPrice]
        if(searchData.promotionSpreadPrice != ''){
            tableData = tableData.filter(item => {
                if(searchData.symbol == '>'){
                    return item.promotionSpreadPrice > searchData.promotionSpreadPrice*1
                }else if(searchData.symbol == '<'){
                    return item.promotionSpreadPrice < searchData.promotionSpreadPrice*1
                }else if(searchData.symbol == '='){
                    return item.promotionSpreadPrice == searchData.promotionSpreadPrice*1
                }else if(searchData.symbol == '!='){
                    return item.promotionSpreadPrice != searchData.promotionSpreadPrice*1
                }
            })
        }
        // 促销差价幅度
        if(searchData.specialPriceDiffPercentGte != '' || searchData.specialPriceDiffPercentLte !=''){
            tableData = tableData.filter(item => {
                if(searchData.specialPriceDiffPercentGte != '' && searchData.specialPriceDiffPercentLte !=''){
                    return item.specialPriceDiffPercent >= searchData.specialPriceDiffPercentGte*1 && item.specialPriceDiffPercent <= searchData.specialPriceDiffPercentLte*1
                }else if(searchData.specialPriceDiffPercentGte != ''){
                    return item.specialPriceDiffPercent >= searchData.specialPriceDiffPercentGte*1
                }else if(searchData.specialPriceDiffPercentLte !=''){
                    return item.specialPriceDiffPercent <= searchData.specialPriceDiffPercentLte*1
                }
            })
        }
        // 7/30/60/90/180 saleChoice: "1";saleGte: "123";saleLte: "456"
        if(searchData.saleGte != '' || searchData.saleLte != '') {
            tableData = tableData.filter(item => {
                let arr = ['sevenSales', 'thirtySales', 'sixtySales', 'ninetySales', 'hundredOfEightySales']
                if (searchData.saleGte != '' && searchData.saleLte != '') {
                    return item[arr[searchData.saleChoice * 1]] >= searchData.saleGte * 1 && item[arr[searchData.saleChoice * 1]] <= searchData.saleGte * 1
                } else if (searchData.saleGte != '') {
                    return item[arr[searchData.saleChoice * 1]] >= searchData.saleGte * 1
                } else if (searchData.saleLte != '') {
                    return item[arr[searchData.saleChoice * 1]] <= searchData.saleLte * 1
                }
            })
        }
        lazadapricetable(tableData)
    })
});

// 是否促销
function isPromotion(str) {
    var obj = { '0': '否', '1': '是', '': '' }
    return obj[str];
}

function lazadaOnline_adjustpriceAndPro(dom) {
    let oldSpecialPrice = $(dom).data("specialprice")*1,newSpecialPrice = $(dom).val()*1;
    let promotionSpreadPrice = (newSpecialPrice - oldSpecialPrice).toFixed(2);
    let specialPriceDiffPercent = (100*(promotionSpreadPrice/oldSpecialPrice)).toFixed(2),str = '';
    $(dom).parents("tr").find("[data-field=promotionSpreadPrice] div").text(promotionSpreadPrice)
    if(specialPriceDiffPercent > 20 || specialPriceDiffPercent < -20){
        str = `<span style="color:red;">${specialPriceDiffPercent}%</span>`
    }else{
        str = `<span>${specialPriceDiffPercent}%</span>`
    }
    $(dom).parents("tr").find("[data-field=specialPriceDiffPercent] div").html(str)
}