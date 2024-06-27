var ajaxAuditPurchaseOrder, initAddressOption_purchaseOrder, purOrderMainDtoContain, deleteAutoPurNote_purchaseOrder,initReceiverOption_purchaseOrder
var purchaseorder_defaultLogisticsFeeConfig
var purchaseorder_logisticsFeeConfigList
var isShowDetail = false
var precalLogisticsParam = {}
var preCalIng = false
var storeDetailId
var saleDetailId
var saleDetailSku
var saleDetailStartIndex
layui.use(["layer", "table", "form", "laytpl", "laydate", "element", 'upload', 'formSelects'], function() {
    var layer = layui.layer,
        table = layui.table,
        form = layui.form,
        $ = layui.$,
        formSelects = layui.formSelects,
        laydate = layui.laydate;
    form.render();
    formSelects.render('buyer_purchaseOrderNew');
    formSelects.render('bizzOwner_purchaseOrder');
    formSelects.render('logisticName_purchaseOrder');
    laydate.render({
            elem: '#timeRange_purchaseOrder',
            range: true
        })
    // 初始化设置日期为当前1个月内时间
    var date = new Date()
    var endTime = format(date, 'yyyy-MM-dd')
    date.setDate(date.getDate() - 30);
    var beginTime = format(date, 'yyyy-MM-dd')
    var timeStr = beginTime + ' - ' + endTime
    $('#timeRange_purchaseOrder').val(timeStr)

    // 入库状态选择 绑定
    form.on('checkbox(stockInStatusCheckBox_purchaseOrder)', function(data) {
        var value = data.value
        var ifChecked = data.elem.checked
        if (value <= 3) {
            $('#stockInStatusForm_purchaseOrder').find('[name=stockInStatus][value=' + value + ']').prop('checked', ifChecked)
        } else {
            $('#purcaseOrder_searchForm').find('[name=ifNormal]').val(ifChecked ? 'false' : '')
        }
    });

    // 模板查询赋值
    commonSaveSearchTpl({
        id: "purchaseOrder_save",
        formId: "purcaseOrder_searchForm",
        pageName: "purchaseOrder",
        searchBtnId: "searchBtn_purchaseOrder",
        cb: param => purchaseOrder_formVal(param),
        btnText: '',
        layerTitleText: '',
        saveParam: [{
            name: 'ifSpeed',
            id: 'ifSpeed_purcaseOrder_searchForm',
            call: 'check'
        },
        {
            name: 'ifSupplierDiff',
            id: 'purcaseOrder_searchForm_ifSupplierDiff',
            call: 'check'
        }]
    })

    function purchaseOrder_formVal(param) {
        $('#reset_purchaseOrder').trigger('click')
        // 页签
        if (param.auditStatus) {
            $(".numCount_purchaseOrder")
            .each(function () {
                let liIndex = $(this).data("auditstatus")
                if (liIndex == param.auditStatus) {
                    $(this).addClass("layui-this")
                } else {
                    $(this).removeClass("layui-this")
                }
            })
        }
        if (param.ifpullinvalid) {
            $(".numCount_purchaseOrder")
            .each(function () {
                let liIndex = $(this).data('ifpullinvalid')
                if (liIndex == param.ifpullinvalid) {
                    $(this).addClass("layui-this")
                } else {
                    $(this).removeClass("layui-this")
                }
            })
        }

        $('#ifSpeed_purcaseOrder_searchForm').prop('checked', param.ifSpeed ? true : false)
        $('#purcaseOrder_searchForm_ifSupplierDiff').prop('checked', param.ifSupplierDiff ? true : false)
        // 给表单赋值
        form.val("purcaseOrder_searchForm", param)
        form.render()

        let multiSelectObj = {
            buyerIdListStr: "buyer_purchaseOrderNew",
            bizzOwnerIdListStr: "bizzOwner_purchaseOrder",
            followerIdList: "followerIdList_purchaseOrder",
            logisticNameListStr: 'logisticName_purchaseOrder'
          };
          Object.keys(multiSelectObj).forEach((item) => {
            if (param[item]) {
              formSelects.value(
                multiSelectObj[item],
                param[item].split(",")
              );
            } else {
              formSelects.value(multiSelectObj[item], []);
            }
          });
        // 执行搜索
        $(".numCount_purchaseOrder.layui-this").click()
    }

    //监听iframe传参
    window.addEventListener('message', function(event){
        let { order, ifManager, searchOrderNoType } = event.data || {}
        if (order || searchOrderNoType) {
            $("input[name='searchOrderNo']").val(order) 
            $("select[name=searchOrderNoType").val(searchOrderNoType)
            if (ifManager == 'false') {
                var username = localStorage.getItem('lmsAppUserName');
                // 获取采购专员下拉框数据
                let purcahseUser = $('#purcaseOrder_searchForm [name=purchaseOption]')
                purcahseUser?.each(function (index, item) {
                    if ($(item).text() == username) {
                        let id = $(item).val()
                        layui.formSelects.value('buyer_purchaseOrderNew', [id]); 
                    }
                })
            }
            form.render()
            let data = getSerachData_purchaseOrder()
            search_purchaseOrder(data)
        }
    });
    getFollowList()

    var followList = []
    // 获取跟单人员
    function getFollowList() {
        $.ajax({
            url: ctx + "/msgPreprodBuyer/getSysUserList.html",
            type: 'get',
            success: function(res) {
                if (res.code == '0000') {
                    let followOrderUserList = res.data.followOrderUserList || []
                    followOrderUserList?.forEach(item => {
                        item.name = item.userName
                        item.value = item.id
                    })
                    followList = followOrderUserList || []
                    layui.formSelects.data('followerIdList_purchaseOrder', 'local', {
                        arr: followOrderUserList
                    })
                }
            }
        })
    }

    let stopClass = ['.copyTxt', '.doubleClickToSet', '.laytable-cell-checkbox', '.freeClickBox', '[data-edit]','.supplierNameTabContains']
    // 表格渲染
    function search_purchaseOrder(data) {
        if (data.auditStatus !== 1) {
            data.ifNormal = null
        }
        data.ifPullInvalid = data.ifPullInvalid == '1'
        var stockInStatusList = []
        var checkedStockInStatus = $('#stockInStatusForm_purchaseOrder [name=stockInStatus]:checked')
        for (var i = 0; i < checkedStockInStatus.length; ++i) {
            stockInStatusList.push(parseInt(checkedStockInStatus[i].value))
        }
        data.stockInStatusListStr = stockInStatusList.join(',')
        // data.ifOffLine = false
        var colsArr =
            [
                { type: "checkbox", width: 20 },
                { title: "单号", templet: '#orderNo_purchaseOrder', width: 205 },
                { field: "supplierName", title: "供应商", width: 150, templet: '#supplierBox_purchaseOrder' },
                { title: "责任人", width: 100, templet: "#responsor_purchaseOrder" },
                { title: "采购参数", width: 100, templet: '#purchaseConf_purchaseOrder' },
                { title: "订单费用", width: 160, templet: "#logisticFee_purchaseOrder" },
                { title: "可付", templet: '#payAblepurchaseOrder', width: 25 },
                { title: "创建1688", width: 80, templet: '#createAli1688OrderStatus_purchaseOrder' },
                { title: "未入库", templet: '#notInStoreAmount_purchaseOrder', width: 115 },
                { title: "日期", templet: '#date_purchaseOrder', width: 120 },
                { field: "memo", title: "采购备注",edit: 'text',width:100
                    ,templet: function(res){
                    return '<div class="followRemarkBox" onmouseenter="showTip(`'+ res.memo + '`,this)" onmouseleave="removeTip(this,3000)" ><em>'+ (res.memo != null ? res.memo : '' ) +'</em></div> <i class="layui-icon layui-icon-edit" style="color: #009688">&#xe642;</i> '
                }
                },
                { field: "followRemark", title: "跟单备注",edit: 'text',width:100
                    ,templet: function(res){
                    return '<div class="followRemarkBox" onmouseenter="showTip(`'+ res.followRemark + '`,this)" onmouseleave="removeTip(this,3000)" ><em>'+ (res.followRemark != null ? res.followRemark : '' ) +'</em></div> <i class="layui-icon layui-icon-edit" style="color: #009688">&#xe642;</i> '
                }
                },
                { title: "不一致供应商", templet: '#purchaseOrder_diffSupplierResult', width: 150 },
                // { field: "followRemark", title: "跟单备注",edit: 'text',width:100
                // ,templet: function(res){
                //             return '<div class="followRemarkBox" onmouseenter="showTip(`'+ res.followRemark + '`,this)" onmouseleave="removeTip(this,3000)" ><em>'+ (res.followRemark != null ? res.followRemark : '' ) +'</em></div> <i class="layui-icon layui-icon-edit" style="color: #009688">&#xe642;</i> '
                //         }
                // },
                { title: '操作', align: 'center', toolbar: '#purchaseOrderTable_bar' }
            ]
        if (data.auditStatus > 0 || data.ifPullInvalid) {
            colsArr = [
                { type: "checkbox", width: 20 },
                { title: "单号", width: 205, templet: '#orderNo_purchaseOrder' },
                { field: "supplierName", title: "供应商", width: 150, templet: '#supplierBox_purchaseOrder' },
                { title: "责任人", width: 100, templet: "#responsor_purchaseOrder" },
                { title: "采购参数", width: 100, templet: '#purchaseConf_purchaseOrder' },
                { title: "订单费用", width: 160, templet: "#logisticFee_purchaseOrder" },
                { title: "未入库", templet: '#notInStoreAmount_purchaseOrder', width: 115 },
                { title: "日期", templet: '#date_purchaseOrder', width: 120 },
                { field: "memo", title: "采购备注",edit: 'text',width:100
                    ,templet: function(res){
                    return '<div class="followRemarkBox" onmouseenter="showTip(`'+ res.memo + '`,this)" onmouseleave="removeTip(this,3000)" ><em>'+ (res.memo != null ? res.memo : '' ) +'</em></div> <i class="layui-icon layui-icon-edit" style="color: #009688">&#xe642;</i> '
                }
                },
                { title: "不一致供应商", templet: '#purchaseOrder_diffSupplierResult', width: 150 },

                // { field: "followRemark", title: "跟单备注",edit: 'text'
                //     ,templet: function(res){
                //     return '<div class="followRemarkBox" onmouseenter="showTip(`'+ res.followRemark + '`,this)" onmouseleave="removeTip(this,3000)" ><em>'+ (res.followRemark != null ? res.followRemark : '' ) +'</em></div> <i class="layui-icon layui-icon-edit" style="color: #009688">&#xe642;</i> '
                //     }
                // },
                { title: "物流信息", templet: "#purchaseorder_scanInfoTpl" },
                { title: "归档备注", templet: "<div>{{d.refundInfo.pullInvalidRemark || ''}}</div>" },
                { title: '操作', align: 'center', toolbar: '#purchaseOrderTable_bar' }
            ]
        }
        table.render({
            elem: "#purchaseOrder_table",
            method: 'post',
            url: ctx + "/purOrderMain/queryPage.html",
            where: data,
            cols: [ colsArr ],
            id: "purchaseOrder_table",
            page: true,
            limits: [100, 200, 500],
            limit: 100,
            created: function (res){
                let list = res.data;
                if (list && list.length) {
                    for (let i = 0; i <list.length; i++) {
                        if (list[i].createAli1688FailReason != null && list[i].createAli1688FailReason.indexOf("\"") >= 0) {
                            list[i].createAli1688FailReason = list[i].createAli1688FailReason.replace(/"/g, '“')
                        }
                    }
                }
            },
            done: function(res, curr, count) {
                $('#purOrderNum').text(res.count)
                // 统计各状态订单数量
                countForAllAuditStatus_purchaseOrder(data)
                // 固定表头
                $('#purchaseOrder_table').next('.layui-table-view').find('.layui-table-header').addClass('toFixedContain')

                // 绑定事件
                var tbody = $('#purchaseOrder_table').next('.layui-table-view').find('.layui-table-body').find('tr[data-index=0]')
                if (tbody.length > 0) {
                    var ifBind = tbody.attr('data-ifBind')
                    if (!ifBind) {
                        // // 给物流单号、1688单号、物流费三个设定 单击修改事件
                        // setEventByselector('#purchaseOrder_table', '#purchaseOrder_tableDiv .doubleClickToSet', 'dblclick', toShowEditInp)
                        // // 给1688单号上添加单击 跳转页面事件
                        // setEventByselector('#purchaseOrder_table', '#purchaseOrder_tableDiv .clcikRoutTo', 'click', routerTo)
                        // // 给物流单号、1688单号、物流费三者的编辑框 绑定失去焦点发起修改事件
                        // setEventByselector('#purchaseOrder_table', '#purchaseOrder_tableDiv .editInp', 'blur', toUpdateField_purchaseOrder)
                        // 标记加急单为黄色背景
                        setRowBackColor('.speed_purchaseOrder', { 'background-color': 'rgb(253, 253, 144)' })

                        // 给行加上点击显示详情事件
                        purOrderMainDtoContain = {}
                        setRowEvent('#purchaseOrder_table', '.purchaseOrderMainId', 'click', function () {}, stopClass)
                        tbody.attr('data-ifBind','1')
                    }
                }
            }
        });

    }
    // // 给物流单号、1688单号、物流费三个设定 单击修改事件
    $('#purchaseOrderCard').on('dblclick','#purchaseOrder_tableDiv .doubleClickToSet',toShowEditInp)
    // // 给物流单号、1688单号、物流费三者的编辑框 绑定失去焦点发起修改事件
    $('#purchaseOrderCard').on('blur','#purchaseOrder_tableDiv .editInp',toUpdateField_purchaseOrder)
    // // 给1688单号上添加单击 跳转页面事件
    $('#purchaseOrderCard').on('click','#purchaseOrder_tableDiv .clcikRoutTo',routerTo)

    document.onkeydown = function(e) {
        if (!isShowDetail) return
        let currentEl = $('.addColor')
        if (e && e.keyCode === 40) { // 下
            currentEl['next']().click()
        }
        if (e && e.keyCode === 38) { // 上
            currentEl['prev']().click()
        }

    }

    table.on('edit(purchaseOrder_table)', function(obj) {
        var value = obj.value //得到修改后的值
            , data = obj.data //得到所在行所有键值
            , field = obj.field; //得到字段

        var AData = {
            id : data.id
        }
        AData[field] = value
        loading.show()
        $.ajax({
            url: ctx + "/purOrderMain/updateField.html",
            type: 'POST',
            dataType: "json",
            contentType: 'application/json',
            data: JSON.stringify(AData),
            success: function(res) {
                loading.hide()
                if (res.code == '0000') {
                    layer.msg('修改成功')
                } else {
                    layer.msg(res.msg)
                }
            },
            error: function () {
                loading.hide()
            }
        })
    })

    // 导入修改跟单员
    $('#updateFollowerByExcelBtn').click(function () {
        $('#fileForUpdateFollowerByExcel_purchaseOrder').click()
    })
    $('#fileForUpdateFollowerByExcel_purchaseOrder').on('change', function() {
        var files = $('#fileForUpdateFollowerByExcel_purchaseOrder')[0].files
        // 如果没有文件则终止
        if (files.length == 0) {
            return
        }
        // 校验文件类型
        var fileName = files[0].name
        var seat = fileName.lastIndexOf(".");
        var extension = fileName.substring(seat).toLowerCase();
        if (extension != '.xlsx' && extension != '.xls') {
            $('#fileForUpdateFollowerByExcel_purchaseOrder').val('')
            layer.msg('请传入后缀为.xlsx或者.xls 的Excel文件')
            return
        }
        var formData = new FormData();
        formData.append("file", files[0]);
        var confirmIndex = layer.confirm('确认导入这个文件进行修改跟单员吗', { btn: ['确认', '取消'] },
            function() {
                loading.show()
                $.ajax({
                    url: ctx + '/purOrderMain/updateFollowerByExcel.html',
                    type: 'POST',
                    data: formData,
                    // 告诉jQuery不要去处理发送的数据
                    processData: false,
                    // 告诉jQuery不要去设置Content-Type请求头
                    contentType: false,
                    success: function(data) {
                        layer.close(confirmIndex)
                        loading.hide()
                        // 清空 excel
                        $('#fileForUpdateFollowerByExcel_purchaseOrder').val('')
                        if (data.code == '0000') {
                            layer.alert("修改成功");
                        } else {
                            layer.alert(data.msg)
                        }
                    },
                    error: function() {
                        loading.hide()
                        $('#fileForUpdateFollowerByExcel_purchaseOrder').val('')
                    }
                });
            },
            function() {
                layer.closeAll()
            }
        )
    })

    // 合并采购单
    $('#purchaseOrder_mergeOrderBtn').click(function () {
        layer.open({
            title: '合并采购单',
            type: 1,
            area: ['90%', '90%'],
            id: 'purchaseOrder_mergeOrderLayer',
            btn: ['关闭'],
            content: $('#purchaseOrder_mergeOrderPop').html(),
            success: function() {
                oneAjax.post({
                    url: '/purOrderMain/searchMergeAbleOrder',
                    data: {
                        page: 1,
                        limit: 1000
                    },
                    success:function (res) {
                        if (res.code === '0000') {
                            let creatorList = []
                            res.data?.forEach(item => {
                                let obj = {
                                    name: item.creator,
                                    value: item.creatorId
                                }
                                creatorList.push(obj)
                            })
                            let uniqueArray = creatorList.reduce(function(acc, obj) {
                                let key = obj.value; 
                                if (!acc[key]) {
                                  acc[key] = obj;
                                }
                                return acc;
                              }, {});
                            let result = Object.values(uniqueArray);
                            layui.formSelects.data("creator_purchaseOrder", 'local', {arr: result});

                        }
                    }
                })
                // 获取当前浏览器高度
                let heigth = $('#purchaseOrder_mergeOrderLayer').outerHeight()
                let colsArr = [
                        { type: "checkbox", width: 20 },
                        { title: "单号", templet: '#orderNo_purchaseOrder', width: 205 },
                        { field: "supplierName", title: "供应商", width: 150, templet: '#supplierBox_purchaseOrder' },
                        { title: "责任人", width: 100, templet: "#responsor_purchaseOrder" },
                        { title: "采购参数", width: 100, templet: '#purchaseConf_purchaseOrder' },
                        { title: "订单费用", width: 160, templet: "#logisticFee_purchaseOrder" },
                        { title: "可付", templet: '#payAblepurchaseOrder', width: 25 },
                        { title: "审核", templet: '#auditStatus_purchaseOrder', width: 25 },
                        { title: "创建1688", width: 80, templet: '#createAli1688OrderStatus_purchaseOrder' },
                        { title: "未入库", templet: '#notInStoreAmount_purchaseOrder', width: 115 },
                        { title: "日期", templet: '#date_purchaseOrder', width: 120 },
                        { field: "memo", title: "采购备注",edit: 'text',width:100
                            ,templet: function(res){
                            return '<div class="followRemarkBox" onmouseenter="showTip(`'+ res.memo + '`,this)" onmouseleave="removeTip(this,3000)" ><em>'+ (res.memo != null ? res.memo : '' ) +'</em></div> <i class="layui-icon layui-icon-edit" style="color: #009688">&#xe642;</i> '
                        }
                        },
                        { title: '操作', align: 'center', toolbar: '#purchaseOrderTable_bar' }
                    ]

                laydate.render({
                    elem: '#purchaseOrder_mergeOrderPop_times',
                    // range: true
                })
                form.render()
                $("#searchBtn_purchaseOrder_mergeOrderPop").click(function(){
                    let data = serializeObject($('#purchaseOrder_mergeOrderPop_searchForm'))
                    data.creatorIdString = data.creatorId
                    if(data.times && data.times != ''){
                        data.beginTime = data.times + " 00:00:00"
                        data.endTime = data.times + " 23:59:59"
                    }
                    searchMergeOrder(data)
                })
                searchMergeOrder()
                function searchMergeOrder(obj={}) {
                    table.render({
                        elem: "#purchaseOrder_mergeOrderTable",
                        method: 'post',
                        url: ctx + "/purOrderMain/searchMergeAbleOrder",
                        cols: [ colsArr ],
                        contentType:"application/json",
                        where: obj,
                        height: heigth-100,
                        id: "purchaseOrder_mergeOrderTable",
                        page: false,
                        limit: 1000,
                        done: function(res, curr, count) {
                        }
                    })
                }

                table.on('tool(purchaseOrder_mergeOrderTable)', function(obj) {
                    var layEvent = obj.event; //获得 lay-event 对应的值
                    var data = obj.data; //获得当前行数据
                    if (layEvent == 'detail') {
                        purchaseordershowdetail(data)
                    } else if (layEvent === 'delete') {
                        let idList = [data.id]
                        purchaseOrder_disablePurOrder(idList)
                    }
                })
                // 合并采购单
                $('#purchaseOrder_batchMergeOrderBtn').click(function () {
                    var checkStatus = table.checkStatus('purchaseOrder_mergeOrderTable'),
                        data = checkStatus.data;
                    if (!data || data.length == 0) {
                        layer.msg('请选择采购订单')
                        return
                    }
                    var idList = []
                    for (var i = 0; i < data.length; ++i) {
                        idList.push(data[i].id)
                    }
                    oneAjax.post({
                        url: '/purOrderMain/mergeOrder',
                        data: idList,
                        success:function (res) {
                            layer.alert(res.msg)
                            if (res.code === '0000') {
                                searchMergeOrder()
                            }
                        }
                    })
                })
            }
        })
    })

    function purchaseordershowdetail(data) {
        var btnArr = []
        if (data.status) {
            btnArr = [ '保存', '关闭']
        } else {
            btnArr = [ '保存并同步给普源', '关闭']
        }
        var popIndex = layer.open({
            type: 1,
            title: "采购订单",
            id: "detailPop_purchaseOrder",
            area: ["98%", "70%"],
            btn: btnArr,
            maxmin: true,
            move: '.layui-layer-title',
            content: $("#purOrderDetail_pop").html(),
            success: function(layero, index) {
                function backTodo() {
                    // 初始化控件
                    if (data.auditStatus == 0) {
                        componentInit()
                        // 初始化审核按钮
                        if ($('#purchaseOrder_auditPurOrderBtn').length > 0) {
                            var $target = layero.find('.layui-layer-btn.layui-layer-btn-'),
                                $html = `<div class="layui-form-item layui-form" style="position:absolute;bottom:2px;width: 80%">
                                                <div class="layui-inline"  style="float: left;">
                                                    <button type="button" class="layui-btn layui-btn-sm layui-btn-normal" onclick="ajaxAuditPurchaseOrder(` + data.id + `)">审核</button>
                                                </div>
                                        </div>`;
                            $target.append($html);
                        }
                    }
                }

                // 查询原数据并初始化
                formSelects.render('note_purchaseOrder_AddForm');
                originDataInit_purOrderDetail(data.id,backTodo)



                // 操作日志初始化
                $('#purOrderLogLab').show()
                $('#purOrderLogLab').attr('data-id', data.id)
                $('#purOrderLogLab').attr('data-init', '1')
                $('#purOrderLogLab').click(function() {
                    var ifInit = $(this).attr('data-init')
                    if (ifInit == '2') {
                        return
                    }
                    table.render({
                        elem: "#purchaseOrderLogTab",
                        id: "purchaseOrderLogTab",
                        method: 'post',
                        url: ctx + "/purOrderMain/queryLogList.html",
                        where: { purOrderMainId: data.id },
                        cols: [
                            [
                                { title: "时间", width: 150, templet: '<div>{{format(d.createTime, "yyyy-MM-dd hh:mm:ss")}}</div>' },
                                { field: "creator", title: "操作人", width: 100 },
                                { title: "操作类型", templet: '#operType_purOrderLog', width: 150 },
                                { field: "operDesc", title: "操作详情" },
                            ]
                        ],
                        page: false,
                        width: '100%',
                        done: function(res, curr, count) {
                            // 标记已经初始化操作日志
                            $('#purOrderLogLab').attr('data-init', '2');
                        }
                    })
                })

                // 固定表头
                $('#detailPop_purchaseOrder').scroll(function() {
                    toFixedTabHead(this)
                })
            },
            yes: function() {
                var Adata = getData_purOrderMain();
                if (!Adata) {
                    return
                }
                Adata.id = data.id
                Adata.logisticFee = Adata.logisticFee || 0
                Adata.discountMoney = Adata.discountMoney || 0
                Adata.prevPayMoney = Adata.prevPayMoney || 0

                // if (data.auditStatus == 0 && ((Adata.purAcctId && !Adata.purReceiveAddressId) || (Adata.purReceiveAddressId && !Adata.purAcctId))) {
                //     layer.msg('采购账号和收货地址必须同时指定，否则请不要选择，会自动使用默认账号和收货地址')
                //     return
                // }
                // 提交修改
                loading.show()
                $.ajax({
                    url: ctx + "/purOrderMain/addOrUpdPurOrderMain.html",
                    type: 'POST',
                    dataType: "json",
                    contentType: 'application/json',
                    data: JSON.stringify(Adata),
                    success: function(data) {
                        if (data.code == '0000') {
                            layer.close(popIndex)
                            active_purchaseOrder.reloadWithoutFresh()
                            layer.msg('修改成功')
                        } else {
                            layer.msg(data.msg)
                        }
                    },
                    complete: function() {
                        loading.hide()
                    }
                })

            }
        })
    }

    function popToShowPurOrderDetail(data) {
        table.render({
            elem: "#deailShowTable_purchaseOrder",
            id: "deailShowTable_purchaseOrder",
            data: data.detailList,
            cols: [
                [
                    { title: "图片", templet: "#image_purOrderDetail" },
                    { field: "sSku", title: "商品sku", templet: '#purOrder_skuAndStockLocation', width: 200 },
                    // { field: "bizzOwner", title: "开发专员" },
                    { field: "title", title: "商品名称", templet: '#title_purOrder_subDetailList',width: 220 },
                    { title: "累计净重(g)", templet: '#totalWeight_subDetailList' },
                    { field: "style", title: "款式1" },
                    { title: `货号`, field: 'articleNo',templet: '#purchaseOrder_articleNo' },
                    { field: "purOrderMinPrice", title: "近一年最低采购成本价", templet: '#purOrder_minPrice' },
                    { field: 'originCost', title: "采购单价(￥)" },
                    { title: "含运费单价(￥)", field: 'taxPrice' },
                    // { title: "当时同款最低价", templet: '#purOrder_oldLowestPriceBox' },
                    // { title: "最新同款", templet: '#newLowestPriceBox_purOrderDetail' },
                    { field: 'amount', title: "采购数量" },
                    { title: "已入库数量", templet: '<div>{{d.inAmount || 0}}</div>' },
                    { title: "未入库数量", templet: '<div>{{d.amount - (d.inAmount || 0)}}</div>' },
                    { title: "未入库金额", templet: '<div>{{accMul(d.amount - (d.inAmount || 0), d.taxPrice)}}</div>' },
                    // { title: "历史最低成本", field: 'lowestPrice' },
                    { title: "可用/在途/未派", templet: "<div>{{d.stockNum != null ? ( accSub(d.stockNum, d.reservationNum) + '/' + (d.orderNotInNum || 0) + '/' + (d.lackUnPaiNum || 0) ) : '' }}</div>" },
                    // { field: "orderNotInNum", title: "未入库数量"},
                    { title: "预计可用库存", templet: "<div>{{d.stockNum - d.reservationNum + d.orderNotInNum + d.lackReservationNum - d.lackUnPaiNum}}</div>" },
                    { title: "货号标记", width: 50, field: 'provideIdentification', templet: '<div>{{(d.provideIdentification == true)? "是" : ((d.provideIdentification == false)? "否" : "")}}</div>' },
                    { title: "物理分割", width:50, field: 'ifDivision', templet: '<div>{{(d.ifDivision == true)? "是" : ((d.ifDivision == false)? "否" : "")}}</div>' },
                    { field: "unit", title: "单位" },
                    { field: "style", title: "款式" },
                    // { field: "stockLocation", title: "库位" },
                    { field: "dailySaleNum1", title: "日均销量" },
                    { field: "fiveSalesNum", title: "5/15/30天销量", templet: '#daylysSales_purchaseOrder' },
                    { title: "累计金额(￥)", templet: "#subTotalMoney_purOrderDetail" },
                    { title: "供应商", templet: "#subSupplierList_purOrderDetail" },
                ]
            ],
            page: false,
            limit: data.detailList.length,
            done: function() {
                // 固定表头
                $('#deailShowTable_purchaseOrder').next('.layui-table-view').find('.layui-table-header').addClass('toFixedContain')
                setRowBackColor('.purchaseOrder_failCreate1688', { 'background-color': 'rgb(253, 253, 144)' })
                $('#deailPop_purchaseOrder_contain').on('click','.clcikRoutTo',routerTo)
            }
        })
    }

    function routerTo() {

        var span = $(this)
        var id = span.find('a').text()
        if (!id) {
            return
        }
        span.attr('data-ifExcuteClick', 1)
            // 设定时器
        var index = window.setTimeout(function() {
            var ifExcuteClick = span.attr('data-ifExcuteClick')
            if (ifExcuteClick == '1') {
                var routerUrl = span.attr('data-routUrl')
                window.open(routerUrl.replace('{data}', id))
            }
            span.removeAttr('data-ifExcuteClick')
        }, 300)
    }

    function countForAllAuditStatus_purchaseOrder(data) {
        $.ajax({
            url: ctx + "/purOrderMain/countForAuditStatus.html",
            type: 'POST',
            dataType: "json",
            data: data,
            success: function(res) {
                if (res.code === '0000') {
                    let list = res.data
                    let map = {}
                    let abnormalNum = 0
                    for (let i = 0; i < list.length; ++i) {
                        if (list[i].ifNormal != null) {
                            abnormalNum = list[i].num
                            continue
                        }
                        map[list[i].audit_status + '-' + list[i].stock_in_status + '-' + list[i].if_pull_invalid] = list[i].num
                    }
                    $('#noAuditNum_purchaseOrder').text(map['0-1-false'] || 0)
                    $('#hasAuditNum_purchaseOrder').text((map['1-1-false'] || 0) + (map['1-2-false'] || 0) + (map['1-3-false'] || 0))
                    $('#deleteNum_purchaseOrder').text((map['3-1-false'] || 0))
                    $('#pullInvalidNum_purchaseOrder').text((map['1-1-true'] || 0) + (map['1-2-true'] || 0) + (map['1-3-true'] || 0))
                    $('#NotAllInNum_purchaseOrder').text((map['1-1-false'] || 0))
                    $('#NotAuditStockInNum_purchaseOrder').text((map['1-2-false'] || 0))
                    $('#AuditStockInNum_purchaseOrder').text((map['1-3-false'] || 0))
                    $('#AbNormalNum_purchaseOrder').text(abnormalNum)
                } else {
                    layer.msg(res.msg)
                }
            }
        })
    }

    // 展示输入框
    function toShowEditInp() {
        // 隐藏原值
        var span = $(this).find('.showSpan')
        span.attr('data-ifExcuteClick', 0) // 锁住单击事件
        span.hide()
            // 展示编辑输入框 并赋值
        var inp = $(this).find('.editInp')
        inp.val(span.find('a').text())
        inp.show()
        inp.focus()
    }

    // 发起修改
    function toUpdateField_purchaseOrder() {
        var inp = $(this)
        inp.hide()
        var span = inp.prev('.showSpan')

        var data = {
            id: inp.attr('data-id')
        }
        var fieldName = inp.attr('data-name')
        var newData = inp.val().trim()
            // 检查是否有修改
        var originData = span.find('a').text().trim()
        if (originData == newData) {
            span.show()
            return
        }
        // 如果修改物流费，若是空字符串，则变更为0
        if (fieldName == 'logisticFee' && !newData) {
            newData = '0'
        }
        data[fieldName] = newData.replace(/，/ig,',')
        if(fieldName == 'logisticOrderNo'){
            data[fieldName] = data[fieldName].replace(/\s/g,'');
        }
        $.ajax({
            url: ctx + "/purOrderMain/changeFieldForPurOrderMain.html",
            type: 'POST',
            dataType: "json",
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function(data) {
                span.show()
                if (data.code == '0000') {
                    layer.msg('修改成功')
                    active_purchaseOrder.reloadWithoutFresh()
                } else {
                    layer.msg(data.msg)
                }
            },
            complete: function() {
                loading.hide()
            }
        })
    }

    //远程搜索功能
    var dim = new DimSearch('#searchSupplier_purchaseOrder', 'supplierId');
    dim.init();

    // 表格数据重载
    active_purchaseOrder = {
        reload: function(data) {
            //执行重载
            table.reload('purchaseOrder_table', {
                method: 'post',
                page: {
                    curr: 1 //重新从第 1 页开始
                },
                where: data
            });
        },
        reloadWithoutFresh: function (data) {
            $('.layadmin-tabsbody-item.layui-show').find('.layui-table-page .layui-laypage-btn').click()
        }
    }

    $("#reset_purchaseOrder").click(function() {
        $("#purcaseOrder_searchForm [name]:not(.hiddenContent)").val('')
        formSelects.value('buyer_purchaseOrderNew', [''])
        formSelects.value('bizzOwner_purchaseOrder', [''])
        formSelects.value('logisticName_purchaseOrder', [''])
        formSelects.value('followerIdList_purchaseOrder', [''])

        // 重新渲染select， 防止select值被清空
        form.render('select', 'purcaseOrder_searchForm')
    });

    // 搜索按钮
    $('#searchBtn_purchaseOrder').click(function() {
        var data = getSerachData_purchaseOrder()
        search_purchaseOrder(data)
    })

    $('.numCount_purchaseOrder').click(function() {
        var auditStatus = $(this).attr('data-auditstatus') || ''
        var ifPullInvalid = $(this).attr('data-ifpullinvalid') || ''
        $('#purcaseOrder_searchForm [name=auditStatus]').val(auditStatus)
        $('#purcaseOrder_searchForm [name=ifPullInvalid]').val(ifPullInvalid)
            // 入库状态的显隐
        if (auditStatus == '1') {
            $('.stockInStatusCheckBox').show()
        } else {
            $('.stockInStatusCheckBox').hide()
        }

        var data = getSerachData_purchaseOrder()
        search_purchaseOrder(data)
    })

    function getSerachData_purchaseOrder() {
        var data = serializeObject($('#purcaseOrder_searchForm'))
        data.buyerId = data.buyerId ? parseInt(data.buyerId) : null
        data.supplierId = data.supplierId ? parseInt(data.supplierId) : null
        data.storeId = data.storeId ? parseInt(data.storeId) : null
        data.purAcctId = data.purAcctId ? parseInt(data.purAcctId) : null
        data.auditStatus = data.auditStatus != '' ? parseInt(data.auditStatus) : null
        data.createAli1688OrderStatus = data.createAli1688OrderStatus != '' ? parseInt(data.createAli1688OrderStatus) : null
        data.payAble = data.payAble != '' ? (data.payAble == '1') : null
        data.ifSpeed = $('#ifSpeed_purcaseOrder_searchForm').prop("checked") ? "1" : null
        data.ifRefund = $('#ifRefund_purcaseOrder_searchForm').prop("checked") ? "1" : null
        data.ifSupplierDiff = $('#purcaseOrder_searchForm_ifSupplierDiff').prop("checked") ? "1" : null
        return data
    }

    $('#purchaseOrder_createPurOrderBtn').click(function() {
        var popIndex = layer.open({
            type: 1,
            title: "采购订单",
            area: ["98%", "70%"],
            btn: ['提交', '关闭'],
            id: 'detailPop_purchaseOrder',
            shadeClose: true,
            maxmin: true,
            move: '.layui-layer-title',
            content: $("#purOrderDetail_pop").html(),
            success: function(layero, index) {
                // 初始化子表数据
                purOrderDetailList_purchaseOrder = []
                // 初始化控件
                componentInit()
                formSelects.render('note_purchaseOrder_AddForm');
                // 初始化子表
                showSubTable()
                // 隐藏审核按钮
                $('#auditPurOrder_purOrderDetail_pop').hide()
                // 到货日期设置
                var today = new Date();
                today.setDate(today.getDate() + 7)
                $('#purOrderMainInfoForm [name=delivDay]').val(format(today, 'yyyy-MM-dd'))
                // 采购仓库
                // $('#purOrderMainInfoForm [name=storeId]').val(1)
                //ztt-20220505改开始
                // var targetSelected="义乌仓";
                // $("#purOrderMainInfoForm [name=storeId]").find("option").each(function () {
                //     if($(this).text() == targetSelected)	{
                //        $('#purOrderMainInfoForm [name=storeId]').val($(this).attr('value'));
                //     }
                // });
                //ztt-20220519改-不要默认值
                //ztt-20220505改结束
                // 付款方式
                $('#purOrderMainInfoForm [name=payType]').val('alipay')
                // 固定表头
                $('#detailPop_purchaseOrder').scroll(function() {
                    toFixedTabHead(this)
                })
                
                // appendSelect($('#detailPop_purchaseOrder').find('select[name="followerId"]'), followList, 'value', 'name')
                form.render('select', 'purOrderMainInfoForm')
            },
            yes: function() {
                var data = getData_purOrderMain();
                if (!data) {
                    return
                }
                // let follower = followList?.filter(item => item.value == data.followerId)[0]?.name
                data.logisticFee = data.logisticFee || 0
                data.discountMoney = data.discountMoney || 0
                data.prevPayMoney = data.prevPayMoney || 0
                // data.follower = follower

                // 提交新增
                loading.show()
                $.ajax({
                    url: ctx + "/purOrderMain/addOrUpdPurOrderMain.html",
                    type: 'POST',
                    dataType: "json",
                    contentType: 'application/json',
                    data: JSON.stringify(data),
                    success: function(data) {
                        if (data.code == '0000') {
                            layer.close(popIndex)
                            active_purchaseOrder.reloadWithoutFresh()
                            layer.msg('新增成功')
                        } else {
                            layer.msg(data.msg)
                        }
                    },
                    complete: function() {
                        loading.hide()
                    }
                })

            }
        })
    });

    /**
     * 根据已选择的供应商，获取当前商品该供应商的采购信息
     * @param supplierName 已选择的供应商，如果未选择，则默认使用第一个供应商
     * @param dto 当前商品信息
     * @returns {*}
     */
    function getUseSupplier(supplierName, dto) {
        let useSupplierRef
        if (!supplierName) { // 如果未选供应商，则使用第一供应商
            useSupplierRef = dto.supplierRefDtoList[0]
        } else {
            for (let j = 0; j < dto.supplierRefDtoList.length; j++) {
                let curRef = dto.supplierRefDtoList[j]
                if (curRef.supplierName === supplierName) {
                    useSupplierRef = curRef
                    break
                }
            }
            if (!useSupplierRef) {
                useSupplierRef = dto.supplierRefDtoList[0]
            }
        }
        return useSupplierRef;
    }

    /**
     * 将使用的供应商采购信息，填入到当前采购详情信息中，方便table遍历使用
     * @param dto
     * @param useSupplierRef
     */
    function installSupplierRefInfo(dto, useSupplierRef) {
        if (dto.offerId != null && dto.offerId === useSupplierRef.offerId) {
            return
        }
        dto.articleNo = useSupplierRef.articleNo
        dto.offerId = useSupplierRef.offerId
        dto.specId = useSupplierRef.specId
        dto.attrStr = useSupplierRef.attrStr
        dto.urlType = useSupplierRef.urlType
        dto.ifMultiple = useSupplierRef.ifMultiple
        dto.originCost = useSupplierRef.quote
        dto.taxPrice = useSupplierRef.quote
        dto.amount = dto.amount || 0
        dto.totalWeight = dto.totalWeight || 0
        dto.sendAddress = useSupplierRef.sendAddress
        dto.supplierNote = useSupplierRef.note
        dto.ifSupplierPack = useSupplierRef.ifSupplierPack
        dto.supplierPackFee = useSupplierRef.supplierPackFee
        dto.stockPackFee = useSupplierRef.stockPackFee
        dto.ifDivision = useSupplierRef.ifDivision
        dto.provideIdentification = useSupplierRef.provideIdentification
    }

    /**
     * 合并新旧子表信息， 相同sku则仅保留旧表信息
     * @param list
     * @returns {*[]}
     */
    function mergeOldAndNewList(list) {
        var allSubList = []
        allSubList = allSubList.concat(purOrderDetailList_purchaseOrder)
        var originMap = {};
        for (var k = 0; k < allSubList.length; ++k) {
            originMap[allSubList[k].prodSId] = allSubList[k]
        }
        for (var j = 0; j < list.length; ++j) {
            if (!originMap[list[j].prodSId]) {
                allSubList.push(list[j])
            }
        }
        return allSubList;
    }

    /**
     * 针对所选供应商，更新详情子表的采购信息
     * @param list
     * @param supplierName
     */
    function installSupplierRefInfoForSubList(list, supplierName) {
        for (let i = 0; i < list.length; ++i) {
            let dto = list[i]
            // 获取当前商品已选供应商采购信息
            let useSupplierRef = getUseSupplier(supplierName, dto);
            // 填充供应商信息到详情子表中
            installSupplierRefInfo(dto, useSupplierRef);
        }
    }

// 订单新增弹窗，控件初始化
    function componentInit() {
        preCalIng = false
        precalLogisticsParam = {}

        // 供应商搜索
        var dim = new DimSearch('#searchSupplier_purchaseOrderDetailForm', 'supplierId');
        dim.init();
        // 初始化选项框
        form.render('select', 'purOrderMainInfoForm');
        form.render('checkbox', 'purOrderMainInfoForm');
        // 初始化必填项
        initNotNull('#purOrderMainInfoForm')
        // 预计到货日期初始化
        laydate.render({
            elem: '#purOrderMainInfoForm [name=delivDay]',
            range: false
        })

        // 付款账号选择
        // form.on('select(pur1688AcctId_purOrderDetail)', function(data) {
        //     var purAcctId = data.value
        //         // 清空收货地址的值
        //     $('#purOrderMainInfoForm [name=purReceiveAddressId]').val('')
        //     initAddressOption_purchaseOrder(purAcctId)
        // });

        // 仓库选择
        form.on('select(storeId_purOrderDetail)', function(data) {
           // 重新预估运费
            purchaseorder_predictLogisticsFee()
        });

        // 采购员选择
        form.on('select(buyerId_purOrderDetail)', function(data) {
            var buyerId = data.value
            // 清空收件人
            $('#purOrderMainInfoForm [name=receiverId]').val('')
            initReceiverOption_purchaseOrder(buyerId)
            match_receiverInfo_purchaseOrder(true)
        });

        // 快递费输入
        $('#purOrderMainInfoForm [name=logisticFee]').on('input propertychange', function() {
                countPrevPayMoney_purchaseOrder()
            })
            // 减免金额输入
        $('#purOrderMainInfoForm [name=discountMoney]').on('input propertychange', function() {
            countPrevPayMoney_purchaseOrder()
        })

        // 匹配收货信息
        $('#toMatchReceiverInfo_purOrderInfo').click(function () {
            match_receiverInfo_purchaseOrder(true)
        })



// sku 选择
        $('#toAddSkuInpBtn_purOrderInfo').click(function() {
            //  获取所选仓库
            var storeId = $('#purOrderMainInfoForm [name=storeId]').val()
            if (!storeId) {
                layer.msg('请先选择仓库')
                return
            }
            var sku = $('#toAddSkuInp_purOrderInfo').val()
            if (!sku) {
                layer.msg('请填写sku')
                return
            }
            var skuSelectPopIndex = layer.open({
                type: 1,
                title: "sku选择",
                area: ["70%", "60%"],
                btn: ['选择', '关闭'],
                shadeClose: false,
                content: $("#skuSelectPop_purchaseOrder").html(),
                success: function(layero, index) {
                    showProductBySkuAndIsSale(sku,true)
                    $('#ifSelectStopSale').click(function () {
                        showProductBySkuAndIsSale(sku)
                    })
                },
                yes: function() {
                    var checkStatus = table.checkStatus('skuSelectTab_purchaseOrder'),
                        selectSkuList = checkStatus.data;
                    if (!selectSkuList || selectSkuList.length == 0) {
                        layer.msg('请选择sku')
                        return false
                    }
                    var skuArr = []
                    for (var i = 0; i < selectSkuList.length; ++i) {
                        skuArr.push(selectSkuList[i].sSku)
                    }
                    toSearchSku(skuArr.join(','),storeId)
                    return false
                } 
            })

            // 搜索选定的skus信息，并展示到子表列表中
            function toSearchSku(skus,storeId) {
                loading.show()
                $.ajax({
                    url: ctx + "/purOrderMain/getprodSInfoBySSkuList.html",
                    type: 'POST',
                    dataType: "json",
                    data: { skus: skus,storeId : storeId },
                    success: function(data) {
                        loading.hide()
                        if (data.code === '0000') {
                            var list = data.data
                            if (!list || list.length === 0) {
                                layer.msg('未找到这些sku的相关数据')
                                return
                            }
                            // 已选供应商
                            let supplierName = $('#searchSupplier_purchaseOrderDetailForm').val().trim()
                            // 设置供应商采购信息
                            installSupplierRefInfoForSubList(list, supplierName);
                            // 合并新老sku集合。 如有新旧相同的。则不再增加该sku
                            var allSubList = mergeOldAndNewList(list);
                            // 检查供应商
                            var checkMsg = checkIfTheSameSupplier(allSubList)
                            if (checkMsg) {
                                layer.msg(checkMsg)
                                return
                            }

                            // 更新子表集合
                            purOrderDetailList_purchaseOrder = allSubList
                            // 重新渲染子表数据
                            showSubTable(purOrderDetailList_purchaseOrder)

                            //  设置默认采购员和部门
                            if (!$('#purOrderMainInfoForm [name=purOrgId]').val()) {
                                $('#purOrderMainInfoForm [name=purOrgId]').val(list[0].firstLevelOrgId)
                            }
                            if (!$('#purOrderMainInfoForm [name=buyerId]').val()) {
                                $('#purOrderMainInfoForm [name=buyerId]').val(list[0].buyerId)
                            }
                            // 初始化收件人选项
                            initReceiverOption_purchaseOrder($('#purOrderMainInfoForm [name=buyerId]').val())
                            form.render('select', 'purOrderMainInfoForm')

                                // 设置自动留言
                                // setAutoPurNote()
                            layer.close(skuSelectPopIndex)
                        } else {
                            layer.msg(data.msg)
                        }
                    },
                    complete: function() {
                        loading.hide()
                    }
                })
            }
        })

        $('body').on('blur','#searchSupplier_purchaseOrderDetailForm',function () {
            window.setTimeout(function () {
                console.log(11)
                if (!purOrderDetailList_purchaseOrder || !purOrderDetailList_purchaseOrder.length) {
                    return
                }
                let supplierName = $('#searchSupplier_purchaseOrderDetailForm').val().trim()
                if (!supplierName) {
                    return;
                }
                // 更新子表的供应商采购信息
                installSupplierRefInfoForSubList(purOrderDetailList_purchaseOrder,supplierName)
                // 重新渲染子表数据
                showSubTable(purOrderDetailList_purchaseOrder)
            },500)
        })

        function showProductBySkuAndIsSale(sSku,isSale) {
            table.render({
                elem: "#skuSelectTab_purchaseOrder",
                id: "skuSelectTab_purchaseOrder",
                method: 'post',
                url: ctx + "/product/getProds.html",
                where: { searchType: 'sSku', searchValue: sSku, page: 1, limit: 300, isCombination: false, isSale: isSale },
                cols: [
                    [
                        { type: "checkbox", width: 20 },
                        { title: "图片", width: 170, templet: '#img_skuSelectPop_purchaseOrder', width: 205 },
                        { field: "sSku", title: "sSku" },
                        { title: "pSku", templet: '<div>{{ d.parent.pSku}}</div>' },
                        { field: "title", title: "商品名称" },

                    ]
                ],
                page: false,
                // width: '100%',
                // limits: [100, 200, 500],
                // limit: 200,
                done: function(res, curr, count) {
                    $("#sSkuNum_purchaseOrder").html(count);
                    //懒加载
                    imageLazyload();
                }
            })
        }

        function setAutoPurNote() {
            var originPurNote = $('#purOrderMainInfoForm [name=purNote]').val()
            if (!originPurNote.trim()) {
                var newSubList = purOrderDetailList_purchaseOrder
                for (var i = 0; i < newSubList.length; ++i) {
                    if (newSubList[i].supplierRefDtoList[0].autoPurNote && newSubList[i].supplierRefDtoList[0].autoPurNote.trim() && originPurNote.indexOf('【' + newSubList[i].prodSId + '】') < 0) {
                        originPurNote += '【$' + newSubList[i].prodSId + '】' + '【' + newSubList[i].title + '】' + (newSubList[i].supplierRefDtoList[0].attrStr ? ('【' + newSubList[i].supplierRefDtoList[0].attrStr + '】') : '') + ':' + newSubList[i].supplierRefDtoList[0].autoPurNote.trim() + "\n"
                    }
                }
                $('#purOrderMainInfoForm [name=purNote]').val(originPurNote)
            }
        }

        deleteAutoPurNote_purchaseOrder = function(prodSId) {
            var originPurNote = $('#purOrderMainInfoForm [name=purNote]').val()
            if (originPurNote.indexOf('【' + prodSId + '】') >= 0) {
                var beginIndex = originPurNote.indexOf('【' + prodSId + '】')
                var endIndex = originPurNote.indexOf('\n', beginIndex) + 2
                var note = originPurNote.replace(originPurNote.substring(beginIndex, endIndex), '')
                $('#purOrderMainInfoForm [name=purNote]').val(note)
            }
        }

        // 批量修改
        $('#updateByList_purOrderDetailList').click(function() {
            var price = $('#detailMoney_purOrderDetailList').val()
            var amount = $('#detailNum_purOrderDetailList').val()
            if (price && !isNaN(price)) {
                for (var i = 0; i < purOrderDetailList_purchaseOrder.length; ++i) {
                    purOrderDetailList_purchaseOrder[i].originCost = price
                }
            }
            if (amount && !isNaN(amount)) {
                for (var i = 0; i < purOrderDetailList_purchaseOrder.length; ++i) {
                    purOrderDetailList_purchaseOrder[i].amount = amount
                        // 计算重量
                    purOrderDetailList_purchaseOrder[i].totalWeight = accMul(purOrderDetailList_purchaseOrder[i].suttleWeight, amount)
                }
            }

            showSubTable(purOrderDetailList_purchaseOrder)
        })
    }

    /**
     * 匹配收件信息
     * @param ifForced   是否强制刷新匹配
     */
    function match_receiverInfo_purchaseOrder(ifForced) {
        if (!ifForced) {
            var purAcctId = $('#purOrderMainInfoForm [name=purAcctId]').val()
            var receiver = $('#purOrderMainInfoForm [name=receiverId]').val()
            var receiveAddress = $('#purOrderMainInfoForm [name=purReceiveAddressId]').val()
            if (purAcctId || receiver || receiveAddress) {
                return
            }
        }
        var storeId = $('#purOrderMainInfoForm [name=storeId]').val()

        if (!storeId) {
            if (ifForced) {
                layer.msg('请先选择仓库')
            }
            return
        }
        var Adata = serializeObject($('#purOrderMainInfoForm'))
        Adata.detailList = purOrderDetailList_purchaseOrder
        Adata.supplierName = $("#searchSupplier_purchaseOrderDetailForm").val()
        Adata.buyer = $("#purOrderMainInfoForm [name=buyerId] option:selected").text()
        Adata.storeName = $("#purOrderMainInfoForm [name=storeId] option:selected").text()
        Adata.purAcctId = null
        Adata.receiverId = null
        Adata.purReceiveAddressId = null
        if (!Adata.detailList || !Adata.detailList.length) {
            return;
        }
        loading.show()
        $.ajax({
            url: ctx + "/purOrderMain/getReceiveInfo.html",
            type: 'POST',
            dataType: "json",
            contentType: 'application/json',
            data: JSON.stringify(Adata),
            success: function(res) {
                loading.hide()
                if (res.code == '0000') {
                    $('#purOrderMainInfoForm [name=purAcctId]').val(res.data.purAcctId)
                    $('#purOrderMainInfoForm [name=receiverId]').val(res.data.receiverId)
                    $('#purOrderMainInfoForm [name=purReceiveAddressId]').val(res.data.purReceiveAddressId)

                    form.render('select','purOrderMainInfoForm')
                } else {
                    layer.msg(res.msg)
                }
            },
            complete: function() {
                loading.hide()
            }
        })
    }
    initReceiverOption_purchaseOrder = function (buyerId) {
        var optionList = $('#purOrderMainInfoForm #purReceiverOptionDiv option')
        // 对应账号id的选项可选
        var buyerIdOfReceiver
        var availableOption = []
        for (var i = 0; i < optionList.length; ++i) {
            buyerIdOfReceiver = optionList[i].getAttribute('data-buyerId')
            if (buyerIdOfReceiver == buyerId) {
                availableOption.push($(optionList[i]).clone(true))
            }
        }
        $('#purOrderMainInfoForm [name=receiverId]').html('')
        $('#purOrderMainInfoForm [name=receiverId]').append('<option value=""></option>')
        $('#purOrderMainInfoForm [name=receiverId]').append(availableOption)
        form.render('select', 'purOrderMainInfoForm')
        match_receiverInfo_purchaseOrder(false)
    }

    initAddressOption_purchaseOrder = function(purAcctId) {
        let addForm = $('#purOrderMainInfoForm')
        var optionList = addForm.find('#purReceiveAddressOptionDiv option')
        // 初始化全不可选择
        // optionList.attr('disabled','disabled')
        // 对应账号id的选项可选
        var purAcctIdOfAddress
        var availableOption = []
        for (var i = 0; i < optionList.length; ++i) {
            purAcctIdOfAddress = optionList[i].getAttribute('data-acctId')
            if (purAcctIdOfAddress == purAcctId) {
                availableOption.push($(optionList[i]).clone(true))
            }
        }
        addForm.find('[name=purReceiveAddressId]').html('')
        addForm.find('[name=purReceiveAddressId]').append('<option value=""></option>')
        addForm.find('[name=purReceiveAddressId]').append(availableOption)
        form.render('select', 'purOrderMainInfoForm')
    }

    function checkIfTheSameSupplier(data) {
        let dataForm = $('#purOrderMainInfoForm')
        let supplierName = $('#searchSupplier_purchaseOrderDetailForm').val().trim()
        // 如果未填写供应商，则使用第一个sku的默认供应商 及 发货地址
        if (!supplierName) {
            // 获取第一个sku的 默认供应商
            for (let i = 0; i < data[0].supplierRefDtoList.length; ++i) {
                if (data[0].supplierRefDtoList[i].ifDefault) {
                    supplierName = data[0].supplierRefDtoList[i].supplierName
                    $('#searchSupplier_purchaseOrderDetailForm').val(supplierName)
                    break
                }
            }
        }
        // 检查是否所有sku都有 所填写的供应商
        let noSupplierSkuArr = []
        let supplierList,ifHas,supplierId
        for (let i = 0; i < data.length; ++i) {
            ifHas = false
            supplierList = data[i].supplierRefDtoList
            for (let j = 0; j < supplierList.length; ++j) {
                if (supplierList[j].supplierName === supplierName) {
                    ifHas = true
                    supplierId = supplierList[j].supplierId
                }
            }
            if (!ifHas) {
                noSupplierSkuArr.push(data[i].sSku)
            }
        }
        // supplierName 和supplierId 强相关矫正
        dataForm.find('[name=supplierId]').val(supplierId)

        if (noSupplierSkuArr.length > 0) {
            return 'sku:' + noSupplierSkuArr.join(',') + " 不存在供应商 " + $('#searchSupplier_purchaseOrderDetailForm').val()
        }
    }

    /**
     * 展示子表
     * @param data  数据
     * @param ifUpdate 是否锁定不可更改
     * @param notPredictLogisticsFee 为true则不重新进行运费预估
     */
    function showSubTable(data, ifLock,notPredictLogisticsFee) {
        if (!data) {
            data = []
        }
        data?.forEach( v => {
            v?.prodSupplierPurOrderDtoSet?.forEach(item => {
                v?.supplierRefDtoList?.forEach(cItem => {
                    if (item.supplierId === cItem.supplierId) {
                        item.specId = cItem.specId
                        item.offerId = cItem.offerId
                        item.attrStr = cItem.attrStr
                    }
                })
            })
        })
        console.log('dasdsa', data)
        table.render({
            elem: "#purOrderDetailTable_orderInfo",
            cols: [
                [
                    { title: "图片", templet: "#image_purOrderDetail" },
                    { field: "sSku", title: "商品sku", templet: '#purOrder_skuAndStockLocation', width: 130 },
                    { field: "bizzOwner", title: "开发专员", templet: '#purOrder_bizzOwnerAndTitle',width: 120 },
                    { title: `货号<br>${data[0]?.provideIdentification ? '<span class="prod_tag">有货号标记</span>' : '<span class="danger_tag">无货号标记</span>'}
                    <br>${data[0]?.ifDivision ? '<span class="prod_tag">有物理分割</span>' : '<span class="danger_tag">无物理分割</span>'}`, field: 'articleNo',templet: '#purchaseOrder_articleNo', width: 100 },
                    { title: "下单备注", field: 'supplierNote' },
                    { title: "<div class='totalSuttleWeight_subdetailList'></div>累计净重(g)", templet: '#totalWeight_subDetailList' },
                    { field: "style", title: "款式" }, 
                    !ifLock ? { title: "采购单价(￥)", templet: '#originCost_purOrderDetail' } : { field: 'originCost', title: "采购单价(￥)" },
                    { title: "含税单价(￥)", field: 'taxPrice' },
                    { title: "供应商包装", templet: '#ifSupplierPack_purOrderDetail', width:100 },
                    // { title: "供应商包装费用(￥)", width: 50, field: 'supplierPackFee' },
                    { title: "可用/在途/未派", templet: "<div>{{d.stockNum != null ? ( accSub(d.stockNum, d.reservationNum) + '/' + (d.orderNotInNum || 0) + '/' + (d.lackUnPaiNum || 0) ) : '' }}</div>" },
                    { title: "未入库数量", templet: '<div>{{accSub(d.amount , (d.inAmount || 0))}}</div>' },
                    { title: "预计可用库存", templet: "<div>{{d.stockNum - d.reservationNum + d.orderNotInNum + d.lackReservationNum - d.lackUnPaiNum}}</div>" },
                    { field: "fiveSalesNum", title: "5/15/30天销量", templet: '#daylysSales_purchaseOrder' },
                    { field: "purOrderMinPrice", title: "近一年最低采购成本价", templet: '#purOrder_minPrice' },
                    !ifLock ? { title: "<div class='amount_subdetailList'></div>采购数量", templet: '#buyerAmount_purOrderDetail' } : { field: 'amount', title: "<div class='amount_subdetailList'></div>采购数量" },
                    { title: "<div class='totalMoney_subdetailList'></div>累计金额(￥)", templet: "#subTotalMoney_purOrderDetail" },
                    { title: "供应商", templet: "#subSupplierList_purOrderDetail", width: 200 }, !ifLock ? { title: '操作', align: 'center', toolbar: '#purOrderDetailTable_bar', width: 60 } : { title: '操作', align: 'center', width: 60 }
                ]
            ],
            data: data,
            id: "layer_purhasetable",
            page: false,
            done: function() {
                // 创建1688订单失败， 是因为起批量和超过最大购买量的，标黄色
                setRowBackColor('.purchaseOrder_failCreate1688', { 'background-color': 'rgb(253, 253, 144)' })

                imageLazyloadAll();
                // 绑定修改采购数量的方法
                setEventByselector('#purOrderDetailTable_orderInfo', '.amountInp_purOrderDetail', 'input propertychange', toSetBuyAmount)
                    // 绑定修改采购单价的方法
                setEventByselector('#purOrderDetailTable_orderInfo', '.originCostInp_purOrderDetail', 'input propertychange', toSetOriginCost)
                    // 绑定删除子表的方法
                setEventByselector('#purOrderDetailTable_orderInfo', '.deleteBtn_purOrderDetail', 'click', todeletePurOrderDetail)

                // 计算金额
                countTotalProdMoney()
                // 计算数量
                countAmount_purchaseOrder(notPredictLogisticsFee)
                // 计算预付款
                countPrevPayMoney_purchaseOrder()
                // 设置表头固定
                $('#purOrderDetailTable_orderInfo').next('.layui-table-view').find('.layui-table-header').addClass('toFixedContain')
                $('#detailPop_purchaseOrder').on('click','.clcikRoutTo',routerTo)
            },
            limit: data.length
        })
    }
    // 计算预付款
    countPrevPayMoney_purchaseOrder = function() {
        var logisticFee = $('#purOrderMainInfoForm [name=logisticFee]').val()
        if (!logisticFee || isNaN(logisticFee)) {
            logisticFee = 0
        }
        var totalProdMoney = $('#purOrderMainInfoForm [name=totalProdMoney]').val()
        var disCount = $('#purOrderMainInfoForm [name=discountMoney]').val()
        if (!disCount || isNaN(disCount)) {
            disCount = 0
        }
        var prevPayMoney = accSub(accAdd(logisticFee, totalProdMoney), disCount)
        $('#purOrderMainInfoForm [name=prevPayMoney]').val(prevPayMoney.toFixed(2))
    }

    function toSetOriginCost() {
        let currentTr = $(this).closest('tr')
        let index = purchaseorder_getCurTrData(currentTr)
        let value = this.value
        if (!value) {
            purOrderDetailList_purchaseOrder[index].originCost = 0
        } else if (value && !(/^[0-9]+(.[0-9]{0,4})?$/.test(value))) {
            layer.msg('请输入正确金额')
            this.value = ''
            purOrderDetailList_purchaseOrder[index].originCost = 0
        } else {
            purOrderDetailList_purchaseOrder[index].originCost = parseFloat(value)
        }
        // 重新计算货物总金额
        countTotalProdMoney()
            // 重新渲染子表的含税单价和累计金额数据
        currentTr.find('.taxPrice_purOrderDetail').text(purOrderDetailList_purchaseOrder[index].taxPrice)
        currentTr.find('.subTotalMoney_purOrderDetail').text(accMul(purOrderDetailList_purchaseOrder[index].originCost, purOrderDetailList_purchaseOrder[index].amount).toFixed(2))
            // 重新计算预付款
        countPrevPayMoney_purchaseOrder()
    }

    /**
     * 计算总数量/总重量
     * @param notPredictLogisticsFee 为true则不需要计算预估运费
     */
    function countAmount_purchaseOrder(notPredictLogisticsFee) {
        var amount = 0;
        var totalWeight = 0;
        for (var i = 0; i < purOrderDetailList_purchaseOrder.length; ++i) {
            amount = accAdd(amount, purOrderDetailList_purchaseOrder[i].amount || 0)
            totalWeight = accAdd(totalWeight, purOrderDetailList_purchaseOrder[i].totalWeight || 0)
        }
        $('.amount_subdetailList').text(amount)
        settotalSuttleWeight(totalWeight,notPredictLogisticsFee)
    }

    /**
     * 显示总重量
     * @param totalWeight  总重量
     * @param notPredictLogisticsFee  为true则不需要计算预估运费
     */
    function settotalSuttleWeight(totalWeight,notPredictLogisticsFee){
        $('.totalSuttleWeight_subdetailList').text(totalWeight)
        // 计算预估运费
        if (notPredictLogisticsFee) {
            return
        }
        purchaseorder_predictLogisticsFee()
    }

    // 设置采购数量
    function toSetBuyAmount() {
        var currentTr = $(this).closest('tr')
        let index = purchaseorder_getCurTrData(currentTr)
        var value = this.value
        var currentTrWeight // 当前行总净重
        var allWeight // 所有商品总净重
        if (!value) {
            purOrderDetailList_purchaseOrder[index].amount = 0
            purOrderDetailList_purchaseOrder[index].totalWeight = 0
            purOrderDetailList_purchaseOrder[index].totalMoney = 0
        } else if (value && !(/^[0-9]*$/.test(value))) {
            layer.msg('请输入正整数')
            this.value = ''
            purOrderDetailList_purchaseOrder[index].amount = 0
            purOrderDetailList_purchaseOrder[index].totalWeight = 0
            purOrderDetailList_purchaseOrder[index].totalMoney = 0
            countTotalProdMoney()
            return
        } else {
            purOrderDetailList_purchaseOrder[index].amount = parseInt(value)
            purOrderDetailList_purchaseOrder[index].totalWeight = parseFloat(accMul(purOrderDetailList_purchaseOrder[index].suttleWeight, purOrderDetailList_purchaseOrder[index].amount).toFixed(2))
            purOrderDetailList_purchaseOrder[index].money = parseFloat(accMul(purOrderDetailList_purchaseOrder[index].originCost, purOrderDetailList_purchaseOrder[index].amount.toFixed(2)).toFixed(2))
        }
        // 重新计算货物总金额
        countTotalProdMoney()
            // 重新渲染累计金额
        currentTr.find('.subTotalMoney_purOrderDetail').text(purOrderDetailList_purchaseOrder[index].money)
        currentTr.find('.subTotalWeight_purOrderDetail').text(purOrderDetailList_purchaseOrder[index].totalWeight)
            // 重新计算预付款
        countPrevPayMoney_purchaseOrder()
            //计算总数量 和总重量
        countAmount_purchaseOrder()
    }
    
    function purchaseorder_getCurTrData(curTr) {
        let sSku = curTr.find('[data-field=sSku]').attr('data-content')
        for (let i = 0; i < purOrderDetailList_purchaseOrder.length; ++i) {
            if (purOrderDetailList_purchaseOrder[i].sSku === sSku) {
                return i
            }
        }
    }
    
    // 删除子表
    function todeletePurOrderDetail() {
        let curTr = $(this).closest('tr')
        let curTrDataIndex = purchaseorder_getCurTrData(curTr)
        // 删除对应的sku的自动采购留言
        let prodSId = purOrderDetailList_purchaseOrder[curTrDataIndex].prodSId
        deleteAutoPurNote_purchaseOrder(prodSId)
        // 删除对应的数据
        purOrderDetailList_purchaseOrder.splice(curTrDataIndex, 1);
        // 计算金额
        countTotalProdMoney()
        // 计算数量
        countAmount_purchaseOrder()
        // 计算预付款
        countPrevPayMoney_purchaseOrder()
        // 删除对应的页面元素
        curTr.remove()
    }

    // 计算货物金额
    function countTotalProdMoney() {
        if (!purOrderDetailList_purchaseOrder || purOrderDetailList_purchaseOrder.length == 0) {
            return
        }
        var totalProdMoney = 0;
        var subTotalMoney
        for (var i = 0; i < purOrderDetailList_purchaseOrder.length; ++i) {
            subTotalMoney = accMul(purOrderDetailList_purchaseOrder[i].originCost, purOrderDetailList_purchaseOrder[i].amount)
            totalProdMoney = accAdd(totalProdMoney, subTotalMoney)
        }
        $('#purOrderMainInfoForm [name=totalProdMoney]').val(totalProdMoney.toFixed(2))
        $('.totalMoney_subdetailList').text(totalProdMoney.toFixed(2))
    }

    // 组装数据，并进行数据校验
    function getData_purOrderMain() {
        if (!checkNotNull("#purOrderMainInfoForm")) {
            return false
        }
        if (!purOrderDetailList_purchaseOrder || purOrderDetailList_purchaseOrder.length === 0) {
            layer.msg("请填写采购明细")
            return false
        }

        // 校验采购数量填写
        for (let i = 0; i < purOrderDetailList_purchaseOrder.length; ++i) {
            if (!purOrderDetailList_purchaseOrder[i].amount) {
                layer.msg('sku: ' + purOrderDetailList_purchaseOrder[i].sSku + '的采购数量 请填写非零正整数')
                return false
            }
        }

        var data = serializeObject($('#purOrderMainInfoForm'))
        data.detailList = purOrderDetailList_purchaseOrder
        data.supplierName = $("#searchSupplier_purchaseOrderDetailForm").val()
        data.buyer = $("#purOrderMainInfoForm [name=buyerId] option:selected").text()
        data.storeName = $("#purOrderMainInfoForm [name=storeId] option:selected").text()
        // data.orderType = $("#purOrderMainInfoForm [name=orderType]").prop('checked') ? 2 : 1

        return data
    }

    table.on('tool(purchaseOrder_table)', function(obj) {
        var layEvent = obj.event; //获得 lay-event 对应的值
        var data = obj.data; //获得当前行数据
        if (layEvent == 'detail') {
            var btnArr = []
            if (data.status) {
                btnArr = [ '保存', '关闭']
            } else {
                btnArr = [ '保存并同步给普源', '关闭']
            }
            var popIndex = layer.open({
                type: 1,
                title: "采购订单",
                id: "detailPop_purchaseOrder",
                area: ["98%", "70%"],
                btn: btnArr,
                maxmin: true,
                move: '.layui-layer-title',
                content: $("#purOrderDetail_pop").html(),
                success: function(layero, index) {
                    //保存权限按钮控制
                    if(!$('#purchaseOrder_layerDetailSaveBtn').html().trim()){
                      layero.find('.layui-layer-btn.layui-layer-btn- >.layui-layer-btn0').css('display','none');
                    }
                    function backTodo() {
                        // 初始化控件
                        if (data.auditStatus == 0) {
                            componentInit()
                            // 初始化审核按钮
                            if ($('#purchaseOrder_auditPurOrderBtn').length > 0) {
                                var $target = layero.find('.layui-layer-btn.layui-layer-btn-'),
                                    $html = `<div class="layui-form-item layui-form" style="position:absolute;bottom:2px;width: 80%">
                                                <div class="layui-inline"  style="float: left;">
                                                    <button type="button" class="layui-btn layui-btn-sm layui-btn-normal" onclick="ajaxAuditPurchaseOrder(` + data.id + `)">审核</button>
                                                </div>
                                        </div>`;
                                $target.append($html);
                            }
                        }
                    }

                    // 查询原数据并初始化
                    formSelects.render('note_purchaseOrder_AddForm');
                    originDataInit_purOrderDetail(data.id,backTodo)



                    // 操作日志初始化
                    $('#purOrderLogLab').show()
                    $('#purOrderLogLab').attr('data-id', data.id)
                    $('#purOrderLogLab').attr('data-init', '1')
                    $('#purOrderLogLab').click(function() {
                        var ifInit = $(this).attr('data-init')
                        if (ifInit == '2') {
                            return
                        }
                        table.render({
                            elem: "#purchaseOrderLogTab",
                            id: "purchaseOrderLogTab",
                            method: 'post',
                            url: ctx + "/purOrderMain/queryLogList.html",
                            where: { purOrderMainId: data.id },
                            cols: [
                                [
                                    { title: "时间", width: 150, templet: '<div>{{format(d.createTime, "yyyy-MM-dd hh:mm:ss")}}</div>' },
                                    { field: "creator", title: "操作人", width: 100 },
                                    { title: "操作类型", templet: '#operType_purOrderLog', width: 150 },
                                    { field: "operDesc", title: "操作详情" },
                                ]
                            ],
                            page: false,
                            width: '100%',
                            done: function(res, curr, count) {
                                // 标记已经初始化操作日志
                                $('#purOrderLogLab').attr('data-init', '2');
                            }
                        })
                    })

                    // 固定表头
                    $('#detailPop_purchaseOrder').scroll(function() {
                        toFixedTabHead(this)
                    })
                },
                yes: function() {
                    var Adata = getData_purOrderMain();
                    if (!Adata) {
                        return
                    }
                    // let follower = followList?.filter(item => item.value == Adata.followerId)[0]?.name
                    Adata.id = data.id
                    Adata.logisticFee = Adata.logisticFee || 0
                    Adata.discountMoney = Adata.discountMoney || 0
                    Adata.prevPayMoney = Adata.prevPayMoney || 0
                    // Adata.follower = follower
                    // if (data.auditStatus == 0 && ((Adata.purAcctId && !Adata.purReceiveAddressId) || (Adata.purReceiveAddressId && !Adata.purAcctId))) {
                    //     layer.msg('采购账号和收货地址必须同时指定，否则请不要选择，会自动使用默认账号和收货地址')
                    //     return
                    // }
                    // 提交修改
                    loading.show()
                    $.ajax({
                        url: ctx + "/purOrderMain/addOrUpdPurOrderMain.html",
                        type: 'POST',
                        dataType: "json",
                        contentType: 'application/json',
                        data: JSON.stringify(Adata),
                        success: function(data) {
                            if (data.code == '0000') {
                                layer.close(popIndex)
                                active_purchaseOrder.reloadWithoutFresh()
                                layer.msg('修改成功')
                            } else {
                                layer.msg(data.msg)
                            }
                        },
                        complete: function() {
                            loading.hide()
                        }
                    })

                }
            })
        } else if (layEvent === 'delete') {
            let idList = [data.id]
            purchaseOrder_disablePurOrder(idList)
        } else if (layEvent === 'createstockin') {
            let billNumber = data.billNumber;//生成采购入库单
            stockinorder_add_btn_fun(billNumber);
        } else if (layEvent === 'refund') {
            let index = layer.open({
                type: 1,
                title: "申请退款",
                area: ["80%", '95%'],
                shadeClose: false,
                btn: ['确认', '关闭'],
                content: $("#refundRequirePop_purchaseOrder").html(),
                success: function(index, layero) {
                    // 展示运费
                    $('#refundRequirePop_purchaseOrder_logisticsFeeSpan').text(data.logisticFee)
                    initNotNull('#refundRequireForm')
                    $('#refundTips').show()
                    // 初始化订单详情数据
                    renderRefundDetailInfo(data.id,index)
                    form.render('select', 'refundRequireForm')
                },
                yes: function() {
                    if (!checkNotNull('#refundRequireForm')) {
                        return
                    }
                    let Adata = {}
                    var refundInfo = serializeObject($('#refundRequireForm'))
                    Adata.id = data.id
                    Adata.refundInfo = refundInfo
                    loading.show()
                    let detailList = table.cache.purchaseOrder_refundDetailTable
                    Adata.detailList = []

                    let totalRefunQty = 0
                    let totalRefunMoney = 0
                    for (let i = 0; i< detailList.length; ++i) {
                        let one = detailList[i]
                        totalRefunQty = accAdd(totalRefunQty,one.refundQty)
                        totalRefunMoney = accAdd(totalRefunMoney,one.refundMoney)
                        Adata.detailList.push({
                            id: one.id,
                            prodSId: one.prodSId,
                            sSku: one.sSku,
                            refundQty: one.refundQty,
                            refundMoney: one.refundMoney,
                        })
                    }
                    Adata.refundInfo.requireRefund = totalRefunMoney
                    Adata.refundInfo.refundAmout = totalRefunQty
                    Adata.refundInfo.refundMethod = $('#refundService').val() || ''
                    Adata.refundInfo.aliRefundReason = $('#purchaseOrderrefundReason option:checked').text()
                    Adata.refundInfo.aliRefundReasonId = $('#purchaseOrderrefundReason').val()
                    Adata.refundInfo.refundDeclare = $('#refundRequireForm').find('[name=refundDeclare]').val()
                    Adata.refundInfo.refundLogisticsFee = $('#refundRequireForm').find('[name=refundLogisticFee]').val()
                    $.ajax({
                        url: ctx + "/purOrderMain/requireRefund.html",
                        type: 'POST',
                        dataType: "json",
                        contentType: "application/json;charset=utf-8",
                        data: JSON.stringify(Adata),
                        success: function(res) {
                            loading.hide()
                            if (res.code == '0000') {
                                layer.close(index)
                                layer.msg('申请成功')
                                active_purchaseOrder.reloadWithoutFresh()
                            } else {
                                layer.msg(res.msg, {time: 5000})
                            }
                        },
                        error: function() {
                            loading.hide()
                            layer.msg('服务器繁忙，请稍后再试')
                        }
                    })
                }
            })
        } else if (layEvent === 'pullInvalid') {
            let index = layer.open({
                type: 1,
                title: "订单归档",
                area: ["85%", '85%'],
                shadeClose: false,
                btn: ['保存不归档', '归档', '关闭'],
                content: $("#pullInvalidPop_purchaseOrder").html(),
                success: function(index, layero) {
                    // 初始化退款数据
                    initRefundInfo(data.id,false,true)
                    // 显示退款详情数据
                    renderRefundDetailInfoForPullInvalid(data.id,index)
                    // 判断是否1688订单，不是则允许编辑实际退款金额
                    if (!data.ali1688OrderNo || !data.ali1688OrderNo.trim()) {
                        $('#pullInvalidForm [name=aliReceiveRefund]').removeAttr('disabled')
                        $('#pullInvalidForm [name=aliReceiveRefund]').removeClass('gredBack')
                    }

                    initNotNull('#pullInvalidForm')
                },
                yes: function() {
                    if (!checkNotNull('#pullInvalidForm')) {
                        return false
                    }
                    var Adata = serializeObject($('#pullInvalidForm'))
                    Adata.id = data.id
                    Adata.status = false
                    ajaxToPullInvalid(Adata)
                },
                btn2: function () {
                    if (!checkNotNull('#pullInvalidForm')) {
                        return false
                    }
                    var Adata = serializeObject($('#pullInvalidForm'))
                    Adata.id = data.id
                    Adata.status = true
                    ajaxToPullInvalid(Adata)
                }
            })
        } else if (layEvent === 'cancelPullInvalid') {
            let confirmIndex = layer.confirm('确认取消该订单归档吗？', { btn: ['确认', '取消'] }, function() {
                loading.show()
                var Adata = {
                    id: data.id
                }
                $.ajax({
                    url: ctx + "/purOrderMain/cancelPullInvalid.html",
                    type: 'POST',
                    dataType: "json",
                    contentType: "application/json;charset=utf-8",
                    data: JSON.stringify(Adata),
                    success: function(res) {
                        loading.hide()
                        layer.close(confirmIndex)
                        if (res.code == '0000') {
                            layer.msg('取消归档成功')
                            active_purchaseOrder.reloadWithoutFresh()
                        } else {
                            layer.msg(res.msg)
                        }
                    },
                    error: function() {
                        loading.hide()
                        layer.msg('服务器繁忙，请稍后再试')
                    }
                })
            })
        }
        else  if (layEvent === 'pullInvalidDetail') {
            let index = layer.open({
                type: 1,
                title: "归档详情",
                area: ["70%", '60%'],
                shadeClose: false,
                btn: ['关闭'],
                content: $("#pullInvalidPop_purchaseOrder").html(),
                success: function(index, layero) {
                    // 初始化退款数据
                    initRefundInfo(data.id,false,false)
                    // 显示退款详情数据
                    renderRefundDetailInfoForReturn(data.id,index)
                }
            })
        }
        else if (layEvent === 'cancelRefund') {
            let confirmIndex = layer.confirm('确认取消该订单退款吗？', { btn: ['确认', '取消'] }, function() {
                loading.show()
                var Adata = {
                    id: data.id
                }
                $.ajax({
                    url: ctx + "/purOrderMain/cancelRefund.html",
                    type: 'POST',
                    dataType: "json",
                    contentType: "application/json;charset=utf-8",
                    data: JSON.stringify(Adata),
                    success: function(res) {
                        loading.hide()
                        layer.close(confirmIndex)
                        if (res.code == '0000') {
                            layer.msg('取消退款成功')
                            active_purchaseOrder.reloadWithoutFresh()
                        } else {
                            layer.msg(res.msg)
                        }
                    },
                    error: function() {
                        loading.hide()
                        layer.msg('服务器繁忙，请稍后再试')
                    }
                })
            })
        }
        else if (layEvent === 'confirmRefund') {
            let index = layer.open({
                type: 1,
                title: "确认退款申请",
                area: ["80%", '95%'],
                shadeClose: false,
                btn: ['确认', '关闭'],
                content: $("#refundRequirePop_purchaseOrder").html(),
                success: function (index, layero) {
                    // 展示运费
                    $('#refundRequirePop_purchaseOrder_logisticsFeeSpan').text(data.logisticFee)
                    // 初始化退款数据
                    initRefundInfo(data.id,true)
                    // 初始化订单详情数据
                    renderRefundDetailInfo(data.id,index,true)
                },
                yes: function () {
                        loading.show()
                        var Adata = {
                            id: data.id
                        }
                        $.ajax({
                            url: ctx + "/purOrderMain/confirmRefund.html",
                            type: 'POST',
                            dataType: "json",
                            contentType: "application/json;charset=utf-8",
                            data: JSON.stringify(Adata),
                            success: function(res) {
                                loading.hide()
                                if (res.code === '0000') {
                                    layer.msg('确认退款申请成功')
                                    layer.close(index)
                                    active_purchaseOrder.reloadWithoutFresh()
                                } else {
                                    layer.msg(res.msg)
                                }
                            },
                            error: function() {
                                loading.hide()
                                layer.msg('服务器繁忙，请稍后再试')
                            }
                        })
                }
            })
        } else if (layEvent === 'markAbNormal') {
            poptoMarkAbNormal(data)
        } else if (layEvent === 'dealDiffSupplier') {
            popTodealDiffSupplier(data)
        }
    })
    function popTodealDiffSupplier(data) {
        let popIndex = layer.open({
            type: 1,
            title: "供应商处理",
            area: ["700px", '200px'],
            shadeClose: false,
            btn: ['确认', '关闭'],
            content: $("#purchaseOrder_dealDiffSupplierLayer").html(),
            success: function (index, layero) {
                // 复现数据
                if (data.assistInfo) {
                    let formElem = $('#purchaseOrder_dealDiffSupplierForm')
                    formElem.find('[name=diffSupplierDealMethod][value='+ data.assistInfo.diffSupplierDealMethod +']').prop('checked',true)
                    formElem.find('[name=diffSupplierRemark]').val(data.assistInfo.diffSupplierRemark)
                }
                form.render('radio', 'purchaseOrder_dealDiffSupplierForm')
            },
            yes: function () {
                let AData = serializeObject($('#purchaseOrder_dealDiffSupplierForm'))
                AData.pOrderId = data.id
                oneAjax.post({
                    url: '/purOrderMain/dealDiffSupplier',
                    data: AData,
                    success: function (res) {
                        if (res.code === '0000') {
                            layer.msg('操作成功')
                            layer.close(popIndex)
                            refreshTable()
                        } else {
                            layer.msg(res.msg)
                        }
                    }
                })
            }
        })
    }
    function renderRefundDetailInfoForPullInvalid(pOrderId,popLayer){
        $.ajax({
            url: ctx + "/purOrderMain/onlyGetPurOrderDetailById.html",
            type: 'POST',
            dataType: "json",
            contentType: 'application/json',
            data: JSON.stringify({ id: pOrderId }),
            success: function(res) {
                loading.hide()
                if (res.code = '0000') {
                    showRefundDetailForPullInvalid(res.data.detailList,popLayer)
                } else {
                    layer.msg(res.msg)
                }
            },
            error: function() {
                loading.hide()
                layer.msg('服务器繁忙，请稍后再试')
            }
        })
    }
    function renderRefundDetailInfoForReturn(pOrderId,popLayer){
        $.ajax({
            url: ctx + "/purOrderMain/onlyGetRefundPurOrderDetailById.html",
            type: 'POST',
            dataType: "json",
            contentType: 'application/json',
            data: JSON.stringify({ id: pOrderId }),
            success: function(res) {
                loading.hide()
                if (res.code = '0000') {
                    showRefundDetailForPullInvalid(res.data.detailList,popLayer)
                } else {
                    layer.msg(res.msg)
                }
            },
            error: function() {
                loading.hide()
                layer.msg('服务器繁忙，请稍后再试')
            }
        })
    }
    function showRefundDetailForPullInvalid(dataList,popLayer) {
        // 仅显示 存在未入库数量的
        let showList = dataList
        // for (let i = 0; i < dataList.length; ++i) {
        //     let d = dataList[i]
        //     let unInAmount = d.amount - (d.inAmount || 0)
        //     if (unInAmount <= 0) {
        //         continue
        //     }
        //     showList.push(d)
        // }
        // 获取弹窗高度
        let height = $(popLayer).find('.layui-layer-content')[0].offsetHeight
        table.render({
            elem: "#purchaseOrder_refundDetailTableForPullInvalid",
            id: "purchaseOrder_refundDetailTableForPullInvalid",
            data: showList,
            height: height -100,
            cols: [
                [
                    { field: "sSku", title: "商品sku" },
                    { field: "title", title: "商品名称", templet: '#title_purOrder_subDetailList',width: 220 },
                    { field: 'originCost', title: "采购单价(￥)" },
                    { title: "含运费单价(￥)", field: 'taxPrice' },
                    { field: 'amount', title: "采购数量" },
                    { title: "未入库数量", templet: '<div>{{d.amount - (d.inAmount || 0)}}</div>' },
                    { title: "未入库金额", templet: '<div>{{accMul(d.amount - (d.inAmount || 0), d.taxPrice)}}</div>' },
                    { title: `<div>退款数量</div><div id="purchaseorder_totalRefundQty"></div>`, field: 'refundQty'},
                    { title: `<div>退款金额(￥)</div><div id="purchaseorder_totalRefundMoney"></div>`, field: 'refundMoney'}
                ]
            ],
            page: false,
            limit: showList.length,
            done: function() {
                // 固定表头
                // 初始化统计数据
                statisticTotalRefundInfo(true)
            }
        })
    }

    function renderRefundDetailInfo(pOrderId,popLayer,readonly){
        globalPOrderId = pOrderId
        $.ajax({
            url: ctx + "/purOrderMain/onlyGetPurOrderDetailById.html",
            type: 'POST',
            dataType: "json",
            contentType: 'application/json',
            data: JSON.stringify({ id: pOrderId }),
            success: function(res) {
                loading.hide()
                if (res.code = '0000') {
                    pOrderDetailList = res.data.detailList
                    showRefundDetail(res.data.detailList,popLayer,readonly)
                    // 初始化原退款数据
                    initRefundInfo(pOrderId, true)
                    
                } else {
                    layer.msg(res.msg)
                }
            },
            error: function() {
                loading.hide()
                layer.msg('服务器繁忙，请稍后再试')
            }
        })
    }

    let globalPOrderId
    let pOrderDetailList
    // 选择退款服务中的退货退款，则显示退货地址和退货方式
    form.on('select(refundService)', function(data) {
        // if (data.value === 'returnRefund') {
        //     $('.refundInfo').show()
        // } else {
        //     $('.refundInfo').hide()
        // }
        let goodsStatus = $('#goodsStatus').val()
        if (goodsStatus && data.value) {
            getRefundReason(globalPOrderId, pOrderDetailList)
        }
    })

    // 选择货品情况
    form.on('select(goodsStatus)', function(data) {
        let refundService = $('#refundService').val()
        if (refundService && data.value) {
            getRefundReason(globalPOrderId, pOrderDetailList)
        }
    })

    function getRefundReason(pOrderId, list, func) {
        // let applyRefundMoney = $('#refundRequireForm [name=refundMoney]').val()
        // if (Number(applyRefundMoney) <= 0) {
        //     return layer.msg('请填写退款金额')
        // }
        list = list?.map(item => {
            let { id, prodSId, sSku, refundQty, refundMoney, subItemId } = item;
            return {
                id,
                prodSId,
                sSku,
                refundQty,
                refundMoney,
                subItemId
            }
        })
        $.ajax({
            type:"post",
            url:ctx + "/purOrderMain/getRefundReason",
            dataType:"json",
            contentType: 'application/json',
            data: JSON.stringify({
                id: pOrderId,
                detailList: list || [],
                refundInfo: {
                    goodsStatus: $('#goodsStatus').val(),
                    refundMethod: $('#refundService').val(),
                }
            }),
            success:function(returnData){
                if (returnData.code == '0000') {
                    commonRenderSelect('purchaseOrderrefundReason', returnData.data, { name: 'name', code: 'id' }).then(() => form.render('select'));
                    func && func()
                } else {
                    layer.msg(returnData.msg)
                }
            },
            error: function() {
                layer.msg('服务器繁忙，请稍后再试')
            }
        })
    }

    var refundMoneyAll = 0;
    function showRefundDetail(dataList,popLayer,readonly) {
        // 仅显示 存在未入库数量的
        let showList = dataList
        // for (let i = 0; i < dataList.length; ++i) {
        //     let d = dataList[i]
        //     let unInAmount = d.amount - (d.inAmount || 0)
        //     if (unInAmount <= 0) {
        //         continue
        //     }
        //     showList.push(d)
        // }
        // 获取弹窗高度
        // let height = popLayer.offsetHeight
        let height = $(popLayer).find('.layui-layer-content')[0].offsetHeight

        let refundQtyObj = { title: `<div>退款数量<i class="layui-icon layui-icon-edit" style="color: #009688">&#xe642;</i></div><div id="purchaseorder_totalRefundQty"></div>`, field: 'refundQty',style: "background-color: #7FFFD4;",edit: 'text'}
        let refundMoneyObj = { title: `<div>退款金额(￥)<i class="layui-icon layui-icon-edit" style="color: #009688">&#xe642;</i></div><div id="purchaseorder_totalRefundMoney"></div>`, field: 'refundMoney',style: "background-color: #7FFFD4;",edit: 'text'}
        if (readonly) {
            refundQtyObj = { title: `<div>退款数量</div><div id="purchaseorder_totalRefundQty"></div>`, field: 'refundQty'}
            refundMoneyObj = { title: `<div>退款金额(￥)</div><div id="purchaseorder_totalRefundMoney"></div>`, field: 'refundMoney',}
        }
        table.render({
            elem: "#purchaseOrder_refundDetailTable",
            id: "purchaseOrder_refundDetailTable",
            data: showList,
            height: height -370,
            cols: [
                [
                    { field: "sSku", title: "商品sku" },
                    { field: "title", title: "商品名称", templet: '#title_purOrder_subDetailList',width: 220 },
                    { field: 'originCost', title: "采购单价(￥)" },
                    { title: "含运费单价(￥)", field: 'taxPrice' },
                    { field: 'amount', title: "采购数量" },
                    { title: "未入库数量", templet: '<div>{{d.amount - (d.inAmount || 0)}}</div>' },
                    { title: "未入库金额", templet: '<div>{{accMul(d.amount - (d.inAmount || 0), d.taxPrice)}}</div>' },
                    { title: "实付金额", field: 'actPayMoney' },
                    refundQtyObj,
                    refundMoneyObj
                ]
            ],
            page: false,
            limit: showList.length,
            done: function() {
                // 固定表头
                // $('#deailShowTable_purchaseOrder').next('.layui-table-view').find('.layui-table-header').addClass('toFixedContain')
                statisticTotalRefundInfo()
                if (!readonly) {
                    // 初始化统计数据
                    // 监听修改
                    table.on('edit(purchaseOrder_refundDetailTable)', function(obj) {
                        var value = obj.value //得到修改后的值
                        //     , data = obj.data //得到所在行所有键值
                        //     , field = obj.field; //得到字段
                        //校验是否金额
                        if (!isMoney(value)) {
                            layer.msg('请填入正确的金额')
                        }
                        statisticTotalRefundInfo()
                        let goodsStatus = $('#goodsStatus').val()
                        let refundService = $('#refundService').val()
                        if (goodsStatus && refundService) {
                            getRefundReason(globalPOrderId, pOrderDetailList)
                        }
                    })
                }
            }
        })
    }

    function statisticTotalRefundInfo(ifPullvalid) {
        let list
        if (ifPullvalid) {
            list = table.cache.purchaseOrder_refundDetailTableForPullInvalid
        } else{
            list = table.cache.purchaseOrder_refundDetailTable
        }

        let totalRefunQty = 0
        let totalRefunMoney = 0
        for (let i = 0; i< list.length; ++i) {
            totalRefunQty = accAdd(totalRefunQty,list[i].refundQty)
            totalRefunMoney = accAdd(totalRefunMoney,list[i].refundMoney)
        }
        $('#purchaseorder_totalRefundQty').text(totalRefunQty)
        $('#purchaseorder_totalRefundMoney').text(totalRefunMoney)
        $('#applyRefundMoney').val(totalRefunMoney)
    }

    // 弹窗-标记异常
    function poptoMarkAbNormal(data) {
        let popIndex = layer.open({
            type: 1,
            title: "标记异常",
            area: ["35%", '300px'],
            shadeClose: false,
            btn: ['确认', '关闭'],
            content: $("#purchaseOrder_markAbNormalPop").html(),
            success: function (index, layero) {
                // 初始化采购备注
                $('#purchaseOrder_markAbNormalForm').find('[name=memo]').val(data.memo)
                form.render('radio','purchaseOrder_markAbNormalForm')
            },
            yes: function () {
                let formEle = $('#purchaseOrder_markAbNormalForm')
                let Adata = {
                    id: data.id,
                    ifNormal: formEle.find('[name=ifNormal]:checked').val(),
                    memo: formEle.find('[name=memo]').val()
                }
                if (Adata.ifNormal == null) {
                    layer.msg('请选择处理结果')
                    return
                }
                oneAjax.post({
                    url: ctx + "/purOrderMain/updateField.html",
                    data: Adata,
                    success: function(res) {
                        if (res.code === '0000') {
                            layer.close(popIndex)
                            layer.msg('操作成功')
                            refreshTable()
                        } else {
                            layer.msg(res.msg)
                        }
                    },
                })
            }
        })
    }
    // 诚E赊余额编辑
    $('#purchaseOrder_updateCreditRemainBtn').click(function () {
        var popIndex = layer.open({
            type: 1,
            title: "诚E赊余额编辑",
            area: ["45%", "200px"],
            btn: ['保存', '关闭'],
            shadeClose: false,
            content: $("#purchaseOrder_updateCreditRemainPop").html(),
            success: function (layero, index) {
                let ajax = new Ajax(false)
                ajax.post({
                    url: ctx + '/purOrderMain/getCreditRemain.html',
                    success: function (res) {
                        if (res.code === '0000') {
                            $('#purchaseOrder_updateCreditRemainForm').find('[name=remain]').val(res.data / 100)
                        }
                    }
                })
            },
            yes: function () {
                let remain = $('#purchaseOrder_updateCreditRemainForm').find('[name=remain]').val()
                if (!isMoney(remain)) {
                    layer.msg('请填入正确金额')
                    return false;
                }
                remain = parseFloat(remain).toFixed(2)
                let ajax = new Ajax(false)
                ajax.post({
                    url: ctx + '/purOrderMain/updateCreditRemain.html',
                    data: JSON.stringify(remain * 100),
                    success: function (res) {
                        if (res.code === '0000') {
                            layer.msg('修改成功')
                            layer.close(popIndex)
                        }
                    }
                })
            }
        })
    })

    function ajaxToPullInvalid(Adata) {
        loading.show()
        $.ajax({
            url: ctx + "/purOrderMain/pullInvalid.html",
            type: 'POST',
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify(Adata),
            success: function(res) {
                loading.hide()
                if (res.code == '0000') {
                    layer.closeAll()
                    if (Adata.status) {
                        layer.msg('归档成功')
                    } else {
                        layer.msg('保存成功')
                    }
                    active_purchaseOrder.reloadWithoutFresh()
                } else {
                    layer.msg(res.msg)
                }
            },
            error: function() {
                loading.hide()
                layer.msg('服务器繁忙，请稍后再试')
            }
        })
    }

    function initRefundInfo(id, ifRefundPop, changeAble_pullinvalid) {
        loading.show()
        var Adata = {
            id: id
        }
        $.ajax({
            url: ctx + "/purOrderMain/getRefundInfo.html",
            type: 'POST',
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify(Adata),
            success: function(res) {
                loading.hide()
                if (res.code == '0000') {
                    var pojo = res.data
                    if (pojo && pojo.refundInfo) {
                        if (ifRefundPop) { // 退款详情展示
                            $('#refundRequireForm [name=refundReason]').val(pojo.refundInfo.refundReason)
                            $('#refundRequireForm [name=refundLogisticNo]').val(pojo.refundInfo.refundLogisticNo)
                            $('#refundRequireForm [name=refundRemark]').val(pojo.refundInfo.refundRemark)
                            $('#goodsStatus').val(pojo.refundInfo.goodsStatus)
                            if (pojo.refundInfo.refundMethod) {
                                $('#refundService').val(pojo.refundInfo.refundMethod)
                                getRefundReason(globalPOrderId, pOrderDetailList, () => {
                                    $('#purchaseOrderrefundReason').val(pojo.refundInfo.aliRefundReasonId)
                                    form.render('select')
                                })
                            }
                            $('#refundRequireForm [name=refundDeclare]').val(pojo.refundInfo.refundDeclare)
                            $('#refundRequireForm [name=refundLogisticFee]').val(pojo.refundInfo.refundLogisticsFee)
                        } else {
                            $('#pullInvalidForm [name=refundReason]').val(pojo.refundInfo.refundReason)
                            // $('#pullInvalidForm [name=requireRefund]').val(pojo.refundInfo.requireRefund)
                            // $('#pullInvalidForm [name=refundAmout]').val(pojo.refundInfo.refundAmout)
                            $('#pullInvalidForm [name=refundLogisticNo]').val(pojo.refundInfo.refundLogisticNo)
                            $('#pullInvalidForm [name=refundRemark]').val(pojo.refundInfo.refundRemark)
                            $('#pullInvalidForm [name=aliReceiveRefund]').val(pojo.aliReceiveRefund)
                            $('#pullInvalidForm [name=pullInvalidType]').val(pojo.refundInfo.pullInvalidType)
                            $('#pullInvalidForm [name=pullInvalidTypeInp]').val(pojo.refundInfo.pullInvalidType)
                            $('#pullInvalidForm [name=pullInvalidRemark]').val(pojo.refundInfo.pullInvalidRemark)
                        }
                    }
                    if (ifRefundPop) {
                        form.render('select', 'refundRequireForm')
                    }
                    if (!changeAble_pullinvalid) {
                        $('#pullInvalidForm [name=pullInvalidTypeInp]').show()
                        $('#pullInvalidForm [name=pullInvalidRemark]').addClass('gredBack')
                        $('#pullInvalidForm [name=pullInvalidRemark]').attr('disabled','disabled')
                    } else {
                        form.render('select', 'pullInvalidForm')
                    }

                } else {
                    layer.msg(res.msg)
                }
            },
            error: function() {
                loading.hide()
                layer.msg('服务器繁忙，请稍后再试')
            }
        })
    }

    // 批量修改
    $('#purchaseOrder_updatePurOrderByListBtn').click(function() {
        var checkStatus = table.checkStatus('purchaseOrder_table'),
            data = checkStatus.data;
        if (!data || data.length == 0) {
            layer.msg('请选择采购订单')
            return
        }
        var idList = []
        for (var i = 0; i < data.length; ++i) {
            idList.push(data[i].id)
        }
       let notAuditPermitInfo = ''
        for (let e of data) {
          switch (e.auditStatus){
            case 0:
            case 1:
                if (+e.stockInStatus === 3){
                  notAuditPermitInfo += '#'+ e.billNumber +'#'
                }
                break
            default:
              notAuditPermitInfo += '#'+ e.billNumber +'#'
              break
          }
        }
        if (notAuditPermitInfo!==''){
          layer.msg("订单状态在“未审核”和“已审核(已审核下面的’未完全入库‘和’完全入库未审核‘)”的时候，可以批量操作,订单号: " + notAuditPermitInfo+'不满足')
          return
        }
        var updateListPopIndex = layer.open({
            type: 1,
            title: "批量修改",
            area: ["80%", "70%"],
            btn: ['提交', '关闭'],
            shadeClose: false,
            content: $("#updateListPop_purchaseOrder").html(),
            success: function(layero, index) {
                form.render('select', 'updateListForm_purOrderMain')
                formSelects.render('note_purchaseOrder_AddForm');
            },
            yes: function() {
                var purOrderMain = {
                    buyerId: $("#updateListForm_purOrderMain [name=buyerId]").val(),
                    buyer: $("#updateListForm_purOrderMain [name=buyerId] option:selected").text(),
                    purOrgId: $("#updateListForm_purOrderMain [name=purOrgId]").val(),
                    payType: $("#updateListForm_purOrderMain [name=payType]").val(),
                    note: $("#updateListForm_purOrderMain [name=note]").val()
                }
                checkNull(purOrderMain)
                if (!purOrderMain.note && !purOrderMain.buyerId && !purOrderMain.buyer && !purOrderMain.purOrgId && !purOrderMain.payType) {
                    layer.msg('未做任何修改')
                    return
                }
                loading.show()
                $.ajax({
                    url: ctx + "/purOrderMain/updateByIdList.html",
                    type: 'POST',
                    dataType: "json",
                    contentType: "application/json;charset=utf-8",
                    data: JSON.stringify({ idList: idList, purOrderMain: purOrderMain }),
                    success: function(res) {
                        if (res.code == '0000') {
                            layer.msg("修改成功")
                            layer.close(updateListPopIndex)
                            active_purchaseOrder.reloadWithoutFresh()
                        } else {
                            layer.msg(res.msg)
                        }
                    },
                    complete: function() {
                        loading.hide()
                    }
                })
            }
        })

    })

    // 审核
    $('#purchaseOrder_auditPurOrderBtn').click(function() {
        var checkStatus = table.checkStatus('purchaseOrder_table'),
            data = checkStatus.data;
        if (!data || data.length == 0) {
            layer.msg('请选择采购订单')
            return
        }
        var idList = []
        var operate
        var curOperate
        for (var i = 0; i < data.length; ++i) {
            idList.push(data[i].id)
            // 判断审核 还是 取消审核
            switch (data[i].auditStatus) {
                case 0 :
                    curOperate = 1;
                    break;
                case 1 :
                    curOperate = 2;
                    break;
                default:
                    layer.msg('已作废订单不可取消审核或者取消审核');
                    return;
            }
            if (!operate) {
                operate = curOperate
            } else if (operate != curOperate) {
                layer.msg('订单审核状态不一致，无法进行该操作')
                return
            }
        }
        if (operate == 1) {
            ajaxAuditPurchaseOrder(idList)
        } else if (operate == 2) {
            // 取消审核
            ajaxCancelAuditPurchaseOrder(idList)
        }
    })
    ajaxAuditPurchaseOrder = function(idList) {
        if (!Array.isArray(idList)) {
            idList = [idList]
        }
        var confirmIndex = layer.confirm('确认采购订单审核通过吗', { btn: ['确认', '取消'] },
            function() {
                loading.show()
                $.ajax({
                    url: ctx + "/purOrderMain/auditPurOrderByIdList.html",
                    type: 'POST',
                    dataType: "json",
                    contentType: "application/json;charset=utf-8",
                    data: JSON.stringify({ idList: idList }),
                    success: function(res) {
                        if (res.code == '0000') {
                            layer.msg("审核成功")
                            active_purchaseOrder.reloadWithoutFresh()
                        } else {
                            layer.alert(res.msg)
                        }
                    },
                    complete: function() {
                        loading.hide()
                        layer.close(confirmIndex)
                    }
                })
            },
            function() {
                layer.close(confirmIndex)
            })
    }

    ajaxCancelAuditPurchaseOrder = function(idList) {
        if (!Array.isArray(idList)) {
            idList = [idList]
        }
        var confirmIndex = layer.confirm('确认取消审核吗', { btn: ['确认', '取消'] },
            function() {
                loading.show()
                $.ajax({
                    url: ctx + "/purOrderMain/cancelAuditPurOrderByIdList.html",
                    type: 'POST',
                    dataType: "json",
                    contentType: "application/json;charset=utf-8",
                    data: JSON.stringify({ idList: idList }),
                    success: function(res) {
                        if (res.code == '0000') {
                            layer.alert("取消审核成功")
                            active_purchaseOrder.reloadWithoutFresh()
                        } else {
                            layer.alert(res.msg)
                        }
                    },
                    complete: function() {
                        loading.hide()
                        layer.close(confirmIndex)
                    }
                })
            },
            function() {
                layer.close(confirmIndex)
            })
    }

    function purchaseOrder_disablePurOrder(idList) {
        let popIndex =  layer.open({
            type: 1,
            title: "作废采购单",
            area: ["500px", "300px"],
            btn: ['确认', '取消'],
            shadeClose: false,
            content: $("#purchaseOrder_disablePurOrderLayer").html(),
            yes: function () {
                let Adata = {
                    idList: idList,
                    memo: $('#purchaseOrder_disablePurOrderForm').find('[name=memo]').val()
                }
                if (!Adata.memo) {
                    layer.msg('请填写备注')
                    return false;
                }
                layer.close(popIndex)
                oneAjax.post({
                    url: ctx + "/purOrderMain/deletePurOrder",
                    data: Adata,
                    success: function(res) {
                        if (res.code === '0000') {
                            layer.msg("作废成功")
                            active_purchaseOrder.reloadWithoutFresh()
                        } else {
                            active_purchaseOrder.reloadWithoutFresh()
                        }
                    },
                    complete: function() {
                        loading.hide()
                    }
                })
            }
        })
    }

    // 批量作废
    $("#purchaseOrder_disablePurOrderBtn").click(function() {
        var checkStatus = table.checkStatus('purchaseOrder_table'),
            data = checkStatus.data;
        if (!data || data.length == 0) {
            layer.msg('请选择采购订单')
            return
        }
        var idList = []
        for (var i = 0; i < data.length; ++i) {
            idList.push(data[i].id)
        }

        purchaseOrder_disablePurOrder(idList)
    })

    $("#purchaseOrder_markPayAble").click(function() {
        setPayAbleList(true)
    })

    $("#purchaseOrder_canclePayAble").click(function() {
        setPayAbleList(false)
    })

    // 标记/取消 可付
    function setPayAbleList(payAble) {
        var checkStatus = table.checkStatus('purchaseOrder_table'),
            data = checkStatus.data;
        if (!data || data.length == 0) {
            layer.msg('请选择采购订单')
            return
        }
        var idList = []
        for (var i = 0; i < data.length; ++i) {
            idList.push(data[i].id)
        }
        var confirmIndex = layer.confirm('确认对这些采购订单' + (payAble ? '标记' : '取消') + '可付吗', { btn: ['确认', '取消'] },
            function() {
                loading.show()
                $.ajax({
                    url: ctx + "/purOrderMain/setPayAble.html",
                    type: 'POST',
                    dataType: "json",
                    contentType: "application/json;charset=utf-8",
                    data: JSON.stringify({ idList: idList, payAble: payAble }),
                    success: function(res) {
                        if (res.code == '0000') {
                            layer.msg("操作成功")
                            active_purchaseOrder.reloadWithoutFresh()
                        } else {
                            layer.msg(res.msg)
                        }
                    },
                    complete: function() {
                        loading.hide()
                    }
                })
            },
            function() {
                layer.close(confirmIndex)
            })
    }

    // 查询订单详情
    function originDataInit_purOrderDetail(id,backTodo) {
        loading.show()
        $.ajax({
            url: ctx + "/purOrderMain/getPurOrderDetailById.html",
            type: 'POST',
            dataType: "json",
            data: { id: id },
            success: function(data) {
                loading.hide()
                if (data.code == '0000') {
                    var orderMainDto = data.data
                    storeDetailId = data.data.storeId || ''
                    // appendSelect($('#purOrderMainInfoForm').find('select[name="followerId"]'), followList, 'value', 'name')
                    for (var key in orderMainDto) {
                        $("#purOrderMainInfoForm [name=" + key + "]").val(orderMainDto[key])
                    }
                    layui.form.render('select', 'purOrderMainInfoForm')
                    // 制单时间、到货日期format
                    $("#purOrderMainInfoForm [name=createTime]").val(format(orderMainDto.createTime, 'yyyy-MM-dd hh:mm:ss'))
                    $("#purOrderMainInfoForm [name=delivDay]").val(format(orderMainDto.delivDay, 'yyyy-MM-dd'))

                    // 如果已经创建1688订单，不可编辑买家留言
                    if (orderMainDto.ali1688OrderNo) {
                        $("#purOrderMainInfoForm [name=purNote]").attr('readonly', 'readonly')
                        $("#purOrderMainInfoForm [name=purNote]").addClass('gredBack')
                    }

                    // 赋值内部标签
                    var noteList = orderMainDto.note ? orderMainDto.note.split(',') : []
                    if (noteList.length > 0) {
                        formSelects.value('note_purchaseOrder_AddForm', noteList)
                    }

                    // $('#purOrderMainInfoForm [name=orderType]').prop('checked',orderMainDto.orderType == 2)

                    // 获取对应供应商的下单备注
                    var i,j,detailOne;
                    loop1: for (i = 0; i < orderMainDto.detailList.length; ++i){
                        detailOne = orderMainDto.detailList[i]
                        for (j = 0; j < detailOne.supplierRefDtoList.length; ++j) {
                            if (detailOne.supplierRefDtoList[j].supplierId == orderMainDto.supplierId) {
                                orderMainDto.detailList[i].sendAddress = detailOne.supplierRefDtoList[j].sendAddress
                                orderMainDto.detailList[i].supplierNote = detailOne.supplierRefDtoList[j].note
                                orderMainDto.detailList[i].articleNo = detailOne.supplierRefDtoList[j].articleNo
                                orderMainDto.detailList[i].ifDivision = detailOne.supplierRefDtoList[j].ifDivision
                                orderMainDto.detailList[i].provideIdentification = detailOne.supplierRefDtoList[j].provideIdentification
                                continue loop1
                            }
                        }
                    }
                    purOrderDetailList_purchaseOrder = orderMainDto.detailList.map(item => ({ ...item, supplierId: orderMainDto.supplierId }))
                    $("#searchSupplier_purchaseOrderDetailForm").val(orderMainDto.supplierName)
                    if (orderMainDto.auditStatus == 1) {
                        showSubTable(purOrderDetailList_purchaseOrder, true,true)
                        for (var key in orderMainDto) {
                            $("#purOrderMainInfoForm [data-name=" + key + "]").val(orderMainDto[key])
                        }
                        $("#purOrderMainInfoForm [data-name=delivDay]").val(format(orderMainDto['delivDay'],'yyyy-MM-dd'))
                        $("#purOrderMainInfoForm [name]:not(span)").hide()
                        $("#purOrderMainInfoForm [data-name]").show()
                        $('#searchSupplier_purchaseOrderDetailForm').hide()
                        $("#purOrderMainInfoForm [name=memo]").show()

                        setValueFoeSelectInp_purchaseOrder('#purOrderMainInfoForm', 'storeId', orderMainDto.storeId)
                        setValueFoeSelectInp_purchaseOrder('#purOrderMainInfoForm', 'purOrgId', orderMainDto.purOrgId)
                        setValueFoeSelectInp_purchaseOrder('#purOrderMainInfoForm', 'buyerId', orderMainDto.buyerId)
                        setValueFoeSelectInp_purchaseOrder('#purOrderMainInfoForm', 'avgType', orderMainDto.avgType)
                        setValueFoeSelectInp_purchaseOrder('#purOrderMainInfoForm', 'payType', orderMainDto.payType)
                        setValueFoeSelectInp_purchaseOrder('#purOrderMainInfoForm', 'purAcctId', orderMainDto.purAcctId)
                        setValueFoeSelectInp_purchaseOrder('#purOrderMainInfoForm', 'receiverId', orderMainDto.receiverId)
                        setValueFoeSelectInp_purchaseOrder('#purOrderMainInfoForm', 'purReceiveAddressId', orderMainDto.purReceiveAddressId)

                        // 设置 淘宝订单  checkbox disabled
                        // $('#purOrderMainInfoForm [name=orderType]').attr('disabled','disabled')

                    } else {
                        showSubTable(purOrderDetailList_purchaseOrder,false,true)
                        // 初始化可选收件人
                        initReceiverOption_purchaseOrder(orderMainDto.buyerId)
                        $('#purOrderMainInfoForm [name=receiverId]').val(orderMainDto.receiverId)
                        $('#purOrderMainInfoForm [name=purReceiveAddressId]').val(orderMainDto.purReceiveAddressId)
                        form.render("select", "purOrderMainInfoForm")
                    }
                    form.render('checkbox', 'purOrderMainInfoForm')

                    $("#purOrderMainInfoForm [name]:not(span)")?.each((index, item) => {
                        let name = $(item).attr('name')
                        if (name !== 'followerId') {
                            $(item).next('.layui-form-select').hide()
                        }
                    })

                    if (backTodo && typeof backTodo === 'function') {
                        backTodo()
                    }
                } else {
                    layer.msg(data.msg)
                }
            },
            complete: function() {
                loading.hide()
            }
        })
    }

    setValueFoeSelectInp_purchaseOrder = function(formSelect, name, value) {
        var form = $(formSelect)
        var val = form.find('[name=' + name + '] option[value=' + value + ']').text()
        form.find('[data-name=' + name + ']').val(val)
    }

    // 创建1688订单
    $('#purchaseOrder_createAli1688OrderBtn').click(function() {
        var checkStatus = table.checkStatus('purchaseOrder_table'),
            data = checkStatus.data;
        if (!data || data.length == 0) {
            layer.msg('请选择采购订单')
            return
        }
        var idList = []
        for (var i = 0; i < data.length; ++i) {
            idList.push(data[i].id)
        }
        var confirmIndex = layer.confirm('确认以这些采购订单生成1688订单吗？', function() {
                loading.show()
                $.ajax({
                    url: ctx + "/purOrderMain/toCreate1688Order.html",
                    type: 'POST',
                    dataType: "json",
                    contentType: "application/json;charset=utf-8",
                    data: JSON.stringify(idList),
                    success: function(res) {
                        loading.hide()
                        layer.close(confirmIndex)
                        if (res.code == '0000') {
                            layer.msg("已经加入生成1688订单列表。订单正在生成中， 请稍后刷新查看")
                            active_purchaseOrder.reloadWithoutFresh()
                        } else {
                            layer.msg(res.msg)
                        }
                    },
                    complete: function() {
                        loading.hide()
                    }
                })
            },
            function() {
                layer.close(confirmIndex)
            }
        )
    })

    // 获取批量支付链接
    $('#purchaseOrder_getMultiPayUrlBtn').click(function() {
        var checkStatus = table.checkStatus('purchaseOrder_table'),
            data = checkStatus.data;
        if (!data || data.length == 0) {
            layer.msg('请选择采购订单')
            return
        }
        var idList = []
        for (var i = 0; i < data.length; ++i) {
            idList.push(data[i].id)
        }
        var confirmIndex = layer.confirm('确认获取这些采购订单的批量支付吗？', function() {
                loading.show()
                $.ajax({
                    url: ctx + "/purOrderMain/getMultiPayUrl.html",
                    type: 'POST',
                    dataType: "json",
                    contentType: "application/json;charset=utf-8",
                    data: JSON.stringify({ idList: idList }),
                    success: function(res) {
                        loading.hide()
                        layer.close(confirmIndex)
                        if (res.code == '0000') {
                            // 展示批量支付的链接 详情列表
                            showMultiPayUrlTable(res.data)
                        } else {
                            // layer.alert(res.msg)
                            layer.open({
                              type: 1,
                              title: '信息',
                              content: `<div style="padding:20px">${res.msg || ''}</div>`,
                              id: Date.now(),
                              area: ['40%', '60%'],
                              btn: ['确定']
                            });
                        }
                    },
                    complete: function() {
                        loading.hide()
                    }
                })
            },
            function() {
                layer.close(confirmIndex)
            }
        )
    })

    // 展示批量支付链接列表
    function showMultiPayUrlTable(data) {
        layer.open({
            type: 1,
            title: "支付链接",
            area: ["1300px", "80%"],
            btn: ['关闭'],
            shadeClose: false,
            content: $("#multiPayUrl_purchaseOrder").html(),
            success: function(layero, index) {
                table.render({
                    elem: "#multiPayUrlTable_purchaseOrder",
                    cols: [
                        [
                            { field: "acct", title: "账号", width: 100 },
                            { field: "orderType", title: "订单类型", width: 120 },
                            { field: "payType", title: "支付方式", width: 120 },
                            { field: "subListTotalActPayMoney", title: "总金额", width: 100 },
                            { title: "路径", templet: '<div><a onclick="this.style.color=`blue`" href="{{d.payUrl}}" target="_blank">{{d.payUrl}}</a></div>' },
                            { title: "支付订单", templet: '<div>{{d.subBillNumberList.join(",")}}</div>' },
                            { title: '操作', align: 'center', toolbar: '#multiPayUrlTable_purchaseOrder_bar', width: 60 }
                        ]
                    ],
                    data: data,
                    id: "multiPayUrlTable_purchaseOrder",
                    page: false,
                    done: function() {

                    },
                    limit: data.length
                })
            }
        })
    }

    table.on('tool(multiPayUrlTable_purchaseOrder)', function(obj) {
        var layEvent = obj.event; //获得 lay-event 对应的值
        var data = obj.data; //获得当前行数据
        if (layEvent == 'confirmPay') {
            let Adata = data.subBillNumberList
            oneAjax.post({
                url: '/purOrderMain/payTaobaoOrder',
                data: Adata,
                success:function (res) {
                    if (res.code === '0000') {
                        // 将当前行设为绿色背景
                    }
                }
            })
        }
    })

    // 同步1688信息
    $('#purchaseOrder_syncInfoFromAli1688Btn').click(function() {
        var checkStatus = table.checkStatus('purchaseOrder_table'),
            data = checkStatus.data;
        if (!data || data.length == 0) {
            layer.msg('请选择采购订单')
            return
        }
        var idList = []
        var noOrderNoList = []
        for (var i = 0; i < data.length; ++i) {
            idList.push(data[i].id)
            if (!data[i].ali1688OrderNo) {
                noOrderNoList.push(data[i].billNumber)
            }
        }
        if (noOrderNoList.length > 0) {
            layer.alert('以下订单无1688单号:' + noOrderNoList.join(','))
            return
        }
        var confirmIndex = layer.confirm('确认同步这些采购订单的1688信息吗？', function() {
                loading.show()
                $.ajax({
                    url: ctx + "/purOrderMain/toSyncInfoFromAli1688.html",
                    type: 'POST',
                    dataType: "json",
                    contentType: "application/json;charset=utf-8",
                    data: JSON.stringify({ idList: idList }),
                    success: function(res) {
                        loading.hide()
                        layer.close(confirmIndex)
                        if (res.code == '0000') {
                            layer.msg('同步成功')
                            active_purchaseOrder.reloadWithoutFresh()
                        } else {
                            layer.msg(res.msg)
                        }
                    },
                    complete: function() {
                        loading.hide()
                    }
                })
            },
            function() {
                layer.close(confirmIndex)
            }
        )
    })

    // 标记加急
    $('#purchaseOrder_speedOrderBtn').click(function() {
        var checkStatus = table.checkStatus('purchaseOrder_table'),
            data = checkStatus.data;
        if (!data || data.length == 0) {
            layer.msg('请选择采购订单')
            return
        }
        var idList = []
        for (var i = 0; i < data.length; ++i) {
            idList.push(data[i].id)
        }
        var confirmIndex = layer.confirm('确认加急/取消加急这些采购订单吗？', function() {
                loading.show()
                $.ajax({
                    url: ctx + "/purOrderMain/speedOrderByList.html",
                    type: 'POST',
                    dataType: "json",
                    contentType: "application/json;charset=utf-8",
                    data: JSON.stringify({ idList: idList }),
                    success: function(res) {
                        loading.hide()
                        layer.close(confirmIndex)
                        if (res.code == '0000') {
                            layer.msg('加急成功')
                            active_purchaseOrder.reloadWithoutFresh()
                        } else {
                            layer.msg(res.msg)
                        }
                    },
                    complete: function() {
                        loading.hide()
                    }
                })
            },
            function() {
                layer.close(confirmIndex)
            }
        )
    })

    // 导出采购订单
    $("#purchaseOrder_exportPurOrderBtn").click(function() {
        var checkStatus = table.checkStatus('purchaseOrder_table'),
            selecteddata = checkStatus.data;
        var idList = []
        for (var i = 0; i < selecteddata.length; ++i) {
            idList.push(selecteddata[i].id)
        }

        var outerIndex = layer.open({
            title: '导出采购订单',
            type: 1, //不加该属性,就会出现[object Object]
            area: ['1000px', '600px'],
            id: 'exportPurMainInfoPop',
            btn: ['确定', '关闭'],
            content: $('#purchaseOrder_exportPurMainInfoPop').html(),
            success: function() {
                form.on('checkbox(selectAll_exportPurMainInfo_purchaseOrder)', function(data) {
                    var checked = data.elem.checked
                    $('#exportPurMainInfoForm_purchaseOrder input[type=checkbox]:enabled').prop('checked', checked)
                    form.render('checkbox','exportPurMainInfoForm_purchaseOrder')
                })
                form.render('checkbox','exportPurMainInfoForm_purchaseOrder')
            },
            yes: function() {
                var data = serializeObject($('#exportPurMainInfoForm_purchaseOrder'))
                var searchParam = getSerachData_purchaseOrder()
                searchParam.ifOffLine = false
                searchParam.ifPullInvalid = searchParam.ifPullInvalid == '1'
                var stockInStatusList = []
                var checkedStockInStatus = $('#stockInStatusForm_purchaseOrder [name=stockInStatus]:checked')
                for (var i = 0; i < checkedStockInStatus.length; ++i) {
                    stockInStatusList.push(parseInt(checkedStockInStatus[i].value))
                }
                searchParam.stockInStatusListStr = stockInStatusList.join(',')
                checkNull(searchParam)
                data.searchParam = JSON.stringify(searchParam)
                data.idList = idList.join(',')
                var Confirmindex = layer.confirm('确认导出当前搜索条件下的采购订单？', { btn: ['确认', '取消'] }, function() {
                    layer.alert('如果导出数据量大，需要几分钟处理数据，请不要关闭和操作网页，后台正在进行导出文件')
                    submitForm(data, ctx + '/purOrderMain/exportMainInfo.html')
                    layer.close(outerIndex);
                }, function() {
                    layer.close(Confirmindex);
                })
            }
        })
    })

    // 导出采购订单详情
    $("#purchaseOrder_exportPurOrderDetailBtn").click(function() {
        var checkStatus = table.checkStatus('purchaseOrder_table'),
            selecteddata = checkStatus.data;
        var idList = []
        for (var i = 0; i < selecteddata.length; ++i) {
            idList.push(selecteddata[i].id)
        }

        var outerIndex = layer.open({
            title: '导出订单详情',
            type: 1, //不加该属性,就会出现[object Object]
            area: ['1000px', '600px'],
            id: 'exportPurMainInfoPop',
            btn: ['确定', '关闭'],
            content: $('#purchaseOrder_exportPurDetailInfoPop').html(),
            success: function() {
                form.on('checkbox(selectAll_exportPurDetailInfo_purchaseOrder)', function(data) {
                    var checked = data.elem.checked
                    $('#exportPurDetailInfoForm_purchaseOrder input[type=checkbox]:enabled').prop('checked', checked)
                    form.render('checkbox','exportPurDetailInfoForm_purchaseOrder')
                })
                form.render('checkbox','exportPurDetailInfoForm_purchaseOrder')
            },
            yes: function() {
                var data = serializeObject($('#exportPurDetailInfoForm_purchaseOrder'))
                var searchParam = getSerachData_purchaseOrder()
                searchParam.ifOffLine = false
                searchParam.ifPullInvalid = searchParam.ifPullInvalid == '1'
                var stockInStatusList = []
                var checkedStockInStatus = $('#stockInStatusForm_purchaseOrder [name=stockInStatus]:checked')
                for (var i = 0; i < checkedStockInStatus.length; ++i) {
                    stockInStatusList.push(parseInt(checkedStockInStatus[i].value))
                }
                searchParam.stockInStatusListStr = stockInStatusList.join(',')
                checkNull(searchParam)
                data.searchParam = JSON.stringify(searchParam)
                data.idList = idList.join(',')

                var Confirmindex = layer.confirm('确认导出当前搜索条件下的采购订单？', { btn: ['确认', '取消'] }, function() {
                    layer.alert('如果导出数据量大，需要几分钟处理数据，请不要关闭和操作网页，后台正在进行导出文件')
                    submitForm(data, ctx + '/purOrderMain/exportDetailInfo.html')
                    layer.close(outerIndex);
                }, function() {
                    layer.close(Confirmindex);
                })
            }
        })
    })

    $('#purchaseOrder_addPurOrderByExcelBtn').click(function() {
        $('#fileForAddByExcel_purchaseOrder').click()
    })

    $('#fileForAddByExcel_purchaseOrder').on('change', function() {
        var files = $('#fileForAddByExcel_purchaseOrder')[0].files
            // 如果没有文件则终止
        if (files.length == 0) {
            return
        }
        // 校验文件类型
        var fileName = files[0].name
        var seat = fileName.lastIndexOf(".");
        var extension = fileName.substring(seat).toLowerCase();
        if (extension != '.xlsx' && extension != '.xls') {
            $('#fileForAddByExcel_purchaseOrder').val('')
            layer.msg('请传入后缀为.xlsx或者.xls 的Excel文件')
            return
        }
        var formData = new FormData();
        formData.append("file", files[0]);
        var confirmIndex = layer.confirm('确认导入这个文件进行批量新增采购订单吗', { btn: ['确认', '取消'] },
            function() {
                loading.show()
                $.ajax({
                    url: ctx + '/purOrderMain/addByExcel.html',
                    type: 'POST',
                    data: formData,
                    // 告诉jQuery不要去处理发送的数据
                    processData: false,
                    // 告诉jQuery不要去设置Content-Type请求头
                    contentType: false,
                    success: function(data) {
                        layer.close(confirmIndex)
                        loading.hide()
                        // 清空 excel
                        $('#fileForAddByExcel_purchaseOrder').val('')
                        if (data.code === '0000') {
                            var processData = data.data
                            if (processData.id) {
                                // 开启进程跟踪
                                simpleProcessBegin(processData);
                            }
                            layer.msg("上传成功");
                        } else {
                            layer.msg(data.msg)
                        }
                    },
                    error: function() {
                        loading.hide()
                        $('#fileForAddByExcel_purchaseOrder').val('')
                    }
                });
            },
            function() {
                layer.closeAll()
            }
        )
    })

    $("#downTemplate_addByExcel_purchaseOrder").click(function() {
        window.location.href = ctx + '/static/templet/addPurchaseOrderTemplate.xls'
    })

    // 预估物流费
    function purchaseorder_predictLogisticsFee() {
        // 避免连续请求
        if (preCalIng) {
            return
        }
        // 正在请求中
        preCalIng = true
        window.setTimeout(function (){
            try {
                if (!purOrderDetailList_purchaseOrder || !purOrderDetailList_purchaseOrder.length) {
                    return 0
                }
                // 获取总重量
                let totalWeight = parseFloat($('.totalSuttleWeight_subdetailList')[0].innerText)
                if (!totalWeight) {
                    return 0
                }
                // 获取发货地址
                console.log(111)
                let sendAddress = purOrderDetailList_purchaseOrder[0].sendAddress
                let storeId = $('#purOrderMainInfoForm').find('[name=storeId]').val()
                if (!storeId) {
                    return 0
                }

                let Adata = {
                    storeId: storeId,
                    sendAddress: sendAddress,
                    totalWeight: totalWeight
                }
                // 如果参数未变更，则不请求接口
                if (JSON.stringify(precalLogisticsParam) === JSON.stringify(Adata)) {
                    return 0
                }
                precalLogisticsParam = Adata
                oneAjax.post({
                    url: ctx + '/purOrderMain/calculateLogisticsFee',
                    data: Adata,
                    success: function (res) {
                        if (res.code === '0000') {
                            $('#purOrderMainInfoForm').find('[name=predictLogisticFee]').val(res.data)
                        }}
                })
            } catch (e){
                console.log('预估运费出错e=')
                console.log(e)
            } finally {
                // 请求结束，标记未在请求中
                preCalIng = false;
            }
        },300)

    }

    // 初始化预估物流费参数
    function purchaseorder_initLogisticsFeeConfigList() {
        oneAjax.post({
            url: ctx + '/purLogisticsFeeConfig/list',
            success: function (res) {
                if (res.code === '0000') {
                    if (!res.data || res.data.length === 0) {
                        layer.msg('未初始化运费预估参数，请先初始化运费预估参数。')
                        return
                    }
                    purchaseorder_logisticsFeeConfigList = res.data
                    for (let i = 0; i < purchaseorder_logisticsFeeConfigList.length; ++i) {
                        if (purchaseorder_logisticsFeeConfigList[i].ifDefault) {
                            purchaseorder_defaultLogisticsFeeConfig = purchaseorder_logisticsFeeConfigList[i]
                        }
                    }
                    // 计算
                    let predictLogitscFee = purchaseorder_calculateLogisticsFee()
                    $('#purOrderMainInfoForm').find('[name=predictLogisticFee]').val(predictLogitscFee)
                }
            }
        })
    }
    
    $("#purchaseOrder_changeStore").click(function () {
        layer.open({
            title: '转仓',
            type: 1,
            area: ['1000px', '600px'],
            id: 'exportPurMainInfoPop',
            btn: ['确定', '关闭'],
            content: $('#purchaseOrder_changeStorePop').html(),
            success: function() {
                form.render('select','purchaseOrder_changeStoreForm')
            },
            yes: function() {
                let Adata = serializeObject($('#purchaseOrder_changeStoreForm'))
                if (!Adata.billNumberList) {
                    layer.msg('请填写需要转仓的采购订单')
                    return
                }
                if (!Adata.toStoreId) {
                    layer.msg('请选择转入仓库')
                    return
                }
                Adata.billNumberList = Adata.billNumberList.replace(/，/g,',').split(',')
                Adata.toStoreId = parseInt(Adata.toStoreId)
                oneAjax.post({
                    url: ctx + '/purOrderMain/changeStoreIdForOrder',
                    data: Adata,
                    success: function (res) {
                        if (res.code === '0000') {
                            layer.msg('转仓成功')
                        } else {
                            layer.msg(res.msg)
                        }
                    }
                })
            }
        })
    })
});

// 展示销售订单信息
function showSaleOrderInfo(self) {
    saleDetailSku = $(self).text()
    saleDetailId = $(self).data('id')
    if (!saleDetailSku) return
    layui.layer.open({
        title: `${saleDetailSku}-订单历史记录-仅统计单品订单并排除黑名单订单、已取消订单和未付款订单和其他异常订单`,
        type: 1,
        area: ['90%', '40%'],
        id: 'purchaseOrder_saleOrderLayer',
        btn: ['关闭'],
        content: $('#purchaseOrder_saleOrderPop').html(),
        success: function() {
            getSSkuPurOrderDetail()
        }
    })
}

function getSSkuPurOrderDetail(index = 0) {
    saleDetailStartIndex = index
    let param = {
        prodSSku: saleDetailSku,
        warehouseId: storeDetailId,
        id: saleDetailId,
        index
    }
    // 不是义乌仓和南宁仓
    if (storeDetailId != 65 &&  storeDetailId != 78) {
        delete param.id
    }
    oneAjax.post({
        url: '/purOrderMain/getSSkuPurOrderDetailByWarehouseId',
        data: param,
        success:function (res) {
            if (res.code === '0000') {
                let count = res.count
                let list = res.data || []

                if (list.length > 0) {
                    layui.laytpl($('#saleOrder_subTableLayer').html()).render(list, function(html) {
                        $('#saleOrderTbale_subTbody').append(html)
                        let divElement = $('#purchaseOrder_saleOrderLayer')
                        // 判断是否已展示完全部数据
                        if (list.length < 5) {
                            // 数据已全部展示完毕，移除滚动事件监听器
                            console.log('展示完毕')
                            divElement[0].removeEventListener('scroll', handleLoad);
                        } else {
                            divElement[0].addEventListener('scroll', handleLoad)
                        }
                    })
                } else {
                    layui.laytpl($('#saleOrder_subTableLayer').html()).render([], function(html) {
                        $('#purchaseOrder_saleOrderLayer').append('<div style="width:100%;text-align:center">暂无数据</div>')
                    })
                }
            }
        }
    })
}

var handleLoad = function() {
    let divElement = $('#purchaseOrder_saleOrderLayer')
    if (divElement[0].scrollTop + divElement[0].clientHeight >= divElement[0].scrollHeight) {
        saleDetailStartIndex = saleDetailStartIndex + 5
        getSSkuPurOrderDetail(saleDetailStartIndex)
    }
}


// tip展现生成1688订单失败原因
function showCreate1688FailReason(tip, self) {
    var layer = layui.layer
    var index = layer.tips(tip, self, { tips: [1, 'orange'] })
    $(self).attr('data-tipId', index)
}
// 去掉tip
function removeFailReasonTip(self) {
    var index = $(self).attr('data-tipId')
    if (index) {
        layui.layer.close(index)
    }
}

function purchaseOrder_queryLogistic(selector, list) {
    list = JSON.parse(list) || []
    const tipsIndex = layer.open({
        type: 4,
        shade: 0,
        area: ['600px', '200px'],
        tips: [1, 'rgba(5,5,5,0.4)'],
        isOutAnim: false,
        content: [$('#purchaseOrder_hover_logistic').html(), selector], //数组第二项即吸附元素选择器或者DOM
        success: function() {
            layui.table.render({
                elem: '#purchaseOrder_hover_logistic_table',
                id: 'purchaseOrder_hover_logistic_table',
                data: list,
                height: 150,
                limit: Number.MAX_SAFE_INTEGER,
                cols: [
                    [
                        { title: '快递单号', width: 200, field: 'courierNumber', align: 'center' },
                        { title: '收货', align: 'center', templet: '#purchaseOrder_recieveItem' }
                    ],
                ],
                page: false,
            })
        }
    })
    $(selector).attr('data-tipId', tipsIndex)
}