;(function ($, layui, window, document, undefined) {
  layui.use(["admin", "table", "form", "element", "layer", "laytpl", "formSelects", "upload", "laydate"], function () {
    var admin = layui.admin,
      table = layui.table,
      element = layui.element,
      layer = layui.layer,
      laytpl = layui.laytpl,
      upload = layui.upload,
      laypage = layui.laypage,
      laydate = layui.laydate,
      formSelects = layui.formSelects,
      form = layui.form
    form.render()
    //打印
    new dropButton("hasbedelivered_printOperate")
    new dropButton("hasbedelivered_Logistics_btns")
    new dropButton("hasbedelivered_dealOrder_btns")
    new dropButton("hasbedelivered_platOperate")

    formSelects.render("tbd_platOrderStatusList", { placeholder: "请先选择平台" })
    formSelects.render("hasbedelivered_store", { placeholder: "请先选择平台" })

    // 模板查询赋值
    commonSaveSearchTpl({
      id: "hasbedelivered_save",
      formId: "hasbedeliveredForm",
      pageName: "auditDespathOrder_hasbedelivered",
      searchBtnId: "hasbedeliveredSearch",
      cb: param => hasbedelivered_formVal(param),
    })

    function hasbedelivered_formVal(param) {
      let $formDom = $("#hasbedeliveredForm")
      let timeStamp = 0 // 调接口的需要加400
      //  销售 客服
      if (param.salerAndcustomSelect) {
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
          url: "/lms/sys/listStoreForRenderHpStoreCommonComponent.html",
          type: "post",
          params: {
            roleNames: `${param.platCode}专员`,
            orgId: param.orgs,
            salePersonId: param.salePersonId,
            platCode: param.platCode,
            type: param.salerAndcustomSelect == 1 ? "salesperson" : "customservicer",
          },
        }).then(res => {
          const storeList = param.storeAcctIds ? param.storeAcctIds.split(",") : []
          const arr = res.map(item => ({
          name: item.storeAcct,
          value: item.id,
          selected: storeList.filter(elem => elem == item.id).length,
          }))
          formSelects.data("hasbedelivered_storeAcct", "local", { arr })
          const acctIds = res.map(item=>item.id).join(',')
          $('#hasbedeliveredForm').find(`select[_name=storeAcctIds]`).attr('acct_ids',acctIds)
           // 给表单赋值
          form.val("hasbedeliveredForm", param)
          // 更多查询条件是否有值
          hasbedeliveredName.hasValue()
          // 多选的 name: xm-select
          let multiSelectObj = {
            salePersonId: "hasbedelivered_salePersonsSelect",
            prodLogisAttrs: "hasbedelivered_logisAttrs",
            platOrderStatusList: "tbd_platOrderStatusList",
            shippingCountryCodes: "hasbedelivered_shippingCountrys",
            platTags: "hasbedelivered_platTags",
            logisTypeIds: "xm_hasbedelivered_logisTypeIds",
            orderLabels: "hasbedelivered_orderLabels",
          }
          Object.keys(multiSelectObj).forEach(item => {
            if (param[item]) {
              formSelects.value(multiSelectObj[item], param[item].split(","), true)
            } else {
              formSelects.render(multiSelectObj[item])
            }
          })
          // 执行搜索
          $('#hasbedeliveredSearch').click()
        })
      }, timeStamp)

      if (param.companyType) {
        $formDom.find("select[name=companyType]").next().find(`dd[lay-value="${param.companyType}"]`).trigger("click")
      }
      if (param.company) {
        $formDom.find("select[name=company]").next().find(`dd[lay-value="${param.company}"]`).trigger("click")
      }
    }

    // 前端删除行，删除后不刷新表格
    function deleteTableRow_hasBedelivered(ids,errIdsArr){
      zttCommonRemoveDataHandle({
        selectedIds: ids,
        gridOptions: hasBedelivered_gridOptions,
        tableData: immutableStore,
        errIds: errIdsArr
      }).then(newObj => {
        let { newData, successIds } = newObj;
        // immutableStore = newData;
        let oldNum = $('#hasbedelivered-tabs ul li.layui-this>span').text();
        let newNum = oldNum - successIds.length;
        $('#hasbedelivered-tabs ul li.layui-this>span').text(newNum);
        $('#hasBedeliveredPage .layui-laypage-count').text(`共 ${newNum} 条`);
      });
    }
    // 前端更新行，更新后不刷新表格
    function updateTableRow_hasBedelivered(ids,errIdsArr){
      zttCommonUpdataDataHandle({
        selectedIds: ids,
        errIds: errIdsArr
      }).then(newObj => {
        // 修改成功的数据
        let { successIds } = newObj;
        if(successIds.length != 0){
          // 选中的数据
          let checkStatus = hasBedelivered_gridOptions.api.getSelectedRows();
          let newCheckStatus = deepCopy(checkStatus)
          commonReturnPromiseRes({
            url: ctx + '/shippedorder/listorder.html',
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
            hasBedelivered_gridOptions.api.updateRowData({ update: newCheckStatus });
          })
        }
      });
    }
    //渲染平台标记
    hasbedelivered_renderPlatCodeMark()
    function hasbedelivered_renderPlatCodeMark() {
      commonReturnPromise({
        url: "/lms/unauditorder/listenum.html",
      }).then(res => {
        let { platTagList } = res
        commonRenderSelect("hasbedelivered_platTags", platTagList).then(() => {
          formSelects.render("hasbedelivered_platTags")
        })
      })
    }


    //导出功能
    componentForOrderDownload('hasbedelivered_exportTemplate', function(){
      let data = hasBedelivered_gridOptions.api.getSelectedRows();
      let idsArr = data.map(function (item) {
        return item.id;
      });
      return idsArr;
    },function(formData){
        //先获取表单数据,并且处理表单数据
        let data = {};
        data.field = serializeObject($('#hasbedeliveredForm'));
        if (data.field.times) {
          data.field.orderTimeStart = data.field.times.split(' - ')[0];
          data.field.orderTimeEnd = data.field.times.split(' - ')[1];
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
        // 物流方式与物流方式 ###
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
          data.field.agentCompany = ''
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

    var hasbedeliveredName = {
      //通用的打印处理
      commonPrintHandle(status) {
        let params = {
          printType: 23,
        }
        if (status) {
          params.printArray = "['85017F001E040064','8A01000000000001']"
        } else {
          params.printArray = "['85417F001E040024','8A01000000000001']"
        }
        return new Promise((resolve, reject) => {
          $.ajax({
            type: "post",
            url: "http://localhost:9898",
            dataType: "json",
            data: params,
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
        })
      },
      //页面操作事件end
      getTableSelectIds() {
        return new Promise(function (resolve, reject) {
          let data = hasBedelivered_gridOptions.api.getSelectedRows()
          if (!data.length) {
            reject("请先选中一条数据")
          }
          resolve(data)
        })
      },
      // 物流
      logisticsBtns: function () {
        const _this = this
        //燕文截单功能
        $("#hasbedelivered_yanwenCutOrder").on("click", function () {
          _this
            .getTableSelectIds("hasbedelivered_tableId")
            .then(function (res) {
              var idsArr = res.map(function (item) {
                return item.id
              })
              layer.prompt(
                {
                  formType: 2,
                  value: "",
                  title: "燕文截单备注",
                  area: ["500px", "300px"], //自定义文本域宽高
                },
                function (value, index, elem) {
                  commonReturnPromise({
                    url: "/lms/platorder/cancelYanwen.html",
                    type: "post",
                    params: {
                      ids: idsArr.join(","),
                      remark: value,
                    },
                  }).then(res => {
                    layui.admin.batchResultAlert("燕文截单完成:", res, function () {})
                    layer.close(index)
                  })
                }
              )
            })
            .catch(function (err) {
              layer.msg(err, { icon: 2 })
            })
        })

        // 获取华亿跟踪号
        $("#hasbedelivered_huayiTrackingNo").on("click", function () {
          _this
            .getTableSelectIds("hasbedelivered_tableId")
            .then(dataArr => {
              let submitArr = dataArr.map(item => ({
                logisticsTypeId: item.logisTypeId,
                orderId: item.id,
                logisAgentTrackingNo: item.logisAgentTrackingNo || "",
                packageWeight: item.realWeight / 1000 || 0,
              }))
              //调用接口处理数据
              commonReturnPromise({
                url: "/lms/huayi/get/real/tracking",
                type: "post",
                contentType: "application/json",
                params: JSON.stringify(submitArr),
              }).then(res => {
                layui.admin.batchResultAlert("获取华亿跟踪号完成:", res, function () {
                  $("[lay-filter=hasbedeliveredSearch]").trigger("click")
                })
              })
            })
            .catch(function (err) {
              layer.msg(err, { icon: 2 })
            })
        })
        // 物流规则匹配分析
        $("#hasbedelivered_logisRule_match_analysis").on("click", function () {
          _this
            .getTableSelectIds("hasbedelivered_tableId")
            .then(dataArr => {
              if (dataArr.length > 1) {
                return layer.msg("物流规则分析只能选择一笔订单", { icon: 7 })
              }
              const id = dataArr.map(item => item.id).join()
              //弹框处理
              commonReturnPromise({
                url: "/lms/platorder/getLogisticRuleMatchDetail.html",
                params: { id },
              }).then(res => {
                window.localStorage.setItem("analysisLogisRule", JSON.stringify(res))
                let index = layer.open({
                  type: 1,
                  title: "物流规则匹配分析",
                  id: "hasbedelivered_logisRule_match_analysisLayerId",
                  area: ["100%", "100%"],
                  btn: ["关闭"],
                  success: function (layero, index) {
                    layui
                      .view(this.id)
                      .render("route/iframe/order/analysisLogisRule")
                      .done(function () {
                        form.render()
                      })
                  },
                })
              })
            })
            .catch(function (err) {
              layer.msg(err, { icon: 2 })
            })
        })
      },
      //平台操作功能
      platOperateFeatures: function () {
        let _this = this
        //更新订单状态
        $("#hasbedelivered_syncOrderStatus").on("click", function () {
          _this
            .getTableSelectIds("hasbedelivered_tableId")
            .then(function (res) {
              const ids = res.map(item => item.id)
              commonReturnPromise({
                url: "/lms/unauditorder/syncplatstatus.html",
                type: "post",
                params: { ids:ids.join() },
              })
                .then(function (result) {
                  layui.admin.batchResultAlert("更新订单状态完成:", result, function (result) {
                    updateTableRow_hasBedelivered(ids,result)
                  })
                })
                .catch(function (resErr) {
                  layer.msg(resErr.message, { icon: 2 })
                })
            })
            .catch(function (err) {
              layer.msg(err, { icon: 2 })
            })
        })
        //标记平台发货
        $("#hasbedelivered_markDelivery").on("click", function () {
          _this
            .getTableSelectIds("hasbedelivered_tableId")
            .then(function (res) {
              var idsArr = res.map(function (item) {
                return item.id
              });
              zttCommonProgressBar({ type: 10, ids: idsArr.join() }, function (progressData) {
                layui.admin.batchResultAlert("标记平台发货完成:", progressData, function (result) {
                  updateTableRow_hasBedelivered(idsArr,result)
                });
              });
              // commonReturnPromise({
              //   url: "/lms/unauditorder/markplatshipping.html",
              //   type: "post",
              //   params: {
              //     ids: idsArr.join(),
              //   },
              // }).then(function (result) {
              //   layui.admin.batchResultAlert("标记平台发货完成:", result, function () {
              //     $("[lay-filter=hasbedeliveredSearch]").trigger("click")
              //   });
              // });
            })
            .catch(function (err) {
              layer.msg(err, { icon: 2 })
            })
        })
        // amazon 邮件
        $("#hasbedelivered_amazonEmail").on("click", function () {
          orderAmazonEmail(hasBedelivered_gridOptions)
        })
        // ebay 邮件
        $("#hasbedelivered_eBayEmail").on("click", function () {
          orderEbayEmail(hasBedelivered_gridOptions)
        })
      },
      //导出功能
      exportDetails: function () {
        let _this = this
        //导出明细
        $("#hasbedeliveredDetail_export").on("click", function () {
          _this
            .getTableSelectIds("hasbedelivered_tableId")
            .then(function (res) {
              let ids = res.map(v => v.id)
              let param = {}
              param.orderIds = ids.join(",")
              submitForm(param, "/lms/platorder/exportorder.html", "_blank")
              layer.closeAll()
            })
            .catch(function (err) {
              layer.msg(err, { icon: 2 })
            })
        })
        //导出
        $("#hasbedelivered_export").on("click", function () {
          _this
            .getTableSelectIds("hasbedelivered_tableId")
            .then(function (res) {
              let ids = res.map(v => v.id)
              let param = {}
              param.orderIds = ids.join(",")
              submitForm(param, "/lms/platorder/exportorderdetail.html", "_blank")
              layer.closeAll()
            })
            .catch(function (err) {
              layer.msg(err, { icon: 2 })
            })
        })
      },
      //打印功能
      printBtns: function () {
        const _this = this
        //打印物流面单
        $("#hasbedelivered_logisLi").on("click", function () {
          _this
            .getTableSelectIds("hasbedelivered_tableId")
            .then(function (res) {
              var orderIdsArr = res.map(function (item) {
                return item.id
              })
              $.ajax({
                type: "POST",
                url: "/lms/logistics/batch/print.html",
                data: { orderIdStr: orderIdsArr.join() },
                success: function (returnData) {
                  var paramsMapList = returnData.successResults
                  if (paramsMapList && paramsMapList.length > 0) {
                    // joom 平台的数据打印宽度需要是150，
                    if (orderIdsArr.filter(item => item.platCode == "joom").length) {
                      var _result = returnData.successResults
                    } else {
                      var _result = returnData.successResults.map(item => {
                        let _item = res.find(elem => elem.id == item.orderId)
                        if (_item.platCode == "joom") {
                          item.width = 100
                          item.height = 150
                        }
                        return item
                      })
                    }
                    for (var j = 0; j < _result.length; j++) {
                      packagePrint(returnData.successResults[j])
                    }
                  }
                  if (returnData.failResults && returnData.failResults.length > 0) {
                    let str = ""
                    returnData.failResults.forEach(item => {
                      str += item + "<br>"
                    })
                    layer.alert(str, { icon: 2 })
                  }
                },
                error: function (err) {
                  console.log(err)
                },
              })
            })
            .catch(function (err) {
              layer.msg(err, { icon: 2 })
            })
        })
        //打印配货单
        $("#hasbedelivered_setLi").on("click", function () {
          _this
            .getTableSelectIds("hasbedelivered_tableId")
            .then(function (res) {
              var orderIdsArr = res.map(function (item) {
                return item.id
              })
              if (orderIdsArr.length == 0) {
                return layer.msg("没有批次号,没法打印啊", { icon: 2 })
              }
              for (var i = 0; i < orderIdsArr.length; i++) {
                printSortAjax(null, orderIdsArr[i]).then(function (objectData) {
                  //然后组装参数去调用打印接口
                  epeanPrint_plugin_fun(20, objectData)
                })
              }
            })
            .catch(function (err) {
              layer.msg(err, { icon: 2 })
            })
        })
        //打印物流面单（含SKU）
        $("#hasbedelivered_setlogisLi").on("click", function () {
          _this
            .getTableSelectIds("hasbedelivered_tableId")
            .then(function (res) {
              var orderIdsArr = res.map(function (item) {
                return item.id
              })
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
            })
            .catch(function (err) {
              layer.msg(err || err.message, { icon: 2 })
            })
        })
      },
      // 订单处理
      dealOrderBtns: function () {
        const _this = this
        //批量备注
        $("#hasbedelivered_batchRemark").on("click", function () {
          _this
            .getTableSelectIds("hasbedelivered_tableId")
            .then(function (res) {
              var idsArr = res.map(item => item.id)
              let ids = idsArr.join("-")
              commonDirectMailRemarkBatch(ids,hasBedelivered_gridOptions)
            })
            .catch(function (err) {
              layer.msg(err, { icon: 2 })
            })
        })
        // 重寄
        $("#hasbedelivered_resend").on("click", function () {
          _this
            .getTableSelectIds("hasbedelivered_tableId")
            .then(checkData => {
              if (checkData.length > 1) {
                return layer.msg("只能选择一笔订单重寄", { icon: 7 })
              }
              let data = checkData[0]
              window.localStorage.setItem("orderCheckData", JSON.stringify(data))
              var concatData = []
              layer.open({
                type: 1,
                title: "重寄订单",
                btn: ["保存", "取消"],
                area: ["90%", "80%"],
                move: false,
                id: "pop_hasbedelivered_resend_id",
                success: function (layero, index) {
                  layui
                    .view(this.id)
                    .render("route/iframe/order/orderResend")
                    .done(function () {
                      form.render()
                    })
                },
                yes: function (index, layero) {
                  form.on("submit(edit_submit)", function (obj) {
                    const param = {
                      ...data,
                      // 备注类型默认值为重寄订单，不可修改
                      noteType: "重寄订单",
                      ...obj.field,
                    }
                    const trDoms = $("#order_resend_product_table").next().find("tbody tr")
                    let platOrderDetails = []
                    trDoms.each(function () {
                      platOrderDetails.push({
                        itemId: $(this).find('td[data-field="itemId"] input').val() || '',
                        storeSSku: $(this).find('td[data-field="storeSSku"] div[name=storeSSku]').text() || '',
                        prodSSku: $(this).find('td[data-field="prodSSku"] input').val() || '',
                        platUnitPrice: $(this).find('td[data-field="platUnitPrice"] input').val() || '',
                        platQuantity: $(this).find('input[name=platQuantity]').val() == 'undefined' ? 0 : $(this).find('input[name=platQuantity]').val(),
                        platOrderItemId: $(this).find('input[name=platOrderItemId]').val() == 'undefined' ? '' : $(this).find('input[name=platOrderItemId]').val(),
                        prodQuantity: $(this).find('td[data-field="prodQuantity"] input').val() || '',
                        platDetailTranscationId: $(this).find('input[name=platDetailTranscationId]').val() == 'undefined' ? '' : $(this).find('input[name=platDetailTranscationId]').val(),
                        platOrderDetailAmt: $(this).find('td[data-field="platOrderDetailAmt"] input').val() || '',
                        status: true,
                      })
                    })
                    param.platOrderDetails = platOrderDetails
                    if (param.platOrderDetails.length) {
                      const validOptions = comVertifyPlatOrderDetails(param.platOrderDetails)
                        if(!validOptions) {
                            return;
                        }
                      if (!param.platOrderDetails.every(item => Number(item.prodQuantity) > 0)) return layer.msg("商品数量需要为正整数")
                      // console.log('param', param);
                      if(param.platQuantity == 'undefined') param.platQuantity = 0;
                      if(param.platOrderItemId == 'undefined') param.platOrderItemId='';
                      if(param.platDetailTranscationId== 'undefined') param.platDetailTranscationId='';
                      _this.resendhasbedelivered(param).then(returnData => {
                        if (returnData) {
                          layer.open({
                            title: "保存成功",
                            content: `重寄订单编号：${returnData}`,
                            icon: 1,
                          })
                        } else {
                          layer.msg(returnData || "保存成功")
                        }
                        // $("#hasbedeliveredSearch").click()
                        $("[lay-filter=hasbedeliveredSearch]").trigger("click")
                        layer.close(index)
                      })
                    } else {
                      layer.msg("请添加商品")
                    }
                  })
                  $(layero).find("#edit_submit").click()
                },
                end: function () {},
              })
            })
            .catch(function (err) {
              layer.msg(err, { icon: 2 })
            })
        })
        // 修改称重
        upload.render({
          elem: "#hasbedelivered_updateWeight", //绑定元素
          url: '/lms/shippedorder/importRealWeight', //上传接口
          accept: "file",
          // field: "multipartFile",
          before: function () {
            loading.show()
          },
          done: function (res) {
            loading.hide()
            layui.admin.batchResultServeAlert("修改称重:", res, function () {
              $("[lay-filter=hasbedeliveredSearch]").trigger("click")
          });
            //上传完毕回调
          },
          error: function (res) {
            loading.hide()
            layer.msg("上传失败", { icon: 2 })
            //请求异常回调
          },
        })
        // 更新运费
        $("#hasbedelivered_updateLogistics").on("click", function () {
          _this
            .getTableSelectIds("hasbedelivered_tableId")
            .then(function (res) {
              const ids = res.map(item => item.id).join()
              commonReturnPromise({
                url: "/lms/unauditorder/updateCostInfo",
                type: "post",
                params: { ids },
              }).then(res => {
                layer.msg(res, { icon: 1 })
                $("[lay-filter=hasbedeliveredSearch]").trigger("click")
              })
            })
            .catch(function (err) {
              layer.msg(err, { icon: 2 })
            })
        })
      },

      // 统一错误处理
      errHandle: function (str, err) {
        var errHandle = typeof err == "object" ? str : err
        this.packageEnterClose(errHandle, function () {})
      },
      //物流公司接口
      allCompanyAjax: function () {
        return commonReturnPromise({
          type: "post",
          contentType: "application/json",
          url: "/lms/unauditorder/listcompanyandagent.html",
        })
      },
      //物流方式接口
      allLogisTypeAjax: function () {
        return commonReturnPromise({
          url: "/lms/unauditorder/listlogistype.html?specialType=直发物流",
        })
      },
      //统一回车关闭弹框
      packageEnterClose: function (str, fn, onfocus) {
        layer.open({
          title: "提示",
          content: `<span style="font-size: 30px;">${str}</span>`,
          btn: ['<span style="font-size: 25px">确认</span>'],
          area: ["60%", "40%"],
          success: function (layero, index) {
            layero.find(".layui-layer-title").css("font-size", "24px")
            layero.find(".layui-layer-btn0").css("height", "30px")
            layero.find(".layui-layer-btn0").css("line-height", "30px")
            this.enterEsc = function (event) {
              if (event.keyCode === 13) {
                fn()
                layer.close(index)
                return false //阻止系统默认回车事件
              }
            }
            $(document).on("keydown", this.enterEsc) //监听键盘事件，关闭层
          },
          end: function () {
            $(document).off("keydown", this.enterEsc) //解除键盘关闭事件
            if (onfocus) {
              onfocus.select()
            }
          },
        })
      },
      //#region 搜索+渲染表格start
      //时间渲染默认30天
      time: function () {
        var nowdate = new Date(new Date().toLocaleDateString()).getTime()
        var endTime = Format(nowdate + 24 * 60 * 60 * 1000 - 1, "yyyy-MM-dd hh:mm:ss")
        var startTime = Format(new Date(nowdate - 60 * 24 * 3600 * 1000), "yyyy-MM-dd hh:mm:ss")
        var timeVal = startTime + " - " + endTime
        laydate.render({
          elem: "#hasbedelivered_time",
          type: "datetime",
          // value: timeVal,
          inputAuto: true,
          range: true,
          showShortcuts: true
        })
      },
      //渲染搜索条件
      renderSearchItem: function () {
        var _this = this
        var hasbedeliveredSession = sessionStorage.getItem("TOBEDELIVERED_ITEMS")
        if (!hasbedeliveredSession) {
          _this
            .commonSession()
            .then(function (obj) {
              _this.renderHandle(obj)
              sessionStorage.setItem("TOBEDELIVERED_ITEMS", JSON.stringify(obj))
            })
            .catch(function (err) {
              layer.msg("请求接口出错", { icon: 7 })
            })
        } else {
          var obj = new Function(`return ${hasbedeliveredSession}`)()
          _this.renderHandle(obj)
        }
      },
      //缓存请求结构公共逻辑
      commonSession: function () {
        var _this = this
        return new Promise(function (resolve, reject) {
          Promise.all([_this.allLists(), _this.allPurchasingAgent(), _this.allPreprodDev(), _this.allCompany()])
            .then(function (result) {
              var obj = result[0] //平台/物流属性/收件国家/发货仓库/订单标签
              obj.purchasingAgent = result[1] //采购人员
              obj.preprodDev = result[2] //开发人员
              obj.companys = result[3]["companys"] //物流公司
              obj.agents = result[3]["agents"] //货代公司
              resolve(obj)
            })
            .catch(function (err) {
              reject(err)
            })
        })
      },
      //渲染操作
      renderHandle: function (obj) {
        //平台
        commonRenderSelect("hasbedelivered_platCode", obj.platCodes).then(function () {
          form.render("select")
        })
        //订单标签
        commonRenderSelect("hasbedelivered_orderLabels", obj.orderLabels, { name: "name", code: "code" }).then(function () {
          formSelects.render("hasbedelivered_orderLabels")
        })
        //物流属性hasbedelivered_logisAttrs
        commonRenderSelect("hasbedelivered_logisAttrs", obj.logisAttrs).then(function () {
          formSelects.render("hasbedelivered_logisAttrs")
        })
        //收件国家hasbedelivered_shippingCountrys
        const shippingCountryCodeList = obj.shippingCountrys.map(item => ({
          ...item,
          name: item.value + "(" + item.name + ")",
          shippingCountryCode: item.name,
          shippingCountryName: item.enFullValue,
          shippingCountryCnName: item.value,
        }))
        commonRenderSelect("hasbedelivered_shippingCountrys", shippingCountryCodeList, { name: "name", code: "shippingCountryCode" }).then(function () {
          formSelects.render("hasbedelivered_shippingCountrys")
        })
        //物流公司hasbedelivered_company
        commonRenderSelect("hasbedelivered_company", obj.companys, { name: "cnName", code: "id" }).then(function () {
          form.render("select")
        })
        //发货仓库hasbedelivered_warehouseId
        commonRenderSelect("hasbedelivered_warehouseId", obj.prodWarehouses, { name: "value", code: "name" }).then(function () {
          form.render("select")
        })
        //开发专员hasbedelivered_preprodDevId
        commonRenderSelect("hasbedelivered_preprodDevId", obj.preprodDev, { name: "userName", code: "id" }).then(function () {
          form.render("select")
        })
        //采购专员hasbedelivered_purchasingAgentId
        commonRenderSelect("hasbedelivered_purchasingAgentId", obj.purchasingAgent, { name: "userName", code: "id" }).then(function () {
          form.render("select")
        })
      },
      //获取所有采购人员post
      allPurchasingAgent: function () {
        return commonReturnPromise({
          type: "post",
          contentType: "application/json",
          url: "/lms/sys/buyerList.html",
        })
      },
      //获取所有开发人员post
      allPreprodDev: function () {
        return commonReturnPromise({
          type: "post",
          contentType: "application/json",
          url: "/lms/sys/prodOwnerList.html",
        })
      },
      //获取平台/物流属性/收件国家/发货仓库/订单标签post
      allLists: function () {
        return commonReturnPromise({
          type: "post",
          contentType: "application/json",
          url: "/lms/unauditorder/listenum.html",
        })
      },
      //获取物流/货代公司post
      allCompany: function () {
        return commonReturnPromise({
          type: "post",
          contentType: "application/json",
          url: "/lms/unauditorder/listcompanyandagent.html",
        })
      },
      //获取所有的物流方式post
      allLogisType: function (obj) {
        return commonReturnPromise({
          url: "/lms/unauditorder/listlogistype.html",
          params: {...obj,specialType: "直发物流"},
        })
      },
      //获取店铺(获取24万行json,前端渲染不动啊)
      allStore: function (platCode) {
        return commonReturnPromise({
          type: "post",
          contentType: "application/json",
          url: `/lms/sys/orderliststorebyplatcode.html?platCode=${platCode}`,
        })
      },
      //获取平台订单状态
      listplatorderstatus: function (platCode) {
        return commonReturnPromise({
          type: "get",
          url: `/lms/undispatch/listplatorderstatus.html?platCode=${platCode}`,
        })
      },
      //平台和店铺,物流公司和物流方式联动
      watchHandle: function () {
        var hasbedeliveredSession = sessionStorage.getItem("TOBEDELIVERED_ITEMS")
        var _this = this
        var $form = $("#hasbedeliveredForm")
        //监听平台和店铺联动
        commonInitRenderRoleType('hasbedelivered');
        form.on("select(hasbedelivered_platCode)", function (data) {
          var val = data.value //选中的值
          // commonOrderAddSalePerson("hasbedelivered", form, val);
          commonOrderAddOrg('hasbedelivered', form, val);
          _this.listplatorderstatus(val).then(function (result) {
            _this.platOrderStatuscommonPS(result)
          })
          // _this.allStore(val).then(function (result) {
          //   _this.commonPS(result)
          // })
        })
        //监听物流公司和货代公司切换
        form.on("select(companyType)", function (data) {
          var val = data.value
          if (!hasbedeliveredSession) {
            _this.allCompany().then(function (result) {
              _this.commonLW(val, result)
            })
          } else {
            var obj = new Function(`return ${hasbedeliveredSession}`)()
            _this.commonLW(val, obj)
          }
        })
        //监听物流/货代公司和物流方式联动
        form.on("select(hasbedelivered_company)", function (data) {
          var val = data.value
          var isCompany = $form.find("[name=companyType]").val()
          var obj = {}
          if (isCompany == "companys") {
            obj.logisticsCompanyId = val
          } else {
            obj.agent = val
          }
          _this.allLogisType(obj).then(function (result) {
            commonRenderSelect("hasbedelivered_logisTypeIds", result, { name: "name", code: "id" }).then(function () {
              formSelects.render("xm_hasbedelivered_logisTypeIds")
            })
          })
        })
      },
      //平台和店铺公共逻辑
      commonPS: function (data) {
        commonRenderSelect("hasbedelivered_store", data, { name: "storeAcct", code: "id" }).then(function () {
          formSelects.render("hasbedelivered_store", { placeholder: "请先选择平台" })
        })
      },
      platOrderStatuscommonPS: function (data) {
        let arr = []
        data && data.forEach(item => arr.push({ platOrderStatus: item }))
        commonRenderSelect("tbd_platOrderStatusList", arr, { name: "platOrderStatus", code: "platOrderStatus" }).then(function () {
          formSelects.render("tbd_platOrderStatusList", { placeholder: "请先选择平台" })
        })
      },
      //物流方式相关的公共逻辑
      commonLW: function (val, result) {
        if (val == "companys") {
          commonRenderSelect("hasbedelivered_company", result.companys, { name: "cnName", code: "id" }).then(function () {
            form.render("select")
          })
        } else {
          commonRenderSelect("hasbedelivered_company", result.agents, { name: "cnName", code: "id" }).then(function () {
            form.render("select")
          })
        }
      },
      //更多查询条件处理
      moreHandle: function () {
        let _this = this
        $("#showMoreSearchCondition_hasbedelivered").click(function () {
          var self = this
          if ($(self).hasClass("showExternal")) {
            $(self).closest(".layui-form").find(".externalContainAuditorder").hide()
            $("#hide_icon_hasbedelivered").show()
            $("#show_icon_hasbedelivered").hide()
            $(self).removeClass("showExternal")
            _this.hasValue()
          } else {
            $(self).closest(".layui-form").find(".externalContainAuditorder").show()
            $("#hide_icon_hasbedelivered").hide()
            $("#show_icon_hasbedelivered").show()
            $(self).addClass("showExternal")
          }
        })
      },
      hasValue: function () {
        let inputs = $("#hasbedeliveredForm .externalPopAuditorder").find("input")
        let count = 0
        let showDom = $("#showMoreSearchCondition_hasbedelivered .hasValue")
        for (let i = 0; i < inputs.length; i++) {
          let item = inputs[i]
          let val = $(item).val()
          if (val && val != "请选择") {
            count++
          }
        }
        if (count > 0) {
          showDom.html('<font color="red">(有值)</font>')
        } else {
          showDom.html("")
        }
      },
      //触发搜索按钮
      trigger: function () {
        $("[lay-filter=hasbedeliveredSearch]").trigger("click")
      },
      //数据处理
      dataHandle: function (data) {
        if (data.salerAndcustomSelect == 2) {
          data.customServicerId = data.salePersonId;
          delete data.salePersonId;
        }
        if (data.times) {
          var timesArr = data.times.split(" - ")
          data.orderTimeStart = timesArr[0]
          data.orderTimeEnd = timesArr[1]
        } else {
          data.orderTimeStart = ""
          data.orderTimeEnd = ""
        }
        data[data.skuType] = data.skuvalue
        delete data.skuType
        delete data.skuvalue
        //处理companyType和company
        if (data["companyType"] == "companys") {
          data.logisticsCompanyId = data["company"] || ""
        } else {
          data.agentCompany = data["company"] || ""
        }
        if (data.newBatchNo == 1) { // 拣货批次
          data.pickBatchNo = data.valBatchNo
        }else if(data.newBatchNo == 2){ // 组包批次
          data.handoverBatchNo = data.valBatchNo
        }
        // 1. 选择了部门，没有选店铺
        //     1.1 部门下有店铺，传全部店铺
        //     1.2 部门下没有店铺，传0
        // 2. 选择了部门，选择了店铺，传选择的店铺
        if(data.orgs != ''&&data.storeAcctIds == ''){
          data.storeAcctIds = $('#hasbedelivered_store').attr('acct_ids') || 0;
        }
        delete data["companyType"]
        delete data["company"]
        return data
      },
      //渲染表格
      tableRender: function (data) {
        var _this = this
        commonReturnPromiseRes({
          url: "/lms/shippedorder/listorder.html",
          type: "POST",
          params: data,
        })
          .then(function (result) {
            // 商品种类||数量
            if (result.count != 0) {
              let skuQuantity = 0,
                prodQuantity = 0
              result.data.forEach(item => {
                skuQuantity = skuQuantity + item.skuQuantity * 1
                prodQuantity = prodQuantity + item.prodQuantity * 1
              })
              $("#hasbedelivered_tableId").find("[col-id=3] .ag-header-cell-text").text(`商品 种类${skuQuantity} || 数量${prodQuantity}`)
              _this.hasBedeliveredPage(data, result.count)
              immutableStore = result.data
              hasBedelivered_gridOptions.api.setRowData(immutableStore)
              $("#hasbedelivered-tabs").find("li>span").html("")
              $("#hasbedelivered-tabs").find("li.layui-this>span").html(`${result.count}`)
            } else {
              $("#hasbedelivered_tableId").find("[col-id=3] .ag-header-cell-text").text(`商品 种类0 || 数量0`)
              _this.hasBedeliveredPage(data, 0)
              immutableStore = []
              hasBedelivered_gridOptions.api.setRowData(immutableStore)
              $("#hasbedelivered-tabs").find("li>span").html("")
              $("#hasbedelivered-tabs").find("li.layui-this>span").html(`0`)
            }
          })
          .catch(function (err) {
            layer.msg(err, { icon: 2 })
          })
      },
      // 渲染页面分页
      hasBedeliveredPage(data, count) {
        laypage.render({
          elem: "hasBedeliveredPage",
          curr: data.page,
          limit: data.limit,
          limits: [5000, 10000, 20000],
          layout: ["prev", "page", "next", "count", "limit"],
          count: count,
          jump: function (obj, first) {
            $('#hasbedeliveredForm input[name="limit"]').val(obj.limit) //保障下次的分页请求中带有的值正确
            $('#hasbedeliveredForm input[name="page"]').val(obj.curr) //保障下次的分页请求中带有的值正确
            //首次不执行
            if (!first) {
              data.page = obj.curr
              data.limit = obj.limit
              // $("#hasBedeliveredSearch").click()
              $("[lay-filter=hasbedeliveredSearch]").trigger("click")
            }
          },
        })
      },
      //保存修改新增待审核订单
      resendhasbedelivered: function (data) {
        return commonReturnPromise({
          type: "post",
          url: "/lms/unauditorder/resendorder.html",
          contentType: "application/json;charset=UTF-8",
          params: JSON.stringify(data),
        })
      },
      //获取站点接口
      getAllSiteAjax: function (platCode) {
        return commonReturnPromise({
          type: "post",
          url: "/lms/enum/getSiteEnum.html",
          params: {
            platCode: platCode,
          },
        })
      },
      //详情日志接口
      getLogsAjax: function (orderId) {
        return commonReturnPromise({
          type: "post",
          url: "/lms/orderlog/listorderlog.html",
          params: {
            orderId: orderId,
          },
        })
      },
      //#endregion 搜索+渲染表格end
    }
    //物流
    hasbedeliveredName.logisticsBtns()
    //平台操作
    hasbedeliveredName.platOperateFeatures()
    //导出功能
    hasbedeliveredName.exportDetails()
    //打印功能
    hasbedeliveredName.printBtns()
    //订单处理功能
    hasbedeliveredName.dealOrderBtns()
    //时间
    hasbedeliveredName.time()
    //渲染搜索条件
    hasbedeliveredName.renderSearchItem()
    //平台和店铺,物流公司和物流方式联动
    hasbedeliveredName.watchHandle()
    //更多查询条件
    hasbedeliveredName.moreHandle()
    // 物流条件初始化
    hasbedeliveredName.allLogisType({}).then(function (result) {
      commonRenderSelect("hasbedelivered_logisTypeIds", result, { name: "name", code: "id" }).then(function () {
        formSelects.render("xm_hasbedelivered_logisTypeIds")
      })
    })
    //表单搜索
    form.on("submit(hasbedeliveredSearch)", function (data) {
      var data = data.field //获取到表单提交对象
      var obj = hasbedeliveredName.dataHandle(data)
      // 什么查询条件都不设置时： 时间、订单编号、店铺单号、跟踪号至少设置一条
      if(data.times==='' && data.orderIds === '' && data.platOrderIds === '' && data.logisTrackingNos ===''){
        return layer.msg('时间、订单编号、店铺单号、跟踪号至少设置一条')
      }
      hasbedeliveredName.tableRender(obj)
    })
    //点击全部触发搜索功能
    $("#hasbedelivered-tabs").on("click", function () {
      $("[lay-filter=hasbedeliveredSearch]").trigger("click")
    })
    //固定表头hasbedeliveredCard
    UnifiedFixedFn("hasbedeliveredCard")

    //打印带有SKU的物流面单
    function batchOrderSkuLogis(orderIdStr) {
      return commonReturnPromise({
        url: "/lms/logistics/batch/print/skuLabel.html",
        params: {
          orderIdStr: orderIdStr,
        },
      })
    }
    //统一打印功能
    function packagePrint(data, sku) {
      let obj = {}
      obj.printType = 19
      obj.labelUrl = data.ftpLabelUrl
      obj.width = data.width
      obj.height = data.height
      obj.printName = "100100"
      if (obj.height === 150) {
        obj.printName = "100150"
      }
      logistics_label_pdf_print(obj)
    }
    // 配货单 打印请求
    function printSortAjax(batchNo, orderId) {
      let requestStr = {}
      if (orderId) {
        requestStr.orderId = orderId
      } else {
        requestStr.batchNo = batchNo
      }
      return commonReturnPromise({
        url: "/lms/pickpackorder/getpickbatchsku.html",
        params: requestStr,
      })
    }

    $("button[name=orderConfig]").click(function () {
      let orderColumnState = hasBedelivered_gridOptions.columnApi.getColumnState()
      window.localStorage.setItem("orderColumnState", JSON.stringify(orderColumnState))
      layer.msg("保存设置成功")
    })

    var immutableStore = []
    var hasBedelivered_gridOptions = {
      columnDefs: [
        {
          width: 60,
          headerCheckboxSelection: true,
          headerCheckboxSelectionFilteredOnly: true,
          checkboxSelection: true,
        },
        {
          headerName: "订单号",
          width: 180,
          wrapText: true,
          autoHeight: true,
          cellRenderer: data => {
            let d = data.data
            let tagsDom = ""
            if (d.platTagList && d.platTagList.length > 0) {
              tagsDom = `
                        ${d.platTagList
                          .map(item => {
                            return `<span class="hp-badge" style="background:${item.color};width:auto; color:#fff;margin: 0 5px;padding:0 5px!important;">${item.tagName}</span>`
                          })
                          .join("")}`
            }
            // 重寄订单
            let orderLabel = d.operOrderType == 3 ? '<span style="color:red">重寄</span>':''
            // operOrderType 拆单合单：订单操作类型：0原始订单，1拆除订单，2合并订单
            const operOrderTypeTag = d.operOrderType ==1 ? '<span class="hp-badge layui-bg-orange" title="拆出订单">拆</span>' : d.operOrderType ==2 ? '<span class="hp-badge layui-bg-orange" title="合并订单">合</span>' : d.operOrderType ==0 && d.operOriginId!="0" ? '<span class="hp-badge layui-bg-orange" title="拆单订单">拆</span>' : ''
            // 店铺客服
            const customServicerHtml = d.customServicer ? `[${d.customServicer}]` : ''
            return `<div class="alignLeft">
                        <span>${d.id || ""}</span>
                        <span onclick="layui.admin.onlyCopyTxt('${d.id}',event)" style="display: ${d.id ? 'inline-block':'none'}" class="copy-icon">
                          <svg t="1710754196184" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2392" width="16" height="16"><path d="M768 832q-0.992 54.016-37.504 90.496T640 960H192q-54.016-0.992-90.496-37.504T64 832V384q0.992-54.016 37.504-90.496T192 256v64q-27.008 0.992-44.992 19.008T128 384v448q0.992 27.008 19.008 44.992T192 896h448q27.008-0.992 44.992-19.008T704 832h64zM384 128q-27.008 0.992-44.992 19.008T320 192v448q0.992 27.008 19.008 44.992T384 704h448q27.008-0.992 44.992-19.008T896 640V192q-0.992-27.008-19.008-44.992T832 128H384z m0-64h448q54.016 0.992 90.496 37.504T960 192v448q-0.992 54.016-37.504 90.496T832 768H384q-54.016-0.992-90.496-37.504T256 640V192q0.992-54.016 37.504-90.496T384 64z" p-id="2393" fill="#aaaaaa"></path></svg>
                        </span>
                        <span>[${d.platCode}]</span>
                        ${orderLabel}
                        ${tagsDom}
                        ${operOrderTypeTag}	
                        <p id="toAudit_table_storeAcct">${d.storeAcct || ""}[${d.shopId || ""}]</p>
                        <p>[${d.salesPersons || ""}][${d.sellLeaderName || ""}]${customServicerHtml}</p>
                        <span>${d.platOrderId || ""}</span>
                        <span onclick="layui.admin.onlyCopyTxt('${d.platOrderId}',event)" style="display: ${d.platOrderId ? 'inline-block':'none'}" class="copy-icon">
                            <svg t="1710754196184" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2392" width="16" height="16"><path d="M768 832q-0.992 54.016-37.504 90.496T640 960H192q-54.016-0.992-90.496-37.504T64 832V384q0.992-54.016 37.504-90.496T192 256v64q-27.008 0.992-44.992 19.008T128 384v448q0.992 27.008 19.008 44.992T192 896h448q27.008-0.992 44.992-19.008T704 832h64zM384 128q-27.008 0.992-44.992 19.008T320 192v448q0.992 27.008 19.008 44.992T384 704h448q27.008-0.992 44.992-19.008T896 640V192q-0.992-27.008-19.008-44.992T832 128H384z m0-64h448q54.016 0.992 90.496 37.504T960 192v448q-0.992 54.016-37.504 90.496T832 768H384q-54.016-0.992-90.496-37.504T256 640V192q0.992-54.016 37.504-90.496T384 64z" p-id="2393" fill="#aaaaaa"></path></svg>
                          </span>
                        <p>${d.platOrderStatus || ""}</p>
                    </div>`
          },
        },
        {
          wrapText: true,
          autoHeight: true,
          headerName: "订单金额",
          cellRenderer: data => {
            let d = data.data,
              str = "";
            let jsonData = JSON.stringify(d).replace("'", "");
            jsonData = jsonData.replace(/</g, '&lt;');
            jsonData = jsonData.replace(/>/g, '&gt;');
            //利润计算逻辑
            let profitCalculation = `<span data-text='${jsonData}' onmouseenter="hasbedeliveredOrderProfitTipsShow(this)" onmouseleave="hasbedeliveredOrderProfitTipsHide(this)">${d.profit || '0.00'}</span>`;
              let fee = [d.platFee || 0, d.otherFee || 0].filter(i => i !=0);
            if (d.logisApplyStatus == 4 && d.logisApplyFailMsg) {
              str += `<div class="waitOrderErrorTips dis_flex"><div class="waitOrderErrorTipsword">${
                d.logisApplyFailMsg || ""
              }</div><div class="waitOrderErrorTipsClose">x</div></div>`
            }
            let amtDom = d.platShippingAmt ? `<span>(${d.platShippingAmt})</span>` : "";
            str += `<div class="alignLeft">
                        <div><span class='gray'>${d.currency || ""}</span><span id="toAudit_table_platOrderAmt">${d.platOrderAmt || ""}</span>${amtDom}</div>
                        <div><span class="gray">平台费</span>${fee.join(' + ')}</div>
                        <div><span class="gray">商品成本(￥)</span>${d.prodCost} / ${d.costPrice}</div>
                        <div><span class="gray">物流成本(￥)</span>${d.shippingCost !== undefined ? d.shippingCost : ""}<button class="layui-btn layui-btn-xs" name="logisCost" style="cursor:pointer;">详</button></div>
                        <div><span class="gray">利润(￥)</span>${profitCalculation} <span class="gray">${((100 * d.profit) / d.platOrderAmt / d.exchangeRate).toFixed(
              2
            )}%</span></div>
                    </div>`
            return str
          },
        },
        {
          headerName: "商品",
          width: 180,
          wrapText: true,
          autoHeight: true,
          cellRenderer: data => {
            let d = data.data
            return `<div class="alignLeft">
                        <div><span class="gray">种类：</span><span id="toAudit_table_skuQuantity">${d.skuQuantity || ""}</span></div>
                        <div><span class="gray">数量：</span><span id="toAudit_table_prodQuantity">${d.prodQuantity || ""}</span></div>
                        <div><span class="gray">预估重(g)：</span><span>${d.preWeight}</span></div>
                        <div><span class="gray">称重(g)：</span><span>${d.realWeight}</span></div>
                        <div><span class="gray">计费重(g)：</span><span>${d.priceWeight}</span></div>
                    </div>`
          },
        },
        {
          headerName: "收件人",
          wrapText: true,
          autoHeight: true,
          cellRenderer: data => {
            let d = data.data
            const _buyerNote = d.buyerNote || ""
            const _buyerNoteCopyHtml = `<a class="hidden">${_buyerNote}</a>`
            return `<div class="alignLeft">
                        <div id="toAudit_table_shippingUsername">${d.shippingUsername || ""}</div>
                        <div>[${d.shippingCountryCnName || ""}]</div>
                        <div data-text="${_buyerNote}" onmouseenter="hasbedeliveredBuyerTipsShow(this)" onmouseleave="hasbedeliveredBuyerTipsHide(this)">
                            <span class="pora copySpan">
                                <span class="gray">留言：</span>${_buyerNote.slice(0, 46)}
                                ${_buyerNote ? _buyerNoteCopyHtml : ""}
                            </span>
                        </div>
                    </div>`
          },
        },
        {
          headerName: "物流",
          wrapText: true,
          autoHeight: true,
          cellRenderer: data => {
            let d = data.data
            let closeTimeHmtl = `<div><span class="gray">关单：</span>${Format(d.closeTime || "", 'yyyy-MM-dd hh:mm:ss')}<span class="${d.closeTimeDay <4 ? 'plus-red-text':''}">(≤${d.closeTimeDay || '0'})</span></div>`
            return `<div class="alignLeft">
                        <div><span class="gray">买家：</span><span id="toAudit_table_buyerRequireShippingType">${d.buyerRequireShippingType || ""}</span></div>
                        <div><span class="gray">发货：</span><span id="logisTypeName_toAuditOrder">${d.logisTypeName || ""}</span></div>
                        <div>
                          <span class="gray">跟踪号：</span>
                          <span>${d.logisTrackingNo||""}</span>
                          <span onclick="layui.admin.onlyCopyTxt('${d.logisTrackingNo}',event)" style="display: ${d.logisTrackingNo ? 'inline-block':'none'}" class="copy-icon">
                            <svg t="1710754196184" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2392" width="16" height="16"><path d="M768 832q-0.992 54.016-37.504 90.496T640 960H192q-54.016-0.992-90.496-37.504T64 832V384q0.992-54.016 37.504-90.496T192 256v64q-27.008 0.992-44.992 19.008T128 384v448q0.992 27.008 19.008 44.992T192 896h448q27.008-0.992 44.992-19.008T704 832h64zM384 128q-27.008 0.992-44.992 19.008T320 192v448q0.992 27.008 19.008 44.992T384 704h448q27.008-0.992 44.992-19.008T896 640V192q-0.992-27.008-19.008-44.992T832 128H384z m0-64h448q54.016 0.992 90.496 37.504T960 192v448q-0.992 54.016-37.504 90.496T832 768H384q-54.016-0.992-90.496-37.504T256 640V192q0.992-54.016 37.504-90.496T384 64z" p-id="2393" fill="#aaaaaa"></path></svg>
                          </span>
                            <image onclick="okk(${d.id})" src="${ctx}/static/img/print.png" width="20" lay-tips="打印预览"></image>
                        </div>
                        <div><span class="gray">状态：</span>${d.logisticsStatus||""}</div>
                        ${d.closeTime ? closeTimeHmtl : ''}
                    </div>`
          },
        },
        {
          headerName: "平台时间",
          wrapText: true,
          autoHeight: true,
          cellRenderer: data => {
            let d = data.data
            return `<div class="alignLeft">
                        <div><span class="gray">订单：</span><span id="toAudit_table_orderTimeCn">${Format(d.orderTimeCn || "", "yyyy-MM-dd hh:mm:ss")}</span><span class="${d.orderDay>4?'plus-red-text':''}">(${d.orderDay || '0'})</span></div>
            <div><span class="gray">申请：</span><span>${Format(d.logisApplyTime ||"",'yyyy-MM-dd hh:mm:ss')}</span></div>
                        <div><span class="gray">标记：</span><span>${Format(d.markShippingTime || "", "yyyy-MM-dd hh:mm:ss")}</span></div>
                        <div><span class="gray">发货：</span><span>${Format(d.shippingTime || "", "yyyy-MM-dd hh:mm:ss")}</span></div>
                        <div><span class="gray">截止：</span><span>${Format(d.shipByDate || "", "yyyy-MM-dd hh:mm:ss")}</span></div>
                    </div>`
          },
        },
        {
          headerName: "订单处理",
          wrapText: true,
          autoHeight: true,
          cellRenderer: data => {
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
                `<span data-text='${JSON.stringify(d.platOrderNotes)}' onmouseenter="hasbedeliveredBuyerTipsShowTable(this)" onmouseleave="hasbedeliveredBuyerTipsHide(this)">${d.platOrderNotes[noteContentLength - 1].noteType || ""}:${d.platOrderNotes[noteContentLength - 1].noteContent || ""}</span>`;
            }
            const noteTipsHtml = `<span class="hp-badge fr hasBedelivered-noteContent-tag">多</span>`
            let html = `<div class="alignLeft">
                        <div><span class="gray">仓库：</span>${d.warehouseName || ""}</div>
                        <div><span class="gray">批次：</span>${d.batchNo || ""}</div>
                        <div><span class="gray">组包：</span>${d.handoverBatchNo || ""}</div>
                        <div><span class="gray">备注：</span>${recentNoteContent}${(d.platOrderNotes && d.platOrderNotes.length>1) ? noteTipsHtml : ""}</div>
                    </div>`
            return html
          },
        },
        {
          headerName: "仓库处理",
          width: 172,
          wrapText: true,
          autoHeight: true,
          cellRenderer: data => {
            let d = data.data
            return `<div class="alignLeft">
                        <div><span class="gray">批次：</span>${d.batchInfo || ""}</div>
                        <div><span class="gray">配货：</span>${d.pickInfo || ""}</div>
                        <div><span class="gray">投篮：</span>${d.checkInfo || ""}</div>
                        <div><span class="gray">包装：</span>${d.packingInfo || ""}</div>
                        <div><span class="gray">分拣：</span>${d.scanerInfo || ""}</div>
                    </div>`
          },
        },
        {
          field: "操作",
          width: 100,
          wrapText: true,
          autoHeight: true,
          cellRenderer: data => {
            let showDom = $('#hasbedelivered_inputexceptPermTagTable').html();
            return `
				<button name="remark" class="layui-btn layui-btn-xs">备注</button><br>
        ${showDom}`
          },
        },
      ],
      rowData: immutableStore,
      getRowNodeId: function (data) {
        return data.id
      },
      // rowModelType: 'serverSide', // 服务端
      defaultColDef: {
        resizable: true, //是否可以调整列大小，就是拖动改变列大小
      },
      suppressPaginationPanel: true, // 自定义分页
      rowSelection: "multiple", // 设置多行选中
      suppressRowClickSelection: true,
      onGridReady: function (params) {
        hasBedelivered_gridOptions.columnApi.applyColumnState({ state: JSON.parse(window.localStorage.getItem("orderColumnState")) })
        //表格创建完成后执行的事件
        params.api.sizeColumnsToFit() //调整表格大小自适应
      },
      sideBar: {
        toolPanels: [
          {
            id: "columns",
            labelDefault: "Columns",
            labelKey: "columns",
            iconKey: "columns",
            toolPanel: "agColumnsToolPanel",
          },
        ],
      },
      onRowClicked: function (event) {},
      //单击单元格触发的事件
      onCellClicked: function (event) {
        //event.data 选中的行内数据，event.event 为鼠标事件
        handleTableOptions(event)
      },
      onCellMouseDown: function (event) {
        timeStamp = event.event.timeStamp
      },
    }

    // 获取跟踪号
    $('#hasbedelivered_getEdisebay').click(function() {
      hasbedeliveredName.getTableSelectIds("hasbedelivered_tableId").then(data => {
        if (data.length <= 0) {
          layer.msg('请选择订单', { icon: 7 });
          return
        }
        // console.log(data);
        let ids = data.map(item => item.id);
        commonReturnPromise({
          url: '/lms/unauditorder/getlogistrackingno.html',
          type: 'post',
          params: {
            ids: ids.join(',')
          }
        }).then(res => {
          layui.admin.batchResultAlert("获取跟踪号完成:", res, function (errIdsArr) {
            // $('[lay-filter=hasbedeliveredSearch]').click();
            deleteTableRow_hasBedelivered(ids,errIdsArr)
          });
        });
      }).catch(err => {
        layer.msg(err, { icon: 7 });
      });

    });

    var timeStamp

    $(document)
      .off("click", ".waitOrderErrorTipsClose")
      .on("click", ".waitOrderErrorTipsClose", function () {
        $(this).parents(".waitOrderErrorTips").remove()
      })

    var gridDiv = document.querySelector("#hasbedelivered_tableId")
    agGrid.LicenseManager.setLicenseKey("IRDEVELOPERS_COM_NDEwMjM0NTgwMDAwMA==f08aae16269f416fe8d65bbf9396be5f")
    new agGrid.Grid(gridDiv, hasBedelivered_gridOptions)

    function handleTableOptions(event) {
      let optionEvent = event.event.target.name,
        data = event.data // 获取选中行数据

      if (optionEvent == "remark") {
        commonDirectMailRemark(data)
      } else if (optionEvent == 'hasbedelivered_inputexcept') {
        hasbedelivered_inputexceptHandle(data)
      }else if (optionEvent == "copy") {
      }else if(optionEvent === 'logisCost'){
        //物流成本
        commonLogisCostLayerHandle(data.id);
      } else if (event.event.timeStamp - timeStamp < 300) {
        commonOrderDetailFn(data, hasBedelivered_gridOptions)
      }
    }

    //录入异常操作
    function hasbedelivered_inputexceptHandle (data) {
      layer.open({
          type: 1,
          title: '录入异常',
          content: $('#hasbedelivered_inputexceptLayer').html(),
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
                  
                  commonRenderSelect('hasbedelivered_issueCurrency', currencyEnums, {str: ''}).then(() => {
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
                  elem: '#hasbedelivered_inputexcept_table',
                  id: 'hasbedelivered_inputexcept_tableId',
                  data: _data.orderDetails || [],
                  cols: [
                      [
                          { title: '勾选<span class="fRed">*</span>', field:"radio",templet:'#hasbedelivered_inputexcept_table_radio'},
                          { title: "Listing_ID", field: "itemId" },
                          { title: "店铺SKU", field: "storeSSku" },
                          { title: "商品SKU", field: "prodSSku", templet:'#hasbedelivered_inputexcept_table_prodSSku' }, //
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
                elem: '#hasbedelivered_issue_mofidy_dragImg'
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
              }
              // 异常数量不能大于勾选SKU对应的商品数量
              const checkedTr = table.cache.hasbedelivered_inputexcept_tableId.filter(item => item.id == params.radio)
              if( checkedTr[0] && (Number(params.issueNum)>Number(checkedTr[0].allCount)) ) return layer.msg('异常数量不能大于勾选SKU对应的商品数量')
              let keyList = Object.keys(params)
              keyList.forEach(item=>{
                  if(item==='radio'){
                      delete params.radio
                  }else if(item.includes('prodSSku_')){
                      delete params[item]
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

    hasbedeliveredBuyerTipsShow = function (dom) {
      const contentshow = $(dom).attr("data-text")
      if (contentshow) {
        layui.layer.tips(`<span style="color:#008B8B">${contentshow}</span>`, $(dom), {
          tips: [1, "#fff"],
          time: 0,
        })
      }
    }
    hasbedeliveredBuyerTipsShowTable = function (dom) {
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
    hasbedeliveredBuyerTipsHide = function () {
      layui.layer.closeAll("tips")
    }
    hasbedeliveredOrderProfitTipsShow = function(dom){
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
    hasbedeliveredOrderProfitTipsHide = function(){
      layui.layer.closeAll("tips");
    }
  })
})(jQuery, layui, window, document)
