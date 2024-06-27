;
(function ($, layui, window, document, undefined) {
  layui.use(['admin', 'table', 'form', 'element', 'layer', 'laytpl', 'formSelects', 'upload', 'laydate'], function () {
    var admin = layui.admin,
      table = layui.table,
      element = layui.element,
      layer = layui.layer,
      laytpl = layui.laytpl,
      upload = layui.upload,
      laypage = layui.laypage,
      laydate = layui.laydate,
      formSelects = layui.formSelects,
      form = layui.form;
    form.render();
    //搜索条件渲染afterdispatchtowh
    let afterdispatchtowhSearchName = {
      //时间渲染,  无默认
      time: function () {
        let nowdate = new Date(new Date().toLocaleDateString()).getTime()
        let endTime = Format(nowdate + 24 * 60 * 60 * 1000 - 1, 'yyyy-MM-dd hh:mm:ss')
        let startTime = Format(new Date(nowdate - 60 * 24 * 3600 * 1000), 'yyyy-MM-dd hh:mm:ss')
        // let timeVal = startTime + ' - ' + endTime;
        laydate.render({
          elem: '#afterdispatchtowh_time',
          type: 'datetime',
          // value: timeVal,
          inputAuto: true,
          range: true,
          showShortcuts: true,
        });
      },
      //渲染搜索条件
      renderSearchItem: function () {
        var _this = this;
        _this.ajaxCollections().then(function (obj) {
          _this.renderHandle(obj);
          _this.watchHandle(obj);
        }).catch(function (err) {
          layer.msg('请求接口出错', { icon: 7 });
        });
      },
      //请求集合
      ajaxCollections () {
        let _this = this;
        return new Promise(function (resolve, reject) {
          Promise.all([_this.allLists(), _this.allPurchasingAgent(), _this.allPreprodDev(), _this.allCompany()])
            .then(function (result) {
              var obj = result[0]; //平台/物流属性/收件国家/发货仓库/订单标签
              obj.purchasingAgent = result[1]; //采购人员
              obj.preprodDev = result[2]; //开发人员
              obj.companys = result[3]['companys']; //物流公司
              obj.agents = result[3]['agents']; //货代公司
              obj.logisticsModes = result[3]['logisticsModes'] //物流方式集
              resolve(obj);
            }).catch(function (err) {
              reject(err);
            });
        });
      },
      //渲染操作
      renderHandle: function (obj) {
        //平台
        commonRenderSelect('afterdispatchtowh_platCode', obj.platCodes).then(function () {
          form.render('select');
        });
        //订单备注
        commonRenderSelect('afterdispatchtowh_orderLabels', obj.orderLabels, { name: 'name', code: 'code' }).then(function () {
          // formSelects.render('afterdispatchtowh_orderLabels');
          formSelects.render('afterdispatchtowh_orderLabels', {placeholder: '备注类型'})
        });
        //平台标签
        commonRenderSelect('afterdispatchtowh_platTags', obj.platTagList).then(() => {
          formSelects.render('afterdispatchtowh_platTags');
        });
        //渲染订单标签
        commonRenderSelect('afterdispatchtowh_orderTagLists', obj.orderTagList).then(() => {
          formSelects.render('afterdispatchtowh_orderTagLists');
        });
        //仓库拦截单-二级页签
        //渲染tab
        let $tabUl = $('#waittopacktoInterceptTabs>ul');
        let $selctedVal = $('#afterdispatchtowhForm [name=logisApplySearchStatus]').val();
        let str = '';
        if(obj.logisApplySearchStatusMaps){
          for(let i=0; i< obj.logisApplySearchStatusMaps.length; i++){
            let item = obj.logisApplySearchStatusMaps[i];
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

        //物流属性afterdispatchtowh_logisAttrs
        commonRenderSelect('afterdispatchtowh_logisAttrs', obj.logisAttrs).then(function () {
          formSelects.render('afterdispatchtowh_logisAttrs');
        });
        //收件国家afterdispatchtowh_shippingCountrys
        const shippingCountryCodeList = obj.shippingCountrys.map(item => ({
          ...item,
          name: item.value + "(" + item.name + ")",
          shippingCountryCode: item.name,
          shippingCountryName: item.enFullValue,
          shippingCountryCnName: item.value,
        }))
        commonRenderSelect('afterdispatchtowh_shippingCountrys',
          shippingCountryCodeList,
          { name: "name", code: "shippingCountryCode" }).then(function () {
            formSelects.render('afterdispatchtowh_shippingCountrys');
          });
        //物流方式集afterdispatchtowh_company
        commonRenderSelect('afterdispatchtowh_company', obj.logisticsModes, { name: 'logisticsCollectionName', code: 'id' }).then(function () {
          form.render('select');
        });
        //发货仓库afterdispatchtowh_warehouseId
        commonRenderSelect('afterdispatchtowh_warehouseId', obj.prodWarehouses, { name: 'value', code: 'name' }).then(function () {
          form.render('select');
        });
        //开发专员afterdispatchtowh_preprodDevId
        commonRenderSelect('afterdispatchtowh_preprodDevId', obj.preprodDev, { name: 'userName', code: 'id' }).then(function () {
          form.render('select');
        });
        //采购专员afterdispatchtowh_purchasingAgentId
        commonRenderSelect('afterdispatchtowh_purchasingAgentId', obj.purchasingAgent, { name: 'userName', code: 'id' }).then(function () {
          form.render('select');
        });
        // 平台状态       
        formSelects.render('adtw_platOrderStatusList', { placeholder: '请先选择平台' });
        //店铺
        formSelects.render('afterdispatchtowh_store', { placeholder: '请先选择平台' });
      },
      //获取平台/物流属性/收件国家/发货仓库/订单标签post
      allLists: function () {
        return commonReturnPromise({
          type: 'post',
          contentType: 'application/json',
          url: '/lms/unauditorder/listenum.html'
        });
      },
      //获取所有采购人员post
      allPurchasingAgent: function () {
        return commonReturnPromise({
          type: 'post',
          contentType: 'application/json',
          url: '/lms/sys/buyerList.html'
        });
      },
      //获取所有开发人员post
      allPreprodDev: function () {
        return commonReturnPromise({
          type: 'post',
          contentType: 'application/json',
          url: '/lms/sys/prodOwnerList.html'
        });
      },
      //获取物流/货代公司post
      allCompany: function () {
        return commonReturnPromise({
          type: 'post',
          contentType: 'application/json',
          url: '/lms/unauditorder/listcompanyandagent.html'
        });
      },
      //获取所有的物流方式post
      allLogisType: function (obj) {
        return commonReturnPromise({
          url: '/lms/unauditorder/listlogistype.html',
          params: {...obj,specialType: "直发物流"}
        });
      },
      //获取平台订单状态
      listplatorderstatus: function (platCode) {
        return commonReturnPromise({
          type: 'get',
          url: `/lms/undispatch/listplatorderstatus.html?platCode=${platCode}`
        });
      },
      platOrderStatuscommonPS: function (data) {
        let arr = []
        data && data.forEach(item => arr.push({ "platOrderStatus": item }))
        commonRenderSelect('adtw_platOrderStatusList', arr, { name: 'platOrderStatus', code: 'platOrderStatus' }).then(function () {
          formSelects.render('adtw_platOrderStatusList');
        });
      },
      //平台+店铺联动
      //平台和店铺,物流公司和物流方式联动
      watchHandle: function (obj) {
        let _this = this;
        let $form = $('#afterdispatchtowhForm');
        //监听平台和店铺联动
        commonInitRenderRoleType('afterdispatchtowh');
        form.on('select(afterdispatchtowh_platCode)', function (data) {
          let val = data.value; //选中的值
          commonOrderAddOrg('afterdispatchtowh', form, val);
          _this.listplatorderstatus(val).then(function (result) {
            _this.platOrderStatuscommonPS(result);
          });
        });
        //监听物流公司和货代公司切换
        form.on('select(companyType)', function (data) {
          var val = data.value;
          _this.allCompany().then(function (result) {
            _this.commonLW(val, result);
          });
        });
        //监听物流/货代公司和物流方式联动
        form.on('select(afterdispatchtowh_company)', function (data) {
          var val = data.value;
          var isCompany = $form.find('[name=companyType]').val();
          var obj = {};
          if (isCompany == 'companys') {
            obj.logisticsCompanyId = val;
          } else if(isCompany == 'logisticsModes') {
            obj.logisticsModeId = val
          }else {
            obj.agent = val;
          }
          _this.allLogisType(obj).then(function (result) {
            commonRenderSelect('afterdispatchtowh_logisTypeIds', result, { name: 'name', code: 'id' }).then(function () {
              formSelects.render('xm_afterdispatchtowh_logisTypeIds');
              const ids = result.map(v=>v.id).join()
              $('#afterdispatchtowh_logisTypeIds').attr('acct_ids', ids);
            });
          })
        });
      },
      //物流方式相关的公共逻辑
      commonLW: function (val, result) {
        if (val == 'companys') {
          commonRenderSelect('afterdispatchtowh_company', result.companys, { name: 'cnName', code: 'id' }).then(function () {
            form.render('select');
          });
        } else if(val == 'logisticsModes') {
          commonRenderSelect('afterdispatchtowh_company', result.logisticsModes, { name: 'logisticsCollectionName', code: 'id' }).then(function () {
            form.render('select');
          });
        } else {
          commonRenderSelect('afterdispatchtowh_company', result.agents, { name: 'cnName', code: 'id' }).then(function () {
            form.render('select');
          });
        }
      },
      //更多查询条件处理
      moreHandle: function () {
        let _this = this;
        $('#showMoreSearchCondition_afterdispatchtowh').click(function () {
          var self = this
          if ($(self).hasClass('showExternal')) {
            $(self).closest('.layui-form').find('.externalContainAuditorder').hide()
            $('#hide_icon_afterdispatchtowh').show()
            $('#show_icon_afterdispatchtowh').hide()
            $(self).removeClass('showExternal')
            //被隐藏了,执行判断逻辑
            _this.hasValue();
          } else {
            $(self).closest('.layui-form').find('.externalContainAuditorder').show()
            $('#hide_icon_afterdispatchtowh').hide()
            $('#show_icon_afterdispatchtowh').show()
            $(self).addClass('showExternal')
          }
        });
      },
      hasValue: function () {
        let inputs = $('#afterdispatchtowhForm .externalPopAuditorder').find('input');
        let count = 0;
        let showDom = $('#showMoreSearchCondition_afterdispatchtowh .hasValue');
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
          showDom.html('');
        }
      },
      //搜索导出功能
      export () {
        componentForOrderDownload('afterdispatchtowh_exportTemplate', function () {
          // let data = afterdispatchtowh_gridOptions.api.getSelectedRows();
          // let idsArr = data.map(function (item) {
          //   return item.id;
          // });
          // return idsArr;
          return [];
        });
      }
    }
    afterdispatchtowhSearchName.time(); //渲染时间,默认30天
    afterdispatchtowhSearchName.moreHandle(); //更多查询条件
    // afterdispatchtowhSearchName.export(); //导出功能
    afterdispatchtowhSearchName.renderSearchItem();
    //渲染待包装页面,直接引入js文件
   // 保存搜索
    // 模板查询赋值
    commonSaveSearchTpl({
      id: "afterdispatchtowh_save",
      formId: "afterdispatchtowhForm",
      pageName: "auditDespathOrder_afterdispatchtowh",
      searchBtnId: "afterdispatchtowhSearch",
      cb: (param) => afterDispatchtowh_formVal(param),
    });
   
    form.on('select(warehouseId)', function(data){
      let warehouseId=data.value;
       // 仓库楼层联动
      afterdispatchtowh_build_floor("#afterdispatchtowhForm",warehouseId);
    }); 
    function afterDispatchtowh_formVal(param) {
      let $formDom = $("#afterdispatchtowhForm");
      let timeStamp = 0; // 调接口的需要加400
      const tabStatusObj = {
        0: 120, //未拣货120
        1: 125, //未核单125
        2: 130, //未包装130
        3: 135, //仓库缺货135
        4: 136, //仓库截单136
        5: 140, //待发货
      };
      $("#afterdispatchtowh-tabs .layui-tab-title li").each(function (index) {
        if (tabStatusObj[index] == param.processStatus) {
          $(this).addClass("layui-this");
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
      if (param.companyType) {
        $formDom
          .find("select[name=companyType]")
          .next()
          .find(`dd[lay-value="${param.companyType}"]`)
          .trigger("click");
      }
      // 店铺 赋值
      setTimeout(() => {
        if (param.company) {
          $formDom
            .find("select[name=company]")
            .next()
            .find(`dd[lay-value="${param.company}"]`)
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
          formSelects.data("afterdispatchtowh_storeAcct", "local", { arr });
          // 给表单赋值
          form.val("afterdispatchtowhForm", param);
          // 更多查询条件是否有值
          afterdispatchtowhSearchName.hasValue();
          // // 多选的 name: xm-select
          let multiSelectObj = {
            salePersonId: "afterdispatchtowh_salePersonsSelect",
            prodLogisAttrs: "afterdispatchtowh_logisAttrs",
            platOrderStatusList: "adtw_platOrderStatusList",
            shippingCountryCodes: "afterdispatchtowh_shippingCountrys",
            platTags: "afterdispatchtowh_platTags",
            logisTypeIds: "xm_afterdispatchtowh_logisTypeIds",
            orderLabels: "afterdispatchtowh_orderLabels",
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
          $("#afterdispatchtowh-tabs .layui-tab-title li.layui-this").click();
        });
      }, timeStamp);
    }
    // 仓库楼层联动
    function afterdispatchtowh_build_floor(formSelector,defaultWarehouseId){
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
  });
})(jQuery, layui, window, document);