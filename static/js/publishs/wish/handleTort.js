layui.use(['admin', 'form', 'layer', 'formSelects', 'element', 'laydate','table'], function () {
    var formSelects = layui.formSelects,
        table = layui.table,
        form = layui.form;
        form.render('checkbox');
        form.render('radio');
        form.render('select');

    //初始化店铺/销售员/部门
    render_hp_orgs_users("#tortForm");

    //初始化
    var data = new Object();
    if(op_arr.length > 0){
        data.idList=[];
        for (var i = 0; i < op_arr.length; i++){
            data.idList.push(op_arr[i].id);
        }
        data.idList = data.idList.join(",");
        data.isSale = $("#wish_handleTort_isSalse option:selected").val();
    }
    if(op_arr.length > 0){
        //执行重载
        tableReload(data);
    }
    function tableReload(data) {
        table.render({
            method:'post',
            elem: '#tort_table'
            ,url: ctx + '/wishHandleTrot/getHandleTrot.html' //数据接口
            ,page: true //开启分页
            ,cols: [[ //表头
                {type: 'checkbox'}
                ,{field: 'id', title: 'id',}
                ,{ field: "storeAcctId", title: "店铺id"}
                ,{ field: "storeProdPId", title: "平台父商品Id"}
                ,{field: 'storeAcct', title: '店铺',width: 130}
                ,{field: 'prodPSku', title: '商品父SKU',width: 130}
                ,{field: 'pSku', title: '店铺父SKU',width: 130}
                ,{field: 'title',title: '标题', width: 450}
                ,{field: 'isPromotion', title: '是否黄钻',templet:'#wish_isPromotion',width: 100}
                ,{field: 'returnData', title: '操作结果',width: 70}
            ]],
            where:data,
            id:"tort_table",
            limits:[10,20,50],
            limit:10,
            done:function(res, curr, count){
                $("#LAY-wish-tort [data-field='id']").css('display','none');
                $("#LAY-wish-tort [data-field='storeAcctId']").css('display','none');
                $("#LAY-wish-tort [data-field='storeProdPId']").css('display','none');
                $("#handleTort_span_wish").text("共"+count+"条");
            }
        });
    }
    $("#handleTortBtn").click(function () {
        var type = $(this).data('type');
        active[type] ? active[type].call(this) : '';
    });
    var active = {
        reload: function () {
            var data = new Object();
            data.storeAcctIdList = [];
            data.sSkuList = [];
            var logisAttrContents = formSelects.value("selectAttr_store");
            for (var i = 0; i < logisAttrContents.length; i++) {
                var logisAttr = logisAttrContents[i].value;
                data.storeAcctIdList.push($.trim(logisAttr));
            }
            var skuStr = $.trim($("#tortForm input[name='sSkuList']").val());
            if(skuStr !="" && skuStr!=null){
                data.sSkuList = $.trim(skuStr.split(","));
            }
            data.storeAcctIdList = $.trim(data.storeAcctIdList);

            var salepersonId = $.trim($("#tortForm select[name='saleName']").val());
            data.salepersonId = salepersonId;
            data.searchType = $("#wish_handleTort_pskuSearchType").val();//搜索类型
            data.isSale = $("#wish_handleTort_isSalse option:selected").val();

            //执行重载
            tableReload(data);
        }
    };
    /**
     * 批量处理
     */
    $("#wish_tort").click(function () {
        var wish_arr = [];
        //获取表格行对象
        var trObj =  $('#tort_table').next().find('.layui-table-body tbody').find('tr');
        for(var i=0;i<trObj.length;i++){
            var checkStat = trObj.eq(i).find('td').eq(0).find('div').find('input').is(":checked");

            var obj = {};
            obj.id = trObj.eq(i).find('td').eq(1).find('div').text();//id
            obj.storeAcctId = trObj.eq(i).find('td').eq(2).find('div').text();//店铺id
            obj.storeProdPId = trObj.eq(i).find('td').eq(3).find('div').text();//平台商品父id
            obj.storeAcct = trObj.eq(i).find('td').eq(4).find('div').text();//店铺
            obj.prodPSku = trObj.eq(i).find('td').eq(5).find('div').text();//商品父sku
            obj.pSku = trObj.eq(i).find('td').eq(6).find('div').text();//店铺父sku
            //obj.isPromotion = trObj.eq(i).find('td').eq(8).find('div').text();
            obj.isPromotion = $.trim(trObj.eq(i).find('td').eq(8).find('div').text());//是否黄钻
            if(checkStat){
                if($("#wish_promotion").prop("checked")){
                     wish_arr.push(obj);
                }else {
                    if(obj.isPromotion == '否'){
                        wish_arr.push(obj);
                    }
                }
            }
        }
        if(wish_arr.length <= 0){
            layer.msg("请选择需要处理的数据");
            return;
        }
        loading.show();
        $.ajax({
            type: "POST",
            url: ctx + "/wishHandleTrot/updateHandleTort.html",
            data:{'wish_arr':JSON.stringify(wish_arr)},
            async: true,
            dataType: "JSON",
            success:function (data) {
                var trObj =  $('#tort_table').next().find('.layui-table-body tbody').find('tr');
                for(var i=0;i<trObj.length;i++){
                    var arr_storeProdPId = trObj.eq(i).find('td').eq(3).find('div').text();
                    var msg = data.data[arr_storeProdPId];

                    if(msg != undefined){
                        if(msg == "处理成功"){
                            trObj.eq(i).find('td').eq(9).find('.layui-table-cell').html("<div style='color:green'>" + data.data[arr_storeProdPId] + "</div>");
                        }else{
                            trObj.eq(i).find('td').eq(9).find('.layui-table-cell').html("<div style='color:red;posion: relative' class='errordata'>处理失败</div>");
                            trObj.eq(i).find('td').eq(9).find('.layui-table-cell').append("<textarea class='layui-hide'>"+data.data[arr_storeProdPId]+"</textarea>");
                        }
                    }
                }
                loading.hide()
            }
        })
    });

});

$('body').on('mouseover','.errordata',function(){
    var content = $(this).next("textarea").val()
    layer.tips(content, $(this), {
        time: 3000
    });

});