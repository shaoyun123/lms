<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<!--抽离创建采购退回单页面-->
<!--新建退回单弹窗 start-->
<!--新增采购退回单弹窗-->
<script type="text/html" id="rebackorder_add_layer">
    <div class="layui-row  layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <form  class="layui-form  pd" id="rebackorder_storage_form">
                <div class="layui-form-item">
                    <div class="layui-col-lg2 layui-col-md2" id="rebackorder_add_storageNumber_div">
                        <label class="layui-form-label">原入库单</label>
                        <div class="layui-input-block dis_flex">
                            <input type="text" name="storageNumber" id="rebackorder_add_storageNumber_input" class="layui-input" placeholder="精确查询" style="width:70%">
                            <div class="layui-icon icon_refresh" id="rebackorder_storageNumber_refresh">&#xe669;</div>
                        </div>
                    </div>
                    <div class="layui-col-lg2 layui-col-md2">
                        <label class="layui-form-label">采购仓库</label>
                        <div class="layui-input-block">
                            <input type="text" name="warehouseName" class="layui-input" disabled>
                        </div>
                    </div>
                    <div class="layui-col-lg2 layui-col-md2">
                        <label class="layui-form-label">部门</label>
                        <div class="layui-input-block">
                            <input type="text" name="orgName" class="layui-input" disabled>
                        </div>
                    </div>
                    <div class="layui-col-lg2 layui-col-md2">
                        <label class="layui-form-label">采购专员</label>
                        <div class="layui-input-block">
                            <input type="text" name="buyer" class="layui-input" disabled>
                        </div>
                    </div>
                    <div class="layui-col-lg3 layui-col-md3">
                        <label class="layui-form-label">供应商</label>
                        <div class="layui-input-block">
                            <input type="text" name="supplierName" class="layui-input" >
                        </div>
                    </div>
                </div>
            </form>
            <form  class="layui-form  pd border" id="rebackorder_add_back_form">
                <div class="layui-form-item">
                    <div class="layui-col-lg2 layui-col-md2">
                        <label class="layui-form-label">单号</label>
                        <div class="layui-input-block">
                            <input type="text" name="layer_rebackorderNo" id="rebackorder_add_back_backNumber_input" class="layui-input" placeholder="系统生成" readonly>
                        </div>
                    </div>
                    <div class="layui-col-lg2 layui-col-md2">
                        <label class="layui-form-label">制单时间</label>
                        <div class="layui-input-block">
                            <input type="text" class="layui-input" id="rebackorder_add_back_createTime_input" readonly placeholder="当前提交时间">
                        </div>
                    </div>
                    <div class="layui-col-lg2 layui-col-md2">
                        <label class="layui-form-label">快递方式</label>
                        <div class="layui-input-block">
                            <select name="deliveryType" id="rebackorderlayer_deliverType" lay-verify="required" lay-search=""></select>
                        </div>
                    </div>
                    <div class="layui-col-lg2 layui-col-md2">
                        <label class="layui-form-label">快递单号</label>
                        <div class="layui-input-block">
                            <input type="text" class="layui-input" name="deliveryNumber" lay-verify="required">
                        </div>
                    </div>
                    <div class="layui-col-lg2 layui-col-md2">
                        <label class="layui-form-label">公司付快递费</label>
                        <div class="layui-input-block">
                            <input type="text" class="layui-input" name="deliveryCost" lay-verify="required">
                        </div>
                    </div>
                    <div class="layui-col-lg2 layui-col-md2">
                        <label class="layui-form-label">退回物流费</label>
                        <div class="layui-input-block">
                            <input type="text" class="layui-input" name="logisticFee" lay-verify="required">
                        </div>
                    </div>
                </div>
                <div class="layui-form-item">
                    <div class="layui-col-lg2 layui-col-md2">
                        <label class="layui-form-label">付款方式</label>
                        <div class="layui-input-block">
                            <select name="payType" id="rebackorderlayer_payTypeList" lay-verify="required"></select>
                        </div>
                    </div>
                    <div class="layui-col-lg4 layui-col-md4">
                        <label class="layui-form-label">退回地址</label>
                        <div class="layui-input-block">
                            <input type="text" class="layui-input" name="backAddress" lay-verify="required">
                        </div>
                    </div>
                    <div class="layui-col-lg2 layui-col-md2">
                        <label class="layui-form-label">内部标签</label>
                        <div class="layui-input-block">
                            <select xm-select="rebackorderlayer_insiteNoteType" xm-select-skin="normal" name="internalLabel" id="rebackorderlayer_insiteNoteType" lay-verify="required"></select>
                        </div>
                    </div>
                    <div class="layui-col-lg2 layui-col-md2">
                        <label class="layui-form-label">实际退回金额</label>
                        <div class="layui-input-block">
                            <input type="text" class="layui-input" name="actBackMoney">
                        </div>
                    </div>
                    <div class="layui-col-lg2 layui-col-md2">
                        <label class="layui-form-label">备注</label>
                        <div class="layui-input-block">
                            <input type="text" name="remark" class="layui-input">
                        </div>
                    </div>
                </div>
            </form>
        </div>
        <div class="layui-col-lg12 layui-col-md12">
            <div class="dis_flex_start pd">
                <div class="stockin_title">退回商品</div>
                <!--20190919普源不支持增加或则删除sku-->
                <%--<button class="layui-btn layui-btn-sm" id="rebackorder_add_addItem_btn">添加商品</button>--%>
            </div>
            <div class="pd">
                <table class="layui-table" id="rebackorder_add_sku_table" lay-filter="rebackorder_add_sku_table"></table>
            </div>
        </div>
    </div>
