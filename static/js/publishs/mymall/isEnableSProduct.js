/**
 * 上下架
 */
layui.use(['admin', 'form', 'layer', 'table', 'formSelects', 'element', 'laydate'], function() {
    var admin = layui.admin,
        form = layui.form,
        layer = layui.layer,
        table = layui.table,
        formSelects = layui.formSelects,
        tableisEnable = {},
        $ = layui.$
    render_hp_orgs_users("#isEnableSearchForm"); //渲染部门销售员店铺三级联动
    form.render(null, 'component-form-element');
    form.render(null, 'component-form-group');
    formSelects = layui.formSelects
    form.render('select');
    form.render('checkbox');

    //表格渲染结果
    //展示已知数据
    var data = new Object();
    if (mymall_op_arr.length > 0) {
        data.idList = [];
        data.storeAcctIdList = [];
        data.storeAcctIdList = $.trim(data.storeAcctIdList);
        for (var i = 0; i < mymall_op_arr.length; i++) {
            if ($("#mymall_online_online_num_span").parents("li").hasClass("layui-this")) {
                data.isSale = 1;
                $("#is_sale_s option[value='1']").attr("selected", "selected"); //根据值让option选中
            }
            if ($("#mymall_online_offline_num_span").parents("li").hasClass("layui-this")) {
                data.isSale = 0;
                $("#is_sale_s option[value='0']").attr("selected", "selected"); //根据值让option选中
            }
            data.idList.push(mymall_op_arr[i].id);
        }
        data.idList = data.idList.join(",");
    }
    if (mymall_op_arr.length > 0) {
        //console.log(data.idList);
        tableReload(data);
    }

    function tableReload(data) {
        tableisEnable = table.render({
            elem: "#enableProdTable",
            method: 'post',
            url: ctx + "/mymallBatchOperation/prodIsEnableS.html",
            cols: [
                [
                    { type: "checkbox" },
                    { field: "id", title: "id", width: 100 },
                    { field: "storeAcctId", title: "店铺id", width: 180 },
                    { field: "storeAcct", title: "店铺", width: 200 },
                    { field: "sSku", title: "商品SKU", width: 200 },
                    { field: "storeSku", title: "店铺SKU", width: 200 },
                    { field: "storeProdSId", title: "平台商品子id", width: 180 },
                    { field: "soldNums", title: "销量", width: 200 },
                    { field: "isSale", title: "当前状态", templet: '#saleStatsTpl', width: 200 },
                    { field: "result", title: '操作结果', width: 200, align: 'center' },
                ]
            ],
            page: false,
            where: data,
            id: "enableProdTable",
            height: 500,
            limits: [10, 20, 50],
            limit: 10,
            done: function(res, curr, count) {
                $("[data-field='id']").css('display', 'none');
                $("[data-field='storeAcctId']").css('display', 'none');
                $("[data-field='storeProdSId']").css('display', 'none');
                $("#tolnum_span_mymall_stop").text("共" + count + "条");
                console.log(res);
            }
        });
    }


    var active = {
        reload: function() {
            var data = new Object();
            data.storeAcctIdList = [];
            var storeAcct = $("#mymall_isEnableProd_store_sel").val();
            if (storeAcct != null && storeAcct != '') {
                data.storeAcctIdList.push(storeAcct);
            } else {
                $("#mymall_isEnableProd_store_sel").children().each(function() {
                    if ($(this).val() != "") {
                        data.storeAcctIdList.push($(this).val());
                    }
                });
            }
            data.sSkuList = [];
            var logisAttrContents = formSelects.value("selectAttr_store");
            for (var i = 0; i < logisAttrContents.length; i++) {
                var logisAttr = logisAttrContents[i].value;
                data.storeAcctIdList.push($.trim(logisAttr));
            }
            var skuStr = $.trim($("#isEnableSearchForm input[name='sSkuList']").val());
            if (skuStr != "" && skuStr != null) {
                data.sSkuList = $.trim(skuStr.split(","));
            }
            data.storeAcctIdList = $.trim(data.storeAcctIdList);
            var salepersonId = $.trim($("#isEnableSearchForm select[name='saleName']").val());
            data.salepersonId = salepersonId;
            var isSale = $.trim($("#isEnableSearchForm select[name='is_sale_s']").val());
            data.isSale = isSale;
            data.searchType = $("#mymall_idEnable_sskuSearchType").val(); //搜索类型
            //执行重载
            tableReload(data);

        }
    };
    $("#adjustPriceSearchBtn").click(function() {
        var type = $(this).data('type');
        active[type] ? active[type].call(this) : '';
    });
    $("#adjustPriceResetBtn").click(function() {
        $("#isEnableSearchForm input[name='sSku']").val('');
        formSelects.value('selectAttr', [])
    });
    //批量下架商品消息
    $('#myMall_batchDisEnableProd').click(function() {
        var arrStat = [];
        var arr = [];
        //获取表格行对象
        var trObj = $('#enableProdTable').next().find('.layui-table-body tbody').find('tr');
        for (var i = 0; i < trObj.length; i++) {
            var checkStat = trObj.eq(i).find('td').eq(0).find('div').find('input').is(":checked");
            var obj = new Object();
            obj.id = $.trim(trObj.eq(i).find('td').eq(1).find('div').text()); //同步数据id
            var isSale = $.trim(trObj.eq(i).find('td').eq(8).find('div').text()); //商品状态
            //只修改被选中的商品信息
            if (checkStat && isSale == '上架中') {
                arrStat[i] = obj;
            }

        }
        if (arrStat == null || arrStat.length == 0) {
            layer.msg("没有可以下架的商品！");
            return;
        }
        var arr = new Array();
        for (var i = 0; i < trObj.length; i++) {
            var obj = new Object();
            obj.id = $.trim(trObj.eq(i).find('td').eq(1).find('div').text()); //同步数据id
            obj.storeAcctId = $.trim(trObj.eq(i).find('td').eq(2).find('div').text()); //店铺id
            obj.storeAcct = $.trim(trObj.eq(i).find('td').eq(3).find('div').text()); //店铺名称
            obj.prodSSku = $.trim(trObj.eq(i).find('td').eq(4).find('div').text()); //商品sku
            obj.prodStoreSku = $.trim(trObj.eq(i).find('td').eq(5).find('div').text()); //店铺sku 
            obj.productId = $.trim(trObj.eq(i).find('td').eq(6).find('div').text()); //平台商品Id
            obj.soldNums = $.trim(trObj.eq(i).find('td').eq(7).find('div').text()); //销量
            var isSale = $.trim(trObj.eq(i).find('td').eq(8).find('div').text()); //商品状态
            obj.isSale = isSale;
            var checkStat = trObj.eq(i).find('td').eq(0).find('div').find('input').is(":checked");
            //只下架上架中商品
            if (checkStat && isSale == '上架中') {
                obj.isEnableType = '0'; //0代表下架
                arr.push(obj)
            }
        }
        $.ajax({
            beforeSend: function() {
                loading.show();
            },
            type: "POST",
            url: ctx + "/mymallBatchOperation/batchEnableProd.html",
            data: { 'prodObj': JSON.stringify(arr) },
            async: true,
            dataType: "json",
            success: function(returnData) {
                if (returnData.code == "0000") {
                    loading.hide()
                    layer.msg(returnData.msg);
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
        timeUnit = setInterval(function() {
            sel()
        }, 5000);
    });

    //批量上架商品信息
    $('#batchEnableProd').click(function() {
        var arrStat = [];
        var arr = [];
        //获取表格行对象
        var trObj = $('#enableProdTable').next().find('.layui-table-body tbody').find('tr');
        for (var i = 0; i < trObj.length; i++) {
            var checkStat = trObj.eq(i).find('td').eq(0).find('div').find('input').is(":checked");
            var obj = new Object();
            obj.id = $.trim(trObj.eq(i).find('td').eq(1).find('div').text()); //同步数据id
            var isSale = $.trim(trObj.eq(i).find('td').eq(8).find('div').text()); //商品状态
            //只修改被选中的商品信息
            if (checkStat && isSale == '已下架') {
                arrStat[i] = obj;
            }

        }
        if (arrStat == null || arrStat.length == 0) {
            layer.msg("没有可以上架的商品！");
            return;
        }
        var arr = new Array();
        for (var i = 0; i < trObj.length; i++) {
            var obj = new Object();
            obj.id = $.trim(trObj.eq(i).find('td').eq(1).find('div').text()); //同步数据id
            obj.storeAcctId = $.trim(trObj.eq(i).find('td').eq(2).find('div').text()); //店铺id
            obj.storeAcct = $.trim(trObj.eq(i).find('td').eq(3).find('div').text()); //店铺名称
            obj.prodSSku = $.trim(trObj.eq(i).find('td').eq(4).find('div').text()); //商品sku
            obj.prodStoreSku = $.trim(trObj.eq(i).find('td').eq(5).find('div').text()); //店铺sku 
            obj.productId = $.trim(trObj.eq(i).find('td').eq(6).find('div').text()); //平台商品Id
            obj.soldNums = $.trim(trObj.eq(i).find('td').eq(7).find('div').text()); //销量
            var isSale = $.trim(trObj.eq(i).find('td').eq(8).find('div').text()); //商品状态
            obj.isSale = isSale;
            var checkStat = trObj.eq(i).find('td').eq(0).find('div').find('input').is(":checked");
            //只下架上架中商品
            if (checkStat && isSale == '已下架') {
                obj.isEnableType = '1'; //1代表上架
                arr.push(obj)
            }
        }
        $.ajax({
            beforeSend: function() {
                loading.show();
            },
            type: "POST",
            url: ctx + "/mymallBatchOperation/batchEnableProd.html",
            data: { 'prodObj': JSON.stringify(arr) },
            async: true,
            dataType: "json",
            success: function(returnData) {
                if (returnData.code == "0000") {
                    loading.hide()
                    layer.msg(returnData.msg);
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
        timeUnit = setInterval(function() {
            sel()
        }, 5000);
    });

    function sel() {
        var trObj = $('#enableProdTable').next().find('.layui-table-body tbody').find('tr');
        for (var i = 0; i < trObj.length; i++) {
            var obj = new Object();
            obj.storeAcctId = $.trim(trObj.eq(i).find('td').eq(2).find('div').text()); //店铺id
            obj.prodStoreSku = $.trim(trObj.eq(i).find('td').eq(5).find('div').text()); //店铺子sku
            var checkStat = trObj.eq(i).find('td').eq(0).find('div').find('input').is(":checked");
            var resultMsg = trObj.eq(i).find('td').eq(9).find('.layui-table-cell').find('div').text();
            if ((resultMsg == '' || resultMsg == null) && checkStat) {
                selectResult(obj, trObj, i);
            }
        }
    }

    function selectResult(obj, trObj, i) {
        $.ajax({
            type: "POST",
            url: ctx + "/mymallBatchOperation/selectIsEnableResult.html",
            data: { 'prodObj': JSON.stringify(obj) },
            async: true,
            dataType: "json",
            success: function(returnData) {
                if (returnData.code == "0000") {
                    if (returnData.msg == '上架成功' || returnData.msg == '下架成功') {
                        trObj.eq(i).find('td').eq(9).find('.layui-table-cell').html("<div style='color:blue'>" + returnData.msg + "</div>");
                    } else if (returnData.msg != '' && returnData.msg != null && returnData.msg != 'undefined') {
                        trObj.eq(i).find('td').eq(9).find('.layui-table-cell').html("<div style='color:red'>" + returnData.msg + "</div>");
                    }
                } else {
                    layer.msg(returnData.msg);
                }
            },
            error: function() {
                layer.msg("服务器正忙");
            }
        });

    }
    //数组去重
    function uniq(array) {
        var temp = []; //一个新的临时数组
        for (var i = 0; i < array.length; i++) {
            if (temp.indexOf(array[i]) == -1) {
                temp.push(array[i]);
            }
        }
        return temp;
    }
});