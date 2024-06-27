<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<!--抽离创建采购入库单页面-->
<!--新建入库单弹窗 start-->
<script type="text/html" id="stockinorder_add_layer">
    <div class="layui-row  layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <form  class="layui-form  pd" id="stockinorder_add_bill_form">
                <div class="layui-form-item">
                    <div class="layui-col-lg2 layui-col-md2" id="stockinorder_add_billNumber_div">
                        <label class="layui-form-label">采购订单</label>
                        <div class="layui-input-block">
                            <input type="text" name="billNumber" id="stockinorder_add_billNumber_input" class="layui-input" placeholder="精确查询">
                        </div>
                    </div>
                    <div class="layui-col-lg1 layui-col-md1">
                        <div class="layui-icon icon_refresh" id="stockinorder_add_bill_refresh_btn">&#xe669;</div>
                    </div>
                    <div class="layui-col-lg3 layui-col-md3">
                        <label class="layui-form-label">采购仓库</label>
                        <div class="layui-input-block">
                            <input type="text" name="storeName" class="layui-input" readonly style="background: #e6e6e6;">
                        </div>
                    </div>
                    <div class="layui-col-lg3 layui-col-md3">
                        <label class="layui-form-label">订单金额(￥)</label>
                        <div class="layui-input-block">
                            <input type="text" name="prevPayMoney" class="layui-input" placeholder="" readonly style="background: #e6e6e6;">
                        </div>
                    </div>
                    <div class="layui-col-lg3 layui-col-md3">
                        <label class="layui-form-label">供应商</label>
                        <div class="layui-input-block">
                            <input type="text" name="supplierName" id="stockin_supplierId" class="layui-input"  readonly style="background: #e6e6e6;">
                        </div>
                    </div>
                    <div class="layui-col-lg3 layui-col-md3">
                        <label class="layui-form-label">部门</label>
                        <div class="layui-input-block">
                            <input type="text" name="orgName" class="layui-input" readonly style="background: #e6e6e6;">
                        </div>
                    </div>
                    <div class="layui-col-lg3 layui-col-md3">
                        <label class="layui-form-label">采购专员</label>
                        <div class="layui-input-block">
                            <input type="text" name="buyer" class="layui-input" readonly style="background: #e6e6e6;">
                        </div>
                    </div>
                </div>
            </form>
            <form  class="layui-form  pd border" id="stockinorder_add_storage_form">
                <div class="layui-form-item">
                    <div class="layui-col-lg3 layui-col-md3">
                        <label class="layui-form-label">单号</label>
                        <div class="layui-input-block">
                            <input type="text"  id="stockinorder_add_storageNumber_input" class="layui-input" placeholder="新建后生成" readonly style="background: #e6e6e6;">
                        </div>
                    </div>
                    <div class="layui-col-lg3 layui-col-md3">
                        <label class="layui-form-label">制单时间</label>
                        <div class="layui-input-block">
                            <input type="text" class="layui-input" id="stockinorder_add_createTime_input" readonly style="background: #e6e6e6;" placeholder="当前提交时间">
                        </div>
                    </div>
                    <div class="layui-col-lg3 layui-col-md3">
                        <label class="layui-form-label">快递方式</label>
                        <div class="layui-input-block">
                            <select name="layerdeliverType" id="stockinlayerdeliverType" lay-verify="required" lay-search=""></select>
                        </div>
                    </div>
                    <div class="layui-col-lg3 layui-col-md3">
                        <label class="layui-form-label">快递单号</label>
                        <div class="layui-input-block">
                            <input type="text" class="layui-input" id="stockinorder_add_deliveryNumber_input" name="deliveryNumber" lay-verify="required">
                        </div>
                    </div>
                    <div class="layui-col-lg3 layui-col-md3">
                        <label class="layui-form-label">内部标签</label>
                        <div class="layui-input-block">
                            <select xm-select="layerinsiteNoteType" xm-select-skin="normal" name="layerinsiteNoteType" id="stockinlayerinsiteNoteType" lay-verify="required">
                            </select>
                        </div>
                    </div>
                    <div class="layui-col-lg3 layui-col-md3">
                        <label class="layui-form-label">备注</label>
                        <div class="layui-input-block">
                            <input type="text" name="remark" class="layui-input">
                        </div>
                    </div>
                    <div class="layui-col-lg3 layui-col-md3">
                        <div class="layui-input-block">
                            质检数=本次入库数
                        </div>
                    </div>
                </div>
            </form>
        </div>
        <div class="layui-col-lg12 layui-col-md12">
            <div class="dis_flex_start ">
                <div class="stockin_title">入库商品</div>
                <button class="layui-btn layui-btn-sm" id="stockinorder_add_addItem_btn">添加商品</button>
                <div class="layui-form-item" style="margin-left: 500px">
                    <div class="layui-col-md4 layui-col-lg4">
                        <input type="text" class="layui-input" id="stockinorder_sku_bacthUpdate_input">
                    </div>
                    <div class="layui-col-md2 layui-col-lg2">
                        <button type="button" class="layui-btn layui-btn-sm" id="stockinorder_sku_bacthUpdate_button">批量应用入库数量</button>
                    </div>
                </div>
            </div>
            <div class="">
                <table class="layui-table" id="stockinorder_add_addItem_table" lay-filter="stockinorder_add_addItem_table"></table>
            </div>
        </div>
    </div>
