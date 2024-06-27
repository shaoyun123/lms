/**
 * time: 2019-04-10
 */

layui.use(["admin", "form", "table", "layer", "laytpl"], function () {
    var admin = layui.admin,
        form = layui.form,
        table = layui.table,
        layer = layui.layer,
        laytpl = layui.laytpl,
        element = layui.element,
        $ = layui.$;
    form.render('select');
    form.render('radio');
    form.render('checkbox');



    //表格渲染结果
    //展示已知数据
    table.render({
        elem: "#filedownTable",
        method: "post",
        url: ctx + "/fileExportProcess/queryFilePage.html",
        cols: [
            [
                //标题栏
                {type: "checkbox"},
                {field: "fileName", title: "文件名"},
                {field: "fileDiscipt", title: "文件描述"},
                {field: "downloadTimes", title: "下载次数"},
                { title: "创建时间", templet: '<div>{{format(d.createTime,"yyyy-MM-dd hh:mm:ss")}}</div>'},
                { title: "最后一次下载时间", templet: '<div>{{d.lastDowmloadTime ? format(d.lastDowmloadTime,"yyyy-MM-dd hh:mm:ss") : ""}}</div>'},
                { title: "到期时间", templet: '<div>{{d.preDestroyTime ? format(d.preDestroyTime,"yyyy-MM-dd hh:mm:ss") : ""}}</div>'},
                { title: "销毁时间", templet: '<div>{{d.destroyTime ? format(d.destroyTime,"yyyy-MM-dd hh:mm:ss") : ""}}</div>'},
                { title: "文件状态", templet: '#filedownStatusTpl'},
                //绑定工具条
                {title: '操作', align: 'center', toolbar: '#filedownTableBar'}
            ],
        ],
        done: function(res, curr, count){
            $("#filedownAccount_colLen").text(res.count);
            // 表头固定
            // theadHandle().fixTh({ id:'#filedownmanageCard',h:140 })
        },
        id: 'filedownTable',
        page: false, //是否显示分页
        limits: [100, 500, 1000],
        limit: 100, //每页默认显示的数量
    });

    // 搜索
    var active = {
        reload: function () {
            var data = {
                fileStatus : $("#filedownSearchForm [name='fileStatus']").val()
            }

            //执行重载
            table.reload('filedownTable', {
                where: data
            });
        }
    };

    $('#filedownSearch').click(function () {
        var type = $(this).data('type');
        active[type] ? active[type].call(this) : '';
    });

    $("#syncReceiveAddressBtn").click(function () {
        var checkStatus = table.checkStatus('filedownTable'),
            data = checkStatus.data;
        if (!data || data.length == 0) {
            layer.msg('请选择账号')
            return
        }
        var idList = []
        for (var i =0 ; i < data.length; ++i) {
            idList.push(data[i].id)
        }
        loading.show()
        $.ajax({
            url: ctx + '/filedown/toSyncAddress.html',
            type: 'post',
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify({idList: idList}),
            dataType: "json",
            success: function (res) {
                if (res.code == '0000') {
                    layer.msg("同步成功")
                } else {
                    layer.msg(res.msg)
                }
            },
            complete: function (XMLHttpRequest, status) {
                loading.hide()
                if (status == 'timeout') {//超时,status还有success,error等值的情况
                    layer.msg('正在向1688发起请求中，请稍后刷新查看')
                }
            }
        })
    })

    //工具条的监听事件,table.on(tool(表格的lay-filter的值))
    table.on('tool(filedownTable)', function (obj) {
        var data = obj.data, //获得当前行数据
            layEvent = obj.event; //获得 lay-event 对应的值

        var Adata = {
            fileId: data.id
        }
        if (layEvent === 'down') {
            submitForm(Adata, ctx + '/fileExportProcess/downFile.html')
        } else if (layEvent == 'del') {

        } else if (layEvent == 'cancle') {

        }
    });

});
