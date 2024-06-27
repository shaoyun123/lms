console.log("mt");
layui.use(['admin', 'form', 'layer','table', 'formSelects', 'element', 'laydate'], function() {
	 var admin = layui.admin,
     form = layui.form,
     layer = layui.layer,
     table = layui.table,
     formSelects = layui.formSelects,
     element = layui.element,
     laydate = layui.laydate,
     laypage = layui.laypage,
     $ = layui.$
    //展示已知数据
        let newArr = []
        modifyTitle_arr.forEach(item => {
            let obj = { 
                id: item.id,
                itemId: item.itemId
            }
            newArr.push(obj)
        })
        table.render({
            elem: '#acm_Table',
            method:'post',
            url: ctx + '/ebayIsEnableProduct/searchEbayProdByIds.html',
            where:{'modifyTitle_arr':JSON.stringify(newArr)},
            cols: [[
                {type: "checkbox"},
                { field: "storeAcct", title: "店铺" },
                { field: "itemId", title: "item_id"},
                { field: "result",title: '操作结果',  align: 'center'}
            ]],
            //data:modifyTitle_arr,
            page:false,
            limit:100,
            height: 500,
            id:"acm_Table",
            /*page:false,
             id:"tortListngTable",
             limits:[10,20,50],
             limit:10,*/
            done:function(res, curr, count){
                $("#tolnum_span_ebay_acm_Table").text("共"+count+"条");
                if (res.code == '0000') {
                    $("#ebay_applicationCommonMode_site").html(res.data[0].site);//站点
                }
            }
        });

    /**
     * 根据站点获取模板
     */
    $.ajax({
        type: "POST",
        url: ctx + "/ebayIsEnableProduct/searchTemplateBySite.html",
        data:{'acm_arr':JSON.stringify(newArr)},
        async: true,
        dataType: "JSON",
        success: function (data) {
           /* console.log(JSON.stringify(data.data))
            console.log(JSON.parse(JSON.stringify(data.data.assiFieldEbayExcludeCountriess)));
            console.log(JSON.parse(JSON.stringify(data.data.assiFieldEbayGoodLocals)));
            console.log(JSON.parse(JSON.stringify(data.data.assiFieldEbayShip)));*/
            //不配送国家
            var afeec_arr = JSON.parse(JSON.stringify(data.data.assiFieldEbayExcludeCountriess));
            if(afeec_arr.length > 0){
                for(var i = 0; i<afeec_arr.length; i++){
                   $("#acm_notCity").append("<option value='"+afeec_arr[i].id+"'>"+afeec_arr[i].name+"</option>");
                }
            }
            //物流
            var afes_arr = JSON.parse(JSON.stringify(data.data.assiFieldEbayShip));
            if(afes_arr.length > 0){
                for(var i = 0; i<afes_arr.length; i++){
                    $("#acm_logistics").append("<option value='"+afes_arr[i].id+"'>"+afes_arr[i].name+"</option>");
                }
            }
            //商品所在地
            var afegl_arr = JSON.parse(JSON.stringify(data.data.assiFieldEbayGoodLocals));
            if(afegl_arr.length > 0){
                for(var i = 0; i<afegl_arr.length; i++){
                    $("#acm_goodsLocal").append("<option value='"+afegl_arr[i].id+"'>"+afegl_arr[i].name+"</option>");
                }
            }
            //邮箱
            var ssp = JSON.parse(JSON.stringify(data.data.sysSalesPlatAcct));
            if(ssp.paypalEmail1 != ""){
                $("#acm_payPalEmail").append("<option value='"+ssp.id+"'>"+ssp.paypalEmail1+"</option>");
            }
            if(ssp.paypalEmail2 != ""){
                $("#acm_payPalEmail").append("<option value='"+ssp.id+"'>"+ssp.paypalEmail2+"</option>");
            }
            if(ssp.paypalEmail3 != ""){
                $("#acm_payPalEmail").append("<option value='"+ssp.id+"'>"+ssp.paypalEmail3+"</option>");
            }
            form.render('select');
        }

    });
    /**
	 * 批量修改
     */
    $("#acm_button").click(function () {
        var acm = {};
        //console.log($("#acm_logistics option:selected").text()); //获取选中的项
        if($("#acm_logistics option:selected").val() != ""){
            acm.logisticsId=$("#acm_logistics option:selected").val();
            acm.logisticsName=$("#acm_logistics option:selected").text();
        }
        if($("#acm_date").val() != ""){
            acm.date = $("#acm_date").val();
        }
        if($("#acm_goodsLocal option:selected").val() != ""){
            acm.goodsLocalId=$("#acm_goodsLocal option:selected").val();
            acm.goodsLocalName=$("#acm_goodsLocal option:selected").text();
        }
        if($("#acm_notCity option:selected").val() != ""){
            acm.notCityId=$("#acm_notCity option:selected").val();
            acm.notCityName=$("#acm_notCity option:selected").text();
        }
        if(JSON.stringify(acm) == '{}'){
            layer.msg("没有需要修改的数据");
            return;
        }

        var mt_arr = [];
        //获取表格行对象
        var trObj =  $('#acm_Table').next().find('.layui-table-body tbody').find('tr');
        for(var i=0;i<trObj.length;i++){
            var checkStat = trObj.eq(i).find('td').eq(0).find('div').find('input').is(":checked");
            if(checkStat){
                let itemId = trObj.eq(i).find('td').eq(2).find('div').text();
                mt_arr.push(itemId);
            }
        }
        if(mt_arr.length <= 0){
            layer.msg("请选择需要修改的数据");
            return;
        }
        loading.show();
        acm.itemIdList = mt_arr;
        $.ajax({
            type: "POST",
            url: ctx + "/ebayIsEnableProduct/applicationCommonModule.html",
            data: JSON.stringify(acm),
            contentType: "application/json;charset=utf-8",
            async: true,
            dataType: "JSON",
            success:function (data) {
                var trObj =  $('#acm_Table').next().find('.layui-table-body tbody').find('tr');
                for(var i=0;i<trObj.length;i++){
                    var mt_itemid = trObj.eq(i).find('td').eq(2).find('div').text();
                    var msg = data.data[mt_itemid];

                    if(msg != undefined){
                        if(msg == "修改成功"){
                            trObj.eq(i).find('td').eq(3).find('.layui-table-cell').html("<div style='color:green'>" + data.data[mt_itemid] + "</div>");
                        }else{
                            trObj.eq(i).find('td').eq(3).find('.layui-table-cell').html("<div style='color:red;posion: relative' class='errordata'>修改失败</div>");
                            trObj.eq(i).find('td').eq(3).find('.layui-table-cell').append("<textarea class='layui-hide'>"+data.data[mt_itemid]+"</textarea>");
                        }
                    }
                }
                loading.hide()
            }
        })
    })
});
$('body').on('mouseover','.errordata',function(){
    var content = $(this).next("textarea").val()
    layer.tips(content, $(this), {
        time: 3000
    });
})