layui.use(['form', 'table', 'layer', 'element', 'laypage', 'upload', 'tableMerge', 'laydate', 'formSelects','laytpl'], function() {
    var form = layui.form,
        table = layui.table,
        element = layui.element,
        laydate = layui.laydate,
        formSelects = layui.formSelects,
        laytpl = layui.laytpl,
        laypage = layui.laypage;
    layer = layui.layer;
    form.render('select');
    var toDespatchOrder_company = null,
        toDespatchOrder_allstore = null,
        // toDespatchOrder_platOrderStatus = null,
        toDespatchOrder_logisType = null,
        toDespatchOrder_Site = null,
        toDespatchOrder_formdata = {},
        toDespatchOrder_pageEnum = null,
        toDespatchOrder_Currency = null
    toDespatchOrder_companyType = "logisticsModes";
    laydate.render({
        elem: '#toDespatchOrder_time',
        type: 'datetime',
        inputAuto: true,
        range: true,
        showShortcuts: true,
    });
    formSelects.render('todespatchorderplatOrderStatusList', { placeholder: '请先选择平台' });
    //渲染平台标记
    toDespatchOrder_renderPlatCodeMark();
    function toDespatchOrder_renderPlatCodeMark () {
        commonReturnPromise({
            url: '/lms/unauditorder/listenum.html'
        }).then(res => {
            let { platTagList } = res;
            commonRenderSelect('toDespatchOrder_platTags', platTagList).then(() => {
                formSelects.render('toDespatchOrder_platTags');
            });
        });
    }

    // 模板查询赋值
    commonSaveSearchTpl({
        id: "toDespatchOrder_save",
        formId: "toDespatchOrderForm",
        pageName: "auditDespathOrder_toDespatchOrder",
        searchBtnId: "toDespatchOrderSearch",
        cb: param => toDespatchOrder_formVal(param),
    })
    
    function toDespatchOrder_formVal(param) {
        let $formDom = $("#toDespatchOrderForm")
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
                appendSelect($('#toDespatchOrderForm').find(`select[_name=storeAcctIds]`), res, 'id', 'storeAcct')
                formSelects.render("storeAcct")
                formSelects.value("storeAcct", storeList)
                 // 给表单赋值
                form.val("toDespatchOrderForm", param)
                // 更多查询条件是否有值
                toDespatchOrderHasValue("toDespatchOrderForm", "showMoreSearchCondition_toDespatchOrder")
                // 多选的 name: xm-select
                let multiSelectObj = {
                    salePersonId: "toDespatchOrder_salePersonsSelect",
                    prodLogisAttrs: "logisAttrs",
                    platOrderStatusList: "todespatchorderplatOrderStatusList",
                    shippingCountryCodes: "shippingCountrys",
                    platTags: "toDespatchOrder_platTags",
                    logisTypeIds: "logisTypeIds_xm_select_toDes",
                    orderLabels: "toDespatchOrder_orderLabels",
                }
                Object.keys(multiSelectObj).forEach(item => {
                    if (param[item]) {
                        formSelects.value(multiSelectObj[item], param[item].split(","), true)
                    } else {
                        formSelects.render(multiSelectObj[item])
                    }
                })
                // 执行搜索
                $('#toDespatchOrderSearch').click()
            })
        }, timeStamp)
      
        // 页签
        if (param.logisApplySearchStatus) {
          $("#toDespatchOrder_tab")
            .find("li")
            .each(function () {
              let liIndex = $(this).data("index")
              if (liIndex == param.logisApplySearchStatus) {
                $(this).addClass("layui-this")
              } else {
                $(this).removeClass("layui-this")
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

    // 前端删除行，删除后不刷新表格
    function deleteTableRow_toDespatchOrder(ids,errIdsArr){
        zttCommonRemoveDataHandle({
            selectedIds: ids,
            gridOptions: toDespatchOrder_gridOptions,
            tableData: toDespatchOrder_immutableStore,
            errIds: errIdsArr
        }).then(newObj => {
            let { newData, successIds } = newObj;
            // toDespatchOrder_immutableStore = newData;
            let oldNum = $('#toDespatchOrder_tab ul li.layui-this>span').text();
            let newNum = oldNum - successIds.length;
            $('#toDespatchOrder_tab ul li.layui-this>span').text(newNum);
            $('#toDespatchOrderPage .layui-laypage-count').text(`共 ${newNum} 条`);
        });
    }
    // 前端更新行，更新后不刷新表格
    function updateTableRow_toDespatchOrder(ids,errIdsArr){
        zttCommonUpdataDataHandle({
            selectedIds: ids,
            errIds: errIdsArr
        }).then(newObj => {
            // 修改成功的数据
            let { successIds } = newObj;
            if(successIds.length != 0){
                // 选中的数据
                let checkStatus = toDespatchOrder_gridOptions.api.getSelectedRows();
                let newCheckStatus = deepCopy(checkStatus)
                commonReturnPromiseRes({
                    url: ctx + '/undispatch/list.html',
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
                    toDespatchOrder_gridOptions.api.updateRowData({ update: newCheckStatus });
                })
            }
        });
    }

    // 前端更新行，更新后不刷新表格
    function updateSingleRow_toDespatchOrder(id){
        // 选中的数据
        let data = toDespatchOrder_gridOptions.api.getRowNode(id);
        commonReturnPromise({
            url: ctx + '/undispatch/list.html',
            type: 'POST',
            params:{orderIds:id}
        }).then(function(result){
            data.setData(result[0]?result[0]:[]);
        })
    }
    // var nowdate = new Date(new Date().toLocaleDateString()).getTime()
    // var endDate = Format(nowdate + 24 * 60 * 60 * 1000 - 1, 'yyyy-MM-dd hh:mm:ss')
    // var onemonth = Format(new Date(nowdate - 60 * 24 * 3600 * 1000), 'yyyy-MM-dd hh:mm:ss')
    // $('#toDespatchOrder_time').val(onemonth + ' - ' + endDate)

    // 展示和隐藏 更多查询条件
    $('#showMoreSearchCondition_toDespatchOrder').click(function() {
        var self = this
        if ($(self).hasClass('showExternal')) {
            $(self).closest('.layui-form').find('.externalContaintoDespatchOrder').hide()
            $('#hide_icon_toDespatchOrder').show()
            $('#show_icon_toDespatchOrder').hide()
            $(self).removeClass('showExternal')
            toDespatchOrderHasValue ('toDespatchOrderForm', 'showMoreSearchCondition_toDespatchOrder')
        } else {
            $(self).closest('.layui-form').find('.externalContaintoDespatchOrder').show()
            $('#hide_icon_toDespatchOrder').hide()
            $('#show_icon_toDespatchOrder').show()
            $(self).addClass('showExternal')
        }
    })
    function toDespatchOrderHasValue (formId, btnId) {
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

    //优选仓拒单
    $('#toDespatchOrder_rejectOrderdabao').on('click', function(){
      let ids = getTableSelectIds();
      if (!ids || ids.length < 1) {
          layer.msg('请选择订单', { icon: 7 });
          return;
      }
      commonRejectOrderdabao(ids, deleteTableRow_toDespatchOrder);
    });


    $('#allStatusOrder_export001').on('click', function() {
        let ids = getTableSelectIds();
        if (!ids || ids.length < 1) {
            layer.msg('请选择订单', { icon: 7 });
            return;
        }
        // layer.confirm('导出选择的订单？', function(result) {
        //     if (result) {
                let param = {};
                param.orderIds = ids.join(",");
                submitForm(param, ctx + '/platorder/exportorder.html', "_blank");
                layer.closeAll();
        //     }
        // });
    });
    $('#toDespatchOrderDetail_export').on('click', function() {
        let ids = getTableSelectIds();
        if (!ids || ids.length < 1) {
            layer.msg('请选择订单', { icon: 7 });
            return;
        }
        // layer.confirm('导出选择的订单明细？', function(result) {
        //     if (result) {
                let param = {};
                param.orderIds = ids.join(",");
                submitForm(param, ctx + '/platorder/exportorderdetail.html', "_blank");
                layer.closeAll();
        //     }
        // });
    });

    element.on('tab(toDespatchOrder_tab)', function(data) {
        var logisApplySearchStatus = data.elem.context.dataset.index;
        if(logisApplySearchStatus == 5 || logisApplySearchStatus == -1 || logisApplySearchStatus == 4){
            $("#toDespatchOrder_getEdisebay").show()
        }else{
            $("#toDespatchOrder_getEdisebay").hide()
        }
        $('#toDespatchOrderForm input[name="logisApplySearchStatus"]').val(logisApplySearchStatus)
        $('#toDespatchOrderSearch').click()
    });


    // 表单提交
    form.on('submit(toDespatchOrderSearch)', function(data) {
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
        if(data.field.processStatus == 115){
          $('#toDespatchOrder_rejectOrderdabao').removeClass('disN');
        }else{
          $('#toDespatchOrder_rejectOrderdabao').addClass('disN');
        }
        //天数类型处理
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

        // 物流方式与物流方式
        if(data.field.agentCompany == 'logisticsModes' && data.field.logisticsCompanyId && !data.field.logisTypeIds){
            data.field.logisTypeIds = $('#logisTypeIds_xm_select_toDes').attr('acct_ids')
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
            data.field.storeAcctIds = $('#toDespatchOrder_store').attr('acct_ids') || 0;
        }
        toDespatchOrderTableorder(data.field)
    });

    //监听平台下拉选择
    commonInitRenderRoleType('toDespatchOrder');
    form.on('select(toDespatchOrderplatCodes)', function (obj) {
        // commonOrderAddSalePerson('toDespatchOrder', form, obj.value);
        commonOrderAddOrg('toDespatchOrder', form, obj.value);
        getListplatorderstatus_todespatchorder(obj.value).then(function(data) {
            let arr = []
            data && data.forEach(item => arr.push({"platOrderStatus":item}))
            commonRenderSelect('todespatchorderplatOrderStatusList', arr, { name: 'platOrderStatus', code: 'platOrderStatus'}).then(function() {
                formSelects.render('todespatchorderplatOrderStatusList', { placeholder: '请先选择平台' });
            });
        });
        // getStoreByPlatform(obj.value, function(returnData) {
        //     appendSelect($('#toDespatchOrderForm').find('select[_name="storeAcctIds"]'), returnData.data, 'id', 'storeAcct')
        // })
    })

    //监听公司下拉选择
    form.on('select(toDespatchOrdercompanyType)', function(obj) {
            toDespatchOrder_companyType = obj.value
            let name = obj.value ==='logisticsModes' ? 'logisticsCollectionName' : 'cnName'
            appendSelect($('#toDespatchOrderForm').find('select[name="logisticsCompanyId"]'), toDespatchOrder_company[toDespatchOrder_companyType], 'id', name)
            form.render()
        })
        //监听物流公司下拉选择
    form.on('select(toDespatchOrdercompany)', function(obj) {
        var agent = "",
            logisticsModeId='',
            logisticsCompanyId = "";
        if(toDespatchOrder_companyType === 'agents'){
            agent = obj.value
        }else if(toDespatchOrder_companyType === 'companys'){
            logisticsCompanyId = obj.value
        }else if(toDespatchOrder_companyType === 'logisticsModes'){
            logisticsModeId = obj.value
        }
        getAllLogicsType(agent, logisticsCompanyId, logisticsModeId)
        form.render()
    })


    //导出功能
    componentForOrderDownload('toDespatchOrder_exportTemplate', function(){
      let data = toDespatchOrder_gridOptions.api.getSelectedRows();
      let idsArr = data.map(function (item) {
        return item.id;
      });
      return idsArr;
    });


    //监听工具栏操作
    table.on("tool(toDespatchOrder_table)", function(obj) {
        var event = event ? event : window.event;
        event.stopPropagation();
        var data = obj.data
        if (obj.event === "") {}
    });

    getPageEnum();
    getAllCompanies();
    getStoreByPlatform('', function(returnData) {
        toDespatchOrder_allstore = returnData.data
    });
    // getListplatorderstatus('', function(returnData) {
    //     let arr = []
    //     returnData.data && returnData.data.forEach(item => arr.push({"platOrderStatus":item}))
    //     toDespatchOrder_platOrderStatus = arr
    // });
    getAllLogicsType('', '', '', function(returnData) {
        toDespatchOrder_logisType = returnData.data
    });
    getAlldevEmployee();
    getAllpurchaseEmployee();
    getAllSite();
    getCurrencyEnums();

    //页面批量下拉操作按钮初始化
    // let overseaOper = new dropButton('toDespatchOrder_overseaOper');
    new dropButton('toDespatchOrder_exportDetail');
    let logis = new dropButton('toDespatchOrder_logis');
    let dealOrder = new dropButton('toDespatchOrder_dealOrder');
    let platOperate = new dropButton('toDespatchOrder_platOperate');

    $('#toDespatchOrder_exportDetail').on('click', 'li', function(event){
      let target = event.target.dataset.detail;
      let data = toDespatchOrder_gridOptions.api.getSelectedRows();
      if (!data.length) {
          return layer.msg('请先选中数据', { icon: 7 });
      }
      let idsArr = data.map(item =>item.id);
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
            layer.msg(err, {icon: 2});
        });
    })


    // 页面数据请求----------------------------------------
    //  获取页面枚举数
    function getPageEnum() {
        initAjax('/unauditorder/listenum.html', 'post', {}, function(returnData) {
            toDespatchOrder_pageEnum = returnData.data
            toDespatchOrder_pageEnum.platCode = toDespatchOrder_pageEnum.platCodes
            toDespatchOrder_pageEnum.prodLogisAttrs = toDespatchOrder_pageEnum.logisAttrs
            toDespatchOrder_pageEnum.shippingCountryCodes = toDespatchOrder_pageEnum.shippingCountrys
            toDespatchOrder_pageEnum.warehouseId = toDespatchOrder_pageEnum.prodWarehouses
            let temporayRetrun = [];
                returnData.data.orderLabels.forEach((v)=>{
                    let temporayObj = {}
                    temporayObj.name = v.code
                    temporayObj.value = v.name
                    temporayRetrun.push(temporayObj)
                })
            returnData.data.orderLabels = temporayRetrun
            toDespatchOrder_pageEnum.toDespatchOrder_orderLabels = toDespatchOrder_pageEnum.orderLabels
            // console.log(toDespatchOrder_pageEnum.orderLabels);
            // console.log(returnData.data.orderLabels);
            for (var i in returnData.data) {
                appendSelect($('#toDespatchOrderForm').find('select[name="' + i + '"]'), returnData.data[i], 'name', 'value')
                appendSelect($('#toDespatchOrderForm').find('select[_name="' + i + '"]'), returnData.data[i], 'name', 'value')
                if (i === 'logisApplySearchStatusMaps') {
                    appendTab(returnData.data[i])
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
            formSelects.render('toDespatchOrder_orderLabels',{placeholder: '备注类型'})
            form.render('storeAcct')
        })
    }
    //获取所有物流公司以及货代公司
    function getAllCompanies() {
        initAjax('/unauditorder/listcompanyandagent.html', 'post', {}, function(returnData) {
            toDespatchOrder_company = returnData.data
            appendSelect($('#toDespatchOrderForm').find('select[name="logisticsCompanyId"]'), returnData.data.logisticsModes, 'id', 'logisticsCollectionName')
            form.render()
        })
    }

    //获取所有物流方式
    function getAllLogicsType(agent, logisticsCompanyId, logisticsModeId, func) {
        initAjax('/unauditorder/listlogistype.html', 'get', { agent, logisticsCompanyId, logisticsModeId, specialType: "直发物流" }, function(returnData) {
            if (func) {
                func(returnData)
            }
            if(!$('#toDespatchOrderForm').find('select[_name="logisTypeIds"]').length){
                formSelects.render('logisTypeIds_xm_select_toDes')
            }
            appendSelect($('#toDespatchOrderForm').find('select[_name="logisTypeIds"]'), returnData.data, 'id', 'name')
            formSelects.render('logisTypeIds_xm_select_toDes')
        })
    }

    //根据平台code获取店铺列表
    function getStoreByPlatform(platcode, func) {
        initAjax('/sys/orderliststorebyplatcode.html', 'get', { platCode: platcode }, function(returnData) {
            if (func) {
                func(returnData)
            }
            formSelects.render('storeAcct', { placeholder: '请先选择平台' })
        }, 'application/x-www-form-urlencoded')
    }

    // 获取平台订单状态
    function getListplatorderstatus_todespatchorder(platcode, func) {
        // initAjax('/undispatch/listplatorderstatus.html', 'get',{platCode:platcode}, function(returnData) {
        //     if (func) {
        //         func(returnData)
        //     }
        //     formSelects.render('todespatchorderplatOrderStatusList')
        // }, 'application/x-www-form-urlencoded')
        return commonReturnPromise({
            type: 'get',
            url: `/lms/undispatch/listplatorderstatus.html?platCode=${platcode}`
        });
    }

    //获取所有开发专员
    function getAlldevEmployee() {
        initAjax('/sys/prodOwnerList.html', 'post', {}, function(returnData) {
            appendSelect($('#toDespatchOrderForm').find('select[name="preprodDevId"]'), returnData.data, 'id', 'loginName')
            form.render()
        })
    }

    //获站点接口
    function getAllSite(platCode, func) {
        initAjax('/enum/getSiteEnum.html?platCode=' + platCode, 'post', {}, function(returnData) {
            toDespatchOrder_Site = returnData.data
            if (func) {
                func(returnData)
            }
        }, 'application/x-www-form-urlencoded')
    }

    //获取所有采购专员
    function getAllpurchaseEmployee() {
        initAjax('/sys/buyerList.html', 'post', {}, function(returnData) {
            appendSelect($('#toDespatchOrderForm').find('select[name="purchasingAgentId"]'), returnData.data, 'id', 'loginName')
            form.render()
        })
    }

    // 获取所有页签数量
    function getAllTabNum(data) {
        initAjax('/undispatch/statuscount.html', 'post', data, function(returnData) {
            for (var i in returnData.data) {
                $('#LAY-toDespatchOrder #toDespatchOrder_tab').find('li[data-index="' + i + '"]').find('span').text(returnData.data[i])
            }
        }, 'application/x-www-form-urlencoded', true)
    }

    //获取币种枚举
    function getCurrencyEnums() {
        initAjax('/sysdict/getCurrencyEnums.html', 'post', {}, function(returnData) {
            toDespatchOrder_Currency = returnData.data
        })
    }

    //渲染表格数据
    // function toDespatchOrderTableorder(data) {
    //     table.render({
    //         elem: '#toDespatchOrder_table',
    //         method: 'POST',
    //         url: ctx + '/undispatch/list.html',
    //         where: data,
    //         cols: [
    //             [
    //                 { checkbox: true, width: 30 },
    //                 { title: "订单号", field: "id", templet: "#toDespatchOrder_id_tpl" },
    //                 { title: "订单金额", field: "platOrderAmt", templet: "#toDespatchOrder_platOrderAmt_tpl" },
    //                 { title: "商品", field: "prodQuantity", templet: "#toDespatchOrder_prodQuantity_tpl" },
    //                 { title: "收件人", field: "shippingUsername", templet: "#toDespatchOrder_shippingUsername_tpl" },
    //                 { title: "物流", field: "logisTypeName", templet: '#toDespatchOrder_logisTypeName_tpl' },
    //                 { title: "时间", field: "time", templet: "#toDespatchOrder_time_tpl" },
    //                 { title: "状态", field: "platOrderStatus",event:'platOrderStatus', templet: "#toDespatchOrder_platOrderStatus_tpl" },
    //                 { title: '操作', toolbar: "#toDespatchOrder_option_tpl", width: 80 }
    //             ]
    //         ],
    //         page: false,
    //         limit: 2000,
    //         id: 'toDespatchOrder_table',
    //         done: function(res) {
    //             toDespatchOrderPage(data, res.count)
    //             var tab = $('#LAY-toDespatchOrder #toDespatchOrder_tab').find('.layui-this')
    //             if (!isObjectValueEqual(data, toDespatchOrder_formdata)) {
    //                 getAllTabNum(data)
    //                 toDespatchOrder_formdata = data
    //             }
    //             if (tab.length > 0) {
    //                 tab.find('span').text(res.count)
    //             } else {
    //                 $('#LAY-toDespatchOrder #toDespatchOrder_tab').find('li[data-index="' + data.processStatus + '"]').addClass('layui-this').find('span').text(res.count)
    //             }
    //             $('.waitOrderErrorTipsClose').click(function() {
    //                 $(this).parents('.waitOrderErrorTips').remove()
    //             })
    //             toDespatchOrderTableWatchbar()
    //             toDespatchOrder_watchTableTr()
    //                 // var tbody = $('#toDespatchOrder_table').next('.layui-table-view').find('.layui-table-body').find('tr[data-index=0]')
    //                 // if (tbody.length > 0) {
    //                 //     var ifBind = tbody.attr('data-ifBind')
    //                 //     if (!ifBind) {
    //                 //         setRowEvent('#toDespatchOrder_table', '.toDespatchOrder_col_id', 'click', function(dom) {
    //                 //                 var index = $(dom).attr('data-index')
    //                 //                 toDespatchOrderNewandEdit(res.data[index])
    //                 //         }, ['.copyTxt', '.doubleClickToSet', '.laytable-cell-checkbox', '.freeClickBox', '[data-edit]'])
    //                 //         tbody.attr('data-ifBind', '1')
    //                 //     }
    //                 // }
    //         }
    //     })
    // }

    function toDespatchOrderTableorder(data) {
        commonReturnPromiseRes({
            url: ctx + '/undispatch/list.html',
            type: 'POST',
            params:data
        }).then(function(result){
            toDespatchOrderPage(data,result.count)
            toDespatchOrder_immutableStore = result.data
            toDespatchOrder_gridOptions.api.setRowData(toDespatchOrder_immutableStore)

            // 渲染tab中的count数，复制原来的--start
            var tab = $('#toDespatchOrder_tab').find('.layui-this')
            if(!isObjectValueEqual(data,toDespatchOrder_formdata)){
                getAllTabNum(data)
                toDespatchOrder_formdata = data
            }
            if (tab.length > 0) {
                tab.find('span').text(result.count)
            } else {
                $('#toDespatchOrder_tab').find('li[data-index="' + data.logisApplySearchStatus + '"]').addClass('layui-this').find('span').text(result.count)
            }
            var tbody = $('#toDespatchOrder_table').next('.layui-table-view').find('.layui-table-body').find('tr[data-index=0]')
            // 复制原来的--end
            setTimeout(() => {
                let arr = ['0', '4'];
                if (arr.includes(data.logisApplySearchStatus)) {
                    $('.toDespatchOrder__receiveBtn').removeClass('disN');
                } else {
                    $('.toDespatchOrder__receiveBtn').addClass('disN');
                }
            }, 100);
             // 商品种类||数量
            let skuQuantity = 0, prodQuantity = 0;
            if(result.count != 0){
                result.data.forEach(item=>{
                    skuQuantity = skuQuantity + item.skuQuantity * 1
                    prodQuantity = prodQuantity + item.prodQuantity * 1
                })
                $("#toDespatchOrder_table").find("[col-id=3] .ag-header-cell-text").text(`商品 种类${skuQuantity} || 数量${prodQuantity}`);
            }else{
                $("#toDespatchOrder_table").find("[col-id=3] .ag-header-cell-text").text(`商品 种类0 || 数量0`);
            };
        }).catch(function(err){
            layer.msg(err, {icon:2});
        })


        // table.render({
        //     elem: '#toDespatchOrder_table',
        //     method: 'POST',
        //     url: ctx + '/undispatch/list.html',
        //     where: data,
        //     cols: [
        //         [
        //             { checkbox: true, width: 30 },
        //             { title: "订单号", field: "id", templet: "#toDespatchOrder_id_tpl" },
        //             { title: "订单金额", field: "platOrderAmt", templet: "#toDespatchOrder_platOrderAmt_tpl" },
        //             { title: "商品", field: "prodQuantity", templet: "#toDespatchOrder_prodQuantity_tpl" },
        //             { title: "收件人", field: "shippingUsername", templet: "#toDespatchOrder_shippingUsername_tpl" },
        //             { title: "物流", field: "logisTypeName", templet: '#toDespatchOrder_logisTypeName_tpl' },
        //             { title: "时间", field: "time", templet: "#toDespatchOrder_time_tpl" },
        //             { title: "状态", field: "platOrderStatus",event:'platOrderStatus', templet: "#toDespatchOrder_platOrderStatus_tpl" },
        //             { title: '操作', toolbar: "#toDespatchOrder_option_tpl", width: 80 }
        //         ]
        //     ],
        //     page: false,
        //     limit: 2000,
        //     id: 'toDespatchOrder_table',
        //     done: function(res) {
        //         toDespatchOrderPage(data, res.count)
        //         var tab = $('#LAY-toDespatchOrder #toDespatchOrder_tab').find('.layui-this')
        //         if (!isObjectValueEqual(data, toDespatchOrder_formdata)) {
        //             getAllTabNum(data)
        //             toDespatchOrder_formdata = data
        //         }
        //         if (tab.length > 0) {
        //             tab.find('span').text(res.count)
        //         } else {
        //             $('#LAY-toDespatchOrder #toDespatchOrder_tab').find('li[data-index="' + data.processStatus + '"]').addClass('layui-this').find('span').text(res.count)
        //         }
        //         $('.waitOrderErrorTipsClose').click(function() {
        //             $(this).parents('.waitOrderErrorTips').remove()
        //         })
        //         toDespatchOrderTableWatchbar()
        //         toDespatchOrder_watchTableTr()
        //             // var tbody = $('#toDespatchOrder_table').next('.layui-table-view').find('.layui-table-body').find('tr[data-index=0]')
        //             // if (tbody.length > 0) {
        //             //     var ifBind = tbody.attr('data-ifBind')
        //             //     if (!ifBind) {
        //             //         setRowEvent('#toDespatchOrder_table', '.toDespatchOrder_col_id', 'click', function(dom) {
        //             //                 var index = $(dom).attr('data-index')
        //             //                 toDespatchOrderNewandEdit(res.data[index])
        //             //         }, ['.copyTxt', '.doubleClickToSet', '.laytable-cell-checkbox', '.freeClickBox', '[data-edit]'])
        //             //         tbody.attr('data-ifBind', '1')
        //             //     }
        //             // }
        //     }
        // })
    }

    $("button[name=orderConfig]").click(function(){
        let orderColumnState = toDespatchOrder_gridOptions.columnApi.getColumnState()
        window.localStorage.setItem("orderColumnState",JSON.stringify(orderColumnState))
        layer.msg("保存设置成功")
    })

    let toDespatchOrder_immutableStore = [];
    const toDespatchOrder_gridOptions = {
        columnDefs: [{
            width: 60,
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
                    let lackDom = d.processStatus == 502 ? `<span class="hp-badge" style="background:#f00;color:#fff;margin: 0 5px;">缺</span>` : '';
                    // 重寄订单
                    let orderLabel = d.operOrderType == 3 ? '<span style="color:red">重寄</span>':''
                    // operOrderType 拆单合单：订单操作类型：0原始订单，1拆除订单，2合并订单
                    const operOrderTypeTag = d.operOrderType ==1 ? '<span class="hp-badge layui-bg-orange" title="拆出订单">拆</span>' : d.operOrderType ==2 ? '<span class="hp-badge layui-bg-orange" title="合并订单">合</span>' : d.operOrderType ==0 && d.operOriginId!="0" ? '<span class="hp-badge layui-bg-orange" title="拆单订单">拆</span>' : ''
                    // 店铺客服
                    const customServicerHtml = d.customServicer ? `[${d.customServicer}]` : ''
                    return `<div class="alignLeft">
                        <span class="pora copySpan">
                            <a>${d.id || ""}</a>
                            <button class="layui-btn layui-btn-primary layui-btn-xs copyTxt" name="copy" onclick="layui.admin.copyTxt(this, event)">复制</button>
                        </span>
                        <span>[${d.platCode}]</span>
                        ${orderLabel}
                        ${lackDom}
                        ${tagsDom}
                        ${operOrderTypeTag}	
                        <p id="toAudit_table_storeAcct">${d.storeAcct || ""}[${d.shopId || ""}]</p>
                        <p>[${d.salesPersons || ""}][${d.sellLeaderName || ""}]${customServicerHtml}</p>
                        <span class="pora copySpan">
                            <a id="toAudit_table_platOrderId">${d.platOrderId}</a>
                            <button class="layui-btn layui-btn-primary layui-btn-xs copyTxt" name="copy" onclick="layui.admin.copyTxt(this, event)">复制</button>
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
                    let fee = [d.platFee || 0, d.otherFee || 0].filter(i => i !=0);
                    if(d.logisApplyStatus==4&&d.logisApplyFailMsg){
                        str += `<div class="waitOrderErrorTips dis_flex"><div class="waitOrderErrorTipsword">${d.logisApplyFailMsg||''}</div><div class="waitOrderErrorTipsClose">x</div></div>`
                    }
                    let amtDom = d.platShippingAmt ? `<span>(${d.platShippingAmt})</span>` : "";
                    str +=
                   `<div class="alignLeft">
                        <div><span class='gray'>${d.currency || ""}</span><span id="toAudit_table_platOrderAmt">${d.platOrderAmt || ""}</span>${amtDom}</div>
                        <div><span class="gray">平台费</span>${fee.join(' + ')}</div>
                        <div><span class="gray">商品成本(￥)</span>${d.prodCost} / ${d.costPrice}</div>
                        <div><span class="gray">物流成本(￥)</span>${d.shippingCost!==undefined ? d.shippingCost : "" }<button class="layui-btn layui-btn-xs" name="logisCost" style="cursor:pointer;">详</button></div>
                        <div><span class="gray">利润(￥)</span>${profitCalculation} <span class="gray">${(100 * d.profit / d.platOrderAmt / d.exchangeRate).toFixed(2)}%</span></div>
                    </div>`
                    return str
                }
            },
            {
                headerName: '商品',
                width:180,
                wrapText: true,
                autoHeight: true,
                cellRenderer: (data) => {
                    let d = data.data
                    return `<div class="alignLeft">
                        <div><span class="gray">种类：</span><span id="toAudit_table_skuQuantity">${d.skuQuantity||""}</span></div>
                        <div><span class="gray">数量：</span><span id="toAudit_table_prodQuantity">${d.prodQuantity||""}</span></div>
                        <div><span class="gray">预估重(g)：</span><span>${d.preWeight}</span></div>
                        <div><span class="gray">称重(g)：</span><span>${d.realWeight}</span></div>
                        <div><span class="gray">计费重(g)：</span><span>${d.priceWeight}</span></div>
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
                    let partBuyerNote = buyerNote.substring(0,100)
                    console.log('object :>> ', partBuyerNote);
                    const noteTipsHtml = `<span class="" data-text="${buyerNote}" onmouseenter="toDespatchBuyerTipsShow(this)" onmouseleave="toDespatchBuyerTipsHide(this)">${partBuyerNote}......</span>`
                    return `<div class="alignLeft">
                        <div id="toAudit_table_shippingUsername">${d.shippingUsername||""}</div>
                        <div>[${d.shippingCountryCnName||""}]</div>
                        <div><span class="gray">留言：</span>${buyerNote.length > 100 ?noteTipsHtml : buyerNote}</div>
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
                        <div>
                            <span class="gray">跟踪号：</span>
                            <span class="pora copySpan">
                                <a>${d.logisTrackingNo||""}</a>
                                <button class="layui-btn layui-btn-primary layui-btn-xs copyTxt" name="copy" onclick="layui.admin.copyTxt(this, event)">复制</button>
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
                    // let html = ''
                    // html += `<div class="alignLeft">
                    //     <div><span class="gray">仓库：</span>${d.warehouseName||""}</div>
                    //     <div><span class="gray">批次：</span>${d.orderLabel||""}</div>
                    //     <div><span class="gray">备注：</span>`
                    // // platOrderNotes 备注
                    // if(d.platOrderNotes && d.platOrderNotes.length > 1){
                    //     html += `<span lay-tips="12345678">多</span></div>
                    // </div>`
                    // }else{
                    //     html += `[${d.platOrderNotes[0].noteType||""}]${d.platOrderNotes[0].noteContent||""}</div>
                    // </div>`
                    // }
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
                        <div><span class="gray">仓库：</span>${d.warehouseName||""}</div>
                        <div><span class="gray">批次：</span>${d.orderLabel||""}</div>
                        <div><span class="gray">备注：</span>${recentNoteContent}${(d.platOrderNotes && d.platOrderNotes.length>1) ? noteTipsHtml : ''}</div>
                    </div>`
                    return html
                }
            },
            {
                headerName: '仓库处理',
                width:172,
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
                width:100,
                wrapText: true,
                autoHeight: true,
                cellRenderer: (data) => {
                    let d = data.data;
                    let showDom = '';
                    let showUpdate = '';
                    let wishBtnDom = ''
                    if (d.processStatus == 502 || d.processStatus == 115) {
                        showDom = $('#toDespatchOrder_splitPermTagTable').html();
                        // showUpdate = `<br><permTag:perm funcCode="toDespatchOrder_updatePermTag"><button name="toDespatchOrder_update" class="layui-btn layui-btn-xs">修改订单</button></permTag:perm>`;
                        showUpdate = $('#toDespatchOrder_updatePermTagTable').html();
                    }
                    if(d.platCode == "wish"){
                        wishBtnDom = $("#toDespatchOrder_btnPermTag_wish").html(); //wish取消
                    }
                    return `<button name="remark" class="layui-btn layui-btn-xs">备注</button>
                    <button type="button" name="receive" class="layui-btn layui-btn-xs toDespatchOrder__receiveBtn">收件信息</button>${showDom}${showUpdate}${wishBtnDom}`;
                }
            }
        ],
        rowData:toDespatchOrder_immutableStore,
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
            toDespatchOrder_gridOptions.columnApi.applyColumnState({ state: JSON.parse(window.localStorage.getItem("orderColumnState")) });
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

    $(document).off("click",".waitOrderErrorTipsClose").on("click",".waitOrderErrorTipsClose",function(){
        $(this).parents('.waitOrderErrorTips').remove()
    })

    var gridDiv = document.querySelector('#toDespatchOrder_table');
    agGrid.LicenseManager.setLicenseKey(
        "IRDEVELOPERS_COM_NDEwMjM0NTgwMDAwMA==f08aae16269f416fe8d65bbf9396be5f");
    new agGrid.Grid(gridDiv, toDespatchOrder_gridOptions);

        // 订单获得详细数据
        function toDespatchOrder_requestDetailedData(orderId) {
            return commonReturnPromise({
                url: ctx + '/unauditorder/detail.html',
                params: {orderId}
            })
        }

    function handleTableOptions(event){
        let optionEvent = event.event.target.name,
            data = event.data;// 获取选中行数据

        if (optionEvent == 'remark') {
            commonDirectMailRemark(data);
        }else if (optionEvent == "toDespatchOrder_wishBtn") {
            // wish退款
            originOrderWishRefund([data],'',function(){
                $('#toDespatchOrderSearch').trigger('click')
            })
        } else if (optionEvent == 'receive') {
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
            toDespatchOrder_requestDetailedData(data.id).then(res => {
                data.orderDetails = res
                toDespatchOrder_orderUpdate('2', data);
            })
        }else if(optionEvent === 'logisCost'){
          //物流成本
          commonLogisCostLayerHandle(data.id);
        }else if(event.event.timeStamp - timeStamp < 300) {
            data.showLogisAttrList = true;
            data.showSale = true;
            // data被修改了？
            commonOrderDetailFn(data, toDespatchOrder_gridOptions, 'toDespatchOrder');
        }
    }

     //根据平台code,roleNames获取店铺列表
     function getStoreByPlatformAndRoleName(platcode, func) {
        initAjax('/sys/listStoreForRenderHpStoreCommonComponent.html', 'post', { platCode: platcode,roleNames: `${platcode}专员`, }, function(returnData) {
            if (func) {
                func(returnData)
            }
        }, 'application/x-www-form-urlencoded')
    }

        //合并订单拆单
    function toDespatchOrder_mergeDemolition(id) {
          initAjax('/unauditorder/splitmergeorder.html', 'post', { id: id }, function(returnData) {
              layer.msg(returnData.msg || '拆单成功');
              $('#toDespatchOrderSearch').trigger('click');
          }, 'application/x-www-form-urlencoded')
    }

    // 根据商品sku获取商品信息
    function getProdInfoByprodsku(arr, func) {
        initAjax('/unauditorder/listprodinfobysku.html', 'POST', JSON.stringify(arr), function(returnData) {
            if (func) {
                func(returnData)
            }
        })
    }

     // 站点随店铺联动查询
     function toAuditOrderSiteByStore(initSiteId = "") {
        const str = $("#toDespatchOrder_editForm")
            .find('select[name="storeAcctId"] option:selected')
            .val()
         let siteStr = ''
         storeData && storeData.forEach(item => {
            if (str === item.code) {
                siteStr = item.salesSite
            }
         })
        const _site = siteStr ? siteStr.toString().split(",") : []
        const _platCode = $("#toDespatchOrder_editForm")
        .find('select[name="platCode"]')
        .val()
        getAllSite(_platCode, function (returnData) {
        const res = returnData.data.filter((item) =>
            _site.some((elem) => elem == item.code)
        )
        appendSelect(
            $("#toDespatchOrder_editForm").find('select[name="siteId"]'),
            res,
            "code",
            "name"
        )
        initSiteId &&
            Selected(
            $("#toDespatchOrder_editForm").find('select[name="siteId"]'),
            initSiteId
            )
        form.render()
        })
    }

     // 获取商品列表
     function getProductList(sSku, func) {
        initAjax('/product/getProds.html', 'post', { searchType: 'sSku', searchValue: sSku, page: 1, limit: 300, isCombination: false, isSale: '' }, function(returnData) {
            if (func) {
                func(returnData)
            }
        }, 'application/x-www-form-urlencoded')
    }

    var storeData = []
     //修改订单
     function toDespatchOrder_orderUpdate(type, data) {
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
            btn: ['保存','取消'],
            area: ['90%', '80%'],
            move: false,
            content: $('#pop_toDespatchOrder_newandeditorder').html(),
            id: 'pop_toDespatchOrder_newandeditorderId',
            success: function(layero, index) {
                if(type==2){
                  //店铺单号platOrderId,平台platCode,店铺storeAcctId,站点siteId都不能编辑
                  layero.find('input[name=platOrderId]').prop('disabled', true);
                  layero.find('select[name=platCode]').removeAttr('lay-search').prop('disabled', true);
                  layero.find('select[name=storeAcctId]').removeAttr('lay-search').prop('disabled', true);
                  layero.find('select[name=siteId]').removeAttr('lay-search').prop('disabled', true);
                }
                commonOrderGetLogisticAjax().then(logisTypeArr => {
                var id = data ? data.id : ""
                var isSavable = $(layero).find('#order_savebtn')
                if (isSavable.length && isSavable.length > 0) {
                    $(layero).find('.layui-layer-btn0').removeClass('hide')
                } else {
                    $(layero).find('.layui-layer-btn0').addClass('hide')
                }
                $(layero).find('.layui-tab').find('ul').find('li').each(function(index, item) {
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
                appendSelect($('#toDespatchOrder_editForm').find('select[name="storeAcctId"]'), [], 'id', 'storeAcct','','salesSite')
                // appendSelect($('#toDespatchOrder_editForm').find('select[name="platOrderStatusList"]'), toAuditOrder_platOrderStatus, 'platOrderStatus', 'platOrderStatus')
                appendSelect($('#toDespatchOrder_editForm').find('select[name="warehouseId"]'), toDespatchOrder_pageEnum.prodWarehouses, 'name', 'value')
                appendSelect($('#toDespatchOrder_editForm').find('select[name="logisTypeId"]'), logisTypeArr, 'id', 'name')
                form.render('select');
                // appendSelect($('#toDespatchOrder_editForm').find('select[name="siteId"]'), toDespatchOrder_Site, 'code', 'name')
                appendSelect($('#toDespatchOrder_editForm').find('select[name="currency"]'), toDespatchOrder_Currency, 'code', 'name')
                appendSelect($('#toDespatchOrder_editForm').find('select[name="shippingCountryCode"]'), shippingCountryCodeList, 'shippingCountryCode', 'name')
                // 备注类型
                appendSelect($('#toDespatchOrder_editForm').find('select[name="noteType"]'),toDespatchOrder_pageEnum.toDespatchOrder_orderLabels,'label', 'label')

                
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
                        storeData = returnData.data
                        toAuditOrderSiteByStore(data.siteId)
                    })
                    getAllSite(data.platCode, function(returnData) {
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

                form.on('select(edit_storeAcct)', function(obj) {
                    toAuditOrderSiteByStore()
                })
                if (type === '2') {
                    // 修改订单
                    //监听物流方式下拉选择
                    form.on('select(edit_logisTypeId)', function(obj) {
                        $('#toDespatchOrder_editForm input[name=logisTrackingNo]').val('')
                    })
                }
                //监听平台下拉选择
                form.on('select(edit_platCode)', function(obj) {
                    getStoreByPlatformAndRoleName(obj.value,function(returnData){
                        storeData = returnData.data
                        appendSelect($('#toDespatchOrder_editForm').find('select[name="storeAcctId"]'), returnData.data, 'id', 'storeAcct','','salesSite')
                        form.render()
                    })
                    getAllSite(obj.value, function(returnData) {
                        appendSelect($('#toDespatchOrder_editForm').find('select[name="siteId"]'), returnData.data, 'code', 'name')
                        form.render()
                    })
                })
                $('#toDespatchOrder_addProducts').click(function() {
                    var orginaldata = data ? toAuditGetEditTableData(concatData, edit_order_tableIns) : []
                    var prodSku = $(this).siblings('input').val();
                    if (prodSku !== "") {
                        getProductList(prodSku, function(returnData) {
                            toauditorderAddprod(returnData, function (callback) {
                                concatData = orginaldata ? orginaldata.concat(callback) : [].concat(callback)
                                edit_order_tableIns = toDespatchOrderProdTableRender(concatData)
                            })
                        })
                    } else {
                        layer.msg('添加商品sku不能为空')
                    }
                })
                $(layero).on('click','.refresh_icon',function() {
                    var dataArr = [];
                    var prodSSku = $(this).parents('tr').find('[data-field=prodSSku] input').val(),
                        prodQuantity = $(this).parents('tr').find('[data-field=prodQuantity] input').val(),
                        platOrderDetailAmt = $(this).parents('tr').find('[data-field=platOrderDetailAmt] input').val();
                        warehouseId = $('#toDespatchOrder_editForm').find('select[name="warehouseId"]').val();
                    dataArr.push({
                        "prodSSku":prodSSku,
                        "prodQuantity":prodQuantity,
                        "platOrderDetailAmt":platOrderDetailAmt,
                        "warehouseId": warehouseId
                    });
                    var prodskus = $(this).siblings('input').val()
                    var index = $(this).parents('tr').attr("data-index")
                    if (prodskus !== "") {
                        getProdInfoByprodsku(dataArr, function(returnData) {
                            var data = concatData[index]
                            var newdata = returnData.data[0]
                            concatData[index] = Object.assign(data,newdata)
                            edit_order_tableIns = toDespatchOrderProdTableRender(concatData)
                        })
                    } else {
                        layer.msg('请填写sku')
                    }
                })
                loading.hide()
                });
            },
            yes: function(index, layero) {
                form.on('submit(edit_submit)', function(obj) {
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
                        if(!validOptions) {
                            return;
                        }
                        savetoAuditOrders(param, function(returnData) {
                            if (type == 2) {
                                layer.msg(returnData.msg || '保存成功', { icon: 1 });
                            } else {
                                if (returnData.data) {
                                    layer.alert(`新增订单号为:${returnData.data}`);
                                } else {
                                    layer.msg(returnData.msg || '保存成功', { icon: 1 });
                                }

                            }
                            let prodQuantity = 0
                            param.platOrderDetails.forEach(v => {
                                prodQuantity += v.prodQuantity * 1
                            })
                            $('#toDespatchOrder_table').next().find('#toAudit_table_storeAcct').text($(layero).find('#edit_storeAcct option:selected').text())
                            $('#toDespatchOrder_table').next().find('#toAudit_table_platOrderId').text(param.platOrderId)
                            $('#toDespatchOrder_table').next().find('#toAudit_table_platOrderAmt').text(param.platOrderAmt)
                            $('#toDespatchOrder_table').next().find('#toAudit_table_skuQuantity').text(param.platOrderDetails.length)
                            $('#toDespatchOrder_table').next().find('#toAudit_table_prodQuantity').text(prodQuantity)
                            $('#toDespatchOrder_table').next().find('#toAudit_table_shippingUsername').text(param.shippingUsername)
                            $('#toDespatchOrder_table').next().find('#toAudit_table_buyerRequireShippingType').text(param.buyerRequireShippingType)
                            $('#toDespatchOrder_table').next().find('#toAudit_table_orderTimeCn').text(Format(param.orderTimeCn||"",'yyyy-MM-dd hh:mm:ss'))
                            $('#toDespatchOrderSearch').click();
                            layer.close(index)
                        })
                    } else {
                        layer.msg('请添加商品')
                    }
                })
                $(layero).find('#edit_submit').click();
            },
            end:function(){
            }
        })
    }

    //获取编辑表格数据
    function toAuditGetEditTableData(data, tableIns) {
        var layFilterIndex = 'LAY-table-' + tableIns.config.index;
        var tableContainer = $('div[lay-filter="' + layFilterIndex + '"]');
        tableContainer.find('tr').each(function(index, item) {
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
        console.log(data);
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
                laytpl(getTpl).render(data, function(html){ //渲染到表格
                    getUl.innerHTML = html;
                });
                // 修改收件人信息 解密地址
                $("#decryptAddress").on('click', function () {
                    initAjax('/platorder/decryptAndGet', 'get', { orderId: data.id }, function(returnData) {
                        // 解密后地址回显
                        let data = returnData.data;
                        let { shippingUsername, shippingState, shippingCity, shippingZip, shippingStreet1, shippingStreet2, shippingPhoneNumber} = data;
                        layero.find('td input[name=shippingUsername]').val(shippingUsername);
                        layero.find('td input[name=shippingState]').val(shippingState);
                        layero.find('td input[name=shippingCity]').val(shippingCity);
                        layero.find('td input[name=shippingZip]').val(shippingZip);
                        layero.find('td input[name=shippingStreet1]').val(shippingStreet1);
                        layero.find('td input[name=shippingStreet2]').val(shippingStreet2);
                        layero.find('td input[name=shippingPhoneNumber]').val(shippingUsername);
                    
                        
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
                    // $('#toDespatchOrderSearch').trigger('click');
                })
            }
        });
    }

    // 排序
    function sortBy(props) {
        return function(a,b) {
            return a[props] - b[props];
        }
    }
    //监听排序
    table.on('sort(toDespatchOrder_demolition_original_table)', function(obj) {
        toDespatchOrderStyle('toDespatchOrder_demolition_original_table')
    });

    function toDespatchOrderStyle(id){
        layui.table.cache[id].forEach((item,index) => {
            // 商品总量大于可用库存时，标红加粗
            if(item.allCount>item.availableStock && item.holdStock <= 0){
                // toDespatchOrder_product_table
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
    //拆分订单操作
    function toDespatchOrder_originOrderDemolimotion(data) {
        let orderDetails = data.orderDetails;
        data.orderDetails && data.orderDetails.sort(sortBy('availableStock'));
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
                            { title: "商品信息", field: "prodSSku",sort:true, templet: "#toDespatchOrder_orginal_order_products",width: 300 },
                            { title: "子店铺单号", field: "platOrderItemId" },
                            { title: "子订单类型", field: "platOrderDetailType" },
                            { title: "子订单状态", field: "platOrderDetailStatus" },
                            { title: "总重量(g)", field: "prodWeight", templet: "#toDespatchOrder_orginal_order_demolition", totalRow: true },
                            { title: "销售金额", field: "platOrderDetailAmt",totalRow: true},
                            { title: "物流属性", field: "prodLogisAttrList" },
                            { title: "sku重量(g)", field: "prodUnitWeight"},
                            { title: "可用库存", field: "availableStock",sort:true},
                            // , templet: '#toDespatchOrder_orginal_order_availableStock'
                            { title: "平台数量", field: "platQuantity"},
                            { title: "商品数量", field: "prodQuantity"},
                            // , templet: '#toDespatchOrder_orginal_order_prodQuantity'
                            { title: "商品总量", field: "allCount",sort:true},
                            { title: "成本占比", templet: "#toDespatchOrder_costRatio",width: 130 },
                            // , templet: '#toDespatchOrder_orginal_order_allCount'
                            { title: "拆分数量", templet: "#toDespatchOrder_orginal_order_number" },
                            { title: "拆分重量(g)", field: "prodSSkuWeight", templet: "#toDespatchOrder_orginal_order_dynamicWeight", totalRow: true },
                            { title: "拆分金额", field: "splitCost", templet: "#toDespatchOrder_orginal_order_dynamicMoney",totalRow: true },
                        ]
                    ],
                    page: true,
                    height: 480,
                    limit: 500,
                    limits: [200,500],
                    id: 'toDespatchOrder_demolition_original_table',
                    done: function(res) {
                        let newArr = delSameObjValue(layui.table.cache.toDespatchOrder_demolition_original_table, 'allCount', ['prodSSku'], ['prodQuantity']);
                        layui.table.cache.toDespatchOrder_demolition_original_table.forEach((item,index) => {
                            let TableDom = $("#toDespatchOrder_demolition_original_table").next()
                            newArr.forEach(cItem => {
                                if (item.prodSSku == cItem.prodSSku) {
                                    item.allCount = cItem.allCount
                                }
                            })
                            // // 商品总量大于可用库存时，标红加粗
                            // if(item.allCount>item.availableStock){
                            //     TableDom.find(`tr[data-index=${index}] td[data-field=availableStock]>div`).addClass('orderRedStyle')
                            //     TableDom.find(`tr[data-index=${index}] td[data-field=platQuantity]>div`).addClass('orderRedStyle')
                            //     TableDom.find(`tr[data-index=${index}] td[data-field=prodQuantity]>div`).addClass('orderRedStyle')
                            //     TableDom.find(`tr[data-index=${index}] td[data-field=allCount]>div`).addClass('orderRedStyle')
                            // }
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
                    if(!turnToAbnormalOrderTag&&!turnToAbnormalOrder){
                        layer.msg('操作成功', { icon: 1 });
                        layer.close(index);
                        updateSingleRow_toDespatchOrder(data.id)
                        // $('#toDespatchOrderSearch').trigger('click');
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
                                updateSingleRow_toDespatchOrder(data.id)
                                // $('#toDespatchOrderSearch').trigger('click');
                            })
                            
                        }, 'application/x-www-form-urlencoded')
                    }else if(turnToAbnormalOrder){
                        initAjax('/abnormalorder/tocancel.html', 'post', { ids: res }, function (returnData) {
                            layer.close(index);
                            layui.admin.batchResultAlert(`拆除订单{${res}}已转至取消订单:`, returnData.data, function (errIdsArr) {
                                // $('#toDespatchOrderSearch').trigger('click');
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
        for (let i = 0; i < $tr.length; i++){
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
            let companyFlag = ['SMT物流','虾皮','Lazada','Joom线上', '待处理订单'].includes(companyName)
            let turnToAbnormalOrder = $('#toDespatchOrder_demo_original_abnormal').prop('checked')
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
    //
    // function toDespatchOrderTableWatchbar() {
    //     table.on('tool(toDespatchOrder_table)', function(obj) {
    //         if (obj.event == 'edit') {
    //             // toDespatchOrderNewandEdit(obj.data)
    //             commonOrderDetailFn(obj.data);
    //         } else if (obj.event == 'remark') {
    //             commonDirectMailRemark(obj.data);
    //         }
    //     });
    // }
    //
    // //监听表格tr的点击[查看详情]
    // function toDespatchOrder_watchTableTr() {
    //     $('#toDespatchOrderCard .layui-table-main').on('click', 'td[data-field=platOrderStatus]', function (event) {
    //         var $targetBtn = $(this).parents('tr').find('span[lay-event=edit]');
    //         $targetBtn.trigger('click');
    //         event.stopPropagation();
    //         event.preventDefault();
    //     });
    // }
    //保存修改新增待审核订单
    function savetoAuditOrders(data, func) {
        initAjax('/unauditorder/saveorder.html', 'post', JSON.stringify(data), function(returnData) {
            if (func) {
                func(returnData)
            }
        })
    }

    // 添加商品
    function toauditorderAddprod(data, func) {
        layer.open({
            type: 1,
            title: '添加商品',
            btn: ['添加商品', '关闭'],
            area: ['70%', '60%'],
            content: $('#pop_toDespatchOrder_addProducts').html(),
            success: function(layero, index) {
                table.render({
                    elem: '#toDespatchOrder_addProducts_table',
                    data: data.data,
                    cols: [
                        [
                            { checkbox: true, width: 30 },
                            { title: "图片", field: "imageUrl", templet: "#add_product_img" },
                            { title: "商品数量", templet: "#toDespatchOrder_add_product_prodQuantity" },
                            { title: "销售金额", templet: "#toDespatchOrder_add_product_platOrderDetailAmt" },
                            { title: "商品状态", field: "isSale",templet: function (d) {return d.isSale?'在售':'停售'} },
                            { title: "商品sku", field: "sSku" },
                            { title: "父sku", field: "", templet: "#add_product_psku" },
                            { title: "商品名称", field: "title" },
                            { title: "款式", field: "style" }
                        ]
                    ],
                    page: true,
                    limit: 100,
                    limits:[100,300,500],
                    id: 'toDespatchOrder_addProducts_table',
                    done: function(res) {
                        imageLazyload();
                    }
                })
            },
            yes: function(index, layero) {
                var trs = layero.find('.layui-table-body tbody>tr');
                var dataArr = [];
                for (var i = 0; i < trs.length; i++){
                    var tr = trs[i];
                    if($(tr).find('.layui-unselect.layui-form-checkbox.layui-form-checked').length != 0){
                        var prodSSku = $(tr).find('[data-field="sSku"] div').text(),
                            prodQuantity = $(tr).find('input[name=prodQuantity]').val(),
                            platOrderDetailAmt = $(tr).find('input[name=platOrderDetailAmt]').val(),
                            warehouseId = $('#toDespatchOrder_editForm').find('select[name="warehouseId"]').val();
                        dataArr.push({
                            "prodSSku":prodSSku,
                            "prodQuantity":prodQuantity,
                            "platOrderDetailAmt":platOrderDetailAmt,
                            "warehouseId": warehouseId
                        });
                    }

                };
                if(dataArr.length == 0){
                    layer.msg("请选择需要提交的数据")
                    return;
                }
                getProdInfoByprodsku(dataArr,function(returnData){
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

    function toDispathOrderDetail(data) {
        layer.open({
            type: 1,
            title: '详情',
            btn: ['关闭'],
            area: ['90%', '40%'],
            btnAlign: 'l',
            maxmin: true,
            content: $('#pop_todispathorder_detail').html(),
            id: 'pop_todispathorder_detail_id',
            success: function(layero, index) {
                detailpopflag = true
                table.render({
                    elem: '#todispathorder_detail_table',
                    method: 'POST',
                    data: data.orderDetails,
                    cols: [
                        [
                            { title: "图片", field: "imageUrl", templet: "#todispatchr_detail_img_tpl" },
                            { title: "Listing_ID", field: "itemId" },
                            { title: "店铺SKU", field: "storeSSku" },
                            { title: "商品SKU", field: "prodSSku" },
                            { title: "库位", field: "stockLocation" },
                            { title: "商品名称", field: "prodTitle" },
                            { title: "入库要求", field: "packDesc" },
                            { title: '款式', field: "style" },
                            { title: '可用库存', field: "availableStock" },
                            { title: '商品成本(￥)', field: "prodUnitCost" },
                            { title: '累计净重(g)', field: "prodUnitWeight" },
                            { title: '报关信息', field: "style" },
                            { title: '销售单价', field: "platUnitPrice", templet: "<div><span class='gray'>{{d.currency||''}}</span> {{d.platUnitPrice}}</div>" },
                            { title: '销售数量', field: "platQuantity" },
                            { title: '销售金额', field: "platOrderDetailAmt", templet: "<div><span class='gray'>{{d.currency||''}}</span> {{d.platOrderDetailAmt}}</div>" }
                        ]
                    ],
                    page: false,
                    limit: 500,
                    id: 'todispathorder_detail_table',
                    done: function(res) {
                        imageLazyload();
                    }
                })
            },
            end: function() {
                detailpopflag = false
            }
        })
    }

    // 渲染页面分页
    function toDespatchOrderPage(data, count) {
        laypage.render({
            elem: 'toDespatchOrderPage',
            curr: data.page,
            limit: data.limit,
            limits:[1000,2000,5000, 10000, 20000],
            layout: ['prev', 'page', 'next', 'count', 'limit'],
            count: count,
            jump: function(obj, first) {
                $('#toDespatchOrderForm input[name="limit"]').val(obj.limit); //保障下次的分页请求中带有的值正确
                $('#toDespatchOrderForm input[name="page"]').val(obj.curr); //保障下次的分页请求中带有的值正确
                //首次不执行
                if (!first) {
                    data.page = obj.curr;
                    data.limit = obj.limit;
                    $('#toDespatchOrderSearch').click()
                }

            }
        });
    }

    //修改订单
    function toDespatchOrderNewandEdit(data) {
        edit_order_tableIns = null;
        var concatData = []
        layer.open({
            type: 1,
            title: '查看详情',
            btn: ['保存', '取消'],
            area: ['90%', '80%'],
            maxmin: true,
            content: $('#pop_toDespatchOrder_newandeditorder').html(),
            success: function(layero, index) {
                var id = data ? data.id : ""
                var isSavable = $(layero).find('#order_savebtn')
                if (isSavable.length && isSavable.length > 0) {
                    $(layero).find('.layui-layer-btn0').removeClass('hide')
                } else {
                    $(layero).find('.layui-layer-btn0').addClass('hide')
                }
                $(layero).find('.layui-tab').find('ul').find('li').each(function(index, item) {
                    $(item).data('orderId', id)
                })
                laydate.render({
                    elem: '#edit_time',
                    type: 'datetime'
                });
                appendSelect($('#toDespatchOrder_editForm').find('select[name="storeAcctId"]'), toDespatchOrder_allstore, 'id', 'storeAcct', 'platCode')
                // appendSelect($('#toDespatchOrder_editForm').find('select[name="platOrderStatusList"]'), toDespatchOrder_platOrderStatus, 'platOrderStatus', 'platOrderStatus')
                appendSelect($('#toDespatchOrder_editForm').find('select[name="warehouseId"]'), toDespatchOrder_pageEnum.prodWarehouses, 'name', 'value')
                appendSelect($('#toDespatchOrder_editForm').find('select[name="logisTypeId"]'), toDespatchOrder_logisType, 'id', 'name')
                appendSelect($('#toDespatchOrder_editForm').find('select[name="siteId"]'), toDespatchOrder_Site, 'code', 'name')
                appendSelect($('#toDespatchOrder_editForm').find('select[name="currency"]'), toDespatchOrder_Currency, 'code', 'name')
                if (data) {
                    data.orderTimeCn = Format(data.orderTimeCn, 'yyyy-MM-dd hh:mm:ss')
                    form.val("toDespatchOrder_editForm", data);
                    storeSelected($('#toDespatchOrder_editForm select[name="storeAcctId"]'), data.storeAcctId.toString())
                    getAllSite(data.platCode, function(returnData) {
                        appendSelect($('#toDespatchOrder_editForm').find('select[name="siteId"]'), returnData.data, 'code', 'name')
                        Selected($('#toDespatchOrder_editForm select[name="siteId"]'), data.siteId)
                        form.render()
                    })
                    data.orderDetails = data.orderDetails.sort(function (a, b) {
                        return a.availableStock - b.availableStock;
                    });
                    concatData = data.orderDetails
                    edit_order_tableIns = toDespatchOrderProdTableRender(concatData)
                }
                form.render()
            },
            yes: function(index, layero) {},
        })
    }

    //渲染商品信息表格
    // function toDespatchOrderProdTableRender(data) {
    //     tableIns = table.render({
    //         elem: '#toDespatchOrder_product_table',
    //         id: 'toDespatchOrder_product_table',
    //         data: data || [],
    //         cols: [
    //             [
    //                 { title: "图片", field: "imageUrl", templet: "#toDespatchOrder_detail_img_tpl" },
    //                 { title: "Listing_ID", field: "itemId" },
    //                 { title: "店铺SKU", field: "storeSSku" },
    //                 { title: "商品SKU", field: "prodSSku" }, //
    //                 { title: "库位", field: "stockLocation" },
    //                 { title: "商品名称", field: "prodTitle" },
    //                 { title: "入库要求", field: "packDesc" },
    //                 { title: '款式', field: "style" },
    //                 { title: '可用库存', field: "availableStock" },
    //                 { title: '商品成本（￥）', field: "prodUnitCost" },
    //                 { title: '累计净重（g）', field: "prodUnitWeight" },
    //                 { title: '报关信息', field: "style" },
    //                 // { title: '销售单价', field: "platUnitPrice" },
    //                 { title: '商品数量', field: "prodQuantity" },
    //                 { title: '销售金额', field: "platOrderDetailAmt" },
    //                 { title: '操作', toolbar: "#toAuditOrder_edit_option", width: 100 }
    //             ]
    //         ],
    //         page: false,
    //         limit: 300,
    //         done: function(res) {
    //             imageLazyload();
    //         }
    //     })
    //     return tableIns
    // }

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
            done: function(res) {
                let newArr = delSameObjValue(layui.table.cache.toDespatchOrder_product_table, 'allCount', ['prodSSku'], ['prodQuantity']);
                layui.table.cache.toDespatchOrder_product_table.forEach((item,index) => {
                    newArr.forEach(cItem => {
                        if (item.prodSSku == cItem.prodSSku) {
                            item.allCount = cItem.allCount
                        }
                    })
                    $("#toDespatchOrder_product_table").next().find(`tr[data-index=${index}] td[data-field=allCount] div`).text(res.data[index].allCount)
                })
                toDespatchOrderStyle('toDespatchOrder_product_table')
                imageLazyload();
                table.on("tool(toDespatchOrder_product_table)", function(obj) {
                    if (obj.event = "edit_prod_delete") {
                        layer.confirm('请确认是否删除子订单所有信息', {
                            title: '提示',
                            icon: 3,
                            btn: ['确定','取消'] //按钮
                          }, function(layerIndex){
                            if(obj.data  && obj.data.platDetailTranscationId){
                                return layer.msg('该子订单非手动添加，不支持删除')
                            }else if(obj.data && obj.data.platQuantity !== undefined && obj.data.platQuantity != '0'){
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
    $("#toDespatchOrder_towinit").click(function() {
        let ids = getTableSelectIds();
        if (!ids || ids.length <= 0) {
            layer.msg("未选择订单", { icon: 0 });
            return;
        }
        //提交到万邑通出库单
        toWinitOrder(ids.join(","), function(returnData) {
            layui.admin.batchResultAlert("提交万邑通出库单:", returnData.data, function() {});
            //处理完成后不刷新页面
        });
    });
    //2、同步万邑通跟踪号
    $("#toDespatchOrder_syncwinittrackno").click(function() {
        let ids = getTableSelectIds();
        if (!ids || ids.length <= 0) {
            layer.msg("未选择订单", { icon: 0 });
            return;
        }
        //同步万邑通出库单跟踪号
        syncWinitTrackNo(ids.join(","), function(returnData) {
            //处理完成后不刷新页面
            layui.admin.batchResultAlert("同步万邑通出库单跟踪号:", returnData.data, function() {});
        });

    });
    //3、同步万邑通预估派送费
    $("#toDespatchOrder_syncWinitOutOrderCalcFee").click(function() {
        let ids = getTableSelectIds();
        if (!ids || ids.length <= 0) {
            layer.msg("未选择订单", { icon: 0 });
            return;
        }
        syncWinitOutOrderCalcFee(ids.join(","), function(returnData) {
            //处理完成后不刷新页面
            layui.admin.batchResultAlert("同步万邑通预估派送费:", returnData.data, function() {});
        });

    });
    //派至仓库
    $("#toDespatchOrder_dispatch").click(function() {
        let ids = getTableSelectIds();
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

        // initAjax('/undispatch/dispatch.html', 'post', { ids: ids.join(",") }, function(returnData) {
        //     layui.admin.batchResultAlert("派至仓库:", returnData.data, function() {
        //         getSuccessRemove(returnData.data, 'toDespatchOrder_table', '派至仓库', 'markSymbol')
        //         // $('#toDespatchOrderSearch').click();
        //     });
        // }, 'application/x-www-form-urlencoded');
    });
    //取消wishpost订单
    $('#toDespatchOrder_cancelwishpost').click(function() {
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
                $(layero).find('.layui-layer-content').html($("#toDespatchOrder_cancelWishpostTpl").html());
                layui.form.render();
            },
            yes: function(index, layero) {
                var cancelReasonCode = $("#toDespatchOrder_cancelWishpostForm select[name=cancelReasonCode]").val();
                var invalidReason = $("#toDespatchOrder_cancelWishpostForm input[name=invalidReason]").val();
                //取消wishpost物流单
                initAjax('/platorder/cancelwishpost.html', 'post', {
                    ids: ids.join(','),
                    cancelReasonCode: cancelReasonCode,
                    invalidReason: invalidReason
                }, function(returnData) {
                    layui.admin.batchResultAlert("取消wishpost订单:", returnData.data, function(errIdsArr) {
                        deleteTableRow_toDespatchOrder(ids,errIdsArr)
                    });
                }, 'application/x-www-form-urlencoded')
            }
        })
    });
    //取消Edisebay订单
    $('#toDespatchOrder_cancelEdisebay').click(function() {
        var ids = getTableSelectIds();
        if (ids.length <= 0) {
            layer.msg('请选择订单', { icon: 7 });
            return
        }
        commonOrderConfirmLayer(ids.length, function (index) {
            initAjax('/platorder/cancelEdisebay.html', 'post', { ids: ids.join(',') }, function (returnData) {
                layer.close(index);
                layui.admin.batchResultAlert("取消Edisebay订单:", returnData.data, function(errIdsArr) {
                    deleteTableRow_toDespatchOrder(ids,errIdsArr)
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
                    updateTableRow_toDespatchOrder(ids,[])
                })
            }

        });
    });
    // 获取跟踪号
    $('#toDespatchOrder_getEdisebay').click(function() {
        var ids = getTableSelectIds();
        if (ids.length <= 0) {
            layer.msg('请选择订单', { icon: 7 });
            return
        }
        initAjax('/unauditorder/getlogistrackingno.html', 'post', {
            ids: ids.join(',')
        }, function(returnData) {
            layui.admin.batchResultAlert("获取跟踪号完成:", returnData.data, function(errIdsArr) {
                deleteTableRow_toDespatchOrder(ids,errIdsArr)
            });
        }, 'application/x-www-form-urlencoded')
    });
    //手动指定跟踪号
    $('#toDespatchOrder_updatelogistype').click(function() {
        var ids = getTableSelectIds();
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
            success: function(layero, index) {
                $(layero).find('.layui-layer-content').html($("#toDespatchOrder_updateLogisTypeTpl").html());
                //初始化物流公司
                appendSelect($('#toDespatchOrder_updateLogisTypeForm').find('select[name="logisCompany"]'), toDespatchOrder_company['companys'], 'id', 'cnName')
                    //初始化物流方式
                // initAjax('/unauditorder/listlogistype.html', 'get', {specialType: "直发物流"}, function(returnData) {
                //     appendSelect($('#toDespatchOrder_updateLogisTypeForm').find('select[name="logisType"]'), returnData.data, 'id', 'name')
                //     form.render()
                // });
                commonOrderGetLogisticAjax().then(logisTypeArr => {
                  appendSelect($('#toDespatchOrder_updateLogisTypeForm').find('select[name="logisType"]'), logisTypeArr, 'id', 'name')
                    form.render()
                });
                    //物流公司改变触发
                form.on('select(toDespatchOrder_logisCompany)', function(obj) {
                    var logisticsCompanyId = obj.value;
                    commonOrderGetLogisticAjax({logisticsCompanyId: logisticsCompanyId}).then(logisTypeArr => {
                      appendSelect($('#toDespatchOrder_updateLogisTypeForm').find('select[name="logisType"]'), logisTypeArr, 'id', 'name')
                        form.render()
                    });
                })
                layui.form.render();
            },
            yes: function(index, layero) {
                var logisTypeId = $("#toDespatchOrder_updateLogisTypeForm select[name=logisType]").val();
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
                        updateTableRow_toDespatchOrder(ids,errIdsArr)
                        layer.close(index);
                    });
                    // layer.close(index);
                    // let checkStatus = toDespatchOrder_gridOptions.api.getSelectedRows();
                    // if (returnData.data.successNum <= 0) {
                    //     return
                    // }
                    // let temStrArr = []
                    // // 把修改成功的id存成数组，以便于后面匹配和取数据
                    // for(let key in returnData.data.logs){
                    //     temStrArr.push(key)
                    // }
                    // let newCheckStatus = deepCopy(checkStatus)
                    // // 匹配选中的数据
                    // checkStatus.forEach((v,index) => {
                    //     if(temStrArr.indexOf(v.id.toString()) > -1){ // 如果匹配到，就代表这一条数据修改成功，前端显示
                    //         newCheckStatus[index].logisTypeName = returnData.data.logs[v.id]
                    //     }
                    // })
                    // toDespatchOrder_gridOptions.api.updateRowData({ update: newCheckStatus })
                }, 'application/x-www-form-urlencoded')
            }
        })
    });
    //申请跟踪号
    $('#toDespatchOrder_applylogisno').click(function () {
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
                deleteTableRow_toDespatchOrder(ids,errIdsArr)
                // let temArr = getOrderId(returnData.data.successResults, '取消订单', returnData.data.successNum) || []
                // let statusStr = $('#toDespatchOrder_tab .layui-this').text()
                // let count, idStr = []
                // // let checkStatus = table.checkStatus('toDespatchOrder_table').data
                // let checkStatus = toDespatchOrder_gridOptions.api.getSelectedRows();
                // let checkedDataId = checkStatus.map(item => item.id) // 唯一值，用以和全部数据匹配

                // if (statusStr.indexOf('待申请') > -1) {
                //     count = returnData.data.successNum * 1 + returnData.data.failNum * 1
                //     idStr = ids
                // } else if (statusStr.indexOf('待取跟踪号') > -1) {
                //     count = returnData.data.successNum * 1 + returnData.data.failNum * 1
                //     idStr = ids
                // } else if (statusStr.indexOf('申请成功') > -1) {
                //     count = returnData.data.failNum
                //     if (count > 0) {
                //         idStr = returnData.data.failResults.join().replace(/订单:\[/g, '').split(',').map(v => parseInt(v))
                //     }

                //     updataCheckedDataDiff(returnData, { field: 'logisTrackingNo', tableId: 'toDespatchOrder_table', tableDomId: '#toDespatchOrder_table', spanDomId: '#logisTrackingNo_toDespatchOrder', status: '标记异常' }, checkedDataId)
                // } else if (statusStr.indexOf('申请失败') > -1) {
                //     count = returnData.data.successNum
                //     if (count > 0) {
                //         idStr = returnData.data.successResults.join().replace(/订单:\[/g, '').split(',').map(v => parseInt(v))
                //     }
                // } else if (statusStr.indexOf('全部') > -1) {
                //     count = 0
                //     idStr = []
                //     updataCheckedDataDiff(returnData, { field: 'logisTrackingNo', tableId: 'toDespatchOrder_table', tableDomId: '#toDespatchOrder_table', spanDomId: '#logisTrackingNo_toDespatchOrder', status: '标记异常' }, checkedDataId, true)
                //     updataCheckedData('toDespatchOrder_table', checkStatus, { field: 'logisTrackingNo', value: '[]', dom: '#logisTrackingNo_toDespatchOrder' })
                // }
                // changeCount('#toDespatchOrder_tab', count)
                // idStr.forEach(value => {
                //     deleteCheckedData('toDespatchOrder_table', [value], `td[data-content="${value}"]`)
                // });
            });
        });
        // initAjax('/unauditorder/applylogistrackingno.html', 'post', { ids: ids.join(',') }, function(returnData) {
        //     layui.admin.batchResultAlert("申请跟踪号:", returnData.data, function() {
        //         // let temArr = getOrderId(returnData.data.successResults, '取消订单', returnData.data.successNum) || []
        //         let statusStr = $('#toDespatchOrder_tab .layui-this').text()
        //         let count,idStr = []
        //         // let checkStatus = table.checkStatus('toDespatchOrder_table').data
        //         let checkStatus = toDespatchOrder_gridOptions.api.getSelectedRows();
        //         let checkedDataId = checkStatus.map(item => item.id) // 唯一值，用以和全部数据匹配

        //         if (statusStr.indexOf('待申请') > -1) {
        //             count = returnData.data.successNum * 1 + returnData.data.failNum * 1
        //             idStr = ids
        //         }else if (statusStr.indexOf('待取跟踪号') > -1) {
        //             count = returnData.data.successNum * 1 + returnData.data.failNum * 1
        //             idStr = ids
        //         }else if (statusStr.indexOf('申请成功') > -1) {
        //             count = returnData.data.failNum
        //             if (count > 0) {
        //                 idStr = returnData.data.failResults.join().replace(/订单:\[/g, '').split(',').map(v => parseInt(v))
        //             }

        //             updataCheckedDataDiff(returnData, {field: 'logisTrackingNo', tableId: 'toDespatchOrder_table', tableDomId: '#toDespatchOrder_table', spanDomId: '#logisTrackingNo_toDespatchOrder', status: '标记异常'}, checkedDataId)
        //         }else if (statusStr.indexOf('申请失败') > -1) {
        //             count = returnData.data.successNum
        //             if (count > 0) {
        //                 idStr = returnData.data.successResults.join().replace(/订单:\[/g, '').split(',').map(v => parseInt(v))
        //             }
        //         }else if (statusStr.indexOf('全部') > -1) {
        //             count = 0
        //             idStr = []
        //             updataCheckedDataDiff(returnData, {field: 'logisTrackingNo', tableId: 'toDespatchOrder_table', tableDomId: '#toDespatchOrder_table', spanDomId: '#logisTrackingNo_toDespatchOrder', status: '标记异常'}, checkedDataId, true)
        //             updataCheckedData('toDespatchOrder_table', checkStatus, {field: 'logisTrackingNo', value: '[]', dom: '#logisTrackingNo_toDespatchOrder'})
        //         }
        //         changeCount('#toDespatchOrder_tab', count)
        //         idStr.forEach(value => {
        //             deleteCheckedData('toDespatchOrder_table', [value], `td[data-content="${value}"]`)
        //         });
        //         // $('#toDespatchOrderSearch').click();
        //     });
        // }, 'application/x-www-form-urlencoded');
    });

    //清空跟踪号
    $('#toDespatchOrder_removelogisno').click(function() {
        var ids = getTableSelectIds();
        if (ids.length <= 0) {
            layer.msg('请选择订单', { icon: 7 });
            return
        }
        commonOrderConfirmLayer(ids.length, function (index) {
            initAjax('/unauditorder/removelogistrackingno.html', 'post', { ids: ids.join(',') }, function(returnData) {
                // layer.msg('清空跟踪号成功', { icon: 1 });
                layer.close(index);
                deleteTableRow_toDespatchOrder(ids,[])
            }, 'application/x-www-form-urlencoded');
        })
    });

    //打印面单
    $('#toDespatchOrder_printlogistpl').click(function() {
        var ids = getTableSelectIds();
        if (ids.length <= 0) {
            layer.msg('请选择订单', { icon: 7 });
            return
        }
        $.ajax({
            type: "POST",
            url: ctx + "/logistics/batch/print.html",
            data: { orderIdStr: ids.join(',') },
            success:function (returnData){
            var paramsMapList = returnData.successResults;
            if (paramsMapList && paramsMapList.length > 0) {

                // joom 平台的数据打印宽度需要是150，
                // var checkStatus = table.checkStatus('toDespatchOrder_table')
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
            if(returnData.failResults && returnData.failResults.length > 0){
                let str = '';
                returnData.failResults.forEach(item => {
                    str += item + "<br>"
                })
                layer.alert(str,{icon:2})
            }
            },error:function(err){
                console.log(err)
            }
        })
    });
    //标记异常
    $('#toDespatchOrder_markException').click(function() {
        var ids = getTableSelectIds();
        if (!ids || ids.length < 1) {
            layer.msg('请选择订单', { icon: 7 });
            return;
        }
        commonOrderConfirmLayer(ids.length, function (index) {
            initAjax('/unauditorder/markabnormal.html', 'post', { ids: ids.join(',') }, function(returnData) {
                layui.admin.batchResultAlert("订单标记异常:", returnData.data, function (errIdsArr) {
                    deleteTableRow_toDespatchOrder(ids,errIdsArr)
                    // $('#toDespatchOrderSearch').click();
                    // getSuccessRemove(returnData.data, 'toDespatchOrder_table', '标记异常', 'markSymbol')
                });
            }, 'application/x-www-form-urlencoded')
        });
    });
    //转取消订单
    $('#toDespatchOrder_toCancel').click(function() {
        let ids = getTableSelectIds();
        if (!ids || ids.length < 1) {
            layer.msg('请选择订单', { icon: 7 });
            return;
        }
        commonOrderConfirmLayer(ids.length, function (index) {
            initAjax('/abnormalorder/tocancel.html', 'post', { ids: ids.join(",") }, function(returnData) {
                layui.admin.batchResultAlert("转取消订单:", returnData.data, function (errIdsArr) {
                    deleteTableRow_toDespatchOrder(ids,errIdsArr)
                    // $('#toDespatchOrderSearch').click();
                    // getSuccessRemove(returnData.data, 'toDespatchOrder_table', '取消订单', 'markSymbol')
                });
            }, 'application/x-www-form-urlencoded');
         });
    });
    //直接转已发货
    $('#toDespatchOrder_toShipped').click(function() {
        let ids = getTableSelectIds();
        if (!ids || ids.length < 1) {
            layer.msg('请选择订单', { icon: 7 });
            return;
        }
        commonOrderConfirmLayer(ids.length, function (index) {
            initAjax('/platorder/toshipped.html', 'post', { ids: ids.join(',') }, function (returnData) {
                layer.close(index);
                layui.admin.batchResultAlert("直接转已发货:", returnData.data, function (errIdsArr) {
                    deleteTableRow_toDespatchOrder(ids,errIdsArr)
                    // $('#toDespatchOrderSearch').click();
                    // getSuccessRemove(returnData.data, 'toDespatchOrder_table', '转已发货', 'markSymbol')
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
                laytpl(getTpl).render(data, function(html){ //渲染到表格
                    getUl.innerHTML = html;
                    form.render(null, 'toDespatchOrderBatchEditReceiverContainer');
                    toDespatchOrder_batchEditReceiverHandle('toDespatchOrderBatchEditReceiverContainer');
                });
            },
            yes: function (index,layero) {
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
                        layui.admin.batchResultAlert("批量修改收件信息:",res,function(){
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
        let idsArr = getTableSelectIds();
        if (idsArr.length == 0) {
            return layer.msg('请先选择数据', { icon: 7 });
        }
        let ids = idsArr.join('-');
        commonDirectMailRemarkBatch(ids,toDespatchOrder_gridOptions);
    });

    // 更新商品信息
    $('#toDespatchOrder_updateCostInfo').click(function(){
        let idsArr = getTableSelectIds();
        if (idsArr.length == 0) {
            return layer.msg('请先选择数据', { icon: 7 });
        }
        let ids = idsArr.join(',');
        commonReturnPromise({
            url: '/lms/unauditorder/updateprodinfo.html',
            type: 'post',
            params: {ids},
        }).then(res=>{
            layer.msg(res,{icon:1})
            updateTableRow_toDespatchOrder(idsArr,[])
        })
    })
    //一键派单-ztt20220826
    $('#toDespatchOrder_oneClickDelivery').click(function () {
        commonReturnPromise({
            url: '/lms/undispatch/dispatchPackage.html',
        }).then(res => {
            layui.admin.batchResultAlert("一键派单状态:",res,function(errIdsArr){
                // updateTableRow_toDespatchOrder([], errIdsArr)
                $('#toDespatchOrderSearch').click();
            });
        })
    });
    //库存占用规则-ztt20220826
    $('#toDespatchOrder_holdStockTask').click(function() {
        layer.confirm('根据库存占用规则对缺货、待派单订单进行库存占用', function (result) {
            if (result) {
                initAjax('/abnormalorder/holdstocktask.html', 'post', {}, function(returnData) {
                    layui.admin.batchResultAlert("订单重新走库存占用规则:",returnData.data,function(){
                        $('#toDespatchOrderSearch').click();
                    });
                }, 'application/x-www-form-urlencoded');
            }
        });
    });
    //转至待发货-ztt20230112
    $('#toDespatchOrder_towaitToShip').on('click', function () {
        let idsArr = getTableSelectIds();
        if (idsArr.length == 0) {
            return layer.msg('请先选择数据', { icon: 7 });
        }
        commCheckLogisticsCloseTime(idsArr,function(idList){
            let ids = idList.join(',');
            commonReturnPromise({
                url: '/lms/undispatch/toUnShipped.html',
                type: 'post',
                params: {ids},
            }).then(res=>{
                layui.admin.batchResultAlert("转至待发货:",res,function(errIdsArr){
                    deleteTableRow_toDespatchOrder(idsArr,errIdsArr)
                });
            })
        })
    });
    //转待核单-ztt20230112
    $('#toDespatchOrder_toCheckList').on('click', function () {
        let idsArr = getTableSelectIds();
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
    $('#toDespatchOrder_replenishCheck').click(function() {
        let ids = getTableSelectIds();
        if (!ids || ids.length < 1) {
            layer.msg('请选择订单',{icon:7});
            return;
        }
        initAjax('/abnormalorder/replenishcheck.html', 'post', { ids: ids.join(",") }, function(returnData) {
            layui.admin.batchResultAlert("补货检测:",returnData.data,function(errIdsArr){
                deleteTableRow_toDespatchOrder(ids,errIdsArr)
            });
        }, 'application/x-www-form-urlencoded');
    });
    // 转至仓库拦截
    $('#toDespatchOrder_toWarehouseIntercept').click(function() {
        let ids = getTableSelectIds();
        if (!ids || ids.length < 1) {
            layer.msg('请选择订单',{icon:7});
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
    $('#toDespatchOrder_wishRefund').on('click', function() {
        let data = toDespatchOrder_gridOptions.api.getSelectedRows();
        if (!data || data.length < 1) {
            layer.msg('请选择订单', { icon: 7 });
            return;
        }
        originOrderWishRefund(data,'batch',function(){
            $('#toDespatchOrderSearch').trigger('click')
        })
    })
    //ebay取消
    $('#toDespatchOrder_cancelOrderEbay').on('click', function() {
        let idsArr = getTableSelectIds();
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
                            deleteTableRow_toDespatchOrder(idsArr,errIdsArr)
                        });
                    }).catch(function(resErr) {
                        layer.msg(resErr.message || resErr, { icon: 2 });
                    });
                }
        });


    });
    //更新订单状态
    $('#toDespatchOrder_syncOrderStatus').on('click', function() {
        let idsArr = getTableSelectIds(),platOrderId = getTableSelectPlatOrderIds();
        let ids = idsArr.join()
        if (!idsArr || idsArr.length < 1) {
            layer.msg('请选择订单', { icon: 7 });
            return;
        }
        commonReturnPromise({
            url: '/lms/unauditorder/syncplatstatus.html',
            type: 'post',
            params: { ids }
        }).then(function(returnData) {
            layui.admin.batchResultAlert("更新订单状态完成:", returnData, function(errIdsArr) {
                updateTableRow_toDespatchOrder(idsArr,errIdsArr)
            });

            // let checkStatus = toDespatchOrder_gridOptions.api.getSelectedRows();
            // if (returnData.successNum <= 0) {
            //     return false;
            // }
            // // let temStrArr = []
            // // // 把修改成功的id存成数组，以便于后面匹配和取数据
            // // for(let key in returnData.logs){
            // //     temStrArr.push(key)
            // // }
            // // let newCheckStatus = deepCopy(checkStatus)
            // // // 匹配选中的数据
            // // checkStatus.forEach((v,index) => {
            // //     if(temStrArr.indexOf(v.id.toString()) > -1){ // 如果匹配到，就代表这一条数据修改成功，前端显示
            // //         newCheckStatus[index].platOrderStatus = returnData.logs[v.id]
            // //     }
            // // })
            // // console.log(newCheckStatus)
            // // toDespatchOrder_gridOptions.api.updateRowData({ update: newCheckStatus })
            // // 将返回结果成功的订单id替换成平台订单id
            // let platOrderIdSuccessObj = {}
            // for(let key in returnData.logs){
            //     platOrderIdSuccessObj[platOrderId[ids.indexOf(key*1)]] = returnData.logs[key]
            // }
            // let newImmutableStore = deepCopy(toDespatchOrder_immutableStore)
            // newImmutableStore.forEach(item =>{
            //     // 获取当前的平台订单号，拆分的订单，平台订单号是相同的
            //     // 匹配到返回成功的结果，赋值
            //     if(platOrderIdSuccessObj[item.platOrderId] != undefined&&platOrderIdSuccessObj[item.platOrderId] != ''){
            //         item.platOrderStatus = platOrderIdSuccessObj[item.platOrderId]
            //     }
            // })
            // toDespatchOrder_gridOptions.api.setRowData(newImmutableStore);
        }).catch(function(resErr) {
            layer.msg(resErr.message || resErr, { icon: 2 });
        });
    });
    //标记平台发货
    $('#toDespatchOrder_markDelivery').on('click', function() {
        let idsArr = getTableSelectIds();
        if (!idsArr || idsArr.length < 1) {
            layer.msg('请选择订单', { icon: 7 });
            return;
        }
        zttCommonProgressBar({ type: 10, ids: idsArr.join() }, function (progressData) {
            layui.admin.batchResultAlert("标记平台发货:",progressData,function(errIdsArr){
                updateTableRow_toDespatchOrder(idsArr,errIdsArr)
            });
        });
        // commonReturnPromise({
        //     url: '/lms/unauditorder/markplatshipping.html',
        //     type: 'post',
        //     params: {
        //         ids: idsArr.join()
        //     }
        // }).then(function(result) {
        //     layui.admin.batchResultAlert("标记平台发货完成:", result, function() {
        //     });
        // }).catch(function(resErr) {
        //     layer.msg(resErr.message || resErr, { icon: 2 });
        // });
    });

    //解密地址
    $('#toDespatchOrder_decryptAddress').on('click', function () {
        let ids = getTableSelectIds();
        if (ids.length > 0) {
            commonReturnPromise({
                type: 'post',
                url: '/lms/platorder/decrypt/list',
                contentType: 'application/json',
                params: JSON.stringify(ids)
            }).then(res => {
                layui.admin.batchResultAlert("解密地址:",res,function(errIdsArr){
                    updateTableRow_toDespatchOrder(ids,errIdsArr)
                });
            });
        } else {
            layer.msg('请选择订单',{icon:7});
        }
    });
    //修改发货声明
    $('#toDespatchOrder_deliverDeclare').on('click', function () {
        let ids = getTableSelectIds();
        if (ids.length > 0) {
            commonReturnPromise({
                url: '/lms/unauditorder/modifyShipping.html',
                params: {
                    ids: ids.join(',')
                }
            }).then(res => {
                layui.admin.batchResultAlert("修改发货声明:",res,function(){
                    $('#toDespatchOrderSearch').click();
                });
            });
        } else {
            layer.msg('请选择订单',{icon:7});
        }
    });
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
        let ids = getTableSelectIds();
        if (!ids || ids.length < 1) {
            layer.msg('请选择订单', { icon: 7 });
            return;
        }
        initAjax('/unauditorder/matchlogistype.html', 'post', { ids: ids.join(',') }, function (returnData) {
            layui.admin.batchResultAlert("匹配物流完成:", returnData.data, function (errIdsArr) {
                updateTableRow_toDespatchOrder(ids,errIdsArr)
                // // 匹配物流返回的成功格式同标记异常，都为订单:[
                // // let checkStatus = table.checkStatus('toDespatchOrder_table').data
                // let checkStatus = toDespatchOrder_gridOptions.api.getSelectedRows();
                // let checkedDataId = checkStatus.map(item => item.id) // 唯一值，用以和全部数据匹配
                //
                // if (returnData.data.successNum <= 0) {
                //     return
                // }
                // let temStrArr = []
                // returnData.data.successResults.forEach(v => {
                //     let temObj = {}
                //     temObj.logisTypeName = v.split('，')[1]
                //     temObj.logisTypeName = `[${temObj.logisTypeName}]`
                //     temObj.id = parseInt((getOrderId([v.split('，')[0]], '标记异常', returnData.data.successNum)).join())
                //     temStrArr.push(temObj)
                // });
                // (table.cache['toDespatchOrder_table']||[]).forEach((item, index) => {
                //     Array.isArray(temStrArr) && temStrArr.forEach(value => {
                //         if (checkedDataId.indexOf(item.id) > -1) {
                //             if (table.cache['toDespatchOrder_table'][index].id == value.id) {
                //                 table.cache['toDespatchOrder_table'][index].logisTypeName = value.logisTypeName
                //             }
                //         }
                //     })
                // })
                // let removeTable = Array.from($(`#toDespatchOrder_table`).next().find('tbody tr input:checked'));
                // Array.isArray(removeTable) && removeTable.forEach((v, index) => {
                //     let temObj = temStrArr.filter(value => value.id == ($(v).parents('tr').find('td[data-field="id"]').attr("data-content") * 1))[0] || {}
                //     $(v).parents('tr').find('#logisTypeName_toDespatchOrder').text(temObj.logisTypeName)
                //     $(v).parents('td').find('.layui-unselect.layui-form-checkbox.layui-form-checked').click()//恢复未选中的状态
                //     $(v).parents('tr').find("input:checked").prop('checked', false);
                // })
                // form.render()
                // // $('#toDespatchOrderSearch').click();
            });
        }, 'application/x-www-form-urlencoded')
    });
        //转待审核
    $('#toDespatchOrder_toAudit').click(function() {
        let ids = getTableSelectIds();
        if (!ids || ids.length < 1) {
            layer.msg('请选择订单', { icon: 7 });
            return;
        }
        commonOrderConfirmLayer(ids.length, function (index) {
            initAjax('/abnormalorder/toaudit.html', 'post', { ids: ids.join(",") }, function (returnData) {
                layer.close(index);
                layui.admin.batchResultAlert("订单转待审核:", returnData.data, function (errIdsArr) {
                    deleteTableRow_toDespatchOrder(ids,errIdsArr)
                    // getSuccessRemove(returnData.data, 'toDespatchOrder_table', '转待审核', 'markSymbol')
                    // $('#toDespatchOrderSearch').click();
                });
            }, 'application/x-www-form-urlencoded');
        });
    });

    //提交到万邑通海外仓出库单
    function toWinitOrder(ids, func) {
        initAjax('/unauditorder/towinit.html', 'post', { ids: ids }, function(returnData) {
            if (func) {
                func(returnData)
            }
        }, 'application/x-www-form-urlencoded')
    }
    //同步万邑通海外仓出库单单号
    function syncWinitTrackNo(ids, func) {
        initAjax('/unauditorder/syncwinittrackno.html', 'post', { ids: ids }, function(returnData) {
            if (func) {
                func(returnData)
            }
        }, 'application/x-www-form-urlencoded')
    }
    //同步万邑通预估派送费
    function syncWinitOutOrderCalcFee(ids, func) {
        initAjax('/unauditorder/syncwinitoutordercalcfee.html', 'post', { ids: ids }, function(returnData) {
            if (func) {
                func(returnData)
            }
        }, 'application/x-www-form-urlencoded')
    }
    //页面操作事件end
    function getTableSelectIds() {
        // var checkStatus = table.checkStatus('toDespatchOrder_table')
        // var data = checkStatus.data
        let data = toDespatchOrder_gridOptions.api.getSelectedRows();
        var ids = (data || []).map(function(item) {
            return item.id
        });
        return ids;
    }

    //页面操作事件end
    function getTableSelectPlatOrderIds() {
        // var checkStatus = table.checkStatus('toDespatchOrder_table')
        // var data = checkStatus.data
        let data = toDespatchOrder_gridOptions.api.getSelectedRows();
        var platOrderId = (data || []).map(function(item) {
            return item.platOrderId
        });
        return platOrderId;
    }


    // 页面数据请求----------------------------------------
    function isObjectValueEqual(a, b) {
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
    function appendTab(data) {
        var html = ""
        for (var i in data) {
            if (data[i].name === '1') {
                html += '<li class="layui-this" data-index="' + data[i].name + '">' + data[i].value + '(<span>0</span>)</li>'
            } else {
                html += '<li data-index="' + data[i].name + '">' + data[i].value + '(<span>0</span>)</li>'
            }
        }
        $('#toDespatchOrder_tab ul').append(html)
    }
     //订单标签填充下拉框
     function appendPlatSel(aDom, data) {
        aDom.empty();
        let option = '<option value="">请选择</option>',
         optionSel;
        data.forEach((v)=>{
           optionSel +=  `<option value="${v.code}">${v.name}</option>`
        })
        aDom.html(option + optionSel)
    }

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

    function Selected(aDom, value) {
        var options = aDom.find('option');
        options.each(function(index, item) {
            if (item.value == value) {
                $(item).attr('selected', true)
            }
        })
        form.render()
    }

    //得到成功的信息并删除
    function getSuccessRemove(res, domInput, status, countClass) {
        let resTem
        if (res.successNum <= 0) {
            return
        }
        if (status == '驳回订单' || status == '派至仓库' || status == '转待审核') {
            resTem = res.successResults.join().replace(/订单/g, '').split(',').map(v => parseInt(v))
        }else if (status == '标记异常') {
            resTem = res.successResults.join().replace(/订单:\[/g, '').replace(/\]标记异常成功/g, '').split(',').map(v => parseInt(v))
        }else if (status == '取消订单' || status == '转已发货') {
            resTem = res.successResults.join().replace(/订单\[/g, '').split(',').map(v => parseInt(v))
        }
        let removeTable = Array.from($(`#${domInput}`).next().find('tbody tr input:checked'));
        removeTable.forEach(v => {
            resTem.forEach(value => {
                if (value == $(v).parents('tr').find('.toDespatchOrder_Id').text()) {
                    $(v).parents('td').find('.layui-unselect.layui-form-checkbox.layui-form-checked').click()//恢复未选中的状态
                    $(v).parents('tr').remove()//删除此行
                }
            })
        })
        Array.isArray(layui.table.cache['toDespatchOrder_table']) && layui.table.cache['toDespatchOrder_table'].forEach((item, index) => {
            if (resTem.indexOf(item.id) > -1) {
                layui.table.cache['toDespatchOrder_table'][index] = []
            }
        })
        // deleteCheckedData(domInput, resTem,'td[data-field="id"]')  // 删除一行数据不刷新表格
        let count = $(`.${countClass}`).find('.layui-this span').text()
        // count = count.substring(1, count.length-1)
        $('.layui-laypage-count').text(`共 ${count - res.successNum} 条`)
        $(`.${countClass}`).find('.layui-this span').text(count - res.successNum)
    }

    //店铺选中
    function storeSelected(aDom, value) {
        var options = aDom.find('option');
        options.each(function(index, item) {
            var storeAcctId = item.value.split('_')[0]
            if (storeAcctId == value) {
                $(item).attr('selected', true)
            }
        })
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

function getIndex(id, arr, value) { //获取某个取值属性在对象数组中的下标
    for (var i = 0; i < arr.length; i++) {
        if (value == arr[i][id]) {
            return i;
        }
    }
    return -1;
}

function toDespatchBuyerTipsShow(dom){
    const contentshow = $(dom).attr('data-text');
    if(contentshow){
        layui.layer.tips(`<span style="color:#008B8B">${contentshow}</span>`, $(dom), {
            tips: [1, '#fff'],
            time: 0,
        });
    }
}

function toDespatchBuyerTipsShowTable(dom){
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
function toDespatchBuyerTipsHide(){
    layui.layer.closeAll("tips");
}
function toDespatchOrderProfitTipsShow(dom){
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
function toDespatchOrderProfitTipsHide(){
    layui.layer.closeAll("tips");
}