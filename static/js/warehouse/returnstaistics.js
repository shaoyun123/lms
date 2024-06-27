var obj = {};
layui.use(['form', 'table', 'layer', 'laydate', 'tableMerge', 'element'], function () { 
    var form = layui.form,
        table = layui.table,
        laydate = layui.laydate;
    
    form.render();
    $("#returnstaistics_timerange_input").val(getLatestMonth().createTimeStart + ' - ' + getLatestMonth().createTimeEnd)
    //日期范围
    laydate.render({
        elem: '#returnstaistics_timerange_input',
        range: true
    });

    //表单查询
    $('#returnstaisticstSearch').click(function () {
        if ($.trim($('#operateType').val()) == 0) {
            table.render({
                method: 'post',
                elem: '#return_statistics_statistics',
                where: returnstaistics(),
                url: `${ctx}/WarehouseShelfLoading/shelfLoading.html`, //数据接口
                title: '装车统计',
                page: false,//开启分页
                toolbar: false, //开启工具栏，此处显示默认图标，可以自定义模板，详见文档
                totalRow: false, //开启合计行
                cols: [[ //表头
                    {
                        field: 'operateTime',
                        title: '装车时间',
                        width: 120
                    }, {
                        field: 'operateName',
                        title: '装车人',
                        width: 120
                    }, {
                        field: 'operateCount',
                        title: '装车SKU数量',
                        width: 120
                    }
                ]],
            });
        } else if ($.trim($('#operateType').val()) == 1) {
            table.render({
                method:'post',
                elem: '#return_statistics_statistics',
                url:`${ctx}/WarehouseShelfLoading/shelfLoading.html`, //数据接口
                title: '上架统计',
                where: returnstaistics(),
                page: false ,//开启分页
                toolbar: false ,//开启工具栏，此处显示默认图标，可以自定义模板，详见文档
                totalRow: false, //开启合计行
                cols:[[ //表头
                    {
                        field: 'operateTime',
                        title: '上架时间',
                        width:120
                    }, {
                        field: 'operateName',
                        title: '上架人',
                        width:120
                    }, {
                        field: 'operateCount',
                        title: '上架SKU数量',
                        width:120
                    }
                    , {
                        field: 'goodsTotalCount',
                        title: '上架商品总数量',
                        width:120
                    }
                ]],
            });
        }else if ($.trim($('#operateType').val()) == 2) {
            table.render({
                method:'post',
                elem: '#return_statistics_statistics',
                url:`${ctx}/WarehouseShelfLoading/shelfLoading.html`, //数据接口
                title: '上架统计',
                where: returnstaistics(),
                page: false ,//开启分页
                toolbar: false ,//开启工具栏，此处显示默认图标，可以自定义模板，详见文档
                totalRow: false, //开启合计行
                cols:[[ //表头
                    {
                        field: 'operateTime',
                        title: '扫描时间',
                        width:120
                    }, {
                        field: 'operateName',
                        title: '扫描人',
                        width:120
                    }, {
                        field: 'operateCount',
                        title: '扫描sku数量',
                        width:120
                    }
                ]],
            });
        }
    });
    function returnstaistics(){ 
        var data = serializeObject($('#returnstaistics_search_form'));
        var timeRange = data.returnstaisticst_timerange_input;
        if (timeRange != null && timeRange !== '') {
            obj.operateStartTime = timeRange.split(' - ')[0] + ' 00:00:00';
            obj.operateEndTime = timeRange.split(' - ')[1] + ' 23:59:59';
        }
        obj.loadType = data.loadType ? data.loadType : undefined;
        obj.operateType = $.trim($('#operateType').val());
        return obj;
    }

    /**获取最近一月时间区间**/
    function getLatestMonth() {
        var data = {};
        data.createTimeEnd = Format(new Date(), 'yyyy-MM-dd');
        data.createTimeStart = Format((new Date()).setMonth(new Date().getMonth() - 1), 'yyyy-MM-dd');
        data.processStatus = "0";
        return data;
    };

})
//设置在线/已下架点击传递isSale
function setoperateType(id){
    $('#operateType').val(id);
    $('#returnstaisticstSearch').trigger('click');
}