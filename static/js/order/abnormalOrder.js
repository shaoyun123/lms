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
    var abnormalOrder_company = null,
        abnormalOrder_allstore = null,
        // abnormalOrder_platOrderStatus = null,
        abnormalOrder_logisType = null,
        abnormalOrder_Site = null,
        abnormalOrder_formdata ={},
        abnormalOrder_pageEnum = null,
        abnormalOrder_Currency = null,
        abnormalOrder_companyType = "";
    laydate.render({
        elem: '#abnormalOrder_time',
        type: 'datetime',
        inputAuto: true,
        range: true,
        showShortcuts: true,
    });
    new dropButton('abnormalOrder_logis');
    new dropButton('abnormalOrder_orderHandle');

    formSelects.render('abnormalplatOrderStatusList',{ placeholder: '请先选择平台' });

    // 模板查询赋值
    commonSaveSearchTpl({
        id: "abnormalOrder_save",
        formId: "abnormalOrderForm",
        pageName: "auditDespathOrder_abnormalOrder",
        searchBtnId: "abnormalOrderSearch",
        cb: param => abnormalOrder_formVal(param),
    })
    
    function abnormalOrder_formVal(param) {
        let $formDom = $("#abnormalOrderForm")
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
                appendSelect($('#abnormalOrderForm').find(`select[_name=storeAcctIds]`), res, 'id', 'storeAcct')
                formSelects.render("abnormalOrderStoreAcctIds")
                formSelects.value("abnormalOrderStoreAcctIds", storeList)
                // 给表单赋值
                form.val("abnormalOrderForm", param)
                // 更多查询条件是否有值
                abnormalOrderHasValue('abnormalOrderForm', 'showMoreSearchCondition_abnormalOrder')
                // 多选的 name: xm-select
                let multiSelectObj = {
                    salePersonId: "abnormalOrder_salePersonsSelect",
                    prodLogisAttrs: "logisAttrs",
                    platOrderStatusList: "abnormalplatOrderStatusList",
                    shippingCountryCodes: "shippingCountrys",
                    platTags: "abnormalOrder_platTags",
                    orderLabels: "abnormalOrder_orderLabels",
                }
                Object.keys(multiSelectObj).forEach(item => {
                    if (param[item]) {
                        formSelects.value(multiSelectObj[item], param[item].split(","), true)
                    } else {
                        formSelects.render(multiSelectObj[item])
                    }
                })
                // 执行搜索
            $('#abnormalOrderSearch').click()
            })
        }, timeStamp)
    
    
        // 页签
        if (param.processStatus) {
            $("#abormalOrder_Tab")
            .find(".layui-tab-title li")
            .each(function () {
                let liIndex = $(this).data("index")
                if (liIndex == param.processStatus) {
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
    function deleteTableRow_abnormalOrder(ids,errIdsArr){
        zttCommonRemoveDataHandle({
            selectedIds: ids,
            gridOptions: abnormalOrder_gridOptions,
            tableData: abnormalOrder_immutableStore,
            errIds: errIdsArr
        }).then(newObj => {
            let {newData, successIds} = newObj;
            abnormalOrder_immutableStore = newData;
            let oldNum = $('#abormalOrder_Tab ul li.layui-this>span').text();
            let newNum = oldNum - successIds.length;
            $('#abormalOrder_Tab ul li.layui-this>span').text(newNum);
            $('#abnormalOrderPage .layui-laypage-count').text(`共 ${newNum} 条`);
        });
    }
    // 前端更新行，更新后不刷新表格
    function updateTableRow_abnormalOrder(ids,errIdsArr){
        zttCommonUpdataDataHandle({
            selectedIds: ids,
            errIds: errIdsArr
        }).then(newObj => {
            // 修改成功的数据
            let { successIds } = newObj;
            if(successIds.length != 0){
                // 选中的数据
                let checkStatus = abnormalOrder_gridOptions.api.getSelectedRows();
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
                    abnormalOrder_gridOptions.api.updateRowData({ update: newCheckStatus });
                })
            }
        });
    }
    // 前端更新行，更新后不刷新表格
    function updateSingleRow_abnormalOrder(id){
        // 选中的数据
        let data = abnormalOrder_gridOptions.api.getRowNode(id);
        commonReturnPromise({
            url: ctx + '/unauditorder/listorder.html',
            type: 'POST',
            params:{orderIds:id}
        }).then(function(result){
            data.setData(result[0]?result[0]:[]);
        })
    }
    //渲染平台标记
    abnormalOrder_renderPlatCodeMark();
    function abnormalOrder_renderPlatCodeMark () {
        commonReturnPromise({
            url: '/lms/unauditorder/listenum.html'
        }).then(res => {
            let { platTagList } = res;
            commonRenderSelect('abnormalOrder_platTags', platTagList).then(() => {
                formSelects.render('abnormalOrder_platTags');
            });
        });
    }

    var nowdate = new Date(new Date().toLocaleDateString()).getTime()
    var endDate = Format(nowdate + 24 * 60 * 60 * 1000 - 1, 'yyyy-MM-dd hh:mm:ss')
    var onemonth = Format(new Date(nowdate - 60 * 24 * 3600 * 1000), 'yyyy-MM-dd hh:mm:ss')
    $('#abnormalOrder_time').val(onemonth + ' - ' + endDate)

    // 展示和隐藏 更多查询条件
    $('#showMoreSearchCondition_abnormalOrder').click(function () {
        var self = this
        if ($(self).hasClass('showExternal')) {
            $(self).closest('.layui-form').find('.externalContainabnorlmalorder').hide()
            $('#hide_icon_abnormalOrder').show()
            $('#show_icon_abnormalOrder').hide()
            $(self).removeClass('showExternal')
            abnormalOrderHasValue('abnormalOrderForm', 'showMoreSearchCondition_abnormalOrder');
        } else {
            $(self).closest('.layui-form').find('.externalContainabnorlmalorder').show()
            $('#hide_icon_abnormalOrder').hide()
            $('#show_icon_abnormalOrder').show()
            $(self).addClass('showExternal')
        }
    });

    function abnormalOrderHasValue (formId, btnId) {
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

    form.on('submit(abnormalOrder_export)', function(data) {
        let ids = getTableSelectIds();
        if (!ids || ids.length < 1) {
            layer.msg('请选择订单',{icon:7});
            return;
        }
        // layer.confirm('导出选择的订单？', function (result) {
        //     if (result) {
                let param = {};
                param.orderIds = ids.join(",");
                submitForm(param, ctx + '/platorder/exportorder.html',"_blank");
                layer.closeAll();
        //     }
        // });
    });
    form.on('submit(abnormalOrderDetail_export)', function(data) {
        let ids = getTableSelectIds();
        if (!ids || ids.length < 1) {
            layer.msg('请选择订单',{icon:7});
            return;
        }
        // layer.confirm('导出选择的订单明细？', function (result) {
        //     if (result) {
                let param = {};
                param.orderIds = ids.join(",");
                submitForm(param, ctx + '/platorder/exportorderdetail.html',"_blank");
                layer.closeAll();
        //     }
        // });
    });
    //选项卡点击事件
    element.on('tab(abormalOrder_Tab)', function(data) {
        var processStatus = data.elem.context.dataset.index;
        $('#abnormalOrderForm input[name="processStatus"]').val(processStatus);
        $('#abnormalOrderSearch').click();
        //触发页面操作按钮变化 TODO

        $("#abnormalOrder_replenishCheck").hide();
        $('#abnormalOrder_markExceptionBtn').hide();
        $('#abnormalOrder_syncOrderStatus').hide();
        // $("#abnormalOrder_batchEditWareHouse").hide();
        $("#abnormalOrder_holdStockTask").hide();
        $("#abnormalOrder_toAudit").hide();
        $("#abnormalOrder_toCancel").hide();
        // $('#abnormalOrder_logis').addClass('disN');
        // $('#abnormalOrder_orderHandle').addClass('disN');
        if(processStatus == 501){
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
        }else if(processStatus == 503){
            //取消订单
            $('#abnormalOrder_syncOrderStatus').show();
            $('#abnormalOrder_markExceptionBtn').hide();//标记异常
            $("#abnormalOrder_toAudit").show();
            $('#abnormalOrder_logis').addClass('disN');
            $('#abnormalOrder_orderHandle').addClass('disN');
            $('#abnormalOrder_removelogisno_copy').show();
        }else if(processStatus == 500){
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
                updateTableRow_abnormalOrder(idsArr,errIdsArr)
            });
        }).catch(function(resErr) {
            layer.msg(resErr.message, { icon: 2 });
        });
    });


    // 表单提交
    form.on('submit(abnormalOrderSearch)', function(data) {
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
        if (data.field.agentCompany == 'agents' && data.field.logisticsCompanyId) {
            data.field.agentCompany = data.field.logisticsCompanyId
            delete data.field.logisticsCompanyId
        }else if(data.field.agentCompany == 'companys' && data.field.logisticsCompanyId){
            delete data.field.agentCompany
        }else {
            delete data.field.logisticsCompanyId
        }
        // 1. 选择了部门，没有选店铺
        //     1.1 部门下有店铺，传全部店铺
        //     1.2 部门下没有店铺，传0
        // 2. 选择了部门，选择了店铺，传选择的店铺
        if(data.field.orgs != ''&&data.field.storeAcctIds == ''){
            data.field.storeAcctIds = $('#abnormalOrder_store').attr('acct_ids') || 0;
        }
        abnormalOrderTableorder(data.field)
    });

    //监听平台下拉选择
    commonInitRenderRoleType('abnormalOrder');
    form.on('select(abnormalOrderplatCodes)', function (obj) {
        // commonOrderAddSalePerson('abnormalOrder', form, obj.value);
        commonOrderAddOrg('abnormalOrder', form, obj.value);
        getListplatorderstatus_abnormalorder(obj.value).then(function(data) {
            let arr = []
            data && data.forEach(item => arr.push({"platOrderStatus":item}))
            commonRenderSelect('abnormalplatOrderStatusList', arr, { name: 'platOrderStatus', code: 'platOrderStatus'}).then(function() {
                formSelects.render('abnormalplatOrderStatusList',{ placeholder: '请先选择平台' });
            });
        });
        // getStoreByPlatform(obj.value,function(returnData){
        //     appendSelect($('#abnormalOrderForm').find('select[_name="storeAcctIds"]'), returnData.data, 'id', 'storeAcct')
        // })
    })

    //监听公司下拉选择
    form.on('select(abnormalOrdercompanyType)', function(obj) {
        abnormalOrder_companyType = obj.value
        appendSelect($('#abnormalOrderForm').find('select[name="logisticsCompanyId"]'), abnormalOrder_company[abnormalOrder_companyType], 'name', 'value')
            form.render()
        })
        //监听物流公司下拉选择
    form.on('select(abnormalOrdercompany)', function(obj) {
        var agent = "",
            logisticsCompanyId = "";
            abnormalOrder_companyType === 'agents' ? agent = obj.value : logisticsCompanyId = obj.value
        getAllLogicsType(agent, logisticsCompanyId)
        form.render()
    })


    //监听工具栏操作
    table.on("tool(abnormalOrder_table)", function(obj) {
        var event = event ? event : window.event;
        event.stopPropagation();
        var data = obj.data
        if (obj.event === "") {
        }
    });

    getPageEnum();
    getAllCompanies();
    getStoreByPlatform('', function(returnData) {
        abnormalOrder_allstore = returnData.data
    });
    // getListplatorderstatus('', function(returnData) {
    //     let arr = []
    //     returnData.data && returnData.data.forEach(item => arr.push({"platOrderStatus":item}))
    //     abnormalOrder_platOrderStatus = arr
    // });
    getAllLogicsType('', '', function(returnData) {
        abnormalOrder_logisType = returnData.data
    });
    getAlldevEmployee();
    getAllpurchaseEmployee();
    getAllSite();
    getCurrencyEnums();



    // 页面数据请求----------------------------------------
    //  获取页面枚举数
    function getPageEnum() {
        initAjax('/unauditorder/listenum.html', 'post', {}, function(returnData) {
            abnormalOrder_pageEnum = returnData.data
            abnormalOrder_pageEnum.platCode = abnormalOrder_pageEnum.platCodes
            abnormalOrder_pageEnum.prodLogisAttrs = abnormalOrder_pageEnum.logisAttrs
            abnormalOrder_pageEnum.shippingCountryCodes = abnormalOrder_pageEnum.shippingCountrys
            abnormalOrder_pageEnum.warehouseId = abnormalOrder_pageEnum.prodWarehouses

            let temporayReturn = []
            returnData.data.orderLabels.forEach((v)=>{
                let temporayObj = {}
                temporayObj.name = v.code
                temporayObj.value = v.name
                temporayReturn.push(temporayObj)
            })
            returnData.data.orderLabels = temporayReturn
            abnormalOrder_pageEnum.orderLabels = temporayReturn
            abnormalOrder_pageEnum.abnormalOrder_orderLabels = abnormalOrder_pageEnum.orderLabels
            for (var i in returnData.data) {
                if(i == 'markShippingStatus'){
                  returnData.data[i][0]['code'] = returnData.data[i][0]['name']
                }
                appendSelect($('#abnormalOrderForm').find('select[name="'+i+'"]'), returnData.data[i], 'name', 'value')
                appendSelect($('#abnormalOrderForm').find('select[_name="'+i+'"]'), returnData.data[i], 'name', 'value')
                if (i === 'abnormalOrderStatus') {
                    appendTab(returnData.data[i])
                }
            }
            form.render()
            formSelects.render('orderLabels')
            formSelects.render('logisAttrs')
            formSelects.render('shippingCountrys')
            formSelects.render('storeAcct')
        })
    }
    //获取所有物流公司以及货代公司
    function getAllCompanies() {
        initAjax('/unauditorder/listcompanyandagent.html', 'post', {}, function(returnData) {
            abnormalOrder_company = returnData.data
            appendSelect($('#abnormalOrderForm').find('select[name="logisticsCompanyId"]'), returnData.data.companys, 'id', 'cnName')
            form.render()
        })
    }

    //获取所有物流方式
    function getAllLogicsType(agent, logisticsCompanyId, func) {
        initAjax('/unauditorder/listlogistype.html', 'get', { agent, logisticsCompanyId,specialType: "直发物流" }, function(returnData) {
            if (func) {
                func(returnData)
            }
            appendSelect($('#abnormalOrderForm').find('select[name="logisTypeIds"]'), returnData.data, 'id', 'name')
            form.render()
        })
    }

    //根据平台code获取店铺列表
    function getStoreByPlatform(platcode, func) {
        initAjax('/sys/orderliststorebyplatcode.html', 'get', { platCode: platcode }, function(returnData) {
            if (func) {
                func(returnData)
            }
            formSelects.render('abnormalOrderStoreAcctIds', {
                placeholder: '请先选择平台'
            })
        }, 'application/x-www-form-urlencoded')
    }

    // 获取平台订单状态
    function getListplatorderstatus_abnormalorder(platcode) {
        // initAjax(`/undispatch/listplatorderstatus.html?platCode=${platcode}`, 'get', {}, function(returnData) {
        //     if (func) {
        //         func(returnData)
        //     }
        //     formSelects.render('abnormalplatOrderStatusList',{ placeholder: '请先选择平台' })
        // }, 'application/x-www-form-urlencoded')
        return commonReturnPromise({
            type: 'get',
            url: `/lms/undispatch/listplatorderstatus.html?platCode=${platcode}`
        });
    }

    //获取所有开发专员
    function getAlldevEmployee() {
        initAjax('/sys/prodOwnerList.html', 'post', {}, function(returnData) {
            appendSelect($('#abnormalOrderForm').find('select[name="preprodDevId"]'), returnData.data, 'id', 'loginName')
            form.render()
        })
    }

    //获站点接口
    function getAllSite(platCode, func) {
        initAjax('/enum/getSiteEnum.html?platCode=' + platCode, 'post', {}, function(returnData) {
            abnormalOrder_Site = returnData.data
            if (func) {
                func(returnData)
            }
        }, 'application/x-www-form-urlencoded')
    }

    //获取所有采购专员
    function getAllpurchaseEmployee() {
        initAjax('/sys/buyerList.html', 'post', {}, function(returnData) {
            appendSelect($('#abnormalOrderForm').find('select[name="purchasingAgentId"]'), returnData.data, 'id', 'loginName')
            form.render()
        })
    }

    // 获取所有页签数量
    function getAllTabNum(data){
        initAjax('/abnormalorder/statuscount.html', 'post', data, function(returnData) {
           for(var i in returnData.data){
                $('#LAY-abnormalOrder #abormalOrder_Tab').find('li[data-index="'+i+'"]').find('span').text(returnData.data[i])
            }
        }, 'application/x-www-form-urlencoded')
    }

        //获取币种枚举
        function getCurrencyEnums() {
            initAjax('/sysdict/getCurrencyEnums.html', 'post', {}, function(returnData) {
                abnormalOrder_Currency = returnData.data
            })
        }


    $("button[name=orderConfig]").click(function(){
        let orderColumnState = abnormalOrder_gridOptions.columnApi.getColumnState()
        window.localStorage.setItem("orderColumnState",JSON.stringify(orderColumnState))
        layer.msg("保存设置成功")
    })

    // //渲染表格数据
    // function abnormalOrderTableorder(data) {
    //     table.render({
    //         elem: '#abnormalOrder_table',
    //         method: 'POST',
    //         url: ctx + '/abnormalorder/list.html',
    //         where: data,
    //         cols: [
    //             [
    //                 { checkbox: true, width: 30 },
    //                 { title: "订单号", field: "id", templet: "#abnormalorder_id_tpl" },
    //                 { title: "订单金额", field: "platOrderAmt", templet: "#abnormalorder_platOrderAmt_tpl" },
    //                 { title: "商品", field: "prodQuantity", templet: "#abnormalorder_prodQuantity_tpl" },
    //                 { title: "收件人", field: "shippingUsername", templet: "#abnormalorder_shippingUsername_tpl" },
    //                 { title: "物流", field: "logisTypeName", templet: '#abnormalorder_logisTypeName_tpl' },
    //                 { title: "时间", field: "time", templet: "#abnormalOrder_time_tpl" },
    //                 { title: "状态", field: "platOrderStatus", templet: "#abnormalorder_platOrderStatus_tpl" },
    //                 { title: '操作', toolbar: "#abnormalorder_option_tpl",width:80}
    //             ]
    //         ],
    //         page: false,
    //         limit:500,
    //         id: 'abnormalOrder_table',
    //         done: function(res) {
    //             abnormalOrderPage(data,res.count)
    //             var tab = $('#LAY-abnormalOrder #abormalOrder_Tab').find('.layui-this')
    //             if(!isObjectValueEqual(data,abnormalOrder_formdata)){
    //                 getAllTabNum(data)
    //                 abnormalOrder_formdata = data
    //             }
    //             if (tab.length > 0) {
    //                 tab.find('span').text(res.count)
    //             } else {
    //                 $('#LAY-abnormalOrder #abormalOrder_Tab').find('li[data-index="' + data.processStatus + '"]').addClass('layui-this').find('span').text(res.count)
    //             }
    //             if (data.processStatus == 502) {
    //                 $('.abnormalOrder_split').removeClass('disN');
    //             } else {
    //                 $('.abnormalOrder_split').addClass('disN');
    //             }
    //             abnormalOrderTableWatchbar()
    //             abnormalOrder_watchTableTr()
    //         }
    //     })
    // }
    //渲染表格数据
    function abnormalOrderTableorder(data) {
        // table.render({
        //     elem: '#abnormalOrder_table',
        //     method: 'POST',
        //     url: ctx + '/abnormalorder/list.html',
        //     where: data,
        //     cols: [
        //         [
        //             { checkbox: true, width: 30 },
        //             { title: "订单号", field: "id", templet: "#abnormalorder_id_tpl" },
        //             { title: "订单金额", field: "platOrderAmt", templet: "#abnormalorder_platOrderAmt_tpl" },
        //             { title: "商品", field: "prodQuantity", templet: "#abnormalorder_prodQuantity_tpl" },
        //             { title: "收件人", field: "shippingUsername", templet: "#abnormalorder_shippingUsername_tpl" },
        //             { title: "物流", field: "logisTypeName", templet: '#abnormalorder_logisTypeName_tpl' },
        //             { title: "时间", field: "time", templet: "#abnormalOrder_time_tpl" },
        //             { title: "状态", field: "platOrderStatus", templet: "#abnormalorder_platOrderStatus_tpl" },
        //             { title: '操作', toolbar: "#abnormalorder_option_tpl",width:80}
        //         ]
        //     ],
        //     page: false,
        //     limit:500,
        //     id: 'abnormalOrder_table',
        //     done: function(res) {
        //         abnormalOrderPage(data,res.count)
        //         var tab = $('#LAY-abnormalOrder #abormalOrder_Tab').find('.layui-this')
        //         if(!isObjectValueEqual(data,abnormalOrder_formdata)){
        //             getAllTabNum(data)
        //             abnormalOrder_formdata = data
        //         }
        //         if (tab.length > 0) {
        //             tab.find('span').text(res.count)
        //         } else {
        //             $('#LAY-abnormalOrder #abormalOrder_Tab').find('li[data-index="' + data.processStatus + '"]').addClass('layui-this').find('span').text(res.count)
        //         }
        //         if (data.processStatus == 502) {
        //             $('.abnormalOrder_split').removeClass('disN');
        //         } else {
        //             $('.abnormalOrder_split').addClass('disN');
        //         }
        //         abnormalOrderTableWatchbar()
        //         abnormalOrder_watchTableTr()
        //     }
        // })
        commonReturnPromiseRes({
            url: ctx + '/abnormalorder/list.html',
            type: 'POST',
            params:data
        }).then(function(result){
            abnormalOrderPage(data,result.count)
            abnormalOrder_immutableStore = result.data
            abnormalOrder_gridOptions.api.setRowData(abnormalOrder_immutableStore)
            // 渲染tab中的count数，复制原来的--start
            var tab = $('#abormalOrder_Tab').find('.layui-this')
            if(!isObjectValueEqual(data,abnormalOrder_formdata)){
                getAllTabNum(data)
                abnormalOrder_formdata = data
            }
            if (tab.length > 0) {
                tab.find('span').text(result.count)
            } else {
                $('#abormalOrder_Tab').find('li[data-index="' + data.processStatus + '"]').addClass('layui-this').find('span').text(result.count)
            }
            var tbody = $('#abnormalOrder_table').next('.layui-table-view').find('.layui-table-body').find('tr[data-index=0]')
            // 复制原来的--end
            setTimeout(() => {
                if (data.processStatus == 502) {
                    $('.abnormalOrder__splitBtn').removeClass('disN');
                } else {
                    console.log(data.processStatus, '非缺货');
                    $('.abnormalOrder__splitBtn').addClass('disN');
                }
            }, 0);
        }).catch(function(err){
            layer.msg(err, {icon:2});
        })
    }

    let abnormalOrder_immutableStore = [];
    const abnormalOrder_gridOptions = {
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
                    // 重寄订单
                    let orderLabel = d.operOrderType == 3 ? '<span style="color:red">重寄</span>':''
                    // operOrderType 拆单合单：订单操作类型：0原始订单，1拆除订单，2合并订单
                    const operOrderTypeTag = d.operOrderType ==1 ? '<span class="hp-badge layui-bg-orange" title="拆出订单">拆</span>' : d.operOrderType ==2 ? '<span class="hp-badge layui-bg-orange" title="合并订单">合</span>' : d.operOrderType ==0 && d.operOriginId!="0" ? '<span class="hp-badge layui-bg-orange" title="拆单订单">拆</span>' : ''
                    return `<div class="alignLeft">
                        <span class="pora copySpan">
                            <a>${d.id || ""}</a>
                            <button class="layui-btn layui-btn-primary layui-btn-xs copyTxt" name="copy" onclick="layui.admin.copyTxt(this)">复制</button>
                        </span>
                        ${orderLabel}
                        ${tagsDom}
                        ${operOrderTypeTag}
                        <p id="toAudit_table_storeAcct">${d.storeAcct || ""}[${d.shopId || ""}]</p>
                        <p>[${d.salesPersons || ""}][${d.sellLeaderName || ""}]</p>
                        <span class="pora copySpan">
                            <a id="toAudit_table_platOrderId">${d.platOrderId}</a>
                            <button class="layui-btn layui-btn-primary layui-btn-xs copyTxt" name="copy" onclick="layui.admin.copyTxt(this)">复制</button>
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
                    let fee = [d.platFee || 0, d.otherFee || 0].filter(i => i !=0);
                    if(d.logisApplyStatus==4&&d.logisApplyFailMsg && d.processStatus != 503){
                        str += `<div class="waitOrderErrorTips dis_flex"><div class="waitOrderErrorTipsword">${d.logisApplyFailMsg||''}</div><div class="waitOrderErrorTipsClose">x</div></div>`
                    }
                    let amtDom = d.platShippingAmt ? `<span>(${d.platShippingAmt})</span>` : "";
                    str +=
                        `<div class="alignLeft">
                        <div><span class='gray'>${d.currency || ""}</span><span id="toAudit_table_platOrderAmt">${d.platOrderAmt || ""}</span>${amtDom}</div>
                        <div><span class="gray">平台费</span>${fee.join(' + ')}</div>
                        <div><span class="gray">商品成本(￥)</span>${d.prodCost} / ${d.costPrice}</div>
                        <div><span class="gray">物流成本(￥)</span>${d.shippingCost!==undefined ? d.shippingCost : "" }<button class="layui-btn layui-btn-xs" name="logisCost" style="cursor:pointer;">详</button></div>
                        <div><span class="gray">利润(￥)</span>${d.profit || '0.00'} <span class="gray">${(100 * d.profit / d.platOrderAmt / d.exchangeRate).toFixed(2)}%</span></div>
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
                    const noteTipsHtml = `<span class="" data-text="${buyerNote}" onmouseenter="abnormalOrderTipsShow(this)" onmouseleave="abnormalOrderTipsHide(this)">${partBuyerNote}......</span>`
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
                    return `<div class="alignLeft">
                        <div><span class="gray">买家：</span><span id="toAudit_table_buyerRequireShippingType">${d.buyerRequireShippingType||""}</span></div>
                        <div><span class="gray">发货：</span><span id="logisTypeName_toAuditOrder">${d.logisTypeName||""}</span></div>
                        <div>
                            <span class="gray">跟踪号：</span>
                            <span class="pora copySpan">
                                <a>${d.logisTrackingNo||""}</a>
                                <button class="layui-btn layui-btn-primary layui-btn-xs copyTxt" name="copy" onclick="layui.admin.copyTxt(this)">复制</button>
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
                        <div><span class="gray">仓库：</span>${d.warehouseName||""}</div>
                        <div><span class="gray">批次：</span>${d.orderLabel||""}</div>
                        <div><span class="gray">备注：</span>${recentNoteContent}${noteContent ? noteTipsHtml : ''}</div>
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
                    let splitDom = $('#abnormalOrder_splitPermTagTable').html();
                    return `
				<button type="button" name="remark" class="layui-btn layui-btn-xs">备注</button>
                ${splitDom}
                <!--<button name="edit" class="layui-btn layui-btn-xs disN">修改订单</button>-->`
                }
            }
        ],
        rowData:abnormalOrder_immutableStore,
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
            abnormalOrder_gridOptions.columnApi.applyColumnState({ state: JSON.parse(window.localStorage.getItem("orderColumnState")) });
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

    var gridDiv = document.querySelector('#abnormalOrder_table');
    agGrid.LicenseManager.setLicenseKey(
        "IRDEVELOPERS_COM_NDEwMjM0NTgwMDAwMA==f08aae16269f416fe8d65bbf9396be5f");
    new agGrid.Grid(gridDiv, abnormalOrder_gridOptions);

    //ztt-20220909新增-触发ag-grid表格事件
    function handleTableOptions(event){
        let optionEvent = event.event.target.name,
            data = event.data;// 获取选中行数据
        if (optionEvent == 'remark') {
            commonDirectMailRemark(data);
        } else if(optionEvent == 'split'){
            abnormalOrderSplitOrderHandle(data);
        }else if(optionEvent == 'copy'){
        }else if(optionEvent === 'logisCost'){
          //物流成本
          commonLogisCostLayerHandle(data.id);
        }else if(event.event.timeStamp - timeStamp < 300) {
            commonOrderDetailFn(data, abnormalOrder_gridOptions);
        }
    }

    // function abnormalOrderTableWatchbar(){
    //     table.on('tool(abnormalOrder_table)', function(obj){
    //         if(obj.event =='edit'){
    //             // abnormalOrderNewandEdit(obj.data)
    //             commonOrderDetailFn(obj.data);
    //         }else if(obj.event == 'remark'){
    //             commonDirectMailRemark(obj.data);
    //         } else if (obj.event == 'split') {
    //             abnormalOrderSplitOrderHandle(obj.data);
    //         }
    //     });
    // }
    //
    // //监听表格tr的点击[查看详情]
    // function abnormalOrder_watchTableTr() {
    //     $('#abnormalOrderCard .layui-table-main').on('click', 'td[data-field=platOrderStatus]', function (event) {
    //         var $targetBtn = $(this).parents('tr').find('span[lay-event=edit]');
    //         $targetBtn.trigger('click');
    //         event.stopPropagation();
    //         event.preventDefault();
    //     });
    // }

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
                laytpl(getTpl).render(data, function(html) {
                    view.innerHTML = html;
                    imageLazyload();
                });
            },
            yes: function (index, layero) {
                var dataArr = [];
                var trs = layero.find('tbody>tr');
                for (var i = 0; i < trs.length; i++){
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
                    // $('#abnormalOrderSearch').trigger('click');
                }).catch(err => {
                    layer.msg(err, { icon: 2 });
                });
            }
        })
    }

    // 渲染页面分页
        function abnormalOrderPage(data,count){
            laypage.render({
                elem: 'abnormalOrderPage',
                curr: data.page,
                limit: data.limit,
                limits:[5000, 10000, 20000],
                layout: ['prev', 'page', 'next', 'count','limit'],
                count: count,
                jump: function(obj, first) {
                    $('#abnormalOrderForm input[name="limit"]').val(obj.limit);//保障下次的分页请求中带有的值正确
                    $('#abnormalOrderForm input[name="page"]').val(obj.curr);//保障下次的分页请求中带有的值正确
                    //首次不执行
                    if (!first) {
                        data.page = obj.curr;
                        data.limit = obj.limit;
                        $('#abnormalOrderSearch').click()
                    }

                }
            });
        }

            //修改订单
            function abnormalOrderNewandEdit(data) {
                edit_order_tableIns = null;
                var concatData = []
                layer.open({
                    type: 1,
                    title: '查看详情',
                    btn: ['保存', '取消'],
                    area: ['90%', '80%'],
                    maxmin: true,
                    content: $('#pop_abnormalOrder_newandeditorder').html(),
                    success: function(layero, index) {
                        var id = data?data.id:""
                        var isSavable = $(layero).find('#order_savebtn')
                        if(isSavable.length&&isSavable.length>0){
                            $(layero).find('.layui-layer-btn0').removeClass('hide')
                        }else{
                            $(layero).find('.layui-layer-btn0').addClass('hide')
                        }
                        $(layero).find('.layui-tab').find('ul').find('li').each(function(index,item){
                            $(item).data('orderId',id)
                        })
                        laydate.render({
                            elem: '#edit_time',
                            type: 'datetime'
                        });
                        appendSelect($('#abnormalOrder_editForm').find('select[name="storeAcctId"]'), abnormalOrder_allstore, 'id', 'storeAcct', 'platCode')
                        // appendSelect($('#abnormalOrder_editForm').find('select[name="platOrderStatusList"]'), abnormalOrder_platOrderStatus, 'platOrderStatus', 'platOrderStatus')
                        appendSelect($('#abnormalOrder_editForm').find('select[name="warehouseId"]'), abnormalOrder_pageEnum.prodWarehouses, 'name', 'value')
                        appendSelect($('#abnormalOrder_editForm').find('select[name="logisTypeId"]'), abnormalOrder_logisType, 'id', 'name')
                        appendSelect($('#abnormalOrder_editForm').find('select[name="siteId"]'), abnormalOrder_Site, 'code', 'name')
                        appendSelect($('#abnormalOrder_editForm').find('select[name="currency"]'), abnormalOrder_Currency, 'code', 'name')
                        if (data) {
                            data.orderTimeCn = Format(data.orderTimeCn,'yyyy-MM-dd hh:mm:ss')
                            form.val("abnormalOrder_editForm", data);
                            if(data.storeAcctId){
                                storeSelected($('#abnormalOrder_editForm select[name="storeAcctId"]'),data.storeAcctId.toString())
                            }
                            getAllSite(data.platCode,function(returnData){
                                appendSelect($('#abnormalOrder_editForm').find('select[name="siteId"]'), returnData.data, 'code', 'name')
                                Selected($('#abnormalOrder_editForm select[name="siteId"]'),data.siteId)
                                form.render()
                            })
                            concatData = data.orderDetails
                            edit_order_tableIns = abnormalOrderProdTableRender(concatData)
                        }
                        form.render()
                    },
                    yes: function(index, layero) {
                    },
                })
            }

        //渲染商品信息表格
        function abnormalOrderProdTableRender(data) {
            tableIns = table.render({
                elem: '#abnormalOrder_product_table',
                id: 'abnormalOrder_product_table',
                data: data || [],
                cols: [
                    [
                        { title: "图片", field: "imageUrl", templet: "#abnormalOrder_detail_img_tpl" },
                        { title: "Listing_ID", field: "itemId" },
                        { title: "店铺SKU", field: "storeSSku" },
                        { title: "商品SKU", field: "prodSSku"}, //
                        { title: "库位", field: "stockLocation" },
                        { title: "商品名称", field: "prodTitle" },
                        { title: "入库要求", field: "packDesc" },
                        { title: '款式', field: "style" },
                        { title: '可用库存', field: "availableStock" },
                        { title: '商品成本（￥）', field: "prodUnitCost"},
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
                done: function(res) {
                    imageLazyload();
                }
            })
            return tableIns
        }

    //页面按钮操作start
    //补货检测
    $('#abnormalOrder_replenishCheck').click(function() {
        let ids = getTableSelectIds();
        if (!ids || ids.length < 1) {
            layer.msg('请选择订单',{icon:7});
            return;
        }
        initAjax('/abnormalorder/replenishcheck.html', 'post', { ids: ids.join(",") }, function(returnData) {
            layui.admin.batchResultAlert("补货检测:",returnData.data,function(errIdsArr){
                deleteTableRow_abnormalOrder(ids,errIdsArr)
            });
        }, 'application/x-www-form-urlencoded');
    });

    //批量修改仓库和物流
    $('#LAY-abnormalOrder #abnormalOrder_batchEditWareHouse').click(function () {
        let ids = getTableSelectIds();
        if (!ids || ids.length < 1) {
            layer.msg('请选择订单', { icon: 7 });
            return;
        }
        console.log(ids);
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
                        updateTableRow_abnormalOrder(ids,errIdsArr)
                    });
                })
            }
        });
    });
    //库存占用规则
    $('#abnormalOrder_holdStockTask').click(function() {
        layer.confirm('根据库存占用规则对缺货、待派单订单进行库存占用', function (result) {
            if (result) {
                initAjax('/abnormalorder/holdstocktask.html', 'post', {}, function(returnData) {
                    layui.admin.batchResultAlert("订单重新走库存占用规则:",returnData.data,function(){
                        $('#abnormalOrderSearch').click();
                    });
                }, 'application/x-www-form-urlencoded');
            }
        });
    });
    //转待审核
    $('#abnormalOrder_toAudit').click(function() {
        let ids = getTableSelectIds();
        if (!ids || ids.length < 1) {
            layer.msg('请选择订单',{icon:7});
            return;
        }
        commonOrderConfirmLayer(ids.length, function (index) {
            initAjax('/abnormalorder/toaudit.html', 'post', { ids: ids.join(",") }, function (returnData) {
                layer.close(index);
                layui.admin.batchResultAlert("订单转待审核:",returnData.data,function(errIdsArr){
                    deleteTableRow_abnormalOrder(ids,errIdsArr)
                });
            }, 'application/x-www-form-urlencoded');
        });
    });
        /**
     * 标记异常
     * @param {订单号} ids
     */
    $('#abnormalOrder_markExceptionBtn').on('click', function () {
        let ids = getTableSelectIds();
        if (!ids || ids.length < 1) {
            layer.msg('请选择订单',{icon:7});
            return;
        }
        initAjax('/unauditorder/markabnormal.html', 'post', { ids: ids.join(',') }, function (returnData) {
            layui.admin.batchResultAlert("订单标记异常:", returnData.data, function (errIdsArr) {
                deleteTableRow_abnormalOrder(ids,errIdsArr)
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
    $('#abnormalOrder_toCancel').click(function() {
        let ids = getTableSelectIds();
        if (!ids || ids.length < 1) {
            layer.msg('请选择订单',{icon:7});
            return;
        }
        commonOrderConfirmLayer(ids.length, function (index) {
            initAjax('/abnormalorder/tocancel.html', 'post', { ids: ids.join(",") }, function (returnData) {
                layer.close(index);
                layui.admin.batchResultAlert("转取消订单:", returnData.data, function (errIdsArr) {
                    deleteTableRow_abnormalOrder(ids,errIdsArr)
                });
            }, 'application/x-www-form-urlencoded');
        });
    });
    //指定仓库类型
    $('#abnormalOrder_appointWarehouseType').click(function() {
        let ids = getTableSelectIds();
        if (!ids || ids.length < 1) {
            layer.msg('请选择订单',{icon:7});
            return;
        }
        layer.open({
            type: 1,
            title: '重新指定仓库类型',
            btn: ['确认','取消'],
            content: "loading",
            success: function(layero, index) {
                $(layero).find('.layui-layer-content').html($("#abnormalOrder_appointWarehouseTypeTpl").html());
                layui.form.render("radio");
            },
            yes: function(index, layero) {
                let warehouseType = $("#abnormalOrder_appointWarehouseTypeForm input[name=warehouseType]:checked").val();
                initAjax('/unauditorder/appointwarehousetype.html', 'post', { ids:ids.join(","),warehouseType:warehouseType }, function(returnData) {
                    layui.admin.batchResultAlert("重新指定仓库类型:",returnData.data,function(errIdsArr){
                        updateTableRow_abnormalOrder(ids,errIdsArr)
                    });
                    layer.close(index);
                }, 'application/x-www-form-urlencoded')
            }
        })
    });
    //匹配物流方式-ztt20220831
    $('#abnormalOrder_matchLogis').click(function () {
        let ids = getTableSelectIds();
        if (!ids || ids.length < 1) {
            layer.msg('请选择订单', { icon: 7 });
            return;
        }
        initAjax('/unauditorder/matchlogistype.html', 'post', { ids: ids.join(',') }, function (returnData) {
            layui.admin.batchResultAlert("匹配物流完成:", returnData.data, function (errIdsArr) {
                updateTableRow_abnormalOrder(ids,errIdsArr)
            });
            // let checkStatus = abnormalOrder_gridOptions.api.getSelectedRows();
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
            // abnormalOrder_gridOptions.api.updateRowData({ update: newCheckStatus })
        }, 'application/x-www-form-urlencoded');
    });
    //手动指定物流-ztt20220901
    $('#abnormalOrder_updatelogistype').click(function() {
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
                $(layero).find('.layui-layer-content').html($("#abnormalOrder_updateLogisTypeTpl").html());
                //初始化物流公司
                appendSelect($('#abnormalOrder_updateLogisTypeForm').find('select[name="logisCompany"]'), abnormalOrder_company['companys'], 'id', 'cnName')
                    //初始化物流方式
                initAjax('/unauditorder/listlogistype.html', 'get', {specialType: "直发物流"}, function(returnData) {
                        appendSelect($('#abnormalOrder_updateLogisTypeForm').find('select[name="logisType"]'), returnData.data, 'id', 'name')
                        form.render()
                    })
                    //物流公司改变触发
                form.on('select(abnormalOrder_logisCompany)', function(obj) {
                    var agent = "",
                        logisticsCompanyId = obj.value;
                    initAjax('/unauditorder/listlogistype.html', 'get', { agent, logisticsCompanyId,specialType: "直发物流" }, function(returnData) {
                        appendSelect($('#abnormalOrder_updateLogisTypeForm').find('select[name="logisType"]'), returnData.data, 'id', 'name')
                        form.render()
                    })
                })
                layui.form.render();
            },
            yes: function(index, layero) {
                var logisTypeId = $("#abnormalOrder_updateLogisTypeForm select[name=logisType]").val();
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
                        updateTableRow_abnormalOrder(ids,errIdsArr)
                        layer.close(index);
                    });
                    // layer.close(index);
                    // let checkStatus = abnormalOrder_gridOptions.api.getSelectedRows();
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
                    // abnormalOrder_gridOptions.api.updateRowData({ update: newCheckStatus })
                }, 'application/x-www-form-urlencoded')
            }
        })
    });
    //申请跟踪号-ztt20220901
    $('#abnormalOrder_applylogisno').click(function() {
        var ids = getTableSelectIds();
        if (ids.length <= 0) {
            layer.msg('请选择订单', { icon: 7 });
            return
        }
        zttCommonProgressBar({ type: 9, ids: ids.join(',') }, function (progressData) {
            layui.admin.batchResultAlert("申请跟踪号:", progressData, function (errIdsArr) {
                deleteTableRow_abnormalOrder(ids,errIdsArr)
            });
        });
        // initAjax('/unauditorder/applylogistrackingno.html', 'post', { ids: ids.join(',') }, function(returnData) {
        //     layui.admin.batchResultAlert("申请跟踪号:", returnData.data, function () {
        //         $('#abnormalOrderSearch').click();
        //     });
        // }, 'application/x-www-form-urlencoded');
    });
    //清空跟踪号-ztt20220901
    $('#abnormalOrder_removelogisno').click(function() {
        var ids = getTableSelectIds();
        if (ids.length <= 0) {
            layer.msg('请选择订单', { icon: 7 });
            return
        }
        commonOrderConfirmLayer(ids.length, function (index) {
            initAjax('/unauditorder/removelogistrackingno.html', 'post', { ids: ids.join(',') }, function() {
                layer.close(index);
                deleteTableRow_abnormalOrder(ids,[])
            }, 'application/x-www-form-urlencoded');
        });
    });
    //取消wishpost跟踪号-ztt20220901
    $('#abnormalOrder_cancelwishpost').click(function() {
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
                        deleteTableRow_abnormalOrder(ids,errIdsArr)
                    });
                }, 'application/x-www-form-urlencoded');
            }
        });
    });
    //取消橙联跟踪号-ztt20220901
    $('#abnormalOrder_cancelEdisebay').click(function() {
        var ids = getTableSelectIds();
        if (ids.length <= 0) {
            layer.msg('请选择订单', { icon: 7 });
            return
        }
        commonOrderConfirmLayer(ids.length, function (index) {
            layer.close(index);
            initAjax('/platorder/cancelEdisebay.html', 'post', { ids: ids.join(',') }, function(returnData) {
                layui.admin.batchResultAlert("取消Edisebay订单:", returnData.data, function (errIdsArr) {
                    deleteTableRow_abnormalOrder(ids,errIdsArr)
                });
            }, 'application/x-www-form-urlencoded');
        });

    });
    //页面按钮操作end

    function getTableSelectIds(){
        // var checkStatus = table.checkStatus('abnormalOrder_table')
        // var data = checkStatus.data
        let data = abnormalOrder_gridOptions.api.getSelectedRows();
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
    function appendTab(data) {
        var html = ""
        for (var i in data) {
            if (data[i].name === '1') {
                html += '<li class="layui-this" data-index="' + data[i].name + '">' + data[i].value + '(<span>0</span>)</li>'
            } else {
                html += '<li data-index="' + data[i].name + '">' + data[i].value + '(<span>0</span>)</li>'
            }
        }
        $('#abormalOrder_Tab ul').append(html)
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

function abnormalOrderTipsShow(dom){
  const contentshow = $(dom).attr('data-text');
  if(contentshow){
      layui.layer.tips(`<span style="color:#008B8B">${contentshow}</span>`, $(dom), {
          tips: [1, '#fff'],
          time: 0,
      });
  }
}

function abnormalOrderTipsShowTable(dom){
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
function abnormalOrderTipsHide(){
  layui.layer.closeAll("tips");
}