</script>

<script type="text/html" id="createStockInOrder_skuimage_tpl">
    <div>
        <img width="60" height="60" data-original="${tplIVP}{{d.image}}" class="img_show_hide b1 lazy" data-onerror="layui.admin.img_noFind()">
    </div>
</script>

<script type="text/html" id="stockinorder_addItemSku_buyerPrice_tpl">
    <input type="number" class="layui-input"  name="buyerPrice" value="{{d.buyerPrice}}" readonly style="background-color: #cccccc">
</script>

<script type="text/html" id="stockinorder_addItemSku_storageNum_tpl">
    {{# if(d.storageNum==null){ }}
    <input type="number"  name="storageNum" id="stockinorder_addItemSku_sku_input_{{d.prodSId}}" class="layui-input stockinorder_addItemSku_sku_input"   value="{{d.notStorageNum}}" min="0">
    {{# } else { }}
    <input type="number"  name="storageNum" id="stockinorder_addItemSku_sku_input_{{d.prodSId}}" class="layui-input stockinorder_addItemSku_sku_input"   value="{{ d.storageNum}}" min="0">
    {{# }}}
</script>

<script type="text/html" id="stockinorder_addItemSku_operate_tpl">
    {{# if(d.storageNumber ==null || d.storageNumber ==''){ }}
    <a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="del">删除</a>
    {{# }}}
</script>

<!--添加商品弹窗-->
<script type="text/html" id="stockinorder_addItem_layer">
    <div class="layui-row  layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <form class="layui-form  pd" >
                <div class="layui-form-item">
                    <div class="layui-col-lg3 layui-col-md3">
                        <label class="layui-form-label">商品SKU</label>
                        <div class="layui-input-block">
                            <input type="text"  id="stockinorder_addItem_sku_input" class="layui-input">
                        </div>
                    </div>
                    <div class="layui-col-lg3 layui-col-md3">
                        <div class="layui-input-block">
                            <button class="layui-btn layui-btn-sm" id="stockinorder_searchItem_btn">查询</button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
        <div class="layui-col-lg12 layui-col-md12">
            <div class="pd">
                <table class="layui-table" id="stockinorder_addItem_table" lay-filter="stockinorder_addItem_table"></table>
            </div>
        </div>
    </div>
</script>
<!--新建入库单弹窗 end-->

<script type="text/javascript">
    var stockinorder_add_btn_fun;//创建采购入库单
    var stockinorder_searchItem_fun;
    var stockinorder_addItemSku_fun;
    var stockinorder_getFormData_fun
    layui.use(['form','layer', 'formSelects', "table"], function () {
        var $ = layui.$,
            layer = layui.layer,
            table = layui.table,
            formSelects = layui.formSelects,
            form = layui.form;
        /*获取页面枚举值，eg：快递方式*/
        var deliverTypeList=[];
        var insiteNoteTypeList=[];
        $.ajax({
            url: ctx + "/purOrderBase/getPurOrderPageEnum.html",
            type: 'post',
            dataType: 'json',
            success: function (returnData) {
                if (returnData.code == "0000") {
                    deliverTypeList= returnData.data.deliverType;
                    insiteNoteTypeList= returnData.data.insiteNoteType;
                }else{
                    layer.msg("新建采购入库单获取页面枚举值出错",{icon:2});
                }
            }
        });
        //
        // billNumber 采购订单号
        // backFun 创建采购订单后的回调
        // params backFun 的参数
        //
        stockinorder_add_btn_fun = function (mainBillNumber,backFun,params) {
            var itemdata = [];
            var title="新增采购入库单";
            if(mainBillNumber !=null && mainBillNumber !=''){
                title="生成采购入库单";
            }
            var index = layer.open({
                type: 1,
                title: title,
                area: ["80%", '70%'],
                shadeClose: false,
                btn: ['提交', '关闭'],
                content: $("#stockinorder_add_layer").html(),
                success: function (index, layero) {
                    /**渲染快递方式下拉框**/
                    var deliverTypeStr='<option value=""></option>';
                    for (var i in deliverTypeList) {
                        var obj = deliverTypeList[i];
                        deliverTypeStr += '<option value=' + obj.value + '>' + obj.name + '</option>';
                    }
                    $("#stockinlayerdeliverType").html(deliverTypeStr);
                    var insiteNoteTypeStr='<option value=""></option>';
                    for (var i in insiteNoteTypeList) {
                        var obj = insiteNoteTypeList[i];
                        insiteNoteTypeStr += '<option value=' + obj.value + '>' + obj.name + '</option>';
                    }
                    $("#stockinlayerinsiteNoteType").html(insiteNoteTypeStr);
                    form.render('select');
                    formSelects.render();
                    $('#stockinorder_add_bill_refresh_btn').click(function () {
                        mainBillNumber = $('#stockinorder_add_billNumber_input').val();
                        if (mainBillNumber == null || mainBillNumber == "") {
                            layer.msg("请输入采购订单号", {icon: 0})
                            return;
                        }
                        loading.show();
                        $.ajax({
                            url: ctx + '/purOrderStorage/getPurOrderMainInfoByBillNumber.html',
                            data: {billNumber: mainBillNumber},
                            dataType: 'json',
                            type: 'post',
                            success: function (returnData) {
                                loading.hide();
                                if (returnData.code == "0000") {
                                    var resData = returnData.data;
                                    for (var i in resData) {
                                        $('#stockinorder_add_bill_form input[name="' + i + '"]').val(resData[i]);
                                    }
                                    $('#stockinorder_add_deliveryNumber_input').val(resData.logisticOrderNo);
                                    $("#stockinlayerdeliverType").val(resData.logisticName);
                                    form.render('select');
                                    /**20191126过滤掉已完全入库的商品**/
                                    var newDetailList = [];
                                    for (var i in resData.detailList) {
                                        var obj = resData.detailList[i];
                                        if (obj.orderNotInNum != null && Number(obj.orderNotInNum) > 0) {
                                            newDetailList.push(obj);
                                        }
                                    }
                                    itemdata = stockinorder_sku_unique(newDetailList);
                                    stockinorder_addItemSku_fun("stockinorder_add_addItem_table", itemdata);
                                } else {
                                    layer.msg(returnData.msg, {icon: 2});
                                }
                            }
                        });
                    });
                    if(mainBillNumber !=null && mainBillNumber !=''){
                        $('#stockinorder_add_billNumber_input').val(mainBillNumber);
                        $('#stockinorder_add_bill_refresh_btn').click();
                        $("#stockinorder_add_bill_refresh_btn").remove();
                        $("#stockinorder_add_billNumber_div").attr("class"," layui-col-lg3 layui-col-md3");
                    }
                    /**批量应用数量**/
                    $("#stockinorder_sku_bacthUpdate_button").click(function () {
                        var num = $("#stockinorder_sku_bacthUpdate_input").val();
                        if (num != null && num != '') {
                            $("#stockinorder_add_addItem_table").next().find(".stockinorder_addItemSku_sku_input").val(num);
                        }
                    });
                    $('#stockinorder_add_addItem_btn').click(function () {
                        mainBillNumber = $('#stockinorder_add_billNumber_input').val();
                        if (mainBillNumber == null || mainBillNumber == "") {
                            layer.msg('请先填写采购订单号', {icon: 0});
                            return false;
                        }
                        layer.open({
                            type: 1,
                            title: "添加商品",
                            area: ["80%", '70%'],
                            shadeClose: false,
                            btn: ['保存', '关闭'],
                            content: $("#stockinorder_addItem_layer").html(),
                            success: function (index) {
                                stockinorder_searchItem_fun(mainBillNumber);
                            },
                            yes: function (index, layero) {
                                var checkStatus = table.checkStatus('stockinorder_addItem_table');
                                itemdata = itemdata.concat(checkStatus.data);
                                itemdata = stockinorder_sku_unique(itemdata);
                                for (var i = 0; i < itemdata.length; i++) {
                                    var totalmoney = Number(itemdata[i].notStorageNum) * parseFloat(itemdata[i].buyerPrice);
                                    itemdata[i].totalmoney = totalmoney.toFixed(2);
                                }
                                table.reload('stockinorder_add_addItem_table', {data: itemdata});//重新渲染入库商品
                                stockinorder_storageNum_blur(itemdata);
                                layer.close(index);
                            }
                        });
                        return false;
                    });
                },
                //保存按钮
                yes: function (index, layero) {
                    if (itemdata == null || itemdata.length == 0) {
                        layer.msg("请先添加要入库商品", {icon: 0});
                        return false;
                    }
                    var allZero = true;
                    for (var i = 0; i < itemdata.length; i++) {
                        var obj = itemdata[i];
                        obj.storageNum=$("#stockinorder_addItemSku_sku_input_"+obj.prodSId).val();
                        if (obj.storageNum != null && obj.storageNum != 0) {
                            allZero=false;
                        }
                    }
                    if(allZero){
                        layer.msg("入库商品不能全为0", {icon: 0});
                        return false;
                    }
                    var data = stockinorder_getFormData_fun(itemdata, 'stockinorder_add_storage_form');
                    data.mainBillNumber = mainBillNumber;
                    if (stockinorder_addOrUpdateParamValidate(data, itemdata)) {//参数校验
                        stockinorder_addOneItem(data,backFun,params);//添加入库单
                    }
                },
                end: function (index) {
                    return false;
                }
            });
        };
        /**添加商品弹窗搜索商品**/
        stockinorder_searchItem_fun = function (mainBillNumber,storageNumber){
            $('#stockinorder_searchItem_btn').click(function () {
                var sku = $('#stockinorder_addItem_sku_input').val();
                if (sku == null || sku == '') {
                    layer.msg('请输入商品sku再查询', {icon: 0});
                    return false;
                }
                table.render({
                    elem: "#stockinorder_addItem_table",
                    id: 'stockinorder_addItem_table',
                    method: "post",
                    url: ctx + '/purOrderStorage/getStorageProdSInfoBySku.html',
                    where:{prodSSku:sku,mainBillNumber:mainBillNumber,storageNumber:storageNumber},
                    cols: [
                        [
                            {type: 'checkbox'},
                            {title: "图片", field: 'image', templet: '#createStockInOrder_skuimage_tpl'},
                            {title: "商品SKU", field: 'prodSSku'},
                            {title: "商品名称", field: 'title'},
                            {title: "含税单价(￥)", field: 'buyerPrice'},
                            {title: "未入库数", field: 'notStorageNum'},
                        ]
                    ],
                    done: function (res) {
                        imageLazyload();
                    }
                });
                return false;
            });
        };
        /**添加商品弹窗**/
        stockinorder_addItemSku_fun =function (idStr,itemdata){
            table.render({
                elem: "#"+idStr,
                id: idStr,
                data: itemdata,
                cols: [
                    [
                        {title: "图片", field: 'image', templet: '#createStockInOrder_skuimage_tpl'},
                        {title: "商品SKU", field: 'prodSSku'},
                        {title: "商品名称", field: 'title'},
                        {title: "开发专员", field: 'bizzOwner'},
                        {title: "单位", field: 'unit'},
                        {title: "库位", field: 'stockLocation'},
                        {title: "含税单价(￥)", field: 'buyerPrice', templet: '#stockinorder_addItemSku_buyerPrice_tpl'},
                        {title: "采购数量", field: 'buyNumber'},
                        {title: "未入库数", field: 'notStorageNum'},
                        {title: "本次入库数量", field: 'storageNum', templet: '#stockinorder_addItemSku_storageNum_tpl'},
                        {title: "本次入库金额", field: 'totalmoney'},
                        {title: "操作", toolbar: '#stockinorder_addItemSku_operate_tpl'},
                    ]
                ],
                limit: 100,
                done: function () {
                    imageLazyload();
                    table.on('tool(' + idStr + ')', function (obj) {
                        var data = obj.data;
                        var layEvent = obj.event;
                        if (layEvent === 'del') {
                            layer.confirm('确定删除这条商品吗', function (index) {
                                obj.del();
                                var dataindex = getIndex('prodSSku', itemdata, data.prodSSku);
                                if (dataindex > -1) {
                                    itemdata.splice(dataindex, 1);
                                }
                                layer.close(index);
                            });
                        }
                    });
                    stockinorder_storageNum_blur(itemdata);
                }
            });
        };
        // 获取请求提交数据
        stockinorder_getFormData_fun =function(itemdata, form) {
            return {
                'mainBillNumber': $('#' + form + ' input[name="billNumber"]').val(),
                'deliveryType': $('select[name="layerdeliverType"]').val(),
                'deliveryNumber': $('input[name="deliveryNumber"]').val(),
                'products': JSON.stringify(itemdata),
                'internalLabel': layui.formSelects.value('layerinsiteNoteType', 'val').join(','),
                'remark': $('#' + form + ' input[name="remark"]').val()
            }
        };
        /**新建采购入库单**/
        function stockinorder_addOneItem(data,backFun,params){
            loading.show();
            $.ajax({
                url: ctx + '/purOrderStorage/addOnePurOrderStorage.html',
                dataType: 'json',
                type: 'POST',
                data: data,
                success: function (returnData) {
                    loading.hide();
                    if (returnData.code == "0000") {
                        $('#stockinorder_add_storageNumber_input').val(returnData.data.storageNumber); //回填单号
                        $('#stockinorder_add_createTime_input').val(Format(returnData.data.createTime, 'yy-mm-dd hh:mm:ss')); //回填制单时间
                        layer.closeAll();
                        layer.msg(returnData.msg,{icon:1});
                        if(backFun){
                            backFun(params);
                        }
                    } else {
                        layer.msg(returnData.msg,{icon:2});
                    }
                },
                error: function (returnData) {
                    layer.msg(returnData.msg,{icon:2});
                }
            });
        };
        //获取数组中键为id，值为value的对象位置下标
        function getIndex(id, arr, value) {
            for (var i = 0; i < arr.length; i++) {
                if (value === arr[i][id]) {
                    return i;
                }
            }
            return -1;
        }
    });

    /**采购入库单数组去重(不能入库重复的sku)*/
    function stockinorder_sku_unique(arr) {
        var obj = {};
        var finalarr = [];
        for (var i in arr) {
            var curObj = arr[i];
            if (curObj.prodSSku == null || curObj.prodSSku == '') {
                curObj.prodSSku = curObj.sSku;
            }
            var prodSSku = curObj.prodSSku;
            if (curObj.buyerPrice == null || curObj.buyerPrice == '') {
                curObj.buyerPrice = curObj.taxPrice;
            }
            if (curObj.notStorageNum == null || curObj.notStorageNum == '') {
                curObj.notStorageNum = curObj.orderNotInNum || 0;
            }
            if (curObj.storageNum == null || curObj.storageNum == '') {
                curObj.storageNum = curObj.notStorageNum;
            }
            var totalmoney = Number(curObj.storageNum) * parseFloat(curObj.buyerPrice);
            curObj.totalmoney = totalmoney.toFixed(2);
            curObj.status = 1;
            if (obj[prodSSku] == null) {
                finalarr.push(curObj);
                obj[prodSSku] = curObj;
            }
        }
        return finalarr;
    };
    /**入库数量光标移走函数**/
    function stockinorder_storageNum_blur(itemdata){
        $('input[name="storageNum"]').blur(function () {
            var obj=this;
            var storageNum = parseInt($(obj).val());
            if (storageNum < 0) {
                layer.msg('库存不可调整为小于0', {icon: 0});
                $(obj).val(0);
                return false;
            }
            var prodSSku = $(obj).parents('td').siblings('td[data-field="prodSSku"]').find('div').text();
            for (var i in itemdata) {
                if (itemdata[i].prodSSku == prodSSku) {
                    var money = itemdata[i].buyerPrice;
                    var totalmoney = (parseFloat(money) * Number(storageNum)).toFixed(2);
                    $(obj).parents('td').siblings('td[data-field="totalmoney"]').find('div').text(totalmoney);
                    itemdata[i].totalmoney = totalmoney;
                    itemdata[i].storageNum = storageNum;
                    break;
                }
            }
        });
        $('input[name="buyerPrice"]').blur(function () {
            var obj=this;
            var buyerPrice = $(obj).val();
            var prodSSku = $(obj).parents('td').siblings('td[data-field="prodSSku"]').find('div').text();
            for (var i in itemdata) {
                if (itemdata[i].prodSSku == prodSSku) {
                    var storageNum = itemdata[i].storageNum;
                    var totalmoney = (parseFloat(buyerPrice) * Number(storageNum ? storageNum : 0)).toFixed(2);
                    $(obj).parents('td').siblings('td[data-field="totalmoney"]').find('div').text(totalmoney);
                    itemdata[i].totalmoney = totalmoney;
                    itemdata[i].buyerPrice = buyerPrice;
                    break;
                }
            }
        });
    };
    /**
     * 新增或修改采购入库单的参数校验
     * @returns {boolean}
     */
    function stockinorder_addOrUpdateParamValidate(data,itemdata){
        if(data.mainBillNumber==null||$.trim(data.mainBillNumber)==''){
            layer.msg("采购订单号不能为空",{icon:0});
            return false;
        }
        if(data.deliveryType==null||$.trim(data.deliveryType)==''){
           // layer.msg("快递方式不能为空",{icon:0});
            // return false;
        }
        if(data.deliveryNumber==null||$.trim(data.deliveryNumber)==''){
            layer.msg("快递单号不能为空",{icon:0});
            return false;
        }
        if(itemdata==null||itemdata.length ==0){
            layer.msg("请先添加要入库商品",{icon:0});
            return false;
        }
        for (var i = 0; i < itemdata.length; i++) {
            var obj=itemdata[i];
            if (obj.storageNum == null ) {
                layer.msg(obj.prodSSku+"入库数量不能为空",{icon:0});
                return false;
            }
            /***20191219 入库数允许大于采购数 ***/
            // if(obj.storageNum > obj.notStorageNum){
            //     layer.msg(obj.prodSSku+"入库数量"+obj.storageNum+"不能大于未入库数"+obj.notStorageNum,{icon:0});
            //     return false;
            // }
        }
        return true;
    };
</script>