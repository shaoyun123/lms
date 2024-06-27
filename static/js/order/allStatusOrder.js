layui.use(['form', 'table', 'layer', 'element', 'laypage', 'upload', 'tableMerge', 'laydate', 'formSelects', 'admin','laytpl'], function () {
    var form = layui.form,
        table = layui.table,
        element = layui.element,
        laydate = layui.laydate,
        formSelects = layui.formSelects,
        laytpl = layui.laytpl,
        admin = layui.admin,
        upload = layui.upload
    laypage = layui.laypage;
    layer = layui.layer;
    form.render('select');
    var allStatusOrder_company = null,
        allStatusOrder_allstore = null,
        allStatusOrder_logisType = null,
        allStatusOrder_Site = null,
        allStatusOrder_formdata = {},
        allStatusOrder_pageEnum = null,
        allStatusOrder_Currency = null,
        allStatusOrder_companyType = "logisticsModes";
    laydate.render({
        elem: '#allStatusOrder_time',
        type: 'datetime',
        inputAuto: true,
        range: true,
        showShortcuts: true,
    });
    //ztt20230907-标签状态监听
    function getAllStatusOrderTagsAjax(){
      return commonReturnPromise({
        url: '/lms/unauditorder/listenum.html'
      });
    }
    form.on('select(allStatusOrder_platTagsSign)', function(obj){
      //标签不含仅允许单选
      if(obj.value == 0){
        getAllStatusOrderTagsAjax().then(res => {
          let { platTagList} = res;
          commonRenderSelect('allStatusOrder_platTags', platTagList).then(() => {
            formSelects.render('allStatusOrder_platTags', {
              max: 1,
              maxTips: function(id, vals, val, max){
                //id:   点击select的id
                //vals: 当前select已选中的值
                //val:  当前select点击的值
                //max:  当天多选最大值
                layer.msg("标签(不含)状态下最多允许选择: " + max, {icon: 7});
              },
            });
          });
        });
        
      }else if(obj.value == 1){
        getAllStatusOrderTagsAjax().then(res => {
          let { platTagList} = res;
          commonRenderSelect('allStatusOrder_platTags', platTagList).then(() => {
            formSelects.render('allStatusOrder_platTags', {
              max: 1000
            });
          });
        });
      }else if(obj.value ==2 || obj.value==3){
        getAllStatusOrderTagsAjax().then(res => {
          let { orderTagList} = res;
          commonRenderSelect('allStatusOrder_platTags', orderTagList).then(() => {
            formSelects.render('allStatusOrder_platTags');
          });
        });
      }
    });


    // 保存设置 
    $('#allStatusOrder_saveOrderConfig').on('click', function(){
        let orderColumnState = allStatusOrder_gridOptions.columnApi.getColumnState()
        window.localStorage.setItem("allStatusOrderColumnState",JSON.stringify(orderColumnState))
        layer.msg("保存设置成功")
    })
    //复制订单号/店铺单号函数
    function allStatusOrder_copyNumFn(orderNums){
      let oInput = document.createElement('textarea'); //创建一个textarea元素
      oInput.value = orderNums;
      document.body.appendChild(oInput); //将input添加为body子元素
      oInput.select(); // 选择对象
      document.execCommand("Copy"); // 执行浏览器复制命令
      document.body.removeChild(oInput);//移除DOM元素
      layer.msg('复制成功', { icon: 1 });
    }
    //复制订单号
    $('#allStatusOrder_copyOrderNum').on('click', function(){
      let data = allStatusOrder_gridOptions.api.getSelectedRows();
      let ids = data.map(item => item.id);
      if(ids.length ==0){
        return layer.msg('请先选择需要复制的数据', {icon:7});
      }
      allStatusOrder_copyNumFn(ids.join(','));
    });
    //复制店铺单号
    $('#allStatusOrder_copyStoreNum').on('click', function(){
      let data = allStatusOrder_gridOptions.api.getSelectedRows();
      let storeIds = data.map(item => item.platOrderId);
      if(storeIds.length ==0){
        return layer.msg('请先选择需要复制的数据', {icon:7});
      }
      allStatusOrder_copyNumFn(storeIds.join(','));
    });
    //复制itemId
    $('#allStatusOrder_copyItemId').on('click', function(){
      let data = allStatusOrder_gridOptions.api.getSelectedRows();
      if(data.length ==0){
        return layer.msg('请先选择需要复制的数据', {icon:7});
      }
      let itemIdsArr = [...new Set(data.map(item => (item.orderDetails || []).map(itemx=> itemx.itemId)).flat())];
      allStatusOrder_copyNumFn(itemIdsArr.join(','));
    });

    // 模板查询赋值
    commonSaveSearchTpl({
        id: "allStatusOrder_save",
        formId: "allStatusOrderForm",
        pageName: "auditDespathOrder_allStatusOrder",
        searchBtnId: "allStatusOrderSearch",
        cb: (param) => allStatusOrder_formVal(param),
    })

    function allStatusOrder_formVal(param) {
        let $formDom = $("#allStatusOrderForm")
        let timeStamp = 0 // 调接口的需要加400
        //  销售 客服
        if(param.salerAndcustomSelect){
            $formDom.find("select[name=salerAndcustomSelect]").val(param.salerAndcustomSelect)
        }
        // 平台
        if (param.platCode) {
            $formDom.find("select[name=platCode]").next().find(`dd[lay-value="${param.platCode}"]`).trigger("click")
            timeStamp += 400
            form.render()
        }
        // 店铺 赋值
        setTimeout(() => {
            commonReturnPromise({
                url: '/lms/sys/listStoreForRenderHpStoreCommonComponent.html',
                type: 'post',
                params: {
                    roleNames: `${param.platCode}专员`,
                    orgId: param.orgs,
                    salePersonId: param.salePersonId,
                    platCode: param.platCode,
                    type: param.salerAndcustomSelect==1 ? 'salesperson' : 'customservicer',
                }
            }).then(res=>{
                const storeList = param.storeAcctIds ? param.storeAcctIds.split(",") : []
                appendSelect($('#allStatusOrderForm').find(`select[_name=storeAcctIds]`), res, 'id', 'storeAcct')
                formSelects.render("allStatusOrder_store")
                formSelects.value("allStatusOrder_store", storeList)
                // 给表单赋值
                form.val("allStatusOrderForm", param)
                // 更多查询条件是否有值
                allStatusOrderHasValue("allStatusOrderForm", "showMoreSearchCondition_allStatusOrder")
                // 多选的 name: xm-select
                let multiSelectObj = {
                    salePersonId: "allStatusOrder_salePersonsSelect",
                    prodLogisAttrs: "logisAttrs",
                    platOrderStatusList: "platOrderStatusList",
                    shippingCountryCodes: "shippingCountrys",
                    logisTypeIds: "logisTypeIds_xm_select_allOrder",
                    processStatusList: "processStatusList",
                    orderLabels: "allStatusOrder_orderLabels",
                    platTags:"allStatusOrder_platTags"
                }
                Object.keys(multiSelectObj).forEach(item => {
                    if (param[item]) {
                        formSelects.value(multiSelectObj[item], param[item].split(","), true)
                    } else {
                        formSelects.render(multiSelectObj[item])
                    }
                })
                // 执行搜索
                $('#allStatusOrderSearch').click()
            })
        }, timeStamp);
        
        if(param.agentCompany){
            $formDom.find("select[name=agentCompany]").next().find(`dd[lay-value="${param.agentCompany}"]`).trigger("click")
        }
        if(param.logisticsCompanyId) {
            $formDom.find("select[name=logisticsCompanyId]").next().find(`dd[lay-value="${param.logisticsCompanyId}"]`).trigger("click")
        }
    }
      

    formSelects.render('platOrderStatusList', { placeholder: '请先选择平台' });
    // 前端删除行，删除后不刷新表格
    function deleteTableRow_allStatusOrder(ids,errIdsArr){
        zttCommonRemoveDataHandle({
            selectedIds: ids,
            gridOptions: allStatusOrder_gridOptions,
            tableData: allStatusOrder_immutableStore,
            errIds: errIdsArr
        }).then(newObj => {
            let { newData, successIds } = newObj;
            // allStatusOrder_immutableStore = newData;
            let oldNum = $('#allStatusOrder_Tab ul li.layui-this>span').text();
            let newNum = oldNum - successIds.length;
            $('#allStatusOrder_Tab ul li.layui-this>span').text(newNum);
            $('#allStatusOrderPage .layui-laypage-count').text(`共 ${newNum} 条`);
        });
    }
    // 前端更新行，更新后不刷新表格
    function updateTableRow_allStatusOrder(ids,errIdsArr){
        zttCommonUpdataDataHandle({
            selectedIds: ids,
            errIds: errIdsArr
        }).then(newObj => {
            // 修改成功的数据
            let { successIds } = newObj;
            if(successIds.length != 0){
                // 选中的数据
                let checkStatus = allStatusOrder_gridOptions.api.getSelectedRows();
                let newCheckStatus = deepCopy(checkStatus)
                commonReturnPromiseRes({
                    url: ctx + '/platorder/listorder.html',
                    type: 'POST',
                    params:{orderIds:successIds.join(",")}
                }).then(function(result){
                    // 匹配选中的数据
                    for(let i=0,iLen=result.data.length;i<iLen;i++){
                        for(let j=0,jLen=newCheckStatus.length;j<iLen;j++){
                            if(newCheckStatus[j].id == result.data[i].id){
                                newCheckStatus[j] = deepCopy(result.data[i])
                                break;
                            }
                        }
                    }
                    allStatusOrder_gridOptions.api.updateRowData({ update: newCheckStatus });
                })
            }
        });
    }
    //导出功能
    componentForOrderDownload('allStatusOrder_exportTemplate', function(){
      let data = allStatusOrder_gridOptions.api.getSelectedRows();
      let idsArr = data.map(function (item) {
        return item.id;
      });
      return idsArr;
    }, function(formData){
      //先获取表单数据,并且处理表单数据
      let data = {};
      data.field = serializeObject($('#allStatusOrderForm'));
      if (data.field.time) {
          data.field.orderTimeStart = data.field.time.split(' - ')[0];
          data.field.orderTimeEnd = data.field.time.split(' - ')[1];
      }
      if (data.field.skuType) {
          data.field[data.field.skuType] = data.field.skuvalue
      }
      if (data.field.salerAndcustomSelect == 2) {
          data.field.customServicerId = data.field.salePersonId;
          delete data.field.salePersonId;
      }else if(data.field.salerAndcustomSelect == 4) {//leader组长
        data.field.leaderId = data.field.salePersonId;
        delete data.field.salePersonId;
      }else if(data.field.salerAndcustomSelect == 3) {//directorId主管
        data.field.directorId = data.field.salePersonId;
        delete data.field.salePersonId;
      }
      //天数类型处理
      if (data.field.dateType == 1) {//订单天数      
      } else if (data.field.dateType == 2) {//跟踪号天数
          data.field.trackDateMin = data.field.orderDateMin;
          data.field.trackDateMax = data.field.orderDateMax;
          delete data.field.orderDateMin;
          delete data.field.orderDateMax;
      } else if (data.field.dateType == 3) {//剩余天数
          data.field.shipByDateMin = data.field.orderDateMin;
          data.field.shipByDateMax = data.field.orderDateMax;
          delete data.field.orderDateMin;
          delete data.field.orderDateMax;
      }else if (data.field.dateType == 4) {// 跟踪剩余天数
          data.field.trackCloseTimeMin = data.field.orderDateMin;
          data.field.trackCloseTimeMax = data.field.orderDateMax;
          delete data.field.orderDateMin;
          delete data.field.orderDateMax;
      }else if(data.field.dateType == 5){ //发货剩余天数
        data.field.shipDeadLineMin = data.field.orderDateMin;
        data.field.shipDeadLineMax = data.field.orderDateMax;
        delete data.field.orderDateMin;
        delete data.field.orderDateMax;
    }
      //订单编号处理
      if (data.field.orderIds) {
          //替换全角逗号
          data.field.orderIds = data.field.orderIds.replace(/，/g, ",");
          //校验
          for (let orderId of data.field.orderIds.split(",")) {
              if (!isNaN(orderId) && orderId % 1 === 0) {

              } else {
                  layer.msg("订单编号不正确", { icon: 0 });
                  return;
              }
          }
      }
      //物流公司货代公司不为空时，获取所有物流属性
      if (!data.field.logisTypeIds) {
          if ($("#allStatusOrderForm select[name=company]").val()) {
              let logisTypeIds = [];
              $("#allStatusOrderForm select[name=logisTypeIds] option").each(function () {
                  let logisTypeId = $(this).attr("value");
                  if (logisTypeId && logisTypeId != 0) {
                      logisTypeIds.push(logisTypeId);
                  }
              });
              data.field.logisTypeIds = logisTypeIds.join(",");
          }
      }
      // 物流方式与物流方式
      if(data.field.agentCompany == 'logisticsModes' && data.field.logisticsCompanyId && !data.field.logisTypeIds){
          data.field.logisTypeIds = $('#logisTypeIds_xm_select_allOrder').attr('acct_ids')
      }
      if(data.field.agentCompany == 'logisticsModes'){
        data.field.agentCompany = ''
      }

      if (data.field.agentCompany == 'agents' && data.field.logisticsCompanyId) {
          data.field.agentCompany = data.field.logisticsCompanyId
          delete data.field.logisticsCompanyId
      }else if(data.field.agentCompany == 'companys' && data.field.logisticsCompanyId){
          delete data.field.agentCompany
      }else {
          data.field.agentCompany = '';
          delete data.field.logisticsCompanyId
      }
      if (data.field.newBatchNo == 1) { // 拣货批次
          data.field.pickBatchNo = data.field.valBatchNo
      }else if(data.field.newBatchNo == 2){ // 组包批次
          data.field.handoverBatchNo = data.field.valBatchNo
      }
      // 1. 选择了部门，没有选店铺
      //     1.1 部门下有店铺，传全部店铺
      //     1.2 部门下没有店铺，传0
      // 2. 选择了部门，选择了店铺，传选择的店铺
      if(data.field.orgs != ''&&data.field.storeAcctIds == ''){
          data.field.storeAcctIds = $('#allStatusOrder_store').attr('acct_ids') || 0;
      }
      for(let key in data.field){
        formData.append(key, data.field[key]);
      }
      return {
        url: '/lms/platorder/exportOrderInfoForQuery.html',
        submitData: formData
      }
    });

    //渲染平台标记
    allStatusOrder_renderPlatCodeMark();
    function allStatusOrder_renderPlatCodeMark () {
        commonReturnPromise({
            url: '/lms/unauditorder/listenum.html'
        }).then(res => {
            let { platTagList,orderTagList} = res;
            commonRenderSelect('allStatusOrder_platTags', platTagList).then(() => {
                formSelects.render('allStatusOrder_platTags');
            });
            commonRenderSelect('allStatusOrder_orderTagLists', orderTagList).then(() => {
              formSelects.render('allStatusOrder_orderTagLists');
            });
        });
    }

    // document.onkeydown = function (e) {
    //     e = e ? e : event;
    //     if(e.keyCode == 13 || e.which ==13){ // 回车键
    //         $('#allStatusOrderSearch').click();
    //     }
    // }
    $('#allStatusOrderForm').on('keyup', 'input', function (e) {
        if (e.keyCode == 13) { // 回车键
            $(this).select();
            $('#allStatusOrderSearch').click();
        }
    });

    //平台操作功能
    new dropButton('allStatusOrder_platOperate');
    allStatusOrderPlatOperateFeatures()
    function allStatusOrderPlatOperateFeatures() {
       //ebay取消
        $('#allStatusOrder_cancelOrderEbay').on('click', function () {
            let idsArr = getTableSelectIds();
            if (idsArr.length == 0) {
                return layer.msg('请先选择数据', { icon: 7 });
            }
            layer.open({
                type: 1,
                title: '取消ebay订单',
                content: $('#allStatusOrder_cancelEbayTpl').html(),
                area: ['40%', '30%'],
                id: 'allStatusOrder_cancelEbayTplId',
                btn: ['确定', '关闭'],
                success: function(layero, index) {
                    form.render();
                },
                yes: function(index, layero) {
                    var cancelReason = layero.find('[name=cancelReason]:checked').val();
                    layer.close(index);
                    commonReturnPromise({
                        url: '/lms/unauditorder/cancelorder/ebay.html',
                        type: 'post',
                        params: {
                            ids: idsArr.join(),
                            cancelReason: cancelReason
                        }
                    }).then(function(result) {
                        layui.admin.batchResultAlert("ebay取消订单完成:", result, function (errIdsArr) {
                            deleteTableRow_allStatusOrder(idsArr,errIdsArr)
                        });
                    }).catch(function(resErr) {
                        layer.msg(resErr.message, { icon: 2 });
                    });
                }
            });
       });
        //优选仓拒单
        $('#allStatusOrder_rejectOrderdabao').on('click', function () {
            let idsArr = getTableSelectIds();
            if (idsArr.length == 0) {
                return layer.msg('请先选择数据', { icon: 7 });
            }
            commonOrderConfirmLayer(idsArr.length, function (index) {
                initAjax('/platorder/rejectDabaoOrders.html', 'post', { ids: idsArr.join(',') }, function (returnData) {
                    layer.close(index);
                    layui.admin.batchResultAlert("优选仓拒单:", returnData.data, function(errIdsArr) {
                        deleteTableRow_allStatusOrder(idsArr,errIdsArr)
                    });
                }, 'application/x-www-form-urlencoded');
            });
        });
       //更新订单状态
        $('#allStatusOrder_syncOrderStatus').on('click', function () {
            let idsArr = getTableSelectIds();
            if (idsArr.length == 0) {
                return layer.msg('请先选择数据', { icon: 7 });
            }
            commonReturnPromise({
                url: '/lms/unauditorder/syncplatstatus.html',
                type: 'post',
                params: {
                    ids: idsArr.join()
                }
            }).then(function(result) {
                layui.admin.batchResultAlert("更新订单状态完成:", result, function(errIdsArr) {
                    updateTableRow_allStatusOrder(idsArr,errIdsArr)
                });
            }).catch(function(resErr) {
                layer.msg(resErr.message, { icon: 2 });
            });
       });
       //标记平台发货
        $('#allStatusOrder_markDelivery').on('click', function () {
            let idsArr = getTableSelectIds();
            if (idsArr.length == 0) {
                return layer.msg('请先选择数据', { icon: 7 });
            }
            zttCommonProgressBar({ type: 10, ids: idsArr.join() }, function (progressData) {
                layui.admin.batchResultAlert("标记平台发货完成:",progressData,function(errIdsArr){
                    updateTableRow_allStatusOrder(idsArr,errIdsArr)
                });
            });
            // commonReturnPromise({
            //     url: '/lms/unauditorder/markplatshipping.html',
            //     type: 'post',
            //     params: {
            //         ids: idsArr.join()
            //     }
            // }).then(function (result) {
            //     layui.admin.batchResultAlert("标记平台发货完成:", result, function () {
            //     });
            // });
        });
        
        //解密地址
        $('#allStatusOrder_decryptAddress').on('click', function () {
            let ids = getTableSelectIds();
            if (ids.length > 0) {
                commonReturnPromise({
                    type: 'post',
                    url: '/lms/platorder/decrypt/list',
                    contentType: 'application/json',
                    params: JSON.stringify(ids)
                }).then(res => {
                    layui.admin.batchResultAlert("解密地址:",res,function(errIdsArr){
                        updateTableRow_allStatusOrder(ids,errIdsArr)
                    });
                });
            } else {
                layer.msg('请选择订单',{icon:7});
            }
        });
       //    Amazon邮件
       $("#allStatusOrder_amazonEmail").on("click", function () {
            orderAmazonEmail(allStatusOrder_gridOptions)
        })
        // ebay 邮件
        $("#allStatusOrder_eBayEmail").on("click", function () {
            orderEbayEmail(allStatusOrder_gridOptions)
          })

        $('#allStatusOrder_shopeeEmail').on('click',function(){
            // 获取选中数据
            const curOrders = allStatusOrder_gridOptions.api.getSelectedRows()
            commonorderShopeeSendMsg(curOrders, 'shopee')
            // if (curOrders.length) {
            // let shopeeOrders = curOrders.filter(item => item.platCode === "shopee")
            // let orderInfoList = shopeeOrders.map(item => ({
            //     orderSn: item.platOrderId,
            //     storeAcctId: item.storeAcctId,
            //     buyerUserId: item.buyerUserId,
            // }))
            // layer.open({
            //     type: 1,
            //     title: "发送消息",
            //     btn: ["发送", "取消"],
            //     area: ["700px", "500px"],
            //     id: Date.now(),
            //     success: function () {
            //         layui.view(this.id)
            //         .render("route/iframe/order/orderShopeeSendMsg")
            //         .done(function () {
            //         var app = new Vue({
            //             el: "#orderShopeeSendMsg",
            //             data: {
            //             messageList: [{ id: 1 }],
            //             },
            //             methods: {
            //             // 新增
            //             orderShopeeSendMsg_add() {
            //                 let that = this
            //                 if (that.messageList.length) {
            //                 // 取最后一项
            //                     const lastObj = that.messageList[that.messageList.length - 1]
            //                     that.messageList.push({ id: lastObj.id + 1 })
            //                 } else {
            //                     that.messageList.push({ id: 1 })
            //                 }
            //             },
            //             //   删除
            //             orderShopeeSendMsg_del(index) {
            //                 let that = this
            //                 if (that.messageList.length === 1) return layer.msg("至少一条消息", { icon: 7 })
            //                 that.messageList.splice(index, 1)
            //             },
            //             },
            //         })
            //         })
            //     },
            //     yes: function (index, layero) {
            //         let messageList = []
            //         $("#orderShopeeSendMsglForm").find("input[name=msg]").each(function () {
            //             const curVal = $(this).val()
            //             if (curVal !== "") {
            //                 messageList.push(curVal)
            //             }
            //         })
            //         if (!messageList.length) return layer.msg("请输入消息")

            //         commonReturnPromise({
            //             url: "/chat/shopee/msg/batchSendMessage4Orders",
            //             type: "post",
            //             contentType: "application/json",
            //             params: JSON.stringify({ messageList, orderInfoList }),
            //         }).then((res) => {
            //             if (!res.length) {
            //                 layer.msg("操作成功", { icon: 1 })
            //                 layer.close(index)
            //             } else {
            //                 layer.alert(res.join(','),{title:'发送失败的订单',icon:2},function(alertIndex){
            //                     layer.close(alertIndex);
            //                     layer.close(index);
            //                 }); 
            //             }
            //         })
            //     },
            // })
            // } else {
            // return layer.msg("请勾选一笔订单", { icon: 7 })
            // }
        })
        $('#allStatusOrder_tiktokEmail').on('click',function(){
            // 获取选中数据
            const curOrders = allStatusOrder_gridOptions.api.getSelectedRows()
            commonorderShopeeSendMsg(curOrders, 'tiktok')
        })
        $('#allStatusOrder_ozonEmail').on('click',function(){
            // 获取选中数据
            const curOrders = allStatusOrder_gridOptions.api.getSelectedRows()
            let filterOzon = curOrders.filter(item => item.platCode != 'ozon')
            if(filterOzon.length != 0){
                return layer.msg("请选择ozon订单")
            }
            commonorderShopeeSendMsg(curOrders, 'ozon')
        })

    }

    var nowdate = new Date(new Date().toLocaleDateString()).getTime()
    var endDate = Format(nowdate + 24 * 60 * 60 * 1000 - 1, 'yyyy-MM-dd hh:mm:ss')
    var onemonth = Format(new Date(nowdate - 60 * 24 * 3600 * 1000), 'yyyy-MM-dd hh:mm:ss')
    $('#allStatusOrder_time').val(onemonth + ' - ' + endDate)
    // 物流规则
    new dropButton('allStatusOrder_logisRuleAll')
    let allStatusOrder_dealOrder = new dropButton('allStatusOrder_dealOrder')
     //打印
    new dropButton('allStatusOrder_printOperate');
    // 下载发票的枚举值
    commonReturnPromise({
        url:"/lms/printTemplate/list?templateType=INVOICE&status=1&checkPermission=false"
    }).then(res=>{
        const liStr = res.map(v=>`<li data-id="${v.id}" class="allStatusOrder_downloadInvoices_li">${v.templateName}</li>`)
        $('#allStatusOrder_downloadInvoices').find('ul').html(liStr)
        // 下载发票
        new dropButton('allStatusOrder_downloadInvoices')
          //打印澳洲发票
        $('.allStatusOrder_downloadInvoices_li').on('click', function(){
            // 获取发票id
            const tplId = $(this).data('id')
            allStatusOrderName.getTablesSelectId().then(function(res) {
              let orderIdList = res.map(item => item.id);
              if (orderIdList.length == 0) {
                  return layer.msg('没有批次号,没法打印啊', { icon: 2 });
              }
              if(orderIdList.length > 50){
                return layer.msg('数量限制50条之内', { icon: 2 })
              }
              commonReturnPromise({
                url: '/lms/printTemplate/getDownloadInvoicesUrl',
                contentType: 'application/json',
                type: 'post',
                params: JSON.stringify({ orderIdList, tplId })
              }).then(res => {
                layui.admin.batchResultAlert("打印完成:", res, function () {
                });
                let successResults = res.successResults;
                for(let i=0; i<successResults.length; i++){
                  let pdfUrl = successResults[i];
                  commonDownloadPDF(pdfUrl);
                }
              });

            }).catch(function(err) {
                layer.msg(err, { icon: 7 });
            });
        });
    })
    //订单驳至
    new dropButton('allStatusOrder_orderHandleBtns');
    // 展示和隐藏 更多查询条件
    $('#showMoreSearchCondition_allStatusOrder').click(function () {
        var self = this
        if ($(self).hasClass('showExternal')) {
            $(self).closest('.layui-form').find('.externalContainabnorlmalorder').hide()
            $('#hide_icon_allStatusOrder').show()
            $('#show_icon_allStatusOrder').hide()
            $(self).removeClass('showExternal')
            allStatusOrderHasValue ('allStatusOrderForm', 'showMoreSearchCondition_allStatusOrder')
        } else {
            $(self).closest('.layui-form').find('.externalContainabnorlmalorder').show()
            $('#hide_icon_allStatusOrder').hide()
            $('#show_icon_allStatusOrder').show()
            $(self).addClass('showExternal')
        }
    })
    function allStatusOrderHasValue (formId, btnId) {
        let inputs = $(`#${formId} .externalPopAuditorder`).find('input');
        let count = 0;
        let showDom = $(`#${btnId} .hasValue`);
        let extraArr = ['订单标签(包含)', '订单标签(不含)', '请选择'];
        for (let i = 0; i < inputs.length; i++){
            let item = inputs[i];
            let val = $(item).val();
            if ( val&& !extraArr.includes(val)){
                count++;
            }
        }
        if (count > 0) {
            showDom.html('<font color="red">有</font>');
        } else {
            showDom.html('');
        }
    }

    //订单驳回功能按钮
    $('#allStatusOrder_orderHandleBtns').on('click', 'li', function () {
        let value = $(this).attr('data-value');
        let ids = getTableSelectIds();
        if (!ids || ids.length < 1) {
            layer.msg('请选择订单', { icon: 7 });
            return;
        }
        commonOrderConfirmLayer(ids.length, function (index) {
            commonReturnPromise({
                url: '/lms/abnormalorder/orderPutBack.html',
                type: 'post',
                params: {
                    ids: ids.join(','),
                    specifyStatus: value
                }
            }).then(res => {
                layer.close(index);
                layui.admin.batchResultAlert("驳回订单:", res, function (errIdsArr) {
                    deleteTableRow_allStatusOrder(ids,errIdsArr)
                });
            })
        });
    });

    const allStatusOrderName ={
        getTablesSelectId() {
            return new Promise(function (resolve, reject) {
                let data = allStatusOrder_gridOptions.api.getSelectedRows();
                if (!data.length) {
                    reject('请先选中一条数据');
                };
                resolve(data)
            })
        },
        // //批量获取PDF和尺寸
        // batchSheetSizeAjax: function(orderIdStr) {
        //     return commonReturnPromise({
        //         url: '/lms/logistics/batch/print.html',
        //         params: {
        //             orderIdStr: orderIdStr
        //         }
        //     })
        // },
        //[多批次配货]打印请求
        printSortAjax: function(batchNo, orderId) {
            let requestStr = {}
            if (orderId) {
                requestStr.orderId = orderId
            }else {
                requestStr.batchNo = batchNo
            }
            return commonReturnPromise({
                url: '/lms/pickpackorder/getpickbatchsku.html',
                params: requestStr
            })
        },
        //打印带有SKU的物流面单
        batchOrderSkuLogis: function(orderIdStr) {
            return commonReturnPromise({
                url: '/lms/logistics/batch/print/skuLabel.html',
                params: {
                    orderIdStr: orderIdStr
                }
            })
        },
        //统一打印功能
        packagePrint:async function(data, sku) {
            let obj = {};
            obj.printType = 19;
            obj.labelUrl = data.ftpLabelUrl;
            obj.width = data.width;
            obj.height = data.height;
            obj.printName = '100100';
            if (obj.height === 150) {
                obj.printName = '100150'
            }
            logistics_label_pdf_print(obj);
        },

        //下拉按钮事件汇总
        dropdownHandle: function() {
            const _this = this;
            //打印物流面单
            $('#allStatusOrder_logisLi').on('click', function() {
                _this.getTablesSelectId().then(function(res) {
                    var orderIdsArr = res.map(function(item) {
                        return item.id;
                    });
                    $.ajax({
                        type: "POST",
                        url: ctx + "/logistics/batch/print.html",
                        data: { orderIdStr: orderIdsArr.join() },
                        beforeSend: function () {
                            loading.show();
                        },
                        success: function (returnData) {
                            loading.hide();
                            var paramsMapList = returnData.successResults;
                            if (paramsMapList && paramsMapList.length > 0) {
                                // joom 平台的数据打印宽度需要是150，
                                if (orderIdsArr.filter(item => item.platCode == 'joom').length) {
                                    var _result = returnData.successResults
                                } else {
                                    var _result = returnData.successResults.map(item => {
                                        let _item = res.find(elem => elem.id == item.orderId)
                                        if (_item.platCode == 'joom') {
                                            item.width = 100
                                            item.height = 150
                                        }
                                        return item
                                    })
                                }
                                for (var j = 0; j < _result.length; j++) {
                                    _this.packagePrint(returnData.successResults[j]);
                                }
                            }
                            if(returnData.failResults && returnData.failResults.length > 0){
                                let str = '';
                                returnData.failResults.forEach(item => {
                                    str += item + "<br>"
                                })
                                layer.alert(str,{icon:2})
                            }
                        }, error: function (err) {
                            loading.hide();
                            console.log(err)
                        }
                    })

                    // _this.batchSheetSizeAjax(orderIdsArr.join()).then(function(result) {
                    //     // joom 平台的数据打印宽度需要是150，
                    //     if (orderIdsArr.filter(item => item.platCode == 'joom').length) {
                    //         var _result = result
                    //     } else {
                    //         var _result = result.map(item => {
                    //             let _item = res.find(elem => elem.id == item.orderId)
                    //             if (_item.platCode == 'joom') {
                    //                 item.width = 100
                    //                 item.height = 150
                    //             }
                    //             return item
                    //         })
                    //     }
                    //     for (var j = 0; j < _result.length; j++) {
                    //         _this.packagePrint(result[j]);
                    //     }
                    // }).catch(function(resErr) {
                    //     layer.msg(resErr || resErr.message, { icon: 2 });
                    // });
                }).catch(function(err) {
                    layer.msg(err, { icon: 7 });
                });
            });
            //打印配货单
            $('#allStatusOrder_setLi').on('click', function() {
                _this.getTablesSelectId().then(function(res) {
                    var orderIdsArr = res.map(function(item) {
                        console.log(item);
                        return item.id;
                    });
                    if (orderIdsArr.length == 0) {
                        return layer.msg('没有批次号,没法打印啊', { icon: 2 });
                    }
                    for (var i = 0; i < orderIdsArr.length; i++) {
                        _this.printSortAjax(null,orderIdsArr[i]).then(function(objectData) {
                            //然后组装参数去调用打印接口
                            epeanPrint_plugin_fun(20, objectData);
                        })
                    }

                }).catch(function(err) {
                    layer.msg(err, { icon: 7 });
                });
            });
            //打印物流面单（含SKU）
            $('#allStatusOrder_setlogisLi').on('click', function () {
                _this.getTablesSelectId().then(function(res) {
                    var orderIdsArr = res.map(function(item) {
                        return item.id;
                    });
                    const orderIdStr = orderIdsArr.join()
                    commonReturnPromise({
                        url: `/lms/logistics/v1/batch/print/skuInfoAndLogistics`,
                        type: 'post',
                        params: {
                          orderIdStr: orderIdStr
                        }
                    }).then(async returnData => {
                        function orderDataPrint(inntObj, sku) {
                        let obj = {}
                        obj.printType = 19
                        obj.labelUrl = inntObj.ftpLabelUrl
                        obj.width = inntObj.width
                        obj.height = inntObj.height
                        obj.printName = "100100"
                        if (obj.height === 150) {
                            obj.printName = "100150"
                        }
                        return obj
                        }
    
                        var resultSheet = returnData.successResults
                        let resultDataArr = [],
                        countIndex = 0
                        if (resultSheet && resultSheet.length > 0) {
                        for (var j = 0; j < resultSheet.length; j++) {
                            let resultDataObjOne = orderDataPrint(resultSheet[j])
                            resultDataArr.push(resultDataObjOne)
                        }
                        }
                        if (returnData.failResults && returnData.failResults.length > 0) {
                        let str = ""
                        returnData.failResults.forEach(item => {
                            str += item.orderId + ": " + item.ftpLabelUrl + "<br>"
                        })
                        layer.alert(str, { icon: 2 })
                        }
                        let timeset
                        timeset = window.setInterval(function () {
                        if (countIndex >= resultDataArr.length) {
                            window.clearInterval(timeset)
                        } else {
                            logistics_label_pdf_print(resultDataArr[countIndex])
                        }
                        countIndex++
                        }, 500)
                    })
                    
                }).catch(function(err) {
                    layer.msg(err || err.message, { icon: 7 });
                });

            })
            //打印澳洲发票
            $('#allStatusOrder_australiaBill').on('click', function(){
                _this.getTablesSelectId().then(function(res) {
                  let orderIdsArr = res.map(item => item.id);
                  if (orderIdsArr.length == 0) {
                      return layer.msg('没有批次号,没法打印啊', { icon: 2 });
                  }
                  if(orderIdsArr.length > 50){
                    return layer.msg('数量限制50条之内', { icon: 2 })
                  }
                  commonReturnPromise({
                    url: '/lms/printTemplate/getDownloadInvoicesUrl',
                    params: {
                      orderId: orderIdsArr.join(',')
                    }
                  }).then(res => {
                    layui.admin.batchResultAlert("打印完成:", res, function () {
                    });
                    let successResults = res.successResults;
                    for(let i=0; i<successResults.length; i++){
                      let pdfUrl = successResults[i];
                      commonDownloadPDF(pdfUrl);
                    }
                  });

                }).catch(function(err) {
                    layer.msg(err, { icon: 7 });
                });
            });
        },
    }
    //打印下拉按钮事件汇总
    allStatusOrderName.dropdownHandle()
    form.on('submit(allStatusOrder_export)', function (data) {
        let ids = getTableSelectIds();
        if (!ids || ids.length < 1) {
            layer.msg('请选择订单', { icon: 7 });
            return;
        }
        // layer.confirm('导出选择的订单？', function (result) {
        //     if (result) {
                let param = {};
                param.orderIds = ids.join(",");
                submitForm(param, ctx + '/platorder/exportorder.html', "_blank");
                layer.closeAll();
        //     }
        // });
    });
    form.on('submit(allStatusOrderDetail_export)', function (data) {
        let ids = getTableSelectIds();
        if (!ids || ids.length < 1) {
            layer.msg('请选择订单', { icon: 7 });
            return;
        }
        // layer.confirm('导出选择的订单明细？', function (result) {
        //     if (result) {
                let param = {};
                param.orderIds = ids.join(",");
                submitForm(param, ctx + '/platorder/exportorderdetail.html', "_blank");
                layer.closeAll();
        //     }
        // });
    });
    //选项卡点击事件
    element.on('tab(allStatusOrder_Tab)', function (data) {
        var processStatus = data.elem.context.dataset.index;
        $('#allStatusOrderForm input[name="processStatus"]').val(processStatus);
        $('#allStatusOrderSearch').click();
        //触发页面操作按钮变化 TODO

        $("#allStatusOrder_replenishCheck").hide();
        $("#allStatusOrder_holdStockTask").hide();
        $("#allStatusOrder_toAudit").hide();
        $("#allStatusOrder_toCancel").hide();
        $("#allStatusOrder_appointWarehouseType").hide();
        if (processStatus == 501) {
            //黑名单订单
            $("#allStatusOrder_toAudit").show();
            $("#allStatusOrder_toCancel").show();
        } else if (processStatus == 502) {
            //缺货订单
            $("#allStatusOrder_replenishCheck").show();
            $("#allStatusOrder_holdStockTask").show();
            $("#allStatusOrder_appointWarehouseType").show();
        } else if (processStatus == 503) {
            //取消订单
            $("#allStatusOrder_toAudit").show();
        } else if (processStatus == 500) {
            //其他异常单
            $("#allStatusOrder_toAudit").show();
            $("#allStatusOrder_toCancel").show();
            $("#allStatusOrder_appointWarehouseType").show();
        }
    });
    //燕文截单
    $('#allStatusOrder_yanwenCutOrder').on('click', function () {
        let idsArr = getTableSelectIds();
        if (idsArr.length == 0) {
            return layer.msg('请先选择数据', { icon: 7 });
        }
        layer.prompt({
            formType: 2,
            value: '',
            title: '燕文截单备注',
            area: ['500px', '300px'] //自定义文本域宽高
        }, function (value, index) {
            commonReturnPromise({
                url: '/lms/platorder/cancelYanwen.html',
                type: 'post',
                params: {
                    ids: idsArr.join(','),
                    remark: value
                }
            }).then(res => {
                console.log(res);
                layui.admin.batchResultAlert("燕文截单完成:", res, function () {
                });
                layer.close(index);
            });
        });
    });
    //#region 物流规则分析start
    //物流规则匹配分析-操作
    $('#allStatusOrder_logisRule_match_analysis').on('click', function () {
        let idsArr = getTableSelectIds();
        if (idsArr.length == 0) {
            return layer.msg('请先选择数据', { icon: 7 });
        }
        if (idsArr.length > 1) {
            return layer.msg('物流规则分析只能选择一笔订单', { icon: 7 });
        }
        //弹框处理
        allStatusOrder_logisRule_match_analysis_getInfo(idsArr.join()).then(res => {
            let index = layer.open({
                type: 1,
                title: '物流规则匹配分析',
                content: $('#allStatusOrder_logisRule_match_analysisLayer').html(),
                id: 'allStatusOrder_logisRule_match_analysisLayerId',
                area: ["100%", "100%"],
                btn: ['关闭'],
                success: function (layero, index) {
                    let data = {};
                    var getTpl = allStatusOrder_logisRule_match_analysisLayerTpl.innerHTML,
                    view = document.getElementById("allStatusOrder_logisRule_match_analysisLayerContainer");
                    laytpl(getTpl).render(res, function(html) {
                        view.innerHTML = html;
                        //监听切换,重新渲染表格
                        element.on('tab(allStatusOrder_logisRule_match_analysis_tabs)', function (obj) {
                            let attr = obj.elem.context.dataset.attr;
                            allStatusOrder_logisRule_match_analysis_tableRender(res['resultMap'][attr] || []);
                        });
                        //导出功能
                        allStatusOrder_logisRule_match_analysis_exportHandle(res['resultMap']);
                        //排序
                        allStatusOrder_logisRule_match_analysis_sortHandle(res['resultMap']);
                    });
                }
            })
        });
    });
    //物流规则匹配分析---导出
    function allStatusOrder_logisRule_match_analysis_exportHandle (resultMap) {
        $('#allStatusOrder_logisRule_match_analysis_exportBtn').on('click', function () {
            //找出选中的标签
            let tag = $('#allStatusOrder_logisRule_match_analysis_tabs>ul>li.layui-this').data('attr');
            let data = resultMap[tag] || [];
            if (data.length == 0) {
                return layer.msg('没有需要导出的数据', { icon: 7 });
            } else {
                loading.show();
                transBlob({
                    url: ctx + "/platorder/exportMatchInfo.html",
                    formData: JSON.stringify(data),
                    fileName: tag + ".xlsx",
                    contentType: 'application/json'
                }).then(function (result) {
                    loading.hide();
                    layer.alert("导出成功",{icon:1})
                }).catch(function (err) {
                    layer.msg(err, {icon: 2});
                });
            }
        });
    }
    //物流规则匹配分析---表格渲染
    function allStatusOrder_logisRule_match_analysis_tableRender (data) {
        let str = '';
        //筛选最低运费
        let minimumPrice;
        if (data[0] && data[0]['logisticsPrice'] != null) {
            minimumPrice = Math.min.apply(Math, data.map(item => item['logisticsPrice'] || 0));
        }
        console.log(minimumPrice);
        for (let i = 0; i < data.length; i++){
            let item = data[i];
            if (item['logisticsPrice'] !=null && (minimumPrice == item['logisticsPrice'])) {
                str += `
                    <tr class="shallow-yellow">
                    <td>${i + 1}</td>
                    <td>${item.priority}</td>
                    <td>${item.logisticsTypeName}</td>
                    <td>${item.ruleName}</td>
                    <td>${item.remark}</td>
                    <td>${item.desc}</td>
                </tr>
                `;
            } else {
                str += `
                    <tr>
                    <td>${i + 1}</td>
                    <td>${item.priority}</td>
                    <td>${item.logisticsTypeName}</td>
                    <td>${item.ruleName}</td>
                    <td>${item.remark}</td>
                    <td>${item.desc}</td>
                </tr>
                `;
            }

        }
        $('#allStatusOrder_logisRule_match_analysis_tbody').empty().html(str);
    }
    //物流规则匹配分析-排序
    function allStatusOrder_logisRule_match_analysis_sortHandle (resultMap) {
        $('#allStatusOrder_logisRule_match_analysisLayerContainer').on('click', '.priority_sort .layui-icon', function () {
            let isUp = $(this).hasClass('match-analysis-up');
            let tag = $('#allStatusOrder_logisRule_match_analysis_tabs>ul>li.layui-this').data('attr');
            let data = resultMap[tag] || [];
            let newData = [];
            if(isUp){
                //从小到大排序-升序
                newData = data.sort((a, b) => {
                    return a.priority - b.priority;
                });
            } else {
                //从大到小排序-降序
                newData = data.sort((a, b) => {
                    return b.priority - a.priority;
                });
            }
            allStatusOrder_logisRule_match_analysis_tableRender(newData);
        });
    }
    //接口:获取信息
    function allStatusOrder_logisRule_match_analysis_getInfo (id) {
        return commonReturnPromise({
            url: '/lms/platorder/getLogisticRuleMatchDetail.html',
            params: {
                id: id
            }
        });
    }
    //#endregion end

    //#region 更换跟踪号
    $('#allStatusOrder_logisRule_replace_trackNum').on('click', function () {
        let idsArr = getTableSelectIds();
        if (idsArr.length == 0) {
            return layer.msg('请先选择数据', { icon: 7 });
        }
        commonReturnPromise({
            url: '/lms/platorder/logisNoChangeQuery.html',
            params: {
                ids: idsArr.join(',')
            }
        }).then(res => {
            replaceTrackNumLayerHandle(res);
        });
    });

    //弹框
    function replaceTrackNumLayerHandle (data) {
        replaceTrackNumLayerCompanys().then(res => {
            let companys = res.companys;
            data.forEach(item => item.companys = companys);
            //循环数据,拿到数据下的所有物流公司id,获取到所有的物流方式
            data.forEach(item => {
                replaceTrackNumLayerGetLogisByCompany(item.logisCompanyId).then(wayRes => {
                    item.logisticsModes = wayRes;
                });
            });
            layer.open({
                type: 1,
                title: '更换跟踪号',
                area: ['90%', '90%'],
                content: $('#allStatusOrder_logisRule_replace_trackNum_layer').html(),
                id: 'allStatusOrder_logisRule_replace_trackNumId',
                success: function (layero, index) {
                    //根据数据渲染表格
                    setTimeout(() => {
                        var getTpl = allStatusOrder_logisRule_replace_trackNum_layer_tbodyTpl.innerHTML,
                        view = document.getElementById("allStatusOrder_logisRule_replace_trackNum_layer_tbody");
                        laytpl(getTpl).render(data, function (html) {
                            view.innerHTML = html;
                            form.render('select');
                            //事件操作
                            replaceTrackNumLayerBtnHandle(layero);
                        });
                    }, 300);
                }
            })
        });
        
    }
    //获取所有物流公司,匹配用
    function replaceTrackNumLayerCompanys () {
        return commonReturnPromise({
            url: '/lms/unauditorder/listcompanyandagent.html',
            type: 'post'
        });
    }
    //根据物流公司获取物流方式
    function replaceTrackNumLayerGetLogisByCompany (id) {
        return commonReturnPromise({
            url: '/lms/unauditorder/listlogistype.html',
            params: {
                logisticsCompanyId: id,
                specialType: "直发物流"
            }
        });
    }
    //物流公司和物流方式联动
    // function replaceTrackNumLayerMonitor (filter, id) {
    //     form.on(`select(${filter})`, function (obj) {
    //         let val = obj.value;
    //         replaceTrackNumLayerGetLogisByCompany(val).then(res => {
    //             commonRenderSelect(`trackNum_logisType${id}`, res, {
    //                 code: 'id',
    //                 name: 'name',
    //                 str: ''
    //             }).then(() => {
    //                 form.render('select', `trackNum_logisType${id}`);
    //             });
    //         });
    //     });
    // }
    //按钮点击事件
    function replaceTrackNumLayerBtnHandle (layero) {
        let $tbody = $('#allStatusOrder_logisRule_replace_trackNum_layer_tbody');
        //申请跟踪号
        $('#allStatusOrder_logisRule_replace_trackNum_applyBtn').on('click', function () {
            let trs = $tbody.find('tr');
            let arr = [];
            for (let i = 0; i < trs.length; i++){
                let item = trs[i];
                let obj = {};
                obj.id = $(item).find('td.id').text();
                obj.logisTypeId = $(item).find('td.logisType select[name=logisType]').val();
                arr.push(obj);
            }
            commonReturnPromise({
                type: 'post',
                url: '/lms/platorder/logisNoChangeApply.html',
                contentType: 'application/json',
                params: JSON.stringify(arr)
            }).then(res => {
                //申请跟踪号
                admin.batchResultObjAlert('申请跟踪号:', res, function () {
                   //更新表格
                    let successData = res.successResults;
                    for (let i = 0; i < successData.length; i++){
                        let item = successData[i];
                        layero.find(`#tr${item.id} .newLogisTrackingNo`).text(item.logisTrackingNo);
                    }
                });
            });
        });
        //更换跟踪号
        $('#allStatusOrder_logisRule_replace_trackNum_changeBtn').on('click', function () {
            let trs = $tbody.find('tr');
            let arr = [];
            for (let i = 0; i < trs.length; i++){
                let item = trs[i];
                let obj = {};
                obj.id = $(item).find('td.id').text();
                obj.logisTrackingNo = $(item).find('td.newLogisTrackingNo').text();
                obj.logisTypeId = $(item).find('td.logisType select[name=logisType]').val();
                arr.push(obj);
            }
            layer.confirm(`请确认是否更换${trs.length}笔订单的跟踪号?`, { icon: 3, title: '提示' }, function (index) {
                layer.close(index);
                commonReturnPromise({
                    url: '/lms/platorder/logisNoChangeSave.html',
                    type: 'post',
                    contentType: 'application/json',
                    params: JSON.stringify(arr)
                }).then(res => {
                    //更换跟踪号
                    admin.batchResultObjAlert('更换跟踪号:', res, function () {
                        let successData = res.successResults;
                        for (let i = 0; i < successData.length; i++){
                            let item = successData[i];
                            layero.find(`#tr${item.id} .newLogisTrackingNo`).text(item.logisTrackingNo);
                        }
                    });
                });
            });  
        });
    }
    //#endregion

    // 获取跟踪号
    $('#allStatusOrder_logisRule_getEdisebay').click(function(){
        let idArr = getTableSelectIds();
        if (idArr.length <= 0) {
            layer.msg("请选择订单", { icon: 7 })
            return
        }
        commonReturnPromise({
            url: "/lms/unauditorder/getlogistrackingno.html",
            type: "post",
            params: {
            ids: idArr.join(","),
            },
        }).then(res => {
            layui.admin.batchResultAlert("获取跟踪号完成:", res, function (errIdsArr) {
                updateTableRow_allStatusOrder(idArr, errIdsArr)
            })
        })
    });
    // 表单提交
    form.on('submit(allStatusOrderSearch)', function (data) {
        if (data.field.time) {
            data.field.orderTimeStart = data.field.time.split(' - ')[0];
            data.field.orderTimeEnd = data.field.time.split(' - ')[1];
        }
        if (data.field.skuType) {
            data.field[data.field.skuType] = data.field.skuvalue
        }
        if (data.field.salerAndcustomSelect == 2) {
            data.field.customServicerId = data.field.salePersonId;
            delete data.field.salePersonId;
        }else if(data.field.salerAndcustomSelect == 4) {//leader组长
          data.field.leaderId = data.field.salePersonId;
          delete data.field.salePersonId;
        }else if(data.field.salerAndcustomSelect == 3) {//directorId主管
          data.field.directorId = data.field.salePersonId;
          delete data.field.salePersonId;
        }

        //处理平台标签和订单标签切换
        if((data.field.platTagsSign == 2 || data.field.platTagsSign == 3) && data.field.orderTagList == ''){
          //是订单标签
          data.field.orderTagSign = data.field.platTagsSign - 2;
          data.field.orderTagList = data.field.platTags;
          data.field.platTagsSign = 0;
          data.field.platTags = '';
        }else if((data.field.platTagsSign == 2 || data.field.platTagsSign == 3) && data.field.orderTagList != ''){
          data.field.platTagsSign = 0;
          data.field.platTags = '';
        }

        //天数类型处理
        if (data.field.dateType == 1) {//订单天数      
        } else if (data.field.dateType == 2) {//跟踪号天数
            data.field.trackDateMin = data.field.orderDateMin;
            data.field.trackDateMax = data.field.orderDateMax;
            delete data.field.orderDateMin;
            delete data.field.orderDateMax;
        } else if (data.field.dateType == 3) {//剩余天数
            data.field.shipByDateMin = data.field.orderDateMin;
            data.field.shipByDateMax = data.field.orderDateMax;
            delete data.field.orderDateMin;
            delete data.field.orderDateMax;
        }else if (data.field.dateType == 4) {// 跟踪剩余天数
            data.field.trackCloseTimeMin = data.field.orderDateMin;
            data.field.trackCloseTimeMax = data.field.orderDateMax;
            delete data.field.orderDateMin;
            delete data.field.orderDateMax;
        }else if(data.field.dateType == 5){ //发货剩余天数
          data.field.shipDeadLineMin = data.field.orderDateMin;
          data.field.shipDeadLineMax = data.field.orderDateMax;
          delete data.field.orderDateMin;
          delete data.field.orderDateMax;
        }
        //订单编号处理
        if (data.field.orderIds) {
            //替换全角逗号
            data.field.orderIds = data.field.orderIds.replace(/，/g, ",");
            //校验
            for (let orderId of data.field.orderIds.split(",")) {
                if (!isNaN(orderId) && orderId % 1 === 0) {

                } else {
                    layer.msg("订单编号不正确", { icon: 0 });
                    return;
                }
            }
        }
        //物流公司货代公司不为空时，获取所有物流属性
        if (!data.field.logisTypeIds) {
            if ($("#allStatusOrderForm select[name=company]").val()) {
                let logisTypeIds = [];
                $("#allStatusOrderForm select[name=logisTypeIds] option").each(function () {
                    let logisTypeId = $(this).attr("value");
                    if (logisTypeId && logisTypeId != 0) {
                        logisTypeIds.push(logisTypeId);
                    }
                });
                data.field.logisTypeIds = logisTypeIds.join(",");
            }
        }
        // 物流方式与物流方式
        if(data.field.agentCompany == 'logisticsModes' && data.field.logisticsCompanyId && !data.field.logisTypeIds){
            data.field.logisTypeIds = $('#logisTypeIds_xm_select_allOrder').attr('acct_ids')
        }

        if(data.field.agentCompany == 'logisticsModes'){
            data.field.agentCompany = ''
        }

        if (data.field.agentCompany == 'agents' && data.field.logisticsCompanyId) {
            data.field.agentCompany = data.field.logisticsCompanyId
            delete data.field.logisticsCompanyId
        }else if(data.field.agentCompany == 'companys' && data.field.logisticsCompanyId){
            delete data.field.agentCompany
        }else {
            data.field.agentCompany = '';
            delete data.field.logisticsCompanyId
        }
        if (data.field.newBatchNo == 1) { // 拣货批次
            data.field.pickBatchNo = data.field.valBatchNo
        }else if(data.field.newBatchNo == 2){ // 组包批次
            data.field.handoverBatchNo = data.field.valBatchNo
        }
        // 1. 选择了部门，没有选店铺
        //     1.1 部门下有店铺，传全部店铺
        //     1.2 部门下没有店铺，传0
        // 2. 选择了部门，选择了店铺，传选择的店铺
        if(data.field.orgs != ''&&data.field.storeAcctIds == ''){
            data.field.storeAcctIds = $('#allStatusOrder_store').attr('acct_ids') || 0;
        }
        // 什么查询条件都不设置时： 时间、订单编号、店铺单号、跟踪号至少设置一条
        if(data.field.time ==='' && data.field.orderIds === '' && data.field.platOrderIds === '' && data.field.logisTrackingNos ===''){
            return layer.msg('时间、订单编号、店铺单号、跟踪号至少设置一条')
        }
        //把data.field值循环一下,去掉空格
        for (let key in data.field) {
          data.field[key] = $.trim(data.field[key]);
        }
        
        allStatusOrderTableorder(data.field)
    });

    // //监听平台下拉选择
    // form.on('select(allstatusplatCodes)', function (obj) {
    //     // 销售员
    //     commonOrderAddSalePerson('allStatusOrder', form, obj.value);
    //     // 平台状态
    //     getListplatorderstatus_allstatusorder(obj.value, function(returnData){
    //         let arr = []
    //         returnData.data && returnData.data.forEach(item => arr.push({"platOrderStatus":item}))
    //         appendSelect($('#allStatusOrderForm').find('select[_name="platOrderStatusList"]'),arr, 'platOrderStatus', 'platOrderStatus')
    //     })
    //     // 店铺
    //     getStoreByPlatform(obj.value, function (returnData) {
    //         appendSelect($('#allStatusOrderForm').find('select[_name="storeAcctIds"]'), returnData.data, 'id', 'storeAcct')
    //     })
    // })
    //监听平台下拉选择
    commonInitRenderRoleType('allStatusOrder');
    form.on('select(allstatusplatCodes)', function (obj) {
        //还原角色选项框
        $('#allStatusOrderForm').find('[name=salerAndcustomSelect]').val(1);
        // 部门
        commonOrderAddOrg('allStatusOrder', form, obj.value);
        // 平台状态
        getListplatorderstatus_allstatusorder(obj.value, function(returnData){
            let arr = []
            returnData.data && returnData.data.forEach(item => arr.push({"platOrderStatus":item}))
            appendSelect($('#allStatusOrderForm').find('select[_name="platOrderStatusList"]'),arr, 'platOrderStatus', 'platOrderStatus')
        })
    })

    //监听公司下拉选择
    form.on('select(allstatuscompanyType)', function (obj) {
        allStatusOrder_companyType = obj.value
        let name = obj.value ==='logisticsModes' ? 'logisticsCollectionName' : 'cnName'
        appendSelect($('#allStatusOrderForm').find('select[name="logisticsCompanyId"]'), allStatusOrder_company[allStatusOrder_companyType], 'id', name)
        form.render()
    })
    //监听物流公司下拉选择
    form.on('select(allstatuscompany)', function (obj) {
        var agent = "",
            logisticsModeId='',
            logisticsCompanyId = "";
        if(allStatusOrder_companyType === 'agents'){
            agent = obj.value
        }else if(allStatusOrder_companyType === 'companys'){
            logisticsCompanyId = obj.value
        }else if(allStatusOrder_companyType === 'logisticsModes'){
            logisticsModeId = obj.value
        }
        getAllLogicsType(agent, logisticsCompanyId, logisticsModeId)
        form.render()
    })


    //监听工具栏操作
    table.on("tool(allStatusOrder_table)", function (obj) {
        var event = event ? event : window.event;
        event.stopPropagation();
        var data = obj.data
        if (obj.event === "") {
        }
    });

    getPageEnum();
    getAllCompanies();
    getStoreByPlatform('', function (returnData) {
        allStatusOrder_allstore = returnData.data
    });
    getAllLogicsType('', '', '', function (returnData) {
        allStatusOrder_logisType = returnData.data
    });
    getAlldevEmployee();
    getAllpurchaseEmployee();
    getAllSite();
    getCurrencyEnums();
    form.on('select(warehouseId)', function(data){
        let warehouseId=data.value;
         // 仓库楼栋联动
        allStatusOrder_build_floor("#allStatusOrderForm",warehouseId);
    }); 



    // 页面数据请求----------------------------------------
    //  获取页面枚举数
    function getPageEnum() {
        initAjax('/unauditorder/listenum.html', 'post', {}, function (returnData) {
            allStatusOrder_pageEnum = returnData.data
            allStatusOrder_pageEnum.platCode = allStatusOrder_pageEnum.platCodes
            allStatusOrder_pageEnum.prodLogisAttrs = allStatusOrder_pageEnum.logisAttrs
            allStatusOrder_pageEnum.shippingCountryCodes = allStatusOrder_pageEnum.shippingCountrys
            allStatusOrder_pageEnum.warehouseId = allStatusOrder_pageEnum.prodWarehouses
            allStatusOrder_pageEnum.processStatusList = allStatusOrder_pageEnum.orderProcessStatus
            let temporayReturn = []
            returnData.data.orderLabels.forEach((v)=>{
                let temporayObj = {}
                temporayObj.name = v.code
                temporayObj.value = v.name
                temporayReturn.push(temporayObj)
            })
            returnData.data.orderLabels = temporayReturn
            allStatusOrder_pageEnum.orderLabels = temporayReturn
            allStatusOrder_pageEnum.allStatusOrder_orderLabels = allStatusOrder_pageEnum.orderLabels

            for (var i in returnData.data) {
                if(i=='warehouseBuildingNoMap'){continue;}
                appendSelect($('#allStatusOrderForm').find('select[name="' + i + '"]'), returnData.data[i], 'name', 'value')
                appendSelect($('#allStatusOrderForm').find('select[_name="' + i + '"]'), returnData.data[i], 'name', 'value')

                if (i === 'shippingCountryCodes') {
                    const shippingCountryCodeList = allStatusOrder_pageEnum.shippingCountryCodes.map(item => ({
                        ...item,
                        name: item.value + "(" + item.name + ")",
                        shippingCountryCode: item.name,
                        shippingCountryName: item.enFullValue,
                        shippingCountryCnName: item.value,
                    }))
                    appendSelect($('#allStatusOrderForm').find('select[name="shippingCountryCodes"]'), shippingCountryCodeList, 'shippingCountryCode', 'name')
                    appendSelect($('#allStatusOrderForm').find('select[_name="shippingCountryCodes"]'), shippingCountryCodeList, 'shippingCountryCode', 'name')
                }
            }
            form.render()
            formSelects.render('orderLabels')
            formSelects.render('logisAttrs')
            formSelects.render('allStatusOrder_orderLabels', {placeholder: '备注类型'})
            formSelects.render('shippingCountrys')
            formSelects.render('processStatusList');
        })
    }
    //获取所有物流公司以及货代公司
    function getAllCompanies() {
        initAjax('/unauditorder/listcompanyandagent.html', 'post', {}, function (returnData) {
            allStatusOrder_company = returnData.data
            appendSelect($('#allStatusOrderForm').find('select[name="logisticsCompanyId"]'), returnData.data.logisticsModes, 'id', 'logisticsCollectionName')
            form.render()
        })
    }

    //获取所有物流方式
    function getAllLogicsType(agent, logisticsCompanyId, logisticsModeId, func) {
        initAjax('/unauditorder/listlogistype.html', 'get', { agent, logisticsCompanyId, logisticsModeId, specialType: "直发物流" }, function (returnData) {
            if (func) {
                func(returnData)
            }
            // 如果有具体的值,就不用添加空选项了
            if($('#allStatusOrderForm').find('select[name=logisticsCompanyId]').val()!==''){
            }else{
                returnData.data.unshift({ id: 0, name: "空" });
            }
            appendSelect($('#allStatusOrderForm').find('select[_name="logisTypeIds"]'), returnData.data, 'id', 'name')
            formSelects.render('logisTypeIds_xm_select_allOrder');
            //20231129-执行一次获取所有的物流状态
            let idsArr = returnData.data.map(item => item.id);
            allOrderInitLogisticStatusRender(idsArr.join(','));
        })
    }

    //根据平台code获取店铺列表
    function getStoreByPlatform(platcode, func) {
        initAjax('/sys/orderliststorebyplatcode.html', 'get', { platCode: platcode }, function (returnData) {
            if (func) {
                func(returnData)
            }
            formSelects.render('allStatusOrder_store',{ placeholder: '请先选择平台' });
        }, 'application/x-www-form-urlencoded')
    }

    // 获取平台状态
    function getListplatorderstatus_allstatusorder(platcode, func) {
        initAjax('/undispatch/listplatorderstatus.html', 'get',{platCode:platcode}, function(returnData) {
            if (func) {
                func(returnData)
            }
            formSelects.render('platOrderStatusList',{ placeholder: '请先选择平台' })
        }, 'application/x-www-form-urlencoded')
    }

    //获取所有开发专员
    function getAlldevEmployee() {
        initAjax('/sys/prodOwnerList.html', 'post', {}, function (returnData) {
            appendSelect($('#allStatusOrderForm').find('select[name="preprodDevId"]'), returnData.data, 'id', 'loginName')
            form.render()
        })
    }

    //获站点接口
    function getAllSite(platCode, func) {
        initAjax('/enum/getSiteEnum.html?platCode=' + platCode, 'post', {}, function (returnData) {
            allStatusOrder_Site = returnData.data
            if (func) {
                func(returnData)
            }
        }, 'application/x-www-form-urlencoded')
    }

    //获取所有采购专员
    function getAllpurchaseEmployee() {
        initAjax('/sys/buyerList.html', 'post', {}, function (returnData) {
            appendSelect($('#allStatusOrderForm').find('select[name="purchasingAgentId"]'), returnData.data, 'id', 'loginName')
            form.render()
        })
    }

    //获取币种枚举
    function getCurrencyEnums() {
        initAjax('/sysdict/getCurrencyEnums.html', 'post', {}, function (returnData) {
            allStatusOrder_Currency = returnData.data
        })
    }

    function Selected(aDom, value) {
        var options = aDom.find('option');
        options.each(function (index, item) {
            if (item.value == value) {
                $(item).attr('selected', true)
            }
        })
        form.render()
    }

    //店铺选中
    function storeSelected(aDom, value) {
        var options = aDom.find('option');
        options.each(function (index, item) {
            var storeAcctId = item.value.split('_')[0]
            if (storeAcctId == value) {
                $(item).attr('selected', true)
            }
        })
        form.render()
    }

    // 驳回订单
    $("#allStatusOrder_rejectOrder_btn").click(function () {
        const curOrders = allStatusOrder_gridOptions.api.getSelectedRows()
        const curSearchProcessStatus = $('#allStatusOrderForm').find('select[name=processStatus]').val()
        // 目前可以驳回订单的状态
        // 已发货180 待发货140  带包装130  待核单125   待配货120 待派单115
        const canRejectStatus = [180, 140, 130, 125, 120, 115]
        // 筛选出满足的
        const _canRejectArr = curOrders.filter(item => item.processStatus && canRejectStatus.includes(item.processStatus))
        if (!_canRejectArr.length) {
            return layer.msg('该状态下，不可驳回订单',{icon:7})
        }
        const idsArr = _canRejectArr.map(item => item.id);
        commonReturnPromise({
            url: ctx + '/abnormalorder/toaudit.html',
            type: 'post',
            params: {
                ids: idsArr.join()
            }
        })
        .then(data => {
            admin.batchResultAlert("驳回订单完成:", data, function () {
                if(data.successResults.length){
                    const processStatusList = {
                        "黑名单订单":"501",
                        "缺货订单":"502",
                        "取消订单":"503",
                        "其他异常订单":"500",
                        "待审核":"110",
                        "待派单":"115",
                        "待配货":"120",
                        "待核单":"125",
                        "待包装":"130",
                        "仓库缺货":"135",
                        "待发货":"140",
                        "已发货":"180",
                        "已归档":"200",
                        "仓库拦截":"136",
                    }
                    if(curSearchProcessStatus){
                        changeCount('#allStatusOrder_Tab',data.successNum)
                        allStatusOrder_gridOptions.api.updateRowData({ remove: _canRejectArr });
                    }else{
                        let temArr = data.successResults.join().replace(/订单/g, '').split(',').map(v => {
                            const curStatusStr = v.split('：')[1] || v.split(':')[1]
                            return {
                                id:parseInt(v),processStatus:processStatusList[curStatusStr]
                            }
                        })
                        const rejectSuccArr = _canRejectArr.map(item=>{
                           const curChooseOrder = temArr.filter(elem=>item.id==elem.id)
                           return { ...item,processStatus:curChooseOrder.length?curChooseOrder[0].processStatus:item.processStatus}
                        })
                        allStatusOrder_gridOptions.api.updateRowData({ update: rejectSuccArr });
                    }
                }
                // $('#allStatusOrderSearch').trigger('click');
            });
        })
    })

    //获取华亿跟踪号
    $('#allStatusOrder_huayiTrackingNo_btn').click(function () {
        let dataArr = allStatusOrder_gridOptions.api.getSelectedRows();
        if (dataArr.length == 0) {
            return layer.msg('请先选择数据', { icon: 7 });
        }
        let submitArr = dataArr.map(item => {
            return {
                "logisticsTypeId": item.logisTypeId,
                "orderId": item.id,
                "logisAgentTrackingNo": item.logisAgentTrackingNo || '',
                "packageWeight": (item.realWeight / 1000) || 0
            }
        });
        //调用接口处理数据
        commonReturnPromise({
            url: '/lms/huayi/get/real/tracking',
            type: 'post',
            contentType: 'application/json',
            params: JSON.stringify(submitArr)
        }).then(res => {
            layui.admin.batchResultAlert("获取华亿跟踪号完成:", res, function () {
                $('#allStatusOrderSearch').trigger('click');
            });
        })
    })
    //导入泰国陆运头程-20230802
    upload.render({
      elem: '#allStatusOrder_import_thailandFee',
      url: '/lms/shippedorder/importThLandTransportationExpenses',
      accept: 'file', //允许上传的文件类型
      field: 'file',
      before: function(){
          loading.show();
      },
      done: function (res, index, upload) { //上传后的回调
          loading.hide();
          admin.batchResultAlert("导入泰国陆运头程:", res, function () {
             res.successNum && $('#allStatusOrderSearch').click()
          }, false);
      }
  });

    // 导入物流费用
    upload.render({
        elem: '#allStatusOrder_logisRule_import_logistics',
        url: '/lms/shippedorder/importlogisticsexpenses',
        accept: 'file', //允许上传的文件类型
        field: 'file',
        before: function(){
            loading.show();
        },
        done: function (res, index, upload) { //上传后的回调
            loading.hide();
            admin.batchResultAlert("导入物流费用成功:", res, function () {
               res.successNum && $('#allStatusOrderSearch').click()
            }, false);
        }
    });

    //修改订单标签
    $('#allStatusOrder_changeplatlabel').click(function () {
        let idsArr = getTableSelectIds();
        if (idsArr.length == 0) {
            return layer.msg('请先选择数据', { icon: 7 });
        }
        let ids = idsArr.join('-');
        commonDirectMailRemarkBatch(ids,allStatusOrder_gridOptions);
        // layer.open({
        //     type: 1,
        //     title: '批量修改订单标签',
        //     btn: ['确认','取消'],
        //     area: ['80%', '80%'],
        //     content: $('#allStatusOrder_updateProdPInfoListPop').html(),
        //     success: function (layero, index) {
        //         initNotNull('#allStatusOrder_updateProdPInfoListForm')
        //         if (id.length > 0) {
        //             $(layero).find('input').val(id)
        //         }
        //         commonRenderSelect('allStatusOrder_noteContent_note', allStatusOrder_pageEnum.orderLabels, {name: 'value', code: 'code'})
        //         form.render()
        //     },
        //     yes:async function (index, layero) {
        //         let updateProdPInfo = serializeObject($('#allStatusOrder_updateProdPInfoListForm'))
        //         if (!updateProdPInfo.Ids) {
        //             return layer.msg('请选择需要修改订单标签的商品')
        //         }
        //         if (!updateProdPInfo.opType) {
        //             return layer.msg('请选择需要对订单标签进行的操作')
        //         }
        //         if (!updateProdPInfo.noteContent) {
        //             return layer.msg('请选择商品标签')
        //         }
        //         let dataObj = {
        //             ids : updateProdPInfo.Ids.split(','),
        //             noteContent : updateProdPInfo.noteContent
        //         }
        //         dataObj = JSON.stringify(dataObj)
        //         if (updateProdPInfo.opType == "新增单个") {
        //             initAjax('/unauditorder/addorderlabel.html', 'post', dataObj,
        //             function (returnData) {
        //                 layer.msg('新增订单标签: ' + returnData.msg)
        //                 // $('#allStatusOrderSearch').click()
        //                 layer.close(index)
        //             }, 'application/json;charset=UTF-8')
        //         }else {
        //             initAjax('/unauditorder/delorderlabel.html', 'post', dataObj,
        //             function (returnData) {
        //                 layer.msg('删除订单标签: ' + returnData.msg)
        //                 // $('#allStatusOrderSearch').click()
        //                 layer.close(index)
        //             }, 'application/json;charset=UTF-8')
        //         }
        //     }
        // })
    })

    // 订单重寄
    $('#allStatusOrder_resend_btn').click(function() {
        const curOrders = allStatusOrder_gridOptions.api.getSelectedRows()
        if(curOrders.length===1) {
            // 勾选非已发货和已归档状态的订单不打开重寄页面
            // 已发货和已归档状态对应processStatus的值分别是180和200，取消503
            if(curOrders[0].processStatus === 180 || curOrders[0].processStatus === 200 || curOrders[0].processStatus === 503){
                // 已重寄的订单不能再次重寄
                // if(curOrders[0].operOrderType===3){
                //     layer.msg('该订单已重寄',{icon:7})
                // }esle{
                    allStatusOrderResend(curOrders[0])
                // }
            }else{
                layer.msg('仅支持订单状态为已发货或已归档或取消的订单',{icon:7})
            }
        }else{
            return layer.msg('请勾选一笔订单',{icon:7})
        }
    })

    //重寄订单
    function allStatusOrderResend(data) {
        edit_order_tableIns = null;
        var concatData = [];
        // console.log('重寄', data);
        layer.open({
          type: 1,
          title: "重寄订单",
          btn: ["保存", "取消"],
          area: ["90%", "80%"],
          // maxmin: true,
          move: false,
          id: "pop_allStatusOrder_resend_id",
          content: $("#pop_allStatusOrder_resend").html(),
          success: function (layero, index) {
            var id = data ? data.id : "";
            // 订单金额的值是0，不能修改
            data.platOrderAmt = 0;
            $(layero)
              .find(".layui-tab")
              .find("ul")
              .find("li")
              .each(function (index, item) {
                $(item).data("orderId", id);
              });
            data.orderTimeCn = Format(data.orderTimeCn,"yyyy-MM-dd hh:mm:ss")
            appendSelect($('#allStatusOrder_resend_editForm').find('select[name="warehouseId"]'), allStatusOrder_pageEnum.prodWarehouses, 'name', 'value')
            form.val("allStatusOrder_resend_editForm", data);
            getAllSite(data.platCode, function (res) {
              const platCodeNameArr = res.data.filter(
                (item) => item.code === data.siteId
              );
              if (platCodeNameArr.length) {
                $('#allStatusOrder_resend_editForm input[name="siteName"]').val(
                  platCodeNameArr[0].name
                );
              }
            });

            concatData = data.orderDetails;
            edit_order_tableIns = allStatusOrderResendProdTableRender(concatData)
            form.render();
            // 添加商品
            $("#allStatusOrder_addProducts").click(function () {
              var orginaldata = allStatusOrderGetEditTableData(
                concatData,
                edit_order_tableIns
              );
              var prodSku = $(this).siblings("input").val();
              if (prodSku !== "") {
                allStatusOrderGetProductList(prodSku, function (returnData) {
                  allStatusOrderAddprod(returnData, function (callback) {
                    callback = callback.map(function (item) {
                      item.imageUrl = item.image;
                      return item;
                    });
                    concatData = orginaldata.concat(callback);
                    edit_order_tableIns = allStatusOrderResendProdTableRender(concatData);
                  });
                });
              } else {
                layer.msg("添加商品sku不能为空");
              }
            });
            $(layero).on("click", ".refresh_icon", function () {
              var prodskus = $(this).siblings("input").val();
              var index = $(this).parents("tr").attr("data-index");
              if (prodskus !== "") {
                getProdInfoByprodsku(prodskus, function (returnData) {
                  var data = concatData[index];
                  var newdata = returnData.data[0];
                  concatData[index] = Object.assign(data, newdata);
                  edit_order_tableIns = allStatusOrderProdTableRender(concatData);
                });
              } else {
                layer.msg("请填写sku");
              }
            });
            loading.hide();
          },
          yes: function (index, layero) {
            form.on("submit(edit_submit)", function (obj) {
              const param = {
                id: data.id,
                storeAcctId: data.storeAcctId,
                siteId: data.siteId,
                currency: data.currency,
                // 备注类型默认值为重寄订单，不可修改
                noteType: '重寄订单',
                noteContent: obj.field.noteContent,
                platOrderId: obj.field.platOrderId,
                platCode: obj.field.platCode,
                platOrderAmt: obj.field.platOrderAmt,
                shippingUsername: obj.field.shippingUsername,
                shippingPhoneNumber: obj.field.shippingPhoneNumber,
                shippingZip: obj.field.shippingZip,
                shippingStreet1: obj.field.shippingStreet1,
                shippingStreet2: obj.field.shippingStreet2,
                shippingCity: obj.field.shippingCity,
                shippingState: obj.field.shippingState,
                shippingCountryCode: obj.field.shippingCountryCode,
                shippingCountryCnName: data.shippingCountryCnName
                };
              edit_order_tableIns
                ? (param.platOrderDetails = allStatusOrderGetEditTableData(
                    concatData,
                    edit_order_tableIns
                  ).map((item) => ({
                    prodUnitWeight: item.prodUnitWeight,
                    prodTitle: item.prodTitle,
                    prodSSku: item.prodSSku,
                    isSale: item.isSale,
                    itemId: item.itemId,
                    packDesc: item.packDesc,
                    style: item.style,
                    storeSSku: item.storeSSku,
                    LAY_TABLE_INDEX: item.LAY_TABLE_INDEX,
                    prodQuantity: item.prodQuantity,
                    platQuantity: item.platQuantity,
                    platOrderDetailAmt: item.platOrderDetailAmt,
                    platOrderItemId: item.platOrderItemId,
                    platDetailTranscationId: item.platDetailTranscationId,
                    status: item.status,
                    platQuantity: item.platQuantity
                  })))
                : (param.platOrderDetails = []);
              if (param.platOrderDetails.length > 0) {
                if (
                  !param.platOrderDetails.every(
                    (item) => Number(item.prodQuantity) > 0
                  )
                )
                  return layer.msg("商品数量需要为正整数");
                resendallStatusOrders(param, function (returnData) {
                    if(returnData.data){
                        layer.open({
                            title: returnData.msg || "保存成功",
                            content: `重寄订单编号：${returnData.data}`,
                            icon:1,
                        })
                    }else{
                        layer.msg(returnData.msg || "保存成功");
                    }
                  $("#allStatusOrderSearch").click();
                  layer.close(index);
                });
              } else {
                layer.msg("请添加商品");
              }
            });
            $(layero).find("#edit_submit").click();
          },
          end: function () {},
        });
    }
    //取消订单
    $('#allStatusOrder_cancelOrder').on('click', function () {
        let idsArr = getTableSelectIds();
        if (idsArr.length == 0) {
            return layer.msg('请先选择数据', { icon: 7 });
        }
        commonOrderConfirmLayer(idsArr.length, function (index) {
            commonReturnPromise({
                url: '/lms/abnormalorder/tocancel.html',
                type: 'post',
                params: {
                    ids: idsArr.join(",")
                }
            }).then(res => {
                layer.close(index);
                layui.admin.batchResultAlert("转取消订单:",res,function(errIdsArr){
                    deleteTableRow_allStatusOrder(idsArr,errIdsArr)
                });
            });
        });
    });
    // 作废跟踪号
    $('#allStatusOrder_cancelTrack').click(function() {
        var ids = getTableSelectIds();
        if (!ids || ids.length < 1) {
            layer.msg('请选择订单', {icon: 7});
            return;
        }
        commonOrderConfirmLayer(ids.length, function (index) {
            commonReturnPromise({
                url: ctx + '/platorder/discardLogisticsNo.html',
                type: 'POST',
                params:{ orderIds: ids.join(',') }
            }).then(function(){
                layer.msg('操作成功,请稍等...',{icon:1})
                // 没有成功/失败的明细，所以现在改成全部刷新 #10719 勾选一个已作废和未作废的订单执行作废跟踪号后页面一直在加载
                // updateTableRow_allStatusOrder(ids,[])
                $("#allStatusOrderSearch").click()
            })
        });
    })
    //标记异常
    $('#allStatusOrder_markException').click(function() {
        var ids = getTableSelectIds();
        if (!ids || ids.length < 1) {
            layer.msg('请选择订单', { icon: 7 });
            return;
        }
        commonOrderConfirmLayer(ids.length, function (index) {
            initAjax('/unauditorder/markabnormal.html', 'post', { ids: ids.join(',') }, function(returnData) {
                layui.admin.batchResultAlert("订单标记异常:", returnData.data, function (errIdsArr) {
                    deleteTableRow_allStatusOrder(ids,errIdsArr)
                    // $('#toDespatchOrderSearch').click();
                    // getSuccessRemove(returnData.data, 'toDespatchOrder_table', '标记异常', 'markSymbol')
                });
            }, 'application/x-www-form-urlencoded')
        });
    });

    // 修改称重 对已发货的订单
    upload.render({
        elem: "#allStatusOrder_updateWeight", //绑定元素
        url: '/lms/shippedorder/importRealWeight', //上传接口
        accept: "file",
        // field: "multipartFile",
        before: function () {
          loading.show()
        },
        done: function (res) {
          loading.hide()
          layui.admin.batchResultServeAlert("修改称重:", res, function () {
            $('#allStatusOrderSearch').click();
        });
          //上传完毕回调
        },
        error: function (res) {
          loading.hide()
          layer.msg("上传失败", { icon: 2 })
          //请求异常回调
        },
      })

    //渲染商品信息表格
    function allStatusOrderResendProdTableRender(data) {
        tableIns = table.render({
            elem: '#allStatusOrder_resend_product_table',
            id: 'allStatusOrder_resend_product_table',
            data: data,
            cols: [
                [
                    { title: "图片", field: "imageUrl", templet: "#allStatusOrder_detail_img_tpl" },
                    { title: "Listing_ID", field: "itemId", templet: "#allStatusOrder_edit_ListingID" },
                    { title: "店铺SKU", field: "storeSSku", templet: "<div><div name='storeSSku'>{{d.storeSSku||''}}</div>" },
                    { title: "商品SKU", field: "prodSSku",templet: "#allStatusOrder_edit_Prodsku"}, //
                    { title: "库位", field: "stockLocation" },
                    { title: "商品名称", field: "prodTitle" },
                    { title: "入库要求", field: "packDesc" },
                    { title: '款式', field: "style" },
                    { title: '可用库存', field: "availableStock" },
                    { title: '商品成本（￥）', field: "prodUnitCost"},
                    { title: '累计净重（g）', field: "prodUnitWeight" },
                    { title: '报关信息', field: "style" },
                    { title: '订单状态', field: "platOrderDetailStatus" },
                    { title: '商品数量', field: "prodQuantity", templet: "#allStatusOrder_edit_prodQuantity" },
                    { title: 'platQuantity', field: "platQuantity", width:10, templet: "#allStatusOrder_edit_platQuantity" },
                    { title: '销售金额', field: "platOrderDetailAmt", templet: "#allStatusOrder_edit_platOrderDetailAmt" },
                    { title: '操作', toolbar: "#allStatusOrder_edit_option", width: 100 }
                ]
            ],
            page: false,
            limit: 300,
            done: function(res) {
                imageLazyload();
                $("[data-field='platQuantity']").css('display', 'none')
                table.on("tool(allStatusOrder_resend_product_table)", function(obj) {
                    if (obj.event = "edit_prod_delete") {
                        var index = getIndex('id', data, obj.data.id)
                        data.splice(index, 1)
                        obj.del();
                    }
                })
            }
        })
        return tableIns
    }

    //获取编辑表格数据
    function allStatusOrderGetEditTableData(data, tableIns) {
        var layFilterIndex = 'LAY-table-' + tableIns.config.index;
        var tableContainer = $('div[lay-filter="' + layFilterIndex + '"]');
        tableContainer.find('tr').each(function(index, item) {
            if (index > 0) {
                data[index - 1].itemId = $(item).find('td[data-field="itemId"] input').val()
                data[index - 1].storeSSku = $(item).find('td[data-field="storeSSku"] div[name=storeSSku]').text()
                data[index - 1].prodSSku = $(item).find('td[data-field="prodSSku"] input').val()
                data[index - 1].platUnitPrice = $(item).find('td[data-field="platUnitPrice"] input').val()
                data[index - 1].platQuantity = $(item).find('td[data-field="platQuantity"] input').val()
                data[index - 1].prodQuantity = $(item).find('td[data-field="prodQuantity"] input[type=number]').val()
                data[index - 1].platOrderItemId = $(item).find('td[data-field="prodQuantity"] input[name=platOrderItemId]').val()
                data[index - 1].platDetailTranscationId = $(item).find('td[data-field="prodQuantity"] input[name=platDetailTranscationId]').val()
                data[index - 1].platOrderDetailAmt = $(item).find('td[data-field="platOrderDetailAmt"] input').val()
                data[index - 1].status = true
            }
        });
        console.log('allstatusData', data);
        return data;
    }

    // 添加商品
    function allStatusOrderAddprod(data, func) {
        layer.open({
            type: 1,
            title: '添加商品',
            btn: ['添加商品', '关闭'],
            area: ['70%', '60%'],
            content: $('#pop_allStatusOrder_addProducts').html(),
            success: function(layero, index) {
                table.render({
                    elem: '#allStatusOrder_addProducts_table',
                    data: data.data,
                    cols: [
                        [
                            { checkbox: true, width: 30 },
                            { title: "图片", field: "imageUrl", templet: "#add_product_img" },
                            { title: "商品sku", field: "sSku" },
                            { title: "父sku", field: "", templet: "#add_product_psku" },
                            { title: "商品名称", field: "title" },
                            { title: "款式", field: "style" }
                        ]
                    ],
                    page: true,
                    id: 'allStatusOrder_addProducts_table',
                    done: function(res,count,ss) {
                        imageLazyload();
                        $('#pop_allStatusOrder_addProducts_num').text(res.count)
                    }
                })
            },
            yes: function(index, layero) {
                var checkStatus = table.checkStatus('allStatusOrder_addProducts_table')
                var callbackdata = checkStatus.data
                var prodskus =""
                prodskusArr = callbackdata.map(function(item) {
                    return item.sSku
                })
                if(prodskusArr.length>0){
                    prodskus = prodskusArr.join(',')
                }
                getProdInfoByprodsku(prodskus,function(returnData){
                    var data = returnData.data.map(function(item){
                        item.storeSSku = item.prodSSku
                        return item
                    })
                    if(func){
                        func(data)
                    }
                    layer.close(index)
                })
            },
        })
    }

     // 获取商品列表
     function allStatusOrderGetProductList(sSku, func) {
        initAjax('/product/getProds.html', 'post', { searchType: 'sSku', searchValue: sSku, page: 1, limit: 300, isCombination: false, isSale: true }, function(returnData) {
            if (func) {
                func(returnData)
            }
        }, 'application/x-www-form-urlencoded')
    }

    //保存修改新增待审核订单
    function resendallStatusOrders(data, func) {
        initAjax('/unauditorder/resendorder.html', 'post', JSON.stringify(data), function(returnData) {
            if (func) {
                func(returnData)
            }
        })
    }

    // 根据商品sku获取商品信息
    function getProdInfoByprodsku(prodSSkus, func) {
        initAjax('/unauditorder/listprodinfo.html?prodSSkus=' + prodSSkus, 'get', {}, function(returnData) {
            if (func) {
                func(returnData)
            }
        })
    }

    // $("button[name=orderConfig]").click(function(){
    //     let orderColumnState = allStatusOrder_gridOptions.columnApi.getColumnState()
    //     window.localStorage.setItem("orderColumnState",JSON.stringify(orderColumnState))
    //     layer.msg("保存设置成功")
    // })
    function setModel(type) {
        const instance = allStatusOrder_gridOptions.api.getFilterInstance("shippingCountryCnName");

        instance.setModel({ values: MANGLED_COLOURS });
        allStatusOrder_gridOptions.api.onFilterChanged();
    }

    let allStatusOrder_immutableStore = [];
    const allStatusOrder_gridOptions = {
        columnDefs: [{
            // headerName: 'Athlete',
            // field: 'athlete',
            width: 40,
            headerCheckboxSelection: true,
            headerCheckboxSelectionFilteredOnly: true,
            checkboxSelection: true,
        },
            {
                headerName: '订单号',
                wrapText: true,
                autoHeight: true,
                cellRenderer: (data) => {
                    let d = data.data
                    let tagsDom = '';
                    if (d.platTagList && d.platTagList.length>0) {
                        tagsDom = `
                                ${d.platTagList.map(item => {
                                    return `<span class="hp-badge" style="background:${item.color};width:auto; color:#fff;margin: 0 5px;padding:0 5px!important;">${item.tagName}</span>`
                                }).join('')}`;
                    }
                    // 重寄订单
                    let orderLabel = d.operOrderType == 3 ? '<span style="color:red">重寄</span>':''
                    // operOrderType 拆单合单：订单操作类型：0原始订单，1拆除订单，2合并订单
                    const operOrderTypeTag = d.operOrderType ==1 ? '<span class="hp-badge layui-bg-orange" title="拆出订单">拆</span>' : d.operOrderType ==2 ? '<span class="hp-badge layui-bg-orange" title="合并订单">合</span>' : d.operOrderType ==0 && d.operOriginId!="0" ? '<span class="hp-badge layui-bg-orange" title="拆单订单">拆</span>' : ''
                    // 店铺客服
                    const customServicerHtml = d.customServicer ? `[${d.customServicer}]` : ''
                    // 点击订单跳转到订单详情
                    let platOrderIdHtml = `<a id="toAudit_table_platOrderId">${d.platOrderId}</a>`
                    if(CommonPlatFormOrderDetailEnum.includes(d.platCode)){
                        platOrderIdHtml = `<a id="toAudit_table_platOrderId" style="color:#1E90FF" name="jumpToPlatformOrder">${d.platOrderId}</a>`
                    }
                    //订单标签
                    let orderTagDom = d.orderTagList && d.orderTagList.length>0 ? `${d.orderTagList.map(item => {
                      return `<span class="hp-badge" style="background:${item.color};width:auto; color:#fff;margin: 0 5px;padding:0 5px!important;">${item.tagName}</span>`
                    }).join('')}`: '';
                    return `<div class="alignLeft">
                        <span>${d.id || ""}</span>
                        <span onclick="layui.admin.onlyCopyTxt('${d.id}',event)" style="display: ${d.id ? 'inline-block':'none'}" class="copy-icon">
                            <svg t="1710754196184" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2392" width="16" height="16"><path d="M768 832q-0.992 54.016-37.504 90.496T640 960H192q-54.016-0.992-90.496-37.504T64 832V384q0.992-54.016 37.504-90.496T192 256v64q-27.008 0.992-44.992 19.008T128 384v448q0.992 27.008 19.008 44.992T192 896h448q27.008-0.992 44.992-19.008T704 832h64zM384 128q-27.008 0.992-44.992 19.008T320 192v448q0.992 27.008 19.008 44.992T384 704h448q27.008-0.992 44.992-19.008T896 640V192q-0.992-27.008-19.008-44.992T832 128H384z m0-64h448q54.016 0.992 90.496 37.504T960 192v448q-0.992 54.016-37.504 90.496T832 768H384q-54.016-0.992-90.496-37.504T256 640V192q0.992-54.016 37.504-90.496T384 64z" p-id="2393" fill="#aaaaaa"></path></svg>
                        </span>
                        <span>[${d.platCode}]</span>
                        ${orderTagDom}
                        ${orderLabel}
                        ${tagsDom}
                        ${operOrderTypeTag}	
                        <p id="toAudit_table_storeAcct">${d.storeAcct || ""}[${d.shopId || ""}]</p>
                        <p>[${d.salesPersons || ""}][${d.sellLeaderName || ""}]${customServicerHtml}</p>
                        ${platOrderIdHtml}
                        <span onclick="layui.admin.onlyCopyTxt('${d.platOrderId}',event)" style="display: ${d.platOrderId ? 'inline-block':'none'}" class="copy-icon">
                            <svg t="1710754196184" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2392" width="16" height="16"><path d="M768 832q-0.992 54.016-37.504 90.496T640 960H192q-54.016-0.992-90.496-37.504T64 832V384q0.992-54.016 37.504-90.496T192 256v64q-27.008 0.992-44.992 19.008T128 384v448q0.992 27.008 19.008 44.992T192 896h448q27.008-0.992 44.992-19.008T704 832h64zM384 128q-27.008 0.992-44.992 19.008T320 192v448q0.992 27.008 19.008 44.992T384 704h448q27.008-0.992 44.992-19.008T896 640V192q-0.992-27.008-19.008-44.992T832 128H384z m0-64h448q54.016 0.992 90.496 37.504T960 192v448q-0.992 54.016-37.504 90.496T832 768H384q-54.016-0.992-90.496-37.504T256 640V192q0.992-54.016 37.504-90.496T384 64z" p-id="2393" fill="#aaaaaa"></path></svg>
                        </span>
                        <p>${d.platOrderStatus || ""}</p>
                    </div>`
                }
            },
            {
                wrapText: true,
                autoHeight: true,
                headerName: '订单金额',
                cellRenderer: (data) => {
                    let d = data.data, str = '';
                    //删除掉会影响渲染的属性[不能直接删原始对象]
                    // delete(d.orderDetails);
                    let newD = {
                      profit: d.profit || '0.00',
                      platFee: d.platFee || 0,
                      otherFee: d.otherFee || 0,
                      platShippingAmt: d.platShippingAmt,
                      currency: d.currency || "",
                      platOrderAmt: d.platOrderAmt,
                      prodCost: d.prodCost,
                      outerPackCost: d.outerPackCost,
                      costPrice: d.costPrice,
                      shippingCost: d.shippingCost,
                      exchangeRate: d.exchangeRate
                    };
                    let jsonData = JSON.stringify(newD).replace("'", "");
                    jsonData = jsonData.replace(/</g, '&lt;')
                    jsonData = jsonData.replace(/>/g, '&gt;')
                    //利润计算逻辑
                    let profitCalculation = `<span data-text='${jsonData}' onmouseenter="allStatusOrderProfitTipsShow(this)" onmouseleave="allStatusOrderProfitTipsHide(this)">${d.profit || '0.00'}</span>`;
                    let fee = [d.platFee || 0, d.otherFee || 0].filter(i => i != 0);
                    let amtDom = d.platShippingAmt ? `<span>(${d.platShippingAmt})</span>` : "";
                    str +=
                        `<div class="alignLeft">
                        <div><span class='gray'>${d.currency || ""}</span><span id="toAudit_table_platOrderAmt">${d.platOrderAmt === undefined ? '' : d.platOrderAmt }</span>${amtDom}</div>
                        <div><span class="gray">平台费</span>${fee.length === 0 ? 0 :fee.join(' + ')}</div>
                        <div><span class="gray">商品成本(￥)</span>${d.prodCost} / ${d.costPrice}</div>
                        <div><span class="gray">物流成本(￥)</span>${d.shippingCost!==undefined ? d.shippingCost : "" }<button class="layui-btn layui-btn-xs" name="logisCost" style="cursor:pointer;">详</button></div>
                        <div><span class="gray">利润(￥)</span>${profitCalculation} <span class="gray">${d.platOrderAmt == 0 || d.exchangeRate == 0?'利润率无效':(100 * d.profit / d.platOrderAmt / d.exchangeRate).toFixed(2)+'%'}</span></div>
                    </div>`
                    return str
                }
            },
            {
                headerName: '商品',
                width:130,
                wrapText: true,
                autoHeight: true,
                cellRenderer: (data) => {
                    let d = data.data
                    return `<div class="alignLeft">
                        <div><span class="gray">种类和数量：</span><span id="toAudit_table_skuQuantity">${d.skuQuantity || ""}</span>/<span id="toAudit_table_prodQuantity">${d.prodQuantity || ""}</span></div>
                        <div><span class="gray">重量(g)：</span><span>预${d.preWeight}</span>|<span>称${d.realWeight}</span>|<span>计${d.priceWeight}</span></div>
                        <div><span class="gray skuEllipsis">SKU：<span style="color: black" onmouseout="removeTip(this)" onmouseover="showTip('${d.skuOverview}',this)" >${d.skuOverview?.split(';')?.slice(0, 3)?.join(';') || ''}</span></span></div>
                    </div>`
                }
            },
            {
                headerName: '收件人',
                field:"shippingCountryCnName",
                wrapText: true,
                autoHeight: true,
                cellRenderer: (data) => {
                    let d = data.data
                    const _buyerNote = d.buyerNote || ""
                    const _buyerNoteCopyHtml =`<a class="hidden">${_buyerNote}</a>
                    <button
                        class="layui-btn layui-btn-primary layui-btn-xs copyTxt"
                        onclick="layui.admin.copyTxt(this)"
                    >
                        复制
                    </button>`
                    // 联系买家
                    let connectBtn = ''
                    if(d.platCode==='shopee'){
                        connectBtn = `<a class="ml10" name="allOrder_connectBuyer" style="color:#1E90FF;cursor:pointer;">联系买家</a>`
                    }
                    if(d.platCode==='tiktok'){
                        connectBtn = `<a class="ml10" name="allOrder_connectTikTokBuyer" style="color:#1E90FF;cursor:pointer;">联系买家</a>`
                    }
                    if(d.platCode==='lazada'){
                        connectBtn = `<a class="ml10" name="allOrder_connectLazadaBuyer" style="color:#1E90FF;cursor:pointer;">联系买家</a>`
                    }
                    return `<div class="alignLeft">
                        <div id="">${d.shippingUsername||""}</div>
                        <div>
                        [${d.shippingCountryCnName||""}]
                        ${connectBtn}
                        </div>
                        <div><span class="gray">买家ID：</span>${d.buyerUserId||""}</div>
                        <div data-text="${_buyerNote}" onmouseenter="allBuyerTipsShow(this)" onmouseleave="allBuyerTipsHide(this)">
                            <span class="pora copySpan">
                                <span class="gray">留言：</span>${_buyerNote.slice(0, 46)}
                                ${_buyerNote?_buyerNoteCopyHtml:''}
                            </span>
                        </div>
                    </div>`
                }
            },
            {
                headerName: '物流',
                wrapText: true,
                autoHeight: true,
                cellRenderer: (data) => {
                    let d = data.data
                    let closeTimeHmtl = `<div><span class="gray">关单：</span>${Format(d.closeTime || "", 'yyyy-MM-dd hh:mm:ss')}<span class="${d.closeTimeDay < 4 ? 'plus-red-text':''}">(≤${d.closeTimeDay || '0'})</span></div>`
                    return `<div class="alignLeft">
                        <div><span class="gray">买家：</span><span id="toAudit_table_buyerRequireShippingType">${d.buyerRequireShippingType||""}</span></div>
                        <div><span class="gray">发货：</span><span id="logisTypeName_toAuditOrder">${d.logisTypeName||""}</span></div>
                        <div><span class="gray">跟踪号：</span>
                            <span>${d.logisTrackingNo||""}</span>
                            <span onclick="layui.admin.onlyCopyTxt('${d.logisTrackingNo}',event)" style="display: ${d.logisTrackingNo ? 'inline-block':'none'}" class="copy-icon">
                                <svg t="1710754196184" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2392" width="16" height="16"><path d="M768 832q-0.992 54.016-37.504 90.496T640 960H192q-54.016-0.992-90.496-37.504T64 832V384q0.992-54.016 37.504-90.496T192 256v64q-27.008 0.992-44.992 19.008T128 384v448q0.992 27.008 19.008 44.992T192 896h448q27.008-0.992 44.992-19.008T704 832h64zM384 128q-27.008 0.992-44.992 19.008T320 192v448q0.992 27.008 19.008 44.992T384 704h448q27.008-0.992 44.992-19.008T896 640V192q-0.992-27.008-19.008-44.992T832 128H384z m0-64h448q54.016 0.992 90.496 37.504T960 192v448q-0.992 54.016-37.504 90.496T832 768H384q-54.016-0.992-90.496-37.504T256 640V192q0.992-54.016 37.504-90.496T384 64z" p-id="2393" fill="#aaaaaa"></path></svg>
                            </span>
                            <image onclick="okk(${d.id})" src="${ctx}/static/img/print.png" width="20" lay-tips="打印预览"></image>
                        </div>
                        <div><span class="gray">状态：</span>${d.logisticsStatus||""}</div>
                        ${d.closeTime ? closeTimeHmtl : ''}
                    </div>`
                }
            },
            {
                headerName: '平台时间',
                wrapText: true,
                autoHeight: true,
                cellRenderer: (data) => {
                    let d = data.data
                    return `<div class="alignLeft">
                        <div><span class="gray">订单：</span><span id="toAudit_table_orderTimeCn">${Format(d.orderTimeCn || "", 'yyyy-MM-dd hh:mm:ss')}</span><span class="${d.orderDay>4?'plus-red-text':''}">(${d.orderDay || '0'})</span></div>
                        <div><span class="gray">申请：</span><span>${Format(d.logisApplyTime ||"",'yyyy-MM-dd hh:mm:ss')}</span></div>
                        <div><span class="gray">标记：</span><span>${Format(d.markShippingTime||"",'yyyy-MM-dd hh:mm:ss')}</span></div>
                        <div><span class="gray">发货：</span><span>${Format(d.shippingTime||"",'yyyy-MM-dd hh:mm:ss')}</span></div>
                        <div><span class="gray">截止：</span><span>${Format(d.shipByDate||"",'yyyy-MM-dd hh:mm:ss')}</span></div>
                    </div>`
                }
            },
            {
                headerName: '订单处理',
                wrapText: true,
                autoHeight: true,
                cellRenderer: (data) => {
                    let d = data.data
                    // 备注
                    let recentNoteContent = "";
                    if (
                      d.platOrderNotes &&
                      Array.isArray(d.platOrderNotes) &&
                      d.platOrderNotes.length
                    ) {
                      let noteContentLength = d.platOrderNotes.length;
                      recentNoteContent =
                        `<span data-text='${JSON.stringify(d.platOrderNotes)}' onmouseenter="allBuyerTipsShowTable(this)" onmouseleave="allBuyerTipsHide(this)">${d.platOrderNotes[noteContentLength - 1].noteType || ""}:${d.platOrderNotes[noteContentLength - 1].noteContent || ""}</span>`;
                    }

                    const status = {
                        "501":"黑名单订单",
                        "502":"缺货订单",
                        "503": "取消订单",
                        "504": "未付款订单",
                        "500":"其他异常订单",
                        "110":"待审核",
                        "115":"待派单",
                        "120":"待配货",
                        "125":"待核单",
                        "130":"待包装",
                        "135":"仓库缺货",
                        "140":"待发货",
                        "180":"已发货",
                        "200":"已归档",
                        "136":"仓库拦截",
                    }
                    const noteTipsHtml = `<span class="hp-badge fr allStatusOrder-noteContent-tag">多</span>`
                    let html = `<div class="alignLeft">
                      <div><span class="gray">状态：</span>${status[d.processStatus]||""}</div>
                        <div><span class="gray">仓库：</span>${d.warehouseName||""}</div>
                        <div><span class="gray">批次：</span>${d.batchNo||""}</div>
                        <div><span class="gray">组包：</span>${d.handoverBatchNo||""}</div>
                        <div><span class="gray">备注：</span>${recentNoteContent}${(d.platOrderNotes && d.platOrderNotes.length>1) ? noteTipsHtml : ''}</div>
                    </div>`

                    return html
                }
            },
            {
                headerName: '仓库处理',
                width:210,
                wrapText: true,
                autoHeight: true,
                cellRenderer: (data) => {
                    let d = data.data
                    return `<div class="alignLeft">
                        <div><span class="gray">批次：</span>${d.batchInfo||""}</div>
                        <div><span class="gray">配货：</span>${d.pickInfo||""}</div>
                        <div><span class="gray">投篮：</span>${d.checkInfo||""}</div>
                        <div><span class="gray">包装：</span>${d.packingInfo||""}</div>
                        <div><span class="gray">分拣：</span>${d.scanerInfo||""}</div>
                    </div>`
                }
            },
            {
                field: '操作',
                width:80,
                wrapText: true,
                autoHeight: true,
                cellRenderer: (data) => {
                    let d = data.data
                    // 备注
                    let btnStr = '';
                    let showDom = $('#allStatusOrder_inputexceptPermTagTable').html();
                    if (d.platCode == 'ebay') {
                        btnStr = `<br><permTag:perm funcCode="allStatusOrder_ebayRefundBtn"><button name="allOrder_refund" class="layui-btn layui-btn-xs">ebay退款</button><br></permTag:perm>`;
                    }
                    let shopeeBtn = '';
                    if(d.platCode == 'shopee'){
                      shopeeBtn = $('#allStatusOrder_orderApiPermTagTable').html();
                    }
                    let aeBtn = '';
                    if(d.platCode == 'AE全托管' || d.platCode == 'AE半托管'){
                      aeBtn = $('#allStatusOrder_aeSkuTagDom').html();
                    }
                    return `<button name="allOrder_remark" class="layui-btn layui-btn-xs layui-btn-normal">备注</button>${btnStr}${showDom}${shopeeBtn}${aeBtn}`;
                }
            }
        ],
        rowData:allStatusOrder_immutableStore,
        getRowNodeId: function (data) {
            return data.id;
        },
        // rowModelType: 'serverSide', // 服务端
        defaultColDef: {
            resizable: true, //是否可以调整列大小，就是拖动改变列大小
        },
        suppressPaginationPanel: true, // 自定义分页
        // pagination: true, // 开启分页（前端分页）
        // paginationPageSize: 1000, // 每页加载多少行
        // paginationAutoPageSize: true, // 根据网页高度自动分页（前端分页）
        rowSelection: 'multiple', // 设置多行选中
        suppressRowClickSelection: true,
        onGridReady: function (params) {
            allStatusOrder_gridOptions.columnApi.applyColumnState({ state: JSON.parse(window.localStorage.getItem("allStatusOrderColumnState")) });
            //表格创建完成后执行的事件
            params.api.sizeColumnsToFit(); //调整表格大小自适应
        },
        sideBar: {
            toolPanels: [{
                id: 'columns',
                labelDefault: 'Columns',
                labelKey: 'columns',
                iconKey: 'columns',
                toolPanel: 'agColumnsToolPanel'
            }],
        },
        onRowClicked: function (event) {
            // console.log(event)
        },
        //单击单元格触发的事件
        onCellClicked: function (event) {
            // console.log()
            //event.data 选中的行内数据，event.event 为鼠标事件
            handleTableOptions(event)
        },
        onCellMouseDown: function (event){
            timeStamp = event.event.timeStamp
        }
        // onRowDoubleClicked: function (event) {
        // console.log(event.data)
        //event.data 选中的行内数据，event.event 为鼠标事件
        //     let data = event.data;// 获取选中行数据
        //     commonOrderDetailFn(data)
        // },
    };

    var timeStamp;

    var gridDiv = document.querySelector('#allStatusOrder_table');
    agGrid.LicenseManager.setLicenseKey(
        "IRDEVELOPERS_COM_NDEwMjM0NTgwMDAwMA==f08aae16269f416fe8d65bbf9396be5f");
    new agGrid.Grid(gridDiv, allStatusOrder_gridOptions);


    //渲染表格数据
    function allStatusOrderTableorder(data) {
        commonReturnPromiseRes({
            url: ctx + '/platorder/listorder.html',
            type: 'POST',
            params:data
        }).then(function(result){
            let profit = 0, platOrderAmt = 0;
            // 商品种类||数量
            if(result.count != 0) {
                let skuQuantity = 0, prodQuantity = 0;
                result.data.forEach(item => {
                    skuQuantity = skuQuantity + item.skuQuantity * 1;
                    prodQuantity = prodQuantity + item.prodQuantity * 1;
                    profit = profit + item.profit * 1; // 利润
                    platOrderAmt = (platOrderAmt || 0) + (item.exchangeRate * item.platOrderAmt || 0); // 金额
                })
                let profitRate = ((profit/platOrderAmt)*100).toFixed(1)
                $("#allStatusOrder_table").find("[col-id=3] .ag-header-cell-text").attr('lay-tips',`种类${skuQuantity} || 数量${prodQuantity}`)
                $("#allStatusOrder_table").find("[col-id=2] .ag-header-cell-text").attr('lay-tips',`金额(￥)${platOrderAmt.toFixed(0)} || 利润(￥)${profit.toFixed(0)} || 利润率${platOrderAmt?profitRate+'%':'利润率无效'}`)
                $("#allStatusOrder_table").find("[col-id=2] .ag-header-cell-text").text(`金额 ${platOrderAmt.toFixed(0)} || ${profit.toFixed(0)} || ${platOrderAmt?profitRate+'%':'利润率无效'}`)
                $("#allStatusOrder_table").find("[col-id=3] .ag-header-cell-text").text(`商品 种类${skuQuantity} || 数量${prodQuantity}`)
            }else{
                $("#allStatusOrder_table").find("[col-id=2] .ag-header-cell-text").text(`订单金额 金额(￥)0 || 利润(￥)0`)
                $("#allStatusOrder_table").find("[col-id=3] .ag-header-cell-text").text(`商品 种类0 || 数量0`)
            }

            allStatusOrder_immutableStore = result.data
            allStatusOrder_gridOptions.api.setRowData(allStatusOrder_immutableStore)

            // 渲染tab中的count数，复制原来的--start
            allstatusOrderPage(data, result.count)
            $('#LAY-allStatusOrder #allStatusOrder_Tab').find('li').find('span').text(result.count)
            // 复制原来的--end
        }).catch(function(err){
            layer.msg(err, {icon:2});
        })
        // table.render({
        //     elem: '#allStatusOrder_table',
        //     method: 'POST',
        //     url: ctx + '/platorder/listorder.html',
        //     where: data,
        //     cols: [
        //         [
        //             { checkbox: true, width: 30 },
        //             { title: "订单号", field: "id", templet: "#allStatusOrder_id_tpl" },
        //             { title: "订单金额", field: "platOrderAmt", templet: "#allStatusOrder_platOrderAmt_tpl" },
        //             { title: "商品", field: "prodQuantity", templet: "#allStatusOrder_prodQuantity_tpl" },
        //             { title: "收件人", field: "shippingUsername", templet: "#allStatusOrder_shippingUsername_tpl" },
        //             { title: "物流", field: "logisTypeName", templet: '#allStatusOrder_logisTypeName_tpl' },
        //             { title: "时间", field: "time", templet: "#allStatusOrder_time_tpl" },
        //             { title: 'OA订单状态', field: "processStatus", templet: "#allStatusOrder_processStatus_tpl" },
        //             { title: "状态", field: "platOrderStatus", templet: "#allStatusOrder_platOrderStatus_tpl" },
        //             { title: '操作', toolbar: "#allStatusOrder_handleBtn", width: 100 }
        //         ]
        //     ],
        //     page: false,
        //     limit: 500,
        //     id: 'allStatusOrder_table',
        //     done: function (res) {
        //         allstatusOrderPage(data, res.count)
        //         $('#LAY-allStatusOrder #allStatusOrder_Tab').find('li').find('span').text(res.count)
        //         // setRowEvent('#allStatusOrder_table', '.allStatusOrder_col_id', 'click', function(dom) {
        //         //         var index = $(dom).attr('data-index')
        //         //         allStatusOrderNewandEdit('2',res.data[index])
        //         // }, ['.copyTxt', '.doubleClickToSet', '.laytable-cell-checkbox', '.freeClickBox', '[data-edit]'])
        //         allStatusOrderTableWatchbar()
        //         allStatusOrder_watchTableTr()
        //     }
        // })
    }

    function handleTableOptions(event) {
        let optionEvent = event.event.target.name,
            data = event.data;// 获取选中行数据

        if (optionEvent == 'allOrder_remark') {
            commonDirectMailRemark(data,allStatusOrder_gridOptions);
        } else if (optionEvent == 'allOrder_inputexcept') {
            allOrder_inputexceptHandle(data)
        }else if(optionEvent == 'copy'){
        }else if(optionEvent === 'allOrder_connectBuyer'){
            // 联系买家
            commonOrderConnectChatBuyer(data)
        }else if(optionEvent === 'allOrder_connectTikTokBuyer'){
            // tiktok联系买家
            commonOrderConnectChatBuyer(data)
        }else if(optionEvent === 'allOrder_connectLazadaBuyer'){
            // lazada联系买家
            commonOrderConnectChatBuyer(data)
        }else if(optionEvent === 'jumpToPlatformOrder'){
            // 跳转到平台后台订单详情
            commonJumpPlatformOrderDetail(data)
        } else if (optionEvent == 'allOrder_refund') {
            orderIssueRefund(data, function(){
            });
        }else if(optionEvent === 'logisCost'){
          //物流成本
          commonLogisCostLayerHandle(data.id);
        }else if(optionEvent == 'allOrder_orderApi'){
          //调用接口,弹框展示信息并允许复制
          commonReturnPromise({
            url: `/lms/platorder/getSingleOrderAPIDetail.html?orderId=${data.id}`
          }).then(res => {
            if(res.length > 0){
              let $info = $(`<div style="padding:20px;">
                <span class="pora copySpan">
                    <a style="word-wrap: break-word;">${res}</a>
                    <button class="layui-btn layui-btn-primary layui-btn-xs copyTxt" onclick="layui.admin.copyTxt(this,event)">复制</button>
                </span>
              </div>`);
              layer.open({
                type: 1,
                title: '订单API',
                area: ['80%', '60%'],
                content:$info[0].outerHTML,
                id: Date.now(),
                btn: ['关闭']
              });
            }else{
              layer.msg('接口为返回订单API相关信息',{icon:7});
            }
          });
        }else if(optionEvent == 'allStatusOrder_aeSkuTagBtn'){
          let orderIdStr = data.id;
          commonReturnPromise({
            url: '/lms/order/package/print/one.html',
            params: {
              orderIdStr: orderIdStr,
              onlyGoodsLable: true,
              platCode: 'AE全托管'
            }
          }).then(res => {
            let data = res[0] || '';
            let obj = {};
            obj.printType = 19;
            obj.labelUrl = data.ftpLabelUrl;
            obj.width = data.width;
            obj.height = data.height;
            obj.printName = obj.width.toString() + obj.height.toString();
            logistics_label_pdf_print(obj);
          });
        }else if(event.event.timeStamp - timeStamp < 300) {
            data.showLogisAttrList = true;
            data.showSale = true;
            commonOrderDetailFn(data, allStatusOrder_gridOptions, 'allStatusOrder');
        }
    }
    //录入异常操作
    function allOrder_inputexceptHandle (data) {
        layer.open({
            type: 1,
            title: '录入异常',
            content: $('#allStatusOrder_inputexceptLayer').html(),
            btn: ['提交', '关闭'],
            area: ["60%", "65%"],
            success: function (layero) {
                commonReturnPromise({
                    url: '/lms/deliveryIssue/init'
                }).then(res => {
                    let { issueTypes, currencyEnums } = res;
                    commonRenderSelect('layer_issue_select', issueTypes, {
                        code: 'name',
                        name: 'name',
                        str: ''
                    }).then(() => {
                        form.render('select');
                    });
                    
                    commonRenderSelect('allStatusOrder_issueCurrency', currencyEnums, {str: ''}).then(() => {
                        form.render('select');
                    });
                    laydate.render({
                        elem: '#delivery_time_str'
                        ,type: 'datetime'
                    });
                    // $('#issue_mofidy_form select[name=issueType]').val(data.issueType);
                    $('#issue_mofidy_form input[name=allrootNid]').val(data.id);
                    $('#issue_mofidy_form input[name=dataSource]').val(data.dataSource);
                    $('#issue_mofidy_form input[name=platCode]').val(data.platCode);
                    $('#issue_mofidy_form input[name=storeAcct]').val(data.storeAcct);
                    $('#issue_mofidy_form input[name=orderId]').val(data.platOrderId);
                    // $('#issue_mofidy_form input[name=issueSku]').val(data.issueSku);
                    $('#issue_mofidy_form input[name=issueNum]').val(data.issueNum);
                    $('#issue_mofidy_form input[name=issueWeight]').val(data.issueWeight);
                    $('#issue_mofidy_form input[name=deliverySku]').val(data.deliverySku);
                    // $('#issue_mofidy_form select[name=issueCurrency]').val(data.issueCurrency);
                    $('#issue_mofidy_form input[name=issueAmount]').val(data.issueAmount);
                    $('#issue_mofidy_form input[name=packager]').val(data.packingInfo ? data.packingInfo.split(' ')[2]: '');
                    $('#issue_mofidy_form input[name=deliveryTime]').val(Format(data.shippingTime, 'yyyy-MM-dd hh:mm:ss'));
                    $('#issue_mofidy_form textarea[name=issueRemark]').val(data.issueRemark);
                    // $('#issue_mofidy_form input[name=pickUserName]').val(data.pickUser);
                    // $('#issue_mofidy_form input[name=checkUserName]').val(data.checkUserName);
                    // $('#issue_mofidy_form input[name=packager]').val(data.packUser);
                });
                let _data = JSON.parse(JSON.stringify(data))
                let newArr = delSameObjValue(_data.orderDetails, 'allCount', ['prodSSku'], ['prodQuantity']);
                _data.orderDetails.forEach((item,index) => {
                    newArr.forEach(cItem => {
                        if (item.prodSSku == cItem.prodSSku) {
                            item.allCount = cItem.allCount
                        }
                    })
                })
                // _data['prodSSkuOrderBy'] = _data['availableStockOrderBy'] = _data['allCountOrderBy'] = '';
                table.render({
                    elem: '#allStatusOrder_inputexcept_table',
                    id: 'allStatusOrder_inputexcept_tableId',
                    data: _data.orderDetails || [],
                    cols: [
                        [
                            { title: '勾选<span class="fRed">*</span>', field:"radio",templet:'#allStatusOrder_inputexcept_table_radio'},
                            { title: "Listing_ID", field: "itemId" },
                            { title: "店铺SKU", field: "storeSSku" },
                            { title: "商品SKU", field: "prodSSku", templet:'#allStatusOrder_inputexcept_table_prodSSku' }, //
                            { title: "商品名称", field: "prodTitle" },
                            { title: '商品总量', field: "allCount" },
                        ]
                    ],
                    page: false,
                    limit: 30000,
                    done: function (res) {
                        form.render()
                    }
                })
                //#region 图片预览处理
                //预览按钮点击
                layero.find('.previewBtn').on('click', function(){
                  let imgsArr = layero.find('[name=issueImgs]').val().split('\n');
                  //循环渲染图片
                  let $ul = layero.find('ul.commonPreviewImg');
                  let liStrs = '';
                  for(let i=0; i< imgsArr.length; i++){
                    let item = imgsArr[i];
                    let liStr = `<li><img width="120" height="120" data-original="${item}" class="img_show_hide b1 lazy" data-onerror="layui.admin.img_noFind()"/></li>`;
                    liStrs += liStr;
                  }
                  $ul.html(liStrs);
                  imageLazyload();
                });
                //上传绑定
                upload.render({
                  elem: '#issue_mofidy_dragImg'
                  ,accept: 'images' //允许上传的文件类型
                  ,url: ctx + '/deliveryIssue/order/image/upload' //上传接口
                  ,before: function () {
                    loading.show()
                  }
                  ,done: function(res){
                    loading.hide();
                    layer.msg('上传成功', {icon: 1});
                    //回显+链接显示在textarea中
                    let imgsArr = layero.find('[name=issueImgs]').val().trim()== ''? []: layero.find('[name=issueImgs]').val().trim().split('\n');
                    imgsArr.push(res.data);
                    layero.find('[name=issueImgs]').val(imgsArr.join('\n'));
                    let $li =$(`<li><img width="120" height="120" data-original="${res.data}" class="img_show_hide b1 lazy" data-onerror="layui.admin.img_noFind()"/></li>`);
                    layero.find('ul.commonPreviewImg').append($li);
                    imageLazyload();
                  }
                });
                //#endregion
            },
            yes: function (index, layero) {
                let params = serializeObject($('#issue_mofidy_form'));
                if(null == params['allrootNid']){
                    layer.msg("请输入订单号");
                    return;
                }
                // if(null == params['issueSku'] || params['issueSku']==''){
                //     layer.msg("请输入异常sku");
                //     return;
                // }

                if(null == params['platCode'] || params['platCode']==''){
                    layer.msg("请输入平台");
                    return;
                }
                if(null == params['storeAcct'] || params['storeAcct']==''){
                    layer.msg("请输入店铺");
                    return;
                }
                if(null == params['orderId'] || params['orderId']==''){
                    layer.msg("请输入店铺单号");
                    return;
                }
                if(null == params['issueNum'] || params['issueNum']==''){
                    layer.msg("请输入异常数量");
                    return;
                }
                // 获取异常sku
                if(!params.radio) return layer.msg('请勾选要录入异常sku的行')
                if(params[`prodSSku_${params.radio}`]===''|| params[`prodSSku_${params.radio}`]=== null){
                    return layer.msg('请填写勾选中行的异常sku')
                }else{
                    params.issueSku = params[`prodSSku_${params.radio}`]
                    params.pickUserName = params[`pickUserName_prodSSku_${params.radio}`]
                    params.checkUserName = params[`checkUserName_prodSSku_${params.radio}`]
                    // params.packager = params[`packager_prodSSku_${params.radio}`]
                    // $('#issue_mofidy_form input[name=pickUserName]').val(data.pickUser);
                    // $('#issue_mofidy_form input[name=checkUserName]').val(data.checkUserName);
                    // $('#issue_mofidy_form input[name=packager]').val(data.packUser);
                }
                // 异常数量不能大于勾选SKU对应的商品数量
                const checkedTr = table.cache.allStatusOrder_inputexcept_tableId.filter(item => item.id == params.radio)
                if( checkedTr[0] && (Number(params.issueNum)>Number(checkedTr[0].allCount)) ) return layer.msg('异常数量不能大于勾选SKU对应的商品数量')
                let keyList = Object.keys(params)
                keyList.forEach(item=>{
                    if(item==='radio'){
                        delete params.radio
                    }else if(item.includes('prodSSku_')){
                        delete params[item]
                    }
                    if(item == 'issueImgs'){
                      params[item] = params[item].split('\n').join(',')
                    }
                })
                commonReturnPromise({
                    url: '/lms/deliveryIssue/addIssue.html',
                    type: 'post',
                    params: params
                }).then(res => {
                    layer.msg('提交成功', { icon: 1 });
                    layer.close(index);
                });
            }
        });
    }


    // function allStatusOrderTableWatchbar() {
    //     table.on('tool(allStatusOrder_table)', function (obj) {
    //         if (obj.event == 'edit') {
    //             // allStatusOrderNewandEdit('2', obj.data)
    //             commonOrderDetailFn(obj.data);
    //         } else if (obj.event == 'remark') {
    //             commonDirectMailRemark(obj.data);
    //         }
    //     });
    // }

    //监听表格tr的点击[查看详情]
    function allStatusOrder_watchTableTr() {
        $('#allStatusOrderCard .layui-table-main').on('click', 'td[data-field=platOrderStatus]', function (event) {
            var $targetBtn = $(this).parents('tr').find('span[lay-event=edit]');
            $targetBtn.trigger('click');
            event.stopPropagation();
            event.preventDefault();
        });
    }

    // 渲染页面分页
    function allstatusOrderPage(data, count) {
        laypage.render({
            elem: 'allStatusOrderPage',
            curr: data.page,
            limit: data.limit,
            limits: [1000, 2000, 5000, 10000, 20000],
            layout: ['prev', 'page', 'next', 'count', 'limit'],
            count: count,
            jump: function (obj, first) {
                $('#allStatusOrderForm input[name="limit"]').val(obj.limit);//保障下次的分页请求中带有的值正确
                $('#allStatusOrderForm input[name="page"]').val(obj.curr);//保障下次的分页请求中带有的值正确
                //首次不执行
                if (!first) {
                    data.page = obj.curr;
                    data.limit = obj.limit;
                    $('#allStatusOrderSearch').click()
                }
            }
        });
    }

    //修改订单
    function allStatusOrderNewandEdit(type, data) {
        edit_order_tableIns = null;
        var concatData = []
        layer.open({
            type: 1,
            title: '查看详情',
            btn: ['保存', '取消'],
            area: ['90%', '80%'],
            move: false,
            content: $('#pop_allStatusOrder_newandeditorder').html(),
            success: function (layero, index) {
                var id = data ? data.id : ""
                var isSavable = $(layero).find('#order_savebtn')
                if (isSavable.length && isSavable.length > 0) {
                    $(layero).find('.layui-layer-btn0').removeClass('hide')
                } else {
                    $(layero).find('.layui-layer-btn0').addClass('hide')
                }
                $(layero).find('.layui-tab').find('ul').find('li').each(function (index, item) {
                    $(item).data('orderId', id)
                })
                laydate.render({
                    elem: '#edit_time',
                    type: 'datetime'
                });
                appendSelect($('#allStatusOrder_editForm').find('select[name="storeAcctId"]'), allStatusOrder_allstore, 'id', 'storeAcct', 'platCode')
                appendSelect($('#allStatusOrder_editForm').find('select[name="warehouseId"]'), allStatusOrder_pageEnum.prodWarehouses, 'name', 'value')
                appendSelect($('#allStatusOrder_editForm').find('select[name="logisTypeId"]'), allStatusOrder_logisType, 'id', 'name')
                appendSelect($('#allStatusOrder_editForm').find('select[name="siteId"]'), allStatusOrder_Site, 'code', 'name')
                appendSelect($('#allStatusOrder_editForm').find('select[name="currency"]'), allStatusOrder_Currency, 'code', 'name')
                if (data) {
                    data.orderTimeCn = Format(data.orderTimeCn, 'yyyy-MM-dd hh:mm:ss')
                    form.val("allStatusOrder_editForm", data);
                    storeSelected($('#allStatusOrder_editForm select[name="storeAcctId"]'), data.storeAcctId.toString())
                    getAllSite(data.platCode, function (returnData) {
                        appendSelect($('#allStatusOrder_editForm').find('select[name="siteId"]'), returnData.data, 'code', 'name')
                        Selected($('#allStatusOrder_editForm select[name="siteId"]'), data.siteId)
                        form.render()
                    })
                    concatData = data.orderDetails
                    edit_order_tableIns = allStatusOrderProdTableRender(concatData)
                }
                form.render()
            },
            yes: function (index, layero) {
            },
        })
    }

    //渲染商品信息表格
    function allStatusOrderProdTableRender(data) {
        tableIns = table.render({
            elem: '#allStatusOrder_product_table',
            id: 'allStatusOrder_product_table',
            data: data || [],
            cols: [
                [
                    { title: "图片", field: "imageUrl", templet: "#allStatus_detail_img_tpl" },
                    { title: "Listing_ID", field: "itemId" },
                    { title: "店铺SKU", field: "storeSSku" },
                    { title: "商品SKU", field: "prodSSku" }, //
                    { title: "库位", field: "stockLocation" },
                    { title: "商品名称", field: "prodTitle" },
                    { title: "入库要求", field: "packDesc" },
                    { title: '款式', field: "style" },
                    { title: '可用库存', field: "availableStock" },
                    { title: '商品成本（￥）', field: "prodUnitCost" },
                    { title: '累计净重（g）', field: "prodUnitWeight" },
                    { title: '报关信息', field: "style" },
                    // { title: '销售单价', field: "platUnitPrice" },
                    { title: '商品数量', field: "prodQuantity" },
                    { title: '销售金额', field: "platOrderDetailAmt" },
                    { title: '操作', toolbar: "#toAuditOrder_edit_option", width: 100 }
                ]
            ],
            page: false,
            limit: 300,
            done: function (res) {
                imageLazyload();
                table.on("tool(toAuditOrder_product_table)", function (obj) {
                    if (obj.event = "edit_prod_delete") {
                        var index = getIndex('id', data, obj.data.id)
                        data.splice(index, 1)
                        obj.del();
                    }
                })
            }
        })
        return tableIns
    }

    //页面按钮操作start
    //补货检测
    $('#allStatusOrder_replenishCheck').click(function () {
        let ids = getTableSelectIds();
        if (!ids || ids.length < 1) {
            layer.msg('请选择订单', { icon: 7 });
            return;
        }
        initAjax('/abnormalorder/replenishcheck.html', 'post', { ids: ids.join(",") }, function (returnData) {
            layui.admin.batchResultAlert("补货检测:", returnData.data, function (errIdsArr) {
                deleteTableRow_allStatusOrder(ids,errIdsArr)
            });
        }, 'application/x-www-form-urlencoded');
    });
    //库存占用规则
    $('#allStatusOrder_holdStockTask').click(function () {
        layer.confirm('根据库存占用规则对缺货、待派单订单进行库存占用', function (result) {
            if (result) {
                initAjax('/platorder//holdstocktask.html', 'post', {}, function (returnData) {
                    layui.admin.batchResultAlert("订单重新走库存占用规则:", returnData.data, function () {
                        $('#allStatusOrderSearch').click();
                    });
                }, 'application/x-www-form-urlencoded');
            }
        });
    });
    //转待审核
    $('#allStatusOrder_toAudit').click(function () {
        let ids = getTableSelectIds();
        if (!ids || ids.length < 1) {
            layer.msg('请选择订单', { icon: 7 });
            return;
        }
        commonOrderConfirmLayer(ids.length, function (index) {
            initAjax('/platorder//toaudit.html', 'post', { ids: ids.join(",") }, function (returnData) {
                layer.close(index);
                layui.admin.batchResultAlert("订单转待审核:", returnData.data, function () {
                    $('#allStatusOrderSearch').click();
                });
            }, 'application/x-www-form-urlencoded');
         });

    });
    //转取消订单
    $('#allStatusOrder_toCancel').click(function () {
        let ids = getTableSelectIds();
        if (!ids || ids.length < 1) {
            layer.msg('请选择订单', { icon: 7 });
            return;
        }
        initAjax('/platorder//tocancel.html', 'post', { ids: ids.join(",") }, function (returnData) {
            layui.admin.batchResultAlert("转取消订单:", returnData.data, function () {
                $('#allStatusOrderSearch').click();
            });
        }, 'application/x-www-form-urlencoded');
    });

    //指定仓库类型
    $('#allStatusOrder_appointWarehouseType').click(function () {
        let ids = getTableSelectIds();
        if (!ids || ids.length < 1) {
            layer.msg('请选择订单', { icon: 7 });
            return;
        }
        layer.open({
            type: 1,
            title: '重新指定仓库类型',
            btn: ['确认', '取消'],
            content: "loading",
            success: function (layero, index) {
                $(layero).find('.layui-layer-content').html($("#allStatusOrder_appointWarehouseTypeTpl").html());
                layui.form.render("radio");
            },
            yes: function (index, layero) {
                let warehouseType = $("#allStatusOrder_appointWarehouseTypeForm input[name=warehouseType]:checked").val();
                initAjax('/unauditorder//appointwarehousetype.html', 'post', { ids: ids.join(","), warehouseType: warehouseType }, function (returnData) {
                    layui.admin.batchResultAlert("重新指定仓库类型:", returnData.data, function () {
                        $('#allStatusOrderSearch').click();
                    });
                    layer.close(index);
                }, 'application/x-www-form-urlencoded')
            }
        })
    });
    //页面按钮操作end

    window.getprocessStatus = function (status) {
        var processStatusArr = allStatusOrder_pageEnum.processStatus
        for (var item of processStatusArr) {
            if (item.name == status) {
                return item.value
            }
        }
    }

    function getTableSelectIds() {
        // var checkStatus = table.checkStatus('allStatusOrder_table')
        // var data = checkStatus.data
        let data = allStatusOrder_gridOptions.api.getSelectedRows();
        var ids = (data || []).map(function (item) {
            return item.id
        });
        return ids;
    }


    // 页面数据请求----------------------------------------

    //填充下拉框
    function appendSelect(aDom, data, code, label, attachment) {
        aDom.empty();
        var option = '<option value="">请选择</option>'
        for (var i in data) {
            if (typeof data[i] !== 'string') {
                attachment ?
                    data[i].code = data[i][code] + '_' + data[i][attachment] :
                    data[i].code = data[i][code].toString() || data[i].code
                data[i].label = data[i][label] || data[i].label;
            }
            option += '<option value="' + (typeof data[i].code != 'undefined' ? data[i].code : data[i]) + '">' + (data[i].label || data[i]) + '</option>'
        }
        if(Array.isArray(data)){
            let acctIds = data.map(item=> item.code !== undefined ? item.code : item)
            aDom.attr('acct_ids', acctIds.join(','))
        }
        aDom.append(option)
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
            beforeSend: function (returnData) {
                if (func2) {
                    func2(returnData)
                }
            },
            success: function (returnData) {
                loading.hide()
                if (returnData.code == "0000") {
                    func(returnData)
                } else {
                    layer.msg(returnData.msg, { icon: 2 });
                }
            },
            error: function (returnData) {
                loading.hide();
                if (XMLHttpRequest.status == 200) {
                    layer.msg("请重新登录", { icon: 7 });
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

        //ztt20231128-监听物流方式选择
        setTimeout(()=>{
          //监听面板关闭事件
          formSelects.closed('logisTypeIds_xm_select_allOrder', function(){
            let ddSelecteds = $('[xid=logisTypeIds_xm_select_allOrder]').find('dd.xm-select-this');
            //初始化获取到所有的id并请求接口来渲染
            let ids = $('#logisTypeIds_xm_select_allOrder').attr('acct_ids');
            if(ddSelecteds.length == 0){
              if(ids.length>0){
                allOrderInitLogisticStatusRender(ids);
              }
            }else{
              let selectedArr = [];
              for(let i=0; i<ddSelecteds.length; i++){
                let item = ddSelecteds[i];
                let id = $(item).attr('lay-value');
                selectedArr.push(id);
              }
              allOrderInitLogisticStatusRender(selectedArr.join(','));
            }
          });
          //无xm-form-selected类名才会执行观察事件
          let targetElement= $('[fs_id=logisTypeIds_xm_select_allOrder] .xm-select-title  .xm-input.xm-select')[0];
          let observer = new MutationObserver(function(mutations) {
            let hasClassSelected = $('[fs_id=logisTypeIds_xm_select_allOrder] .xm-form-select').hasClass('xm-form-selected');
            //初始化获取到所有的id并请求接口来渲染
            let ids = $('#logisTypeIds_xm_select_allOrder').attr('acct_ids');
            if(!hasClassSelected){
              mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'title') {
                  // title 属性发生变化时的逻辑
                  let ddSelecteds = $('[xid=logisTypeIds_xm_select_allOrder]').find('dd.xm-select-this');
                  if(ddSelecteds.length == 0){
                    if(ids.length>0){
                      allOrderInitLogisticStatusRender(ids);
                    }
                  }else{
                    let selectedArr = [];
                    for(let i=0; i<ddSelecteds.length; i++){
                      let item = ddSelecteds[i];
                      let id = $(item).attr('lay-value');
                      selectedArr.push(id);
                    }
                    allOrderInitLogisticStatusRender(selectedArr.join(','));
                  }
                }
              });
            }
          });
          // 配置 MutationObserver 监听属性的变化
          let config = { attributes: true };
          // 开始观察目标元素
          observer.observe(targetElement, config);
        }, 1000);
        //初始化物流状态
        function allOrderInitLogisticStatusRender(ids){
          allOrderGetLogisticStatusAjax(ids).then(res => {
            commonRenderSelect("allStatusOrder_typeIdStr", res).then(()=>{
              formSelects.render("allStatusOrder_typeIdStr");
            })
          });
        }
        //获取物流状态接口
        function allOrderGetLogisticStatusAjax(typeIdStr){
          return commonReturnPromise({
            url: `/lms/platorder/listLogisStatusByTypeIdList?typeIdStr=${typeIdStr}`
          })
        }
      //监听iframe传参-ztt20231213
      window.addEventListener('message', function(event){
        // 检查消息的来源是否是你期望的父页面
        if (event.source === window.parent) {
         if(event.data.id  || event.data.platOrderId){
          $('#allStatusOrderForm input[name=orderIds]').val(event.data.id);
          $('#allStatusOrderForm input[name=platOrderIds]').val(event.data.platOrderId);
          $('#allStatusOrderForm #allStatusOrderSearch').trigger('click');
         }
        }
      }, false);
//layui作用域结束标签
  });

  function getIndex(id, arr, value) { //获取某个取值属性在对象数组中的下标
    for (var i = 0; i < arr.length; i++) {
        if (value == arr[i][id]) {
            return i;
        }
    }
    return -1;
}


