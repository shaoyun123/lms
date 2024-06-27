/**
 *删除
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

    render_hp_orgs_users("#amazonDeleteProForm");//渲染部门销售员店铺三级联动
    formSelects.render("amazondelpro_store_sel")

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
            elem: "#amazonDeleteProTable",
            method:'post',
            url: ctx + "/onlineProductAmazon/batchDeleteItemQuery",
            cols: [[
                {type: "checkbox"},
                { field: "id", title: "id"},
                { field: "storeAcctId", title:"店铺id" },
                { field: "storeAcct", title: "店铺" , width: 100},
                { field: "prodSSku", title: "商品子SKU" , width: 100},
                { field: "storeSSku", title: "店铺子SKU", width: 200},
                { field: "asin", title: "ASIN", width: 150},
                { field: "siteId", title: "站点", width: 100},
                { field: "title", title: "标题", width: 400},
                { field: "result",title: '操作结果'}
            ]],
            page:false,
            contentType:"application/json",
            where:data,
            height: 500,
            id:"amazonDeleteProTable",
            limits:[10,20,50],
            limit:10,
            done:function(res, curr, count){
                $("[data-field='id']").css('display', 'none');
                $("[data-field='storeAcctId']").css('display', 'none');
                $("#tolnum_span_amazondelpro_stock").text("共"+count+"条");
            }
        });
    }

    var active = {
        reload: function () {
            var formData = serializeObject($("#amazonDeleteProForm"))
            formData.storeAcctId = formSelects.value("amazondelpro_store_sel","val").join(",");
            if(formData.skuValue == undefined || formData.skuValue == ''){
                return layer.msg("请输入SKU")
            }
            tableReload(formData);
        }
    };
    $("#amazonDeleteProSearchBtn").click(function () {
        var type = $(this).data('type');
        active[type] ? active[type].call(this) : '';
    });

    //批量删除
    $('#amazonDeleteButton').click(function(){
        //获取表格行对象
        let tableChecked = layui.table.checkStatus("amazonDeleteProTable").data;
        if(tableChecked==null ||tableChecked.length==0){
            layer.msg("没有需要删除的商品！");
            return;
        }
        $.ajax({
            beforeSend: function(){
                loading.show();
            },
            type: "POST",
            url: ctx + "/amazonBatchOperationController/batchDeleteItem",
            data: JSON.stringify(tableChecked),
            contentType:"application/json",
            async: true,
            dataType: "json",
            success: function (data) {
                loading.hide()
            },
            error: function () {
                loading.hide()
                layer.msg('批量删除正在处理中，请等待...')
                // 后端让这样写的
                let ids = tableChecked.map(item=>item.id)
                let amazonDelPro_timer = setInterval(function(){
                    amazonDelPro_getOptionResult(ids,amazonDelPro_timer)
                }, 2000);
            }
        });
    });


    function amazonDelPro_getOptionResult(idArr,amazonDelPro_timer){
        commonReturnPromiseRes({
            isLoading: false,
            type: 'POST',
            contentType: 'application/json;charset=UTF-8',
            url: `${ctx}/amazonBatchOperationController/getAllProcessResult?operType=FBM_DELETE_ITEM`,
            params:JSON.stringify(idArr)
        }).then(res => {
            if(res.code == "0000"){
                clearInterval(amazonDelPro_timer);
                var trObj =  $('#amazonDeleteProTable').next().find('.layui-table-body tbody').find('tr');
                for(var i=0;i<trObj.length;i++){
                    var id = trObj.eq(i).find('td').eq(1).find('div').text();
                    var msg = res.data[id];

                    if(msg != undefined){
                        if(msg.indexOf("成功") != -1){
                            trObj.eq(i).find('td').eq(9).find('.layui-table-cell').html("<div style='color:green'>" + msg + "</div>");
                        }else{
                            trObj.eq(i).find('td').eq(9).find('.layui-table-cell').html("<div style='color:red;position: relative' class='errordata'>删除失败</div>");
                            trObj.eq(i).find('td').eq(9).find('.layui-table-cell').append("<textarea class='layui-hide'>"+ msg +"</textarea>");
                        }
                    }
                }
            }
        }).catch(err => {
            // clearInterval(amazonModifyTitle_timer);
        })
    }
});
$('body').on('mouseover','.errordata',function(){
    var content = $(this).next("textarea").val()
    layer.tips(content, $(this), {
        time: 3000
    });
});