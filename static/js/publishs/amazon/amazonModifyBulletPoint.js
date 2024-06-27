/**
 *修改卖点
 */
layui.use(['admin', 'form', 'layer','table', 'formSelects', 'element', 'laydate'], function() {
    var admin = layui.admin,
        form = layui.form,
        layer = layui.layer,
        table = layui.table,
        formSelects = layui.formSelects,
        element = layui.element,
        $ = layui.$,
        tableIns = {};
    render_hp_orgs_users("#amazon_theShelves_searchForm");//渲染部门销售员店铺三级联动
    form.render(null, 'component-form-element');
    form.render(null, 'component-form-group');
    formSelects = layui.formSelects
    form.render('select');
    form.render('checkbox');
    form.render('radio');

    //表格渲染结果
    //展示已知数据
    var data = new Object();
    if(stopAmazonArr.length > 0){
        data.idList=[];
        for (var i = 0; i < stopAmazonArr.length; i++){
            data.idList.push(stopAmazonArr[i].id);
        }
        data.idList = data.idList.join(",");
    }

    if(stopAmazonArr.length > 0){
        tableReload(data);
    }
    function tableReload(data) {
        tableIns = table.render({
            elem: "#amazonModifyTitleTable",
            method:'post',
            url: ctx + "/amazonBatchOperationController/searchStopPublish.html",
            cols: [[
                {type: "checkbox"},
                { field: "id", title: "id"},
                { field: "storeAcctId", title:"店铺id" },
                { field: "storeAcct", title: "店铺" , width: 200},
                { field: "prodSSku", title: "商品子SKU" , width: 200},
                { field: "storeSSku", title: "店铺子SKU", width: 200},
                // { field: "itemId", title: "Item ID", width: 150},
                { field: "title", title: "卖点（最多五个,使用逗号分割）",templet: '#new_title', width: 500},
                { field: "title", title: "卖点（最多五个,使用逗号分割）",templet: '#new_title', width: 500},
                { field: "title", title: "卖点（最多五个,使用逗号分割）",templet: '#new_title', width: 500},
                { field: "result",title: '操作结果'}
            ]],
            page:false,
            where:data,
            id:"amazonModifyTitleTable",
            height: 500,
            limits:[10,20,50],
            limit:10,
            done:function(res, curr, count){
                $("[data-field='id']").css('display', 'none');
                $("[data-field='storeAcctId']").css('display', 'none');
                $("#tolnum_span_amazon_stock").text("共"+count+"条");
            }
        });
    }


    var active = {
        reload: function () {
            var data = new Object();
            data.storeAcctIdList = [];
            data.sSkuList = [];
            data.pSkuList = [];
            var logisAttrContents = formSelects.value("selectAttr_store");
            for (var i = 0; i < logisAttrContents.length; i++) {
                var logisAttr = logisAttrContents[i].value;
                data.storeAcctIdList.push($.trim(logisAttr));
            }
            var skuStr = $.trim($("#amazon_theShelves_searchForm input[name='skuList']").val());
            if($("#amazonModPoint_is_pAnds_sku").val() == 0){
                if(skuStr !="" && skuStr!=null){
                    data.sSkuList = $.trim(skuStr.split(","));
                }
            }else {
                if(skuStr !="" && skuStr!=null){
                    data.pSkuList = $.trim(skuStr.split(","));
                }
            }

            data.storeAcctIdList = $.trim(data.storeAcctIdList);
            var salepersonId = $.trim($("#amazon_theShelves_searchForm select[name='saleName']").val());
            data.salepersonId = salepersonId;
            data.searchType = $("#amazon_idEnable_skuSearchType").val();//搜索类型
            tableReload(data);
        }
    };
    $("#amazonModifyStockSearchBtn").click(function () {
        var type = $(this).data('type');
        active[type] ? active[type].call(this) : '';
    });
    $("#amazonModifyStockResetBtn").click(function () {
        $("#amazon_theShelves_searchForm input[name='sSku']").val('');
        formSelects.value('selectAttr', [])
    });
    console.log(1)
    //批量调价
    $('#modifyStockButtn').click(function(){
        //获取表格行对象
        var trObj =  $('#amazonModifyTitleTable').next().find('.layui-table-body tbody').find('tr');
        var  arr = new Array();
        for(var i=0;i<trObj.length;i++){
            var obj = new Object();
            obj.id =  $.trim(trObj.eq(i).find('td').eq(1).find('div').text());//id
            obj.storeAcctId =  $.trim(trObj.eq(i).find('td').eq(2).find('div').text());//店铺id
            obj.storeAcct =  $.trim(trObj.eq(i).find('td').eq(3).find('div').text());//店铺名称
            obj.prodsSku =  $.trim(trObj.eq(i).find('td').eq(4).find('div').text());//子sku
            obj.storeSPku =  $.trim(trObj.eq(i).find('td').eq(5).find('div').text());//店铺sku
            // obj.itemId =  $.trim(trObj.eq(i).find('td').eq(6).find('div').text());//itemId
            obj.bulletPoint =  $.trim(trObj.eq(i).find('td').eq(6).find('textarea').val());//新卖点
            var checkStat = trObj.eq(i).find('td').eq(0).find('div').find('input').is(":checked");
            obj.type = 'bulletPoint';
            //只修改选中的
            if(checkStat){
                arr.push(obj)
            }
        }
        if(arr==null ||arr.length==0){
            layer.msg("没有需要修改的商品！");
            return;
        }
        $.ajax({
            beforeSend: function(){
                loading.show();
            },
            type: "POST",
            url: ctx + "/amazonBatchOperationController/modifyMainTitleAmazon.html",
            data: {'prodObj':JSON.stringify(arr)},
            async: true,
            dataType: "json",
            success: function (data) {
                var trObj =  $('#amazonModifyTitleTable').next().find('.layui-table-body tbody').find('tr');
                for(var i=0;i<trObj.length;i++){
                    var id = trObj.eq(i).find('td').eq(1).find('div').text();
                    var msg = data.data[id];

                    if(msg != undefined){
                        if(msg == "修改成功"){
                            trObj.eq(i).find('td').eq(7).find('.layui-table-cell').html("<div style='color:green'>" + msg + "</div>");
                        }else{
                            trObj.eq(i).find('td').eq(7).find('.layui-table-cell').html("<div style='color:red;posion: relative' class='errordata'>修改失败</div>");
                            trObj.eq(i).find('td').eq(7).find('.layui-table-cell').append("<textarea class='layui-hide'>"+ msg +"</textarea>");
                        }
                    }
                }
                loading.hide()
            },
            error: function () {
                loading.hide()
                layer.msg("服务器正忙");
            }
        });

    });

    form.on('submit(amazon_replace)', function(data){
        var checkStatus = table.checkStatus('amazonModifyTitleTable');
        if(checkStatus.data.length>0&&tableIns){
            var layFilterIndex = 'LAY-table-'+tableIns.config.index;
            var tableContainer = $('div[lay-filter="'+layFilterIndex+'"]');
            tableContainer.find('input[name="layTableCheckbox"]:checked').each(function(){
                var tr= $(this).parents('tr');
                var wh_title = tr.find('textarea[name="title_js"]').val()||tr.find('.title_js').text();
                wh_title=replace_string(wh_title,data.field.old_string,data.field.new_string);
                tr.find('textarea[name="title_js"]').val(wh_title);
                tr.find('.title_js').text(wh_title);
            });
        }else{
            layer.msg("请选择需要修改的数据！")
        }
        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });
});
$('body').on('mouseover','.errordata',function(){
    var content = $(this).next("textarea").val()
    layer.tips(content, $(this), {
        time: 3000
    });

});