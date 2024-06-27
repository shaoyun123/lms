layui.use(['form', 'table', 'layer', 'element', 'laypage', 'upload', 'tableMerge', 'laydate', 'formSelects'], function() {
    var form = layui.form,
        table = layui.table,
        element = layui.element,
        laydate = layui.laydate,
        formSelects = layui.formSelects,
        laypage = layui.laypage;
    layer = layui.layer;
    form.render('select');
    var allStatusOrderWinit_company = null,
        allStatusOrderWinit_allstore = null,
        allStatusOrderWinit_logisType = null,
        allStatusOrderWinit_Site = null,
        allStatusOrderWinit_pageEnum = null,
        allStatusOrderWinit_formdata = {},
        allStatusOrderWinit_Currency = null,
        allStatusOrderWinit_companyType = "";
    laydate.render({
        elem: '#allStatusOrderWinit_time',
        type: 'date',
        range: true
    });

    formSelects.render('storeAcct', { placeholder: '请先选择平台' });
    //渲染平台标记
    allStatusOrderWinit_renderPlatCodeMark();
    function allStatusOrderWinit_renderPlatCodeMark () {
        commonReturnPromise({
            url: '/lms/platorder/winit/listenum.html'
        }).then(res => {
            let { platTagList } = res;
            commonRenderSelect('allStatusOrderWinit_platTags', platTagList).then(() => {
                formSelects.render('allStatusOrderWinit_platTags');
            });
        });
    }

    //dropdown操作
    var allstatusorder_batchopt = new dropButton('allStatusOrderbatchopt');
    allstatusorder_batchopt.choose(function(event) {
        if (event == "allStatusOrderWinit_markDelivery") { //标记平台发货
            let ids = getTableSelectIds();
            if (ids.length > 0) {
                markDelivery(ids)
            } else {
                layer.msg('请选择订单', { icon: 7 });
            }
        } else if (event == "allStatusOrderWinit_syncWinitOutOrderStatus") {
            let ids = getTableSelectIds();
            if (!ids || ids.length <= 0) {
                layer.msg("未选择订单", { icon: 0 });
                return;
            }
            //同步海外仓出库单跟踪号
            syncWinitOutOrderStatus(ids.join(","), function(returnData) {
                //处理完成后不刷新页面
                layui.admin.batchResultAlert("同步海外仓出库单处理状态:", returnData.data, function() {});
            });
        } else if (event == "allStatusOrderWinit_syncOrderStatus") {
            let ids = getTableSelectIds();
            if (ids.length > 0) {
                syncOrderStatus(ids)
            } else {
                layer.msg('请选择订单', { icon: 7 });
            }
        } else if (event == "allStatusOrderWinit_shipToUnAudit") {
            let ids = getTableSelectIds();
            if (!ids || ids.length <= 0) {
                layer.msg("未选择订单", { icon: 0 });
                return;
            }
            //同步海外仓出库单跟踪号
            initAjax('/platorder/winit/shippedtounaudit.html', 'post', { ids: ids.join(",") }, function(returnData) {
                layui.admin.batchResultAlert("已发货订单驳回到待审核:", returnData.data, function() {
                    $('#allStatusOrderWinitSearch').click();
                });
            }, 'application/x-www-form-urlencoded')
        } else if (event == "allStatusOrderWinit_refreshProfit") {
            let ids = getTableSelectIds();
            if (!ids || ids.length <= 0) {
                layer.msg("未选择订单", { icon: 0 });
                return;
            }
            //选择是否更新商品成本
            layer.open({
                type: 1,
                title: '订单重算利润',
                btn: ['确认', '取消'],
                content: "loading",
                success: function(layero, index) {
                    $(layero).find('.layui-layer-content').html($("#allStatusOrderWinit_refreshProfitTpl").html());
                    layui.form.render();
                },
                yes: function(index, layero) {
                    let isUpdateProdCost = $("#allStatusOrderWinit_refreshProfitForm input[name=isUpdateProdCost]:checked").val();
                    //重算利润
                    initAjax('/platorder/winit/refreshprofit.html', 'post', { ids: ids.join(","), isUpdateProdCost: isUpdateProdCost }, function(returnData) {
                        layui.admin.batchResultAlert("订单重算利润:", returnData.data, function() {
                            $('#allStatusOrderWinitSearch').click();
                            layer.close(index);
                        });
                    }, 'application/x-www-form-urlencoded')
                }
            })
        }
    });

    var nowdate = new Date()
    var endDate = Format(new Date(), 'yyyy-MM-dd')
    var onemonth = Format(new Date(nowdate - 30 * 24 * 3600 * 1000), 'yyyy-MM-dd')
    $('#allStatusOrderWinit_time').val(onemonth + ' - ' + endDate)
    render_hp_orgs_users("#allStatusOrderWinit_storeSalesPersonDiv");
    render_hp_orgs_users("#allStatusOrderWinit_winitSalesPersonDiv");
    // 展示和隐藏 更多查询条件
    $('#showMoreSearchCondition_allStatusOrderWinit').click(function () {
        var self = this
        if ($(self).hasClass('showExternal')) {
            $(self).closest('.layui-form').find('.externalContainabnorlmalorder').hide()
            $('#hide_icon_allStatusOrderWinit').show()
            $('#show_icon_allStatusOrderWinit').hide()
            $(self).removeClass('showExternal')
            allStatusOrderWinitHasValue('allStatusOrderWinitForm', 'showMoreSearchCondition_allStatusOrderWinit');
        } else {
            $(self).closest('.layui-form').find('.externalContainabnorlmalorder').show()
            $('#hide_icon_allStatusOrderWinit').hide()
            $('#show_icon_allStatusOrderWinit').show()
            $(self).addClass('showExternal')
        }
    });

    function allStatusOrderWinitHasValue (formId, btnId) {
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
    element.on('tab(allStatusOrderWinit_Tab)', function(data) {
        var processStatus = data.elem.context.dataset.index;
        $('#allStatusOrderWinitForm input[name="processStatus"]').val(processStatus);
        $('#allStatusOrderWinitSearch').click()
    });


    // 表单提交
    form.on('submit(allStatusOrderWinitSearch)', function(data) {
        dealData(data);
        allStatusOrderWinitTableorder(data.field)
    });
    // 表单export
    form.on('submit(allStatusOrderWinitExport)', function(data) {
        layer.confirm('根据页面查询条件导出订单？', function(result) {
            if (result) {
                dealData(data);
                submitForm(data.field, ctx + '/platorder/winit/exportorder.html', "_blank");
                layer.closeAll();
            }
        });
    });
    form.on('submit(allStatusOrderWinitStatisticsExport)', function(data) {
        layer.confirm('根据页面查询时间导出明细信息？', function(result) {
            if (result) {
                dealData(data);
                submitForm(data.field, ctx + '/ordersale/oswh/exportorder.html', "_blank");
                layer.closeAll();
            }
        });
    });
    //处理data
    function dealData(data) {
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
            if ($("#allStatusOrderWinitForm select[name=company]").val()) {
                let logisTypeIds = [];
                $("#allStatusOrderWinitForm select[name=logisTypeIds] option").each(function() {
                    let logisTypeId = $(this).attr("value");
                    if (logisTypeId && logisTypeId != 0) {
                        logisTypeIds.push(logisTypeId);
                    }
                });
                data.field.logisTypeIds = logisTypeIds.join(",");
            }
        }
    }

    //监听平台下拉选择
    form.on('select(allstatuswinitplatCodes)', function(obj) {
        getStoreByPlatform(obj.value, function(returnData) {
            appendSelect($('#allStatusOrderWinitForm').find('select[_name="storeAcctIds"]'), returnData.data, 'id', 'storeAcct')
        })
    })

    //监听公司下拉选择
    form.on('select(allstatuswinitcompanyType)', function(obj) {
            allStatusOrderWinit_companyType = obj.value
            appendSelect($('#allStatusOrderWinitForm').find('select[name="company"]'), allStatusOrderWinit_company[allStatusOrderWinit_companyType], 'id', 'cnName')
            form.render()
        })
        //监听物流公司下拉选择
    form.on('select(allstatuswinitcompany)', function(obj) {
        var agent = "",
            logisticsCompanyId = "";
        allStatusOrderWinit_companyType === 'agents' ? agent = obj.value : logisticsCompanyId = obj.value
        getAllLogicsType(agent, logisticsCompanyId)
        form.render()
    })

    getPageEnum();
    getAllCompanies();
    // getStoreByPlatform('', function(returnData) {
    //     allStatusOrderWinit_allstore = returnData.data
    // });
    getAllLogicsType('', '', function(returnData) {
        allStatusOrderWinit_logisType = returnData.data
    });
    getAlldevEmployee();
    getAllpurchaseEmployee();
    getAllSite();
    getCurrencyEnums();



    // 页面数据请求----------------------------------------
    //  获取页面枚举数
    function getPageEnum() {
        initAjax('/platorder/winit/listenum.html', 'post', {}, function(returnData) {
            allStatusOrderWinit_pageEnum = returnData.data
            allStatusOrderWinit_pageEnum.platCode = allStatusOrderWinit_pageEnum.platCodes
            allStatusOrderWinit_pageEnum.prodLogisAttrs = allStatusOrderWinit_pageEnum.logisAttrs
            allStatusOrderWinit_pageEnum.shippingCountryCodes = allStatusOrderWinit_pageEnum.shippingCountrys
            allStatusOrderWinit_pageEnum.warehouseId = allStatusOrderWinit_pageEnum.prodWarehouses
            allStatusOrderWinit_pageEnum.processStatus = allStatusOrderWinit_pageEnum.orderProcessStatus
            for (var i in returnData.data) {
                appendSelect($('#allStatusOrderWinitForm').find('select[name="' + i + '"]'), returnData.data[i], 'name', 'value')
                appendSelect($('#allStatusOrderWinitForm').find('select[_name="' + i + '"]'), returnData.data[i], 'name', 'value')
                if (i == "orderProcessStatus") {
                    allstatusappendTab(returnData.data[i])
                        // getTabStatusNum({orderTimeStart:onemonth+' 00:00:00',orderTimeEnd:endDate+' 23:59:59'},function(returnData){
                        //     let total = 0;
                        //     for(var i in returnData.data){
                        //         $('#allStatusOrderWinit_Tab').find('li[data-index="'+i+'"]').find('span').text(returnData.data[i]);
                        //         total+=returnData.data[i];
                        //     }
                        //     //全部页签
                        //     $('#allStatusOrderWinit_Tab').find('li:first').find('span').text(total);
                        // })
                }
            }
            form.render()
            formSelects.render('logisAttrs')
            formSelects.render('winitallStatusshippingCountrys')
        })
    }
    //获取所有物流公司以及货代公司
    function getAllCompanies() {
        initAjax('/platorder/winit/listcompanyandagent.html', 'post', {}, function(returnData) {
            allStatusOrderWinit_company = returnData.data
            appendSelect($('#allStatusOrderWinitForm').find('select[name="company"]'), returnData.data.companys, 'id', 'cnName')
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
            // appendSelect($('#allStatusOrderWinitForm').find('select[name="logisTypeIds"]'), returnData.data, 'id', 'name')
            // form.render()
            commonRenderSelect('allstatusorder_logisTypeIds', returnData.data, {
                name: 'name',
                code: 'id'
            }).then(function() {
                formSelects.render();
            });
        })
    }

    //根据平台code获取店铺列表
    function getStoreByPlatform(platcode, func) {
        initAjax('/sys/liststorebyplatcode.html', 'get', { platCode: platcode }, function(returnData) {
            if (func) {
                func(returnData)
            }
            formSelects.render('storeAcct', { placeholder: '请先选择平台' })
        }, 'application/x-www-form-urlencoded')
    }

    //获取所有开发专员
    function getAlldevEmployee() {
        initAjax('/sys/prodOwnerList.html', 'post', {}, function(returnData) {
            appendSelect($('#allStatusOrderWinitForm').find('select[name="preprodDevId"]'), returnData.data, 'id', 'loginName')
            form.render()
        })
    }

    //获站点接口
    function getAllSite(platCode, func) {
        initAjax('/enum/getSiteEnum.html?platCode=' + platCode, 'post', {}, function(returnData) {
            allStatusOrderWinit_Site = returnData.data
            if (func) {
                func(returnData)
            }
        }, 'application/x-www-form-urlencoded')
    }

    //获取所有采购专员
    function getAllpurchaseEmployee() {
        initAjax('/sys/buyerList.html', 'post', {}, function(returnData) {
            appendSelect($('#allStatusOrderWinitForm').find('select[name="purchasingAgentId"]'), returnData.data, 'id', 'loginName')
            form.render()
        })
    }

    //获取币种枚举
    function getCurrencyEnums() {
        initAjax('/sysdict/getCurrencyEnums.html', 'post', {}, function(returnData) {
            allStatusOrderWinit_Currency = returnData.data
        })
    }

    //获取页签数量
    function getTabStatusNum(data, func) {
        initAjax('/platorder/winit/statuscount.html', 'post', data, function(returnData) {
            func(returnData)
        }, 'application/x-www-form-urlencoded')
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

    //渲染表格数据
    function allStatusOrderWinitTableorder(data) {
        table.render({
            elem: '#allStatusOrderWinit_table',
            method: 'POST',
            url: ctx + '/platorder/winit/listorder.html',
            where: data,
            cols: [
                [
                    { checkbox: true, width: 30 },
                    { title: "订单号", field: "id", templet: "#allStatusOrderWinit_id_tpl" },
                    { title: "订单金额", field: "platOrderAmt", templet: "#allStatusOrderWinit_platOrderAmt_tpl", width: 120 },
                    { title: "商品", field: "prodQuantity", templet: "#allStatusOrderWinit_prodQuantity_tpl" },
                    { title: "收件人", field: "shippingUsername", templet: "#allStatusOrderWinit_shippingUsername_tpl" },
                    { title: "物流", field: "logisTypeName", templet: '#allStatusOrderWinit_logisTypeName_tpl' },
                    { title: "时间", field: "time", templet: "#allStatusOrderWinit_time_tpl" },
                    { title: "标签备注", templet: "#allStatusOrderWinit_remark_tpl" },
                    { title: "状态", field: "platOrderStatus", templet: "#allStatusOrderWinit_platOrderStatus_tpl" },
                    { title: 'OA订单状态', field: "processStatus", templet: "#allStatusOrderWinit_processStatus_tpl", width: 100 },
                    { title: '操作', toolbar: "#allStatusOrderWinit_tool_tpl", width: 80 }
                ]
            ],
            page: false,
            limit: 500,
            id: 'allStatusOrderWinit_table',
            created: function(res) {
                var data = res.data
                for (var item of data || []) {
                    item.storeskuview = item.orderDetails.map(function(item) {
                        var storesku = item.storeSSku + '*' + item.platQuantity
                        return storesku
                    })
                    item.itemIds = item.orderDetails.map(function(item) {
                        return '<a href="https://www.ebay.com/itm/' + item.itemId + '" target="_blank">' + item.itemId + '</a>';
                    })
                    item.itemIds = Array.from(new Set(item.itemIds));
                }
            },
            done: function(res) {
                allstatusOrderPage(data, res.count)
                if (!isObjectValueEqual(data, allStatusOrderWinit_formdata)) {
                    getTabStatusNum(data, function(returnData) {
                        let total = 0;
                        for (var i in returnData.data) {
                            $('#allStatusOrderWinit_Tab').find('li[data-index="' + i + '"]').find('span').text(returnData.data[i]);
                            total += returnData.data[i];
                        }
                        //全部页签
                        allStatusOrderWinit_formdata = data
                        $('#allStatusOrderWinit_Tab').find('li:first').find('span').text(total);
                    })
                }
                $('#LAY-allStatusOrderWinit #allStatusOrderWinit_Tab').find('li[data-index="' + data.processStatus + '"]').find('span').text(res.count)
                    // setRowEvent('#allStatusOrderWinit_table', '.allStatusOrderWinit_col_id', 'click', function(dom) {
                    //         var index = $(dom).attr('data-index')
                    //         allStatusOrderNewandEdit('2',res.data[index])
                    // }, ['.copyTxt', '.doubleClickToSet', '.laytable-cell-checkbox', '.freeClickBox', '[data-edit]'])
            }
        })
    }
    //平台操作功能
    new dropButton('allStatusOrderwinit_platOperate');
    allStatusOrderWinitPlatOperateFeatures()
    function allStatusOrderWinitPlatOperateFeatures() {
        // ebay 邮件
        $("#allStatusOrderWinit_eBayEmail").on("click", function () {
            orderEbayEmail('', "allStatusOrderWinit_table")
        })

        //ebay取消
        $('#allStatusOrderWinit_cancelOrderEbay').on('click', function () {
            let idsArr = getTableSelectIds();
            if (idsArr.length == 0) {
                return layer.msg('请先选择数据', {icon: 7});
            }
            layer.open({
                type: 1,
                title: '取消ebay订单',
                content: $('#allStatusOrderWinit_cancelEbayTpl').html(),
                area: ['40%', '30%'],
                id: 'allStatusOrderWinit_cancelEbayTplId',
                btn: ['确定', '关闭'],
                success: function (layero, index) {
                    form.render();
                },
                yes: function (index, layero) {
                    var cancelReason = layero.find('[name=cancelReason]:checked').val();
                    layer.close(index);
                    commonReturnPromise({
                        url: ctx + '/platorder/winit/cancelorder/ebay.html',
                        type: 'post',
                        params: {
                            ids: idsArr.join(),
                            cancelReason: cancelReason
                        }
                    }).then(function (result) {
                        layui.admin.batchResultAlert("ebay取消订单完成:", result, function (errIdsArr) {
                            $('#allStatusOrderWinitSearch').click()
                        });
                    }).catch(function (resErr) {
                        layer.msg(resErr, {icon: 2});
                    });
                }
            });
        });
    }

    table.on('tool(allStatusOrderWinit_table)', function(obj) {
            var event = obj.event
            var data = obj.data
            if (event == "allStatusOrderWinit_detail") {
                allStatusOrderNewandEdit('2', data)
            } else if (obj.event === "allStatusOrderWinit_sendEmail") { //发送邮件
                orderWinitSendEmail(data.id, data.platCode, function() {});
            } else if (obj.event === "allStatusOrderWinit_issueRefund") { //
                orderIssueRefund(data, function() {});
            } else if (obj.event == 'allStatusOrderWinit_remark') {
                allStatusOrderRemark(data)
            }
        })
        // 渲染页面分页
    function allstatusOrderPage(data, count) {
        laypage.render({
            elem: 'allStatusOrderWinitPage',
            curr: data.page,
            limit: data.limit,
            limits: [100, 200, 500, 3000],
            layout: ['prev', 'page', 'next', 'count', 'limit'],
            count: count,
            jump: function(obj, first) {
                $('#allStatusOrderWinitForm input[name="limit"]').val(obj.limit); //保障下次的分页请求中带有的值正确
                $('#allStatusOrderWinitForm input[name="page"]').val(obj.curr); //保障下次的分页请求中带有的值正确
                //首次不执行
                if (!first) {
                    data.page = obj.curr;
                    data.limit = obj.limit;
                    $('#allStatusOrderWinitSearch').click()
                }
            }
        });
    }

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

    //修改订单
    function allStatusOrderNewandEdit(type, data) {
        edit_order_tableIns = null;
        var concatData = []
        layer.open({
            type: 1,
            title: '查看详情 - ' + data.id,
            btn: ['保存', '取消'],
            area: ['90%', '80%'],
            maxmin: true,
            content: $('#pop_allStatusOrder_newandeditorder').html(),
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
                // appendSelect($('#allStatusOrder_editForm').find('select[name="storeAcctId"]'), allStatusOrderWinit_allstore, 'id', 'storeAcct', 'platCode')
                appendSelect($('#allStatusOrder_editForm').find('select[name="warehouseId"]'), allStatusOrderWinit_pageEnum.prodWarehouses, 'name', 'value')
                appendSelect($('#allStatusOrder_editForm').find('select[name="logisTypeId"]'), allStatusOrderWinit_logisType, 'id', 'name')
                // appendSelect($('#allStatusOrder_editForm').find('select[name="siteId"]'), allStatusOrderWinit_Site, 'code', 'name')
                appendSelect($('#allStatusOrder_editForm').find('select[name="currency"]'), allStatusOrderWinit_Currency, 'code', 'name')
                if (data) {
                    data.orderTimeCn = Format(data.orderTimeCn, 'yyyy-MM-dd hh:mm:ss')
                    form.val("allStatusOrder_editForm", data);
                    // storeSelected($('#allStatusOrder_editForm select[name="storeAcctId"]'), data.storeAcctId.toString())
                    getAllSite(data.platCode, function(returnData) {
                        appendSelect($('#allStatusOrder_editForm').find('select[name="siteId"]'), returnData.data, 'code', 'name')
                        Selected($('#allStatusOrder_editForm select[name="siteId"]'), data.siteId)
                        form.render()
                    })
                    getStoreByPlatform(data.platCode, function(returnData) {
                        appendSelect($('#allStatusOrder_editForm').find('select[name="storeAcctId"]'), returnData.data, 'id', 'storeAcct')
                        Selected($('#allStatusOrder_editForm select[name="storeAcctId"]'), data.storeAcctId)
                        form.render()
                    });
                    concatData = data.orderDetails
                    edit_order_tableIns = allStatusOrderProdTableRender(concatData)
                }
                form.render()
            },
            yes: function(index, layero) {},
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
                    { title: "注册SKU", field: "prodSSku" }, //
                    { title: "海外仓销售", field: "winitSalesPerson" },
                    { title: "商品名称", field: "prodTitle" },
                    { title: "入库要求", field: "packDesc" },
                    { title: '款式', field: "style" },
                    { title: '可用库存', field: "availableStock" },
                    { title: '商品成本（￥）', field: "prodUnitCost" },
                    { title: '累计净重（g）', field: "prodUnitWeight" },
                    { title: '报关信息', field: "style" },
                    { title: '销售单价', field: "platUnitPrice" },
                    { title: '销售数量', field: "platQuantity" },
                    { title: '销售金额', field: "platOrderDetailAmt" },
                    { title: '操作', toolbar: "#toAuditOrder_edit_option", width: 100 }
                ]
            ],
            page: false,
            limit: 300,
            done: function(res) {
                imageLazyload();
                table.on("tool(toAuditOrder_product_table)", function(obj) {
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

    // 提交绑定订单标签
    function allStatusOrderAddLabel(id, noteContent, func) {
        initAjax('/unauditorder/addorderlabel.html', 'post', { id, noteContent }, function(returnData) {
            if (func) {
                func(returnData)
            }
        }, 'application/x-www-form-urlencoded')
    }

    //提交新增备注
    function allStatusOrderaddRemark(id, noteContent, Type, func) {
        initAjax('/unauditorder/' + Type + '.html', 'post', { id, noteContent }, function(returnData) {
            if (func) {
                func(returnData)
            }
        }, 'application/x-www-form-urlencoded')
    }

    //备注弹框
    function allStatusOrderRemark(data) {
        var tabIndex = 1
        layer.open({
            type: 1,
            title: '备注',
            btn: ['提交', '取消'],
            area: ['40%', '50%'],
            content: $('#allStatusOrderwinit_remark').html(),
            success: function(layero, index) {
                //渲染textarea
                layero.find('textarea').val(data.orderNote || '');
                layero.find('#allStatusOrderwinitremarkTab').find('li').click(function() {
                    tabIndex = $(this).attr('data-index')
                })
                appendSelect($(layero).find('select[name="noteContent"]'), allStatusOrderWinit_pageEnum.orderLabels)
                data.noteContent = data.orderLabel
                form.val('allStatusOrderwinitlabelForm', data)
                form.render()
                form.on('select(notetype)', function(obj) {
                    var typeMap = { 'addordernote': 'orderNote', 'addpicknote': 'pickNote' }
                    layero.find('textarea').val(data[typeMap[obj.value]])
                });
            },
            yes: function(index, layero) {
                form.on('submit(allStatusOrderwinit_remark_submit)', function(obj) {
                    allStatusOrderaddRemark(data.id, obj.field.noteContent, obj.field.notetype, function(returnData) {
                        layer.msg(returnData.msg || "修改备注成功")
                        layer.close(index)
                        $('#allStatusOrderWinitSearch').click()
                    })
                })
                form.on('submit(allStatusOrderwinit_label_submit)', function(obj) {
                    allStatusOrderAddLabel(data.id, obj.field.noteContent, function(returnData) {
                        layer.msg(returnData.msg || "修改标签成功");
                        layer.close(index)
                            //触发表格搜索事件
                        $('#allStatusOrderWinitSearch').click()
                    })
                })
                if (tabIndex == "1") {
                    $('#allStatusOrderwinit_remark_submit').click()
                } else if (tabIndex == "2") {
                    $('#allStatusOrderwinit_label_submit').click()
                }
            }
        })
    }

    //页面按钮操作start
    //补货检测
    $('#allStatusOrderWinit_replenishCheck').click(function() {
        let ids = getTableSelectIds();
        if (!ids || ids.length < 1) {
            layer.msg('请选择订单', { icon: 7 });
            return;
        }
        initAjax('/abnormalorder/winit/replenishcheck.html', 'post', { ids: ids.join(",") }, function(returnData) {
            layui.admin.batchResultAlert("补货检测:", returnData.data, function() {
                $('#allStatusOrderWinitSearch').click();
            });
        }, 'application/x-www-form-urlencoded');
    });
    //库存占用规则
    $('#allStatusOrderWinit_holdStockTask').click(function() {
        layer.confirm('根据库存占用规则对缺货、待派单订单进行库存占用', function(result) {
            if (result) {
                initAjax('/platorder/winit/holdstocktask.html', 'post', {}, function(returnData) {
                    layui.admin.batchResultAlert("订单重新走库存占用规则:", returnData.data, function() {
                        $('#allStatusOrderWinitSearch').click();
                    });
                }, 'application/x-www-form-urlencoded');
            }
        });
    });
    //转待审核
    $('#allStatusOrderWinit_toAudit').click(function() {
        let ids = getTableSelectIds();
        if (!ids || ids.length < 1) {
            layer.msg('请选择订单', { icon: 7 });
            return;
        }
        initAjax('/platorder/winit/toaudit.html', 'post', { ids: ids.join(",") }, function(returnData) {
            layui.admin.batchResultAlert("订单转待审核:", returnData.data, function() {
                $('#allStatusOrderWinitSearch').click();
            });
        }, 'application/x-www-form-urlencoded');
    });
    //转取消订单
    $('#allStatusOrderWinit_toCancel').click(function() {
        let ids = getTableSelectIds();
        if (!ids || ids.length < 1) {
            layer.msg('请选择订单', { icon: 7 });
            return;
        }
        initAjax('/platorder/winit/tocancel.html', 'post', { ids: ids.join(",") }, function(returnData) {
            layui.admin.batchResultAlert("转取消订单:", returnData.data, function() {
                $('#allStatusOrderWinitSearch').click();
            });
        }, 'application/x-www-form-urlencoded');
    });

    //指定仓库类型
    $('#allStatusOrderWinit_appointWarehouseType').click(function() {
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
                $(layero).find('.layui-layer-content').html($("#allStatusOrderWinit_appointWarehouseTypeTpl").html());
                layui.form.render("radio");
            },
            yes: function(index, layero) {
                let warehouseType = $("#allStatusOrderWinit_appointWarehouseTypeForm input[name=warehouseType]:checked").val();
                initAjax('/unauditorder/winit/appointwarehousetype.html', 'post', { ids: ids.join(","), warehouseType: warehouseType }, function(returnData) {
                    layui.admin.batchResultAlert("重新指定仓库类型:", returnData.data, function() {
                        $('#allStatusOrderWinitSearch').click();
                    });
                    layer.close(index);
                }, 'application/x-www-form-urlencoded')
            }
        })
    });
    //标记发货
    // $('#allStatusOrderWinit_markDelivery').click(function() {
    //     let ids = getTableSelectIds();
    //     if (ids.length > 0) {
    //         markDelivery(ids)
    //     } else {
    //         layer.msg('请选择订单',{icon:7});
    //     }
    // })
    /**
     * 标记发货
     * @param {订单号} ids
     */
    function markDelivery(ids) {
        var ids = ids.join(',')
        initAjax('/platorder/winit/markplatshipping.html', 'post', { ids: ids }, function(returnData) {
            layui.admin.batchResultAlert("标记平台发货:", returnData.data, function() {
                $('#allStatusOrderWinitSearch').click();
            });
        }, 'application/x-www-form-urlencoded')
    }
    //4、同步海外仓处理状态
    // $("#allStatusOrderWinit_syncWinitOutOrderStatus").click(function () {
    //     let ids = getTableSelectIds();
    //     if(!ids || ids.length<=0){
    //         layer.msg("未选择订单",{icon:0});
    //         return;
    //     }
    //     //同步海外仓出库单跟踪号
    //     syncWinitOutOrderStatus(ids.join(","), function(returnData) {
    //         //处理完成后不刷新页面
    //         layui.admin.batchResultAlert("同步海外仓出库单处理状态:",returnData.data,function(){
    //         });
    //     });

    // });
    function syncWinitOutOrderStatus(ids, func) {
        initAjax('/undispatch/winit/syncwinitoutorderstatus.html', 'post', { ids: ids }, function(returnData) {
            if (func) {
                func(returnData)
            }
        }, 'application/x-www-form-urlencoded')
    }
    //订单驳回到待审核
    // $("#allStatusOrderWinit_shipToUnAudit").click(function () {
    //     let ids = getTableSelectIds();
    //     if(!ids || ids.length<=0){
    //         layer.msg("未选择订单",{icon:0});
    //         return;
    //     }
    //     //同步海外仓出库单跟踪号
    //     initAjax('/platorder/winit/shippedtounaudit.html', 'post', { ids:ids.join(",") }, function(returnData) {
    //         layui.admin.batchResultAlert("已发货订单驳回到待审核:",returnData.data,function(){
    //             $('#allStatusOrderWinitSearch').click();
    //         });
    //     }, 'application/x-www-form-urlencoded')

    // });
    //订单重算利润
    // $("#allStatusOrderWinit_refreshProfit").click(function () {
    //     let ids = getTableSelectIds();
    //     if(!ids || ids.length<=0){
    //         layer.msg("未选择订单",{icon:0});
    //         return;
    //     }
    //     //选择是否更新商品成本
    //     layer.open({
    //         type: 1,
    //         title: '订单重算利润',
    //         btn: ['确认','取消'],
    //         content: "loading",
    //         success: function(layero, index) {
    //             $(layero).find('.layui-layer-content').html($("#allStatusOrderWinit_refreshProfitTpl").html());
    //             layui.form.render();
    //         },
    //         yes: function(index, layero) {
    //             let isUpdateProdCost = $("#allStatusOrderWinit_refreshProfitForm input[name=isUpdateProdCost]:checked").val();
    //             //重算利润
    //             initAjax('/platorder/winit/refreshprofit.html', 'post', { ids:ids.join(","),isUpdateProdCost:isUpdateProdCost }, function(returnData) {
    //                 layui.admin.batchResultAlert("订单重算利润:",returnData.data,function(){
    //                     $('#allStatusOrderWinitSearch').click();
    //                     layer.close(index);
    //                 });
    //             }, 'application/x-www-form-urlencoded')
    //         }
    //     })
    // });
    //同步订单状态
    // $('#allStatusOrderWinit_syncOrderStatus').click(function() {
    //     let ids = getTableSelectIds();
    //     if (ids.length > 0) {
    //         syncOrderStatus(ids)
    //     } else {
    //         layer.msg('请选择订单',{icon:7});
    //     }
    // })
    /**
     * 同步订单状态
     * @param {订单号} ids
     */
    function syncOrderStatus(ids) {
        var ids = ids.join(',')
        initAjax('/platorder/winit/syncplatstatus.html', 'post', { ids: ids }, function(returnData) {
            layui.admin.batchResultAlert("同步订单状态:", returnData.data, function() {
                $('#toDispatchOrderWinitSearch').click();
            });
        }, 'application/x-www-form-urlencoded')
    }
    //页面按钮操作end

    window.getprocessStatus = function(status) {
        var processStatusArr = allStatusOrderWinit_pageEnum.processStatus
        for (var item of processStatusArr) {
            if (item.name == status) {
                return item.value
            }
        }
    }

    function getTableSelectIds() {
        var checkStatus = table.checkStatus('allStatusOrderWinit_table')
        var data = checkStatus.data
        var ids = (data || []).map(function(item) {
            return item.id
        });
        return ids;
    }

    //动态添加页签
    function allstatusappendTab(data) {
        var html = ""
        data.unshift({ name: '', value: '全部' })
        for (var i in data) {
            if (data[i].name === '1') {
                html += '<li class="layui-this" data-index="' + data[i].name + '">' + data[i].value + '(<span>0</span>)</li>'
            } else if(data[i].name == '200'){
            } else {
                html += '<li data-index="' + data[i].name + '">' + data[i].value + '(<span>0</span>)</li>'
            }
        }
        $('#allStatusOrderWinit_Tab ul.tabLi').append(html)
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

})

function getIndex(id, arr, value) { //获取某个取值属性在对象数组中的下标
    for (var i = 0; i < arr.length; i++) {
        if (value == arr[i][id]) {
            return i;
        }
    }
    return -1;
}
