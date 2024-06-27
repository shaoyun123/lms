var addPromotionTableIns = null;
layui.use(['form', 'layer', 'formSelects', 'table', 'laypage', 'laydate'], function() {
    var form = layui.form,
        table = layui.table,
        layer = layui.layer,
        $ = layui.$;
    form.render();
    render_hp_orgs_users("#shopify_setAchievementSalepersonForm"); //渲染部门销售员店铺三级联动

    var data = new Object();
    if(shop_arr.length > 0){
        data.idList=[];
        for (var i = 0; i < shop_arr.length; i++){
            data.idList.push(shop_arr[i].id);
        }
        data.idList = data.idList.join(",");
    }
    if(shop_arr.length > 0){
        achievementSalepersonTable(data)
    }

    //渲染表格
    function achievementSalepersonTable(data) {
        addPromotionTableIns = table.render({
            elem: '#shopify_achievementSalepersonTable',
            method: 'get',
            where:data,
            url: ctx + "/shopifyBatchOperation/queryEchievementSaleperson.html",
            height: 500,
            cols: [
                [ //表头
                    { checkbox: true, width: 30 },
                    { title: "productId", field: "productId" },
                    { title: "开发专员销售", field: "achievementSaleperson" },
                    { title: "操作结果", field: "result" },
                ]
            ],
            page: false,
            id: "shopify_achievementSalepersonTable",
            done: function(data) {}
        })
    }

    $('#batchSetAchievementSaleperson').click(function() {
        batchSetAchievementSaleperson()
    })

    $('#batchRemoveAchievementSaleperson').click(function() {
        batchRemoveAchievementSaleperson()
    })

    //批量设置
    function batchSetAchievementSaleperson() {
        var itemArr = table.checkStatus('shopify_achievementSalepersonTable').data
        itemArr = itemArr.map(function(item) {
            return item.productId
        })
        var salepersonId = $('#shopify_achi_saleperson_salesman_sel').val();
        var saleperson = $('#shopify_achi_saleperson_salesman_sel').find("option:selected").text();
        if (itemArr.length > 0) {
            initAjax('/shopifyBatchOperation/setOrRemoveEchievementSalePerson.html', 'POST', { itemStr: itemArr.join(','),type: '1',saleperson: saleperson,salepersonId:salepersonId}, function(returnData) {
                if (returnData.code === "0000") {
                    achievementSalepersonTable(data)
                    layer.msg("操作成功")
                }else{
                    layer.msg(returnData.msg)
                }
            }, 'application/x-www-form-urlencoded')
        } else {
            layer.msg('请勾选item');
        }
    }

    //批量移除
    function batchRemoveAchievementSaleperson() {
        var itemArr = table.checkStatus('shopify_achievementSalepersonTable').data
        itemArr = itemArr.map(function(item) {
            return item.productId
        })

        if (itemArr.length > 0) {
            initAjax('/shopifyBatchOperation/setOrRemoveEchievementSalePerson.html', 'POST', { itemStr: itemArr.join(','),type: '2'}, function(returnData) {
                if (returnData.code === "0000") {
                    achievementSalepersonTable(data)
                    layer.msg("操作成功")
                }else{
                    layer.msg(returnData.msg)
                }
            }, 'application/x-www-form-urlencoded')
        }else{
            layer.msg('请勾选item');
        }
    }

    //封装ajax请求
    function initAjax(url, method, data, func, contentType, timer) { //初始化ajax请求
        $.ajax({
            type: method,
            url: ctx + url,
            dataType: 'json',
            async: true,
            data: data,
            contentType: contentType || 'application/json',
            success: function(returnData) {
                loading.hide()
                if (returnData.code == "0000") {
                    if (timer) {
                        clearInterval(timer)
                    }
                    func(returnData)
                } else {
                    if (timer) {
                        clearInterval(timer)
                    }
                    layer.msg(returnData.msg, { icon: 2 });
                }
            },
            error: function(returnData) {
                layui.admin.load.hide();
                if (XMLHttpRequest.status == 200) {
                    layer.msg("请重新登录", { icon: 7 });
                } else {
                    layer.msg("服务器错误");
                }
                if (timer) {
                    clearInterval(timer)
                }
            }
        })
    }

});