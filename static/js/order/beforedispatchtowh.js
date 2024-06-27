/*
 * @Author: ztao
 * @Date: 2023-08-07 15:19:21
 * @LastEditTime: 2024-04-25 12:11:59
 * @Description: 派至仓库前(处理)
 */
layui.use(['form', 'table', 'layer', 'element', 'laypage', 'upload', 'laydate', 'formSelects', 'laytpl'], function () {
  var form = layui.form,
    table = layui.table,
    element = layui.element,
    laydate = layui.laydate,
    formSelects = layui.formSelects,
    laytpl = layui.laytpl,
    laypage = layui.laypage;
  layer = layui.layer;
  form.render('select');
  //ztt20230907-标签状态监听
  form.on('select(beforedispatchtowh_platTagsSign)', function(obj){
    //标签不含仅允许单选
    if(obj.value == 0){
      formSelects.render('beforedispatchtowh_platTags', {
        max: 1,
        maxTips: function(id, vals, val, max){
          //id:   点击select的id
          //vals: 当前select已选中的值
          //val:  当前select点击的值
          //max:  当天多选最大值
          layer.msg("标签(不含)状态下最多允许选择: " + max, {icon: 7});
        },
      });
    }else{
      formSelects.render('beforedispatchtowh_platTags', {
        max: 1000
      });
    }
  });
  //#region 渲染搜索条件
  let beforedispatchtowhSecondTabListObj = {};
  //表单id
  let $form = $('#beforedispatchtowhForm');
  //默认渲染平台状态
  formSelects.render('beforedispatchtowhStatusList', { placeholder: '请先选择平台' });
  // 固定表头
  // UnifiedFixedFn('beforedispatchtowhCard');
  let bdtowhSearchName = {
    renderTime () {
      //渲染日期
      laydate.render({
        elem: '#beforedispatchtowh_time',
        type: 'datetime',
        inputAuto: true,
        range: true,
        showShortcuts: true,
      });
    },
    initData () { //返回页面所需要的初始化数据,4个页面公用[待审核、待派单、缺货单、异常单]
      return commonReturnPromise({
        url: '/lms/unauditorder/listenum.html',
        type: 'post'
      });
    },
    initSearchItems () { //初始化搜索选项
      let _this = this;
      this.initData().then(res => {
        //取出二级标签的值
        beforedispatchtowhSecondTabListObj = {
          audit: res.unAuditOrderStatus,
          lack: res.logisApplySearchStatusMaps,
          dispatch: res.logisApplySearchStatusMaps,
          abnormal: res.abnormalOrderStatus
        }
        //初始化平台
        let platCodes = res.platCodes;
        commonRenderSelect('beforedispatchtowhplatCodes', platCodes).then(() => form.render('select'));
        //根据平台渲染[部门/销售/店铺/平台状态]
        commonInitRenderRoleType('beforedispatchtowh');
        form.on('select(beforedispatchtowhplatCodes)', function (obj) {
          let platCode = obj.value;
          //组件: 部门/客服[销售]/店铺联动
          commonOrderAddOrg('beforedispatchtowh', form, platCode);
          //渲染平台状态
          _this.platStatusAjax(platCode).then(statuRes => {
            commonRenderSelect('beforedispatchtowhStatusList', statuRes, { name: 'platOrderStatus', code: 'platOrderStatus' }).then(function () {
              formSelects.render('beforedispatchtowhStatusList', { placeholder: '请先选择平台' });
            });
          });
        });

        //初始化订单标签
        let orderTagList = res.orderTagList;
        commonRenderSelect('beforedispatchtowh_orderTagLists', orderTagList).then(() => {
          formSelects.render('beforedispatchtowh_orderTagLists');
        });
        //初始化平台标签
        let platTagList = res.platTagList;
        commonRenderSelect('beforedispatchtowh_platTags', platTagList).then(() => {
          formSelects.render('beforedispatchtowh_platTags');
        });
        //初始化物流属性
        let logisAttrs = res.logisAttrs;
        commonRenderSelect('beforedispatchtowhLogisAttrs', logisAttrs).then(() => {
          formSelects.render('beforedispatchtowhLogisAttrs');
        });
        //初始化国家地区
        let shippingCountrys = res.shippingCountrys;
        shippingCountrys.map(item=> item.fullName = `${item.value}(${item.name})`);
        setTimeout(()=>{
          commonRenderSelect('beforedispatchtowhShippingCountrys', shippingCountrys, { name: 'fullName', code: 'name' }).then(() => {
            formSelects.render('beforedispatchtowhShippingCountrys');
          });
        },100);
        //初始化标记发货
        let markShippingStatus = res.markShippingStatus;
        commonRenderSelect('beforedispatchtowhMarkShippingStatus', markShippingStatus, { name: 'value', code: 'name' }).then(() => form.render('select'));
        //渲染备注
        let orderLabels = res.orderLabels;
        commonRenderSelect('beforedispatchtowh_orderLabels', orderLabels, { code: 'code', name: 'name' }).then(() => {
          formSelects.render('beforedispatchtowh_orderLabels', {placeholder: '备注类型'});
        });
      });
      //初始化物流公司和方式
      this.companyAndAgentAjax().then(res => {
        //渲染物流方式集
        commonRenderSelect('beforedispatchtowhcompany', res.logisticsModes, { name: 'logisticsCollectionName', code: 'id' }).then(() => {
          form.render('select');
        });
        //监听公司类型切换
        form.on('select(beforedispatchtowhcompanyType)', function (obj) {
          if (obj.value == 'agents') {
            commonRenderSelect('beforedispatchtowhcompany', res.agents).then(() => {
              form.render('select');
            });
          } else if(obj.value == 'companys'){
            commonRenderSelect('beforedispatchtowhcompany', res.companys, { name: 'cnName', code: 'id' }).then(() => {
              form.render('select');
            });
          }else{
            commonRenderSelect('beforedispatchtowhcompany', res.logisticsModes, { name: 'logisticsCollectionName', code: 'id' }).then(() => {
              form.render('select');
            });
          }
        });
        //默认渲染物流方式
        _this.logisticTypeAjax({
          agent: '',
          logisticsCompanyId: '',
          logisticsModeId: ''
        }).then(logisTypeRes => {
          commonRenderSelect('beforedispatchtowhlogisTypeIds', logisTypeRes, { name: 'name', code: 'id' }).then(() => {
            formSelects.render('beforedispatchtowhlogisTypeIds');
            //渲染原先的id
            let ids = logisTypeRes.map(item=>item.id).join(',');
            $('#beforedispatchtowhlogisTypeIds').attr('acct_ids', ids);
          });
        });
        //监听公司选择
        form.on('select(beforedispatchtowhcompany)', function (obj) {
          let agent = $form.find('[name=agentCompany]').val() == 'agents' ? obj.value : '';
          let logisticsCompanyId = $form.find('[name=agentCompany]').val() == 'companys' ? obj.value : '';
          let logisticsModeId= $form.find('[name=agentCompany]').val() == 'logisticsModes' ? obj.value : '';
          let params = {
            agent: agent,
            logisticsCompanyId: logisticsCompanyId,
            logisticsModeId: logisticsModeId
          };
          _this.logisticTypeAjax(params).then(logisTypeRes => {
            commonRenderSelect('beforedispatchtowhlogisTypeIds', logisTypeRes, { name: 'name', code: 'id' }).then(() => {
              formSelects.render('beforedispatchtowhlogisTypeIds');
              let ids = logisTypeRes.map(item=>item.id).join(',');
              $('#beforedispatchtowhlogisTypeIds').attr('acct_ids', ids);
            });
          });
        });
      });
      //更多查询条件展开收缩
      function beforedispatchtowh_moreSearchItemsHasValue(){
        let inputs = $("#beforedispatchtowhForm .externalPopAuditorder").find("input");
        let count = 0;
        let showDom = $("#showMoreSearchCondition_beforedispatchtowh .hasValue");
        let extraArr = ['订单标签(包含)', '订单标签(不含)', '请选择'];
        for (let i = 0; i < inputs.length; i++) {
          let item = inputs[i];
          let val = $(item).val();
          if (val && !extraArr.includes(val)) {
            count++;
          }
        }
        if (count > 0) {
          showDom.html('<font color="red">(有值)</font>');
        } else {
          showDom.html("");
        }
      }
      $('#showMoreSearchCondition_beforedispatchtowh').click(function () {
        let self = this
        if ($(self).hasClass('showExternal')) {
          $(self).closest('.layui-form').find('.externalContainbeforedispatchtowh').hide()
          $('#hide_icon_beforedispatchtowh').show()
          $('#show_icon_beforedispatchtowh').hide()
          $(self).removeClass('showExternal')
          beforedispatchtowh_moreSearchItemsHasValue();
        } else {
          $(self).closest('.layui-form').find('.externalContainbeforedispatchtowh').show()
          $('#hide_icon_beforedispatchtowh').hide()
          $('#show_icon_beforedispatchtowh').show()
          $(self).addClass('showExternal')
        }
      });
      //初始化开发专员
      _this.ownerListAjax().then(res => {
        commonRenderSelect('beforedispatchtowhpreprodDevId', res, { name: 'loginName', code: 'id' }).then(() => {
          form.render('select');
        });
      });
      //初始化采购专员
      _this.buyerListAjax().then(res => {
        commonRenderSelect('beforedispatchtowhpurchasingAgentId', res, { name: 'loginName', code: 'id' }).then(() => {
          form.render('select');
        });
      });
    },
    platStatusAjax (platCode) { //获取平台状态
      return commonReturnPromise({
        url: `/lms/undispatch/listplatorderstatus.html?platCode=${platCode}`
      });
    },
    companyAndAgentAjax () { //获取物流公司和货代公司
      return commonReturnPromise({
        url: '/lms/unauditorder/listcompanyandagent.html'
      });
    },
    logisticTypeAjax (obj) { //根据公司获取物流方式
      return commonReturnPromise({
        url: '/lms/unauditorder/listlogistype.html',
        params: {...obj,specialType: "直发物流"}
      })
    },
    ownerListAjax () { //获取所有开发专员
      return commonReturnPromise({
        url: '/lms/sys/prodOwnerList.html',
        type: 'post'
      });
    },
    buyerListAjax () {//获取所有采购专员
      return commonReturnPromise({
        url: '/lms/sys/buyerList.html',
        type: 'post'
      });
    }
  };
  bdtowhSearchName.renderTime(); //渲染时间
  bdtowhSearchName.initSearchItems(); //渲染搜索条件其他项
  //导出模板
  componentForOrderDownload('beforedispatchtowh_exportTemplate', function(){
    let data = [];
    let currentPage = $('#beforedispatchtowh_tabs').find('li.layui-this').attr('data-index');
    if(currentPage == 'audit'){
      data = gridOptions.api.getSelectedRows();
    }else if(currentPage == 'abnormal'){
      data = abnormalOrder_gridOptions.api.getSelectedRows();
    }else if(currentPage == 'dispatch' || currentPage == 'lack'){
      data = toDespatchOrder_gridOptions.api.getSelectedRows();
    }
    let idsArr = data.map(function (item) {
      return item.id;
    });
    return idsArr;
  });

  function bdtowhGetFormData () {
    let data = {};
    data.field = serializeObject($('#beforedispatchtowhForm'));
    return data;
  }
  //#endregion

  //监听tab,全局tab[待审核,异常单,待派单,缺货]
  element.on('tab(beforedispatchtowh_tabs)', function (data) {
    let currentPage = data.elem.context.dataset.index;
    $('#beforedispatchtowhForm').find('input[name=firstTab]').val(currentPage)
    let currentPageArr = ['audit', 'dispatch', 'lack', 'abnormal'];
    for (let i = 0; i < currentPageArr.length; i++) {
      let item = currentPageArr[i];
      if (item == currentPage) {
        $('#beforedispatchtowhCard').find(`.beforedispatchtowh-${item}`).removeClass('disN');
      } else {
        $('#beforedispatchtowhCard').find(`.beforedispatchtowh-${item}`).addClass('disN');
      }
      if(currentPage == 'lack'){
        $('#beforedispatchtowhCard').find(`.beforedispatchtowh-audit`).addClass('disN');
        $('#beforedispatchtowhCard').find(`.beforedispatchtowh-abnormal`).addClass('disN');
        $('#beforedispatchtowhCard').find(`.beforedispatchtowh-dispatch`).removeClass('disN');
      }
    }
    //#region 公用部分
     //表格渲染函数为空
     gridOptions.api.setRowData([]);
     abnormalOrder_gridOptions.api.setRowData([]);
     toDespatchOrder_gridOptions.api.setRowData([]);
     //分页渲染为空
     beforedispatchtowh_auditPage({page: 1, limit: 5000}, 0);
     beforedispatchtowh_dispatchPageFn({page: 1, limit: 5000}, 0,115);
     beforedispatchtowh_dispatchPageFn({page: 1, limit: 5000}, 0,502);
     abnormalOrderPageFn({page: 1, limit: 5000}, 0);
     //二级tab数量为0
     $('#beforedispatchtowh_auditStatusTabs').find('li>span').text(0);
     $('#beforedispatchtowh_dispatchStatusTabs').find('li>span').text(0);
     $('#beforedispatchtowh_abnormalStatusTabs').find('li>span').text(0);
    //#endregion

    if (currentPage == 'audit') {
      $('.beforedispatchtowh-showDispath').addClass('disN');
      $('.beforedispatchtowh-showLack').addClass('disN');
      $('#beforedispatchtowhForm input[name="processStatus"]').val(1);
      $('#LAY-beforedispatchtowh #beforedispatchtowh_auditStatusTabs').find('li').removeClass('layui-this');
      // $('#LAY-beforedispatchtowh #beforedispatchtowh_auditStatusTabs').find('li[data-index=1]').addClass('layui-this');
      // $('#beforedispatchtowhSearch').trigger('click');
    } else if (currentPage == 'abnormal') {
      $('.beforedispatchtowh-showDispath').addClass('disN');
      $('.beforedispatchtowh-showLack').addClass('disN');
      $('#beforedispatchtowhForm input[name="processStatus"]').val(501);
      $('#LAY-beforedispatchtowh #beforedispatchtowh_abnormalStatusTabs').find('li').removeClass('layui-this');
      //传递数据并触发渲染表格函数
      // let abnormalData = bdtowhGetFormData();
      // $('#LAY-beforedispatchtowh #beforedispatchtowh_abnormalStatusTabs').find('li[data-index=501]').addClass('layui-this');
      // abnormalOrderSubmitAndRenderTable(abnormalData);
      // $('#beforedispatchtowhSearch').trigger('click');
    }else if(currentPage == 'dispatch'){ //待派单115;
      $('.beforedispatchtowh-showDispath').removeClass('disN');
      $('.beforedispatchtowh-showLack').addClass('disN');
      $('#toDespatchOrder_cancelOrderTiktok').addClass('disN');
      $('#beforedispatchtowhForm input[name="processStatus"]').val(0);
      $('#LAY-beforedispatchtowh #beforedispatchtowh_dispatchStatusTabs').find('li').removeClass('layui-this');
      // $('#LAY-beforedispatchtowh #beforedispatchtowh_dispatchStatusTabs').find('li[data-index=0]').addClass('layui-this');
      //触发搜索事件
      // let todispatchData = bdtowhGetFormData();
      // toDespatchOrderSubmitAndRenderTable(todispatchData, 115);
      // $('#beforedispatchtowhSearch').trigger('click');
    }else if(currentPage == 'lack'){ //缺货502;
      $('#toDespatchOrder_cancelOrderTiktok').removeClass('disN');
      $('.beforedispatchtowh-showDispath').removeClass('disN');
      $('.beforedispatchtowh-showLack').removeClass('disN');

      $('#beforedispatchtowhForm input[name="processStatus"]').val(0);
      $('#LAY-beforedispatchtowh #beforedispatchtowh_dispatchStatusTabs').find('li').removeClass('layui-this');
      // $('#LAY-beforedispatchtowh #beforedispatchtowh_dispatchStatusTabs').find('li[data-index=0]').addClass('layui-this');
      //触发搜索事件
      // toDespatchOrderSubmitAndRenderTable(todispatchData, 502);
      // $('#beforedispatchtowhSearch').trigger('click');
    }

        // shopee 发送消息 仅在缺货
        if(currentPage==='lack'){
          $('#toDespatchOrder_shopeeEmail').removeClass('disN');
          $('#toDespatchOrder_tiktokEmail').removeClass('disN');
        }else{
          $('#toDespatchOrder_shopeeEmail').addClass('disN');
          $('#toDespatchOrder_tiktokEmail').addClass('disN');
        }
  });

  //回车搜索事件
  $('#beforedispatchtowhForm').on('keyup', 'input', function (e) {
    if (e.keyCode == 13) { // 回车键
        $(this).select();
        $('#beforedispatchtowhSearch').trigger('click');
    }
  });

  // 保存搜索
  // 模板查询赋值
  commonSaveSearchTpl({
    id: "beforedispatchtowh_save",
    formId: "beforedispatchtowhForm",
    pageName: "auditDespathOrder_beforedispatchtowh",
    searchBtnId: "beforedispatchtowhSearch",
    cb: (param) => afterDispatchtowh_formVal(param),
  });

  function afterDispatchtowh_formVal(param) {
    let $formDom = $("#beforedispatchtowhForm");
    let timeStamp = 0; // 调接口的需要加400
    $("#beforedispatchtowh_tabs .layui-tab-title li").each(function () {
      const index = $(this).data('index')
      if (index== param.firstTab) {
        $(this).addClass("layui-this");
        $(this).click()
        $(`#beforedispatchtowh_${index}StatusTabs .layui-tab-title li`).each(function () {
          const index = $(this).data('index')
          if (index== param.processStatus) {
            $(this).addClass("layui-this");
          }else{
              $(this).removeClass("layui-this");
            }
        })
      } else {
        $(this).removeClass("layui-this");
      }
    });
    //  销售 客服
    if (param.salerAndcustomSelect) {
      $formDom
        .find("select[name=salerAndcustomSelect]")
        .val(param.salerAndcustomSelect);
    }
    // 平台
    if (param.platCode) {
      $formDom
        .find("select[name=platCode]")
        .next()
        .find(`dd[lay-value="${param.platCode}"]`)
        .trigger("click");
      timeStamp += 400;
    }
    if (param.agentCompany) {
      $formDom
        .find("select[name=agentCompany]")
        .next()
        .find(`dd[lay-value="${param.agentCompany}"]`)
        .trigger("click");
    }
    // 店铺 赋值
    setTimeout(() => {
      if (param.logisticsCompanyId) {
        $formDom
          .find("select[name=logisticsCompanyId]")
          .next()
          .find(`dd[lay-value="${param.logisticsCompanyId}"]`)
          .trigger("click");
      }
      if (param.orgs) {
        $formDom
          .find("select[name=orgs]")
          .next()
          .find(`dd[lay-value="${param.orgs}"]`)
          .trigger("click");
      }
      commonReturnPromise({
        url: "/lms/sys/listStoreForRenderHpStoreCommonComponent.html",
        type: "post",
        params: {
          roleNames: `${param.platCode}专员`,
          orgId: param.orgs,
          salePersonId: param.salePersonId,
          platCode: param.platCode,
          type:
            param.salerAndcustomSelect == 1
              ? "salesperson"
              : "customservicer",
        },
      }).then((res) => {
        const storeList = param.storeAcctIds
          ? param.storeAcctIds.split(",").map(Number)
          : [];
        const arr = res.map((v) => ({
          name: v.storeAcct,
          code: v.id,
          selected: storeList.includes(v.id),
        }));
        formSelects.data("beforedispatchtowhStoreAcctIds", "local", { arr });
        // 给表单赋值
        form.val("beforedispatchtowhForm", param);
        // 更多查询条件是否有值
        let inputs = $("#beforedispatchtowhForm .externalPopAuditorder").find("input");
        let count = 0;
        let showDom = $("#showMoreSearchCondition_beforedispatchtowh .hasValue");
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
        // // 多选的 name: xm-select
        let multiSelectObj = {
          salePersonId: "beforedispatchtowh_salePersonsSelect",
          prodLogisAttrs: "beforedispatchtowhLogisAttrs",
          platOrderStatusList: "beforedispatchtowhStatusList",
          shippingCountryCodes: "beforedispatchtowhShippingCountrys",
          platTags: "beforedispatchtowh_platTags",
          logisTypeIds: "beforedispatchtowhlogisTypeIds",
          orderLabels: "beforedispatchtowh_orderLabels",
        };
        Object.keys(multiSelectObj).forEach((item) => {
          if (param[item]) {
            formSelects.value(
              multiSelectObj[item],
              param[item].split(","),
              true
            );
          } else {
            formSelects.render(multiSelectObj[item]);
          }
        });
        // 执行搜索
        $(`#beforedispatchtowh_${param.firstTab}StatusTabs .layui-tab-title li.layui-this`).click()
      });
    }, timeStamp);
  }

  //#region  待审核页面
  let detailpopflag = false;
  let toAuditOrder_pageEnum = null,
    toAuditOrder_company = null,
    toAuditOrder_allstore = null,
    toAuditOrder_logisType = null,
    toAuditOrder_Site = null,
    toAuditOrder_Currency = null,
    toAudit_formdata = {},
    toAuditOrder_companyType = "logisticsModes";

  // 前端删除行，删除后不刷新表格
  function deleteTableRow_toAuditOrder (ids, errIdsArr) {
    zttCommonRemoveDataHandle({
      selectedIds: ids,
      gridOptions: gridOptions,
      tableData: immutableStore,
      errIds: errIdsArr
    }).then(newObj => {
      let { newData, successIds } = newObj;
      // immutableStore = newData;
      let oldNum = $('#beforedispatchtowh_auditStatusTabs ul li.layui-this>span').text();
      let newNum = oldNum - successIds.length;
      $('#beforedispatchtowh_auditStatusTabs ul li.layui-this>span').text(newNum);
      $('#beforedispatchtowh_auditPage .layui-laypage-count').text(`共 ${newNum} 条`);
    });
  }
  // 前端更新行，更新后不刷新表格
  function updateTableRow_toAuditOrder (ids, errIdsArr) {
    zttCommonUpdataDataHandle({
      selectedIds: ids,
      errIds: errIdsArr
    }).then(newObj => {
      // 修改成功的数据
      let { successIds } = newObj;
      if (successIds.length != 0) {
        // 选中的数据
        let checkStatus = gridOptions.api.getSelectedRows();
        let newCheckStatus = deepCopy(checkStatus)
        commonReturnPromiseRes({
          url: ctx + '/unauditorder/listorder.html',
          type: 'POST',
          params: { orderIds: successIds.join(",") }
        }).then(function (result) {
          // 匹配选中的数据
          for (let i = 0, iLen = result.data.length; i < iLen; i++) {
            for (let j = 0, jLen = newCheckStatus.length; j < iLen; j++) {
              if (newCheckStatus[j].id == result.data[i].id) {
                newCheckStatus[j] = deepCopy(result.data[i])
                break;
              }
            }
          }
          gridOptions.api.updateRowData({ update: newCheckStatus });
        })
      }
    });
  }
  // 前端更新行，更新后不刷新表格 -待审核
  function updateSingleRow_toAuditOrder (id) {
    // 选中的数据
    let data = gridOptions.api.getRowNode(id);
    commonReturnPromise({
      url: ctx + '/unauditorder/listorder.html',
      type: 'POST',
      params: { orderIds: id }
    }).then(function (result) {
      data.setData(result[0] ? result[0] : []);
    })
  }
  //监听待审核tab点击[子状态tab]
  element.on('tab(beforedispatchtowh_auditStatusTabs)', function (data) {
    let unAuditOrderStatus = data.elem.context.dataset.index;
    $('#LAY-beforedispatchtowh #beforedispatchtowh_tabs').find('li').removeClass('layui-this');
    $('#LAY-beforedispatchtowh #beforedispatchtowh_tabs').find('li[data-index=audit]').addClass('layui-this');
    $('#beforedispatchtowhForm input[name="processStatus"]').val(unAuditOrderStatus);
    let toAuditData = bdtowhGetFormData();
    toAditOrderDataHandle(toAuditData);
  });
  //删除订单功能
  $('#toAuditOrder_deleteOrder').on('click', function () {
    let data = gridOptions.api.getSelectedRows();
    var ids = (data || []).map(function (item) {
      return item.id
    })
    if (ids.length > 0) {
      layer.confirm('删除的订单若在30天内系统会自动重新下载,否则需要手动添加,确认删除吗?', { icon: 3, title: '提示' }, function (index) {
        commonReturnPromise({
          url: '/lms/unauditorder/deleteorder.html',
          type: 'post',
          contentType: 'application/json',
          params: JSON.stringify({
            "id": ids.join(',')
          })
        }).then(res => {
          layer.msg(res || '删除成功,订单恢复中', { icon: 1 });
          $('#beforedispatchtowhSearch').click();
        })
        layer.close(index);
      });
    } else {
      layer.msg('请选择订单', { icon: 7 });
    }
  });
  //更新法属国信息
  $('#LAY-beforedispatchtowh #updateCountry').click(function () {
    let data = gridOptions.api.getSelectedRows();
    var ids = (data || []).map(function (item) {
      return item.id
    })
    if (ids.length > 0) {
      toAuditOrder_updateOwnerContry(ids)
    } else {
      layer.msg('请选择订单', { icon: 7 });
    }
  })
  //更新商品信息
  $('#LAY-beforedispatchtowh #updateProducts').click(function () {
    let data = gridOptions.api.getSelectedRows();
    var ids = (data || []).map(function (item) {
      return item.id
    })
    if (ids.length > 0) {
      commonReturnPromise({
        url: '/lms/unauditorder/updateprodinfo.html',
        type: 'post',
        params: { ids: ids.join(',') },
      }).then(res => {
        layer.msg(res, { icon: 1 })
        updateTableRow_toAuditOrder(ids, [])
      });
    } else {
      layer.msg('请选择订单', { icon: 7 });
    }
  });
  //拆分组合品
  $('#LAY-beforedispatchtowh #toAuditOrder_splitCompSku').click(function () {
    let data = gridOptions.api.getSelectedRows();
    var ids = (data || []).map(function (item) {
      return item.id
    })
    if (ids.length > 0) {
      splitCompSku(ids)
    } else {
      layer.msg('请选择订单', { icon: 7 });
    }
  });
  //合并组合品
  $('#LAY-beforedispatchtowh #toAuditOrder_mergeCompSku').click(function () {
    let data = gridOptions.api.getSelectedRows();
    var ids = (data || []).map(function (item) {
      return item.id
    })
    if (ids.length > 0) {
      mergeCompSku(ids)
    } else {
      layer.msg('请选择订单', { icon: 7 });
    }
  })
  //匹配物流
  $('#LAY-beforedispatchtowh #toAuditOrder_matchLogis').click(function () {
    let data = gridOptions.api.getSelectedRows();
    let ids = (data || []).map(function (item) {
      return item.id
    })
    if (ids.length > 0) {
      toAuditOrder_matchLogisFn(ids)
    } else {
      layer.msg('请选择订单', { icon: 7 });
    }
  });
  //标记发货
  $('#LAY-beforedispatchtowh #toAuditOrder_markDelivery').click(function () {
    let data = gridOptions.api.getSelectedRows();
    var ids = (data || []).map(function (item) {
      return item.id
    })
    if (ids.length > 0) {
      toAuditOrder_markDeliveryFn(ids)
    } else {
      layer.msg('请选择订单', { icon: 7 });
    }
  })

  //审核订单
  $('#LAY-beforedispatchtowh #toaudit_auditOrder').click(function () {
    let data = gridOptions.api.getSelectedRows();
    var ids = (data || []).map(function (item) {
      return item.id
    })
    if (ids.length > 0) {
      toAuditOrderBatch(ids)
    } else {
      layer.msg('请选择订单', { icon: 7 });
    }
  })
  //标记异常订单
  $('#LAY-beforedispatchtowh #toAuditOrder_markException').click(function () {
    let data = gridOptions.api.getSelectedRows();
    var ids = (data || []).map(function (item) {
      return item.id
    })
    if (ids.length > 0) {
      toAuditOrder_markExceptionFn(ids)
    } else {
      layer.msg('请选择订单', { icon: 7 });
    }
  });

  //直接转已发货
  $('#LAY-beforedispatchtowh #toAuditOrder_toShipped').click(function () {
    let data = gridOptions.api.getSelectedRows();
    var ids = (data || []).map(function (item) {
      return item.id
    })
    if (ids.length > 0) {
      toAuditOrder_toShippedFn(ids)
    } else {
      layer.msg('请选择订单')
    }
  });

  //修改订单标签
  $('#toAuditOrder_modifyOrderLabel').click(function () {
    let data = gridOptions.api.getSelectedRows();
    var idsArr = data.map(function (item) {
      return item.id;
    });
    if (idsArr.length == 0) {
      return layer.msg('请先选择数据', { icon: 7 });
    }
    let ids = idsArr.join('-');
    commonDirectMailRemarkBatch(ids, gridOptions);
  })

  // 更新新品信息
  $('#toAuditOrder_modifyCostInfo').click(function () {
    let data = gridOptions.api.getSelectedRows();
    var idsArr = data.map(function (item) {
      return item.id;
    });
    if (idsArr.length == 0) {
      return layer.msg('请先选择数据', { icon: 7 });
    }
    let ids = idsArr.join(',');
    commonReturnPromise({
      url: '/lms/unauditorder/updateCostInfo',
      type: 'post',
      params: { ids },
    }).then(res => {
      layer.msg(res, { icon: 1 })
      $('#beforedispatchtowhSearch').click();
    })
  })

  //同步订单状态
  $('#LAY-beforedispatchtowh #toAuditOrder_syncOrderStatus').click(function () {
    let data = gridOptions.api.getSelectedRows();
    var ids = (data || []).map(function (item) {
      return item.id
    })
    var platOrderId = (data || []).map(function (item) {
      return item.platOrderId
    })
    if (ids.length > 0) {
      toAuditOrder_syncOrderStatusFn(ids, platOrderId)
    } else {
      layer.msg('请选择订单', { icon: 7 });
    }
  })


  //新增订单
  $('#LAY-beforedispatchtowh #toAuditOrder_newOrder').click(function () {
    // toAuditOrderNewandEdit('1', null)
    console.log('新增订单')
    toAuditOrderNewandEdit('1', {})
  })
  //批量修改仓库-20220629-ztt
  $('#LAY-beforedispatchtowh #toAuditOrder_batchEditWareHouse').click(function () {
    let ids = getAuditTableSelectIds();
    if (!ids || ids.length < 1) {
      layer.msg('请选择订单', { icon: 7 });
      return;
    }
    // console.log(ids);
    //弹框-操作仓库信息
    layer.open({
      type: 1,
      title: '批量修改仓库和物流',
      area: ['30%', '60%'],
      btn: ['保存', '关闭'],
      content: $('#toAuditOrder_batchEditWareHouseLayer').html(),
      id: 'toAuditOrder_batchEditWareHouseLayerId',
      success (layero, index) {
        //调用接口渲染仓库
        commonReturnPromise({
          url: '/lms/unauditorder/listenum.html'
        }).then(res => {
          let warehouseArr = res.prodWarehouses;
          let defaultId = ''
          let newWarehouseArr = warehouseArr.filter(item => {
            if (item.value == '义乌仓') {
              defaultId = item.name
            }
            return item.value == '自建南宁仓' || item.value == '义乌仓';
          })

          commonRenderSelect('batchEditWareHouse_warehouse', newWarehouseArr, {
            name: 'value',
            code: 'name',
            selected: defaultId
          }).then(() => {
            form.render('select');
          })
        });
        //调用接口渲染物流公式
        commonReturnPromise({
          url: '/lms/unauditorder/listcompanyandagent.html'
        }).then(res => {
          let companysArr = res.companys;
          commonRenderSelect('batchEditWareHouse_logisCompany', companysArr, {
            name: 'cnName',
            code: 'id'
          }).then(() => {
            form.render('select');
          })
        });
        //物流公式联动物流方式
        form.on('select(batchEditWareHouse_logisCompanyFilter)', function (obj) {
          let val = obj.value;
          if (!val) {
            $('#batchEditWareHouse_logisWay').html('');
            form.render('select');
          } else {
            commonReturnPromise({
              url: `/lms/unauditorder/listlogistype.html?agent=&logisticsCompanyId=${val}&specialType=直发物流`
            }).then(res => {
              commonRenderSelect('batchEditWareHouse_logisWay', res, {
                name: 'name',
                code: 'id'
              }).then(() => {
                form.render('select');
              })
            });
          }
        })
      },
      yes: function (index, layero) {
        let warehouseId = layero.find('#batchEditWareHouse_warehouse').val();
        let logisTypeId = layero.find('#batchEditWareHouse_logisWay').val();
        if (!warehouseId && !logisTypeId) {
          return layer.msg('仓库和物流方式至少有一个必填', { icon: 7 });
        }
        let params = {
          orderIds: ids.join(','),
          logisTypeId,
          warehouseId
        };
        commonReturnPromise({
          url: '/lms/unauditorder/batch/update',
          contentType: 'application/json',
          type: 'post',
          params: JSON.stringify(params)
        }).then(res => {
          layui.admin.batchResultAlert("修改仓库和物流:", res, function (errIdsArr) {
            layer.close(index);
            updateTableRow_toAuditOrder(ids, errIdsArr)
            // $('#beforedispatchtowhSearch').trigger('click');
          });
        })
      }
    });
  });
  //转取消订单
  $('#toAuditOrder_toCancel').click(function () {
    let ids = getAuditTableSelectIds();
    if (!ids || ids.length < 1) {
      layer.msg('请选择订单', { icon: 7 });
      return;
    }
    commonOrderConfirmLayer(ids.length, function (index) {
      initAjax('/abnormalorder/tocancel.html', 'post', { ids: ids.join(",") }, function (returnData) {
        layer.close(index);
        layui.admin.batchResultAlert("转取消订单:", returnData.data, function (errIdsArr) {
          deleteTableRow_toAuditOrder(ids, errIdsArr)
        });
      }, 'application/x-www-form-urlencoded');
    });
  });
  //重新分仓
  $('#toAuditOrder_reMatchWarehouseType').click(function () {
    let ids = getAuditTableSelectIds();
    if (!ids || ids.length < 1) {
      layer.msg('请选择订单', { icon: 7 });
      return;
    }
    layer.confirm('选中订单重新匹配分仓处理?', function (index) {
      initAjax('/unauditorder/rematchwarehousetype.html', 'post', { ids: ids.join(",") }, function (returnData) {
        layui.admin.batchResultAlert("匹配分仓:", returnData.data, function (errIdsArr) {
          updateTableRow_toAuditOrder(ids, errIdsArr)
        });
      }, 'application/x-www-form-urlencoded');
    })

  });
  //指定仓库类型
  $('#toAuditOrder_appointWarehouseType').click(function () {
    let ids = getAuditTableSelectIds();
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
        $(layero).find('.layui-layer-content').html($("#toAuditOrder_appointWarehouseTypeTpl").html());
        layui.form.render("radio");
      },
      yes: function (index, layero) {
        let warehouseType = $("#toAuditOrder_appointWarehouseTypeForm input[name=warehouseType]:checked").val();
        initAjax('/unauditorder/appointwarehousetype.html', 'post', { ids: ids.join(","), warehouseType: warehouseType }, function (returnData) {
          layui.admin.batchResultAlert("重新指定仓库类型:", returnData.data, function (errIdsArr) {
            updateTableRow_toAuditOrder(ids, errIdsArr)
          });
          layer.close(index);
        }, 'application/x-www-form-urlencoded')
      }
    })
  });
  //重新匹配SKU
  $('#toAuditOrder_reParseSku').click(function () {
    let ids = getAuditTableSelectIds();
    if (!ids || ids.length < 1) {
      layer.msg('请选择订单', { icon: 7 });
      return;
    }
    layer.confirm('对SKU异常订单重新匹配SKU?', function (index) {
      initAjax('/unauditorder/reparsesku.html', 'post', { ids: ids.join(",") }, function (returnData) {
        layui.admin.batchResultAlert("匹配SKU:", returnData.data, function (errIdsArr) {
          updateTableRow_toAuditOrder(ids, errIdsArr)
        });
      }, 'application/x-www-form-urlencoded');
    })

  });
  //ztt20230907---搜索按钮点击事件
  $('#beforedispatchtowhSearch').on('click', function(){
    //定义一级tab映射
    let  firstTabMap = {
      110: 'audit',
      115: 'dispatch',
      502: 'lack'
    };
    //定义待审核映射[其他状态正常映射]
    let auditMap = {
      0 : [1],
      1 : [2],
      2: [3],
      3: [2,3],
      4: [4],
      5: [2,4],
      6: [3,4],
      7: [2,3,4],
    }
    //获取到当前的一级页签[根据一级页签决定走哪个渲染]
    let firstTab = $('#beforedispatchtowh_tabs').find('li.layui-this').attr('data-index');
    let formData = bdtowhGetFormData();
    //判断是否单个输入
    let orderIds = formData.field.orderIds.trim(); //订单号
    let logisTrackingNos = formData.field.logisTrackingNos.trim(); //跟踪号
    let hasOrderIds = orderIds != '' && orderIds.split(',').length==1;
    let hasLogisNos = logisTrackingNos != '' && logisTrackingNos.split(',').length == 1;
    if(hasOrderIds || hasLogisNos){
      //调用全部订单的接口获取到当前所属以及页签
      commonReturnPromise({
        url: '/lms/platorder/listorder.html',
        type: 'post',
        params: {
          orderIds: orderIds,
          logisTrackingNos: logisTrackingNos,
          processStatusList: '110,115,501,500,503,504,502'
        }
      }).then(res => {
        if(!res){
          return layer.msg('查询不到订单',{icon:7});
        }else{
          let processStatus = res[0].processStatus; //一级页签状态[异常单无二级页签,只有一级]
          let oaStatus = res[0].oaStatus; //待审核二级页签状态
          let logisApplyStatus = res[0].logisApplyStatus; //缺货/待派单二级页签状态
          let firstTabVal = firstTabMap[processStatus] ? firstTabMap[processStatus]: 'abnormal';
          let newOaStatus = '';
          if(processStatus == 110){
            newOaStatus = auditMap[oaStatus][0];
            $('.beforedispatchtowh-showDispath').addClass('disN');
          }else if(processStatus == 115 || processStatus ==502){
            newOaStatus = [1,2,3].includes(logisApplyStatus) ? 1 : logisApplyStatus;
            $('.beforedispatchtowh-showDispath').removeClass('disN');
          }else{
            newOaStatus = processStatus;
            $('.beforedispatchtowh-showDispath').addClass('disN');
          }
          //一级页签样式
          $('#beforedispatchtowh_tabs').find(`li`).removeClass('layui-this');
          $('#beforedispatchtowh_tabs').find(`li[data-index=${firstTabVal}]`).addClass('layui-this');
          $('#beforedispatchtowhForm [name=processStatus]').val(newOaStatus);
          let newFormData = bdtowhGetFormData();
          console.log(newFormData,firstTabVal)
          //二级页签分别单独处理
          switch (processStatus) {
            case 110:
              //二级tab[渲染和执行事件,不能触发按钮,直接执行函数]
              appendAuditTab(beforedispatchtowhSecondTabListObj.audit);
              $('.beforedispatchtowh-audit').removeClass('disN'); //待审核
              $('.beforedispatchtowh-dispatch').addClass('disN'); //缺货/待派单
              $('.beforedispatchtowh-abnormal').addClass('disN'); //异常单
              //执行请求事件
              toAditOrderDataHandle(newFormData);
              break;
            case 115:
            case 502:
              //二级tab[渲染和执行事件,不能触发按钮,直接执行函数]
              appendToDespatchOrderTab(beforedispatchtowhSecondTabListObj.lack);
              $('.beforedispatchtowh-audit').addClass('disN'); //待审核
              $('.beforedispatchtowh-dispatch').removeClass('disN'); //缺货/待派单
              $('.beforedispatchtowh-abnormal').addClass('disN'); //异常单
              //执行请求事件
              toDespatchOrderSubmitAndRenderTable(newFormData, processStatus);
              break;
            default:
              //二级tab[渲染和执行事件,不能触发按钮,直接执行函数]
              appendAbnormalTab(beforedispatchtowhSecondTabListObj.abnormal);
              $('.beforedispatchtowh-audit').addClass('disN'); //待审核
              $('.beforedispatchtowh-dispatch').addClass('disN'); //缺货/待派单
              $('.beforedispatchtowh-abnormal').removeClass('disN'); //异常单
              //执行请求事件
              abnormalOrderSubmitAndRenderTable(newFormData);
              break;
          }
        }
      });
    }else{
      if(firstTab == 'audit'){
        toAditOrderDataHandle(formData);
      }else if(firstTab == 'dispatch'){
        toDespatchOrderSubmitAndRenderTable(formData, 115);
      }else if(firstTab == 'lack'){
        toDespatchOrderSubmitAndRenderTable(formData, 502);
      }else if(firstTab == 'abnormal'){
        abnormalOrderSubmitAndRenderTable(formData);
      }
    }
  });
  //ztt0828新增表单查询功能
  function toAditOrderDataHandle(data){
    data.field.unAuditOrderStatus = data.field.processStatus;
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
    // 物流方式与物流方式
    if (data.field.agentCompany == 'logisticsModes' && data.field.logisticsCompanyId && !data.field.logisTypeIds) {
      data.field.logisTypeIds = $('#beforedispatchtowhlogisTypeIds').attr('acct_ids')
    }

    if (data.field.agentCompany == 'logisticsModes') {
      data.field.agentCompany = ''
    }
    // data.field.orderDateMin = data.field.delayMin;
    // data.field.orderDateMax = data.field.delayMax;
    // delete data.field.delayMin;
    // delete data.field.delayMax;
    //天数类型处理
    if (data.field.dateType == 1) {//订单天数
        data.field.orderDateMin = data.field.delayMin;
        data.field.orderDateMax = data.field.delayMax;
        delete data.field.delayMin;
        delete data.field.delayMax;       
    } else if (data.field.dateType == 2) {//跟踪号天数
        data.field.trackDateMin = data.field.delayMin;
        data.field.trackDateMax = data.field.delayMax;
        delete data.field.delayMin;
        delete data.field.delayMax;
    } else if (data.field.dateType == 3) {//剩余天数
        data.field.shipByDateMin = data.field.delayMin;
        data.field.shipByDateMax = data.field.delayMax;
        delete data.field.delayMin;
        delete data.field.delayMax;
    }else if (data.field.dateType == 4) {// 跟踪剩余天数
        data.field.trackCloseTimeMin = data.field.delayMin;
        data.field.trackCloseTimeMax = data.field.delayMax;
        delete data.field.delayMin;
        delete data.field.delayMax;
    }else if(data.field.dateType == 5){ //发货剩余天数
      data.field.shipDeadLineMin = data.field.delayMin;
      data.field.shipDeadLineMax = data.field.delayMax;
      delete data.field.delayMin;
      delete data.field.delayMax;
    }
    if (data.field.agentCompany == 'agents' && data.field.logisticsCompanyId) {
      data.field.agentCompany = data.field.logisticsCompanyId
      delete data.field.logisticsCompanyId
    } else if (data.field.agentCompany == 'companys' && data.field.logisticsCompanyId) {
      delete data.field.agentCompany
    } else {
      data.field.agentCompany = ''
      delete data.field.logisticsCompanyId
    }
    // 1. 选择了部门，没有选店铺
    //     1.1 部门下有店铺，传全部店铺
    //     1.2 部门下没有店铺，传0
    // 2. 选择了部门，选择了店铺，传选择的店铺
    if (data.field.orgs != '' && data.field.storeAcctIds == '') {
      data.field.storeAcctIds = $('#beforedispatchtowh_store').attr('acct_ids') || 0;
    }
    toAuditOrderTableorder(data.field)
  }


  //监听平台下拉选择
  form.on('select(toAuditOrderplatCodes)', function (obj) {
    commonOrderAddOrg('toAuditOrder', form, obj.value);
    // 平台状态
    getListplatorderstatus_toauditorder(obj.value).then(function (data) {
      let arr = []
      data && data.forEach(item => arr.push({ "platOrderStatus": item }))
      commonRenderSelect('toauditorderOrderStatusList', arr, { name: 'platOrderStatus', code: 'platOrderStatus' }).then(function () {
        formSelects.render('toauditorderOrderStatusList', { placeholder: '请先选择平台' });
      });
    });
  })

  //监听公司下拉选择
  form.on('select(toAuditOrdercompanyType)', function (obj) {
    toAuditOrder_companyType = obj.value
    let name = obj.value === 'logisticsModes' ? 'logisticsCollectionName' : 'cnName'
    appendSelect($('#toAuditOrderForm').find('select[name="logisticsCompanyId"]'), toAuditOrder_company[toAuditOrder_companyType], 'id', name)
    form.render()
  })
  //监听物流公司下拉选择
  form.on('select(toAuditOrdercompany)', function (obj) {
    var agent = "",
      logisticsModeId = '',
      logisticsCompanyId = "";
    if (toAuditOrder_companyType === 'agents') {
      agent = obj.value
    } else if (toAuditOrder_companyType === 'companys') {
      logisticsCompanyId = obj.value
    } else if (toAuditOrder_companyType === 'logisticsModes') {
      logisticsModeId = obj.value
    }
    getAuditAllLogicsType(agent, logisticsCompanyId, logisticsModeId)
    form.render()
  })
  getAuditPageEnum();
  getAuditAllCompanies();
  getAuditStoreByPlatform('', function (returnData) {
    toAuditOrder_allstore = returnData.data
  });
  getAuditAllLogicsType('', '', '', function (returnData) {
    toAuditOrder_logisType = returnData.data
  });
  getAuditAlldevEmployee();
  getAuditAllpurchaseEmployee();
  getAuditAllSite();
  getAuditCurrencyEnums();
  new dropButton('toAuditOrder_platOper');
  new dropButton('toAuditOrder_editOrder');
  new dropButton('toAuditOrder_dealOrder');


  // 页面数据请求----------------------------------------
  // 订单获得详细数据
  function requestDetailedData (orderId) {
    return commonReturnPromise({
      url: ctx + '/unauditorder/detail.html',
      params: { orderId }
    })
  }
  //  获取页面枚举数
  function getAuditPageEnum () {
    initAjax('/unauditorder/listenum.html', 'post', {}, function (returnData) {
      toAuditOrder_pageEnum = returnData.data
      toAuditOrder_pageEnum.platCode = toAuditOrder_pageEnum.platCodes
      toAuditOrder_pageEnum.prodLogisAttrs = toAuditOrder_pageEnum.logisAttrs
      toAuditOrder_pageEnum.shippingCountryCodes = toAuditOrder_pageEnum.shippingCountrys
      toAuditOrder_pageEnum.warehouseId = toAuditOrder_pageEnum.prodWarehouses
      let temporayReturn = []
      returnData.data.orderLabels.forEach((v) => {
        let temporayObj = {}
        temporayObj.name = v.code
        temporayObj.value = v.name
        temporayReturn.push(temporayObj)
      })
      returnData.data.orderLabels = temporayReturn
      toAuditOrder_pageEnum.orderLabels = temporayReturn
      toAuditOrder_pageEnum.orderLabels_toAuditOrder = toAuditOrder_pageEnum.orderLabels
      for (var i in returnData.data) {
        appendSelect($('#toAuditOrderForm').find('select[name="' + i + '"]'), returnData.data[i], 'name', 'value')
        appendSelect($('#toAuditOrderForm').find('select[_name="' + i + '"]'), returnData.data[i], 'name', 'value')

        if (i === 'shippingCountryCodes') {
          const shippingCountryCodeList = toAuditOrder_pageEnum.shippingCountryCodes.map(item => ({
            ...item,
            name: item.value + "(" + item.name + ")",
            shippingCountryCode: item.name,
            shippingCountryName: item.enFullValue,
            shippingCountryCnName: item.value,
          }))
          appendSelect($('#toAuditOrderForm').find('select[name="shippingCountryCodes"]'), shippingCountryCodeList, 'shippingCountryCode', 'name')
          appendSelect($('#toAuditOrderForm').find('select[_name="shippingCountryCodes"]'), shippingCountryCodeList, 'shippingCountryCode', 'name')
        }
        if (i === 'unAuditOrderStatus') {
          appendAuditTab(returnData.data[i])
        }
      }
      form.render()
      formSelects.render('storeAcct')
      formSelects.render('orderLabels_toAuditOrder')
      formSelects.render('logisAttrs')
      formSelects.render('shippingCountrys')
    })
  }

  //获取所有物流公司以及货代公司
  function getAuditAllCompanies () {
    initAjax('/unauditorder/listcompanyandagent.html', 'post', {}, function (returnData) {
      toAuditOrder_company = returnData.data
      appendSelect($('#toAuditOrderForm').find('select[name="logisticsCompanyId"]'), returnData.data.logisticsModes, 'id', 'logisticsCollectionName')
      form.render()
    })
  }

  //获取所有物流方式
  function getAuditAllLogicsType (agent, logisticsCompanyId, logisticsModeId, func) {
    initAjax('/unauditorder/listlogistype.html', 'get', { agent, logisticsCompanyId, logisticsModeId,specialType: "直发物流" }, function (returnData) {
      if (func) {
        func(returnData)
      }
      if (!$('#toAuditOrderForm').find('select[_name="logisTypeIds"]').length) {
        formSelects.render('logisTypeIds_xm_select_toAudit')
      }
      appendSelect($('#toAuditOrderForm').find('select[_name="logisTypeIds"]'), returnData.data, 'id', 'name')
      formSelects.render('logisTypeIds_xm_select_toAudit')
    })
  }

  //根据平台code获取店铺列表
  function getAuditStoreByPlatform (platcode, func) {
    initAjax('/sys/orderliststorebyplatcode.html', 'get', { platCode: platcode }, function (returnData) {
      if (func) {
        func(returnData)
      }
      formSelects.render('toAuditOrderStoreAcct', { placeholder: '请先选择平台' });
    }, 'application/x-www-form-urlencoded')
  }

  //根据平台code,roleNames获取店铺列表
  function getAuditStoreByPlatformAndRoleName (platcode, func) {
    initAjax('/sys/listStoreForRenderHpStoreCommonComponent.html', 'post', { platCode: platcode, roleNames: `${platcode}专员`, }, function (returnData) {
      if (func) {
        func(returnData)
      }
    }, 'application/x-www-form-urlencoded')
  }

  // 获取平台订单状态
  function getListplatorderstatus_toauditorder (platcode) {
    return commonReturnPromise({
      type: 'get',
      url: `/lms/undispatch/listplatorderstatus.html?platCode=${platcode}`
    });
  }

  //获取所有开发专员
  function getAuditAlldevEmployee () {
    initAjax('/sys/prodOwnerList.html', 'post', {}, function (returnData) {
      appendSelect($('#toAuditOrderForm').find('select[name="preprodDevId"]'), returnData.data, 'id', 'loginName')
      form.render()
    })
  }

  //获站点接口
  function getAuditAllSite (platCode, func) {
    initAjax('/enum/getSiteEnum.html?platCode=' + platCode, 'post', {}, function (returnData) {
      toAuditOrder_Site = returnData.data
      if (func) {
        func(returnData)
      }
    }, 'application/x-www-form-urlencoded')
  }

  //获取币种枚举
  function getAuditCurrencyEnums () {
    initAjax('/sysdict/getCurrencyEnums.html', 'post', {}, function (returnData) {
      toAuditOrder_Currency = returnData.data
    })
  }

  //更新法属国
  function toAuditOrder_updateOwnerContry (ids) {
    var ids = ids.join(',')
    initAjax('/unauditorder/updatefrinfo.html', 'post', { ids: ids }, function (returnData) {
      layer.msg(returnData.msg || '更新法属国成功')
      updateTableRow_toAuditOrder(ids, [])
    }, 'application/x-www-form-urlencoded')
  }

  // 匹配物流
  function toAuditOrder_matchLogisFn (ids) {
    initAjax('/unauditorder/matchlogistype.html', 'post', { ids: ids.join(',') }, function (returnData) {
      layui.admin.batchResultAlert("匹配物流完成:", returnData.data, function (errIdsArr) {
        updateTableRow_toAuditOrder(ids, errIdsArr)
      });
    }, 'application/x-www-form-urlencoded')
  }

  /**
   * 同步订单状态
   * @param {订单号} ids
   * @param {平台订单号，拆分订单的平台订单号相同} platOrderId
   */
  function toAuditOrder_syncOrderStatusFn (ids, platOrderId) {
    var idStr = ids.join(',')
    initAjax('/unauditorder/syncplatstatus.html', 'post', { ids: idStr }, function (returnData) {
      layui.admin.batchResultAlert("同步订单状态:", returnData.data, function (errIdsArr) {
        updateTableRow_toAuditOrder(ids, errIdsArr)
      });
    }, 'application/x-www-form-urlencoded')
  }

  /**
   * 审核订单
   * @param {订单号} ids
   */
  function toAuditOrderBatch (ids) {
    var idsStr = ids.join(',')
    initAjax('/unauditorder/markaudit.html', 'post', { ids: idsStr }, function (returnData) {
      layui.admin.batchResultAlert("审核订单:", returnData.data, function (errIdsArr) {
        deleteTableRow_toAuditOrder(ids, errIdsArr)
      });
    }, 'application/x-www-form-urlencoded')
  }

  /**
   * 标记发货
   * @param {订单号} ids
   */
  function toAuditOrder_markDeliveryFn (ids) {
    var idStr = ids.join(',');
    zttCommonProgressBar({ type: 10, ids: idStr }, function (progressData) {
      layui.admin.batchResultAlert("标记平台发货:", progressData, function (errIdsArr) {
        updateTableRow_toAuditOrder(ids, errIdsArr)
      });
    });
  }

  /**
   * 标记异常
   * @param {订单号} ids
   */
  function toAuditOrder_markExceptionFn (ids) {
    commonOrderConfirmLayer(ids.length, function (index) {
      initAjax('/unauditorder/markabnormal.html', 'post', { ids: ids.join(',') }, function (returnData) {
        layer.close(index);
        layui.admin.batchResultAlert("订单标记异常:", returnData.data, function (errIdsArr) {
          deleteTableRow_toAuditOrder(ids, errIdsArr)
        });
      }, 'application/x-www-form-urlencoded')
    });
  }
  /**
   * 直接转已发货
   * @param {订单号} ids
   */
  function toAuditOrder_toShippedFn (ids) {
    commonOrderConfirmLayer(ids.length, function (index) {
      initAjax('/platorder/toshipped.html', 'post', { ids: ids.join(',') }, function (returnData) {
        layer.close(index);
        layui.admin.batchResultAlert("直接转已发货:", returnData.data, function (errIdsArr) {
          deleteTableRow_toAuditOrder(ids, errIdsArr)
        });
      }, 'application/x-www-form-urlencoded');
    });
  }

  //解密地址
  $('#toAuditOrder_decryptAddress').on('click', function () {
    let data = gridOptions.api.getSelectedRows();
    var ids = (data || []).map(function (item) {
      return item.id
    })
    if (ids.length > 0) {
      commonReturnPromise({
        type: 'post',
        url: '/lms/platorder/decrypt/list',
        contentType: 'application/json',
        params: JSON.stringify(ids)
      }).then(res => {
        layui.admin.batchResultAlert("解密地址:", res, function (errIdsArr) {
          updateTableRow_toAuditOrder(ids, errIdsArr)
        });
      });
    } else {
      layer.msg('请选择订单', { icon: 7 });
    }
  });


  //获取所有采购专员
  function getAuditAllpurchaseEmployee () {
    initAjax('/sys/buyerList.html', 'post', {}, function (returnData) {
      appendSelect($('#toAuditOrderForm').find('select[name="purchasingAgentId"]'), returnData.data, 'id', 'loginName')
      form.render()
    })
  }



  //合并订单拆单
  function toAuditOrder_mergeDemolition (id) {
    initAjax('/unauditorder/splitmergeorder.html', 'post', { id: id }, function (returnData) {
      layer.msg(returnData.msg || '拆单成功');
      $('#beforedispatchtowhSearch').trigger('click');
    }, 'application/x-www-form-urlencoded')
  }

  // 根据商品sku获取商品信息
  function toAuditOrder_getProdInfoByprodsku (arr, func) {
    initAjax('/unauditorder/listprodinfobysku.html', 'POST', JSON.stringify(arr), function (returnData) {
      if (func) {
        func(returnData)
      }
    })
  }

  // 获取所有页签数量
  function getAuditAllTabNum (data) {
    initAjax('/unauditorder/statuscount.html', 'post', data, function (returnData) {
      for (var i in returnData.data) {
        $('#LAY-beforedispatchtowh #beforedispatchtowh_auditStatusTabs').find('li[data-index="' + i + '"]').find('span').text(returnData.data[i])
      }
    }, 'application/x-www-form-urlencoded')
  }

  // 获取商品列表
  function getAuditProductList (sSku, func) {
    initAjax('/product/getProds.html', 'post', { searchType: 'sSku', searchValue: sSku, page: 1, limit: 300, isCombination: false, isSale: '' }, function (returnData) {
      if (func) {
        func(returnData)
      }
    }, 'application/x-www-form-urlencoded')
  }

  //保存修改新增待审核订单
  function savetoAuditOrders (data, func) {
    initAjax('/unauditorder/saveorder.html', 'post', JSON.stringify(data), function (returnData) {
      if (func) {
        func(returnData)
      }
    })
  }

  let immutableStore = [];
  const gridOptions = {
    columnDefs: [{
      width: 40,
      minWidth: 40,
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
        if (d.platTagList && d.platTagList.length > 0) {
          tagsDom = `
                            ${d.platTagList.map(item => {
            return `<span class="hp-badge" style="background:${item.color};width:auto; color:#fff;margin: 0 5px;padding:0 5px!important;">${item.tagName}</span>`
          }).join('')}`;
        }
        // 重寄订单
        let orderLabel = d.operOrderType == 3 ? '<span style="color:red">重寄</span>' : ''
        // operOrderType 拆单合单：订单操作类型：0原始订单，1拆除订单，2合并订单
        const operOrderTypeTag = d.operOrderType == 1 ? '<span class="hp-badge layui-bg-orange" title="拆出订单">拆</span>' : d.operOrderType == 2 ? '<span class="hp-badge layui-bg-orange" title="合并订单">合</span>' : d.operOrderType == 0 && d.operOriginId != "0" ? '<span class="hp-badge layui-bg-orange" title="拆单订单">拆</span>' : ''
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
        let d = data.data;
        let jsonData = JSON.stringify(d).replaceAll("'", "");
        jsonData = jsonData.replace(/</g, '&lt;')
        jsonData = jsonData.replace(/>/g, '&gt;')
        //利润计算逻辑
        let profitCalculation = `<span data-text='${jsonData}' onmouseenter="toAuditOrderProfitTipsShow(this)" onmouseleave="toAuditOrderProfitTipsHide(this)">${d.profit || '0.00'}</span>`;
        let fee = [d.platFee || 0, d.otherFee || 0].filter(i => i != 0);
        let amtDom = d.platShippingAmt ? `<span>(${d.platShippingAmt})</span>` : "";
        return `<div class="alignLeft">
                    <div><span class='gray'>${d.currency || ""}</span><span id="toAudit_table_platOrderAmt">${d.platOrderAmt || ""}</span>${amtDom}</div>
                    <div><span class="gray">平台费</span>${fee.join(' + ')}</div>
                    <div><span class="gray">商品成本(￥)</span>${d.prodCost} / ${d.costPrice}</div>
                    <div><span class="gray">物流成本(￥)</span>${d.shippingCost}<button class="layui-btn layui-btn-xs" name="logisCost" style="cursor:pointer;">详</button></div>
                    <div><span class="gray">利润(￥)</span>${profitCalculation} <span class="gray">${(100 * d.profit / d.platOrderAmt / d.exchangeRate).toFixed(2)}%</span></div>
                </div>`
      }
    },
    {
      headerName: '商品',
      width: 150,
      wrapText: true,
      autoHeight: true,
      cellRenderer: (data) => {
        let d = data.data
        return `<div class="alignLeft">
          <div><span class="gray">种类和数量：</span><span id="toAudit_table_skuQuantity">${d.kindNum || ""}</span>/<span id="toAudit_table_prodQuantity">${d.prodQuantity || ""}</span></div>
          <div><span class="gray">重量(g)：</span><span>预${d.preWeight}</span>|<span>称${d.realWeight}</span>|<span>计${d.priceWeight}</span></div>
          <div><span class="gray skuEllipsis">SKU：<span style="color: black" onmouseout="removeTip(this)" onmouseover="showTip('${d.skuOverview}',this)" >${d.skuOverview?.split(';')?.slice(0, 3)?.join(';') || ''}</span></span></div>
      </div>`

      }
    },
    {
      headerName: '收件人',
      field: "shippingCountryCnName",
      wrapText: true,
      autoHeight: true,
      cellRenderer: (data) => {
        let d = data.data
        const _buyerNote = d.buyerNote || ""
        const _buyerNoteCopyHtml = `<a class="hidden">${_buyerNote}</a>
                <button
                    class="layui-btn layui-btn-primary layui-btn-xs copyTxt"
                    onclick="layui.admin.copyTxt(this)"
                >
                    复制
                </button>`
        // 联系买家
        let connectBtn = ''
        const chatPlatCodeList = ['lazada']
        if(chatPlatCodeList.includes(d.platCode)){
          connectBtn = `<a class="ml10" name="connectchatbuyer" style="color:#1E90FF;cursor:pointer;">联系买家</a>`
        }
        const translateBtn = `<button class="layui-btn layui-btn-primary layui-btn-xs ml10" data-id="${d.id}" data-text="${_buyerNote}" onClick="toAuditBuyerTranslateTipsShow(this,event)">翻译</button>`
        return `<div class="alignLeft">
                    <div id="toAudit_table_shippingUsername">${d.shippingUsername || ""}</div>
                    <div>[${d.shippingCountryCnName || ""}]${connectBtn}</div>
                    <div>
                        <span data-text="${_buyerNote}" onmouseenter="toAuditBuyerTipsShow(this)" onmouseleave="toAuditBuyerTipsHide(this)">
                            <span class="pora copySpan">
                                <span class="gray">留言：</span>${_buyerNote.slice(0, 46)}
                                ${_buyerNote ? _buyerNoteCopyHtml : ''}
                            </span>
                        </span>
                        ${_buyerNote ? translateBtn : ''}
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
        let closeTimeHmtl = `<div><span class="gray">关单：</span>${Format(d.closeTime || "", 'yyyy-MM-dd hh:mm:ss')}<span class="${d.closeTimeDay < 4 ? 'plus-red-text' : ''}">(≤${d.closeTimeDay || '0'})</span></div>`
        return `<div class="alignLeft">
                    <div><span class="gray">买家：</span><span id="toAudit_table_buyerRequireShippingType">${d.buyerRequireShippingType || ""}</span></div>
                    <div><span class="gray">发货：</span><span id="logisTypeName_toAuditOrder">${d.logisTypeName || ""}</span></div>
                    <div>
                        <span class="gray">跟踪号：</span>
                        <span">${d.logisTrackingNo || ""}</span>
                        <span onclick="layui.admin.onlyCopyTxt('${d.logisTrackingNo}', event)" style="display: ${d.logisTrackingNo ? 'inline-block':'none'}" class="copy-icon">
                          <svg t="1710754196184" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2392" width="16" height="16"><path d="M768 832q-0.992 54.016-37.504 90.496T640 960H192q-54.016-0.992-90.496-37.504T64 832V384q0.992-54.016 37.504-90.496T192 256v64q-27.008 0.992-44.992 19.008T128 384v448q0.992 27.008 19.008 44.992T192 896h448q27.008-0.992 44.992-19.008T704 832h64zM384 128q-27.008 0.992-44.992 19.008T320 192v448q0.992 27.008 19.008 44.992T384 704h448q27.008-0.992 44.992-19.008T896 640V192q-0.992-27.008-19.008-44.992T832 128H384z m0-64h448q54.016 0.992 90.496 37.504T960 192v448q-0.992 54.016-37.504 90.496T832 768H384q-54.016-0.992-90.496-37.504T256 640V192q0.992-54.016 37.504-90.496T384 64z" p-id="2393" fill="#aaaaaa"></path></svg>
                        </span>
                    </div>
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
                    <div><span class="gray">订单：</span><span id="toAudit_table_orderTimeCn">${Format(d.orderTimeCn || "", 'yyyy-MM-dd hh:mm:ss')}</span><span class="${d.orderDay > 4 ? 'plus-red-text' : ''}">(${d.orderDay || '0'})</span></div>
                    <div><span class="gray">申请：</span><span>${Format(d.logisApplyTime || "", 'yyyy-MM-dd hh:mm:ss')}</span></div>
                    <div><span class="gray">标记：</span><span>${Format(d.markShippingTime || "", 'yyyy-MM-dd hh:mm:ss')}</span></div>
                    <div><span class="gray">截止：</span><span>${Format(d.shipByDate || "", 'yyyy-MM-dd hh:mm:ss')}</span></div>
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
            `<span data-text='${JSON.stringify(d.platOrderNotes)}' onmouseenter="toAuditBuyerTipsShowTable(this)" onmouseleave="toAuditBuyerTipsHide(this)">${d.platOrderNotes[noteContentLength - 1].noteType || ""}:${d.platOrderNotes[noteContentLength - 1].noteContent || ""}</span>`;
        }
        const noteTipsHtml = `<span class="hp-badge fr toAuditOrder-noteContent-tag">多</span>`;
        let html = `<div class="alignLeft">
                    <div><span class="gray">仓库：</span>${d.warehouseName || ""}</div>
                    <div><span class="gray">批次：</span>${d.pickBatchNo || ""}</div>
                    <div><span class="gray">备注：</span>${recentNoteContent}${(d.platOrderNotes && d.platOrderNotes.length > 1) ? noteTipsHtml : ''}</div>
                </div>`
        return html
      }
    },
    {
      headerName: '仓库处理',
      width: 172,
      wrapText: true,
      autoHeight: true,
      cellRenderer: (data) => {
        let d = data.data
        return `<div class="alignLeft">
                    <div><span class="gray">批次：</span>${d.batchInfo || ""}</div>
                    <div><span class="gray">配货：</span>${d.pickInfo || ""}</div>
                    <div><span class="gray">投篮：</span>${d.checkInfo || ""}</div>
                    <div><span class="gray">包装：</span>${d.packingInfo || ""}</div>
                    <div><span class="gray">分拣：</span>${d.scanerInfo || ""}</div>
                </div>`
      }
    },
    {
      field: '操作',
      width: 100,
      wrapText: true,
      autoHeight: true,
      cellRenderer: () => {
        let editDom = $('#toAuditOrder_updatePermTagTable').html();//修改订单
        let splitDom = $('#toAuditOrder_splitPermTagTable').html(); //拆分订单
        let ebayRefundDom = $('#toAuditOrder_ebayRefundPermTagTable').html(); //ebay退款
        return `${editDom}<br>${splitDom}<br>${ebayRefundDom}<br>
    <button name="toAuditOrder_remark" class="layui-btn layui-btn-xs layui-btn-normal">备注</button>`
      }
    }
    ],
    rowData: immutableStore,
    getRowNodeId: function (data) {
      return data.id;
    },
    defaultColDef: {
      resizable: true, //是否可以调整列大小，就是拖动改变列大小
    },
    suppressPaginationPanel: true, // 自定义分页
    rowSelection: 'multiple', // 设置多行选中
    suppressRowClickSelection: true,
    onGridReady: function (params) {
      gridOptions.columnApi.applyColumnState({ state: JSON.parse(window.localStorage.getItem("beforedispatchtowhAuditOrderColumn")) });
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
    },
    //单击单元格触发的事件
    onCellClicked: function (event) {
      //event.data 选中的行内数据，event.event 为鼠标事件
      handleTableAuditOptions(event)
    },
    onCellMouseDown: function (event) {
      timeAuditStamp = event.event.timeStamp
    },
    onCellDoubleClicked: function (event) {
      // console.log(event)
      let headername = event.colDef.headerName, value = ''
      if (headername == '物流') {
        value = `买家：${event.data.buyerRequireShippingType || ""}，发货：${event.data.logisTypeName || ""}，跟踪号：${event.data.logisAgentTrackingNo || ""}`
        layui.admin.onlyCopyTxt(value)
      }
      if (headername == '订单处理') {
        value = `仓库：${event.data.warehouseName || ""}，批次：${event.data.pickBatchNo || ""}，备注：`
        layui.admin.onlyCopyTxt(value)
      }
    }
  };

  let gridAuditDiv = document.querySelector('#beforedispatchtowh_auditTable');
  agGrid.LicenseManager.setLicenseKey(
    "IRDEVELOPERS_COM_NDEwMjM0NTgwMDAwMA==f08aae16269f416fe8d65bbf9396be5f");
  new agGrid.Grid(gridAuditDiv, gridOptions);

  var timeAuditStamp;
  function handleTableAuditOptions (event) {
    console.log(event.event)
    let optionEvent = event.event.target.name,
      data = event.data;// 获取选中行数据
    if (optionEvent === "toAuditOrder_remark") { //备注
      commonDirectMailRemark(data, gridOptions);
    } else if (optionEvent === "toAuditOrder_modify") { //编辑订单
      loading.show()
      requestDetailedData(data.id).then(res => {
        data.orderDetails = res.orderDetails
        data.orderDetails = data.orderDetails.sort(function (a, b) {
          return a.availableStock - b.availableStock;
        });
        console.log('修改订单 待审核===')
        toAuditOrderNewandEdit('2', data)
      })
    } else if (optionEvent === "toAuditOrder_demolition") { //拆单
      requestDetailedData(data.id).then(res => {
        data.companyName = res.companyName
        data.orderDetails = res.orderDetails
        data.orderDetails = data.orderDetails.sort(function (a, b) {
          return a.availableStock - b.availableStock;
        });
        if (data.operOrderType == "0") { //原始订单
          originOrderDemolimotion(data)
        } else if (data.operOrderType == "1") { //拆出订单，不允许拆单
          //layer.msg('当前订单为拆出订单，不允许再拆单', {icon:0})
          originOrderDemolimotion(data)
        } else if (data.operOrderType == "2") { //合并拆单，只能恢复合并前订单
          layer.confirm('当前订单为合并订单，是否恢复原订单?', function (index) {
            toAuditOrder_mergeDemolition(data.id)
          });
        } else if (data.operOrderType == "3") { //重寄订单
          layer.msg('重寄订单不允许拆单', { icon: 7 });
        }
      });
    } else if (optionEvent === "toAuditOrder_issueRefund") { //
      orderIssueRefund(data, function () {
      });
    } else if(optionEvent === 'logisCost'){
      //物流成本
      commonLogisCostLayerHandle(data.id);
    }else if(optionEvent === 'connectchatbuyer'){
      // 联系买家
      commonOrderConnectChatBuyer(data)
    }else if(optionEvent === 'jumpToPlatformOrder'){
      // 跳转到平台后台订单详情
      commonJumpPlatformOrderDetail(data)
    }else if (event.event.timeStamp - timeAuditStamp < 300) {
      data.showLogisAttrList = true;
      data.showSale = true;
      // data被修改了？
      commonOrderDetailFn(data, gridOptions, 'toAuditOrder');
    }
    return false;
  }

  //渲染表格数据
  function toAuditOrderTableorder (searchData) {
    commonReturnPromiseRes({
      url: ctx + '/unauditorder/listorder.html',
      type: 'POST',
      params: searchData
    }).then(function (result) {
      //待审核页签选中,其他页签取消选中
      $('#LAY-beforedispatchtowh #beforedispatchtowh_tabs').find('li').removeClass('layui-this');
      $('#LAY-beforedispatchtowh #beforedispatchtowh_tabs').find('li[data-index=audit]').addClass('layui-this');
      beforedispatchtowh_auditPage(searchData, result.count)
      immutableStore = result.data
      gridOptions.api.setRowData(immutableStore)

      // 渲染tab中的count数，复制原来的--start
      var tab = $('#LAY-beforedispatchtowh #beforedispatchtowh_auditStatusTabs').find('.layui-this')
      getAuditAllTabNum(searchData)
      toAudit_formdata = searchData
      // if (!isObjectValueAuditEqual(searchData, toAudit_formdata)) {
      //   getAuditAllTabNum(searchData)
      //   toAudit_formdata = searchData
      // }
      if (tab.length > 0) {
        tab.find('span').text(result.count)
      } else {
        $('#LAY-beforedispatchtowh #beforedispatchtowh_auditStatusTabs').find('li[data-index="' + searchData.unAuditOrderStatus + '"]').addClass('layui-this').find('span').text(result.count)
      }
      // 复制原来的--end

    }).catch(function (err) {
      layer.msg(err, { icon: 2 });
    })
  }

  //渲染页面分页
  function beforedispatchtowh_auditPage (data, count) {
    laypage.render({
      elem: 'beforedispatchtowh_auditPage',
      curr: data.page,
      limit: data.limit,
      limits: [5000, 10000, 20000],
      layout: ['prev', 'page', 'next', 'count', 'limit'],
      count: count,
      jump: function (obj, first) {
        $('#toAuditOrderForm input[name="limit"]').val(obj.limit);//保障下次的分页请求中带有的值正确
        $('#toAuditOrderForm input[name="page"]').val(obj.curr);//保障下次的分页请求中带有的值正确
        //首次不执行
        if (!first) {
          data.page = obj.curr;
          data.limit = obj.limit;
          $('#beforedispatchtowhSearch').click()
        }

      }
    });
  }
  // 页面数据请求----------------------------------------
  function isObjectValueAuditEqual (a, b) {
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
      if ((propName != "unAuditOrderStatus") && a[propName] !== b[propName]) {
        return false;
      }
    }
    return true;
  }

  //修改订单
  function toAuditOrderNewandEdit (type, data) {
    let nameData = data || {}
    edit_order_tableIns = null;
    var concatData = []
    var obj = { '1': '新增订单', '2': `修改订单 - ${nameData.id || ''}` }
    // 国家列表
    const shippingCountryCodeList = toAuditOrder_pageEnum.shippingCountryCodes.map(item => ({
      ...item,
      name: item.value + "(" + item.name + ")",
      shippingCountryCode: item.name,
      shippingCountryName: item.enFullValue,
      shippingCountryCnName: item.value,
    }))
    layer.open({
      type: 1,
      title: obj[type],
      btn: ['保存', '取消'],
      area: ['90%', '85%'],
      // maxmin: true,
      move: false,
      id: 'pop_toAuditOrder_newandeditorder_id',
      content: $('#pop_toAuditOrder_newandeditorder').html(),
      success: function (layero, index) {
        if (type == 1) {
          $(layero).find(".logHide").addClass('hide')
          //ztt20230828-插入[下载模板][批量上传]按钮
          let btnStr= `<div style="position: absolute;bottom: 14px;left: 10px;">
          <span class="layui-btn layui-btn-sm" onclick="javascript: window.open('${ctx}/static/excel/批量导入订单模板.xlsx');">下载模板</span>
          <span class="layui-btn layui-btn-sm" id="toAuditOrderBatchUpload">批量上传</span></div>`;
          layero.append(btnStr);
        } else {
          $(layero).find(".logHide").removeClass('hide')
          //店铺单号platOrderId,平台platCode,店铺storeAcctId,站点siteId都不能编辑
          layero.find('input[name=platOrderId]').prop('disabled', true);
          layero.find('select[name=platCode]').removeAttr('lay-search').prop('disabled', true);
          layero.find('select[name=storeAcctId]').removeAttr('lay-search').prop('disabled', true);
          layero.find('select[name=siteId]').removeAttr('lay-search').prop('disabled', true);
        }
        // 计算原利润
        let profit = (data.platOrderAmt - data.platFee - data.otherFee) * data.exchangeRate - data.prodCost - (data.outerPackCost || 0) - data.shippingCost;
        $('#originProfit').text(profit.toFixed(4))
        
        // 物流方式没有时 则不展示修改后利润
        if (data.logisTypeId) {
          $('#updateProfitBox').show()
        } else {
          $('#updateProfitBox').hide()
        }
        $(layero).on('click', '.refresh_profit', function () {
          let param = {};
          param = serializeObject($('#toAuditOrder_editForm'));
          param.logisTrackingNo = param.logisTrackingNo.trim();
          param.orderTimeCn = new Date(param.orderTimeCn).getTime();
          edit_order_tableIns ? param.platOrderDetails = toAuditGetEditTableData(concatData, edit_order_tableIns) :
          param.platOrderDetails = []
          const { shippingCountryCode } = param
          const curCountry = shippingCountryCodeList.filter(item => item.shippingCountryCode === shippingCountryCode)[0]
          if (curCountry) {
            param.shippingCountryCnName = curCountry.shippingCountryCnName
            param.shippingCountryName = curCountry.shippingCountryName
          }
          param.platCode = layero.find('select[name=platCode]').val()
          param.storeAcctId = layero.find('select[name=storeAcctId]').val()
          param.siteId = layero.find('select[name=siteId]').val()
          param.platOrderId = layero.find('input[name=platOrderId]').val()
          console.log('params', param)
          if (param.platOrderDetails.length > 0) {
            const validOptions = comVertifyPlatOrderDetails(param.platOrderDetails)
            if (!validOptions) {
              return;
            }   
            getOrderProfit(param, function(res) {
              let result = res.data
              if (!!Object.keys(result).length) {
                let profitRes = (result.platOrderAmt - result.platFee - result.otherFee) * result.exchangeRate - result.prodCost - (result.outerPackCost || 0) - result.shippingCost;
                $('#updateProfit').text(profitRes.toFixed(4))
              }
            })
          }
        })
        commonOrderGetLogisticAjax().then(logisTypeArr => {
          var id = data ? data.id : ""
          var isSavable = $('#order_savebtn')
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
          appendSelect($('#toAuditOrder_editForm').find('select[name="platCode"]'), toAuditOrder_pageEnum.platCode, 'name', 'value')
          appendSelect($('#toAuditOrder_editForm').find('select[name="storeAcctId"]'), [], 'id', 'storeAcct', '', 'salesSite')
          // appendSelect($('#toAuditOrder_editForm').find('select[name="platOrderStatusList"]'), toAuditOrder_platOrderStatus, 'platOrderStatus', 'platOrderStatus')
          appendSelect($('#toAuditOrder_editForm').find('select[name="warehouseId"]'), toAuditOrder_pageEnum.prodWarehouses, 'name', 'value')

          appendSelect($('#toAuditOrder_editForm').find('select[name="logisTypeId"]'), logisTypeArr, 'id', 'name')
          form.render('select');

          appendSelect($('#toAuditOrder_editForm').find('select[name="siteId"]'), toAuditOrder_Site, 'code', 'name')
          appendSelect($('#toAuditOrder_editForm').find('select[name="currency"]'), toAuditOrder_Currency, 'code', 'name')
          appendSelect($('#toAuditOrder_editForm').find('select[name="shippingCountryCode"]'), shippingCountryCodeList, 'shippingCountryCode', 'name')
          // 备注类型
          appendSelect($('#toAuditOrder_editForm').find('select[name="noteType"]'), toAuditOrder_pageEnum.orderLabels_toAuditOrder, 'label', 'label')
          if (data) {
            data.orderTimeCn = Format(data.orderTimeCn, 'yyyy-MM-dd hh:mm:ss')
            form.val("toAuditOrder_editForm", data);
            let temArr = data.orderDetails ? data.orderDetails[0] : {}
            Selected($('#toAuditOrder_editForm select[name="platCode"]'), temArr.platCode)
            getAuditStoreByPlatformAndRoleName(temArr.platCode, function (returnData) {
              appendSelect(
                $("#toAuditOrder_editForm").find('select[name="storeAcctId"]'),
                returnData.data,
                "id",
                "storeAcct",
                "",
                "salesSite"
              )
              Selected(
                $('#toAuditOrder_editForm select[name="storeAcctId"]'),
                data.storeAcctId
              )
              toAuditOrderSiteByStore(data.siteId)
            });
            data.orderDetails = (data.orderDetails || []).sort(function (a, b) {
              return a.availableStock - b.availableStock;
            });
            concatData = data.orderDetails
            edit_order_tableIns = toAuditProdTableRender(concatData)
          }
          form.render()
          form.on('select(edit_storeAcct)', function (obj) {
            toAuditOrderSiteByStore()
          })
          if (type === '2') {
            // 修改订单
            //监听物流方式下拉选择
            form.on('select(edit_logisTypeId)', function (obj) {
              $('#toAuditOrder_editForm input[name=logisTrackingNo]').val('')
            })
          }
          //监听平台下拉选择
          form.on('select(edit_platCode)', function (obj) {
            getAuditStoreByPlatformAndRoleName(obj.value, function (returnData) {
              appendSelect($('#toAuditOrder_editForm').find('select[name="storeAcctId"]'), returnData.data, 'id', 'storeAcct', '', 'salesSite')
              form.render()
            })
            getAuditAllSite(obj.value, function (returnData) {
              appendSelect($('#toAuditOrder_editForm').find('select[name="siteId"]'), returnData.data, 'code', 'name')
              form.render()
            })
          })
          $('#toAuditOrder_addProducts').click(function () {
            var orginaldata = data ? toAuditGetEditTableData(concatData, edit_order_tableIns) : []
            var prodSku = $(this).siblings('input').val();
            if (prodSku !== "") {
              getAuditProductList(prodSku, function (returnData) {
                toauditorderAddprod(returnData, function (callback) {
                  // callback = callback.map(function (item) {
                  //     item.imageUrl = item.image
                  //     return item
                  // });
                  console.log('callback数组', callback);
                  concatData = orginaldata ? orginaldata.concat(callback) : [].concat(callback)
                  edit_order_tableIns = toAuditProdTableRender(concatData)
                })
              })
            } else {
              layer.msg('添加商品sku不能为空')
            }
          })
          $(layero).on('click', '.refresh_icon', function () {
            var dataArr = [];
            var prodSSku = $(this).parents('tr').find('[data-field=prodSSku] input').val(),
              prodQuantity = $(this).parents('tr').find('[data-field=prodQuantity] input').val(),
              platOrderDetailAmt = $(this).parents('tr').find('[data-field=platOrderDetailAmt] input').val(),
              warehouseId = $('#toAuditOrder_editForm').find('select[name="warehouseId"]').val();
            dataArr.push({
              "prodSSku": prodSSku,
              "prodQuantity": prodQuantity,
              "platOrderDetailAmt": platOrderDetailAmt,
              "warehouseId": warehouseId
            });
            var prodskus = $(this).siblings('input').val()
            var index = $(this).parents('tr').attr("data-index")
            if (prodskus !== "") {
              toAuditOrder_getProdInfoByprodsku(dataArr, function (returnData) {
                var data = concatData[index]
                var newdata = returnData.data[0]
                concatData[index] = Object.assign(data, newdata)
                edit_order_tableIns = toAuditProdTableRender(concatData)
              })
            } else {
              layer.msg('请填写sku')
            }
          })
          loading.hide()
          //监听input失去焦点
          layero.find('input[name=logisTrackingNo]').on('blur', function (e) {
            let val = e.target.value;
            e.target.value = val.replaceAll(" ", "");
          });
        });
        //ztt20230828-监听批量上传按钮点击事件
        layui.upload.render({
          elem: '#toAuditOrderBatchUpload', //绑定元素
          url: `${ctx}/unauditorder/importNewOrder`, //上传接口
          accept: 'file', //允许上传的文件类型
          exts: 'xlsx',
          before: function(){
            loading.show();
          },
          done: function(res) {
              loading.hide();
              if(res.failNum > 0){
                layui.admin.batchResultAlert("批量上传结果:", res, function () {
                });
              }else{
                //全部成功,只展示成功数据
                layui.admin.batchResultSuccessAlert("批量上传结果:", res, function () {
                });
              }
          },
          error: function() {
            loading.hide();
            layer.msg('服务器出现故障!');
          }
        });
      },
      yes: function (index, layero) {
        form.on('submit(edit_submit)', function (obj) {
          const param = obj.field;
          param.logisTrackingNo = param.logisTrackingNo.trim();
          param.orderTimeCn = new Date(param.orderTimeCn).getTime();
          edit_order_tableIns ? param.platOrderDetails = toAuditGetEditTableData(concatData, edit_order_tableIns) :
            param.platOrderDetails = []
          const { shippingCountryCode } = param
          const curCountry = shippingCountryCodeList.filter(item => item.shippingCountryCode === shippingCountryCode)[0]
          if (curCountry) {
            param.shippingCountryCnName = curCountry.shippingCountryCnName
            param.shippingCountryName = curCountry.shippingCountryName
          }
          if (param.platOrderDetails.length > 0) {
            const validOptions = comVertifyPlatOrderDetails(param.platOrderDetails)
            if (!validOptions) {
              return;
            }
            savetoAuditOrders(param, function (returnData) {
              if (type == 2) {
                layer.msg(returnData.msg || '保存成功', { icon: 1 });
              } else {
                if (returnData.data) {
                  layer.alert(`新增订单号为:${returnData.data}`);
                } else {
                  layer.msg(returnData.msg || '保存成功', { icon: 1 });
                }

              }
              // let prodQuantity = 0
              // param.platOrderDetails.forEach(v => {
              //   prodQuantity += v.prodQuantity * 1
              // })
              // $('#beforedispatchtowh_auditTable').next().find('#toAudit_table_storeAcct').text($(layero).find('#edit_storeAcct option:selected').text())
              // $('#beforedispatchtowh_auditTable').next().find('#toAudit_table_platOrderId').text(param.platOrderId)
              // $('#beforedispatchtowh_auditTable').next().find('#toAudit_table_platOrderAmt').text(param.platOrderAmt)
              // $('#beforedispatchtowh_auditTable').next().find('#toAudit_table_skuQuantity').text(param.platOrderDetails.length)
              // $('#beforedispatchtowh_auditTable').next().find('#toAudit_table_prodQuantity').text(prodQuantity)
              // $('#beforedispatchtowh_auditTable').next().find('#toAudit_table_shippingUsername').text(param.shippingUsername)
              // $('#beforedispatchtowh_auditTable').next().find('#toAudit_table_buyerRequireShippingType').text(param.buyerRequireShippingType)
              // $('#beforedispatchtowh_auditTable').next().find('#toAudit_table_orderTimeCn').text(Format(param.orderTimeCn || "", 'yyyy-MM-dd hh:mm:ss'))
              // $('#beforedispatchtowhSearch').click();
              
              //待审核状态更新行
              updateSingleRow_toAuditOrder(param.id);
              layer.close(index)
            })
          } else {
            layer.msg('请添加商品')
          }
        });
        $(layero).find('#edit_submit').click();
      },
      end: function () {
      }
    })
  }
  // 站点随店铺联动查询
  function toAuditOrderSiteByStore (initSiteId = "") {
    const siteStr = $("#toAuditOrder_editForm")
      .find('select[name="storeAcctId"] option:selected')
      .data()?.salessite
    const _site = siteStr ? siteStr.toString().split(",") : []
    const _platCode = $("#toAuditOrder_editForm")
      .find('select[name="platCode"]')
      .val()
    getAuditAllSite(_platCode, function (returnData) {
      const res = returnData.data.filter((item) =>
        _site.some((elem) => elem == item.code)
      )
      appendSelect(
        $("#toAuditOrder_editForm").find('select[name="siteId"]'),
        res,
        "code",
        "name"
      )
      initSiteId &&
        Selected(
          $("#toAuditOrder_editForm").find('select[name="siteId"]'),
          initSiteId
        )
      form.render()
    })
  }

  //渲染商品信息表格
  function toAuditProdTableRender (data) {
    data.forEach(item => {
      if (item.prodSSku == '') {
        item.isSale = null;
        item.prodSSku = ''
        item.stockLocation = ''
        item.availableStock = ''
        item.prodQuantity = ''
        item.allCount = ''
      }
    })
    tableIns = table.render({
      elem: '#toAuditOrder_product_table',
      id: 'toAuditOrder_product_table',
      data: data || [],
      cols: [
        [
          { title: "图片", field: "imageUrl", templet: "#toAuditOrder_detail_img_tpl" },
          { title: "Item_ID", field: "itemId", templet: "#toAuditOrder_edit_ListingID" },
          { title: "商品SKU", field: "prodSSku",sort:true,templet:"#toAuditOrder_edit_Prodsku",width:150},
          { title: "店铺SKU", field: "storeSSku",sort:true, templet: "<div><div name='storeSSku'>{{d.storeSSku||''}}</div>" },
          { title: '可用库存', field: "availableStock",sort:true, width: 60, templet: '<div><span style="font-weight:700;font-size:24px;color:#f00;">{{d.availableStock}}</span></div>' },
          { title: "平台数量", field: "platQuantity", width: 60 },
          { title: '商品数量', field: "prodQuantity", templet: "#toAuditOrder_edit_prodQuantity" },
          { title: '商品总量', field: "allCount",sort:true, width: 60},
          { title: '销售金额', field: "platOrderDetailAmt", templet: "#toAuditOrder_edit_platOrderDetailAmt",width:100 },
          {title: '商品价格',field: "prodPrice", templet: '#toAuditOrder_edit_platOrderProdPrice', width: 120},
          {title: '商品信息',field: "prodInfo", templet: '#toAuditOrder_edit_platOrderProdInfo', width: 140},
          { title: "入库要求", field: "packDesc" },
          {title: '订单信息',field: "orderInfo", templet: '#toAuditOrder_edit_platOrderOrderInfo', width: 180},
          { title: '操作', toolbar: "#toAuditOrder_edit_option", width: 80 }
        ]
      ],
      page: false,
      limit: 300,
      done: function (res) {
        let newArr = delSameObjValue(layui.table.cache.toAuditOrder_product_table, 'allCount', ['prodSSku'], ['prodQuantity']);
        layui.table.cache.toAuditOrder_product_table.forEach((item, index) => {
          newArr.forEach(cItem => {
            if (item.prodSSku == cItem.prodSSku) {
              item.allCount = cItem.allCount
            }
          })
          $("#toAuditOrder_product_table").next().find(`tr[data-index=${index}] td[data-field=allCount] div`).text(res.data[index].allCount)
        })
        toAuditOrderStyle('toAuditOrder_product_table')
        imageLazyload();
        table.on("tool(toAuditOrder_product_table)", function (obj) {
          if (obj.event = "edit_prod_delete") {
            layer.confirm('请确认是否删除子订单所有信息', {
              title: '提示',
              icon: 3,
              btn: ['确定', '取消'] //按钮
            }, function (layerIndex) {
              if (obj.data && obj.data.platDetailTranscationId) {
                return layer.msg('该子订单非手动添加，不支持删除')
              } else if (obj.data && obj.data.platQuantity !== undefined && obj.data.platQuantity != '0') {
                return layer.msg('该子订单非手动添加，不支持删除')
              }
              var index = getIndex('id', data, obj.data.id)
              data.splice(index, 1)
              obj.del();
              layer.close(layerIndex)
            });
          }
        })
      }
    })
    return tableIns
  }

  //监听排序
  table.on('sort(toAuditOrder_product_table)', function (obj) {
    toAuditOrderStyle('toAuditOrder_product_table')
  });
  //监听排序
  table.on('sort(toAuditOrder_demolition_original_table)', function (obj) {
    toAuditOrderStyle('toAuditOrder_demolition_original_table')
  });

  function toAuditOrderStyle (id) {
    layui.table.cache[id].forEach((item, index) => {
      // 商品总量大于可用库存时，标红加粗
      if (item.allCount > item.availableStock && item.holdStock <= 0) {
        id == 'toAuditOrder_demolition_original_table' ? $("#" + id).next().find(`tr[data-index=${index}] td[data-field=platQuantity] div`).addClass('orderRedStyle') : '';
        id == 'toAuditOrder_demolition_original_table' ? $("#" + id).next().find(`tr[data-index=${index}] td[data-field=prodQuantity] div`).addClass('orderRedStyle') : '';
        $("#" + id).next().find(`tr[data-index=${index}] td[data-field=availableStock] div`).addClass('orderRedStyle');
        $("#" + id).next().find(`tr[data-index=${index}] td[data-field=allCount] div`).addClass('orderRedStyle');
      }
      if (item.platQuantity == 0) {
        id == 'toAuditOrder_demolition_original_table' ? $("#" + id).next().find(`tr[data-index=${index}] td[data-field=platQuantity]`).css('background', '#fab81c') : '';
      }
    })
  }

  //获取编辑表格数据
  function toAuditGetEditTableData (data, tableIns) {
    var layFilterIndex = 'LAY-table-' + tableIns.config.index;
    var tableContainer = $('div[lay-filter="' + layFilterIndex + '"]');
    tableContainer.find('tr').each(function (index, item) {
      if (index > 0) {
        data[index - 1].itemId = $(item).find('td[data-field="itemId"] input').val()
        data[index - 1].storeSSku = $(item).find('td[data-field="storeSSku"] div[name=storeSSku]').text()
        data[index - 1].prodSSku = $(item).find('td[data-field="prodSSku"] input').val()
        data[index - 1].platUnitPrice = $(item).find('td[data-field="platUnitPrice"] input').val()
        data[index - 1].platQuantity = $(item).find('td[data-field="platQuantity"] input').val()
        data[index - 1].prodQuantity = $(item).find('td[data-field="prodQuantity"] input').val()
        data[index - 1].platOrderDetailAmt = $(item).find('td[data-field="platOrderDetailAmt"] input').val()
        data[index - 1].status = true
      }
    });
    return data;
  }

  // 添加商品
  function toauditorderAddprod (data, func) {
    layer.open({
      type: 1,
      title: '添加商品',
      btn: ['添加商品', '关闭'],
      area: ['70%', '60%'],
      content: $('#pop_toAuditOrder_addProducts').html(),
      id: 'pop_toAuditOrder_addProductsId',
      success: function (layero, index) {
        table.render({
          elem: '#toAuditOrder_addProducts_table',
          data: data.data,
          cols: [
            [
              { checkbox: true, width: 30 },
              { title: "图片", field: "imageUrl", templet: "#add_product_img" },
              { title: "商品数量", templet: "#add_product_prodQuantity" },
              { title: "销售金额", templet: "#add_product_platOrderDetailAmt" },
              { title: "商品状态", field: "isSale", templet: function (d) { return d.isSale ? '在售' : '停售' } },
              { title: "商品sku", field: "sSku" },
              { title: "父sku", field: "", templet: "#add_product_psku" },
              { title: "商品名称", field: "title" },
              { title: "款式", field: "style" }
            ]
          ],
          page: true,
          limit: 100,
          limits: [100, 300, 500],
          id: 'toAuditOrder_addProducts_table',
          done: function (res) {
            imageLazyload();
          }
        })
      },
      yes: function (index, layero) {
        var trs = layero.find('.layui-table-body tbody>tr');
        var dataArr = [];
        console.log('仓库', $('#toAuditOrder_editForm').find('select[name="warehouseId"]').val());
        for (var i = 0; i < trs.length; i++) {
          var tr = trs[i];
          if ($(tr).find('.layui-unselect.layui-form-checkbox.layui-form-checked').length != 0) {
            var prodSSku = $(tr).find('[data-field="sSku"] div').text(),
              prodQuantity = $(tr).find('input[name=prodQuantity]').val(),
              platOrderDetailAmt = $(tr).find('input[name=platOrderDetailAmt]').val(),
              warehouseId = $('#toAuditOrder_editForm').find('select[name="warehouseId"]').val();
            dataArr.push({
              "prodSSku": prodSSku,
              "prodQuantity": prodQuantity,
              "platOrderDetailAmt": platOrderDetailAmt,
              "warehouseId": warehouseId
            });
          }
        };
        if (dataArr.length == 0) {
          layer.msg("请选择需要提交的数据")
          return;
        }
        toAuditOrder_getProdInfoByprodsku(dataArr, function (returnData) {
          var data = returnData.data.map(function (item) {
            item.storeSSku = item.prodSSku
            return item
          })
          if (func) {
            func(data)
          }
          layer.close(index)
        })
      },
    })
  }
  // 排序
  function toAuditOrder_sortBy (props) {
    return function (a, b) {
      return a[props] - b[props];
    }
  }

  // 原始订单拆单弹框
  function originOrderDemolimotion (data) {
    var isDemolitRow = []
    var orderDetails = data.orderDetails;
    data.orderDetails && data.orderDetails.sort(toAuditOrder_sortBy('availableStock'));
    data.orderDetails.forEach((item,index) => {
      //ztt20230912-数据结构中增加prodCost,costPrice
      item.costPrice = data.costPrice || 0;
      item.prodCost = data.prodCost || 0;
    });
    layer.open({
      type: 1,
      title: '订单拆分',
      btn: ['拆分', '关闭'],
      area: ['100%', '80%'],
      content: $('#pop_toAuditOrder_demolition_original').html(),
      success: function (layero, index) {
        demolitiontableIns = table.render({
          elem: '#toAuditOrder_demolition_original_table',
          data: data.orderDetails,
          totalRow: true,
          cols: [
            [
              { title: "商品信息", field: "prodSSku", sort: true, templet: "#orginal_order_products", width: 300 },
              // { title: "可用库存", field: "itemId", templet: "#orginal_order_stock" },
              { title: "子店铺单号", field: "platOrderItemId" },
              { title: "子订单类型", field: "platOrderDetailType" },
              { title: "子订单状态", field: "platOrderDetailStatus" },
              { title: "总重量(g)", field: "prodWeight", templet: "#orginal_order_demolition", totalRow: true },
              { title: "销售金额", field: "platOrderDetailAmt", totalRow: true },
              { title: "物流属性", field: "prodLogisAttrList" },
              { title: "sku重量(g)", field: "prodUnitWeight" },
              { title: "可用库存", field: "availableStock", sort: true },
              // ,templet: '#toAuditOrder_orginal_order_availableStock'
              { title: "平台数量", field: "platQuantity" },
              { title: "商品数量", field: "prodQuantity" },
              // , templet: '#toAuditOrder_orginal_order_prodQuantity'
              { title: "商品总量", field: "allCount", sort: true },
              { title: "成本占比", templet: "#toAuditOrder_costRatio",width: 130 },
              // , templet: '#toAuditOrder_orginal_order_allCount'
              { title: "拆分数量", templet: "#orginal_order_number" },
              { title: "拆分重量(g)", field: "prodSSkuWeight", templet: "#orginal_order_dynamicWeight", totalRow: true },
              { title: "拆分金额", field: "splitCost", templet: "#orginal_order_dynamicMoney", totalRow: true },
            ]
          ],
          height: 480,
          page: true,
          limit: 500,
          limits: [200, 500],
          id: 'toAuditOrder_demolition_original_table',
          done: function (res) {
            let newArr = delSameObjValue(layui.table.cache.toAuditOrder_demolition_original_table, 'allCount', ['prodSSku'], ['prodQuantity']);
            layui.table.cache.toAuditOrder_demolition_original_table.forEach((item, index) => {
              newArr.forEach(cItem => {
                if (item.prodSSku == cItem.prodSSku) {
                  item.allCount = cItem.allCount
                }
              })
              $("#toAuditOrder_demolition_original_table").next().find(`tr[data-index=${index}] td[data-field=allCount] div`).text(res.data[index].allCount)
            })
            toAuditOrderStyle('toAuditOrder_demolition_original_table')
            form.render()
            imageLazyload();
            //总计展示
            originOrderDemolimotionTotalHandle(layero);
            //监听tr的input变化
            originOrderDemolimotionTbodyHandle(layero, data);
          }
        })
      },
      yes: function (index, layero) {
        var trs = layero.find('.layui-table-body tbody>tr');
        var dataArr = [];
        for (var i = 0; i < trs.length; i++) {
          var tr = trs[i];
          var orderDetail = orderDetails[i];
          var orderDetailId = orderDetail.id;
          var demolitionQuality = $(tr).find('input[name=demolitionQuality]').val();
          dataArr.push({ orderDetailId: orderDetailId, prodQuantity: demolitionQuality });
        };
        dataArr = dataArr.filter((value) => value.prodQuantity)
        const turnToAbnormalOrderTag = $('#toAuditOrder_demolition_original_abnormal').prop('checked')
        const turnToAbnormalOrder = $('#toAuditOrder_demo_original_abnormal').prop('checked')
        commonReturnPromise({
          type: 'post',
          url: '/lms/unauditorder/splitorder.html',
          contentType: 'application/json',
          params: JSON.stringify({
            id: data.id,
            orderSplitDetailDtos: dataArr
          })
        }).then(res => {
          if (!turnToAbnormalOrderTag && !turnToAbnormalOrder) {
            layer.msg('操作成功', { icon: 1 });
            layer.close(index);
            updateSingleRow_toAuditOrder(data.id)
          } else if (turnToAbnormalOrderTag) {
            initAjax('/unauditorder/markabnormal.html', 'post', { ids: res }, function (returnData) {
              const { failResults, successResults } = returnData.data
              let str = ''
              if (successResults.length) {
                let trackReg = /(?<=(\[))\w+(?=(\]))/g;
                let abnormalorderList = []
                successResults.forEach(item => {
                  abnormalorderList.push(item.match(trackReg)[0])
                })
                str = `拆分订单{${abnormalorderList.join('、')}}已转至其他异常单`
              } else {
                str = failResults.join('\n')
              }
              layer.alert(str, { icon: successResults.length ? 1 : 7 }, function () {
                layer.closeAll()
                updateSingleRow_toAuditOrder(data.id)
              })

            }, 'application/x-www-form-urlencoded')
          } else if (turnToAbnormalOrder) {
            initAjax('/abnormalorder/tocancel.html', 'post', { ids: res }, function (returnData) {
              layer.close(index);
              layui.admin.batchResultAlert(`拆除订单{${res}}已转至取消订单:`, returnData.data, function (errIdsArr) {
                // $('#beforedispatchtowhSearch').trigger('click');
                updateSingleRow_toAuditOrder(data.id)
              });
            }, 'application/x-www-form-urlencoded');
          }
        }).catch(err => {
          layer.msg(err, { icon: 2 });
        })

      },
    })
  }
  function originOrderDemolimotionTotalHandle (layero) {
    //总计文字展示
    layero.find('.layui-table-total td[data-field=prodSSku]>div').html('<b>总计</b>');
    //重量求和
    let $tr = layero.find('.layui-table-box .layui-table-body tr');
    let totalWeight = 0;
    for (let i = 0; i < $tr.length; i++) {
      let tr = $tr[i];
      let prodWeight = $(tr).find('td[data-field=prodWeight]>div').text();
      totalWeight += Number(prodWeight);
    }
    layero.find('.layui-table-total td[data-field=prodWeight]>div').html(totalWeight.toFixed(2));
  }
  function originOrderDemolimotionTbodyHandle (layero, res) {
    layero.on('change', 'input[name=demolitionQuality]', function (event) {
      let $parentTr = $(this).parents('tr');
      // 判断是否有拆单确认弹窗
      // 线上物流：SMT物流、虾皮、Lazada、Joom线上   true
      // 未勾选“拆出订单转取消订单”  false
      // （平台数量＜商品数量 and 拆分数量<商品数量）or（item_id有多行 and 至少有一行的平台数量 = 0）
      let companyName = res.companyName
      let companyFlag = ['SMT物流', '虾皮', 'Lazada', 'Joom线上', '待处理订单'].includes(companyName)
      let turnToAbnormalOrder = $('#toAuditOrder_demo_original_abnormal').prop('checked')
      let platCount = $parentTr.find('td[data-field=platQuantity]>div').text() // 平台数量
      let itemCount = $parentTr.find('td[data-field=prodQuantity]>div').text() // 商品数量
      if (event.target.value == '') return
      let splitCount = Number(event.target.value) // 拆分数量

      let platZero = res.orderDetails.filter(item => item.platQuantity === 0)
      let val = event.target.value;
      if (companyFlag && !turnToAbnormalOrder && ((Number(platCount) < Number(itemCount) && Number(splitCount) < Number(itemCount)) || (res.orderDetails.length > 1 && platZero?.length > 0))) {
        // 显示弹窗
        layer.confirm('拆出订单无法使用线上物流发货，请确认是否继续？', {
          cancel: function () {
            $parentTr.find('td[data-field=prodSSkuWeight]>div').html('')
            $parentTr.find('td[data-field=splitCost]>div').html('')
            $parentTr.find('[name=demolitionQuality]').focus().select()
          }
        }, function (index) {
          handleSplit(val, $parentTr, layero)
          layer.close(index);
        }, function () {
          $parentTr.find('td[data-field=prodSSkuWeight]>div').html('')
          $parentTr.find('td[data-field=splitCost]>div').html('')
          $parentTr.find('[name=demolitionQuality]').focus().select()
        })
      } else {
        handleSplit(val, $parentTr, layero)
      }
    });
  }

  function handleSplit (val, $parentTr, layero) {
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
    for (let i = 0; i < $tr.length; i++) {
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



  //平台操作
  $("#toAuditOrder_cancelOrderEbay").click(function () {
    //获取选中的订单id
    let data = gridOptions.api.getSelectedRows();
    var ids = (data || []).map(function (item) {
      return item.id
    })
    if (!ids || ids.length <= 0) {
      layer.msg("未选择订单", { icon: 0 });
      return;
    }
    layer.open({
      type: 1,
      title: '取消ebay订单',
      btn: ['确认', '取消'],
      content: "loading",
      success: function (layero, index) {
        $(layero).find('.layui-layer-content').html($("#toAuditOrder_cancelEbayTpl").html());
        layui.form.render();
      },
      yes: function (index, layero) {
        var cancelReason = $("#toAuditOrder_cancelEbayForm input[name=cancelReason]:checked").val();
        //ebay取消订单
        initAjax('/unauditorder/cancelorder/ebay.html', 'post', { ids: ids.join(","), cancelReason: cancelReason }, function (returnData) {
          layui.admin.batchResultAlert("ebay取消订单完成:", returnData.data, function (errIdsArr) {
            deleteTableRow_toAuditOrder(ids, errIdsArr)
          });
          layer.close(index);
        }, 'application/x-www-form-urlencoded')
      }
    })
  });

  // amazon 邮件
  $("#toAuditOrder_amazonEmail").on("click", function () {
    orderAmazonEmail(gridOptions)
  })

  // ebay 邮件
  $("#toAuditOrder_eBayEmail").on("click", function () {
    orderEbayEmail(gridOptions)
  })

  // shopee发送消息
  $("#toAuditOrder_eBayEmail").on("click", function () {
    orderEbayEmail(gridOptions)
  })

  //获取选择的订单id
  function getAuditTableSelectIds () {
    let data = gridOptions.api.getSelectedRows();
    var ids = (data || []).map(function (item) {
      return item.id
    });
    return ids;
  }
  //动态添加页签
  function appendAuditTab (data) {
    var html = ""
    for (var i in data) {
      if (data[i].name === '1') {
        html += '<li class="layui-this" data-index="' + data[i].name + '">' + data[i].value + '(<span>0</span>)</li>'
      } else {
        html += '<li data-index="' + data[i].name + '">' + data[i].value + '(<span>0</span>)</li>'
      }
    }
    $('#beforedispatchtowh_auditStatusTabs ul').empty().append(html)
  }

  //填充下拉框
  function appendSelect (aDom, data, code, label, attachment, otherAttr) {
    aDom.empty();
    var option = '<option value="">请选择</option>'
    for (var i in data) {
      if (typeof data[i] !== 'string') {
        attachment ?
          data[i].code = data[i][code] + '_' + data[i][attachment] :
          data[i].code = data[i][code].toString() || data[i].code
        data[i].label = data[i][label] || data[i].label;
      }
      const _otherAttr = otherAttr ? `data-${otherAttr}="${data[i][otherAttr]}"` : ''
      option += '<option ' + _otherAttr + ' value="' + (typeof data[i].code != 'undefined' ? data[i].code : data[i]) + '">' + (data[i].label || data[i]) + '</option>'
    }
    if (Array.isArray(data)) {
      let acctIds = data.map(item => item.code !== undefined ? item.code : item)
      aDom.attr('acct_ids', acctIds.join(','))
    }
    aDom.append(option)
  }

  function Selected (aDom, value) {
    var options = aDom.find('option');
    options.each(function (index, item) {
      if (item.value == value) {
        $(item).attr('selected', true)
      }
    })
    form.render()
  }


  function initAjax (url, method, data, func, contentType, isLoad, func2, func3) { //初始化ajax请求
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
        layui.admin.load.hide();
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
  //#endregion


  //#region  异常订单页面
  let abnormalOrder_company = null,
    abnormalOrder_allstore = null,
    abnormalOrder_logisType = null,
    abnormalOrder_Site = null,
    abnormalOrder_formdata = {},
    abnormalOrder_pageEnum = null,
    abnormalOrder_Currency = null,
    abnormalOrder_companyType = "";
  new dropButton('abnormalOrder_logis');
  new dropButton('abnormalOrder_orderHandle');
  // 前端删除行，删除后不刷新表格
  function deleteTableRow_abnormalOrder (ids, errIdsArr) {
    zttCommonRemoveDataHandle({
      selectedIds: ids,
      gridOptions: abnormalOrder_gridOptions,
      tableData: abnormalOrder_immutableStore,
      errIds: errIdsArr
    }).then(newObj => {
      let { newData, successIds } = newObj;
      abnormalOrder_immutableStore = newData;
      let oldNum = $('#beforedispatchtowh_abnormalStatusTabs ul li.layui-this>span').text();
      let newNum = oldNum - successIds.length;
      $('#beforedispatchtowh_abnormalStatusTabs ul li.layui-this>span').text(newNum);
      $('#beforedispatchtowh_abnormalPage .layui-laypage-count').text(`共 ${newNum} 条`);
    });
  }
  // 前端更新行，更新后不刷新表格
  function updateTableRow_abnormalOrder (ids, errIdsArr) {
    zttCommonUpdataDataHandle({
      selectedIds: ids,
      errIds: errIdsArr
    }).then(newObj => {
      // 修改成功的数据
      let { successIds } = newObj;
      if (successIds.length != 0) {
        // 选中的数据
        let checkStatus = abnormalOrder_gridOptions.api.getSelectedRows();
        let newCheckStatus = deepCopy(checkStatus)
        commonReturnPromiseRes({
          url: ctx + '/unauditorder/listorder.html',
          type: 'POST',
          params: { orderIds: successIds.join(",") }
        }).then(function (result) {
          // 匹配选中的数据
          for (let i = 0, iLen = result.data.length; i < iLen; i++) {
            for (let j = 0, jLen = newCheckStatus.length; j < iLen; j++) {
              if (newCheckStatus[j].id == result.data[i].id) {
                newCheckStatus[j] = deepCopy(result.data[i])
                break;
              }
            }
          }
          abnormalOrder_gridOptions.api.updateRowData({ update: newCheckStatus });
        })
      }
    });
  }
  // 前端更新行，更新后不刷新表格- 异常状态
  function updateSingleRow_abnormalOrder (id) {
    // 选中的数据
    let data = abnormalOrder_gridOptions.api.getRowNode(id);
    commonReturnPromise({
      url: ctx + '/unauditorder/listorder.html',
      type: 'POST',
      params: { orderIds: id }
    }).then(function (result) {
      data.setData(result[0] ? result[0] : []);
    })
  }
  //选项卡点击事件[异常订单]
  element.on('tab(beforedispatchtowh_abnormalStatusTabs)', function (data) {
    let processStatus = data.elem.context.dataset.index;
    $('#beforedispatchtowhForm input[name="processStatus"]').val(processStatus);
    let abnormalData = bdtowhGetFormData();
    if(processStatus == 503 || processStatus == 504){
      if(abnormalData.field.orderIds =='' && abnormalData.field.logisTrackingNos =='' && abnormalData.field.platOrderIds == '' && abnormalData.field.time== ''){
        abnormalOrder_gridOptions.api.setRowData([]);
        return layer.msg('请设置查询时间!',{icon:7});
      }
      abnormalOrderSubmitAndRenderTable(abnormalData);
    }else{
      abnormalOrderSubmitAndRenderTable(abnormalData);
    }
    //触发页面操作按钮变化 TODO

    $("#abnormalOrder_replenishCheck").hide();
    $('#abnormalOrder_markExceptionBtn').hide();
    $('#abnormalOrder_syncOrderStatus').hide();
    $("#abnormalOrder_holdStockTask").hide();
    $("#abnormalOrder_toAudit").hide();
    $("#abnormalOrder_toCancel").hide();
    if (processStatus == 501) {
      //黑名单订单
      $('#abnormalOrder_syncOrderStatus').hide();//更新订单状态
      $('#abnormalOrder_markExceptionBtn').hide();//标记异常
      $("#abnormalOrder_toAudit").show();
      $("#abnormalOrder_toCancel").show();
      $('#abnormalOrder_removelogisno_copy').hide();
      $('#abnormalOrder_logis').addClass('disN');
      $('#abnormalOrder_orderHandle').addClass('disN');
    } else if (processStatus == 502) {
      //缺货订单
      $('#abnormalOrder_syncOrderStatus').hide();
      $('#abnormalOrder_markExceptionBtn').show();//标记异常
      $("#abnormalOrderWinit_toAudit").show();
      $("#abnormalOrderWinit_toCancel").show();
      $("#abnormalOrder_replenishCheck").show();
      // $("#abnormalOrder_batchEditWareHouse").show();
      $("#abnormalOrder_holdStockTask").show();
      $('#abnormalOrder_logis').removeClass('disN');
      $('#abnormalOrder_orderHandle').removeClass('disN');
    } else if (processStatus == 503) {
      //取消订单
      $('#abnormalOrder_syncOrderStatus').show();
      $('#abnormalOrder_markExceptionBtn').hide();//标记异常
      $("#abnormalOrder_toAudit").show();
      $('#abnormalOrder_logis').addClass('disN');
      $('#abnormalOrder_orderHandle').addClass('disN');
      $('#abnormalOrder_removelogisno_copy').show();
    } else if (processStatus == 500) {
      //其他异常单
      $('#abnormalOrder_syncOrderStatus').show();
      $('#abnormalOrder_markExceptionBtn').hide();//标记异常
      $("#abnormalOrder_toAudit").show();
      $("#abnormalOrder_toCancel").show();
      $('#abnormalOrder_logis').addClass('disN');
      $('#abnormalOrder_orderHandle').addClass('disN');
      $('#abnormalOrder_removelogisno_copy').show();
    }
  });
  //触发对应的按钮事件
  $('#abnormalOrder_batchEditWareHouse_copy').on('click', function () {
    $('#abnormalOrder_batchEditWareHouse').trigger('click');
  });
  $('#abnormalOrder_toCancel_copy').on('click', function () {
    $('#abnormalOrder_toCancel').trigger('click');
  });
  $('#abnormalOrder_toAudit_copy').on('click', function () {
    $('#abnormalOrder_toAudit').trigger('click');
  });
  $('#abnormalOrder_removelogisno_copy').on('click', function () {
    $('#abnormalOrder_removelogisno').trigger('click');
  });
  //更新订单状态
  $('#abnormalOrder_syncOrderStatus').on('click', function () {
    let idsArr = getAbnormalTableSelectIds();
    if (!idsArr || idsArr.length < 1) {
      layer.msg('请选择订单', { icon: 7 });
      return;
    }
    commonReturnPromise({
      url: '/lms/unauditorder/syncplatstatus.html',
      type: 'post',
      params: {
        ids: idsArr.join()
      }
    }).then(function (result) {
      layui.admin.batchResultAlert("更新订单状态完成:", result, function (errIdsArr) {
        updateTableRow_abnormalOrder(idsArr, errIdsArr)
      });
    }).catch(function (resErr) {
      layer.msg(resErr.message, { icon: 2 });
    });
  });
  // 异常单排序条件映射
  //待派单/缺货排序字段取值不同于异常/待审核,需要映射
  let beforedispatchtowhAbnormalSortMap = {
    'order_time_cn asc': 'order_time_cn asc',
    'order_time_cn desc': 'order_time_cn desc',
    'logis_apply_time asc': 'logis_apply_time asc',
    'logis_apply_time desc': 'logis_apply_time desc',
    'ship_by_date asc': 'ship_by_date asc',
    'ship_by_date desc': 'ship_by_date desc',
    'plat_order_amt asc': 'plat_order_amt asc',
    'plat_order_amt desc': 'plat_order_amt desc',
    'profit asc': 'profit asc',
    'profit desc': 'profit desc',
    'profit/(plat_order_amt*exchange_rate) asc': 'profit/(plat_order_amt*o.exchange_rate) asc',
    'profit/(plat_order_amt*exchange_rate) desc': 'profit/(plat_order_amt*o.exchange_rate) desc'
  };

  // 表单提交[异常单表单提交---这个需要改造]
  function abnormalOrderSubmitAndRenderTable (data) {
    data.field.orderStr = beforedispatchtowhAbnormalSortMap[data.field.orderStr]
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

    if (data.field.agentCompany == 'logisticsModes' && data.field.logisticsCompanyId && !data.field.logisTypeIds) {
      data.field.logisTypeIds = $('#beforedispatchtowhlogisTypeIds').attr('acct_ids')
    }


    if (data.field.agentCompany == 'agents' && data.field.logisticsCompanyId) {
      data.field.agentCompany = data.field.logisticsCompanyId
      delete data.field.logisticsCompanyId
    } else if (data.field.agentCompany == 'companys' && data.field.logisticsCompanyId) {
      delete data.field.agentCompany
    } else {
      data.field.agentCompany = ''
      delete data.field.logisticsCompanyId
    }
    // 1. 选择了部门，没有选店铺
    //     1.1 部门下有店铺，传全部店铺
    //     1.2 部门下没有店铺，传0
    // 2. 选择了部门，选择了店铺，传选择的店铺
    if (data.field.orgs != '' && data.field.storeAcctIds == '') {
      data.field.storeAcctIds = $('#beforedispatchtowh_store').attr('acct_ids') || 0;
    }
    delete data.field.delayMin;
    delete data.field.delayMax;
    abnormalOrderTableorder(data.field)
  }

  getAbnormalPageEnum();
  getAbnormalStoreByPlatform('', function (returnData) {
    abnormalOrder_allstore = returnData.data
  });
  getAbnormalOrderAlldevEmployee();
  getAbnormalOrderAllpurchaseEmployee();
  getAllSite();
  getCurrencyEnums();
  // 页面数据请求----------------------------------------
  function getAbnormalPageEnum () {
    initAjax('/unauditorder/listenum.html', 'post', {}, function (returnData) {
      abnormalOrder_pageEnum = returnData.data
      abnormalOrder_pageEnum.platCode = abnormalOrder_pageEnum.platCodes
      abnormalOrder_pageEnum.prodLogisAttrs = abnormalOrder_pageEnum.logisAttrs
      abnormalOrder_pageEnum.shippingCountryCodes = abnormalOrder_pageEnum.shippingCountrys
      abnormalOrder_pageEnum.warehouseId = abnormalOrder_pageEnum.prodWarehouses

      let temporayReturn = []
      returnData.data.orderLabels.forEach((v) => {
        let temporayObj = {}
        temporayObj.name = v.code
        temporayObj.value = v.name
        temporayReturn.push(temporayObj)
      })
      returnData.data.orderLabels = temporayReturn
      abnormalOrder_pageEnum.orderLabels = temporayReturn
      abnormalOrder_pageEnum.abnormalOrder_orderLabels = abnormalOrder_pageEnum.orderLabels
      for (var i in returnData.data) {
        if (i == 'markShippingStatus') {
          returnData.data[i][0]['code'] = returnData.data[i][0]['name']
        }
        appendSelect($('#beforedispatchtowhForm').find('select[name="' + i + '"]'), returnData.data[i], 'name', 'value')
        appendSelect($('#beforedispatchtowhForm').find('select[_name="' + i + '"]'), returnData.data[i], 'name', 'value')
        if (i === 'abnormalOrderStatus') {
          appendAbnormalTab(returnData.data[i])
        }
      }
      form.render()
      formSelects.render('orderLabels')
      formSelects.render('logisAttrs')
      formSelects.render('shippingCountrys')
      formSelects.render('storeAcct')
    })
  }
  //根据平台code获取店铺列表
  function getAbnormalStoreByPlatform (platcode, func) {
    initAjax('/sys/orderliststorebyplatcode.html', 'get', { platCode: platcode }, function (returnData) {
      if (func) {
        func(returnData)
      }
      formSelects.render('abnormalOrderStoreAcctIds', {
        placeholder: '请先选择平台'
      })
    }, 'application/x-www-form-urlencoded')
  }
  //获取所有开发专员
  function getAbnormalOrderAlldevEmployee () {
    initAjax('/sys/prodOwnerList.html', 'post', {}, function (returnData) {
      appendSelect($('#beforedispatchtowhForm').find('select[name="preprodDevId"]'), returnData.data, 'id', 'loginName')
      form.render()
    })
  }
  //获站点接口
  function getAllSite (platCode, func) {
    initAjax('/enum/getSiteEnum.html?platCode=' + platCode, 'post', {}, function (returnData) {
      abnormalOrder_Site = returnData.data
      if (func) {
        func(returnData)
      }
    }, 'application/x-www-form-urlencoded')
  }
  //获取所有采购专员
  function getAbnormalOrderAllpurchaseEmployee () {
    initAjax('/sys/buyerList.html', 'post', {}, function (returnData) {
      appendSelect($('#beforedispatchtowhForm').find('select[name="purchasingAgentId"]'), returnData.data, 'id', 'loginName')
      form.render()
    })
  }
  // 获取所有页签数量
  function getAllTabNum (data) {
    initAjax('/abnormalorder/statuscount.html', 'post', data, function (returnData) {
      for (var i in returnData.data) {
        $('#LAY-beforedispatchtowh #beforedispatchtowh_abnormalStatusTabs').find('li[data-index="' + i + '"]').find('span').text(returnData.data[i])
      }
    }, 'application/x-www-form-urlencoded')
  }
  //获取币种枚举
  function getCurrencyEnums () {
    initAjax('/sysdict/getCurrencyEnums.html', 'post', {}, function (returnData) {
      abnormalOrder_Currency = returnData.data
    })
  }
  //渲染异常订单表格
  function abnormalOrderTableorder (data) {
    commonReturnPromiseRes({
      url: ctx + '/abnormalorder/list.html',
      type: 'POST',
      params: data
    }).then(function (result) {
      abnormalOrderPageFn(data, result.count)
      abnormalOrder_immutableStore = result.data
      abnormalOrder_gridOptions.api.setRowData(abnormalOrder_immutableStore)
      // 渲染tab中的count数，复制原来的--start
      var tab = $('#beforedispatchtowh_abnormalStatusTabs').find('.layui-this')
      getAllTabNum(data)
      abnormalOrder_formdata = data
      // if (!isAbnormalObjectValueEqual(data, abnormalOrder_formdata)) {
      //   getAllTabNum(data)
      //   abnormalOrder_formdata = data
      // }
      if (tab.length > 0) {
        tab.find('span').text(result.count)
      } else {
        $('#beforedispatchtowh_abnormalStatusTabs').find('li[data-index="' + data.processStatus + '"]').addClass('layui-this').find('span').text(result.count)
      }
      // 复制原来的--end
      setTimeout(() => {
        if (data.processStatus == 502) {
          $('.abnormalOrder__splitBtn').removeClass('disN');
        } else {
          console.log(data.processStatus, '非缺货');
          $('.abnormalOrder__splitBtn').addClass('disN');
        }
      }, 0);
    }).catch(function (err) {
      layer.msg(err, { icon: 2 });
    })
  }
  let abnormalOrder_immutableStore = [];
  const abnormalOrder_gridOptions = {
    columnDefs: [{
      width: 40,
      minWidth: 40,
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
        if (d.platTagList && d.platTagList.length > 0) {
          tagsDom = `
                                ${d.platTagList.map(item => {
            return `<span class="hp-badge" style="background:${item.color};width:auto; color:#fff;margin: 0 5px;padding:0 5px!important;">${item.tagName}</span>`
          }).join('')}`;
        }
        // 重寄订单
        let orderLabel = d.operOrderType == 3 ? '<span style="color:red">重寄</span>' : ''
        // operOrderType 拆单合单：订单操作类型：0原始订单，1拆除订单，2合并订单
        const operOrderTypeTag = d.operOrderType == 1 ? '<span class="hp-badge layui-bg-orange" title="拆出订单">拆</span>' : d.operOrderType == 2 ? '<span class="hp-badge layui-bg-orange" title="合并订单">合</span>' : d.operOrderType == 0 && d.operOriginId != "0" ? '<span class="hp-badge layui-bg-orange" title="拆单订单">拆</span>' : ''
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
                        ${orderTagDom}
                        ${orderLabel}
                        ${tagsDom}
                        ${operOrderTypeTag}
                        <p id="toAudit_table_storeAcct">${d.storeAcct || ""}[${d.shopId || ""}]</p>
                        <p>[${d.salesPersons || ""}][${d.sellLeaderName || ""}][${d.customServicer || ''}]</p>
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
        let fee = [d.platFee || 0, d.otherFee || 0].filter(i => i != 0);
        if (d.logisApplyStatus == 4 && d.logisApplyFailMsg && d.processStatus != 503) {
          str += `<div class="waitOrderErrorTips dis_flex"><div class="waitOrderErrorTipsword">${d.logisApplyFailMsg || ''}</div><div class="waitOrderErrorTipsClose">x</div></div>`
        }
        let amtDom = d.platShippingAmt ? `<span>(${d.platShippingAmt})</span>` : "";
        str +=
          `<div class="alignLeft">
                        <div><span class='gray'>${d.currency || ""}</span><span id="toAudit_table_platOrderAmt">${d.platOrderAmt || ""}</span>${amtDom}</div>
                        <div><span class="gray">平台费</span>${fee.join(' + ')}</div>
                        <div><span class="gray">商品成本(￥)</span>${d.prodCost} / ${d.costPrice}</div>
                        <div><span class="gray">物流成本(￥)</span>${d.shippingCost !== undefined ? d.shippingCost : ""}<button class="layui-btn layui-btn-xs" name="logisCost" style="cursor:pointer;">详</button></div>
                        <div><span class="gray">利润(￥)</span>${d.profit || '0.00'} <span class="gray">${(100 * d.profit / d.platOrderAmt / d.exchangeRate).toFixed(2)}%</span></div>
                    </div>`
        return str
      }
    },
    {
      headerName: '商品',
      width: 130,
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
      wrapText: true,
      autoHeight: true,
      cellRenderer: (data) => {
        let d = data.data
        const buyerNote = d.buyerNote || ''
        let partBuyerNote = buyerNote.substring(0, 100)
        const noteTipsHtml = `<span class="" data-text="${buyerNote}" onmouseenter="abnormalOrderTipsShow(this)" onmouseleave="abnormalOrderTipsHide(this)">${partBuyerNote}......</span>`
        // 联系买家
        let connectBtn = ''
        const chatPlatCodeList = ['lazada']
        if(chatPlatCodeList.includes(d.platCode)){
          connectBtn = `<a class="ml10" name="connectchatbuyer" style="color:#1E90FF;cursor:pointer;">联系买家</a>`
        }
        return `<div class="alignLeft">
                        <div id="toAudit_table_shippingUsername">${d.shippingUsername || ""}</div>
                        <div>[${d.shippingCountryCnName || ""}]${connectBtn}</div>
                        <div><span class="gray">留言：</span>${buyerNote.length > 100 ? noteTipsHtml : buyerNote}</div>
                    </div>`
      }
    },
    {
      headerName: '物流',
      wrapText: true,
      autoHeight: true,
      cellRenderer: (data) => {
        let d = data.data
        return `<div class="alignLeft">
                        <div><span class="gray">买家：</span><span id="toAudit_table_buyerRequireShippingType">${d.buyerRequireShippingType || ""}</span></div>
                        <div><span class="gray">发货：</span><span id="logisTypeName_toAuditOrder">${d.logisTypeName || ""}</span></div>
                        <div>
                            <span class="gray">跟踪号：</span>
                            <span">${d.logisTrackingNo || ""}</span>
                            <span onclick="layui.admin.onlyCopyTxt('${d.logisTrackingNo}',event)" style="display: ${d.logisTrackingNo ? 'inline-block':'none'}" class="copy-icon">
                              <svg t="1710754196184" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2392" width="16" height="16"><path d="M768 832q-0.992 54.016-37.504 90.496T640 960H192q-54.016-0.992-90.496-37.504T64 832V384q0.992-54.016 37.504-90.496T192 256v64q-27.008 0.992-44.992 19.008T128 384v448q0.992 27.008 19.008 44.992T192 896h448q27.008-0.992 44.992-19.008T704 832h64zM384 128q-27.008 0.992-44.992 19.008T320 192v448q0.992 27.008 19.008 44.992T384 704h448q27.008-0.992 44.992-19.008T896 640V192q-0.992-27.008-19.008-44.992T832 128H384z m0-64h448q54.016 0.992 90.496 37.504T960 192v448q-0.992 54.016-37.504 90.496T832 768H384q-54.016-0.992-90.496-37.504T256 640V192q0.992-54.016 37.504-90.496T384 64z" p-id="2393" fill="#aaaaaa"></path></svg>
                            </span>
                        </div>
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
                        <div><span class="gray">订单：</span><span id="toAudit_table_orderTimeCn">${Format(d.orderTimeCn || "", 'yyyy-MM-dd hh:mm:ss')} (${d.orderDay || '0'})</span></div>
                        <div><span class="gray">申请：</span><span>${Format(d.logisApplyTime || "", 'yyyy-MM-dd hh:mm:ss')}</span></div>
                        <div><span class="gray">标记：</span><span>${Format(d.markShippingTime || "", 'yyyy-MM-dd hh:mm:ss')}</span></div>
                        <div><span class="gray">截止：</span><span>${Format(d.shipByDate || "", 'yyyy-MM-dd hh:mm:ss')}</span></div>
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
        let noteContent = ''
        let recentNoteContent = ''
        if (d.platOrderNotes && Array.isArray(d.platOrderNotes) && d.platOrderNotes.length) {
          let noteContentLength = d.platOrderNotes.length
          recentNoteContent =
            (d.platOrderNotes[noteContentLength - 1].noteType || '') +
            ':' +
            (d.platOrderNotes[noteContentLength - 1].noteContent || '')
          if (noteContentLength > 1) {
            noteContent = d.platOrderNotes
              .map((item) => (item.noteType || '') + ':' + (item.noteContent || ''))
              .join('<br>')
          }
        }
        const noteTipsHtml = `<span class="hp-badge fr abnormalOrder-noteContent-tag" data-text="${noteContent}" onmouseenter="abnormalOrderTipsShow(this)" onmouseleave="abnormalOrderTipsHide(this)">多</span>`
        let html = `<div class="alignLeft">
                        <div><span class="gray">仓库：</span>${d.warehouseName || ""}</div>
                        <div><span class="gray">批次：</span>${d.orderLabel || ""}</div>
                        <div><span class="gray">备注：</span>${recentNoteContent}${noteContent ? noteTipsHtml : ''}</div>
                    </div>`
        return html
      }
    },
    {
      headerName: '仓库处理',
      // width: 172,
      wrapText: true,
      autoHeight: true,
      cellRenderer: (data) => {
        let d = data.data
        return `<div class="alignLeft">
                        <div><span class="gray">批次：</span>${d.batchInfo || ""}</div>
                        <div><span class="gray">配货：</span>${d.pickInfo || ""}</div>
                        <div><span class="gray">投篮：</span>${d.checkInfo || ""}</div>
                        <div><span class="gray">包装：</span>${d.packingInfo || ""}</div>
                        <div><span class="gray">分拣：</span>${d.scanerInfo || ""}</div>
                    </div>`
      }
    },
    {
      field: '操作',
      width: 100,
      wrapText: true,
      autoHeight: true,
      cellRenderer: (data) => {
        let splitDom = $('#abnormalOrder_splitPermTagTable').html();
        return `
				<button type="button" name="remark" class="layui-btn layui-btn-xs layui-btn-normal">备注</button><br>
                ${splitDom}
                <!--<button name="edit" class="layui-btn layui-btn-xs disN">修改订单</button>-->`
      }
    }
    ],
    rowData: abnormalOrder_immutableStore,
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
      abnormalOrder_gridOptions.columnApi.applyColumnState({ state: JSON.parse(window.localStorage.getItem("beforedispatchtowhAbnormalOrderColumn")) });
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
      handleAbnormalTableOptions(event)
    },
    onCellMouseDown: function (event) {
      timeAbnormalStamp = event.event.timeStamp
    }
    // onRowDoubleClicked: function (event) {
    // console.log(event.data)
    //event.data 选中的行内数据，event.event 为鼠标事件
    //     let data = event.data;// 获取选中行数据
    //     commonOrderDetailFn(data)
    // },
  };
  var timeAbnormalStamp;

  $(document).off("click", ".waitOrderErrorTipsClose").on("click", ".waitOrderErrorTipsClose", function () {
    $(this).parents('.waitOrderErrorTips').remove()
  })

  var gridDiv = document.querySelector('#beforedispatchtowh_abnormalTable');
  agGrid.LicenseManager.setLicenseKey(
    "IRDEVELOPERS_COM_NDEwMjM0NTgwMDAwMA==f08aae16269f416fe8d65bbf9396be5f");
  new agGrid.Grid(gridDiv, abnormalOrder_gridOptions);

  //ztt-20220909新增-触发ag-grid表格事件
  function handleAbnormalTableOptions (event) {
    let optionEvent = event.event.target.name,
      data = event.data;// 获取选中行数据
    if (optionEvent == 'remark') {
      commonDirectMailRemark(data, abnormalOrder_gridOptions);
    } else if (optionEvent == 'split') {
      abnormalOrderSplitOrderHandle(data);
    } else if (optionEvent == 'copy') {
    } else if(optionEvent === 'logisCost'){
      //物流成本
      commonLogisCostLayerHandle(data.id);
    }else if(optionEvent === 'connectchatbuyer'){
      // 联系买家
      commonOrderConnectChatBuyer(data)
    }else if(optionEvent === 'jumpToPlatformOrder'){
      // 跳转到平台后台订单详情
      commonJumpPlatformOrderDetail(data)
    }else if (event.event.timeStamp - timeAbnormalStamp < 300) {
      commonOrderDetailFn(data, abnormalOrder_gridOptions);
    }
  }
  //拆分订单功能
  function abnormalOrderSplitOrderHandle (data) {
    layer.open({
      type: 1,
      title: '拆分订单',
      btn: ['保存', '关闭'],
      area: ['60%', '60%'],
      content: $('#abnormalOrderSplitOrderLayer').html(),
      id: 'abnormalOrderSplitOrderLayerId',
      success: function (layero, index) {
        var getTpl = abnormalOrderSplitOrderContainerTpl.innerHTML,
          view = document.getElementById('abnormalOrderSplitOrderContainer');
        laytpl(getTpl).render(data, function (html) {
          view.innerHTML = html;
          imageLazyload();
        });
      },
      yes: function (index, layero) {
        var dataArr = [];
        var trs = layero.find('tbody>tr');
        for (var i = 0; i < trs.length; i++) {
          var $item = $(trs[i]).find('input[name=demolitionQuality]');
          var obj = {
            orderDetailId: $item.data('id'),
            prodQuantity: $item.val()
          };
          dataArr.push(obj);
        }
        commonReturnPromise({
          type: 'post',
          url: '/lms/unauditorder/splitorder.html',
          contentType: 'application/json',
          params: JSON.stringify({
            id: data.id,
            orderSplitDetailDtos: dataArr
          })
        }).then(res => {
          layer.msg(res || '拆单成功', { icon: 1 });
          layer.close(index);
          updateSingleRow_abnormalOrder(data.id)
        }).catch(err => {
          layer.msg(err, { icon: 2 });
        });
      }
    })
  }
  //渲染分页
  function abnormalOrderPageFn (data, count) {
    laypage.render({
      elem: 'beforedispatchtowh_abnormalPage',
      curr: data.page,
      limit: data.limit,
      limits: [5000, 10000, 20000],
      layout: ['prev', 'page', 'next', 'count', 'limit'],
      count: count,
      jump: function (obj, first) {
        $('#beforedispatchtowhForm input[name="limit"]').val(obj.limit);//保障下次的分页请求中带有的值正确
        $('#beforedispatchtowhForm input[name="page"]').val(obj.curr);//保障下次的分页请求中带有的值正确
        //首次不执行
        if (!first) {
          data.page = obj.curr;
          data.limit = obj.limit;
          let abnormalData = bdtowhGetFormData();
          abnormalOrderSubmitAndRenderTable(abnormalData);
          // $('#abnormalOrderSearch').click()
        }

      }
    });
  }
  //页面按钮操作start
  //补货检测
  $('#abnormalOrder_replenishCheck').click(function () {
    let ids = getAbnormalTableSelectIds();
    if (!ids || ids.length < 1) {
      layer.msg('请选择订单', { icon: 7 });
      return;
    }
    initAjax('/abnormalorder/replenishcheck.html', 'post', { ids: ids.join(",") }, function (returnData) {
      layui.admin.batchResultAlert("补货检测:", returnData.data, function (errIdsArr) {
        deleteTableRow_abnormalOrder(ids, errIdsArr)
      },true,false,true);
    }, 'application/x-www-form-urlencoded');
  });
  //批量修改仓库和物流
  $('#LAY-beforedispatchtowh #abnormalOrder_batchEditWareHouse').click(function () {
    let ids = getAbnormalTableSelectIds();
    if (!ids || ids.length < 1) {
      layer.msg('请选择订单', { icon: 7 });
      return;
    }
    //弹框-操作仓库信息
    layer.open({
      type: 1,
      title: '批量修改仓库和物流',
      area: ['30%', '60%'],
      btn: ['保存', '关闭'],
      content: $('#abnormalOrder_batchEditWareHouseLayer').html(),
      id: 'abnormalOrder_batchEditWareHouseLayerId',
      success (layero, index) {
        //调用接口渲染仓库
        commonReturnPromise({
          url: '/lms/unauditorder/listenum.html'
        }).then(res => {
          let warehouseArr = res.prodWarehouses;
          let newWarehouseArr = warehouseArr.filter(item => {
            return item.value == '昆山仓' || item.value == '义乌仓';
          })
          commonRenderSelect('batchEditWareHouse_warehouse_abnormalOrder', newWarehouseArr, {
            name: 'value',
            code: 'name'
          }).then(() => {
            form.render('select');
          })
        });
        //调用接口渲染物流公式
        commonReturnPromise({
          url: '/lms/unauditorder/listcompanyandagent.html'
        }).then(res => {
          let companysArr = res.companys;
          commonRenderSelect('batchEditWareHouse_logisCompany_abnormalOrder', companysArr, {
            name: 'cnName',
            code: 'id'
          }).then(() => {
            form.render('select');
          })
        });
        //物流公式联动物流方式
        form.on('select(batchEditWareHouse_logisCompanyFilter_abnormalOrder)', function (obj) {
          let val = obj.value;
          if (!val) {
            $('#batchEditWareHouse_logisWay_abnormalOrder').html('');
            form.render('select');
          } else {
            commonReturnPromise({
              url: `/lms/unauditorder/listlogistype.html?agent=&logisticsCompanyId=${val}&specialType=直发物流`
            }).then(res => {
              commonRenderSelect('batchEditWareHouse_logisWay_abnormalOrder', res, {
                name: 'name',
                code: 'id'
              }).then(() => {
                form.render('select');
              })
            });
          }
        })
      },
      yes: function (index, layero) {
        let warehouseId = layero.find('#batchEditWareHouse_warehouse_abnormalOrder').val();
        let logisTypeId = layero.find('#batchEditWareHouse_logisWay_abnormalOrder').val();
        if (!warehouseId && !logisTypeId) {
          return layer.msg('仓库和物流方式至少有一个必填', { icon: 7 });
        }
        let params = {
          orderIds: ids.join(','),
          logisTypeId,
          warehouseId
        };
        commonReturnPromise({
          url: '/lms/unauditorder/batch/update',
          contentType: 'application/json',
          type: 'post',
          params: JSON.stringify(params)
        }).then(res => {
          layui.admin.batchResultAlert("修改仓库和物流:", res, function (errIdsArr) {
            // layer.close(index);
            updateTableRow_abnormalOrder(ids, errIdsArr)
          });
        })
      }
    });
  });
  //库存占用规则
  $('#abnormalOrder_holdStockTask').click(function () {
    layer.confirm('根据库存占用规则对缺货、待派单订单进行库存占用', function (result) {
      if (result) {
        initAjax('/abnormalorder/holdstocktask.html', 'post', {}, function (returnData) {
          layui.admin.batchResultAlert("订单重新走库存占用规则:", returnData.data, function () {
            $('#abnormalOrderSearch').click();
          });
        }, 'application/x-www-form-urlencoded');
      }
    });
  });
  //转待审核
  $('#abnormalOrder_toAudit').click(function () {
    let ids = getAbnormalTableSelectIds();
    if (!ids || ids.length < 1) {
      layer.msg('请选择订单', { icon: 7 });
      return;
    }
    commonOrderConfirmLayer(ids.length, function (index) {
      initAjax('/abnormalorder/toaudit.html', 'post', { ids: ids.join(",") }, function (returnData) {
        layer.close(index);
        layui.admin.batchResultAlert("订单转待审核:", returnData.data, function (errIdsArr) {
          deleteTableRow_abnormalOrder(ids, errIdsArr)
        });
      }, 'application/x-www-form-urlencoded');
    });
  });
  //标记异常
  $('#abnormalOrder_markExceptionBtn').on('click', function () {
    let ids = getAbnormalTableSelectIds();
    if (!ids || ids.length < 1) {
      layer.msg('请选择订单', { icon: 7 });
      return;
    }
    initAjax('/unauditorder/markabnormal.html', 'post', { ids: ids.join(',') }, function (returnData) {
      layui.admin.batchResultAlert("订单标记异常:", returnData.data, function (errIdsArr) {
        deleteTableRow_abnormalOrder(ids, errIdsArr)
        // let temArr = getOrderId(returnData.data.successResults, '标记异常', returnData.data.successNum) || []
        // changeCount('#toAuditOrder_Tab', returnData.data.successNum)
        // removeSelected()
        // temArr.forEach(value => {
        //     deleteCheckedData('toAuditOrder_table', [value], `td[data-content="${value}"]`)
        // })
        // $('#toAuditOrderSearch').click();
      });
    }, 'application/x-www-form-urlencoded');
  });
  //转取消订单
  $('#abnormalOrder_toCancel').click(function () {
    let ids = getAbnormalTableSelectIds();
    if (!ids || ids.length < 1) {
      layer.msg('请选择订单', { icon: 7 });
      return;
    }
    commonOrderConfirmLayer(ids.length, function (index) {
      initAjax('/abnormalorder/tocancel.html', 'post', { ids: ids.join(",") }, function (returnData) {
        layer.close(index);
        layui.admin.batchResultAlert("转取消订单:", returnData.data, function (errIdsArr) {
          deleteTableRow_abnormalOrder(ids, errIdsArr)
        });
      }, 'application/x-www-form-urlencoded');
    });
  });
  //指定仓库类型
  $('#abnormalOrder_appointWarehouseType').click(function () {
    let ids = getAbnormalTableSelectIds();
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
        $(layero).find('.layui-layer-content').html($("#abnormalOrder_appointWarehouseTypeTpl").html());
        layui.form.render("radio");
      },
      yes: function (index, layero) {
        let warehouseType = $("#abnormalOrder_appointWarehouseTypeForm input[name=warehouseType]:checked").val();
        initAjax('/unauditorder/appointwarehousetype.html', 'post', { ids: ids.join(","), warehouseType: warehouseType }, function (returnData) {
          layui.admin.batchResultAlert("重新指定仓库类型:", returnData.data, function (errIdsArr) {
            updateTableRow_abnormalOrder(ids, errIdsArr)
          });
          layer.close(index);
        }, 'application/x-www-form-urlencoded')
      }
    })
  });
  //匹配物流方式-ztt20220831
  $('#abnormalOrder_matchLogis').click(function () {
    let ids = getAbnormalTableSelectIds();
    if (!ids || ids.length < 1) {
      layer.msg('请选择订单', { icon: 7 });
      return;
    }
    initAjax('/unauditorder/matchlogistype.html', 'post', { ids: ids.join(',') }, function (returnData) {
      layui.admin.batchResultAlert("匹配物流完成:", returnData.data, function (errIdsArr) {
        updateTableRow_abnormalOrder(ids, errIdsArr)
      });
    }, 'application/x-www-form-urlencoded');
  });
  //手动指定物流-ztt20220901
  $('#abnormalOrder_updatelogistype').click(function () {
    var ids = getAbnormalTableSelectIds();
    if (ids.length <= 0) {
      layer.msg('请选择订单', { icon: 7 });
      return
    }
    layer.open({
      type: 1,
      title: '手动指定物流',
      btn: ['确认', '取消'],
      area: ['40%', '60%'],
      content: "loading",
      success: function (layero, index) {
        $(layero).find('.layui-layer-content').html($("#abnormalOrder_updateLogisTypeTpl").html());
        //初始化物流公司
        appendSelect($('#abnormalOrder_updateLogisTypeForm').find('select[name="logisCompany"]'), abnormalOrder_company['companys'], 'id', 'cnName')
        //初始化物流方式
        initAjax('/unauditorder/listlogistype.html', 'get', {specialType: "直发物流"}, function (returnData) {
          appendSelect($('#abnormalOrder_updateLogisTypeForm').find('select[name="logisType"]'), returnData.data, 'id', 'name')
          form.render()
        })
        //物流公司改变触发
        form.on('select(abnormalOrder_logisCompany)', function (obj) {
          var agent = "",
            logisticsCompanyId = obj.value;
          initAjax('/unauditorder/listlogistype.html', 'get', { agent, logisticsCompanyId, specialType: "直发物流" }, function (returnData) {
            appendSelect($('#abnormalOrder_updateLogisTypeForm').find('select[name="logisType"]'), returnData.data, 'id', 'name')
            form.render()
          })
        })
        layui.form.render();
      },
      yes: function (index, layero) {
        var logisTypeId = $("#abnormalOrder_updateLogisTypeForm select[name=logisType]").val();
        if (!logisTypeId) {
          layer.msg("未选择物流方式", { icon: 7 });
          return;
        }
        //指定物流方式
        initAjax('/unauditorder/updatelogistype.html', 'post', {
          ids: ids.join(','),
          logisTypeId: logisTypeId
        }, function (returnData) {
          layui.admin.batchResultAlert("手动指定物流:", returnData.data, function (errIdsArr) {
            updateTableRow_abnormalOrder(ids, errIdsArr)
            layer.close(index);
          });
        }, 'application/x-www-form-urlencoded')
      }
    })
  });
  //申请跟踪号-ztt20220901
  $('#abnormalOrder_applylogisno').click(function () {
    var ids = getAbnormalTableSelectIds();
    if (ids.length <= 0) {
      layer.msg('请选择订单', { icon: 7 });
      return
    }
    zttCommonProgressBar({ type: 9, ids: ids.join(',') }, function (progressData) {
      layui.admin.batchResultAlert("申请跟踪号:", progressData, function (errIdsArr) {
        deleteTableRow_abnormalOrder(ids, errIdsArr)
      });
    });
  });
  //清空跟踪号-ztt20220901
  $('#abnormalOrder_removelogisno').click(function () {
    var ids = getAbnormalTableSelectIds();
    if (ids.length <= 0) {
      layer.msg('请选择订单', { icon: 7 });
      return
    }
    commonOrderConfirmLayer(ids.length, function (index) {
      initAjax('/unauditorder/removelogistrackingno.html', 'post', { ids: ids.join(',') }, function () {
        layer.close(index);
        deleteTableRow_abnormalOrder(ids, [])
      }, 'application/x-www-form-urlencoded');
    });
  });
  //取消wishpost跟踪号-ztt20220901
  $('#abnormalOrder_cancelwishpost').click(function () {
    var ids = getAbnormalTableSelectIds();
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
      success: function (layero, index) {
        $(layero).find('.layui-layer-content').html($("#abnormalOrder_cancelWishpostTpl").html());
        layui.form.render();
      },
      yes: function (index, layero) {
        var cancelReasonCode = $("#abnormalOrder_cancelWishpostForm select[name=cancelReasonCode]").val();
        var invalidReason = $("#abnormalOrder_cancelWishpostForm input[name=invalidReason]").val();
        //取消wishpost物流单
        initAjax('/platorder/cancelwishpost.html', 'post', {
          ids: ids.join(','),
          cancelReasonCode: cancelReasonCode,
          invalidReason: invalidReason
        }, function (returnData) {
          layui.admin.batchResultAlert("取消wishpost订单:", returnData.data, function (errIdsArr) {
            layer.close(index);
            deleteTableRow_abnormalOrder(ids, errIdsArr)
          });
        }, 'application/x-www-form-urlencoded');
      }
    });
  });
  //取消橙联跟踪号-ztt20220901
  $('#abnormalOrder_cancelEdisebay').click(function () {
    var ids = getAbnormalTableSelectIds();
    if (ids.length <= 0) {
      layer.msg('请选择订单', { icon: 7 });
      return
    }
    commonOrderConfirmLayer(ids.length, function (index) {
      layer.close(index);
      initAjax('/platorder/cancelEdisebay.html', 'post', { ids: ids.join(',') }, function (returnData) {
        layui.admin.batchResultAlert("取消Edisebay订单:", returnData.data, function (errIdsArr) {
          deleteTableRow_abnormalOrder(ids, errIdsArr)
        });
      }, 'application/x-www-form-urlencoded');
    });

  });
  function getAbnormalTableSelectIds () {
    // var checkStatus = table.checkStatus('beforedispatchtowh_abnormalTable')
    // var data = checkStatus.data
    let data = abnormalOrder_gridOptions.api.getSelectedRows();
    var ids = (data || []).map(function (item) {
      return item.id
    });
    return ids;
  }
  function isAbnormalObjectValueEqual (a, b) {
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
      if ((propName != "processStatus") && a[propName] !== b[propName]) {
        return false;
      }
    }
    return true;
  }
  //动态添加页签
  function appendAbnormalTab (data) {
    var html = ""
    for (var i in data) {
      if (data[i].name === '1') {
        html += '<li class="layui-this" data-index="' + data[i].name + '">' + data[i].value + '(<span>0</span>)</li>'
      } else {
        html += '<li data-index="' + data[i].name + '">' + data[i].value + '(<span>0</span>)</li>'
      }
    }
    $('#beforedispatchtowh_abnormalStatusTabs ul').empty().append(html)
  }
  //#endregion

  //#region 待派单页面[缺货页面](两个是同一个页面)
  let toDespatchOrder_company = null,
    toDespatchOrder_allstore = null,
    // toDespatchOrder_platOrderStatus = null,
    toDespatchOrder_logisType = null,
    toDespatchOrder_Site = null,
    toDespatchOrder_formdata = {},
    toDespatchOrder_pageEnum = null,
    toDespatchOrder_Currency = null
  toDespatchOrder_companyType = "logisticsModes";
  // 前端删除行，删除后不刷新表格
  function deleteTableRow_toDespatchOrder (ids, errIdsArr) {
    zttCommonRemoveDataHandle({
      selectedIds: ids,
      gridOptions: toDespatchOrder_gridOptions,
      tableData: toDespatchOrder_immutableStore,
      errIds: errIdsArr
    }).then(newObj => {
      let { newData, successIds } = newObj;
      // toDespatchOrder_immutableStore = newData;
      let oldNum = $('#beforedispatchtowh_dispatchStatusTabs ul li.layui-this>span').text();
      let newNum = oldNum - successIds.length;
      $('#beforedispatchtowh_dispatchStatusTabs ul li.layui-this>span').text(newNum);
      $('#beforedispatchtowh_dispatchPage .layui-laypage-count').text(`共 ${newNum} 条`);
    });
  }
  // 前端更新行，更新后不刷新表格
  function updateTableRow_toDespatchOrder (ids, errIdsArr) {
    zttCommonUpdataDataHandle({
      selectedIds: ids,
      errIds: errIdsArr
    }).then(newObj => {
      // 修改成功的数据
      let { successIds } = newObj;
      if (successIds.length != 0) {
        // 选中的数据
        let checkStatus = toDespatchOrder_gridOptions.api.getSelectedRows();
        let newCheckStatus = deepCopy(checkStatus)
        commonReturnPromiseRes({
          url: ctx + '/undispatch/list.html',
          type: 'POST',
          params: { orderIds: successIds.join(",") }
        }).then(function (result) {
          // 匹配选中的数据
          for (let i = 0, iLen = result.data.length; i < iLen; i++) {
            for (let j = 0, jLen = newCheckStatus.length; j < iLen; j++) {
              if (newCheckStatus[j].id == result.data[i].id) {
                newCheckStatus[j] = deepCopy(result.data[i])
                break;
              }
            }
          }
          toDespatchOrder_gridOptions.api.updateRowData({ update: newCheckStatus });
        })
      }
    });
  }

  // 前端更新行，更新后不刷新表格-待派单，缺货单状态
  function updateSingleRow_toDespatchOrder (id) {
    // 选中的数据
    let data = toDespatchOrder_gridOptions.api.getRowNode(id);
    commonReturnPromise({
      url: ctx + '/undispatch/list.html',
      type: 'POST',
      params: { orderIds: id }
    }).then(function (result) {
      data.setData(result[0] ? result[0] : []);
    })
  }
  //监听tab点击事件[待派单/缺货]
  element.on('tab(beforedispatchtowh_dispatchStatusTabs)', function (data) {
    let logisApplySearchStatus = data.elem.context.dataset.index;
    if (logisApplySearchStatus == 5 || logisApplySearchStatus == -1 || logisApplySearchStatus == 4) {
      $("#toDespatchOrder_getEdisebay").show();
    } else {
      $("#toDespatchOrder_getEdisebay").hide();
    }
    $('#beforedispatchtowhForm input[name="processStatus"]').val(logisApplySearchStatus);
    //触发搜索事件[判断是待派单还是缺货页签]
    let tabVal = $('#beforedispatchtowh_tabs').find('li.layui-this').attr('data-index');
    let statuVal = tabVal == 'lack' ? 502 : 115;
    let todispatchData = bdtowhGetFormData();
    toDespatchOrderSubmitAndRenderTable(todispatchData, statuVal);
  });
  // 表单提交[待派单/缺货==需要适配tab,缺货processStatus=502,待派单processStatus=115]
  //待派单/缺货排序字段取值不同于异常/待审核,需要映射
  let beforedispatchtowhSortMap = {
    'order_time_cn asc': 'o.order_time_cn asc',
    'order_time_cn desc': 'o.order_time_cn desc',
    'logis_apply_time asc': 'o.logis_apply_time asc',
    'logis_apply_time desc': 'o.logis_apply_time desc',
    'ship_by_date asc': 'o.ship_by_date asc',
    'ship_by_date desc': 'o.ship_by_date desc',
    'plat_order_amt asc': 'o.plat_order_amt asc',
    'plat_order_amt desc': 'o.plat_order_amt desc',
    'profit asc': 'o.profit asc',
    'profit desc': 'o.profit desc',
    'profit/(plat_order_amt*exchange_rate) asc': 'o.profit/(o.plat_order_amt*o.exchange_rate) asc',
    'profit/(plat_order_amt*exchange_rate) desc': 'o.profit/(o.plat_order_amt*o.exchange_rate) desc'
  };
  function toDespatchOrderSubmitAndRenderTable(data,statuVal) {
    data.field.logisApplySearchStatus = data.field.processStatus;
    data.field.processStatus = statuVal;
    if(statuVal == 115){
      $('#toDespatchOrder_rejectOrderdabao').removeClass('disN');
    }else{
      $('#toDespatchOrder_rejectOrderdabao').addClass('disN');
    }
    data.field.orderStr = beforedispatchtowhSortMap[data.field.orderStr];
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
    //天数类型处理
    data.field.orderDateMin = data.field.delayMin;
    data.field.orderDateMax = data.field.delayMax;
    delete data.field.delayMin;
    delete data.field.delayMax;
    if (data.field.dateType == 1) {//订单天数

    } else if (data.field.dateType == 2) {//跟踪号天数
      data.field.trackDateMin = data.field.orderDateMin;
      data.field.trackDateMax = data.field.orderDateMax;
      delete data.field.orderDateMin;
      delete data.field.orderDateMax;
    } else if (data.field.dateType == 3) {//上网剩余天数
      data.field.shipByDateMin = data.field.orderDateMin;
      data.field.shipByDateMax = data.field.orderDateMax;
      delete data.field.orderDateMin;
      delete data.field.orderDateMax;
    } else if (data.field.dateType == 4) {// 跟踪剩余天数
      data.field.trackCloseTimeMin = data.field.orderDateMin;
      data.field.trackCloseTimeMax = data.field.orderDateMax;
      delete data.field.orderDateMin;
      delete data.field.orderDateMax;
    } else if (data.field.dateType == 5) { //发货剩余天数
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

    // 物流方式与物流方式
    if (data.field.agentCompany == 'logisticsModes' && data.field.logisticsCompanyId && !data.field.logisTypeIds) {
      data.field.logisTypeIds = $('#beforedispatchtowhlogisTypeIds').attr('acct_ids')
    }
    if (data.field.agentCompany == 'logisticsModes') {
      data.field.agentCompany = ''
    }

    if (data.field.agentCompany == 'agents' && data.field.logisticsCompanyId) {
      data.field.agentCompany = data.field.logisticsCompanyId
      delete data.field.logisticsCompanyId
    } else if (data.field.agentCompany == 'companys' && data.field.logisticsCompanyId) {
      delete data.field.agentCompany
    } else {
      data.field.agentCompany = ''
      delete data.field.logisticsCompanyId
    }
    if (data.field.agentCompany == 'logisticsModes' && data.field.logisticsCompanyId && !data.field.logisTypeIds) {
      data.field.logisTypeIds = $('#beforedispatchtowhlogisTypeIds').attr('acct_ids')
    }
    // 1. 选择了部门，没有选店铺
    //     1.1 部门下有店铺，传全部店铺
    //     1.2 部门下没有店铺，传0
    // 2. 选择了部门，选择了店铺，传选择的店铺
    if (data.field.orgs != '' && data.field.storeAcctIds == '') {
      data.field.storeAcctIds = $('#beforedispatchtowh_store').attr('acct_ids') || 0;
    }
    toDespatchOrderTableorder(data.field, statuVal);
  };
  getPageEnum();
  getAllCompanies();
  getStoreByPlatform('', function (returnData) {
    toDespatchOrder_allstore = returnData.data
  });
  getAllLogicsType('', '', '', function (returnData) {
    toDespatchOrder_logisType = returnData.data
  });
  getAlldevEmployee();
  getAllpurchaseEmployee();
  getAllSite();
  getCurrencyEnums();
  //页面批量下拉操作按钮初始化
  new dropButton('toDespatchOrder_exportDetail');
  new dropButton('toDespatchOrder_logis');
  new dropButton('toDespatchOrder_dealOrder');
  new dropButton('toDespatchOrder_platOperate');

  $('#toDespatchOrder_exportDetail').on('click', 'li', function (event) {
    let target = event.target.dataset.detail;
    let data = toDespatchOrder_gridOptions.api.getSelectedRows();
    if (!data.length) {
      return layer.msg('请先选中数据', { icon: 7 });
    }
    let idsArr = data.map(item => item.id);
    transBlob({
      url: "/lms/undispatch/outOfStock",
      formData: JSON.stringify({
        detail: target,
        orderIds: idsArr
      }),
      contentType: 'application/json'
    }).then(function (result) {
      loading.hide();
    }).catch(function (err) {
      layer.msg(err, { icon: 2 });
    });
  });
  //  获取页面枚举数
  function getPageEnum () {
    initAjax('/unauditorder/listenum.html', 'post', {}, function (returnData) {
      toDespatchOrder_pageEnum = returnData.data
      toDespatchOrder_pageEnum.platCode = toDespatchOrder_pageEnum.platCodes
      toDespatchOrder_pageEnum.prodLogisAttrs = toDespatchOrder_pageEnum.logisAttrs
      toDespatchOrder_pageEnum.shippingCountryCodes = toDespatchOrder_pageEnum.shippingCountrys
      toDespatchOrder_pageEnum.warehouseId = toDespatchOrder_pageEnum.prodWarehouses
      let temporayRetrun = [];
      returnData.data.orderLabels.forEach((v) => {
        let temporayObj = {}
        temporayObj.name = v.code
        temporayObj.value = v.name
        temporayRetrun.push(temporayObj)
      })
      returnData.data.orderLabels = temporayRetrun
      toDespatchOrder_pageEnum.toDespatchOrder_orderLabels = toDespatchOrder_pageEnum.orderLabels
      for (var i in returnData.data) {
        appendSelect($('#toDespatchOrderForm').find('select[name="' + i + '"]'), returnData.data[i], 'name', 'value')
        appendSelect($('#toDespatchOrderForm').find('select[_name="' + i + '"]'), returnData.data[i], 'name', 'value')
        if (i === 'logisApplySearchStatusMaps') {
          appendToDespatchOrderTab(returnData.data[i])
        }
        if (i === 'shippingCountryCodes') {
          const shippingCountryCodeList = toDespatchOrder_pageEnum.shippingCountryCodes.map(item => ({
            ...item,
            name: item.value + "(" + item.name + ")",
            shippingCountryCode: item.name,
            shippingCountryName: item.enFullValue,
            shippingCountryCnName: item.value,
          }))
          appendSelect($('#toDespatchOrderForm').find('select[name="shippingCountryCodes"]'), shippingCountryCodeList, 'shippingCountryCode', 'name')
          appendSelect($('#toDespatchOrderForm').find('select[_name="shippingCountryCodes"]'), shippingCountryCodeList, 'shippingCountryCode', 'name')
        }
      }
      form.render()
      formSelects.render('logisAttrs')
      formSelects.render('shippingCountrys')
      formSelects.render('toDespatchOrder_orderLabels', { placeholder: '备注类型' })
      form.render('storeAcct')
    })
  }
  //获取所有物流公司以及货代公司
  function getAllCompanies () {
    initAjax('/unauditorder/listcompanyandagent.html', 'post', {}, function (returnData) {
      toDespatchOrder_company = returnData.data
      appendSelect($('#toDespatchOrderForm').find('select[name="logisticsCompanyId"]'), returnData.data.logisticsModes, 'id', 'logisticsCollectionName')
      form.render()
    })
  }

  //获取所有物流方式
  function getAllLogicsType (agent, logisticsCompanyId, logisticsModeId, func) {
    initAjax('/unauditorder/listlogistype.html', 'get', { agent, logisticsCompanyId, logisticsModeId, specialType: "直发物流" }, function (returnData) {
      if (func) {
        func(returnData)
      }
      if (!$('#toDespatchOrderForm').find('select[_name="logisTypeIds"]').length) {
        formSelects.render('logisTypeIds_xm_select_toDes')
      }
      appendSelect($('#toDespatchOrderForm').find('select[_name="logisTypeIds"]'), returnData.data, 'id', 'name')
      formSelects.render('logisTypeIds_xm_select_toDes')
    })
  }

  //根据平台code获取店铺列表
  function getStoreByPlatform (platcode, func) {
    initAjax('/sys/orderliststorebyplatcode.html', 'get', { platCode: platcode }, function (returnData) {
      if (func) {
        func(returnData)
      }
      formSelects.render('storeAcct', { placeholder: '请先选择平台' })
    }, 'application/x-www-form-urlencoded')
  }

  //获取所有开发专员
  function getAlldevEmployee () {
    initAjax('/sys/prodOwnerList.html', 'post', {}, function (returnData) {
      appendSelect($('#toDespatchOrderForm').find('select[name="preprodDevId"]'), returnData.data, 'id', 'loginName')
      form.render()
    })
  }

  //获站点接口
  function getAllSite (platCode, func) {
    initAjax('/enum/getSiteEnum.html?platCode=' + platCode, 'post', {}, function (returnData) {
      toDespatchOrder_Site = returnData.data
      if (func) {
        func(returnData)
      }
    }, 'application/x-www-form-urlencoded')
  }

  //获取所有采购专员
  function getAllpurchaseEmployee () {
    initAjax('/sys/buyerList.html', 'post', {}, function (returnData) {
      appendSelect($('#toDespatchOrderForm').find('select[name="purchasingAgentId"]'), returnData.data, 'id', 'loginName')
      form.render()
    })
  }

  // 获取所有页签数量
  function getTodespatchOrderAllTabNum (data) {
    initAjax('/undispatch/statuscount.html', 'post', data, function (returnData) {
      for (var i in returnData.data) {
        $('#LAY-beforedispatchtowh #beforedispatchtowh_dispatchStatusTabs').find('li[data-index="' + i + '"]').find('span').text(returnData.data[i])
      }
    }, 'application/x-www-form-urlencoded', true)
  }
  //获取币种枚举
  function getCurrencyEnums () {
    initAjax('/sysdict/getCurrencyEnums.html', 'post', {}, function (returnData) {
      toDespatchOrder_Currency = returnData.data
    })
  }
  function toDespatchOrderTableorder (data, statuVal) {
    if(statuVal==502){
      let slelct_sku_val = $("#slelct_sku_num_type").val();
      if(slelct_sku_val=='sku_type'){
        if(Object.keys(data).includes('skuQuantityMax')){
          data.skuTypeQuantityMax= data.skuQuantityMax;
          data.skuTypeQuantityMin= data.skuQuantityMin;
          delete data.skuQuantityMax
          delete data.skuQuantityMin
        }
      }else{
        if(Object.keys(data).includes('skuTypeQuantityMax')){
          data.skuQuantityMax= data.skuTypeQuantityMax;
          data.skuQuantityMin= data.skuTypeQuantityMin;
          delete data.skuTypeQuantityMax
          delete data.skuTypeQuantityMin
        }
      }
    }
    commonReturnPromiseRes({
      url: ctx + '/undispatch/list.html',
      type: 'POST',
      params: data
    }).then(function (result) {
      beforedispatchtowh_dispatchPageFn(data, result.count, statuVal);
      toDespatchOrder_immutableStore = result.data
      toDespatchOrder_gridOptions.api.setRowData(toDespatchOrder_immutableStore)

      // 渲染tab中的count数，复制原来的--start
      var tab = $('#beforedispatchtowh_dispatchStatusTabs').find('.layui-this')
      getTodespatchOrderAllTabNum(data)
        toDespatchOrder_formdata = data
      // if (!isToDespatchOrderObjectValueEqual(data, toDespatchOrder_formdata)) {
      //   getTodespatchOrderAllTabNum(data)
      //   toDespatchOrder_formdata = data
      // }
      if (tab.length > 0) {
        tab.find('span').text(result.count)
      } else {
        $('#beforedispatchtowh_dispatchStatusTabs').find('li[data-index="' + data.logisApplySearchStatus + '"]').addClass('layui-this').find('span').text(result.count)
      }
      // 复制原来的--end
      setTimeout(() => {
        let arr = ['0', '4'];
        if (arr.includes(data.logisApplySearchStatus)) {
          $('.toDespatchOrder__receiveBtn').removeClass('disN');
          $('.toDespatchOrder__receiveBtn').prev('br').removeClass('disN')
        } else {
          $('.toDespatchOrder__receiveBtn').addClass('disN');
          $('.toDespatchOrder__receiveBtn').prev('br').addClass('disN');
        }
      }, 100);
      // 商品种类||数量
      let skuQuantity = 0, prodQuantity = 0;
      if (result.count != 0) {
        result.data.forEach(item => {
          skuQuantity = skuQuantity + item.skuQuantity * 1
          prodQuantity = prodQuantity + item.prodQuantity * 1
        })
        $("#beforedispatchtowh_dispatchTable").find("[col-id=3] .ag-header-cell-text").text(`商品 种类${skuQuantity} || 数量${prodQuantity}`);
      } else {
        $("#beforedispatchtowh_dispatchTable").find("[col-id=3] .ag-header-cell-text").text(`商品 种类0 || 数量0`);
      };
    }).catch(function (err) {
      layer.msg(err, { icon: 2 });
    })
  }
  let toDespatchOrder_immutableStore = [];
  const toDespatchOrder_gridOptions = {
    columnDefs: [{
      width: 40,
      minWidth: 40,
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
        if (d.platTagList && d.platTagList.length > 0) {
          tagsDom = `
                              ${d.platTagList.map(item => {
            return `<span class="hp-badge" style="background:${item.color};width:auto; color:#fff;margin: 0 5px;padding:0 5px!important;">${item.tagName}</span>`
          }).join('')}`;
        }
        let lackDom = d.processStatus == 502 ? `<span class="hp-badge" style="background:#f00;color:#fff;margin: 0 5px;">缺</span>` : '';
        // 重寄订单
        let orderLabel = d.operOrderType == 3 ? '<span style="color:red">重寄</span>' : ''
        // operOrderType 拆单合单：订单操作类型：0原始订单，1拆除订单，2合并订单
        const operOrderTypeTag = d.operOrderType == 1 ? '<span class="hp-badge layui-bg-orange" title="拆出订单">拆</span>' : d.operOrderType == 2 ? '<span class="hp-badge layui-bg-orange" title="合并订单">合</span>' : d.operOrderType == 0 && d.operOriginId != "0" ? '<span class="hp-badge layui-bg-orange" title="拆单订单">拆</span>' : ''
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
                      ${lackDom}
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
        let jsonData = JSON.stringify(d).replace("'", "");
        jsonData = jsonData.replace(/</g, '&lt;')
        jsonData = jsonData.replace(/>/g, '&gt;')
        //利润计算逻辑
        let profitCalculation = `<span data-text='${jsonData}' onmouseenter="toDespatchOrderProfitTipsShow(this)" onmouseleave="toDespatchOrderProfitTipsHide(this)">${d.profit || '0.00'}</span>`;
        let fee = [d.platFee || 0, d.otherFee || 0].filter(i => i != 0);
        if (d.logisApplyStatus == 4 && d.logisApplyFailMsg) {
          str += `<div class="waitOrderErrorTips dis_flex"><div class="waitOrderErrorTipsword">${d.logisApplyFailMsg || ''}</div><div class="waitOrderErrorTipsClose">x</div></div>`
        }
        let amtDom = d.platShippingAmt ? `<span>(${d.platShippingAmt})</span>` : "";
        str +=
          `<div class="alignLeft">
                      <div><span class='gray'>${d.currency || ""}</span><span id="toAudit_table_platOrderAmt">${d.platOrderAmt || ""}</span>${amtDom}</div>
                      <div><span class="gray">平台费</span>${fee.join(' + ')}</div>
                      <div><span class="gray">商品成本(￥)</span>${d.prodCost} / ${d.costPrice}</div>
                      <div><span class="gray">物流成本(￥)</span>${d.shippingCost !== undefined ? d.shippingCost : ""}<button class="layui-btn layui-btn-xs" name="logisCost" style="cursor:pointer;">详</button></div>
                      <div><span class="gray">利润(￥)</span>${profitCalculation} <span class="gray">${(100 * d.profit / d.platOrderAmt / d.exchangeRate).toFixed(2)}%</span></div>
                  </div>`
        return str
      }
    },
    {
      headerName: '商品',
      width: 180,
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
      wrapText: true,
      autoHeight: true,
      cellRenderer: (data) => {
        let d = data.data
        const buyerNote = d.buyerNote || ''
        let partBuyerNote = buyerNote.substring(0, 100)
        // console.log('object :>> ', partBuyerNote);
        // 联系买家
        let connectBtn = ''
        const chatPlatCodeList = ['shopee', 'tiktok', 'lazada']
        if(chatPlatCodeList.includes(d.platCode)){
            connectBtn = `<a class="ml10" name="connectchatbuyer" style="color:#1E90FF;cursor:pointer;">联系买家</a>`
        }
        const noteTipsHtml = `<span class="" data-text="${buyerNote}" onmouseenter="toDespatchBuyerTipsShow(this)" onmouseleave="toDespatchBuyerTipsHide(this)">${partBuyerNote}......</span>`
        return `<div class="alignLeft">
                      <div id="toAudit_table_shippingUsername">${d.shippingUsername || ""}</div>
                      <div>[${d.shippingCountryCnName || ""}]${connectBtn}</div>
                      <div><span class="gray">留言：</span>${buyerNote.length > 100 ? noteTipsHtml : buyerNote}</div>
                  </div>`
      }
    },
    {
      headerName: '物流',
      wrapText: true,
      autoHeight: true,
      cellRenderer: (data) => {
        let d = data.data
        let closeTimeHmtl = `<div><span class="gray">关单：</span>${Format(d.closeTime || "", 'yyyy-MM-dd hh:mm:ss')}<span class="${d.closeTimeDay < 4 ? 'plus-red-text' : ''}">(≤${d.closeTimeDay || '0'})</span></div>`
        return `<div class="alignLeft">
                      <div><span class="gray">买家：</span><span id="toAudit_table_buyerRequireShippingType">${d.buyerRequireShippingType || ""}</span></div>
                      <div><span class="gray">发货：</span><span id="logisTypeName_toAuditOrder">${d.logisTypeName || ""}</span></div>
                      <div>
                          <span class="gray">跟踪号：</span>
                          <span">${d.logisTrackingNo || ""}</span>
                          <span onclick="layui.admin.onlyCopyTxt('${d.logisTrackingNo}',event)" style="display: ${d.logisTrackingNo ? 'inline-block':'none'}" class="copy-icon">
                            <svg t="1710754196184" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2392" width="16" height="16"><path d="M768 832q-0.992 54.016-37.504 90.496T640 960H192q-54.016-0.992-90.496-37.504T64 832V384q0.992-54.016 37.504-90.496T192 256v64q-27.008 0.992-44.992 19.008T128 384v448q0.992 27.008 19.008 44.992T192 896h448q27.008-0.992 44.992-19.008T704 832h64zM384 128q-27.008 0.992-44.992 19.008T320 192v448q0.992 27.008 19.008 44.992T384 704h448q27.008-0.992 44.992-19.008T896 640V192q-0.992-27.008-19.008-44.992T832 128H384z m0-64h448q54.016 0.992 90.496 37.504T960 192v448q-0.992 54.016-37.504 90.496T832 768H384q-54.016-0.992-90.496-37.504T256 640V192q0.992-54.016 37.504-90.496T384 64z" p-id="2393" fill="#aaaaaa"></path></svg>
                          </span>
                          <image onclick="okk(${d.id})" src="${ctx}/static/img/print.png" width="20" lay-tips="打印预览"></image>
                      </div>
                      <div><span class="gray">状态：</span>${d.logisticsStatus || ""}</div>
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
                      <div><span class="gray">订单：</span><span id="toAudit_table_orderTimeCn">${Format(d.orderTimeCn || "", 'yyyy-MM-dd hh:mm:ss')}</span><span class="${d.orderDay > 4 ? 'plus-red-text' : ''}">(${d.orderDay || '0'})</span></div>
                      <div><span class="gray">申请：</span><span>${Format(d.logisApplyTime || "", 'yyyy-MM-dd hh:mm:ss')}</span></div>
                      <div><span class="gray">标记：</span><span>${Format(d.markShippingTime || "", 'yyyy-MM-dd hh:mm:ss')}</span></div>
                      <div><span class="gray">截止：</span><span>${Format(d.shipByDate || "", 'yyyy-MM-dd hh:mm:ss')}</span></div>
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
            `<span data-text='${JSON.stringify(d.platOrderNotes)}' onmouseenter="toDespatchBuyerTipsShowTable(this)" onmouseleave="toDespatchBuyerTipsHide(this)">${d.platOrderNotes[noteContentLength - 1].noteType || ""}:${d.platOrderNotes[noteContentLength - 1].noteContent || ""}</span>`;
        }
        const noteTipsHtml = `<span class="hp-badge fr toDespatchOrder-noteContent-tag">多</span>`
        let html = `<div class="alignLeft">
                      <div><span class="gray">仓库：</span>${d.warehouseName || ""}</div>
                      <div><span class="gray">批次：</span>${d.orderLabel || ""}</div>
                      <div><span class="gray">备注：</span>${recentNoteContent}${(d.platOrderNotes && d.platOrderNotes.length > 1) ? noteTipsHtml : ''}</div>
                  </div>`
        return html
      }
    },
    {
      headerName: '仓库处理',
      // width: 172,
      wrapText: true,
      autoHeight: true,
      cellRenderer: (data) => {
        let d = data.data
        return `<div class="alignLeft">
                      <div><span class="gray">批次：</span>${d.batchInfo || ""}</div>
                      <div><span class="gray">配货：</span>${d.pickInfo || ""}</div>
                      <div><span class="gray">投篮：</span>${d.checkInfo || ""}</div>
                      <div><span class="gray">包装：</span>${d.packingInfo || ""}</div>
                      <div><span class="gray">分拣：</span>${d.scanerInfo || ""}</div>
                  </div>`
      }
    },
    {
      field: '操作',
      width: 100,
      wrapText: true,
      autoHeight: true,
      cellRenderer: (data) => {
        let d = data.data;
        let showDom = '';
        let showUpdate = '';
        let wishBtnDom = '';
        let tiktokBtnDom = ''; //tiktok取消
        if (d.processStatus == 502 || d.processStatus == 115) {
          showDom = $('#toDespatchOrder_splitPermTagTable').html();
          // showUpdate = `<br><permTag:perm funcCode="toDespatchOrder_updatePermTag"><button name="toDespatchOrder_update" class="layui-btn layui-btn-xs">修改订单</button></permTag:perm>`;
        }
        if(d.processStatus == 502){
          showUpdate = $('#toDespatchOrder_updatePermTagTable').html();
        }
        if (d.platCode == "wish") {
          wishBtnDom = $("#toDespatchOrder_btnPermTag_wish").html(); //wish取消
        }
        if (d.platCode == "tiktok" && d.processStatus == 502) {
          tiktokBtnDom = $("#toDespatchOrder_btnPermTag_tiktok").html(); //tiktok取消
        }
        let aliBtnDom = '';
        if(d.platCode=='aliexpress' && (d.processStatus == 115 || d.processStatus==502) && (d.logisApplyStatus==4 || d.logisApplyStatus==0)){
          aliBtnDom = '<button name="requestNum" class="layui-btn layui-btn-xs layui-btn-normal">申请跟踪号</button>'
        }
        return `<button name="remark" class="layui-btn layui-btn-xs layui-btn-normal">备注</button><br>
                  <button type="button" name="receive" class="layui-btn layui-btn-xs layui-btn-normal toDespatchOrder__receiveBtn">收件信息</button><br>${showDom}${showUpdate}${wishBtnDom}${aliBtnDom}${tiktokBtnDom}`;
      }
    }
    ],
    rowData: toDespatchOrder_immutableStore,
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
      toDespatchOrder_gridOptions.columnApi.applyColumnState({ state: JSON.parse(window.localStorage.getItem("beforedispatchtowhToDespatchOrderColumn")) });
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
    onCellMouseDown: function (event) {
      timeStamp = event.event.timeStamp
    }
  };
  var timeStamp;

  $(document).off("click", ".waitOrderErrorTipsClose").on("click", ".waitOrderErrorTipsClose", function () {
    $(this).parents('.waitOrderErrorTips').remove()
  })

  let gridToDespatchOrderDiv = document.querySelector('#beforedispatchtowh_dispatchTable');
  agGrid.LicenseManager.setLicenseKey(
    "IRDEVELOPERS_COM_NDEwMjM0NTgwMDAwMA==f08aae16269f416fe8d65bbf9396be5f");
  new agGrid.Grid(gridToDespatchOrderDiv, toDespatchOrder_gridOptions);

  // 订单获得详细数据
  function toDespatchOrder_requestDetailedData (orderId) {
    return commonReturnPromise({
      url: ctx + '/unauditorder/detail.html',
      params: { orderId }
    })
  }

  function handleTableOptions (event) {
    let optionEvent = event.event.target.name,
      data = event.data;// 获取选中行数据

    if (optionEvent == 'remark') {
      commonDirectMailRemark(data, toDespatchOrder_gridOptions);
    } else if (optionEvent == "toDespatchOrder_wishBtn") {
      // wish退款
      originOrderWishRefund([data], '', function () {
        $('#toDespatchOrderSearch').trigger('click')
      })
    } else if(optionEvent == "toDespatchOrder_tiktokBtn"){
      //tiktok取消
      toDespatchOrder_tiktokCancelHandle([data.id]);
    }else if (optionEvent == 'receive') {
      toDespatchOrderReceiveHandle(data);
    } else if (optionEvent == 'toDespatchOrder_demolition') {

      toDespatchOrder_requestDetailedData(data.id).then(res => {
        data.orderDetails = res.orderDetails;
        data.companyName = res.companyName
        if (data.operOrderType == "0") { //原始订单
          toDespatchOrder_originOrderDemolimotion(data)
        } else if (data.operOrderType == "1") { //拆出订单，不允许拆单
          //layer.msg('当前订单为拆出订单，不允许再拆单', {icon:0})
          toDespatchOrder_originOrderDemolimotion(data)
        } else if (data.operOrderType == "2") { //合并拆单，只能恢复合并前订单
          layer.confirm('当前订单为合并订单，是否恢复原订单?', function (index) {
            toDespatchOrder_mergeDemolition(data.id)
          })
        }
      });
    } else if (optionEvent == 'toDespatchOrder_update') {
      if(data.processStatus == 502){ //缺货才会执行替换请求
        Promise.all([toDespatchOrder_getLackOrderForShowAjax(data.id),toDespatchOrder_requestDetailedData(data.id)]).then(res => {
          data.orderDetails = res[1];
          //循环处理数据
          let skuKeys = Object.keys(res[0]);
          for(let i=0; i< data.orderDetails['orderDetails'].length; i++){
            let item = data.orderDetails['orderDetails'][i];
            if(skuKeys.includes(item.prodSSku)){
              //定义一个数组
              let currentItemArr = [{
                imageUrl: item.imageUrl,
                prodSSku: item.prodSSku,
                style: item.style,
                availableStock: item.availableStock,
                prodUnitWeight: item.prodUnitWeight,
                prodUnitCost: item.prodUnitCost,
                commodityCost: item.detailCostPrice
              }]
              item.replaceSkuList = currentItemArr.concat(res[0][item.prodSSku]);
            }
          }
          toDespatchOrder_orderUpdate('2', data);
        })
      }else{
        toDespatchOrder_requestDetailedData(data.id).then(res => {
          data.orderDetails = res
          toDespatchOrder_orderUpdate('2', data);
        })
      }

    } else if(optionEvent === 'logisCost'){
      //物流成本
      commonLogisCostLayerHandle(data.id);
    } else if(optionEvent === 'connectchatbuyer'){
      commonOrderConnectChatBuyer(data)
    }else if(optionEvent == 'requestNum'){//速卖通申请跟踪号弹框
      layer.open({
        type: 1,
        title: '申请跟踪号',
        area: ['90%', '60%'],
        btn: ['申请跟踪号','取消'],
        content:$('#beforedispatchtowh_requestNumLayer').html(),
        id: 'beforedispatchtowh_requestNumLayerId',
        success: function(layero,index){
          table.render({
            elem: "#beforedispatchtowh_requestNumLayer_table",
            method: 'get',
            url: `/lms/platorder/getCustomApplyLogisticsNoDetailInfo?orderId=${data.id}`,
            even: true,
            created(res) {
              res.data = res.data.customProdDetailDtoList;
            },
            cols: [[
                {type: "checkbox", width: 30},
                { field: "prodInfo", title: "商品信息", templet: '#beforedispatchtowh_requestNumLayer_table_prodInfo' },
                { field: "itemTitle", title: "平台标题", width:220},
                { field: "stock", title: "可用库存", width: 70},
                { field: "platOrderItemId", title: "子店铺单号"},
                { field: "storeSSku", title: "店铺SKU"},
                { field: "prodQuantity", title: "商品数量", width: 70},
                { field: "platQuantity", title: "平台数量", width: 70},
                { field: "platUnitPrice", title: "销售金额", width: 70},
                { field: "categoryCnName", title: "报关信息"},
                { field: "platOrderDetailStatus", title: "订单状态"},
                { field: "customPrice", title: "申报价", templet: '#beforedispatchtowh_requestNumLayer_table_customPrice', width: 70},
                { field: "customQuantity", title: "报关数量", templet: '#beforedispatchtowh_requestNumLayer_table_customQuantity', width: 70},
            ]],
            page: false,
            where: {},
            id: "beforedispatchtowh_requestNumLayer_tableId",
            limit: 1000,
            done: function(){
              imageLazyload();
            }
          });
        },
        yes: function(index,layero){
          //beforedispatchtowh_requestNumLayer_tableId
          commonTableCksSelected('beforedispatchtowh_requestNumLayer_tableId').then(res => {
            let hasEmpty= false; //默认
            let emptyArr = ['',0,undefined];
            for(let i=0; i<res.length;i++){
              let item = res[i];
              item.customPrice = layero.find(`[name=customPrice${item.id}]`).val().trim();
              item.customQuantity = layero.find(`[name=customQuantity${item.id}]`).val().trim();
              if(emptyArr.includes(item.customPrice) || emptyArr.includes(item.customQuantity)){
                hasEmpty = true;
              }
            }
            if(hasEmpty){
              return layer.msg('申报价和报关数量必填', {icon: 7});
            }
            //申请跟踪号
            commonReturnPromise({
              url: '/lms/platorder/submitCustomApplyLogisticsNo',
              type: 'post',
              contentType: 'application/json',
              params: JSON.stringify({
                customProdDetailDtoList: res
              })
            }).then(result => {
              layui.admin.batchResultAlert("申请跟踪号:", result, function () {
                layer.close(index);
              });
            });
          }).catch(err => {
            layer.msg(err, {icon:7});
          })
        }
      });
    }else if(optionEvent == 'jumpToPlatformOrder'){
      // 跳转到平台后台订单详情
      commonJumpPlatformOrderDetail(data)
    }else if (event.event.timeStamp - timeStamp < 300) {
      data.showLogisAttrList = true;
      data.showSale = true;
      // data被修改了？
      commonOrderDetailFn(data, toDespatchOrder_gridOptions, 'toDespatchOrder');
    }
  }

  //#region  20231011 ztt-缺货订单详情新增缺货SKU的同类展示
  function toDespatchOrder_getLackOrderForShowAjax(id){
    return commonReturnPromise({
      url: `/lms/undispatch/listSkuInfoByOrderId.html?orderId=${id}`
    })
  };
  //#endregion

  //根据平台code,roleNames获取店铺列表
  function getStoreByPlatformAndRoleName (platcode, func) {
    initAjax('/sys/listStoreForRenderHpStoreCommonComponent.html', 'post', { platCode: platcode, roleNames: `${platcode}专员`, }, function (returnData) {
      if (func) {
        func(returnData)
      }
    }, 'application/x-www-form-urlencoded')
  }
  //合并订单拆单
  function toDespatchOrder_mergeDemolition (id) {
    initAjax('/unauditorder/splitmergeorder.html', 'post', { id: id }, function (returnData) {
      layer.msg(returnData.msg || '拆单成功');
      // $('#toDespatchOrderSearch').trigger('click');
      $('#beforedispatchtowh_dispatchStatusTabs ul>li.layui-this').trigger('click')
    }, 'application/x-www-form-urlencoded')
  }

  // 根据商品sku获取商品信息
  function getProdInfoByprodsku (arr, func) {
    initAjax('/unauditorder/listprodinfobysku.html', 'POST', JSON.stringify(arr), function (returnData) {
      if (func) {
        func(returnData)
      }
    })
  }
  // 获取商品列表
  function getProductList (sSku, func) {
    initAjax('/product/getProds.html', 'post', { searchType: 'sSku', searchValue: sSku, page: 1, limit: 300, isCombination: false, isSale: '' }, function (returnData) {
      if (func) {
        func(returnData)
      }
    }, 'application/x-www-form-urlencoded')
  }

  var toDespatchOrder_storeData = []
  //修改订单
  function toDespatchOrder_orderUpdate (type, data) {
    let nameData = data || {}
    edit_order_tableIns = null;
    var concatData = []
    var obj = { '1': '新增订单', '2': `修改订单 - ${nameData.id || ''}` }
    // 国家列表
    const shippingCountryCodeList = toDespatchOrder_pageEnum.shippingCountryCodes.map(item => ({
      ...item,
      name: item.value + "(" + item.name + ")",
      shippingCountryCode: item.name,
      shippingCountryName: item.enFullValue,
      shippingCountryCnName: item.value,
    }))
    layer.open({
      type: 1,
      title: obj[type],
      btn: ['保存', '取消'],
      area: ['90%', '85%'],
      move: false,
      content: $('#pop_toDespatchOrder_newandeditorder').html(),
      id: 'pop_toDespatchOrder_newandeditorderId',
      success: function (layero, index) {
        if (type == 2) {
          //店铺单号platOrderId,平台platCode,店铺storeAcctId,站点siteId都不能编辑
          layero.find('input[name=platOrderId]').prop('disabled', true);
          layero.find('select[name=platCode]').removeAttr('lay-search').prop('disabled', true);
          layero.find('select[name=storeAcctId]').removeAttr('lay-search').prop('disabled', true);
          layero.find('select[name=siteId]').removeAttr('lay-search').prop('disabled', true);
          //创建一个元素存放元素prodSSKU
          if(data.processStatus == 502){
            let originSku = data.orderDetails.orderDetails.map(item => item.prodSSku).join(',');
            let $hiddenOriginSkuDom = $(`<input type='hidden' name="originSku" value="${originSku}">`);
            if(layero.find('[name=originSku]').length > 0){
              layero.remove(layero.find('[name=originSku]')).append($hiddenOriginSkuDom);
            }else{
              layero.append($hiddenOriginSkuDom);
            }
          }
        }
        // 计算原利润
        let profit = (data.platOrderAmt - data.platFee - data.otherFee) * data.exchangeRate - data.prodCost - (data.outerPackCost || 0) - data.shippingCost;
        $('#originProfitLack').text(profit.toFixed(4))
        // 物流方式没有时 则不展示修改后利润
        if (data.logisTypeId) {
          $('#updateProfitLackBox').show()
        } else {
          $('#updateProfitLackBox').hide()
        }
        $(layero).on('click', '.refresh_profit', function () {
          let param = {};
          param = serializeObject($('#toDespatchOrder_editForm'));

          param.orderTimeCn = new Date(param.orderTimeCn).getTime();
          param.platOrderDetails = edit_order_tableIns ? toAuditGetEditTableData(concatData, edit_order_tableIns) : [];
          const { shippingCountryCode } = param
          const curCountry = shippingCountryCodeList.filter(item => item.shippingCountryCode === shippingCountryCode)[0]
          if (curCountry) {
            param.shippingCountryCnName = curCountry.shippingCountryCnName
            param.shippingCountryName = curCountry.shippingCountryName
          }
          param.platCode = layero.find('select[name=platCode]').val()
          param.storeAcctId = layero.find('select[name=storeAcctId]').val()
          param.siteId = layero.find('select[name=siteId]').val()
          param.platOrderId = layero.find('input[name=platOrderId]').val()
          if (param.platOrderDetails.length > 0) {
            const validOptions = comVertifyPlatOrderDetails(param.platOrderDetails)
            if (!validOptions) {
              return;
            }
            getOrderProfit(param, function(res) {
              let result = res.data
              if (!!Object.keys(result).length) {
                let profitRes = (result.platOrderAmt - result.platFee - result.otherFee) * result.exchangeRate - result.prodCost - (result.outerPackCost || 0) - result.shippingCost;
                $('#updateProfitLack').text(profitRes.toFixed(4))
              }
            })
          }
        })
        commonOrderGetLogisticAjax().then(logisTypeArr => {
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
          layero.find('input[name=logisTrackingNo]').on('blur', function (e) {
            let val = e.target.value;
            e.target.value = val.replaceAll(" ", "");
          })
          laydate.render({
            elem: '#edit_time',
            type: 'datetime'
          });

          appendSelect($('#toDespatchOrder_editForm').find('select[name="platCode"]'), toDespatchOrder_pageEnum.platCode, 'name', 'value')
          appendSelect($('#toDespatchOrder_editForm').find('select[name="storeAcctId"]'), [], 'id', 'storeAcct', '', 'salesSite')
          // appendSelect($('#toDespatchOrder_editForm').find('select[name="platOrderStatusList"]'), toAuditOrder_platOrderStatus, 'platOrderStatus', 'platOrderStatus')
          appendSelect($('#toDespatchOrder_editForm').find('select[name="warehouseId"]'), toDespatchOrder_pageEnum.prodWarehouses, 'name', 'value')
          appendSelect($('#toDespatchOrder_editForm').find('select[name="logisTypeId"]'), logisTypeArr, 'id', 'name')
          form.render('select');
          // appendSelect($('#toDespatchOrder_editForm').find('select[name="siteId"]'), toDespatchOrder_Site, 'code', 'name')
          appendSelect($('#toDespatchOrder_editForm').find('select[name="currency"]'), toDespatchOrder_Currency, 'code', 'name')
          appendSelect($('#toDespatchOrder_editForm').find('select[name="shippingCountryCode"]'), shippingCountryCodeList, 'shippingCountryCode', 'name')
          // 备注类型
          appendSelect($('#toDespatchOrder_editForm').find('select[name="noteType"]'), toDespatchOrder_pageEnum.toDespatchOrder_orderLabels, 'label', 'label')


          if (data) {
            data.orderTimeCn = Format(data.orderTimeCn, 'yyyy-MM-dd hh:mm:ss')
            form.val("toDespatchOrder_editForm", data);
            let temArr = data.orderDetails.orderDetails ? data.orderDetails.orderDetails[0] : {}
            Selected($('#toAuditOrder_editForm select[name="platCode"]'), temArr?.platCode)
            // storeSelected($('#toDespatchOrder_editForm select[name="storeAcctId"]'), data.storeAcctId.toString())
            getStoreByPlatformAndRoleName(temArr.platCode, function (returnData) {
              appendSelect(
                $("#toDespatchOrder_editForm").find('select[name="storeAcctId"]'),
                returnData.data,
                "id",
                "storeAcct",
                "",
                "salesSite"
              )
              Selected(
                $('#toDespatchOrder_editForm select[name="storeAcctId"]'),
                data.storeAcctId
              )
              toDespatchOrder_storeData = returnData.data
              toAuditOrderSiteByStore(data.siteId)
            })
            getAllSite(data.platCode, function (returnData) {
              appendSelect(
                $("#toDespatchOrder_editForm").find('select[name="siteId"]'),
                returnData.data,
                'code',
                'name'
              )
              Selected($('#toDespatchOrder_editForm select[name="siteId"]'), data.siteId)
            })
            data.orderDetails.orderDetails = data.orderDetails?.orderDetails.sort(function (a, b) {
              return a.availableStock - b.availableStock;
            });
            concatData = data.orderDetails?.orderDetails
            edit_order_tableIns = toDespatchOrderProdTableRender(concatData)
          }
          form.render()

          form.on('select(edit_storeAcct)', function (obj) {
            toAuditOrderSiteByStore()
          })
          if (type === '2') {
            // 修改订单
            //监听物流方式下拉选择
            form.on('select(edit_logisTypeId)', function (obj) {
              $('#toDespatchOrder_editForm input[name=logisTrackingNo]').val('')
            })
          }
          //监听平台下拉选择
          form.on('select(edit_platCode)', function (obj) {
            getStoreByPlatformAndRoleName(obj.value, function (returnData) {
              toDespatchOrder_storeData = returnData.data
              appendSelect($('#toDespatchOrder_editForm').find('select[name="storeAcctId"]'), returnData.data, 'id', 'storeAcct', '', 'salesSite')
              form.render()
            })
            getAllSite(obj.value, function (returnData) {
              appendSelect($('#toDespatchOrder_editForm').find('select[name="siteId"]'), returnData.data, 'code', 'name')
              form.render()
            })
          })
          $('#toDespatchOrder_addProducts').click(function () {
            var orginaldata = data ? toAuditGetEditTableData(concatData, edit_order_tableIns) : []
            var prodSku = $(this).siblings('input').val();
            if (prodSku !== "") {
              getProductList(prodSku, function (returnData) {
                toDespatchOrderAddprod(returnData, function (callback) {
                  concatData = orginaldata ? orginaldata.concat(callback) : [].concat(callback)
                  edit_order_tableIns = toDespatchOrderProdTableRender(concatData)
                })
              })
            } else {
              layer.msg('添加商品sku不能为空')
            }
          })
          $(layero).on('click', '.refresh_icon', function () {
            //移除tips
            // $(this).parents('tr').find('[data-field=prodSSku] font').remove();
            var dataArr = [];
            var prodSSku = $(this).parents('tr').find('[data-field=prodSSku] input').val(),
              prodQuantity = $(this).parents('tr').find('[data-field=prodQuantity] input').val(),
              platOrderDetailAmt = $(this).parents('tr').find('[data-field=platOrderDetailAmt] input').val();
            warehouseId = $('#toDespatchOrder_editForm').find('select[name="warehouseId"]').val();
            dataArr.push({
              "prodSSku": prodSSku,
              "prodQuantity": prodQuantity,
              "platOrderDetailAmt": platOrderDetailAmt,
              "warehouseId": warehouseId
            });
            var prodskus = $(this).siblings('input').val()
            var index = $(this).parents('tr').attr("data-index")
            if (prodskus !== "") {
              getProdInfoByprodsku(dataArr, function (returnData) {
                var data = concatData[index]
                var newdata = returnData.data[0]
                concatData[index] = Object.assign(data, newdata)
                edit_order_tableIns = toDespatchOrderProdTableRender(concatData)
              })
            } else {
              layer.msg('请填写sku')
            }
          })
          loading.hide()
        });
      },
      yes: function (index, layero) {
        form.on('submit(edit_submit)', function (obj) {
          const param = obj.field;
          param.orderTimeCn = new Date(param.orderTimeCn).getTime();
          // edit_order_tableIns ? param.platOrderDetails = toAuditGetEditTableData(concatData, edit_order_tableIns) :
          //     param.platOrderDetails = [];
          param.platOrderDetails = edit_order_tableIns ? toAuditGetEditTableData(concatData, edit_order_tableIns) : [];
          const { shippingCountryCode } = param
          const curCountry = shippingCountryCodeList.filter(item => item.shippingCountryCode === shippingCountryCode)[0]
          if (curCountry) {
            param.shippingCountryCnName = curCountry.shippingCountryCnName
            param.shippingCountryName = curCountry.shippingCountryName
          }
          if (param.platOrderDetails.length > 0) {
            const validOptions = comVertifyPlatOrderDetails(param.platOrderDetails)
            if (!validOptions) {
              return;
            }
            savetoAuditOrders(param, function (returnData) {
              if (type == 2) {
                layer.msg(returnData.msg || '保存成功', { icon: 1 });
              } else {
                if (returnData.data) {
                  layer.alert(`新增订单号为:${returnData.data}`);
                } else {
                  layer.msg(returnData.msg || '保存成功', { icon: 1 });
                }

              }
              // let prodQuantity = 0
              // param.platOrderDetails.forEach(v => {
              //   prodQuantity += v.prodQuantity * 1
              // })
              // $('#beforedispatchtowh_dispatchTable').next().find('#toAudit_table_storeAcct').text($(layero).find('#edit_storeAcct option:selected').text())
              // $('#beforedispatchtowh_dispatchTable').next().find('#toAudit_table_platOrderId').text(param.platOrderId)
              // $('#beforedispatchtowh_dispatchTable').next().find('#toAudit_table_platOrderAmt').text(param.platOrderAmt)
              // $('#beforedispatchtowh_dispatchTable').next().find('#toAudit_table_skuQuantity').text(param.platOrderDetails.length)
              // $('#beforedispatchtowh_dispatchTable').next().find('#toAudit_table_prodQuantity').text(prodQuantity)
              // $('#beforedispatchtowh_dispatchTable').next().find('#toAudit_table_shippingUsername').text(param.shippingUsername)
              // $('#beforedispatchtowh_dispatchTable').next().find('#toAudit_table_buyerRequireShippingType').text(param.buyerRequireShippingType)
              // $('#beforedispatchtowh_dispatchTable').next().find('#toAudit_table_orderTimeCn').text(Format(param.orderTimeCn || "", 'yyyy-MM-dd hh:mm:ss'))
              // $('#toDespatchOrderSearch').click();

              // 待派单，缺货单状态更新行
              updateSingleRow_toDespatchOrder(param.id);
              layer.close(index);
              if(data.processStatus == 502) {
                //执行补货检测
                //新数据
                let tagTbody = $('#toDespatchOrder_product_table').next().find('.layui-table-body');
                let trs = tagTbody.find('tr');
                let newSSkuArr = [];
                for(let i=0; i< trs.length; i++){
                  let item = trs[i];
                  let newSSku = $(item).find('td[data-field=prodSSku] input[name=""]').val();
                  newSSkuArr.push(newSSku);
                }
                let newSSkuStr = newSSkuArr.join(',');
                //原始数据
                let originSSkuStr =layero.find('[name=originSku]').val();
                if(!areCommaSeparatedStringsEqual(originSSkuStr,newSSkuStr)){
                  initAjax('/abnormalorder/replenishcheck.html', 'post', { ids: data.id }, function (returnData) {
                    layui.admin.batchResultAlert("补货检测:", returnData.data, function (errIdsArr) {
                      deleteTableRow_toDespatchOrder([data.id], errIdsArr)
                    },true,false,true);
                  }, 'application/x-www-form-urlencoded');
                }

              }
            })
          } else {
            layer.msg('请添加商品')
          }
        })
        $(layero).find('#edit_submit').click();

      },
      btn2: function(index, layero){
        if(data.processStatus == 502){
          //新数据
          let tagTbody = $('#toDespatchOrder_product_table').next().find('.layui-table-body');
          let trs = tagTbody.find('tr');
          let newSSkuArr = [];
          for(let i=0; i< trs.length; i++){
            let item = trs[i];
            let newSSku = $(item).find('td[data-field=prodSSku] input[name=""]').val();
            newSSkuArr.push(newSSku);
          }
          let newSSkuStr = newSSkuArr.join(',');
          //原始数据
          let originSSkuStr =layero.find('[name=originSku]').val();
          if(!areCommaSeparatedStringsEqual(originSSkuStr,newSSkuStr)){
            layer.alert('订单替换后未保存,请确定是否关闭?',{icon: 7}, function(index1){
              layer.close(index1);
              layer.close(index);
            });
          }else{
            layer.close(index);
          }
          return false;
        }
      },
      cancel: function (index, layero) {
        if(data.processStatus == 502){
          //新数据
          let tagTbody = $('#toDespatchOrder_product_table').next().find('.layui-table-body');
          let trs = tagTbody.find('tr');
          let newSSkuArr = [];
          for(let i=0; i< trs.length; i++){
            let item = trs[i];
            let newSSku = $(item).find('td[data-field=prodSSku] input[name=""]').val();
            newSSkuArr.push(newSSku);
          }
          let newSSkuStr = newSSkuArr.join(',');
          //原始数据
          let originSSkuStr =layero.find('[name=originSku]').val();
          if(!areCommaSeparatedStringsEqual(originSSkuStr,newSSkuStr)){
            layer.alert('订单替换后未保存,请确定是否关闭?',{icon: 7}, function(index1){
              layer.close(index1);
              layer.close(index);
            });
          }else{
            layer.close(index);
          }
          return false;
        }
      }
    })
  }
  
  //获取编辑表格数据
  function toAuditGetEditTableData (data, tableIns) {
    var layFilterIndex = 'LAY-table-' + tableIns.config.index;
    var tableContainer = $('div[lay-filter="' + layFilterIndex + '"]');
    tableContainer.find('tr').each(function (index, item) {
      if (index > 0) {
        data[index - 1].itemId = $(item).find('td[data-field="itemId"] input').val()
        data[index - 1].storeSSku = $(item).find('td[data-field="storeSSku"] div[name=storeSSku]').text()
        data[index - 1].prodSSku = $(item).find('td[data-field="prodSSku"] input').val()
        data[index - 1].platUnitPrice = $(item).find('td[data-field="platUnitPrice"] input').val()
        data[index - 1].platQuantity = $(item).find('td[data-field="platQuantity"] input').val()
        data[index - 1].prodQuantity = $(item).find('td[data-field="prodQuantity"] input').val()
        data[index - 1].platOrderDetailAmt = $(item).find('td[data-field="platOrderDetailAmt"] input').val()
        data[index - 1].status = true
      }
    });
    return data;
  }

  //修改收件人信息
  function toDespatchOrderReceiveHandle (data) {
    // console.log(data);
    layer.open({
      title: '修改收件人信息',
      type: 1,
      btn: ['修改', '取消'],
      area: ['60%', '60%'],
      content: $('#toDespatchOrderReceiveLayer').html(),
      id: 'toDespatchOrderReceiveLayerId',
      success: function (layero, index) {
        var getTpl = toDespatchOrderReceiveLayerTbodyTpl.innerHTML;
        var getUl = document.getElementById('toDespatchOrderReceiveLayerTbody');
        laytpl(getTpl).render(data, function (html) { //渲染到表格
          getUl.innerHTML = html;
        });
        // 修改收件人信息 解密地址
        $("#decryptAddress").on('click', function () {
          initAjax('/platorder/decryptAndGet', 'get', { orderId: data.id }, function (returnData) {
            // 解密后地址回显
            let data = returnData.data;
            let { shippingUsername, shippingState, shippingCity, shippingZip, shippingStreet1, shippingStreet2, shippingPhoneNumber } = data;
            layero.find('td input[name=shippingUsername]').val(shippingUsername);
            layero.find('td input[name=shippingState]').val(shippingState);
            layero.find('td input[name=shippingCity]').val(shippingCity);
            layero.find('td input[name=shippingZip]').val(shippingZip);
            layero.find('td input[name=shippingStreet1]').val(shippingStreet1);
            layero.find('td input[name=shippingStreet2]').val(shippingStreet2);
            layero.find('td input[name=shippingPhoneNumber]').val(shippingPhoneNumber);


          })
        });
      },
      yes: function (index, layero) {
        let id = data.id;
        let obj = {
          id: id
        };
        obj.shippingUsername = layero.find('td input[name=shippingUsername]').val();
        obj.shippingState = layero.find('td input[name=shippingState]').val();
        obj.shippingCity = layero.find('td input[name=shippingCity]').val();
        obj.shippingZip = layero.find('td input[name=shippingZip]').val();
        obj.shippingStreet1 = layero.find('td input[name=shippingStreet1]').val();
        obj.shippingStreet2 = layero.find('td input[name=shippingStreet2]').val();
        obj.shippingPhoneNumber = layero.find('td input[name=shippingPhoneNumber]').val();
        commonReturnPromise({
          url: '/lms/undispatch/updateOrderInfo.html',
          type: 'post',
          contentType: 'application/json',
          params: JSON.stringify(obj)
        }).then(res => {
          layer.msg(res || '操作成功', { icon: 1 });
          layer.close(index);
          //执行移除行操作
          zttCommonRemoveDataHandle({
            selectedIds: [id],
            gridOptions: toDespatchOrder_gridOptions,
            tableData: toDespatchOrder_immutableStore,
            errIds: []
          }).then(newObj => {
            let { successIds } = newObj;
            let oldNum = $('#beforedispatchtowh_dispatchStatusTabs ul li.layui-this>span').text();
            let newNum = oldNum - successIds.length;
            $('#beforedispatchtowh_dispatchStatusTabs ul li.layui-this>span').text(newNum);
            $('#beforedispatchtowh_dispatchPage .layui-laypage-count').text(`共 ${newNum} 条`);
          });
        });
      }
    });
  }
  // 排序
  function toDespatchOrder_sortBy (props) {
    return function (a, b) {
      return a[props] - b[props];
    }
  }
  //监听排序
  table.on('sort(toDespatchOrder_demolition_original_table)', function (obj) {
    toDespatchOrderStyle('toDespatchOrder_demolition_original_table')
  });
  function toDespatchOrderStyle (id) {
    layui.table.cache[id].forEach((item, index) => {
      // 商品总量大于可用库存时，标红加粗
      if (item.allCount > item.availableStock && item.holdStock <= 0) {
        // toDespatchOrder_product_table
        $("#" + id).next().find(`tr[data-index=${index}] td[data-field=availableStock]>div`).addClass('orderRedStyle')
        $("#" + id).next().find(`tr[data-index=${index}] td[data-field=platQuantity]>div`).addClass('orderRedStyle')
        $("#" + id).next().find(`tr[data-index=${index}] td[data-field=prodQuantity]>div`).addClass('orderRedStyle')
        $("#" + id).next().find(`tr[data-index=${index}] td[data-field=allCount]>div`).addClass('orderRedStyle')
      }
      if (item.platQuantity == 0) {
        $("#" + id).next().find(`tr[data-index=${index}] td[data-field=platQuantity]`).css('background', '#fab81c');
      }
    })
  }
  //拆分订单操作
  function toDespatchOrder_originOrderDemolimotion (data) {
    let orderDetails = data.orderDetails;
    data.orderDetails && data.orderDetails.sort(toDespatchOrder_sortBy('availableStock'));
    layer.open({
      type: 1,
      title: '订单拆分',
      btn: ['拆分', '关闭'],
      area: ['100%', '80%'],
      content: $('#pop_toDespatchOrder_demolition_original').html(),
      id: 'pop_toDespatchOrder_demolition_originalId',
      success: function (layero, index) {
        data.orderDetails = data.orderDetails.sort(function (a, b) {
          return a.availableStock - b.availableStock;
        });
        data.orderDetails.forEach((item,index) => {
          //ztt20230912-数据结构中增加prodCost,costPrice
          item.costPrice = data.costPrice || 0;
          item.prodCost = data.prodCost || 0;
        });
        demolitiontableIns = table.render({
          elem: '#toDespatchOrder_demolition_original_table',
          data: data.orderDetails,
          totalRow: true,
          cols: [
            [
              { title: "商品信息", field: "prodSSku", sort: true, templet: "#toDespatchOrder_orginal_order_products", width: 300 },
              { title: "子店铺单号", field: "platOrderItemId" },
              { title: "子订单类型", field: "platOrderDetailType" },
              { title: "子订单状态", field: "platOrderDetailStatus" },
              { title: "总重量(g)", field: "prodWeight", templet: "#toDespatchOrder_orginal_order_demolition", totalRow: true },
              { title: "销售金额", field: "platOrderDetailAmt", totalRow: true },
              { title: "物流属性", field: "prodLogisAttrList" },
              { title: "sku重量(g)", field: "prodUnitWeight" },
              { title: "可用库存", field: "availableStock", sort: true },
              // , templet: '#toDespatchOrder_orginal_order_availableStock'
              { title: "平台数量", field: "platQuantity" },
              { title: "商品数量", field: "prodQuantity" },
              // , templet: '#toDespatchOrder_orginal_order_prodQuantity'
              { title: "商品总量", field: "allCount", sort: true },
              { title: "成本占比", templet: "#toDespatchOrder_costRatio",width: 130 },
              // , templet: '#toDespatchOrder_orginal_order_allCount'
              { title: "拆分数量", templet: "#toDespatchOrder_orginal_order_number" },
              { title: "拆分重量(g)", field: "prodSSkuWeight", templet: "#toDespatchOrder_orginal_order_dynamicWeight", totalRow: true },
              { title: "拆分金额", field: "splitCost", templet: "#toDespatchOrder_orginal_order_dynamicMoney", totalRow: true },
            ]
          ],
          page: true,
          height: 480,
          limit: 500,
          limits: [200, 500],
          id: 'toDespatchOrder_demolition_original_table',
          done: function (res) {
            let newArr = delSameObjValue(layui.table.cache.toDespatchOrder_demolition_original_table, 'allCount', ['prodSSku'], ['prodQuantity']);
            layui.table.cache.toDespatchOrder_demolition_original_table.forEach((item, index) => {
              let TableDom = $("#toDespatchOrder_demolition_original_table").next()
              newArr.forEach(cItem => {
                if (item.prodSSku == cItem.prodSSku) {
                  item.allCount = cItem.allCount
                }
              })
              TableDom.find(`tr[data-index=${index}] td[data-field=allCount] div`).text(res.data[index].allCount)
            })
            toDespatchOrderStyle('toDespatchOrder_demolition_original_table')

            imageLazyload();
            form.render()
            //总计展示
            toDespatchOrder_originOrderDemolimotionTotalHandle(layero);
            //监听tr的input变化
            toDespatchOrder_originOrderDemolimotionTbodyHandle(layero, data);
          }
        })
      },
      yes: function (index, layero) {
        var trs = layero.find('.layui-table-body tbody>tr');
        var dataArr = [];
        for (var i = 0; i < trs.length; i++) {
          var tr = trs[i];
          var orderDetail = orderDetails[i];
          var orderDetailId = orderDetail.id;
          var demolitionQuality = $(tr).find('input[name=demolitionQuality]').val();
          dataArr.push({ orderDetailId: orderDetailId, prodQuantity: demolitionQuality });
        };
        dataArr = dataArr.filter((value) => value.prodQuantity)
        const turnToAbnormalOrderTag = $('#toDespatchOrder_demolition_original_abnormal').prop('checked')
        const turnToAbnormalOrder = $('#toDespatchOrder_demo_original_abnormal').prop('checked')
        // if(turnToAbnormalOrderTag && turnToAbnormalOrder){
        //     return layer.alert('拆出订单转至取消订单和拆出订单转至其他异常单只能二选一',{icon:7})
        // }
        commonReturnPromise({
          type: 'post',
          url: '/lms/unauditorder/splitorder.html',
          contentType: 'application/json',
          params: JSON.stringify({
            id: data.id,
            orderSplitDetailDtos: dataArr
          })
        }).then(res => {
          if (!turnToAbnormalOrderTag && !turnToAbnormalOrder) {
            layer.msg('操作成功', { icon: 1 });
            layer.close(index);
            updateSingleRow_toDespatchOrder(data.id)
          } else if (turnToAbnormalOrderTag) {
            initAjax('/unauditorder/markabnormal.html', 'post', { ids: res }, function (returnData) {
              const { failResults, successResults } = returnData.data
              let str = ''
              if (successResults.length) {
                let trackReg = /(?<=(\[))\w+(?=(\]))/g;
                let abnormalorderList = []
                successResults.forEach(item => {
                  abnormalorderList.push(item.match(trackReg)[0])
                })
                str = `拆分订单{${abnormalorderList.join('、')}}已转至其他异常单`
              } else {
                str = failResults.join('\n')
              }
              layer.alert(str, { icon: successResults.length ? 1 : 7 }, function () {
                layer.closeAll()
                updateSingleRow_toDespatchOrder(data.id)
              })

            }, 'application/x-www-form-urlencoded')
          } else if (turnToAbnormalOrder) {
            initAjax('/abnormalorder/tocancel.html', 'post', { ids: res }, function (returnData) {
              layer.close(index);
              layui.admin.batchResultAlert(`拆除订单{${res}}已转至取消订单:`, returnData.data, function (errIdsArr) {
                updateSingleRow_toDespatchOrder(data.id)
              });
            }, 'application/x-www-form-urlencoded');
          }
        }).catch(err => {
          layer.msg(err, { icon: 2 });
        })

      },
    })
  }
  function toDespatchOrder_originOrderDemolimotionTotalHandle (layero) {
    //总计文字展示
    layero.find('.layui-table-total td[data-field=prodSSku]>div').html('<b>总计</b>');
    //重量求和
    let $tr = layero.find('.layui-table-box .layui-table-body tr');
    let totalWeight = 0;
    for (let i = 0; i < $tr.length; i++) {
      let tr = $tr[i];
      let prodWeight = $(tr).find('td[data-field=prodWeight]>div').text();
      totalWeight += Number(prodWeight);
    }
    layero.find('.layui-table-total td[data-field=prodWeight]>div').html(totalWeight.toFixed(2));
  }
  function toDespatchOrder_originOrderDemolimotionTbodyHandle (layero, res) {
    layero.on('change', 'input[name=demolitionQuality]', function (event) {
      let $parentTr = $(this).parents('tr');
      // 判断是否有拆单确认弹窗
      // 线上物流：SMT物流、虾皮、Lazada、Joom线上   true
      // 未勾选“拆出订单转取消订单”  false
      // （平台数量＜商品数量 and 拆分数量<商品数量）or（item_id有多行 and 至少有一行的平台数量 = 0）
      let companyName = res.companyName
      let companyFlag = ['SMT物流', '虾皮', 'Lazada', 'Joom线上', '待处理订单'].includes(companyName)
      let turnToAbnormalOrder = $('#toDespatchOrder_demo_original_abnormal').prop('checked')
      let platCount = $parentTr.find('td[data-field=platQuantity]>div').text() // 平台数量
      let itemCount = $parentTr.find('td[data-field=prodQuantity]>div').text() // 商品数量
      let splitCount = Number(event.target.value) // 拆分数量

      let platZero = res.orderDetails.filter(item => item.platQuantity === 0)

      let val = event.target.value;
      if (companyFlag && !turnToAbnormalOrder && ((Number(platCount) < Number(itemCount) && Number(splitCount) < Number(itemCount)) || (res.orderDetails.length > 1 && platZero?.length > 0))) {
        // 显示弹窗
        layer.confirm('拆出订单无法使用线上物流发货，请确认是否继续？', {
          cancel: function () {
            $parentTr.find('td[data-field=prodSSkuWeight]>div').html('')
            $parentTr.find('td[data-field=splitCost]>div').html('')
            $parentTr.find('[name=demolitionQuality]').focus().select()
          }
        }, function (index) {
          handleSplit(val, $parentTr, layero)
          layer.close(index);
        }, function () {
          $parentTr.find('td[data-field=prodSSkuWeight]>div').html('')
          $parentTr.find('td[data-field=splitCost]>div').html('')
          $parentTr.find('[name=demolitionQuality]').focus().select()
        })
      } else {
        handleSplit(val, $parentTr, layero)
      }
    });
  }
  function handleSplit (val, $parentTr, layero) {
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
    for (let i = 0; i < $tr.length; i++) {
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
  //保存修改新增待审核订单
  function savetoAuditOrders (data, func) {
    initAjax('/unauditorder/saveorder.html', 'post', JSON.stringify(data), function (returnData) {
      if (func) {
        func(returnData)
      }
    })
  }
  // 计算订单利润
  function getOrderProfit (data, func) {
    initAjax('/unauditorder/queryOrderProfit.html', 'post', JSON.stringify(data), function (returnData) {
      if (func) {
        func(returnData)
      }
    })
  }
  // 添加商品
  function toDespatchOrderAddprod (data, func) {
    layer.open({
      type: 1,
      title: '添加商品',
      btn: ['添加商品', '关闭'],
      area: ['70%', '60%'],
      content: $('#pop_toDespatchOrder_addProducts').html(),
      id: 'pop_toDespatchOrder_addProductsId',
      success: function (layero, index) {
        table.render({
          elem: '#toDespatchOrder_addProducts_table',
          data: data.data,
          cols: [
            [
              { checkbox: true, width: 30 },
              { title: "图片", field: "imageUrl", templet: "#add_product_img" },
              { title: "商品数量", templet: "#toDespatchOrder_add_product_prodQuantity" },
              { title: "销售金额", templet: "#toDespatchOrder_add_product_platOrderDetailAmt" },
              { title: "商品状态", field: "isSale", templet: function (d) { return d.isSale ? '在售' : '停售' } },
              { title: "商品sku", field: "sSku" },
              { title: "父sku", field: "", templet: "#add_product_psku" },
              { title: "商品名称", field: "title" },
              { title: "款式", field: "style" }
            ]
          ],
          page: true,
          limit: 100,
          limits: [100, 300, 500],
          id: 'toDespatchOrder_addProducts_table',
          done: function (res) {
            imageLazyload();
          }
        })
      },
      yes: function (index, layero) {
        var trs = layero.find('.layui-table-body tbody>tr');
        var dataArr = [];
        for (var i = 0; i < trs.length; i++) {
          var tr = trs[i];
          if ($(tr).find('.layui-unselect.layui-form-checkbox.layui-form-checked').length != 0) {
            var prodSSku = $(tr).find('[data-field="sSku"] div').text(),
              prodQuantity = $(tr).find('input[name=prodQuantity]').val(),
              platOrderDetailAmt = $(tr).find('input[name=platOrderDetailAmt]').val(),
              warehouseId = $('#toDespatchOrder_editForm').find('select[name="warehouseId"]').val();
            dataArr.push({
              "prodSSku": prodSSku,
              "prodQuantity": prodQuantity,
              "platOrderDetailAmt": platOrderDetailAmt,
              "warehouseId": warehouseId
            });
          }

        };
        if (dataArr.length == 0) {
          layer.msg("请选择需要提交的数据")
          return;
        }
        getProdInfoByprodsku(dataArr, function (returnData) {
          var data = returnData.data.map(function (item) {
            item.storeSSku = item.prodSSku
            return item
          })
          if (func) {
            func(data)
          }
          layer.close(index)
        })
      },
    })
  }
  // 渲染页面分页
  function beforedispatchtowh_dispatchPageFn (data, count, statuVal) {
    laypage.render({
      elem: 'beforedispatchtowh_dispatchPage',
      curr: data.page,
      limit: data.limit,
      limits: [1000, 2000, 5000, 10000, 20000],
      layout: ['prev', 'page', 'next', 'count', 'limit'],
      count: count,
      jump: function (obj, first) {
        $('#beforedispatchtowhForm input[name="limit"]').val(obj.limit); //保障下次的分页请求中带有的值正确
        $('#beforedispatchtowhForm input[name="page"]').val(obj.curr); //保障下次的分页请求中带有的值正确
        //首次不执行
        if (!first) {
          data.page = obj.curr;
          data.limit = obj.limit;
          //搜索
          let todispatchData = bdtowhGetFormData();
          toDespatchOrderSubmitAndRenderTable(todispatchData, statuVal);
        }

      }
    });
  }
  //渲染商品信息表格
  function toDespatchOrderProdTableRender (data) {
    tableIns = table.render({
      elem: '#toDespatchOrder_product_table',
      id: 'toDespatchOrder_product_table',
      data: data || [],
      cols: [
        [
          { title: "图片", field: "imageUrl", templet: "#toDespatchOrder_detail_img_tpl" },
          { title: "Item_ID", field: "itemId", templet: "#toDespatchOrder_edit_ListingID" },
          { title: "商品SKU", field: "prodSSku",sort:true,templet:"#toDespatchOrder_edit_Prodsku",width:150}, //
          { title: "店铺SKU", field: "storeSSku",sort:true, templet: "<div><div name='storeSSku'>{{d.storeSSku||''}}</div>" },
          { title: '可用库存', field: "availableStock",sort:true, templet: '<div><span style="font-weight:700;font-size:24px;color:#f00;">{{d.availableStock}}</span></div>' },
          { title: "平台数量", field: "platQuantity", width: 60 },
          { title: '商品数量', field: "prodQuantity", templet: "#toDespatchOrder_edit_prodQuantity" },
          { title: '商品总量', field: "allCount",sort:true },
          { title: '销售金额', field: "platOrderDetailAmt", templet: "#toDespatchOrder_edit_platOrderDetailAmt", width:100 },
          {title: '商品价格',field: "prodPrice", templet: '#toDespatchOrder_edit_platOrderProdPrice', width: 120},
          {title: '商品信息',field: "prodInfo", templet: '#toDespatchOrder_edit_platOrderProdInfo', width: 140},
          { title: "入库要求", field: "packDesc" },
          {title: '订单信息',field: "orderInfo", templet: '#toDespatchOrder_edit_platOrderOrderInfo', width: 180},
          { title: '操作', toolbar: "#toDespatchOrder_edit_option", width: 80 }
        ]
      ],
      page: false,
      limit: 300,
      done: function (res) {
        let newArr = delSameObjValue(layui.table.cache.toDespatchOrder_product_table, 'allCount', ['prodSSku'], ['prodQuantity']);
        layui.table.cache.toDespatchOrder_product_table.forEach((item, index) => {
          newArr.forEach(cItem => {
            if (item.prodSSku == cItem.prodSSku) {
              item.allCount = cItem.allCount
            }
          })
          $("#toDespatchOrder_product_table").next().find(`tr[data-index=${index}] td[data-field=allCount] div`).text(res.data[index].allCount)
        })
        toDespatchOrderStyle('toDespatchOrder_product_table')
        imageLazyload();
        table.on("tool(toDespatchOrder_product_table)", function (obj) {
          if (obj.event = "edit_prod_delete") {
            layer.confirm('请确认是否删除子订单所有信息', {
              title: '提示',
              icon: 3,
              btn: ['确定', '取消'] //按钮
            }, function (layerIndex) {
              if (obj.data && obj.data.platDetailTranscationId) {
                return layer.msg('该子订单非手动添加，不支持删除')
              } else if (obj.data && obj.data.platQuantity !== undefined && obj.data.platQuantity != '0') {
                return layer.msg('该子订单非手动添加，不支持删除')
              }
              var index = getIndex('id', data, obj.data.id)
              data.splice(index, 1)
              obj.del();
              layer.close(layerIndex)
            });
          }
        })
      }
    })
    return tableIns
  }
  //页面操作事件start
  //海外仓操作
  //1、提交万邑通出库单
  $("#toDespatchOrder_towinit").click(function () {
    let ids = getToDespatchOrderTableSelectIds();
    if (!ids || ids.length <= 0) {
      layer.msg("未选择订单", { icon: 0 });
      return;
    }
    //提交到万邑通出库单
    toWinitOrder(ids.join(","), function (returnData) {
      layui.admin.batchResultAlert("提交万邑通出库单:", returnData.data, function () { });
      //处理完成后不刷新页面
    });
  });
  //2、同步万邑通跟踪号
  $("#toDespatchOrder_syncwinittrackno").click(function () {
    let ids = getToDespatchOrderTableSelectIds();
    if (!ids || ids.length <= 0) {
      layer.msg("未选择订单", { icon: 0 });
      return;
    }
    //同步万邑通出库单跟踪号
    syncWinitTrackNo(ids.join(","), function (returnData) {
      //处理完成后不刷新页面
      layui.admin.batchResultAlert("同步万邑通出库单跟踪号:", returnData.data, function () { });
    });

  });
  //3、同步万邑通预估派送费
  $("#toDespatchOrder_syncWinitOutOrderCalcFee").click(function () {
    let ids = getToDespatchOrderTableSelectIds();
    if (!ids || ids.length <= 0) {
      layer.msg("未选择订单", { icon: 0 });
      return;
    }
    syncWinitOutOrderCalcFee(ids.join(","), function (returnData) {
      //处理完成后不刷新页面
      layui.admin.batchResultAlert("同步万邑通预估派送费:", returnData.data, function () { });
    });

  });
  //派至仓库
  $("#toDespatchOrder_dispatch").click(function () {
    let ids = getToDespatchOrderTableSelectIds();
    if (!ids || ids.length < 1) {
      layer.msg('请选择订单', { icon: 7 });
      return;
    }
    commCheckLogisticsCloseTime(ids, function (idList) {
      zttCommonProgressBar({ type: 8, ids: idList.join(",") }, function (progressData) {
        let returnData = { data: progressData }
        layui.admin.batchResultAlert("派至仓库:", returnData.data, function (errIdsArr) {
          deleteTableRow_toDespatchOrder(idList, errIdsArr)
        })
      })
    })
  });
  //优选仓拒单
  $('#toDespatchOrder_rejectOrderdabao').on('click', function(){
    let ids = getToDespatchOrderTableSelectIds();
    if (!ids || ids.length < 1) {
        layer.msg('请选择订单', { icon: 7 });
        return;
    }
    commonRejectOrderdabao(ids, deleteTableRow_toDespatchOrder);
  });
  //取消wishpost订单
  $('#toDespatchOrder_cancelwishpost').click(function () {
    var ids = getToDespatchOrderTableSelectIds();
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
      success: function (layero, index) {
        $(layero).find('.layui-layer-content').html($("#toDespatchOrder_cancelWishpostTpl").html());
        layui.form.render();
      },
      yes: function (index, layero) {
        var cancelReasonCode = $("#toDespatchOrder_cancelWishpostForm select[name=cancelReasonCode]").val();
        var invalidReason = $("#toDespatchOrder_cancelWishpostForm input[name=invalidReason]").val();
        //取消wishpost物流单
        initAjax('/platorder/cancelwishpost.html', 'post', {
          ids: ids.join(','),
          cancelReasonCode: cancelReasonCode,
          invalidReason: invalidReason
        }, function (returnData) {
          layui.admin.batchResultAlert("取消wishpost订单:", returnData.data, function (errIdsArr) {
            deleteTableRow_toDespatchOrder(ids, errIdsArr)
          });
        }, 'application/x-www-form-urlencoded')
      }
    })
  });
  //取消Edisebay订单
  $('#toDespatchOrder_cancelEdisebay').click(function () {
    var ids = getToDespatchOrderTableSelectIds();
    if (ids.length <= 0) {
      layer.msg('请选择订单', { icon: 7 });
      return
    }
    commonOrderConfirmLayer(ids.length, function (index) {
      initAjax('/platorder/cancelEdisebay.html', 'post', { ids: ids.join(',') }, function (returnData) {
        layer.close(index);
        layui.admin.batchResultAlert("取消Edisebay订单:", returnData.data, function (errIdsArr) {
          deleteTableRow_toDespatchOrder(ids, errIdsArr)
        });
      }, 'application/x-www-form-urlencoded');
    });
  });

  //修改跟踪号
  $('#toDespatchOrder_editTrackingNo').on('click', function () {
    let data = toDespatchOrder_gridOptions.api.getSelectedRows();
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
      content: $('#toDespatchOrder_editTrackingNoLayer').html(),
      id: 'toDespatchOrder_editTrackingNoLayerId',
      success: function (layero) {
        let getTpl = toDespatchOrder_editTrackingNoFormTpl.innerHTML;
        let getUl = document.getElementById('toDespatchOrder_editTrackingNoForm');
        laytpl(getTpl).render(info, function (html) { //渲染到表格
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
          updateTableRow_toDespatchOrder(ids, [])
        })
      }

    });
  });
  // 速卖通子单申请跟踪号
  $("#toDespatchOrder_aliexpressChildApplyTrackingNo").click(function(){
    var ids = getToDespatchOrderTableSelectIds();
    if (ids.length <= 0) {
      layer.msg('请选择订单', { icon: 7 });
      return
    }
    let params={
      orderIds:ids.toString()
    }
    commonReturnPromise({
      url: '/lms/platorder/batchSubmitCustomApplyLogisticsNo',
      type: 'post',
      params: params
    }).then(result => {
      let index=layui.admin.batchResultAlert("速卖通子单申请跟踪号:", result, function (errIdsArr) {
        deleteTableRow_toDespatchOrder(ids, errIdsArr);
        layer.close(index);
      });
    });
  })
  // 获取跟踪号
  $('#toDespatchOrder_getEdisebay').click(function () {
    var ids = getToDespatchOrderTableSelectIds();
    if (ids.length <= 0) {
      layer.msg('请选择订单', { icon: 7 });
      return
    }
    initAjax('/unauditorder/getlogistrackingno.html', 'post', {
      ids: ids.join(',')
    }, function (returnData) {
      layui.admin.batchResultAlert("获取跟踪号完成:", returnData.data, function (errIdsArr) {
        deleteTableRow_toDespatchOrder(ids, errIdsArr)
      });
    }, 'application/x-www-form-urlencoded')
  });
  //手动指定跟踪号
  $('#toDespatchOrder_updatelogistype').click(function () {
    var ids = getToDespatchOrderTableSelectIds();
    if (ids.length <= 0) {
      layer.msg('请选择订单', { icon: 7 });
      return
    }
    layer.open({
      type: 1,
      title: '手动指定物流',
      btn: ['确认', '取消'],
      area: ['40%', '60%'],
      content: "loading",
      success: function (layero, index) {
        $(layero).find('.layui-layer-content').html($("#toDespatchOrder_updateLogisTypeTpl").html());
        //初始化物流公司
        appendSelect($('#toDespatchOrder_updateLogisTypeForm').find('select[name="logisCompany"]'), toDespatchOrder_company['companys'], 'id', 'cnName')
        commonOrderGetLogisticAjax().then(logisTypeArr => {
          appendSelect($('#toDespatchOrder_updateLogisTypeForm').find('select[name="logisType"]'), logisTypeArr, 'id', 'name')
          form.render()
        });
        //物流公司改变触发
        form.on('select(toDespatchOrder_logisCompany)', function (obj) {
          var logisticsCompanyId = obj.value;
          commonOrderGetLogisticAjax({ logisticsCompanyId: logisticsCompanyId }).then(logisTypeArr => {
            appendSelect($('#toDespatchOrder_updateLogisTypeForm').find('select[name="logisType"]'), logisTypeArr, 'id', 'name')
            form.render()
          });
        })
        layui.form.render();
      },
      yes: function (index, layero) {
        var logisTypeId = $("#toDespatchOrder_updateLogisTypeForm select[name=logisType]").val();
        if (!logisTypeId) {
          layer.msg("未选择物流方式", { icon: 7 });
          return;
        }
        //指定物流方式
        initAjax('/unauditorder/updatelogistype.html', 'post', {
          ids: ids.join(','),
          logisTypeId: logisTypeId
        }, function (returnData) {
          layui.admin.batchResultAlert("手动指定物流:", returnData.data, function (errIdsArr) {
            updateTableRow_toDespatchOrder(ids, errIdsArr)
            layer.close(index);
          });
        }, 'application/x-www-form-urlencoded')
      }
    })
  });
  //申请跟踪号
  $('#toDespatchOrder_applylogisno').click(function () {
    var ids = getToDespatchOrderTableSelectIds();
    if (ids.length <= 0) {
      layer.msg('请选择订单', { icon: 7 });
      return
    }
    zttCommonProgressBar({ type: 9, ids: ids.join(',') }, function (progressData) {
      let returnData = { data: progressData };
      layui.admin.batchResultAlert("申请跟踪号:", returnData.data, function (errIdsArr) {
        // 申请失败的数据，除已申请过跟踪号，其它的均删除当前行,数据会转到申请失败页签
        returnData.data.failResults.forEach(item => {
          if (!item.includes('已申请过跟踪号') && item.includes('[') && item.includes(']')) {
            let item1 = item.split("[")[1];
            let id = item1.split("]")[0];
            // errIdsArr = await errIdsArr.filter(item => item == id)
            errIdsArr.forEach((cItem, index) => {
              if (cItem == id) {
                errIdsArr.splice(index, 1)
              }
            })
          }
        })
        deleteTableRow_toDespatchOrder(ids, errIdsArr)
      });
    });
  });
  //清空跟踪号
  $('#toDespatchOrder_removelogisno').click(function () {
    var ids = getToDespatchOrderTableSelectIds();
    if (ids.length <= 0) {
      layer.msg('请选择订单', { icon: 7 });
      return
    }
    commonOrderConfirmLayer(ids.length, function (index) {
      initAjax('/unauditorder/removelogistrackingno.html', 'post', { ids: ids.join(',') }, function (returnData) {
        // layer.msg('清空跟踪号成功', { icon: 1 });
        layer.close(index);
        deleteTableRow_toDespatchOrder(ids, [])
      }, 'application/x-www-form-urlencoded');
    })
  });

  //打印面单
  $('#toDespatchOrder_printlogistpl').click(function () {
    var ids = getToDespatchOrderTableSelectIds();
    if (ids.length <= 0) {
      layer.msg('请选择订单', { icon: 7 });
      return
    }
    $.ajax({
      type: "POST",
      url: ctx + "/logistics/batch/print.html",
      data: { orderIdStr: ids.join(',') },
      success: function (returnData) {
        var paramsMapList = returnData.successResults;
        if (paramsMapList && paramsMapList.length > 0) {

          // joom 平台的数据打印宽度需要是150，
          // var checkStatus = table.checkStatus('beforedispatchtowh_dispatchTable')
          // var data = checkStatus.data
          let data = toDespatchOrder_gridOptions.api.getSelectedRows();
          if (data.filter(item => item.platCode == 'joom').length) {
            var _paramsMapList = paramsMapList.map(item => {
              let _item = data.find(elem => elem.id == item.orderId)
              if (_item.platCode == 'joom') {
                item.width = 100
                item.height = 150
              }
              return item
            })
          } else {
            var _paramsMapList = paramsMapList
          }

          for (const item of _paramsMapList) {
            var obj = {};
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
        if (returnData.failResults && returnData.failResults.length > 0) {
          let str = '';
          returnData.failResults.forEach(item => {
            str += item + "<br>"
          })
          layer.alert(str, { icon: 2 })
        }
      }, error: function (err) {
        console.log(err)
      }
    })
  });
  //标记异常
  $('#toDespatchOrder_markException').click(function () {
    var ids = getToDespatchOrderTableSelectIds();
    if (!ids || ids.length < 1) {
      layer.msg('请选择订单', { icon: 7 });
      return;
    }
    commonOrderConfirmLayer(ids.length, function (index) {
      initAjax('/unauditorder/markabnormal.html', 'post', { ids: ids.join(',') }, function (returnData) {
        layui.admin.batchResultAlert("订单标记异常:", returnData.data, function (errIdsArr) {
          deleteTableRow_toDespatchOrder(ids, errIdsArr)
        });
      }, 'application/x-www-form-urlencoded')
    });
  });
  //转取消订单
  $('#toDespatchOrder_toCancel').click(function () {
    let ids = getToDespatchOrderTableSelectIds();
    if (!ids || ids.length < 1) {
      layer.msg('请选择订单', { icon: 7 });
      return;
    }
    commonOrderConfirmLayer(ids.length, function (index) {
      initAjax('/abnormalorder/tocancel.html', 'post', { ids: ids.join(",") }, function (returnData) {
        layui.admin.batchResultAlert("转取消订单:", returnData.data, function (errIdsArr) {
          deleteTableRow_toDespatchOrder(ids, errIdsArr)
        });
      }, 'application/x-www-form-urlencoded');
    });
  });
  //直接转已发货
  $('#toDespatchOrder_toShipped').click(function () {
    let ids = getToDespatchOrderTableSelectIds();
    if (!ids || ids.length < 1) {
      layer.msg('请选择订单', { icon: 7 });
      return;
    }
    commonOrderConfirmLayer(ids.length, function (index) {
      initAjax('/platorder/toshipped.html', 'post', { ids: ids.join(',') }, function (returnData) {
        layer.close(index);
        layui.admin.batchResultAlert("直接转已发货:", returnData.data, function (errIdsArr) {
          deleteTableRow_toDespatchOrder(ids, errIdsArr)
        });
      }, 'application/x-www-form-urlencoded');
    });
  });
  //批量修改收件信息
  $('#toDespatchOrder_batchEditReceiver').on('click', function () {
    let data = toDespatchOrder_gridOptions.api.getSelectedRows();
    if (!data.length) {
      return layer.msg('请先选中数据', { icon: 7 });
    }
    layer.open({
      type: 1,
      title: '批量修改收件信息',
      btn: ['保存', '关闭'],
      content: $('#toDespatchOrder_batchEditReceiverLayer').html(),
      id: 'toDespatchOrder_batchEditReceiverLayerId',
      area: ['95%', '600px'],
      success: function (layero, index) {
        let getTpl = toDespatchOrderBatchEditReceiverContainerTpl.innerHTML;
        let getUl = document.getElementById('toDespatchOrderBatchEditReceiverContainer');
        laytpl(getTpl).render(data, function (html) { //渲染到表格
          getUl.innerHTML = html;
          form.render(null, 'toDespatchOrderBatchEditReceiverContainer');
          toDespatchOrder_batchEditReceiverHandle('toDespatchOrderBatchEditReceiverContainer');
        });
      },
      yes: function (index, layero) {
        let trs = layero.find('tbody>tr');
        let arr = [];
        for (let i = 0; i < trs.length; i++) {
          let tr = trs[i];
          let isCked = $(tr).find('input.receiverCheck').is(':checked');
          if (isCked) {
            let obj = {};
            //获取选中的值保存
            obj.id = $(tr).find('.id').text();
            obj.shippingUsername = $(tr).find('.shippingUsername [name=shippingUsername]').val();
            obj.shippingState = $(tr).find('.shippingState [name=shippingState]').val();
            obj.shippingCity = $(tr).find('.shippingCity [name=shippingCity]').val();
            obj.shippingZip = $(tr).find('.shippingZip [name=shippingZip]').val();
            obj.shippingStreet1 = $(tr).find('.shippingStreet1 [name=shippingStreet1]').val();
            obj.shippingStreet2 = $(tr).find('.shippingStreet2 [name=shippingStreet2]').val();
            obj.shippingPhoneNumber = $(tr).find('.shippingPhoneNumber [name=shippingPhoneNumber]').val();
            arr.push(obj);
          }
        }
        if (arr.length == 0) {
          return layer.msg('请选择需要保存的数据', { icon: 7 });
        } else {
          commonReturnPromise({
            url: '/lms/undispatch/batchUpdateOrderInfo.html',
            type: 'post',
            contentType: 'application/json',
            params: JSON.stringify(arr)
          }).then(res => {
            layer.close(index);
            layui.admin.batchResultAlert("批量修改收件信息:", res, function () {
              $('#toDespatchOrderSearch').click();
            });
          });
        }
      }
    });
  });
  //具体的修改操作
  function toDespatchOrder_batchEditReceiverHandle (containerId) {
    let $contain = $('#' + containerId);
    commonSelectAllAndInvert({
      container: $contain,
      parentClass: 'receiverAllCheck',
      sonClass: 'receiverCheck'
    });
    $('#toDespatchOrderBatchEditReceiverContainer thead').on('keyup', 'input.layui-input', function (e) {
      if (e.keyCode == 13) {
        let val = e.target.value;
        let name = e.target.classList[1] || '';
        let tds = $contain.find('.shipping' + name);
        for (let i = 0; i < tds.length; i++) {
          let td = tds[i];
          let isCked = $(td).parents('tr').find('input.receiverCheck').is(':checked');
          if (isCked) {
            $(td).find(`input[name=shipping${name}]`).val(val);
          }
        }
      }
    });
  }

  //批量备注功能
  $('#toDespatchOrder_batchRemark').on('click', function () {
    let idsArr = getToDespatchOrderTableSelectIds();
    if (idsArr.length == 0) {
      return layer.msg('请先选择数据', { icon: 7 });
    }
    let ids = idsArr.join('-');
    commonDirectMailRemarkBatch(ids, toDespatchOrder_gridOptions);
  });

  // 更新商品信息
  $('#toDespatchOrder_updateCostInfo').click(function () {
    let idsArr = getToDespatchOrderTableSelectIds();
    if (idsArr.length == 0) {
      return layer.msg('请先选择数据', { icon: 7 });
    }
    let ids = idsArr.join(',');
    commonReturnPromise({
      url: '/lms/unauditorder/updateprodinfo.html',
      type: 'post',
      params: { ids },
    }).then(res => {
      layer.msg(res, { icon: 1 })
      updateTableRow_toDespatchOrder(idsArr, [])
    })
  })
  //一键派单-ztt20220826
  $('#toDespatchOrder_oneClickDelivery').click(function () {
    commonReturnPromise({
      url: '/lms/undispatch/dispatchPackage.html',
    }).then(res => {
      layui.admin.batchResultAlert("一键派单状态:", res, function (errIdsArr) {
        // updateTableRow_toDespatchOrder([], errIdsArr)
        $('#toDespatchOrderSearch').click();
      });
    })
  });
  //库存占用规则-ztt20220826
  $('#toDespatchOrder_holdStockTask').click(function () {
    layer.confirm('根据库存占用规则对缺货、待派单订单进行库存占用', function (result) {
      if (result) {
        initAjax('/abnormalorder/holdstocktask.html', 'post', {}, function (returnData) {
          layui.admin.batchResultAlert("订单重新走库存占用规则:", returnData.data, function () {
            $('#toDespatchOrderSearch').click();
          });
        }, 'application/x-www-form-urlencoded');
      }
    });
  });
  //转至待发货-ztt20230112
  $('#toDespatchOrder_towaitToShip').on('click', function () {
    let idsArr = getToDespatchOrderTableSelectIds();
    if (idsArr.length == 0) {
      return layer.msg('请先选择数据', { icon: 7 });
    }
    commCheckLogisticsCloseTime(idsArr, function (idList) {
      let ids = idList.join(',');
      commonReturnPromise({
        url: '/lms/undispatch/toUnShipped.html',
        type: 'post',
        params: { ids },
      }).then(res => {
        layui.admin.batchResultAlert("转至待发货:", res, function (errIdsArr) {
          deleteTableRow_toDespatchOrder(idsArr, errIdsArr)
        });
      })
    })
  });
  //转待核单-ztt20230112
  $('#toDespatchOrder_toCheckList').on('click', function () {
    let idsArr = getToDespatchOrderTableSelectIds();
    if (idsArr.length == 0) {
      return layer.msg('请先选择数据', { icon: 7 });
    }
    commCheckLogisticsCloseTime(idsArr, function (idList) {
      let ids = idList.join(",")
      commonReturnPromise({
        url: "/lms/undispatch/toUnChecked.html",
        type: "post",
        params: { ids },
      }).then(res => {
        layui.admin.batchResultAlert("转至待发货:", res, function (errIdsArr) {
          deleteTableRow_toDespatchOrder(idsArr, errIdsArr)
        })
      })
    })
  });
  //补货检测-ztt20230203
  $('#toDespatchOrder_replenishCheck').click(function () {
    let ids = getToDespatchOrderTableSelectIds();
    if (!ids || ids.length < 1) {
      layer.msg('请选择订单', { icon: 7 });
      return;
    }
    //获取数据状态码是不是502
    let data = toDespatchOrder_gridOptions.api.getSelectedRows();
    let processStatusArr= (data || []).map(function (item) {
      return item.processStatus
    });

    initAjax('/abnormalorder/replenishcheck.html', 'post', { ids: ids.join(",") }, function (returnData) {
      if(processStatusArr[0] == 502){
        layui.admin.batchResultAlert("补货检测:", returnData.data, function (errIdsArr) {
          deleteTableRow_toDespatchOrder(ids,errIdsArr)
        },true,false,false);
      }else{
        layui.admin.batchResultAlert("补货检测:", returnData.data, function (errIdsArr) {
          deleteTableRow_toDespatchOrder(ids,errIdsArr)
        },true,false,true);
      }
    }, 'application/x-www-form-urlencoded');
  });
  // 转至仓库拦截
  $('#toDespatchOrder_toWarehouseIntercept').click(function () {
    let ids = getToDespatchOrderTableSelectIds();
    if (!ids || ids.length < 1) {
      layer.msg('请选择订单', { icon: 7 });
      return;
    }
    commCheckLogisticsCloseTime(ids, function (idList) {
      zttCommonProgressBar({ type: 11, ids: idList.join(",") }, function (progressData) {
        let returnData = { data: progressData }
        layui.admin.batchResultAlert("转至仓库拦截:", returnData.data, function (errIdsArr) {
          deleteTableRow_toDespatchOrder(idList, errIdsArr)
        })
      })
    })
  });
  //wish退款
  $('#toDespatchOrder_wishRefund').on('click', function () {
    let data = toDespatchOrder_gridOptions.api.getSelectedRows();
    if (!data || data.length < 1) {
      layer.msg('请选择订单', { icon: 7 });
      return;
    }
    originOrderWishRefund(data, 'batch', function () {
      $('#toDespatchOrderSearch').trigger('click')
    })
  })
  //ebay取消
  $('#toDespatchOrder_cancelOrderEbay').on('click', function () {
    let idsArr = getToDespatchOrderTableSelectIds();
    if (!idsArr || idsArr.length < 1) {
      layer.msg('请选择订单', { icon: 7 });
      return;
    }
    layer.open({
      type: 1,
      title: '取消ebay订单',
      content: $('#toDespatchOrder_cancelEbayTpl').html(),
      area: ['40%', '30%'],
      id: 'toDespatchOrder_cancelEbayTplId',
      btn: ['确定', '关闭'],
      success: function (layero, index) {
        form.render();
      },
      yes: function (index, layero) {
        var cancelReason = layero.find('[name=cancelReason]:checked').val();
        layer.close(index);
        commonReturnPromise({
          url: '/lms/unauditorder/cancelorder/ebay.html',
          type: 'post',
          params: {
            ids: idsArr.join(),
            cancelReason: cancelReason
          }
        }).then(function (result) {
          layui.admin.batchResultAlert("ebay取消订单完成:", result, function (errIdsArr) {
            deleteTableRow_toDespatchOrder(idsArr, errIdsArr)
          }, true, true);
        }).catch(function (resErr) {
          layer.msg(resErr.message || resErr, { icon: 2 });
        });
      }
    });


  });
  //tiktok取消
  function toDespatchOrder_tiktokCancelHandle(ids){
    layer.open({
      type: 1,
      title: '取消tiktok订单',
      content: $('#toDespatchOrder_cancelTiktokTpl').html(),
      area: ['40%', '30%'],
      id: 'toDespatchOrder_cancelTiktokTplId',
      btn: ['确定', '关闭'],
      success: function (layero) {
        commonReturnPromise({
          url: '/lms/enum/getByKey/OrderCancelReasonEnum'
        }).then(res => {
          let radioDom = '';
          if(res && res.length > 0){
            res.forEach(item => {
              if(item.key == 'SELLER_CANCEL_PAID_REASON_ADDRESS_NOT_DELIVER'){
                radioDom +=`<input type="radio" checked name="cancelReason" value="${item.key}" title="${item.value}" >`
              }else{
                radioDom +=`<input type="radio" name="cancelReason" value="${item.key}" title="${item.value}">`
              }
            });
          }
          layero.find('.layui-input-block').html(radioDom);
          form.render('radio');
        });
      },
      yes: function (index, layero) {
        var cancelReason = layero.find('[name=cancelReason]:checked').val();
        layer.close(index);
        commonReturnPromise({
          url: '/lms/unauditorder/cancelorder',
          type: 'post',
          params: {
            ids: ids.join(),
            cancelReason: cancelReason
          }
        }).then(function (result) {
          layui.admin.batchResultAlert("tiktok取消订单完成:", result, function (errIdsArr) {
            deleteTableRow_toDespatchOrder(ids, errIdsArr)
          }, true, true);
        }).catch(function (resErr) {
          layer.msg(resErr.message || resErr, { icon: 2 });
        });
      }
    });
  }
  $('#toDespatchOrder_cancelOrderTiktok').on('click', function(){
    let idsArr = getToDespatchOrderTableSelectIds();
    if (!idsArr || idsArr.length < 1) {
      layer.msg('请选择订单', { icon: 7 });
      return;
    }
    toDespatchOrder_tiktokCancelHandle(idsArr);
  });
  //更新订单状态
  $('#toDespatchOrder_syncOrderStatus').on('click', function () {
    let idsArr = getToDespatchOrderTableSelectIds(), platOrderId = getTableSelectPlatOrderIds();
    let ids = idsArr.join()
    if (!idsArr || idsArr.length < 1) {
      layer.msg('请选择订单', { icon: 7 });
      return;
    }
    commonReturnPromise({
      url: '/lms/unauditorder/syncplatstatus.html',
      type: 'post',
      params: { ids }
    }).then(function (returnData) {
      layui.admin.batchResultAlert("更新订单状态完成:", returnData, function (errIdsArr) {
        updateTableRow_toDespatchOrder(idsArr, errIdsArr)
      });
    }).catch(function (resErr) {
      layer.msg(resErr.message || resErr, { icon: 2 });
    });
  });
  //标记平台发货
  $('#toDespatchOrder_markDelivery').on('click', function () {
    let idsArr = getToDespatchOrderTableSelectIds();
    if (!idsArr || idsArr.length < 1) {
      layer.msg('请选择订单', { icon: 7 });
      return;
    }
    zttCommonProgressBar({ type: 10, ids: idsArr.join() }, function (progressData) {
      layui.admin.batchResultAlert("标记平台发货:", progressData, function (errIdsArr) {
        updateTableRow_toDespatchOrder(idsArr, errIdsArr)
      });
    });
  });

  //解密地址
  $('#toDespatchOrder_decryptAddress').on('click', function () {
    let ids = getToDespatchOrderTableSelectIds();
    if (ids.length > 0) {
      commonReturnPromise({
        type: 'post',
        url: '/lms/platorder/decrypt/list',
        contentType: 'application/json',
        params: JSON.stringify(ids)
      }).then(res => {
        layui.admin.batchResultAlert("解密地址:", res, function (errIdsArr) {
          updateTableRow_toDespatchOrder(ids, errIdsArr)
        });
      });
    } else {
      layer.msg('请选择订单', { icon: 7 });
    }
  });
  //修改发货声明
  $('#toDespatchOrder_deliverDeclare').on('click', function () {
    let ids = getToDespatchOrderTableSelectIds();
    if (ids.length > 0) {
      commonReturnPromise({
        url: '/lms/unauditorder/modifyShipping.html',
        params: {
          ids: ids.join(',')
        }
      }).then(res => {
        layui.admin.batchResultAlert("修改发货声明:", res, function () {
          $('#toDespatchOrderSearch').click();
        });
      });
    } else {
      layer.msg('请选择订单', { icon: 7 });
    }
  });
  // shopee发送消息
  $("#toDespatchOrder_shopeeEmail").on("click", function () {
    const curOrders = toDespatchOrder_gridOptions.api.getSelectedRows()
    commonorderShopeeSendMsg(curOrders, 'shopee', true)
  })
  // tiktok发送消息
  $("#toDespatchOrder_tiktokEmail").on("click", function () {
    const curOrders = toDespatchOrder_gridOptions.api.getSelectedRows()
    commonorderShopeeSendMsg(curOrders, 'tiktok')
  })
  // amazon 邮件
  $("#toDespatchOrder_amazonEmail").on("click", function () {
    orderAmazonEmail(toDespatchOrder_gridOptions)
  })
  // ebay 邮件
  $("#toDespatchOrder_eBayEmail").on("click", function () {
    orderEbayEmail(toDespatchOrder_gridOptions)
  })
  //匹配物流方式
  $('#toDespatchOrder_matchLogis').click(function () {
    let ids = getToDespatchOrderTableSelectIds();
    if (!ids || ids.length < 1) {
      layer.msg('请选择订单', { icon: 7 });
      return;
    }
    initAjax('/unauditorder/matchlogistype.html', 'post', { ids: ids.join(',') }, function (returnData) {
      layui.admin.batchResultAlert("匹配物流完成:", returnData.data, function (errIdsArr) {
        updateTableRow_toDespatchOrder(ids, errIdsArr)
      });
    }, 'application/x-www-form-urlencoded')
  });

  //转待审核
  $('#toDespatchOrder_toAudit').click(function () {
    let ids = getToDespatchOrderTableSelectIds();
    if (!ids || ids.length < 1) {
      layer.msg('请选择订单', { icon: 7 });
      return;
    }
    commonOrderConfirmLayer(ids.length, function (index) {
      initAjax('/abnormalorder/toaudit.html', 'post', { ids: ids.join(",") }, function (returnData) {
        layer.close(index);
        layui.admin.batchResultAlert("订单转待审核:", returnData.data, function (errIdsArr) {
          deleteTableRow_toDespatchOrder(ids, errIdsArr)
        });
      }, 'application/x-www-form-urlencoded');
    });
  });
  //提交到万邑通海外仓出库单
  function toWinitOrder (ids, func) {
    initAjax('/unauditorder/towinit.html', 'post', { ids: ids }, function (returnData) {
      if (func) {
        func(returnData)
      }
    }, 'application/x-www-form-urlencoded')
  }
  //同步万邑通海外仓出库单单号
  function syncWinitTrackNo (ids, func) {
    initAjax('/unauditorder/syncwinittrackno.html', 'post', { ids: ids }, function (returnData) {
      if (func) {
        func(returnData)
      }
    }, 'application/x-www-form-urlencoded')
  }
  //同步万邑通预估派送费
  function syncWinitOutOrderCalcFee (ids, func) {
    initAjax('/unauditorder/syncwinitoutordercalcfee.html', 'post', { ids: ids }, function (returnData) {
      if (func) {
        func(returnData)
      }
    }, 'application/x-www-form-urlencoded')
  }
  //页面操作事件end
  function getToDespatchOrderTableSelectIds () {
    let data = toDespatchOrder_gridOptions.api.getSelectedRows();
    var ids = (data || []).map(function (item) {
      return item.id
    });
    return ids;
  }

  //页面操作事件end
  function getTableSelectPlatOrderIds () {
    let data = toDespatchOrder_gridOptions.api.getSelectedRows();
    var platOrderId = (data || []).map(function (item) {
      return item.platOrderId
    });
    return platOrderId;
  }

  // 页面数据请求----------------------------------------
  function isToDespatchOrderObjectValueEqual (a, b) {
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
      if ((propName != "logisApplySearchStatus") && a[propName] !== b[propName]) {
        return false;
      }
    }
    return true;
  }

  //动态添加页签
  function appendToDespatchOrderTab (data) {
    var html = ""
    for (var i in data) {
      if (data[i].name === '1') {
        html += '<li class="layui-this" data-index="' + data[i].name + '">' + data[i].value + '(<span>0</span>)</li>'
      } else {
        html += '<li data-index="' + data[i].name + '">' + data[i].value + '(<span>0</span>)</li>'
      }
    }
    $('#beforedispatchtowh_dispatchStatusTabs ul').empty().append(html)
  }

    // 保存设置
    $("#beforedispatchtowh_saveOrderConfig").on("click", function () {
      //获取到当前属于哪个页签,找到对应的gridOptions
      let $index = $("#beforedispatchtowh_tabs")
        .find("li.layui-this")
        .attr("data-index");
      let orderColumnName = "";
      let orderColumnState = "";
      if ($index == "audit") {
        //待审核页面
        orderColumnName = "beforedispatchtowhAuditOrderColumn";
        orderColumnState = gridOptions.columnApi.getColumnState();
      } else if ($index == "dispatch" || $index == "lack") {
        //待派单/缺货
        orderColumnName = "beforedispatchtowhToDespatchOrderColumn";
        orderColumnState =
          toDespatchOrder_gridOptions.columnApi.getColumnState();
      } else if ($index == "abnormal") {
        //异常
        orderColumnName = "beforedispatchtowhAbnormalOrderColumn";
        orderColumnState = abnormalOrder_gridOptions.columnApi.getColumnState();
      }
      window.localStorage.setItem(
        orderColumnName,
        JSON.stringify(orderColumnState)
      );
      layer.msg("保存设置成功");
    });

    //复制订单号
    $('#beforedispatchtowh_copyOrderNum').on('click', function(){
      //获取到当前属于哪个页签,找到对应的gridOptions
      let $index= $('#beforedispatchtowh_tabs').find('li.layui-this').attr('data-index');
      let data = [];
      if($index == 'audit'){ //待审核页面
        data = gridOptions.api.getSelectedRows();
      }else if($index == 'dispatch' || $index == 'lack'){//待派单/缺货
        data = toDespatchOrder_gridOptions.api.getSelectedRows();
      }else if($index == 'abnormal'){//异常
        data = abnormalOrder_gridOptions.api.getSelectedRows();
      }
      let ids = data.map(item => item.id);
      if(ids.length ==0){
        return layer.msg('请先选择需要复制的数据', {icon:7});
      }
      beforedispatchtowh_copyNumFn(ids.join(','));
    });
    //复制店铺单号
    $('#beforedispatchtowh_copyStoreNum').on('click', function(){
      //获取到当前属于哪个页签,找到对应的gridOptions
      let $index= $('#beforedispatchtowh_tabs').find('li.layui-this').attr('data-index');
      let data = [];
      if($index == 'audit'){ //待审核页面
        data = gridOptions.api.getSelectedRows();
      }else if($index == 'dispatch' || $index == 'lack'){//待派单/缺货
        data = toDespatchOrder_gridOptions.api.getSelectedRows();
      }else if($index == 'abnormal'){//异常
        data = abnormalOrder_gridOptions.api.getSelectedRows();
      }
      let storeIds = data.map(item => item.platOrderId);
      if(storeIds.length ==0){
        return layer.msg('请先选择需要复制的数据', {icon:7});
      }
      beforedispatchtowh_copyNumFn(storeIds.join(','));
    });
    //复制itemId
    $('#beforedispatchtowh_copyItemId').on('click', function(){
      //获取到当前属于哪个页签,找到对应的gridOptions
      let $index= $('#beforedispatchtowh_tabs').find('li.layui-this').attr('data-index');
      let data = [];
      if($index == 'audit'){ //待审核页面
        data = gridOptions.api.getSelectedRows();
      }else if($index == 'dispatch' || $index == 'lack'){//待派单/缺货
        data = toDespatchOrder_gridOptions.api.getSelectedRows();
      }else if($index == 'abnormal'){//异常
        data = abnormalOrder_gridOptions.api.getSelectedRows();
      }
      if(data.length ==0){
        return layer.msg('请先选择需要复制的数据', {icon:7});
      }
      let itemIdsArr = [...new Set(data.map(item => (item.orderDetails || []).map(itemx=> itemx.itemId)).flat())];
      beforedispatchtowh_copyNumFn(itemIdsArr.join(','));
    });
    //复制订单号/店铺单号函数
    function beforedispatchtowh_copyNumFn(orderNums){
      let oInput = document.createElement('textarea'); //创建一个textarea元素
      oInput.value = orderNums;
      document.body.appendChild(oInput); //将input添加为body子元素
      oInput.select(); // 选择对象
      document.execCommand("Copy"); // 执行浏览器复制命令
      document.body.removeChild(oInput);//移除DOM元素
      layer.msg('复制成功', { icon: 1 });
    }

  //#endregion
});

