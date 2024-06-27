/**
 *修改标题
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

    render_hp_orgs_users("#amazonModifyTitleForm");//渲染部门销售员店铺三级联动
    formSelects.render("amazon_mt_store_sel")

    //表格渲染结果
    //展示已知数据
    var data = new Object();
    if(stopAmazonArr.length > 0){
        data.idList=[];
        data.pidList = [];
        for (var i = 0; i < stopAmazonArr.length; i++) {
            if(stopAmazonArr[i].id != null && stopAmazonArr[i].id!=''){
                data.idList.push(stopAmazonArr[i].id);
            }else{
                data.pidList.push(stopAmazonArr[i].pId)
            }
        }
    }

    if(stopAmazonArr.length > 0){
        tableReload(data);
    }
    function tableReload(data) {
        tableIns = table.render({
            elem: "#amazonModifyTitleTable",
            method:'post',
            url: ctx + "/onlineProductAmazon/batchUpdateTitleQuery",
            cols: [[
                {type: "checkbox"},
                { field: "id", title: "id"},
                { field: "storeAcctId", title:"店铺id" },
                { field: "storeAcct", title: "店铺" , width: 100},
                { field: "prodSSku", title: "商品子SKU" , width: 100},
                { field: "storeSSku", title: "店铺子SKU", width: 200},
                { field: "asin", title: "ASIN", width: 150},
                { field: "siteId", title: "站点", width: 100},
                { field: "title", title: "标题",templet: '#new_title', width: 400},
                { field: "result",title: '操作结果'}
            ]],
            page:false,
            contentType:"application/json",
            where:data,
            height: 500,
            id:"amazonModifyTitleTable",
            limits:[10,20,50],
            limit:10,
            done:function(res, curr, count){
                $("[data-field='id']").css('display', 'none');
                $("[data-field='storeAcctId']").css('display', 'none');
                $("#tolnum_span_amazon_stock").text("共"+count+"条");

                commonAddEventTitleToggle($('#LAY_adjustPriceProcess'), 'amazon');
            }
        });
    }


    var active = {
        reload: function () {
            var formData = serializeObject($("#amazonModifyTitleForm"))
            formData.storeAcctId = formSelects.value("amazon_mt_store_sel","val").join(",");
            if(formData.skuValue == undefined || formData.skuValue == ''){
                return layer.msg("请输入SKU")
            }
            tableReload(formData);
        }
    };
    $("#amazonModifyTitleSearchBtn").click(function () {
        var type = $(this).data('type');
        active[type] ? active[type].call(this) : '';
    });

    //批量修改标题
    $('#modifyStockButtn').click(function(){
        //获取表格行对象
        var trObj =  $('#amazonModifyTitleTable').next().find('.layui-table-body tbody').find('tr');
        var  arr = new Array();
        for(var i=0;i<trObj.length;i++){
            var obj = new Object();
            obj.id =  $.trim(trObj.eq(i).find('td').eq(1).find('div').text());//id
            obj.storeAcctId =  $.trim(trObj.eq(i).find('td').eq(2).find('div').text());//店铺id
            obj.storeAcct =  $.trim(trObj.eq(i).find('td').eq(3).find('div').text());//店铺名称
            obj.prodSSku =  $.trim(trObj.eq(i).find('td').eq(4).find('div').text());//子sku
            obj.storeSSku =  $.trim(trObj.eq(i).find('td').eq(5).find('div').text());//店铺sku
            obj.asin =  $.trim(trObj.eq(i).find('td').eq(6).find('div').text());//
            obj.siteId =  $.trim(trObj.eq(i).find('td').eq(7).find('div').text());//
            obj.title =  $.trim(trObj.eq(i).find('td').eq(8).find('textarea').val());
            var checkStat = trObj.eq(i).find('td').eq(0).find('div').find('input').is(":checked");
            obj.type = 'title';
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
            url: ctx + "/amazonBatchOperationController/batchUpdateProductItemName",
            data: JSON.stringify(arr),
            contentType:"application/json",
            async: true,
            dataType: "json",
            success: function (data) {
                loading.hide()
            },
            error: function () {
                loading.hide()
                layer.msg('批量修改正在处理中，请等待...')
                // 后端让这样写的
                let ids = arr.map(item=>item.id)
                let amazonModifyTitle_timer = setInterval(function(){
                    amazonModifyTitle_getOptionResult(ids,amazonModifyTitle_timer)
                }, 2000);
            }
        });
    });

    function amazonModifyTitle_getOptionResult(idArr,amazonModifyTitle_timer){
        commonReturnPromiseRes({
            isLoading: false,
            type: 'POST',
            contentType: 'application/json;charset=UTF-8',
            url: `${ctx}/amazonBatchOperationController/getAllProcessResult?operType=MODIFY_TITLE`,
            params:JSON.stringify(idArr)
        }).then(res => {
            if(res.code == "0000"){
                clearInterval(amazonModifyTitle_timer);
                var trObj =  $('#amazonModifyTitleTable').next().find('.layui-table-body tbody').find('tr');
                for(var i=0;i<trObj.length;i++){
                    var id = trObj.eq(i).find('td').eq(1).find('div').text();
                    var msg = res.data[id];

                    if(msg != undefined){
                        if(msg.indexOf("成功") != -1){
                            trObj.eq(i).find('td').eq(9).find('.layui-table-cell').html("<div style='color:green'>" + msg + "</div>");
                        }else{
                            trObj.eq(i).find('td').eq(9).find('.layui-table-cell').html("<div style='color:red;position: relative' class='errordata'>修改失败</div>");
                            trObj.eq(i).find('td').eq(9).find('.layui-table-cell').append("<textarea class='layui-hide'>"+ msg +"</textarea>");
                        }
                    }
                }
            }
        }).catch(err => {
            // clearInterval(amazonModifyTitle_timer);
        })
    }

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