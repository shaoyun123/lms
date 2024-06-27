
var queryPage2_syncLog, active_syncLog
/**
 * time: 2018/01/02
 */
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
    $("#resetBtn_syncLog").click(function () {
        $("form[name=searchForm_syncLog] [name]:not(.hiddenContent)").val('')
        form.render('select')
    })

    //表格渲染结果
    function queryPage_syngLog(obj) {
        var data = {
            orderBy: 'id desc'
        }
        if (obj) {
            $.extend(data, obj);
        }
        table.render({
            elem: "#syncLogTab",
            method: "post",
            url: ctx + "/sysPaypalSyncLog/queryPage.html",
            where: data,
            contentType: 'application/json',
            done: function (res) {
            },
            cols: [
                [
                    //标题栏
                    {type: "checkbox"},
                    {field: 'createTime', title:'发起时间',  width: 130,templet: '<div>{{Format(new Date(d.createTime),"yyyy-MM-dd")}}</div>'},
                    {field: 'syncDate', title:'同步日期',  width: 130,templet: '<div>{{Format(new Date(d.syncDate),"yyyy-MM-dd")}}</div>'},
                    {field: "acct", title: "账号", width: 185},
                    {field: "acctType", title: "账号类型", width: 100},
                    {field: "syncType", title: "同步类型", width: 140},
                    {field: "syncItemNum", title: "成功条数", width: 100},
                    {field: "syncResult", title: "同步结果", width: 100, templet: '#syncResultTemplat'},
                    {field: "msg", title: "失败原因", width: '30%'},
                    {field: "isProc", title: "处理状态", width: 100, templet: '#isProcTemplat'},
                    //绑定工具条
                    {title: '操作', align: 'center', toolbar: '#syncLog_bar'}
                ],
            ],
            id: 'paypalSyncLogTab',
            page: true,
            limits: [100, 500, 1000],
            limit: 100,
            done:function(){
                // theadHandle().fixTh({id:'#synclogCard',h:'200',dv4:'.tab_box',i:80});
                $('#syncLogTab').next('.layui-table-view').find('.layui-table-header').addClass('toFixedContain')
            }
        });
    }

    // 表格数据重载
    active_syncLog = {
        reload: function(data){
            //执行重载
            table.reload('paypalSyncLogTab', {
                page: {
                    curr: 1 //重新从第 1 页开始
                }
                ,where: data
            });
        }
    }

    initSelect()
    function initSelect() {
        // 查询授权paypal账号
        var ajax = new Ajax()
        ajax.post({
            url: ctx + "/sysPaypalEmail/queryAuthPaypalEmailList.html",
            contentType: 'application/json',
            success: function (res) {
                if (res.code == '0000') {
                    var list = res.data
                    var obj
                    var paypalEmailSelect = $("form[name=searchForm_syncLog] [name=acct]")
                    for (var i = 0; i < list.length; ++i) {
                        obj = $('<option value="' + list[i].paypalEmail + '">' + list[i].paypalEmail + '</option>')
                        paypalEmailSelect.append(obj)
                    }

                    form.render('select')
                }
            }
        })
    }
    
    //初始化2个日期框
    laydate.render({
        elem: '#beginDate_syncLog',
        type: 'datetime'
    });
    laydate.render({
        elem: '#endDate_syncLog',
        type: 'datetime'
        ,ready: function () {
          $(".layui-laydate-footer [lay-type='datetime'].laydate-btns-time").click();
          $(".laydate-main-list-0 .layui-laydate-content li ol li:last-child").click();
          $(".layui-laydate-footer [lay-type='date'].laydate-btns-time").click();
         }
    });
    // 搜索
    function tosearch(ifReload) {
        var data ={
            acct : $('form[name=searchForm_syncLog] [name=acct]').val(),
            acctType : 'paypal',
            syncResult : $('form[name=searchForm_syncLog] [name=syncResult]').val(),
            beginDate : $('form[name=searchForm_syncLog] #beginDate_syncLog').val(),
            endDate : $('form[name=searchForm_syncLog] #endDate_syncLog').val(),
            isProc: $('form[name=searchForm_syncLog] [name=isProc]').val()
        }

        if (ifReload) {
            active_syncLog.reload(data)
        } else {
            queryPage_syngLog(data)
        }
        checkNull(data)
        countNum(data)
    }

    // 搜索点击
    $('#searchPaypalBtn_syncLog').click(function () {
        tosearch(true)
    })

    // 初始化列表
    tosearch()

    //Tab 搜索
    queryPage2_syncLog = function (isProc) {
        console.log('isproc: ' + isProc)
        isProc: $('form[name=searchForm_syncLog] [name=isProc]').val(isProc)
        tosearch(true)
    }

    // 统计数量
    function countNum(data) {
        var ajax = new Ajax()
        ajax.post({
            url: ctx + "/sysPaypalSyncLog/count.html",
            data: JSON.stringify(data),// 统计未核单
            contentType: 'application/json',
            success: function (res) {
                if (res.code == '0000') {
                    $('#waitProc').text(res.data.waitProcNum)
                    $('#hadProc').text(res.data.hadProcNum)
                    $('#total_paypalSync').text(res.data.total)
                }
            }
        })
    }

    // 批量重新同步按钮绑定
    $('#reSyncByList_paypal').click(function () {
        var checkStatus = table.checkStatus('paypalSyncLogTab')
            ,data = checkStatus.data;
        var idList = []
        for (var i = 0; i < data.length; ++i) {
            idList.push(data[i].id)
        }
        syncByList(idList)
    })

    // 批量重新同步
    function syncByList(list) {
        var data = {
            logIdList: list
        }
        var ajax = new Ajax(true)
        ajax.post({
            url: ctx + '/sysPaypalSyncLog/reSyncByList.html',
            data: JSON.stringify(data),
            success: function () {

            },
            complete: function (XMLHttpRequest, status) {
                if (status == 'timeout') {//超时,status还有success,error等值的情况
                    layer.msg("正在同步中，请稍后查看结果");
                }
                tosearch(true)
            }
        })
    }

    //工具条的监听事件,table.on(tool(表格的lay-filter的值))
    table.on('tool(syncLogTab)', function (obj) {
        var data = obj.data, //获得当前行数据
            layEvent = obj.event; //获得 lay-event 对应的值
        if (layEvent == 'reSync') {
            var idList = [data.id]
            syncByList(idList)
        } else if (layEvent == 'delLog'){
            var Adata = {
                idList : [data.id]
            }
            deleteLogByList(Adata)
        }
    });
    
    $('#deleteLogByListBtn_paypal').click(function () {
        layer.confirm('确认删除这些日志吗',{btn: ['确认', '取消']},
            function () {
                var checkStatus = table.checkStatus('paypalSyncLogTab'),
                    data = checkStatus.data
                var idList = []
                for (var i in data) {
                    idList.push('' + data[i].id)
                }
                var Adata ={
                    idList: idList
                }
                deleteLogByList(Adata)
            }, function () {
                layer.closeAll()
            })
    })

    function deleteLogByList(data) {
        if (!data.idList || data.idList.length ==0) {
            layer.msg('请选择要删除的日志')
            return
        }
        var ajax = new Ajax(false)
        ajax.post({
            url: ctx + '/sysPaypalSyncLog/delByList.html',
            data: JSON.stringify(data),
            success: function (res) {
                if (res.code == '0000') {
                    layer.msg('成功删除 ' + res.data + ' 条记录')
                    tosearch(true)
                } else {
                    layer.msg(res.msg)
                }
            }
        })
    }
    
    $('#specialSyncBtn').click(function () {
        layer.open({
            type: 1,
            title: "自定义同步账单",
            area: ["40%", "50%"],
            shadeClose: false,
            content: $("#special_sync_form").html(),
            btn: ['开始同步', '关闭'],
            success: function (layero, index) {
                $('#paypalSyncForm [name=acct]').html($('form[name=searchForm_syncLog] [name=acct]').html())
                $('#paypalSyncForm [name=acct] option')[0].text =''
                form.render('select')
                laydate.render({
                    elem: '#specail_sync_form_beginDate',
                    type: 'date'
                });
                laydate.render({
                    elem: '#specail_sync_form_endDate',
                    type: 'date'
                });
            },
            yes:function () {
                data = {
                    acct: $('#paypalSyncForm [name=acct]').val(),
                    transactionClass: $('#paypalSyncForm [name=transactionClass]').val(),
                    beginDate: $('#paypalSyncForm [name=beginDate]').val(),
                    inteval: $('#paypalSyncForm [name=inteval]').val() ? parseInt($('#paypalSyncForm [name=inteval]').val()): null,
                    endDate: $('#paypalSyncForm [name=endDate]').val()
                }
                if (!data.beginDate) {
                    layer.msg('请输入开始日期')
                    return
                }
                if (!data.endDate) {
                    layer.msg('请输入结束日期')
                    return
                }
                var ajax = new Ajax(true)
                ajax.post({
                    url: ctx + '/sysPaypalSyncLog/syncPaypalTransByMap.html',
                    data: JSON.stringify(data),
                    success: function (res) {
                    },
                    complete: function (XMLHttpRequest, status) {
                        if (status == 'timeout') {//超时,status还有success,error等值的情况
                           layer.msg('正在同步中，请稍后刷新查看')
                        }
                    }
                })
            }
        })
    })
});


