(function ($, layui, window, document, undefined) {
  layui.use(
    [
      "admin",
      "table",
      "form",
      "element",
      "layer",
      "laytpl",
      "formSelects",
      "upload",
      "laydate",
    ],
    function () {
      var admin = layui.admin,
        table = layui.table,
        element = layui.element,
        layer = layui.layer,
        laytpl = layui.laytpl,
        laypage = layui.laypage,
        upload = layui.upload,
        laydate = layui.laydate,
        formSelects = layui.formSelects,
        form = layui.form;
      form.render();
      let logisCompanysArr = [];
      var operatorName = $("#lmsUsername").text();
      formSelects.render("waittopack_platOrderStatusList", {
        placeholder: "请先选择平台",
      });
      formSelects.render("waittopack_store", { placeholder: "请先选择平台" });
      //渲染平台标记
      waittopack_renderPlatCodeMark();
      function waittopack_renderPlatCodeMark() {
        commonReturnPromise({
          url: "/lms/unauditorder/listenum.html",
        }).then((res) => {
          let { platTagList } = res;
          commonRenderSelect("waittopack_platTags", platTagList).then(() => {
            formSelects.render("waittopack_platTags");
          });
          //渲染tab
          let $tabUl = $('#waittopacktoInterceptTabs>ul');
          let $selctedVal = $('#waittopackForm [name=logisApplySearchStatus]').val();
          let str = '';
          if(res.logisApplySearchStatusMaps){
            for(let i=0; i< res.logisApplySearchStatusMaps.length; i++){
              let item = res.logisApplySearchStatusMaps[i];
              let name = item.name;
              let value = item.value;
              if($selctedVal === name){//选中项,需要加layui-this
                str += `<li class="layui-this" data-index="${name}">${value}(<span></span>)</li>`;
              }else{
                str += `<li data-index="${name}">${value}(<span></span>)</li>`;
              }
            }
          }
          $tabUl.empty().append(str);
        });
      }

      // 模板查询赋值
      commonSaveSearchTpl({
        id: "waittopack_save",
        formId: "waittopackForm",
        pageName: "auditDespathOrder_waittopack",
        searchBtnId: "waittopackSearch",
        cb: param => waittopack_formVal(param),
      })

      function waittopack_formVal(param) {
        let $formDom = $("#waittopackForm")
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
            formSelects.data("waittopack_storeAcct", "local", { arr })
            const acctIds = res.map(item=>item.id).join(',')
            $('#waittopackForm').find(`select[_name=storeAcctIds]`).attr('acct_ids',acctIds)
            // 给表单赋值
            form.val("waittopackForm", param)
            // 更多查询条件是否有值
            waittopackName.hasValue()
            // 多选的 name: xm-select
            let multiSelectObj = {
              salePersonId: "waittopack_salePersonsSelect",
              prodLogisAttrs: "waittopack_logisAttrs",
              platOrderStatusList: "waittopack_platOrderStatusList",
              shippingCountryCodes: "waittopack_shippingCountrys",
              platTags: "waittopack_platTags",
              company: 'xm_waittopack_company',
              logisTypeIds: "xm_waittopack_logisTypeIds",
              orderLabels: "waittopack_orderLabels",
            }
            Object.keys(multiSelectObj).forEach(item => {
              if (param[item]) {
                formSelects.value(multiSelectObj[item], param[item].split(","), true)
              } else {
                formSelects.render(multiSelectObj[item])
              }
            })
            // 执行搜索
            $('#waittopackSearch').click()
          })
        }, timeStamp)

        // 页签
        if(param.processStatus){
          const tabStatusObj = {
            120:0, //未拣货120
            125:1, //未核单125
            130:2, //未包装130
            135:3, //仓库缺货135
            136:4, //仓库截单136
          };
          $('#waittopack_tabs').find('li').each(function(index){
              if(index == tabStatusObj[param.processStatus]){
                  $(this).addClass('layui-this')
              }else{
                  $(this).removeClass('layui-this')
              }
          })
        }

        if (param.agentCompany) {
          $formDom.find("select[name=agentCompany]").next().find(`dd[lay-value="${param.agentCompany}"]`).trigger("click")
        }
        if (param.logisticsCompanyId) {
          $formDom.find("select[name=logisticsCompanyId]").next().find(`dd[lay-value="${param.logisticsCompanyId}"]`).trigger("click")
        }
      }

      //监听仓库拦截单下的tab切换[ztt20230824]
      element.on("tab(waittopacktoInterceptTabs)", function (data) {
        let currentStatus = data.elem.context.dataset.index;
        $('#waittopackForm [name=logisApplySearchStatus]').val(currentStatus);
        //触发重新请求事件[独立于原来的按钮搜索]
        waittopacktoInterceptFormRender();
        if(currentStatus == 5 || currentStatus == -1 || currentStatus == 4){
          $('#waittopack_getEdisebay').removeClass('disN');
        }else{
          $('#waittopack_getEdisebay').addClass('disN');
        }
      });
      //独立请求渲染表格数据
      function waittopacktoInterceptFormRender(){
        let formData = serializeObject($('#waittopackForm'));
        let obj = waittopackName.dataHandle(formData);
        if(obj.storeAcctIds == 0){
          obj.storeAcctIds = '';
        }
        //请求接口
        commonReturnPromiseRes({
          url: ctx + "/pickpackorder/listorder.html",
          type: "POST",
          params: obj,
        }).then(res => {
          //渲染tab
          $('#waittopacktoInterceptTabs>ul').find('li>span').text('');
          $('#waittopacktoInterceptTabs>ul').find('li.layui-this>span').text(res.count);
          //渲染表格
          // 商品种类||数量
          let skuQuantity = 0,
          prodQuantity = 0;
          if (res.count != 0) {
            res.data.forEach((item) => {
              skuQuantity = skuQuantity + item.skuQuantity * 1;
              prodQuantity = prodQuantity + item.prodQuantity * 1;
            });
            $("#waittopack_tableId")
              .find("[col-id=3] .ag-header-cell-text")
              .text(`商品 种类${skuQuantity} || 数量${prodQuantity}`);
            immutableStore = res.data;
            waittopack_gridOptions.api.setRowData(immutableStore);
          } else {
            $("#waittopack_tableId")
              .find("[col-id=3] .ag-header-cell-text")
              .text(`商品 种类0 || 数量0`);
            immutableStore = [];
            waittopack_gridOptions.api.setRowData(immutableStore);
          }
          //渲染分页
          waittopackName.waittopackdPage(obj, res.count);
        });
      }

      //ztt20230830-换单/拆单包装
      $('#waittopackage_dismantleBtn').on('click', function(){
        layer.open({
          type: 1,
          title: '换单/拆单包装',
          area: ['90%', '70%'],
          content: $('#waittopackage_dismantleLayer').html(),
          id: 'waittopackage_dismantleLayerId',
          success: function(layero, index){
            form.render('checkbox');
            //input回车事件
            layero.find('.layui-form-item').on('keypress', 'input', function(e){
              if(e.keyCode == 13){
                layero.find('.search').trigger('click');
              }
            });
            //20231204-监听复选框点击事件,仅允许选择一个[点击单个可以关闭选中]
            form.on('checkbox(dismantleCheckboxsItem)', function(obj){
              let checkboxElem = obj.elem;
              let checkboxName = checkboxElem.name;
              $(checkboxElem).parents('.dismantleCheckboxs').find(`:not(input[name=${checkboxName}])`).prop('checked', false);
              form.render('checkbox');
            });
            //查询事件
            layero.find('.search').on('click', function(){
              let trackNo = layero.find('[name=trackNo]').val().trim();
              let orderId = layero.find('[name=orderId]').val().trim();
              let platOrderId = layero.find('[name=platOrderId]').val().trim();
              let isPrint = layero.find('[name=print]').is(':checked');
              let isPrintSku = layero.find('[name=printSku]').is(':checked');
              commonReturnPromise({
                url: '/lms/pickpackorder/getChangeOrSplitOrderInfo.html',
                type: 'post',
                params: {
                  trackNo: trackNo,
                  orderId: orderId,
                  platOrderId: platOrderId
                }
              }).then(res => {
                //渲染店铺单号以及标签:拆
                let platOrderIdNum = res.platOrderId;
                let splitDom = res.operOrderType ? '<span class="layui-badge layui-bg-blue">' + res.operOrderType + '</span>' : '';
                let htmlStr = platOrderIdNum + splitDom;
                layero.find('.storeOrderNum').html(htmlStr);
                //渲染表格相关
                let orderInfoList = res.orderInfoList;
                let str = '';
                for(let i=0; i<orderInfoList.length; i++){
                  let item = orderInfoList[i];
                  let dtList = item.dtList;
                  let imgDom = waittopackage_dismantleImgHandle(dtList);
                  let trStr = `
                    <tr>
                      <td>${item.logisTrackingNo || ''}</td>
                      <td class="orderId">${item.id}</td>
                      <td>${item.processStatusStr}</td>
                      <td>${imgDom}</td>
                      <td>
                          <input type="hidden" value="${item.preWeight || ''}" name="hideWeight">
                          <input class="layui-input" value="" name="weight">
                      </td>
                    </tr>
                  `;
                  str += trStr;
                }
                layero.find('#waittopackage_dismantleLayerTbody').empty().append(str);
                layero.find('#waittopackage_dismantleLayerTbody tr:first-child input[name=weight]').focus().select();
                //是否打印订单[不打印SKU]
                if(isPrint){
                  $.ajax({
                    type: "POST",
                    url: ctx + "/logistics/batch/print.html",
                    data: { orderIdStr: res.orderIdStr },
                    beforeSend: function () {
                        loading.show();
                    },
                    success: function (returnData) {
                        loading.hide();
                        var paramsMapList = returnData.successResults;
                        if (paramsMapList && paramsMapList.length > 0) {
                            for (let j = 0; j < paramsMapList.length; j++) {
                                let item = paramsMapList[j];
                                let obj = {};
                                obj.printType = 19;
                                obj.labelUrl = item.ftpLabelUrl;
                                obj.width = item.width;
                                obj.height = item.height;
                                obj.printName = '100100';
                                if (obj.height === 150) {
                                    obj.printName = '100150'
                                }
                                logistics_label_pdf_print(obj);
                            }
                        }
                        if(returnData.failResults && returnData.failResults.length > 0){
                            let str = '';
                            returnData.failResults.forEach(item => {
                                str += item + "<br>"
                            })
                            layer.alert(str,{icon:2})
                        }
                    }, 
                    error: function (err) {
                        loading.hide();
                        console.log(err)
                    }
                })
                }else if(isPrintSku){
                  let orderIdStr = orderInfoList.map(item => item.id).join(',');
                  commonReturnPromise({
                    url: `/lms/logistics/v1/batch/print/skuInfoAndLogistics`,
                    type: 'post',
                    params: {
                      orderIdStr: orderIdStr
                    }
                  }).then(async (returnData) => {
                    function orderDataPrint(inntObj, sku) {
                      let obj = {};
                      obj.printType = 19;
                      obj.labelUrl = inntObj.ftpLabelUrl;
                      obj.width = inntObj.width;
                      obj.height = inntObj.height;
                      obj.printName = "100100";
                      if (obj.height === 150) {
                        obj.printName = "100150";
                      }
                      return obj;
                    }
  
                    var resultSheet = returnData.successResults;
                    let resultDataArr = [],
                      countIndex = 0;
                    if (resultSheet && resultSheet.length > 0) {
                      for (var j = 0; j < resultSheet.length; j++) {
                        let resultDataObjOne = orderDataPrint(resultSheet[j]);
                        resultDataArr.push(resultDataObjOne);
                      }
                    }
                    if (
                      returnData.failResults &&
                      returnData.failResults.length > 0
                    ) {
                      let str = "";
                      returnData.failResults.forEach((item) => {
                        str += item.orderId + ": " + item.ftpLabelUrl + "<br>";
                      });
                      layer.alert(str, { icon: 2 });
                    }
                    let timeset;
                    timeset = window.setInterval(function () {
                      if (countIndex >= resultDataArr.length) {
                        window.clearInterval(timeset);
                      } else {
                        logistics_label_pdf_print(resultDataArr[countIndex]);
                      }
                      countIndex++;
                    }, 500);
                  });
                }
              });
            });
            //重量更改监测
            layero.find('#waittopackage_dismantleLayerTbody').on("keypress", "[name=weight]",_.debounce(function (e) {
              if (e.keyCode == 13) {
                let orderId = $(e.target).parents('tr').find('.orderId').text();
                let preWeight = $(e.target).parents('td').find('[name=hideWeight]').val().trim();
                let val = e.target.value.trim(); //称重的重量
                if(!val){
                  return layer.msg('称重重量不能为空', {icon:2});
                }
                commonReturnPromise({
                  url: '/lms/order/package/multi/update.html',
                  type: 'post',
                  contentType: 'application/json',
                  params: JSON.stringify({
                    orderId: orderId,
                    preWeight: preWeight,
                    realPackWeight: val,
                  })
                }).then(res => {
                  //回到跟踪号栏
                  layero.find('[name=trackNo]').focus().select();
                }).catch(err => {
                  layer.alert(err, {icon: 2});
                  $(e.target).blur();
                });
              }
            },500));
          }
        })
      });
      //ztt20230830-换单/拆单包装---图片处理
      function waittopackage_dismantleImgHandle(data){
        let str = '';
        for(let i=0; i< data.length; i++){
          let item = data[i];
          let sku = item.dealStoreSSku;
          let num = item.prodQuantity;
          let imageUrl = item.imageUrl;
          let liDom = `
            <li style="width:150px;margin:5px;">
              <div>
                <img width="120" height="120" src="${imageUrl||''}" class="img_show_hide b1 lazy" onerror="layui.admin.img_noFind()">
              </div>
              <span>${sku} * <font color="red" size="4"><b>${num}</b></font></sapn>
            <li>
          `;
          str += liDom;
        }
        let ulDom = '<ul style="display: flex;flex-wrap: wrap;">' + str + '</ul>';
        return ulDom;
      }


      // 前端删除行，删除后不刷新表格
      function deleteTableRow_waittopack(ids,errIdsArr){
        zttCommonRemoveDataHandle({
          selectedIds: ids,
          gridOptions: waittopack_gridOptions,
          tableData: immutableStore,
          errIds: errIdsArr,
        }).then((newObj) => {
          let { newData, successIds } = newObj;
          // immutableStore = newData;
          let oldNum = $("#waittopack_tabs ul li.layui-this>span").text();
          let newNum = oldNum - successIds.length;
          $("#waittopack_tabs ul li.layui-this>span").text(newNum);
          $("#waittopackdPage .layui-laypage-count").text(`共 ${newNum} 条`);
        });
      }
      // 前端更新行，更新后不刷新表格
      function updateTableRow_waittopack(ids,errIdsArr){
        zttCommonUpdataDataHandle({
          selectedIds: ids,
          errIds: errIdsArr
        }).then(newObj => {
          // 修改成功的数据
          let { successIds } = newObj;
          if(successIds.length != 0){
            // 选中的数据
            let checkStatus = waittopack_gridOptions.api.getSelectedRows();
            let newCheckStatus = deepCopy(checkStatus)
            commonReturnPromiseRes({
              url: ctx + '/pickpackorder/listorder.html',
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
              waittopack_gridOptions.api.updateRowData({ update: newCheckStatus });
            })
          }
        });
      }
      // document.onkeydown = function (e) {
      //     e = e ? e : event;
      //     if(e.keyCode == 13 || e.which ==13){ // 回车键
      //         $('[lay-filter="waittopackSearch"]').trigger('click');
      //     }
      // }
      $("#waittopackForm").on("keyup", "input", function (e) {
        if (e.keyCode == 13) {
          // 回车键
          $(this).select();
          $('[lay-filter="waittopackSearch"]').trigger("click");
        }
      });

      form.on("submit(waittopack_export)", function (data) {
        let ids = getTableSelectIds();
        if (!ids || ids.length < 1) {
          layer.msg("请选择订单", { icon: 7 });
          return;
        }
        // layer.confirm('导出选择的订单？', function(result) {
        //     if (result) {
        let param = {};
        param.orderIds = ids.join(",");
        submitForm(param, ctx + "/platorder/exportorder.html", "_blank");
        layer.closeAll();
        //     }
        // });
      });
      $("#waittopackDetail_export").on("click", function () {
        let ids = getTableSelectIds();
        if (!ids || ids.length < 1) {
          layer.msg("请选择订单", { icon: 7 });
          return;
        }
        // layer.confirm('导出选择的订单明细？', function(result) {
        //     if (result) {
        let param = {};
        param.orderIds = ids.join(",");
        submitForm(param, ctx + "/platorder/exportorderdetail.html", "_blank");
        layer.closeAll();
        //     }
        // });
      });
      form.on("select(waittopack_pickBatchNo)", function (data) {
        $("#enterpickBatchNor").val(data.value);
      });
      //订单处理
      new dropButton("waittopackage_orderHandle");
      //平台操作
      new dropButton("waittopackage_platOperate");
      //打印
      new dropButton("waittopackage_printOperate");
      //页面操作事件end
      function getTableSelectIds() {
        let data = waittopack_gridOptions.api.getSelectedRows();
        let ids = (data || []).map(function (item) {
          return item.id;
        });
        return ids;
      }

      //#region 物流事件-ztt20230824
      new dropButton("waittopack_logis");
      //匹配物流
      $('#waittopack_matchLogis').click(function () {
        let ids = getTableSelectIds();
        if (!ids || ids.length < 1) {
            layer.msg('请选择订单', { icon: 7 });
            return;
        }
        initAjax('/unauditorder/matchlogistype.html', 'post', { ids: ids.join(',') }, function (returnData) {
            layui.admin.batchResultAlert("匹配物流完成:", returnData.data, function (errIdsArr) {
              updateTableRow_waittopack(ids,errIdsArr);
            });
        }, 'application/x-www-form-urlencoded')
      });
      //手动指定物流
      $('#waittopack_updatelogistype').click(function() {
        var ids = getTableSelectIds();
        if (ids.length <= 0) {
            layer.msg('请选择订单', { icon: 7 });
            return;
        }
        layer.open({
            type: 1,
            title: '手动指定物流',
            btn: ['确认', '取消'],
            area: ['40%', '60%'],
            content: "loading",
            success: function(layero, index) {
                $(layero).find('.layui-layer-content').html($("#waittopack_updateLogisTypeTpl").html());
                //初始化物流公司
                commonRenderSelect('waittopack_logisCompany', logisCompanysArr, {name: 'cnName', code: 'id'}).then(()=>{
                  form.render('select');
                })
                //初始化物流方式
                commonOrderGetLogisticAjax().then(res => {
                  commonRenderSelect('waittopack_logisType', res, {name: 'name', code: 'id'}).then(()=>{
                    form.render('select');
                  })
                });
                //物流公司改变触发
                form.on('select(waittopack_logisCompany)', function(obj) {
                    var logisticsCompanyId = obj.value;
                    commonOrderGetLogisticAjax({logisticsCompanyId: logisticsCompanyId}).then(logisTypeArr => {
                      commonRenderSelect('waittopack_logisType', logisTypeArr, {name: 'name', code: 'id'}).then(()=>{
                        form.render('select');
                      })
                    });
                })
            },
            yes: function(index, layero) {
                var logisTypeId = $("#waittopack_updateLogisTypeForm select[name=logisType]").val();
                if (!logisTypeId) {
                    layer.msg("未选择物流方式", { icon: 7 });
                    return;
                }
                //指定物流方式
                initAjax('/unauditorder/updatelogistype.html', 'post', {
                    ids: ids.join(','),
                    logisTypeId: logisTypeId
                }, function(returnData) {
                    layui.admin.batchResultAlert("手动指定物流:", returnData.data, function(errIdsArr) {
                      updateTableRow_waittopack(ids,errIdsArr)
                      layer.close(index);
                    });
                }, 'application/x-www-form-urlencoded')
            }
        });
      });
      //申请跟踪号
      $('#waittopack_applylogisno').click(function () {
          var ids = getTableSelectIds();
          if (ids.length <= 0) {
              layer.msg('请选择订单', { icon: 7 });
              return
          }
          zttCommonProgressBar({ type: 9, ids: ids.join(',') }, function (progressData) {
              let returnData = { data: progressData };
              layui.admin.batchResultAlert("申请跟踪号:", returnData.data, function (errIdsArr) {
                  // 申请失败的数据，除已申请过跟踪号，其它的均删除当前行,数据会转到申请失败页签
                  returnData.data.failResults.forEach(item=>{
                      if(!item.includes('已申请过跟踪号')&&item.includes('[')&&item.includes(']')){
                          let item1 = item.split("[")[1];
                          let id = item1.split("]")[0];
                          // errIdsArr = await errIdsArr.filter(item => item == id)
                          errIdsArr.forEach((cItem,index) => {
                              if(cItem == id){
                                  errIdsArr.splice(index,1)
                              }
                          })
                      }
                  })
                  deleteTableRow_waittopack(ids,errIdsArr)
              });
          });
      });
      //清空跟踪号
      $('#waittopack_removelogisno').click(function() {
          var ids = getTableSelectIds();
          if (ids.length <= 0) {
              layer.msg('请选择订单', { icon: 7 });
              return
          }
          commonOrderConfirmLayer(ids.length, function (index) {
              initAjax('/unauditorder/removelogistrackingno.html', 'post', { ids: ids.join(',') }, function(returnData) {
                  layer.close(index);
                  deleteTableRow_waittopack(ids,[])
              }, 'application/x-www-form-urlencoded');
          })
      });
      //取消wishpost订单
      $('#waittopack_cancelwishpost').click(function() {
          var ids = getTableSelectIds();
          if (ids.length <= 0) {
              layer.msg('请选择订单', { icon: 7 });
              return
          }
          layer.open({
              type: 1,
              title: `取消wishpost订单数: <font color="red" size="5">${ids.length}</font>`,
              btn: ['确认', '取消'],
              area: ['40%', '60%'],
              content: "loading",
              success: function(layero, index) {
                  $(layero).find('.layui-layer-content').html($("#waittopack_cancelWishpostTpl").html());
                  layui.form.render();
              },
              yes: function(index, layero) {
                  var cancelReasonCode = $("#waittopack_cancelWishpostForm select[name=cancelReasonCode]").val();
                  var invalidReason = $("#waittopack_cancelWishpostForm input[name=invalidReason]").val();
                  //取消wishpost物流单
                  initAjax('/platorder/cancelwishpost.html', 'post', {
                      ids: ids.join(','),
                      cancelReasonCode: cancelReasonCode,
                      invalidReason: invalidReason
                  }, function(returnData) {
                      layui.admin.batchResultAlert("取消wishpost订单:", returnData.data, function(errIdsArr) {
                          deleteTableRow_waittopack(ids,errIdsArr)
                      });
                  }, 'application/x-www-form-urlencoded')
              }
          })
      });
      //取消橙联订单
      $('#waittopack_cancelEdisebay').click(function() {
        var ids = getTableSelectIds();
        if (ids.length <= 0) {
            layer.msg('请选择订单', { icon: 7 });
            return
        }
        commonOrderConfirmLayer(ids.length, function (index) {
            initAjax('/platorder/cancelEdisebay.html', 'post', { ids: ids.join(',') }, function (returnData) {
                layer.close(index);
                layui.admin.batchResultAlert("取消Edisebay订单:", returnData.data, function(errIdsArr) {
                    deleteTableRow_waittopack(ids,errIdsArr)
                });
            }, 'application/x-www-form-urlencoded');
        });
      });
      // 获取跟踪号
      $('#waittopack_getEdisebay').click(function() {
        var ids = getTableSelectIds();
        if (ids.length <= 0) {
            layer.msg('请选择订单', { icon: 7 });
            return
        }
        initAjax('/unauditorder/getlogistrackingno.html', 'post', {
            ids: ids.join(',')
        }, function(returnData) {
            layui.admin.batchResultAlert("获取跟踪号完成:", returnData.data, function(errIdsArr) {
                deleteTableRow_waittopack(ids,errIdsArr)
            });
        }, 'application/x-www-form-urlencoded')
      });
      //修改跟踪号
      $('#waittopack_editTrackingNo').on('click', function () {
          let data = waittopack_gridOptions.api.getSelectedRows();
          if (data.length == 0) {
              return layer.msg('请先选择数据', { icon: 7 });
          }
          if (data.length > 1) {
              return layer.msg('请选择一条数据', { icon: 7 });
          }
          let info = data[0];
          layer.open({
              type: 1,
              title: `修改跟踪号-${info.id}`,
              area: ['50%', '50%'],
              btn: ['修改', '取消'],
              content: $('#waittopack_editTrackingNoLayer').html(),
              id: 'waittopack_editTrackingNoLayerId',
              success: function (layero) {
                  let getTpl = waittopack_editTrackingNoFormTpl.innerHTML;
                  let getUl = document.getElementById('waittopack_editTrackingNoForm');
                  laytpl(getTpl).render(info, function(html){ //渲染到表格
                      getUl.innerHTML = html;
                  });
                  //监听input失去焦点
                  layero.find('input[name=logisTrackingNo]').on('blur', function (e) {
                      let val = e.target.value;
                      e.target.value = val.replaceAll(" ", "");
                  });
              },
              yes: function (index, layero) {
                  let obj = {};
                  obj.id = layero.find('input[name=id]').val();
                  obj.logisTrackingNo = layero.find('input[name=logisTrackingNo]').val().trim();
                  obj.logisAgentTrackingNo = layero.find('input[name=logisAgentTrackingNo]').val().trim();
                  if (!obj.logisTrackingNo) {
                      return layer.msg('请填写跟踪号', { icon: 1 });
                  }
                  commonReturnPromise({
                      url: '/lms/undispatch/updateLogisTrackingNo.html',
                      type: 'post',
                      contentType: 'application/json',
                      params: JSON.stringify(obj)
                  }).then(res => {
                      layer.close(index);
                      layer.msg(res || '操作成功', { icon: 1 });
                      let ids = data.map(item => item.id)
                      updateTableRow_waittopack(ids,[])
                  })
              }

          });
      });
      //#endregion

      //导出功能
      componentForOrderDownload('waittopack_exportTemplate', function(){
        let data = waittopack_gridOptions.api.getSelectedRows();
        let idsArr = data.map(function (item) {
          return item.id;
        });
        return idsArr;
      });

      var waitToPack_pageNum;
      var waittopackName = {
        getTablesSelectId() {
          return new Promise(function (resolve, reject) {
            let data = waittopack_gridOptions.api.getSelectedRows();
            if (!data.length) {
              reject("请先选中一条数据");
            }
            resolve(data);
          });
        },
        //----搜索条件相关渲染和处理start
        //更多查询条件处理
        moreHandle: function () {
          let _this = this;
          $("#showMoreSearchCondition_waittopack").click(function () {
            var self = this;
            if ($(self).hasClass("showExternal")) {
              $(self)
                .closest(".layui-form")
                .find(".externalContainAuditorder")
                .hide();
              $("#hide_icon_waittopack").show();
              $("#show_icon_waittopack").hide();
              $(self).removeClass("showExternal");
              //被隐藏了,执行判断逻辑
              _this.hasValue();
            } else {
              $(self)
                .closest(".layui-form")
                .find(".externalContainAuditorder")
                .show();
              $("#hide_icon_waittopack").hide();
              $("#show_icon_waittopack").show();
              $(self).addClass("showExternal");
            }
          });
        },
        hasValue: function () {
          let inputs = $("#waittopackForm .externalPopAuditorder").find(
            "input"
          );
          let count = 0;
          let showDom = $("#showMoreSearchCondition_waittopack .hasValue");
          for (let i = 0; i < inputs.length; i++) {
            let item = inputs[i];
            let val = $(item).val();
            if (val && val != "请选择") {
              count++;
            }
          }
          if (count > 0) {
            showDom.html('<font color="red">(有值)</font>');
          } else {
            showDom.html("");
          }
        },
        //设置弹框的头部展示登录人名称
        setLayerHeaderShowName: function (layero) {
          layero
            .find(".layui-layer-title")
            .append(
              `<div class="waittopack_titleShowName">操作人:${operatorName}</div>`
            );
        },
        setLayerHeaderStatistics: function (layero, currNum, total) {
          if (layero.find(".waittopack_titleStatistics").length) {
            layero
              .find(".waittopack_titleStatistics")
              .text(`完成/总计:${currNum}/${total}`);
          } else {
            layero
              .find(".layui-layer-title")
              .append(
                `<div class="waittopack_titleStatistics">完成/总计:${currNum}/${total}</div>`
              );
          }
        },
        computedTotalAndCurrNum: function (layero) {
          var newHandledTrLen = layero.find(
            "#distributeContainer_tableTbody tr.handledTr"
          ).length;
          var totalNumArr = layero
            .find(".waittopack_titleStatistics")
            .text()
            .split("/");
          var totalNum = totalNumArr[totalNumArr.length - 1];
          return [newHandledTrLen, totalNum];
        },
        //错误的信息警告
        errorVoiceWarning: function () {
          $("#waittopack_audioplay")[0].play();
        },
        //下拉按钮事件汇总
        dropdownHandle: function () {
          var _this = this;
          let commonHandle6Function = function (){
            _this
              .getTablesSelectId()
              .then(function (res) {
                var idsArr = res.map(function (item) {
                  return item.id;
                });
                var tab = $("#waittopackForm")
                  .find("[name=processStatus]")
                  .val();
                var obj = {
                  120: "/lms/pickpackorder/markpicked.html", //未拣货120
                  125: "/lms/pickpackorder/markchecked.html", //未核单125
                  130: "/lms/pickpackorder/markpacked.html", //未包装130
                  135: "/lms/pickpackorder/markundispatch.html", //仓库缺货135
                  136: "/lms/undispatch/toUnShipped.html" //仓库截单136
                };
                commonOrderConfirmLayer(idsArr.length, function (index) {
                  if(tab==136){
                    commCheckLogisticsCloseTime(idsArr, function(idList){
                      commonReturnPromise({
                        url: obj[tab],
                        type: "post",
                        params: {
                          ids: idList.join(),
                        },
                      })
                        .then(function (result) {
                          layer.close(index);
                            layui.admin.batchResultAlert(
                              "转至代发货完成:",
                              result,
                              function () {
                                $('[lay-filter="waittopackSearch"]').trigger('click');
                              }
                            );
                        })
                        .catch(function (resErr) {
                          layer.msg(resErr.message || resErr, { icon: 2 });
                        });
                    })
                  }else{
                    commonReturnPromise({
                      url: obj[tab],
                      type: "post",
                      params: {
                        ids: idsArr.join(),
                      },
                    })
                      .then(function (result) {
                        layer.close(index);
                        // 根据接口展示具体操作结果
                        layer.msg(result || "设置成功", { icon: 1 });
                        deleteTableRow_waittopack(idsArr,[])
                          // zttCommonRemoveDataHandle({
                          //   selectedIds: idsArr,
                          //   gridOptions: waittopack_gridOptions,
                          //   tableData: immutableStore,
                          //   errIds: [],
                          // }).then((newObj) => {
                          //   let { newData, successIds } = newObj;
                          //   immutableStore = newData;
                          //   let oldNum = $(
                          //     "#waittopack_tabs ul li.layui-this>span"
                          //   ).text();
                          //   let newNum = oldNum - successIds.length;
                          //   $("#waittopack_tabs ul li.layui-this>span").text(
                          //     newNum
                          //   );
                          //   $("#waittopackdPage .layui-laypage-count").text(
                          //     `共 ${newNum} 条`
                          //   );
                          // });
                        // $('[lay-filter="waittopackSearch"]').trigger('click');
                        // let removeTable = waittopack_gridOptions.api.getSelectedRows();
                        // waittopack_gridOptions.api.updateRowData({ remove: removeTable })
                        // let count = $('#waittopack_tabs').find('.layui-this span').text()
                        // count = count.substring(1, count.length-1)
                        // $('.layui-laypage-count').text(`共 ${count - removeTable.length} 条`)
                        // $('#waittopack_tabs').find('.layui-this span').text(`(${count - removeTable.length})`)
                      })
                      .catch(function (resErr) {
                        layer.msg(resErr.message || resErr, { icon: 2 });
                      });
                  }
                });
              })
              .catch(function (err) {
                layer.msg(err, { icon: 2 });
              });
          }
          //拣货完成
          $("#waittopackage_pickCompleteLi").on("click", function () {
            commonHandle6Function();
          });
          for(let i=2; i<6; i++){
            $(`#waittopackage_pickCompleteLi${i}`).on('click', function(){
              commonHandle6Function();
            });
          }
          //驳回订单[转待审核]
          $("#waittopackage_rejectLi").on("click", function () {
            _this
              .getTablesSelectId()
              .then(function (res) {
                var idsArr = res.map(function (item) {
                  return item.id;
                });
                commonOrderConfirmLayer(idsArr.length, function (index) {
                  commonReturnPromise({
                    url: "/lms/abnormalorder/toaudit.html",
                    type: "post",
                    params: {
                      ids: idsArr.join(),
                    },
                  })
                    .then(function (result) {
                      layer.close(index);
                      layui.admin.batchResultAlert(
                        "驳回订单完成:",
                        result,
                        function (errIdsArr) {
                          deleteTableRow_waittopack(idsArr,errIdsArr)
                          // zttCommonRemoveDataHandle({
                          //   selectedIds: idsArr,
                          //   gridOptions: waittopack_gridOptions,
                          //   tableData: immutableStore,
                          //   errIds: errIdsArr,
                          // }).then((newObj) => {
                          //   let { newData, successIds } = newObj;
                          //   immutableStore = newData;
                          //   let oldNum = $(
                          //     "#waittopack_tabs ul li.layui-this>span"
                          //   ).text();
                          //   let newNum = oldNum - successIds.length;
                          //   $("#waittopack_tabs ul li.layui-this>span").text(
                          //     newNum
                          //   );
                          //   $("#waittopackdPage .layui-laypage-count").text(
                          //     `共 ${newNum} 条`
                          //   );
                          // });
                          // $('[lay-filter="waittopackSearch"]').trigger('click');
                          // waittopackName.getSuccessRemove(result, 'waittopack_table', '驳回订单')
                        }
                      );
                    })
                    .catch(function (resErr) {
                      layer.msg(resErr.message, { icon: 2 });
                    });
                });
              })
              .catch(function (err) {
                layer.msg(err, { icon: 2 });
              });
          });
          //标记异常
          $("#waittopackage_markLi").on("click", function () {
            _this
              .getTablesSelectId()
              .then(function (res) {
                var idsArr = res.map(function (item) {
                  return item.id;
                });
                commonOrderConfirmLayer(idsArr.length, function (index) {
                  commonReturnPromise({
                    url: "/lms/unauditorder/markabnormal.html",
                    type: "post",
                    params: {
                      ids: idsArr.join(),
                    },
                  })
                    .then(function (result) {
                      layer.close(index);
                      layui.admin.batchResultAlert(
                        "标记异常完成:",
                        result,
                        function (errIdsArr) {
                          deleteTableRow_waittopack(idsArr,errIdsArr)
                          // zttCommonRemoveDataHandle({
                          //   selectedIds: idsArr,
                          //   gridOptions: waittopack_gridOptions,
                          //   tableData: immutableStore,
                          //   errIds: errIdsArr,
                          // }).then((newObj) => {
                          //   let { newData, successIds } = newObj;
                          //   immutableStore = newData;
                          //   let oldNum = $(
                          //     "#waittopack_tabs ul li.layui-this>span"
                          //   ).text();
                          //   let newNum = oldNum - successIds.length;
                          //   $("#waittopack_tabs ul li.layui-this>span").text(
                          //     newNum
                          //   );
                          //   $("#waittopackdPage .layui-laypage-count").text(
                          //     `共 ${newNum} 条`
                          //   );
                          // });
                          // $('[lay-filter="waittopackSearch"]').trigger('click');
                          // waittopackName.getSuccessRemove(result, 'waittopack_table', '标记异常')
                        }
                      );
                    })
                    .catch(function (resErr) {
                      layer.msg(resErr.message, { icon: 2 });
                    });
                });
              })
              .catch(function (err) {
                layer.msg(err, { icon: 2 });
              });
          });
          //取消订单
          $("#waittopackage_cancelLi").on("click", function () {
            _this
              .getTablesSelectId()
              .then(function (res) {
                var idsArr = res.map(function (item) {
                  return item.id;
                });
                commonOrderConfirmLayer(idsArr.length, function (index) {
                  commonReturnPromise({
                    url: "/lms/abnormalorder/tocancel.html",
                    type: "post",
                    params: {
                      ids: idsArr.join(),
                    },
                  })
                    .then(function (result) {
                      layer.close(index);
                      layui.admin.batchResultAlert(
                        "取消订单完成:",
                        result,
                        function (errIdsArr) {
                          deleteTableRow_waittopack(idsArr,errIdsArr)
                          // zttCommonRemoveDataHandle({
                          //   selectedIds: idsArr,
                          //   gridOptions: waittopack_gridOptions,
                          //   tableData: immutableStore,
                          //   errIds: errIdsArr,
                          // }).then((newObj) => {
                          //   let { newData, successIds } = newObj;
                          //   immutableStore = newData;
                          //   let oldNum = $(
                          //     "#waittopack_tabs ul li.layui-this>span"
                          //   ).text();
                          //   let newNum = oldNum - successIds.length;
                          //   $("#waittopack_tabs ul li.layui-this>span").text(
                          //     newNum
                          //   );
                          //   $("#waittopackdPage .layui-laypage-count").text(
                          //     `共 ${newNum} 条`
                          //   );
                          // });
                          // $('[lay-filter="waittopackSearch"]').trigger('click');
                          // waittopackName.getSuccessRemove(result, 'waittopack_table', '取消订单')
                        }
                      );
                    })
                    .catch(function (resErr) {
                      layer.msg(resErr.message, { icon: 2 });
                    });
                });
              })
              .catch(function (err) {
                layer.msg(err, { icon: 2 });
              });
          });
          //更新备注
          $("#waittopackage_updateLi").on("click", function () {
            _this
              .getTablesSelectId()
              .then(function (res) {
                let ids = res
                  .map(function (item) {
                    return item.id;
                  })
                  .join("-");
                commonDirectMailRemarkBatch(ids,waittopack_gridOptions);
              })
              .catch(function (err) {
                layer.msg(err, { icon: 2 });
              });
          });
          //优选仓拒单
          $("#waittopackage_rejectOrderdabao").on("click", function () {
            let idsArr = getTableSelectIds();
            if (idsArr.length == 0) {
              return layer.msg("请先选择数据", { icon: 7 });
            }
            commonOrderConfirmLayer(idsArr.length, function (index) {
              initAjax(
                "/platorder/rejectDabaoOrders.html",
                "post",
                { ids: idsArr.join(",") },
                function (returnData) {
                  layer.close(index);
                  layui.admin.batchResultAlert(
                    "优选仓拒单:",
                    returnData.data,
                    function (errIdsArr) {
                      deleteTableRow_waittopack(idsArr,errIdsArr)
                      // zttCommonRemoveDataHandle({
                      //   selectedIds: idsArr,
                      //   gridOptions: waittopack_gridOptions,
                      //   tableData: immutableStore,
                      //   errIds: errIdsArr,
                      // }).then((newObj) => {
                      //   let { newData, successIds } = newObj;
                      //   immutableStore = newData;
                      //   let oldNum = $(
                      //     "#waittopack_tabs ul li.layui-this>span"
                      //   ).text();
                      //   let newNum = oldNum - successIds.length;
                      //   $("#waittopack_tabs ul li.layui-this>span").text(
                      //     newNum
                      //   );
                      //   $("#waittopackdPage .layui-laypage-count").text(
                      //     `共 ${newNum} 条`
                      //   );
                      // });
                    }
                  );
                },
                "application/x-www-form-urlencoded"
              );
            });
          });
          //更新商品信息
          $("#waittopackage_updateProducts").on("click", function () {
            _this
              .getTablesSelectId()
              .then(function (res) {
                let idsArr = res.map(function (item) {
                  return item.id;
                });
                commonReturnPromise({
                  url: "/lms/unauditorder/updateprodinfo.html",
                  type: "post",
                  params: {
                    ids: idsArr.join(),
                  },
                })
                  .then(function (result) {
                    layer.msg(result || "更新商品信息成功", { icon: 1 });
                    updateTableRow_waittopack(idsArr,[])
                  })
                  .catch(function (resErr) {
                    layer.msg(resErr.message, { icon: 2 });
                  });
              })
              .catch(function (err) {
                layer.msg(err, { icon: 2 });
              });
          });
          //转至待审核
          $("#waittopackage_pendingreview").on("click", function () {
            _this
              .getTablesSelectId()
              .then(function (res) {
                var idsArr = res.map(function (item) {
                  return item.id;
                });
                commonOrderConfirmLayer(idsArr.length, function (index) {
                  commonReturnPromise({
                    url: "/lms/abnormalorder/toaudit.html",
                    type: "post",
                    params: {
                      ids: idsArr.join(),
                    },
                  })
                    .then(function (result) {
                      layer.close(index);
                      layui.admin.batchResultAlert(
                        "订单转为待审核:",
                        result,
                        function () {
                          // $('[lay-filter="waittopackSearch"]').trigger('click');
                          waittopackName.getSuccessRemove(
                            result,
                            "waittopack_table",
                            "转为待审核"
                          );
                        }
                      );
                    })
                    .catch(function (resErr) {
                      layer.msg(resErr.message, { icon: 2 });
                    });
                });
              })
              .catch(function (err) {
                layer.msg(err, { icon: 2 });
              });
          });
          //wish退款
          $('#waittopackage_wishRefund').on('click', function() {
            let data = waittopack_gridOptions.api.getSelectedRows();
            if (!data || data.length < 1) {
              layer.msg('请选择订单', { icon: 7 });
              return;
            }
            originOrderWishRefund(data,'batch',function(){
              $('[lay-filter="waittopackSearch"]').trigger('click')
            })
          })
          //ebay取消
          $("#waittopackage_cancelOrderEbay").on("click", function () {
            _this
              .getTablesSelectId()
              .then(function (res) {
                var idsArr = res.map(function (item) {
                  return item.id;
                });
                layer.open({
                  type: 1,
                  title: "取消ebay订单",
                  content: $("#waittopackage_cancelEbayTpl").html(),
                  area: ["40%", "30%"],
                  id: "waittopackage_cancelEbayTplId",
                  btn: ["确定", "关闭"],
                  success: function (layero, index) {
                    form.render();
                  },
                  yes: function (index, layero) {
                    var cancelReason = layero.find("[name=cancelReason]:checked").val();
                    layer.close(index);
                    commonReturnPromise({
                      url: "/lms/unauditorder/cancelorder/ebay.html",
                      type: "post",
                      params: {
                        ids: idsArr.join(),
                        cancelReason: cancelReason,
                      },
                    })
                      .then(function (result) {
                        layui.admin.batchResultAlert(
                          "ebay取消订单完成:",
                          result,
                          function (errIdsArr) {
                            deleteTableRow_waittopack(idsArr,errIdsArr)
                            // zttCommonRemoveDataHandle({
                            //   selectedIds: idsArr,
                            //   gridOptions: waittopack_gridOptions,
                            //   tableData: immutableStore,
                            //   errIds: errIdsArr,
                            // }).then((newObj) => {
                            //   let { newData, successIds } = newObj;
                            //   immutableStore = newData;
                            //   let oldNum = $(
                            //     "#waittopack_tabs ul li.layui-this>span"
                            //   ).text();
                            //   let newNum = oldNum - successIds.length;
                            //   $("#waittopack_tabs ul li.layui-this>span").text(
                            //     newNum
                            //   );
                            //   $("#waittopackdPage .layui-laypage-count").text(
                            //     `共 ${newNum} 条`
                            //   );
                            // });
                            // $('[lay-filter="waittopackSearch"]').trigger('click');
                          }
                        );
                      })
                      .catch(function (resErr) {
                        layer.msg(resErr.message, { icon: 2 });
                      });
                  },
                });
              })
              .catch(function (err) {
                layer.msg(err, { icon: 2 });
              });
          });
          //更新订单状态
          $("#waittopackage_syncOrderStatus").on("click", function () {
            _this
              .getTablesSelectId()
              .then(function (res) {
                var idsArr = res.map(function (item) {
                  return item.id;
                });
                commonReturnPromise({
                  url: "/lms/unauditorder/syncplatstatus.html",
                  type: "post",
                  params: {
                    ids: idsArr.join(),
                  },
                })
                  .then(function (result) {
                    layui.admin.batchResultAlert(
                      "更新订单状态完成:",
                      result,
                      function (errIdsArr) {
                        updateTableRow_waittopack(idsArr,errIdsArr)
                        // $('[lay-filter="waittopackSearch"]').trigger('click');
                      }
                    );
                  })
                  .catch(function (resErr) {
                    layer.msg(resErr.message, { icon: 2 });
                  });
              })
              .catch(function (err) {
                layer.msg(err, { icon: 2 });
              });
          });
          //标记平台发货
          $("#waittopackage_markDelivery").on("click", function () {
            _this
              .getTablesSelectId()
              .then(function (res) {
                var idsArr = res.map(function (item) {
                  return item.id;
                });
                zttCommonProgressBar(
                  { type: 10, ids: idsArr.join() },
                  function (progressData) {
                    layui.admin.batchResultAlert(
                      "标记平台发货:",
                      progressData,
                      function (errIdsArr) {
                        updateTableRow_waittopack(idsArr,errIdsArr)
                      }
                    );
                  }
                );
                // commonReturnPromise({
                //     url: '/lms/unauditorder/markplatshipping.html',
                //     type: 'post',
                //     params: {
                //         ids: idsArr.join()
                //     }
                // }).then(function(result) {
                //     layui.admin.batchResultAlert("标记平台发货完成:", result, function() {
                //         // $('[lay-filter="waittopackSearch"]').trigger('click');
                //     });
                // }).catch(function(resErr) {
                //     layer.msg(resErr.message || resErr, { icon: 2 });
                // });
              })
              .catch(function (err) {
                layer.msg(err, { icon: 2 });
              });
          });
          // amazon 邮件
          $("#waittopackage_amazonEmail").on("click", function () {
            orderAmazonEmail(waittopack_gridOptions);
          });
          // ebay 邮件
          $("#waittopackage_eBayEmail").on("click", function () {
            orderEbayEmail(waittopack_gridOptions);
          });
          //ztt20231101--解密地址
          $('#waittopackage_decryptAddress').on('click', function () {
            _this
              .getTablesSelectId().then(res => {
                let ids = res.map(function (item) {
                  return item.id;
                });
                commonReturnPromise({
                  type: 'post',
                  url: '/lms/platorder/decrypt/list',
                  contentType: 'application/json',
                  params: JSON.stringify(ids)
                }).then(res => {
                    layui.admin.batchResultAlert("解密地址:",res,function(errIdsArr){
                        updateTableRow_waittopack(ids,errIdsArr)
                    });
                });
              }).catch(function (err) {
                layer.msg(err, { icon: 2 });
              });
          });
          //ztt20231101--修改发货声明
          $('#waittopackage_deliverDeclare').on('click', function () {
            _this
              .getTablesSelectId().then(res => {
                let ids = res.map(function (item) {
                  return item.id;
                });
                commonReturnPromise({
                  url: '/lms/unauditorder/modifyShipping.html',
                  params: {
                      ids: ids.join(',')
                  }
                }).then(res => {
                    layui.admin.batchResultAlert("修改发货声明:",res,function(errIdsArr){
                      updateTableRow_waittopack(ids,errIdsArr)
                    });
                });
              }).catch(err=> {
                layer.msg(err, { icon: 2 });
              });
          });
          //打印物流面单
          $("#waittopackage_logisLi").on("click", function () {
            _this
              .getTablesSelectId()
              .then(function (res) {
                var orderIdsArr = res.map(function (item) {
                  return item.id;
                });
                $.ajax({
                  type: "POST",
                  url: ctx + "/logistics/batch/print.html",
                  data: { orderIdStr: orderIdsArr.join() },
                  success: function (returnData) {
                    var paramsMapList = returnData.successResults;
                    if (paramsMapList && paramsMapList.length > 0) {
                      // joom 平台的数据打印宽度需要是150，
                      if (
                        orderIdsArr.filter((item) => item.platCode == "joom")
                          .length
                      ) {
                        var _result = paramsMapList;
                      } else {
                        var _result = paramsMapList.map((item) => {
                          let _item = res.find(
                            (elem) => elem.id == item.orderId
                          );
                          if (_item.platCode == "joom") {
                            item.width = 100;
                            item.height = 150;
                          }
                          return item;
                        });
                      }
                      for (var j = 0; j < _result.length; j++) {
                        _this.packagePrint(paramsMapList[j]);
                      }
                    }
                    if (
                      returnData.failResults &&
                      returnData.failResults.length > 0
                    ) {
                      let str = "";
                      returnData.failResults.forEach((item) => {
                        str += item + "<br>";
                      });
                      layer.alert(str, { icon: 2 });
                    }
                  },
                  error: function (err) {
                    console.log(err);
                  },
                });
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
              })
              .catch(function (err) {
                layer.msg(err, { icon: 2 });
              });
          });
          //打印配货单
          $("#waittopackage_setLi").on("click", function () {
            _this
              .getTablesSelectId()
              .then(function (res) {
                var orderIdsArr = res.map(function (item) {
                  console.log(item);
                  return item.id;
                });
                // let isNo = orderIdsArr.some((v)=>v == undefined)
                // if (isNo) {
                //     return layer.msg('没有批次号,没法打印啊', { icon: 2 });
                // }
                if (orderIdsArr.length == 0) {
                  return layer.msg("没有批次号,没法打印啊", { icon: 2 });
                }
                for (var i = 0; i < orderIdsArr.length; i++) {
                  _this
                    .printSortAjax(null, orderIdsArr[i])
                    .then(function (objectData) {
                      //然后组装参数去调用打印接口
                      epeanPrint_plugin_fun(20, objectData);
                    });
                }
              })
              .catch(function (err) {
                layer.msg(err, { icon: 2 });
              });
          });
          //打印物流面单（含SKU）
          $("#waittopackage_setlogisLi").on("click", function () {
            _this
              .getTablesSelectId()
              .then(function (res) {
                var orderIdsArr = res.map(function (item) {
                  return item.id;
                });
                const orderIdStr = orderIdsArr.join();
                // 现在19:47,所有这个接口/logistics/batch/print.html今晚要改好更新,后端又没有返回状态码,只能写ajax
                commonReturnPromise({
                  url: `/lms/logistics/v1/batch/print/skuInfoAndLogistics`,
                  type: 'post',
                  params: {
                    orderIdStr: orderIdStr
                  }
                }).then(async (returnData) => {
                  function orderDataPrint(inntObj, sku) {
                    let obj = {};
                    obj.printType = 19;
                    obj.labelUrl = inntObj.ftpLabelUrl;
                    obj.width = inntObj.width;
                    obj.height = inntObj.height;
                    obj.printName = "100100";
                    if (obj.height === 150) {
                      obj.printName = "100150";
                    }
                    return obj;
                  }

                  var resultSheet = returnData.successResults;
                  let resultDataArr = [],
                    countIndex = 0;
                  if (resultSheet && resultSheet.length > 0) {
                    for (var j = 0; j < resultSheet.length; j++) {
                      let resultDataObjOne = orderDataPrint(resultSheet[j]);
                      resultDataArr.push(resultDataObjOne);
                    }
                  }
                  if (
                    returnData.failResults &&
                    returnData.failResults.length > 0
                  ) {
                    let str = "";
                    returnData.failResults.forEach((item) => {
                      str += item.orderId + ": " + item.ftpLabelUrl + "<br>";
                    });
                    layer.alert(str, { icon: 2 });
                  }
                  let timeset;
                  timeset = window.setInterval(function () {
                    if (countIndex >= resultDataArr.length) {
                      window.clearInterval(timeset);
                    } else {
                      logistics_label_pdf_print(resultDataArr[countIndex]);
                    }
                    countIndex++;
                  }, 500);
                });
              })
              .catch(function (err) {
                layer.msg(err || err.message, { icon: 2 });
              });
          });
        },
        //批量改备注
        batchRemark: function (ids) {
          var remarkStr = `
                    <script type="text/html">
                        <form class="layui-form p20">
                            <div class="layui-form-item">
                                <label class="layui-form-label">类型</label>
                                <div class="layui-input-block">
                                    <select name="notetype">
                                    </select>
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <label class="layui-form-label">备注</label>
                                <div class="layui-input-block">
                                    <textarea name="remark" placeholder="请输入内容" class="layui-textarea"></textarea>
                                </div>
                            </div>
                        </form>
                    </script>`;
          layer.open({
            type: 1,
            title: "备注",
            btn: ["提交", "取消"],
            area: ["40%", "60%"],
            content: $(remarkStr).html(),
            id: "batchRemarkId",
            move: false,
            success: function (layero, index) {
              layui.form.render("select");
            },
            yes: function (index, layero) {
              var noteContent = layero.find("textarea[name=remark]").val();
              commonReturnPromise({
                url: "/lms/platorder/addordernote.html",
                type: "post",
                params: {
                  ids: ids,
                  noteContent: noteContent,
                },
              })
                .then(function (result) {
                  // console.log(result)
                  layer.msg(result || "批量更新备注成功", { icon: 1 });
                  layer.close(index);
                  $('[lay-filter="waittopackSearch"]').trigger("click");
                })
                .catch(function (resErr) {
                  layer.msg(resErr.message, { icon: 2 });
                });
            },
          });
        },
        //得到成功的信息并删除
        getSuccessRemove(res, domInput, status) {
          let resTem;
          if (res.successNum <= 0) {
            return;
          }
          if (status == "驳回订单" || status == "转为待审核") {
            resTem = res.successResults
              .join()
              .replace(/订单/g, "")
              .split(",")
              .map((v) => parseInt(v));
          } else if (status == "标记异常") {
            resTem = res.successResults
              .join()
              .replace(/订单:\[/g, "")
              .replace(/\]标记异常成功/g, "")
              .split(",")
              .map((v) => parseInt(v));
          } else if (status == "取消订单") {
            resTem = res.successResults
              .join()
              .replace(/订单\[/g, "")
              .replace(/\]手动转取消订单成功/g, "")
              .split(",")
              .map((v) => parseInt(v));
          }
          let removeTable = waittopack_gridOptions.api.getSelectedRows();
          // let removeTable = Array.from($(`#${domInput}`).next().find('tbody tr input:checked'));
          // removeTable.forEach(v => {
          //     resTem.forEach(value => {
          //         if (value == $(v).parents('tr').find('.waittipack_Id').text()) {
          //             $(v).parents('td').find('.layui-unselect.layui-form-checkbox.layui-form-checked').click()//恢复未选中的状态
          //             $(v).parents('tr').remove()//删除此行
          //         }
          //     })
          // })
          removeTable.map((item, index) => {
            if (resTem.indexOf(item.id) > -1) {
              waittopack_gridOptions.api.updateRowData({
                remove: [removeTable[index]],
              });
            }
          });
          let count = $("#waittopack_tabs").find(".layui-this span").text();
          count = count.substring(1, count.length - 1);
          $(".layui-laypage-count").text(
            `共 ${Math.abs(count - res.successNum)} 条`
          );
          $("#waittopack_tabs")
            .find(".layui-this span")
            .text(`(${Math.abs(count - res.successNum)})`);
        },
        //时间渲染默认30天
        time: function () {
          var nowdate = new Date(new Date().toLocaleDateString()).getTime();
          var endTime = Format(
            nowdate + 24 * 60 * 60 * 1000 - 1,
            "yyyy-MM-dd hh:mm:ss"
          );
          var startTime = Format(
            new Date(nowdate - 60 * 24 * 3600 * 1000),
            "yyyy-MM-dd hh:mm:ss"
          );
          var timeVal = startTime + " - " + endTime;
          laydate.render({
            elem: "#waittopack_time",
            type: "datetime",
            // value: timeVal,
            inputAuto: true,
            range: true,
            showShortcuts: true,
          });
        },
        //渲染搜索条件
        renderSearchItem: function () {
          var _this = this;
          this.pickingBatch();
          _this
              .commonSession()
              .then(function (obj) {
                waitToPack_pageNum = obj;
                _this.renderHandle(obj);
                // console.log(obj);
                sessionStorage.setItem("WAITTOPACK_ITEMS", JSON.stringify(obj));
              })
              .catch(function (err) {
                layer.msg("请求接口出错", { icon: 7 });
              });
          // var waittopackSession = sessionStorage.getItem("WAITTOPACK_ITEMS");
          // if (!waittopackSession) {
          //   _this
          //     .commonSession()
          //     .then(function (obj) {
          //       waitToPack_pageNum = obj;
          //       _this.renderHandle(obj);
          //       // console.log(obj);
          //       sessionStorage.setItem("WAITTOPACK_ITEMS", JSON.stringify(obj));
          //     })
          //     .catch(function (err) {
          //       layer.msg("请求接口出错", { icon: 7 });
          //     });
          // } else {
          //   var obj = new Function(`return ${waittopackSession}`)();
          //   waitToPack_pageNum = obj;
          //   _this.renderHandle(obj);
          // }
        },
        //渲染搜索条件--拣货批次
        needFreshBatchNo: false,
        pickingBatch: function () {
          const orderStatus = $("#waittopackForm")
            .find("[name=processStatus]")
            .val();
          commonReturnPromise({
            url: `/lms/pickpackorder/getBatchInfoByStatus?orderStatus=${orderStatus}`,
          }).then((res) => {
            res.unshift("无批次");
            commonRenderSelect("waittopack_pickBatchNo", res).then(function () {
              form.render("select");
            });
          });
        },
        //渲染搜索条件--拣货批次 数据 //未拣货120 未核单125 未包装130 仓库缺货135 仓库截单136
        PickingBatchObj: {},
        //渲染操作
        renderHandle: function (obj) {
          //平台
          commonRenderSelect("waittopack_platCode", obj.platCodes).then(
            function () {
              form.render("select");
            }
          );
          //订单标签
          commonRenderSelect("waittopack_orderLabels", obj.orderLabels, {
            code: "code",
            name: "name",
          }).then(function () {
            formSelects.render("waittopack_orderLabels", {
              placeholder: "备注类型",
            });
          });
          //物流属性waittopack_logisAttrs
          commonRenderSelect("waittopack_logisAttrs", obj.logisAttrs).then(
            function () {
              formSelects.render("waittopack_logisAttrs");
            }
          );
          //收件国家waittopack_shippingCountrys
          const shippingCountryCodeList = obj.shippingCountrys.map(item => ({
            ...item,
            name: item.value + "(" + item.name + ")",
            shippingCountryCode: item.name,
            shippingCountryName: item.enFullValue,
            shippingCountryCnName: item.value,
          }))
          commonRenderSelect(
            "waittopack_shippingCountrys",
            shippingCountryCodeList,
            { name: "name", code: "shippingCountryCode" }
          ).then(function () {
            formSelects.render("waittopack_shippingCountrys");
          });
          //物流公司waittopack_company
          logisCompanysArr = obj.companys;
          commonRenderSelect("waittopack_company", obj.companys, {
            name: "cnName",
            code: "id",
          }).then(function () {
            // form.render('select');
            formSelects.render("xm_waittopack_company");
          });
          //发货仓库waittopack_warehouseId
          commonRenderSelect("waittopack_warehouseId", obj.prodWarehouses, {
            name: "value",
            code: "name",
          }).then(function () {
            form.render("select");
          });
          //开发专员waittopack_preprodDevId
          commonRenderSelect("waittopack_preprodDevId", obj.preprodDev, {
            name: "userName",
            code: "id",
          }).then(function () {
            form.render("select");
          });
          //采购专员waittopack_purchasingAgentId
          commonRenderSelect(
            "waittopack_purchasingAgentId",
            obj.purchasingAgent,
            { name: "userName", code: "id" }
          ).then(function () {
            form.render("select");
          });
        },
        //平台和店铺,物流公司和物流方式联动
        watchHandle: function () {
          var waittopackSession = sessionStorage.getItem("WAITTOPACK_ITEMS");
          var _this = this;
          var $form = $("#waittopackForm");
          //监听平台和店铺联动
          commonInitRenderRoleType('waittopack');
          form.on("select(waittopack_platCode)", function (data) {
            var val = data.value; //选中的值
            // commonOrderAddSalePerson('waittopack', form, val);
            commonOrderAddOrg("waittopack", form, val);
            _this.listplatorderstatus(val).then(function (result) {
              _this.platOrderStatuscommonPS(result);
            });
            // _this.allStore(val).then(function(result) {
            //     _this.commonPS(result);
            // });
          });
          //监听物流公司和货代公司切换
          form.on("select(companyType)", function (data) {
            var val = data.value;
            if (!waittopackSession) {
              _this.allCompany().then(function (result) {
                _this.commonLW(val, result);
              });
            } else {
              var obj = new Function(`return ${waittopackSession}`)();
              _this.commonLW(val, obj);
            }
          });
          //监听物流/货代公司和物流方式联动
          formSelects.on(
            "xm_waittopack_company",
            function (id, vals, val, isAdd, isDisabled) {
              var idsArr = vals.map(function (item) {
                return item.value;
              });
              var isCompany = $form.find("[name=companyType]").val();
              var obj = {};
              if (isCompany == "companys") {
                obj.logisticsCompanyId = idsArr.join(",");
              } else {
                obj.agent = idsArr.join(",");
              }
              _this.allLogisType(obj).then(function (result) {
                commonRenderSelect("waittopack_logisTypeIds", result, {
                  name: "name",
                  code: "id",
                }).then(function () {
                  formSelects.render("xm_waittopack_logisTypeIds");
                });
              });
            },
            true
          );
        },
        //平台和店铺公共逻辑
        commonPS: function (data) {
          commonRenderSelect("waittopack_store", data, {
            name: "storeAcct",
            code: "id",
          }).then(function () {
            formSelects.render("waittopack_store", {
              placeholder: "请先选择平台",
            });
          });
        },
        platOrderStatuscommonPS: function (data) {
          let arr = [];
          data && data.forEach((item) => arr.push({ platOrderStatus: item }));
          commonRenderSelect("waittopack_platOrderStatusList", arr, {
            name: "platOrderStatus",
            code: "platOrderStatus",
          }).then(function () {
            formSelects.render("waittopack_platOrderStatusList", {
              placeholder: "请先选择平台",
            });
          });
        },
        //物流方式相关的公共逻辑
        commonLW: function (val, result) {
          if (val == "companys") {
            commonRenderSelect("waittopack_company", result.companys, {
              name: "cnName",
              code: "id",
            }).then(function () {
              // form.render('select');
              formSelects.render("xm_waittopack_company");
            });
          } else {
            commonRenderSelect("waittopack_company", result.agents, {
              name: "cnName",
              code: "id",
            }).then(function () {
              // form.render('select');
              formSelects.render("xm_waittopack_company");
            });
          }
        },
        //缓存请求结构公共逻辑
        commonSession: function () {
          var _this = this;
          return new Promise(function (resolve, reject) {
            Promise.all([
              _this.allLists(),
              _this.allPurchasingAgent(),
              _this.allPreprodDev(),
              _this.allCompany(),
            ])
              .then(function (result) {
                var obj = result[0]; //平台/物流属性/收件国家/发货仓库/订单标签
                obj.purchasingAgent = result[1]; //采购人员
                obj.preprodDev = result[2]; //开发人员
                obj.companys = result[3]["companys"]; //物流公司
                obj.agents = result[3]["agents"]; //货代公司
                resolve(obj);
              })
              .catch(function (err) {
                reject(err);
              });
          });
        },
        //触发搜索按钮
        trigger: function () {
          $("[lay-filter=waittopackSearch]").trigger("click");
        },
        //----搜索条件相关渲染和处理end

        //---- 表格渲染start
        //tab切换
        switchTab: function () {
          var $processStatus = $("#waittopackForm").find(
            "[name=processStatus]"
          );
          var _this = this;
          var $setBtn = $("#waittopack_setBtn"); //生成配货批次按钮
          var $distributeBtn = $("#waittopack_distributeBtn"); //配货按钮
          var $singleBtn = $("#waittopack_singlePackageBtn"); //单品包装按钮
          var $multiBtn = $("#waittopack_multiPackageBtn"); //多品包装按钮
          var $multiDistBtn = $("#waittopack_multiDistributeBtn"); //多批次配货按钮
          var $multiShotBtn = $("#waittopack_multiShotBasketballBtn"); //多品投篮
          var $lackShotBtn = $("#waittopack_lackShotBasketballBtn"); //少货投篮
          var $pendingreview = $("#waittopackage_pendingreview"); //少货投篮
          var $pickCompleteLiBtn = $("#waittopackage_pickCompleteLi"); //配货完成
          var $pickCompleteLiBtn2 = $("#waittopackage_pickCompleteLi2");  //核单完成
          var $pickCompleteLiBtn3 = $("#waittopackage_pickCompleteLi3");  //包装完成
          var $pickCompleteLiBtn4 = $("#waittopackage_pickCompleteLi4");  //转至待派单
          var $pickCompleteLiBtn5 = $("#waittopackage_pickCompleteLi5");  //转至待发货
          var $multiNoProdBtn = $("#waittopack_multiNoProdBtn"); //多品缺货处理
          var $unBindBatch = $("#waittopack_unBindBatch"); //批次解绑
          const $rejectOrderdabao = $('#waittopackage_rejectOrderdabao') // 优选仓拒单 
          const $_rejectLi = $('#waittopackage_rejectLi') // 驳回订单
          let $tab = $('#waittopacktoInterceptTabs'); //仅在仓库截单显示的第二个tab
          let $logisApplySearchStatus = $('#waittopackForm [name=logisApplySearchStatus]'); //仓库拦截单下的赋值
          let $waittopack_logis = $('#waittopack_logis');
          let $dismantleBtn = $('#waittopackage_dismantleBtn');
          //修改发货声明+解密地址
          let $addressAndDeclare = $('#waittopackCard .addressAndDeclare');
          
          
          element.on("tab(waittopack_tabs)", function (data) {
            var index = data.index; //得到当前Tab的所在下标
            // 如果页签不同，重新获取拣货批次
            const tabStatusObj = {
              0: 120, //未拣货120
              1: 125, //未核单125
              2: 130, //未包装130
              3: 135, //仓库缺货135
              4: 136 //仓库截单136
            };
            if ($processStatus.val() != tabStatusObj[index]) {
              // $("#enterpickBatchNor").val("");
              _this.needFreshBatchNo = true;
            } else {
              _this.needFreshBatchNo = false;
            }

            if (index == 0) {
              //未拣货120
              $addressAndDeclare.addClass('disN');
              $tab.addClass('disN');
              $logisApplySearchStatus.val('');
              $processStatus.val(120);
              $waittopack_logis.addClass('disN');
              $dismantleBtn.addClass('disN');
              // $pickCompleteLiBtn.html("配货完成");
              $pickCompleteLiBtn.removeClass('disN');
              $pickCompleteLiBtn2.addClass('disN');
              $pickCompleteLiBtn3.addClass('disN');
              $pickCompleteLiBtn4.addClass('disN');
              $pickCompleteLiBtn5.addClass('disN');
              $_rejectLi.removeClass("disN")
              $setBtn.removeClass("disN");
              $distributeBtn.removeClass("disN");
              $singleBtn.addClass("disN");
              $multiBtn.addClass("disN");
              $multiDistBtn.removeClass("disN");
              $multiShotBtn.addClass("disN");
              $lackShotBtn.addClass("disN");
              $pendingreview.addClass("disN");
              $multiNoProdBtn.addClass("disN");
              $unBindBatch.removeClass("disN");
              $rejectOrderdabao.removeClass('disN')
            } else if (index == 1) {
              //未核单125
              $addressAndDeclare.addClass('disN');
              $tab.addClass('disN');
              $logisApplySearchStatus.val('');
              $processStatus.val(125);
              $dismantleBtn.addClass('disN');
              $waittopack_logis.addClass('disN');
              $pickCompleteLiBtn.addClass('disN');
              $pickCompleteLiBtn3.addClass('disN');
              $pickCompleteLiBtn4.addClass('disN');
              $pickCompleteLiBtn5.addClass('disN');
              $pickCompleteLiBtn2.removeClass('disN');
              $_rejectLi.removeClass("disN")
              $setBtn.addClass("disN");
              $distributeBtn.addClass("disN");
              $singleBtn.removeClass("disN");
              $rejectOrderdabao.removeClass('disN')
              $multiBtn.addClass("disN");
              $multiDistBtn.addClass("disN");
              $multiShotBtn.removeClass("disN");
              $lackShotBtn.addClass("disN");
              $pendingreview.addClass("disN");
              $multiNoProdBtn.addClass("disN");
              $unBindBatch.addClass("disN");
            } else if (index == 2) {
              //未包装130
              $addressAndDeclare.addClass('disN');
              $tab.addClass('disN');
              $logisApplySearchStatus.val('');
              $processStatus.val(130);
              $waittopack_logis.addClass('disN');
              $dismantleBtn.addClass('disN');
              // $pickCompleteLiBtn.html("包装完成");
              $pickCompleteLiBtn.addClass('disN');
              $pickCompleteLiBtn2.addClass('disN');
              $pickCompleteLiBtn4.addClass('disN');
              $pickCompleteLiBtn5.addClass('disN');
              $pickCompleteLiBtn3.removeClass('disN');
              $_rejectLi.removeClass("disN")
              $setBtn.addClass("disN");
              $distributeBtn.addClass("disN");
              $singleBtn.removeClass("disN");
              $multiBtn.removeClass("disN");
              $rejectOrderdabao.removeClass('disN')
              $multiDistBtn.addClass("disN");
              $multiShotBtn.addClass("disN");
              $lackShotBtn.addClass("disN");
              $pendingreview.addClass("disN");
              $multiNoProdBtn.addClass("disN");
              $unBindBatch.addClass("disN");
            } else if (index == 3) {
              //仓库缺货135
              $addressAndDeclare.addClass('disN');
              $tab.addClass('disN');
              $logisApplySearchStatus.val('');
              $processStatus.val(135);
              $waittopack_logis.addClass('disN');
              $dismantleBtn.addClass('disN');
              // $pickCompleteLiBtn.html("转至待派单");
              $pickCompleteLiBtn.addClass('disN');
              $pickCompleteLiBtn2.addClass('disN');
              $pickCompleteLiBtn3.addClass('disN');
              $pickCompleteLiBtn5.addClass('disN');
              $pickCompleteLiBtn4.removeClass('disN');
              $_rejectLi.addClass("disN")
              $setBtn.addClass("disN");
              $distributeBtn.addClass("disN");
              $singleBtn.addClass("disN");
              $multiBtn.addClass("disN");
              $multiDistBtn.addClass("disN");
              $multiShotBtn.addClass("disN");
              $lackShotBtn.removeClass("disN");
              $pendingreview.removeClass("disN");
              $multiNoProdBtn.removeClass("disN");
              $rejectOrderdabao.removeClass('disN')
              $unBindBatch.addClass("disN");
            }else if (index == 4){
              // 仓库截单136
              $addressAndDeclare.removeClass('disN');
              $tab.removeClass('disN');
              $logisApplySearchStatus.val('');
              $processStatus.val(136);
              $waittopack_logis.removeClass('disN');
              $dismantleBtn.removeClass('disN');
              // $pickCompleteLiBtn.html("转至待发货");
              $pickCompleteLiBtn.addClass('disN');
              $pickCompleteLiBtn2.addClass('disN');
              $pickCompleteLiBtn3.addClass('disN');
              $pickCompleteLiBtn4.addClass('disN');
              $pickCompleteLiBtn5.removeClass('disN');
              $_rejectLi.addClass("disN")
              $pendingreview.addClass("disN");
              $setBtn.addClass("disN");
              $distributeBtn.addClass("disN");
              $singleBtn.addClass("disN");
              $multiBtn.addClass("disN");
              $multiDistBtn.addClass("disN");
              $multiShotBtn.addClass("disN");
              $unBindBatch.addClass("disN");
              $rejectOrderdabao.addClass('disN')
              $lackShotBtn.addClass("disN");
              $multiNoProdBtn.addClass("disN");
            }

            _this.trigger();
          });
        },
        dataHandle: function (data) {
          // if (data.platTags) {
          //     data.platTags = JSON.stringify(data.platTags.split(','));
          // }
          data.pickBatchNo = data.enterpickBatchNor;
          delete data.enterpickBatchNor;
          if (data.salerAndcustomSelect == 2) {
            data.customServicerId = data.salePersonId;
            delete data.salePersonId;
          }
          if (data.times) {
            var timesArr = data.times.split(" - ");
            data.orderTimeStart = timesArr[0];
            data.orderTimeEnd = timesArr[1];
          } else {
            data.orderTimeStart = "";
            data.orderTimeEnd = "";
          }
          data[data.skuType] = data.skuvalue;
          delete data.skuType;
          delete data.skuvalue;
          //处理companyType和company
          if (data["companyType"] == "companys") {
            data.logisticsCompanyId = data["company"] || "";
          } else {
            data.agentCompany = data["company"] || "";
          }
          // 1. 选择了部门，没有选店铺
          //     1.1 部门下有店铺，传全部店铺
          //     1.2 部门下没有店铺，传0
          // 2. 选择了部门，选择了店铺，传选择的店铺
          if (data.orgs != "" && data.storeAcctIds == "") {
            data.storeAcctIds = $("#waittopack_store").attr("acct_ids") || 0;
          }
          delete data["companyType"];
          delete data["company"];
          return data;
        },
        tableRender: function (data) {
          var _this = this;
          commonReturnPromiseRes({
            url: ctx + "/pickpackorder/listorder.html",
            type: "POST",
            params: data,
          })
            .then(function (result) {
              // 更新批次号
              if (_this.needFreshBatchNo) {
                _this.pickingBatch();
              }
              // 商品种类||数量
              let skuQuantity = 0,
                prodQuantity = 0;
              if (result.count != 0) {
                result.data.forEach((item) => {
                  skuQuantity = skuQuantity + item.skuQuantity * 1;
                  prodQuantity = prodQuantity + item.prodQuantity * 1;
                });
                $("#waittopack_tableId")
                  .find("[col-id=3] .ag-header-cell-text")
                  .text(`商品 种类${skuQuantity} || 数量${prodQuantity}`);
                _this.waittopackdPage(data, result.count);
                immutableStore = result.data;
                waittopack_gridOptions.api.setRowData(immutableStore);
                $("#waittopack_tabs").find("li>span").html("");
                $("#waittopack_tabs")
                  .find("li.layui-this>span")
                  .html(`${result.count}`);
              } else {
                $("#waittopack_tableId")
                  .find("[col-id=3] .ag-header-cell-text")
                  .text(`商品 种类0 || 数量0`);
                _this.waittopackdPage(data, 0);
                immutableStore = [];
                waittopack_gridOptions.api.setRowData(immutableStore);
                $("#waittopack_tabs").find("li>span").html("");
                $("#waittopack_tabs").find("li.layui-this>span").html(`0`);
              }
            })
            .catch(function (err) {
              layer.msg(err, { icon: 2 });
            });
        },
        // 渲染页面分页
        waittopackdPage(data, count) {
          let _this = this;
          laypage.render({
            elem: "waittopackdPage",
            curr: data.page,
            limit: data.limit,
            limits: [5000, 10000, 20000],
            layout: ["prev", "page", "next", "count", "limit"],
            count: count,
            jump: function (obj, first) {
              $('#waittopackForm input[name="limit"]').val(obj.limit); //保障下次的分页请求中带有的值正确
              $('#waittopackForm input[name="page"]').val(1); //保障下次的分页请求中带有的值正确
              //首次不执行
              if (!first) {
                $('#waittopackForm input[name="page"]').val(obj.curr); //保障下次的分页请求中带有的值正确
                data.page = obj.curr;
                data.limit = obj.limit;
                _this.trigger();
              }
            },
          });
        },
        tableCol: function (data) {
          var cols = [];
          if (data.processStatus == 125) {
            cols = [
              [
                { checkbox: true, width: 30 },
                {
                  title: "订单号",
                  field: "allId",
                  templet: "#waittopack_id_tpl",
                },
                {
                  title: "订单金额",
                  field: "platOrderAmts",
                  templet: "#waittopack_platOrderAmt_tpl",
                },
                {
                  title: "商品",
                  field: "prodQuantitys",
                  templet: "#waittopack_prodQuantity_tpl",
                },
                {
                  title: "收件人",
                  field: "shippingUsernames",
                  templet: "#waittopack_shippingUsername_tpl",
                },
                {
                  title: "物流",
                  field: "logisTypeNames",
                  templet: "#waittopack_logisTypeName_tpl",
                },
                {
                  title: "时间",
                  field: "times",
                  templet: "#waittopack_time_tpl",
                },
                { title: "批次号", field: "batchNo" },
                {
                  title: "状态",
                  field: "platOrderStatus",
                  templet: "#waittopack_platOrderStatus_tpl",
                },
                { title: "操作", toolbar: "#waittopack_detailTool", width: 70 },
              ],
            ];
          } else {
            cols = [
              [
                { checkbox: true, width: 30 },
                {
                  title: "订单号",
                  field: "allId",
                  templet: "#waittopack_id_tpl",
                },
                {
                  title: "订单金额",
                  field: "platOrderAmts",
                  templet: "#waittopack_platOrderAmt_tpl",
                },
                {
                  title: "商品",
                  field: "prodQuantitys",
                  templet: "#waittopack_prodQuantity_tpl",
                },
                {
                  title: "收件人",
                  field: "shippingUsernames",
                  templet: "#waittopack_shippingUsername_tpl",
                },
                {
                  title: "物流",
                  field: "logisTypeNames",
                  templet: "#waittopack_logisTypeName_tpl",
                },
                {
                  title: "时间",
                  field: "times",
                  templet: "#waittopack_time_tpl",
                },
                {
                  title: "状态",
                  field: "platOrderStatus",
                  templet: function (d) {
                    let temporayStr = "";
                    if (d.orderLabel) {
                      let temporay = d.orderLabel.split(",");
                      temporay.forEach((v) => {
                        let waitToPackTem =
                          waitToPack_pageNum.orderLabels.filter(
                            (value) => value.code == v
                          )[0];
                        waitToPackTem
                          ? (temporayStr += ` ${waitToPackTem.name || ""}`)
                          : temporayStr;
                      });
                    }
                    let markShippingStatus = "";
                    if (d.markShippingStatus == 0) {
                      markShippingStatus = "未标记";
                    } else if (d.markShippingStatus == 1) {
                      markShippingStatus = "已标记";
                    } else if (d.markShippingStatus == 2) {
                      markShippingStatus = "标记失败";
                    }
                    return `<div class="alignLeft">
                                    <div><span class="gray">留言：${
                                      d.buyerNote || ""
                                    }</span></div>
                                    <div><span class="gray">标记发货：${
                                      markShippingStatus || ""
                                    }</span></div>
                                    <div><span class="gray">订单标签：${temporayStr}</span></div>
                                    <div><span class="gray">订单状态：${
                                      d.platOrderStatus || ""
                                    }</span></div>
                                    <div><span class="gray">打印面单状态：</span></div>
                                </div>`;
                  },
                },
                { title: "操作", toolbar: "#waittopack_detailTool", width: 70 },
              ],
            ];
          }
          return cols;
        },
        tableWatchbar: function () {
          //监听表格详情点击事件
          var _this = this;
          table.on("tool(waittopack_tableFilter)", function (obj) {
            if (obj.event == "detail") {
              commonOrderDetailFn(obj.data);
            } else if (obj.event == "remark") {
              commonDirectMailRemark(obj.data);
            }
          });
        },
        //监听表格tr的点击[查看详情]
        watchTableTr: function () {
          $("#waittopackCard .layui-table-main").on(
            "click",
            "td[data-field=platOrderStatus]",
            function (event) {
              var $targetBtn = $(this)
                .parents("tr")
                .find("span[lay-event=detail]");
              $targetBtn.trigger("click");
              event.stopPropagation();
              event.preventDefault();
            }
          );
        },
        //---- 表格渲染end

        //#region ---- 配货操作start
        distributeHandle: function () {
          var _this = this;
          let showPartitionRemainingDomTitle = `<div id="waittopack_showPartitionRemainingDom">
                    剩余批次（单品/多品）
                <span class="disN" id="waittopack_oneArea"> 1区：<span></span></span>
                    <span class="disN" id="waittopack_twoArea">2区：<span></span></span>
                    <span class="disN" id="waittopack_threeArea">3区：<span></span></span>
                    <span class="disN" id="waittopack_fourArea">4区：<span></span></span>
                    <span class="disN" id="waittopack_fiveArea">5区：<span></span></span>
                    <span class="disN" id="waittopack_sixArea">6区：<span></span></span>
                    <i class="layui-icon" id="waittopack_refleash_icon" style="cursor:pointer;">&#xe9aa;</i>
                </div>`;
          $("#waittopack_distributeBtn").on("click", function () {
            var index = layer.open({
              type: 1,
              title: "配货" + showPartitionRemainingDomTitle,
              area: ["100%", "100%"],
              btn: ["关闭"],
              move: false,
              content: $("#waittopack_distributeLayer").html(),
              id: "waittopack_distributeLayerId",
              success: function (layero, index) {
                _this.setLayerHeaderShowName(layero);
                _this.pickSuccessBtn(layero);
                _this.lackProdWaitBtn(layero);
                _this.pickActualNumHandle(layero); //实际拣货回车事件
                var waittopackSession =
                  sessionStorage.getItem("WAITTOPACK_ITEMS");
                var prodWarehouses;
                var prodWarehousesId;
                if (!waittopackSession) {
                  _this.commonSession().then(function (obj) {
                    prodWarehouses = obj.prodWarehouses;
                    prodWarehousesId = prodWarehouses.filter(
                      (item) => item.value == "义乌仓"
                    )[0]["name"];
                    commonRenderSelect(
                      "waittopack_distribute_warehouseId",
                      prodWarehouses,
                      {
                        name: "value",
                        code: "name",
                        selected: prodWarehousesId,
                      }
                    ).then(function () {
                      form.render("select");
                    });
                  });
                } else {
                  var obj = new Function(`return ${waittopackSession}`)();
                  prodWarehouses = obj.prodWarehouses;
                  prodWarehousesId = prodWarehouses.filter(
                    (item) => item.value == "义乌仓"
                  )[0]["name"];
                  commonRenderSelect(
                    "waittopack_distribute_warehouseId",
                    prodWarehouses,
                    { name: "value", code: "name", selected: prodWarehousesId }
                  ).then(function () {
                    form.render("select");
                  });
                }
                form.render();
                _this.judgeHasPicking(layero); //初始化配货获取值
                _this.getSkuHandle(layero); //获取
                _this.robSkuHandle(layero); //抢单
                _this.watchWarehouseSel(layero); //渲染楼层楼栋
                // _this.showPartitionRemaining(layero, layero.find("#waittopack_distribute_warehouseId").val()); //显示分区剩余
                _this.sortHandle("sortIconClass_upSort"); //正序功能
                _this.sortHandle("sortIconClass_downSort"); //倒序功能
                _this.printBatchNo();
                //触发楼层和楼栋渲染
                _this.renderBuildingAndFloor(layero, prodWarehousesId);
                //绑定剩余批次点击功能;
                layero.find("#waittopack_refleash_icon").on("click", () => {
                  let warehouseId = layero
                    .find("#waittopack_distribute_warehouseId")
                    .val();
                  _this.showPartitionRemaining(layero, warehouseId);
                });
              },
            });
          });
        },
        //打印批次号
        printBatchNo: function () {
          $("#distributeContainerForm_printBatchNo").on("click", function () {
            var printData = [];
            var obj = {};
            obj.batchNo = $(
              ".distributeContainer-form input[name=batchNo]"
            ).val();
            if (!obj.batchNo) {
              layer.msg("批次号不能为空!", { icon: 7 });
              return;
            }
            printData.push(obj);
            epeanPrint_plugin_fun(21, printData);
          });
        },

        //监听仓库的选择
        watchWarehouseSel: function (layero) {
          var _this = this;
          form.on("select(waittopack_distribute_warehouseId)", function (obj) {
            var val = obj.value;
            //渲染楼层和楼栋
            _this.renderBuildingAndFloor(layero, val);
            //变更显示分区剩余
            _this.showPartitionRemaining(layero, val);
          });
        },
        renderBuildingAndFloor: function (layero, val) {
          var _this = this;
          Promise.all([_this.getBuildingAjax(val), _this.getFloorAjax(val)])
            .then(function (result) {
              var buildingArr = result[0];
              var floorArr = result[1];
              var $building = layero.find("[name=buildingNo]");
              var $floor = layero.find("[name=floorNo]");

              function optionStr(arr) {
                var str = '<option value="">请选择</option>';
                for (var i = 0; i < arr.length; i++) {
                  str += `<option value="${arr[i]}">${arr[i]}</option>`;
                }
                return str;
              }
              $building.html(optionStr(buildingArr));
              $floor.html(optionStr(floorArr));
              form.render();
            })
            .catch(function (err) {
              layer.msg(err || err.message, { icon: 2 });
            });
        },
        //进入页面的时候判断是否有正在进行中的拣货
        judgeHasPicking: function (layero) {
          var _this = this;
          commonReturnPromise({
            url: "/lms/pickpackorder/getpickingbatch.html",
          })
            .then(function (result) {
              if (result && result.rePicking) {
                layer.confirm(
                  "有未完成的配货订单,是否获取?",
                  { icon: 3, title: "提示" },
                  function (index) {
                    //#region 进行渲染数量操作
                    _this.setLayerHeaderStatistics(
                      layero,
                      0,
                      result.pickSkuDtos.length
                    );
                    //#endregion
                    layero.find("[name=batchNo]").val(result.batchNo);
                    _this.tbodyTpl(result.pickSkuDtos, layero);
                    layero
                      .find(".shouldPickNum")
                      .text(
                        result["pickSkuDtos"][0]["batchDetails"][0]["skuNum"] ||
                          "无数据"
                      );
                    // 单位
                    _this.showDistributeContainerUnit(
                      layero,
                      result["pickSkuDtos"][0]["unit"]
                    );
                    layero
                      .find(".boxContain")
                      .text(
                        result["pickSkuDtos"][0]["batchDetails"][0]["caseNo"] ||
                          "无数据"
                      );
                    layero
                      .find(".boxContainBag")
                      .text(result["pickSkuDtos"][0]["needBag"] ? "袋" : "");
                    layero
                      .find(".distribute_img")
                      .attr("src", result["pickSkuDtos"][0]["imageUrl"]);
                    //渲染仓库-ztt20220803
                    layero
                      .find("select[name=warehouseId]")
                      .val(
                        result["pickSkuDtos"][0]["platOrderPickDetails"][0][
                          "warehouseId"
                        ] || ""
                      );
                    form.render("select");

                    _this.scanHandle(layero);
                    layer.close(index);
                  }
                );
              }
            })
            .catch(function (error) {
              layer.msg(error.message, { icon: 2 });
            });
        },
        // 展示配货弹窗里面的单位
        showDistributeContainerUnit: function (layero, unit) {
          // 单位
          let isShowUnit = !["个", "件", "条", "盒"].includes(unit);
          layero.find(".unit").text(isShowUnit ? unit || "" : "");
        },
        //获取操作
        getSkuHandle: function (layero) {
          var $form = layero.find("form");
          var getBtn = layero.find("#distributeContainerForm_getSku");
          var _this = this;
          //获取功能
          getBtn.on("click", function () {
            var warehouseId = $form.find("[name=warehouseId]").val(); //仓库id
            var pickType = $form.find("[name=pickType]").val(); //类型
            var buildingNo = $form.find("[name=buildingNo]").val(); //楼栋
            var floorNo = $form.find("[name=floorNo]").val(); //楼层
            var batchNoDom = $form.find("[name=batchNo]"); //批次号
            if (!warehouseId) {
              return layer.msg("请选择仓库", { icon: 7 });
            }
            if (pickType == "") {
              return layer.msg("请选择类型", { icon: 7 });
            }
            // if(!buildingNo){
            //     return layer.msg('请选择楼栋',{icon:7});
            // }
            // if(!floorNo){
            //     return layer.msg('请选择楼层',{icon:7});
            // }
            var obj = {
              warehouseId: warehouseId,
              pickType: pickType,
              buildingNo: buildingNo,
              floorNo: floorNo,
            };
            _this
              .getSku(obj)
              .then(function (result) {
                batchNoDom.val(result.batchNo); //设置获取到的批次号
                _this.setLayerHeaderStatistics(
                  layero,
                  0,
                  result.pickSkuDtos.length
                ); //数量监控
                _this.tbodyTpl(result.pickSkuDtos, layero); //渲染tbody
                //根据渲染的表格结构的类名获取到第一条数据
                var batchDetailsStr = layero
                  .find(".selectTr")
                  .attr("batchdetails");
                var batchDetailsObj = new Function(
                  ` return  ${batchDetailsStr}`
                )();
                layero
                  .find(".shouldPickNum")
                  .text(batchDetailsObj[0]["skuNum"] || "无数据");
                layero
                  .find(".boxContain")
                  .text(batchDetailsObj[0]["caseNo"] || "无数据");
                //自动聚焦
                layero.find("[name=scanningSku]").focus().val("");
                layero.find("[name=actualNum]").val("");
                _this.scanHandle(layero);
              })
              .catch(function (err) {
                layer.msg(err || "获取失败", { icon: 2 });
              });
          });
        },
        //抢单操作
        robSkuHandle: function (layero) {
          var $form = layero.find("form");
          var robBtn = layero.find("#distributeContainerForm_robSku");
          var _this = this;
          robBtn.on("click", function () {
            var warehouseId = $form.find("[name=warehouseId]").val(); //仓库id
            var pickType = $form.find("[name=pickType]").val(); //类型
            var buildingNo = $form.find("[name=buildingNo]").val(); //楼栋
            var floorNo = $form.find("[name=floorNo]").val(); //楼层
            var batchNoDom = $form.find("[name=batchNo]"); //批次号
            if (!warehouseId) {
              return layer.msg("请选择仓库", { icon: 7 });
            }
            if (pickType == "") {
              return layer.msg("请选择类型", { icon: 7 });
            }
            var obj = {
              warehouseId: warehouseId,
              pickType: pickType,
              buildingNo: buildingNo,
              floorNo: floorNo,
            };
            _this
              .robSku(obj)
              .then(function (result) {
                if (result && result.rePicking) {
                  layer.confirm(
                    "有未完成的配货订单,是否获取?",
                    { icon: 3, title: "提示" },
                    function (index) {
                      batchNoDom.val(result.batchNo); //设置获取到的批次号
                      _this.setLayerHeaderStatistics(
                        layero,
                        0,
                        result.pickSkuDtos.length
                      ); //数量监控
                      _this.tbodyTpl(result.pickSkuDtos, layero); //渲染tbody
                      //根据渲染的表格结构的类名获取到第一条数据
                      var targetSelectTr = layero.find(".selectTr");
                      var batchDetailsObj = new Function(
                        `return ${targetSelectTr.attr("batchdetails")}`
                      )();
                      var targetTrObj = new Function(
                        `return ${targetSelectTr.data("info")}`
                      )();
                      // console.log(batchDetailsObj,targetTrObj['needBag'],targetTrObj);
                      layero
                        .find(".shouldPickNum")
                        .text(batchDetailsObj[0]["skuNum"] || "无数据");
                      // 单位
                      _this.showDistributeContainerUnit(
                        layero,
                        targetTrObj["unit"]
                      );
                      layero
                        .find(".boxContain")
                        .text(batchDetailsObj[0]["caseNo"] || "无数据");
                      layero
                        .find(".boxContainBag")
                        .text(targetTrObj["needBag"] ? "袋" : "");
                      layero
                        .find(".distribute_img")
                        .attr("src", targetTrObj["imageUrl"] || "");
                      //自动聚焦
                      layero.find("[name=scanningSku]").focus().val("");
                      layero.find("[name=actualNum]").val("");
                      _this.scanHandle(layero);
                      layer.close(index);
                    }
                  );
                } else {
                  batchNoDom.val(result.batchNo); //设置获取到的批次号
                  _this.setLayerHeaderStatistics(
                    layero,
                    0,
                    result.pickSkuDtos.length
                  ); //数量监控
                  _this.tbodyTpl(result.pickSkuDtos, layero); //渲染tbody
                  //根据渲染的表格结构的类名获取到第一条数据
                  var targetSelectTr = layero.find(".selectTr");
                  var batchDetailsObj = new Function(
                    `return ${targetSelectTr.attr("batchdetails")}`
                  )();
                  var targetTrObj = new Function(
                    `return ${targetSelectTr.data("info")}`
                  )();
                  // console.log(batchDetailsObj,targetTrObj['needBag'],targetTrObj);
                  layero
                    .find(".shouldPickNum")
                    .text(batchDetailsObj[0]["skuNum"] || "无数据");
                  // 单位
                  _this.showDistributeContainerUnit(
                    layero,
                    targetTrObj["unit"]
                  );
                  layero
                    .find(".boxContain")
                    .text(batchDetailsObj[0]["caseNo"] || "无数据");
                  layero
                    .find(".boxContainBag")
                    .text(targetTrObj["needBag"] ? "袋" : "");
                  layero
                    .find(".distribute_img")
                    .attr("src", targetTrObj["imageUrl"] || "");
                  //自动聚焦
                  layero.find("[name=scanningSku]").focus().val("");
                  layero.find("[name=actualNum]").val("");
                  _this.scanHandle(layero);
                }
              })
              .catch(function (err) {
                layer.msg(err || "抢单失败", { icon: 2 });
              });
          });
        },
        //扫描sku执行的事件
        scanHandle: function (layero) {
          // console.log('执行扫描sku')
          var _this = this;
          var $actualNum = layero.find("[name=actualNum]");
          var $shouldPickNum = layero.find(".shouldPickNum");
          layero.find("[name=scanningSku]").on("keyup", function (e) {
            var scanSku = e.target.value;
            var sku = layero.find("[name=sku]").val().trim();
            var shouldNum = $shouldPickNum.text().trim();
            if (e.keyCode == 13) {
              //回车了
              if (scanSku.toUpperCase() != sku.toUpperCase()) {
                $(e.target).focus().select();
                _this.errorVoiceWarning();
                return layer.msg("SKU不匹配", { icon: 2 });
              }
              $actualNum.focus().val(shouldNum);
              if (shouldNum == 1) {
                layero.find("[name=actualNum]").trigger(e); //模拟页码框按下回车
              }
              return false;
            }
          });
        },
        //实拣数量回车操作
        pickActualNumHandle: function (layero) {
          layero.find("[name=actualNum]").on(
            "keyup",
            lms_debounce(function (e) {
              if (e.keyCode == 13) {
                //回车了
                $("#waittopack_pickSuccessBtn").trigger("click", layero);
                return false;
              }
            }, 200)
          );
        },
        //显示分区剩余
        showPartitionRemaining: function (layero, whId) {
          var _this = this;
          _this.getAreaRemainingAjax(whId).then((res) => {
            layero.find("#waittopack_oneArea").addClass("disN");
            layero.find("#waittopack_twoArea").addClass("disN");
            layero.find("#waittopack_threeArea").addClass("disN");
            layero.find("#waittopack_fourArea").addClass("disN");
            layero.find("#waittopack_fiveArea").addClass("disN");
            layero.find("#waittopack_sixArea").addClass("disN");
            if (
              Object.prototype.toString.call(res) == "[object Object]" &&
              Object.keys(res).length == 0
            ) {
              res = {
                "5区": "0/0",
                "4区": "0/0",
                "3区": "0/0",
                "2区": "0/0",
                "1区": "0/0",
              };
            }
            for (const key in res) {
              if (key == "1区") {
                layero
                  .find("#waittopack_oneArea span")
                  .html(res[key] + "&nbsp;&nbsp;&nbsp;")
                  .removeClass("disN");
                layero.find("#waittopack_oneArea").removeClass("disN");
              } else if (key == "2区") {
                layero
                  .find("#waittopack_twoArea span")
                  .html(res[key] + "&nbsp;&nbsp;&nbsp;")
                  .removeClass("disN");
                layero.find("#waittopack_twoArea").removeClass("disN");
              } else if (key == "3区") {
                layero
                  .find("#waittopack_threeArea span")
                  .html(res[key] + "&nbsp;&nbsp;&nbsp;")
                  .removeClass("disN");
                layero.find("#waittopack_threeArea").removeClass("disN");
              } else if (key == "4区") {
                layero
                  .find("#waittopack_fourArea span")
                  .html(res[key] + "&nbsp;&nbsp;&nbsp;")
                  .removeClass("disN");
                layero.find("#waittopack_fourArea").removeClass("disN");
              } else if (key == "5区") {
                layero
                  .find("#waittopack_fiveArea span")
                  .html(res[key] + "&nbsp;&nbsp;&nbsp;")
                  .removeClass("disN");
                layero.find("#waittopack_fiveArea").removeClass("disN");
              } else if (key == "6区") {
                layero
                  .find("#waittopack_sixArea span")
                  .html(res[key] + "&nbsp;&nbsp;&nbsp;")
                  .removeClass("disN");
                layero.find("#waittopack_sixArea").removeClass("disN");
              }
            }
          });
        },
        //配货表格操作[表格点击+自动跳到下一条等]
        tbodyHandle: function (layero) {
          var _this = this;
          var $tbody = layero.find("#distributeContainer_tableTbody");
          var $form = layero.find("form");
          var $sku = $form.find("[name=sku]"); //sku框
          var $stockNum = $form.find("[name=stockNum]"); //库存数量框
          var $locationCode = $form.find("[name=locationCode]"); //库位
          $tbody.on("dblclick", "tr", function () {
            var $this = $(this);
            $this.siblings().removeClass("selectTr");
            $this.addClass("selectTr");
            layero.find("[name=scanningSku]").val(""); //扫描sku输入框
            layero.find("[name=actualNum]").val(""); //实拣数量输入框
            layero.find("[name=scanningSku]").focus(); //点击tr焦点在扫描sku输入框上
            var thisTrObj = new Function(`return ${$this.data("info")}`)();
            var batchDetailsObj = new Function(
              `return ${$this.attr("batchdetails")}`
            )();
            layero
              .find(".shouldPickNum")
              .text(batchDetailsObj[0]["skuNum"] || "无数据");
            // 单位
            _this.showDistributeContainerUnit(layero, thisTrObj["unit"]);

            layero
              .find(".boxContain")
              .text(batchDetailsObj[0]["caseNo"] || "无数据");
            layero
              .find(".boxContainBag")
              .text(thisTrObj["needBag"] ? "袋" : "");
            //地址有了 但是就是不走onerror事件?
            layero.find(".distribute_img").attr("src", thisTrObj.imageUrl);
            $sku.val(thisTrObj.sku);
            $stockNum.val(thisTrObj.stockNum);
            $locationCode.val(thisTrObj.locationCode);
            $("#distribute_locationCode").text(thisTrObj.locationCode);
          });
        },
        tbodyTpl: function (data, layero) {
          var _this = this;
          var $form = layero.find("form");
          var $data = data[0];
          var $sku = $form.find("[name=sku]"); //sku框
          var $stockNum = $form.find("[name=stockNum]"); //库存数量框
          var $skuNumber = layero.find(".skuNumber"); //应拣数量
          var $locationCode = layero.find("[name=locationCode]"); //库位
          var $boxContain = layero.find(".boxContain"); //箱号容器
          var batchDetails = $data.batchDetails[0]; //应拣数据
          $sku.val($data.sku);
          $stockNum.val($data.stockNum);
          $locationCode.val($data.locationCode);
          $("#distribute_locationCode").text($data.locationCode);
          var getTpl = distributeContainer_tableTbodyTpl.innerHTML;
          var view = document.getElementById("distributeContainer_tableTbody");
          laytpl(getTpl).render(data, function (html) {
            view.innerHTML = html;
            _this.tbodyHandle(layero);
          });
        },
        //拣货完成按钮操作
        pickSuccessBtn: function (layero) {
          var _this = this;
          $("#waittopack_pickSuccessBtn").on("click", function () {
            var sku = layero.find("[name=scanningSku]").val().trim(); //sku
            var batchDetailsStr = layero.find(".selectTr").attr("batchdetails");
            var batchDetailsObj = new Function(` return  ${batchDetailsStr}`)(); //批次号
            var actualNum = layero.find("[name=actualNum]").val() || 0; //实拣数量
            var whId = layero.find("#waittopack_distribute_warehouseId").val(); //仓库Id
            if (sku == "") {
              layer.alert("未扫描SKU!", { icon: 1 });
              return;
            }
            if (actualNum == 0) {
              layer.alert("实捡数量必须有值且大于0!", { icon: 1 });
              return;
            }
            var obj = {
              sku: sku,
              pickNum: actualNum,
              batchNo: batchDetailsObj[0]["batchNo"],
              whId: whId,
            };
            _this
              .pickSuccessAjax(obj)
              .then(function (result) {
                if (
                  (!result.returnNum && result.skuNum <= result.pickNum) ||
                  (result.pickNum < result.skuNum && result.returnNum == 0)
                ) {
                  layero.find(".selectTr .pickNum").text(result.newPickNum);
                  layero
                    .find(".selectTr")
                    .removeClass("unHandledTr")
                    .addClass("handledTr");
                  var getStatisticArr = _this.computedTotalAndCurrNum(layero);
                  _this.setLayerHeaderStatistics(
                    layero,
                    getStatisticArr[0],
                    getStatisticArr[1]
                  );
                  if (+getStatisticArr[0] == +getStatisticArr[1]) {
                    return layer.open({
                      title: "提示",
                      content: "本次配货已全部完成,请重新抢单!",
                      btn: ["确认"],
                      success: function (layero1, index) {
                        this.multiPackageEnterEsc = function (event) {
                          if (event.keyCode === 13) {
                            //要做一个清空操作
                            _this.pickBlurAndClear(layero);
                            //关闭弹框
                            layer.close(index);
                            return false; //阻止系统默认回车事件
                          }
                        };
                        $(document).on("keydown", this.multiPackageEnterEsc); //监听键盘事件，关闭层
                      },
                      end: function () {
                        $(document).off("keydown", this.multiPackageEnterEsc); //解除键盘关闭事件
                      },
                      yes: function (index) {
                        layer.close(index);
                      },
                    });
                  }
                  //tr的切换操作
                  _this.jumpNextTr(layero);
                  // } else if(result.pickNum<result.skuNum&&result.returnNum == 0){
                  //     // 2852 【配货】实捡数量小于应拣数量且无需放回时，取消弹框提醒
                  //     layero.find('.selectTr .pickNum').text(result.newPickNum);
                  //     layero.find('.selectTr').removeClass('unHandledTr').addClass('handledTr');
                } else {
                  _this.pickSuccessLayer(layero, result);
                }
                //_this.showPartitionRemaining(layero,layero.find("#waittopack_distribute_warehouseId").val()); //显示分区剩余
              })
              .catch(function (err) {
                layer.msg(err || "拣货失败", { icon: 2 });
              });
          });
          // _this.showPartitionRemaining(layero,layero.find("#waittopack_distribute_warehouseId").val()); //显示分区剩余
        },
        //拣货批次完成以后清空,失焦
        pickBlurAndClear: function (layero) {
          layero.find("[name=actualNum]").blur(); //失焦
          layero.find("[name=batchNo]").val(""); //批次号
          layero.find("#distribute_locationCode").text(""); //库位
          layero.find("[name=locationCode]").val("");
          layero.find("[name=sku]").val(""); //sku
          layero.find("[name=stockNum]").val(""); //库存数量
          layero.find("[name=scanningSku]").val(""); //扫描sku
          layero.find("[name=actualNum]").val(""); //实践数量
          layero.find(".shouldPickNum").text("");
          layero.find(".boxContainBag").text("");
          layero.find(".boxContain").text("");
          layero
            .find(".distribute_img")
            .attr("src", "/lms/static/img/kong.png");
        },
        //函数防抖
        debounce: function (func, wait) {
          let timeout;
          return function () {
            let context = this;
            let args = arguments;

            if (timeout) clearTimeout(timeout);

            let callNow = !timeout;
            timeout = setTimeout(() => {
              timeout = null;
            }, wait);

            if (callNow) func.apply(context, args);
          };
        },
        //缺货待拣
        lackProdWaitBtn: function (layero) {
          var _this = this;
          $("#waittopack_lackProdWaitBtn").on("click", function () {
            var batchNo = layero.find("[name=batchNo]").val();
            var sku = layero.find("[name=sku]").val();
            var actualNum = layero.find("[name=actualNum]").val() || 0; //实拣数量
            var whId = layero.find("#waittopack_distribute_warehouseId").val(); //仓库Id
            if (!batchNo || !sku) {
              return layer.msg("请先获取订单或抢单", { icon: 2 });
            }
            var obj = {
              sku: sku,
              pickNum: actualNum,
              batchNo: batchNo,
              whId: whId,
            };
            layer.confirm(`是否标记选择的SKU[${sku}]为缺货吗?`, {
              icon: 3,
              title: "提示",
              success: function (layerosuccess, index) {
                $(document).on("keydown", function (event) {
                  if (event.keyCode == 13) {
                    $(layerosuccess).find(".layui-layer-btn0").click();
                    return false;
                  }
                });
              },
              yes: function (indexyes, layeroyes) {
                _this
                  .pickSuccessAjax(obj)
                  .then(function (result) {
                    if (!result.returnNum) {
                      layero.find(".selectTr .pickNum").text(result.newPickNum);
                      layero
                        .find(".selectTr")
                        .removeClass("unHandledTr")
                        .addClass("handledTr")
                        .addClass("lackHandledTr");
                      var getStatisticArr =
                        _this.computedTotalAndCurrNum(layero);
                      _this.setLayerHeaderStatistics(
                        layero,
                        getStatisticArr[0],
                        getStatisticArr[1]
                      );
                      // layero.find('.selectTr').next().trigger('dblclick');
                      //判断是否拣货完成[true是完成]
                      if (+getStatisticArr[0] == +getStatisticArr[1]) {
                        return layer.alert("本次配货已全部完成,请重新抢单", {
                          icon: 1,
                        });
                      }
                      //tr的切换操作
                      _this.jumpNextTr(layero);
                      // } else if(result.pickNum<result.skuNum&&result.returnNum == 0){
                      //     // 2852 【配货】实捡数量小于应拣数量且无需放回时，取消弹框提醒
                    } else {
                      _this.pickSuccessLayer(layero, result);
                    }
                  })
                  .catch(function (err) {
                    layer.msg(err || "拣货失败", { icon: 2 });
                  });
                layer.close(indexyes);
              },
              end: function () {
                $(document).off("keydown", function (event) {
                  if (event.keyCode == 13) {
                    return false;
                  }
                });
              },
            });
          });
        },
        //跳转到下一个tr的处理
        jumpNextTr: function (layero) {
          //获取到所有的tr,找到当前tr,向后循环找到第一个不含类名handledTr的tr
          var $trs = layero.find("#distributeContainer_tableTbody").find("tr");
          var startIndex = 0;
          for (var i = 0; i < $trs.length; i++) {
            var item = $trs[i];
            if ($(item).hasClass("selectTr")) {
              startIndex = i;
              break;
            }
          } //完成获取当前选中的tr
          var firstNoHandleTrIndex = 0;
          for (var j = startIndex; j < $trs.length; j++) {
            var item = $trs[j];
            if (!$(item).hasClass("handledTr")) {
              firstNoHandleTrIndex = j;
              break;
            }
          }
          $($trs[firstNoHandleTrIndex]).trigger("dblclick");
          $("#distributeContainer_tableTbody").scrollTop(
            $($trs[firstNoHandleTrIndex]).outerHeight() * firstNoHandleTrIndex
          );
        },
        //拣货完成弹框
        pickSuccessLayer: function (layero, result) {
          var _this = this;
          var pickSuccessIndex = layer.open({
            type: 1,
            title: "提示",
            area: ["600px", "300px"],
            btn: ["确定"],
            content: $("#pickSuccessLayer").html(),
            move: false,
            id: "pickSuccessLayerId",
            success: function () {
              var getTpl = pickSuccessLayerContainerTpl.innerHTML,
                view = document.getElementById("pickSuccessLayerContainer");
              laytpl(getTpl).render(result, function (html) {
                view.innerHTML = html;
                this.pickSuccessEnterEsc = function (event) {
                  if (event.keyCode === 13) {
                    layero.find(".selectTr .pickNum").text(result.newPickNum);
                    layero.find(".selectTr").addClass("handledTr");
                    //tr的切换操作
                    layer.close(pickSuccessIndex);
                    _this.jumpNextTr(layero);
                    return false; //阻止系统默认回车事件
                  }
                };
                $(document).on("keydown", this.pickSuccessEnterEsc);
              });
            },
            yes: function () {
              //已处理
              layero.find(".selectTr .pickNum").text(result.newPickNum);
              layero.find(".selectTr").addClass("handledTr");
              // layero.find('.selectTr').next().trigger('dblclick');
              //tr的切换操作
              _this.jumpNextTr(layero);
              layer.close(pickSuccessIndex);
            },
            end: function () {
              $(document).off("keydown", this.pickSuccessEnterEsc); //解除键盘关闭事件
            },
            //重新拣货不做操作
          });
        },
        //获取区域剩余
        getAreaRemainingAjax: function (whId) {
          return commonReturnPromise({
            url: "/lms/pickpackorder/surpluspickbatch.html?whId=" + whId,
          });
        },
        //获取楼栋
        getBuildingAjax: function (warehouseId) {
          return commonReturnPromise({
            url: "/lms/skuLocationTransfer/getBuildingNo.html",
            type: "post",
            contentType: "application/json",
            params: JSON.stringify({
              warehouseId: warehouseId,
            }),
          });
        },
        //获取楼层
        getFloorAjax: function (warehouseId) {
          return commonReturnPromise({
            url: "/lms/winitDimensionMeasure/getFloorNo.html",
            type: "post",
            params: {
              warehouseId: warehouseId,
            },
          });
        },
        //排序问题
        sortHandle: function (id) {
          $("#" + id).on("click", function () {
            $(this).addClass("layui-icon-active");
            if (id.indexOf("up") > 0) {
              $("#sortIconClass_downSort").removeClass("layui-icon-active");
            } else {
              $("#sortIconClass_upSort").removeClass("layui-icon-active");
            }
            var $trs = $("#distributeContainer_tableTbody").find("tr");
            var sortArr = [];
            for (var i = 0; i < $trs.length; i++) {
              var tr = $trs[i];
              var locationCode = $(tr).find("td:nth-child(3)").text();
              var obj = {};
              obj.tr = tr.outerHTML;
              obj.locationCode = locationCode;
              sortArr.push(obj);
            }
            //给sortArr进行排序
            sortArr.sort(function (a, b) {
              var nameA = a.locationCode.toUpperCase();
              var nameB = b.locationCode.toUpperCase();
              if (nameA < nameB) {
                return -1;
              }
              if (nameA > nameB) {
                return 1;
              }
              return 0;
            });
            //清空原来的toby,增加现在的tbody
            var newTrArr = sortArr.map(function (item) {
              return item.tr;
            });
            $("#distributeContainer_tableTbody").html("");
            if (id.indexOf("up") > 0) {
              $("#distributeContainer_tableTbody").append(newTrArr.join());
            } else {
              $("#distributeContainer_tableTbody").append(
                newTrArr.reverse().join()
              );
            }
          });
        },
        //#endregion ---- 配货操作end

        //#region ---- 设置分拣批次start
        setHandle: function () {
          var $btn = $("#waittopack_setBtn");
          var _this = this;
          $btn.on("click", function () {
            var index = layer.open({
              type: 1,
              title: "设置分拣批次",
              area: ["100%", "100%"],
              btn: ["关闭"],
              content: $("#waittopack_setLayer").html(),
              id: "waittopack_setLayerId",
              success: function (layero, index) {
                form.render();
                _this.renderSearchLayer(layero);
                _this.searchBatchNo(layero);
                _this.generatorSort(layero);
                _this.renderBatchNo();
                $("#waittopack_batchNoLayerIcon").on("click", function () {
                  _this.renderBatchNo();
                });
                _this.policyHandle(layero);

                _this.printSortHandle();
                _this.printLogisticsHandle();
                _this.printLogisticsSKUNo();
                _this.setWatchWarehouseSel(layero);
                _this.enterSortOrderNumberLinkage(layero);

                $("#waittopackSearch_export").on("click", function () {
                  var data = $(this).parents("form").serializeObject();
                  if (data.urgent == "on") {
                    data.urgent = true;
                  } else {
                    data.urgent = false;
                  }
                  if (data.sameArea == "on") {
                    data.sameArea = true;
                  } else {
                    data.sameArea = false;
                  }
                  if (!data.orderNum) {
                    return layer.msg("订单数量必填", { icon: 7 });
                  }
                  if (!data.pickUserId) {
                    //默认抢单
                    data.assignPickUser = false;
                  } else if (data.pickUserId == "assignPickUser") {
                    data.pickUserId = "";
                    data.assignPickUser = true;
                  } else {
                    data.assignPickUser = false;
                  }
                  if (data.batchNo) {
                    data.batchNo = "";
                  }
                  submitForm(
                    data,
                    ctx + "/pickpackorder/exportunpickbatch.html",
                    "_blank"
                  );
                });
              },
              end: function () {
                sessionStorage.removeItem("SETPRINTDATA");
              },
            });
          });
        },
        //根据策略来生成功能
        policyHandle: function (layero) {
          //渲染策略
          commonReturnPromise({
            url: "/lms/pickpackorder/getEnablePickBatchRule.html",
          }).then((res) => {
            commonRenderSelect("waittopack_selectpolicy", res, {
              name: "ruleName",
              code: "id",
              str: '<option value="">选择策略</option>',
            }).then(() => {
              formSelects.render("waittopack_selectpolicy");
            });
          });
          //操作策略
          $("#waittopack_basicAsPolicyBtn").on("click", function () {
            let urgent = layero.find("[name=urgent]").is(":checked");
            let warehouseId = layero.find("select[name=warehouseId]").val();
            let rulesArr = formSelects.value("waittopack_selectpolicy");
            if (!rulesArr.length) {
              return layer.msg("请选择策略", { icon: 7 });
            }
            let ruleIdsArr = rulesArr.map((item) => item.val);
            let ruleNamesArr = rulesArr.map((item) => item.name);
            let warehouseName = $(
              "#waittopack_prodWarehousesLayer option:selected"
            ).text();
            commonReturnPromise({
              url: "/lms/pickpackorder/getPickOrderNumByRule.html",
              type: "post",
              params: {
                warehouseId: warehouseId,
                ruleIds: ruleIdsArr.join(","),
              },
            }).then((res) => {
              let str = `请确认${warehouseName}的${
                urgent ? "" : "非"
              }紧急批次的策略:${ruleNamesArr.join(",")},${res}`;
              layer.confirm(str, { icon: 3, title: "提示", area: ['600px', '600px'] }, function (index) {
                commonReturnPromise({
                  url: "/lms/pickpackorder/createpickbatchByRule.html",
                  type: "post",
                  params: {
                    warehouseId: warehouseId,
                    ruleIds: ruleIdsArr.join(","),
                    urgent: urgent,
                  },
                }).then((res) => {
                  let detailInfo = '';
                  if(res.resultMap && Object.keys(res.resultMap).length>0){
                    for(let key in res.resultMap){
                      detailInfo += `<div>策略名{${key}}生成批次号: ${res.resultMap[key]}</div>`
                    }
                  }
                  let resInfo = `
                      <div>生成${res.batchNum}个批次共${res.orderNum}笔订单,其中</div>
                  `;
                  layer.open({
                    title: `提示`,
                    content: resInfo+detailInfo,
                    btn: ["确认"],
                    area: ["600px", "400px"],
                    success: function (layero, index) {
                      this.enterEsc = function (event) {
                        if (event.keyCode === 13) {
                          layer.close(index);
                          return false; //阻止系统默认回车事件
                        }
                      };
                      $(document).on("keydown", this.enterEsc); //监听键盘事件，关闭层
                    },
                    yes: function (index) {
                      layer.close(index);
                    },
                    end: function () {
                      $(document).off("keydown", this.enterEsc); //解除键盘关闭事件
                    },
                  });
                });
              });
            });
          });
        },
        //分简单号可以输入的联动效果
        enterSortOrderNumberLinkage: function (layero) {
          var _this = this;
          form.on("select(batchNo)", function (data) {
            $("#enterSortOrderNumber").val(data.value);
            _this.renderBasketNo(layero, data.value);
          });
          $("#enterSortOrderNumber").change(() => {
            let data = $("#enterSortOrderNumber").val();
            _this.renderBasketNo(layero, data);
          });
        },

        setWatchWarehouseSel: function (layero) {
          var _this = this;
          form.on("select(waittopack_setWarehouseId)", function (obj) {
            var val = obj.value;
            var $building = layero.find("[name=buildingNo]");
            var $floor = layero.find("[name=floorNo]");
            if (val == "") {
              $building.html("");
              $floor.html("");
              form.render();
              return;
            }
            _this
              .allLocationCodeInitials({ warehouseId: val })
              .then((result) => {
                let locationCodeInitials = [];
                result.forEach((item) => {
                  let obj = {
                    name: "",
                    id: "",
                  };
                  obj.name = item;
                  obj.id = item;
                  locationCodeInitials.push(obj);
                });
                commonRenderSelect(
                  "waittopack_locationCodeInitials",
                  locationCodeInitials,
                  { name: "name", code: "id" }
                ).then(function () {
                  formSelects.render("xm_waittopack_locationCodeInitials");
                });
              });

            _this.setWatchWarehouseRenderFloorAndBuilding(layero, val);
          });
        },
        setWatchWarehouseRenderFloorAndBuilding: function (layero, val) {
          var _this = this;
          var $building = layero.find("[name=buildingNo]");
          var $floor = layero.find("[name=floorNo]");
          // console.log(" $building", $building);
          Promise.all([_this.getBuildingAjax(val), _this.getFloorAjax(val)])
            .then(function (result) {
              var buildingArr = result[0];
              var floorArr = result[1];
              function optionList(result) {
                let arr = [];
                result.forEach((item) => {
                  let obj = {
                    name: "",
                    id: "",
                  };
                  obj.name = item;
                  obj.id = item;
                  arr.push(obj);
                });
                return arr;
              }
              // commonRenderSelect('waittopack_buildingNo',optionList(buildingArr), { name: 'name', code: 'id' }).then(function(){
              //     formSelects.render('xm_waittopack_buildingNo');
              // })
              // commonRenderSelect('waittopack_floorNo',optionList(floorArr), { name: 'name', code: 'id' }).then(function(){
              //     formSelects.render('xm_waittopack_floorNo');
              // })
              function optionStr(arr) {
                var str = '<option value="">请选择</option>';
                for (var i = 0; i < arr.length; i++) {
                  str += `<option value="${arr[i]}">${arr[i]}</option>`;
                }
                return str;
              }
              $building.html(optionStr(buildingArr));
              $floor.html(optionStr(floorArr));
              formSelects.render("xm_waittopack_logisTypeIdsLayer");
              formSelects.render("xm_waittopack_floorNo");
              formSelects.render("xm_waittopack_buildingNo");
              form.render();
            })
            .catch(function (err) {
              layer.msg(JSON.stringify(err), { icon: 2 });
            });
        },
        //生成分拣单子
        generatorSort: function (layero) {
          var _this = this;
          form.on("submit(waittopackSearch_set)", function (data) {
            var data = data.field; //获取到表单提交对象
            if (data.urgent == "on") {
              data.urgent = true;
            } else {
              data.urgent = false;
            }
            if (data.sameArea == "on") {
              data.sameArea = true;
            } else {
              data.sameArea = false;
            }
            if (!data.orderNum) {
              return layer.msg("订单数量必填", { icon: 7 });
            }
            if (!data.platOrderIds) {
              if (
                $("select[name=orderType] option:selected").text() == "订单编号"
              ) {
                return layer.msg("订单编号必填", { icon: 7 });
              }
            }
            if (!data.pickUserId) {
              //默认抢单
              data.assignPickUser = false;
            } else if (data.pickUserId == "assignPickUser") {
              data.pickUserId = "";
              data.assignPickUser = true;
            } else {
              data.assignPickUser = false;
            }
            data.batchNo = data.enterSortOrderNumber;
            delete data.enterSortOrderNumber;
            if (data.batchNo) {
              data.batchNo = "";
            }
            // data.orderTimeStart = $("#waittopack_time").val()
            //   ? $("#waittopack_time").val().split(" - ")[0]
            //   : "";
            // data.orderTimeEnd = $("#waittopack_time").val()
            //   ? $("#waittopack_time").val().split(" - ")[1]
            //   : "";
            _this
              .getSortAjax(data)
              .then(function (result) {
                // _this.setTableRender(result);
                if (!!result.surplus) {
                  layer.confirm(
                    `已生成批次号,批次号:${result.batchNos},${result.noLocationSku}<div>剩余订单数量${result.surplus},是否继续分批？</div>`,
                    {
                      icon: 3,
                      yes: function (layerbatchNo, index) {
                        //确认后，不满足批次数量也生成
                        data.confirm = true;
                        _this.getSortAjax(data).then(function (resultInner) {
                          layer.alert(
                            `生成批次号成功,批次号:${resultInner.batchNos},${result.noLocationSku}`,
                            { icon: 1 }
                          );
                        });
                      },
                    }
                  );
                } else {
                  layer.alert(`生成批次号成功,批次号:${result.batchNos}`, {
                    icon: 1,
                  });
                }
              })
              .catch(function (err) {
                layer.msg(err || "生成分拣单失败", { icon: 2 });
              });
          });
        },
        // 查询分拣单号
        searchBatchNo: function (layero) {
          var _this = this;

          var $btn = layero.find("#waittopack_set_batchNo"); //搜索分拣单
          var $batchNo = layero.find("[name=enterSortOrderNumber]"); //分拣单号

          $btn.on("click", function () {
            var val = $batchNo.val();
            var basketNo = formSelects.value(
              "xm_waittopack_basketNO",
              "valStr"
            );
            var locationCode = formSelects.value(
              "xm_waittopack_locationCodeInitials",
              "valStr"
            );
            if (!val) {
              return layer.msg("请选择分拣单号", { icon: 7 });
            }
            _this.setTableRender(val, basketNo, locationCode);
            // _this.getBatchNoAjax(val).then(function(result){
            //     _this.setTableRender(result);
            //     sessionStorage.setItem('SETPRINTDATA',JSON.stringify(result));
            // }).catch(function(err){
            //     layer.msg(err|| '查询分拣单号失败',{icon:2});
            // })
          });
        },
        setTableRender: function (batchNo, basketNo, locationCode) {
          // var data = data.sort(function(a,b){
          //     return a.basketNo - b.basketNo
          // })
          const _this = this;
          table.render({
            elem: "#waittopack_set_table",
            id: "waittopack_set_tableId",
            url: ctx + "/pickpackorder/getpickbatch.html",
            method: "post",
            where: {
              batchNo: batchNo,
              basketNo: basketNo,
              locationCodeInitials: locationCode,
            },
            // data: data,
            initSort: {
              field: "basketNo", //排序字段，对应 cols 设定的各字段名
              type: "asc", //排序方式  asc: 升序、desc: 降序、null: 默认排序
            },
            sort: true, //重点1：这里的sort表示 table表在取得接口数据后，对页面渲染后的table数据进行排序。同时，这里的true 会影响页面sort 上下小箭头的 显示效果
            cols: [
              [
                { title: "订单号", field: "orderId" },
                { title: "跟踪号", field: "logisTrackingNo" },
                {
                  title: "交易北京时间",
                  field: "orderTime",
                  templet:
                    "<div>{{Format(d.orderTime,'yyyy-MM-dd hh:mm:ss')}}</div>",
                },
                { title: "商品明细", field: "skuOverOv", sort: true },
                { title: "库位明细", field: "skuLocationOv", sort: true },
                {
                  title: "分拣批次号",
                  field: "batchNo",
                  templet: "<div>" + batchNo + "</div>",
                },
                { title: "拣货备注", field: "pickNote" },
                { title: "拣货人", field: "expectPickUsers" },
                { title: "篮号", field: "basketNo", sort: true },
              ],
            ],
            page: {
              //支持传入 laypage 组件的所有参数（某些参数除外，如：jump/elem） - 详见文档
              layout: ["limit", "count", "prev", "page", "next", "skip"], //自定义分页布局
              first: true, //显示首页
              last: true, //显示尾页
              limit: 300,
              limits: [100, 300, 500, 1000, 5000, 10000, 20000],
            },
            created: function (res) {
              if (res.code == "0000") {
                res.data = res.data.sort(function (a, b) {
                  return a.basketNo - b.basketNo;
                });
                // 商品明细统计，库位明细和拣货人去重
                res.data = res.data.map((item) => ({
                  ...item,
                  skuOverOv: _this.uniqueDataQuantity(item.skuOverOv),
                  skuLocationOv: _this.uniqueData(item.skuLocationOv),
                  expectPickUsers: _this.uniqueData(item.expectPickUsers),
                }));
                sessionStorage.setItem(
                  "SETPRINTDATA",
                  JSON.stringify(res.data)
                );
              }
            },
          });
        },
        // 去重
        uniqueData: function (str = "") {
          if (str !== "" && str !== undefined) {
            const strArr = str.split(",").filter((item) => item !== "");
            const _str = Array.from(new Set(strArr)).join();
            return _str;
          }
          return "";
        },
        // 去重 + 统计数量
        uniqueDataQuantity: function (str = "") {
          if (str !== "" && str !== undefined) {
            const strArr = str.split(",").filter((item) => item !== "");
            let curObj = {};
            strArr.forEach((item) => {
              let _item = item.split("*");
              if (curObj[_item[0]]) {
                curObj[_item[0]] = curObj[_item[0]] + Number(_item[1]);
              } else {
                curObj[_item[0]] = Number(_item[1]);
              }
            });
            let _strArr = [];
            for (let i in curObj) {
              _strArr.push(i + "*" + curObj[i]);
            }
            return _strArr.join();
          }
          return "";
        },
        //渲染分拣单号
        renderBatchNo: function () {
          this.listBatchNo()
            .then(function (result) {
              commonRenderSelect("waittopack_batchNoLayer", result).then(
                function () {
                  form.render("select");
                }
              );
            })
            .catch(function (err) {
              layer.msg(err || "渲染分拣单号失败", { icon: 2 });
            });
        },
        // 渲染篮号
        renderBasketNo: function (layero, basketNo) {
          this.listBasketNO(basketNo)
            .then(function (result) {
              let basketList = [];
              if (result.length <= 300) {
                result.forEach((item) => {
                  let obj = {
                    name: "",
                    id: "",
                  };
                  obj.name = item;
                  obj.id = item;
                  basketList.push(obj);
                });
              }
              commonRenderSelect("waittopack_basketNO", basketList, {
                name: "name",
                code: "id",
              }).then(function () {
                // var $floor = layero.find('[name=basketNO]');
                // function optionStr(arr) {
                //     var str = '<option value="">请选择</option>';
                //     for (var i = 0; i < arr.length; i++) {
                //         str += `<option value="${arr[i]}">${arr[i]}</option>`
                //     }
                //     return str;
                // }
                // $floor.html(optionStr(result));

                formSelects.render("xm_waittopack_basketNO");
              });
            })
            .catch(function () {
              layer.msg(err || "渲染篮号失败", { icon: 2 });
            });
        },
        //渲染搜索条件
        renderSearchLayer: function (layero) {
          var _this = this;
          Promise.all([
            _this.allLists(),
            _this.allLogisType({ logisticsCompanyId: "" }),
            _this.listLogiscoll(),
            _this.listUser(),
            _this.listBatchNo(),
          ])
            .then(function (result) {
              var platCodes = result[0]["platCodes"]; //平台
              commonRenderSelect("waittopack_platCodeLayer", platCodes).then(
                function () {
                  form.render("select");
                }
              );
              var prodWarehouses = result[0]["prodWarehouses"]; //仓库
              var prodWarehousesId = prodWarehouses.filter(
                (item) => item.value == "义乌仓"
              )[0]["name"];
              _this
                .allLocationCodeInitials({ warehouseId: prodWarehousesId })
                .then((result) => {
                  let locationCodeInitials = [];
                  result.forEach((item) => {
                    let obj = {
                      name: "",
                      id: "",
                    };
                    obj.name = item;
                    obj.id = item;
                    locationCodeInitials.push(obj);
                  });
                  commonRenderSelect(
                    "waittopack_locationCodeInitials",
                    locationCodeInitials,
                    { name: "name", code: "id" }
                  ).then(function () {
                    formSelects.render("xm_waittopack_locationCodeInitials");
                  });
                });

              commonRenderSelect(
                "waittopack_prodWarehousesLayer",
                prodWarehouses,
                {
                  name: "value",
                  code: "name",
                  selected: prodWarehousesId,
                }
              ).then(function () {
                form.render("select");
                _this.setWatchWarehouseRenderFloorAndBuilding(
                  layero,
                  prodWarehousesId
                );
              });
              var LogisTypes = result[1]; //物流方式
              commonRenderSelect("waittopack_logisTypeIdsLayer", LogisTypes, {
                name: "name",
                code: "id",
              }).then(function () {
                formSelects.render("xm_waittopack_logisTypeIdsLayer");
              });
              var listLogis = result[2]; //物流方式集
              commonRenderSelect(
                "waittopack_logisCollectionIdsLayer",
                listLogis,
                { name: "collectionName", code: "id" }
              ).then(function () {
                form.render("select");
              });
              var listUsers = result[3]; //拣货人
              commonRenderSelect("waittopack_pickUserIdLayer", listUsers, {
                name: "userName",
                code: "id",
                str: '<option value="">抢单</option><option value="assignPickUser">按指定规则</option>',
              }).then(function () {
                form.render("select");
              });
              var batchNos = result[4]; //分拣单号
              form.on("select(waittopack_setLayer_orderType)", function (obj) {
                if (obj.value == "0") {
                  layero.find("[name=orderNum]").val(100000);
                  layero.find('[name="sameArea"]').prop("disabled", true);
                  layero.find('[name="sameArea"]').prop("checked", false);
                } else if (obj.value == "1") {
                  layero.find("[name=orderNum]").val(100);
                  layero.find('[name="sameArea"]').removeAttr("disabled");
                } else {
                  layero.find("[name=orderNum]").val("");
                  layero.find('[name="sameArea"]').removeAttr("disabled");
                }
                form.render();
              });
            })
            .catch(function (err) {
              layer.msg(err || "渲染设置分拣批次搜索条件失败", { icon: 2 });
            });
        },
        //拣货单打印
        printSortHandle: function () {
          var _this = this;
          // var batchNo = "FJD202101050004";
          $("#print_packingNo").on("click", function () {
            // var batchNo = $('#enterSortOrderNumber').val();
            //反正我是觉得逻辑很怪,要求从表格取,就这样吧
            let $tagetTable = $("#waittopack_set_table").next();
            let batchNo = $tagetTable
              .find(".layui-table-body tbody>tr:first-child")
              .find("td[data-field=batchNo]")
              .text();
            var locationCode = formSelects.value(
              "xm_waittopack_locationCodeInitials",
              "valStr"
            );
            var basketNO = formSelects.value(
              "xm_waittopack_basketNO",
              "valStr"
            );

            if (batchNo == null || batchNo === "") {
              layer.msg("未获取到分拣单号！", { icon: 2 });
              return;
            }
            _this
              .printPackingOrder(batchNo, basketNO, locationCode)
              .then(function (objectData) {
                //然后组装参数去调用打印接口
                epeanPrint_plugin_fun(20, objectData);
              });
          });
        },
        // 打印配货单
        printPackingOrder: function (batchNo, basketNO, locationCode) {
          let requestStr = {
            batchNo,
            basketNo: basketNO,
            locationCodeInitials: locationCode,
          };
          return commonReturnPromise({
            url: "/lms/pickpackorder/getpickbatchsku.html",
            params: requestStr,
          });
        },

        //物流面单打印
        printLogisticsHandle: function () {
          var _this = this;
          $("#print_logisticsNo").on("click", function () {
            let sortWay = $("#waittopack_setLayerId")
              .find("th[data-field=basketNo] span.layui-table-sort")
              .attr("lay-sort");
            // var batchNo = $('#enterSortOrderNumber').val();
            let $tagetTable = $("#waittopack_set_table").next();
            let batchNo = $tagetTable
              .find(".layui-table-body tbody>tr:first-child")
              .find("td[data-field=batchNo]")
              .text();
            if (!batchNo) {
              layer.msg("未获取到分拣单号！", { icon: 2 });
              return;
            }
            var setPrintDataStr =
              sessionStorage.getItem("SETPRINTDATA") || "[]";
            var setPrintData = new Function(`return ${setPrintDataStr}`)();
            if (setPrintData.length == 0) {
              return layer.msg("没有需要打印的数据", { icon: 2 });
            }
            var orderIdArr = [];
            setPrintData.forEach(function (item) {
              let temObj = {};
              temObj.orderId = item.orderId;
              temObj.sort = item.basketNo;
              if (sortWay == "asc") {
                orderIdArr.push(temObj);
              } else {
                orderIdArr.unshift(temObj);
              }
            });
            //需要打印的数据
            _this
              .batchSheetSizeSortRe(JSON.stringify(orderIdArr))
              .then(function (result) {
                let resultDataArr = [],
                  countIndex = 0;
                for (var j = 0; j < result.length; j++) {
                  if (!result[j].logisticsLabelDto) {
                    result[j].logisticsLabelDto = {};
                    result[j].logisticsLabelDto.orderId = result[j].orderId;
                  }
                  let orderPrint = _this.packagePrintTimeOut(
                    result[j].logisticsLabelDto
                  );
                  resultDataArr.push(orderPrint);
                }
                _this.logisticsLabelPrint(0, resultDataArr);
              })
              .catch(function (err) {
                layer.msg(err || err.message, { icon: 2 });
              });
          });
        },
        logisticsLabelPrint: function (index, resultDataArr) {
          const _this = this;
          if (index === 0) {
            // 打印首部批次号
            console.log("开始打印首部批次号");
            _this.batchNoLabelPrint();
          }
          if (index >= resultDataArr.length) {
            // 正常打印结束
            _this.batchNoLabelPrint();
            console.log("打印结束，打印" + index + "张面单");
            return;
          }
          console.log("开始打印" + resultDataArr[index].orderId);
          //设置sleep时间，便于实现顺序打印
          // var delay = 2000;
          // var start = (new Date()).getTime();
          // while((new Date()).getTime() - start < delay) {
          //     continue;
          // }

          obj = resultDataArr[index];
          obj.printType = 19;
          $.ajax({
            type: "post",
            url: cur_ip,
            dataType: "json",
            data: obj,
            success: function () {
              //下一个
              _this.logisticsLabelPrint(++index, resultDataArr);
            },
            error: function (jqXHR) {
              var responseText = jqXHR.responseText;
              if (
                responseText == null ||
                responseText.indexOf("打印成功") == -1
              ) {
                //打印失败
                console.log(responseText);
                layer.confirm(
                  "{" +
                    resultDataArr[index].orderId +
                    "}无法打印面单，打印机暂停，继续打印？",
                  function (i) {
                    layer.close(i);
                    _this.logisticsLabelPrint(++index, resultDataArr);
                  },
                  function () {
                    console.log("出现错误订单点击取消，打印尾部批次号");
                    _this.batchNoLabelPrint();
                  }
                );
              } else {
                //下一个
                _this.logisticsLabelPrint(++index, resultDataArr);
              }
            },
          });
        },
        // 打印批次号
        batchNoLabelPrint: function () {
          // let batchNo = $('#enterSortOrderNumber').val();
          let $tagetTable = $("#waittopack_set_table").next();
          let batchNo = $tagetTable
            .find(".layui-table-body tbody>tr:first-child")
            .find("td[data-field=batchNo]")
            .text();
          let batchNoObj = {
            batchNo: batchNo,
            printType: 24,
            width: 100,
            height: 100,
          };
          console.log("batchNoPrint:", batchNoObj);
          batchNo_label_pdf_print(batchNoObj);
        },
        //物流面单（含SKU）打印
        printLogisticsSKUNo: function () {
          var _this = this;
          $("#print_logisticsSKUNo").on("click", function () {
            var batchNo = $("#enterSortOrderNumber").val();
            let sortWay = $("#waittopack_setLayerId")
              .find("th[data-field=basketNo] span.layui-table-sort")
              .attr("lay-sort");
            if (!batchNo) {
              layer.msg("未获取到分拣单号！", { icon: 2 });
              return;
            }
            var setPrintDataStr =
              sessionStorage.getItem("SETPRINTDATA") || "[]";
            var setPrintData = new Function(`return ${setPrintDataStr}`)();
            if (setPrintData.length == 0) {
              return layer.msg("没有需要打印的数据", { icon: 2 });
            }
            var orderIdArr = [];
            setPrintData.forEach(function (item) {
              let temObj = {};
              temObj.orderId = item.orderId;
              temObj.sort = item.basketNo;
              if (sortWay == "asc") {
                orderIdArr.push(temObj);
              } else {
                orderIdArr.unshift(temObj);
              }
            });
            const orderIdStr = orderIdArr.map((item) => item.orderId).join();

            commonReturnPromise({
              url: `/lms/logistics/v1/batch/print/skuInfoAndLogistics`,
              type: 'post',
              params: {
                orderIdStr: orderIdStr
              }
            }).then(async (result) => {
              function orderDataPrint(inntObj, sku) {
                let obj = {};
                obj.printType = 19;
                obj.orderId = inntObj.orderId;
                try {
                  obj.labelUrl = inntObj.ftpLabelUrl;
                  obj.width = inntObj.width;
                  obj.height = inntObj.height;
                  obj.printName = "100100";
                  if (obj.height === 150) {
                    obj.printName = "100150";
                  }
                } catch (err) {
                  console.log("错误信息：" + err.message);
                }
                return obj;
              }

              let resultSheet = [];
              if (sortWay == "desc") {
                resultSheet = result.successResults.reverse();
              } else {
                resultSheet = result.successResults;
              }

              let resultDataArr = [];
              for (var j = 0; j < resultSheet.length; j++) {
                // if(!resultSheet[j].logisticsLabelDto){
                //     resultSheet[j].logisticsLabelDto={};
                //     resultSheet[j].logisticsLabelDto.orderId = resultSheet[j].orderId;
                // }
                let resultDataObjOne = orderDataPrint(resultSheet[j]);
                resultDataArr.push(resultDataObjOne);
              }
              if (result.failResults && result.failResults.length > 0) {
                let str = "";
                result.failResults.forEach((item) => {
                  str += item.orderId + ": " + item.ftpLabelUrl + "<br>";
                });
                layer.alert(str, { icon: 2 });
              }
              _this.logisticsLabelPrint(0, resultDataArr);
            });
          });
        },
        //[多批次配货]打印请求
        printSortAjax: function (batchNo, orderId) {
          let requestStr = {};
          if (orderId) {
            requestStr.orderId = orderId;
          } else {
            requestStr.batchNo = batchNo;
          }
          return commonReturnPromise({
            url: "/lms/pickpackorder/getpickbatchsku.html",
            params: requestStr,
          });
        },
        //#endregion  ---- 设置分拣批次end

        //#region  ----单品包装start
        getPrintConfig: function (obj) {
          return commonReturnPromise({
            url: "/lms/order/package/print/one.html",
            params: obj
          });
        },
        singlePackageLayer: function () {
          var _this = this;
          $("#waittopack_singlePackageBtn").on("click", function () {
            layer.open({
              type: 1,
              title: "单品包装",
              area: ["100%", "100%"],
              move: false,
              content: $("#waittopack_singlePackageLayer").html(),
              id: "waittopack_singlePackageLayerId",
              success: function (layero, index) {
                form.render();
                // 批次号增加下拉单选功能
                commonReturnPromise({
                  url: ctx + "/order/package/single/batch",
                })
                  .then((res) => {
                    commonRenderSelect(
                      "waittopack_singlePackage_batchNo_select",
                      res
                    );
                  })
                  .then(() => {
                    form.render();
                    form.on(
                      "select(singlePackage_batchNo_select)",
                      function (data) {
                        layero
                          .find("input[name=singlePackage_batchNo]")
                          .val(data.value);
                      }
                    );
                  });
                //挂载事件
                _this.setLayerHeaderShowName(layero);
                _this.singlePackageScan(layero);
                _this.packageWeightHandle(layero);
                _this.cksLinkage(layero);
                _this.packageRemoveHandle(layero);
                _this.packagePrintHandle(layero);
                _this.dblTrShowViceHandle(layero);
                _this.dblTrPackingEditWeight(layero);
                //最上面的数据统计
                layero
                  .find(".layui-layer-title")
                  .append('<div class="waittopack_titleContainer"></div>');
                //打印测试页
                layero
                  .find("#singlePackage_printTestBtn")
                  .on("click", function () {
                    //打印测试页
                    let printData = function(printName){
                      let operatorNameStr = layero.find('.waittopack_titleShowName').text();
                      let operatorName = operatorNameStr.split(':')[1] || '';
                      let obj = {};
                      obj.printType = 25;
                      obj.printName = printName;
                      obj.printOperator = operatorName;
                      $.ajax({
                        type: "post",
                        url: 'http://localhost:9898',
                        dataType: "json",
                        data: obj,
                        success: function () {
                            loading.hide();
                        },
                        error: function (jqXHR) {
                            loading.hide();
                            var responseText = jqXHR.responseText;
                            // console.log(responseText);
                            if (responseText == null || responseText.indexOf("打印成功") == -1) {
                                layui.layer.msg("打印错误，请检查打印插件是否正常运行或者重新启动插件", {icon: 2});
                            }
                        }
                      });
                    }
                    printData('100100');
                    printData('100150');
                  });
              },
              end: function () {
                sessionStorage.removeItem("singlePackageSearch");
              },
            });
          });
        },
        //单品打印问题
        singleEnterConfirm(layero) {
          let _this = this;
          //扫描成功以后打印[判断是否选中]
          let $printLogisSheet = layero.find("[name=printLogisSheet]");
          let result = new Function(
            `return ${sessionStorage.getItem("singlePackageSearch")}`
          )();
          if ($printLogisSheet.is(":checked")) {
            //打印接口请求start
            _this
              .getPrintConfig({orderIdStr: result.orderId, platCode: result.platCode})
              .then(function (printResultList) {
                for(let i=0; i< printResultList.length; i++){
                  let printResult = printResultList[i];
                  result.ftpLabelUrl = printResult.ftpLabelUrl;
                  result.width = printResult.width;
                  result.height = printResult.height;
                  _this.packagePrint(result);
                }
              })
              .catch(function (printError) {
                layer.msg(printError, { icon: 2 });
              });
          }
        },
        singlePackageSearch: function (layero) {
          //单品包装查询
          var _this = this;
          var $batchNo = layero.find("[name=singlePackage_batchNo]");
          var $scanSku = layero.find("[name=singlePackage_scanSku]");
          var batchNo = $batchNo.val().trim();
          var scanSku = $scanSku.val().trim();
          // if(!batchNo){
          //     return layer.msg('请输入批次号',{icon:2});
          // }
          if (!scanSku) {
            _this.errorVoiceWarning();
            return layer.msg("请扫描SKU", { icon: 2 });
          }
          this.singlePackageAjax(batchNo, scanSku)
            .then(function (result) {
              // console.log("扫描SKU回车结果", result);
              if (result) {
                //播报语音
                if (result.voiceBroadcastStr) {
                  var speechSynthesisUtterance = new SpeechSynthesisUtterance(
                    `${result.voiceBroadcastStr}`
                  );
                  speechSynthesisUtterance.rate = 3;
                  speechSynthesis.speak(speechSynthesisUtterance);
                }
                //单品包装查询的数据保存在sessionStorage中
                sessionStorage.setItem(
                  "singlePackageSearch",
                  JSON.stringify(result)
                );
                //统计数量
                let shipNumber = result.shipNumber == undefined ? result.skuNumber: result.shipNumber;
                var divDom = `<span>剩余订单数: <span class="remianOrderNumber">${result.orderNumber}</span></span><span>总数量: ${result.skuCountNumber}</span><span>剩余数量: <span class="skuRemainingNumber">${result.skuRemainingNumber}</span></span>`;
                layero.find(".waittopack_titleContainer").html(divDom);
                layero.find("[name=prodSku]").val(result.sku);
                layero.find("[name=prodSkuCount]").val(shipNumber); //数量
                layero.find("[name=orderNumber]").val(result.orderId); //唯一的
                layero
                  .find("[name=trackNumber]")
                  .val(result.logisticsTrackingNo);
                layero.find("[name=platOrderId]").val(result.platOrderId); //设置平台订单号
                layero.find(".singlePackage_img").attr("src", result.image);
                //表格渲染成功,称重获取焦点
                if (shipNumber > 1) {
                  layero.find("[name=prodSkuCount]").focus();
                  // console.log("执行跳转操作");
                } else if (shipNumber == 1) {
                  layero.find("[name=packageWeight]").focus();
                  _this.singleEnterConfirm(layero);
                }
                if (!layero.find(`#tr${result.platOrderId}`).length) {
                  //渲染主表格
                  $("#singlePackage_left_tbody")
                    .find("tr")
                    .removeClass("dblSelected");
                  _this.packageTbodyTpl(
                    layero,
                    result,
                    "singlePackage_left_tbody"
                  );
                  var $trLen = $("#singlePackage_left_tbody").find("tr");
                  if ($trLen.length > 5) {
                    $("#singlePackage_left_tbody")
                      .find("tr:first-child")
                      .remove();
                  }
                  //渲染副表格
                  _this.packageViceTbodyTpl(layero, result);
                }
                //ztt20231101 组合品提示
                var $combinationTips = layero.find("[name=combinationTips]");
                if($combinationTips.is(":checked") && result.combinationList && result.combinationList.length > 0){
                console.log('选中状态,需要弹框展示组合品');
                _this.multiPackageCombinationLayer(result.combinationList);
                }
              }
            })
            .catch(function (err) {
              $scanSku.select();
              _this.errorVoiceWarning();
              _this.packageEnterClose(err, function () {});
              // _this.errHandle('查询信息出错', err);
            });
        },
        singlePackageScan: function (layero) {
          //单品包装扫描[执行单品包装查询事件]
          var _this = this;
          layero.on("keypress", "[name=singlePackage_batchNo]", function (e) {
            if (e.keyCode == 13) {
              //回车了
              layero.find("[name=singlePackage_scanSku]").focus();
              return false;
            }
          });
          layero.on("keypress", "[name=singlePackage_scanSku]",function (e) {
            // console.log("扫描SKU回车", e.keyCode);
            if (e.keyCode == 13) {
              //回车了
              _this.singlePackageSearch(layero);
              return false;
            }
          });
          layero.on("keypress", "[name=prodSkuCount]",_.debounce(function (e) {
            if (e.keyCode == 13) {
              //回车了
              layero.find("[name=packageWeight]").focus();
              let val = e.target.value;
              if(val>1){
                _this.singleEnterConfirm(layero);
              }
              return false;
            }
          },300));
        },
        packageTbodyTpl: function (layero, data, tbodyId) {
          //渲染表格
          var trDom;
          var strData = JSON.stringify(data);
          if (tbodyId == "multiPackage_left_tbody") {
            //处理备注开始
            let noteContent = "";
            let recentNoteContent = "";
            if (
              data.orderLabel &&
              Array.isArray(data.orderLabel) &&
              data.orderLabel.length
            ) {
              let noteContentLength = data.orderLabel.length;
              recentNoteContent =
                (data.orderLabel[noteContentLength - 1].noteType || "") +
                ":" +
                (data.orderLabel[noteContentLength - 1].noteContent || "");
              if (noteContentLength > 1) {
                noteContent = data.orderLabel
                  .map(
                    (item) =>
                      (item.noteType || "") + ":" + (item.noteContent || "")
                  )
                  .join("<br>");
              }
            }
            const noteTipsHtml = `<span class="hp-badge fr waittopack-noteContent-tag" data-text="${noteContent}" onmouseenter="waittopackBuyerTipsShow(this)" onmouseleave="waittopackBuyerTipsHide(this)">多</span>`;
            //处理备注结束
            let orderIdStr = data.detailList
              .map((item) => item.orderId)
              .join(",");
            trDom = `
                    <tr id="tr${
                      data.orderId
                    }" data-tr='${strData}' class="dblSelected">
                        <td>
                            <div class="layui-form">
                                <input type="checkbox" lay-skin="primary" data-id="${
                                  data.orderId
                                }" data-platOrderId="${orderIdStr}">
                            </div>
                        </td>
                        <td class="orderId">${data.orderId}</td>
                        <td>${data.logisticsTypeName}</td>
                        <td>${data.logisticsTrackingNo}</td>
                        <td>${data.shippingCountry}</td>
                        <td class="realPackWeight">${data.realPackWeight}</td>
                        <td class="realShippingCost">${
                          data.realShippingCost
                        }</td>
                        <td>${recentNoteContent}${
              noteContent ? noteTipsHtml : ""
            }</td>
                        <td>${data.storeAcct}</td>
                        <td>${data.prodQuantity}</td>
                    </tr>
                `;
          } else {
            //处理备注开始
            let noteContent = "";
            let recentNoteContent = "";
            if (data.notes && Array.isArray(data.notes) && data.notes.length) {
              let noteContentLength = data.notes.length;
              recentNoteContent =
                (data.notes[noteContentLength - 1].noteType || "") +
                ":" +
                (data.notes[noteContentLength - 1].noteContent || "");
              if (noteContentLength > 1) {
                noteContent = data.notes
                  .map(
                    (item) =>
                      (item.noteType || "") + ":" + (item.noteContent || "")
                  )
                  .join("<br>");
              }
            }
            const noteTipsHtml = `<span class="hp-badge fr waittopack-noteContent-tag" data-text="${noteContent}" onmouseenter="waittopackBuyerTipsShow(this)" onmouseleave="waittopackBuyerTipsHide(this)">多</span>`;
            //处理备注结束
            trDom = `
                        <tr id="tr${
                          data.platOrderId
                        }" data-tr='${strData}' class="dblSelected">
                            <td>
                                <div class="layui-form">
                                    <input type="checkbox" lay-skin="primary" data-id="${
                                      data.orderId
                                    }" data-platOrderId="${data.platOrderId}">
                                </div>
                            </td>
                            <td class="orderId">${data.orderId}</td>
                            <td>${data.logisticsTypeName}</td>
                            <td>${data.logisticsTrackingNo}</td>
                            <td>${data.shippingCountry}</td>
                            <td class="realPackWeight">${
                              data.realPackWeight
                            }</td>
                            <td class="realShippingCost">${
                              data.realShippingCost
                            }</td>
                            <td>${data.pickUserName}</td>
                            <td>${recentNoteContent}${
              noteContent ? noteTipsHtml : ""
            }</td>
                            <td>${data.storeAcct}</td>
                        </tr>
                    `;
          }
          layero.find("#" + tbodyId).append(trDom);
          form.render("checkbox");
        },
        packageViceTbodyTpl: function (layero, data) {
          let unitDom = ["个", "件", "条", "盒"].includes(data.unit)
            ? `<td style='width: 60px'>${data.unit || ""}</td>`
            : `<td class="unit" style='width: 60px'>${data.unit || ""}</td>`;
          //渲染副表格
          var trDom =
            `
                <tr id="${data.platOrderId}Vice">
                    <td>${data.orderId}</td>
                    <td>
                      <div>商品: ${data.sku}</div>
                      <div>店铺: ${data.storeSku}</div>
                    </td>
                    <td>${data.productName}</td>
                    <td>${data.style}</td>
                    <td>${data.platQuantity}</td>
                    <td>${data.skuNumber}</td>
                    <td>${data.shipNumber}</td>` +
            unitDom +
            `<td>${
              data.ifNeedQualityCheck
                ? '<span class="layui-btn layui-btn-sm layui-btn-normal" onclick="showQualityCheckHandle(this)">是</span>'
                : ""
            }
                    <input type="hidden" value='${
                      data.qualityCheckRqmt || ""
                    }' />
                    </td>
                </tr>`;
          layero.find("#singlePackage_left_viceTbody").html(trDom);
        },
        //双击单品包装的tr,显示附表数据
        dblTrShowViceHandle: function (layero) {
          var _this = this;
          layero
            .find("#singlePackage_left_tbody")
            .on("dblclick", "tr", function () {
              //增加选中样式
              $(this).siblings().removeClass("dblSelected");
              $(this).addClass("dblSelected");
              //设置辅图表格
              var result = $(this).data("tr");
              _this.packageViceTbodyTpl(layero, result);
            });
        },
        packageWeightHandle: function (layero) {
          //称重
          var _this = this;
          // var $largeTwoWarn = layero.find('[name=largeTwoWarn]'); //是否大于2kg
          layero.on("keypress", "[name=packageWeight]", _.debounce(function (e) {
            if (e.keyCode == 13) {
              var trData = new Function(
                `return ${sessionStorage.getItem("singlePackageSearch")}`
              )();
              // console.log(trData)
              var val = e.target.value; //称重的重量
              trData.realPackWeight = val; //更新实际重量
              if(!val){
                return layer.msg('称重重量不能为空', {icon:2});
              }
              _this.packageWeightAjaxHandle(layero, trData);
            }
          },300));
        },
        packageWeightAjaxHandle: function (layero, trData) {
          //称重的ajax请求处理
          var _this = this;
          if (trData.realPackWeight < 0) {
            return layer.msg("包裹重量不允许为负数", { icon: 2 });
          }
          //称重完成以后,先更新运费
          _this
            .updateFeeAjax(trData)
            .then(function (result) {
              layero.find("[name=scanSku]").focus();
              //然后拿到新的重量和运费,更新到缓存数据
              var $trDom = $(`#tr${result.platOrderId}`);
              if ($trDom.length > 0) {
                //渲染主表格
                $trDom.find(".realShippingCost").text(result.realShippingCost);
                $trDom.find(".realPackWeight").text(result.realPackWeight);
                //清空并重新获取sku焦点
                _this.clearInput(layero);
                // 更新“剩余订单数”和“剩余数量”的值
                let titleContainer = layero.find(".waittopack_titleContainer");
                let remianOrderNumber = titleContainer
                  .find(".remianOrderNumber")
                  .text();
                titleContainer
                  .find(".remianOrderNumber")
                  .text(remianOrderNumber - 1);
                let skuRemainingNumber = titleContainer
                  .find(".skuRemainingNumber")
                  .text();
                titleContainer
                  .find(".skuRemainingNumber")
                  .text(skuRemainingNumber - result.shipNumber);
              } else {
                layer.msg("没有扫描SKU,更新重量运费失败", { icon: 2 });
              }
              if (result.msg) {
                layer.msg(result.msg, { icon: 7 });
              }
              //称重完成以后清空
              _this.clearInput(layero);
            })
            .catch(function (errObj) {
              _this.errorVoiceWarning();
              if (errObj.data) {
                let $trDom = $(`#tr${errObj.data.platOrderId}`);
                if ($trDom.length > 0) {
                  $trDom
                    .find(".realPackWeight")
                    .text(errObj.data.realPackWeight);
                  $trDom
                    .find(".realShippingCost")
                    .text(errObj.data.realShippingCost);
                }
              }
              _this.packageEnterClose(errObj.msg, function () {});
            });
        },
        cksLinkage: function (layero) {
          //复选框联动
          var $tbody = layero.find("#singlePackage_left_tbody");
          form.on("checkbox(singlePackage_allChecked)", function (obj) {
            if (obj.elem.checked) {
              $tbody
                .find('input[type="checkbox"]')
                .each(function (index, item) {
                  $(item).prop("checked", true);
                });
            } else {
              $tbody
                .find('input[type="checkbox"]')
                .each(function (index, item) {
                  $(item).prop("checked", false);
                });
            }
            form.render("checkbox");
          });
        },
        packageRemoveHandle: function (layero) {
          //点击驳回订单按钮执行事件
          var _this = this;
          var $tbody = layero.find("#singlePackage_left_tbody");
          $("#singlePackage_packageERemoveBtn").on("click", function () {
            var $trs = $tbody.find("tr");
            if ($trs.length == 0) {
              return layer.msg("暂无数据", { icon: 2 });
            }
            var checkedArr = $trs.find("input:checked");
            if (checkedArr.length == 0) {
              return layer.msg("请选中需要移除的数据", { icon: 2 });
            }
            // 订单非待发货状态，【单品】
            var orderIdArr = [];
            for (var i = 0; i < checkedArr.length; i++) {
              var item = checkedArr[i];
              // if ((!$(item).parents('tr').find('.realPackWeight').text()) || (!($(item).parents('tr').find('.realPackWeight').text()).length)) {
              //     $(item).parents('tr').remove();
              //     checkedArr.splice(i, 1)
              // }else {
              var itemOrderId = $(item).data("id");
              orderIdArr.push(itemOrderId);
              // }
            }

            //执行移除功能
            if (orderIdArr && orderIdArr.length) {
              _this
                .singlePackageRemoveAjax(orderIdArr.join())
                .then(function (result) {
                  if (result.successResults.length != 0) {
                    //清空并获取焦点
                    _this.clearInput(layero);
                    layero.find("[name=scanSku]").focus();
                    //显示移除信息
                    let successResultsStr = result.successResults.join(";");
                    for (var i = 0; i < checkedArr.length; i++) {
                      var item = checkedArr[i];
                      if (successResultsStr.indexOf($(item).data("id")) != -1) {
                        $(item).parents("tr").remove();
                        $("#" + $(item).data("platorderid") + "Vice").remove();
                      }
                    }
                  }
                  // if(result.failResults.length != 0){
                  let str = `成功${result.successNum},失败${result.failNum},失败详情如下：<br>`;
                  result.failResults.forEach((item) => {
                    str += item + "<br>";
                  });
                  if (result.successNum == result.totalNum) {
                    layer.msg(`驳回成功${result.successNum}条`, { icon: 1 });
                  } else {
                    layer.alert(str, { icon: 2 });
                  }
                  // }
                  // if(result.successNum == result.totalNum){
                  //     layer.msg('驳回成功', { icon: 1 });
                  // }
                })
                .catch(function (err) {
                  _this.errHandle(err || err.message, err);
                });
            }
          });
        },
        packagePrintHandle: function (layero) {
          //打印面单按钮点击事件
          var _this = this;
          var $tbody = layero.find("#singlePackage_left_tbody");
          layero.find("#singlePackage_printBtn").on("click", function () {
            var $trs = $tbody.find("tr");
            if ($trs.length == 0) {
              return layer.msg("暂无数据", { icon: 2 });
            }
            var checkedArr = $trs.find("input:checked");
            if (checkedArr.length == 0) {
              return layer.msg("请选中需要移除的数据", { icon: 2 });
            }
            //获取orderId
            var orderIdArr = [];
            for (var i = 0; i < checkedArr.length; i++) {
              var item = checkedArr[i];
              var itemOrderId = $(item).data("id");
              orderIdArr.push(itemOrderId);
            }
            //需要打印的数据
            // _this.batchSheetSizeAjax(orderIdArr.join()).then(function(result) {
            //     for (var j = 0; j < result.length; j++) {
            //         _this.packagePrint(result[j]);
            //     }
            // }).catch(function (err) {
            //     _this.errorVoiceWarning();
            //     layer.msg(err || err.message, { icon: 2 });
            // });
            $.ajax({
              type: "POST",
              url: ctx + "/logistics/batch/print.html",
              data: { orderIdStr: orderIdArr.join() },
              beforeSend: function(){
                loading.show();
              },
              success: function (returnData) {
                loading.hide();
                var paramsMapList = returnData.successResults;
                if (paramsMapList && paramsMapList.length > 0) {
                  for (var j = 0; j < paramsMapList.length; j++) {
                    _this.packagePrint(paramsMapList[j]);
                  }
                }
                if (
                  returnData.failResults &&
                  returnData.failResults.length > 0
                ) {
                  let str = "";
                  returnData.failResults.forEach((item) => {
                    str += item + "<br>";
                  });
                  layer.alert(str, { icon: 2 });
                }
              },
              error: function (err) {
                loading.hide();
                console.log(err);
              },
            });
          });
        },
        clearInput: function (layero) {
          layero.find("[name=singlePackage_scanSku]").select().focus();
          layero.find("[name=prodSku]").val("");
          layero.find("[name=prodSkuCount]").val("");
          layero.find("[name=orderNumber]").val("");
          layero.find("[name=trackNumber]").val("");
          layero.find("[name=packageWeight]").val("");
          layero.find("[name=platOrderId]").val("");
        },
        //#endregion ----单品包装end

        //#region 多品包装start
        multiPackageLayer: function () {
          var _this = this;
          $("#waittopack_multiPackageBtn").on("click", function () {
            layer.open({
              type: 1,
              title: "多品包装",
              area: ["100%", "100%"],
              move: false,
              content: $("#waittopack_multiPackageLayer").html(),
              id: "waittopack_multiPackageLayerId",
              success: function (layero, index) {
                form.render();
                layero.find("[name=scanVal]").focus();
                //挂在执行的函数
                _this.setLayerHeaderShowName(layero);
                _this.multiPackageScan(layero); //扫描搜索功能
                _this.multiPackageWeightHandle(layero); //称重
                _this.multiPackageRemoveHandle(layero); //移除
                _this.multiCksLinkage(layero);
                _this.multiPackagePrintHandle(layero);
                _this.multiPackageCompleteHandle(layero); // 包装完成
                _this.multidblTrPackingEditWeight(layero); //双击修改包裹重量
                _this.multiRenderRemark(layero);
                //打印测试页
                layero
                  .find("#multiPackage_packagePrintTestBtn")
                  .on("click", function () {
                    //打印测试页
                    let printData = function(printName){
                      let operatorNameStr = layero.find('.waittopack_titleShowName').text();
                      let operatorName = operatorNameStr.split(':')[1] || '';
                      let obj = {};
                      obj.printType = 25;
                      obj.printName = printName;
                      obj.printOperator = operatorName;
                      $.ajax({
                        type: "post",
                        url: 'http://localhost:9898',
                        dataType: "json",
                        data: obj,
                        success: function () {
                            loading.hide();
                        },
                        error: function (jqXHR) {
                            loading.hide();
                            var responseText = jqXHR.responseText;
                            // console.log(responseText);
                            if (responseText == null || responseText.indexOf("打印成功") == -1) {
                                layui.layer.msg("打印错误，请检查打印插件是否正常运行或者重新启动插件", {icon: 2});
                            }
                        }
                      });
                    }
                    printData('100100');
                    printData('100150');
                  });
              },
              end: function () {
                //多品包装查询的数据保存在sessionStorage中
                sessionStorage.removeItem("multiPackageSearch");
              },
            });
          });
        },
        multiPackageSearch: function (layero) {
          //多品扫描搜索功能
          var _this = this;
          var queryType = layero.find("[name=queryType]:checked").val(); //扫描类型
          var $scanVal = layero.find("[name=scanVal]"); //扫描值
          var scanVal = $scanVal.val();
          if (!scanVal) {
            _this.errorVoiceWarning();
            return layer.msg("请扫描值", { icon: 2 });
          }
          _this
            .multiPackageAjax(queryType, scanVal)
            .then(function (result) {
              //播报语音
              if (result.voiceBroadcastStr) {
                var speechSynthesisUtterance = new SpeechSynthesisUtterance(
                  `${result.voiceBroadcastStr}`
                );
                speechSynthesisUtterance.rate = 3;
                speechSynthesis.speak(speechSynthesisUtterance);
              }
              //多品包装查询的数据保存在sessionStorage中
              sessionStorage.setItem(
                "multiPackageSearch",
                JSON.stringify(result)
              );
              //判断是否可以新增
              if (_this.multiPackageJudgeOrder(layero, result)) {
                $scanVal.select();
                _this.errorVoiceWarning();
                return layer.msg("订单编号已存在", { icon: 7 });
              }
              //渲染表格
              $("#multiPackage_left_tbody")
                .find("tr")
                .removeClass("dblSelected");
              _this.packageTbodyTpl(layero, result, "multiPackage_left_tbody");
              var $trLen = $("#multiPackage_left_tbody").find("tr");
              if ($trLen.length > 5) {
                $("#multiPackage_left_tbody").find("tr:first-child").remove();
              }
              //渲染附表
              _this.multiPackageViceTbodyTpl(layero, result.detailList);
              //渲染收件国家,物流方式,跟踪号
              layero
                .find("[name=shippingCountry]")
                .val(result.shippingCountry || "无数据");
              layero
                .find("[name=logisticsTypeName]")
                .val(result.logisticsTypeName || "无数据");
              layero
                .find("[name=logisticsTrackingNo]")
                .val(result.logisticsTrackingNo || "无数据");
              layero.find("[name=orderId]").val(result.orderId);
              layero.find("[name=platOrderId]").val(result.platOrderId);
              //包裹重量获取焦点
              layero.find("[name=packageWeight]").focus();

              //扫描成功以后打印[判断是否选中]
              var $multiPrintLogisSheet = layero.find("[name=isPrintOrder]");
              if ($multiPrintLogisSheet.is(":checked")) {
                //打印接口请求start
                _this
                  .getPrintConfig({orderIdStr: result.orderId, platCode: result.platCode})
                  .then(function (printResultList) {
                    for(let i=0; i< printResultList.length; i++){
                      let printResult = printResultList[i];
                      result.ftpLabelUrl = printResult.ftpLabelUrl;
                      result.width = printResult.width;
                      result.height = printResult.height;
                      _this.packagePrint(result);
                    }
                  })
                  .catch(function (printError) {
                    layer.msg(printError, { icon: 2 });
                  });
              }else{
                _this
                  .getPrintConfig({orderIdStr: result.orderId, platCode: result.platCode, onlyGoodsLable: true})
                  .then(function (printResultList) {
                    for(let i=0; i< printResultList.length; i++){
                      let printResult = printResultList[i];
                      result.ftpLabelUrl = printResult.ftpLabelUrl;
                      result.width = printResult.width;
                      result.height = printResult.height;
                      _this.packagePrint(result);
                    }
                  })
                  .catch(function (printError) {
                    layer.msg(printError, { icon: 2 });
                  });
              }
              //ztt20231101组合品提示功能[判断是否弹框]
              var $combinationTips = layero.find("[name=combinationTips]");
              if($combinationTips.is(":checked") && result.combinationList && result.combinationList.length > 0){
                console.log('选中状态,需要弹框展示组合品');
                _this.multiPackageCombinationLayer(result.combinationList);
              }
            })
            .catch(function (err) {
              $scanVal.select();
              _this.errorVoiceWarning();
              _this.packageEnterClose(err, function () {});
              // _this.errHandle('多品扫描请求错误', err);
            });
        },
        //ztt20231102-组合品详情弹框
        multiPackageCombinationLayer(combData){
          let containerStr='<div style="padding:20px;">';
          for(let i=0; i<combData.length; i++){
            let data = combData[i];
            let itemStr = '<div>';
            let titleStr = `<div style="margin-bottom:15px;">
                        <span>组合品SKU: ${data.combSku}</span>
                        <span style="margin:0 15px;">
                          基础商品SKU种类: <font size="4" color="red">${data.basicsProdkindNum}</font>
                        </span>
                        <span>组合品商品数量: ${data.combNum}</span>
                      </div>`;
            let prodList = data.basicsProdList || [];
            let ulStr = '<div><ul style="display: flex;justify-content: start;flex-wrap: wrap;">';
            prodList.forEach(item => {
              let liStr = `<li class="searchSupply-li">
              <a>
              <img width="120" height="120" data-original="${item.basicsProdImageUrl}" class="img_show_hide b1 lazy" data-onerror="layui.admin.img_noFind()" />
              </a>
              <div class="searchSupply-li-div">
                <div><span class="gray">基础商品:</span> ${item.basicsProdSku}</div>
                <div><span class="gray">单位:</span>个</div>
                <div><span class="gray">数量:</span><font size="4" color="red">${item.basicsProdNum}</font></div>
              </div>
              </li>`;
              ulStr += liStr;
            });
            //拼凑ul
            ulStr += '</ul></div>';
            //拼凑item
            itemStr += titleStr + ulStr + '</div>';
            //拼凑container
            containerStr += itemStr;
          }
          //完成container
          containerStr += '</div>';
          //弹框处理
          layer.open({
            type : 1,
            title: '组合品提示',
            area: ['70%', '70%'],
            btn: ['关闭'],
            content: containerStr,
            id: Date.now(),
            success:function(){
              imageLazyload();
            }
          });
        },
        multiPackScanValFilter: function (layero, event) {
          //跟踪号过滤
          return new Promise(function (resolve, reject) {
            var val = event.target.value;
            var $trackNumFilter = layero.find("[name=trackNumFilter]");
            var $trackNumFilterBrackets = layero.find("[name=trackNumFilterBrackets]");
            var $trackNumFilterFront = layero.find(
              "input[name=trackNumFilterFront]"
            );
            var $trackNumFilterAfter = layero.find(
              "input[name=trackNumFilterAfter]"
            );
            var isTrackNumFilter = $trackNumFilter.is(":checked");
            var isTrackNumFilterBrackets = $trackNumFilterBrackets.is(':checked');
            var frontVal = $trackNumFilterFront.val().trim();
            var afterVal = $trackNumFilterAfter.val().trim();
            if (isTrackNumFilter) {
              if (!frontVal && !afterVal) {
                $(event.target).select();
                // return layer.msg('请输入过滤条件', { icon: 7 });
                reject("请输入过滤条件");
              }
              if (frontVal && !isNaN(frontVal)) {
                event.target.value = val.slice(frontVal);
              } else if (frontVal && isNaN(frontVal)) {
                // return layer.msg('请输入数字', { icon: 7 });
                $trackNumFilterFront.select();
                reject("不允许输入非数字");
              }
              if (afterVal && !isNaN(afterVal)) {
                var newVal = event.target.value;
                event.target.value = newVal.slice(0, newVal.length - afterVal);
              } else if (afterVal && !isNaN(afterVal)) {
                // return layer.msg('请输入数字', { icon: 7 });
                $trackNumFilterAfter.select();
                reject("不允许输入非数字");
              }
            }
            if(isTrackNumFilterBrackets){
              let regex = /\[([^[\]]*)\]/g;
              event.target.value = event.target.value.replace(regex, "$1");
            }
            resolve();
          });
        },
        //判断订单编号是否存在,存在就不添加
        multiPackageJudgeOrder: function (layero, result) {
          var trs = layero.find("#multiPackage_left_tbody>tr");
          var orderIdArr = [];
          for (var i = 0; i < trs.length; i++) {
            var item = trs[i];
            var orderId = $(item).find("input").data("id");
            orderIdArr.push(orderId);
          }
          return orderIdArr.includes(result.orderId);
        },
        multiPackageScan: function (layero) {
          //扫描值
          var _this = this;
          layero.on("keypress", "[name=scanVal]", function (e) {
            if (e.keyCode == 13) {
              //回车了
              _this
                .multiPackScanValFilter(layero, e)
                .then(() => {
                  _this.multiPackageSearch(layero);
                })
                .catch((err) => {
                  return layer.msg(err, { icon: 7 });
                });
              return false;
            }
          });
        },
        multiCksLinkage: function (layero) {
          //复选框联动
          var $tbody = layero.find("#multiPackage_left_tbody");
          form.on("checkbox(multiPackage_allChecked)", function (obj) {
            if (obj.elem.checked) {
              $tbody
                .find('input[type="checkbox"]')
                .each(function (index, item) {
                  $(item).prop("checked", true);
                });
            } else {
              $tbody
                .find('input[type="checkbox"]')
                .each(function (index, item) {
                  $(item).prop("checked", false);
                });
            }
            form.render("checkbox");
          });
        },
        multiPackageWeightHandle: function (layero) {
          //称重
          var _this = this;
          layero.on(
            "keypress",
            "[name=packageWeight]",
            _.debounce(function (e) {
              if (e.keyCode == 13) {
                // var $largeTwoWarn = layero.find('[name=largeTwoWarn]'); //是否大于2kg
                var trData = new Function(
                  `return ${sessionStorage.getItem("multiPackageSearch")}`
                )();
                var val = e.target.value;
                if (!val) {
                  //包裹重量获取焦点
                  layero.find("[name=packageWeight]").focus();
                  _this.errorVoiceWarning();
                  return layer.msg("重量不能为空", { icon: 2 });
                }
                trData.realPackWeight = val; //更新实际重量
                //称重完成以后,先更新运费
                var orderId = layero.find("[name=orderId]").val();
                var platOrderId = layero.find("[name=platOrderId]").val();
                if (!orderId || !platOrderId) {
                  return layer.msg("请先扫描", { icon: 2 });
                }
                _this.multiPackageWeightAjaxHandle(layero, trData);
              }
            }, 300)
          );
        },
        multiPackageWeightAjaxHandle: function (layero, trData) {
          //称重的ajax处理
          var _this = this;
          if (trData.realPackWeight < 0) {
            return layer.msg("包裹重量不允许为负数", { icon: 2 });
          }
          _this
            .multiUpdateFeeAjax(trData)
            .then(function (result) {
              //获取到元素
              var $trDom = $(`#tr${result.orderId}`);
              if ($trDom.length > 0) {
                $trDom.find(".realPackWeight").text(result.realPackWeight);
                $trDom.find(".realShippingCost").text(result.realShippingCost);
                //清空并重新获取焦点
                _this.multiClearInput(layero);
              } else {
                layer.msg("没有扫描SKU,更新重量运费失败", { icon: 2 });
              }
              if (result.msg) {
                layer.msg(result.msg, { icon: 7 });
              }
            })
            .catch(function (errObj) {
              // console.log(errObj);
              _this.errorVoiceWarning();
              if (errObj.data) {
                let $trDom = $(`#tr${errObj.data.orderId}`);
                if ($trDom.length > 0) {
                  $trDom
                    .find(".realPackWeight")
                    .text(errObj.data.realPackWeight);
                  $trDom
                    .find(".realShippingCost")
                    .text(errObj.data.realShippingCost);
                  //清空并重新获取焦点
                  _this.multiClearInput(layero);
                }
              }
              _this.packageEnterClose(errObj.msg, function () {});
            });
        },
        //双击多品包装的tr,显示附表数据
        dblTrShowViceHandle: function (layero) {
          var _this = this;
          layero
            .find("#multiPackage_left_tbody")
            .on("dblclick", "tr", function () {
              //增加选中样式
              $(this).siblings().removeClass("dblSelected");
              $(this).addClass("dblSelected");
              //设置辅图表格
              var result = $(this).data("tr");
              //渲染附表
              _this.multiPackageViceTbodyTpl(layero, result.detailList);
            });
        },
        //获取备注类型接口
        dblGetRemarkTypeApi: function () {
          return commonReturnPromise({
            url: "/lms/sysdict/getWarehouseOrderNoteBizDict.html",
          });
        },
        //新增备注接口
        dblAddRemarkApi: function (obj) {
          return commonReturnPromise({
            url: "/lms/unauditorder/addorderlabelnote.html",
            type: "post",
            params: {
              ids: obj.ids,
              noteType: obj.noteType,
              noteContent: obj.noteContent,
            },
          });
        },
        //渲染备注[新增备注]
        multiRenderRemark: function (layero) {
          let _this = this;

          _this.dblGetRemarkTypeApi().then((res) => {
            commonRenderSelect("multiPackage_right_remark", res, {
              code: "name",
              name: "name",
            }).then(() => {
              form.render("select");
            });
          });
          $("#multiPackage_right_remarkBtn").on("click", function () {
            let orderId = layero.find("tr.dblSelected td.orderId").text();
            let val = $("#multiPackage_right_remark").val();
            if (!val) {
              return layer.msg("请先选择备注", { icon: 7 });
            }
            _this
              .dblAddRemarkApi({ ids: orderId, noteType: val, noteContent: "" })
              .then((res) => {
                layer.msg(res || "操作成功", { icon: 1 });
              });
          });
        },

        //单品包装双击包装的tr，可以编辑包裹重量
        dblTrPackingEditWeight: function (layero) {
          var _this = this;
          layero
            .find("#singlePackage_left_tbody")
            .on("dblclick", "tr .realPackWeight", function () {
              let initData = $(this).text();
              $(this).html(
                `<input type="number" value="${initData}" style="border: 1px solid rgba(255, 255, 255, 0)">`
              );
              $(this).find("input").select();
            });
          layero
            .find("#singlePackage_left_tbody")
            .on("change", "tr .realPackWeight input", function (e) {
              layero
                .find("#singlePackage_left_tbody .realPackWeight input")
                .blur();
            });
          layero
            .find("#singlePackage_left_tbody")
            .on("blur", "tr .realPackWeight", function () {
              let initData = $(this).find("input").val();
              initData = Math.ceil(Number(initData));
              $(this).html(initData);
              var trData = new Function(
                `return ${sessionStorage.getItem("singlePackageSearch")}`
              )();
              trData.realPackWeight = initData; //更新实际重量
              if (trData.realPackWeight < 0) {
                return layer.msg("包裹重量不允许为负数", { icon: 2 });
              }
              _this
                .updateFeeAjax(trData)
                .then((res) => {
                  layer.msg(res.msg || "操作成功");
                })
                .catch((errObj) => {
                  if (errObj.data) {
                    let $trDom = $(`#tr${errObj.data.platOrderId}`);
                    if ($trDom.length > 0) {
                      $trDom
                        .find(".realPackWeight")
                        .text(errObj.data.realPackWeight);
                      $trDom
                        .find(".realShippingCost")
                        .text(errObj.data.realShippingCost);
                    }
                  }
                  _this.packageEnterClose(errObj.msg, function () {});
                });
            });
        },
        multiUpdateFeeAjax: function (obj) {
          //多品包装-保存提交功能
          return commonReturnPromiseOrder({
            url: "/lms/order/package/multi/update.html",
            type: "post",
            contentType: "application/json",
            params: JSON.stringify(obj),
          });
        },
        multiPackageRemoveHandle: function (layero) {
          //点击驳回订单按钮
          var _this = this;
          var $tbody = layero.find("#multiPackage_left_tbody");
          $("#multiPackage_packageRemoveBtn").on("click", function () {
            var $trs = $tbody.find("tr");
            if ($trs.length == 0) {
              return layer.msg("暂无数据", { icon: 2 });
            }
            var checkedArr = $trs.find("input:checked");
            if (checkedArr.length == 0) {
              return layer.msg("请选中需要提交的数据", { icon: 2 });
            }
            // 订单非待发货状态，【多品】
            var orderIdArr = [];
            for (var i = 0; i < checkedArr.length; i++) {
              var item = checkedArr[i];
              var itemOrderId = $(item).data("id");
              var platorderid = $(item).data("platorderid");
              var realPackWeight = $(item)
                .parents("tr")
                .find(".realPackWeight")
                .text();
              orderIdArr.push({
                id: itemOrderId,
                weight: realPackWeight,
                platorderid: platorderid,
              });
            }
            //没有重量的页面移除[主表和附表都移除]
            // var noWeightArr = orderIdArr.filter(item => !item.weight);
            // for (var j = 0; j < noWeightArr.length; j++){
            //     var noWeightData = noWeightArr[j];
            //     $(`input[data-id=${noWeightData.id}]`).parents('tr').remove();
            //     $(`.${noWeightData.id}Vice`).remove();
            // }
            //有重量的,执行驳回功能
            // var hasWeightArr = orderIdArr.filter(item => item.weight);
            // var idsArr = hasWeightArr.map(item => item.id);
            var idsArr = orderIdArr.map((item) => item.id);
            if (orderIdArr.length > 0) {
              _this
                .singlePackageRemoveAjax(idsArr.join())
                .then(function (result) {
                  if (result.successResults.length != 0) {
                    //清空并重新获取焦点
                    _this.multiClearInput(layero);
                    layero.find("[name=scanSku]").focus();
                    //移除对应订单
                    let successResultsStr = result.successResults.join(";");
                    for (var i = 0; i < orderIdArr.length; i++) {
                      var orderId = orderIdArr[i].id,
                        platorderidArr = orderIdArr[i].platorderid.split(",");
                      if (successResultsStr.indexOf(orderId) != -1) {
                        $(`input[data-id=${orderId}]`).parents("tr").remove();
                        platorderidArr.forEach((item) => {
                          $(`.${item}Vice`).remove();
                        });
                      }
                    }
                  }
                  // if(result.failResults.length != 0){
                  let str = `成功${result.successNum},失败${result.failNum},失败详情如下：<br>`;
                  result.failResults.forEach((item) => {
                    str += item + "<br>";
                  });
                  if (result.successNum == result.totalNum) {
                    layer.msg(`驳回成功${result.successNum}条`, { icon: 1 });
                  } else {
                    layer.alert(str, { icon: 2 });
                  }
                  // }
                  // if(result.successNum == result.totalNum){
                  //     layer.msg('驳回成功', { icon: 1 });
                  // }
                })
                .catch(function (err) {
                  _this.errorVoiceWarning();
                  _this.errHandle(err || err.message, err);
                });
            }

            layero.find("[name=scanVal]").focus();
            // layer.msg('驳回订单成功', { icon: 1 });
          });
        },
        multiPackageViceTbodyTpl: function (layero, data) {
          let _this = this;
          let getTpl = multiPackage_left_viceTbodyTpl.innerHTML;
          let view = layero.find("#multiPackage_left_viceTbody")[0];
          laytpl(getTpl).render(data, function (html) {
            view.innerHTML = html;
            //双击操作
            $("#multiPackage_left_viceTbody").on(
              "dblclick",
              "td.viceWeight",
              function () {
                let $that = $(this);
                if ($that.find("input").length > 0) {
                  return;
                }
                let val = $that.find("span").text(); //初始值
                let sku = $that.parents("tr").find(".detailSku .sSku").text();
                $that.find("span").remove();
                let $input = $(`<input class="layui-input" value="${val}">`);
                $that.html($input);
                $that.find("input").on("keydown", function (e) {
                  if (e.keyCode == 13) {
                    let inputVal = Number(e.target.value);
                    if (!inputVal) {
                      return layer.msg("请输入有效重量", { icon: 7 });
                    }
                    if (Number(val) == inputVal) {
                      $that.html(`<span>${val}</span>`);
                      return layer.msg("输入重量等于原重量", { icon: 7 });
                    } else {
                      commonReturnPromise({
                        url: '/lms/sysdict/getBizDictByCode',
                        params: {
                          headCode: 'SYNC_DM_WEIGHT_LIMIT'
                        }
                      }).then(res => {
                        let weightCriticalPoint = 0;
                        (res || []).forEach(item =>{
                          if(item.name == '重量'){
                            weightCriticalPoint = item.code || 0;
                          }
                        });
                        let minWeight = Math.min(val, inputVal);
                        if(Math.abs(inputVal - val)/minWeight > weightCriticalPoint){
                          layer.confirm(
                            `${sku}原重量<font size="6" color="blue">${val}</font>,新重量为<font size="6" color="red">${inputVal}</font>,差值过大,至少测<font size="6" color="red">2次</font>才能修改,请确认是否修改?`,
                            { icon: 3, title: "提示" },
                            function (index) {
                              //调用接口
                              _this
                                .multiPackUpdateSuttleWeightApi({
                                  sku: sku,
                                  weight: inputVal
                                })
                                .then((res) => {
                                  layer.close(index);
                                  layer.msg(res || "操作成功");
                                  $that.html(`<span>${inputVal}</span>`);
                                });
                            }
                          );
                        }else{
                          _this.multiPackUpdateSuttleWeightApi({
                            sku: sku,
                            weight: inputVal
                          })
                          .then((res) => {
                            layer.msg(res || "操作成功");
                            $that.html(`<span>${inputVal}</span>`);
                          });
                        }
                      });
                     
                    }
                  }
                });
              }
            );
          });
        },
        //重量校验接口
        multiPackUpdateSuttleWeightApi: function (obj) {
          return commonReturnPromise({
            url: "/lms/dimensionMeasure/multiPackUpdateSuttleWeight.html",
            type: "post",
            params: {
              sku: obj.sku,
              weight: obj.weight,
              orderId: obj.orderId,
            },
          });
        },
        // 包装完成#4253 商品设置非标品
        multiPackageCompleteHandle: function (layero) {
          //打印面单按钮点击事件
          var _this = this;
          var $tbody = layero.find("#multiPackage_left_tbody");
          layero.find("#multiPackage_completeBtn").on("click", function () {
            console.log(layero.find(".dblSelected").data("tr"))
            let ids = layero.find(".dblSelected").data("tr")['orderId'];
              commonReturnPromise({
                url: "/lms/pickpackorder/markpacked.html",
                type: "post",
                params: {
                  ids: ids,
                },
              }).then(function (result) {
                layer.alert(result,{icon:1})
                _this.multiClearInput(layero)
              })
          })
        },
        multiPackagePrintHandle: function (layero) {
          //打印面单按钮点击事件
          var _this = this;
          var $tbody = layero.find("#multiPackage_left_tbody");
          layero.find("#multiPackage_printBtn").on("click", function () {
            var $trs = $tbody.find("tr");
            if ($trs.length == 0) {
              return layer.msg("暂无数据", { icon: 2 });
            }
            var checkedArr = $trs.find("input:checked");
            if (checkedArr.length == 0) {
              return layer.msg("请选中需要打印的数据", { icon: 2 });
            }
            var orderIdArr = [];
            for (var i = 0; i < checkedArr.length; i++) {
              var item = checkedArr[i];
              var itemOrderId = $(item).data("id");
              orderIdArr.push(itemOrderId);
            }
            //需要打印的数据
            // _this.batchSheetSizeAjax(orderIdArr.join()).then(function(result) {
            //     for (var j = 0; j < result.length; j++) {
            //         _this.packagePrint(result[j]);
            //     }
            // }).catch(function (err) {
            //     _this.errorVoiceWarning();
            //     layer.msg(err || err.message, { icon: 2 });
            // })
            $.ajax({
              type: "POST",
              url: ctx + "/logistics/batch/print.html",
              data: { orderIdStr: orderIdArr.join() },
              success: function (returnData) {
                var paramsMapList = returnData.successResults;
                if (paramsMapList && paramsMapList.length > 0) {
                  for (var j = 0; j < paramsMapList.length; j++) {
                    _this.packagePrint(paramsMapList[j]);
                  }
                }
                if (
                  returnData.failResults &&
                  returnData.failResults.length > 0
                ) {
                  let str = "";
                  returnData.failResults.forEach((item) => {
                    str += item + "<br>";
                  });
                  layer.alert(str, { icon: 2 });
                }
              },
              error: function (err) {
                console.log(err);
              },
            });
          });
        },
        //多品包装双击包装的tr，可以编辑包裹重量
        multidblTrPackingEditWeight: function (layero) {
          var _this = this;
          layero
            .find("#multiPackage_left_tbody")
            .on("dblclick", "tr .realPackWeight", function () {
              let initData = $(this).text();
              $(this).html(
                `<input type="number" value="${initData}" style="border: 1px solid rgba(255, 255, 255, 0)">`
              );
              $(this).find("input").select();
            });
          layero
            .find("#multiPackage_left_tbody")
            .on("change", "tr .realPackWeight input", function (e) {
              layero
                .find("#multiPackage_left_tbody .realPackWeight input")
                .blur();
            });
          layero
            .find("#multiPackage_left_tbody")
            .on("blur", "tr .realPackWeight", function () {
              let initData = $(this).find("input").val();
              $(this).html(initData);
              var trData = new Function(
                `return ${sessionStorage.getItem("multiPackageSearch")}`
              )();
              trData.realPackWeight = initData; //更新实际重量
              if (trData.realPackWeight < 0) {
                return layer.msg("包裹重量不允许为负数", { icon: 2 });
              }
              _this
                .multiUpdateFeeAjax(trData)
                .then((res) => {
                  let $trDom = $(this).parents("tr");
                  if ($trDom.length > 0) {
                    $trDom.find(".realPackWeight").text(res.realPackWeight);
                    $trDom.find(".realShippingCost").text(res.realShippingCost);
                  }
                  if (res.msg) {
                    layer.msg(res.msg, { icon: 7 });
                  }
                })
                .catch((errObj) => {
                  // console.log(err);
                  if (errObj.data) {
                    let $trDom = $(`#tr${errObj.data.orderId}`);
                    if ($trDom.length > 0) {
                      $trDom
                        .find(".realPackWeight")
                        .text(errObj.data.realPackWeight);
                      $trDom
                        .find(".realShippingCost")
                        .text(errObj.data.realShippingCost);
                      //清空并重新获取焦点
                      _this.multiClearInput(layero);
                    }
                  }
                  _this.packageEnterClose(errObj.msg, function () {});
                });
            });
        },
        multiClearInput: function (layero) {
          layero.find("[name=scanVal]").val("").focus();
          layero.find("[name=shippingCountry]").val("");
          layero.find("[name=logisticsTypeName]").val("");
          layero.find("[name=logisticsTrackingNo]").val("");
          layero.find("[name=packageWeight]").val("");
          layero.find("[name=platOrderId]").val("");
          layero.find("[name=orderId]").val("");
          layero.find("[name=scanVal]").focus();
        },
        //#endregion 多品包装end

        //统一错误处理
        errHandle: function (str, err) {
          var errHandle = typeof err == "object" ? str : err;
          layer.msg(errHandle, { icon: 2 });
        },
        //批量获取PDF和尺寸
        batchSheetSizeAjax: function (orderIdStr) {
          return commonReturnPromise({
            url: "/lms/logistics/batch/print.html",
            params: {
              orderIdStr: orderIdStr,
            },
          });
        },
        //根据篮号排序获取sku面单
        batchSheetSizeSortSkuRe: function (params) {
          return commonReturnPromise({
            type: "post",
            url: "/lms/logistics/batch/sort/print/skuLabel.html",
            contentType: "application/json",
            params,
          });
        },
        //根据篮号排序获取物流面单
        batchSheetSizeSortRe: function (params) {
          return commonReturnPromise({
            type: "post",
            url: "/lms/logistics/batch/sort/print.html",
            contentType: "application/json",
            params,
          });
        },
        //打印带有SKU的物流面单
        batchOrderSkuLogis: function (orderIdStr) {
          return commonReturnPromise({
            url: "/lms/logistics/batch/print/skuLabel.html",
            params: {
              orderIdStr: orderIdStr,
            },
          });
        },
        //统一打印功能
        packagePrint: async function (data, sku) {
          let obj = {};
          obj.printType = 19;
          obj.labelUrl = data.ftpLabelUrl;
          obj.width = data.width;
          obj.height = data.height;
          obj.printName = "100100";
          if (obj.height === 150) {
            obj.printName = "100150";
          }else if (obj.height === 40) {
            obj.printName = "10040";
          }else if(obj.height === 30){
            obj.printName = "6030";
          }
          logistics_label_pdf_print(obj);

          // data.ftpLabelUrl.forEach((value)=> {
          //     obj.labelUrl = value;
          //     //todo 这个地方的打印机名称要根据上面的面单大小动态调整，需要跟业务协商好这个地方
          // })
        },
        //统一打印功能
        packagePrintTimeOut: function (data, sku) {
          //用于定时发送打印请求
          let obj = {};
          obj.orderId = data.orderId;
          obj.printType = 19;
          try {
            obj.labelUrl = data.ftpLabelUrl;
            obj.width = data.width;
            obj.height = data.height;
            obj.printName = "100100";
            if (obj.height === 150) {
              obj.printName = "100150";
            }
          } catch (err) {
            console.log("错误信息：" + err.message);
          }
          return obj;
        },
        //统一回车关闭弹框
        packageEnterClose: function (str, fn, onfocus) {
          layer.open({
            title: "提示",
            content: `<span style="font-size: 30px">${str}</span>`,
            btn: ['<span style="font-size: 25px">确认</span>'],
            area: ["46%", "20%"],
            success: function (layero, index) {
              layero.find(".layui-layer-title").css("font-size", "24px");
              layero.find(".layui-layer-btn0").css("height", "30px");
              layero.find(".layui-layer-btn0").css("line-height", "30px");
              this.enterEsc = function (event) {
                if (event.keyCode === 13) {
                  fn();
                  layer.close(index);
                  return false; //阻止系统默认回车事件
                }
              };
              $(document).on("keydown", this.enterEsc); //监听键盘事件，关闭层
            },
            end: function () {
              $(document).off("keydown", this.enterEsc); //解除键盘关闭事件
              if (onfocus) {
                onfocus.select();
              }
            },
          });
        },

        //#region 多批次配货start
        multiDistributeLayer: function () {
          var _this = this;
          $("#waittopack_multiDistributeBtn").on("click", function () {
            layer.open({
              type: 1,
              title: "多批次配货",
              area: ["100%", "100%"],
              move: false,
              content: $("#waittopack_multiDistributeLayer").html(),
              id: "waittopack_multiDistributeLayerId",
              success: function (layero, index) {
                _this.setLayerHeaderShowName(layero);
                _this.multiDistributeSearch(layero);
                _this.multiDistributeTab(layero);
                _this.multiDistributeGenerateHandle(layero);
                _this.listUser().then(function (result) {
                  commonRenderSelect("multiDistribute_pickUserId", result, {
                    name: "userName",
                    code: "id",
                    str: '<option value="">抢单</option><option value="assignPickUser">按指定规则</option>',
                  }).then(function () {
                    form.render("select");
                  });
                });
              },
            });
          });
        },
        multiDistributeTab: function (layero) {
          //多批次配货切换tab
          var $merged = layero.find("[name=merged]");
          element.on("tab(multiDistribute_tabs)", function (data) {
            var index = data.index;
            if (index == 0) {
              //未汇总
              $merged.val(0);
            } else if (index == 1) {
              //已汇总
              $merged.val(1);
            }
            layero.find("#multiDistribute_search").trigger("click");
          });
        },
        multiDistributeSearch: function (layero) {
          //多批次配货搜索功能
          var _this = this;
          //渲染时间
          laydate.render({
            elem: "#multiDistributeTimes",
            range: true,
          });
          var $batchNo = layero.find("[name=batchNo]"); //批次号
          var $groupBatchNo = layero.find("[name=groupBatchNo]"); //汇总批次号
          var $merged = layero.find("[name=merged]"); //是否汇总
          var $times = layero.find("[name=times]"); //时间
          layero.find("#multiDistribute_search").on("click", function () {
            var obj = {};
            obj.batchNo = $batchNo.val();
            obj.groupBatchNo = $groupBatchNo.val();
            obj.merged = $merged.val() == 1 ? true : false;
            var times = $times.val();
            if (times) {
              var timesArr = times.split(" - ");
              obj.mergeTimeStart = timesArr[0] + " 00:00:00";
              obj.mergeTimeEnd = timesArr[1] + " 23:59:59";
            } else {
              obj.mergeTimeStart = "";
              obj.mergeTimeEnd = "";
            }
            _this.multiDistributeTable(obj);
          });
        },
        multiDistributeTable: function (data) {
          //多批次配货渲染表格
          var _this = this;
          table.render({
            elem: "#multiDistribute_table",
            method: "post",
            url: "/lms/pickbatchmanage/list.html",
            where: data,
            page: true,
            limits: [50, 100, 300],
            limit: 50,
            id: "multiDistribute_tableId",
            cols: _this.multiDistributeTableCols(data),
            done: function (res) {
              _this.multiDistributeWatchBar();
              $("#multiDistribute_tabs").find("li>span").html("");
              $("#multiDistribute_tabs")
                .find("li.layui-this>span")
                .html(`(${res.count})`);
            },
          });
        },
        multiDistributeTableCols: function (data) {
          //多批次配货切换thead
          var merged = data.merged;
          var cols;
          if (merged == true) {
            //已汇总
            cols = [
              [
                { type: "checkbox", width: 30 },
                { title: "汇总批次号", field: "groupBatchNo" },
                {
                  field: "detail",
                  unresize: true,
                  width: 408,
                  title: `
                            <div style="display:flex;">
                                <div style="width:100px;">SKU个数</div>
                                <div style="width:100px;">商品总数</div>
                                <div style="width:70px;">楼栋</div>
                                <div style="width:70px;">楼层</div>
                                <div style="width:70px;">箱号</div>
                            </div>
                            `,
                  style: "vertical-align: top",
                  templet: "#multiDistributeTable_detail",
                },
                { title: "汇总人", field: "mergeUser" },
                {
                  title: "汇总时间",
                  field: "buildingNos",
                  templet:
                    "<div>{{Format(d.mergeTime,'yyyy-MM-dd hh:mm:ss') || ''}}</div>",
                },
                { title: "操作", templet: "#multiDistributeTable_toolBar" },
              ],
            ];
          } else if (merged == false) {
            //未汇总
            cols = [
              [
                { type: "checkbox", width: 30 },
                { title: "配货批次号", field: "batchNo" },
                { title: "SKU个数", field: "skuNum" },
                { title: "商品总数", field: "prodNum" },
                { title: "楼栋", field: "buildingNos" },
                { title: "楼层", field: "floorNos" },
              ],
            ];
          }
          return cols;
        },
        multiDistributeWatchBar: function () {
          //多批次配货操作
          var _this = this;
          table.on("tool(multiDistribute_tableFilter)", function (obj) {
            var data = obj.data;
            if (obj.event == "change") {
              //变更拣货人
              layer.open({
                type: 1,
                title: "变更拣货人",
                area: ["600px", "400px"],
                btn: ["修改", "关闭"],
                content: $("#multiDistribute_table_pickerLayer").html(),
                id: "multiDistribute_table_pickerLayerId",
                success: function (layero, index) {
                  _this.listUser().then(function (result) {
                    commonRenderSelect(
                      "multiDistribute_pickUserIdLayer",
                      result,
                      {
                        name: "userName",
                        code: "id",
                        str: '<option value="">抢单</option><option value="assignPickUser">按指定规则</option>',
                      }
                    ).then(function () {
                      form.render("select");
                    });
                  });
                },
                yes: function (index, layero) {
                  var $val = $("#multiDistribute_pickUserIdLayer").val();
                  var obj = {};
                  obj.batchNo = data.groupBatchNo;
                  obj.assignPickUser = $val == "assignPickUser" ? true : false;
                  obj.pickUserId = $val;
                  _this
                    .changePickerAjax(obj)
                    .then(function (result) {
                      layer.msg(result || "变更拣货人成功", { icon: 1 });
                      layer.close(index);
                    })
                    .catch(function (err) {
                      _this.errHandle("变更拣货人请求失败", err);
                    });
                },
              });
            }
          });
        },
        multiDistributeGenerateHandle: function (layero) {
          //按钮操作
          var $select = layero.find("#multiDistribute_pickUserId");
          var _this = this;
          layero.find("#multiDistribute_generateBtn").on("click", function () {
            commonTableCksSelected("multiDistribute_tableId")
              .then(function (result) {
                var idsArr = result.map(function (item) {
                  return item.id;
                });
                var obj = {};
                obj.ids = idsArr.join(",");
                obj.assignPickUser =
                  $select.val() == "assignPickUser" ? true : false;
                obj.pickUserId = $select.val();
                _this
                  .generateAjax(obj)
                  .then(function (requestResult) {
                    layer.alert(
                      `生成汇总批次成功,汇总批次号: ${requestResult}`,
                      function (index) {
                        layer.close(index);
                      }
                    );
                  })
                  .catch(function (requestErr) {
                    _this.errHandle("生成汇总批次失败", requestErr);
                  });
              })
              .catch(function (err) {
                layer.msg(err, { icon: 2 });
              });
          });
        },
        //#endregion 多批次配货end

        //#region  多品投篮start
        multiShotBasketballLayer: function () {
          var _this = this;
          $("#waittopack_multiShotBasketballBtn").on("click", function () {
            layer.open({
              type: 1,
              title: "多品投篮",
              area: ["100%", "100%"],
              move: false,
              content: $("#waittopack_multiShotBasketballLayer").html(),
              id: "waittopack_multiShotBasketballLayerId",
              success: function (layero, index) {
                _this.setLayerHeaderShowName(layero);
                _this.vueShotBasketballHandle();
                _this.multiShotBasketballQueryProgress();
              },
              end: function () {
                sessionStorage.removeItem("MULTILASTTIMEDATA");
              },
            });
          });
        },
        multiShotBasketballQueryProgress: function () {
          $("#waittopack_multiShotBasketball_progress").click(function () {
            commonReturnPromise({
              url: "/lms/pickpackorder/multiDistributionProgress.html",
            }).then((res) => {
              // 展示10行
              const data = res.slice(0, 10);
              layer.open({
                type: 1,
                title: "配货进度",
                area: ["800px", "600px"],
                move: false,
                content: $(
                  "#waittopack_multiShotBasketball_progressTpl"
                ).html(),
                id: "waittopack_multiShotBasketball_progressTplId",
                success: function () {
                  table.render({
                    elem: "#waittopack_multiShotBasketball_progressTable",
                    data,
                    id: "waittopack_multiShotBasketball_progressTable",
                    cols: [
                      [
                        { title: "批次号", field: "batchNumber" },
                        {
                          title: "完成度",
                          field: "completionProgress",
                          templet: (d) => d.completionProgress + "%",
                        },
                        { title: "未配SKU个数", field: "skuNumber" },
                        {
                          title: "剩余SKU涉及楼层和配货人",
                          field: "floorNoAndPersonName",
                        },
                      ],
                    ],
                    page: false,
                    limit: 1000,
                  });
                },
              });
            });
          });
        },
        vueShotBasketballHandle: function () {
          var _this = this;
          new Vue({
            el: "#waittopack_app",
            data() {
              return {
                printChecked: false, //打印物流面单
                verifyChecked: true, //核完一单删一单
                prevVerifyOrder: "无", //上次被核单
                prevBasketNo: "无", //上次篮号
                platOrderInfos: [], //订单信息表格数据
                checkedOrderSkuInfos: [], //已投篮表格数据
                unCheckedOrderSkuInfos: [], //未投篮表格数据
                orderProgressInfos: [], //订单进度表格
                sizeForm: {
                  batchNo: "", //批次号
                  sku: "", //SKU
                  skuNum: "", //SKU数量
                  basketNo: "", //篮号
                  number: "", //数量
                  unit: "", //单位
                  orderDetailId: "", //子订单详情ID
                },
                allChecked: false, //表格全选
                checkedCellections: [], //选择tr的复选框
              };
            },
            mounted() {
              sessionStorage.setItem("MULTILASTTIMEDATA", JSON.stringify({}));
            },
            computed: {
              platOrderInfosLength() {
                //订单信息表格数据长度
                return this.platOrderInfos.length;
              },
              checkedOrderSkuInfosLength() {
                //已投篮表格数据长度
                return this.checkedOrderSkuInfos.length;
              },
              unCheckedOrderSkuInfosLength() {
                //未投篮表格数据长度
                return this.unCheckedOrderSkuInfos.length;
              },
              // orderProgressInfosLength () {//订单进度长度
              //     return this.orderProgressInfos.length;
              // }
            },
            methods: {
              batchNoEnterHandle() {
                //批次号回车事件
                this.platOrderInfos = [];
                this.checkedOrderSkuInfos = [];
                this.unCheckedOrderSkuInfos = [];
                this.orderProgressInfos = [];
                this.sizeForm.sku = ""; //SKU
                this.sizeForm.skuNum = ""; //SKU数量
                this.sizeForm.number = ""; //数量
                this.sizeForm.unit = ""; //单位
                this.sizeForm.orderDetailId = ""; //子订单详情ID
                // console.log(this.sizeForm);
                if (this.sizeForm.batchNo.length == 0) {
                  _this.errorVoiceWarning();
                  return layer.msg("批次号不能为空", { icon: 7 });
                } else {
                  _this
                    .scanBatchNoAjax(this.sizeForm.batchNo)
                    .then((result) => {
                      this.platOrderInfos = result.platOrderInfos || []; //订单信息
                      this.checkedOrderSkuInfos =
                        result.checkedOrderSkuInfos || []; //已投篮SKU
                      this.unCheckedOrderSkuInfos =
                        result.unCheckedOrderSkuInfos || []; //未投篮SKU
                      this.$forceUpdate(); //强制更新视图
                      this.$refs.sku.focus(); //sku输入框获取焦点
                    })
                    .catch(function (err) {
                      _this.errorVoiceWarning();
                      _this.packageEnterClose(
                        err,
                        function () {
                          $(
                            "#waittopack_multiShotBasketballLayerId input[name=batchNo]"
                          ).blur();
                        },
                        $(
                          "#waittopack_multiShotBasketballLayerId input[name=batchNo]"
                        )
                      );
                      // _this.errHandle('批次订单接口请求失败', err);
                    });
                }
              },
              //sku回车事件
              skuEnterHandle() {
                this.sizeForm.number = ""; //数量
                this.sizeForm.unit = ""; //单位
                let sku = this.sizeForm.sku; //获取到输入的SKU
                let batchNo = this.sizeForm.batchNo;
                let unCheckedOrderSkuInfos = this.unCheckedOrderSkuInfos; //未投篮SKU
                let platOrderInfos = this.platOrderInfos; //订单信息
                if (!sku) {
                  this.$refs.sku.select(); //sku输入框选中
                  _this.packageEnterClose(
                    "请先扫描SKU",
                    () => {
                      $(
                        "#waittopack_multiShotBasketballLayerId input[name=sku]"
                      ).blur();
                    },
                    this.$refs.sku
                  );
                  // layer.msg('请先扫描SKU', { icon: 7 });
                  return;
                }
                console.log(unCheckedOrderSkuInfos, sku);
                var matchSkuArr = unCheckedOrderSkuInfos.filter(function (
                  item
                ) {
                  return item.sku.toUpperCase() === sku.toUpperCase();
                });
                if (matchSkuArr.length == 0) {
                  this.$refs.sku.select(); //sku输入框选中
                  _this.errorVoiceWarning();
                  _this.packageEnterClose(
                    "没有匹配的SKU,请重新扫描",
                    () => {
                      $(
                        "#waittopack_multiShotBasketballLayerId input[name=sku]"
                      ).blur();
                    },
                    this.$refs.sku
                  );
                  //ztt-20221110新增
                  commonReturnPromise({
                    url: "/lms/pickpackorder/recordMultiplePick.html",
                    type: "post",
                    isLoading: false,
                    params: {
                      batchNo,
                      sku,
                    },
                  });
                  // layer.msg('没有匹配的SKU,请重新扫描', { icon: 2 });
                  return;
                }
                var matchSkuInfo = matchSkuArr[0]; //多个SKU只匹配第一个
                this.sizeForm.basketNo = matchSkuInfo.basketNo; //篮号
                this.sizeForm.number = matchSkuInfo.pickNum; //数量
                this.sizeForm.unit = matchSkuInfo.unit; //单位
                this.sizeForm.orderDetailId = matchSkuInfo.orderDetailId; //子订单详情ID
                //播报箱号
                var speechSynthesisUtterance = new SpeechSynthesisUtterance(
                  `${matchSkuInfo.basketNo}`
                );
                speechSynthesisUtterance.rate = 3;
                speechSynthesis.speak(speechSynthesisUtterance);
                //渲染订单进度
                let originOrderProgressInfos = platOrderInfos.filter(function (
                  item
                ) {
                  return item.orderId == matchSkuInfo.orderId;
                });
                originOrderProgressInfos.length > 0
                  ? (this.orderProgressInfos =
                      originOrderProgressInfos[0]["pickDetails"])
                  : (() => layer.msg("订单信息和未投篮SKU不匹配"))();
                if (matchSkuInfo.pickNum == 1) {
                  this.$refs.skuNum.focus();
                  this.sizeForm.skuNum = 1;
                  this.skuNumEnterHandle();
                } else {
                  this.sizeForm.skuNum = matchSkuInfo.pickNum - matchSkuInfo.checkNum;
                  this.$refs.skuNum.focus(); //sku数量输入框获取焦点
                }
                this.sizeForm.unit = matchSkuInfo.unit; //匹配单位
                this.$forceUpdate(); //强制更新视图
              },
              //sku数量回车事件
              skuNumEnterHandle() {
                let skuNum = this.sizeForm.skuNum; //数量
                if (!skuNum) {
                  return layer.msg("数量不能为空", { icon: 7 });
                }
                if (skuNum == 0) {
                  return layer.msg("数量不能为0", { icon: 7 });
                }
                let currentSku = this.sizeForm.sku;
                let orderDetailId = this.sizeForm.orderDetailId;
                let currentArr = this.orderProgressInfos.filter(function (
                  item
                ) {
                  return (
                    item.sku.toUpperCase() == currentSku.toUpperCase() &&
                    item.orderDetailId == orderDetailId
                  );
                });
                if (currentArr.length == 0) {
                  return layer.msg("请检查SKU是否正确", { icon: 7 });
                }
                let currentObj = currentArr[0];
                // console.log('currentObj', currentObj);
                //提交参数
                let obj = {
                  batchNo: currentObj.batchNo,
                  orderDetailId: currentObj.orderDetailId,
                  sku: currentObj.sku,
                  checkNum: skuNum,
                  orderId: currentObj.orderId,
                  basketNo: currentObj.basketNo,
                };
                let lastTimeData = JSON.parse(
                  sessionStorage.getItem("MULTILASTTIMEDATA")
                );
                //上次被核单
                this.prevVerifyOrder = lastTimeData.sku || "无";
                //上次篮号
                this.prevBasketNo = lastTimeData.basketNo || "无";
                var vmThis = this;
                //存储上次篮号信息
                sessionStorage.setItem(
                  "MULTILASTTIMEDATA",
                  JSON.stringify(obj)
                );
                _this
                  .skuShotAjax(obj)
                  .then(function () {
                    //步骤1.0:[找到订单进度的提交SKU,更新数量]
                    let isEuqalNum;
                    let objSku = obj.sku;
                    let objOrderDetailId = obj.orderDetailId;
                    vmThis.orderProgressInfos.forEach(function (order) {
                      if (order.orderDetailId == objOrderDetailId) {
                        order.checkNum += +vmThis.sizeForm.skuNum;
                        order.checkNum === order.pickNum
                          ? (isEuqalNum = true)
                          : (isEuqalNum = false);
                      }
                    });
                    //步骤1.1: 订单进度表格: [找到订单进度的提交SKU,更新数量以后的数据项]
                    let currentOrderProgressInfo =
                      vmThis.orderProgressInfos.filter(function (item) {
                        return item.orderDetailId == objOrderDetailId;
                      })[0];
                    // console.log('总量和验货数量是否相等',isEuqalNum)
                    //步骤2.0: 未投篮SKU表格: [找到和提交SKU相同的数据,更新已投数量]
                    vmThis.unCheckedOrderSkuInfos.forEach(function (item) {
                      if (item.orderDetailId == objOrderDetailId) {
                        item.checkNum = currentOrderProgressInfo.checkNum;
                      }
                    });
                    //步骤2.1:已投数量等于总数量且核完一单删一单是选中状态[移除对应SKU的未投数据]
                    if (isEuqalNum) {
                      //未投篮表格: 获取数量值相等的数据的index
                      let spliceSkuIndex =
                        vmThis.unCheckedOrderSkuInfos.findIndex(function (
                          item
                        ) {
                          return (
                            item.sku == objSku &&
                            item.orderDetailId == objOrderDetailId
                          );
                        });
                      //未投篮表格: 移除对应数据项
                      vmThis.unCheckedOrderSkuInfos.splice(spliceSkuIndex, 1);
                    }
                    //步骤3.0: 把订单进度里的SKU给添加到已投篮SKU[存在就替换]
                    let checkedSpliceSkuIndex =
                      vmThis.checkedOrderSkuInfos.findIndex(function (item) {
                        return item.orderDetailId == objOrderDetailId;
                      });
                    if (checkedSpliceSkuIndex == -1) {
                      vmThis.checkedOrderSkuInfos.push(
                        currentOrderProgressInfo
                      );
                    } else {
                      vmThis.checkedOrderSkuInfos.splice(
                        checkedSpliceSkuIndex,
                        1,
                        currentOrderProgressInfo
                      );
                    }
                    /**
                     * 步骤4.0: 判断订单进度里面的未投篮数是否都是0,如果是,判断'核完一单删一单是否选中',两者都满足条件,就移除订单信息里面的数据(这个逻辑很差)
                     * 换个角度:
                     * 选中状态:如果未投篮SKU表格里面没有单号和当前单号相匹配.表示全部投篮完毕
                     * 未选中状态: 看订单进度里面的未投篮数是否全是0
                     */
                    if (vmThis.verifyChecked) {
                      let isCurrentOrderIdArr = [];
                      let currentOrderId = currentOrderProgressInfo.orderId;
                      for (
                        let i = 0;
                        i < vmThis.unCheckedOrderSkuInfos.length;
                        i++
                      ) {
                        let item = vmThis.unCheckedOrderSkuInfos[i];
                        if (item.orderId === currentOrderId) {
                          isCurrentOrderIdArr.push(currentOrderId);
                        }
                      }
                      if (isCurrentOrderIdArr.length == 0) {
                        //没在未选中里
                        let spliceSkuIndex = vmThis.platOrderInfos.findIndex(
                          function (item) {
                            return item.orderId == currentOrderId;
                          }
                        );
                        // console.log('currentOrderProgressInfo', currentOrderProgressInfo);
                        vmThis.platOrderInfos.splice(spliceSkuIndex, 1);
                      }
                    } else {
                      //没有选中,重新获取条件
                      let currentOrderId = currentOrderProgressInfo.orderId;
                      let isCompletedOrderArr = [];
                      for (
                        let i = 0;
                        i < vmThis.orderProgressInfos.length;
                        i++
                      ) {
                        let item = vmThis.orderProgressInfos[i];
                        if (item.pickNum - item.checkNum != 0) {
                          isCompletedOrderArr.push("还没完");
                        }
                      }
                      if (isCompletedOrderArr.length == 0) {
                        let spliceSkuIndex = vmThis.platOrderInfos.findIndex(
                          function (item) {
                            return item.orderId == currentOrderId;
                          }
                        );
                        let oldPlatOrder =
                          vmThis.platOrderInfos[spliceSkuIndex];
                        oldPlatOrder.checked = true;
                      }
                    }

                    /**
                     * 步骤5.0:判断打印物流面单是否选中
                     */
                    if (vmThis.printChecked) {
                      //需要打印的数据
                      // _this.batchSheetSizeAjax(currentOrderProgressInfo.orderId).then(function (result) {
                      //     for (var j = 0; j < result.length; j++) {
                      //         _this.packagePrint(result[j]);
                      //     }
                      // }).catch(function (err) {
                      //     layer.msg(err || err.message, { icon: 2 });
                      // });
                      $.ajax({
                        type: "POST",
                        url: ctx + "/logistics/batch/print.html",
                        data: { orderIdStr: currentOrderProgressInfo.orderId },
                        success: function (returnData) {
                          var paramsMapList = returnData.successResults;
                          if (paramsMapList && paramsMapList.length > 0) {
                            for (var j = 0; j < paramsMapList.length; j++) {
                              _this.packagePrint(paramsMapList[j]);
                            }
                          }
                          if (
                            returnData.failResults &&
                            returnData.failResults.length > 0
                          ) {
                            let str = "";
                            returnData.failResults.forEach((item) => {
                              str += item + "<br>";
                            });
                            layer.alert(str, { icon: 2 });
                          }
                        },
                        error: function (err) {
                          console.log(err);
                        },
                      });
                    }

                    //sku输入框获取焦点
                    //将篮号、数量、单位停留时间延长至下次扫描单时
                    // vmThis.sizeForm.sku = ''; //SKU
                    // vmThis.sizeForm.skuNum = ''; //SKU数量
                    // vmThis.sizeForm.basketNo = ''; //篮号
                    // vmThis.sizeForm.number = ''; //数量
                    // vmThis.sizeForm.unit = ''; //单位
                    vmThis.$refs.sku.select(); //sku输入框选中
                    vmThis.$refs.sku.focus();
                  })
                  .catch(function (err) {
                    // console.log(err)
                    layer.msg(err || err.message, { icon: 2 });
                  });
              },
              handleAllCked() {
                if (this.allChecked) {
                  this.platOrderInfos.forEach((item) => {
                    this.checkedCellections.push(item.orderId);
                  });
                } else {
                  this.checkedCellections = [];
                }
              },
              // 点击订单信息显示进度弹窗
              showProgress(item) {
                let batchNo = this.sizeForm.batchNo;
                let data = [];
                _this
                  .getProgresshAjax(item.orderId, batchNo)
                  .then((res) => {
                    data = res || [];
                    layer.open({
                      type: 1,
                      title: "进度",
                      shade: 0.2, //遮罩透明度
                      area: ["800px", "400px"],
                      content: $("#waittopack_order_progressTpl").html(),
                      btn: ["关闭"],
                      success: function () {
                        table.render({
                          elem: "#waittopack_order_progress_table",
                          data,
                          id: "waittopack_order_progress_table",
                          cols: [
                            [
                              { title: "单号", field: "id" },
                              { title: "跟踪号", field: "logisTrackingNo" },
                              { title: "商品SKU", field: "sku" },
                              { title: "已投篮数", field: "checkNum" },
                              {
                                title: "未投篮数",
                                field: "skuNum",
                                templet: (d) => d.pickNum - d.checkNum,
                              },
                            ],
                          ],
                          done: function (res) {
                            console.log("fdsfa");
                          },
                        });
                      },
                    });
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              },
              removeOrderHandle() {
                let vmThis = this;
                if (this.checkedCellections.length == 0) {
                  return layer.msg("请选择需要移除的订单", { icon: 7 });
                }
                let batchNo = this.sizeForm.batchNo;
                let orderIdStr = this.checkedCellections.join(",");
                _this
                  .removeShotAjax({ batchNo: batchNo, orderId: orderIdStr })
                  .then(function (result) {
                    vmThis.batchNoEnterHandle();
                    vmThis.sizeForm.sku = "";
                    vmThis.sizeForm.skuNum = "";
                    vmThis.sizeForm.basketNo = "";
                    vmThis.sizeForm.number = "";
                  })
                  .catch(function (err) {
                    _this.errHandle("移除订单失败", err);
                  });
              },
              viewOrderHandle() {
                // 查看
                let batchNo = this.sizeForm.batchNo;
                _this
                  .viewMarkReduceAjax({ batchNo: batchNo })
                  .then(function (result) {
                    _this.markReduceLayer(result);
                  })
                  .catch(function (err) {
                    _this.errHandle("查看标记少货接口请求失败", err);
                  });
              },
              markReduceHandle() {
                //标记少货
                let vmThis = this;
                let markFn = function(){
                  layer.confirm(
                    "确定标记少货吗?",
                    { icon: 3, title: "提示" },
                    function (index) {
                      layer.close(index);
                      let batchNo = vmThis.sizeForm.batchNo;
                      let orders = {};
                      let orderDetailIdsArr = vmThis.unCheckedOrderSkuInfos.map(
                        function (item) {
                          return item.orderDetailId;
                        }
                      );
                      vmThis.unCheckedOrderSkuInfos.forEach((item) => {
                        if (orders[item.orderId]) {
                          orders[item.orderId].push(item.sku);
                        } else {
                          orders[item.orderId] = [item.sku];
                        }
                      });
                      if (orderDetailIdsArr.length == 0) {
                        return layer.msg("没有需要标记的SKU", { icon: 7 });
                      }
                      _this
                        .markReduceAjax({ batchNo: batchNo, orders })
                        .then(function (result) {
                          _this.markReduceLayer(result);
                        })
                        .catch(function (err) {
                          _this.errHandle("标记少货接口请求失败", err);
                        });
                    }
                  );
                };
                //ztt20231211-超过10条数据弹框处理
                let hasPickArr = vmThis.unCheckedOrderSkuInfos.filter(item => ![undefined, 0, ''].includes(item.pickNum));
                if(hasPickArr.length>10){
                  let str = `超过<font size='5' color='red'>10</font>个SKU还需要进行少货再次配货,<br>请确认所有配货都已投篮!`;
                  layer.confirm(str,{ icon: 3, title: "提示" },function(index){
                    markFn();
                    layer.close(index);
                  });

                }else{
                  markFn();
                }
              }
            },
            watch: {
              checkedCellections() {
                if (
                  this.checkedCellections.length == this.platOrderInfos.length
                ) {
                  this.allChecked = true;
                } else {
                  this.allChecked = false;
                }
              },
            },
          });
        },
        markReduceLayer: function (data) {
          layer.open({
            type: 1,
            title: "标记少货结果",
            area: ["800px", "600px"],
            move: false,
            content: $(
              "#waittopack_multiShotBasketballLayer_markReduce"
            ).html(),
            id: "waittopack_multiShotBasketballLayer_markReduceId",
            success: function () {
              var getTpl =
                  waittopack_multiShotBasketballLayer_markReduceContainerTpl.innerHTML,
                view = document.getElementById(
                  "waittopack_multiShotBasketballLayer_markReduceContainer"
                );
              //把data做排序
              data.sort((a, b) => a.oldBasketNo - b.oldBasketNo);
              laytpl(getTpl).render(data, function (html) {
                view.innerHTML = html;
                form.render();
              });
            },
            cancel: function (index) {
              layer.confirm(
                "确定关闭弹窗吗?",
                { icon: 7, title: "提示" },
                function (_index) {
                  layer.close(_index);
                  layer.close(index);
                }
              );
              return false;
            },
          });
        },
        //#endregion 多品投篮end

        //#region ---少货投篮start
        lackShotBasketballLayer: function () {
          var _this = this;
          $("#waittopack_lackShotBasketballBtn").on("click", function () {
            layer.open({
              type: 1,
              title: "少货投篮",
              area: ["100%", "100%"],
              move: false,
              content: $("#waittopack_lackShotBasketballLayer").html(),
              id: "waittopack_lackShotBasketballLayerId",
              success: function (layero, index) {
                _this.lackVueShotBasketballHandle();
                _this.setLayerHeaderShowName(layero);
              },
              end: function () {
                sessionStorage.removeItem("LACKLASTTIMEDATA");
              },
            });
          });
        },
        unBindBatch: function () {
          var _this = this;
          $("#waittopack_unBindBatch").on("click", function () {
            let ids = getTableSelectIds();
            if (!ids || ids.length < 1) {
              layer.msg("请选择订单", { icon: 7 });
              return;
            }
            layer.confirm("批量解绑订单？", function (result) {
              if (result) {
                $.ajax({
                  type: "post",
                  dataType: "json",
                  url: "/lms/pickpackorder/unbindbatch.html",
                  data: { ids: ids.join(",") },
                  beforeSend: function () {
                    loading.show();
                  },
                  success: function (res) {
                    loading.hide();
                    if (res.code == "0000") {
                      layui.admin.batchResultAlert(
                        "解绑批次:",
                        res.data,
                        function () {}
                      );
                    } else {
                      layer.msg(res.msg, { icon: 2, time: 4000 });
                    }
                  },
                  error: function () {
                    loading.hide();
                  },
                });
              }
            });
          });
        },
        //#endregion ---少货投篮end
        //多品缺货处理
        multiNoProdHandle: function () {
          var _this = this;
          $("#waittopack_multiNoProdBtn").on("click", function () {
            layer.open({
              type: 1,
              title: "多品缺货处理",
              area: ["100%", "100%"],
              btn: ["关闭"],
              content: $("#waittopack_multiNoProdLayer").html(),
              id: "waittopack_multiNoProdLayerId",
              success: function (layero, index) {
                _this.setLayerHeaderShowName(layero);
                layero.find("[name=orderOrTrackId]").on("keyup", function (e) {
                  var orderId = e.target.value;
                  if (e.keyCode == 13) {
                    //回车了
                    if (!orderId) {
                      return layer.msg("请输入订单号或跟踪号");
                    }
                    _this.multiNoProdEvent(orderId);
                    return false;
                  }
                });
                //按钮事件执行
                _this.multiNoProdNormalHandle(layero);
                _this.multiNoProdCancelHandle(layero);
                _this.multiNoProdTransHandle(layero);
              },
            });
          });
        },
        //正常发货
        multiNoProdNormalHandle: function (layero) {
          var _this = this;
          layero.find("#waittopack_multiNoProdNormal").on("click", function () {
            // 页面上对应的订单编号
            // var orderId = layero.find("[name=orderOrTrackId]").val();
            const orderId = layero.find('#waittopack_multiNoProdLayerContainer .layui-form').find('input[name=id]').val()
            if (!orderId) {
              return layer.msg("请输入订单号或跟踪号");
            }
            layer.open({
              title: "提示",
              content: "确认正常发货吗?",
              btn: ["确认"],
              success: function (layero1, index) {
                this.multiPackageEnterEsc = function (event) {
                  if (event.keyCode === 13) {
                    //要做一个接口操作
                    _this
                      .multiNoProdNormalAjax(orderId)
                      .then((res) => {
                        layui.admin.batchResultAlert(
                          "正常发货完成:",
                          res,
                          function (errIdsArr) {
                            if (!errIdsArr || errIdsArr.length == 0) {
                              $("#waittopack_multiNoProdLayerContainer").html(
                                ""
                              );
                              deleteTableRow_waittopack([orderId],[])
                              // zttCommonRemoveDataHandle({
                              //   selectedIds: [orderId],
                              //   gridOptions: waittopack_gridOptions,
                              //   tableData: immutableStore,
                              //   errIds: [],
                              // }).then((newObj) => {
                              //   let { newData, successIds } = newObj;
                              //   immutableStore = newData;
                              //   let oldNum = $(
                              //     "#waittopack_tabs ul li.layui-this>span"
                              //   ).text();
                              //   let newNum = oldNum - successIds.length;
                              //   $(
                              //     "#waittopack_tabs ul li.layui-this>span"
                              //   ).text(newNum);
                              //   $("#waittopackdPage .layui-laypage-count").text(
                              //     `共 ${newNum} 条`
                              //   );
                              // });
                            }
                          }
                        );
                        //关闭弹框
                        layer.close(index);
                      })
                      .catch((err) => {
                        layer.msg(err, { icon: 2 });
                      });
                    return false; //阻止系统默认回车事件
                  }
                };
                $(document).on(
                  "keydown",
                  _.throttle(this.multiPackageEnterEsc, 30000)
                ); //监听键盘事件，关闭层
              },
              end: function () {
                $(document).off("keydown", this.multiPackageEnterEsc); //解除键盘关闭事件
              },
              yes: function (index) {
                _this
                  .multiNoProdNormalAjax(orderId)
                  .then((res) => {
                    layui.admin.batchResultAlert(
                      "正常发货完成:",
                      res,
                      function (errIdsArr) {
                        if (!errIdsArr || errIdsArr.length == 0) {
                          $("#waittopack_multiNoProdLayerContainer").html("");
                          deleteTableRow_waittopack([orderId],[])
                          // zttCommonRemoveDataHandle({
                          //   selectedIds: [orderId],
                          //   gridOptions: waittopack_gridOptions,
                          //   tableData: immutableStore,
                          //   errIds: [],
                          // }).then((newObj) => {
                          //   let { newData, successIds } = newObj;
                          //   immutableStore = newData;
                          //   let oldNum = $(
                          //     "#waittopack_tabs ul li.layui-this>span"
                          //   ).text();
                          //   let newNum = oldNum - successIds.length;
                          //   $("#waittopack_tabs ul li.layui-this>span").text(
                          //     newNum
                          //   );
                          //   $("#waittopackdPage .layui-laypage-count").text(
                          //     `共 ${newNum} 条`
                          //   );
                          // });
                        }
                      }
                    );
                    //关闭弹框
                    layer.close(index);
                  })
                  .catch((err) => {
                    layer.msg(err, { icon: 2 });
                  });
              },
            });
          });
        },
        //取消订单
        multiNoProdCancelHandle: function (layero) {
          var _this = this;
          layero.find("#waittopack_multiNoProdCancel").on("click", function () {
            var orderId = layero.find("[name=orderOrTrackId]").val();
            if (!orderId) {
              return layer.msg("请输入订单号或跟踪号");
            }
            layer.open({
              title: "提示",
              content: "确认取消订单吗?",
              btn: ["确认"],
              success: function (layero1, index) {
                this.multiPackageEnterEsc = function (event) {
                  if (event.keyCode === 13) {
                    //要做一个接口操作
                    _this
                      .multiNoProdCancelAjax(orderId)
                      .then((res) => {
                        $("#waittopack_multiNoProdLayerContainer").html("");
                        layer.msg(res || "取消订单操作成功", { icon: 1 });
                        deleteTableRow_waittopack([orderId],[])
                        // zttCommonRemoveDataHandle({
                        //   selectedIds: [orderId],
                        //   gridOptions: waittopack_gridOptions,
                        //   tableData: immutableStore,
                        //   errIds: [],
                        // }).then((newObj) => {
                        //   let { newData, successIds } = newObj;
                        //   immutableStore = newData;
                        //   let oldNum = $(
                        //     "#waittopack_tabs ul li.layui-this>span"
                        //   ).text();
                        //   let newNum = oldNum - successIds.length;
                        //   $("#waittopack_tabs ul li.layui-this>span").text(
                        //     newNum
                        //   );
                        //   $("#waittopackdPage .layui-laypage-count").text(
                        //     `共 ${newNum} 条`
                        //   );
                        // });
                        //关闭弹框
                        layer.close(index);
                      })
                      .catch((err) => {
                        layer.msg(err, { icon: 2 });
                      });
                    return false; //阻止系统默认回车事件
                  }
                };
                $(document).on(
                  "keydown",
                  _.throttle(this.multiPackageEnterEsc, 30000)
                ); //监听键盘事件，关闭层
              },
              end: function () {
                $(document).off("keydown", this.multiPackageEnterEsc); //解除键盘关闭事件
              },
              yes: function (index) {
                _this
                  .multiNoProdCancelAjax(orderId)
                  .then((res) => {
                    $("#waittopack_multiNoProdLayerContainer").html("");
                    layer.msg(res || "取消订单操作成功", { icon: 1 });
                    deleteTableRow_waittopack([orderId],[])
                    // zttCommonRemoveDataHandle({
                    //   selectedIds: [orderId],
                    //   gridOptions: waittopack_gridOptions,
                    //   tableData: immutableStore,
                    //   errIds: [],
                    // }).then((newObj) => {
                    //   let { newData, successIds } = newObj;
                    //   immutableStore = newData;
                    //   let oldNum = $(
                    //     "#waittopack_tabs ul li.layui-this>span"
                    //   ).text();
                    //   let newNum = oldNum - successIds.length;
                    //   $("#waittopack_tabs ul li.layui-this>span").text(newNum);
                    //   $("#waittopackdPage .layui-laypage-count").text(
                    //     `共 ${newNum} 条`
                    //   );
                    // });
                    //关闭弹框
                    layer.close(index);
                  })
                  .catch((err) => {
                    layer.msg(err, { icon: 2 });
                  });
              },
            });
          });
        },
        //转待审核
        multiNoProdTransHandle: function (layero) {
          var _this = this;
          layero.find("#waittopack_multiNoProdTrans").on("click", function () {
            var orderId = layero.find("[name=orderOrTrackId]").val();
            if (!orderId) {
              return layer.msg("请输入订单号或跟踪号");
            }
            layer.open({
              title: "提示",
              content: "需要将订单转待审核状态吗?",
              btn: ["确认"],
              success: function (layero1, index) {
                this.multiPackageEnterEsc = function (event) {
                  if (event.keyCode === 13) {
                    //要做一个接口操作
                    _this
                      .multiNoProdTransAjax(orderId)
                      .then((res) => {
                        $("#waittopack_multiNoProdLayerContainer").html("");
                        layer.msg(res || "转待审核操作成功", { icon: 1 });
                        deleteTableRow_waittopack([orderId],[])
                        // zttCommonRemoveDataHandle({
                        //   selectedIds: [orderId],
                        //   gridOptions: waittopack_gridOptions,
                        //   tableData: immutableStore,
                        //   errIds: [],
                        // }).then((newObj) => {
                        //   let { newData, successIds } = newObj;
                        //   immutableStore = newData;
                        //   let oldNum = $(
                        //     "#waittopack_tabs ul li.layui-this>span"
                        //   ).text();
                        //   let newNum = oldNum - successIds.length;
                        //   $("#waittopack_tabs ul li.layui-this>span").text(
                        //     newNum
                        //   );
                        //   $("#waittopackdPage .layui-laypage-count").text(
                        //     `共 ${newNum} 条`
                        //   );
                        // });
                        //关闭弹框
                        layer.close(index);
                      })
                      .catch((err) => {
                        layer.msg(err, { icon: 2 });
                      });
                    return false; //阻止系统默认回车事件
                  }
                };
                $(document).on(
                  "keydown",
                  _.throttle(this.multiPackageEnterEsc, 30000)
                ); //监听键盘事件，关闭层
              },
              end: function () {
                $(document).off("keydown", this.multiPackageEnterEsc); //解除键盘关闭事件
              },
              yes: function (index) {
                _this
                  .multiNoProdTransAjax(orderId)
                  .then((res) => {
                    $("#waittopack_multiNoProdLayerContainer").html("");
                    layer.msg(res || "转待审核操作成功", { icon: 1 });
                    deleteTableRow_waittopack([orderId],[])
                    // zttCommonRemoveDataHandle({
                    //   selectedIds: [orderId],
                    //   gridOptions: waittopack_gridOptions,
                    //   tableData: immutableStore,
                    //   errIds: [],
                    // }).then((newObj) => {
                    //   let { newData, successIds } = newObj;
                    //   immutableStore = newData;
                    //   let oldNum = $(
                    //     "#waittopack_tabs ul li.layui-this>span"
                    //   ).text();
                    //   let newNum = oldNum - successIds.length;
                    //   $("#waittopack_tabs ul li.layui-this>span").text(newNum);
                    //   $("#waittopackdPage .layui-laypage-count").text(
                    //     `共 ${newNum} 条`
                    //   );
                    // });
                    //关闭弹框
                    layer.close(index);
                  })
                  .catch((err) => {
                    layer.msg(err, { icon: 2 });
                  });
              },
            });
          });
        },
        //[多品缺货]执行具体的事件
        multiNoProdEvent: function (orderId) {
          var _this = this;
          this.multiNoProdSearchAjax(orderId)
            .then((res) => {
              _this.multiNoProdRender(res || {});
            })
            .catch((err) => {
              layer.msg(err, { icon: 2 });
            });
        },
        //[多品缺货]渲染弹框搜索后的详情
        multiNoProdRender: function (data) {
          var getTpl = waittopack_multiNoProdLayerContainerTpl.innerHTML,
            view = document.getElementById(
              "waittopack_multiNoProdLayerContainer"
            );
          laytpl(getTpl).render(data, function (html) {
            view.innerHTML = html;
            form.render();
          });
        },
        //多品缺货请求数据接口[根据订单号或跟踪号]
        multiNoProdSearchAjax: function (orderId) {
          return commonReturnPromise({
            url: "/lms/pickpackorder/stockoutquery.html",
            type: "post",
            params: {
              queryStr: orderId,
            },
          });
        },
        //[多品缺货]正常发货接口
        multiNoProdNormalAjax: function (orderIds) {
          return commonReturnPromise({
            url: "/lms/pickpackorder/stockoutshipments.html",
            type: "post",
            params: { orderIds },
          });
        },
        //[多品缺货]取消订单接口
        multiNoProdCancelAjax: function (orderId) {
          return commonReturnPromise({
            url: "/lms/pickpackorder/stockoutcancel.html",
            type: "post",
            params: {
              orderId: orderId,
            },
          });
        },
        //[多品缺货]转待审核接口
        multiNoProdTransAjax: function (orderId) {
          return commonReturnPromise({
            url: "/lms/pickpackorder/stockouttoaudit.html",
            type: "post",
            params: {
              orderId: orderId,
            },
          });
        },
        //#endregion ---多品缺货结束

        //#region [少货投篮]vue操作投篮
        lackVueShotBasketballHandle: function () {
          var _this = this;
          new Vue({
            el: "#waittopack_lackApp",
            data() {
              return {
                printChecked: false, //打印物流面单
                verifyChecked: true, //核完一单删一单
                prevVerifyOrder: "无", //上次被核单
                prevBasketNo: "无", //上次篮号
                platOrderInfos: [], //订单信息表格数据
                checkedOrderSkuInfos: [], //已投篮表格数据
                unCheckedOrderSkuInfos: [], //未投篮表格数据
                orderProgressInfos: [], //订单进度表格
                lackForm: {
                  sku: "",
                  skuNum: "",
                  basketNo: "",
                  number: "",
                  unit: "",
                  orderDetailId: "",
                },
                allChecked: false, //表格全选
                checkedCellections: [], //选择tr的复选框
              };
            },
            mounted() {
              this.renderWarehouse();
              this.watchProdWarehouses();
              this.renderTime();
              sessionStorage.setItem("LACKLASTTIMEDATA", JSON.stringify({}));
            },
            methods: {
              //sku回车事件
              skuEnterHandle() {
                let sku = this.lackForm.sku; //获取到输入的SKU
                let date = this.$refs.date.value;
                let vmThis = this;
                if (!date) {
                  return layer.msg("缺货日期不能为空", { icon: 7 });
                }
                if (!sku) {
                  return layer.msg("请先扫描SKU", { icon: 7 });
                }

                //根据日期和仓库获取缺货信息
                let unCheckedOrderSkuInfos = this.unCheckedOrderSkuInfos; //未投篮SKU
                let platOrderInfos = this.platOrderInfos; //订单信息

                var matchSkuArr = unCheckedOrderSkuInfos.filter(function (
                  item
                ) {
                  return item.sku.toUpperCase() === sku.toUpperCase();
                });
                if (matchSkuArr.length == 0) {
                  _this.errorVoiceWarning();
                  return layer.msg("没有匹配的SKU,请重新扫描", { icon: 2 });
                }
                let matchSkuInfo = matchSkuArr[0]; //多个SKU只匹配第一个
                this.lackForm.basketNo = matchSkuInfo.basketNo; //篮号
                this.lackForm.number = matchSkuInfo.skuNum; //数量
                this.lackForm.skuNum = matchSkuInfo.skuNum; //sku数量
                this.lackForm.unit = matchSkuInfo.unit; //单位
                this.lackForm.orderDetailId = matchSkuInfo.orderDetailId;
                //播报箱号
                var speechSynthesisUtterance = new SpeechSynthesisUtterance(
                  `${matchSkuInfo.basketNo}`
                );
                speechSynthesisUtterance.rate = 3;
                speechSynthesis.speak(speechSynthesisUtterance);
                //渲染订单进度
                let originOrderProgressInfos = platOrderInfos.filter(function (
                  item
                ) {
                  return item.orderId == matchSkuInfo.orderId;
                });
                originOrderProgressInfos.length > 0
                  ? (this.orderProgressInfos =
                      originOrderProgressInfos[0]["pickDetails"])
                  : (() => layer.msg("订单信息和未投篮SKU不匹配"))();
                if (matchSkuInfo.skuNum == 1) {
                  this.$refs.skuNum.focus();
                  this.lackForm.skuNum = 1;
                  this.skuNumEnterHandle();
                } else {
                  vmThis.$refs.skuNum.focus(); //sku数量输入框获取焦点
                }
                this.$forceUpdate(); //强制更新视图
              },
              //sku数量回车事件
              skuNumEnterHandle() {
                let warehouseId = this.$refs.warehouse.value;
                let date = this.$refs.date.value;
                let skuNum = this.lackForm.skuNum; //数量
                if (!skuNum) {
                  return layer.msg("数量不能为空", { icon: 7 });
                }
                if (skuNum == 0) {
                  return layer.msg("数量不能为0", { icon: 7 });
                }
                let currentSku = this.lackForm.sku;
                let orderDetailId = this.lackForm.orderDetailId;
                let currentArr = this.orderProgressInfos.filter(function (
                  item
                ) {
                  return (
                    item.sku.toUpperCase() == currentSku.toUpperCase() &&
                    item.orderDetailId == orderDetailId
                  );
                });
                if (currentArr.length == 0) {
                  return layer.msg("请检查SKU是否正确", { icon: 7 });
                }
                let currentObj = currentArr[0];
                //提交参数
                let obj = {
                  date: date,
                  warehouseId: warehouseId,
                  orderDetailId: currentObj.orderDetailId,
                  sku: currentObj.sku,
                  checkNum: skuNum,
                  orderId: currentObj.orderId,
                  basketNo: currentObj.basketNo,
                };
                let lackLastTimeData = JSON.parse(
                  sessionStorage.getItem("LACKLASTTIMEDATA")
                );
                //上次被核单
                this.prevVerifyOrder = lackLastTimeData.sku || "无";
                //上次篮号
                this.prevBasketNo = lackLastTimeData.basketNo || "无";
                var vmThis = this;
                //存储上次篮号信息
                sessionStorage.setItem("LACKLASTTIMEDATA", JSON.stringify(obj));
                _this
                  .lackShotAjax(obj)
                  .then(function () {
                    //步骤1.0:[找到订单进度的提交SKU,更新数量]
                    let isEuqalNum;
                    let objSku = obj.sku;
                    let objOrderDetailId = obj.orderDetailId;
                    vmThis.orderProgressInfos.forEach(function (order) {
                      if (order.orderDetailId == objOrderDetailId) {
                        order.checkNum += +vmThis.lackForm.skuNum;
                        order.checkNum === order.skuNum
                          ? (isEuqalNum = true)
                          : (isEuqalNum = false);
                      }
                    });
                    //步骤1.1: [找到订单进度的提交SKU,更新数量以后的数据项]
                    let currentOrderProgressInfo =
                      vmThis.orderProgressInfos.filter(function (item) {
                        return item.orderDetailId == objOrderDetailId;
                      })[0];
                    // console.log('总量和验货数量是否相等',isEuqalNum)
                    //步骤2.0: [找到和提交SKU相同的数据,更新已投数量]
                    vmThis.unCheckedOrderSkuInfos.forEach(function (item) {
                      if (item.orderDetailId == objOrderDetailId) {
                        item.checkNum = currentOrderProgressInfo.checkNum;
                      }
                    });
                    //步骤2.1:已投数量等于总数量[移除对应SKU的未投数据]
                    if (isEuqalNum) {
                      let spliceSkuIndex =
                        vmThis.unCheckedOrderSkuInfos.findIndex(function (
                          item
                        ) {
                          return item.sku == objSku;
                        });
                      //核完一单删一单是选中状态
                      if (vmThis.verifyChecked) {
                        //移除未投篮SKU表格对应SKU
                        vmThis.unCheckedOrderSkuInfos.splice(spliceSkuIndex, 1);
                        // vmThis.orderProgressInfos.splice(spliceSkuIndex, 1);
                        //移除订单信息表格对应单号
                        let orderId = currentOrderProgressInfo.orderId;
                        //获取到匹配订单信息表的数据[]
                        let matchPlatOrderInfosArr =
                          vmThis.platOrderInfos.filter(function (item) {
                            return item.orderId == orderId;
                          });
                        let matchPlatOrderInfosIndex =
                          vmThis.platOrderInfos.findIndex(function (item) {
                            return item.orderId == orderId;
                          });
                        let matchPlatOrderInfosObj = matchPlatOrderInfosArr[0];
                        let totalCheckNum = 0;
                        vmThis.checkedOrderSkuInfos.forEach(function (item) {
                          totalCheckNum += item.checkNum;
                        });
                        if (
                          totalCheckNum == matchPlatOrderInfosObj.pickDetailsNum
                        ) {
                          vmThis.platOrderInfos.splice(
                            matchPlatOrderInfosIndex,
                            1
                          );
                        }
                      }
                    }
                    //步骤3.0: 把订单进度里的SKU给添加到已投篮SKU[存在就替换]
                    let checkedSpliceSkuIndex =
                      vmThis.checkedOrderSkuInfos.findIndex(function (item) {
                        return item.orderDetailId == objOrderDetailId;
                      });
                    if (checkedSpliceSkuIndex == -1) {
                      vmThis.checkedOrderSkuInfos.push(
                        currentOrderProgressInfo
                      );
                    } else {
                      vmThis.checkedOrderSkuInfos.splice(
                        checkedSpliceSkuIndex,
                        1,
                        currentOrderProgressInfo
                      );
                    }

                    /**
                     * 步骤4.0: 判断订单进度里面的未投篮数是否都是0,如果是,判断'核完一单删一单是否选中',两者都满足条件,就移除订单信息里面的数据(这个逻辑很差)
                     * 换个角度:
                     * 选中状态:如果未投篮SKU表格里面没有单号和当前单号相匹配.表示全部投篮完毕
                     * 未选中状态: 看订单进度里面的未投篮数是否全是0
                     */
                    if (vmThis.verifyChecked) {
                      let isCurrentOrderIdArr = [];
                      let currentOrderId = currentOrderProgressInfo.orderId;
                      for (
                        let i = 0;
                        i < vmThis.unCheckedOrderSkuInfos.length;
                        i++
                      ) {
                        let item = vmThis.unCheckedOrderSkuInfos[i];
                        if (item.orderId === currentOrderId) {
                          isCurrentOrderIdArr.push(currentOrderId);
                        }
                      }
                      if (isCurrentOrderIdArr.length == 0) {
                        let spliceSkuIndex = vmThis.platOrderInfos.findIndex(
                          function (item) {
                            return item.orderId == currentOrderId;
                          }
                        );
                        spliceSkuIndex !== -1 &&
                          vmThis.platOrderInfos.splice(spliceSkuIndex, 1);
                      }
                    } else {
                      //没有选中,重新获取条件
                      let currentOrderId = currentOrderProgressInfo.orderId;
                      let isCompletedOrderArr = [];
                      for (
                        let i = 0;
                        i < vmThis.orderProgressInfos.length;
                        i++
                      ) {
                        let item = vmThis.orderProgressInfos[i];
                        if (item.skuNum - item.checkNum != 0) {
                          isCompletedOrderArr.push("还没完");
                        }
                      }
                      if (isCompletedOrderArr.length == 0) {
                        let spliceSkuIndex = vmThis.platOrderInfos.findIndex(
                          function (item) {
                            return item.orderId == currentOrderId;
                          }
                        );
                        let oldPlatOrder =
                          vmThis.platOrderInfos[spliceSkuIndex];
                        oldPlatOrder.checked = true;
                      }
                    }

                    /**
                     * 步骤5.0:判断打印物流面单是否选中
                     */
                    if (vmThis.printChecked) {
                      //需要打印的数据
                      // _this.batchSheetSizeAjax(currentOrderProgressInfo.orderId).then(function(result) {
                      //     for (var j = 0; j < result.length; j++) {
                      //         _this.packagePrint(result[j]);
                      //     }
                      // }).catch(function(err) {
                      //     layer.msg(err || err.message, { icon: 2 });
                      // });
                      $.ajax({
                        type: "POST",
                        url: ctx + "/logistics/batch/print.html",
                        data: { orderIdStr: currentOrderProgressInfo.orderId },
                        success: function (returnData) {
                          var paramsMapList = returnData.successResults;
                          if (paramsMapList && paramsMapList.length > 0) {
                            for (var j = 0; j < paramsMapList.length; j++) {
                              _this.packagePrint(paramsMapList[j]);
                            }
                          }
                          if (
                            returnData.failResults &&
                            returnData.failResults.length > 0
                          ) {
                            let str = "";
                            returnData.failResults.forEach((item) => {
                              str += item + "<br>";
                            });
                            layer.alert(str, { icon: 2 });
                          }
                        },
                        error: function (err) {
                          console.log(err);
                        },
                      });
                    }

                    //sku输入框获取焦点
                    vmThis.lackForm.sku = "";
                    vmThis.lackForm.skuNum = "";
                    vmThis.$refs.sku.focus();
                  })
                  .catch(function (err) {
                    _this.errHandle(`${currentObj.sku}投篮失败`, err);
                  });
              },
              handleAllCked() {
                if (this.allChecked) {
                  this.platOrderInfos.forEach((item) => {
                    this.checkedCellections.push(item.orderId);
                  });
                } else {
                  this.checkedCellections = [];
                }
              },
              removeOrderHandle() {
                let vmThis = this;
                if (this.checkedCellections.length == 0) {
                  return layer.msg("请选择需要移除的订单", { icon: 7 });
                }
                let date = this.$refs.date.value;
                let orderIdStr = this.checkedCellections.join(",");
                let warehouseId = this.$refs.warehouse.value;
                _this
                  .lackShotRemoveAjax({
                    date: date,
                    orderId: orderIdStr,
                    warehouseId: warehouseId,
                  })
                  .then(function (result) {
                    //重新请求一遍数据
                    vmThis.getLackInfo({
                      date: date,
                      warehouseId: warehouseId,
                    });
                    vmThis.lackForm.sku = "";
                    vmThis.lackForm.skuNum = "";
                    vmThis.lackForm.basketNo = "";
                    vmThis.lackForm.number = "";
                  })
                  .catch(function (err) {
                    _this.errHandle("移除订单失败", err);
                  });
              },
              //监听仓库变化
              watchProdWarehouses() {
                let vmThis = this;
                $("#waittopack_lackGoodsIcon").on("click", function () {
                  let date = vmThis.$refs.date.value;
                  if (!date) {
                    return layer.msg("缺货日期不能为空", { icon: 7 });
                  }
                  var warehouseId = $("#lackShotBasketball_warehouse").val();
                  let paramsObj = {
                    date: date,
                    warehouseId: warehouseId,
                  };
                  vmThis.getLackInfo(paramsObj);
                });
              },
              getLackInfo(paramsObj) {
                let vmThis = this;
                _this
                  .lackShotSearchAjax(paramsObj)
                  .then(function (result) {
                    //     let result = {"platOrderInfos":[{"orderId":37620344,"skuOverOv":"TKDL20L93-R;TKDL20L93-R","basketNo":"M2","checked":false,"pickDetails":[{"processStatus":125,"id":83466,"batchNo":"SHD202210140003","warehouseId":1,"locationCode":"I34R04-L4-07","nearArea":241,"prodSId":300750,"sku":"TKDL20L93-R","skuNum":1,"pickNum":1,"pickTime":1665714448000,"pickStatus":2,"checkNum":0,"orderId":37620344,"orderDetailId":66566033237,"basketNo":"M2","expectPickUserId":1552,"pickUserId":1552,"pickUserName":"朱浩杰","taskId":"d45156edff8080811375","creatorId":1552,"creator":"朱浩杰","modifierId":1552,"modifier":"朱浩杰","createTime":1665714433000,"modifyTime":1665714447000},{"processStatus":125,"id":83467,"batchNo":"SHD202210140003","warehouseId":1,"locationCode":"I34R04-L4-07","nearArea":241,"prodSId":300750,"sku":"TKDL20L93-R","skuNum":1,"pickNum":1,"pickTime":1665714448000,"pickStatus":2,"checkNum":0,"orderId":37620344,"orderDetailId":66566033238,"basketNo":"M2","expectPickUserId":1552,"pickUserId":1552,"pickUserName":"朱浩杰","taskId":"d45156edff8080811375","creatorId":1552,"creator":"朱浩杰","modifierId":1552,"modifier":"朱浩杰","createTime":1665714433000,"modifyTime":1665714447000}],"pickDetailsNum":2}],"checkedOrderSkuInfos":[],"unCheckedOrderSkuInfos":[{"processStatus":125,"orderId":37620344,"orderDetailId":66566033237,"sku":"TKDL20L93-R","skuNum":1,"checkNum":0,"basketNo":"M2","imageUrl":"http://192.168.0.68/sub/ep/img/prodtpl/8a9928a36d5cd282016d61d1bbad0fbf.jpg","unit":"件","locationCode":"I34R04-L4-07"},{"processStatus":125,"orderId":37620344,"orderDetailId":66566033238,"sku":"TKDL20L93-R","skuNum":1,"checkNum":0,"basketNo":"M2","imageUrl":"http://192.168.0.68/sub/ep/img/prodtpl/8a9928a36d5cd282016d61d1bbad0fbf.jpg","unit":"件","locationCode":"I34R04-L4-07"}]}
                    vmThis.platOrderInfos = result.platOrderInfos || []; //订单信息
                    vmThis.checkedOrderSkuInfos =
                      result.checkedOrderSkuInfos || []; //已投篮SKU
                    vmThis.unCheckedOrderSkuInfos =
                      result.unCheckedOrderSkuInfos || []; //未投篮SKU
                    vmThis.$forceUpdate(); //强制更新视图
                    vmThis.$refs.sku.focus(); //sku输入框获取焦点
                  })
                  .catch(function (err) {
                    _this.errHandle("获取缺货信息接口出错", err);
                  });
              },
              //渲染日期
              renderTime() {
                var date = Format(new Date(), "yyyy-MM-dd");
                laydate.render({
                  elem: "#lackShotBasketball_times",
                  value: date,
                });
              },
              //渲染select
              renderWarehouse() {
                var waittopackSession =
                  sessionStorage.getItem("WAITTOPACK_ITEMS");
                if (!waittopackSession) {
                  _this.commonSession().then(function (obj) {
                    commonRenderSelect(
                      "lackShotBasketball_warehouse",
                      obj.prodWarehouses,
                      { name: "value", code: "name", str: "" }
                    ).then(function () {
                      form.render("select");
                    });
                  });
                } else {
                  var obj = new Function(`return ${waittopackSession}`)();
                  commonRenderSelect(
                    "lackShotBasketball_warehouse",
                    obj.prodWarehouses,
                    { name: "value", code: "name", str: "" }
                  ).then(function () {
                    form.render("select");
                  });
                }
              },
            },
            watch: {
              checkedCellections() {
                //全选和非全选
                if (
                  this.checkedCellections.length == this.platOrderInfos.length
                ) {
                  this.allChecked = true;
                } else {
                  this.allChecked = false;
                }
              },
            },
          });
        },
        //[少货投篮]查询接口
        lackShotSearchAjax: function (obj) {
          return commonReturnPromise({
            type: "post",
            url: "/lms/pickshortage/getcheckorder.html",
            params: obj,
          });
        },
        //[少货投篮]投篮接口
        lackShotAjax: function (obj) {
          return commonReturnPromise({
            type: "post",
            url: "/lms/pickshortage/checksku.html",
            params: obj,
          });
        },
        //[少货投篮]移除订单接口
        lackShotRemoveAjax: function (obj) {
          return commonReturnPromise({
            type: "post",
            url: "/lms/pickshortage/removechecked.html",
            params: obj,
          });
        },
        //#endregion 少货投篮end

        //---- ajax请求start
        //获取所有采购人员post
        allPurchasingAgent: function () {
          return commonReturnPromise({
            type: "post",
            contentType: "application/json",
            url: "/lms/sys/buyerList.html",
          });
        },
        //获取所有开发人员post
        allPreprodDev: function () {
          return commonReturnPromise({
            type: "post",
            contentType: "application/json",
            url: "/lms/sys/prodOwnerList.html",
          });
        },
        //获取平台/物流属性/收件国家/发货仓库/订单标签post
        allLists: function () {
          return commonReturnPromise({
            type: "post",
            contentType: "application/json",
            url: "/lms/unauditorder/listenum.html",
          });
        },
        //获取物流/货代公司post
        allCompany: function () {
          return commonReturnPromise({
            type: "post",
            contentType: "application/json",
            url: "/lms/unauditorder/listcompanyandagent.html",
          });
        },
        //获取所有的物流方式post
        allLogisType: function (obj) {
          return commonReturnPromise({
            url: "/lms/unauditorder/listlogistype.html",
            params: {...obj,specialType: "直发物流"},
          });
        },
        // 获取配货区号
        allLocationCodeInitials: function (obj) {
          return commonReturnPromise({
            url: "/lms/pickpackorder/listLocationCodeInitial",
            params: obj,
          });
        },
        //获取店铺(获取24万行json,前端渲染不动啊)
        allStore: function (platCode) {
          return commonReturnPromise({
            type: "post",
            contentType: "application/json",
            url: `/lms/sys/orderliststorebyplatcode.html?platCode=${platCode}`,
          });
        },
        //获取平台订单状态
        listplatorderstatus: function (platCode) {
          return commonReturnPromise({
            type: "get",
            url: `/lms/undispatch/listplatorderstatus.html?platCode=${platCode}`,
          });
        },
        //配货之获取接口post
        getSku: function (obj) {
          return commonReturnPromise({
            type: "post",
            contentType: "application/x-www-form-urlencoded",
            url: "/lms/pickpackorder/getmypickbatch.html",
            params: obj,
          });
        },
        //配货之抢单接口post
        robSku: function (obj) {
          return commonReturnPromise({
            type: "post",
            contentType: "application/x-www-form-urlencoded",
            url: "/lms/pickpackorder/obtainpickbatch.html",
            params: obj,
          });
        },
        //根据分拣单号查询post
        getBatchNoAjax: function (batchNo) {
          return commonReturnPromise({
            type: "post",
            contentType: "application/x-www-form-urlencoded",
            url: "/lms/pickpackorder/getpickbatch.html",
            params: {
              batchNo: batchNo,
            },
          });
        },
        //生成分拣单接口
        getSortAjax: function (obj) {
          return commonReturnPromise({
            type: "post",
            contentType: "application/x-www-form-urlencoded",
            url: "/lms/pickpackorder/createpickbatch.html",
            params: obj,
          });
        },
        //物流方式集接口
        listLogiscoll: function () {
          return commonReturnPromise({
            url: "/lms/pickpackorder/listlogiscoll.html",
          });
        },
        //拣货人接口
        listUser: function () {
          return commonReturnPromise({
            url: "/lms/sysuser/listUser.html",
          });
        },
        //配货/分拣单号接口
        listBatchNo: function () {
          return commonReturnPromise({
            url: "/lms/pickpackorder/listbatchno.html",
          });
        },
        // 篮号接口
        listBasketNO: function (batchNo) {
          let _this = this;
          return commonReturnPromise({
            url: "/lms/pickpackorder/getbasketNo.html",
            params: {
              batchNo,
            },
          });
        },
        //拣货完成接口
        pickSuccessAjax: function (obj) {
          return commonReturnPromise({
            type: "post",
            contentType: "application/x-www-form-urlencoded",
            url: "/lms/pickpackorder/picksku.html",
            params: obj,
          });
        },
        //单品包装接口
        singlePackageAjax: function (batchNo, sku) {
          return commonReturnPromise({
            url: "/lms/order/package/single/query.html",
            params: {
              batchNo: batchNo,
              sku: sku,
            },
          });
        },
        //单品保存提交接口
        singlePackageSaveAjax: function (obj) {
          return commonReturnPromise({
            type: "post",
            contentType: "application/json",
            url: "/lms/order/package/single/batch/update.html",
            params: JSON.stringify(obj),
          });
        },
        //单品包装驳回接口
        //add by zhaoyd 20220929 单品包装值针对待发货驳回
        singlePackageRemoveAjax: function (orderIdStr) {
          return commonReturnPromise({
            // url: '/lms/order/package/single/cancel.html',
            url: "/lms/abnormalorder/toaudit.html",
            params: {
              ids: orderIdStr,
              checkOrderProcessStatus: 140,
            },
          });
        },
        //有msg的请求处理
        waittopackReturnPromise: function (obj) {
          var defaultObj = {
            type: "get",
            url: "",
            isLoading: true,
          };
          var data = Object.assign(defaultObj, obj);
          return new Promise(function (resolve, reject) {
            $.ajax({
              type: data.type,
              dataType: "json",
              url: data.url,
              contentType: data.contentType
                ? data.contentType
                : "application/x-www-form-urlencoded; charset=UTF-8",
              data: data.params ? data.params : null,
              beforeSend: function () {
                data.isLoading ? loading.show() : loading.hide();
              },
              success: function (res) {
                loading.hide();
                if (res.code == "0000") {
                  res.msg
                    ? resolve({ ...res.data, msg: res.msg })
                    : resolve(res.data);
                } else {
                  reject(res.msg || "请求接口失败");
                }
              },
              error: function (err) {
                loading.hide();
                let errInfo = err.responseJSON
                  ? err.responseJSON.message
                  : err.responseText;
                reject(errInfo || "接口请求出错");
              },
            });
          });
        },
        //称重重新计费接口
        updateFeeAjax: function (obj) {
          return commonReturnPromiseOrder({
            url: "/lms/order/package/single/update.html",
            type: "post",
            contentType: "application/json",
            params: JSON.stringify(obj),
          });
        },
        //多品包装搜索接口
        multiPackageAjax: function (queryType, value) {
          return commonReturnPromise({
            url: "/lms/order/package/multi/query.html",
            params: {
              queryType: queryType,
              value: value,
            },
          });
        },
        //打印接口
        printAjax: function (orderIdStr) {
          return commonReturnPromise({
            url: "/lms/order/package/print/one.html",
            params: {
              orderIdStr: orderIdStr,
            },
          });
        },
        //生产汇总批次接口
        generateAjax: function (obj) {
          return commonReturnPromise({
            type: "post",
            url: "/lms/pickbatchmanage/merge.html",
            params: obj,
          });
        },
        //变更拣货人接口
        changePickerAjax: function (obj) {
          return commonReturnPromise({
            type: "post",
            url: "/lms/pickbatchmanage/updatepickuser.html",
            params: obj,
          });
        },
        //获取站点接口
        getAllSiteAjax: function (platCode) {
          return commonReturnPromise({
            type: "post",
            url: "/lms/enum/getSiteEnum.html",
            params: {
              platCode: platCode,
            },
          });
        },
        //详情日志接口
        getLogsAjax: function (orderId) {
          return commonReturnPromise({
            type: "post",
            url: "/lms/orderlog/listorderlog.html",
            params: {
              orderId: orderId,
            },
          });
        },
        //[多品投篮]扫描批次号获取批次订单接口
        scanBatchNoAjax: function (batchNo) {
          return commonReturnPromise({
            type: "post",
            url: "/lms/pickpackorder/checkorder/getinfo.html",
            params: {
              batchNo: batchNo,
            },
          });
        },
        //[多品投篮]sku投篮
        skuShotAjax: function (obj) {
          return commonReturnPromise({
            type: "post",
            url: "/lms/pickpackorder/checkorder/checksku.html",
            params: obj,
          });
        },
        //[多品投篮]移除订单
        removeShotAjax: function (obj) {
          return commonReturnPromise({
            type: "post",
            url: "/lms/pickpackorder/checkorder/removechecked.html",
            params: obj,
          });
        },
        //[多品投篮]查看标记少货结果
        viewMarkReduceAjax: function (obj) {
          return commonReturnPromise({
            type: "post",
            url: "/lms/pickpackorder/checkorder/getmarkshortageinfo",
            params: obj,
          });
        },
        //[多品投篮]标记少货
        markReduceAjax: function (obj) {
          return commonReturnPromise({
            type: "post",
            url: "/lms/pickpackorder/checkorder/markshortage.html",
            params: JSON.stringify(obj),
            contentType: "application/json;charset=UTF-8",
          });
        },
        // [多品投篮]订单进度
        getProgresshAjax: function (orderId, batchNo) {
          return commonReturnPromise({
            url: "/lms/pickpackorder/checkorder/getinfoByOrderId",
            type: "post",
            params: {
              orderId: orderId,
              batchNo: batchNo,
            },
          });
        },
        //---- ajax请求end
      };
      //更多查询条件3
      waittopackName.moreHandle();
      //渲染搜索条件
      waittopackName.renderSearchItem();
      //搜索条件联动
      waittopackName.watchHandle();
      // 物流方式初始化
      waittopackName.allLogisType({}).then(function (result) {
        commonRenderSelect("waittopack_logisTypeIds", result, {
          name: "name",
          code: "id",
        }).then(function () {
          formSelects.render("xm_waittopack_logisTypeIds");
        });
      });
      //渲染时间
      waittopackName.time();
      //tab切换
      waittopackName.switchTab();
      //表单搜索
      form.on("submit(waittopackSearch)", function (data) {
        var data = data.field; //获取到表单提交对象
        var obj = waittopackName.dataHandle(data);
        waittopackName.tableRender(obj);
      });
      //配货点击
      waittopackName.distributeHandle();
      //点击设置分拣批次
      waittopackName.setHandle();
      //点击单品包装
      waittopackName.singlePackageLayer();
      //点击多品包装
      waittopackName.multiPackageLayer();
      //点击多批次配货
      waittopackName.multiDistributeLayer();
      //点击多品投篮
      waittopackName.multiShotBasketballLayer();
      //点击少货投篮
      waittopackName.lackShotBasketballLayer();
      //点击批次解绑
      waittopackName.unBindBatch();
      //点击多品缺货处理
      waittopackName.multiNoProdHandle();
      //下拉点击按钮
      waittopackName.dropdownHandle();

    }
  );
  //SKU标签打印
  $("body").on("click", "#distributeContainerForm_printSku", function () {
    var data = {};
    data.skuSearchType = 1;
    data.sSku = $(".distributeContainer-form input[name=sku]").val();
    data.warehouseId = $(
      ".distributeContainer-form select[name=warehouseId]"
    ).val();
    //ajax
    $.ajax({
      type: "post",
      dataType: "json",
      url: "/lms/skuTagPrint/list.html",
      data: data,
      beforeSend: function () {
        loading.show();
      },
      success: function (res) {
        loading.hide();
        if (res.code == "0000") {
          let item = res.data[0];
          var printData = [];
          var obj = {};
          obj.printNum = 1; //标签打印次数，弹框可修改
          console.log("打印数量：" + obj.printNum);
          obj.unit =  item.unit; //单位
          // obj.weight= accAdd(item.suttleWeight, (item.packWeight?item.packWeight : 0)); //毛重
          // obj.develop = item.bizzOwner; //开发
          obj.prodSSku = item.sSku; //子SKU
          obj.stockLocation = item.stockLocation;
          obj.prodStyle = item.style; //款式
          // obj.prodPSku = item.pSku; //父sku
          obj.inPackType = item.inPackType; //入库包装类型
          obj.packDesc = item.packDesc; //入库包装类型
          obj.printerName = "6515"; //调用的打印机名称
          obj.title = item.title;
          obj.storageNumber = "";
          //商品名称--> 名称+款式
          if (obj.prodStyle != null && obj.prodStyle != "") {
            obj.title = obj.title + "(" + obj.prodStyle + ")";
          }
          obj.printType = 2; //打印入库单标签
          printData.push(obj);
          epeanPrint_plugin_fun(2, printData);
        }
      },
      error: function () {
        loading.hide();
      },
    });
  });

  $("button[name=orderConfig]").click(function () {
    let orderColumnState = waittopack_gridOptions.columnApi.getColumnState();
    window.localStorage.setItem(
      "orderColumnState",
      JSON.stringify(orderColumnState)
    );
    layer.msg("保存设置成功");
  });

  var immutableStore = [];
  var waittopack_gridOptions = {
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
        cellRenderer: (data) => {
          let d = data.data;
          let tagsDom = "";
          if (d.platTagList && d.platTagList.length > 0) {
            tagsDom = `
                                ${d.platTagList
                                  .map((item) => {
                                    return `<span class="hp-badge" style="background:${item.color};width:auto; color:#fff;margin: 0 5px;padding:0 5px!important;">${item.tagName}</span>`;
                                  })
                                  .join("")}`;
          }
          // operOrderType 拆单合单：订单操作类型：0原始订单，1拆除订单，2合并订单
          const operOrderTypeTag =
            d.operOrderType == 1
              ? '<span class="hp-badge layui-bg-orange" title="拆出订单">拆</span>'
              : d.operOrderType == 2
              ? '<span class="hp-badge layui-bg-orange" title="合并订单">合</span>'
              : d.operOrderType == 0 && d.operOriginId != "0"
              ? '<span class="hp-badge layui-bg-orange" title="拆单订单">拆</span>'
              : "";
          // 重寄订单
          let orderLabel = d.operOrderType == 3 ? '<span style="color:red">重寄</span>':''
          // 店铺客服
          const customServicerHtml = d.customServicer ? `[${d.customServicer}]` : ''
          return `<div class="alignLeft">
                        <span class="pora copySpan">
                            <a>${d.id || ""}</a>
                            <button class="layui-btn layui-btn-primary layui-btn-xs copyTxt" name="copy" onclick="layui.admin.copyTxt(this, event)">复制</button>
                        </span>
                        <span>[${d.platCode}]</span>
                        ${orderLabel}
                        ${tagsDom}
                        ${operOrderTypeTag}	
                        <p id="toAudit_table_storeAcct">${d.storeAcct || ""}[${
            d.shopId || ""
          }]</p>
                        <p>[${d.salesPersons || ""}][${
            d.sellLeaderName || ""
          }]${customServicerHtml}</p>
                        <span class="pora copySpan">
                            <a id="toAudit_table_platOrderId">${
                              d.platOrderId
                            }</a>
                            <button class="layui-btn layui-btn-primary layui-btn-xs copyTxt" name="copy" onclick="layui.admin.copyTxt(this, event)">复制</button>
                        </span>
                        <p>${d.platOrderStatus || ""}</p>
                    </div>`;
        },
      },
      {
        wrapText: true,
        autoHeight: true,
        headerName: "订单金额",
        cellRenderer: (data) => {
          let d = data.data,
            str = "";
          let jsonData = JSON.stringify(d).replace("'", "");
          jsonData = jsonData.replace(/</g, '&lt;')
          jsonData = jsonData.replace(/>/g, '&gt;')
          //利润计算逻辑
          let profitCalculation = `<span data-text='${jsonData}' onmouseenter="waittopackOrderProfitTipsShow(this)" onmouseleave="waittopackOrderProfitTipsHide(this)">${d.profit || '0.00'}</span>`;
          let fee = [d.platFee || 0, d.otherFee || 0].filter((i) => i != 0);
          if (d.logisApplyStatus == 4 && d.logisApplyFailMsg) {
            str += `<div class="waitOrderErrorTips dis_flex"><div class="waitOrderErrorTipsword">${
              d.logisApplyFailMsg || ""
            }</div><div class="waitOrderErrorTipsClose">x</div></div>`;
          }
          let amtDom = d.platShippingAmt
            ? `<span>(${d.platShippingAmt})</span>`
            : "";
          str += `<div class="alignLeft">
                        <div><span class='gray'>${
                          d.currency || ""
                        }</span><span id="toAudit_table_platOrderAmt">${
            d.platOrderAmt || ""
          }</span>${amtDom}</div>
                        <div><span class="gray">平台费</span>${fee.join(
                          " + "
                        )}</div>
                        <div><span class="gray">商品成本(￥)</span>${d.prodCost} / ${d.costPrice}</div>
                        <div><span class="gray">物流成本(￥)</span>${
                          d.shippingCost !== undefined ? d.shippingCost : ""
                        }<button class="layui-btn layui-btn-xs" name="logisCost" style="cursor:pointer;">详</button></div>
                        <div><span class="gray">利润(￥)</span>${profitCalculation} <span class="gray">${(
            (100 * d.profit) /
            d.platOrderAmt /
            d.exchangeRate
          ).toFixed(2)}%</span></div>
                    </div>`;
          return str;
        },
      },
      {
        headerName: "商品",
        width: 180,
        wrapText: true,
        autoHeight: true,
        cellRenderer: (data) => {
          let d = data.data;
          return `<div class="alignLeft">
                        <div><span class="gray">种类：</span><span id="toAudit_table_skuQuantity">${
                          d.skuQuantity || ""
                        }</span></div>
                        <div><span class="gray">数量：</span><span id="toAudit_table_prodQuantity">${
                          d.prodQuantity || ""
                        }</span></div>
                        <div><span class="gray">预估重(g)：</span><span>${
                          d.preWeight
                        }</span></div>
                        <div><span class="gray">称重(g)：</span><span>${
                          d.realWeight
                        }</span></div>
                        <div><span class="gray">计费重(g)：</span><span>${
                          d.priceWeight
                        }</span></div>
                    </div>`;
        },
      },
      {
        headerName: "收件人",
        wrapText: true,
        autoHeight: true,
        cellRenderer: (data) => {
          let d = data.data;
          const _buyerNote = d.buyerNote || "";
          const _buyerNoteCopyHtml = `<a class="hidden">${_buyerNote}</a>
                    <button
                        class="layui-btn layui-btn-primary layui-btn-xs copyTxt"
                        onclick="layui.admin.copyTxt(this, event)"
                    >
                        复制
                    </button>`;
          return `<div class="alignLeft">
                        <div id="toAudit_table_shippingUsername">${
                          d.shippingUsername || ""
                        }</div>
                        <div>[${d.shippingCountryCnName || ""}]</div>
                        <div data-text="${_buyerNote}" onmouseenter="waittopackBuyerTipsShow(this)" onmouseleave="waittopackBuyerTipsHide(this)">
                            <span class="pora copySpan">
                                <span class="gray">留言：</span>${_buyerNote.slice(
                                  0,
                                  46
                                )}
                                ${_buyerNote ? _buyerNoteCopyHtml : ""}
                            </span>
                        </div>
                    </div>`;
        },
      },
      {
        headerName: "物流",
        wrapText: true,
        autoHeight: true,
        cellRenderer: (data) => {
          let d = data.data;
          let closeTimeHmtl = `<div><span class="gray">关单：</span>${Format(d.closeTime || "", 'yyyy-MM-dd hh:mm:ss')}<span class="${d.closeTimeDay < 4 ? 'plus-red-text':''}">(≤${d.closeTimeDay || '0'})</span></div>`
          return `<div class="alignLeft">
                        <div><span class="gray">买家：</span><span id="toAudit_table_buyerRequireShippingType">${
                          d.buyerRequireShippingType || ""
                        }</span></div>
                        <div><span class="gray">发货：</span><span id="logisTypeName_toAuditOrder">${
                          d.logisTypeName || ""
                        }</span></div>
                        <div>
                            <span class="gray">跟踪号：</span>
                            <span class="pora copySpan">
                                <a>${d.logisTrackingNo || ""}</a>
                                <button class="layui-btn layui-btn-primary layui-btn-xs copyTxt" name="copy" onclick="layui.admin.copyTxt(this, event)">复制</button>
                            </span>
                            <image onclick="okk(${d.id})" src="${ctx}/static/img/print.png" width="20" lay-tips="打印预览"></image>
                        </div>
                        <div><span class="gray">状态：</span>${
                          d.logisticsStatus || ""
                        }</div>
                        ${d.closeTime ? closeTimeHmtl : ''}
                    </div>`;
        },
      },
      {
        headerName: "平台时间",
        wrapText: true,
        autoHeight: true,
        cellRenderer: (data) => {
          let d = data.data;
          return `<div class="alignLeft">
                        <div><span class="gray">订单：</span><span id="toAudit_table_orderTimeCn">${Format(
                          d.orderTimeCn || "",
                          "yyyy-MM-dd hh:mm:ss"
                        )}</span><span class="${d.orderDay>4?'plus-red-text':''}">(${d.orderDay || '0'})</span></div>
                        <div><span class="gray">申请：</span><span>${Format(
                          d.logisApplyTime || "",
                          "yyyy-MM-dd hh:mm:ss"
                        )}</span></div>
                        <div><span class="gray">标记：</span><span>${Format(
                          d.markShippingTime || "",
                          "yyyy-MM-dd hh:mm:ss"
                        )}</span></div>
                        <div><span class="gray">截止：</span><span>${Format(
                          d.shipByDate || "",
                          "yyyy-MM-dd hh:mm:ss"
                        )}</span></div>
                    </div>`;
        },
      },
      {
        headerName: "订单处理",
        wrapText: true,
        autoHeight: true,
        cellRenderer: (data) => {
          let d = data.data;
          // 备注
          let recentNoteContent = "";
          if (
            d.platOrderNotes &&
            Array.isArray(d.platOrderNotes) &&
            d.platOrderNotes.length
          ) {
            let noteContentLength = d.platOrderNotes.length;
            recentNoteContent =
              `<span data-text='${JSON.stringify(d.platOrderNotes)}' onmouseenter="waittopackBuyerTipsShowTable(this)" onmouseleave="waittopackBuyerTipsHide(this)">${d.platOrderNotes[noteContentLength - 1].noteType || ""}:${d.platOrderNotes[noteContentLength - 1].noteContent || ""}</span>`;
          }
          const noteTipsHtml = `<span class="hp-badge fr waittopack-noteContent-tag">多</span>`;
          let html = `<div class="alignLeft">
                        <div><span class="gray">仓库：</span>${
                          d.warehouseName || ""
                        }</div>
                        <div><span class="gray">批次：</span>
                            <span>${d.batchNo || ""}</span>
                            <span style="color:#33aba0">${
                              d.basketNo || ""
                            }</span>
                        </div>
                        <div><span class="gray">备注：</span>${recentNoteContent}${
                          (d.platOrderNotes && d.platOrderNotes.length>1) ? noteTipsHtml : ""
          }</div>
                    </div>`;
          return html;
        },
      },
      {
        headerName: "仓库处理",
        width: 172,
        wrapText: true,
        autoHeight: true,
        cellRenderer: (data) => {
          let d = data.data;
          return `<div class="alignLeft">
                        <div><span class="gray">批次：</span>${
                          d.batchInfo || ""
                        }</div>
                        <div><span class="gray">配货：</span>${
                          d.pickInfo || ""
                        }</div>
                        <div><span class="gray">投篮：</span>${
                          d.checkInfo || ""
                        }</div>
                        <div><span class="gray">包装：</span>${
                          d.packingInfo || ""
                        }</div>
                        <div><span class="gray">分拣：</span>${
                          d.scanerInfo || ""
                        }</div>
                    </div>`;
        },
      },
      {
        field: "操作",
        width: 100,
        wrapText: true,
        autoHeight: true,
        cellRenderer: (data) => {
          let d = data.data,
              wishBtnDom = '', // wish退款
            lazadaBtnDom = '', //lazada拆单
            splitBtnDom = ''; //拆分订单
          if(d.platCode == "wish"){
            wishBtnDom = $("#waittopackage_btnPermTag_wish").html(); //wish取消
          }
          //未核单125未包装130仓库缺货135
          if (
            d.platCode == "lazada" &&
            d.platOrderStatus.includes("canceled") &&
            (d.processStatus == 125 ||
              d.processStatus == 130 ||
              d.processStatus == 135)
          ){
            lazadaBtnDom = $("#waittopack_btnPermTag_lazada").html()
          }
          //136 拆分订单
          if(d.processStatus == 136){
            splitBtnDom = $('#waittopack_splitPermTag_allTag').html();
          }
          return `<button name="remark" class="layui-btn layui-btn-xs">备注</button><br>${lazadaBtnDom}${wishBtnDom}${splitBtnDom}`;
        },
      },
    ],
    rowData: immutableStore,
    getRowNodeId: function (data) {
      return data.id;
    },
    // rowModelType: 'serverSide', // 服务端
    defaultColDef: {
      resizable: true, //是否可以调整列大小，就是拖动改变列大小
    },
    suppressPaginationPanel: true, // 自定义分页
    rowSelection: "multiple", // 设置多行选中
    suppressRowClickSelection: true,
    onGridReady: function (params) {
      waittopack_gridOptions.columnApi.applyColumnState({
        state: JSON.parse(window.localStorage.getItem("orderColumnState")),
      });
      //表格创建完成后执行的事件
      params.api.sizeColumnsToFit(); //调整表格大小自适应
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
    onRowClicked: function (event) {
      // console.log(event)
    },
    //单击单元格触发的事件
    onCellClicked: function (event) {
      //event.data 选中的行内数据，event.event 为鼠标事件
      handleTableOptions(event);
    },
    onCellMouseDown: function (event) {
      timeStamp = event.event.timeStamp;
    },
    // onRowDoubleClicked: function (event) {
    // console.log(event.data)
    //event.data 选中的行内数据，event.event 为鼠标事件
    //     let data = event.data;// 获取选中行数据
    //     commonOrderDetailFn(data)
    // },
  };

  var timeStamp;

  $(document)
    .off("click", ".waitOrderErrorTipsClose")
    .on("click", ".waitOrderErrorTipsClose", function () {
      $(this).parents(".waitOrderErrorTips").remove();
    });

  var gridDiv = document.querySelector("#waittopack_tableId");
  agGrid.LicenseManager.setLicenseKey(
    "IRDEVELOPERS_COM_NDEwMjM0NTgwMDAwMA==f08aae16269f416fe8d65bbf9396be5f"
  );
  new agGrid.Grid(gridDiv, waittopack_gridOptions, immutableStore);

  function initAjax(
    url,
    method,
    data,
    func,
    contentType,
    isLoad,
    func2,
    func3
  ) {
    //初始化ajax请求
    if (!isLoad) {
      loading.show();
    }
    $.ajax({
      type: method,
      url: ctx + url,
      dataType: "json",
      async: true,
      data: data,
      contentType: contentType || "application/json",
      beforeSend: function (returnData) {
        if (func2) {
          func2(returnData);
        }
      },
      success: function (returnData) {
        loading.hide();
        if (returnData.code == "0000") {
          func(returnData);
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
        loading.hide();
        if (func3) {
          func3(returnData);
        }
      },
    });
  }

  function handleTableOptions(event) {
    let optionEvent = event.event.target.name,
      data = event.data; // 获取选中行数据

    if (optionEvent == "remark") {
      commonDirectMailRemark(data);
    } else if (optionEvent == "waittopack_lazadaBtn") {
      // lazada拆单
      commonReturnPromise({
        type: "post",
        contentType: "application/json",
        url: "/lms/unauditorder/queryDetail.html?orderId=" + data.id,
      }).then((res) => {
        originOrderDemolimotion_wait(res,waittopack_gridOptions);
      });
    }else if (optionEvent == "waittopackage_wishBtn") {
      // wish退款
      originOrderWishRefund([data],'',function(){
        $('[lay-filter="waittopackSearch"]').trigger('click')
      })
    } else if(optionEvent == 'waittopack_splitBtn'){
      waittopackSplitOrderHandle(data);
    }else if(optionEvent === 'logisCost'){
      //物流成本
      commonLogisCostLayerHandle(data.id);
    }else if (event.event.timeStamp - timeStamp < 300) {
      commonOrderDetailFn(data, waittopack_gridOptions);
    }
  }

  function waittopackSplitOrderHandle (data) {
    let orderDetails = data.orderDetails;
    data.orderDetails && data.orderDetails.sort(sortBy('availableStock'));
    layer.open({
      type: 1,
      title: '订单拆分',
      btn: ['拆分', '关闭'],
      area: ['100%', '80%'],
      content: $('#pop_waittopack_demolition_original').html(),
      id: 'pop_waittopack_demolition_originalId',
      success: function (layero, index) {
        data.orderDetails = data.orderDetails.sort(function (a, b) {
            return a.availableStock - b.availableStock;
        });
        demolitiontableIns = layui.table.render({
          elem: '#waittopack_demolition_original_table',
          data: data.orderDetails,
          totalRow: true,
          cols: [
              [
                  { title: "商品信息", field: "prodSSku",sort:true, templet: "#waittopack_orginal_order_products",width: 300 },
                  { title: "子店铺单号", field: "platOrderItemId" },
                  { title: "子订单类型", field: "platOrderDetailType" },
                  { title: "子订单状态", field: "platOrderDetailStatus" },
                  { title: "总重量(g)", field: "prodWeight", templet: "#waittopack_orginal_order_demolition", totalRow: true },
                  { title: "销售金额", field: "platOrderDetailAmt",totalRow: true},
                  { title: "物流属性", field: "prodLogisAttrList" },
                  { title: "sku重量(g)", field: "prodUnitWeight"},
                  { title: "可用库存", field: "availableStock",sort:true},
                  { title: "平台数量", field: "platQuantity"},
                  { title: "商品数量", field: "prodQuantity"},
                  { title: "商品总量", field: "allCount",sort:true},
                  { title: "拆分数量", templet: "#waittopack_orginal_order_number" },
                  { title: "拆分重量(g)", field: "prodSSkuWeight", templet: "#waittopack_orginal_order_dynamicWeight", totalRow: true },
                  { title: "拆分金额", field: "splitCost", templet: "#waittopack_orginal_order_dynamicMoney",totalRow: true },
              ]
          ],
          page: true,
          height: 480,
          limit: 500,
          limits: [200,500],
          id: 'waittopack_demolition_original_table',
          done: function(res) {
              let newArr = delSameObjValue(layui.table.cache.waittopack_demolition_original_table, 'allCount', ['prodSSku'], ['prodQuantity']);
              layui.table.cache.waittopack_demolition_original_table.forEach((item,index) => {
                  let TableDom = $("#waittopack_demolition_original_table").next()
                  newArr.forEach(cItem => {
                      if (item.prodSSku == cItem.prodSSku) {
                          item.allCount = cItem.allCount
                      }
                  })
                  TableDom.find(`tr[data-index=${index}] td[data-field=allCount] div`).text(res.data[index].allCount)
              })
              waittopackStyle('waittopack_demolition_original_table')

              imageLazyload();
              layui.form.render()
              //总计展示
              waittopack_originOrderDemolimotionTotalHandle(layero);
              //监听tr的input变化
              waittopack_originOrderDemolimotionTbodyHandle(layero, data);
          }
        });
      },
      yes: function(index, layero) {
          var trs = layero.find('.layui-table-body tbody>tr');
          var dataArr = [];
          for (var i = 0; i < trs.length; i++){
              var tr = trs[i];
              var orderDetail = orderDetails[i];
              var orderDetailId = orderDetail.id;
              var demolitionQuality = $(tr).find('input[name=demolitionQuality]').val();
              dataArr.push({ orderDetailId: orderDetailId, prodQuantity: demolitionQuality });
          };
          dataArr = dataArr.filter((value)=> value.prodQuantity)
          const turnToAbnormalOrderTag = $('#waittopack_demolition_original_abnormal').prop('checked')
          const turnToAbnormalOrder = $('#waittopack_demo_original_abnormal').prop('checked')
          commonReturnPromise({
              type: 'post',
              url: '/lms/unauditorder/splitorder.html',
              contentType: 'application/json',
              params: JSON.stringify({
                  id: data.id,
                  orderSplitDetailDtos: dataArr
              })
          }).then(res => {
              if(!turnToAbnormalOrderTag&&!turnToAbnormalOrder){
                  layer.msg('操作成功', { icon: 1 });
                  layer.close(index);
                  updateSingleRow_waittopack(data.id)
                  // $('#waittopackSearch').trigger('click');
              }else if(turnToAbnormalOrderTag){
                  initAjax('/unauditorder/markabnormal.html', 'post', { ids: res }, function(returnData) {
                      const {failResults,successResults} = returnData.data
                      let str = ''
                      if(successResults.length){
                          let trackReg = /(?<=(\[))\w+(?=(\]))/g;
                          let abnormalorderList=[]
                          successResults.forEach(item=>{
                              abnormalorderList.push(item.match(trackReg)[0])
                          })
                          str = `拆分订单{${abnormalorderList.join('、')}}已转至其他异常单`
                      }else{
                          str =failResults.join('\n') 
                      }
                      layer.alert(str, {icon: successResults.length ? 1 : 7},function(){
                          layer.closeAll()
                          updateSingleRow_waittopack(data.id)
                          // $('#waittopackSearch').trigger('click');
                      })
                      
                  }, 'application/x-www-form-urlencoded')
              }else if(turnToAbnormalOrder){
                  initAjax('/abnormalorder/tocancel.html', 'post', { ids: res }, function (returnData) {
                      layer.close(index);
                      layui.admin.batchResultAlert(`拆除订单{${res}}已转至取消订单:`, returnData.data, function (errIdsArr) {
                          // $('#waittopackSearch').trigger('click');
                          updateSingleRow_waittopack(data.id)
                      });
                  }, 'application/x-www-form-urlencoded');
              }
          }).catch(err => {
              layer.msg(err, { icon: 2 });
          });
          
      },
  })
  }
  function waittopackStyle(id){
    layui.table.cache[id].forEach((item,index) => {
        // 商品总量大于可用库存时，标红加粗
        if(item.allCount>item.availableStock && item.holdStock <= 0){
            // waittopack_product_table
            $("#" + id).next().find(`tr[data-index=${index}] td[data-field=availableStock]>div`).addClass('orderRedStyle')
            $("#" + id).next().find(`tr[data-index=${index}] td[data-field=platQuantity]>div`).addClass('orderRedStyle')
            $("#" + id).next().find(`tr[data-index=${index}] td[data-field=prodQuantity]>div`).addClass('orderRedStyle')
            $("#" + id).next().find(`tr[data-index=${index}] td[data-field=allCount]>div`).addClass('orderRedStyle')
        }
        if(item.platQuantity == 0){
            $("#" + id).next().find(`tr[data-index=${index}] td[data-field=platQuantity]`).css('background','#fab81c');
        }
    })
  }
  function waittopack_originOrderDemolimotionTotalHandle (layero) {
    //总计文字展示
    layero.find('.layui-table-total td[data-field=prodSSku]>div').html('<b>总计</b>');
    //重量求和
    let $tr = layero.find('.layui-table-box .layui-table-body tr');
    let totalWeight = 0;
    for (let i = 0; i < $tr.length; i++){
        let tr = $tr[i];
        let prodWeight = $(tr).find('td[data-field=prodWeight]>div').text();
        totalWeight += Number(prodWeight);
    }
    layero.find('.layui-table-total td[data-field=prodWeight]>div').html(totalWeight.toFixed(2));
  }
  function waittopack_originOrderDemolimotionTbodyHandle (layero, res) {
    layero.on('change', 'input[name=demolitionQuality]', function (event) {
        let $parentTr = $(this).parents('tr');
        // 判断是否有拆单确认弹窗
        // 线上物流：SMT物流、虾皮、Lazada、Joom线上   true
        // 未勾选“拆出订单转取消订单”  false
        // （平台数量＜商品数量 and 拆分数量<商品数量）or（item_id有多行 and 至少有一行的平台数量 = 0）
        let companyName = res.companyName
        let companyFlag = ['SMT物流','虾皮','Lazada','Joom线上', '待处理订单'].includes(companyName)
        let turnToAbnormalOrder = $('#waittopack_demo_original_abnormal').prop('checked')
        let platCount = $parentTr.find('td[data-field=platQuantity]>div').text() // 平台数量
        let itemCount = $parentTr.find('td[data-field=prodQuantity]>div').text() // 商品数量
        let splitCount = Number(event.target.value) // 拆分数量

        let platZero = res.orderDetails.filter(item => item.platQuantity === 0)

        let val = event.target.value;
        if (companyFlag && !turnToAbnormalOrder && ((Number(platCount) < Number(itemCount) && Number(splitCount) < Number(itemCount) ) || (res.orderDetails.length > 1 && platZero?.length > 0))) {
            // 显示弹窗
            layer.confirm('拆出订单无法使用线上物流发货，请确认是否继续？',{
                cancel: function() {
                    $parentTr.find('td[data-field=prodSSkuWeight]>div').html('')
                    $parentTr.find('td[data-field=splitCost]>div').html('')
                    $parentTr.find('[name=demolitionQuality]').focus().select()
                }
            }, function(index) {
                handleSplit(val, $parentTr, layero)
                layer.close(index);
            },function() {
                $parentTr.find('td[data-field=prodSSkuWeight]>div').html('')
                $parentTr.find('td[data-field=splitCost]>div').html('')
                $parentTr.find('[name=demolitionQuality]').focus().select()
            })
        } else {
            handleSplit(val, $parentTr, layero)
        }
    });
  }

  function handleSplit(val, $parentTr, layero) {
    let unitWeight = $parentTr.find('td[data-field=prodUnitWeight]>div').text();
    let targetDom = $parentTr.find('td[data-field=prodSSkuWeight]>div');
    let splitMoneyDom = $parentTr.find('td[data-field=splitCost]>div');//拆分金额容器
    let totalMoney = $parentTr.find('td[data-field=platOrderDetailAmt]>div').text(); //总金额
    let prodNum = $parentTr.find('td[data-field=prodQuantity]>div').text(); //总数量
    if (val) {
        let totalWeight = val * unitWeight;
        let splitMoney = (totalMoney / prodNum) * val;
        targetDom.html(`${totalWeight}`);
        splitMoneyDom.html(`${splitMoney.toFixed(2)}`);
    } else {
        targetDom.html('');
        splitMoneyDom.html('');
    }
    //变化以后,更新拆分重量和拆分数量
    let $tr = layero.find('.layui-table-box .layui-table-body tr');
    let totalWeight = 0;
    let totalNum = 0;
    let totalSplitMoney = 0;
    for (let i = 0; i < $tr.length; i++){
        let tr = $tr[i];
        let prodWeight = $(tr).find('td[data-field=prodSSkuWeight]>div').text() || 0;
        let skuNum = $(tr).find('td[data-field=prodSSku]>div>input').val() || 0;
        let money = $(tr).find('td[data-field=splitCost]>div').text() || 0;
        totalWeight += Number(prodWeight);
        totalNum += Number(skuNum);
        totalSplitMoney += Number(money);
    }
    layero.find('.layui-table-total td[data-field=prodSSkuWeight]>div').html(totalWeight.toFixed(2));
    layero.find('.layui-table-total td[data-field=prodSSku]>div').html(totalNum);
    layero.find('.layui-table-total td[data-field=splitCost]>div').html(totalSplitMoney.toFixed(2));
  }

  function updateSingleRow_waittopack(id){
    // 选中的数据
    let data = waittopack_gridOptions.api.getRowNode(id);
    commonReturnPromise({
        url: ctx + '/undispatch/list.html',
        type: 'POST',
        params:{orderIds:id}
    }).then(function(result){
        data.setData(result[0]?result[0]:[]);
    })
  }

  waittopackBuyerTipsShow = function (dom) {
    const contentshow = $(dom).attr("data-text");
    console.log(contentshow);
    if (contentshow) {
      layui.layer.tips(
        `<span style="color:#008B8B">${contentshow}</span>`,
        $(dom),
        {
          tips: [1, "#fff"],
          time: 0,
        }
      );
    }
  };

  waittopackBuyerTipsShowTable = function (dom) {
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
  };
  

  waittopackBuyerTipsHide = function () {
    layui.layer.closeAll("tips");
  };

  //固定表头
  // UnifiedFixedFn('waittopackCard');
})(jQuery, layui, window, document);

var showQualityCheckHandle = function (dom) {
  let qualityContent = $(dom).next("input").val();
  // console.log(qualityContent);
  layer.open({
    type: 1,
    content: `<div style="padding:20px;"><textarea id="showQualityCheckTextarea" style="display:none;">${qualityContent}</textarea></div>`,
    area: ["60%", "60%"],
    btn: ["关闭"],
    success: function () {
      layui.use("layedit", function () {
        var layedit = layui.layedit;
        layedit.build("showQualityCheckTextarea", {
          tool: ["link", "face"],
        }); //建立编辑器
      });
    },
  });
};
function waittopackOrderProfitTipsShow(dom){
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
function waittopackOrderProfitTipsHide(){
  layui.layer.closeAll("tips");
}