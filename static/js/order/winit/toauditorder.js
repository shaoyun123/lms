//海外仓待审核订单js
layui.use(['form', 'table', 'layer', 'element', 'laypage', 'upload', 'tableMerge', 'laydate', 'formSelects'], function() {
    var form = layui.form,
        table = layui.table,
        element = layui.element,
        laydate = layui.laydate,
        formSelects = layui.formSelects,
        laypage = layui.laypage;
    layer = layui.layer;
    detailpopflag = false;
    form.render('select');
    var toAuditorderWinit_pageEnum = null,
        toAuditorderWinit_company = null,
        toAuditorderWinit_allstore = null,
        toAuditorderWinit_logisType = null,
        toAuditorderWinit_Site = null,
        toAuditorderWinit_Currency = null,
        toAudit_formdata = {},
        toAuditorderWinit_companyType = "";
    laydate.render({
        elem: '#toAuditorderWinit_time',
        type: 'date',
        range: true
    });

    formSelects.render('storeAcct', { placeholder: '请先选择平台' });
    //渲染平台标记
    toauditorderWinit_renderPlatCodeMark();
    function toauditorderWinit_renderPlatCodeMark () {
        commonReturnPromise({
            url: '/lms/platorder/winit/listenum.html'
        }).then(res => {
            let { platTagList } = res;
            commonRenderSelect('toauditorderWinit_platTags', platTagList).then(() => {
                formSelects.render('toauditorderWinit_platTags');
            });
        });
    }

    var nowdate = new Date()
    var endDate = Format(new Date(), 'yyyy-MM-dd')
    var onemonth = Format(new Date(nowdate - 30 * 24 * 3600 * 1000), 'yyyy-MM-dd')
    $('#toAuditorderWinit_time').val(onemonth + ' - ' + endDate)


    render_hp_orgs_users("#toAuditWinitOrder_storeSalesPersonDiv");
    render_hp_orgs_users("#toAuditWinitOrder_winitSalesPersonDiv");

    // 展示和隐藏 更多查询条件
    $('#toAuditWinitOrder_showMoreSearchCondition').click(function() {
        var self = this
        if ($(self).hasClass('showExternal')) {
            $(self).closest('.layui-form').find('.externalContainAuditorderWinit').hide()
            $('#hide_icon_toauditorderWinit').show()
            $('#show_icon_toauditorderWinit').hide()
            $(self).removeClass('showExternal')
            toAuditWinitOrderHasValue ('toAuditorderWinitForm', 'toAuditWinitOrder_showMoreSearchCondition')
        } else {
            $(self).closest('.layui-form').find('.externalContainAuditorderWinit').show()
            $('#hide_icon_toauditorderWinit').hide()
            $('#show_icon_toauditorderWinit').show()
            $(self).addClass('showExternal')
        }
    })


    function toAuditWinitOrderHasValue (formId, btnId) {
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

    element.on('tab(toAuditorderWinit_Tab)', function(data) {
        var unAuditOrderStatus = data.elem.context.dataset.index
        $('#toAuditorderWinitForm input[name="unAuditOrderStatus"]').val(unAuditOrderStatus)
        $('#toAuditWinitOrderSearch').click()
    });
    //更新法属国信息
    $('#LAY-toAuditOrderWinit #toAuditOrderWinit_updateCountry').click(function() {
            var checkStatus = table.checkStatus('toAuditorderWinit_table')
            var data = checkStatus.data
            var ids = (data || []).map(function(item) {
                return item.id
            })
            if (ids.length > 0) {
                updateOwnerContry(ids)
            } else {
                layer.msg('请选择订单', { icon: 7 });
            }
        })
        //更新商品信息
    $('#LAY-toAuditOrderWinit #toAuditOrderWinit_updateProducts').click(function() {
        var checkStatus = table.checkStatus('toAuditorderWinit_table')
        var data = checkStatus.data
        var ids = (data || []).map(function(item) {
            return item.id
        })
        if (ids.length > 0) {
            updateProducts(ids)
        } else {
            layer.msg('请选择订单', { icon: 7 });
        }
    });
    //拆分组合品
    $('#LAY-toAuditOrderWinit #toAuditOrderWinit_splitCompSku').click(function() {
        var checkStatus = table.checkStatus('toAuditorderWinit_table')
        var data = checkStatus.data
        var ids = (data || []).map(function(item) {
            return item.id
        })
        if (ids.length > 0) {
            splitCompSku(ids)
        } else {
            layer.msg('请选择订单', { icon: 7 });
        }
    });
    //合并组合品
    $('#LAY-toAuditOrderWinit #toAuditOrderWint_mergeCompSku').click(function() {
            var checkStatus = table.checkStatus('toAuditorderWinit_table')
            var data = checkStatus.data
            var ids = (data || []).map(function(item) {
                return item.id
            })
            if (ids.length > 0) {
                mergeCompSku(ids)
            } else {
                layer.msg('请选择订单', { icon: 7 });
            }
        })
        //匹配物流
    $('#LAY-toAuditOrderWinit #toAuditOrderWinit_matchLogis').click(function() {
        var checkStatus = table.checkStatus('toAuditorderWinit_table')
        var data = checkStatus.data
        var ids = (data || []).map(function(item) {
            return item.id
        })
        if (ids.length > 0) {
            matchLogis(ids)
        } else {
            layer.msg('请选择订单', { icon: 7 });
        }
    })

    //库存占用规则
    $('#toAuditOrderWinit_holdStockTask').click(function() {
        layer.confirm('根据库存占用规则对缺货、待派单订单进行库存占用', function(result) {
            if (result) {
                initAjax('/platorder/winit/holdstocktask.html', 'post', {}, function(returnData) {
                    layui.admin.batchResultAlert("订单重新走库存占用规则:", returnData.data, function() {
                        $('#toAuditWinitOrderSearch').click();
                    });
                }, 'application/x-www-form-urlencoded');
            }
        });
    });

    //标记发货
    $('#LAY-toAuditOrderWinit #toAuditOrderWinit_markDelivery').click(function() {
        var checkStatus = table.checkStatus('toAuditorderWinit_table')
        var data = checkStatus.data
        var ids = (data || []).map(function(item) {
            return item.id
        })
        if (ids.length > 0) {
            markDelivery(ids)
        } else {
            layer.msg('请选择订单', { icon: 7 });
        }
    })

    //审核订单
    $('#LAY-toAuditOrderWinit #toAuditOrderWinit_auditOrder').click(function() {
            var checkStatus = table.checkStatus('toAuditorderWinit_table')
            var data = checkStatus.data
            var ids = (data || []).map(function(item) {
                return item.id
            })
            if (ids.length > 0) {
                toAuditOrderBatch(ids)
            } else {
                layer.msg('请选择订单', { icon: 7 });
            }
        })
        //标记异常订单
    $('#LAY-toAuditOrderWinit #toAuditOrderWinit_markException').click(function() {
        var checkStatus = table.checkStatus('toAuditorderWinit_table')
        var data = checkStatus.data
        var ids = (data || []).map(function(item) {
            return item.id
        })
        if (ids.length > 0) {
            markException(ids)
        } else {
            layer.msg('请选择订单', { icon: 7 });
        }
    });

    //直接转已发货
    $('#LAY-toAuditOrderWinit #toAuditOrderWinit_toShipped').click(function() {
        var checkStatus = table.checkStatus('toAuditorderWinit_table')
        var data = checkStatus.data
        var ids = (data || []).map(function(item) {
            return item.id
        })
        if (ids.length > 0) {
            toShipped(ids)
        } else {
            layer.msg('请选择订单')
        }
    });

    //同步订单状态 
    $('#LAY-toAuditOrderWinit #toAuditOrderWinit_syncOrderStatus').click(function() {
        var checkStatus = table.checkStatus('toAuditorderWinit_table')
        var data = checkStatus.data
        var ids = (data || []).map(function(item) {
            return item.id
        })
        if (ids.length > 0) {
            syncOrderStatus(ids)
        } else {
            layer.msg('请选择订单', { icon: 7 });
        }
    })

    //新增订单
    $('#LAY-toAuditOrderWinit #toAuditOrderWinit_newOrder').click(function() {
            toAuditOrderNewandEdit('1', null)
        })
        //转取消订单
    $('#toAuditOrderWinit_toCancel').click(function() {
        let ids = getTableSelectIds();
        if (!ids || ids.length < 1) {
            layer.msg('请选择订单', { icon: 7 });
            return;
        }
        initAjax('/platorder/winit/tocancel.html', 'post', { ids: ids.join(",") }, function(returnData) {
            layui.admin.batchResultAlert("转取消订单:", returnData.data, function() {
                $('#toAuditWinitOrderSearch').click();
            });
        }, 'application/x-www-form-urlencoded');
    });
    //重新分仓
    $('#toAuditOrderWinit_reMatchWarehouseType').click(function() {
        let ids = getTableSelectIds();
        if (!ids || ids.length < 1) {
            layer.msg('请选择订单', { icon: 7 });
            return;
        }
        layer.confirm('选中订单重新匹配分仓处理?', function(index) {
            initAjax('/unauditorder/winit/rematchwarehousetype.html', 'post', { ids: ids.join(",") }, function(returnData) {
                layui.admin.batchResultAlert("匹配分仓:", returnData.data, function() {
                    $('#toAuditWinitOrderSearch').click();
                });
            }, 'application/x-www-form-urlencoded');
        })

    });
    //指定仓库类型
    $('#toAuditOrderWinit_appointWarehouseType').click(function() {
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
            success: function(layero, index) {
                $(layero).find('.layui-layer-content').html($("#toAuditorderWinit_appointWarehouseTypeTpl").html());
                layui.form.render("radio");
            },
            yes: function(index, layero) {
                let warehouseType = $("#toAuditorderWinit_appointWarehouseTypeForm input[name=warehouseType]:checked").val();
                initAjax('/unauditorder/winit/appointwarehousetype.html', 'post', { ids: ids.join(","), warehouseType: warehouseType }, function(returnData) {
                    layui.admin.batchResultAlert("重新指定仓库类型:", returnData.data, function() {
                        $('#toAuditWinitOrderSearch').click();
                    });
                    layer.close(index);
                }, 'application/x-www-form-urlencoded')
            }
        })
    });
    // //取消wishpost订单
    // $('#LAY-toAuditOrderWinit #toAuditorderWinit_cancelWishpost').click(function() {
    //     var checkStatus = table.checkStatus('toAuditorderWinit_table')
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
    //             $(layero).find('.layui-layer-content').html($("#toAuditorderWinit_cancelWishpostTpl").html());
    //             layui.form.render();
    //         },
    //         yes: function(index, layero) {
    //             var cancelReasonCode = $("#toAuditorderWinit_cancelWishpostForm select[name=cancelReasonCode]").val();
    //             var invalidReason = $("#toAuditorderWinit_cancelWishpostForm input[name=invalidReason]").val();
    //             //取消wishpost物流单
    //             initAjax('/platorder/cancelwishpost.html', 'post', { ids:ids,cancelReasonCode:cancelReasonCode,invalidReason:invalidReason }, function(returnData) {
    //                 let str = returnData.data.join("<br>");
    //                 layer.alert(str);
    //                 //处理完成后刷新页面
    //                 $('#toAuditWinitOrderSearch').click();
    //                 layer.close(index);
    //             }, 'application/x-www-form-urlencoded')
    //         }
    //     })
    //
    // })



    // 表单提交
    form.on('submit(toAuditWinitOrderSearch)', function(data) {
        if (data.field.time) {
            data.field.orderTimeStart = data.field.time.split(' - ')[0] + ' 00:00:00';
            data.field.orderTimeEnd = data.field.time.split(' - ')[1] + ' 23:59:59';
        }
        if (data.field.skuType) {
            data.field[data.field.skuType] = data.field.skuvalue
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
            if ($("#toAuditorderWinitForm select[name=company]").val()) {
                let logisTypeIds = [];
                $("#toAuditorderWinitForm select[name=logisTypeIds] option").each(function() {
                    let logisTypeId = $(this).attr("value");
                    if (logisTypeId && logisTypeId != 0) {
                        logisTypeIds.push(logisTypeId);
                    }
                });
                data.field.logisTypeIds = logisTypeIds.join(",");
            }
        }
        toAuditOrderTableorder(data.field)
    });

    //监听平台下拉选择
    form.on('select(toauditwinitplatCodes)', function(obj) {
        getStoreByPlatform(obj.value, function(returnData) {
            appendSelect($('#toAuditorderWinitForm').find('select[_name="storeAcctIds"]'), returnData.data, 'id', 'storeAcct')
        })
    })

    //监听公司下拉选择
    form.on('select(toauditwinitcompanyType)', function(obj) {
            toAuditorderWinit_companyType = obj.value
            appendSelect($('#toAuditorderWinitForm').find('select[name="company"]'), toAuditorderWinit_company[toAuditorderWinit_companyType],'id', 'cnName')
            form.render()
        })
        //监听物流公司下拉选择
    form.on('select(toauditwinitcompany)', function(obj) {
        var agent = "",
            logisticsCompanyId = "";
        toAuditorderWinit_companyType === 'agents' ? agent = obj.value : logisticsCompanyId = obj.value
        getAllLogicsType(agent, logisticsCompanyId)
        form.render()
    })


    //监听工具栏操作
    table.on("tool(toAuditorderWinit_table)", function(obj) {
        var event = event ? event : window.event;
        event.stopPropagation();
        var data = obj.data
        if (obj.event === "toAuditorderWinit_remark") { //备注
            toAuditOrderRemark(data)
        } else if (obj.event === "toAuditorderWinit_modify") { //编辑订单
            toAuditOrderNewandEdit('2', data)
        } else if (obj.event === "toAuditorderWinit_demolition") { //拆单
            if (data.operOrderType == "0") { //原始订单
                originOrderDemolimotion(data)
            } else if (data.operOrderType == "1") { //拆出订单，不允许拆单
                //layer.msg('当前订单为拆出订单，不允许再拆单', {icon:0})
                originOrderDemolimotion(data)
            } else if (data.operOrderType == "2") { //合并拆单，只能恢复合并前订单
                layer.confirm('当前订单为合并订单，是否恢复原订单?', function(index) {
                    mergeDemolition(data.id)
                })
            }
        } else if (obj.event === "toAuditorderWinit_sendEmail") { //发送邮件
            orderWinitSendEmail(data.id, data.platCode, function() {});
        } else if (obj.event === "toAuditorderWinit_issueRefund") { //
            orderIssueRefund(data, function() {});
        }
    });

    getPageEnum();
    getAllCompanies();
    getStoreByPlatform('', function(returnData) {
        toAuditorderWinit_allstore = returnData.data
    });
    getAllLogicsType('', '', function(returnData) {
        toAuditorderWinit_logisType = returnData.data
    });
    getAlldevEmployee();
    getAllpurchaseEmployee();
    getAllSite();
    getCurrencyEnums();
    let platOper = new dropButton('toAuditOrderWinit_platOper');
    let editOrder = new dropButton('toAuditOrderWinit_editOrder');
    let dealOrder = new dropButton('toAuditOrderWinit_dealOrder');



    // 页面数据请求----------------------------------------
    //  获取页面枚举数
    function getPageEnum() {
        initAjax('/platorder/winit/listenum.html', 'post', {}, function(returnData) {
            toAuditorderWinit_pageEnum = returnData.data
            toAuditorderWinit_pageEnum.platCode = toAuditorderWinit_pageEnum.platCodes
            toAuditorderWinit_pageEnum.prodLogisAttrs = toAuditorderWinit_pageEnum.logisAttrs
            toAuditorderWinit_pageEnum.shippingCountryCodes = toAuditorderWinit_pageEnum.shippingCountrys
            toAuditorderWinit_pageEnum.warehouseId = toAuditorderWinit_pageEnum.prodWarehouses
            for (var i in returnData.data) {
                appendSelect($('#toAuditorderWinitForm').find('select[name="' + i + '"]'), returnData.data[i], 'name', 'value')
                appendSelect($('#toAuditorderWinitForm').find('select[_name="' + i + '"]'), returnData.data[i], 'name', 'value')
                if (i === 'unAuditOrderStatus') {
                    appendTab(returnData.data[i])
                }
            }
            form.render()
            formSelects.render()
        })
    }
    //获取所有物流公司以及货代公司
    function getAllCompanies() {
        initAjax('/platorder/winit/listcompanyandagent.html', 'post', {}, function(returnData) {
            toAuditorderWinit_company = returnData.data
            appendSelect($('#toAuditorderWinitForm').find('select[name="company"]'), returnData.data.companys, 'id', 'cnName')
            form.render()
        })
    }

    //获取所有物流方式
    function getAllLogicsType(agent, logisticsCompanyId, func) {
        var obj = {};
        if (agent == '' && logisticsCompanyId != '') {
            obj.logisticsCompanyId = logisticsCompanyId;
        }
        if (logisticsCompanyId == '' && agent != '') {
            obj.agent = agent;
        }
        if (agent == '' && logisticsCompanyId == '') {
            obj = {};
        }
        initAjax('/platorder/winit/listlogistype.html', 'get', obj, function(returnData) {
            if (func) {
                func(returnData)
            }
            // returnData.data.unshift({id:0,name:"空"});
            // appendSelect($('#toAuditorderWinitForm').find('select[name="logisTypeIds"]'), returnData.data, 'id', 'name')
            commonRenderSelect('toauditorder_logisTypeIds', returnData.data, {
                name: 'name',
                code: 'id'
            }).then(function() {
                formSelects.render();
            });
        })
    }

    //根据平台code获取店铺列表
    function getStoreByPlatform(platcode, func) {
        initAjax('/sys/listStoreForRenderHpStoreCommonComponent.html', 'post', { platCode: platcode,roleNames: `${platcode}专员`, }, function(returnData) {
            if (func) {
                func(returnData)
            }
        }, 'application/x-www-form-urlencoded')
    }

    //获取所有开发专员
    function getAlldevEmployee() {
        initAjax('/sys/prodOwnerList.html', 'post', {}, function(returnData) {
            appendSelect($('#toAuditorderWinitForm').find('select[name="preprodDevId"]'), returnData.data, 'id', 'loginName')
            form.render()
        })
    }

    //获站点接口
    function getAllSite(platCode, func) {
        initAjax('/enum/getSiteEnum.html?platCode=' + platCode, 'post', {}, function(returnData) {
            toAuditorderWinit_Site = returnData.data
            if (func) {
                func(returnData)
            }
        }, 'application/x-www-form-urlencoded')
    }

    //获取币种枚举
    function getCurrencyEnums() {
        initAjax('/sysdict/getCurrencyEnums.html', 'post', {}, function(returnData) {
            toAuditorderWinit_Currency = returnData.data
        })
    }

    //更新法属国
    function updateOwnerContry(ids) {
        var ids = ids.join(',')
        initAjax('/unauditorder/updatefrinfo.html', 'post', { ids: ids }, function(returnData) {
            layer.msg(returnData.msg || '更新法属国成功')
            $('#toAuditWinitOrderSearch').click()
        }, 'application/x-www-form-urlencoded')
    }

    //更新商品信息
    function updateProducts(ids) {
        var ids = ids.join(',')
        initAjax('/unauditorder/updateprodinfo.html', 'post', { ids: ids }, function(returnData) {
            layer.msg(returnData.msg || '更新商品信息成功')
            $('#toAuditWinitOrderSearch').click()
        }, 'application/x-www-form-urlencoded')
    }
    //拆分组合品
    function splitCompSku(ids) {
        var ids = ids.join(',')
        initAjax('/unauditorder/splitcompsku.html', 'post', { ids: ids }, function(returnData) {
            var html = '拆分订单组合品:<br/>'
            for (var i in returnData.data) {
                html += returnData.data[i] + '<br/>'
            }
            layer.alert(html)
                //重新搜索
            $('#toAuditWinitOrderSearch').click()
        }, 'application/x-www-form-urlencoded')
    }
    //合并订单为组合品
    function mergeCompSku(ids) {
        var ids = ids.join(',')
        initAjax('/unauditorder/mergecompsku.html', 'post', { ids: ids }, function(returnData) {
            var html = '合并订单为组合品:<br/>'
            for (var i in returnData.data) {
                html += returnData.data[i] + '<br/>'
            }
            layer.alert(html)
                //重新搜索
            $('#toAuditWinitOrderSearch').click()
        }, 'application/x-www-form-urlencoded')
    }


    // 匹配物流
    function matchLogis(ids) {
        initAjax('/platorder/winit/matchlogistype.html', 'post', { ids: ids.join(',') }, function(returnData) {
            layui.admin.batchResultAlert("匹配物流完成:", returnData.data, function() {
                $('#toAuditWinitOrderSearch').click();
            });
        }, 'application/x-www-form-urlencoded')
    }

    /**
     * 同步订单状态
     * @param {订单号} ids 
     */
    function syncOrderStatus(ids) {
        var ids = ids.join(',')
        initAjax('/platorder/winit/syncplatstatus.html', 'post', { ids: ids }, function(returnData) {
            layui.admin.batchResultAlert("同步订单状态:", returnData.data, function() {
                $('#toAuditWinitOrderSearch').click();
            });
        }, 'application/x-www-form-urlencoded')
    }

    /**
     * 审核订单
     * @param {订单号} ids 
     */
    function toAuditOrderBatch(ids) {
        var ids = ids.join(',')
        initAjax('/unauditorder/winit/markaudit.html', 'post', { ids: ids }, function(returnData) {
            layui.admin.batchResultAlert("审核订单:", returnData.data, function() {
                $('#toAuditWinitOrderSearch').click();
            });
        }, 'application/x-www-form-urlencoded')
    }

    /**
     * 标记发货
     * @param {订单号} ids 
     */
    function markDelivery(ids) {
        var ids = ids.join(',')
        initAjax('/platorder/winit/markplatshipping.html', 'post', { ids: ids }, function(returnData) {
            layui.admin.batchResultAlert("标记平台发货:", returnData.data, function() {
                $('#toAuditWinitOrderSearch').click();
            });
        }, 'application/x-www-form-urlencoded')
    }

    /**
     * 标记异常
     * @param {订单号} ids 
     */
    function markException(ids) {
        initAjax('/platorder/winit/markabnormal.html', 'post', { ids: ids.join(',') }, function(returnData) {
            layui.admin.batchResultAlert("订单标记异常:", returnData.data, function() {
                $('#toAuditWinitOrderSearch').click();
            });
        }, 'application/x-www-form-urlencoded')
    }
    /**
     * 直接转已发货
     * @param {订单号} ids
     */
    function toShipped(ids) {
        initAjax('/platorder/winit/toshipped.html', 'post', { ids: ids.join(',') }, function(returnData) {
            layui.admin.batchResultAlert("直接转已发货:", returnData.data, function() {
                $('#toAuditWinitOrderSearch').click();
            });
        }, 'application/x-www-form-urlencoded')
    }



    //获取所有采购专员
    function getAllpurchaseEmployee() {
        initAjax('/sys/buyerList.html', 'post', {}, function(returnData) {
            appendSelect($('#toAuditorderWinitForm').find('select[name="purchasingAgentId"]'), returnData.data, 'id', 'loginName')
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

    // 提交绑定订单标签
    function toAuditorderAddLabel(id, noteContent, func) {
        initAjax('/unauditorder/addorderlabel.html', 'post', { id, noteContent }, function(returnData) {
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

    //原始订单拆单
    function orginalDemolition(id, orderSplitDetailDtos) {
        initAjax('/platorder/winit/splitorder.html', 'post', JSON.stringify({ id: id, orderSplitDetailDtos: orderSplitDetailDtos }), function(returnData) {
            layer.msg(returnData.msg || '拆单成功', )
        })
    }

    //合并订单拆单
    function mergeDemolition(id) {
        initAjax('/platorder/winit/splitmergeorder.html', 'post', { id: id }, function(returnData) {
            layer.msg(returnData.msg || '拆单成功')
        }, 'application/x-www-form-urlencoded')
    }

    // 根据商品sku获取商品信息
    function getProdInfoByprodsku(prodSSkus, func) {
        initAjax('/platorder/winit/listprodinfo.html?registerSkus=' + prodSSkus, 'get', {}, function(returnData) {
            if (func) {
                func(returnData)
            }
        })
    }

    // 获取所有页签数量
    function getAllTabNum(data) {
        initAjax('/unauditorder/winit/statuscount.html', 'post', data, function(returnData) {
            for (var i in returnData.data) {
                $('#LAY-toAuditOrderWinit #toAuditorderWinit_Tab').find('li[data-index="' + i + '"]').find('span').text(returnData.data[i])
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
        initAjax('/platorder/winit/getProdsWinit.html', 'post', { registerSkus: sSku }, function(returnData) {
            if (func) {
                func(returnData)
            }
        }, 'application/x-www-form-urlencoded')
    }

    //保存修改新增待审核订单
    function savetoAuditOrders(data, func) {
        initAjax('/unauditorder/winit/saveorder.html', 'post', JSON.stringify(data), function(returnData) {
            if (func) {
                func(returnData)
            }
        })
    }

    //渲染表格数据
    function toAuditOrderTableorder(data) {
        table.render({
            elem: '#toAuditorderWinit_table',
            method: 'POST',
            url: ctx + '/unauditorder/winit/listorder.html',
            where: data,
            cols: [
                [
                    { checkbox: true, width: 30 },
                    { title: "订单号", field: "id", templet: "#toAuditorderWinit_id_tpl" },
                    { title: "订单金额", field: "platOrderAmt", templet: "#toAuditorderWinit_platOrderAmt_tpl", width: 120 },
                    { title: "商品", field: "prodQuantity", templet: "#toAuditorderWinit_prodQuantity_tpl" },
                    { title: "收件人", field: "shippingUsername", templet: "#toAuditorderWinit_shippingUsername_tpl" },
                    { title: "物流", field: "logisTypeName", templet: '#toAuditorderWinit_logisTypeName_tpl' },
                    { title: "时间", field: "time", templet: "#toAuditorderWinit_time_tpl" },
                    { title: "标签备注", field: "time", templet: "#toAuditorderWinit_remark_tpl" },
                    { title: "状态", field: "platOrderStatus", templet: "#toAuditorderWinit_platOrderStatus_tpl" },
                    { title: '操作', toolbar: "#toAuditorderWinit_option_tpl", width: 100 }
                ]
            ],
            page: false,
            limit: 500,
            id: 'toAuditorderWinit_table',
            created: function(res) {
                var data = res.data
                for (var item of data || []) {
                    item.storeskuview = item.orderDetails.map(function(item) {
                        var storesku = item.storeSSku + '*' + item.platQuantity
                        return storesku
                    });
                    item.itemIds = item.orderDetails.map(function(item) {
                        return '<a href="https://www.ebay.com/itm/' + item.itemId + '" target="_blank">' + item.itemId + '</a>';
                    })
                    item.itemIds = Array.from(new Set(item.itemIds));
                }
            },
            done: function(res) {
                toAuditorderWinitPage(data, res.count)
                var tab = $('#LAY-toAuditOrderWinit #toAuditorderWinit_Tab').find('.layui-this')
                if (!isObjectValueEqual(data, toAudit_formdata)) {
                    getAllTabNum(data)
                    toAudit_formdata = data
                }
                if (tab.length > 0) {
                    tab.find('span').text(res.count)
                } else {
                    $('#LAY-toAuditOrderWinit #toAuditorderWinit_Tab').find('li[data-index="' + data.unAuditOrderStatus + '"]').addClass('layui-this').find('span').text(res.count)
                }
                // var tbody = $('#toAuditorderWinit_table').next('.layui-table-view').find('.layui-table-body').find('tr[data-index=0]')
                // if (tbody.length > 0) {
                //     var ifBind = tbody.attr('data-ifBind')
                // if (!ifBind) {
                // setRowEvent('#toAuditorderWinit_table', '.toAuditorderWinit_col_id', 'click', function(dom) {
                //     if (!detailpopflag) {
                //         var index = $(dom).attr('data-toAuditOrderNewandEditindex')
                //         ('2',res.data[index])
                //     }
                // }, ['.copyTxt', '.doubleClickToSet', '.laytable-cell-checkbox', '.freeClickBox', '[data-edit]'])
                // tbody.attr('data-ifBind', '1')
                // }
                // }
            }
        })
    }

    // 渲染页面分页
    function toAuditorderWinitPage(data, count) {
        laypage.render({
            elem: 'toAuditorderWinitPage',
            curr: data.page,
            limit: data.limit,
            limits: [100, 200, 500, 3000],
            layout: ['prev', 'page', 'next', 'count', 'limit'],
            count: count,
            jump: function(obj, first) {
                $('#toAuditorderWinitForm input[name="limit"]').val(obj.limit); //保障下次的分页请求中带有的值正确
                $('#toAuditorderWinitForm input[name="page"]').val(obj.curr); //保障下次的分页请求中带有的值正确
                //首次不执行
                if (!first) {
                    data.page = obj.curr;
                    data.limit = obj.limit;
                    $('#toAuditWinitOrderSearch').click()
                }
            }
        });
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
            if ((propName != "unAuditOrderStatus") && a[propName] !== b[propName]) {
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
            content: $('#pop_toAuditorderWinit_remark').html(),
            success: function(layero, index) {
                $(layero).find('textarea').val(data.orderNote)
                $(layero).find('#toauditOrderwinitremarkTab').find('li').click(function() {
                    tabIndex = $(this).attr('data-index')
                })
                appendSelect($(layero).find('select[name="noteContent"]'), toAuditorderWinit_pageEnum.orderLabels)
                data.noteContent = data.orderLabel
                form.val('toauditOrderwinitlabelForm', data)
                form.render()
                form.on('select(notetype)', function(obj) {
                    var typeMap = { 'addordernote': 'orderNote', 'addpicknote': 'pickNote' }
                    $(layero).find('textarea').val(data[typeMap[obj.value]])
                })
            },
            yes: function(index, layero) {
                form.on('submit(toAuditorderWinit_remark_submit)', function(obj) {
                    toAuditorderaddRemark(data.id, obj.field.noteContent, obj.field.notetype, function(returnData) {
                        layer.msg(returnData.msg || "修改备注成功")
                        layer.close(index)
                        $('#toAuditWinitOrderSearch').click()
                    })
                })
                form.on('submit(toAuditorderWinit_label_submit)', function(obj) {
                    toAuditorderAddLabel(data.id, obj.field.noteContent, function(returnData) {
                        layer.msg(returnData.msg || "修改标签成功")
                        layer.close(index)
                        $('#toAuditWinitOrderSearch').click()
                    })
                })
                console.log(tabIndex, 'tabIndex')
                if (tabIndex == "1") {
                    $('#toAuditorderWinit_remark_submit').click()
                } else if (tabIndex == "2") {
                    $('#toAuditorderWinit_label_submit').click()
                }
            }
        })
    }

    //修改订单
    function toAuditOrderNewandEdit(type, data) {
        edit_order_tableIns = null;
        var concatData = []
        var obj = { '1': '新增订单', '2': '修改订单' }
        layer.open({
            type: 1,
            title: type === '2' ? obj[type]+' - ' + data.id : obj[type],
            btn: ['保存', '取消'],
            area: ['90%', '80%'],
            maxmin: true,
            id: 'pop_toAuditorderWinit_newandeditorder_id',
            content: $('#pop_toAuditorderWinit_newandeditorder').html(),
            success: function(layero, index) {
                var id = data ? data.id : ""
                var isSavable = $('#order_savebtn')
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
                appendSelect($('#toAuditorderWinit_editForm').find('select[name="platCode"]'), toAuditorderWinit_pageEnum.platCode, 'name', 'value')
                appendSelect($('#toAuditorderWinit_editForm').find('select[name="storeAcctId"]'), [], 'id', 'storeAcct','','salesSite')
                appendSelect($('#toAuditorderWinit_editForm').find('select[name="warehouseId"]'), toAuditorderWinit_pageEnum.prodWarehouses, 'name', 'value')
                appendSelect($('#toAuditorderWinit_editForm').find('select[name="logisTypeId"]'), toAuditorderWinit_logisType, 'id', 'name')
                appendSelect($('#toAuditorderWinit_editForm').find('select[name="siteId"]'), toAuditorderWinit_Site, 'code', 'name')
                appendSelect($('#toAuditorderWinit_editForm').find('select[name="currency"]'), toAuditorderWinit_Currency, 'code', 'name')
                if (data) {
                    data.orderTimeCn = Format(data.orderTimeCn, 'yyyy-MM-dd hh:mm:ss')
                    form.val("toAuditorderWinit_editForm", data);
                    Selected($('#toAuditorderWinit_editForm select[name="platCode"]'), data.platCode)
                    getStoreByPlatform(data.platCode, function (returnData) {
                        appendSelect(
                          $("#toAuditorderWinit_editForm").find('select[name="storeAcctId"]'),
                          returnData.data,
                          "id",
                          "storeAcct",
                          "",
                          "salesSite"
                        )
                        Selected(
                          $('#toAuditorderWinit_editForm select[name="storeAcctId"]'),
                          data.storeAcctId
                        )
                        toAuditorderWinitSiteByStore(data.siteId)
                    })
                    concatData = JSON.parse(JSON.stringify(data.orderDetails))
                    edit_order_tableIns = toAuditProdTableRender(concatData)
                }
                form.render()
                form.on('select(toauditwinitedit_storeAcct)', function(obj) {
                    toAuditorderWinitSiteByStore()
                })
                //监听平台下拉选择
                form.on('select(toauditwinitedit_platCode)', function(obj) {
                    getStoreByPlatform(obj.value,function(returnData){
                        appendSelect($('#toAuditorderWinit_editForm').find('select[name="storeAcctId"]'), returnData.data, 'id', 'storeAcct','','salesSite')
                        form.render()
                    })
                    getAllSite(obj.value, function(returnData) {
                        appendSelect($('#toAuditorderWinit_editForm').find('select[name="siteId"]'), returnData.data, 'code', 'name')
                        form.render()
                    })
                })
                $('#toAuditorderWinit_addProducts').click(function() {
                    var orginaldata = data ? toAuditGetEditTableData(concatData, edit_order_tableIns) : []
                    var prodSku = $(this).siblings('input').val();
                    if (prodSku !== "") {
                        getProductList(prodSku, function(returnData) {
                            toauditorderAddprod(returnData, function(callback) {
                                callback = callback.map(function(item) {
                                    item.imageUrl = item.image
                                    return item
                                })
                                concatData = orginaldata.concat(callback)
                                edit_order_tableIns = toAuditProdTableRender(concatData)
                            })
                        })
                    } else {
                        layer.msg('添加注册sku不能为空')
                    }
                })
                $(layero).on('click', '.refresh_icon', function() {
                    var prodskus = $(this).siblings('input').val()
                    var index = $(this).parents('tr').attr("data-index")
                    if (prodskus !== "") {
                        getProdInfoByprodsku(prodskus, function(returnData) {
                            var data = concatData[index]
                            var newdata = returnData.data
                            if (newdata.length > 0) {
                                concatData[index] = Object.assign(data, newdata[0])
                                edit_order_tableIns = toAuditProdTableRender(concatData)
                            } else {
                                layer.msg('查询商品数据为空')
                            }
                        })
                    } else {
                        layer.msg('请填写sku')
                    }
                })
            },
            yes: function(index, layero) {
                form.on('submit(edit_submit)', function(obj) {
                    const param = obj.field;
                    param.orderTimeCn = new Date(param.orderTimeCn).getTime();
                    edit_order_tableIns ? param.platOrderDetails = toAuditGetEditTableData(concatData, edit_order_tableIns) :
                        param.platOrderDetails = []
                    if (param.platOrderDetails.length > 0) {
                        savetoAuditOrders(param, function(returnData) {
                            layer.msg(returnData.msg || "保存成功")
                            $('#toAuditWinitOrderSearch').click();
                            layer.close(index)
                        })
                    } else {
                        layer.msg('请添加商品')
                    }
                })
                $(layero).find('#edit_submit').click();
            }
        })
    }

     // 站点随店铺联动查询
     function toAuditorderWinitSiteByStore(initSiteId = "") {
        const siteStr = $("#toAuditorderWinit_editForm")
        .find('select[name="storeAcctId"] option:selected')
        .data().salessite
        const _site = siteStr ? siteStr.toString().split(",") : []
        const _platCode = $("#toAuditorderWinit_editForm")
        .find('select[name="platCode"]')
        .val()
        getAllSite(_platCode, function (returnData) {
        const res = returnData.data.filter((item) =>
            _site.some((elem) => elem == item.code)
        )
        appendSelect(
            $("#toAuditorderWinit_editForm").find('select[name="siteId"]'),
            res,
            "code",
            "name"
        )
        initSiteId &&
            Selected(
            $("#toAuditorderWinit_editForm").find('select[name="siteId"]'),
            initSiteId
            )
        form.render()
        })
    }

    //渲染商品信息表格
    function toAuditProdTableRender(data) {
        tableIns = table.render({
            elem: '#toAuditorderWinit_product_table',
            id: 'toAuditorderWinit_product_table',
            data: data || [],
            cols: [
                [
                    { title: "图片", field: "imageUrl", templet: "#toAuditorderWinit_detail_img_tpl" },
                    { title: "Listing_ID", field: "itemId", templet: "#toAuditorderWinit_edit_ListingID" },
                    { title: "店铺SKU", field: "storeSSku", templet: "<div><div name='storeSSku'>{{d.storeSSku||''}}</div>" },
                    { title: "注册SKU", field: "prodSSku", templet: "#toAuditorderWinit_edit_Prodsku", width: 200 }, //
                    { title: "海外仓销售", field: "winitSalesPerson" },
                    { title: "商品名称", field: "prodTitle" },
                    { title: "入库要求", field: "packDesc" },
                    { title: '款式', field: "style" },
                    { title: '可用库存', field: "availableStock" },
                    { title: '商品成本（￥）', field: "prodUnitCost" },
                    { title: '累计净重（g）', field: "prodUnitWeight" },
                    { title: '报关信息', field: "style" },
                    { title: '商品数量', field: "prodQuantity", templet: "#toAuditorderWinit_edit_prodQuantity" },
                    { title: '销售数量', field: "platQuantity", templet: "#toAuditorderWinit_edit_platQuantity" },
                    { title: '销售单价', field: "platUnitPrice", templet: "#toAuditorderWinit_edit_platUnitPrice" },
                    { title: '销售金额', field: "platOrderDetailAmt", templet: "#toAuditorderWinit_edit_platOrderDetailAmt" },
                    { title: '操作', toolbar: "#toAuditorderWinit_edit_option", width: 100 }
                ]
            ],
            page: false,
            limit: 300,
            done: function(res) {
                imageLazyload();
                table.on("tool(toAuditorderWinit_product_table)", function(obj) {
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
            content: $('#pop_toAuditorderWinit_addProducts').html(),
            success: function(layero, index) {
                table.render({
                    elem: '#toAuditorderWinit_addProducts_table',
                    data: data.data,
                    cols: [
                        [
                            { checkbox: true, width: 30 },
                            { title: "图片", field: "imageUrl", templet: "#add_product_img" },
                            { title: "注册SKU", field: "sSku" },
                            { title: "父sku", field: "", templet: "#add_product_psku" },
                            { title: "商品名称", field: "title" },
                            { title: "款式", field: "style" }
                        ]
                    ],
                    page: true,
                    id: 'toAuditorderWinit_addProducts_table',
                    done: function(res) {
                        imageLazyload();
                    }
                })
            },
            yes: function(index, layero) {
                var checkStatus = table.checkStatus('toAuditorderWinit_addProducts_table')
                var callbackdata = checkStatus.data
                var prodskus = ""
                prodskusArr = callbackdata.map(function(item) {
                    return item.sSku
                })
                if (prodskusArr.length > 0) {
                    prodskus = prodskusArr.join(',')
                }
                getProdInfoByprodsku(prodskus, function(returnData) {
                    var data = returnData.data.map(function(item) {
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
    // 原始订单拆单弹框

    function originOrderDemolimotion(data) {
        var demolitiontableIns = null
        layer.open({
            type: 1,
            title: '订单拆分',
            btn: ['拆分', '关闭'],
            area: ['70%', '60%'],
            content: $('#pop_toAuditorderWinit_demolition_original').html(),
            success: function(layero, index) {
                console.log(data.orderDetails)
                demolitiontableIns = table.render({
                    elem: '#toAuditorderWinit_demolition_original_table',
                    method: 'POST',
                    data: data.orderDetails,
                    cols: [
                        [
                            { title: "商品信息", field: "imageUrl", templet: "#orginal_order_products" },
                            { title: "库存信息", field: "itemId", templet: "#orginal_order_stock" },
                            { title: "拆分", field: "id", templet: "#orginal_order_demolition" },
                            { title: "数量", field: "prodQuantity", templet: "#orginal_order_number" }
                        ]
                    ],
                    page: false,
                    limit: 500,
                    id: 'toAuditorderWinit_demolition_original_table',
                    done: function(res) {
                        imageLazyload();
                    }
                })
            },
            yes: function(index, layero) {
                var layFilterIndex = 'LAY-table-' + demolitiontableIns.config.index;
                var tableContainer = $('div[lay-filter="' + layFilterIndex + '"]');
                var orderSplitDetailDtos = []
                tableContainer.find('tr').find('td[data-field="id"]').find('.layui-form-checked').each(function(index, item) {
                    var orderDetailId = $(item).parents('td').attr('data-content')
                    var prodQuantity = $(item).parents('tr').find('td[data-field="prodQuantity"]').find('input[name="demolitionQuality"]').val();
                    var stock = $(item).parents('tr').find('td[data-field="prodQuantity"]').attr('data-content')
                    console.log(prodQuantity, stock)
                    if (!prodQuantity || Number(prodQuantity) <= 0 || Number(prodQuantity) > stock) {
                        return layer.msg(`请填写大于0并且小于${stock}的数量`);
                    }
                    orderSplitDetailDtos.push({ orderDetailId, prodQuantity })
                })
                if (orderSplitDetailDtos.length > 0) {
                    orginalDemolition(data.id, orderSplitDetailDtos)
                } else {
                    return layer.msg("请勾选拆分订单")
                }
            },
        })
    }

    //平台操作
    $("#toAuditOrderWinit_cancelOrderEbay").click(function() {
        //获取选中的订单id
        var checkStatus = table.checkStatus('toAuditorderWinit_table')
        var data = checkStatus.data
        var ids = (data || []).map(function(item) {
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
            success: function(layero, index) {
                $(layero).find('.layui-layer-content').html($("#toAuditorderWinit_cancelEbayTpl").html());
                layui.form.render();
            },
            yes: function(index, layero) {
                var cancelReason = $("#toAuditorderWinit_cancelEbayForm input[name=cancelReason]:checked").val();
                //ebay取消订单
                initAjax('/platorder/winit/cancelorder/ebay.html', 'post', { ids: ids.join(","), cancelReason: cancelReason }, function(returnData) {
                    layui.admin.batchResultAlert("ebay取消订单完成:", returnData.data, function() {
                        $('#toAuditWinitOrderSearch').click();
                    });
                    layer.close(index);
                }, 'application/x-www-form-urlencoded')
            }
        })
    });

    //获取选择的订单id
    function getTableSelectIds() {
        var checkStatus = table.checkStatus('toAuditorderWinit_table')
        var data = checkStatus.data
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
        $('#toAuditorderWinit_Tab ul').append(html)
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
            const _otherAttr = otherAttr ? `data-${otherAttr}="${data[i][otherAttr]}"` : ""
            option += '<option ' + _otherAttr + ' value="' + (typeof data[i].code != 'undefined' ? data[i].code : data[i]) + '">' + (data[i].label || data[i]) + '</option>'
        }
        aDom.append(option)
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

    function Selected(aDom, value) {
        var options = aDom.find('option');
        options.each(function(index, item) {
            if (item.value == value) {
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
