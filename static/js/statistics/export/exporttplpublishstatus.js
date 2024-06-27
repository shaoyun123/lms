layui.use(["layer", "form", "laydate", 'admin'], function() {
    var layer = layui.layer,
        admin = layui.admin,
        form = layui.form,
        $ = layui.$,
        laydate = layui.laydate;
    form.render();
    //时间渲染
    laydate.render({
        elem: '#searchTime_exporttplpublishstatus',
        range: true
    })

    // 类目选择按钮事件
    $("#ChooseCate_exporttplpublishstatus").click(function() {
        admin.itemCat_select('layer-work-develop-pl', 'cateInp-exporttplpublishstatus', 'cateDiv_exporttplpublishstatus');
    });

    // 导出采购订单
    $("#export_exporttplpublishstatus").click(function () {
        var data = serializeObject($('#searchForm_exporttplpublishstatus'))
        checkNull(data)
        // 必选平台
        if (!data.platCode) {
            layer.msg('请选择平台')
            return
        }
        // 必选时间
        if (!data.searchTime) {
            layer.msg('请选择时间，跨度不可超过3个月')
            return
        }
        var Confirmindex = layer.confirm('确认导出当前搜索条件下的刊登统计数据？', { btn: ['确认', '取消'] }, function() {
            loading.show()
            $.ajax({
                type: "post",
                url: ctx + "/commonExport/exportTplPublishCount.html",
                dataType: "json",
                contentType: "application/json;charset=utf-8",
                data: JSON.stringify(data),
                success: function(res) {
                    loading.hide()
                    layer.close(Confirmindex);
                    if (res.code == '0000') {
                        // 展示进度条
                        processBegin(ctx + "/fileExportProcess/getFileProcess.html",JSON.stringify(res.data),"文件导出中",1000,succReback_exporttplpublishstatus,failReback_exporttplpublishstatus,cancleReback_exporttplpublishstatus)
                    } else {
                        layer.msg(res.msg)
                    }
                }
            })
        }, function () {
            layer.close(Confirmindex);
        })
    })

    function succReback_exporttplpublishstatus(data) {
        // 查询文件是否已经准备完毕
        layer.open({
            title: '文件下载',
            type: 1, //不加该属性,就会出现[object Object]
            area: ['500px', '300px'],
            id: 'fileDownPop',
            btn: ['关闭'],
            content: $('#fileDownPop_exporttplpublishstatus').html(),
            success: function(index, layero) {
                loading.show()
                var times = 0;
                var interTime = 2000;
                freshFileStatus(data)
                function freshFileStatus(data) {
                    times++;
                    $.ajax({
                        type: "post",
                        url: ctx + "/fileExportProcess/getFileInfo.html",
                        dataType: "json",
                        contentType: "application/json;charset=utf-8",
                        data: data,
                        success: function(res) {
                            if (res.code === '0000') {
                                var pojo = res.data
                                if (pojo.fileStatus == 2) {
                                    loading.hide()
                                    $('#toDownFileBtn').click(function () {
                                        submitForm(JSON.parse(data), ctx + '/fileExportProcess/downFile.html')
                                    })
                                    $('#downTip').text('文件准备就绪,可以进行下载,或者稍后到文件下载页面进行下载')
                                    $('#toDownFileBtn').show()
                                } else if (pojo.fileStatus == 4) {
                                    layer.msg('文件生成失败')
                                } else {
                                    if (times < 30) {
                                        window.setTimeout(function () {
                                            freshFileStatus(data)
                                        },interTime)
                                    } else {
                                        layer.msg('文件生成时间过长，请稍后再文件下载页面进行下载')
                                    }
                                }
                            } else {
                                layer.msg(res.msg)
                            }
                        },
                        error: function () {
                            loading.hide()
                            layer.msg('服务繁忙，请稍后再文件下载页面下载该文件')
                        }
                    })
                }
            }
        })
    }
    function failReback_exporttplpublishstatus(data) {

    }
    function cancleReback_exporttplpublishstatus(data) {
        loading.show()
        $.ajax({
            type: "post",
            url: ctx + "/fileExportProcess/cancleFileExport.html",
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            data: data,
            success: function(res) {
                loading.hide()
                if (res.code == '0000') {
                    layer.msg('取消成功')
                } else {
                    layer.msg(res.msg)
                }
            }
        })
    }


});