//#region  待审核页面
function getIndex (id, arr, value) { //获取某个取值属性在对象数组中的下标
  for (var i = 0; i < arr.length; i++) {
    if (value == arr[i][id]) {
      return i;
    }
  }
  return -1;
}

function toAuditBuyerTipsShow (dom) {
  const contentshow = $(dom).attr('data-text');
  if (contentshow) {
    let contentshowArr = contentshow.split('\n');
    layui.layer.tips(`<span style="color:#008B8B">${contentshowArr.join('<br>')}</span>`, $(dom), {
      tips: [1, '#fff'],
      time: 0,
    });
  }
}

function toAuditBuyerTranslateTipsShow (dom, event) {
  event.preventDefault();
  event.stopPropagation();
  const orderId = $(dom).data("id");
  const contentshow = $(dom).data("text");
  commonReturnPromise({
    url: `/lms/unauditorder/translate.html?orderId=${orderId}`,
  }).then((res) => {
    if (res.translateStr) {
      const contentshowArr = [contentshow, res.translateStr];
      layui.layer.tips(
        `<span style="color:#008B8B">${contentshowArr.join("<br><br>")}</span>`,
        $(dom),
        {
          tips: [1, "#fff"],
          time: 0,
        }
      );
    }
  });
}

$(document).mouseup(function (e) {
  const _con = $(".layui-layer-tips");
  if (!_con.is(e.target) && _con.has(e.target).length === 0) {
    layui.layer.closeAll("tips");
  }
});

