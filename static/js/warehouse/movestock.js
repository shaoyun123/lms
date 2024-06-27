var pagedata = {};
layui.use(['admin', 'form', 'table', 'layer', 'laydate', 'laypage', 'formSelects', 'element','layCascader'], function() {
    var form = layui.form,
        table = layui.table,
        laypage = layui.laypage,
        laydate = layui.laydate,
        element = layui.element,
        layCascader = layui.layCascader,
        formSelects = layui.formSelects,
        layer = layui.layer;
    form.render();
    
    fillWarehouse(); //初始化仓库下拉框
    // fillbuildNo();//初始化楼栋号
    // fillTransferType("movestock_search_form", "sku_location_transfer_type");//初始化移库类型
    //ztt20230724
    let TransferTypeListEnum = []
    commonReturnPromise({
      url: '/lms/tranOrder/getTranBizDict.html?headCode=MOVE_TRANSFER_TYPE'
    }).then(res => {
      TransferTypeListEnum =res
      let str ='<option></option>';
      for(let i=0; i<res.length; i++){
        let item = res[i];
        str += `<option data-extend1="${item.extend1}" value="${item.id}">${item.name}</option>`;
      }
      $('#sku_location_transfer_type').html(str);
      formSelects.render("sku_location_transfer_type");
    });
    //日期范围
    //默认七天
    let timestamp = Date.now();
    let endTime = Format(
      timestamp,
      "yyyy-MM-dd"
    );
    let startTime = Format(
      (timestamp - 7 * 24 * 3600 * 1000),
      "yyyy-MM-dd"
    );
    let timeVal = startTime + " - " + endTime;
    laydate.render({
        elem: '#whMoveStockTime',
        type: 'date',
        range: true,
        value: timeVal,
        showShortcuts: true,
    });

    form.on('submit(movestock_submit)', function (obj) {
        //获取日期时间
        if (obj && obj.field && obj.field.whMoveStockTimeInput && obj.field.whMoveStockTimeInput != '') {
            var timeInput = obj.field.whMoveStockTimeInput;
            var split = timeInput.split("-");
            obj.field.startTime = timeInput.substring(0, 10) + " 00:00:00";
            obj.field.endTime = timeInput.substring(12) + " 23:59:59";
        }
        // 全部页签时，不传递参数中的status字段即可
        if(obj.field.status===''){
            delete obj.field.status
        }else{
            obj.field.status = obj.field.status == 'true' ? true: false;
        }
        if(obj.field.creatorIdsStr.trim()){
            obj.field.creatorIds = JSON.parse(obj.field.creatorIdsStr.trim() || []);
        }else{
            obj.field.creatorIds = [];
        }
        obj.field.transferTypeList = formSelects.value("sku_location_transfer_type", "val").map(Number)
        delete obj.field.creatorIdsStr;
        getMovestockTableData(obj.field);
    })

    // 远程搜索功能
    var dim_consigneeId = new DimSearch('#movestock_consigneeId', 'consigneeId',
    {url:'/skuLocationTransfer/getConsigneeUserList.html',
    type:'get',
    query:'search',
    label:'userName',
    isIncludeData:true,
    name:'.dimResultDivconsigneeName'
    });
    var dim_moveLocationUserId = new DimSearch('#movestock_moveLocationUserId', 'moveLocationUserId',
        {url:'/skuLocationTransfer/getConsigneeUserList.html',
        type:'get',
        query:'search',
        label:'userName',
        isIncludeData:true,
        name:'.dimResultDivmoveLocationUserId'
        });
    //创建人渐进搜索start
    // var dim_creator = new DimSearch('#movestock_creator', 'creatorId',
    // {url:'/skuLocationTransfer/getConsigneeUserList.html',
    // type:'get',
    // query:'search',
    // label:'userName',
    // isIncludeData:true,
    // name:'.dimResultDivCreatorName'
    // });
    // dim_creator.init();
    //创建人渐进搜索end
    //var dim_consigneeId = new DimSearch('#movestock_consigneeId', 'consigneeId')
    dim_consigneeId.init();
    dim_moveLocationUserId.init();
    let movestock_creatorCascader = layCascader({
      elem: "#movestock_creator",
      clearable: true,
      filterable: true,
      collapseTags: true,
      placeholder: '请选择',
      props: {
          multiple: true,
          label: "label",
          value: "value"
      },
    });
    commonReturnPromise({
      url: '/lms/skuLocationTransfer/listMovestockCreatorCascader'
    }).then(res => {
      console.log(res);
      movestock_creatorCascader.setOptions(res.children);
    });

    /**
     * 执行生成批次动作
     */
    function generateBatch(transferType ,data) {
        if (!transferType || transferType.trim() === "") {
            layui.admin.load.hide();
            layer.msg('请勾选需要生成批次的移库类型!', {icon: 7});
            return;
        }
        var skus = data.map(function (item) {
            return item.sku;
        }).join(',');
        var ids = data.map(function (item) {
          return item.id;
      }).join(',');
        if (data.length > 0) {
            var warehouseId = data[0].warehouseId;
            $.ajax({
              url:  ctx + '/skuLocationTransfer/generateBatchNumber.html',
              type: "POST",
              contentType:"application/json",
              dataType: "json",
              data: JSON.stringify({
                skus: skus,
                ids: ids,
                warehouseId: warehouseId,
                transferType: transferType,
                urgent: $('#movestock_urgent').prop('checked')
              }),
              success: function (result) {
                if(result.code == '0000'){
                  layer.closeAll();
                  layer.msg(result.msg || '生成批次成功', {icon: 1});
                }else{
                  if(result.data){
                    let failList = result.data && result.data.failSkuList; 
                    let strContent =`<span>生成批次单号失败,失败${failList.length}个.</span>`;
                    let options = {};
                    //处理alert图标
                    if(failList.length == 0){
                      options.icon = 1;
                    }else{
                      options.icon = 7;
                    }
                    //处理高度
                    if(failList.length>20){
                      options.area = ['900px','100%'];
                    }else{
                        options.area = ['900px'];
                        options.maxHeight =900
                    }
                    if (failList.length > 0) {
                      strContent += "<br/><span>失败SKU</span>:<br/>";
                      for (var i = 0; i < failList.length; i++) {
                        strContent += `<span>${failList[i]}<span><br/>`;
                      }
                    }
                    layer.open({
                      title: "提示",
                      content: strContent,
                      area: options.area,
                      icon: options.icon,
                      btn: ["确定"],
                      yes: function (index) {
                        layer.close(index);
                      },
                    });
                  }else{
                    layer.msg(result.msg || '操作失败', {icon: 2});
                  }
                }
              }
            });
            // initAjax('/skuLocationTransfer/generateBatchNumber.html', 'POST', JSON.stringify({
            //     skus: skus,
            //     ids: ids,
            //     warehouseId: warehouseId,
            //     transferType: transferType,
            //     urgent: $('#movestock_urgent').prop('checked')
            // }), function (returnData) {
            //     layer.closeAll();
            //     layer.msg(returnData.msg || '生成批次成功');
            // }, null, null, 1);
        } else {
            layui.admin.load.hide();
            layer.msg('请勾选需要生成批次的数据');
        }
    }


    /** Glx-- modify    start **/
    /**
     * 绑定一键生成盘点批次号按钮
     */
    function movestock_createBatchLayerHandle(data){
        let skuSize = data && data.skuSize;
        let successSize = data && data.successSize;
        let failList = data && data.failList; 
        let floorList = data && data.floorList;
        let strContent =`<span>选择${skuSize[0]}个SKU,生成${successSize[0]}个批次,失败${failList.length}个.</span>`;
        let options = {};
        //处理alert图标
        if(failList.length == 0){
          options.icon = 1;
        }else{
          options.icon = 7;
        }
        //处理高度
        if(skuSize>20){
          options.area = ['900px','100%'];
        }else{
            options.area = ['900px'];
            options.maxHeight =900
        }
        if (failList.length > 0) {
          strContent += "<br/><span>失败SKU</span>:<br/>";
          for (var i = 0; i < failList.length; i++) {
            strContent += `<span>${failList[i]}</span><br/>`;
          }
        }
        if(floorList.length> 0){
          strContent += "<br/><span>楼层列表</span>:<br/>";
          for (var i = 0; i < floorList.length; i++) {
            strContent += `<span>${floorList[i]}</span><br/>`;
          }
        }
        layer.open({
          title: "提示",
          content: strContent,
          area: options.area,
          icon: options.icon,
          btn: ["确定"],
          yes: function (index) {
            layer.close(index);
          },
        });
    }
    $("#movestock_generateAll").click(function (){
        var obj = serializeObject($("#movestock_search_form"));
        if (obj.whMoveStockTimeInput && obj.whMoveStockTimeInput !== '') {
            var timeInput = obj.whMoveStockTimeInput;
            obj.startTime = timeInput.substring(0, 10) + " 00:00:00";
            obj.endTime = timeInput.substring(12) + " 23:59:59";
        }
        obj.transferTypeList = formSelects.value("sku_location_transfer_type", "val").map(Number)
        var batchNum = $('#movestock_batchSelectNumber').val();
        if(obj.warehouseId){
            $.ajax({
                url:  ctx + '/skuLocationTransfer/batchGenerationAll',
                type: "POST",
                contentType:"application/json",
                // data: JSON.stringify({"warehouseId" : warehouseId}),
                beforeSend: function(){
                  loading.show();
                },
                dataType: "json",
                data: JSON.stringify({
                    ...obj,
                    batchNum: batchNum,
                    urgent: $('#movestock_urgent').prop('checked')
                }),
                success: function (result) {
                  loading.hide();
                  if(result.code == '0000'){
                    movestock_createBatchLayerHandle(result.data);
                  }else{
                    if(result.data){
                      movestock_createBatchLayerHandle(result.data);
                    }else{
                      layer.msg(result.msg || '操作失败', {icon: 2});
                    }
                  }
                },
                error: function(){
                  loading.hide();
                }
            });
        }else{
            layer.msg('请选择仓库')
        }
        // initAjax('/skuLocationTransfer/batchGenerationAll', 'POST', null, function (returnData) {
        //     layer.closeAll();
        //     layer.msg(returnData.msg || '一键生成批次成功' );
        // }, null, null, 1);
    });
    /** Glx-- modify  end  **/


    /**
     * 生成批次号
     */
    $('#movestock_generateBatch').click(function (returnData) {
        //打开选择移库类型弹框
        openTransferSelectFormCopy();
    });
    function openTransferSelectFormCopy(){
      let data = table.checkStatus('movestock_data_table').data;
      
      if (data.length <= 0) {
        layer.msg('请勾选需要生成批次的数据', {icon:7});
        return;
      }else if(data.length == 1){
        let transferType0 = data[0]['transferType'];
        layer.confirm(`已选择${data.length}个SKU,确定生成批次?`,{icon: 3}, function(index){
          generateBatch(String(transferType0), data);
          layer.close(index);
        });
      }else {
        let transferType0 = data[0]['transferType'];
        let filterTransfer = data.some(item => item.transferType != transferType0);
        if(!filterTransfer){
          //所有移库类型都相同
          layer.confirm(`已选择${data.length}个SKU,确定生成批次?`,{icon: 3}, function(index){
            generateBatch(String(transferType0), data);
            layer.close(index);
          });
        }else{
          return layer.msg('类型不同无法生成批次', {icon:7});
        }
      }

    }

    /**
     * 生成批次号和修改批次类型打开同一弹窗;
     * @param type 1 ->生成批次号；2 ->修改类型
     */
    function openTransferSelectForm(type) {
        if (!type) {
            return;
        }
        var data = table.checkStatus('movestock_data_table').data;
        if (data.length <= 0) {
            layer.msg('请勾选需要' + (type === 1 ? '生成批次' : '修改移库类型') + '的数据', {icon: 7});
            return;
        }
        if(type ===2 ){
            // transferTypeCnName为盘点
            const filterLength = data.filter(item => item.transferTypeCnName == '盘点').length
            if(!filterLength){
                return layer.msg('此类型不允许修改不允许修改！',{icon:7})
            }else if(filterLength && filterLength !== data.length){
                return layer.msg('请选择同一种类型修改！',{icon:7})
            }

        }else if(type === 1){
            const filterLength = data.filter(item => item.headName == "调拨取货").length
            if(filterLength && filterLength !== data.length){
                return layer.msg("暂不支持调拨取货和其它类型一起生成批次号", { icon: 7 });
            }
        }
        // if(data.filter(item => item.headName == "调拨取货").length){
        //     if(type === 2){
        //         return layer.msg("暂不支持调拨取货修改为其它类型", { icon: 7 });
        //     }else if(type === 1 && data.filter(item => item.headName == "调拨取货").length !== data.length){
        //         return layer.msg("暂不支持调拨取货和其它类型一起生成批次号", { icon: 7 });
        //     }
        // }

        layer.open({
            type: 1,
            title: '选择移库类型',
            area: ['30%', '40%'],
            content: $('#movestock_transfer_type').html(),
            id: 'movestock_transfer_typeId',
            btn: ['确定', '关闭'],
            success: function (layero, index) {
                // const isOnlyCur =
                //     type === 1
                //         ? !!data.filter(item => item.headName == "调拨取货").length
                //         : false;
                // fillTransferType("movestock_transfer_type_form", "script_transfer_type", isOnlyCur ? 1 : 2);
                let paramsType = ''
                const filterLength = data.filter(item => item.headName == "调拨取货").length
                if(type==2){
                    paramsType =3 
                }else if(type==1){
                    paramsType = !!filterLength ? 1 : 2
                }
                
                fillTransferType("movestock_transfer_type_form", "script_transfer_type", 3);
            },
            yes: function (index, layero) {
                layui.admin.load.show();
                let transferType = $("#movestock_transfer_type_form #script_transfer_type").val();
                if (type === 1) {
                    generateBatch(transferType, data);
                } else if (type === 2) {
                    updateTransferType(transferType, data);
                }
            }
        });
    }
    // 作废调拨单
    $('#movestockTab2_batchDel').click(function(returnData){
        var data = table.checkStatus('movestock_data_table').data
        var tranOrderIds = data.map(function(item){
            return item.tranOrderId
        }).join(',')
        if(data.length>0){
            initAjax('/tranOrder/batchInvalidTranOrder.html','POST',{tranOrderIds:tranOrderIds},function(returnData){
                layui.admin.batchResultAlert("作废调拨单:", returnData.data, function() {
                    $('#movestock_submit').click()
                });
            }, 'application/x-www-form-urlencoded')
        }else{
            layer.msg('请勾选需要删除的数据')
        }
    })
    /**
     * 批量删除
     */
    $('#movestock_batchDel').click(function(returnData){
        var data = table.checkStatus('movestock_data_table').data
        var ids = data.map(function(item){
            return item.id
        }).join(',')
        //var warehouseId = '1'
        if(data.length>0){
            var warehouseId = data[0].warehouseId
            initAjax('/skuLocationTransfer/deleteSelectedProducts.html','POST',{ids:ids},function(returnData){
                layer.msg(returnData.msg||'批量删除成功', {icon: 1})
                $("#movestock_submit").click()
            }, 'application/x-www-form-urlencoded')
        }else{
            layer.msg('请勾选需要删除的数据', {icon: 7})
        }
    })

    /**
     * 修改类型
     */
    $('#movestock_update_transfer_type').click(function (returnData) {
        //打开选择移库类型弹框
        openTransferSelectForm(2);
    })

    function updateTransferType(transferType, data) {
        var request = {};
        if (!transferType || transferType.trim() === "") {
            layui.admin.load.hide();
            layer.msg('请勾选需要修改的移库类型!');
            return;
        }
        request.transferType = transferType;
        if (data.length > 0) {
            //获取第一个当做批次号进行比对
            let batchNumber = data[0].batchNumber;
            let tempList = [];
            // if (!batchNumber || batchNumber === "") {
            //     layui.admin.load.hide();
            //     layer.msg('只能针对已生成批次号的商品进行修改移库类型');
            //     return;
            // }
            for (let index in data) {
                let tempItem = data[index];
                let temp = tempItem.batchNumber;
                // if (!temp || temp.trim() === "") {
                //     layui.admin.load.hide();
                //     layer.msg('只能针对已生成批次号的商品进行修改移库类型');
                //     return;
                // }
                if (temp !== batchNumber) {
                    layer.msg('只能针对同一批次号的商品进行修改移库类型');
                    layui.admin.load.hide();
                    return;
                }
                if (!tempItem.sku || tempItem.sku.trim() == "") {
                    layui.admin.load.hide();
                    layer.msg('请选择需要进行修改移库类型的商品!')
                    return;
                }
                let tempData = {};
                tempData.sku = tempItem.sku;
                tempData.batchNumber = tempItem.batchNumber;
                tempData.id = tempItem.id;
                tempList.push(tempData);
            }
            request.list = tempList;
            request.warehouseId = data[0].warehouseId
            initAjax('/skuLocationTransfer/updateCommonBatchNumberTransferType.html', 'POST', JSON.stringify(request), function (returnData) {
                layer.closeAll();
                layer.msg(returnData.msg || '修改类型成功');
            }, null ,null ,1)
        } else {
            layui.admin.load.hide();
            layer.msg('请勾选需要修改的数据')
        }
    }
    /**导入*/
    $('#movestock_import').click(function() {
        var warehouseId = $("#movestock_search_form").find('select[name="warehouseId"]').val();
        if(warehouseId){
        $('#movestock_import_file').click();
        }else{
            layer.msg('请选择仓库', {icon:7});
        }
    });
    // 通过导入excel 新增其它入库商品
    $('#movestock_import_file').on('change', function() {
        var files = $('#movestock_import_file')[0].files
        if (files.length == 0) {
            return;
        }
        // 校验文件类型
        var fileName = files[0].name
        var seat = fileName.lastIndexOf(".");
        var extension = fileName.substring(seat).toLowerCase();
        console.log(extension,'extension')
        if (extension != '.xlsx' && extension != '.xls') {
            layer.msg('请传入后缀为.xlsx或者.xls 的Excel文件', { icon: 0 })
            return
        }
        var formData = new FormData();
        formData.append("file", files[0]);
        formData.append("warehouseId", $("#movestock_search_form").find('select[name="warehouseId"]').val());
        let inex=layer.confirm('确认导入这个文件吗', { btn: ['确认', '取消'] },
            function() {
                loading.show()
                $.ajax({
                    url: ctx + '/skuLocationTransfer/importExcel.html',
                    type: 'post',
                    data: formData,
                    processData: false,
                    contentType: false,
                    success: function(returnData) {
                        loading.hide()
                        $('#movestock_import_file').val('')
                        returnData = returnData
                        let trackReg = /(?<=sku:).*?(?=:)/g;
                        let copy_arr=[];
                        let failInfoStr="";
                        let success_num=0;
                        let fail_num=0;
                        let copy_msg='';
                        if (returnData.code == '0000') {
                            let failInfo=''
                            if(returnData.data.failList.length>1){
                                failInfo = returnData.data.failList.join('!,');
                            }else{
                                failInfo= returnData.data.failList[0];
                            }
                            copy_arr = failInfo.match(trackReg);
                            failInfo.split('!,').forEach(function(item){
                                failInfoStr+='<br>'+item
                            })
                            success_num=returnData.data.count;
                            fail_num=copy_arr.length;
                            copy_msg=`<span onclick="layui.admin.onlyCopyTxt('${copy_arr.join(",")}')"class="copy-icon"> 
                            <svg t="1710754196184" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2392" width="16" height="16">
                            <path d="M768 832q-0.992 54.016-37.504 90.496T640 960H192q-54.016-0.992-90.496-37.504T64 832V384q0.992-54.016 37.504-90.496T192 256v64q-27.008 0.992-44.992 19.008T128 384v448q0.992 27.008 19.008 44.992T192 896h448q27.008-0.992 44.992-19.008T704 832h64zM384 128q-27.008 0.992-44.992 19.008T320 192v448q0.992 27.008 19.008 44.992T384 704h448q27.008-0.992 44.992-19.008T896 640V192q-0.992-27.008-19.008-44.992T832 128H384z m0-64h448q54.016 0.992 90.496 37.504T960 192v448q-0.992 54.016-37.504 90.496T832 768H384q-54.016-0.992-90.496-37.504T256 640V192q0.992-54.016 37.504-90.496T384 64z" p-id="2393" fill="#aaaaaa">
                            </path></svg> </span>`;
                        } else {
                            let fail_msg=returnData.msg;
                            copy_arr = fail_msg.match(trackReg);
                            if(copy_arr){
                                fail_msg.split(';').forEach(function(item){
                                    failInfoStr+='<br>'+item
                                })
                                fail_num=copy_arr.length;
                                copy_msg=`<span onclick="layui.admin.onlyCopyTxt('${copy_arr.join(",")}')"class="copy-icon"> 
                                <svg t="1710754196184" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2392" width="16" height="16">
                                <path d="M768 832q-0.992 54.016-37.504 90.496T640 960H192q-54.016-0.992-90.496-37.504T64 832V384q0.992-54.016 37.504-90.496T192 256v64q-27.008 0.992-44.992 19.008T128 384v448q0.992 27.008 19.008 44.992T192 896h448q27.008-0.992 44.992-19.008T704 832h64zM384 128q-27.008 0.992-44.992 19.008T320 192v448q0.992 27.008 19.008 44.992T384 704h448q27.008-0.992 44.992-19.008T896 640V192q-0.992-27.008-19.008-44.992T832 128H384z m0-64h448q54.016 0.992 90.496 37.504T960 192v448q-0.992 54.016-37.504 90.496T832 768H384q-54.016-0.992-90.496-37.504T256 640V192q0.992-54.016 37.504-90.496T384 64z" p-id="2393" fill="#aaaaaa">
                                </path></svg> </span>`;
                            }else{
                                failInfoStr="<br>"+fail_msg
                            }

                        }
                            layer.open({
                                title: "导入结果",
                                icon: 7,
                                type:1,
                                btn:'确定',
                                area:['30%','40%'],
                                content:`<div>
                                <div style='width: 30px;height: 30px;float: left;padding: 10px 10px'>
                                    <i class="layui-layer-ico layui-layer-ico7" style='width:100%;height:100%;display: inline-block'></i>
                                </div>
                                <div style='line-height: 2;float: left;padding-top: 15px;width: calc(100% - 60px);'>
                                    <span>导入商品：成功${success_num}个，失败${fail_num}个 ${copy_msg}</span>
                                    ${failInfoStr}
                                </div>
                            </div>`,
                            success: function(layero){
                                layer.close(inex)
                              },
                                end: function() {
                                    $("#movestock_submit").click();
                                }
                            });   
                    },
                    error: function() {
                        loading.hide()
                        $('#movestock_import_file').val('')
                    }
                });
            },
            function() {
                $('#movestock_import_file').val('');
                layer.closeAll()
            }
        )
    });
    //触发打印功能
    form.on('select(movestock_printFilter)', function(data){
        if (data.value == 'printBatchNo') { //打印批次号
            $("#movestock_print_batch").trigger('click');
        } else if (data.value == 'printTransferOrder') {//打印调拨单
            $("#movestock_print_allocation_order").trigger('click');
        }
    }); 

    /**
     * 打印批次号
     */
    $("#movestock_print_batch").click(function () {
        var data = table.checkStatus('movestock_data_table').data
        if (data.length > 0) {
            var ids = data.map(function (item) {
                return item.id
            });
            $.ajax({
                url:  ctx + '/skuLocationTransfer/getBatchNumber.html',
                type: "POST",
                contentType:"application/json",
                data:JSON.stringify(ids),
                dataType: "json",
                success: function (result) {
                    //打印批次号
                    if (result.code == "0000") {
                        if (result.count == 0) {
                            layer.msg("选择的商品没有批次号无法打印", {icon: 2});
                            return;
                        }
                        //组装需要打印的数据
                        var data = result.data;
                        var arr = [];
                        for (let index in data) {
                            let temp = {};
                            temp.printName = "6515";
                            temp.printerName = "6515";
                            temp.printNumber = 1;
                            temp.skuNumber = data[index].count;
                            temp.batchNumber = data[index].batchNumber;
                            arr.push(temp);
                        }
                        batch_number_print(arr);
                    } else {
                        layer.msg(result.msg, {icon: 2});
                    }
                },
                error: function (response) {
                    loading.hide();
                }

            });
        } else {
            layer.msg('请勾选需要打印此号的数据', {icon:7});
        }
    });

    /**
     * 打印调拨单
     */
    $("#movestock_print_allocation_order").click(function() {
        const data = table.checkStatus("movestock_data_table").data;
        if (data.length <= 0) {
            return layer.msg("请勾选数据", { icon: 7 });
        }
        let idsArr = data.map(item => item.id);
        commonReturnPromise({
          url: '/lms/printTemplate/printTransferOrder',
          params: {
            skuLocationTransferId: idsArr.join(',')
          }
        }).then(async res => {
          let successResults = res.successResults;
          let labelUrlArr = [];
          if(successResults.length>0){
            for(let i=0; i<successResults.length; i++){
              let item = successResults[i];
              labelUrlArr.push(item.labelUrl);
              // await Promise.resolve(logistics_label_pdf_print(obj));
            }
            let obj = {};
            obj.printType = 19;
            obj.labelUrl = labelUrlArr.join(',');
            obj.width = successResults[0].width;
            obj.height = successResults[0].height;
            obj.printName = successResults[0].printName;
            logistics_label_pdf_print(obj);
          }

        })
        // const arr = data.map(item => ({
        //     printName: "6515",
        //     printerName: "6515",
        //     printNumber: 1,
        //     sku: item.sku,
        //     transferOrderCount: item.transferOrderCount,
        //     tranOrderId: item.tranOrderId,
        //     inLocationCode: item.inLocationCode || '',
        //     batchNumber: item.batchNumber,
        //     moveNum: item.moveNum || '',
        //     locationCode: item.locationCode || '',
        //     buildingNo: item.buildingNo || '',
        //     basketNo: item.basketNo || '',
        //     floorNo: item.floorNo || ''
        // }));
        // epeanPrint_plugin_fun(22, arr);
    });
  

     //触发下载功能
     form.on('select(movestock_downloadFilter)', function(data){
        if (data.value == 'export_transfer') { //移库取货数量
            $("#movestock_export_transfer").trigger('click');
        } else if (data.value == 'export_transfer_four_sales') {//父商品前4个子商品销量
            $("#movestock_export_transfer_sales").trigger('click');
        }else if (data.value == 'export_transfer_all_sales') {//父商品全部子商品销量
            $("#movestock_export_all_transfer_sales").trigger('click');
        }else if (data.value == 'export_transfer_down_tempalte') {//下载导入模板
            window.open(
                ctx + "/static/templet/移库取货上传格式.xls",
                "_blank"
            );
        }else if(data.value == 'export_pandian'){ // 盘点导出
            const obj = serializeObject($("#movestock_search_form"));
            if (obj.whMoveStockTimeInput && obj.whMoveStockTimeInput !== '') {
                const timeInput = obj.whMoveStockTimeInput;
                obj.startTime = timeInput.substring(0, 10) + " 00:00:00";
                obj.endTime = timeInput.substring(12) + " 23:59:59";
            }
            // if(obj.transferType !='950'){
            //    return layer.msg("请选择移库类型为盘点!")
            // }
            obj.transferTypeList = formSelects.value("sku_location_transfer_type", "val").map(Number);
            const unAbleByExtends1 = TransferTypeListEnum.some((v) => obj.transferTypeList.includes(v.id) && v.extend1 != 4);
            // formSelects.value('sku_location_transfer_type', 'val');
            // let extend1 = $('#sku_location_transfer_type').find('option:selected').attr('data-extend1');
            if(!obj.transferTypeList.length || unAbleByExtends1){
              return layer.msg("仅拓展4的类型可盘点!", {icon: 7});
            }
            if (!obj.warehouseId) {
                layer.msg("仓库必选!")
                return;
            }
            transBlob({
                fileName: '盘点导出.xlsx',
                url: ctx + '/skuLocationTransfer/exportPandian',
                formData: JSON.stringify(obj),
                contentType: "application/json;charset=UTF-8",
              }).then(function (result) {
                layer.msg(result, { icon: 1 })
              }).catch(function (err) {
                layer.msg(err, { icon: 2 })
              })
        }
    }); 


    /**
     *
     * @param data
     */
    $("#movestock_export_transfer").click(function (){
        var obj = serializeObject($("#movestock_search_form"));
        if (obj.whMoveStockTimeInput && obj.whMoveStockTimeInput !== '') {
            var timeInput = obj.whMoveStockTimeInput;
            obj.startTime = timeInput.substring(0, 10) + " 00:00:00";
            obj.endTime = timeInput.substring(12) + " 23:59:59";
        }
        if (!obj.warehouseId) {
            layer.msg("仓库必选!")
            return;
        }
        var Confirmindex = layer.confirm('确认导出当前搜索条件下的所有信息？',{btn:['确认','取消']},function (result) {
            if(result){
                layer.close(Confirmindex );
                submitForm(obj,ctx + '/skuLocationTransfer/export.html',"_blank");
            }
        })
    });

    // //渲染楼层
    // function movestock_renderCurrentFloor(){
    //     commonReturnPromise({
    //         type: 'post',
    //         url: '/lms/pdaErrorFeedBack/searchWarehouseFloorNumberList.html'
    //     }).then(result => {
    //         commonRenderSelect('movestock_current_floor', result.data).then(function(){
    //             form.render('select');
    //         })
    //     })
    // }
    // movestock_renderCurrentFloor();
    /**
     *导出销量start
     * @param data
     */
    $("#movestock_export_transfer_sales").click(function (){
        var obj = serializeObject($("#movestock_search_form"));
        if (!obj.warehouseId) {
            layer.msg("仓库必选!")
            return;
        }
        var Confirmindex = layer.confirm('确认导出当前搜索条件下的所有信息？',{btn:['确认','取消']},function (result) {
            if(result){
                layer.close(Confirmindex );
                submitForm(obj,ctx + '/skuLocationTransfer/exportSales.html',"_blank");
            }
        })
    });
    $("#movestock_export_all_transfer_sales").click(function (){
        var obj = serializeObject($("#movestock_search_form"));
        obj.exportAll = true;
        if (!obj.warehouseId) {
            layer.msg("仓库必选!")
            return;
        }
        var Confirmindex = layer.confirm('确认导出当前搜索条件下的所有信息？',{btn:['确认','取消']},function (result) {
            if(result){
                layer.close(Confirmindex );
                submitForm(obj,ctx + '/skuLocationTransfer/exportSales.html',"_blank");
            }
        })
    });
    //导出销量 end

    function batch_number_print(data) { //打印标签
        epeanPrint_plugin_fun(15,data);
    }


    //页面下拉框枚举类型填充
    function fillWarehouse() {
        initAjax('/skuLocationTransfer/getAuthedProdWarehouseList.html','get',{},function(returnData){
            if (returnData.code == "0000") {
                appendSelect('movestock_search_form','warehouseId', returnData.data,'id','warehouseName');
                let defaultWarehouseId;
                $(returnData.data).each(function () {
                    if(this.warehouseName == '义乌仓'){
                        defaultWarehouseId = this.id;
                        $("#movestock_search_form option[value="+this.id+"]").prop("selected",true);
                    }
                });
                render_order_build_floor("#movestock_search_form",defaultWarehouseId)
                layui.form.render('select');
            }
        })
    };
    /**
     * 页面移库类型下拉框枚举类型填充
     * @param type 1 ->生成批次号->修改类型,1 ->生成批次号->修改类型,3->修改类型
     */
    function fillTransferType(pre, dom, type='') {
        initAjax('/tranOrder/getTranBizDict.html', 'get', {headCode: "MOVE_TRANSFER_TYPE"}, function (returnData) {
            if (returnData.code == "0000") {
                const unSupportObj = {name: "调拨取货" };
                if (type === 1) {
                // 暂不支持修改其它类型为调拨取货
                returnData.data = returnData.data.filter(item => item.name == unSupportObj.name);
                } else if (type === 2) {
                // 暂不支持修改其它类型为调拨取货
                returnData.data = returnData.data.filter(item => item.name !== unSupportObj.name);
                }else if(type ===3){
                    returnData.data = returnData.data.filter(item=>item.extend1 == 4)
                }
                appendSelect(pre, dom, returnData.data, 'id', 'name');
                layui.form.render('select');
            }
        })
    };

    // function fillbuildNo() {
    //     initAjax('/skuLocationTransfer/getBuildingNo.html','post',{},function(returnData){
    //         if (returnData.code == "0000") {
    //             appendSelect('movestock_search_form','buildingNo', returnData.data);
    //             layui.form.render('select');
    //         }
    //     })
    // };
    //监听标签点击
    element.on('tab(movestock-tabs)', function(data){
      let index = data.index;//得到当前Tab的所在下标
      let $status = $('#movestock_search_form').find('[name=status]');
      if(index == 0){ //数量
          $status.val(true);
          $('#movestockCard-handleBtn').show();
          $('#movestockCardTab2-handleBtn').hide();
          $('#movestockCardTab3-handleBtn').hide();
      }else if(index ==1){ //作废
          $status.val(false);
          $('#movestockCard-handleBtn').hide();
          $('#movestockCardTab2-handleBtn').show();
          $('#movestockCardTab3-handleBtn').hide();

      }else{
        $status.val('')
        $('#movestockCard-handleBtn').hide();
        $('#movestockCardTab2-handleBtn').hide();
        $('#movestockCardTab3-handleBtn').show();

      }
      $('#movestock_submit').trigger('click');
  });

    function getMovestockTableData(data){
        initAjax('/skuLocationTransfer/search.html','post',JSON.stringify(data),function(returnData){
            movestock_table_render_fun(returnData.data)
            movestockrenderpage(returnData.count,data.page,data.limit)
            $('#movestockCard').find('#movestock-tabs li>span').text('');
            //returnData.count
            // $('#movestockCard').find('#movestock-tabs li.layui-this>span').text(`(${returnData.count})`);
            commonReturnPromise({
              url: '/lms/skuLocationTransfer/statusCount',
              type: 'post',
              contentType: 'application/json',
              params: JSON.stringify(data)
            }).then(res =>{
              let lis = $('#movestockCard').find('#movestock-tabs li');
              for(let i=0; i<lis.length; i++){
                let liItem = lis[i];
                let txt= $(liItem).text();
                console.log(txt);
                if(txt == '有效'){
                  console.log($(liItem).find('span'));
                  $(liItem).find('span').text(`(${res['有效']})`);
                }
                if(txt == '作废'){
                  $(liItem).find('span').text(`(${res['作废']})`);
                }
                if(txt == '全部'){
                  $(liItem).find('span').text(`(${res['全部']})`);
                }
              }
            });
        });
        
    }
    //列表表格
    function movestock_table_render_fun(data) {
         // 不同类型展示不同时间内容
        let timeObj={
            '移库':[{
                label:'创建',
                key:'createTime'
            },{
                label:'批次',
                key:'batchTime'
            },{
                label:'取货',
                key:'consigneeTime'
            },{
                label:'上架',
                key:"moveLocationTime",
            }, {
              label:'作废',
              key:'cancelTime'
            }],
            '配货':[{
                label:'创建',
                key:'createTime'
            },{
                label:'批次',
                key:'batchTime'
            },{
                label:'取货',
                key:'consigneeTime'
            }, {
              label:'作废',
              key:'cancelTime'
            }],
            '调拨':[{
                label:'创建',
                key:'createTime'
            },{
                label:'批次',
                key:'batchTime'
            },{
                label:'取货',
                key:'consigneeTime'
            },{
                label:'审核',
                key:'auditTime'
            }, {
              label:'作废',
              key:'cancelTime'
            }],
            '盘点':[{
                label:'创建',
                key:'createTime'
            },{
                label:'批次',
                key:'batchTime'
            },{
                label:'盘点',
                key:'consigneeTime'
            }, {
              label:'作废',
              key:'cancelTime'
            }],
         }
         let operatorObj={
            '移库':[{
                label:'创建',
                key:'creator'
            },{
                label:'批次',
                key:'batchUserName'
            },{
                label:'取货',
                key:'consigneeName'
            },{
                label:'上架',
                key:"moveLocationUserName",
            },{
              label:'作废',
              key:'cancelUserName'
          }],
            '配货':[{
                label:'创建',
                key:'creator'
            },{
                label:'批次',
                key:'batchUserName'
            },{
                label:'取货',
                key:'consigneeName'
            }, {
                label:'作废',
                key:'cancelUserName'
            }],
            '调拨':[{
                label:'创建',
                key:'creator'
            },{
                label:'批次',
                key:'batchUserName'
            },{
                label:'取货',
                key:'consigneeName'
            },{
                label:'审核',
                key:'auditor'
            },{
              label:'作废',
              key:'cancelUserName'
          }],
            '盘点':[{
                label:'创建',
                key:'creator'
            },{
                label:'批次',
                key:'batchUserName'
            },{
                label:'盘点',
                key:'consigneeName'
            },{
              label:'作废',
              key:'cancelUserName'
          }],
         }
        layui.table.render({
            elem: "#movestock_data_table",
            data:data,
            id: 'movestock_data_table',
            cols: [
                [
                    { type: "checkbox", width: 30 },
                    { title: "仓库", field: 'warehouseName', },
                    { title: "批次号", field: 'batchNumber', templet: '#movestock_batchNumber' },
                    { title: "业务单号", field: 'tranOrderId' },
                    { title: "sku", field: 'sku' },
                    { title: "移库类型", field: 'headName' },
                    { title: "多款式数量", field: 'multipartNum' },
                    { title: "目标通道", field: 'targetAisle' },
                    { title: "库位信息", field: 'locationCode', templet: function (res) {
                            return `<div>楼栋：${res.buildingNo || ''} <br>楼层：${res.floorNo || ''}</div><div>${res.locationCode || ''}</div>`
                        } },
                    // { title: "当时楼栋", field: 'buildingNo' },
                    // { title: "当时楼层", field: 'floorNo' },
                    { title: "当时库存", templet:'#currentStock' },
                    { title: "取货/盘点", field: 'checkInventory' },
                    { title: "调拨数量", field: 'moveNum' },
                    { title: "移入库位", field: 'moveLocationCode' },   
                    { title: "操作人", templet: d=>{
                        let str =`<input type="hidden" name="status" value="${d.status}">`
                        // 不同类型展示不同操作人内容
                          if(d.transferTypeCnName){
                              operatorObj[d.transferTypeCnName].forEach(item=>{
                                  if(d.status == true && item.label == '作废'){
                                    str +=''
                                  }else{
                                    str =str + `<div class="text_l"><span class="font_color">${item.label}:</span><span>${d[item.key]||""}</span></div>`
                                  }
                              })
                          }
                          return str
                    }},
                    // templet:'#movestock_operatTime'
                    { title: "操作时间",width:200,templet:d=>{
                        // 不同类型展示不同时间内容
                        let str =''
                        if(d.transferTypeCnName){
                            timeObj[d.transferTypeCnName].forEach(item=>{
                              if(d.status == true && item.label == '作废'){
                                str +=''
                              }else{
                                str =str +   `<div class="text_l"><span class="font_color">${item.label}:</span><span>${Format((d[item.key]),"yyyy-MM-dd hh:mm:ss")}</span></div>`
                              }
                            })
                        }
                        return str
                    }},
                    { title: "备注", field: 'remark' },   
                ]
            ],
            page: false,
            done: function(res) { 
                // 全部页签--作废状态底色置灰
                const status = $('#movestock_search_form').find('input[name=status]').val()
                if(status==''){
                    const $trDomList = $('#movestock_data_table').next().find('tbody tr')
                    $trDomList.each(function(){
                        const status =$(this).find('input[name=status]').val()
                        if(status=='false'){
                             $(this).css('background','#efefef')
                        }
                    })
                }
            },
            limit: 1000,
        });
    };

        //渲染分页
        function movestockrenderpage(count, current, limit) {
            laypage.render({
                elem: 'movestock_page',
                curr: current,
                limit: limit,
                limits: [20 , 30 , 50, 100, 150, 500, 1000],
                layout: ['prev', 'page', 'next', 'limit'],
                count: count,
                jump: function(obj, first) {
                    $('#movestock_search_form input[name="limit"]').val(obj.limit);//保障下次的分页请求中带有的值正确
                    $('#movestock_search_form input[name="page"]').val(obj.curr);//保障下次的分页请求中带有的值正确
                    //首次不执行
                    if (!first) {
                        var data = getFormReqObj("movestock_search_form");
                        data.page = obj.curr;
                        data.limit = obj.limit;
                        $('#movestock_submit').click()
                    }
                }
            });
        }
    

});
// // 填充下拉框
// function appendoption(pre, domName, obj) {
//     var $li = '<option value="">请选择</option>';
//     for (var i in obj) {
//         if (obj[i]) {
//             $li += '<option value=' + obj[i].id + '>' + obj[i].warehouseName + '</option>';
//         }
//     }
//     $("#" + pre + domName).append($li);
// }

