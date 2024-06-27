var pagedata = {};
layui.use(['admin', 'form', 'table', 'layer', 'laydate', 'tableMerge', 'formSelects', 'element'], function() {
    var admin = layui.admin,
        form = layui.form,
        table = layui.table,
        layer = layui.layer,
        formSelects = layui.formSelects,
        element = layui.element,
        laydate = layui.laydate;
    var reststockin_processStatus = 0; //当前流程状态
    var currentPId;
    var currentUserId;
    form.render();
    $('input[name="timerange"]').val(getLatestMonth().createTimeStart + ' - ' + getLatestMonth().createTimeEnd)
    laydate.render({
        elem: '#restintimerange',
        range: true
    });
    fillSelect(); //初始化页面下拉框填充
    // 新增其他入库单
    $('#restinorder_otherlistAdd_btn').click(function() {
        var itemdata = [];
        var index = layer.open({
            type: 1,
            title: '新建其它入库单',
            btn: ['提交', '关闭'],
            area: ['80%', '70%'],
            content: $('#reststockin_addEdit_layer').html(),
            success: function() {
                form.render();
                itemtableIns = table.render({
                    elem: "#reststockin_addItem_table",
                    data: itemdata,
                    id: 'reststockin_addItem_table',
                    cols: [
                        [
                            { title: "图片", field: 'image', templet: '#reststockin_sku_image_tpl' },
                            { title: "商品SKU", field: 'prodSSku' },
                            { title: "商品名称", field: 'title' },
                            { title: "含税单价(￥)", field: 'buyerPrice' ,templet: '#layer_restin_buyer_price'},
                            { title: "入库数量", field: 'storageNum', templet: '#layer_restinstorageNum' },
                            { title: "入库金额", field: 'totalmoney' },
                            { title: "操作", toolbar: '#reststockin_sku_operate_tpl' },
                        ]
                    ],
                    limit: 100,
                    done: function(res) {
                        imageLazyload();
                        table.on('tool(reststockin_addItem_table)', function(obj) {
                            var data = obj.data;
                            var layEvent = obj.event;
                            var tr = obj.tr;
                            if (layEvent === 'del') {
                                layer.confirm('确定删除这条商品吗', function(index) {
                                    obj.del();
                                    var dataindex = getIndex('prodSSku', itemdata, data.prodSSku);
                                    if (dataindex > -1) {
                                        itemdata.splice(dataindex, 1);
                                    }
                                    layer.close(index);
                                });
                            }
                        });
                        $('input[name="storageNum"]').blur(function() {
                            var storageNum = parseInt($(this).val());
                            $(this).val(storageNum);
                            var prodSSku = $(this).parents('td').siblings('td[data-field="prodSSku"]').find('div').text();
                            var indexsku = getIndex('prodSSku', itemdata, prodSSku);
                            if (indexsku > -1) {
                                if (storageNum < 0) {
                                    layer.msg('退回数量不可调整为小于0', { icon: 0 });
                                    $(this).val(0);
                                    $(this).parents('td').siblings('td[data-field="totalmoney"]').find('div').text(0.00);
                                    return false;
                                }
                                var money = itemdata[indexsku].buyerPrice;
                                itemdata[indexsku].storageNum = storageNum;
                                itemdata[indexsku].status = 1;
                                var totalmoney = Number(itemdata[indexsku].storageNum || 0) * parseFloat(money);
                                itemdata[indexsku].totalmoney = totalmoney;
                                $(this).parents('td').siblings('td[data-field="totalmoney"]').find('div').text(totalmoney.toFixed(2));
                            }
                        });
                        //含税单价可编辑
                        $('input[name="buyerPrice"]').blur(function() {
                            var buyerPrice = $(this).val();
                            var prodSSku = $(this).parents('td').siblings('td[data-field="prodSSku"]').find('div').text();
                            var indexsku = getIndex('prodSSku', itemdata, prodSSku);
                            if (indexsku > -1) {
                                //含税单价不做 小于0的条件判断2020/10/16
                               /* if (buyerPrice < 0) {
                                    layer.msg('含税单价不可调整为小于0', { icon: 0 });
                                    $(this).val(0);
                                    $(this).parents('td').siblings('td[data-field="totalmoney"]').find('div').text(0.00);
                                    return false;
                                }*/
                                //入库数量
                                var storageNum = itemdata[indexsku].storageNum;
                                itemdata[indexsku].buyerPrice = buyerPrice;
                                itemdata[indexsku].status = 1;
                                var totalmoney = Number(storageNum || 0) * parseFloat(buyerPrice);
                                itemdata[indexsku].totalmoney = totalmoney;
                                $(this).parents('td').siblings('td[data-field="totalmoney"]').find('div').text(totalmoney.toFixed(2));
                            }
                        });
                    }
                });
                $('#reststockin_addItem_btn').click(function() {
                    if($('#reststockin_addItem_div table tbody tr').length<=0){
                        var formdata = serializeObject($('#reststockin_addEdit_from'));
                        var warehouseId = formdata.storeId;
                        layer.open({
                            type: 1,
                            title: "添加商品",
                            area: ["80%", '70%'],
                            shadeClose: false,
                            btn: ['保存', '关闭'],
                            content: $("#reststockin_additem_layer").html(),
                            success: function(index, layero) {
                                $('#reststockin_searchItem_btn').click(function() {
                                    var prodSSku = $('#reststockin_additem_sku_input').val();
                                    if (prodSSku == null || prodSSku == '') {
                                        layer.msg('请输入商品sku再查询', { icon: 0 });
                                        return false;
                                    }
                                    if (warehouseId == null || warehouseId == "") {
                                        layer.msg('请选择仓库再查询', { icon: 0 });
                                        return false;
                                    }
                                    getItemlist(prodSSku ,warehouseId);
                                    return false;
                                });
                                $('#reststockin_additem_sku_input').on('keyup', function(e) {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    if (e.keyCode == 13) {
                                        var prodSSku = $('#reststockin_additem_sku_input').val();
                                        if (prodSSku == null || prodSSku == '') {
                                            layer.msg('请输入商品sku再查询', { icon: 0 });
                                            return false;
                                        }
                                        if (warehouseId == null || warehouseId == "") {
                                            layer.msg('请选择仓库再查询', { icon: 0 });
                                            return false;
                                        }
                                        getItemlist(prodSSku ,warehouseId);
                                        return false;
                                    }
                                })
                            },
                            yes: function(index, layero) {
                                var checkStatus = table.checkStatus('reststockin_additem_data_table');
                                if(checkStatus.data.length<=1){
                                    itemdata = itemdata.concat(checkStatus.data);
                                    itemdata = unique('prodSSku', itemdata);
                                    for (var i = 0; i < itemdata.length; i++) {
                                        itemdata[i].storageNum = 0;
                                        var totalmoney = Number(itemdata[i].storageNum || 0) * parseFloat(itemdata[i].buyerPrice);
                                        itemdata[i].totalmoney = totalmoney.toFixed(2);
                                    }
                                    itemtableIns.reload({
                                        data: unique('prodSSku', itemdata)
                                    })
                                    layer.close(index);
                                }else{
                                    layer.msg('一次只能保存选择一个商品', { icon: 0 });
                                }
                                
                            }
                        });
                    }else{
                        layer.msg('已经有一个商品了，请先提交再添加！', { icon: 0 });
                    }
                });
                // 填充表单下拉框
                for (var i in pagedata) {
                    appendoption('layer', i, pagedata[i]);
                }
                if (currentUserId) {
                    $("#layerdirectorList").val(currentUserId); //复制经办人为默认登录人
                    form.render();
                }
                form.render();
            },
            yes: function(index) {
                var formdata = serializeObject($('#reststockin_addEdit_from'));
                if (addOrUpdateValidateParam(formdata, itemdata)) { //参数校验
                    // newreststockin(formdata);
                    //ztt20210223改---ztt20221208在改
                    newreststockinValidate(formdata);
                }
            }
        })
    });
    /**批量审核**/
    $('#restinorder_batchcheckBtn').click(function() {
        var checkStatus = table.checkStatus('reststockin_data_table');
        var objData = checkStatus.data;
        if (objData == null || objData.length < 1) {
            layer.msg('请勾选要审核的入库单', { icon: 0 });
            return false;
        }
        var otherStorageNumbers = [];
        for (var i = 0; i < objData.length; i++) {
            if (objData[i].processStatus == 0) { //待审核
                otherStorageNumbers.push(objData[i].otherStorageNumber);
            } else {
                otherStorageNumbers.push(objData[i].otherStorageNumber);
            }
        }
        if (otherStorageNumbers == null || otherStorageNumbers.length < 1) {
            layer.msg('请勾选待审核的入库单', { icon: 0 });
            return false;
        }
        layer.confirm('确定开始批量审核这' + checkStatus.data.length + '条其他入库单?', function(index) {
            checkrestinkorder(otherStorageNumbers);
            layer.close(index);
        });
    });

    /**
     * 批量作废
     */
    $("#restinorder_abodon_purchaserOtherStorage").click(function (){
        var checkStatus = table.checkStatus('reststockin_data_table');
        var objData = checkStatus.data;
        if (objData == null || objData.length < 1) {
            layer.msg('请勾选要作废的入库单', { icon: 0 });
            return false;
        }
        var otherStorageNumbers = [];
        for (var i = 0; i < objData.length; i++) {
                otherStorageNumbers.push(objData[i].otherStorageNumber);
        }
        if (otherStorageNumbers == null || otherStorageNumbers.length < 1) {
            layer.msg('请勾选待审核的入库单', { icon: 0 });
            return false;
        }
        layer.confirm('确定开始批量作废这' + checkStatus.data.length + '条其他入库单?', function(index) {
            abondonrestinorder(otherStorageNumbers);
            layer.close(index);
        });
    });



    /**流程状态选项卡变更函数**/
    element.on('tab(reststockin_data_count_tab)', function(data) {
        reststockin_processStatus = $(this).attr("data-index");
        if(data.index ==0){//未审核
          $('#restinorder_batchcheckBtn').removeClass('disN'); //批量审核
          $('#restinorder_abodon_purchaserOtherStorage').removeClass('disN');//批量作废
          $('#restinorder_print').removeClass('disN');//打印
        }else if(data.index == 1){//已审核
          $('#restinorder_batchcheckBtn').addClass('disN'); //批量审核
          $('#restinorder_abodon_purchaserOtherStorage').addClass('disN');//批量作废
          $('#restinorder_print').addClass('disN');//打印
        }else if(data.index ==2){ //作废
          $('#restinorder_batchcheckBtn').addClass('disN'); //批量审核
          $('#restinorder_abodon_purchaserOtherStorage').addClass('disN');//批量作废
          $('#restinorder_print').addClass('disN');//打印
        }
        reststockin_table_render_fun();
    });
    table.on('tool(reststockin_data_table)', function(obj) {
        var data = obj.data;
        var layEvent = obj.event;
        var otherStorageNumbers = []
        if (layEvent === 'check') { //审核
            var otherStorageNumber = data.otherStorageNumber;
            layer.confirm('确定审核其它入库单?', function(index) {
                otherStorageNumbers.push(otherStorageNumber);
                checkrestinkorder(otherStorageNumbers);
                layer.close(index);
            });
        } else if (layEvent === 'edit') { //编辑
            var currrentProcess = data.processStatus;
            currentPId = data.id;
            var itemdata = []; //商品信息表格数据
            var otherStorageNumber = data.otherStorageNumber;
            var currentEditStoreId;
            var index = layer.open({
                type: 1,
                title: "修改其他入库单",
                area: ["80%", '70%'],
                shadeClose: false,
                btn: ['审核', '保存', '关闭'],
                content: $("#reststockin_addEdit_layer").html(),
                success: function(layero, index) {
                    //保存权限按钮控制
                    if(!$('#reststockin_layerDetailSaveBtn').html().trim()){
                      layero.find('.layui-layer-btn.layui-layer-btn- >.layui-layer-btn1').css('display','none');
                    }
                    if ($("#restinorder_batchcheckBtn").length == 1) {
                        layero.find(".layui-layer-btn0").css({ 'float': 'left' });
                    } else {
                        layero.find(".layui-layer-btn0").css({ 'display': 'none' });
                    }
                    if (currrentProcess != 0) {
                        layero.find(".layui-layer-btn0").css({ 'display': 'none' });
                    }
                    form.render('select');
                    var itemtableIns = {};
                    // 填充表单下拉框
                    for (var i in pagedata) {
                        appendoption('layer', i, pagedata[i]);
                    }
                    form.render();
                    formSelects.render();
                    $.ajax({
                        url: ctx + '/purOtherStorage/getPurOtherStorageInfoByStorageNumber.html',
                        dataType: 'json',
                        data: { otherStorageNumber: otherStorageNumber },
                        type: 'post',
                        success: function(returnData) {
                            if (returnData.code == "0000") {
                                for (var i in returnData.data) {
                                    $('#reststockin_addEdit_from input[name="' + i + '"]').val(returnData.data[i]);
                                    if (i == 'createTime') {
                                        $('#new_rebackorder input[name="' + i + '"]').val(Format(returnData.data[i], 'yyyy-MM-dd hh:mm:ss'));
                                    } else if (i == 'problemRemark') {
                                        $('#reststockin_problemRemark').val(returnData.data[i]);
                                    }
                                }
                                itemdata = returnData.data.detailDtos;
                                // 构造商品信息表格渲染数据
                                for (var i in returnData.data.detailDtos) {
                                    itemdata[i].totalmoney = returnData.data.detailDtos[i].storageMoney;
                                    itemdata[i].otherStorageNumber = otherStorageNumber;
                                }
                                // 下拉选中
                                selected('reststockin_addEdit_from', 'storageType', returnData.data.storageType);
                                //渲染复选框
                                selected('reststockin_addEdit_from', 'storeId', returnData.data.storeId);
                                currentEditStoreId=returnData.data.storeId
                                selected('reststockin_addEdit_from', 'directorId', returnData.data.directorId);
                                $("#layerwarehouseList").attr("disabled","disabled");
                                form.render('select');
                                // 渲染入库商品信息表格
                                itemtableIns = table.render({
                                    elem: "#reststockin_addItem_table",
                                    method: "post",
                                    data: itemdata,
                                    id: 'reststockin_addItem_table',
                                    cols: [
                                        [
                                            { title: "图片", field: 'image', templet: '#reststockin_sku_image_tpl' },
                                            { title: "商品SKU", field: 'prodSSku' },
                                            { title: "商品名称", field: 'title' },
                                            { title: "含税单价(￥)", field: 'buyerPrice',templet: '#layer_restin_buyer_price' },
                                            { title: "库位", field: 'stockLocation' },
                                            { title: "入库数量", field: 'storageNum', templet: '#layer_restinstorageNum' },
                                            { title: "入库金额", field: 'totalmoney' },
                                            { title: "操作", toolbar: '#reststockin_sku_operate_tpl' },
                                        ]
                                    ],
                                    limit: 100000,
                                    done: function(res) {
                                        imageLazyload();
                                        table.on('tool(reststockin_addItem_table)', function(obj) {
                                            var data = obj.data;
                                            var layEvent = obj.event;
                                            var tr = obj.tr;
                                            //  删除商品
                                            if (layEvent === 'del') {
                                                layer.confirm('确定删除这条商品吗', function(index) {
                                                    obj.del();
                                                    var dataindex = getIndex('prodSSku', itemdata, data.prodSSku);
                                                    if (dataindex > -1) {
                                                        itemdata.splice(dataindex, 1);
                                                    }
                                                    layer.close(index);
                                                });
                                            }
                                        });
                                        $('input[name="storageNum"]').blur(function() {
                                            var storageNum = parseInt($(this).val());
                                            $(this).val(storageNum);
                                            var prodSSku = $(this).parents('td').siblings('td[data-field="prodSSku"]').find('div').text();
                                            var indexsku = getIndex('prodSSku', itemdata, prodSSku);
                                            if (indexsku > -1) {
                                                if (storageNum < 0) {
                                                    layer.msg('退回数量不可调整为小于0', { icon: 0 });
                                                    $(this).val(0);
                                                    $(this).parents('td').siblings('td[data-field="totalmoney"]').find('div').text(0.00);
                                                    return false;
                                                }
                                                var money = itemdata[indexsku].buyerPrice;
                                                itemdata[indexsku].storageNum = storageNum;
                                                itemdata[indexsku].status = 1;
                                                var totalmoney = Number(itemdata[indexsku].storageNum || 0) * parseFloat(money);
                                                itemdata[indexsku].totalmoney = totalmoney;
                                                $(this).parents('td').siblings('td[data-field="totalmoney"]').find('div').text(totalmoney.toFixed(2));
                                            }
                                        });
                                        //含税单价可编辑
                                        $('input[name="buyerPrice"]').blur(function() {
                                            var buyerPrice = $(this).val();
                                            var prodSSku = $(this).parents('td').siblings('td[data-field="prodSSku"]').find('div').text();
                                            var indexsku = getIndex('prodSSku', itemdata, prodSSku);
                                            if (indexsku > -1) {
                                                //含税单价不做 小于0的条件判断2020/10/16
                                                /* if (buyerPrice < 0) {
                                                     layer.msg('含税单价不可调整为小于0', { icon: 0 });
                                                     $(this).val(0);
                                                     $(this).parents('td').siblings('td[data-field="totalmoney"]').find('div').text(0.00);
                                                     return false;
                                                 }*/
                                                //入库数量
                                                var storageNum = itemdata[indexsku].storageNum;
                                                itemdata[indexsku].buyerPrice = buyerPrice;
                                                itemdata[indexsku].status = 1;
                                                var totalmoney = Number(storageNum || 0) * parseFloat(buyerPrice);
                                                itemdata[indexsku].totalmoney = totalmoney;
                                                $(this).parents('td').siblings('td[data-field="totalmoney"]').find('div').text(totalmoney.toFixed(2));
                                            }
                                        });
                                    }
                                });
                            } else {
                                layer.msg(returnData.msg, { icon: 2 });
                            }
                        }
                    });
                    $('#reststockin_addItem_btn').hide();
                    $('#reststockin_addItem_btn').click(function() {
                        if($('#reststockin_addItem_div table tbody tr').length<=0){
                            var formdata = serializeObject($('#reststockin_addEdit_from'));
                            var warehouseId = formdata.storeId;
                            layer.open({
                                type: 1,
                                title: "添加商品",
                                area: ["80%", '70%'],
                                shadeClose: false,
                                btn: ['保存', '关闭'],
                                content: $("#reststockin_additem_layer").html(),
                                success: function(index, layero) {
                                    $('#reststockin_searchItem_btn').click(function() {
                                        var sku = $('#reststockin_additem_sku_input').val();
                                        if (sku != "") {
                                            if (warehouseId && warehouseId != "") {
                                                getItemlist(sku,warehouseId);
                                            }else {
                                                layer.msg('请选择仓库再查询', { icon: 0 });
                                            }
                                            return false;
                                        } else {
                                            layer.msg('请输入商品sku再查询', { icon: 0 });
                                        }
                                        return false;
                                    });
                                },
                                yes: function(index, layero) {
                                    var checkStatus = table.checkStatus('reststockin_additem_data_table');
                                    if(checkStatus.data.length<=1){
                                        itemdata = itemdata.concat(checkStatus.data);
                                        itemdata = unique('prodSSku', itemdata);
                                        for (var i = 0; i < itemdata.length; i++) {
                                            itemdata[i].storageNum = 0;
                                            var totalmoney = Number(itemdata[i].storageNum || 0) * parseFloat(itemdata[i].buyerPrice);
                                            itemdata[i].totalmoney = totalmoney.toFixed(2);
                                        }
                                        itemtableIns.reload({
                                            data: unique('prodSSku', itemdata)
                                        })
                                        layer.close(index);
                                    }else{
                                        layer.msg('一次只能保存选择一个商品', { icon: 0 });
                                    }
                                }
                            });
                        }else{
                            layer.msg('已经有一个商品了，请先提交再添加！', { icon: 0 });
                        }
                    });
                },
                yes: function(index, layero) { //审核
                    if (currrentProcess != 0) { //如果不是未审核状态的不予编辑
                        layer.close(index);
                        return false;
                    }
                    var otherStorageNumbers = []; //多个其它入库单号
                    otherStorageNumbers.push(otherStorageNumber);
                    checkrestinkorder(otherStorageNumbers); //审核
                },
                btn2: function(index) { //修改
                    if (currrentProcess != 0) {
                        layer.close(index);
                        return false;
                    }
                    var data = getrestinkData(itemdata, 'reststockin_addEdit_from');
                    data.storeId=currentEditStoreId;
                    if (data.backAddress != "" && data.storageNumber != "" && data.deliveryType != "" && data.deliveryNumber != "") {
                        if (itemdata.length > 0) {
                            for (var i = 0; i < itemdata.length; i++) {
                                if (!itemdata[i].storageNum || itemdata[i].storageNum == 0) {
                                    layer.msg("请填写入库数量", { icon: 0 });
                                    return false;
                                }
                            }
                            updatestockin(data);
                            // updatestockinValidate(data);
                            return false;
                        } else {
                            layer.msg("请先添加要退回的商品", { icon: 0 });
                        }
                    } else {
                        layer.msg("原入库单号，退单地址，快递类型，快递单号不能为空", { icon: 0 });
                    }
                    return false;
                },
                btn3: function() { //关闭
                    reststockin_table_render_fun(); //重新搜索
                }
            });
        } else if (layEvent === 'abodon') { //作废
            layer.confirm('确定作废这条入库单?', function(index) {
                otherStorageNumbers.push(data.otherStorageNumber);
                abondonrestinorder(otherStorageNumbers);
            })
        } else {
            layer.confirm('确定将这条已审核入库单取消审核?', function(index) {
                otherStorageNumbers.push(otherSdata.otherStorageNumbertorageNumber);
                transfertoabandon(otherStorageNumbers);
            })
        }
    });
    //表单查询
    $('#restinorder_search_btn').click(function() {
        reststockin_table_render_fun();
    });
    /**导入*/
    $('#reststockin_import_button').click(function() {
        var storeId = $("#restinwarehouseList").val();
        if (storeId == null || storeId == '') {
            layer.msg("请在查询条件中选择一个仓库", { icon: 0 });
            return false;
        }
        let inTypeArr = layui.formSelects.value('restinstorageTypeList').map(item => item.val);
        if(inTypeArr.length > 1){
          layer.msg("导入仅允许选择一个入库类别", { icon: 0 });
          return false;
        }
        var inType = inTypeArr.join(',');
        if (inType == null || inType == '') {
            layer.msg("请在查询条件中选择入库类别", { icon: 0 });
            return false;
        }
        document.getElementById('reststockin_storageInList_file').click();
    });
    // 通过导入excel 新增其它入库商品
    $('#reststockin_storageInList_file').on('change', function() {
        var files = $('#reststockin_storageInList_file')[0].files
        if (files.length == 0) {
            $('#reststockin_storageInList_file').val('');
            return;
        }
        // 校验文件类型
        var fileName = files[0].name
        var seat = fileName.lastIndexOf(".");
        var extension = fileName.substring(seat).toLowerCase();
        if (extension != '.xlsx' && extension != 'xls') {
            $('#reststockin_storageInList_file').val('');
            layer.msg('请传入后缀为.xlsx或者.xls 的Excel文件', { icon: 0 })
            return
        }
        let inTypeVal = layui.formSelects.value('restinstorageTypeList').map(item => item.val).join(',');
        var formData = new FormData();
        formData.append("file", files[0]);
        formData.append("storeId", $("#restinwarehouseList").val());
        formData.append("storageType",inTypeVal);
        layer.confirm('确认导入这个文件进行批量生成其它入库单信息吗', { btn: ['确认', '取消'] },
            function() {
                loading.show()
                $.ajax({
                    url: ctx + '/purOtherStorage/importPurOtherStorageIn.html',
                    type: 'post',
                    data: formData,
                    processData: false,
                    contentType: false,
                    success: function(returnData) {
                        loading.hide()
                        $('#reststockin_storageInList_file').val('');
                        if (returnData.code === '0000') {
                            layer.msg(returnData.msg, { icon: 1 });
                            reststockin_table_render_fun();
                        } else {
                            layer.msg(returnData.msg, { icon: 2 });
                        }
                    },
                    error: function() {
                        loading.hide()
                        $('#reststockin_storageInList_file').val('')
                    }
                });
            },
            function() {
                $('#reststockin_storageInList_file').val('');
                layer.closeAll()
            }
        )
    });
    // 打印
    table.on('checkbox(reststockin_data_table)', function(obj) {
        // 获取被选中的行数据
        var selectedData = table.checkStatus('reststockin_data_table').data;
        let ids=selectedData.map(item => item.id).join(',');
        $('#restinorder_print').off('click');
        $('#restinorder_print').click(function(){
            if(selectedData.length>>0){
                commonReturnPromise({
                    url: "/lms/printTemplate/common/getPrintInfo",
                    type: "post",
                    contentType: "application/json",
                    params: JSON.stringify({
                        printTplType: 'OTHER_STORAGE_ORDER_LABEL',
                        bizId: ids
                    }),
                  }).then((res) => {
                    let print_params={
                        printType:19,
                        labelUrl:res.labelUrl,
                        printName:res.printName,
                        width:res.width,
                        height:res.height
                    }
                    $.ajax({
                        type: "post",
                        url: "http://localhost:9898",
                        dataType: "json",
                        data: print_params,
                        success: function () {
                            loading.show()
                        },
                        error: function (jqXHR) {
                           loading.hide()
                          var responseText = jqXHR.responseText
                          if (responseText == null || responseText.indexOf("打印成功") == -1) {
                            reject("打印错误，请检查打印插件是否正常运行或者重新启动插件", { icon: 2 })
                          }
                          resolve("打印成功")
                        },
                      })
                  }).catch((res)=>{
                      layer.msg(res,{icon:2})
                  })
            }else{
                layer.msg('请勾选要打印的入库单',{icon:0});
            }
        })
      });
      $("#restinorder_print").click(function(){
        layer.msg('请勾选要打印的入库单', { icon: 0 });
      });
    function newreststockinValidate(data){
        //数据校验-ztt20210223
        var dataArr = new Function(`return ${data.products}`)();
        var judgeBuyerArr = []; //判断入库成本
        // var judgeratioArr = []; //判断比值是否超过50%
        for(var i=0; i<dataArr.length; i++){
            var item = dataArr[i];
            if(commonJudgeIsEmpty(+item.totalmoney)){
                judgeBuyerArr.push(item.prodSSku);
            }
            // if(commonJudgeIsEmpty(+item.whStockAvgCost)){ //没有库存成本
            //     var ratioVal = Math.abs(item.buyerPrice - item.purchaseCostPrice) > (item.purchaseCostPrice)/2;
            //     if(ratioVal){
            //         judgeratioArr.push(item.prodSSku);
            //     }
            // }else{ //有库存平均成本
            //     var ratioVal = Math.abs(item.buyerPrice - item.whStockAvgCost) > (item.whStockAvgCost)/2;
            //     if(ratioVal){
            //         judgeratioArr.push(item.prodSSku);
            //     }
            // }
        }
        if(judgeBuyerArr.length > 0){
            layer.confirm(`${judgeBuyerArr.join('')}的入库成本为0,是否确认入库`, {icon: 7, title:'提示'}, function(index){
                // if(judgeratioArr.length >0){
                //     layer.confirm(`${judgeratioArr.join('')}的入库成本和库存平均成本相差超过50%`, {icon: 7, title:'提示'}, function(index){
                //         newreststockin(data);
                //         layer.close(index);
                //     }); 
                // }else{
                //     newreststockin(data);
                //     layer.close(index);
                // }
                newreststockin(data);
                layer.close(index);
            }); 
        }
        else {
            newreststockin(data);
            // if(judgeratioArr.length >0){
            //     layer.confirm(`${judgeratioArr.join('')}的入库成本和库存平均成本相差超过50%`, {icon: 7, title:'提示'}, function(index){
            //         newreststockin(data);
            //         layer.close(index);
            //     }); 
            // }else{
            //     newreststockin(data);
            // }
        }
    }
    //提交新建入库单
    function newreststockin(data) {
        $.ajax({
            url: ctx + "/purOtherStorage/addOnePurOtherStorage.html",
            type: 'POST',
            dataType: 'json',
            data: data,
            beforeSend:function(){
                loading.show();
            },
            success: function(returnData) {
                loading.hide();
                if (returnData.code === "0000") {
                    layer.closeAll();
                    layer.msg(returnData.msg, { icon: 1 });
                    $('#reststockin_otherStorageNumber_add').val(returnData.data.otherStorageNumber);
                    reststockin_table_render_fun();
                } else {
                    layer.msg(returnData.msg, { icon: 2 });
                }
            },
            complete: function(XMLHttpRequest, textStatus) {
                loading.hide();
            },
        });
    };
    //ztt-20210224改
    function updatestockinValidate(data){
        var dataArr = new Function(`return ${data.products}`)();
        var judgeBuyerArr = []; //判断入库成本
        var judgeratioArr = []; //判断比值是否超过50%
        for(var i=0; i<dataArr.length; i++){
            var item = dataArr[i];
            // console.log('循环',item)
            if(commonJudgeIsEmpty(+item.buyerPrice)){
                judgeBuyerArr.push(item.prodSSku);
                console.log(judgeBuyerArr)
            }
            if(commonJudgeIsEmpty(+item.whStockAvgCost)){ //没有库存成本
                var ratioVal = Math.abs(item.buyerPrice - item.purchaseCostPrice) > (item.purchaseCostPrice)/2;
                if(ratioVal){
                    judgeratioArr.push(item.prodSSku);
                }
            }else{ //有库存平均成本
                var ratioVal = Math.abs(item.buyerPrice - item.whStockAvgCost) > (item.whStockAvgCost)/2;
                if(ratioVal){
                    judgeratioArr.push(item.prodSSku);
                }
            }
        }
        if(judgeBuyerArr.length > 0){
            console.log(judgeBuyerArr)
            layer.confirm(`${judgeBuyerArr.join('')}的入库成本为0,是否确认入库`, {icon: 7, title:'提示'}, function(index){
                if(judgeratioArr.length >0){
                    layer.confirm(`${judgeratioArr.join('')}的入库成本和库存平均成本相差超过50%`, {icon: 7, title:'提示'}, function(index){
                        // newreststockin(data);
                        updatestockin(data)
                        layer.close(index);
                    }); 
                }else{
                    // newreststockin(data);
                    updatestockin(data)
                    layer.close(index);
                }
            }); 
        }else{
            if(judgeratioArr.length >0){
                layer.confirm(`${judgeratioArr.join('')}的入库成本和库存平均成本相差超过50%`, {icon: 7, title:'提示'}, function(index){
                    // newreststockin(data);
                    updatestockin(data)
                    layer.close(index);
                }); 
            }else{
                // newreststockin(data);
                updatestockin(data);
            }
        }
    }
    //提交修改其它入库单
    function updatestockin(data) {
        loading.show();
        $.ajax({
            url: ctx + '/purOtherStorage/updateOnePurOtherStorage.html',
            dataType: 'json',
            type: 'POST',
            data: data,
            success: function(returnData) {
                loading.hide();
                if (returnData.code === "0000") {
                    layer.closeAll();
                    layer.msg(returnData.msg, { icon: 1 });
                    reststockin_table_render_fun();
                } else {
                    layer.msg(returnData.msg, { icon: 2 });
                }
            },
            error: function(returnData) {
                layer.msg(returnData.msg, { icon: 2 });
            }
        })
    };
    // 已审核订单转作废
    function transfertoabandon(otherStorageNumbers) {
        loading.show();
        $.ajax({
            url: ctx + '/purOtherStorage/cancelAuditPurOtherStorageByStorageNumber.html',
            dataType: 'json',
            data: { "otherStorageNumbers": JSON.stringify(otherStorageNumbers) },
            success: function(returnData) {
                loading.hide();
                if (returnData.code === "0000") {
                    layer.closeAll();
                    layer.msg(returnData.msg, { icon: 1 });
                    reststockin_table_render_fun();
                } else {
                    layer.msg(returnData.msg, { icon: 2 });
                }
            },
            error: function(returnData) {
                layer.msg(returnData.msg, { icon: 2 });
            }
        })
    };
    // 作废入库单
    function abondonrestinorder(otherStorageNumbers) {
        loading.show();
        $.ajax({
            url: ctx + '/purOtherStorage/deletePurOtherStorageByStorageNumber.html',
            type: 'POST',
            dataType: 'json',
            data: { "otherStorageNumbers": JSON.stringify(otherStorageNumbers) },
            success: function(returnData) {
                loading.hide();
                if (returnData.code === "0000") {
                    layer.closeAll();
                    layer.msg(returnData.msg, { icon: 1 });
                    reststockin_table_render_fun();
                } else {
                    layer.msg(returnData.msg, { icon: 2 });
                }
            },
            error: function(returnData) {
                layer.msg(returnData.msg, { icon: 2 });
            }
        })
    };
    //审核入库单
    function checkrestinkorder(otherStorageNumbers) {
        loading.show();
        $.ajax({
            url: ctx + '/purOtherStorage/auditPurOtherStorageByStorageNumber.html',
            type: 'POST',
            dataType: 'json',
            data: { "otherStorageNumbers": JSON.stringify(otherStorageNumbers) },
            success: function(returnData) {
                loading.hide();
                if (returnData.code === "0000") {
                    layer.msg(returnData.msg, { icon: 1 });
                    reststockin_table_render_fun();
                } else {
                    layer.msg(returnData.msg, { icon: 2 });
                }
            },
            error: function(returnData) {
                layer.msg(returnData.msg, { icon: 2 });
            }
        })
    };
    /***
     * 切换详情，日志选项卡
     */
    element.on('tab(reststockin_detail_tab_filter)', function(data) {
        var isLog = $(this).attr("isLog");
        if (isLog == 1) {
            table.render({
                elem: "#restockin_logTab",
                id: "restockin_logTab",
                method: 'post',
                url: ctx + "/purOtherStorage/selectPurOtherStorageLogByPId.html",
                where: { pId: currentPId },
                cols: [
                    [
                        { title: "时间", width: 150, templet: '<div>{{format(d.createTime, "yyyy-MM-dd hh:mm:ss")}}</div>' },
                        { field: "creator", title: "操作人", width: 100 },
                        { field: "operTypeStr", title: "操作类型", width: 150 },
                        { field: "operDesc", title: "操作详情" },
                    ]
                ],
                page: false
            });
        }
    });
    /**
     * 新增或则修改入库单的参数校验
     * @param formdata
     * @param itemdata
     * @returns {boolean}
     */
    function addOrUpdateValidateParam(formdata, itemdata) {
        if (formdata.storageType == null || formdata.storageType == '') {
            layer.msg("请选择入库类别", { icon: 0 });
            return false;
        }
        if (formdata.storeId == null || formdata.storeId == '') {
            layer.msg("请选择仓库", { icon: 0 });
            return false;
        }
        if (formdata.directorId == null || formdata.directorId == '') {
            layer.msg("请选择经办人", { icon: 0 });
            return false;
        }
        if (itemdata == null || itemdata.length < 1) {
            layer.msg("请添加入库商品", { icon: 0 });
            return false;
        }
        formdata.director = pagedata.directorList[getIndex('value', pagedata.directorList, formdata.directorId)].name;
        formdata.products = JSON.stringify(itemdata);
        return true;
    };
    // 导出其它入库单
    $("#reststockin_exportOtherStorageBtn").click(function() {
        var outerIndex = layer.open({
            title: '导出其它入库单',
            type: 1, //不加该属性,就会出现[object Object]
            area: ['1000px', '600px'],
            btn: ['确定', '关闭'],
            content: $('#reststockin_exportOtherStorageOrderPop').html(),
            success: function() {
                form.on('checkbox(reststockin_exportOtherStorageInfo_selectAll)', function(data) {
                    var checked = data.elem.checked
                    $('#reststockin_exportOtherStorageInfoForm input[type=checkbox]:enabled').prop('checked', checked)
                    form.render('checkbox')
                })
                form.render('checkbox')
            },
            yes: function() {
                var selectedData = table.checkStatus('reststockin_data_table').data;
                var idList = [];
                for (var i = 0; i < selectedData.length; ++i) {
                    idList.push(selectedData[i].id)
                }
                var exportFiled = [];
                $("#reststockin_exportOtherStorageInfoForm input[type=checkbox]:checked").each(function() {
                    exportFiled.push($(this).val());
                });
                var data = restgetSearchData();
                data.idList = idList.join(',')
                data.exportFiled = exportFiled.join(",");
                var confirmindex = layer.confirm('确认导出当前搜索条件下的其它入库单？', { btn: ['确认', '取消'] }, function() {
                    submitForm(data, ctx + '/purOtherStorage/exportOtherOrderStorageInfo.html', "_blank")
                    layer.close(outerIndex);
                    layer.close(confirmindex);
                }, function() {
                    layer.close(confirmindex);
                })
            }
        })
    });
    //页面下拉框枚举类型填充
    function fillSelect() {
        $.ajax({
            url: ctx + "/purOrderBase/getPurOtherStoragePageEnum.html",
            type: 'post',
            dataType: 'json',
            success: function(returnData) {
                if (returnData.code == "0000") {
                    for (var i in returnData.data) {
                        if (returnData.data[i].length > 0) {
                            if(i != 'storageTypeList'){
                              appendoption('restin', i, returnData.data[i]); //遍历数据生成option填到相应select
                            }
                        }
                    }
                    pagedata.storageTypeList = returnData.data.storageTypeList;
                    pagedata.warehouseList = returnData.data.warehouseList;
                    pagedata.directorList = returnData.data.directorList;
                    currentUserId = returnData.data.currentUserId; //当前登录用户id
                    commonRenderSelect('restinstorageTypeList', returnData.data.storageTypeList, { name: 'name', code: 'value' }).then(function () {
                      formSelects.render('restinstorageTypeList');
                    });
                    layui.form.render('select');
                    reststockin_table_render_fun();
                }
            }
        });
    };
    //绘制采购退回单单列表表格
    function reststockin_table_render_fun() {
        layui.table.render({
            elem: "#reststockin_data_table",
            method: "post",
            url: ctx + '/purOtherStorage/searchPurOtherStorageByDto.html',
            id: 'reststockin_data_table',
            where: restgetSearchData(),
            cols: [
                [
                    { type: "checkbox", width: 30, merge: 'otherStorageNumber', field: 'checkboxcol' },
                    { title: "入库类别", field: 'storageTypeName', width: '6%', },
                    { title: "入库单号", field: 'otherStorageNumber', templet: '#tpl_restinorderNo' },
                    { title: "SKU", field: 'otherStorageNumber', templet: '#tpl_reststockinSKU' },
                    { title: "商品名称", field: 'otherStorageNumber', templet: '<div><div style="text-align:left;">{{d.detailDtos[0].title}}</div></div>' },
                    { title: "图片", field: 'image',templet:'#reststockin_imageTpl' },
                    { title: `数量 <font color="red" id="inAllTotal_val">总数:0</font><i class="layui-icon layui-icon-about ml3" lay-tips="统计所有页"></i>`, field: 'totalStorageNum',  width: 170},
                    { title: `金额 <font color="red" id="inMoneyTotal_val">总金额(￥):0</font><i class="layui-icon layui-icon-about ml3" lay-tips="统计所有页"></i>`, field: 'totalStorageMoney', width:170 },
                    { title: "人员", field: 'creator', templet: '#restin_tpl_creator', width: '6%', },
                    { title: "时间", field: 'createTime', width: '10%', templet: '#restin_tpl_createTime' },
                    { title: "备注", field: 'problemRemark' },
                    { title: "操作", toolbar: '#restin_tpl_option', width: '4%', },
                ]
            ],
            page: true,
            limits: [100, 500, 1000],
            created: function(res) {
                if (res.code == "0000") {
                    //   res.data = disassembledata(res.data);
                }
            },
            done: function(res) { //包含表格单元格合并以及工具栏事件(审核，修改，作废);
                var msg = res.msg.split("&");
                $("#reststockin_data_count_span0").html(msg[0]); //未审核
                $("#reststockin_data_count_span1").html(msg[1]); //已审核
                $("#reststockin_data_count_span3").html(msg[2]); //已作废
                // 给1688单号上添加单击 跳转页面事件
                setEventByselector('#reststockin_data_table', '.clcikRoutTo', 'click', routerTo)
                    //懒加载
                imageLazyloadAll();
                inMoneyTotalHandle(res.extra);
                layui.tableMerge.render(this); //合并列单元格，根据merge：""相等进行分组合并
            },
            limit: 100,
        });
    };
    function inMoneyTotalHandle(data){
        if(data){
            $('#inMoneyTotal_val').text(`总金额(￥):${data.totalStorageMoney || 0}`); //总金额
            $('#inAllTotal_val').text(`总数:${data.totalStorageNum || 0}`); //总数
        }
    }
    //查询入库单列表表单参数构造
    function restgetSearchData() {
        var data = serializeObject($('#reststockin_search_form'));
        data.processStatus = reststockin_processStatus;
        var warehouseList = [];
        $("#restinwarehouseList").children().each(function() {
            var warehouseId = $(this).val();
            if (warehouseId != null && warehouseId != '') {
                warehouseList.push(warehouseId);
            }
        });
        data.warehouseList = warehouseList.join(","); //授权仓库集合
        if (data.timerange != "") {
            if (data.timeType == "0") {
                data.createTimeStart = data.timerange.split(' - ')[0] + ' 00:00:00';
                data.createTimeEnd = data.timerange.split(' - ')[1] + ' 23:59:59';
            } else {
                data.auditTimeStart = data.timerange.split(' - ')[0] + ' 00:00:00';
                data.auditTimeEnd = data.timerange.split(' - ')[1] + ' 23:59:59';
            }
        }
        return data;
    };

});
// 填充下拉框
function appendoption(pre, domName, obj) {
    var $li = '<option value="">请选择</option>';
    if (pre.indexOf("layer") != -1 && domName.indexOf("warehouseList") != -1) {
        $li = '';
    }
    for (var i in obj) {
        if (obj[i]) {
            $li += '<option value=' + obj[i].value + '>' + obj[i].name + '</option>';
        }
    }
    $("#" + pre + domName).append($li);
}
// 拆分多数据订单
function disassembledata(multidata) {
    var data = [];
    for (var i = 0; i < multidata.length; i++) {
        if (multidata[i].detailDtos.length > 0) {
            var itemarr = [];
            for (var a in multidata[i].detailDtos) {
                var item = {}
                for (var n in multidata[i].detailDtos[a]) {
                    item[n] = multidata[i].detailDtos[a][n];
                }
                itemarr.push(item);
            }
            for (var j = 0; j < multidata[i].detailDtos.length; j++) {
                var newItem = Object.assign(itemarr[j], multidata[i]);
                data.push(newItem);
            }
        } else {
            data.push(res.data[i]);
        }
    }
    return data;
}
//根据商品SKU查询商品渲染商品表格
function getItemlist(prodSSku , warehouseId) {
    itemtable = layui.table.render({
        elem: "#reststockin_additem_data_table",
        url: ctx + "/purOtherStorage/getOtherStorageProdSInfoBySku.html",
        where: { prodSSku: prodSSku ,warehouseId :warehouseId },
        method: "post",
        id: 'reststockin_additem_data_table',
        cols: [
            [
                { type: 'checkbox' },
                { title: "图片", field: 'image', templet: '#reststockin_sku_image_tpl' },
                { title: "商品SKU", field: 'prodSSku' },
                { title: "商品名称", field: 'title' },
                { title: "含税单价($)", field: 'buyerPrice' },
            ]
        ],
        done: function(res) {
            imageLazyload();
        }
    });
};

