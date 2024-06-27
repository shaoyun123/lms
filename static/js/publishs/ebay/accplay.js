layui.use(['admin', 'form', 'layer', 'laydate', 'table'], function() {
    var admin = layui.admin,
        form = layui.form,
        laydate = layui.laydate,
        $ = layui.$,
        table = layui.table,
        layer = layui.layer,
        option = {
            elem: '#ap_table',
            height: 'full-200',
            method: 'post',
            url: ctx + "/ebayaccountdata/list.html" //数据接口
                ,
            title: '刊登管理表',
            page: false //开启分页
                ,
            height: 'full-120',
            id: 'ap_table',
            cols: [
                [ //表头
                    {
                        field: 'storeAcctName',
                        title: '账户',
                        rowspan: 3,
                        align: 'center',
                        sort: true,
                    }, {
                        field: 'acc_amount',
                        title: '账号销量',
                        colspan: 4,
                        align: 'center'
                    }, {
                        field: 'acc_performance',
                        title: '账号表现',
                        colspan: 10,
                        align: 'center'
                    }
                ],
                [{
                    field: 'sold',
                    title: 'you have sold',
                    colspan: 2,
                    align: 'center'
                }, {
                    field: 'list',
                    title: 'you have list',
                    colspan: 2,
                    align: 'center'
                }, {
                    field: 'longTermStatus',
                    title: '综合表现',
                    rowspan: 2,
                    align: 'center',
                    templet: '#longTermStatus',
                    sort: true
                }, {
                    field: 'nonShippingStatus',
                    title: '非货运表现',
                    rowspan: 2,
                    align: 'center',
                    sort: true,
                    templet: '#nonShippingStatus'
                }, {
                    field: 'shippingStatus1',
                    title: '货运表现(1-8周)',
                    rowspan: 2,
                    align: 'center',
                    sort: true,
                    width: '10%',
                    templet: '#shippingStatus1'
                }, {
                    field: 'shippingStatus2',
                    title: '货运表现(5-12周)',
                    rowspan: 2,
                    align: 'center',
                    sort: true,
                    width: '10%',
                    templet: '#shippingStatus2'
                }, {
                    field: 'epacketStatus',
                    title: 'EUB',
                    rowspan: 2,
                    align: 'center',
                    sort: true,
                    templet: '#epacketStatus'
                }, {
                    field: 'edsStatus',
                    title: 'eds',
                    rowspan: 2,
                    align: 'center',
                    sort: true,
                    templet: '#edsStatus'
                }, {
                    field: 'warehouseStatus',
                    title: '海外仓标准',
                    rowspan: 2,
                    align: 'center',
                    sort: true,
                    templet: '#warehouseStatus'
                }, {
                    field: 'pgcStatus',
                    title: '商业计划',
                    rowspan: 2,
                    align: 'center',
                    sort: true,
                    templet: '#pgcStatus'
                }, {
                    field: 'accountData1',
                    title: '操作',
                    rowspan: 2,
                    align: 'center',
                    templet: '#accountData'
                }, {
                    field: 'ebaySellingFail',
                    title: '更新时间',
                    rowspan: 2,
                    align: 'center',
                    templet: '#ebaySellingFail',
                    width: '10%',
                }],
                [{
                    field: 'totalSoldCount', //sold_item
                    title: 'item',
                    rowspan: 2,
                    align: 'center',
                    sort: true
                }, {
                    field: 'sold_amount',
                    title: 'amount',
                    rowspan: 2,
                    align: 'center',
                    sort: true,
                    templet: '#totalSoldValue'
                }, {
                    field: 'quantityLimitRemaining', //list_item
                    title: 'item',
                    rowspan: 2,
                    align: 'center',
                    sort: true
                }, {
                    field: 'amountLimitRemaining', //list_amount
                    title: 'amount',
                    rowspan: 2,
                    align: 'center',
                    sort: true,
                     templet: '#amountLimitRemainingValue'
                }]
            ],
            parseData: function(res) { //res 即为原始返回的数据,
                return {
                    "code": 0, //解析接口状态
                    "msg": '', //解析提示文本
                    "count": res.count, //解析数据长度
                    "data": res.data //解析数据列表
                };
            }
        }
    var tableIns = table.render(option);

    $("body").on("click", ".ap_detail", function() {
        var accountData = $(this).siblings('textarea').val()

        if (!accountData || accountData === 'undefined') {
            layer.msg("详情为空");
            return;
        }
        var content = template('ap_detailTpl', eval('(' + accountData + ')'));
        console.log(content);
        layer.open({
            type: 1,
            title: '详细信息',
            id: 'ap_detailLayerInfo',
            area: ['100%', '100%'],
            content: content,
            success: function(layero, index) {
                console.log(index);
            }
        })
    });

    $("#ap_sync").click(function() {
        layui.admin.load.show();
        $.ajax({
            type: "post",
            url: ctx + "/ebayaccountdata/sync.html",
            async: true,
            dataType: "json",
            success: function(returnData) {
                layui.admin.load.hide();
                if (returnData.code != "0000") {
                    layer.msg(returnData.msg);
                } else {
                    layer.msg("同步完成");
                    tableIns.reload();
                }
            }
        });
    });
    $("body").on("click", ".ap_update", function() {
        layui.admin.load.show();
        var acctId = $(this).data("acctid");
        $.ajax({
            type: "post",
            url: ctx + "/ebayaccountdata/update.html",
            data: { platAcctId: acctId },
            dataType: "json",
            success: function(returnData) {
                layui.admin.load.hide();
                if (returnData.code != "0000") {
                    layer.msg(returnData.msg);
                } else {
                    layer.msg("更新完成");
                    tableIns.reload();
                }
            }
        });
    });

//  table.on('sort(ap_table)', function(obj) {
//      table.reload('ap_table', {
//          initSort: obj //记录初始排序，如果不设的话，将无法标记表头的排序状态。
//              ,
//          where: {
//              field: obj.field,
//              order: obj.type
//          }
//      });
//  });
});