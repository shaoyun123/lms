layui.use(['form', 'table', 'layer', 'element', 'laypage', 'upload', 'tableMerge', 'laydate', 'formSelects'], function() {
    var form = layui.form,
        table = layui.table,
        element = layui.element,
        laydate = layui.laydate,
        formSelects = layui.formSelects,
        laypage = layui.laypage;
    layer = layui.layer;
    form.render('select');
    var abnormalOrderWinit_company = null,
        abnormalOrderWinit_allstore = null,
        abnormalOrderWinit_logisType = null,
        abnormalOrderWinit_Site = null,
        abnormalOrderWinit_formdata ={},
        abnormalOrderWinit_pageEnum = null,
        abnormalOrderOrderWinit_Currency = null,
        abnormalOrderWinit_companyType = "";
    laydate.render({
        elem: '#abnormalOrderWinit_time',
        type: 'date',
        range: true
    });
    
    formSelects.render('storeAcct', { placeholder: '请先选择平台' });
    //渲染平台标记
    abnormalorderWinit_renderPlatCodeMark();
    function abnormalorderWinit_renderPlatCodeMark () {
        commonReturnPromise({
            url: '/lms/platorder/winit/listenum.html'
        }).then(res => {
            let { platTagList } = res;
            commonRenderSelect('abnormalorderWinit_platTags', platTagList).then(() => {
                formSelects.render('abnormalorderWinit_platTags');
            });
        });
    }


    var nowdate = new Date()
    var endDate = Format(new Date(), 'yyyy-MM-dd')
    var onemonth = Format(new Date(nowdate - 30 * 24 * 3600 * 1000), 'yyyy-MM-dd')
    $('#abnormalOrderWinit_time').val(onemonth + ' - ' + endDate)
    render_hp_orgs_users("#abnormalOrderWinit_storeSalesPersonDiv");
    render_hp_orgs_users("#abnormalOrderWinit_winitSalesPersonDiv");
    // 展示和隐藏 更多查询条件
    $('#showMoreSearchCondition_abnormalOrderWinit').click(function () {
        var self = this
        if ($(self).hasClass('showExternal')) {
            $(self).closest('.layui-form').find('.externalContainabnorlmalorder').hide()
            $('#hide_icon_abnormalOrderWinit').show()
            $('#show_icon_abnormalOrderWinit').hide()
            $(self).removeClass('showExternal')
            abnormalOrderWinitHasValue('abnormalOrderWinitForm', 'showMoreSearchCondition_abnormalOrderWinit');
        } else {
            $(self).closest('.layui-form').find('.externalContainabnorlmalorder').show()
            $('#hide_icon_abnormalOrderWinit').hide()
            $('#show_icon_abnormalOrderWinit').show()
            $(self).addClass('showExternal')
        }
    });

    function abnormalOrderWinitHasValue (formId, btnId) {
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
    element.on('tab(abnormalOrderWinit_Tab)', function(data) {
        var processStatus = data.elem.context.dataset.index;
        $('#abnormalOrderWinitForm input[name="processStatus"]').val(processStatus);
        $('#abnormalOrderWinitSearch').click();
        //触发页面操作按钮变化 TODO

        $("#abnormalOrderWinit_replenishCheck").hide();
        $("#abnormalOrderWinit_holdStockTask").hide();
        $("#abnormalOrderWinit_toAudit").hide();
        $("#abnormalOrderWinit_toCancel").hide();
        $("#abnormalOrderWinit_appointWarehouseType").hide();
        if(processStatus == 501){
            //黑名单订单
            $("#abnormalOrderWinit_toAudit").show();
            $("#abnormalOrderWinit_toCancel").show();
        }else if(processStatus == 502){
            //缺货订单
            $("#abnormalOrderWinit_toAudit").show();
            $("#abnormalOrderWinit_toCancel").show();
            $("#abnormalOrderWinit_replenishCheck").show();
            $("#abnormalOrderWinit_holdStockTask").show();
            $("#abnormalOrderWinit_appointWarehouseType").show();
            $("#abnormalOrderWinit_matchLogis").show();
        }else if(processStatus == 503){
            //取消订单
            $("#abnormalOrderWinit_toAudit").show();
            $("#abnormalOrderWinit_cancelOrderEbay").show();
        }else if(processStatus == 500){
            //其他异常单
            $("#abnormalOrderWinit_toAudit").show();
            $("#abnormalOrderWinit_toCancel").show();
            $("#abnormalOrderWinit_appointWarehouseType").show();
        }
    });


    // 表单提交
    form.on('submit(abnormalOrderWinitSearch)', function(data) {
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
        if(!data.field.logisTypeIds){
            if($("#abnormalOrderWinitForm select[name=company]").val()){
                let logisTypeIds = [];
                $("#abnormalOrderWinitForm select[name=logisTypeIds] option").each(function () {
                    let logisTypeId = $(this).attr("value");
                    if(logisTypeId && logisTypeId!=0){
                        logisTypeIds.push(logisTypeId);
                    }
                });
                data.field.logisTypeIds = logisTypeIds.join(",");
            }
        }
        abnormalOrderWinitTableorder(data.field)
    });

    //监听平台下拉选择
    form.on('select(abnormalwinitplatCodes)', function(obj) {
        getStoreByPlatform(obj.value,function(returnData){
            appendSelect($('#abnormalOrderWinitForm').find('select[_name="storeAcctIds"]'), returnData.data, 'id', 'storeAcct')
        })
    })

    //监听公司下拉选择
    form.on('select(abnormalwinitcompanyType)', function(obj) {
        abnormalOrderWinit_companyType = obj.value
            appendSelect($('#abnormalOrderWinitForm').find('select[name="company"]'), abnormalOrderWinit_company[abnormalOrderWinit_companyType], 'name', 'value')
            form.render()
        })
        //监听物流公司下拉选择
    form.on('select(abnormalwinitcompany)', function(obj) {
        var agent = "",
            logisticsCompanyId = "";
            abnormalOrderWinit_companyType === 'agents' ? agent = obj.value : logisticsCompanyId = obj.value
        getAllLogicsType(agent, logisticsCompanyId)
        form.render()
    })


    //监听工具栏操作
    table.on("tool(abnormalOrderWinit_table)", function(obj) {
        var event = event ? event : window.event;
        event.stopPropagation();
        var data = obj.data
        if (obj.event === "checkDetail") {
            abnormalorderNewandEdit(data)            
        }else if(obj.event=="abnormalWinit_demolition"){
            originabnormalOrderDemolimotion(data)
        } else if (obj.event === "abnormalWinit_sendEmail") { //发送邮件
            orderWinitSendEmail(data.id, data.platCode, function(){
            });
        } else if (obj.event === "abnormalWinit_issueRefund") { //
            orderIssueRefund(data, function(){
            });
        }else if(obj.event=='abnormalWinit_remark'){
            //订单备注
            abnormalOrderRemark(data)
        }
    });

        // 提交绑定订单标签
        function abnormalOrderAddLabel(id,noteContent,func){
            initAjax('/unauditorder/addorderlabel.html', 'post', { id, noteContent }, function(returnData) {
                if (func) {
                    func(returnData)
                }
            }, 'application/x-www-form-urlencoded')
        }
    
        //提交新增备注
        function abnormalOrderaddRemark(id, noteContent, Type, func) {
            initAjax('/unauditorder/' + Type + '.html', 'post', { id, noteContent}, function(returnData) {
                if (func) {
                    func(returnData)
                }
            }, 'application/x-www-form-urlencoded')
        }
    
        //备注弹框
        function abnormalOrderRemark(data) {
            var tabIndex = 1
            layer.open({
                type: 1,
                title: '备注',
                btn: ['提交', '取消'],
                area: ['40%', '50%'],
                content: $('#abnormalOrderwinit_remark').html(),
                success: function(layero, index) {
                    //渲染textarea
                    layero.find('textarea').val(data.orderNote || '');
                    layero.find('#abnormalOrderwinitremarkTab').find('li').click(function(){
                        tabIndex = $(this).attr('data-index')
                    })
                    appendSelect($(layero).find('select[name="noteContent"]'),abnormalOrderWinit_pageEnum.orderLabels)
                    data.noteContent = data.orderLabel
                    form.val('abnormalOrderwinitlabelForm',data)
                    form.render()
                    form.on('select(notetype)',function(obj){
                        var typeMap = {'addordernote':'orderNote','addpicknote':'pickNote'}
                        layero.find('textarea').val(data[typeMap[obj.value]])
                    });
                },
                yes: function(index, layero) {
                    form.on('submit(abnormalOrderwinit_remark_submit)', function(obj) {
                        abnormalOrderaddRemark(data.id, obj.field.noteContent, obj.field.notetype, function(returnData) {
                            layer.msg(returnData.msg || "修改备注成功")
                            layer.close(index)
                            $('#abnormalOrderWinitSearch').click()
                        })
                    })
                    form.on('submit(abnormalOrderwinit_label_submit)', function(obj) {
                        abnormalOrderAddLabel(data.id, obj.field.noteContent, function(returnData) {
                            layer.msg(returnData.msg || "修改标签成功");
                            layer.close(index)
                            //触发表格搜索事件
                            $('#abnormalOrderWinitSearch').click()
                        })
                    })
                    if(tabIndex=="1"){
                        $('#abnormalOrderwinit_remark_submit').click()
                    }else if(tabIndex=="2"){
                        $('#abnormalOrderwinit_label_submit').click()
                    }
                }
            })
        }



        // 原始订单拆单弹框

        function originabnormalOrderDemolimotion(data) {
            var demolitiontableIns = null
            layer.open({
                type: 1,
                title: '订单拆分',
                btn: ['拆分', '关闭'],
                area: ['70%', '60%'],
                content: $('#pop_abnormalWinit_demolition_original').html(),
                success: function(layero, index) {
                    demolitiontableIns = table.render({
                        elem: '#abnormalWinit_demolition_original_table',
                        method: 'POST',
                        data: data.orderDetails,
                        cols: [
                            [
                                { title: "商品信息", field: "imageUrl", templet: "#orginal_abnormalorder_products" },
                                { title: "库存信息", field: "itemId", templet: "#orginal_abnormalorder_stock" },
                                { title: "拆分", field: "id", templet: "#orginal_abnormalorder_demolition" },
                                { title: "数量", field: "platQuantity", templet: "#orginal_abnormalorder_number" }
                            ]
                        ],
                        page: false,
                        limit:500,
                        id: 'abnormalWinit_demolition_original_table',
                        done: function(res) {
                            imageLazyload();
                        }
                    })
                },
                yes: function(index, layero) {
                    var layFilterIndex = 'LAY-table-' + demolitiontableIns.config.index;
                    var tableContainer = $('div[lay-filter="' + layFilterIndex + '"]');
                    var orderSplitDetailDtos = []
                    tableContainer.find('tr').find('td[data-field="id"]').find('.layui-form-checked').each(function(index,item){
                        var orderDetailId = $(item).parents('td').attr('data-content')
                        var prodQuantity = $(item).parents('tr').find('td[data-field="platQuantity"]').find('input[name="demolitionQuality"]').val();
                        var stock = $(item).parents('tr').find('td[data-field="platQuantity"]').attr('data-content')
                        if(!prodQuantity||Number(prodQuantity)<0||Number(prodQuantity)>stock){
                            layer.msg(`请填写大于0并且小于${stock}的数量`)
                            return false;
                        }
                        orderSplitDetailDtos.push({orderDetailId,prodQuantity})
                    })
                    if(orderSplitDetailDtos.length>0){
                    orginalDemolition(data.id, orderSplitDetailDtos)
                    }
                },
            })
        }

    getPageEnum();
    getAllCompanies();
    getStoreByPlatform('', function(returnData) {
        abnormalOrderWinit_allstore = returnData.data
    });
    getAllLogicsType('', '', function(returnData) {
        abnormalOrderWinit_logisType = returnData.data
    });
    getAlldevEmployee();
    getAllpurchaseEmployee();
    getAllSite();
    getCurrencyEnums();



    // 页面数据请求----------------------------------------
    //  获取页面枚举数
    function getPageEnum() {
        initAjax('/platorder/winit/listenum.html', 'post', {}, function(returnData) {
            abnormalOrderWinit_pageEnum = returnData.data
            abnormalOrderWinit_pageEnum.platCode = abnormalOrderWinit_pageEnum.platCodes
            abnormalOrderWinit_pageEnum.prodLogisAttrs = abnormalOrderWinit_pageEnum.logisAttrs
            abnormalOrderWinit_pageEnum.shippingCountryCodes = abnormalOrderWinit_pageEnum.shippingCountrys
            abnormalOrderWinit_pageEnum.warehouseId = abnormalOrderWinit_pageEnum.prodWarehouses
            for (var i in returnData.data) {
                appendSelect($('#abnormalOrderWinitForm').find('select[name="'+i+'"]'), returnData.data[i], 'name', 'value')
                appendSelect($('#abnormalOrderWinitForm').find('select[_name="'+i+'"]'), returnData.data[i], 'name', 'value')
                if (i === 'abnormalOrderStatus') {
                    appendTab(returnData.data[i])
                }
            }
            form.render()
            formSelects.render('logisAttrs')
            formSelects.render('winitabormalshippingCountrys')
        })
    }
    //获取所有物流公司以及货代公司
    function getAllCompanies() {
        initAjax('/platorder/winit/listcompanyandagent.html', 'post', {}, function(returnData) {
            abnormalOrderWinit_company = returnData.data
            appendSelect($('#abnormalOrderWinitForm').find('select[name="company"]'), returnData.data.companys, 'id', 'cnName')
            form.render()
        })
    }

    //获取所有物流方式
    function getAllLogicsType(agent, logisticsCompanyId, func) {
        initAjax('/platorder/winit/listlogistype.html', 'get', { agent, logisticsCompanyId }, function(returnData) {
            if (func) {
                func(returnData)
            }
            // returnData.data.unshift({id:0,name:"空"});
            // appendSelect($('#abnormalOrderWinitForm').find('select[name="logisTypeIds"]'), returnData.data, 'id', 'name')
            // form.render()
            commonRenderSelect('abnormalorder_logisTypeIds',returnData.data, {
                name: 'name',
                code: 'id'
            }).then(function(){
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
            appendSelect($('#abnormalOrderWinitForm').find('select[name="preprodDevId"]'), returnData.data, 'id', 'loginName')
            form.render()
        })
    }

    //获站点接口
    function getAllSite(platCode, func) {
        initAjax('/enum/getSiteEnum.html?platCode=' + platCode, 'post', {}, function(returnData) {
            abnormalOrderWinit_Site = returnData.data
            if (func) {
                func(returnData)
            }
        }, 'application/x-www-form-urlencoded')
    }

    //获取所有采购专员
    function getAllpurchaseEmployee() {
        initAjax('/sys/buyerList.html', 'post', {}, function(returnData) {
            appendSelect($('#abnormalOrderWinitForm').find('select[name="purchasingAgentId"]'), returnData.data, 'id', 'loginName')
            form.render()
        })
    }

        //原始订单拆单
        function orginalDemolition(id, orderSplitDetailDtos) {
            initAjax('/platorder/winit/splitorder.html', 'post', JSON.stringify({ id: id, orderSplitDetailDtos: orderSplitDetailDtos }), function(returnData) {
                layer.msg(returnData.msg || '拆单成功', )
            })
        }

    // 获取所有页签数量
    function getAllTabNum(data){
        initAjax('/abnormalorder/winit/statuscount.html', 'post', data, function(returnData) {
           for(var i in returnData.data){
                $('#LAY-abnormalOrderWinit #abnormalOrderWinit_Tab').find('li[data-index="'+i+'"]').find('span').text(returnData.data[i])
            }
        }, 'application/x-www-form-urlencoded')
    }

            //获取币种枚举
            function getCurrencyEnums() {
                initAjax('/sysdict/getCurrencyEnums.html', 'post', {}, function(returnData) {
                    abnormalOrderOrderWinit_Currency = returnData.data
                })
            }

    //渲染表格数据
    function abnormalOrderWinitTableorder(data) {
        table.render({
            elem: '#abnormalOrderWinit_table',
            method: 'POST',
            url: ctx + '/abnormalorder/winit/list.html',
            where: data,
            cols: [
                [
                    { checkbox: true, width: 30 },
                    { title: "订单号", field: "id", templet: "#abnormalOrderWinit_id_tpl" },
                    { title: "订单金额", field: "platOrderAmt", templet: "#abnormalOrderWinit_platOrderAmt_tpl",width:120 },
                    { title: "商品", field: "prodQuantity", templet: "#abnormalOrderWinit_prodQuantity_tpl" },
                    { title: "收件人", field: "shippingUsername", templet: "#abnormalOrderWinit_shippingUsername_tpl" },
                    { title: "物流", field: "logisTypeName", templet: '#abnormalOrderWinit_logisTypeName_tpl' },
                    { title: "时间", field: "time", templet: "#abnormalOrderWinit_time_tpl" },
                    { title: "标签备注", templet: "#abnormalOrderWinit_labels_tpl" },
                    { title: "状态", field: "platOrderStatus", templet: "#abnormalOrderWinit_platOrderStatus_tpl" },
                    { title: '操作', toolbar: "#abnormalOrderWinit_option_tpl", width: 100 }
                ]
            ],
            page: false,
            limit:500,
            id: 'abnormalOrderWinit_table',
            created:function(res){
                var data = res.data
                for(var item of data||[]){
                    item.storeskuview = item.orderDetails.map(function(item){
                        var storesku = item.storeSSku+'*'+ item.platQuantity
                        return storesku
                    })
                    item.itemIds = item.orderDetails.map(function(item){
                        return '<a href="https://www.ebay.com/itm/'+item.itemId+'" target="_blank">' + item.itemId+'</a>';
                    })
                    item.itemIds = Array.from(new Set(item.itemIds));
                }
            },
            done: function(res) {
                abnormalOrderPage(data,res.count)
                var tab = $('#LAY-abnormalOrderWinit #abnormalOrderWinit_Tab').find('.layui-this')
                if(!isObjectValueEqual(data,abnormalOrderWinit_formdata)){
                    getAllTabNum(data)
                    abnormalOrderWinit_formdata = data
                }
                if (tab.length > 0) {
                    tab.find('span').text(res.count)
                } else {
                    $('#LAY-abnormalOrderWinit #abnormalOrderWinit_Tab').find('li[data-index="' + data.processStatus + '"]').addClass('layui-this').find('span').text(res.count)
                }

                // setRowEvent('#abnormalOrderWinit_table', '.abnormalOrderWinit_col_id', 'click', function(dom) {
                //         var index = $(dom).attr('data-index')
                //         abnormalorderNewandEdit(res.data[index])
                // }, ['.copyTxt', '.doubleClickToSet', '.laytable-cell-checkbox', '.freeClickBox', '[data-edit]'])
            }
        })
    }

    // 渲染页面分页
    function abnormalOrderPage(data,count){
        laypage.render({
            elem: 'abnormalOrderWinitPage',
            curr: data.page,
            limit: data.limit,
            limits: [100, 200, 500,3000],
            layout: ['prev', 'page', 'next', 'count','limit'],
            count: count,
            jump: function(obj, first) {
                $('#abnormalOrderWinitForm input[name="limit"]').val(obj.limit);//保障下次的分页请求中带有的值正确
                $('#abnormalOrderWinitForm input[name="page"]').val(obj.curr);//保障下次的分页请求中带有的值正确
            //首次不执行
                if (!first) {
                data.page = obj.curr;
                data.limit = obj.limit;
                $('#abnormalOrderWinitSearch').click()
            }   
        }
    });
    }

            //修改订单
            function abnormalorderNewandEdit(data) {
                edit_order_tableIns = null;
                var concatData = []
                layer.open({
                    type: 1,
                    title: '查看详情 - ' + data.id,
                    btn: ['保存', '取消'],
                    area: ['90%', '80%'],
                    maxmin: true,
                    content: $('#pop_abnormalorder_newandeditorder').html(),
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
                        appendSelect($('#abnormalorder_editForm').find('select[name="storeAcctId"]'), abnormalOrderWinit_allstore, 'id', 'storeAcct', 'platCode')
                        appendSelect($('#abnormalorder_editForm').find('select[name="warehouseId"]'), abnormalOrderWinit_pageEnum.prodWarehouses, 'name', 'value')
                        appendSelect($('#abnormalorder_editForm').find('select[name="logisTypeId"]'), abnormalOrderWinit_logisType, 'id', 'name')
                        appendSelect($('#abnormalorder_editForm').find('select[name="siteId"]'), abnormalOrderWinit_Site, 'code', 'name')
                        appendSelect($('#abnormalorder_editForm').find('select[name="currency"]'), abnormalOrderOrderWinit_Currency, 'code', 'name')
                        if (data) {
                            data.orderTimeCn = Format(data.orderTimeCn,'yyyy-MM-dd hh:mm:ss')
                            form.val("abnormalorder_editForm", data);
                            storeSelected($('#abnormalorder_editForm select[name="storeAcctId"]'),data.storeAcctId.toString())
                            getAllSite(data.platCode,function(returnData){
                                appendSelect($('#abnormalorder_editForm').find('select[name="siteId"]'), returnData.data, 'code', 'name')
                                Selected($('#abnormalorder_editForm select[name="siteId"]'),data.siteId)
                                form.render()
                            })
                            concatData = data.orderDetails
                            edit_order_tableIns = abnormalorderProdTableRender(concatData)
                        }
                        form.render()
                    },
                    yes: function(index, layero) {
                    },
                })
            }
    
                //渲染商品信息表格
        function abnormalorderProdTableRender(data) {
            tableIns = table.render({
                elem: '#abnormalorder_product_table',
                id: 'abnormalorder_product_table',
                data: data || [],
                cols: [
                    [
                        { title: "图片", field: "imageUrl", templet: "#abnormal_detail_img_tpl" },
                        { title: "Listing_ID", field: "itemId" },
                        { title: "店铺SKU", field: "storeSSku" },
                        { title: "注册SKU", field: "prodSSku"}, //
                        { title: "海外仓销售", field: "winitSalesPerson" },
                        { title: "商品名称", field: "prodTitle" },
                        { title: "入库要求", field: "packDesc" },
                        { title: '款式', field: "style" },
                        { title: '可用库存', field: "availableStock" },
                        { title: '商品成本（￥）', field: "prodUnitCost"},
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
                }
            })
            return tableIns
        }

    //页面按钮操作start
    //补货检测
    $('#abnormalOrderWinit_replenishCheck').click(function() {
        let ids = getTableSelectIds();
        if (!ids || ids.length < 1) {
            layer.msg('请选择订单',{icon:7});
            return;
        }
        initAjax('/abnormalorder/winit/replenishcheck.html', 'post', { ids: ids.join(",") }, function(returnData) {
            layui.admin.batchResultAlert("补货检测:",returnData.data,function(){
                $('#abnormalOrderWinitSearch').click();
            });
        }, 'application/x-www-form-urlencoded');
    });
    //库存占用规则
    $('#abnormalOrderWinit_holdStockTask').click(function() {
        layer.confirm('根据库存占用规则对缺货、待派单订单进行库存占用', function (result) {
            if (result) {
                initAjax('/platorder/winit/holdstocktask.html', 'post', {}, function(returnData) {
                    layui.admin.batchResultAlert("订单重新走库存占用规则:",returnData.data,function(){
                        $('#abnormalOrderWinitSearch').click();
                    });
                }, 'application/x-www-form-urlencoded');
            }
        });
    });
    //转待审核
    $('#abnormalOrderWinit_toAudit').click(function() {
        let ids = getTableSelectIds();
        if (!ids || ids.length < 1) {
            layer.msg('请选择订单',{icon:7});
            return;
        }
        initAjax('/platorder/winit/toaudit.html', 'post', { ids: ids.join(",") }, function(returnData) {
            layui.admin.batchResultAlert("订单转待审核:",returnData.data,function(){
                $('#abnormalOrderWinitSearch').click();
            });
        }, 'application/x-www-form-urlencoded');
    });
    //转取消订单
    $('#abnormalOrderWinit_toCancel').click(function() {
        let ids = getTableSelectIds();
        if (!ids || ids.length < 1) {
            layer.msg('请选择订单',{icon:7});
            return;
        }
        initAjax('/platorder/winit/tocancel.html', 'post', { ids: ids.join(",") }, function(returnData) {
            layui.admin.batchResultAlert("转取消订单:",returnData.data,function(){
                $('#abnormalOrderWinitSearch').click();
            });
        }, 'application/x-www-form-urlencoded');
    });

    //指定仓库类型
    $('#abnormalOrderWinit_appointWarehouseType').click(function() {
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
                $(layero).find('.layui-layer-content').html($("#abnormalOrderWinit_appointWarehouseTypeTpl").html());
                layui.form.render("radio");
            },
            yes: function(index, layero) {
                let warehouseType = $("#abnormalOrderWinit_appointWarehouseTypeForm input[name=warehouseType]:checked").val();
                initAjax('/unauditorder/winit/appointwarehousetype.html', 'post', { ids:ids.join(","),warehouseType:warehouseType }, function(returnData) {
                    layui.admin.batchResultAlert("重新指定仓库类型:",returnData.data,function(){
                        $('#abnormalOrderWinitSearch').click();
                    });
                    layer.close(index);
                }, 'application/x-www-form-urlencoded')
            }
        })
    });
    $("#abnormalOrderWinit_cancelOrderEbay").click(function () {
        //获取选中的订单id
        let ids = getTableSelectIds();
        if (!ids || ids.length < 1) {
            layer.msg('请选择订单',{icon:7});
            return;
        }
        layer.open({
            type: 1,
            title: '取消ebay订单',
            btn: ['确认','取消'],
            content: "loading",
            success: function(layero, index) {
                $(layero).find('.layui-layer-content').html($("#abnormalOrderWinit_cancelEbayTpl").html());
                layui.form.render();
            },
            yes: function(index, layero) {
                var cancelReason = $("#abnormalOrderWinit_cancelEbayForm input[name=cancelReason]:checked").val();
                //ebay取消订单
                initAjax('/platorder/winit/cancelorder/ebay.html', 'post', { ids:ids.join(","),cancelReason:cancelReason }, function(returnData) {
                    layui.admin.batchResultAlert("ebay取消订单完成:",returnData.data,function(){
                        $('#abnormalOrderWinitSearch').click();
                    });
                    layer.close(index);
                }, 'application/x-www-form-urlencoded')
            }
        })
    });
    $('#abnormalOrderWinit_matchLogis').click(function() {
        let ids = getTableSelectIds();
        if (!ids || ids.length < 1) {
            layer.msg('请选择订单',{icon:7});
            return;
        }
        initAjax('/platorder/winit/matchlogistype.html', 'post', { ids: ids.join(',') }, function(returnData) {
            layui.admin.batchResultAlert("匹配物流完成:",returnData.data,function(){
                $('#abnormalOrderWinitSearch').click();
            });
        }, 'application/x-www-form-urlencoded')
    })
    //页面按钮操作end

    function getTableSelectIds(){
        var checkStatus = table.checkStatus('abnormalOrderWinit_table')
        var data = checkStatus.data
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
        $('#abnormalOrderWinit_Tab ul').append(html)
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
            option += '<option value="' + (typeof data[i].code!='undefined'?data[i].code:data[i]) + '">' + (data[i].label || data[i]) + '</option>'
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
