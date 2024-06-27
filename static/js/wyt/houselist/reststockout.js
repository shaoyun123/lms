var outpagedata = {};
layui.use(['admin', 'form', 'table', 'layer', 'laydate', 'tableMerge', 'formSelects', 'element', 'laytpl'], function () {
    var admin = layui.admin,
        form = layui.form,
        table = layui.table,
        layer = layui.layer,
        formSelects = layui.formSelects,
        element = layui.element,
        laytpl = layui.laytpl,
        laydate = layui.laydate;

    restStockOutTableRender_fun();
    $("#overseas_out_rest_stock_out_time_range_input").val(getLatestMonth().createTimeStart + ' - ' + getLatestMonth().createTimeEnd)
    //日期范围
    laydate.render({
        elem: '#overseas_out_rest_stock_out_time_range_input',
        range: true
    });

    var overseasRestStockOut = {
        initData: {
            overseasWarehouseList: null,
            overseasDirectorList: null,
            overseasOutTypeList: null,
            //TODO 此处这样写有bug；需要将此处的引用改为局部引用或者根据不同状态进行数据清除
            overseasOutMainId: null
        },
        //初始化操作
        init: function () {
            var _this = this;
            _this.tabSwitch();
            overseasWarehouseList();
            overseasDirectorList();
            overseasTypeList();
        },
        //页面页签切换函数处理
        tabSwitch: function () {
            element.on('tab(overseas_out_rest_stock_out_data_count_tab)', function (data) {
                var status = $(data.elem.context).attr("data-index");
                $('#overseas_out_rest_stock_out_search_form input[name="overseas_process_status"]').val(status);
                //触发查询按钮操作
                $('#overseas_out_rest_out_search').click();
            });
        }
    }

    overseasRestStockOut.init();

    /**
     * 初始化仓库列表
     */
    function overseasWarehouseList() {
        initAjax('/overseasPurOtherStorage/overseasWarehouseList.html', 'get', {}, function (returnData) {
            var data = returnData.data;
            overseasRestStockOut.initData.overseasWarehouseList = data;
            selectAppendDataThenRender("#overseas_out_rest_stock_out_search_form select[name='overseasStorageId']", data, 'overseasStorageId', 'overseasStorageName');
            form.render();
        })
    }

    /**
     * 初始化经办人
     */
    function overseasDirectorList() {
        initAjax('/overseasPurOtherStorage/creatorList.html', 'get', {}, function (returnData) {
            var data = returnData.data;
            overseasRestStockOut.initData.overseasDirectorList = data;
            selectAppendDataThenRender("#overseas_out_rest_stock_out_search_form select[name='directorId']", data, 'directorId', 'director');
            form.render();
        })
    }

    /**
     * 初始化出库类型列表
     */
    function overseasTypeList() {
        initAjax('/overseasPurOtherStorageOut/overseaOutTypeList.html', 'get', {}, function (returnData) {
            var data = returnData.data;
            overseasRestStockOut.initData.overseasOutTypeList = data;
            selectAppendDataThenRender("#overseas_out_rest_stock_out_search_form select[name='overseasOutType']", data, 'overseaStorageType', 'overseaStorageTypeName');
            form.render();
        })
    }


    //导入功能
    function restStockOutImport(aDom) {
        $('#overseas_out_rest_stock_out_add_item_import_input').on('change', function () {
            var wareHouseId = (aDom).find('select[name=overseasStorageId]').val();
            var files = $(this)[0].files
            if (files.length === 0) {
                return
            }
            // 校验文件类型
            var fileName = files[0].name
            var seat = fileName.lastIndexOf(".");
            var extension = fileName.substring(seat).toLowerCase();
            if (extension !== '.xlsx' && extension !== '.xls') {
                layer.msg('请传入后缀为.xlsx或者.xls 的Excel文件');
                $('#overseas_out_rest_stock_out_add_item_import_input').val('');
                return
            }
            var formData = new FormData();
            formData.append("file", files[0]);
            formData.append("overseasStorageId", wareHouseId);
            layer.confirm('确认导入这个出库单文件吗?', {
                btn: ['确认', '取消'],
                yes: function (index) {
                    $.ajax({
                        url: ctx + '/overseasPurOtherStorageOut/importOutRegisterSku.html',
                        type: 'post',
                        // async : false,
                        data: formData,
                        // 告诉jQuery不要去处理发送的数据
                        processData: false,
                        // 告诉jQuery不要去设置Content-Type请求头
                        contentType: false,
                        beforeSend: function () {
                            loading.show();
                        },
                        dataType: 'json',
                        success: function (res) {
                            loading.hide()
                            // 清空 excel
                            $('#overseas_out_rest_stock_out_add_item_import_input').val('');
                            if (res.code === '0000') {
                                layer.confirm(res.msg, function (index) {
                                    var formTemplate = overseas_out_rest_stock_out_products_detailTpl.innerHTML;
                                    var formDiv = document.getElementById('overseas_out_rest_stock_out_productsDetail');
                                    laytpl(formTemplate).render(res.data, function (html) {
                                        formDiv.innerHTML = html;
                                        imageLazyload();
                                        restStockOutInputChange(); //输入生成总价
                                        restStockOutCount();
                                        layer.close(index);
                                    });
                                });
                            } else {
                                layer.alert(res.msg, {icon: 7, time: 5000})
                            }
                        },
                        error: function () {
                            loading.hide()
                            $('#overseas_out_rest_stock_out_add_item_import_input').val('');
                        }
                    });
                },
                btn2: function (index) {
                    $('#overseas_out_rest_stock_out_add_item_import_input').val('');
                    layer.close(index);
                }
            });
        });
    }

    //添加商品功能
    function restStockOutAddProduct(overseasStorageId) {
        layer.open({
            type: 1,
            title: "添加商品",
            area: ["80%", '70%'],
            shadeClose: false,
            btn: ['保存', '关闭'],
            content: $("#overseas_out_layer_additem").html(),
            success: function (index, layero) {
                //搜索前非空判断
                $('#overseas_out_rest_stock_out_layer_search_item_btn').click(function () {
                    var registerSku = $('#overseas_out_layer_sku').val();
                    if (registerSku == null || $.trim(registerSku) === "") {
                        layer.msg('请输入商品sku再查询', {icon: 0});
                        return false;
                    }
                    getItemList(registerSku, overseasStorageId);
                    return false;
                });
                //回车搜索
                $('#overseas_out_layer_sku').on('keyup', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    if (e.keyCode === 13) {
                        $('#overseas_out_rest_stock_out_layer_search_item_btn').trigger('click');
                    }
                });
            },
            yes: function (index, layero) {
                $('#layer_overseasWarehouseList').attr('disabled', 'disabled');
                var checkStatus = table.checkStatus('overseas_out_layer_item_table');
                var checkdata = checkStatus.data;
                if (!checkdata.length) {
                    layer.msg('请勾选要添加的商品数据');
                    return false;
                }
                var formTemplate = overseas_out_rest_stock_out_products_detailTpl.innerHTML;
                var formDiv = $('#overseas_out_rest_stock_out_productsDetail');
                var existProd = [];
                for (var item of checkdata) {
                    if (formDiv.find('tr[data-index="' + item.registerId + '"]').length === 0) {
                        //如果不存在，加一行
                        laytpl(formTemplate).render([item], function (html) {
                            formDiv.append(html);
                            restStockOutInputChange();
                            restStockOutCount();
                            imageLazyload();
                        });
                    } else {
                        existProd.push(item.registerSku)
                    }
                }
                if (existProd.length > 0) {
                    layer.msg(`商品${existProd.join(',')}已存在`, {icon: 2})
                }
                layer.close(index);
            }
        });
    }

    //监听input输入
    function restStockOutInputChange() {
        $('#overseas_out_rest_stock_out_productsDetail').on('input', '[name=outNum]', function () {
            var $thisTr = $(this).parents('tr');
            var $thisPrice = Number($thisTr.find('td[data-field="buyerPrice"]').text());
            var $thisNumber = Number($(this).val());
            var $thisTotal = $thisTr.find('td[data-field="storageOutMoney"]');
            $thisTotal.text(($thisPrice * $thisNumber).toFixed(4));
        });
    }

    //计数功能
    function restStockOutCount() {
        //总计数
        $('#overseas_out_reststockout_allCount').on('click', function () {
            var $tbody = $('#overseas_out_rest_stock_out_productsDetail');
            var $trs = $tbody.find('tr');
            $('#prodSku_btn').text(`数量:${$trs.length}`);//商品sku数量
            var outCount = 0; //出库数量
            var moneyCount = 0; //出库金额
            for (var i = 0; i < $trs.length; i++) {
                var item = $trs[i];
                var $numVal = $(item).find('td[data-field="outNum"] input').val();//input的值
                var $moneyVal = $(item).find('td[data-field=storageOutMoney]').text();//金额的值
                outCount += Number($numVal);
                moneyCount += Number($moneyVal);
            }
            $('#outNumber_btn').text(`总计:${outCount}`);//出库数量
            $('#outMoney_btn').text(`总额:${moneyCount}`);//出库金额
        })
    }

    //表格出库总金额统计
    function outMoneyTotalHandle(data) {
        if (data) {
            $('#outMoneyTotal_val').text(`总额:${data.totalAmountNumber}`); //总金额
            $('#outAllTotal_val').text(`总数:${data.totalOutNumber}`); //出库总数量
            $('#outSkuTotal_val').text(`SKU数:${data.totalSkuNumber}`); //出库SKU个数
        }
    }


    // 新增其他出库单
    $('#overseas_out_rest_stock_out_other_add').click(function () {
        var itemdata = [];
        var index = layer.open({
            type: 1,
            title: '新建其它出库单',
            btn: ['提交', '关闭'],
            area: ['80%', '70%'],
            content: $('#overseas_out_other_list_add_or_edit').html(),
            success: function (layero, index) {
                form.render();
                //查询当前登录人
                $.ajax({
                    type: 'GET',
                    url: ctx + '/overseasPurOtherStorage/getCurrentUser.html',
                    success: function (rsp) {
                        var $rsp = JSON.parse(rsp);
                        if($rsp.code == '0000'){
                            var currentUserId = $rsp.data.id;
                            selected('overseas_out_new_rest_outForm', 'directorId', currentUserId);
                            form.render('select');
                        } else {
                            layer.msg("获取当前登录人失败;" + $rsp.msg)
                        }
                    },
                    error: function (rsp) {
                        var $rsp = JSON.parse(rsp);
                        layer.msg("获取当前登录人失败;" + $rsp.msg)
                    }
                });
                //添加商品
                $('#overseas_out_rest_stock_out_add_item_btn').click(function () {
                    var overseasStorageId = $('#layer_overseasWarehouseList').val();
                    if (overseasStorageId == null || overseasStorageId === "") {
                        layer.msg('请先选择仓库', {icon: 0})
                        return false;
                    }
                    restStockOutAddProduct(overseasStorageId);
                });
                // 填充表单下拉框
                fillSelect()
                form.render();
                //导入商品
                restStockOutImport(layero);
                $('#overseas_out_rest_stock_out_add_item_import').on('click', function () {
                    var warehouseId = $('#layer_overseasWarehouseList').val();
                    if (!warehouseId) {
                        return layer.msg('请先选择仓库', {icon: 7});
                    }
                    $('#overseas_out_rest_stock_out_add_item_import_input').click();
                });
            },
            yes: function (index) {
                itemdata = [];
                var $tbody = $('#overseas_out_rest_stock_out_productsDetail');
                var $trs = $tbody.find('tr');
                for (var i = 0; i < $trs.length; i++) {
                    var obj = {};
                    var item = $trs[i];
                    // obj.prodSId = $.trim($(item).data('index')) || ''; //商品子sku
                    // obj.prodSSku = $.trim($(item).find('td[data-field="prodSSku"]').text()) || '';
                    // obj.prodPId = $.trim($(item).find('td[data-field="image"] input').val()) || '';
                    obj.registerSku = $.trim($(item).find('td[data-field="registerSku"]').text()) || '';
                    obj.buyerPrice = $.trim($(item).find('td[data-field="buyerPrice"]').text()) || '';
                    obj.title = $.trim($(item).find('td[data-field="title"]').text()) || '';
                    obj.image = $.trim($(item).find('td[data-field="image"]').attr('data-image')) || '';
                    obj.availableStock = $.trim($(item).find('td[data-field="availableStock"]').text()) || 0;
                    obj.outNum = $.trim($(item).find('td[data-field="outNum"] input').val()) || 0; //出库数量
                    obj.totalmoney = $.trim($(item).find('td[data-field="storageOutMoney"]').text()) || '';
                    itemdata.push(obj);
                }
                var formdata = serializeObject($('#overseas_out_new_rest_outForm'));
                if (addOrUpdateParam(formdata, itemdata, 0)) { //参数校验
                    restStockOut_addFunc(formdata);
                } else {
                    return false;
                }
            }
        })
    });

    /**
     * 从已查询出来的数据中填充到新开的下拉列表中
     */
    function fillSelect() {
        var data = overseasRestStockOut.initData;
        if (data) {
            for (var i in data) {
                appendOptionForStockOut('layer_', i, data[i]);
            }
        }
    }

    /**
     * 填充下拉框
     * @param pre dom前缀
     * @param domName don后缀
     * @param obj 填充对象
     */
    function appendOptionForStockOut(pre, domName, obj) {
        var $li = '<option value="">请选择</option>';
        if (pre.indexOf("layer") !== -1 && domName.indexOf("warehouseList") !== -1) {
            $li = '';
        }
        for (var i in obj) {
            if (obj[i]) {
                $li += '<option value=' + obj[i].code + '>' + obj[i].label + '</option>';
            }
        }
        $("#" + pre + domName).append($li);
    }

    /**批量审核**/
    $('#overseas_out_rest_stock_out_batch_check_rest_out_order').click(function () {
        var checkStatus = table.checkStatus('overseas_out_rest_stock_out_dataTable');
        console.log("data", checkStatus);
        var otherStorageOutNumbers = [];
        if (checkStatus.data.length > 0) {
            layer.confirm('确定开始批量审核这' + checkStatus.data.length + '条其他出库单?', function (index) {
                for (var i = 0; i < checkStatus.data.length; i++) {
                    otherStorageOutNumbers.push(checkStatus.data[i].overseasStockOutNumber);
                }
                checkRestOutOrder(otherStorageOutNumbers.join());
                layer.close(index);
            });
        } else {
            layer.msg('请勾选要审核的出库单', {icon: 0});
        }
    });

    /**
     * 操作按钮事件
     */
    table.on('tool(overseas_out_rest_stock_out_dataTable)', function (obj) {
        var data = obj.data;
        var layEvent = obj.event;
        var otherStorageOutNumbers = []
        overseasRestStockOut.initData.overseasOutMainId = data.overseasOutMainId;
        var overseasStockOutNumber = data.overseasStockOutNumber;
        if (layEvent === 'check') { //审核
            layer.confirm('确定开始审核这条出库单?', function (index) {
                otherStorageOutNumbers.push(overseasStockOutNumber);
                checkRestOutOrder(otherStorageOutNumbers.join());
                layer.close(index);
            });
        } else if (layEvent === 'edit') { //编辑
            var currentProcess = data.processStatus;
            var itemdata = []; //商品信息表格数据
            var index = layer.open({
                type: 1,
                title: "修改其他出库单",
                area: ["80%", '70%'],
                shadeClose: false,
                btn: ['审核', '保存', '关闭'],
                content: $("#overseas_out_other_list_add_or_edit").html(),
                success: function (layero, index) {
                    if ($("#overseas_out_rest_stock_out_batch_check_rest_out_order").length == 1) {
                        layero.find(".layui-layer-btn0").css({'float': 'left'});
                    } else {
                        layero.find(".layui-layer-btn0").css({'display': 'none'});
                    }
                    if (currentProcess !== 0) {
                        layero.find(".layui-layer-btn0").css({'display': 'none'});
                    }
                    layero.find(".layui-row").css({ 'padding': '0' });
                    layero.find(".layui-layer-btn1").css({'background-color': '#1E9FFF','color':'#fff','border-color':'#1E9FFF'});
                    $('#overseas_out_rest_stock_out_add_item_btn').click(function () {
                        var overseasStorageId = $('#layer_overseasWarehouseList').val();
                        if (overseasStorageId == null || overseasStorageId === "") {
                            layer.msg('请先选择仓库', {icon: 0})
                            return false;
                        }
                        restStockOutAddProduct(overseasStorageId);
                    });
                    form.render('select');
                    //导入商品
                    restStockOutImport(layero);
                    $('#overseas_out_rest_stock_out_add_item_import').on('click', function () {
                        var warehouseId = $('#layer_overseasWarehouseList').val();
                        if (!warehouseId) {
                            return layer.msg('请先选择仓库', {icon: 7});
                        }
                        $('#overseas_out_rest_stock_out_add_item_import_input').click();
                    });
                    var itemtableIns = {};
                    var overseasStorageId = '';
                    for (var i in overseasRestStockOut.initData) {
                        appendOptionForStockOut('layer_', i, overseasRestStockOut.initData[i]);
                    }
                    form.render();
                    formSelects.render();
                    $.ajax({
                        url: ctx + '/overseasPurOtherStorageOut/getOverseasPurOtherOutInfoByOutNumber.html',
                        dataType: 'json',
                        data: {overseasStockOutNumber: overseasStockOutNumber},
                        type: 'post',
                        success: function (returnData) {
                            if (returnData.code === "0000") {
                                var tempData = returnData.data;
                                for (var i in tempData) {
                                    $('#overseas_out_new_rest_outForm input[name="' + i + '"]').val(tempData[i]);
                                    if (i === 'createTime') {
                                        $('#new_rebackorder input[name="' + i + '"]').val(Format(tempData[i], 'yyyy-MM-dd hh:mm:ss'));
                                    } else if (i === 'problemRemark') {
                                        $('#overseas_out_rest_stock_out_problemRemark').val(tempData[i]);
                                    }
                                }
                                itemdata = tempData.productList;
                                // 构造商品信息表格渲染数据
                                for (var i in tempData.productList) {
                                    itemdata[i].totalmoney = tempData.productList[i].storageOutMoney;
                                    itemdata[i].overseasStockOutNumber = overseasStockOutNumber; //其它入库单号
                                }
                                $('#layer_overseasWarehouseList').attr('disabled', 'disabled');
                                form.render('select');
                                // 内部标签设置
                                overseasStorageId = tempData.overseasStorageId;
                                selected('overseas_out_new_rest_outForm', 'overseasOutType', tempData.overseasOutType);
                                selected('overseas_out_new_rest_outForm', 'overseasStorageId', tempData.overseasStorageId);
                                selected('overseas_out_new_rest_outForm', 'directorId', tempData.directorId);
                                // 渲染出库商品信息表格
                                var formTemplate = overseas_out_rest_stock_out_products_detailTpl.innerHTML;
                                var formDiv = document.getElementById('overseas_out_rest_stock_out_productsDetail');
                                laytpl(formTemplate).render(itemdata, function (html) {
                                    formDiv.innerHTML = html;
                                    imageLazyload();
                                    restStockOutInputChange(); //输入生成总价
                                    restStockOutCount();
                                    var $tbody = $('#overseas_out_rest_stock_out_productsDetail');
                                    var $trs = $tbody.find('tr');
                                    for (var i = 0; i < $trs.length; i++) {
                                        var item = $trs[i];
                                        // $(item).find('td[data-field="delete"] span').hide();//隐藏删除按钮
                                    }
                                });
                            } else {
                                layer.msg(returnData.msg, {icon: 2});
                            }
                        },
                        error: function (returnData) {
                            layer.msg(returnData.msg, {icon: 2});
                        }
                    });
                },
                yes: function (index, layero) { //审核
                    if (currentProcess !== 0) {//如果不是未审核状态的不予编辑
                        layer.close(index);
                        return false;
                    }
                    var otherStorageOutNumbers = [];//多个其它出库单号
                    otherStorageOutNumbers.push(overseasStockOutNumber);
                    checkRestOutOrder(otherStorageOutNumbers.join());//审核
                },
                btn2: function (index) { //保存
                    if (currentProcess !== 0) {
                        layer.close(index);
                        return false;
                    }
                    var $tbody = $('#overseas_out_rest_stock_out_productsDetail');
                    var $trs = $tbody.find('tr');
                    var updateItemData = [];
                    for (var i = 0; i < $trs.length; i++) {
                        var item = $trs[i];
                        var updateTemp = {};
                        updateTemp.outNum = $.trim($(item).find('td[data-field="outNum"] input').val());
                        updateTemp.registerSku = $.trim($(item).find('td[data-field="registerSku"]').text());
                        updateTemp.buyerPrice = $.trim($(item).find('td[data-field="buyerPrice"]').text());
                        updateTemp.avaiableStock = $.trim($(item).find('td[data-field="availableStock"]').text());
                        updateItemData.push(updateTemp);
                        // itemdata[i].outNum = $.trim($(item).find('td[data-field="outNum"] input').val()); //出库数量
                        // itemdata[i].totalmoney = $.trim($(item).find('td[data-field="storageOutMoney"]').text()) || '';
                    }
                    var data = serializeObject($('#overseas_out_new_rest_outForm'));
                    if (addOrUpdateParam(data, updateItemData, 1)) {
                        console.log("updateStockOut  data ", data);
                        updateStockOut(data);
                    } else {
                        return false;
                    }
                },
                btn3: function () { //关闭
                    restStockOutTableRender_fun();//重新搜索
                }
            });
        } else if (layEvent === 'abodon') { //作废
            layer.confirm('确定作废这条其它出库单?', function (index) {
                otherStorageOutNumbers.push(overseasStockOutNumber);
                restStockOutInvalid_fun(otherStorageOutNumbers.join());
            });
        } else {
            layer.confirm('确定将这条已审核出库单取消审核?', function (index) {
                otherStorageOutNumbers.push(overseasStockOutNumber);
                reststockout_transfertoabandon_fun(otherStorageOutNumbers);
            });
        }
    });

    /**参数校验 type :0 -->add ; 1-->update **/
    function addOrUpdateParam(formdata, itemdata, type) {
        if (formdata.overseasOutType == null || formdata.overseasOutType == "") {
            layer.msg("请选择出库类型", {icon: 0});
            return false;
        }
        formdata.overseasStorageId = $('#layer_overseasWarehouseList').val();
        if (formdata.overseasStorageId == null || formdata.overseasStorageId == "") {
            layer.msg("请选择仓库", {icon: 0});
            return false;
        }
        if (formdata.directorId == null || formdata.directorId == "") {
            layer.msg("请选择经办人", {icon: 0});
            return false;
        }
        if (itemdata == null || itemdata.length < 1) {
            layer.msg("请添加出库商品", {icon: 0});
            return false;
        }
        for (var i = 0; i < itemdata.length; i++) {
            //add
            if (type === 0) {
                if (itemdata[i].outNum == null || itemdata[i].outNum < 1) {
                    layer.msg(itemdata[i].registerSku + "出库数量不能小于等于0", {icon: 0});
                    return false;
                }
            }
            //update
            if (type === 1) {
                if (itemdata[i].outNum == null || itemdata[i].outNum < 0) {
                    layer.msg(itemdata[i].registerSku + "出库数量不能小于0", {icon: 0});
                    return false;
                }
            }
            if (Number(itemdata[i].outNum) > Number(itemdata[i].avaiableStock)) {
                layer.msg(itemdata[i].registerSku + "出库数量" + Number(itemdata[i].outNum) + "不能大于可用库存" + Number(itemdata[i].avaiableStock), {icon: 0});
                return false;
            }
        }
        formdata.director = overseasRestStockOut.initData.overseasDirectorList[getIndex('code', overseasRestStockOut.initData.overseasDirectorList, formdata.directorId)].label;
        formdata.products = JSON.stringify(itemdata);
        return true;
    };
    //表单查询
    $('#overseas_out_rest_out_search').click(function () {
        restStockOutTableRender_fun();
    });

    //提交新建出库单
    function restStockOut_addFunc(data) {
        loading.show();
        $.ajax({
            url: ctx + "/overseasPurOtherStorageOut/createOverseasPurOtherStorageOut.html",
            type: 'POST',
            dataType: 'json',
            data: data,
            success: function (returnData) {
                loading.hide();
                if (returnData.code === "0000") {
                    layer.closeAll();
                    layer.confirm(returnData.msg, {icon: 1, title: '结果信息'}, function (index) {
                        layer.close(index);
                        restStockOutTableRender_fun();
                    });
                } else {
                    layer.confirm(returnData.msg, {icon: 2, title: '结果信息'}, function (index) {
                        layer.close(index);
                    });
                }
            },
            complete: function (XMLHttpRequest, textStatus) {
                loading.hide();
            },
        });
    };

    //提交修改出库单
    function updateStockOut(data) {
        $.ajax({
            url: ctx + '/overseasPurOtherStorageOut/updateOverseasPurOtherOutDetail.html',
            dataType: 'json',
            type: 'POST',
            data: data,
            beforeSend: function () {
                loading.show();
            },
            success: function (returnData) {
                loading.hide();
                if (returnData.code === "0000") {
                    layer.closeAll();
                    layer.confirm(returnData.msg, {icon: 1, title: '结果信息'}, function (index) {
                        layer.close(index);
                        restStockOutTableRender_fun();
                    });
                } else {
                    layer.confirm(returnData.msg, {icon: 2, title: '结果信息'}, function (index) {
                        layer.close(index);
                    });
                }
            },
            error: function (returnData) {
                loading.hide();
                layer.msg(returnData.msg, {icon: 2});
            }
        })
    };

    //绘制其他出库单列表表格
    function restStockOutTableRender_fun() {
        layui.table.render({
            elem: "#overseas_out_rest_stock_out_dataTable",
            method: "post",
            url: ctx + '/overseasPurOtherStorageOut/searchOutPage.html',
            id: 'overseas_out_rest_stock_out_dataTable',
            where: restGetSearchData(),
            cols: [
                [
                    {type: "checkbox", width: 30, field: 'checkboxcol'},
                    {title: "出库类别", field: 'storageTypeName', width: '6%',},
                    {
                        title: "出库单号",
                        field: 'overseasStockOutNumber',
                        templet: '#overseas_out_tpl_rest_out_order_number'
                    },
                    {title: "仓库", field: 'warehouseName', width: '4%',},
                    {title: "人员", field: 'creator', templet: '#overseas_out_rest_out_tpl_creator', width: '6%',},
                    {
                        title: `出库总数量<font color="red" id="outAllTotal_val">总数:0</font>`,
                        field: 'totalOutNum',
                        width: 170
                    },
                    {
                        title: `出库SKU个数<font color="red" id="outSkuTotal_val">SKU数:0</font>`,
                        field: 'totalOutSkuNum',
                        width: 170
                    },
                    {
                        title: `出库总金额<font color="red" id="outMoneyTotal_val">总额:0</font>`,
                        field: 'totalOutMoney',
                        width: 170
                    },
                    {title: "时间", field: 'createTime', width: '10%', templet: '#overseas_out_rest_out_tpl_createTime'},
                    {title: "备注", field: 'problemRemark'},
                    {title: "操作", toolbar: '#overseas_out_rest_stock_out_tpl_option', width: '4%',},
                ]
            ],
            page: true,
            limits: [100, 500, 1000],
            created: function (res) {
                if (res.code === "0000") {
                }
            },
            done: function (res) { //包含表格单元格合并以及工具栏事件(审核，修改，作废);
                outMoneyTotalHandle(res.extra);
                var msg = res.msg.split("&");
                $("#overseas_out_rest_stock_out_data_count_span0").html(msg[0]);//未审核
                $("#overseas_out_rest_stock_out_data_count_span1").html(msg[1]);//已审核
                $("#overseas_out_rest_stock_out_data_count_span2").html(msg[2]);//已作废
                imageLazyloadAll(); //懒加载
                layui.tableMerge.render(this); //合并列单元格，根据merge：""相等进行分组合并
            },
            limit: 100,
        });
    };

    // 已审核订单转作废 TODO:暂时没用
    function reststockout_transfertoabandon_fun(otherStorageoutNumbers) {
        loading.show();
        $.ajax({
            url: ctx + '/purOtherStorageOut/cancelAuditPurOtherStorageOutByStorageNumber.html',
            type: "post",
            dataType: 'json',
            data: {"otherStorageOutNumbers": otherStorageoutNumbers},
            success: function (returnData) {
                loading.hide();
                if (returnData.code === "0000") {
                    layer.msg(returnData.msg, {icon: 1});
                    restStockOutTableRender_fun();
                } else {
                    layer.msg(returnData.msg, {icon: 2});
                }
            },
            error: function (returnData) {
                loading.hide();
                layer.msg(returnData.msg, {icon: 2});
            }
        });
    };

    /**
     * 作废给出库单；多个使用逗号分隔
     * @param overseasStockOutNumbers 出库单号
     */
    function restStockOutInvalid_fun(overseasStockOutNumbers) {
        $.ajax({
            url: ctx + '/overseasPurOtherStorageOut/batchInvalidateOverseasPurOtherOut.html',
            dataType: 'json',
            type: "post",
            data: {overseasStockOutNumbers: overseasStockOutNumbers},
            success: function (returnData) {
                if (returnData.code === "0000") {
                    layer.confirm(returnData.msg, {icon: 1, title: '结果信息'}, function (index) {
                        layer.close(index);
                        restStockOutTableRender_fun();
                    });
                } else {
                    layer.confirm(returnData.msg, {icon: 2, title: '结果信息'}, function (index) {
                        layer.close(index);
                    });
                }
            },
            error: function (returnData) {
                layer.msg(returnData.msg, {icon: 2});
            }
        })
    };

    /**
     * 审核出库单；多个使用逗号分隔
     * @param otherStorageOutNumbers 出库单号
     */
    function checkRestOutOrder(otherStorageOutNumbers) {
        loading.show();
        $.ajax({
            url: ctx + '/overseasPurOtherStorageOut/batchAuditOverseasPurOtherOut.html',
            dataType: 'json',
            data: {overseasStockOutNumbers: otherStorageOutNumbers},
            success: function (returnData) {
                loading.hide();
                if (returnData.code === "0000") {
                    layer.closeAll();
                    layer.confirm(returnData.msg, {icon: 1, title: '结果信息'}, function (index) {
                        layer.close(index);
                        restStockOutTableRender_fun();
                    });
                } else {
                    layer.confirm(returnData.msg, {icon: 2, title: '结果信息'}, function (index) {
                        layer.close(index);
                    });
                }
            },
            error: function (retuenData) {
                layer.msg(returnData.msg, {icon: 2});
            }
        })
    };
    /***
     * 切换详情，日志选项卡
     */
    element.on('tab(overseas_out_rest_stock_out_detail_tab_filter)', function (data) {
        var isLog = $(this).attr("isLog");
        if (isLog === "1") {
            table.render({
                elem: "#overseas_out_rest_stock_out_logTab",
                id: "overseas_out_rest_stock_out_logTab",
                method: 'post',
                url: ctx + "/overseasPurOtherStorageOut/searchOverseasOutLogByPId.html",
                where: {pId: overseasRestStockOut.initData.overseasOutMainId},
                cols: [
                    [
                        {
                            title: "时间",
                            width: 150,
                            templet: '<div>{{format(d.createTime, "yyyy-MM-dd hh:mm:ss")}}</div>'
                        },
                        {field: "creator", title: "操作人", width: 100},
                        {field: "operTypeStr", title: "操作类型", width: 150},
                        {field: "operDesc", title: "操作详情"},
                    ]
                ],
                page: false
            });
        }
    });
    // 导出其它出库单 TODO：暂时没用
    // $("#overseas_out_reststockout_exportOtherStorageOutBtn").click(function () {
    //     var outerIndex = layer.open({
    //         title: '导出其它出库单',
    //         type: 1, //不加该属性,就会出现[object Object]
    //         area: ['1000px', '600px'],
    //         btn: ['确定', '关闭'],
    //         content: $('#overseas_out_reststockout_exportOtherStorageOutPop').html(),
    //         success: function () {
    //             form.on('checkbox(overseas_out_reststockout_exportOtherStorageOutInfo_selectAll)', function (data) {
    //                 var checked = data.elem.checked
    //                 $('#overseas_out_reststockout_exportOtherStorageOutInfoForm input[type=checkbox]:enabled').prop('checked', checked)
    //                 form.render('checkbox')
    //             })
    //             form.render('checkbox')
    //         },
    //         yes: function () {
    //             var selectedData = table.checkStatus('overseas_out_rest_stock_out_dataTable').data;
    //             var idList = [];
    //             for (var i = 0; i < selectedData.length; i++) {
    //                 idList.push(selectedData[i].id)
    //             }
    //             var exportFiled = [];
    //             $("#overseas_out_reststockout_exportOtherStorageOutInfoForm input[type=checkbox]:checked").each(function () {
    //                 exportFiled.push($(this).val());
    //             });
    //             var processStatus = $('#restoutTab ul .layui-this').attr('data-index');
    //             var data = restGetSearchData(processStatus);
    //             data.idList = idList.join(',')
    //             data.exportFiled = exportFiled.join(",");
    //             var confirmindex = layer.confirm('确认导出当前搜索条件下的其它出库单？', {btn: ['确认', '取消']}, function () {
    //                 submitForm(data, ctx + '/purOtherStorageOut/exportOtherOrderStorageOutInfo.html', "_blank")
    //                 layer.close(outerIndex);
    //                 layer.close(confirmindex);
    //             }, function () {
    //                 layer.close(confirmindex);
    //             })
    //         }
    //     })
    // });

    //查询出库单列表表单参数构造
    function restGetSearchData() {
        var data = serializeObject($('#overseas_out_rest_stock_out_search_form'));
        data.processStatus = data.overseas_process_status;
        var timeRange = data.overseas_out_rest_stock_out_time_range_input;

        if (timeRange != null && timeRange !== '') {
            data.timeStart = timeRange.split(' - ')[0] + ' 00:00:00';
            data.timeEnd = timeRange.split(' - ')[1] + ' 23:59:59';
        }
        return data;
    };

    //根据商品SKU查询商品渲染商品表格
    function getItemList(registerSku, overseasStorageId) {
        table.render({
            elem: "#overseas_out_layer_item_table",
            method: "post",
            url: ctx + "/overseasPurOtherStorageOut/searchOutRegisterSkuInfo.html",
            where: {registerSku: registerSku, overseasStorageId: overseasStorageId},
            id: 'overseas_out_layer_item_table',
            cols: [
                [
                    {type: 'checkbox'},
                    {title: "图片", field: 'image', templet: '#overseas_out_rebackorder_imageTpl'},
                    {title: "商品注册SKU", field: 'registerSku'},
                    {title: "商品名称", field: 'title'},
                    {title: "可用库存", field: 'availableStock'},
                    {title: "含税单价(￥)", field: 'buyerPrice'},
                ]
            ],
            done: function (res) {
                imageLazyload();
            }
        });
    };

    //获取数组中键为id，值为value的对象位置下标
    function getIndex(id, arr, value) {
        for (var i = 0; i < arr.length; i++) {
            if (value == arr[i][id]) {
                return i;
            }
        }
        return -1;
    };

    //下拉框赋值选中
    function selected(pre, select, value) { //select的name值
        var $options = $('#' + pre + ' select[name="' + select + '"]').find('option');
        $options.each(function (index, item) {
            if ($(item).val() == value) {
                $(this).attr('selected', true);
            }
        });
        layui.form.render();
    };

    /**获取最近一月时间区间**/
    function getLatestMonth() {
        var data = {};
        data.createTimeEnd = Format(new Date(), 'yyyy-MM-dd');
        data.createTimeStart = Format((new Date()).setMonth(new Date().getMonth() - 1), 'yyyy-MM-dd');
        data.processStatus = "0";
        return data;
    };

    /**
     * 初始化ajax发送请求
     * @param url 请求地址
     * @param method 请求方法
     * @param data 请求参数
     * @param func  成功处理结果的函数方法
     * @param contentType 请求文件类型；默认为json
     * @param isLoad
     * @param func2 发送请求之前处理的函数
     * @param func3 请求之后进行的处理函数
     */
    function initAjax(url, method, data, func, contentType, isLoad, func2, func3) { //初始化ajax请求
        if (!isLoad) {
            loading.show()
        }
        $.ajax({
            type: method,
            url: ctx + url,
            dataType: 'json',
            async: true,
            data: data,
            contentType: contentType || 'application/json',
            beforeSend: function (returnData) {
                if (func2) {
                    func2(returnData)
                }
            },
            success: function (returnData) {
                loading.hide()
                if (returnData.code === "0000") {
                    func(returnData)
                } else {
                    layer.msg(returnData.msg, {icon: 2});
                }
            },
            error: function (returnData) {
                layui.admin.load.hide();
                if (XMLHttpRequest.status === 200) {
                    layer.msg("请重新登录", {icon: 7});
                } else {
                    layer.msg("服务器错误");
                }
            },
            complete: function (returnData) {
                loading.hide()
                if (func3) {
                    func3(returnData)
                }
            }
        })
    }


});