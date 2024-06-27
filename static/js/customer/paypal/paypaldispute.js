/**
 * time: 2018/01/02
 */
var queryPage_paypalDispute,queryPage2_paypalDispute,active_paypalDispute,orgs_hp_changeFun_dispute

layui.use(["admin", "form", "table", "layer", "laytpl", "laydate","element"], function () {
    var admin = layui.admin,
        form = layui.form,
        table = layui.table,
        layer = layui.layer,
        laytpl = layui.laytpl,
        laydate = layui.laydate,
        element = layui.element,
        $ = layui.$;
    form.render('select');
    form.render('radio');
    form.render('checkbox');


    // 重置按钮
    $("#resetBtn_paypalDispute").click(function () {
        $("#searchForm_paypalDispute [name]:not(.hiddenContent)").val('')
        form.render('select')
    })
    // 变更部门，联动变更ebay店铺列表
    orgs_hp_changeFun_dispute = function () {
        var userList = $('#searchForm_paypalDispute [name=customerServiceUserId] option')
        var customerServiceUserIdList =[]
        var orgId = $('#searchForm_paypalDispute [name=customerOrgId] option:selected').val()
        if (userList != null && orgId) {
            for (var i = 0; i < userList.length; ++i) {
                if (userList[i].value) {
                    customerServiceUserIdList.push(userList[i].value)
                }
            }
        }
        var Adata = {
            customerServiceUserIdList : customerServiceUserIdList,
            platCode: 'ebay'
        }
        getStoreList(Adata,'#searchForm_paypalDispute [name=tradeStoreId]')
    }
    // 初始化店铺
    orgs_hp_changeFun_dispute()
    // 初始化自定义，客服-组织
    render_hp_orgs_users('#searchForm_paypalDispute')
    // 客服选择联动事件
    form.on('select(users_hp_devPerson_dispute)',function (data) {
        var Adata = {
            customerServiceUserIdList : data.value ? [data.value] : [],
            platCode: 'ebay'
        }
        getStoreList(Adata,'#searchForm_paypalDispute [name=tradeStoreId]')
    })
    // 初始化PayPal账号列表
    function initPaypalList() {
        $.ajax({
            type: 'POST',
            url: ctx + '/sysPaypalEmail/getAllAvailablePaypal.html',
            data: {status: true},
            dataType: 'json',
            success: function (res) {
                if (res.code == '0000') {
                    var select = $('#searchForm_paypalDispute [name=paypalAcctId]')
                    var paypalList = res.data
                    var paypal
                    for (var i = 0; i < paypalList.length; ++i) {
                        paypal = paypalList[i]
                        select.append('<option value="'+ paypal.id +'">' + paypal.paypalEmail + '</option>')
                    }
                    form.render('select')
                } else {
                    layer.msg(res.msg)
                }
            }
        })
    }
    initPaypalList()
    // 发起ajax获取对应人员-操作者 可操作店铺交集
    function getStoreList(data,storeSelector) {
        $.ajax({
            type: 'POST',
            url: ctx + '/sysPaypalDispute/getEbayStoreListOfCustomAndOperator.html',
            contentType: 'application/json',
            data: JSON.stringify(data),
            dataType: 'json',
            success: function (res) {
                if (res.code == '0000') {
                    var storeList = res.data
                    if (storeList != null) {
                        var store
                        $(storeSelector).html('<option></option>')
                        for (var i = 0; i < storeList.length; ++i) {
                            store = storeList[i]
                            $(storeSelector).append('<option value="'+ store.id +'">' + store.storeAcct + '</option>')
                        }
                        form.render('select')
                    }
                } else {
                    layer.msg(res.msg)
                }
            }
        })
    }

    queryPage_paypalDispute = function (data) {
        table.render({
            elem: "#paypalDisputeTab",
            method: "post",
            url: ctx + "/sysPaypalDispute/getSysPaypalDisputeList.html",
            where: data,
            cols: [
                [
                    //标题栏
                    { type: "checkbox", width: 30 },
                    {field: 'tradeStore', title:'店铺',},
                    {field: "disputeId", title: "事件号",width: 140},
                    {field: "reason", title: "原因",templet: '#reasonBox_paypalDispute',width: 120},
                    {field: "paypalAcct", title: "paypal"},
                    {field: "paypalTransactionId", title: "交易号",width: 140},
                    {title: "金额",templet: '<div>{{d.transactionCurrency}}:{{d.transactionGrossAmount}}</div>',width: 120},
                    {field: "buyerId", title: "买家ID"},
                    {field: "buyerEmail", title: "买家邮箱"},
                    {field: "receiveName", title: "收件人",width:100},
                    {title: "时间",width:120,templet:'#timeBox_paypalDispute',width: 150},
                    //绑定工具条
                    {title: '操作', align: 'center', toolbar: '#paypalDispute_bar'}
                ],
            ],
            id: 'paypalDisputeTab',
            page: true,
            limits: [100, 500, 1000],
            limit: 100,
            done: function () {
                //表头固定处理
                theadHandle().fixTh({ id:'#paypalDisputeCard',h:200 })
                // 标记未读争议为黄色背景
                setRowBackColor('.messageNotRead_paypalDispute',{'background-color': 'rgb(253, 253, 144)'})
            }
        });
    }

    // 表格数据重载
    active_paypalDispute = {
        reload: function(data){
            //执行重载
            table.reload('paypalDisputeTab', {
                page: {
                    curr: 1 //重新从第 1 页开始
                },
                where: data
            });
        }
    }

    // 标签搜索
    queryPage2_paypalDispute = function (statusCode) {
        // 设置 checkStatus  和 payStatus 的值
        $('#searchForm_paypalDispute [name=statusCode]').val(statusCode)
        searchForpaypalDispute(true)
    }

    //展示已知数据
    searchForpaypalDispute()

    // 统计待审核数量
    function countpaypalDispute (data) {
        var ajax = new Ajax()
        ajax.post({
            url: ctx + "/sysPaypalDispute/countAllStatus.html",
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function (res) {
                console.log(JSON.stringify(res))
                if (res.code == '0000') {
                    var map = res.data
                    $('#NeedReplyNum_paypalDispute').text(map.NeedReplyNum_paypalDispute)
                    $('#underReviewNum_paypalDispute').text(map.underReviewNum_paypalDispute)
                    $('#WaitBuyerReplyNum_paypalDispute').text(map.WaitBuyerReplyNum_paypalDispute)
                    $('#HasBuyerMessageNum_paypalDispute').text(map.HasBuyerMessageNum_paypalDispute)

                }
            }
        })
    }

    //初始化2个日期框
    laydate.render({
        elem: '#searchDate_paypalDispute',
        range: true
    });

    // 搜索按钮
    $('#searchPaypalBtn_paypalDispute').click(function () {
        searchForpaypalDispute(true)
    })

    function searchForpaypalDispute(ifReload) {
        var data = serializeObject($("#searchForm_paypalDispute"))
        var searchType = $('#searchForm_paypalDispute [name=searchType]').val()
        data['buyerId'] = ''
        data['paypalTransactionId'] = ''
        data['buyerEmail'] = ''
        data['receiveName'] = ''
        data['disputeId'] = ''
        data['beginDate'] = ''
        data['endDate'] = ''
        switch (searchType) {
            case '1' : data['buyerId'] = $('#searchForm_paypalDispute [name=searchValue]').val().trim()
                break
            case '2' : data['paypalTransactionId'] = $('#searchForm_paypalDispute [name=searchValue]').val().trim()
                break
            case '3' : data['buyerEmail'] = $('#searchForm_paypalDispute [name=searchValue]').val().trim()
                break
            case '4' : data['receiveName'] = $('#searchForm_paypalDispute [name=searchValue]').val().trim()
                break
            case '5' : data['disputeId'] = $('#searchForm_paypalDispute [name=searchValue]').val().trim()
                break
        }
        // $('#searchForm_paypalDispute [name=tradeStoreId]').val()
        var tradeStoreIdList = []
        if (data.tradeStoreId) {
            tradeStoreIdList.push(data.tradeStoreId)
        } else {
            if (data.customerOrgId || data.customerServiceUserId) {
                var storeOption = $('#searchForm_paypalDispute [name=tradeStoreId] option')
                for (var i = 0; i < storeOption.length; ++i) {
                    if (storeOption[i].value) {
                        tradeStoreIdList.push(storeOption[i].value)
                    }
                }
            }
        }
        data.tradeStoreIdList = tradeStoreIdList.join(',')

        if ($('#searchForm_paypalDispute [name=searchDate]').val()) {
            var dateArr = $('#searchForm_paypalDispute [name=searchDate]').val().split(' - ')
            data['beginDate'] = dateArr[0]
            data['endDate'] = dateArr[1]
        }
        if (ifReload) {
            active_paypalDispute.reload(data)
        } else {
            queryPage_paypalDispute(data)
        }
        checkNull(data)
        countpaypalDispute(data)
    }

    $('#markReadByIdList_paypalDispute').click(function () {
        var checkStatus = table.checkStatus('paypalDisputeTab'),
            data = checkStatus.data;
        if (data.length == 0) {
            layer.msg('请至少选择1个纠纷')
            return
        }

        layer.confirm('确认标记这些纠纷为已读吗?',['确认','取消'],
            function () {
                var idList = []
                for (var i = 0; i < data.length; ++i) {
                    idList.push(data[i].id)
                }
                var Adata = {
                    idList: idList
                }
                loading.show()
                $.ajax({
                    type: 'POST',
                    url: ctx + "/sysPaypalDispute/markMessageHasRead.html",
                    data: JSON.stringify(Adata),
                    contentType: 'application/json',
                    dataType: 'json',
                    success: function (res) {
                        if (res.code == '0000') {
                            searchForpaypalDispute(true)
                            layer.msg('标记成功')
                        } else {
                            layer.msg(res.msg)
                        }
                    },
                    complete: function (XMLHttpRequest, status)
                    {
                        loading.hide()
                        if (status == 'timeout') {//超时,status还有success,error等值的情况
                            layer.msg('正在向paypal请求中，请稍后刷新查看')
                        }
                    }
                })
            })
    })

    $('#updateByIdList_paypalDispute').click(function () {
        var checkStatus = table.checkStatus('paypalDisputeTab'),
            data = checkStatus.data;
        if (data.length == 0) {
            layer.msg('请至少选择1个纠纷')
            return
        }
        layer.confirm('确认更新这些纠纷吗?',['确认','取消'],
            function () {
                var disputeIdList = []
                for (var i = 0; i < data.length; ++i) {
                    disputeIdList.push(data[i].disputeId)
                }
                var Adata = {
                    disputeIdList: disputeIdList
                }
                loading.show()
                $.ajax({
                    type: 'POST',
                    url: ctx + "/sysPaypalDispute/syncDisputeDetail.html",
                    data: JSON.stringify(Adata),
                    contentType: 'application/json',
                    dataType: 'json',
                    success: function (res) {
                        if (res.code == '0000') {
                            searchForpaypalDispute(true)
                            layer.msg('更新成功')
                        } else {
                            layer.msg(res.msg)
                        }
                    },
                    complete: function (XMLHttpRequest, status)
                    {
                        loading.hide()
                        if (status == 'timeout') {//超时,status还有success,error等值的情况
                            layer.msg('正在向paypal请求中，请稍后刷新查看')
                        }
                    }
                })
            })
    })

    $('#dealByList_paypalDispute').click(function () {
        var checkStatus = table.checkStatus('paypalDisputeTab'),
            data = checkStatus.data;
        if (data.length == 0) {
            layer.msg('请至少选择1个纠纷')
            return
        }
        if (data.length > 15) {
            layer.msg('为了防止卡顿，请不要一次性打开超过15个以上')
            return
        }
        var index = layer.confirm('确认打开这些纠纷详情吗?',['确认','取消'],function () {
            var newWindowList = []
            var screenHeight = window.screen.height
            var screenWidth = window.screen.width
            var left = screenWidth * (0.125 - 0.005 * data.length)
            var top = screenHeight * (0.125 - 0.005 * data.length)
            console.log(left)
            for (var i = 0; i < data.length; ++i) {
                newWindowList.push(new NewWindow({
                        urlParam: '?disputeId=' + data[i].disputeId,
                        title: data[i].disputeId + '&' + (new Date().getTime()),
                        importCSSList : [ctx + '/static/layui/css/modules/layim/layim.css'],
                        importJSList: [],
                        scriptBoxList: ['showDisputeDetailJS'],
                        htmlBoxList: ['paypal_dispute_detail_pop'],
                        paramList: {},
                        btn: ['处理','关闭'],
                        originData: data[i],
                        screenX: left + screenWidth * 0.005 * i,
                        screenY: top + screenHeight * 0.005 * i
                    })
                )
                newWindowList[i].pop()
            }
            layer.close(index)
        })
    })

    //工具条的监听事件,table.on(tool(表格的lay-filter的值))
    table.on('tool(paypalDisputeTab)', function (obj) {
        var data = obj.data, //获得当前行数据
            layEvent = obj.event; //获得 lay-event 对应的值

        if (layEvent == 'detail') {
            var newWindow = new NewWindow({
                url: 'disputeDetail.html?disputeId=' + data.disputeId,
                title: data.disputeId + '&' + (new Date().getTime()),
                importCSSList : [ctx + '/static/layui/css/modules/layim/layim.css'],
                importJSList: [],
                scriptBoxList: ['showDisputeDetailJS'],
                htmlBoxList: ['paypal_dispute_detail_pop'],
                paramList: {},
                btn: ['处理','关闭'],
                originData: data
            })
            newWindow.pop()
        } else if (layEvent == 'markRead'){
            var Adata = {idList : [data.id]}
            layer.confirm('确认标记这个纠纷为已读吗?',['确认','取消'],
                function () {
                    loading.show()
                    $.ajax({
                        type: 'POST',
                        url: ctx + "/sysPaypalDispute/markMessageHasRead.html",
                        data: JSON.stringify(Adata),
                        contentType: 'application/json',
                        dataType: 'json',
                        success: function (res) {
                            if (res.code == '0000') {
                                searchForpaypalDispute(true)
                                layer.msg('标记成功')
                            } else {
                                layer.msg(res.msg)
                            }
                        },
                        complete: function (XMLHttpRequest, status)
                        {
                            loading.hide()
                            if (status == 'timeout') {//超时,status还有success,error等值的情况
                                layer.msg('正在向paypal请求中，请稍后刷新查看')
                            }
                        }
                    })
                })
        }
    });

});