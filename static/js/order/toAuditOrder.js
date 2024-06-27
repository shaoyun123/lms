
layui.use(['form', 'table', 'layer', 'element', 'laypage', 'laydate', 'formSelects','upload', 'admin'], function() {
    var form = layui.form,
        table = layui.table,
        element = layui.element,
        laydate = layui.laydate,
        formSelects = layui.formSelects,
        upload = layui.upload,
        admin = layui.admin
    laypage = layui.laypage;
    layer = layui.layer;
    detailpopflag = false;
    form.render('select');
    var toAuditOrder_pageEnum = null,
        toAuditOrder_company = null,
        toAuditOrder_allstore = null,
        // toAuditOrder_platOrderStatus = null,
        toAuditOrder_logisType = null,
        toAuditOrder_Site = null,
        toAuditOrder_Currency = null,
        toAudit_formdata ={},
        toAuditOrder_companyType = "logisticsModes";
    laydate.render({
        elem: '#toAuditOrder_time',
        type: 'datetime',
        inputAuto: true,
        range: true,
        showShortcuts: true,
    });

    // 模板查询赋值
    commonSaveSearchTpl({
        id: "toAuditOrder_save",
        formId: "toAuditOrderForm",
        pageName: "auditDespathOrder_toAuditOrder",
        searchBtnId: "toAuditOrderSearch",
        cb: (param) => toAuditOrder_formVal(param),
    })

    function toAuditOrder_formVal(param) {
        let $formDom = $("#toAuditOrderForm")
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
                appendSelect($('#toAuditOrderForm').find(`select[_name=storeAcctIds]`), res, 'id', 'storeAcct')
                formSelects.render("toAuditOrderStoreAcct")
                formSelects.value("toAuditOrderStoreAcct", storeList)
                // 给表单赋值
                form.val("toAuditOrderForm", param)
                // 更多查询条件是否有值
                toAuditOrderHasValue("toAuditOrderForm", "showMoreSearchCondition_toAuditOrder")
                // 多选的 name: xm-select
                let multiSelectObj = {
                salePersonId: "toAuditOrder_salePersonsSelect",
                prodLogisAttrs: "logisAttrs",
                platOrderStatusList: "toauditorderOrderStatusList",
                shippingCountryCodes: "shippingCountrys",
                platTags: "toAuditOrder_platTags",
                logisTypeIds: "logisTypeIds_xm_select_toAudit",
                orderLabels: "orderLabels_toAuditOrder",
                }
                Object.keys(multiSelectObj).forEach(item => {
                    if (param[item]) {
                        formSelects.value(multiSelectObj[item], param[item].split(","), true)
                    } else {
                        formSelects.render(multiSelectObj[item])
                    }
                })
                // 执行搜索
                $('#toAuditOrderSearch').click()
                form.render()
            })
        }, timeStamp);
       

        // 页签
        if(param.unAuditOrderStatus){
            $('#toAuditOrder_Tab').find('li').each(function(){
                let liIndex = $(this).data('index')
                if(liIndex == param.unAuditOrderStatus){
                    $(this).addClass('layui-this')
                }else{
                    $(this).removeClass('layui-this')
                }
            })
        }
        
        if(param.agentCompany){
            $formDom.find("select[name=agentCompany]").next().find(`dd[lay-value="${param.agentCompany}"]`).trigger("click")
        }
        if(param.logisticsCompanyId) {
            $formDom.find("select[name=logisticsCompanyId]").next().find(`dd[lay-value="${param.logisticsCompanyId}"]`).trigger("click")
        }
    }

    formSelects.render('toauditorderOrderStatusList', { placeholder: '请先选择平台' });
    //渲染平台标记
    toAuditOrder_renderPlatCodeMark();
    function toAuditOrder_renderPlatCodeMark () {
        commonReturnPromise({
            url: '/lms/unauditorder/listenum.html'
        }).then(res => {
            let { platTagList } = res;
            commonRenderSelect('toAuditOrder_platTags', platTagList).then(() => {
                formSelects.render('toAuditOrder_platTags');
            });
        });
    }

    // 前端删除行，删除后不刷新表格
    function deleteTableRow_toAuditOrder(ids,errIdsArr){
        zttCommonRemoveDataHandle({
            selectedIds: ids,
            gridOptions: gridOptions,
            tableData: immutableStore,
            errIds: errIdsArr
        }).then(newObj => {
            let { newData, successIds } = newObj;
            // immutableStore = newData;
            let oldNum = $('#toAuditOrder_Tab ul li.layui-this>span').text();
            let newNum = oldNum - successIds.length;
            $('#toAuditOrder_Tab ul li.layui-this>span').text(newNum);
            $('#toAuditOrderPage .layui-laypage-count').text(`共 ${newNum} 条`);
        });
    }
    // 前端更新行，更新后不刷新表格
    function updateTableRow_toAuditOrder(ids,errIdsArr){
        zttCommonUpdataDataHandle({
            selectedIds: ids,
            errIds: errIdsArr
        }).then(newObj => {
            // 修改成功的数据
            let { successIds } = newObj;
            if(successIds.length != 0){
                // 选中的数据
                let checkStatus = gridOptions.api.getSelectedRows();
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
                    gridOptions.api.updateRowData({ update: newCheckStatus });
                })
            }
        });
    }
    // 前端更新行，更新后不刷新表格
    function updateSingleRow_toAuditOrder(id){
        // 选中的数据
        let data = gridOptions.api.getRowNode(id);
        commonReturnPromise({
            url: ctx + '/unauditorder/listorder.html',
            type: 'POST',
            params:{orderIds:id}
        }).then(function(result){
            data.setData(result[0]?result[0]:[]);
        })
    }

    // var nowdate = new Date(new Date().toLocaleDateString()).getTime()
    // var endDate = Format(nowdate + 24 * 60 * 60 * 1000 - 1, 'yyyy-MM-dd hh:mm:ss')
    // var onemonth = Format(new Date(nowdate - 60 * 24 * 3600 * 1000), 'yyyy-MM-dd hh:mm:ss')
    // $('#toAuditOrder_time').val(onemonth + ' - ' + endDate)

    // 展示和隐藏 更多查询条件
    $('#showMoreSearchCondition_toAuditOrder').click(function() {
        var self = this
        if ($(self).hasClass('showExternal')) {
            $(self).closest('.layui-form').find('.externalContainAuditorder').hide()
            $('#hide_icon_toauditorder').show()
            $('#show_icon_toauditorder').hide()
            $(self).removeClass('showExternal')
            toAuditOrderHasValue ('toAuditOrderForm', 'showMoreSearchCondition_toAuditOrder')
        } else {
            $(self).closest('.layui-form').find('.externalContainAuditorder').show()
            $('#hide_icon_toauditorder').hide()
            $('#show_icon_toauditorder').show()
            $(self).addClass('showExternal')
        }
    })

    function toAuditOrderHasValue (formId, btnId) {
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

    form.on('submit(toAuditOrder_export)', function(data) {
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
    form.on('submit(toAuditOrderDetail_export)', function(data) {
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

    //导出功能
    componentForOrderDownload('toAuditOrder_exportTemplate', getTableSelectIds);

    element.on('tab(toAuditOrder_Tab)', function(data) {
        var unAuditOrderStatus = data.elem.context.dataset.index
        $('#toAuditOrderForm input[name="unAuditOrderStatus"]').val(unAuditOrderStatus)
        $('#toAuditOrderSearch').click()
    });
    //删除订单功能
    $('#toAuditOrder_deleteOrder').on('click', function () {
        let data = gridOptions.api.getSelectedRows();
        var ids = (data || []).map(function(item) {
            return item.id
        })
        if (ids.length > 0) {
            layer.confirm('删除的订单若在30天内系统会自动重新下载,否则需要手动添加,确认删除吗?', {icon: 3, title:'提示'}, function(index){
                commonReturnPromise({
                    url: '/lms/unauditorder/deleteorder.html',
                    type: 'post',
                    contentType: 'application/json',
                    params: JSON.stringify({
                        "id": ids.join(',')
                    })
                }).then(res => {
                    layer.msg(res || '删除成功,订单恢复中', { icon: 1 });
                    $('#toAuditOrderSearch').click();
                })
                layer.close(index);
              });
        } else {
            layer.msg('请选择订单',{icon:7});
        }
    });
    //更新法属国信息
    $('#LAY-toAuditOrder #updateCountry').click(function() {
        // var checkStatus = table.checkStatus('toAuditOrder_table')
        // var data = checkStatus.data
        let data = gridOptions.api.getSelectedRows();
        var ids = (data || []).map(function(item) {
            return item.id
        })
        if (ids.length > 0) {
            updateOwnerContry(ids)
        } else {
            layer.msg('请选择订单',{icon:7});
        }
    })
    //更新商品信息
    $('#LAY-toAuditOrder #updateProducts').click(function() {
        // var checkStatus = table.checkStatus('toAuditOrder_table')
        // var data = checkStatus.data
        let data = gridOptions.api.getSelectedRows();
        var ids = (data || []).map(function(item) {
            return item.id
        })
        if (ids.length > 0) {
            // updateProducts(ids)
            commonReturnPromise({
                url: '/lms/unauditorder/updateprodinfo.html',
                type: 'post',
                params: { ids: ids.join(',') },
            }).then(res => {
                layer.msg(res, { icon: 1 })
                updateTableRow_toAuditOrder(ids,[])
            });
        } else {
            layer.msg('请选择订单',{icon:7});
        }
    });
    //拆分组合品
    $('#LAY-toAuditOrder #toAuditOrder_splitCompSku').click(function() {
        // var checkStatus = table.checkStatus('toAuditOrder_table')
        // var data = checkStatus.data
        let data = gridOptions.api.getSelectedRows();
        var ids = (data || []).map(function(item) {
            return item.id
        })
        if (ids.length > 0) {
            splitCompSku(ids)
        } else {
            layer.msg('请选择订单',{icon:7});
        }
    });
    //合并组合品
    $('#LAY-toAuditOrder #toAuditOrder_mergeCompSku').click(function() {
        // var checkStatus = table.checkStatus('toAuditOrder_table')
        // var data = checkStatus.data
        let data = gridOptions.api.getSelectedRows();
        var ids = (data || []).map(function(item) {
            return item.id
        })
        if (ids.length > 0) {
            mergeCompSku(ids)
        } else {
            layer.msg('请选择订单',{icon:7});
        }
    })
    //匹配物流
    $('#LAY-toAuditOrder #matchLogis').click(function() {
        // var checkStatus = table.checkStatus('toAuditOrder_table')
        // var data = checkStatus.data
        let data = gridOptions.api.getSelectedRows();
        var ids = (data || []).map(function(item) {
            return item.id
        })
        if (ids.length > 0) {
            matchLogis(ids)
        } else {
            layer.msg('请选择订单',{icon:7});
        }
    })

    //库存占用规则
    // $('#toAuditOrder_holdStockTask').click(function() {
    //     layer.confirm('根据库存占用规则对缺货、待派单订单进行库存占用', function (result) {
    //         if (result) {
    //             initAjax('/abnormalorder/holdstocktask.html', 'post', {}, function(returnData) {
    //                 layui.admin.batchResultAlert("订单重新走库存占用规则:",returnData.data,function(){
    //                     $('#toAuditOrderSearch').click();
    //                 });
    //             }, 'application/x-www-form-urlencoded');
    //         }
    //     });
    // });

    //标记发货
    $('#LAY-toAuditOrder #markDelivery').click(function() {
        // var checkStatus = table.checkStatus('toAuditOrder_table')
        // var data = checkStatus.data
        let data = gridOptions.api.getSelectedRows();
        var ids = (data || []).map(function(item) {
            return item.id
        })
        if (ids.length > 0) {
            markDelivery(ids)
        } else {
            layer.msg('请选择订单',{icon:7});
        }
    })

    //审核订单
    $('#LAY-toAuditOrder #toaudit_auditOrder').click(function() {
        // var checkStatus = table.checkStatus('toAuditOrder_table')
        // var data = checkStatus.data
        let data = gridOptions.api.getSelectedRows();
        var ids = (data || []).map(function(item) {
            return item.id
        })
        if (ids.length > 0) {
            toAuditOrderBatch(ids)
        } else {
            layer.msg('请选择订单',{icon:7});
        }
    })
    //标记异常订单
    $('#LAY-toAuditOrder #markException').click(function() {
        // var checkStatus = table.checkStatus('toAuditOrder_table')
        // var data = checkStatus.data
        let data = gridOptions.api.getSelectedRows();
        var ids = (data || []).map(function(item) {
            return item.id
        })
        if (ids.length > 0) {
            markException(ids)
        } else {
            layer.msg('请选择订单',{icon:7});
        }
    });

    //直接转已发货
    $('#LAY-toAuditOrder #toAuditOrder_toShipped').click(function() {
        // var checkStatus = table.checkStatus('toAuditOrder_table')
        // var data = checkStatus.data
        let data = gridOptions.api.getSelectedRows();
        var ids = (data || []).map(function(item) {
            return item.id
        })
        if (ids.length > 0) {
            toShipped(ids)
        } else {
            layer.msg('请选择订单')
        }
    });

    //修改订单标签
    $('#toAuditOrder_modifyOrderLabel').click(function () {
        // var checkStatus = table.checkStatus('toAuditOrder_table')
        // var data = checkStatus.data
        let data = gridOptions.api.getSelectedRows();
        var idsArr = data.map(function(item) {
            return item.id;
        });
        if (idsArr.length == 0) {
            return layer.msg('请先选择数据', { icon: 7 });
        }
        let ids = idsArr.join('-');
        commonDirectMailRemarkBatch(ids,gridOptions);
        // universalOrder_changeTipsLayer(0, toAuditOrder_pageEnum.orderLabels_toAuditOrder, {renderDomId: 'toAuditOrder_updateProdPInfoListPop',
        // mainFormId: 'toAuditOrder_updateProdPInfoForm', selectDomId: 'toAuditOrder_noteContent_content'})
    })

    // 更新新品信息
    $('#toAuditOrder_modifyCostInfo').click(function(){
        let data = gridOptions.api.getSelectedRows();
        var idsArr = data.map(function(item) {
            return item.id;
        });
        if (idsArr.length == 0) {
            return layer.msg('请先选择数据', { icon: 7 });
        }
        let ids = idsArr.join(',');
        commonReturnPromise({
            url: '/lms/unauditorder/updateCostInfo',
            type: 'post',
            params: {ids},
        }).then(res=>{
            layer.msg(res,{icon:1})
            $('#toAuditOrderSearch').click();
        })
    })

    //同步订单状态
    $('#LAY-toAuditOrder #syncOrderStatus').click(function() {
        // var checkStatus = table.checkStatus('toAuditOrder_table')
        // var data = checkStatus.data
        let data = gridOptions.api.getSelectedRows();
        var ids = (data || []).map(function(item) {
            return item.id
        })
        var platOrderId = (data || []).map(function(item) {
            return item.platOrderId
        })
        if (ids.length > 0) {
            syncOrderStatus(ids,platOrderId)
        } else {
            layer.msg('请选择订单',{icon:7});
        }
    })

    function removeSelected() {
        const selectedRowNodes = gridOptions.api.getSelectedNodes();
        const selectedIds = selectedRowNodes.map(function (rowNode) {
            return rowNode.id;
        });
        immutableStore = immutableStore.filter(function (dataItem) {
            return selectedIds.indexOf(dataItem.id.toString()) < 0;
        });
        gridOptions.api.setRowData(immutableStore);
    }

    //新增订单
    $('#LAY-toAuditOrder #newOrder').click(function () {
        // toAuditOrderNewandEdit('1', null)
        toAuditOrderNewandEdit('1', {})
    })
    //批量修改仓库-20220629-ztt
    $('#LAY-toAuditOrder #toAuditOrder_batchEditWareHouse').click(function () {
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
                        return item.value == '昆山仓' || item.value == '义乌仓';
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
                        updateTableRow_toAuditOrder(ids,errIdsArr)
                        // $('#toAuditOrderSearch').trigger('click');
                    });
                })
            }
        });
    });
    //转取消订单
    $('#toAuditOrder_toCancel').click(function() {
        let ids = getTableSelectIds();
        if (!ids || ids.length < 1) {
            layer.msg('请选择订单',{icon:7});
            return;
        }
        commonOrderConfirmLayer(ids.length, function (index) {
            initAjax('/abnormalorder/tocancel.html', 'post', { ids: ids.join(",") }, function (returnData) {
                layer.close(index);
                layui.admin.batchResultAlert("转取消订单:", returnData.data, function (errIdsArr) {
                    deleteTableRow_toAuditOrder(ids,errIdsArr)
                    // zttCommonRemoveDataHandle({
                    //     selectedIds: ids,
                    //     gridOptions: gridOptions,
                    //     tableData: immutableStore,
                    //     errIds: errIdsArr
                    // }).then(newObj => {
                    //     let { newData, successIds } = newObj;
                    //     // immutableStore = newData;
                    //     let oldNum = $('#toAuditOrder_Tab ul li.layui-this>span').text();
                    //     let newNum = oldNum - successIds.length;
                    //     $('#toAuditOrder_Tab ul li.layui-this>span').text(newNum);
                    //     $('#toAuditOrderPage .layui-laypage-count').text(`共 ${newNum} 条`);
                    // });
                    // let temArr = getOrderId(returnData.data.successResults, '取消订单', returnData.data.successNum) || []
                    // changeCount('#toAuditOrder_Tab', returnData.data.successNum)
                    // removeSelected()
                    // temArr.forEach(value => {
                    //     deleteCheckedData('toAuditOrder_table', [value], `td[data-content="${value}"]`)
                    // })
                });
            }, 'application/x-www-form-urlencoded');
        });
    });
    //重新分仓
    $('#toAuditOrder_reMatchWarehouseType').click(function() {
        let ids = getTableSelectIds();
        if (!ids || ids.length < 1) {
            layer.msg('请选择订单',{icon:7});
            return;
        }
        layer.confirm('选中订单重新匹配分仓处理?', function(index) {
            initAjax('/unauditorder/rematchwarehousetype.html', 'post', { ids: ids.join(",") }, function(returnData) {
                layui.admin.batchResultAlert("匹配分仓:",returnData.data,function(errIdsArr){
                    updateTableRow_toAuditOrder(ids,errIdsArr)
                });
            }, 'application/x-www-form-urlencoded');
        })

    });
    //指定仓库类型
    $('#toAuditOrder_appointWarehouseType').click(function() {
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
                $(layero).find('.layui-layer-content').html($("#toAuditOrder_appointWarehouseTypeTpl").html());
                layui.form.render("radio");
            },
            yes: function(index, layero) {
                let warehouseType = $("#toAuditOrder_appointWarehouseTypeForm input[name=warehouseType]:checked").val();
                initAjax('/unauditorder/appointwarehousetype.html', 'post', { ids:ids.join(","),warehouseType:warehouseType }, function(returnData) {
                    layui.admin.batchResultAlert("重新指定仓库类型:",returnData.data,function(errIdsArr){
                        updateTableRow_toAuditOrder(ids,errIdsArr)
                    });
                    layer.close(index);
                }, 'application/x-www-form-urlencoded')
            }
        })
    });
    //重新匹配SKU
    $('#toAuditOrder_reParseSku').click(function() {
        let ids = getTableSelectIds();
        if (!ids || ids.length < 1) {
            layer.msg('请选择订单',{icon:7});
            return;
        }
        layer.confirm('对SKU异常订单重新匹配SKU?', function(index) {
            initAjax('/unauditorder/reparsesku.html', 'post', { ids: ids.join(",") }, function(returnData) {
                layui.admin.batchResultAlert("匹配SKU:",returnData.data,function(errIdsArr){
                    updateTableRow_toAuditOrder(ids,errIdsArr)
                });
            }, 'application/x-www-form-urlencoded');
        })

    });
    // //取消wishpost订单
    // $('#LAY-toAuditOrder #toAuditOrder_cancelWishpost').click(function() {
    //     var checkStatus = table.checkStatus('toAuditOrder_table')
    //     var data = checkStatus.data
    //     var ids = (data || []).map(function(item) {
    //         return item.id
    //     })
    //     if (ids.length <= 0) {
    //         layer.msg('请选择订单',{icon:7});
    //         return
    //     }
    //     layer.open({
    //         type: 1,
    //         title: '取消wishpost订单',
    //         btn: ['确认','取消'],
    //         area: ['40%','60%'],
    //         content: "loading",
    //         success: function(layero, index) {
    //             $(layero).find('.layui-layer-content').html($("#toAuditOrder_cancelWishpostTpl").html());
    //             layui.form.render();
    //         },
    //         yes: function(index, layero) {
    //             var cancelReasonCode = $("#toAuditOrder_cancelWishpostForm select[name=cancelReasonCode]").val();
    //             var invalidReason = $("#toAuditOrder_cancelWishpostForm input[name=invalidReason]").val();
    //             //取消wishpost物流单
    //             initAjax('/platorder/cancelwishpost.html', 'post', { ids:ids,cancelReasonCode:cancelReasonCode,invalidReason:invalidReason }, function(returnData) {
    //                 let str = returnData.data.join("<br>");
    //                 layer.alert(str);
    //                 //处理完成后刷新页面
    //                 $('#toAuditOrderSearch').click();
    //                 layer.close(index);
    //             }, 'application/x-www-form-urlencoded')
    //         }
    //     })
    //
    // })



    // 表单提交
    form.on('submit(toAuditOrderSearch)', function(data) {
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
        if(data.field.agentCompany == 'logisticsModes' && data.field.logisticsCompanyId && !data.field.logisTypeIds){
            data.field.logisTypeIds = $('#logisTypeIds_xm_select_toAudit').attr('acct_ids')
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
            delete data.field.logisticsCompanyId
        }
        // 1. 选择了部门，没有选店铺
        //     1.1 部门下有店铺，传全部店铺
        //     1.2 部门下没有店铺，传0
        // 2. 选择了部门，选择了店铺，传选择的店铺
        if(data.field.orgs != ''&&data.field.storeAcctIds == ''){
            data.field.storeAcctIds = $('#toAuditOrder_store').attr('acct_ids') || 0;
        }
        toAuditOrderTableorder(data.field)
    });

    //监听平台下拉选择
    commonInitRenderRoleType('toAuditOrder');
    form.on('select(toAuditOrderplatCodes)', function (obj) {
        // commonOrderAddSalePerson('toAuditOrder', form, obj.value);
        commonOrderAddOrg('toAuditOrder', form, obj.value);
        // 平台状态
        getListplatorderstatus_toauditorder(obj.value).then(function(data) {
            let arr = []
            data && data.forEach(item => arr.push({"platOrderStatus":item}))
            commonRenderSelect('toauditorderOrderStatusList', arr, { name: 'platOrderStatus', code: 'platOrderStatus'}).then(function() {
                formSelects.render('toauditorderOrderStatusList',{ placeholder: '请先选择平台' });
            });
        });
        // getStoreByPlatform(obj.value,function(returnData){
        //     appendSelect($('#toAuditOrderForm').find('select[_name="storeAcctIds"]'), returnData.data, 'id', 'storeAcct')
        // })
    })

    //监听公司下拉选择
    form.on('select(toAuditOrdercompanyType)', function(obj) {
        toAuditOrder_companyType = obj.value
        let name = obj.value ==='logisticsModes' ? 'logisticsCollectionName' : 'cnName'
        appendSelect($('#toAuditOrderForm').find('select[name="logisticsCompanyId"]'), toAuditOrder_company[toAuditOrder_companyType], 'id', name)
        form.render()
    })
    //监听物流公司下拉选择
    form.on('select(toAuditOrdercompany)', function(obj) {
        var agent = "",
            logisticsModeId='',
            logisticsCompanyId = "";
        if(toAuditOrder_companyType === 'agents'){
            agent = obj.value
        }else if(toAuditOrder_companyType === 'companys'){
            logisticsCompanyId = obj.value
        }else if(toAuditOrder_companyType === 'logisticsModes'){
            logisticsModeId = obj.value
        }
        getAllLogicsType(agent, logisticsCompanyId, logisticsModeId)
        form.render()
    })


    //监听工具栏操作
    // table.on("tool(toAuditOrder_table)", function(obj) {
    //     var event = event ? event : window.event;
    //     event.stopPropagation();
    //     var data = obj.data
    //     if (obj.event === "toAuditOrder_remark") { //备注
    //         toAuditOrderRemark(data)
    //     } else if (obj.event === "toAuditOrder_modify") { //编辑订单
    //         loading.show()
    //         requestDetailedData(data.id).then(res => {
    //             data.orderDetails = res
    //             toAuditOrderNewandEdit('2', data)
    //         })
    //     } else if (obj.event === "toAuditOrder_demolition") { //拆单
    //         requestDetailedData(data.id).then(res => {
    //             data.orderDetails = res
    //             if (data.operOrderType == "0") { //原始订单
    //                 originOrderDemolimotion(data)
    //             } else if (data.operOrderType == "1") { //拆出订单，不允许拆单
    //                 //layer.msg('当前订单为拆出订单，不允许再拆单', {icon:0})
    //                 originOrderDemolimotion(data)
    //             } else if (data.operOrderType == "2") { //合并拆单，只能恢复合并前订单
    //                 layer.confirm('当前订单为合并订单，是否恢复原订单?', function(index) {
    //                     mergeDemolition(data.id)
    //                 })
    //             }
    //         })
    //     } else if (obj.event === "toAuditOrder_issueRefund") { //
    //         orderIssueRefund(data, function(){
    //         });
    //     }
    // });


    getPageEnum();
    getAllCompanies();
    getStoreByPlatform('', function(returnData) {
        toAuditOrder_allstore = returnData.data
    });
    // getListplatorderstatus('', function(returnData) {
    //     let arr = []
    //     returnData.data && returnData.data.forEach(item => arr.push({"platOrderStatus":item}))
    //     toAuditOrder_platOrderStatus = arr
    // });
    getAllLogicsType('', '', '', function(returnData) {
        toAuditOrder_logisType = returnData.data
    });
    getAlldevEmployee();
    getAllpurchaseEmployee();
    getAllSite();
    getCurrencyEnums();
    let platOper = new dropButton('toAuditOrder_platOper');
    let editOrder = new dropButton('toAuditOrder_editOrder');
    let dealOrder = new dropButton('toAuditOrder_dealOrder');


    // 页面数据请求----------------------------------------
    // 订单获得详细数据
    function requestDetailedData(orderId) {
        return commonReturnPromise({
            url: ctx + '/unauditorder/detail.html',
            params: {orderId}
        })
    }
    //  获取页面枚举数
    function getPageEnum() {
        initAjax('/unauditorder/listenum.html', 'post', {}, function(returnData) {
            toAuditOrder_pageEnum = returnData.data
            toAuditOrder_pageEnum.platCode = toAuditOrder_pageEnum.platCodes
            toAuditOrder_pageEnum.prodLogisAttrs = toAuditOrder_pageEnum.logisAttrs
            toAuditOrder_pageEnum.shippingCountryCodes = toAuditOrder_pageEnum.shippingCountrys
            toAuditOrder_pageEnum.warehouseId = toAuditOrder_pageEnum.prodWarehouses
            let temporayReturn = []
            returnData.data.orderLabels.forEach((v)=>{
                let temporayObj = {}
                temporayObj.name = v.code
                temporayObj.value = v.name
                temporayReturn.push(temporayObj)
            })
            returnData.data.orderLabels = temporayReturn
            toAuditOrder_pageEnum.orderLabels = temporayReturn
            toAuditOrder_pageEnum.orderLabels_toAuditOrder = toAuditOrder_pageEnum.orderLabels
            for (var i in returnData.data) {
                appendSelect($('#toAuditOrderForm').find('select[name="'+i+'"]'), returnData.data[i], 'name', 'value')
                appendSelect($('#toAuditOrderForm').find('select[_name="'+i+'"]'), returnData.data[i], 'name', 'value')

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
                    appendTab(returnData.data[i])
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
    function getAllCompanies() {
        initAjax('/unauditorder/listcompanyandagent.html', 'post', {}, function(returnData) {
            toAuditOrder_company = returnData.data
            appendSelect($('#toAuditOrderForm').find('select[name="logisticsCompanyId"]'), returnData.data.logisticsModes, 'id', 'logisticsCollectionName')
            form.render()
        })
    }

    //获取所有物流方式
    function getAllLogicsType(agent, logisticsCompanyId, logisticsModeId, func) {
        initAjax('/unauditorder/listlogistype.html', 'get', { agent, logisticsCompanyId, logisticsModeId, specialType: "直发物流"}, function(returnData) {
            if (func) {
                func(returnData)
            }
            if(!$('#toAuditOrderForm').find('select[_name="logisTypeIds"]').length){
                formSelects.render('logisTypeIds_xm_select_toAudit')
            }
            appendSelect($('#toAuditOrderForm').find('select[_name="logisTypeIds"]'), returnData.data, 'id', 'name')
            formSelects.render('logisTypeIds_xm_select_toAudit')
        })
    }

    //根据平台code获取店铺列表
    function getStoreByPlatform(platcode, func) {
        initAjax('/sys/orderliststorebyplatcode.html', 'get', { platCode: platcode }, function(returnData) {
            if (func) {
                func(returnData)
            }
            formSelects.render('toAuditOrderStoreAcct',{ placeholder: '请先选择平台' });
        }, 'application/x-www-form-urlencoded')
    }

    //根据平台code,roleNames获取店铺列表
    function getStoreByPlatformAndRoleName(platcode, func) {
        initAjax('/sys/listStoreForRenderHpStoreCommonComponent.html', 'post', { platCode: platcode,roleNames: `${platcode}专员`, }, function(returnData) {
            if (func) {
                func(returnData)
            }
        }, 'application/x-www-form-urlencoded')
    }

    // 获取平台订单状态
    function getListplatorderstatus_toauditorder(platcode) {
        // initAjax('/undispatch/listplatorderstatus.html', 'get', { platCode: platcode }, function(returnData) {
        //     if (func) {
        //         func(returnData)
        //     }
        //     formSelects.render('toauditorderOrderStatusList')
        // }, 'application/x-www-form-urlencoded')
        return commonReturnPromise({
            type: 'get',
            url: `/lms/undispatch/listplatorderstatus.html?platCode=${platcode}`
        });
    }

    //获取所有开发专员
    function getAlldevEmployee() {
        initAjax('/sys/prodOwnerList.html', 'post', {}, function(returnData) {
            appendSelect($('#toAuditOrderForm').find('select[name="preprodDevId"]'), returnData.data, 'id', 'loginName')
            form.render()
        })
    }

    //获站点接口
    function getAllSite(platCode, func) {
        initAjax('/enum/getSiteEnum.html?platCode=' + platCode, 'post', {}, function(returnData) {
            toAuditOrder_Site = returnData.data
            if (func) {
                func(returnData)
            }
        }, 'application/x-www-form-urlencoded')
    }

    //获取币种枚举
    function getCurrencyEnums() {
        initAjax('/sysdict/getCurrencyEnums.html', 'post', {}, function(returnData) {
            toAuditOrder_Currency = returnData.data
        })
    }

    //更新法属国
    function updateOwnerContry(ids) {
        var ids = ids.join(',')
        initAjax('/unauditorder/updatefrinfo.html', 'post', { ids: ids }, function(returnData) {
            layer.msg(returnData.msg || '更新法属国成功')
            updateTableRow_toAuditOrder(ids,[])
        }, 'application/x-www-form-urlencoded')
    }

    // //更新商品信息
    // function updateProducts(ids) {
    //     var ids = ids.join(',')
    //     initAjax('/unauditorder/updateprodinfo.html', 'post', { ids: ids }, function(returnData) {
    //         layer.msg(returnData.msg || '更新商品信息成功')
    //         $('#toAuditOrderSearch').click()
    //     }, 'application/x-www-form-urlencoded')
    // }
    // //拆分组合品
    // function splitCompSku(ids) {
    //     var ids = ids.join(',')
    //     initAjax('/unauditorder/splitcompsku.html', 'post', { ids: ids }, function(returnData) {
    //         var html = '拆分订单组合品:<br/>'
    //         for (var i in returnData.data) {
    //             html += returnData.data[i] + '<br/>'
    //         }
    //         layer.alert(html)
    //         //重新搜索
    //         $('#toAuditOrderSearch').click()
    //
    //     }, 'application/x-www-form-urlencoded')
    // }
    // //合并订单为组合品
    // function mergeCompSku(ids) {
    //     var ids = ids.join(',')
    //     initAjax('/unauditorder/mergecompsku.html', 'post', { ids: ids }, function(returnData) {
    //         var html = '合并订单为组合品:<br/>'
    //         for (var i in returnData.data) {
    //             html += returnData.data[i] + '<br/>'
    //         }
    //         layer.alert(html)
    //         //重新搜索
    //         $('#toAuditOrderSearch').click()
    //     }, 'application/x-www-form-urlencoded')
    // }


    // 匹配物流
    function matchLogis(ids) {
        initAjax('/unauditorder/matchlogistype.html', 'post', { ids: ids.join(',') }, function(returnData) {
            layui.admin.batchResultAlert("匹配物流完成:",returnData.data,function(errIdsArr){
                updateTableRow_toAuditOrder(ids,errIdsArr)
            });
            // let checkStatus = gridOptions.api.getSelectedRows();
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
            // gridOptions.api.updateRowData({ update: newCheckStatus })
        }, 'application/x-www-form-urlencoded')
    }

    /**
     * 同步订单状态
     * @param {订单号} ids
     * @param {平台订单号，拆分订单的平台订单号相同} platOrderId
     */
    function syncOrderStatus(ids,platOrderId) {
        var idStr = ids.join(',')
        initAjax('/unauditorder/syncplatstatus.html', 'post', { ids: idStr }, function(returnData) {
            layui.admin.batchResultAlert("同步订单状态:",returnData.data,function(errIdsArr){
                updateTableRow_toAuditOrder(ids,errIdsArr)
            });
            // let checkStatus = gridOptions.api.getSelectedRows();
            // if (returnData.data.successNum <= 0) {
            //     return false;
            // }
            // // let temStrArr = []
            // // // 把修改成功的id存成数组，以便于后面匹配和取数据
            // // for(let key in returnData.data.logs){
            // //     temStrArr.push(key)
            // // }
            // // let newCheckStatus = deepCopy(checkStatus)
            // // // 匹配选中的数据
            // // checkStatus.forEach((v,index) => {
            // //     if(temStrArr.indexOf(v.id.toString()) > -1){ // 如果匹配到，就代表这一条数据修改成功，前端显示
            // //         newCheckStatus[index].platOrderStatus = returnData.data.logs[v.id]
            // //     }
            // // })
            // // 将返回结果成功的订单id替换成平台订单id
            // let platOrderIdSuccessObj = {}
            // for(let key in returnData.data.logs){
            //     platOrderIdSuccessObj[platOrderId[ids.indexOf(key*1)]] = returnData.data.logs[key]
            // }
            // let newImmutableStore = deepCopy(immutableStore)
            // newImmutableStore.forEach(item =>{
            //     // 获取当前的平台订单号，拆分的订单，平台订单号是相同的
            //     // 匹配到返回成功的结果，赋值
            //     if(platOrderIdSuccessObj[item.platOrderId] != undefined&&platOrderIdSuccessObj[item.platOrderId] != ''){
            //         item.platOrderStatus = platOrderIdSuccessObj[item.platOrderId]
            //     }
            // })
            // // gridOptions.api.updateRowData({ update: newCheckStatus })
            // gridOptions.api.setRowData(newImmutableStore);
        }, 'application/x-www-form-urlencoded')
    }

    /**
     * 审核订单
     * @param {订单号} ids
     */
    function toAuditOrderBatch(ids) {
        var idsStr = ids.join(',')
        initAjax('/unauditorder/markaudit.html', 'post', { ids: idsStr }, function(returnData) {
            layui.admin.batchResultAlert("审核订单:", returnData.data, function (errIdsArr) {
                deleteTableRow_toAuditOrder(ids,errIdsArr)
                // zttCommonRemoveDataHandle({
                //     selectedIds: ids,
                //     gridOptions: gridOptions,
                //     tableData: immutableStore,
                //     errIds: errIdsArr
                // }).then(newObj => {
                //     let { newData, successIds } = newObj;
                //     // immutableStore = newData;
                //     let oldNum = $('#toAuditOrder_Tab ul li.layui-this>span').text();
                //     let newNum = oldNum - successIds.length;
                //     $('#toAuditOrder_Tab ul li.layui-this>span').text(newNum);
                //     $('#toAuditOrderPage .layui-laypage-count').text(`共 ${newNum} 条`);
                // });
                // $('#toAuditOrderSearch').click();
                // 模式同审核订单
                // let temArr = getOrderId(returnData.data.successResults, '标记异常', returnData.data.successNum) || []
                // changeCount('#toAuditOrder_Tab', returnData.data.successNum)
                // removeSelected()
                // temArr.forEach(value => {
                //     deleteCheckedData('toAuditOrder_table', [value], `td[data-content="${value}"]`)
                // })
            });
        }, 'application/x-www-form-urlencoded')
    }

    /**
     * 标记发货
     * @param {订单号} ids
     */
    function markDelivery(ids) {
        var idStr = ids.join(',');
        zttCommonProgressBar({ type: 10, ids: idStr }, function (progressData) {
            layui.admin.batchResultAlert("标记平台发货:",progressData,function(errIdsArr){
                updateTableRow_toAuditOrder(ids,errIdsArr)
            });
        });
    }

    /**
     * 标记异常
     * @param {订单号} ids
     */
    function markException (ids) {
        commonOrderConfirmLayer(ids.length, function (index) {
            initAjax('/unauditorder/markabnormal.html', 'post', { ids: ids.join(',') }, function (returnData) {
                layer.close(index);
                layui.admin.batchResultAlert("订单标记异常:", returnData.data, function (errIdsArr) {
                    deleteTableRow_toAuditOrder(ids,errIdsArr)
                    // zttCommonRemoveDataHandle({
                    //     selectedIds: ids,
                    //     gridOptions: gridOptions,
                    //     tableData: immutableStore,
                    //     errIds: errIdsArr
                    // }).then(newObj => {
                    //     let { newData, successIds } = newObj;
                    //     // immutableStore = newData;
                    //     let oldNum = $('#toAuditOrder_Tab ul li.layui-this>span').text();
                    //     let newNum = oldNum - successIds.length;
                    //     $('#toAuditOrder_Tab ul li.layui-this>span').text(newNum);
                    //     $('#toAuditOrderPage .layui-laypage-count').text(`共 ${newNum} 条`);
                    // });
                    // let temArr = getOrderId(returnData.data.successResults, '标记异常', returnData.data.successNum) || []
                    // changeCount('#toAuditOrder_Tab', returnData.data.successNum)
                    // removeSelected()
                    // temArr.forEach(value => {
                    //     deleteCheckedData('toAuditOrder_table', [value], `td[data-content="${value}"]`)
                    // })
                    // $('#toAuditOrderSearch').click();
                });
            }, 'application/x-www-form-urlencoded')
        });
    }
    /**
     * 直接转已发货
     * @param {订单号} ids
     */
    function toShipped (ids) {
        commonOrderConfirmLayer(ids.length, function (index) {
            initAjax('/platorder/toshipped.html', 'post', { ids: ids.join(',') }, function (returnData) {
                layer.close(index);
                layui.admin.batchResultAlert("直接转已发货:", returnData.data, function (errIdsArr) {
                    deleteTableRow_toAuditOrder(ids,errIdsArr)
                    // zttCommonRemoveDataHandle({
                    //     selectedIds: ids,
                    //     gridOptions: gridOptions,
                    //     tableData: immutableStore,
                    //     errIds: errIdsArr
                    // }).then(newObj => {
                    //     let { newData, successIds } = newObj;
                    //     // immutableStore = newData;
                    //     let oldNum = $('#toAuditOrder_Tab ul li.layui-this>span').text();
                    //     let newNum = oldNum - successIds.length;
                    //     $('#toAuditOrder_Tab ul li.layui-this>span').text(newNum);
                    //     $('#toAuditOrderPage .layui-laypage-count').text(`共 ${newNum} 条`);
                    // });
                    // let temArr = getOrderId(returnData.data.successResults, '转已发货', returnData.data.successNum) || []
                    // changeCount('#toAuditOrder_Tab', returnData.data.successNum)
                    // removeSelected()
                });
            }, 'application/x-www-form-urlencoded');
        });
    }

    //解密地址
    $('#toAuditOrder_decryptAddress').on('click', function () {
        let data = gridOptions.api.getSelectedRows();
        var ids = (data || []).map(function(item) {
            return item.id
        })
        if (ids.length > 0) {
            commonReturnPromise({
                type: 'post',
                url: '/lms/platorder/decrypt/list',
                contentType: 'application/json',
                params: JSON.stringify(ids)
            }).then(res => {
                layui.admin.batchResultAlert("解密地址:",res,function(errIdsArr){
                    updateTableRow_toAuditOrder(ids,errIdsArr)
                });
            });
        } else {
            layer.msg('请选择订单',{icon:7});
        }
    });


    //获取所有采购专员
    function getAllpurchaseEmployee() {
        initAjax('/sys/buyerList.html', 'post', {}, function(returnData) {
            appendSelect($('#toAuditOrderForm').find('select[name="purchasingAgentId"]'), returnData.data, 'id', 'loginName')
            form.render()
        })
    }

    //提交新增备注
    function toAuditorderaddRemark(id, noteContent, Type, func) {
        initAjax('/unauditorder/' + Type + '.html', 'post', { id, noteContent }, function(returnData) {
            if (func) {
                func(returnData)
            }
        }, 'application/x-www-form-urlencoded')
    }

    //申请跟踪号
    function applyTrackNumber(ids) {
        initAjax('/unauditorder/applylogistrackingno.html', 'post', { ids: ids }, function(returnData) {
            layer.msg(returnData.msg || "申请跟踪号成功")
        }, 'application/x-www-form-urlencoded')
    }
    //打印物流模板
    function printTrackTpl(ids) {
        initAjax('/unauditorder/printlogistpl.html', 'post', { ids: ids }, function(returnData) {
            var pdfUrls = returnData.data;
            debugger;
            if (pdfUrls && pdfUrls.length > 0) {
                var obj = {};
                obj.printType = 1;
                obj.pdfUrls = pdfUrls.join(",");
                obj.prefixBashpath = "";
                epeanPrintPdf_plugin_fun(obj);
            }


        }, 'application/x-www-form-urlencoded')
    }



    //合并订单拆单
    function mergeDemolition(id) {
        initAjax('/unauditorder/splitmergeorder.html', 'post', { id: id }, function(returnData) {
            layer.msg(returnData.msg || '拆单成功');
            $('#toAuditOrderSearch').trigger('click');
        }, 'application/x-www-form-urlencoded')
    }

    // 根据商品sku获取商品信息
    function getProdInfoByprodsku(arr, func) {
        // initAjax('/unauditorder/listprodinfo.html?prodSSkus=' + prodSSkus, 'get', {}, function(returnData) {
        //     if (func) {
        //         func(returnData)
        //     }
        // })
        initAjax('/unauditorder/listprodinfobysku.html', 'POST', JSON.stringify(arr), function(returnData) {
            if (func) {
                func(returnData)
            }
        })
    }

    // 获取所有页签数量
    function getAllTabNum(data){
        initAjax('/unauditorder/statuscount.html', 'post', data, function(returnData) {
            for(var i in returnData.data){
                $('#LAY-toAuditOrder #toAuditOrder_Tab').find('li[data-index="'+i+'"]').find('span').text(returnData.data[i])
            }
        }, 'application/x-www-form-urlencoded')
    }

    //   根据店铺sku获取商品信息
    function getProdInfoBystoresku(storeSSku, func) {
        initAjax('/unauditorder/getprodinfo.html?storeSSku=' + storeSSku, 'get', {}, function(returnData) {
            if (func) {
                func(returnData)
            }
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

    //保存修改新增待审核订单
    function savetoAuditOrders(data, func) {
        initAjax('/unauditorder/saveorder.html', 'post', JSON.stringify(data), function(returnData) {
            if (func) {
                func(returnData)
            }
        })
    }

    // 提交绑定订单标签
    function toAuditorderAddLabel(id,noteContent,func){
        let requestData = {
            ids: [id],
            noteContent: noteContent
        }
        requestData = JSON.stringify(requestData)
        initAjax('/unauditorder/addorderlabel.html', 'post', requestData, function(returnData) {
            if (func) {
                func(returnData)
            }
        }, 'application/json;charset=UTF-8')
    }

    $("button[name=orderConfig]").click(function(){
       let orderColumnState = gridOptions.columnApi.getColumnState()
        window.localStorage.setItem("orderColumnState",JSON.stringify(orderColumnState))
        layer.msg("保存设置成功")
    })
    function setModel(type) {
        const instance = gridOptions.api.getFilterInstance("shippingCountryCnName");

        instance.setModel({ values: MANGLED_COLOURS });
        gridOptions.api.onFilterChanged();
    }

    let immutableStore = [];
    const gridOptions = {
        columnDefs: [{
            // headerName: 'Athlete',
            // field: 'athlete',
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
                    // 店铺客服
                    const customServicerHtml = d.customServicer ? `[${d.customServicer}]` : ''
                    return `<div class="alignLeft">
                        <span class="pora copySpan">
                            <a>${d.id || ""}</a>
                            <button class="layui-btn layui-btn-primary layui-btn-xs copyTxt" onclick="layui.admin.copyTxt(this, event)">复制</button>
                        </span>
                        <span>[${d.platCode}]</span>
                        ${orderLabel}
                        ${tagsDom}
                        ${operOrderTypeTag}
                        <p id="toAudit_table_storeAcct">${d.storeAcct || ""}[${d.shopId || ""}]</p>
                        <p>[${d.salesPersons || ""}][${d.sellLeaderName || ""}]${customServicerHtml}</p>
                        <span class="pora copySpan">
                            <a id="toAudit_table_platOrderId">${d.platOrderId}</a>
                            <button class="layui-btn layui-btn-primary layui-btn-xs copyTxt" onclick="layui.admin.copyTxt(this, event)">复制</button>
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
                        <div><span class="gray">物流成本(￥)</span>${d.shippingCost}
                          <button class="layui-btn layui-btn-xs" name="logisCost" style="cursor:pointer;">详</button>
                        </div>
                        <div><span class="gray">利润(￥)</span>${profitCalculation} <span class="gray">${(100 * d.profit / d.platOrderAmt / d.exchangeRate).toFixed(2)}%</span></div>
                    </div>`
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
                        <div><span class="gray">种类：</span><span id="toAudit_table_skuQuantity">${d.kindNum||""}</span></div>
                        <div><span class="gray">数量：</span><span id="toAudit_table_prodQuantity">${d.prodQuantity||""}</span></div>
                        <div><span class="gray">预估重(g)：</span><span>${d.preWeight}</span></div>
                        <div><span class="gray">称重(g)：</span><span>${d.realWeight}</span></div>
                        <div><span class="gray">计费重(g)：</span><span>${d.priceWeight}</span></div>
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
                    const translateBtn = `<button class="layui-btn layui-btn-primary layui-btn-xs ml10" data-id="${d.id}" data-text="${_buyerNote}" onClick="toAuditBuyerTranslateTipsShow(this,event)">翻译</button>`
                    return `<div class="alignLeft">
                        <div id="toAudit_table_shippingUsername">${d.shippingUsername||""}</div>
                        <div>[${d.shippingCountryCnName||""}]</div>
                        <div>
                            <span data-text="${_buyerNote}" onmouseenter="toAuditBuyerTipsShow(this)" onmouseleave="toAuditBuyerTipsHide(this)">
                                <span class="pora copySpan">
                                    <span class="gray">留言：</span>${_buyerNote.slice(0, 46)}
                                    ${_buyerNote?_buyerNoteCopyHtml:''}
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
                        <div><span class="gray">仓库：</span>${d.warehouseName||""}</div>
                        <div><span class="gray">批次：</span>${d.pickBatchNo||""}</div>
                        <div><span class="gray">备注：</span>${recentNoteContent}${(d.platOrderNotes && d.platOrderNotes.length>1) ? noteTipsHtml : ''}</div>
                    </div>`

                    // if($("#toAuditOrder_Tab").find(".layui-this").attr("data-index") == 0){ // 全部
                    //     let str = `<div><span class="gray">状态：</span>${d.platOrderStatus||""}</div>`
                    //     html = html.replace(":platOrderStatus",str)
                    // }else{
                    //     html = html.replace(":platOrderStatus",'')
                    // }
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
                cellRenderer: () => {
                    let editDom = $('#toAuditOrder_updatePermTagTable').html();//修改订单
                    let splitDom = $('#toAuditOrder_splitPermTagTable').html(); //拆分订单
                    let ebayRefundDom = $('#toAuditOrder_ebayRefundPermTagTable').html(); //ebay退款
                    return `${editDom}<br>${splitDom}<br>${ebayRefundDom}<br>
				<button name="toAuditOrder_remark" class="layui-btn layui-btn-xs">备注</button>`
                }
            }
        ],
        rowData:immutableStore,
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
            gridOptions.columnApi.applyColumnState({ state: JSON.parse(window.localStorage.getItem("orderColumnState")) });
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
            handleTableOptions(event)
        },
        onCellMouseDown: function (event){
            timeStamp = event.event.timeStamp
        },
        onCellDoubleClicked: function (event) {
            // console.log(event)
            let headername = event.colDef.headerName,value=''
            if(headername == '物流'){
                value = `买家：${event.data.buyerRequireShippingType||""}，发货：${event.data.logisTypeName||""}，跟踪号：${event.data.logisAgentTrackingNo||""}`
                layui.admin.onlyCopyTxt(value)
            }
            if(headername == '订单处理'){
                value = `仓库：${event.data.warehouseName||""}，批次：${event.data.pickBatchNo||""}，备注：`
                layui.admin.onlyCopyTxt(value)
            }
        }
    };

    var gridDiv = document.querySelector('#toAuditOrder_table');
    agGrid.LicenseManager.setLicenseKey(
        "IRDEVELOPERS_COM_NDEwMjM0NTgwMDAwMA==f08aae16269f416fe8d65bbf9396be5f");
    new agGrid.Grid(gridDiv, gridOptions);

// 获取选中数据
    function getSelect() {
        //获取选中数据
        var rows = gridOptions.api.getSelectedRows();
        alert(JSON.stringify(rows));
    }
    var timeStamp;
    function handleTableOptions(event){
        let optionEvent = event.event.target.name,
            data = event.data;// 获取选中行数据
        if (optionEvent === "toAuditOrder_remark") { //备注
            commonDirectMailRemark(data,gridOptions);
            // toAuditOrderRemark(data)
            // console.log(data);
            // universalOrder_changeTipsLayer(1, toAuditOrder_pageEnum.orderLabels_toAuditOrder, {renderDomId: 'toAuditOrder_updateProdPInfoListPop',
            // mainFormId: 'toAuditOrder_updateProdPInfoForm', tableDomId: 'toAuditOrder_addProducts_table', selectDomId: 'toAuditOrder_noteContent_content'},{})
        } else if (optionEvent === "toAuditOrder_modify") { //编辑订单
            loading.show()
            requestDetailedData(data.id).then(res => {
                data.orderDetails = res.orderDetails
                data.orderDetails = data.orderDetails.sort(function (a, b) {
                    return a.availableStock - b.availableStock;
                });
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
                        mergeDemolition(data.id)
                    });
                }else if(data.operOrderType == "3"){ //重寄订单
                  layer.msg('重寄订单不允许拆单', {icon:7});
                }
            });
        } else if (optionEvent === "toAuditOrder_issueRefund") { //
            orderIssueRefund(data, function(){
            });
        }else if(optionEvent === 'logisCost'){
          //物流成本
          commonLogisCostLayerHandle(data.id);
        }else if(event.event.timeStamp - timeStamp < 300) {
            data.showLogisAttrList = true;
            data.showSale = true;
            // data被修改了？
            commonOrderDetailFn(data, gridOptions, 'toAuditOrder');
        }
        return false;
    }

    //渲染表格数据
    function toAuditOrderTableorder(searchData) {
        commonReturnPromiseRes({
            url: ctx + '/unauditorder/listorder.html',
            type: 'POST',
            params:searchData
        }).then(function(result){
            toAuditorderPage(searchData,result.count)
            immutableStore = result.data
            gridOptions.api.setRowData(immutableStore)

            // 渲染tab中的count数，复制原来的--start
            var tab = $('#LAY-toAuditOrder #toAuditOrder_Tab').find('.layui-this')
            if(!isObjectValueEqual(searchData,toAudit_formdata)){
                getAllTabNum(searchData)
                toAudit_formdata = searchData
            }
            if (tab.length > 0) {
                tab.find('span').text(result.count)
            } else {
                $('#LAY-toAuditOrder #toAuditOrder_Tab').find('li[data-index="' + searchData.unAuditOrderStatus + '"]').addClass('layui-this').find('span').text(result.count)
            }
            var tbody = $('#toAuditOrder_table').next('.layui-table-view').find('.layui-table-body').find('tr[data-index=0]')
            // 复制原来的--end

        }).catch(function(err){
            layer.msg(err, {icon:2});
        })
        // table.render({
        //     elem: '#toAuditOrder_table',
        //     method: 'POST',
        //     url: ctx + '/unauditorder/listorder.html',
        //     where: data,
        //     cols: [
        //         [
        //             { checkbox: true, width: 30 },
        //             { title: "订单号", field: "id", templet: "#toAuditOrder_id_tpl" },
        //             { title: "订单金额", field: "platOrderAmt", templet: "#toAuditOrder_platOrderAmt_tpl" },
        //             { title: "商品", field: "prodQuantity", templet: "#toAuditOrder_prodQuantity_tpl" },
        //             { title: "收件人", field: "shippingUsername", templet: "#toAuditOrder_shippingUsername_tpl" },
        //             { title: "物流", field: "logisTypeName", templet: '#toAuditOrder_logisTypeName_tpl' },
        //             { title: "时间", field: "time", templet: "#toAuditOrder_time_tpl" },
        //             { title: "状态", field: "platOrderStatus",
        //                 templet: function (d) {
        //                 let temporayStr = ''
        //                 if (d.orderLabel) {
        //                     let temporay = d.orderLabel.split(',')
        //                     temporay.forEach((v)=>{
        //                         let toAuditOrder = toAuditOrder_pageEnum.orderLabels.filter(value => value.code == v)[0]
        //                         toAuditOrder ? temporayStr += ` ${toAuditOrder.value || ''}`: temporayStr
        //                     })
        //                 }
        //                 let markShippingStatus = ''
        //                 if (d.markShippingStatus == 0) {
        //                     markShippingStatus = '未标记'
        //                 }else if (d.markShippingStatus == 1) {
        //                     markShippingStatus = '已标记'
        //                 }else if (d.markShippingStatus == 2) {
        //                     markShippingStatus = '标记失败'
        //                 }
        //                  return `<div class="alignLeft">
        //                          <div><span class="gray">留言：${d.buyerNote||""}</span></div>
        //                          <div><span class="gray">标记发货：${markShippingStatus || ''}</span></div>
        //                          <div><span class="gray platOrderStatus_status">订单标签：${temporayStr||''}</span><span ></span></div>
        //                          <div><span class="gray">订单状态：${d.platOrderStatus||""}
        //                              </span">
        //                          </div>
        //                          <div><span class="gray">打印面单状态：</span></div>
        //                          </div>`
        //                          }
        //                      },
        //             // },
        //             { title: '操作', toolbar: "#toAuditOrder_option_tpl", width: 100 }
        //         ]
        //     ],
        //     page: false,
        //     limit:2000,
        //     id: 'toAuditOrder_table',
        //     done: function(res) {
        //
        //         toAuditorderPage(data,res.count)
        //         var tab = $('#LAY-toAuditOrder #toAuditOrder_Tab').find('.layui-this')
        //         if(!isObjectValueEqual(data,toAudit_formdata)){
        //             getAllTabNum(data)
        //             toAudit_formdata = data
        //         }
        //         if (tab.length > 0) {
        //             tab.find('span').text(res.count)
        //         } else {
        //             $('#LAY-toAuditOrder #toAuditOrder_Tab').find('li[data-index="' + data.unAuditOrderStatus + '"]').addClass('layui-this').find('span').text(res.count)
        //         }
        //         var tbody = $('#toAuditOrder_table').next('.layui-table-view').find('.layui-table-body').find('tr[data-index=0]')
        //         // if (tbody.length > 0) {
        //         //     var ifBind = tbody.attr('data-ifBind')
        //         //     if (!ifBind) {
        //         //         setRowEvent('#toAuditOrder_table', '.toAuditOrder_col_id', 'click', function(dom) {
        //         //             if (!detailpopflag) {
        //         //                 var index = $(dom).attr('data-index')
        //         //                 toAuditOrderNewandEdit('2', res.data[index])
        //         //             }
        //         //         }, ['.copyTxt', '.doubleClickToSet', '.laytable-cell-checkbox', '.freeClickBox', '[data-edit]'])
        //         //         tbody.attr('data-ifBind', '1')
        //         //     }
        //         // }
        //     }
        // })
    }

    //渲染页面分页
    function toAuditorderPage(data,count){
        laypage.render({
            elem: 'toAuditOrderPage',
            curr: data.page,
            limit: data.limit,
            limits: [5000, 10000, 20000],
            layout: ['prev', 'page', 'next', 'count','limit'],
            count: count,
            jump: function(obj, first) {
                $('#toAuditOrderForm input[name="limit"]').val(obj.limit);//保障下次的分页请求中带有的值正确
                $('#toAuditOrderForm input[name="page"]').val(obj.curr);//保障下次的分页请求中带有的值正确
                //首次不执行
                if (!first) {
                    data.page = obj.curr;
                    data.limit = obj.limit;
                    $('#toAuditOrderSearch').click()
                }

            }
        });
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
            if ((propName!="unAuditOrderStatus")&&a[propName] !== b[propName]) {
                return false;
            }
        }
        return true;
    }

    //备注弹框
    function toAuditOrderRemark(data) {
        var tabIndex = 1
        layer.open({
            type: 1,
            title: '备注',
            btn: ['提交', '取消'],
            area: ['40%', '50%'],
            content: $('#pop_toAuditOrder_remark').html(),
            success: function(layero, index) {
                $(layero).find('#toauditOrderremarkTab').find('li').click(function(){
                    tabIndex = $(this).attr('data-index')
                })
                selectAppendDataThenRender($(layero).find('select[name="noteContent"]'),toAuditOrder_pageEnum.orderLabels, 'code', 'label')
                form.render()
                //回显备注内容-ztt
                layero.find('[name=noteContent]').val(data.pickNote || data.orderNote);
            },
            yes: function(index, layero) {
                form.on('submit(toAuditOrder_remark_submit)', function(obj) {
                    toAuditorderaddRemark(data.id, obj.field.noteContent, obj.field.notetype, function(returnData) {
                        layer.msg(returnData.msg || "修改备注成功")
                        layer.close(index)
                        $('#toAuditOrderSearch').click()
                    })
                })
                form.on('submit(toAuditorder_label_submit)', function(obj) {
                    toAuditorderAddLabel(data.id, obj.field.noteContent, function(returnData) {
                        layer.msg(returnData.msg || "修改标签成功")
                        layer.close(index)
                        $('#toAuditOrderSearch').click()
                    })
                })
                if(tabIndex=="1"){
                    $('#toAuditOrder_remark_submit').click()
                }else if(tabIndex=="2"){
                    $('#toAuditorder_label_submit').click()
                }
            }
        })
    }

    //修改订单
    function toAuditOrderNewandEdit(type, data) {
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
            area: ['90%', '80%'],
            // maxmin: true,
            move: false,
            id:'pop_toAuditOrder_newandeditorder_id',
            content: $('#pop_toAuditOrder_newandeditorder').html(),
            success: function(layero, index) {
                if(type == 1){
                    $(layero).find(".logHide").addClass('hide')
                    //ztt20230823-插入[下载模板][批量上传]按钮
                    let btnStr= `<div style="position: absolute;bottom: 14px;left: 10px;">
                    <span class="layui-btn layui-btn-sm" onclick="javascript: window.open('${ctx}/static/excel/批量导入订单模板.xlsx');">下载模板</span>
                    <span class="layui-btn layui-btn-sm" id="toAuditOrderBatchUpload">批量上传</span></div>`;
                    layero.append(btnStr);
                }else{
                    $(layero).find(".logHide").removeClass('hide')
                    //店铺单号platOrderId,平台platCode,店铺storeAcctId,站点siteId都不能编辑
                    layero.find('input[name=platOrderId]').prop('disabled', true);
                    layero.find('select[name=platCode]').removeAttr('lay-search').prop('disabled', true);
                    layero.find('select[name=storeAcctId]').removeAttr('lay-search').prop('disabled', true);
                    layero.find('select[name=siteId]').removeAttr('lay-search').prop('disabled', true);
                }
              commonOrderGetLogisticAjax().then(logisTypeArr => {
                var id = data?data.id:""
                var isSavable = $('#order_savebtn')
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
                appendSelect($('#toAuditOrder_editForm').find('select[name="platCode"]'), toAuditOrder_pageEnum.platCode, 'name', 'value')
                appendSelect($('#toAuditOrder_editForm').find('select[name="storeAcctId"]'), [], 'id', 'storeAcct','','salesSite')
                // appendSelect($('#toAuditOrder_editForm').find('select[name="platOrderStatusList"]'), toAuditOrder_platOrderStatus, 'platOrderStatus', 'platOrderStatus')
                appendSelect($('#toAuditOrder_editForm').find('select[name="warehouseId"]'), toAuditOrder_pageEnum.prodWarehouses, 'name', 'value')
                
                  appendSelect($('#toAuditOrder_editForm').find('select[name="logisTypeId"]'), logisTypeArr, 'id', 'name')
                  form.render('select');

                appendSelect($('#toAuditOrder_editForm').find('select[name="siteId"]'), toAuditOrder_Site, 'code', 'name')
                appendSelect($('#toAuditOrder_editForm').find('select[name="currency"]'), toAuditOrder_Currency, 'code', 'name')
                appendSelect($('#toAuditOrder_editForm').find('select[name="shippingCountryCode"]'), shippingCountryCodeList, 'shippingCountryCode', 'name')
                // 备注类型
                appendSelect($('#toAuditOrder_editForm').find('select[name="noteType"]'),toAuditOrder_pageEnum.orderLabels_toAuditOrder,'label', 'label')
                if (data) {
                    data.orderTimeCn = Format(data.orderTimeCn,'yyyy-MM-dd hh:mm:ss')
                    form.val("toAuditOrder_editForm", data);
                    let temArr = data.orderDetails? data.orderDetails[0] : {}
                    Selected($('#toAuditOrder_editForm select[name="platCode"]'), temArr.platCode)
                    getStoreByPlatformAndRoleName(temArr.platCode, function (returnData) {
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
                form.on('select(edit_storeAcct)', function(obj) {
                    toAuditOrderSiteByStore()
                })
                if (type === '2') {
                    // 修改订单
                    //监听物流方式下拉选择
                    form.on('select(edit_logisTypeId)', function(obj) {
                        $('#toAuditOrder_editForm input[name=logisTrackingNo]').val('')
                    })
                }
                //监听平台下拉选择
                form.on('select(edit_platCode)', function(obj) {
                    getStoreByPlatformAndRoleName(obj.value,function(returnData){
                        appendSelect($('#toAuditOrder_editForm').find('select[name="storeAcctId"]'), returnData.data, 'id', 'storeAcct','','salesSite')
                        form.render()
                    })
                    getAllSite(obj.value, function(returnData) {
                        appendSelect($('#toAuditOrder_editForm').find('select[name="siteId"]'), returnData.data, 'code', 'name')
                        form.render()
                    })
                })
                $('#toAuditOrder_addProducts').click(function() {
                    var orginaldata = data ? toAuditGetEditTableData(concatData, edit_order_tableIns) : []
                    var prodSku = $(this).siblings('input').val();
                    if (prodSku !== "") {
                        getProductList(prodSku, function(returnData) {
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
                $(layero).on('click','.refresh_icon',function() {
                    var dataArr = [];
                    var prodSSku = $(this).parents('tr').find('[data-field=prodSSku] input').val(),
                        prodQuantity = $(this).parents('tr').find('[data-field=prodQuantity] input').val(),
                        platOrderDetailAmt = $(this).parents('tr').find('[data-field=platOrderDetailAmt] input').val(),
                        warehouseId = $('#toAuditOrder_editForm').find('select[name="warehouseId"]').val();
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
              //监听批量上传按钮点击事件
              upload.render({
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
            yes: function(index, layero) {
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
                        if(!validOptions) {
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
                            let prodQuantity = 0
                            param.platOrderDetails.forEach(v => {
                                prodQuantity += v.prodQuantity * 1
                            })
                            $('#toAuditOrder_table').next().find('#toAudit_table_storeAcct').text($(layero).find('#edit_storeAcct option:selected').text())
                            $('#toAuditOrder_table').next().find('#toAudit_table_platOrderId').text(param.platOrderId)
                            $('#toAuditOrder_table').next().find('#toAudit_table_platOrderAmt').text(param.platOrderAmt)
                            $('#toAuditOrder_table').next().find('#toAudit_table_skuQuantity').text(param.platOrderDetails.length)
                            $('#toAuditOrder_table').next().find('#toAudit_table_prodQuantity').text(prodQuantity)
                            $('#toAuditOrder_table').next().find('#toAudit_table_shippingUsername').text(param.shippingUsername)
                            $('#toAuditOrder_table').next().find('#toAudit_table_buyerRequireShippingType').text(param.buyerRequireShippingType)
                            $('#toAuditOrder_table').next().find('#toAudit_table_orderTimeCn').text(Format(param.orderTimeCn || "", 'yyyy-MM-dd hh:mm:ss'))
                            $('#toAuditOrderSearch').click();
                            layer.close(index)
                        })
                    } else {
                        layer.msg('请添加商品')
                    }
                });
                $(layero).find('#edit_submit').click();
            },
            end:function(){
            }
        })
    }

    // 站点随店铺联动查询
    function toAuditOrderSiteByStore(initSiteId = "") {
        const siteStr = $("#toAuditOrder_editForm")
        .find('select[name="storeAcctId"] option:selected')
        .data().salessite
        const _site = siteStr ? siteStr.toString().split(",") : []
        const _platCode = $("#toAuditOrder_editForm")
        .find('select[name="platCode"]')
        .val()
        getAllSite(_platCode, function (returnData) {
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
    function toAuditProdTableRender(data) {
        data.forEach(item => {
            if(item.prodSSku == ''){
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
            done: function(res) {
                let newArr = delSameObjValue(layui.table.cache.toAuditOrder_product_table, 'allCount', ['prodSSku'], ['prodQuantity']);
                layui.table.cache.toAuditOrder_product_table.forEach((item,index) => {
                    newArr.forEach(cItem => {
                        if (item.prodSSku == cItem.prodSSku) {
                            item.allCount = cItem.allCount
                        }
                    })
                    $("#toAuditOrder_product_table").next().find(`tr[data-index=${index}] td[data-field=allCount] div`).text(res.data[index].allCount)
                })
                toAuditOrderStyle('toAuditOrder_product_table')
                imageLazyload();
                table.on("tool(toAuditOrder_product_table)", function(obj) {
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

    //监听排序
    table.on('sort(toAuditOrder_product_table)', function(obj) {
        toAuditOrderStyle('toAuditOrder_product_table')
    });
    //监听排序
    table.on('sort(toAuditOrder_demolition_original_table)', function(obj) {
        toAuditOrderStyle('toAuditOrder_demolition_original_table')
    });

    function toAuditOrderStyle(id){
        layui.table.cache[id].forEach((item,index) => {
            // 商品总量大于可用库存时，标红加粗
            if(item.allCount > item.availableStock && item.holdStock <= 0){
                id == 'toAuditOrder_demolition_original_table'?$("#" + id).next().find(`tr[data-index=${index}] td[data-field=platQuantity] div`).addClass('orderRedStyle'):'';
                id == 'toAuditOrder_demolition_original_table'?$("#" + id).next().find(`tr[data-index=${index}] td[data-field=prodQuantity] div`).addClass('orderRedStyle'):'';
                $("#" + id).next().find(`tr[data-index=${index}] td[data-field=availableStock] div`).addClass('orderRedStyle');
                $("#" + id).next().find(`tr[data-index=${index}] td[data-field=allCount] div`).addClass('orderRedStyle');
            }
            if(item.platQuantity == 0){
                id == 'toAuditOrder_demolition_original_table'?$("#" + id).next().find(`tr[data-index=${index}] td[data-field=platQuantity]`).css('background','#fab81c'):'';
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

    // 添加商品
    function toauditorderAddprod(data, func) {
        layer.open({
            type: 1,
            title: '添加商品',
            btn: ['添加商品', '关闭'],
            area: ['70%', '60%'],
            content: $('#pop_toAuditOrder_addProducts').html(),
            success: function(layero, index) {
                table.render({
                    elem: '#toAuditOrder_addProducts_table',
                    data: data.data,
                    cols: [
                        [
                            { checkbox: true, width: 30 },
                            { title: "图片", field: "imageUrl", templet: "#add_product_img" },
                            { title: "商品数量", templet: "#add_product_prodQuantity" },
                            { title: "销售金额", templet: "#add_product_platOrderDetailAmt" },
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
                    id: 'toAuditOrder_addProducts_table',
                    done: function(res) {
                        imageLazyload();
                    }
                })
            },
            yes: function(index, layero) {
                // var checkStatus = table.checkStatus('toAuditOrder_addProducts_table')
                // var callbackdata = checkStatus.data
                // var prodskus =""
                // prodskusArr = callbackdata.map(function(item) {
                //     return item.sSku
                // })
                // if(prodskusArr.length>0){
                //     prodskus = prodskusArr.join(',')
                // }
                var trs = layero.find('.layui-table-body tbody>tr');
                var dataArr = [];
                for (var i = 0; i < trs.length; i++){
                    var tr = trs[i];
                    if($(tr).find('.layui-unselect.layui-form-checkbox.layui-form-checked').length != 0){
                        var prodSSku = $(tr).find('[data-field="sSku"] div').text(),
                            prodQuantity = $(tr).find('input[name=prodQuantity]').val(),
                            platOrderDetailAmt = $(tr).find('input[name=platOrderDetailAmt]').val(),
                            warehouseId = $('#toAuditOrder_editForm').find('select[name="warehouseId"]').val();
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
    // 排序
    function sortBy(props) {
        return function(a,b) {
            return a[props] - b[props];
        }
    }

    // 原始订单拆单弹框
    function originOrderDemolimotion(data) {
        var isDemolitRow = []
        var orderDetails = data.orderDetails;
        data.orderDetails && data.orderDetails.sort(sortBy('availableStock'));
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
            success: function(layero, index) {
                demolitiontableIns = table.render({
                    elem: '#toAuditOrder_demolition_original_table',
                    data: data.orderDetails,
                    totalRow: true,
                    cols: [
                        [
                            { title: "商品信息", field: "prodSSku",sort:true, templet: "#orginal_order_products",width: 300 },
                            // { title: "可用库存", field: "itemId", templet: "#orginal_order_stock" },
                            { title: "子店铺单号", field: "platOrderItemId" },
                            { title: "子订单类型", field: "platOrderDetailType" },
                            { title: "子订单状态", field: "platOrderDetailStatus" },
                            { title: "总重量(g)", field: "prodWeight", templet: "#orginal_order_demolition", totalRow: true },
                            { title: "销售金额", field: "platOrderDetailAmt",totalRow: true},
                            { title: "物流属性", field: "prodLogisAttrList" },
                            { title: "sku重量(g)", field: "prodUnitWeight"},
                            { title: "可用库存", field: "availableStock",sort:true},
                            // ,templet: '#toAuditOrder_orginal_order_availableStock'
                            { title: "平台数量", field: "platQuantity"},
                            { title: "商品数量", field: "prodQuantity"},
                                // , templet: '#toAuditOrder_orginal_order_prodQuantity'
                            { title: "商品总量", field: "allCount",sort:true},
                            { title: "成本占比", templet: "#toAuditOrder_costRatio",width: 130 },
                                // , templet: '#toAuditOrder_orginal_order_allCount'
                            { title: "拆分数量", templet: "#orginal_order_number" },
                            { title: "拆分重量(g)", field: "prodSSkuWeight", templet: "#orginal_order_dynamicWeight", totalRow: true },
                            { title: "拆分金额", field: "splitCost", templet: "#orginal_order_dynamicMoney",totalRow: true },
                        ]
                    ],
                    height: 480,
                    page: true,
                    limit: 500,
                    limits: [200,500],
                    id: 'toAuditOrder_demolition_original_table',
                    done: function(res) {
                        let newArr = delSameObjValue(layui.table.cache.toAuditOrder_demolition_original_table, 'allCount', ['prodSSku'], ['prodQuantity']);
                        layui.table.cache.toAuditOrder_demolition_original_table.forEach((item,index) => {
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
                const turnToAbnormalOrderTag = $('#toAuditOrder_demolition_original_abnormal').prop('checked')
                const turnToAbnormalOrder = $('#toAuditOrder_demo_original_abnormal').prop('checked')
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
                        updateSingleRow_toAuditOrder(data.id)
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
                                // $('#toAuditOrderSearch').trigger('click');
                                updateSingleRow_toAuditOrder(data.id)
                            })
                            
                        }, 'application/x-www-form-urlencoded')
                    }else if(turnToAbnormalOrder){
                        initAjax('/abnormalorder/tocancel.html', 'post', { ids: res }, function (returnData) {
                            layer.close(index);
                            layui.admin.batchResultAlert(`拆除订单{${res}}已转至取消订单:`, returnData.data, function (errIdsArr) {
                                // $('#toAuditOrderSearch').trigger('click');
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
        for (let i = 0; i < $tr.length; i++){
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
            let companyFlag = ['SMT物流','虾皮','Lazada','Joom线上', '待处理订单'].includes(companyName)
            let turnToAbnormalOrder = $('#toAuditOrder_demo_original_abnormal').prop('checked')
            let platCount = $parentTr.find('td[data-field=platQuantity]>div').text() // 平台数量
            let itemCount = $parentTr.find('td[data-field=prodQuantity]>div').text() // 商品数量
            if (event.target.value == '') return
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

    //详情弹框
    function toAuditOrderDetail(data) {
        layer.open({
            type: 1,
            title: '详情',
            btn:['关闭'],
            area: ['90%', '40%'],
            btnAlign: 'l',
            maxmin: true,
            content: $('#pop_toAuditOrder_detail').html(),
            success: function(layero, index) {
                detailpopflag = true
                table.render({
                    elem: '#toAuditOrder_detail_table',
                    method: 'POST',
                    data: data.orderDetails,
                    cols: [
                        [
                            { title: "图片", field: "imageUrl", templet: "#toAuditOrder_detail_img_tpl" },
                            { title: "Listing_ID", field: "itemId"},
                            { title: "店铺SKU", field: "storeSSku" },
                            { title: "商品SKU", field: "prodSSku" },
                            { title: "库位", field: "stockLocation" },
                            { title: "商品名称", field: "prodTitle" },
                            { title: "入库要求", field: "packDesc" },
                            { title: '款式', field: "style" },
                            { title: '可用库存', field: "availableStock" },
                            { title: '商品成本(￥)', field: "prodUnitCost" },
                            { title: '商品净重(g)', field: "prodUnitWeight" },
                            { title: '报关信息', field: "style" },
                            { title: '销售单价', field: "platUnitPrice", templet:"<div><span class='gray'>{{d.currency||''}}</span> {{d.platUnitPrice}}</div>"},
                            { title: '销售数量', field: "platQuantity" },
                            { title: '销售金额', field: "platOrderDetailAmt", templet:"<div><span class='gray'>{{d.currency||''}}</span> {{d.platOrderDetailAmt}}</div>"}
                        ]
                    ],
                    page: false,
                    limit:500,
                    id: 'toAuditOrder_detail_table',
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


    //平台操作
    $("#toAuditOrder_cancelOrderEbay").click(function () {
        //获取选中的订单id
        // var checkStatus = table.checkStatus('toAuditOrder_table')
        // var data = checkStatus.data
        let data = gridOptions.api.getSelectedRows();
        var ids = (data || []).map(function(item) {
            return item.id
        })
        if(!ids || ids.length<=0){
            layer.msg("未选择订单",{icon:0});
            return;
        }
        layer.open({
            type: 1,
            title: '取消ebay订单',
            btn: ['确认','取消'],
            content: "loading",
            success: function(layero, index) {
                $(layero).find('.layui-layer-content').html($("#toAuditOrder_cancelEbayTpl").html());
                layui.form.render();
            },
            yes: function(index, layero) {
                var cancelReason = $("#toAuditOrder_cancelEbayForm input[name=cancelReason]:checked").val();
                //ebay取消订单
                initAjax('/unauditorder/cancelorder/ebay.html', 'post', { ids:ids.join(","),cancelReason:cancelReason }, function(returnData) {
                    layui.admin.batchResultAlert("ebay取消订单完成:",returnData.data,function(errIdsArr){
                        deleteTableRow_toAuditOrder(ids,errIdsArr)
                        // zttCommonRemoveDataHandle({
                        //     selectedIds: ids,
                        //     gridOptions: gridOptions,
                        //     tableData: immutableStore,
                        //     errIds: errIdsArr
                        // }).then(newObj => {
                        //     let { newData, successIds } = newObj;
                        //     // immutableStore = newData;
                        //     let oldNum = $('#toAuditOrder_Tab ul li.layui-this>span').text();
                        //     let newNum = oldNum - successIds.length;
                        //     $('#toAuditOrder_Tab ul li.layui-this>span').text(newNum);
                        //     $('#toAuditOrderPage .layui-laypage-count').text(`共 ${newNum} 条`);
                        // });
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

    //获取选择的订单id
    function getTableSelectIds(){
        // var checkStatus = table.checkStatus('toAuditOrder_table')
        // var data = checkStatus.data
        let data = gridOptions.api.getSelectedRows();
        var ids = (data || []).map(function(item) {
            return item.id
        });
        return ids;
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
        $('#toAuditOrder_Tab ul').append(html)
    }

    //填充下拉框
    function appendSelect(aDom, data, code, label, attachment,otherAttr) {
        aDom.empty();
        var option = '<option value="">请选择</option>'
        for (var i in data) {
            if (typeof data[i] !== 'string') {
                attachment ?
                    data[i].code = data[i][code] + '_' + data[i][attachment] :
                    data[i].code = data[i][code].toString() || data[i].code
                data[i].label = data[i][label] || data[i].label;
            }
            const _otherAttr=otherAttr?`data-${otherAttr}="${data[i][otherAttr]}"`:''
            option += '<option '+_otherAttr+' value="' + (typeof data[i].code!='undefined'?data[i].code:data[i]) + '">' + (data[i].label || data[i]) + '</option>'
        }
        if(Array.isArray(data)){
            let acctIds = data.map(item=> item.code !== undefined ? item.code : item)
            aDom.attr('acct_ids', acctIds.join(','))
        }
        aDom.append(option)
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

    function Selected(aDom, value) {
        var options = aDom.find('option');
        options.each(function(index,item){
            if(item.value==value){
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

function toAuditBuyerTipsShow(dom){
    const contentshow = $(dom).attr('data-text');
    if(contentshow){
        let contentshowArr = contentshow.split('\n');
        layui.layer.tips(`<span style="color:#008B8B">${contentshowArr.join('<br>')}</span>`, $(dom), {
            tips: [1, '#fff'],
            time: 0,
        });
    }
}

function toAuditBuyerTranslateTipsShow(dom, event) {
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

function toAuditBuyerTipsShowTable(dom){
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
function toAuditBuyerTipsHide(){
    layui.layer.closeAll("tips");
}
function toAuditOrderProfitTipsShow(dom){
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
function toAuditOrderProfitTipsHide(){
    layui.layer.closeAll("tips");
}
