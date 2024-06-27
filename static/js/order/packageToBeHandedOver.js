layui.use(['admin','form','table','layer','formSelects','laydate'],function(){
    var admin = layui.admin,
        form = layui.form,
        table = layui.table,
        layer = layui.layer,
        element = layui.element,
        formSelects = layui.formSelects,
        laydate = layui.laydate;
    form.render('select');
    form.render('checkbox');
    let weighingSumming = []

    //接口请求
    let request_packageToBe = {
        //物流公司
        packageLogisticsCompany() {
            return commonReturnPromise({
                url: ctx + '/unauditorder/listcompanyandagent.html',
                type: 'post'
            })
        },
        // 查询交接包裹的称重信息
        weighingInformationPackage(params) {
            return commonReturnPromise({
                url: ctx + '/platOrderHandover/getWeighInfoByBatchNo.html',
                type: 'post',
                params
            })
        },
        // 添加保存重量
        addWeighingInformationPackage(params) {
            return commonReturnPromise({
                url: ctx + '/platOrderHandover/saveWeighInfo.html',
                type: 'post',
                params
            })
        },
        // 删除重量记录
        removeWeighingInformationPackage(params) {
            return commonReturnPromise({
                url: ctx + '/platOrderHandover/deleteById.html',
                type: 'post',
                params
            })
        },
        // 交接发货接口
        deliveryInterface(params) {
            return commonReturnPromise({
                url: ctx + '/platOrderHandover/turnToshipped.html',
                type: 'post',
                params
            })
        },
        // 预报号状态接口
        getBatchNoStatusList() {
            return commonReturnPromise({
                url: ctx + '/platOrderHandover/listEnum.html',
                type: 'get'
            })
        },
    }

    
    //初始化页面
    function initPage_packageToBe() {
        initBoundBatchNoStatusList() // 预报号状态和仓库
        initBindingTime()  // 绑定时间
        initBoundLogisticsCompany()  //绑定物流公司
    }
    new dropButton('packageToBeHanded_export_div');
    let operateComponents_packageToBe = {
        //ztt20231122-批量打印包裹号
        batchPrintPackageNumberHandle(){
          $('#packageToBeHanded_printPackageNumberBatch').on('click', function(){
            const status = $("#packageToBeHandedOver-tabs .layui-this").text().indexOf("已发货") > -1 ? 1 : 0;
            const tableId = status == 0 ? "packageToBeHandedOver_tableId" : "packageToBeHandedOver_tableid";
            commonTableCksSelected(tableId)
                  .then(function (result) {
                    //不能包含包裹号为空的,AE全托管只能单独打印,.indexOf('AE全托管') == -1
                    let batchNoArr = result.map(item => item.batchNo); //包裹号
                    let noEmptyBatchNoArr = batchNoArr.filter(Boolean);
                    if(batchNoArr.length != noEmptyBatchNoArr.length){
                      return layer.msg('包裹号不允许为空,请检查', {icon:7});
                    }
                    let logisCompanyArr = result.map(item => item.logisCompanyName);
                    let hasAE = logisCompanyArr.some(item => item.indexOf('AE全托管') > -1 || item.indexOf('AE半托管') > -1);
                    let notAE = logisCompanyArr.some(item => item.indexOf('AE全托管') == -1 && item.indexOf('AE半托管') == -1);
                    if(hasAE && notAE){
                      return layer.msg('AE全/半托管需单独打印', {icon:7});
                    }
                    //做打印处理
                    commonReturnPromise({
                      url:'/lms/printTemplate/printHandoverForm',
                      type: 'post',
                      contentType: 'application/json',
                      params: JSON.stringify({
                        batchNo: batchNoArr.join(',')
                      })
                    }).then(res => {
                      //res就是打印信息
                      res.printType = 19;
                      commonPrintRequest(res);
                    });

                  })
                  .catch(function (err) {
                    layer.msg(err, { icon: 2 })
                  });
          });
        },
        //渲染主表格
        tableRender: function(data, status){
            var _this = this;
            if(status == 0){
                table.render({
                    elem: '#packageToBeHandedOver_table',
                    method: 'post',
                    url: '/lms/platOrderHandover/list.html',  //TODO
                    where:  data,
                    page: true,
                    id: "packageToBeHandedOver_tableId",
                    limits: [100,200,300],
                    limit: 300,
                    created(res) {
                      let data =res.data;
                      let orderNums = 0; //订单数量
                      let preWeights=0; //预估重量
                      if(data && data.length > 0){
                        for(let i=0; i< data.length; i++){
                          let item= data[i];
                          orderNums += item.orderNum;
                          preWeights += item.preWeight;
                        }
                      }
                      res.extra = {
                        orderNums: orderNums,
                        preWeights: preWeights.toFixed(2)
                      }
                      return res;
                    },
                    cols: [
                        [
                            {type: 'checkbox', width: 40},
                            {title: '口袋编号', field: 'bagNo'},
                            {title: '组包号', field: 'batchNo', templet: '#batchNo_packageTobeHandedOver'},
                            {title: '订单数量', field: 'orderNum'},
                            {title: '包裹创建时间', templet: '#time_createTime_packageTobeHandedOver', width: 170},
                            {title: '创建人', field: 'creator', width: '7%'},
                            {title: '预估重量(Kg)', field: 'preWeight', width: 200},
                            {title: '物流公司', field: 'logisCompanyName'},
                            {title: '仓库', field: 'warehouseName'},
                            {title: '操作',toolbar: '#printPackageNumber_tableIdBar'}
                        ]
                    ],
                    done: function(res, curr, count){
                        $('#packageToBeHandedOver-tabs').find('.layui-this span').text(count)
                        _this.tableRenderToolBar()
                        //数量搞上去
                        $('#packageToBeHandedOver_table').next().find('.layui-table-header th[data-field=orderNum] span').text(`订单数量(数量${res.extra.orderNums})`);
                        $('#packageToBeHandedOver_table').next().find('.layui-table-header th[data-field=preWeight] span').text(`预估重量(合计${res.extra.preWeights}kg)`);
                    }
                });
            }else {
                table.render({
                    elem: '#packageToBeHandedOver_table',
                    method: 'post',
                    url: '/lms/platOrderHandover/list.html',
                    where:  data,
                    page: true,
                    id: "packageToBeHandedOver_tableid",
                    limits: [100,200,300],
                    limit: 300,
                    created(res) {
                      let data =res.data;
                      let orderNums = 0; //订单数量
                      if(data && data.length > 0){
                        for(let i=0; i< data.length; i++){
                          let item= data[i];
                          orderNums += item.orderNum;
                        }
                      }
                      res.extra = {
                        orderNums: orderNums
                      }
                      return res;
                    },
                    cols: [
                        [
                            {type: 'checkbox', width: '5%'},
                            {title: '口袋编号', field: 'bagNo', width: '8%'},
                            {title: '交接包裹单号', templet: '#batchNo_packageTobeHandedOver', width: '13%'},
                            // {title: '包裹数量', field: 'packageNum', width: '7%'},
                            {title: '订单数量', field: 'orderNum', width: '7%'},
                            {title: '包裹创建时间', templet: '#time_createTime_packageTobeHandedOver', width: '10%'},
                            {title: '创建人', field: 'creator', width: '7%'},
                            // {title: '包裹重量(Kg)', field: 'realWeight', width: '7%'},
                            {title: '物流公司', field: 'logisCompanyName', width: '8%'},
                            {title: '发货时间', templet: '#time_shippingTime_packageTobeHandedOver', width: '10%'},
                            {title: '发货人', field: 'shipper', width: '7%'},
                            {title: '发货单号',field: 'shippingNo', width: '11%'}
                        ]
                    ],
                    done: function(res, curr, count){
                        $('#packageToBeHandedOver-tabs').find('.layui-this span').text(count)
                        //数量搞上去
                        $('#packageToBeHandedOver_table').next().find('.layui-table-header th[data-field=orderNum] span').text(`订单数量(数量${res.extra.orderNums})`);
                    }
                });
            }
        },
        //主表格打印包裹号
        tableRenderToolBar: function () {
            let _this = this
            //工具条事件
            table.on('tool(packageToBeHandedOver_tableFilter)', function(obj){ //注：tool 是工具条事件名，test 是 table 原始容器的属性 lay-filter="对应的值"
                var data = obj.data; //获得当前行数据
                var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
                var tr = obj.tr; //获得当前行 tr 的 DOM 对象（如果有的话）
            
                if(layEvent === 'printPackageNumber'){ //打印包裹号
                  if(data.logisCompanyName.indexOf('AE全托管') == -1 && data.logisCompanyName.indexOf('AE半托管') == -1){
                    window.open(ctx + `/static/html/handoverForm.html?batchNo=${data.batchNo}&orderNum=${data.orderNum || 0}&totalWeight=${data.preWeight || 0}kg&bagNo=${data.bagNo}`);
                  }else{
                    commonReturnPromise({
                      url: '/lms/unshippedorder/getPickupLabel.html',
                      type: 'post',
                      params: {
                        inputInfo: data.batchNo
                      }
                    }).then(res => {
                      let obj = {};
                      obj.printType = 19;
                      obj.labelUrl = res.ftpLabelUrl;
                      obj.width = res.width;
                      obj.height = res.height;
                      obj.printName = '100100';
                      if (obj.height === 150) {
                          obj.printName = '100150'
                      }
                      logistics_label_pdf_print(obj);
                    });
                  }
                } 
            });  
        },
        //表单搜索事件
        formSearchEvent() {
            let _this = this
            form.on('submit(packageToBeHandedOver_submit)', function(object){
                let data = object.field, //获取到表单提交对象
                  status = $('#packageToBeHandedOver-tabs .layui-this').text().indexOf('已发货') > -1 ? 1 : 0 
                data.shippingStatus = status
                data.timeStart =  data.packageToBeHandedOver_createTime.split(' - ')[0]
                data.timeEnd =  data.packageToBeHandedOver_createTime.split(' - ')[1]
                delete data.packageToBeHandedOver_createTime;
                delete data.packageToBeHandedOver_printCk;
                _this.tableRender(data, status)
            });
        },
        // 组包
        handOverAgain: function(){
            $("#packageToBeHanded_handoverAgain").on("click", function () {
                const status = $("#packageToBeHandedOver-tabs .layui-this").text().indexOf("已发货") > -1 ? 1 : 0
                const tableId = status == 0 ? "packageToBeHandedOver_tableId" : "packageToBeHandedOver_tableid"
                commonTableCksSelected(tableId)
                  .then(function (result) {
                    if(result.length >1) return layer.msg('该功能仅支持单条数据操作',{icon:7})
                    const bagNo = result.map(v => v.bagNo).join(',')
                    if(bagNo === '') return layer.msg('该数据不支持该操作',{icon:7})
                    commonReturnPromise({
                      url: `/lms/platOrderHandover/handoverAgain.html`,
                      params: { bagNo },
                      type: 'post',
                    }).then(res => {
                      layer.msg(res || "操作成功!", { icon: 1 })
                      $('[lay-filter="packageToBeHandedOver_submit"]').trigger("click")
                    })
                  })
                  .catch(function (err) {
                    layer.msg(err, { icon: 2 })
                  })
             })
        },
        // AE全托管跨店铺组包
        aefmCrossStoreHandoverBatch:function(){
            $("#aefmCrossStoreHandoverBatch").click(function(){
                const status = $("#packageToBeHandedOver-tabs .layui-this").text().indexOf("已发货") > -1 ? 1 : 0
                const tableId = status == 0 ? "packageToBeHandedOver_tableId" : "packageToBeHandedOver_tableid"
                commonTableCksSelected(tableId)
                .then(function (result) {
                    let bagNos=result.map(item=>item.bagNo)
                    let data={bagNos:bagNos.join(',')};
                    layer.open({
                        title: 'AE全托管店铺创建揽收单',
                        type:1,
                        content: $("#aefmCrossStoreHandoverBatchTpl").html(),
                        btn:'关闭',
                        area: ['80%', '500px'],
                        success: function(layero, index){
                            table.render({
                                elem: '#aefmCrossStoreHandoverTbl',
                                method: 'post',
                                url: '/lms/platOrderHandover/aefmCrossStoreHandover.html',
                                where:  data,
                                id: "aefmCrossStoreHandover_tableId",
                                page:false,
                                limit:9999,
                                created(res) {
                                  let data =res.data;
                                  let orderNums = 0; //订单数量
                                  if(data && data.length > 0){
                                    for(let i=0; i< data.length; i++){
                                      let item= data[i];
                                      orderNums += item.orderNum;
                                    }
                                  }
                                  res.extra = {
                                    orderNums: orderNums
                                  }
                                  return res;
                                },
                                cols: [
                                    [
                                        {type: 'checkbox', width: 50},
                                        {title: '揽收单号', field: 'batchNo',width :'20%'},
                                        {title: '店铺',  field: 'storeAcct',width :'20%'},
                                        {title: '收货仓库', field: 'receiveWarehouse',width :'20%'},
                                        {title: '订单量',  field: 'orderCount'},
                                        {title: '组包时间', templet: '#aefmCrossStoreHandovercreateTime',width :'20%'},
                                    ]
                                ],
                                done: function(res, curr, count){
                                    if(res.msg&&res.msg!=''){
                                        layer.msg(res.msg,{icon:2})
                                    }
                                    $("#getAefmPickupLabelBtn").click(function(){
                                        commonTableCksSelected('aefmCrossStoreHandover_tableId')
                                        .then(function (result1) {
                                            let batchNos=result1.map(item=>item.batchNo)
                                            let params={batchNos:batchNos.join(',')}
                                            commonReturnPromise({
                                                url:'/lms/platOrderHandover/getAefmPickupLabel.html',
                                                type: 'post',
                                                // contentType: 'application/json',
                                                params: params
                                              }).then(res => {
                                                res.forEach(function(print_item){
                                                    let obj = {};
                                                    obj.printType = 19;
                                                    obj.labelUrl = print_item.ftpLabelUrl;
                                                    obj.width = print_item.width;
                                                    obj.height = print_item.height;
                                                    obj.printName = '100100';
                                                    if (obj.height === 150) {
                                                        obj.printName = '100150'
                                                    }
                                                    logistics_label_pdf_print(obj);
                                                });
                                              });
                                            })
                                        .catch(function (err) {
                                          layer.msg(err, { icon: 2 })
                                        })
                                        
                                    })
                                }
                            });
                        },
                        yes: function(index, layero){
                            //do something
                            layer.close(index); //如果设定了yes回调，需进行手工关闭
                        }
                    });
                })
                .catch(function (err) {
                  layer.msg(err, { icon: 2 })
                })
            });
        },
        //更新虾皮预报号状态
        updateHandle: function () {
            $('#packageToBeHanded_updateStatus').on('click', function () {
                commonReturnPromise({
                    url: '/lms/platOrderHandover/updateShopeeNumberStatus.html'
                }).then(res => {
                    layer.msg(res || '操作成功!', { icon: 1 });
                    $('[lay-filter="packageToBeHandedOver_submit"]').trigger('click');
                })
            });
        },
        // 打印发货单
        newAddHandle: function(){ //打印发货单
            var _this = this;
            $('#packageToBeHandedOver_newAdd').on('click', function(){
                commonTableCksSelected('packageToBeHandedOver_tableid').then(function(result){
                    let shippingNos = result.map(v => v.shippingNo)
                    let uniqueArray = [...new Set(shippingNos)];
                    if(uniqueArray.length > 1){
                      return layer.msg('请选择相同的发货单号', {icon: 7});
                    }else{
                      window.open(ctx + '/static/html/packageinvoicePrint.html?shippingNo='+shippingNos.join(','), '_blank');
                    }
                }).catch(function(err){
                    layer.msg(err,{icon:2});
                })
            })
        },
        // 数组求和
        sumArr:function (arr){
            return arr.reduce(function(prev,cur){
                return prev + cur;
            },0);
        },
        // //包裹称重start
        // addInvoiceDetail: function(){
        //     var _this = this;
        //     $('#packageToBeHanded_newAdd').on('click', function(){
        //         layer.open({
        //             type: 1,
        //             title: '包裹称重',
        //             btn: ['确定'],
        //             area: ['90%', '80%'],
        //             content: $('#packageToBeHanded_newAddLayer').html(),
        //             success: function(layero,index){
        //                 form.render()
        //                 //展示表格
        //                 _this.addInvoiceDetailHandle(layero);
        //             },
        //             yes: function(index){
        //                 layer.close(index);
        //             },
        //             end: function () {
        //                 $('[lay-filter="packageToBeHandedOver_submit"]').trigger('click');
        //             }
        //         })
        //     })
        // },
        // //包裹称重表格
        // addInvoiceDetailTableRender: function (layero, data, scrollTop) {
        //     let _this = this
        //     let height = layero.height() * 0.6
        //     let dataRender = data[0].batchNo ? data : []
        //     table.render({
        //         elem: '#packageToBeHanded_newAddLayer_table',
        //         id: "packageToBeHanded_newAddLayer_table",
        //         cols: [
        //             [
        //                 {type: 'numbers', title: '序号', width: '5%'},
        //                 {title: '交接包裹单号', field: 'batchNo', width: '30%'},
        //                 {title: '重量(Kg)', field: 'weight', width: '30%'},
        //                 {title: '操作',templet: '#packageToBeHanded_newAddLayer_remove', width: '22%'}
        //             ]
        //         ],
        //         data: dataRender,
        //         limit: data.length,
        //         done: function(res){
        //             $('#packageToBeHanded_newAddLayer_table').next().css({'margin': '0 auto', 'width': '90%'})
        //             _this.addInvoiceDetailToolBar(layero)
        //             weighingSumming = data.map(v => Number(v.weight || 0)) || []
        //             let temArr = data[0] || {}
        //             layero.find('#orderSummation').text(temArr.preWeight)
        //             layero.find('#weighingSumming').text((_this.sumArr(weighingSumming).toFixed(2)))
        //             if (scrollTop) {
        //                 let $content = layero.find('.layui-table-body.layui-table-main')
        //                 if ($content.height() < $content.children('table').height()) {
        //                     $content.scrollTop($content.children('table').height() + 100)
        //                 }
        //             }
        //         },
        //         height: height
        //     });
        // },
        // //称重的逻辑处理
        // addInvoiceDetailHandle: function(layero){
        //     const packageNo = layero.find('[name=packageToBeHanded_add_packageNo]');
        //     const weight = layero.find('[name=packageToBeHanded_add_weight]');
        //     const single = layero.find('[name=singleMultiplePackages]');
        //     const $tbody = layero.find('#packageToBeHanded_newAddLayer_table');
        //     const _this = this;
        //     packageNo.focus()
        //     //包裹号输入框绑定回车事件
        //     packageNo.on('keypress', function(e){
        //         e.stopPropagation();
        //         if(e.keyCode === 13){
        //             if($(this).val().trim()){
        //                 weight.focus();
        //                 weight.select()
        //                 _this.addInvoiceDetailReTable(layero)
        //             }else{
        //                 layer.msg('本地扫描未获取到值,请重新扫描');
        //             }
        //         }
        //     });
        //     //重量回车事件
        //     weight.on('keypress',function(e){
        //         e.stopPropagation();
        //         if(e.keyCode === 13){
        //             if (($tbody.next().find('tr').length - 1) >= 0 && !single.prop('checked') && $($tbody.next().find('tr')[1]).find('td[data-field="weight"]').text()) {
        //                 _this.commonCloseLayer('请确认交接包裹单号是否正确，若是一单多包请勾选设置', null, packageNo)
        //                 packageNo.focus();
        //                 packageNo.select();
        //                 return
        //             }
        //             request_packageToBe.addWeighingInformationPackage({ batchNo: packageNo.val(),weight: (weight.val()*1).toFixed(2)}).then(function(result){
        //                 if (!single.prop('checked')) {
        //                     packageNo.focus();
        //                     packageNo.select();
        //                 }else {
        //                     weight.select()
        //                 }
        //                 _this.addInvoiceDetailReTable(layero, 'scrollTop')
        //            }).catch(err => {
        //                 _this.commonCloseLayer(err, null, packageNo)
        //                 packageNo.focus();
        //                 packageNo.select();
        //            })
        //         }
        //     });
        // },
        // // 请求得到称重数据
        // addInvoiceDetailReTable: function (layero, scrollTop) {
        //     let _this = this
        //     const packageNo = layero.find('[name=packageToBeHanded_add_packageNo]');
        //     const single = layero.find('[name=singleMultiplePackages]');
        //     request_packageToBe.weighingInformationPackage({batchNo: packageNo.val()}).then(res => {
        //         let status = res[0] || {}
        //         status = status.singleOrMulti || false
        //         if (status == false) {
        //             single.removeAttr('checked')
        //         }else {
        //             single.prop('checked', true)
        //         }
        //         form.render()
        //         _this.addInvoiceDetailTableRender(layero, res, scrollTop)
        //     })
        // },
        // //称重表格工具条
        // addInvoiceDetailToolBar: function (layero) {
        //     let _this = this
        //     //工具条事件
        //     table.on('tool(packageToBeHanded_newAddLayer_table)', function(obj){ //注：tool 是工具条事件名，test 是 table 原始容器的属性 lay-filter="对应的值"
        //         var data = obj.data; //获得当前行数据
        //         var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
        //         var tr = obj.tr; //获得当前行 tr 的 DOM 对象（如果有的话）
        //
        //         if(layEvent === 'removeData'){ //删除
        //             request_packageToBe.removeWeighingInformationPackage({id:data.id}).then(res => {
        //                 layer.msg(res || '操作成功！')
        //                 _this.addInvoiceDetailReTable(layero)
        //             }).catch(err => {
        //                 // layer.msg(err)
        //                 _this.commonCloseLayer(err, null, layero.find('[name=packageToBeHanded_add_packageNo]'))
        //             })
        //         }
        //     });
        // },
        //回车关闭弹框[通用]
        commonCloseLayer: function(str, fn, onfocus, yesFn, title) {
            layer.open({
                title: title || '提示',
                content: str,
                btn: ['确认', '取消'],
                success: function(layero, index) {
                    this.enterEsc = function(event) {
                        if (event.keyCode === 13) {
                            if (fn) {
                                fn()
                            }
                            layer.close(index);
                            return false; //阻止系统默认回车事件
                        }
                    };
                    $(document).on('keydown', this.enterEsc); //监听键盘事件，关闭层
                },
                yes: function (index) {
                    if (yesFn) {
                        yesFn()
                    }
                    layer.close(index)
                },
                end: function() {
                    $(document).off('keydown', this.enterEsc); //解除键盘关闭事件
                    if (onfocus) {
                        onfocus.select()
                    }
                }
            });
        },
        //交接发货
        generateInvoiceMain: function(){
            var _this = this;
            $('#packageToBeHanded_main_newAdd').on('click', function(){
                commonTableCksSelected('packageToBeHandedOver_tableId').then(function(result){
                    let logisCompany = Array.from(new Set(result.map(v => v.logisCompanyName))) || [],
                      logisCompanyStr = logisCompany.join('、') || '',
                      logisCompanyLength = logisCompany.length
                    result.sort((a, b) => a.createTime - b.createTime)
                    if (logisCompanyLength > 1) {
                        _this.commonCloseLayer(`该交接单存在{${logisCompanyStr}}{${logisCompanyLength}}个物流公司，请确认是否合并发货？`,function () {
                            $('.layui-layer-btn0').click()
                        }, null, function () {
                            _this.generateInvoiceMain_layer(result)
                        }, '注意')
                    }else {
                        _this.generateInvoiceMain_layer(result)
                    }
                }).catch(function(err){
                    layer.msg(err,{icon:2});
                })
            })
        },
        // 交接发货弹窗
        generateInvoiceMain_layer: function (data) {
            let _this = this
             layer.open({
                type:1,
                title: '交接发货',
                btn: ['保存并打印', '取消'],
                area: ['1100px', '600px'],
                content: $('#packageToBeHandedOver_generatorLayer').html(),
                id: 'packageToBeHandedOver_generatorLayerId',
                success:function(layero,index){
                    _this.generateInvoiceMain_tableRender(data)
                    form.render(); 
                },
                yes: function(index,layero){
                    let temBatchNo = [],temBatchNoStr = ''
                    $.each(layero.find('td[data-field="batchNo"]'), function (i, v) {
                        if (i < layero.find('td[data-field="batchNo"]').length - 1) {
                            temBatchNo.push($(v).text())
                        }
                    })
                    temBatchNoStr = temBatchNo.join(',')
                    request_packageToBe.deliveryInterface({batchNos: temBatchNoStr}).then(res => {
                        layer.msg('生成发货单成功！', {icon:1})
                        layer.close(index);
                        $('[lay-filter="packageToBeHandedOver_submit"]').trigger('click');
                        window.open(ctx + '/static/html/packageinvoicePrint.html?shippingNo='+res, '_blank');
                    })
                },
                btn2: function(index, layero){
                    
                }
            });
        },
        //交接发货表格
        generateInvoiceMain_tableRender: function (data) {
            let _this = this
            function getSum(total, num) {
              return total + Math.round(num);
            }
            let totalbatchNo = data.length + '个',
              totalpackageNum = data.map(v => v.packageNum).reduce(getSum, 0) + '袋',
              totalpackageWeight = (data.map(v => v.realWeight || v.preWeight || 0).reduce((total, num)=> total + num, 0)*100).toFixed(2)/100,
              logisCompany = Array.from(new Set(data.map(v => v.logisCompanyName))) || []
              // console.log(totalpackageWeight);
            table.render({
                elem: '#packageToBeHandedOver_generatorLayer_table',
                id: "packageToBeHandedOver_generatorLayer_table",
                cols: [
                    [
                        {type: 'numbers', title: '序号', width: '5%', totalRowText: '合计'},
                        {title: 'id', field: 'id', totalRowText: 'id'},
                        {title: '交接包裹单号', field: 'batchNo', width: '19%', totalRowText: totalbatchNo},
                        {title: '重量(Kg)', field: 'realWeight', width: '19%', templet:'<div>{{d.realWeight || d.preWeight}}<div>',totalRowText: totalpackageWeight},
                        {title: '包裹数量', field: 'packageNum', width: '19%', totalRowText: totalpackageNum},
                        {title: '物流公司', field: 'logisCompanyName', width: '20%', totalRowText: logisCompany.join('、')},
                        {title: '操作',templet: '#packageToBeHandedOver_generatorLayer_toolbar', width: '15%', totalRowText: '-'}
                    ]
                ],
                totalRow: true,
                data,
                limit: data.length,
                done: function(res, curr, count){
                    _this.generateInvoiceMain_tableRender_ToolBar(res)
                    $('#packageToBeHandedOver_generatorLayer_table').next().find('[data-field="id"]').hide()
                }
            }); 
        },
        // 交接发货表格工具条
        generateInvoiceMain_tableRender_ToolBar: function (res) {
            let _this = this
            //工具条事件
            table.on('tool(packageToBeHandedOver_generatorLayer_table)', function(obj){ //注：tool 是工具条事件名，test 是 table 原始容器的属性 lay-filter="对应的值"
                var data = obj.data; //获得当前行数据
                var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
                var tr = obj.tr; //获得当前行 tr 的 DOM 对象（如果有的话）
            
                if(layEvent === 'delete'){ //删除
                    let removeData = res.data.filter(v => v.batchNo != data.batchNo)
                    _this.generateInvoiceMain_tableRender(removeData)
                } 
            });  
        },
        // 导出
        exportExcel: function () {
            $("#packageToBeHanded_export").click(function () {
                // 导出参数
                let params = {};
                // 点选后点击“导出”按钮，对所点选的数据进行导出;没有点选，直接点击“导出”按钮，对所查询出的所有数据进行导出
                // 获取选中数据
                const { data: checkedList } = layui.table.checkStatus("packageToBeHandedOver_tableId");
                if (checkedList.length) {
                    params.idList = checkedList.map((item) => item.id).join();
                } else {
                    params = serializeObject($("#packakgeToBeHanderOver_FormId"));
                    const status =
                    $("#packageToBeHandedOver-tabs .layui-this")
                        .text()
                        .indexOf("已发货") > -1
                        ? 1
                        : 0;
                    params.shippingStatus = status;
                    if (params.packageToBeHandedOver_createTime) {
                        params.timeStart = params.packageToBeHandedOver_createTime.split(" - ")[0];
                    params.timeEnd = params.packageToBeHandedOver_createTime.split(" - ")[1];
                    }
                    delete params.packageToBeHandedOver_createTime;
                    delete params.packageToBeHandedOver_printCk;
                }
                submitForm(params, "/lms/platOrderHandover/exportHandoverInfo.html", "_blank");
            });
            $("#packageToBeHanded_export_order").click(function () {
                // 导出参数
                let params = {};
                // 点选后点击“导出”按钮，对所点选的数据进行导出;没有点选，直接点击“导出”按钮，对所查询出的所有数据进行导出
                // 获取选中数据
                const { data: checkedList } = layui.table.checkStatus("packageToBeHandedOver_tableId");
                if (checkedList.length) {
                    params.idList = checkedList.map((item) => item.id).join();
                } else {
                    params = serializeObject($("#packakgeToBeHanderOver_FormId"));
                    const status =
                    $("#packageToBeHandedOver-tabs .layui-this")
                        .text()
                        .indexOf("已发货") > -1
                        ? 1
                        : 0;
                    params.shippingStatus = status;
                    if (params.packageToBeHandedOver_createTime) {
                        params.timeStart = params.packageToBeHandedOver_createTime.split(" - ")[0];
                    params.timeEnd = params.packageToBeHandedOver_createTime.split(" - ")[1];
                    }
                    delete params.packageToBeHandedOver_createTime;
                    delete params.packageToBeHandedOver_printCk;
                }
                params.hasDetail=true;
                submitForm(params, "/lms/platOrderHandover/exportHandoverInfo.html", "_blank");
            });
        },  
    }

    //绑定时间 -- 昨天和今天
    function initBindingTime() {
        var nowdate = new Date(new Date().toLocaleDateString()).getTime()
        var endDate = Format(nowdate + 24 * 60 * 60 * 1000 - 1, 'yyyy-MM-dd hh:mm:ss')
        var yesterday = Format(nowdate - 24 * 60 * 60 * 1000, 'yyyy-MM-dd hh:mm:ss')
        var nowDate_range = yesterday +' - '+ endDate;
        $('#packageToBeHandedOver_createTime').val(nowDate_range);
        laydate.render({
            elem: '#packageToBeHandedOver_createTime', //指定元素
            range: true,
            inputAuto: true,
            type: 'datetime',
            showShortcuts: true,
        }); 
    }
     
    //绑定物流公司
    function initBoundLogisticsCompany() {
        request_packageToBe.packageLogisticsCompany().then(res => {
           let companys = res.companys;
           commonRenderSelect('packageLogisticsCompanyId', companys, {name: 'cnName', code: 'id'}).then(()=>{
            formSelects.render('packageLogisticsCompany');
           })
        })
    }

    // 绑定预报号状态和仓库
    function initBoundBatchNoStatusList() {
        request_packageToBe.getBatchNoStatusList().then(res => {
            // 绑定预报号状态
            commonRenderSelect('batchNoStatusList', res['batchNoStatusList']).then(() => form.render('select'));
            // 绑定仓库
            renderWarehouseSelect('prodWarehouseList',res['prodWarehouseList']);
        });
    }
    function renderWarehouseSelect(id,data){
        let warehouseOption='<option value="">请选择</option>'
        data.forEach(item=>{
            warehouseOption+=`<option value="${item.value}">${item.name}</option>`
        });
        $('#'+id).html(warehouseOption);
        form.render('select');
    }

    //监听tabs点击事件
    element.on('tab(packageToBeHandedOver-tabs)', function(data){
       $('[lay-filter="packageToBeHandedOver_submit"]').trigger('click');
       if(data.index === 0){ //已扫描
            $('#packageToBeHanded_main_newAdd').removeClass('disN'); //包裹交接
            $('#packageToBeHandedOver_newAdd').addClass('disN'); //打印发货单
       }else if(data.index === 1){ //已发货
            $('#packageToBeHanded_main_newAdd').addClass('disN'); //包裹交接
            $('#packageToBeHandedOver_newAdd').removeClass('disN'); //打印发货单
        }
    });
    // 组包
    operateComponents_packageToBe.handOverAgain()
    // AE全托管跨店铺组包
    operateComponents_packageToBe.aefmCrossStoreHandoverBatch()
    //更新虾皮预报号
    operateComponents_packageToBe.updateHandle();
    //打印发货单
    operateComponents_packageToBe.newAddHandle();
    // //包裹称重
    // operateComponents_packageToBe.addInvoiceDetail();
    //交接发货
    operateComponents_packageToBe.generateInvoiceMain();
    // 导出
    operateComponents_packageToBe.exportExcel()
    //批量打印包裹号
    operateComponents_packageToBe.batchPrintPackageNumberHandle();

    initPage_packageToBe()//初始化
    //表单搜索事件
    operateComponents_packageToBe.formSearchEvent()
    $('[lay-filter="packageToBeHandedOver_submit"]').trigger('click');

    //监听回车事件ztt20231101
    $('#packakgeToBeHanderOver_FormId [name=batchNo]').on('keyup', function(event){
      if(event.keyCode == 13){
        //表示回车了
        $('[lay-filter="packageToBeHandedOver_submit"]').trigger('click');
        //逻辑有问题,但是这种处理方式最简单
        if($('[name=packageToBeHandedOver_printCk]').is(':checked')){
          let data = serializeObject($('#packakgeToBeHanderOver_FormId')),
          status = $('#packageToBeHandedOver-tabs .layui-this').text().indexOf('已发货') > -1 ? 1 : 0 
          data.shippingStatus = status
          data.timeStart =  data.packageToBeHandedOver_createTime.split(' - ')[0]
          data.timeEnd =  data.packageToBeHandedOver_createTime.split(' - ')[1]
          delete data.packageToBeHandedOver_createTime;
          delete data.packageToBeHandedOver_printCk;
          commonReturnPromise({
            url: '/lms/platOrderHandover/list.html',
            type: 'post',
            params: data,
            loading:false
          }).then(res1 => {
            let resObj = res1&&res1[0] || {};
            if(resObj.logisCompanyName.indexOf('AE全托管') == -1){
              window.open(ctx + `/static/html/handoverForm.html?batchNo=${resObj.batchNo}&orderNum=${resObj.orderNum || 0}&totalWeight=${resObj.preWeight || 0}kg&bagNo=${resObj.bagNo}`);
            }else{
              commonReturnPromise({
                url: '/lms/unshippedorder/getPickupLabel.html',
                type: 'post',
                params: {
                  inputInfo: resObj.batchNo
                }
              }).then(res => {
                let obj = {};
                obj.printType = 19;
                obj.labelUrl = res.ftpLabelUrl;
                obj.width = res.width;
                obj.height = res.height;
                obj.printName = '100100';
                if (obj.height === 150) {
                    obj.printName = '100150'
                }
                logistics_label_pdf_print(obj);
              });
            }

          });
        }
      }
    })
    
})
function batchNo_packageTobeHandedOver_click(_this) {
    layui.use(['table','layer'],function(){
        var table = layui.table,
            layer = layui.layer
        let batchNo = $(_this).find('.batchNo').text(), 
        orderNum = $(_this).parents('tr').find('td[data-field="orderNum"]').text();
        commonReturnPromise({
            url: ctx + '/platOrderHandover/getDetailsByBatchNo.html',
            type: 'post',
            params: {batchNo}
        }).then(res => {
            layer.open({
                type: 1,
                title: `${batchNo} - ${orderNum}`,
                content:$('#packageToBeHandedOver_PackageDetails').html(),
                id: 'packageToBeHandedOver_PackageDetailsId',
                area: ['100%', '100%'],
                // btn: ['保存', '关闭'],
                success: function(layero,index){
                    table.render({
                        elem: '#packageToBeHandedOver_PackageDetails_table',
                        id: "packageToBeHandedOver_PackageDetails_table",
                        cols: [
                            [
                                {title: '订单号', field: 'orderId', width: '5%'},
                                {title: '跟踪号', field: 'logisTrackingNo', width: '19%'},
                                {title: '物流方式', field: 'logisTypeName', width: '19%'},
                                {title: '物流公司', field: 'logisCompanyName', width: '20%'},
                                {title: '扫描时间', templet: '#time_scanTime_packageTobeHandedOver', width: '19%'},
                                {title: '扫描人',field: 'scaner', width: '18%'}
                            ]
                        ],
                        data: res,
                        limit: res.length,
                    }); 
                },
                yes: function () {
                    
                }
            })
        })
    })
}