function toAuditBuyerTipsShowTable (dom) {
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
function toAuditBuyerTipsHide () {
  layui.layer.closeAll("tips");
}
function toAuditOrderProfitTipsShow (dom) {
  const datatext = $(dom).attr("data-text");
  let data = JSON.parse(datatext);
  let profit = (data.platOrderAmt - data.platFee - data.otherFee) * data.exchangeRate - data.prodCost - (data.outerPackCost || 0) - data.shippingCost;
  let contentshow = "利润 = (订单金额 - 平台佣金 - 税费) * 汇率 - 商品成本 - 外包装成本 - 运费<br/>"
    + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= (" + data.platOrderAmt + " - " + data.platFee + " - " + data.otherFee + ") * " + data.exchangeRate
    + " - " + data.prodCost + " - " + (data.outerPackCost || 0) + " - " + data.shippingCost + "<br/>"
    + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= " + profit.toFixed(4);
  if (contentshow) {
    layui.layer.tips(`<span style="color:#008B8B">${contentshow}</span>`, $(dom), {
      tips: [1, '#fff'],
      area: ['420px', 'auto'],
      time: 0,
    });
  }
}
function toAuditOrderProfitTipsHide () {
  layui.layer.closeAll("tips");
}
//#endregion

//#region 异常订单页面
function abnormalOrderTipsShow (dom) {
  const contentshow = $(dom).attr('data-text');
  if (contentshow) {
    layui.layer.tips(`<span style="color:#008B8B">${contentshow}</span>`, $(dom), {
      tips: [1, '#fff'],
      time: 0,
    });
  }
}

function abnormalOrderTipsShowTable (dom) {
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
function abnormalOrderTipsHide () {
  layui.layer.closeAll("tips");
}
//#endregion

//#region 待派单/缺货订单页面
function toDespatchBuyerTipsShow (dom) {
  const contentshow = $(dom).attr('data-text');
  if (contentshow) {
    layui.layer.tips(`<span style="color:#008B8B">${contentshow}</span>`, $(dom), {
      tips: [1, '#fff'],
      time: 0,
    });
  }
}

function toDespatchBuyerTipsShowTable (dom) {
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
function toDespatchBuyerTipsHide () {
  layui.layer.closeAll("tips");
}
function toDespatchOrderProfitTipsShow (dom) {
  const datatext = $(dom).attr("data-text");
  let data = JSON.parse(datatext);
  let profit = (data.platOrderAmt - data.platFee - data.otherFee) * data.exchangeRate - data.prodCost - (data.outerPackCost || 0) - data.shippingCost;
  let contentshow = "利润 = (订单金额 - 平台佣金 - 税费) * 汇率 - 商品成本 - 外包装成本 - 运费<br/>"
    + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= (" + data.platOrderAmt + " - " + data.platFee + " - " + data.otherFee + ") * " + data.exchangeRate
    + " - " + data.prodCost + " - " + (data.outerPackCost || 0) + " - " + data.shippingCost + "<br/>"
    + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= " + profit.toFixed(4);
  if (contentshow) {
    layui.layer.tips(`<span style="color:#008B8B">${contentshow}</span>`, $(dom), {
      tips: [1, '#fff'],
      area: ['420px', 'auto'],
      time: 0,
    });
  }
}
function toDespatchOrderProfitTipsHide () {
  layui.layer.closeAll("tips");
}
//#endregion
//缺货-修改订单-sku替换操作
function toDespatchOrder_lackSkuHandle(obj){
  //获取到当前行index
  let currentIndex = $(obj).parents('tr').attr('data-index');
  let dataStr = $('#toDespatchOrder_product_table').next().find('.layui-table-body tr').eq(currentIndex).find('input[name=lackSku]').val();
  let data = new Function(`return ${dataStr}`)();
  layer.open({
    type: 1,
    title: '商品替换',
    area: ['60%', '60%'],
    btn: ['关闭'],
    content: $('#toDespatchOrder_lackSkuLayer').html(),
    id: 'toDespatchOrder_lackSkuLayerId',
    success: function(layero, index){
      let getTpl = toDespatchOrder_lackSkuLayerTbodyTpl.innerHTML;
      let view = document.getElementById("toDespatchOrder_lackSkuLayerTbody");
      layui.laytpl(getTpl).render(data, function (html) {
        view.innerHTML = html;
        imageLazyload();
        imageLazyloadAll();
        //点击替换
        layero.on('click', '.lack-sku-replace', function(item){
          let prodSSku = $(item.target).attr('data-sku');
          //把SKU替换到父元素的input里
          console.log($(obj));
          $('#toDespatchOrder_product_table').next().find('.layui-table-body tr').eq(currentIndex).find('td[data-field=prodSSku] input[name=""]').val(prodSSku);
          layer.msg('替换成功', {icon: 1});
          //需要提升点击刷新图标
          $('#toDespatchOrder_product_table').next().find('.layui-table-body tr').eq(currentIndex).find('td[data-field=prodSSku] .refresh_icon').trigger('click');
          layer.close(index);
        });
        //监听滚动条滚动事件
        $('#toDespatchOrder_lackSkuLayerId').on('scroll', function(){
          let scrollTop = $(this).scrollTop();
          if(scrollTop > 20){
            layero.find('#toDespatchOrder_lackSkuLayerTbody tr:first-child').css('position', 'sticky').css({
              top: 0,
              zIndex: 20231012
            });
          }
        })
      });
    }
  })
}
