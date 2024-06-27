// 定义全局查询函数，以便模板引擎调用，如果直接预编译定义，将调用不到
var queryPage_accountManage,queryByIcon_paypalAccountManage,changeOrderBy
//
layui.use(['admin', "table", 'form','formSelects', 'laydate'], function() {
    var $ = layui.$,
        admin = layui.admin,
        element = layui.element,
        table = layui.table,
        form = layui.form,
        laydate = layui.laydate,
        formSelects = layui.formSelects,
        router = layui.router();
    form.render(null, "component-form-group");
    formSelects.render('belongsCompany_accountManage');
    formSelects.render('ebayStoreId_accountManage');
    formSelects.render('responsorId_accountManage');
    formSelects.render('type_accountManage');
    laydate.render({
        elem: '#noteUpdateTime_accountManage',
        range: true
    })
    queryPage_accountManage = function(obj) {
        var data = {
            orderBy: 'primary_email_id desc'
        }
        if (obj) {
            $.extend(data, obj);
        }
        var now = new Date()
        var nowmilliSecond = now.getTime()
        table.render({
            elem: "#table_accountManage",
            method: 'post',
            url: ctx + "/sysPaypalEmail/getSysPaypalEmails.html",
            //contentType: 'application/json',
            where: data,
            cols: [
                [
                    { type: "checkbox", width: 30 },
                    { field: "paypalEmail", title: "paypal邮箱", width: 100,templet: '#paypalEmailTemp_accountManage'},
                    { field: "belongsCompany", title: "公司", width: 75 },
                    // { title: "关联邮箱",templet: "#subEmailTab_accountManage", width: 200 },
                    { field: 'usd', title: `USD<span class="sortBox_accountmanage"><i class="layui-icon layui-icon-up sortIcon_accountmanage" onclick="changeOrderBy(this)" data-field="usd" data-sort="asc">&#xe619;</i><i class="layui-icon layui-icon-down sortIcon_accountmanage" onclick="changeOrderBy(this)" data-field="usd" data-sort="desc">&#xe61a;</i> </span>`, width: 75 },
                    { field: 'gbp', title: `GBP<span class="sortBox_accountmanage"><i class="layui-icon layui-icon-up sortIcon_accountmanage" onclick="changeOrderBy(this)" data-field="gbp" data-sort="asc">&#xe619;</i><i class="layui-icon layui-icon-down sortIcon_accountmanage" onclick="changeOrderBy(this)" data-field="gbp" data-sort="desc">&#xe61a;</i> </span>`, width: 75 },
                    { field: 'eur', title: `EUR<span class="sortBox_accountmanage"><i class="layui-icon layui-icon-up sortIcon_accountmanage" onclick="changeOrderBy(this)" data-field="eur" data-sort="asc">&#xe619;</i><i class="layui-icon layui-icon-down sortIcon_accountmanage" onclick="changeOrderBy(this)" data-field="eur" data-sort="desc">&#xe61a;</i> </span>`, width: 75 },
                    { field: 'aud', title: `AUD<span class="sortBox_accountmanage"><i class="layui-icon layui-icon-up sortIcon_accountmanage" onclick="changeOrderBy(this)" data-field="aud" data-sort="asc">&#xe619;</i><i class="layui-icon layui-icon-down sortIcon_accountmanage" onclick="changeOrderBy(this)" data-field="aud" data-sort="desc">&#xe61a;</i> </span>`, width: 75 },
                    { field: 'cad', title: `CAD<span class="sortBox_accountmanage"><i class="layui-icon layui-icon-up sortIcon_accountmanage" onclick="changeOrderBy(this)" data-field="cad" data-sort="asc">&#xe619;</i><i class="layui-icon layui-icon-down sortIcon_accountmanage" onclick="changeOrderBy(this)" data-field="cad" data-sort="desc">&#xe61a;</i> </span>`, width: 75 },
                    { field: 'totalBalance', title: `总余额$<span class="sortBox_accountmanage"><i class="layui-icon layui-icon-up sortIcon_accountmanage" onclick="changeOrderBy(this)" data-field="total_balance" data-sort="asc">&#xe619;</i><i class="layui-icon layui-icon-down sortIcon_accountmanage" onclick="changeOrderBy(this)" data-field="total_balance" data-sort="desc">&#xe61a;</i> </span>`
                        , width: 100
                        ,templet: function(res){
                        return '<div onmouseenter="showTip(`'+ (res.balanceUpdateTime ? ('更新时间: ' + Format(res.balanceUpdateTime,'yyyy-MM-dd hh:mm:ss')) : '') + '`,this)" onmouseleave="removeTip(this)"><em>'+ (res.totalBalance != null ? res.totalBalance : '' ) +'</em></div>'
                    }},
                    { field: 'remainAmt', title: `<span title='单击表格数据可修改'>留存额$</span><span class="sortBox_accountmanage"><i class="layui-icon layui-icon-up sortIcon_accountmanage" onclick="changeOrderBy(this)" data-field="remain_amt" data-sort="asc">&#xe619;</i><i class="layui-icon layui-icon-down sortIcon_accountmanage" onclick="changeOrderBy(this)" data-field="remain_amt" data-sort="desc">&#xe61a;</i> </span>`
                        ,edit: 'text', width: 100
                        ,templet: function(res){
                            return '<div onmouseenter="showTip(`'+ (res.remainUpdateTime ? ('更新时间: ' + Format(res.remainUpdateTime,'yyyy-MM-dd hh:mm:ss')) : '') + '`,this)" onmouseleave="removeTip(this)"><em>'+ (res.remainAmt != null ? res.remainAmt : '' ) +'</em> <i class="layui-icon layui-icon-edit" style="color: #009688">&#xe642;</i> </div>'
                        }
                    },
                    { title: "纠纷同步", templet:'#syncResult_accountManage', width: 75 },
                    { field: "responsor", title: "负责人", width: 75 },
                    { field: "type", title: "类型", width: 75 },
                    { field: "note", title: "备注", templet: function (res) {
                        return `<div onmouseenter="showTip('` + (res.noteUpdateTime ? ('更新时间: ' + Format(res.noteUpdateTime,'yyyy-MM-dd hh:mm:ss')) : '') + (res.lastOperTime ? (' 日志更新: ' + Format(res.lastOperTime,'yyyy-MM-dd hh:mm:ss')) : '') + `',this)" onmouseleave="removeTip(this)"><em>` + (res.note || '&nbsp;') + `</em></div>`
                            + `<div  onmouseenter="showTip('` + (res.restrictTime ? ('限制开始时间: ' + Format(res.restrictTime,'yyyy-MM-dd hh:mm:ss') + ',至今已' + ((nowmilliSecond - res.restrictTime)/ 86400000).toFixed(2) + '天') : '') + `',this)" onmouseleave="removeTip(this)" class="fontRed">` + (res.balanceSyncFailMsg || '') + `</div>`
                    }},
                    {title: '操作', align: 'center', toolbar: '#paypalAccountManage_bar', width: 100}
                ],
            ],
            id: "table_accountManage",
            page: true,
            limits: [100, 500, 1000],
            limit: 100,
            done: function(res, curr, count) {
                $("#sSkuNum").html(count);
                //懒加载
                imageLazyload();
                // 统计各状态数据
                $('#statusIcon_paypalAccountManage li span').text('')
                countForEveryStatus_paypalAccountManage()

                // 增加table底边距，以便操作按钮展示
                $('.accountManage_table_head>.layui-table-view .layui-table-body table').css('margin-bottom','110px')
                // 初始化排序色
                var originFiled = $('form[name=searchForm_accountManage] [name=orderByFiled]').val()
                var originType = $('form[name=searchForm_accountManage] [name=orderByType]').val()
                if (originFiled) {
                    $('.sortIcon_accountmanage[data-field='+ originFiled+'][data-sort='+ originType +']').css('color','#000')
                }
            }
        });
    }

    changeOrderBy = function (self) {
        // 将其他 变更排序的图标置为灰色
        $('.sortIcon_accountmanage').css('color','grey')

        // 获取原排序信息
        var originFiled = $('form[name=searchForm_accountManage] [name=orderByFiled]').val()
        var originType = $('form[name=searchForm_accountManage] [name=orderByType]').val()
        //获取当前点击排序信息
        var clickFiled = $(self).attr('data-field')
        var clickType = $(self).attr('data-sort')
        $('form[name=searchForm_accountManage] [name=orderByFiled]').val(clickFiled)
        if (clickFiled != originFiled) {    // 如果排序字段未变。重复点击，则变更排序方法
            $('form[name=searchForm_accountManage] [name=orderByType]').val(clickType)
            $(self).css('color','#000')
        } else {
            var sortType
            if (originType == 'asc') {
                sortType = 'desc'
            } else{
                sortType = 'asc'
            }
            $('form[name=searchForm_accountManage] [name=orderByType]').val(sortType)
            $('.sortIcon_accountmanage[data-field='+ clickFiled+'][data-sort='+ sortType +']').css('color','#000')
        }
        var data = getSearchData()
        data.orderBy = 't2.' + $('form[name=searchForm_accountManage] [name=orderByFiled]').val() + ' ' + $('form[name=searchForm_accountManage] [name=orderByType]').val()
        queryPage_accountManage(data)
    }
    function countForEveryStatus_paypalAccountManage() {
        var data = getSearchData()
        data.acctStatus = null
        $.ajax({
            type: 'post',
            dataType: 'json',
            url: ctx + "/sysPaypalEmail/countForEveryStatus.html",
            data: data,
            success: function (res) {
                if (res.code == '0000') {
                    var map = res.data
                    var resJson = {}
                    var total = 0
                    for (var i = 0; i < map.length; ++i) {
                        resJson[map[i].acct_status + ''] = map[i].num
                        total += map[i].num
                    }
                    var allStatusIconLi = $('#statusIcon_paypalAccountManage li')
                    var spanJson = {}
                    for (var i = 0; i < allStatusIconLi.length; ++i) {
                        $(allStatusIconLi[i]).find('span').text(resJson[allStatusIconLi[i].getAttribute('data-code')] || 0)
                    }
                    $($('#statusIcon_paypalAccountManage li')[0]).find('span').text(total)
                }
            }
        })
    }
    
    queryByIcon_paypalAccountManage = function (self) {
        $('form[name=searchForm_accountManage] [name=acctStatus]').val(self.getAttribute('data-code'))
        var data = getSearchData()
        queryPage_accountManage(data)
    }

    var active_paypal_accountManage = {
        reload: function(data) {
            //执行重载
            table.reload('table_accountManage', {
                method: 'post',
                where: data
            });
        }
    }

    table.on('edit(table_accountManage)', function(obj){
        var value = obj.value //得到修改后的值
            ,data = obj.data //得到所在行所有键值
            ,field = obj.field; //得到字段
        if (value == '' || isNaN(value)) {
            // 如果数据不正确。则重载页面
            layer.msg('请填写正确的数字')
            var data = getSearchData()
            active_paypal_accountManage.reload(data)
            return
        }
        var ajax = new Ajax()
        if (field == 'remainAmt') {
            var Adata = {
                id: data.id,
                remainAmt: data.remainAmt
            }
            ajax.post({
                url: ctx + "/sysPaypalEmail/updateRemainAmt.html",
                data: JSON.stringify(Adata),
                contentType: 'application/json',
                success: function (data) {
                    if (data.code == '0000') {
                        layer.msg('修改成功')
                    }
                }
            })
        }

    })

    // 初始化页面
    queryPage_accountManage()

    // 初始化标签
    // initSelectIcon(form, 'COMPANY_NAME', 'form[name=searchForm_accountManage] [name=companyName]')

    //新增paypal账号弹框
    $('#add_paypal').click(function() {
        var ifAdd = false
        var index = admin.popup({
            type: 1,
            title: '新增paypal',
            content: $('#add_paypal_layer').html(),
            area: ['40%', '75%'],
            btn: ['保存', '关闭'],
            success: function(layero, index) {
                initNotNull('form[name=addOrEditPaypalAcctForm]')
                $('form[name=addOrEditPaypalAcctForm] input[name=paypalEmail]').removeAttr('readonly')
                form.render('select');
            },
            yes: function () {
                if (!checkNotNull("form[name=addOrEditPaypalAcctForm]")) {
                    return
                }
                var data = serializeObject($('form[name=addOrEditPaypalAcctForm]'))
                data.responsor = $("form[name=addOrEditPaypalAcctForm] [name=responsorId] option:selected").text()
                var ajax = new Ajax()
                ajax.post({
                    url: ctx + "/sysPaypalEmail/addWithChildren.html",
                    data: JSON.stringify(data),
                    contentType: 'application/json',
                    success: function (data) {
                        if (data.code == '0000') {
                            layer.msg('新增成功')
                            ifAdd = true
                            $('form[name=addOrEditPaypalAcctForm] [name=paypalEmail]').val('')
                        }
                    }
                })
            },
            end: function () {
                if (ifAdd) {
                    $('#searchPaypalBtn_accM').trigger('click')
                }
            }
        })
    });

    // 搜索
     $('#searchPaypalBtn_accM').click(function() {
         var data = getSearchData()
         queryPage_accountManage(data)
     })

    function getSearchData() {
        var status = $('form[name=searchForm_accountManage] [name=status]').val()
        var data =  serializeObject($('form[name=searchForm_accountManage]'))
        if (status == '0') {
            data.status = false
        } else if (status == '1'){
            data.status = true
        }
        if (data.timeType == '1') {
            data.noteUpdateTimeStr = data.timeStr
        } else if (data.timeType == '2') {
            data.lastOperTimeStr = data.timeStr
        }
        return data
    }

    $("#resetBtn_account").click(function () {
        $("form[name=searchForm_accountManage] [name]:not(.hiddenContent)").val('')
        form.render('select')
    })

    table.on('tool(table_accountManage)', function(obj) {
        var layEvent = obj.event; //获得 lay-event 对应的值
        var data = obj.data; //获得当前行数据
        if (layEvent == 'edit') {
            var index = layer.open({
                type: 1,
                title: '修改paypal',
                content: $('#add_paypal_layer').html(),
                area: ['40%', '75%'],
                btn: ['保存', '关闭'],
                success: function(layero, index) {
                    initNotNull('form[name=addOrEditPaypalAcctForm]')
                    $("form[name=addOrEditPaypalAcctForm] [name=paypalEmail]").val(data.paypalEmail)
                    $("form[name=addOrEditPaypalAcctForm] [name=type]").val(data.type)
                    $("form[name=addOrEditPaypalAcctForm] [name=responsorId]").val(data.responsorId)
                    $("form[name=addOrEditPaypalAcctForm] [name=belongsCompany]").val(data.belongsCompany)
                    $("form[name=addOrEditPaypalAcctForm] [name=note]").val(data.note)
                    $("form[name=addOrEditPaypalAcctForm] [name=bankNo]").val(data.bankNo)

                    form.render('select')
                },
                yes: function () {
                    if (!checkNotNull("form[name=addOrEditPaypalAcctForm]")) {
                        return
                    }
                    var Adata = serializeObject($('form[name=addOrEditPaypalAcctForm]'))
                    Adata.id = data.id
                    Adata.responsor = $("form[name=addOrEditPaypalAcctForm] [name=responsorId] option:selected").text()
                    var ajax = new Ajax()
                    ajax.post({
                        url: ctx + "/sysPaypalEmail/updateChildren.html",
                        data: JSON.stringify(Adata),
                        contentType: 'application/json',
                        success: function (data) {
                            if (data.code == '0000') {
                                layer.msg('操作成功')
                                reRenderPage()
                                layer.closeAll();
                            }
                        }
                    })
                }
            })
        } else if (layEvent == 'delete') {
            deletePaypalAcctList([data.id])
        } else if (layEvent == 'setPayAble') {
            setAcctPayAble_paypalAcct([data.id],1)
        } else if (layEvent == 'setDisPayAble') {
            setAcctPayAble_paypalAcct([data.id],0)
        } else if (layEvent == 'auth') {
            layer.open({
                type: 1,
                title: "paypal账号授权",
                area: ["50%", "70%"],
                shadeClose: false,
                content: $("#auth_paypal_pop").html(),
                btn: ['授权', '关闭'],
                success: function (layero, index) {
                    $('#authPaypalForm [name=paypalAcctId]').val(data.id)
                    $('#authPaypalForm [name=paypalAcct]').val(data.primaryEmail)
                    initNotNull('#authPaypalForm');
                },
                yes: function () {
                    if (!checkNotNull('#authPaypalForm')) {
                        return
                    }
                    layer.confirm('确认对账号' + $('#authPaypalForm [name=paypalAcct]').val() + '进行授权？',{btn:['确认','取消']},function () {
                        var Adata = {
                            paypalAcctId: $('#authPaypalForm [name=paypalAcctId]').val(),
                            client_id: $('#authPaypalForm [name=client_id]').val(),
                            secret: $('#authPaypalForm [name=secret]').val()
                        }
                        loading.show()
                        $.ajax({
                            url: ctx + '/sysPaypalDispute/getFirstAccessToken.html',
                            type: 'post',
                            dataType: 'json',
                            data: Adata,
                            success: function(res){
                                loading.hide()
                                if (res.code == '0000') {
                                    layer.closeAll();
                                    layer.msg('授权成功')
                                    reRenderPage()
                                } else {
                                    layer.msg(res.msg)
                                }
                            },
                            error: function () {
                                loading.hide()
                                layer.msg('服务器繁忙 请稍后再试')
                            }
                        })
                    })
                }
            })
        } else if (layEvent == 'able') {
            changeStatus([data.id],true)
        } else if (layEvent == 'disable') {
            changeStatus([data.id],false)
        } else if (layEvent == 'updateAcctStatus') {
            var idList = [data.id]
            popToUpdateAcctStatus(idList,data.acctStatus)
        } else if (layEvent == 'queryLog') {
            var popIndex = layer.open({
                type: 1,
                title: "paypal状态变更日志",
                area: ["50%", "70%"],
                shadeClose: false,
                content: $("#showLogPop_accountManage").html(),
                btn: ['关闭'],
                success: function (layero, index) {
                    var Adata = {
                        paypalAcctId : data.id
                    }
                    table.render({
                        elem: "#logTable_accountManage",
                        method: 'post',
                        url: ctx + "/sysPaypalEmail/queryLogByPaypalAcctId.html",
                        contentType: 'application/json',
                        where: Adata,
                        cols: [
                            [
                                { field: "paypalEmail", title: "时间",templet: "<div>{{format(d.createTime,'yyyy-MM-dd hh:mm:ss')}}</div>"},
                                { field: "creator", title: "操作人" },
                                { field: "operDesc", title: "操作详情" }
                            ],
                        ],
                        id: "logTable_accountManage",
                        page: false,
                        limits: [100, 200, 500],
                        limit: 100,
                    })
                }
            })
        }
    })
    // 停用/启用
    function changeStatus(idList,able) {
        var Adata = {
            idList: idList,
            status: able
        }
        var ajax = new Ajax(true)
        ajax.post({
            url: ctx + "/sysPaypalEmail/changeStatus.html",
            data: JSON.stringify(Adata),
            contentType: 'application/json',
            success: function (data) {
                if (data.code == '0000') {
                    reRenderPage()
                }
            }
        })
    }
    // 变更paypal状态
    function popToUpdateAcctStatus(idList,originStatus) {
        var popIndex = layer.open({
            type: 1,
            title: "修改paypal状态",
            area: ["25%", "40%"],
            shadeClose: false,
            content: $("#updateAcctStatusPop_accountManage").html(),
            btn: ['确定', '关闭'],
            success: function (layero, index) {
                if (originStatus != null) {
                    $('#updateAcctStatusForm_accountManage [name=acctStatus]').val(originStatus)
                }
                form.render('select','updateAcctStatusForm_accountManage')
            },
            yes: function () {
                var data = {
                    idList: idList,
                    acctStatus: $('#updateAcctStatusForm_accountManage [name=acctStatus]').val()
                }
                loading.show()
                $.ajax({
                    url: ctx + '/sysPaypalEmail/updateAcctStatus.html',
                    type: 'post',
                    dataType: 'json',
                    contentType: 'application/json',
                    data: JSON.stringify(data),
                    success: function (res) {
                        loading.hide()
                        if (res.code == '0000') {
                            layer.msg('修改成功')
                            layer.close(popIndex)
                            reRenderPage()
                        } else {
                            layer.msg(res.msg)
                        }
                    },
                    complete: function () {
                        loading.hide()
                    }
                })
            }})
    }
    // 将账号设为可付/不可付
    function setAcctPayAble_paypalAcct(idList,ifPayAble) {
        var Adata = {
            idList: idList,
            ifPayAble: ifPayAble
        }
        var tip = ifPayAble ? '确认将该paypal账号设为打款付款账号吗' : '确认取消该账号的付款权限吗';
        var confirmIndex = layer.confirm( tip, ['确认','取消'],
        function () {
            var ajax = new Ajax()
            ajax.post({
                url: ctx + "/sysPaypalEmail/updAcctPayAble.html",
                data: JSON.stringify(Adata),
                contentType: 'application/json',
                success: function (data) {
                    if (data.code == '0000') {
                        layer.msg('操作成功')
                        layer.close(confirmIndex)
                        reRenderPage()
                    }
                }
            })
        })
    }
    // 删除账号
    function deletePaypalAcctList(idList) {
        var Adata = {
            idList: idList
        }
        var confirmIndex = layer.confirm('确认删除这些paypal账号吗？',['确认','取消'],
            function () {
                var ajax = new Ajax()
                ajax.post({
                    url: ctx + "/sysPaypalEmail/delGroup.html",
                    data: JSON.stringify(Adata),
                    contentType: 'application/json',
                    success: function (data) {
                        if (data.code == '0000') {
                            layer.msg('操作成功')
                            reRenderPage()
                            layer.close(confirmIndex)
                        } else {
                            layer.msg(data.msg)
                        }
                    }
                })
            }
        )
    }

    // 批量启用
    $('#ableStatusByListBtn').click(function () {
        var selectData = getSelectPaypal()
        var idList = []
        for(var i = 0; i < selectData.length; ++i) {
            idList.push(selectData[i].id)
        }
        if (idList.length == 0) {
            layer.msg('请选择paypal账号')
            return
        }
        changeStatus(idList,true)
    })
    // 批量停用
    $('#disableStatusByListBtn').click(function () {
        var selectData = getSelectPaypal()
        var idList = []
        for(var i = 0; i < selectData.length; ++i) {
            idList.push(selectData[i].id)
        }
        if (idList.length == 0) {
            layer.msg('请选择paypal账号')
            return
        }
        changeStatus(idList,false)
    })
    // 批量可付
    $('#payableByListBtn').click(function () {
        var selectData = getSelectPaypal()
        var idList = []
        for(var i = 0; i < selectData.length; ++i) {
            idList.push(selectData[i].id)
        }
        if (idList.length == 0) {
            layer.msg('请选择paypal账号')
            return
        }
        setAcctPayAble_paypalAcct(idList,1)
    })
    // 批量不可付
    $('#disPayableByListBtn').click(function () {
        var selectData = getSelectPaypal()
        var idList = []
        for(var i = 0; i < selectData.length; ++i) {
            idList.push(selectData[i].id)
        }
        if (idList.length == 0) {
            layer.msg('请选择paypal账号')
            return
        }
        setAcctPayAble_paypalAcct(idList,0)
    })
    // 批量删除
    $('#deleteByListBtn').click(function () {
        var selectData = getSelectPaypal()
        var idList = []
        for(var i = 0; i < selectData.length; ++i) {
            idList.push(selectData[i].id)
        }
        if (idList.length == 0) {
            layer.msg('请选择paypal账号')
            return
        }
        deletePaypalAcctList(idList)
    })
    // 批量修改paypal状态
    $('#updatePaypalStatusByListBtn').click(function () {
        var selectData = getSelectPaypal()
        var idList = []
        for(var i = 0; i < selectData.length; ++i) {
            idList.push(selectData[i].id)
        }
        popToUpdateAcctStatus(idList)
    })

    // 批量追加备注
    $('#addMoreNote_accountManage').click(function () {
        var selectData = getSelectPaypal()
        var idList = []
        for(var i = 0; i < selectData.length; ++i) {
            idList.push(selectData[i].id)
        }
        if (idList.length == 0) {
            layer.msg("请选择paypal账号")
            return
        }
        var popIndex = layer.open({//
            type: 1,
            title: "批量追加备注",
            area: ["500px", "500px"],
            shadeClose: false,
            content: $("#addMoreNotePop_accountManage").html(),
            btn: ['确认', '关闭'],
            success: function (layero, index) {

            },
            yes: function () {
                var note = $('#addMoreNoteForm_accountManage [name=note]').val()
                if (!note || !(note.trim())) {
                    layer.msg('请填写要追加的备注')
                    return
                }
                var data={
                    idList: idList,
                    note: note
                }
                $.ajax({
                    url: ctx + "/sysPaypalEmail/addMoreNote.html",
                    type: 'post',
                    data: JSON.stringify(data),
                    contentType: 'application/json',
                    dataType: 'json',
                    success: function (res) {
                        if (res.code == '0000') {
                            layer.close(popIndex)
                            layer.msg('操作成功')
                            reRenderPage()
                        } else {
                            layer.msg(res.msg)
                        }
                    }
                })
            }
        })
    })

    // 发送邮件
    $('#sendEmail_paypalAccountManage').click(function () {
        var objList = getSelectPaypal()
        var idList = []
        for (var i = 0; i < objList.length; ++i) {
            idList.push(objList[i].id)
        }
        if (idList.length == 0) {
            layer.msg('请选择要发送的数据')
            return
        }
        var Adata = {idList: idList}
        layer.open({
            type: 1,
            title: "发送邮件",
            area: ["700px", "250px"],
            shadeClose: false,
            content: $("#sendEmailPop_accountManage").html(),
            btn: ['确认', '关闭'],
            success: function (layero, index) {
            },
            yes: function () {
                var email = $('#toSendEmailArea').val()
                if (!email || !email.trim()) {
                    layer.msg('请填写目标邮箱')
                    return
                }
                email = email.replace(/，/g,',')
                var emailArr = email.split(',')
                var emailList = []
                for (var i = 0; i < emailArr.length; ++i) {
                    if (emailArr[i] && emailArr[i].trim()) {
                        emailList.push(emailArr[i])
                    }
                }
                Adata.targetEmailList = emailList
                var ajax = new Ajax()
                ajax.post({
                    url: ctx + "/sysPaypalEmail/sendEmail.html",
                    data: JSON.stringify(Adata),
                    contentType: 'application/json',
                    success: function (data) {
                        if (data.code == '0000') {
                            layer.msg('发送成功')
                        }
                    }
                })
            }
        })

    })



    // 批量更新余额点击事件
    $('#updateBalanceByListBtn').on('click', function () {
        var objList = getSelectPaypal()
        var idList = []
        for (var i = 0; i < objList.length; ++i) {
            idList.push(objList[i].id)
        }
        if (idList.length == 0) {
            layer.msg('请选择paypal账号')
            return
        }
        var data = {
            idList: idList
        }
        var ajax = new Ajax(true)
        ajax.post({
                url: ctx + "/sysPaypalEmail/updateBalanceByList.html",
                data: JSON.stringify(data),
                contentType: 'application/json',
                success: function (data) {
                    reRenderPage()
                },
                complete: function (XMLHttpRequest, status)
                {
                    if (status == 'timeout') {//超时,status还有success,error等值的情况
                        layer.msg('正在向paypal求证中，请稍后刷新查看')
                    }
                }
                })
    })

    // 批量同步纠纷
    $('#SyncDisputeByListBtn').click(function () {
        var objList = getSelectPaypal()
        var paypalAcctIdList = []
        var one
        for (var i = 0; i < objList.length; ++i) {
            if (!objList[i].expiresTime) {
                layer.msg('请先对选中的账号授权')
                return
            }
            paypalAcctIdList.push(objList[i].id)
        }
        var data = {
            paypalAcctIdList: paypalAcctIdList
        }
        if (data.paypalAcctIdList.length == 0) {
            layer.msg('请选择需要同步的邮箱')
            return
        }
        var ajax = new Ajax(true)
        loading.show()
        ajax.post({
            url: ctx + "/sysPaypalDispute/syncDisputeList.html",
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function (data) {
                reRenderPage()
            },
            complete: function (XMLHttpRequest, status) {
                loading.hide()
                if (status == 'timeout') {//超时,status还有success,error等值的情况
                    layer.msg('正在向paypal发起请求中，请稍后刷新查看')
                }
            }
        })
    })

    // 批量获取所选账号
    function getSelectPaypal() {
        var checkStatus = table.checkStatus('table_accountManage'),
            data = checkStatus.data;
        return data
    }

    // 导出
    $('#export_paypalAccountManage').click(function () {
        var objList = getSelectPaypal()
        var idList = []
        for (var i = 0; i < objList.length; ++i) {
            idList.push(objList[i].id)
        }
        if (idList.length == 0) {
            layer.msg('请选择要导出的邮箱')
            return
        }
        var data = {idList: idList}

        var Confirmindex = layer.confirm('确认导出所选邮箱信息？', { btn: ['确认', '取消'] }, function() {
            submitForm(data, ctx + '/sysPaypalEmail/exportEmailInfo.html')
            layer.close(Confirmindex);
        })
    })
    // 下载模板
    $('#downLoadTemplat_paypalAccountManage').click(function () {
        window.location.href = ctx + '/static/templet/updateRemainAmtTemplate.xlsx'
    })

    // 导入修改-点击
    $('#updateRemainAmtByExcelBtn_paypalAccountManage').click(function () {
        $('#updateRemainAmtByExcel_file').click()
    })
    // 导入修改-选择文件
    $('#updateRemainAmtByExcel_file').on('change', function() {
        var files = $('#updateRemainAmtByExcel_file')[0].files
        // 如果没有文件则终止
        if (files.length == 0) {
            return
        }
        // 校验文件类型
        var fileName = files[0].name
        var seat = fileName.lastIndexOf(".");
        var extension = fileName.substring(seat).toLowerCase();
        if (extension != '.xlsx' && extension != 'xls') {
            layer.msg('请传入后缀为.xlsx或者.xls 的Excel文件')
            return
        }
        var formData = new FormData();
        formData.append("file", files[0]);
        layer.confirm('确认导入这个文件进行批量修改商品信息吗', { btn: ['确认', '取消'] },
            function() {
                loading.show()
                $.ajax({
                    url: ctx + '/sysPaypalEmail/updateRemainAmtByExcel.html',
                    type: 'POST',
                    // async : false,
                    data: formData,
                    // 告诉jQuery不要去处理发送的数据
                    processData: false,
                    // 告诉jQuery不要去设置Content-Type请求头
                    contentType: false,
                    success: function(res) {
                        loading.hide()
                        $('#updateRemainAmtByExcel_file').val('')
                        if (res.code === '0000') {
                            layer.msg('修改成功')
                        } else {
                            layer.alert(res.msg)
                        }
                    },
                    error: function() {
                        loading.hide()
                        $('#updateRemainAmtByExcel_file').val('')
                    }
                });
            },
            function() {
                layer.closeAll()
            }
        )
    })

    // 店铺休假
    $('#setEbayStoreVacation').click(function () {
        var selectedPaypal = getSelectPaypal()
        var paypalEmail = []
        if (selectedPaypal.length == 0) {
            layer.msg('请选择paypal账号')
            return
        }
        for (var i = 0; i < selectedPaypal.length; ++i) {
            paypalEmail.push(selectedPaypal[i].paypalEmail)
        }

        var hideFixedPriceStoreItems = 0
        var acctIds = []
        var acctNames = []
        layer.open({
            type: 1,
            title: "店铺休假设置",
            area: ["600px", "500px"],
            shadeClose: false,
            content: $("#setStoreBreak_accountManage").html(),
            btn: ["保存", "关闭"],
            success: function (layero) {
                $.ajax({
                    type: "post",
                    url: ctx + "/sysPaypalEmail/getEbayStore.html",
                    dataType: "json",
                    contentType: "application/json",
                    data: JSON.stringify(paypalEmail),
                    success: function (res) {
                        if (res.code = '0000') {
                            if (res.data && res.data.length > 0) {
                                for(var i = 0; i <res.data.length; ++i) {
                                    acctIds.push(res.data[i].id)
                                    acctNames.push(res.data[i].storeAcct)
                                }
                                $('#ebayStoreNameBox_accountManage').text(acctNames.join(','))
                            } else {
                                layer.alert('所选的paypal账号，没有ebay店铺正在使用')
                            }
                        } else {
                            layer.msg(res.msg)
                        }
                    }
                })

                form.render()
                laydate.render({
                    elem: '#breakStartTime_accountManage',
                    type: 'datetime'
                });
                laydate.render({
                    elem: '#breakEndTime_accountManage',
                    type: 'date'
                });
                form.on('checkbox(hideFixedPriceStoreItems)', function (data) {
                    data.elem.checked ? hideFixedPriceStoreItems = 1 : hideFixedPriceStoreItems = 0
                });
            },
            yes: function (index, layero) {
                var sendData = {}
                sendData.endDate = $('#breakEndTime_accountManage').val()
                sendData.startTime = $('#breakStartTime_accountManage').val()
                sendData.showText = $('#showText_accountManage').val()
                sendData.hideFixedPriceStoreItems = $('#hideFixedPriceStoreItemsChecked').is(':checked') ? 1 : 0;
                sendData.storeAcctIds = acctIds
                loading.show()
                $.ajax({
                    type: "post",
                    url: ctx + "/ebayVacation/setEbayVacation.html",
                    dataType: "json",
                    contentType: "application/json",
                    data: JSON.stringify(sendData),
                    success: function (returnData) {
                        loading.hide()
                        if (returnData.code != "0000") {
                            layer.alert(returnData.msg, {icon: 2});
                        } else {
                            layer.msg(returnData.msg);
                        }
                    },
                    error: function (XMLHttpRequest) {
                        loading.hide()
                        if (XMLHttpRequest.status == 200) {
                            layer.msg("请重新登录", {icon: 7});
                        } else {
                            layer.msg("服务器错误");
                        }
                    }
                });
            }
        })
    })

    // 结束休假
    $('#overEbayStoreVacation').click(function () {
        var selectedPaypal = getSelectPaypal()
        var paypalEmail = []
        if (selectedPaypal.length == 0) {
            layer.msg('请选择paypal账号')
            return
        }
        for (var i = 0; i < selectedPaypal.length; ++i) {
            paypalEmail.push(selectedPaypal[i].paypalEmail)
        }

        var hideFixedPriceStoreItems = 0
        var acctIds = []
        var acctNames = []
        $.ajax({
            type: "post",
            url: ctx + "/sysPaypalEmail/getEbayStore.html",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(paypalEmail),
            success: function (res) {
                if (res.code = '0000') {
                    if (res.data && res.data.length > 0) {
                        for(var i = 0; i <res.data.length; ++i) {
                            acctIds.push(res.data[i].id)
                            acctNames.push(res.data[i].storeAcct)
                        }
                        layer.confirm('确定要结束以下ebay店铺的休假吗?  '+ acctNames.join(','), { icon: 3 }, function(index) {
                            layui.admin.load.show();
                            $.ajax({
                                type: "post",
                                url: ctx + "/ebayVacation/endEbayVacationStoreAcct.html",
                                dataType: "json",
                                contentType: "application/json",
                                data:JSON.stringify({storeAcctIds:acctIds}),
                                success: function(returnData) {
                                    layui.admin.load.hide();
                                    if (returnData.code != "0000") {
                                        layer.alert(returnData.msg, { icon: 2 });
                                    } else {
                                        layer.msg("结束休假成功");
                                        table.reload("ebayAcctTable");
                                    }
                                },
                                error: function(XMLHttpRequest) {
                                    layui.admin.load.hide();
                                    if (XMLHttpRequest.status == 200) {
                                        layer.msg("请重新登录", { icon: 7 });
                                    } else {
                                        layer.msg("服务器错误");
                                    }
                                }
                            });
                        });
                    } else {
                        layer.alert('所选的paypal账号，没有ebay店铺正在使用')
                    }
                } else {
                    layer.msg(res.msg)
                }
            }
        })
    })

    // 获取使用了 所选paypal 的 ebay店铺
    function getEbayStore(){

    }
});
// ----------------------------------layui-end

