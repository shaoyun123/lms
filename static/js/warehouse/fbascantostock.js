layui.use(['admin', 'form', 'table', 'layer', 'laydate', 'tableMerge', 'formSelects'], function() {
    var admin = layui.admin,
        layer = layui.layer,
        $ = layui.$,
        table = layui.table,
        form = layui.form;
    form.render();
    form.render('checkbox');
    /**
     * 扫描单号触发回车事件
     */
    $('#fbascantostock_orderNumber').keydown(function(e) {
        if (e.keyCode == 13) {
            var orderNumber = $('#fbascantostock_orderNumber').val();
            if (orderNumber != "") {
                fba_scantostockinTable();
                return false;
            } else {
                layer.msg("请填写跟踪号/采购单号/1688单号！", { icon: 0 })
            }
            return false;
        }
    });
    /**打印sku标签**/
    $("#fbascantostock_print_sku_btn").click(function() {
        var array = table.checkStatus('fbascantostock_data_table').data;
        if (array == null || array.length < 1) {
            layer.msg("请选择记录", { icon: 0 });
            return;
        }
        stockinorder_printorderData(array); //打印sku标签
    });
    /**打印**/
    function stockinorder_printorderData(dataArray) {
        if (dataArray == null || dataArray.length < 1) {
            return;
        }
        var printNum=0;
        $("#fbascantostock_search_from").find(".layui-form-radioed").each(function() {
            var val = $(this).prev().val();
            if (val == "1") {
                var setNum=$.trim($("#fbascantostock_print_num_input").val());
                if (setNum != null && setNum != '') {
                    printNum = Number(setNum);
                }
            }
        });
        var printArray = [];
        for (var i in dataArray) {
            var obj = dataArray[i];
            var detailItem = {};
            detailItem.fnSku = obj.fnSku;
            detailItem.mixStyle = obj.mixStyle;
            detailItem.prodSSku = obj.prodSSku;
            detailItem.printerName = '5025';
            detailItem.printNumber = obj.planQuality;
            detailItem.onlyPreView = false;
            if (printNum > 0) {
                detailItem.printNumber = printNum;
            }
            printArray.push(detailItem);
        }
        epeanPrint_plugin_fun(5,printArray);//fba点货入库打印
    };

    //监听工具条
    table.on('tool(fbascantostock_data_table)', function(obj) { //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
        var data = obj.data; //获得当前行数据
        var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
        if (layEvent === 'fbascantostock_print_label') { //打印sku标签
            var dataArray = [];
            dataArray.push(data);
            stockinorder_printorderData(dataArray)
        }
    });

    /**
     * 绘制扫描入库列表表格
     */
    function fba_scantostockinTable() {
        var data = getSearchData();
        table.render({
            elem: "#fbascantostock_data_table",
            method: "post",
            url: ctx + '/storageFba/getScanPurOrderMainInfoByOneNumber.html',
            id: 'fbascantostock_data_table',
            where: data,
            cols: [
                [
                    { checkbox: true, width: 30 },
                    { title: "仓库箱号", field: 'boxCode', },
                    { title: "货件编号", field: 'shipmentId', },
                    { title: "照片", field: 'image', width: 70, templet: '#fbascantostock_lisitingImage_tpl' },
                    { title: "商品sku", field: 'prodSSku', },
                    { title: "店铺sku", field: 'sellerSku', },
                    { title: "ASIN", field: 'asin', },
                    { title: "FNSKU", field: 'fnSku', },
                    { title: "数量", field: 'planQuality', },
                    { title: "操作", field: 'operate', width: 65, templet: '#fbascantostock_table_operate_tpl' },
                ]
            ],
            page: false,
            created: function(res) {
            },
            done: function(res) {
                imageLazyload();
                if (res.code == "0000") {

                }else{
                    layer.msg(res.msg,{icon:2});
                }
                $('#fbascantostock_orderNumber').select();
            },
        });
    };

    /**
     * 获取搜索参数
     */
    function getSearchData() {
        var data = {};
        data.billNumber = $('#fbascantostock_orderNumber').val();
        return data;
    }
});