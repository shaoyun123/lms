var lazadaOffShelvesTUnit;
layui.use(['admin', 'form', 'layer', 'table', 'element','formSelects'], function () {
    var admin = layui.admin,
        form = layui.form,
        layer = layui.layer,
        table = layui.table,
        formSelects = layui.formSelects,
        element = layui.element,
        $ = layui.$,
        tableIns = {}

    form.render(null, 'component-form-element');
    form.render(null, 'component-form-group');
    form.render('select');

    lazadaModifyGoodsClassify_init() //初始化店铺数据
    function lazadaModifyGoodsClassify_init() {
        // 因为接口直接返回的数据,没有把数据放在data里面,只能用$.ajax
        $.ajax({
            type: "POST",
            url: ctx + "/lazadaBatchOperation/getPlatData.html",
            data: {},
            async: false,
            dataType: "json",
            success: function (data) {
                //属性多选  店铺
                let platAccts = Array.isArray(data) && data.map(item => ({ name: item.storeAcct, value: item.id }))
                formSelects.data('selectAttr_store', 'local', { arr: platAccts })
                //table,获取在线商品的id
                let idList = localStorage.getItem('itemIds');
                if (idList) {
                    tableRoload({ idList: idList });
                }
            },
            error: function () {
                layer.msg("服务器正忙");
            }
        });
    }

    function tableRoload(data) {
        tableIns = table.render({
            elem: "#lazadamodifyGoodsClassify_modifyIdTable",
            method: 'post',
            url: ctx + "/lazadaBatchOperation/prodModifyClassify.html",
            height: 500,
            cols: [[
                { type: "checkbox" },
                { field: "id", title: "id" },
                { field: "storeAcctId", title: "店铺id" },
                { field: "storeAcctName", title: "店铺", width: '300' },
                { field: "prodPSku", title: "商品父SKU", width: '10%' },
                { field: "storePSku", title: "店铺父SKU", width: '10%' },
                { field: "primaryCategory", title: "原分类ID", width: '100' },
                { field: "categoryIdNew", title: "新分类ID", width: '10%' },
                { field: "addAttributes", title: "修改为", width: '20%' },
                { field: "itemId", title: "item_id" },
                { field: "result", title: '操作结果' }
            ]],
            where: data,
            id: "lazadamodifyGoodsClassify_modifyIdTable",
            limit: 999,
            done: function (res, curr, count) {
                $("#lazada-sort-modify [data-field='id']").css('display', 'none');
                $("#lazada-sort-modify [data-field='storeAcctId']").css('display', 'none');
                $("#lazada-sort-modify [data-field='itemId']").css('display', 'none');
                $("#tolnum_span_lazadaModifyGoodsClassify_Id").text("共" + count + "条");
            }
        });
    }

    var active = {
        reload: function () {
            var data = new Object();
            data.storeAcctIdList = [];
            data.pSkuList = [];
            var logisAttrContents = formSelects.value("selectAttr_store");
            for (var i = 0; i < logisAttrContents.length; i++) {
                var logisAttr = logisAttrContents[i].value;
                data.storeAcctIdList.push($.trim(logisAttr));
            }
            var skuStr = $.trim($("#lazadamodifyGoodsClassify_form input[name='pSkuList']").val());
            if (skuStr != "" && skuStr != null) {
                data.pSkuList = $.trim(skuStr.split(","));
            }
            data.storeAcctIdList = $.trim(data.storeAcctIdList);
            data.searchType = $("#lazada_modifyGoodsClassify_skuSearchType").val();//搜索类型
            tableRoload(data);
        }
    };

    // 搜索
    $("#lazada_modifyGoodsClassify_searchBtn").click(function () {
        var type = $(this).data('type');
        active[type] ? active[type].call(this) : '';
    });

    //清空
    $("#lazada_modifyGoodsClassify_resetBtn").click(function () {
        $("#lazadamodifyGoodsClassify_form input[name='sSku']").val('');
    });

    // 批量修改的接口
    /**
     * 修改lazada 属性
     * @param checkedData 选中的数据信息及批次号
     */
    function getDataModifyGoodsClassifyBatchUpdateProductAttr(checkedData){
        return commonReturnPromise({
            url: `/lms/lazadaBatchOperation/batchUpdateProductAttr`,
            type: 'post',
            contentType: 'application/json',
            params:JSON.stringify(checkedData)
        })
    }


    $("#lazada_modifyGoodsClassify_batchEnableProd").click(function () {
        let checkedData = table.checkStatus('lazadamodifyGoodsClassify_modifyIdTable').data
        if (checkedData.length <= 0) {
            layer.msg("请选择需要修改的数据");
            return;
        }
        let sendData = {};
        sendData.batchNo = "lazada_change_attr_" + new Date().getTime();
        sendData.dtoList = checkedData;
        getDataModifyGoodsClassifyBatchUpdateProductAttr(sendData).then(function(data){
            layer.msg(data);
        }).catch(function(err){
            layer.msg(err, {icon:2});
        })

        modifyGoodsClassifyLazadaOffShelvesTUnit = setInterval(function () {
            // 第二个参数,暂时无用
            modifyGoodsClassifySel(sendData.batchNo, "changeAttr")
        }, 5000);
    });

    /**
     *  查询操作结果[COPY--商品下架/删除--offshelves.js]
     * @param batchNo 批次号
     * @param operationType 新增操作类型
     */
    function modifyGoodsClassifySel(batchNo , operationType) {
        let trObj = $('#lazadamodifyGoodsClassify_modifyIdTable').next().find('.layui-table-body tbody').find('tr');
        let count = 0;
        for (let i = 0; i < trObj.length; i++) {
            let checkStat = trObj.eq(i).find('td').eq(0).find('div').find('input').is(":checked");
            let resultMsg = trObj.eq(i).find('td').eq(10).find('.layui-table-cell').find('div').text();
            if ((resultMsg == '' || resultMsg == null) && checkStat) {
                count++;
            }
        }
        if (count == 0) {
            clearInterval(modifyGoodsClassifyLazadaOffShelvesTUnit);
            return;
        }

        $.ajax({
            type: "POST",
            url: ctx + "/sys/selectResult.html",
            data: {'batchNo': batchNo},
            async: true,
            dataType: "json",
            success: function (returnData) {
                if (returnData.code == "0000") {
                    var data = returnData.data;
                    for (var i = 0; i < trObj.length; i++) {
                        //在线商品表的父商品ID
                        var prodSyncPId = $.trim(trObj.eq(i).find('td').eq(1).find('div').text());
                        //当前行是否被选中
                        var checkStat = trObj.eq(i).find('td').eq(0).find('div').find('input').is(":checked");
                        //当前行操作结果
                        var resultMsg = trObj.eq(i).find('td').eq(10).find('.layui-table-cell').find('div').text();
                       // 获取值的key
                        var logMsg = data['TR_LAZADA_ADD_OR_UPDATE_CATEGORY_MQ' + prodSyncPId];
                        if ((resultMsg == '' || resultMsg == null) && checkStat) {
                            if (logMsg == '处理成功') {
                                trObj.eq(i).find('td').eq(10).find('.layui-table-cell').html("<div style='color:blue'>" + logMsg + "</div>");
                            } else if (logMsg != '' && logMsg != null && logMsg != 'undefined') {
                                trObj.eq(i).find('td').eq(10).find('.layui-table-cell').html("<div style='color:red'>" + logMsg + "</div>");
                            }
                        }
                    }
                }
            },
            error: function () {
                layer.msg("服务器正忙");
                clearInterval(lazadaOffShelvesTUnit);
            }
        });

    }
});

$('body').on('mouseover', '.errordata', function () {
    var content = $(this).next("textarea").val()
    layer.tips(content, $(this), {
        time: 3000
    });

});