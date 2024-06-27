layui.use(["admin", "form", "table", "layer", "laytpl", 'laydate', 'element','formSelects'], function () {
    var admin = layui.admin,
        form = layui.form,
        table = layui.table,
        layer = layui.layer,
        laytpl = layui.laytpl,
        element = layui.element,
        laydate = layui.laydate,
        formSelects = layui.formSelects,
        $ = layui.$;


    //初始化仓库
    $.ajax({
        type: "POST",
        url: ctx + "/prodWarehouse/getAllProdWarehouse.html",
        contentType: 'application/json',
        dataType: 'json',
        success: function (returnData) {
            if (returnData.code === "0000") {
                $("#wh_stock_entries_form select[name=warehouseId]").html("");
                $(returnData.data).each(function () {
                    $("#wh_stock_entries_form select[name=warehouseId]").append("<option value='" + this.id + "'>" + this.warehouseName + "</option>");
                });
                form.render('select');
            } else {
                layer.msg(returnData.msg);
            }
        },
        error: function () {
            layer.msg("服务器正忙");
        },
        complete: function () {
            loading.hide();
        }
    });
    //初始化单号类型
    commonReturnPromise({
      url: '/lms/enum/listWhStockLog'
    }).then(res => {
      let arr = [];
      for(let i=0; i< res.length; i++){
        let obj = {};
        let item = res[i];
        let key = Object.keys(item)[0];
        obj.code = item[key];
        obj.name = key;
        arr.push(obj);
      }
      //渲染单号类型
      commonRenderSelect('wh_stock_entries_typeList', arr, {name: 'name', code: 'code'}).then(()=> {
        formSelects.render('wh_stock_entries_typeList');
      })
    });


    form.render("select");
    form.render("radio");
    form.render("checkbox");
    laydate.render({
        elem: '#wh_stock_entries_time', //渲染时间
        range: true
    });


    /**
     * 渲染表格
     */
    function wh_stock_entries_table_search() {
        var data = wh_stock_entries_table_search_data(); //搜索参数
        if (!data.warehouseId || $.trim(data.warehouseId) === '') {
            layer.msg("仓库必选！", {icon: 2});
            return;
        }
        if (!data.sku || $.trim(data.sku) === '') {
            layer.msg("商品sku必须！", {icon: 2})
            return;
        }
        table.render({
            elem: "#wh_stock_entries_table",
            method: "post",
            //contentType: "application/json",
            url: ctx + '/whStockEntries/search.html',
            where: data,
            id: "wh_stock_entries_table",
            page: true,
            limits: [50, 100, 200],
            limit: 50,
            cols: [
                [{
                    title: '单据信息',
                    colspan: 4
                }, {
                    title: '本期入库',
                    colspan: 3
                }, {
                    title: '本期出库',
                    colspan: 3
                }, {
                    title: '期末',
                    colspan: 3
                }],
                [
                    //标题栏
                    {
                        field: "createTime",
                        title: "日期",
                        templet: "<div>{{layui.util.toDateString(d.createTime,'yyyy-MM-dd HH:mm:ss')}}</div>"
                    },
                    {field: "typeName", title: "单号类型"},
                    {field: "orderNo", title: "单号"},
                    {field: "remark", title: "备注"},
                    {field: "currentInNumber", title: "数量"},
                    {field: "currentInAverageCost", title: "平均成本(¥)"},
                    {field: "currentInAmount", title: "金额(¥)"},
                    {field: "currentOutNumber", title: "数量"},
                    {field: "currentOutAverageCost", title: "平均成本(¥)"},
                    {field: "currentOutAmount", title: "金额(¥)"},
                    {field: "currentLastNumber", title: "数量"},
                    {field: "currentLastAverageCost", title: "库存成本(¥)"},
                    {field: "currentLastAmount", title: "金额(¥)"},
                ],
            ]
        });
    }

    /**
     * 获取查询参数列表
     * @returns {{}}
     */
    function wh_stock_entries_table_search_data() {
        var data = {};
        //审核时间
        var auditTime = $("#wh_stock_entries_form input[name=auditTime]").val();
        if (auditTime && $.trim(auditTime) !== '') {
            data.auditStartTime = auditTime.split(" - ")[0] + " 00:00:00";
            data.auditEndTime = auditTime.split(" - ")[1] + " 23:59:59";
        }
        data.warehouseId = $("#wh_stock_entries_form select[name=warehouseId]").val();
        data.sku = $("#wh_stock_entries_form input[name=sku]").val().trim();
        data.typeList = layui.formSelects.value('wh_stock_entries_typeList').map(item=> item.value).join(',');
        return data;
    }

    $('#wh_stock_entries_search').on('click', function () {
        wh_stock_entries_table_search()
    })
});