function routerTo() {
    var span = $(this)
    var id = span.find('a').text()
    if (!id) {
        return
    }
    span.attr('data-ifExcuteClick', 1)
        // 设定时器
    var index = window.setTimeout(function() {
        var ifExcuteClick = span.attr('data-ifExcuteClick')
        if (ifExcuteClick == '1') {
            var routerUrl = span.attr('data-routUrl')
            window.open(routerUrl.replace('{data}', id))
        }
        span.removeAttr('data-ifExcuteClick')
    }, 300)
}

// 数组去重
function unique(id, arr) {
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
}

//获取数组中键为id，值为value的对象位置下标
function getIndex(id, arr, value) {
    for (var i = 0; i < arr.length; i++) {
        if (value == arr[i][id]) {
            return i;
        }
    }
    return -1;
}

//下拉框赋值选中
function selected(pre, select, value) { //select的name值
    var $options = $('#' + pre + ' select[name="' + select + '"]').find('option');
    $options.each(function(index, item) {
        if ($(item).val() == value) {
            $(this).attr('selected', true);
        }
    });
    layui.form.render();
}

// 获取请求提交数据
function getrestinkData(itemdata, form) {
    var data = serializeObject($('#' + form));
    data.products = JSON.stringify(itemdata);
    data.director = pagedata.directorList[getIndex('value', pagedata.directorList, data.directorId)].name;
    return data;
};

//最近一个月时间
function getLatestMonth() {
    var data = {};
    data.createTimeEnd = Format(new Date(), 'yyyy-MM-dd');
    data.createTimeStart = Format((new Date()).setMonth(new Date().getMonth() - 1), 'yyyy-MM-dd');
    data.processStatus = "0";
    return data;
};