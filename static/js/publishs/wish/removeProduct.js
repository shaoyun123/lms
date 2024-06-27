/**
 * 商品删除
 */
layui.use(['admin', 'form', 'layer','table', 'formSelects', 'element', 'laydate'], function() {
    var admin = layui.admin,
        form = layui.form,
        layer = layui.layer,
        table = layui.table,
        formSelects = layui.formSelects,
        tableisPPEnable={},
        $ = layui.$
    render_hp_orgs_users("#removeProdSearchForm");//渲染部门销售员店铺三级联动
    form.render(null, 'component-form-element');
    form.render(null, 'component-form-group');
    formSelects = layui.formSelects
    form.render('select');
    form.render('checkbox');
    //表格渲染结果
    //展示已知数据
    var data = new Object();
    if(op_arr.length > 0){
        data.idList=[];
        data.storeAcctIdList = [];
        data.storeAcctIdList = $.trim(data.storeAcctIdList);
        for (var i = 0; i < op_arr.length; i++){
            if($("#wish_online_online_num_span").parents("li").hasClass("layui-this")){
                data.isSale =1;
                $("#is_sale_p option[value='1']").attr("selected","selected");//根据值让option选中
            }
            if($("#wish_online_offline_num_span").parents("li").hasClass("layui-this")){
                data.isSale =0;
                $("#is_sale_p option[value='0']").attr("selected","selected");//根据值让option选中
            }
            data.idList.push(op_arr[i].id);
        }
        data.idList = data.idList.join(",");
    }
    if(op_arr.length > 0){
        tableReload(data);
    }

    function tableReload(data) {
        tableisPPEnable =table.render({
            elem: "#removeProdTable",
            method:'post',
            url: ctx + "/wishIsEnableProduct/removeProductPage.html",
            where:data,
            cols: [[
                {type: "checkbox"},
                { field: "id", title: "id" ,width: 90},
                { field: "storeAcctId", title: "店铺id" , width: 90},
                { field: "storeAcct", title: "店铺" , width: 80},
                { field: "pSku", title: "商品父SKU" , width: 150},
                { field: "pStoreSku", title: "店铺父SKU", width: 200},
                { field: "title", title: "标题", width: 200},
                { field: "auditStatus", title: "审核状态", templet:'#wish_auditStatus', width: 80 },
                { field: "isPromotion", title: "是否黄钻", templet:'#wish_isPromotion',width: 60 },
                { field: "isSale", title: "当前状态",templet:'#wish_isSale', width: 90 },
                { field: "result",title: '操作结果', width: 180, align: 'center'},
                { field: "storeProdPId", title: "平台商品子id", width: 180}
            ]],
            page:false,
            id:"removeProdTable",
            height: 500,
            limits:[10,20,50],
            limit:10,
            done:function(res, curr, count){
                $("[data-field='id']").css('display', 'none');
                $("[data-field='storeAcctId']").css('display', 'none');
                $("[data-field='storeProdPId']").css('display', 'none');
                $("#tolnum_span_wish_stop").text("共"+count+"条");
            }
        });
    }

    //渲染已选择数据
    function tableR() {
        if(op_arr.length > 0){
            var date = new Object();
            date.storeAcctIdList = '';
            date.sSkuList = [];
            //date.pSkuList=[];
            for (var i = 0; i < op_arr.length; i++){
                //date.pSkuList.push(op_arr[i].prodPSku)
                date.pSkuList = op_arr[i].prodPSku;
                if(op_arr[i].isSale){
                    date.isSale =1;
                }else {
                    date.isSale =2;
                }
            }
            //执行重载
            table.reload('removeProdTable', {
                where: date,
            });
        }
    }

    var active = {
        reload: function () {
            var data = new Object();
            data.storeAcctIdList = [];
            var storeAcct = $("#wish_removeProd_store_sel").val();
            if(storeAcct!=null && storeAcct!='') {
                data.storeAcctIdList.push(storeAcct);
            }else{
                $("#wish_removeProd_store_sel").children().each(function () {
                    if ($(this).val() != "") {
                        data.storeAcctIdList.push($(this).val());
                    }
                });
            }
            data.sSkuList = [];
            var skuStr = $.trim($("#removeProdSearchForm input[name='sSkuList']").val());
            if(skuStr !="" && skuStr!=null){
                data.pSkuList = $.trim(skuStr.split(","));
            }
            data.searchType = $("#wish_idEnable_skuSearchType").val();//搜索类型
            data.storeAcctIdList = $.trim(data.storeAcctIdList);
            var salepersonId = $.trim($("#removeProdSearchForm select[name='saleName']").val());
            data.salepersonId = salepersonId;
            var isSale = $.trim($("#removeProdSearchForm select[name='is_sale_p']").val());
            data.isSale = isSale;
            tableReload(data);
        }
    };
    $("#removeProdSearchBtn").click(function () {
        var type = $(this).data('type');
        active[type] ? active[type].call(this) : '';
    });
    $("#removeProdResetBtn").click(function () {
        $("#removeProdSearchForm input[name='sSku']").val('');
        formSelects.value('selectAttr', []);
    });

    //批量删除商品消息
    $('#batchRemoveProd').click(function(){
        // //获取表格行对象
        var trObj = $('#removeProdTable').next().find('.layui-table-body tbody').find('tr');
        var arr = new Array();
        for (var i = 0; i < trObj.length; i++) {
            var obj = new Object();
            obj.id = $.trim(trObj.eq(i).find('td').eq(1).find('div').text());//同步数据id
            obj.storeAcctId = $.trim(trObj.eq(i).find('td').eq(2).find('div').text());//店铺id
            obj.storeAcct = $.trim(trObj.eq(i).find('td').eq(3).find('div').text());//店铺名称
            obj.prodPSku = $.trim(trObj.eq(i).find('td').eq(4).find('div').text());//店铺sku
            obj.prodPStoreSku = $.trim(trObj.eq(i).find('td').eq(5).find('div').text());//店铺sku
            obj.title = $.trim(trObj.eq(i).find('td').eq(6).find('div').text());//标题
            obj.auditStatus = $.trim(trObj.eq(i).find('td').eq(7).find('div').text());//审核状态
            obj.isPromotion = $.trim(trObj.eq(i).find('td').eq(8).find('div').text());//是否黄钻
            var isSale = $.trim(trObj.eq(i).find('td').eq(9).find('div').text());//商品状态
            var checkStat = trObj.eq(i).find('td').eq(0).find('div').find('input').is(":checked");
            //只删除被选中的商品信息
            if (checkStat) {
                if(isSale == '上架中'){
                    obj.isSale=1
                }else{
                    obj.isSale =0;
                }
                arr.push(obj)
            }
        }
        if(arr==null ||arr.length==0){
            layer.msg("请选择需要删除的数据！");
            return;
        }
        var Confirmindex = layer.confirm("您正在移除商品，移除后商品不可还原，请确认是否要移除商品？", function (result) {
            layer.close(Confirmindex);
            if (result) {
                    $.ajax({
                        beforeSend: function () {
                            loading.show();
                        },
                        type: "POST",
                        url: ctx + "/wishIsEnableProduct/batchRemoveProd.html",
                        data: {'deleteArray': JSON.stringify(arr)},
                        async: true,
                        dataType: "json",
                        success: function (returnData) {
                            clearInterval(timeUnit);
                            if (returnData.code == "0000") {
                                loading.hide()
                                layer.msg(returnData.msg);
                                timeUnit = setInterval(function () {
                                    sel()
                                }, 5000);
                            } else {
                                loading.hide()
                                layer.msg(returnData.msg);
                            }
                        },
                        error: function () {
                            clearInterval(timeUnit);
                            loading.hide()
                            layer.msg("服务器正忙");
                        }
                    });
                timeUnit = setInterval(function () {
                    sel()
                }, 5000);
            }
        })
    });


    function sel(){
        var trObj =  $('#removeProdTable').next().find('.layui-table-body tbody').find('tr');
        for(var i=0;i<trObj.length;i++){
            var obj = new Object();
            obj.storeAcctId =  $.trim(trObj.eq(i).find('td').eq(2).find('div').text());//店铺id
            obj.prodPStoreSku =  $.trim(trObj.eq(i).find('td').eq(5).find('div').text());//店铺sku
            obj.productId =  $.trim(trObj.eq(i).find('td').eq(11).find('div').text());//平台商品Id
            var isSale = $.trim(trObj.eq(i).find('td').eq(9).find('div').text());//商品状态
            var checkStat = trObj.eq(i).find('td').eq(0).find('div').find('input').is(":checked");
            var resultMsg = trObj.eq(i).find('td').eq(10).find('.layui-table-cell').find('div').text();
            if((resultMsg=='' || resultMsg==null) && checkStat){
              if(isSale == '上架中'){
                  obj.isSale=1
               }else{
                  obj.isSale =0;
                }
                selectResult(obj,trObj,i);
            }
        }
    }
    function selectResult(obj,trObj,i){
        $.ajax({
            type: "POST",
            url: ctx + "/wishIsEnableProduct/selectRemoveProductResult.html",
            data: {'prodObj':JSON.stringify(obj)},
            dataType: "json",
            success: function (returnData) {
                clearInterval(timeUnit);
                if (returnData.code == "0000") {
                    if(returnData.msg =='删除成功'){
                        trObj.eq(i).find('td').eq(10).find('.layui-table-cell').html("<div style='color:blue'>"+returnData.msg+"</div>");
                    }else if(returnData.msg!=''&& returnData.msg!=null &&returnData.msg != 'undefined'){
                        trObj.eq(i).find('td').eq(10).find('.layui-table-cell').html("<div style='color:red'>"+returnData.msg+"</div>");
                    }
                } else {
                    layer.msg(returnData.msg);
                }
            },
            error: function () {
                clearInterval(timeUnit);
                layer.msg("服务器正忙");
            }
        });

    }

    //数组去重
    function uniq(array){
        var temp = []; //一个新的临时数组
        for(var i = 0; i < array.length; i++){
            if(temp.indexOf(array[i]) == -1){
                temp.push(array[i]);
            }
        }
        return temp;
    }

});