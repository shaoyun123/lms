/**
 * @time M7-8 15:50
 */
;(function(){

    layui.use(['admin','table','form','element','layer','laytpl', 'formSelects','laydate','upload'],function(){
        var admin = layui.admin,
            table = layui.table;
        var headsumName = {
            tableRender: function(){
                table.render({
                    elem: '#headsum_table',
                    method: 'get',
                    url: '/lms/type/query/winit',
                    page: true,
                    limits: [50, 100, 300],
                    limit: 50,
                    id: "headsum_tableId",
                    cols: [
                        [
                            {title: '国家/地区', field: 'countryCode', width: '6%'},
                            {title: '销售头程', field: 'saleLogisticsType', width: '10%'},
                            {title: '头程方式', field: 'name', width: '10%'},
                            {title: '物流属性', field: 'logisticsAttributeList', width: '14%'},
                            {title: '分抛系数', field: 'partThrowingWeightType', templet: '#headsum_partThrowingWeightType', width: '6%'},
                            {title: '材积系数', field: 'materialCoefficient', width: '6%'},
                            {title: '备注', field: 'remark', width: '47%'},
                            {title: '更新时间', field: 'updateTime', templet: `<div><div>{{Format(d.updateTime, 'yyyy-MM-dd hh:mm:ss')}}</div></div>`, width: '10%'}
                        ]
                    ]
                });
            }
        };

        headsumName.tableRender();
    });
})();