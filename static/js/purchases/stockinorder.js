var stockinSelectData = {}
layui.use(["admin", "form", "table", "layer", "laydate", 'tableMerge', 'formSelects', 'element'], function () {
    var admin = layui.admin,
        form = layui.form,
        table = layui.table,
        layer = layui.layer,
        laydate = layui.laydate,
        formSelects = layui.formSelects,
        element = layui.element,
        $ = layui.$;
    form.render('select');
    form.render('radio');
    form.render('checkbox');
    var currentPId;
    var stockinorder_processStatus = 0;//当前流程状态
    var lastMonth=getLatestMonth();
    $('#stockinorder_timerange_input').val(lastMonth.createTimeStart + ' - ' + lastMonth.createTimeEnd);
    var dim = new DimSearch('#stockinorder_searchSupplier_input', 'stockinorder_supplierId_input');    //远程搜索功能
    dim.init();
    laydate.render({
        elem: '#stockinorder_timerange_input',
        trigger: 'click',
        range: true
    });
    // 初始化部门 采购员选项
    render_hp_orgs_users("#stockinForm");
    /**初始化下拉框数据**/
    $.ajax({
        url: ctx + "/purOrderBase/getPurOrderPageEnum.html",
        type: 'post',
        dataType: 'json',
        success: function (returnData) {
            if (returnData.code == "0000") {
                var resData=returnData.data;
                for (var i in resData) {
                    if (resData[i].length > 0) {
                        stockin_append_op(i, resData[i]); //遍历数据生成option填到相应select
                    }
                    var buyerList = [];
                    $(returnData.data.buyerList).each(function() {
                        var a = { name: this.name, value: this.value };
                        buyerList.push(a);
                    });
                    formSelects.data('stockinbuyerList', 'local', { arr: buyerList });
                }
                // 后面弹框会用到快递方式deliverType以及内部标签数据insiteNoteType，以免再次请求数据
                stockinSelectData.layerdeliverType = resData.deliverType;
                stockinSelectData.layerinsiteNoteType = resData.insiteNoteType;
                form.render('select');
                tablerender(getSearchData());//默认搜索近一个月数据
            }
        }
    });
    //表单查询
    $("#stockinorder_search_btn").click(function(){
        tablerender(getSearchData());
        return false;
    });
    // 下拉框填入，初始化表单下拉框时调用
    function stockin_append_op(domName, obj) {
        if($('#stockin' + domName).length>0){
            var $li = '<option value=""></option>';
            for (var i in obj) {
                if (obj[i]) {
                    $li += '<option value=' + obj[i].value + '>' + obj[i].name + '</option>';
                }
            }
            $('#stockin' + domName).append($li);
        }
    }
    function stockinorder_cols (status) {
        if (status == 0) {
            return [
                [
                    {type: "checkbox", width: 30, merge: 'storageNumber', field: 'checkboxcol'},
                    {title: "供应商", field: 'supplierName', merge: 'storageNumber'},
                    {title: "单号", field: 'ali1688OrderNo', width: 210, templet: '#tpl_stockinorderNo', merge: 'storageNumber'},
                    {title: "SKU", field: 'prodSSku', width: 200, templet: '#tpl_stockinorderSku', merge: 'storageNumber'},
                    {title: "下单备注", field: 'note', width: 70, merge: 'storageNumber', templet: '#tpl_stockinordeNote'},
                    {title: "入库要求", field: 'packDesc', width: 70, templet: '#tpl_stockinordepackDesc', merge: 'storageNumber'},
                    {title: "图片", field: 'skuImage', width: 100, templet: '#tpl_stockinorderImg', merge: 'storageNumber'},
                    {title: "库位", field: 'warehouseName', width:100, templet: '#tpl_stockinlocation', merge: 'storageNumber'},
                    // { field: "prodSSku", width:'45%',
                    //     title: "<div style='width:15%;float: left;'>SKU</div> " +
                    //     "<div style='width:10%;float: left;'>下单备注</div> " +
                    //     "<div style='width:10%;float: left;'>入库要求</div> " +
                    //     "<div style='width:16%;float: left;'>图片</div> " +
                    //     "<div style='width:14%;float: left;'>库位</div> " +
                    //     "<div style='width:9%;float: left;'>含税单价(￥)</div>" +
                    //     "<div style='width:6%;float: left;'>入库数量</div>"+
                    //     "<div style='width:7%;float: left;'>入库金额(￥)</div>" +
                    //     "<div style='width:6%;float: left;'>采购数量</div>" +
                    //     "<div style='width:7%;float: left;' title='不含在途'>预计可用库存</div>",
                    //    templet: '#stockinorder_prodSSku_tpl1'},
                    {title: "总金额(￥)", field: 'totalStorageMoney', templet: '#tpl_stockinMoney', width: 100, merge: 'storageNumber'},
                    {title: "数量", field: 'totalStorageNum', templet: '#tpl_stockintotalStorageNum', width: 130, merge: 'storageNumber'},
                    // {title: "采购总数量", field: 'totalBuyNumber', width: '3%', merge: 'storageNumber'},
                    {title: "快递信息", field: 'deliveryNumber',width: 100,templet: '#tpl_deliveryNumber',merge: 'storageNumber'},
                    {title: "异常类型", field: 'feedbackRemark', merge: 'storageNumber'},
                    {title: "人员", field: 'creator', merge: 'storageNumber', width: 100, templet: '#stockin_tpl_creator'},
                    {title: "时间", field: 'createTime', merge: 'storageNumber', width: 170, templet: '#stockin_tpl_createTime'},
                    {title: "备注", field: 'remark', merge: 'storageNumber'},
                    {title: "操作", templet: '#stockinorder_table_operqte_tpl',width:80},
                ]
            ]
            
        } else {
            return [
                [
                    {type: "checkbox", width: 30, merge: 'storageNumber', field: 'checkboxcol'},
                    {title: "供应商", field: 'supplierName', merge: 'storageNumber'},
                    {title: "单号", field: 'ali1688OrderNo', width: 210, templet: '#tpl_stockinorderNo', merge: 'storageNumber'},
                    {title: "SKU", field: 'prodSSku', width: 200, templet: '#tpl_stockinorderSku', merge: 'storageNumber'},
                    {title: "下单备注", field: 'note', width: 70, merge: 'storageNumber', templet: '#tpl_stockinordeNote'},
                    {title: "入库要求", field: 'packDesc', width: 70, templet: '#tpl_stockinordepackDesc', merge: 'storageNumber'},
                    {title: "图片", field: 'skuImage', width: 100, templet: '#tpl_stockinorderImg', merge: 'storageNumber'},
                    {title: "库位", field: 'warehouseName', width: 100, templet: '#tpl_stockinlocation', merge: 'storageNumber'},
                    // { field: "prodSSku", width:'45%',
                    // title: "<div style='width:18%;float: left;'>SKU</div> " +
                    // "<div style='width:10%;float: left;'>下单备注</div> " +
                    // "<div style='width:10%;float: left;'>入库要求</div> " +
                    // "<div style='width:15%;float: left;'>图片</div> " +
                    //     "<div style='width:10%;float: left;'>库位</div> " +
                    //     "<div style='width:9%;float: left;'>含税单价(￥)</div>" +
                    //     "<div style='width:8%;float: left;'>入库数量</div>"+
                    //     "<div style='width:10%;float: left;'>入库金额(￥)</div>" +
                    //     "<div style='width:8%;float: left;'>采购数量</div>" ,
                    //    templet: '#stockinorder_prodSSku_tpl'},
                    {title: "总金额(￥)", field: 'totalStorageMoney', templet: '#tpl_stockinMoney', width: 100, merge: 'storageNumber'},
                    {title: "数量", field: 'totalStorageNum', templet: '#tpl_stockintotalStorageNum', width: 130, merge: 'storageNumber'},
                    // {title: "采购总数量", field: 'totalBuyNumber', width: '3%', merge: 'storageNumber'},
                    {title: "快递信息", field: 'deliveryNumber',width: 100,templet: '#tpl_deliveryNumber',merge: 'storageNumber'},
                    {title: "人员", field: 'creator', merge: 'storageNumber', width: 100, templet: '#stockin_tpl_creator'},
                    {title: "时间", field: 'createTime', merge: 'storageNumber', width: 170, templet: '#stockin_tpl_createTime'},
                    {title: "备注", field: 'remark', merge: 'storageNumber'},
                    {title: "操作", toolbar: '#stockinorder_table_operqte_tpl', width: 80, merge: 'storageNumber', field: 'toolbarcol'},
                ]
            ]
        }
    }
    //绘制采购入库单列表表格
    function tablerender (data) {
        table.render({
            elem: "#stockinorder_dataTable",
            id: 'stockinorder_dataTable',
            method: "post",
            url: ctx + '/purOrderStorage/searchPurOrderStorageByDto.html',
            where: data,
            cols: stockinorder_cols(data.processStatus),
            page: true,
            limits: [100, 500, 1000],
            done: function (res) { //包含表格单元格合并以及工具栏事件(审核，修改，作废);
                 var msg=res.msg.split("&");
                 $("#stockinorder_data_count_span0").html(msg[0]);//未审核
                 $("#stockinorder_data_count_span1").html(msg[1]);//已审核
                 $("#stockinorder_data_count_span3").html(msg[2]);//已作废
                // 给1688单号上添加单击 跳转页面事件
                setEventByselector('#stockinorder_dataTable', '.clcikRoutTo', 'click', routerTo)
                imageLazyloadAll(); //懒加载
                //ztt20230913--展示包裹数量
                if((res.extra &&res.extra.received && res.extra.received.length>=0) || (res.extra && res.extra.unReceived && res.extra.unReceived.length>=0)){
                  //包裹总数
                  let totalPackageNum= res.extra.received.length + res.extra.unReceived.length;
                  //已创建的包裹数
                  let receivedNum = res.extra.received.length;
                  //展示问题
                  let showStr ='';
                  if(totalPackageNum > 1){
                    showStr = `<span class="packageNumShow" data-str="未点货包裹: ${res.extra.unReceived.join(',')},已点货包裹:${res.extra.received.join(',')}"><font size="4" color="red">包裹数:${receivedNum}/${totalPackageNum}</font></span>`;
                  }else{
                    showStr = `<span class="packageNumShow" data-str="未点货包裹: ${res.extra.unReceived.join(',')},已点货包裹:${res.extra.received.join(',')}">包裹数:${receivedNum}/${totalPackageNum}</span>`;
                  }
                  //包裹数量展示
                  $('#stockinorder_package_number_div').html(showStr);
                }
                $('td[data-field="packDesc"]').addClass('remark_stronger');
                $('td[data-field="note"]').addClass('remark_stronger');
            },
            limit: 100,
        });
    };

    table.on('tool(stockinorder_dataTable)', function (obj) {
        var data = obj.data;
        var layEvent = obj.event;
        var storageNumber = [];//多个入库单号
        if (layEvent === 'check') { //审核
            // layer.confirm('确定审核这条入库单?', function (index) {
            //     storageNumber.push(data.storageNumber);
            //     checkstockinorder(storageNumber);
            //     layer.close(index);
            // });
            layer.open({
                type: 1,
                content: '确定审核这条入库单?',
                btn: ['确定','取消'],
                area: ["250px", '150px'],
                success: function(layero, index){
                    this.escQuit = function(event){
                        if(event.keyCode == 13){
                            storageNumber.push(data.storageNumber);
                            checkstockinorder(storageNumber);
                            layer.close(index);
                            return false; //阻止系统默认回车事件
                        }
                    };
                    $(document).on('keydown', this.escQuit); //监听键盘事件
                },
                yes: function (index) {
                    storageNumber.push(data.storageNumber);
                    checkstockinorder(storageNumber);
                    layer.close(index);
                },
                end: function () {
                    // 表格全选
                    // let tableData = layui.table.cache.stockinorder_dataTable
                    // $.each(tableData, function(i,n) {   //res.data为后台返回的表格所有数据，n为表格中每一行的数据
                    //     // 可以自行添加判断的条件是否选中
                    //     var index = n.LAY_TABLE_INDEX,
                    //         $chk = $('tr[data-index=' + index + '] input[type="checkbox"]');
                    //     // 这句才是真正选中，通过设置关键字LAY_CHECKED为true选中
                    //     tableData[index]["LAY_CHECKED"] = 'true';
                    //     // 下面两句是通过更改css来实现选中的效果
                    //     // $chk.prop('checked', true);
                    //     // $chk.next().addClass('layui-form-checked');
                    //     $chk.next().click()
                    // })
                    // 鼠标焦点
                    $("#stockinorder_orderNumber").focus()
                    $(document).off('keydown', this.escQuit); //解除键盘事件
                }
            });
        }else if (layEvent === 'abodon'){ //预览打印
          commonReturnPromiseRes({
            url: `/lms/purOrderStorage/getIsLoading?storageNumbers=${data.storageNumber}`
          }).then(res => {
            if(res.data && res.data.length>0){
              //装车中
              layer.confirm(`入库单${res.data}已执行入库操作,确定作废?`,function(confirmIndex){
                storageNumber.push(data.storageNumber)
                abondonstockinorder(storageNumber);
                layer.close(confirmIndex);
              });
            }else{
              layer.confirm('确定作废这条入库单?', function (index) {
                storageNumber.push(data.storageNumber)
                abondonstockinorder(storageNumber);
                layer.close(index);
            })
            }
          });
            
        }else if (layEvent === 'back'){ //生成退回单
            var curStorageNumber=data.storageNumber;
            rebackorder_add_btn_fun(curStorageNumber);//新增采购退回单
        }else if (layEvent === 'scanload'){ //扫描装车
            var curStorageNumber=data.storageNumber;
            stockinorder_scanload_fun(curStorageNumber);//新增采购退回单
        } else if (layEvent === 'edit') { //编辑
            currentPId = data.id;
            var currrentProcess = data.processStatus;
            var mainBillNumber=data.mainBillNumber;//采购订单号
            var curStorageNumber=data.storageNumber;
            var itemdata = []; //商品信息表格数据
              layer.open({
                type: 1,
                title: "采购入库单详情",
                area: ["90%", '90%'],
                shadeClose: false,
                btn: ['审核','保存', '关闭'],
                content: $("#stockinorder_update_layer").html(),
                success: function (layero,index ) {
                    if($("#stockinorder_patchcheck").length==1){
                        layero.find(".layui-layer-btn0").css({'float':'left'});
                    }else{
                        layero.find(".layui-layer-btn0").css({'display':'none'});
                    }
                    if(currrentProcess != 0){
                        layero.find(".layui-layer-btn0").css({'display':'none'});
                    }
                    loading.show();
                    $.ajax({
                        url: ctx + '/purOrderStorage/getPurOrderStorageInfoByStorageNumber.html',
                        type: 'post',
                        dataType: 'json',
                        data:{storageNumber:data.storageNumber},
                        success: function (returnData) {
                            loading.hide();
                            if (returnData.code == "0000") {
                                var resData=returnData.data;
                                itemdata=returnData.data.detailDtos;
                                for (var i in resData) {
                                    $('#stockinorder_update_bill_form input[name="' + i + '"]').val(resData[i]);
                                    $('#stockinorder_update_storage_form input[name="' + i + '"]').val(resData[i]);
                                    if (i == 'createTime') {
                                        $('#stockinorder_update_storage_form input[name="' + i + '"]').val(Format(resData[i], 'yyyy-MM-dd hh:mm:ss'));
                                    }
                                }
                                if(resData.internalLabel != null){
                                    formSelects.value('layerinsiteNoteType', resData.internalLabel.split(','));
                                }
                                // 构造商品信息表格渲染数据
                                for (var i in itemdata) {
                                    var totalmoney = itemdata[i].storageMoney ? itemdata[i].storageMoney : 0;
                                    itemdata[i].totalmoney = totalmoney.toFixed(2);
                                    itemdata[i].status = 1;
                                    itemdata[i].storageNumber=data.storageNumber;
                                }
                                stockinorder_addItemSku_fun("stockinorder_update_addItem_table",itemdata);
                            } else {
                                layer.msg(returnData.msg,{icon:2});
                            }
                        }
                    });
                    for (var i in stockinSelectData) {
                        stockin_append_op(i, stockinSelectData[i])
                    }
                    // 内部标签设置
                    form.render('select');
                    formSelects.render();
                    selected('layerdeliverType', data.deliveryType);
                    $('#stockinorder_update_addItem_btn').click(function () {
                        layer.open({
                            type: 1,
                            title: "添加商品",
                            area: ["80%", '70%'],
                            shadeClose: false,
                            btn: ['保存', '关闭'],
                            content: $("#stockinorder_addItem_layer").html(),
                            success: function (index, layero) {
                                stockinorder_searchItem_fun(data.mainBillNumber,curStorageNumber);
                            },
                            yes: function (index, layero) {
                                var checkStatus = table.checkStatus('stockinorder_addItem_table');
                                itemdata = itemdata.concat(checkStatus.data);
                                itemdata = stockinorder_sku_unique('prodSSku', itemdata);
                                table.reload('stockinorder_update_addItem_table', {data: itemdata});
                                stockinorder_storageNum_blur(itemdata);
                                layer.close(index);
                            }
                        });
                        return false;
                    })
                },
                  yes: function(index, layero){
                      if (currrentProcess != 0) {//如果不是未审核状态的不予编辑
                          layer.close(index);
                          return false;
                      }
                      var data = stockinorder_getFormData_fun(itemdata, 'stockinorder_update_storage_form');
                      data.storageNumber = $('#stockinorder_update_storageNumber_input').val();
                      data.mainBillNumber = mainBillNumber;
                      stockinorder_update_fun(data, itemdata, curStorageNumber);//修改后审核
                    },
                  btn2: function (index) {
                    if (currrentProcess != 0) {//如果不是未审核状态的不予编辑
                        layer.close(index);
                        return false;
                    }
                    var data = stockinorder_getFormData_fun(itemdata, 'stockinorder_update_storage_form');
                    data.storageNumber = $('#stockinorder_update_storageNumber_input').val();
                    data.mainBillNumber = mainBillNumber;
                    stockinorder_update_fun(data,itemdata);
                },
                  btn3: function () {
                    tablerender(getSearchData());//重新搜索
                }
            });
        }else if (layEvent === 'view'){
            currentPId = data.id;
            var currrentProcess = data.processStatus;
            var mainBillNumber=data.mainBillNumber;//采购订单号
            var curStorageNumber=data.storageNumber;
            var itemdata = []; //商品信息表格数据
            layer.open({
                type: 1,
                title: "查看采购入库单详情",
                area: ["90%", '90%'],
                shadeClose: false,
                content: $("#stockinorder_update_layer").html(),
                success: function (layero,index ) {
                    if($("#stockinorder_patchcheck").length==1){
                        layero.find(".layui-layer-btn0").css({'float':'left'});
                    }else{
                        layero.find(".layui-layer-btn0").css({'display':'none'});
                    }
                    if(currrentProcess != 0){
                        layero.find(".layui-layer-btn0").css({'display':'none'});
                    }
                    loading.show();
                    $.ajax({
                        url: ctx + '/purOrderStorage/getPurOrderStorageInfoByStorageNumber.html',
                        type: 'post',
                        dataType: 'json',
                        data:{storageNumber:data.storageNumber},
                        success: function (returnData) {
                            loading.hide();
                            if (returnData.code == "0000") {
                                var resData=returnData.data;
                                itemdata=returnData.data.detailDtos;
                                for (var i in resData) {
                                    $('#stockinorder_update_bill_form input[name="' + i + '"]').val(resData[i]);
                                    $('#stockinorder_update_storage_form input[name="' + i + '"]').val(resData[i]);
                                    if (i == 'createTime') {
                                        $('#stockinorder_update_storage_form input[name="' + i + '"]').val(Format(resData[i], 'yyyy-MM-dd hh:mm:ss'));
                                    }
                                }
                                if(resData.internalLabel != null){
                                    formSelects.value('layerinsiteNoteType', resData.internalLabel.split(','));
                                }
                                // 构造商品信息表格渲染数据
                                for (var i in itemdata) {
                                    var totalmoney = itemdata[i].storageMoney ? itemdata[i].storageMoney : 0;
                                    itemdata[i].totalmoney = totalmoney.toFixed(2);
                                    itemdata[i].status = 1;
                                    itemdata[i].storageNumber=data.storageNumber;
                                }
                                stockinorder_addItemSku_fun("stockinorder_update_addItem_table",itemdata);
                            } else {
                                layer.msg(returnData.msg,{icon:2});
                            }
                        }
                    });
                    for (var i in stockinSelectData) {
                        stockin_append_op(i, stockinSelectData[i])
                    }
                    // 内部标签设置
                    form.render('select');
                    formSelects.render();
                    selected('layerdeliverType', data.deliveryType);
                }
            });
        }
    });
    /**流程状态选项卡变更函数**/
    element.on('tab(stockinorder_data_count_tab)', function (data) {
        stockinorder_processStatus=$(this).attr("data-index");
        // 装车时间；只在“未审核“页签展示
        const basicTimeTypeList = [
            { value: 0, name: "制单时间" },
            { value: 1, name: "审核时间" },
        ];
        if (stockinorder_processStatus == 0) {
            basicTimeTypeList.push({ value: 2, name: "装车时间" })
            $("#stockinForm").find(".only-show-unchecktab").show();
        } else {
            $("#stockinForm").find(".only-show-unchecktab").hide();
        }
        const timeTypeStr = basicTimeTypeList.map(v=>`<option value="${v.value}">${v.name}</option>`).join('')
        const timeTypeDom = $("#stockinForm").find('select[name=timeType]')
        timeTypeDom.html(timeTypeStr)
        form.render('select')
        var data = getSearchData();
        tablerender(data);
    });
    // 弹框新增采购入库单
    $('#newStockinOrder').click(function () {
        stockinorder_processStatus=0;
        var data = getSearchData();
        stockinorder_add_btn_fun(null,tablerender,data);//新增采购入库单
    });

    //批量审核
    $('#stockinorder_patchcheck').click(function () {
        var checkStatus = table.checkStatus('stockinorder_dataTable');
        if (checkStatus.data.length > 0) {
            var storageNumber = [];
            layer.confirm('确定批量审核这' + checkStatus.data.length + '条入库单?', function (index) {
                for (var i = 0; i < checkStatus.data.length; i++) {
                    storageNumber.push(checkStatus.data[i].storageNumber);
                }
                checkstockinorder(storageNumber);
                layer.close(index);
            });
        } else {
            layer.msg('请勾选要审核的入库单',{icon:0})
        }
    });
    //批量作废
    $('#stockinorder_patchdelete').click(function () {
        var checkStatus = table.checkStatus('stockinorder_dataTable');
        if (checkStatus.data.length > 0) {
            var storageNumbers = [];
            for (var i = 0; i < checkStatus.data.length; i++) {
              storageNumbers.push(checkStatus.data[i].storageNumber);
            }
            commonReturnPromiseRes({
              url: `/lms/purOrderStorage/getIsLoading?storageNumbers=${storageNumbers.join(',')}`
            }).then(res => {
              if(res.data && res.data.length>0){
                //装车中
                layer.confirm(`入库单${res.data}已执行入库操作,确定作废?`,function(confirmIndex){
                  abondonstockinorder(storageNumbers);
                  layer.close(confirmIndex);
                });
              }else{
                layer.confirm('确定批量作废这' + checkStatus.data.length + '条入库单?', function (index) {
                  abondonstockinorder(storageNumbers);
                  layer.close(index);
              });
              }
            });
        } else {
            layer.msg('请勾选要作废的入库单',{icon:0})
        }
    });
    //批量打印标签
    $('#stockinorder_patchprint').click(function () {
        var checkStatus = table.checkStatus('stockinorder_dataTable');
        if(!checkStatus.data.length){
          layer.msg('请勾选要打印标签的入库单',{icon:0})
        }else{
          let data = checkStatus.data;
          let getSetPrintNum = $('#stockinorder_print_num_input').val() ? $('#stockinorder_print_num_input').val() : 0;
          //需要组合父子数据,传递给接口
          let printParamsList =[];
          for(let i=0; i<data.length; i++){
            let item = data[i];
            let warehouseId = item.storeId;
            for(let j=0; j<item.detailDtos.length;j++){
              let itemJ = item.detailDtos[j];
              let obj= {};
              obj.storageNum = itemJ.storageNum;
              obj.printNum = (itemJ.storageNum < getSetPrintNum || getSetPrintNum == 0) ? itemJ.storageNum : getSetPrintNum;
              obj.warehouseId = warehouseId;
              obj.prodSId = itemJ.prodSId;
              obj.storageNumber = itemJ.storageNumber;
              obj.addFlag = true;
              printParamsList.push(obj);
            }
          }
          let regex = /\d+/g; // 匹配一个或多个数字
          let newPrintParamsList = printParamsList.sort((a,b)=> {
            return a.storageNumber.match(regex)[0] - b.storageNumber.match(regex)[0];
          });
          let printResData = commonGetPrintDataByLoopRequest(newPrintParamsList);
          Promise.all(printResData).then(async res => {
            let printParams = [];
            for(let k=0; k<res.length; k++){
              let item = res[k];
              if(typeof(item) == 'string'){
                return layer.msg(item, {icon:7});
              }else{
                let obj = {};
                obj.printType = 19;
                obj.labelUrl = item.labelUrl;
                obj.width = item.width;
                obj.height = item.height;
                obj.printName = item.printName;
                // logistics_label_pdf_print(obj);
                printParams.push(obj);
              }
            }
            commonExecutePrintJobs(printParams);
          })
        }
        // if (checkStatus.data.length > 0) {
        //     stockinorder_printSkuLabel(checkStatus.data);
        // } else {
        //     layer.msg('请勾选要打印标签的入库单',{icon:0})
        // }
        // return;
    });
    /**
     * 打印测试页
     */
    $('#stockinorder_print_test_btn').click(function () {
        const printArray = [{printOperator: localStorage.getItem("lmsAppUserName")}]
        epeanPrint_plugin_fun(0,printArray);
        return;
    });

    /**打印入库单**/
    $('#stockinorder_patchprintA4').click(function () {
        var checkStatus = table.checkStatus('stockinorder_dataTable');
        if (checkStatus.data.length < 1) {
            layer.msg('请勾选要打印的入库单',{icon:0})
            return false;
        }
        var storageNumbers=[];
        for(var i in checkStatus.data){
            storageNumbers.push(checkStatus.data[i].storageNumber);
        }
        window.open(ctx + '/static/html/storageprint.html?storageNumber='+storageNumbers.join(","));
    });

    /**
     * 导出PDA点货数据按钮
     */
    $('#exportPdaData').click(function () {
        var data = {};
        var storeId = $("#stockinwarehouseList").val();
        if (!storeId) {
            layer.msg('请选择仓库！', {icon: 0})
            return;
        }
        data.storeId = storeId;
        var timeRange = $("#stockinorder_timerange_input").val();
        if (!timeRange || timeRange == '') {
            layer.msg('请选择时间！', {icon: 0})
            return;
        }
        data.startTime = timeRange.split(' - ')[0] + ' 00:00:00';
        data.endTime = timeRange.split(' - ')[1] + ' 23:59:59';
        submitForm(data, ctx + '/purOrderStorage/exportPdaScanData.html')
    });
    /***
     * 切换详情，日志选项卡
     */
    element.on('tab(stockinorder_detail_tab_filter)', function (data) {
        var isLog = $(this).attr("isLog");
        if (isLog == 1) {
            table.render({
                elem: "#stockinorder_purStorageLogTab",
                id: "stockinorder_purStorageLogTab",
                method: 'post',
                url: ctx + "/purOrderStorage/selectPurOrderStorageLogByPId.html",
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
        }
    });
    // 导出采购入库单
    $("#stockinorder_exportPurOrderStorageBtn").click(function () {
        var outerIndex = layer.open({
            title: '导出采购入库单',
            type: 1, //不加该属性,就会出现[object Object]
            area: ['1000px', '600px'],
            btn: ['确定', '关闭'],
            content: $('#stockinorder_exportPurStorageOrderPop').html(),
            success: function () {
                form.on('checkbox(stockinorder_exportPurStorageInfo_selectAll)', function (data) {
                    var checked = data.elem.checked
                    $('#stockinorder_exportPurStorageInfoForm input[type=checkbox]:enabled').prop('checked', checked)
                    form.render('checkbox')
                })
                form.render('checkbox')
            },
            yes: function () {
                var selectedData = table.checkStatus('stockinorder_dataTable').data;
                var idList = [];
                for (var i = 0; i < selectedData.length; ++i) {
                    idList.push(selectedData[i].id)
                }
                var exportFiled = [];
                $("#stockinorder_exportPurStorageInfoForm input[type=checkbox]:checked").each(function () {
                    exportFiled.push($(this).val());
                });
                var data = getSearchData();
                data.idList = idList.join(',')
                data.exportFiled = exportFiled.join(",");
                var confirmindex = layer.confirm('确认导出当前搜索条件下的入库单？', {btn: ['确认', '取消']}, function () {
                    submitForm(data, ctx + '/purOrderStorage/exportPurOrderStorageInfo.html', "_blank")
                    layer.close(outerIndex);
                    layer.close(confirmindex);
                }, function () {
                    layer.close(confirmindex);
                })
            }
        })
    });
    //查询入库单列表表单参数构造
    function getSearchData() {
        $('#stockinorder_orderNumber').select();
        var data = serializeObject($('#stockinForm'));
        data.supplierName = $('#stockinorder_searchSupplier_input').val();
        data.processStatus = stockinorder_processStatus;
        var warehouseList = [];
        $("#stockinwarehouseList").children().each(function () {
            var warehouseId = $(this).val();
            if (warehouseId != null && warehouseId != '') {
                warehouseList.push(warehouseId);
            }
        });
        data.warehouseList = warehouseList.join(",");//授权仓库集合
        if (data.orderNumber != "") {
            if(data.orderType=="0"){
                data.storageNumberList=data.orderNumber;
            }else  if(data.orderType=="1"){
                data.billNumberList=data.orderNumber;
            }else  if(data.orderType=="2"){
                data.aliNumberList=data.orderNumber;
            }
            else  if(data.orderType=="3"){
                data.deliveryNumberList=data.orderNumber;
            }
        }
        // 装车时间和是否装车的筛选条件；都只在“未审核“页签展示
        if (data.timerange != "") {
            if (data.timeType == "0") {
                data.createTimeStart = data.timerange.split(' - ')[0] + ' 00:00:00';
                data.createTimeEnd = data.timerange.split(' - ')[1] + ' 23:59:59';
            } else if(data.timeType == "1") {
                data.auditTimeStart = data.timerange.split(' - ')[0] + ' 00:00:00';
                data.auditTimeEnd = data.timerange.split(' - ')[1] + ' 23:59:59';
            }else if(data.timeType == "2"){
                data.loadingTimeStart = data.timerange.split(' - ')[0] + ' 00:00:00';
                data.loadingTimeEnd = data.timerange.split(' - ')[1] + ' 23:59:59';
            }
        }
        if( data.processStatus != 0){
            delete data.isLoading
        }
        data.orderBy="pstorage.create_time desc";
        if(data.orgId !=null && data.orgId !=''){ //选择了部门，没有选人员
            if(data.buyerList == null || data.buyerList ==''){
                data.buyerList=$("#stockin_buyerList").attr("user_ids");
            }
        }
        return data;
    };
    /**修改采购入库单**/
    function stockinorder_update_fun(data,itemdata,curStorageNumber){
        if(stockinorder_addOrUpdateParamValidate(data,itemdata)){ //校验参数
            loading.show();
            $.ajax({
                url: ctx + '/purOrderStorage/updateOnePurOrderStorage.html',
                dataType: 'json',
                type: 'POST',
                data: data,
                success: function (returnData) {
                    loading.hide();
                    if (returnData.code == "0000") {
                        layer.closeAll();
                        if(curStorageNumber==null||curStorageNumber==''){
                            layer.msg(returnData.msg, {icon: 1});
                            tablerender(getSearchData());
                        }else{
                            var storageNumbers = [];//多个入库单号
                            storageNumbers.push(curStorageNumber);
                            checkstockinorder(storageNumbers);
                        }
                    }else {
                        layer.msg(returnData.msg,{icon:2});
                    }
                },
                error: function (returnData) {
                    layer.msg(returnData.msg,{icon:2});
                }
            })
            return false;
        }
    };
    // 作废入库单
    function abondonstockinorder(stockinNo) {
        loading.show();
        $.ajax({
            url: ctx + '/purOrderStorage/deletePurOrderStorageByStorageNumber.html',
            dataType: 'json',
            data: {"storageNumbers": JSON.stringify(stockinNo)},
            success: function (returnData) {
                loading.hide();
                if (returnData.code === "0000") {
                    layer.msg(returnData.msg,{icon:1});
                    tablerender(getSearchData());
                } else {
                    layer.msg(returnData.msg,{icon:2});
                }
            },
            error: function (returnData) {
                layer.msg(returnData.msg,{icon:2});
            }
        })
    };
    /**
     * 扫描装车提交
     */
    function stockinorder_scanload_fun(storageNumber){
        loading.show();
        $.ajax({
            url: ctx + '/scanStorageService/stockInorderScanLoading.html',
            dataType: 'json',
            type: 'post',
            data: {"storageNumber": storageNumber, "channel": "storage"},
            success: function(returnData) {
                loading.hide();
                if (returnData.code == "0000") {
                    layer.closeAll();
                    layer.msg(returnData.msg, { icon: 1 });
                } else {
                    layer.msg(returnData.msg, { icon: 2 });
                }
            },
            error: function(returnData) {
                layer.msg(returnData.msg, { icon: 2 });
            }
        });
    };
    //审核入库单
    function checkstockinorder(stockinNo) {
        loading.show();
        $.ajax({
            url: ctx + '/purOrderStorage/auditPurOrderStorageByStorageNumber.html',
            dataType: 'json',
            type:'post',
            data: {"storageNumbers": JSON.stringify(stockinNo)},
            success: function (returnData) {
                loading.hide();
                if (returnData.code === "0000") {
                    layer.closeAll();
                    layer.msg(returnData.msg,{icon:1});
                    tablerender(getSearchData());
                } else {
                    layer.msg(returnData.msg,{icon:2});
                }
            },
            error: function (retuenData) {
                layer.msg(returnData.msg,{icon:2});
            }
        })
    };

    //下拉框赋值选中
    function selected(select, value) { //select的name值
        var $options = $('select[name="' + select + '"]').find('option');
        $options.each(function (index, item) {
            if ($(item).val() == value) {
                $(this).attr('selected', true);
            }
        });
        layui.form.render();
    };
    /**
     * 1688跳转
     */
    function routerTo() {
        var span = $(this)
        var id = span.find('a').text()
        if (!id) {
            return;
        }
        span.attr('data-ifExcuteClick', 1)
        // 设定时器
        var index = window.setTimeout(function () {
            var ifExcuteClick = span.attr('data-ifExcuteClick')
            if (ifExcuteClick == '1') {
                var routerUrl = span.attr('data-routUrl');
                window.open(routerUrl.replace('{data}', id));
            }
            span.removeAttr('data-ifExcuteClick')
        }, 300)
    };

    /**
     * 获取当前月份
     */
    function getLatestMonth() {
        var data = {};
        data.createTimeEnd = Format(new Date(), 'yyyy-MM-dd');
        data.createTimeStart = Format((new Date()).setMonth(new Date().getMonth() - 1), 'yyyy-MM-dd');
        data.processStatus = "0";
        return data;
    };

    /***
     * 打印入库单sku标签
     * @param array
     */
    function stockinorder_printSkuLabel(array){
        var printArray = [];
        for (var x in array) {
            var obj = array[x];
            var detailDtos = obj.detailDtos;
            for (var y in detailDtos) {
                var product = detailDtos[y];
                var formData = {};
                formData.storageNumber = obj.storageNumber;
                formData.prodSSku = product.prodSSku;
                formData.stockLocation = product.stockLocation;
                formData.releateSkuStockLocation = product.releateSkuStockLocation;
                formData.title = product.title;
                formData.storageNum=product.storageNum;
                formData.printNum = scantostockin_getActPrintNum_fun(product.storageNum);//打印数量数量
                formData.skuNum = formData.storageNum;
                formData.unit = product.unit;
                formData.inPackType=product.inPackType;//入库包装类型
                formData.packDesc=product.packDesc;//包装备注
                //采购入库单打印标签也需要打印入库要求
                formData.storageRequirements=product.storageRequirements;//入库要求
                formData.alonePack=product.alonePack;//独立包装
                formData.noAlonePackDesc=product.noAlonePackDesc;//特殊包装
                formData.specialPack=product.specialPack;//特殊包装备注
                formData.specialPackDesc=product.specialPackDesc;//是否质检
                //refactor:商品标签打印 名称+款式
                if (product.style != null && product.style != '') {
                    formData.title = formData.title + "(" + product.style + ")";
                }
                if(obj.markCrash){//标记紧急
                    formData.storageNumberStr= formData.storageNumber+"    缺货紧急";
                }
                formData.printType = 2;//打印入库单标签
                formData.printerName="6515"; //调用的打印机名称
                formData.isNew = obj.isNew;
                printArray.push(formData);
            }
        }
        epeanPrint_plugin_fun(2,printArray);
    };
});




