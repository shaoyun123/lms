layui.use(['form', 'table', 'layer', 'element', 'laypage', 'upload', 'tableMerge', 'laydate', 'formSelects', 'admin', 'laytpl'], function () {
    var form = layui.form,
        table = layui.table,
        element = layui.element,
        laydate = layui.laydate,
        formSelects = layui.formSelects,
        laypage = layui.laypage;
    layer = layui.layer;
    laytpl = layui.laytpl;

    form.render("select");
    laydate.render({
        elem: "#performanceSelection_time",
        type: "datetime",
        inputAuto: true,
        range: true,
        showShortcuts: true,
    });
    var nowdate = new Date(new Date().toLocaleDateString()).getTime()
    var endDate = Format(nowdate + 24 * 60 * 60 * 1000 - 1, 'yyyy-MM-dd hh:mm:ss')
    var onemonth = Format(new Date(nowdate - 7 * 24 * 3600 * 1000), 'yyyy-MM-dd hh:mm:ss')
    $('#performanceSelection_time').val(onemonth + ' - ' + endDate)//近7天


    //选项卡点击事件
    element.on('tab(performanceSelection_Tab)', function (data) {
        var index = data.elem.context.dataset.index;
        // 获取 columnApi 对象
        var columnApi = performanceSelection_gridOptions.columnApi;
        if (index == 0) {//未确认
            $('#semiSwitchShipStatus_val').val(1);
            // 根据列的 field 名称增加列
            columnApi.setColumnVisible('colTime', true);
        } else if (index == 1) {//已确认
            $('#semiSwitchShipStatus_val').val(0);
            // 根据列的 field 名称删除列
            columnApi.setColumnVisible('colTime', false);
        } else if (index == 2) {//全部
            $('#semiSwitchShipStatus_val').val('');
            // 根据列的 field 名称增加列
            columnApi.setColumnVisible('colTime', true);
        }
        // 增加或删除列后调整表格宽度以适应新的列配置
        performanceSelection_gridOptions.api.sizeColumnsToFit();
        $('#performanceSelectionSearch').click();
    });

    // 表单提交
    form.on('submit(performanceSelectionSearch)', function (data) {
        if (data.field.time) {
            data.field.orderTimeStart = data.field.time.split(' - ')[0];
            data.field.orderTimeEnd = data.field.time.split(' - ')[1];
        }

        for (let key in data.field) {
            data.field[key] = $.trim(data.field[key]);
        }
        performanceSelectionTable(data.field)
    });
    // 部门-销售-店铺 联动
    performanceAddOrg('performanceSelection', form, 'aliexpress')

    //  //监听工具栏操作
    //  table.on("tool(performanceSelection_table)", function (obj) {
    //     var event = event ? event : window.event;
    //     event.stopPropagation();
    //     var data = obj.data
    //     if (obj.event === "") {
    //     }
    // });

    let performanceSelection_immutableStore = [];
    const performanceSelection_gridOptions = {
        columnDefs: [
            {
                width: 45,
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
                    // 重寄订单
                    // 店铺客服
                    const customServicerHtml = d.customServicer ? `[${d.customServicer}]` : ''
                    // 点击订单跳转到订单详情
                    let platOrderIdHtml = `<a id="toAudit_table_platOrderId">${d.platOrderId}</a>`
                    if (CommonPlatFormOrderDetailEnum.includes(d.platCode)) {
                        platOrderIdHtml = `<a id="toAudit_table_platOrderId" style="color:#1E90FF" name="jumpToPlatformOrder">${d.platOrderId}</a>`
                    }
                    return `<div class="alignLeft">
                        <p id="toAudit_table_storeAcct">${d.storeAcct || ""}[${d.shopId || ""}]</p>
                        <p>[${d.salesPersons || ""}][${d.sellLeaderName || ""}]${customServicerHtml}</p>
                        ${platOrderIdHtml}
                        <span onclick="layui.admin.onlyCopyTxt('${d.platOrderId}',event)" style="display: ${d.platOrderId ? 'inline-block' : 'none'}" class="copy-icon">
                            <svg t="1710754196184" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2392" width="16" height="16"><path d="M768 832q-0.992 54.016-37.504 90.496T640 960H192q-54.016-0.992-90.496-37.504T64 832V384q0.992-54.016 37.504-90.496T192 256v64q-27.008 0.992-44.992 19.008T128 384v448q0.992 27.008 19.008 44.992T192 896h448q27.008-0.992 44.992-19.008T704 832h64zM384 128q-27.008 0.992-44.992 19.008T320 192v448q0.992 27.008 19.008 44.992T384 704h448q27.008-0.992 44.992-19.008T896 640V192q-0.992-27.008-19.008-44.992T832 128H384z m0-64h448q54.016 0.992 90.496 37.504T960 192v448q-0.992 54.016-37.504 90.496T832 768H384q-54.016-0.992-90.496-37.504T256 640V192q0.992-54.016 37.504-90.496T384 64z" p-id="2393" fill="#aaaaaa"></path></svg>
                        </span>
                    </div>`
                }
            },
            {
                wrapText: true,
                autoHeight: true,
                headerName: '订单金额',
                cellRenderer: (data) => {
                    let d = data.data, str = '';
                    //利润计算逻辑
                    let amtDom = d.platShippingAmt ? `<span>(${d.platShippingAmt})</span>` : "";
                    str +=
                        `<div class="alignLeft">
                        <div><span class='gray'>${d.currency || ""}</span><span id="toAudit_table_platOrderAmt">${d.platOrderAmt === undefined ? '' : d.platOrderAmt}</span></div>
                        <div><span class='gray'>CNY</span><span id="toAudit_table_platOrderAmt">${d.platOrderAmtCn === undefined ? '' : d.platOrderAmtCn}</span></div>
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
                field: "shippingCountryCnName",
                wrapText: true,
                autoHeight: true,
                cellRenderer: (data) => {
                    let d = data.data
                    const _buyerNote = d.buyerNote || ""
                    const _buyerNoteCopyHtml = `<a class="hidden">${_buyerNote}</a>
                    <button
                        name="performance_copy"
                        class="layui-btn layui-btn-primary layui-btn-xs copyTxt"
                        onclick="layui.admin.copyTxt(this)"
                    >
                        复制
                    </button>`

                    return `<div class="alignLeft">
                        <div id="">${d.shippingUsername || ""}</div>
                        <div>
                        [${d.shippingCountryCnName || ""}]
                        </div>
                        <div data-text="${_buyerNote}" onmouseenter="allBuyerTipsShow(this)" onmouseleave="allBuyerTipsHide(this)">
                            <span class="pora copySpan">
                                <span class="gray">留言：</span>${_buyerNote.slice(0, 46)}
                                ${_buyerNote ? _buyerNoteCopyHtml : ''}
                            </span>
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
                    return `<div class="alignLeft">
                        <div><span class="gray">买家：</span><span id="toAudit_table_buyerRequireShippingType">${d.buyerRequireShippingType || ""}</span></div>
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
                        <div><span class="gray">订单：</span><span id="toAudit_table_orderTimeCn">${Format(d.orderTimeCn || "", 'yyyy-MM-dd hh:mm:ss')}</span></div>
                    </div>`
                }
            },
            {
                headerName: '处理人',
                width: 100,
                wrapText: true,
                autoHeight: true,
                cellRenderer: (data) => {
                    let d = data.data
                    let html = `<div class="alignLeft">
                      <div>${d.processingPersonName || ''}</div>
                    </div>`
                    return html
                }
            },
            {
                headerName: '处理时间',
                width: 210,
                wrapText: true,
                autoHeight: true,
                cellRenderer: (data) => {
                    let d = data.data
                    return `<div class="alignLeft">
                        <div>${Format(d.processingTime || "", 'yyyy-MM-dd hh:mm:ss') || ''}</div>
                    </div>`
                }
            },
            {
                headerName: '剩余处理时间',
                field:'colTime',
                width: 210,
                wrapText: true,
                autoHeight: true,
                cellRenderer: (data) => {
                    let d = data.data
                    let time_html= ''
                    if(d.semiSwitchShipStatus){
                        time_html=`<div class="alignLeft">
                                <div>${d.remainingProcessingTime || ''}</div>
                            </div>`
                    }else{
                        time_html=`<div class="alignLeft"></div>`
                    }
                    return time_html
                }
            },
            {
                field: '操作',
                width: 100,
                wrapText: true,
                autoHeight: true,
                cellRenderer: (data) => {
                    let d = data.data
                    let btn_html = ''
                    if (d.semiSwitchShipStatus) {
                        btn_html = '<button name="performance_selection_btn" class="layui-btn layui-btn-normal layui-btn-xs">履约选择</button>'
                    }
                    return `${btn_html}`;
                }
            }
        ],
        rowData: performanceSelection_immutableStore,
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
            performanceSelection_gridOptions.columnApi.applyColumnState({ state: JSON.parse(window.localStorage.getItem("allStatusOrderColumnState")) });
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
            //event.data 选中的行内数据，event.event 为鼠标事件
            handleTableOptions(event);
        },
        onCellMouseDown: function (event) {
            timeStamp = event.event.timeStamp
        }
    };

    var timeStamp;

    var gridDiv = document.querySelector('#performanceSelection_table');
    agGrid.LicenseManager.setLicenseKey(
        "IRDEVELOPERS_COM_NDEwMjM0NTgwMDAwMA==f08aae16269f416fe8d65bbf9396be5f");
    new agGrid.Grid(gridDiv, performanceSelection_gridOptions);

    //渲染表格数据
    function performanceSelectionTable(data) {
        if(!data.storeAcctIds){
            data.storeAcctIds=$('#performanceSelection_store').attr('acct_ids')||'';
        }
        commonReturnPromiseRes({
            url: ctx + '/aucplatorder/listorder.html ',
            type: 'POST',
            params: data
        }).then(function (result) {
            let profit = 0, platOrderAmt = 0;
            // 商品种类||数量
            if (result.count != 0) {
                let skuQuantity = 0, prodQuantity = 0;
                result.data.forEach(item => {
                    skuQuantity = skuQuantity + item.skuQuantity * 1;
                    prodQuantity = prodQuantity + item.prodQuantity * 1;
                    profit = profit + item.profit * 1; // 利润
                    platOrderAmt = (platOrderAmt || 0) + (item.exchangeRate * item.platOrderAmt || 0); // 金额
                })
                let profitRate = ((profit / platOrderAmt) * 100).toFixed(1)
                $("#performanceSelection_table").find("[col-id=3] .ag-header-cell-text").attr('lay-tips', `种类${skuQuantity} || 数量${prodQuantity}`)
                $("#performanceSelection_table").find("[col-id=3] .ag-header-cell-text").text(`商品 种类${skuQuantity} || 数量${prodQuantity}`)
            } else {
                $("#performanceSelection_table").find("[col-id=3] .ag-header-cell-text").text(`商品 种类0 || 数量0`)
            }

            performanceSelection_immutableStore = result.data;
            performanceSelection_gridOptions.api.setRowData(performanceSelection_immutableStore);
            
            // 渲染tab中的count数，复制原来的--start
            performanceOrderPage(data, result.count);
            // extra: "2&6&8"
            let extra = result.extra.split('&');
            $("#performance_selection_span0").html(extra[0]||0);
            $("#performance_selection_span1").html(extra[1]||0);
            $("#performance_selection_span2").html(extra[2]||0);
            // 复制原来的--end
        }).catch(function (err) {
            layer.msg(err, { icon: 2 });
        })
    }
    function handleTableOptions(event) {
        let optionEvent = event.event.target.name,
            data = event.data;// 获取选中行数据
        let rowIndex = event.rowIndex;
        if (optionEvent == 'performance_selection_btn') {//履约选择按钮
            selestPerformanceType(data, rowIndex)
        } else if (optionEvent == 'performance_copy') {//收件人列的复制按钮
        } else {
            performanceSelectionDetailFn(data, performanceSelection_gridOptions, 'allStatusOrder');
        }
    }
    // 渲染页面分页
    function performanceOrderPage(data, count) {
        laypage.render({
            elem: 'performanceSelectionPage',
            curr: data.page,
            limit: data.limit,
            limits: [500, 1000, 2000],
            layout: ['prev', 'page', 'next', 'count', 'limit'],
            count: count,
            jump: function (obj, first) {
                $('#performanceSelectionForm input[name="limit"]').val(obj.limit);//保障下次的分页请求中带有的值正确
                $('#performanceSelectionForm input[name="page"]').val(obj.curr);//保障下次的分页请求中带有的值正确
                //首次不执行
                if (!first) {
                    data.page = obj.curr;
                    data.limit = obj.limit;
                    $('#performanceSelectionSearch').click()
                }
            }
        });
    }
    function selestPerformanceType(data, rowIndex) {
        layer.open({
            title: '履约方式选择',
            content: $('#selestPerformanceTypeDiv_con').html(),
            btn: ['确定', '取消'],
            area: '30%',
            offset: '20%',
            success: function (layero, index) {
                var getTpl = $("#selestPerformanceTypeTpl").html(),
                    view = $("#selestPerformanceTypeDiv")[0];
                laytpl(getTpl).render(data, function (html) {
                    view.innerHTML = html
                    form.render()
                })
                $(".shipping_method_div").click(function () {
                    $(".shipping_method_div").removeClass('shipping_method_active');
                    $(this).addClass('shipping_method_active');
                    $(".shipping_method_div").find('.shipping_method_input input').prop('checked', false);
                    $(this).find('.shipping_method_input input').prop('checked', true);
                });
            },
            yes: function (index, layero) {
                let orderId = $("#selestPerformanceTypeDiv .shipping_method_active").attr('orderId');
                let shippingMethodCode = $("#selestPerformanceTypeDiv .shipping_method_active input").val();
                let params = {
                    orderId,
                    shippingMethodCode
                };

                commonReturnPromise({
                    url: `/lms//aucplatorder/changeSendMode.html`,
                    type: 'get',
                    params: params
                }).then(res => {
                    layer.msg('履约方式选择成功');
                    performanceSelection_gridOptions.api.updateRowData({ remove: [data] });//[data]=>模拟选中的数据，删除
                    // 履约方式提交成功之后，在未确认状态消失，转移到已确认状态中
                    $('#performance_selection_span0').html(Number($('#performance_selection_span0').text()) - 1);
                    $('#performance_selection_span1').html(Number($('#performance_selection_span1').text()) + 1);
                });
            }
        });
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
                    { title: "商品SKU", field: "prodSSku" }, //
                    { title: "库位", field: "stockLocation" },
                    { title: "商品名称", field: "prodTitle" },
                    { title: "入库要求", field: "packDesc" },
                    { title: '款式', field: "style" },
                    { title: '可用库存', field: "availableStock" },
                    { title: '商品成本（￥）', field: "prodUnitCost" },
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
            done: function (res) {
                imageLazyload();
                table.on("tool(toAuditOrder_product_table)", function (obj) {
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
    window.getprocessStatus = function (status) {
        var processStatusArr = allStatusOrder_pageEnum.processStatus
        for (var item of processStatusArr) {
            if (item.name == status) {
                return item.value
            }
        }
    }
    function getTableSelectIds() {
        // var checkStatus = table.checkStatus('allStatusOrder_table')
        // var data = checkStatus.data
        let data = allStatusOrder_gridOptions.api.getSelectedRows();
        var ids = (data || []).map(function (item) {
            return item.id
        });
        return ids;
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
        if (Array.isArray(data)) {
            let acctIds = data.map(item => item.code !== undefined ? item.code : item)
            aDom.attr('acct_ids', acctIds.join(','))
        }
        aDom.append(option)
    }
    function getIndex(id, arr, value) { //获取某个取值属性在对象数组中的下标
        for (var i = 0; i < arr.length; i++) {
            if (value == arr[i][id]) {
                return i;
            }
        }
        return -1;
    }


    function performanceSelectionDetailFn(data, gridOptions) {
        layui.use(["admin", "form", "laytpl"], function () {
            var admin = layui.admin
            var form = layui.form
            var laytpl = layui.laytpl
            var hasDetailLayer = $("#performance_detailTabs")
            var orderId = data.id
            var lastIndex = null
            var lastColIndex = null
            var lastId = null
            // 申报价 页面
            //   const declaredValPageList = ["toDespatchOrder", "allStatusOrder"]
            //   const curPage = window.location.href.split("/").slice(-1)[0]
            //   data.declaredValTag = declaredValPageList.includes(curPage)
            data.orderDetails = data.orderDetails.sort(function (a, b) {
                return a.availableStock - b.availableStock
            })
            let newArr = delSameObjValue(data.orderDetails, 'allCount', ['prodSSku'], ['prodQuantity']);
            data.orderDetails.forEach((item,index) => {
              //ztt20230912-数据结构中增加prodCost,costPrice
              item.costPrice = data.costPrice || 0;
              item.prodCost = data.prodCost || 0;


                newArr.forEach(cItem => {
                    if (item.prodSSku == cItem.prodSSku) {
                        item.allCount = cItem.allCount
                    }
                })
            })
            data['prodSSkuOrderBy'] = data['availableStockOrderBy'] = data['allCountOrderBy'] = '';

            if (hasDetailLayer.length > 0) {
                var getTpl = $("#performance_detailTab1ContainerTpl").html(),
                    view = $("#performance_detailTab1Container")[0]
                laytpl(getTpl).render(data, function (html) {
                    view.innerHTML = html
                    form.render()

                    var $layerTitle = $("#performance_detailTab1Container").parents(".layui-layer.layui-layer-page").find(".layui-layer-title")
                    $layerTitle.text(`订单详情 - ${data.platOrderId||''}`)
                })
                //渲染日志
                commonReturnPromise({
                    type: 'post',
                    url: '/lms/orderlog/listorderlog.html',
                    params: {
                        orderId: orderId
                    }
                }).then(result => {
                    var getTpl2 = $('#performance_detailTab2ContainerTpl').html(),
                        view2 = document.getElementById('performance_detailTab2Container');
                    laytpl(getTpl2).render(result, function (html) {
                        view2.innerHTML = html;
                    });
                }).catch(err => {
                    layer.msg(err, { icon: 2 });
                });
            } else {
                layer.open({
                    type: 1,
                    title: "订单详情 - " + data.platOrderId||'',
                    offset: "b",
                    maxmin: true,
                    shade: false,
                    id: orderId,
                    area: ["100%", "40%"],
                    success: function (layero, index) {
                        layui
                            .view(data.id)
                            .render("route/customer/aliexpress/performanceDetail")
                            .done(function () {
                                var getTpl = layero.find("#performance_detailTab1ContainerTpl").html(),
                                    view = layero.find("#performance_detailTab1Container")[0]
                                laytpl(getTpl).render(data, function (html) {
                                    view.innerHTML = html
                                    form.render()
                                })
                                //渲染日志
                                commonReturnPromise({
                                    type: 'post',
                                    url: '/lms/orderlog/listorderlog.html',
                                    params: {
                                        orderId: orderId
                                    }
                                }).then(result => {
                                    var getTpl2 = layero.find('#performance_detailTab2ContainerTpl').html(),
                                        view2 = layero.find('#performance_detailTab2Container')[0];
                                    laytpl(getTpl2).render(result, function (html) {
                                        view2.innerHTML = html;
                                    });
                                }).catch(err => {
                                    layer.msg(err, { icon: 2 });
                                });
                                this.upDownKeyDown = function (event) {
                                    if (gridOptions && (event.keyCode === 38 || event.keyCode === 40)) {
                                        let curCell = gridOptions.api.getFocusedCell()
                                        // 如果弹窗未关闭，鼠标点击其它地方，cell的选中效果就会没有，所以添上cell选中的效果
                                        let rowIndex = lastIndex
                                        let colIndex = lastColIndex
                                        if (curCell) {
                                            rowIndex = curCell.rowIndex
                                            colIndex = curCell.column.instanceId
                                        }
                                        let curData = null
                                        gridOptions.api.forEachLeafNode(function (node, index) {
                                            if (index == rowIndex) {
                                                curData = node.data
                                            }
                                        })
                                        const firstCol = gridOptions.columnApi.getAllDisplayedColumns()[colIndex]
                                        gridOptions.api.setFocusedCell(rowIndex, firstCol)
                                        if (lastId != curData.id) {
                                            performanceSelectionDetailFn(curData, gridOptions)
                                        }
                                        if (curCell) {
                                            lastIndex = curCell.rowIndex
                                            lastColIndex = curCell.column.instanceId
                                        }
                                        lastId = curData.id
                                    }
                                }
                                $(document).on("keydown", this.upDownKeyDown) //监听键盘事件，关闭层
                            })
                    },
                    end: function () {
                        $(document).off("keydown", this.upDownKeyDown) //解除键盘关闭事件
                        gridOptions.api.clearFocusedCell()
                    },
                })
            }
        })
    }

}
);
function allBuyerTipsShow(dom) {
    const contentshow = $(dom).attr('data-text');
    if (contentshow) {
        layui.layer.tips(`<span style="color:#008B8B">${contentshow}</span>`, $(dom), {
            tips: [1, '#fff'],
            time: 0,
        });
    }
}
function allBuyerTipsHide() {
    layui.layer.closeAll("tips");
}
// 平台-部门-销售
function performanceAddOrg(prefix, form, platCode = '') {
    let formDom = $(`#${prefix}Form`);
    // 1.销售；2.客服；type=salesperson:代表销售人员。type=customservicer:代表客服人员
    let salerAndcustomType = { 1: 'salesperson', 2: 'customservicer', 3: 'leaderId', 4: 'directorId' }
    let filter = `${prefix}_salerAndcustomSelectFilter`;
    let id = `${prefix}_salePersonsSelect`;
    let salerAndcustom = $(`[lay-filter=${filter}]`).val();
    let orgSelect = formDom.find('.orgs_hp_custom');
    var userSelect = formDom.find('.users_hp_custom');
    var userIsXm = userSelect.attr('xm-select') != null //用户下拉框是否多选
    var storeSelect = formDom.find('.users_hp_store_multi')
    // 获取默认展示信息
    layui.use('formSelects', function () {
        let form = layui.form,
            formSelects = layui.formSelects;
        if (platCode == '') {
            // 部门 单选
            orgSelect.empty()
            // 销售1&客服2&主管4&组长3 多选
            userSelect.empty()
            // 店铺 多选
            storeSelect.empty()
            layui.form.render('select')
            formSelects.render(`${prefix}_salePersonsSelect`)
            formSelects.render(`${prefix}_store`)
        }
        Promise.all([
            getPersonAndOrgsByRole({
                platCode: platCode,
                roleType: 1
            }),
            orderliststorebyplatcode({ platCode: platCode })
        ]).then(res => {
            // 部门 单选
            orgSelect.empty()
            // 销售&客服&主管&组长 多选
            userSelect.empty()
            // 店铺 多选
            storeSelect.empty()
            // 只选择平台--start--------
            // 初始化部门
            orgSelect.append(getAOption('', ''))
            for (var i in res[0].orgTree) {
                setOrgs(res[0].orgTree[i], orgSelect, 0)
            }
            // 初始化销售员||客服专员||主管||组长
            var userJSON = dealUser_org(res[0] && res[0].userList || [])
            if (!userIsXm) {
                userSelect.append(getAOption('', ''))
                for (var i = 0; i < userJSON.all.length; ++i) {
                    userSelect.append(getAOption(userJSON.all[i].id, userJSON.all[i].userName))
                }
            } else {
                displayMultiSelect_user(userSelect, userJSON.all)
            }
            // 初始化店铺
            storeSelect.append(getAOption('', ''))
            for (var i = 0; i < res[1].length; i++) {
                storeSelect.append(getAOption(res[1][i].id, res[1][i].storeAcct))
            }
            formSelects.render(`${prefix}_store`);
            // 只选择平台--end--------
            // 修改部门联动--start--------
            if (!$.isEmptyObject(orgSelect.attr('lay-filter'))) {
                performanceOrgsChange(orgSelect, userSelect, storeSelect, userJSON, userIsXm, platCode, prefix)
            }
            // 修改部门联动-end--------
            // 修改销售员联动--start--------
            if (storeSelect.length > 0) {
                if (!$.isEmptyObject(userSelect.attr('lay-filter'))) {
                    if (!userIsXm) {
                        layui.form.on('select(' + userSelect.attr('lay-filter') + ')', function (data) {
                            var orgId = orgSelect.val()
                            var salePersonId = userSelect.val()
                            performanceSelectStore(storeSelect, orderPlatAndPersonData[platCode][0], orgId, salePersonId, null, salerAndcustomType[salerAndcustom])
                            //手动触发一个事件
                            userSelect.trigger('change')
                        })
                    } else {
                        layui.formSelects.on(
                            userSelect.attr('xm-select'),
                            lms_debounce(function (id, vals, val, isAdd, isDisabled) {
                                var orgId = orgSelect.val()
                                var salePersonId = vals.length ? vals.map((item) => item.value).join() : ''
                                performanceSelectStore(storeSelect, orderPlatAndPersonData[platCode][0], orgId, salePersonId, null, salerAndcustomType[salerAndcustom])
                                //手动触发一个事件
                                userSelect.trigger('change')
                            }, true),
                            500
                        )
                    }
                }
            }
            // 修改销售员联动--end--------
            layui.form.render('select')
        })
        // 监听销售&客服下拉选择，change重新调接口
        form.on(`select(${filter})`, function (obj) {
            if (!platCode) {
                getPersonAndOrgsByRole({
                    platCode: '',
                    roleType: obj.value
                }).then(res => {
                    // 销售&客服清空
                    userSelect.empty()
                    // 初始化销售员||客服专员
                    let userJSON = dealUser_org(res && res.userList || []);
                    displayMultiSelect_user(userSelect, userJSON.all);
                    //初始化部门
                    orgSelect.empty()
                    orgSelect.append(getAOption('', ''))
                    for (let i in res.orgTree) {
                        setOrgs(res.orgTree[i], orgSelect, 0)
                    }
                });
            } else {
                Promise.all([
                    getPersonAndOrgsByRole({
                        platCode: platCode,
                        roleType: obj.value
                    }), orderliststorebyplatcode({ platCode: platCode })
                ]).then(res => {
                    // 销售&客服清空
                    userSelect.empty()
                    // 部门清空重新赋值
                    orgSelect.val('')
                    // 店铺清空
                    storeSelect.empty()
                    // 初始化销售员||客服专员
                    var userJSON = dealUser_org(res[0] && res[0].userList || [])
                    if (!userIsXm) {
                        userSelect.append(getAOption('', ''))
                        for (var i = 0; i < userJSON.all.length; ++i) {
                            userSelect.append(getAOption(userJSON.all[i].id, userJSON.all[i].userName))
                        }
                    } else {
                        displayMultiSelect_user(userSelect, userJSON.all)
                    }
                    //初始化部门
                    orgSelect.empty()
                    orgSelect.append(getAOption('', ''))
                    for (let i in res[0].orgTree) {
                        setOrgs(res[0].orgTree[i], orgSelect, 0)
                    }
                    // 初始化店铺
                    storeSelect.append(getAOption('', ''))
                    for (var i = 0; i < res[1].length; i++) {
                        storeSelect.append(getAOption(res[1][i].id, res[1][i].storeAcct))
                    }
                    formSelects.render(id);
                    formSelects.render(`${prefix}_store`);
                    // // 执行自定义的部门选择事件
                    // orgSelect.change()
                    if (!$.isEmptyObject(orgSelect.attr('lay-filter'))) {
                        performanceOrgsChange(orgSelect, userSelect, storeSelect, userJSON, userIsXm, platCode, prefix)
                    }
                    layui.form.render('select')
                });
            }

        });
    })
}

function performanceOrgsChange(orgSelect, userSelect, storeSelect, userJSON, userIsXm, platCode, prefix) {
    layui.use('formSelects', function () {
        let form = layui.form,
            formSelects = layui.formSelects;
        layui.form.on('select(' + orgSelect.attr('lay-filter') + ')', function (data) {
            //部门销售员联动
            userSelect.html('')
            var orgId = data.value
            if (orgId != '') {
                // 获取所有子部门
                var subOrgIds = getSubOrgs(orgSelect, orgId)
                var userList = userJSON[orgId] || []
                var subOrgArr
                for (var i = 0; i < subOrgIds.length; ++i) {
                    subOrgArr = userJSON[subOrgIds[i]]
                    if (subOrgArr) {
                        userList = userList.concat(subOrgArr)
                    }
                }
            } else {
                userList = userJSON.all
            }
            userSelect.append(getAOption('', ''))
            if (userList) {
                if (userIsXm) {
                    displayMultiSelect_user(userSelect, userList)
                } else {
                    for (var i = 0; i < userList.length; ++i) {
                        userSelect.append(getAOption(userList[i].id, userList[i].userName))
                    }
                }
            }
            //部门-店铺联动
            let filter = `${prefix}_salerAndcustomSelectFilter`;
            let salerAndcustom = $(`[lay-filter=${filter}]`).val();
            // 1.销售；2.客服；type=salesperson:代表销售人员。type=customservicer:代表客服人员
            let salerAndcustomType = { 1: 'salesperson', 2: 'customservicer' }
            if (storeSelect.length > 0) {
                var orgId = orgSelect.val()
                var salePersonId = userSelect.val()
                performanceSelectStore(storeSelect, orderPlatAndPersonData[platCode][0], orgId, salePersonId, null, salerAndcustomType[salerAndcustom])
            }
            // 执行自定义的部门选择事件
            orgSelect.change()
            layui.form.render('select')
        })
    })
}
function performanceSelectStore(storeSelect, roleNames, orgId, salePersonId, salesSiteSelect, type, func,defaultStoreInfo) {
    if (!storeSelect || !storeSelect.length) {
        return
    }
    var salesSite = null
    if (salesSiteSelect != null && salesSiteSelect.length > 0) {
        //如果有站点过滤
        salesSite = salesSiteSelect.val()
    }
    var platCode = storeSelect.data('platcode')

    let params = {
        roleNames: 'smt专员',
        orgId: orgId,
        salePersonId: salePersonId,
        platCode: 'aliexpress',
        type: 'salesperson'
    }
    var url = ctx + '/sys/listStoreForRenderHpStoreCommonComponent.html'
    if (storeSelect.attr('unlimited-select')) {
        url = ctx + '/sys/listPlatAllStore.html'
    }

    // if(storeSelect["selector"] == '#FBAhistory_StoreSaler .store_hp_custom'){
    //     url = ctx + '/sys/amazonListStoreForRenderHpStoreCommonComponent.html'
    //     var storeStatus = storeSelect.attr('data-storestatus') || ''
    //     params.status = storeStatus
    // }

    if(storeSelect["selector"] == '#FBAdistributeForm .store_hp_custom'){
        url = ctx + '/FbaDistributePlan/getDistributeStoreAcctList'
    }
    let loadIndex;
    $.ajax({
        type: 'post',
        url: url,
        dataType: 'json',
        beforeSend: function() {
            loadIndex = layer.load(1, {shade: [0.3, '#ccc']})
        },
        data: params,
        success: function(returnData) {
            // loading.hide()
            layer.close(loadIndex)
            if (storeSelect.attr('xm-select')) {
                var platAccts = []
                storeOptionData = returnData.data || []
                for (var i = 0; i < returnData.data.length; i++) {
                    var a = { name: returnData.data[i].storeAcct, value: returnData.data[i].id }
                    platAccts.push(a)
                }
                displayMultiSelect(storeSelect, platAccts)
                if (func) {
                    func(returnData)
                }
            } else {
                storeSelect.empty()
                storeSelect.append(getAOption('', (defaultStoreInfo || '')))
                if (returnData.code == '0000') {
                    for (var i = 0; i < returnData.data.length; ++i) {
                        var curObj = returnData.data[i]
                        var curSite = curObj.salesSite == null ? '' : curObj.salesSite
                        if (salesSite == null || salesSite == '') {
                            storeSelect.append(
                                getAOption(
                                    returnData.data[i].id,
                                    returnData.data[i].storeAcct,
                                    returnData.data[i].salesSite
                                )
                            )
                        } else {
                            if (salesSite == curSite) {
                                //如果有站点过滤
                                storeSelect.append(
                                    getAOption(
                                        returnData.data[i].id,
                                        returnData.data[i].storeAcct,
                                        returnData.data[i].salesSite
                                    )
                                )
                            }
                        }
                        // layui.form.render('select');
                    }
                } else {
                    layer.msg(returnData.msg)
                }
                storeSelect.parents('form').find('.site_hp_custom').empty()
                layui.form.render('select')
            }
        }
    })
}

