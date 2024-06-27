/**
 * 调价
 */
var amasontableIns = {};
layui.use(['admin', 'form', 'layer', 'table', 'formSelects', 'element', 'laydate'], function() {
    var admin = layui.admin,
        form = layui.form,
        layer = layui.layer,
        table = layui.table,
        formSelects = layui.formSelects,
        element = layui.element,
        laydate = layui.laydate,
        laypage = layui.laypage,
        $ = layui.$;
    render_hp_orgs_users("#amazon_theShelves_searchForm"); //渲染部门销售员店铺三级联动
    form.render(null, 'component-form-element');
    form.render(null, 'component-form-group');
    formSelects = layui.formSelects
    form.render('select');
    form.render('checkbox');
    form.render('radio');

    //表格渲染结果
    //展示已知数据
    var data = new Object();
    let idList = '',pidList = '',idListArr = [],pidListArr = [];
    if (stopAmazonArr.length > 0) {
        data.idList = [];
        data.pidList = [];
        for (var i = 0; i < stopAmazonArr.length; i++) {
            if(stopAmazonArr[i].id != null && stopAmazonArr[i].id!=''){
                data.idList.push(stopAmazonArr[i].id);
            }else{
                data.pidList.push(stopAmazonArr[i].pId)
            }
            idListArr.push(stopAmazonArr[i].id)
            pidListArr.push(stopAmazonArr[i].pId)
        }
        data.idList = data.idList.join(",");
        data.pidList = data.pidList.join(",");
        idList = idListArr.join(",");
        pidList = pidListArr.join(",");
    }
    if (stopAmazonArr.length > 0) {
        tableReload(data);
    }
    if (timeUnit != null) {
        clearInterval(timeUnit); //清除定时查询进度
    }

    // let amazonCurr_idList = [],amazonCurr_pIdList = [];
    let amazon_searchTableData = []
    function tableReload(data) {
        amasontableIns = table.render({
            elem: "#amazonModifyPriceTable",
            method: 'post',
            url: ctx + "/amazonBatchOperationController/searchModifyMainPrice.html",
            cols: [
                [
                    { type: "checkbox" },
                    { field: "id", title: "id" },
                    { field: "storeAcctId", title: "店铺id" },
                    { field: "storeAcct", title: "店铺", width: 200 },
                    { field: "prodSSku", title: "商品子SKU", width: 200 },
                    { field: "storeSSku", title: "店铺子SKU", width: 200 },
                    { field: "asin", title: "asin", width: 200 },
                    { field: "siteId", title: "站点", width: 60 },
                    { field: "listingPrice", title: "当前刊登价" },
                    { field: "newPrice", title: "新刊登价", templet: '#new_price' },
                    { field: "diffirencePrice", title: "差价"},
                    { field: "result", title: '操作结果' }
                ]
            ],
            page: false,
            where: data,
            id: "amazonModifyPriceTable",
            limit: 10000,
            done: function(res, curr, count) {
                $("[data-field='id']").css('display', 'none');
                $("[data-field='storeAcctId']").css('display', 'none');
                $("#tolnum_span_amazon_price").text("共" + count + "条");
                amazon_searchTableData = res.data


                $('input[id="adjustprice"]').blur(function() {
                    var newPrice = parseFloat($(this).val());
                    var id = $(this).parent().parent().parent().find('td[data-field="id"] div').text()
                    if (newPrice < 0) {
                      layer.msg('新刊登价不可调整为小于0');
                      $(this).val(0);
                      return false;
                    }
                    var originPrice = $(this).parents('td').siblings('td[data-field="listingPrice"]').find('div').text();
                    var diffPriceVal = (parseFloat(newPrice)-parseFloat(originPrice)).toFixed(2);
                    $(this).parents('td').siblings('td[data-field="diffirencePrice"]').find('div').text(diffPriceVal);
 
                    amazon_searchTableData.forEach(item => {
                    if (item.id == id) {
                      item.newPrice = newPrice
                      item.diffirencePrice = diffPriceVal
                    }
                    })
                  })
                // amazonCurr_idList = [];
                // amazonCurr_pIdList = [];
                // res.data.map(item => {
                //     if(item.id){
                //         amazonCurr_idList.push(item.id)
                //     }else{
                //         amazonCurr_pIdList.push(item.pId)
                //     }
                // })

            }
        });
    }
    var active = {
        reload: function() {
            var data = new Object();
            data.storeAcctIdList = [];
            data.sSkuList = [];
            data.pSkuList = [];
            var logisAttrContents = formSelects.value("amazon_mm_store_sel");
            for (var i = 0; i < logisAttrContents.length; i++) {
                var logisAttr = logisAttrContents[i].value;
                data.storeAcctIdList.push($.trim(logisAttr));
            }
            var skuStr = $.trim($("#amazon_theShelves_searchForm input[name='skuList']").val());
            if ($("#amazonModPrice_is_pAnds_sku").val() == 0) {
                if (skuStr != "" && skuStr != null) {
                    data.sSkuList = $.trim(skuStr.split(","));
                }
            } else {
                if (skuStr != "" && skuStr != null) {
                    data.pSkuList = $.trim(skuStr.split(","));
                }
            }

            data.storeAcctIdList = $.trim(data.storeAcctIdList);
            var salepersonId = $.trim($("#amazon_theShelves_searchForm select[name='saleName']").val());
            data.salepersonId = salepersonId;
            data.searchType = $("#amazon_idEnable_skuSearchType").val(); //搜索类型
            if(skuStr == ''){
                return layer.msg("请输入商品sku")
            }
            tableReload(data);
        }
    };
    $("#amazonModifyPirceSearchBtn").click(function() {
        var type = $(this).data('type');
        active[type] ? active[type].call(this) : '';
    });
    $("#amazonModifyPirceResetBtn").click(function() {
        $("#amazon_theShelves_searchForm input[name='sSku']").val('');
        formSelects.value('selectAttr', [])
    });

    //校验价格输入不能低于0

    $('input[name="newPriceInput"]').change(function() {
        if (parseFloat($(this).val()) < 0) {
            $(this).val("");
        }
    });

    function amazonModifyTableReload(data,searchBool) {
        if(data == "srting"){
           data = []
        }
        amasontableIns = table.render({
            elem: "#amazonModifyPriceTable",
            cols: [
                [
                    { type: "checkbox" },
                    { field: "id", title: "id" },
                    { field: "storeAcctId", title: "店铺id" },
                    { field: "storeAcct", title: "店铺", width: 200 },
                    { field: "prodSSku", title: "商品子SKU", width: 200 },
                    { field: "storeSSku", title: "店铺子SKU", width: 200 },
                    { field: "asin", title: "asin", width: 200 },
                    { field: "siteId", title: "站点", width: 60 },
                    { field: "listingPrice", title: "当前刊登价" },
                    { field: "newPrice", title: "新刊登价", templet: '#new_price' },
                    { field: "diffirencePrice", title: "差价"},
                    { field: "result", title: '操作结果' }
                ]
            ],
            page: false,
            limit:10000,
            data:data,
            id: "amazonModifyPriceTable",
            done: function(res, curr, count) {
                $("[data-field='id']").css('display', 'none');
                $("[data-field='storeAcctId']").css('display', 'none');
                $("#tolnum_span_amazon_price").text("共" + count + "条");
                if(searchBool == true){
                    amazon_searchTableData = res.data
                }
            }
        });
    }

    /**
     * 一键写入价格值
     */
    $("#newPriceBtn").click(function() {
        var checkStatus = table.checkStatus('amazonModifyPriceTable');
        var grossProfitRate = $.trim($("#applyForm input[name='grossProfitRate']").val());
        var newPrice = $.trim($("#applyForm input[name='newPriceInput']").val());
        let minDifPrice = $.trim($("#applyForm input[name='minDifPrice']").val());
        let maxDifPrice = $.trim($("#applyForm input[name='maxDifPrice']").val());

        if(grossProfitRate != '' && newPrice != ''){
            return layer.msg('当前价格和毛利润不能同时有值，请确认！');
        }
        
        if (checkStatus.data.length > 0 && amasontableIns) {
            var layFilterIndex = 'LAY-table-' + amasontableIns.config.index;
            var tableContainer = $('div[lay-filter="' + layFilterIndex + '"]');
            //获取表格行对象
            // 运算符1+2-3*4=
            let calTypeArr = ["0","+","-","*","="]
            var calType = $("#applyForm select[name='calculateType']").val()
            if (newPrice !== ''||grossProfitRate !== ''||minDifPrice != ''||maxDifPrice!='') { // 当前价格，前端计算
            //     tableContainer.find('input[name="layTableCheckbox"]:checked').each(function() {
            //         var tr = $(this).parents('tr');
            //         var originprice = tr.find('td[data-field="listingPrice"] div').text();
            //         var input = tr.find('td[data-field="newPrice"] div input');
            //         calculatePrice(calType, originprice, newPrice, input);
            //     });
            // } else if (grossProfitRate !== ''){ // 毛利率，请求接口计算
                // asinList：选中的数据asin数组
                // grossProfitRate: 毛利潤值（百分之二十填20）
                // operator: 运算符
                // operatorValue：运算值
                let obj = {
                    // "asinList":layui.table.cache.amazonModifyPriceTable.map(item => item.asin),
                    "pageIdList":layui.table.cache.amazonModifyPriceTable.map(item => item.id),
                    "grossProfitRate":grossProfitRate,
                    "operator":calTypeArr[calType],
                    "operatorValue":newPrice,
                    "idList":layui.table.checkStatus("amazonModifyPriceTable").data.map(item => item.id),
                    "minDifPrice":minDifPrice,
                    "maxDifPrice":maxDifPrice
                }

                commonReturnPromiseRes({
                    url: ctx + `/amazonBatchOperationController/applyAllProdPrice.html`,
                    type: 'post',
                    contentType: 'application/json',
                    params: JSON.stringify(obj)
                }).then(res=>{
                    if(res.code == "0000"){
                        amazonModifyTableReload(res.data,true)
                    }
                }).catch(res=>{
                    amazonModifyTableReload([],true)
                })
            }else {
                layer.msg('请输入调整的价格');
            }
        } else {
            layer.msg('请选择需要调价的商品')
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

    // 筛选
    $("#amazonFilter").click(function(){
        let minDifPrice = $.trim($("#applyForm input[name='minDifPrice']").val());
        let maxDifPrice = $.trim($("#applyForm input[name='maxDifPrice']").val());

        let tableData = amazon_searchTableData.filter((item,index)=>{
            if(minDifPrice!=''&&maxDifPrice!=''){
                return minDifPrice < item.diffirencePrice&&item.diffirencePrice < maxDifPrice
            }else if(minDifPrice!=''){
                return minDifPrice < item.diffirencePrice
            }else if(maxDifPrice!=''){
                return item.diffirencePrice < maxDifPrice
            }
        })
        amazonModifyTableReload(tableData,false)
        // let tableData = layui.table.cache.amazonModifyPriceTable;
        // commonReturnPromiseRes({
        //     url:ctx+'/amazonBatchOperationController/differencePriceFilter?priceMax='+ maxDifPrice + '&priceMin='+ minDifPrice,
        //     params:JSON.stringify(tableData),
        //     type:"POST",
        //     contentType:"application/json"
        // }).then(res=>{
        //     if(res.code == "0000"){
        //         amazonModifyTableReload(res.data)
        //     }
        // }).catch(res=>{
        //     amazonModifyTableReload([])
        // })


    })

    // 还原
    $("#amazonRevert").click(function(){
        amazonModifyTableReload(amazon_searchTableData,false)
        // commonReturnPromiseRes({
        //     url:ctx+'/amazonBatchOperationController/reductionProduct',
        //     params:JSON.stringify({"idList":amazonCurr_idList,"pIdList":amazonCurr_pIdList}),
        //     type:"POST",
        //     contentType:"application/json"
        // }).then(res=>{
        //     if(res.code == "0000"){
        //         amazonModifyTableReload(res.data)
        //     }
        // }).catch(res=>{
        //     amazonModifyTableReload([])
        // })
    })

    //批量调价
    $('#batchUpadatePrice').click(function() {
        //获取表格行对象
        var prodObj = [];
        applytoChecked('amazonModifyPriceTable', amasontableIns, function(tr, data, i) {
            var price = tr.find('td[data-field="newPrice"] div input').val();
            if (price != "" && price !=0) {
                data.prodStoreSku = data.storeSSku;
                data.newPrice = price
                prodObj.push(data);
            } else {
                layer.msg('请填入修改的价格');
            }
        });
        if (prodObj.length > 0) {
            $.ajax({
                beforeSend: function() {
                    loading.show();
                },
                type: "POST",
                url: ctx + "/amazonBatchOperationController/amazonModifyMainPrice.html",
                data: { 'prodObj': JSON.stringify(prodObj) },
                async: true,
                dataType: "json",
                success: function(returnData) {
                    clearInterval(timer);
                    if (returnData.code = "0000") {
                        clearInterval(timer);
                        layer.msg(returnData.msg);
                        var timer = setInterval(function() {
                            for (var i in prodObj) {
                                getResult(prodObj[i], timer, i);
                                loading.hide();
                            }
                        }, 5000);
                    } else {
                        loading.hide()
                        layer.msg(returnData.msg);
                    }
                },
                error: function() {
                    loading.hide()
                    layer.msg("服务器正忙");
                }
            });
        }
    });

    function getResult(prodObj, timer, i) {
        $.ajax({
            type: "POST",
            url: ctx + "/amazonBatchOperationController/selectModifyPrice.html",
            data: { 'prodObj': JSON.stringify(prodObj) },
            async: false,
            dataType: "json",
            success: function(returnData) {
                var $tr = {}
                applytoChecked('amazonModifyPriceTable', amasontableIns, function(tr, data, index) {
                    if (index == i) {
                        $tr = tr;
                    }
                });
                if (returnData.code == "0000") {
                    if (returnData.msg !== "处理中") {
                        clearInterval(timer);
                        if (returnData.msg == '成功') {
                            $tr.find('td[data-field="result"] div').html("<div style='color:blue'>" + returnData.msg + "</div>")
                        } else if (returnData.msg != '' && returnData.msg != null && returnData.msg != 'undefined') {
                            $tr.find('td[data-field="result"] div').html("<div style='color:red'>" + returnData.msg + "</div>");
                        }
                    }
                } else {
                    layer.msg(returnData.msg);
                }
            },
            error: function() {
                layer.msg("服务器正忙");
                clearInterval(timer);
            }
        });
    }
});