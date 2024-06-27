
layui.use(["admin", "form", "table", "layer", "laytpl", "laydate", "element", 'formSelects', 'tableMerge'], function() {
    var admin = layui.admin,
        form = layui.form,
        table = layui.table,
        layer = layui.layer,
        laydate = layui.laydate,
        element = layui.element,
        formSelects = layui.formSelects,
        tableMerge = layui.tableMerge,
        $ = layui.$;
    form.render('select');
    form.render('radio');
    form.render('checkbox');
    var currentPId;//当前编辑行id
    var rebackorder_processStatus=0;//当前流程状态
    var lastMonth=getLatestMonth();/**默认查询最近一个月数据**/
    $('input[name="timerange"]').val(lastMonth.createTimeStart + ' - ' + lastMonth.createTimeEnd);
    //供应商远程搜索功能
    var dim = new DimSearch('#reback_searchSupplier_input', 'reback_supplierId_input');
    dim.init();
    laydate.render({elem: '#rebackorder_timerange_input', range: true});
    rebackorder_fillSelectAddAndUpdate_fun();//渲染下拉框
    rebackorder_tablerender_fun();//初始化查询
    // 审核状态tab切换
    element.on('tab(rebackorder_data_count_tab)', function (data) {
        rebackorder_processStatus=$(this).attr("data-index");
        rebackorder_tablerender_fun();
    });
    //表单查询
    $("#rebackorder_search_btn").click(function(){
        rebackorder_tablerender_fun();
    });
    //绘制采购退回单单列表表格
    function rebackorder_tablerender_fun() {
        table.render({
            elem: "#rebackorder_dataTable",
            method: "post",
            url: ctx + '/purOrderStorageBack/searchPurOrderStorageBackByDto.html',
            id: 'rebackorder_dataTable',
            where: getSearchData(),
            cols: [
                [
                    { type: "checkbox", width: 30, merge: 'backNumber', field: 'checkboxcol' },
                    { title: "供应商", field: 'supplierName', merge: 'backNumber', width: '8%' },
                    { title: "单号", field: 'backNumber', width: '13%', templet: '#rebackorder_rebackorderNo_tpl', merge: 'backNumber' },
                    { title: "SKU", field: 'prodSSku' },
                    { title: "商品名称", field: 'title' },
                    { title: "库位", field: 'stockLocation', width: '6%', templet: '#rebackorder_stockinlocation_tpl' },
                    { title: "含税单价(￥)", field: 'buyerPrice', width: '4%' },
                    { title: "退回单价(￥)", field: 'backPrice', width: '4%' },
                    { title: "入库数量", field: 'storageNum', width: '4%' },
                    { title: "退回数量", field: 'backNum', width: '4%' },
                    { title: "退回金额(￥)", field: 'backMoney',templet: '#rebackorder_backMoney_tpl', width: '6%', merge: 'backNumber' },
                    { title: "退回总数量", field: 'totalBackNum', width: '4%', merge: 'backNumber' },
                    { title: "快递信息", field: 'deliveryNumber', width: '6%', templet: '#rebackorder_deliveryNumber_tpl', merge: 'backNumber' },
                    { title: "人员", field: 'creator', merge: 'backNumber', width: '5%', templet: '#rebackorder_tpl_creator' },
                    { title: "时间", field: 'createTime', merge: 'backNumber', width: '8%', templet: '#purBackOrder_createTime' },
                    { title: "备注", field: 'remark', merge: 'backNumber', width: '6%' },
                    { title: "操作", toolbar: '#stockin_tpl_option', width: '4%', merge: 'backNumber', field: 'toolbarcol' },
                ]
            ],
            page: true,
            limits: [100, 500, 1000],
            created: function(res) {
                if (res.code == "0000") {
                    var data = [];
                    for (var i = 0; i < res.data.length; i++) {
                        if (res.data[i].backDetailDtoList.length > 0) {
                            var itemarr = [];
                            for (var a in res.data[i].backDetailDtoList) {
                                var item = {}
                                for (var n in res.data[i].backDetailDtoList[a]) {
                                    item[n] = res.data[i].backDetailDtoList[a][n];
                                }
                                itemarr.push(item);
                            }
                            for (var j = 0; j < res.data[i].backDetailDtoList.length; j++) {
                                var newItem = Object.assign(itemarr[j], res.data[i]);
                                data.push(newItem);
                            }
                        } else {
                            data.push(res.data[i]);
                        }
                    }
                    res.data = data;
                }
            },
            done: function(res) { //包含表格单元格合并以及工具栏事件(审核，修改，作废);
                var msg=res.msg.split("&");
                $("#rebackorder_data_count_span0").html(msg[0]);//未审核
                $("#rebackorder_data_count_span1").html(msg[1]);//已审核
                $("#rebackorder_data_count_span3").html(msg[2]);//已作废
                // 给1688单号上添加单击 跳转页面事件
                setEventByselector('#rebackorder_dataTable', '.clcikRoutTo', 'click', rebackorder_routerTo_1688_fun)
                imageLazyloadAll();    //懒加载
                tableMerge.render(this); //合并列单元格，根据merge：""相等进行分组合并
            },
            limit: 100,
        });
    };
    table.on('tool(rebackorder_dataTable)', function(obj) {
        var data = obj.data;
        var layEvent = obj.event;
        var backNumbers = [];
        if (layEvent === 'check') { //审核
            layer.confirm('确定开始审核这条退回单?', function(index) {
                backNumbers.push(data.backNumber);
                if(!rebackorder_auditValidate_fun(data)){
                    layer.close(index);
                    return false;
                }
                rebackorder_batch_audit_fun(backNumbers);
                layer.close(index);
            });
        } else if(layEvent === 'abodon') { //作废
            layer.confirm('确定作废这条退回单?', function(index) {
                backNumbers.push(data.backNumber);
                rebackorder_abondon_fun(backNumbers);
            })
        } else if (layEvent === 'edit') { //编辑
            currentPId = data.id;
            backNumbers.push(data.backNumber);
            var currrentProcess = data.processStatus;
            var itemdata = []; //商品信息表格数据
            var storageNumber=data.storageNumber;//入库单号
            var backNumber=data.backNumber;//退回单号
            var index = layer.open({
                type: 1,
                title: "修改采购退回单",
                area: ["80%", '70%'],
                shadeClose: false,
                btn: ['审核','保存', '关闭'],
                content: $("#rebackorder_modify_layer").html(),
                success: function(layero,index ) {
                    if($("#rebackorder_bacthAudit_btn").length==1){
                        layero.find(".layui-layer-btn0").css({'float':'left'});
                    }else{
                        layero.find(".layui-layer-btn0").css({'display':'none'});
                    }
                    if(currrentProcess != 0){
                        layero.find(".layui-layer-btn0").css({'display':'none'});
                    }
                    var itemtableIns = {};
                    loading.show();
                    $.ajax({
                        url: ctx + '/purOrderStorageBack/getPurOrderStorageBackInfoByBackNumber.html',
                        dataType: 'json',
                        data:{backNumber:data.backNumber},
                        success: function(returnData) {
                            loading.hide();
                            if (returnData.code != "0000") {
                                layer.msg(returnData.msg,{icon:2});
                                return;
                            }
                            var resData=returnData.data;
                            for (var i in resData) {
                                $('#rebackorder_update_bill_form input[name="' + i + '"]').val(resData[i]);
                                $('#rebackorder_update_reback_form input[name="' + i + '"]').val(resData[i]);
                                if (i == 'createTime') {
                                    $('#rebackorder_update_reback_form input[name="' + i + '"]').val(Format(resData[i], 'yyyy-MM-dd hh:mm:ss'));
                                }
                            }
                            rebackorder_fillSelectAddAndUpdate_fun();
                            itemdata = resData.backDetailDtoList;
                            for (var i in itemdata) {
                                var curObj= itemdata[i];
                                var totalmoney =curObj.backAmount ? curObj.backAmount : 0;
                                var initbackNum = parseInt(curObj.storageNum - curObj.alreadyBack);
                                curObj.initbackNum = initbackNum < curObj.avaiableStock ? initbackNum : curObj.avaiableStock;
                                curObj.totalmoney = totalmoney.toFixed(2);
                                itemdata[i].backNumber=backNumber;
                                itemdata[i]=curObj;
                            }
                            formSelects.render();
                            formSelects.value('rebackorderlayer_insiteNoteType', resData.internalLabel.split(','));
                            if(resData.deliveryType !=null){
                                $("#rebackorderlayer_deliverType").val(resData.deliveryType);
                            }
                            if(resData.payType !=null){
                                $("#rebackorderlayer_payTypeList").val(resData.payType);
                            }
                            form.render('select');
                            rebackorder_addItemSku_fun('rebackorder_update_sku_table', itemdata,'rebackorder_update_reback_form');
                        }
                    });
                    $('#rebackorder_modify_addItem_btn').click(function() {
                        layer.open({
                            type: 1,
                            title: "添加退回商品",
                            area: ["80%", '70%'],
                            shadeClose: false,
                            btn: ['保存', '关闭'],
                            content: $("#rebackorder_additem_layer").html(),
                            success: function(index, layero) {
                                rebackorder_searchItem_fun(storageNumber);//注册添加商品函数
                            },
                            yes: function(index, layero) {
                                var checkStatus = table.checkStatus('rebackorder_additem_table');
                                itemdata = itemdata.concat(checkStatus.data);
                                itemdata = rebackorder_sku_unique('prodSSku', itemdata);
                                itemtableIns.reload({data: itemdata});
                                layer.close(index);
                            }
                        });
                        return false;
                    })
                },
                yes: function(index, layero){
                    if (currrentProcess != 0) { //如果不是待审核状态不允许编辑
                        layer.close(index);
                        return false;
                    }
                    var submitdata = getrebackData(itemdata, 'rebackorder_update_reback_form');
                    submitdata.storageNumber = storageNumber;
                    if(rebackorder_auditValidate_fun(submitdata)){
                        rebackorder_update_fun(submitdata,itemdata,backNumber);//修改退回商品,然后审核
                    }
                    return false;
                },
                btn2: function (index) {
                    if (currrentProcess != 0) { //如果不是待审核状态不允许编辑
                        layer.close(index);
                        return false;
                    }
                    var data = getrebackData(itemdata, 'rebackorder_update_reback_form');
                    data.storageNumber = storageNumber;
                    rebackorder_update_fun(data,itemdata);//修改退回商品
                    return false;
                },
                btn3: function () {
                    rebackorder_tablerender_fun();//重新搜索
                }
            });
        }
    });
    /**新增采购退回单**/
    $('#rebackorder_add_btn').click(function() {
        rebackorder_processStatus=0;
        var data = getSearchData();
        rebackorder_add_btn_fun(null,rebackorder_tablerender_fun,data);//新增采购退回单
    });

    /**
     * 修改采购退回单
     * @param data
     * @param itemdata
     * @param curBackNumber 是否传入退回单，传入，修改后审核
     * @returns {boolean}
     */
    function rebackorder_update_fun(data,itemdata,curBackNumber){
        if(rebackorder_addOrUpdateParamValidate(data,itemdata)){ //校验参数
            loading.show();
            $.ajax({
                url: ctx + '/purOrderStorageBack/updateOnePurOrderBackStorage.html',
                dataType: 'json',
                type: 'POST',
                data: data,
                success: function(returnData) {
                    loading.hide();
                    if(returnData.code == "0000"){
                        if(curBackNumber == null || curBackNumber == ''){ //只修改
                            layer.closeAll();
                            layer.msg(returnData.msg,{icon:1});
                            rebackorder_processStatus=0;
                            rebackorder_tablerender_fun();
                        }else{ //修改后审核
                            var backNumbers = [];
                            backNumbers.push(curBackNumber);
                            rebackorder_batch_audit_fun(backNumbers);
                        }

                    }else{
                        layer.msg(returnData.msg,{icon:2});
                    }
                }
            })
            return false;
        }
    };
    //批量审核
    $('#rebackorder_bacthAudit_btn').click(function() {
        var checkStatus = table.checkStatus('rebackorder_dataTable');
        var backNumbers = [];
        if (checkStatus.data.length > 0) {
            layer.confirm('确定开始批量审核这' + checkStatus.data.length + '条退回单?', function(index) {
                for (var i = 0; i < checkStatus.data.length; i++) {
                    backNumbers.push(checkStatus.data[i].backNumber);
                    /**20191231 退回单提交的时候 快递方式、快递单号、退回地址、付款方式 修改为 非必填项  （退回单审核的时候 “快递方式 、快递单号 、退回地址、付款方式”这些再改为必填）**/
                    if(!rebackorder_auditValidate_fun(checkStatus.data[i])){
                        return false;
                    }
                }
                rebackorder_batch_audit_fun(backNumbers);
                $('button[type="reset"]').click();
                layer.close(index);
            });
        } else {
            layer.msg('请勾选要审核的入库单',{icon:0})
        }
    });
    /***
     * 切换详情，日志选项卡
     */
    element.on('tab(rebackorder_detail_tab_filter)', function (data) {
        var isLog = $(this).attr("isLog");
        if (isLog != 1) {
            return;
        }
        table.render({
            elem: "#rebackorder_purStorageBackLogTab",
            id: "rebackorder_purStorageBackLogTab",
            method: 'post',
            url: ctx + "/purOrderStorageBack/selectPurOrderStorageBackLogByPId.html",
            where: {pId: currentPId},
            cols: [
                [
                    {title: "时间", width: 150, templet: '<div>{{format(d.createTime, "yyyy-MM-dd hh:mm:ss")}}</div>'},
                    {field: "creator", title: "操作人", width: 100},
                    {field: "operTypeStr", title: "操作类型", width: 150},
                    {field: "operDesc", title: "操作详情"},
                ]
            ],
            page: false
        });
    });
    // 导出采购退回单
    $("#rebackorder_export_btn").click(function() {
        layer.open({
            title: '导出采购退回单',
            type: 1, //不加该属性,就会出现[object Object]
            area: ['1000px', '600px'],
            btn: ['确定', '关闭'],
            content: $('#rebackinorder_export_pop').html(),
            success: function() {
                form.on('checkbox(rebackinorder_export_selectAll)', function(data) {
                    var checked = data.elem.checked
                    $('#rebackinorder_export_form input[type=checkbox]:enabled').prop('checked', checked)
                    form.render('checkbox')
                })
                form.render('checkbox')
            },
            yes: function() {
                var selectedData = table.checkStatus('rebackorder_dataTable').data;
                var idList = [];
                for (var i = 0; i < selectedData.length; ++i) {
                    idList.push(selectedData[i].id)
                }
                var exportFiled = [];
                $("#rebackinorder_export_form input[type=checkbox]:checked").each(function() {
                    exportFiled.push($(this).val());
                });
                var data = getSearchData();
                data.idList = idList.join(',')
                data.exportFiled = exportFiled.join(",");
                layer.confirm('确认导出当前搜索条件下的退回单？', { btn: ['确认', '取消'] }, function() {
                    submitForm(data, ctx + '/purOrderStorageBack/exportPurOrderStorageBackInfo.html', "_blank")
                    layer.closeAll();
                }, function() {
                    layer.closeAll();
                })
            }
        });
    });
    // 作废入库单
    function rebackorder_abondon_fun(backNumbers) {
        loading.show();
        $.ajax({
            url: ctx + '/purOrderStorageBack/deletePurOrderStorageBackByBackNumber.html',
            dataType: 'json',
            data: { "backNumbers": JSON.stringify(backNumbers) },
            success: function(returnData) {
                loading.hide();
                if (returnData.code === "0000") {
                    layer.msg(returnData.msg,{icon:1});
                    rebackorder_tablerender_fun();
                } else {
                    layer.msg(returnData.msg,{icon:2});
                }
            },
            error: function(returnData) {
                layer.msg(returnData.msg,{icon:2});
            }
        })
    };

    function rebackorder_auditValidate_fun(data){
        if (data.storageNumber == null || data.storageNumber == '') {
            layer.msg("原入库单号不能为空", {icon: 0});
            return false;
        }
        if (data.deliveryType == null || data.deliveryType == '') {
            layer.msg("快递方式不能为空", {icon: 0});
            return false;
        }
        if (data.deliveryNumber == null || data.deliveryNumber == '') {
            layer.msg("快递单号不能为空", {icon: 0});
            return false;
        }
        if (data.backAddress == null || data.backAddress == '') {
            layer.msg("退回地址不能为空", {icon: 0});
            return false;
        }
        if (data.payType == null || data.payType == '') {
            layer.msg("付款方式不能为空", {icon: 0});
            return false;
        }
        return true;
    };
    //审核退回单
    function rebackorder_batch_audit_fun(backNumbers) {
        loading.show();
        $.ajax({
            url: ctx + '/purOrderStorageBack/auditPurOrderStorageBackByBackNumber.html',
            dataType: 'json',
            data: { "backNumbers": JSON.stringify(backNumbers) },
            success: function(returnData) {
                loading.hide();
                if (returnData.code === "0000") {
                    layer.closeAll();
                    layer.msg(returnData.msg,{icon:1});
                    rebackorder_tablerender_fun();
                } else {
                    layer.msg(returnData.msg,{icon:2});
                }
            },
            error: function(returnData) {
                loading.hide();
                layer.msg(returnData.msg,{icon:2});
            }
        })
    };
    //查询入库单列表表单参数构造
    function getSearchData() {
        var data = serializeObject($('#rebackorder_search_form'));
        data.supplierName = $('#reback_searchSupplier_input').val();
        data.processStatus = rebackorder_processStatus;
        var warehouseList = [];
        $("#rebackorder_warehouseList").children().each(function () {
            var warehouseId = $(this).val();
            if (warehouseId != null && warehouseId != '') {
                warehouseList.push(warehouseId);
            }
        });
        data.warehouseList = warehouseList.join(",");//授权仓库集合
        if (data.orderNumber != "" && data.orderNumber != null) {
            data[data.orderType] = data.orderNumber;
        }
        if (data.timerange != "") {
            if (data.timeType == "0") { //创建时间
                data.createTimeStart = data.timerange.split(' - ')[0] + ' 00:00:00';
                data.createTimeEnd = data.timerange.split(' - ')[1] + ' 23:59:59';
            } else { //审核时间
                data.auditTimeStart = data.timerange.split(' - ')[0] + ' 00:00:00';
                data.auditTimeEnd = data.timerange.split(' - ')[1] + ' 23:59:59';
            }
        }
        data.timerange=null;
        return data;
    };
    function rebackorder_routerTo_1688_fun() {
        var span = $(this);
        var id = span.find('a').text();
        if (id==null||id=='') {
            return;
        }
        span.attr('data-ifExcuteClick', 1)
        var index = window.setTimeout(function() {
            var ifExcuteClick = span.attr('data-ifExcuteClick')
            if (ifExcuteClick == '1') {
                var routerUrl = span.attr('data-routUrl')
                window.open(routerUrl.replace('{data}', id))
            }
            span.removeAttr('data-ifExcuteClick')
        }, 300)
    };
    function getLatestMonth() {
        var data = {};
        data.createTimeEnd = Format(new Date(), 'yyyy-MM-dd');
        data.createTimeStart = Format((new Date()).setMonth(new Date().getMonth() - 1), 'yyyy-MM-dd');
        data.processStatus = "0";
        return data;
    };
});
