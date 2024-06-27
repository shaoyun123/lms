layui.use(["admin", "form", "table", "layer", "laydate", 'tableMerge', 'formSelects', 'element'], function () {
    var admin = layui.admin,
        form = layui.form,
        table = layui.table,
        layer = layui.layer,
        laydate = layui.laydate,
        $ = layui.$;
    form.render('select');
    form.render('radio');
    form.render('checkbox');
    $(function () {
        var lastMonth=getLatestMonth();
        $('#movewaitscan_timerange_input').val(lastMonth.createTimeStart + ' - ' + lastMonth.createTimeEnd);
        laydate.render({
            elem: '#movewaitscan_timerange_input',
            range: true
        });
        $.ajax({
            url: ctx + "/purOrderBase/getPurOrderPageEnum.html",
            type: 'post',
            dataType: 'json',
            success: function (returnData) {
                if (returnData.code == "0000") {
                    var obj=returnData.data.warehouseList;
                    var $li = '<option value=""></option>';
                    for (var i in obj) {
                        if (obj[i]) {
                            $li += '<option value=' + obj[i].value + '>' + obj[i].name + '</option>';
                        }
                    }
                    $('#movewaitscan_warehouseList').append($li);
                    tablerender(getSearchData());//默认搜索近一个月数据
                    form.render('select');
                }
            }
        });
    });
    //表单查询
    $("#movewaitscan_search_btn").click(function(){
        tablerender(getSearchData());
        return false;
    });
    //绘制采购入库单列表表格
    function tablerender(data) {
        table.render({
            elem: "#movewaitscan_dataTable",
            id: 'movewaitscan_dataTable',
            method: "post",
            url: ctx + '/purOrderStorage/searchWaitPurOrderStorageByDto.html',
            where: data,
            cols: [
                [
                    {title: "入库单", field: 'storageNumber',width:'30%',},
                    {  title: "<div style='width:30%;float: left;'>SKU</div> " +
                        "<div style='width:40%;float: left;'>商品名称</div> " +
                        "<div style='width:30%;float: left;'>库位</div> "  ,
                        field: 'prodSSku',width:'50%', templet: '#movewaitscan_prodSSku_tpl'},
                ]
            ],
            page: true,
            limits: [100, 500, 1000],
            done: function (res) { //包含表格单元格合并以及工具栏事件(审核，修改，作废);
                 $("#movewaitscan_data_count_span").html(res.count);//未审核
            },
            limit: 100,
        });
    };


    //查询入库单列表表单参数构造
    function getSearchData() {
        var data = serializeObject($('#movewaitscan_form'));
        var warehouseList = [];
        $("#stockinwarehouseList").children().each(function () {
            var warehouseId = $(this).val();
            if (warehouseId != null && warehouseId != '') {
                warehouseList.push(warehouseId);
            }
        });
        data.scanStatus=1;//移库待点货
        data.warehouseList = warehouseList.join(",");//授权仓库集合
        if (data.orderNumber != "") {
            if(data.orderType=="0"){
                data.storageNumberList=data.orderNumber;
            }else  if(data.orderType=="1"){
                data.billNumberList=data.orderNumber;
            }else  if(data.orderType=="2"){
                data.aliNumberList=data.orderNumber;
            }
            else  if(data.orderType=="3"){
                data.deliveryNumberList=data.orderNumber;
            }
        }
        if (data.timerange != "") {
            if (data.timeType == "0") {
                data.createTimeStart = data.timerange.split(' - ')[0] + ' 00:00:00';
                data.createTimeEnd = data.timerange.split(' - ')[1] + ' 23:59:59';
            } else {
                data.auditTimeStart = data.timerange.split(' - ')[0] + ' 00:00:00';
                data.auditTimeEnd = data.timerange.split(' - ')[1] + ' 23:59:59';
            }
        }
        data.orderBy="pstorage.id desc";
        return data;
    };
    /**
     * 获取当前月份
     */
    function getLatestMonth() {
        var data = {};
        data.createTimeEnd = Format(new Date(), 'yyyy-MM-dd');
        data.createTimeStart = Format((new Date()).setMonth(new Date().getMonth() - 1), 'yyyy-MM-dd');
        data.processStatus = "0";
        return data;
    };

});