function appendSelect(pre, dom, data, code, label, attachment) {
    $('#' + pre + ' #' + dom).empty();
    var option = '<option value="">请选择</option>'
    for (var i in data) {
        if (typeof data[i] !== 'string') {
            attachment ?
                data[i].code = data[i][code] + '_' + data[i][attachment] :
                data[i].code = data[i][code] || data[i].code
            data[i].label = data[i][label] || data[i].label;
        }
        option += '<option value="' + (data[i].code || data[i]) + '">' + (data[i].label || data[i]) + '</option>'
    }
    $('#' + pre + ' #' + dom).append(option)
}

//初始化ajax请求
function initAjax(url, method, data, func, contentType, showLoading ,layerLoadingHidden) {
        //默认loading
        if (!showLoading) {
            loading.show();
        }
        $.ajax({
            type: method,
            url: ctx + url,
            dataType: 'json',
            async: true,
            data: data,
            contentType: contentType || 'application/json',
            success: function (returnData) {
                loading.hide();
                if (!layerLoadingHidden) {
                    layui.admin.load.hide();
                }
                if (returnData.code == "0000") {
                    func(returnData)
                } else if (returnData.code == "0001") {
                    layer.alert(returnData.msg, {icon: 2, area: ['40%', '60%']});
                } else {
                    layer.alert(returnData.msg, {icon: 2, area: ['40%', '60%']});
                }
            },
            error: function(returnData) {
                layui.admin.load.hide();
                if (XMLHttpRequest.status == 200) {
                    layer.msg("请重新登录", { icon: 7 });
                } else {
                    layer.msg("服务器错误", { icon: 2 });
                }
            },
            complete: function(returnData) {
                if (!layerLoadingHidden) {
                    layui.admin.load.hide();
                }
                loading.hide();
            }
        });
    }

    function getFormReqObj(formIdName) {//获取表单参数
        var d = {};
        var t = $('#' + formIdName + ' [name]').serializeArray();
        $.each(t, function () {
            d[this.name] = this.value;
        });
        return d;
    }


