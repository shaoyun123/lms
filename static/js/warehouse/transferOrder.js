layui.use(['form', 'table', 'layer', 'element', 'laypage', 'laytpl', 'laydate', 'laypage'], function() {
    var form = layui.form,
        table = layui.table,
        element = layui.element,
        laydate = layui.laydate,
        laypage = layui.laypage,
        laytpl = layui.laytpl
    layer = layui.layer;
    form.render();
    laydate.render({
        elem: '#transferorder_time',
        type: 'date',
        range: true
    });


    var transferOrder = {
        initData:{
            warehouse:null,
            transferType:null,
            expressCompany:null
        },
        init:function(){
            var _this = this
            _this.submit()
            _this.initTime()
            _this.listenOntool()
            _this.newTransferOrder()
            _this.tabSwich()
            _this.exportDatas()
            _this.batchAudit()
            _this.batchInvalid()
            _this.downloadFile()
            getWarehouse()
            getTransferType('TRANSFER_TYPE',function(returnData){
                transferOrder.initData.transferType = returnData.data
                transferAppendSelect("#transferorderForm select[name='tranType']",returnData.data,'code','name')
            })
            getTransferType('EXPRESS_COMPANY',function(returnData){
                transferOrder.initData.expressCompany = returnData.data
            })
            getCreator()
        },
        submit:function(){
            var _this = this
            form.on('submit(transferOrderSearch)', function(data) {
                if (data.field.time) {
                    data.field.greatThenTime = data.field.time.split(' - ')[0] + ' 00:00:00';
                    data.field.lessThenTime = data.field.time.split(' - ')[1] + ' 23:59:59';
                }
                _this.getTransferOrderData(data.field)
            });
        },
        initTime:function(){
            var nowdate = new Date()
            var endDate = Format(new Date(), 'yyyy-MM-dd')
            var onemonth = Format(new Date(nowdate - 30 * 24 * 3600 * 1000), 'yyyy-MM-dd')
            $('#transferorder_time').val(onemonth + ' - ' + endDate)
        },
        getTransferOrderData(data){
            var _this = this
            // getTransferOrder(data,function(returnData){
            //     _this.tableRender(returnData.data)
            // })
            _this.tableRender(data)
        },
        tableRender:function(data){
            let _this = this
            let consigneeStatus = data.consigneeStatus
            if(consigneeStatus === '0'){
                consigneeStatus = 0
            }else if (consigneeStatus === '1'){
                consigneeStatus = 1
            }
            commonReturnPromiseRes({
              url: '/lms/tranOrder/search.html',
              contentType: 'application/json',
              type: 'post',
              params: JSON.stringify(data)
            }).then(res => {
              //渲染表格
              _this.tableRender2(res);
              //渲染分页
              _this.pageRender(data, res);
            });

        },
        tableRender2(res){
          let _this=this;
          table.render({
            elem: '#transferOrder_table',
            data:res.data,
            cols: [
                [
                    { checkbox: true, width: 30 },
                    { title: "调拨单号", field: "tranOrderId" },
                    { title: "调出仓库", field: "outWareHouseName"},
                    { title: "调入仓库", field: "intoWareHouseName" },
                    { title: $('#transferOrder_Detil').html(), field: "shippingUsername", templet: "#transferorder_detail_tpl",width:500 },
                    { title: "其他成本", field: "logisTypeName", templet: '#transferorder_costs_tpl' },
                    { title: "人员", field: "time", templet: "#transferorder_operator_tpl" },
                    { title: "时间", templet: "#transferorder_time_tpl" },
                    { title: "备注", field: "remark" },
                    { title: '操作', toolbar: "#transferorder_option_tpl", width: 100 }
                ]
            ],
            page: false,
            limit: 9999,
            id: 'transferOrder_table',
            done: function() {
                _this.expandTrandfer();
                //渲染tab
                for(let i in res.extra){
                  $('#transferOrder_Tab li[data-index="'+i+'"]').find('span').text(res.extra[i])
                }
            }
          });
        },
        //20231129-ztt-新增分页处理
        trigger(){
          $('#transferorderForm').find('#transferOrderSearch').trigger('click');
        },
        pageRender(data,res){
          let _this = this
          let  {count } = res;
          laypage.render({
            elem: 'transferOrder_pagination',
            count: count,
            curr: data.curr,
            limit: data.limit,
            limits: [100, 200, 500],
            layout: ["prev", "page", "next", "count", "limit"],
            jump: function(obj, first) {
                //首次不执行
                $('#transferorderForm input[name="limit"]').val(obj.limit); //保障下次的分页请求中带有的值正确
                $('#transferorderForm input[name="page"]').val(1); //保障下次的分页请求中带有的值正确
                if (!first) {
                  $('#transferorderForm input[name="page"]').val(obj.curr);
                  // $('#transferorderForm input[name="limit"]').val(obj.limit);
                  data.page = obj.curr;
                  data.limit = obj.limit;
                  commonReturnPromiseRes({
                    url: '/lms/tranOrder/search.html',
                    contentType: 'application/json',
                    type: 'post',
                    params: JSON.stringify(data)
                  }).then(res => {
                    //渲染表格
                    _this.tableRender2(res);
                  });
                }
            }
        }); //laypage结束
        },
        //20231129-ztt-新增分页处理完毕
        tabSwich:function(){
            element.on('tab(transferOrder_Tab)', function(data) {
                // var status = data.index
                var status = $('#transferOrder_Tab .layui-tab-title li').eq(data.index).data('index');
                if(data.index == 0){
                  // 已审核状态隐藏批量审核
                  $('#transferOrder_relocationAndPickup').removeClass('disN')
                  $('#transferOrder_onestopreview').addClass('disN');//一条龙审核
                  $('#transferOrder_batchAudit').removeClass('disN')
                  $('#transferOrder_batchInvalid').removeClass('disN')
                }else if(status == 1){
                    // 已审核状态隐藏批量审核
                  $('#transferOrder_batchAudit').addClass('disN')
                  $('#transferOrder_batchInvalid').addClass('disN')
                  $('#transferOrder_relocationAndPickup').addClass('disN')
                  $('#transferOrder_relocationAndPickup').addClass('disN')
                  $('#transferOrder_onestopreview').addClass('disN')
                }else if(status == 2){
                  $('#transferOrder_relocationAndPickup').addClass('disN')
                  $('#transferOrder_batchAudit').addClass('disN')
                  $('#transferOrder_batchInvalid').addClass('disN')
                  $('#transferOrder_onestopreview').addClass('disN')
                }else if(status==4){
                    $('#transferOrder_relocationAndPickup').addClass('disN');
                    $('#transferOrder_batchInvalid').addClass('disN');
                    $('#transferOrder_onestopreview').addClass('disN')
                    $('#transferOrder_batchAudit').removeClass('disN')
                }else if(status==5){
                    $('#transferOrder_onestopreview').addClass('disN');
                    $('#transferOrder_batchAudit').addClass('disN');
                    $('#transferOrder_relocationAndPickup').addClass('disN');
                    $('#transferOrder_batchInvalid').addClass('disN');
                }
                $('#transferorderForm input[name="status"]').val(status)
                $('#transferorderForm input[name="page"]').val(1); 
                $('#transferOrderSearch').click()
            });
        },
        listenOntool:function(){
            var _this = this
            table.on("tool(transferOrder_table)", function(obj) {
                var data = obj.data
                if (obj.event === "transferOrder_modify") { //修改
                        _this.transferOrderNewandEdit(data)
                } else if (obj.event === "transferorder_auth") { //审核
                    layer.confirm('要审核这条数据吗', {icon: 3, title:'提示'}, function(index){
                        authTransferOrder({id:data.mainId,tranOrderId:data.tranOrderId},function(returnData){
                            $('#transferOrderSearch').click()
                            layer.msg(returnData.msg||'审核成功')
                            layer.close(index)
                        })
                    });
                } else if (obj.event === "transferorder_abondon") { //废弃
                    layer.confirm('确定要废弃这条数据吗', {icon: 3, title:'提示'}, function(index){
                        abondonTransferOrder({id:data.mainId,tranOrderId:data.tranOrderId},function(returnData){
                            $('#transferOrderSearch').click()
                            layer.msg(returnData.msg||'废弃成功')
                            layer.close(index)
                        })
                    });
                }else if (obj.event === "transferorder_print") {
                    const url = ctx + "/static/html/storage_transfer_print.html?tranOrderId=" + data.tranOrderId + "&status=" + data.status
                    window.open(url, "_blank");                }
                else if(obj.event === "transferorder_detail"){
                    _this.transferOrderNewandEdit(data)
                }
            });
        },
        newTransferOrder:function(){
            var _this = this
            $('#LAY-transferOrder #transferOrder_new').click(function() {
                _this.transferOrderNewandEdit()
            })
        },
        transferOrderNewandEdit(data){
            var _this = this
            var isEdit = data?true:false
            var title = isEdit?'修改调拨单':'创建调拨单'
                layer.open({
                    type: 1,
                    title: title,
                    btn: ['提交', '取消'],
                    area: ['90%', '70%'],
                    content: $('#pop_transferorder_newandeditorder').html(),
                    success: function(layero, index) {
                        form.render()
                        _this.addproduct($(layero))
                        _this.updateCosts($(layero))
                        _this.importProduct($(layero))
                        transferAppendSelect("#transferorder_editForm select[name='outStorageId']",_this.initData.warehouse,'id','warehouseName')
                        transferAppendSelect("#transferorder_editForm select[name='intoStorageId']",_this.initData.warehouse,'id','warehouseName')
                        transferAppendSelect("#transferorder_editForm select[name='tranType']",_this.initData.transferType,'code','name')
                        transferAppendSelect("#transferorder_editForm select[name='deliveryType']",_this.initData.expressCompany,'id','name')
                        if (isEdit) {
                            $(layero).find('.btngroup').find('button').attr('disabled',true)
                            $(layero).find('select[name="outStorageId"]').attr('disabled',true)
                            $(layero).find('select[name="intoStorageId"]').attr('disabled',true)
                            $(layero).find('select[name="tranType"]').attr('disabled',true)
                            form.val("transferorder_editForm", data);
                            var tpl = productsDetailtpl.innerHTML;
                            var detailList = data.detailList
                            detailList.isEdit = isEdit
                            var tbodyContainer = $('#productsDetail')
                            laytpl(tpl).render(detailList, function(html){
                                tbodyContainer.append(html)
                                tbodyContainer.find('button').attr('disabled',true)
                                imageLazyload();
                            });
                            // for (var item of detailList) {
                            //     if (tbodyContainer.find('tr[data-index="'+item.prodSId+'"]').length == 0) {
                            //         //如果不存在，加一行
                            //         laytpl(tpl).render([item], function(html){
                            //             tbodyContainer.append(html)
                            //             tbodyContainer.find('button').attr('disabled',true)
                            //             imageLazyload();
                            //         });
                            //     }
                            // }
                        }
                        if(isEdit&&data.status!="0"){
                            $(layero).find('.layui-layer-btn0').addClass('hidden')
                        }
                    },
                    yes: function(index, layero) {
                        setTimeout(function(){
                            $(layero).find('#transferedit_submit').click();
                        },0)
                        var refData = _this.getCalBaseData($(layero))
                        var detailList = feeCalculator($('#productsDetail'),refData)
                        form.on('submit(transferedit_submit)', function(obj) {
                            var storage = obj.field
                            if(isEdit){
                                storage.id = data.mainId
                                storage.tranOrderId = data.tranOrderId
                                modifyTransferOder({storage,detailList},function(returnData){
                                    layer.msg(returnData.msg||'修改成功')
                                    $('#transferOrderSearch').click()
                                    layer.close(index)
                                })
                            }
                            else{
                            createTransferOder({storage,detailList},function(returnData){
                                layer.open({
                                  title: `操作结果`,
                                  content: `提交${returnData.count}个SKU,创建调拨单号:${returnData.data.successList[0]}<br>失败${returnData.data.failList.length}条<span>,具体失败原因如下:</span><br/>${returnData.data.failList.join('<br/>')}`,
                                  area:['700px','60%']
                                })
                                $('#transferOrderSearch').click()
                                layer.close(index)
                            })
                        }
                        })
                    },
                    close:function(index,layero){
                        $(layero).find('.btngroup').find('button').attr('disabled',false)
                    }
                })
        },
        addproduct(aDom){
            var _this = this
            $('#transferOrder_addProducts').click(function(){
                var wareHouseId = (aDom).find('select[name="outStorageId"]').val()
                if(!wareHouseId){
                    layer.msg('请先选择调出仓库')
                    return;
                }
                layer.open({
                    type: 1,
                    title: "添加商品",
                    area:['70%', '60%'],
                    shadeClose: false,
                    btn: ['保存', '关闭'],
                    content: $("#transferOrder_addProduct").html(),
                    success: function(layero,index) {
                        $(layero).find('button').click(function() {
                            var prodSSku = $(layero).find('input').val();
                            if (prodSSku == null || prodSSku == '') {
                                layer.msg('请输入商品sku再查询', { icon: 0 });
                                return false;
                            }
                            _this.productsTable({wareHouseId:wareHouseId,prodSSku:prodSSku});
                            return false;
                        });
                        $(layero).find('input').on('keyup', function(e) {
                            e.preventDefault();
                            e.stopPropagation();
                            if (e.keyCode == 13) {
                                var prodSSku = $(layero).find('input').val();
                                if (prodSSku == null || prodSSku == '') {
                                    layer.msg('请输入商品sku再查询', { icon: 0 });
                                    return false;
                                }
                                _this.productsTable({wareHouseId:wareHouseId,prodSSku:prodSSku});
                                return false;
                            }
                        })
                    },
                    yes: function(index, layero) {
                        var checkStatus = table.checkStatus('transferOrder_addProduct_table');
                        var checkdata = checkStatus.data
                        if(checkdata.length<=0){
                            layer.msg('请勾选要添加的商品数据')
                            return false;
                        }
                        var tpl = productsDetailtpl.innerHTML;
                        var tbodyContainer = $('#productsDetail')
                        var existProd = []
                        for (var item of checkdata) {
                            if (tbodyContainer.find('tr[data-index="'+item.prodSId+'"]').length == 0) {
                                //如果不存在，加一行
                                laytpl(tpl).render([item], function(html){
                                    tbodyContainer.append(html)
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
            })
        },
        productsTable(data){
            table.render({
                elem: "#transferOrder_addProduct_table",
                url: ctx + "/tranOrder/searchSku.html",
                where: { wareHouseId:data.wareHouseId,prodSSku: data.prodSSku },
                method: "get",
                id: 'transferOrder_addProduct_table',
                cols: [
                    [
                        { type: 'checkbox' },
                        { title: "图片", field: 'image', templet: '#transferorder_detail_img_tpl' },
                        { title: "商品SKU", field: 'prodSSku' },
                        { title: "商品名称", field: 'title' },
                        { title: "可用库存", field: 'available' },
                        { title: "出库含税单价(￥)", field: 'outTaxPer' },
                    ]
                ],
                done: function(res) {
                    imageLazyload();
                }
            });
        },
        getCalBaseData(aDom){
            var totalpackPersonFee = aDom.find('input[name="packPersonFee"]').val()||0
            var totalpackMaterialsFee = aDom.find('input[name="packMaterialsFee"]').val()||0
            var totalheadFreight = aDom.find('input[name="headFreight"]').val()||0
            var totaltariff = aDom.find('input[name="tariff"]').val()||0
            return {totalpackPersonFee,totalpackMaterialsFee,totalheadFreight,totaltariff}
        },
        updateCosts(aDom){
            var _this = this
            $('#updateCosts').click(function(){
                var refData = _this.getCalBaseData(aDom)
                var tbodyContainer = $('#productsDetail')
                var data = feeCalculator(tbodyContainer,refData)
                var tpl = productsDetailtpl.innerHTML;
                    laytpl(tpl).render(data, function(html){
                        tbodyContainer.html(html)
                        imageLazyload();
                    });    
            })
        },
        importProduct(aDom){
            $('#transferOrder_importPro_input').on('change', function() {
                var wareHouseId = (aDom).find('select[name="outStorageId"]').val()
                var files = $(this)[0].files
                if (files.length == 0) {
                    return
                }
                // 校验文件类型
                var fileName = files[0].name
                var seat = fileName.lastIndexOf(".");
                var extension = fileName.substring(seat).toLowerCase();
                if (extension != '.xlsx' && extension != 'xls') {
                    layer.msg('请传入后缀为.xlsx或者.xls 的Excel文件')
                    return
                }
                var formData = new FormData();
                formData.append("file", files[0]);
                formData.append("wareHouseId", wareHouseId);
                layer.confirm('确认导入这个文件进行批量新增子商品吗', { btn: ['确认', '取消'] },
                function(index) {
                loading.show()
                $.ajax({
                    url: ctx + '/tranOrder/importSku.html',
                    type: 'post',
                    // async : false,
                    data: formData,
                    // 告诉jQuery不要去处理发送的数据
                    processData: false,
                    // 告诉jQuery不要去设置Content-Type请求头
                    contentType: false,
                    success: function(data) {
                        loading.hide()
                        // 清空 excel
                        $('#transferOrder_importPro_input').val('')
                        if (data.code == '0000') {
                            var tpl = productsDetailtpl.innerHTML;
                            var tbodyContainer = $('#productsDetail')
                            var existprod = []
                            for (var item of data.data) {
                                if (tbodyContainer.find('tr[data-index="'+item.prodSId+'"]').length == 0) {
                                    //如果不存在，加一行
                                    laytpl(tpl).render([item], function(html){
                                        tbodyContainer.append(html)
                                        imageLazyload();
                                    });
                                }else{
                                    existprod.push(item.prodSSku)
                                }
                            }
                            layer.msg(`商品${existprod.join(',')}已存在`,{icon:2})
                            layer.msg(data.msg||'导入成功')
                        } else {
                            layer.alert(data.msg,{ icon: 7 ,time:5000})
                        }
                    },
                    error: function() {
                        loading.hide()
                        $('#transferOrder_importPro_input').val('')
                    }
                });
            },
            function(index) {
                layer.close(index)
            }
        )
    })
        },
        exportDatas(){
            $('#LAY-transferOrder #transferOrder_export').click(function(){
                setTimeout(()=>{
                    $('#actualtransferOrder_export').click()
                })
                form.on('submit(actualtransferOrder_export)',function(obj){
                    if (obj.field.time) {
                        obj.field.greatThenTime = obj.field.time.split(' - ')[0] + ' 00:00:00';
                        obj.field.lessThenTime = obj.field.time.split(' - ')[1] + ' 23:59:59';
                    }
                    exportTransferOrder(obj.field,function(returnData){
                        layer.msg(returnData.msg||'导出成功')
                    })
                })
            })
        },
        batchAudit(){
            $('#transferOrder_batchAudit').click(function(){
                var tranOrderIdArr = getTableSelectIds();
                if(tranOrderIdArr.length>0){
                    layer.confirm('确认要审核已选中的数据吗？', {
                        btn: ['确认','取消'], //按钮
                        title:'提示',
                        icon:7
                      }, function(){
                        initAjax('/tranOrder/batchAuditTranOrder.html', 'post', { tranOrderIds: tranOrderIdArr.join(',') }, function(returnData) {
                            layui.admin.batchResultAlert("审核调拨单:", returnData.data, function() {
                            $('#transferOrderSearch').click()
                        });
                        }, 'application/x-www-form-urlencoded');
                    });
                }else{
                    layer.msg("请勾选要审核的调拨单")
                }
            })
            // 生成移库取货
            $('#transferOrder_relocationAndPickup').click(function(){
                var tranOrderIdArr = getTableSelectIds();
                if(tranOrderIdArr.length>0){
                    layer.open({
                        type: 1,
                        title: '生成移库取货',
                        btn: ['确认', '关闭'],
                        area: ['40%', '80%'],
                        content: $('#pop_transferorder_relocationAndPickup').html(),
                        success: function (layero, index) {
                            initAjax('/tranOrder/getBizDictByHeadCode.html', 'get', {}, function(returnData) {
                                let opt = '<option></option>';
                                returnData.data.forEach(item=>{
                                    opt += `<option value="${item.id}">${item.name}</option>`;
                                })
                                $(layero).find("[name=transferType]").html(opt)
                                form.render()
                            })
                        },
                        yes: function (index, layero) {
                            initAjax('/tranOrder/generateSkuLocationTask.html', 'post',
                                JSON.stringify({
                                    "tranOrderId": tranOrderIdArr,//调拨单号
                                    "transferTypeId": $(layero).find("[name=transferType]").val(), //移库类型id，通过上一个接口获得
                                    "targetChannel": $(layero).find("[name=targetChannel]").val() //目标通道
                                }), function (returnData) {
                                    // layui.admin.batchResultAlert("生成移库取货:", returnData.data, function() {
                                    //     $('#transferOrderSearch').click()
                                    // });
                                    layer.close(index)
                                    layer.open({
                                        title: `操作结果`,
                                        content: `共选${tranOrderIdArr.length}条数据，成功${returnData.data.successList.length}条，失败${returnData.data.failList.length}条<span>；具体失败原因如下:</span><br/>${returnData.data.failList.join('<br/>')}`,
                                        area:['700px','60%']
                                    })
                                    $('#transferOrderSearch').click()
                            })
                        }
                    })
                }else{
                    layer.msg("请勾选要生成移库取货的调拨单")
                }
            });
            //一条龙审核
            $('#transferOrder_onestopreview').on('click', function(){
              layer.open({
                type:1,
                title: '一条龙审核',
                area: ['600px', '600px'],
                btn: ['关闭'],
                content: $('#transferOrder_onestopreviewLayer').html(),
                id: 'transferOrder_onestopreviewLayerId',
                success(layero,index){
                    $('#oneStopTransferId').keydown(function(event) {
                        if (event.keyCode == 13) {
                            let tranOrderId = $(this).val();
                            if (!tranOrderId) {
                                layer.msg("请输入调拨单号")
                                return false;
                            }
                            console.log('查询调拨单接口~~~')
                            getTransOrderInfo(tranOrderId)
                        }
                    })
                }
              });
            });
        },
        batchInvalid(){
            $('#transferOrder_batchInvalid').click(function(){
                var tranOrderIdArr = getTableSelectIds();
                if(tranOrderIdArr.length>0){
                    layer.confirm('确认要作废已选中的数据吗？', {
                        btn: ['确认','取消'], //按钮
                        title: '提示',
                        icon:7
                      }, function(){
                        initAjax('/tranOrder/batchInvalidTranOrder.html', 'post', { tranOrderIds: tranOrderIdArr.join(',') }, function(returnData) {
                            layui.admin.batchResultAlert("作废调拨单:", returnData.data, function() {
                            $('#transferOrderSearch').click()
                            });
                        }, 'application/x-www-form-urlencoded');
                      });
                }else{
                    layer.msg("请勾选要作废的调拨单")
                }
            })
        },
        downloadFile(){
            $('#transferOrder_download').click(function(){
                window.location.href = ctx + '/static/templet/transferOrderTemplate.xlsx'
            })
        },
        expandTrandfer(){
            $('.expandAlltransferOrder').click(function(){
                var flag= $(this).attr('data-flag')
                if(flag=="close"){
                    $(this).attr('data-flag','open').text('收起')
                    $(this).siblings().find('.expandrow').removeClass('hidden')
                }else{
                    $(this).attr('data-flag','close').text('展开')
                    $(this).siblings().find('.expandrow').addClass('hidden')
                }
            })
        }
    }

    transferOrder.init()
    var transferList = []
    let transferInfoItem = {}
    function getTransOrderInfo(tranOrderId) {
        initAjax('/tranOrder/getTranOrderInfo.html ', 'post',
            {"tranOrderId": tranOrderId  }, function (returnData)  {
            // 如果是已审核、作废或未找到调拨单 
            // 停留在调拨单输入栏位，全选，等待再次输入
            let { outNumber } = returnData.data || {}

            transferInfoItem = returnData.data || {}
            if (outNumber === 1) {
                $('#onStopTransferNum').val(outNumber)
                checkTransOrderInfo(tranOrderId)
            }
            if (outNumber > 1) {
                $('#onStopTransferNum').focus()

                $('#onStopTransferNum').keydown(function(event) {
                    if (event.keyCode == 13) {
                        if (!tranOrderId) {
                            layer.msg("请输入调拨单号")
                            return false;
                        }
                        if (outNumber == $('#onStopTransferNum').val()) {
                            checkTransOrderInfo(tranOrderId)
                        } else {
                            layer.msg("输入数量和调拨单数量不一致")
                        }
                    }
                })
            }
        },  'application/x-www-form-urlencoded')
    }

    function checkTransOrderInfo(tranOrderId) {
        initAjax('/tranOrder/batchAuditTranOrder.html', 'post', { tranOrderIds: tranOrderId }, function(returnData) {
            layui.admin.batchResultAlert("审核调拨单:", returnData.data, function() {
                // 确认之后 调拨单全选 数量清空
                $('#oneStopTransferId').select()
                $('#onStopTransferNum').val('')
            });
            if (returnData.data.failNum == 0) {
                // 审核成功
                transferList.unshift(transferInfoItem)
                oneStopTableRender()
            }
        }, 'application/x-www-form-urlencoded');
    }

    function oneStopTableRender() {
        table.render({
            elem: "#transferOrder_onestopreviewTbody",
            id: 'transferOrder_onestopreviewTbody',
            cols: [
                [
                    { title: "调拨单", field: 'tranOrderId' },
                    { title: "SKU", field: 'ssku' },
                    { title: "调拨类型", field: '' },
                    { title: "业务单号", field: '' },
                    { title: "数量", field: 'outNumber' }
                ]
            ],
            data: transferList?.slice(0, 5)
        });
    }

    //页面操作事件end
    function getTableSelectIds() {
        var locationIds = []
        var pId_cbox_td = $("#transferOrder_table").next().find("tbody input[name='layTableCheckbox']:checked")
        if (pId_cbox_td.length > 0) {
            for (var i = 0; i < pId_cbox_td.length; i++) {
                locationIds.push($(pId_cbox_td[i]).parents('tr').find('[data-field="tranOrderId"]').text());
            }
        }
        return locationIds
    }

    function getHidedata(aDom){
        var outerBoxLength = aDom.attr('data-outerBoxLength')||0,
        outerBoxWidth = aDom.attr('data-outerBoxWidth')||0,
        suttleWeight = aDom.attr('data-suttleWeight')||0,
        packWeight = aDom.attr('data-packWeight')||0,
        outNumber = aDom.find('td[data-field="outNumber"] input').val(),
        outTaxPer = aDom.find('td[data-field="outTaxPer"]').text()||0,
        outerBoxHeight = aDom.attr('data-outerBoxHeight')||0,
        prodSSku = aDom.find('td[data-field="prodSSku"]').text()||'',
        prodSId = aDom.attr('data-index')||'',
        title = aDom.find('td[data-field="title"]').text()||'',
        image = aDom.find('td[data-field="image"]').data('image');
        return {prodSSku,prodSId,title,image,outerBoxHeight,outTaxPer,outNumber,outerBoxLength,outerBoxWidth,suttleWeight,packWeight}
    }
    // 页面数据请求----------------------------------------

    function feeCalculator(aDom,refData){
        var tabledata = [];
        var totaloutNumber = 0,totalpayweight=0,totaloutTaxPer=0;
        const {totalpackPersonFee,totalpackMaterialsFee,totalheadFreight,totaltariff} = refData
        aDom.find('tr').each(function(index,item){
            var hidedata = getHidedata($(item))
            const {outerBoxHeight,outTaxPer,outNumber,outerBoxLength,outerBoxWidth,suttleWeight,packWeight} = hidedata
            totaloutNumber += Number(outNumber)||0
            var throwweight = outerBoxHeight*outerBoxLength*outerBoxWidth/6000*1000
            var weight = Number(suttleWeight)+Number(packWeight)
            var payweight = Math.max(throwweight,weight)
            totalpayweight += payweight*outNumber
            totaloutTaxPer +=Number(outTaxPer)*outNumber
        })
        aDom.find('tr').each(function(index,item){
            var hidedata = getHidedata($(item))
            const {prodSSku,prodSId,title,image,outerBoxHeight,outTaxPer,outNumber,outerBoxLength,outerBoxWidth,suttleWeight,packWeight} = hidedata
            sSku = prodSSku
            var outPrice = (outNumber*outTaxPer).toFixed(4)//出库金额
            if(totaloutNumber){
            var outNumberrate = Number((outNumber/totaloutNumber).toFixed(4))
            var packPersonFee = (outNumberrate*totalpackPersonFee).toFixed(4)//包装人工费
            var packMaterialsFee  = (outNumberrate*totalpackMaterialsFee).toFixed(4)//包装材料费
            }else{
                var packPersonFee = 0//包装人工费
                var packMaterialsFee  = 0//包装材料费
            }
            var throwweight = outerBoxHeight*outerBoxLength*outerBoxWidth/6000*1000
            var weight = Number(suttleWeight)+Number(packWeight)
            var payweight = Math.max(throwweight,weight)
            if(totalpayweight){
                var payweightrate = payweight*outNumber/totalpayweight;
                var headFreight = (totalheadFreight*Number(payweightrate.toFixed(4))).toFixed(4)//头程运费
            }else{
                var headFreight = 0
            }
            if(Number(totaloutTaxPer)+Number(totalheadFreight)){
                var tariffrate = Number((Number(outPrice)+Number(headFreight))/(Number(totaloutTaxPer)+Number(totalheadFreight))).toFixed(4)
                var tariff = (tariffrate*totaltariff).toFixed(4)//关税
            }else{
                var tariff = 0
            }
            var inPrice =(Number(outPrice)+Number(packPersonFee)+Number(packMaterialsFee)+Number(headFreight)+Number(tariff)).toFixed(4)//入库金额
            var inTaxPer = outNumber!=0?((Number(inPrice)/Number(outNumber)).toFixed(4)):0//入库含税单价
            tabledata.push({weight,sSku,image,title,prodSId,prodSSku,outTaxPer,suttleWeight,packWeight,outerBoxWidth,outerBoxLength,outerBoxHeight,outNumber,outPrice,packPersonFee,packMaterialsFee,headFreight,inPrice,inTaxPer,tariff})
        })

        return tabledata
    }

    //获取仓库
    function getWarehouse(){
        initAjax('/prodWarehouse/getAllProdWarehouse.html', 'post', {}, function(returnData) {
            var data = returnData.data
            transferOrder.initData.warehouse = data
            transferAppendSelect("#transferorderForm select[name='outStorageId']",data,'id','warehouseName')
            transferAppendSelect("#transferorderForm select[name='intoStorageId']",data,'id','warehouseName')
        })
    }

    //获取调拨类型
    function getTransferType(headCode,func){
        initAjax('/tranOrder/getTranBizDict.html', 'get', {headCode:headCode}, function(returnData) {
            if(func){
                func(returnData)
            }
        })
    }

    //获取制单人
    function getCreator(){
        initAjax('/tranOrder/listAllButNotAdmin.html', 'get', {}, function(returnData) {
            var data = returnData.data
            transferOrder.initData.creator = data
            transferAppendSelect("#transferorderForm select[name='createId']",data,'id','userName')
        })
    }

    //创建调拨单
    function createTransferOder(data,func) {
        initAjax('/tranOrder/createTranOrder.html', 'post', JSON.stringify(data), function(returnData) {
            if(func){
                func(returnData)
            }
        })
    }

    //修改调拨单
    function modifyTransferOder(data,func) {
        initAjax('/tranOrder/modifyTranOrder.html', 'post', JSON.stringify(data), function(returnData) {
            if(func){
                func(returnData)
            }
        })
    }


    // 导入sku
    function importSkus(data,func) {
        initAjax('/tranOrder/importSku.html', 'get', data, function(returnData) {
            if(func){
                func(returnData)
            }
        })
    }

    // 审核调拨单
    function authTransferOrder(data,func){
        initAjax('/tranOrder/auditTranOrder.html', 'post', JSON.stringify(data), function(returnData) {
            if(func){
                func(returnData)
            }
        })
    }

    // 删除调拨单
    function abondonTransferOrder(data,func){
        initAjax('/tranOrder/invalidTranOrder.html', 'post', JSON.stringify(data), function(returnData) {
            if(func){
                func(returnData)
            }
        })
    }

    // 导出调拨单
    function exportTransferOrder(data,func){
        console.log('data', data);
        submitForm(data, ctx + '/tranOrder/exportExcel.html')
    }

    // 下载模板
    window.downloadModel = function(){
        window.location.href = ctx + '/static/templet/import_tran_sku.xlsx'
    }

    window.importbtn = function(aDom){
        var wareHouseId = ($(aDom)).parents('#transferorder_editForm').find('select[name="outStorageId"]').val()
            if(!wareHouseId){
                layer.msg('请先选择调出仓库')
                return;
            }
        $('#transferOrder_importPro_input').click()
    }

    function transferAppendSelect(aDom, data, code, label) {
        $(aDom).empty();
        var option = '<option value="">请选择</option>'
        for (var i in data) {
            if (typeof data[i] !== 'string') {
                data[i].code = data[i][code] || data[i].code
                data[i].label = data[i][label] || data[i].label;
            }
            option += '<option value="' + (typeof data[i].code!='undefined'?data[i].code:data[i]) + '">' + (data[i].label || data[i]) + '</option>'
        }
        $(aDom).append(option)
        form.render()
    }

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
            beforeSend: function(returnData) {
                if (func2) {
                    func2(returnData)
                }
            },
            success: function(returnData) {
                loading.hide()
                if (returnData.code == "0000") {
                    func(returnData)
                } else {
                    layer.msg(returnData.msg, { icon: 2 });
                }
            },
            error: function(returnData) {
                layui.admin.load.hide();
                if (XMLHttpRequest.status == 200) {
                    layer.msg("请重新登录", { icon: 7 });
                } else {
                    layer.msg("服务器错误");
                }
            },
            complete: function(returnData) {
                loading.hide()
                if (func3) {
                    func3(returnData)
                }
            }
        })
    }

})
$('#transferOrder_uploadTemplate').on('change', function () {
    var files = $('#transferOrder_uploadTemplate')[0].files
    if (files.length == 0) {
        return
    }
    // 校验文件类型
    var fileName = files[0].name
    var seat = fileName.lastIndexOf(".");
    var extension = fileName.substring(seat).toLowerCase();
    if (extension != '.xlsx' && extension != '.xls') {
        layer.msg('请传入后缀为.xlsx或者.xls 的Excel文件', {icon: 0})
        return
    }
    var formData = new FormData();
    formData.append("file", files[0]);
    layer.confirm('确认导入模板吗', {btn: ['确认', '取消']},
        function () {
            loading.show()
            $.ajax({
                url: ctx + '/tranOrder/importTransferOrder.html',
                type: 'POST',
                data: formData,
                dataType: 'json',
                processData: false,
                contentType: false,
                success: function (returnData) {
                    if (returnData.code == '0000') {
                        loading.hide()
                        $('#transferOrder_uploadTemplate').val('')
                        // returnData = JSON.parse(returnData)
                        layui.admin.batchResultAlert("导入调拨单:", returnData.data, function() {
                        });
                    } else if (returnData.code == '9999') {
                        loading.hide();
                        $('#transferOrder_uploadTemplate').val('');
                        // layer.msg(returnData.msg, { icon: 2 });
                        layer.open({
                            title: '错误提示',
                            icon: 2,
                            content: returnData.msg
                        });
                    }
                },
                error: function () {
                    loading.hide()
                    $('#transferOrder_uploadTemplate').val('')
                }
            });
        },
        function () {
            $('#transferOrder_uploadTemplate').val('');
            layer.closeAll()
        }
    )
});