layui.use(['admin', 'form', 'table', 'layer', 'laydate', 'tableMerge', 'formSelects' ,'upload'], function() {
    var admin = layui.admin,
        layer = layui.layer,
        $ = layui.$,
        upload = layui.upload,
        table = layui.table,
        form = layui.form;
    form.render();
    var autoGenerateStorage = false; //是否自动生成采购入库单
    var autoPrint = false; //是否自动打印
    var checkValue = JSON.parse(localStorage.getItem('scantoStorecheckValue') || '[]');
    var outStockObj={};//每个sku对应的缺货数量，如果sku已经存在一个紧急入库单，则不再标记
    var selectOutOfStockOrder = "0";//直邮非AE订单缺货
    var aeOutOfStockOrder = "0"; // ae托管缺货
    var pingOutOfStockOrder = "0"; //平台仓托管缺货
    var osoOrderNumObj=new Map();//仓库一条龙缺货订单数
    var osoSkuNumObj=new Map();//仓库一条龙缺货商品数
    //页面初始化操作-ztt20240130
    $('#scantostockin_auto_generate_div input[type="checkbox"]').each(function(index, item) {
        if (checkValue.indexOf(item.value) > -1) {
            $(item).prop('checked', true)
            if($(item).attr('id') == 'singleOutOfStockInOrderId'){
              $('#aeOutOfStockOrderId').prop('disabled', true);
              $('#platcodeOutOfStockOrderId').prop('disabled', true);
            }else if($(item).attr('id') == 'aeOutOfStockOrderId'){
              $('#singleOutOfStockInOrderId').prop('disabled', true);
              $('#platcodeOutOfStockOrderId').prop('disabled', true);
            }else if($(item).attr('id') == 'platcodeOutOfStockOrderId'){
              $('#aeOutOfStockOrderId').prop('disabled', true);
              $('#singleOutOfStockInOrderId').prop('disabled', true);
            }
        }
    })
    //ztt-点击SKU 弹出对比弹框
    $('#LAY-scantostockin').on('click', '.prodSSkuCheck',function(){
      let sSku = $(this).text();
      if(!sSku){
        return layer.msg('不存在SKU,无法对比', {icon: 7});
      }
      commonReturnPromise({
        url: ctx + "/prodTpl/subSkuCheck.html",
        type: 'post',
        params: {sSku: sSku}
      }).then(res => {
        if(res.length > 0){
          layer.open({
            type: 1,
            title: '子SKU对比',
            content: $('#scantostockin_sunSku_layer').html(),
            id: 'scantostockin_sunSku_layerId',
            shade: 0,
            area: ['80%', '60%'],
            success: function(layero){
              let $ul = layero.find('ul');
              let liStr = '';
              for(let i=0; i< res.length; i++){
                let item= res[i];
                liStr += `<li class="scantostockin-li">
                      <div>${item.sSku}</div>
                      <img width='200px' height='200px' data-original='${tplIVP+item.image}!size=300x300' class="img_show_hide b1 lazy" data-onerror="layui.admin.img_noFind()">
                      </li>`;
              }
              $ul.empty().append(liStr);
              imageLazyload();
              imageLazyloadOrigin();
            }
          })
        }else{
          return layer.msg('无SKU对比详情',{icon:7});
        }
      });
    });
    //ztt20230913 异常处理+入库单
    new dropButton('scantostockin_scan_allErrorBatch');
    //反馈异常
    $('#scantostockin_scan_feedErrorBatch_liBtn').on('click', function(){
      $('#scantostockin_scan_feedErrorBatch_btn').trigger('click');
    });
    //取消异常
    $('#scantostockin_scan_cancelErrorBatch_liBtn').on('click', function(){
      $('#scantostockin_scan_cancelErrorBatch_btn').trigger('click');
    });
    new dropButton('scantostockin_warehouseReceipt');
    //打入库单
    $('#scantostockin_patchprintA4LiBtn').on('click', function(){
      $('#scantostockin_patchprintA4').trigger('click');
    });
    //生成/修改入库单
    $('#scantostockin_generate_storage_liBtn').on('click', function(){
      $('#scantostockin_generate_storage_btn').trigger('click');
    });
    //作废
    $('#scantostockin_delete_storage_liBtn').on('click', function(){
      $('#scantostockin_delete_storage_btn').trigger('click');
    });


    form.render('checkbox');
    //ztt-0206-进入页面获取焦点
    $('#scantostockin_orderNumber').focus();

    $("#scantostockin_auto_generate_div").find(".layui-form-checked").each(function() {
        var val = $(this).prev().val();
        if (val == 0) { //自动生成采购入库单
            autoGenerateStorage = true;
        }
        if (val == 1) {
            autoPrint = true; //自动打印
        }
        if (val == 6) {
            selectOutOfStockOrder = "1";
            aeOutOfStockOrder = "0";
            pingOutOfStockOrder = "0";
        }
        if (val == 7) {
            selectOutOfStockOrder = "0";
            aeOutOfStockOrder = "1";
            pingOutOfStockOrder = "0";
        }
        if(val == 8){
            selectOutOfStockOrder = "0";
            aeOutOfStockOrder = "0";
            pingOutOfStockOrder = "1"; //平台仓托管缺货
        }
    });
    scantostock_fillSelect();
    //页面下拉框枚举类型填充
    function scantostock_fillSelect() {
        $.ajax({
            url: ctx + "/purOrderBase/getPurOtherStoragePageEnum.html",
            type: 'post',
            dataType: 'json',
            success: function(returnData) {
                if (returnData.code == "0000") {
                    var osoOrderNumListObj = returnData.data.warehouseOsoOrderNumList;
                    for (var i in osoOrderNumListObj) {
                        osoOrderNumObj.set(osoOrderNumListObj[i].name, osoOrderNumListObj[i].value);
                    }
                    var osoSkuNumListObj = returnData.data.warehouseOsoSkuNumList;
                    for (var i in osoSkuNumListObj) {
                        osoSkuNumObj.set(osoSkuNumListObj[i].name, osoSkuNumListObj[i].value);
                    }
                    var $li = '<option value="">反馈异常类型</option>';
                    var scanErrorObj = returnData.data.scanErrorTypeList;
                    for (var i in scanErrorObj) {
                        if (scanErrorObj[i]) {
                            $li += '<option value=' + scanErrorObj[i].name + '>' + scanErrorObj[i].name + '</option>';
                        }
                    }
                    $("#scantostockin_scanErrorTypeSel").html($li);
                    layui.form.render('select');
                }
            }
        });
    };
    /**
     * 扫描单号触发回车事件
     */
    $('#scantostockin_orderNumber').keydown(function(e) {
        if (e.keyCode == 13) {
            var orderNumber = $('#scantostockin_orderNumber').val();
            //ztt-0208-赋值隐藏域
            // $('#scantostockin_orderNumberHidden').val(orderNumber);
            // console.log('输出隐藏input的值', $('#scantostockin_orderNumberHidden').val())
            if (orderNumber != "") {
                $("#scantostockin_sku_number_span").html(0);
                scantostockinTable(null, autoGenerateStorage, autoPrint);
                //ztt-0206-增加
                // $('#scantostockin_orderNumber').next().html(`<strong>${orderNumber}</strong>`);
                // $('#scantostockin_orderNumber').val('');
                
                return false;
            } else {
                layer.msg("请填写跟踪号/采购单号/1688单号！", { icon: 0 })
            }
            return false;
        }
    });
    /**sku高亮input输入框**/
    $('#scantostockin_sku_input').keydown(function(e) {
        if (e.keyCode == 13) {
            $(".scantostockin_high_div").css({ "background-color": "white" });
            $(".scantostockin_title_tip_div").css({ "background-color": "white" });
            var sku = $('#scantostockin_sku_input').val();
            if (sku != "") {
                sku = $.trim(sku);
                sku=sku.replace(/，/g ,",");
                var skuArray= sku.split(",");
                for(var index in skuArray){
                    var one = $.trim(skuArray[index]);
                    $(".scantostockin_high_div").each(function() {
                        var title = $(this).html();
                        if (title.indexOf(one) > -1) {
                            $(this).css({ "background-color": "orange" });
                            $(this).parents('tr').find('.layui-icon-ok').trigger('click');
                            $('#scantostockin_sku_input').val('');
                            $('#scantostockin_sku_input').focus();
                        }
                    })
                    // $(".scantostockin_span_" + one).focus();
                    $(".scantostockin_span_" + one).parent().css({ "background-color": "orange" });
                }
            }
            return false;
        }
    });
    /**批量应用入库数量**/
    $("#scantostockin_sku_bacthUpdate_button").click(function() {
        var storageNum = $("#scantostockin_sku_bacthUpdate_input").val();
        if (storageNum != null && storageNum != '') {
            $(".scantostockin_notStorageNum_show").val(storageNum);
        }
    });
    /**生成入库单**/
    var isGnerateButton=false; //手动生成
    /**只生成**/
    $("#scantostockin_generate_storage_btn").click(function () {
        var checkData = table.checkStatus('scantostockin_data_table').data;
        if (checkData == null || checkData.length < 1) {
            layer.msg("请选择记录", {icon: 0});
            return;
        }
        isGnerateButton=true;
        scantostockin_addOnePurOrderStorageFormScan(checkData, false, false); //新建入库单
    });
    /**生成且打印**/
    $("#scantostockin_generate_print_btn").click(function () {
        var checkData = table.checkStatus('scantostockin_data_table').data;
        if (checkData == null || checkData.length < 1) {
            layer.msg("请选择记录", {icon: 0});
            return;
        }
        isGnerateButton=true;
        scantostockin_addOnePurOrderStorageFormScan(checkData, true, false); //新建入库单
    });

    /**
     *
     * 新建入库单
     * @param checkData 选中的入库数据
     * @param printSku 是否打印sku
     * @param isAuditOrder 是否自动审核
     */
    var curGenerateStorageNumbers=[];//本次生成的入库单号
    function scantostockin_addOnePurOrderStorageFormScan(checkData, printSku, isAuditOrder) {
        if (checkData == null || checkData.length < 1) {
            return;
        }
        var storageData = [];
        for (var i in checkData) {
            var obj = checkData[i];
            var storageNumber = obj.storageNumber; //入库单号
            var buyNumber = Number(obj.buyNumber);//采购数
            var inAmount = Number(obj.inAmount);//已入库数
            var notAudit = obj.processStatus == null || (obj.processStatus != '1'); //单子是否未审核
            var sdetailId = obj.detailId || 0;
            var storageNum = $("#scantostockin_storageNum_" + obj.mainOrderId + "_"+sdetailId+"_" + obj.prodSId).val();
            if (storageNum >= 0 && (buyNumber > inAmount) &&  notAudit) { //入库数大于0，并且未完全入库，并且未审核
                var storageObj = {};
                storageObj.prodSSku = obj.prodSSku;
                storageObj.prodSId = obj.prodSId;
                storageObj.prodPSku = obj.prodPSku;
                storageObj.prodPId = obj.prodPId;
                storageObj.buyNumber = obj.buyNumber;
                storageObj.buyerPrice = obj.taxPrice;
                storageObj.storageNum = storageNum;
                storageObj.storageNumber = storageNumber;
                storageObj.mainOrderId = obj.mainOrderId;
                storageObj.mainBillNumber = obj.mainBillNumber;
                storageObj.detailId = obj.detailId;
                storageObj.defectiveNum = obj.defectiveNum;
                storageObj.defectiveRemark = obj.defectiveRemark;
                // 入库单点货类型
                var type = "";
                if (obj.pmarkCrash && selectOutOfStockOrder === '1') {//标记紧急
                    type = "1";
                } else if (obj.pmarkCrash && aeOutOfStockOrder === '1') {
                    type = "5";
                } else if (obj.pmarkCrash && pingOutOfStockOrder === '1') {
                    type = "6";
                } else if (obj.outOfStockNum != null && obj.outOfStockNum > 0) {
                    /**sku有单sku缺货订单**/
                    type = "2";
                } else if (obj.outOfSkuMuliCountNum != null && obj.outOfSkuMuliCountNum > 0) {
                    /**20200114 只要提示缺货的，入库单上面都加  缺  字*/
                    /**sku有多sku缺货订单**/
                    type = "3";
                } else if (obj.curSaleDay != null && obj.curSaleDay <= 3) {
                    /**20200119  可售天数小于等于3的点货标签加个“快”（快卖完了。。的意思）*/
                    type = "4";
                }
                if ("" != type) {
                    storageObj.scanType = type;
                }
                if (isAuditOrder != null && isAuditOrder == true) { //需要自动审核
                    storageObj.outOfStockNum = obj.outOfStockNum; //缺货订单sku数
                }else{
                    if (selectOutOfStockOrder === '1' || pingOutOfStockOrder === '1') {//直邮非AE订单缺货或平台仓订单缺货
                        //取仓库配置的一条龙缺货订单/商品数做判断
                        var osoOrderNum = osoOrderNumObj.get(obj.storeId);
                        var osoSkuNum = osoSkuNumObj.get(obj.storeId);
                        if((osoOrderNum && obj.outOfSingleOrderCountNum != null && obj.outOfSingleOrderCountNum >= osoOrderNum)
                            || (osoSkuNum && obj.outOfStockNum != null && obj.outOfStockNum >= osoSkuNum)){
                            storageObj.outOfOrderSingleNum=outStockObj[storageObj.prodSSku];//缺货单品订单数
                        }
                    }
                    if (aeOutOfStockOrder === '1') {//AE订单缺货
                        if((obj.outOfSingleOrderCountNum != null && obj.outOfSingleOrderCountNum > 0)
                            || (obj.outOfStockNum != null && obj.outOfStockNum > 0)){
                            storageObj.outOfOrderSingleNum=outStockObj[storageObj.prodSSku];//缺货单品订单数
                        }
                    }
                }
                /**如果原来没有入库单或则点击的是手动生成,或则直接转核单**/
                if (storageNumber == null || storageNumber == '' || (isGnerateButton && notAudit) || isAuditOrder) {
                    storageData.push(storageObj);
                }
            }
        }
        if (storageData.length < 1) {
            if(isGnerateButton){
                layer.msg("没有可以入库的商品！", {icon: 0});
                return;
            }else{
                return;
            }
        }
        /**扫描新建入库单**/
        let params = {
            "products": JSON.stringify(storageData),
            "maxStorageId": maxStorageId,
            "selectOutOfStockOrder": selectOutOfStockOrder,
            "aeOutOfStockOrder": aeOutOfStockOrder,
            "pingOutOfStockOrder": pingOutOfStockOrder,
            "scanOrderNumber" : $('#scantostockin_orderNumber').val()
        }
        loading.show();
        $.ajax({
            url: ctx + '/purOrderStorage/addOnePurOrderStorageFormScan.html',
            dataType: 'json',
            type: 'post',
            data: { ...params },
            success: function(returnData) {
                loading.hide();
                if (returnData.code == "0000") {
                    layer.closeAll();
                    layer.msg(returnData.msg, { icon: 1 });
                    for(var i in returnData.data){
                        var curNumber=returnData.data[i].storageNumber;
                        if (curNumber != null && curNumber != '') {
                            curGenerateStorageNumbers.push(curNumber);//本次生成的入库单号
                        }
                    }
                    if(returnData.extra &&returnData.extra.needConfirm){
                        scantostockin_openModel_deliveryNumber(params,printSku)
                    }
                    scantostockinTable(null,false,printSku,maxStorageId);
                } else {
                    if(returnData.extra && returnData.extra.needConfirm){
                        scantostockin_openModel_deliveryNumber(params,printSku)
                    }else{
                        layer.msg(returnData.msg, { icon: 2 });
                    }
                }
            },
            error: function(returnData) {
                layer.msg(returnData.msg, { icon: 2 });
            }
        });
    };
    /**作废入库单**/
    $("#scantostockin_delete_storage_btn").click(function() {
        var array = table.checkStatus('scantostockin_data_table').data;
        if (array == null || array.length < 1) {
            layer.msg("请选择记录", { icon: 0 });
            return;
        }
        var storageNumbers = [];
        for (var i in array) {
            var obj = array[i];
            var storageNumber = obj.storageNumber; //入库单号
            if (storageNumber != null && $.trim(storageNumber) != '') {
                storageNumbers.push(storageNumber);
            }
        }
        if (storageNumbers.length < 1) {
            layer.msg("没有要作废的入库单记录", { icon: 0 });
            return;
        }
        commonReturnPromiseRes({
          url: `/lms/purOrderStorage/getIsLoading?storageNumbers=${storageNumbers.join(',')}`
        }).then(res => {
          if(res.data && res.data.length>0){
            //装车中
            layer.confirm(`入库单${res.data}已执行入库操作,确定作废?`,function(confirmIndex){
              commonReturnPromise({
                url: ctx + '/purOrderStorage/deletePurOrderStorageByStorageNumber.html',
                type: 'post',
                params: {
                  storageNumbers: JSON.stringify(storageNumbers)
                }
              }).then(returnData => {
                layer.msg(returnData, { icon: 1 });
                scantostockinTable();
                layer.close(confirmIndex);
              });
            });
          }else{
              //走原先的逻辑
              layer.confirm('确认作废这' + storageNumbers.length + '条入库单记录', function(confirmIndex) {
                commonReturnPromise({
                  url: ctx + '/purOrderStorage/deletePurOrderStorageByStorageNumber.html',
                  type: 'post',
                  params: {
                    storageNumbers: JSON.stringify(storageNumbers)
                  }
                }).then(returnData => {
                  layer.msg(returnData, { icon: 1 });
                  scantostockinTable();
                  layer.close(confirmIndex);
                });
            });
          }
        });
      
        return;
    });
    /**打印sku标签**/
    $("#scantostockin_print_sku_btn").click(function() {
        var array = table.checkStatus('scantostockin_data_table').data;
        if (array == null || array.length < 1) {
            layer.msg("请选择记录", { icon: 0 });
            return;
        }
        // stockinorder_printorderData(array); //打印sku标签
        //获取打印参数处理
        let printReqData =scanToStockinPrintParams(array);
        //打印传参
        let printResData = commonGetPrintDataByLoopRequest(printReqData);
        Promise.all(printResData).then(res => {
          let printParams = [];
          for(let i=0; i<res.length; i++){
            let item = res[i];
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
        });
    });
    //20230915打印参数处理
    function scanToStockinPrintParams(data){
      //获取到打印数量[1: 入库数,不处理;2:自定义,大于入库数取入库数,否则取输入的值]
      let printNumType = $('#scantostockin_search_from').find('[name=printNum]:checked').val();
      let printReqData = [];
      // console.log('printNumType', printNumType);
      if(printNumType == 2 && $('#scantostockin_print_num_input').val()){
        // console.log('进2', $('#scantostockin_print_num_input').val())
        //获取自定义的打印数量
        let autoPrintNum = Number($('#scantostockin_print_num_input').val().trim() || 0);
        console.log('打印数量', autoPrintNum);
        for(let i=0; i< data.length;i++){
          let item = data[i];
          let obj ={};
          let sdetailId = item.detailId || 0;
          let storageNum = $("#scantostockin_storageNum_" + item.mainOrderId + "_" + sdetailId + "_" + item.prodSId).val() || 1; //库存数量
          if(autoPrintNum > Number(storageNum)){
            obj.printNum = storageNum;
            obj.storageNum = storageNum;
          }else if(autoPrintNum < Number(storageNum)){
            obj.printNum = autoPrintNum;
            obj.storageNum = storageNum;
          }else{
            obj.printNum = storageNum;
            obj.storageNum = storageNum;
          }
          obj.warehouseId = item.storeId;
          obj.prodSId = item.prodSId;
          obj.storageNumber = item.storageNumber || '';
          printReqData.push(obj);
        }
      }else{
        for(let i=0; i< data.length;i++){
          let item = data[i];
          let obj ={};
          let sdetailId = item.detailId || 0;
          // console.log('item', item);
          let storageNum = $("#scantostockin_storageNum_" + item.mainOrderId + "_" + sdetailId + "_" + item.prodSId).val() || 1;
          obj.printNum = storageNum;
          obj.storageNum = storageNum;
          obj.warehouseId = item.storeId;
          obj.prodSId = item.prodSId;
          obj.storageNumber = item.storageNumber || '';
          printReqData.push(obj);
        }
      }
      return printReqData;
    }

    /**
     * 批量反馈异常
     */
    $("#scantostockin_scan_feedErrorBatch_btn").click(function() {
        var array = table.checkStatus('scantostockin_data_table').data;
        if (array == null || array.length < 1) {
            layer.msg("请选择记录", { icon: 0 });
            return;
        }
        stockinorder_scan_feedErrorBatch(array);
    });

    /**
     * 批量反馈异常
     */
    $("#scantostockin_scan_cancelErrorBatch_btn").click(function() {
        var array = table.checkStatus('scantostockin_data_table').data;
        if (array == null || array.length < 1) {
            layer.msg("请选择记录", { icon: 0 });
            return;
        }
        stockinorder_scan_cancelErrorBatch(array);
    });


    function stockinorder_scan_cancelErrorBatch(dataArray) {
        var ajaxData = [];
        for (var i in dataArray) {
            var obj = dataArray[i];
            var data = {
                sku : obj.prodSSku,
                storageNumber:obj.storageNumber
            };
            ajaxData.push(data);
        }

        $.ajax({
            url: ctx + '/purOrderStorage/batchInvalid.html',
            dataType: 'json',
            method:"post",
            contentType:"application/json",
            data: JSON.stringify(ajaxData),
            success: function (returnData) {
                loading.hide();
                if (returnData.code === "0000") {
                    if(returnData.data != null){
                        layer.open({
                            type:1,
                            btn: ['关闭'],
                            content: `<div style="padding: 20px;">${returnData.data}</div>`
                        })
                    }else {
                        layer.msg("取消成功", {icon: 1});
                    }
                } else {
                    layer.msg(returnData.msg, {icon: 2});
                }
            },
            error: function (returnData) {
                layer.msg(returnData.msg, {icon: 2});
            }
        });
    }


    function stockinorder_scan_feedErrorBatch(dataArray) {
        var errorRemark = $("#scantostockin_scanErrorTypeSel").val();
        if (errorRemark == null || errorRemark == '') {
            layer.msg("请选择异常类型", {icon: 0});
            return;
        }
        var storageNumbers = [];
        let skuNameList = [];
        for (var i in dataArray) {
            var obj = dataArray[i];
            storageNumbers.push(obj.storageNumber);
            if (!obj.storageNumber) {
                skuNameList.push(obj.prodSSku)
            }
        }
        if (storageNumbers.length < 1) {
            layer.msg("请选择需要反馈的数据", {icon: 0});
            return;
        }
        let skuStr = skuNameList?.join(',')
        if (storageNumbers.indexOf('') > -1) {
            layer.msg(`所选SKU{${skuStr}}未生成入库单，请检查`, {icon: 2});
            return;
        }
        $.ajax({
            url: ctx + '/purOrderStorage/scanFeedErrorForBatch.html',
            dataType: 'json',
            method:"post",
            data: {"storageNumbers": storageNumbers.toString(), "errorRemark": errorRemark},
            success: function (returnData) {
                loading.hide();
                if (returnData.code === "0000") {
                    layer.msg(returnData.msg, {icon: 1});
                } else {
                    layer.msg(returnData.msg, {icon: 2});
                }
            },
            error: function (returnData) {
                layer.msg(returnData.msg, {icon: 2});
            }
        });
    }

    /**直接转核单**/
    $("#scantostockin_cahnge_audit_btn").click(function() {
        var checkData = table.checkStatus('scantostockin_data_table').data;
        if (checkData == null || checkData.length < 1) {
            layer.msg("请选择记录", { icon: 0 });
            return;
        }
        scantostockin_addOnePurOrderStorageFormScan(checkData, false, true);
    });
    
    // 一条龙审核
    $("#scantostockin_cahnge_process_btn").click(function () {
        var checkData = table.checkStatus('scantostockin_data_table').data;
        if (checkData == null || checkData.length < 1) {
            layer.msg("请选择记录", { icon: 0 });
            return;
        }
        // 获取入库单号
        checkData = checkData.filter(item => {
            return item.processStatus === 0
        });
        let storageNumbers = [];
        if (checkData.length === 0) {
            layer.msg("选择的数据已审核或者没有新建入库单！", { icon: 0 });
            return;
        }
        checkData.forEach(item => {
            storageNumbers.push(item.storageNumber);
        });
        $.ajax({
            url: ctx + '/purOrderStorage/aCoordinatedProcess.html',
            dataType: 'json',
            method: "post",
            data: {
                "selectOutOfStockOrder": selectOutOfStockOrder,
                "aeOutOfStockOrder": aeOutOfStockOrder,
                "pingOutOfStockOrder": pingOutOfStockOrder,
                "storageNumbers": storageNumbers.join(',')
            },
            beforeSend: function () {
                loading.show();
            },
            success: function (returnData) {
                loading.hide();
                if (returnData.code === "0000") {
                    let msg = returnData.audioMsg;
                    if(msg){
                      //播报语音
                      let speechSynthesisUtterance = new SpeechSynthesisUtterance(`${msg}`);
                      speechSynthesisUtterance.rate = 3;
                      speechSynthesis.speak(speechSynthesisUtterance);
                    }
                    let data= returnData.data.detailList || [];
                    let detailMsg = returnData.data.message;
                    let tableStr = `<table class="layui-table"><thead><tr><th>类型</th><th>数量</th></tr></thead><tbody>`;
                    let tbodyStr = '';
                    if(data.length>0){
                      for(let i=0; i<data.length; i++){
                        let item = data[i];
                        let typeStr = item.type == 'AE全托管'? '<font color="red">AE全托管</font>' : `<span>${item.type}</span>`;
                        let quantityStr = item.type == 'AE全托管'? `<font color="red">${item.quantity}</font>` : `<span>${item.quantity}</span>`;
                        let trStr = `<tr>
                          <td>${typeStr}</td>
                          <td>${quantityStr}</td>
                        </tr>`;
                        tbodyStr +=trStr;
                      }
                    }
                    tbodyStr +='</tbody>';
                    tableStr += `${tbodyStr}</table>`;
                    let msgTip = returnData.extra.result ? `<div><font size="4" color="green">审核成功</font></div>`:`<div><font size="4" color="red">审核失败</font></div>`;
                    //弹框展示
                    layer.open({
                      type: 1,
                      title: '一条龙审核',
                      area: ['50%', '50%'],
                      move:false,
                      content: `<div style="padding:20px;"><div>${msgTip}${detailMsg}</div>${tableStr}</div>`,
                    });

                    // layer.msg('审核成功！' + msg, {icon: 1});
                    // getPageData();
                } else {
                    errMsgFn(returnData.msg)
                }
            },
            error: function (returnData) {
                errMsgFn(returnData.msg)
            }
        });
    })

    function getPageData() {
        var orderNumber = $('#scantostockin_orderNumber').val();
        if (orderNumber != "") {
            $("#scantostockin_sku_number_span").html(0);
            scantostockinTable(null, autoGenerateStorage, autoPrint);
        } else {
            layer.msg("请填写跟踪号/采购单号/1688单号！", { icon: 0 })
        }
    };

    // 错误提示
    function errMsgFn(msg) {
        layer.open({
            title: `提示`,
            content: msg,
            btn: ['确认'],
            icon: 7,
            area: ['600px'],
            success: function(layero, index) {
                this.enterEsc = function(event) {
                    if (event.keyCode === 13) {
                        layer.close(index);
                        return false; //阻止系统默认回车事件
                    }
                };
                $(document).on('keydown', this.enterEsc); //监听键盘事件，关闭层
            },
            yes: function (index) {
                layer.close(index);
            },
            end: function() {
                $(document).off('keydown', this.enterEsc); //解除键盘关闭事件
            }
        })
    }
    //打印测试页
    $('#scantostockin_printTestPage').on('click', function(){
      const printArray = [{printOperator: localStorage.getItem("lmsAppUserName")}]
        epeanPrint_plugin_fun(0,printArray);
        return;
    });
    /**打印入库单**/
    $('#scantostockin_patchprintA4').click(function () {
        var checkData = table.checkStatus('scantostockin_data_table').data;
        if (checkData.length < 1) {
            layer.msg('请勾选要打印的入库单',{icon:0})
            return false;
        }
        var storageNumbers=[];
        for(var i in checkData){
            storageNumbers.push(checkData[i].storageNumber);
        }
        window.open(ctx + '/static/html/storageprint.html?storageNumber='+storageNumbers.join(","));
    });
    /**打印**/
    function stockinorder_printorderData(dataArray) {
        if (dataArray == null || dataArray.length < 1) {
            return;
        }
        // console.log('dataArray', dataArray);
        var printArray = [];
        for (var i in dataArray) {
            var obj = dataArray[i];
            var item = {};
            item.storageNumber = obj.storageNumber;
            item.prodSId = obj.prodSId;
            item.mainOrderId = obj.mainOrderId;
            item.detailId = obj.detailId;
            item.storeId = obj.storeId;
            var detailDtos = [];
            var detailItem = {};
            var sdetailId = obj.detailId || 0;
            var storageNum = $("#scantostockin_storageNum_" + obj.mainOrderId + "_" + sdetailId + "_" + obj.prodSId).val();
            detailItem.prodSSku = obj.prodSSku;
            detailItem.unit = obj.unit;
            detailItem.stockLocation = obj.stockLocation;
            detailItem.releateSkuStockLocation = obj.releateSkuStockLocation;
            detailItem.title = obj.title;
            detailItem.storageNum = storageNum; //入库数量
            detailItem.inPackType = obj.inPackType; //入库包装类型
            detailItem.packDesc = obj.packDesc; //入库要求
            detailItem.storageRequirements = obj.storageRequirements; //入库要求
            detailItem.alonePack = obj.alonePack; //入库要求
            detailItem.noAlonePackDesc = obj.noAlonePackDesc; //独立包装备注
            detailItem.specialPack = obj.specialPack; //是否特殊包装
            detailItem.specialPackDesc = obj.specialPackDesc; //特殊包装备注
            detailItem.ifNeedQualityCheck = obj.ifNeedQualityCheck; //是否需要质检
            detailItem.style = obj.style; //款式
            detailItem.isNew = obj.isNew;
            if(obj.hasMove && (!obj.extensionField || obj.extensionField == 1)){//如果移库中，不打印商品标签
                detailItem.prodSSku="";
            }
            if(obj.scanType == 1 || obj.scanType == 6){//标记紧急
                item.storageNumberStr= item.storageNumber+"    龙";
            }else if(obj.scanType == 2){
                /**sku有单sku缺货订单**/
                item.storageNumberStr= item.storageNumber+"    单缺";
            }else if(obj.scanType == 3){
                /**20200114 只要提示缺货的，入库单上面都加  缺  字*/
                /**sku有多sku缺货订单**/
                item.storageNumberStr= item.storageNumber+"    多缺";
            }else if(obj.scanType == 4){
                /**20200119  可售天数小于等于3的点货标签加个“快”（快卖完了。。的意思）*/
                item.storageNumberStr= item.storageNumber+"    快";
            }else if (obj.scanType == 5) {
                item.storageNumberStr= item.storageNumber+"    托";
            }
            detailDtos.push(detailItem);
            item.detailDtos = detailDtos;
            printArray.push(item);
        }
        scantostockin_printSkuLabel(printArray);
    };

    /***
     * 打印入库单sku标签
     * @param array
     */
    function scantostockin_printSkuLabel(array) {
        // var printArray = [];
        // for (var x in array) {
        //     var obj = array[x];
        //     var detailDtos = obj.detailDtos;
        //     for (var y in detailDtos) {
        //         var product = detailDtos[y];
        //         var formData = {};
        //         formData.storageNumber = obj.storageNumber;
        //         formData.storageNumberStr=obj.storageNumberStr || obj.storageNumber;
        //         //需要加圈的字集合使用逗号分隔
        //         formData.circleText = "快,龙";
        //         formData.prodSSku = product.prodSSku;
        //         formData.stockLocation = product.stockLocation;
        //         formData.stockLocation = product.stockLocation;
        //         formData.releateSkuStockLocation = product.releateSkuStockLocation;
        //         formData.title = product.title;
        //         formData.storageNum = product.storageNum;
        //         formData.printNum = scantostockin_getActPrintNum_fun(product.storageNum); //获取设置的打印数量;
        //         // formData.printNum = 1; //测试用代码
        //         formData.skuNum = formData.storageNum;
        //         formData.unit =  product.unit;
        //         formData.printType = 2; //打印入库单标签
        //         formData.inPackType = product.inPackType; //入库包装类型
        //         formData.packDesc = product.packDesc; //入库包装类型
        //         formData.alonePack = product.alonePack; //独立包装
        //         formData.specialPackDesc = product.specialPackDesc; //特殊包装备注
        //         formData.storageRequirements = product.storageRequirements; //入库要求
        //         formData.noAlonePackDesc = product.noAlonePackDesc; //独立包装备注
        //         formData.specialPack = product.specialPack; //是否特殊包装
        //         formData.ifNeedQualityCheck = product.ifNeedQualityCheck; //是否需要质检
        //         formData.style = product.style; //款式
        //         formData.printerName = "6515"; //调用的打印机名称
        //         formData.isNew = product.isNew;
        //         //2020/8/27 忽略备注；不管有没有备注都加上款式
        //         if (formData.style != null && formData.style != '') {
        //             formData.title = formData.title + "(" + formData.style + ")";
        //         }
        //         if(formData.prodSSku == ''){
        //             formData.printNum=0;
        //             formData.storageNum=0;
        //         }
        //         printArray.push(formData);
        //     }
        // }
        // epeanPrint_plugin_fun(2,printArray,'',false)
        //获取打印参数处理
        let printReqData =scanToStockinPrintParams(array);
        // console.log('printReqData', printReqData, array);
        //打印传参
        let printResData = commonGetPrintDataByLoopRequest(printReqData);
        Promise.all(printResData).then(res => {
          let printParams = [];
          for(let i=0; i<res.length; i++){
            let item = res[i];
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
        });
    }
    /**过滤多选框改变直接查询**/
    form.on('checkbox(scantostockin_chk_filter)', function(data) {
        if (data.elem.checked) {
            checkValue.push(data.value)
        } else {
            checkValue.splice(checkValue.indexOf(data.value), 1);
        }
        localStorage.setItem('scantoStorecheckValue', JSON.stringify(checkValue));
        if (data.value == 2 || data.value == 3|| data.value == 4) {
            scantostockinTable();
        } else if (data.value == 0) {
            autoGenerateStorage = data.elem.checked;//是否自动生成采购入库单
        } else if (data.value == 1) {
            autoPrint = data.elem.checked; //是否自动打印
        } else if (data.value == 6) {
            selectOutOfStockOrder = data.elem.checked;
            if (data.elem.checked) {
                selectOutOfStockOrder = "1";
                $('#aeOutOfStockOrderId').attr('disabled', true)
                $('#platcodeOutOfStockOrderId').attr('disabled', true)
            } else {
                selectOutOfStockOrder = "0";
                $('#aeOutOfStockOrderId').attr('disabled', false)
                $('#platcodeOutOfStockOrderId').attr('disabled', false)
            }
        } else if (data.value == 7) {
            aeOutOfStockOrder = data.elem.checked;
            if (data.elem.checked) {
                aeOutOfStockOrder = "1";
                $('#singleOutOfStockInOrderId').attr('disabled', true)
                $('#platcodeOutOfStockOrderId').attr('disabled', true)
            } else {
                aeOutOfStockOrder = "0";
                $('#singleOutOfStockInOrderId').attr('disabled', false)
                $('#platcodeOutOfStockOrderId').attr('disabled', false)
            }
        }else if(data.value == 8){
            pingOutOfStockOrder = data.elem.checked;
            if (data.elem.checked) {
                pingOutOfStockOrder = "1";
                $('#aeOutOfStockOrderId').attr('disabled', true)
                $('#singleOutOfStockInOrderId').attr('disabled', true)
            } else {
                pingOutOfStockOrder = "0";
                $('#aeOutOfStockOrderId').attr('disabled', false)
                $('#singleOutOfStockInOrderId').attr('disabled', false)
            }
        }
        form.render('checkbox')
    });
    //监听工具条
    table.on('tool(scantostockin_data_table)', function(obj) { //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
        var data = obj.data; //获得当前行数据
        var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
        if (layEvent === 'scantostockin_print_label') { //打印sku标签
            var dataArray = [];
            dataArray.push(data);
            // stockinorder_printorderData(dataArray, false)
            //获取打印参数处理
            let printReqData =scanToStockinPrintParams(dataArray);
            //打印传参
            let printResData = commonGetPrintDataByLoopRequest(printReqData);
            Promise.all(printResData).then(res => {
              let printParams = [];
              for(let i=0; i<res.length; i++){
                let item = res[i];
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
            });
        }else if(layEvent === 'scantostockin_feed_label'){ //点货异常反馈
            var errorRemark = $("#scantostockin_scanErrorTypeSel").val();
            if (errorRemark == null || errorRemark == '') {
                layer.msg("请选择异常类型", {icon: 0});
                return;
            }
            $.ajax({
                url: ctx + '/purOrderStorage/scanFeedError.html',
                dataType: 'json',
                method:"post",
                data: {"storageNumber": data.storageNumber, "errorRemark": errorRemark},
                success: function (returnData) {
                    loading.hide();
                    if (returnData.code === "0000") {
                        layer.msg(returnData.msg, {icon: 1});
                    } else {
                        layer.msg(returnData.msg, {icon: 2});
                    }
                },
                error: function (returnData) {
                    layer.msg(returnData.msg, {icon: 2});
                }
            });
        }else if(layEvent == 'scantostockin_multi_combi'){ //多属性
          console.log('多属性', data.multipleInfoList, data.prodSSku);
          let $str = $('<div style="padding:20px;"></div>');
          let $ul = $('<ul style="display: flex;justify-content: start;flex-wrap: wrap;"></ul>');
          for(let i=0; i< data.multipleInfoList.length; i++){
            let item= data.multipleInfoList[i];
            let $li = $(`<li class="searchSupply-li">
              <span>
              <img width="120" height="120" data-original="${item.imageUrl}" class="img_show_hide b1 lazy" data-onerror="layui.admin.img_noFind()" />
              </span>
              <div class="searchSupply-li-div">
                <div><span class="gray">商品名称:</span> ${item.attrStr}</div>
                <div><span class="gray">数&nbsp;&nbsp;&nbsp;量:</span> <font color="red">${item.purBaseNum}</font></div>
              </div>
              </li>`);
            $ul.append($li);
          }
          $str.append($ul);
          console.log($str);
          layer.open({
            type:1,
            title: data.prodSSku,
            content: $str[0]['outerHTML'],
            area: ['80%', '500px'],
            success: function(){
              imageLazyload();
            }
          });
        }
    });
    /**
     * 表格复选框选中
     */
    table.on('checkbox(scantostockin_data_table)', function(obj) {
        var checkData = table.checkStatus('scantostockin_data_table').data;
        var num = checkData.length;
        $("#scantostockin_sku_number_span").html(num);
    });

    /**
     * 绘制扫描入库列表表格
     * @param notShowInAuditData 不显示已入库未审核数据
     * @param autoGenerateStorage 是否自动生成入库单
     * @param autoPrint 是否自动打印
     * @returns {boolean}
     */
    var maxStorageId=0;
    function scantostockinTable(notShowInAuditData, autoGenerateStorage, autoPrint,selMaxStorageId) {
        var data = getSearchData();
        data.selMaxStorageId=selMaxStorageId;//入库单表存在的最大id
        if (data.billNumber == null || $.trim(data.billNumber) == '') {
            return false;
        }
        if (notShowInAuditData != null && notShowInAuditData == 0) {
            data.notShowInAuditData = 0;
        }
        data.selectOutOfStockOrder = selectOutOfStockOrder;
        data.aeOutOfStockOrder = aeOutOfStockOrder;
        data.pingOutOfStockOrder = pingOutOfStockOrder;
        var col= [
                    { checkbox: true, width: 30 },
                    { title: "SKU", field: 'prodSSku', width: 150, templet: '#scantostockin_prodSSku_tpl' },
                    { title: "图片", field: 'image', width: 130, templet: '#scantostockin_image_tpl' },
                    // { title: "库位", field: 'stockLocation', templet: '#scantostockin_stockLocation_tpl' },
                    { title: "商品名称", field: 'title', templet: '#scantostockin_title_tpl' },
                    { title: "采购单号", field: 'mainBillNumber', templet: `
                    <div>
                        <span>{{d.mainBillNumber}}</span>
                        <span onclick="layui.admin.onlyCopyTxt('{{d.mainBillNumber}}')" style="display: {{d.mainBillNumber ? 'inline-block':'none'}};" class="copy-icon">
                            <svg t="1710754196184" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2392" width="16" height="16"><path d="M768 832q-0.992 54.016-37.504 90.496T640 960H192q-54.016-0.992-90.496-37.504T64 832V384q0.992-54.016 37.504-90.496T192 256v64q-27.008 0.992-44.992 19.008T128 384v448q0.992 27.008 19.008 44.992T192 896h448q27.008-0.992 44.992-19.008T704 832h64zM384 128q-27.008 0.992-44.992 19.008T320 192v448q0.992 27.008 19.008 44.992T384 704h448q27.008-0.992 44.992-19.008T896 640V192q-0.992-27.008-19.008-44.992T832 128H384z m0-64h448q54.016 0.992 90.496 37.504T960 192v448q-0.992 54.016-37.504 90.496T832 768H384q-54.016-0.992-90.496-37.504T256 640V192q0.992-54.016 37.504-90.496T384 64z" p-id="2393" fill="#aaaaaa"></path></svg>
                        </span>
                      </div>
                    ` },
                    { title: "入库单号", field: 'storageNumber', templet: '#scantostockin_storageNumber_tpl' },
                    { title: "商品状态", field: 'isSale', templet: '#scantostockin_isSale_tpl' },
                    { title: "下单备注", field: 'note', },
                    { title: "入库要求", field: 'packDesc', },
                    { title: "包装质检要求", field: 'packDQuality', templet: '#scantostockin_packDQuality_tpl' },
                    { title: "产品区分方式", field: 'productDiffMethod', },
                    { title: "区分方式备注", field: 'productDiffMethodNote', },
                    // { title: "入库要求", field: 'packDesc', },
                    // { title: "规格", field: 'specification', templet: '#scantostockin_specification_tpl' },
                    { title: "采购数", field: 'buyNumber', width: 70,templet: '#scantostockin_buyNumber_tpl' },
                    { title: "本次入库数量", field: 'notStorageNum', width: 92, templet: '#scantostockin_notStorageNum_tpl' },
                    { title: "已入库数量", field: 'inAmount', width: 80, },
                    // { title: "关联订单sku数", field: 'outOfStockNum', templet: '#scantostockin_outOfStockNum_tpl' },
                    // { title: "可售天数", field: 'curSaleDay', templet: '#scantostockin_curSaleDay_tpl' },
                    // { title: "不良品数量", field: 'defectiveNum',edit: 'text', templet: '#scantostockin_defectiveNum_tpl'},
                    // { title: "不良品备注", field: 'defectiveRemark',edit: 'text' , templet: '#scantostockin_defectiveRemark_tpl'},
                    { title: "商品信息(g)", field: 'prodInfo', templet: '#scantostockin_prodInfo' },
                    { title: "操作人", field: 'scanPerson', templet: '#scantostockin_scanPerson' },
                    { title: "操作", field: 'operate', width: 65, templet: '#scantostockin_table_operate_tpl' },
                ];
          //  if($("#scantostockin_exit_defective_input").length==0){
          //      col[15] ={ title: "不良品数量", field: 'defectiveNum'};
          //      col[16] ={ title: "不良品备注", field: 'defectiveRemark'};
          //  }
        table.render({
            elem: "#scantostockin_data_table",
            method: "post",
            url: ctx + '/purOrderStorage/getScanPurOrderMainInfoByOneNumber.html',
            id: 'scantostockin_data_table',
            where: data,
            cols: [col],
            page: false,
            created: function(res) {
                /**如果是生成入库单按钮点击,则把上次的点击记录记录下来*/
                if (isGnerateButton && curGenerateStorageNumbers.length > 0) {
                    var rData = res.data;
                    if (rData != null && rData.length > 0) {
                        var storageNumbersStr = curGenerateStorageNumbers.join(",") + ",";
                        for (var i in rData) {
                            var obj = rData[i];
                            var curStorageNumber = obj.storageNumber || '';
                            if (curStorageNumber != '' && storageNumbersStr.indexOf(curStorageNumber) > -1) {
                                obj.LAY_CHECKED = true;
                            }
                        }
                    }
                    isGnerateButton = false;
                    curGenerateStorageNumbers = [];
                }
            },
            done: function(res) {
                imageLazyload();
                var rData = res.data;
                $("#scantostockin_sku_number_span").html(0);
                var moveLocation = [];
                if (res.code == "0000" && rData != null) {
                    if(res.extra?.hasErrorGoodsDetailSkuList.length!=0){
                        var hasErrorGoodsDetailSkuList=res.extra.hasErrorGoodsDetailSkuList;

                        layer.open({
                            title:'提醒',
                            content:`${hasErrorGoodsDetailSkuList.join(',')} 易出错，请称重`
                        })
                    }
                    if(res.extra && res.extra.maxStorageId){
                        maxStorageId=Number(res.extra.maxStorageId);//记录本次最大的入库单id，防止其它人在同一时间点货
                    }
                    var audioMsg = res.audioMsg; //ztt20230922-这字段含义是什么?
                    var totalBuyNumber = 0; //采购总数量
                    outStockObj={};
                    for (var i in rData) {
                        var prod_obj=rData[i];
                        totalBuyNumber += Number(prod_obj.buyNumber);
                        //移库并且扩展字段1 为 盘点
                        if (prod_obj.hasMove && (!prod_obj.extensionField || prod_obj.extensionField == 1)){//如果当前sku在移库中，背景标记为灰色
                            var trobj=  $("#scantostockin_storageNumber_"+prod_obj.mainOrderId+"_"+prod_obj.prodSId).parent().parent().parent();
                            trobj.css({"background":"#ccc"});
                            const contactMan = prod_obj.consignee || prod_obj.transferCreator
                            trobj.attr("title",prod_obj.prodSSku + "商品正在移库，请与"  + contactMan + "确认");
                            moveLocation.push(prod_obj.prodSSku + "商品正在移库，请与"  + contactMan  + "确认");
                        }
                        if (prod_obj.pmarkCrash) {//如果未审核入库单已经被标记为紧急
                            outStockObj[prod_obj.prodSSku] = 0;
                        } else {
                            if (outStockObj[prod_obj.prodSSku] == null || outStockObj[prod_obj.prodSSku] == undefined) {
                                outStockObj[prod_obj.prodSSku] = prod_obj.outOfStockNum || 0;
                            }
                        }
                    }
                    $("#scantostockin_sku_number_div").html("sku个数：" + res.count + "  采购总数量：" + totalBuyNumber);
                    let notNeedGobackthis = rData.filter(item=>{
                        const notAudit = item.processStatus == null || (item.processStatus != '1'); //单子是否未审核
                        return item.storageNumber == null || item.storageNumber == '' || (isGnerateButton && notAudit) 
                    })
                    //ztt20230913--展示包裹数量
                    // console.log(res.extra &&res.extra.received && res.extra.received.length>=0, res.extra && res.extra.unReceived && res.extra.unReceived.length>=0);
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
                      $('#scantostockin_package_number_div').html(showStr);
                    }
                    /**是否拥有修改入库数量权限判断**/
                    if ($("#scantostockin_notStorageNum_span").length > 0) {
                        $(".scantostockin_notStorageNum_hide").remove();
                    } else {
                        $(".scantostockin_notStorageNum_show").remove();
                    }
                    
                    //ztt20230922打印相关需求--以下逻辑需要仔细研究,慎重修改
                    if (autoGenerateStorage && autoPrint) {
                        if (audioMsg == "1") {
                            if(!notNeedGobackthis.length){
                                scantostockin_addOnePurOrderStorageFormScan(rData, true);
                            }else{
                                return scantostockin_addOnePurOrderStorageFormScan(rData, true);
                            }
                        }else {
                            scantostockin_printSkuLabel_for_noNumber(rData ,"scantostockin_sku_input");
                            //ztt-改-2021/02/03
                            // $('#scantostockin_sku_input').focus();
                            /*layer.open({
                                type: 1,
                                title: "自动生成采购入库单失败",
                                btn: "确认",
                                content: $('#scantostockin_warning').html(),
                                yes: function () {
                                    layer.closeAll();
                                    //打印sku
                                    $('#scantostockin_sku_input').focus();
                                }
                            });*/
                        }
                    } else if (autoGenerateStorage) {
                        if (audioMsg == "1") {
                            if(!notNeedGobackthis.length){
                                scantostockin_addOnePurOrderStorageFormScan(rData, false);
                            }else{
                                return scantostockin_addOnePurOrderStorageFormScan(rData, false);
                            }
                        }else {
                            scantostockin_printSkuLabel_for_noNumber(rData, "scantostockin_sku_input");
                        }
                    } else if (autoPrint) {
                        /**如果有选中的，只打印选中的*/
                        var checkArray = table.checkStatus('scantostockin_data_table').data;
                        if (checkArray != null && checkArray.length > 0) {
                            rData=checkArray;
                        }else{
                            //自动生成入库单时，只打印本次生成的入库单
                            if (curGenerateStorageNumbers.length > 0) {
                                var newRData = [];
                                var storageNumbersStr = curGenerateStorageNumbers.join(",") + ",";
                                for (var i in rData) {
                                    var obj = rData[i];
                                    if (storageNumbersStr.indexOf(obj.storageNumber + '') > -1) {
                                        newRData.push(obj);
                                    }
                                }
                                rData = newRData;
                                curGenerateStorageNumbers = [];
                            }else{
                                rData=[];
                            }
                        }
                        stockinorder_printorderData(rData); //只打印
                    }
                    /**20200401展示质检规范**/
                    $(".scantostockin_zhijian_btn").click(function () {
                        var qualityCheckRqmt=$(this).next().html();
                        var title="产品质检要求";
                        layer.open({
                            type: 1,
                            title: title,
                            id:'scantostockin_zhijian_content_layer',
                            shadeClose: true,
                            area: ['1000px', '600px'],
                            content: $('#scantostockin_zhijian_layer').html(),
                            success: function () {
                                wangEditorRender('scantostockin_zhijian_wangedit',qualityCheckRqmt)
                            }
                        })
                    })
                    if(res.extra &&  res.extra.repeatList && res.extra.repeatList.length > 0){
                      layer.alert(res.extra.repeatList.join(','), {icon: 7});
                    }
                }else{
                    layer.msg(res.msg,{icon:2});
                }
                $('#scantostockin_orderNumber').select();
                $('td[data-field="note"]').addClass('remark_stronger');
                $('td[data-field="packDesc"]').addClass('remark_stronger');
                let options = {};
                if(moveLocation.length == 0){
                    options.icon = 1;
                }else{
                    options.icon = 7;
                }
                if(moveLocation.length>20){
                    options.area = ['900px','100%'];
                }else{
                    options.area = ['900px'];
                    options.maxHeight =900
                }
                if(moveLocation.length !== 0){
                    layer.open({
                        title: '提示',
                        content: moveLocation.join('<br/>'),
                        ...options,
                        btn: ['确认'],
                        success: function(layero, index) {
                            $('#scantostockin_orderNumber').blur();
                            this.enterEsc = function(event) {
                                if (event.keyCode === 13) {
                                    layer.close(index);
                                    return false; //阻止系统默认回车事件
                                }
                            };
                            $(document).on('keydown', this.enterEsc); //监听键盘事件，关闭层
                        },
                        end: function() {
                            $(document).off('keydown', this.enterEsc); //解除键盘关闭事件
                            // 获取焦点
                            $('#scantostockin_orderNumber').focus();
                        }
                    });
                    
                }
            },
        });
    };
     /**
     * 记录快递单号 输入的是CGD开头,且logisticOrderNo为空时,弹框提示输入快递单号
     */
    function scantostockin_openModel_deliveryNumber(basicObj,printSku) {
        layer.open({
          type: 1,
          title: "录入快递单号",
          area: ["500px", "200px"],
          btn: ["提交", "关闭"],
          content: $("#scantostockin_openModel_deliveryNumber_tpl").html(),
          id: 'scantostockin_openModel_deliveryNumber_tplId',
          success: function (layero, index) {
            layero.find("input[name=deliveryNumber]").focus();
            this.enterEsc = function (event) {
              if (event.keyCode === 13) {
                const deliveryNumber = layero.find("input[name=deliveryNumber]").val()
                if (deliveryNumber === "") return layer.msg("请输入快递单号")
                commonReturnPromiseRes({
                  url: "/lms/purOrderStorage/addOnePurOrderStorageFormScan.html",
                  type: "post",
                  params: { ...basicObj, scanOrderNumber:deliveryNumber,confirm:1 },
                }).then(res => {
                    for(var i in res.data){
                        var curNumber=res.data[i].storageNumber;
                        if (curNumber != null && curNumber != '') {
                            curGenerateStorageNumbers.push(curNumber);//本次生成的入库单号
                        }
                    }
                    scantostockinTable(null,false,printSku,basicObj.maxStorageId);
                    layer.msg(res.msg, { icon: 1 })
                    layer.close(index)
                })
                return false //阻止系统默认回车事件
              }
            }
            $(document).on("keydown", this.enterEsc) //监听键盘事件，关闭层
          },
          yes: function (index, layero) {
            // 获取快递单号
            const deliveryNumber = layero.find("input[name=deliveryNumber]").val()
            if (deliveryNumber === "") return layer.msg("请输入快递单号")
            commonReturnPromiseRes({
                url: "/lms/purOrderStorage/addOnePurOrderStorageFormScan.html",
                type: "post",
                params: { ...basicObj, scanOrderNumber:deliveryNumber,confirm:1 },
            }).then(res => {
                for(var i in res.data){
                    var curNumber=res.data[i].storageNumber;
                    if (curNumber != null && curNumber != '') {
                        curGenerateStorageNumbers.push(curNumber);//本次生成的入库单号
                    }
                }
                scantostockinTable(null,false,printSku,basicObj.maxStorageId);
                layer.msg(res.msg, { icon: 1 })
                layer.close(index)
            })
          },
          end: function () {
            $(document).off("keydown", this.enterEsc) //解除键盘关闭事件
            // 获取焦点
          },
        })
    }
      

    /**
     * 多个物流包裹的采购订单，不自动生成入库单，只对展示的每个sku打印一张SKU标签专用
     */
    function scantostockin_printSkuLabel_for_noNumber(array ,id) {
        var printArray = [];
        console.log('打印array', array);
        for (var y in array) {
            var product = array[y];
            var formData = {};
            formData.prodSSku = product.prodSSku;
            formData.stockLocation = product.stockLocation;
            formData.title = product.title;
            formData.storageNum = product.storageNum ;
            formData.storageNumber = "";
            //一个
            formData.printNum = 1
            formData.skuNum = formData.storageNum;
            formData.unit =  product.unit;
            formData.printType = 2; //打印入库单标签
            formData.inPackType = product.inPackType; //入库包装类型
            formData.packDesc = product.packDesc; //入库包装类型
            formData.alonePack = product.alonePack; //独立包装
            formData.specialPackDesc = product.specialPackDesc; //特殊包装备注
            formData.storageRequirements = product.storageRequirements; //入库要求
            formData.noAlonePackDesc = product.noAlonePackDesc; //独立包装备注
            formData.specialPack = product.specialPack; //是否特殊包装
            formData.ifNeedQualityCheck = product.ifNeedQualityCheck; //是否需要质检
            formData.style = product.style; //款式
            formData.printerName = "6515"; //调用的打印机名称
            if (formData.style != null && formData.style != '') {
                formData.title = formData.title + "(" + formData.style + ")";
            }
            if (formData.prodSSku == '') {
                formData.printNum = 0;
                formData.storageNum = 0;
            }
            printArray.push(formData);
        }
        epeanPrint_plugin_with_extra_fun(2, printArray, "printSkuWithOutNumber", null, function (){
            $("#" + id).focus(),false
        });
    }
    /**
     * 获取搜索参数
     */
    function getSearchData() {
        var data = {};
        data.billNumber = $('#scantostockin_orderNumber').val();
        //ztt-0208-改
        // data.billNumber = $('#scantostockin_orderNumberHidden').val();
        data.notShowInAuditData = 0;
        data.notShowAllinStockData = 0;
        data.notShowPartinStockData = 0;//不显示部分已入库已审核数据
        $("#scantostockin_search_from").find(".layui-form-checked").each(function() {
            var val = $(this).prev().val();
            if (val == 2) { //不显示已入库未审核数据
                data.notShowInAuditData = 1;
            } else if (val == 3) { //不显示已完全入库商品
                data.notShowAllinStockData = 1;
            } else if (val == 4) { //不显示部分已入库已审核数据
                data.notShowPartinStockData = 1;
            }
        });
        return data;
    }
});

/**
 * 产品问题反馈
 */
function scanToStockInFeedbackFunction(sku,mainBillNumber,storageNumber) {
    var maxFileCount = 3;
    var timer,
        isFinished = false;
    var isChoosed = false;
    var imgeList = [];
    imgeList.length = 0;
    layui.layer.open({
        type: 1,
        title: "问题反馈",
        area: ["60%", "70%"],
        btn: ['提交', '关闭'],
        shadeClose: false,
        content: $("#scanToStockInFeedbackScript").html(),
        success: function (layero, index) {
            $("textarea[name='scanToStockIn_sku_textarea']").val(sku);
            $.ajax({
                method: "POST",
                url: ctx + '/purOrderStorage/getOtherSelectList.html',
                success: function (response) {
                    var $response = response
                    if ($response.code === "0000") {
                        var issueTypeList = $response.data.issueType;
                        for (var i in issueTypeList) {
                            var amount =  "";
                            if (issueTypeList[i].extend1) {
                                amount = issueTypeList[i].extend1;
                            }
                            if (!amount || amount.trim() == ""){
                                $("select[name='scanToStockIn_issue_type']").append("<option value='" + i + "'>" + issueTypeList[i].name + "</option>");

                            }else {
                             $("select[name='scanToStockIn_issue_type']").append("<option data-amount =" + amount + " value='" + i + "'>" + issueTypeList[i].name + "</option>");
                            }
                        }
                    } else {
                        layui.layer.msg("初始化问题类型失败.->" + $response.msg);
                    }
                    layui.form.render('select');
                }, error: function (response) {
                    layui.layer.msg("初始化问题类型失败.->" + response);
                }
            });
            imgeList.length = 0;
            clearInterval(timer);
            layui.upload.render();
            var uploadInst = layui.upload.render({
                elem: '#scanToStockIn_upload_btn', //绑定元素
                accept: 'images', //允许上传的文件类型
                number: maxFileCount,
                multiple: true, //允许多文件上传
                auto: false, //选完文件后不要自动上传
                bindAction: '.layui-layer-btn0', //指定一个按钮触发上传
                url: ctx + '/warehouseProblemController/uploadPic.html', //上传接口
                choose: function (obj) {
                    imgeList.length = 0;
                    isChoosed = true
                    var  fileCount = 0;
                    var files = obj.pushFile(); //将每次选择的文件追加到文件队列
                    //图像预览，如果是多文件，会逐个添加。(不支持ie8/9);
                    for (var index in files) {
                        fileCount++;
                    }
                    obj.preview(function (index, file, result) {
                        isFinished = false;
                        if (fileCount > maxFileCount) {
                            fileCount = maxFileCount;
                            delete files[index];
                            layui.layer.msg('文件数量不得超过' + maxFileCount + '个', {icon: 2});
                            imgeList.length = 0;
                            return;
                        }
                        var imgobj = new Image(); //创建新img对象
                        var oDiv = document.createElement('div');
                        var deleteIcon = document.createElement('div');
                        oDiv.className = 'img_box'
                        deleteIcon.className = 'deleteIcon';
                        deleteIcon.setAttribute('data-index', index);
                        deleteIcon.innerHTML = '×';
                        imgobj.src = result; //指定数据源
                        imgobj.className = 'ml_img';
                        oDiv.appendChild(imgobj);
                        oDiv.appendChild(deleteIcon);
                        document.getElementById("div_prev").appendChild(oDiv); //添加到预览区域
                        $('.deleteIcon').click(function () {
                            fileCount--;
                            var delindex = $(this).attr('data-index');
                            delete files[delindex];
                            $(this).parents('.img_box').remove();
                            if ($.isEmptyObject(files)) {
                                isFinished = true;
                            }
                        });
                        imgeList.length = 0;
                    });
                },
                done: function (res) {
                    //上传完毕回调
                    if (res.code === "0000") {
                        imgeList.push(res.msg);
                    }
                },
                allDone: function (res) {
                    isFinished = true;
                },
                error: function () {
                    //请求异常回调
                    layui.layer.msg("上传图片失败")
                }
            });
        },
        yes: function (index, layero) {
            //isFinished = false;
            clearInterval(timer);
            var obj = {};
            obj.mainBillNumber = mainBillNumber;
            obj.storageNumber = storageNumber;
            obj.sSkuList = [];
            obj.issueType = $("select[name='scanToStockIn_issue_type'] option:selected").text();
            //仓库操作费
            var warehouseFee = $("select[name='scanToStockIn_issue_type'] option:selected").attr("data-amount");
            if (warehouseFee && warehouseFee != "") {
                obj.warehouseFee = warehouseFee;
            }
            var skuList = $("textarea[name='scanToStockIn_sku_textarea']").val();
            obj.issueRemark = $("textarea[name='scanToStockIn_issue_remark']").val();
            if (isChoosed == false) {
                isFinished = true;
            }
            if (skuList) {
                loading.show();
                obj.sSkuList = skuList.split(/[\s\n]/);
                obj.sSkuList = obj.sSkuList.filter(function (item) {
                    return item !== ""
                })
                timer = setInterval(function () {
                    if (isFinished) {
                        clearInterval(timer);
                        obj.imgArr = (imgeList);
                        $.ajax({
                            type: "POST",
                            url: ctx + "/warehouseProblemController/addWarehouseProblemV2.html",
                            data: {'obj': JSON.stringify(obj)},
                            async: true,
                            dataType: "JSON",
                            success: function (data) {
                                imgeList.length = 0;
                                if (data.code == "0000") {
                                    layer.msg(data.msg, {icon: 1, time: 10000});
                                } else if (data.code == "0001") {
                                    layer.confirm(data.msg, function (index) {
                                        obj.insist = "YES"
                                        $.ajax({
                                            type: "POST",
                                            url: ctx + "/warehouseProblemController/addWarehouseProblemV2.html",
                                            dataType: 'json',
                                            async: true,
                                            data: {'obj': JSON.stringify(obj)},
                                            beforeSend: function () {
                                                loading.show();
                                            },
                                            success: function (res) {
                                                loading.hide();
                                                layui.layer.close(index);
                                                if (res.code == '0000') {
                                                    layui.layer.msg(res.msg, {icon: 1, time: 10000});
                                                }
                                            }
                                        });

                                    });
                                }
                                loading.hide();
                            }
                        });
                    }
                }, 1000);
            } else {
                layui.layer.msg('请输入sku');
            }
        },
        end: function (index, layero) {
            layui.layer.close();
        }
    });
}