</script>
<!--图片模板-->
<script type="text/html" id="rebackorder_skuimage_tpl">
    <div>
        <img width="60" height="60" data-original="${tplIVP}{{d.image}}" class="img_show_hide b1 lazy" data-onerror="layui.admin.img_noFind()">
    </div>
</script>
<script type="text/html" id="rebackorder_addItemSku_buyerPrice_tpl">
    {{# if(d.status=="1"){ }}
    <input type="number" class="layui-input" name="buyerPrice" value="{{d.buyerPrice}}" readonly> {{# }else{ }}
    <input type="number" class="layui-input" name="buyerPrice" value="{{d.buyerPrice}}" min="0"> {{# }}}
</script>
<!--退回单价-->
<script type="text/html" id="rebackorder_backPrice_tpl">
    <input  class="layui-input" name="backPrice" value="{{d.backPrice}}" min="0">
</script>
<!--本次退回数量-->
<script type="text/html" id="rebackorder_rebackNum_tpl">
    <input class="layui-input" name="backNum" value="{{d.backNum}}" min="0" readonly style="background-color: #cccccc" >
</script>
<script type="text/html" id="rebackorder_sku_operate_tpl">
    {{# if(d.backNumber == null ||d.backNumber==''){ }}
        <%--<a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="del">删除</a>--%>
    {{# }}}
</script>
<!--添加退回商品弹窗-->
<script type="text/html" id="rebackorder_additem_layer">
    <div class="layui-row  layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <form  class="layui-form  pd" id="">
                <div class="layui-form-item">
                    <div class="layui-col-lg3 layui-col-md3">
                        <label class="layui-form-label">商品SKU</label>
                        <div class="layui-input-block">
                            <input type="text" name="layer_sku" id="rebackorder_additem_sku_input" class="layui-input" placeholder="">
                        </div>
                    </div>
                    <div class="layui-col-lg3 layui-col-md3">
                        <div class="layui-input-block">
                            <button class="layui-btn layui-btn-sm" id="rebackorder_additem_search_btn">查询</button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
        <div class="layui-col-lg12 layui-col-md12">
            <div class="pd">
                <table class="layui-table" id="rebackorder_additem_table" lay-filter="rebackorder_additem_table"></table>
            </div>
        </div>
    </div>
</script>
<!--新建入库单弹窗 end-->

<script type="text/javascript">
    var rebackorder_add_btn_fun;//创建采购退回单
    var rebackorder_searchItem_fun;
    var rebackorder_addItemSku_fun;
    var rebackorder_getFormData_fun;
    var rebackorder_fillSelectAddAndUpdate_fun;
    var rebackorder_selectData = {};//页面枚举数字
    layui.use(['form','layer', 'formSelects', "table"], function () {
        var $ = layui.$,
            layer = layui.layer,
            table = layui.table,
            formSelects = layui.formSelects,
            form = layui.form;
        // 下拉框填入，初始化表单下拉框时调用
            $.ajax({
                url: ctx + "/purOrderBase/getPurOrderPageEnum.html",
                type: 'post',
                dataType: 'json',
                success: function (returnData) {
                    if (returnData.code == "0000") {
                        rebackorder_selectData=returnData.data;
                        rebackorder_fillSelectAddAndUpdate_fun();
                    }
                },
            });
        /**
         * 渲染新增和编辑多下拉框
         */
        rebackorder_fillSelectAddAndUpdate_fun = function() {
            for(var index in rebackorder_selectData){
                var array=rebackorder_selectData[index];
                var addStr = '<option value="">请选择</option>';
                for(var  name in array){
                    addStr += '<option value=' +array[name].value + '>' + array[name].name + '</option>';
                }
                if ($("#rebackorder_" + index).length > 0) {
                    $("#rebackorder_" + index).html(addStr);
                }
                if ($("#rebackorderlayer_" + index).length > 0) {
                    $("#rebackorderlayer_" + index).html(addStr);
                }
            }
            form.render('select');
            formSelects.render();
        }
        //
        // billNumber 采购订单号
        // backFun 创建采购订单后的回调
        // params backFun 的参数
        //
        rebackorder_add_btn_fun = function (storageNumber,backFun,params) {
            var itemdata = [];
            var title="新增采购退回单";
            if (storageNumber != null && storageNumber != '') {
                title = "生成采购退回单";
            }
            var  itemdata=[];
            var index = layer.open({
                type: 1,
                title: title,
                area: ["90%", '80%'],
                shadeClose: false,
                btn: ['提交', '关闭'],
                content: $("#rebackorder_add_layer").html(),
                success: function(index, layero) {
                    rebackorder_fillSelectAddAndUpdate_fun();
                    $('#rebackorder_storageNumber_refresh').click(function () {
                        var storageNumber = $('#rebackorder_add_storageNumber_input').val();
                        if (storageNumber == null || storageNumber == '') {
                            layer.msg('请填写原入库单号', {icon: 0});
                            return false;
                        }
                        loading.show();
                        $.ajax({
                            url: ctx + '/purOrderStorageBack/getPurOrderStorageBackInfoByStorageNumber.html',
                            data: {storageNumber: storageNumber},
                            dataType: 'json',
                            type: 'post',
                            success: function (returnData) {
                                loading.hide();
                                if (returnData.code == "0000") {
                                    var dto=returnData.data;
                                    for (var i in dto) {
                                        $('#rebackorder_storage_form input[name="' + i + '"]').val(dto[i]);
                                    }
                                    $('#rebackorder_add_back_form input[name="logisticFee"]').val(dto.logisticFee);
                                    itemdata = dto.detailDtos;
                                    itemdata = rebackorder_sku_unique('prodSSku', itemdata);
                                    rebackorder_addItemSku_fun('rebackorder_add_sku_table', itemdata,'rebackorder_add_back_form');
                                } else {
                                    layer.msg(returnData.msg, {icon: 2});
                                }
                            }
                        });
                    });
                    if(storageNumber !=null && storageNumber !=''){
                        $('#rebackorder_add_storageNumber_input').val(storageNumber);
                        $('#rebackorder_storageNumber_refresh').click();
                        $("#rebackorder_storageNumber_refresh").remove();
                        $("#rebackorder_add_storageNumber_div").attr("class"," layui-col-lg3 layui-col-md3");
                    }
                    // 添加商品
                    $('#rebackorder_add_addItem_btn').click(function() {
                        var storageNumber = $('#rebackorder_add_storageNumber_input').val();
                        if (storageNumber == null || storageNumber == "") {
                            layer.msg("采购入库单号不能为空",{icon:2});
                            return false;
                        }
                        layer.open({
                            type: 1,
                            title: "添加商品",
                            area: ["80%", '70%'],
                            shadeClose: false,
                            btn: ['保存', '关闭'],
                            content: $("#rebackorder_additem_layer").html(),
                            success: function(index, layero) {
                                stockinorder_searchItem(storageNumber)
                            },
                            yes: function(index, layero) {
                                var checkStatus = table.checkStatus('rebackorder_additem_table');
                                itemdata = itemdata.concat(checkStatus.data);
                                itemdata = rebackorder_sku_unique('prodSSku', itemdata);
                                table.reload('rebackorder_add_sku_table',{data: itemdata});//重新渲染入库商品
                                layer.close(index);
                            }
                        });
                        return false;
                    });
                },
                yes: function() {
                    var data = getrebackData(itemdata, 'rebackorder_add_back_form');
                    data.storageNumber = $('#rebackorder_add_storageNumber_input').val();
                    if(rebackorder_addOrUpdateParamValidate(data,itemdata)){
                        rebackorder_add_fun(data);
                    }
                    return false;
                }
            });
        };
        /**添加商品弹窗搜索商品**/
        rebackorder_searchItem_fun = function (storageNumber) {
            $('#rebackorder_additem_search_btn').click(function () {
                var prodSSku = $('#rebackorder_additem_sku_input').val();
                if (prodSSku == null || prodSSku == '') {
                    layer.msg('请输入商品sku再查询', {icon: 0});
                    return false;
                }
                table.render({
                    elem: "#rebackorder_additem_table",
                    method: "post",
                    url: ctx + '/purOrderStorageBack/getStorageBackProdSInfoBySku.html',
                    where: {prodSSku: prodSSku, storageNumber: storageNumber},
                    id: 'rebackorder_additem_table',
                    cols: [
                        [
                            {type: 'checkbox'},
                            {title: "图片", field: 'image', templet: '#rebackorder_skuimage_tpl'},
                            {title: "商品SKU", field: 'prodSSku'},
                            {title: "商品名称", field: 'title'},
                            {title: "含税单价($)", field: 'buyerPrice'},
                            {title: "入库数量", field: 'storageNum'},
                            {title: "已退回数量", field: 'alreadyBack'},
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
        rebackorder_addItemSku_fun = function (idStr, itemdata, formId) {
            table.render({
                elem: "#" + idStr,
                method: "post",
                data: itemdata,
                id: idStr,
                cols: [
                    [
                        {title: "图片", field: 'image', templet: '#rebackorder_skuimage_tpl'},
                        {title: "商品SKU", field: 'prodSSku'},
                        {title: "商品名称", field: 'title'},
                        {title: "含税单价(￥)", field: 'buyerPrice'},
                        {title: "退回单价(￥)", field: 'backPrice', templet: '#rebackorder_backPrice_tpl'},
                        {title: "入库数量", field: 'storageNum'},
                        {title: "已退回数量", field: 'alreadyBack'},
                        {title: "本次退回数量", field: 'backNum', templet: '#rebackorder_rebackNum_tpl'},
                        {title: "本次退回金额", field: 'totalmoney'},
                        {title: "操作", toolbar: '#rebackorder_sku_operate_tpl'},
                    ]
                ],
                limit: 100,
                done: function (res) {
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
                    stockinorder_backNum_blur(idStr, itemdata, formId);
                }
            });
        };
        // 获取请求提交数据
        rebackorder_getFormData_fun =function(itemdata, form) {
            var data = serializeObject($('#' + form));
            data.products = JSON.stringify(itemdata);
            return data;
        };
        /**
         * 添加采购退回单
         * @param data
         */
        function rebackorder_add_fun(data,backFun,params){
            loading.show();
            $.ajax({
                url: ctx + '/purOrderStorageBack/addOnePurOrderStorageBack.html',
                dataType: 'json',
                type: 'POST',
                data: data,
                success: function(returnData) {
                    loading.hide();
                    //提示成功，填入单号与制单时间
                    if (returnData.code == "0000") {
                        $('#rebackorder_add_back_backNumber_input').val(returnData.data.backNumber); //回填单号
                        $('#rebackorder_add_back_createTime_input').val(Format(returnData.data.createTime, 'yyyy-MM-dd hh:mm:ss')); //回填制单时间
                        layer.closeAll();
                        layer.msg(returnData.msg,{icon:1});
                        if(backFun){
                            backFun(params);
                        }
                    } else {
                        layer.msg(returnData.msg,{icon:2});
                    }
                }
            });
        };
    });
    //获取数组中键为id，值为value的对象位置下标
    function getIndex(id, arr, value) {
        for (var i = 0; i < arr.length; i++) {
            if (value === arr[i][id]) {
                return i;
            }
        }
        return -1;
    }
    // 退回sku数组去重
    function rebackorder_sku_unique(id, arr) {
        for (var i in arr) {
            var curObj = arr[i];
            var backNum = parseInt(curObj.storageNum - curObj.alreadyBack);
            var initbackNum = backNum < curObj.avaiableStock ? backNum : curObj.avaiableStock
            if (curObj.backNum == null) {
                curObj.backNum = initbackNum > 0 ? initbackNum : 0;
            }
            var totalmoney = Number(curObj.backNum || 0) * parseFloat(curObj.buyerPrice);
            curObj.totalmoney = totalmoney.toFixed(2);
            curObj.initbackNum = initbackNum;//初始退回数量
            arr[i] = curObj;
        }
        var idarr = [];
        var finalarr = [];
        for (var i = 0; i < arr.length; i++) {
            var index = idarr.indexOf(arr[i][id]);
            if (index == -1) {
                finalarr.push(arr[i]);
                idarr.push(arr[i][id]);
            }
        }
        return finalarr;
    };
    //获取数组中键为id，值为value的对象位置下标
    function getIndex(id, arr, value) {
        for (var i = 0; i < arr.length; i++) {
            if (value === arr[i][id]) {
                return i;
            }
        }
        return -1;
    };
    // 获取请求提交数据
    function getrebackData(itemdata, form) {
        var data = serializeObject($('#' + form));
        data.products = JSON.stringify(itemdata);
        return data;
    };
    /**退回数量光标移走函数**/
    function stockinorder_backNum_blur(idStr,itemdata,formId){
        $('input[name="backNum"]').blur(function() {
            var backNum = parseInt($(this).val());
            $(this).val(backNum);
            var prodSSku = $(this).parents('td').siblings('td[data-field="prodSSku"]').find('div').text();
            var indexsku = getIndex('prodSSku', itemdata, prodSSku);
            if (indexsku > -1) {
                if (backNum < 0) {
                    layer.msg('退回数量不可调整为小于0',{icon:0});
                    $(this).val(0);
                    $(this).parents('td').siblings('td[data-field="totalmoney"]').find('div').text(0.00);
                    return false;
                } else if (backNum > itemdata[indexsku].initbackNum) {
                    layer.msg('退回数量不能大于' + itemdata[indexsku].initbackNum,{icon:0});
                    $(this).val(itemdata[indexsku].initbackNum);
                    var totalmoney = Number(itemdata[indexsku].initbackNum || 0) * parseFloat(itemdata[indexsku].buyerPrice);
                    $(this).parents('td').siblings('td[data-field="totalmoney"]').find('div').text(totalmoney.toFixed(2));
                    return false;
                }
                var money = itemdata[indexsku].buyerPrice;
                itemdata[indexsku].totalmoney = totalmoney;
                itemdata[indexsku].backNum = backNum;
                itemdata[indexsku].status = 1;
                var totalmoney = Number(itemdata[indexsku].backNum || 0) * parseFloat(money);
                $(this).parents('td').siblings('td[data-field="totalmoney"]').find('div').text(totalmoney.toFixed(2));
            }
        });
        $('input[name="backPrice"]').blur(function () {
            var backPrice = $(this).val();
            var prodSSku = $(this).parents('td').siblings('td[data-field="prodSSku"]').find('div').text();
            var indexsku = getIndex('prodSSku', itemdata, prodSSku);
            if (indexsku > -1) {
                if (backPrice == null || backPrice == '' || backPrice == 0) {
                    layer.msg(prodSSku + '退回单价错误' + backPrice, {icon: 0});
                    $(this).val('')
                    return false;
                }
                itemdata[indexsku].backPrice = backPrice;
            }
        });
    };
    /**
     * 新增或修改采购入库单的参数校验
     * @returns {boolean}
     */
    function rebackorder_addOrUpdateParamValidate(data,itemdata){
        if (data.storageNumber == null || data.storageNumber == '') {
            layer.msg("原入库单号不能为空", {icon: 0});
            return false;
        }
        // if (data.deliveryType == null || data.deliveryType == '') {
        //     layer.msg("快递方式不能为空", {icon: 0});
        //     return false;
        // }
        // if (data.deliveryNumber == null || data.deliveryNumber == '') {
        //     layer.msg("快递单号不能为空", {icon: 0});
        //     return false;
        // }
        // if (data.backAddress == null || data.backAddress == '') {
        //     layer.msg("退回地址不能为空", {icon: 0});
        //     return false;
        // }
        // if (data.payType == null || data.payType == '') {
        //     layer.msg("付款方式不能为空", {icon: 0});
        //     return false;
        // }
        if (itemdata == null || itemdata.length == 0) {
            layer.msg("请先添加要退回的商品", {icon: 0});
            return false;
        }
        for (var i = 0; i < itemdata.length; i++) {
            var obj=itemdata[i];
            if (obj.backNum == null || obj.backNum == 0) {
                layer.msg(obj.prodSSku+"的退回数量不能小于等于0",{icon:0});
                return false;
            }
            if (obj.backNum != obj.storageNum ) {
                layer.msg(obj.prodSSku+"的退回数量不等于原入库数",{icon:0});
                return false;
            }
        }
        return true;
    };
</script>