/**
 * 统计paypal下面的在线lisiting数量
 * @param obj
 */
function countSiteLisitingByPaypalEmail(obj){
    if(obj != null){
        layer.load(1); //上传loading
        var html='    <div class="layui-form-item" style="width: 60%;">\n' +
            '            <label class="layui-form-label">Paypal邮箱:</label>\n' +
            '        <div class="layui-input-block">';
        html+='<input type="text" id="ebay_paypal_email_input" class="layui-input" value="'+obj+'" readonly disabled>';
        html+=' </div> </div>  <table class="layui-table" id="ebay_show_site_lisiting_table"><thead><tr id="ebay_show_site_lisiting_table_tr">';
        $.ajax({
            type: "post",
            url: ctx + "/onlineProductEbay/countSiteLisitingByPaypalEmail.html?payPalEmail="+obj,
            dataType: "json",
            success: function(returnData) {
                layer.closeAll('loading'); //关闭loading
                if (returnData.code == "0000") {
                    var arr = ['<th>ebay账号</th>'];
                    var resultSiteList = returnData.data.resultSiteList;
                    var countList = returnData.data.countList;
                    for (var i = 0; i < resultSiteList.length; i++) {//这月有多少天
                        arr.push('<th>' + resultSiteList[i].siteName + '</th>')
                    }
                    html+=arr.join('')+'</tr></thead>';
                    html+='<tbody id="ebay_show_site_lisiting_table_tbody" style="text-align: center;">';
                    for (var i = 0; i < countList.length; i++) {
                        html += "<tr>";
                        var dataI = countList[i];
                        html += "<td>" + dataI.store_acct + "</td>";
                        for (var j = 0; j < resultSiteList.length; j++) {
                            var site = resultSiteList[j].site;
                            var siteCount = dataI[site] == null ? "" : dataI[site];
                            html += "<td>" + siteCount + "</td>";
                        }
                        html += "</tr>";
                    }
                    html+='</tbody></table>';
                    layer.open({
                        title: 'Paypal邮箱使用情况',
                        content: html,
                        offset: '100px',
                        area: '800px',
                    });
                } else {
                    layer.msg(returnData.msg, { icon: 0 });
                }
            }
        })

    }
}


