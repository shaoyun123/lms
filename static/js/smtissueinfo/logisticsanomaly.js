layui.use(['form', 'table', 'layer', 'element', 'laypage', 'upload', 'tableMerge', 'laydate', 'formSelects','laytpl'], function() {
  var form = layui.form,
      table = layui.table,
      element = layui.element,
      laydate = layui.laydate,
      formSelects = layui.formSelects,
      laytpl = layui.laytpl,
      laypage = layui.laypage;
  layer = layui.layer;
  form.render();
  var logisticsAnomaly_company = null,
      logisticsAnomaly_allstore = null,
      // logisticsAnomaly_platOrderStatus = null,
      logisticsAnomaly_logisType = null,
      logisticsAnomaly_Site = null,
      logisticsAnomaly_formdata ={},
      logisticsAnomaly_pageEnum = null,
      logisticsAnomaly_Currency = null,
      logisticsAnomaly_companyType = "";
  laydate.render({
      elem: '#logisticsAnomaly_time',
      type: 'datetime',
      inputAuto: true,
      range: true,
      showShortcuts: true,
  });
  new dropButton('logisticsAnomaly_logis');
  new dropButton('logisticsAnomaly_orderHandle');

  // 监听input输入
  $('#logisticsAnomalyForm [name=searchValue]').bind('input propertychange', function() {
    var inputLen = $('[name=searchValue]').val()
    if(inputLen.includes(',')){
        $('#logisticsAnomalyForm [name=switchSearchValue]').prop('checked',true);
    }
    form.render('checkbox')
})


  
  // 前端更新行，更新后不刷新表格
  function updateTableRow_logisticsAnomaly(ids,errIdsArr){
      zttCommonUpdataDataHandle({
          selectedIds: ids,
          errIds: errIdsArr
      }).then(newObj => {
          // 修改成功的数据
          let { successIds } = newObj;
          if(successIds.length != 0){
              // 选中的数据
              let checkStatus = logisticsAnomaly_gridOptions.api.getSelectedRows();
              let newCheckStatus = deepCopy(checkStatus)
              commonReturnPromiseRes({
                  url: ctx + '/unauditorder/listorder.html',
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
                  logisticsAnomaly_gridOptions.api.updateRowData({ update: newCheckStatus });
              })
          }
      });
  }

  //获取物流状态
  commonReturnPromise({
    url: '/lms/platorder/getAbnormalStatusList.html'
  }).then(res => {
    commonRenderSelect('logisticsAnomaly_orderStatusName', res).then(()=>{
      formSelects.render('logisticsAnomaly_orderStatusName');
      $('#logisticsAnomaly_orderStatusName').attr('acct_id', res.join(','));
    })
  });


  var nowdate = new Date(new Date().toLocaleDateString()).getTime()
  var endDate = Format(nowdate + 24 * 60 * 60 * 1000 - 1, 'yyyy-MM-dd hh:mm:ss')
  var onemonth = Format(new Date(nowdate - 60 * 24 * 3600 * 1000), 'yyyy-MM-dd hh:mm:ss')
  $('#logisticsAnomaly_time').val(onemonth + ' - ' + endDate)

  // 展示和隐藏 更多查询条件
  $('#showMoreSearchCondition_logisticsAnomaly').click(function () {
      var self = this
      if ($(self).hasClass('showExternal')) {
          $(self).closest('.layui-form').find('.externalContainabnorlmalorder').hide()
          $('#hide_icon_logisticsAnomaly').show()
          $('#show_icon_logisticsAnomaly').hide()
          $(self).removeClass('showExternal')
          logisticsAnomalyHasValue('logisticsAnomalyForm', 'showMoreSearchCondition_logisticsAnomaly');
      } else {
          $(self).closest('.layui-form').find('.externalContainabnorlmalorder').show()
          $('#hide_icon_logisticsAnomaly').hide()
          $('#show_icon_logisticsAnomaly').show()
          $(self).addClass('showExternal')
      }
  });

  function logisticsAnomalyHasValue (formId, btnId) {
      let inputs = $(`#${formId} .externalPopAuditorder`).find('input');
      let count = 0;
      let showDom = $(`#${btnId} .hasValue`);
      for (let i = 0; i < inputs.length; i++){
          let item = inputs[i];
          let val = $(item).val();
          if ( val&& val != '请选择') {
              count++;
          }
      }
      if (count > 0) {
          showDom.html('<font color="red">(有值)</font>');
      } else {
          showDom.html('');
      }
  }

  //选项卡点击事件
  var processStatusVal
  element.on('tab(logisticsAnomaly_Tab)', function(data) {
      var processStatus = data.elem.context.dataset.index;
      processStatusVal = processStatus
      $('#logisticsAnomalyForm input[name="processStatus"]').val(processStatus);
      $('#logisticsAnomalySearch').click();
      //触发页面操作按钮变化 TODO
      $("#logisticsAnomaly_handle").hide();
      $('#logisticsAnomaly_export').show();
      if(processStatus === '0'){
          // 未处理
        $("#logisticsAnomaly_handle").show();
        $('#logisticsAnomaly_export').show();
      } else if (processStatus == 1) {
          // 已处理
      }else if(processStatus == ''){
          // 全部
      }
  });

  //更新订单状态
  $('#logisticsAnomaly_syncOrderStatus').on('click', function () {
      let idsArr = getTableSelectIds();
      if (!idsArr || idsArr.length < 1) {
          layer.msg('请选择订单',{icon:7});
          return;
      }
      commonReturnPromise({
          url: '/lms/unauditorder/syncplatstatus.html',
          type: 'post',
          params: {
              ids: idsArr.join()
          }
      }).then(function(result) {
          layui.admin.batchResultAlert("更新订单状态完成:", result, function(errIdsArr) {
              updateTableRow_logisticsAnomaly(idsArr,errIdsArr)
          });
      }).catch(function(resErr) {
          layer.msg(resErr.message, { icon: 2 });
      });
  });

  // 表单清空
  // form.on('')
  // 表单提交
  form.on('submit(logisticsAnomalySearch)', function(data) {
      let switchCked = $('#logisticsAnomalyForm [name=switchSearchValue]').is(':checked');
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
      }
      if(!data.field.orderStatusName){
        data.field.orderStatusName = $('#logisticsAnomaly_orderStatusName').attr('acct_id');
      }
      if(data.field.searchType == 'sSku' && switchCked == true){ //商品SKU精确
        data.field.prodSSkus = data.field.searchValue;
      }else if(data.field.searchType == 'sSku' && switchCked == false){ //商品SKU模糊
        data.field.exactProdSSkus = data.field.searchValue;
      }else if(data.field.searchType == 'pSku' && switchCked == true){ //店铺SKU精确
        data.field.storeSSkus = data.field.searchValue;
      }else if(data.field.searchType == 'pSku' && switchCked == false){ //店铺SKU模糊
        data.field.exactStoreSSku = data.field.searchValue;
      }
      delete data.field.searchType;
      delete data.field.searchValue;
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
        if ($("#logisticsAnomalyForm select[name=company]").val()) {
            let logisTypeIds = [];
            $("#logisticsAnomalyForm select[name=logisTypeIds] option").each(function () {
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
        data.field.logisTypeIds = $('#logisTypeIds_xm_select_logisticsAnomaly').attr('acct_ids')
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


      // 1. 选择了部门，没有选店铺
      //     1.1 部门下有店铺，传全部店铺
      //     1.2 部门下没有店铺，传0
      // 2. 选择了部门，选择了店铺，传选择的店铺
      if(data.field.orgs != ''&&data.field.storeAcctIds == ''){
          data.field.storeAcctIds = $('#logisticsAnomaly_store').attr('acct_ids') || 0;
      }

      
      logisticsAnomalyTableorder(data.field)
  });
  commonOrderAddOrg('logisticsAnomaly', form, 'aliexpress');

  //监听公司下拉选择
  form.on('select(logisticsAnomalycompanyType)', function(obj) {
      logisticsAnomaly_companyType = obj.value
      let name = obj.value ==='logisticsModes' ? 'logisticsCollectionName' : 'cnName'
      appendSelect($('#logisticsAnomalyForm').find('select[name="logisticsCompanyId"]'), logisticsAnomaly_company[logisticsAnomaly_companyType], 'id', name)
          form.render()
      })

  //监听物流公司下拉选择
  form.on('select(logisticsAnomalycompany)', function (obj) {
    var agent = "",
        logisticsModeId='',
        logisticsCompanyId = "";
    if(logisticsAnomaly_companyType === 'agents'){
        agent = obj.value
    }else if(logisticsAnomaly_companyType === 'companys'){
        logisticsCompanyId = obj.value
    }else if(logisticsAnomaly_companyType === 'logisticsModes'){
        logisticsModeId = obj.value
    }
    getAllLogicsType(agent, logisticsCompanyId, logisticsModeId)
    form.render()
})

  //监听工具栏操作
  table.on("tool(logisticsAnomaly_table)", function(obj) {
      var event = event ? event : window.event;
      event.stopPropagation();
      var data = obj.data
      if (obj.event === "") {
      }
  });

  getPageEnum();
  getAllCompanies();
  getStoreByPlatform('', function(returnData) {
      logisticsAnomaly_allstore = returnData.data
  });
  getAllLogicsType('', '', '', function(returnData) {
      logisticsAnomaly_logisType = returnData.data
  });
  getHandler();
  getAlldevEmployee();
  getAllpurchaseEmployee();

  // 页面数据请求----------------------------------------
  //  获取页面枚举数
  function getPageEnum() {
    let logisticsAnomalyTabList = [
      { value: '未处理', name: 0 },
      { value: '已处理', name: 1 },
      { value: '全部', name: ''}
    ]
    initAjax('/unauditorder/listenum.html', 'post', {}, function (returnData) {
      logisticsAnomaly_pageEnum = returnData.data
      logisticsAnomaly_pageEnum.shippingCountryCodes = logisticsAnomaly_pageEnum.shippingCountrys

      for (var i in returnData.data) {
          if (i === 'shippingCountryCodes') {
              const shippingCountryCodeList = logisticsAnomaly_pageEnum.shippingCountryCodes.map(item => ({
                  ...item,
                  name: item.value + "(" + item.name + ")",
                  shippingCountryCode: item.name,
                  shippingCountryName: item.enFullValue,
                  shippingCountryCnName: item.value,
              })
              )
              appendSelect($('#logisticsAnomalyForm').find('select[_name="shippingCountryCodes"]'), shippingCountryCodeList, 'shippingCountryCode', 'name')
          }
      }
      form.render()
      formSelects.render('shippingCountrys')
    })
    appendLogisticsAnomalyTab(logisticsAnomalyTabList)
  } 

  // 获取处理人数据
  function getHandler(){
    initAjax('/tranOrder/listAllButNotAdmin.html', 'get', {}, function(returnData) {
        var data = returnData.data
        appendSelect($('#logisticsAnomaly_processUserId'), data, 'id', 'userName')
        formSelects.render('logisticsAnomaly_processUserId')
    })
  }

  //获取所有物流公司以及货代公司
  function getAllCompanies() {
      initAjax('/unauditorder/listcompanyandagent.html', 'post', {}, function(returnData) {
          logisticsAnomaly_company = returnData.data
          appendSelect($('#logisticsAnomalyForm').find('select[name="logisticsCompanyId"]'), returnData.data.logisticsModes, 'id', 'logisticsCollectionName')
          form.render()
      })
  }

  function getAllLogicsType(agent, logisticsCompanyId, logisticsModeId, func) {
    initAjax('/unauditorder/listlogistype.html', 'get', { agent, logisticsCompanyId, logisticsModeId,specialType: "直发物流" }, function (returnData) {
        if (func) {
            func(returnData)
        }
        // 如果有具体的值,就不用添加空选项了
        if($('#logisticsAnomalyForm').find('select[name=logisticsCompanyId]').val()!==''){
        }else{
            returnData.data.unshift({ id: 0, name: "空" });
        }
        appendSelect($('#logisTypeIds_xm_select_logisticsAnomaly'), returnData.data, 'id', 'name')
        formSelects.render('logisTypeIds_xm_select_logisticsAnomaly')
    })
}

  //根据平台code获取店铺列表
  function getStoreByPlatform(platcode, func) {
      initAjax('/sys/orderliststorebyplatcode.html', 'get', { platCode: platcode }, function(returnData) {
          if (func) {
              func(returnData)
          }
          formSelects.render('logisticsAnomalyStoreAcctIds', {
              placeholder: '请选择店铺'
          })
      }, 'application/x-www-form-urlencoded')
  }

  // 获取平台订单状态
  function getListplatorderstatus_logisticsAnomaly(platcode) {
      return commonReturnPromise({
          type: 'get',
          url: `/lms/undispatch/listplatorderstatus.html?platCode=${platcode}`
      });
  }

  //获取所有开发专员
  function getAlldevEmployee() {
      initAjax('/sys/prodOwnerList.html', 'post', {}, function(returnData) {
          appendSelect($('#logisticsAnomalyForm').find('select[name="preprodDevId"]'), returnData.data, 'id', 'loginName')
          form.render()
      })
  }


  //获取所有采购专员
  function getAllpurchaseEmployee() {
      initAjax('/sys/buyerList.html', 'post', {}, function(returnData) {
          appendSelect($('#logisticsAnomalyForm').find('select[name="purchasingAgentId"]'), returnData.data, 'id', 'loginName')
          form.render()
      })
  }

  // 获取所有页签数量
  function getAllTabNum(data){
      initAjax('/platorder/tagCountNumber.html', 'post', data, function(returnData) {
        let allCount = 0
         for(var i in returnData.data){
            $('#LAY-logisticsAnomaly #logisticsAnomaly_Tab').find('li[data-index="'+i+'"]').find('span').text(returnData.data[i])
            allCount += returnData.data[i]
        }
        $('#LAY-logisticsAnomaly #logisticsAnomaly_Tab').find('li[data-index=""]').find('span').text(allCount)
      }, 'application/x-www-form-urlencoded')
  }

  //渲染表格数据
  function logisticsAnomalyTableorder(data) {
      processStatusVal = data.processStatus
      if (processStatusVal === '0') {
        $("#logisticsAnomaly_handle").show();
        $('#logisticsAnomaly_export').show();
      } else {
        $("#logisticsAnomaly_handle").hide();
        $('#logisticsAnomaly_export').show();
      }
      commonReturnPromiseRes({
          url: ctx + '/platorder/logisticsAbnormalOrder.html',
          type: 'POST',
          params:data
      }).then(function(result){
          logisticsAnomalyPage(data,result.count)
          logisticsAnomaly_immutableStore = result.data
          logisticsAnomaly_gridOptions.api.setRowData(logisticsAnomaly_immutableStore)
          // 渲染tab中的count数，复制原来的--start
          var tab = $('#logisticsAnomaly_Tab').find('.layui-this')
          if(!isObjectValueEqual(data,logisticsAnomaly_formdata)){
              getAllTabNum(data)
              logisticsAnomaly_formdata = data
          }
          if (tab.length > 0) {
              tab.find('span').text(result.count)
          } else {
              $('#logisticsAnomaly_Tab').find('li[data-index="' + data.processStatus + '"]').addClass('layui-this').find('span').text(result.count)
          }
          // var tbody = $('#logisticsAnomaly_table').next('.layui-table-view').find('.layui-table-body').find('tr[data-index=0]')
 
      }).catch(function(err){
          layer.msg(err, {icon:2});
      })
  }

  let logisticsAnomaly_immutableStore = [];
  const logisticsAnomaly_gridOptions = {
      columnDefs: [{
          width: 60,
          headerCheckboxSelection: true,
          headerCheckboxSelectionFilteredOnly: true,
          checkboxSelection: true,
        },
        {
            headerName: '订单号',
            width: 150,
            wrapText: true,
            autoHeight: true,
            cellRenderer: (data) => {
                let d = data.data
                return `<div class="alignLeft">
                  <span>${d.orderId || ""}</span>
                  <span onclick="layui.admin.onlyCopyTxt('${d.orderId}',event)" style="display: ${d.orderId ? 'inline-block':'none'}" class="copy-icon">
                    <svg t="1710754196184" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2392" width="16" height="16"><path d="M768 832q-0.992 54.016-37.504 90.496T640 960H192q-54.016-0.992-90.496-37.504T64 832V384q0.992-54.016 37.504-90.496T192 256v64q-27.008 0.992-44.992 19.008T128 384v448q0.992 27.008 19.008 44.992T192 896h448q27.008-0.992 44.992-19.008T704 832h64zM384 128q-27.008 0.992-44.992 19.008T320 192v448q0.992 27.008 19.008 44.992T384 704h448q27.008-0.992 44.992-19.008T896 640V192q-0.992-27.008-19.008-44.992T832 128H384z m0-64h448q54.016 0.992 90.496 37.504T960 192v448q-0.992 54.016-37.504 90.496T832 768H384q-54.016-0.992-90.496-37.504T256 640V192q0.992-54.016 37.504-90.496T384 64z" p-id="2393" fill="#aaaaaa"></path></svg>
                  </span>
                    <div>
                    <span>${d.tradeOrderId || ""}</span>
                    <span onclick="layui.admin.onlyCopyTxt('${d.tradeOrderId}',event)" style="display: ${d.tradeOrderId ? 'inline-block':'none'}" class="copy-icon">
                        <svg t="1710754196184" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2392" width="16" height="16"><path d="M768 832q-0.992 54.016-37.504 90.496T640 960H192q-54.016-0.992-90.496-37.504T64 832V384q0.992-54.016 37.504-90.496T192 256v64q-27.008 0.992-44.992 19.008T128 384v448q0.992 27.008 19.008 44.992T192 896h448q27.008-0.992 44.992-19.008T704 832h64zM384 128q-27.008 0.992-44.992 19.008T320 192v448q0.992 27.008 19.008 44.992T384 704h448q27.008-0.992 44.992-19.008T896 640V192q-0.992-27.008-19.008-44.992T832 128H384z m0-64h448q54.016 0.992 90.496 37.504T960 192v448q-0.992 54.016-37.504 90.496T832 768H384q-54.016-0.992-90.496-37.504T256 640V192q0.992-54.016 37.504-90.496T384 64z" p-id="2393" fill="#aaaaaa"></path></svg>
                    </span>
                    </div>
                    <div><span class="gray"></span><span>${d.storeAcct || ""}</span></div>
                </div>`
            }
          },
          {
            headerName: '平台时间', 
            sortable: true,
            width: 165,
            field: 'createTime',
            wrapText: true,
            autoHeight: true,
            cellRenderer: (data) => {
                let d = data.data
                return `<div class="alignLeft">
                    <div>
                      <span class="gray">创建:</span>
                      <span>${Format(d.createTime ||"",'yyyy-MM-dd hh:mm:ss')}</span>
                    </div>
                    <div>
                      <span class="gray">订单:</span>
                      <span>${Format(d.platOrderMain.orderTimeCn ||"",'yyyy-MM-dd hh:mm:ss')}</span>
                    </div>
                    <div>
                      <span class="gray">发货:</span>
                      <span>${Format(d.platOrderMain.shippingTime ||"",'yyyy-MM-dd hh:mm:ss')}</span>
                    </div>
                    </div>
                </div>`
            }
          },
          {
              headerName: '金额',
              width: 110,
              wrapText: true,
              sortable: true,
              field: 'platOrderMain.platOrderAmt',
              autoHeight: true,
              cellRenderer: (data) => {
                  let d = data.data
                  let platOrderAmt = d.platOrderMain.platOrderAmt
                  let profit = d.platOrderMain.profit
                  return `<div class="alignLeft">
                  <div>
                    <span class="gray">金额:</span>
                    <span>${(platOrderAmt || platOrderAmt === 0) ? platOrderAmt : ''}</span>
                  </div>
                  <div>
                    <span class="gray">利润:</span>
                    <span>${(profit || profit === 0) ? profit : ''}</span>
                  </div>
                      </div>
                  </div>`
              }
          },
          {
            headerName: '重量(g)',
            width:90,
            wrapText: true,
            autoHeight: true,
            cellRenderer: (data) => {
                let d = data.data
                return `<div class="alignLeft">
                  <div><span class="gray">称重：</span><span>${d.platOrderMain.realWeight || ""}</span></div>
                  <div><span class="gray">计费：</span><span>${d.platOrderMain.priceWeight || ""}</span></div>
                </div>`
            }
          },
          {
              headerName: 'SKU',
              width: 140,
              wrapText: true,
              autoHeight: true,
              cellRenderer: (data) => {
                  let d = data.data
                  return `<div class="alignLeft">
                      <div style="overflow: hidden;text-overflow: ellipsis;-webkit-line-clamp: 4;display: -webkit-box;
                      -webkit-box-orient: vertical;" title='${d.platOrderMain.skuOverview||""}'>${d.platOrderMain.skuOverview||""}</div>
                  </div>`
              }
          },
          {
              headerName: '物流',
              wrapText: true,
              width: 300,
              autoHeight: true,
              cellRenderer: (data) => {
                  let d = data.data
                  return `<div class="alignLeft">
                      <div><span class="gray">国家/地区：</span><span>${d.platOrderMain.shippingCountryCnName || ""}</span></div>
                      <div style="text-wrap: nowrap;overflow: hidden;text-overflow: ellipsis;" title='${d.platOrderMain.logisTypeName || ""}'><span class="gray">物流方式：</span><span>${d.platOrderMain.logisTypeName || ""}</span></div>
                      <div style="text-wrap: nowrap;overflow: hidden;text-overflow: ellipsis;" title='${d.intlTrackingNo || ""}'>
                      <span class="gray">跟踪号：</span>
                      <span>${d.intlTrackingNo || ""}</span>
                      <span onclick="layui.admin.onlyCopyTxt('${d.intlTrackingNo}',event)" style="display: ${d.intlTrackingNo ? 'inline-block':'none'}" class="copy-icon">
                        <svg t="1710754196184" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2392" width="16" height="16"><path d="M768 832q-0.992 54.016-37.504 90.496T640 960H192q-54.016-0.992-90.496-37.504T64 832V384q0.992-54.016 37.504-90.496T192 256v64q-27.008 0.992-44.992 19.008T128 384v448q0.992 27.008 19.008 44.992T192 896h448q27.008-0.992 44.992-19.008T704 832h64zM384 128q-27.008 0.992-44.992 19.008T320 192v448q0.992 27.008 19.008 44.992T384 704h448q27.008-0.992 44.992-19.008T896 640V192q-0.992-27.008-19.008-44.992T832 128H384z m0-64h448q54.016 0.992 90.496 37.504T960 192v448q-0.992 54.016-37.504 90.496T832 768H384q-54.016-0.992-90.496-37.504T256 640V192q0.992-54.016 37.504-90.496T384 64z" p-id="2393" fill="#aaaaaa"></path></svg>
                      </span>
                      </div>
                      <div><span class="gray">订单状态：</span><span>${d.orderStatusName || ""}</span></div>
                  </div>`
              }
          },
          {
              headerName: '组包号',
              width:120,
              wrapText: true,
              autoHeight: true,
              cellRenderer: (data) => {
                  let d = data.data
                  return `<div class="alignLeft">
                    <div style="overflow: hidden;text-overflow: ellipsis;-webkit-line-clamp: 4;display: -webkit-box;
                    -webkit-box-orient: vertical;" title='${d.handoverBatchNo||""}'>${d.handoverBatchNo || ''}</div>
                </div>`
              }
          },
          {
            headerName: '异常原因',
            width:160,
            wrapText: true,
            autoHeight: true,
            cellRenderer: (data) => {
                let d = data.data
                return `<div class="alignLeft">
                    <div style="overflow: hidden;text-overflow: ellipsis;-webkit-line-clamp: 4;display: -webkit-box;
                    -webkit-box-orient: vertical;" title='${d.abnormalReason||""}'>${d.abnormalReason || ''}</div>
                </div>`
            }
          },
          {
            headerName: '备注',
            width:160,
            wrapText: true,
            autoHeight: true,
            cellRenderer: (data) => {
                let d = data.data
                return `<div class="alignLeft">
                    <div style="overflow: hidden;text-overflow: ellipsis;-webkit-line-clamp: 4;display: -webkit-box;
                    -webkit-box-orient: vertical;" title='${d.remark||""}'>${d.remark || ''}</div>
                </div>`
            }
          },
          
          {
              headerName: '人员',
              width: 100,
              wrapText: true,
              autoHeight: true,
              cellRenderer: (data) => {
                  let d = data.data
                  return `<div class="alignLeft">
                      <div><span class="gray">主管：</span>${d.sellLeaderName || ""}</div>
                      <div><span class="gray">销售：</span>${d.salesPersons || ""}</div>
                      <div><span class="gray">客服：</span>${d.customServicer || ""}</div>
                  </div>`
              }
          },
          {
            headerName: '处理人',
            width: 160,
            wrapText: true,
            autoHeight: true,
            cellRenderer: (data) => {
                let d = data.data
                return `<div class="alignLeft">
                    <div>${d.loginName || ""}</div>
                    <div>${Format(d.processTime ||"",'yyyy-MM-dd hh:mm:ss')}</div>
                </div>`
            }
        },
          {
            field: '操作',
            width: 100,
            wrapText: true,
            autoHeight: true,
            cellRenderer: (data) => {
              let d = data.data
              let dom = `<button type="button" id="logisticsAnomalyHandleBtn" name="handle" class="layui-btn layui-btn-xs">处理</button><br>`
              let remarkDom = `<button type="button" name="remark" class="layui-btn layui-btn-xs">编辑备注</button>`
              if (processStatusVal === '0') {
                return dom + remarkDom
              }
              return remarkDom
            }
          }
      ],
      rowHeight: 110, // 设置表格行高
      rowData:logisticsAnomaly_immutableStore,
      getRowNodeId: function (data) {
          return data.id;
      },
      // rowModelType: 'serverSide', // 服务端
      defaultColDef: {
          resizable: true, //是否可以调整列大小，就是拖动改变列大小
      },
      suppressPaginationPanel: true, // 自定义分页
      rowSelection: 'multiple', // 设置多行选中
      suppressRowClickSelection: true,
      onGridReady: function (params) {
          logisticsAnomaly_gridOptions.columnApi.applyColumnState({ state: JSON.parse(window.localStorage.getItem("orderColumnState")) });
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
  };

  var timeStamp;

  $(document).off("click",".waitOrderErrorTipsClose").on("click",".waitOrderErrorTipsClose",function(){
      $(this).parents('.waitOrderErrorTips').remove()
  })

  var gridDiv = document.querySelector('#logisticsAnomaly_table');
  agGrid.LicenseManager.setLicenseKey(
      "IRDEVELOPERS_COM_NDEwMjM0NTgwMDAwMA==f08aae16269f416fe8d65bbf9396be5f");
  new agGrid.Grid(gridDiv, logisticsAnomaly_gridOptions);

  // 触发ag-grid表格事件
  function handleTableOptions(event){
      let optionEvent = event.event.target.name,
          data = event.data;// 获取选中行数据
      if (optionEvent == 'handle') {
          handleTableHandle(data.id);
      }else if (optionEvent == 'remark') {
        handleTableRemark(data, data.remark);
      } else if (event.event.timeStamp - timeStamp < 300) {
        // 获取全部订单接口数据 
        if (!data.orderId) {
          return layer.msg('缺少订单号，查询不到订单详情数据',{icon:7});
        }
        commonReturnPromise({
          url: '/lms/platorder/listorder.html',
          type: 'post',
          params: {
            orderIds: data.orderId
          }
        }).then(res => {
          if(!res) {
            return layer.msg('查询不到订单',{icon:7});
          } else {
            commonOrderDetailFn(res[0], logisticsAnomaly_gridOptions);
          }
        })
      }
  }

  // 修改备注
  function handleTableRemark(data, remark) {
    let id = data.id;
    layer.open({
      type: 1,
      title: '编辑备注',
      area: ['500px', '300px'],
      btn: ['提交', '取消'],
      content: $('#logisticsAnomaly_editRemark').html(),
      id: 'logisticsAnomaly_editRemarkId',
      success: function (layero, index) {
        layero.find('textarea[name=remark]').val(remark);
      },
      yes: function (index, layero) {
        let noteContent = layero.find('textarea[name=remark]').val();
        if (!noteContent) {
            return layer.msg('备注不能为空', { icon: 7 });
        }
        commonReturnPromiseRes({
          url: ctx + '/platorder/updateAbnormalOrderRemark.html',
          type: 'POST',
          params: {
            abnormalId: id,
            remark: noteContent
          }
        }).then(function(){
          layer.msg('修改备注成功', { icon: 1 });
          layer.close(index);
          // $('#logisticsAnomalySearch').click()
          //不刷新页面logisticsAnomaly_gridOptions
          data.remark = noteContent;
          logisticsAnomaly_gridOptions.api.updateRowData({ update: [data] });

        }).catch(function(err){
          layer.msg(err || err.message, { icon: 2 });
        })
    }
    })
  }

  // 处理
  function handleTableHandle(ids) {
    commonReturnPromiseRes({
      url: ctx + '/platorder/changeAbnormalOrderStatus.html',
      type: 'POST',
      params: {
        abnormalIds: ids
      }
    }).then(function(result){
      layer.msg(result.msg || "处理成功");
      $('#logisticsAnomalySearch').click()
    }).catch(function(err){
      layer.msg(err, {icon:2});
    })
  }

  $('#logisticsAnomaly_handle').on('click', function() {
    let ids = getTableSelectIds();
    if (!ids || ids.length < 1) {
        layer.msg('请选择要处理的数据',{icon:7});
        return;
    }
    let idsStr = ids.join(',') || '';
    handleTableHandle(idsStr)
  })

  //编辑备注-20240104ztt
  $('#logisticsAnomaly_editRemarkBtn').on('click', function() {
    let ids = getTableSelectIds();
    if (!ids || ids.length < 1) {
        layer.msg('请选择要处理的数据',{icon:7});
        return;
    }
    let idsStr = ids.join(',') || '';
    layer.open({
      type: 1,
      title: '编辑备注',
      area: ['500px', '300px'],
      btn: ['提交', '取消'],
      content: $('#logisticsAnomaly_editRemark').html(),
      id: 'logisticsAnomaly_editRemarkId',
      success: function (layero, index) {

      },
      yes: function (index, layero) {
        let noteContent = layero.find('textarea[name=remark]').val();
        if (!noteContent) {
            return layer.msg('备注不能为空', { icon: 7 });
        }
        commonReturnPromiseRes({
          url: ctx + '/platorder/batchUpdateAbnormalOrderRemark.html',
          type: 'POST',
          params: {
            abnormalIds: idsStr,
            remark: noteContent
          }
        }).then(function(){
          layer.msg('修改备注成功', { icon: 1 });
          layer.close(index);
          // $('#logisticsAnomalySearch').click();
          let selectedData = logisticsAnomaly_gridOptions.api.getSelectedRows();
          selectedData.map(item => {
            item.remark = noteContent;
          })
          logisticsAnomaly_gridOptions.api.updateRowData({ update: selectedData });
        }).catch(function(err){
          layer.msg(err || err.message, { icon: 2 });
        })
    }
    })
  })

  $('#logisticsAnomaly_export').on('click', function() {
    let ids = getTableSelectIds();
      if (!ids || ids.length < 1) {
          layer.msg('请选择订单',{icon:7});
          return;
      }
      let param = {};
      param.abnormalIds = ids.join(",");
      submitForm(param, ctx + '/platorder/exportAbnormalInfo',"_blank");
      layer.closeAll();
  })

  // 渲染页面分页
    function logisticsAnomalyPage(data,count){
        laypage.render({
            elem: 'logisticsAnomalyPage',
            curr: data.page,
            limit: data.limit,
            limits:[5000, 10000, 20000],
            layout: ['prev', 'page', 'next', 'count','limit'],
            count: count,
            jump: function(obj, first) {
                $('#logisticsAnomalyForm input[name="limit"]').val(obj.limit);//保障下次的分页请求中带有的值正确
                $('#logisticsAnomalyForm input[name="page"]').val(obj.curr);//保障下次的分页请求中带有的值正确
                //首次不执行
                if (!first) {
                    data.page = obj.curr;
                    data.limit = obj.limit;
                    $('#logisticsAnomalySearch').click()
                }

            }
        });
    }

  function getTableSelectIds(){
      // var checkStatus = table.checkStatus('logisticsAnomaly_table')
      // var data = checkStatus.data
      let data = logisticsAnomaly_gridOptions.api.getSelectedRows();
      var ids = (data || []).map(function(item) {
          return item.id
      });
      return ids;
  }


  // 页面数据请求----------------------------------------
  function isObjectValueEqual (a, b) {
      //取对象a和b的属性名
      var aProps = Object.getOwnPropertyNames(a);
      var bProps = Object.getOwnPropertyNames(b);
      //判断属性名的length是否一致
      if (aProps.length != bProps.length) {
          return false;
      }
      //循环取出属性名，再判断属性值是否一致
      for (var i = 0; i < aProps.length; i++) {
        var propName = aProps[i];
        if ((propName!="processStatus")&&a[propName] !== b[propName]) {
            return false;
        }
      }
      return true;
    }

  //动态添加页签
  function appendLogisticsAnomalyTab(data) {
      var html = ""
      for (var i in data) {
          if (data[i].name === '1') {
              html += '<li class="layui-this" data-index="' + data[i].name + '">' + data[i].value + '(<span>0</span>)</li>'
          } else {
              html += '<li data-index="' + data[i].name + '">' + data[i].value + '(<span>0</span>)</li>'
          }
      }
      $('#logisticsAnomaly_Tab ul').append(html)
  }

  function appendSelect(aDom, data, code, label, attachment) {
      aDom.empty();
      var option = '<option value="">请选择</option>'
      for (var i in data) {
          if (typeof data[i] !== 'string') {
              attachment ?
                  data[i].code = data[i][code] + '_' + data[i][attachment] :
                  data[i].code = (data[i][code] && data[i][code].toString()) || data[i].code
              data[i].label = data[i][label] || data[i].label;
          }
          option += '<option value="' + (typeof data[i].code!='undefined'?data[i].code:data[i]) + '">' + (data[i].label || data[i]) + '</option>'
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

  function Selected(aDom, value) {
      var options = aDom.find('option');
      options.each(function(index,item){
          if(item.value==value){
              $(item).attr('selected', true)
          }
      })
      form.render()
  }

  //店铺选中
  function storeSelected(aDom, value) {
          var options = aDom.find('option');
          options.each(function(index,item){
              var storeAcctId = item.value.split('_')[0]
              if(storeAcctId==value){
                  $(item).attr('selected', true)
              }
          })
          form.render()
      }

})

function getIndex(id, arr, value) { //获取某个取值属性在对象数组中的下标
  for (var i = 0; i < arr.length; i++) {
      if (value == arr[i][id]) {
          return i;
      }
  }
  return -1;
}

function logisticsAnomalyTipsShow(dom){
const contentshow = $(dom).attr('data-text');
if(contentshow){
    layui.layer.tips(`<span style="color:#008B8B">${contentshow}</span>`, $(dom), {
        tips: [1, '#fff'],
        time: 0,
    });
}
}

function logisticsAnomalyTipsShowTable(dom){
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
function logisticsAnomalyTipsHide(){
layui.layer.closeAll("tips");
}