function allBuyerTipsShow(dom){
    const contentshow = $(dom).attr('data-text');
    if(contentshow){
        layui.layer.tips(`<span style="color:#008B8B">${contentshow}</span>`, $(dom), {
            tips: [1, '#fff'],
            time: 0,
        });
    }
}
function allBuyerTipsShowTable(dom){
    const contentshow = $(dom).attr("data-text");
    let contentJson = new Function(`return ${contentshow}`)();
    let tipsStr = (contentJson || []).map(item => {
       return `<tr>
                <td>${item.creator}</td>
                <td>${item.noteType}:${item.noteContent}</td>
                <td>${Format(item.createTime, 'yyyy-MM-dd hh:mm:ss')}</td>
              </tr>`;
    }).join('');
    if (contentshow) {
      layui.layer.tips(
        `<table class="layui-table"><thead><tr><th>备注人</th><th>备注</th><th>备注时间</th></tr></thead><tbody>${tipsStr}</tbody></table>`,
        $(dom),
        {
          tips: [1, '#3595CC'],
          time: 0,
          maxWidth: '350px'
        }
      );
    }
}
function allBuyerTipsHide(){
    layui.layer.closeAll("tips");
}
function allStatusOrderProfitTipsShow(dom){
    const datatext = $(dom).attr("data-text");
    let data = JSON.parse(datatext);
    let profit = (data.platOrderAmt - data.platFee - data.otherFee) * data.exchangeRate - data.prodCost - (data.outerPackCost || 0) - data.shippingCost;
    let contentshow = "利润 = (订单金额 - 平台佣金 - 税费) * 汇率 - 商品成本 - 外包装成本 - 运费<br/>"
        + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= (" + data.platOrderAmt + " - " + data.platFee + " - " + data.otherFee + ") * " + data.exchangeRate
        + " - " + data.prodCost + " - " + (data.outerPackCost || 0) + " - " + data.shippingCost + "<br/>"
        + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= " + profit.toFixed(4);
    if(contentshow){
        layui.layer.tips(`<span style="color:#008B8B">${contentshow}</span>`, $(dom), {
            tips: [1, '#fff'],
            area: ['420px', 'auto'],
            time: 0,
        });
    }
}
function allStatusOrderProfitTipsHide(){
    layui.layer.closeAll("tips");
}
// 仓库楼栋联动
function allStatusOrder_build_floor(formSelector,defaultWarehouseId){
    let formDom = $(formSelector)
    if (formDom.length == 0) {
        layer.msg('初始化楼栋楼层失败，未找到表单')
    }
    // let warehouseIdDom = formDom.find(".warehouseId")// 仓库
    let buildNoDom = formDom.find(".buildNo"); // 楼栋
    let floorNoDom = formDom.find(".floorNo"); // 楼层
    let buildNo_to_floorNo = {};
    if(defaultWarehouseId){
      getFloorAndBuild(defaultWarehouseId, buildNoDom, floorNoDom, function(res){
          buildNo_to_floorNo = res
      })
    }else{
        buildNoDom.html('<option value="">请选择</option>');
        layui.form.render("select")
    }
  }
