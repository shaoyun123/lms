layui.use(['form', 'table', 'layer', 'element', 'laypage', 'upload', 'tableMerge', 'laydate', 'formSelects'], function() {
    var form = layui.form,
        table = layui.table,
        element = layui.element,
        laydate = layui.laydate,
        formSelects = layui.formSelects,
        laypage = layui.laypage;
    layer = layui.layer;
    form.render('select');
    var toDispatchOrderWinit_company = null,
        toDispatchOrderWinit_allstore = null,
        toDispatchOrderWinit_logisType = null,
        toDispatchOrderWinit_Site = null,
        toDispatchOrderWinit_formdata ={},
        toDispatchOrderWinit_pageEnum = null,
        toDispatchOrderWinit_Currency = null,
        toDispatchOrderWinit_companyType = "";
    laydate.render({
        elem: '#toDispatchOrderWinit_time',
        type: 'date',
        range: true
    });

    formSelects.render('storeAcct', { placeholder: '请先选择平台' });
     //渲染平台标记
     todispatchorderWinit_renderPlatCodeMark();
     function todispatchorderWinit_renderPlatCodeMark () {
         commonReturnPromise({
             url: '/lms/platorder/winit/listenum.html'
         }).then(res => {
             let { platTagList } = res;
             commonRenderSelect('todispatchorderWinit_platTags', platTagList).then(() => {
                 formSelects.render('todispatchorderWinit_platTags');
             });
         });
     }
    
    var nowdate = new Date()
    var endDate = Format(new Date(), 'yyyy-MM-dd')
    var onemonth = Format(new Date(nowdate - 30 * 24 * 3600 * 1000), 'yyyy-MM-dd')
    $('#toDispatchOrderWinit_time').val(onemonth + ' - ' + endDate)
    render_hp_orgs_users("#toDispatchOrderWinit_storeSalesPersonDiv");
    render_hp_orgs_users("#toDispatchOrderWinit_winitSalesPersonDiv");
    // 展示和隐藏 更多查询条件
    $('#showMoreSearchCondition_toDispatchOrderWinit').click(function () {
        var self = this
        if ($(self).hasClass('showExternal')) {
            $(self).closest('.layui-form').find('.externalContaintoDispatchOrderWinit').hide()
            $('#hide_icon_toDispatchOrderWinit').show()
            $('#show_icon_toDispatchOrderWinit').hide()
            $(self).removeClass('showExternal')
            toDispatchOrderWinitHasValue('toDispatchOrderWinitForm', 'showMoreSearchCondition_toDispatchOrderWinit');
        } else {
            $(self).closest('.layui-form').find('.externalContaintoDispatchOrderWinit').show()
            $('#hide_icon_toDispatchOrderWinit').hide()
            $('#show_icon_toDispatchOrderWinit').show()
            $(self).addClass('showExternal')
        }
    });

    function toDispatchOrderWinitHasValue (formId, btnId) {
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


    element.on('tab(toDispatchOrderWinit_tab)', function(data) {
        var winitOrderProcessStatus = data.elem.context.dataset.index
        $('#toDispatchOrderWinitForm input[name="winitOrderProcessStatus"]').val(winitOrderProcessStatus)
        $('#toDispatchOrderWinitSearch').click();
    });


    // 表单提交
    form.on('submit(toDispatchOrderWinitSearch)', function(data) {
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
            if($("#toDispatchOrderWinitForm select[name=company]").val()){
                let logisTypeIds = [];
                $("#toDispatchOrderWinitForm select[name=logisTypeIds] option").each(function () {
                    let logisTypeId = $(this).attr("value");
                    if(logisTypeId && logisTypeId!=0){
                        logisTypeIds.push(logisTypeId);
                    }
                });
                data.field.logisTypeIds = logisTypeIds.join(",");
            }
        }
        toDispatchOrderWinitTableorder(data.field)
    });

    //监听平台下拉选择
    form.on('select(todispacthplatCodes)', function(obj) {
        getStoreByPlatform(obj.value,function(returnData){
            appendSelect($('#toDispatchOrderWinitForm').find('select[_name="storeAcctIds"]'), returnData.data, 'id', 'storeAcct')
        })
    })

    //监听公司下拉选择
    form.on('select(todispacthcompanyType)', function(obj) {
        toDispatchOrderWinit_companyType = obj.value
            appendSelect($('#toDispatchOrderWinitForm').find('select[name="company"]'), toDispatchOrderWinit_company[toDispatchOrderWinit_companyType], 'id', 'cnName')
            form.render()
        })
        //监听物流公司下拉选择
    form.on('select(todispacthcompany)', function(obj) {
        var agent = "",
            logisticsCompanyId = "";
            toDispatchOrderWinit_companyType === 'agents' ? agent = obj.value : logisticsCompanyId = obj.value
        getAllLogicsType(agent, logisticsCompanyId,function(returnData){
            appendSelect($('#toDispatchOrderWinitForm').find('select[name="logisTypeIds"]'), returnData.data, 'id', 'name')
        })
        form.render()
    })


    //监听工具栏操作
    table.on("tool(toDispatchOrderWinit_table)", function(obj) {
        var event = event ? event : window.event;
        event.stopPropagation();
        var data = obj.data
        if (obj.event === "checkDetail") {
            todispatchorderNewandEdit(data)            
        } else if (obj.event === "toDispatchOrderWinit_sendEmail") { //发送邮件
            orderWinitSendEmail(data.id, data.platCode, function(){
            });
        } else if (obj.event === "toDispatchOrderWinit_issueRefund") { //
            orderIssueRefund(data, function(){
            });
        }else if(obj.event == 'toDispatchOrderWinit_remark'){//订单备注
            todispatchorderRemark(data)
        }
    });

    // 提交绑定订单标签
    function todispatchorderAddLabel(id,noteContent,func){
        initAjax('/unauditorder/addorderlabel.html', 'post', { id, noteContent }, function(returnData) {
            if (func) {
                func(returnData)
            }
        }, 'application/x-www-form-urlencoded')
    }

    //提交新增备注
    function todispatchorderaddRemark(id, noteContent, Type, func) {
        initAjax('/unauditorder/' + Type + '.html', 'post', { id, noteContent}, function(returnData) {
            if (func) {
                func(returnData)
            }
        }, 'application/x-www-form-urlencoded')
    }

    //备注弹框
    function todispatchorderRemark(data) {
        var tabIndex = 1
        layer.open({
            type: 1,
            title: '备注',
            btn: ['提交', '取消'],
            area: ['40%', '50%'],
            content: $('#todispatchorderwinit_remark').html(),
            success: function(layero, index) {
                //渲染textarea
                layero.find('textarea').val(data.orderNote || '');
                layero.find('#todispatchorderwinitremarkTab').find('li').click(function(){
                    tabIndex = $(this).attr('data-index')
                })
                appendSelect($(layero).find('select[name="noteContent"]'),toDispatchOrderWinit_pageEnum.orderLabels)
                data.noteContent = data.orderLabel
                form.val('todispatchorderwinitlabelForm',data)
                form.render()
                form.on('select(notetype)',function(obj){
                    var typeMap = {'addordernote':'orderNote','addpicknote':'pickNote'}
                    layero.find('textarea').val(data[typeMap[obj.value]])
                });
            },
            yes: function(index, layero) {
                form.on('submit(todispatchorderwinit_remark_submit)', function(obj) {
                    todispatchorderaddRemark(data.id, obj.field.noteContent, obj.field.notetype, function(returnData) {
                        layer.msg(returnData.msg || "修改备注成功")
                        layer.close(index)
                        $('#toDispatchOrderWinitSearch').click()
                    })
                })
                form.on('submit(todispatchorderwinit_label_submit)', function(obj) {
                    todispatchorderAddLabel(data.id, obj.field.noteContent, function(returnData) {
                        layer.msg(returnData.msg || "修改标签成功");
                        layer.close(index)
                        //触发表格搜索事件
                        $('#toDispatchOrderWinitSearch').click()
                    })
                })
                if(tabIndex=="1"){
                    $('#todispatchorderwinit_remark_submit').click()
                }else if(tabIndex=="2"){
                    $('#todispatchorderwinit_label_submit').click()
                }
            }
        })
    }



    getPageEnum();
    getAllCompanies();
    getStoreByPlatform('', function(returnData) {
        toDispatchOrderWinit_allstore = returnData.data
    });
    getAllLogicsType('', '', function(returnData) {
        toDispatchOrderWinit_logisType = returnData.data
    });
    getAlldevEmployee();
    getAllpurchaseEmployee();
    getAllSite();
    getCurrencyEnums();

    //页面批量下拉操作按钮初始化
    let overseaOper = new dropButton('toDispatchOrderWinit_overseaOper');
    let platOper = new dropButton('toDispatchOrderWinit_platOper');
    let logis = new dropButton('toDispatchOrderWinit_logis');
    let dealOrder = new dropButton('toDispatchOrderWinit_dealOrder');



    // 页面数据请求----------------------------------------
    //  获取页面枚举数
    function getPageEnum() {
        initAjax('/platorder/winit/listenum.html', 'post', {}, function(returnData) {
            toDispatchOrderWinit_pageEnum = returnData.data
            toDispatchOrderWinit_pageEnum.platCode = toDispatchOrderWinit_pageEnum.platCodes
            toDispatchOrderWinit_pageEnum.prodLogisAttrs = toDispatchOrderWinit_pageEnum.logisAttrs
            toDispatchOrderWinit_pageEnum.shippingCountryCodes = toDispatchOrderWinit_pageEnum.shippingCountrys
            toDispatchOrderWinit_pageEnum.warehouseId = toDispatchOrderWinit_pageEnum.prodWarehouses
            for (var i in returnData.data) {
                appendSelect($('#toDispatchOrderWinitForm').find('select[name="'+i+'"]'), returnData.data[i], 'name', 'value')
                appendSelect($('#toDispatchOrderWinitForm').find('select[_name="'+i+'"]'), returnData.data[i], 'name', 'value')
                if (i === 'winitOrderProcessStatus') {
                    appendTab(returnData.data[i])
                }
            }
            form.render()
            formSelects.render('logisAttrs')
            formSelects.render('shippingCountrys')
        })
    }
    //获取所有物流公司以及货代公司
    function getAllCompanies() {
        initAjax('/platorder/winit/listcompanyandagent.html', 'post', {}, function(returnData) {
            toDispatchOrderWinit_company = returnData.data
            appendSelect($('#toDispatchOrderWinitForm').find('select[name="company"]'), returnData.data.companys, 'id', 'cnName')
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
            // appendSelect($('#toDispatchOrderWinitForm').find('logisTypeIds'), returnData.data, 'id', 'name')
            // form.render()
            commonRenderSelect('todispatchorder_logisTypeIds',returnData.data, {
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
            appendSelect($('#toDispatchOrderWinitForm').find('select[name="preprodDevId"]'), returnData.data, 'id', 'loginName')
            form.render()
        })
    }

    //获站点接口
    function getAllSite(platCode, func) {
        initAjax('/enum/getSiteEnum.html?platCode=' + platCode, 'post', {}, function(returnData) {
            toDispatchOrderWinit_Site = returnData.data
            if (func) {
                func(returnData)
            }
        }, 'application/x-www-form-urlencoded')
    }

    //获取所有采购专员
    function getAllpurchaseEmployee() {
        initAjax('/sys/buyerList.html', 'post', {}, function(returnData) {
            appendSelect($('#toDispatchOrderWinitForm').find('select[name="purchasingAgentId"]'), returnData.data, 'id', 'loginName')
            form.render()
        })
    }

    // 获取所有页签数量
    function getAllTabNum(data){
        initAjax('/undispatch/winit/statuscount.html', 'post', data, function(returnData) {
           for(var i in returnData.data){
                $('#LAY-toDispatchOrderWinit #toDispatchOrderWinit_tab').find('li[data-index="'+i+'"]').find('span').text(returnData.data[i])
            }
        }, 'application/x-www-form-urlencoded')
    }

    function getCurrencyEnums() {
        initAjax('/sysdict/getCurrencyEnums.html', 'post', {}, function(returnData) {
            toDispatchOrderWinit_Currency = returnData.data
        })
    }

    //渲染表格数据
    function toDispatchOrderWinitTableorder(data) {
        table.render({
            elem: '#toDispatchOrderWinit_table',
            method: 'POST',
            url: ctx + '/undispatch/winit/list.html',
            where: data,
            cols: [
                [
                    { checkbox: true, width: 30 },
                    { title: "订单号", field: "id", templet: "#toDispatchOrderWinit_id_tpl" },
                    { title: "订单金额", field: "platOrderAmt", templet: "#toDispatchOrderWinit_platOrderAmt_tpl",width:120 },
                    { title: "商品", field: "prodQuantity", templet: "#toDispatchOrderWinit_prodQuantity_tpl" },
                    { title: "收件人", field: "shippingUsername", templet: "#toDispatchOrderWinit_shippingUsername_tpl" },
                    { title: "物流", field: "logisTypeName", templet: '#toDispatchOrderWinit_logisTypeName_tpl' },
                    { title: "时间", field: "time", templet: "#toDispatchOrderWinit_time_tpl" },
                    { title: "标签备注", templet: "#toDispatchOrderWinit_label_tpl" },
                    { title: "状态", field: "platOrderStatus", templet: "#toDispatchOrderWinit_platOrderStatus_tpl" },
                    { title: '操作', toolbar: "#toDispatchOrderWinit_option_tpl", width: 100 }
                ]
            ],
            page: false,
            limit:500,
            id: 'toDispatchOrderWinit_table',
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
                toDispatchOrderWinitPage(data,res.count)
                var tab = $('#LAY-toDispatchOrderWinit #toDispatchOrderWinit_tab').find('.layui-this')
                if(!isObjectValueEqual(data,toDispatchOrderWinit_formdata)){
                    getAllTabNum(data)
                    toDispatchOrderWinit_formdata = data
                }
                if (tab.length > 0) {
                    tab.find('span').text(res.count)
                } else {
                    $('#LAY-toDispatchOrderWinit #toDispatchOrderWinit_tab').find('li[data-index="' + data.winitOrderProcessStatus + '"]').addClass('layui-this').find('span').text(res.count)
                }
                $('.errorTipsClose').click(function(){
                    $(this).parents('.errorTips').remove()
                })
                let winitOrderProcessStatus = $('#LAY-toDispatchOrderWinit #toDispatchOrderWinit_tab').find('.layui-this').attr('data-index');
                //根据winitOrderProcessStatus 决定按钮是否显示
                if(!winitOrderProcessStatus ||winitOrderProcessStatus == 3 || winitOrderProcessStatus == 4 || winitOrderProcessStatus == 0){
                    //隐藏提交出库单
                    $("#toDispatchOrderWinit_towinit").hide();
                    //隐藏匹配物流
                    $("#toDispatchOrderWinit_matchLogis").hide();
                    //隐藏手动指定物流
                    $("#toDispatchOrderWinit_updatelogistype").hide();
                    //隐藏标记异常
                    $("#toDispatchOrderWinit_markException").hide();
                    //隐藏取消订单
                    $("#toDispatchOrderWinit_toCancel").hide();
                    //隐藏转待审核
                    $("#toDispatchOrderWinit_toAudit").hide();
                }else{
                    $("#toDispatchOrderWinit_towinit").show();
                    $("#toDispatchOrderWinit_matchLogis").show();
                    $("#toDispatchOrderWinit_updatelogistype").show();
                    $("#toDispatchOrderWinit_markException").show();
                    $("#toDispatchOrderWinit_toCancel").show();
                    $("#toDispatchOrderWinit_toAudit").show();
                }


                // var tbody = $('#toDispatchOrderWinit_table').next('.layui-table-view').find('.layui-table-body').find('tr[data-index=0]')
                // if (tbody.length > 0) {
                //     var ifBind = tbody.attr('data-ifBind')
                //     if (!ifBind) {
                //         setRowEvent('#toDispatchOrderWinit_table', '.toDispatchOrderWinit_col_id', 'click', function(dom) {
                //                 var index = $(dom).attr('data-index')
                //                 todispatchorderNewandEdit(res.data[index])
                //         }, ['.copyTxt', '.doubleClickToSet', '.laytable-cell-checkbox', '.freeClickBox', '[data-edit]'])
                //         tbody.attr('data-ifBind', '1')
                //     }
                // }
            }
        })

            //详情弹框
    function toDispathOrderwinitDetail(data) {
        layer.open({
            type: 1,
            title: '详情',
            btn:['关闭'],
            area: ['90%', '40%'],
            btnAlign: 'l',
            maxmin: true,
            content: $('#pop_todispathorderWinit_detail').html(),
            id:'pop_todispathorder_detail_id',
            success: function(layero, index) {
                detailpopflag = true
                table.render({
                    elem: '#pop_todispathorderWinit_detail_table',
                    method: 'POST',
                    data: data.orderDetails,
                    cols: [
                        [
                            { title: "图片", field: "imageUrl", templet: "#todispatchWinit_detail_img_tpl" },
                            { title: "Listing_ID", field: "itemId"},
                            { title: "店铺SKU", field: "storeSSku" },
                            { title: "注册SKU", field: "prodSSku" },
                            { title: "海外仓销售", field: "winitSalesPerson" },
                            { title: "商品名称", field: "prodTitle" },
                            { title: "入库要求", field: "packDesc" },
                            { title: '款式', field: "style" },
                            { title: '可用库存', field: "availableStock" },
                            { title: '商品成本(￥)', field: "prodUnitCost" },
                            { title: '累计净重(g)', field: "prodUnitWeight" },
                            { title: '报关信息', field: "style" },
                            { title: '销售单价', field: "platUnitPrice", templet:"<div><span class='gray'>{{d.currency||''}}</span> {{d.platUnitPrice}}</div>"},
                            { title: '销售数量', field: "platQuantity" },
                            { title: '销售金额', field: "platOrderDetailAmt", templet:"<div><span class='gray'>{{d.currency||''}}</span> {{d.platOrderDetailAmt}}</div>"}
                        ]
                    ],
                    page: false,
                    limit:500,
                    id: 'pop_todispathorderWinit_detail_table',
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
    }

    
    // 渲染页面分页
    function toDispatchOrderWinitPage(data,count){
        laypage.render({
            elem: 'toDispatchOrderWinitPage',
            curr: data.page,
            limit: data.limit,
            limits: [100, 200, 500,3000],
            layout: ['prev', 'page', 'next', 'count','limit'],
            count: count,
            jump: function(obj, first) {
                $('#toDispatchOrderWinitForm input[name="limit"]').val(obj.limit);//保障下次的分页请求中带有的值正确
                $('#toDispatchOrderWinitForm input[name="page"]').val(obj.curr);//保障下次的分页请求中带有的值正确
                //首次不执行
                if (!first) {
                    data.page = obj.curr;
                    data.limit = obj.limit;
                    $('#toDispatchOrderWinitSearch').click()
                }

            }
        });
    }
    //页面操作事件start
    //海外仓操作
    //1、提交海外仓出库单
    $("#toDispatchOrderWinit_towinit").click(function () {
        let ids = getTableSelectIds();
        if(!ids || ids.length<=0){
            layer.msg("未选择订单",{icon:0});
            return;
        }
        //提交到海外仓出库单
        toWinitOrder(ids.join(","), function(returnData) {
            layui.admin.batchResultAlert("提交海外仓出库单:",returnData.data,function(){
            });
        });
    });
    //2、同步海外仓跟踪号
    $("#toDispatchOrderWinit_syncwinittrackno").click(function () {
        let ids = getTableSelectIds();
        if(!ids || ids.length<=0){
            layer.msg("未选择订单",{icon:0});
            return;
        }
        //同步海外仓出库单跟踪号
        syncWinitTrackNo(ids.join(","), function(returnData) {
            //处理完成后不刷新页面
            layui.admin.batchResultAlert("同步海外仓出库单跟踪号:",returnData.data,function(){
            });
        });

    });
    //3、同步海外仓预估派送费
    $("#toDispatchOrderWinit_syncWinitOutOrderCalcFee").click(function () {
        let ids = getTableSelectIds();
        if(!ids || ids.length<=0){
            layer.msg("未选择订单",{icon:0});
            return;
        }
        //同步海外仓出库单跟踪号
        syncWinitOutOrderCalcFee(ids.join(","), function(returnData) {
            //处理完成后不刷新页面
            layui.admin.batchResultAlert("同步海外仓预估派送费:",returnData.data,function(){
            });
        });

    });
    //4、同步海外仓处理状态
    $("#toDispatchOrderWinit_syncWinitOutOrderStatus").click(function () {
        let ids = getTableSelectIds();
        if(!ids || ids.length<=0){
            layer.msg("未选择订单",{icon:0});
            return;
        }
        //同步海外仓出库单跟踪号
        syncWinitOutOrderStatus(ids.join(","), function(returnData) {
            //处理完成后不刷新页面
            layui.admin.batchResultAlert("同步海外仓出库单处理状态:",returnData.data,function(){
            });
        });

    });
    $("#toDispatchOrderWinit_dispatch").click(function () {
        let ids = getTableSelectIds();
        if (!ids || ids.length < 1) {
            layer.msg('请选择订单',{icon:7});
            return;
        }
        initAjax('/undispatch/dispatch.html', 'post', { ids: ids.join(",") }, function(returnData) {
            var html = '派至仓库:<br/>'
            for (var i in returnData.data) {
                html += returnData.data[i] + '<br/>'
            }
            layer.alert(html);
            //重新搜索
            $('#toDispatchOrderWinitSearch').click();
        }, 'application/x-www-form-urlencoded');
    });
    //取消wishpost订单
    $('#toDispatchOrderWinit_cancelwishpost').click(function() {
        var ids  =getTableSelectIds();
        if (ids.length <= 0) {
            layer.msg('请选择订单', {icon: 7});
            return
        }
        layer.open({
            type: 1,
            title: '取消wishpost订单',
            btn: ['确认', '取消'],
            area: ['40%', '60%'],
            content: "loading",
            success: function (layero, index) {
                $(layero).find('.layui-layer-content').html($("#toDispatchOrderWinit_cancelWishpostTpl").html());
                layui.form.render();
            },
            yes: function (index, layero) {
                var cancelReasonCode = $("#toDispatchOrderWinit_cancelWishpostForm select[name=cancelReasonCode]").val();
                var invalidReason = $("#toDispatchOrderWinit_cancelWishpostForm input[name=invalidReason]").val();
                //取消wishpost物流单
                initAjax('/platorder/cancelwishpost.html', 'post', {
                    ids: ids.join(','),
                    cancelReasonCode: cancelReasonCode,
                    invalidReason: invalidReason
                }, function (returnData) {
                    let str = returnData.data.join("<br>");
                    layer.alert(str);
                    //处理完成后刷新页面
                    $('#toDispatchOrderWinitSearch').click();
                    layer.close(index);
                }, 'application/x-www-form-urlencoded')
            }
        })
    });
    //手动指定跟踪号
    $('#toDispatchOrderWinit_updatelogistype').click(function() {
        var ids  =getTableSelectIds();
        if (ids.length <= 0) {
            layer.msg('请选择订单', {icon: 7});
            return
        }
        layer.open({
            type: 1,
            title: '手动指定物流',
            btn: ['确认', '取消'],
            area: ['40%', '60%'],
            content: "loading",
            success: function (layero, index) {
                $(layero).find('.layui-layer-content').html($("#toDispatchOrderWinit_updateLogisTypeTpl").html());
                //初始化物流公司
                appendSelect($('#toDispatchOrderWinit_updateLogisTypeForm').find('select[name="logisCompany"]'), toDispatchOrderWinit_company['companys'], 'id', 'cnName')
                //初始化物流方式
                initAjax('/platorder/winit/listlogistype.html', 'get', {}, function(returnData) {
                    appendSelect($('#toDispatchOrderWinit_updateLogisTypeForm').find('select[name="logisType"]'), returnData.data, 'id', 'name')
                    form.render()
                })
                //物流公司改变触发
                form.on('select(toDispatchOrderWinit_logisCompany)', function(obj) {
                    var agent = "",
                        logisticsCompanyId = obj.value;
                    initAjax('/platorder/winit/listlogistype.html', 'get', { agent, logisticsCompanyId }, function(returnData) {
                        appendSelect($('#toDispatchOrderWinit_updateLogisTypeForm').find('select[name="logisType"]'), returnData.data, 'id', 'name')
                        form.render()
                    })
                })
                layui.form.render();
            },
            yes: function (index, layero) {
                var logisTypeId = $("#toDispatchOrderWinit_updateLogisTypeForm select[name=logisType]").val();
                if(!logisTypeId){
                    layer.msg("未选择物流方式",{icon:7});
                    return;
                }
                //指定物流方式
                initAjax('/platorder/winit/updatelogistype.html', 'post', {
                    ids: ids.join(','),
                    logisTypeId: logisTypeId
                }, function (returnData) {
                    layui.admin.batchResultAlert("手动指定物流:",returnData.data,function(){
                        $('#toDispatchOrderWinitSearch').click();
                    });
                    layer.close(index);
                }, 'application/x-www-form-urlencoded')
            }
        })
    });
    //申请跟踪号
    $('#toDispatchOrderWinit_applylogisno').click(function() {
        var ids  =getTableSelectIds();
        if (ids.length <= 0) {
            layer.msg('请选择订单', {icon: 7});
            return
        }
        initAjax('/unauditorder/applylogistrackingno.html', 'post', { ids: ids.join(',') }, function(returnData) {
            let str = returnData.data.join("<br>");
            layer.alert(str);
            //处理完成后刷新页面
            $('#toDispatchOrderWinitSearch').click();
        }, 'application/x-www-form-urlencoded');
    });

    //清空跟踪号
    $('#toDispatchOrderWinit_removelogisno').click(function() {
        var ids  =getTableSelectIds();
        if (ids.length <= 0) {
            layer.msg('请选择订单', {icon: 7});
            return
        }
        initAjax('/unauditorder/removelogistrackingno.html', 'post', { ids: ids.join(',') }, function(returnData) {
            layer.msg('清空跟踪号成功', {icon: 1});
            //处理完成后刷新页面
            $('#toDispatchOrderWinitSearch').click();
        }, 'application/x-www-form-urlencoded');
    });

    //打印物流模板
    $('#toDispatchOrderWinit_printlogistpl').click(function() {
        var ids  =getTableSelectIds();
        if (ids.length <= 0) {
            layer.msg('请选择订单', {icon: 7});
            return
        }
        initAjax('/unauditorder/printlogistpl.html', 'post', { ids: ids.join(',') }, function(returnData) {
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
    });
    //标记异常
    $('#toDispatchOrderWinit_markException').click(function() {
        var ids  =getTableSelectIds();
        if (!ids || ids.length < 1) {
            layer.msg('请选择订单',{icon:7});
            return;
        }
        initAjax('/platorder/winit/markabnormal.html', 'post', { ids: ids.join(',') }, function(returnData) {
            layui.admin.batchResultAlert("订单标记异常:",returnData.data,function(){
                $('#toDispatchOrderWinitSearch').click();
            });
        }, 'application/x-www-form-urlencoded')
    });
    //转取消订单
    $('#toDispatchOrderWinit_toCancel').click(function() {
        let ids = getTableSelectIds();
        if (!ids || ids.length < 1) {
            layer.msg('请选择订单',{icon:7});
            return;
        }
        initAjax('/platorder/winit/tocancel.html', 'post', { ids: ids.join(",") }, function(returnData) {
            layui.admin.batchResultAlert("转取消订单:",returnData.data,function(){
                $('#toDispatchOrderWinitSearch').click();
            });
        }, 'application/x-www-form-urlencoded');
    });
    //直接转已发货
    $('#toDispatchOrderWinit_toShipped').click(function() {
        let ids = getTableSelectIds();
        if (!ids || ids.length < 1) {
            layer.msg('请选择订单',{icon:7});
            return;
        }
        initAjax('/platorder/winit/toshipped.html', 'post', { ids: ids.join(',') }, function(returnData) {
            layui.admin.batchResultAlert("直接转已发货:",returnData.data,function(){
                $('#toDispatchOrderWinitSearch').click();
            });
        }, 'application/x-www-form-urlencoded')
    });
    //匹配物流方式
    $('#toDispatchOrderWinit_matchLogis').click(function() {
        let ids = getTableSelectIds();
        if (!ids || ids.length < 1) {
            layer.msg('请选择订单',{icon:7});
            return;
        }
        initAjax('/platorder/winit/matchlogistype.html', 'post', { ids: ids.join(',') }, function(returnData) {
            layui.admin.batchResultAlert("匹配物流完成:",returnData.data,function(){
                $('#toDispatchOrderWinitSearch').click();
            });
        }, 'application/x-www-form-urlencoded')
    })
    //转待审核
    $('#toDispatchOrderWinit_toAudit').click(function() {
        let ids = getTableSelectIds();
        if (!ids || ids.length < 1) {
            layer.msg('请选择订单',{icon:7});
            return;
        }
        initAjax('/platorder/winit/toaudit.html', 'post', { ids: ids.join(",") }, function(returnData) {
            layui.admin.batchResultAlert("订单转待审核:",returnData.data,function(){
                $('#toDispatchOrderWinitSearch').click();
            });
        }, 'application/x-www-form-urlencoded');
    });
    //平台操作
    $("#toDispatchOrderWinit_cancelOrderEbay").click(function () {
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
                $(layero).find('.layui-layer-content').html($("#toDispatchOrderWinit_cancelEbayTpl").html());
                layui.form.render();
            },
            yes: function(index, layero) {
                var cancelReason = $("#toDispatchOrderWinit_cancelEbayForm input[name=cancelReason]:checked").val();
                //ebay取消订单
                initAjax('/platorder/winit/cancelorder/ebay.html', 'post', { ids:ids.join(","),cancelReason:cancelReason }, function(returnData) {
                    layui.admin.batchResultAlert("ebay取消订单完成:",returnData.data,function(){
                        $('#toDispatchOrderWinitSearch').click();
                    });
                    layer.close(index);
                }, 'application/x-www-form-urlencoded')
            }
        })
    });
    //同步订单状态
    $('#toDispatchOrderWinit_syncOrderStatus').click(function() {
        let ids = getTableSelectIds();
        if (ids.length > 0) {
            syncOrderStatus(ids)
        } else {
            layer.msg('请选择订单',{icon:7});
        }
    })
    //标记发货
    $('#toDispatchOrderWinit_markDelivery').click(function() {
        let ids = getTableSelectIds();
        if (ids.length > 0) {
            markDelivery(ids)
        } else {
            layer.msg('请选择订单',{icon:7});
        }
    })

    //提交到海外仓海外仓出库单
    function toWinitOrder(ids, func) {
        initAjax('/undispatch/winit/towinit.html', 'post', { ids:ids }, function(returnData) {
            if (func) {
                func(returnData)
            }
        }, 'application/x-www-form-urlencoded')
    }
    //同步海外仓海外仓出库单单号
    function syncWinitTrackNo(ids, func) {
        initAjax('/undispatch/winit/syncwinittrackno.html', 'post', { ids:ids }, function(returnData) {
            if (func) {
                func(returnData)
            }
        }, 'application/x-www-form-urlencoded')
    }
    //同步海外仓预估派送费
    function syncWinitOutOrderCalcFee(ids, func) {
        initAjax('/undispatch/winit/syncwinitoutordercalcfee.html', 'post', { ids:ids }, function(returnData) {
            if (func) {
                func(returnData)
            }
        }, 'application/x-www-form-urlencoded')
    }
    //同步海外仓预估派送费
    function syncWinitOutOrderStatus(ids, func) {
        initAjax('/undispatch/winit/syncwinitoutorderstatus.html', 'post', { ids:ids }, function(returnData) {
            if (func) {
                func(returnData)
            }
        }, 'application/x-www-form-urlencoded')
    }
    /**
     * 同步订单状态
     * @param {订单号} ids
     */
    function syncOrderStatus(ids) {
        var ids = ids.join(',')
        initAjax('/platorder/winit/syncplatstatus.html', 'post', { ids: ids }, function(returnData) {
            layui.admin.batchResultAlert("同步订单状态:",returnData.data,function(){
                $('#toDispatchOrderWinitSearch').click();
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
            layui.admin.batchResultAlert("标记平台发货:",returnData.data,function(){
                $('#toDispatchOrderWinitSearch').click();
            });
        }, 'application/x-www-form-urlencoded')
    }
    //页面操作事件end
    function getTableSelectIds(){
        var checkStatus = table.checkStatus('toDispatchOrderWinit_table')
        var data = checkStatus.data
        var ids = (data || []).map(function(item) {
            return item.id
        });
        return ids;
    }

    function modifyAddress(data,func){
        initAjax('/undispatch/winit/updateShippingAddress.html', 'post', data, function(returnData) {
            if(func){
                func(returnData)
            }
        },'application/x-www-form-urlencoded')
    }

    var addressOption=['shippingUsername','shippingPhoneNumber','shippingZip','shippingStreet1','shippingStreet2','shippingCity','shippingState','shippingCountryCode']

            //修改订单
            function todispatchorderNewandEdit(data) {
                edit_order_tableIns = null;
                var concatData = []
                layer.open({
                    type: 1,
                    title: '查看详情 - ' + data.id,
                    btn: ['修改地址', '取消'],
                    area: ['90%', '80%'],
                    maxmin: true,
                    content: $('#pop_todispatchorder_newandeditorder').html(),
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
                        // appendSelect($('#todispatchorder_editForm').find('select[name="storeAcctId"]'), toDispatchOrderWinit_allstore, 'id', 'storeAcct', 'platCode')
                        appendSelect($('#todispatchorder_editForm').find('select[name="warehouseId"]'), toDispatchOrderWinit_pageEnum.prodWarehouses, 'name', 'value')
                        appendSelect($('#todispatchorder_editForm').find('select[name="logisTypeId"]'), toDispatchOrderWinit_logisType, 'id', 'name')
                        appendSelect($('#todispatchorder_editForm').find('select[name="siteId"]'), toDispatchOrderWinit_Site, 'code', 'name')
                        appendSelect($('#todispatchorder_editForm').find('select[name="currency"]'), toDispatchOrderWinit_Currency, 'code', 'name')
                        if (data) {
                            data.orderTimeCn = Format(data.orderTimeCn,'yyyy-MM-dd hh:mm:ss')
                            form.val("todispatchorder_editForm", data);
                            // storeSelected($('#todispatchorder_editForm select[name="storeAcctId"]'),data.storeAcctId.toString())
                            getAllSite(data.platCode,function(returnData){
                                appendSelect($('#todispatchorder_editForm').find('select[name="siteId"]'), returnData.data, 'code', 'name')
                                Selected($('#todispatchorder_editForm select[name="siteId"]'),data.siteId)
                                form.render()
                            })
                            getStoreByPlatform(data.platCode, function(returnData) {
                                appendSelect($('#todispatchorder_editForm').find('select[name="storeAcctId"]'), returnData.data, 'id', 'storeAcct')
                                Selected($('#todispatchorder_editForm select[name="storeAcctId"]'), data.storeAcctId)
                                form.render()
                            });
                            for(var i in data){
                                if(addressOption.indexOf(i)<0){
                                    $('#todispatchorder_editForm').find('[name="'+i+'"]').attr('disabled',true)
                                }
                            }
                            concatData = data.orderDetails
                            edit_order_tableIns = todispatchProdTableRender(concatData)
                        }
                        form.render()
                    },
                    yes: function(index, layero) {
                        form.on('submit(edit_submit)', function(obj) {
                            var data = obj.field;
                            const {id,shippingUsername,shippingPhoneNumber,shippingZip,shippingStreet1,shippingStreet2,shippingCity,shippingState,shippingCountryCode}=data
                            modifyAddress({id,shippingUsername,shippingPhoneNumber,shippingZip,shippingStreet1,shippingStreet2,shippingCity,shippingState,shippingCountryCode},function(returnData){
                                layer.msg(returnData.msg||'修改成功')
                            })
                        })
                        $(layero).find('#edit_submit').click();
                    },
                })
            }
    
                //渲染商品信息表格
        function todispatchProdTableRender(data) {
            tableIns = table.render({
                elem: '#todispatchorder_product_table',
                id: 'todispatchorder_product_table',
                data: data || [],
                cols: [
                    [
                        { title: "图片", field: "imageUrl", templet: "#todispatch_detail_img_tpl" },
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
          if ((propName!="winitOrderProcessStatus")&&a[propName] !== b[propName]) {
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
        $('#toDispatchOrderWinit_tab ul').append(html)
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
