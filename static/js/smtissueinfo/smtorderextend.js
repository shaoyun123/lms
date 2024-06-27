layui.use(['admin', 'layer', 'table', 'form', 'laytpl', 'element', 'laydate', 'formSelects'], function() {
    var admin = layui.admin,
        layer = layui.layer,
        $ = layui.$,
        table = layui.table,
        element = layui.element,
        laydate = layui.laydate,
        formSelects = layui.formSelects,
        form = layui.form;

    render_hp_orgs_users("#smt_order_extend_searchForm");//渲染部门销售员店铺三级联动

    /**
     * 搜索
     */
    $("#smt_extend_order_submit").on("click", function() {
        var storeIdStr = getSerachData();
        var status =  $('#smt_extend_order_status option:selected') .val();
        var cols = [
            { field: "storeAcct", title: "店铺名称", style: "vertical-align: top;" },
            { field: "salesperson", title: "销售员", style: "vertical-align: top;" },
            { field: "customServicer", title: "客服", style: "vertical-align: top;" },
            { field: "orderExtendStatus", title: "订单延长功能", style: "vertical-align: top;",templet: '#orderExtendStatusTemplet' },
        ];
        table.render({
            elem: "#smt_order_extend_store_data_table",
            method: 'post',
            url: ctx + "/batchExtend/queryAllStore.html",
            where:{ 'storeIdStr':storeIdStr.toString(),
                'status':status},
            cols: [
                cols,
            ],
            done: function(res, curr, count){
                if (res.code == '0000') {
                    $("#smt_extend_store_number").html(count);
                }
            },
            page: true,
            id: "smt_order_extend_store_data_table",
            limits: [50, 100, 300],
            limit: 50
        });
    });

    /**
     * 获取搜索参数
     */
    function getSerachData() {
        var currentStoreAccts = formSelects.value("smt_order_extend_store_sel", "val"); //所选店铺
        if (currentStoreAccts == null || currentStoreAccts.length < 1) { //没有选择店铺
            var acctIds = $("#smt_order_extend_store_sel").attr("acct_ids");
            if (acctIds && acctIds.length > 1) {
                storeAcctIds = acctIds;
            } else {
                storeAcctIds = 99999;
            }
        } else {
            storeAcctIds = currentStoreAccts.join(","); //选择的店铺
        }
        return storeAcctIds;
    }


    /**
     * 重载
     */
    var active = {
        reload: function() {
            var storeIdStr = getSerachData();
            var status =  $('#smt_extend_order_status option:selected') .val();
            table.reload("smt_order_extend_store_data_table", {
                where: {
                    'storeIdStr':storeIdStr.toString(),
                    'status':status
                },
            });
        },
    };

    /**
     * 开启关闭延长订单收货时间的功能
     */
    form.on('switch(orderExtendStatus)', function(data){
        //取到当前的开启状态和店铺id
        var obj = {
            id: data.othis.next().text(),
            status: data.elem.checked
        }
        $.ajax({
            type: "POST",
            url: ctx + "/salesplat/updateStoreOrderExtendStatus.html", //请求接口地址
            dataType: "json",
            data: obj, //需要post的数据
            success: function(res) {
                loading.hide();
                //后台程序返回数据
                if (res.code == "0000") {
                    active.reload();
                } else {
                    layer.msg(res.msg);
                }
            },
        });
    });


    $(function(){
        queryOrderExtendConfig();
    });

    /**
     * 查询延长收货的配置
     */
    function queryOrderExtendConfig() {
        $.ajax({
            type: "get",
            url: ctx + "/batchExtend/queryExtendConfig.html", //请求接口地址
            dataType: "json",
            success: function(res) {
                //后台程序返回数据
                if (res.code == "0000") {
                    var extendDay = res.data.EXTEND_DAY;
                    var countDownTime = res.data.COUNT_DOWN_TIME;
                    var extendType = res.data.EXTEND_TYPE;
                    $('input[name="extendDay"]').val(extendDay);
                    $('input[name="countDownTime"]').val(countDownTime);
                    $('#extendType').val(extendType);
                } else {
                    layer.msg(res.msg);
                }
            },
        });
    }

    /**
     * 保存收货配置
     */
    $("#smt_extend_order_config_submit").on("click", function() {
        var extendDay =  $('input[name="extendDay"]').val();
        var countDownTime = $('input[name="countDownTime"]').val();
        var extendType = $('select[name="extendType"]').val();
        var obj = {
            extendDay : extendDay,
            countDownTime : countDownTime,
            extendType : extendType
        }
        $.ajax({
            type:"post",
            url: ctx + "/batchExtend/updateExtendConfig.html",
            dataType:"json",
            data: obj,
            success: function(res) {
                //后台程序返回数据
                if (res.code == "0000") {
                    layer.msg('保存成功', {icon: 1});
                    active.reload();
                } else {
                    layer.msg(res.msg);
                }
            },
        })

    });

});
