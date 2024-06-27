var outpagedata = {};
layui.use(['admin', 'form', 'table', 'layer', 'laydate', 'tableMerge', 'formSelects', 'element','laytpl', 'upload'], function() {
    var admin = layui.admin,
        form = layui.form,
        table = layui.table,
        layer = layui.layer,
        formSelects = layui.formSelects,
        element = layui.element,
        laytpl = layui.laytpl,
        upload = layui.upload,
        laydate = layui.laydate;
    form.render();

    $("#reststockout_timerange_input").val(getLatestMonth().createTimeStart + ' - ' + getLatestMonth().createTimeEnd)
    //日期范围
    laydate.render({
        elem: '#reststockout_timerange_input',
        range: true
    });
    var reststockout_processStatus = 0; //当前流程状态
    var currentPId;
    var currentUserId;
    fillSelect();
    // 设置楼栋楼层与仓库的联动
    form.on('select(reststockout_warehouseId)', function(data) {
        var value = data.value; // 获取选中的值
        render_order_build_floor("#reststockout_search_form",value)
      });
    //导入功能
    function reststockoutImport(aDom){
        $('#reststockout_addItem_import_input').on('change', function() {
            var wareHouseId = (aDom).find('select[name=storeId]').val();
            var files = $(this)[0].files
            if (files.length == 0) {
                return
            }
            // 校验文件类型
            var fileName = files[0].name
            var seat = fileName.lastIndexOf(".");
            var extension = fileName.substring(seat).toLowerCase();
            if (extension != '.xlsx' && extension != '.xls') {
                $('#reststockout_addItem_import_input').val('');
                layer.msg('请传入后缀为.xlsx或者.xls 的Excel文件')
                return
            }
            var formData = new FormData();
            formData.append("file", files[0]);
            formData.append("storeId", wareHouseId);
            layer.confirm('确认导入这个出库单文件吗?', {
                btn: ['确认', '取消'] ,
                yes: function(index) {
                    $.ajax({
                        url: ctx +'/purOtherStorageOut/importSkuListAndBackInfo.html',
                        type: 'post',
                        // async : false,
                        data: formData,
                        // 告诉jQuery不要去处理发送的数据
                        processData: false,
                        // 告诉jQuery不要去设置Content-Type请求头
                        contentType: false,
                        beforeSend: function(){
                            loading.show();
                        },
                        dataType: 'json',
                        success: function(res) {
                            loading.hide()
                            // 清空 excel
                            $('#reststockout_addItem_import_input').val('');
                            if (res.code == '0000') {
                                var formTemplate = reststockout_productsDetailTpl.innerHTML;
                                var formDiv= document.getElementById('reststockout_productsDetail');
                                laytpl(formTemplate).render(res.data, function(html){
                                    formDiv.innerHTML = html;
                                    imageLazyload();
                                    reststockoutInputChange(); //输入生成总价
                                    // reststockoutCount();
                                    layer.close(index);
                                });
                            } else {
                                layer.alert(res.msg,{ icon: 7 ,time:5000})
                            }
                        },
                        error: function() {
                            loading.hide()
                            $('#reststockout_addItem_import_input').val('');
                        }
                    });
                },
                btn2: function(index) {
                    layer.close(index)
                }
            });
        });
    }
    //添加商品功能
    function reststockoutAddProduct(storeId){
        layer.open({
            type: 1,
            title: "添加商品",
            area: ["80%", '70%'],
            shadeClose: false,
            btn: ['保存', '关闭'],
            content: $("#layer_additem").html(),
            success: function(index, layero) {
                //搜索前非空判断
                $('#reststockout_layer_searchItem_btn').click(function() {
                    var sku = $('#layer_sku').val();
                    if (sku == null || $.trim(sku) == "") {
                        layer.msg('请输入商品sku再查询', { icon: 0 });
                        return false;
                    }
                    getItemlist(sku, storeId);
                    return false;
                });
                //回车搜索
                $('#layer_sku').on('keyup', function(e){
                    e.preventDefault();
                    e.stopPropagation();
                    if(e.keyCode == 13){
                        $('#reststockout_layer_searchItem_btn').trigger('click');
                    }
                });
            },
            yes: function(index, layero) {
                $('#layerwarehouseList').attr('disabled', 'disabled');
                var checkStatus = table.checkStatus('layer_itemtable');
                var checkdata = checkStatus.data;
                if(!checkdata.length){
                    layer.msg('请勾选要添加的商品数据', {icon:7});
                    return false;
                }
                if(checkdata.length > 1){
                  layer.msg('一次只能添加一个SKU', {icon:7});
                  return false;
                }
                var formTemplate = reststockout_productsDetailTpl.innerHTML;
                var formDiv= $('#reststockout_productsDetail');
                var existProd = [];
                for (var item of checkdata) {
                    if (formDiv.find('tr[data-index="'+item.prodSId+'"]').length == 0) {
                        //如果不存在，加一行
                        laytpl(formTemplate).render([item], function(html){
                            formDiv.append(html);
                            reststockoutInputChange();
                            // reststockoutCount();
                            imageLazyload();
                        });
                    }else{
                        existProd.push(item.prodSSku)
                    }
                }
                if(existProd.length>0){
                    layer.msg(`商品${existProd.join(',')}已存在`,{icon:2})
                }
                layer.close(index);
            }
        });
    }
    //监听input输入
    function reststockoutInputChange(){
        $('#reststockout_productsDetail').on('input','[name=outNum]', function(){
            var $thisTr = $(this).parents('tr');
            var $thisPrice = Number($thisTr.find('td[data-field="buyerPrice"]').text()== '' ? 0: $thisTr.find('td[data-field="buyerPrice"]').text());
            var $thisNumber = Number($(this).val());
            var $thisTotal = $thisTr.find('td[data-field="storageOutMoney"]');
            $thisTotal.text($thisPrice * $thisNumber);
        });
    }
    //清空批次号-ztt2024312
    $('#reststockout_cleanBatchNum').on('click', function(){
      let checkData = table.checkStatus('reststockout_dataTable').data;
      if(checkData.length == 0){
        return layer.msg('请先选择数据', {icon: 7});
      }
      let stockOutNumberArr = checkData.map(item => item.stockOutNumber);
      layer.confirm(`请确认对勾选的${stockOutNumberArr.length}笔出库单清除批次号吗?`, {icon: 3, title:'提示'}, function(index){
        layer.close(index);
        commonReturnPromise({
          url: '/lms/purOtherStorageOut/clearPickBatchNumber.html',
          type: 'post',
          params: {
            otherStorageOutNumberList: stockOutNumberArr.join(',')
          }
        },false).then(res => {
          layui.admin.batchResultObjAlert("驳回结果:", res, function () {
            $('#restoutSearch').trigger('click');
          });
        });
      });
      
    });
    //计数功能
    function reststockoutCount(){
        //总计数
        $('#reststockout_allCount').on('click', function(){
            var $tbody = $('#reststockout_productsDetail');
            var $trs = $tbody.find('tr');
            $('#prodSku_btn').text(`数量:${$trs.length}`);//商品sku数量
            var outCount = 0; //出库数量
            var moneyCount = 0; //出库金额
            for(var i=0; i<$trs.length; i++){
                var item = $trs[i];
                var $numVal = $(item).find('td[data-field="outNum"] input').val();//input的值
                var $moneyVal = $(item).find('td[data-field=storageOutMoney]').text();//金额的值
                outCount += Number($numVal);
                moneyCount += Number($moneyVal);
            }
            $('#outNumber_btn').text(`总计:${outCount}`);//出库数量
            $('#outMoney_btn').text(`总额:${moneyCount.toFixed(4)}`);//出库金额
        })
    }
    //表格出库总金额统计
    function outMoneyTotalHandle(data){
        if (data) {
            $('#outMoneyTotal_val').text(`总额(￥):${data.totalAmountNumber || 0}`); //总金额
            $('#outAllTotal_val').text(`总数:${data.totalOutNumber || 0}`); //出库总数量
        }
    }

    //ztt20240228-批量上传
    upload.render({
      elem: '#reststockout_batchuploadExcel', //绑定元素
      url: `${ctx}/purOtherStorageOut/importSkuListAndBackInfo.html`, //上传接口
      accept: 'file', //允许上传的文件类型
      exts: 'xlsx',
      before: function(){
        loading.show();
      },
      done: function(res) {
          loading.hide();
          layui.admin.reststockoutBatchResultObjAlert("批量上传结果:", res, function () {
          });
      },
      error: function() {
        loading.hide();
        layer.msg('服务器出现故障!');
      }
    });
    //ztt20240228-生成配货批次
    $('#reststockout_generateBatchNum').on('click', function(){
      commonTableCksSelected('reststockout_dataTable').then(ckedRes => {
        let ids = ckedRes.map(item =>item.id).join(',');
        commonReturnPromise({
          url: '/lms/purOtherStorageOut/batchGenerateBatchNo',
          type: 'post',
          params: {
            ids: ids
          }
        }, false).then(res => {
          layui.admin.batchResultObjAlert("生成配货批次结果:", res, function () {
            $('#restoutSearch').trigger('click');
          });
        })
      }).catch(err => {
        layer.msg(err,{icon:7});
      });
    });
    //ztt20240228-驳回
    $('#reststockout_turnDown').on('click', function(){
      commonTableCksSelected('reststockout_dataTable').then(ckedRes => {
        let ids = ckedRes.map(item =>item.id);
        layer.confirm('确认驳回' + ids.length + '条其他出库单?', function(index) {
          commonReturnPromise({
            url: '/lms/purOtherStorageOut/rejectStorageOutNumberById.html',
            type: 'post',
            params: {
              ids: JSON.stringify(ids)
            }
          }, false).then(res => {
            layer.close(index);
            layui.admin.batchResultObjAlert("驳回结果:", res, function () {
              $('#restoutSearch').trigger('click');
            });
          })
      });
        
      }).catch(err => {
        layer.msg(err,{icon:7});
      });
    });

    // 新增其他出库单
    $('#reststockout_otherlistoutAdd').click(function() {
        var itemdata = [];
        var index = layer.open({
            type: 1,
            title: '新建其它出库单',
            btn: ['提交', '关闭'],
            area: ['80%', '70%'],
            content: $('#otherlistoutAddEdit').html(),
            id: 'otherlistoutAddEditAddId',
            success: function(layero,index) {
                //添加商品
                $('#reststockout_addItem_btn').click(function() {
                    var storeId = $('#layerwarehouseList').val();
                    if (storeId == null || storeId == "") {
                        layer.msg('请先选择仓库', { icon: 0 })
                        return false;
                    }
                    reststockoutAddProduct(storeId);
                });
                // 填充表单下拉框
                for (var i in outpagedata) {
                    appendoption('layer', i, outpagedata[i]);
                }
                form.render('select');
                if(currentUserId){
                    $("#layerdirectorList").val(currentUserId);//复制经办人为默认登录人
                    form.render();
                }
                //导入商品
                // reststockoutImport(layero);
                $('#reststockout_addItem_import').on('click', function(){
                    var warehouseId = $('#layerwarehouseList').val();
                    if(!warehouseId){
                        return layer.msg('请先选择仓库',{icon:7});
                    }
                    $('#reststockout_addItem_import_input').click();
                });
            },
            yes: function(index) {
                itemdata = [];
                var $tbody = $('#reststockout_productsDetail');
                var $trs = $tbody.find('tr');
                for(var i=0; i<$trs.length; i++){
                    var obj = {};
                    var item = $trs[i];
                    obj.prodSId = $.trim($(item).data('index')) || ''; //商品子sku
                    obj.prodSSku = $.trim($(item).find('td[data-field="prodSSku"]').text()) || '';
                    obj.prodPId = $.trim($(item).find('td[data-field="image"] input').val()) || '';
                    obj.prodPSku = $.trim($(item).find('td[data-field="title"] input').val()) || '';
                    obj.buyerPrice = $.trim($(item).find('td[data-field="buyerPrice"]').text()) || 0;
                    obj.title = $.trim($(item).find('td[data-field="title"]').text()) || '';
                    obj.image = $.trim($(item).find('td[data-field="image"]').attr('data-image')) || '';
                    obj.avaiableStock = $.trim($(item).find('td[data-field="avaiableStock"]').text()) || 0;
                    obj.outNum = $.trim($(item).find('td[data-field="outNum"] input').val()) || 0; //出库数量
                    obj.totalmoney = $.trim($(item).find('td[data-field="storageOutMoney"]').text()) || '';
                    itemdata.push(obj);
                }
                var formdata = serializeObject($('#newrestoutForm'));
                if (addOrUpdateParam(formdata, itemdata ,0)) { //参数校验
                    reststockout_addFunc(formdata);
                }else{
                    return false;
                }
            }
        })
    });
    /**批量审核**/
    $('#reststockout_batchcheckrestoutorder').click(function() {
        var checkStatus = table.checkStatus('reststockout_dataTable');
        var otherStorageOutNumbers = [];
        if (checkStatus.data.length > 0) {
            layer.confirm('确定开始批量审核这' + checkStatus.data.length + '条其他出库单?', function(index) {
                for (var i = 0; i < checkStatus.data.length; i++) {
                    otherStorageOutNumbers.push(checkStatus.data[i].stockOutNumber);
                }
                checkrestoutkorder(otherStorageOutNumbers);
                layer.close(index);
            });
        } else {
            layer.msg('请勾选要审核的出库单', { icon: 0 });
        }
    });

    /**
     * 批量作废
     */
    $("#reststockout_abodon_purchaserOtherStorage").click(function (){
        var checkStatus = table.checkStatus('reststockout_dataTable');
        var objData = checkStatus.data;
        if (objData == null || objData.length < 1) {
            layer.msg('请勾选要作废的其他出库单', { icon: 0 });
            return false;
        }
        var stockOutNumbers = [];
        for (var i = 0; i < objData.length; i++) {
            stockOutNumbers.push(objData[i].stockOutNumber);
        }
        if (stockOutNumbers == null || stockOutNumbers.length < 1) {
            layer.msg('请勾选待审核的其他出库单', { icon: 0 });
            return false;
        }
        layer.confirm('确定开始批量作废这' + checkStatus.data.length + '条其他出库单?', function(index) {
            reststockout_invalid_fun(stockOutNumbers);
            layer.close(index);
        });
    });
    // 批量备注
    $('#reststockout_batchupdate_btn').click(function(){
        let checkStatus = table.checkStatus('reststockout_dataTable');
        let checkData=checkStatus.data;
        if(checkData==null||checkData.length==0){
            layer.msg('请先勾选其他出库单再点击！', { icon: 0 });
            return false;
        }
        let idList=checkData.map(item=>item.id);
        layer.open({
            title: '批量备注',
            btn: ['确定', '取消'],
            content: $("#reststockout_batchUpdateTpl").html(),
            area: ['35%', '30%'],
            success: function(layero, index){
            },
            yes: function(index, layero){
                let problemRemark = $('#reststockout_problemRemark_input').val();
                let params={
                    idList,
                    problemRemark,
                    remarkType:1
                }
                batchUpdateRemark(params);
                layer.close(index); //如果设定了yes回调，需进行手工关闭
            }
        });     
            
    })


    /**流程状态选项卡变更函数**/
    element.on('tab(reststockout_data_count_tab)', function(data) {
        reststockout_processStatus = $(this).attr("data-index");
        if(data.index == 0){
          // 已审核状态隐藏批量审核
          $('#reststockout_batchcheckrestoutorder').removeClass('hide')
          $('#reststockout_abodon_purchaserOtherStorage').removeClass('hide')
          $('#reststockout_cleanBatchNum').removeClass('hide')
          $('#reststockout_batchupdate_btn').removeClass('hide');
        }else if(data.index==1){
          $('#reststockout_batchcheckrestoutorder').removeClass('hide')
          $('#reststockout_abodon_purchaserOtherStorage').addClass('hide')
          $('#reststockout_cleanBatchNum').addClass('hide')
          $('#reststockout_batchupdate_btn').removeClass('hide');
        }else if(data.index==2){
            $('#reststockout_batchcheckrestoutorder').addClass('hide')
          $('#reststockout_abodon_purchaserOtherStorage').remov
          $('#reststockout_batchupdate_btn').addClass('hide');
        }else{
            // 已审核状态隐藏批量审核
            $('#reststockout_batchcheckrestoutorder').addClass('hide')
            $('#reststockout_abodon_purchaserOtherStorage').addClass('hide')
            $('#reststockout_cleanBatchNum').addClass('hide')
            $('#reststockout_batchupdate_btn').addClass('hide');
        }
        
        reststokcout_tablerender_fun();
    });
    table.on('tool(reststockout_dataTable)', function(obj) {
        var data = obj.data;
        var layEvent = obj.event;
        var otherStorageOutNumbers = []
        if (layEvent === 'check') { //审核
            var otherStorageOutNumber = data.stockOutNumber;
            layer.confirm('确定开始审核这条出库单?', function(index) {
                otherStorageOutNumbers.push(otherStorageOutNumber);
                checkrestoutkorder(otherStorageOutNumbers);
                layer.close(index);
            });
        } else if (layEvent === 'edit') { //编辑
            var currrentProcess = data.processStatus;
            currentPId = data.id;
            var itemdata = []; //商品信息表格数据
            var otherStorageOutNumber = data.stockOutNumber;
            var index = layer.open({
                type: 1,
                title: "修改其他出库单",
                area: ["80%", '70%'],
                shadeClose: false,
                btn: ['审核','保存', '关闭'],
                content: $("#otherlistoutAddEdit").html(),
                id: 'otherlistoutAddEditEditId',
                success: function(layero,index ) {
                    //保存权限按钮控制
                    if(!$('#reststockout_layerDetailSaveBtn').html().trim()){
                      layero.find('.layui-layer-btn.layui-layer-btn- >.layui-layer-btn1').css('display','none');
                    }
                    if($("#reststockout_batchcheckrestoutorder").length==1){
                        layero.find(".layui-layer-btn0").css({'float':'left'});
                    }else{
                        layero.find(".layui-layer-btn0").css({'display':'none'});
                    }
                    if(currrentProcess != 0){
                        layero.find(".layui-layer-btn0").css({'display':'none'});
                    }
                    if (currrentProcess == 1) {
                        layero.find(".layui-layer-btn1").css({'display':'none'});
                    }
                    layero.find(".layui-row").css({'padding':'0'});
                    form.render('select');
                    var itemtableIns = {};
                    var storeId = '';
                    for (var i in outpagedata) {
                        appendoption('layer', i, outpagedata[i]);
                    }
                    form.render();
                    $.ajax({
                        url: ctx + '/purOtherStorageOut/getPurOtherStorageOutInfoByStorageNumber.html',
                        dataType: 'json',
                        data: { otherStorageOutNumber: otherStorageOutNumber },
                        type: 'post',
                        success: function(returnData) {
                            if (returnData.code == "0000") {
                                for (var i in returnData.data) {
                                    $('#newrestoutForm input[name="' + i + '"]').val(returnData.data[i]);
                                    if (i == 'createTime') {
                                        $('#new_rebackorder input[name="' + i + '"]').val(Format(returnData.data[i], 'yyyy-MM-dd hh:mm:ss'));
                                    } else if (i == 'problemRemark') {
                                        $('#reststockout_problemRemark').val(returnData.data[i]);
                                    }
                                }
                                itemdata = returnData.data.detailDtos;
                                // 构造商品信息表格渲染数据
                                for (var i in returnData.data.detailDtos) {
                                    itemdata[i].totalmoney = returnData.data.detailDtos[i].storageOutMoney;
                                    itemdata[i].otherStorageOutNumber = otherStorageOutNumber; //其它入库单号
                                }
                                $('#layerwarehouseList').attr('disabled', 'disabled');
                                form.render('select');
                                // 内部标签设置
                                storeId = returnData.data.storeId;
                                selected('newrestoutForm', 'outType', returnData.data.outType);
                                selected('newrestoutForm', 'storeId', returnData.data.storeId);
                                selected('newrestoutForm', 'directorId', returnData.data.directorId);
                                // 渲染出库商品信息表格
                                var formTemplate = reststockout_productsDetailTpl.innerHTML;
                                var formDiv= document.getElementById('reststockout_productsDetail');
                                laytpl(formTemplate).render(itemdata, function(html){
                                    formDiv.innerHTML = html;
                                    imageLazyload();
                                    reststockoutInputChange(); //输入生成总价
                                    // reststockoutCount();
                                    var $tbody = $('#reststockout_productsDetail');
                                    var $trs = $tbody.find('tr');
                                    for(var i=0; i<$trs.length; i++){
                                        var item = $trs[i];
                                        $(item).find('td[data-field="delete"] span').hide();//隐藏删除按钮
                                    }
                                    // 计数更新
                                    // $('#reststockout_allCount').click()
                                });
                            } else {
                                layer.msg(returnData.msg, { icon: 2 });
                            }
                        },
                        error: function(returnData) {
                            layer.msg(returnData.msg, { icon: 2 });
                        }
                    });
                    $('#reststockout_addItem_btn').hide();//详情弹框隐藏新建
                    $('#reststockout_addItem_import').hide(); //嫌弃弹框下隐藏导入
                },
                yes: function(index, layero){ //审核
                    if (currrentProcess != 0) {//如果不是未审核状态的不予编辑
                        layer.close(index);
                        return false;
                    }
                    var otherStorageOutNumbers = [];//多个其它出库单号
                    otherStorageOutNumbers.push(otherStorageOutNumber);
                    checkrestoutkorder(otherStorageOutNumbers);//审核
                },
                btn2: function (index) { //保存
                    if (currrentProcess != 0) {
                        layer.close(index);
                        return false;
                    }
                    var $tbody = $('#reststockout_productsDetail');
                    var $trs = $tbody.find('tr');
                    for(var i=0; i<$trs.length; i++){
                        var item = $trs[i];
                        itemdata[i].outNum = $.trim($(item).find('td[data-field="outNum"] input').val()) || 0; //出库数量
                        itemdata[i].totalmoney = $.trim($(item).find('td[data-field="storageOutMoney"]').text()) || '';
                    }
                    var data = serializeObject($('#newrestoutForm'));
                    if (addOrUpdateParam(data, itemdata , 1)) {
                        updatestockout(data);
                    }else{
                        return false;
                    }
                },
                btn3: function () { //关闭
                    reststokcout_tablerender_fun();//重新搜索
                }
            });
        } else if (layEvent === 'abodon') { //作废
            layer.confirm('确定作废这条其它出库单?', function(index) {
                otherStorageOutNumbers.push(data.stockOutNumber);
                reststockout_invalid_fun(otherStorageOutNumbers);
            });
        } else {
            layer.confirm('确定将这条已审核出库单取消审核?', function(index) {
                otherStorageOutNumbers.push(data.stockOutNumber);
                reststockout_transfertoabandon_fun(otherStorageOutNumbers);
            });
        }
    });
    /**参数校验 type :0 -->add ; 1-->update **/
    function addOrUpdateParam(formdata, itemdata ,type) {
        if (formdata.outType == null || formdata.outType == "") {
            layer.msg("请选择出库类型", { icon: 0 });
            return false;
        }
        formdata.storeId = $('#layerwarehouseList').val();
        if (formdata.storeId == null || formdata.storeId == "") {
            layer.msg("请选择仓库", { icon: 0 });
            return false;
        }
        if (formdata.directorId == null || formdata.directorId == "") {
            layer.msg("请选择经办人", { icon: 0 });
            return false;
        }
        if (itemdata == null || itemdata.length < 1) {
            layer.msg("请添加出库商品", { icon: 0 });
            return false;
        }
        for (var i = 0; i < itemdata.length; i++) {
            //add
            if (type === 0) {
                if (itemdata[i].outNum == null || itemdata[i].outNum < 1) {
                    layer.msg(itemdata[i].prodSSku + "出库数量不能小于等于0", {icon: 0});
                    return false;
                }
            }
            //update
            if (type === 1) {
                if (itemdata[i].outNum == null || itemdata[i].outNum < 0) {
                    layer.msg(itemdata[i].prodSSku + "出库数量不能小于0", {icon: 0});
                    return false;
                }
            }
            // if (Number(itemdata[i].outNum) > Number(itemdata[i].avaiableStock)) {
            //     layer.msg(itemdata[i].prodSSku + "出库数量" + Number(itemdata[i].outNum) + "不能大于可用库存" + Number(itemdata[i].avaiableStock), {icon: 0});
            //     return false;
            // }
        }
        formdata.director = outpagedata.directorList[getIndex('value', outpagedata.directorList, formdata.directorId)].name;
        formdata.products = JSON.stringify(itemdata);
        return true;
    };
    //表单查询
    $('#restoutSearch').click(function() {
        reststokcout_tablerender_fun();
    });
    /**导入*/
    $('#reststockout_import_button').click(function() {
        var storeId = $("#restoutwarehouseList").val();
        if (storeId == null || storeId == '') {
            layer.msg("请在查询条件中选择一个仓库", { icon: 0 });
            return false;
        }
        var outType = $("#restoutoutTypeList").val();
        if (outType == null || outType == '') {
            layer.msg("请在查询条件中选择出库类别", {icon: 0});
            return false;
        }
        document.getElementById('reststockout_storageOutList_file').click();
    });

    // 通过导入excel 新增其它出库商品
    $('#reststockout_storageOutList_file').on('change', function() {
        var files = $('#reststockout_storageOutList_file')[0].files
        if (files.length == 0) {
            return;
        }
        // 校验文件类型
        var fileName = files[0].name
        var seat = fileName.lastIndexOf(".");
        var extension = fileName.substring(seat).toLowerCase();
        if (extension != '.xlsx' && extension != 'xls') {
            layer.msg('请传入后缀为.xlsx或者.xls 的Excel文件',{icon:0})
            return
        }
        var formData = new FormData();
        formData.append("file", files[0]);
        formData.append("storeId",$("#restoutwarehouseList").val());
        formData.append("outType",$("#restoutoutTypeList").val());
        layer.confirm('确认导入这个文件进行批量生产其它出库单信息吗', { btn: ['确认', '取消'] },
            function() {
                loading.show()
                $.ajax({
                    url: ctx + '/purOtherStorageOut/importPurOtherStorageOut.html',
                    type: 'post',
                    data: formData,
                    processData: false,
                    contentType: false,
                    success: function(returnData) {
                        loading.hide()
                        $('#reststockout_storageOutList_file').val('')
                        if (returnData.code === '0000') {
                            layer.msg(returnData.msg,{icon:1});
                            reststokcout_tablerender_fun();
                        } else {
                            layer.open({
                                title: '错误提示'
                                ,content: returnData.msg
                            });
                        }
                    },
                    error: function() {
                        loading.hide()
                        $('#reststockout_storageOutList_file').val('')
                    }
                });
            },
            function() {
                $('#reststockout_storageOutList_file').val('');
                layer.closeAll()
            }
        )
    });

    //提交新建出库单
    function reststockout_addFunc(data) {
        loading.show();
        $.ajax({
            url: ctx + "/purOtherStorageOut/addOnePurOtherStorageOut.html",
            type: 'POST',
            dataType: 'json',
            data: data,
            success: function(returnData) {
                loading.hide();
                if (returnData.code == "0000") {
                    $('#resoutno').val(returnData.data.otherStorageOutNumbers);
                    layer.msg(returnData.msg, { icon: 1 });
                    reststokcout_tablerender_fun();
                    layer.closeAll();
                } else {
                    layer.msg(returnData.msg, { icon: 0 });
                }
            },
            complete: function(XMLHttpRequest, textStatus) {
                loading.hide();
            },
        });
    };
    //提交修改出库单
    function updatestockout(data) {
        $.ajax({
            url: ctx + '/purOtherStorageOut/updateOnePurOtherStorageOut.html',
            dataType: 'json',
            type: 'POST',
            data: data,
            beforeSend: function(){
                loading.show();
            },
            success: function(returnData) {
                loading.hide();
                if (returnData.code == "0000") {
                    layer.closeAll();
                    layer.msg(returnData.msg, { icon: 1 });
                    reststokcout_tablerender_fun();
                } else {
                    layer.msg(returnData.msg, { icon: 2 });
                }
            },
            error: function(returnData) {
                loading.hide();
                layer.msg(returnData.msg, { icon: 2 });
            }
        })
    };
    //绘制其他出库单列表表格
    function reststokcout_tablerender_fun() {
        let edit_text=''
        if(reststockout_processStatus==0||reststockout_processStatus==4){
            edit_text='text'
        }
        layui.table.render({
            elem: "#reststockout_dataTable",
            method: "post",
            url: ctx + '/purOtherStorageOut/searchPurOtherStorageOutByDto.html',
            id: 'reststockout_dataTable',
            where: restgetSearchData(),
            height: 'full-255',
            cols: [
                [
                    { type: "checkbox", width: 30,  field: 'checkboxcol' },
                    { title: "单号", field: 'stockOutNumber', width: '11%', templet: '#tpl_restoutorderNo' },
                    { title: "SKU", field: 'prodSSku',  templet: '<div><div style="text-align:left;"><div>出库类别: {{d.outTypeName}}</div><div>sku:{{d.detailDtos[0].prodSSku}}</div><div>库位:{{d.detailDtos[0].stockLocation||""}}</div><div>{{d.warehouseName}}</div></div></div>' },
                    { title: "商品名称",width:'15%', templet: '<div><div style="text-align:left;">{{d.detailDtos[0].title}}</div></div>' },
                    { title: "图片", field: 'image', templet: '#reststockout_imageTpl' },
                    { title: `总数量<font color="red" id="outAllTotal_val">总数:0</font><i class="layui-icon layui-icon-about ml3" lay-tips="统计所有页"></i>`, field: 'totalStorageOutNum',  width: 170},
                    { title: `总金额<font color="red" id="outMoneyTotal_val">总额(￥):0</font><i class="layui-icon layui-icon-about ml3" lay-tips="统计所有页"></i>`, field: 'totalStorageOutMoney', width:170 },
                    { title: "人员", field: 'creator', templet: '#restout_tpl_creator', width: '6%', },
                    { title: "时间", field: 'createTime',  width: '10%',  templet: '#restout_tpl_createTime' },
                    { title: "备注", field: 'problemRemark',edit:`${edit_text}`},
                    { title: "操作", toolbar: '#reststockout_tpl_option', width: '4%', },
                ]
            ],
            page: true,
            limits: [100, 500, 1000, 2000],
            created: function(res) {
                if (res.code == "0000") {
                   // res.data = disassembledata(res.data);
                }
            },
            done: function(res) { //包含表格单元格合并以及工具栏事件(审核，修改，作废);
                imageLazyload();
                outMoneyTotalHandle(res.extra);
                $('#reststockout_data_count_tab ul').find('.num').each(function() {
                    if ($(this).attr('data-index') == reststockout_processStatus) {
                        $(this).html(res.count);
                    } else {
                        $(this).html('点击显示');
                    }
                });
                var msg=res.msg.split("&");
                $("#reststockout_data_count_span0").html(msg[0]);//未审核
                $("#reststockout_data_count_span1").html(msg[3]);//已审核
                $("#reststockout_data_count_span5").html(msg[2]);//仓库缺货
                $("#reststockout_data_count_span4").html(msg[1]);//已配货
                $("#reststockout_data_count_span3").html(msg[4]);//已作废
                // 给1688单号上添加单击 跳转页面事件
                setEventByselector('#reststockout_dataTable', '.clcikRoutTo', 'click', routerTo);
                imageLazyloadAll(); //懒加载
                layui.tableMerge.render(this); //合并列单元格，根据merge：""相等进行分组合并
                // 备注列回车保存数据
                // 监听单元格编辑事件
                table.on('edit(reststockout_dataTable)', function(obj) {
                    var data = obj.data; // 当前行的数据
                    let params={
                        idList:[data.id],
                        problemRemark:obj.value,
                        remarkType:0//remarkType:0覆盖，1追加
                    }
                    updateRemark(params);
                });
            },
            limit: 100,
        });
    };
    // 编辑备注，单独覆盖
    function updateRemark(params){
        commonReturnPromise({
            type: 'post',
            url:ctx+ '/purOtherStorageOut/updateRemark',
            params:JSON.stringify(params),
            contentType: 'application/json',
        }).then(result => {
           layer.msg('操作成功!',{icon:1})
        }).catch(function(err){
            layer.msg(err, {icon:2});
        })
    }
    // 编辑备注，批量追加
    function batchUpdateRemark(params){
        commonReturnPromise({
            type: 'post',
            url:ctx+ '/purOtherStorageOut/updateRemark',
            params:JSON.stringify(params),
            contentType: 'application/json',
        }).then(result => {
           layer.msg('批量操作成功!',{icon:1})
           $('#restoutSearch').trigger('click');
        }).catch(function(err){
            layer.msg(err, {icon:2});
        })
    }
    // 已审核订单转作废
    function reststockout_transfertoabandon_fun(otherStorageoutNumbers) {
        loading.show();
        $.ajax({
            url: ctx + '/purOtherStorageOut/cancelAuditPurOtherStorageOutByStorageNumber.html',
            type: "post",
            dataType: 'json',
            data: { "otherStorageOutNumbers": otherStorageoutNumbers },
            success: function(returnData) {
                loading.hide();
                if (returnData.code === "0000") {
                    layer.msg(returnData.msg, { icon: 1 });
                    reststokcout_tablerender_fun();
                } else {
                    layer.msg(returnData.msg, { icon: 2 });
                }
            },
            error: function(returnData) {
                loading.hide();
                layer.msg(returnData.msg, { icon: 2 });
            }
        });
    };
    // 作废出库单
    function reststockout_invalid_fun(otherStorageoutNumbers) {
        $.ajax({
            url: ctx + '/purOtherStorageOut/deletePurOtherStorageByStorageOutNumber.html',
            dataType: 'json',
            type: "post",
            data: { "otherStorageOutNumbers": JSON.stringify(otherStorageoutNumbers) },
            beforeSend: function(){
              loading.show();
            },
            success: function(returnData) {
                loading.hide();
                // if (returnData.code === "0000") {
                //     layer.msg(returnData.msg, { icon: 1 });
                //     reststokcout_tablerender_fun();
                // } else {
                //     layer.msg(returnData.msg, { icon: 2 });
                // }
                layui.admin.batchResultObjAlert("批量作废结果:", returnData, function () {
                  reststokcout_tablerender_fun();
                });
            },
            error: function(returnData) {
                loading.hide();
                layer.msg(returnData.msg, { icon: 2 });
            }
        })
    };
    //审核出库单
    function checkrestoutkorder(otherStorageOutNumbers) {
        loading.show();
        $.ajax({
            url: ctx + '/purOtherStorageOut/auditPurOtherStorageOutByStorageNumber.html',
            dataType: 'json',
            type: 'post',
            data: { otherStorageOutNumberList : otherStorageOutNumbers.join(',') },
            success: function(returnData) {
                loading.hide();
                // if (returnData.code === "0000") {
                //     layer.closeAll();
                //     layer.msg(returnData.msg, { icon: 1 });
                //     reststokcout_tablerender_fun();
                // } else {
                //     layer.msg(returnData.msg, { icon: 2 });
                // }
                layui.admin.batchResultObjAlert("批量审核结果:", returnData, function () {
                });
                $('#restoutSearch').trigger('click');
            },
            error: function(returnData) {
                layer.msg(returnData.msg, { icon: 2 });
            }
        })
    };
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
                          if(i != 'createBatchNumberList'){
                            appendoption('restout', i, returnData.data[i]); //遍历数据生成option填到相应select
                          }
                        }
                    }
                    //渲染创建批次号
                    commonRenderSelect('restoutcreateBatchNumberList', returnData.data['createBatchNumberList'] || []).then(()=>{
                      formSelects.render('restoutcreateBatchNumberList');
                    });

                    outpagedata.outTypeList = returnData.data.outTypeList;
                    outpagedata.warehouseList = returnData.data.warehouseList;
                    outpagedata.directorList = returnData.data.directorList;
                    currentUserId=returnData.data.currentUserId;//当前登录用户id
                    layui.form.render('select');
                    console.log(outpagedata);
                    reststokcout_tablerender_fun(); //初始化记载最近一个月未审核数据
                }
            }
        });
    };
    /***
     * 切换详情，日志选项卡
     */
    element.on('tab(reststockout_detail_tab_filter)', function(data) {
        var isLog = $(this).attr("isLog");
        if (isLog == 1) {
            table.render({
                elem: "#reststockout_logTab",
                id: "reststockout_logTab",
                method: 'post',
                url: ctx + "/purOtherStorageOut/selectPurOtherStorageOutLogByPId.html",
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
    // 导出其它出库单
    $("#reststockout_exportOtherStorageOutBtn").click(function() {
        var outerIndex = layer.open({
            title: '导出其它出库单',
            type: 1, //不加该属性,就会出现[object Object]
            area: ['1000px', '600px'],
            btn: ['确定', '关闭'],
            content: $('#reststockout_exportOtherStorageOutPop').html(),
            success: function() {
                form.on('checkbox(reststockout_exportOtherStorageOutInfo_selectAll)', function(data) {
                    var checked = data.elem.checked
                    $('#reststockout_exportOtherStorageOutInfoForm input[type=checkbox]:enabled').prop('checked', checked)
                    form.render('checkbox')
                })
                form.render('checkbox')
            },
            yes: function() {
                var selectedData = table.checkStatus('reststockout_dataTable').data;
                var idList = [];
                for (var i = 0; i < selectedData.length; i++) {
                    idList.push(selectedData[i].id)
                }
                var exportFiled = [];
                $("#reststockout_exportOtherStorageOutInfoForm input[type=checkbox]:checked").each(function() {
                    exportFiled.push($(this).val());
                });
                var processStatus = $('#restoutTab ul .layui-this').attr('data-index');
                var data = restgetSearchData(processStatus);
                data.idList = idList.join(',')
                data.exportFiled = exportFiled.join(",");
                var confirmindex = layer.confirm('确认导出当前搜索条件下的其它出库单？', { btn: ['确认', '取消'] }, function() {
                    submitForm(data, ctx + '/purOtherStorageOut/exportOtherOrderStorageOutInfo.html', "_blank")
                    layer.close(outerIndex);
                    layer.close(confirmindex);
                }, function() {
                    layer.close(confirmindex);
                })
            }
        })
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
    };
    //查询出库单列表表单参数构造
    function restgetSearchData() {
        var data = serializeObject($('#reststockout_search_form'));
        data.processStatus = reststockout_processStatus;
        var warehouseList = [];
        $("#restoutwarehouseList").children().each(function () {
            var warehouseId = $(this).val();
            if (warehouseId != null && warehouseId != '') {
                warehouseList.push(warehouseId);
            }
        });
        data.warehouseList = warehouseList.join(",");//授权仓库集合
        var timerange = data.reststockout_timerange_input;
        if (timerange != null && timerange != '') {
            if (data.timeType == 0) {
                data.createTimeStart = timerange.split(' - ')[0] + ' 00:00:00';
                data.createTimeEnd = timerange.split(' - ')[1] + ' 23:59:59';
            } else {
                data.auditTimeStart = timerange.split(' - ')[0] + ' 00:00:00';
                data.auditTimeEnd = timerange.split(' - ')[1] + ' 23:59:59';
            }
        }
        // data.createBatchNumberList = formSelects.value('restoutcreateBatchNumberList', 'nameStr');
        return data;
    };
    //根据商品SKU查询商品渲染商品表格
    function getItemlist(prodSSku, storeId) {
        table.render({
            elem: "#layer_itemtable",
            method: "post",
            url: ctx + "/purOtherStorageOut/getOtherStorageOutProdSInfoBySku.html",
            where: { prodSSku: prodSSku, storeId: storeId },
            id: 'layer_itemtable',
            cols: [
                [
                    { type: 'checkbox' },
                    { title: "图片", field: 'image', templet: '#rebackorder_imageTpl' },
                    { title: "商品SKU", field: 'prodSSku' },
                    { title: "商品名称", field: 'title' },
                    { title: "可用库存", field: 'avaiableStock' },
                    { title: "含税单价(￥)", field: 'buyerPrice' },
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
    };
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
        $options.each(function(index, item) {
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
});

layui.define(function(exports) {
        var $ = layui.$,
        layer = layui.layer,
        admin = layui.admin;
    admin.reststockoutBatchResultObjAlert = function(msgPrefix,batchResult, callback) {

        let msg = msgPrefix+"提交"+batchResult.totalNum+"条，成功"+batchResult.successNum+"条，失败"+batchResult.failNum+"条";
        let options = {};
        //处理alert图标
        if(batchResult.failNum == 0){
            options.icon = 1;
        }else{
            options.icon = 7;
        }
        if(batchResult.failNum>20){
            options.area = ['900px','100%'];
        }else{
            options.area = ['900px','35%'];
            options.maxHeight =900
        }
        //展示失败信息
        let failResults = batchResult.failResults;
        let failMsgs = [];
        let copy_str='';
        for (let i = 0; i < failResults.length; i++){
            let item = failResults[i];
            if (batchResult.finished != 'undefined') {
                failMsgs.push(`<span>${item}</span>`)
                if(item.includes(':')){
                    if(i==0){
                        copy_str+=item.split(':')[1].split(':')[0];
                    }else{
                        copy_str+=','+item.split(':')[1].split(':')[0];
                    }
                }
            } else {
                if(item['logisErrorMsg'] && item['logisErrorMsg'].length>100){
                    failMsgs.push(`<span data-text='${item['logisErrorMsg']}' onmouseenter="commonTipsShow(this)" onmouseleave="commonTipsHide(this)">${item['logisErrorMsg'].substr(0,100)}......</span>`);
                } else {
                    failMsgs.push(`<span>${item['logisErrorMsg']}</span>`);
                }
            }
        }
        let copy_msg=`<span onclick="layui.admin.onlyCopyTxt('${copy_str}')"class="copy-icon"> 
            <svg t="1710754196184" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2392" width="16" height="16">
            <path d="M768 832q-0.992 54.016-37.504 90.496T640 960H192q-54.016-0.992-90.496-37.504T64 832V384q0.992-54.016 37.504-90.496T192 256v64q-27.008 0.992-44.992 19.008T128 384v448q0.992 27.008 19.008 44.992T192 896h448q27.008-0.992 44.992-19.008T704 832h64zM384 128q-27.008 0.992-44.992 19.008T320 192v448q0.992 27.008 19.008 44.992T384 704h448q27.008-0.992 44.992-19.008T896 640V192q-0.992-27.008-19.008-44.992T832 128H384z m0-64h448q54.016 0.992 90.496 37.504T960 192v448q-0.992 54.016-37.504 90.496T832 768H384q-54.016-0.992-90.496-37.504T256 640V192q0.992-54.016 37.504-90.496T384 64z" p-id="2393" fill="#aaaaaa">
            </path></svg> </span>`
        layer.open({
            title: `提示`,
            content: `<div>
                    <div style='width: 30px;height: 30px;float: left;padding: 10px 10px'>
                        <i class="layui-layer-ico layui-layer-ico7" style='width:100%;height:100%;display: inline-block'></i>
                    </div>
                    <div style='line-height: 2;float: left;padding-top: 15px;'>
                        <span>${msg}${copy_msg}</span>
                        <br/>
                        ${failMsgs.join('<br/>')}
                    </div>
                </div>`,
            btn: ['确认'],
            icon: options.icon,
            type:1,
            area: options.area,
            success: function(layero, index) {
                this.enterEsc = function(event) {
                    if (event.keyCode === 13) {
                        callback();
                        layer.close(index);
                        return false; //阻止系统默认回车事件
                    }
                };
                $(document).on('keydown', this.enterEsc); //监听键盘事件，关闭层
            },
            yes: function (index) {
                callback();
                layer.close(index);
            },
            end: function() {
                $(document).off('keydown', this.enterEsc); //解除键盘关闭事件
                if (onfocus) {
                    onfocus.select()
                }
            }
        });
        // layer.alert(msg + '<br/>' + failResults.join('<br/>'), options, function (index) {
        //     layer.close(index);
        //     callback();
        // });

    }
})