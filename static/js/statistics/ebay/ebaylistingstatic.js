layui.use(['admin', 'form', 'table', 'laydate', 'upload', 'formSelects'], function () {
    var $ = layui.$,
        layer = layui.layer,
        laydate = layui.laydate,
        table = layui.table,
        form = layui.form;
    form.render();

    // listingstaticTable('ebaylistingstaticForm');
    render_hp_orgs_users("#ebaylistingstaticForm"); //渲染部门销售员店铺三级联动


    function listingstaticTable(form) {
        var data = ebaylistinggetData(form);
        if(!data.orderQueryStartDate){
            return layer.msg('请选择订单时间');
        };
        //表格渲染
        table.render({
            elem: '#ebaylistingstaticTable',
            method: 'post',
            id: 'ebaylistingstaticTable',
            url: ctx + '/ebaySalesStatistics/searchEbaySalesStatistics.html', // 数据接口
            cols: [
                [ //表头
                    {type: "checkbox", width: 30},
                    {
                        field: 'itemId',
                        title: 'item_id',
                        sort: true,
                        templet: '<div><a class="ebay_listing_itemId" target="_blank" href="{{d.seoViewUrl}}">{{d.itemId || \'\'}} </a></div>'
                    },
                    {field: 'storeName', title: '店铺', sort: true},
                    {field: 'siteName', title: '站点', sort: true,},
                    {field: 'location', title: '商品所在国家', sort: true},
                    {field: 'prodPSKu', title: '商品父SKU', sort: true, totalRow: true},
                    {field: 'price', title: '售价', sort: true, totalRow: true},
                    {field: 'listingStartTime', title: '刊登时间', sort: true, totalRow: true},
                    {field: 'orderNormalNum', title: '订单数量', sort: true, totalRow: true},
                    {field: 'itemSoldNum', title: '销售数量', sort: true, totalRow: true},
                    {field: 'itemSalesAmount', title: '销售额($)', sort: true, totalRow: true},
                    {field: 'itemOrderProfit', title: '销售利润(￥)', sort: true, totalRow: true},
                    {field: 'grossProfit', title: '毛利率(%)', sort: true},
                    {field: 'itemResendOrderNum', title: '重寄单量', sort: true},
                    {field: 'itemResendSoldNum', title: '重寄销售数量', sort: true},
                    {field: 'itemResendProfit', title: '重寄利润(￥)', sort: true},
                ]
            ],
            where: data,
            page: true,
            limits: [50, 100, 200], // 每页条数的选择项
            limit: 50, //默认显示20条,
            // created: function(res, curr, count) {
            //     res.data = res.data.list;
            // },
            done: function (res, curr, count) {
                var $incomeOutCard =$('#incomeOutCard');
                $incomeOutCard.find('.layui-table-header').removeClass('toFixedContain');
                UnifiedFixedFn('incomeOutCard');
                if(!$('[name=ebaylistingstatic_number]').is(':checked')){
                    var $tarDiv = $incomeOutCard.find('.layui-table-page>div');
                    $tarDiv.find('.layui-laypage-count').remove();
                    $tarDiv.append(`<span style="vertical-align:top;margin-left:5px;font-size: 13px;
                    color: #000;line-height: 26px;">【数量】: ${count}+, 如需统计准确数量，请勾选【统计总数】</span>`);
                }
            }
        });
    }

    //日期范围
    laydate.render({
        elem: '#ebaylistingTime',
        range: true
    });
    laydate.render({
        elem: '#ebaylistingOrderTime',
        range: true
    });
    $("#ebaylistingstaticsearchBtn").click(function () {
        listingstaticTable('ebaylistingstaticForm');
    });

    $(function () {
        $.ajax({
            type: "post",
            url: ctx + "/srse/listmainsite.html?platCode=ebay",
            dataType: "json",
            success: function (returnData) {
                if (returnData.code != "0000") {
                    layer.msg("主站点初始化失败");
                } else {
                    var $option = "<option value=''>全部</option>";
                    returnData.data.forEach(function (item) {
                        $option += '<option value=' + item + '>' + item + '</option>';
                    });
                    $('#ebaylistingstaticForm select[name="siteName"]').append($option);
                }
                form.render('select');
            }
        });
    });
});

function ebaylistinggetData(form) {
    var data = serializeObject($('#' + form));
    if (data.listingQueryDate) {
        data.listingQueryStartDate = data.listingQueryDate.substring(0, 10) + " 00:00:00";
        data.listingQueryEndDate = data.listingQueryDate.substring(13) + " 23:59:59";
    }
    if (data.orderQueryDate) {
        data.orderQueryStartDate = data.orderQueryDate.substring(0, 10) + " 00:00:00";
        data.orderQueryEndDate = data.orderQueryDate.substring(13) + " 23:59:59";
    }
    data.roleNames = $("#ebaylistingstaticForm select[name=salePersonId]").data("rolelist");
    if($('[name=ebaylistingstatic_number]').is(':checked')){
        data.needTotal = 1;
    }else{
        data.needTotal = 0;
    }
    return data;
}

//导出
$("#export_exportEbayListing").click(function () {
    var data = serializeObject($("#ebaylistingstaticForm"));
    data.needTotal = 1;
    checkNull(data);
    if (data.listingQueryDate) {
        data.listingQueryStartDate = data.listingQueryDate.substring(0, 10) + " 00:00:00";
        data.listingQueryEndDate = data.listingQueryDate.substring(13) + " 23:59:59";
    }
    if (data.orderQueryDate) {
        data.orderQueryStartDate = data.orderQueryDate.substring(0, 10) + " 00:00:00";
        data.orderQueryEndDate = data.orderQueryDate.substring(13) + " 23:59:59";
    }
    var form = $("<form></form>");
    form.attr('action', ctx + '/ebaySalesStatistics/export.html');
    form.attr('method', 'post');

    for (var key in data) {
        var temp = $("<input type='hidden' name='" + key + "' value='" + data[key] + "'/>")
        form.append(temp);
    }
    form.appendTo("body");
    form.css('display', 'none');
    form.submit();
    // var loading = layer.load(0, {
    //     shade: false,
    //     time: 6*1000
    // });
});